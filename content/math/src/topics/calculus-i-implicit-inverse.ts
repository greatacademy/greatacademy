import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";

import { functionProblem, numberProblem } from "../problems.ts";
import { fracL, type Poly, pAt, par, pDer, pLatex, power, sumLatex, table } from "./calculus-common.ts";

// Calculus I unit 5: Advanced Differentiation, modules 5.12 and 5.13.

/** dydx is the prefix of an answer for dy/dx. */
const dydx = "\\frac{dy}{dx} =";

/** frac writes a rational coefficient times a fraction of monomials: "-\\frac{3x}{2y}". */
function frac(c: Q, top: string, bottom: string): string {
  const n = c.n < 0n ? -c.n : c.n;
  const sign = c.sign() < 0 ? "-" : "";
  const num = `${n === 1n && top !== "" ? "" : n}${top}`;
  const den = `${c.d === 1n && bottom !== "" ? "" : c.d}${bottom}`;
  return den === "1" ? `${sign}${num}` : `${sign}\\frac{${num}}{${den}}`;
}

/** reciprocal writes 1/d, simplified when that changes it: "\\frac{1}{-4} = -\\frac{1}{4}". */
const reciprocal = (d: number) => `\\frac{1}{${d}}${d > 1 ? "" : ` = ${Q.of(1, d).toLatex()}`}`;

/** implicitDifferentiation differentiates equations in x and y. */
export const implicitDifferentiation: TopicDef = {
  id: "implicit-differentiation",
  title: t("Implicit Differentiation", "隐函数求导"),
  summary: t(
    "Differentiate both sides of an equation in x and y to find dy/dx, and evaluate it at a point.",
    "对关于 x 和 y 的方程两边求导得到 dy/dx，并计算它在某点处的值。",
  ),
  prerequisites: ["selecting-procedures-for-calculating-derivatives"],
  encompasses: [
    { topic: "the-chain-rule-for-differentiation", weight: 0.3 },
    { topic: "the-product-rule-for-differentiation", weight: 0.2 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "implicit-differentiation-of-sums-of-powers",
      title: t("Implicit differentiation of sums of powers", "幂之和的隐函数求导"),
      explanation: t(
        "When $y$ is a function of $x$ defined by an equation, differentiate both sides with respect to $x$. By the chain rule, $\\frac{d}{dx} y^{n} = ny^{n - 1}\\frac{dy}{dx}$. Then solve for $\\frac{dy}{dx}$. For $x^{3} + y^{2} = 7$:\n\n$$3x^{2} + 2y\\frac{dy}{dx} = 0 \\implies \\frac{dy}{dx} = -\\frac{3x^{2}}{2y}.$$",
        "当 $y$ 是由方程确定的 $x$ 的函数时，对方程两边关于 $x$ 求导。由链式法则，$\\frac{d}{dx} y^{n} = ny^{n - 1}\\frac{dy}{dx}$。再解出 $\\frac{dy}{dx}$。对 $x^{3} + y^{2} = 7$：\n\n$$3x^{2} + 2y\\frac{dy}{dx} = 0 \\implies \\frac{dy}{dx} = -\\frac{3x^{2}}{2y}.$$",
      ),
      generate(rng) {
        const p = rng.int(2, 5);
        const q = rng.int(2, 4);
        const a = rng.pick([1, 1, 2, 3, 4]);
        const b = rng.pick([1, 1, 2, 3, 5, -1, -2]);
        const c = rng.int(1, 30);
        const answer = frac(Q.of(-a * p, b * q), power(p - 1), power(q - 1, "y"));
        return functionProblem({
          prompt: t(
            `Find $\\frac{dy}{dx}$ for the curve $${poly([a, power(p)], [b, power(q, "y")])} = ${c}$.`,
            `求曲线 $${poly([a, power(p)], [b, power(q, "y")])} = ${c}$ 的 $\\frac{dy}{dx}$。`,
          ),
          answer,
          prefix: dydx,
          wrong: [
            frac(Q.of(a * p, b * q), power(p - 1), power(q - 1, "y")),
            frac(Q.of(-a * p), power(p - 1), ""),
            frac(Q.of(-b * q, a * p), power(q - 1, "y"), power(p - 1)),
          ],
          solution: t(
            `Differentiating both sides,$$${poly([a * p, power(p - 1)], [b * q, `${power(q - 1, "y")}\\frac{dy}{dx}`])} = 0,$$so $\\frac{dy}{dx} = ${answer}$.`,
            `两边求导，$$${poly([a * p, power(p - 1)], [b * q, `${power(q - 1, "y")}\\frac{dy}{dx}`])} = 0,$$所以 $\\frac{dy}{dx} = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "implicit-differentiation-with-products",
      title: t("Implicit differentiation with products", "含乘积的隐函数求导"),
      explanation: t(
        "A term such as $xy$ is a product: $\\frac{d}{dx}(xy) = y + x\\frac{dy}{dx}$. Collect the terms with $\\frac{dy}{dx}$ on one side and factor it out. For $x^{2} + xy + y^{2} = 7$:\n\n$$2x + y + x\\frac{dy}{dx} + 2y\\frac{dy}{dx} = 0 \\implies \\frac{dy}{dx} = -\\frac{2x + y}{x + 2y}.$$",
        "像 $xy$ 这样的项是乘积：$\\frac{d}{dx}(xy) = y + x\\frac{dy}{dx}$。把含 $\\frac{dy}{dx}$ 的项移到一边，再提取公因式。对 $x^{2} + xy + y^{2} = 7$：\n\n$$2x + y + x\\frac{dy}{dx} + 2y\\frac{dy}{dx} = 0 \\implies \\frac{dy}{dx} = -\\frac{2x + y}{x + 2y}.$$",
      ),
      generate(rng) {
        const b = rng.pick([1, 1, 2, 3, -1]);
        const a = rng.pick([1, 2, 3, 4, -1, -2, -3]);
        const c = rng.pick([1, 1, 2, 3, -1]);
        const d = rng.int(1, 30);
        const top = poly([2 * b, "x"], [a, "y"]);
        const bottom = poly([a, "x"], [2 * c, "y"]);
        const answer = `-\\frac{${top}}{${bottom}}`;
        return functionProblem({
          prompt: t(
            `Find $\\frac{dy}{dx}$ for the curve $${poly([b, "x^{2}"], [a, "xy"], [c, "y^{2}"])} = ${d}$.`,
            `求曲线 $${poly([b, "x^{2}"], [a, "xy"], [c, "y^{2}"])} = ${d}$ 的 $\\frac{dy}{dx}$。`,
          ),
          answer,
          prefix: dydx,
          wrong: [
            `-\\frac{${poly([2 * b, "x"])}}{${bottom}}`,
            `\\frac{${top}}{${bottom}}`,
            `-\\frac{${poly([2 * b, "x"], [a, "y"])}}{${poly([2 * c, "y"])}}`,
          ],
          solution: t(
            `Differentiating, with the product rule for $${poly([a, "xy"])}$:$$${poly([2 * b, "x"], [a, "y"], [a, "x\\frac{dy}{dx}"], [2 * c, "y\\frac{dy}{dx}"])} = 0 \\implies (${bottom})\\frac{dy}{dx} = -(${top}),$$so $\\frac{dy}{dx} = ${answer}$.`,
            `对 $${poly([a, "xy"])}$ 用乘积法则，两边求导：$$${poly([2 * b, "x"], [a, "y"], [a, "x\\frac{dy}{dx}"], [2 * c, "y\\frac{dy}{dx}"])} = 0 \\implies (${bottom})\\frac{dy}{dx} = -(${top}),$$所以 $\\frac{dy}{dx} = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "implicit-slopes-at-a-point",
      title: t("Implicit slopes at a point", "隐函数在某点处的斜率"),
      explanation: t(
        "Implicit differentiation gives the slope in terms of both coordinates, so you need the full point on the curve to get a number. After finding $\\frac{dy}{dx}$ in terms of $x$ and $y$, substitute both coordinates of the point. For $x^{2} + xy + y^{2} = 7$ at $(1, 2)$: $\\frac{dy}{dx} = -\\frac{2(1) + 2}{1 + 2(2)} = -\\frac{4}{5}$.",
        "隐函数求导给出的斜率同时含有两个坐标，所以需要曲线上完整的点才能算出一个数。求出用 $x$ 和 $y$ 表示的 $\\frac{dy}{dx}$ 后，代入该点的两个坐标。对 $x^{2} + xy + y^{2} = 7$ 在 $(1, 2)$ 处：$\\frac{dy}{dx} = -\\frac{2(1) + 2}{1 + 2(2)} = -\\frac{4}{5}$。",
      ),
      generate(rng) {
        // a = ±2 would make the curve a pair of lines.
        const a = rng.pick([1, 3, -1, -3]);
        let x0 = rng.nonZero(-3, 3);
        let y0 = rng.nonZero(-3, 3);
        while (a * x0 + 2 * y0 === 0) [x0, y0] = [rng.nonZero(-3, 3), rng.nonZero(-3, 3)];
        const d = x0 * x0 + a * x0 * y0 + y0 * y0;
        const answer = Q.of(-(2 * x0 + a * y0), a * x0 + 2 * y0);
        return numberProblem({
          prompt: t(
            `The point $(${x0}, ${y0})$ lies on the curve $${poly([1, "x^{2}"], [a, "xy"], [1, "y^{2}"])} = ${d}$. Find the slope of the curve there.`,
            `点 $(${x0}, ${y0})$ 在曲线 $${poly([1, "x^{2}"], [a, "xy"], [1, "y^{2}"])} = ${d}$ 上。求曲线在该点处的斜率。`,
          ),
          answer,
          wrong: [Q.of(-x0, y0), Q.of(2 * x0 + a * y0, a * x0 + 2 * y0), Q.of(-(2 * x0), a * x0 + 2 * y0)],
          solution: t(
            `Implicit differentiation gives $\\frac{dy}{dx} = -\\frac{${poly([2, "x"], [a, "y"])}}{${poly([a, "x"], [2, "y"])}}$. At $(${x0}, ${y0})$ this is $-\\frac{${2 * x0 + a * y0}}{${a * x0 + 2 * y0}} = ${answer.toLatex()}$.`,
            `隐函数求导得 $\\frac{dy}{dx} = -\\frac{${poly([2, "x"], [a, "y"])}}{${poly([a, "x"], [2, "y"])}}$。在 $(${x0}, ${y0})$ 处为 $-\\frac{${2 * x0 + a * y0}}{${a * x0 + 2 * y0}} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** pythagorean are integer points on circles centered at the origin. */
const pythagorean: readonly (readonly [number, number])[] = [
  [3, 4],
  [4, 3],
  [5, 12],
  [12, 5],
  [6, 8],
  [8, 6],
  [0, 5],
  [1, 1],
  [2, 1],
  [1, 3],
];

/** calculatingSlopesOfCirclesEllipsesAndParabolas finds slopes of conics. */
export const calculatingSlopesOfCirclesEllipsesAndParabolas: TopicDef = {
  id: "calculating-slopes-of-circles-ellipses-and-parabolas",
  title: t("Calculating Slopes of Circles, Ellipses, and Parabolas", "计算圆、椭圆和抛物线的斜率"),
  summary: t(
    "Use implicit differentiation to find slopes of circles, ellipses and sideways parabolas.",
    "用隐函数求导计算圆、椭圆和开口向左右的抛物线的斜率。",
  ),
  prerequisites: ["implicit-differentiation", "equations-of-ellipses-centered-at-the-origin"],
  encompasses: [
    { topic: "implicit-differentiation", weight: 0.5 },
    { topic: "equations-of-circles", weight: 0.1 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "slopes-of-circles",
      title: t("Slopes of circles", "圆的斜率"),
      explanation: t(
        "The tangent to a circle is perpendicular to the radius, and the implicit derivative confirms this: its slope is the negative reciprocal of the radius slope. For the circle $(x - h)^{2} + (y - k)^{2} = r^{2}$,\n\n$$2(x - h) + 2(y - k)\\frac{dy}{dx} = 0 \\implies \\frac{dy}{dx} = -\\frac{x - h}{y - k}.$$\n\nThe tangent line is perpendicular to the radius, whose slope is $\\frac{y - k}{x - h}$.",
        "圆的切线垂直于半径，隐函数求导也证实了这一点：切线斜率是半径斜率的负倒数。对圆 $(x - h)^{2} + (y - k)^{2} = r^{2}$，\n\n$$2(x - h) + 2(y - k)\\frac{dy}{dx} = 0 \\implies \\frac{dy}{dx} = -\\frac{x - h}{y - k}.$$\n\n切线与半径垂直，半径的斜率为 $\\frac{y - k}{x - h}$。",
      ),
      generate(rng) {
        let [u, v] = rng.pick(pythagorean.filter(([, b]) => b !== 0));
        u *= rng.sign();
        v *= rng.sign();
        const h = rng.int(-4, 4);
        const k = rng.int(-4, 4);
        const r2 = u * u + v * v;
        const [x0, y0] = [h + u, k + v];
        const answer = Q.of(-u, v);
        const circle = `${h === 0 ? "x^{2}" : `(${poly([1, "x"], [-h, ""])})^{2}`} + ${k === 0 ? "y^{2}" : `(${poly([1, "y"], [-k, ""])})^{2}`} = ${r2}`;
        return numberProblem({
          prompt: t(
            `Find the slope of the tangent line to the circle $${circle}$ at the point $(${x0}, ${y0})$.`,
            `求圆 $${circle}$ 在点 $(${x0}, ${y0})$ 处的切线斜率。`,
          ),
          answer,
          wrong: [Q.of(v, u === 0 ? 1 : u), Q.of(u, v), Q.of(-x0, y0 === 0 ? 1 : y0)].filter((w) => !w.eq(answer)),
          solution: t(
            `$\\frac{dy}{dx} = -\\frac{${h === 0 ? "x" : poly([1, "x"], [-h, ""])}}{${k === 0 ? "y" : poly([1, "y"], [-k, ""])}}$. At $(${x0}, ${y0})$: $-\\frac{${u}}{${v}} = ${answer.toLatex()}$.`,
            `$\\frac{dy}{dx} = -\\frac{${h === 0 ? "x" : poly([1, "x"], [-h, ""])}}{${k === 0 ? "y" : poly([1, "y"], [-k, ""])}}$。在 $(${x0}, ${y0})$ 处：$-\\frac{${u}}{${v}} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "slopes-of-ellipses",
      title: t("Slopes of ellipses", "椭圆的斜率"),
      explanation: t(
        "Differentiate both sides with respect to the horizontal variable, treating the vertical variable as a function of it, and then solve for the derivative. For $px^{2} + qy^{2} = r$, $2px + 2qy\\frac{dy}{dx} = 0$, so\n\n$$\\frac{dy}{dx} = -\\frac{px}{qy}.$$",
        "两边对水平变量求导，把竖直变量看作它的函数，再解出导数。对 $px^{2} + qy^{2} = r$，$2px + 2qy\\frac{dy}{dx} = 0$，所以\n\n$$\\frac{dy}{dx} = -\\frac{px}{qy}.$$",
      ),
      generate(rng) {
        const [p, q] = rng.sample([1, 2, 3, 4, 5, 9, 16, 25], 2) as [number, number];
        const x0 = rng.nonZero(-3, 3);
        const y0 = rng.nonZero(-3, 3);
        const r = p * x0 * x0 + q * y0 * y0;
        const answer = Q.of(-p * x0, q * y0);
        return numberProblem({
          prompt: t(
            `Find the slope of the tangent line to the ellipse $${poly([p, "x^{2}"], [q, "y^{2}"])} = ${r}$ at the point $(${x0}, ${y0})$.`,
            `求椭圆 $${poly([p, "x^{2}"], [q, "y^{2}"])} = ${r}$ 在点 $(${x0}, ${y0})$ 处的切线斜率。`,
          ),
          answer,
          wrong: [Q.of(-x0, y0), Q.of(p * x0, q * y0), Q.of(-q * x0, p * y0)].filter((w) => !w.eq(answer)),
          solution: t(
            `$${poly([2 * p, "x"], [2 * q, "y\\frac{dy}{dx}"])} = 0$, so $\\frac{dy}{dx} = -\\frac{${poly([p, "x"])}}{${poly([q, "y"])}}$. At $(${x0}, ${y0})$: $-\\frac{${p * x0}}{${q * y0}} = ${answer.toLatex()}$.`,
            `$${poly([2 * p, "x"], [2 * q, "y\\frac{dy}{dx}"])} = 0$，所以 $\\frac{dy}{dx} = -\\frac{${poly([p, "x"])}}{${poly([q, "y"])}}$。在 $(${x0}, ${y0})$ 处：$-\\frac{${p * x0}}{${q * y0}} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "slopes-of-sideways-parabolas",
      title: t("Slopes of sideways parabolas", "开口向左右的抛物线的斜率"),
      explanation: t(
        "A parabola that opens sideways is not a function of the horizontal variable, but implicit differentiation still gives the slope at each point. A parabola $x = ay^{2} + by + c$ opens left or right. Differentiating with respect to $x$:\n\n$$1 = (2ay + b)\\frac{dy}{dx} \\implies \\frac{dy}{dx} = \\frac{1}{2ay + b}.$$",
        "开口向左右的抛物线不是水平变量的函数，但隐函数求导仍能给出每一点处的斜率。抛物线 $x = ay^{2} + by + c$ 开口向左或向右。对 $x$ 求导：\n\n$$1 = (2ay + b)\\frac{dy}{dx} \\implies \\frac{dy}{dx} = \\frac{1}{2ay + b}.$$",
      ),
      generate(rng) {
        const p: Poly = [rng.int(-5, 5), rng.int(-4, 4), rng.nonZero(-3, 3)];
        let y0 = rng.int(-3, 3);
        while (pAt(pDer(p), y0) === 0) y0 += 1;
        const x0 = pAt(p, y0);
        const d = pAt(pDer(p), y0);
        const answer = Q.of(1, d);
        return numberProblem({
          prompt: t(
            `Find the slope of the tangent line to the parabola $x = ${pLatex(p, "y")}$ at the point $(${x0}, ${y0})$.`,
            `求抛物线 $x = ${pLatex(p, "y")}$ 在点 $(${x0}, ${y0})$ 处的切线斜率。`,
          ),
          answer,
          wrong: [Q.of(d), Q.of(-1, d), Q.of(pAt(pDer(p), x0) || 1)].filter((w) => !w.eq(answer)),
          solution: t(
            `Differentiating with respect to $x$, $1 = (${pLatex(pDer(p), "y")})\\frac{dy}{dx}$. At $y = ${y0}$, $\\frac{dy}{dx} = ${reciprocal(d)}$.`,
            `对 $x$ 求导，$1 = (${pLatex(pDer(p), "y")})\\frac{dy}{dx}$。在 $y = ${y0}$ 处，$\\frac{dy}{dx} = ${reciprocal(d)}$。`,
          ),
        });
      },
    },
  ],
};

/** calculatingDyDxUsingDxDy finds dy/dx as the reciprocal of dx/dy. */
export const calculatingDyDxUsingDxDy: TopicDef = {
  id: "calculating-dy-dx-using-dx-dy",
  title: t("Calculating dy/dx Using dx/dy", "用 dx/dy 计算 dy/dx"),
  summary: t(
    "When x is given as a function of y, find dy/dx as the reciprocal of dx/dy.",
    "当 x 是 y 的函数时，把 dy/dx 作为 dx/dy 的倒数来求。",
  ),
  prerequisites: ["implicit-differentiation"],
  encompasses: [{ topic: "implicit-differentiation", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "dy-dx-as-a-reciprocal",
      title: t("dy/dx as a reciprocal", "dy/dx 作为倒数"),
      explanation: t(
        "When the curve is described with the horizontal variable as a function of the vertical one, the slope is the reciprocal of the derivative you can compute directly. When $x$ is a function of $y$, where $\\frac{dx}{dy} \\ne 0$,\n\n$$\\frac{dy}{dx} = \\frac{1}{\\frac{dx}{dy}}.$$\n\nFor $x = y^{3} + 2y$: $\\frac{dx}{dy} = 3y^{2} + 2$, so $\\frac{dy}{dx} = \\frac{1}{3y^{2} + 2}$.",
        "当曲线把水平变量表示为竖直变量的函数时，斜率就是可以直接求出的那个导数的倒数。当 $x$ 是 $y$ 的函数且 $\\frac{dx}{dy} \\ne 0$ 时，\n\n$$\\frac{dy}{dx} = \\frac{1}{\\frac{dx}{dy}}.$$\n\n对 $x = y^{3} + 2y$：$\\frac{dx}{dy} = 3y^{2} + 2$，所以 $\\frac{dy}{dx} = \\frac{1}{3y^{2} + 2}$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const p: Poly = [rng.int(-5, 5), rng.int(-5, 5), rng.int(-3, 3), rng.nonZero(-2, 2)];
        const k = rng.pick([2, 3, -1, -2]);
        const c = rng.int(-5, 5);
        const x =
          kind === 0
            ? pLatex(p, "y")
            : kind === 1
              ? sumLatex([`e^{${poly([k, "y"])}}`, poly([c, "y"])])
              : sumLatex([poly([k, "\\sin y"]), poly([c, "y"])]);
        const dx =
          kind === 0
            ? pLatex(pDer(p), "y")
            : kind === 1
              ? sumLatex([poly([k, `e^{${poly([k, "y"])}}`]), String(c)])
              : sumLatex([poly([k, "\\cos y"]), String(c)]);
        const answer = `\\frac{1}{${dx}}`;
        return functionProblem({
          prompt: t(
            `The curve is given by $x = ${x}$. Find $\\frac{dy}{dx}$ in terms of $y$.`,
            `曲线由 $x = ${x}$ 给出。用 $y$ 表示 $\\frac{dy}{dx}$。`,
          ),
          answer,
          prefix: dydx,
          variable: "y",
          wrong: [dx, `-\\frac{1}{${dx}}`, `\\frac{1}{${x}}`],
          solution: t(
            `$\\frac{dx}{dy} = ${dx}$, so $\\frac{dy}{dx} = ${answer}$.`,
            `$\\frac{dx}{dy} = ${dx}$，所以 $\\frac{dy}{dx} = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "dy-dx-at-a-point-from-dx-dy",
      title: t("dy/dx at a point from dx/dy", "由 dx/dy 求某点处的 dy/dx"),
      explanation: t(
        "To find the slope at a point, evaluate $\\frac{dx}{dy}$ at the point's $y$-coordinate and take the reciprocal.",
        "求某点处的斜率时，在该点的 $y$ 坐标处计算 $\\frac{dx}{dy}$，再取倒数。",
      ),
      generate(rng) {
        const p: Poly = [rng.int(-5, 5), rng.int(-5, 5), rng.int(-3, 3), rng.nonZero(-2, 2)];
        let y0 = rng.int(-2, 2);
        while (pAt(pDer(p), y0) === 0) y0 += 1;
        const x0 = pAt(p, y0);
        const d = pAt(pDer(p), y0);
        const answer = Q.of(1, d);
        return numberProblem({
          prompt: t(
            `The point $(${x0}, ${y0})$ lies on the curve $x = ${pLatex(p, "y")}$. Find $\\frac{dy}{dx}$ at this point.`,
            `点 $(${x0}, ${y0})$ 在曲线 $x = ${pLatex(p, "y")}$ 上。求该点处的 $\\frac{dy}{dx}$。`,
          ),
          answer,
          wrong: [Q.of(d), Q.of(1, pAt(pDer(p), x0) || 2), Q.of(-1, d)].filter((w) => !w.eq(answer)),
          solution: t(
            `$\\frac{dx}{dy} = ${pLatex(pDer(p), "y")}$, which is $${d}$ at $y = ${y0}$. So $\\frac{dy}{dx} = ${reciprocal(d)}$.`,
            `$\\frac{dx}{dy} = ${pLatex(pDer(p), "y")}$，在 $y = ${y0}$ 处为 $${d}$。所以 $\\frac{dy}{dx} = ${reciprocal(d)}$。`,
          ),
        });
      },
    },
  ],
};

/** differentiatingInverseFunctions differentiates inverse functions. */
export const differentiatingInverseFunctions: TopicDef = {
  id: "differentiating-inverse-functions",
  title: t("Differentiating Inverse Functions", "反函数求导"),
  summary: t(
    "Differentiate an inverse function with the formula (f⁻¹)'(x) = 1/f'(f⁻¹(x)).",
    "用公式 (f⁻¹)'(x) = 1/f'(f⁻¹(x)) 对反函数求导。",
  ),
  prerequisites: ["calculating-dy-dx-using-dx-dy", "calculating-the-inverse-of-a-function"],
  encompasses: [
    { topic: "calculating-dy-dx-using-dx-dy", weight: 0.4 },
    { topic: "calculating-the-inverse-of-a-function", weight: 0.2 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "the-derivative-of-an-inverse-function",
      title: t("The derivative of an inverse function", "反函数的导数"),
      explanation: t(
        "The graph of an inverse is the reflection of the original graph, so its slope at a point is the reciprocal of the original slope at the reflected point. If $y = f^{-1}(x)$, then $f(y) = x$, so $f'(y)\\frac{dy}{dx} = 1$:\n\n$$\\left(f^{-1}\\right)'(x) = \\frac{1}{f'\\left(f^{-1}(x)\\right)}.$$\n\nFor $f(x) = e^{2x}$: $f^{-1}(x) = \\frac{1}{2}\\ln x$ and $f'(x) = 2e^{2x}$, so $\\left(f^{-1}\\right)'(x) = \\frac{1}{2e^{\\ln x}} = \\frac{1}{2x}$.",
        "反函数的图像是原图像的对称图形，所以它在一点处的斜率是原函数在对称点处斜率的倒数。若 $y = f^{-1}(x)$，则 $f(y) = x$，于是 $f'(y)\\frac{dy}{dx} = 1$：\n\n$$\\left(f^{-1}\\right)'(x) = \\frac{1}{f'\\left(f^{-1}(x)\\right)}.$$\n\n对 $f(x) = e^{2x}$：$f^{-1}(x) = \\frac{1}{2}\\ln x$，$f'(x) = 2e^{2x}$，所以 $\\left(f^{-1}\\right)'(x) = \\frac{1}{2e^{\\ln x}} = \\frac{1}{2x}$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const a = rng.pick([2, 3, 4, 5, -1, -2]);
          const b = rng.int(-4, 4);
          const f = `e^{${poly([a, "x"], [b, ""])}}`;
          const answer = fracL(a < 0 ? -1 : 1, poly([Math.abs(a), "x"]));
          return functionProblem({
            prompt: t(
              `Let $f(x) = ${f}$. Find $\\left(f^{-1}\\right)'(x)$ for $x > 0$.`,
              `设 $f(x) = ${f}$。当 $x > 0$ 时，求 $\\left(f^{-1}\\right)'(x)$。`,
            ),
            answer,
            prefix: "\\left(f^{-1}\\right)'(x) =",
            positive: true,
            wrong: [`\\frac{1}{${f}}`, poly([a, "x"]), `\\frac{1}{x}`],
            solution: t(
              `$f'(x) = ${poly([a, f])}$ and $f(f^{-1}(x)) = x$, so $f'(f^{-1}(x)) = ${poly([a, "x"])}$ and $\\left(f^{-1}\\right)'(x) = ${answer}$.`,
              `$f'(x) = ${poly([a, f])}$，且 $f(f^{-1}(x)) = x$，所以 $f'(f^{-1}(x)) = ${poly([a, "x"])}$，$\\left(f^{-1}\\right)'(x) = ${answer}$。`,
            ),
          });
        }
        if (kind === 1) {
          const c = rng.int(-6, 0);
          const k = rng.pick([1, 1, 2, 3]);
          const f = poly([k, "x^{3}"], [c, ""]);
          const inside = poly([1, "x"], [-c, ""]);
          const arg = k === 1 ? inside : `\\frac{${inside}}{${k}}`;
          const answer = `\\frac{1}{${3 * k}\\left(${arg}\\right)^{\\frac{2}{3}}}`;
          return functionProblem({
            prompt: t(
              `Let $f(x) = ${f}$. Find $\\left(f^{-1}\\right)'(x)$ for $x > ${c}$.`,
              `设 $f(x) = ${f}$。当 $x > ${c}$ 时，求 $\\left(f^{-1}\\right)'(x)$。`,
            ),
            answer,
            prefix: "\\left(f^{-1}\\right)'(x) =",
            positive: true,
            wrong: [
              `\\frac{1}{${poly([3 * k, "x^{2}"])}}`,
              `${3 * k}\\left(${arg}\\right)^{\\frac{2}{3}}`,
              `\\frac{1}{3\\left(${arg}\\right)^{\\frac{2}{3}}}`,
            ],
            solution: t(
              `$f^{-1}(x) = \\left(${arg}\\right)^{\\frac{1}{3}}$ and $f'(x) = ${poly([3 * k, "x^{2}"])}$, so$$\\left(f^{-1}\\right)'(x) = \\frac{1}{${3 * k}\\left(f^{-1}(x)\\right)^{2}} = ${answer}.$$`,
              `$f^{-1}(x) = \\left(${arg}\\right)^{\\frac{1}{3}}$，$f'(x) = ${poly([3 * k, "x^{2}"])}$，所以$$\\left(f^{-1}\\right)'(x) = \\frac{1}{${3 * k}\\left(f^{-1}(x)\\right)^{2}} = ${answer}.$$`,
            ),
          });
        }
        const a = rng.int(2, 6);
        const b = rng.int(-5, 5);
        const f = sumLatex([`\\ln x`, String(b)]);
        const g = `e^{${poly([1, "x"], [-b, ""])}}`;
        void a;
        return functionProblem({
          prompt: t(
            `Let $f(x) = ${f}$ for $x > 0$. Find $\\left(f^{-1}\\right)'(x)$.`,
            `设 $f(x) = ${f}$，$x > 0$。求 $\\left(f^{-1}\\right)'(x)$。`,
          ),
          answer: g,
          prefix: "\\left(f^{-1}\\right)'(x) =",
          wrong: [`\\frac{1}{x}`, `e^{x}`, `-${g}`],
          solution: t(
            `$f'(x) = \\frac{1}{x}$ and $f^{-1}(x) = ${g}$, so $\\left(f^{-1}\\right)'(x) = \\frac{1}{1/f^{-1}(x)} = ${g}$.`,
            `$f'(x) = \\frac{1}{x}$，$f^{-1}(x) = ${g}$，所以 $\\left(f^{-1}\\right)'(x) = \\frac{1}{1/f^{-1}(x)} = ${g}$。`,
          ),
        });
      },
    },
    {
      id: "slopes-of-inverse-functions-are-reciprocals",
      title: t("Slopes of inverse functions are reciprocals", "反函数的斜率互为倒数"),
      explanation: t(
        "The graph of $f^{-1}$ is the reflection of the graph of $f$ in the line $y = x$. If $f(a) = b$ and $f'(a) = m \\ne 0$, then $f^{-1}(b) = a$ and\n\n$$\\left(f^{-1}\\right)'(b) = \\frac{1}{m}.$$",
        "$f^{-1}$ 的图像是 $f$ 的图像关于直线 $y = x$ 的对称图形。若 $f(a) = b$，$f'(a) = m \\ne 0$，则 $f^{-1}(b) = a$，且\n\n$$\\left(f^{-1}\\right)'(b) = \\frac{1}{m}.$$",
      ),
      generate(rng) {
        const a = rng.int(-6, 6);
        let b = rng.int(-9, 9);
        while (b === a) b = rng.int(-9, 9);
        const m = Q.of(rng.nonZero(-9, 9), rng.pick([1, 1, 2, 3, 4, 5]));
        const answer = Q.one.div(m);
        return numberProblem({
          prompt: t(
            `A differentiable function $f$ has an inverse, with $f(${a}) = ${b}$ and $f'(${a}) = ${m.toLatex()}$. Find $\\left(f^{-1}\\right)'(${b})$.`,
            `可导函数 $f$ 有反函数，且 $f(${a}) = ${b}$，$f'(${a}) = ${m.toLatex()}$。求 $\\left(f^{-1}\\right)'(${b})$。`,
          ),
          answer,
          wrong: [m, m.neg(), answer.neg()].filter((w) => !w.eq(answer)),
          solution: t(
            `$f^{-1}(${b}) = ${a}$, so $\\left(f^{-1}\\right)'(${b}) = \\frac{1}{f'(${a})} = ${answer.toLatex()}$.`,
            `$f^{-1}(${b}) = ${a}$，所以 $\\left(f^{-1}\\right)'(${b}) = \\frac{1}{f'(${a})} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** differentiatingAnInverseFunctionAtAPoint evaluates (f⁻¹)' at a point. */
export const differentiatingAnInverseFunctionAtAPoint: TopicDef = {
  id: "differentiating-an-inverse-function-at-a-point",
  title: t("Differentiating an Inverse Function at a Point", "求反函数在某点处的导数"),
  summary: t(
    "Find the derivative of an inverse function at a point without finding the inverse.",
    "不求出反函数，直接计算反函数在某点处的导数。",
  ),
  prerequisites: ["differentiating-inverse-functions"],
  encompasses: [{ topic: "differentiating-inverse-functions", weight: 0.6 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "inverse-derivatives-of-polynomials-at-a-point",
      title: t("Inverse derivatives of polynomials at a point", "多项式反函数在某点处的导数"),
      explanation: t(
        "To find $\\left(f^{-1}\\right)'(b)$, first find $a$ with $f(a) = b$ (often by trying small integers), then\n\n$$\\left(f^{-1}\\right)'(b) = \\frac{1}{f'(a)}.$$\n\nFor $f(x) = x^{3} + x$ and $b = 10$: $f(2) = 10$ and $f'(2) = 13$, so $\\left(f^{-1}\\right)'(10) = \\frac{1}{13}$.",
        "求 $\\left(f^{-1}\\right)'(b)$ 时，先找出满足 $f(a) = b$ 的 $a$（常可尝试较小的整数），则\n\n$$\\left(f^{-1}\\right)'(b) = \\frac{1}{f'(a)}.$$\n\n对 $f(x) = x^{3} + x$，$b = 10$：$f(2) = 10$，$f'(2) = 13$，所以 $\\left(f^{-1}\\right)'(10) = \\frac{1}{13}$。",
      ),
      generate(rng) {
        const p: Poly = [rng.int(-6, 6), rng.int(1, 6), 0, rng.pick([1, 1, 2])];
        const a = rng.int(-2, 2);
        const b = pAt(p, a);
        const d = pAt(pDer(p), a);
        const answer = Q.of(1, d);
        return numberProblem({
          prompt: t(
            `Let $f(x) = ${pLatex(p)}$, which is increasing and so has an inverse. Find $\\left(f^{-1}\\right)'(${b})$.`,
            `设 $f(x) = ${pLatex(p)}$，它是增函数，因此有反函数。求 $\\left(f^{-1}\\right)'(${b})$。`,
          ),
          answer,
          wrong: [Q.of(d), Q.of(1, pAt(pDer(p), b)), Q.of(a)].filter((w) => !w.eq(answer)),
          solution: t(
            `$f(${a}) = ${b}$, so $f^{-1}(${b}) = ${a}$. Since $f'(x) = ${pLatex(pDer(p))}$, $f'(${a}) = ${d}$ and$$\\left(f^{-1}\\right)'(${b}) = ${reciprocal(d)}.$$`,
            `$f(${a}) = ${b}$，所以 $f^{-1}(${b}) = ${a}$。因为 $f'(x) = ${pLatex(pDer(p))}$，$f'(${a}) = ${d}$，所以$$\\left(f^{-1}\\right)'(${b}) = ${reciprocal(d)}.$$`,
          ),
        });
      },
    },
    {
      id: "inverse-derivatives-from-a-table",
      title: t("Inverse derivatives from a table", "由表格求反函数的导数"),
      explanation: t(
        "To find $\\left(f^{-1}\\right)'(b)$ from a table, look for $b$ among the values of $f(x)$, not of $x$. The $x$ in that row is $f^{-1}(b)$; take the reciprocal of $f'$ there.",
        "由表格求 $\\left(f^{-1}\\right)'(b)$ 时，要在 $f(x)$ 的值中找 $b$，而不是在 $x$ 中找。该列的 $x$ 就是 $f^{-1}(b)$，再取该处 $f'$ 的倒数。",
      ),
      generate(rng) {
        const xs = [1, 2, 3, 4];
        const values = rng.sample([-3, -1, 0, 2, 5, 6, 7, 8, 9, 11], 4).sort((u, v) => u - v);
        const slopes = xs.map(() => rng.pick([1, 2, 3, 4, 5, 6]));
        const j = rng.int(0, 3);
        const b = values[j]!;
        const answer = Q.of(1, slopes[j]!);
        const tab = table(
          ["$x$", ...xs.map((x) => `$${x}$`)],
          ["$f(x)$", ...values.map((v) => `$${v}$`)],
          ["$f'(x)$", ...slopes.map((v) => `$${v}$`)],
        );
        const k = xs.indexOf(b);
        return numberProblem({
          prompt: t(
            `$f$ is differentiable and increasing. The table gives some of its values.\n\n${tab}\n\nFind $\\left(f^{-1}\\right)'(${b})$.`,
            `$f$ 可导且递增。下表给出它的一些值。\n\n${tab}\n\n求 $\\left(f^{-1}\\right)'(${b})$。`,
          ),
          answer,
          wrong: [Q.of(slopes[j]!), ...(k >= 0 ? [Q.of(1, slopes[k]!), Q.of(slopes[k]!)] : [Q.of(1, xs[j]!)])].filter((w) => !w.eq(answer)),
          solution: t(
            `$f(${xs[j]}) = ${b}$, so $f^{-1}(${b}) = ${xs[j]}$ and $\\left(f^{-1}\\right)'(${b}) = \\frac{1}{f'(${xs[j]})} = ${answer.toLatex()}$.`,
            `$f(${xs[j]}) = ${b}$，所以 $f^{-1}(${b}) = ${xs[j]}$，$\\left(f^{-1}\\right)'(${b}) = \\frac{1}{f'(${xs[j]})} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** InverseRule is an inverse function with its derivative in LaTeX and a typical wrong derivative. */
interface InverseRule {
  readonly name: string;
  readonly d: string;
  readonly bad: string;
}

/** scaled writes k times a derivative written as a fraction with an optional leading minus. */
function scaled(k: number, d: string): string {
  const negative = d.startsWith("-");
  const body = negative ? d.slice(1) : d;
  const sign = k < 0 !== negative ? "-" : "";
  const m = /^\\frac\{1\}(.*)$/.exec(body);
  const abs = Math.abs(k);
  return m ? `${sign}\\frac{${abs}}${m[1]}` : `${sign}${abs === 1 ? "" : abs}${body}`;
}

/** inverseTrigRules are the derivatives of arcsin, arccos and arctan. */
const inverseTrigRules: readonly InverseRule[] = [
  { name: "\\arcsin x", d: "\\frac{1}{\\sqrt{1 - x^{2}}}", bad: "\\frac{1}{\\sqrt{1 + x^{2}}}" },
  { name: "\\arccos x", d: "-\\frac{1}{\\sqrt{1 - x^{2}}}", bad: "\\frac{1}{\\sqrt{1 - x^{2}}}" },
  { name: "\\arctan x", d: "\\frac{1}{1 + x^{2}}", bad: "\\frac{1}{1 - x^{2}}" },
];

/** differentiatingInverseTrigonometricFunctions differentiates arcsin, arccos and arctan. */
export const differentiatingInverseTrigonometricFunctions: TopicDef = {
  id: "differentiating-inverse-trigonometric-functions",
  title: t("Differentiating Inverse Trigonometric Functions", "反三角函数求导"),
  summary: t(
    "Differentiate arcsin, arccos and arctan, including with inner functions.",
    "对 arcsin、arccos、arctan 求导，包括含内层函数的情形。",
  ),
  prerequisites: ["differentiating-inverse-functions", "evaluating-expressions-containing-inverse-trigonometric-functions"],
  encompasses: [
    { topic: "differentiating-inverse-functions", weight: 0.3 },
    { topic: "the-chain-rule-with-trigonometric-functions", weight: 0.2 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "derivatives-of-arcsin-arccos-and-arctan",
      title: t("Derivatives of arcsin, arccos and arctan", "arcsin、arccos、arctan 的导数"),
      explanation: t(
        "These formulas come from implicit differentiation of the inverse relation, followed by a Pythagorean identity that removes the trigonometric functions. $$\\frac{d}{dx}\\arcsin x = \\frac{1}{\\sqrt{1 - x^{2}}}, \\qquad \\frac{d}{dx}\\arccos x = -\\frac{1}{\\sqrt{1 - x^{2}}}, \\qquad \\frac{d}{dx}\\arctan x = \\frac{1}{1 + x^{2}}.$$\n\nFor $y = \\arcsin x$, $\\sin y = x$, so $\\cos y\\,\\frac{dy}{dx} = 1$, and $\\cos y = \\sqrt{1 - x^{2}}$ since $-\\frac{\\pi}{2} \\le y \\le \\frac{\\pi}{2}$.",
        "这些公式来自对反函数关系进行隐函数求导，再用勾股恒等式消去三角函数。$$\\frac{d}{dx}\\arcsin x = \\frac{1}{\\sqrt{1 - x^{2}}}, \\qquad \\frac{d}{dx}\\arccos x = -\\frac{1}{\\sqrt{1 - x^{2}}}, \\qquad \\frac{d}{dx}\\arctan x = \\frac{1}{1 + x^{2}}.$$\n\n对 $y = \\arcsin x$，$\\sin y = x$，所以 $\\cos y\\,\\frac{dy}{dx} = 1$；由于 $-\\frac{\\pi}{2} \\le y \\le \\frac{\\pi}{2}$，$\\cos y = \\sqrt{1 - x^{2}}$。",
      ),
      generate(rng) {
        const [r1, r2] = rng.sample(inverseTrigRules, 2) as [InverseRule, InverseRule];
        const a = rng.pick([1, 1, 2, 3, 4, 5, -1, -2, -3]);
        const b = rng.int(-4, 4);
        const f = sumLatex([poly([a, r1.name]), poly([b, r2.name])]);
        const answer = sumLatex([scaled(a, r1.d), b === 0 ? "" : scaled(b, r2.d)]);
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${f}$.`, `设 $f(x) = ${f}$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          wrong: [
            sumLatex([scaled(a, r1.bad), b === 0 ? "" : scaled(b, r2.bad)]),
            sumLatex([scaled(-a, r1.d), b === 0 ? "" : scaled(b, r2.d)]),
          ],
          solution: t(
            `Using $\\frac{d}{dx}${r1.name} = ${r1.d}$${b === 0 ? "" : ` and $\\frac{d}{dx}${r2.name} = ${r2.d}$`}:$$f'(x) = ${answer}.$$`,
            `由 $\\frac{d}{dx}${r1.name} = ${r1.d}$${b === 0 ? "" : `和 $\\frac{d}{dx}${r2.name} = ${r2.d}$`}：$$f'(x) = ${answer}.$$`,
          ),
        });
      },
    },
    {
      id: "inverse-trigonometric-functions-of-inner-functions",
      title: t("Inverse trigonometric functions of inner functions", "内层函数的反三角函数"),
      explanation: t(
        "Apply the formula for the inverse function with the inner function in place of the variable, then multiply by the derivative of the inner function. Use the chain rule. For example,\n\n$$\\frac{d}{dx}\\arctan(3x) = \\frac{3}{1 + 9x^{2}}, \\qquad \\frac{d}{dx}\\arcsin\\left(\\frac{x}{2}\\right) = \\frac{\\frac{1}{2}}{\\sqrt{1 - \\frac{x^{2}}{4}}} = \\frac{1}{\\sqrt{4 - x^{2}}}.$$",
        "把内层函数代替变量套用反函数的求导公式，再乘以内层函数的导数。使用链式法则。例如\n\n$$\\frac{d}{dx}\\arctan(3x) = \\frac{3}{1 + 9x^{2}}, \\qquad \\frac{d}{dx}\\arcsin\\left(\\frac{x}{2}\\right) = \\frac{\\frac{1}{2}}{\\sqrt{1 - \\frac{x^{2}}{4}}} = \\frac{1}{\\sqrt{4 - x^{2}}}.$$",
      ),
      generate(rng) {
        const kind = rng.int(0, 3);
        const k = rng.int(2, 9);
        const [f, answer, wrong] =
          kind === 0
            ? [
                `\\arcsin\\left(\\frac{x}{${k}}\\right)`,
                `\\frac{1}{\\sqrt{${k * k} - x^{2}}}`,
                [`\\frac{1}{\\sqrt{1 - x^{2}}}`, `\\frac{${k}}{\\sqrt{${k * k} - x^{2}}}`],
              ]
            : kind === 1
              ? [
                  `\\arccos\\left(\\frac{x}{${k}}\\right)`,
                  `-\\frac{1}{\\sqrt{${k * k} - x^{2}}}`,
                  [`\\frac{1}{\\sqrt{${k * k} - x^{2}}}`, `-\\frac{1}{${k}\\sqrt{1 - x^{2}}}`],
                ]
              : kind === 2
                ? [`\\arctan(${k}x)`, `\\frac{${k}}{1 + ${k * k}x^{2}}`, [`\\frac{1}{1 + ${k * k}x^{2}}`, `\\frac{${k}}{1 + x^{2}}`]]
                : [
                    `\\arctan\\left(\\frac{x}{${k}}\\right)`,
                    `\\frac{${k}}{${k * k} + x^{2}}`,
                    [`\\frac{1}{${k * k} + x^{2}}`, `\\frac{1}{1 + x^{2}}`],
                  ];
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${f}$.`, `设 $f(x) = ${f}$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          wrong,
          solution: t(
            `By the chain rule, multiply the derivative of the outer inverse trigonometric function at the inner function by the inner derivative ${kind === 2 ? `$${k}$` : `$\\frac{1}{${k}}$`}, and simplify: $f'(x) = ${answer}$.`,
            `由链式法则，用外层反三角函数在内层函数处的导数乘以内层函数的导数 ${kind === 2 ? `$${k}$` : `$\\frac{1}{${k}}$`}，再化简：$f'(x) = ${answer}$。`,
          ),
        });
      },
    },
  ],
};

/** inverseReciprocalTrigRules are the derivatives of arccot, arcsec and arccsc. */
const inverseReciprocalTrigRules: readonly InverseRule[] = [
  { name: "\\operatorname{arccot} x", d: "-\\frac{1}{1 + x^{2}}", bad: "\\frac{1}{1 + x^{2}}" },
  { name: "\\operatorname{arcsec} x", d: "\\frac{1}{|x|\\sqrt{x^{2} - 1}}", bad: "\\frac{1}{x\\sqrt{x^{2} - 1}}" },
  { name: "\\operatorname{arccsc} x", d: "-\\frac{1}{|x|\\sqrt{x^{2} - 1}}", bad: "\\frac{1}{|x|\\sqrt{x^{2} - 1}}" },
];

/** differentiatingInverseReciprocalTrigonometricFunctions differentiates arccot, arcsec and arccsc. */
export const differentiatingInverseReciprocalTrigonometricFunctions: TopicDef = {
  id: "differentiating-inverse-reciprocal-trigonometric-functions",
  title: t("Differentiating Inverse Reciprocal Trigonometric Functions", "反倒数三角函数求导"),
  summary: t("Differentiate arccot, arcsec and arccsc, and evaluate their derivatives.", "对 arccot、arcsec、arccsc 求导并计算导数值。"),
  prerequisites: ["differentiating-inverse-trigonometric-functions"],
  encompasses: [{ topic: "differentiating-inverse-trigonometric-functions", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "derivatives-of-arccot-arcsec-and-arccsc",
      title: t("Derivatives of arccot, arcsec and arccsc", "arccot、arcsec、arccsc 的导数"),
      explanation: t(
        "Each of these is the negative of, or closely related to, an earlier formula, and the absolute value in the arcsecant formula keeps its slope positive. $$\\frac{d}{dx}\\operatorname{arccot} x = -\\frac{1}{1 + x^{2}}, \\quad \\frac{d}{dx}\\operatorname{arcsec} x = \\frac{1}{|x|\\sqrt{x^{2} - 1}}, \\quad \\frac{d}{dx}\\operatorname{arccsc} x = -\\frac{1}{|x|\\sqrt{x^{2} - 1}}.$$\n\nThe absolute value makes the slope of $\\operatorname{arcsec} x$ positive for $x < -1$ as well as for $x > 1$.",
        "这些公式与前面的公式相差一个负号或密切相关，反正割公式中的绝对值保证了它的斜率为正。$$\\frac{d}{dx}\\operatorname{arccot} x = -\\frac{1}{1 + x^{2}}, \\quad \\frac{d}{dx}\\operatorname{arcsec} x = \\frac{1}{|x|\\sqrt{x^{2} - 1}}, \\quad \\frac{d}{dx}\\operatorname{arccsc} x = -\\frac{1}{|x|\\sqrt{x^{2} - 1}}.$$\n\n绝对值保证了 $\\operatorname{arcsec} x$ 在 $x < -1$ 和 $x > 1$ 时斜率都为正。",
      ),
      generate(rng) {
        const r = rng.pick(inverseReciprocalTrigRules);
        const k = rng.pick([1, 1, 2, 3, 4, 5, 6, 7, -1, -2, -3, -4]);
        const f = poly([k, r.name]);
        const answer = scaled(k, r.d);
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${f}$.`, `设 $f(x) = ${f}$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          wrong: [scaled(k, r.bad), scaled(-k, r.d)],
          solution: t(
            `$\\frac{d}{dx}${r.name} = ${r.d}$, so $f'(x) = ${answer}$.`,
            `$\\frac{d}{dx}${r.name} = ${r.d}$，所以 $f'(x) = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "evaluating-derivatives-of-inverse-reciprocal-trigonometric-functions",
      title: t("Evaluating derivatives of inverse reciprocal trigonometric functions", "计算反倒数三角函数的导数值"),
      explanation: t(
        "Substitute the point into the derivative formula and be careful with the absolute value and the signs before simplifying the radical. Substitute into the derivative and simplify radicals. For $\\operatorname{arcsec} x$ at $x = -2$: $\\frac{1}{|-2|\\sqrt{4 - 1}} = \\frac{1}{2\\sqrt{3}} = \\frac{\\sqrt{3}}{6}$.",
        "把该点代入导数公式，化简根式之前要注意绝对值和符号。代入导数并化简根式。对 $\\operatorname{arcsec} x$ 在 $x = -2$ 处：$\\frac{1}{|-2|\\sqrt{4 - 1}} = \\frac{1}{2\\sqrt{3}} = \\frac{\\sqrt{3}}{6}$。",
      ),
      generate(rng) {
        const r = rng.int(0, 2);
        const k = rng.pick([1, 2, 3, 4, 6, -1, -2, -3]);
        let x0: number;
        let value: string;
        let num: number;
        if (r === 0) {
          x0 = rng.nonZero(-5, 5);
          num = -k;
          value = Q.of(-k, 1 + x0 * x0).toLatex();
        } else {
          x0 = rng.pick([2, 3, -2, -3]);
          num = r === 1 ? k : -k;
          const [rad, den] = Math.abs(x0) === 2 ? ["\\sqrt{3}", 6] : ["\\sqrt{2}", 12];
          const c = Q.of(num, den);
          const cn = c.n < 0n ? -c.n : c.n;
          value = `${c.sign() < 0 ? "-" : ""}\\frac{${cn === 1n ? "" : cn}${rad}}{${c.d}}`;
          if (c.d === 1n) value = `${c.sign() < 0 ? "-" : ""}${cn === 1n ? "" : cn}${rad}`;
        }
        const rule = inverseReciprocalTrigRules[r]!;
        const f = poly([k, rule.name]);
        return functionProblem({
          prompt: t(`Let $f(x) = ${f}$. Find $f'(${x0})$.`, `设 $f(x) = ${f}$。求 $f'(${x0})$。`),
          answer: value,
          prefix: `f'(${x0}) =`,
          wrong:
            r === 0
              ? [Q.of(k, 1 + x0 * x0).toLatex(), Q.of(-k, x0 * x0).toLatex()]
              : [value.startsWith("-") ? value.slice(1) : `-${value}`],
          solution: t(
            `$f'(x) = ${scaled(k, rule.d)}$, so $f'(${x0}) = ${value}$.`,
            `$f'(x) = ${scaled(k, rule.d)}$，所以 $f'(${x0}) = ${value}$。`,
          ),
        });
      },
    },
  ],
};

/** inverseHyperbolicRules are the derivatives of arsinh, arcosh and artanh. */
const inverseHyperbolicRules: readonly InverseRule[] = [
  { name: "\\operatorname{arsinh} x", d: "\\frac{1}{\\sqrt{x^{2} + 1}}", bad: "\\frac{1}{\\sqrt{1 - x^{2}}}" },
  { name: "\\operatorname{arcosh} x", d: "\\frac{1}{\\sqrt{x^{2} - 1}}", bad: "-\\frac{1}{\\sqrt{1 - x^{2}}}" },
  { name: "\\operatorname{artanh} x", d: "\\frac{1}{1 - x^{2}}", bad: "\\frac{1}{1 + x^{2}}" },
];

/** differentiatingInverseHyperbolicFunctions differentiates arsinh, arcosh and artanh. */
export const differentiatingInverseHyperbolicFunctions: TopicDef = {
  id: "differentiating-inverse-hyperbolic-functions",
  title: t("Differentiating Inverse Hyperbolic Functions", "反双曲函数求导"),
  summary: t(
    "Differentiate arsinh, arcosh and artanh, including with inner functions.",
    "对 arsinh、arcosh、artanh 求导，包括含内层函数的情形。",
  ),
  prerequisites: ["differentiating-inverse-trigonometric-functions", "the-inverse-hyperbolic-functions"],
  encompasses: [
    { topic: "differentiating-inverse-functions", weight: 0.2 },
    { topic: "the-inverse-hyperbolic-functions", weight: 0.2 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "derivatives-of-arsinh-arcosh-and-artanh",
      title: t("Derivatives of arsinh, arcosh and artanh", "arsinh、arcosh、artanh 的导数"),
      explanation: t(
        "These formulas resemble the inverse trigonometric ones, with signs inside the radicals changed, reflecting the minus sign in the hyperbolic identity. $$\\frac{d}{dx}\\operatorname{arsinh} x = \\frac{1}{\\sqrt{x^{2} + 1}}, \\quad \\frac{d}{dx}\\operatorname{arcosh} x = \\frac{1}{\\sqrt{x^{2} - 1}} \\ (x > 1), \\quad \\frac{d}{dx}\\operatorname{artanh} x = \\frac{1}{1 - x^{2}} \\ (|x| < 1).$$\n\nFor $y = \\operatorname{arsinh} x$, $\\sinh y = x$, so $\\cosh y\\,\\frac{dy}{dx} = 1$ and $\\cosh y = \\sqrt{1 + \\sinh^{2}y} = \\sqrt{1 + x^{2}}$.",
        "这些公式与反三角函数的公式相似，只是根号内的符号不同，这反映了双曲恒等式中的负号。$$\\frac{d}{dx}\\operatorname{arsinh} x = \\frac{1}{\\sqrt{x^{2} + 1}}, \\quad \\frac{d}{dx}\\operatorname{arcosh} x = \\frac{1}{\\sqrt{x^{2} - 1}} \\ (x > 1), \\quad \\frac{d}{dx}\\operatorname{artanh} x = \\frac{1}{1 - x^{2}} \\ (|x| < 1).$$\n\n对 $y = \\operatorname{arsinh} x$，$\\sinh y = x$，所以 $\\cosh y\\,\\frac{dy}{dx} = 1$，而 $\\cosh y = \\sqrt{1 + \\sinh^{2}y} = \\sqrt{1 + x^{2}}$。",
      ),
      generate(rng) {
        const r = rng.pick(inverseHyperbolicRules);
        const k = rng.pick([1, 1, 2, 3, 4, 5, 6, 7, -1, -2, -3, -4]);
        const answer = scaled(k, r.d);
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${poly([k, r.name])}$.`, `设 $f(x) = ${poly([k, r.name])}$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          wrong: [scaled(k, r.bad), scaled(-k, r.d)],
          solution: t(
            `$\\frac{d}{dx}${r.name} = ${r.d}$, so $f'(x) = ${answer}$.`,
            `$\\frac{d}{dx}${r.name} = ${r.d}$，所以 $f'(x) = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "inverse-hyperbolic-functions-of-inner-functions",
      title: t("Inverse hyperbolic functions of inner functions", "内层函数的反双曲函数"),
      explanation: t(
        "As with every composite function, use the formula for the outer inverse function and then multiply by the derivative of what is inside. Use the chain rule: $\\frac{d}{dx}\\operatorname{arsinh}(3x) = \\frac{3}{\\sqrt{9x^{2} + 1}}$ and $\\frac{d}{dx}\\operatorname{artanh}\\left(\\frac{x}{2}\\right) = \\frac{\\frac{1}{2}}{1 - \\frac{x^{2}}{4}} = \\frac{2}{4 - x^{2}}$.",
        "与所有复合函数一样，先用外层反函数的公式，再乘以里面函数的导数。使用链式法则：$\\frac{d}{dx}\\operatorname{arsinh}(3x) = \\frac{3}{\\sqrt{9x^{2} + 1}}$，$\\frac{d}{dx}\\operatorname{artanh}\\left(\\frac{x}{2}\\right) = \\frac{\\frac{1}{2}}{1 - \\frac{x^{2}}{4}} = \\frac{2}{4 - x^{2}}$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const k = rng.int(2, 10);
        const [f, answer, wrong] =
          kind === 0
            ? [
                `\\operatorname{arsinh}(${k}x)`,
                `\\frac{${k}}{\\sqrt{${k * k}x^{2} + 1}}`,
                [`\\frac{1}{\\sqrt{${k * k}x^{2} + 1}}`, `\\frac{${k}}{\\sqrt{x^{2} + 1}}`],
              ]
            : kind === 1
              ? [
                  `\\operatorname{artanh}\\left(\\frac{x}{${k}}\\right)`,
                  `\\frac{${k}}{${k * k} - x^{2}}`,
                  [`\\frac{1}{${k * k} - x^{2}}`, `\\frac{${k}}{1 - x^{2}}`],
                ]
              : [
                  `\\operatorname{arsinh}\\left(\\frac{x}{${k}}\\right)`,
                  `\\frac{1}{\\sqrt{x^{2} + ${k * k}}}`,
                  [`\\frac{${k}}{\\sqrt{x^{2} + ${k * k}}}`, `\\frac{1}{\\sqrt{x^{2} + 1}}`],
                ];
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${f}$.`, `设 $f(x) = ${f}$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          wrong,
          solution: t(
            `By the chain rule, multiply by the inner derivative ${kind === 0 ? `$${k}$` : `$\\frac{1}{${k}}$`} and simplify: $f'(x) = ${answer}$.`,
            `由链式法则，乘以内层函数的导数 ${kind === 0 ? `$${k}$` : `$\\frac{1}{${k}}$`} 再化简：$f'(x) = ${answer}$。`,
          ),
        });
      },
    },
  ],
};

/** inverseReciprocalHyperbolicRules are the derivatives of arsech, arcsch and arcoth. */
const inverseReciprocalHyperbolicRules: readonly InverseRule[] = [
  { name: "\\operatorname{arsech} x", d: "-\\frac{1}{x\\sqrt{1 - x^{2}}}", bad: "\\frac{1}{x\\sqrt{1 - x^{2}}}" },
  { name: "\\operatorname{arcsch} x", d: "-\\frac{1}{|x|\\sqrt{1 + x^{2}}}", bad: "-\\frac{1}{x\\sqrt{1 + x^{2}}}" },
  { name: "\\operatorname{arcoth} x", d: "\\frac{1}{1 - x^{2}}", bad: "-\\frac{1}{1 - x^{2}}" },
];

/** differentiatingInverseReciprocalHyperbolicFunctions differentiates arsech, arcsch and arcoth. */
export const differentiatingInverseReciprocalHyperbolicFunctions: TopicDef = {
  id: "differentiating-inverse-reciprocal-hyperbolic-functions",
  title: t("Differentiating Inverse Reciprocal Hyperbolic Functions", "反倒数双曲函数求导"),
  summary: t("Differentiate arsech, arcsch and arcoth, and evaluate their derivatives.", "对 arsech、arcsch、arcoth 求导并计算导数值。"),
  prerequisites: ["differentiating-inverse-hyperbolic-functions"],
  encompasses: [{ topic: "differentiating-inverse-hyperbolic-functions", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "derivatives-of-arsech-arcsch-and-arcoth",
      title: t("Derivatives of arsech, arcsch and arcoth", "arsech、arcsch、arcoth 的导数"),
      explanation: t(
        "$$\\frac{d}{dx}\\operatorname{arsech} x = -\\frac{1}{x\\sqrt{1 - x^{2}}}, \\quad \\frac{d}{dx}\\operatorname{arcsch} x = -\\frac{1}{|x|\\sqrt{1 + x^{2}}}, \\quad \\frac{d}{dx}\\operatorname{arcoth} x = \\frac{1}{1 - x^{2}}.$$\n\n$\\operatorname{arsech}$ is defined for $0 < x \\le 1$, and $\\operatorname{arcoth}$ for $|x| > 1$: it has the same derivative formula as $\\operatorname{artanh}$, on a different domain.",
        "$$\\frac{d}{dx}\\operatorname{arsech} x = -\\frac{1}{x\\sqrt{1 - x^{2}}}, \\quad \\frac{d}{dx}\\operatorname{arcsch} x = -\\frac{1}{|x|\\sqrt{1 + x^{2}}}, \\quad \\frac{d}{dx}\\operatorname{arcoth} x = \\frac{1}{1 - x^{2}}.$$\n\n$\\operatorname{arsech}$ 的定义域为 $0 < x \\le 1$，$\\operatorname{arcoth}$ 的定义域为 $|x| > 1$：它与 $\\operatorname{artanh}$ 的导数公式相同，只是定义域不同。",
      ),
      generate(rng) {
        const k = rng.pick([1, 1, 2, 3, 4, 5, 6, 7, -1, -2, -3, -4]);
        if (rng.int(0, 2) === 0) {
          // arsech lives on 0 < x ≤ 1, so it is scaled to 0 < x ≤ a, which leaves room to check the answer.
          const a = rng.int(4, 6);
          const name = `\\operatorname{arsech}\\left(\\frac{x}{${a}}\\right)`;
          const d = (c: number) => `${c < 0 ? "-" : ""}\\frac{${Math.abs(c)}}{x\\sqrt{${a * a} - x^{2}}}`;
          return functionProblem({
            prompt: t(
              `Find $f'(x)$ for $f(x) = ${poly([k, name])}$, where $0 < x < ${a}$.`,
              `设 $f(x) = ${poly([k, name])}$，其中 $0 < x < ${a}$。求 $f'(x)$。`,
            ),
            answer: d(-k * a),
            prefix: "f'(x) =",
            positive: true,
            wrong: [d(k * a), d(-k), `${k < 0 ? "" : "-"}\\frac{${Math.abs(k)}}{x\\sqrt{1 - x^{2}}}`],
            solution: t(
              `$\\frac{d}{dx}\\operatorname{arsech} u = -\\frac{u'}{u\\sqrt{1 - u^{2}}}$. With $u = \\frac{x}{${a}}$,$$\\frac{d}{dx}${name} = -\\frac{\\frac{1}{${a}}}{\\frac{x}{${a}}\\sqrt{1 - \\frac{x^{2}}{${a * a}}}} = -\\frac{${a}}{x\\sqrt{${a * a} - x^{2}}},$$so $f'(x) = ${d(-k * a)}$.`,
              `$\\frac{d}{dx}\\operatorname{arsech} u = -\\frac{u'}{u\\sqrt{1 - u^{2}}}$。取 $u = \\frac{x}{${a}}$，$$\\frac{d}{dx}${name} = -\\frac{\\frac{1}{${a}}}{\\frac{x}{${a}}\\sqrt{1 - \\frac{x^{2}}{${a * a}}}} = -\\frac{${a}}{x\\sqrt{${a * a} - x^{2}}},$$所以 $f'(x) = ${d(-k * a)}$。`,
            ),
          });
        }
        const r = rng.pick(inverseReciprocalHyperbolicRules.slice(1));
        const answer = scaled(k, r.d);
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${poly([k, r.name])}$.`, `设 $f(x) = ${poly([k, r.name])}$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          wrong: [scaled(k, r.bad), scaled(-k, r.d)],
          solution: t(
            `$\\frac{d}{dx}${r.name} = ${r.d}$, so $f'(x) = ${answer}$.`,
            `$\\frac{d}{dx}${r.name} = ${r.d}$，所以 $f'(x) = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "evaluating-derivatives-of-inverse-reciprocal-hyperbolic-functions",
      title: t("Evaluating derivatives of inverse reciprocal hyperbolic functions", "计算反倒数双曲函数的导数值"),
      explanation: t(
        "Make sure the point lies in the domain of the function first, then substitute it into the derivative formula and simplify. Substitute into the derivative. For $\\operatorname{arcoth} x$ at $x = 3$: $\\frac{1}{1 - 9} = -\\frac{1}{8}$. For $\\operatorname{arsech} x$ at $x = \\frac{3}{5}$: $-\\frac{1}{\\frac{3}{5} \\cdot \\frac{4}{5}} = -\\frac{25}{12}$.",
        "先确认该点在函数的定义域内，再把它代入导数公式并化简。代入导数。对 $\\operatorname{arcoth} x$ 在 $x = 3$ 处：$\\frac{1}{1 - 9} = -\\frac{1}{8}$。对 $\\operatorname{arsech} x$ 在 $x = \\frac{3}{5}$ 处：$-\\frac{1}{\\frac{3}{5} \\cdot \\frac{4}{5}} = -\\frac{25}{12}$。",
      ),
      generate(rng) {
        const arcoth = rng.bool();
        const k = rng.pick([1, 2, 3, 4, 5, -1, -2, -3]);
        if (arcoth) {
          const x0 = rng.pick([2, 3, 4, 5, -2, -3, -4]);
          const answer = Q.of(k, 1 - x0 * x0);
          return numberProblem({
            prompt: t(
              `Let $f(x) = ${poly([k, "\\operatorname{arcoth} x"])}$. Find $f'(${x0})$.`,
              `设 $f(x) = ${poly([k, "\\operatorname{arcoth} x"])}$。求 $f'(${x0})$。`,
            ),
            answer,
            wrong: [Q.of(k, 1 + x0 * x0), answer.neg()],
            solution: t(
              `$f'(x) = ${scaled(k, "\\frac{1}{1 - x^{2}}")}$, so $f'(${x0}) = ${answer.toLatex()}$.`,
              `$f'(x) = ${scaled(k, "\\frac{1}{1 - x^{2}}")}$，所以 $f'(${x0}) = ${answer.toLatex()}$。`,
            ),
          });
        }
        const [p, q, r] = rng.pick([
          [3, 4, 5],
          [4, 3, 5],
          [5, 12, 13],
          [12, 5, 13],
          [8, 15, 17],
        ] as const);
        // At x = p/r, √(1 − x²) = q/r, so the derivative is −r²/(pq).
        const answer = Q.of(-k * r * r, p * q);
        return numberProblem({
          prompt: t(
            `Let $f(x) = ${poly([k, "\\operatorname{arsech} x"])}$. Find $f'\\left(\\frac{${p}}{${r}}\\right)$.`,
            `设 $f(x) = ${poly([k, "\\operatorname{arsech} x"])}$。求 $f'\\left(\\frac{${p}}{${r}}\\right)$。`,
          ),
          answer,
          wrong: [answer.neg(), Q.of(-k * r, p * q), Q.of(-k * r * r, q * q)].filter((w) => !w.eq(answer)),
          solution: t(
            `$f'(x) = ${scaled(k, "-\\frac{1}{x\\sqrt{1 - x^{2}}}")}$. At $x = \\frac{${p}}{${r}}$, $\\sqrt{1 - x^{2}} = \\frac{${q}}{${r}}$, so$$f'\\left(\\frac{${p}}{${r}}\\right) = ${par(-k)} \\cdot \\frac{1}{\\frac{${p}}{${r}} \\cdot \\frac{${q}}{${r}}} = ${answer.toLatex()}.$$`,
            `$f'(x) = ${scaled(k, "-\\frac{1}{x\\sqrt{1 - x^{2}}}")}$。在 $x = \\frac{${p}}{${r}}$ 处，$\\sqrt{1 - x^{2}} = \\frac{${q}}{${r}}$，所以$$f'\\left(\\frac{${p}}{${r}}\\right) = ${par(-k)} \\cdot \\frac{1}{\\frac{${p}}{${r}} \\cdot \\frac{${q}}{${r}}} = ${answer.toLatex()}.$$`,
          ),
        });
      },
    },
  ],
};

/** Exponent is an exponent g(x) of x^{g(x)}, with ln y = g(x) ln x and g'(x) ln x + g(x)/x written out. */
interface Exponent {
  readonly g: string;
  readonly lnY: string;
  readonly bracket: string;
}

/** exponent chooses an exponent for x^{g(x)}. */
function exponent(rng: Rng): Exponent {
  const kind = rng.int(0, 4);
  if (kind === 0) {
    const k = rng.int(1, 9);
    const g = poly([k, "x"]);
    return { g, lnY: `${g}\\ln x`, bracket: sumLatex([poly([k, "\\ln x"]), String(k)]) };
  }
  if (kind === 1) {
    const k = rng.int(2, 6);
    return { g: `x^{${k}}`, lnY: `x^{${k}}\\ln x`, bracket: `${k}${power(k - 1)}\\ln x + ${power(k - 1)}` };
  }
  if (kind === 2) {
    const c = rng.nonZero(-4, 6);
    const g = poly([1, "x"], [c, ""]);
    return { g, lnY: `(${g})\\ln x`, bracket: `\\ln x + \\frac{${g}}{x}` };
  }
  return rng.pick([
    { g: "\\sin x", lnY: "\\sin x\\ln x", bracket: "\\cos x\\ln x + \\frac{\\sin x}{x}" },
    { g: "\\cos x", lnY: "\\cos x\\ln x", bracket: "-\\sin x\\ln x + \\frac{\\cos x}{x}" },
    { g: "\\ln x", lnY: "(\\ln x)^{2}", bracket: "\\frac{2\\ln x}{x}" },
    { g: "\\sqrt{x}", lnY: "\\sqrt{x}\\ln x", bracket: "\\frac{\\ln x}{2\\sqrt{x}} + \\frac{1}{\\sqrt{x}}" },
    { g: "e^{x}", lnY: "e^{x}\\ln x", bracket: "e^{x}\\ln x + \\frac{e^{x}}{x}" },
  ]);
}

/** logarithmicDifferentiation differentiates variable powers. */
export const logarithmicDifferentiation: TopicDef = {
  id: "logarithmic-differentiation",
  title: t("Logarithmic Differentiation", "对数求导法"),
  summary: t(
    "Differentiate functions with a variable base and a variable exponent by taking logarithms first.",
    "先取对数，再对底数和指数都含变量的函数求导。",
  ),
  prerequisites: ["implicit-differentiation"],
  encompasses: [
    { topic: "implicit-differentiation", weight: 0.3 },
    { topic: "the-chain-rule-with-logarithmic-functions", weight: 0.3 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "variable-bases-and-exponents",
      title: t("Variable bases and exponents", "底数与指数都含变量"),
      explanation: t(
        "Neither the power rule nor the exponential rule applies to $y = x^{x}$. Take logarithms first: $\\ln y = x\\ln x$. Differentiating implicitly,\n\n$$\\frac{1}{y}\\frac{dy}{dx} = \\ln x + 1 \\implies \\frac{dy}{dx} = x^{x}(\\ln x + 1).$$",
        "幂法则和指数函数的求导法则都不适用于 $y = x^{x}$。先取对数：$\\ln y = x\\ln x$。用隐函数求导，\n\n$$\\frac{1}{y}\\frac{dy}{dx} = \\ln x + 1 \\implies \\frac{dy}{dx} = x^{x}(\\ln x + 1).$$",
      ),
      generate(rng) {
        const e = exponent(rng);
        const y = `x^{${e.g}}`;
        const answer = `${y}\\left(${e.bracket}\\right)`;
        return functionProblem({
          prompt: t(`Find $\\frac{dy}{dx}$ for $y = ${y}$, where $x > 0$.`, `设 $y = ${y}$，其中 $x > 0$。求 $\\frac{dy}{dx}$。`),
          answer,
          prefix: dydx,
          positive: true,
          wrong: [`\\left(${e.g}\\right)x^{${e.g} - 1}`, `${y}\\ln x`, `\\left(${e.bracket}\\right)`],
          solution: t(
            `$\\ln y = ${e.lnY}$. Differentiating, $\\frac{1}{y}\\frac{dy}{dx} = ${e.bracket}$, so$$\\frac{dy}{dx} = ${answer}.$$`,
            `$\\ln y = ${e.lnY}$。两边求导，$\\frac{1}{y}\\frac{dy}{dx} = ${e.bracket}$，所以$$\\frac{dy}{dx} = ${answer}.$$`,
          ),
        });
      },
    },
    {
      id: "a-function-to-a-variable-power",
      title: t("A function to a variable power", "函数的变量次幂"),
      explanation: t(
        "When the variable appears in both the base and the exponent, neither the power rule nor the exponential rule applies, so take logarithms first and differentiate implicitly. For $y = f(x)^{g(x)}$ with $f(x) > 0$: $\\ln y = g(x)\\ln f(x)$, so\n\n$$\\frac{dy}{dx} = f(x)^{g(x)}\\left(g'(x)\\ln f(x) + \\frac{g(x)f'(x)}{f(x)}\\right).$$",
        "当底数和指数中都有变量时，幂法则和指数法则都不适用，所以先取对数，再用隐函数求导。对 $y = f(x)^{g(x)}$（$f(x) > 0$）：$\\ln y = g(x)\\ln f(x)$，所以\n\n$$\\frac{dy}{dx} = f(x)^{g(x)}\\left(g'(x)\\ln f(x) + \\frac{g(x)f'(x)}{f(x)}\\right).$$",
      ),
      generate(rng) {
        const c = rng.int(1, 9);
        const a = rng.pick([1, 1, 2, 3]);
        const base = poly([a, "x^{2}"], [c, ""]);
        const k = rng.pick([1, 2, 3, 4]);
        const g = poly([k, "x"]);
        const y = `\\left(${base}\\right)^{${g}}`;
        const answer = `${y}\\left(${poly([k, `\\ln\\left(${base}\\right)`])} + \\frac{${poly([2 * a * k, "x^{2}"])}}{${base}}\\right)`;
        return functionProblem({
          prompt: t(`Find $\\frac{dy}{dx}$ for $y = ${y}$.`, `设 $y = ${y}$。求 $\\frac{dy}{dx}$。`),
          answer,
          prefix: dydx,
          wrong: [
            `${g}\\left(${base}\\right)^{${g} - 1} \\cdot ${poly([2 * a, "x"])}`,
            `${y} \\cdot ${poly([k, `\\ln\\left(${base}\\right)`])}`,
            `${y}\\left(${poly([k, `\\ln\\left(${base}\\right)`])} + \\frac{${poly([2 * a, "x"])}}{${base}}\\right)`,
          ],
          solution: t(
            `$\\ln y = ${poly([k, `x\\ln\\left(${base}\\right)`])}$. By the product and chain rules,$$\\frac{1}{y}\\frac{dy}{dx} = ${poly([k, `\\ln\\left(${base}\\right)`])} + ${poly([k, "x"])} \\cdot \\frac{${poly([2 * a, "x"])}}{${base}},$$so $\\frac{dy}{dx} = ${answer}$.`,
            `$\\ln y = ${poly([k, `x\\ln\\left(${base}\\right)`])}$。由乘积法则和链式法则，$$\\frac{1}{y}\\frac{dy}{dx} = ${poly([k, `\\ln\\left(${base}\\right)`])} + ${poly([k, "x"])} \\cdot \\frac{${poly([2 * a, "x"])}}{${base}},$$所以 $\\frac{dy}{dx} = ${answer}$。`,
          ),
        });
      },
    },
  ],
};

/** Factor is a factor (x + a)^m of a product, with m negative in the denominator. */
interface PowerFactor {
  readonly a: number;
  readonly m: Q;
}

/** factorLatex writes (x + a)^m for m > 0 as it appears in the function. */
function factorLatex(f: PowerFactor): string {
  const base = poly([1, "x"], [f.a, ""]);
  const m = f.m.sign() < 0 ? f.m.neg() : f.m;
  if (m.eq(Q.of(1, 2))) return `\\sqrt{${base}}`;
  if (m.eq(Q.one)) return f.a === 0 ? "x" : `(${base})`;
  return `${f.a === 0 ? "x" : `(${base})`}^{${m.toLatex()}}`;
}

/** furtherLogarithmicDifferentiation differentiates products and quotients of powers. */
export const furtherLogarithmicDifferentiation: TopicDef = {
  id: "further-logarithmic-differentiation",
  title: t("Further Logarithmic Differentiation", "对数求导法的进一步应用"),
  summary: t("Differentiate products and quotients of powers by taking logarithms first.", "先取对数，再对幂的乘积与商求导。"),
  prerequisites: ["logarithmic-differentiation"],
  encompasses: [{ topic: "logarithmic-differentiation", weight: 0.5 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "products-and-quotients-of-powers",
      title: t("Products and quotients of powers", "幂的乘积与商"),
      explanation: t(
        "For a product or quotient of several powers, taking logarithms turns it into a sum:\n\n$$y = \\frac{x^{2}(x + 1)^{3}}{\\sqrt{x + 4}} \\implies \\ln y = 2\\ln x + 3\\ln(x + 1) - \\frac{1}{2}\\ln(x + 4).$$\n\nSo $\\frac{dy}{dx} = y\\left(\\frac{2}{x} + \\frac{3}{x + 1} - \\frac{1}{2(x + 4)}\\right)$. Leave $y$ written out as the original function.",
        "对若干个幂的乘积或商，取对数后变为和：\n\n$$y = \\frac{x^{2}(x + 1)^{3}}{\\sqrt{x + 4}} \\implies \\ln y = 2\\ln x + 3\\ln(x + 1) - \\frac{1}{2}\\ln(x + 4).$$\n\n所以 $\\frac{dy}{dx} = y\\left(\\frac{2}{x} + \\frac{3}{x + 1} - \\frac{1}{2(x + 4)}\\right)$，其中 $y$ 写成原函数。",
      ),
      generate(rng) {
        const [a1, a2, a3] = rng.sample([0, 1, 2, 3, 4, 5, 6, 7], 3) as [number, number, number];
        const ms = [Q.of(rng.int(1, 5)), Q.of(rng.int(1, 4)), rng.pick([Q.of(-1, 2), Q.of(-1), Q.of(-2), Q.of(-3)])];
        const fs: PowerFactor[] = [
          { a: a1, m: ms[0]! },
          { a: a2, m: ms[1]! },
          { a: a3, m: ms[2]! },
        ];
        const top = fs
          .filter((f) => f.m.sign() > 0)
          .map(factorLatex)
          .join("");
        const bottom = fs
          .filter((f) => f.m.sign() < 0)
          .map(factorLatex)
          .join("");
        const y = `\\frac{${top}}{${bottom}}`;
        const term = (f: PowerFactor) => {
          const base = poly([1, "x"], [f.a, ""]);
          const c = f.m;
          const cn = c.n < 0n ? -c.n : c.n;
          return `${c.sign() < 0 ? "-" : ""}\\frac{${cn}}{${c.d === 1n ? "" : c.d}${c.d === 1n || f.a === 0 ? base : `(${base})`}}`;
        };
        const bracket = sumLatex(fs.map(term));
        const answer = `${y}\\left(${bracket}\\right)`;
        const flip = (s: string) => (s.startsWith("-") ? s.slice(1) : `-${s}`);
        const lnY = sumLatex(fs.map((f) => poly([f.m, `\\ln${f.a === 0 ? " x" : `(${poly([1, "x"], [f.a, ""])})`}`])));
        return functionProblem({
          prompt: t(`Find $\\frac{dy}{dx}$ for $y = ${y}$, where $x > 0$.`, `设 $y = ${y}$，其中 $x > 0$。求 $\\frac{dy}{dx}$。`),
          answer,
          prefix: dydx,
          positive: true,
          wrong: [`\\left(${bracket}\\right)`, `${y}\\left(${sumLatex([term(fs[0]!), term(fs[1]!), flip(term(fs[2]!))])}\\right)`],
          solution: t(
            `$\\ln y = ${lnY}$, so $\\frac{1}{y}\\frac{dy}{dx} = ${bracket}$ and$$\\frac{dy}{dx} = ${answer}.$$`,
            `$\\ln y = ${lnY}$，所以 $\\frac{1}{y}\\frac{dy}{dx} = ${bracket}$，$$\\frac{dy}{dx} = ${answer}.$$`,
          ),
        });
      },
    },
    {
      id: "logarithmic-derivatives-at-a-point",
      title: t("Logarithmic derivatives at a point", "对数求导法求某点处的导数"),
      explanation: t(
        "At a specific point it is easier to compute the value of the function and the value of the bracket separately and then multiply the two numbers. At a point, evaluate $y$ and the bracket separately, then multiply. For $y = x^{x}$ at $x = 2$: $y = 4$ and $\\ln 2 + 1$, so $\\frac{dy}{dx} = 4(\\ln 2 + 1)$.",
        "在具体的一点处，分别算出函数值和括号的值再把两个数相乘会更容易。在某点处，分别计算 $y$ 和括号内的值，再相乘。对 $y = x^{x}$ 在 $x = 2$ 处：$y = 4$，括号为 $\\ln 2 + 1$，所以 $\\frac{dy}{dx} = 4(\\ln 2 + 1)$。",
      ),
      generate(rng) {
        let x0 = rng.int(2, 4);
        let k = rng.int(1, 2);
        let c = rng.int(-2, 2);
        while (x0 ** (k * x0 + c) > 5000) [x0, k, c] = [rng.int(2, 4), rng.int(1, 2), rng.int(-2, 2)];
        const g = poly([k, "x"], [c, ""]);
        const y0 = x0 ** (k * x0 + c);
        const bracket = sumLatex([poly([k, `\\ln ${x0}`]), Q.of(k * x0 + c, x0).toLatex()]);
        const answer = `${y0 === 1 ? "" : y0}\\left(${bracket}\\right)`;
        const general = sumLatex([poly([k, "\\ln x"]), c === 0 ? String(k) : `\\frac{${g}}{x}`]);
        return functionProblem({
          prompt: t(
            `Let $y = x^{${g}}$. Find $\\frac{dy}{dx}$ at $x = ${x0}$.`,
            `设 $y = x^{${g}}$。求 $x = ${x0}$ 处的 $\\frac{dy}{dx}$。`,
          ),
          answer,
          wrong: [
            `${k * x0 + c} \\cdot ${x0}^{${k * x0 + c - 1}}`,
            `${y0}\\ln ${x0}`,
            `${y0}\\left(${poly([k, `\\ln ${x0}`])} + 1\\right)`,
          ],
          solution: t(
            `$\\ln y = ${c === 0 ? g : `(${g})`}\\ln x$, so $\\frac{1}{y}\\frac{dy}{dx} = ${general}$. At $x = ${x0}$, $y = ${x0}^{${k * x0 + c}} = ${y0}$, so$$\\frac{dy}{dx} = ${y0}\\left(${bracket}\\right)${y0 === 1 ? ` = ${bracket}` : ""}.$$`,
            `$\\ln y = ${c === 0 ? g : `(${g})`}\\ln x$，所以 $\\frac{1}{y}\\frac{dy}{dx} = ${general}$。在 $x = ${x0}$ 处，$y = ${x0}^{${k * x0 + c}} = ${y0}$，所以$$\\frac{dy}{dx} = ${y0}\\left(${bracket}\\right)${y0 === 1 ? ` = ${bracket}` : ""}.$$`,
          ),
        });
      },
    },
  ],
};

/** calculusIImplicitInverseTopics are the topics of Calculus I modules 5.12 and 5.13. */
export const calculusIImplicitInverseTopics: readonly TopicDef[] = [
  implicitDifferentiation,
  calculatingSlopesOfCirclesEllipsesAndParabolas,
  calculatingDyDxUsingDxDy,
  differentiatingInverseFunctions,
  differentiatingAnInverseFunctionAtAPoint,
  differentiatingInverseTrigonometricFunctions,
  differentiatingInverseReciprocalTrigonometricFunctions,
  differentiatingInverseHyperbolicFunctions,
  differentiatingInverseReciprocalHyperbolicFunctions,
  logarithmicDifferentiation,
  furtherLogarithmicDifferentiation,
];
