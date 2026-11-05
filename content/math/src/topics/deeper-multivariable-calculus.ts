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

// ---------------------------------------------------------------------------
// Second pass
// ---------------------------------------------------------------------------

/** helixShape picks a radius and pitch whose squares add to a perfect square. */
const helixShape = (rng: Rng) => {
  const [a, b, h] = rng.pick([
    [3, 4, 5],
    [5, 12, 13],
    [8, 15, 17],
    [6, 8, 10],
    [7, 24, 25],
    [20, 21, 29],
    [9, 12, 15],
  ]) as [number, number, number];
  return rng.pick([true, false]) ? { a, b, h } : { a: b, b: a, h };
};
/** matrix2 writes a two-by-two matrix by its rows. */
const matrix2 = (m: readonly (readonly number[])[]) =>
  `\\begin{pmatrix} ${m[0]?.[0]} & ${m[0]?.[1]} \\\\ ${m[1]?.[0]} & ${m[1]?.[1]} \\end{pmatrix}`;
/** powerOf writes a variable to a power, leaving out the exponent 1. */
const powerOf = (name: string, n: number) => (n === 1 ? name : `${name}^{${n}}`);
/** overSquare writes a squared variable over a square, leaving out the denominator 1. */
const overSquare = (name: string, a: number) => (a === 1 ? `${name}^2` : `\\frac{${name}^2}{${a * a}}`);
/** overNumber writes a variable over a number, leaving out the denominator 1. */
const overNumber = (name: string, a: number) => (a === 1 ? name : `\\frac{${name}}{${a}}`);

const helixLength: KnowledgePointDef = {
  id: "the-length-of-a-helix",
  title: t("The length of a helix", "螺旋线的长度"),
  explanation: t(
    "A circular helix has constant speed, because the circular part of its velocity has constant size and its vertical part is constant. So its arc length needs no real integration: it is the speed times the elapsed parameter. Unrolling the cylinder shows why, since the helix then becomes a straight line.",
    "圆柱螺旋线的速率是常数，因为速度的圆周部分大小不变，竖直部分也不变。所以它的弧长不需要真正积分：就是速率乘以参数的变化量。把圆柱面展开就能看出原因，这时螺旋线变成了一条直线。",
  ),
  generate(rng) {
    const { a, b, h } = helixShape(rng);
    const n = rng.int(1, 4);
    const top = n === 1 ? "2\\pi" : `${2 * n}\\pi`;
    const answer = 2 * n * h;
    return numberProblem({
      prompt: t(
        `The curve $\\mathbf{r}(t) = \\langle ${a}\\cos t, ${a}\\sin t, ${b}t \\rangle$ runs from $t = 0$ to $t = ${top}$. Its length is $c\\pi$. Find $c$.`,
        `曲线 $\\mathbf{r}(t) = \\langle ${a}\\cos t, ${a}\\sin t, ${b}t \\rangle$ 从 $t = 0$ 到 $t = ${top}$。它的长度是 $c\\pi$。求 $c$。`,
      ),
      answer,
      form: "integer",
      wrong: [2 * n * a, 2 * n * (a + b), n * h],
      solution: t(
        `The speed is $\\sqrt{${a}^2 + ${b}^2} = ${h}$ at every $t$. Multiplying by the elapsed $${top}$ gives the length $${answer}\\pi$.`,
        `速率在每个 $t$ 处都是 $\\sqrt{${a}^2 + ${b}^2} = ${h}$。乘以参数变化量 $${top}$，得长度 $${answer}\\pi$。`,
      ),
    });
  },
};

const pointAtArcLengthOnHelix: KnowledgePointDef = {
  id: "the-height-on-a-helix-after-a-given-arc-length",
  title: t("The height on a helix after a given arc length", "螺旋线上走过给定弧长后的高度"),
  explanation: t(
    "When the speed is a constant $v$, arc length measured from $t = 0$ is $s = vt$, so $t = \\frac{s}{v}$. Substituting this into the curve gives its parametrization by arc length. Any question about where a point has reached after travelling a set distance then becomes a matter of reading off a coordinate.",
    "速率是常数 $v$ 时，从 $t = 0$ 量起的弧长是 $s = vt$，所以 $t = \\frac{s}{v}$。把它代入曲线，就得到以弧长为参数的表示。这样，走过一段给定路程后到达哪里，就只是读出一个坐标的问题了。",
  ),
  generate(rng) {
    const { a, b, h } = helixShape(rng);
    const m = rng.int(1, 9);
    const s = h * m;
    const answer = b * m;
    return numberProblem({
      prompt: t(
        `A point moves along $\\mathbf{r}(t) = \\langle ${a}\\cos t, ${a}\\sin t, ${b}t \\rangle$ from $t = 0$ with $t$ increasing. What is its $z$-coordinate after it has travelled an arc length of ${s}?`,
        `一点沿 $\\mathbf{r}(t) = \\langle ${a}\\cos t, ${a}\\sin t, ${b}t \\rangle$ 从 $t = 0$ 出发，$t$ 不断增大。走过弧长 ${s} 后，它的 $z$ 坐标是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [b * s, a * m, s],
      solution: t(
        `The speed is ${h}, so $t = \\frac{${s}}{${h}} = ${m}$, and then $z = ${b} \\cdot ${m} = ${answer}$.`,
        `速率是 ${h}，所以 $t = \\frac{${s}}{${h}} = ${m}$，于是 $z = ${b} \\cdot ${m} = ${answer}$。`,
      ),
    });
  },
};

const helixCurvature: KnowledgePointDef = {
  id: "the-curvature-of-a-helix",
  title: t("The curvature of a helix", "螺旋线的曲率"),
  explanation: t(
    "With constant speed $v$, curvature is $\\kappa = \\frac{|\\mathbf{r}''|}{v^2}$. For the helix $\\langle a\\cos t, a\\sin t, bt \\rangle$ this gives $\\frac{a}{a^2 + b^2}$. Setting $b = 0$ recovers a circle of curvature $\\frac{1}{a}$. Raising the pitch stretches the curve out, and so the curvature falls.",
    "速率是常数 $v$ 时，曲率是 $\\kappa = \\frac{|\\mathbf{r}''|}{v^2}$。对螺旋线 $\\langle a\\cos t, a\\sin t, bt \\rangle$，得 $\\frac{a}{a^2 + b^2}$。令 $b = 0$，就回到曲率为 $\\frac{1}{a}$ 的圆。螺距增大时曲线被拉长，曲率随之减小。",
  ),
  generate(rng) {
    const shape = helixShape(rng);
    const scale = rng.int(1, 3);
    const a = shape.a * scale;
    const b = shape.b * scale;
    const h = shape.h * scale;
    const answer = Q.of(a, h * h);
    return numberProblem({
      prompt: t(
        `Find the curvature of the helix $\\mathbf{r}(t) = \\langle ${a}\\cos t, ${a}\\sin t, ${b}t \\rangle$.`,
        `求螺旋线 $\\mathbf{r}(t) = \\langle ${a}\\cos t, ${a}\\sin t, ${b}t \\rangle$ 的曲率。`,
      ),
      answer,
      wrong: [Q.of(1, a), Q.of(b, h * h), Q.of(a, h)],
      solution: t(
        `The speed is ${h}, and $|\\mathbf{r}''| = ${a}$. So $\\kappa = \\frac{${a}}{${h}^2} = ${answer.toLatex()}$.`,
        `速率是 ${h}，且 $|\\mathbf{r}''| = ${a}$。所以 $\\kappa = \\frac{${a}}{${h}^2} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const radiusAtParabolaVertex: KnowledgePointDef = {
  id: "the-radius-of-curvature-at-the-vertex-of-a-parabola",
  title: t("The radius of curvature at the vertex of a parabola", "抛物线顶点处的曲率半径"),
  explanation: t(
    "A graph has curvature $\\frac{|y''|}{(1 + y'^2)^{3/2}}$. At the vertex of a parabola the slope is zero, so the denominator is one and the curvature is simply $|y''|$. The circle that best fits the parabola there has the reciprocal of this as its radius, wherever the vertex happens to be located.",
    "函数图像的曲率是 $\\frac{|y''|}{(1 + y'^2)^{3/2}}$。在抛物线的顶点处斜率为零，所以分母为一，曲率就是 $|y''|$。无论顶点在哪里，这里最贴合抛物线的圆，半径都是这个值的倒数。",
  ),
  generate(rng) {
    const a = nonzero(rng, 9);
    const h = nonzero(rng, 5);
    const k = rng.int(-5, 5);
    const curve = poly([a, "x^2"], [-2 * a * h, "x"], [a * h * h + k, ""]);
    const size = Math.abs(a);
    const answer = Q.of(1, 2 * size);
    return numberProblem({
      prompt: t(`Find the radius of curvature of $y = ${curve}$ at its vertex.`, `求 $y = ${curve}$ 在顶点处的曲率半径。`),
      answer,
      wrong: [Q.of(1, size), Q.of(2 * size), Q.of(1, 4 * size)],
      solution: t(
        `At the vertex $y' = 0$, so the curvature is $|y''| = ${2 * size}$. The radius is its reciprocal, $${answer.toLatex()}$.`,
        `在顶点处 $y' = 0$，所以曲率是 $|y''| = ${2 * size}$。半径是它的倒数 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const divergenceOfRadialPower: KnowledgePointDef = {
  id: "the-divergence-of-a-radial-power-field",
  title: t("The divergence of a radial power field", "径向幂场的散度"),
  explanation: t(
    "For $\\rho = |\\mathbf{r}|$ the product rule gives $\\nabla \\cdot (\\rho^k\\mathbf{r}) = \\nabla(\\rho^k) \\cdot \\mathbf{r} + 3\\rho^k$. Since $\\nabla(\\rho^k) = k\\rho^{k-2}\\mathbf{r}$, this equals $(k + 3)\\rho^k$. So radial fields need no component work at all. The case $k = -3$ gives zero, which is the field of a point source.",
    "设 $\\rho = |\\mathbf{r}|$，由乘积法则得 $\\nabla \\cdot (\\rho^k\\mathbf{r}) = \\nabla(\\rho^k) \\cdot \\mathbf{r} + 3\\rho^k$。由于 $\\nabla(\\rho^k) = k\\rho^{k-2}\\mathbf{r}$，它等于 $(k + 3)\\rho^k$。所以径向场完全不必逐个分量计算。$k = -3$ 时结果为零，这就是点源的场。",
  ),
  generate(rng) {
    const [x, y, z, rho] = rng.pick([
      [1, 2, 2, 3],
      [2, 3, 6, 7],
      [1, 4, 8, 9],
      [2, 4, 4, 6],
      [4, 4, 7, 9],
      [2, 6, 9, 11],
    ]) as [number, number, number, number];
    const point = rng.pick([
      [x, y, z],
      [y, z, x],
      [z, x, y],
    ]);
    const k = rng.int(1, 3);
    const size = rho ** k;
    const answer = (k + 3) * size;
    return numberProblem({
      prompt: t(
        `Let $\\mathbf{F} = |\\mathbf{r}|${k === 1 ? "" : `^{${k}}`}\\,\\mathbf{r}$, where $\\mathbf{r} = \\langle x, y, z \\rangle$. Find $\\nabla \\cdot \\mathbf{F}$ at the point $(${point.join(", ")})$.`,
        `设 $\\mathbf{F} = |\\mathbf{r}|${k === 1 ? "" : `^{${k}}`}\\,\\mathbf{r}$，其中 $\\mathbf{r} = \\langle x, y, z \\rangle$。求 $\\nabla \\cdot \\mathbf{F}$ 在点 $(${point.join(", ")})$ 处的值。`,
      ),
      answer,
      form: "integer",
      wrong: [3 * size, k * size, (k + 3) * rho ** (k - 1)],
      solution: t(
        `Here $|\\mathbf{r}| = ${rho}$, and the divergence is $(${k} + 3)|\\mathbf{r}|${k === 1 ? "" : `^{${k}}`} = ${k + 3} \\cdot ${size} = ${answer}$.`,
        `这里 $|\\mathbf{r}| = ${rho}$，散度是 $(${k} + 3)|\\mathbf{r}|${k === 1 ? "" : `^{${k}}`} = ${k + 3} \\cdot ${size} = ${answer}$。`,
      ),
    });
  },
};

const curlOfRotation: KnowledgePointDef = {
  id: "the-curl-of-a-rigid-rotation",
  title: t("The curl of a rigid rotation", "刚体转动的旋度"),
  explanation: t(
    "A body rotating with angular velocity $\\boldsymbol{\\omega}$ has the velocity field $\\mathbf{v} = \\boldsymbol{\\omega} \\times \\mathbf{r}$. Its curl is $2\\boldsymbol{\\omega}$, at every point and in every direction. This is the physical meaning of curl: it measures twice the local rate of spin. A field written out in components can often be recognized in this form.",
    "以角速度 $\\boldsymbol{\\omega}$ 转动的物体，速度场是 $\\mathbf{v} = \\boldsymbol{\\omega} \\times \\mathbf{r}$。它的旋度在每一点都是 $2\\boldsymbol{\\omega}$。这就是旋度的物理意义：它度量局部转速的两倍。写成分量的场常常可以认出是这种形式。",
  ),
  generate(rng) {
    const p = nonzero(rng, 5);
    const q = nonzero(rng, 5);
    const s = nonzero(rng, 5);
    const which = rng.int(0, 2);
    const omega = [p, q, s][which] ?? p;
    const name = ["x", "y", "z"][which] ?? "x";
    const answer = 2 * omega;
    const F = `\\langle ${poly([q, "z"], [-s, "y"])},\\ ${poly([s, "x"], [-p, "z"])},\\ ${poly([p, "y"], [-q, "x"])} \\rangle`;
    return numberProblem({
      prompt: t(`Find the $${name}$-component of the curl of $\\mathbf{F} = ${F}$.`, `求 $\\mathbf{F} = ${F}$ 的旋度的 $${name}$ 分量。`),
      answer,
      form: "integer",
      wrong: [omega, -answer, 0],
      solution: t(
        `This field is $\\boldsymbol{\\omega} \\times \\mathbf{r}$ with $\\boldsymbol{\\omega} = \\langle ${p}, ${q}, ${s} \\rangle$, and its curl is $2\\boldsymbol{\\omega}$. The $${name}$-component is $${answer}$.`,
        `这个场是 $\\boldsymbol{\\omega} \\times \\mathbf{r}$，其中 $\\boldsymbol{\\omega} = \\langle ${p}, ${q}, ${s} \\rangle$，它的旋度是 $2\\boldsymbol{\\omega}$。$${name}$ 分量是 $${answer}$。`,
      ),
    });
  },
};

const paraboloidCap: KnowledgePointDef = {
  id: "the-volume-of-a-paraboloid-cap",
  title: t("The volume of a paraboloid cap", "抛物面帽的体积"),
  explanation: t(
    "A horizontal slice of the solid inside $z = a(x^2 + y^2)$ is a disk whose area grows linearly with height: at height $z$ it is $\\frac{\\pi z}{a}$. Integrating these areas gives a volume exactly half of the cylinder with the same base and height. Slicing is simpler here than integrating under the surface.",
    "$z = a(x^2 + y^2)$ 内部立体的水平截面是圆盘，面积随高度线性增长：高度 $z$ 处的面积是 $\\frac{\\pi z}{a}$。对这些面积积分，得到的体积恰好是同底同高圆柱的一半。这里用切片比在曲面下积分更简单。",
  ),
  generate(rng) {
    const a = rng.int(1, 6);
    const h = rng.int(1, 12);
    const answer = Q.of(h * h, 2 * a);
    return numberProblem({
      prompt: t(
        `The solid lies above $z = ${poly([a, "(x^2 + y^2)"])}$ and below the plane $z = ${h}$. Its volume is $c\\pi$. Find $c$.`,
        `立体在 $z = ${poly([a, "(x^2 + y^2)"])}$ 上方、平面 $z = ${h}$ 下方。它的体积是 $c\\pi$。求 $c$。`,
      ),
      answer,
      wrong: [Q.of(h * h, a), Q.of(h * h, 3 * a), Q.of(h, 2 * a)],
      solution: t(
        `At height $z$ the slice has area $\\frac{\\pi z}{${a}}$. Integrating from 0 to ${h} gives $\\frac{${h * h}\\pi}{${2 * a}}$, so $c = ${answer.toLatex()}$.`,
        `高度 $z$ 处的截面面积是 $\\frac{\\pi z}{${a}}$。从 0 到 ${h} 积分得 $\\frac{${h * h}\\pi}{${2 * a}}$，所以 $c = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const ellipticConeVolume: KnowledgePointDef = {
  id: "the-volume-of-an-elliptic-cone",
  title: t("The volume of an elliptic cone", "椭圆锥的体积"),
  explanation: t(
    "A horizontal slice of the cone $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = z^2$ at height $z$ is an ellipse with semi-axes $az$ and $bz$, and so with area $\\pi abz^2$. Integrating from the tip gives one third of the base area times the height, which is the same rule that holds for a circular cone.",
    "锥面 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = z^2$ 在高度 $z$ 处的水平截面是半轴为 $az$ 和 $bz$ 的椭圆，面积是 $\\pi abz^2$。从锥顶积分，得到底面积乘以高的三分之一，这与圆锥的规律相同。",
  ),
  generate(rng) {
    const a = rng.int(1, 6);
    let b = rng.int(1, 6);
    if (b === a) b = a === 6 ? 5 : a + 1;
    const h = rng.int(1, 6);
    const whole = a * b * h ** 3;
    const answer = Q.of(whole, 3);
    return numberProblem({
      prompt: t(
        `The solid is bounded by the cone $${overSquare("x", a)} + ${overSquare("y", b)} = z^2$ and the planes $z = 0$ and $z = ${h}$. Its volume is $c\\pi$. Find $c$.`,
        `立体由锥面 $${overSquare("x", a)} + ${overSquare("y", b)} = z^2$ 和平面 $z = 0$、$z = ${h}$ 围成。它的体积是 $c\\pi$。求 $c$。`,
      ),
      answer,
      wrong: [Q.of(whole), Q.of(a * b * h * h, 3), Q.of(whole, 2)],
      solution: t(
        `The top is an ellipse with semi-axes ${a * h} and ${b * h}, so its area is $${a * b * h * h}\\pi$. One third of this times the height ${h} gives $c = ${answer.toLatex()}$.`,
        `顶面是半轴为 ${a * h} 和 ${b * h} 的椭圆，面积是 $${a * b * h * h}\\pi$。它的三分之一乘以高 ${h}，得 $c = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const affineCommutator: KnowledgePointDef = {
  id: "affine-maps-do-not-commute",
  title: t("Affine maps do not commute", "仿射变换不可交换"),
  explanation: t(
    "Composing an affine map with a translation depends on the order. Translating first feeds the shift through the linear part of the map, while translating last simply adds the shift to the result. So $T(S(\\mathbf{x}))$ and $S(T(\\mathbf{x}))$ generally differ, and the difference is the image of the shift under the linear part minus the shift itself.",
    "仿射变换与平移的复合取决于顺序。先平移时，位移要经过变换的线性部分；后平移时，位移只是加到结果上。所以 $T(S(\\mathbf{x}))$ 和 $S(T(\\mathbf{x}))$ 一般不同，差就是位移在线性部分下的像减去位移本身。",
  ),
  generate(rng) {
    const a = nonzero(rng, 5);
    const b = nonzero(rng, 5);
    const c = nonzero(rng, 5);
    const d = nonzero(rng, 5);
    const e = nonzero(rng, 5);
    const f = nonzero(rng, 5);
    const p = nonzero(rng, 5);
    const q = nonzero(rng, 5);
    const answer = a * p + b * q - p;
    return numberProblem({
      prompt: t(
        `Let $S(x, y) = (${poly([1, "x"], [p, ""])}, ${poly([1, "y"], [q, ""])})$ and $T(x, y) = (${poly([a, "x"], [b, "y"], [e, ""])}, ${poly([c, "x"], [d, "y"], [f, ""])})$. Find the first coordinate of $T(S(0, 0)) - S(T(0, 0))$.`,
        `设 $S(x, y) = (${poly([1, "x"], [p, ""])}, ${poly([1, "y"], [q, ""])})$，$T(x, y) = (${poly([a, "x"], [b, "y"], [e, ""])}, ${poly([c, "x"], [d, "y"], [f, ""])})$。求 $T(S(0, 0)) - S(T(0, 0))$ 的第一个坐标。`,
      ),
      answer,
      form: "integer",
      wrong: [a * p + b * q, 0, answer + 2 * p],
      solution: t(
        `First, $T(${p}, ${q})$ has first coordinate $${a * p + b * q + e}$. Next, $T(0, 0) = (${e}, ${f})$, and $S$ sends it to first coordinate $${e + p}$. The difference is $${answer}$.`,
        `首先，$T(${p}, ${q})$ 的第一个坐标是 $${a * p + b * q + e}$。其次，$T(0, 0) = (${e}, ${f})$，$S$ 把它映到第一个坐标 $${e + p}$。差是 $${answer}$。`,
      ),
    });
  },
};

const derivativeOfComposition: KnowledgePointDef = {
  id: "an-entry-of-the-derivative-of-a-composition",
  title: t("An entry of the derivative of a composition", "复合映射导数的一个元素"),
  explanation: t(
    "The derivative of a composition is the matrix product of the derivatives, $D(g \\circ f)(\\mathbf{a}) = Dg(f(\\mathbf{a}))\\,Df(\\mathbf{a})$. This is the chain rule for maps between spaces of several dimensions. The order matters, since matrix multiplication does not commute, and the outer map's derivative is taken at the image point rather than at $\\mathbf{a}$.",
    "复合映射的导数是导数矩阵的乘积：$D(g \\circ f)(\\mathbf{a}) = Dg(f(\\mathbf{a}))\\,Df(\\mathbf{a})$。这就是高维空间之间映射的链式法则。顺序很重要，因为矩阵乘法不可交换，而外层映射的导数要在像点处取，而不是在 $\\mathbf{a}$ 处。",
  ),
  generate(rng) {
    const entry = () => nonzero(rng, 5);
    const Df = [
      [entry(), entry()],
      [entry(), entry()],
    ];
    const Dg = [
      [entry(), entry()],
      [entry(), entry()],
    ];
    const i = rng.int(0, 1);
    const j = rng.int(0, 1);
    const at = (m: number[][], row: number, column: number) => m[row]?.[column] ?? 0;
    const answer = at(Dg, i, 0) * at(Df, 0, j) + at(Dg, i, 1) * at(Df, 1, j);
    const reversed = at(Df, i, 0) * at(Dg, 0, j) + at(Df, i, 1) * at(Dg, 1, j);
    return numberProblem({
      prompt: t(
        `At a point $\\mathbf{a}$, $Df(\\mathbf{a}) = ${matrix2(Df)}$, and $Dg(f(\\mathbf{a})) = ${matrix2(Dg)}$. Find the entry of $D(g \\circ f)(\\mathbf{a})$ in row ${i + 1}, column ${j + 1}.`,
        `在点 $\\mathbf{a}$ 处，$Df(\\mathbf{a}) = ${matrix2(Df)}$，$Dg(f(\\mathbf{a})) = ${matrix2(Dg)}$。求 $D(g \\circ f)(\\mathbf{a})$ 第 ${i + 1} 行第 ${j + 1} 列的元素。`,
      ),
      answer,
      form: "integer",
      wrong: [reversed, at(Dg, i, j) * at(Df, i, j), at(Dg, i, j) + at(Df, i, j)],
      solution: t(
        `The derivative is the product with $Dg$ on the left. Row ${i + 1} of $Dg$ times column ${j + 1} of $Df$ gives $${inParens(at(Dg, i, 0))} \\cdot ${inParens(at(Df, 0, j))} + ${inParens(at(Dg, i, 1))} \\cdot ${inParens(at(Df, 1, j))} = ${answer}$.`,
        `导数是 $Dg$ 在左的乘积。$Dg$ 的第 ${i + 1} 行乘以 $Df$ 的第 ${j + 1} 列，得 $${inParens(at(Dg, i, 0))} \\cdot ${inParens(at(Df, 0, j))} + ${inParens(at(Dg, i, 1))} \\cdot ${inParens(at(Df, 1, j))} = ${answer}$。`,
      ),
    });
  },
};

const linearMaxOnTriangle: KnowledgePointDef = {
  id: "the-maximum-of-a-linear-function-on-a-triangle",
  title: t("The maximum of a linear function on a triangle", "线性函数在三角形上的最大值"),
  explanation: t(
    "A nonconstant linear function has no critical points, so its extreme values on a closed region lie on the boundary. Along each edge it is linear again, so the extremes move to the ends of the edge. On a polygon, then, only the vertices need checking. This is the central idea behind linear programming.",
    "非常值线性函数没有临界点，所以它在闭区域上的最值在边界上。沿每条边它仍是线性的，所以最值又移到了边的端点。因此在多边形上只需检查顶点。这正是线性规划的核心思想。",
  ),
  generate(rng) {
    const a = nonzero(rng, 6);
    const b = nonzero(rng, 6);
    const c = rng.int(-5, 5);
    const p = rng.int(1, 6);
    const q = rng.int(1, 6);
    const values = [c, c + a * p, c + b * q];
    const answer = Math.max(...values);
    return numberProblem({
      prompt: t(
        `Find the maximum of $f(x, y) = ${poly([a, "x"], [b, "y"], [c, ""])}$ on the closed triangle with vertices $(0, 0)$, $(${p}, 0)$ and $(0, ${q})$.`,
        `求 $f(x, y) = ${poly([a, "x"], [b, "y"], [c, ""])}$ 在顶点为 $(0, 0)$、$(${p}, 0)$、$(0, ${q})$ 的闭三角形上的最大值。`,
      ),
      answer,
      form: "integer",
      wrong: [c + a * p + b * q, Math.min(...values), c + Math.abs(a) * p + Math.abs(b) * q],
      solution: t(
        `The maximum of a linear function lies at a vertex. The values there are ${values.join(", ")}, and the largest is $${answer}$.`,
        `线性函数的最大值在顶点处取到。顶点处的值是 ${values.join(", ")}，最大的是 $${answer}$。`,
      ),
    });
  },
};

const closestToOrigin: KnowledgePointDef = {
  id: "the-minimum-of-a-sum-of-squares-on-a-line",
  title: t("The minimum of a sum of squares on a line", "直线上平方和的最小值"),
  explanation: t(
    "To minimize $x^2 + y^2$ on the line $ax + by = c$, Lagrange's condition says that the gradient $\\langle 2x, 2y \\rangle$ is parallel to $\\langle a, b \\rangle$. So the best point is a multiple of the normal vector, which matches the geometry: the closest point to the origin lies along the perpendicular to the line.",
    "要在直线 $ax + by = c$ 上使 $x^2 + y^2$ 最小，拉格朗日条件说梯度 $\\langle 2x, 2y \\rangle$ 与 $\\langle a, b \\rangle$ 平行。所以最优点是法向量的倍数，这与几何事实一致：离原点最近的点在过原点的垂线上。",
  ),
  generate(rng) {
    const a = nonzero(rng, 6);
    const b = nonzero(rng, 6);
    const c = rng.int(1, 12);
    const sum = a * a + b * b;
    const answer = Q.of(c * c, sum);
    const lambda = Q.of(c, sum);
    return numberProblem({
      prompt: t(
        `Find the minimum of $x^2 + y^2$ subject to $${poly([a, "x"], [b, "y"])} = ${c}$.`,
        `在 $${poly([a, "x"], [b, "y"])} = ${c}$ 的条件下，求 $x^2 + y^2$ 的最小值。`,
      ),
      answer,
      wrong: [lambda, Q.of(c * c, Math.abs(a) + Math.abs(b)), Q.of(c * c, a * a)],
      solution: t(
        `The condition gives $(x, y) = \\lambda(${a}, ${b})$, and the constraint gives $\\lambda = ${lambda.toLatex()}$. The value is $\\lambda^2 \\cdot ${sum} = ${answer.toLatex()}$.`,
        `条件给出 $(x, y) = \\lambda(${a}, ${b})$，约束给出 $\\lambda = ${lambda.toLatex()}$。值是 $\\lambda^2 \\cdot ${sum} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const triangularDoubleSum: KnowledgePointDef = {
  id: "a-double-sum-with-a-variable-upper-limit",
  title: t("A double sum with a variable upper limit", "上限含变量的二重和"),
  explanation: t(
    "When the inner upper limit depends on the outer index, the sum does not separate into a product. Work from the inside out: the inner sum becomes a function of the outer index, and then that is summed. The sum of the triangular numbers has the closed form $\\sum_{i=1}^{n} \\frac{i(i + 1)}{2} = \\frac{n(n + 1)(n + 2)}{6}$.",
    "内层上限依赖外层下标时，和不能分离成乘积。要由内向外计算：内层和变成外层下标的函数，再对它求和。三角形数之和有闭形式 $\\sum_{i=1}^{n} \\frac{i(i + 1)}{2} = \\frac{n(n + 1)(n + 2)}{6}$。",
  ),
  generate(rng) {
    const n = rng.int(3, 12);
    const k = rng.int(1, 5);
    const single = (n * (n + 1)) / 2;
    const answer = (k * n * (n + 1) * (n + 2)) / 6;
    return numberProblem({
      prompt: t(
        `Find $\\sum_{i=1}^{${n}} \\sum_{j=1}^{i} ${coefficient(k)}j$.`,
        `求 $\\sum_{i=1}^{${n}} \\sum_{j=1}^{i} ${coefficient(k)}j$。`,
      ),
      answer,
      form: "integer",
      wrong: [k * single * single, k * single, k * n * single],
      solution: t(
        `The inner sum is $${coefficient(k)}\\frac{i(i + 1)}{2}$. Summing the triangular numbers gives $\\frac{${n} \\cdot ${n + 1} \\cdot ${n + 2}}{6} = ${(n * (n + 1) * (n + 2)) / 6}$, and the total is $${answer}$.`,
        `内层和是 $${coefficient(k)}\\frac{i(i + 1)}{2}$。三角形数之和是 $\\frac{${n} \\cdot ${n + 1} \\cdot ${n + 2}}{6} = ${(n * (n + 1) * (n + 2)) / 6}$，总和是 $${answer}$。`,
      ),
    });
  },
};

const subintervalsForMesh: KnowledgePointDef = {
  id: "the-fewest-subintervals-for-a-given-mesh",
  title: t("The fewest subintervals for a given mesh", "达到给定网格宽度的最少子区间数"),
  explanation: t(
    "A regular partition of an interval into $n$ parts has mesh equal to the interval's length divided by $n$. So asking for the mesh to be at most a given size means asking for $n$ to be at least the length divided by that size. Since $n$ must be a whole number, round this quotient up.",
    "把区间等分成 $n$ 份的正则分割，网格宽度等于区间长度除以 $n$。所以要求网格宽度不超过给定值，就是要求 $n$ 不小于长度除以这个值。由于 $n$ 必须是整数，要把这个商向上取整。",
  ),
  generate(rng) {
    const a = rng.int(-5, 5);
    const L = rng.int(3, 20);
    const p = rng.int(2, 5);
    const q = rng.pick([3, 4, 5, 6, 7, 8, 9, 11, 13].filter((v) => v % p !== 0 && p % v !== 0));
    const size = Q.of(p, q);
    const answer = Math.ceil((L * q) / p);
    return numberProblem({
      prompt: t(
        `What is the smallest $n$ for which the regular partition of $[${a}, ${a + L}]$ into $n$ subintervals has mesh at most $${size.toLatex()}$?`,
        `要使 $[${a}, ${a + L}]$ 分成 $n$ 个子区间的正则分割的网格宽度不超过 $${size.toLatex()}$，最小的 $n$ 是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [answer + 1, Math.floor((L * q) / p) === answer ? answer - 1 : Math.floor((L * q) / p), L],
      solution: t(
        `The mesh is $\\frac{${L}}{n}$. It is small enough when $n \\ge ${L} \\div ${size.toLatex()} = ${Q.of(L * q, p).toLatex()}$, so the smallest whole number is $${answer}$.`,
        `网格宽度是 $\\frac{${L}}{n}$。当 $n \\ge ${L} \\div ${size.toLatex()} = ${Q.of(L * q, p).toLatex()}$ 时足够小，所以最小的整数是 $${answer}$。`,
      ),
    });
  },
};

const integralWithMaxMin: KnowledgePointDef = {
  id: "integrating-a-maximum-or-minimum-over-a-square",
  title: t("Integrating a maximum or minimum over a square", "在正方形上对最大值或最小值积分"),
  explanation: t(
    "Functions like $\\max(x, y)$ have different formulas on the two sides of the diagonal $y = x$, so the square must be split there. By symmetry the two triangles give equal integrals for $\\max$, and it suffices to do one. The minimum and the absolute difference then follow, since $\\max + \\min = x + y$ and $\\max - \\min = |x - y|$.",
    "像 $\\max(x, y)$ 这样的函数在对角线 $y = x$ 两侧公式不同，所以要在那里把正方形分开。由对称性，$\\max$ 在两个三角形上的积分相等，只需算一个。由于 $\\max + \\min = x + y$，$\\max - \\min = |x - y|$，最小值和绝对差也就随之得到。",
  ),
  generate(rng) {
    const a = rng.int(1, 12);
    const cube = a ** 3;
    const kind = rng.pick([
      {
        latex: "\\max(x, y)",
        value: Q.of(2 * cube, 3),
        en: `Over the half with $y \\le x$ the integrand is $x$, and this half gives $${Q.of(cube, 3).toLatex()}$. Doubling by symmetry gives`,
        zh: `在 $y \\le x$ 的一半上被积函数是 $x$，这一半的积分是 $${Q.of(cube, 3).toLatex()}$。由对称性加倍，得`,
      },
      {
        latex: "\\min(x, y)",
        value: Q.of(cube, 3),
        en: `The integral of $x + y$ is $${cube}$, and $\\max$ contributes $${Q.of(2 * cube, 3).toLatex()}$ of it. Subtracting gives`,
        zh: `$x + y$ 的积分是 $${cube}$，其中 $\\max$ 占 $${Q.of(2 * cube, 3).toLatex()}$。相减得`,
      },
      {
        latex: "|x - y|",
        value: Q.of(cube, 3),
        en: `Here $|x - y| = \\max - \\min$, and these integrate to $${Q.of(2 * cube, 3).toLatex()}$ and $${Q.of(cube, 3).toLatex()}$. Subtracting gives`,
        zh: `这里 $|x - y| = \\max - \\min$，它们的积分是 $${Q.of(2 * cube, 3).toLatex()}$ 和 $${Q.of(cube, 3).toLatex()}$。相减得`,
      },
    ]);
    return numberProblem({
      prompt: t(
        `Evaluate $\\iint_R ${kind.latex}\\,dA$, where $R = [0, ${a}] \\times [0, ${a}]$.`,
        `计算 $\\iint_R ${kind.latex}\\,dA$，其中 $R = [0, ${a}] \\times [0, ${a}]$。`,
      ),
      answer: kind.value,
      wrong: [Q.of(cube), Q.of(cube, 2), Q.of(a * a, 2)],
      solution: t(`${kind.en} $${kind.value.toLatex()}$.`, `${kind.zh} $${kind.value.toLatex()}$。`),
    });
  },
};

const tetrahedronMoment: KnowledgePointDef = {
  id: "integrating-a-coordinate-over-a-tetrahedron",
  title: t("Integrating a coordinate over a tetrahedron", "在四面体上对坐标积分"),
  explanation: t(
    "The integral of a coordinate over a solid equals the solid's volume times the average of that coordinate. For a tetrahedron, the centroid is the average of the four vertices. The corner tetrahedron with intercepts $a$, $b$, $c$ has volume $\\frac{abc}{6}$ and centroid at $x = \\frac{a}{4}$, so no iterated integration is needed.",
    "坐标在立体上的积分，等于立体的体积乘以这个坐标的平均值。四面体的形心是四个顶点的平均。截距为 $a$、$b$、$c$ 的角上四面体，体积是 $\\frac{abc}{6}$，形心在 $x = \\frac{a}{4}$ 处，所以不需要累次积分。",
  ),
  generate(rng) {
    const a = rng.int(1, 6);
    const b = rng.int(1, 6);
    const c = rng.int(1, 6);
    const answer = Q.of(a * a * b * c, 24);
    const volume = Q.of(a * b * c, 6);
    const centre = Q.of(a, 4);
    return numberProblem({
      prompt: t(
        `Let $E$ be the solid with $x, y, z \\ge 0$ and $${overNumber("x", a)} + ${overNumber("y", b)} + ${overNumber("z", c)} \\le 1$. Evaluate $\\iiint_E x\\,dV$.`,
        `设 $E$ 是满足 $x, y, z \\ge 0$ 且 $${overNumber("x", a)} + ${overNumber("y", b)} + ${overNumber("z", c)} \\le 1$ 的立体。计算 $\\iiint_E x\\,dV$。`,
      ),
      answer,
      wrong: [volume, Q.of(a * a * b * c, 6), Q.of(a * b * c, 24)],
      solution: t(
        `The volume is $${volume.toLatex()}$ and the average of $x$ is $${centre.toLatex()}$. Their product is $${answer.toLatex()}$.`,
        `体积是 $${volume.toLatex()}$，$x$ 的平均值是 $${centre.toLatex()}$。它们的积是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const conservativeConstant: KnowledgePointDef = {
  id: "the-constant-that-makes-a-field-path-independent",
  title: t("The constant that makes a field path independent", "使场与路径无关的常数"),
  explanation: t(
    "On the whole plane, a smooth field $\\langle P, Q \\rangle$ has path-independent line integrals exactly when $P_y = Q_x$. If a constant in the field is left unknown, this test becomes an equation for it. Differentiate each component with respect to the other variable, match the coefficients of the resulting monomials, and solve.",
    "在整个平面上，光滑场 $\\langle P, Q \\rangle$ 的线积分与路径无关，当且仅当 $P_y = Q_x$。如果场中有未知常数，这个检验就成了关于它的方程。对每个分量关于另一个变量求导，比较所得单项式的系数，再求解。",
  ),
  generate(rng) {
    const a = rng.int(1, 12);
    const m = rng.int(1, 4);
    const n = rng.int(2, 4);
    const answer = Q.of(a * n, m + 1);
    const P = `${coefficient(a)}${powerOf("x", m)}${powerOf("y", n)}`;
    const R = `k${powerOf("x", m + 1)}${powerOf("y", n - 1)}`;
    const common = `${powerOf("x", m)}${powerOf("y", n - 1)}`;
    return numberProblem({
      prompt: t(
        `For which $k$ are the line integrals of $\\mathbf{F} = \\langle ${P}, ${R} \\rangle$ independent of path?`,
        `$k$ 取何值时，$\\mathbf{F} = \\langle ${P}, ${R} \\rangle$ 的线积分与路径无关？`,
      ),
      answer,
      solveFor: "k",
      wrong: [Q.of(a), Q.of(a * n), Q.of(a, m + 1)],
      solution: t(
        `Here $P_y = ${a * n}${common}$ and $Q_x = ${m + 1}k${common}$. Equating them gives $k = ${answer.toLatex()}$.`,
        `这里 $P_y = ${a * n}${common}$，$Q_x = ${m + 1}k${common}$。令二者相等，得 $k = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const normalFromTotal: KnowledgePointDef = {
  id: "the-normal-acceleration-from-the-total-and-tangential",
  title: t("The normal acceleration from the total and tangential", "由总加速度和切向加速度求法向加速度"),
  explanation: t(
    "The tangential and normal components of acceleration are perpendicular, so they combine like the legs of a right triangle: $|\\mathbf{a}|^2 = a_T^2 + a_N^2$. So when the total acceleration and the rate of change of speed are known, the normal part follows, with no need for the curvature or the curve itself.",
    "加速度的切向分量和法向分量互相垂直，所以它们像直角三角形的两条直角边那样合成：$|\\mathbf{a}|^2 = a_T^2 + a_N^2$。所以知道总加速度和速率的变化率，就能得到法向部分，不需要曲率，也不需要曲线本身。",
  ),
  generate(rng) {
    const { a, b, h } = helixShape(rng);
    const scale = rng.int(1, 3);
    const total = h * scale;
    const along = a * scale;
    const answer = b * scale;
    return numberProblem({
      prompt: t(
        `A particle has acceleration of magnitude ${total}, and its speed is increasing at a rate of ${along}. Find the normal component of its acceleration.`,
        `质点的加速度大小是 ${total}，速率以 ${along} 的变化率增加。求它的加速度的法向分量。`,
      ),
      answer,
      form: "integer",
      wrong: [total - along, total + along, total],
      solution: t(
        `Since $a_N^2 = ${total}^2 - ${along}^2 = ${answer * answer}$, we get $a_N = ${answer}$.`,
        `由于 $a_N^2 = ${total}^2 - ${along}^2 = ${answer * answer}$，得 $a_N = ${answer}$。`,
      ),
    });
  },
};

const averageOfProductOnTriangle: KnowledgePointDef = {
  id: "the-average-of-xy-over-a-right-triangle",
  title: t("The average of $xy$ over a right triangle", "$xy$ 在直角三角形上的平均值"),
  explanation: t(
    "An average value is an integral over the region divided by the region's area. Over the right triangle with legs $a$ and $b$ on the axes, $\\iint xy\\,dA = \\frac{a^2b^2}{24}$, and the area is $\\frac{ab}{2}$. So the average of $xy$ is $\\frac{ab}{12}$, which is not the product of the separate averages of $x$ and $y$.",
    "平均值是区域上的积分除以区域的面积。在两直角边 $a$、$b$ 位于坐标轴上的直角三角形上，$\\iint xy\\,dA = \\frac{a^2b^2}{24}$，面积是 $\\frac{ab}{2}$。所以 $xy$ 的平均值是 $\\frac{ab}{12}$，这并不等于 $x$ 和 $y$ 各自平均值的乘积。",
  ),
  generate(rng) {
    const a = rng.int(1, 12);
    const b = rng.int(1, 12);
    const answer = Q.of(a * b, 12);
    return numberProblem({
      prompt: t(
        `Find the average value of $f(x, y) = xy$ over the triangle with vertices $(0, 0)$, $(${a}, 0)$ and $(0, ${b})$.`,
        `求 $f(x, y) = xy$ 在顶点为 $(0, 0)$、$(${a}, 0)$、$(0, ${b})$ 的三角形上的平均值。`,
      ),
      answer,
      wrong: [Q.of(a * b, 9), Q.of(a * a * b * b, 24), Q.of(a * b, 24)],
      solution: t(
        `The integral is $\\frac{${a}^2 \\cdot ${b}^2}{24}$ and the area is $\\frac{${a} \\cdot ${b}}{2}$. Their quotient is $${answer.toLatex()}$.`,
        `积分是 $\\frac{${a}^2 \\cdot ${b}^2}{24}$，面积是 $\\frac{${a} \\cdot ${b}}{2}$。它们的商是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const chargeOnDisk: KnowledgePointDef = {
  id: "the-charge-on-a-disk-with-radial-density",
  title: t("The charge on a disk with radial density", "径向密度圆盘上的电荷"),
  explanation: t(
    "When a density depends only on the distance from the centre, polar coordinates reduce the double integral to one variable. The angle contributes a factor of $2\\pi$, and the area element supplies an extra factor of $r$, which is easy to forget. This extra factor is why the outer rings of a disk carry the most charge.",
    "密度只取决于到中心的距离时，极坐标把二重积分化为单变量积分。角度贡献因子 $2\\pi$，面积元多出一个因子 $r$，这一点容易忘记。正是这个因子，使圆盘外圈带的电荷最多。",
  ),
  generate(rng) {
    const k = rng.int(1, 9);
    const R = rng.int(1, 6);
    const answer = Q.of(2 * k * R ** 3, 3);
    return numberProblem({
      prompt: t(
        `A disk of radius ${R} has charge density $${coefficient(k)}\\sqrt{x^2 + y^2}$. Its total charge is $c\\pi$. Find $c$.`,
        `半径为 ${R} 的圆盘，电荷密度是 $${coefficient(k)}\\sqrt{x^2 + y^2}$。总电荷是 $c\\pi$。求 $c$。`,
      ),
      answer,
      wrong: [Q.of(k * R ** 3, 3), Q.of(k * R * R), Q.of(2 * k * R * R, 3)],
      solution: t(
        `In polar coordinates the charge is $2\\pi \\int_0^{${R}} ${coefficient(k)}r \\cdot r\\,dr = 2\\pi \\cdot \\frac{${k * R ** 3}}{3}$, so $c = ${answer.toLatex()}$.`,
        `在极坐标下，电荷是 $2\\pi \\int_0^{${R}} ${coefficient(k)}r \\cdot r\\,dr = 2\\pi \\cdot \\frac{${k * R ** 3}}{3}$，所以 $c = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const semidiskCentroid: KnowledgePointDef = {
  id: "the-centroid-of-a-half-disk",
  title: t("The centroid of a half disk", "半圆盘的形心"),
  explanation: t(
    "A half disk is symmetric about its central axis, so only one coordinate of the centroid needs work. The moment $\\iint y\\,dA$ over the half disk is $\\frac{2R^3}{3}$ and the area is $\\frac{\\pi R^2}{2}$, so $\\bar{y} = \\frac{4R}{3\\pi}$. This is a little below halfway up, since the region is wider near its base.",
    "半圆盘关于中轴对称，所以形心只有一个坐标需要计算。半圆盘上的矩 $\\iint y\\,dA$ 是 $\\frac{2R^3}{3}$，面积是 $\\frac{\\pi R^2}{2}$，所以 $\\bar{y} = \\frac{4R}{3\\pi}$。它略低于高度的一半，因为这个区域靠近底部更宽。",
  ),
  generate(rng) {
    const R = rng.int(1, 40);
    const answer = Q.of(4 * R, 3);
    return numberProblem({
      prompt: t(
        `The centroid of the half disk $x^2 + y^2 \\le ${R * R}$, $y \\ge 0$ has $\\bar{y} = \\frac{c}{\\pi}$. Find $c$.`,
        `半圆盘 $x^2 + y^2 \\le ${R * R}$，$y \\ge 0$ 的形心满足 $\\bar{y} = \\frac{c}{\\pi}$。求 $c$。`,
      ),
      answer,
      wrong: [Q.of(2 * R, 3), Q.of(4 * R), Q.of(R, 2)],
      solution: t(
        `The moment is $\\frac{2 \\cdot ${R}^3}{3}$ and the area is $\\frac{\\pi \\cdot ${R}^2}{2}$. Dividing gives $\\bar{y} = \\frac{4 \\cdot ${R}}{3\\pi}$, so $c = ${answer.toLatex()}$.`,
        `矩是 $\\frac{2 \\cdot ${R}^3}{3}$，面积是 $\\frac{\\pi \\cdot ${R}^2}{2}$。相除得 $\\bar{y} = \\frac{4 \\cdot ${R}}{3\\pi}$，所以 $c = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const rodWithPowerDensity: KnowledgePointDef = {
  id: "the-center-of-mass-of-a-rod-with-power-density",
  title: t("The center of mass of a rod with power density", "幂密度杆的质心"),
  explanation: t(
    "For a rod on $[0, L]$ with density $\\rho(x) = x^n$, the mass is $\\frac{L^{n+1}}{n+1}$ and the moment is $\\frac{L^{n+2}}{n+2}$. Their quotient is $\\frac{n+1}{n+2}L$. A higher power concentrates the mass at the far end, so the center of mass moves toward that end, and it approaches $L$ as $n$ grows.",
    "$[0, L]$ 上密度为 $\\rho(x) = x^n$ 的杆，质量是 $\\frac{L^{n+1}}{n+1}$，矩是 $\\frac{L^{n+2}}{n+2}$。它们的商是 $\\frac{n+1}{n+2}L$。幂次越高，质量越集中在远端，所以质心向那一端移动，$n$ 增大时趋于 $L$。",
  ),
  generate(rng) {
    const n = rng.int(2, 9);
    const L = rng.int(1, 12);
    const answer = Q.of((n + 1) * L, n + 2);
    return numberProblem({
      prompt: t(
        `A rod on $[0, ${L}]$ has density $\\rho(x) = x^{${n}}$. Find its center of mass.`,
        `$[0, ${L}]$ 上的杆，密度是 $\\rho(x) = x^{${n}}$。求它的质心。`,
      ),
      answer,
      wrong: [Q.of(L, 2), Q.of(n * L, n + 1), Q.of((n + 2) * L, n + 3)],
      solution: t(
        `The moment over the mass is $\\frac{${L}^{${n + 2}}/${n + 2}}{${L}^{${n + 1}}/${n + 1}} = \\frac{${n + 1}}{${n + 2}} \\cdot ${L} = ${answer.toLatex()}$.`,
        `矩除以质量是 $\\frac{${L}^{${n + 2}}/${n + 2}}{${L}^{${n + 1}}/${n + 1}} = \\frac{${n + 1}}{${n + 2}} \\cdot ${L} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const probabilityOneBelowOther: KnowledgePointDef = {
  id: "the-probability-that-one-uniform-variable-is-smaller",
  title: t("The probability that one uniform variable is smaller", "一个均匀变量较小的概率"),
  explanation: t(
    "Two independent uniform variables spread evenly over a rectangle, so a probability about them is a ratio of areas. To compare them, draw the line $y = x$ across the rectangle. When the ranges differ, it is easiest to find the area of the smaller piece, which is a triangle, and subtract its share from one.",
    "两个独立的均匀变量在矩形上均匀分布，所以关于它们的概率就是面积之比。要比较它们，就在矩形上画直线 $y = x$。范围不同时，最容易的做法是求较小的那块面积，它是一个三角形，再用一减去它所占的比例。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const b = rng.int(a + 1, 12);
    const answer = Q.of(2 * b - a, 2 * b);
    const part = Q.of(a, 2 * b);
    return numberProblem({
      prompt: t(
        `Independent $X$ and $Y$ are uniform on $[0, ${a}]$ and $[0, ${b}]$. Find $P(X < Y)$.`,
        `独立的 $X$、$Y$ 分别在 $[0, ${a}]$ 和 $[0, ${b}]$ 上均匀分布。求 $P(X < Y)$。`,
      ),
      answer,
      wrong: [part, Q.of(1, 2), Q.of(a, b)],
      solution: t(
        `The part with $y \\le x$ is a triangle of area $\\frac{${a}^2}{2}$ in a rectangle of area ${a * b}, which is a share of $${part.toLatex()}$. So $P(X < Y) = ${answer.toLatex()}$.`,
        `$y \\le x$ 的部分是面积为 $\\frac{${a}^2}{2}$ 的三角形，矩形面积是 ${a * b}，所占比例是 $${part.toLatex()}$。所以 $P(X < Y) = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const marginalOnTriangle: KnowledgePointDef = {
  id: "a-marginal-density-of-a-uniform-triangle",
  title: t("A marginal density of a uniform triangle", "均匀三角形的边缘密度"),
  explanation: t(
    "A joint density that is uniform on a region equals one over its area there. Its marginal at $x$ is found by integrating out $y$, so it equals the joint density times the length of the vertical slice at $x$. On a triangle these slices shrink, so the marginal is not uniform even though the joint density is.",
    "在区域上均匀的联合密度，在那里等于面积的倒数。它在 $x$ 处的边缘密度通过对 $y$ 积分得到，等于联合密度乘以 $x$ 处竖直截线的长度。在三角形上这些截线不断缩短，所以即使联合密度均匀，边缘密度也不均匀。",
  ),
  generate(rng) {
    const a = rng.int(2, 12);
    const x = rng.int(1, a - 1);
    const answer = Q.of(2 * (a - x), a * a);
    return numberProblem({
      prompt: t(
        `$(X, Y)$ is uniform on the triangle $x \\ge 0$, $y \\ge 0$, $x + y \\le ${a}$. Find the marginal density $f_X(${x})$.`,
        `$(X, Y)$ 在三角形 $x \\ge 0$，$y \\ge 0$，$x + y \\le ${a}$ 上均匀分布。求边缘密度 $f_X(${x})$。`,
      ),
      answer,
      wrong: [Q.of(a - x, a * a), Q.of(2, a * a), Q.of(1, a), Q.of(a - x, a)],
      solution: t(
        `The area is $\\frac{${a * a}}{2}$, so the joint density is $\\frac{2}{${a * a}}$. The slice at $x = ${x}$ has length ${a - x}, which gives $${answer.toLatex()}$.`,
        `面积是 $\\frac{${a * a}}{2}$，所以联合密度是 $\\frac{2}{${a * a}}$。$x = ${x}$ 处的截线长度是 ${a - x}，得 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const minimumOfExponentials: KnowledgePointDef = {
  id: "the-expected-minimum-of-two-exponential-variables",
  title: t("The expected minimum of two exponential variables", "两个指数变量最小值的期望"),
  explanation: t(
    "The smaller of two independent exponential variables exceeds $t$ only when both do, and that probability is $e^{-pt}e^{-qt}$. So the minimum is itself exponential, with rate $p + q$, and its mean is $\\frac{1}{p + q}$. Two competing waiting times therefore end sooner than either alone, and their rates simply add.",
    "两个独立指数变量中较小的那个超过 $t$，当且仅当二者都超过 $t$，这个概率是 $e^{-pt}e^{-qt}$。所以最小值本身也服从指数分布，速率是 $p + q$，均值是 $\\frac{1}{p + q}$。因此两个相互竞争的等待时间比单独任何一个都结束得早，它们的速率直接相加。",
  ),
  generate(rng) {
    const p = rng.int(1, 9);
    const q = rng.int(1, 9);
    const answer = Q.of(1, p + q);
    return numberProblem({
      prompt: t(
        `Independent $X$ and $Y$ have densities $${coefficient(p)}e^{${poly([-p, "x"])}}$ and $${coefficient(q)}e^{${poly([-q, "y"])}}$ on the positive reals. Find $E[\\min(X, Y)]$.`,
        `独立的 $X$、$Y$ 在正实数上的密度分别是 $${coefficient(p)}e^{${poly([-p, "x"])}}$ 和 $${coefficient(q)}e^{${poly([-q, "y"])}}$。求 $E[\\min(X, Y)]$。`,
      ),
      answer,
      wrong: [Q.of(1, p).add(Q.of(1, q)), Q.of(1, p * q), Q.of(1, 2 * (p + q))],
      solution: t(
        `Since $P(\\min(X, Y) > t) = e^{-${p + q}t}$, the minimum is exponential with rate ${p + q}. Its mean is $${answer.toLatex()}$.`,
        `由于 $P(\\min(X, Y) > t) = e^{-${p + q}t}$，最小值服从速率为 ${p + q} 的指数分布。它的均值是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const torusArea: KnowledgePointDef = {
  id: "the-surface-area-of-a-torus",
  title: t("The surface area of a torus", "环面的面积"),
  explanation: t(
    "For the torus $\\langle (R + r\\cos v)\\cos u, (R + r\\cos v)\\sin u, r\\sin v \\rangle$, the area element is $r(R + r\\cos v)\\,du\\,dv$. Over a full turn of $v$, the cosine term integrates to zero, which leaves $4\\pi^2Rr$. This equals the length of the tube's central circle times the circumference of the tube.",
    "对环面 $\\langle (R + r\\cos v)\\cos u, (R + r\\cos v)\\sin u, r\\sin v \\rangle$，面积元是 $r(R + r\\cos v)\\,du\\,dv$。$v$ 转一整圈时余弦项积分为零，剩下 $4\\pi^2Rr$。它等于管子中心圆的长度乘以管子的周长。",
  ),
  generate(rng) {
    const R = rng.int(3, 12);
    const r = rng.int(1, R - 1);
    const answer = 4 * R * r;
    return numberProblem({
      prompt: t(
        `The torus $\\langle (${R} + ${coefficient(r)}\\cos v)\\cos u, (${R} + ${coefficient(r)}\\cos v)\\sin u, ${coefficient(r)}\\sin v \\rangle$, with $0 \\le u, v \\le 2\\pi$, has area $c\\pi^2$. Find $c$.`,
        `环面 $\\langle (${R} + ${coefficient(r)}\\cos v)\\cos u, (${R} + ${coefficient(r)}\\cos v)\\sin u, ${coefficient(r)}\\sin v \\rangle$（$0 \\le u, v \\le 2\\pi$）的面积是 $c\\pi^2$。求 $c$。`,
      ),
      answer,
      form: "integer",
      wrong: [2 * R * r, 4 * R * R, 4 * r * r],
      solution: t(
        `The area element is $${coefficient(r)}(${R} + ${coefficient(r)}\\cos v)$. The cosine integrates to zero, so the area is $(2\\pi)^2 \\cdot ${r} \\cdot ${R}$, and $c = ${answer}$.`,
        `面积元是 $${coefficient(r)}(${R} + ${coefficient(r)}\\cos v)$。余弦项积分为零，所以面积是 $(2\\pi)^2 \\cdot ${r} \\cdot ${R}$，$c = ${answer}$。`,
      ),
    });
  },
};

const sphereSecondMoment: KnowledgePointDef = {
  id: "a-surface-integral-over-a-sphere-by-symmetry",
  title: t("A surface integral over a sphere by symmetry", "用对称性求球面上的面积分"),
  explanation: t(
    "On a sphere of radius $R$, the coordinates play the same role, so $x^2$, $y^2$ and $z^2$ have equal integrals. Their sum is the constant $R^2$, so each one has the average value $\\frac{R^2}{3}$. Multiplying by the area $4\\pi R^2$ gives the integral with no parametrization at all.",
    "在半径为 $R$ 的球面上，各坐标地位相同，所以 $x^2$、$y^2$、$z^2$ 的积分相等。它们的和是常数 $R^2$，所以每一个的平均值都是 $\\frac{R^2}{3}$。乘以面积 $4\\pi R^2$，就不用参数化得到了积分。",
  ),
  generate(rng) {
    const k = rng.int(1, 6);
    const R = rng.int(1, 6);
    const answer = Q.of(4 * k * R ** 4, 3);
    const name = rng.pick(["x", "y", "z"]);
    return numberProblem({
      prompt: t(
        `Let $S$ be the sphere $x^2 + y^2 + z^2 = ${R * R}$. The integral $\\iint_S ${coefficient(k)}${name}^2\\,dS$ equals $c\\pi$. Find $c$.`,
        `设 $S$ 是球面 $x^2 + y^2 + z^2 = ${R * R}$。积分 $\\iint_S ${coefficient(k)}${name}^2\\,dS$ 等于 $c\\pi$。求 $c$。`,
      ),
      answer,
      wrong: [Q.of(4 * k * R ** 4), Q.of(2 * k * R ** 4, 3), Q.of(4 * k * R * R, 3)],
      solution: t(
        `The average of $${name}^2$ is $\\frac{${R * R}}{3}$, and the area is $${4 * R * R}\\pi$. So $c = ${k} \\cdot ${Q.of(R * R, 3).toLatex()} \\cdot ${4 * R * R} = ${answer.toLatex()}$.`,
        `$${name}^2$ 的平均值是 $\\frac{${R * R}}{3}$，面积是 $${4 * R * R}\\pi$。所以 $c = ${k} \\cdot ${Q.of(R * R, 3).toLatex()} \\cdot ${4 * R * R} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const integralWithLog: KnowledgePointDef = {
  id: "an-integral-with-a-logarithm-from-a-parameter",
  title: t("An integral with a logarithm from a parameter", "由参数得到含对数的积分"),
  explanation: t(
    "Differentiating under the integral sign can evaluate integrals that look hard. Since $\\frac{\\partial}{\\partial t}x^t = x^t\\ln x$, the integral of $x^t\\ln x$ is the derivative with respect to $t$ of the integral of $x^t$. On $[0, 1]$ that integral is $\\frac{1}{t + 1}$, so the logarithm appears without integration by parts.",
    "在积分号下求导，可以算出看起来很难的积分。由于 $\\frac{\\partial}{\\partial t}x^t = x^t\\ln x$，$x^t\\ln x$ 的积分就是 $x^t$ 的积分对 $t$ 的导数。在 $[0, 1]$ 上这个积分是 $\\frac{1}{t + 1}$，所以不用分部积分就能处理对数。",
  ),
  generate(rng) {
    const n = rng.int(1, 9);
    const k = rng.int(1, 9);
    const answer = Q.of(-k, (n + 1) ** 2);
    return numberProblem({
      prompt: t(
        `Evaluate $\\int_0^1 ${coefficient(k)}${powerOf("x", n)}\\ln x\\,dx$.`,
        `计算 $\\int_0^1 ${coefficient(k)}${powerOf("x", n)}\\ln x\\,dx$。`,
      ),
      answer,
      wrong: [answer.neg(), Q.of(-k, n + 1), Q.of(-k, n * n)],
      solution: t(
        `The integral of $x^t$ on $[0, 1]$ is $\\frac{1}{t + 1}$, whose derivative is $-\\frac{1}{(t + 1)^2}$. At $t = ${n}$ the integral is $${k} \\cdot \\left(-\\frac{1}{${(n + 1) ** 2}}\\right) = ${answer.toLatex()}$.`,
        `$x^t$ 在 $[0, 1]$ 上的积分是 $\\frac{1}{t + 1}$，它的导数是 $-\\frac{1}{(t + 1)^2}$。在 $t = ${n}$ 处，积分是 $${k} \\cdot \\left(-\\frac{1}{${(n + 1) ** 2}}\\right) = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const fluxThroughTiltedTriangle: KnowledgePointDef = {
  id: "the-flux-of-a-constant-field-through-a-tilted-triangle",
  title: t("The flux of a constant field through a tilted triangle", "常向量场穿过倾斜三角形的通量"),
  explanation: t(
    "The flux of a constant field through a flat surface is the dot product of the field with the area vector, whose size is the area and whose direction is the normal. For a triangle, half the cross product of two edges is that area vector. So there is no integral to do, only one cross product and one dot product.",
    "常向量场穿过平面的通量，是场与面积向量的点积，面积向量的大小是面积，方向是法向。对三角形，两条边叉积的一半就是这个面积向量。所以不需要积分，只要做一次叉积和一次点积。",
  ),
  generate(rng) {
    const a = rng.int(1, 6);
    const b = rng.int(1, 6);
    const c = rng.int(1, 6);
    const p = nonzero(rng, 5);
    const q = nonzero(rng, 5);
    const s = nonzero(rng, 5);
    const twice = p * b * c + q * a * c + s * a * b;
    const answer = Q.of(twice, 2);
    return numberProblem({
      prompt: t(
        `A triangle has vertices $(${a}, 0, 0)$, $(0, ${b}, 0)$ and $(0, 0, ${c})$, with its normal pointing away from the origin. Find the flux of $\\mathbf{F} = \\langle ${p}, ${q}, ${s} \\rangle$ through it.`,
        `三角形的顶点是 $(${a}, 0, 0)$、$(0, ${b}, 0)$、$(0, 0, ${c})$，法向背离原点。求 $\\mathbf{F} = \\langle ${p}, ${q}, ${s} \\rangle$ 穿过它的通量。`,
      ),
      answer,
      wrong: [Q.of(twice), answer.neg(), Q.of((p + q + s) * a * b * c, 2)],
      solution: t(
        `Half the cross product of two edges is $\\frac{1}{2}\\langle ${b * c}, ${a * c}, ${a * b} \\rangle$. Its dot product with $\\mathbf{F}$ is $\\frac{${twice}}{2} = ${answer.toLatex()}$.`,
        `两条边叉积的一半是 $\\frac{1}{2}\\langle ${b * c}, ${a * c}, ${a * b} \\rangle$。它与 $\\mathbf{F}$ 的点积是 $\\frac{${twice}}{2} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Third pass
// ---------------------------------------------------------------------------

/** thirdPassChoose counts the ways to choose k things from n. */
const thirdPassChoose = (n: number, k: number) => {
  let c = 1;
  for (let i = 1; i <= k; i++) c = (c * (n - k + i)) / i;
  return c;
};
/** pythagoreanSlopes lists rise, run and hypotenuse of right triangles with whole sides. */
const pythagoreanSlopes = [
  [3, 4, 5],
  [4, 3, 5],
  [5, 12, 13],
  [12, 5, 13],
  [8, 15, 17],
  [15, 8, 17],
] as const;

const curvatureWithSlope: KnowledgePointDef = {
  id: "the-curvature-where-the-slope-is-not-zero",
  title: t("The curvature where the slope is not zero", "斜率不为零处的曲率"),
  explanation: t(
    "The curvature of $y = f(x)$ is $\\kappa = \\frac{|f''|}{(1 + (f')^2)^{3/2}}$. At a point where the slope is zero the denominator is 1, so curvature equals $|f''|$. A nonzero slope makes the denominator larger, because the same bending is spread over a longer arc. So the steeper the curve is at a point, the smaller the curvature for the same second derivative.",
    "$y = f(x)$ 的曲率是 $\\kappa = \\frac{|f''|}{(1 + (f')^2)^{3/2}}$。在斜率为零的点，分母是 1，所以曲率等于 $|f''|$。斜率不为零时分母变大，因为同样的弯曲分布在更长的弧上。所以对相同的二阶导数，曲线在一点越陡，曲率就越小。",
  ),
  generate(rng) {
    const [p, q, h] = rng.pick(pythagoreanSlopes);
    const sign = rng.pick([1, -1]);
    const s = nonzero(rng, 9);
    const size = Math.abs(s);
    const a = rng.int(-5, 5);
    const answer = Q.of(size * q ** 3, h ** 3);
    const slope = Q.of(sign * p, q);
    return numberProblem({
      prompt: t(
        `At $x = ${a}$, a function has $f'(${a}) = ${slope.toLatex()}$ and $f''(${a}) = ${s}$. Find the curvature of $y = f(x)$ there.`,
        `在 $x = ${a}$ 处，函数满足 $f'(${a}) = ${slope.toLatex()}$，$f''(${a}) = ${s}$。求 $y = f(x)$ 在该处的曲率。`,
      ),
      answer,
      wrong: [Q.of(size), Q.of(size * q * q, h * h), Q.of(size * q, h), answer.add(Q.of(1))],
      solution: t(
        `Here $1 + (f')^2 = ${Q.of(h * h, q * q).toLatex()}$, and raising this to the power $\\frac{3}{2}$ gives $${Q.of(h ** 3, q ** 3).toLatex()}$. Dividing $${size}$ by it gives $${answer.toLatex()}$.`,
        `这里 $1 + (f')^2 = ${Q.of(h * h, q * q).toLatex()}$，它的 $\\frac{3}{2}$ 次幂是 $${Q.of(h ** 3, q ** 3).toLatex()}$。用它除 $${size}$，得 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const squaredLengthRate: KnowledgePointDef = {
  id: "the-rate-of-change-of-a-squared-length",
  title: t("The rate of change of a squared length", "长度平方的变化率"),
  explanation: t(
    "The squared length of a moving vector is $\\|\\mathbf{r}\\|^2 = \\mathbf{r} \\cdot \\mathbf{r}$, so the product rule for dot products gives $\\frac{d}{dt}\\|\\mathbf{r}\\|^2 = 2\\mathbf{r} \\cdot \\mathbf{r}'$. Only the current position and velocity are needed, and not the formula for the curve. If the result is zero, the vector is momentarily neither lengthening nor shortening, because its velocity is perpendicular to it.",
    "运动向量的长度平方是 $\\|\\mathbf{r}\\|^2 = \\mathbf{r} \\cdot \\mathbf{r}$，所以点积的乘积法则给出 $\\frac{d}{dt}\\|\\mathbf{r}\\|^2 = 2\\mathbf{r} \\cdot \\mathbf{r}'$。只需要当前的位置和速度，不需要曲线的公式。如果结果为零，向量此刻既不变长也不变短，因为它的速度与它垂直。",
  ),
  generate(rng) {
    const r = [rng.int(-6, 6), rng.int(-6, 6), nonzero(rng, 6)];
    const v = [rng.int(-6, 6), rng.int(-6, 6), nonzero(rng, 6)];
    const product = (r[0] ?? 0) * (v[0] ?? 0) + (r[1] ?? 0) * (v[1] ?? 0) + (r[2] ?? 0) * (v[2] ?? 0);
    const t0 = rng.int(1, 5);
    const answer = 2 * product;
    const vectorSum = (r[0] ?? 0) + (r[1] ?? 0) + (r[2] ?? 0) + (v[0] ?? 0) + (v[1] ?? 0) + (v[2] ?? 0);
    return numberProblem({
      prompt: t(
        `A curve has $\\mathbf{r}(${t0}) = \\langle ${r.join(", ")} \\rangle$ and $\\mathbf{r}'(${t0}) = \\langle ${v.join(", ")} \\rangle$. Find $\\frac{d}{dt}\\|\\mathbf{r}(t)\\|^2$ at $t = ${t0}$.`,
        `一条曲线满足 $\\mathbf{r}(${t0}) = \\langle ${r.join(", ")} \\rangle$，$\\mathbf{r}'(${t0}) = \\langle ${v.join(", ")} \\rangle$。求 $t = ${t0}$ 时的 $\\frac{d}{dt}\\|\\mathbf{r}(t)\\|^2$。`,
      ),
      answer,
      form: "integer",
      wrong: [product, -answer, vectorSum, answer + 1],
      solution: t(
        `The derivative is $2\\mathbf{r} \\cdot \\mathbf{r}'$. The dot product is $${product}$, so the value is $${answer}$.`,
        `导数是 $2\\mathbf{r} \\cdot \\mathbf{r}'$。点积是 $${product}$，所以值是 $${answer}$。`,
      ),
    });
  },
};

const gapBetweenSheets: KnowledgePointDef = {
  id: "the-gap-between-the-sheets-of-a-hyperboloid",
  title: t("The gap between the sheets of a hyperboloid", "双叶双曲面两叶之间的距离"),
  explanation: t(
    "Rearranging $\\frac{z^2}{c^2} - \\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$ gives $\\frac{z^2}{c^2} = 1 + \\frac{x^2}{a^2} + \\frac{y^2}{b^2}$, and the right side is at least 1. So $|z| \\ge c$ on the whole surface, and no point lies between the planes $z = -c$ and $z = c$. The two sheets come closest at their vertices on the $z$-axis, where the values of $a$ and $b$ play no part.",
    "把 $\\frac{z^2}{c^2} - \\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$ 整理成 $\\frac{z^2}{c^2} = 1 + \\frac{x^2}{a^2} + \\frac{y^2}{b^2}$，右边至少是 1。所以整个曲面上 $|z| \\ge c$，平面 $z = -c$ 和 $z = c$ 之间没有点。两叶在 $z$ 轴上的顶点处最接近，这时 $a$、$b$ 的值不起作用。",
  ),
  generate(rng) {
    const a = rng.int(2, 9);
    const b = rng.int(2, 9);
    const c = rng.int(2, 9);
    const answer = 2 * c;
    return numberProblem({
      prompt: t(
        `Find the shortest distance between the two sheets of $\\frac{z^2}{${c * c}} - \\frac{x^2}{${a * a}} - \\frac{y^2}{${b * b}} = 1$.`,
        `求 $\\frac{z^2}{${c * c}} - \\frac{x^2}{${a * a}} - \\frac{y^2}{${b * b}} = 1$ 两叶之间的最短距离。`,
      ),
      answer,
      form: "integer",
      wrong: [c, c * c, 2 * c * c, 2 * a, 2 * b, 2 * c + 1],
      solution: t(
        `The vertices are at $z = \\pm ${c}$, and every other point has larger $|z|$. Their distance is $${answer}$.`,
        `顶点在 $z = \\pm ${c}$，其他点的 $|z|$ 都更大。它们的距离是 $${answer}$。`,
      ),
    });
  },
};

const ellipsoidSliceArea: KnowledgePointDef = {
  id: "the-area-of-a-slice-of-an-ellipsoid",
  title: t("The area of a slice of an ellipsoid", "椭球截面的面积"),
  explanation: t(
    "The plane $z = k$ cuts an ellipsoid in an ellipse. Moving $\\frac{k^2}{c^2}$ to the right side leaves $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1 - \\frac{k^2}{c^2}$, and both semi-axes shrink by the same factor $\\sqrt{1 - \\frac{k^2}{c^2}}$. An ellipse with semi-axes $A$ and $B$ has area $\\pi AB$, so the two square roots multiply away and the area of the slice is rational in $k$.",
    "平面 $z = k$ 把椭球截成一个椭圆。把 $\\frac{k^2}{c^2}$ 移到右边，得 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1 - \\frac{k^2}{c^2}$，两个半轴都缩小相同的因子 $\\sqrt{1 - \\frac{k^2}{c^2}}$。半轴为 $A$、$B$ 的椭圆面积是 $\\pi AB$，所以两个平方根相乘后消失，截面面积是 $k$ 的有理式。",
  ),
  generate(rng) {
    const a = rng.int(2, 8);
    const b = rng.int(2, 8);
    const c = rng.int(3, 9);
    const k = rng.int(1, c - 1);
    const answer = Q.of(a * b * (c * c - k * k), c * c);
    return numberProblem({
      prompt: t(
        `The plane $z = ${k}$ cuts $\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} + \\frac{z^2}{${c * c}} = 1$ in an ellipse of area $A\\pi$. Find $A$.`,
        `平面 $z = ${k}$ 把 $\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} + \\frac{z^2}{${c * c}} = 1$ 截成面积为 $A\\pi$ 的椭圆。求 $A$。`,
      ),
      answer,
      wrong: [Q.of(a * b), Q.of(a * b * (c - k), c), Q.of(a * b * k * k, c * c), Q.of(a * b * (c * c - k * k))],
      solution: t(
        `Each squared semi-axis is multiplied by $1 - \\frac{${k * k}}{${c * c}}$, so the product of the semi-axes is $${a} \\cdot ${b}$ times that factor. This gives $A = ${answer.toLatex()}$.`,
        `每个半轴的平方都乘以 $1 - \\frac{${k * k}}{${c * c}}$，所以两个半轴之积是 $${a} \\cdot ${b}$ 乘以这个因子。于是 $A = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const linearizationError: KnowledgePointDef = {
  id: "the-exact-error-of-a-linearization-of-a-product",
  title: t("The exact error of a linearization of a product", "乘积线性化的精确误差"),
  explanation: t(
    "For $f(x, y) = cxy$ at $(a, b)$, the linearization is $L = cab + cb(x - a) + ca(y - b)$. Writing $x = a + h$ and $y = b + k$ and expanding $f$ exactly gives the same three terms plus one more, $chk$. So the error is exactly this product. It is small compared with the steps themselves, which is what it means for $f$ to be differentiable at the point.",
    "对 $f(x, y) = cxy$ 在 $(a, b)$ 处，线性化是 $L = cab + cb(x - a) + ca(y - b)$。令 $x = a + h$，$y = b + k$，精确展开 $f$，得到同样的三项，再加一项 $chk$。所以误差恰好就是这个乘积。它相对于步长本身很小，这正是 $f$ 在该点可微的含义。",
  ),
  generate(rng) {
    const c = rng.int(2, 6);
    const a = rng.int(1, 6);
    const b = rng.int(1, 6);
    const h = nonzero(rng, 3);
    const k = nonzero(rng, 3);
    const answer = c * h * k;
    return numberProblem({
      prompt: t(
        `Let $L$ be the linearization of $f(x, y) = ${c}xy$ at $(${a}, ${b})$. Find $f(${a + h}, ${b + k}) - L(${a + h}, ${b + k})$.`,
        `设 $L$ 是 $f(x, y) = ${c}xy$ 在 $(${a}, ${b})$ 处的线性化。求 $f(${a + h}, ${b + k}) - L(${a + h}, ${b + k})$。`,
      ),
      answer,
      form: "integer",
      wrong: [0, c * (a * k + b * h), h * k, -answer],
      solution: t(
        `Here $h = ${h}$ and $k = ${k}$, and expanding $f(a + h, b + k)$ leaves the extra term $${c}hk = ${answer}$.`,
        `这里 $h = ${h}$，$k = ${k}$，展开 $f(a + h, b + k)$ 后多出一项 $${c}hk = ${answer}$。`,
      ),
    });
  },
};

const horizontalTangent: KnowledgePointDef = {
  id: "where-a-level-curve-has-a-horizontal-tangent",
  title: t("Where a level curve has a horizontal tangent", "等值线切线水平的位置"),
  explanation: t(
    "The tangent to a level curve $F(x, y) = k$ is perpendicular to $\\nabla F$. A horizontal tangent therefore means that the gradient points straight up or down, so $F_x = 0$ while $F_y \\ne 0$. The condition $F_x = 0$ gives a line through the origin here, and it must still be combined with the equation of the curve to find the actual points of tangency.",
    "等值线 $F(x, y) = k$ 的切线垂直于 $\\nabla F$。所以切线水平意味着梯度竖直朝上或朝下，即 $F_x = 0$ 而 $F_y \\ne 0$。条件 $F_x = 0$ 在这里给出一条过原点的直线，还必须与曲线方程联立，才能求出实际的切点。",
  ),
  generate(rng) {
    const a = rng.int(1, 3);
    const c = rng.int(2, 4);
    const m = rng.int(1, 4);
    const level = a * (c * a - 1) * m * m;
    const answer = -a * m;
    const form = poly([a, "x^2"], [2, "xy"], [c, "y^2"]);
    return numberProblem({
      prompt: t(
        `The level curve $${form} = ${level}$ has a horizontal tangent at two points. Find the $y$-coordinate of the one with $x > 0$.`,
        `等值线 $${form} = ${level}$ 在两点处有水平切线。求其中 $x > 0$ 的点的 $y$ 坐标。`,
      ),
      answer,
      form: "integer",
      wrong: [-answer, m, -m - 1, -c * m],
      solution: t(
        `Setting $F_x = ${poly([2 * a, "x"], [2, "y"])} = 0$ gives $y = ${a === 1 ? "-x" : `-${a}x`}$. Substituting in the curve gives $x = ${m}$, so $y = ${answer}$.`,
        `令 $F_x = ${poly([2 * a, "x"], [2, "y"])} = 0$，得 $y = ${a === 1 ? "-x" : `-${a}x`}$。代入曲线，得 $x = ${m}$，所以 $y = ${answer}$。`,
      ),
    });
  },
};

const distinctPartials: KnowledgePointDef = {
  id: "counting-the-different-partial-derivatives-of-a-given-order",
  title: t("Counting the different partial derivatives of a given order", "计算给定阶的不同偏导数个数"),
  explanation: t(
    "When mixed partial derivatives are continuous, the order of differentiation does not matter. A partial derivative of order $k$ is therefore decided by how many times each variable is used, and these counts are whole numbers adding to $k$. Stars and bars counts them as $\\binom{n + k - 1}{k}$. Without the equality of mixed partials, there would be $n^k$ different derivatives to find.",
    "当混合偏导数连续时，求导的顺序无关紧要。因此 $k$ 阶偏导数由每个变量被使用的次数决定，这些次数是和为 $k$ 的整数。隔板法给出个数 $\\binom{n + k - 1}{k}$。如果混合偏导数不相等，就要求 $n^k$ 个不同的导数。",
  ),
  generate(rng) {
    const n = rng.int(2, 7);
    const k = rng.int(2, 6);
    const answer = thirdPassChoose(n + k - 1, k);
    return numberProblem({
      prompt: t(
        `A function of ${n} variables has continuous partial derivatives of all orders. How many different partial derivatives of order ${k} can it have?`,
        `一个 ${n} 元函数具有各阶连续偏导数。它最多有多少个不同的 ${k} 阶偏导数？`,
      ),
      answer,
      form: "integer",
      wrong: [n ** k, n * k, k + 1, answer + 1],
      solution: t(
        `A derivative is decided by how many times each variable is used. So the count is $\\binom{${n + k - 1}}{${k}} = ${answer}$.`,
        `一个导数由每个变量被使用的次数决定。所以个数是 $\\binom{${n + k - 1}}{${k}} = ${answer}$。`,
      ),
    });
  },
};

const preimageArea: KnowledgePointDef = {
  id: "the-area-of-a-region-from-the-area-of-its-image",
  title: t("The area of a region from the area of its image", "由像的面积求原区域的面积"),
  explanation: t(
    "An affine transformation multiplies every area by $|\\det A|$, where $A$ is its matrix, and the translation has no effect on area. Its inverse is also affine, with matrix $A^{-1}$, whose determinant is $\\frac{1}{\\det A}$. So to go back from an image to the original region, divide by $|\\det A|$. There is no need to find the inverse map or to know the shape of the region.",
    "仿射变换把每个面积乘以 $|\\det A|$，其中 $A$ 是它的矩阵，平移对面积没有影响。它的逆也是仿射的，矩阵是 $A^{-1}$，行列式是 $\\frac{1}{\\det A}$。所以从像回到原区域，就除以 $|\\det A|$。不需要求出逆映射，也不需要知道区域的形状。",
  ),
  generate(rng) {
    let a = nonzero(rng, 4);
    const b = nonzero(rng, 4);
    const c = nonzero(rng, 4);
    const d = nonzero(rng, 4);
    if (a * d === b * c) a += a > 0 ? 1 : -1;
    const det = a * d - b * c;
    const size = Math.abs(det);
    const area = rng.int(2, 40);
    const e = rng.int(-5, 5);
    const g = rng.int(-5, 5);
    const answer = Q.of(area, size);
    return numberProblem({
      prompt: t(
        `The transformation $T(x, y) = (${poly([a, "x"], [b, "y"], [e, ""])}, ${poly([c, "x"], [d, "y"], [g, ""])})$ maps a region $S$ onto a region of area $${area}$. Find the area of $S$.`,
        `变换 $T(x, y) = (${poly([a, "x"], [b, "y"], [e, ""])}, ${poly([c, "x"], [d, "y"], [g, ""])})$ 把区域 $S$ 映到面积为 $${area}$ 的区域。求 $S$ 的面积。`,
      ),
      answer,
      wrong: [Q.of(area * size), Q.of(area), Q.of(area, Math.abs(a * d + b * c) || 1), answer.add(Q.of(1))],
      solution: t(
        `The determinant of the linear part is $${det}$, so areas are multiplied by $${size}$. Dividing $${area}$ by this gives $${answer.toLatex()}$.`,
        `线性部分的行列式是 $${det}$，所以面积乘以 $${size}$。用它除 $${area}$，得 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const largestSecondDirectional: KnowledgePointDef = {
  id: "the-largest-second-directional-derivative",
  title: t("The largest second directional derivative", "最大的二阶方向导数"),
  explanation: t(
    "The second directional derivative in the direction of a unit vector $\\mathbf{u}$ is $\\mathbf{u}^T H \\mathbf{u}$, where $H$ is the Hessian. For a symmetric matrix, this quantity is largest when $\\mathbf{u}$ is an eigenvector for the largest eigenvalue, and that eigenvalue is the largest value. A Hessian of the form $\\begin{pmatrix} p & q \\\\ q & p \\end{pmatrix}$ has eigenvalues $p + q$ and $p - q$, along the diagonal directions.",
    "沿单位向量 $\\mathbf{u}$ 的二阶方向导数是 $\\mathbf{u}^T H \\mathbf{u}$，其中 $H$ 是黑塞矩阵。对对称矩阵，当 $\\mathbf{u}$ 是最大特征值的特征向量时，这个量最大，最大值就是这个特征值。形如 $\\begin{pmatrix} p & q \\\\ q & p \\end{pmatrix}$ 的黑塞矩阵有特征值 $p + q$ 和 $p - q$，对应对角方向。",
  ),
  generate(rng) {
    const s = nonzero(rng, 6);
    const q = nonzero(rng, 9);
    const answer = 2 * s + Math.abs(q);
    return numberProblem({
      prompt: t(
        `Let $f(x, y) = ${poly([s, "x^2"], [q, "xy"], [s, "y^2"])}$. Find the largest value of the second directional derivative of $f$ over all unit vectors.`,
        `设 $f(x, y) = ${poly([s, "x^2"], [q, "xy"], [s, "y^2"])}$。求 $f$ 的二阶方向导数在所有单位向量上的最大值。`,
      ),
      answer,
      form: "integer",
      wrong: [2 * s, 2 * s - Math.abs(q), Math.abs(q), 2 * s * Math.abs(q)],
      solution: t(
        `The Hessian has diagonal entries $${2 * s}$ and off-diagonal entries $${q}$, so its eigenvalues are $${2 * s} \\pm ${Math.abs(q)}$. The larger is $${answer}$.`,
        `黑塞矩阵的对角元是 $${2 * s}$，非对角元是 $${q}$，所以特征值是 $${2 * s} \\pm ${Math.abs(q)}$。较大的是 $${answer}$。`,
      ),
    });
  },
};

const logarithmCrossTerm: KnowledgePointDef = {
  id: "the-cross-term-of-a-taylor-polynomial-of-a-logarithm",
  title: t("The cross term of a Taylor polynomial of a logarithm", "对数的泰勒多项式的交叉项"),
  explanation: t(
    "A Taylor polynomial of a composite function can be found without any partial derivatives. Put $w = ax + by$ into the one-variable series $\\ln(1 + w) = w - \\frac{w^2}{2} + \\dots$, and collect terms up to degree two. Only $-\\frac{w^2}{2}$ can produce a term in $xy$, and squaring $w$ gives $2ab\\,xy$ there. The higher terms of the series have degree at least three.",
    "复合函数的泰勒多项式不必求偏导数就能得到。把 $w = ax + by$ 代入一元级数 $\\ln(1 + w) = w - \\frac{w^2}{2} + \\dots$，并收集到二次为止的项。只有 $-\\frac{w^2}{2}$ 能产生 $xy$ 项，而 $w$ 的平方在那里给出 $2ab\\,xy$。级数的更高项次数至少是三。",
  ),
  generate(rng) {
    const a = nonzero(rng, 5);
    const b = nonzero(rng, 5);
    const answer = -a * b;
    return numberProblem({
      prompt: t(
        `Find the coefficient of $xy$ in the second-degree Taylor polynomial of $f(x, y) = \\ln(${poly([1, ""], [a, "x"], [b, "y"])})$ at $(0, 0)$.`,
        `求 $f(x, y) = \\ln(${poly([1, ""], [a, "x"], [b, "y"])})$ 在 $(0, 0)$ 处的二次泰勒多项式中 $xy$ 的系数。`,
      ),
      answer,
      wrong: [Q.of(a * b), Q.of(-a * b, 2), Q.of(-2 * a * b), Q.of(a + b)],
      solution: t(
        `The term $-\\frac{w^2}{2}$ with $w = ${poly([a, "x"], [b, "y"])}$ contains $-\\frac{1}{2} \\cdot 2 \\cdot ${inParens(a)} \\cdot ${inParens(b)}\\,xy$, so the coefficient is $${answer}$.`,
        `当 $w = ${poly([a, "x"], [b, "y"])}$ 时，$-\\frac{w^2}{2}$ 含有 $-\\frac{1}{2} \\cdot 2 \\cdot ${inParens(a)} \\cdot ${inParens(b)}\\,xy$，所以系数是 $${answer}$。`,
      ),
    });
  },
};

const lineAndParabolaMoment: KnowledgePointDef = {
  id: "integrating-x-between-a-line-and-a-parabola",
  title: t("Integrating x between a line and a parabola", "在直线和抛物线之间对 x 积分"),
  explanation: t(
    "A Type I region is described by first fixing $x$, then letting $y$ run from the lower curve to the upper curve. Here, the curves $y = x^2$ and $y = kx$ cross at $x = 0$ and $x = k$, and the line is on top between them. The inner integral then contributes the height of the region at $x$, multiplied by the integrand, leaving a single integral in $x$.",
    "I 型区域的描述方法是先固定 $x$，再让 $y$ 从下方曲线取到上方曲线。这里曲线 $y = x^2$ 和 $y = kx$ 相交于 $x = 0$ 和 $x = k$，其间直线在上方。于是内层积分给出区域在 $x$ 处的高度乘以被积函数，只剩下一个关于 $x$ 的积分。",
  ),
  generate(rng) {
    const k = rng.int(1, 6);
    const c = rng.int(1, 12);
    const answer = Q.of(c * k ** 4, 12);
    const line = k === 1 ? "x" : `${k}x`;
    const integrand = c === 1 ? "x" : `${c}x`;
    return numberProblem({
      prompt: t(
        `Evaluate $\\iint_D ${integrand}\\,dA$, where $D$ is the region between $y = x^2$ and $y = ${line}$.`,
        `计算 $\\iint_D ${integrand}\\,dA$，其中 $D$ 是 $y = x^2$ 和 $y = ${line}$ 之间的区域。`,
      ),
      answer,
      wrong: [Q.of(c * k ** 3, 6), Q.of(c * k ** 4, 6), Q.of(c * k ** 4, 4), Q.of(c * k ** 4, 3)],
      solution: t(
        `The integral is $\\int_0^{${k}} ${integrand}\\left(${line} - x^2\\right) dx$, and integrating gives $${answer.toLatex()}$.`,
        `积分是 $\\int_0^{${k}} ${integrand}\\left(${line} - x^2\\right) dx$，积分后得 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const reversingToIntegrate: KnowledgePointDef = {
  id: "reversing-the-order-when-an-inner-integral-is-impossible",
  title: t("Reversing the order when an inner integral is impossible", "内层积分无法计算时交换次序"),
  explanation: t(
    "Functions such as $\\sin(x^2)$ have no elementary antiderivative, so an iterated integral that integrates one with respect to $x$ first cannot be done as written. Sketching the region and describing it in the other order puts $y$ on the inside instead. The inner integral then produces a factor of $x$, and that factor is exactly what makes the substitution $u = x^2$ work on the outside.",
    "像 $\\sin(x^2)$ 这样的函数没有初等原函数，所以先对 $x$ 积分它的累次积分，按原样无法计算。画出区域，换一种次序描述，让 $y$ 在内层。于是内层积分产生一个因子 $x$，这个因子正好使外层的代换 $u = x^2$ 可行。",
  ),
  generate(rng) {
    const c = rng.int(1, 12);
    const [name, limit, value] = rng.pick([
      ["\\sin", "\\sqrt{\\pi}", Q.of(c)],
      ["\\sin", "\\sqrt{\\frac{\\pi}{2}}", Q.of(c, 2)],
      ["\\cos", "\\sqrt{\\frac{\\pi}{2}}", Q.of(c, 2)],
      ["\\cos", "\\sqrt{\\frac{\\pi}{6}}", Q.of(c, 4)],
    ] as const);
    const factor = c === 1 ? "" : `${c}`;
    return numberProblem({
      prompt: t(
        `Evaluate $\\int_0^{${limit}} \\int_y^{${limit}} ${factor}${name}(x^2)\\,dx\\,dy$.`,
        `计算 $\\int_0^{${limit}} \\int_y^{${limit}} ${factor}${name}(x^2)\\,dx\\,dy$。`,
      ),
      answer: value,
      wrong: [value.mul(Q.of(2)), value.div(Q.of(2)), Q.of(0), value.neg()],
      solution: t(
        `Reversing the order gives $\\int_0^{${limit}} \\int_0^{x} ${factor}${name}(x^2)\\,dy\\,dx = \\int_0^{${limit}} ${factor}x${name}(x^2)\\,dx$. With $u = x^2$, this equals $${value.toLatex()}$.`,
        `交换次序得 $\\int_0^{${limit}} \\int_0^{x} ${factor}${name}(x^2)\\,dy\\,dx = \\int_0^{${limit}} ${factor}x${name}(x^2)\\,dx$。令 $u = x^2$，它等于 $${value.toLatex()}$。`,
      ),
    });
  },
};

const averageOverBox: KnowledgePointDef = {
  id: "the-average-of-a-product-over-a-box",
  title: t("The average of a product over a box", "乘积在长方体上的平均值"),
  explanation: t(
    "The average of a function over a solid is its triple integral divided by the volume. When the integrand is a product of functions of separate variables on a box, the triple integral splits into three single integrals. Each factor of $\\int_0^a x\\,dx = \\frac{a^2}{2}$ then divides by the matching side $a$, leaving $\\frac{a}{2}$. So the average is the product of the averages of the three coordinates.",
    "函数在立体上的平均值是三重积分除以体积。当被积函数在长方体上是各变量函数的乘积时，三重积分可分成三个单积分。每个因子 $\\int_0^a x\\,dx = \\frac{a^2}{2}$ 除以相应的边 $a$，剩下 $\\frac{a}{2}$。所以平均值是三个坐标平均值的乘积。",
  ),
  generate(rng) {
    const c = rng.int(1, 9);
    const a = rng.int(1, 6);
    const b = rng.int(1, 6);
    const d = rng.int(1, 6);
    const answer = Q.of(c * a * b * d, 8);
    const integrand = c === 1 ? "xyz" : `${c}xyz`;
    return numberProblem({
      prompt: t(
        `Find the average value of $f(x, y, z) = ${integrand}$ over the box $[0, ${a}] \\times [0, ${b}] \\times [0, ${d}]$.`,
        `求 $f(x, y, z) = ${integrand}$ 在长方体 $[0, ${a}] \\times [0, ${b}] \\times [0, ${d}]$ 上的平均值。`,
      ),
      answer,
      wrong: [Q.of(c * (a * b * d) ** 2, 8), Q.of(c * a * b * d, 2), Q.of(c * a * b * d, 4), Q.of(a * b * d, 8)],
      solution: t(
        `The coordinates have averages $${Q.of(a, 2).toLatex()}$, $${Q.of(b, 2).toLatex()}$ and $${Q.of(d, 2).toLatex()}$. Multiplying them by $${c}$ gives $${answer.toLatex()}$.`,
        `各坐标的平均值是 $${Q.of(a, 2).toLatex()}$、$${Q.of(b, 2).toLatex()}$、$${Q.of(d, 2).toLatex()}$。它们与 $${c}$ 相乘，得 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const twoCylinders: KnowledgePointDef = {
  id: "the-volume-common-to-two-cylinders",
  title: t("The volume common to two cylinders", "两个圆柱的公共体积"),
  explanation: t(
    "The solid inside both $x^2 + y^2 = r^2$ and $x^2 + z^2 = r^2$ is easiest to slice at fixed $x$. At that value, $y$ and $z$ each run independently between $\\pm\\sqrt{r^2 - x^2}$, so the cross section is a square rather than a circle. Its area is a simple polynomial in $x$, and no circular functions appear, even though the solid is bounded entirely by curved cylinders.",
    "同时在 $x^2 + y^2 = r^2$ 和 $x^2 + z^2 = r^2$ 内部的立体，最容易在固定的 $x$ 处切片。这时 $y$ 和 $z$ 各自独立地在 $\\pm\\sqrt{r^2 - x^2}$ 之间变化，所以截面是正方形而不是圆。它的面积是 $x$ 的简单多项式，虽然立体完全由弯曲的圆柱面围成，却不出现三角函数。",
  ),
  generate(rng) {
    const r = rng.int(1, 15);
    const octant = rng.pick([true, false]);
    const whole = Q.of(16 * r ** 3, 3);
    const part = Q.of(2 * r ** 3, 3);
    const answer = octant ? part : whole;
    return numberProblem({
      prompt: t(
        `Find the volume of the ${octant ? "first-octant part of the " : ""}solid inside both $x^2 + y^2 = ${r * r}$ and $x^2 + z^2 = ${r * r}$.`,
        `求同时在 $x^2 + y^2 = ${r * r}$ 和 $x^2 + z^2 = ${r * r}$ 内部${octant ? "且位于第一卦限" : ""}的立体体积。`,
      ),
      answer,
      wrong: [octant ? whole : part, Q.of(8 * r ** 3, 3), Q.of(4 * r ** 3, 3), Q.of(r ** 3, 3), Q.of(16 * r ** 2, 3)],
      solution: t(
        `At fixed $x$ the cross section ${octant ? `is a square of side $\\sqrt{${r * r} - x^2}$, and integrating its area from $0$ to $${r}$` : `is a square of side $2\\sqrt{${r * r} - x^2}$, and integrating its area from $-${r}$ to $${r}$`} gives $${answer.toLatex()}$.`,
        `在固定的 $x$ 处，截面${octant ? `是边长为 $\\sqrt{${r * r} - x^2}$ 的正方形，它的面积从 $0$ 到 $${r}$ 积分` : `是边长为 $2\\sqrt{${r * r} - x^2}$ 的正方形，它的面积从 $-${r}$ 到 $${r}$ 积分`}得 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const distanceOverAnnulus: KnowledgePointDef = {
  id: "integrating-the-distance-from-the-origin-over-an-annulus",
  title: t("Integrating the distance from the origin over an annulus", "在圆环上对到原点的距离积分"),
  explanation: t(
    "In polar coordinates, $\\sqrt{x^2 + y^2}$ becomes $r$, and the area element is $r\\,dr\\,d\\theta$. The two factors of $r$ multiply, so the radial integral is of $r^2$ and not of $r$. An easy mistake is to forget the extra factor from the area element. The integrand does not depend on $\\theta$, so going all the way around the annulus just multiplies the result by $2\\pi$.",
    "在极坐标中，$\\sqrt{x^2 + y^2}$ 变成 $r$，面积元是 $r\\,dr\\,d\\theta$。两个因子 $r$ 相乘，所以径向积分的被积函数是 $r^2$ 而不是 $r$。一个常见的错误是忘记面积元的额外因子。被积函数与 $\\theta$ 无关，所以绕圆环一周只是把结果乘以 $2\\pi$。",
  ),
  generate(rng) {
    const a = rng.int(1, 6);
    const b = rng.int(a + 1, 9);
    const answer = Q.of(2 * (b ** 3 - a ** 3), 3);
    return numberProblem({
      prompt: t(
        `The integral of $\\sqrt{x^2 + y^2}$ over the annulus $${a * a} \\le x^2 + y^2 \\le ${b * b}$ equals $c\\pi$. Find $c$.`,
        `$\\sqrt{x^2 + y^2}$ 在圆环 $${a * a} \\le x^2 + y^2 \\le ${b * b}$ 上的积分等于 $c\\pi$。求 $c$。`,
      ),
      answer,
      wrong: [Q.of(b ** 3 - a ** 3, 3), Q.of(b * b - a * a), Q.of(2 * (b - a) ** 3, 3), answer.add(Q.of(1))],
      solution: t(
        `The integral is $\\int_0^{2\\pi} \\int_{${a}}^{${b}} r^2\\,dr\\,d\\theta = 2\\pi \\cdot \\frac{${b ** 3} - ${a ** 3}}{3}$, so $c = ${answer.toLatex()}$.`,
        `积分是 $\\int_0^{2\\pi} \\int_{${a}}^{${b}} r^2\\,dr\\,d\\theta = 2\\pi \\cdot \\frac{${b ** 3} - ${a ** 3}}{3}$，所以 $c = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const sphericalToCartesian: KnowledgePointDef = {
  id: "a-cartesian-coordinate-from-spherical-coordinates",
  title: t("A Cartesian coordinate from spherical coordinates", "由球坐标求直角坐标"),
  explanation: t(
    "With $\\varphi$ measured down from the positive $z$-axis, the distance of a point from the $z$-axis is $\\rho\\sin\\varphi$. This distance acts as the polar radius in the $xy$-plane, so $x = \\rho\\sin\\varphi\\cos\\theta$ and $y = \\rho\\sin\\varphi\\sin\\theta$. The height is $z = \\rho\\cos\\varphi$. Mixing up the two angles is the usual mistake, and the role of $\\sin\\varphi$ is the thing to remember.",
    "当 $\\varphi$ 从 $z$ 轴正向向下量时，点到 $z$ 轴的距离是 $\\rho\\sin\\varphi$。这个距离就是 $xy$ 平面上的极径，所以 $x = \\rho\\sin\\varphi\\cos\\theta$，$y = \\rho\\sin\\varphi\\sin\\theta$。高度是 $z = \\rho\\cos\\varphi$。常见的错误是把两个角弄混，要记住的是 $\\sin\\varphi$ 的作用。",
  ),
  generate(rng) {
    const rho = rng.int(2, 20);
    const [phi, sinPhi] = rng.pick([
      ["\\frac{\\pi}{6}", Q.of(1, 2)],
      ["\\frac{\\pi}{2}", Q.of(1)],
      ["\\frac{5\\pi}{6}", Q.of(1, 2)],
    ] as const);
    const [theta, cosTheta] = rng.pick([
      ["\\frac{\\pi}{3}", Q.of(1, 2)],
      ["\\frac{2\\pi}{3}", Q.of(-1, 2)],
      ["\\pi", Q.of(-1)],
      ["0", Q.of(1)],
    ] as const);
    const r = Q.of(rho);
    const answer = r.mul(sinPhi).mul(cosTheta);
    return numberProblem({
      prompt: t(
        `A point has spherical coordinates $\\rho = ${rho}$, $\\theta = ${theta}$ and $\\varphi = ${phi}$, with $\\varphi$ measured from the positive $z$-axis. Find its $x$-coordinate.`,
        `一个点的球坐标是 $\\rho = ${rho}$，$\\theta = ${theta}$，$\\varphi = ${phi}$，其中 $\\varphi$ 从 $z$ 轴正向量起。求它的 $x$ 坐标。`,
      ),
      answer,
      wrong: [r.mul(cosTheta), r.mul(sinPhi), answer.neg(), answer.mul(Q.of(2)), answer.add(Q.of(1))],
      solution: t(
        `Here $\\sin\\varphi = ${sinPhi.toLatex()}$ and $\\cos\\theta = ${cosTheta.toLatex()}$. So $x = \\rho\\sin\\varphi\\cos\\theta = ${answer.toLatex()}$.`,
        `这里 $\\sin\\varphi = ${sinPhi.toLatex()}$，$\\cos\\theta = ${cosTheta.toLatex()}$。所以 $x = \\rho\\sin\\varphi\\cos\\theta = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const averageAlongSegment: KnowledgePointDef = {
  id: "the-average-of-a-linear-function-along-a-segment",
  title: t("The average of a linear function along a segment", "线性函数沿线段的平均值"),
  explanation: t(
    "The average value of $f$ along a curve $C$ is $\\frac{1}{L}\\int_C f\\,ds$, where $L$ is the length. On a straight segment, a linear function changes at a steady rate with arc length, so its average is the value at the midpoint, and equals the average of the values at the two ends. So the length of the segment, which may be an awkward number, never needs to be computed.",
    "$f$ 沿曲线 $C$ 的平均值是 $\\frac{1}{L}\\int_C f\\,ds$，其中 $L$ 是长度。在直线段上，线性函数随弧长匀速变化，所以平均值就是中点处的值，也等于两端值的平均。所以线段的长度即使是不太好算的数，也根本不需要计算。",
  ),
  generate(rng) {
    const a = nonzero(rng, 6);
    const b = nonzero(rng, 6);
    const c = rng.int(-9, 9);
    const px = rng.int(-6, 6);
    const py = rng.int(-6, 6);
    const qx = px + nonzero(rng, 6);
    const qy = py + nonzero(rng, 6);
    const start = a * px + b * py + c;
    const end = a * qx + b * qy + c;
    const answer = Q.of(start + end, 2);
    return numberProblem({
      prompt: t(
        `Find the average value of $f(x, y) = ${poly([a, "x"], [b, "y"], [c, ""])}$ along the segment from $(${px}, ${py})$ to $(${qx}, ${qy})$.`,
        `求 $f(x, y) = ${poly([a, "x"], [b, "y"], [c, ""])}$ 沿从 $(${px}, ${py})$ 到 $(${qx}, ${qy})$ 的线段的平均值。`,
      ),
      answer,
      wrong: [Q.of(start), Q.of(end), Q.of(start + end), answer.add(Q.of(1))],
      solution: t(
        `The values at the ends are $${start}$ and $${end}$. Because $f$ changes steadily along the segment, the average is halfway between them, which is $${answer.toLatex()}$.`,
        `两端的值是 $${start}$ 和 $${end}$。由于 $f$ 沿线段匀速变化，平均值在它们的正中间，也就是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const workByRadialField: KnowledgePointDef = {
  id: "the-work-done-by-a-field-proportional-to-position",
  title: t("The work done by a field proportional to position", "与位置成正比的力场做的功"),
  explanation: t(
    "A force that points along the position vector, $\\mathbf{F} = k\\langle x, y \\rangle$, varies from point to point, so work is not a dot product with the displacement. But it is the gradient of $\\frac{k}{2}(x^2 + y^2)$. The fundamental theorem of line integrals then gives the work as the change in this potential, and the path taken between the two points makes no difference.",
    "沿位置向量方向的力 $\\mathbf{F} = k\\langle x, y \\rangle$ 随点而变，所以功不是它与位移的点积。但它是 $\\frac{k}{2}(x^2 + y^2)$ 的梯度。于是线积分基本定理给出功等于这个势的改变量，两点之间走哪条路径都没有区别。",
  ),
  generate(rng) {
    const k = nonzero(rng, 6);
    const px = rng.int(-6, 6);
    const py = nonzero(rng, 6);
    const qx = nonzero(rng, 6);
    const qy = rng.pick([...Array(13).keys()].map((i) => i - 6).filter((v) => qx * qx + v * v !== px * px + py * py));
    const start = px * px + py * py;
    const end = qx * qx + qy * qy;
    const answer = Q.of(k * (end - start), 2);
    const atStart = k * (px * (qx - px) + py * (qy - py));
    const atEnd = k * (qx * (qx - px) + qy * (qy - py));
    const field = k === 1 ? "" : k === -1 ? "-" : `${k}`;
    return numberProblem({
      prompt: t(
        `Find the work done by $\\mathbf{F}(x, y) = ${field}\\langle x, y \\rangle$ on a particle moving along a smooth path from $(${px}, ${py})$ to $(${qx}, ${qy})$.`,
        `求 $\\mathbf{F}(x, y) = ${field}\\langle x, y \\rangle$ 对沿光滑路径从 $(${px}, ${py})$ 运动到 $(${qx}, ${qy})$ 的质点做的功。`,
      ),
      answer,
      wrong: [Q.of(k * (end - start)), answer.neg(), Q.of(atStart), Q.of(atEnd)],
      solution: t(
        `A potential is $\\frac{k}{2}(x^2 + y^2)$ with $k = ${k}$, and $x^2 + y^2$ changes from $${start}$ to $${end}$. So the work is $${answer.toLatex()}$.`,
        `势函数是 $\\frac{k}{2}(x^2 + y^2)$，其中 $k = ${k}$，$x^2 + y^2$ 从 $${start}$ 变到 $${end}$。所以功是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const astroidArea: KnowledgePointDef = {
  id: "the-area-inside-an-astroid-from-greens-theorem",
  title: t("The area inside an astroid from Green's theorem", "用格林定理求星形线内的面积"),
  explanation: t(
    "Green's theorem turns the area of a region into $\\frac{1}{2}\\oint_C x\\,dy - y\\,dx$ around its boundary. This is especially useful for a curve given in parametric form, such as the astroid $x = a\\cos^3 t$, $y = a\\sin^3 t$, which would be awkward to describe as a function. Here, the integrand simplifies to $3a^2\\sin^2 t\\cos^2 t$, and only a single integral in $t$ remains.",
    "格林定理把区域的面积化成沿边界的 $\\frac{1}{2}\\oint_C x\\,dy - y\\,dx$。这对参数形式给出的曲线特别有用，例如星形线 $x = a\\cos^3 t$，$y = a\\sin^3 t$，它写成函数形式很不方便。这里被积函数化简为 $3a^2\\sin^2 t\\cos^2 t$，只剩下一个关于 $t$ 的积分。",
  ),
  generate(rng) {
    const a = rng.int(2, 30);
    const answer = Q.of(3 * a * a, 8);
    return numberProblem({
      prompt: t(
        `The area enclosed by the astroid $x = ${a}\\cos^3 t$, $y = ${a}\\sin^3 t$, $0 \\le t \\le 2\\pi$, equals $c\\pi$. Find $c$.`,
        `星形线 $x = ${a}\\cos^3 t$，$y = ${a}\\sin^3 t$，$0 \\le t \\le 2\\pi$ 围成的面积等于 $c\\pi$。求 $c$。`,
      ),
      answer,
      wrong: [Q.of(a * a), Q.of(3 * a * a, 4), Q.of(3 * a * a, 16), Q.of(3 * a, 8)],
      solution: t(
        `The integrand is $${3 * a * a}\\sin^2 t\\cos^2 t$, and $\\int_0^{2\\pi} \\sin^2 t\\cos^2 t\\,dt = \\frac{\\pi}{4}$. Half of the product is $${answer.toLatex()}\\pi$.`,
        `被积函数是 $${3 * a * a}\\sin^2 t\\cos^2 t$，且 $\\int_0^{2\\pi} \\sin^2 t\\cos^2 t\\,dt = \\frac{\\pi}{4}$。乘积的一半是 $${answer.toLatex()}\\pi$。`,
      ),
    });
  },
};

const coneSurfaceArea: KnowledgePointDef = {
  id: "the-area-of-a-cone-above-a-disk",
  title: t("The area of a cone above a disk", "圆盘上方的圆锥面积"),
  explanation: t(
    "The surface area above a region is $\\iint_D \\sqrt{1 + z_x^2 + z_y^2}\\,dA$. On the cone $z = k\\sqrt{x^2 + y^2}$, the two partial derivatives change from point to point, but $z_x^2 + z_y^2 = k^2$ everywhere. So the square root is a constant, and the surface area is that constant times the area of the region below. The tilt of the cone is the same at all its points.",
    "区域上方的曲面面积是 $\\iint_D \\sqrt{1 + z_x^2 + z_y^2}\\,dA$。在圆锥面 $z = k\\sqrt{x^2 + y^2}$ 上，两个偏导数随点而变，但处处有 $z_x^2 + z_y^2 = k^2$。所以平方根是常数，曲面面积就是这个常数乘以下方区域的面积。圆锥在所有点的倾斜程度都相同。",
  ),
  generate(rng) {
    const [p, q, h] = rng.pick(pythagoreanSlopes);
    const r = rng.int(2, 9);
    const answer = Q.of(h * r * r, q);
    const slope = Q.of(p, q);
    return numberProblem({
      prompt: t(
        `The part of the cone $z = ${slope.toLatex()}\\sqrt{x^2 + y^2}$ above the disk $x^2 + y^2 \\le ${r * r}$ has area $c\\pi$. Find $c$.`,
        `圆锥面 $z = ${slope.toLatex()}\\sqrt{x^2 + y^2}$ 在圆盘 $x^2 + y^2 \\le ${r * r}$ 上方部分的面积是 $c\\pi$。求 $c$。`,
      ),
      answer,
      wrong: [Q.of(r * r), Q.of(p * r * r, q), Q.of(h * h * r * r, q * q), Q.of(h * r, q)],
      solution: t(
        `Here $\\sqrt{1 + z_x^2 + z_y^2} = \\sqrt{1 + \\left(${slope.toLatex()}\\right)^2} = ${Q.of(h, q).toLatex()}$, and the disk has area $${r * r}\\pi$. So $c = ${answer.toLatex()}$.`,
        `这里 $\\sqrt{1 + z_x^2 + z_y^2} = \\sqrt{1 + \\left(${slope.toLatex()}\\right)^2} = ${Q.of(h, q).toLatex()}$，圆盘的面积是 $${r * r}\\pi$。所以 $c = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const integralOverCylinder: KnowledgePointDef = {
  id: "integrating-the-height-over-a-cylinder",
  title: t("Integrating the height over a cylinder", "在圆柱面上对高度积分"),
  explanation: t(
    "A surface integral over a parametrized surface is $\\iint f\\,\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\|\\,du\\,dv$. On the cylinder $\\langle R\\cos u, R\\sin u, v \\rangle$, the length of the cross product is just $R$, so the area element is $R\\,du\\,dv$. Then a function of the height alone integrates to the factor $2\\pi$ around the cylinder times a single integral along its height.",
    "参数曲面上的曲面积分是 $\\iint f\\,\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\|\\,du\\,dv$。在圆柱面 $\\langle R\\cos u, R\\sin u, v \\rangle$ 上，叉积的长度就是 $R$，所以面积元是 $R\\,du\\,dv$。于是只与高度有关的函数，积分结果是绕圆柱一周的因子 $2\\pi$ 乘以沿高度的单积分。",
  ),
  generate(rng) {
    const c = rng.int(1, 6);
    const r = rng.int(2, 9);
    const h = rng.int(1, 9);
    const answer = c * r * h * h;
    const integrand = c === 1 ? "z" : `${c}z`;
    return numberProblem({
      prompt: t(
        `The surface $S$ is the side of the cylinder $x^2 + y^2 = ${r * r}$, $0 \\le z \\le ${h}$. The integral $\\iint_S ${integrand}\\,dS$ equals $c\\pi$. Find $c$.`,
        `曲面 $S$ 是圆柱 $x^2 + y^2 = ${r * r}$，$0 \\le z \\le ${h}$ 的侧面。积分 $\\iint_S ${integrand}\\,dS$ 等于 $c\\pi$。求 $c$。`,
      ),
      answer,
      form: "integer",
      wrong: [c * r * h, c * r * r * h, 2 * answer, c * h * h, answer + 1],
      solution: t(
        `The area element is $${r}\\,du\\,dv$, so the integral is $${r} \\cdot 2\\pi \\cdot \\int_0^{${h}} ${integrand}\\,dz = ${answer}\\pi$.`,
        `面积元是 $${r}\\,du\\,dv$，所以积分是 $${r} \\cdot 2\\pi \\cdot \\int_0^{${h}} ${integrand}\\,dz = ${answer}\\pi$。`,
      ),
    });
  },
};

const inverseSquareFlux: KnowledgePointDef = {
  id: "the-flux-of-an-inverse-square-field-through-a-sphere",
  title: t("The flux of an inverse square field through a sphere", "平方反比场穿过球面的通量"),
  explanation: t(
    "On a sphere of radius $R$ centered at the origin, the field $\\mathbf{F} = k\\frac{\\mathbf{r}}{\\|\\mathbf{r}\\|^3}$ points along the outward normal, with constant size $\\frac{|k|}{R^2}$. Multiplying by the area $4\\pi R^2$ cancels the radius, so every such sphere gets the same flux. The divergence theorem cannot be used directly on the ball here, because the field is not defined at the center.",
    "在以原点为心、半径为 $R$ 的球面上，场 $\\mathbf{F} = k\\frac{\\mathbf{r}}{\\|\\mathbf{r}\\|^3}$ 沿外法线方向，大小恒为 $\\frac{|k|}{R^2}$。乘以面积 $4\\pi R^2$，半径就消去了，所以所有这样的球面通量都相同。这里不能直接对球体用散度定理，因为场在球心没有定义。",
  ),
  generate(rng) {
    const k = nonzero(rng, 9);
    const r = rng.int(2, 9);
    const answer = 4 * k;
    const field = k === 1 ? "" : k === -1 ? "-" : `${k}`;
    return numberProblem({
      prompt: t(
        `The outward flux of $\\mathbf{F} = ${field}\\frac{\\langle x, y, z \\rangle}{(x^2 + y^2 + z^2)^{3/2}}$ through the sphere $x^2 + y^2 + z^2 = ${r * r}$ equals $c\\pi$. Find $c$.`,
        `$\\mathbf{F} = ${field}\\frac{\\langle x, y, z \\rangle}{(x^2 + y^2 + z^2)^{3/2}}$ 穿过球面 $x^2 + y^2 + z^2 = ${r * r}$ 的外向通量等于 $c\\pi$。求 $c$。`,
      ),
      answer,
      form: "integer",
      wrong: [0, 4 * k * r * r, 4 * k * r, k, -answer],
      solution: t(
        `On the sphere, $\\mathbf{F} \\cdot \\mathbf{n} = ${Q.of(k, r * r).toLatex()}$, and the area is $${4 * r * r}\\pi$. The product is $${answer}\\pi$.`,
        `在球面上，$\\mathbf{F} \\cdot \\mathbf{n} = ${Q.of(k, r * r).toLatex()}$，面积是 $${4 * r * r}\\pi$。乘积是 $${answer}\\pi$。`,
      ),
    });
  },
};

const diskMoment: KnowledgePointDef = {
  id: "the-moment-of-inertia-of-a-disk-about-a-diameter",
  title: t("The moment of inertia of a disk about a diameter", "圆盘对直径的转动惯量"),
  explanation: t(
    "The moment $I_x = \\iint \\rho y^2\\,dA$ of a disk is easy in polar coordinates, but symmetry makes it easier still. A disk centered at the origin has $I_x = I_y$, and these add to the polar moment $I_0 = \\iint \\rho r^2\\,dA = \\frac{\\pi\\rho R^4}{2}$, because $x^2 + y^2 = r^2$. So the moment about a diameter is exactly half of the moment about the center.",
    "圆盘的转动惯量 $I_x = \\iint \\rho y^2\\,dA$ 用极坐标很容易求，但利用对称性更容易。以原点为心的圆盘有 $I_x = I_y$，它们之和是极惯性矩 $I_0 = \\iint \\rho r^2\\,dA = \\frac{\\pi\\rho R^4}{2}$，因为 $x^2 + y^2 = r^2$。所以对直径的转动惯量恰好是对圆心的转动惯量的一半。",
  ),
  generate(rng) {
    const density = rng.int(1, 9);
    const r = rng.int(1, 6);
    const answer = Q.of(density * r ** 4, 4);
    return numberProblem({
      prompt: t(
        `A disk $x^2 + y^2 \\le ${r * r}$ has constant density $${density}$. Its moment of inertia about the $x$-axis equals $c\\pi$. Find $c$.`,
        `圆盘 $x^2 + y^2 \\le ${r * r}$ 的密度恒为 $${density}$。它对 $x$ 轴的转动惯量等于 $c\\pi$。求 $c$。`,
      ),
      answer,
      wrong: [Q.of(density * r ** 4, 2), Q.of(density * r ** 4, 8), Q.of(density * r ** 3, 3), Q.of(density * r * r, 2)],
      solution: t(
        `The polar moment is $\\frac{${density} \\cdot ${r ** 4}}{2}\\pi$, and $I_x$ is half of it by symmetry. So $c = ${answer.toLatex()}$.`,
        `极惯性矩是 $\\frac{${density} \\cdot ${r ** 4}}{2}\\pi$，由对称性，$I_x$ 是它的一半。所以 $c = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const rectangleCentralMoment: KnowledgePointDef = {
  id: "the-moment-of-inertia-of-a-rectangle-about-a-central-axis",
  title: t("The moment of inertia of a rectangle about a central axis", "矩形对中心轴的转动惯量"),
  explanation: t(
    "For an axis through the center of a uniform rectangle, parallel to a side, the distance to the axis runs from $-\\frac{h}{2}$ to $\\frac{h}{2}$. Integrating the squared distance over the rectangle gives $\\frac{\\rho wh^3}{12}$, which is a quarter of the moment about the edge. Only the height across the axis is cubed. This is why a beam is stiffer when set on its narrow side.",
    "对过均匀矩形中心、平行于一边的轴，到轴的距离从 $-\\frac{h}{2}$ 变到 $\\frac{h}{2}$。距离平方在矩形上积分，得 $\\frac{\\rho wh^3}{12}$，是对边的转动惯量的四分之一。只有垂直于轴的高度取三次方。这就是梁竖放时更坚固的原因。",
  ),
  generate(rng) {
    const density = rng.int(1, 6);
    const w = rng.int(1, 9);
    const h = rng.pick([...Array(9).keys()].map((i) => i + 1).filter((v) => v !== w));
    const answer = Q.of(density * w * h ** 3, 12);
    return numberProblem({
      prompt: t(
        `A rectangle of width ${w} along the $x$-axis and height ${h} along the $y$-axis has constant density $${density}$. Find its moment of inertia about the horizontal line through its center.`,
        `一个矩形沿 $x$ 轴宽 ${w}、沿 $y$ 轴高 ${h}，密度恒为 $${density}$。求它对过其中心的水平线的转动惯量。`,
      ),
      answer,
      wrong: [Q.of(density * w * h ** 3, 3), Q.of(density * h * w ** 3, 12), Q.of(density * w * h * h, 12), answer.add(Q.of(1))],
      solution: t(
        `The integral is $${density} \\cdot ${w} \\cdot \\int_{-h/2}^{h/2} y^2\\,dy$ with $h = ${h}$, and it equals $${answer.toLatex()}$.`,
        `当 $h = ${h}$ 时，积分是 $${density} \\cdot ${w} \\cdot \\int_{-h/2}^{h/2} y^2\\,dy$，它等于 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const annulusGyration: KnowledgePointDef = {
  id: "the-radius-of-gyration-of-an-annulus",
  title: t("The radius of gyration of an annulus", "圆环的回转半径"),
  explanation: t(
    "The squared radius of gyration is the moment of inertia divided by the mass, so the density cancels. For an annulus about its center, these are integrals in polar coordinates, of $r^3$ and of $r$ respectively. Factoring a difference of squares simplifies the ratio to $\\frac{a^2 + b^2}{2}$. A thin ring has all its mass near one radius, so this agrees with the limit $R^2$.",
    "回转半径的平方是转动惯量除以质量，所以密度消去了。对圆环关于圆心，这两者是极坐标下分别对 $r^3$ 和 $r$ 的积分。分解平方差后，比值化简为 $\\frac{a^2 + b^2}{2}$。细圆环的质量都集中在一个半径附近，这与极限 $R^2$ 相符。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const b = rng.int(a + 1, 12);
    const answer = Q.of(a * a + b * b, 2);
    return numberProblem({
      prompt: t(
        `A uniform annulus has inner radius ${a} and outer radius ${b}. Find the square of its radius of gyration about the center.`,
        `一个均匀圆环的内半径是 ${a}，外半径是 ${b}。求它关于圆心的回转半径的平方。`,
      ),
      answer,
      wrong: [Q.of(b * b - a * a, 2), Q.of((a + b) ** 2, 4), Q.of(a * a + b * b), Q.of(b * b, 2)],
      solution: t(
        `The ratio of the integrals is $\\frac{(${b}^4 - ${a}^4)/4}{(${b}^2 - ${a}^2)/2} = \\frac{${a}^2 + ${b}^2}{2} = ${answer.toLatex()}$.`,
        `两个积分之比是 $\\frac{(${b}^4 - ${a}^4)/4}{(${b}^2 - ${a}^2)/2} = \\frac{${a}^2 + ${b}^2}{2} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const expectedCoordinate: KnowledgePointDef = {
  id: "an-expected-coordinate-from-a-joint-density",
  title: t("An expected coordinate from a joint density", "由联合密度求坐标的期望"),
  explanation: t(
    "When a joint density on a rectangle is a product of a function of $x$ and a function of $y$, the two variables are independent. The density of $X$ alone then follows from its own factor, normalized over its own interval, and $y$ plays no further part. For a density proportional to $xy$, this gives $X$ a density proportional to $x$, whose mean is two thirds of the way along.",
    "当矩形上的联合密度是 $x$ 的函数与 $y$ 的函数之积时，两个变量相互独立。于是 $X$ 的密度由它自己的因子在自己的区间上归一化得到，$y$ 不再起作用。对与 $xy$ 成正比的密度，$X$ 的密度与 $x$ 成正比，它的均值在区间的三分之二处。",
  ),
  generate(rng) {
    const a = rng.int(1, 12);
    const b = rng.pick([...Array(12).keys()].map((i) => i + 1).filter((v) => v !== a));
    const answer = Q.of(2 * a, 3);
    return numberProblem({
      prompt: t(
        `$f(x, y) = Cxy$ is a joint density on $[0, ${a}] \\times [0, ${b}]$. Find $E(X)$.`,
        `$f(x, y) = Cxy$ 是 $[0, ${a}] \\times [0, ${b}]$ 上的联合密度。求 $E(X)$。`,
      ),
      answer,
      wrong: [Q.of(a, 2), Q.of(2 * b, 3), Q.of(a, 3), Q.of(3 * a, 4)],
      solution: t(
        `The variable $X$ has density proportional to $x$ on $[0, ${a}]$. So $E(X) = \\frac{\\int_0^{${a}} x^2\\,dx}{\\int_0^{${a}} x\\,dx} = ${answer.toLatex()}$.`,
        `变量 $X$ 在 $[0, ${a}]$ 上的密度与 $x$ 成正比。所以 $E(X) = \\frac{\\int_0^{${a}} x^2\\,dx}{\\int_0^{${a}} x\\,dx} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const streamCondition: KnowledgePointDef = {
  id: "the-coefficient-that-allows-a-stream-function",
  title: t("The coefficient that allows a stream function", "使流函数存在的系数"),
  explanation: t(
    "A stream function satisfies $P = \\psi_y$ and $Q = -\\psi_x$. Since the mixed partial derivatives of $\\psi$ agree, this forces $P_x = \\psi_{yx} = \\psi_{xy} = -Q_y$, which is to say that the divergence $P_x + Q_y$ is zero. So a flow in the whole plane has a stream function exactly when it is incompressible. This test can be applied before trying to find $\\psi$ itself.",
    "流函数满足 $P = \\psi_y$ 和 $Q = -\\psi_x$。由于 $\\psi$ 的混合偏导数相等，这就要求 $P_x = \\psi_{yx} = \\psi_{xy} = -Q_y$，也就是说散度 $P_x + Q_y$ 为零。所以全平面上的流存在流函数，当且仅当它不可压缩。在尝试求 $\\psi$ 本身之前，可以先做这个检验。",
  ),
  generate(rng) {
    const a = nonzero(rng, 9);
    const b = nonzero(rng, 9);
    const c = nonzero(rng, 9);
    const answer = -a;
    return numberProblem({
      prompt: t(
        `Find $k$ so that the flow $\\mathbf{F}(x, y) = \\langle ${poly([a, "x"], [b, "y"])}, ${poly([c, "x"])} + ky \\rangle$ has a stream function.`,
        `求 $k$，使流 $\\mathbf{F}(x, y) = \\langle ${poly([a, "x"], [b, "y"])}, ${poly([c, "x"])} + ky \\rangle$ 存在流函数。`,
      ),
      answer,
      form: "integer",
      wrong: [a, b, c, -b, -c],
      solution: t(
        `The divergence is $${a} + k$, and it must be zero. So $k = ${answer}$.`,
        `散度是 $${a} + k$，它必须为零。所以 $k = ${answer}$。`,
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
  "the-arc-length-of-a-vector-valued-function": [helixLength],
  "parameterization-by-arc-length": [pointAtArcLengthOnHelix],
  "introduction-to-curvature": [helixCurvature],
  "radius-of-curvature": [radiusAtParabolaVertex],
  "properties-of-the-divergence-operator": [divergenceOfRadialPower],
  "properties-of-the-curl-operator": [curlOfRotation],
  paraboloids: [paraboloidCap],
  "elliptic-cones": [ellipticConeVolume],
  "affine-transformations": [affineCommutator],
  "the-derivative-of-a-multivariable-function": [derivativeOfComposition],
  "calculating-global-extrema-of-multivariable-functions": [linearMaxOnTriangle],
  "optimizing-multivariable-functions-using-lagrange-multipliers": [closestToOrigin],
  "double-summations": [triangularDoubleSum],
  "partitions-of-intervals": [subintervalsForMesh],
  "double-integrals-over-rectangular-domains": [integralWithMaxMin],
  "triple-integrals-over-type-i-regions": [tetrahedronMoment],
  "path-independence-of-line-integrals": [conservativeConstant],
  "the-components-of-acceleration": [normalFromTotal],
  "the-average-value-of-a-multivariable-function": [averageOfProductOnTriangle],
  "density-mass-and-charge-of-plane-laminas": [chargeOnDisk],
  "moments-and-centers-of-mass-of-plane-laminas": [semidiskCentroid],
  "moments-and-centers-of-mass-of-thin-rods": [rodWithPowerDensity],
  "calculating-probabilities-with-continuous-random-variables": [probabilityOneBelowOther],
  "joint-distributions-for-continuous-random-variables": [marginalOnTriangle],
  "continuous-random-variables-over-infinite-domains": [minimumOfExponentials],
  "areas-of-parametric-surfaces": [torusArea],
  "surface-integrals-over-parametric-surfaces": [sphereSecondMoment],
  "differentiating-under-the-integral-sign": [integralWithLog],
  "flux-in-three-dimensional-vector-fields": [fluxThroughTiltedTriangle],
  "the-curvature-of-a-plane-curve": [curvatureWithSlope],
  "differentiation-rules-for-vector-valued-functions": [squaredLengthRate],
  hyperboloids: [gapBetweenSheets],
  ellipsoids: [ellipsoidSliceArea],
  "linearization-of-multivariable-functions": [linearizationError],
  "tangent-lines-to-level-curves": [horizontalTangent],
  "equality-of-mixed-partial-derivatives": [distinctPartials],
  "the-inverse-of-an-affine-transformation": [preimageArea],
  "the-second-derivative-of-a-multivariable-function": [largestSecondDirectional],
  "second-degree-taylor-polynomials-of-multivariable-functions": [logarithmCrossTerm],
  "double-integrals-over-type-i-regions": [lineAndParabolaMoment],
  "changing-the-order-of-integration-in-double-integrals": [reversingToIntegrate],
  "triple-integrals-over-rectangular-domains": [averageOverBox],
  "calculating-volumes-of-solids-using-triple-integrals": [twoCylinders],
  "double-integrals-between-polar-curves": [distanceOverAnnulus],
  "spherical-polar-coordinates": [sphericalToCartesian],
  "line-integrals-of-scalar-functions-over-line-segments": [averageAlongSegment],
  "work-done-by-a-force-field": [workByRadialField],
  "calculating-areas-using-greens-theorem": [astroidArea],
  "areas-of-surfaces": [coneSurfaceArea],
  "parametrizations-of-cylinders": [integralOverCylinder],
  "flux-through-closed-surfaces": [inverseSquareFlux],
  "moments-of-inertia-of-laminas-about-the-coordinate-axes": [diskMoment],
  "moments-of-inertia-of-laminas-about-other-axes": [rectangleCentralMoment],
  "calculating-the-radius-of-gyration-of-a-plane-lamina": [annulusGyration],
  "probability-density-functions-of-continuous-random-variables": [expectedCoordinate],
  "stream-functions": [streamCondition],
};
