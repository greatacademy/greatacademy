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
        `Let $\\mathbf{F} = |\\mathbf{r}|${k === 1 ? "" : `^${k}`}\\,\\mathbf{r}$, where $\\mathbf{r} = \\langle x, y, z \\rangle$. Find $\\nabla \\cdot \\mathbf{F}$ at the point $(${point.join(", ")})$.`,
        `设 $\\mathbf{F} = |\\mathbf{r}|${k === 1 ? "" : `^${k}`}\\,\\mathbf{r}$，其中 $\\mathbf{r} = \\langle x, y, z \\rangle$。求 $\\nabla \\cdot \\mathbf{F}$ 在点 $(${point.join(", ")})$ 处的值。`,
      ),
      answer,
      form: "integer",
      wrong: [3 * size, k * size, (k + 3) * rho ** (k - 1)],
      solution: t(
        `Here $|\\mathbf{r}| = ${rho}$, and the divergence is $(${k} + 3)|\\mathbf{r}|${k === 1 ? "" : `^${k}`} = ${k + 3} \\cdot ${size} = ${answer}$.`,
        `这里 $|\\mathbf{r}| = ${rho}$，散度是 $(${k} + 3)|\\mathbf{r}|${k === 1 ? "" : `^${k}`} = ${k + 3} \\cdot ${size} = ${answer}$。`,
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
};
