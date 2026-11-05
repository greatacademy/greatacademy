import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import type { Interval } from "@ga/subject-math";
import { linear, poly, Q } from "@ga/subject-math";

import { functionProblem, intervalProblem, numberProblem } from "../problems.ts";
import { oneOf } from "./calculus-common.ts";

// Calculus II unit 4: Sequences & Series, modules 4.22 (Taylor Polynomials) and 4.23 (Taylor Series).

/** factorial computes n!. */
const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));

/** qpow raises q to a non-negative integer power. */
function qpow(q: Q, e: number): Q {
  let r = Q.one;
  for (let i = 0; i < e; i++) r = r.mul(q);
  return r;
}

/** powTex writes k^e, with parentheses around a negative k. */
const powTex = (k: number, e: string) => (k < 0 ? `(${k})^{${e}}` : `${k}^{${e}}`);

/** around writes the ith power of (x − a), or of x when a is 0. */
function around(a: number, i: number): string {
  if (i === 0) return "";
  const base = a === 0 ? "x" : `(${linear(1, -a)})`;
  return i === 1 ? base : `${base}^{${i}}`;
}

/** taylorPoly writes c₀ + c₁(x − a) + c₂(x − a)² + ⋯. */
const taylorPoly = (cs: readonly Q[], a = 0) => poly(...cs.map((c, i) => [c, around(a, i)] as const));

/** nth writes f(a), f'(a), f''(a), f'''(a) or f⁽ⁿ⁾(a). */
const nth = (n: number, a: number | string) => (n === 0 ? `f(${a})` : n <= 3 ? `f${"'".repeat(n)}(${a})` : `f^{(${n})}(${a})`);

/** Family is a function with simple derivatives at 0. */
interface Family {
  readonly tex: string;
  readonly deriv: (n: number) => Q;
}

/** family picks e^{kx}, sin kx, cos kx, ln(1 + kx), 1/(1 − kx) or (1 + x)^m. */
function family(rng: Rng): Family {
  const k = rng.nonZero(-3, 3);
  const kx = poly([k, "x"]);
  const kind = rng.int(0, 5);
  if (kind === 0) return { tex: `e^{${kx}}`, deriv: (n) => qpow(Q.of(k), n) };
  if (kind === 1)
    return {
      tex: `\\sin(${kx})`,
      deriv: (n) => (n % 2 === 0 ? Q.zero : qpow(Q.of(k), n).mul(Q.of((n - 1) % 4 === 0 ? 1 : -1))),
    };
  if (kind === 2)
    return {
      tex: `\\cos(${poly([Math.abs(k), "x"])})`,
      deriv: (n) => (n % 2 === 1 ? Q.zero : qpow(Q.of(k), n).mul(Q.of(n % 4 === 0 ? 1 : -1))),
    };
  if (kind === 3)
    return {
      tex: `\\ln(${poly([1, ""], [k, "x"])})`,
      deriv: (n) => (n === 0 ? Q.zero : qpow(Q.of(k), n).mul(Q.of((n % 2 === 1 ? 1 : -1) * factorial(n - 1)))),
    };
  if (kind === 4) return { tex: `\\frac{1}{${poly([1, ""], [-k, "x"])}}`, deriv: (n) => qpow(Q.of(k), n).mul(Q.of(factorial(n))) };
  const m = rng.pick([-3, -2, -1, 2, 3, 4, 5, 6]);
  return {
    tex: `(1 + x)^{${m}}`,
    deriv: (n) => {
      let r = 1;
      for (let i = 0; i < n; i++) r *= m - i;
      return Q.of(r);
    },
  };
}

/** coefficients lists f⁽ⁱ⁾(0)/i! for i = 0, …, n. */
const coefficients = (f: Family, n: number) => Array.from({ length: n + 1 }, (_, i) => f.deriv(i).div(Q.of(factorial(i))));

/** derivativeValues lists f(0) = …, f'(0) = …, up to the nth derivative. */
const derivativeValues = (f: Family, n: number) =>
  Array.from({ length: n + 1 }, (_, i) => `${nth(i, 0)} = ${f.deriv(i).toLatex()}`).join(", \\; ");

/** maclaurinPolynomialProblem asks for the Maclaurin polynomial of degree n of a family function. */
function maclaurinPolynomialProblem(rng: Rng, n: 2 | 3) {
  const f = family(rng);
  const cs = coefficients(f, n);
  const answer = taylorPoly(cs);
  const unhalved = taylorPoly(cs.map((c, i) => c.mul(Q.of(factorial(i)))));
  return functionProblem({
    prompt: t(
      `Find the Taylor polynomial of degree ${n} for $f(x) = ${f.tex}$ centered at $x = 0$.`,
      `求 $f(x) = ${f.tex}$ 以 $x = 0$ 为中心的 ${n} 次泰勒多项式。`,
    ),
    answer,
    prefix: `P_${n}(x) =`,
    wrong: [unhalved, taylorPoly(cs.slice(0, n))],
    solution: t(
      `$${derivativeValues(f, n)}$. Dividing the $k$th derivative by $k!$ gives $P_{${n}}(x) = ${answer}$.`,
      `$${derivativeValues(f, n)}$。把第 $k$ 阶导数除以 $k!$，得 $P_{${n}}(x) = ${answer}$。`,
    ),
  });
}

/** fromValuesProblem asks for Pₙ centered at a from the values of f and its derivatives there. */
function fromValuesProblem(rng: Rng, n: 2 | 3) {
  const a = rng.int(-3, 3);
  const values = Array.from({ length: n + 1 }, (_, i) => (i === 0 || i === n ? rng.nonZero(-9, 9) : rng.int(-9, 9)));
  const cs = values.map((v, i) => Q.of(v, factorial(i)));
  const answer = taylorPoly(cs, a);
  const given = values.map((v, i) => `${nth(i, a)} = ${v}`).join(", \\; ");
  const general = Array.from({ length: n + 1 }, (_, i) =>
    i === 0 ? nth(0, a) : i === 1 ? `${nth(1, a)}${around(a, 1)}` : `\\frac{${nth(i, a)}}{${i}!}${around(a, i)}`,
  ).join(" + ");
  return functionProblem({
    prompt: t(
      `Suppose $${given}$. Find the Taylor polynomial of degree ${n} for $f$ centered at $x = ${a}$.`,
      `设 $${given}$。求 $f$ 以 $x = ${a}$ 为中心的 ${n} 次泰勒多项式。`,
    ),
    answer,
    prefix: `P_${n}(x) =`,
    wrong: [
      taylorPoly(
        values.map((v) => Q.of(v)),
        a,
      ),
      taylorPoly(cs, -a),
      taylorPoly(
        values.map((v, i) => Q.of(v, Math.max(1, i))),
        a,
      ),
    ],
    solution: t(`$P_{${n}}(x) = ${general} = ${answer}$.`, `$P_{${n}}(x) = ${general} = ${answer}$。`),
  });
}

/** secondDegreeTaylorPolynomials match a function's value, slope and concavity at a point. */
export const secondDegreeTaylorPolynomials: TopicDef = {
  id: "second-degree-taylor-polynomials",
  title: t("Second-Degree Taylor Polynomials", "二次泰勒多项式"),
  summary: t(
    "P₂(x) = f(a) + f'(a)(x − a) + f''(a)/2 · (x − a)² matches f, f' and f'' at x = a.",
    "P₂(x) = f(a) + f'(a)(x − a) + f''(a)/2 · (x − a)² 在 x = a 处与 f、f'、f'' 都相等。",
  ),
  prerequisites: ["approximating-functions-using-local-linearity-and-linearization"],
  encompasses: [{ topic: "approximating-functions-using-local-linearity-and-linearization", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "second-degree-taylor-polynomials-from-derivative-values",
      title: t("Building $P_2$ from derivative values", "由导数值构造 $P_2$"),
      explanation: t(
        "The linearization matches $f$ and $f'$ at $a$. Adding a quadratic term also matches $f''$:\n\n$$P_2(x) = f(a) + f'(a)(x - a) + \\frac{f''(a)}{2}(x - a)^{2}.$$\n\nThe $\\frac{1}{2}$ is needed because the second derivative of $(x - a)^{2}$ is $2$. If $f(1) = 3$, $f'(1) = -2$ and $f''(1) = 4$, then $P_2(x) = 3 - 2(x - 1) + 2(x - 1)^{2}$.",
        "线性化在 $a$ 处与 $f$、$f'$ 相等。再加一个二次项，就能让 $f''$ 也相等：\n\n$$P_2(x) = f(a) + f'(a)(x - a) + \\frac{f''(a)}{2}(x - a)^{2}。$$\n\n之所以要乘 $\\frac{1}{2}$，是因为 $(x - a)^{2}$ 的二阶导数是 $2$。若 $f(1) = 3$，$f'(1) = -2$，$f''(1) = 4$，则 $P_2(x) = 3 - 2(x - 1) + 2(x - 1)^{2}$。",
      ),
      generate: (rng) => fromValuesProblem(rng, 2),
    },
    {
      id: "second-degree-taylor-polynomials-of-functions",
      title: t("$P_2$ for a given function", "给定函数的 $P_2$"),
      explanation: t(
        "The second degree Taylor polynomial matches the value, slope and curvature of the function at the center, so it follows the curve better than the tangent line. Compute $f(a)$, $f'(a)$ and $f''(a)$, then substitute. For $f(x) = e^{3x}$ at $a = 0$: $f(0) = 1$, $f'(0) = 3$, $f''(0) = 9$, so $P_2(x) = 1 + 3x + \\frac{9}{2}x^{2}$.",
        "二次泰勒多项式在中心处与函数的值、斜率和弯曲程度都一致，所以比切线更贴近曲线。先求 $f(a)$、$f'(a)$、$f''(a)$，再代入公式。对 $f(x) = e^{3x}$，$a = 0$：$f(0) = 1$，$f'(0) = 3$，$f''(0) = 9$，所以 $P_2(x) = 1 + 3x + \\frac{9}{2}x^{2}$。",
      ),
      generate: (rng) => maclaurinPolynomialProblem(rng, 2),
    },
  ],
};

/** behaviors are what a second-degree Taylor polynomial says about f near its center. */
const behaviors = [
  t("f has a local minimum at x = a.", "f 在 x = a 处取得局部极小值。"),
  t("f has a local maximum at x = a.", "f 在 x = a 处取得局部极大值。"),
  t("f has neither a local maximum nor a local minimum at x = a.", "f 在 x = a 处既无局部极大值也无局部极小值。"),
] as const;

/** analyzingSecondDegreeTaylorPolynomials reads derivatives and local behavior from P₂. */
export const analyzingSecondDegreeTaylorPolynomials: TopicDef = {
  id: "analyzing-second-degree-taylor-polynomials",
  title: t("Analyzing Second-Degree Taylor Polynomials", "分析二次泰勒多项式"),
  summary: t(
    "The coefficients of P₂ give f(a), f'(a) and f''(a)/2, which describe f near a and approximate nearby values.",
    "P₂ 的系数给出 f(a)、f'(a) 和 f''(a)/2，可以描述 f 在 a 附近的性态并近似附近的函数值。",
  ),
  prerequisites: ["second-degree-taylor-polynomials", "the-second-derivative-test"],
  encompasses: [{ topic: "second-degree-taylor-polynomials", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "reading-derivatives-from-p2",
      title: t("Reading derivatives from $P_2$", "从 $P_2$ 读出导数"),
      explanation: t(
        "Each coefficient of a Taylor polynomial is a derivative at the center divided by a factorial, so multiplying by the factorial recovers the derivative. In $P_2(x) = c_0 + c_1(x - a) + c_2(x - a)^{2}$, $c_0 = f(a)$, $c_1 = f'(a)$ and $c_2 = \\frac{f''(a)}{2}$, so $f''(a) = 2c_2$. For $P_2(x) = 5 - (x - 2) + 3(x - 2)^{2}$: $f'(2) = -1$ and $f''(2) = 6$.",
        "泰勒多项式的每个系数都是中心处的导数除以阶乘，所以乘以阶乘就能还原出导数。在 $P_2(x) = c_0 + c_1(x - a) + c_2(x - a)^{2}$ 中，$c_0 = f(a)$，$c_1 = f'(a)$，$c_2 = \\frac{f''(a)}{2}$，所以 $f''(a) = 2c_2$。对 $P_2(x) = 5 - (x - 2) + 3(x - 2)^{2}$：$f'(2) = -1$，$f''(2) = 6$。",
      ),
      generate(rng) {
        const a = rng.int(-4, 4);
        const c = [rng.int(-9, 9), rng.nonZero(-9, 9), rng.nonZero(-9, 9)] as const;
        const p = taylorPoly(
          c.map((v) => Q.of(v)),
          a,
        );
        const second = rng.bool();
        const answer = second ? 2 * c[2] : c[1];
        return numberProblem({
          prompt: t(
            `The second-degree Taylor polynomial for $f$ centered at $x = ${a}$ is $P_2(x) = ${p}$. Find $${nth(second ? 2 : 1, a)}$.`,
            `$f$ 以 $x = ${a}$ 为中心的二次泰勒多项式为 $P_2(x) = ${p}$。求 $${nth(second ? 2 : 1, a)}$。`,
          ),
          answer,
          wrong: second ? [c[2], Q.of(c[2], 2), c[1]] : [c[0], 2 * c[1], c[2]],
          solution: second
            ? t(
                `The coefficient of $${around(a, 2)}$ is $\\frac{${nth(2, a)}}{2} = ${c[2]}$, so $${nth(2, a)} = ${2 * c[2]}$.`,
                `$${around(a, 2)}$ 的系数是 $\\frac{${nth(2, a)}}{2} = ${c[2]}$，所以 $${nth(2, a)} = ${2 * c[2]}$。`,
              )
            : t(
                `The coefficient of $${around(a, 1)}$ is $${nth(1, a)} = ${c[1]}$.`,
                `$${around(a, 1)}$ 的系数就是 $${nth(1, a)} = ${c[1]}$。`,
              ),
        });
      },
    },
    {
      id: "local-behavior-from-p2",
      title: t("Local behavior from $P_2$", "由 $P_2$ 判断局部性态"),
      explanation: t(
        "If $P_2(x) = c_0 + c_2(x - a)^{2}$ has no linear term, then $f'(a) = 0$ and the sign of $f''(a) = 2c_2$ decides by the second derivative test: a **local minimum** when $c_2 > 0$ and a **local maximum** when $c_2 < 0$. If the linear coefficient is not $0$, then $f'(a) \\neq 0$ and $a$ is not a local extremum.",
        "若 $P_2(x) = c_0 + c_2(x - a)^{2}$ 没有一次项，则 $f'(a) = 0$，再由 $f''(a) = 2c_2$ 的符号按二阶导数判别法判断：$c_2 > 0$ 时为**局部极小值**，$c_2 < 0$ 时为**局部极大值**。若一次项系数不为 $0$，则 $f'(a) \\neq 0$，$a$ 不是局部极值点。",
      ),
      generate(rng) {
        const a = rng.nonZero(-5, 5);
        const c0 = rng.int(-9, 9);
        const c1 = rng.int(0, 2) === 0 ? rng.nonZero(-9, 9) : 0;
        const c2 = rng.nonZero(-9, 9);
        const p = taylorPoly([Q.of(c0), Q.of(c1), Q.of(c2)], a);
        const right = c1 !== 0 ? 2 : c2 > 0 ? 0 : 1;
        return oneOf(
          rng,
          t(
            `The second-degree Taylor polynomial for $f$ centered at $x = ${a}$ is $P_2(x) = ${p}$. What can you conclude about $f$ at $x = ${a}$?`,
            `$f$ 以 $x = ${a}$ 为中心的二次泰勒多项式为 $P_2(x) = ${p}$。关于 $f$ 在 $x = ${a}$ 处能得出什么结论？`,
          ),
          behaviors[right],
          behaviors.filter((_, i) => i !== right),
          c1 !== 0
            ? t(
                `$${nth(1, a)} = ${c1} \\neq 0$, so $x = ${a}$ is not a critical point and there is no local extremum there.`,
                `$${nth(1, a)} = ${c1} \\neq 0$，所以 $x = ${a}$ 不是临界点，那里没有局部极值。`,
              )
            : t(
                `$${nth(1, a)} = 0$ and $${nth(2, a)} = 2 \\cdot ${c2 < 0 ? `(${c2})` : c2} = ${2 * c2} ${c2 > 0 ? "> 0" : "< 0"}$, so by the second derivative test $f$ has a local ${c2 > 0 ? "minimum" : "maximum"} there.`,
                `$${nth(1, a)} = 0$，$${nth(2, a)} = 2 \\cdot ${c2 < 0 ? `(${c2})` : c2} = ${2 * c2} ${c2 > 0 ? "> 0" : "< 0"}$，由二阶导数判别法，$f$ 在该处取得局部${c2 > 0 ? "极小值" : "极大值"}。`,
              ),
        );
      },
    },
    {
      id: "approximating-with-p2",
      title: t("Approximating values with $P_2$", "用 $P_2$ 近似函数值"),
      explanation: t(
        "Substitute the nearby value into the polynomial instead of the function, which gives an estimate that is accurate when the value is close to the center. Near $a$, $f(x) \\approx P_2(x)$, usually much better than the linearization. With $P_2(x) = 4 + 2(x - 1) - 3(x - 1)^{2}$: $f(1.1) \\approx 4 + 2(0.1) - 3(0.1)^{2} = 4.17$.",
        "把附近的值代入多项式而不是原函数，当这个值离中心很近时，得到的估计值很准确。在 $a$ 附近 $f(x) \\approx P_2(x)$，通常比线性化精确得多。对 $P_2(x) = 4 + 2(x - 1) - 3(x - 1)^{2}$：$f(1.1) \\approx 4 + 2(0.1) - 3(0.1)^{2} = 4.17$。",
      ),
      generate(rng) {
        const a = rng.int(-3, 3);
        const c = [rng.int(-9, 9), rng.nonZero(-9, 9), rng.nonZero(-9, 9)] as const;
        const h = rng.pick([Q.of(1, 10), Q.of(-1, 10), Q.of(1, 5), Q.of(-1, 5), Q.of(1, 2), Q.of(-1, 2)]);
        const x0 = Q.of(a).add(h);
        const p = taylorPoly(
          c.map((v) => Q.of(v)),
          a,
        );
        const linearPart = Q.of(c[0]).add(Q.of(c[1]).mul(h));
        const answer = linearPart.add(Q.of(c[2]).mul(h).mul(h));
        return numberProblem({
          prompt: t(
            `The second-degree Taylor polynomial for $f$ centered at $x = ${a}$ is $P_2(x) = ${p}$. Use it to approximate $f\\left(${x0.toLatex()}\\right)$.`,
            `$f$ 以 $x = ${a}$ 为中心的二次泰勒多项式为 $P_2(x) = ${p}$。用它近似 $f\\left(${x0.toLatex()}\\right)$。`,
          ),
          answer,
          wrong: [
            linearPart,
            linearPart.add(
              Q.of(2 * c[2])
                .mul(h)
                .mul(h),
            ),
            linearPart.sub(Q.of(c[2]).mul(h).mul(h)),
          ],
          solution: t(
            `Here $x - ${a < 0 ? `(${a})` : a} = ${h.toLatex()}$, so $f\\left(${x0.toLatex()}\\right) \\approx ${c[0]} + ${c[1] < 0 ? `(${c[1]})` : c[1]}\\left(${h.toLatex()}\\right) + ${c[2] < 0 ? `(${c[2]})` : c[2]}\\left(${h.toLatex()}\\right)^{2} = ${answer.toLatex()}$.`,
            `这里 $x - ${a < 0 ? `(${a})` : a} = ${h.toLatex()}$，所以 $f\\left(${x0.toLatex()}\\right) \\approx ${c[0]} + ${c[1] < 0 ? `(${c[1]})` : c[1]}\\left(${h.toLatex()}\\right) + ${c[2] < 0 ? `(${c[2]})` : c[2]}\\left(${h.toLatex()}\\right)^{2} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** thirdDegreeTaylorPolynomials add a cubic term that matches f'''(a). */
export const thirdDegreeTaylorPolynomials: TopicDef = {
  id: "third-degree-taylor-polynomials",
  title: t("Third-Degree Taylor Polynomials", "三次泰勒多项式"),
  summary: t(
    "P₃(x) = P₂(x) + f'''(a)/3! · (x − a)³ also matches the third derivative at x = a.",
    "P₃(x) = P₂(x) + f'''(a)/3! · (x − a)³ 在 x = a 处连三阶导数也相等。",
  ),
  prerequisites: ["second-degree-taylor-polynomials"],
  encompasses: [{ topic: "second-degree-taylor-polynomials", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "third-degree-taylor-polynomials-from-derivative-values",
      title: t("Building $P_3$ from derivative values", "由导数值构造 $P_3$"),
      explanation: t(
        "Each new term uses the next derivative at the center, divided by the factorial of its order, multiplied by the matching power of the distance from the center. The third derivative of $(x - a)^{3}$ is $3! = 6$, so the cubic coefficient is $\\frac{f'''(a)}{3!}$:\n\n$$P_3(x) = f(a) + f'(a)(x - a) + \\frac{f''(a)}{2!}(x - a)^{2} + \\frac{f'''(a)}{3!}(x - a)^{3}.$$\n\nIf $f(0) = 2$, $f'(0) = 1$, $f''(0) = -4$ and $f'''(0) = 12$, then $P_3(x) = 2 + x - 2x^{2} + 2x^{3}$.",
        "每增加一项就用中心处的下一阶导数，除以其阶数的阶乘，再乘以到中心距离的相应次幂。$(x - a)^{3}$ 的三阶导数是 $3! = 6$，所以三次项系数为 $\\frac{f'''(a)}{3!}$：\n\n$$P_3(x) = f(a) + f'(a)(x - a) + \\frac{f''(a)}{2!}(x - a)^{2} + \\frac{f'''(a)}{3!}(x - a)^{3}。$$\n\n若 $f(0) = 2$，$f'(0) = 1$，$f''(0) = -4$，$f'''(0) = 12$，则 $P_3(x) = 2 + x - 2x^{2} + 2x^{3}$。",
      ),
      generate: (rng) => fromValuesProblem(rng, 3),
    },
    {
      id: "third-degree-taylor-polynomials-of-functions",
      title: t("$P_3$ for a given function", "给定函数的 $P_3$"),
      explanation: t(
        "Find the first three derivatives, evaluate them and the function at the center, and divide each by the right factorial to get the coefficients. Differentiate three times and evaluate at the center. For $f(x) = \\sin(2x)$ at $0$: $f(0) = 0$, $f'(0) = 2$, $f''(0) = 0$, $f'''(0) = -8$, so $P_3(x) = 2x - \\frac{8}{6}x^{3} = 2x - \\frac{4}{3}x^{3}$.",
        "求出前三阶导数，把它们和函数在中心处的值算出来，再分别除以相应的阶乘得到系数。求三阶导数并在中心处取值。对 $f(x) = \\sin(2x)$，中心 $0$：$f(0) = 0$，$f'(0) = 2$，$f''(0) = 0$，$f'''(0) = -8$，所以 $P_3(x) = 2x - \\frac{8}{6}x^{3} = 2x - \\frac{4}{3}x^{3}$。",
      ),
      generate: (rng) => maclaurinPolynomialProblem(rng, 3),
    },
  ],
};

/** higherDegreeTaylorPolynomials use the general coefficient f⁽ᵏ⁾(a)/k!. */
export const higherDegreeTaylorPolynomials: TopicDef = {
  id: "higher-degree-taylor-polynomials",
  title: t("Higher-Degree Taylor Polynomials", "高次泰勒多项式"),
  summary: t(
    "Pₙ(x) = Σₖ₌₀ⁿ f⁽ᵏ⁾(a)/k! · (x − a)ᵏ; the kth coefficient and the kth derivative determine each other.",
    "Pₙ(x) = Σₖ₌₀ⁿ f⁽ᵏ⁾(a)/k! · (x − a)ᵏ；第 k 个系数与第 k 阶导数可以互相求出。",
  ),
  prerequisites: ["third-degree-taylor-polynomials"],
  encompasses: [{ topic: "third-degree-taylor-polynomials", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "coefficients-of-taylor-polynomials",
      title: t("Coefficients of Taylor polynomials", "泰勒多项式的系数"),
      explanation: t(
        "The Taylor polynomial of degree $n$ centered at $a$ is\n\n$$P_n(x) = \\sum_{k=0}^{n} \\frac{f^{(k)}(a)}{k!}(x - a)^{k}.$$\n\nTo find one coefficient, look for the pattern in the derivatives. For $f(x) = e^{2x}$, $f^{(k)}(0) = 2^{k}$, so the coefficient of $x^{5}$ is $\\frac{2^{5}}{5!} = \\frac{32}{120} = \\frac{4}{15}$.",
        "以 $a$ 为中心的 $n$ 次泰勒多项式为\n\n$$P_n(x) = \\sum_{k=0}^{n} \\frac{f^{(k)}(a)}{k!}(x - a)^{k}。$$\n\n要求某一个系数，就找出各阶导数的规律。对 $f(x) = e^{2x}$，$f^{(k)}(0) = 2^{k}$，所以 $x^{5}$ 的系数是 $\\frac{2^{5}}{5!} = \\frac{32}{120} = \\frac{4}{15}$。",
      ),
      generate(rng) {
        const f = family(rng);
        const m = rng.int(4, 6);
        const d = f.deriv(m);
        const answer = d.div(Q.of(factorial(m)));
        return numberProblem({
          prompt: t(
            `Find the coefficient of $x^{${m}}$ in the Taylor polynomial of degree ${m} for $f(x) = ${f.tex}$ centered at $x = 0$.`,
            `求 $f(x) = ${f.tex}$ 以 $x = 0$ 为中心的 ${m} 次泰勒多项式中 $x^{${m}}$ 的系数。`,
          ),
          answer,
          wrong: [d, d.div(Q.of(factorial(m - 1))), d.div(Q.of(m))],
          solution: t(
            `$${nth(m, 0)} = ${d.toLatex()}$, so the coefficient is $\\frac{${nth(m, 0)}}{${m}!} = \\frac{${d.toLatex()}}{${factorial(m)}} = ${answer.toLatex()}$.`,
            `$${nth(m, 0)} = ${d.toLatex()}$，所以系数是 $\\frac{${nth(m, 0)}}{${m}!} = \\frac{${d.toLatex()}}{${factorial(m)}} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "derivatives-from-taylor-coefficients",
      title: t("Derivatives from coefficients", "由系数求导数"),
      explanation: t(
        "Read the formula backwards: if $c_k$ is the coefficient of $(x - a)^{k}$, then $f^{(k)}(a) = k! \\, c_k$. If $P_5(x) = 1 - x + 3x^{4} + 2x^{5}$ is centered at $0$, then $f^{(4)}(0) = 4! \\cdot 3 = 72$.",
        "把公式反过来用：若 $c_k$ 是 $(x - a)^{k}$ 的系数，则 $f^{(k)}(a) = k! \\, c_k$。若以 $0$ 为中心的 $P_5(x) = 1 - x + 3x^{4} + 2x^{5}$，则 $f^{(4)}(0) = 4! \\cdot 3 = 72$。",
      ),
      generate(rng) {
        const a = rng.int(-2, 2);
        const m = rng.int(2, 5);
        const cs = Array.from({ length: 6 }, (_, i) => (i === m ? Q.of(rng.nonZero(-9, 9), rng.pick([1, 1, 2, 3])) : Q.of(rng.int(-9, 9))));
        const answer = cs[m]!.mul(Q.of(factorial(m)));
        return numberProblem({
          prompt: t(
            `The Taylor polynomial of degree 5 for $f$ centered at $x = ${a}$ is $P_5(x) = ${taylorPoly(cs, a)}$. Find $${nth(m, a)}$.`,
            `$f$ 以 $x = ${a}$ 为中心的 5 次泰勒多项式为 $P_5(x) = ${taylorPoly(cs, a)}$。求 $${nth(m, a)}$。`,
          ),
          answer,
          wrong: [cs[m]!, cs[m]!.mul(Q.of(m)), cs[m]!.div(Q.of(factorial(m)))],
          solution: t(
            `The coefficient of $${around(a, m)}$ is $\\frac{${nth(m, a)}}{${m}!} = ${cs[m]!.toLatex()}$, so $${nth(m, a)} = ${factorial(m)} \\cdot ${cs[m]!.toLatex()} = ${answer.toLatex()}$.`,
            `$${around(a, m)}$ 的系数是 $\\frac{${nth(m, a)}}{${m}!} = ${cs[m]!.toLatex()}$，所以 $${nth(m, a)} = ${factorial(m)} \\cdot ${cs[m]!.toLatex()} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** steps are distances |x − a| with simple powers. */
const steps = [Q.of(1, 2), Q.of(1, 3), Q.of(1, 5), Q.of(1, 10), Q.one, Q.of(2)] as const;

/** theLagrangeErrorBound bounds the error of a Taylor polynomial. */
export const theLagrangeErrorBound: TopicDef = {
  id: "the-lagrange-error-bound",
  title: t("The Lagrange Error Bound", "拉格朗日误差界"),
  summary: t(
    "If |f⁽ⁿ⁺¹⁾| ≤ M between a and x, then |f(x) − Pₙ(x)| ≤ M|x − a|ⁿ⁺¹/(n + 1)!.",
    "若在 a 与 x 之间 |f⁽ⁿ⁺¹⁾| ≤ M，则 |f(x) − Pₙ(x)| ≤ M|x − a|ⁿ⁺¹/(n + 1)!。",
  ),
  prerequisites: ["higher-degree-taylor-polynomials"],
  encompasses: [{ topic: "higher-degree-taylor-polynomials", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "applying-the-lagrange-error-bound",
      title: t("Applying the Lagrange error bound", "应用拉格朗日误差界"),
      explanation: t(
        "The error depends on the next derivative somewhere between the center and the point, so a bound on that derivative bounds the error. The error $R_n(x) = f(x) - P_n(x)$ equals $\\frac{f^{(n+1)}(z)}{(n + 1)!}(x - a)^{n+1}$ for some $z$ between $a$ and $x$. So if $|f^{(n+1)}| \\le M$ there,\n\n$$|R_n(x)| \\le \\frac{M \\, |x - a|^{n+1}}{(n + 1)!}.$$\n\nWith $n = 3$, $M = 6$ and $|x - a| = \\frac{1}{2}$: $|R_3| \\le \\frac{6 \\cdot (1/2)^{4}}{4!} = \\frac{1}{64}$.",
        "误差取决于中心与该点之间某处的下一阶导数，所以给这个导数一个上界，就能给出误差的上界。误差 $R_n(x) = f(x) - P_n(x)$ 等于 $\\frac{f^{(n+1)}(z)}{(n + 1)!}(x - a)^{n+1}$，其中 $z$ 介于 $a$ 与 $x$ 之间。所以若在该区间上 $|f^{(n+1)}| \\le M$，则\n\n$$|R_n(x)| \\le \\frac{M \\, |x - a|^{n+1}}{(n + 1)!}。$$\n\n当 $n = 3$，$M = 6$，$|x - a| = \\frac{1}{2}$ 时：$|R_3| \\le \\frac{6 \\cdot (1/2)^{4}}{4!} = \\frac{1}{64}$。",
      ),
      generate(rng) {
        const n = rng.int(1, 4);
        const M = rng.int(1, 12);
        const a = rng.int(-3, 3);
        const h = rng.pick(steps);
        const x = Q.of(a).add(h);
        const answer = Q.of(M)
          .mul(qpow(h, n + 1))
          .div(Q.of(factorial(n + 1)));
        return numberProblem({
          prompt: t(
            `Suppose $\\left|${nth(n + 1, "x")}\\right| \\le ${M}$ for all $x$ between $${a}$ and $${x.toLatex()}$, and $P_{${n}}$ is the Taylor polynomial of degree ${n} for $f$ centered at $x = ${a}$. Use the Lagrange error bound to find an upper bound for $\\left|f\\left(${x.toLatex()}\\right) - P_{${n}}\\left(${x.toLatex()}\\right)\\right|$.`,
            `设对 $${a}$ 与 $${x.toLatex()}$ 之间的所有 $x$ 有 $\\left|${nth(n + 1, "x")}\\right| \\le ${M}$，$P_{${n}}$ 是 $f$ 以 $x = ${a}$ 为中心的 ${n} 次泰勒多项式。用拉格朗日误差界求 $\\left|f\\left(${x.toLatex()}\\right) - P_{${n}}\\left(${x.toLatex()}\\right)\\right|$ 的一个上界。`,
          ),
          answer,
          wrong: [
            Q.of(M)
              .mul(qpow(h, n))
              .div(Q.of(factorial(n))),
            Q.of(M)
              .mul(qpow(h, n + 1))
              .div(Q.of(factorial(n))),
            Q.of(M).mul(qpow(h, n + 1)),
          ],
          solution: t(
            `$|R_{${n}}| \\le \\frac{${M} \\cdot \\left(${h.toLatex()}\\right)^{${n + 1}}}{${n + 1}!} = ${answer.toLatex()}$.`,
            `$|R_{${n}}| \\le \\frac{${M} \\cdot \\left(${h.toLatex()}\\right)^{${n + 1}}}{${n + 1}!} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "lagrange-error-bound-for-sine-and-cosine",
      title: t("Error bounds for sine and cosine", "正弦与余弦的误差界"),
      explanation: t(
        "Every derivative of $\\sin(kx)$ or $\\cos(kx)$ is $\\pm k^{m}$ times a sine or cosine, so $|f^{(n+1)}(x)| \\le |k|^{n+1}$ everywhere and $M = |k|^{n+1}$ works. For $\\cos x$, $P_4$ at $x = \\frac{1}{2}$: $|R_4| \\le \\frac{(1/2)^{5}}{5!} = \\frac{1}{3840}$.",
        "$\\sin(kx)$ 或 $\\cos(kx)$ 的各阶导数都是 $\\pm k^{m}$ 乘以正弦或余弦，所以处处有 $|f^{(n+1)}(x)| \\le |k|^{n+1}$，可取 $M = |k|^{n+1}$。对 $\\cos x$，$P_4$ 在 $x = \\frac{1}{2}$ 处：$|R_4| \\le \\frac{(1/2)^{5}}{5!} = \\frac{1}{3840}$。",
      ),
      generate(rng) {
        const k = rng.int(1, 3);
        const n = rng.int(2, 5);
        const h = rng.pick(steps.slice(0, 5));
        const f = `\\${rng.bool() ? "sin" : "cos"}(${poly([k, "x"])})`;
        const M = k ** (n + 1);
        const answer = Q.of(M)
          .mul(qpow(h, n + 1))
          .div(Q.of(factorial(n + 1)));
        return numberProblem({
          prompt: t(
            `Let $P_{${n}}$ be the Taylor polynomial of degree ${n} for $f(x) = ${f}$ centered at $x = 0$. Use the Lagrange error bound to find an upper bound for $\\left|f\\left(${h.toLatex()}\\right) - P_{${n}}\\left(${h.toLatex()}\\right)\\right|$.`,
            `设 $P_{${n}}$ 是 $f(x) = ${f}$ 以 $x = 0$ 为中心的 ${n} 次泰勒多项式。用拉格朗日误差界求 $\\left|f\\left(${h.toLatex()}\\right) - P_{${n}}\\left(${h.toLatex()}\\right)\\right|$ 的一个上界。`,
          ),
          answer,
          wrong: [
            qpow(h, n + 1).div(Q.of(factorial(n + 1))),
            Q.of(M)
              .mul(qpow(h, n))
              .div(Q.of(factorial(n))),
            qpow(h, n + 1),
          ],
          solution: t(
            `$|${nth(n + 1, "x")}| \\le ${k}^{${n + 1}} = ${M}$, so $|R_{${n}}| \\le \\frac{${M} \\cdot \\left(${h.toLatex()}\\right)^{${n + 1}}}{${n + 1}!} = ${answer.toLatex()}$.`,
            `$|${nth(n + 1, "x")}| \\le ${k}^{${n + 1}} = ${M}$，所以 $|R_{${n}}| \\le \\frac{${M} \\cdot \\left(${h.toLatex()}\\right)^{${n + 1}}}{${n + 1}!} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** sigma0 writes the sum of a body from n = k to ∞. */
const sigma = (body: string, k = 0) => `\\sum_{n=${k}}^{\\infty} ${body}`;

/** radiusCase picks a power series centered at 0 with a finite radius. */
function radiusCase(rng: Rng): { series: string; R: Q; work: Text } {
  const k = rng.int(2, 9);
  const kind = rng.int(0, 2);
  if (kind === 0) {
    const p = rng.int(0, 3);
    const np = p === 0 ? "" : p === 1 ? "n " : `n^{${p}} `;
    return {
      series: sigma(`\\frac{${np}x^{n}}{${k}^{n}}`, 1),
      R: Q.of(k),
      work: t(
        `$\\left|\\frac{a_{n+1}}{a_n}\\right| = ${p === 0 ? "" : `\\left(\\frac{n + 1}{n}\\right)^{${p}} `}\\frac{|x|}{${k}} \\to \\frac{|x|}{${k}}$, which is less than $1$ when $|x| < ${k}$`,
        `$\\left|\\frac{a_{n+1}}{a_n}\\right| = ${p === 0 ? "" : `\\left(\\frac{n + 1}{n}\\right)^{${p}} `}\\frac{|x|}{${k}} \\to \\frac{|x|}{${k}}$，当 $|x| < ${k}$ 时小于 $1$`,
      ),
    };
  }
  if (kind === 1) {
    const p = rng.int(1, 3);
    const np = p === 1 ? "n" : `n^{${p}}`;
    return {
      series: sigma(`\\frac{${k}^{n} x^{n}}{${np}}`, 1),
      R: Q.of(1, k),
      work: t(
        `$\\left|\\frac{a_{n+1}}{a_n}\\right| = \\left(\\frac{n}{n + 1}\\right)^{${p}} ${k}|x| \\to ${k}|x|$, which is less than $1$ when $|x| < \\frac{1}{${k}}$`,
        `$\\left|\\frac{a_{n+1}}{a_n}\\right| = \\left(\\frac{n}{n + 1}\\right)^{${p}} ${k}|x| \\to ${k}|x|$，当 $|x| < \\frac{1}{${k}}$ 时小于 $1$`,
      ),
    };
  }
  const m = rng.int(2, 9);
  if (m === k) return radiusCase(rng);
  const R = Q.of(k, m);
  return {
    series: sigma(`\\frac{${m}^{n} x^{n}}{${k}^{n}}`),
    R,
    work: t(
      `$\\left|\\frac{a_{n+1}}{a_n}\\right| = \\frac{${m}|x|}{${k}}$, which is less than $1$ when $|x| < ${R.toLatex()}$`,
      `$\\left|\\frac{a_{n+1}}{a_n}\\right| = \\frac{${m}|x|}{${k}}$，当 $|x| < ${R.toLatex()}$ 时小于 $1$`,
    ),
  };
}

/** extents are the three ways a power series can converge. */
const extents = [
  t("It converges only at x = 0 (R = 0).", "只在 x = 0 处收敛（R = 0）。"),
  t("It converges for every x (R = ∞).", "对所有 x 都收敛（R = ∞）。"),
  t("It converges for |x| < R for some finite R > 0.", "存在有限的 R > 0，使它在 |x| < R 时收敛。"),
] as const;

/** radiusOfConvergenceOfPowerSeriesCenteredAtTheOrigin applies the ratio test to Σ cₙxⁿ. */
export const radiusOfConvergenceOfPowerSeriesCenteredAtTheOrigin: TopicDef = {
  id: "radius-of-convergence-of-power-series-centered-at-the-origin",
  title: t("Radius of Convergence of Power Series Centered at the Origin", "以原点为中心的幂级数的收敛半径"),
  summary: t(
    "A power series Σ cₙxⁿ converges for |x| < R and diverges for |x| > R; the ratio test finds R, which may be 0 or ∞.",
    "幂级数 Σ cₙxⁿ 在 |x| < R 时收敛，在 |x| > R 时发散；用比值判别法求 R，R 也可能是 0 或 ∞。",
  ),
  prerequisites: ["the-ratio-test", "higher-degree-taylor-polynomials"],
  encompasses: [{ topic: "the-ratio-test", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "finding-the-radius-of-convergence",
      title: t("Finding the radius of convergence", "求收敛半径"),
      explanation: t(
        "A **power series** $\\sum c_n x^{n}$ is a series whose terms depend on $x$. Apply the ratio test with $x$ held fixed: if $\\left|\\frac{a_{n+1}}{a_n}\\right| \\to L|x|$, the series converges when $L|x| < 1$, so the **radius of convergence** is $R = \\frac{1}{L}$. For $\\sum \\frac{n x^{n}}{4^{n}}$: $\\frac{n + 1}{n} \\cdot \\frac{|x|}{4} \\to \\frac{|x|}{4}$, so $R = 4$.",
        "**幂级数** $\\sum c_n x^{n}$ 是各项依赖于 $x$ 的级数。固定 $x$ 用比值判别法：若 $\\left|\\frac{a_{n+1}}{a_n}\\right| \\to L|x|$，则 $L|x| < 1$ 时级数收敛，所以**收敛半径**为 $R = \\frac{1}{L}$。对 $\\sum \\frac{n x^{n}}{4^{n}}$：$\\frac{n + 1}{n} \\cdot \\frac{|x|}{4} \\to \\frac{|x|}{4}$，所以 $R = 4$。",
      ),
      generate(rng) {
        const c = radiusCase(rng);
        return numberProblem({
          prompt: t(`Find the radius of convergence of $${c.series}$.`, `求 $${c.series}$ 的收敛半径。`),
          answer: c.R,
          wrong: [Q.one.div(c.R), Q.one, c.R.mul(Q.of(2))],
          solution: t(`${c.work.en}. So $R = ${c.R.toLatex()}$.`, `${c.work["zh-CN"]}。所以 $R = ${c.R.toLatex()}$。`),
        });
      },
    },
    {
      id: "zero-finite-or-infinite-radius",
      title: t("Zero, finite or infinite radius", "收敛半径为零、有限或无穷"),
      explanation: t(
        "If the ratio limit is $0$ for every $x$, as for $\\sum \\frac{x^{n}}{n!}$ where $\\frac{|x|}{n + 1} \\to 0$, the series converges for every $x$ and $R = \\infty$. If it is $\\infty$ for every $x \\neq 0$, as for $\\sum n! \\, x^{n}$ where $(n + 1)|x| \\to \\infty$, the series converges only at $0$ and $R = 0$.",
        "若对每个 $x$ 比值的极限都是 $0$，例如 $\\sum \\frac{x^{n}}{n!}$ 中 $\\frac{|x|}{n + 1} \\to 0$，级数对所有 $x$ 收敛，$R = \\infty$。若对每个 $x \\neq 0$ 极限都是 $\\infty$，例如 $\\sum n! \\, x^{n}$ 中 $(n + 1)|x| \\to \\infty$，级数只在 $0$ 处收敛，$R = 0$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const k = rng.int(1, 9);
        if (kind === 2) {
          const c = radiusCase(rng);
          return oneOf(
            rng,
            t(`How does $${c.series}$ converge?`, `$${c.series}$ 的收敛情况如何？`),
            extents[2],
            [extents[0], extents[1]],
            t(`${c.work.en}, so $R = ${c.R.toLatex()}$.`, `${c.work["zh-CN"]}，所以 $R = ${c.R.toLatex()}$。`),
          );
        }
        const kn = k === 1 ? "" : `${k}^{n} `;
        const series = kind === 0 ? sigma(`\\frac{${kn}x^{n}}{n!}`) : sigma(k === 1 ? "n! \\, x^{n}" : `\\frac{n! \\, x^{n}}{${k}^{n}}`);
        const kx = k === 1 ? "|x|" : `${k}|x|`;
        return oneOf(
          rng,
          t(`How does $${series}$ converge?`, `$${series}$ 的收敛情况如何？`),
          extents[kind === 0 ? 1 : 0],
          [extents[kind === 0 ? 0 : 1], extents[2]],
          kind === 0
            ? t(
                `$\\left|\\frac{a_{n+1}}{a_n}\\right| = \\frac{${kx}}{n + 1} \\to 0 < 1$ for every $x$, so $R = \\infty$.`,
                `$\\left|\\frac{a_{n+1}}{a_n}\\right| = \\frac{${kx}}{n + 1} \\to 0 < 1$ 对每个 $x$ 成立，所以 $R = \\infty$。`,
              )
            : t(
                `$\\left|\\frac{a_{n+1}}{a_n}\\right| = ${k === 1 ? "(n + 1)|x|" : `\\frac{(n + 1)|x|}{${k}}`} \\to \\infty$ for every $x \\neq 0$, so $R = 0$.`,
                `对每个 $x \\neq 0$，$\\left|\\frac{a_{n+1}}{a_n}\\right| = ${k === 1 ? "(n + 1)|x|" : `\\frac{(n + 1)|x|}{${k}}`} \\to \\infty$，所以 $R = 0$。`,
              ),
        );
      },
    },
  ],
};

/** radiusOfConvergenceOfPowerSeries handles a center other than 0 and the endpoints. */
export const radiusOfConvergenceOfPowerSeries: TopicDef = {
  id: "radius-of-convergence-of-power-series",
  title: t("Radius of Convergence of Power Series", "幂级数的收敛半径"),
  summary: t(
    "Σ cₙ(x − a)ⁿ converges on an interval centered at a with radius R; each endpoint must be checked separately.",
    "Σ cₙ(x − a)ⁿ 在以 a 为中心、半径为 R 的区间上收敛；两个端点需要分别检验。",
  ),
  prerequisites: ["radius-of-convergence-of-power-series-centered-at-the-origin", "absolute-and-conditional-convergence"],
  encompasses: [{ topic: "radius-of-convergence-of-power-series-centered-at-the-origin", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "radius-of-a-shifted-power-series",
      title: t("Radius of a shifted power series", "平移后的幂级数的收敛半径"),
      explanation: t(
        "For $\\sum \\frac{(bx - d)^{n}}{k^{n}}$, the ratio test gives convergence when $|bx - d| < k$, that is $\\left|x - \\frac{d}{b}\\right| < \\frac{k}{b}$. The center is $\\frac{d}{b}$ and the radius is $\\frac{k}{b}$. For $\\sum \\frac{(2x - 3)^{n}}{5^{n}}$: $R = \\frac{5}{2}$.",
        "对 $\\sum \\frac{(bx - d)^{n}}{k^{n}}$，比值判别法给出 $|bx - d| < k$ 时收敛，即 $\\left|x - \\frac{d}{b}\\right| < \\frac{k}{b}$。中心是 $\\frac{d}{b}$，半径是 $\\frac{k}{b}$。对 $\\sum \\frac{(2x - 3)^{n}}{5^{n}}$：$R = \\frac{5}{2}$。",
      ),
      generate(rng) {
        const b = rng.int(1, 5);
        const d = rng.nonZero(-9, 9);
        const k = rng.int(2, 9);
        const p = rng.int(0, 2);
        const np = p === 0 ? "" : p === 1 ? "n \\cdot " : `n^{2} \\cdot `;
        const series = sigma(`\\frac{(${linear(b, -d)})^{n}}{${np}${k}^{n}}`, 1);
        const R = Q.of(k, b);
        return numberProblem({
          prompt: t(`Find the radius of convergence of $${series}$.`, `求 $${series}$ 的收敛半径。`),
          answer: R,
          wrong: [Q.of(k), Q.of(b, k), Q.of(d, b)],
          solution: t(
            `The ratio of consecutive terms tends to $\\frac{|${linear(b, -d)}|}{${k}}$, so the series converges when $|${linear(b, -d)}| < ${k}$, that is $\\left|x - ${Q.of(d, b).sign() < 0 ? `\\left(${Q.of(d, b).toLatex()}\\right)` : Q.of(d, b).toLatex()}\\right| < ${R.toLatex()}$. So $R = ${R.toLatex()}$.`,
            `相邻两项之比趋于 $\\frac{|${linear(b, -d)}|}{${k}}$，所以 $|${linear(b, -d)}| < ${k}$ 即 $\\left|x - ${Q.of(d, b).sign() < 0 ? `\\left(${Q.of(d, b).toLatex()}\\right)` : Q.of(d, b).toLatex()}\\right| < ${R.toLatex()}$ 时收敛。所以 $R = ${R.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "interval-of-convergence",
      title: t("The interval of convergence", "收敛区间"),
      explanation: t(
        "The ratio test says nothing at $x = a \\pm R$, so substitute each endpoint and test the resulting series. For $\\sum_{n=1}^{\\infty} \\frac{(x - 2)^{n}}{n \\cdot 3^{n}}$, $R = 3$. At $x = 5$ the series is $\\sum \\frac{1}{n}$, which diverges; at $x = -1$ it is $\\sum \\frac{(-1)^{n}}{n}$, which converges. The **interval of convergence** is $[-1, 5)$.",
        "在 $x = a \\pm R$ 处比值判别法无法判断，所以要把每个端点代入，检验所得级数。对 $\\sum_{n=1}^{\\infty} \\frac{(x - 2)^{n}}{n \\cdot 3^{n}}$，$R = 3$。在 $x = 5$ 处级数为 $\\sum \\frac{1}{n}$，发散；在 $x = -1$ 处为 $\\sum \\frac{(-1)^{n}}{n}$，收敛。**收敛区间**为 $[-1, 5)$。",
      ),
      generate(rng) {
        const c = rng.int(-5, 5);
        const k = rng.int(1, 5);
        const kind = rng.int(0, 3);
        const p = kind === 0 ? 0 : kind === 3 ? 2 : 1;
        const alternating = kind === 2;
        const denom = [p === 1 ? "n" : p === 2 ? "n^{2}" : "", k === 1 ? "" : `${k}^{n}`].filter(Boolean).join(" \\cdot ");
        const top = `${alternating ? "(-1)^{n} " : ""}${around(c, 1)}^{n}`;
        const series = sigma(denom === "" ? top : `\\frac{${top}}{${denom}}`, 1);
        const lo = Q.of(c - k);
        const hi = Q.of(c + k);
        const loClosed = p === 2 || (p === 1 && !alternating);
        const hiClosed = p === 2 || alternating;
        const set = (l: boolean, h: boolean): Interval[] => [{ lo, hi, loClosed: l, hiClosed: h }];
        const at = (s: number): Text => {
          const sign = alternating ? (s < 0 ? "" : "(-1)^{n}") : s < 0 ? "(-1)^{n}" : "";
          const sum =
            p === 0
              ? sign === ""
                ? "\\sum 1"
                : "\\sum (-1)^{n}"
              : `\\sum \\frac{${sign === "" ? "1" : sign}}{${p === 1 ? "n" : "n^{2}"}}`;
          if (p === 0) return t(`${sum}$, whose terms do not tend to $0$: diverges`, `${sum}$，其各项不趋于 $0$：发散`);
          if (p === 2) return t(`${sum}$, which converges absolutely ($p = 2$)`, `${sum}$，绝对收敛（$p = 2$）`);
          return sign === ""
            ? t(`${sum}$, the harmonic series: diverges`, `${sum}$，即调和级数：发散`)
            : t(`${sum}$, which converges by the alternating series test`, `${sum}$，由交错级数判别法收敛`);
        };
        const lowEnd = at(-1);
        const highEnd = at(1);
        const answer = set(loClosed, hiClosed);
        return intervalProblem({
          prompt: t(`Find the interval of convergence of $${series}$.`, `求 $${series}$ 的收敛区间。`),
          set: answer,
          form: "interval",
          wrong: [set(false, false), set(true, true), set(!loClosed, !hiClosed), set(true, false)],
          solution: t(
            `The ratio test gives $\\frac{|${linear(1, -c)}|}{${k}} < 1$, so $R = ${k}$ and the series converges on $(${c - k}, ${c + k})$. At $x = ${c - k}$ the series is $${lowEnd.en}. At $x = ${c + k}$ it is $${highEnd.en}. So the interval of convergence is $${loClosed ? "[" : "("}${c - k}, ${c + k}${hiClosed ? "]" : ")"}$.`,
            `由比值判别法 $\\frac{|${linear(1, -c)}|}{${k}} < 1$，所以 $R = ${k}$，级数在 $(${c - k}, ${c + k})$ 上收敛。在 $x = ${c - k}$ 处级数为 $${lowEnd["zh-CN"]}。在 $x = ${c + k}$ 处为 $${highEnd["zh-CN"]}。所以收敛区间为 $${loClosed ? "[" : "("}${c - k}, ${c + k}${hiClosed ? "]" : ")"}$。`,
          ),
        });
      },
    },
  ],
};

/** maclaurinSeries are Taylor series centered at 0. */
export const maclaurinSeries: TopicDef = {
  id: "maclaurin-series",
  title: t("Maclaurin Series", "麦克劳林级数"),
  summary: t(
    "The Maclaurin series of f is Σ f⁽ⁿ⁾(0)/n! · xⁿ, the Taylor polynomials continued forever.",
    "f 的麦克劳林级数是 Σ f⁽ⁿ⁾(0)/n! · xⁿ，即无限延续下去的泰勒多项式。",
  ),
  prerequisites: ["radius-of-convergence-of-power-series-centered-at-the-origin"],
  encompasses: [{ topic: "higher-degree-taylor-polynomials", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "maclaurin-coefficients-from-derivatives",
      title: t("Coefficients from a derivative formula", "由导数公式求系数"),
      explanation: t(
        "The **Maclaurin series** of $f$ is\n\n$$\\sum_{n=0}^{\\infty} \\frac{f^{(n)}(0)}{n!} x^{n} = f(0) + f'(0)x + \\frac{f''(0)}{2!}x^{2} + \\cdots.$$\n\nWhen a formula gives $f^{(n)}(0)$, divide by $n!$. If $f^{(n)}(0) = \\frac{(n + 1)!}{2^{n}}$, the coefficient of $x^{n}$ is $\\frac{n + 1}{2^{n}}$; for $x^{3}$ it is $\\frac{4}{8} = \\frac{1}{2}$.",
        "$f$ 的**麦克劳林级数**为\n\n$$\\sum_{n=0}^{\\infty} \\frac{f^{(n)}(0)}{n!} x^{n} = f(0) + f'(0)x + \\frac{f''(0)}{2!}x^{2} + \\cdots。$$\n\n若给出 $f^{(n)}(0)$ 的公式，就除以 $n!$。若 $f^{(n)}(0) = \\frac{(n + 1)!}{2^{n}}$，则 $x^{n}$ 的系数为 $\\frac{n + 1}{2^{n}}$；$x^{3}$ 的系数是 $\\frac{4}{8} = \\frac{1}{2}$。",
      ),
      generate(rng) {
        const k = rng.int(2, 5);
        const m = rng.int(2, 5);
        const kind = rng.int(0, 2);
        const formula = kind === 0 ? `\\frac{(n + 1)!}{${k}^{n}}` : kind === 1 ? `(-1)^{n} \\, n! \\, ${k}^{n}` : `\\frac{${k}^{n}}{n + 1}`;
        const value =
          kind === 0
            ? Q.of(factorial(m + 1), k ** m)
            : kind === 1
              ? Q.of((m % 2 === 0 ? 1 : -1) * factorial(m) * k ** m)
              : Q.of(k ** m, m + 1);
        const answer = value.div(Q.of(factorial(m)));
        return numberProblem({
          prompt: t(
            `The function $f$ has derivatives of all orders with $f^{(n)}(0) = ${formula}$. Find the coefficient of $x^{${m}}$ in its Maclaurin series.`,
            `函数 $f$ 有任意阶导数，且 $f^{(n)}(0) = ${formula}$。求它的麦克劳林级数中 $x^{${m}}$ 的系数。`,
          ),
          answer,
          wrong: [value, value.div(Q.of(m)), answer.neg()],
          solution: t(
            `$f^{(${m})}(0) = ${value.toLatex()}$, and the coefficient is $\\frac{f^{(${m})}(0)}{${m}!} = \\frac{${value.toLatex()}}{${factorial(m)}} = ${answer.toLatex()}$.`,
            `$f^{(${m})}(0) = ${value.toLatex()}$，系数为 $\\frac{f^{(${m})}(0)}{${m}!} = \\frac{${value.toLatex()}}{${factorial(m)}} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "first-nonzero-terms-of-maclaurin-series",
      title: t("The first nonzero terms", "前几个非零项"),
      explanation: t(
        "Some coefficients are $0$, so list derivatives until enough nonzero terms appear. For $\\cos(2x)$: the derivatives at $0$ are $1, 0, -4, 0, 16$, so the first three nonzero terms are $1 - 2x^{2} + \\frac{2}{3}x^{4}$.",
        "有些系数为 $0$，所以要一直求导，直到出现足够多的非零项。对 $\\cos(2x)$：在 $0$ 处的各阶导数为 $1, 0, -4, 0, 16$，所以前三个非零项为 $1 - 2x^{2} + \\frac{2}{3}x^{4}$。",
      ),
      generate(rng) {
        const f = family(rng);
        const cs = coefficients(f, 7);
        const nonzero = cs.flatMap((c, i) => (c.isZero() ? [] : [[c, around(0, i)] as const])).slice(0, 3);
        const answer = poly(...nonzero);
        return functionProblem({
          prompt: t(
            `Find the first three nonzero terms of the Maclaurin series for $f(x) = ${f.tex}$, and give their sum.`,
            `求 $f(x) = ${f.tex}$ 的麦克劳林级数的前三个非零项，写出它们的和。`,
          ),
          answer,
          wrong: [poly(...nonzero.map(([c, v]) => [c.neg(), v] as const)), poly(...nonzero.slice(0, 2)), taylorPoly(cs.slice(0, 3))],
          solution: t(
            `$${derivativeValues(
              f,
              Math.min(
                7,
                cs.findIndex((_, i) => cs.slice(0, i + 1).filter((c) => !c.isZero()).length === 3),
              ),
            )}$. Dividing by the factorials and keeping the nonzero terms gives $${answer}$.`,
            `$${derivativeValues(
              f,
              Math.min(
                7,
                cs.findIndex((_, i) => cs.slice(0, i + 1).filter((c) => !c.isZero()).length === 3),
              ),
            )}$。除以阶乘并保留非零项，得 $${answer}$。`,
          ),
        });
      },
    },
  ],
};

/** taylorSeries are power series of f centered at any a. */
export const taylorSeries: TopicDef = {
  id: "taylor-series",
  title: t("Taylor Series", "泰勒级数"),
  summary: t("The Taylor series of f centered at a is Σ f⁽ⁿ⁾(a)/n! · (x − a)ⁿ.", "f 以 a 为中心的泰勒级数为 Σ f⁽ⁿ⁾(a)/n! · (x − a)ⁿ。"),
  prerequisites: ["maclaurin-series", "radius-of-convergence-of-power-series"],
  encompasses: [{ topic: "maclaurin-series", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "taylor-series-coefficients",
      title: t("Coefficients of a Taylor series", "泰勒级数的系数"),
      explanation: t(
        "The coefficient of $(x - a)^{n}$ is $\\frac{f^{(n)}(a)}{n!}$. For $f(x) = \\frac{1}{x}$, $f^{(n)}(x) = \\frac{(-1)^{n} n!}{x^{n+1}}$, so centered at $a$ the coefficient is $\\frac{(-1)^{n}}{a^{n+1}}$. For $f(x) = \\ln x$, $f^{(n)}(x) = \\frac{(-1)^{n+1}(n - 1)!}{x^{n}}$ for $n \\ge 1$, so the coefficient is $\\frac{(-1)^{n+1}}{n \\, a^{n}}$.",
        "$(x - a)^{n}$ 的系数为 $\\frac{f^{(n)}(a)}{n!}$。对 $f(x) = \\frac{1}{x}$，$f^{(n)}(x) = \\frac{(-1)^{n} n!}{x^{n+1}}$，所以以 $a$ 为中心时系数为 $\\frac{(-1)^{n}}{a^{n+1}}$。对 $f(x) = \\ln x$，当 $n \\ge 1$ 时 $f^{(n)}(x) = \\frac{(-1)^{n+1}(n - 1)!}{x^{n}}$，所以系数为 $\\frac{(-1)^{n+1}}{n \\, a^{n}}$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const m = rng.int(2, 4);
        if (kind === 2) {
          const p = rng.int(3, 6);
          const a = rng.nonZero(-3, 3);
          const j = rng.int(1, p - 1);
          const binom = factorial(p) / (factorial(j) * factorial(p - j));
          const answer = Q.of(binom * a ** (p - j));
          const d = Q.of((factorial(p) / factorial(p - j)) * a ** (p - j));
          return numberProblem({
            prompt: t(
              `Find the coefficient of $${around(a, j)}$ in the Taylor series for $f(x) = x^{${p}}$ centered at $x = ${a}$.`,
              `求 $f(x) = x^{${p}}$ 以 $x = ${a}$ 为中心的泰勒级数中 $${around(a, j)}$ 的系数。`,
            ),
            answer,
            wrong: [d, Q.of(binom), Q.of(binom * (-a) ** (p - j))],
            solution: t(
              `$${nth(j, "x")} = \\frac{${p}!}{${p - j}!} x^{${p - j}}$, so $${nth(j, a)} = ${d.toLatex()}$ and the coefficient is $\\frac{${d.toLatex()}}{${j}!} = ${answer.toLatex()}$.`,
              `$${nth(j, "x")} = \\frac{${p}!}{${p - j}!} x^{${p - j}}$，所以 $${nth(j, a)} = ${d.toLatex()}$，系数为 $\\frac{${d.toLatex()}}{${j}!} = ${answer.toLatex()}$。`,
            ),
          });
        }
        const a = kind === 0 ? rng.nonZero(-5, 5) : rng.int(2, 5);
        const answer =
          kind === 0 ? Q.one.div(qpow(Q.of(a), m + 1)).mul(Q.of(m % 2 === 0 ? 1 : -1)) : Q.of(m % 2 === 1 ? 1 : -1, m * a ** m);
        const f = kind === 0 ? "\\frac{1}{x}" : "\\ln x";
        return numberProblem({
          prompt: t(
            `Find the coefficient of $${around(a, m)}$ in the Taylor series for $f(x) = ${f}$ centered at $x = ${a}$.`,
            `求 $f(x) = ${f}$ 以 $x = ${a}$ 为中心的泰勒级数中 $${around(a, m)}$ 的系数。`,
          ),
          answer,
          wrong:
            kind === 0
              ? [answer.neg(), answer.mul(Q.of(factorial(m))), Q.one.div(qpow(Q.of(a), m))]
              : [answer.neg(), answer.mul(Q.of(m)), answer.mul(Q.of(factorial(m)))],
          solution:
            kind === 0
              ? t(
                  `$${nth(m, "x")} = \\frac{${m % 2 === 0 ? "" : "-"}${m}!}{x^{${m + 1}}}$, so the coefficient is $\\frac{${nth(m, a)}}{${m}!} = \\frac{${m % 2 === 0 ? "" : "-"}1}{${powTex(a, `${m + 1}`)}} = ${answer.toLatex()}$.`,
                  `$${nth(m, "x")} = \\frac{${m % 2 === 0 ? "" : "-"}${m}!}{x^{${m + 1}}}$，所以系数为 $\\frac{${nth(m, a)}}{${m}!} = \\frac{${m % 2 === 0 ? "" : "-"}1}{${powTex(a, `${m + 1}`)}} = ${answer.toLatex()}$。`,
                )
              : t(
                  `$${nth(m, "x")} = \\frac{${m % 2 === 1 ? "" : "-"}${m - 1}!}{x^{${m}}}$, so the coefficient is $\\frac{${nth(m, a)}}{${m}!} = \\frac{${m % 2 === 1 ? "" : "-"}1}{${m} \\cdot ${a}^{${m}}} = ${answer.toLatex()}$.`,
                  `$${nth(m, "x")} = \\frac{${m % 2 === 1 ? "" : "-"}${m - 1}!}{x^{${m}}}$，所以系数为 $\\frac{${nth(m, a)}}{${m}!} = \\frac{${m % 2 === 1 ? "" : "-"}1}{${m} \\cdot ${a}^{${m}}} = ${answer.toLatex()}$。`,
                ),
        });
      },
    },
    {
      id: "first-terms-of-taylor-series",
      title: t("The first terms of a Taylor series", "泰勒级数的前几项"),
      explanation: t(
        "The first terms of a Taylor series are the Taylor polynomial of low degree, built from the derivatives at the center divided by factorials. Evaluate $f$, $f'$ and $f''$ at the center. For $\\sqrt{x}$ at $a = 4$: $f(4) = 2$, $f'(4) = \\frac{1}{4}$, $f''(4) = -\\frac{1}{32}$, so the series begins $2 + \\frac{1}{4}(x - 4) - \\frac{1}{64}(x - 4)^{2} + \\cdots$.",
        "泰勒级数的前几项就是低次的泰勒多项式，由中心处的导数除以阶乘构成。在中心处求 $f$、$f'$、$f''$ 的值。对 $\\sqrt{x}$，$a = 4$：$f(4) = 2$，$f'(4) = \\frac{1}{4}$，$f''(4) = -\\frac{1}{32}$，所以级数以 $2 + \\frac{1}{4}(x - 4) - \\frac{1}{64}(x - 4)^{2} + \\cdots$ 开头。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        let f: string;
        let a: number;
        let d: [Q, Q, Q];
        if (kind === 0) {
          const s = rng.int(1, 6);
          a = s * s;
          f = "\\sqrt{x}";
          d = [Q.of(s), Q.of(1, 2 * s), Q.of(-1, 4 * s ** 3)];
        } else if (kind === 1) {
          a = rng.nonZero(-6, 6);
          f = "\\frac{1}{x}";
          d = [Q.of(1, a), Q.of(-1, a * a), Q.of(2, a ** 3)];
        } else {
          a = rng.nonZero(-6, 6);
          f = "\\frac{1}{x^{2}}";
          d = [Q.of(1, a * a), Q.of(-2, a ** 3), Q.of(6, a ** 4)];
        }
        const cs = [d[0], d[1], d[2].div(Q.of(2))];
        const answer = taylorPoly(cs, a);
        return functionProblem({
          prompt: t(
            `Find the first three terms of the Taylor series for $f(x) = ${f}$ centered at $x = ${a}$, and give their sum.`,
            `求 $f(x) = ${f}$ 以 $x = ${a}$ 为中心的泰勒级数的前三项，写出它们的和。`,
          ),
          answer,
          wrong: [taylorPoly(d, a), taylorPoly(cs, -a), taylorPoly([d[0], d[1].neg(), cs[2]!], a)],
          solution: t(
            `$f(${a}) = ${d[0].toLatex()}$, $f'(${a}) = ${d[1].toLatex()}$, $f''(${a}) = ${d[2].toLatex()}$. So the series begins $${answer} + \\cdots$.`,
            `$f(${a}) = ${d[0].toLatex()}$，$f'(${a}) = ${d[1].toLatex()}$，$f''(${a}) = ${d[2].toLatex()}$。所以级数以 $${answer} + \\cdots$ 开头。`,
          ),
        });
      },
    },
  ],
};

/** representingFunctionsAsPowerSeries rewrites functions as geometric series. */
export const representingFunctionsAsPowerSeries: TopicDef = {
  id: "representing-functions-as-power-series",
  title: t("Representing Functions as Power Series", "把函数表示为幂级数"),
  summary: t(
    "Rewrite c/(b − dxᵖ) as (c/b) · 1/(1 − r) with r = dxᵖ/b to get a geometric power series valid for |r| < 1.",
    "把 c/(b − dxᵖ) 写成 (c/b) · 1/(1 − r)，r = dxᵖ/b，得到在 |r| < 1 时成立的等比幂级数。",
  ),
  prerequisites: ["maclaurin-series", "radius-of-convergence-of-power-series"],
  encompasses: [{ topic: "sums-of-infinite-geometric-series-given-in-sigma-notation", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "geometric-power-series-coefficients",
      title: t("Coefficients of a geometric power series", "等比幂级数的系数"),
      explanation: t(
        "Since $\\frac{1}{1 - r} = \\sum_{n=0}^{\\infty} r^{n}$ for $|r| < 1$, factor the constant term out of the denominator. For $\\frac{3}{2 - x^{2}} = \\frac{3}{2} \\cdot \\frac{1}{1 - x^{2}/2} = \\sum_{n=0}^{\\infty} \\frac{3}{2} \\left(\\frac{x^{2}}{2}\\right)^{n}$, the coefficient of $x^{4}$ is $\\frac{3}{2} \\cdot \\frac{1}{4} = \\frac{3}{8}$.",
        "由于 $|r| < 1$ 时 $\\frac{1}{1 - r} = \\sum_{n=0}^{\\infty} r^{n}$，先把分母的常数项提出来。对 $\\frac{3}{2 - x^{2}} = \\frac{3}{2} \\cdot \\frac{1}{1 - x^{2}/2} = \\sum_{n=0}^{\\infty} \\frac{3}{2} \\left(\\frac{x^{2}}{2}\\right)^{n}$，$x^{4}$ 的系数是 $\\frac{3}{2} \\cdot \\frac{1}{4} = \\frac{3}{8}$。",
      ),
      generate(rng) {
        const c = rng.int(1, 9);
        const b = rng.int(1, 5);
        const d = rng.nonZero(-3, 3);
        const p = rng.int(1, 2);
        const j = rng.int(2, 4);
        const xp = p === 1 ? "x" : "x^{2}";
        const r = Q.of(d, b);
        const answer = Q.of(c, b).mul(qpow(r, j));
        const lead = Q.of(c, b).eq(Q.one) ? "" : Q.of(c, b).toLatex();
        const f = `\\frac{${c}}{${poly([b, ""], [-d, xp])}}`;
        return numberProblem({
          prompt: t(
            `Find the coefficient of $x^{${p * j}}$ in the Maclaurin series for $f(x) = ${f}$.`,
            `求 $f(x) = ${f}$ 的麦克劳林级数中 $x^{${p * j}}$ 的系数。`,
          ),
          answer,
          wrong: [Q.of(c).mul(qpow(Q.of(d), j)), Q.of(c, b).mul(qpow(r.neg(), j)), Q.of(c, b).mul(qpow(r, j + 1))],
          solution: t(
            `$f(x) = ${lead} \\cdot \\frac{1}{${poly([1, ""], [r.neg(), xp])}} = \\sum_{n=0}^{\\infty} ${lead}\\left(${poly([r, xp])}\\right)^{n}$. The term with $x^{${p * j}}$ has $n = ${j}$, with coefficient $${lead}\\left(${r.toLatex()}\\right)^{${j}} = ${answer.toLatex()}$.`,
            `$f(x) = ${lead} \\cdot \\frac{1}{${poly([1, ""], [r.neg(), xp])}} = \\sum_{n=0}^{\\infty} ${lead}\\left(${poly([r, xp])}\\right)^{n}$。含 $x^{${p * j}}$ 的项对应 $n = ${j}$，系数为 $${lead}\\left(${r.toLatex()}\\right)^{${j}} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "radius-of-a-geometric-power-series",
      title: t("Radius of a geometric power series", "等比幂级数的收敛半径"),
      explanation: t(
        "The geometric series converges exactly when the ratio has absolute value less than $1$. For $\\frac{1}{5 - 2x} = \\frac{1}{5} \\sum \\left(\\frac{2x}{5}\\right)^{n}$, we need $\\left|\\frac{2x}{5}\\right| < 1$, so $R = \\frac{5}{2}$.",
        "等比级数收敛当且仅当公比的绝对值小于 $1$。对 $\\frac{1}{5 - 2x} = \\frac{1}{5} \\sum \\left(\\frac{2x}{5}\\right)^{n}$，需要 $\\left|\\frac{2x}{5}\\right| < 1$，所以 $R = \\frac{5}{2}$。",
      ),
      generate(rng) {
        const c = rng.int(1, 9);
        const b = rng.int(1, 9);
        const d = rng.nonZero(-6, 6);
        const R = Q.of(b, Math.abs(d));
        const lead = Q.of(c, b).eq(Q.one) ? "" : `${Q.of(c, b).toLatex()} `;
        const f = `\\frac{${c}}{${poly([b, ""], [-d, "x"])}}`;
        return numberProblem({
          prompt: t(
            `Find the radius of convergence of the Maclaurin series for $f(x) = ${f}$.`,
            `求 $f(x) = ${f}$ 的麦克劳林级数的收敛半径。`,
          ),
          answer: R,
          wrong: [Q.one.div(R), Q.of(b), Q.of(c, b)],
          solution: t(
            `$f(x) = ${lead}\\sum_{n=0}^{\\infty} \\left(${poly([Q.of(d, b), "x"])}\\right)^{n}$, which converges when $\\left|${poly([Q.of(d, b), "x"])}\\right| < 1$, that is $|x| < ${R.toLatex()}$. So $R = ${R.toLatex()}$.`,
            `$f(x) = ${lead}\\sum_{n=0}^{\\infty} \\left(${poly([Q.of(d, b), "x"])}\\right)^{n}$，当 $\\left|${poly([Q.of(d, b), "x"])}\\right| < 1$ 即 $|x| < ${R.toLatex()}$ 时收敛。所以 $R = ${R.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** recognizingStandardMaclaurinSeries identifies eˣ, 1/(1 − x) and ln(1 + x) from their series. */
export const recognizingStandardMaclaurinSeries: TopicDef = {
  id: "recognizing-standard-maclaurin-series",
  title: t("Recognizing Standard Maclaurin Series", "识别标准麦克劳林级数"),
  summary: t(
    "eˣ = Σ xⁿ/n!, 1/(1 − x) = Σ xⁿ and ln(1 + x) = Σ (−1)ⁿ⁺¹xⁿ/n; substitutions extend them.",
    "eˣ = Σ xⁿ/n!，1/(1 − x) = Σ xⁿ，ln(1 + x) = Σ (−1)ⁿ⁺¹xⁿ/n；代换可以推广它们。",
  ),
  prerequisites: ["representing-functions-as-power-series"],
  encompasses: [{ topic: "representing-functions-as-power-series", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "naming-a-standard-series",
      title: t("Naming the function", "说出对应的函数"),
      explanation: t(
        "A few series appear so often that it pays to recognize them on sight from the pattern of their coefficients and signs. Three series to know:\n\n$$e^{x} = \\sum_{n=0}^{\\infty} \\frac{x^{n}}{n!}, \\qquad \\frac{1}{1 - x} = \\sum_{n=0}^{\\infty} x^{n}, \\qquad \\ln(1 + x) = \\sum_{n=1}^{\\infty} \\frac{(-1)^{n+1} x^{n}}{n}.$$\n\nReplacing $x$ with $kx$ turns $x^{n}$ into $k^{n}x^{n}$, so $\\sum \\frac{3^{n} x^{n}}{n!} = e^{3x}$.",
        "有几个级数出现得非常频繁，值得根据系数和符号的规律一眼认出它们。需要熟记三个级数：\n\n$$e^{x} = \\sum_{n=0}^{\\infty} \\frac{x^{n}}{n!}, \\qquad \\frac{1}{1 - x} = \\sum_{n=0}^{\\infty} x^{n}, \\qquad \\ln(1 + x) = \\sum_{n=1}^{\\infty} \\frac{(-1)^{n+1} x^{n}}{n}。$$\n\n把 $x$ 换成 $kx$，$x^{n}$ 就变成 $k^{n}x^{n}$，所以 $\\sum \\frac{3^{n} x^{n}}{n!} = e^{3x}$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const c = rng.int(1, 4);
        const cc = c === 1 ? "" : `${c} `;
        if (kind === 0) {
          const k = rng.nonZero(-4, 4);
          const kn = k === 1 ? "" : `${powTex(k, "n")} `;
          const answer = `${c === 1 ? "" : c}e^{${poly([k, "x"])}}`;
          return functionProblem({
            prompt: t(
              `Find the function whose Maclaurin series is $${cc}${sigma(`\\frac{${kn}x^{n}}{n!}`)}$.`,
              `求麦克劳林级数为 $${cc}${sigma(`\\frac{${kn}x^{n}}{n!}`)}$ 的函数。`,
            ),
            answer,
            prefix: "f(x) =",
            wrong: [
              `${c === 1 ? "" : c}e^{x}`,
              `\\frac{${c}}{1 - ${poly([k, "x"])}}`.replace("- -", "+ "),
              `${c === 1 ? "" : c}e^{${poly([-k, "x"])}}`,
            ],
            solution: t(
              `This is $e^{u} = \\sum \\frac{u^{n}}{n!}$ with $u = ${poly([k, "x"])}$${c === 1 ? "" : `, times $${c}$`}, so $f(x) = ${answer}$.`,
              `这是 $e^{u} = \\sum \\frac{u^{n}}{n!}$，其中 $u = ${poly([k, "x"])}$${c === 1 ? "" : `，再乘以 $${c}$`}，所以 $f(x) = ${answer}$。`,
            ),
          });
        }
        const k = kind === 1 ? rng.nonZero(-4, 4) : rng.int(1, 4);
        if (kind === 1) {
          const body = k === 1 ? "x^{n}" : `${powTex(k, "n")} x^{n}`;
          const answer = `\\frac{${c}}{${poly([1, ""], [-k, "x"])}}`;
          return functionProblem({
            prompt: t(
              `Find the function whose Maclaurin series is $${cc}${sigma(body)}$.`,
              `求麦克劳林级数为 $${cc}${sigma(body)}$ 的函数。`,
            ),
            answer,
            prefix: "f(x) =",
            wrong: [`\\frac{${c}}{${poly([1, ""], [k, "x"])}}`, `${c === 1 ? "" : c}e^{${poly([k, "x"])}}`, `\\frac{${c}}{1 - x}`],
            solution: t(
              `This is $\\frac{1}{1 - u} = \\sum u^{n}$ with $u = ${poly([k, "x"])}$${c === 1 ? "" : `, times $${c}$`}, so $f(x) = ${answer}$.`,
              `这是 $\\frac{1}{1 - u} = \\sum u^{n}$，其中 $u = ${poly([k, "x"])}$${c === 1 ? "" : `，再乘以 $${c}$`}，所以 $f(x) = ${answer}$。`,
            ),
          });
        }
        const kn = k === 1 ? "" : `${k}^{n} `;
        const answer = `${c === 1 ? "" : c}\\ln(${poly([1, ""], [k, "x"])})`;
        return functionProblem({
          prompt: t(
            `Find the function whose Maclaurin series is $${cc}${sigma(`\\frac{(-1)^{n+1} ${kn}x^{n}}{n}`, 1)}$.`,
            `求麦克劳林级数为 $${cc}${sigma(`\\frac{(-1)^{n+1} ${kn}x^{n}}{n}`, 1)}$ 的函数。`,
          ),
          answer,
          prefix: "f(x) =",
          wrong: [
            `${c === 1 ? "" : c}\\ln(${poly([1, ""], [-k, "x"])})`,
            `${c === 1 ? "" : c}e^{${poly([k, "x"])}}`,
            `\\frac{${c}}{${poly([1, ""], [k, "x"])}}`,
          ],
          solution: t(
            `This is $\\ln(1 + u) = \\sum \\frac{(-1)^{n+1} u^{n}}{n}$ with $u = ${poly([k, "x"])}$${c === 1 ? "" : `, times $${c}$`}, so $f(x) = ${answer}$.`,
            `这是 $\\ln(1 + u) = \\sum \\frac{(-1)^{n+1} u^{n}}{n}$，其中 $u = ${poly([k, "x"])}$${c === 1 ? "" : `，再乘以 $${c}$`}，所以 $f(x) = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "sums-from-standard-series",
      title: t("Sums from standard series", "用标准级数求和"),
      explanation: t(
        "If a numerical series matches a standard series evaluated at one value of the variable, its sum is the function evaluated at that value. A numerical series can be a standard series at a particular $x$. Since $e^{x} = \\sum \\frac{x^{n}}{n!}$, taking $x = \\ln 5$ gives $\\sum_{n=0}^{\\infty} \\frac{(\\ln 5)^{n}}{n!} = e^{\\ln 5} = 5$.",
        "如果一个数项级数与某个标准级数在变量取某值时相同，它的和就是函数在该值处的值。一个数项级数可能是某个标准级数在特定 $x$ 处的值。由于 $e^{x} = \\sum \\frac{x^{n}}{n!}$，取 $x = \\ln 5$ 得 $\\sum_{n=0}^{\\infty} \\frac{(\\ln 5)^{n}}{n!} = e^{\\ln 5} = 5$。",
      ),
      generate(rng) {
        const k = rng.int(2, 9);
        const m = rng.int(1, 2);
        const c = rng.int(1, 4);
        const u = m === 1 ? `\\ln ${k}` : `2\\ln ${k}`;
        const answer = c * k ** m;
        return numberProblem({
          prompt: t(
            `Find the sum of $${c === 1 ? "" : c}${sigma(`\\frac{(${u})^{n}}{n!}`)}$.`,
            `求 $${c === 1 ? "" : c}${sigma(`\\frac{(${u})^{n}}{n!}`)}$ 的和。`,
          ),
          answer,
          wrong: [c * k, c * m * k, c * (k + m)],
          solution: t(
            `This is $e^{x}$ at $x = ${u}$${c === 1 ? "" : `, times $${c}$`}: $${c === 1 ? "" : `${c} \\cdot `}e^{${u}} = ${c === 1 ? "" : `${c} \\cdot `}${m === 1 ? k : `${k}^{2}`} = ${answer}$.`,
            `这是 $e^{x}$ 在 $x = ${u}$ 处的值${c === 1 ? "" : `再乘以 $${c}$`}：$${c === 1 ? "" : `${c} \\cdot `}e^{${u}} = ${c === 1 ? "" : `${c} \\cdot `}${m === 1 ? k : `${k}^{2}`} = ${answer}$。`,
          ),
        });
      },
    },
  ],
};

/** recognizingStandardMaclaurinSeriesForTrigonometricFunctions identifies sin, cos and arctan. */
export const recognizingStandardMaclaurinSeriesForTrigonometricFunctions: TopicDef = {
  id: "recognizing-standard-maclaurin-series-for-trigonometric-functions",
  title: t("Recognizing Standard Maclaurin Series for Trigonometric Functions", "识别三角函数的标准麦克劳林级数"),
  summary: t(
    "sin x = Σ (−1)ⁿx²ⁿ⁺¹/(2n + 1)!, cos x = Σ (−1)ⁿx²ⁿ/(2n)! and arctan x = Σ (−1)ⁿx²ⁿ⁺¹/(2n + 1).",
    "sin x = Σ (−1)ⁿx²ⁿ⁺¹/(2n + 1)!，cos x = Σ (−1)ⁿx²ⁿ/(2n)!，arctan x = Σ (−1)ⁿx²ⁿ⁺¹/(2n + 1)。",
  ),
  prerequisites: ["recognizing-standard-maclaurin-series"],
  encompasses: [{ topic: "recognizing-standard-maclaurin-series", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "naming-a-trigonometric-series",
      title: t("Naming the function", "说出对应的函数"),
      explanation: t(
        "$$\\sin x = \\sum_{n=0}^{\\infty} \\frac{(-1)^{n} x^{2n+1}}{(2n + 1)!}, \\quad \\cos x = \\sum_{n=0}^{\\infty} \\frac{(-1)^{n} x^{2n}}{(2n)!}, \\quad \\arctan x = \\sum_{n=0}^{\\infty} \\frac{(-1)^{n} x^{2n+1}}{2n + 1}.$$\n\nOdd powers with factorials mean sine, even powers with factorials mean cosine, and odd powers over $2n + 1$ without a factorial mean arctangent. So $\\sum \\frac{(-1)^{n} 2^{2n} x^{2n}}{(2n)!} = \\cos(2x)$.",
        "$$\\sin x = \\sum_{n=0}^{\\infty} \\frac{(-1)^{n} x^{2n+1}}{(2n + 1)!}, \\quad \\cos x = \\sum_{n=0}^{\\infty} \\frac{(-1)^{n} x^{2n}}{(2n)!}, \\quad \\arctan x = \\sum_{n=0}^{\\infty} \\frac{(-1)^{n} x^{2n+1}}{2n + 1}。$$\n\n奇次幂配阶乘是正弦，偶次幂配阶乘是余弦，奇次幂除以 $2n + 1$（没有阶乘）是反正切。所以 $\\sum \\frac{(-1)^{n} 2^{2n} x^{2n}}{(2n)!} = \\cos(2x)$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const k = rng.int(1, 5);
        const c = rng.int(1, 4);
        const e = kind === 1 ? "2n" : "2n+1";
        const kp = k === 1 ? "" : `${k}^{${e}} `;
        const den = kind === 0 ? "(2n + 1)!" : kind === 1 ? "(2n)!" : "2n + 1";
        const series = `${c === 1 ? "" : `${c} `}${sigma(`\\frac{(-1)^{n} ${kp}x^{${e}}}{${den}}`)}`;
        const names = ["\\sin", "\\cos", "\\arctan"] as const;
        const arg = poly([k, "x"]);
        const fn = (i: number) => `${c === 1 ? "" : c}${names[i]}(${arg})`;
        return functionProblem({
          prompt: t(`Find the function whose Maclaurin series is $${series}$.`, `求麦克劳林级数为 $${series}$ 的函数。`),
          answer: fn(kind),
          prefix: "f(x) =",
          wrong: [0, 1, 2].filter((i) => i !== kind).map(fn),
          solution: t(
            `${kind === 1 ? "Even powers with $(2n)!$" : kind === 0 ? "Odd powers with $(2n + 1)!$" : "Odd powers over $2n + 1$"} give $${names[kind]} u$, here with $u = ${arg}$${c === 1 ? "" : ` and a factor $${c}$`}. So $f(x) = ${fn(kind)}$.`,
            `${kind === 1 ? "偶次幂配 $(2n)!$" : kind === 0 ? "奇次幂配 $(2n + 1)!$" : "奇次幂除以 $2n + 1$"}对应 $${names[kind]} u$，这里 $u = ${arg}$${c === 1 ? "" : `，再乘以 $${c}$`}。所以 $f(x) = ${fn(kind)}$。`,
          ),
        });
      },
    },
    {
      id: "sums-from-trigonometric-series",
      title: t("Sums from trigonometric series", "用三角函数级数求和"),
      explanation: t(
        "Match the factorials and the alternating signs to the sine or cosine series, then read off the value of the variable from the powers. Recognize the series at a particular $x$. $\\sum_{n=0}^{\\infty} \\frac{(-1)^{n} \\pi^{2n}}{3^{2n} (2n)!}$ is the cosine series at $x = \\frac{\\pi}{3}$, so it equals $\\cos \\frac{\\pi}{3} = \\frac{1}{2}$.",
        "根据阶乘和交替的符号与正弦或余弦级数对应，再从幂中读出变量的值。识别出级数是某个标准级数在特定 $x$ 处的值。$\\sum_{n=0}^{\\infty} \\frac{(-1)^{n} \\pi^{2n}}{3^{2n} (2n)!}$ 是余弦级数在 $x = \\frac{\\pi}{3}$ 处的值，所以等于 $\\cos \\frac{\\pi}{3} = \\frac{1}{2}$。",
      ),
      generate(rng) {
        const sine = rng.bool();
        const k = rng.pick(sine ? [1, 2, 6] : [1, 2, 3]);
        const c = rng.int(1, 9);
        const value = sine ? { 1: Q.zero, 2: Q.one, 6: Q.of(1, 2) }[k]! : { 1: Q.of(-1), 2: Q.zero, 3: Q.of(1, 2) }[k]!;
        const e = sine ? "2n+1" : "2n";
        const body = `\\frac{(-1)^{n} \\pi^{${e}}}{${k === 1 ? "" : `${k}^{${e}} `}(${e === "2n" ? "2n" : "2n + 1"})!}`;
        const x = k === 1 ? "\\pi" : `\\frac{\\pi}{${k}}`;
        const answer = value.mul(Q.of(c));
        const other = sine ? { 1: Q.of(-1), 2: Q.zero, 6: Q.of(1, 2) }[k]! : { 1: Q.zero, 2: Q.one, 3: Q.of(1, 2) }[k]!;
        return numberProblem({
          prompt: t(`Find the sum of $${c === 1 ? "" : c}${sigma(body)}$.`, `求 $${c === 1 ? "" : c}${sigma(body)}$ 的和。`),
          answer,
          wrong: [other.mul(Q.of(c)), answer.neg(), Q.of(c)],
          solution: t(
            `This is the ${sine ? "sine" : "cosine"} series at $x = ${x}$${c === 1 ? "" : `, times $${c}$`}: $${c === 1 ? "" : `${c} `}\\${sine ? "sin" : "cos"} ${x} = ${answer.toLatex()}$.`,
            `这是${sine ? "正弦" : "余弦"}级数在 $x = ${x}$ 处的值${c === 1 ? "" : `再乘以 $${c}$`}：$${c === 1 ? "" : `${c} `}\\${sine ? "sin" : "cos"} ${x} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** differentiatingTaylorSeries differentiates power series term by term. */
export const differentiatingTaylorSeries: TopicDef = {
  id: "differentiating-taylor-series",
  title: t("Differentiating Taylor Series", "对泰勒级数求导"),
  summary: t(
    "Inside its interval of convergence, a power series can be differentiated term by term; the radius stays the same.",
    "在收敛区间内部，幂级数可以逐项求导，收敛半径不变。",
  ),
  prerequisites: ["representing-functions-as-power-series"],
  encompasses: [{ topic: "representing-functions-as-power-series", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "series-for-derivatives",
      title: t("Series for derivatives", "导数的级数"),
      explanation: t(
        "A power series can be differentiated term by term inside its interval of convergence, and the result is the series of the derivative. If $f(x) = \\sum c_n x^{n}$ for $|x| < R$, then $f'(x) = \\sum n c_n x^{n-1}$ for $|x| < R$. Differentiating $\\frac{1}{1 - kx} = \\sum k^{n} x^{n}$ gives $\\frac{k}{(1 - kx)^{2}} = \\sum_{n=1}^{\\infty} n k^{n} x^{n-1}$, so the coefficient of $x^{m}$ in $\\frac{1}{(1 - kx)^{2}}$ is $(m + 1)k^{m}$.",
        "幂级数在收敛区间内可以逐项求导，结果就是导数的级数。若在 $|x| < R$ 上 $f(x) = \\sum c_n x^{n}$，则在 $|x| < R$ 上 $f'(x) = \\sum n c_n x^{n-1}$。对 $\\frac{1}{1 - kx} = \\sum k^{n} x^{n}$ 求导得 $\\frac{k}{(1 - kx)^{2}} = \\sum_{n=1}^{\\infty} n k^{n} x^{n-1}$，所以 $\\frac{1}{(1 - kx)^{2}}$ 中 $x^{m}$ 的系数为 $(m + 1)k^{m}$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-3, 3);
        const c = rng.int(1, 5);
        const m = rng.int(2, 5);
        const answer = Q.of(c * (m + 1)).mul(qpow(Q.of(k), m));
        const f = `\\frac{${c}}{(${poly([1, ""], [-k, "x"])})^{2}}`;
        return numberProblem({
          prompt: t(
            `Differentiate the Maclaurin series of $\\frac{1}{${poly([1, ""], [-k, "x"])}}$ to find the coefficient of $x^{${m}}$ in the Maclaurin series of $${f}$.`,
            `对 $\\frac{1}{${poly([1, ""], [-k, "x"])}}$ 的麦克劳林级数求导，求 $${f}$ 的麦克劳林级数中 $x^{${m}}$ 的系数。`,
          ),
          answer,
          wrong: [Q.of(c * m).mul(qpow(Q.of(k), m)), Q.of(c).mul(qpow(Q.of(k), m)), Q.of(c * (m + 1)).mul(qpow(Q.of(k), m + 1))],
          solution: t(
            `$\\frac{d}{dx} \\frac{1}{${poly([1, ""], [-k, "x"])}} = \\frac{${k}}{(${poly([1, ""], [-k, "x"])})^{2}} = \\sum_{n=1}^{\\infty} n \\, ${powTex(k, "n")} x^{n-1}$, so $\\frac{1}{(${poly([1, ""], [-k, "x"])})^{2}} = \\sum_{n=0}^{\\infty} (n + 1) ${powTex(k, "n")} x^{n}$. The coefficient of $x^{${m}}$ in $${f}$ is $${c} \\cdot ${m + 1} \\cdot ${powTex(k, `${m}`)} = ${answer.toLatex()}$.`,
            `$\\frac{d}{dx} \\frac{1}{${poly([1, ""], [-k, "x"])}} = \\frac{${k}}{(${poly([1, ""], [-k, "x"])})^{2}} = \\sum_{n=1}^{\\infty} n \\, ${powTex(k, "n")} x^{n-1}$，所以 $\\frac{1}{(${poly([1, ""], [-k, "x"])})^{2}} = \\sum_{n=0}^{\\infty} (n + 1) ${powTex(k, "n")} x^{n}$。$${f}$ 中 $x^{${m}}$ 的系数为 $${c} \\cdot ${m + 1} \\cdot ${powTex(k, `${m}`)} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "sums-by-differentiating-series",
      title: t("Sums by differentiating", "通过求导求和"),
      explanation: t(
        "Differentiating a known series brings down the index as a factor, so it gives the sums of series whose terms include the index. Differentiating $\\frac{1}{1 - x} = \\sum x^{n}$ gives $\\frac{1}{(1 - x)^{2}} = \\sum_{n=1}^{\\infty} n x^{n-1}$, so $\\sum_{n=1}^{\\infty} n x^{n} = \\frac{x}{(1 - x)^{2}}$ for $|x| < 1$. At $x = \\frac{1}{3}$: $\\sum \\frac{n}{3^{n}} = \\frac{1/3}{(2/3)^{2}} = \\frac{3}{4}$.",
        "对已知级数求导会把下标作为因子带下来，所以可以求出各项含下标的级数的和。对 $\\frac{1}{1 - x} = \\sum x^{n}$ 求导得 $\\frac{1}{(1 - x)^{2}} = \\sum_{n=1}^{\\infty} n x^{n-1}$，所以当 $|x| < 1$ 时 $\\sum_{n=1}^{\\infty} n x^{n} = \\frac{x}{(1 - x)^{2}}$。取 $x = \\frac{1}{3}$：$\\sum \\frac{n}{3^{n}} = \\frac{1/3}{(2/3)^{2}} = \\frac{3}{4}$。",
      ),
      generate(rng) {
        const k = rng.int(2, 9);
        const c = rng.int(1, 5);
        const alternating = rng.bool();
        const x = Q.of(alternating ? -1 : 1, k);
        const s = x.div(Q.one.sub(x).mul(Q.one.sub(x))).mul(Q.of(alternating ? -c : c));
        const body = alternating ? `\\frac{(-1)^{n+1} ${c === 1 ? "" : c}n}{${k}^{n}}` : `\\frac{${c === 1 ? "" : c}n}{${k}^{n}}`;
        return numberProblem({
          prompt: t(`Find the sum of $${sigma(body, 1)}$.`, `求 $${sigma(body, 1)}$ 的和。`),
          answer: s,
          wrong: [Q.of(c).div(Q.one.sub(x)), s.neg(), Q.of(c).div(Q.one.sub(x).mul(Q.one.sub(x)))],
          solution: t(
            `Use $\\sum_{n=1}^{\\infty} n x^{n} = \\frac{x}{(1 - x)^{2}}$ with $x = ${x.toLatex()}$: $\\frac{${x.toLatex()}}{\\left(${Q.one.sub(x).toLatex()}\\right)^{2}} = ${x.div(Q.one.sub(x).mul(Q.one.sub(x))).toLatex()}$.${alternating ? " The series has the opposite sign, $(-1)^{n+1} = -(-1)^{n}$." : ""}${c === 1 ? "" : ` Multiplying by $${c}$,`} the sum is $${s.toLatex()}$.`,
            `用 $\\sum_{n=1}^{\\infty} n x^{n} = \\frac{x}{(1 - x)^{2}}$，取 $x = ${x.toLatex()}$：$\\frac{${x.toLatex()}}{\\left(${Q.one.sub(x).toLatex()}\\right)^{2}} = ${x.div(Q.one.sub(x).mul(Q.one.sub(x))).toLatex()}$。${alternating ? "原级数符号相反，因为 $(-1)^{n+1} = -(-1)^{n}$。" : ""}${c === 1 ? "" : `再乘以 $${c}$，`}和为 $${s.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** IntegralSeries is ∫₀ˣ g(t) dt for a g with a standard series, as its first nonzero terms. */
interface IntegralSeries {
  readonly g: string;
  readonly terms: readonly (readonly [Q, number])[];
}

/** integralSeries picks e^{kt²}, sin(kt²), cos(kt²) or 1/(1 + kt²) and integrates three terms. */
function integralSeries(rng: Rng): IntegralSeries {
  const kind = rng.int(0, 3);
  const k = kind === 0 || kind === 3 ? rng.nonZero(-5, 5) : rng.int(1, 5);
  const kt = poly([k, "t^{2}"]);
  if (kind === 0)
    return {
      g: `e^{${kt}}`,
      terms: [
        [Q.one, 1],
        [Q.of(k, 3), 3],
        [Q.of(k * k, 10), 5],
      ],
    };
  if (kind === 1)
    return {
      g: `\\sin(${kt})`,
      terms: [
        [Q.of(k, 3), 3],
        [Q.of(-(k ** 3), 42), 7],
        [Q.of(k ** 5, 1320), 11],
      ],
    };
  if (kind === 2)
    return {
      g: `\\cos(${kt})`,
      terms: [
        [Q.one, 1],
        [Q.of(-(k * k), 10), 5],
        [Q.of(k ** 4, 216), 9],
      ],
    };
  return {
    g: `\\frac{1}{${poly([1, ""], [k, "t^{2}"])}}`,
    terms: [
      [Q.one, 1],
      [Q.of(-k, 3), 3],
      [Q.of(k * k, 5), 5],
    ],
  };
}

/** xPow writes xᵉ. */
const xPow = (e: number) => (e === 1 ? "x" : `x^{${e}}`);

/** approximatingIntegralsUsingTaylorSeries integrates series term by term. */
export const approximatingIntegralsUsingTaylorSeries: TopicDef = {
  id: "approximating-integrals-using-taylor-series",
  title: t("Approximating Integrals Using Taylor Series", "用泰勒级数近似积分"),
  summary: t(
    "Replace an integrand that has no elementary antiderivative by its Taylor series, integrate term by term, and add the first few terms.",
    "把没有初等原函数的被积函数换成它的泰勒级数，逐项积分，再取前几项求和。",
  ),
  prerequisites: ["recognizing-standard-maclaurin-series-for-trigonometric-functions", "differentiating-taylor-series"],
  encompasses: [{ topic: "differentiating-taylor-series", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "series-for-an-integral",
      title: t("A series for an integral", "积分的级数"),
      explanation: t(
        "A power series can be integrated term by term inside its interval of convergence. $e^{-t^{2}}$ has no elementary antiderivative, but $e^{-t^{2}} = 1 - t^{2} + \\frac{t^{4}}{2} - \\cdots$, so\n\n$$\\int_{0}^{x} e^{-t^{2}} \\, dt = x - \\frac{x^{3}}{3} + \\frac{x^{5}}{10} - \\cdots.$$",
        "在收敛区间内部，幂级数可以逐项积分。$e^{-t^{2}}$ 没有初等原函数，但 $e^{-t^{2}} = 1 - t^{2} + \\frac{t^{4}}{2} - \\cdots$，所以\n\n$$\\int_{0}^{x} e^{-t^{2}} \\, dt = x - \\frac{x^{3}}{3} + \\frac{x^{5}}{10} - \\cdots。$$",
      ),
      generate(rng) {
        const s = integralSeries(rng);
        const answer = poly(...s.terms.map(([c, e]) => [c, xPow(e)] as const));
        const integrand = poly(...s.terms.map(([c, e]) => [c.mul(Q.of(e)), e === 1 ? "" : `t^{${e - 1}}`] as const));
        return functionProblem({
          prompt: t(
            `Find the first three nonzero terms of the Maclaurin series for $F(x) = \\int_{0}^{x} ${s.g} \\, dt$, and give their sum.`,
            `求 $F(x) = \\int_{0}^{x} ${s.g} \\, dt$ 的麦克劳林级数的前三个非零项，写出它们的和。`,
          ),
          answer,
          wrong: [
            poly(...s.terms.map(([c, e]) => [c.mul(Q.of(e)), xPow(e)] as const)),
            poly(...s.terms.map(([c, e]) => [c, xPow(e + 1)] as const)),
          ],
          solution: t(
            `$${s.g} = ${integrand} + \\cdots$. Integrating each term from $0$ to $x$ gives $F(x) = ${answer} + \\cdots$.`,
            `$${s.g} = ${integrand} + \\cdots$。把每一项从 $0$ 积分到 $x$，得 $F(x) = ${answer} + \\cdots$。`,
          ),
        });
      },
    },
    {
      id: "estimating-a-definite-integral",
      title: t("Estimating a definite integral", "估计定积分的值"),
      explanation: t(
        "Integrate the series and substitute the upper limit. With three terms, $\\int_{0}^{1/2} e^{-t^{2}} \\, dt \\approx \\frac{1}{2} - \\frac{(1/2)^{3}}{3} + \\frac{(1/2)^{5}}{10} = \\frac{1}{2} - \\frac{1}{24} + \\frac{1}{320} = \\frac{443}{960}$. Since the series alternates, the error is at most the next term.",
        "对级数积分后代入上限。取三项，$\\int_{0}^{1/2} e^{-t^{2}} \\, dt \\approx \\frac{1}{2} - \\frac{(1/2)^{3}}{3} + \\frac{(1/2)^{5}}{10} = \\frac{1}{2} - \\frac{1}{24} + \\frac{1}{320} = \\frac{443}{960}$。由于级数正负交替，误差不超过下一项。",
      ),
      generate(rng) {
        const s = integralSeries(rng);
        const b = rng.pick([Q.of(1, 2), Q.of(1, 3), Q.of(1, 4), Q.of(1, 5), Q.of(1, 10), Q.one, Q.of(2, 3), Q.of(3, 4)]);
        const values = s.terms.map(([c, e]) => c.mul(qpow(b, e)));
        const answer = values.reduce((x, y) => x.add(y), Q.zero);
        const F = poly(...s.terms.map(([c, e]) => [c, xPow(e)] as const));
        return numberProblem({
          prompt: t(
            `Use the first three nonzero terms of a Maclaurin series to approximate $\\int_{0}^{${b.toLatex()}} ${s.g} \\, dt$.`,
            `用麦克劳林级数的前三个非零项近似 $\\int_{0}^{${b.toLatex()}} ${s.g} \\, dt$。`,
          ),
          answer,
          wrong: [values[0]!.add(values[1]!), values[0]!.sub(values[1]!).add(values[2]!), values[0]!.add(values[1]!).sub(values[2]!)],
          solution: t(
            `$\\int_{0}^{x} ${s.g} \\, dt = ${F} + \\cdots$. At $x = ${b.toLatex()}$: $${values
              .map((v) => v.toLatex())
              .join(" + ")
              .replaceAll("+ -", "- ")} = ${answer.toLatex()}$.`,
            `$\\int_{0}^{x} ${s.g} \\, dt = ${F} + \\cdots$。在 $x = ${b.toLatex()}$ 处：$${values
              .map((v) => v.toLatex())
              .join(" + ")
              .replaceAll("+ -", "- ")} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** calculusIITaylorTopics are the topics of Calculus II modules 4.22 and 4.23. */
export const calculusIITaylorTopics: readonly TopicDef[] = [
  secondDegreeTaylorPolynomials,
  analyzingSecondDegreeTaylorPolynomials,
  thirdDegreeTaylorPolynomials,
  higherDegreeTaylorPolynomials,
  theLagrangeErrorBound,
  radiusOfConvergenceOfPowerSeriesCenteredAtTheOrigin,
  radiusOfConvergenceOfPowerSeries,
  maclaurinSeries,
  taylorSeries,
  representingFunctionsAsPowerSeries,
  recognizingStandardMaclaurinSeries,
  recognizingStandardMaclaurinSeriesForTrigonometricFunctions,
  differentiatingTaylorSeries,
  approximatingIntegralsUsingTaylorSeries,
];
