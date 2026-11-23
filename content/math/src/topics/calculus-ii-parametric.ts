import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { calculusDrawings5 } from "../explanation-drawings-calculus-5.ts";

import { numberProblem, say } from "../problems.ts";
import { type Poly, pAt, pDer, pLatex } from "./calculus-common.ts";
import { functionWith, type Said, type Step, walked } from "./calculus-i-differentiation.ts";
import { intQ, times } from "./calculus-ii-areas.ts";
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
export function ratio(n: number, d: number) {
  if (d === 1) return `${n}`;
  const raw = `\\frac{${n}}{${d}}`;
  const q = Q.of(n, d).toLatex();
  return raw === q ? raw : `${raw} = ${q}`;
}

/** over writes s divided by a positive integer, leaving out a division by 1. */
const over = (s: string, n: number) => (n === 1 ? s : `\\frac{${s}}{${n}}`);

/** ellipse writes the Cartesian equation of x = a cos t, y = b sin t. */
const ellipse = (a: number, b: number) => `${over("x^{2}", a * a)} + ${over("y^{2}", b * b)} = 1`;

/** inP writes a number in parentheses when it is negative. */
export const inP = (q: Q | number) => {
  const v = typeof q === "number" ? Q.of(q) : q;
  return v.sign() < 0 ? `\\left(${v.toLatex()}\\right)` : v.toLatex();
};

/** pm writes " + q" or " - |q|", and nothing for zero. */
export const pm = (q: Q | number) => {
  const v = typeof q === "number" ? Q.of(q) : q;
  return v.isZero() ? "" : v.sign() > 0 ? ` + ${v.toLatex()}` : ` - ${v.abs().toLatex()}`;
};

/** minus writes v − n, leaving out a zero. */
const minus = (v: string, n: number) => `${v}${pm(-n)}`;

/** gcd is the greatest common divisor of two positive integers. */
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** Mistake is a wrong number with what to say about it. */
export type Mistake = { readonly value: Q; readonly why: Text };

/** slip is a wrong number with its reason in English and Chinese. */
export const slip = (value: Q | number, en: string, zh: string): Mistake => ({
  value: typeof value === "number" ? Q.of(value) : value,
  why: t(en, zh),
});

/** worked asks for a number, explains it in labelled steps with a check, and answers each distinct wrong value with its reason. */
export function worked(prompt: Text, answer: Q, parts: readonly Step[], check: Text, mistakes: readonly Mistake[]): Problem {
  const kept = mistakes.filter((m, i) => !m.value.eq(answer) && mistakes.findIndex((n) => n.value.eq(m.value)) === i);
  return numberProblem({ prompt, answer, mistakes: kept, solution: walked(parts, check) });
}

/** exactWorked asks for an exact expression and explains it in labelled steps with a check. */
export function exactWorked(prompt: Text, answer: string, parts: readonly Step[], check: Text, mistakes: readonly Said[]): Problem {
  return functionWith({ prompt, answer, solution: walked(parts, check) }, mistakes);
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

/** derivativesStep differentiates both coordinates of a polynomial curve. */
const derivativesStep = (x: Poly, y: Poly): Step => [
  ["Differentiate each coordinate", "分别对两个坐标求导"],
  t("Differentiate $x$ and $y$ with respect to $t$.", "把 $x$ 和 $y$ 分别对 $t$ 求导。"),
  [`\\frac{dx}{dt} = ${tL(pDer(x))}, \\quad \\frac{dy}{dt} = ${tL(pDer(y))}`],
];

/** chainCheck multiplies a slope back by dx/dt to recover dy/dt, as the chain rule requires. */
const chainCheck = (slope: Q, dx: number, dy: number): Text =>
  t(
    `By the chain rule, $\\frac{dy}{dt} = \\frac{dy}{dx} \\cdot \\frac{dx}{dt}$. Multiplying the slope by $\\frac{dx}{dt} = ${dx}$ gives back $\\frac{dy}{dt}$:\n\n$$\\left(${slope.toLatex()}\\right)\\left(${dx}\\right) = ${dy}$$`,
    `由链式法则，$\\frac{dy}{dt} = \\frac{dy}{dx} \\cdot \\frac{dx}{dt}$。把斜率乘以 $\\frac{dx}{dt} = ${dx}$，得回 $\\frac{dy}{dt}$：\n\n$$\\left(${slope.toLatex()}\\right)\\left(${dx}\\right) = ${dy}$$`,
  );

/** slopeAtAPoint finds dy/dx at a given t. */
function slopeAtAPoint(rng: Rng) {
  for (;;) {
    const { x, y } = randomCurve(rng);
    const t0 = rng.int(-2, 3);
    const [dx, dy] = [pAt(pDer(x), t0), pAt(pDer(y), t0)];
    if (dx === 0) continue;
    const answer = Q.of(dy, dx);
    return worked(
      t(
        `A curve is given by $${curve(tL(x), tL(y))}$. Find $\\frac{dy}{dx}$ at $t = ${t0}$.`,
        `曲线由 $${curve(tL(x), tL(y))}$ 给出。求 $t = ${t0}$ 时的 $\\frac{dy}{dx}$。`,
      ),
      answer,
      [
        derivativesStep(x, y),
        [
          [`Substitute $t = ${t0}$`, `代入 $t = ${t0}$`],
          t("Both rates at the given value of the parameter are", "参数取给定值时，两个变化率为"),
          [`\\frac{dx}{dt} = ${dx}, \\quad \\frac{dy}{dt} = ${dy}`],
        ],
        [
          ["Divide", "相除"],
          t("The slope is the vertical rate over the horizontal rate.", "斜率等于竖直变化率除以水平变化率。"),
          [`\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt} = ${ratio(dy, dx)}`],
        ],
      ],
      chainCheck(answer, dx, dy),
      [
        ...(dy === 0
          ? []
          : [
              slip(
                Q.of(dx, dy),
                "This is $\\frac{dx/dt}{dy/dt}$, upside down: the slope is the change in $y$ over the change in $x$.",
                "这是 $\\frac{dx/dt}{dy/dt}$，上下颠倒了：斜率是 $y$ 的变化除以 $x$ 的变化。",
              ),
            ]),
        slip(
          dy,
          "This is $\\frac{dy}{dt}$ alone; it still has to be divided by $\\frac{dx}{dt}$.",
          "这只是 $\\frac{dy}{dt}$，还要除以 $\\frac{dx}{dt}$。",
        ),
        slip(dx * dy, "This multiplies the two rates; the slope divides them.", "这里把两个变化率相乘了；斜率是两者相除。"),
        slip(dx, "This is $\\frac{dx}{dt}$, the horizontal rate, not the slope.", "这是水平变化率 $\\frac{dx}{dt}$，不是斜率。"),
      ],
    );
  }
}

/** slopeFunction writes dy/dx in terms of t. */
function slopeFunction(rng: Rng) {
  if (rng.int(0, 2) === 0) {
    const a = rng.int(1, 6);
    const b = rng.int(1, 6);
    const g = gcd(a, b);
    const [p, q] = [b / g, a / g];
    const answer = `-\\frac{${k1(p)}\\cos t}{${k1(q)}\\sin t}`;
    const shape = curve(`${k1(a)}\\cos t`, `${k1(b)}\\sin t`);
    return exactWorked(
      t(`A curve is given by $${shape}$. Find $\\frac{dy}{dx}$ in terms of $t$.`, `曲线由 $${shape}$ 给出。用 $t$ 表示 $\\frac{dy}{dx}$。`),
      answer,
      [
        [
          ["Differentiate each coordinate", "分别对两个坐标求导"],
          t("Differentiate $x$ and $y$ with respect to $t$.", "把 $x$ 和 $y$ 分别对 $t$ 求导。"),
          [`\\frac{dx}{dt} = -${k1(a)}\\sin t, \\quad \\frac{dy}{dt} = ${k1(b)}\\cos t`],
        ],
        [
          ["Divide", "相除"],
          t("Put $\\frac{dy}{dt}$ on top and simplify.", "把 $\\frac{dy}{dt}$ 放在分子上并化简。"),
          [`\\frac{dy}{dx} = \\frac{${k1(b)}\\cos t}{-${k1(a)}\\sin t} = ${answer}`],
        ],
      ],
      t(
        `Eliminate $t$ with $\\cos^{2} t + \\sin^{2} t = 1$:\n\n$$${ellipse(a, b)}$$\n\nDifferentiating implicitly and solving for the slope,\n\n$$\\frac{dy}{dx} = -\\frac{${k1(b * b)}x}{${k1(a * a)}y}$$\n\nPutting in $x = ${k1(a)}\\cos t$ and $y = ${k1(b)}\\sin t$ gives${a * b === 1 ? "" : ` $-\\frac{${a * b * b}\\cos t}{${a * a * b}\\sin t}$, which is`} $${answer}$.`,
        `用 $\\cos^{2} t + \\sin^{2} t = 1$ 消去 $t$：\n\n$$${ellipse(a, b)}$$\n\n隐函数求导并解出斜率，\n\n$$\\frac{dy}{dx} = -\\frac{${k1(b * b)}x}{${k1(a * a)}y}$$\n\n代入 $x = ${k1(a)}\\cos t$、$y = ${k1(b)}\\sin t$ 得${a * b === 1 ? "" : ` $-\\frac{${a * b * b}\\cos t}{${a * a * b}\\sin t}$，即`} $${answer}$。`,
      ),
      [
        say(
          `-\\frac{${k1(q)}\\sin t}{${k1(p)}\\cos t}`,
          "This is $\\frac{dx/dt}{dy/dt}$, upside down: put $\\frac{dy}{dt}$ on top.",
          "这是 $\\frac{dx/dt}{dy/dt}$，上下颠倒了：应把 $\\frac{dy}{dt}$ 放在分子上。",
        ),
        say(
          `\\frac{${k1(p)}\\cos t}{${k1(q)}\\sin t}`,
          "This drops the minus sign from $\\frac{d}{dt}\\cos t = -\\sin t$.",
          "漏掉了 $\\frac{d}{dt}\\cos t = -\\sin t$ 中的负号。",
        ),
        say(
          `-\\frac{${k1(p)}\\sin t}{${k1(q)}\\cos t}`,
          "This divides the coordinates themselves instead of their derivatives.",
          "这里用的是坐标本身相除，而不是它们的导数相除。",
        ),
      ],
    );
  }
  const x: Poly = [rng.int(-5, 5), rng.int(-4, 4), rng.nonZero(-3, 3)];
  const y: Poly = [rng.int(-5, 5), rng.int(-4, 4), rng.int(-2, 2), rng.nonZero(-1, 1)];
  const [dx, dy] = [tL(pDer(x)), tL(pDer(y))];
  const answer = `\\frac{${dy}}{${dx}}`;
  return exactWorked(
    t(
      `A curve is given by $${curve(tL(x), tL(y))}$. Find $\\frac{dy}{dx}$ in terms of $t$.`,
      `曲线由 $${curve(tL(x), tL(y))}$ 给出。用 $t$ 表示 $\\frac{dy}{dx}$。`,
    ),
    answer,
    [
      derivativesStep(x, y),
      [
        ["Divide", "相除"],
        t("The slope is the vertical rate over the horizontal rate.", "斜率等于竖直变化率除以水平变化率。"),
        [`\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt} = ${answer}`],
      ],
    ],
    t(
      `By the chain rule, $\\frac{dy}{dt} = \\frac{dy}{dx} \\cdot \\frac{dx}{dt}$. Multiplying the answer by $\\frac{dx}{dt} = ${dx}$ cancels the denominator and gives back $\\frac{dy}{dt} = ${dy}$.`,
      `由链式法则，$\\frac{dy}{dt} = \\frac{dy}{dx} \\cdot \\frac{dx}{dt}$。把答案乘以 $\\frac{dx}{dt} = ${dx}$，分母约去，得回 $\\frac{dy}{dt} = ${dy}$。`,
    ),
    [
      say(
        `\\frac{${dx}}{${dy}}`,
        "This is $\\frac{dx/dt}{dy/dt}$, upside down: put $\\frac{dy}{dt}$ on top.",
        "这是 $\\frac{dx/dt}{dy/dt}$，上下颠倒了：应把 $\\frac{dy}{dt}$ 放在分子上。",
      ),
      say(
        `\\frac{${tL(y)}}{${tL(x)}}`,
        "This divides the coordinates themselves instead of their derivatives.",
        "这里用的是坐标本身相除，而不是它们的导数相除。",
      ),
      say(`(${dy})(${dx})`, "This multiplies the two rates; the slope divides them.", "这里把两个变化率相乘了；斜率是两者相除。"),
    ],
  );
}

/** differentiatingParametricCurves finds dy/dx as the ratio of dy/dt to dx/dt. */
export const differentiatingParametricCurves: TopicDef = {
  id: "differentiating-parametric-curves",
  title: t("Differentiating Parametric Curves", "参数曲线的求导"),
  summary: t(
    "For x = f(t), y = g(t), the slope is dy/dx = (dy/dt)/(dx/dt) wherever dx/dt ≠ 0.",
    "对 x = f(t)、y = g(t)，在 dx/dt ≠ 0 处斜率为 dy/dx = (dy/dt)/(dx/dt)。",
  ),
  intro: t(
    "The curve $x = 2t$, $y = t^{2} + 1$ is the graph of a function of $x$: since $t = \\frac{x}{2}$,\n\n$$y = \\frac{x^{2}}{4} + 1, \\quad \\frac{dy}{dx} = \\frac{x}{2}$$\n\nAt $t = 1$ the point is $(2, 2)$ and the slope is $1$.\n\nCheck: the chain rule says $\\frac{dy}{dt} = \\frac{dy}{dx} \\cdot \\frac{dx}{dt}$. Here $\\frac{dy}{dt} = 2t = 2$ and $\\frac{dx}{dt} = 2$ at $t = 1$, and $1 \\times 2 = 2$ agrees.\n\nIn this lesson we find slopes of parametric curves straight from $\\frac{dy}{dt}$ and $\\frac{dx}{dt}$, without eliminating the parameter.",
    "曲线 $x = 2t$、$y = t^{2} + 1$ 是 $x$ 的函数的图像：由 $t = \\frac{x}{2}$，\n\n$$y = \\frac{x^{2}}{4} + 1, \\quad \\frac{dy}{dx} = \\frac{x}{2}$$\n\n在 $t = 1$ 时点为 $(2, 2)$，斜率为 $1$。\n\n检验：链式法则给出 $\\frac{dy}{dt} = \\frac{dy}{dx} \\cdot \\frac{dx}{dt}$。在 $t = 1$ 时 $\\frac{dy}{dt} = 2t = 2$，$\\frac{dx}{dt} = 2$，而 $1 \\times 2 = 2$，一致。\n\n这节课我们直接由 $\\frac{dy}{dt}$ 和 $\\frac{dx}{dt}$ 求参数曲线的斜率，不必消去参数。",
  ),
  prerequisites: ["graphing-curves-defined-parametrically", "the-chain-rule-for-differentiation"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-slope-at-a-point",
      title: t("The slope at a point", "某点处的斜率"),
      explanation: t(
        "On a parametric curve $x = f(t)$, $y = g(t)$, the chain rule gives $\\frac{dy}{dt} = \\frac{dy}{dx} \\cdot \\frac{dx}{dt}$, so\n\n$$\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt}, \\quad \\frac{dx}{dt} \\ne 0$$\n\nFor $x = t^{2}$, $y = t^{3} - t$ at $t = 2$: $\\frac{dx}{dt} = 4$ and $\\frac{dy}{dt} = 11$, so the slope is $\\frac{11}{4}$.\n\nCheck: for $t > 0$, $t = \\sqrt{x}$, so $y = x^{3/2} - x^{1/2}$ and\n\n$$\\frac{dy}{dx} = \\frac{3}{2}x^{1/2} - \\frac{1}{2}x^{-1/2}$$\n\nAt $t = 2$, $x = 4$, this is $3 - \\frac{1}{4}$, which is $\\frac{11}{4}$.\n\n> **Watch out.** Put $\\frac{dy}{dt}$ on top. Dividing the other way gives $\\frac{4}{11}$, the reciprocal of the slope.",
        "对参数曲线 $x = f(t)$、$y = g(t)$，由链式法则 $\\frac{dy}{dt} = \\frac{dy}{dx} \\cdot \\frac{dx}{dt}$，所以\n\n$$\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt}, \\quad \\frac{dx}{dt} \\ne 0$$\n\n对 $x = t^{2}$、$y = t^{3} - t$，在 $t = 2$ 处 $\\frac{dx}{dt} = 4$，$\\frac{dy}{dt} = 11$，斜率为 $\\frac{11}{4}$。\n\n检验：$t > 0$ 时 $t = \\sqrt{x}$，所以 $y = x^{3/2} - x^{1/2}$，\n\n$$\\frac{dy}{dx} = \\frac{3}{2}x^{1/2} - \\frac{1}{2}x^{-1/2}$$\n\n在 $t = 2$ 即 $x = 4$ 处，它等于 $3 - \\frac{1}{4}$，即 $\\frac{11}{4}$。\n\n> **注意。** 把 $\\frac{dy}{dt}$ 放在分子上。反过来相除得到 $\\frac{4}{11}$，是斜率的倒数。",
      ),
      generate: slopeAtAPoint,
    },
    {
      id: "the-slope-in-terms-of-t",
      title: t("The slope in terms of t", "用 t 表示斜率"),
      explanation: t(
        "For a curve given by a parameter, the slope is the rate of change of the vertical coordinate divided by the rate of change of the horizontal one. The same quotient gives $\\frac{dy}{dx}$ as a function of the parameter. For the ellipse $x = 3\\cos t$, $y = 2\\sin t$:\n\n$$\\frac{dy}{dx} = \\frac{2\\cos t}{-3\\sin t} = -\\frac{2\\cos t}{3\\sin t}$$\n\nCheck: the ellipse is $\\frac{x^{2}}{9} + \\frac{y^{2}}{4} = 1$. Implicit differentiation gives\n\n$$\\frac{dy}{dx} = -\\frac{4x}{9y} = -\\frac{4 \\cdot 3\\cos t}{9 \\cdot 2\\sin t} = -\\frac{2\\cos t}{3\\sin t}$$\n\n> **Watch out.** Differentiate before dividing. The ratio of the coordinates, $\\frac{2\\sin t}{3\\cos t}$, is the slope of the line from the origin to the point, not the slope of the curve.",
        "对于由参数给出的曲线，斜率等于竖直坐标的变化率除以水平坐标的变化率。同样的商把 $\\frac{dy}{dx}$ 表示为参数的函数。对椭圆 $x = 3\\cos t$、$y = 2\\sin t$：\n\n$$\\frac{dy}{dx} = \\frac{2\\cos t}{-3\\sin t} = -\\frac{2\\cos t}{3\\sin t}$$\n\n检验：这个椭圆是 $\\frac{x^{2}}{9} + \\frac{y^{2}}{4} = 1$。隐函数求导得\n\n$$\\frac{dy}{dx} = -\\frac{4x}{9y} = -\\frac{4 \\cdot 3\\cos t}{9 \\cdot 2\\sin t} = -\\frac{2\\cos t}{3\\sin t}$$\n\n> **注意。** 先求导再相除。坐标之比 $\\frac{2\\sin t}{3\\cos t}$ 是原点到该点连线的斜率，不是曲线的斜率。",
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
    const intercept = (k: Q) => Q.of(y0).sub(k.mul(Q.of(x0)));
    const line = (k: Q) => lineL(k, intercept(k));
    const answer = line(m);
    const name = normal ? t("normal", "法线") : t("tangent", "切线");
    const right = x0 === 0 ? `${coef(m)}x` : `${coef(m)}\\left(${minus("x", x0)}\\right)`;
    const atX0 = `${m.mul(Q.of(x0)).toLatex()}${pm(intercept(m))} = ${y0}`;
    return exactWorked(
      t(
        `Find the equation of the ${name.en} line to the curve $${curve(tL(x), tL(y))}$ at $t = ${t0}$. Write it as $y = mx + b$ and enter the right side.`,
        `求曲线 $${curve(tL(x), tL(y))}$ 在 $t = ${t0}$ 处的${name["zh-CN"]}方程。写成 $y = mx + b$，填写等号右边。`,
      ),
      answer,
      [
        [
          ["Find the point", "求切点"],
          t(`Substitute $t = ${t0}$ into both coordinates.`, `把 $t = ${t0}$ 代入两个坐标。`),
          [`x = ${x0}, \\quad y = ${y0}`],
        ],
        [
          ["Find the slope", "求斜率"],
          t(
            normal
              ? "Divide the rates to get the tangent slope, then take the negative reciprocal for the normal."
              : "Divide the rates at the same value of $t$.",
            normal ? "两个变化率相除得切线斜率，再取负倒数得法线斜率。" : "在同一个 $t$ 处两个变化率相除。",
          ),
          [
            `\\frac{dx}{dt} = ${dx}, \\quad \\frac{dy}{dt} = ${dy}`,
            `\\frac{dy}{dx} = ${ratio(dy, dx)}`,
            ...(normal ? [`m = -\\frac{1}{dy/dx} = ${other.toLatex()}`] : []),
          ],
        ],
        [
          ["Write the line", "写出直线"],
          t("Use the point-slope form and solve for $y$.", "用点斜式，再解出 $y$。"),
          [`${minus("y", y0)} = ${right}`, `y = ${answer}`],
        ],
      ],
      t(
        `Put $x = ${x0}$ into the line:\n\n$$y = ${atX0}$$\n\nSo the line passes through the point.${normal ? ` The slopes multiply to\n\n$$\\left(${slope.toLatex()}\\right)\\left(${other.toLatex()}\\right) = -1$$\n\nSo the line is perpendicular to the tangent.` : ` Multiplying the slope by $\\frac{dx}{dt}$ gives back $\\frac{dy}{dt}$, as the chain rule requires:\n\n$$\\left(${slope.toLatex()}\\right)\\left(${dx}\\right) = ${dy}$$`}`,
        `把 $x = ${x0}$ 代入直线：\n\n$$y = ${atX0}$$\n\n所以直线经过该点。${normal ? `两斜率之积为\n\n$$\\left(${slope.toLatex()}\\right)\\left(${other.toLatex()}\\right) = -1$$\n\n所以这条直线与切线垂直。` : `斜率乘以 $\\frac{dx}{dt}$ 得回 $\\frac{dy}{dt}$，符合链式法则：\n\n$$\\left(${slope.toLatex()}\\right)\\left(${dx}\\right) = ${dy}$$`}`,
      ),
      [
        say(
          line(normal ? slope : other),
          normal
            ? "This is the tangent line; the normal is perpendicular to it, with slope $-\\frac{1}{m}$."
            : "This is the normal line; the tangent's slope is $\\frac{dy/dt}{dx/dt}$ itself.",
          normal ? "这是切线；法线与切线垂直，斜率为 $-\\frac{1}{m}$。" : "这是法线；切线的斜率就是 $\\frac{dy/dt}{dx/dt}$ 本身。",
        ),
        say(
          line(Q.of(dx, dy)),
          normal
            ? "This slope is the reciprocal without the minus sign; perpendicular slopes multiply to $-1$."
            : "This slope is $\\frac{dx/dt}{dy/dt}$, upside down.",
          normal ? "这个斜率取了倒数却漏掉了负号；互相垂直的斜率之积为 $-1$。" : "这个斜率是 $\\frac{dx/dt}{dy/dt}$，上下颠倒了。",
        ),
        say(
          lineL(m, Q.of(y0)),
          `This uses $${y0}$ as the intercept; the line passes through $(${x0}, ${y0})$, not through $(0, ${y0})$.`,
          `这里把 $${y0}$ 当成了截距；直线经过的是 $(${x0}, ${y0})$，不是 $(0, ${y0})$。`,
        ),
      ],
    );
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
  const [c, o] = horizontal ? ["y", "x"] : ["x", "y"];
  const square = r === 0 ? "t^{2}" : `(${minus("t", r)})^{2}`;
  const word = horizontal ? t("horizontal", "水平") : t("vertical", "竖直");
  return worked(
    t(
      `The curve $${curve(tL(x), tL(y))}$ has exactly one ${word.en} tangent line. Find the $${c}$-coordinate of the point where it touches the curve.`,
      `曲线 $${curve(tL(x), tL(y))}$ 恰有一条${word["zh-CN"]}切线。求切点的 $${c}$ 坐标。`,
    ),
    Q.of(answer),
    [
      [
        [`Set $\\frac{d${c}}{dt} = 0$`, `令 $\\frac{d${c}}{dt} = 0$`],
        t(`A ${word.en} tangent needs $\\frac{d${c}}{dt} = 0$.`, `${word["zh-CN"]}切线要求 $\\frac{d${c}}{dt} = 0$。`),
        [`\\frac{d${c}}{dt} = ${tL(pDer(turning))} = 0, \\quad t = ${r}`],
      ],
      [
        ["Check the other rate", "检查另一个变化率"],
        t(
          `The other derivative must not be zero there: $\\frac{d${o}}{dt} = 3t^{2} + ${monotone[1]} > 0$ for every $t$.`,
          `另一个导数在该处不能为零：对一切 $t$，$\\frac{d${o}}{dt} = 3t^{2} + ${monotone[1]} > 0$。`,
        ),
      ],
      [["Find the point", "求切点"], t(`Substitute $t = ${r}$.`, `代入 $t = ${r}$。`), [`x = ${x0}, \\quad y = ${y0}`]],
    ],
    t(
      `Completing the square, $${c} = ${tL(turning)} = ${square}${pm(answer)}$. Its smallest value, $${answer}$, comes at $t = ${r}$, where $${c}$ stops decreasing and starts increasing, which is where the tangent is ${word.en}.`,
      `配方得 $${c} = ${tL(turning)} = ${square}${pm(answer)}$。它的最小值 $${answer}$ 在 $t = ${r}$ 处取得，此时 $${c}$ 由减变增，切线正是${word["zh-CN"]}的。`,
    ),
    [
      slip(
        r,
        "This is the value of $t$, not a coordinate; substitute it into the coordinates.",
        "这是 $t$ 的值，不是坐标；要把它代入坐标。",
      ),
      slip(
        horizontal ? x0 : y0,
        `This is the $${o}$-coordinate of the point; the question asks for its $${c}$-coordinate.`,
        `这是切点的 $${o}$ 坐标；题目问的是 $${c}$ 坐标。`,
      ),
      slip(
        k,
        "This is the constant term, the value at $t = 0$, not at the turning point.",
        "这是常数项，即 $t = 0$ 时的值，不是转折点处的值。",
      ),
    ],
  );
}

/** calculatingTangentAndNormalLinesWithParametricEquations finds tangent and normal lines to parametric curves. */
export const calculatingTangentAndNormalLinesWithParametricEquations: TopicDef = {
  id: "calculating-tangent-and-normal-lines-with-parametric-equations",
  title: t("Calculating Tangent and Normal Lines with Parametric Equations", "用参数方程求切线与法线"),
  summary: t(
    "The tangent at t₀ passes through (x(t₀), y(t₀)) with slope dy/dx; horizontal tangents have dy/dt = 0 and vertical ones dx/dt = 0.",
    "t₀ 处的切线过点 (x(t₀), y(t₀))，斜率为 dy/dx；水平切线满足 dy/dt = 0，竖直切线满足 dx/dt = 0。",
  ),
  intro: t(
    "On the curve $x = t^{2}$, $y = t^{3}$, at $t = 1$ the point is $(1, 1)$ and the slope is\n\n$$\\frac{dy}{dx} = \\frac{3t^{2}}{2t} = \\frac{3}{2}$$\n\nCheck: for $t > 0$ the curve is $y = x^{3/2}$, whose derivative $\\frac{3}{2}x^{1/2}$ is also $\\frac{3}{2}$ at $x = 1$.\n\nIn this lesson we use this slope and point to write the tangent and normal lines, and find where the tangent is horizontal or vertical.",
    "在曲线 $x = t^{2}$、$y = t^{3}$ 上，$t = 1$ 时点为 $(1, 1)$，斜率为\n\n$$\\frac{dy}{dx} = \\frac{3t^{2}}{2t} = \\frac{3}{2}$$\n\n检验：$t > 0$ 时曲线为 $y = x^{3/2}$，其导数 $\\frac{3}{2}x^{1/2}$ 在 $x = 1$ 处也等于 $\\frac{3}{2}$。\n\n这节课我们用这个斜率和点写出切线与法线，并找出切线水平或竖直的位置。",
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
        "Substitute the parameter value to get both the point and the slope there, then write the line through that point with that slope. At $t = t_{0}$, the point is $(x(t_{0}), y(t_{0}))$ and the slope $m$ is $\\frac{dy/dt}{dx/dt}$ evaluated at $t_{0}$:\n\n$$y - y(t_{0}) = m\\left(x - x(t_{0})\\right)$$\n\nFor $x = t^{2}$, $y = t^{3}$ at $t = 1$: the point is $(1, 1)$ and $m = \\frac{3}{2}$, so $y - 1 = \\frac{3}{2}(x - 1)$, which is $y = \\frac{3}{2}x - \\frac{1}{2}$.\n\nCheck: at $x = 1$ the line gives $\\frac{3}{2} - \\frac{1}{2} = 1$, the point on the curve.\n\n> **Watch out.** Use $t_{0}$ only to find the point and the slope. The line itself is in $x$ and $y$; $t$ does not appear in it.",
        "代入参数值，求出该点及其斜率，再写出经过该点、具有该斜率的直线。在 $t = t_{0}$ 处，点为 $(x(t_{0}), y(t_{0}))$，斜率 $m$ 为 $\\frac{dy/dt}{dx/dt}$ 在 $t_{0}$ 处的值：\n\n$$y - y(t_{0}) = m\\left(x - x(t_{0})\\right)$$\n\n对 $x = t^{2}$、$y = t^{3}$，在 $t = 1$ 处点为 $(1, 1)$，$m = \\frac{3}{2}$，所以 $y - 1 = \\frac{3}{2}(x - 1)$，即 $y = \\frac{3}{2}x - \\frac{1}{2}$。\n\n检验：$x = 1$ 时直线给出 $\\frac{3}{2} - \\frac{1}{2} = 1$，正是曲线上的点。\n\n> **注意。** $t_{0}$ 只用来求点和斜率。直线本身用 $x$ 和 $y$ 表示，其中不出现 $t$。",
      ),
      generate: (rng) => tangentOrNormal(rng, false),
    },
    {
      id: "normal-lines-to-parametric-curves",
      figure: calculusDrawings5["calculating-tangent-and-normal-lines-with-parametric-equations#normal-lines-to-parametric-curves"],
      title: t("Normal lines to parametric curves", "参数曲线的法线"),
      explanation: t(
        "The normal line is perpendicular to the tangent and passes through the same point $(x(t_{0}), y(t_{0}))$. Its slope is\n\n$$-\\frac{1}{m} = -\\frac{dx/dt}{dy/dt}$$\n\nFor $x = t^{2}$, $y = t^{3}$ at $t = 1$, the tangent slope is $\\frac{3}{2}$, so the normal slope is $-\\frac{2}{3}$ and the normal is $y - 1 = -\\frac{2}{3}(x - 1)$, which is $y = -\\frac{2}{3}x + \\frac{5}{3}$.\n\nCheck: $\\frac{3}{2} \\cdot \\left(-\\frac{2}{3}\\right) = -1$, so the lines are perpendicular, and at $x = 1$ the normal gives $-\\frac{2}{3} + \\frac{5}{3} = 1$.\n\n> **Watch out.** The normal slope needs both the reciprocal and the minus sign. $\\frac{2}{3}$ alone gives a line that is not perpendicular to the tangent.",
        "法线与切线垂直，且经过同一点 $(x(t_{0}), y(t_{0}))$。它的斜率为\n\n$$-\\frac{1}{m} = -\\frac{dx/dt}{dy/dt}$$\n\n对 $x = t^{2}$、$y = t^{3}$，在 $t = 1$ 处切线斜率为 $\\frac{3}{2}$，所以法线斜率为 $-\\frac{2}{3}$，法线为 $y - 1 = -\\frac{2}{3}(x - 1)$，即 $y = -\\frac{2}{3}x + \\frac{5}{3}$。\n\n检验：$\\frac{3}{2} \\cdot \\left(-\\frac{2}{3}\\right) = -1$，所以两线垂直；$x = 1$ 时法线给出 $-\\frac{2}{3} + \\frac{5}{3} = 1$。\n\n> **注意。** 法线斜率既要取倒数又要加负号。只取倒数 $\\frac{2}{3}$ 得到的直线与切线不垂直。",
      ),
      generate: (rng) => tangentOrNormal(rng, true),
    },
    {
      id: "horizontal-and-vertical-tangents",
      title: t("Horizontal and vertical tangents", "水平切线与竖直切线"),
      explanation: t(
        "The tangent is horizontal where $\\frac{dy}{dt} = 0$ and $\\frac{dx}{dt} \\ne 0$, and vertical where $\\frac{dx}{dt} = 0$ and $\\frac{dy}{dt} \\ne 0$. Solve for $t$, then substitute into $x(t)$ and $y(t)$ to find the point. For $x = t^{3} + t$, $y = t^{2} - 2t$:\n\n$$\\frac{dy}{dt} = 2t - 2 = 0, \\quad t = 1$$\n\nand $\\frac{dx}{dt} = 3t^{2} + 1 \\ne 0$, so the tangent is horizontal at $(2, -1)$.\n\nCheck: $y = (t - 1)^{2} - 1$ is smallest, $-1$, at $t = 1$, so the curve has its lowest point there, where the tangent must be horizontal.\n\n> **Watch out.** If both derivatives are zero at the same $t$, the formula $\\frac{dy/dt}{dx/dt}$ is $\\frac{0}{0}$ and says nothing; the curve may have a cusp there instead of a horizontal or vertical tangent.",
        "在 $\\frac{dy}{dt} = 0$ 且 $\\frac{dx}{dt} \\ne 0$ 处切线水平；在 $\\frac{dx}{dt} = 0$ 且 $\\frac{dy}{dt} \\ne 0$ 处切线竖直。先解出 $t$，再代入 $x(t)$、$y(t)$ 求出该点。对 $x = t^{3} + t$、$y = t^{2} - 2t$：\n\n$$\\frac{dy}{dt} = 2t - 2 = 0, \\quad t = 1$$\n\n且 $\\frac{dx}{dt} = 3t^{2} + 1 \\ne 0$，所以切线在 $(2, -1)$ 处水平。\n\n检验：$y = (t - 1)^{2} - 1$ 在 $t = 1$ 处取最小值 $-1$，曲线在这里到达最低点，切线必然水平。\n\n> **注意。** 若两个导数在同一个 $t$ 处都为零，公式 $\\frac{dy/dt}{dx/dt}$ 成为 $\\frac{0}{0}$，什么也说明不了；曲线在那里可能是尖点，而不是水平或竖直切线。",
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
    const rate = Q.of(top, x1 * x1);
    return worked(
      t(
        `A curve is given by $${curve(tL(x), tL(y))}$. Find $\\frac{d^{2}y}{dx^{2}}$ at $t = ${t0}$.`,
        `曲线由 $${curve(tL(x), tL(y))}$ 给出。求 $t = ${t0}$ 时的 $\\frac{d^{2}y}{dx^{2}}$。`,
      ),
      answer,
      [
        [
          ["Differentiate twice", "求两次导数"],
          t(`Find both derivatives of each coordinate, then substitute $t = ${t0}$.`, `求每个坐标的一阶和二阶导数，再代入 $t = ${t0}$。`),
          [
            `x' = ${tL(pDer(x))}, \\quad x'' = ${tL(pDer(pDer(x)))}`,
            `y' = ${tL(pDer(y))}, \\quad y'' = ${tL(pDer(pDer(y)))}`,
            `x' = ${x1}, \\quad x'' = ${x2}, \\quad y' = ${y1}, \\quad y'' = ${y2}`,
          ],
        ],
        [
          ["Use the formula", "用公式"],
          t(
            "Differentiate the slope $\\frac{y'}{x'}$ by the quotient rule and divide by $x'$:",
            "用商法则对斜率 $\\frac{y'}{x'}$ 求导，再除以 $x'$：",
          ),
          [
            `\\frac{d^{2}y}{dx^{2}} = \\frac{y''x' - y'x''}{(x')^{3}}`,
            `\\frac{d^{2}y}{dx^{2}} = \\frac{(${y2})(${x1}) - (${y1})(${x2})}{${inP(x1)}^{3}} = ${ratio(top, x1 ** 3)}`,
          ],
        ],
      ],
      t(
        `Do it in two stages instead. The $t$-derivative of the slope is\n\n$$\\frac{d}{dt}\\left(\\frac{dy}{dx}\\right) = \\frac{y''x' - y'x''}{(x')^{2}} = ${ratio(top, x1 * x1)}$$\n\nDividing it by $\\frac{dx}{dt} = ${x1}$ gives again $${answer.toLatex()}$.`,
        `换成分两步做。斜率对 $t$ 的导数为\n\n$$\\frac{d}{dt}\\left(\\frac{dy}{dx}\\right) = \\frac{y''x' - y'x''}{(x')^{2}} = ${ratio(top, x1 * x1)}$$\n\n再除以 $\\frac{dx}{dt} = ${x1}$，同样得 $${answer.toLatex()}$。`,
      ),
      [
        slip(
          rate,
          "This is $\\frac{d}{dt}\\left(\\frac{dy}{dx}\\right)$; it still has to be divided by $\\frac{dx}{dt}$.",
          "这是 $\\frac{d}{dt}\\left(\\frac{dy}{dx}\\right)$，还要除以 $\\frac{dx}{dt}$。",
        ),
        ...(x2 === 0
          ? []
          : [
              slip(
                Q.of(y2, x2),
                "This divides the second derivatives, $\\frac{y''}{x''}$, which is not $\\frac{d^{2}y}{dx^{2}}$.",
                "这是二阶导数之比 $\\frac{y''}{x''}$，它不是 $\\frac{d^{2}y}{dx^{2}}$。",
              ),
            ]),
        slip(
          Q.of(y2, x1),
          "This is $\\frac{y''}{x'}$; the quotient rule also brings in the term $-y'x''$ and another factor $x'$.",
          "这是 $\\frac{y''}{x'}$；商法则还会带来 $-y'x''$ 一项和另一个因子 $x'$。",
        ),
      ],
    );
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
  const yAt = Q.of(b * s, 2);
  const shape = curve(`${k1(a)}\\cos t`, `${k1(b)}\\sin t`);
  return worked(
    t(
      `A curve is given by $${shape}$. Find $\\frac{d^{2}y}{dx^{2}}$ at $t = ${angle}$.`,
      `曲线由 $${shape}$ 给出。求 $t = ${angle}$ 时的 $\\frac{d^{2}y}{dx^{2}}$。`,
    ),
    answer,
    [
      [
        ["Find the slope", "求斜率"],
        t("Divide the rates.", "两个变化率相除。"),
        [`\\frac{dy}{dx} = \\frac{${k1(b)}\\cos t}{-${k1(a)}\\sin t} = ${coef(Q.of(-b, a))}\\cot t`],
      ],
      [
        ["Differentiate the slope", "对斜率求导"],
        t("Differentiate with respect to $t$, then divide by $\\frac{dx}{dt}$.", "对 $t$ 求导，再除以 $\\frac{dx}{dt}$。"),
        [
          `\\frac{d}{dt}\\left(\\frac{dy}{dx}\\right) = ${coef(Q.of(b, a))}\\csc^{2} t`,
          `\\frac{d^{2}y}{dx^{2}} = \\frac{${coef(Q.of(b, a))}\\csc^{2} t}{-${k1(a)}\\sin t} = -\\frac{${b}}{${k1(a * a)}\\sin^{3} t}`,
        ],
      ],
      [
        [`Substitute $t = ${angle}$`, `代入 $t = ${angle}$`],
        t(
          `Here $\\sin t = ${sinL}$, so $\\sin^{3} t = ${Q.of(s ** 3, 8).toLatex()}$ and`,
          `这里 $\\sin t = ${sinL}$，所以 $\\sin^{3} t = ${Q.of(s ** 3, 8).toLatex()}$，`,
        ),
        [`\\frac{d^{2}y}{dx^{2}} = ${answer.toLatex()}`],
      ],
    ],
    t(
      `Use the Cartesian equation\n\n$$${ellipse(a, b)}$$\n\nDifferentiating it implicitly twice gives $y'' = -\\frac{${b ** 4}}{${k1(a * a)}y^{3}}$. At this point $y = ${k1(b)}\\sin t = ${yAt.toLatex()}$, so\n\n$$y'' = -\\frac{${b ** 4}}{${k1(a * a)}\\left(${yAt.toLatex()}\\right)^{3}} = ${answer.toLatex()}$$`,
      `用直角坐标方程\n\n$$${ellipse(a, b)}$$\n\n对它隐函数求导两次得 $y'' = -\\frac{${b ** 4}}{${k1(a * a)}y^{3}}$。该点处 $y = ${k1(b)}\\sin t = ${yAt.toLatex()}$，所以\n\n$$y'' = -\\frac{${b ** 4}}{${k1(a * a)}\\left(${yAt.toLatex()}\\right)^{3}} = ${answer.toLatex()}$$`,
    ),
    [
      slip(
        answer.neg(),
        "The sign is wrong: $\\frac{dx}{dt} = -a\\sin t$ carries a minus sign.",
        "符号错了：$\\frac{dx}{dt} = -a\\sin t$ 带有负号。",
      ),
      slip(
        Q.of(-b * 4, a * a * s * s),
        "This stops at $\\sin^{2} t$ in the denominator; dividing by $\\frac{dx}{dt}$ brings one more factor $\\sin t$.",
        "这里分母只到 $\\sin^{2} t$；除以 $\\frac{dx}{dt}$ 还要再乘一个因子 $\\sin t$。",
      ),
      slip(
        Q.of(-b * 8, a * s ** 3),
        "This has $a$ instead of $a^{2}$: one factor $a$ comes from $\\frac{dy}{dx}$ and another from dividing by $\\frac{dx}{dt}$.",
        "这里用了 $a$ 而不是 $a^{2}$：一个因子 $a$ 来自 $\\frac{dy}{dx}$，另一个来自除以 $\\frac{dx}{dt}$。",
      ),
    ],
  );
}

/** secondDerivativesOfParametricEquations differentiates dy/dx with respect to t and divides by dx/dt. */
export const secondDerivativesOfParametricEquations: TopicDef = {
  id: "second-derivatives-of-parametric-equations",
  title: t("Second Derivatives of Parametric Equations", "参数方程的二阶导数"),
  summary: t("d²y/dx² is the t-derivative of dy/dx divided by dx/dt.", "d²y/dx² 等于 dy/dx 对 t 的导数除以 dx/dt。"),
  intro: t(
    "On the curve $x = 2t$, $y = t^{2}$, the slope is\n\n$$\\frac{dy}{dx} = \\frac{2t}{2} = t$$\n\nso the slope grows as $t$ grows.\n\nCheck: eliminating $t = \\frac{x}{2}$ gives $y = \\frac{x^{2}}{4}$, whose derivative $\\frac{x}{2}$ is $t$ again, and whose second derivative is the constant $\\frac{1}{2}$.\n\nIn this lesson we find that second derivative straight from the parameter: differentiate the slope with respect to $t$ and divide by $\\frac{dx}{dt}$, which here gives $\\frac{1}{2}$.",
    "在曲线 $x = 2t$、$y = t^{2}$ 上，斜率为\n\n$$\\frac{dy}{dx} = \\frac{2t}{2} = t$$\n\n所以斜率随 $t$ 增大而增大。\n\n检验：消去 $t = \\frac{x}{2}$ 得 $y = \\frac{x^{2}}{4}$，其导数 $\\frac{x}{2}$ 也等于 $t$，二阶导数是常数 $\\frac{1}{2}$。\n\n这节课我们直接由参数求这个二阶导数：把斜率对 $t$ 求导，再除以 $\\frac{dx}{dt}$，这里得 $\\frac{1}{2}$。",
  ),
  prerequisites: ["differentiating-parametric-curves", "second-and-higher-order-derivatives"],
  encompasses: [{ topic: "differentiating-parametric-curves", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "second-derivatives-of-polynomial-curves",
      title: t("Second derivatives of polynomial curves", "多项式参数曲线的二阶导数"),
      explanation: t(
        "$\\frac{dy}{dx}$ is a function of $t$, so apply the parametric rule to it again:\n\n$$\\frac{d^{2}y}{dx^{2}} = \\frac{\\frac{d}{dt}\\left(\\frac{dy}{dx}\\right)}{dx/dt}$$\n\nFor $x = t^{2}$, $y = t^{3}$, the slope is $\\frac{3t}{2}$, its $t$-derivative is $\\frac{3}{2}$, and dividing by $\\frac{dx}{dt} = 2t$ gives\n\n$$\\frac{d^{2}y}{dx^{2}} = \\frac{3}{4t}$$\n\nCheck: for $t > 0$ the curve is $y = x^{3/2}$, so $y'' = \\frac{3}{4}x^{-1/2}$, and with $x^{1/2} = t$ this is $\\frac{3}{4t}$.\n\n> **Watch out.** It is not $\\frac{d^{2}y/dt^{2}}{d^{2}x/dt^{2}}$. Here that ratio is $\\frac{6t}{2} = 3t$, which is wrong.",
        "$\\frac{dy}{dx}$ 是 $t$ 的函数，所以对它再用一次参数求导法则：\n\n$$\\frac{d^{2}y}{dx^{2}} = \\frac{\\frac{d}{dt}\\left(\\frac{dy}{dx}\\right)}{dx/dt}$$\n\n对 $x = t^{2}$、$y = t^{3}$，斜率为 $\\frac{3t}{2}$，它对 $t$ 的导数为 $\\frac{3}{2}$，再除以 $\\frac{dx}{dt} = 2t$ 得\n\n$$\\frac{d^{2}y}{dx^{2}} = \\frac{3}{4t}$$\n\n检验：$t > 0$ 时曲线为 $y = x^{3/2}$，所以 $y'' = \\frac{3}{4}x^{-1/2}$，由 $x^{1/2} = t$ 得 $\\frac{3}{4t}$。\n\n> **注意。** 它不等于 $\\frac{d^{2}y/dt^{2}}{d^{2}x/dt^{2}}$。这里那个比值为 $\\frac{6t}{2} = 3t$，是错的。",
      ),
      generate: secondDerivativePolynomial,
    },
    {
      id: "second-derivatives-of-trigonometric-curves",
      title: t("Second derivatives of trigonometric curves", "三角参数曲线的二阶导数"),
      explanation: t(
        "For the ellipse $x = a\\cos t$, $y = b\\sin t$: $\\frac{dy}{dx} = -\\frac{b}{a}\\cot t$, its $t$-derivative is $\\frac{b}{a}\\csc^{2} t$, and dividing by $-a\\sin t$ gives\n\n$$\\frac{d^{2}y}{dx^{2}} = -\\frac{b}{a^{2}\\sin^{3} t}$$\n\nIt is negative on the upper half, where $\\sin t > 0$ and the ellipse is concave down. For $a = 2$, $b = 1$ at $t = \\frac{\\pi}{2}$, the top of the ellipse, it is $-\\frac{1}{4}$.\n\nCheck: near its top the ellipse $\\frac{x^{2}}{4} + y^{2} = 1$ is $y = \\sqrt{1 - \\frac{x^{2}}{4}}$, and differentiating twice at $x = 0$ gives $-\\frac{1}{4}$.\n\n> **Watch out.** Divide by $\\frac{dx}{dt} = -a\\sin t$, minus sign included. Forgetting it flips the concavity.",
        "对椭圆 $x = a\\cos t$、$y = b\\sin t$：$\\frac{dy}{dx} = -\\frac{b}{a}\\cot t$，它对 $t$ 的导数为 $\\frac{b}{a}\\csc^{2} t$，再除以 $-a\\sin t$ 得\n\n$$\\frac{d^{2}y}{dx^{2}} = -\\frac{b}{a^{2}\\sin^{3} t}$$\n\n在上半部分 $\\sin t > 0$，二阶导数为负，椭圆向下凹。对 $a = 2$、$b = 1$，在椭圆最高点 $t = \\frac{\\pi}{2}$ 处它等于 $-\\frac{1}{4}$。\n\n检验：在最高点附近，椭圆 $\\frac{x^{2}}{4} + y^{2} = 1$ 为 $y = \\sqrt{1 - \\frac{x^{2}}{4}}$，在 $x = 0$ 处求两次导数得 $-\\frac{1}{4}$。\n\n> **注意。** 要除以 $\\frac{dx}{dt} = -a\\sin t$，连同负号。漏掉负号会把凹凸性弄反。",
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
  const xOf = (s: number) => Q.of(s ** 3, 3).sub(Q.of(c * c * s));
  const deltaX = xOf(b).sub(xOf(a));
  return worked(
    t(
      `Find the length of the curve $${curve(cubicX(c), `${k1(c)}t^{2}`)}$ for $${a} \\le t \\le ${b}$.`,
      `求曲线 $${curve(cubicX(c), `${k1(c)}t^{2}`)}$（$${a} \\le t \\le ${b}$）的长度。`,
    ),
    answer,
    [
      [
        ["Find the speed", "求速率"],
        t("Square the two rates and add them.", "把两个变化率平方后相加。"),
        [
          `\\frac{dx}{dt} = t^{2} - ${c * c}, \\quad \\frac{dy}{dt} = ${2 * c}t`,
          `\\left(\\frac{dx}{dt}\\right)^{2} + \\left(\\frac{dy}{dt}\\right)^{2} = t^{4} + ${2 * c * c}t^{2} + ${c ** 4} = (t^{2} + ${c * c})^{2}`,
        ],
      ],
      [
        ["Integrate", "积分"],
        t(`The square root is $t^{2} + ${c * c}$, which is positive.`, `平方根为 $t^{2} + ${c * c}$，它是正的。`),
        [
          `L = \\int_{${a}}^{${b}} (t^{2} + ${c * c}) \\, dt = \\Big[\\frac{t^{3}}{3} + ${k1(c * c)}t\\Big]_{${a}}^{${b}} = ${answer.toLatex()}`,
        ],
      ],
    ],
    t(
      `Since $x = \\frac{t^{3}}{3} - ${k1(c * c)}t$, the antiderivative $\\frac{t^{3}}{3} + ${k1(c * c)}t$ is $x + ${2 * c * c}t$. So $L$ is the change in $x$, $${deltaX.toLatex()}$, plus $${2 * c * c}$ times the change in $t$, $${b - a}$:\n\n$$${deltaX.toLatex()} + ${2 * c * c * (b - a)} = ${answer.toLatex()}$$`,
      `由于 $x = \\frac{t^{3}}{3} - ${k1(c * c)}t$，原函数 $\\frac{t^{3}}{3} + ${k1(c * c)}t$ 等于 $x + ${2 * c * c}t$。所以 $L$ 等于 $x$ 的变化量 $${deltaX.toLatex()}$ 加上 $${2 * c * c}$ 乘以 $t$ 的变化量 $${b - a}$：\n\n$$${deltaX.toLatex()} + ${2 * c * c * (b - a)} = ${answer.toLatex()}$$`,
    ),
    [
      slip(
        deltaX,
        "This integrates $\\frac{dx}{dt}$, which gives the change in $x$, not the length.",
        "这里积分的是 $\\frac{dx}{dt}$，得到的是 $x$ 的变化量，不是长度。",
      ),
      slip(
        intQ([c ** 4, 0, 2 * c * c, 0, 1], a, b),
        "This integrates the sum of squares without taking its square root.",
        "这里对平方和积分，却没有开平方。",
      ),
      slip(
        Q.of(b ** 3 - a ** 3, 3),
        "This drops the constant $c^{2}$ from the speed $t^{2} + c^{2}$.",
        "这里漏掉了速率 $t^{2} + c^{2}$ 中的常数 $c^{2}$。",
      ),
    ],
  );
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
    const answer = q.mul(Q.of(r));
    const shape = curve(`${k1(r)}\\cos t${pm(h)}`, `${k1(r)}\\sin t${pm(k)}`);
    return exactWorked(
      t(
        `Find the length of the curve $${shape}$ for $0 \\le t \\le ${angle}$. Give an exact answer.`,
        `求曲线 $${shape}$（$0 \\le t \\le ${angle}$）的长度，给出精确值。`,
      ),
      piL(answer),
      [
        [
          ["Find the speed", "求速率"],
          t("Square the two rates and add them.", "把两个变化率平方后相加。"),
          [
            `\\frac{dx}{dt} = -${k1(r)}\\sin t, \\quad \\frac{dy}{dt} = ${k1(r)}\\cos t`,
            `\\left(\\frac{dx}{dt}\\right)^{2} + \\left(\\frac{dy}{dt}\\right)^{2} = ${k1(r * r)}\\left(\\sin^{2} t + \\cos^{2} t\\right) = ${r * r}`,
          ],
        ],
        [
          ["Integrate", "积分"],
          t(`The speed is the constant $\\sqrt{${r * r}} = ${r}$.`, `速率为常数 $\\sqrt{${r * r}} = ${r}$。`),
          [`L = \\int_{0}^{${angle}} ${r} \\, dt = ${piL(answer)}`],
        ],
      ],
      t(
        `The curve is the circle of radius $${r}$ centred at $(${h}, ${k})$, and $t$ is the angle turned. An arc of angle $${angle}$ is the fraction $\\frac{${angle}}{2\\pi}$ of the circumference $${piL(Q.of(2 * r))}$, which is $${piL(answer)}$.`,
        `这条曲线是以 $(${h}, ${k})$ 为圆心、半径为 $${r}$ 的圆，$t$ 是转过的角度。圆心角为 $${angle}$ 的弧占周长 $${piL(Q.of(2 * r))}$ 的 $\\frac{${angle}}{2\\pi}$，即 $${piL(answer)}$。`,
      ),
      [
        say(piL(answer.mul(Q.of(2))), "This is twice the length; the speed is $r$, not $2r$.", "这是长度的两倍；速率是 $r$，不是 $2r$。"),
        say(piL(q), "This is the angle alone; the speed $r$ multiplies it.", "这只是角度；还要乘以速率 $r$。"),
        say(
          piL(q.mul(Q.of(r * r))),
          "This integrates $r^{2}$, the square of the speed, without taking the square root.",
          "这里积分的是速率的平方 $r^{2}$，没有开平方。",
        ),
      ],
    );
  }
  const k = rng.int(1, 3);
  const b = rng.int(1, 4);
  const N = 1 + b * b;
  const cube = rootTimes(Q.of(N), N, "");
  const answer = `${2 * k}\\left(${cube} - 1\\right)`;
  const shape = curve(`${3 * k}t^{2}`, `${2 * k}t^{3}`);
  return exactWorked(
    t(
      `Find the length of the curve $${shape}$ for $0 \\le t \\le ${b}$. Give an exact answer.`,
      `求曲线 $${shape}$（$0 \\le t \\le ${b}$）的长度，给出精确值。`,
    ),
    answer,
    [
      [
        ["Find the speed", "求速率"],
        t("Square the two rates, add them and take out the square factor.", "把两个变化率平方后相加，再提出平方因子。"),
        [
          `\\frac{dx}{dt} = ${6 * k}t, \\quad \\frac{dy}{dt} = ${6 * k}t^{2}`,
          `\\sqrt{${36 * k * k}t^{2} + ${36 * k * k}t^{4}} = ${6 * k}t\\sqrt{1 + t^{2}}`,
        ],
      ],
      [
        ["Substitute", "换元"],
        t(
          `Let $w = 1 + t^{2}$, so $dw = 2t \\, dt$ and $w$ runs from $1$ to $${N}$.`,
          `令 $w = 1 + t^{2}$，则 $dw = 2t \\, dt$，$w$ 从 $1$ 变到 $${N}$。`,
        ),
        [`L = ${3 * k}\\int_{1}^{${N}} \\sqrt{w} \\, dw = ${2 * k}\\Big[w^{3/2}\\Big]_{1}^{${N}} = ${answer}`],
      ],
    ],
    t(
      `Differentiate the antiderivative back, in $t$:\n\n$$\\frac{d}{dt}\\left[${2 * k}(1 + t^{2})^{3/2}\\right] = ${6 * k}t\\sqrt{1 + t^{2}}$$\n\nThis is the speed. Its values at $t = ${b}$ and $t = 0$ are $${2 * k} \\cdot ${cube}$ and $${2 * k}$, whose difference is $${answer}$.`,
      `把原函数对 $t$ 求导代回：\n\n$$\\frac{d}{dt}\\left[${2 * k}(1 + t^{2})^{3/2}\\right] = ${6 * k}t\\sqrt{1 + t^{2}}$$\n\n这正是速率。它在 $t = ${b}$ 和 $t = 0$ 处的值为 $${2 * k} \\cdot ${cube}$ 和 $${2 * k}$，差为 $${answer}$。`,
    ),
    [
      say(`${2 * k}\\cdot ${cube}`, "This leaves out the value at the lower limit $w = 1$.", "这里漏掉了下限 $w = 1$ 处的值。"),
      say(
        `${k1(k)}\\left(${cube} - 1\\right)`,
        `This loses the factor $2$: $${3 * k} \\cdot \\frac{2}{3} = ${2 * k}$.`,
        `这里丢了因子 $2$：$${3 * k} \\cdot \\frac{2}{3} = ${2 * k}$。`,
      ),
      say(
        `${3 * k}\\left(${cube} - 1\\right)`,
        "This forgets the $\\frac{2}{3}$ from integrating $\\sqrt{w}$.",
        "这里忘了积分 $\\sqrt{w}$ 时产生的 $\\frac{2}{3}$。",
      ),
    ],
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
  intro: t(
    "The length of the graph of $y = 2x$ for $0 \\le x \\le 3$ is\n\n$$L = \\int_{0}^{3} \\sqrt{1 + 2^{2}} \\, dx = 3\\sqrt{5}$$\n\nCheck: the graph is the segment from $(0, 0)$ to $(3, 6)$, and the distance formula gives $\\sqrt{3^{2} + 6^{2}} = \\sqrt{45} = 3\\sqrt{5}$.\n\nIn this lesson we measure curves given by a parameter, such as $x = t$, $y = 2t$, by integrating the speed $\\sqrt{x'(t)^{2} + y'(t)^{2}}$ with respect to $t$.",
    "$y = 2x$（$0 \\le x \\le 3$）的图像长度为\n\n$$L = \\int_{0}^{3} \\sqrt{1 + 2^{2}} \\, dx = 3\\sqrt{5}$$\n\n检验：这个图像是从 $(0, 0)$ 到 $(3, 6)$ 的线段，距离公式给出 $\\sqrt{3^{2} + 6^{2}} = \\sqrt{45} = 3\\sqrt{5}$。\n\n这节课我们测量由参数给出的曲线（如 $x = t$、$y = 2t$）的长度：把速率 $\\sqrt{x'(t)^{2} + y'(t)^{2}}$ 对 $t$ 积分。",
  ),
  prerequisites: ["differentiating-parametric-curves", "the-arc-length-of-a-planar-curve"],
  encompasses: [{ topic: "the-arc-length-of-a-planar-curve", weight: 0.4 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "arc-length-with-a-perfect-square-speed",
      figure: calculusDrawings5["the-arc-length-of-a-parametric-curve#arc-length-with-a-perfect-square-speed"],
      title: t("Arc length with a perfect-square speed", "速率为完全平方时的弧长"),
      explanation: t(
        "In a short time $dt$ the point moves $dx = x'(t) \\, dt$ across and $dy = y'(t) \\, dt$ up, a distance $\\sqrt{x'(t)^{2} + y'(t)^{2}} \\, dt$. So\n\n$$L = \\int_{a}^{b} \\sqrt{\\left(\\frac{dx}{dt}\\right)^{2} + \\left(\\frac{dy}{dt}\\right)^{2}} \\, dt$$\n\nassuming the curve is traced once. For $x = \\frac{1}{3}t^{3} - t$, $y = t^{2}$, the sum under the root is $(t^{2} - 1)^{2} + 4t^{2} = (t^{2} + 1)^{2}$, so $L = \\int_{0}^{3} (t^{2} + 1) \\, dt = 12$.\n\nCheck: the antiderivative $\\frac{t^{3}}{3} + t$ is $x + 2t$, so $L$ is the change in $x$, $9 - 3 = 6$, plus twice the change in $t$, $6$, which is $12$.\n\n> **Watch out.** Take the square root before integrating. Integrating $(t^{2} + 1)^{2}$ itself adds up squared distances, which is not a length.",
        "在很短的时间 $dt$ 内，点横向移动 $dx = x'(t) \\, dt$，纵向移动 $dy = y'(t) \\, dt$，距离为 $\\sqrt{x'(t)^{2} + y'(t)^{2}} \\, dt$。所以\n\n$$L = \\int_{a}^{b} \\sqrt{\\left(\\frac{dx}{dt}\\right)^{2} + \\left(\\frac{dy}{dt}\\right)^{2}} \\, dt$$\n\n前提是曲线只被描绘一次。对 $x = \\frac{1}{3}t^{3} - t$、$y = t^{2}$，根号内为 $(t^{2} - 1)^{2} + 4t^{2} = (t^{2} + 1)^{2}$，所以 $L = \\int_{0}^{3} (t^{2} + 1) \\, dt = 12$。\n\n检验：原函数 $\\frac{t^{3}}{3} + t$ 等于 $x + 2t$，所以 $L$ 等于 $x$ 的变化量 $9 - 3 = 6$ 加上 $t$ 的变化量的两倍 $6$，即 $12$。\n\n> **注意。** 先开平方再积分。直接积分 $(t^{2} + 1)^{2}$ 累加的是距离的平方，不是长度。",
      ),
      generate: polynomialArcLength,
    },
    {
      id: "exact-arc-lengths",
      figure: calculusDrawings5["the-arc-length-of-a-parametric-curve#exact-arc-lengths"],
      title: t("Exact arc lengths", "弧长的精确值"),
      explanation: t(
        "For a circle $x = r\\cos t + h$, $y = r\\sin t + k$, the speed is the constant $r$, so the arc for $0 \\le t \\le \\theta$ has length $r\\theta$. Other curves may need a substitution: for $x = 3t^{2}$, $y = 2t^{3}$, the speed is $6t\\sqrt{1 + t^{2}}$, and $w = 1 + t^{2}$ finishes the integral. For $0 \\le t \\le 1$:\n\n$$L = 3\\int_{1}^{2} \\sqrt{w} \\, dw = 2\\left(2\\sqrt{2} - 1\\right)$$\n\nCheck: differentiating $2(1 + t^{2})^{3/2}$ gives $6t\\sqrt{1 + t^{2}}$, the speed, and its values at $t = 1$ and $t = 0$ are $4\\sqrt{2}$ and $2$.\n\n> **Watch out.** Change the limits with the substitution. The limits $0$ and $1$ are values of $t$; for $w = 1 + t^{2}$ they become $1$ and $2$.",
        "对圆 $x = r\\cos t + h$、$y = r\\sin t + k$，速率是常数 $r$，所以 $0 \\le t \\le \\theta$ 对应的弧长为 $r\\theta$。其他曲线可能需要换元：对 $x = 3t^{2}$、$y = 2t^{3}$，速率为 $6t\\sqrt{1 + t^{2}}$，令 $w = 1 + t^{2}$ 即可完成积分。对 $0 \\le t \\le 1$：\n\n$$L = 3\\int_{1}^{2} \\sqrt{w} \\, dw = 2\\left(2\\sqrt{2} - 1\\right)$$\n\n检验：$2(1 + t^{2})^{3/2}$ 的导数为 $6t\\sqrt{1 + t^{2}}$，正是速率；它在 $t = 1$ 和 $t = 0$ 处的值为 $4\\sqrt{2}$ 和 $2$。\n\n> **注意。** 换元时要同时换积分限。$0$ 和 $1$ 是 $t$ 的值；换成 $w = 1 + t^{2}$ 后变为 $1$ 和 $2$。",
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
  const other = intQ(pMul(x, pDer(y)), a, b);
  const ends = Q.of(pAt(x, b) * pAt(y, b) - pAt(x, a) * pAt(y, a));
  return worked(
    t(
      `Find the area of the region between the curve $${curve(tL(x), tL(y))}$, $${a} \\le t \\le ${b}$, and the $x$-axis.`,
      `求曲线 $${curve(tL(x), tL(y))}$（$${a} \\le t \\le ${b}$）与 $x$ 轴之间区域的面积。`,
    ),
    answer,
    [
      [
        ["Check the direction", "检查方向"],
        t(
          `$\\frac{dx}{dt} = ${tL(pDer(x))} > 0$ on the interval, so the curve moves right, and $y > 0$ there.`,
          `在这个区间上 $\\frac{dx}{dt} = ${tL(pDer(x))} > 0$，曲线向右运动，且 $y > 0$。`,
        ),
      ],
      [
        ["Write the integral", "写出积分"],
        t("Substitute $dx = x'(t) \\, dt$ into $\\int y \\, dx$.", "把 $dx = x'(t) \\, dt$ 代入 $\\int y \\, dx$。"),
        [`A = \\int_{${a}}^{${b}} (${tL(y)})(${tL(pDer(x))}) \\, dt = \\int_{${a}}^{${b}} (${tL(integrand)}) \\, dt`],
      ],
      [["Integrate", "积分"], t("Integrate term by term.", "逐项积分。"), [`A = ${answer.toLatex()}`]],
    ],
    t(
      `Integrate by parts instead: $\\int y \\, dx = \\Big[xy\\Big] - \\int x \\, dy$. Here\n\n$$\\Big[xy\\Big]_{t = ${a}}^{t = ${b}} = ${ends.toLatex()}, \\quad \\int_{${a}}^{${b}} x \\, y'(t) \\, dt = ${other.toLatex()}$$\n\n$$A = ${ends.toLatex()} - ${inP(other)} = ${answer.toLatex()}$$`,
      `改用分部积分：$\\int y \\, dx = \\Big[xy\\Big] - \\int x \\, dy$。这里\n\n$$\\Big[xy\\Big]_{t = ${a}}^{t = ${b}} = ${ends.toLatex()}, \\quad \\int_{${a}}^{${b}} x \\, y'(t) \\, dt = ${other.toLatex()}$$\n\n$$A = ${ends.toLatex()} - ${inP(other)} = ${answer.toLatex()}$$`,
    ),
    [
      slip(
        intQ(y, a, b),
        "This integrates $y \\, dt$; the area needs $y \\, dx = y \\, x'(t) \\, dt$.",
        "这里积分的是 $y \\, dt$；面积要用 $y \\, dx = y \\, x'(t) \\, dt$。",
      ),
      slip(other, "This is $\\int x \\, dy$, which swaps the roles of $x$ and $y$.", "这是 $\\int x \\, dy$，把 $x$ 和 $y$ 的作用对调了。"),
      slip(answer.mul(Q.of(2)), "This doubles the area.", "这是面积的两倍。"),
    ],
  );
}

/** closedCurveArea finds the area of an ellipse or under one arch of a cycloid. */
function closedCurveArea(rng: Rng) {
  if (rng.int(0, 2) > 0) {
    const a = rng.int(1, 6);
    const b = rng.int(1, 6);
    const q = Q.of(a * b);
    const shape = curve(`${k1(a)}\\cos t`, `${k1(b)}\\sin t`);
    return exactWorked(
      t(
        `Find the area enclosed by the curve $${shape}$, $0 \\le t \\le 2\\pi$. Give an exact answer.`,
        `求曲线 $${shape}$（$0 \\le t \\le 2\\pi$）所围区域的面积，给出精确值。`,
      ),
      piL(q),
      [
        [
          ["Take the upper half", "取上半部分"],
          t(
            `By symmetry the area is twice the area under the upper half. There $x$ runs from $-${a}$ to $${a}$ as $t$ runs from $\\pi$ to $0$.`,
            `由对称性，面积是上半部分下方面积的两倍。在上半部分，当 $t$ 从 $\\pi$ 变到 $0$ 时，$x$ 从 $-${a}$ 变到 $${a}$。`,
          ),
          [`A = 2\\int_{\\pi}^{0} ${k1(b)}\\sin t \\cdot (-${k1(a)}\\sin t) \\, dt = ${2 * a * b}\\int_{0}^{\\pi} \\sin^{2} t \\, dt`],
        ],
        [
          ["Integrate", "积分"],
          t(
            "Use $\\sin^{2} t = \\frac{1 - \\cos 2t}{2}$, whose integral over $[0, \\pi]$ is $\\frac{\\pi}{2}$.",
            "用 $\\sin^{2} t = \\frac{1 - \\cos 2t}{2}$，它在 $[0, \\pi]$ 上的积分为 $\\frac{\\pi}{2}$。",
          ),
          [`A = ${2 * a * b} \\cdot \\frac{\\pi}{2} = ${piL(q)}`],
        ],
      ],
      t(
        `The curve is the ellipse $${ellipse(a, b)}$. It is the unit circle, of area $\\pi$, stretched by $${a}$ across and $${b}$ up, which multiplies areas by $${a * b}$, giving $${piL(q)}$.`,
        `这条曲线是椭圆 $${ellipse(a, b)}$。它是面积为 $\\pi$ 的单位圆横向拉伸 $${a}$ 倍、纵向拉伸 $${b}$ 倍得到的，面积乘以 $${a * b}$，得 $${piL(q)}$。`,
      ),
      [
        say(
          piL(q.mul(Q.of(2))),
          "This doubles the area: the upper half already gives half of it.",
          "这是面积的两倍：上半部分给出的已是一半。",
        ),
        say(
          piL(Q.of(a * b, 2)),
          "This is the area under the upper half alone; double it for the whole ellipse.",
          "这只是上半部分下方的面积；整个椭圆要再乘以 $2$。",
        ),
        say(
          piL(Q.of(a + b)),
          "This adds the semi-axes; the area $\\pi ab$ multiplies them.",
          "这里把两个半轴相加了；面积 $\\pi ab$ 是两者相乘。",
        ),
      ],
    );
  }
  const r = rng.int(1, 6);
  const q = Q.of(3 * r * r);
  const shape = curve(`${k1(r)}(t - \\sin t)`, `${k1(r)}(1 - \\cos t)`);
  return exactWorked(
    t(
      `Find the area of the region under one arch of the cycloid $${shape}$, $0 \\le t \\le 2\\pi$, and above the $x$-axis. Give an exact answer.`,
      `求摆线 $${shape}$（$0 \\le t \\le 2\\pi$）的一拱与 $x$ 轴之间区域的面积，给出精确值。`,
    ),
    piL(q),
    [
      [
        ["Write the integral", "写出积分"],
        t(
          `$\\frac{dx}{dt} = ${k1(r)}(1 - \\cos t) \\ge 0$, so the arch is traced left to right, and`,
          `$\\frac{dx}{dt} = ${k1(r)}(1 - \\cos t) \\ge 0$，拱从左到右被描出，`,
        ),
        [`A = \\int y \\, dx = ${k1(r * r)}\\int_{0}^{2\\pi} (1 - \\cos t)^{2} \\, dt`],
      ],
      [
        ["Expand and integrate", "展开并积分"],
        t(
          "Over a full turn $\\cos t$ integrates to $0$ and $\\cos^{2} t$ to $\\pi$.",
          "在一整圈上，$\\cos t$ 的积分为 $0$，$\\cos^{2} t$ 的积分为 $\\pi$。",
        ),
        [`A = ${k1(r * r)}\\int_{0}^{2\\pi} \\left(1 - 2\\cos t + \\cos^{2} t\\right) dt = ${k1(r * r)}(2\\pi + \\pi) = ${piL(q)}`],
      ],
    ],
    t(
      `Integrate by parts instead: $\\int y \\, dx = \\Big[xy\\Big] - \\int x \\, dy$. Since $y = 0$ at both ends, $\\Big[xy\\Big]_{0}^{2\\pi} = 0$. With $\\int_{0}^{2\\pi} t\\sin t \\, dt = -2\\pi$ and $\\int_{0}^{2\\pi} \\sin^{2} t \\, dt = \\pi$,\n\n$$\\int x \\, dy = ${k1(r * r)}\\int_{0}^{2\\pi} (t - \\sin t)\\sin t \\, dt = ${piL(q.neg())}$$\n\nSo $A = 0 - \\left(${piL(q.neg())}\\right) = ${piL(q)}$.`,
      `改用分部积分：$\\int y \\, dx = \\Big[xy\\Big] - \\int x \\, dy$。两端 $y = 0$，所以 $\\Big[xy\\Big]_{0}^{2\\pi} = 0$。由 $\\int_{0}^{2\\pi} t\\sin t \\, dt = -2\\pi$ 和 $\\int_{0}^{2\\pi} \\sin^{2} t \\, dt = \\pi$，\n\n$$\\int x \\, dy = ${k1(r * r)}\\int_{0}^{2\\pi} (t - \\sin t)\\sin t \\, dt = ${piL(q.neg())}$$\n\n所以 $A = 0 - \\left(${piL(q.neg())}\\right) = ${piL(q)}$。`,
    ),
    [
      say(
        piL(Q.of(2 * r * r)),
        "This leaves out the $\\cos^{2} t$ term, which adds $\\pi r^{2}$.",
        "这里漏掉了 $\\cos^{2} t$ 一项，它贡献 $\\pi r^{2}$。",
      ),
      say(
        piL(Q.of(4 * r * r)),
        "This integrates $\\cos^{2} t$ to $2\\pi$; over a full turn it gives $\\pi$.",
        "这里把 $\\cos^{2} t$ 的积分算成了 $2\\pi$；在一整圈上它是 $\\pi$。",
      ),
      say(
        piL(Q.of(r * r)),
        "This is the area of the rolling circle; the arch encloses three times as much.",
        "这是滚动圆的面积；拱下的面积是它的三倍。",
      ),
    ],
  );
}

/** calculatingAreasBoundedByParametricFunctions integrates y dx in terms of the parameter. */
export const calculatingAreasBoundedByParametricFunctions: TopicDef = {
  id: "calculating-areas-bounded-by-parametric-functions",
  title: t("Calculating Areas Bounded by Parametric Functions", "计算参数曲线围成的面积"),
  summary: t("The area under a parametric curve is ∫ y dx = ∫ y(t) x′(t) dt.", "参数曲线下方的面积为 ∫ y dx = ∫ y(t) x′(t) dt。"),
  intro: t(
    "The area under $y = \\sqrt{x}$ for $0 \\le x \\le 4$ is\n\n$$\\int_{0}^{4} x^{1/2} \\, dx = \\frac{2}{3} \\cdot 4^{3/2} = \\frac{16}{3}$$\n\nCheck: substitute $x = t^{2}$, so $dx = 2t \\, dt$, $\\sqrt{x} = t$ and $t$ runs from $0$ to $2$. The integral becomes $\\int_{0}^{2} t \\cdot 2t \\, dt = \\frac{2}{3} \\cdot 8 = \\frac{16}{3}$.\n\nIn this lesson we use that substitution in reverse: for a curve $x = x(t)$, $y = y(t)$, the area under it is $\\int y(t) \\, x'(t) \\, dt$.",
    "$y = \\sqrt{x}$（$0 \\le x \\le 4$）下方的面积为\n\n$$\\int_{0}^{4} x^{1/2} \\, dx = \\frac{2}{3} \\cdot 4^{3/2} = \\frac{16}{3}$$\n\n检验：令 $x = t^{2}$，则 $dx = 2t \\, dt$，$\\sqrt{x} = t$，$t$ 从 $0$ 变到 $2$。积分化为 $\\int_{0}^{2} t \\cdot 2t \\, dt = \\frac{2}{3} \\cdot 8 = \\frac{16}{3}$。\n\n这节课我们反过来用这种换元：对曲线 $x = x(t)$、$y = y(t)$，它下方的面积为 $\\int y(t) \\, x'(t) \\, dt$。",
  ),
  prerequisites: ["differentiating-parametric-curves", "integration-using-substitution"],
  encompasses: [{ topic: "integration-using-substitution", weight: 0.3 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "areas-under-polynomial-parametric-curves",
      title: t("Areas under polynomial parametric curves", "多项式参数曲线下方的面积"),
      explanation: t(
        "The area under a curve is $\\int y \\, dx$. With $x = x(t)$ and $y = y(t)$, substitute $dx = x'(t) \\, dt$:\n\n$$A = \\int_{a}^{b} y(t) \\, x'(t) \\, dt$$\n\nwhen $y \\ge 0$ and the curve moves right ($x' > 0$) as $t$ goes from $a$ to $b$. For $x = t^{2}$, $y = t$, $0 \\le t \\le 2$: $A = \\int_{0}^{2} t \\cdot 2t \\, dt = \\frac{16}{3}$.\n\nCheck: the curve is $y = \\sqrt{x}$ for $0 \\le x \\le 4$, and $\\int_{0}^{4} \\sqrt{x} \\, dx = \\frac{2}{3} \\cdot 8 = \\frac{16}{3}$.\n\n> **Watch out.** Multiply by $x'(t)$. $\\int_{0}^{2} t \\, dt = 2$ adds up heights against $t$, not against $x$.",
        "曲线下方的面积为 $\\int y \\, dx$。设 $x = x(t)$、$y = y(t)$，代入 $dx = x'(t) \\, dt$：\n\n$$A = \\int_{a}^{b} y(t) \\, x'(t) \\, dt$$\n\n前提是 $y \\ge 0$，且 $t$ 从 $a$ 到 $b$ 时曲线向右运动（$x' > 0$）。对 $x = t^{2}$、$y = t$、$0 \\le t \\le 2$：$A = \\int_{0}^{2} t \\cdot 2t \\, dt = \\frac{16}{3}$。\n\n检验：这条曲线是 $y = \\sqrt{x}$（$0 \\le x \\le 4$），而 $\\int_{0}^{4} \\sqrt{x} \\, dx = \\frac{2}{3} \\cdot 8 = \\frac{16}{3}$。\n\n> **注意。** 要乘以 $x'(t)$。$\\int_{0}^{2} t \\, dt = 2$ 是对 $t$ 而不是对 $x$ 累加高度。",
      ),
      generate: polynomialParametricArea,
    },
    {
      id: "areas-of-ellipses-and-cycloids",
      title: t("Areas of ellipses and cycloids", "椭圆与摆线的面积"),
      explanation: t(
        "If the curve moves left as $t$ increases, $x' < 0$, so reverse the limits so that $x$ increases. For the ellipse $x = a\\cos t$, $y = b\\sin t$, the upper half runs from $t = \\pi$ to $t = 0$ left to right, and the area is\n\n$$A = 2ab\\int_{0}^{\\pi} \\sin^{2} t \\, dt = \\pi ab$$\n\nUnder one arch of the cycloid $x = r(t - \\sin t)$, $y = r(1 - \\cos t)$, the area is $r^{2}\\int_{0}^{2\\pi} (1 - \\cos t)^{2} \\, dt = 3\\pi r^{2}$.\n\nCheck: with $a = b = r$ the ellipse is a circle and $\\pi ab$ is $\\pi r^{2}$, the area of a circle.\n\n> **Watch out.** Integrating the upper half from $t = 0$ to $t = \\pi$ follows the curve right to left and gives $-\\frac{1}{2}\\pi ab$; the sign shows the limits are the wrong way round.",
        "若 $t$ 增大时曲线向左运动，则 $x' < 0$，应交换积分限使 $x$ 递增。对椭圆 $x = a\\cos t$、$y = b\\sin t$，上半部分从左到右对应 $t$ 从 $\\pi$ 到 $0$，面积为\n\n$$A = 2ab\\int_{0}^{\\pi} \\sin^{2} t \\, dt = \\pi ab$$\n\n摆线 $x = r(t - \\sin t)$、$y = r(1 - \\cos t)$ 一拱下方的面积为 $r^{2}\\int_{0}^{2\\pi} (1 - \\cos t)^{2} \\, dt = 3\\pi r^{2}$。\n\n检验：取 $a = b = r$，椭圆成为圆，$\\pi ab$ 即圆面积 $\\pi r^{2}$。\n\n> **注意。** 若对上半部分从 $t = 0$ 积到 $t = \\pi$，就是从右往左沿曲线走，得到 $-\\frac{1}{2}\\pi ab$；负号说明积分限反了。",
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
  const half = intQ(integrand, a, b);
  const q = half.mul(Q.of(2));
  const F = (s: number) => Q.of(c * s ** 5, 5).add(Q.of(c ** 3 * s ** 3, 3));
  const Fl = `${coef(Q.of(c, 5))}t^{5} + ${coef(Q.of(c ** 3, 3))}t^{3}`;
  const shape = curve(cubicX(c), `${k1(c)}t^{2}`);
  return exactWorked(
    t(
      `Find the area of the surface obtained by rotating the curve $${shape}$, $${a} \\le t \\le ${b}$, about the $x$-axis. Give an exact answer.`,
      `求曲线 $${shape}$（$${a} \\le t \\le ${b}$）绕 $x$ 轴旋转一周所得曲面的面积，给出精确值。`,
    ),
    piL(q),
    [
      [
        ["Find the speed", "求速率"],
        t("The sum of the squared rates is a perfect square.", "两个变化率的平方和是完全平方。"),
        [`\\sqrt{(t^{2} - ${c * c})^{2} + (${2 * c}t)^{2}} = t^{2} + ${c * c}`],
      ],
      [
        ["Set up the integral", "列出积分"],
        t(`Rotating about the $x$-axis, the radius is $y = ${k1(c)}t^{2}$.`, `绕 $x$ 轴旋转，半径为 $y = ${k1(c)}t^{2}$。`),
        [`S = 2\\pi\\int_{${a}}^{${b}} ${k1(c)}t^{2}(t^{2} + ${c * c}) \\, dt = 2\\pi\\int_{${a}}^{${b}} (${tL(integrand)}) \\, dt`],
      ],
      [
        ["Integrate", "积分"],
        t(`The integral is $${half.toLatex()}$.`, `积分值为 $${half.toLatex()}$。`),
        [`S = 2\\pi \\cdot ${half.toLatex()} = ${piL(q)}`],
      ],
    ],
    t(
      `Differentiate the antiderivative back:\n\n$$F(t) = ${Fl}, \\quad F'(t) = ${tL(integrand)}$$\n\nThis is the integrand. Its values are $F(${b}) = ${F(b).toLatex()}$ and $F(${a}) = ${F(a).toLatex()}$, and $2\\pi$ times their difference is $${piL(q)}$.`,
      `把原函数求导代回：\n\n$$F(t) = ${Fl}, \\quad F'(t) = ${tL(integrand)}$$\n\n这正是被积函数。其值 $F(${b}) = ${F(b).toLatex()}$，$F(${a}) = ${F(a).toLatex()}$，两者之差乘以 $2\\pi$ 得 $${piL(q)}$。`,
    ),
    [
      say(
        piL(half),
        "This uses $\\pi$ instead of $2\\pi$: a band of radius $y$ has circumference $2\\pi y$.",
        "这里用了 $\\pi$ 而不是 $2\\pi$：半径为 $y$ 的窄带周长为 $2\\pi y$。",
      ),
      say(q.toLatex(), "This leaves out the factor $\\pi$.", "这里漏掉了因子 $\\pi$。"),
      say(
        piL(intQ([c * c, 0, 1], a, b).mul(Q.of(2))),
        "This leaves out the radius $y$: it is $2\\pi$ times the arc length.",
        "这里漏掉了半径 $y$：这是弧长乘以 $2\\pi$。",
      ),
    ],
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
  const shape = curve(`${k1(r)}\\cos t`, `${k1(r)}\\sin t`);
  const h = oneMinusCos.mul(Q.of(r));
  const zone = ["2\\pi", `${r}`, h.toLatex()].filter((f) => f !== "1").join(" \\cdot ");
  const times1 = oneMinusCos.eq(Q.one) ? "" : ` \\cdot ${oneMinusCos.toLatex()}`;
  return exactWorked(
    t(
      `Find the area of the surface obtained by rotating the curve $${shape}$, $0 \\le t \\le ${angle}$, about the $x$-axis. Give an exact answer.`,
      `求曲线 $${shape}$（$0 \\le t \\le ${angle}$）绕 $x$ 轴旋转一周所得曲面的面积，给出精确值。`,
    ),
    piL(q),
    [
      [
        ["Find the speed", "求速率"],
        t("Square the two rates and add them.", "把两个变化率平方后相加。"),
        [`\\sqrt{${k1(r * r)}\\sin^{2} t + ${k1(r * r)}\\cos^{2} t} = ${r}`],
      ],
      [
        ["Integrate", "积分"],
        t(`The radius is $y = ${k1(r)}\\sin t$.`, `半径为 $y = ${k1(r)}\\sin t$。`),
        [
          `S = 2\\pi\\int_{0}^{${angle}} ${r === 1 ? "\\sin t" : `${r}\\sin t \\cdot ${r}`} \\, dt = ${2 * r * r}\\pi\\Big[-\\cos t\\Big]_{0}^{${angle}} = ${2 * r * r}\\pi${times1} = ${piL(q)}`,
        ],
      ],
    ],
    t(
      `Archimedes found that a zone of a sphere of radius $r$ has area $2\\pi r h$, where $h$ is its width along the axis. Here $x$ runs from $${r}$ down to $${r}\\cos(${angle})$, so $h = ${h.toLatex()}$ and $${zone} = ${piL(q)}$.`,
      `阿基米德发现，半径为 $r$ 的球面上一条球带的面积为 $2\\pi r h$，其中 $h$ 是它沿轴的宽度。这里 $x$ 从 $${r}$ 减到 $${r}\\cos(${angle})$，所以 $h = ${h.toLatex()}$，$${zone} = ${piL(q)}$。`,
    ),
    [
      say(
        piL(q.div(Q.of(2))),
        "This uses $\\pi$ instead of $2\\pi$: a band of radius $y$ has circumference $2\\pi y$.",
        "这里用了 $\\pi$ 而不是 $2\\pi$：半径为 $y$ 的窄带周长为 $2\\pi y$。",
      ),
      say(
        piL(Q.of(4 * r * r)),
        "This is the whole sphere; the arc stops before $t = \\pi$.",
        "这是整个球面；这段弧在 $t = \\pi$ 之前就停止了。",
      ),
      say(
        piL(oneMinusCos.mul(Q.of(2 * r))),
        "This leaves out the speed $r$, the length factor of each band.",
        "这里漏掉了速率 $r$，即每条窄带的宽度因子。",
      ),
    ],
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
  intro: t(
    "Rotating $y = x$ for $0 \\le x \\le 3$ about the $x$-axis gives a cone, of surface area\n\n$$S = 2\\pi\\int_{0}^{3} x\\sqrt{1 + 1^{2}} \\, dx = 2\\sqrt{2}\\pi \\cdot \\frac{9}{2} = 9\\sqrt{2}\\pi$$\n\nCheck: the cone has radius $3$ and slant height $3\\sqrt{2}$, and its curved surface is $\\pi r \\ell = \\pi \\cdot 3 \\cdot 3\\sqrt{2} = 9\\sqrt{2}\\pi$.\n\nIn this lesson we rotate curves given by a parameter, replacing $\\sqrt{1 + f'(x)^{2}} \\, dx$ with the speed $\\sqrt{x'(t)^{2} + y'(t)^{2}} \\, dt$.",
    "把 $y = x$（$0 \\le x \\le 3$）绕 $x$ 轴旋转得到一个圆锥，其侧面积为\n\n$$S = 2\\pi\\int_{0}^{3} x\\sqrt{1 + 1^{2}} \\, dx = 2\\sqrt{2}\\pi \\cdot \\frac{9}{2} = 9\\sqrt{2}\\pi$$\n\n检验：圆锥底面半径为 $3$，母线长 $3\\sqrt{2}$，侧面积 $\\pi r \\ell = \\pi \\cdot 3 \\cdot 3\\sqrt{2} = 9\\sqrt{2}\\pi$。\n\n这节课我们旋转由参数给出的曲线，把 $\\sqrt{1 + f'(x)^{2}} \\, dx$ 换成速率 $\\sqrt{x'(t)^{2} + y'(t)^{2}} \\, dt$。",
  ),
  prerequisites: ["the-arc-length-of-a-parametric-curve", "surface-areas-of-revolution-rotation-about-the-x-axis"],
  encompasses: [{ topic: "surface-areas-of-revolution-rotation-about-the-x-axis", weight: 0.4 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "surfaces-from-polynomial-parametric-curves",
      figure: calculusDrawings5["surface-areas-of-revolution-for-parametric-curves#surfaces-from-polynomial-parametric-curves"],
      title: t("Surfaces from polynomial parametric curves", "多项式参数曲线旋转所得的曲面"),
      explanation: t(
        "The surface area of a rotated curve adds up thin bands whose width is the arc length element and whose radius is the distance from the axis. Replace $ds = \\sqrt{1 + f'(x)^{2}} \\, dx$ by the parametric arc length element $ds = \\sqrt{x'(t)^{2} + y'(t)^{2}} \\, dt$. Rotating about the $x$-axis, the radius is $y(t)$:\n\n$$S = 2\\pi\\int_{a}^{b} y(t)\\sqrt{x'(t)^{2} + y'(t)^{2}} \\, dt$$\n\nFor $x = t$, $y = t$, $0 \\le t \\le 3$, the speed is $\\sqrt{2}$ and $S = 2\\sqrt{2}\\pi\\int_{0}^{3} t \\, dt = 9\\sqrt{2}\\pi$.\n\nCheck: the curve is the segment $y = x$, which sweeps out a cone of radius $3$ and slant height $3\\sqrt{2}$, with curved surface $\\pi \\cdot 3 \\cdot 3\\sqrt{2} = 9\\sqrt{2}\\pi$.\n\n> **Watch out.** Keep the radius $y(t)$ inside the integral. $2\\pi\\int ds$ alone is $2\\pi$ times the length of the curve, not the area of the surface.",
        "旋转曲线的表面积是把许多窄带加起来，窄带的宽是弧长微元，半径是到轴的距离。把 $ds = \\sqrt{1 + f'(x)^{2}} \\, dx$ 换成参数形式的弧长元素 $ds = \\sqrt{x'(t)^{2} + y'(t)^{2}} \\, dt$。绕 $x$ 轴旋转时半径为 $y(t)$：\n\n$$S = 2\\pi\\int_{a}^{b} y(t)\\sqrt{x'(t)^{2} + y'(t)^{2}} \\, dt$$\n\n对 $x = t$、$y = t$、$0 \\le t \\le 3$，速率为 $\\sqrt{2}$，$S = 2\\sqrt{2}\\pi\\int_{0}^{3} t \\, dt = 9\\sqrt{2}\\pi$。\n\n检验：这条曲线是线段 $y = x$，旋转得到底面半径为 $3$、母线长 $3\\sqrt{2}$ 的圆锥，侧面积为 $\\pi \\cdot 3 \\cdot 3\\sqrt{2} = 9\\sqrt{2}\\pi$。\n\n> **注意。** 积分里要保留半径 $y(t)$。单独的 $2\\pi\\int ds$ 是曲线长度的 $2\\pi$ 倍，不是曲面面积。",
      ),
      generate: polynomialParametricSurface,
    },
    {
      id: "zones-of-a-sphere",
      figure: calculusDrawings5["surface-areas-of-revolution-for-parametric-curves#zones-of-a-sphere"],
      title: t("Zones of a sphere", "球带"),
      explanation: t(
        "For the circle $x = r\\cos t$, $y = r\\sin t$ the speed is $r$, so rotating the arc $0 \\le t \\le \\beta$ about the $x$-axis gives\n\n$$S = 2\\pi r^{2}\\int_{0}^{\\beta} \\sin t \\, dt = 2\\pi r^{2}(1 - \\cos\\beta)$$\n\nWith $\\beta = \\pi$ this is the whole sphere, $4\\pi r^{2}$.\n\nCheck: the zone spans $x = r\\cos\\beta$ to $x = r$ along the axis, a width $h = r(1 - \\cos\\beta)$. Archimedes' result that a zone has area $2\\pi r h$ gives the same $2\\pi r^{2}(1 - \\cos\\beta)$.\n\n> **Watch out.** The speed $r$ multiplies the radius $r\\sin t$, which is why $r^{2}$ appears. Leaving it out gives $2\\pi r(1 - \\cos\\beta)$, which has the units of a length.",
        "对圆 $x = r\\cos t$、$y = r\\sin t$，速率为 $r$，所以弧 $0 \\le t \\le \\beta$ 绕 $x$ 轴旋转得\n\n$$S = 2\\pi r^{2}\\int_{0}^{\\beta} \\sin t \\, dt = 2\\pi r^{2}(1 - \\cos\\beta)$$\n\n取 $\\beta = \\pi$ 即整个球面 $4\\pi r^{2}$。\n\n检验：这条球带沿轴从 $x = r\\cos\\beta$ 延伸到 $x = r$，宽度 $h = r(1 - \\cos\\beta)$。阿基米德的结论“球带面积为 $2\\pi r h$”给出同样的 $2\\pi r^{2}(1 - \\cos\\beta)$。\n\n> **注意。** 速率 $r$ 要乘以半径 $r\\sin t$，所以出现 $r^{2}$。漏掉它得 $2\\pi r(1 - \\cos\\beta)$，单位是长度。",
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
