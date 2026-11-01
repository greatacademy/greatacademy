import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import { numberProblem, pointProblem, vectorLatex } from "../problems.ts";
import { type Poly, pAt, pDer, pLatex } from "./calculus-common.ts";
import { intQ } from "./calculus-ii-areas.ts";
import { coef } from "./calculus-ii-substitution.ts";

// Calculus II unit 3: Vector-Valued Functions (module 3.14) and The Planar Motion of a Particle (module 3.15).

/** tL writes a polynomial in t. */
const tL = (p: Poly) => pLatex(p, "t");

/** vec writes a vector whose components are LaTeX. */
const vec = (x: string, y: string) => `\\left\\langle ${x}, ${y} \\right\\rangle`;

/** Pair is a vector with rational components. */
type Pair = readonly [Q, Q];

/** pairL writes a vector with rational components. */
const pairL = (v: Pair) => vectorLatex(v);

/** add adds two vectors. */
const add = (u: Pair, v: Pair): Pair => [u[0].add(v[0]), u[1].add(v[1])];

/** scale multiplies a vector by a rational number. */
const scale = (k: Q, v: Pair): Pair => [k.mul(v[0]), k.mul(v[1])];

/** Component is one coordinate function of a vector-valued function. */
interface Component {
  readonly tex: string;
  /** at evaluates the component; transcendental components are only evaluated at t = 0. */
  readonly at: (t0: number) => Q;
  readonly der: () => Component;
}

/** polyC is a polynomial component. */
const polyC = (p: Poly): Component => ({ tex: tL(p), at: (t0) => Q.of(pAt(p, t0)), der: () => polyC(pDer(p)) });

/** argL writes kt as the argument of a function. */
const argL = (k: number) => `${coef(Q.of(k))}t`;

/** expC is the component c e^{kt}. */
const expC = (c: number, k: number): Component => ({
  tex: `${coef(Q.of(c))}e^{${argL(k)}}`,
  at: () => Q.of(c),
  der: () => expC(c * k, k),
});

/** sinC is the component c sin(kt). */
const sinC = (c: number, k: number): Component => ({
  tex: `${coef(Q.of(c))}\\sin(${argL(k)})`,
  at: () => Q.zero,
  der: () => cosC(c * k, k),
});

/** cosC is the component c cos(kt). */
const cosC = (c: number, k: number): Component => ({
  tex: `${coef(Q.of(c))}\\cos(${argL(k)})`,
  at: () => Q.of(c),
  der: () => sinC(-c * k, k),
});

/** randomPoly chooses a polynomial in t of degree 2 or 3. */
const randomPoly = (rng: Rng): Poly => [rng.int(-5, 5), rng.int(-4, 4), rng.nonZero(-3, 3), rng.int(-1, 1)];

/** quadratic chooses a polynomial in t of degree at most 2 that is not constant. */
const quadratic = (rng: Rng): Poly => [rng.int(-5, 5), rng.nonZero(-4, 4), rng.int(-3, 3)];

/** linear chooses a polynomial in t of degree at most 1. */
const linear = (rng: Rng): Poly => [rng.int(-6, 6), rng.nonZero(-3, 3)];

/** at evaluates a polynomial vector at t0. */
const at = (x: Poly, y: Poly, t0: number): Pair => [Q.of(pAt(x, t0)), Q.of(pAt(y, t0))];

/** integral integrates a polynomial vector from a to b. */
const integral = (x: Poly, y: Poly, a: number, b: number): Pair => [intQ(x, a, b), intQ(y, a, b)];

/** enterVector asks for the answer as a vector. */
const enterVector = t("Enter the vector as $\\langle a, b \\rangle$.", "以 $\\langle a, b \\rangle$ 的形式填写向量。");

/** evaluateVectorFunction evaluates a polynomial vector-valued function. */
function evaluateVectorFunction(rng: Rng) {
  const [x, y] = [randomPoly(rng), randomPoly(rng)];
  const t0 = rng.int(-3, 3);
  const answer = at(x, y, t0);
  return pointProblem({
    prompt: t(
      `Let $\\mathbf{r}(t) = ${vec(tL(x), tL(y))}$. Find $\\mathbf{r}(${t0})$. ${enterVector.en}`,
      `设 $\\mathbf{r}(t) = ${vec(tL(x), tL(y))}$。求 $\\mathbf{r}(${t0})$。${enterVector["zh-CN"]}`,
    ),
    answer,
    vector: true,
    wrong: [[answer[1], answer[0]], at(x, y, -t0), at(x, y, 0)],
    solution: t(
      `Evaluate each component at $t = ${t0}$: $x(${t0}) = ${answer[0].toLatex()}$ and $y(${t0}) = ${answer[1].toLatex()}$, so $\\mathbf{r}(${t0}) = ${pairL(answer)}$.`,
      `把 $t = ${t0}$ 代入每个分量：$x(${t0}) = ${answer[0].toLatex()}$，$y(${t0}) = ${answer[1].toLatex()}$，所以 $\\mathbf{r}(${t0}) = ${pairL(answer)}$。`,
    ),
  });
}

/** vectorLimit takes the limit of a vector-valued function component by component. */
function vectorLimit(rng: Rng) {
  const a = rng.int(-3, 3);
  const y = quadratic(rng);
  const yv = Q.of(pAt(y, a));
  const k = rng.int(2, 6);
  const [xTex, xv, xWork] =
    a === 0
      ? [`\\frac{\\sin(${k}t)}{t}`, Q.of(k), `$\\frac{\\sin(${k}t)}{t} = ${k} \\cdot \\frac{\\sin(${k}t)}{${k}t} \\to ${k}$`]
      : [
          `\\frac{t^{2} - ${a * a}}{t ${a < 0 ? "+" : "-"} ${Math.abs(a)}}`,
          Q.of(2 * a),
          `$\\frac{t^{2} - ${a * a}}{t ${a < 0 ? "+" : "-"} ${Math.abs(a)}} = t ${a < 0 ? "-" : "+"} ${Math.abs(a)} \\to ${2 * a}$`,
        ];
  const answer: Pair = [xv, yv];
  return pointProblem({
    prompt: t(
      `Let $\\mathbf{r}(t) = ${vec(xTex, tL(y))}$. Find $\\lim\\limits_{t \\to ${a}} \\mathbf{r}(t)$. ${enterVector.en}`,
      `设 $\\mathbf{r}(t) = ${vec(xTex, tL(y))}$。求 $\\lim\\limits_{t \\to ${a}} \\mathbf{r}(t)$。${enterVector["zh-CN"]}`,
    ),
    answer,
    vector: true,
    wrong: [
      [Q.zero, yv],
      [a === 0 ? Q.one : Q.of(a), yv],
      [yv, xv],
    ],
    solution: t(
      `Take the limit of each component. ${xWork} and $${tL(y)} \\to ${yv.toLatex()}$, so the limit is $${pairL(answer)}$.`,
      `对每个分量分别求极限。${xWork}，$${tL(y)} \\to ${yv.toLatex()}$，所以极限为 $${pairL(answer)}$。`,
    ),
  });
}

/** definingVectorValuedFunctions introduces functions whose values are vectors. */
export const definingVectorValuedFunctions: TopicDef = {
  id: "defining-vector-valued-functions",
  title: t("Defining Vector-Valued Functions", "向量值函数的定义"),
  summary: t(
    "A vector-valued function r(t) = ⟨x(t), y(t)⟩ assigns a vector to each t; it is evaluated and its limits are taken component by component.",
    "向量值函数 r(t) = ⟨x(t), y(t)⟩ 给每个 t 对应一个向量；求值和求极限都按分量进行。",
  ),
  prerequisites: [
    "two-dimensional-vectors-expressed-in-component-form",
    "graphing-curves-defined-parametrically",
    "calculating-limits-of-rational-functions-by-factoring",
  ],
  encompasses: [{ topic: "two-dimensional-vectors-expressed-in-component-form", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "evaluating-vector-valued-functions",
      title: t("Evaluating vector-valued functions", "向量值函数求值"),
      explanation: t(
        "A **vector-valued function** $\\mathbf{r}(t) = \\langle x(t), y(t) \\rangle$ gives a vector for each value of $t$. Its **component functions** $x(t)$ and $y(t)$ are ordinary functions. Placed with its tail at the origin, $\\mathbf{r}(t)$ points to the point $(x(t), y(t))$, which traces the parametric curve.\n\nTo evaluate, substitute into each component: for $\\mathbf{r}(t) = \\langle t^{2}, 3t - 1 \\rangle$, $\\mathbf{r}(2) = \\langle 4, 5 \\rangle$.",
        "**向量值函数** $\\mathbf{r}(t) = \\langle x(t), y(t) \\rangle$ 对每个 $t$ 给出一个向量。它的**分量函数** $x(t)$、$y(t)$ 是普通函数。把 $\\mathbf{r}(t)$ 的起点放在原点，它指向点 $(x(t), y(t))$，这些点描出参数曲线。\n\n求值时代入每个分量：对 $\\mathbf{r}(t) = \\langle t^{2}, 3t - 1 \\rangle$，$\\mathbf{r}(2) = \\langle 4, 5 \\rangle$。",
      ),
      generate: evaluateVectorFunction,
    },
    {
      id: "limits-of-vector-valued-functions",
      title: t("Limits of vector-valued functions", "向量值函数的极限"),
      explanation: t(
        "The limit of a vector-valued function is the vector of the limits of its components:\n\n$$\\lim_{t \\to a} \\mathbf{r}(t) = \\left\\langle \\lim_{t \\to a} x(t), \\lim_{t \\to a} y(t) \\right\\rangle.$$\n\nFor example, $\\lim\\limits_{t \\to 2} \\left\\langle \\frac{t^{2} - 4}{t - 2}, t^{2} \\right\\rangle = \\langle 4, 4 \\rangle$, since $\\frac{t^{2} - 4}{t - 2} = t + 2$ for $t \\ne 2$.",
        "向量值函数的极限是各分量极限组成的向量：\n\n$$\\lim_{t \\to a} \\mathbf{r}(t) = \\left\\langle \\lim_{t \\to a} x(t), \\lim_{t \\to a} y(t) \\right\\rangle。$$\n\n例如 $\\lim\\limits_{t \\to 2} \\left\\langle \\frac{t^{2} - 4}{t - 2}, t^{2} \\right\\rangle = \\langle 4, 4 \\rangle$，因为 $t \\ne 2$ 时 $\\frac{t^{2} - 4}{t - 2} = t + 2$。",
      ),
      generate: vectorLimit,
    },
  ],
};

/** derivativeAtPoint evaluates r′(t0) for a polynomial vector-valued function. */
function derivativeAtPoint(rng: Rng) {
  const [x, y] = [randomPoly(rng), randomPoly(rng)];
  const t0 = rng.int(-2, 3);
  const answer = at(pDer(x), pDer(y), t0);
  return pointProblem({
    prompt: t(
      `Let $\\mathbf{r}(t) = ${vec(tL(x), tL(y))}$. Find $\\mathbf{r}'(${t0})$. ${enterVector.en}`,
      `设 $\\mathbf{r}(t) = ${vec(tL(x), tL(y))}$。求 $\\mathbf{r}'(${t0})$。${enterVector["zh-CN"]}`,
    ),
    answer,
    vector: true,
    wrong: [at(x, y, t0), at(pDer(pDer(x)), pDer(pDer(y)), t0), [answer[1], answer[0]]],
    solution: t(
      `Differentiate each component: $\\mathbf{r}'(t) = ${vec(tL(pDer(x)), tL(pDer(y)))}$. At $t = ${t0}$ this is $${pairL(answer)}$.`,
      `对每个分量求导：$\\mathbf{r}'(t) = ${vec(tL(pDer(x)), tL(pDer(y)))}$。在 $t = ${t0}$ 处为 $${pairL(answer)}$。`,
    ),
  });
}

/** transcendentalDerivative evaluates r′(0) when the components are exponential and trigonometric. */
function transcendentalDerivative(rng: Rng) {
  const c = rng.nonZero(-4, 4);
  const k = rng.nonZero(-3, 3);
  const d = rng.nonZero(-4, 4);
  const m = rng.int(1, 4);
  const first = rng.bool() ? expC(c, k) : polyC(quadratic(rng));
  const second = rng.bool() ? sinC(d, m) : cosC(d, m);
  const [x, y] = rng.bool() ? [first, second] : [second, first];
  const answer: Pair = [x.der().at(0), y.der().at(0)];
  return pointProblem({
    prompt: t(
      `Let $\\mathbf{r}(t) = ${vec(x.tex, y.tex)}$. Find $\\mathbf{r}'(0)$. ${enterVector.en}`,
      `设 $\\mathbf{r}(t) = ${vec(x.tex, y.tex)}$。求 $\\mathbf{r}'(0)$。${enterVector["zh-CN"]}`,
    ),
    answer,
    vector: true,
    wrong: [
      [x.at(0), y.at(0)],
      [answer[0].neg(), answer[1].neg()],
      [x.der().der().at(0), y.der().der().at(0)],
    ],
    solution: t(
      `Differentiate each component, using the chain rule: $\\mathbf{r}'(t) = ${vec(x.der().tex, y.der().tex)}$. At $t = 0$ this is $${pairL(answer)}$.`,
      `用链式法则对每个分量求导：$\\mathbf{r}'(t) = ${vec(x.der().tex, y.der().tex)}$。在 $t = 0$ 处为 $${pairL(answer)}$。`,
    ),
  });
}

/** secondDerivativeAtPoint evaluates r″(t0) for a polynomial vector-valued function. */
function secondDerivativeAtPoint(rng: Rng) {
  const [x, y] = [randomPoly(rng), randomPoly(rng)];
  const t0 = rng.int(-2, 3);
  const [x2, y2] = [pDer(pDer(x)), pDer(pDer(y))];
  const answer = at(x2, y2, t0);
  return pointProblem({
    prompt: t(
      `Let $\\mathbf{r}(t) = ${vec(tL(x), tL(y))}$. Find $\\mathbf{r}''(${t0})$. ${enterVector.en}`,
      `设 $\\mathbf{r}(t) = ${vec(tL(x), tL(y))}$。求 $\\mathbf{r}''(${t0})$。${enterVector["zh-CN"]}`,
    ),
    answer,
    vector: true,
    wrong: [at(pDer(x), pDer(y), t0), at(x2, y2, 0)],
    solution: t(
      `$\\mathbf{r}'(t) = ${vec(tL(pDer(x)), tL(pDer(y)))}$ and $\\mathbf{r}''(t) = ${vec(tL(x2), tL(y2))}$. At $t = ${t0}$ this is $${pairL(answer)}$.`,
      `$\\mathbf{r}'(t) = ${vec(tL(pDer(x)), tL(pDer(y)))}$，$\\mathbf{r}''(t) = ${vec(tL(x2), tL(y2))}$。在 $t = ${t0}$ 处为 $${pairL(answer)}$。`,
    ),
  });
}

/** differentiatingVectorValuedFunctions differentiates vector-valued functions component by component. */
export const differentiatingVectorValuedFunctions: TopicDef = {
  id: "differentiating-vector-valued-functions",
  title: t("Differentiating Vector-Valued Functions", "向量值函数的求导"),
  summary: t("r′(t) = ⟨x′(t), y′(t)⟩; it is tangent to the curve traced by r(t).", "r′(t) = ⟨x′(t), y′(t)⟩，它与 r(t) 描出的曲线相切。"),
  prerequisites: [
    "defining-vector-valued-functions",
    "the-chain-rule-with-exponential-functions",
    "the-chain-rule-with-trigonometric-functions",
  ],
  encompasses: [{ topic: "defining-vector-valued-functions", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "derivatives-of-polynomial-vector-functions",
      title: t("Derivatives of polynomial vector functions", "多项式向量函数的导数"),
      explanation: t(
        "The derivative is defined by the same limit as for ordinary functions, and it works out component by component:\n\n$$\\mathbf{r}'(t) = \\lim_{h \\to 0} \\frac{\\mathbf{r}(t + h) - \\mathbf{r}(t)}{h} = \\langle x'(t), y'(t) \\rangle.$$\n\nWhen it is not zero, $\\mathbf{r}'(t)$ is tangent to the curve and points in the direction of motion. For $\\mathbf{r}(t) = \\langle t^{3}, 2t \\rangle$, $\\mathbf{r}'(t) = \\langle 3t^{2}, 2 \\rangle$ and $\\mathbf{r}'(1) = \\langle 3, 2 \\rangle$.",
        "导数的定义与普通函数相同，并且按分量计算：\n\n$$\\mathbf{r}'(t) = \\lim_{h \\to 0} \\frac{\\mathbf{r}(t + h) - \\mathbf{r}(t)}{h} = \\langle x'(t), y'(t) \\rangle。$$\n\n当 $\\mathbf{r}'(t)$ 不为零时，它与曲线相切并指向运动方向。对 $\\mathbf{r}(t) = \\langle t^{3}, 2t \\rangle$，$\\mathbf{r}'(t) = \\langle 3t^{2}, 2 \\rangle$，$\\mathbf{r}'(1) = \\langle 3, 2 \\rangle$。",
      ),
      generate: derivativeAtPoint,
    },
    {
      id: "derivatives-with-exponential-and-trigonometric-components",
      title: t("Derivatives with exponential and trigonometric components", "含指数与三角分量的导数"),
      explanation: t(
        "Use the usual rules on each component. For $\\mathbf{r}(t) = \\langle e^{2t}, 3\\sin(4t) \\rangle$, the chain rule gives $\\mathbf{r}'(t) = \\langle 2e^{2t}, 12\\cos(4t) \\rangle$, so $\\mathbf{r}'(0) = \\langle 2, 12 \\rangle$.",
        "对每个分量使用通常的求导法则。对 $\\mathbf{r}(t) = \\langle e^{2t}, 3\\sin(4t) \\rangle$，由链式法则 $\\mathbf{r}'(t) = \\langle 2e^{2t}, 12\\cos(4t) \\rangle$，所以 $\\mathbf{r}'(0) = \\langle 2, 12 \\rangle$。",
      ),
      generate: transcendentalDerivative,
    },
    {
      id: "second-derivatives-of-vector-functions",
      title: t("Second derivatives of vector functions", "向量函数的二阶导数"),
      explanation: t(
        "Differentiate twice, component by component: $\\mathbf{r}''(t) = \\langle x''(t), y''(t) \\rangle$. For $\\mathbf{r}(t) = \\langle t^{3}, t^{2} \\rangle$, $\\mathbf{r}''(t) = \\langle 6t, 2 \\rangle$.",
        "按分量求两次导数：$\\mathbf{r}''(t) = \\langle x''(t), y''(t) \\rangle$。对 $\\mathbf{r}(t) = \\langle t^{3}, t^{2} \\rangle$，$\\mathbf{r}''(t) = \\langle 6t, 2 \\rangle$。",
      ),
      generate: secondDerivativeAtPoint,
    },
  ],
};

/** definiteVectorIntegral integrates a polynomial vector-valued function over an interval. */
function definiteVectorIntegral(rng: Rng) {
  const [x, y] = [quadratic(rng), quadratic(rng)];
  const a = rng.int(-2, 1);
  const b = a + rng.int(1, 3);
  const answer = integral(x, y, a, b);
  const diff = add(at(x, y, b), scale(Q.of(-1), at(x, y, a)));
  return pointProblem({
    prompt: t(
      `Evaluate $\\displaystyle\\int_{${a}}^{${b}} ${vec(tL(x), tL(y))} \\, dt$. ${enterVector.en}`,
      `计算 $\\displaystyle\\int_{${a}}^{${b}} ${vec(tL(x), tL(y))} \\, dt$。${enterVector["zh-CN"]}`,
    ),
    answer,
    vector: true,
    wrong: [diff, integral(x, y, 0, b), [answer[1], answer[0]]],
    solution: t(
      `Integrate each component: $\\int_{${a}}^{${b}} (${tL(x)}) \\, dt = ${answer[0].toLatex()}$ and $\\int_{${a}}^{${b}} (${tL(y)}) \\, dt = ${answer[1].toLatex()}$, so the integral is $${pairL(answer)}$.`,
      `对每个分量积分：$\\int_{${a}}^{${b}} (${tL(x)}) \\, dt = ${answer[0].toLatex()}$，$\\int_{${a}}^{${b}} (${tL(y)}) \\, dt = ${answer[1].toLatex()}$，所以积分为 $${pairL(answer)}$。`,
    ),
  });
}

/** vectorInitialValue recovers r(t) from r′(t) and r(0), then evaluates it. */
function vectorInitialValue(rng: Rng) {
  const [x, y] = [quadratic(rng), quadratic(rng)];
  const r0: Pair = [Q.of(rng.int(-6, 6)), Q.of(rng.int(-6, 6))];
  const t1 = rng.int(1, 3);
  const change = integral(x, y, 0, t1);
  const answer = add(r0, change);
  return pointProblem({
    prompt: t(
      `A vector-valued function satisfies $\\mathbf{r}'(t) = ${vec(tL(x), tL(y))}$ and $\\mathbf{r}(0) = ${pairL(r0)}$. Find $\\mathbf{r}(${t1})$. ${enterVector.en}`,
      `向量值函数满足 $\\mathbf{r}'(t) = ${vec(tL(x), tL(y))}$，$\\mathbf{r}(0) = ${pairL(r0)}$。求 $\\mathbf{r}(${t1})$。${enterVector["zh-CN"]}`,
    ),
    answer,
    vector: true,
    wrong: [change, add(r0, at(x, y, t1)), add(r0, scale(Q.of(-1), change))],
    solution: t(
      `$\\mathbf{r}(${t1}) = \\mathbf{r}(0) + \\int_{0}^{${t1}} \\mathbf{r}'(t) \\, dt = ${pairL(r0)} + ${pairL(change)} = ${pairL(answer)}$.`,
      `$\\mathbf{r}(${t1}) = \\mathbf{r}(0) + \\int_{0}^{${t1}} \\mathbf{r}'(t) \\, dt = ${pairL(r0)} + ${pairL(change)} = ${pairL(answer)}$。`,
    ),
  });
}

/** integratingVectorValuedFunctions integrates vector-valued functions component by component. */
export const integratingVectorValuedFunctions: TopicDef = {
  id: "integrating-vector-valued-functions",
  title: t("Integrating Vector-Valued Functions", "向量值函数的积分"),
  summary: t(
    "Integrals of vector-valued functions are taken component by component, with a constant vector for indefinite integrals.",
    "向量值函数按分量积分，不定积分要加一个常向量。",
  ),
  prerequisites: ["differentiating-vector-valued-functions", "the-fundamental-theorem-of-calculus"],
  encompasses: [{ topic: "the-fundamental-theorem-of-calculus", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "definite-integrals-of-vector-functions",
      title: t("Definite integrals of vector functions", "向量函数的定积分"),
      explanation: t(
        "$$\\int_{a}^{b} \\mathbf{r}(t) \\, dt = \\left\\langle \\int_{a}^{b} x(t) \\, dt, \\int_{a}^{b} y(t) \\, dt \\right\\rangle.$$\n\nFor example, $\\int_{0}^{2} \\langle 2t, 3 \\rangle \\, dt = \\langle 4, 6 \\rangle$.",
        "$$\\int_{a}^{b} \\mathbf{r}(t) \\, dt = \\left\\langle \\int_{a}^{b} x(t) \\, dt, \\int_{a}^{b} y(t) \\, dt \\right\\rangle。$$\n\n例如 $\\int_{0}^{2} \\langle 2t, 3 \\rangle \\, dt = \\langle 4, 6 \\rangle$。",
      ),
      generate: definiteVectorIntegral,
    },
    {
      id: "vector-initial-value-problems",
      title: t("Vector initial value problems", "向量初值问题"),
      explanation: t(
        "An antiderivative of $\\mathbf{r}'(t)$ is determined up to a constant vector $\\mathbf{C}$, which an initial value fixes. Equivalently,\n\n$$\\mathbf{r}(t_{1}) = \\mathbf{r}(0) + \\int_{0}^{t_{1}} \\mathbf{r}'(t) \\, dt.$$\n\nFor $\\mathbf{r}'(t) = \\langle 2t, 1 \\rangle$ and $\\mathbf{r}(0) = \\langle 1, -1 \\rangle$: $\\mathbf{r}(t) = \\langle t^{2} + 1, t - 1 \\rangle$.",
        "$\\mathbf{r}'(t)$ 的原函数只确定到相差一个常向量 $\\mathbf{C}$，由初值确定。等价地，\n\n$$\\mathbf{r}(t_{1}) = \\mathbf{r}(0) + \\int_{0}^{t_{1}} \\mathbf{r}'(t) \\, dt。$$\n\n对 $\\mathbf{r}'(t) = \\langle 2t, 1 \\rangle$、$\\mathbf{r}(0) = \\langle 1, -1 \\rangle$：$\\mathbf{r}(t) = \\langle t^{2} + 1, t - 1 \\rangle$。",
      ),
      generate: vectorInitialValue,
    },
  ],
};

/** motionPrompt describes the position of a particle moving in the plane. */
const motionPrompt = (x: string, y: string) =>
  t(
    `A particle moves in the plane with position $\\mathbf{r}(t) = ${vec(x, y)}$ meters at time $t$ seconds.`,
    `一个质点在平面上运动，$t$ 秒时的位置为 $\\mathbf{r}(t) = ${vec(x, y)}$ 米。`,
  );

/** planeVelocity finds the velocity vector at a given time. */
function planeVelocity(rng: Rng) {
  const [x, y] = [randomPoly(rng), randomPoly(rng)];
  const t0 = rng.int(0, 4);
  const answer = at(pDer(x), pDer(y), t0);
  const intro = motionPrompt(tL(x), tL(y));
  return pointProblem({
    prompt: t(
      `${intro.en} Find its velocity vector at $t = ${t0}$, in meters per second. ${enterVector.en}`,
      `${intro["zh-CN"]}求 $t = ${t0}$ 时的速度向量（单位：米/秒）。${enterVector["zh-CN"]}`,
    ),
    answer,
    vector: true,
    wrong: [at(x, y, t0), at(pDer(pDer(x)), pDer(pDer(y)), t0)],
    solution: t(
      `$\\mathbf{v}(t) = \\mathbf{r}'(t) = ${vec(tL(pDer(x)), tL(pDer(y)))}$, so $\\mathbf{v}(${t0}) = ${pairL(answer)}$.`,
      `$\\mathbf{v}(t) = \\mathbf{r}'(t) = ${vec(tL(pDer(x)), tL(pDer(y)))}$，所以 $\\mathbf{v}(${t0}) = ${pairL(answer)}$。`,
    ),
  });
}

/** triples are Pythagorean triples. */
const triples: readonly (readonly [number, number, number])[] = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [8, 15, 17],
  [9, 12, 15],
  [0, 7, 7],
];

/** withVelocity chooses a quadratic whose derivative at t0 is v. */
function withVelocity(rng: Rng, v: number, t0: number): Poly {
  const a = rng.nonZero(-2, 2);
  return [rng.int(-5, 5), v - 2 * a * t0, a];
}

/** planeSpeed finds the speed, the magnitude of the velocity vector. */
function planeSpeed(rng: Rng) {
  const [p, q, h] = rng.pick(triples);
  const sign = () => (rng.bool() ? 1 : -1);
  const [vx, vy] = rng.bool() ? [p * sign(), q * sign()] : [q * sign(), p * sign()];
  const t0 = rng.int(1, 3);
  const [x, y] = [withVelocity(rng, vx, t0), withVelocity(rng, vy, t0)];
  const intro = motionPrompt(tL(x), tL(y));
  return numberProblem({
    prompt: t(`${intro.en} Find its speed at $t = ${t0}$.`, `${intro["zh-CN"]}求 $t = ${t0}$ 时的速率。`),
    answer: h,
    unit: "m/s",
    wrong: [Math.abs(vx) + Math.abs(vy), h * h, Math.abs(vx + vy)],
    solution: t(
      `$\\mathbf{v}(t) = ${vec(tL(pDer(x)), tL(pDer(y)))}$, so $\\mathbf{v}(${t0}) = \\langle ${vx}, ${vy} \\rangle$. The speed is $\\|\\mathbf{v}\\| = \\sqrt{${vx * vx} + ${vy * vy}} = ${h}$ m/s.`,
      `$\\mathbf{v}(t) = ${vec(tL(pDer(x)), tL(pDer(y)))}$，所以 $\\mathbf{v}(${t0}) = \\langle ${vx}, ${vy} \\rangle$。速率为 $\\|\\mathbf{v}\\| = \\sqrt{${vx * vx} + ${vy * vy}} = ${h}$ 米/秒。`,
    ),
  });
}

/** calculatingVelocityForPlaneMotionUsingDifferentiation differentiates position vectors. */
export const calculatingVelocityForPlaneMotionUsingDifferentiation: TopicDef = {
  id: "calculating-velocity-for-plane-motion-using-differentiation",
  title: t("Calculating Velocity for Plane Motion Using Differentiation", "用求导计算平面运动的速度"),
  summary: t(
    "The velocity of a particle with position r(t) is v(t) = r′(t), and its speed is ‖v(t)‖.",
    "位置为 r(t) 的质点的速度为 v(t) = r′(t)，速率为 ‖v(t)‖。",
  ),
  prerequisites: [
    "differentiating-vector-valued-functions",
    "calculating-velocity-for-straight-line-motion-using-differentiation",
    "velocity-and-acceleration-for-plane-motion",
  ],
  encompasses: [{ topic: "differentiating-vector-valued-functions", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "velocity-vectors-from-position",
      title: t("Velocity vectors from position", "由位置求速度向量"),
      explanation: t(
        "For a particle with position vector $\\mathbf{r}(t) = \\langle x(t), y(t) \\rangle$, the **velocity** is\n\n$$\\mathbf{v}(t) = \\mathbf{r}'(t) = \\langle x'(t), y'(t) \\rangle,$$\n\ntangent to the path in the direction of motion. For $\\mathbf{r}(t) = \\langle t^{2}, 4t \\rangle$, $\\mathbf{v}(3) = \\langle 6, 4 \\rangle$.",
        "对位置向量为 $\\mathbf{r}(t) = \\langle x(t), y(t) \\rangle$ 的质点，**速度**为\n\n$$\\mathbf{v}(t) = \\mathbf{r}'(t) = \\langle x'(t), y'(t) \\rangle，$$\n\n它与路径相切，指向运动方向。对 $\\mathbf{r}(t) = \\langle t^{2}, 4t \\rangle$，$\\mathbf{v}(3) = \\langle 6, 4 \\rangle$。",
      ),
      generate: planeVelocity,
    },
    {
      id: "speed-in-the-plane",
      title: t("Speed in the plane", "平面运动的速率"),
      explanation: t(
        "**Speed** is the magnitude of velocity: $\\|\\mathbf{v}(t)\\| = \\sqrt{x'(t)^{2} + y'(t)^{2}}$. It is a number, not a vector. For $\\mathbf{v} = \\langle 6, -8 \\rangle$ the speed is $\\sqrt{36 + 64} = 10$.",
        "**速率**是速度的模：$\\|\\mathbf{v}(t)\\| = \\sqrt{x'(t)^{2} + y'(t)^{2}}$。它是一个数，不是向量。对 $\\mathbf{v} = \\langle 6, -8 \\rangle$，速率为 $\\sqrt{36 + 64} = 10$。",
      ),
      generate: planeSpeed,
    },
  ],
};

/** planeAcceleration finds the acceleration vector at a given time. */
function planeAcceleration(rng: Rng) {
  const [x, y] = [randomPoly(rng), randomPoly(rng)];
  const t0 = rng.int(0, 4);
  const answer = at(pDer(pDer(x)), pDer(pDer(y)), t0);
  const intro = motionPrompt(tL(x), tL(y));
  return pointProblem({
    prompt: t(
      `${intro.en} Find its acceleration vector at $t = ${t0}$, in meters per second squared. ${enterVector.en}`,
      `${intro["zh-CN"]}求 $t = ${t0}$ 时的加速度向量（单位：米/秒²）。${enterVector["zh-CN"]}`,
    ),
    answer,
    vector: true,
    wrong: [at(pDer(x), pDer(y), t0), at(pDer(pDer(x)), pDer(pDer(y)), 0)],
    solution: t(
      `$\\mathbf{v}(t) = ${vec(tL(pDer(x)), tL(pDer(y)))}$ and $\\mathbf{a}(t) = \\mathbf{v}'(t) = ${vec(tL(pDer(pDer(x))), tL(pDer(pDer(y))))}$, so $\\mathbf{a}(${t0}) = ${pairL(answer)}$.`,
      `$\\mathbf{v}(t) = ${vec(tL(pDer(x)), tL(pDer(y)))}$，$\\mathbf{a}(t) = \\mathbf{v}'(t) = ${vec(tL(pDer(pDer(x))), tL(pDer(pDer(y))))}$，所以 $\\mathbf{a}(${t0}) = ${pairL(answer)}$。`,
    ),
  });
}

/** circularMotion finds the speed or the magnitude of acceleration in uniform circular motion. */
function circularMotion(rng: Rng) {
  const R = rng.int(2, 9);
  const w = rng.int(2, 5);
  const fn = (f: string) => `${R}\\${f}(${w}t)`;
  const intro = motionPrompt(fn("cos"), fn("sin"));
  const askSpeed = rng.bool();
  const answer = askSpeed ? R * w : R * w * w;
  return numberProblem({
    prompt: t(
      `${intro.en} Find the ${askSpeed ? "speed" : "magnitude of the acceleration"} of the particle.`,
      `${intro["zh-CN"]}求质点的${askSpeed ? "速率" : "加速度大小"}。`,
    ),
    answer,
    unit: askSpeed ? "m/s" : "m/s^2",
    wrong: askSpeed ? [R, R * w * w, w, 2 * R * w] : [R * w, R * R * w, w * w, R * R * w * w],
    solution: t(
      `$\\mathbf{v}(t) = \\langle -${R * w}\\sin(${w}t), ${R * w}\\cos(${w}t) \\rangle$ has magnitude $${R * w}$, and $\\mathbf{a}(t) = \\langle -${R * w * w}\\cos(${w}t), -${R * w * w}\\sin(${w}t) \\rangle = -${w * w}\\mathbf{r}(t)$ has magnitude $${R * w * w}$, pointing toward the center. The answer is $${answer}$.`,
      `$\\mathbf{v}(t) = \\langle -${R * w}\\sin(${w}t), ${R * w}\\cos(${w}t) \\rangle$ 的模为 $${R * w}$；$\\mathbf{a}(t) = \\langle -${R * w * w}\\cos(${w}t), -${R * w * w}\\sin(${w}t) \\rangle = -${w * w}\\mathbf{r}(t)$ 的模为 $${R * w * w}$，指向圆心。答案为 $${answer}$。`,
    ),
  });
}

/** calculatingAccelerationForPlaneMotionUsingDifferentiation differentiates velocity vectors. */
export const calculatingAccelerationForPlaneMotionUsingDifferentiation: TopicDef = {
  id: "calculating-acceleration-for-plane-motion-using-differentiation",
  title: t("Calculating Acceleration for Plane Motion Using Differentiation", "用求导计算平面运动的加速度"),
  summary: t("The acceleration of a particle is a(t) = v′(t) = r″(t).", "质点的加速度为 a(t) = v′(t) = r″(t)。"),
  prerequisites: [
    "calculating-velocity-for-plane-motion-using-differentiation",
    "calculating-acceleration-for-straight-line-motion-using-differentiation",
  ],
  encompasses: [{ topic: "calculating-velocity-for-plane-motion-using-differentiation", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "acceleration-vectors-from-position",
      title: t("Acceleration vectors from position", "由位置求加速度向量"),
      explanation: t(
        "The **acceleration** is the derivative of velocity: $\\mathbf{a}(t) = \\mathbf{v}'(t) = \\mathbf{r}''(t) = \\langle x''(t), y''(t) \\rangle$. For $\\mathbf{r}(t) = \\langle t^{3}, t^{2} \\rangle$: $\\mathbf{v}(t) = \\langle 3t^{2}, 2t \\rangle$ and $\\mathbf{a}(t) = \\langle 6t, 2 \\rangle$.",
        "**加速度**是速度的导数：$\\mathbf{a}(t) = \\mathbf{v}'(t) = \\mathbf{r}''(t) = \\langle x''(t), y''(t) \\rangle$。对 $\\mathbf{r}(t) = \\langle t^{3}, t^{2} \\rangle$：$\\mathbf{v}(t) = \\langle 3t^{2}, 2t \\rangle$，$\\mathbf{a}(t) = \\langle 6t, 2 \\rangle$。",
      ),
      generate: planeAcceleration,
    },
    {
      id: "uniform-circular-motion",
      title: t("Uniform circular motion", "匀速圆周运动"),
      explanation: t(
        "A particle with $\\mathbf{r}(t) = \\langle R\\cos(\\omega t), R\\sin(\\omega t) \\rangle$ moves around a circle of radius $R$. Its speed is constant, $R\\omega$, yet it accelerates: $\\mathbf{a}(t) = -\\omega^{2}\\mathbf{r}(t)$ points toward the center with magnitude $R\\omega^{2}$.",
        "$\\mathbf{r}(t) = \\langle R\\cos(\\omega t), R\\sin(\\omega t) \\rangle$ 的质点沿半径为 $R$ 的圆运动。它的速率恒为 $R\\omega$，但仍有加速度：$\\mathbf{a}(t) = -\\omega^{2}\\mathbf{r}(t)$ 指向圆心，大小为 $R\\omega^{2}$。",
      ),
      generate: circularMotion,
    },
  ],
};

/** velocityFromAcceleration integrates acceleration from an initial velocity. */
function velocityFromAcceleration(rng: Rng) {
  const [x, y] = [linear(rng), linear(rng)];
  const v0: Pair = [Q.of(rng.int(-6, 6)), Q.of(rng.int(-6, 6))];
  const t1 = rng.int(1, 4);
  const change = integral(x, y, 0, t1);
  const answer = add(v0, change);
  return pointProblem({
    prompt: t(
      `A particle moving in the plane has acceleration $\\mathbf{a}(t) = ${vec(tL(x), tL(y))}$ m/s² and initial velocity $\\mathbf{v}(0) = ${pairL(v0)}$ m/s. Find its velocity at $t = ${t1}$. ${enterVector.en}`,
      `平面上运动的质点的加速度为 $\\mathbf{a}(t) = ${vec(tL(x), tL(y))}$ 米/秒²，初速度为 $\\mathbf{v}(0) = ${pairL(v0)}$ 米/秒。求 $t = ${t1}$ 时的速度。${enterVector["zh-CN"]}`,
    ),
    answer,
    vector: true,
    wrong: [change, add(v0, at(x, y, t1)), add(v0, scale(Q.of(t1), at(x, y, t1)))],
    solution: t(
      `$\\mathbf{v}(${t1}) = \\mathbf{v}(0) + \\int_{0}^{${t1}} \\mathbf{a}(t) \\, dt = ${pairL(v0)} + ${pairL(change)} = ${pairL(answer)}$.`,
      `$\\mathbf{v}(${t1}) = \\mathbf{v}(0) + \\int_{0}^{${t1}} \\mathbf{a}(t) \\, dt = ${pairL(v0)} + ${pairL(change)} = ${pairL(answer)}$。`,
    ),
  });
}

/** projectileVelocity finds the velocity of a projectile, or when it reaches its highest point. */
function projectileVelocity(rng: Rng) {
  const u = rng.int(3, 20);
  const w = rng.int(5, 40);
  const setting = t(
    `A ball is thrown with initial velocity $\\mathbf{v}(0) = \\langle ${u}, ${w} \\rangle$ m/s. Its only acceleration is gravity, $\\mathbf{a}(t) = \\langle 0, -10 \\rangle$ m/s².`,
    `一个球以初速度 $\\mathbf{v}(0) = \\langle ${u}, ${w} \\rangle$ 米/秒抛出，唯一的加速度是重力 $\\mathbf{a}(t) = \\langle 0, -10 \\rangle$ 米/秒²。`,
  );
  if (rng.bool()) {
    const t1 = rng.int(1, 5);
    const answer: Pair = [Q.of(u), Q.of(w - 10 * t1)];
    return pointProblem({
      prompt: t(
        `${setting.en} Find its velocity at $t = ${t1}$. ${enterVector.en}`,
        `${setting["zh-CN"]}求 $t = ${t1}$ 时的速度。${enterVector["zh-CN"]}`,
      ),
      answer,
      vector: true,
      wrong: [
        [Q.of(u - 10 * t1), Q.of(w - 10 * t1)],
        [Q.of(u), Q.of(w + 10 * t1)],
        [Q.zero, Q.of(w - 10 * t1)],
      ],
      solution: t(
        `$\\mathbf{v}(t) = \\mathbf{v}(0) + \\int_{0}^{t} \\langle 0, -10 \\rangle \\, ds = \\langle ${u}, ${w} - 10t \\rangle$. At $t = ${t1}$ this is $${pairL(answer)}$; the horizontal velocity never changes.`,
        `$\\mathbf{v}(t) = \\mathbf{v}(0) + \\int_{0}^{t} \\langle 0, -10 \\rangle \\, ds = \\langle ${u}, ${w} - 10t \\rangle$。在 $t = ${t1}$ 时为 $${pairL(answer)}$；水平速度始终不变。`,
      ),
    });
  }
  const answer = Q.of(w, 10);
  return numberProblem({
    prompt: t(`${setting.en} At what time does it reach its highest point?`, `${setting["zh-CN"]}它在什么时刻到达最高点？`),
    answer,
    unit: "s",
    wrong: [Q.of(w, 5), Q.of(u, 10), Q.of(w + u, 10)],
    solution: t(
      `$\\mathbf{v}(t) = \\langle ${u}, ${w} - 10t \\rangle$. At the highest point the vertical velocity is zero: $${w} - 10t = 0$, so $t = ${answer.toLatex()}$ s.`,
      `$\\mathbf{v}(t) = \\langle ${u}, ${w} - 10t \\rangle$。在最高点竖直速度为零：$${w} - 10t = 0$，所以 $t = ${answer.toLatex()}$ 秒。`,
    ),
  });
}

/** findingVelocityVectorsInTwoDimensionsUsingIntegration integrates acceleration vectors. */
export const findingVelocityVectorsInTwoDimensionsUsingIntegration: TopicDef = {
  id: "finding-velocity-vectors-in-two-dimensions-using-integration",
  title: t("Finding Velocity Vectors in Two Dimensions Using Integration", "用积分求二维速度向量"),
  summary: t("v(t₁) = v(0) + ∫₀^t₁ a(t) dt, component by component.", "v(t₁) = v(0) + ∫₀^t₁ a(t) dt，按分量计算。"),
  prerequisites: [
    "integrating-vector-valued-functions",
    "calculating-acceleration-for-plane-motion-using-differentiation",
    "calculating-velocity-using-integration",
  ],
  encompasses: [{ topic: "integrating-vector-valued-functions", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "velocity-from-acceleration-in-the-plane",
      title: t("Velocity from acceleration in the plane", "由加速度求平面速度"),
      explanation: t(
        "Velocity is an antiderivative of acceleration, so\n\n$$\\mathbf{v}(t_{1}) = \\mathbf{v}(0) + \\int_{0}^{t_{1}} \\mathbf{a}(t) \\, dt.$$\n\nFor $\\mathbf{a}(t) = \\langle 2t, -1 \\rangle$ and $\\mathbf{v}(0) = \\langle 1, 3 \\rangle$: $\\mathbf{v}(t) = \\langle t^{2} + 1, 3 - t \\rangle$.",
        "速度是加速度的原函数，所以\n\n$$\\mathbf{v}(t_{1}) = \\mathbf{v}(0) + \\int_{0}^{t_{1}} \\mathbf{a}(t) \\, dt。$$\n\n对 $\\mathbf{a}(t) = \\langle 2t, -1 \\rangle$、$\\mathbf{v}(0) = \\langle 1, 3 \\rangle$：$\\mathbf{v}(t) = \\langle t^{2} + 1, 3 - t \\rangle$。",
      ),
      generate: velocityFromAcceleration,
    },
    {
      id: "projectile-velocity",
      title: t("Projectile velocity", "抛体的速度"),
      explanation: t(
        "Near the ground, ignoring air resistance, a projectile's acceleration is $\\langle 0, -g \\rangle$; here $g = 10$ m/s². Integrating, $\\mathbf{v}(t) = \\langle u, w - 10t \\rangle$ for initial velocity $\\langle u, w \\rangle$: the horizontal velocity stays $u$, and the projectile is highest when the vertical velocity $w - 10t$ is zero.",
        "在地面附近、忽略空气阻力时，抛体的加速度为 $\\langle 0, -g \\rangle$，这里取 $g = 10$ 米/秒²。积分得 $\\mathbf{v}(t) = \\langle u, w - 10t \\rangle$（初速度为 $\\langle u, w \\rangle$）：水平速度保持为 $u$，竖直速度 $w - 10t$ 为零时抛体最高。",
      ),
      generate: projectileVelocity,
    },
  ],
};

/** planeDisplacement integrates velocity over an interval. */
function planeDisplacement(rng: Rng) {
  const [x, y] = [quadratic(rng), quadratic(rng)];
  const a = rng.int(0, 2);
  const b = a + rng.int(1, 3);
  const answer = integral(x, y, a, b);
  const diff = add(at(x, y, b), scale(Q.of(-1), at(x, y, a)));
  return pointProblem({
    prompt: t(
      `A particle moving in the plane has velocity $\\mathbf{v}(t) = ${vec(tL(x), tL(y))}$ m/s. Find its displacement vector from $t = ${a}$ to $t = ${b}$, in meters. ${enterVector.en}`,
      `平面上运动的质点的速度为 $\\mathbf{v}(t) = ${vec(tL(x), tL(y))}$ 米/秒。求它从 $t = ${a}$ 到 $t = ${b}$ 的位移向量（单位：米）。${enterVector["zh-CN"]}`,
    ),
    answer,
    vector: true,
    wrong: [diff, integral(x, y, 0, b), at(x, y, b)],
    solution: t(
      `The displacement is $\\int_{${a}}^{${b}} \\mathbf{v}(t) \\, dt = \\left\\langle \\int_{${a}}^{${b}} (${tL(x)}) \\, dt, \\int_{${a}}^{${b}} (${tL(y)}) \\, dt \\right\\rangle = ${pairL(answer)}$.`,
      `位移为 $\\int_{${a}}^{${b}} \\mathbf{v}(t) \\, dt = \\left\\langle \\int_{${a}}^{${b}} (${tL(x)}) \\, dt, \\int_{${a}}^{${b}} (${tL(y)}) \\, dt \\right\\rangle = ${pairL(answer)}$。`,
    ),
  });
}

/** planePosition finds the position at a given time from velocity and the initial position. */
function planePosition(rng: Rng) {
  const [x, y] = [quadratic(rng), quadratic(rng)];
  const r0: Pair = [Q.of(rng.int(-8, 8)), Q.of(rng.int(-8, 8))];
  const t1 = rng.int(1, 4);
  const change = integral(x, y, 0, t1);
  const answer = add(r0, change);
  return pointProblem({
    prompt: t(
      `A particle moving in the plane has velocity $\\mathbf{v}(t) = ${vec(tL(x), tL(y))}$ m/s and starts at $\\mathbf{r}(0) = ${pairL(r0)}$ m. Find its position at $t = ${t1}$. ${enterVector.en}`,
      `平面上运动的质点的速度为 $\\mathbf{v}(t) = ${vec(tL(x), tL(y))}$ 米/秒，起点为 $\\mathbf{r}(0) = ${pairL(r0)}$ 米。求 $t = ${t1}$ 时的位置。${enterVector["zh-CN"]}`,
    ),
    answer,
    vector: true,
    wrong: [change, add(r0, at(x, y, t1)), add(r0, at(pDer(x), pDer(y), t1))],
    solution: t(
      `$\\mathbf{r}(${t1}) = \\mathbf{r}(0) + \\int_{0}^{${t1}} \\mathbf{v}(t) \\, dt = ${pairL(r0)} + ${pairL(change)} = ${pairL(answer)}$.`,
      `$\\mathbf{r}(${t1}) = \\mathbf{r}(0) + \\int_{0}^{${t1}} \\mathbf{v}(t) \\, dt = ${pairL(r0)} + ${pairL(change)} = ${pairL(answer)}$。`,
    ),
  });
}

/** findingDisplacementVectorsInTwoDimensionsUsingIntegration integrates velocity vectors. */
export const findingDisplacementVectorsInTwoDimensionsUsingIntegration: TopicDef = {
  id: "finding-displacement-vectors-in-two-dimensions-using-integration",
  title: t("Finding Displacement Vectors in Two Dimensions Using Integration", "用积分求二维位移向量"),
  summary: t(
    "The displacement from t = a to t = b is ∫ₐᵇ v(t) dt, and r(t₁) = r(0) + ∫₀^t₁ v(t) dt.",
    "从 t = a 到 t = b 的位移为 ∫ₐᵇ v(t) dt，且 r(t₁) = r(0) + ∫₀^t₁ v(t) dt。",
  ),
  prerequisites: [
    "finding-velocity-vectors-in-two-dimensions-using-integration",
    "calculating-the-displacement-of-a-particle-using-integration",
  ],
  encompasses: [{ topic: "finding-velocity-vectors-in-two-dimensions-using-integration", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "displacement-vectors-from-velocity",
      title: t("Displacement vectors from velocity", "由速度求位移向量"),
      explanation: t(
        "The **displacement** from $t = a$ to $t = b$ is the change in position,\n\n$$\\mathbf{r}(b) - \\mathbf{r}(a) = \\int_{a}^{b} \\mathbf{v}(t) \\, dt.$$\n\nFor $\\mathbf{v}(t) = \\langle 2t, 3 \\rangle$ from $t = 1$ to $t = 3$: $\\left\\langle \\int_{1}^{3} 2t \\, dt, \\int_{1}^{3} 3 \\, dt \\right\\rangle = \\langle 8, 6 \\rangle$.",
        "从 $t = a$ 到 $t = b$ 的**位移**是位置的变化量：\n\n$$\\mathbf{r}(b) - \\mathbf{r}(a) = \\int_{a}^{b} \\mathbf{v}(t) \\, dt。$$\n\n对 $\\mathbf{v}(t) = \\langle 2t, 3 \\rangle$，从 $t = 1$ 到 $t = 3$：$\\left\\langle \\int_{1}^{3} 2t \\, dt, \\int_{1}^{3} 3 \\, dt \\right\\rangle = \\langle 8, 6 \\rangle$。",
      ),
      generate: planeDisplacement,
    },
    {
      id: "position-from-velocity-in-the-plane",
      title: t("Position from velocity in the plane", "由速度求平面位置"),
      explanation: t(
        "Add the displacement to the starting position: $\\mathbf{r}(t_{1}) = \\mathbf{r}(0) + \\int_{0}^{t_{1}} \\mathbf{v}(t) \\, dt$. For $\\mathbf{v}(t) = \\langle 2t, 3 \\rangle$ and $\\mathbf{r}(0) = \\langle 1, 1 \\rangle$: $\\mathbf{r}(2) = \\langle 1, 1 \\rangle + \\langle 4, 6 \\rangle = \\langle 5, 7 \\rangle$.",
        "把位移加到起始位置上：$\\mathbf{r}(t_{1}) = \\mathbf{r}(0) + \\int_{0}^{t_{1}} \\mathbf{v}(t) \\, dt$。对 $\\mathbf{v}(t) = \\langle 2t, 3 \\rangle$、$\\mathbf{r}(0) = \\langle 1, 1 \\rangle$：$\\mathbf{r}(2) = \\langle 1, 1 \\rangle + \\langle 4, 6 \\rangle = \\langle 5, 7 \\rangle$。",
      ),
      generate: planePosition,
    },
  ],
};

/** forceFromPosition applies F = ma to a particle whose position is given. */
function forceFromPosition(rng: Rng) {
  const [x, y] = [randomPoly(rng), randomPoly(rng)];
  const m = rng.int(2, 6);
  const t0 = rng.int(0, 3);
  const acc = at(pDer(pDer(x)), pDer(pDer(y)), t0);
  const answer = scale(Q.of(m), acc);
  return pointProblem({
    prompt: t(
      `An object of mass $${m}$ kg moves in the plane with position $\\mathbf{r}(t) = ${vec(tL(x), tL(y))}$ meters at time $t$ seconds. Find the net force on it at $t = ${t0}$, in newtons. ${enterVector.en}`,
      `质量为 $${m}$ 千克的物体在平面上运动，$t$ 秒时的位置为 $\\mathbf{r}(t) = ${vec(tL(x), tL(y))}$ 米。求 $t = ${t0}$ 时它所受的合力（单位：牛顿）。${enterVector["zh-CN"]}`,
    ),
    answer,
    vector: true,
    wrong: [acc, scale(Q.of(m), at(pDer(x), pDer(y), t0))],
    solution: t(
      `$\\mathbf{a}(t) = \\mathbf{r}''(t) = ${vec(tL(pDer(pDer(x))), tL(pDer(pDer(y))))}$, so $\\mathbf{a}(${t0}) = ${pairL(acc)}$. By Newton's second law, $\\mathbf{F} = m\\mathbf{a} = ${m}${pairL(acc)} = ${pairL(answer)}$ N.`,
      `$\\mathbf{a}(t) = \\mathbf{r}''(t) = ${vec(tL(pDer(pDer(x))), tL(pDer(pDer(y))))}$，所以 $\\mathbf{a}(${t0}) = ${pairL(acc)}$。由牛顿第二定律，$\\mathbf{F} = m\\mathbf{a} = ${m}${pairL(acc)} = ${pairL(answer)}$ 牛。`,
    ),
  });
}

/** velocityFromForce finds the velocity of an object pushed by a constant force. */
function velocityFromForce(rng: Rng) {
  const m = rng.int(2, 5);
  const F: Pair = [Q.of(rng.int(-12, 12)), Q.of(rng.nonZero(-12, 12))];
  const v0: Pair = [Q.of(rng.int(-5, 5)), Q.of(rng.int(-5, 5))];
  const t1 = rng.int(1, 4);
  const acc = scale(Q.of(1, m), F);
  const answer = add(v0, scale(Q.of(t1), acc));
  return pointProblem({
    prompt: t(
      `A constant force $\\mathbf{F} = ${pairL(F)}$ N acts on an object of mass $${m}$ kg, whose velocity at $t = 0$ is $${pairL(v0)}$ m/s. Find its velocity at $t = ${t1}$ s. ${enterVector.en}`,
      `恒力 $\\mathbf{F} = ${pairL(F)}$ 牛作用在质量为 $${m}$ 千克的物体上，物体在 $t = 0$ 时的速度为 $${pairL(v0)}$ 米/秒。求 $t = ${t1}$ 秒时的速度。${enterVector["zh-CN"]}`,
    ),
    answer,
    vector: true,
    wrong: [add(v0, scale(Q.of(t1), F)), scale(Q.of(t1), acc), add(v0, acc)],
    solution: t(
      `$\\mathbf{a} = \\frac{\\mathbf{F}}{m} = ${pairL(acc)}$ m/s², constant. So $\\mathbf{v}(t) = \\mathbf{v}(0) + t\\mathbf{a}$, and $\\mathbf{v}(${t1}) = ${pairL(v0)} + ${t1}${pairL(acc)} = ${pairL(answer)}$.`,
      `$\\mathbf{a} = \\frac{\\mathbf{F}}{m} = ${pairL(acc)}$ 米/秒²，为常向量。所以 $\\mathbf{v}(t) = \\mathbf{v}(0) + t\\mathbf{a}$，$\\mathbf{v}(${t1}) = ${pairL(v0)} + ${t1}${pairL(acc)} = ${pairL(answer)}$。`,
    ),
  });
}

/** applyingNewtonsSecondLawInThePlane relates force, mass and acceleration vectors. */
export const applyingNewtonsSecondLawInThePlane: TopicDef = {
  id: "applying-newtons-second-law-in-the-plane",
  title: t("Applying Newton's Second Law in the Plane", "平面上的牛顿第二定律"),
  summary: t(
    "The net force on an object is F = ma, a vector equation that holds component by component.",
    "物体所受合力为 F = ma，这是一个按分量成立的向量方程。",
  ),
  prerequisites: ["finding-velocity-vectors-in-two-dimensions-using-integration", "newtons-second-law"],
  encompasses: [{ topic: "newtons-second-law", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "force-vectors-from-position",
      title: t("Force vectors from position", "由位置求力向量"),
      explanation: t(
        "**Newton's second law** in the plane is the vector equation $\\mathbf{F} = m\\mathbf{a}$: the net force points the same way as the acceleration. With mass in kilograms and acceleration in m/s², force is in newtons. For $m = 2$ and $\\mathbf{r}(t) = \\langle t^{3}, t^{2} \\rangle$: $\\mathbf{a}(1) = \\langle 6, 2 \\rangle$, so $\\mathbf{F} = \\langle 12, 4 \\rangle$ N.",
        "平面上的**牛顿第二定律**是向量方程 $\\mathbf{F} = m\\mathbf{a}$：合力与加速度方向相同。质量以千克、加速度以米/秒²计时，力的单位是牛顿。对 $m = 2$、$\\mathbf{r}(t) = \\langle t^{3}, t^{2} \\rangle$：$\\mathbf{a}(1) = \\langle 6, 2 \\rangle$，所以 $\\mathbf{F} = \\langle 12, 4 \\rangle$ 牛。",
      ),
      generate: forceFromPosition,
    },
    {
      id: "motion-under-a-constant-force",
      title: t("Motion under a constant force", "恒力作用下的运动"),
      explanation: t(
        "Given the force, $\\mathbf{a} = \\frac{\\mathbf{F}}{m}$; then integrate as usual. A constant force gives constant acceleration, so $\\mathbf{v}(t) = \\mathbf{v}(0) + t\\frac{\\mathbf{F}}{m}$. For $\\mathbf{F} = \\langle 6, -4 \\rangle$ N on $2$ kg starting at rest: $\\mathbf{v}(3) = 3\\langle 3, -2 \\rangle = \\langle 9, -6 \\rangle$ m/s.",
        "已知力时，$\\mathbf{a} = \\frac{\\mathbf{F}}{m}$，再照常积分。恒力产生恒定加速度，所以 $\\mathbf{v}(t) = \\mathbf{v}(0) + t\\frac{\\mathbf{F}}{m}$。对 $\\mathbf{F} = \\langle 6, -4 \\rangle$ 牛作用于静止的 $2$ 千克物体：$\\mathbf{v}(3) = 3\\langle 3, -2 \\rangle = \\langle 9, -6 \\rangle$ 米/秒。",
      ),
      generate: velocityFromForce,
    },
  ],
};

/** calculusIIVectorTopics are the topics of Calculus II modules 3.14 and 3.15. */
export const calculusIIVectorTopics: readonly TopicDef[] = [
  definingVectorValuedFunctions,
  differentiatingVectorValuedFunctions,
  integratingVectorValuedFunctions,
  calculatingVelocityForPlaneMotionUsingDifferentiation,
  calculatingAccelerationForPlaneMotionUsingDifferentiation,
  findingVelocityVectorsInTwoDimensionsUsingIntegration,
  findingDisplacementVectorsInTwoDimensionsUsingIntegration,
  applyingNewtonsSecondLawInThePlane,
];
