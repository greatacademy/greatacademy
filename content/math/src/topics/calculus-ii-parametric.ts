import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import { functionProblem, numberProblem } from "../problems.ts";
import { type Poly, pAt, pDer, pLatex } from "./calculus-common.ts";
import { exactProblem, intQ, times } from "./calculus-ii-areas.ts";
import { pMul } from "./calculus-ii-fractions-improper.ts";
import { rootTimes } from "./calculus-ii-revolution.ts";
import { coef } from "./calculus-ii-substitution.ts";

// Calculus II unit 3: Parametric Equations (module 3.13), and surfaces of revolution for parametric curves (2.11.3).

/** tL writes a polynomial in t. */
const tL = (p: Poly) => pLatex(p, "t");

/** k1 writes a positive integer coefficient, leaving 1 out. */
const k1 = (k: number) => (k === 1 ? "" : `${k}`);

/** piL writes qπ. */
const piL = (q: Q) => times(q, "\\pi");

/** curve writes a parametric curve. */
const curve = (x: string, y: string) => `x = ${x}, \\; y = ${y}`;

/** ratio writes n/d, followed by its lowest terms when they differ. */
function ratio(n: number, d: number) {
  const raw = `\\frac{${n}}{${d}}`;
  const q = Q.of(n, d).toLatex();
  return raw === q ? raw : `${raw} = ${q}`;
}

/** randomCurve chooses polynomial coordinates x(t), y(t) of degree at most 3. */
function randomCurve(rng: Rng): { readonly x: Poly; readonly y: Poly } {
  return {
    x: [rng.int(-5, 5), rng.nonZero(-4, 4), rng.int(-2, 2), rng.int(0, 1)],
    y: [rng.int(-5, 5), rng.int(-4, 4), rng.nonZero(-2, 2), rng.int(-1, 1)],
  };
}

/** lineL writes the right side of y = mx + b. */
export function lineL(m: Q, b: Q) {
  if (m.isZero()) return b.toLatex();
  const mx = `${coef(m)}x`;
  return b.isZero() ? mx : `${mx} ${b.sign() > 0 ? "+" : "-"} ${b.abs().toLatex()}`;
}

/** slopeAtAPoint finds dy/dx at a given t. */
function slopeAtAPoint(rng: Rng) {
  for (;;) {
    const { x, y } = randomCurve(rng);
    const t0 = rng.int(-2, 3);
    const [dx, dy] = [pAt(pDer(x), t0), pAt(pDer(y), t0)];
    if (dx === 0) continue;
    const answer = Q.of(dy, dx);
    return numberProblem({
      prompt: t(
        `A curve is given by $${curve(tL(x), tL(y))}$. Find $\\frac{dy}{dx}$ at $t = ${t0}$.`,
        `曲线由 $${curve(tL(x), tL(y))}$ 给出。求 $t = ${t0}$ 时的 $\\frac{dy}{dx}$。`,
      ),
      answer,
      wrong: [...(dy === 0 ? [] : [Q.of(dx, dy)]), Q.of(dy), Q.of(dx * dy)],
      solution: t(
        `$\\frac{dx}{dt} = ${tL(pDer(x))}$ and $\\frac{dy}{dt} = ${tL(pDer(y))}$. At $t = ${t0}$ these are $${dx}$ and $${dy}$, so $\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt} = ${ratio(dy, dx)}$.`,
        `$\\frac{dx}{dt} = ${tL(pDer(x))}$，$\\frac{dy}{dt} = ${tL(pDer(y))}$。在 $t = ${t0}$ 时分别为 $${dx}$ 和 $${dy}$，所以 $\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt} = ${ratio(dy, dx)}$。`,
      ),
    });
  }
}

/** slopeFunction writes dy/dx in terms of t. */
function slopeFunction(rng: Rng) {
  if (rng.int(0, 2) === 0) {
    const a = rng.int(1, 6);
    const b = rng.int(1, 6);
    const answer = `-\\frac{${k1(b)}\\cos t}{${k1(a)}\\sin t}`;
    return functionProblem({
      prompt: t(
        `A curve is given by $${curve(`${k1(a)}\\cos t`, `${k1(b)}\\sin t`)}$. Find $\\frac{dy}{dx}$ in terms of $t$.`,
        `曲线由 $${curve(`${k1(a)}\\cos t`, `${k1(b)}\\sin t`)}$ 给出。用 $t$ 表示 $\\frac{dy}{dx}$。`,
      ),
      answer,
      wrong: [
        `-\\frac{${k1(a)}\\sin t}{${k1(b)}\\cos t}`,
        `\\frac{${k1(b)}\\cos t}{${k1(a)}\\sin t}`,
        `-\\frac{${k1(b)}\\sin t}{${k1(a)}\\cos t}`,
      ],
      variable: "t",
      solution: t(
        `$\\frac{dx}{dt} = -${k1(a)}\\sin t$ and $\\frac{dy}{dt} = ${k1(b)}\\cos t$, so $\\frac{dy}{dx} = ${answer}$.`,
        `$\\frac{dx}{dt} = -${k1(a)}\\sin t$，$\\frac{dy}{dt} = ${k1(b)}\\cos t$，所以 $\\frac{dy}{dx} = ${answer}$。`,
      ),
    });
  }
  const x: Poly = [rng.int(-5, 5), rng.int(-4, 4), rng.nonZero(-3, 3)];
  const y: Poly = [rng.int(-5, 5), rng.int(-4, 4), rng.int(-2, 2), rng.nonZero(-1, 1)];
  const [dx, dy] = [tL(pDer(x)), tL(pDer(y))];
  return functionProblem({
    prompt: t(
      `A curve is given by $${curve(tL(x), tL(y))}$. Find $\\frac{dy}{dx}$ in terms of $t$.`,
      `曲线由 $${curve(tL(x), tL(y))}$ 给出。用 $t$ 表示 $\\frac{dy}{dx}$。`,
    ),
    answer: `\\frac{${dy}}{${dx}}`,
    wrong: [`\\frac{${dx}}{${dy}}`, `\\frac{${tL(y)}}{${tL(x)}}`, `(${dy})(${dx})`],
    variable: "t",
    solution: t(
      `$\\frac{dx}{dt} = ${dx}$ and $\\frac{dy}{dt} = ${dy}$, so $\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt} = \\frac{${dy}}{${dx}}$.`,
      `$\\frac{dx}{dt} = ${dx}$，$\\frac{dy}{dt} = ${dy}$，所以 $\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt} = \\frac{${dy}}{${dx}}$。`,
    ),
  });
}

/** differentiatingParametricCurves finds dy/dx as the ratio of dy/dt to dx/dt. */
export const differentiatingParametricCurves: TopicDef = {
  id: "differentiating-parametric-curves",
  title: t("Differentiating Parametric Curves", "参数曲线的求导"),
  summary: t(
    "For x = f(t), y = g(t), the slope is dy/dx = (dy/dt)/(dx/dt) wherever dx/dt ≠ 0.",
    "对 x = f(t)、y = g(t)，在 dx/dt ≠ 0 处斜率为 dy/dx = (dy/dt)/(dx/dt)。",
  ),
  prerequisites: ["graphing-curves-defined-parametrically", "the-chain-rule-for-differentiation"],
  encompasses: [{ topic: "the-chain-rule-for-differentiation", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-slope-at-a-point",
      title: t("The slope at a point", "某点处的斜率"),
      explanation: t(
        "On a parametric curve $x = f(t)$, $y = g(t)$, the chain rule gives $\\frac{dy}{dt} = \\frac{dy}{dx} \\cdot \\frac{dx}{dt}$, so\n\n$$\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt}, \\quad \\frac{dx}{dt} \\ne 0.$$\n\nFor $x = t^{2}$, $y = t^{3} - t$ at $t = 2$: $\\frac{dx}{dt} = 4$ and $\\frac{dy}{dt} = 11$, so the slope is $\\frac{11}{4}$.",
        "对参数曲线 $x = f(t)$、$y = g(t)$，由链式法则 $\\frac{dy}{dt} = \\frac{dy}{dx} \\cdot \\frac{dx}{dt}$，所以\n\n$$\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt}，\\quad \\frac{dx}{dt} \\ne 0。$$\n\n对 $x = t^{2}$、$y = t^{3} - t$，在 $t = 2$ 处 $\\frac{dx}{dt} = 4$，$\\frac{dy}{dt} = 11$，斜率为 $\\frac{11}{4}$。",
      ),
      generate: slopeAtAPoint,
    },
    {
      id: "the-slope-in-terms-of-t",
      title: t("The slope in terms of t", "用 t 表示斜率"),
      explanation: t(
        "The same quotient gives $\\frac{dy}{dx}$ as a function of the parameter. For the ellipse $x = 3\\cos t$, $y = 2\\sin t$: $\\frac{dy}{dx} = \\frac{2\\cos t}{-3\\sin t} = -\\frac{2\\cos t}{3\\sin t}$.",
        "同样的商把 $\\frac{dy}{dx}$ 表示为参数的函数。对椭圆 $x = 3\\cos t$、$y = 2\\sin t$：$\\frac{dy}{dx} = \\frac{2\\cos t}{-3\\sin t} = -\\frac{2\\cos t}{3\\sin t}$。",
      ),
      generate: slopeFunction,
    },
  ],
};

/** tangentOrNormal finds the tangent or normal line to a parametric curve at a given t. */
function tangentOrNormal(rng: Rng, normal: boolean) {
  for (;;) {
    const { x, y } = randomCurve(rng);
    const t0 = rng.int(-2, 2);
    const [dx, dy] = [pAt(pDer(x), t0), pAt(pDer(y), t0)];
    if (dx === 0 || dy === 0) continue;
    const [x0, y0] = [pAt(x, t0), pAt(y, t0)];
    const slope = Q.of(dy, dx);
    const other = Q.of(-dx, dy);
    const m = normal ? other : slope;
    const line = (k: Q) => lineL(k, Q.of(y0).sub(k.mul(Q.of(x0))));
    const answer = line(m);
    const name = normal ? t("normal", "法线") : t("tangent", "切线");
    return functionProblem({
      prompt: t(
        `Find the equation of the ${name.en} line to the curve $${curve(tL(x), tL(y))}$ at $t = ${t0}$. Write it as $y = mx + b$ and enter the right side.`,
        `求曲线 $${curve(tL(x), tL(y))}$ 在 $t = ${t0}$ 处的${name["zh-CN"]}方程。写成 $y = mx + b$，填写等号右边。`,
      ),
      prefix: "y =",
      answer,
      wrong: [line(normal ? slope : other), line(Q.of(dx, dy)), lineL(m, Q.of(y0))],
      solution: t(
        `At $t = ${t0}$ the point is $(${x0}, ${y0})$ and $\\frac{dy}{dx} = ${ratio(dy, dx)}$.${normal ? ` The normal slope is $-\\frac{1}{dy/dx} = ${other.toLatex()}$.` : ""} So $y - ${y0 < 0 ? `(${y0})` : y0} = ${m.toLatex()}\\left(x - ${x0 < 0 ? `(${x0})` : x0}\\right)$, which is $y = ${answer}$.`,
        `$t = ${t0}$ 时点为 $(${x0}, ${y0})$，$\\frac{dy}{dx} = ${ratio(dy, dx)}$。${normal ? `法线斜率为 $-\\frac{1}{dy/dx} = ${other.toLatex()}$。` : ""}所以 $y - ${y0 < 0 ? `(${y0})` : y0} = ${m.toLatex()}\\left(x - ${x0 < 0 ? `(${x0})` : x0}\\right)$，即 $y = ${answer}$。`,
      ),
    });
  }
}

/** horizontalOrVerticalTangent locates the point where the tangent is horizontal or vertical. */
function horizontalOrVerticalTangent(rng: Rng) {
  const r = rng.int(-3, 3);
  const k = rng.int(-5, 5);
  const monotone: Poly = [rng.int(-5, 5), rng.int(1, 4), 0, 1];
  const turning: Poly = [k, -2 * r, 1];
  const horizontal = rng.bool();
  const [x, y] = horizontal ? [monotone, turning] : [turning, monotone];
  const [x0, y0] = [pAt(x, r), pAt(y, r)];
  const answer = horizontal ? y0 : x0;
  const coordinate = horizontal ? "y" : "x";
  const zero = horizontal ? "dy" : "dx";
  return numberProblem({
    prompt: t(
      `The curve $${curve(tL(x), tL(y))}$ has exactly one ${horizontal ? "horizontal" : "vertical"} tangent line. Find the $${coordinate}$-coordinate of the point where it touches the curve.`,
      `曲线 $${curve(tL(x), tL(y))}$ 恰有一条${horizontal ? "水平" : "竖直"}切线。求切点的 $${coordinate}$ 坐标。`,
    ),
    answer,
    wrong: [r, horizontal ? x0 : y0, k],
    solution: t(
      `A ${horizontal ? "horizontal" : "vertical"} tangent needs $\\frac{${zero}}{dt} = 0$ with the other derivative non-zero. $\\frac{${zero}}{dt} = 2t ${r < 0 ? "+" : "-"} ${Math.abs(2 * r)}$ is zero at $t = ${r}$, where $\\frac{${horizontal ? "dx" : "dy"}}{dt} = 3t^{2} + ${monotone[1]} > 0$. The point is $(${x0}, ${y0})$, so the answer is $${answer}$.`,
      `${horizontal ? "水平" : "竖直"}切线要求 $\\frac{${zero}}{dt} = 0$ 且另一个导数不为零。$\\frac{${zero}}{dt} = 2t ${r < 0 ? "+" : "-"} ${Math.abs(2 * r)}$ 在 $t = ${r}$ 时为零，此时 $\\frac{${horizontal ? "dx" : "dy"}}{dt} = 3t^{2} + ${monotone[1]} > 0$。切点为 $(${x0}, ${y0})$，所以答案为 $${answer}$。`,
    ),
  });
}

/** calculatingTangentAndNormalLinesWithParametricEquations finds tangent and normal lines to parametric curves. */
export const calculatingTangentAndNormalLinesWithParametricEquations: TopicDef = {
  id: "calculating-tangent-and-normal-lines-with-parametric-equations",
  title: t("Calculating Tangent and Normal Lines with Parametric Equations", "用参数方程求切线与法线"),
  summary: t(
    "The tangent at t₀ passes through (x(t₀), y(t₀)) with slope dy/dx; horizontal tangents have dy/dt = 0 and vertical ones dx/dt = 0.",
    "t₀ 处的切线过点 (x(t₀), y(t₀))，斜率为 dy/dx；水平切线满足 dy/dt = 0，竖直切线满足 dx/dt = 0。",
  ),
  prerequisites: ["differentiating-parametric-curves", "calculating-the-equation-of-a-normal-line-using-differentiation"],
  encompasses: [{ topic: "differentiating-parametric-curves", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "tangent-lines-to-parametric-curves",
      title: t("Tangent lines to parametric curves", "参数曲线的切线"),
      explanation: t(
        "At $t = t_{0}$, the point is $(x(t_{0}), y(t_{0}))$ and the slope is $m = \\frac{dy/dt}{dx/dt}$ evaluated at $t_{0}$. The tangent line is $y - y(t_{0}) = m\\left(x - x(t_{0})\\right)$.",
        "在 $t = t_{0}$ 处，点为 $(x(t_{0}), y(t_{0}))$，斜率为 $m = \\frac{dy/dt}{dx/dt}$ 在 $t_{0}$ 处的值。切线为 $y - y(t_{0}) = m\\left(x - x(t_{0})\\right)$。",
      ),
      generate: (rng) => tangentOrNormal(rng, false),
    },
    {
      id: "normal-lines-to-parametric-curves",
      title: t("Normal lines to parametric curves", "参数曲线的法线"),
      explanation: t(
        "The normal line is perpendicular to the tangent, so its slope is $-\\frac{1}{m} = -\\frac{dx/dt}{dy/dt}$. It passes through the same point $(x(t_{0}), y(t_{0}))$.",
        "法线与切线垂直，斜率为 $-\\frac{1}{m} = -\\frac{dx/dt}{dy/dt}$，且经过同一点 $(x(t_{0}), y(t_{0}))$。",
      ),
      generate: (rng) => tangentOrNormal(rng, true),
    },
    {
      id: "horizontal-and-vertical-tangents",
      title: t("Horizontal and vertical tangents", "水平切线与竖直切线"),
      explanation: t(
        "The tangent is horizontal where $\\frac{dy}{dt} = 0$ and $\\frac{dx}{dt} \\ne 0$, and vertical where $\\frac{dx}{dt} = 0$ and $\\frac{dy}{dt} \\ne 0$. Solve for $t$, then substitute into $x(t)$ and $y(t)$ to find the point.",
        "在 $\\frac{dy}{dt} = 0$ 且 $\\frac{dx}{dt} \\ne 0$ 处切线水平；在 $\\frac{dx}{dt} = 0$ 且 $\\frac{dy}{dt} \\ne 0$ 处切线竖直。先解出 $t$，再代入 $x(t)$、$y(t)$ 求出该点。",
      ),
      generate: horizontalOrVerticalTangent,
    },
  ],
};

/** secondDerivativePolynomial evaluates d²y/dx² for polynomial coordinates. */
function secondDerivativePolynomial(rng: Rng) {
  for (;;) {
    const { x, y } = randomCurve(rng);
    const t0 = rng.int(-2, 2);
    const [x1, y1] = [pAt(pDer(x), t0), pAt(pDer(y), t0)];
    const [x2, y2] = [pAt(pDer(pDer(x)), t0), pAt(pDer(pDer(y)), t0)];
    if (x1 === 0) continue;
    const top = y2 * x1 - y1 * x2;
    const answer = Q.of(top, x1 ** 3);
    return numberProblem({
      prompt: t(
        `A curve is given by $${curve(tL(x), tL(y))}$. Find $\\frac{d^{2}y}{dx^{2}}$ at $t = ${t0}$.`,
        `曲线由 $${curve(tL(x), tL(y))}$ 给出。求 $t = ${t0}$ 时的 $\\frac{d^{2}y}{dx^{2}}$。`,
      ),
      answer,
      wrong: [Q.of(top, x1 * x1), ...(x2 === 0 ? [] : [Q.of(y2, x2)]), Q.of(y2, x1)],
      solution: t(
        `$\\frac{dy}{dx} = \\frac{${tL(pDer(y))}}{${tL(pDer(x))}}$. By the quotient rule, $\\frac{d}{dt}\\left(\\frac{dy}{dx}\\right) = \\frac{y''x' - y'x''}{(x')^{2}}$, and dividing by $\\frac{dx}{dt}$ gives $\\frac{d^{2}y}{dx^{2}} = \\frac{y''x' - y'x''}{(x')^{3}}$. At $t = ${t0}$: $x' = ${x1}$, $x'' = ${x2}$, $y' = ${y1}$, $y'' = ${y2}$, so $\\frac{d^{2}y}{dx^{2}} = ${ratio(top, x1 ** 3)}$.`,
        `$\\frac{dy}{dx} = \\frac{${tL(pDer(y))}}{${tL(pDer(x))}}$。由商法则 $\\frac{d}{dt}\\left(\\frac{dy}{dx}\\right) = \\frac{y''x' - y'x''}{(x')^{2}}$，再除以 $\\frac{dx}{dt}$ 得 $\\frac{d^{2}y}{dx^{2}} = \\frac{y''x' - y'x''}{(x')^{3}}$。在 $t = ${t0}$ 时 $x' = ${x1}$，$x'' = ${x2}$，$y' = ${y1}$，$y'' = ${y2}$，所以 $\\frac{d^{2}y}{dx^{2}} = ${ratio(top, x1 ** 3)}$。`,
      ),
    });
  }
}

/** ellipseAngles are angles t with their latex and sin t = s/2. */
const ellipseAngles: readonly (readonly [string, number])[] = [
  ["\\frac{\\pi}{6}", 1],
  ["\\frac{\\pi}{2}", 2],
  ["\\frac{5\\pi}{6}", 1],
  ["\\frac{7\\pi}{6}", -1],
  ["\\frac{3\\pi}{2}", -2],
];

/** secondDerivativeEllipse evaluates d²y/dx² on the ellipse x = a cos t, y = b sin t. */
function secondDerivativeEllipse(rng: Rng) {
  const a = rng.int(1, 4);
  const b = rng.int(1, 5);
  const [angle, s] = rng.pick(ellipseAngles);
  // d²y/dx² = -b / (a² sin³ t), with sin t = s/2.
  const answer = Q.of(-b * 8, a * a * s ** 3);
  const sinL = Q.of(s, 2).toLatex();
  return numberProblem({
    prompt: t(
      `A curve is given by $${curve(`${k1(a)}\\cos t`, `${k1(b)}\\sin t`)}$. Find $\\frac{d^{2}y}{dx^{2}}$ at $t = ${angle}$.`,
      `曲线由 $${curve(`${k1(a)}\\cos t`, `${k1(b)}\\sin t`)}$ 给出。求 $t = ${angle}$ 时的 $\\frac{d^{2}y}{dx^{2}}$。`,
    ),
    answer,
    wrong: [answer.neg(), Q.of(-b * 4, a * a * s * s), Q.of(-b * 8, a * s ** 3)],
    solution: t(
      `$\\frac{dy}{dx} = \\frac{${k1(b)}\\cos t}{-${k1(a)}\\sin t} = ${coef(Q.of(-b, a))}\\cot t$, so $\\frac{d}{dt}\\left(\\frac{dy}{dx}\\right) = ${coef(Q.of(b, a))}\\csc^{2} t$. Dividing by $\\frac{dx}{dt} = -${k1(a)}\\sin t$ gives $\\frac{d^{2}y}{dx^{2}} = -\\frac{${b}}{${a * a}\\sin^{3} t}$. With $\\sin t = ${sinL}$, this is $${answer.toLatex()}$.`,
      `$\\frac{dy}{dx} = \\frac{${k1(b)}\\cos t}{-${k1(a)}\\sin t} = ${coef(Q.of(-b, a))}\\cot t$，所以 $\\frac{d}{dt}\\left(\\frac{dy}{dx}\\right) = ${coef(Q.of(b, a))}\\csc^{2} t$。除以 $\\frac{dx}{dt} = -${k1(a)}\\sin t$ 得 $\\frac{d^{2}y}{dx^{2}} = -\\frac{${b}}{${a * a}\\sin^{3} t}$。代入 $\\sin t = ${sinL}$，得 $${answer.toLatex()}$。`,
    ),
  });
}

/** secondDerivativesOfParametricEquations differentiates dy/dx with respect to t and divides by dx/dt. */
export const secondDerivativesOfParametricEquations: TopicDef = {
  id: "second-derivatives-of-parametric-equations",
  title: t("Second Derivatives of Parametric Equations", "参数方程的二阶导数"),
  summary: t("d²y/dx² is the t-derivative of dy/dx divided by dx/dt.", "d²y/dx² 等于 dy/dx 对 t 的导数除以 dx/dt。"),
  prerequisites: ["differentiating-parametric-curves", "second-and-higher-order-derivatives"],
  encompasses: [{ topic: "differentiating-parametric-curves", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "second-derivatives-of-polynomial-curves",
      title: t("Second derivatives of polynomial curves", "多项式参数曲线的二阶导数"),
      explanation: t(
        "$\\frac{dy}{dx}$ is a function of $t$, so apply the parametric rule to it again:\n\n$$\\frac{d^{2}y}{dx^{2}} = \\frac{\\frac{d}{dt}\\left(\\frac{dy}{dx}\\right)}{dx/dt}.$$\n\nIt is not $\\frac{d^{2}y/dt^{2}}{d^{2}x/dt^{2}}$. For $x = t^{2}$, $y = t^{3}$: $\\frac{dy}{dx} = \\frac{3t}{2}$, so $\\frac{d^{2}y}{dx^{2}} = \\frac{3/2}{2t} = \\frac{3}{4t}$.",
        "$\\frac{dy}{dx}$ 是 $t$ 的函数，所以对它再用一次参数求导法则：\n\n$$\\frac{d^{2}y}{dx^{2}} = \\frac{\\frac{d}{dt}\\left(\\frac{dy}{dx}\\right)}{dx/dt}。$$\n\n它不等于 $\\frac{d^{2}y/dt^{2}}{d^{2}x/dt^{2}}$。对 $x = t^{2}$、$y = t^{3}$：$\\frac{dy}{dx} = \\frac{3t}{2}$，所以 $\\frac{d^{2}y}{dx^{2}} = \\frac{3/2}{2t} = \\frac{3}{4t}$。",
      ),
      generate: secondDerivativePolynomial,
    },
    {
      id: "second-derivatives-of-trigonometric-curves",
      title: t("Second derivatives of trigonometric curves", "三角参数曲线的二阶导数"),
      explanation: t(
        "For the ellipse $x = a\\cos t$, $y = b\\sin t$: $\\frac{dy}{dx} = -\\frac{b}{a}\\cot t$, its $t$-derivative is $\\frac{b}{a}\\csc^{2} t$, and dividing by $-a\\sin t$ gives\n\n$$\\frac{d^{2}y}{dx^{2}} = -\\frac{b}{a^{2}\\sin^{3} t}.$$\n\nIt is negative on the upper half, where $\\sin t > 0$ and the ellipse is concave down.",
        "对椭圆 $x = a\\cos t$、$y = b\\sin t$：$\\frac{dy}{dx} = -\\frac{b}{a}\\cot t$，它对 $t$ 的导数为 $\\frac{b}{a}\\csc^{2} t$，再除以 $-a\\sin t$ 得\n\n$$\\frac{d^{2}y}{dx^{2}} = -\\frac{b}{a^{2}\\sin^{3} t}。$$\n\n在上半部分 $\\sin t > 0$，二阶导数为负，椭圆向下凹。",
      ),
      generate: secondDerivativeEllipse,
    },
  ],
};

/** cubicX writes x = t³/3 - c²t, the coordinate whose speed with y = ct² is t² + c². */
const cubicX = (c: number) => `\\frac{1}{3}t^{3} - ${k1(c * c)}t`;

/** polynomialArcLength measures a curve whose speed is the perfect square t² + c². */
function polynomialArcLength(rng: Rng) {
  const c = rng.int(1, 3);
  const a = rng.int(0, 3);
  const b = rng.int(a + 1, 4);
  const speed: Poly = [c * c, 0, 1];
  const answer = intQ(speed, a, b);
  return numberProblem({
    prompt: t(
      `Find the length of the curve $${curve(cubicX(c), `${k1(c)}t^{2}`)}$ for $${a} \\le t \\le ${b}$.`,
      `求曲线 $${curve(cubicX(c), `${k1(c)}t^{2}`)}$（$${a} \\le t \\le ${b}$）的长度。`,
    ),
    answer,
    wrong: [Q.of(b ** 3 - a ** 3, 3), intQ([-c * c, 0, 1], a, b), Q.of(b ** 2 - a ** 2 + c * c * (b - a))],
    solution: t(
      `$\\frac{dx}{dt} = t^{2} - ${c * c}$ and $\\frac{dy}{dt} = ${2 * c}t$, so $\\left(\\frac{dx}{dt}\\right)^{2} + \\left(\\frac{dy}{dt}\\right)^{2} = t^{4} + ${2 * c * c}t^{2} + ${c ** 4} = (t^{2} + ${c * c})^{2}$. Hence $L = \\int_{${a}}^{${b}} (t^{2} + ${c * c}) \\, dt = ${answer.toLatex()}$.`,
      `$\\frac{dx}{dt} = t^{2} - ${c * c}$，$\\frac{dy}{dt} = ${2 * c}t$，所以 $\\left(\\frac{dx}{dt}\\right)^{2} + \\left(\\frac{dy}{dt}\\right)^{2} = t^{4} + ${2 * c * c}t^{2} + ${c ** 4} = (t^{2} + ${c * c})^{2}$。因此 $L = \\int_{${a}}^{${b}} (t^{2} + ${c * c}) \\, dt = ${answer.toLatex()}$。`,
    ),
  });
}

/** arcAngles are angles θ = qπ with their latex. */
const arcAngles: readonly (readonly [string, Q])[] = [
  ["\\frac{\\pi}{3}", Q.of(1, 3)],
  ["\\frac{\\pi}{2}", Q.of(1, 2)],
  ["\\frac{2\\pi}{3}", Q.of(2, 3)],
  ["\\pi", Q.one],
  ["\\frac{3\\pi}{2}", Q.of(3, 2)],
  ["2\\pi", Q.of(2)],
];

/** exactArcLength measures circular arcs and the curve x = 3kt², y = 2kt³. */
function exactArcLength(rng: Rng) {
  if (rng.bool()) {
    const r = rng.int(1, 6);
    const [h, k] = [rng.int(-3, 3), rng.int(-3, 3)];
    const [angle, q] = rng.pick(arcAngles);
    const shift = (n: number) => (n === 0 ? "" : n > 0 ? ` + ${n}` : ` - ${-n}`);
    const answer = q.mul(Q.of(r));
    return exactProblem(
      t(
        `Find the length of the curve $${curve(`${k1(r)}\\cos t${shift(h)}`, `${k1(r)}\\sin t${shift(k)}`)}$ for $0 \\le t \\le ${angle}$. Give an exact answer.`,
        `求曲线 $${curve(`${k1(r)}\\cos t${shift(h)}`, `${k1(r)}\\sin t${shift(k)}`)}$（$0 \\le t \\le ${angle}$）的长度，给出精确值。`,
      ),
      piL(answer),
      [piL(answer.mul(Q.of(2))), piL(q), piL(q.mul(Q.of(r * r)))],
      `$\\left(\\frac{dx}{dt}\\right)^{2} + \\left(\\frac{dy}{dt}\\right)^{2} = ${r * r}\\sin^{2} t + ${r * r}\\cos^{2} t = ${r * r}$, so $L = \\int_{0}^{${angle}} ${r} \\, dt = ${piL(answer)}$.`,
      `$\\left(\\frac{dx}{dt}\\right)^{2} + \\left(\\frac{dy}{dt}\\right)^{2} = ${r * r}\\sin^{2} t + ${r * r}\\cos^{2} t = ${r * r}$，所以 $L = \\int_{0}^{${angle}} ${r} \\, dt = ${piL(answer)}$。`,
    );
  }
  const k = rng.int(1, 3);
  const b = rng.int(1, 4);
  const N = 1 + b * b;
  const cube = rootTimes(Q.of(N), N, "");
  const answer = `${2 * k}\\left(${cube} - 1\\right)`;
  return exactProblem(
    t(
      `Find the length of the curve $${curve(`${3 * k}t^{2}`, `${2 * k}t^{3}`)}$ for $0 \\le t \\le ${b}$. Give an exact answer.`,
      `求曲线 $${curve(`${3 * k}t^{2}`, `${2 * k}t^{3}`)}$（$0 \\le t \\le ${b}$）的长度，给出精确值。`,
    ),
    answer,
    [`${2 * k}\\cdot ${cube}`, `${k1(k)}\\left(${cube} - 1\\right)`, `${3 * k}\\left(${cube} - 1\\right)`],
    `$\\frac{dx}{dt} = ${6 * k}t$ and $\\frac{dy}{dt} = ${6 * k}t^{2}$, so the speed is $\\sqrt{${36 * k * k}t^{2}(1 + t^{2})} = ${6 * k}t\\sqrt{1 + t^{2}}$. With $w = 1 + t^{2}$, $L = ${3 * k}\\int_{1}^{${N}} \\sqrt{w} \\, dw = ${2 * k}\\Big[w^{3/2}\\Big]_{1}^{${N}} = ${answer}$.`,
    `$\\frac{dx}{dt} = ${6 * k}t$，$\\frac{dy}{dt} = ${6 * k}t^{2}$，所以速率为 $\\sqrt{${36 * k * k}t^{2}(1 + t^{2})} = ${6 * k}t\\sqrt{1 + t^{2}}$。令 $w = 1 + t^{2}$，$L = ${3 * k}\\int_{1}^{${N}} \\sqrt{w} \\, dw = ${2 * k}\\Big[w^{3/2}\\Big]_{1}^{${N}} = ${answer}$。`,
  );
}

/** theArcLengthOfAParametricCurve integrates the speed √(x′² + y′²). */
export const theArcLengthOfAParametricCurve: TopicDef = {
  id: "the-arc-length-of-a-parametric-curve",
  title: t("The Arc Length of a Parametric Curve", "参数曲线的弧长"),
  summary: t(
    "The length of x = f(t), y = g(t) for a ≤ t ≤ b is ∫√(f′(t)² + g′(t)²) dt.",
    "x = f(t)、y = g(t)（a ≤ t ≤ b）的长度为 ∫√(f′(t)² + g′(t)²) dt。",
  ),
  prerequisites: ["differentiating-parametric-curves", "the-arc-length-of-a-planar-curve"],
  encompasses: [{ topic: "the-arc-length-of-a-planar-curve", weight: 0.4 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "arc-length-with-a-perfect-square-speed",
      title: t("Arc length with a perfect-square speed", "速率为完全平方时的弧长"),
      explanation: t(
        "In a short time $dt$ the point moves $dx = x'(t) \\, dt$ across and $dy = y'(t) \\, dt$ up, a distance $\\sqrt{x'(t)^{2} + y'(t)^{2}} \\, dt$. So\n\n$$L = \\int_{a}^{b} \\sqrt{\\left(\\frac{dx}{dt}\\right)^{2} + \\left(\\frac{dy}{dt}\\right)^{2}} \\, dt,$$\n\nassuming the curve is traced once. For $x = \\frac{1}{3}t^{3} - t$, $y = t^{2}$, the sum under the root is $(t^{2} + 1)^{2}$, so $L = \\int_{0}^{3} (t^{2} + 1) \\, dt = 12$.",
        "在很短的时间 $dt$ 内，点横向移动 $dx = x'(t) \\, dt$，纵向移动 $dy = y'(t) \\, dt$，距离为 $\\sqrt{x'(t)^{2} + y'(t)^{2}} \\, dt$。所以\n\n$$L = \\int_{a}^{b} \\sqrt{\\left(\\frac{dx}{dt}\\right)^{2} + \\left(\\frac{dy}{dt}\\right)^{2}} \\, dt，$$\n\n前提是曲线只被描绘一次。对 $x = \\frac{1}{3}t^{3} - t$、$y = t^{2}$，根号内为 $(t^{2} + 1)^{2}$，所以 $L = \\int_{0}^{3} (t^{2} + 1) \\, dt = 12$。",
      ),
      generate: polynomialArcLength,
    },
    {
      id: "exact-arc-lengths",
      title: t("Exact arc lengths", "弧长的精确值"),
      explanation: t(
        "For a circle $x = r\\cos t + h$, $y = r\\sin t + k$, the speed is the constant $r$, so the arc for $0 \\le t \\le \\theta$ has length $r\\theta$. Other curves may need a substitution: for $x = 3t^{2}$, $y = 2t^{3}$, the speed is $6t\\sqrt{1 + t^{2}}$, and $w = 1 + t^{2}$ finishes the integral.",
        "对圆 $x = r\\cos t + h$、$y = r\\sin t + k$，速率是常数 $r$，所以 $0 \\le t \\le \\theta$ 对应的弧长为 $r\\theta$。其他曲线可能需要换元：对 $x = 3t^{2}$、$y = 2t^{3}$，速率为 $6t\\sqrt{1 + t^{2}}$，令 $w = 1 + t^{2}$ 即可完成积分。",
      ),
      generate: exactArcLength,
    },
  ],
};

/** polynomialParametricArea integrates y dx = y(t) x′(t) dt for a curve moving right. */
function polynomialParametricArea(rng: Rng) {
  const c = rng.int(1, 3);
  const x: Poly = [0, c, 1];
  const y: Poly = [rng.int(1, 5), rng.int(0, 3), rng.int(0, 1)];
  const a = rng.int(0, 2);
  const b = a + rng.int(1, 3);
  const integrand = pMul(y, pDer(x));
  const answer = intQ(integrand, a, b);
  return numberProblem({
    prompt: t(
      `Find the area of the region between the curve $${curve(tL(x), tL(y))}$, $${a} \\le t \\le ${b}$, and the $x$-axis.`,
      `求曲线 $${curve(tL(x), tL(y))}$（$${a} \\le t \\le ${b}$）与 $x$ 轴之间区域的面积。`,
    ),
    answer,
    wrong: [intQ(y, a, b), intQ(pMul(x, pDer(y)), a, b), answer.mul(Q.of(2))],
    solution: t(
      `$\\frac{dx}{dt} = ${tL(pDer(x))} > 0$, so the curve moves right and $y > 0$. $A = \\int y \\, dx = \\int_{${a}}^{${b}} (${tL(y)})(${tL(pDer(x))}) \\, dt = \\int_{${a}}^{${b}} (${tL(integrand)}) \\, dt = ${answer.toLatex()}$.`,
      `$\\frac{dx}{dt} = ${tL(pDer(x))} > 0$，曲线向右运动且 $y > 0$。$A = \\int y \\, dx = \\int_{${a}}^{${b}} (${tL(y)})(${tL(pDer(x))}) \\, dt = \\int_{${a}}^{${b}} (${tL(integrand)}) \\, dt = ${answer.toLatex()}$。`,
    ),
  });
}

/** closedCurveArea finds the area of an ellipse or under one arch of a cycloid. */
function closedCurveArea(rng: Rng) {
  if (rng.int(0, 2) > 0) {
    const a = rng.int(1, 6);
    const b = rng.int(1, 6);
    const q = Q.of(a * b);
    return exactProblem(
      t(
        `Find the area enclosed by the curve $${curve(`${k1(a)}\\cos t`, `${k1(b)}\\sin t`)}$, $0 \\le t \\le 2\\pi$. Give an exact answer.`,
        `求曲线 $${curve(`${k1(a)}\\cos t`, `${k1(b)}\\sin t`)}$（$0 \\le t \\le 2\\pi$）所围区域的面积，给出精确值。`,
      ),
      piL(q),
      [piL(q.mul(Q.of(2))), piL(Q.of(a * b, 2)), piL(Q.of(a + b))],
      `By symmetry, $A = 2\\int y \\, dx$ over the upper half, where $t$ runs from $\\pi$ to $0$ as $x$ runs from $-${a}$ to $${a}$: $A = 2\\int_{\\pi}^{0} ${k1(b)}\\sin t \\cdot (-${k1(a)}\\sin t) \\, dt = ${2 * a * b}\\int_{0}^{\\pi} \\sin^{2} t \\, dt = ${2 * a * b} \\cdot \\frac{\\pi}{2} = ${piL(q)}$.`,
      `由对称性，$A = 2\\int y \\, dx$（取上半部分），当 $x$ 从 $-${a}$ 变到 $${a}$ 时 $t$ 从 $\\pi$ 变到 $0$：$A = 2\\int_{\\pi}^{0} ${k1(b)}\\sin t \\cdot (-${k1(a)}\\sin t) \\, dt = ${2 * a * b}\\int_{0}^{\\pi} \\sin^{2} t \\, dt = ${2 * a * b} \\cdot \\frac{\\pi}{2} = ${piL(q)}$。`,
    );
  }
  const r = rng.int(1, 6);
  const q = Q.of(3 * r * r);
  return exactProblem(
    t(
      `Find the area of the region under one arch of the cycloid $${curve(`${k1(r)}(t - \\sin t)`, `${k1(r)}(1 - \\cos t)`)}$, $0 \\le t \\le 2\\pi$, and above the $x$-axis. Give an exact answer.`,
      `求摆线 $${curve(`${k1(r)}(t - \\sin t)`, `${k1(r)}(1 - \\cos t)`)}$（$0 \\le t \\le 2\\pi$）的一拱与 $x$ 轴之间区域的面积，给出精确值。`,
    ),
    piL(q),
    [piL(Q.of(2 * r * r)), piL(Q.of(4 * r * r)), piL(Q.of(r * r))],
    `$A = \\int y \\, dx = \\int_{0}^{2\\pi} ${r * r === 1 ? "" : r * r}(1 - \\cos t)^{2} \\, dt = ${k1(r * r)}\\int_{0}^{2\\pi} \\left(1 - 2\\cos t + \\cos^{2} t\\right) dt = ${k1(r * r)}(2\\pi + \\pi) = ${piL(q)}$.`,
    `$A = \\int y \\, dx = \\int_{0}^{2\\pi} ${r * r === 1 ? "" : r * r}(1 - \\cos t)^{2} \\, dt = ${k1(r * r)}\\int_{0}^{2\\pi} \\left(1 - 2\\cos t + \\cos^{2} t\\right) dt = ${k1(r * r)}(2\\pi + \\pi) = ${piL(q)}$。`,
  );
}

/** calculatingAreasBoundedByParametricFunctions integrates y dx in terms of the parameter. */
export const calculatingAreasBoundedByParametricFunctions: TopicDef = {
  id: "calculating-areas-bounded-by-parametric-functions",
  title: t("Calculating Areas Bounded by Parametric Functions", "计算参数曲线围成的面积"),
  summary: t("The area under a parametric curve is ∫ y dx = ∫ y(t) x′(t) dt.", "参数曲线下方的面积为 ∫ y dx = ∫ y(t) x′(t) dt。"),
  prerequisites: ["differentiating-parametric-curves", "integration-using-substitution"],
  encompasses: [{ topic: "integration-using-substitution", weight: 0.3 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "areas-under-polynomial-parametric-curves",
      title: t("Areas under polynomial parametric curves", "多项式参数曲线下方的面积"),
      explanation: t(
        "The area under a curve is $\\int y \\, dx$. With $x = x(t)$ and $y = y(t)$, substitute $dx = x'(t) \\, dt$:\n\n$$A = \\int_{a}^{b} y(t) \\, x'(t) \\, dt,$$\n\nwhen $y \\ge 0$ and the curve moves right ($x' > 0$) as $t$ goes from $a$ to $b$. For $x = t^{2}$, $y = t$, $0 \\le t \\le 2$: $A = \\int_{0}^{2} t \\cdot 2t \\, dt = \\frac{16}{3}$.",
        "曲线下方的面积为 $\\int y \\, dx$。设 $x = x(t)$、$y = y(t)$，代入 $dx = x'(t) \\, dt$：\n\n$$A = \\int_{a}^{b} y(t) \\, x'(t) \\, dt，$$\n\n前提是 $y \\ge 0$，且 $t$ 从 $a$ 到 $b$ 时曲线向右运动（$x' > 0$）。对 $x = t^{2}$、$y = t$、$0 \\le t \\le 2$：$A = \\int_{0}^{2} t \\cdot 2t \\, dt = \\frac{16}{3}$。",
      ),
      generate: polynomialParametricArea,
    },
    {
      id: "areas-of-ellipses-and-cycloids",
      title: t("Areas of ellipses and cycloids", "椭圆与摆线的面积"),
      explanation: t(
        "If the curve moves left as $t$ increases, $x' < 0$, so reverse the limits so that $x$ increases. For the ellipse $x = a\\cos t$, $y = b\\sin t$, the upper half runs from $t = \\pi$ to $t = 0$ left to right, and the area is $2ab\\int_{0}^{\\pi} \\sin^{2} t \\, dt = \\pi ab$. Under one arch of the cycloid $x = r(t - \\sin t)$, $y = r(1 - \\cos t)$, the area is $r^{2}\\int_{0}^{2\\pi} (1 - \\cos t)^{2} \\, dt = 3\\pi r^{2}$.",
        "若 $t$ 增大时曲线向左运动，则 $x' < 0$，应交换积分限使 $x$ 递增。对椭圆 $x = a\\cos t$、$y = b\\sin t$，上半部分从左到右对应 $t$ 从 $\\pi$ 到 $0$，面积为 $2ab\\int_{0}^{\\pi} \\sin^{2} t \\, dt = \\pi ab$。摆线 $x = r(t - \\sin t)$、$y = r(1 - \\cos t)$ 一拱下方的面积为 $r^{2}\\int_{0}^{2\\pi} (1 - \\cos t)^{2} \\, dt = 3\\pi r^{2}$。",
      ),
      generate: closedCurveArea,
    },
  ],
};

/** polynomialParametricSurface rotates x = t³/3 - c²t, y = ct², whose speed is t² + c², about the x-axis. */
function polynomialParametricSurface(rng: Rng) {
  const c = rng.int(1, 3);
  const a = rng.int(0, 2);
  const b = a + rng.int(1, 3);
  const integrand: Poly = [0, 0, c ** 3, 0, c];
  const q = intQ(integrand, a, b).mul(Q.of(2));
  return exactProblem(
    t(
      `Find the area of the surface obtained by rotating the curve $${curve(cubicX(c), `${k1(c)}t^{2}`)}$, $${a} \\le t \\le ${b}$, about the $x$-axis. Give an exact answer.`,
      `求曲线 $${curve(cubicX(c), `${k1(c)}t^{2}`)}$（$${a} \\le t \\le ${b}$）绕 $x$ 轴旋转一周所得曲面的面积，给出精确值。`,
    ),
    piL(q),
    [piL(q.div(Q.of(2))), q.toLatex(), piL(intQ([c * c, 0, 1], a, b).mul(Q.of(2)))],
    `The speed is $\\sqrt{(t^{2} - ${c * c})^{2} + (${2 * c}t)^{2}} = t^{2} + ${c * c}$, and the radius is $y = ${k1(c)}t^{2}$. So $S = 2\\pi\\int_{${a}}^{${b}} ${k1(c)}t^{2}(t^{2} + ${c * c}) \\, dt = 2\\pi\\int_{${a}}^{${b}} (${tL(integrand)}) \\, dt = ${piL(q)}$.`,
    `速率为 $\\sqrt{(t^{2} - ${c * c})^{2} + (${2 * c}t)^{2}} = t^{2} + ${c * c}$，半径为 $y = ${k1(c)}t^{2}$。所以 $S = 2\\pi\\int_{${a}}^{${b}} ${k1(c)}t^{2}(t^{2} + ${c * c}) \\, dt = 2\\pi\\int_{${a}}^{${b}} (${tL(integrand)}) \\, dt = ${piL(q)}$。`,
  );
}

/** zoneAngles are angles β with their latex and 1 - cos β. */
const zoneAngles: readonly (readonly [string, Q])[] = [
  ["\\frac{\\pi}{3}", Q.of(1, 2)],
  ["\\frac{\\pi}{2}", Q.one],
  ["\\frac{2\\pi}{3}", Q.of(3, 2)],
  ["\\pi", Q.of(2)],
];

/** sphericalZone rotates an arc of the circle x = r cos t, y = r sin t about the x-axis. */
function sphericalZone(rng: Rng) {
  const r = rng.int(1, 9);
  const [angle, oneMinusCos] = rng.pick(zoneAngles);
  const q = oneMinusCos.mul(Q.of(2 * r * r));
  return exactProblem(
    t(
      `Find the area of the surface obtained by rotating the curve $${curve(`${k1(r)}\\cos t`, `${k1(r)}\\sin t`)}$, $0 \\le t \\le ${angle}$, about the $x$-axis. Give an exact answer.`,
      `求曲线 $${curve(`${k1(r)}\\cos t`, `${k1(r)}\\sin t`)}$（$0 \\le t \\le ${angle}$）绕 $x$ 轴旋转一周所得曲面的面积，给出精确值。`,
    ),
    piL(q),
    [piL(q.div(Q.of(2))), piL(Q.of(4 * r * r)), piL(oneMinusCos.mul(Q.of(2 * r)))],
    `The speed is $\\sqrt{${r * r}\\sin^{2} t + ${r * r}\\cos^{2} t} = ${r}$, so $S = 2\\pi\\int_{0}^{${angle}} ${k1(r)}\\sin t \\cdot ${r} \\, dt = ${2 * r * r}\\pi\\Big[-\\cos t\\Big]_{0}^{${angle}} = ${2 * r * r}\\pi \\cdot ${oneMinusCos.toLatex()} = ${piL(q)}$.`,
    `速率为 $\\sqrt{${r * r}\\sin^{2} t + ${r * r}\\cos^{2} t} = ${r}$，所以 $S = 2\\pi\\int_{0}^{${angle}} ${k1(r)}\\sin t \\cdot ${r} \\, dt = ${2 * r * r}\\pi\\Big[-\\cos t\\Big]_{0}^{${angle}} = ${2 * r * r}\\pi \\cdot ${oneMinusCos.toLatex()} = ${piL(q)}$。`,
  );
}

/** surfaceAreasOfRevolutionForParametricCurves integrates 2π y √(x′² + y′²) dt. */
export const surfaceAreasOfRevolutionForParametricCurves: TopicDef = {
  id: "surface-areas-of-revolution-for-parametric-curves",
  title: t("Surface Areas of Revolution for Parametric Curves", "参数曲线旋转曲面的面积"),
  summary: t(
    "Rotating x = f(t), y = g(t) ≥ 0 about the x-axis gives S = 2π∫ g(t)√(f′(t)² + g′(t)²) dt.",
    "x = f(t)、y = g(t) ≥ 0 绕 x 轴旋转所得曲面面积为 S = 2π∫ g(t)√(f′(t)² + g′(t)²) dt。",
  ),
  prerequisites: ["the-arc-length-of-a-parametric-curve", "surface-areas-of-revolution-rotation-about-the-x-axis"],
  encompasses: [{ topic: "surface-areas-of-revolution-rotation-about-the-x-axis", weight: 0.4 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "surfaces-from-polynomial-parametric-curves",
      title: t("Surfaces from polynomial parametric curves", "多项式参数曲线旋转所得的曲面"),
      explanation: t(
        "Replace $ds = \\sqrt{1 + f'(x)^{2}} \\, dx$ by the parametric arc length element $ds = \\sqrt{x'(t)^{2} + y'(t)^{2}} \\, dt$. Rotating about the $x$-axis, the radius is $y(t)$:\n\n$$S = 2\\pi\\int_{a}^{b} y(t)\\sqrt{x'(t)^{2} + y'(t)^{2}} \\, dt.$$",
        "把 $ds = \\sqrt{1 + f'(x)^{2}} \\, dx$ 换成参数形式的弧长元素 $ds = \\sqrt{x'(t)^{2} + y'(t)^{2}} \\, dt$。绕 $x$ 轴旋转时半径为 $y(t)$：\n\n$$S = 2\\pi\\int_{a}^{b} y(t)\\sqrt{x'(t)^{2} + y'(t)^{2}} \\, dt。$$",
      ),
      generate: polynomialParametricSurface,
    },
    {
      id: "zones-of-a-sphere",
      title: t("Zones of a sphere", "球带"),
      explanation: t(
        "For the circle $x = r\\cos t$, $y = r\\sin t$ the speed is $r$, so rotating the arc $0 \\le t \\le \\beta$ about the $x$-axis gives $S = 2\\pi r^{2}\\int_{0}^{\\beta} \\sin t \\, dt = 2\\pi r^{2}(1 - \\cos\\beta)$. With $\\beta = \\pi$ this is the whole sphere, $4\\pi r^{2}$.",
        "对圆 $x = r\\cos t$、$y = r\\sin t$，速率为 $r$，所以弧 $0 \\le t \\le \\beta$ 绕 $x$ 轴旋转得 $S = 2\\pi r^{2}\\int_{0}^{\\beta} \\sin t \\, dt = 2\\pi r^{2}(1 - \\cos\\beta)$。取 $\\beta = \\pi$ 即整个球面 $4\\pi r^{2}$。",
      ),
      generate: sphericalZone,
    },
  ],
};

/** calculusIIParametricTopics are the topics of Calculus II module 3.13, with the parametric surfaces of module 2.11. */
export const calculusIIParametricTopics: readonly TopicDef[] = [
  differentiatingParametricCurves,
  calculatingTangentAndNormalLinesWithParametricEquations,
  secondDerivativesOfParametricEquations,
  theArcLengthOfAParametricCurve,
  calculatingAreasBoundedByParametricFunctions,
  surfaceAreasOfRevolutionForParametricCurves,
];
