import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import { functionProblem, numberProblem, pointProblem } from "../problems.ts";
import { oneOf } from "./calculus-common.ts";
import { exactProblem, times } from "./calculus-ii-areas.ts";
import { lineL } from "./calculus-ii-parametric.ts";
import { rootTimes } from "./calculus-ii-revolution.ts";

// Calculus II unit 3: Polar Coordinates (module 3.16).

/** k1 writes a positive integer coefficient, leaving 1 out. */
const k1 = (k: number) => (k === 1 ? "" : `${k}`);

/** piL writes qπ. */
const piL = (q: Q) => times(q, "\\pi");

/** signed writes " + n" or " - n" after another term. */
const signed = (n: number, rest = "") => `${n < 0 ? "-" : "+"} ${k1(Math.abs(n))}${rest}`;

/** quadrantal are the angles 0, π/2, π and 3π/2 with their cosines and sines. */
const quadrantal: readonly (readonly [string, number, number])[] = [
  ["0", 1, 0],
  ["\\frac{\\pi}{2}", 0, 1],
  ["\\pi", -1, 0],
  ["\\frac{3\\pi}{2}", 0, -1],
];

/** PolarCurve is r = a + b·f(θ), evaluated with r(θ) and r′(θ) at a quadrantal angle. */
interface PolarCurve {
  readonly tex: string;
  /** at gives r and r′ from cos θ and sin θ. */
  readonly at: (c: number, s: number) => readonly [number, number];
}

/** limacon chooses r = a + b cos θ or r = a + b sin θ. */
function limacon(rng: Rng): PolarCurve {
  const a = rng.int(1, 6);
  const b = rng.nonZero(-4, 4);
  return rng.bool()
    ? { tex: `${a} ${signed(b, "\\cos\\theta")}`, at: (c, s) => [a + b * c, -b * s] }
    : { tex: `${a} ${signed(b, "\\sin\\theta")}`, at: (c, s) => [a + b * s, b * c] };
}

/** derivatives gives dx/dθ and dy/dθ from r, r′, cos θ and sin θ. */
const derivatives = (r: number, dr: number, c: number, s: number) => [dr * c - r * s, dr * s + r * c] as const;

/** polarSlopeFormula states dy/dx for a polar curve. */
const polarSlopeFormula =
  "\\frac{dy}{dx} = \\frac{dy/d\\theta}{dx/d\\theta} = \\frac{r'\\sin\\theta + r\\cos\\theta}{r'\\cos\\theta - r\\sin\\theta}";

/** quadrantalSlope finds dy/dx on a limaçon at a quadrantal angle. */
function quadrantalSlope(rng: Rng) {
  for (;;) {
    const curve = limacon(rng);
    const [angle, c, s] = rng.pick(quadrantal);
    const [r, dr] = curve.at(c, s);
    const [dx, dy] = derivatives(r, dr, c, s);
    if (dx === 0) continue;
    const answer = Q.of(dy, dx);
    return numberProblem({
      prompt: t(
        `Find the slope $\\frac{dy}{dx}$ of the polar curve $r = ${curve.tex}$ at $\\theta = ${angle}$.`,
        `求极坐标曲线 $r = ${curve.tex}$ 在 $\\theta = ${angle}$ 处的斜率 $\\frac{dy}{dx}$。`,
      ),
      answer,
      wrong: [...(dr === 0 ? [] : [Q.of(r, dr)]), ...(dy === 0 ? [] : [Q.of(dx, dy)]), Q.of(dr), Q.of(r)],
      solution: t(
        `With $x = r\\cos\\theta$ and $y = r\\sin\\theta$, $${polarSlopeFormula}$. At $\\theta = ${angle}$: $r = ${r}$, $r' = ${dr}$, $\\cos\\theta = ${c}$, $\\sin\\theta = ${s}$. So $\\frac{dy}{d\\theta} = ${dy}$, $\\frac{dx}{d\\theta} = ${dx}$, and $\\frac{dy}{dx} = ${answer.toLatex()}$.`,
        `由 $x = r\\cos\\theta$、$y = r\\sin\\theta$，$${polarSlopeFormula}$。在 $\\theta = ${angle}$ 处：$r = ${r}$，$r' = ${dr}$，$\\cos\\theta = ${c}$，$\\sin\\theta = ${s}$。所以 $\\frac{dy}{d\\theta} = ${dy}$，$\\frac{dx}{d\\theta} = ${dx}$，$\\frac{dy}{dx} = ${answer.toLatex()}$。`,
      ),
    });
  }
}

/** coordinateRate finds dx/dθ or dy/dθ on a limaçon at a quadrantal angle. */
function coordinateRate(rng: Rng) {
  const curve = limacon(rng);
  const [angle, c, s] = rng.pick(quadrantal);
  const [r, dr] = curve.at(c, s);
  const [dx, dy] = derivatives(r, dr, c, s);
  const askX = rng.bool();
  const v = askX ? "x" : "y";
  const answer = askX ? dx : dy;
  const formula = askX ? "r'\\cos\\theta - r\\sin\\theta" : "r'\\sin\\theta + r\\cos\\theta";
  return numberProblem({
    prompt: t(
      `For the polar curve $r = ${curve.tex}$, find $\\frac{d${v}}{d\\theta}$ at $\\theta = ${angle}$.`,
      `对极坐标曲线 $r = ${curve.tex}$，求 $\\theta = ${angle}$ 处的 $\\frac{d${v}}{d\\theta}$。`,
    ),
    answer,
    wrong: [askX ? dy : dx, askX ? r * c : r * s, askX ? dr * c + r * s : dr * s - r * c],
    solution: t(
      `$${v} = r${askX ? "\\cos" : "\\sin"}\\theta$, so by the product rule $\\frac{d${v}}{d\\theta} = ${formula}$. At $\\theta = ${angle}$, $r = ${r}$ and $r' = ${dr}$, giving $${answer}$.`,
      `$${v} = r${askX ? "\\cos" : "\\sin"}\\theta$，由乘积法则 $\\frac{d${v}}{d\\theta} = ${formula}$。在 $\\theta = ${angle}$ 处 $r = ${r}$，$r' = ${dr}$，得 $${answer}$。`,
    ),
  });
}

/** differentiatingCurvesGivenInPolarForm treats r = f(θ) as the parametric curve x = f(θ)cos θ, y = f(θ)sin θ. */
export const differentiatingCurvesGivenInPolarForm: TopicDef = {
  id: "differentiating-curves-given-in-polar-form",
  title: t("Differentiating Curves Given in Polar Form", "极坐标曲线的求导"),
  summary: t(
    "A polar curve r = f(θ) is the parametric curve x = f(θ)cos θ, y = f(θ)sin θ, so dy/dx = (dy/dθ)/(dx/dθ).",
    "极坐标曲线 r = f(θ) 就是参数曲线 x = f(θ)cos θ、y = f(θ)sin θ，所以 dy/dx = (dy/dθ)/(dx/dθ)。",
  ),
  prerequisites: ["differentiating-parametric-curves", "converting-from-polar-coordinates-to-cartesian-coordinates"],
  encompasses: [{ topic: "differentiating-parametric-curves", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "rates-of-change-of-x-and-y",
      title: t("Rates of change of x and y", "x 与 y 的变化率"),
      explanation: t(
        "A polar curve $r = f(\\theta)$ is the parametric curve $x = f(\\theta)\\cos\\theta$, $y = f(\\theta)\\sin\\theta$ with parameter $\\theta$. By the product rule,\n\n$$\\frac{dx}{d\\theta} = r'\\cos\\theta - r\\sin\\theta, \\qquad \\frac{dy}{d\\theta} = r'\\sin\\theta + r\\cos\\theta,$$\n\nwhere $r' = f'(\\theta)$. For $r = 2 + \\cos\\theta$ at $\\theta = \\frac{\\pi}{2}$: $r = 2$, $r' = -1$, so $\\frac{dx}{d\\theta} = -2$ and $\\frac{dy}{d\\theta} = -1$.",
        "极坐标曲线 $r = f(\\theta)$ 就是以 $\\theta$ 为参数的参数曲线 $x = f(\\theta)\\cos\\theta$、$y = f(\\theta)\\sin\\theta$。由乘积法则，\n\n$$\\frac{dx}{d\\theta} = r'\\cos\\theta - r\\sin\\theta，\\qquad \\frac{dy}{d\\theta} = r'\\sin\\theta + r\\cos\\theta，$$\n\n其中 $r' = f'(\\theta)$。对 $r = 2 + \\cos\\theta$，在 $\\theta = \\frac{\\pi}{2}$ 处 $r = 2$，$r' = -1$，所以 $\\frac{dx}{d\\theta} = -2$，$\\frac{dy}{d\\theta} = -1$。",
      ),
      generate: coordinateRate,
    },
    {
      id: "slopes-of-polar-curves",
      title: t("Slopes of polar curves", "极坐标曲线的斜率"),
      explanation: t(
        `As for any parametric curve,\n\n$$${polarSlopeFormula}.$$\n\nIt is not $\\frac{dr}{d\\theta}$. For $r = 2 + \\cos\\theta$ at $\\theta = \\frac{\\pi}{2}$: $\\frac{dy}{dx} = \\frac{-1}{-2} = \\frac{1}{2}$.`,
        `与任何参数曲线一样，\n\n$$${polarSlopeFormula}。$$\n\n它不等于 $\\frac{dr}{d\\theta}$。对 $r = 2 + \\cos\\theta$，在 $\\theta = \\frac{\\pi}{2}$ 处 $\\frac{dy}{dx} = \\frac{-1}{-2} = \\frac{1}{2}$。`,
      ),
      generate: quadrantalSlope,
    },
  ],
};

/** diagonal are the angles π/4, 3π/4, 5π/4 and 7π/4 with the signs of their cosines and sines and of sin 2θ. */
const diagonal: readonly (readonly [string, number, number, number])[] = [
  ["\\frac{\\pi}{4}", 1, 1, 1],
  ["\\frac{3\\pi}{4}", -1, 1, -1],
  ["\\frac{5\\pi}{4}", -1, -1, 1],
  ["\\frac{7\\pi}{4}", 1, -1, -1],
];

/** diagonalSlope finds dy/dx on r = a + b cos 2θ or r = a + b sin 2θ at an odd multiple of π/4, where √2/2 cancels. */
function diagonalSlope(rng: Rng) {
  for (;;) {
    const a = rng.int(1, 6);
    const b = rng.nonZero(-3, 3);
    const [angle, c, s, s2] = rng.pick(diagonal);
    const cosine = rng.bool();
    // cos 2θ = 0 at these angles; sin 2θ = s2.
    const [r, dr] = cosine ? [a, -2 * b * s2] : [a + b * s2, 0];
    const tex = `${a} ${signed(b, cosine ? "\\cos 2\\theta" : "\\sin 2\\theta")}`;
    const [dx, dy] = derivatives(r, dr, c, s);
    const pr = r < 0 ? `(${r})` : `${r}`;
    if (dx === 0) continue;
    const answer = Q.of(dy, dx);
    return numberProblem({
      prompt: t(
        `Find the slope $\\frac{dy}{dx}$ of the polar curve $r = ${tex}$ at $\\theta = ${angle}$.`,
        `求极坐标曲线 $r = ${tex}$ 在 $\\theta = ${angle}$ 处的斜率 $\\frac{dy}{dx}$。`,
      ),
      answer,
      wrong: [...(dy === 0 ? [] : [Q.of(dx, dy)]), Q.of(dr), Q.of(c * s)],
      solution: t(
        `At $\\theta = ${angle}$: $r = ${r}$ and $r' = ${dr}$, while $\\cos\\theta = ${c < 0 ? "-" : ""}\\frac{\\sqrt{2}}{2}$ and $\\sin\\theta = ${s < 0 ? "-" : ""}\\frac{\\sqrt{2}}{2}$. In $${polarSlopeFormula}$ the factor $\\frac{\\sqrt{2}}{2}$ cancels, leaving $\\frac{${dr} \\cdot (${s}) + ${pr} \\cdot (${c})}{${dr} \\cdot (${c}) - ${pr} \\cdot (${s})} = \\frac{${dy}}{${dx}} = ${answer.toLatex()}$.`,
        `在 $\\theta = ${angle}$ 处：$r = ${r}$，$r' = ${dr}$，$\\cos\\theta = ${c < 0 ? "-" : ""}\\frac{\\sqrt{2}}{2}$，$\\sin\\theta = ${s < 0 ? "-" : ""}\\frac{\\sqrt{2}}{2}$。在 $${polarSlopeFormula}$ 中因子 $\\frac{\\sqrt{2}}{2}$ 约去，得 $\\frac{${dr} \\cdot (${s}) + ${pr} \\cdot (${c})}{${dr} \\cdot (${c}) - ${pr} \\cdot (${s})} = \\frac{${dy}}{${dx}} = ${answer.toLatex()}$。`,
      ),
    });
  }
}

/** spiralSlope finds dy/dx on the logarithmic spiral r = a e^{kθ}, where r′ = kr. */
function spiralSlope(rng: Rng) {
  for (;;) {
    const a = rng.int(1, 5);
    const k = rng.int(2, 5);
    const [angle, c, s] = rng.bool() ? rng.pick(quadrantal) : rng.pick(diagonal);
    // r′ = kr; dividing numerator and denominator by r (and by √2/2 at the diagonal angles):
    const [dx, dy] = derivatives(1, k, c, s);
    if (dx === 0) continue;
    const answer = Q.of(dy, dx);
    return numberProblem({
      prompt: t(
        `Find the slope $\\frac{dy}{dx}$ of the spiral $r = ${k1(a)}e^{${k}\\theta}$ at $\\theta = ${angle}$.`,
        `求螺线 $r = ${k1(a)}e^{${k}\\theta}$ 在 $\\theta = ${angle}$ 处的斜率 $\\frac{dy}{dx}$。`,
      ),
      answer,
      wrong: [...(dy === 0 ? [] : [Q.of(dx, dy)]), Q.of(k), answer.neg()],
      solution: t(
        `$r' = ${k}r$, so $${polarSlopeFormula} = \\frac{${k}\\sin\\theta + \\cos\\theta}{${k}\\cos\\theta - \\sin\\theta}$ after dividing by $r$. At $\\theta = ${angle}$ this is $\\frac{${dy}}{${dx}} = ${answer.toLatex()}$${c !== 0 && s !== 0 ? ", where the common factor $\\frac{\\sqrt{2}}{2}$ cancels" : ""}.`,
        `$r' = ${k}r$，所以除以 $r$ 后 $${polarSlopeFormula} = \\frac{${k}\\sin\\theta + \\cos\\theta}{${k}\\cos\\theta - \\sin\\theta}$。在 $\\theta = ${angle}$ 处为 $\\frac{${dy}}{${dx}} = ${answer.toLatex()}$${c !== 0 && s !== 0 ? "，其中公因子 $\\frac{\\sqrt{2}}{2}$ 约去" : ""}。`,
      ),
    });
  }
}

/** furtherDifferentiationOfCurvesGivenInPolarForm differentiates roses, limaçons and spirals at other angles. */
export const furtherDifferentiationOfCurvesGivenInPolarForm: TopicDef = {
  id: "further-differentiation-of-curves-given-in-polar-form",
  title: t("Further Differentiation of Curves Given in Polar Form", "极坐标曲线求导进阶"),
  summary: t(
    "The polar slope formula applies to any differentiable r = f(θ), including roses and spirals, at any angle.",
    "极坐标斜率公式适用于任何可导的 r = f(θ)，包括玫瑰线和螺线，以及任意角度。",
  ),
  prerequisites: ["differentiating-curves-given-in-polar-form", "the-chain-rule-with-exponential-functions"],
  encompasses: [{ topic: "differentiating-curves-given-in-polar-form", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "slopes-at-odd-multiples-of-a-quarter-turn",
      title: t("Slopes at odd multiples of π/4", "π/4 奇数倍处的斜率"),
      explanation: t(
        `At $\\theta = \\frac{\\pi}{4}$, $\\cos\\theta = \\sin\\theta = \\frac{\\sqrt{2}}{2}$, and the common factor cancels in $${polarSlopeFormula}$. For $r = 3 + \\cos 2\\theta$ at $\\frac{\\pi}{4}$: $r = 3$ and $r' = -2\\sin 2\\theta = -2$, so $\\frac{dy}{dx} = \\frac{-2 + 3}{-2 - 3} = -\\frac{1}{5}$.`,
        `在 $\\theta = \\frac{\\pi}{4}$ 处 $\\cos\\theta = \\sin\\theta = \\frac{\\sqrt{2}}{2}$，在 $${polarSlopeFormula}$ 中公因子约去。对 $r = 3 + \\cos 2\\theta$，在 $\\frac{\\pi}{4}$ 处 $r = 3$，$r' = -2\\sin 2\\theta = -2$，所以 $\\frac{dy}{dx} = \\frac{-2 + 3}{-2 - 3} = -\\frac{1}{5}$。`,
      ),
      generate: diagonalSlope,
    },
    {
      id: "slopes-of-logarithmic-spirals",
      title: t("Slopes of logarithmic spirals", "对数螺线的斜率"),
      explanation: t(
        "For the spiral $r = ae^{k\\theta}$, $r' = kr$, so $r$ cancels from the slope: $\\frac{dy}{dx} = \\frac{k\\sin\\theta + \\cos\\theta}{k\\cos\\theta - \\sin\\theta}$. For $k = 2$ at $\\theta = \\frac{\\pi}{2}$: $\\frac{dy}{dx} = \\frac{2}{-1} = -2$.",
        "对螺线 $r = ae^{k\\theta}$，$r' = kr$，所以斜率中 $r$ 约去：$\\frac{dy}{dx} = \\frac{k\\sin\\theta + \\cos\\theta}{k\\cos\\theta - \\sin\\theta}$。取 $k = 2$，在 $\\theta = \\frac{\\pi}{2}$ 处 $\\frac{dy}{dx} = \\frac{2}{-1} = -2$。",
      ),
      generate: spiralSlope,
    },
  ],
};

/** cardioidTangents locates horizontal and vertical tangents of r = a(1 ± cos θ). */
function cardioidTangents(rng: Rng) {
  const a = rng.int(1, 8);
  const plus = rng.bool();
  const tex = `${k1(a)}(1 ${plus ? "+" : "-"} \\cos\\theta)`;
  const ask = rng.int(0, 2);
  const work = t(
    `$\\frac{dy}{d\\theta} = ${k1(a)}(${plus ? "\\cos\\theta + \\cos 2\\theta" : "\\cos\\theta - \\cos 2\\theta"})$ and $\\frac{dx}{d\\theta} = -${k1(a)}(${plus ? "\\sin\\theta + \\sin 2\\theta" : "\\sin\\theta - \\sin 2\\theta"})$.`,
    `$\\frac{dy}{d\\theta} = ${k1(a)}(${plus ? "\\cos\\theta + \\cos 2\\theta" : "\\cos\\theta - \\cos 2\\theta"})$，$\\frac{dx}{d\\theta} = -${k1(a)}(${plus ? "\\sin\\theta + \\sin 2\\theta" : "\\sin\\theta - \\sin 2\\theta"})$。`,
  );
  if (ask === 0) {
    const angle = plus ? "\\frac{\\pi}{3}" : "\\frac{2\\pi}{3}";
    return exactProblem(
      t(
        `The cardioid $r = ${tex}$ has a horizontal tangent at one angle $\\theta$ with $0 < \\theta < \\pi$. Find that $\\theta$.`,
        `心形线 $r = ${tex}$ 在 $0 < \\theta < \\pi$ 中恰有一个角 $\\theta$ 处有水平切线。求这个 $\\theta$。`,
      ),
      angle,
      plus ? ["\\frac{2\\pi}{3}", "\\frac{\\pi}{2}", "\\frac{\\pi}{6}"] : ["\\frac{\\pi}{3}", "\\frac{\\pi}{2}", "\\frac{5\\pi}{6}"],
      `${work.en} Horizontal tangents need $\\frac{dy}{d\\theta} = 0$: $${plus ? "\\cos\\theta + \\cos 2\\theta = (2\\cos\\theta - 1)(\\cos\\theta + 1)" : "\\cos\\theta - \\cos 2\\theta = -(2\\cos\\theta + 1)(\\cos\\theta - 1)"} = 0$, so $\\cos\\theta = ${plus ? "\\frac{1}{2}" : "-\\frac{1}{2}"}$ in $(0, \\pi)$, giving $\\theta = ${angle}$, where $\\frac{dx}{d\\theta} \\ne 0$.`,
      `${work["zh-CN"]}水平切线要求 $\\frac{dy}{d\\theta} = 0$：$${plus ? "\\cos\\theta + \\cos 2\\theta = (2\\cos\\theta - 1)(\\cos\\theta + 1)" : "\\cos\\theta - \\cos 2\\theta = -(2\\cos\\theta + 1)(\\cos\\theta - 1)"} = 0$，在 $(0, \\pi)$ 中 $\\cos\\theta = ${plus ? "\\frac{1}{2}" : "-\\frac{1}{2}"}$，得 $\\theta = ${angle}$，此时 $\\frac{dx}{d\\theta} \\ne 0$。`,
    );
  }
  if (ask === 1) {
    const answer = rootTimes(Q.of(3 * a, 4), 3, "");
    return exactProblem(
      t(
        `Find the largest $y$-coordinate of a point on the cardioid $r = ${tex}$. Give an exact answer.`,
        `求心形线 $r = ${tex}$ 上点的最大 $y$ 坐标，给出精确值。`,
      ),
      answer,
      [`${2 * a}`, `${a}`, rootTimes(Q.of(a, 2), 3, "")],
      `${work.en} The highest point has a horizontal tangent, at $\\cos\\theta = ${plus ? "\\frac{1}{2}" : "-\\frac{1}{2}"}$ with $\\sin\\theta = \\frac{\\sqrt{3}}{2}$. There $r = ${Q.of(3 * a, 2).toLatex()}$, so $y = r\\sin\\theta = ${answer}$.`,
      `${work["zh-CN"]}最高点处切线水平，此时 $\\cos\\theta = ${plus ? "\\frac{1}{2}" : "-\\frac{1}{2}"}$，$\\sin\\theta = \\frac{\\sqrt{3}}{2}$。这时 $r = ${Q.of(3 * a, 2).toLatex()}$，所以 $y = r\\sin\\theta = ${answer}$。`,
    );
  }
  const answer = Q.of(plus ? -a : a, 4);
  return numberProblem({
    prompt: t(
      `The cardioid $r = ${tex}$ has a vertical tangent at a point with $x = ${plus ? 2 * a : -2 * a}$ and at two other points. Find the $x$-coordinate of those two points.`,
      `心形线 $r = ${tex}$ 在 $x = ${plus ? 2 * a : -2 * a}$ 的点和另外两个点处有竖直切线。求另外两个点的 $x$ 坐标。`,
    ),
    answer,
    wrong: [answer.neg(), Q.of(plus ? -a : a, 2), Q.zero],
    solution: t(
      `${work.en} Vertical tangents need $\\frac{dx}{d\\theta} = 0$: $\\sin\\theta(1 ${plus ? "+" : "-"} 2\\cos\\theta) = 0$. Besides $\\sin\\theta = 0$, $\\cos\\theta = ${plus ? "-" : ""}\\frac{1}{2}$, where $r = ${Q.of(a, 2).toLatex()}$ and $x = r\\cos\\theta = ${answer.toLatex()}$.`,
      `${work["zh-CN"]}竖直切线要求 $\\frac{dx}{d\\theta} = 0$：$\\sin\\theta(1 ${plus ? "+" : "-"} 2\\cos\\theta) = 0$。除 $\\sin\\theta = 0$ 外，$\\cos\\theta = ${plus ? "-" : ""}\\frac{1}{2}$，此时 $r = ${Q.of(a, 2).toLatex()}$，$x = r\\cos\\theta = ${answer.toLatex()}$。`,
    ),
  });
}

/** circleTangents locates the points of r = 2a cos θ or r = 2a sin θ with horizontal or vertical tangents. */
function circleTangents(rng: Rng) {
  const a = rng.int(1, 9);
  const cosine = rng.bool();
  const tex = `${2 * a}\\${cosine ? "cos" : "sin"}\\theta`;
  // r = 2a cos θ: horizontal at θ = ±π/4, points (a, ±a). r = 2a sin θ: vertical at θ = π/4, 3π/4, points (±a, a).
  const positive = rng.bool();
  const kind = cosine ? t("horizontal", "水平") : t("vertical", "竖直");
  const sign = positive ? t("positive", "正") : t("negative", "负");
  const condition = cosine
    ? t(`${sign.en} $y$-coordinate`, `$y$ 坐标为${sign["zh-CN"]}`)
    : t(`${sign.en} $x$-coordinate`, `$x$ 坐标为${sign["zh-CN"]}`);
  const point: readonly [number, number] = positive ? [a, a] : cosine ? [a, -a] : [-a, a];
  const angle = positive ? "\\frac{\\pi}{4}" : cosine ? "-\\frac{\\pi}{4}" : "\\frac{3\\pi}{4}";
  const [x, y, d] = cosine
    ? [`${a}(1 + \\cos 2\\theta)`, `${a}\\sin 2\\theta`, "y"]
    : [`${a}\\sin 2\\theta`, `${a}(1 - \\cos 2\\theta)`, "x"];
  return pointProblem({
    prompt: t(
      `The circle $r = ${tex}$ has a ${kind.en} tangent at a point with ${condition.en}. Find that point in Cartesian coordinates.`,
      `圆 $r = ${tex}$ 在${condition["zh-CN"]}的某点处有${kind["zh-CN"]}切线。求该点的直角坐标。`,
    ),
    answer: point,
    wrong: [
      [2 * a, 0],
      [0, 2 * a],
      [a, -a],
      [-a, a],
      [a, a],
    ],
    solution: t(
      `$x = r\\cos\\theta = ${x}$ and $y = r\\sin\\theta = ${y}$. $\\frac{d${d}}{d\\theta} = ${2 * a}\\cos 2\\theta = 0$ at $\\theta = ${angle}$, where $r = ${a}\\sqrt{2}$ and the point is $(${point[0]}, ${point[1]})$.`,
      `$x = r\\cos\\theta = ${x}$，$y = r\\sin\\theta = ${y}$。$\\frac{d${d}}{d\\theta} = ${2 * a}\\cos 2\\theta = 0$ 时 $\\theta = ${angle}$，此时 $r = ${a}\\sqrt{2}$，点为 $(${point[0]}, ${point[1]})$。`,
    ),
  });
}

/** horizontalAndVerticalTangentsToPolarCurves solves dy/dθ = 0 and dx/dθ = 0. */
export const horizontalAndVerticalTangentsToPolarCurves: TopicDef = {
  id: "horizontal-and-vertical-tangents-to-polar-curves",
  title: t("Horizontal and Vertical Tangents to Polar Curves", "极坐标曲线的水平切线与竖直切线"),
  summary: t(
    "A polar curve has a horizontal tangent where dy/dθ = 0 ≠ dx/dθ and a vertical tangent where dx/dθ = 0 ≠ dy/dθ.",
    "极坐标曲线在 dy/dθ = 0 ≠ dx/dθ 处有水平切线，在 dx/dθ = 0 ≠ dy/dθ 处有竖直切线。",
  ),
  prerequisites: ["differentiating-curves-given-in-polar-form", "calculating-tangent-and-normal-lines-with-parametric-equations"],
  encompasses: [{ topic: "differentiating-curves-given-in-polar-form", weight: 0.5 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "tangents-to-polar-circles",
      title: t("Tangents to polar circles", "极坐标圆的切线"),
      explanation: t(
        "Write $x$ and $y$ in terms of $\\theta$ and set a derivative to zero. For $r = 4\\cos\\theta$: $y = 4\\cos\\theta\\sin\\theta = 2\\sin 2\\theta$, so $\\frac{dy}{d\\theta} = 4\\cos 2\\theta = 0$ at $\\theta = \\pm\\frac{\\pi}{4}$. There $r = 2\\sqrt{2}$, and the points are $(2, \\pm 2)$: the top and bottom of the circle of radius $2$ centered at $(2, 0)$.",
        "把 $x$、$y$ 写成 $\\theta$ 的函数，令导数为零。对 $r = 4\\cos\\theta$：$y = 4\\cos\\theta\\sin\\theta = 2\\sin 2\\theta$，所以 $\\frac{dy}{d\\theta} = 4\\cos 2\\theta = 0$ 时 $\\theta = \\pm\\frac{\\pi}{4}$。此时 $r = 2\\sqrt{2}$，点为 $(2, \\pm 2)$，即以 $(2, 0)$ 为圆心、半径为 $2$ 的圆的最高点和最低点。",
      ),
      generate: circleTangents,
    },
    {
      id: "tangents-to-cardioids",
      title: t("Tangents to cardioids", "心形线的切线"),
      explanation: t(
        "For $r = a(1 + \\cos\\theta)$: $\\frac{dy}{d\\theta} = a(\\cos\\theta + \\cos 2\\theta) = a(2\\cos\\theta - 1)(\\cos\\theta + 1)$ and $\\frac{dx}{d\\theta} = -a\\sin\\theta(1 + 2\\cos\\theta)$. Horizontal tangents occur at $\\cos\\theta = \\frac{1}{2}$, vertical ones at $\\sin\\theta = 0$ or $\\cos\\theta = -\\frac{1}{2}$. At $\\theta = \\pi$ both derivatives vanish; that is the cusp at the pole, handled separately.",
        "对 $r = a(1 + \\cos\\theta)$：$\\frac{dy}{d\\theta} = a(\\cos\\theta + \\cos 2\\theta) = a(2\\cos\\theta - 1)(\\cos\\theta + 1)$，$\\frac{dx}{d\\theta} = -a\\sin\\theta(1 + 2\\cos\\theta)$。水平切线在 $\\cos\\theta = \\frac{1}{2}$ 处，竖直切线在 $\\sin\\theta = 0$ 或 $\\cos\\theta = -\\frac{1}{2}$ 处。在 $\\theta = \\pi$ 处两个导数都为零，那是极点处的尖点，需另行处理。",
      ),
      generate: cardioidTangents,
    },
  ],
};

/** PoleCase is a polar curve through the pole at θ₀, with the slope tan θ₀ there. */
interface PoleCase {
  readonly tex: (a: number) => string;
  readonly angle: string;
  readonly slope: string;
  readonly wrong: readonly string[];
}

/** poleCases are limaçons and roses that pass through the pole with r′ ≠ 0. */
const poleCases: readonly PoleCase[] = [
  {
    tex: (a) => `${k1(a)}(1 + 2\\cos\\theta)`,
    angle: "\\frac{2\\pi}{3}",
    slope: "-\\sqrt{3}",
    wrong: ["\\sqrt{3}", "-\\frac{\\sqrt{3}}{3}", "0"],
  },
  {
    tex: (a) => `${k1(a)}(1 - 2\\cos\\theta)`,
    angle: "\\frac{\\pi}{3}",
    slope: "\\sqrt{3}",
    wrong: ["-\\sqrt{3}", "\\frac{\\sqrt{3}}{3}", "0"],
  },
  {
    tex: (a) => `${k1(a)}(1 - 2\\sin\\theta)`,
    angle: "\\frac{\\pi}{6}",
    slope: "\\frac{\\sqrt{3}}{3}",
    wrong: ["\\sqrt{3}", "-\\frac{\\sqrt{3}}{3}", "0"],
  },
  {
    tex: (a) => `${k1(a)}(1 + 2\\sin\\theta)`,
    angle: "\\frac{7\\pi}{6}",
    slope: "\\frac{\\sqrt{3}}{3}",
    wrong: ["-\\frac{\\sqrt{3}}{3}", "\\sqrt{3}", "0"],
  },
  { tex: (a) => `${k1(a)}\\cos 2\\theta`, angle: "\\frac{\\pi}{4}", slope: "1", wrong: ["-1", "0", "-2"] },
  { tex: (a) => `${k1(a)}\\cos 2\\theta`, angle: "\\frac{3\\pi}{4}", slope: "-1", wrong: ["1", "0", "2"] },
  {
    tex: (a) => `${k1(a)}\\sin 3\\theta`,
    angle: "\\frac{\\pi}{3}",
    slope: "\\sqrt{3}",
    wrong: ["-\\sqrt{3}", "\\frac{\\sqrt{3}}{3}", "0"],
  },
  {
    tex: (a) => `${k1(a)}\\cos 3\\theta`,
    angle: "\\frac{\\pi}{6}",
    slope: "\\frac{\\sqrt{3}}{3}",
    wrong: ["\\sqrt{3}", "-\\frac{\\sqrt{3}}{3}", "0"],
  },
  {
    tex: (a) => `${k1(a)}\\sin 3\\theta`,
    angle: "\\frac{2\\pi}{3}",
    slope: "-\\sqrt{3}",
    wrong: ["\\sqrt{3}", "-\\frac{\\sqrt{3}}{3}", "0"],
  },
  {
    tex: (a) => `${k1(a)}\\cos 3\\theta`,
    angle: "\\frac{5\\pi}{6}",
    slope: "-\\frac{\\sqrt{3}}{3}",
    wrong: ["\\frac{\\sqrt{3}}{3}", "-\\sqrt{3}", "0"],
  },
];

/** slopeAtThePole finds the slope of a polar curve where it passes through the pole. */
function slopeAtThePole(rng: Rng) {
  const c = rng.pick(poleCases);
  const a = rng.int(1, 6);
  return exactProblem(
    t(
      `The polar curve $r = ${c.tex(a)}$ passes through the pole at $\\theta = ${c.angle}$. Find the slope of its tangent line there. Give an exact answer.`,
      `极坐标曲线 $r = ${c.tex(a)}$ 在 $\\theta = ${c.angle}$ 处经过极点。求该处切线的斜率，给出精确值。`,
    ),
    c.slope,
    c.wrong,
    `At $\\theta = ${c.angle}$, $r = 0$ and $r' \\ne 0$. With $r = 0$ the slope formula becomes $\\frac{dy}{dx} = \\frac{r'\\sin\\theta}{r'\\cos\\theta} = \\tan\\theta$, so the tangent is the line $\\theta = ${c.angle}$, with slope $\\tan ${c.angle} = ${c.slope}$.`,
    `在 $\\theta = ${c.angle}$ 处 $r = 0$ 且 $r' \\ne 0$。$r = 0$ 时斜率公式化为 $\\frac{dy}{dx} = \\frac{r'\\sin\\theta}{r'\\cos\\theta} = \\tan\\theta$，所以切线就是直线 $\\theta = ${c.angle}$，斜率为 $\\tan ${c.angle} = ${c.slope}$。`,
  );
}

/** CuspCase is a curve through the pole at θ₀ and the tangent line there. */
interface CuspCase {
  readonly tex: (a: number) => string;
  readonly angle: string;
  readonly line: number;
  readonly cusp: boolean;
}

/** lines are the four lines through the origin that tangents at the pole take here. */
const lines: readonly Text[] = [
  t("$y = 0$ (the $x$-axis)", "$y = 0$（$x$ 轴）"),
  t("$x = 0$ (the $y$-axis)", "$x = 0$（$y$ 轴）"),
  t("$y = x$", "$y = x$"),
  t("$y = -x$", "$y = -x$"),
];

/** cuspCases are cardioids at their cusps and roses at the pole. */
const cuspCases: readonly CuspCase[] = [
  { tex: (a) => `${k1(a)}(1 + \\cos\\theta)`, angle: "\\pi", line: 0, cusp: true },
  { tex: (a) => `${k1(a)}(1 - \\cos\\theta)`, angle: "0", line: 0, cusp: true },
  { tex: (a) => `${k1(a)}(1 + \\sin\\theta)`, angle: "\\frac{3\\pi}{2}", line: 1, cusp: true },
  { tex: (a) => `${k1(a)}(1 - \\sin\\theta)`, angle: "\\frac{\\pi}{2}", line: 1, cusp: true },
  { tex: (a) => `${k1(a)}\\sin 2\\theta`, angle: "\\frac{\\pi}{2}", line: 1, cusp: false },
  { tex: (a) => `${k1(a)}\\sin 2\\theta`, angle: "\\pi", line: 0, cusp: false },
  { tex: (a) => `${k1(a)}\\cos 2\\theta`, angle: "\\frac{\\pi}{4}", line: 2, cusp: false },
  { tex: (a) => `${k1(a)}\\cos 2\\theta`, angle: "\\frac{5\\pi}{4}", line: 2, cusp: false },
  { tex: (a) => `${k1(a)}\\cos 2\\theta`, angle: "\\frac{3\\pi}{4}", line: 3, cusp: false },
];

/** tangentAtThePole identifies the tangent line at the pole, including at cusps where dx/dθ = dy/dθ = 0. */
function tangentAtThePole(rng: Rng) {
  const c = rng.pick(cuspCases);
  const a = rng.int(1, 6);
  const right = lines[c.line]!;
  const reason = c.cusp
    ? t(
        `Here $r' = 0$ too, so $\\frac{dx}{d\\theta} = \\frac{dy}{d\\theta} = 0$ and the slope formula gives $\\frac{0}{0}$. Points near the pole have $\\theta$ near $${c.angle}$, so the curve approaches the pole along the line $\\theta = ${c.angle}$: there is a cusp, and the tangent is that line.`,
        `这里 $r' = 0$ 也成立，所以 $\\frac{dx}{d\\theta} = \\frac{dy}{d\\theta} = 0$，斜率公式给出 $\\frac{0}{0}$。极点附近的点的 $\\theta$ 接近 $${c.angle}$，所以曲线沿直线 $\\theta = ${c.angle}$ 趋近极点：这里是尖点，切线就是这条直线。`,
      )
    : t(
        `Here $r' \\ne 0$, so the slope is $\\frac{r'\\sin\\theta}{r'\\cos\\theta} = \\tan\\theta$ and the tangent is the line $\\theta = ${c.angle}$.`,
        `这里 $r' \\ne 0$，所以斜率为 $\\frac{r'\\sin\\theta}{r'\\cos\\theta} = \\tan\\theta$，切线就是直线 $\\theta = ${c.angle}$。`,
      );
  return oneOf(
    rng,
    t(
      `The polar curve $r = ${c.tex(a)}$ passes through the pole at $\\theta = ${c.angle}$. Which line is tangent to the curve there?`,
      `极坐标曲线 $r = ${c.tex(a)}$ 在 $\\theta = ${c.angle}$ 处经过极点。哪条直线是该处的切线？`,
    ),
    right,
    lines.filter((l) => l !== right),
    t(
      `At $\\theta = ${c.angle}$, $r = 0$. ${reason.en} It is ${right.en}.`,
      `在 $\\theta = ${c.angle}$ 处 $r = 0$。${reason["zh-CN"]}它是${right["zh-CN"]}。`,
    ),
  );
}

/** horizontalAndVerticalTangentsToPolarCurvesInNonDifferentiableCases treats tangents at the pole. */
export const horizontalAndVerticalTangentsToPolarCurvesInNonDifferentiableCases: TopicDef = {
  id: "horizontal-and-vertical-tangents-to-polar-curves-in-non-differentiable-cases",
  title: t("Horizontal and Vertical Tangents to Polar Curves in Non-Differentiable Cases", "不可导情形下极坐标曲线的水平与竖直切线"),
  summary: t(
    "Where a polar curve passes through the pole at θ₀, its tangent is the line θ = θ₀, even at a cusp where dx/dθ = dy/dθ = 0.",
    "极坐标曲线在 θ₀ 处经过极点时，切线是直线 θ = θ₀，即使在 dx/dθ = dy/dθ = 0 的尖点处也是如此。",
  ),
  prerequisites: ["horizontal-and-vertical-tangents-to-polar-curves"],
  encompasses: [{ topic: "horizontal-and-vertical-tangents-to-polar-curves", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "slopes-at-the-pole",
      title: t("Slopes at the pole", "极点处的斜率"),
      explanation: t(
        "If $r(\\theta_{0}) = 0$ and $r'(\\theta_{0}) \\ne 0$, the slope formula reduces to $\\frac{r'\\sin\\theta_{0}}{r'\\cos\\theta_{0}} = \\tan\\theta_{0}$: the curve leaves the pole along the line $\\theta = \\theta_{0}$. For $r = 1 + 2\\cos\\theta$, $r = 0$ at $\\theta = \\frac{2\\pi}{3}$, so the tangent there has slope $\\tan\\frac{2\\pi}{3} = -\\sqrt{3}$.",
        "若 $r(\\theta_{0}) = 0$ 且 $r'(\\theta_{0}) \\ne 0$，斜率公式化为 $\\frac{r'\\sin\\theta_{0}}{r'\\cos\\theta_{0}} = \\tan\\theta_{0}$：曲线沿直线 $\\theta = \\theta_{0}$ 离开极点。对 $r = 1 + 2\\cos\\theta$，在 $\\theta = \\frac{2\\pi}{3}$ 处 $r = 0$，所以该处切线斜率为 $\\tan\\frac{2\\pi}{3} = -\\sqrt{3}$。",
      ),
      generate: slopeAtThePole,
    },
    {
      id: "tangents-at-cusps",
      title: t("Tangents at cusps", "尖点处的切线"),
      explanation: t(
        "If $r$ and $r'$ are both zero at $\\theta_{0}$, then $\\frac{dx}{d\\theta} = \\frac{dy}{d\\theta} = 0$ and the slope formula is $\\frac{0}{0}$: the curve is not smooth there. Every point near the pole still lies on a ray close to $\\theta = \\theta_{0}$, so the curve approaches the pole along that line. The cardioid $r = 1 + \\cos\\theta$ reaches the pole at $\\theta = \\pi$ with a cusp whose tangent is the $x$-axis.",
        "若在 $\\theta_{0}$ 处 $r$ 与 $r'$ 都为零，则 $\\frac{dx}{d\\theta} = \\frac{dy}{d\\theta} = 0$，斜率公式成为 $\\frac{0}{0}$：曲线在该处不光滑。但极点附近的每个点仍位于接近 $\\theta = \\theta_{0}$ 的射线上，所以曲线沿这条直线趋近极点。心形线 $r = 1 + \\cos\\theta$ 在 $\\theta = \\pi$ 处到达极点，形成尖点，切线是 $x$ 轴。",
      ),
      generate: tangentAtThePole,
    },
  ],
};

/** polarLine finds the tangent or normal line to a limaçon at a quadrantal angle. */
function polarLine(rng: Rng, normal: boolean) {
  for (;;) {
    const curve = limacon(rng);
    const [angle, c, s] = rng.pick(quadrantal);
    const [r, dr] = curve.at(c, s);
    const [dx, dy] = derivatives(r, dr, c, s);
    if (dx === 0 || dy === 0) continue;
    const [x0, y0] = [r * c, r * s];
    const slope = Q.of(dy, dx);
    const other = Q.of(-dx, dy);
    const m = normal ? other : slope;
    const line = (k: Q) => lineL(k, Q.of(y0).sub(k.mul(Q.of(x0))));
    const answer = line(m);
    const name = normal ? t("normal", "法线") : t("tangent", "切线");
    return functionProblem({
      prompt: t(
        `Find the equation of the ${name.en} line to the polar curve $r = ${curve.tex}$ at $\\theta = ${angle}$. Write it as $y = mx + b$ and enter the right side.`,
        `求极坐标曲线 $r = ${curve.tex}$ 在 $\\theta = ${angle}$ 处的${name["zh-CN"]}方程。写成 $y = mx + b$，填写等号右边。`,
      ),
      prefix: "y =",
      answer,
      wrong: [line(normal ? slope : other), line(Q.of(dr)), lineL(m, Q.zero)],
      solution: t(
        `At $\\theta = ${angle}$, $r = ${r}$, so the point is $(${x0}, ${y0})$. With $r' = ${dr}$: $\\frac{dx}{d\\theta} = ${dx}$ and $\\frac{dy}{d\\theta} = ${dy}$, so $\\frac{dy}{dx} = ${slope.toLatex()}$.${normal ? ` The normal slope is $${other.toLatex()}$.` : ""} The line is $y = ${answer}$.`,
        `在 $\\theta = ${angle}$ 处 $r = ${r}$，所以点为 $(${x0}, ${y0})$。由 $r' = ${dr}$：$\\frac{dx}{d\\theta} = ${dx}$，$\\frac{dy}{d\\theta} = ${dy}$，所以 $\\frac{dy}{dx} = ${slope.toLatex()}$。${normal ? `法线斜率为 $${other.toLatex()}$。` : ""}所求直线为 $y = ${answer}$。`,
      ),
    });
  }
}

/** tangentAndNormalLinesToPolarCurves writes tangent and normal lines to polar curves in Cartesian form. */
export const tangentAndNormalLinesToPolarCurves: TopicDef = {
  id: "tangent-and-normal-lines-to-polar-curves",
  title: t("Tangent and Normal Lines to Polar Curves", "极坐标曲线的切线与法线"),
  summary: t(
    "At θ₀ the point is (r cos θ₀, r sin θ₀) and the slope comes from the polar slope formula.",
    "在 θ₀ 处，点为 (r cos θ₀, r sin θ₀)，斜率由极坐标斜率公式求出。",
  ),
  prerequisites: ["differentiating-curves-given-in-polar-form", "calculating-tangent-and-normal-lines-with-parametric-equations"],
  encompasses: [{ topic: "calculating-tangent-and-normal-lines-with-parametric-equations", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "tangent-lines-to-polar-curves",
      title: t("Tangent lines to polar curves", "极坐标曲线的切线"),
      explanation: t(
        "Convert the point to Cartesian coordinates, $(x_{0}, y_{0}) = (r\\cos\\theta_{0}, r\\sin\\theta_{0})$, find the slope $m$ from the polar slope formula, and write $y - y_{0} = m(x - x_{0})$. For $r = 2 + \\sin\\theta$ at $\\theta = 0$: the point is $(2, 0)$, $r' = 1$, $\\frac{dx}{d\\theta} = 1$ and $\\frac{dy}{d\\theta} = 2$, so the tangent is $y = 2x - 4$.",
        "先把点化为直角坐标 $(x_{0}, y_{0}) = (r\\cos\\theta_{0}, r\\sin\\theta_{0})$，再由极坐标斜率公式求出斜率 $m$，写出 $y - y_{0} = m(x - x_{0})$。对 $r = 2 + \\sin\\theta$，在 $\\theta = 0$ 处点为 $(2, 0)$，$r' = 1$，$\\frac{dx}{d\\theta} = 1$，$\\frac{dy}{d\\theta} = 2$，所以切线为 $y = 2x - 4$。",
      ),
      generate: (rng) => polarLine(rng, false),
    },
    {
      id: "normal-lines-to-polar-curves",
      title: t("Normal lines to polar curves", "极坐标曲线的法线"),
      explanation: t(
        "The normal line passes through the same point with slope $-\\frac{1}{m} = -\\frac{dx/d\\theta}{dy/d\\theta}$. For $r = 2 + \\sin\\theta$ at $\\theta = 0$, the normal is $y = -\\frac{1}{2}x + 1$.",
        "法线经过同一点，斜率为 $-\\frac{1}{m} = -\\frac{dx/d\\theta}{dy/d\\theta}$。对 $r = 2 + \\sin\\theta$，在 $\\theta = 0$ 处法线为 $y = -\\frac{1}{2}x + 1$。",
      ),
      generate: (rng) => polarLine(rng, true),
    },
  ],
};

/** Angle is a multiple qπ of π with its LaTeX. */
type Angle = readonly [string, Q];

/** sectorAngles are angles for the ends of polar regions. */
const sectorAngles: readonly Angle[] = [
  ["\\frac{\\pi}{6}", Q.of(1, 6)],
  ["\\frac{\\pi}{4}", Q.of(1, 4)],
  ["\\frac{\\pi}{3}", Q.of(1, 3)],
  ["\\frac{\\pi}{2}", Q.of(1, 2)],
  ["\\frac{2\\pi}{3}", Q.of(2, 3)],
  ["\\pi", Q.one],
  ["\\frac{3\\pi}{2}", Q.of(3, 2)],
  ["2\\pi", Q.of(2)],
];

/** sectorOrSpiralArea finds the area swept by a circle r = a or a spiral r = aθ. */
function sectorOrSpiralArea(rng: Rng) {
  const a = rng.int(1, 6);
  if (rng.bool()) {
    const i = rng.int(0, sectorAngles.length - 2);
    const j = rng.int(i + 1, sectorAngles.length - 1);
    const [[alpha, p], [beta, q]] = [sectorAngles[i]!, sectorAngles[j]!];
    const answer = q.sub(p).mul(Q.of(a * a, 2));
    return exactProblem(
      t(
        `Find the area of the region bounded by the polar curve $r = ${a}$ and the rays $\\theta = ${alpha}$ and $\\theta = ${beta}$. Give an exact answer.`,
        `求由极坐标曲线 $r = ${a}$ 与射线 $\\theta = ${alpha}$、$\\theta = ${beta}$ 围成区域的面积，给出精确值。`,
      ),
      piL(answer),
      [piL(answer.mul(Q.of(2))), piL(q.sub(p).mul(Q.of(a, 2))), piL(q.sub(p).mul(Q.of(a)))],
      `$A = \\frac{1}{2}\\int_{${alpha}}^{${beta}} ${a * a} \\, d\\theta = \\frac{${a * a}}{2}\\left(${beta} - ${alpha}\\right) = ${piL(answer)}$.`,
      `$A = \\frac{1}{2}\\int_{${alpha}}^{${beta}} ${a * a} \\, d\\theta = \\frac{${a * a}}{2}\\left(${beta} - ${alpha}\\right) = ${piL(answer)}$。`,
    );
  }
  const [beta, q] = rng.pick(sectorAngles);
  const answer = q
    .mul(q)
    .mul(q)
    .mul(Q.of(a * a, 6));
  return exactProblem(
    t(
      `Find the area of the region bounded by the spiral $r = ${k1(a)}\\theta$ for $0 \\le \\theta \\le ${beta}$ and the ray $\\theta = ${beta}$. Give an exact answer.`,
      `求螺线 $r = ${k1(a)}\\theta$（$0 \\le \\theta \\le ${beta}$）与射线 $\\theta = ${beta}$ 围成区域的面积，给出精确值。`,
    ),
    times(answer, "\\pi^{3}"),
    [times(answer.mul(Q.of(2)), "\\pi^{3}"), times(q.mul(q).mul(Q.of(a * a, 4)), "\\pi^{2}"), times(answer.mul(Q.of(3)), "\\pi^{3}")],
    `$A = \\frac{1}{2}\\int_{0}^{${beta}} ${a * a === 1 ? "" : a * a}\\theta^{2} \\, d\\theta = \\frac{${a * a}}{6}\\left(${beta}\\right)^{3} = ${times(answer, "\\pi^{3}")}$.`,
    `$A = \\frac{1}{2}\\int_{0}^{${beta}} ${a * a === 1 ? "" : a * a}\\theta^{2} \\, d\\theta = \\frac{${a * a}}{6}\\left(${beta}\\right)^{3} = ${times(answer, "\\pi^{3}")}$。`,
  );
}

/** limaconArea integrates ½(a + b cos θ)² over [0, π/2] or [0, π]. */
function limaconArea(rng: Rng) {
  const a = rng.int(2, 6);
  const b = rng.int(1, a);
  const half = rng.bool();
  const cosine = rng.bool();
  const fn = cosine ? "\\cos" : "\\sin";
  const end = half ? "\\frac{\\pi}{2}" : "\\pi";
  // ∫ cos θ over [0, π/2] and ∫ sin θ over [0, π/2] are 1; over [0, π] they are 0 and 2; ∫ cos² = ∫ sin² = π/4 or π/2.
  const linear = half ? 1 : cosine ? 0 : 2;
  const piPart = half ? Q.of(2 * a * a + b * b, 8) : Q.of(2 * a * a + b * b, 4);
  const rest = a * b * linear;
  const answer = rest === 0 ? piL(piPart) : `${piL(piPart)} + ${rest}`;
  return exactProblem(
    t(
      `Find the area of the region bounded by the polar curve $r = ${a} + ${k1(b)}${fn}\\theta$ and the rays $\\theta = 0$ and $\\theta = ${end}$. Give an exact answer.`,
      `求由极坐标曲线 $r = ${a} + ${k1(b)}${fn}\\theta$ 与射线 $\\theta = 0$、$\\theta = ${end}$ 围成区域的面积，给出精确值。`,
    ),
    answer,
    [
      rest === 0 ? piL(piPart.mul(Q.of(2))) : `${piL(piPart.mul(Q.of(2)))} + ${2 * rest}`,
      rest === 0 ? piL(Q.of(a * a, half ? 4 : 2)) : `${piL(Q.of(a * a, 4))} + ${rest}`,
      piL(piPart),
    ],
    `$A = \\frac{1}{2}\\int_{0}^{${end}} \\left(${a * a} + ${2 * a * b}${fn}\\theta + ${b * b === 1 ? "" : b * b}${fn}^{2}\\theta\\right) d\\theta$. Over $[0, ${end}]$, $\\int ${fn}\\theta \\, d\\theta = ${linear}$ and $\\int ${fn}^{2}\\theta \\, d\\theta = ${half ? "\\frac{\\pi}{4}" : "\\frac{\\pi}{2}"}$, so $A = \\frac{1}{2}\\left(${a * a}${half ? "\\cdot\\frac{\\pi}{2}" : "\\pi"} + ${2 * a * b * linear} + ${b * b}${half ? "\\cdot\\frac{\\pi}{4}" : "\\cdot\\frac{\\pi}{2}"}\\right) = ${answer}$.`,
    `$A = \\frac{1}{2}\\int_{0}^{${end}} \\left(${a * a} + ${2 * a * b}${fn}\\theta + ${b * b === 1 ? "" : b * b}${fn}^{2}\\theta\\right) d\\theta$。在 $[0, ${end}]$ 上 $\\int ${fn}\\theta \\, d\\theta = ${linear}$，$\\int ${fn}^{2}\\theta \\, d\\theta = ${half ? "\\frac{\\pi}{4}" : "\\frac{\\pi}{2}"}$，所以 $A = \\frac{1}{2}\\left(${a * a}${half ? "\\cdot\\frac{\\pi}{2}" : "\\pi"} + ${2 * a * b * linear} + ${b * b}${half ? "\\cdot\\frac{\\pi}{4}" : "\\cdot\\frac{\\pi}{2}"}\\right) = ${answer}$。`,
  );
}

/** findingTheAreaOfAPolarRegion integrates ½r² dθ. */
export const findingTheAreaOfAPolarRegion: TopicDef = {
  id: "finding-the-area-of-a-polar-region",
  title: t("Finding the Area of a Polar Region", "求极坐标区域的面积"),
  summary: t(
    "The region bounded by r = f(θ) and the rays θ = α and θ = β has area ½∫ r² dθ from α to β.",
    "由 r = f(θ) 与射线 θ = α、θ = β 围成区域的面积为从 α 到 β 的 ½∫ r² dθ。",
  ),
  prerequisites: ["introduction-to-polar-coordinates", "the-fundamental-theorem-of-calculus", "integrating-trigonometric-functions"],
  encompasses: [{ topic: "integrating-trigonometric-functions", weight: 0.3 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "areas-of-sectors-and-spirals",
      title: t("Areas of sectors and spirals", "扇形与螺线的面积"),
      explanation: t(
        "A thin sector of radius $r$ and angle $d\\theta$ has area $\\frac{1}{2}r^{2} \\, d\\theta$. Adding them up, the region between $r = f(\\theta)$ and the rays $\\theta = \\alpha$, $\\theta = \\beta$ has area\n\n$$A = \\frac{1}{2}\\int_{\\alpha}^{\\beta} r^{2} \\, d\\theta.$$\n\nFor $r = 3$ from $0$ to $\\frac{\\pi}{2}$: $A = \\frac{9}{2} \\cdot \\frac{\\pi}{2} = \\frac{9\\pi}{4}$. For the spiral $r = \\theta$ from $0$ to $\\pi$: $A = \\frac{1}{2}\\int_{0}^{\\pi} \\theta^{2} \\, d\\theta = \\frac{\\pi^{3}}{6}$.",
        "半径为 $r$、圆心角为 $d\\theta$ 的细扇形面积为 $\\frac{1}{2}r^{2} \\, d\\theta$。把它们加起来，$r = f(\\theta)$ 与射线 $\\theta = \\alpha$、$\\theta = \\beta$ 之间区域的面积为\n\n$$A = \\frac{1}{2}\\int_{\\alpha}^{\\beta} r^{2} \\, d\\theta。$$\n\n对 $r = 3$，从 $0$ 到 $\\frac{\\pi}{2}$：$A = \\frac{9}{2} \\cdot \\frac{\\pi}{2} = \\frac{9\\pi}{4}$。对螺线 $r = \\theta$，从 $0$ 到 $\\pi$：$A = \\frac{1}{2}\\int_{0}^{\\pi} \\theta^{2} \\, d\\theta = \\frac{\\pi^{3}}{6}$。",
      ),
      generate: sectorOrSpiralArea,
    },
    {
      id: "areas-bounded-by-limacons",
      title: t("Areas bounded by limaçons", "蜗线围成的面积"),
      explanation: t(
        "Expand $r^{2}$ and use $\\cos^{2}\\theta = \\frac{1 + \\cos 2\\theta}{2}$ (or the same for $\\sin^{2}\\theta$). For $r = 2 + \\cos\\theta$ from $0$ to $\\frac{\\pi}{2}$:\n\n$$A = \\frac{1}{2}\\int_{0}^{\\pi/2} (4 + 4\\cos\\theta + \\cos^{2}\\theta) \\, d\\theta = \\frac{1}{2}\\left(2\\pi + 4 + \\frac{\\pi}{4}\\right) = \\frac{9\\pi}{8} + 2.$$",
        "展开 $r^{2}$，并用 $\\cos^{2}\\theta = \\frac{1 + \\cos 2\\theta}{2}$（$\\sin^{2}\\theta$ 类似）。对 $r = 2 + \\cos\\theta$，从 $0$ 到 $\\frac{\\pi}{2}$：\n\n$$A = \\frac{1}{2}\\int_{0}^{\\pi/2} (4 + 4\\cos\\theta + \\cos^{2}\\theta) \\, d\\theta = \\frac{1}{2}\\left(2\\pi + 4 + \\frac{\\pi}{4}\\right) = \\frac{9\\pi}{8} + 2。$$",
      ),
      generate: limaconArea,
    },
  ],
};

/** petalLimit finds where one petal of a rose ends. */
function petalLimit(rng: Rng) {
  const k = rng.int(2, 6);
  const a = rng.int(1, 6);
  if (rng.bool()) {
    const answer = piL(Q.of(1, k));
    return exactProblem(
      t(
        `One petal of the rose $r = ${k1(a)}\\sin ${k}\\theta$ is traced as $\\theta$ increases from $0$. At what value of $\\theta$ is that petal complete?`,
        `玫瑰线 $r = ${k1(a)}\\sin ${k}\\theta$ 的一片花瓣在 $\\theta$ 从 $0$ 开始增大时描出。$\\theta$ 为何值时这片花瓣描完？`,
      ),
      answer,
      [piL(Q.of(1, 2 * k)), piL(Q.of(2, k)), piL(Q.of(1, k + 1))],
      `$r = 0$ at the start and end of a petal. $\\sin ${k}\\theta = 0$ next at $${k}\\theta = \\pi$, so the petal is traced for $0 \\le \\theta \\le ${answer}$.`,
      `花瓣的起点和终点处 $r = 0$。$\\sin ${k}\\theta$ 下一次为零是 $${k}\\theta = \\pi$，所以这片花瓣对应 $0 \\le \\theta \\le ${answer}$。`,
    );
  }
  const answer = piL(Q.of(1, 2 * k));
  return exactProblem(
    t(
      `The petal of the rose $r = ${k1(a)}\\cos ${k}\\theta$ along the positive $x$-axis is traced for $-\\alpha \\le \\theta \\le \\alpha$. Find $\\alpha$.`,
      `玫瑰线 $r = ${k1(a)}\\cos ${k}\\theta$ 沿 $x$ 轴正方向的那片花瓣对应 $-\\alpha \\le \\theta \\le \\alpha$。求 $\\alpha$。`,
    ),
    answer,
    [piL(Q.of(1, k)), piL(Q.of(1, 4 * k)), piL(Q.of(1, 2))],
    `The petal is centered on $\\theta = 0$, where $r = ${a}$, and ends where $r = 0$: $\\cos ${k}\\theta = 0$ first at $${k}\\theta = \\frac{\\pi}{2}$, so $\\alpha = ${answer}$.`,
    `这片花瓣以 $\\theta = 0$ 为中心（此处 $r = ${a}$），在 $r = 0$ 处结束：$\\cos ${k}\\theta$ 第一次为零是 $${k}\\theta = \\frac{\\pi}{2}$，所以 $\\alpha = ${answer}$。`,
  );
}

/** InnerLoop is a limaçon with an inner loop and the interval that traces the loop. */
interface InnerLoop {
  readonly tex: (a: number) => string;
  readonly interval: number;
  readonly why: Text;
}

/** loopIntervals are candidate intervals for an inner loop. */
const loopIntervals: readonly Text[] = [
  t("$\\frac{2\\pi}{3} \\le \\theta \\le \\frac{4\\pi}{3}$", "$\\frac{2\\pi}{3} \\le \\theta \\le \\frac{4\\pi}{3}$"),
  t("$-\\frac{\\pi}{3} \\le \\theta \\le \\frac{\\pi}{3}$", "$-\\frac{\\pi}{3} \\le \\theta \\le \\frac{\\pi}{3}$"),
  t("$\\frac{7\\pi}{6} \\le \\theta \\le \\frac{11\\pi}{6}$", "$\\frac{7\\pi}{6} \\le \\theta \\le \\frac{11\\pi}{6}$"),
  t("$\\frac{\\pi}{6} \\le \\theta \\le \\frac{5\\pi}{6}$", "$\\frac{\\pi}{6} \\le \\theta \\le \\frac{5\\pi}{6}$"),
  t("$0 \\le \\theta \\le \\pi$", "$0 \\le \\theta \\le \\pi$"),
];

/** innerLoops are limaçons r = a(1 ± 2 cos θ) and r = a(1 ± 2 sin θ). */
const innerLoops: readonly InnerLoop[] = [
  { tex: (a) => `${k1(a)}(1 + 2\\cos\\theta)`, interval: 0, why: t("$\\cos\\theta = -\\frac{1}{2}$", "$\\cos\\theta = -\\frac{1}{2}$") },
  { tex: (a) => `${k1(a)}(1 - 2\\cos\\theta)`, interval: 1, why: t("$\\cos\\theta = \\frac{1}{2}$", "$\\cos\\theta = \\frac{1}{2}$") },
  { tex: (a) => `${k1(a)}(1 + 2\\sin\\theta)`, interval: 2, why: t("$\\sin\\theta = -\\frac{1}{2}$", "$\\sin\\theta = -\\frac{1}{2}$") },
  { tex: (a) => `${k1(a)}(1 - 2\\sin\\theta)`, interval: 3, why: t("$\\sin\\theta = \\frac{1}{2}$", "$\\sin\\theta = \\frac{1}{2}$") },
];

/** innerLoopLimits chooses the limits of integration that trace an inner loop. */
function innerLoopLimits(rng: Rng) {
  const c = rng.pick(innerLoops);
  const a = rng.int(1, 9);
  const right = loopIntervals[c.interval]!;
  return oneOf(
    rng,
    t(
      `The limaçon $r = ${c.tex(a)}$ has an inner loop. For which values of $\\theta$ is the inner loop traced?`,
      `蜗线 $r = ${c.tex(a)}$ 有一个内圈。$\\theta$ 取哪些值时描出内圈？`,
    ),
    right,
    loopIntervals.filter((l) => l !== right),
    t(
      `The inner loop starts and ends at the pole, where $r = 0$: ${c.why.en}. Between those angles $r < 0$, and those points form the inner loop. It is traced for ${right.en}.`,
      `内圈在极点处开始和结束，此时 $r = 0$：${c.why["zh-CN"]}。在这两个角之间 $r < 0$，这些点构成内圈。它对应 ${right["zh-CN"]}。`,
    ),
  );
}

/** findingTheLimitsOfIntegrationForAGivenPolarRegion finds the angles where a loop or petal starts and ends. */
export const findingTheLimitsOfIntegrationForAGivenPolarRegion: TopicDef = {
  id: "finding-the-limits-of-integration-for-a-given-polar-region",
  title: t("Finding the Limits of Integration For a Given Polar Region", "确定极坐标区域的积分限"),
  summary: t(
    "A petal or loop begins and ends at the pole, so its limits of integration are consecutive solutions of r = 0.",
    "花瓣或圈在极点开始和结束，所以它的积分限是 r = 0 的相邻两个解。",
  ),
  prerequisites: ["finding-the-area-of-a-polar-region", "finding-intersections-of-polar-curves"],
  encompasses: [{ topic: "finding-the-area-of-a-polar-region", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "limits-for-a-petal",
      title: t("Limits for a petal", "一片花瓣的积分限"),
      explanation: t(
        "A rose $r = a\\sin k\\theta$ or $r = a\\cos k\\theta$ passes through the pole between petals. One petal is traced between consecutive zeros of $r$. For $r = 2\\cos 3\\theta$, $r = 0$ at $\\theta = \\pm\\frac{\\pi}{6}$, so the petal on the positive $x$-axis is traced for $-\\frac{\\pi}{6} \\le \\theta \\le \\frac{\\pi}{6}$.",
        "玫瑰线 $r = a\\sin k\\theta$ 或 $r = a\\cos k\\theta$ 在相邻花瓣之间经过极点。一片花瓣在 $r$ 的相邻两个零点之间描出。对 $r = 2\\cos 3\\theta$，$r = 0$ 在 $\\theta = \\pm\\frac{\\pi}{6}$，所以 $x$ 轴正方向上的花瓣对应 $-\\frac{\\pi}{6} \\le \\theta \\le \\frac{\\pi}{6}$。",
      ),
      generate: petalLimit,
    },
    {
      id: "limits-for-an-inner-loop",
      title: t("Limits for an inner loop", "内圈的积分限"),
      explanation: t(
        "The limaçon $r = 1 + 2\\cos\\theta$ is negative when $\\cos\\theta < -\\frac{1}{2}$, that is, for $\\frac{2\\pi}{3} < \\theta < \\frac{4\\pi}{3}$. Those points are plotted on the opposite side of the pole and form the inner loop, so its area is $\\frac{1}{2}\\int_{2\\pi/3}^{4\\pi/3} r^{2} \\, d\\theta$.",
        "蜗线 $r = 1 + 2\\cos\\theta$ 在 $\\cos\\theta < -\\frac{1}{2}$，即 $\\frac{2\\pi}{3} < \\theta < \\frac{4\\pi}{3}$ 时为负。这些点画在极点的另一侧，构成内圈，所以内圈面积为 $\\frac{1}{2}\\int_{2\\pi/3}^{4\\pi/3} r^{2} \\, d\\theta$。",
      ),
      generate: innerLoopLimits,
    },
  ],
};

/** roseArea finds the total area enclosed by a rose. */
function roseArea(rng: Rng) {
  const k = rng.int(2, 6);
  const a = rng.int(1, 6);
  const fn = rng.bool() ? "\\sin" : "\\cos";
  const even = k % 2 === 0;
  const petals = even ? 2 * k : k;
  const answer = Q.of(a * a, even ? 2 : 4);
  return exactProblem(
    t(
      `Find the total area enclosed by the rose $r = ${k1(a)}${fn} ${k}\\theta$. Give an exact answer.`,
      `求玫瑰线 $r = ${k1(a)}${fn} ${k}\\theta$ 围成的总面积，给出精确值。`,
    ),
    piL(answer),
    [piL(Q.of(a * a, even ? 4 : 2)), piL(Q.of(a * a, 4 * k)), piL(Q.of(a * a))],
    `The rose has $${petals}$ petals, since $k = ${k}$ is ${even ? "even" : "odd"}. Each petal has area $\\frac{1}{2}\\int_{0}^{\\pi/${k}} ${a * a === 1 ? "" : a * a}${fn}^{2} ${k}\\theta \\, d\\theta = ${piL(Q.of(a * a, 4 * k))}$, so the total is $${petals} \\cdot ${piL(Q.of(a * a, 4 * k))} = ${piL(answer)}$.${even ? "" : ` Integrating over $[0, 2\\pi]$ would trace every petal twice.`}`,
    `因为 $k = ${k}$ 是${even ? "偶数" : "奇数"}，玫瑰线有 $${petals}$ 片花瓣。每片面积为 $\\frac{1}{2}\\int_{0}^{\\pi/${k}} ${a * a === 1 ? "" : a * a}${fn}^{2} ${k}\\theta \\, d\\theta = ${piL(Q.of(a * a, 4 * k))}$，所以总面积为 $${petals} \\cdot ${piL(Q.of(a * a, 4 * k))} = ${piL(answer)}$。${even ? "" : "在 $[0, 2\\pi]$ 上积分会把每片花瓣描两次。"}`,
  );
}

/** wholeLimaconArea finds the area enclosed by r = a + b cos θ with a ≥ b > 0. */
function wholeLimaconArea(rng: Rng) {
  const a = rng.int(1, 6);
  const b = rng.int(1, a);
  const fn = rng.bool() ? "\\sin" : "\\cos";
  const answer = Q.of(2 * a * a + b * b, 2);
  return exactProblem(
    t(
      `Find the area enclosed by the ${a === b ? "cardioid" : "limaçon"} $r = ${a} + ${k1(b)}${fn}\\theta$. Give an exact answer.`,
      `求${a === b ? "心形线" : "蜗线"} $r = ${a} + ${k1(b)}${fn}\\theta$ 围成的面积，给出精确值。`,
    ),
    piL(answer),
    [piL(Q.of(a * a)), piL(Q.of(2 * a * a + b * b)), piL(Q.of(a * a + b * b))],
    `Since $${a} \\ge ${b}$, $r \\ge 0$ and the curve is traced once for $0 \\le \\theta \\le 2\\pi$. $A = \\frac{1}{2}\\int_{0}^{2\\pi} \\left(${a * a} + ${2 * a * b}${fn}\\theta + ${b * b === 1 ? "" : b * b}${fn}^{2}\\theta\\right) d\\theta = \\frac{1}{2}\\left(${2 * a * a}\\pi + 0 + ${b * b === 1 ? "" : b * b}\\pi\\right) = ${piL(answer)}$.`,
    `因为 $${a} \\ge ${b}$，$r \\ge 0$，曲线在 $0 \\le \\theta \\le 2\\pi$ 上恰好描一次。$A = \\frac{1}{2}\\int_{0}^{2\\pi} \\left(${a * a} + ${2 * a * b}${fn}\\theta + ${b * b === 1 ? "" : b * b}${fn}^{2}\\theta\\right) d\\theta = \\frac{1}{2}\\left(${2 * a * a}\\pi + 0 + ${b * b === 1 ? "" : b * b}\\pi\\right) = ${piL(answer)}$。`,
  );
}

/** theTotalAreaBoundedByASinglePolarCurve finds the whole area of a rose or limaçon. */
export const theTotalAreaBoundedByASinglePolarCurve: TopicDef = {
  id: "the-total-area-bounded-by-a-single-polar-curve",
  title: t("The Total Area Bounded by a Single Polar Curve", "单条极坐标曲线围成的总面积"),
  summary: t(
    "Integrate ½r² over an interval that traces the curve exactly once, or add up congruent pieces.",
    "在恰好描出曲线一次的区间上积分 ½r²，或把全等的部分相加。",
  ),
  prerequisites: ["finding-the-limits-of-integration-for-a-given-polar-region"],
  encompasses: [{ topic: "finding-the-limits-of-integration-for-a-given-polar-region", weight: 0.5 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "areas-of-roses",
      title: t("Areas of roses", "玫瑰线的面积"),
      explanation: t(
        "The rose $r = a\\cos k\\theta$ (or $a\\sin k\\theta$) has $k$ petals when $k$ is odd and $2k$ petals when $k$ is even. Each petal has area $\\frac{\\pi a^{2}}{4k}$, so the total is $\\frac{\\pi a^{2}}{4}$ for odd $k$ and $\\frac{\\pi a^{2}}{2}$ for even $k$. For odd $k$, integrating over $[0, 2\\pi]$ traces every petal twice and gives double the area.",
        "玫瑰线 $r = a\\cos k\\theta$（或 $a\\sin k\\theta$）在 $k$ 为奇数时有 $k$ 片花瓣，$k$ 为偶数时有 $2k$ 片。每片面积为 $\\frac{\\pi a^{2}}{4k}$，所以总面积在 $k$ 为奇数时为 $\\frac{\\pi a^{2}}{4}$，为偶数时为 $\\frac{\\pi a^{2}}{2}$。$k$ 为奇数时在 $[0, 2\\pi]$ 上积分会把每片花瓣描两次，得到两倍的面积。",
      ),
      generate: roseArea,
    },
    {
      id: "areas-of-limacons-and-cardioids",
      title: t("Areas of limaçons and cardioids", "蜗线与心形线的面积"),
      explanation: t(
        "If $a \\ge b > 0$, $r = a + b\\cos\\theta$ is never negative and is traced once on $[0, 2\\pi]$. The $\\cos\\theta$ term integrates to $0$ and $\\cos^{2}\\theta$ to $\\pi$, so $A = \\frac{1}{2}(2\\pi a^{2} + \\pi b^{2}) = \\pi\\left(a^{2} + \\frac{b^{2}}{2}\\right)$. The cardioid $r = a(1 + \\cos\\theta)$ encloses $\\frac{3\\pi a^{2}}{2}$.",
        "若 $a \\ge b > 0$，$r = a + b\\cos\\theta$ 恒不为负，在 $[0, 2\\pi]$ 上恰好描一次。$\\cos\\theta$ 项积分为 $0$，$\\cos^{2}\\theta$ 积分为 $\\pi$，所以 $A = \\frac{1}{2}(2\\pi a^{2} + \\pi b^{2}) = \\pi\\left(a^{2} + \\frac{b^{2}}{2}\\right)$。心形线 $r = a(1 + \\cos\\theta)$ 围成的面积为 $\\frac{3\\pi a^{2}}{2}$。",
      ),
      generate: wholeLimaconArea,
    },
  ],
};

/** circleLensArea finds the area inside r = 2a cos θ (or 2a sin θ) and outside r = a. */
function circleLensArea(rng: Rng) {
  const a = rng.int(1, 13);
  const cosine = rng.bool();
  const fn = cosine ? "\\cos" : "\\sin";
  const [lo, hi] = cosine ? ["-\\frac{\\pi}{3}", "\\frac{\\pi}{3}"] : ["\\frac{\\pi}{6}", "\\frac{5\\pi}{6}"];
  const answer = `${piL(Q.of(a * a, 3))} + ${rootTimes(Q.of(a * a, 2), 3, "")}`;
  return exactProblem(
    t(
      `Find the area of the region inside the circle $r = ${2 * a}${fn}\\theta$ and outside the circle $r = ${a}$. Give an exact answer.`,
      `求在圆 $r = ${2 * a}${fn}\\theta$ 内且在圆 $r = ${a}$ 外的区域的面积，给出精确值。`,
    ),
    answer,
    [
      `${piL(Q.of(a * a, 3))} - ${rootTimes(Q.of(a * a, 2), 3, "")}`,
      piL(Q.of(a * a)),
      `${piL(Q.of(2 * a * a, 3))} + ${rootTimes(Q.of(a * a), 3, "")}`,
    ],
    `The circles meet where $${2 * a}${fn}\\theta = ${a}$, at $\\theta = ${lo}$ and $\\theta = ${hi}$. $A = \\frac{1}{2}\\int_{${lo}}^{${hi}} \\left(${4 * a * a}${fn}^{2}\\theta - ${a * a}\\right) d\\theta = ${k1(a * a)}\\int_{${lo}}^{${hi}} \\left(\\frac{1}{2} ${cosine ? "+" : "-"} \\cos 2\\theta\\right) d\\theta = ${answer}$.`,
    `两圆在 $${2 * a}${fn}\\theta = ${a}$ 处相交，即 $\\theta = ${lo}$ 和 $\\theta = ${hi}$。$A = \\frac{1}{2}\\int_{${lo}}^{${hi}} \\left(${4 * a * a}${fn}^{2}\\theta - ${a * a}\\right) d\\theta = ${k1(a * a)}\\int_{${lo}}^{${hi}} \\left(\\frac{1}{2} ${cosine ? "+" : "-"} \\cos 2\\theta\\right) d\\theta = ${answer}$。`,
  );
}

/** cardioidCircleArea finds the area between a cardioid and the circle r = a. */
function cardioidCircleArea(rng: Rng) {
  const a = rng.int(1, 8);
  const insideCardioid = rng.bool();
  const fn = rng.bool() ? "\\cos" : "\\sin";
  const [lo, hi, meet] =
    fn === "\\cos" ? ["-\\pi/2", "\\pi/2", "\\theta = \\pm\\frac{\\pi}{2}"] : ["0", "\\pi", "\\theta = 0 \\text{ and } \\theta = \\pi"];
  const answer = insideCardioid ? `${2 * a * a} + ${piL(Q.of(a * a, 4))}` : `${2 * a * a} - ${piL(Q.of(a * a, 4))}`;
  const [outer, inner] = insideCardioid ? [`${k1(a)}(1 + ${fn}\\theta)`, `${a}`] : [`${a}`, `${k1(a)}(1 - ${fn}\\theta)`];
  return exactProblem(
    t(
      `Find the area of the region inside $r = ${outer}$ and outside $r = ${inner}$. Give an exact answer.`,
      `求在 $r = ${outer}$ 内且在 $r = ${inner}$ 外的区域的面积，给出精确值。`,
    ),
    answer,
    [
      insideCardioid ? `${2 * a * a} - ${piL(Q.of(a * a, 4))}` : `${2 * a * a} + ${piL(Q.of(a * a, 4))}`,
      `${a * a} + ${piL(Q.of(a * a, 4))}`,
      piL(Q.of(3 * a * a, 2)),
    ],
    `The curves meet where $${fn}\\theta = 0$, at $${meet}$, and the region lies between them. $A = \\frac{1}{2}\\int_{${lo}}^{${hi}} \\left[(${outer})^{2} - (${inner})^{2}\\right] d\\theta = \\frac{${a * a}}{2}\\int_{${lo}}^{${hi}} \\left(2${fn}\\theta ${insideCardioid ? "+" : "-"} ${fn}^{2}\\theta\\right) d\\theta = \\frac{${a * a}}{2}\\left(4 ${insideCardioid ? "+" : "-"} \\frac{\\pi}{2}\\right) = ${answer}$.`,
    `两曲线在 $${fn}\\theta = 0$ 处相交，即 $${meet}$，区域位于两者之间。$A = \\frac{1}{2}\\int_{${lo}}^{${hi}} \\left[(${outer})^{2} - (${inner})^{2}\\right] d\\theta = \\frac{${a * a}}{2}\\int_{${lo}}^{${hi}} \\left(2${fn}\\theta ${insideCardioid ? "+" : "-"} ${fn}^{2}\\theta\\right) d\\theta = \\frac{${a * a}}{2}\\left(4 ${insideCardioid ? "+" : "-"} \\frac{\\pi}{2}\\right) = ${answer}$。`,
  );
}

/** theAreaBoundedByTwoPolarCurves integrates ½(r_outer² − r_inner²) between intersection angles. */
export const theAreaBoundedByTwoPolarCurves: TopicDef = {
  id: "the-area-bounded-by-two-polar-curves",
  title: t("The Area Bounded by Two Polar Curves", "两条极坐标曲线围成的面积"),
  summary: t(
    "The area inside r = f(θ) and outside r = g(θ) is ½∫(f² − g²) dθ between the angles where they meet.",
    "在 r = f(θ) 内、r = g(θ) 外的面积为 ½∫(f² − g²) dθ，积分限是两曲线相交处的角。",
  ),
  prerequisites: ["the-total-area-bounded-by-a-single-polar-curve"],
  encompasses: [{ topic: "the-total-area-bounded-by-a-single-polar-curve", weight: 0.4 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "areas-between-two-circles",
      title: t("Areas between two circles", "两圆之间的面积"),
      explanation: t(
        "Find the angles where the curves meet, then subtract the inner region from the outer:\n\n$$A = \\frac{1}{2}\\int_{\\alpha}^{\\beta} \\left(r_{\\text{outer}}^{2} - r_{\\text{inner}}^{2}\\right) d\\theta.$$\n\nIt is not $\\frac{1}{2}\\int (r_{\\text{outer}} - r_{\\text{inner}})^{2} \\, d\\theta$. Inside $r = 2\\cos\\theta$ and outside $r = 1$: the circles meet at $\\theta = \\pm\\frac{\\pi}{3}$, and $A = \\frac{1}{2}\\int_{-\\pi/3}^{\\pi/3} (4\\cos^{2}\\theta - 1) \\, d\\theta = \\frac{\\pi}{3} + \\frac{\\sqrt{3}}{2}$.",
        "先求两曲线相交处的角，再用外区域减去内区域：\n\n$$A = \\frac{1}{2}\\int_{\\alpha}^{\\beta} \\left(r_{\\text{外}}^{2} - r_{\\text{内}}^{2}\\right) d\\theta。$$\n\n它不等于 $\\frac{1}{2}\\int (r_{\\text{外}} - r_{\\text{内}})^{2} \\, d\\theta$。在 $r = 2\\cos\\theta$ 内、$r = 1$ 外：两圆在 $\\theta = \\pm\\frac{\\pi}{3}$ 处相交，$A = \\frac{1}{2}\\int_{-\\pi/3}^{\\pi/3} (4\\cos^{2}\\theta - 1) \\, d\\theta = \\frac{\\pi}{3} + \\frac{\\sqrt{3}}{2}$。",
      ),
      generate: circleLensArea,
    },
    {
      id: "areas-between-a-cardioid-and-a-circle",
      title: t("Areas between a cardioid and a circle", "心形线与圆之间的面积"),
      explanation: t(
        "The cardioid $r = a(1 + \\cos\\theta)$ and the circle $r = a$ meet where $\\cos\\theta = 0$. The cardioid is outside the circle for $-\\frac{\\pi}{2} < \\theta < \\frac{\\pi}{2}$, so the area inside the cardioid and outside the circle is $\\frac{a^{2}}{2}\\int_{-\\pi/2}^{\\pi/2} (2\\cos\\theta + \\cos^{2}\\theta) \\, d\\theta = a^{2}\\left(2 + \\frac{\\pi}{4}\\right)$.",
        "心形线 $r = a(1 + \\cos\\theta)$ 与圆 $r = a$ 在 $\\cos\\theta = 0$ 处相交。当 $-\\frac{\\pi}{2} < \\theta < \\frac{\\pi}{2}$ 时心形线在圆外，所以在心形线内、圆外的面积为 $\\frac{a^{2}}{2}\\int_{-\\pi/2}^{\\pi/2} (2\\cos\\theta + \\cos^{2}\\theta) \\, d\\theta = a^{2}\\left(2 + \\frac{\\pi}{4}\\right)$。",
      ),
      generate: cardioidCircleArea,
    },
  ],
};

/** cardioidArcs are the ends β of the arcs 0 ≤ θ ≤ β with 4 sin(β/2) as a multiple of a. */
const cardioidArcs: readonly (readonly [string, string, (a: number) => string])[] = [
  ["\\frac{\\pi}{3}", "\\frac{1}{2}", (a) => `${2 * a}`],
  ["\\frac{2\\pi}{3}", "\\frac{\\sqrt{3}}{2}", (a) => rootTimes(Q.of(2 * a), 3, "")],
  ["\\pi", "1", (a) => `${4 * a}`],
  ["2\\pi", "", (a) => `${8 * a}`],
];

/** cardioidLength measures arcs of the cardioid r = a(1 + cos θ). */
function cardioidLength(rng: Rng) {
  const a = rng.int(1, 8);
  const [beta, sinHalf, length] = rng.pick(cardioidArcs);
  const answer = length(a);
  const whole = beta === "2\\pi";
  return exactProblem(
    t(
      whole
        ? `Find the total length of the cardioid $r = ${k1(a)}(1 + \\cos\\theta)$.`
        : `Find the length of the arc of $r = ${k1(a)}(1 + \\cos\\theta)$ for $0 \\le \\theta \\le ${beta}$. Give an exact answer.`,
      whole
        ? `求心形线 $r = ${k1(a)}(1 + \\cos\\theta)$ 的全长。`
        : `求曲线 $r = ${k1(a)}(1 + \\cos\\theta)$ 在 $0 \\le \\theta \\le ${beta}$ 上的弧长，给出精确值。`,
    ),
    answer,
    [`${whole ? 4 * a : 8 * a}`, piL(Q.of(2 * a)), `${a}`],
    `$r^{2} + (r')^{2} = ${a * a === 1 ? "" : a * a}(1 + \\cos\\theta)^{2} + ${a * a === 1 ? "" : a * a}\\sin^{2}\\theta = ${2 * a * a}(1 + \\cos\\theta) = ${4 * a * a}\\cos^{2}\\frac{\\theta}{2}$, so the integrand is $${2 * a}\\left|\\cos\\frac{\\theta}{2}\\right|$. ${whole ? `By symmetry, $L = 2\\int_{0}^{\\pi} ${2 * a}\\cos\\frac{\\theta}{2} \\, d\\theta = 2 \\cdot ${4 * a} = ${answer}$.` : `$L = \\int_{0}^{${beta}} ${2 * a}\\cos\\frac{\\theta}{2} \\, d\\theta = ${4 * a}\\sin\\frac{\\theta}{2}\\Big|_{0}^{${beta}} = ${4 * a} \\cdot ${sinHalf} = ${answer}$.`}`,
    `$r^{2} + (r')^{2} = ${a * a === 1 ? "" : a * a}(1 + \\cos\\theta)^{2} + ${a * a === 1 ? "" : a * a}\\sin^{2}\\theta = ${2 * a * a}(1 + \\cos\\theta) = ${4 * a * a}\\cos^{2}\\frac{\\theta}{2}$，所以被积函数为 $${2 * a}\\left|\\cos\\frac{\\theta}{2}\\right|$。${whole ? `由对称性，$L = 2\\int_{0}^{\\pi} ${2 * a}\\cos\\frac{\\theta}{2} \\, d\\theta = 2 \\cdot ${4 * a} = ${answer}$。` : `$L = \\int_{0}^{${beta}} ${2 * a}\\cos\\frac{\\theta}{2} \\, d\\theta = ${4 * a}\\sin\\frac{\\theta}{2}\\Big|_{0}^{${beta}} = ${4 * a} \\cdot ${sinHalf} = ${answer}$。`}`,
  );
}

/** otherPolarLength measures r = θ² or an arc of the circle r = 2a sin θ. */
function otherPolarLength(rng: Rng) {
  if (rng.bool()) {
    const b = rng.int(1, 5);
    const N = b * b + 4;
    const answer = `\\frac{1}{3}\\left(${rootTimes(Q.of(N), N, "")} - 8\\right)`;
    return exactProblem(
      t(
        `Find the length of the polar curve $r = \\theta^{2}$ for $0 \\le \\theta \\le ${b}$. Give an exact answer.`,
        `求极坐标曲线 $r = \\theta^{2}$（$0 \\le \\theta \\le ${b}$）的长度，给出精确值。`,
      ),
      answer,
      [`\\frac{${rootTimes(Q.of(N), N, "")}}{3}`, `\\frac{${b ** 3}}{3}`, `\\frac{2}{3}\\left(${rootTimes(Q.of(N), N, "")} - 8\\right)`],
      `$r^{2} + (r')^{2} = \\theta^{4} + 4\\theta^{2}$, so $L = \\int_{0}^{${b}} \\theta\\sqrt{\\theta^{2} + 4} \\, d\\theta$. With $u = \\theta^{2} + 4$: $L = \\frac{1}{3}(\\theta^{2} + 4)^{3/2}\\Big|_{0}^{${b}} = \\frac{1}{3}\\left(${N}^{3/2} - 8\\right) = ${answer}$.`,
      `$r^{2} + (r')^{2} = \\theta^{4} + 4\\theta^{2}$，所以 $L = \\int_{0}^{${b}} \\theta\\sqrt{\\theta^{2} + 4} \\, d\\theta$。令 $u = \\theta^{2} + 4$：$L = \\frac{1}{3}(\\theta^{2} + 4)^{3/2}\\Big|_{0}^{${b}} = \\frac{1}{3}\\left(${N}^{3/2} - 8\\right) = ${answer}$。`,
    );
  }
  const a = rng.int(1, 6);
  const [beta, q] = rng.pick(sectorAngles.slice(0, 6));
  const fn = rng.bool() ? "\\sin" : "\\cos";
  const answer = piL(q.mul(Q.of(2 * a)));
  return exactProblem(
    t(
      `Find the length of the polar curve $r = ${2 * a}${fn}\\theta$ for $0 \\le \\theta \\le ${beta}$. Give an exact answer.`,
      `求极坐标曲线 $r = ${2 * a}${fn}\\theta$（$0 \\le \\theta \\le ${beta}$）的长度，给出精确值。`,
    ),
    answer,
    [piL(q.mul(Q.of(a))), piL(q.mul(Q.of(4 * a * a))), piL(q.mul(Q.of(4 * a)))],
    `$r^{2} + (r')^{2} = ${4 * a * a}${fn}^{2}\\theta + ${4 * a * a}${fn === "\\sin" ? "\\cos" : "\\sin"}^{2}\\theta = ${4 * a * a}$, so $L = \\int_{0}^{${beta}} ${2 * a} \\, d\\theta = ${answer}$.`,
    `$r^{2} + (r')^{2} = ${4 * a * a}${fn}^{2}\\theta + ${4 * a * a}${fn === "\\sin" ? "\\cos" : "\\sin"}^{2}\\theta = ${4 * a * a}$，所以 $L = \\int_{0}^{${beta}} ${2 * a} \\, d\\theta = ${answer}$。`,
  );
}

/** theArcLengthOfAPolarCurve integrates √(r² + (dr/dθ)²). */
export const theArcLengthOfAPolarCurve: TopicDef = {
  id: "the-arc-length-of-a-polar-curve",
  title: t("The Arc Length of a Polar Curve", "极坐标曲线的弧长"),
  summary: t(
    "The length of r = f(θ) for α ≤ θ ≤ β is ∫ √(r² + (dr/dθ)²) dθ from α to β.",
    "r = f(θ)（α ≤ θ ≤ β）的长度为从 α 到 β 的 ∫ √(r² + (dr/dθ)²) dθ。",
  ),
  prerequisites: ["differentiating-curves-given-in-polar-form", "the-arc-length-of-a-parametric-curve"],
  encompasses: [{ topic: "the-arc-length-of-a-parametric-curve", weight: 0.4 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "arc-lengths-of-cardioids",
      title: t("Arc lengths of cardioids", "心形线的弧长"),
      explanation: t(
        "With $x = r\\cos\\theta$ and $y = r\\sin\\theta$, $\\left(\\frac{dx}{d\\theta}\\right)^{2} + \\left(\\frac{dy}{d\\theta}\\right)^{2} = r^{2} + (r')^{2}$, so\n\n$$L = \\int_{\\alpha}^{\\beta} \\sqrt{r^{2} + \\left(\\frac{dr}{d\\theta}\\right)^{2}} \\, d\\theta.$$\n\nFor the cardioid $r = 1 + \\cos\\theta$ the integrand is $\\sqrt{2 + 2\\cos\\theta} = 2\\left|\\cos\\frac{\\theta}{2}\\right|$, and the whole cardioid has length $2\\int_{0}^{\\pi} 2\\cos\\frac{\\theta}{2} \\, d\\theta = 8$.",
        "由 $x = r\\cos\\theta$、$y = r\\sin\\theta$，$\\left(\\frac{dx}{d\\theta}\\right)^{2} + \\left(\\frac{dy}{d\\theta}\\right)^{2} = r^{2} + (r')^{2}$，所以\n\n$$L = \\int_{\\alpha}^{\\beta} \\sqrt{r^{2} + \\left(\\frac{dr}{d\\theta}\\right)^{2}} \\, d\\theta。$$\n\n对心形线 $r = 1 + \\cos\\theta$，被积函数为 $\\sqrt{2 + 2\\cos\\theta} = 2\\left|\\cos\\frac{\\theta}{2}\\right|$，整条心形线的长度为 $2\\int_{0}^{\\pi} 2\\cos\\frac{\\theta}{2} \\, d\\theta = 8$。",
      ),
      generate: cardioidLength,
    },
    {
      id: "arc-lengths-of-other-polar-curves",
      title: t("Arc lengths of other polar curves", "其他极坐标曲线的弧长"),
      explanation: t(
        "For the circle $r = 2a\\sin\\theta$, $r^{2} + (r')^{2} = 4a^{2}$, so the length is $2a$ times the change in $\\theta$. For $r = \\theta^{2}$, the integrand is $\\theta\\sqrt{\\theta^{2} + 4}$, which the substitution $u = \\theta^{2} + 4$ integrates.",
        "对圆 $r = 2a\\sin\\theta$，$r^{2} + (r')^{2} = 4a^{2}$，所以长度等于 $2a$ 乘以 $\\theta$ 的变化量。对 $r = \\theta^{2}$，被积函数为 $\\theta\\sqrt{\\theta^{2} + 4}$，用换元 $u = \\theta^{2} + 4$ 即可积分。",
      ),
      generate: otherPolarLength,
    },
  ],
};

/** calculusIIPolarTopics are the topics of Calculus II module 3.16. */
export const calculusIIPolarTopics: readonly TopicDef[] = [
  differentiatingCurvesGivenInPolarForm,
  furtherDifferentiationOfCurvesGivenInPolarForm,
  horizontalAndVerticalTangentsToPolarCurves,
  horizontalAndVerticalTangentsToPolarCurvesInNonDifferentiableCases,
  tangentAndNormalLinesToPolarCurves,
  findingTheAreaOfAPolarRegion,
  findingTheLimitsOfIntegrationForAGivenPolarRegion,
  theTotalAreaBoundedByASinglePolarCurve,
  theAreaBoundedByTwoPolarCurves,
  theArcLengthOfAPolarCurve,
];
