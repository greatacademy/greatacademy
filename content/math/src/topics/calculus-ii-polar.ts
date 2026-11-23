import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { calculusDrawings5 } from "../explanation-drawings-calculus-5.ts";

import { explainedChoice, pointLatex, pointProblem, say, withMistakes } from "../problems.ts";
import { functionWith, type Said, type Step, walked } from "./calculus-i-differentiation.ts";
import { times } from "./calculus-ii-areas.ts";
import { exactWorked, inP, lineL, pm, ratio, slip, worked } from "./calculus-ii-parametric.ts";
import { rootTimes } from "./calculus-ii-revolution.ts";

// Calculus II unit 3: Polar Coordinates (module 3.16).

/** k1 writes a positive integer coefficient, leaving 1 out. */
const k1 = (k: number) => (k === 1 ? "" : `${k}`);

/** piL writes qπ. */
const piL = (q: Q) => times(q, "\\pi");

/** signed writes " + n" or " - n" after another term. */
const signed = (n: number, rest = "") => `${n < 0 ? "-" : "+"} ${k1(Math.abs(n))}${rest}`;

/** lead writes n before a term, as "-" for −1 and nothing for 1. */
const lead = (n: number, rest: string) => `${n < 0 ? "-" : ""}${k1(Math.abs(n))}${rest}`;

/** sq writes the square of an expression, adding brackets when it needs them. */
const sq = (x: string) => (/^\d+$/.test(x) || x.startsWith("(") ? `${x}^{2}` : `\\left(${x}\\right)^{2}`);

/** quadrantal are the angles 0, π/2, π and 3π/2 with their cosines and sines. */
const quadrantal: readonly (readonly [string, number, number])[] = [
  ["0", 1, 0],
  ["\\frac{\\pi}{2}", 0, 1],
  ["\\pi", -1, 0],
  ["\\frac{3\\pi}{2}", 0, -1],
];

/** PolarCurve is r = a + b cos θ or r = a + b sin θ, with x and y also multiplied out. */
interface PolarCurve {
  readonly tex: string;
  /** dr writes r′. */
  readonly dr: string;
  /** at gives r and r′ from cos θ and sin θ. */
  readonly at: (c: number, s: number) => readonly [number, number];
  /** x and y are r cos θ and r sin θ multiplied out; dx and dy are their derivatives. */
  readonly x: string;
  readonly y: string;
  readonly dx: string;
  readonly dy: string;
  /** rates evaluates dx and dy from cos θ and sin θ. */
  readonly rates: (c: number, s: number) => readonly [number, number];
}

/** limacon chooses r = a + b cos θ or r = a + b sin θ. */
function limacon(rng: Rng): PolarCurve {
  const a = rng.int(1, 6);
  const b = rng.nonZero(-4, 4);
  if (rng.bool())
    return {
      tex: `${a} ${signed(b, "\\cos\\theta")}`,
      dr: lead(-b, "\\sin\\theta"),
      at: (c, s) => [a + b * c, -b * s],
      x: `${k1(a)}\\cos\\theta ${signed(b, "\\cos^{2}\\theta")}`,
      y: `${k1(a)}\\sin\\theta ${signed(b, "\\sin\\theta\\cos\\theta")}`,
      dx: `-${k1(a)}\\sin\\theta ${signed(-2 * b, "\\sin\\theta\\cos\\theta")}`,
      dy: `${k1(a)}\\cos\\theta ${signed(b, "\\cos 2\\theta")}`,
      rates: (c, s) => [-a * s - 2 * b * s * c, a * c + b * (c * c - s * s)],
    };
  return {
    tex: `${a} ${signed(b, "\\sin\\theta")}`,
    dr: lead(b, "\\cos\\theta"),
    at: (c, s) => [a + b * s, b * c],
    x: `${k1(a)}\\cos\\theta ${signed(b, "\\sin\\theta\\cos\\theta")}`,
    y: `${k1(a)}\\sin\\theta ${signed(b, "\\sin^{2}\\theta")}`,
    dx: `-${k1(a)}\\sin\\theta ${signed(b, "\\cos 2\\theta")}`,
    dy: `${k1(a)}\\cos\\theta ${signed(2 * b, "\\sin\\theta\\cos\\theta")}`,
    rates: (c, s) => [-a * s + b * (c * c - s * s), a * c + 2 * b * s * c],
  };
}

/** derivatives gives dx/dθ and dy/dθ from r, r′, cos θ and sin θ. */
const derivatives = (r: number, dr: number, c: number, s: number) => [dr * c - r * s, dr * s + r * c] as const;

/** polarSlopeFormula states dy/dx for a polar curve. */
const polarSlopeFormula =
  "\\frac{dy}{dx} = \\frac{dy/d\\theta}{dx/d\\theta} = \\frac{r'\\sin\\theta + r\\cos\\theta}{r'\\cos\\theta - r\\sin\\theta}";

/** expanded multiplies x and y out and differentiates them term by term, a route without the product rule formula. */
function expanded(curve: PolarCurve, angle: string, c: number, s: number): Text {
  const [ex, ey] = curve.rates(c, s);
  return t(
    `Multiply out first: $x = ${curve.x}$ and $y = ${curve.y}$. Differentiating term by term,\n\n$$\\frac{dx}{d\\theta} = ${curve.dx}, \\quad \\frac{dy}{d\\theta} = ${curve.dy}$$\n\nAt $\\theta = ${angle}$, with $\\cos\\theta = ${c}$ and $\\sin\\theta = ${s}$, these are $${ex}$ and $${ey}$.`,
    `先乘开：$x = ${curve.x}$，$y = ${curve.y}$。逐项求导，\n\n$$\\frac{dx}{d\\theta} = ${curve.dx}, \\quad \\frac{dy}{d\\theta} = ${curve.dy}$$\n\n在 $\\theta = ${angle}$ 处 $\\cos\\theta = ${c}$，$\\sin\\theta = ${s}$，它们分别为 $${ex}$ 和 $${ey}$。`,
  );
}

/** valuesStep finds r and r′ of a limaçon at a quadrantal angle. */
const valuesStep = (curve: PolarCurve, angle: string, c: number, s: number, r: number, dr: number): Step => [
  ["Find r and r′", "求 r 与 r′"],
  t(
    `Here $r' = ${curve.dr}$. At $\\theta = ${angle}$, $\\cos\\theta = ${c}$ and $\\sin\\theta = ${s}$, so`,
    `这里 $r' = ${curve.dr}$。在 $\\theta = ${angle}$ 处 $\\cos\\theta = ${c}$，$\\sin\\theta = ${s}$，所以`,
  ),
  [`r = ${r}, \\quad r' = ${dr}`],
];

/** quadrantalSlope finds dy/dx on a limaçon at a quadrantal angle. */
function quadrantalSlope(rng: Rng) {
  for (;;) {
    const curve = limacon(rng);
    const [angle, c, s] = rng.pick(quadrantal);
    const [r, dr] = curve.at(c, s);
    const [dx, dy] = derivatives(r, dr, c, s);
    if (dx === 0) continue;
    const answer = Q.of(dy, dx);
    const check = expanded(curve, angle, c, s);
    return worked(
      t(
        `Find the slope $\\frac{dy}{dx}$ of the polar curve $r = ${curve.tex}$ at $\\theta = ${angle}$.`,
        `求极坐标曲线 $r = ${curve.tex}$ 在 $\\theta = ${angle}$ 处的斜率 $\\frac{dy}{dx}$。`,
      ),
      answer,
      [
        valuesStep(curve, angle, c, s, r, dr),
        [
          ["Find both rates", "求两个变化率"],
          t(
            "Since $x = r\\cos\\theta$ and $y = r\\sin\\theta$, the product rule gives",
            "因为 $x = r\\cos\\theta$、$y = r\\sin\\theta$，由乘积法则",
          ),
          [
            `\\frac{dx}{d\\theta} = r'\\cos\\theta - r\\sin\\theta = (${dr})(${c}) - (${r})(${s}) = ${dx}`,
            `\\frac{dy}{d\\theta} = r'\\sin\\theta + r\\cos\\theta = (${dr})(${s}) + (${r})(${c}) = ${dy}`,
          ],
        ],
        [
          ["Divide", "相除"],
          t("The slope is the vertical rate over the horizontal rate.", "斜率等于竖直变化率除以水平变化率。"),
          [`\\frac{dy}{dx} = ${ratio(dy, dx)}`],
        ],
      ],
      t(`${check.en} Their quotient is the slope again.`, `${check["zh-CN"]}二者之商仍是这个斜率。`),
      [
        ...(dy === 0
          ? []
          : [
              slip(
                Q.of(dx, dy),
                "This is $\\frac{dx/d\\theta}{dy/d\\theta}$, upside down: the slope is the change in $y$ over the change in $x$.",
                "这是 $\\frac{dx/d\\theta}{dy/d\\theta}$，上下颠倒了：斜率是 $y$ 的变化除以 $x$ 的变化。",
              ),
            ]),
        ...(dr === 0
          ? []
          : [
              slip(
                Q.of(r, dr),
                "This is $\\frac{r}{r'}$, the radius over its rate; the slope needs $\\frac{dy/d\\theta}{dx/d\\theta}$.",
                "这是 $\\frac{r}{r'}$，即半径除以它的变化率；斜率要用 $\\frac{dy/d\\theta}{dx/d\\theta}$。",
              ),
            ]),
        slip(
          dr,
          "This is $\\frac{dr}{d\\theta}$, how fast the distance from the pole changes, not the slope of the curve.",
          "这是 $\\frac{dr}{d\\theta}$，即到极点的距离变化的快慢，不是曲线的斜率。",
        ),
        slip(r, "This is the radius $r$ at that angle, not a slope.", "这是该角处的半径 $r$，不是斜率。"),
      ],
    );
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
  const fn = askX ? "\\cos" : "\\sin";
  const answer = askX ? dx : dy;
  const formula = askX
    ? `r'\\cos\\theta - r\\sin\\theta = (${dr})(${c}) - (${r})(${s})`
    : `r'\\sin\\theta + r\\cos\\theta = (${dr})(${s}) + (${r})(${c})`;
  const check = expanded(curve, angle, c, s);
  return worked(
    t(
      `For the polar curve $r = ${curve.tex}$, find $\\frac{d${v}}{d\\theta}$ at $\\theta = ${angle}$.`,
      `对极坐标曲线 $r = ${curve.tex}$，求 $\\theta = ${angle}$ 处的 $\\frac{d${v}}{d\\theta}$。`,
    ),
    Q.of(answer),
    [
      valuesStep(curve, angle, c, s, r, dr),
      [
        ["Use the product rule", "用乘积法则"],
        t(
          `Since $${v} = r${fn}\\theta$ is a product of two functions of $\\theta$,`,
          `因为 $${v} = r${fn}\\theta$ 是 $\\theta$ 的两个函数之积，`,
        ),
        [`\\frac{d${v}}{d\\theta} = ${formula} = ${answer}`],
      ],
    ],
    t(
      `${check.en} The ${askX ? "first" : "second"} is the rate found above.`,
      `${check["zh-CN"]}其中${askX ? "前" : "后"}一个就是上面求得的变化率。`,
    ),
    [
      slip(
        askX ? dy : dx,
        `This is $\\frac{d${askX ? "y" : "x"}}{d\\theta}$, the rate of the other coordinate.`,
        `这是另一个坐标的变化率 $\\frac{d${askX ? "y" : "x"}}{d\\theta}$。`,
      ),
      slip(
        askX ? r * c : r * s,
        `This is $${v} = r${fn}\\theta$ itself, the coordinate, not its rate of change.`,
        `这是坐标 $${v} = r${fn}\\theta$ 本身，不是它的变化率。`,
      ),
      slip(
        askX ? dr * c + r * s : dr * s - r * c,
        askX
          ? "The derivative of $\\cos\\theta$ is $-\\sin\\theta$, so the second term is $-r\\sin\\theta$."
          : "The derivative of $\\sin\\theta$ is $\\cos\\theta$, so the second term is $+r\\cos\\theta$.",
        askX
          ? "$\\cos\\theta$ 的导数是 $-\\sin\\theta$，所以第二项是 $-r\\sin\\theta$。"
          : "$\\sin\\theta$ 的导数是 $\\cos\\theta$，所以第二项是 $+r\\cos\\theta$。",
      ),
      slip(
        askX ? dr * c : dr * s,
        `This keeps only $r'${fn}\\theta$; the product rule also gives a term from differentiating $${fn}\\theta$.`,
        `这里只保留了 $r'${fn}\\theta$；乘积法则还有一项来自对 $${fn}\\theta$ 求导。`,
      ),
    ],
  );
}

/** differentiatingCurvesGivenInPolarForm treats r = f(θ) as the parametric curve x = f(θ)cos θ, y = f(θ)sin θ. */
export const differentiatingCurvesGivenInPolarForm: TopicDef = {
  id: "differentiating-curves-given-in-polar-form",
  title: t("Differentiating Curves Given in Polar Form", "极坐标曲线的求导"),
  summary: t(
    "A polar curve r = f(θ) is the parametric curve x = f(θ)cos θ, y = f(θ)sin θ, so dy/dx = (dy/dθ)/(dx/dθ).",
    "极坐标曲线 r = f(θ) 就是参数曲线 x = f(θ)cos θ、y = f(θ)sin θ，所以 dy/dx = (dy/dθ)/(dx/dθ)。",
  ),
  intro: t(
    "The circle $r = 2$ is the parametric curve $x = 2\\cos\\theta$, $y = 2\\sin\\theta$. At $\\theta = \\frac{\\pi}{4}$, $\\frac{dx}{d\\theta} = -2\\sin\\theta = -\\sqrt{2}$ and $\\frac{dy}{d\\theta} = 2\\cos\\theta = \\sqrt{2}$, so\n\n$$\\frac{dy}{dx} = \\frac{\\sqrt{2}}{-\\sqrt{2}} = -1$$\n\nCheck: the circle is $x^{2} + y^{2} = 4$, and implicit differentiation gives $\\frac{dy}{dx} = -\\frac{x}{y}$. At the point $(\\sqrt{2}, \\sqrt{2})$ this is $-1$ as well.\n\nIn this lesson we find slopes of any polar curve $r = f(\\theta)$ in the same way, with the angle $\\theta$ as the parameter.",
    "圆 $r = 2$ 就是参数曲线 $x = 2\\cos\\theta$、$y = 2\\sin\\theta$。在 $\\theta = \\frac{\\pi}{4}$ 处 $\\frac{dx}{d\\theta} = -2\\sin\\theta = -\\sqrt{2}$，$\\frac{dy}{d\\theta} = 2\\cos\\theta = \\sqrt{2}$，所以\n\n$$\\frac{dy}{dx} = \\frac{\\sqrt{2}}{-\\sqrt{2}} = -1$$\n\n检验：这个圆是 $x^{2} + y^{2} = 4$，隐函数求导得 $\\frac{dy}{dx} = -\\frac{x}{y}$。在点 $(\\sqrt{2}, \\sqrt{2})$ 处它也等于 $-1$。\n\n这节课我们用同样的方法求任意极坐标曲线 $r = f(\\theta)$ 的斜率，把角 $\\theta$ 当作参数。",
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
        "A polar curve $r = f(\\theta)$ is the parametric curve $x = f(\\theta)\\cos\\theta$, $y = f(\\theta)\\sin\\theta$ with parameter $\\theta$. By the product rule,\n\n$$\\frac{dx}{d\\theta} = r'\\cos\\theta - r\\sin\\theta, \\qquad \\frac{dy}{d\\theta} = r'\\sin\\theta + r\\cos\\theta$$\n\nwhere $r' = f'(\\theta)$. For $r = 2 + \\cos\\theta$ at $\\theta = \\frac{\\pi}{2}$: $r = 2$, $r' = -1$, so $\\frac{dx}{d\\theta} = -2$ and $\\frac{dy}{d\\theta} = -1$.\n\nCheck: multiplied out, $x = 2\\cos\\theta + \\cos^{2}\\theta$ and $y = 2\\sin\\theta + \\sin\\theta\\cos\\theta$, so\n\n$$\\frac{dx}{d\\theta} = -2\\sin\\theta - 2\\sin\\theta\\cos\\theta, \\quad \\frac{dy}{d\\theta} = 2\\cos\\theta + \\cos 2\\theta$$\n\nAt $\\theta = \\frac{\\pi}{2}$ these are $-2$ and $-1$ again.\n\n> **Watch out.** $x = r\\cos\\theta$ is a product, so its derivative has two terms. Writing $\\frac{dx}{d\\theta} = r'\\cos\\theta$ alone leaves out $-r\\sin\\theta$ and here gives $0$ instead of $-2$.",
        "极坐标曲线 $r = f(\\theta)$ 就是以 $\\theta$ 为参数的参数曲线 $x = f(\\theta)\\cos\\theta$、$y = f(\\theta)\\sin\\theta$。由乘积法则，\n\n$$\\frac{dx}{d\\theta} = r'\\cos\\theta - r\\sin\\theta, \\qquad \\frac{dy}{d\\theta} = r'\\sin\\theta + r\\cos\\theta$$\n\n其中 $r' = f'(\\theta)$。对 $r = 2 + \\cos\\theta$，在 $\\theta = \\frac{\\pi}{2}$ 处 $r = 2$，$r' = -1$，所以 $\\frac{dx}{d\\theta} = -2$，$\\frac{dy}{d\\theta} = -1$。\n\n检验：乘开得 $x = 2\\cos\\theta + \\cos^{2}\\theta$，$y = 2\\sin\\theta + \\sin\\theta\\cos\\theta$，所以\n\n$$\\frac{dx}{d\\theta} = -2\\sin\\theta - 2\\sin\\theta\\cos\\theta, \\quad \\frac{dy}{d\\theta} = 2\\cos\\theta + \\cos 2\\theta$$\n\n在 $\\theta = \\frac{\\pi}{2}$ 处它们仍为 $-2$ 和 $-1$。\n\n> **注意。** $x = r\\cos\\theta$ 是乘积，它的导数有两项。只写 $\\frac{dx}{d\\theta} = r'\\cos\\theta$ 会漏掉 $-r\\sin\\theta$，这里会得到 $0$ 而不是 $-2$。",
      ),
      generate: coordinateRate,
    },
    {
      id: "slopes-of-polar-curves",
      figure: calculusDrawings5["differentiating-curves-given-in-polar-form#slopes-of-polar-curves"],
      title: t("Slopes of polar curves", "极坐标曲线的斜率"),
      explanation: t(
        `A polar curve is a parametric curve with the angle as the parameter, so its slope is the derivative of the vertical coordinate over that of the horizontal one. As for any parametric curve,\n\n$$${polarSlopeFormula}$$\n\nFor $r = 2 + \\cos\\theta$ at $\\theta = \\frac{\\pi}{2}$, the rates are $\\frac{dy}{d\\theta} = -1$ and $\\frac{dx}{d\\theta} = -2$, so the slope is $\\frac{1}{2}$.\n\nCheck: the point is $(0, 2)$, and the curve meets the $y$-axis again at $\\theta = \\frac{3\\pi}{2}$, at $(0, -1)$. Multiplying out instead, $x = 2\\cos\\theta + \\cos^{2}\\theta$ and $y = 2\\sin\\theta + \\sin\\theta\\cos\\theta$, whose derivatives at $\\frac{\\pi}{2}$ are $-2$ and $-1$; their quotient is $\\frac{1}{2}$.\n\n> **Watch out.** The slope is not $\\frac{dr}{d\\theta}$. Here $\\frac{dr}{d\\theta} = -\\sin\\theta = -1$, which says the curve is coming closer to the pole, but the slope is $\\frac{1}{2}$.`,
        `极坐标曲线是以角为参数的参数曲线，所以它的斜率是竖直坐标的导数除以水平坐标的导数。与任何参数曲线一样，\n\n$$${polarSlopeFormula}$$\n\n对 $r = 2 + \\cos\\theta$，在 $\\theta = \\frac{\\pi}{2}$ 处两个变化率为 $\\frac{dy}{d\\theta} = -1$、$\\frac{dx}{d\\theta} = -2$，所以斜率为 $\\frac{1}{2}$。\n\n检验：该点为 $(0, 2)$。改为先乘开，$x = 2\\cos\\theta + \\cos^{2}\\theta$，$y = 2\\sin\\theta + \\sin\\theta\\cos\\theta$，它们在 $\\frac{\\pi}{2}$ 处的导数为 $-2$ 和 $-1$，二者之商为 $\\frac{1}{2}$。\n\n> **注意。** 斜率不是 $\\frac{dr}{d\\theta}$。这里 $\\frac{dr}{d\\theta} = -\\sin\\theta = -1$，说明曲线正在靠近极点，但斜率是 $\\frac{1}{2}$。`,
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

/** tangentAngle checks a slope through the angle ψ between the radius and the tangent, where tan ψ = r/r′. */
function tangentAngle(r: number, dr: number, tan: number, answer: Q): Text {
  if (dr === 0)
    return t(
      `Where $r' = 0$ the tangent is perpendicular to the radius. The radius lies along the line $\\theta = \\text{const}$, whose slope is $\\tan\\theta = ${tan}$, and perpendicular slopes multiply to $-1$, so the slope is $${answer.toLatex()}$.`,
      `在 $r' = 0$ 处切线与半径垂直。半径在射线上，其斜率为 $\\tan\\theta = ${tan}$，互相垂直的斜率之积为 $-1$，所以斜率为 $${answer.toLatex()}$。`,
    );
  const psi = Q.of(r, dr);
  return t(
    `The tangent makes an angle $\\psi$ with the radius, with $\\tan\\psi = \\frac{r}{r'}$, which here is $${psi.toLatex()}$, so its direction is $\\theta + \\psi$. With $\\tan\\theta = ${tan}$,\n\n$$\\tan(\\theta + \\psi) = \\frac{\\tan\\theta + \\tan\\psi}{1 - \\tan\\theta\\tan\\psi} = \\frac{${tan}${pm(psi)}}{1${pm(psi.mul(Q.of(-tan)))}} = ${answer.toLatex()}$$`,
    `切线与半径的夹角为 $\\psi$，其中 $\\tan\\psi = \\frac{r}{r'}$，这里等于 $${psi.toLatex()}$，所以切线的方向角为 $\\theta + \\psi$。由 $\\tan\\theta = ${tan}$，\n\n$$\\tan(\\theta + \\psi) = \\frac{\\tan\\theta + \\tan\\psi}{1 - \\tan\\theta\\tan\\psi} = \\frac{${tan}${pm(psi)}}{1${pm(psi.mul(Q.of(-tan)))}} = ${answer.toLatex()}$$`,
  );
}

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
    if (dx === 0) continue;
    const answer = Q.of(dy, dx);
    const tan = c * s;
    const halfRate = -b * s2;
    const [hx, hy] = derivatives(r, halfRate, c, s);
    return worked(
      t(
        `Find the slope $\\frac{dy}{dx}$ of the polar curve $r = ${tex}$ at $\\theta = ${angle}$.`,
        `求极坐标曲线 $r = ${tex}$ 在 $\\theta = ${angle}$ 处的斜率 $\\frac{dy}{dx}$。`,
      ),
      answer,
      [
        [
          ["Find r and r′", "求 r 与 r′"],
          t(
            `Here $r' = ${cosine ? `${-2 * b}\\sin 2\\theta` : `${2 * b}\\cos 2\\theta`}$. At $\\theta = ${angle}$, $\\cos 2\\theta = 0$ and $\\sin 2\\theta = ${s2}$, so`,
            `这里 $r' = ${cosine ? `${-2 * b}\\sin 2\\theta` : `${2 * b}\\cos 2\\theta`}$。在 $\\theta = ${angle}$ 处 $\\cos 2\\theta = 0$，$\\sin 2\\theta = ${s2}$，所以`,
          ),
          [`r = ${r}, \\quad r' = ${dr}`],
        ],
        [
          ["Cancel the common factor", "约去公因子"],
          t(
            `Here $\\cos\\theta$ and $\\sin\\theta$ are $\\pm\\frac{\\sqrt{2}}{2}$, with signs $${c}$ and $${s}$. The factor $\\frac{\\sqrt{2}}{2}$ cancels from the top and bottom of the slope, leaving the signs:`,
            `这里 $\\cos\\theta$ 和 $\\sin\\theta$ 都是 $\\pm\\frac{\\sqrt{2}}{2}$，符号分别为 $${c}$ 和 $${s}$。斜率的分子分母中因子 $\\frac{\\sqrt{2}}{2}$ 约去，只剩符号：`,
          ),
          [
            `\\frac{dy}{dx} = \\frac{r'\\sin\\theta + r\\cos\\theta}{r'\\cos\\theta - r\\sin\\theta} = \\frac{(${dr})(${s}) + (${r})(${c})}{(${dr})(${c}) - (${r})(${s})} = ${ratio(dy, dx)}`,
          ],
        ],
      ],
      tangentAngle(r, dr, tan, answer),
      [
        ...(dy === 0
          ? []
          : [
              slip(
                Q.of(dx, dy),
                "This is $\\frac{dx/d\\theta}{dy/d\\theta}$, upside down: the slope is the change in $y$ over the change in $x$.",
                "这是 $\\frac{dx/d\\theta}{dy/d\\theta}$，上下颠倒了：斜率是 $y$ 的变化除以 $x$ 的变化。",
              ),
            ]),
        slip(dr, "This is $r'$, the rate of change of $r$, not the slope of the curve.", "这是 $r$ 的变化率 $r'$，不是曲线的斜率。"),
        slip(
          tan,
          "This is $\\tan\\theta$, the slope of the radius to the point; the curve runs along the radius only where it passes through the pole.",
          "这是 $\\tan\\theta$，即到该点的半径的斜率；只有在曲线经过极点处，它才沿半径方向。",
        ),
        ...(cosine && hx !== 0
          ? [
              slip(
                Q.of(hy, hx),
                "This drops the factor $2$ from the chain rule: the derivative of $\\cos 2\\theta$ is $-2\\sin 2\\theta$.",
                "这里漏掉了链式法则的因子 $2$：$\\cos 2\\theta$ 的导数是 $-2\\sin 2\\theta$。",
              ),
            ]
          : []),
      ],
    );
  }
}

/** spiralSlope finds dy/dx on the logarithmic spiral r = a e^{kθ}, where r′ = kr. */
function spiralSlope(rng: Rng) {
  for (;;) {
    const a = rng.int(1, 5);
    const k = rng.int(2, 5);
    const diag = rng.bool();
    const [angle, c, s] = diag ? rng.pick(diagonal) : rng.pick(quadrantal);
    // r′ = kr; dividing numerator and denominator by r (and by √2/2 at the diagonal angles):
    const [dx, dy] = derivatives(1, k, c, s);
    if (dx === 0) continue;
    const answer = Q.of(dy, dx);
    const check = diag
      ? tangentAngle(1, k, c * s, answer)
      : c === 0
        ? t(
            `The tangent makes an angle $\\psi$ with the radius, with $\\tan\\psi = \\frac{r}{r'}$, which here is $\\frac{1}{${k}}$ at every point. At $\\theta = ${angle}$ the radius is vertical, so the tangent is turned $\\psi$ from the vertical and its slope is $-\\frac{1}{\\tan\\psi} = ${answer.toLatex()}$.`,
            `切线与半径的夹角为 $\\psi$，在每一点都有 $\\tan\\psi = \\frac{r}{r'}$，这里等于 $\\frac{1}{${k}}$。在 $\\theta = ${angle}$ 处半径竖直，切线从竖直方向转过 $\\psi$，斜率为 $-\\frac{1}{\\tan\\psi} = ${answer.toLatex()}$。`,
          )
        : t(
            `The tangent makes an angle $\\psi$ with the radius, with $\\tan\\psi = \\frac{r}{r'}$, which here is $\\frac{1}{${k}}$ at every point. At $\\theta = ${angle}$ the radius is horizontal, so the slope of the tangent is $\\tan\\psi = ${answer.toLatex()}$.`,
            `切线与半径的夹角为 $\\psi$，在每一点都有 $\\tan\\psi = \\frac{r}{r'}$，这里等于 $\\frac{1}{${k}}$。在 $\\theta = ${angle}$ 处半径水平，所以切线斜率为 $\\tan\\psi = ${answer.toLatex()}$。`,
          );
    return worked(
      t(
        `Find the slope $\\frac{dy}{dx}$ of the spiral $r = ${k1(a)}e^{${k}\\theta}$ at $\\theta = ${angle}$.`,
        `求螺线 $r = ${k1(a)}e^{${k}\\theta}$ 在 $\\theta = ${angle}$ 处的斜率 $\\frac{dy}{dx}$。`,
      ),
      answer,
      [
        [
          ["Find r′", "求 r′"],
          t("By the chain rule the derivative of the radius is a multiple of the radius:", "由链式法则，半径的导数是半径的倍数："),
          [`r' = ${k * a}e^{${k}\\theta} = ${k}r`],
        ],
        [
          ["Cancel r", "约去 r"],
          t(
            `Put $r' = ${k}r$ into the slope formula and divide the top and bottom by $r$.`,
            `把 $r' = ${k}r$ 代入斜率公式，分子分母同除以 $r$。`,
          ),
          [`\\frac{dy}{dx} = \\frac{${k}\\sin\\theta + \\cos\\theta}{${k}\\cos\\theta - \\sin\\theta}`],
        ],
        [
          ["Substitute the angle", "代入角度"],
          diag
            ? t(
                `Here $\\cos\\theta$ and $\\sin\\theta$ are $\\pm\\frac{\\sqrt{2}}{2}$, with signs $${c}$ and $${s}$; the factor $\\frac{\\sqrt{2}}{2}$ cancels.`,
                `这里 $\\cos\\theta$ 和 $\\sin\\theta$ 都是 $\\pm\\frac{\\sqrt{2}}{2}$，符号分别为 $${c}$ 和 $${s}$；因子 $\\frac{\\sqrt{2}}{2}$ 约去。`,
              )
            : t(`Here $\\cos\\theta = ${c}$ and $\\sin\\theta = ${s}$.`, `这里 $\\cos\\theta = ${c}$，$\\sin\\theta = ${s}$。`),
          [`\\frac{dy}{dx} = \\frac{${k}(${s}) + (${c})}{${k}(${c}) - (${s})} = ${ratio(dy, dx)}`],
        ],
      ],
      check,
      [
        ...(dy === 0
          ? []
          : [
              slip(
                Q.of(dx, dy),
                "This is $\\frac{dx/d\\theta}{dy/d\\theta}$, upside down: the slope is the change in $y$ over the change in $x$.",
                "这是 $\\frac{dx/d\\theta}{dy/d\\theta}$，上下颠倒了：斜率是 $y$ 的变化除以 $x$ 的变化。",
              ),
            ]),
        slip(
          k,
          "This is $\\frac{r'}{r} = k$, how fast the spiral grows, not the slope of its tangent.",
          "这是 $\\frac{r'}{r} = k$，即螺线增长的快慢，不是切线的斜率。",
        ),
        slip(
          answer.neg(),
          "The sign is wrong: check the signs of $\\cos\\theta$ and $\\sin\\theta$ at this angle.",
          "符号错了：检查这个角处 $\\cos\\theta$ 和 $\\sin\\theta$ 的符号。",
        ),
        slip(
          Q.of(1, k),
          "This is $\\tan\\psi = \\frac{1}{k}$, the angle between the tangent and the radius, not the slope.",
          "这是切线与半径夹角的正切 $\\tan\\psi = \\frac{1}{k}$，不是斜率。",
        ),
      ],
    );
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
  intro: t(
    "For $r = 2 + \\cos\\theta$ at $\\theta = \\frac{\\pi}{2}$: $r = 2$ and $r' = -\\sin\\theta = -1$, so\n\n$$\\frac{dy}{dx} = \\frac{r'\\sin\\theta + r\\cos\\theta}{r'\\cos\\theta - r\\sin\\theta} = \\frac{-1 + 0}{0 - 2} = \\frac{1}{2}$$\n\nCheck: multiplied out, $x = 2\\cos\\theta + \\cos^{2}\\theta$ and $y = 2\\sin\\theta + \\sin\\theta\\cos\\theta$. Their derivatives at $\\frac{\\pi}{2}$ are $-2$ and $-1$, and $\\frac{-1}{-2}$ is $\\frac{1}{2}$ again.\n\nIn this lesson we use the same formula on roses and spirals and at angles such as $\\frac{\\pi}{4}$, where a common factor cancels.",
    "对 $r = 2 + \\cos\\theta$，在 $\\theta = \\frac{\\pi}{2}$ 处 $r = 2$，$r' = -\\sin\\theta = -1$，所以\n\n$$\\frac{dy}{dx} = \\frac{r'\\sin\\theta + r\\cos\\theta}{r'\\cos\\theta - r\\sin\\theta} = \\frac{-1 + 0}{0 - 2} = \\frac{1}{2}$$\n\n检验：乘开得 $x = 2\\cos\\theta + \\cos^{2}\\theta$，$y = 2\\sin\\theta + \\sin\\theta\\cos\\theta$。它们在 $\\frac{\\pi}{2}$ 处的导数为 $-2$ 和 $-1$，$\\frac{-1}{-2}$ 仍是 $\\frac{1}{2}$。\n\n这节课我们把同一个公式用于玫瑰线和螺线，以及 $\\frac{\\pi}{4}$ 这类角，那里有公因子可以约去。",
  ),
  prerequisites: ["differentiating-curves-given-in-polar-form", "the-chain-rule-with-exponential-functions"],
  encompasses: [{ topic: "differentiating-curves-given-in-polar-form", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "slopes-at-odd-multiples-of-a-quarter-turn",
      figure: calculusDrawings5["further-differentiation-of-curves-given-in-polar-form#slopes-at-odd-multiples-of-a-quarter-turn"],
      title: t("Slopes at odd multiples of π/4", "π/4 奇数倍处的斜率"),
      explanation: t(
        `At these angles sine and cosine have the same size, so a common factor cancels from the slope and the computation becomes much shorter. At $\\theta = \\frac{\\pi}{4}$, $\\cos\\theta = \\sin\\theta = \\frac{\\sqrt{2}}{2}$, and the common factor cancels in\n\n$$${polarSlopeFormula}$$\n\nFor $r = 3 + \\cos 2\\theta$ at $\\frac{\\pi}{4}$: $r = 3$ and $r' = -2\\sin 2\\theta = -2$, so\n\n$$\\frac{dy}{dx} = \\frac{-2 + 3}{-2 - 3} = -\\frac{1}{5}$$\n\nCheck: the tangent makes an angle $\\psi$ with the radius, with $\\tan\\psi = \\frac{r}{r'}$, which here is $-\\frac{3}{2}$. The radius has $\\tan\\theta = 1$, so\n\n$$\\tan(\\theta + \\psi) = \\frac{1 - \\frac{3}{2}}{1 + \\frac{3}{2}} = -\\frac{1}{5}$$\n\n> **Watch out.** Keep the factor $2$ from the chain rule: the derivative of $\\cos 2\\theta$ is $-2\\sin 2\\theta$. With $r' = -1$ the slope would come out as $\\frac{-1 + 3}{-1 - 3} = -\\frac{1}{2}$.`,
        `在这些角处正弦和余弦的绝对值相等，所以斜率中的公因子可以约去，计算变得短得多。在 $\\theta = \\frac{\\pi}{4}$ 处 $\\cos\\theta = \\sin\\theta = \\frac{\\sqrt{2}}{2}$，公因子在下式中约去：\n\n$$${polarSlopeFormula}$$\n\n对 $r = 3 + \\cos 2\\theta$，在 $\\frac{\\pi}{4}$ 处 $r = 3$，$r' = -2\\sin 2\\theta = -2$，所以\n\n$$\\frac{dy}{dx} = \\frac{-2 + 3}{-2 - 3} = -\\frac{1}{5}$$\n\n检验：切线与半径的夹角为 $\\psi$，其中 $\\tan\\psi = \\frac{r}{r'}$，这里等于 $-\\frac{3}{2}$。半径的 $\\tan\\theta = 1$，所以\n\n$$\\tan(\\theta + \\psi) = \\frac{1 - \\frac{3}{2}}{1 + \\frac{3}{2}} = -\\frac{1}{5}$$\n\n> **注意。** 保留链式法则的因子 $2$：$\\cos 2\\theta$ 的导数是 $-2\\sin 2\\theta$。若取 $r' = -1$，斜率会算成 $\\frac{-1 + 3}{-1 - 3} = -\\frac{1}{2}$。`,
      ),
      generate: diagonalSlope,
    },
    {
      id: "slopes-of-logarithmic-spirals",
      figure: calculusDrawings5["further-differentiation-of-curves-given-in-polar-form#slopes-of-logarithmic-spirals"],
      title: t("Slopes of logarithmic spirals", "对数螺线的斜率"),
      explanation: t(
        "The derivative of the radius is a constant multiple of the radius itself, so the radius cancels and the slope depends only on the angle. For the spiral $r = ae^{k\\theta}$, $r' = kr$, so $r$ cancels from the slope:\n\n$$\\frac{dy}{dx} = \\frac{k\\sin\\theta + \\cos\\theta}{k\\cos\\theta - \\sin\\theta}$$\n\nFor $k = 2$ at $\\theta = \\frac{\\pi}{2}$: $\\frac{dy}{dx} = \\frac{2}{-1} = -2$.\n\nCheck: the tangent makes the same angle $\\psi$ with the radius everywhere, with $\\tan\\psi = \\frac{r}{r'}$, which here is $\\frac{1}{2}$. At $\\theta = \\frac{\\pi}{2}$ the radius is vertical, so the tangent is turned $\\psi$ from the vertical and its slope is $-\\frac{1}{\\tan\\psi} = -2$.\n\n> **Watch out.** The slope is not $k$. The number $k = \\frac{r'}{r}$ says how fast the spiral grows; the slope also depends on the angle, and here it is $-2$, not $2$.",
        "半径的导数是半径本身的常数倍，所以半径被约去，斜率只取决于角度。对螺线 $r = ae^{k\\theta}$，$r' = kr$，所以斜率中 $r$ 约去：\n\n$$\\frac{dy}{dx} = \\frac{k\\sin\\theta + \\cos\\theta}{k\\cos\\theta - \\sin\\theta}$$\n\n取 $k = 2$，在 $\\theta = \\frac{\\pi}{2}$ 处 $\\frac{dy}{dx} = \\frac{2}{-1} = -2$。\n\n检验：切线与半径处处成同一个角 $\\psi$，$\\tan\\psi = \\frac{r}{r'}$，这里等于 $\\frac{1}{2}$。在 $\\theta = \\frac{\\pi}{2}$ 处半径竖直，切线从竖直方向转过 $\\psi$，斜率为 $-\\frac{1}{\\tan\\psi} = -2$。\n\n> **注意。** 斜率不是 $k$。$k = \\frac{r'}{r}$ 表示螺线增长的快慢；斜率还取决于角度，这里是 $-2$ 而不是 $2$。",
      ),
      generate: spiralSlope,
    },
  ],
};

/** cardioidTangents locates horizontal and vertical tangents of r = a(1 ± cos θ). */
function cardioidTangents(rng: Rng): Problem {
  const a = rng.int(1, 8);
  const plus = rng.bool();
  const tex = `${k1(a)}(1 ${plus ? "+" : "-"} \\cos\\theta)`;
  const ask = rng.int(0, 2);
  const A = k1(a);
  const differentiate: Step = [
    ["Differentiate x and y", "对 x 与 y 求导"],
    t(
      `Multiply out $x = r\\cos\\theta$ and $y = r\\sin\\theta$ and differentiate, using $\\cos^{2}\\theta - \\sin^{2}\\theta = \\cos 2\\theta$ and $2\\sin\\theta\\cos\\theta = \\sin 2\\theta$:`,
      `把 $x = r\\cos\\theta$、$y = r\\sin\\theta$ 乘开后求导，并用 $\\cos^{2}\\theta - \\sin^{2}\\theta = \\cos 2\\theta$、$2\\sin\\theta\\cos\\theta = \\sin 2\\theta$：`,
    ),
    [
      `\\frac{dy}{d\\theta} = ${A}(${plus ? "\\cos\\theta + \\cos 2\\theta" : "\\cos\\theta - \\cos 2\\theta"})`,
      `\\frac{dx}{d\\theta} = -${A}(${plus ? "\\sin\\theta + \\sin 2\\theta" : "\\sin\\theta - \\sin 2\\theta"})`,
    ],
  ];
  const half = plus ? "\\frac{1}{2}" : "-\\frac{1}{2}";
  if (ask === 0) {
    const angle = plus ? "\\frac{\\pi}{3}" : "\\frac{2\\pi}{3}";
    return exactWorked(
      t(
        `The cardioid $r = ${tex}$ has a horizontal tangent at one angle $\\theta$ with $0 < \\theta < \\pi$. Find that $\\theta$.`,
        `心形线 $r = ${tex}$ 在 $0 < \\theta < \\pi$ 中恰有一个角 $\\theta$ 处有水平切线。求这个 $\\theta$。`,
      ),
      angle,
      [
        differentiate,
        [
          ["Solve dy/dθ = 0", "解 dy/dθ = 0"],
          t(
            "Write $\\cos 2\\theta = 2\\cos^{2}\\theta - 1$ and factor. In $(0, \\pi)$ the factor with $\\cos\\theta = " +
              (plus ? "-1" : "1") +
              "$ never vanishes, so",
            `用 $\\cos 2\\theta = 2\\cos^{2}\\theta - 1$ 再因式分解。在 $(0, \\pi)$ 中 $\\cos\\theta = ${plus ? "-1" : "1"}$ 的因子不为零，所以`,
          ),
          [
            plus
              ? "\\cos\\theta + \\cos 2\\theta = (2\\cos\\theta - 1)(\\cos\\theta + 1) = 0"
              : "\\cos\\theta - \\cos 2\\theta = -(2\\cos\\theta + 1)(\\cos\\theta - 1) = 0",
            `\\cos\\theta = ${half}, \\quad \\theta = ${angle}`,
          ],
        ],
      ],
      plus
        ? t(
            `Substitute back into the brackets of both rates:\n\n$$\\cos\\frac{\\pi}{3} + \\cos\\frac{2\\pi}{3} = \\frac{1}{2} - \\frac{1}{2} = 0, \\quad \\sin\\frac{\\pi}{3} + \\sin\\frac{2\\pi}{3} = \\sqrt{3}$$\n\nSo $\\frac{dy}{d\\theta} = 0$ while $\\frac{dx}{d\\theta} \\ne 0$, and the tangent is horizontal.`,
            `代回两个变化率的括号：\n\n$$\\cos\\frac{\\pi}{3} + \\cos\\frac{2\\pi}{3} = \\frac{1}{2} - \\frac{1}{2} = 0, \\quad \\sin\\frac{\\pi}{3} + \\sin\\frac{2\\pi}{3} = \\sqrt{3}$$\n\n所以 $\\frac{dy}{d\\theta} = 0$ 而 $\\frac{dx}{d\\theta} \\ne 0$，切线水平。`,
          )
        : t(
            `Substitute back into the brackets of both rates:\n\n$$\\cos\\frac{2\\pi}{3} - \\cos\\frac{4\\pi}{3} = -\\frac{1}{2} + \\frac{1}{2} = 0, \\quad \\sin\\frac{2\\pi}{3} - \\sin\\frac{4\\pi}{3} = \\sqrt{3}$$\n\nSo $\\frac{dy}{d\\theta} = 0$ while $\\frac{dx}{d\\theta} \\ne 0$, and the tangent is horizontal.`,
            `代回两个变化率的括号：\n\n$$\\cos\\frac{2\\pi}{3} - \\cos\\frac{4\\pi}{3} = -\\frac{1}{2} + \\frac{1}{2} = 0, \\quad \\sin\\frac{2\\pi}{3} - \\sin\\frac{4\\pi}{3} = \\sqrt{3}$$\n\n所以 $\\frac{dy}{d\\theta} = 0$ 而 $\\frac{dx}{d\\theta} \\ne 0$，切线水平。`,
          ),
      [
        say(
          plus ? "\\frac{2\\pi}{3}" : "\\frac{\\pi}{3}",
          `This solves $\\cos\\theta = ${plus ? "-" : ""}\\frac{1}{2}$, where $\\frac{dx}{d\\theta} = 0$: the tangent there is vertical.`,
          `这是 $\\cos\\theta = ${plus ? "-" : ""}\\frac{1}{2}$ 的解，此处 $\\frac{dx}{d\\theta} = 0$，切线是竖直的。`,
        ),
        say(
          "\\frac{\\pi}{2}",
          `At $\\frac{\\pi}{2}$ the point is on the $y$-axis, but $\\frac{dy}{d\\theta} = ${plus ? "-" : ""}${a}$ is not zero there.`,
          `在 $\\frac{\\pi}{2}$ 处点在 $y$ 轴上，但那里 $\\frac{dy}{d\\theta} = ${plus ? "-" : ""}${a}$ 不为零。`,
        ),
        say(
          plus ? "\\frac{\\pi}{6}" : "\\frac{5\\pi}{6}",
          `This angle has $\\sin\\theta = \\frac{1}{2}$; the equation is $\\cos\\theta = ${half}$.`,
          `这个角满足 $\\sin\\theta = \\frac{1}{2}$；要解的是 $\\cos\\theta = ${half}$。`,
        ),
      ],
    );
  }
  if (ask === 1) {
    const answer = rootTimes(Q.of(3 * a, 4), 3, "");
    return exactWorked(
      t(
        `Find the largest $y$-coordinate of a point on the cardioid $r = ${tex}$. Give an exact answer.`,
        `求心形线 $r = ${tex}$ 上点的最大 $y$ 坐标，给出精确值。`,
      ),
      answer,
      [
        differentiate,
        [
          ["Find the highest point", "找最高点"],
          t(
            `The highest point has a horizontal tangent. Solving $\\frac{dy}{d\\theta} = 0$ gives $\\cos\\theta = ${half}$, and the top of the curve has $\\sin\\theta = \\frac{\\sqrt{3}}{2}$. There`,
            `最高点处切线水平。解 $\\frac{dy}{d\\theta} = 0$ 得 $\\cos\\theta = ${half}$，曲线顶部 $\\sin\\theta = \\frac{\\sqrt{3}}{2}$。此时`,
          ),
          [`r = ${A}\\left(1 + \\frac{1}{2}\\right) = ${Q.of(3 * a, 2).toLatex()}`],
        ],
        [
          ["Find y", "求 y"],
          t("Multiply by the sine.", "乘以正弦。"),
          [`y = r\\sin\\theta = ${Q.of(3 * a, 2).toLatex()} \\cdot \\frac{\\sqrt{3}}{2} = ${answer}`],
        ],
      ],
      t(
        `Maximize $y^{2}$ as a function of $u = \\cos\\theta$ instead. Since $\\sin^{2}\\theta = 1 - u^{2}$,\n\n$$y^{2} = ${k1(a * a)}(1 ${plus ? "+" : "-"} u)^{3}(1 ${plus ? "-" : "+"} u), \\quad \\frac{d}{du}\\left[(1 ${plus ? "+" : "-"} u)^{3}(1 ${plus ? "-" : "+"} u)\\right] = (1 ${plus ? "+" : "-"} u)^{2}(${plus ? "2 - 4u" : "-2 - 4u"})$$\n\nThis is zero at $u = ${half}$, where\n\n$$y^{2} = ${k1(a * a)}\\left(\\frac{3}{2}\\right)^{3} \\cdot \\frac{1}{2} = ${Q.of(27 * a * a, 16).toLatex()}$$\n\nIts square root is $${answer}$.`,
        `改为把 $y^{2}$ 看作 $u = \\cos\\theta$ 的函数求最大值。因为 $\\sin^{2}\\theta = 1 - u^{2}$，\n\n$$y^{2} = ${k1(a * a)}(1 ${plus ? "+" : "-"} u)^{3}(1 ${plus ? "-" : "+"} u), \\quad \\frac{d}{du}\\left[(1 ${plus ? "+" : "-"} u)^{3}(1 ${plus ? "-" : "+"} u)\\right] = (1 ${plus ? "+" : "-"} u)^{2}(${plus ? "2 - 4u" : "-2 - 4u"})$$\n\n它在 $u = ${half}$ 处为零，此时\n\n$$y^{2} = ${k1(a * a)}\\left(\\frac{3}{2}\\right)^{3} \\cdot \\frac{1}{2} = ${Q.of(27 * a * a, 16).toLatex()}$$\n\n其平方根为 $${answer}$。`,
      ),
      [
        say(
          `${2 * a}`,
          `This is the largest $r$, reached on the $x$-axis where $y = 0$.`,
          `这是最大的 $r$，在 $x$ 轴上取到，那里 $y = 0$。`,
        ),
        say(
          `${a}`,
          "This is $y$ at $\\theta = \\frac{\\pi}{2}$; the curve rises higher before then.",
          "这是 $\\theta = \\frac{\\pi}{2}$ 处的 $y$；曲线在此之前升得更高。",
        ),
        say(
          rootTimes(Q.of(a, 2), 3, ""),
          `This uses $r = ${a}$ in place of $r = ${Q.of(3 * a, 2).toLatex()}$ at the highest point.`,
          `这里在最高点用了 $r = ${a}$，而不是 $r = ${Q.of(3 * a, 2).toLatex()}$。`,
        ),
      ],
    );
  }
  const answer = Q.of(plus ? -a : a, 4);
  return worked(
    t(
      `The cardioid $r = ${tex}$ has a vertical tangent at a point with $x = ${plus ? 2 * a : -2 * a}$ and at two other points. Find the $x$-coordinate of those two points.`,
      `心形线 $r = ${tex}$ 在 $x = ${plus ? 2 * a : -2 * a}$ 的点和另外两个点处有竖直切线。求另外两个点的 $x$ 坐标。`,
    ),
    answer,
    [
      differentiate,
      [
        ["Solve dx/dθ = 0", "解 dx/dθ = 0"],
        t("Write $\\sin 2\\theta = 2\\sin\\theta\\cos\\theta$ and factor:", "用 $\\sin 2\\theta = 2\\sin\\theta\\cos\\theta$ 因式分解："),
        [`-${A}\\sin\\theta(1 ${plus ? "+" : "-"} 2\\cos\\theta) = 0`],
      ],
      [
        ["Find x", "求 x"],
        t(
          `Besides $\\sin\\theta = 0$, the roots have $\\cos\\theta = ${half}$. There`,
          `除 $\\sin\\theta = 0$ 外，其余的根满足 $\\cos\\theta = ${half}$。此时`,
        ),
        [`r = ${A}\\left(1 - \\frac{1}{2}\\right) = ${Q.of(a, 2).toLatex()}, \\quad x = r\\cos\\theta = ${answer.toLatex()}`],
      ],
    ],
    t(
      `As a function of $u = \\cos\\theta$, $x = r\\cos\\theta = ${A}(u ${plus ? "+" : "-"} u^{2})$. Its derivative $${A}(1 ${plus ? "+" : "-"} 2u)$ is zero at $u = ${half}$, so the ${plus ? "smallest" : "largest"} value of $x$ is\n\n$$${A}\\left(${half} ${plus ? "+" : "-"} \\frac{1}{4}\\right) = ${answer.toLatex()}$$\n\nAt the ${plus ? "leftmost" : "rightmost"} points of the curve the tangent is vertical.`,
      `把 $x = r\\cos\\theta = ${A}(u ${plus ? "+" : "-"} u^{2})$ 看作 $u = \\cos\\theta$ 的函数。它的导数 $${A}(1 ${plus ? "+" : "-"} 2u)$ 在 $u = ${half}$ 处为零，所以 $x$ 的${plus ? "最小" : "最大"}值为\n\n$$${A}\\left(${half} ${plus ? "+" : "-"} \\frac{1}{4}\\right) = ${answer.toLatex()}$$\n\n在曲线最${plus ? "左" : "右"}的点处切线竖直。`,
    ),
    [
      slip(
        answer.neg(),
        `The sign is wrong: $x = r\\cos\\theta$ with $\\cos\\theta = ${half}$ is ${plus ? "negative" : "positive"}.`,
        `符号错了：$\\cos\\theta = ${half}$ 时 $x = r\\cos\\theta$ 为${plus ? "负" : "正"}。`,
      ),
      slip(
        Q.of(plus ? -a : a, 2),
        `This uses $r = ${a}$; at these points $r = ${Q.of(a, 2).toLatex()}$.`,
        `这里用了 $r = ${a}$；在这些点处 $r = ${Q.of(a, 2).toLatex()}$。`,
      ),
      slip(
        0,
        "This is the pole, a cusp where both rates are zero; it is not one of the two points.",
        "这是极点，两个变化率都为零的尖点，不是所求的两个点之一。",
      ),
    ],
  );
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
  const mirror: readonly [number, number] = cosine ? [a, -point[1]] : [-point[0], a];
  const angle = positive ? "\\frac{\\pi}{4}" : cosine ? "-\\frac{\\pi}{4}" : "\\frac{3\\pi}{4}";
  const [x, y, d, other, otherRate] = cosine
    ? [`${a}(1 + \\cos 2\\theta)`, `${a}\\sin 2\\theta`, "y", "x", `-${2 * a}\\sin 2\\theta`]
    : [`${a}\\sin 2\\theta`, `${a}(1 - \\cos 2\\theta)`, "x", "y", `${2 * a}\\sin 2\\theta`];
  const rt = rootTimes(Q.of(a), 2, "");
  const far: readonly [number, number] = cosine ? [2 * a, 0] : [0, 2 * a];
  const problem = pointProblem({
    prompt: t(
      `The circle $r = ${tex}$ has a ${kind.en} tangent at a point with ${condition.en}. Find that point in Cartesian coordinates.`,
      `圆 $r = ${tex}$ 在${condition["zh-CN"]}的某点处有${kind["zh-CN"]}切线。求该点的直角坐标。`,
    ),
    answer: point,
    wrong: [mirror, far, [0, 0]],
    solution: walked(
      [
        [
          ["Write x and y", "写出 x 与 y"],
          t("Use the double angle formulas.", "用二倍角公式。"),
          [`x = r\\cos\\theta = ${x}, \\quad y = r\\sin\\theta = ${y}`],
        ],
        [
          [`Solve d${d}/dθ = 0`, `解 d${d}/dθ = 0`],
          t(
            `A ${kind.en} tangent needs $\\frac{d${d}}{d\\theta} = 0$ with $\\frac{d${other}}{d\\theta} = ${otherRate} \\ne 0$. The root with the ${condition.en} is`,
            `${kind["zh-CN"]}切线要求 $\\frac{d${d}}{d\\theta} = 0$ 且 $\\frac{d${other}}{d\\theta} = ${otherRate} \\ne 0$。满足${condition["zh-CN"]}的根是`,
          ),
          [`\\frac{d${d}}{d\\theta} = ${2 * a}\\cos 2\\theta = 0, \\quad \\theta = ${angle}`],
        ],
        [
          ["Find the point", "求出该点"],
          t("Find $r$ and convert to Cartesian coordinates.", "求出 $r$ 并化为直角坐标。"),
          [`r = ${tex.replace("\\theta", `\\left(${angle}\\right)`)} = ${rt}, \\quad (x, y) = (${point[0]}, ${point[1]})`],
        ],
      ],
      cosine
        ? t(
            `Multiplying $r = ${tex}$ by $r$ gives $x^{2} + y^{2} = ${2 * a}x$, that is, $(x - ${a})^{2} + y^{2} = ${a * a}$: the circle with center $(${a}, 0)$ and radius $${a}$. Its tangents are horizontal at the top and bottom, $(${a}, \\pm ${a})$.`,
            `把 $r = ${tex}$ 两边乘以 $r$ 得 $x^{2} + y^{2} = ${2 * a}x$，即 $(x - ${a})^{2} + y^{2} = ${a * a}$：圆心为 $(${a}, 0)$、半径为 $${a}$ 的圆。它在最高点和最低点 $(${a}, \\pm ${a})$ 处切线水平。`,
          )
        : t(
            `Multiplying $r = ${tex}$ by $r$ gives $x^{2} + y^{2} = ${2 * a}y$, that is, $x^{2} + (y - ${a})^{2} = ${a * a}$: the circle with center $(0, ${a})$ and radius $${a}$. Its tangents are vertical at the leftmost and rightmost points, $(\\pm ${a}, ${a})$.`,
            `把 $r = ${tex}$ 两边乘以 $r$ 得 $x^{2} + y^{2} = ${2 * a}y$，即 $x^{2} + (y - ${a})^{2} = ${a * a}$：圆心为 $(0, ${a})$、半径为 $${a}$ 的圆。它在最左点和最右点 $(\\pm ${a}, ${a})$ 处切线竖直。`,
          ),
    ),
  });
  return withMistakes(problem, [
    {
      response: pointLatex(mirror),
      why: t(
        `This point also has a ${kind.en} tangent, but its ${cosine ? "$y$" : "$x$"}-coordinate has the other sign.`,
        `这个点处切线也是${kind["zh-CN"]}的，但它的 ${cosine ? "$y$" : "$x$"} 坐标符号相反。`,
      ),
    },
    {
      response: pointLatex(far),
      why: t(
        `This is the point farthest from the pole, where $r = ${2 * a}$; the tangent there is ${cosine ? "vertical" : "horizontal"}.`,
        `这是离极点最远的点，$r = ${2 * a}$；那里的切线是${cosine ? "竖直" : "水平"}的。`,
      ),
    },
    {
      response: pointLatex([0, 0]),
      why: t(
        `This is the pole, where the tangent is the ${cosine ? "$y$" : "$x$"}-axis, which is ${cosine ? "vertical" : "horizontal"}.`,
        `这是极点，那里的切线是${cosine ? "竖直的 $y$" : "水平的 $x$"} 轴。`,
      ),
    },
  ]);
}

/** horizontalAndVerticalTangentsToPolarCurves solves dy/dθ = 0 and dx/dθ = 0. */
export const horizontalAndVerticalTangentsToPolarCurves: TopicDef = {
  id: "horizontal-and-vertical-tangents-to-polar-curves",
  title: t("Horizontal and Vertical Tangents to Polar Curves", "极坐标曲线的水平切线与竖直切线"),
  summary: t(
    "A polar curve has a horizontal tangent where dy/dθ = 0 ≠ dx/dθ and a vertical tangent where dx/dθ = 0 ≠ dy/dθ.",
    "极坐标曲线在 dy/dθ = 0 ≠ dx/dθ 处有水平切线，在 dx/dθ = 0 ≠ dy/dθ 处有竖直切线。",
  ),
  intro: t(
    "On the circle $r = 2$, $x = 2\\cos\\theta$ and $y = 2\\sin\\theta$. The rate $\\frac{dy}{d\\theta} = 2\\cos\\theta$ is zero at $\\theta = \\frac{\\pi}{2}$, where $\\frac{dx}{d\\theta} = -2 \\ne 0$, so the slope there is $0$ and the point is $(0, 2)$.\n\nCheck: the circle $x^{2} + y^{2} = 4$ has its top at $(0, 2)$, where the tangent is level.\n\nIn this lesson we find the points of polar curves where the tangent is horizontal, with $\\frac{dy}{d\\theta} = 0$, or vertical, with $\\frac{dx}{d\\theta} = 0$.",
    "在圆 $r = 2$ 上 $x = 2\\cos\\theta$，$y = 2\\sin\\theta$。变化率 $\\frac{dy}{d\\theta} = 2\\cos\\theta$ 在 $\\theta = \\frac{\\pi}{2}$ 处为零，此时 $\\frac{dx}{d\\theta} = -2 \\ne 0$，所以那里斜率为 $0$，点为 $(0, 2)$。\n\n检验：圆 $x^{2} + y^{2} = 4$ 的最高点是 $(0, 2)$，那里切线水平。\n\n这节课我们找出极坐标曲线上切线水平（$\\frac{dy}{d\\theta} = 0$）或竖直（$\\frac{dx}{d\\theta} = 0$）的点。",
  ),
  prerequisites: ["differentiating-curves-given-in-polar-form", "calculating-tangent-and-normal-lines-with-parametric-equations"],
  encompasses: [{ topic: "differentiating-curves-given-in-polar-form", weight: 0.5 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "tangents-to-polar-circles",
      figure: calculusDrawings5["horizontal-and-vertical-tangents-to-polar-curves#tangents-to-polar-circles"],
      title: t("Tangents to polar circles", "极坐标圆的切线"),
      explanation: t(
        "Write $x$ and $y$ in terms of $\\theta$ and set a derivative to zero. For $r = 4\\cos\\theta$: $y = 4\\cos\\theta\\sin\\theta = 2\\sin 2\\theta$, so\n\n$$\\frac{dy}{d\\theta} = 4\\cos 2\\theta = 0, \\quad \\theta = \\pm\\frac{\\pi}{4}$$\n\nThere $r = 2\\sqrt{2}$, and the points are $(2, \\pm 2)$.\n\nCheck: multiplying by $r$ gives $x^{2} + y^{2} = 4x$, that is, $(x - 2)^{2} + y^{2} = 4$. This circle has center $(2, 0)$ and radius $2$, so its top and bottom are $(2, \\pm 2)$.\n\n> **Watch out.** Setting $\\frac{dr}{d\\theta} = 0$ finds where $r$ is largest, here at $\\theta = 0$ and the point $(4, 0)$. The tangent there is vertical, not horizontal.",
        "把 $x$、$y$ 写成 $\\theta$ 的函数，令导数为零。对 $r = 4\\cos\\theta$：$y = 4\\cos\\theta\\sin\\theta = 2\\sin 2\\theta$，所以\n\n$$\\frac{dy}{d\\theta} = 4\\cos 2\\theta = 0, \\quad \\theta = \\pm\\frac{\\pi}{4}$$\n\n此时 $r = 2\\sqrt{2}$，点为 $(2, \\pm 2)$。\n\n检验：两边乘以 $r$ 得 $x^{2} + y^{2} = 4x$，即 $(x - 2)^{2} + y^{2} = 4$。这个圆的圆心为 $(2, 0)$、半径为 $2$，所以最高点和最低点是 $(2, \\pm 2)$。\n\n> **注意。** 令 $\\frac{dr}{d\\theta} = 0$ 求的是 $r$ 最大的位置，这里是 $\\theta = 0$ 处的点 $(4, 0)$。那里的切线是竖直的，不是水平的。",
      ),
      generate: circleTangents,
    },
    {
      id: "tangents-to-cardioids",
      title: t("Tangents to cardioids", "心形线的切线"),
      explanation: t(
        "For $r = a(1 + \\cos\\theta)$:\n\n$$\\frac{dy}{d\\theta} = a(2\\cos\\theta - 1)(\\cos\\theta + 1), \\quad \\frac{dx}{d\\theta} = -a\\sin\\theta(1 + 2\\cos\\theta)$$\n\nHorizontal tangents occur at $\\cos\\theta = \\frac{1}{2}$, vertical ones at $\\sin\\theta = 0$ or $\\cos\\theta = -\\frac{1}{2}$. For $a = 1$, the horizontal tangent with $0 < \\theta < \\pi$ is at $\\theta = \\frac{\\pi}{3}$, where $r = \\frac{3}{2}$.\n\nCheck: substituting $\\theta = \\frac{\\pi}{3}$ into $\\frac{dy}{d\\theta} = \\cos\\theta + \\cos 2\\theta$ gives $\\frac{1}{2} - \\frac{1}{2} = 0$, while $\\frac{dx}{d\\theta} = -\\sqrt{3} \\ne 0$.\n\n> **Watch out.** At $\\theta = \\pi$ both derivatives vanish. That is the cusp at the pole, not a horizontal tangent: check that the other rate is not zero before naming a tangent horizontal or vertical.",
        "对 $r = a(1 + \\cos\\theta)$：\n\n$$\\frac{dy}{d\\theta} = a(2\\cos\\theta - 1)(\\cos\\theta + 1), \\quad \\frac{dx}{d\\theta} = -a\\sin\\theta(1 + 2\\cos\\theta)$$\n\n水平切线在 $\\cos\\theta = \\frac{1}{2}$ 处，竖直切线在 $\\sin\\theta = 0$ 或 $\\cos\\theta = -\\frac{1}{2}$ 处。取 $a = 1$，$0 < \\theta < \\pi$ 中的水平切线在 $\\theta = \\frac{\\pi}{3}$ 处，此时 $r = \\frac{3}{2}$。\n\n检验：把 $\\theta = \\frac{\\pi}{3}$ 代入 $\\frac{dy}{d\\theta} = \\cos\\theta + \\cos 2\\theta$ 得 $\\frac{1}{2} - \\frac{1}{2} = 0$，而 $\\frac{dx}{d\\theta} = -\\sqrt{3} \\ne 0$。\n\n> **注意。** 在 $\\theta = \\pi$ 处两个导数都为零。那是极点处的尖点，不是水平切线：判定切线水平或竖直之前，先确认另一个变化率不为零。",
      ),
      generate: cardioidTangents,
    },
  ],
};

/** PoleSlip names a kind of wrong slope at the pole. */
type PoleSlip = "sign" | "cot" | "flat" | "rate";

/** poleSlips says what each kind of wrong slope at the pole gets wrong. */
const poleSlips: Readonly<Record<PoleSlip, Text>> = {
  sign: t(
    "The sign is wrong: work out $\\tan\\theta_{0} = \\frac{\\sin\\theta_{0}}{\\cos\\theta_{0}}$ with the signs of sine and cosine at that angle.",
    "符号错了：用该角处正弦和余弦的符号算出 $\\tan\\theta_{0} = \\frac{\\sin\\theta_{0}}{\\cos\\theta_{0}}$。",
  ),
  cot: t(
    "This is $\\cot\\theta_{0} = \\frac{\\cos\\theta_{0}}{\\sin\\theta_{0}}$, upside down: the line $\\theta = \\theta_{0}$ rises $\\sin\\theta_{0}$ for each $\\cos\\theta_{0}$ across.",
    "这是 $\\cot\\theta_{0} = \\frac{\\cos\\theta_{0}}{\\sin\\theta_{0}}$，上下颠倒了：直线 $\\theta = \\theta_{0}$ 每横向走 $\\cos\\theta_{0}$ 就上升 $\\sin\\theta_{0}$。",
  ),
  flat: t(
    "A slope of $0$ means a horizontal tangent. At the pole the tangent is the line $\\theta = \\theta_{0}$, which is not horizontal here.",
    "斜率为 $0$ 表示切线水平。在极点处切线是直线 $\\theta = \\theta_{0}$，这里它不是水平的。",
  ),
  rate: t(
    "This is the derivative of the trigonometric part of $r$ at $\\theta_{0}$, a rate of change of $r$, not a slope.",
    "这是 $r$ 中三角函数部分在 $\\theta_{0}$ 处的导数，是 $r$ 的变化率，不是斜率。",
  ),
};

/** PoleCase is a polar curve through the pole at θ₀, with the slope tan θ₀ there. */
interface PoleCase {
  readonly tex: (a: number) => string;
  readonly angle: string;
  /** zero substitutes θ₀ into r. */
  readonly zero: (a: number) => string;
  /** dr writes r′; rate is its value at θ₀. */
  readonly dr: (a: number) => string;
  readonly rate: (a: number) => string;
  readonly cos: string;
  readonly sin: string;
  readonly slope: string;
  readonly wrong: readonly (readonly [string, PoleSlip])[];
}

/** poleCases are limaçons and roses that pass through the pole with r′ ≠ 0. */
const poleCases: readonly PoleCase[] = [
  {
    tex: (a) => `${k1(a)}(1 + 2\\cos\\theta)`,
    angle: "\\frac{2\\pi}{3}",
    zero: (a) => `${k1(a)}\\left(1 + 2\\cos\\frac{2\\pi}{3}\\right) = ${k1(a)}(1 - 1) = 0`,
    dr: (a) => `-${2 * a}\\sin\\theta`,
    rate: (a) => rootTimes(Q.of(-a), 3, ""),
    cos: "-\\frac{1}{2}",
    sin: "\\frac{\\sqrt{3}}{2}",
    slope: "-\\sqrt{3}",
    wrong: [
      ["\\sqrt{3}", "sign"],
      ["-\\frac{\\sqrt{3}}{3}", "cot"],
      ["0", "flat"],
    ],
  },
  {
    tex: (a) => `${k1(a)}(1 - 2\\cos\\theta)`,
    angle: "\\frac{\\pi}{3}",
    zero: (a) => `${k1(a)}\\left(1 - 2\\cos\\frac{\\pi}{3}\\right) = ${k1(a)}(1 - 1) = 0`,
    dr: (a) => `${2 * a}\\sin\\theta`,
    rate: (a) => rootTimes(Q.of(a), 3, ""),
    cos: "\\frac{1}{2}",
    sin: "\\frac{\\sqrt{3}}{2}",
    slope: "\\sqrt{3}",
    wrong: [
      ["-\\sqrt{3}", "sign"],
      ["\\frac{\\sqrt{3}}{3}", "cot"],
      ["0", "flat"],
    ],
  },
  {
    tex: (a) => `${k1(a)}(1 - 2\\sin\\theta)`,
    angle: "\\frac{\\pi}{6}",
    zero: (a) => `${k1(a)}\\left(1 - 2\\sin\\frac{\\pi}{6}\\right) = ${k1(a)}(1 - 1) = 0`,
    dr: (a) => `-${2 * a}\\cos\\theta`,
    rate: (a) => rootTimes(Q.of(-a), 3, ""),
    cos: "\\frac{\\sqrt{3}}{2}",
    sin: "\\frac{1}{2}",
    slope: "\\frac{\\sqrt{3}}{3}",
    wrong: [
      ["\\sqrt{3}", "cot"],
      ["-\\frac{\\sqrt{3}}{3}", "sign"],
      ["0", "flat"],
    ],
  },
  {
    tex: (a) => `${k1(a)}(1 + 2\\sin\\theta)`,
    angle: "\\frac{7\\pi}{6}",
    zero: (a) => `${k1(a)}\\left(1 + 2\\sin\\frac{7\\pi}{6}\\right) = ${k1(a)}(1 - 1) = 0`,
    dr: (a) => `${2 * a}\\cos\\theta`,
    rate: (a) => rootTimes(Q.of(-a), 3, ""),
    cos: "-\\frac{\\sqrt{3}}{2}",
    sin: "-\\frac{1}{2}",
    slope: "\\frac{\\sqrt{3}}{3}",
    wrong: [
      ["-\\frac{\\sqrt{3}}{3}", "sign"],
      ["\\sqrt{3}", "cot"],
      ["0", "flat"],
    ],
  },
  {
    tex: (a) => `${k1(a)}\\cos 2\\theta`,
    angle: "\\frac{\\pi}{4}",
    zero: (a) => `${k1(a)}\\cos\\frac{\\pi}{2} = 0`,
    dr: (a) => `-${2 * a}\\sin 2\\theta`,
    rate: (a) => `${-2 * a}`,
    cos: "\\frac{\\sqrt{2}}{2}",
    sin: "\\frac{\\sqrt{2}}{2}",
    slope: "1",
    wrong: [
      ["-1", "sign"],
      ["0", "flat"],
      ["-2", "rate"],
    ],
  },
  {
    tex: (a) => `${k1(a)}\\cos 2\\theta`,
    angle: "\\frac{3\\pi}{4}",
    zero: (a) => `${k1(a)}\\cos\\frac{3\\pi}{2} = 0`,
    dr: (a) => `-${2 * a}\\sin 2\\theta`,
    rate: (a) => `${2 * a}`,
    cos: "-\\frac{\\sqrt{2}}{2}",
    sin: "\\frac{\\sqrt{2}}{2}",
    slope: "-1",
    wrong: [
      ["1", "sign"],
      ["0", "flat"],
      ["2", "rate"],
    ],
  },
  {
    tex: (a) => `${k1(a)}\\sin 3\\theta`,
    angle: "\\frac{\\pi}{3}",
    zero: (a) => `${k1(a)}\\sin\\pi = 0`,
    dr: (a) => `${3 * a}\\cos 3\\theta`,
    rate: (a) => `${-3 * a}`,
    cos: "\\frac{1}{2}",
    sin: "\\frac{\\sqrt{3}}{2}",
    slope: "\\sqrt{3}",
    wrong: [
      ["-\\sqrt{3}", "sign"],
      ["\\frac{\\sqrt{3}}{3}", "cot"],
      ["0", "flat"],
    ],
  },
  {
    tex: (a) => `${k1(a)}\\cos 3\\theta`,
    angle: "\\frac{\\pi}{6}",
    zero: (a) => `${k1(a)}\\cos\\frac{\\pi}{2} = 0`,
    dr: (a) => `-${3 * a}\\sin 3\\theta`,
    rate: (a) => `${-3 * a}`,
    cos: "\\frac{\\sqrt{3}}{2}",
    sin: "\\frac{1}{2}",
    slope: "\\frac{\\sqrt{3}}{3}",
    wrong: [
      ["\\sqrt{3}", "cot"],
      ["-\\frac{\\sqrt{3}}{3}", "sign"],
      ["0", "flat"],
    ],
  },
  {
    tex: (a) => `${k1(a)}\\sin 3\\theta`,
    angle: "\\frac{2\\pi}{3}",
    zero: (a) => `${k1(a)}\\sin 2\\pi = 0`,
    dr: (a) => `${3 * a}\\cos 3\\theta`,
    rate: (a) => `${3 * a}`,
    cos: "-\\frac{1}{2}",
    sin: "\\frac{\\sqrt{3}}{2}",
    slope: "-\\sqrt{3}",
    wrong: [
      ["\\sqrt{3}", "sign"],
      ["-\\frac{\\sqrt{3}}{3}", "cot"],
      ["0", "flat"],
    ],
  },
  {
    tex: (a) => `${k1(a)}\\cos 3\\theta`,
    angle: "\\frac{5\\pi}{6}",
    zero: (a) => `${k1(a)}\\cos\\frac{5\\pi}{2} = 0`,
    dr: (a) => `-${3 * a}\\sin 3\\theta`,
    rate: (a) => `${-3 * a}`,
    cos: "-\\frac{\\sqrt{3}}{2}",
    sin: "\\frac{1}{2}",
    slope: "-\\frac{\\sqrt{3}}{3}",
    wrong: [
      ["\\frac{\\sqrt{3}}{3}", "sign"],
      ["-\\sqrt{3}", "cot"],
      ["0", "flat"],
    ],
  },
];

/** slopeAtThePole finds the slope of a polar curve where it passes through the pole. */
function slopeAtThePole(rng: Rng) {
  const c = rng.pick(poleCases);
  const a = rng.int(1, 6);
  return exactWorked(
    t(
      `The polar curve $r = ${c.tex(a)}$ passes through the pole at $\\theta = ${c.angle}$. Find the slope of its tangent line there. Give an exact answer.`,
      `极坐标曲线 $r = ${c.tex(a)}$ 在 $\\theta = ${c.angle}$ 处经过极点。求该处切线的斜率，给出精确值。`,
    ),
    c.slope,
    [
      [
        ["Confirm r = 0 and r′ ≠ 0", "确认 r = 0 且 r′ ≠ 0"],
        t(
          `Substitute $\\theta = ${c.angle}$ into $r$ and into $r' = ${c.dr(a)}$:`,
          `把 $\\theta = ${c.angle}$ 代入 $r$ 和 $r' = ${c.dr(a)}$：`,
        ),
        [`r = ${c.zero(a)}, \\quad r' = ${c.rate(a)}`],
      ],
      [
        ["Simplify the slope formula", "化简斜率公式"],
        t(
          `With $r = 0$ the terms with $r$ drop out, and the nonzero $r'$ cancels, leaving the slope of the line $\\theta = ${c.angle}$:`,
          `$r = 0$ 时含 $r$ 的项消失，非零的 $r'$ 约去，剩下直线 $\\theta = ${c.angle}$ 的斜率：`,
        ),
        [`\\frac{dy}{dx} = \\frac{r'\\sin\\theta}{r'\\cos\\theta} = \\tan ${c.angle} = ${c.slope}`],
      ],
    ],
    t(
      `Use the full formula without cancelling. At $\\theta = ${c.angle}$,\n\n$$\\frac{dx}{d\\theta} = r'\\cos\\theta = (${c.rate(a)})\\left(${c.cos}\\right), \\quad \\frac{dy}{d\\theta} = r'\\sin\\theta = (${c.rate(a)})\\left(${c.sin}\\right)$$\n\nNeither is zero, and their quotient is\n\n$$\\frac{${c.sin}}{${c.cos}} = ${c.slope}$$`,
      `不约分，直接用完整公式。在 $\\theta = ${c.angle}$ 处，\n\n$$\\frac{dx}{d\\theta} = r'\\cos\\theta = (${c.rate(a)})\\left(${c.cos}\\right), \\quad \\frac{dy}{d\\theta} = r'\\sin\\theta = (${c.rate(a)})\\left(${c.sin}\\right)$$\n\n两者都不为零，它们的商为\n\n$$\\frac{${c.sin}}{${c.cos}} = ${c.slope}$$`,
    ),
    c.wrong.map(([w, kind]) => ({ response: w, why: poleSlips[kind] })),
  );
}

/** CuspCase is a curve through the pole at θ₀ and the tangent line there. */
interface CuspCase {
  readonly tex: (a: number) => string;
  readonly angle: string;
  readonly line: number;
  readonly cusp: boolean;
  /** zero substitutes θ₀ into r; rate substitutes it into r′. */
  readonly zero: (a: number) => string;
  readonly rate: (a: number) => string;
  /** ray writes the point at distance r along the ray θ = θ₀. */
  readonly ray: string;
}

/** lines are the four lines through the origin that tangents at the pole take here. */
const lines: readonly Text[] = [
  t("$y = 0$ (the $x$-axis)", "$y = 0$（$x$ 轴）"),
  t("$x = 0$ (the $y$-axis)", "$x = 0$（$y$ 轴）"),
  t("$y = x$", "$y = x$"),
  t("$y = -x$", "$y = -x$"),
];

/** lineEquations are the equations of the lines, and lineAngles the angles of their rays. */
const lineEquations = ["y = 0", "x = 0", "y = x", "y = -x"];
const lineAngles = ["\\theta = 0", "\\theta = \\frac{\\pi}{2}", "\\theta = \\frac{\\pi}{4}", "\\theta = \\frac{3\\pi}{4}"];

/** cuspCases are cardioids at their cusps and roses at the pole. */
const cuspCases: readonly CuspCase[] = [
  {
    tex: (a) => `${k1(a)}(1 + \\cos\\theta)`,
    angle: "\\pi",
    line: 0,
    cusp: true,
    zero: (a) => `${k1(a)}(1 + \\cos\\pi) = 0`,
    rate: (a) => `-${k1(a)}\\sin\\pi = 0`,
    ray: "(-r, 0)",
  },
  {
    tex: (a) => `${k1(a)}(1 - \\cos\\theta)`,
    angle: "0",
    line: 0,
    cusp: true,
    zero: (a) => `${k1(a)}(1 - \\cos 0) = 0`,
    rate: (a) => `${k1(a)}\\sin 0 = 0`,
    ray: "(r, 0)",
  },
  {
    tex: (a) => `${k1(a)}(1 + \\sin\\theta)`,
    angle: "\\frac{3\\pi}{2}",
    line: 1,
    cusp: true,
    zero: (a) => `${k1(a)}\\left(1 + \\sin\\frac{3\\pi}{2}\\right) = 0`,
    rate: (a) => `${k1(a)}\\cos\\frac{3\\pi}{2} = 0`,
    ray: "(0, -r)",
  },
  {
    tex: (a) => `${k1(a)}(1 - \\sin\\theta)`,
    angle: "\\frac{\\pi}{2}",
    line: 1,
    cusp: true,
    zero: (a) => `${k1(a)}\\left(1 - \\sin\\frac{\\pi}{2}\\right) = 0`,
    rate: (a) => `-${k1(a)}\\cos\\frac{\\pi}{2} = 0`,
    ray: "(0, r)",
  },
  {
    tex: (a) => `${k1(a)}\\sin 2\\theta`,
    angle: "\\frac{\\pi}{2}",
    line: 1,
    cusp: false,
    zero: (a) => `${k1(a)}\\sin\\pi = 0`,
    rate: (a) => `${2 * a}\\cos\\pi = ${-2 * a}`,
    ray: "(0, r)",
  },
  {
    tex: (a) => `${k1(a)}\\sin 2\\theta`,
    angle: "\\pi",
    line: 0,
    cusp: false,
    zero: (a) => `${k1(a)}\\sin 2\\pi = 0`,
    rate: (a) => `${2 * a}\\cos 2\\pi = ${2 * a}`,
    ray: "(-r, 0)",
  },
  {
    tex: (a) => `${k1(a)}\\cos 2\\theta`,
    angle: "\\frac{\\pi}{4}",
    line: 2,
    cusp: false,
    zero: (a) => `${k1(a)}\\cos\\frac{\\pi}{2} = 0`,
    rate: (a) => `-${2 * a}\\sin\\frac{\\pi}{2} = ${-2 * a}`,
    ray: "\\left(\\frac{\\sqrt{2}}{2}r, \\frac{\\sqrt{2}}{2}r\\right)",
  },
  {
    tex: (a) => `${k1(a)}\\cos 2\\theta`,
    angle: "\\frac{5\\pi}{4}",
    line: 2,
    cusp: false,
    zero: (a) => `${k1(a)}\\cos\\frac{5\\pi}{2} = 0`,
    rate: (a) => `-${2 * a}\\sin\\frac{5\\pi}{2} = ${-2 * a}`,
    ray: "\\left(-\\frac{\\sqrt{2}}{2}r, -\\frac{\\sqrt{2}}{2}r\\right)",
  },
  {
    tex: (a) => `${k1(a)}\\cos 2\\theta`,
    angle: "\\frac{3\\pi}{4}",
    line: 3,
    cusp: false,
    zero: (a) => `${k1(a)}\\cos\\frac{3\\pi}{2} = 0`,
    rate: (a) => `-${2 * a}\\sin\\frac{3\\pi}{2} = ${2 * a}`,
    ray: "\\left(-\\frac{\\sqrt{2}}{2}r, \\frac{\\sqrt{2}}{2}r\\right)",
  },
];

/** tangentAtThePole identifies the tangent line at the pole, including at cusps where dx/dθ = dy/dθ = 0. */
function tangentAtThePole(rng: Rng) {
  const c = rng.pick(cuspCases);
  const a = rng.int(1, 6);
  const right = lines[c.line]!;
  const reason = c.cusp
    ? t(
        `Here $r' = 0$ too, so both $\\frac{dx}{d\\theta}$ and $\\frac{dy}{d\\theta}$ are $0$ and the slope formula gives $\\frac{0}{0}$: the curve has a cusp. Points near the pole still have $\\theta$ near $${c.angle}$, so the curve comes into the pole along the line $\\theta = ${c.angle}$.`,
        `这里 $r' = 0$ 也成立，所以 $\\frac{dx}{d\\theta}$ 与 $\\frac{dy}{d\\theta}$ 都为 $0$，斜率公式给出 $\\frac{0}{0}$：曲线在这里有尖点。极点附近的点的 $\\theta$ 仍接近 $${c.angle}$，所以曲线沿直线 $\\theta = ${c.angle}$ 进入极点。`,
      )
    : t(
        `Here $r' \\ne 0$, so the slope is $\\frac{r'\\sin\\theta}{r'\\cos\\theta} = \\tan\\theta$ and the tangent is the line $\\theta = ${c.angle}$.`,
        `这里 $r' \\ne 0$，所以斜率为 $\\frac{r'\\sin\\theta}{r'\\cos\\theta} = \\tan\\theta$，切线就是直线 $\\theta = ${c.angle}$。`,
      );
  return explainedChoice(rng, {
    prompt: t(
      `The polar curve $r = ${c.tex(a)}$ passes through the pole at $\\theta = ${c.angle}$. Which line is tangent to the curve there?`,
      `极坐标曲线 $r = ${c.tex(a)}$ 在 $\\theta = ${c.angle}$ 处经过极点。哪条直线是该处的切线？`,
    ),
    correct: right,
    wrong: lines
      .map((l, i) => ({ l, i }))
      .filter(({ i }) => i !== c.line)
      .map(({ l, i }) => ({
        option: l,
        why: t(
          `This is the line along $${lineAngles[i]}$, but the curve reaches the pole along $\\theta = ${c.angle}$.`,
          `这是沿 $${lineAngles[i]}$ 的直线，但曲线是沿 $\\theta = ${c.angle}$ 到达极点的。`,
        ),
      })),
    solution: walked(
      [
        [
          ["Find where r = 0", "找出 r = 0 处"],
          t(`Substitute $\\theta = ${c.angle}$:`, `代入 $\\theta = ${c.angle}$：`),
          [`r = ${c.zero(a)}, \\quad r' = ${c.rate(a)}`],
        ],
        [["Find the direction", "确定方向"], reason],
        [
          ["Name the line", "写出直线"],
          t(
            `The line $\\theta = ${c.angle}$ through the pole is ${right.en}.`,
            `经过极点的直线 $\\theta = ${c.angle}$ 是${right["zh-CN"]}。`,
          ),
        ],
      ],
      t(
        `The point at distance $r$ along the ray $\\theta = ${c.angle}$ is\n\n$$(r\\cos\\theta, r\\sin\\theta) = ${c.ray}$$\n\nEvery such point satisfies $${lineEquations[c.line]}$.`,
        `射线 $\\theta = ${c.angle}$ 上距极点 $r$ 的点为\n\n$$(r\\cos\\theta, r\\sin\\theta) = ${c.ray}$$\n\n这些点都满足 $${lineEquations[c.line]}$。`,
      ),
    ),
  });
}

/** horizontalAndVerticalTangentsToPolarCurvesInNonDifferentiableCases treats tangents at the pole. */
export const horizontalAndVerticalTangentsToPolarCurvesInNonDifferentiableCases: TopicDef = {
  id: "horizontal-and-vertical-tangents-to-polar-curves-in-non-differentiable-cases",
  title: t("Horizontal and Vertical Tangents to Polar Curves in Non-Differentiable Cases", "不可导情形下极坐标曲线的水平与竖直切线"),
  summary: t(
    "Where a polar curve passes through the pole at θ₀, its tangent is the line θ = θ₀, even at a cusp where dx/dθ = dy/dθ = 0.",
    "极坐标曲线在 θ₀ 处经过极点时，切线是直线 θ = θ₀，即使在 dx/dθ = dy/dθ = 0 的尖点处也是如此。",
  ),
  intro: t(
    "The circle $r = 2\\cos\\theta$ passes through the pole at $\\theta = \\frac{\\pi}{2}$. There $r = 0$ and $r' = -2\\sin\\theta = -2$, so\n\n$$\\frac{dx}{d\\theta} = r'\\cos\\theta - r\\sin\\theta = 0, \\quad \\frac{dy}{d\\theta} = r'\\sin\\theta + r\\cos\\theta = -2$$\n\nThe tangent is vertical: it is the $y$-axis.\n\nCheck: the circle is $(x - 1)^{2} + y^{2} = 1$, and the origin is its leftmost point, where the tangent is vertical.\n\nIn this lesson we find tangents where a curve passes through the pole, including cusps where the slope formula gives $\\frac{0}{0}$.",
    "圆 $r = 2\\cos\\theta$ 在 $\\theta = \\frac{\\pi}{2}$ 处经过极点。此时 $r = 0$，$r' = -2\\sin\\theta = -2$，所以\n\n$$\\frac{dx}{d\\theta} = r'\\cos\\theta - r\\sin\\theta = 0, \\quad \\frac{dy}{d\\theta} = r'\\sin\\theta + r\\cos\\theta = -2$$\n\n切线竖直，就是 $y$ 轴。\n\n检验：这个圆是 $(x - 1)^{2} + y^{2} = 1$，原点是它最左边的点，那里切线竖直。\n\n这节课我们求曲线经过极点处的切线，包括斜率公式给出 $\\frac{0}{0}$ 的尖点。",
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
        "If $r(\\theta_{0}) = 0$ and $r'(\\theta_{0}) \\ne 0$, the slope formula reduces to\n\n$$\\frac{dy}{dx} = \\frac{r'\\sin\\theta_{0}}{r'\\cos\\theta_{0}} = \\tan\\theta_{0}$$\n\nThe curve leaves the pole along the line $\\theta = \\theta_{0}$. For $r = 1 + 2\\cos\\theta$, $r = 0$ at $\\theta = \\frac{2\\pi}{3}$, so the tangent there has slope $\\tan\\frac{2\\pi}{3} = -\\sqrt{3}$.\n\nCheck: without cancelling, $r' = -2\\sin\\frac{2\\pi}{3} = -\\sqrt{3}$, so $\\frac{dx}{d\\theta} = (-\\sqrt{3})\\left(-\\frac{1}{2}\\right)$ and $\\frac{dy}{d\\theta} = (-\\sqrt{3})\\left(\\frac{\\sqrt{3}}{2}\\right)$. Their quotient is\n\n$$\\frac{-\\frac{3}{2}}{\\frac{\\sqrt{3}}{2}} = -\\sqrt{3}$$\n\n> **Watch out.** The slope is $\\tan\\theta_{0}$, not $\\cot\\theta_{0}$: the line $\\theta = \\theta_{0}$ rises $\\sin\\theta_{0}$ for each $\\cos\\theta_{0}$ across. Here $\\cot\\frac{2\\pi}{3} = -\\frac{\\sqrt{3}}{3}$ would be wrong.",
        "若 $r(\\theta_{0}) = 0$ 且 $r'(\\theta_{0}) \\ne 0$，斜率公式化为\n\n$$\\frac{dy}{dx} = \\frac{r'\\sin\\theta_{0}}{r'\\cos\\theta_{0}} = \\tan\\theta_{0}$$\n\n曲线沿直线 $\\theta = \\theta_{0}$ 离开极点。对 $r = 1 + 2\\cos\\theta$，在 $\\theta = \\frac{2\\pi}{3}$ 处 $r = 0$，所以该处切线斜率为 $\\tan\\frac{2\\pi}{3} = -\\sqrt{3}$。\n\n检验：不约分，$r' = -2\\sin\\frac{2\\pi}{3} = -\\sqrt{3}$，所以 $\\frac{dx}{d\\theta} = (-\\sqrt{3})\\left(-\\frac{1}{2}\\right)$，$\\frac{dy}{d\\theta} = (-\\sqrt{3})\\left(\\frac{\\sqrt{3}}{2}\\right)$。它们的商为\n\n$$\\frac{-\\frac{3}{2}}{\\frac{\\sqrt{3}}{2}} = -\\sqrt{3}$$\n\n> **注意。** 斜率是 $\\tan\\theta_{0}$，不是 $\\cot\\theta_{0}$：直线 $\\theta = \\theta_{0}$ 每横向走 $\\cos\\theta_{0}$ 就上升 $\\sin\\theta_{0}$。这里写成 $\\cot\\frac{2\\pi}{3} = -\\frac{\\sqrt{3}}{3}$ 就错了。",
      ),
      generate: slopeAtThePole,
    },
    {
      id: "tangents-at-cusps",
      title: t("Tangents at cusps", "尖点处的切线"),
      explanation: t(
        "If $r$ and $r'$ are both zero at $\\theta_{0}$, then $\\frac{dx}{d\\theta} = \\frac{dy}{d\\theta} = 0$ and the slope formula is $\\frac{0}{0}$: the curve is not smooth there. Every point near the pole still lies on a ray close to $\\theta = \\theta_{0}$, so the curve approaches the pole along that line. The cardioid $r = 1 + \\cos\\theta$ reaches the pole at $\\theta = \\pi$ with a cusp whose tangent is the $x$-axis.\n\nCheck: $1 + \\cos\\pi = 0$ and $r' = -\\sin\\pi = 0$. The point at distance $r$ along the ray $\\theta = \\pi$ is $(-r, 0)$, which lies on the $x$-axis for every $r$.\n\n> **Watch out.** At a cusp the formula gives $\\frac{0}{0}$, which is not a slope of $0$. The tangent is the line $\\theta = \\theta_{0}$ in whatever direction that points: for $r = 1 + \\sin\\theta$ the cusp at $\\theta = \\frac{3\\pi}{2}$ has a vertical tangent.",
        "若在 $\\theta_{0}$ 处 $r$ 与 $r'$ 都为零，则 $\\frac{dx}{d\\theta} = \\frac{dy}{d\\theta} = 0$，斜率公式成为 $\\frac{0}{0}$：曲线在该处不光滑。但极点附近的每个点仍位于接近 $\\theta = \\theta_{0}$ 的射线上，所以曲线沿这条直线趋近极点。心形线 $r = 1 + \\cos\\theta$ 在 $\\theta = \\pi$ 处到达极点，形成尖点，切线是 $x$ 轴。\n\n检验：$1 + \\cos\\pi = 0$，$r' = -\\sin\\pi = 0$。射线 $\\theta = \\pi$ 上距极点 $r$ 的点为 $(-r, 0)$，无论 $r$ 多大都在 $x$ 轴上。\n\n> **注意。** 在尖点处公式给出 $\\frac{0}{0}$，这不是斜率为 $0$。切线是直线 $\\theta = \\theta_{0}$，它指向哪个方向就是哪个方向：$r = 1 + \\sin\\theta$ 在 $\\theta = \\frac{3\\pi}{2}$ 处的尖点切线是竖直的。",
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
    const intercept = (k: Q) => Q.of(y0).sub(k.mul(Q.of(x0)));
    const line = (k: Q) => lineL(k, intercept(k));
    const answer = line(m);
    const b = intercept(m);
    const name = normal ? t("normal", "法线") : t("tangent", "切线");
    const check = expanded(curve, angle, c, s);
    const through = `\\left(${m.toLatex()}\\right)\\left(${x0}\\right)${pm(b)} = ${y0}`;
    const mistakes: Said[] = [
      say(
        line(normal ? slope : other),
        normal
          ? "This is the tangent line; the normal has slope $-\\frac{1}{m}$."
          : "This is the normal line, perpendicular to the tangent.",
        normal ? "这是切线；法线的斜率为 $-\\frac{1}{m}$。" : "这是与切线垂直的法线。",
      ),
      say(
        line(Q.of(dr)),
        "This uses $r'$ as the slope; the slope is $\\frac{dy/d\\theta}{dx/d\\theta}$.",
        "这里把 $r'$ 当作斜率；斜率是 $\\frac{dy/d\\theta}{dx/d\\theta}$。",
      ),
      say(
        lineL(m, Q.zero),
        "This line passes through the origin, not through the point of the curve.",
        "这条直线经过原点，而不是曲线上的那个点。",
      ),
      say(
        line(Q.of(dx, dy)),
        normal
          ? "This uses $\\frac{1}{m}$; the normal slope is $-\\frac{1}{m}$, with a minus sign."
          : "This uses $\\frac{dx/d\\theta}{dy/d\\theta}$, the slope upside down.",
        normal
          ? "这里用了 $\\frac{1}{m}$；法线斜率是 $-\\frac{1}{m}$，带负号。"
          : "这里用了 $\\frac{dx/d\\theta}{dy/d\\theta}$，斜率上下颠倒了。",
      ),
    ];
    return functionWith(
      {
        prompt: t(
          `Find the equation of the ${name.en} line to the polar curve $r = ${curve.tex}$ at $\\theta = ${angle}$. Write it as $y = mx + b$ and enter the right side.`,
          `求极坐标曲线 $r = ${curve.tex}$ 在 $\\theta = ${angle}$ 处的${name["zh-CN"]}方程。写成 $y = mx + b$，填写等号右边。`,
        ),
        prefix: "y =",
        answer,
        solution: walked(
          [
            [
              ["Find the point", "求出该点"],
              t(`At $\\theta = ${angle}$, $r = ${r}$, so`, `在 $\\theta = ${angle}$ 处 $r = ${r}$，所以`),
              [`(x_{0}, y_{0}) = (r\\cos\\theta, r\\sin\\theta) = (${x0}, ${y0})`],
            ],
            [
              ["Find the slope", "求斜率"],
              t(`With $r' = ${curve.dr} = ${dr}$ there, the product rule gives`, `该处 $r' = ${curve.dr} = ${dr}$，由乘积法则`),
              [`\\frac{dx}{d\\theta} = ${dx}, \\quad \\frac{dy}{d\\theta} = ${dy}, \\quad \\frac{dy}{dx} = ${slope.toLatex()}`],
            ],
            ...(normal
              ? [
                  [
                    ["Turn it a quarter turn", "转成法线斜率"],
                    t("The normal is perpendicular to the tangent.", "法线与切线垂直。"),
                    [
                      slope.eq(Q.one) || slope.eq(Q.of(-1))
                        ? `m_{\\text{tangent}} = ${slope.toLatex()}, \\quad m = -\\frac{1}{m_{\\text{tangent}}} = ${other.toLatex()}`
                        : `m = -\\frac{1}{${inP(slope)}} = ${other.toLatex()}`,
                    ],
                  ] satisfies Step,
                ]
              : []),
            [
              ["Write the line", "写出直线"],
              t("Find the intercept from the point.", "由该点求截距。"),
              [`b = y_{0} - mx_{0} = ${y0} - \\left(${m.toLatex()}\\right)\\left(${x0}\\right) = ${b.toLatex()}`, `y = ${answer}`],
            ],
          ],
          normal
            ? t(
                `At $x = ${x0}$ the line gives\n\n$$${through}$$\n\nSo it passes through the point. Its slope times the tangent slope is\n\n$$\\left(${other.toLatex()}\\right)\\left(${slope.toLatex()}\\right) = -1$$\n\nSo the two are perpendicular.`,
                `在 $x = ${x0}$ 处直线给出\n\n$$${through}$$\n\n所以它经过该点。它的斜率与切线斜率之积为\n\n$$\\left(${other.toLatex()}\\right)\\left(${slope.toLatex()}\\right) = -1$$\n\n所以两者垂直。`,
              )
            : t(
                `At $x = ${x0}$ the line gives\n\n$$${through}$$\n\nSo it passes through the point. For the slope, ${check.en.charAt(0).toLowerCase()}${check.en.slice(1)} Their quotient is the slope $${slope.toLatex()}$ again.`,
                `在 $x = ${x0}$ 处直线给出\n\n$$${through}$$\n\n所以它经过该点。再检验斜率：${check["zh-CN"]}二者之商仍是斜率 $${slope.toLatex()}$。`,
              ),
        ),
      },
      mistakes,
    );
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
  intro: t(
    "On the circle $r = 2$ at $\\theta = \\frac{\\pi}{4}$, the point is $(\\sqrt{2}, \\sqrt{2})$ and the slope is $-1$. The tangent line is $y - \\sqrt{2} = -(x - \\sqrt{2})$, that is,\n\n$$y = -x + 2\\sqrt{2}$$\n\nCheck: a tangent to a circle is perpendicular to the radius. The radius to $(\\sqrt{2}, \\sqrt{2})$ has slope $1$, and $1 \\times (-1) = -1$. The line $x + y = 2\\sqrt{2}$ is also at distance $\\frac{2\\sqrt{2}}{\\sqrt{2}} = 2$ from the origin, the radius.\n\nIn this lesson we write tangent and normal lines to polar curves in the form $y = mx + b$.",
    "在圆 $r = 2$ 上 $\\theta = \\frac{\\pi}{4}$ 处，点为 $(\\sqrt{2}, \\sqrt{2})$，斜率为 $-1$。切线为 $y - \\sqrt{2} = -(x - \\sqrt{2})$，即\n\n$$y = -x + 2\\sqrt{2}$$\n\n检验：圆的切线与半径垂直。到 $(\\sqrt{2}, \\sqrt{2})$ 的半径斜率为 $1$，而 $1 \\times (-1) = -1$。直线 $x + y = 2\\sqrt{2}$ 到原点的距离为 $\\frac{2\\sqrt{2}}{\\sqrt{2}} = 2$，正是半径。\n\n这节课我们把极坐标曲线的切线和法线写成 $y = mx + b$ 的形式。",
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
        "Convert the point to Cartesian coordinates, $(x_{0}, y_{0}) = (r\\cos\\theta_{0}, r\\sin\\theta_{0})$, find the slope $m$ from the polar slope formula, and write $y - y_{0} = m(x - x_{0})$. For $r = 2 + \\sin\\theta$ at $\\theta = 0$: the point is $(2, 0)$, $r' = 1$, $\\frac{dx}{d\\theta} = 1$ and $\\frac{dy}{d\\theta} = 2$, so the tangent is $y = 2x - 4$.\n\nCheck: multiplied out, $x = 2\\cos\\theta + \\sin\\theta\\cos\\theta$ and $y = 2\\sin\\theta + \\sin^{2}\\theta$, so\n\n$$\\frac{dx}{d\\theta} = -2\\sin\\theta + \\cos 2\\theta, \\quad \\frac{dy}{d\\theta} = 2\\cos\\theta + 2\\sin\\theta\\cos\\theta$$\n\nAt $\\theta = 0$ these are $1$ and $2$, and the line $y = 2x - 4$ gives $y = 0$ at $x = 2$.\n\n> **Watch out.** Use the Cartesian point $(r\\cos\\theta_{0}, r\\sin\\theta_{0})$, not $(r, \\theta_{0})$. Here they happen to agree, but at $\\theta_{0} = \\frac{\\pi}{2}$ the point is $(0, 3)$, not $\\left(3, \\frac{\\pi}{2}\\right)$.",
        "先把点化为直角坐标 $(x_{0}, y_{0}) = (r\\cos\\theta_{0}, r\\sin\\theta_{0})$，再由极坐标斜率公式求出斜率 $m$，写出 $y - y_{0} = m(x - x_{0})$。对 $r = 2 + \\sin\\theta$，在 $\\theta = 0$ 处点为 $(2, 0)$，$r' = 1$，$\\frac{dx}{d\\theta} = 1$，$\\frac{dy}{d\\theta} = 2$，所以切线为 $y = 2x - 4$。\n\n检验：乘开得 $x = 2\\cos\\theta + \\sin\\theta\\cos\\theta$，$y = 2\\sin\\theta + \\sin^{2}\\theta$，所以\n\n$$\\frac{dx}{d\\theta} = -2\\sin\\theta + \\cos 2\\theta, \\quad \\frac{dy}{d\\theta} = 2\\cos\\theta + 2\\sin\\theta\\cos\\theta$$\n\n在 $\\theta = 0$ 处它们为 $1$ 和 $2$，而直线 $y = 2x - 4$ 在 $x = 2$ 处给出 $y = 0$。\n\n> **注意。** 要用直角坐标的点 $(r\\cos\\theta_{0}, r\\sin\\theta_{0})$，而不是 $(r, \\theta_{0})$。这里两者恰好相同，但在 $\\theta_{0} = \\frac{\\pi}{2}$ 处点是 $(0, 3)$，不是 $\\left(3, \\frac{\\pi}{2}\\right)$。",
      ),
      generate: (rng) => polarLine(rng, false),
    },
    {
      id: "normal-lines-to-polar-curves",
      title: t("Normal lines to polar curves", "极坐标曲线的法线"),
      explanation: t(
        "The normal line passes through the same point with slope\n\n$$-\\frac{1}{m} = -\\frac{dx/d\\theta}{dy/d\\theta}$$\n\nFor $r = 2 + \\sin\\theta$ at $\\theta = 0$, the tangent slope is $2$, so the normal is $y = -\\frac{1}{2}x + 1$.\n\nCheck: at $x = 2$ the normal gives $y = -1 + 1 = 0$, so it passes through $(2, 0)$, and $2 \\times \\left(-\\frac{1}{2}\\right) = -1$, so it is perpendicular to the tangent.\n\n> **Watch out.** The normal slope is $-\\frac{1}{m}$, not $\\frac{1}{m}$ or $-m$: here $-\\frac{1}{2}$, not $\\frac{1}{2}$ or $-2$.",
        "法线经过同一点，斜率为\n\n$$-\\frac{1}{m} = -\\frac{dx/d\\theta}{dy/d\\theta}$$\n\n对 $r = 2 + \\sin\\theta$，在 $\\theta = 0$ 处切线斜率为 $2$，所以法线为 $y = -\\frac{1}{2}x + 1$。\n\n检验：在 $x = 2$ 处法线给出 $y = -1 + 1 = 0$，所以它经过 $(2, 0)$；又 $2 \\times \\left(-\\frac{1}{2}\\right) = -1$，所以它与切线垂直。\n\n> **注意。** 法线斜率是 $-\\frac{1}{m}$，不是 $\\frac{1}{m}$ 或 $-m$：这里是 $-\\frac{1}{2}$，不是 $\\frac{1}{2}$ 或 $-2$。",
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
    const sweep = q.sub(p);
    const answer = sweep.mul(Q.of(a * a, 2));
    const fraction = sweep.div(Q.of(2));
    return exactWorked(
      t(
        `Find the area of the region bounded by the polar curve $r = ${a}$ and the rays $\\theta = ${alpha}$ and $\\theta = ${beta}$. Give an exact answer.`,
        `求由极坐标曲线 $r = ${a}$ 与射线 $\\theta = ${alpha}$、$\\theta = ${beta}$ 围成区域的面积，给出精确值。`,
      ),
      piL(answer),
      [
        [
          ["Set up the integral", "列出积分"],
          t("Polar area is half the integral of $r^{2}$, and here $r$ is constant.", "极坐标面积是 $r^{2}$ 积分的一半，这里 $r$ 是常数。"),
          [`A = \\frac{1}{2}\\int_{${alpha}}^{${beta}} ${a * a} \\, d\\theta`],
        ],
        [
          ["Integrate", "积分"],
          t(`The angle swept is $${beta} - ${alpha} = ${piL(sweep)}$.`, `扫过的角为 $${beta} - ${alpha} = ${piL(sweep)}$。`),
          [`A = ${over2(a * a)} \\cdot ${piL(sweep)} = ${piL(answer)}`],
        ],
      ],
      t(
        `The region is a sector of the disc of radius $${a}$, whose area is $${piL(Q.of(a * a))}$. It takes this fraction of the full turn:\n\n$$${piL(sweep)} \\div 2\\pi = ${fraction.toLatex()}$$\n\nSo its area is\n\n$$${fraction.toLatex()} \\cdot ${piL(Q.of(a * a))} = ${piL(answer)}$$`,
        `这个区域是半径为 $${a}$ 的圆盘的一个扇形，圆盘面积为 $${piL(Q.of(a * a))}$。它占整圈的\n\n$$${piL(sweep)} \\div 2\\pi = ${fraction.toLatex()}$$\n\n所以它的面积为\n\n$$${fraction.toLatex()} \\cdot ${piL(Q.of(a * a))} = ${piL(answer)}$$`,
      ),
      [
        say(
          piL(answer.mul(Q.of(2))),
          "This leaves out the $\\frac{1}{2}$ in $\\frac{1}{2}\\int r^{2} \\, d\\theta$.",
          "漏掉了 $\\frac{1}{2}\\int r^{2} \\, d\\theta$ 中的 $\\frac{1}{2}$。",
        ),
        say(piL(sweep.mul(Q.of(a, 2))), "This integrates $r$ instead of $r^{2}$.", "这里积分的是 $r$ 而不是 $r^{2}$。"),
        say(
          piL(sweep.mul(Q.of(a))),
          "This integrates $r$ and also leaves out the $\\frac{1}{2}$.",
          "这里积分的是 $r$，还漏掉了 $\\frac{1}{2}$。",
        ),
      ],
    );
  }
  const [beta, q] = rng.pick(sectorAngles);
  const answer = q
    .mul(q)
    .mul(q)
    .mul(Q.of(a * a, 6));
  return exactWorked(
    t(
      `Find the area of the region bounded by the spiral $r = ${k1(a)}\\theta$ for $0 \\le \\theta \\le ${beta}$ and the ray $\\theta = ${beta}$. Give an exact answer.`,
      `求螺线 $r = ${k1(a)}\\theta$（$0 \\le \\theta \\le ${beta}$）与射线 $\\theta = ${beta}$ 围成区域的面积，给出精确值。`,
    ),
    times(answer, "\\pi^{3}"),
    [
      [
        ["Set up the integral", "列出积分"],
        t("Square the radius.", "把半径平方。"),
        [`A = \\frac{1}{2}\\int_{0}^{${beta}} ${k1(a * a)}\\theta^{2} \\, d\\theta`],
      ],
      [
        ["Integrate", "积分"],
        t("Raise the power of $\\theta$ by one and divide by the new power.", "把 $\\theta$ 的次数加一，再除以新的次数。"),
        [`A = ${over6(a * a)}\\theta^{3}\\Big|_{0}^{${beta}} = ${over6(a * a)}\\left(${piL(q)}\\right)^{3} = ${times(answer, "\\pi^{3}")}`],
      ],
    ],
    t(
      `Differentiate the antiderivative back:\n\n$$\\frac{d}{d\\theta}\\left(${over6(a * a)}\\theta^{3}\\right) = ${over2(a * a)}\\theta^{2}$$\n\nThis is $\\frac{1}{2}r^{2}$, and the antiderivative is $0$ at $\\theta = 0$.`,
      `把原函数求导回去：\n\n$$\\frac{d}{d\\theta}\\left(${over6(a * a)}\\theta^{3}\\right) = ${over2(a * a)}\\theta^{2}$$\n\n这正是 $\\frac{1}{2}r^{2}$，且原函数在 $\\theta = 0$ 处为 $0$。`,
    ),
    [
      say(
        times(answer.mul(Q.of(2)), "\\pi^{3}"),
        "This leaves out the $\\frac{1}{2}$ in $\\frac{1}{2}\\int r^{2} \\, d\\theta$.",
        "漏掉了 $\\frac{1}{2}\\int r^{2} \\, d\\theta$ 中的 $\\frac{1}{2}$。",
      ),
      say(times(q.mul(q).mul(Q.of(a, 4)), "\\pi^{2}"), "This integrates $r$ instead of $r^{2}$.", "这里积分的是 $r$ 而不是 $r^{2}$。"),
      say(times(answer.mul(Q.of(3)), "\\pi^{3}"), "This forgets to divide $\\theta^{3}$ by $3$.", "这里忘了把 $\\theta^{3}$ 除以 $3$。"),
    ],
  );
}

/** over2 writes n/2 as a coefficient, and over6 writes n/6. */
const over2 = (n: number) => (n % 2 === 0 ? k1(n / 2) : `\\frac{${n}}{2}`);
const over6 = (n: number) => {
  const q = Q.of(n, 6);
  return q.eq(Q.one) ? "" : q.toLatex();
};

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
  const withRest = (q: Q, n: number) => (n === 0 ? piL(q) : `${piL(q)} + ${n}`);
  const answer = withRest(piPart, rest);
  const sweep = half ? Q.of(1, 2) : Q.one;
  // F(0) is 0 for cosine and −ab for sine.
  const start = cosine ? 0 : -a * b;
  const endRest = rest + start;
  const F = cosine
    ? `\\frac{1}{2}\\left(${a * a}\\theta + ${2 * a * b}\\sin\\theta + ${k1(b * b)}\\left(\\frac{\\theta}{2} + \\frac{\\sin 2\\theta}{4}\\right)\\right)`
    : `\\frac{1}{2}\\left(${a * a}\\theta - ${2 * a * b}\\cos\\theta + ${k1(b * b)}\\left(\\frac{\\theta}{2} - \\frac{\\sin 2\\theta}{4}\\right)\\right)`;
  const endValue = endRest === 0 ? piL(piPart) : `${piL(piPart)}${pm(endRest)}`;
  return exactWorked(
    t(
      `Find the area of the region bounded by the polar curve $r = ${a} + ${k1(b)}${fn}\\theta$ and the rays $\\theta = 0$ and $\\theta = ${end}$. Give an exact answer.`,
      `求由极坐标曲线 $r = ${a} + ${k1(b)}${fn}\\theta$ 与射线 $\\theta = 0$、$\\theta = ${end}$ 围成区域的面积，给出精确值。`,
    ),
    answer,
    [
      [
        ["Expand the square", "展开平方"],
        t("Polar area is half the integral of $r^{2}$:", "极坐标面积是 $r^{2}$ 积分的一半："),
        [`A = \\frac{1}{2}\\int_{0}^{${end}} \\left(${a * a} + ${2 * a * b}${fn}\\theta + ${k1(b * b)}${fn}^{2}\\theta\\right) d\\theta`],
      ],
      [
        ["Integrate each term", "逐项积分"],
        t(
          `Lower the power with $${fn}^{2}\\theta = \\frac{1 ${cosine ? "+" : "-"} \\cos 2\\theta}{2}$. Over $[0, ${end}]$ the two trigonometric integrals are\n\n$$\\int ${fn}\\theta \\, d\\theta = ${linear}, \\quad \\int ${fn}^{2}\\theta \\, d\\theta = ${half ? "\\frac{\\pi}{4}" : "\\frac{\\pi}{2}"}$$\n\nSo`,
          `用 $${fn}^{2}\\theta = \\frac{1 ${cosine ? "+" : "-"} \\cos 2\\theta}{2}$ 降幂。在 $[0, ${end}]$ 上两个三角积分为\n\n$$\\int ${fn}\\theta \\, d\\theta = ${linear}, \\quad \\int ${fn}^{2}\\theta \\, d\\theta = ${half ? "\\frac{\\pi}{4}" : "\\frac{\\pi}{2}"}$$\n\n于是`,
        ),
        [
          `A = \\frac{1}{2}\\left(${piL(sweep.mul(Q.of(a * a)))} + ${2 * a * b * linear} + ${piL(sweep.mul(Q.of(b * b, 2)))}\\right) = ${answer}`,
        ],
      ],
    ],
    t(
      `Use one antiderivative of $\\frac{1}{2}r^{2}$ instead:\n\n$$F(\\theta) = ${F}$$\n\nIts derivative gives back $\\frac{1}{2}r^{2}$, because the derivative of $\\frac{\\theta}{2} ${cosine ? "+" : "-"} \\frac{\\sin 2\\theta}{4}$ is $${fn}^{2}\\theta$. At the ends,\n\n$$F\\left(${end}\\right) = ${endValue}, \\quad F(0) = ${start}$$\n\nTheir difference is $${answer}$.`,
      `改用 $\\frac{1}{2}r^{2}$ 的一个原函数：\n\n$$F(\\theta) = ${F}$$\n\n它的导数就是 $\\frac{1}{2}r^{2}$，因为 $\\frac{\\theta}{2} ${cosine ? "+" : "-"} \\frac{\\sin 2\\theta}{4}$ 的导数是 $${fn}^{2}\\theta$。在两端，\n\n$$F\\left(${end}\\right) = ${endValue}, \\quad F(0) = ${start}$$\n\n两者之差为 $${answer}$。`,
    ),
    [
      say(
        withRest(piPart.mul(Q.of(2)), 2 * rest),
        "This leaves out the $\\frac{1}{2}$ in $\\frac{1}{2}\\int r^{2} \\, d\\theta$.",
        "漏掉了 $\\frac{1}{2}\\int r^{2} \\, d\\theta$ 中的 $\\frac{1}{2}$。",
      ),
      say(
        withRest(sweep.mul(Q.of(a * a, 2)), rest),
        `This leaves out the term $${k1(b * b)}${fn}^{2}\\theta$ of $r^{2}$.`,
        `这里漏掉了 $r^{2}$ 中的 $${k1(b * b)}${fn}^{2}\\theta$ 项。`,
      ),
      ...(rest === 0
        ? []
        : [
            say(
              piL(piPart),
              `This leaves out the middle term $${2 * a * b}${fn}\\theta$ of $r^{2}$.`,
              `这里漏掉了 $r^{2}$ 的中间项 $${2 * a * b}${fn}\\theta$。`,
            ),
          ]),
    ],
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
  intro: t(
    "A sector of a disc of radius $r$ with angle $\\Delta\\theta$ is the fraction $\\frac{\\Delta\\theta}{2\\pi}$ of the disc, so its area is $\\frac{1}{2}r^{2}\\Delta\\theta$. Adding up thin sectors of the circle $r = 2$ from $\\theta = 0$ to $\\theta = \\frac{\\pi}{2}$ gives\n\n$$A = \\frac{1}{2}\\int_{0}^{\\pi/2} 4 \\, d\\theta = \\pi$$\n\nCheck: the region is a quarter of the disc of area $4\\pi$, and $\\frac{4\\pi}{4} = \\pi$.\n\nIn this lesson we find the area swept out by any polar curve $r = f(\\theta)$ between two rays, where the radius of the thin sectors changes with $\\theta$.",
    "半径为 $r$、圆心角为 $\\Delta\\theta$ 的扇形占整个圆盘的 $\\frac{\\Delta\\theta}{2\\pi}$，所以面积为 $\\frac{1}{2}r^{2}\\Delta\\theta$。把圆 $r = 2$ 从 $\\theta = 0$ 到 $\\theta = \\frac{\\pi}{2}$ 的细扇形加起来，得\n\n$$A = \\frac{1}{2}\\int_{0}^{\\pi/2} 4 \\, d\\theta = \\pi$$\n\n检验：这个区域是面积为 $4\\pi$ 的圆盘的四分之一，$\\frac{4\\pi}{4} = \\pi$。\n\n这节课我们求任意极坐标曲线 $r = f(\\theta)$ 在两条射线之间扫过的面积，这时细扇形的半径随 $\\theta$ 变化。",
  ),
  prerequisites: ["introduction-to-polar-coordinates", "the-fundamental-theorem-of-calculus", "integrating-trigonometric-functions"],
  encompasses: [{ topic: "integrating-trigonometric-functions", weight: 0.3 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "areas-of-sectors-and-spirals",
      figure: calculusDrawings5["finding-the-area-of-a-polar-region#areas-of-sectors-and-spirals"],
      title: t("Areas of sectors and spirals", "扇形与螺线的面积"),
      explanation: t(
        "A thin sector of radius $r$ and angle $d\\theta$ has area $\\frac{1}{2}r^{2} \\, d\\theta$. Adding them up, the region between $r = f(\\theta)$ and the rays $\\theta = \\alpha$, $\\theta = \\beta$ has area\n\n$$A = \\frac{1}{2}\\int_{\\alpha}^{\\beta} r^{2} \\, d\\theta$$\n\nFor $r = 3$ from $0$ to $\\frac{\\pi}{2}$: $A = \\frac{9}{2} \\cdot \\frac{\\pi}{2} = \\frac{9\\pi}{4}$. For the spiral $r = \\theta$ from $0$ to $\\pi$: $A = \\frac{1}{2}\\int_{0}^{\\pi} \\theta^{2} \\, d\\theta = \\frac{\\pi^{3}}{6}$.\n\nCheck: the first region is a quarter of the disc of area $9\\pi$, which is $\\frac{9\\pi}{4}$. For the spiral, the derivative of $\\frac{\\theta^{3}}{6}$ is $\\frac{\\theta^{2}}{2} = \\frac{1}{2}r^{2}$, and it is $0$ at $\\theta = 0$.\n\n> **Watch out.** Square the radius. For $r = 3$, $\\frac{1}{2}\\int_{0}^{\\pi/2} 3 \\, d\\theta = \\frac{3\\pi}{4}$ is not the area.",
        "半径为 $r$、圆心角为 $d\\theta$ 的细扇形面积为 $\\frac{1}{2}r^{2} \\, d\\theta$。把它们加起来，$r = f(\\theta)$ 与射线 $\\theta = \\alpha$、$\\theta = \\beta$ 之间区域的面积为\n\n$$A = \\frac{1}{2}\\int_{\\alpha}^{\\beta} r^{2} \\, d\\theta$$\n\n对 $r = 3$，从 $0$ 到 $\\frac{\\pi}{2}$：$A = \\frac{9}{2} \\cdot \\frac{\\pi}{2} = \\frac{9\\pi}{4}$。对螺线 $r = \\theta$，从 $0$ 到 $\\pi$：$A = \\frac{1}{2}\\int_{0}^{\\pi} \\theta^{2} \\, d\\theta = \\frac{\\pi^{3}}{6}$。\n\n检验：第一个区域是面积为 $9\\pi$ 的圆盘的四分之一，即 $\\frac{9\\pi}{4}$。对螺线，$\\frac{\\theta^{3}}{6}$ 的导数是 $\\frac{\\theta^{2}}{2} = \\frac{1}{2}r^{2}$，且它在 $\\theta = 0$ 处为 $0$。\n\n> **注意。** 要把半径平方。对 $r = 3$，$\\frac{1}{2}\\int_{0}^{\\pi/2} 3 \\, d\\theta = \\frac{3\\pi}{4}$ 不是面积。",
      ),
      generate: sectorOrSpiralArea,
    },
    {
      id: "areas-bounded-by-limacons",
      figure: calculusDrawings5["finding-the-area-of-a-polar-region#areas-bounded-by-limacons"],
      title: t("Areas bounded by limaçons", "蜗线围成的面积"),
      explanation: t(
        "Polar area adds up thin sectors, each with area half the square of the radius times the angle, so expand the square and lower the powers of cosine. Expand $r^{2}$ and use $\\cos^{2}\\theta = \\frac{1 + \\cos 2\\theta}{2}$ (or the same for $\\sin^{2}\\theta$). For $r = 2 + \\cos\\theta$ from $0$ to $\\frac{\\pi}{2}$:\n\n$$A = \\frac{1}{2}\\int_{0}^{\\pi/2} (4 + 4\\cos\\theta + \\cos^{2}\\theta) \\, d\\theta = \\frac{1}{2}\\left(2\\pi + 4 + \\frac{\\pi}{4}\\right) = \\frac{9\\pi}{8} + 2$$\n\nCheck: one antiderivative of $\\frac{1}{2}r^{2}$ is\n\n$$F(\\theta) = \\frac{1}{2}\\left(4\\theta + 4\\sin\\theta + \\frac{\\theta}{2} + \\frac{\\sin 2\\theta}{4}\\right)$$\n\nSo $F\\left(\\frac{\\pi}{2}\\right) - F(0) = \\frac{1}{2}\\left(2\\pi + 4 + \\frac{\\pi}{4}\\right)$, the same.\n\n> **Watch out.** Expand $(2 + \\cos\\theta)^{2}$ fully, as $4 + 4\\cos\\theta + \\cos^{2}\\theta$. Writing $4 + \\cos^{2}\\theta$ drops the middle term and loses the $2$.",
        "极坐标面积是把许多细扇形加起来，每个扇形的面积是半径平方的一半乘以角度，所以要展开平方并给余弦降幂。展开 $r^{2}$，并用 $\\cos^{2}\\theta = \\frac{1 + \\cos 2\\theta}{2}$（$\\sin^{2}\\theta$ 类似）。对 $r = 2 + \\cos\\theta$，从 $0$ 到 $\\frac{\\pi}{2}$：\n\n$$A = \\frac{1}{2}\\int_{0}^{\\pi/2} (4 + 4\\cos\\theta + \\cos^{2}\\theta) \\, d\\theta = \\frac{1}{2}\\left(2\\pi + 4 + \\frac{\\pi}{4}\\right) = \\frac{9\\pi}{8} + 2$$\n\n检验：$\\frac{1}{2}r^{2}$ 的一个原函数是\n\n$$F(\\theta) = \\frac{1}{2}\\left(4\\theta + 4\\sin\\theta + \\frac{\\theta}{2} + \\frac{\\sin 2\\theta}{4}\\right)$$\n\n所以 $F\\left(\\frac{\\pi}{2}\\right) - F(0) = \\frac{1}{2}\\left(2\\pi + 4 + \\frac{\\pi}{4}\\right)$，结果相同。\n\n> **注意。** 要把 $(2 + \\cos\\theta)^{2}$ 完整展开为 $4 + 4\\cos\\theta + \\cos^{2}\\theta$。写成 $4 + \\cos^{2}\\theta$ 会漏掉中间项，少了 $2$。",
      ),
      generate: limaconArea,
    },
  ],
};

/** petalLimit finds where one petal of a rose ends. */
function petalLimit(rng: Rng) {
  const k = rng.int(2, 6);
  const a = rng.int(1, 6);
  const A = k1(a);
  if (rng.bool()) {
    const answer = piL(Q.of(1, k));
    const mid = piL(Q.of(1, 2 * k));
    return exactWorked(
      t(
        `One petal of the rose $r = ${A}\\sin ${k}\\theta$ is traced as $\\theta$ increases from $0$. At what value of $\\theta$ is that petal complete?`,
        `玫瑰线 $r = ${A}\\sin ${k}\\theta$ 的一片花瓣在 $\\theta$ 从 $0$ 开始增大时描出。$\\theta$ 为何值时这片花瓣描完？`,
      ),
      answer,
      [
        [
          ["Use the zeros of r", "用 r 的零点"],
          t("A petal starts and ends at the pole, where $r = 0$.", "花瓣在极点开始和结束，那里 $r = 0$。"),
        ],
        [
          ["Solve", "求解"],
          t(
            `After $\\theta = 0$, $\\sin ${k}\\theta$ is next zero when $${k}\\theta = \\pi$:`,
            `$\\theta = 0$ 之后，$\\sin ${k}\\theta$ 下一次为零是在 $${k}\\theta = \\pi$：`,
          ),
          [`\\theta = ${answer}`],
        ],
      ],
      t(
        `Substituting back, $\\sin\\left(${k} \\cdot ${answer}\\right) = \\sin\\pi = 0$. At the middle angle $\\theta = ${mid}$, $r = ${A}\\sin\\frac{\\pi}{2} = ${a}$ is positive, so $r$ stays positive between the two zeros and this is one whole petal.`,
        `代回检验：$\\sin\\left(${k} \\cdot ${answer}\\right) = \\sin\\pi = 0$。在中间角 $\\theta = ${mid}$ 处 $r = ${A}\\sin\\frac{\\pi}{2} = ${a}$ 为正，所以 $r$ 在两个零点之间保持为正，这正好是一整片花瓣。`,
      ),
      [
        say(
          mid,
          "This is the middle of the petal, where $r$ is largest; the petal ends where $r$ returns to $0$.",
          "这是花瓣的中间，$r$ 在那里最大；花瓣在 $r$ 回到 $0$ 处结束。",
        ),
        say(
          piL(Q.of(2, k)),
          "Between $0$ and this angle $r$ is first positive and then negative: that traces two petals.",
          "在 $0$ 与这个角之间 $r$ 先正后负，描出了两片花瓣。",
        ),
        say(
          "\\pi",
          `This is $\\theta = \\pi$; the petal ends much sooner, when $${k}\\theta$ first reaches $\\pi$.`,
          `这是 $\\theta = \\pi$；花瓣早在 $${k}\\theta$ 第一次达到 $\\pi$ 时就结束了。`,
        ),
      ],
    );
  }
  const answer = piL(Q.of(1, 2 * k));
  return exactWorked(
    t(
      `The petal of the rose $r = ${A}\\cos ${k}\\theta$ along the positive $x$-axis is traced for $-\\alpha \\le \\theta \\le \\alpha$. Find $\\alpha$.`,
      `玫瑰线 $r = ${A}\\cos ${k}\\theta$ 沿 $x$ 轴正方向的那片花瓣对应 $-\\alpha \\le \\theta \\le \\alpha$。求 $\\alpha$。`,
    ),
    answer,
    [
      [
        ["Use the zeros of r", "用 r 的零点"],
        t(
          `The petal is centred on $\\theta = 0$, where $r = ${a}$, and ends where $r = 0$.`,
          `这片花瓣以 $\\theta = 0$ 为中心（此处 $r = ${a}$），在 $r = 0$ 处结束。`,
        ),
      ],
      [
        ["Solve", "求解"],
        t(
          `$\\cos ${k}\\theta$ is first zero when $${k}\\theta = \\frac{\\pi}{2}$:`,
          `$\\cos ${k}\\theta$ 第一次为零是在 $${k}\\theta = \\frac{\\pi}{2}$：`,
        ),
        [`\\alpha = ${answer}`],
      ],
    ],
    t(
      `Substituting back,\n\n$$\\cos\\left(${k} \\cdot ${answer}\\right) = \\cos\\frac{\\pi}{2} = 0$$\n\nFor $|\\theta| < ${answer}$, $${k}|\\theta| < \\frac{\\pi}{2}$, so $r > 0$ all the way between the two zeros.`,
      `代回检验：\n\n$$\\cos\\left(${k} \\cdot ${answer}\\right) = \\cos\\frac{\\pi}{2} = 0$$\n\n当 $|\\theta| < ${answer}$ 时 $${k}|\\theta| < \\frac{\\pi}{2}$，所以在两个零点之间始终 $r > 0$。`,
    ),
    [
      say(
        piL(Q.of(1, k)),
        `At this angle $${k}\\theta = \\pi$ and $r = -${a}$, past the end of the petal.`,
        `在这个角处 $${k}\\theta = \\pi$，$r = -${a}$，已经越过花瓣的终点。`,
      ),
      say(
        piL(Q.of(1, 4 * k)),
        `Here $${k}\\theta = \\frac{\\pi}{4}$ and $r$ is not yet $0$: this is only halfway.`,
        `这里 $${k}\\theta = \\frac{\\pi}{4}$，$r$ 还不为 $0$：只走到一半。`,
      ),
      say(
        "\\frac{\\pi}{2}",
        `This solves $\\cos\\theta = 0$, forgetting the factor $${k}$: the zero comes when $${k}\\theta = \\frac{\\pi}{2}$.`,
        `这是 $\\cos\\theta = 0$ 的解，忘了因子 $${k}$：零点出现在 $${k}\\theta = \\frac{\\pi}{2}$。`,
      ),
    ],
  );
}

/** InnerLoop is a limaçon with an inner loop, the interval that traces the loop and the angle in its middle. */
interface InnerLoop {
  readonly tex: (a: number) => string;
  readonly interval: number;
  readonly why: Text;
  /** mid substitutes the middle angle into the bracket of r. */
  readonly mid: string;
  /** starts are the values of the bracket of r at the left end of each interval: [integer part, multiple of √3]. */
  readonly starts: readonly (readonly [number, number])[];
}

/** loopIntervals are candidate intervals for an inner loop, with their left ends. */
const loopIntervals: readonly Text[] = [
  t("$\\frac{2\\pi}{3} \\le \\theta \\le \\frac{4\\pi}{3}$", "$\\frac{2\\pi}{3} \\le \\theta \\le \\frac{4\\pi}{3}$"),
  t("$-\\frac{\\pi}{3} \\le \\theta \\le \\frac{\\pi}{3}$", "$-\\frac{\\pi}{3} \\le \\theta \\le \\frac{\\pi}{3}$"),
  t("$\\frac{7\\pi}{6} \\le \\theta \\le \\frac{11\\pi}{6}$", "$\\frac{7\\pi}{6} \\le \\theta \\le \\frac{11\\pi}{6}$"),
  t("$\\frac{\\pi}{6} \\le \\theta \\le \\frac{5\\pi}{6}$", "$\\frac{\\pi}{6} \\le \\theta \\le \\frac{5\\pi}{6}$"),
  t("$0 \\le \\theta \\le \\pi$", "$0 \\le \\theta \\le \\pi$"),
];
const loopStarts = ["\\frac{2\\pi}{3}", "-\\frac{\\pi}{3}", "\\frac{7\\pi}{6}", "\\frac{\\pi}{6}", "0"];

/** innerLoops are limaçons r = a(1 ± 2 cos θ) and r = a(1 ± 2 sin θ). */
const innerLoops: readonly InnerLoop[] = [
  {
    tex: (a) => `${k1(a)}(1 + 2\\cos\\theta)`,
    interval: 0,
    why: t("$\\cos\\theta = -\\frac{1}{2}$", "$\\cos\\theta = -\\frac{1}{2}$"),
    mid: "1 + 2\\cos\\pi = -1",
    starts: [
      [0, 0],
      [2, 0],
      [1, -1],
      [1, 1],
      [3, 0],
    ],
  },
  {
    tex: (a) => `${k1(a)}(1 - 2\\cos\\theta)`,
    interval: 1,
    why: t("$\\cos\\theta = \\frac{1}{2}$", "$\\cos\\theta = \\frac{1}{2}$"),
    mid: "1 - 2\\cos 0 = -1",
    starts: [
      [2, 0],
      [0, 0],
      [1, 1],
      [1, -1],
      [-1, 0],
    ],
  },
  {
    tex: (a) => `${k1(a)}(1 + 2\\sin\\theta)`,
    interval: 2,
    why: t("$\\sin\\theta = -\\frac{1}{2}$", "$\\sin\\theta = -\\frac{1}{2}$"),
    mid: "1 + 2\\sin\\frac{3\\pi}{2} = -1",
    starts: [
      [1, 1],
      [1, -1],
      [0, 0],
      [2, 0],
      [1, 0],
    ],
  },
  {
    tex: (a) => `${k1(a)}(1 - 2\\sin\\theta)`,
    interval: 3,
    why: t("$\\sin\\theta = \\frac{1}{2}$", "$\\sin\\theta = \\frac{1}{2}$"),
    mid: "1 - 2\\sin\\frac{\\pi}{2} = -1",
    starts: [
      [1, -1],
      [1, 1],
      [2, 0],
      [0, 0],
      [1, 0],
    ],
  },
];

/** startValue writes a·(p + q√3). */
const startValue = (a: number, [p, q]: readonly [number, number]) =>
  q === 0 ? `${a * p}` : a === 1 ? `1 ${q > 0 ? "+" : "-"} \\sqrt{3}` : `${a}(1 ${q > 0 ? "+" : "-"} \\sqrt{3})`;

/** innerLoopLimits chooses the limits of integration that trace an inner loop. */
function innerLoopLimits(rng: Rng) {
  const c = rng.pick(innerLoops);
  const a = rng.int(1, 9);
  const right = loopIntervals[c.interval]!;
  return explainedChoice(rng, {
    prompt: t(
      `The limaçon $r = ${c.tex(a)}$ has an inner loop. For which values of $\\theta$ is the inner loop traced?`,
      `蜗线 $r = ${c.tex(a)}$ 有一个内圈。$\\theta$ 取哪些值时描出内圈？`,
    ),
    correct: right,
    wrong: loopIntervals
      .map((l, i) => ({ l, i }))
      .filter(({ i }) => i !== c.interval)
      .map(({ l, i }) => ({
        option: l,
        why: t(
          `At $\\theta = ${loopStarts[i]}$, $r = ${startValue(a, c.starts[i]!)}$, not $0$, so the curve is not at the pole there and the loop cannot start there.`,
          `在 $\\theta = ${loopStarts[i]}$ 处 $r = ${startValue(a, c.starts[i]!)}$，不为 $0$，曲线不在极点，内圈不能从那里开始。`,
        ),
      })),
    solution: walked(
      [
        [
          ["Find where r = 0", "找出 r = 0 处"],
          t(
            `The inner loop starts and ends at the pole, where $r = 0$: ${c.why.en}.`,
            `内圈在极点处开始和结束，此时 $r = 0$：${c.why["zh-CN"]}。`,
          ),
        ],
        [
          ["Pick the interval", "选出区间"],
          t(
            `Between those angles $r < 0$, and those points, plotted on the far side of the pole, form the inner loop. It is traced for ${right.en}.`,
            `在这两个角之间 $r < 0$，这些点画在极点的另一侧，构成内圈。它对应 ${right["zh-CN"]}。`,
          ),
        ],
      ],
      t(
        `At the middle angle of the interval the bracket of $r$ is $${c.mid}$, so $r = -${a}$ there: negative, as an inner loop needs. Both ends make the bracket $0$.`,
        `在区间的中间角处，$r$ 的括号部分为 $${c.mid}$，所以那里 $r = -${a}$，为负，符合内圈的要求；两个端点都使括号为 $0$。`,
      ),
    ),
  });
}

/** findingTheLimitsOfIntegrationForAGivenPolarRegion finds the angles where a loop or petal starts and ends. */
export const findingTheLimitsOfIntegrationForAGivenPolarRegion: TopicDef = {
  id: "finding-the-limits-of-integration-for-a-given-polar-region",
  title: t("Finding the Limits of Integration For a Given Polar Region", "确定极坐标区域的积分限"),
  summary: t(
    "A petal or loop begins and ends at the pole, so its limits of integration are consecutive solutions of r = 0.",
    "花瓣或圈在极点开始和结束，所以它的积分限是 r = 0 的相邻两个解。",
  ),
  intro: t(
    "The circle $r = 2\\cos\\theta$ starts at the pole when $\\theta = -\\frac{\\pi}{2}$ and returns to it when $\\theta = \\frac{\\pi}{2}$, so those are the limits:\n\n$$A = \\frac{1}{2}\\int_{-\\pi/2}^{\\pi/2} 4\\cos^{2}\\theta \\, d\\theta = \\pi$$\n\nCheck: the curve is $(x - 1)^{2} + y^{2} = 1$, a circle of radius $1$, whose area is $\\pi$.\n\nIn this lesson we find such limits for petals of roses and inner loops of limaçons: consecutive angles where $r = 0$.",
    "圆 $r = 2\\cos\\theta$ 在 $\\theta = -\\frac{\\pi}{2}$ 时从极点出发，在 $\\theta = \\frac{\\pi}{2}$ 时回到极点，所以积分限就是这两个角：\n\n$$A = \\frac{1}{2}\\int_{-\\pi/2}^{\\pi/2} 4\\cos^{2}\\theta \\, d\\theta = \\pi$$\n\n检验：这条曲线是 $(x - 1)^{2} + y^{2} = 1$，半径为 $1$ 的圆，面积为 $\\pi$。\n\n这节课我们为玫瑰线的花瓣和蜗线的内圈求这样的积分限：$r = 0$ 的相邻两个角。",
  ),
  prerequisites: ["finding-the-area-of-a-polar-region", "finding-intersections-of-polar-curves"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "limits-for-a-petal",
      title: t("Limits for a petal", "一片花瓣的积分限"),
      explanation: t(
        "A rose $r = a\\sin k\\theta$ or $r = a\\cos k\\theta$ passes through the pole between petals. One petal is traced between consecutive zeros of $r$. For $r = 2\\cos 3\\theta$, $r = 0$ at $\\theta = \\pm\\frac{\\pi}{6}$, so the petal on the positive $x$-axis is traced for $-\\frac{\\pi}{6} \\le \\theta \\le \\frac{\\pi}{6}$.\n\nCheck: $\\cos\\left(3 \\cdot \\frac{\\pi}{6}\\right) = \\cos\\frac{\\pi}{2} = 0$, and in the middle, at $\\theta = 0$, $r = 2 > 0$.\n\n> **Watch out.** Solve $3\\theta = \\frac{\\pi}{2}$, not $\\theta = \\frac{\\pi}{2}$: the limits come from the zeros of $\\cos 3\\theta$, and $\\theta = \\frac{\\pi}{2}$ would sweep across several petals.",
        "玫瑰线 $r = a\\sin k\\theta$ 或 $r = a\\cos k\\theta$ 在相邻花瓣之间经过极点。一片花瓣在 $r$ 的相邻两个零点之间描出。对 $r = 2\\cos 3\\theta$，$r = 0$ 在 $\\theta = \\pm\\frac{\\pi}{6}$，所以 $x$ 轴正方向上的花瓣对应 $-\\frac{\\pi}{6} \\le \\theta \\le \\frac{\\pi}{6}$。\n\n检验：$\\cos\\left(3 \\cdot \\frac{\\pi}{6}\\right) = \\cos\\frac{\\pi}{2} = 0$，而中间 $\\theta = 0$ 处 $r = 2 > 0$。\n\n> **注意。** 要解 $3\\theta = \\frac{\\pi}{2}$，而不是 $\\theta = \\frac{\\pi}{2}$：积分限来自 $\\cos 3\\theta$ 的零点，取 $\\theta = \\frac{\\pi}{2}$ 会扫过好几片花瓣。",
      ),
      generate: petalLimit,
    },
    {
      id: "limits-for-an-inner-loop",
      title: t("Limits for an inner loop", "内圈的积分限"),
      explanation: t(
        "The limaçon $r = 1 + 2\\cos\\theta$ is negative when $\\cos\\theta < -\\frac{1}{2}$, that is, for $\\frac{2\\pi}{3} < \\theta < \\frac{4\\pi}{3}$. Those points are plotted on the opposite side of the pole and form the inner loop, so its area is\n\n$$\\frac{1}{2}\\int_{2\\pi/3}^{4\\pi/3} r^{2} \\, d\\theta$$\n\nCheck: at both ends $1 + 2\\left(-\\frac{1}{2}\\right) = 0$, and in the middle $r = 1 + 2\\cos\\pi = -1 < 0$.\n\n> **Watch out.** The inner loop is where $r < 0$. Integrating over $[0, 2\\pi]$ counts the inner loop twice, once inside the sweep of the outer loop and once on its own.",
        "蜗线 $r = 1 + 2\\cos\\theta$ 在 $\\cos\\theta < -\\frac{1}{2}$，即 $\\frac{2\\pi}{3} < \\theta < \\frac{4\\pi}{3}$ 时为负。这些点画在极点的另一侧，构成内圈，所以内圈面积为\n\n$$\\frac{1}{2}\\int_{2\\pi/3}^{4\\pi/3} r^{2} \\, d\\theta$$\n\n检验：两端 $1 + 2\\left(-\\frac{1}{2}\\right) = 0$，中间 $r = 1 + 2\\cos\\pi = -1 < 0$。\n\n> **注意。** 内圈是 $r < 0$ 的部分。在 $[0, 2\\pi]$ 上积分会把内圈算两次：一次在外圈扫过的范围内，一次是它自己。",
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
  const one = Q.of(a * a, 4 * k);
  const petal = fn === "\\sin" ? `_{0}^{\\pi/${k}}` : `_{-\\pi/${2 * k}}^{\\pi/${2 * k}}`;
  const square = `${k1(a * a)}${fn}^{2} ${k}\\theta`;
  return exactWorked(
    t(
      `Find the total area enclosed by the rose $r = ${k1(a)}${fn} ${k}\\theta$. Give an exact answer.`,
      `求玫瑰线 $r = ${k1(a)}${fn} ${k}\\theta$ 围成的总面积，给出精确值。`,
    ),
    piL(answer),
    [
      [
        ["Count the petals", "数花瓣"],
        t(
          `Since $k = ${k}$ is ${even ? "even" : "odd"}, the rose has $${petals}$ petals.`,
          `因为 $k = ${k}$ 是${even ? "偶数" : "奇数"}，玫瑰线有 $${petals}$ 片花瓣。`,
        ),
      ],
      [
        ["Find one petal", "求一片花瓣"],
        t("One petal lies between consecutive zeros of $r$:", "一片花瓣位于 $r$ 的相邻两个零点之间："),
        [`\\frac{1}{2}\\int${petal} ${square} \\, d\\theta = ${piL(one)}`],
      ],
      [
        ["Add the petals", "把花瓣加起来"],
        t("The petals are congruent.", "各片花瓣全等。"),
        [`${petals} \\cdot ${piL(one)} = ${piL(answer)}`],
      ],
    ],
    t(
      `Integrate over one interval that traces the whole rose once: ${even ? "$[0, 2\\pi]$ for even $k$" : "$[0, \\pi]$ for odd $k$"}. On it $${fn}^{2} ${k}\\theta$ averages $\\frac{1}{2}$, so\n\n$$\\frac{1}{2}\\int_{0}^{${even ? "2\\pi" : "\\pi"}} ${square} \\, d\\theta = ${over2(a * a)} \\cdot ${even ? "\\pi" : "\\frac{\\pi}{2}"} = ${piL(answer)}$$`,
      `在恰好把整条玫瑰线描一次的区间上积分：${even ? "$k$ 为偶数时取 $[0, 2\\pi]$" : "$k$ 为奇数时取 $[0, \\pi]$"}。在这个区间上 $${fn}^{2} ${k}\\theta$ 的平均值为 $\\frac{1}{2}$，所以\n\n$$\\frac{1}{2}\\int_{0}^{${even ? "2\\pi" : "\\pi"}} ${square} \\, d\\theta = ${over2(a * a)} \\cdot ${even ? "\\pi" : "\\frac{\\pi}{2}"} = ${piL(answer)}$$`,
    ),
    [
      say(
        piL(Q.of(a * a, even ? 4 : 2)),
        even
          ? `This counts $${k}$ petals; for even $k$ the rose has $2k = ${2 * k}$.`
          : "This integrates over $[0, 2\\pi]$, which traces every petal twice when $k$ is odd.",
        even
          ? `这里数成 $${k}$ 片；$k$ 为偶数时玫瑰线有 $2k = ${2 * k}$ 片。`
          : "这是在 $[0, 2\\pi]$ 上积分，$k$ 为奇数时会把每片花瓣描两次。",
      ),
      say(piL(one), "This is the area of one petal.", "这是一片花瓣的面积。"),
      say(
        piL(Q.of(a * a)),
        `This is the disc of radius $${a}$; the petals cover only part of it.`,
        `这是半径为 $${a}$ 的圆盘；花瓣只覆盖其中一部分。`,
      ),
    ],
  );
}

/** wholeLimaconArea finds the area enclosed by r = a + b cos θ with a ≥ b > 0. */
function wholeLimaconArea(rng: Rng) {
  const a = rng.int(1, 6);
  const b = rng.int(1, a);
  const cosine = rng.bool();
  const fn = cosine ? "\\cos" : "\\sin";
  const answer = Q.of(2 * a * a + b * b, 2);
  const F = cosine
    ? `\\frac{1}{2}\\left(${a * a}\\theta + ${2 * a * b}\\sin\\theta + ${k1(b * b)}\\left(\\frac{\\theta}{2} + \\frac{\\sin 2\\theta}{4}\\right)\\right)`
    : `\\frac{1}{2}\\left(${a * a}\\theta - ${2 * a * b}\\cos\\theta + ${k1(b * b)}\\left(\\frac{\\theta}{2} - \\frac{\\sin 2\\theta}{4}\\right)\\right)`;
  return exactWorked(
    t(
      `Find the area enclosed by the ${a === b ? "cardioid" : "limaçon"} $r = ${a} + ${k1(b)}${fn}\\theta$. Give an exact answer.`,
      `求${a === b ? "心形线" : "蜗线"} $r = ${a} + ${k1(b)}${fn}\\theta$ 围成的面积，给出精确值。`,
    ),
    piL(answer),
    [
      [
        ["Choose the interval", "选取区间"],
        t(
          `Since $${a} \\ge ${b}$, $r \\ge 0$, and the curve is traced once for $0 \\le \\theta \\le 2\\pi$.`,
          `因为 $${a} \\ge ${b}$，$r \\ge 0$，曲线在 $0 \\le \\theta \\le 2\\pi$ 上恰好描一次。`,
        ),
      ],
      [
        ["Integrate", "积分"],
        t(
          `Over a full turn $${fn}\\theta$ integrates to $0$ and $${fn}^{2}\\theta$ to $\\pi$:`,
          `在一整圈上 $${fn}\\theta$ 的积分为 $0$，$${fn}^{2}\\theta$ 的积分为 $\\pi$：`,
        ),
        [
          `A = \\frac{1}{2}\\int_{0}^{2\\pi} \\left(${a * a} + ${2 * a * b}${fn}\\theta + ${k1(b * b)}${fn}^{2}\\theta\\right) d\\theta = \\frac{1}{2}\\left(${2 * a * a}\\pi + ${k1(b * b)}\\pi\\right) = ${piL(answer)}`,
        ],
      ],
    ],
    t(
      `Use one antiderivative of $\\frac{1}{2}r^{2}$:\n\n$$F(\\theta) = ${F}$$\n\nThe ${cosine ? "sine terms vanish" : "cosine and sine terms take the same values"} at $0$ and $2\\pi$, so $F(2\\pi) - F(0) = \\frac{1}{2}\\left(${2 * a * a}\\pi + ${k1(b * b)}\\pi\\right) = ${piL(answer)}$.`,
      `用 $\\frac{1}{2}r^{2}$ 的一个原函数：\n\n$$F(\\theta) = ${F}$$\n\n${cosine ? "正弦项" : "余弦项和正弦项"}在 $0$ 与 $2\\pi$ 处${cosine ? "都为零" : "取值相同"}，所以 $F(2\\pi) - F(0) = \\frac{1}{2}\\left(${2 * a * a}\\pi + ${k1(b * b)}\\pi\\right) = ${piL(answer)}$。`,
    ),
    [
      say(
        piL(Q.of(a * a)),
        `This leaves out the $${k1(b * b)}${fn}^{2}\\theta$ term of $r^{2}$.`,
        `这里漏掉了 $r^{2}$ 中的 $${k1(b * b)}${fn}^{2}\\theta$ 项。`,
      ),
      say(
        piL(Q.of(2 * a * a + b * b)),
        "This leaves out the $\\frac{1}{2}$ in $\\frac{1}{2}\\int r^{2} \\, d\\theta$.",
        "漏掉了 $\\frac{1}{2}\\int r^{2} \\, d\\theta$ 中的 $\\frac{1}{2}$。",
      ),
      say(
        piL(Q.of(a * a + b * b)),
        `This integrates $${fn}^{2}\\theta$ to $2\\pi$ over a full turn; it averages $\\frac{1}{2}$, so the integral is $\\pi$.`,
        `这里把 $${fn}^{2}\\theta$ 在一整圈上的积分算成 $2\\pi$；它的平均值为 $\\frac{1}{2}$，积分应为 $\\pi$。`,
      ),
    ],
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
  intro: t(
    "The circle $r = 2\\sin\\theta$ is traced once as $\\theta$ runs from $0$ to $\\pi$, so\n\n$$A = \\frac{1}{2}\\int_{0}^{\\pi} 4\\sin^{2}\\theta \\, d\\theta = 2 \\cdot \\frac{\\pi}{2} = \\pi$$\n\nCheck: the curve is $x^{2} + (y - 1)^{2} = 1$, a circle of radius $1$, whose area is $\\pi$. Over $[0, 2\\pi]$ the integral would give $2\\pi$, because the circle is traced twice.\n\nIn this lesson we find the whole area enclosed by one polar curve, choosing an interval that traces it exactly once.",
    "当 $\\theta$ 从 $0$ 变到 $\\pi$ 时，圆 $r = 2\\sin\\theta$ 恰好描一次，所以\n\n$$A = \\frac{1}{2}\\int_{0}^{\\pi} 4\\sin^{2}\\theta \\, d\\theta = 2 \\cdot \\frac{\\pi}{2} = \\pi$$\n\n检验：这条曲线是 $x^{2} + (y - 1)^{2} = 1$，半径为 $1$ 的圆，面积为 $\\pi$。若在 $[0, 2\\pi]$ 上积分会得到 $2\\pi$，因为圆被描了两次。\n\n这节课我们求一条极坐标曲线围成的总面积，选取恰好把它描一次的区间。",
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
        "The rose $r = a\\cos k\\theta$ (or $a\\sin k\\theta$) has $k$ petals when $k$ is odd and $2k$ petals when $k$ is even. Each petal has area $\\frac{\\pi a^{2}}{4k}$, so the total is $\\frac{\\pi a^{2}}{4}$ for odd $k$ and $\\frac{\\pi a^{2}}{2}$ for even $k$. For $r = 2\\cos 2\\theta$: $4$ petals of area $\\frac{\\pi}{2}$ each, $2\\pi$ in all.\n\nCheck: for even $k$ the interval $[0, 2\\pi]$ traces every petal once, and\n\n$$\\frac{1}{2}\\int_{0}^{2\\pi} 4\\cos^{2} 2\\theta \\, d\\theta = 2\\pi$$\n\n> **Watch out.** For odd $k$, integrating over $[0, 2\\pi]$ traces every petal twice: for $r = \\cos 3\\theta$ it gives $\\frac{\\pi}{2}$, double the true area $\\frac{\\pi}{4}$.",
        "玫瑰线 $r = a\\cos k\\theta$（或 $a\\sin k\\theta$）在 $k$ 为奇数时有 $k$ 片花瓣，$k$ 为偶数时有 $2k$ 片。每片面积为 $\\frac{\\pi a^{2}}{4k}$，所以总面积在 $k$ 为奇数时为 $\\frac{\\pi a^{2}}{4}$，为偶数时为 $\\frac{\\pi a^{2}}{2}$。对 $r = 2\\cos 2\\theta$：$4$ 片花瓣，每片面积 $\\frac{\\pi}{2}$，共 $2\\pi$。\n\n检验：$k$ 为偶数时区间 $[0, 2\\pi]$ 把每片花瓣恰好描一次，而\n\n$$\\frac{1}{2}\\int_{0}^{2\\pi} 4\\cos^{2} 2\\theta \\, d\\theta = 2\\pi$$\n\n> **注意。** $k$ 为奇数时在 $[0, 2\\pi]$ 上积分会把每片花瓣描两次：对 $r = \\cos 3\\theta$ 得到 $\\frac{\\pi}{2}$，是真实面积 $\\frac{\\pi}{4}$ 的两倍。",
      ),
      generate: roseArea,
    },
    {
      id: "areas-of-limacons-and-cardioids",
      title: t("Areas of limaçons and cardioids", "蜗线与心形线的面积"),
      explanation: t(
        "If $a \\ge b > 0$, $r = a + b\\cos\\theta$ is never negative and is traced once on $[0, 2\\pi]$. The $\\cos\\theta$ term integrates to $0$ and $\\cos^{2}\\theta$ to $\\pi$, so\n\n$$A = \\frac{1}{2}(2\\pi a^{2} + \\pi b^{2}) = \\pi\\left(a^{2} + \\frac{b^{2}}{2}\\right)$$\n\nThe cardioid $r = a(1 + \\cos\\theta)$ encloses $\\frac{3\\pi a^{2}}{2}$.\n\nCheck: an antiderivative of $\\frac{1}{2}a^{2}(1 + \\cos\\theta)^{2}$ is $\\frac{a^{2}}{2}\\left(\\theta + 2\\sin\\theta + \\frac{\\theta}{2} + \\frac{\\sin 2\\theta}{4}\\right)$. From $0$ to $2\\pi$ it grows by $\\frac{a^{2}}{2} \\cdot 3\\pi = \\frac{3\\pi a^{2}}{2}$.\n\n> **Watch out.** Over a full turn $\\int_{0}^{2\\pi} \\cos^{2}\\theta \\, d\\theta = \\pi$, not $2\\pi$: $\\cos^{2}\\theta$ averages $\\frac{1}{2}$.",
        "若 $a \\ge b > 0$，$r = a + b\\cos\\theta$ 恒不为负，在 $[0, 2\\pi]$ 上恰好描一次。$\\cos\\theta$ 项积分为 $0$，$\\cos^{2}\\theta$ 积分为 $\\pi$，所以\n\n$$A = \\frac{1}{2}(2\\pi a^{2} + \\pi b^{2}) = \\pi\\left(a^{2} + \\frac{b^{2}}{2}\\right)$$\n\n心形线 $r = a(1 + \\cos\\theta)$ 围成的面积为 $\\frac{3\\pi a^{2}}{2}$。\n\n检验：$\\frac{1}{2}a^{2}(1 + \\cos\\theta)^{2}$ 的一个原函数是 $\\frac{a^{2}}{2}\\left(\\theta + 2\\sin\\theta + \\frac{\\theta}{2} + \\frac{\\sin 2\\theta}{4}\\right)$。从 $0$ 到 $2\\pi$ 它增加 $\\frac{a^{2}}{2} \\cdot 3\\pi = \\frac{3\\pi a^{2}}{2}$。\n\n> **注意。** 一整圈上 $\\int_{0}^{2\\pi} \\cos^{2}\\theta \\, d\\theta = \\pi$，不是 $2\\pi$：$\\cos^{2}\\theta$ 的平均值是 $\\frac{1}{2}$。",
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
  const sixth = piL(Q.of(a * a, 3));
  const root = rootTimes(Q.of(a * a, 2), 3, "");
  const answer = `${sixth} + ${root}`;
  const A2 = k1(a * a);
  const bracket = `\\left[\\frac{\\theta}{2} ${cosine ? "+" : "-"} \\frac{\\sin 2\\theta}{2}\\right]_{${lo}}^{${hi}}`;
  return exactWorked(
    t(
      `Find the area of the region inside the circle $r = ${2 * a}${fn}\\theta$ and outside the circle $r = ${a}$. Give an exact answer.`,
      `求在圆 $r = ${2 * a}${fn}\\theta$ 内且在圆 $r = ${a}$ 外的区域的面积，给出精确值。`,
    ),
    answer,
    [
      [
        ["Find where they meet", "求交点"],
        t(
          `The circles meet where $${2 * a}${fn}\\theta = ${a}$, that is, $${fn}\\theta = \\frac{1}{2}$:`,
          `两圆在 $${2 * a}${fn}\\theta = ${a}$ 处相交，即 $${fn}\\theta = \\frac{1}{2}$：`,
        ),
        [`\\theta = ${lo}, \\quad \\theta = ${hi}`],
      ],
      [
        ["Set up the integral", "列出积分"],
        t(
          `Subtract the squares and use $${fn}^{2}\\theta = \\frac{1 ${cosine ? "+" : "-"} \\cos 2\\theta}{2}$:`,
          `两个平方相减，并用 $${fn}^{2}\\theta = \\frac{1 ${cosine ? "+" : "-"} \\cos 2\\theta}{2}$：`,
        ),
        [
          `A = \\frac{1}{2}\\int_{${lo}}^{${hi}} \\left(${4 * a * a}${fn}^{2}\\theta - ${a * a}\\right) d\\theta = ${A2}\\int_{${lo}}^{${hi}} \\left(\\frac{1}{2} ${cosine ? "+" : "-"} \\cos 2\\theta\\right) d\\theta`,
        ],
      ],
      [
        ["Integrate", "积分"],
        t("Evaluate the antiderivative at both ends.", "在两端计算原函数的值。"),
        [`A = ${A2}${bracket} = ${a === 1 ? answer : `${A2}\\left(\\frac{\\pi}{3} + \\frac{\\sqrt{3}}{2}\\right) = ${answer}`}`],
      ],
    ],
    t(
      `Use geometry. The circle $r = ${2 * a}${fn}\\theta$ has radius $${a}$ and its center at distance $${a}$ from the pole, so the two centers and a crossing point form an equilateral triangle. Each center sees the common chord at an angle of $\\frac{2\\pi}{3}$, and the overlap is two segments, each a sector minus a triangle. The region is the disc minus the overlap:\n\n$$${piL(Q.of(a * a))} - 2\\left(${sixth} - ${rootTimes(Q.of(a * a, 4), 3, "")}\\right) = ${answer}$$`,
      `用几何检验。圆 $r = ${2 * a}${fn}\\theta$ 的半径为 $${a}$，圆心到极点的距离为 $${a}$，所以两个圆心与一个交点构成正三角形。每个圆心看公共弦的张角为 $\\frac{2\\pi}{3}$，重叠部分是两个弓形，每个是扇形减三角形。所求区域等于圆盘减去重叠部分：\n\n$$${piL(Q.of(a * a))} - 2\\left(${sixth} - ${rootTimes(Q.of(a * a, 4), 3, "")}\\right) = ${answer}$$`,
    ),
    [
      say(
        `${sixth} - ${root}`,
        "The sign of the $\\sin 2\\theta$ part is wrong; evaluate the bracket carefully at both ends.",
        "$\\sin 2\\theta$ 部分的符号错了；仔细计算括号在两端的值。",
      ),
      say(
        piL(Q.of(a * a)),
        `This is the whole disc inside $r = ${2 * a}${fn}\\theta$; the part inside $r = ${a}$ must come off.`,
        `这是 $r = ${2 * a}${fn}\\theta$ 围成的整个圆盘；还要去掉在 $r = ${a}$ 内的部分。`,
      ),
      say(
        `${piL(Q.of(2 * a * a, 3))} + ${rootTimes(Q.of(a * a), 3, "")}`,
        "This leaves out the $\\frac{1}{2}$ in $\\frac{1}{2}\\int (r_{\\text{outer}}^{2} - r_{\\text{inner}}^{2}) \\, d\\theta$.",
        "漏掉了 $\\frac{1}{2}\\int (r_{\\text{外}}^{2} - r_{\\text{内}}^{2}) \\, d\\theta$ 中的 $\\frac{1}{2}$。",
      ),
    ],
  );
}

/** cardioidCircleArea finds the area between a cardioid and the circle r = a. */
function cardioidCircleArea(rng: Rng) {
  const a = rng.int(1, 8);
  const insideCardioid = rng.bool();
  const fn = rng.bool() ? "\\cos" : "\\sin";
  const [lo, hi, meet] =
    fn === "\\cos" ? ["-\\pi/2", "\\pi/2", "\\theta = \\pm\\frac{\\pi}{2}"] : ["0", "\\pi", "\\theta = 0 \\text{ and } \\theta = \\pi"];
  const a2 = a * a;
  const sign = insideCardioid ? "+" : "-";
  const answer = `${2 * a2} ${sign} ${piL(Q.of(a2, 4))}`;
  const [outer, inner] = insideCardioid ? [`${k1(a)}(1 + ${fn}\\theta)`, `${a}`] : [`${a}`, `${k1(a)}(1 - ${fn}\\theta)`];
  const cardioid = insideCardioid ? outer : inner;
  const cardioidHalf = `${piL(Q.of(3 * a2, 4))} ${sign} ${2 * a2}`;
  const halfDisc = piL(Q.of(a2, 2));
  return exactWorked(
    t(
      `Find the area of the region inside $r = ${outer}$ and outside $r = ${inner}$. Give an exact answer.`,
      `求在 $r = ${outer}$ 内且在 $r = ${inner}$ 外的区域的面积，给出精确值。`,
    ),
    answer,
    [
      [
        ["Find where they meet", "求交点"],
        t(
          `The curves meet where $${fn}\\theta = 0$, at $${meet}$, and the region lies between them.`,
          `两曲线在 $${fn}\\theta = 0$ 处相交，即 $${meet}$，区域位于两者之间。`,
        ),
      ],
      [
        ["Set up the integral", "列出积分"],
        t("Subtract the squares of the radii:", "两个半径的平方相减："),
        [
          `A = \\frac{1}{2}\\int_{${lo}}^{${hi}} \\left[${sq(outer)} - ${sq(inner)}\\right] d\\theta = ${over2(a2)}\\int_{${lo}}^{${hi}} \\left(2${fn}\\theta ${sign} ${fn}^{2}\\theta\\right) d\\theta`,
        ],
      ],
      [
        ["Integrate", "积分"],
        t(
          `Over this interval the two trigonometric integrals are\n\n$$\\int 2${fn}\\theta \\, d\\theta = 4, \\quad \\int ${fn}^{2}\\theta \\, d\\theta = \\frac{\\pi}{2}$$\n\nSo`,
          `在这个区间上两个三角积分为\n\n$$\\int 2${fn}\\theta \\, d\\theta = 4, \\quad \\int ${fn}^{2}\\theta \\, d\\theta = \\frac{\\pi}{2}$$\n\n于是`,
        ),
        [`A = ${over2(a2)}\\left(4 ${sign} \\frac{\\pi}{2}\\right) = ${answer}`],
      ],
    ],
    t(
      `Split the region into two simpler areas over the same interval. The cardioid $r = ${cardioid}$ sweeps\n\n$$\\frac{1}{2}\\int_{${lo}}^{${hi}} ${sq(cardioid)} \\, d\\theta = ${cardioidHalf}$$\n\nThe circle $r = ${a}$ sweeps half its disc, $${halfDisc}$. ${insideCardioid ? "The first minus the second" : "The second minus the first"} is\n\n$$${insideCardioid ? `${cardioidHalf} - ${halfDisc}` : `${halfDisc} - \\left(${cardioidHalf}\\right)`} = ${answer}$$`,
      `在同一区间上把区域拆成两个更简单的面积。心形线 $r = ${cardioid}$ 扫过\n\n$$\\frac{1}{2}\\int_{${lo}}^{${hi}} ${sq(cardioid)} \\, d\\theta = ${cardioidHalf}$$\n\n圆 $r = ${a}$ 扫过半个圆盘 $${halfDisc}$。${insideCardioid ? "前者减后者" : "后者减前者"}得\n\n$$${insideCardioid ? `${cardioidHalf} - ${halfDisc}` : `${halfDisc} - \\left(${cardioidHalf}\\right)`} = ${answer}$$`,
    ),
    [
      say(
        `${2 * a2} ${insideCardioid ? "-" : "+"} ${piL(Q.of(a2, 4))}`,
        "The sign of the $\\frac{\\pi}{4}$ term is wrong: it comes from squaring the cardioid's radius.",
        "$\\frac{\\pi}{4}$ 那一项的符号错了：它来自心形线半径的平方。",
      ),
      say(
        `${a2} ${sign} ${piL(Q.of(a2, 4))}`,
        `This takes $\\int 2${fn}\\theta \\, d\\theta$ as $2$; over the whole interval it is $4$.`,
        `这里把 $\\int 2${fn}\\theta \\, d\\theta$ 算成 $2$；在整个区间上它是 $4$。`,
      ),
      say(
        piL(Q.of(3 * a2, 2)),
        "This is the area of the whole cardioid, not the region between the curves.",
        "这是整个心形线的面积，不是两曲线之间的区域。",
      ),
    ],
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
  intro: t(
    "The ring between the circles $r = 1$ and $r = 2$ is swept as $\\theta$ runs from $0$ to $2\\pi$, so\n\n$$A = \\frac{1}{2}\\int_{0}^{2\\pi} (2^{2} - 1^{2}) \\, d\\theta = 3\\pi$$\n\nCheck: the big disc has area $4\\pi$ and the small one $\\pi$, and $4\\pi - \\pi = 3\\pi$.\n\nIn this lesson we find areas between two polar curves that meet, integrating the difference of the squares between the angles where they cross.",
    "圆 $r = 1$ 与 $r = 2$ 之间的圆环在 $\\theta$ 从 $0$ 变到 $2\\pi$ 时扫出，所以\n\n$$A = \\frac{1}{2}\\int_{0}^{2\\pi} (2^{2} - 1^{2}) \\, d\\theta = 3\\pi$$\n\n检验：大圆盘面积为 $4\\pi$，小圆盘为 $\\pi$，而 $4\\pi - \\pi = 3\\pi$。\n\n这节课我们求两条相交的极坐标曲线之间的面积，在交点对应的角之间积分平方之差。",
  ),
  prerequisites: ["the-total-area-bounded-by-a-single-polar-curve"],
  encompasses: [{ topic: "the-total-area-bounded-by-a-single-polar-curve", weight: 0.4 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "areas-between-two-circles",
      figure: calculusDrawings5["the-area-bounded-by-two-polar-curves#areas-between-two-circles"],
      title: t("Areas between two circles", "两圆之间的面积"),
      explanation: t(
        "Find the angles where the curves meet, then subtract the inner region from the outer:\n\n$$A = \\frac{1}{2}\\int_{\\alpha}^{\\beta} \\left(r_{\\text{outer}}^{2} - r_{\\text{inner}}^{2}\\right) d\\theta$$\n\nInside $r = 2\\cos\\theta$ and outside $r = 1$: the circles meet at $\\theta = \\pm\\frac{\\pi}{3}$, and\n\n$$A = \\frac{1}{2}\\int_{-\\pi/3}^{\\pi/3} (4\\cos^{2}\\theta - 1) \\, d\\theta = \\frac{\\pi}{3} + \\frac{\\sqrt{3}}{2}$$\n\nCheck: the disc inside $r = 2\\cos\\theta$ has area $\\pi$. Its overlap with the unit disc is two segments, each a sector of angle $\\frac{2\\pi}{3}$ minus a triangle, so\n\n$$\\pi - 2\\left(\\frac{\\pi}{3} - \\frac{\\sqrt{3}}{4}\\right) = \\frac{\\pi}{3} + \\frac{\\sqrt{3}}{2}$$\n\n> **Watch out.** Square each radius before subtracting. The integrand is $r_{\\text{outer}}^{2} - r_{\\text{inner}}^{2}$, not $(r_{\\text{outer}} - r_{\\text{inner}})^{2}$.",
        "先求两曲线相交处的角，再用外区域减去内区域：\n\n$$A = \\frac{1}{2}\\int_{\\alpha}^{\\beta} \\left(r_{\\text{外}}^{2} - r_{\\text{内}}^{2}\\right) d\\theta$$\n\n在 $r = 2\\cos\\theta$ 内、$r = 1$ 外：两圆在 $\\theta = \\pm\\frac{\\pi}{3}$ 处相交，\n\n$$A = \\frac{1}{2}\\int_{-\\pi/3}^{\\pi/3} (4\\cos^{2}\\theta - 1) \\, d\\theta = \\frac{\\pi}{3} + \\frac{\\sqrt{3}}{2}$$\n\n检验：$r = 2\\cos\\theta$ 围成的圆盘面积为 $\\pi$。它与单位圆盘的重叠部分是两个弓形，每个是圆心角 $\\frac{2\\pi}{3}$ 的扇形减去一个三角形，所以\n\n$$\\pi - 2\\left(\\frac{\\pi}{3} - \\frac{\\sqrt{3}}{4}\\right) = \\frac{\\pi}{3} + \\frac{\\sqrt{3}}{2}$$\n\n> **注意。** 先把每个半径平方再相减。被积函数是 $r_{\\text{外}}^{2} - r_{\\text{内}}^{2}$，不是 $(r_{\\text{外}} - r_{\\text{内}})^{2}$。",
      ),
      generate: circleLensArea,
    },
    {
      id: "areas-between-a-cardioid-and-a-circle",
      figure: calculusDrawings5["the-area-bounded-by-two-polar-curves#areas-between-a-cardioid-and-a-circle"],
      title: t("Areas between a cardioid and a circle", "心形线与圆之间的面积"),
      explanation: t(
        "The cardioid $r = a(1 + \\cos\\theta)$ and the circle $r = a$ meet where $\\cos\\theta = 0$. The cardioid is outside the circle for $-\\frac{\\pi}{2} < \\theta < \\frac{\\pi}{2}$, so the area inside the cardioid and outside the circle is\n\n$$\\frac{a^{2}}{2}\\int_{-\\pi/2}^{\\pi/2} (2\\cos\\theta + \\cos^{2}\\theta) \\, d\\theta = a^{2}\\left(2 + \\frac{\\pi}{4}\\right)$$\n\nCheck: over the same interval the cardioid sweeps $\\frac{a^{2}}{2}\\left(\\pi + 4 + \\frac{\\pi}{2}\\right) = \\frac{3\\pi a^{2}}{4} + 2a^{2}$, and the circle sweeps half its disc, $\\frac{\\pi a^{2}}{2}$. The difference is $2a^{2} + \\frac{\\pi a^{2}}{4}$.\n\n> **Watch out.** Square each radius separately: $(1 + \\cos\\theta)^{2} - 1 = 2\\cos\\theta + \\cos^{2}\\theta$, not $\\cos^{2}\\theta$.",
        "心形线 $r = a(1 + \\cos\\theta)$ 与圆 $r = a$ 在 $\\cos\\theta = 0$ 处相交。当 $-\\frac{\\pi}{2} < \\theta < \\frac{\\pi}{2}$ 时心形线在圆外，所以在心形线内、圆外的面积为\n\n$$\\frac{a^{2}}{2}\\int_{-\\pi/2}^{\\pi/2} (2\\cos\\theta + \\cos^{2}\\theta) \\, d\\theta = a^{2}\\left(2 + \\frac{\\pi}{4}\\right)$$\n\n检验：在同一区间上心形线扫过 $\\frac{a^{2}}{2}\\left(\\pi + 4 + \\frac{\\pi}{2}\\right) = \\frac{3\\pi a^{2}}{4} + 2a^{2}$，圆扫过半个圆盘 $\\frac{\\pi a^{2}}{2}$。两者之差为 $2a^{2} + \\frac{\\pi a^{2}}{4}$。\n\n> **注意。** 每个半径分别平方：$(1 + \\cos\\theta)^{2} - 1 = 2\\cos\\theta + \\cos^{2}\\theta$，不是 $\\cos^{2}\\theta$。",
      ),
      generate: cardioidCircleArea,
    },
  ],
};

/** cardioidArcs are the ends β of the arcs 0 ≤ θ ≤ β with sin(β/2), the length and half of it as multiples of a. */
const cardioidArcs: readonly (readonly [string, string, (a: number) => string, (a: number) => string])[] = [
  ["\\frac{\\pi}{3}", "\\frac{1}{2}", (a) => `${2 * a}`, (a) => `${a}`],
  ["\\frac{2\\pi}{3}", "\\frac{\\sqrt{3}}{2}", (a) => rootTimes(Q.of(2 * a), 3, ""), (a) => rootTimes(Q.of(a), 3, "")],
  ["\\pi", "1", (a) => `${4 * a}`, (a) => `${2 * a}`],
  ["2\\pi", "", (a) => `${8 * a}`, (a) => `${4 * a}`],
];

/** cardioidLength measures arcs of the cardioid r = a(1 + cos θ). */
function cardioidLength(rng: Rng) {
  const a = rng.int(1, 8);
  const [beta, sinHalf, length, half] = rng.pick(cardioidArcs);
  const answer = length(a);
  const whole = beta === "2\\pi";
  const A2 = k1(a * a);
  const integrand: Step = [
    ["Simplify the integrand", "化简被积函数"],
    t("Use $1 + \\cos\\theta = 2\\cos^{2}\\frac{\\theta}{2}$:", "用 $1 + \\cos\\theta = 2\\cos^{2}\\frac{\\theta}{2}$："),
    [
      `r^{2} + (r')^{2} = ${A2}(1 + \\cos\\theta)^{2} + ${A2}\\sin^{2}\\theta = ${2 * a * a}(1 + \\cos\\theta) = ${4 * a * a}\\cos^{2}\\frac{\\theta}{2}`,
      `\\sqrt{r^{2} + (r')^{2}} = ${2 * a}\\left|\\cos\\frac{\\theta}{2}\\right|`,
    ],
  ];
  const integral = `${4 * a}\\sin\\frac{\\theta}{2}\\Big|_{0}^{${beta}}`;
  return exactWorked(
    t(
      whole
        ? `Find the total length of the cardioid $r = ${k1(a)}(1 + \\cos\\theta)$.`
        : `Find the length of the arc of $r = ${k1(a)}(1 + \\cos\\theta)$ for $0 \\le \\theta \\le ${beta}$. Give an exact answer.`,
      whole
        ? `求心形线 $r = ${k1(a)}(1 + \\cos\\theta)$ 的全长。`
        : `求曲线 $r = ${k1(a)}(1 + \\cos\\theta)$ 在 $0 \\le \\theta \\le ${beta}$ 上的弧长，给出精确值。`,
    ),
    answer,
    whole
      ? [
          integrand,
          [
            ["Use symmetry", "利用对称性"],
            t(
              "The cardioid is symmetric about the $x$-axis, and on $[0, \\pi]$ the cosine of $\\frac{\\theta}{2}$ is not negative:",
              "心形线关于 $x$ 轴对称，而在 $[0, \\pi]$ 上 $\\frac{\\theta}{2}$ 的余弦不为负：",
            ),
            [
              `L = 2\\int_{0}^{\\pi} ${2 * a}\\cos\\frac{\\theta}{2} \\, d\\theta = 2 \\cdot ${4 * a}\\sin\\frac{\\theta}{2}\\Big|_{0}^{\\pi} = ${answer}`,
            ],
          ],
        ]
      : [
          integrand,
          [
            ["Integrate", "积分"],
            t(`On $[0, ${beta}]$, $\\cos\\frac{\\theta}{2} \\ge 0$, so`, `在 $[0, ${beta}]$ 上 $\\cos\\frac{\\theta}{2} \\ge 0$，所以`),
            [
              `L = \\int_{0}^{${beta}} ${2 * a}\\cos\\frac{\\theta}{2} \\, d\\theta = ${integral} = ${sinHalf === "1" ? answer : `${4 * a} \\cdot ${sinHalf} = ${answer}`}`,
            ],
          ],
        ],
    whole
      ? t(
          `Handle the absolute value without symmetry: $\\cos\\frac{\\theta}{2} < 0$ for $\\pi < \\theta < 2\\pi$, so split there:\n\n$$\\int_{0}^{\\pi} ${2 * a}\\cos\\frac{\\theta}{2} \\, d\\theta + \\int_{\\pi}^{2\\pi} \\left(-${2 * a}\\cos\\frac{\\theta}{2}\\right) d\\theta = ${4 * a} + ${4 * a} = ${answer}$$`,
          `不用对称性，直接处理绝对值：当 $\\pi < \\theta < 2\\pi$ 时 $\\cos\\frac{\\theta}{2} < 0$，所以在那里分开：\n\n$$\\int_{0}^{\\pi} ${2 * a}\\cos\\frac{\\theta}{2} \\, d\\theta + \\int_{\\pi}^{2\\pi} \\left(-${2 * a}\\cos\\frac{\\theta}{2}\\right) d\\theta = ${4 * a} + ${4 * a} = ${answer}$$`,
        )
      : t(
          `Differentiate the antiderivative back:\n\n$$\\frac{d}{d\\theta}\\left(${4 * a}\\sin\\frac{\\theta}{2}\\right) = ${2 * a}\\cos\\frac{\\theta}{2}$$\n\nThis is the integrand, and the antiderivative is $0$ at $\\theta = 0$.`,
          `把原函数求导回去：\n\n$$\\frac{d}{d\\theta}\\left(${4 * a}\\sin\\frac{\\theta}{2}\\right) = ${2 * a}\\cos\\frac{\\theta}{2}$$\n\n这正是被积函数，且原函数在 $\\theta = 0$ 处为 $0$。`,
        ),
    whole
      ? [
          say(
            half(a),
            "This is only the upper half, $0 \\le \\theta \\le \\pi$; the cardioid has two equal halves.",
            "这只是上半部分 $0 \\le \\theta \\le \\pi$；心形线有两个相等的半边。",
          ),
          say(
            "0",
            "This drops the absolute value: $\\cos\\frac{\\theta}{2} < 0$ for $\\pi < \\theta < 2\\pi$, and a length cannot cancel.",
            "这里丢掉了绝对值：当 $\\pi < \\theta < 2\\pi$ 时 $\\cos\\frac{\\theta}{2} < 0$，而长度不会互相抵消。",
          ),
          say(
            piL(Q.of(2 * a)),
            `This is the length of a circle of radius $${a}$, not of the cardioid.`,
            `这是半径为 $${a}$ 的圆的周长，不是心形线的长度。`,
          ),
        ]
      : [
          say(`${8 * a}`, "This is the length of the whole cardioid.", "这是整条心形线的长度。"),
          say(
            half(a),
            "This forgets the factor $2$ from integrating $\\cos\\frac{\\theta}{2}$: its antiderivative is $2\\sin\\frac{\\theta}{2}$.",
            "这里漏掉了积分 $\\cos\\frac{\\theta}{2}$ 产生的因子 $2$：它的原函数是 $2\\sin\\frac{\\theta}{2}$。",
          ),
        ],
  );
}

/** otherPolarLength measures r = θ² or an arc of the circle r = 2a sin θ. */
function otherPolarLength(rng: Rng) {
  if (rng.bool()) {
    const b = rng.int(1, 5);
    const N = b * b + 4;
    const power = rootTimes(Q.of(N), N, "");
    const answer = `\\frac{1}{3}\\left(${power} - 8\\right)`;
    return exactWorked(
      t(
        `Find the length of the polar curve $r = \\theta^{2}$ for $0 \\le \\theta \\le ${b}$. Give an exact answer.`,
        `求极坐标曲线 $r = \\theta^{2}$（$0 \\le \\theta \\le ${b}$）的长度，给出精确值。`,
      ),
      answer,
      [
        [
          ["Simplify the integrand", "化简被积函数"],
          t(
            "Here $r' = 2\\theta$, and for $\\theta \\ge 0$ the root comes out as a product:",
            "这里 $r' = 2\\theta$，当 $\\theta \\ge 0$ 时开方得到一个乘积：",
          ),
          [`\\sqrt{r^{2} + (r')^{2}} = \\sqrt{\\theta^{4} + 4\\theta^{2}} = \\theta\\sqrt{\\theta^{2} + 4}`],
        ],
        [
          ["Substitute", "换元"],
          t(
            `With $u = \\theta^{2} + 4$, $du = 2\\theta \\, d\\theta$, and $u$ runs from $4$ to $${N}$:`,
            `令 $u = \\theta^{2} + 4$，则 $du = 2\\theta \\, d\\theta$，$u$ 从 $4$ 变到 $${N}$：`,
          ),
          [
            `L = \\frac{1}{2}\\int_{4}^{${N}} \\sqrt{u} \\, du = \\frac{1}{3}u^{3/2}\\Big|_{4}^{${N}} = \\frac{1}{3}\\left(${N}^{3/2} - 8\\right) = ${answer}`,
          ],
        ],
      ],
      t(
        "Differentiate the antiderivative back:\n\n$$\\frac{d}{d\\theta}\\left[\\frac{1}{3}(\\theta^{2} + 4)^{3/2}\\right] = \\frac{1}{3} \\cdot \\frac{3}{2}(\\theta^{2} + 4)^{1/2} \\cdot 2\\theta = \\theta\\sqrt{\\theta^{2} + 4}$$\n\nThis is the integrand, so the length is the change in the antiderivative.",
        "把原函数求导回去：\n\n$$\\frac{d}{d\\theta}\\left[\\frac{1}{3}(\\theta^{2} + 4)^{3/2}\\right] = \\frac{1}{3} \\cdot \\frac{3}{2}(\\theta^{2} + 4)^{1/2} \\cdot 2\\theta = \\theta\\sqrt{\\theta^{2} + 4}$$\n\n这就是被积函数，所以长度等于原函数的改变量。",
      ),
      [
        say(
          `\\frac{${power}}{3}`,
          "This leaves out the lower limit: at $\\theta = 0$, $u = 4$ and $4^{3/2} = 8$.",
          "这里漏掉了下限：$\\theta = 0$ 时 $u = 4$，$4^{3/2} = 8$。",
        ),
        say(
          `\\frac{${b ** 3}}{3}`,
          "This integrates $r = \\theta^{2}$ itself, leaving out $r'$ and the square root.",
          "这里直接积分 $r = \\theta^{2}$，漏掉了 $r'$ 和平方根。",
        ),
        say(
          `\\frac{2}{3}\\left(${power} - 8\\right)`,
          "This forgets the $\\frac{1}{2}$ from $du = 2\\theta \\, d\\theta$.",
          "这里忘了 $du = 2\\theta \\, d\\theta$ 带来的 $\\frac{1}{2}$。",
        ),
      ],
    );
  }
  const a = rng.int(1, 6);
  const [beta, q] = rng.pick(sectorAngles.slice(0, 6));
  const fn = rng.bool() ? "\\sin" : "\\cos";
  const answer = piL(q.mul(Q.of(2 * a)));
  return exactWorked(
    t(
      `Find the length of the polar curve $r = ${2 * a}${fn}\\theta$ for $0 \\le \\theta \\le ${beta}$. Give an exact answer.`,
      `求极坐标曲线 $r = ${2 * a}${fn}\\theta$（$0 \\le \\theta \\le ${beta}$）的长度，给出精确值。`,
    ),
    answer,
    [
      [
        ["Simplify the integrand", "化简被积函数"],
        t(
          "Since $\\sin^{2}\\theta + \\cos^{2}\\theta = 1$, the integrand is constant:",
          "因为 $\\sin^{2}\\theta + \\cos^{2}\\theta = 1$，被积函数是常数：",
        ),
        [`r^{2} + (r')^{2} = ${4 * a * a}${fn}^{2}\\theta + ${4 * a * a}${fn === "\\sin" ? "\\cos" : "\\sin"}^{2}\\theta = ${4 * a * a}`],
      ],
      [
        ["Integrate", "积分"],
        t(`The root is $${2 * a}$.`, `其平方根为 $${2 * a}$。`),
        [`L = \\int_{0}^{${beta}} ${2 * a} \\, d\\theta = ${answer}`],
      ],
    ],
    t(
      `The curve is a circle of radius $${a}$ through the pole. As $\\theta$ grows by $${beta}$, the angle at the pole between the rays to two points of the circle grows by $${beta}$, and an inscribed angle is half the central angle on the same arc. So the arc has central angle $${piL(q.mul(Q.of(2)))}$ and length $${a} \\cdot ${piL(q.mul(Q.of(2)))} = ${answer}$.`,
      `这条曲线是经过极点、半径为 $${a}$ 的圆。$\\theta$ 增加 $${beta}$ 时，极点处到圆上两点的射线夹角增加 $${beta}$，而圆周角是同弧所对圆心角的一半。所以这段弧的圆心角为 $${piL(q.mul(Q.of(2)))}$，长度为 $${a} \\cdot ${piL(q.mul(Q.of(2)))} = ${answer}$。`,
    ),
    [
      say(
        piL(q.mul(Q.of(a))),
        `This uses $${a}$ for the root; $\\sqrt{${4 * a * a}} = ${2 * a}$.`,
        `这里把平方根取成了 $${a}$；$\\sqrt{${4 * a * a}} = ${2 * a}$。`,
      ),
      say(
        piL(q.mul(Q.of(4 * a * a))),
        `This forgets the square root: the integrand is $\\sqrt{${4 * a * a}} = ${2 * a}$.`,
        `这里忘了开平方：被积函数是 $\\sqrt{${4 * a * a}} = ${2 * a}$。`,
      ),
      say(
        piL(q.mul(Q.of(4 * a))),
        `This uses $${4 * a}$ for $\\sqrt{${4 * a * a}}$, which is $${2 * a}$.`,
        `这里把 $\\sqrt{${4 * a * a}}$ 算成了 $${4 * a}$，应为 $${2 * a}$。`,
      ),
    ],
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
  intro: t(
    "The upper half of the circle $x = 2\\cos t$, $y = 2\\sin t$, $0 \\le t \\le \\pi$, has length\n\n$$L = \\int_{0}^{\\pi} \\sqrt{4\\sin^{2} t + 4\\cos^{2} t} \\, dt = 2\\pi$$\n\nCheck: half the circumference of a circle of radius $2$ is $\\frac{1}{2} \\cdot 4\\pi = 2\\pi$.\n\nIn this lesson we measure polar curves $r = f(\\theta)$ in the same way: with $x = r\\cos\\theta$ and $y = r\\sin\\theta$ the speed becomes $\\sqrt{r^{2} + (r')^{2}}$.",
    "圆 $x = 2\\cos t$、$y = 2\\sin t$（$0 \\le t \\le \\pi$）的上半部分长度为\n\n$$L = \\int_{0}^{\\pi} \\sqrt{4\\sin^{2} t + 4\\cos^{2} t} \\, dt = 2\\pi$$\n\n检验：半径为 $2$ 的圆周长的一半是 $\\frac{1}{2} \\cdot 4\\pi = 2\\pi$。\n\n这节课我们用同样的方法测量极坐标曲线 $r = f(\\theta)$ 的长度：由 $x = r\\cos\\theta$、$y = r\\sin\\theta$，速率化为 $\\sqrt{r^{2} + (r')^{2}}$。",
  ),
  prerequisites: ["differentiating-curves-given-in-polar-form", "the-arc-length-of-a-parametric-curve"],
  encompasses: [{ topic: "the-arc-length-of-a-parametric-curve", weight: 0.4 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "arc-lengths-of-cardioids",
      figure: calculusDrawings5["the-arc-length-of-a-polar-curve#arc-lengths-of-cardioids"],
      title: t("Arc lengths of cardioids", "心形线的弧长"),
      explanation: t(
        "With $x = r\\cos\\theta$ and $y = r\\sin\\theta$, $\\left(\\frac{dx}{d\\theta}\\right)^{2} + \\left(\\frac{dy}{d\\theta}\\right)^{2} = r^{2} + (r')^{2}$, so\n\n$$L = \\int_{\\alpha}^{\\beta} \\sqrt{r^{2} + \\left(\\frac{dr}{d\\theta}\\right)^{2}} \\, d\\theta$$\n\nFor the cardioid $r = 1 + \\cos\\theta$ the integrand is $\\sqrt{2 + 2\\cos\\theta} = 2\\left|\\cos\\frac{\\theta}{2}\\right|$, and by symmetry the whole cardioid has length $2\\int_{0}^{\\pi} 2\\cos\\frac{\\theta}{2} \\, d\\theta = 8$.\n\nCheck: without symmetry, split where $\\cos\\frac{\\theta}{2}$ changes sign:\n\n$$\\int_{0}^{\\pi} 2\\cos\\frac{\\theta}{2} \\, d\\theta - \\int_{\\pi}^{2\\pi} 2\\cos\\frac{\\theta}{2} \\, d\\theta = 4 + 4 = 8$$\n\n> **Watch out.** Keep the absolute value. $\\int_{0}^{2\\pi} 2\\cos\\frac{\\theta}{2} \\, d\\theta = 0$, because $\\cos\\frac{\\theta}{2} < 0$ for $\\pi < \\theta < 2\\pi$.",
        "由 $x = r\\cos\\theta$、$y = r\\sin\\theta$，$\\left(\\frac{dx}{d\\theta}\\right)^{2} + \\left(\\frac{dy}{d\\theta}\\right)^{2} = r^{2} + (r')^{2}$，所以\n\n$$L = \\int_{\\alpha}^{\\beta} \\sqrt{r^{2} + \\left(\\frac{dr}{d\\theta}\\right)^{2}} \\, d\\theta$$\n\n对心形线 $r = 1 + \\cos\\theta$，被积函数为 $\\sqrt{2 + 2\\cos\\theta} = 2\\left|\\cos\\frac{\\theta}{2}\\right|$，由对称性，整条心形线的长度为 $2\\int_{0}^{\\pi} 2\\cos\\frac{\\theta}{2} \\, d\\theta = 8$。\n\n检验：不用对称性，在 $\\cos\\frac{\\theta}{2}$ 变号处分开：\n\n$$\\int_{0}^{\\pi} 2\\cos\\frac{\\theta}{2} \\, d\\theta - \\int_{\\pi}^{2\\pi} 2\\cos\\frac{\\theta}{2} \\, d\\theta = 4 + 4 = 8$$\n\n> **注意。** 要保留绝对值。$\\int_{0}^{2\\pi} 2\\cos\\frac{\\theta}{2} \\, d\\theta = 0$，因为当 $\\pi < \\theta < 2\\pi$ 时 $\\cos\\frac{\\theta}{2} < 0$。",
      ),
      generate: cardioidLength,
    },
    {
      id: "arc-lengths-of-other-polar-curves",
      figure: calculusDrawings5["the-arc-length-of-a-polar-curve#arc-lengths-of-other-polar-curves"],
      title: t("Arc lengths of other polar curves", "其他极坐标曲线的弧长"),
      explanation: t(
        "For the circle $r = 2a\\sin\\theta$, $r^{2} + (r')^{2} = 4a^{2}$, so the length is $2a$ times the change in $\\theta$. For $r = 2\\sin\\theta$ from $0$ to $\\frac{\\pi}{2}$ it is $2 \\cdot \\frac{\\pi}{2} = \\pi$. For $r = \\theta^{2}$, the integrand is $\\theta\\sqrt{\\theta^{2} + 4}$, which the substitution $u = \\theta^{2} + 4$ integrates.\n\nCheck: $r = 2\\sin\\theta$ is the circle of radius $1$ centered at $(0, 1)$. From $\\theta = 0$ to $\\frac{\\pi}{2}$ it runs from the pole to the top point $(0, 2)$, half the circle, of length $\\pi$.\n\n> **Watch out.** Take the square root: $\\sqrt{4a^{2}} = 2a$. Integrating $4a^{2}$ instead gives $2\\pi$ for this arc, twice too much here and wrong in general.",
        "对圆 $r = 2a\\sin\\theta$，$r^{2} + (r')^{2} = 4a^{2}$，所以长度等于 $2a$ 乘以 $\\theta$ 的变化量。对 $r = 2\\sin\\theta$，从 $0$ 到 $\\frac{\\pi}{2}$ 长度为 $2 \\cdot \\frac{\\pi}{2} = \\pi$。对 $r = \\theta^{2}$，被积函数为 $\\theta\\sqrt{\\theta^{2} + 4}$，用换元 $u = \\theta^{2} + 4$ 即可积分。\n\n检验：$r = 2\\sin\\theta$ 是以 $(0, 1)$ 为圆心、半径为 $1$ 的圆。从 $\\theta = 0$ 到 $\\frac{\\pi}{2}$，它从极点走到最高点 $(0, 2)$，正好半个圆，长度为 $\\pi$。\n\n> **注意。** 要开平方：$\\sqrt{4a^{2}} = 2a$。若直接积分 $4a^{2}$，这段弧会得到 $2\\pi$，这里多了一倍，一般情况下也不对。",
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
