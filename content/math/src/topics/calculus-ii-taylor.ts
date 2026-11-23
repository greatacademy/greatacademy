import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import type { Interval } from "@ga/subject-math";
import { intervalLatex, linear, poly, Q } from "@ga/subject-math";

import { explainedChoice, intervalProblem, say, withMistakes } from "../problems.ts";
import { functionWith, type Said, type Step, walked } from "./calculus-i-differentiation.ts";
import { slip, worked } from "./calculus-ii-parametric.ts";

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

/** powOne writes k to a positive power, leaving out an exponent of 1. */
const powOne = (k: number, e: number) => (e === 1 ? (k < 0 ? `(${k})` : `${k}`) : powTex(k, `${e}`));

/** around writes the ith power of (x − a), or of x when a is 0. */
function around(a: number, i: number): string {
  if (i === 0) return "";
  const base = a === 0 ? "x" : `(${linear(1, -a)})`;
  return i === 1 ? base : `${base}^{${i}}`;
}

/** taylorPoly writes c₀ + c₁(x − a) + c₂(x − a)² + ⋯. */
const taylorPoly = (cs: readonly Q[], a = 0) => poly(...cs.map((c, i) => [c, around(a, i)] as const));

/** taylorAt evaluates c₀ + c₁(x − a) + c₂(x − a)² + ⋯ at x exactly. */
const taylorAt = (cs: readonly Q[], a: number, x: Q) => cs.reduce((s, c, i) => s.add(c.mul(qpow(x.sub(Q.of(a)), i))), Q.zero);

/** nth writes f(a), f'(a), f''(a), f'''(a) or f⁽ⁿ⁾(a). */
const nth = (n: number, a: number | string) => (n === 0 ? `f(${a})` : n <= 3 ? `f${"'".repeat(n)}(${a})` : `f^{(${n})}(${a})`);

/** dec writes a decimal with the given number of places, never as −0. */
const dec = (x: number, places = 5) => {
  const s = x.toFixed(places);
  return /^-0\.?0*$/.test(s) ? s.slice(1) : s;
};

/** small writes a small positive number with three significant figures, as a power of ten when it is tiny. */
function small(x: number): string {
  if (x >= 0.001) return x.toPrecision(3);
  const e = Math.floor(Math.log10(x));
  return `${(x / 10 ** e).toFixed(2)} \\times 10^{${e}}`;
}

/** par puts parentheses around a negative number for a product. */
const par = (q: Q) => (q.sign() < 0 ? `\\left(${q.toLatex()}\\right)` : q.toLatex());

/** product writes the factors of a product, leaving out factors of 1: "3 \cdot 4", or "1" when nothing is left. */
const product = (...fs: readonly string[]) => fs.filter((f) => f !== "1").join(" \\cdot ") || "1";

/** fnWorked asks for an expression, explains it in labelled steps with a check, and answers each wrong expression with its reason. */
function fnWorked(prompt: Text, answer: string, prefix: string, parts: readonly Step[], check: Text, mistakes: readonly Said[]): Problem {
  return functionWith(
    { prompt, answer, prefix, solution: walked(parts, check) },
    mistakes.filter((m) => m.response !== answer),
  );
}

/** Family is a function with simple derivatives at 0 and a standard series in u = kx. */
interface Family {
  readonly tex: string;
  readonly deriv: (n: number) => Q;
  readonly at: (x: number) => number;
  readonly u: string;
  readonly k: number;
  readonly series: string;
  readonly unit: (j: number) => Q;
}

/** family picks e^{kx}, sin kx, cos kx, ln(1 + kx), 1/(1 − kx) or (1 + x)^m. */
function family(rng: Rng): Family {
  const k = rng.nonZero(-3, 3);
  const kx = poly([k, "x"]);
  const kind = rng.int(0, 5);
  if (kind === 0)
    return {
      tex: `e^{${kx}}`,
      deriv: (n) => qpow(Q.of(k), n),
      at: (x) => Math.exp(k * x),
      u: kx,
      k,
      series: "e^{u} = 1 + u + \\frac{u^{2}}{2!} + \\frac{u^{3}}{3!} + \\cdots",
      unit: (j) => Q.of(1, factorial(j)),
    };
  if (kind === 1)
    return {
      tex: `\\sin(${kx})`,
      deriv: (n) => (n % 2 === 0 ? Q.zero : qpow(Q.of(k), n).mul(Q.of((n - 1) % 4 === 0 ? 1 : -1))),
      at: (x) => Math.sin(k * x),
      u: kx,
      k,
      series: "\\sin u = u - \\frac{u^{3}}{3!} + \\frac{u^{5}}{5!} - \\cdots",
      unit: (j) => (j % 2 === 0 ? Q.zero : Q.of((j - 1) % 4 === 0 ? 1 : -1, factorial(j))),
    };
  if (kind === 2) {
    const m = Math.abs(k);
    return {
      tex: `\\cos(${poly([m, "x"])})`,
      deriv: (n) => (n % 2 === 1 ? Q.zero : qpow(Q.of(k), n).mul(Q.of(n % 4 === 0 ? 1 : -1))),
      at: (x) => Math.cos(m * x),
      u: poly([m, "x"]),
      k: m,
      series: "\\cos u = 1 - \\frac{u^{2}}{2!} + \\frac{u^{4}}{4!} - \\cdots",
      unit: (j) => (j % 2 === 1 ? Q.zero : Q.of(j % 4 === 0 ? 1 : -1, factorial(j))),
    };
  }
  if (kind === 3)
    return {
      tex: `\\ln(${poly([1, ""], [k, "x"])})`,
      deriv: (n) => (n === 0 ? Q.zero : qpow(Q.of(k), n).mul(Q.of((n % 2 === 1 ? 1 : -1) * factorial(n - 1)))),
      at: (x) => Math.log(1 + k * x),
      u: kx,
      k,
      series: "\\ln(1 + u) = u - \\frac{u^{2}}{2} + \\frac{u^{3}}{3} - \\cdots",
      unit: (j) => (j === 0 ? Q.zero : Q.of(j % 2 === 1 ? 1 : -1, j)),
    };
  if (kind === 4)
    return {
      tex: `\\frac{1}{${poly([1, ""], [-k, "x"])}}`,
      deriv: (n) => qpow(Q.of(k), n).mul(Q.of(factorial(n))),
      at: (x) => 1 / (1 - k * x),
      u: kx,
      k,
      series: "\\frac{1}{1 - u} = 1 + u + u^{2} + u^{3} + \\cdots",
      unit: () => Q.one,
    };
  const m = rng.pick([-3, -2, -1, 2, 3, 4, 5, 6]);
  const falling = (n: number) => {
    let r = 1;
    for (let i = 0; i < n; i++) r *= m - i;
    return r;
  };
  const mm = m < 0 ? `(${m})` : `${m}`;
  return {
    tex: `(1 + x)^{${m}}`,
    deriv: (n) => Q.of(falling(n)),
    at: (x) => (1 + x) ** m,
    u: "x",
    k: 1,
    series: `(1 + u)^{${m}} = 1 + ${mm}u + \\frac{${mm}(${m} - 1)}{2!}u^{2} + \\frac{${mm}(${m} - 1)(${m} - 2)}{3!}u^{3} + \\cdots`,
    unit: (j) => Q.of(falling(j), factorial(j)),
  };
}

/** coefficients lists f⁽ⁱ⁾(0)/i! for i = 0, …, n. */
const coefficients = (f: Family, n: number) => Array.from({ length: n + 1 }, (_, i) => f.deriv(i).div(Q.of(factorial(i))));

/** derivativeValues lists f(0) = …, f'(0) = …, up to the nth derivative. */
const derivativeValues = (f: Family, n: number) =>
  Array.from({ length: n + 1 }, (_, i) => `${nth(i, 0)} = ${f.deriv(i).toLatex()}`).join(", \\; ");

/** knownCoefficient checks the coefficient of xʲ in the series of a family function against its standard series. */
function knownCoefficient(f: Family, j: number, answer: Q): Text {
  const unit = f.unit(j);
  const head = t(`Check with a known series:\n\n$$${f.series}$$\n\n`, `用已知级数检验：\n\n$$${f.series}$$\n\n`);
  if (unit.isZero())
    return t(
      `${head.en}It has no $u^{${j}}$ term, so with $u = ${f.u}$ the coefficient of $x^{${j}}$ is $0$ again.`,
      `${head["zh-CN"]}其中没有 $u^{${j}}$ 项，所以令 $u = ${f.u}$ 后，$x^{${j}}$ 的系数同样是 $0$。`,
    );
  const scaled = f.k === 1 ? "" : ` \\cdot ${powTex(f.k, `${j}`)}`;
  return t(
    `${head.en}Its $u^{${j}}$ term has coefficient $${unit.toLatex()}$. With $u = ${f.u}$, the coefficient of $x^{${j}}$ is therefore $${unit.toLatex()}${scaled} = ${answer.toLatex()}$.`,
    `${head["zh-CN"]}其中 $u^{${j}}$ 项的系数是 $${unit.toLatex()}$。令 $u = ${f.u}$，$x^{${j}}$ 的系数同样为 $${unit.toLatex()}${scaled} = ${answer.toLatex()}$。`,
  );
}

/** valueCheck compares a polynomial and its function at a point near the center. */
function valueCheck(name: string, p: Q, x: string, fx: string, value: number): Text {
  const gap = Math.abs(p.toNumber() - value);
  return t(
    `Put in a value near the center. At $x = ${x}$ the polynomial gives $${name} = ${dec(p.toNumber())}$, and $${fx} \\approx ${dec(value)}$. They differ by only about $${small(gap)}$, as an approximation near the center should.`,
    `代入中心附近的一个值。在 $x = ${x}$ 处，多项式给出 $${name} = ${dec(p.toNumber())}$，而 $${fx} \\approx ${dec(value)}$。两者只相差约 $${small(gap)}$，正是中心附近的近似应有的样子。`,
  );
}

/** maclaurinPolynomialProblem asks for the Maclaurin polynomial of degree n of a family function. */
function maclaurinPolynomialProblem(rng: Rng, n: 2 | 3): Problem {
  const f = family(rng);
  const cs = coefficients(f, n);
  const answer = taylorPoly(cs);
  const h = Q.of(1, 10);
  return fnWorked(
    t(
      `Find the Taylor polynomial of degree ${n} for $f(x) = ${f.tex}$ centered at $x = 0$.`,
      `求 $f(x) = ${f.tex}$ 以 $x = 0$ 为中心的 ${n} 次泰勒多项式。`,
    ),
    answer,
    `P_${n}(x) =`,
    [
      [
        ["Evaluate the derivatives at 0", "求 0 处的各阶导数"],
        t("Differentiate repeatedly and put in $x = 0$:", "逐次求导，再代入 $x = 0$："),
        [derivativeValues(f, n)],
      ],
      [
        ["Divide by the factorials", "除以阶乘"],
        t("The coefficient of $x^{k}$ is the $k$th derivative divided by $k!$:", "$x^{k}$ 的系数是第 $k$ 阶导数除以 $k!$："),
        [`P_{${n}}(x) = ${answer}`],
      ],
    ],
    valueCheck(`P_{${n}}(0.1)`, taylorAt(cs, 0, h), "0.1", `f(0.1)`, f.at(0.1)),
    [
      say(
        taylorPoly(cs.map((c, i) => c.mul(Q.of(factorial(i))))),
        "This uses the derivatives themselves as coefficients. Each one must be divided by the factorial of its order.",
        "这里直接把导数当成了系数。每个导数都要除以其阶数的阶乘。",
      ),
      say(
        taylorPoly(cs.slice(0, n)),
        `This stops one degree too early. Degree ${n} needs the term in $x^{${n}}$ as well.`,
        `这里少了一次。${n} 次多项式还需要 $x^{${n}}$ 项。`,
      ),
      say(
        taylorPoly(cs.map((c, i) => (i === 1 ? c.neg() : c))),
        `The linear coefficient is $f'(0) = ${f.deriv(1).toLatex()}$; this has its sign reversed.`,
        `一次项系数是 $f'(0) = ${f.deriv(1).toLatex()}$；这里符号反了。`,
      ),
    ],
  );
}

/** fromValuesProblem asks for Pₙ centered at a from the values of f and its derivatives there. */
function fromValuesProblem(rng: Rng, n: 2 | 3): Problem {
  const a = rng.int(-3, 3);
  const values = Array.from({ length: n + 1 }, (_, i) => (i === 0 || i === n ? rng.nonZero(-9, 9) : rng.int(-9, 9)));
  const cs = values.map((v, i) => Q.of(v, factorial(i)));
  const answer = taylorPoly(cs, a);
  const given = values.map((v, i) => `${nth(i, a)} = ${v}`).join(", \\; ");
  const general = Array.from({ length: n + 1 }, (_, i) =>
    i === 0 ? nth(0, a) : i === 1 ? `${nth(1, a)}${around(a, 1)}` : `\\frac{${nth(i, a)}}{${i}!}${around(a, i)}`,
  ).join(" + ");
  const filled = values
    .map((v, i) => {
      const size = Math.abs(v);
      const body = i === 0 ? `${size}` : i === 1 ? `${size === 1 ? "" : size}${around(a, 1)}` : `\\frac{${size}}{${i}!}${around(a, i)}`;
      return i === 0 ? `${v}` : v === 0 ? "" : `${v < 0 ? "-" : "+"} ${body}`;
    })
    .filter(Boolean)
    .join(" ");
  const top = cs[n] as Q;
  return fnWorked(
    t(
      `Suppose $${given}$. Find the Taylor polynomial of degree ${n} for $f$ centered at $x = ${a}$.`,
      `设 $${given}$。求 $f$ 以 $x = ${a}$ 为中心的 ${n} 次泰勒多项式。`,
    ),
    answer,
    `P_${n}(x) =`,
    [
      [
        ["Write the formula", "写出公式"],
        t(`Centered at $x = ${a}$, the polynomial of degree ${n} is`, `以 $x = ${a}$ 为中心的 ${n} 次多项式为`),
        [`P_{${n}}(x) = ${general}`],
      ],
      [
        ["Substitute and simplify", "代入并化简"],
        t("Put in the given values and divide by the factorials:", "代入已知值，再除以阶乘："),
        [`P_{${n}}(x) = ${filled} = ${answer}`],
      ],
    ],
    t(
      `Differentiate term by term. At $x = ${a}$ every term with a factor $${around(a, 1)}$ vanishes, so $P_{${n}}(${a}) = ${values[0]}$ and $P_{${n}}'(${a}) = ${values[1]}$. Differentiating ${n} times leaves only $${product(`${n}!`, par(top))} = ${values[n]}$. These are the given values.`,
      `逐项求导。在 $x = ${a}$ 处，含因子 $${around(a, 1)}$ 的项都为 $0$，所以 $P_{${n}}(${a}) = ${values[0]}$，$P_{${n}}'(${a}) = ${values[1]}$。求 ${n} 阶导数后只剩 $${product(`${n}!`, par(top))} = ${values[n]}$。这些正是已知值。`,
    ),
    [
      say(
        taylorPoly(
          values.map((v) => Q.of(v)),
          a,
        ),
        `This uses each derivative as its coefficient. The derivative of order $k$ must be divided by $k!$, for example $\\frac{${nth(2, a)}}{2!}$.`,
        `这里把每个导数直接当成系数。$k$ 阶导数要除以 $k!$，例如 $\\frac{${nth(2, a)}}{2!}$。`,
      ),
      say(
        taylorPoly(cs, -a),
        `This is written in powers of $${around(-a, 1)}$, which centers it at $x = ${-a}$. Centered at $x = ${a}$, the powers are of $${around(a, 1)}$.`,
        `这里用的是 $${around(-a, 1)}$ 的幂，中心成了 $x = ${-a}$。以 $x = ${a}$ 为中心时，应当是 $${around(a, 1)}$ 的幂。`,
      ),
      say(
        taylorPoly(
          values.map((v, i) => Q.of(v, Math.max(1, i))),
          a,
        ),
        `This divides the derivative of order $3$ by $3$. It must be divided by $3! = 6$.`,
        "这里把三阶导数除以了 $3$。应当除以 $3! = 6$。",
      ),
    ],
  );
}

/** secondDegreeTaylorPolynomials match a function's value, slope and concavity at a point. */
export const secondDegreeTaylorPolynomials: TopicDef = {
  id: "second-degree-taylor-polynomials",
  title: t("Second-Degree Taylor Polynomials", "二次泰勒多项式"),
  summary: t(
    "P₂(x) = f(a) + f'(a)(x − a) + f''(a)/2 · (x − a)² matches f, f' and f'' at x = a.",
    "P₂(x) = f(a) + f'(a)(x − a) + f''(a)/2 · (x − a)² 在 x = a 处与 f、f'、f'' 都相等。",
  ),
  intro: t(
    "The tangent line to $e^{x}$ at $0$ is $1 + x$. Adding a square term that also matches the second derivative gives\n\n$$P_2(x) = 1 + x + \\frac{x^{2}}{2}$$\n\nAt $x = 0.2$ it gives $1.22$, while $e^{0.2} \\approx 1.22140$; the tangent line gives only $1.2$.\n\nCheck: differentiating $P_2$ twice gives $1$, the same as the second derivative of $e^{x}$ at $0$, which is $e^{0} = 1$.\n\nIn this lesson we build the second-degree Taylor polynomial, which matches the value, slope and concavity of a function at a point.",
    "$e^{x}$ 在 $0$ 处的切线是 $1 + x$。再加一个让二阶导数也相等的平方项，得\n\n$$P_2(x) = 1 + x + \\frac{x^{2}}{2}$$\n\n在 $x = 0.2$ 处它给出 $1.22$，而 $e^{0.2} \\approx 1.22140$；切线只给出 $1.2$。\n\n检验：$P_2$ 求两次导数得 $1$，与 $e^{x}$ 在 $0$ 处的二阶导数 $e^{0} = 1$ 相同。\n\n这节课我们构造二次泰勒多项式，它在一点处与函数的值、斜率和凹凸都一致。",
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
        "The linearization matches $f$ and $f'$ at $a$. Adding a square term also matches $f''$:\n\n$$P_2(x) = f(a) + f'(a)(x - a) + \\frac{f''(a)}{2}(x - a)^{2}$$\n\nThe $\\frac{1}{2}$ is needed because the second derivative of $(x - a)^{2}$ is $2$. If $f(1) = 3$, $f'(1) = -2$ and $f''(1) = 4$, then $P_2(x) = 3 - 2(x - 1) + 2(x - 1)^{2}$.\n\nCheck: $P_2'(x) = -2 + 4(x - 1)$ and $P_2''(x) = 4$, so $P_2(1) = 3$, $P_2'(1) = -2$ and $P_2''(1) = 4$, the given values.\n\n> **Watch out.** The coefficient of $(x - a)^{2}$ is $\\frac{f''(a)}{2}$, not $f''(a)$.",
        "线性化在 $a$ 处与 $f$、$f'$ 相等。再加一个平方项，就能让 $f''$ 也相等：\n\n$$P_2(x) = f(a) + f'(a)(x - a) + \\frac{f''(a)}{2}(x - a)^{2}$$\n\n之所以要乘 $\\frac{1}{2}$，是因为 $(x - a)^{2}$ 的二阶导数是 $2$。若 $f(1) = 3$，$f'(1) = -2$，$f''(1) = 4$，则 $P_2(x) = 3 - 2(x - 1) + 2(x - 1)^{2}$。\n\n检验：$P_2'(x) = -2 + 4(x - 1)$，$P_2''(x) = 4$，所以 $P_2(1) = 3$，$P_2'(1) = -2$，$P_2''(1) = 4$，正是已知值。\n\n> **注意。** $(x - a)^{2}$ 的系数是 $\\frac{f''(a)}{2}$，不是 $f''(a)$。",
      ),
      generate: (rng) => fromValuesProblem(rng, 2),
    },
    {
      id: "second-degree-taylor-polynomials-of-functions",
      title: t("$P_2$ for a given function", "给定函数的 $P_2$"),
      explanation: t(
        "Compute $f(a)$, $f'(a)$ and $f''(a)$, then put them into the formula. For $f(x) = e^{3x}$ at $a = 0$: $f(0) = 1$, $f'(0) = 3$, $f''(0) = 9$, so\n\n$$P_2(x) = 1 + 3x + \\frac{9}{2}x^{2}$$\n\nIt matches the value, slope and curvature of $f$ at $0$, so it follows the curve better than the tangent line.\n\nCheck: at $x = 0.1$, $P_2(0.1) = 1 + 0.3 + 0.045 = 1.345$, and $e^{0.3} \\approx 1.34986$.\n\n> **Watch out.** Use the derivatives at the center, not the derivative formulas: $f''(x) = 9e^{3x}$, but the coefficient uses $f''(0) = 9$.",
        "先求 $f(a)$、$f'(a)$、$f''(a)$，再代入公式。对 $f(x) = e^{3x}$，$a = 0$：$f(0) = 1$，$f'(0) = 3$，$f''(0) = 9$，所以\n\n$$P_2(x) = 1 + 3x + \\frac{9}{2}x^{2}$$\n\n它在 $0$ 处与 $f$ 的值、斜率和弯曲程度都一致，所以比切线更贴近曲线。\n\n检验：在 $x = 0.1$ 处，$P_2(0.1) = 1 + 0.3 + 0.045 = 1.345$，而 $e^{0.3} \\approx 1.34986$。\n\n> **注意。** 要用中心处的导数值，而不是导函数：$f''(x) = 9e^{3x}$，但系数用的是 $f''(0) = 9$。",
      ),
      generate: (rng) => maclaurinPolynomialProblem(rng, 2),
    },
  ],
};

/** behaviors are what a second-degree Taylor polynomial says about f near its center. */
const behaviors = (a: number) => [
  t(`$f$ has a local minimum at $x = ${a}$.`, `$f$ 在 $x = ${a}$ 处取得局部极小值。`),
  t(`$f$ has a local maximum at $x = ${a}$.`, `$f$ 在 $x = ${a}$ 处取得局部极大值。`),
  t(`$f$ has neither a local maximum nor a local minimum at $x = ${a}$.`, `$f$ 在 $x = ${a}$ 处既无局部极大值也无局部极小值。`),
];

/** analyzingSecondDegreeTaylorPolynomials reads derivatives and local behavior from P₂. */
export const analyzingSecondDegreeTaylorPolynomials: TopicDef = {
  id: "analyzing-second-degree-taylor-polynomials",
  title: t("Analyzing Second-Degree Taylor Polynomials", "分析二次泰勒多项式"),
  summary: t(
    "The coefficients of P₂ give f(a), f'(a) and f''(a)/2, which describe f near a and approximate nearby values.",
    "P₂ 的系数给出 f(a)、f'(a) 和 f''(a)/2，可以描述 f 在 a 附近的性态并近似附近的函数值。",
  ),
  intro: t(
    "Suppose $f$ has $P_2(x) = 4 - 3(x - 1)^{2}$ centered at $1$. The coefficients give\n\n$$f(1) = 4, \\qquad f'(1) = 0, \\qquad f''(1) = 2 \\cdot (-3) = -6$$\n\nSo $f$ has a horizontal tangent at $x = 1$ and bends downward there: a local maximum.\n\nCheck: $P_2$ itself is a parabola opening downward with vertex $(1, 4)$, so it too has its maximum at $x = 1$.\n\nIn this lesson we read derivatives and local behavior from $P_2$, and use it to estimate nearby values.",
    "设 $f$ 以 $1$ 为中心的二次泰勒多项式为 $P_2(x) = 4 - 3(x - 1)^{2}$。由系数得\n\n$$f(1) = 4, \\qquad f'(1) = 0, \\qquad f''(1) = 2 \\cdot (-3) = -6$$\n\n所以 $f$ 在 $x = 1$ 处切线水平且向下弯：取得局部极大值。\n\n检验：$P_2$ 本身是开口向下、顶点为 $(1, 4)$ 的抛物线，它也在 $x = 1$ 处取得最大值。\n\n这节课我们从 $P_2$ 读出导数和局部性态，并用它估计附近的函数值。",
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
        "Each coefficient of a Taylor polynomial is a derivative at the center divided by a factorial. In $P_2(x) = c_0 + c_1(x - a) + c_2(x - a)^{2}$:\n\n$$c_0 = f(a), \\qquad c_1 = f'(a), \\qquad c_2 = \\frac{f''(a)}{2}$$\n\nSo $f''(a) = 2c_2$. For $P_2(x) = 5 - (x - 2) + 3(x - 2)^{2}$: $f'(2) = -1$ and $f''(2) = 6$.\n\nCheck: $P_2''(x) = 2 \\cdot 3 = 6$ for every $x$, and $P_2'(2) = -1 + 6 \\cdot 0 = -1$.\n\n> **Watch out.** The coefficient $c_2$ is half of $f''(a)$, so multiply it by $2$; the linear coefficient is $f'(a)$ itself.",
        "泰勒多项式的每个系数都是中心处的导数除以阶乘。在 $P_2(x) = c_0 + c_1(x - a) + c_2(x - a)^{2}$ 中：\n\n$$c_0 = f(a), \\qquad c_1 = f'(a), \\qquad c_2 = \\frac{f''(a)}{2}$$\n\n所以 $f''(a) = 2c_2$。对 $P_2(x) = 5 - (x - 2) + 3(x - 2)^{2}$：$f'(2) = -1$，$f''(2) = 6$。\n\n检验：对每个 $x$ 都有 $P_2''(x) = 2 \\cdot 3 = 6$，且 $P_2'(2) = -1 + 6 \\cdot 0 = -1$。\n\n> **注意。** 系数 $c_2$ 是 $f''(a)$ 的一半，所以要乘以 $2$；一次项系数就是 $f'(a)$ 本身。",
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
        const prompt = t(
          `The second-degree Taylor polynomial for $f$ centered at $x = ${a}$ is $P_2(x) = ${p}$. Find $${nth(second ? 2 : 1, a)}$.`,
          `$f$ 以 $x = ${a}$ 为中心的二次泰勒多项式为 $P_2(x) = ${p}$。求 $${nth(second ? 2 : 1, a)}$。`,
        );
        const derivative = t(
          `Differentiate $P_2$ term by term instead: $P_2'(x) = ${poly([2 * c[2], around(a, 1)], [c[1], ""])}$ and $P_2''(x) = ${2 * c[2]}$. At $x = ${a}$ these give $${c[1]}$ and $${2 * c[2]}$, so $${nth(second ? 2 : 1, a)} = ${answer}$.`,
          `改为对 $P_2$ 逐项求导：$P_2'(x) = ${poly([2 * c[2], around(a, 1)], [c[1], ""])}$，$P_2''(x) = ${2 * c[2]}$。在 $x = ${a}$ 处分别为 $${c[1]}$ 和 $${2 * c[2]}$，所以 $${nth(second ? 2 : 1, a)} = ${answer}$。`,
        );
        if (second)
          return worked(
            prompt,
            Q.of(answer),
            [
              [
                ["Match the square coefficient", "对应平方项系数"],
                t(
                  `The coefficient of $${around(a, 2)}$ is the second derivative over $2!$:`,
                  `$${around(a, 2)}$ 的系数是二阶导数除以 $2!$：`,
                ),
                [`\\frac{${nth(2, a)}}{2} = ${c[2]}`],
              ],
              [
                ["Multiply by 2", "乘以 2"],
                t("Solve for the derivative:", "解出导数："),
                [`${nth(2, a)} = ${product("2", par(Q.of(c[2])))} = ${answer}`],
              ],
            ],
            derivative,
            [
              slip(c[2], "This is the coefficient itself, which is half of the second derivative.", "这是系数本身，它只是二阶导数的一半。"),
              slip(
                Q.of(c[2], 2),
                "This halves the coefficient. The coefficient is already the derivative divided by $2$, so multiply by $2$.",
                "这里把系数又除以了 $2$。系数已经是导数除以 $2$，所以应乘以 $2$。",
              ),
              slip(c[1], `This is the linear coefficient, which is $${nth(1, a)}$.`, `这是一次项系数，它是 $${nth(1, a)}$。`),
            ],
          );
        return worked(
          prompt,
          Q.of(answer),
          [
            [
              ["Match the linear coefficient", "对应一次项系数"],
              t(
                `The coefficient of $${around(a, 1)}$ is the first derivative over $1! = 1$:`,
                `$${around(a, 1)}$ 的系数是一阶导数除以 $1! = 1$：`,
              ),
              [`${nth(1, a)} = ${c[1]}`],
            ],
          ],
          derivative,
          [
            slip(c[0], `This is the constant term, which is $f(${a})$.`, `这是常数项，它是 $f(${a})$。`),
            slip(
              2 * c[1],
              "This doubles the linear coefficient. Only the square term carries the factor $\\frac{1}{2!}$.",
              "这里把一次项系数乘了 $2$。只有平方项带有因子 $\\frac{1}{2!}$。",
            ),
            slip(
              c[2],
              `This is the coefficient of $${around(a, 2)}$, which is $\\frac{${nth(2, a)}}{2}$.`,
              `这是 $${around(a, 2)}$ 的系数，它是 $\\frac{${nth(2, a)}}{2}$。`,
            ),
          ],
        );
      },
    },
    {
      id: "local-behavior-from-p2",
      title: t("Local behavior from $P_2$", "由 $P_2$ 判断局部性态"),
      explanation: t(
        "If $P_2$ has no linear term, then $f'(a) = 0$, and the sign of $f''(a) = 2c_2$ decides by the second derivative test:\n\n$$c_2 > 0 \\implies \\text{local minimum}, \\qquad c_2 < 0 \\implies \\text{local maximum}$$\n\nIf the linear coefficient is not $0$, then $f'(a) \\neq 0$ and $a$ is not a local extremum. For $P_2(x) = 7 + 2(x + 1)^{2}$: $f'(-1) = 0$ and $f''(-1) = 4 > 0$, a local minimum.\n\nCheck: $P_2$ itself is a parabola opening upward with vertex $(-1, 7)$, lowest at $x = -1$.\n\n> **Watch out.** A nonzero linear term rules out an extremum, however large the square term is.",
        "若 $P_2$ 没有一次项，则 $f'(a) = 0$，再由 $f''(a) = 2c_2$ 的符号按二阶导数判别法判断：\n\n$$c_2 > 0 \\implies \\text{局部极小值}, \\qquad c_2 < 0 \\implies \\text{局部极大值}$$\n\n若一次项系数不为 $0$，则 $f'(a) \\neq 0$，$a$ 不是局部极值点。对 $P_2(x) = 7 + 2(x + 1)^{2}$：$f'(-1) = 0$，$f''(-1) = 4 > 0$，是局部极小值。\n\n检验：$P_2$ 本身是开口向上、顶点为 $(-1, 7)$ 的抛物线，在 $x = -1$ 处最低。\n\n> **注意。** 只要一次项不为零就没有极值，不管平方项有多大。",
      ),
      generate(rng) {
        const a = rng.nonZero(-5, 5);
        const c0 = rng.int(-9, 9);
        const c1 = rng.int(0, 2) === 0 ? rng.nonZero(-9, 9) : 0;
        const c2 = rng.nonZero(-9, 9);
        const p = taylorPoly([Q.of(c0), Q.of(c1), Q.of(c2)], a);
        const right = c1 !== 0 ? 2 : c2 > 0 ? 0 : 1;
        const all = behaviors(a);
        const notCritical = t(
          `The linear coefficient is $${c1}$, so $${nth(1, a)} \\neq 0$: this is not a critical point, and $f$ has no extremum there.`,
          `一次项系数是 $${c1}$，所以 $${nth(1, a)} \\neq 0$：这不是临界点，$f$ 在那里没有极值。`,
        );
        const reasons: Text[] =
          c1 !== 0
            ? [notCritical, notCritical, t("", "")]
            : [
                t(
                  `The square coefficient is $${c2}$, negative, so $f$ bends downward here.`,
                  `平方项系数是 $${c2}$，为负，所以 $f$ 在这里向下弯。`,
                ),
                t(
                  `The square coefficient is $${c2}$, positive, so $f$ bends upward here.`,
                  `平方项系数是 $${c2}$，为正，所以 $f$ 在这里向上弯。`,
                ),
                t(
                  "There is no linear term, so this is a critical point, and the nonzero square term makes it an extremum.",
                  "没有一次项，所以这是临界点，而非零的平方项使它成为极值点。",
                ),
              ];
        const parts: Step[] =
          c1 !== 0
            ? [
                [
                  ["Read the first derivative", "读出一阶导数"],
                  t("The linear coefficient is the first derivative:", "一次项系数就是一阶导数："),
                  [`${nth(1, a)} = ${c1} \\neq 0`],
                ],
                [
                  ["Conclude", "下结论"],
                  t(
                    `So $x = ${a}$ is not a critical point, and there is no local extremum there.`,
                    `所以 $x = ${a}$ 不是临界点，那里没有局部极值。`,
                  ),
                ],
              ]
            : [
                [["Read the first derivative", "读出一阶导数"], t("There is no linear term, so", "没有一次项，所以"), [`${nth(1, a)} = 0`]],
                [
                  ["Read the second derivative", "读出二阶导数"],
                  t("The square coefficient is half the second derivative:", "平方项系数是二阶导数的一半："),
                  [`${nth(2, a)} = ${product("2", par(Q.of(c2)))} = ${2 * c2} ${c2 > 0 ? "> 0" : "< 0"}`],
                ],
                [
                  ["Apply the second derivative test", "用二阶导数判别法"],
                  t(
                    `So $f$ has a local ${c2 > 0 ? "minimum" : "maximum"} at $x = ${a}$.`,
                    `所以 $f$ 在 $x = ${a}$ 处取得局部${c2 > 0 ? "极小值" : "极大值"}。`,
                  ),
                ],
              ];
        const check =
          c1 !== 0
            ? t(
                `Look at $P_2$ near the center: $P_2(${a} + h) - P_2(${a}) = ${poly([c1, "h"], [c2, "h^{2}"])}$. For small $h$ the term $${poly([c1, "h"])}$ dominates, so the change is positive on one side and negative on the other: no extremum.`,
                `看 $P_2$ 在中心附近的变化：$P_2(${a} + h) - P_2(${a}) = ${poly([c1, "h"], [c2, "h^{2}"])}$。$h$ 很小时 $${poly([c1, "h"])}$ 起主导作用，所以一侧为正、另一侧为负：没有极值。`,
              )
            : t(
                `$P_2$ itself is a parabola opening ${c2 > 0 ? "upward" : "downward"} with vertex $(${a}, ${c0})$, so it is ${c2 > 0 ? "lowest" : "highest"} at $x = ${a}$, as $f$ is near there.`,
                `$P_2$ 本身是开口向${c2 > 0 ? "上" : "下"}、顶点为 $(${a}, ${c0})$ 的抛物线，在 $x = ${a}$ 处${c2 > 0 ? "最低" : "最高"}，$f$ 在附近也是如此。`,
              );
        return explainedChoice(rng, {
          prompt: t(
            `The second-degree Taylor polynomial for $f$ centered at $x = ${a}$ is $P_2(x) = ${p}$. What can you conclude about $f$ at $x = ${a}$?`,
            `$f$ 以 $x = ${a}$ 为中心的二次泰勒多项式为 $P_2(x) = ${p}$。关于 $f$ 在 $x = ${a}$ 处能得出什么结论？`,
          ),
          correct: all[right] as Text,
          wrong: [0, 1, 2].filter((i) => i !== right).map((i) => ({ option: all[i] as Text, why: reasons[i] as Text })),
          solution: walked(parts, check),
        });
      },
    },
    {
      id: "approximating-with-p2",
      title: t("Approximating values with $P_2$", "用 $P_2$ 近似函数值"),
      explanation: t(
        "Near the center, $f(x) \\approx P_2(x)$, usually much better than the linearization. Put the nearby value into the polynomial instead of the function. With $P_2(x) = 4 + 2(x - 1) - 3(x - 1)^{2}$:\n\n$$f(1.1) \\approx 4 + 2(0.1) - 3(0.1)^{2} = 4.17$$\n\nCheck: multiplied out, $P_2(x) = -3x^{2} + 8x - 1$, and $-3(1.21) + 8.8 - 1 = 4.17$ too.\n\n> **Watch out.** Put in the distance $x - a$, here $0.1$, not $x$ itself, and square it in the last term.",
        "在中心附近 $f(x) \\approx P_2(x)$，通常比线性化精确得多。把附近的值代入多项式而不是原函数。对 $P_2(x) = 4 + 2(x - 1) - 3(x - 1)^{2}$：\n\n$$f(1.1) \\approx 4 + 2(0.1) - 3(0.1)^{2} = 4.17$$\n\n检验：展开得 $P_2(x) = -3x^{2} + 8x - 1$，而 $-3(1.21) + 8.8 - 1 = 4.17$，也相同。\n\n> **注意。** 代入的是距离 $x - a$（这里是 $0.1$），而不是 $x$ 本身，最后一项还要把它平方。",
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
        const expanded = poly([c[2], "x^{2}"], [c[1] - 2 * a * c[2], "x"], [c[0] - a * c[1] + a * a * c[2], ""]);
        return worked(
          t(
            `The second-degree Taylor polynomial for $f$ centered at $x = ${a}$ is $P_2(x) = ${p}$. Use it to approximate $f\\left(${x0.toLatex()}\\right)$.`,
            `$f$ 以 $x = ${a}$ 为中心的二次泰勒多项式为 $P_2(x) = ${p}$。用它近似 $f\\left(${x0.toLatex()}\\right)$。`,
          ),
          answer,
          [
            [
              ["Find the distance from the center", "求到中心的距离"],
              t("The powers in $P_2$ are of $x - a$:", "$P_2$ 中是 $x - a$ 的幂："),
              [`x - ${par(Q.of(a))} = ${h.toLatex()}`],
            ],
            [
              ["Substitute", "代入"],
              t("Put this distance into each term:", "把这个距离代入每一项："),
              [
                `f\\left(${x0.toLatex()}\\right) \\approx ${c[0]} + ${par(Q.of(c[1]))}\\left(${h.toLatex()}\\right) + ${par(Q.of(c[2]))}\\left(${h.toLatex()}\\right)^{2} = ${answer.toLatex()}`,
              ],
            ],
          ],
          t(
            `Multiply out first. Expanding gives $P_2(x) = ${expanded}$. Putting in $x = ${x0.toLatex()}$ gives $${answer.toLatex()}$ again.`,
            `先展开。得 $P_2(x) = ${expanded}$。代入 $x = ${x0.toLatex()}$，同样得 $${answer.toLatex()}$。`,
          ),
          [
            slip(linearPart, "This stops at the linearization and leaves out the square term.", "这里只算到线性化，漏掉了平方项。"),
            slip(
              linearPart.add(
                Q.of(2 * c[2])
                  .mul(h)
                  .mul(h),
              ),
              "This doubles the square term. The coefficient in $P_2$ already includes the division by $2$.",
              "这里把平方项乘了 $2$。$P_2$ 中的系数已经除过 $2$ 了。",
            ),
            slip(
              linearPart.sub(Q.of(c[2]).mul(h).mul(h)),
              "This reverses the sign of the square term. A square is never negative, so the term keeps the sign of its coefficient.",
              "这里把平方项的符号弄反了。平方不会是负数，所以这一项的符号与系数相同。",
            ),
          ],
        );
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
  intro: t(
    "For $\\sin x$ at $0$ the derivatives are $0, 1, 0, -1$, so the third-degree Taylor polynomial is\n\n$$P_3(x) = x - \\frac{x^{3}}{6}$$\n\nAt $x = 0.5$ it gives $0.47917$, while $\\sin 0.5 \\approx 0.47943$.\n\nCheck: $P_3'''(x) = -1$, the same as the third derivative of $\\sin x$ at $0$, which is $-\\cos 0 = -1$.\n\nIn this lesson we add a cubic term, so that the polynomial also matches the third derivative at the center.",
    "$\\sin x$ 在 $0$ 处的各阶导数为 $0, 1, 0, -1$，所以三次泰勒多项式为\n\n$$P_3(x) = x - \\frac{x^{3}}{6}$$\n\n在 $x = 0.5$ 处它给出 $0.47917$，而 $\\sin 0.5 \\approx 0.47943$。\n\n检验：$P_3'''(x) = -1$，与 $\\sin x$ 在 $0$ 处的三阶导数 $-\\cos 0 = -1$ 相同。\n\n这节课我们再加一个三次项，使多项式在中心处连三阶导数也相等。",
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
        "Each new term uses the next derivative at the center, divided by the factorial of its order. The third derivative of $(x - a)^{3}$ is $3! = 6$, so\n\n$$P_3(x) = f(a) + f'(a)(x - a) + \\frac{f''(a)}{2!}(x - a)^{2} + \\frac{f'''(a)}{3!}(x - a)^{3}$$\n\nIf $f(0) = 2$, $f'(0) = 1$, $f''(0) = -4$ and $f'''(0) = 12$, then $P_3(x) = 2 + x - 2x^{2} + 2x^{3}$.\n\nCheck: $P_3'''(x) = 2 \\cdot 6 = 12$ and $P_3''(0) = -4$, the given values.\n\n> **Watch out.** Divide the third derivative by $3! = 6$, not by $3$.",
        "每增加一项就用中心处的下一阶导数，除以其阶数的阶乘。$(x - a)^{3}$ 的三阶导数是 $3! = 6$，所以\n\n$$P_3(x) = f(a) + f'(a)(x - a) + \\frac{f''(a)}{2!}(x - a)^{2} + \\frac{f'''(a)}{3!}(x - a)^{3}$$\n\n若 $f(0) = 2$，$f'(0) = 1$，$f''(0) = -4$，$f'''(0) = 12$，则 $P_3(x) = 2 + x - 2x^{2} + 2x^{3}$。\n\n检验：$P_3'''(x) = 2 \\cdot 6 = 12$，$P_3''(0) = -4$，正是已知值。\n\n> **注意。** 三阶导数要除以 $3! = 6$，不是除以 $3$。",
      ),
      generate: (rng) => fromValuesProblem(rng, 3),
    },
    {
      id: "third-degree-taylor-polynomials-of-functions",
      title: t("$P_3$ for a given function", "给定函数的 $P_3$"),
      explanation: t(
        "Differentiate three times, evaluate at the center, and divide each derivative by the factorial of its order. For $f(x) = \\sin(2x)$ at $0$: $f(0) = 0$, $f'(0) = 2$, $f''(0) = 0$, $f'''(0) = -8$, so\n\n$$P_3(x) = 2x - \\frac{8}{6}x^{3} = 2x - \\frac{4}{3}x^{3}$$\n\nCheck: putting $u = 2x$ into $\\sin u = u - \\frac{u^{3}}{6} + \\cdots$ gives $2x - \\frac{8x^{3}}{6}$, the same.\n\n> **Watch out.** A derivative of $0$ at the center gives no term, but the degree still counts it: $P_3$ of $\\sin(2x)$ has no $x^{2}$ term.",
        "求三阶导数并在中心处取值，再把每个导数除以其阶数的阶乘。对 $f(x) = \\sin(2x)$，中心 $0$：$f(0) = 0$，$f'(0) = 2$，$f''(0) = 0$，$f'''(0) = -8$，所以\n\n$$P_3(x) = 2x - \\frac{8}{6}x^{3} = 2x - \\frac{4}{3}x^{3}$$\n\n检验：把 $u = 2x$ 代入 $\\sin u = u - \\frac{u^{3}}{6} + \\cdots$，得 $2x - \\frac{8x^{3}}{6}$，相同。\n\n> **注意。** 中心处导数为 $0$ 就没有对应的项，但次数照样算：$\\sin(2x)$ 的 $P_3$ 没有 $x^{2}$ 项。",
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
  intro: t(
    "For $e^{2x}$ every derivative at $0$ is a power of $2$: $f^{(k)}(0) = 2^{k}$. So the coefficient of $x^{5}$ in its Taylor polynomial is\n\n$$\\frac{f^{(5)}(0)}{5!} = \\frac{32}{120} = \\frac{4}{15}$$\n\nCheck: putting $u = 2x$ into $e^{u} = \\sum \\frac{u^{k}}{k!}$, the term $\\frac{(2x)^{5}}{5!}$ is $\\frac{32}{120}x^{5}$.\n\nIn this lesson we find any coefficient of a Taylor polynomial from the pattern of the derivatives, and any derivative from a coefficient.",
    "对 $e^{2x}$，$0$ 处的每阶导数都是 $2$ 的幂：$f^{(k)}(0) = 2^{k}$。所以它的泰勒多项式中 $x^{5}$ 的系数是\n\n$$\\frac{f^{(5)}(0)}{5!} = \\frac{32}{120} = \\frac{4}{15}$$\n\n检验：把 $u = 2x$ 代入 $e^{u} = \\sum \\frac{u^{k}}{k!}$，项 $\\frac{(2x)^{5}}{5!}$ 就是 $\\frac{32}{120}x^{5}$。\n\n这节课我们根据导数的规律求泰勒多项式的任一系数，也由系数求任一阶导数。",
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
        "The Taylor polynomial of degree $n$ centered at $a$ is\n\n$$P_n(x) = \\sum_{k=0}^{n} \\frac{f^{(k)}(a)}{k!}(x - a)^{k}$$\n\nTo find one coefficient, find the pattern in the derivatives. For $f(x) = \\ln(1 + x)$, $f^{(4)}(x) = -\\frac{6}{(1 + x)^{4}}$, so $f^{(4)}(0) = -6$ and the coefficient of $x^{4}$ is $-\\frac{6}{24} = -\\frac{1}{4}$.\n\nCheck: the known series $\\ln(1 + x) = x - \\frac{x^{2}}{2} + \\frac{x^{3}}{3} - \\frac{x^{4}}{4} + \\cdots$ has the same coefficient.\n\n> **Watch out.** The coefficient is the derivative divided by $k!$, not by $k$.",
        "以 $a$ 为中心的 $n$ 次泰勒多项式为\n\n$$P_n(x) = \\sum_{k=0}^{n} \\frac{f^{(k)}(a)}{k!}(x - a)^{k}$$\n\n要求某一个系数，就找出各阶导数的规律。对 $f(x) = \\ln(1 + x)$，$f^{(4)}(x) = -\\frac{6}{(1 + x)^{4}}$，所以 $f^{(4)}(0) = -6$，$x^{4}$ 的系数是 $-\\frac{6}{24} = -\\frac{1}{4}$。\n\n检验：已知级数 $\\ln(1 + x) = x - \\frac{x^{2}}{2} + \\frac{x^{3}}{3} - \\frac{x^{4}}{4} + \\cdots$ 中的系数相同。\n\n> **注意。** 系数是导数除以 $k!$，不是除以 $k$。",
      ),
      generate(rng) {
        const f = family(rng);
        const m = rng.int(4, 6);
        const d = f.deriv(m);
        const answer = d.div(Q.of(factorial(m)));
        return worked(
          t(
            `Find the coefficient of $x^{${m}}$ in the Taylor polynomial of degree ${m} for $f(x) = ${f.tex}$ centered at $x = 0$.`,
            `求 $f(x) = ${f.tex}$ 以 $x = 0$ 为中心的 ${m} 次泰勒多项式中 $x^{${m}}$ 的系数。`,
          ),
          answer,
          [
            [
              ["Find the derivative at 0", "求 0 处的导数"],
              t(`Follow the pattern of the derivatives up to order ${m}:`, `按导数的规律求到 ${m} 阶：`),
              [`${nth(m, 0)} = ${d.toLatex()}`],
            ],
            [
              ["Divide by the factorial", "除以阶乘"],
              t(`The coefficient of $x^{${m}}$ is this derivative over $${m}!$:`, `$x^{${m}}$ 的系数是这个导数除以 $${m}!$：`),
              [`\\frac{${nth(m, 0)}}{${m}!} = \\frac{${d.toLatex()}}{${factorial(m)}} = ${answer.toLatex()}`],
            ],
          ],
          knownCoefficient(f, m, answer),
          [
            slip(
              d,
              `This is the derivative $${nth(m, 0)}$ itself. It must be divided by $${m}!$.`,
              `这是导数 $${nth(m, 0)}$ 本身。还要除以 $${m}!$。`,
            ),
            slip(
              d.div(Q.of(factorial(m - 1))),
              `This divides by $${m - 1}!$, the factorial one order too low.`,
              `这里除以了 $${m - 1}!$，阶乘少了一阶。`,
            ),
            slip(
              d.div(Q.of(m)),
              `This divides by $${m}$ instead of $${m}! = ${factorial(m)}$.`,
              `这里除以的是 $${m}$，而不是 $${m}! = ${factorial(m)}$。`,
            ),
          ],
        );
      },
    },
    {
      id: "derivatives-from-taylor-coefficients",
      title: t("Derivatives from coefficients", "由系数求导数"),
      explanation: t(
        "Read the formula backwards: if $c_k$ is the coefficient of $(x - a)^{k}$, then\n\n$$f^{(k)}(a) = k! \\, c_k$$\n\nIf $P_5(x) = 1 - x + 3x^{4} + 2x^{5}$ is centered at $0$, then $f^{(4)}(0) = 4! \\cdot 3 = 72$.\n\nCheck: differentiating $3x^{4}$ four times gives $3 \\cdot 24 = 72$; the lower terms vanish, and $2x^{5}$ leaves $240x$, which is $0$ at $x = 0$.\n\n> **Watch out.** Multiply by $k!$; dividing would give the coefficient of a coefficient.",
        "把公式反过来用：若 $c_k$ 是 $(x - a)^{k}$ 的系数，则\n\n$$f^{(k)}(a) = k! \\, c_k$$\n\n若以 $0$ 为中心的 $P_5(x) = 1 - x + 3x^{4} + 2x^{5}$，则 $f^{(4)}(0) = 4! \\cdot 3 = 72$。\n\n检验：$3x^{4}$ 求四阶导数得 $3 \\cdot 24 = 72$；低次项都变成 $0$，而 $2x^{5}$ 剩下 $240x$，在 $x = 0$ 处为 $0$。\n\n> **注意。** 要乘以 $k!$；如果除以 $k!$，得到的就不是导数了。",
      ),
      generate(rng) {
        const a = rng.int(-2, 2);
        const m = rng.int(2, 5);
        const cs = Array.from({ length: 6 }, (_, i) => (i === m ? Q.of(rng.nonZero(-9, 9), rng.pick([1, 1, 2, 3])) : Q.of(rng.int(-9, 9))));
        const c = cs[m] as Q;
        const answer = c.mul(Q.of(factorial(m)));
        return worked(
          t(
            `The Taylor polynomial of degree 5 for $f$ centered at $x = ${a}$ is $P_5(x) = ${taylorPoly(cs, a)}$. Find $${nth(m, a)}$.`,
            `$f$ 以 $x = ${a}$ 为中心的 5 次泰勒多项式为 $P_5(x) = ${taylorPoly(cs, a)}$。求 $${nth(m, a)}$。`,
          ),
          answer,
          [
            [
              ["Match the coefficient", "对应系数"],
              t(
                `The coefficient of $${around(a, m)}$ is the derivative of order ${m} over $${m}!$:`,
                `$${around(a, m)}$ 的系数是 ${m} 阶导数除以 $${m}!$：`,
              ),
              [`\\frac{${nth(m, a)}}{${m}!} = ${c.toLatex()}`],
            ],
            [
              ["Multiply by the factorial", "乘以阶乘"],
              t("Solve for the derivative:", "解出导数："),
              [`${nth(m, a)} = ${product(`${m}!`, par(c))} = ${answer.toLatex()}`],
            ],
          ],
          t(
            `Differentiate term by term instead. Differentiating ${m} times turns $${c.toLatex()}${around(a, m)}$ into the constant $${product(par(c), `${factorial(m)}`)} = ${answer.toLatex()}$. Lower powers vanish, and higher powers keep a factor $${around(a, 1)}$, which is $0$ at $x = ${a}$.`,
            `改为逐项求导。求 ${m} 阶导数后，$${c.toLatex()}${around(a, m)}$ 变成常数 $${product(par(c), `${factorial(m)}`)} = ${answer.toLatex()}$。低次项都变成 $0$，高次项仍含因子 $${around(a, 1)}$，在 $x = ${a}$ 处为 $0$。`,
          ),
          [
            slip(
              c,
              "This is the coefficient itself. The derivative is the coefficient times the factorial.",
              "这是系数本身。导数等于系数乘以阶乘。",
            ),
            slip(
              c.mul(Q.of(m)),
              `This multiplies by $${m}$ instead of $${m}! = ${factorial(m)}$.`,
              `这里乘的是 $${m}$，而不是 $${m}! = ${factorial(m)}$。`,
            ),
            slip(
              c.div(Q.of(factorial(m))),
              "This divides by the factorial. The coefficient is already the derivative divided by it, so multiply.",
              "这里除以了阶乘。系数已经是导数除以阶乘，所以应当乘。",
            ),
          ],
        );
      },
    },
  ],
};

/** steps are distances |x − a| with simple powers. */
const steps = [Q.of(1, 2), Q.of(1, 3), Q.of(1, 5), Q.of(1, 10), Q.one, Q.of(2)] as const;

/** powerOf writes hᵉ for a distance h, with parentheses around a fraction. */
const powerOf = (h: Q, e: number) => (h.eq(Q.one) ? "1" : h.isInteger() ? `${h.toLatex()}^{${e}}` : `\\left(${h.toLatex()}\\right)^{${e}}`);

/** lagrangeLine writes |Rₙ| ≤ M·hⁿ⁺¹/(n + 1)! = answer. */
const lagrangeLine = (n: number, M: number, h: Q, answer: Q) =>
  `|R_{${n}}| \\le \\frac{M \\, |x - a|^{${n + 1}}}{${n + 1}!} = \\frac{${product(`${M}`, powerOf(h, n + 1))}}{${n + 1}!} = ${answer.toLatex()}`;

/** theLagrangeErrorBound bounds the error of a Taylor polynomial. */
export const theLagrangeErrorBound: TopicDef = {
  id: "the-lagrange-error-bound",
  title: t("The Lagrange Error Bound", "拉格朗日误差界"),
  summary: t(
    "If |f⁽ⁿ⁺¹⁾| ≤ M between a and x, then |f(x) − Pₙ(x)| ≤ M|x − a|ⁿ⁺¹/(n + 1)!.",
    "若在 a 与 x 之间 |f⁽ⁿ⁺¹⁾| ≤ M，则 |f(x) − Pₙ(x)| ≤ M|x − a|ⁿ⁺¹/(n + 1)!。",
  ),
  intro: t(
    "The tangent line $P_1(x) = 1 + x$ approximates $e^{x}$ near $0$. Between $0$ and $0.1$ the second derivative $e^{x}$ stays below $1.2$, so at $x = 0.1$\n\n$$|R_1| \\le \\frac{1.2 \\cdot (0.1)^{2}}{2!} = 0.006$$\n\nCheck: the actual error is $e^{0.1} - 1.1 \\approx 0.00517$, indeed below $0.006$.\n\nIn this lesson we bound the error of a Taylor polynomial by a bound on the next derivative.",
    "切线 $P_1(x) = 1 + x$ 在 $0$ 附近近似 $e^{x}$。在 $0$ 与 $0.1$ 之间，二阶导数 $e^{x}$ 小于 $1.2$，所以在 $x = 0.1$ 处\n\n$$|R_1| \\le \\frac{1.2 \\cdot (0.1)^{2}}{2!} = 0.006$$\n\n检验：实际误差为 $e^{0.1} - 1.1 \\approx 0.00517$，确实小于 $0.006$。\n\n这节课我们用下一阶导数的界来估计泰勒多项式的误差。",
  ),
  prerequisites: ["higher-degree-taylor-polynomials"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "applying-the-lagrange-error-bound",
      title: t("Applying the Lagrange error bound", "应用拉格朗日误差界"),
      explanation: t(
        "The error $R_n(x) = f(x) - P_n(x)$ equals $\\frac{f^{(n+1)}(z)}{(n + 1)!}(x - a)^{n+1}$ for some $z$ between $a$ and $x$. So if $|f^{(n+1)}| \\le M$ there,\n\n$$|R_n(x)| \\le \\frac{M \\, |x - a|^{n+1}}{(n + 1)!}$$\n\nWith $n = 3$, $M = 6$ and $|x - a| = \\frac{1}{2}$: $|R_3| \\le \\frac{6 \\cdot (1/2)^{4}}{4!} = \\frac{1}{64}$.\n\nCheck: $f(x) = \\frac{(x - a)^{4}}{4}$ has $f^{(4)} = 6$ and $P_3 = 0$, so its error at distance $\\frac{1}{2}$ is exactly $\\frac{1}{4} \\cdot \\frac{1}{16} = \\frac{1}{64}$: the bound can be reached.\n\n> **Watch out.** For $P_n$ the bound uses the derivative of order $n + 1$, the power $n + 1$ and the factorial $(n + 1)!$.",
        "误差 $R_n(x) = f(x) - P_n(x)$ 等于 $\\frac{f^{(n+1)}(z)}{(n + 1)!}(x - a)^{n+1}$，其中 $z$ 介于 $a$ 与 $x$ 之间。所以若在该区间上 $|f^{(n+1)}| \\le M$，则\n\n$$|R_n(x)| \\le \\frac{M \\, |x - a|^{n+1}}{(n + 1)!}$$\n\n当 $n = 3$，$M = 6$，$|x - a| = \\frac{1}{2}$ 时：$|R_3| \\le \\frac{6 \\cdot (1/2)^{4}}{4!} = \\frac{1}{64}$。\n\n检验：$f(x) = \\frac{(x - a)^{4}}{4}$ 满足 $f^{(4)} = 6$ 且 $P_3 = 0$，所以它在距离 $\\frac{1}{2}$ 处的误差恰为 $\\frac{1}{4} \\cdot \\frac{1}{16} = \\frac{1}{64}$：这个界是可以达到的。\n\n> **注意。** 对 $P_n$，误差界用的是 $n + 1$ 阶导数、$n + 1$ 次幂和 $(n + 1)!$。",
      ),
      generate(rng) {
        const n = rng.int(1, 4);
        const M = rng.int(1, 12);
        const a = rng.int(-3, 3);
        const h = rng.pick(
          steps.filter(
            (s) =>
              !Q.of(M)
                .mul(qpow(s, n + 1))
                .div(Q.of(factorial(n + 1)))
                .toLatex()
                .includes("{,}"),
          ),
        );
        const x = Q.of(a).add(h);
        const answer = Q.of(M)
          .mul(qpow(h, n + 1))
          .div(Q.of(factorial(n + 1)));
        const coef = Q.of(M, factorial(n + 1));
        return worked(
          t(
            `Suppose $\\left|${nth(n + 1, "x")}\\right| \\le ${M}$ for all $x$ between $${a}$ and $${x.toLatex()}$, and $P_{${n}}$ is the Taylor polynomial of degree ${n} for $f$ centered at $x = ${a}$. Use the Lagrange error bound to find an upper bound for $\\left|f\\left(${x.toLatex()}\\right) - P_{${n}}\\left(${x.toLatex()}\\right)\\right|$.`,
            `设对 $${a}$ 与 $${x.toLatex()}$ 之间的所有 $x$ 有 $\\left|${nth(n + 1, "x")}\\right| \\le ${M}$，$P_{${n}}$ 是 $f$ 以 $x = ${a}$ 为中心的 ${n} 次泰勒多项式。用拉格朗日误差界求 $\\left|f\\left(${x.toLatex()}\\right) - P_{${n}}\\left(${x.toLatex()}\\right)\\right|$ 的一个上界。`,
          ),
          answer,
          [
            [
              ["Identify the pieces", "确定各个量"],
              t(
                `The polynomial has degree $n = ${n}$, the derivative of order $${n + 1}$ is bounded by $M = ${M}$, and the distance from the center is`,
                `多项式的次数 $n = ${n}$，$${n + 1}$ 阶导数的界 $M = ${M}$，到中心的距离为`,
              ),
              [`|x - a| = \\left|${x.toLatex()} - ${par(Q.of(a))}\\right| = ${h.toLatex()}`],
            ],
            [
              ["Apply the bound", "代入误差界"],
              t("Put these into the Lagrange error bound:", "代入拉格朗日误差界："),
              [lagrangeLine(n, M, h, answer)],
            ],
          ],
          t(
            `The bound can be reached, which confirms its size. The function $f(x) = ${coef.toLatex()}${around(a, n + 1)}$ has derivative of order $${n + 1}$ equal to $${M}$, and its Taylor polynomial $P_{${n}}$ is $0$. So its error at $x = ${x.toLatex()}$ is exactly $${answer.toLatex()}$.`,
            `这个界是可以达到的，这印证了它的大小。函数 $f(x) = ${coef.toLatex()}${around(a, n + 1)}$ 的 $${n + 1}$ 阶导数恰为 $${M}$，而它的泰勒多项式 $P_{${n}}$ 是 $0$。所以它在 $x = ${x.toLatex()}$ 处的误差恰为 $${answer.toLatex()}$。`,
          ),
          [
            slip(
              Q.of(M)
                .mul(qpow(h, n))
                .div(Q.of(factorial(n))),
              `This uses the power $${n}$ and $${n}!$. The error of $P_{${n}}$ needs the next order: power $${n + 1}$ and $${n + 1}!$.`,
              `这里用了 $${n}$ 次幂和 $${n}!$。$P_{${n}}$ 的误差要用下一阶：$${n + 1}$ 次幂和 $${n + 1}!$。`,
            ),
            slip(
              Q.of(M)
                .mul(qpow(h, n + 1))
                .div(Q.of(factorial(n))),
              `This divides by $${n}!$ instead of $${n + 1}!$.`,
              `这里除以的是 $${n}!$，而不是 $${n + 1}!$。`,
            ),
            slip(Q.of(M).mul(qpow(h, n + 1)), `This forgets to divide by $${n + 1}!$.`, `这里忘了除以 $${n + 1}!$。`),
          ],
        );
      },
    },
    {
      id: "lagrange-error-bound-for-sine-and-cosine",
      title: t("Error bounds for sine and cosine", "正弦与余弦的误差界"),
      explanation: t(
        "Every derivative of $\\sin(kx)$ or $\\cos(kx)$ is $\\pm k^{m}$ times a sine or cosine, so everywhere\n\n$$|f^{(n+1)}(x)| \\le |k|^{n+1}$$\n\nand $M = |k|^{n+1}$ works. For $\\cos x$ and $P_4$ at $x = \\frac{1}{2}$: $|R_4| \\le \\frac{(1/2)^{5}}{5!} = \\frac{1}{3840} \\approx 0.00026$.\n\nCheck: $P_4(0.5) = 1 - \\frac{1}{8} + \\frac{1}{384} \\approx 0.877604$ and $\\cos 0.5 \\approx 0.877583$, an actual error of about $0.00002$.\n\n> **Watch out.** For $\\sin(kx)$ the bound is $|k|^{n+1}$, not $1$: each derivative brings out another factor $k$.",
        "$\\sin(kx)$ 或 $\\cos(kx)$ 的各阶导数都是 $\\pm k^{m}$ 乘以正弦或余弦，所以处处有\n\n$$|f^{(n+1)}(x)| \\le |k|^{n+1}$$\n\n可取 $M = |k|^{n+1}$。对 $\\cos x$，$P_4$ 在 $x = \\frac{1}{2}$ 处：$|R_4| \\le \\frac{(1/2)^{5}}{5!} = \\frac{1}{3840} \\approx 0.00026$。\n\n检验：$P_4(0.5) = 1 - \\frac{1}{8} + \\frac{1}{384} \\approx 0.877604$，而 $\\cos 0.5 \\approx 0.877583$，实际误差约为 $0.00002$。\n\n> **注意。** 对 $\\sin(kx)$，界是 $|k|^{n+1}$ 而不是 $1$：每求一次导数就多出一个因子 $k$。",
      ),
      generate(rng) {
        const k = rng.int(1, 3);
        const n = rng.int(2, 5);
        const h = rng.pick(
          steps.slice(0, 5).filter(
            (s) =>
              !Q.of(k ** (n + 1))
                .mul(qpow(s, n + 1))
                .div(Q.of(factorial(n + 1)))
                .toLatex()
                .includes("{,}"),
          ),
        );
        const sine = rng.bool();
        const f = `\\${sine ? "sin" : "cos"}(${poly([k, "x"])})`;
        const M = k ** (n + 1);
        const answer = Q.of(M)
          .mul(qpow(h, n + 1))
          .div(Q.of(factorial(n + 1)));
        const x = h.toNumber();
        let approx = 0;
        for (let i = 0; i <= n; i++) {
          if (sine && i % 2 === 1) approx += (((i - 1) % 4 === 0 ? 1 : -1) * (k * x) ** i) / factorial(i);
          if (!sine && i % 2 === 0) approx += ((i % 4 === 0 ? 1 : -1) * (k * x) ** i) / factorial(i);
        }
        const actual = Math.abs((sine ? Math.sin(k * x) : Math.cos(k * x)) - approx);
        return worked(
          t(
            `Let $P_{${n}}$ be the Taylor polynomial of degree ${n} for $f(x) = ${f}$ centered at $x = 0$. Use the Lagrange error bound to find an upper bound for $\\left|f\\left(${h.toLatex()}\\right) - P_{${n}}\\left(${h.toLatex()}\\right)\\right|$.`,
            `设 $P_{${n}}$ 是 $f(x) = ${f}$ 以 $x = 0$ 为中心的 ${n} 次泰勒多项式。用拉格朗日误差界求 $\\left|f\\left(${h.toLatex()}\\right) - P_{${n}}\\left(${h.toLatex()}\\right)\\right|$ 的一个上界。`,
          ),
          answer,
          [
            [
              ["Bound the next derivative", "估计下一阶导数"],
              t(
                `Each derivative brings out a factor $${k}$ and leaves a sine or cosine, whose size is at most $1$:`,
                `每求一次导数就多出因子 $${k}$，剩下的正弦或余弦大小不超过 $1$：`,
              ),
              [k === 1 ? `|${nth(n + 1, "x")}| \\le 1 = M` : `|${nth(n + 1, "x")}| \\le ${k}^{${n + 1}} = ${M} = M`],
            ],
            [
              ["Apply the bound", "代入误差界"],
              t(`The distance from the center is $${h.toLatex()}$, so`, `到中心的距离是 $${h.toLatex()}$，所以`),
              [lagrangeLine(n, M, h, answer)],
            ],
          ],
          t(
            `Compute the actual error. The polynomial gives $P_{${n}}\\left(${h.toLatex()}\\right) \\approx ${dec(approx, 7)}$, and $f\\left(${h.toLatex()}\\right) \\approx ${dec(sine ? Math.sin(k * x) : Math.cos(k * x), 7)}$. The actual error, about $${small(actual)}$, is indeed at most the bound $${answer.toLatex()} \\approx ${small(answer.toNumber())}$.`,
            `计算实际误差。多项式给出 $P_{${n}}\\left(${h.toLatex()}\\right) \\approx ${dec(approx, 7)}$，而 $f\\left(${h.toLatex()}\\right) \\approx ${dec(sine ? Math.sin(k * x) : Math.cos(k * x), 7)}$。实际误差约为 $${small(actual)}$，确实不超过误差界 $${answer.toLatex()} \\approx ${small(answer.toNumber())}$。`,
          ),
          [
            slip(
              qpow(h, n + 1).div(Q.of(factorial(n + 1))),
              `This takes $M = 1$. Each derivative brings out a factor $${k}$, so $M = ${k}^{${n + 1}}$.`,
              `这里取了 $M = 1$。每求一次导数就多出因子 $${k}$，所以 $M = ${k}^{${n + 1}}$。`,
            ),
            slip(
              Q.of(M)
                .mul(qpow(h, n))
                .div(Q.of(factorial(n))),
              `This uses the power $${n}$ and $${n}!$. The error of $P_{${n}}$ needs power $${n + 1}$ and $${n + 1}!$.`,
              `这里用了 $${n}$ 次幂和 $${n}!$。$P_{${n}}$ 的误差要用 $${n + 1}$ 次幂和 $${n + 1}!$。`,
            ),
            slip(qpow(h, n + 1), `This leaves out both $M$ and the division by $${n + 1}!$.`, `这里既漏了 $M$，也漏了除以 $${n + 1}!$。`),
          ],
        );
      },
    },
  ],
};

/** sigma writes the sum of a body from n = k to ∞. */
const sigma = (body: string, k = 0) => `\\sum_{n=${k}}^{\\infty} ${body}`;

/** rootN writes (ⁿ√n)ᵖ. */
const rootN = (p: number) => (p === 1 ? "\\sqrt[n]{n}" : `\\left(\\sqrt[n]{n}\\right)^{${p}}`);

/** ratioPow writes ((n + 1)/n)ᵖ or (n/(n + 1))ᵖ, the factor a power of n contributes to the ratio. */
const ratioPow = (p: number, up: boolean) => {
  const f = up ? "\\frac{n + 1}{n}" : "\\frac{n}{n + 1}";
  return p === 1 ? `${f} \\cdot ` : `\\left(${f}\\right)^{${p}} `;
};

/** RadiusCase is a power series centered at 0 with a finite radius, its ratio, the ratio's limit and a check by another route. */
interface RadiusCase {
  readonly series: string;
  readonly R: Q;
  readonly ratio: string;
  readonly limit: string;
  readonly check: Text;
}

/** radiusCase picks a power series centered at 0 with a finite radius. */
function radiusCase(rng: Rng): RadiusCase {
  const k = rng.int(2, 9);
  const kind = rng.int(0, 2);
  if (kind === 0) {
    const p = rng.int(0, 3);
    const np = p === 0 ? "" : p === 1 ? "n " : `n^{${p}} `;
    const limit = `\\frac{|x|}{${k}}`;
    return {
      series: sigma(`\\frac{${np}x^{n}}{${k}^{n}}`, 1),
      R: Q.of(k),
      ratio: `${p === 0 ? "" : ratioPow(p, true)}${limit}`,
      limit,
      check:
        p === 0
          ? t(
              `This is a geometric series with ratio $\\frac{x}{${k}}$. It converges exactly when $\\left|\\frac{x}{${k}}\\right| < 1$, that is $|x| < ${k}$.`,
              `这是公比为 $\\frac{x}{${k}}$ 的等比级数。它恰在 $\\left|\\frac{x}{${k}}\\right| < 1$ 即 $|x| < ${k}$ 时收敛。`,
            )
          : t(
              `Use the root test instead, which looks at one term rather than two. Since $\\sqrt[n]{n} \\to 1$, it gives the same limit:\n\n$$\\sqrt[n]{|a_n|} = \\frac{${rootN(p)} \\, |x|}{${k}} \\to \\frac{|x|}{${k}}$$\n\nSo again the series converges for $|x| < ${k}$.`,
              `改用根值判别法，它只看一项而不是相邻两项。由于 $\\sqrt[n]{n} \\to 1$，它给出同一个极限：\n\n$$\\sqrt[n]{|a_n|} = \\frac{${rootN(p)} \\, |x|}{${k}} \\to \\frac{|x|}{${k}}$$\n\n所以同样在 $|x| < ${k}$ 时收敛。`,
            ),
    };
  }
  if (kind === 1) {
    const p = rng.int(1, 3);
    const np = p === 1 ? "n" : `n^{${p}}`;
    const limit = `${k}|x|`;
    return {
      series: sigma(`\\frac{${k}^{n} x^{n}}{${np}}`, 1),
      R: Q.of(1, k),
      ratio: `${ratioPow(p, false)}${limit}`,
      limit,
      check: t(
        `Use the root test instead, which looks at one term rather than two. Since $\\sqrt[n]{n} \\to 1$, it gives the same limit:\n\n$$\\sqrt[n]{|a_n|} = \\frac{${k}|x|}{${rootN(p)}} \\to ${k}|x|$$\n\nSo again the series converges for $|x| < \\frac{1}{${k}}$.`,
        `改用根值判别法，它只看一项而不是相邻两项。由于 $\\sqrt[n]{n} \\to 1$，它给出同一个极限：\n\n$$\\sqrt[n]{|a_n|} = \\frac{${k}|x|}{${rootN(p)}} \\to ${k}|x|$$\n\n所以同样在 $|x| < \\frac{1}{${k}}$ 时收敛。`,
      ),
    };
  }
  const m = rng.int(2, 9);
  if (m === k) return radiusCase(rng);
  const R = Q.of(k, m);
  const limit = `\\frac{${m}|x|}{${k}}`;
  return {
    series: sigma(`\\frac{${m}^{n} x^{n}}{${k}^{n}}`),
    R,
    ratio: limit,
    limit,
    check: t(
      `This is a geometric series with ratio $\\frac{${m}x}{${k}}$. It converges exactly when $\\left|\\frac{${m}x}{${k}}\\right| < 1$, that is $|x| < ${R.toLatex()}$.`,
      `这是公比为 $\\frac{${m}x}{${k}}$ 的等比级数。它恰在 $\\left|\\frac{${m}x}{${k}}\\right| < 1$ 即 $|x| < ${R.toLatex()}$ 时收敛。`,
    ),
  };
}

/** radiusSteps applies the ratio test to a radius case. */
const radiusSteps = (c: RadiusCase): Step[] => [
  [
    ["Form the ratio", "写出比值"],
    t("Hold $x$ fixed and divide consecutive terms:", "固定 $x$，用相邻两项相除："),
    [`\\left|\\frac{a_{n+1}}{a_n}\\right| = ${c.ratio}`],
  ],
  [["Take the limit", "求极限"], t("As $n \\to \\infty$ the ratio tends to", "当 $n \\to \\infty$ 时，比值趋于"), [`L = ${c.limit}`]],
  [
    ["Solve for the radius", "解出半径"],
    t("The series converges when $L < 1$:", "$L < 1$ 时级数收敛："),
    [`${c.limit} < 1 \\iff |x| < ${c.R.toLatex()}`, `R = ${c.R.toLatex()}`],
  ],
];

/** extents are the three ways a power series can converge. */
const extents = [
  t("It converges only at $x = 0$ ($R = 0$).", "只在 $x = 0$ 处收敛（$R = 0$）。"),
  t("It converges for every $x$ ($R = \\infty$).", "对所有 $x$ 都收敛（$R = \\infty$）。"),
  t("It converges for $|x| < R$ for some finite $R > 0$.", "存在有限的 $R > 0$，使它在 $|x| < R$ 时收敛。"),
] as const;

/** radiusOfConvergenceOfPowerSeriesCenteredAtTheOrigin applies the ratio test to Σ cₙxⁿ. */
export const radiusOfConvergenceOfPowerSeriesCenteredAtTheOrigin: TopicDef = {
  id: "radius-of-convergence-of-power-series-centered-at-the-origin",
  title: t("Radius of Convergence of Power Series Centered at the Origin", "以原点为中心的幂级数的收敛半径"),
  summary: t(
    "A power series Σ cₙxⁿ converges for |x| < R and diverges for |x| > R; the ratio test finds R, which may be 0 or ∞.",
    "幂级数 Σ cₙxⁿ 在 |x| < R 时收敛，在 |x| > R 时发散；用比值判别法求 R，R 也可能是 0 或 ∞。",
  ),
  intro: t(
    "Does $\\sum \\frac{x^{n}}{3^{n}}$ converge? It depends on $x$. With $x$ fixed, the ratio of consecutive terms is\n\n$$\\left|\\frac{a_{n+1}}{a_n}\\right| = \\frac{|x|}{3}$$\n\nso by the ratio test it converges for $|x| < 3$ and diverges for $|x| > 3$. The number $3$ is its radius of convergence.\n\nCheck: it is a geometric series with ratio $\\frac{x}{3}$, which converges exactly when $\\left|\\frac{x}{3}\\right| < 1$.\n\nIn this lesson we find the radius of convergence of a power series centered at $0$, which may also be $0$ or $\\infty$.",
    "$\\sum \\frac{x^{n}}{3^{n}}$ 收敛吗？这取决于 $x$。固定 $x$，相邻两项之比为\n\n$$\\left|\\frac{a_{n+1}}{a_n}\\right| = \\frac{|x|}{3}$$\n\n所以由比值判别法，它在 $|x| < 3$ 时收敛，在 $|x| > 3$ 时发散。数 $3$ 就是它的收敛半径。\n\n检验：它是公比为 $\\frac{x}{3}$ 的等比级数，恰在 $\\left|\\frac{x}{3}\\right| < 1$ 时收敛。\n\n这节课我们求以 $0$ 为中心的幂级数的收敛半径，它也可能是 $0$ 或 $\\infty$。",
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
        "A **power series** $\\sum c_n x^{n}$ is a series whose terms depend on $x$. Apply the ratio test with $x$ held fixed. If the ratio tends to $L|x|$, the series converges when $L|x| < 1$, so the **radius of convergence** is\n\n$$R = \\frac{1}{L}$$\n\nFor $\\sum \\frac{n x^{n}}{4^{n}}$: $\\frac{n + 1}{n} \\cdot \\frac{|x|}{4} \\to \\frac{|x|}{4}$, so $R = 4$.\n\nCheck: the root test gives $\\frac{\\sqrt[n]{n} \\, |x|}{4} \\to \\frac{|x|}{4}$ as well, so again $R = 4$.\n\n> **Watch out.** $R$ is the reciprocal of $L$: a limit of $\\frac{|x|}{4}$ gives $R = 4$, not $\\frac{1}{4}$.",
        "**幂级数** $\\sum c_n x^{n}$ 是各项依赖于 $x$ 的级数。固定 $x$ 用比值判别法。若比值趋于 $L|x|$，则 $L|x| < 1$ 时级数收敛，所以**收敛半径**为\n\n$$R = \\frac{1}{L}$$\n\n对 $\\sum \\frac{n x^{n}}{4^{n}}$：$\\frac{n + 1}{n} \\cdot \\frac{|x|}{4} \\to \\frac{|x|}{4}$，所以 $R = 4$。\n\n检验：根值判别法同样给出 $\\frac{\\sqrt[n]{n} \\, |x|}{4} \\to \\frac{|x|}{4}$，所以仍是 $R = 4$。\n\n> **注意。** $R$ 是 $L$ 的倒数：极限为 $\\frac{|x|}{4}$ 时 $R = 4$，不是 $\\frac{1}{4}$。",
      ),
      generate(rng) {
        const c = radiusCase(rng);
        return worked(
          t(`Find the radius of convergence of $${c.series}$.`, `求 $${c.series}$ 的收敛半径。`),
          c.R,
          radiusSteps(c),
          c.check,
          [
            slip(
              Q.one.div(c.R),
              "This is $L$, the coefficient of $|x|$ in the limit. The radius is its reciprocal.",
              "这是 $L$，即极限中 $|x|$ 的系数。半径是它的倒数。",
            ),
            slip(
              1,
              "The radius is not the $1$ in $L|x| < 1$; solve that inequality for $|x|$.",
              "半径不是 $L|x| < 1$ 中的 $1$；要从这个不等式解出 $|x|$。",
            ),
            slip(
              c.R.mul(Q.of(2)),
              "This is the width of the interval of convergence, $2R$. The radius is half of it.",
              "这是收敛区间的长度 $2R$。半径是它的一半。",
            ),
          ],
        );
      },
    },
    {
      id: "zero-finite-or-infinite-radius",
      title: t("Zero, finite or infinite radius", "收敛半径为零、有限或无穷"),
      explanation: t(
        "If the ratio limit is $0$ for every $x$, the series converges for every $x$ and $R = \\infty$. For $\\sum \\frac{x^{n}}{n!}$:\n\n$$\\left|\\frac{a_{n+1}}{a_n}\\right| = \\frac{|x|}{n + 1} \\to 0$$\n\nIf instead the limit is $\\infty$ for every $x \\neq 0$, as for $\\sum n! \\, x^{n}$ where $(n + 1)|x| \\to \\infty$, the series converges only at $0$ and $R = 0$.\n\nCheck: $\\sum \\frac{x^{n}}{n!}$ is the series of $e^{x}$, defined for every $x$; and the terms $n! \\, x^{n}$ grow for any $x \\neq 0$, so that series diverges by the $n$th term test.\n\n> **Watch out.** A factorial in the denominator gives $R = \\infty$, and one in the numerator gives $R = 0$; do not mix them up.",
        "若对每个 $x$ 比值的极限都是 $0$，级数对所有 $x$ 收敛，$R = \\infty$。对 $\\sum \\frac{x^{n}}{n!}$：\n\n$$\\left|\\frac{a_{n+1}}{a_n}\\right| = \\frac{|x|}{n + 1} \\to 0$$\n\n若对每个 $x \\neq 0$ 极限都是 $\\infty$，例如 $\\sum n! \\, x^{n}$ 中 $(n + 1)|x| \\to \\infty$，级数只在 $0$ 处收敛，$R = 0$。\n\n检验：$\\sum \\frac{x^{n}}{n!}$ 是 $e^{x}$ 的级数，对每个 $x$ 都有定义；而对任何 $x \\neq 0$，$n! \\, x^{n}$ 越来越大，所以那个级数由第 $n$ 项判别法发散。\n\n> **注意。** 阶乘在分母上得 $R = \\infty$，在分子上得 $R = 0$；不要弄反。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const k = rng.int(1, 9);
        const prompt = (series: string) => t(`How does $${series}$ converge?`, `$${series}$ 的收敛情况如何？`);
        if (kind === 2) {
          const c = radiusCase(rng);
          return explainedChoice(rng, {
            prompt: prompt(c.series),
            correct: extents[2],
            wrong: [
              {
                option: extents[0],
                why: t(
                  `For $|x| < ${c.R.toLatex()}$ the ratio limit is below $1$, so it converges at more points than $0$.`,
                  `当 $|x| < ${c.R.toLatex()}$ 时比值的极限小于 $1$，所以它不只在 $0$ 处收敛。`,
                ),
              },
              {
                option: extents[1],
                why: t(
                  `For $|x| > ${c.R.toLatex()}$ the ratio limit is above $1$, so it diverges there.`,
                  `当 $|x| > ${c.R.toLatex()}$ 时比值的极限大于 $1$，所以在那里发散。`,
                ),
              },
            ],
            solution: walked(radiusSteps(c), c.check),
          });
        }
        const kn = k === 1 ? "" : `${k}^{n} `;
        const kx = k === 1 ? "|x|" : `${k}|x|`;
        if (kind === 0) {
          const series = sigma(`\\frac{${kn}x^{n}}{n!}`);
          return explainedChoice(rng, {
            prompt: prompt(series),
            correct: extents[1],
            wrong: [
              {
                option: extents[0],
                why: t(
                  "The ratio limit is $0$ for every $x$, not $\\infty$, so it converges everywhere.",
                  "对每个 $x$ 比值的极限都是 $0$ 而不是 $\\infty$，所以处处收敛。",
                ),
              },
              {
                option: extents[2],
                why: t(
                  "A finite radius needs a limit of the form $L|x|$ with $L > 0$. Here the factorial makes the limit $0$ whatever $x$ is.",
                  "有限的半径要求极限形如 $L|x|$ 且 $L > 0$。这里阶乘使极限无论 $x$ 是多少都是 $0$。",
                ),
              },
            ],
            solution: walked(
              [
                [
                  ["Form the ratio", "写出比值"],
                  t("Hold $x$ fixed and divide consecutive terms:", "固定 $x$，用相邻两项相除："),
                  [`\\left|\\frac{a_{n+1}}{a_n}\\right| = \\frac{${kx}}{n + 1}`],
                ],
                [
                  ["Take the limit", "求极限"],
                  t("For every fixed $x$ the denominator grows without bound:", "对每个固定的 $x$，分母无限增大："),
                  ["L = 0 < 1"],
                ],
                [
                  ["Conclude", "下结论"],
                  t("So the series converges for every $x$, and $R = \\infty$.", "所以级数对所有 $x$ 收敛，$R = \\infty$。"),
                ],
              ],
              t(
                `Compare with a known series. Putting $u = ${poly([k, "x"])}$ into the series $\\sum \\frac{u^{n}}{n!}$ of $e^{u}$ gives this series, and $e^{${poly([k, "x"])}}$ is defined for every $x$.`,
                `与已知级数对照。把 $u = ${poly([k, "x"])}$ 代入 $e^{u}$ 的级数 $\\sum \\frac{u^{n}}{n!}$ 就得到这个级数，而 $e^{${poly([k, "x"])}}$ 对每个 $x$ 都有定义。`,
              ),
            ),
          });
        }
        const series = sigma(k === 1 ? "n! \\, x^{n}" : `\\frac{n! \\, x^{n}}{${k}^{n}}`);
        const ratio = k === 1 ? "(n + 1)|x|" : `\\frac{(n + 1)|x|}{${k}}`;
        return explainedChoice(rng, {
          prompt: prompt(series),
          correct: extents[0],
          wrong: [
            {
              option: extents[1],
              why: t(
                "For every $x \\neq 0$ the ratio grows without bound, so the series diverges there.",
                "对每个 $x \\neq 0$，比值无限增大，所以级数在那里发散。",
              ),
            },
            {
              option: extents[2],
              why: t(
                "No positive radius works: even for a tiny $x \\neq 0$, the factor $n + 1$ eventually makes the ratio exceed $1$.",
                "任何正的半径都不行：即使 $x \\neq 0$ 很小，因子 $n + 1$ 最终也会使比值超过 $1$。",
              ),
            },
          ],
          solution: walked(
            [
              [
                ["Form the ratio", "写出比值"],
                t("Hold $x \\neq 0$ fixed and divide consecutive terms:", "固定 $x \\neq 0$，用相邻两项相除："),
                [`\\left|\\frac{a_{n+1}}{a_n}\\right| = ${ratio}`],
              ],
              [["Take the limit", "求极限"], t("The factor $n + 1$ grows without bound:", "因子 $n + 1$ 无限增大："), [`L = \\infty > 1`]],
              [
                ["Conclude", "下结论"],
                t(
                  "So the series diverges for every $x \\neq 0$; at $x = 0$ every term after the first is $0$. So $R = 0$.",
                  "所以级数对每个 $x \\neq 0$ 发散；在 $x = 0$ 处第一项之后各项都是 $0$。所以 $R = 0$。",
                ),
              ],
            ],
            t(
              `Use the $n$th term test instead. For $x \\neq 0$, once $n + 1 > \\frac{${k}}{|x|}$ each term is larger in size than the one before. Terms that grow do not tend to $0$, so the series diverges.`,
              `改用第 $n$ 项判别法。对 $x \\neq 0$，一旦 $n + 1 > \\frac{${k}}{|x|}$，每一项的大小都超过前一项。越来越大的项不会趋于 $0$，所以级数发散。`,
            ),
          ),
        });
      },
    },
  ],
};

/** endsWhy explains how a wrong interval of convergence treats the endpoints differently from the right one. */
function endsWhy(answer: Interval, wrong: Interval): Text {
  const parts = (
    [
      [answer.loClosed, wrong.loClosed, answer.lo],
      [answer.hiClosed, wrong.hiClosed, answer.hi],
    ] as const
  ).flatMap(([right, given, end]) =>
    right === given
      ? []
      : [
          right
            ? t(
                `the series converges at $x = ${(end as Q).toLatex()}$, so that endpoint belongs to the interval`,
                `级数在 $x = ${(end as Q).toLatex()}$ 处收敛，所以这个端点属于收敛区间`,
              )
            : t(
                `the series diverges at $x = ${(end as Q).toLatex()}$, so that endpoint is left out`,
                `级数在 $x = ${(end as Q).toLatex()}$ 处发散，所以这个端点不在收敛区间内`,
              ),
        ],
  );
  return t(
    `Each endpoint must be tested on its own: ${parts.map((p) => p.en).join(", and ")}.`,
    `每个端点都要单独检验：${parts.map((p) => p["zh-CN"]).join("；")}。`,
  );
}

/** radiusOfConvergenceOfPowerSeries handles a center other than 0 and the endpoints. */
export const radiusOfConvergenceOfPowerSeries: TopicDef = {
  id: "radius-of-convergence-of-power-series",
  title: t("Radius of Convergence of Power Series", "幂级数的收敛半径"),
  summary: t(
    "Σ cₙ(x − a)ⁿ converges on an interval centered at a with radius R; each endpoint must be checked separately.",
    "Σ cₙ(x − a)ⁿ 在以 a 为中心、半径为 R 的区间上收敛；两个端点需要分别检验。",
  ),
  intro: t(
    "For $\\sum \\frac{(x - 2)^{n}}{3^{n}}$ the ratio test gives $\\frac{|x - 2|}{3} < 1$, that is\n\n$$|x - 2| < 3$$\n\nThe series converges on an interval centered at $2$ with radius $3$. At the endpoints the ratio test says nothing: at $x = 5$ every term is $1$, so it diverges; at $x = -1$ the terms are $(-1)^{n}$, and it diverges too. The interval of convergence is $(-1, 5)$.\n\nCheck: it is geometric with ratio $\\frac{x - 2}{3}$, which lies strictly between $-1$ and $1$ exactly on $(-1, 5)$.\n\nIn this lesson we find the radius of a power series centered anywhere, and test the endpoints to find its interval of convergence.",
    "对 $\\sum \\frac{(x - 2)^{n}}{3^{n}}$，比值判别法给出 $\\frac{|x - 2|}{3} < 1$，即\n\n$$|x - 2| < 3$$\n\n级数在以 $2$ 为中心、半径为 $3$ 的区间上收敛。在端点处比值判别法无法判断：在 $x = 5$ 处每一项都是 $1$，发散；在 $x = -1$ 处各项为 $(-1)^{n}$，也发散。收敛区间为 $(-1, 5)$。\n\n检验：它是公比为 $\\frac{x - 2}{3}$ 的等比级数，公比恰在 $(-1, 5)$ 上严格介于 $-1$ 与 $1$ 之间。\n\n这节课我们求以任意点为中心的幂级数的半径，并检验端点得到收敛区间。",
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
        "For $\\sum \\frac{(bx - d)^{n}}{k^{n}}$, the ratio test gives convergence when $|bx - d| < k$. Dividing by $b$:\n\n$$\\left|x - \\frac{d}{b}\\right| < \\frac{k}{b}$$\n\nThe center is $\\frac{d}{b}$ and the radius is $\\frac{k}{b}$. For $\\sum \\frac{(2x - 3)^{n}}{5^{n}}$: $R = \\frac{5}{2}$.\n\nCheck: with $u = 2x - 3$ the series is $\\sum \\frac{u^{n}}{5^{n}}$, with radius $5$ in $u$. Since $x = \\frac{u + 3}{2}$, a half-width of $5$ in $u$ is a half-width of $\\frac{5}{2}$ in $x$.\n\n> **Watch out.** Divide by the coefficient of $x$; the radius of $\\sum \\frac{(2x - 3)^{n}}{5^{n}}$ is not $5$.",
        "对 $\\sum \\frac{(bx - d)^{n}}{k^{n}}$，比值判别法给出 $|bx - d| < k$ 时收敛。两边除以 $b$：\n\n$$\\left|x - \\frac{d}{b}\\right| < \\frac{k}{b}$$\n\n中心是 $\\frac{d}{b}$，半径是 $\\frac{k}{b}$。对 $\\sum \\frac{(2x - 3)^{n}}{5^{n}}$：$R = \\frac{5}{2}$。\n\n检验：令 $u = 2x - 3$，级数为 $\\sum \\frac{u^{n}}{5^{n}}$，关于 $u$ 的半径是 $5$。由于 $x = \\frac{u + 3}{2}$，$u$ 的半宽 $5$ 对应 $x$ 的半宽 $\\frac{5}{2}$。\n\n> **注意。** 要除以 $x$ 的系数；$\\sum \\frac{(2x - 3)^{n}}{5^{n}}$ 的半径不是 $5$。",
      ),
      generate(rng) {
        const b = rng.int(1, 5);
        const d = rng.nonZero(-9, 9);
        const k = rng.int(2, 9);
        const p = rng.int(0, 2);
        const np = p === 0 ? "" : p === 1 ? "n \\cdot " : "n^{2} \\cdot ";
        const lin = linear(b, -d);
        const series = sigma(`\\frac{(${lin})^{n}}{${np}${k}^{n}}`, 1);
        const R = Q.of(k, b);
        const center = poly([Q.one, "x"], [Q.of(-d, b), ""]);
        const limit = `\\frac{|${lin}|}{${k}}`;
        return worked(
          t(`Find the radius of convergence of $${series}$.`, `求 $${series}$ 的收敛半径。`),
          R,
          [
            [
              ["Take the limit of the ratio", "求比值的极限"],
              t("Hold $x$ fixed and divide consecutive terms; as $n \\to \\infty$:", "固定 $x$，用相邻两项相除；当 $n \\to \\infty$ 时："),
              [`\\left|\\frac{a_{n+1}}{a_n}\\right| = ${p === 0 ? "" : ratioPow(p, false)}${limit} \\to ${limit}`],
            ],
            [
              ["Solve for the distance from the center", "解出到中心的距离"],
              t(
                b === 1
                  ? "The series converges when this is less than $1$:"
                  : `The series converges when this is less than $1$; divide by $${b}$:`,
                b === 1 ? "当它小于 $1$ 时级数收敛：" : `当它小于 $1$ 时级数收敛；两边除以 $${b}$：`,
              ),
              [b === 1 ? `|${lin}| < ${k}` : `|${lin}| < ${k} \\iff \\left|${center}\\right| < ${R.toLatex()}`, `R = ${R.toLatex()}`],
            ],
          ],
          b === 1
            ? t(
                `Substitute $u = ${lin}$. The series becomes $${sigma(`\\frac{u^{n}}{${np}${k}^{n}}`, 1)}$, a series centered at $0$ whose ratio tends to $\\frac{|u|}{${k}}$. Its radius in $u$ is $${k}$, and $u$ is $x$ shifted, so the radius in $x$ is $${k}$ too.`,
                `令 $u = ${lin}$。级数变为 $${sigma(`\\frac{u^{n}}{${np}${k}^{n}}`, 1)}$，这是以 $0$ 为中心的级数，比值趋于 $\\frac{|u|}{${k}}$。它关于 $u$ 的半径是 $${k}$，而 $u$ 只是 $x$ 的平移，所以关于 $x$ 的半径也是 $${k}$。`,
              )
            : t(
                `Substitute $u = ${lin}$. The series becomes $${sigma(`\\frac{u^{n}}{${np}${k}^{n}}`, 1)}$, with radius $${k}$ in $u$. Since $u$ changes $${b}$ times as fast as $x$, a half-width of $${k}$ in $u$ is a half-width of $${R.toLatex()}$ in $x$.`,
                `令 $u = ${lin}$。级数变为 $${sigma(`\\frac{u^{n}}{${np}${k}^{n}}`, 1)}$，关于 $u$ 的半径是 $${k}$。由于 $u$ 的变化速度是 $x$ 的 $${b}$ 倍，$u$ 的半宽 $${k}$ 对应 $x$ 的半宽 $${R.toLatex()}$。`,
              ),
          [
            slip(
              k,
              `This is the radius in terms of $${lin}$. Divide by the coefficient $${b}$ of $x$.`,
              `这是关于 $${lin}$ 的半径。还要除以 $x$ 的系数 $${b}$。`,
            ),
            slip(Q.of(b, k), "This is the reciprocal of the radius.", "这是半径的倒数。"),
            slip(Q.of(d, b), "This is the center of the interval, not its radius.", "这是区间的中心，不是半径。"),
          ],
        );
      },
    },
    {
      id: "interval-of-convergence",
      title: t("The interval of convergence", "收敛区间"),
      explanation: t(
        "The ratio test says nothing at $x = a \\pm R$, so substitute each endpoint and test the resulting series. For $\\sum_{n=1}^{\\infty} \\frac{(x - 2)^{n}}{n \\cdot 3^{n}}$, $R = 3$. At $x = 5$ the series is $\\sum \\frac{1}{n}$, which diverges; at $x = -1$ it is $\\sum \\frac{(-1)^{n}}{n}$, which converges. The **interval of convergence** is\n\n$$[-1, 5)$$\n\nCheck: at $x = 8$, outside, the terms are $\\frac{2^{n}}{n}$, which grow, so the series diverges there, as it should.\n\n> **Watch out.** The two endpoints can behave differently; never decide one from the other.",
        "在 $x = a \\pm R$ 处比值判别法无法判断，所以要把每个端点代入，检验所得级数。对 $\\sum_{n=1}^{\\infty} \\frac{(x - 2)^{n}}{n \\cdot 3^{n}}$，$R = 3$。在 $x = 5$ 处级数为 $\\sum \\frac{1}{n}$，发散；在 $x = -1$ 处为 $\\sum \\frac{(-1)^{n}}{n}$，收敛。**收敛区间**为\n\n$$[-1, 5)$$\n\n检验：在区间外的 $x = 8$ 处，各项为 $\\frac{2^{n}}{n}$，越来越大，所以级数发散，与结论一致。\n\n> **注意。** 两个端点的情况可能不同；不能由一个推出另一个。",
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
        const one = (l: boolean, h: boolean): Interval => ({ lo, hi, loClosed: l, hiClosed: h });
        const answer = one(loClosed, hiClosed);
        const at = (s: number): Text => {
          const sign = alternating ? (s < 0 ? "" : "(-1)^{n}") : s < 0 ? "(-1)^{n}" : "";
          const sum =
            p === 0
              ? sign === ""
                ? "\\sum 1"
                : "\\sum (-1)^{n}"
              : `\\sum \\frac{${sign === "" ? "1" : sign}}{${p === 1 ? "n" : "n^{2}"}}`;
          if (p === 0) return t(`$${sum}$, whose terms do not tend to $0$, so it diverges.`, `$${sum}$，其各项不趋于 $0$，所以发散。`);
          if (p === 2)
            return t(
              `$${sum}$, which converges absolutely, since $\\sum \\frac{1}{n^{2}}$ is a $p$-series with $p = 2$.`,
              `$${sum}$，绝对收敛，因为 $\\sum \\frac{1}{n^{2}}$ 是 $p = 2$ 的 $p$ 级数。`,
            );
          return sign === ""
            ? t(`$${sum}$, the harmonic series, which diverges.`, `$${sum}$，即调和级数，发散。`)
            : t(`$${sum}$, which converges by the alternating series test.`, `$${sum}$，由交错级数判别法收敛。`);
        };
        const lowEnd = at(-1);
        const highEnd = at(1);
        const wrongs = [one(false, false), one(true, true), one(!loClosed, !hiClosed), one(true, false)].filter(
          (w, i, all) =>
            !(w.loClosed === loClosed && w.hiClosed === hiClosed) &&
            all.findIndex((v) => v.loClosed === w.loClosed && v.hiClosed === w.hiClosed) === i,
        );
        const out = c + 2 * k;
        const outside =
          p === 0
            ? t(`the terms are $2^{n}$`, `各项为 $2^{n}$`)
            : t(
                `the terms are $\\frac{2^{n}}{${p === 1 ? "n" : "n^{2}"}}$ in size`,
                `各项的大小为 $\\frac{2^{n}}{${p === 1 ? "n" : "n^{2}"}}$`,
              );
        const endCheck =
          p === 0
            ? t(
                "At either endpoint the partial sums are $1, 2, 3, \\ldots$ or $-1, 0, -1, 0, \\ldots$, which have no limit.",
                "在任一端点处，部分和为 $1, 2, 3, \\ldots$ 或 $-1, 0, -1, 0, \\ldots$，都没有极限。",
              )
            : p === 2
              ? t(
                  "At the endpoints the sizes of the terms add up to $\\frac{\\pi^{2}}{6}$, a finite number, which confirms the absolute convergence there.",
                  "在端点处各项大小之和为 $\\frac{\\pi^{2}}{6}$，是有限数，印证了那里的绝对收敛。",
                )
              : t(
                  "At the endpoints, the integral test confirms that $\\sum \\frac{1}{n}$ diverges, since $\\int_{1}^{b} \\frac{dx}{x} = \\ln b$ grows without bound; and the alternating harmonic series has partial sums that approach $\\ln 2$ in size.",
                  "在端点处，积分判别法印证 $\\sum \\frac{1}{n}$ 发散，因为 $\\int_{1}^{b} \\frac{dx}{x} = \\ln b$ 无限增大；而交错调和级数的部分和的大小趋于 $\\ln 2$。",
                );
        const interval = intervalLatex([answer]);
        return withMistakes(
          intervalProblem({
            prompt: t(`Find the interval of convergence of $${series}$.`, `求 $${series}$ 的收敛区间。`),
            set: [answer],
            form: "interval",
            wrong: wrongs.map((w) => [w]),
            solution: walked(
              [
                [
                  ["Find the radius", "求半径"],
                  t("The ratio of consecutive terms tends to a limit that must be below $1$:", "相邻两项之比的极限必须小于 $1$："),
                  [`${k === 1 ? `|${linear(1, -c)}|` : `\\frac{|${linear(1, -c)}|}{${k}}`} < 1 \\iff ${c - k} < x < ${c + k}`],
                ],
                [
                  ["Test the left endpoint", "检验左端点"],
                  t(`At $x = ${c - k}$ the series is ${lowEnd.en}`, `在 $x = ${c - k}$ 处级数为 ${lowEnd["zh-CN"]}`),
                ],
                [
                  ["Test the right endpoint", "检验右端点"],
                  t(`At $x = ${c + k}$ the series is ${highEnd.en}`, `在 $x = ${c + k}$ 处级数为 ${highEnd["zh-CN"]}`),
                ],
                [["Conclude", "下结论"], t(`So the interval of convergence is $${interval}$.`, `所以收敛区间为 $${interval}$。`)],
              ],
              t(
                `Check a point outside and the endpoints by another route. At $x = ${out}$, ${outside.en}, which grow, so the series diverges there, as it must outside the interval. ${endCheck.en}`,
                `用另一条路线检验区间外的点和端点。在 $x = ${out}$ 处，${outside["zh-CN"]}，越来越大，所以级数在那里发散，正如区间外应有的那样。${endCheck["zh-CN"]}`,
              ),
            ),
          }),
          wrongs.map((w) => ({ response: intervalLatex([w]), why: endsWhy(answer, w) })),
        );
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
  intro: t(
    "Every derivative of $e^{x}$ at $0$ is $1$, so its Taylor polynomials never stop growing: continued forever they give\n\n$$e^{x} = \\sum_{n=0}^{\\infty} \\frac{x^{n}}{n!} = 1 + x + \\frac{x^{2}}{2!} + \\frac{x^{3}}{3!} + \\cdots$$\n\nCheck: at $x = 1$ the first six terms add to $2.71667$, close to $e \\approx 2.71828$.\n\nIn this lesson we write the Maclaurin series of a function, the Taylor series centered at $0$, from its derivatives there.",
    "$e^{x}$ 在 $0$ 处的每阶导数都是 $1$，所以它的泰勒多项式可以一直写下去：无限延续得到\n\n$$e^{x} = \\sum_{n=0}^{\\infty} \\frac{x^{n}}{n!} = 1 + x + \\frac{x^{2}}{2!} + \\frac{x^{3}}{3!} + \\cdots$$\n\n检验：在 $x = 1$ 处前六项之和为 $2.71667$，接近 $e \\approx 2.71828$。\n\n这节课我们由函数在 $0$ 处的导数写出它的麦克劳林级数，即以 $0$ 为中心的泰勒级数。",
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
        "The **Maclaurin series** of $f$ is\n\n$$\\sum_{n=0}^{\\infty} \\frac{f^{(n)}(0)}{n!} x^{n} = f(0) + f'(0)x + \\frac{f''(0)}{2!}x^{2} + \\cdots$$\n\nWhen a formula gives $f^{(n)}(0)$, divide by $n!$. If $f^{(n)}(0) = \\frac{(n + 1)!}{2^{n}}$, the coefficient of $x^{3}$ is $\\frac{4!}{2^{3} \\cdot 3!} = \\frac{24}{48} = \\frac{1}{2}$.\n\nCheck: simplifying first, $\\frac{(n + 1)!}{2^{n} n!} = \\frac{n + 1}{2^{n}}$, and at $n = 3$ this is $\\frac{4}{8} = \\frac{1}{2}$.\n\n> **Watch out.** The formula gives the derivative, not the coefficient: still divide by $n!$.",
        "$f$ 的**麦克劳林级数**为\n\n$$\\sum_{n=0}^{\\infty} \\frac{f^{(n)}(0)}{n!} x^{n} = f(0) + f'(0)x + \\frac{f''(0)}{2!}x^{2} + \\cdots$$\n\n若给出 $f^{(n)}(0)$ 的公式，就除以 $n!$。若 $f^{(n)}(0) = \\frac{(n + 1)!}{2^{n}}$，则 $x^{3}$ 的系数为 $\\frac{4!}{2^{3} \\cdot 3!} = \\frac{24}{48} = \\frac{1}{2}$。\n\n检验：先化简，$\\frac{(n + 1)!}{2^{n} n!} = \\frac{n + 1}{2^{n}}$，在 $n = 3$ 处为 $\\frac{4}{8} = \\frac{1}{2}$。\n\n> **注意。** 公式给的是导数，不是系数：仍要除以 $n!$。",
      ),
      generate(rng) {
        const k = rng.int(2, 5);
        const m = rng.int(2, k >= 4 ? 4 : 5);
        const kind = rng.int(0, 2);
        const formula = kind === 0 ? `\\frac{(n + 1)!}{${k}^{n}}` : kind === 1 ? `(-1)^{n} \\, n! \\, ${k}^{n}` : `\\frac{${k}^{n}}{n + 1}`;
        const value =
          kind === 0
            ? Q.of(factorial(m + 1), k ** m)
            : kind === 1
              ? Q.of((m % 2 === 0 ? 1 : -1) * factorial(m) * k ** m)
              : Q.of(k ** m, m + 1);
        const answer = value.div(Q.of(factorial(m)));
        const general = kind === 0 ? `\\frac{n + 1}{${k}^{n}}` : kind === 1 ? `(-1)^{n} \\, ${k}^{n}` : `\\frac{${k}^{n}}{(n + 1)!}`;
        const atM =
          kind === 0 ? `\\frac{${m + 1}}{${k}^{${m}}}` : kind === 1 ? `(-1)^{${m}} \\, ${k}^{${m}}` : `\\frac{${k}^{${m}}}{${m + 1}!}`;
        return worked(
          t(
            `The function $f$ has derivatives of all orders with $f^{(n)}(0) = ${formula}$. Find the coefficient of $x^{${m}}$ in its Maclaurin series.`,
            `函数 $f$ 有任意阶导数，且 $f^{(n)}(0) = ${formula}$。求它的麦克劳林级数中 $x^{${m}}$ 的系数。`,
          ),
          answer,
          [
            [
              ["Evaluate the derivative", "求导数值"],
              t(`Put $n = ${m}$ into the formula:`, `把 $n = ${m}$ 代入公式：`),
              [`f^{(${m})}(0) = ${value.toLatex()}`],
            ],
            [
              ["Divide by the factorial", "除以阶乘"],
              t(`The coefficient of $x^{${m}}$ is this derivative over $${m}!$:`, `$x^{${m}}$ 的系数是这个导数除以 $${m}!$：`),
              [`\\frac{f^{(${m})}(0)}{${m}!} = \\frac{${value.toLatex()}}{${factorial(m)}} = ${answer.toLatex()}`],
            ],
          ],
          t(
            `Simplify the general coefficient first, then put in $n = ${m}$. Dividing the formula by $n!$ gives $${general}$, and at $n = ${m}$ this is $${atM} = ${answer.toLatex()}$.`,
            `先化简一般项的系数，再代入 $n = ${m}$。把公式除以 $n!$ 得 $${general}$，在 $n = ${m}$ 处为 $${atM} = ${answer.toLatex()}$。`,
          ),
          [
            slip(
              value,
              `This is the derivative $f^{(${m})}(0)$ itself. It must be divided by $${m}!$.`,
              `这是导数 $f^{(${m})}(0)$ 本身。还要除以 $${m}!$。`,
            ),
            slip(
              value.div(Q.of(m)),
              `This divides by $${m}$ instead of $${m}! = ${factorial(m)}$.`,
              `这里除以的是 $${m}$，而不是 $${m}! = ${factorial(m)}$。`,
            ),
            kind === 1
              ? slip(
                  answer.neg(),
                  `This has the wrong sign: $(-1)^{${m}} = ${m % 2 === 0 ? 1 : -1}$.`,
                  `符号错了：$(-1)^{${m}} = ${m % 2 === 0 ? 1 : -1}$。`,
                )
              : slip(
                  answer.neg(),
                  "This has the wrong sign. Every quantity in the formula is positive.",
                  "符号错了。公式中的每个量都是正的。",
                ),
          ],
        );
      },
    },
    {
      id: "first-nonzero-terms-of-maclaurin-series",
      title: t("The first nonzero terms", "前几个非零项"),
      explanation: t(
        'Some coefficients are $0$, so list derivatives until enough nonzero terms appear. For $\\cos(2x)$ the derivatives at $0$ are $1, 0, -4, 0, 16$, so the first three nonzero terms are\n\n$$1 - 2x^{2} + \\frac{2}{3}x^{4}$$\n\nCheck: putting $u = 2x$ into $\\cos u = 1 - \\frac{u^{2}}{2} + \\frac{u^{4}}{24} - \\cdots$ gives $1 - 2x^{2} + \\frac{16}{24}x^{4}$, the same.\n\n> **Watch out.** "Three nonzero terms" is not "the terms up to $x^{2}$": skip the zero coefficients and keep going.',
        "有些系数为 $0$，所以要一直求导，直到出现足够多的非零项。对 $\\cos(2x)$，在 $0$ 处的各阶导数为 $1, 0, -4, 0, 16$，所以前三个非零项为\n\n$$1 - 2x^{2} + \\frac{2}{3}x^{4}$$\n\n检验：把 $u = 2x$ 代入 $\\cos u = 1 - \\frac{u^{2}}{2} + \\frac{u^{4}}{24} - \\cdots$，得 $1 - 2x^{2} + \\frac{16}{24}x^{4}$，相同。\n\n> **注意。** “三个非零项”不是“到 $x^{2}$ 为止的项”：跳过为零的系数继续往下求。",
      ),
      generate(rng) {
        const f = family(rng);
        const cs = coefficients(f, 7);
        const nonzero = cs.flatMap((c, i) => (c.isZero() ? [] : [[c, around(0, i)] as const])).slice(0, 3);
        const answer = poly(...nonzero);
        const last = cs.findIndex((_, i) => cs.slice(0, i + 1).filter((c) => !c.isZero()).length === 3);
        const upTo = last < 0 ? 7 : last;
        return fnWorked(
          t(
            `Find the first three nonzero terms of the Maclaurin series for $f(x) = ${f.tex}$, and give their sum.`,
            `求 $f(x) = ${f.tex}$ 的麦克劳林级数的前三个非零项，写出它们的和。`,
          ),
          answer,
          "",
          [
            [
              ["Evaluate the derivatives at 0", "求 0 处的各阶导数"],
              t("Differentiate until three of the values are nonzero:", "一直求导，直到有三个值不为零："),
              [derivativeValues(f, upTo)],
            ],
            [
              ["Divide by the factorials", "除以阶乘"],
              t(
                "Divide each derivative by the factorial of its order and keep the nonzero terms:",
                "把每个导数除以其阶数的阶乘，保留非零项：",
              ),
              [answer],
            ],
          ],
          t(
            `Check with a known series:\n\n$$${f.series}$$\n\nPutting in $u = ${f.u}$ and keeping the first three nonzero terms gives $${answer}$ again.`,
            `用已知级数检验：\n\n$$${f.series}$$\n\n代入 $u = ${f.u}$ 并保留前三个非零项，同样得 $${answer}$。`,
          ),
          [
            say(
              poly(...nonzero.map(([c, v]) => [c.neg(), v] as const)),
              "Every sign is reversed. Check the sign of each derivative at $0$.",
              "每个符号都反了。检查每个导数在 $0$ 处的符号。",
            ),
            say(
              poly(...nonzero.slice(0, 2)),
              "This has only two nonzero terms; the question asks for three.",
              "这里只有两个非零项；题目要求三个。",
            ),
            say(
              taylorPoly(cs.slice(0, 3)),
              "This keeps the terms up to $x^{2}$, counting zero coefficients. Skip the zeros until three nonzero terms appear.",
              "这里保留到 $x^{2}$ 为止，把为零的系数也算进去了。要跳过零，直到出现三个非零项。",
            ),
            say(
              poly(...cs.flatMap((c, i) => (c.isZero() ? [] : [[c.mul(Q.of(factorial(i))), around(0, i)] as const])).slice(0, 3)),
              "This uses the derivatives themselves as coefficients. Each must be divided by the factorial of its order.",
              "这里直接把导数当成系数。每个都要除以其阶数的阶乘。",
            ),
          ],
        );
      },
    },
  ],
};

/** taylorSeries are power series of f centered at any a. */
export const taylorSeries: TopicDef = {
  id: "taylor-series",
  title: t("Taylor Series", "泰勒级数"),
  summary: t("The Taylor series of f centered at a is Σ f⁽ⁿ⁾(a)/n! · (x − a)ⁿ.", "f 以 a 为中心的泰勒级数为 Σ f⁽ⁿ⁾(a)/n! · (x − a)ⁿ。"),
  intro: t(
    "$\\ln x$ has no Maclaurin series, since it is undefined at $0$, but it can be centered at $1$. There $f(1) = 0$ and $f^{(n)}(1) = (-1)^{n+1}(n - 1)!$, so\n\n$$\\ln x = (x - 1) - \\frac{(x - 1)^{2}}{2} + \\frac{(x - 1)^{3}}{3} - \\cdots$$\n\nCheck: at $x = 1.1$ the three terms give $0.1 - 0.005 + 0.000333 = 0.095333$, and $\\ln 1.1 \\approx 0.095310$.\n\nIn this lesson we write Taylor series centered at any point $a$, in powers of $x - a$.",
    "$\\ln x$ 在 $0$ 处没有定义，所以没有麦克劳林级数，但可以以 $1$ 为中心展开。那里 $f(1) = 0$，$f^{(n)}(1) = (-1)^{n+1}(n - 1)!$，所以\n\n$$\\ln x = (x - 1) - \\frac{(x - 1)^{2}}{2} + \\frac{(x - 1)^{3}}{3} - \\cdots$$\n\n检验：在 $x = 1.1$ 处三项给出 $0.1 - 0.005 + 0.000333 = 0.095333$，而 $\\ln 1.1 \\approx 0.095310$。\n\n这节课我们写出以任意点 $a$ 为中心、按 $x - a$ 的幂展开的泰勒级数。",
  ),
  prerequisites: ["maclaurin-series", "radius-of-convergence-of-power-series"],
  encompasses: [{ topic: "maclaurin-series", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "taylor-series-coefficients",
      title: t("Coefficients of a Taylor series", "泰勒级数的系数"),
      explanation: t(
        "The coefficient of $(x - a)^{n}$ is $\\frac{f^{(n)}(a)}{n!}$. For $f(x) = \\frac{1}{x}$, $f^{(n)}(x) = \\frac{(-1)^{n} n!}{x^{n+1}}$, so centered at $a$ the coefficient is\n\n$$\\frac{(-1)^{n}}{a^{n+1}}$$\n\nCentered at $2$, the coefficient of $(x - 2)^{3}$ is $-\\frac{1}{16}$.\n\nCheck: $\\frac{1}{x} = \\frac{1}{2} \\cdot \\frac{1}{1 + (x - 2)/2}$, a geometric series whose $(x - 2)^{3}$ term is $\\frac{1}{2} \\left(-\\frac{1}{2}\\right)^{3} (x - 2)^{3} = -\\frac{1}{16}(x - 2)^{3}$.\n\n> **Watch out.** The factorial in $f^{(n)}$ cancels the $n!$ of the formula; do not divide by it twice.",
        "$(x - a)^{n}$ 的系数为 $\\frac{f^{(n)}(a)}{n!}$。对 $f(x) = \\frac{1}{x}$，$f^{(n)}(x) = \\frac{(-1)^{n} n!}{x^{n+1}}$，所以以 $a$ 为中心时系数为\n\n$$\\frac{(-1)^{n}}{a^{n+1}}$$\n\n以 $2$ 为中心时，$(x - 2)^{3}$ 的系数是 $-\\frac{1}{16}$。\n\n检验：$\\frac{1}{x} = \\frac{1}{2} \\cdot \\frac{1}{1 + (x - 2)/2}$，是等比级数，其 $(x - 2)^{3}$ 项为 $\\frac{1}{2} \\left(-\\frac{1}{2}\\right)^{3} (x - 2)^{3} = -\\frac{1}{16}(x - 2)^{3}$。\n\n> **注意。** $f^{(n)}$ 中的阶乘与公式中的 $n!$ 约掉了；不要再除一次。",
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
          const xp = p - j === 1 ? "x" : `x^{${p - j}}`;
          return worked(
            t(
              `Find the coefficient of $${around(a, j)}$ in the Taylor series for $f(x) = x^{${p}}$ centered at $x = ${a}$.`,
              `求 $f(x) = x^{${p}}$ 以 $x = ${a}$ 为中心的泰勒级数中 $${around(a, j)}$ 的系数。`,
            ),
            answer,
            [
              [
                ["Differentiate", "求导"],
                t(`Differentiate $${j}$ ${j === 1 ? "time" : "times"} and put in $x = ${a}$:`, `求 $${j}$ 阶导数，再代入 $x = ${a}$：`),
                [`${nth(j, "x")} = ${factorial(p) / factorial(p - j)}${xp}`, `${nth(j, a)} = ${d.toLatex()}`],
              ],
              [
                ["Divide by the factorial", "除以阶乘"],
                t(`The coefficient is this over $${j}!$:`, `系数是它除以 $${j}!$：`),
                [`\\frac{${d.toLatex()}}{${j}!} = ${answer.toLatex()}`],
              ],
            ],
            t(
              `Expand by the binomial theorem instead. Write $x^{${p}}$ as $\\left(${linear(1, -a)} + ${par(Q.of(a))}\\right)^{${p}}$. The term with $${around(a, j)}$ has coefficient $\\binom{${p}}{${j}} ${powOne(a, p - j)}$, which is $${product(`${binom}`, par(Q.of(a ** (p - j))))} = ${answer.toLatex()}$ again.`,
              `改用二项式定理展开。把 $x^{${p}}$ 写成 $\\left(${linear(1, -a)} + ${par(Q.of(a))}\\right)^{${p}}$。含 $${around(a, j)}$ 的项系数为 $\\binom{${p}}{${j}} ${powOne(a, p - j)}$，即 $${product(`${binom}`, par(Q.of(a ** (p - j))))} = ${answer.toLatex()}$，相同。`,
            ),
            [
              slip(
                d,
                `This is the derivative $${nth(j, a)}$ itself. Divide by $${j}!$.`,
                `这是导数 $${nth(j, a)}$ 本身。还要除以 $${j}!$。`,
              ),
              slip(binom, `This leaves out the power of the center, $${powOne(a, p - j)}$.`, `这里漏了中心的幂 $${powOne(a, p - j)}$。`),
              slip(
                binom * (-a) ** (p - j),
                `This centers the series at $${-a}$ instead of $${a}$.`,
                `这里把中心当成了 $${-a}$ 而不是 $${a}$。`,
              ),
            ],
          );
        }
        const a = kind === 0 ? rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]) : rng.int(2, 5);
        const sign = kind === 0 ? (m % 2 === 0 ? 1 : -1) : m % 2 === 1 ? 1 : -1;
        const answer = kind === 0 ? Q.one.div(qpow(Q.of(a), m + 1)).mul(Q.of(sign)) : Q.of(sign, m * a ** m);
        const f = kind === 0 ? "\\frac{1}{x}" : "\\ln x";
        const minus = sign < 0 ? "-" : "";
        const dm = kind === 0 ? `\\frac{${minus}${m}!}{x^{${m + 1}}}` : `\\frac{${minus}${m - 1}!}{x^{${m}}}`;
        const dmAt = kind === 0 ? `\\frac{${minus}${m}!}{${powTex(a, `${m + 1}`)}}` : `\\frac{${minus}${m - 1}!}{${a}^{${m}}}`;
        const coefTex = kind === 0 ? `\\frac{${minus}1}{${powTex(a, `${m + 1}`)}}` : `\\frac{${minus}1}{${m} \\cdot ${a}^{${m}}}`;
        const r = Q.of(-1, a);
        return worked(
          t(
            `Find the coefficient of $${around(a, m)}$ in the Taylor series for $f(x) = ${f}$ centered at $x = ${a}$.`,
            `求 $f(x) = ${f}$ 以 $x = ${a}$ 为中心的泰勒级数中 $${around(a, m)}$ 的系数。`,
          ),
          answer,
          [
            [
              ["Find the derivative", "求导数"],
              t(`Follow the pattern of the derivatives to order ${m}:`, `按导数的规律求到 ${m} 阶：`),
              [`${nth(m, "x")} = ${dm}`, `${nth(m, a)} = ${dmAt}`],
            ],
            [
              ["Divide by the factorial", "除以阶乘"],
              t(
                `Divide by $${m}!$; the factorials cancel${kind === 1 ? ` except for a factor $${m}$` : ""}:`,
                `除以 $${m}!$；阶乘约掉${kind === 1 ? `，只剩因子 $${m}$` : ""}：`,
              ),
              [`\\frac{${nth(m, a)}}{${m}!} = ${coefTex} = ${answer.toLatex()}`],
            ],
          ],
          kind === 0
            ? t(
                `Use a geometric series instead. Since $x = ${a} + ${around(a, 1)}$, the function $\\frac{1}{x}$ is $${Q.of(1, a).toLatex()}$ times $\\frac{1}{1 - r}$ with ratio $r = ${poly([r, around(a, 1)])}$. Its $${around(a, m)}$ term has coefficient $${Q.of(1, a).toLatex()}$ times $${par(r)}^{${m}}$, which is $${answer.toLatex()}$ again.`,
                `改用等比级数。由于 $x = ${a} + ${around(a, 1)}$，函数 $\\frac{1}{x}$ 等于 $${Q.of(1, a).toLatex()}$ 乘以 $\\frac{1}{1 - r}$，公比 $r = ${poly([r, around(a, 1)])}$。其 $${around(a, m)}$ 项的系数为 $${Q.of(1, a).toLatex()}$ 乘以 $${par(r)}^{${m}}$，同样是 $${answer.toLatex()}$。`,
              )
            : t(
                `Use a known series instead. Write $\\ln x = \\ln ${a} + \\ln(1 + u)$ with $u = \\frac{${linear(1, -a)}}{${a}}$. The $u^{${m}}$ term of $\\ln(1 + u)$ has coefficient $\\frac{${minus}1}{${m}}$, and $u^{${m}} = \\frac{${around(a, m)}}{${a ** m}}$, so the coefficient is $${answer.toLatex()}$ again.`,
                `改用已知级数。写成 $\\ln x = \\ln ${a} + \\ln(1 + u)$，其中 $u = \\frac{${linear(1, -a)}}{${a}}$。$\\ln(1 + u)$ 的 $u^{${m}}$ 项系数为 $\\frac{${minus}1}{${m}}$，而 $u^{${m}} = \\frac{${around(a, m)}}{${a ** m}}$，所以系数同样是 $${answer.toLatex()}$。`,
              ),
          kind === 0
            ? [
                slip(
                  answer.neg(),
                  `This has the wrong sign: each derivative of $\\frac{1}{x}$ flips the sign, so order ${m} has sign $(-1)^{${m}}$.`,
                  `符号错了：$\\frac{1}{x}$ 每求一次导数符号就变一次，所以 ${m} 阶的符号是 $(-1)^{${m}}$。`,
                ),
                slip(
                  answer.mul(Q.of(factorial(m))),
                  `This is the derivative $${nth(m, a)}$ itself. Divide by $${m}!$.`,
                  `这是导数 $${nth(m, a)}$ 本身。还要除以 $${m}!$。`,
                ),
                slip(
                  Q.one.div(qpow(Q.of(a), m)),
                  `The power of $${a}$ is $${m + 1}$, one more than the order, since $f^{(n)}(x)$ has $x^{n+1}$ below.`,
                  `$${a}$ 的幂是 $${m + 1}$，比阶数多一，因为 $f^{(n)}(x)$ 的分母是 $x^{n+1}$。`,
                ),
              ]
            : [
                slip(
                  answer.neg(),
                  `This has the wrong sign: for $\\ln x$ the sign of order $n$ is $(-1)^{n+1}$.`,
                  `符号错了：对 $\\ln x$，$n$ 阶的符号是 $(-1)^{n+1}$。`,
                ),
                slip(
                  answer.mul(Q.of(m)),
                  `This leaves out the factor $${m}$: $\\frac{${m - 1}!}{${m}!} = \\frac{1}{${m}}$.`,
                  `这里漏了因子 $${m}$：$\\frac{${m - 1}!}{${m}!} = \\frac{1}{${m}}$。`,
                ),
                slip(
                  answer.mul(Q.of(factorial(m))),
                  `This is the derivative $${nth(m, a)}$ itself. Divide by $${m}!$.`,
                  `这是导数 $${nth(m, a)}$ 本身。还要除以 $${m}!$。`,
                ),
              ],
        );
      },
    },
    {
      id: "first-terms-of-taylor-series",
      title: t("The first terms of a Taylor series", "泰勒级数的前几项"),
      explanation: t(
        "The first terms of a Taylor series are a Taylor polynomial of low degree. Evaluate $f$, $f'$ and $f''$ at the center and divide by the factorials. For $\\sqrt{x}$ at $a = 4$: $f(4) = 2$, $f'(4) = \\frac{1}{4}$, $f''(4) = -\\frac{1}{32}$, so the series begins\n\n$$2 + \\frac{1}{4}(x - 4) - \\frac{1}{64}(x - 4)^{2} + \\cdots$$\n\nCheck: at $x = 4.1$ these terms give $2.024844$, and $\\sqrt{4.1} \\approx 2.024846$.\n\n> **Watch out.** Write the powers of $x - a$, here $x - 4$, not of $x$.",
        "泰勒级数的前几项就是低次的泰勒多项式。在中心处求 $f$、$f'$、$f''$ 的值，再除以阶乘。对 $\\sqrt{x}$，$a = 4$：$f(4) = 2$，$f'(4) = \\frac{1}{4}$，$f''(4) = -\\frac{1}{32}$，所以级数以下式开头：\n\n$$2 + \\frac{1}{4}(x - 4) - \\frac{1}{64}(x - 4)^{2} + \\cdots$$\n\n检验：在 $x = 4.1$ 处这几项给出 $2.024844$，而 $\\sqrt{4.1} \\approx 2.024846$。\n\n> **注意。** 写的是 $x - a$（这里是 $x - 4$）的幂，不是 $x$ 的幂。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        let f: string;
        let a: number;
        let d: [Q, Q, Q];
        let at: (x: number) => number;
        if (kind === 0) {
          const s = rng.int(1, 6);
          a = s * s;
          f = "\\sqrt{x}";
          d = [Q.of(s), Q.of(1, 2 * s), Q.of(-1, 4 * s ** 3)];
          at = Math.sqrt;
        } else if (kind === 1) {
          a = rng.nonZero(-6, 6);
          f = "\\frac{1}{x}";
          d = [Q.of(1, a), Q.of(-1, a * a), Q.of(2, a ** 3)];
          at = (x) => 1 / x;
        } else {
          a = rng.nonZero(-6, 6);
          f = "\\frac{1}{x^{2}}";
          d = [Q.of(1, a * a), Q.of(-2, a ** 3), Q.of(6, a ** 4)];
          at = (x) => 1 / (x * x);
        }
        const cs = [d[0], d[1], d[2].div(Q.of(2))];
        const answer = taylorPoly(cs, a);
        const x0 = a + 0.1;
        return fnWorked(
          t(
            `Find the first three terms of the Taylor series for $f(x) = ${f}$ centered at $x = ${a}$, and give their sum.`,
            `求 $f(x) = ${f}$ 以 $x = ${a}$ 为中心的泰勒级数的前三项，写出它们的和。`,
          ),
          answer,
          "",
          [
            [
              ["Evaluate at the center", "在中心处求值"],
              t("Find the value and the first two derivatives at the center:", "求中心处的函数值和前两阶导数："),
              [`f(${a}) = ${d[0].toLatex()}, \\; f'(${a}) = ${d[1].toLatex()}, \\; f''(${a}) = ${d[2].toLatex()}`],
            ],
            [
              ["Divide by the factorials", "除以阶乘"],
              t(
                `Divide $f''(${a})$ by $2!$ and write powers of $${around(a, 1)}$:`,
                `把 $f''(${a})$ 除以 $2!$，并写成 $${around(a, 1)}$ 的幂：`,
              ),
              [answer],
            ],
          ],
          valueCheck(`P_{2}(${dec(x0, 1)})`, taylorAt(cs, a, Q.of(a).add(Q.of(1, 10))), dec(x0, 1), `f(${dec(x0, 1)})`, at(x0)),
          [
            say(
              taylorPoly(d, a),
              `This uses $f''(${a})$ as the coefficient of $${around(a, 2)}$. It must be divided by $2!$.`,
              `这里把 $f''(${a})$ 直接当成 $${around(a, 2)}$ 的系数。还要除以 $2!$。`,
            ),
            say(
              taylorPoly(cs, -a),
              `This is written in powers of $${around(-a, 1)}$, which centers it at $${-a}$.`,
              `这里用的是 $${around(-a, 1)}$ 的幂，中心成了 $${-a}$。`,
            ),
            say(
              taylorPoly([d[0], d[1].neg(), cs[2] as Q], a),
              `The linear coefficient is $f'(${a}) = ${d[1].toLatex()}$; this has its sign reversed.`,
              `一次项系数是 $f'(${a}) = ${d[1].toLatex()}$；这里符号反了。`,
            ),
          ],
        );
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
  intro: t(
    "The geometric series $1 + r + r^{2} + \\cdots$ adds up to $\\frac{1}{1 - r}$ when $|r| < 1$. Read backwards, it writes a function as a power series. With $r = \\frac{x}{2}$:\n\n$$\\frac{2}{2 - x} = \\frac{1}{1 - x/2} = 1 + \\frac{x}{2} + \\frac{x^{2}}{4} + \\cdots$$\n\nThis holds for $|x| < 2$.\n\nCheck: at $x = 1$ the function is $\\frac{2}{1} = 2$, and the series $1 + \\frac{1}{2} + \\frac{1}{4} + \\cdots$ also adds up to $2$.\n\nIn this lesson we write rational functions as geometric power series and find where those series converge.",
    "等比级数 $1 + r + r^{2} + \\cdots$ 在 $|r| < 1$ 时的和是 $\\frac{1}{1 - r}$。反过来读，就能把函数写成幂级数。取 $r = \\frac{x}{2}$：\n\n$$\\frac{2}{2 - x} = \\frac{1}{1 - x/2} = 1 + \\frac{x}{2} + \\frac{x^{2}}{4} + \\cdots$$\n\n它在 $|x| < 2$ 时成立。\n\n检验：在 $x = 1$ 处函数值为 $\\frac{2}{1} = 2$，而级数 $1 + \\frac{1}{2} + \\frac{1}{4} + \\cdots$ 的和也是 $2$。\n\n这节课我们把有理函数写成等比幂级数，并求出这些级数的收敛范围。",
  ),
  prerequisites: ["maclaurin-series", "radius-of-convergence-of-power-series"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "geometric-power-series-coefficients",
      title: t("Coefficients of a geometric power series", "等比幂级数的系数"),
      explanation: t(
        "Since $\\frac{1}{1 - r} = \\sum_{n=0}^{\\infty} r^{n}$ for $|r| < 1$, factor the constant term out of the denominator:\n\n$$\\frac{3}{2 - x^{2}} = \\frac{3}{2} \\cdot \\frac{1}{1 - x^{2}/2} = \\sum_{n=0}^{\\infty} \\frac{3}{2} \\left(\\frac{x^{2}}{2}\\right)^{n}$$\n\nThe term in $x^{4}$ has $n = 2$, so its coefficient is $\\frac{3}{2} \\cdot \\frac{1}{4} = \\frac{3}{8}$.\n\nCheck: multiplying the series by $2 - x^{2}$ must leave only $3$, so $2$ times the $x^{4}$ coefficient equals the $x^{2}$ coefficient $\\frac{3}{4}$; indeed $2 \\cdot \\frac{3}{8} = \\frac{3}{4}$.\n\n> **Watch out.** Factor out the constant first: the ratio is $\\frac{x^{2}}{2}$, not $x^{2}$.",
        "由于 $|r| < 1$ 时 $\\frac{1}{1 - r} = \\sum_{n=0}^{\\infty} r^{n}$，先把分母的常数项提出来：\n\n$$\\frac{3}{2 - x^{2}} = \\frac{3}{2} \\cdot \\frac{1}{1 - x^{2}/2} = \\sum_{n=0}^{\\infty} \\frac{3}{2} \\left(\\frac{x^{2}}{2}\\right)^{n}$$\n\n含 $x^{4}$ 的项对应 $n = 2$，系数为 $\\frac{3}{2} \\cdot \\frac{1}{4} = \\frac{3}{8}$。\n\n检验：级数乘以 $2 - x^{2}$ 后只能剩下 $3$，所以 $x^{4}$ 系数的 $2$ 倍等于 $x^{2}$ 的系数 $\\frac{3}{4}$；确实 $2 \\cdot \\frac{3}{8} = \\frac{3}{4}$。\n\n> **注意。** 要先提出常数：公比是 $\\frac{x^{2}}{2}$，不是 $x^{2}$。",
      ),
      generate(rng) {
        const c = rng.int(1, 9);
        const b = rng.int(1, 5);
        const d = rng.nonZero(-3, 3);
        const p = rng.int(1, 2);
        const j = rng.int(2, 4);
        const xp = p === 1 ? "x" : "x^{2}";
        const r = Q.of(d, b);
        const lead = Q.of(c, b);
        const answer = lead.mul(qpow(r, j));
        const prev = lead.mul(qpow(r, j - 1));
        const leadDot = lead.eq(Q.one) ? "" : `${lead.toLatex()} \\cdot `;
        const f = `\\frac{${c}}{${poly([b, ""], [-d, xp])}}`;
        return worked(
          t(
            `Find the coefficient of $x^{${p * j}}$ in the Maclaurin series for $f(x) = ${f}$.`,
            `求 $f(x) = ${f}$ 的麦克劳林级数中 $x^{${p * j}}$ 的系数。`,
          ),
          answer,
          [
            [
              ["Factor out the constant", "提出常数"],
              t(`Divide the top and bottom by $${b}$ to make the constant term $1$:`, `分子分母同除以 $${b}$，使常数项为 $1$：`),
              [`f(x) = ${leadDot}\\frac{1}{${poly([1, ""], [r.neg(), xp])}}`],
            ],
            [
              ["Write the geometric series", "写出等比级数"],
              t(`The ratio is $${poly([r, xp])}$:`, `公比为 $${poly([r, xp])}$：`),
              [`f(x) = \\sum_{n=0}^{\\infty} ${leadDot}\\left(${poly([r, xp])}\\right)^{n}`],
            ],
            [
              ["Pick the term", "找出对应项"],
              t(`The term with $x^{${p * j}}$ has $n = ${j}$:`, `含 $x^{${p * j}}$ 的项对应 $n = ${j}$：`),
              [`${leadDot}\\left(${r.toLatex()}\\right)^{${j}} = ${answer.toLatex()}`],
            ],
          ],
          t(
            `Multiply back. Since $f(x) \\, (${poly([b, ""], [-d, xp])}) = ${c}$, every power of $x$ above the constant must cancel. So $${b}$ times the coefficient of $x^{${p * j}}$ equals $${d}$ times the coefficient $${prev.toLatex()}$ of $${p * (j - 1) === 1 ? "x" : `x^{${p * (j - 1)}}`}$, and indeed both are $${answer.mul(Q.of(b)).toLatex()}$.`,
            `乘回去检验。由于 $f(x) \\, (${poly([b, ""], [-d, xp])}) = ${c}$，常数项以上的各次幂都必须抵消。所以 $x^{${p * j}}$ 的系数的 $${b}$ 倍，等于 $${p * (j - 1) === 1 ? "x" : `x^{${p * (j - 1)}}`}$ 的系数 $${prev.toLatex()}$ 的 $${d}$ 倍，两者确实都是 $${answer.mul(Q.of(b)).toLatex()}$。`,
          ),
          [
            slip(
              Q.of(c).mul(qpow(Q.of(d), j)),
              `This skips factoring out $${b}$. The constant term must be $1$ before the geometric series applies.`,
              `这里没有提出 $${b}$。要先使常数项为 $1$ 才能用等比级数。`,
            ),
            slip(
              lead.mul(qpow(r.neg(), j)),
              `This uses the ratio $${poly([r.neg(), xp])}$. In $\\frac{1}{1 - r}$ the ratio is what is subtracted, so $r = ${poly([r, xp])}$.`,
              `这里用的公比是 $${poly([r.neg(), xp])}$。在 $\\frac{1}{1 - r}$ 中，被减去的才是公比，所以 $r = ${poly([r, xp])}$。`,
            ),
            slip(
              lead.mul(qpow(r, j + 1)),
              `This uses $n = ${j + 1}$. The term $\\left(${poly([r, xp])}\\right)^{n}$ contains $x^{${p * j}}$ when $n = ${j}$.`,
              `这里用了 $n = ${j + 1}$。$\\left(${poly([r, xp])}\\right)^{n}$ 在 $n = ${j}$ 时才含 $x^{${p * j}}$。`,
            ),
          ],
        );
      },
    },
    {
      id: "radius-of-a-geometric-power-series",
      title: t("Radius of a geometric power series", "等比幂级数的收敛半径"),
      explanation: t(
        "The geometric series converges exactly when the ratio has absolute value less than $1$. For $\\frac{1}{5 - 2x} = \\frac{1}{5} \\sum \\left(\\frac{2x}{5}\\right)^{n}$ we need\n\n$$\\left|\\frac{2x}{5}\\right| < 1 \\iff |x| < \\frac{5}{2}$$\n\nso $R = \\frac{5}{2}$.\n\nCheck: the function blows up where $5 - 2x = 0$, at $x = \\frac{5}{2}$. A series centered at $0$ cannot converge past that point, and the distance from $0$ to it is $\\frac{5}{2}$.\n\n> **Watch out.** Solve $\\left|\\frac{2x}{5}\\right| < 1$ for $|x|$: the radius is $\\frac{5}{2}$, not $\\frac{2}{5}$.",
        "等比级数收敛当且仅当公比的绝对值小于 $1$。对 $\\frac{1}{5 - 2x} = \\frac{1}{5} \\sum \\left(\\frac{2x}{5}\\right)^{n}$，需要\n\n$$\\left|\\frac{2x}{5}\\right| < 1 \\iff |x| < \\frac{5}{2}$$\n\n所以 $R = \\frac{5}{2}$。\n\n检验：函数在 $5 - 2x = 0$ 即 $x = \\frac{5}{2}$ 处趋于无穷。以 $0$ 为中心的级数不可能越过这一点收敛，而 $0$ 到它的距离正是 $\\frac{5}{2}$。\n\n> **注意。** 要从 $\\left|\\frac{2x}{5}\\right| < 1$ 解出 $|x|$：半径是 $\\frac{5}{2}$，不是 $\\frac{2}{5}$。",
      ),
      generate(rng) {
        const c = rng.int(1, 9);
        const b = rng.int(1, 9);
        const d = rng.nonZero(-6, 6);
        const R = Q.of(b, Math.abs(d));
        const lead = Q.of(c, b);
        const leadTex = lead.eq(Q.one) ? "" : `${lead.toLatex()} `;
        const f = `\\frac{${c}}{${poly([b, ""], [-d, "x"])}}`;
        const ratio = poly([Q.of(d, b), "x"]);
        return worked(
          t(`Find the radius of convergence of the Maclaurin series for $f(x) = ${f}$.`, `求 $f(x) = ${f}$ 的麦克劳林级数的收敛半径。`),
          R,
          [
            [
              ["Write the geometric series", "写出等比级数"],
              t(`Factor out $${b}$ from the denominator:`, `从分母中提出 $${b}$：`),
              [`f(x) = ${leadTex}\\sum_{n=0}^{\\infty} \\left(${ratio}\\right)^{n}`],
            ],
            [
              ["Require the ratio to be small", "要求公比足够小"],
              t(
                "A geometric series converges exactly when its ratio is less than $1$ in size:",
                "等比级数恰在公比的绝对值小于 $1$ 时收敛：",
              ),
              [`\\left|${ratio}\\right| < 1 \\iff |x| < ${R.toLatex()}`, `R = ${R.toLatex()}`],
            ],
          ],
          t(
            `Look at where $f$ breaks down. The denominator $${poly([b, ""], [-d, "x"])}$ is $0$ at $x = ${Q.of(b, d).toLatex()}$, where $f$ has a vertical asymptote. A series centered at $0$ cannot converge past it, and its distance from $0$ is $${R.toLatex()}$.`,
            `看 $f$ 在哪里失去意义。分母 $${poly([b, ""], [-d, "x"])}$ 在 $x = ${Q.of(b, d).toLatex()}$ 处为 $0$，$f$ 在那里有竖直渐近线。以 $0$ 为中心的级数不可能越过它收敛，而它到 $0$ 的距离为 $${R.toLatex()}$。`,
          ),
          [
            slip(
              Q.one.div(R),
              "This is the size of the coefficient of $x$ in the ratio. Solve the inequality for $|x|$, which gives its reciprocal.",
              "这是公比中 $x$ 的系数的绝对值。要从不等式解出 $|x|$，得到的是它的倒数。",
            ),
            slip(
              b,
              `This is the constant in the denominator. The radius also depends on the coefficient $${d}$ of $x$.`,
              `这是分母中的常数。半径还取决于 $x$ 的系数 $${d}$。`,
            ),
            slip(
              lead,
              "This is the factor in front of the series. It scales every term but does not change where the series converges.",
              "这是级数前面的因子。它使每一项按比例变化，但不改变收敛范围。",
            ),
          ],
        );
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
  intro: t(
    "Which function has the series $1 + 2x + \\frac{4x^{2}}{2!} + \\frac{8x^{3}}{3!} + \\cdots$? The factorials point to the exponential series, and the powers of $2$ mean $u = 2x$:\n\n$$\\sum_{n=0}^{\\infty} \\frac{(2x)^{n}}{n!} = e^{2x}$$\n\nCheck: $e^{2x}$ has $f(0) = 1$ and $f'(0) = 2$, the first two coefficients of the series.\n\nIn this lesson we recognize the series of $e^{x}$, $\\frac{1}{1 - x}$ and $\\ln(1 + x)$, with substitutions, and use them to sum numerical series.",
    "哪个函数的级数是 $1 + 2x + \\frac{4x^{2}}{2!} + \\frac{8x^{3}}{3!} + \\cdots$？阶乘指向指数级数，$2$ 的幂说明 $u = 2x$：\n\n$$\\sum_{n=0}^{\\infty} \\frac{(2x)^{n}}{n!} = e^{2x}$$\n\n检验：$e^{2x}$ 满足 $f(0) = 1$，$f'(0) = 2$，正是级数的前两个系数。\n\n这节课我们识别 $e^{x}$、$\\frac{1}{1 - x}$、$\\ln(1 + x)$ 的级数及其代换形式，并用它们求数项级数的和。",
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
        "A few series appear so often that it pays to recognize them on sight from the pattern of their coefficients and signs. Three series to know:\n\n$$e^{x} = \\sum_{n=0}^{\\infty} \\frac{x^{n}}{n!}, \\qquad \\frac{1}{1 - x} = \\sum_{n=0}^{\\infty} x^{n}, \\qquad \\ln(1 + x) = \\sum_{n=1}^{\\infty} \\frac{(-1)^{n+1} x^{n}}{n}$$\n\nReplacing $x$ with $kx$ turns $x^{n}$ into $k^{n}x^{n}$, so $\\sum \\frac{3^{n} x^{n}}{n!} = e^{3x}$.\n\nCheck: $e^{3x}$ has $f(0) = 1$ and $f'(0) = 3$, the $n = 0$ and $n = 1$ coefficients of $\\sum \\frac{3^{n} x^{n}}{n!}$.\n\n> **Watch out.** Factorials mean $e^{x}$, a plain $n$ in the denominator with alternating signs means $\\ln(1 + x)$, and no denominator means $\\frac{1}{1 - x}$.",
        "有几个级数出现得非常频繁，值得根据系数和符号的规律一眼认出它们。需要熟记三个级数：\n\n$$e^{x} = \\sum_{n=0}^{\\infty} \\frac{x^{n}}{n!}, \\qquad \\frac{1}{1 - x} = \\sum_{n=0}^{\\infty} x^{n}, \\qquad \\ln(1 + x) = \\sum_{n=1}^{\\infty} \\frac{(-1)^{n+1} x^{n}}{n}$$\n\n把 $x$ 换成 $kx$，$x^{n}$ 就变成 $k^{n}x^{n}$，所以 $\\sum \\frac{3^{n} x^{n}}{n!} = e^{3x}$。\n\n检验：$e^{3x}$ 满足 $f(0) = 1$，$f'(0) = 3$，正是 $\\sum \\frac{3^{n} x^{n}}{n!}$ 中 $n = 0$ 与 $n = 1$ 的系数。\n\n> **注意。** 有阶乘是 $e^{x}$，分母是 $n$ 且符号交替是 $\\ln(1 + x)$，没有分母是 $\\frac{1}{1 - x}$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const c = rng.int(1, 4);
        const cc = c === 1 ? "" : `${c} `;
        const cf = c === 1 ? "" : `${c}`;
        const k = kind === 2 ? rng.int(1, 4) : rng.nonZero(-4, 4);
        const kx = poly([k, "x"]);
        const exp = (m: number) => `${cf}e^{${poly([m, "x"])}}`;
        const geo = (m: number) => `\\frac{${c}}{${poly([1, ""], [-m, "x"])}}`;
        const log = (m: number) => `${cf}\\ln(${poly([1, ""], [m, "x"])})`;
        const kn = k === 1 ? "" : `${powTex(k, "n")} `;
        const shape = [
          { series: sigma(`\\frac{${kn}x^{n}}{n!}`), std: "e^{u} = \\sum \\frac{u^{n}}{n!}", answer: exp(k) },
          { series: sigma(k === 1 ? "x^{n}" : `${powTex(k, "n")} x^{n}`), std: "\\frac{1}{1 - u} = \\sum u^{n}", answer: geo(k) },
          { series: sigma(`\\frac{(-1)^{n+1} ${kn}x^{n}}{n}`, 1), std: "\\ln(1 + u) = \\sum \\frac{(-1)^{n+1} u^{n}}{n}", answer: log(k) },
        ][kind] as { series: string; std: string; answer: string };
        const f0 = kind === 2 ? 0 : c;
        const firstTwo = kind === 2 ? poly([c * k, "x"], [Q.of(-c * k * k, 2), "x^{2}"]) : poly([c, ""], [c * k, "x"]);
        const mistakes =
          kind === 0
            ? [
                say(
                  exp(1),
                  `The powers $${powTex(k, "n")}$ mean $u = ${kx}$, not $u = x$.`,
                  `幂 $${powTex(k, "n")}$ 说明 $u = ${kx}$，而不是 $u = x$。`,
                ),
                say(
                  geo(k),
                  "The factorials in the denominators belong to the exponential series. The geometric series has no denominators.",
                  "分母中的阶乘属于指数级数。等比级数没有分母。",
                ),
                say(
                  exp(-k),
                  `This reverses the sign of $k$. The powers are of $${k}$, so $u = ${kx}$.`,
                  `这里把 $k$ 的符号弄反了。幂的底数是 $${k}$，所以 $u = ${kx}$。`,
                ),
              ]
            : kind === 1
              ? [
                  say(
                    geo(-k),
                    `This reverses the sign. In $\\frac{1}{1 - u}$ the ratio is $u = ${kx}$, so the denominator is $${poly([1, ""], [-k, "x"])}$.`,
                    `符号反了。在 $\\frac{1}{1 - u}$ 中公比是 $u = ${kx}$，所以分母是 $${poly([1, ""], [-k, "x"])}$。`,
                  ),
                  say(
                    exp(k),
                    "The exponential series has factorials in its denominators. This series has none.",
                    "指数级数的分母中有阶乘。这个级数没有。",
                  ),
                  say(
                    geo(1),
                    `The powers $${powTex(k, "n")}$ mean $u = ${kx}$, not $u = x$.`,
                    `幂 $${powTex(k, "n")}$ 说明 $u = ${kx}$，而不是 $u = x$。`,
                  ),
                ]
              : [
                  say(
                    log(-k),
                    `The signs $(-1)^{n+1}$ belong to $\\ln(1 + u)$ with $u = ${kx}$. The series of $\\ln(1 - u)$ has every term negative.`,
                    `符号 $(-1)^{n+1}$ 属于 $\\ln(1 + u)$，其中 $u = ${kx}$。$\\ln(1 - u)$ 的级数每一项都是负的。`,
                  ),
                  say(
                    exp(k),
                    "The exponential series has factorials in its denominators. This one has a plain $n$.",
                    "指数级数的分母是阶乘。这个级数的分母只是 $n$。",
                  ),
                  say(
                    `\\frac{${c}}{${poly([1, ""], [k, "x"])}}`,
                    "The series of $\\frac{1}{1 + u}$ has no denominators. Dividing by $n$ comes from integrating it, which gives $\\ln(1 + u)$.",
                    "$\\frac{1}{1 + u}$ 的级数没有分母。除以 $n$ 来自对它积分，得到的是 $\\ln(1 + u)$。",
                  ),
                ];
        return fnWorked(
          t(`Find the function whose Maclaurin series is $${cc}${shape.series}$.`, `求麦克劳林级数为 $${cc}${shape.series}$ 的函数。`),
          shape.answer,
          "f(x) =",
          [
            [
              ["Match a standard series", "对应标准级数"],
              t("The pattern of coefficients and signs matches", "系数和符号的规律与下式一致："),
              [shape.std],
            ],
            [
              ["Substitute", "代换"],
              t(
                `Here $u = ${kx}$${c === 1 ? "" : `, and the whole series is multiplied by $${c}$`}:`,
                `这里 $u = ${kx}$${c === 1 ? "" : `，整个级数再乘以 $${c}$`}：`,
              ),
              [`f(x) = ${shape.answer}`],
            ],
          ],
          t(
            `Compare the first terms. The answer has $f(0) = ${f0}$ and $f'(0) = ${c * k}$${kind === 2 ? `, $f''(0) = ${-c * k * k}$` : ""}, so its series begins $${firstTwo}$. The given series begins the same way.`,
            `对照前几项。答案满足 $f(0) = ${f0}$，$f'(0) = ${c * k}$${kind === 2 ? `，$f''(0) = ${-c * k * k}$` : ""}，所以它的级数以 $${firstTwo}$ 开头。所给级数的开头相同。`,
          ),
          mistakes,
        );
      },
    },
    {
      id: "sums-from-standard-series",
      title: t("Sums from standard series", "用标准级数求和"),
      explanation: t(
        "If a numerical series matches a standard series evaluated at one value of the variable, its sum is the function evaluated at that value. Since $e^{x} = \\sum \\frac{x^{n}}{n!}$, taking $x = \\ln 5$ gives\n\n$$\\sum_{n=0}^{\\infty} \\frac{(\\ln 5)^{n}}{n!} = e^{\\ln 5} = 5$$\n\nCheck: $\\ln 5 \\approx 1.609$, and the first ten terms add to about $4.9999$.\n\n> **Watch out.** $e^{2\\ln k}$ is $k^{2}$, not $2k$: $2\\ln k = \\ln k^{2}$.",
        "如果一个数项级数与某个标准级数在变量取某值时相同，它的和就是函数在该值处的值。由于 $e^{x} = \\sum \\frac{x^{n}}{n!}$，取 $x = \\ln 5$ 得\n\n$$\\sum_{n=0}^{\\infty} \\frac{(\\ln 5)^{n}}{n!} = e^{\\ln 5} = 5$$\n\n检验：$\\ln 5 \\approx 1.609$，前十项之和约为 $4.9999$。\n\n> **注意。** $e^{2\\ln k}$ 是 $k^{2}$，不是 $2k$：$2\\ln k = \\ln k^{2}$。",
      ),
      generate(rng) {
        const k = rng.int(2, 9);
        const m = rng.int(1, 2);
        const c = rng.int(1, 4);
        const u = m === 1 ? `\\ln ${k}` : `2\\ln ${k}`;
        const answer = c * k ** m;
        const cd = c === 1 ? "" : `${c} \\cdot `;
        const x = m * Math.log(k);
        let partial = 0;
        let term = 1;
        for (let n = 0; n < 20; n++) {
          partial += term;
          term *= x / (n + 1);
        }
        return worked(
          t(
            `Find the sum of $${c === 1 ? "" : c}${sigma(`\\frac{(${u})^{n}}{n!}`)}$.`,
            `求 $${c === 1 ? "" : c}${sigma(`\\frac{(${u})^{n}}{n!}`)}$ 的和。`,
          ),
          Q.of(answer),
          [
            [
              ["Match a standard series", "对应标准级数"],
              t(
                `This is the exponential series $\\sum \\frac{x^{n}}{n!}$ of $e^{x}$, taken at $x = ${u}$${c === 1 ? "" : `, times $${c}$`}:`,
                `这是 $e^{x}$ 的级数 $\\sum \\frac{x^{n}}{n!}$ 在 $x = ${u}$ 处的值${c === 1 ? "" : `再乘以 $${c}$`}：`,
              ),
              [`${cd}e^{${u}}`],
            ],
            [
              ["Evaluate", "求值"],
              t(
                m === 1 ? `Since $e^{\\ln ${k}} = ${k}$:` : `Since $2\\ln ${k} = \\ln ${k * k}$:`,
                m === 1 ? `由于 $e^{\\ln ${k}} = ${k}$：` : `由于 $2\\ln ${k} = \\ln ${k * k}$：`,
              ),
              [`${cd}e^{${u}} = ${cd}${m === 1 ? k : `${k}^{2}`} = ${answer}`],
            ],
          ],
          t(
            `Add terms numerically. With $${u} \\approx ${x.toFixed(4)}$, the first twenty terms of the series add to about $${(c * partial).toFixed(4)}$, which approaches $${answer}$.`,
            `用数值相加检验。$${u} \\approx ${x.toFixed(4)}$，级数前二十项之和约为 $${(c * partial).toFixed(4)}$，趋近于 $${answer}$。`,
          ),
          [
            slip(
              c * k,
              `This treats $e^{2\\ln ${k}}$ as $${k}$. Since $2\\ln ${k} = \\ln ${k * k}$, it is $${k * k}$.`,
              `这里把 $e^{2\\ln ${k}}$ 当成了 $${k}$。由于 $2\\ln ${k} = \\ln ${k * k}$，它等于 $${k * k}$。`,
            ),
            slip(
              c * m * k,
              `This turns $e^{2\\ln ${k}}$ into $2 \\cdot ${k}$. The $2$ becomes a power: $${k}^{2}$.`,
              `这里把 $e^{2\\ln ${k}}$ 变成了 $2 \\cdot ${k}$。$2$ 应变成指数：$${k}^{2}$。`,
            ),
            slip(
              c * (k + 1),
              `The sum of $\\frac{x^{n}}{n!}$ is $e^{x}$, not $1 + e^{x}$; the $n = 0$ term $1$ is already part of it.`,
              `$\\frac{x^{n}}{n!}$ 的和是 $e^{x}$，不是 $1 + e^{x}$；$n = 0$ 的项 $1$ 已经包含在内。`,
            ),
          ],
        );
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
  intro: t(
    "Sine is odd and cosine is even, and their series show it: only odd powers for sine, only even powers for cosine, with alternating signs and factorials:\n\n$$\\sin x = x - \\frac{x^{3}}{3!} + \\frac{x^{5}}{5!} - \\cdots, \\qquad \\cos x = 1 - \\frac{x^{2}}{2!} + \\frac{x^{4}}{4!} - \\cdots$$\n\nCheck: differentiating the sine series term by term gives $1 - \\frac{x^{2}}{2!} + \\frac{x^{4}}{4!} - \\cdots$, the cosine series, as $(\\sin x)' = \\cos x$ requires.\n\nIn this lesson we recognize the series of sine, cosine and arctangent, and use them to sum numerical series.",
    "正弦是奇函数，余弦是偶函数，它们的级数也体现了这一点：正弦只有奇次幂，余弦只有偶次幂，符号交替且带阶乘：\n\n$$\\sin x = x - \\frac{x^{3}}{3!} + \\frac{x^{5}}{5!} - \\cdots, \\qquad \\cos x = 1 - \\frac{x^{2}}{2!} + \\frac{x^{4}}{4!} - \\cdots$$\n\n检验：对正弦级数逐项求导，得 $1 - \\frac{x^{2}}{2!} + \\frac{x^{4}}{4!} - \\cdots$，正是余弦级数，与 $(\\sin x)' = \\cos x$ 一致。\n\n这节课我们识别正弦、余弦和反正切的级数，并用它们求数项级数的和。",
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
        "Three series to know:\n\n$$\\sin x = \\sum_{n=0}^{\\infty} \\frac{(-1)^{n} x^{2n+1}}{(2n + 1)!}, \\quad \\cos x = \\sum_{n=0}^{\\infty} \\frac{(-1)^{n} x^{2n}}{(2n)!}, \\quad \\arctan x = \\sum_{n=0}^{\\infty} \\frac{(-1)^{n} x^{2n+1}}{2n + 1}$$\n\nOdd powers with factorials mean sine, even powers with factorials mean cosine, and odd powers over $2n + 1$ without a factorial mean arctangent. So $\\sum \\frac{(-1)^{n} 2^{2n} x^{2n}}{(2n)!} = \\cos(2x)$.\n\nCheck: its first two terms are $1 - 2x^{2}$, and $\\cos(2x)$ has $f(0) = 1$ and $f''(0) = -4$, giving the same $-\\frac{4}{2!}x^{2}$.\n\n> **Watch out.** Sine and arctangent both have odd powers; only the factorial tells them apart.",
        "需要熟记三个级数：\n\n$$\\sin x = \\sum_{n=0}^{\\infty} \\frac{(-1)^{n} x^{2n+1}}{(2n + 1)!}, \\quad \\cos x = \\sum_{n=0}^{\\infty} \\frac{(-1)^{n} x^{2n}}{(2n)!}, \\quad \\arctan x = \\sum_{n=0}^{\\infty} \\frac{(-1)^{n} x^{2n+1}}{2n + 1}$$\n\n奇次幂配阶乘是正弦，偶次幂配阶乘是余弦，奇次幂除以 $2n + 1$（没有阶乘）是反正切。所以 $\\sum \\frac{(-1)^{n} 2^{2n} x^{2n}}{(2n)!} = \\cos(2x)$。\n\n检验：它的前两项是 $1 - 2x^{2}$，而 $\\cos(2x)$ 满足 $f(0) = 1$，$f''(0) = -4$，同样给出 $-\\frac{4}{2!}x^{2}$。\n\n> **注意。** 正弦和反正切都只有奇次幂；只有阶乘能把它们区分开。",
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
        const standards = [
          "\\sin u = u - \\frac{u^{3}}{3!} + \\cdots",
          "\\cos u = 1 - \\frac{u^{2}}{2!} + \\cdots",
          "\\arctan u = u - \\frac{u^{3}}{3} + \\cdots",
        ];
        const first =
          kind === 0
            ? poly([c * k, "x"], [Q.of(-c * k ** 3, 6), "x^{3}"])
            : kind === 1
              ? poly([c, ""], [Q.of(-c * k * k, 2), "x^{2}"])
              : poly([c * k, "x"], [Q.of(-c * k ** 3, 3), "x^{3}"]);
        const why = [
          t(
            "Sine has factorials $(2n + 1)!$ in its denominators and odd powers; this series does not match that.",
            "正弦的分母是阶乘 $(2n + 1)!$，且只有奇次幂；这个级数与之不符。",
          ),
          t("Cosine has only even powers $x^{2n}$; this series has odd powers.", "余弦只有偶次幂 $x^{2n}$；这个级数是奇次幂。"),
          t(
            "Arctangent divides by $2n + 1$ with no factorial and has odd powers; this series does not match that.",
            "反正切除以 $2n + 1$（没有阶乘），且只有奇次幂；这个级数与之不符。",
          ),
        ];
        return fnWorked(
          t(`Find the function whose Maclaurin series is $${series}$.`, `求麦克劳林级数为 $${series}$ 的函数。`),
          fn(kind),
          "f(x) =",
          [
            [
              ["Match a standard series", "对应标准级数"],
              t(
                `${kind === 1 ? "Even powers with $(2n)!$" : kind === 0 ? "Odd powers with $(2n + 1)!$" : "Odd powers over $2n + 1$, with no factorial,"} match`,
                `${kind === 1 ? "偶次幂配 $(2n)!$" : kind === 0 ? "奇次幂配 $(2n + 1)!$" : "奇次幂除以 $2n + 1$（没有阶乘）"}对应`,
              ),
              [standards[kind] as string],
            ],
            [
              ["Substitute", "代换"],
              t(
                `Here $u = ${arg}$${c === 1 ? "" : `, and the whole series is multiplied by $${c}$`}:`,
                `这里 $u = ${arg}$${c === 1 ? "" : `，整个级数再乘以 $${c}$`}：`,
              ),
              [`f(x) = ${fn(kind)}`],
            ],
          ],
          t(
            `Compare the first two terms. The $n = 0$ and $n = 1$ terms of the given series are $${first}$. Putting $u = ${arg}$ into $${standards[kind]}$${c === 1 ? "" : ` and multiplying by $${c}$`} gives the same two terms.`,
            `对照前两项。所给级数 $n = 0$ 与 $n = 1$ 的项为 $${first}$。把 $u = ${arg}$ 代入 $${standards[kind]}$${c === 1 ? "" : `，再乘以 $${c}$`}，得到相同的两项。`,
          ),
          [0, 1, 2].filter((i) => i !== kind).map((i) => say(fn(i), (why[i] as Text).en, (why[i] as Text)["zh-CN"])),
        );
      },
    },
    {
      id: "sums-from-trigonometric-series",
      title: t("Sums from trigonometric series", "用三角函数级数求和"),
      explanation: t(
        "Match the factorials and the alternating signs to the sine or cosine series, then read off the value of the variable from the powers. The series\n\n$$\\sum_{n=0}^{\\infty} \\frac{(-1)^{n} \\pi^{2n}}{3^{2n} (2n)!}$$\n\nhas even powers of $\\frac{\\pi}{3}$ over $(2n)!$: it is the cosine series at $x = \\frac{\\pi}{3}$, so it equals $\\cos \\frac{\\pi}{3} = \\frac{1}{2}$.\n\nCheck: its first three terms are $1 - 0.5483 + 0.0501 = 0.5018$, already close to $0.5$.\n\n> **Watch out.** Read $x$ from the powers: $\\frac{\\pi^{2n}}{3^{2n}}$ is $\\left(\\frac{\\pi}{3}\\right)^{2n}$, so $x = \\frac{\\pi}{3}$, not $\\pi$.",
        "根据阶乘和交替的符号与正弦或余弦级数对应，再从幂中读出变量的值。级数\n\n$$\\sum_{n=0}^{\\infty} \\frac{(-1)^{n} \\pi^{2n}}{3^{2n} (2n)!}$$\n\n是 $\\frac{\\pi}{3}$ 的偶次幂除以 $(2n)!$：它是余弦级数在 $x = \\frac{\\pi}{3}$ 处的值，所以等于 $\\cos \\frac{\\pi}{3} = \\frac{1}{2}$。\n\n检验：它的前三项为 $1 - 0.5483 + 0.0501 = 0.5018$，已经接近 $0.5$。\n\n> **注意。** 从幂中读出 $x$：$\\frac{\\pi^{2n}}{3^{2n}}$ 就是 $\\left(\\frac{\\pi}{3}\\right)^{2n}$，所以 $x = \\frac{\\pi}{3}$，不是 $\\pi$。",
      ),
      generate(rng) {
        const sine = rng.bool();
        const k = rng.pick(sine ? [1, 2, 6] : [1, 2, 3]);
        const c = rng.int(1, 9);
        const value = (sine ? { 1: Q.zero, 2: Q.one, 6: Q.of(1, 2) }[k] : { 1: Q.of(-1), 2: Q.zero, 3: Q.of(1, 2) }[k]) as Q;
        const other = sine ? { 1: Q.of(-1), 2: Q.zero, 6: undefined }[k] : { 1: Q.zero, 2: Q.one, 3: undefined }[k];
        const e = sine ? "2n+1" : "2n";
        const body = `\\frac{(-1)^{n} \\pi^{${e}}}{${k === 1 ? "" : `${k}^{${e}} `}(${e === "2n" ? "2n" : "2n + 1"})!}`;
        const x = k === 1 ? "\\pi" : `\\frac{\\pi}{${k}}`;
        const answer = value.mul(Q.of(c));
        const cf = c === 1 ? "" : `${c} `;
        const xv = Math.PI / k;
        let partial = 0;
        for (let n = 0; n < 10; n++) {
          const p = sine ? 2 * n + 1 : 2 * n;
          partial += ((n % 2 === 0 ? 1 : -1) * xv ** p) / factorial(p);
        }
        const atPi = sine ? Q.zero : Q.of(-1);
        const mistakes = [
          ...(other === undefined
            ? []
            : [
                slip(
                  other.mul(Q.of(c)),
                  `This uses ${sine ? "cosine" : "sine"}. ${sine ? "Odd powers with $(2n + 1)!$ belong to sine" : "Even powers with $(2n)!$ belong to cosine"}.`,
                  `这里用成了${sine ? "余弦" : "正弦"}。${sine ? "奇次幂配 $(2n + 1)!$ 属于正弦" : "偶次幂配 $(2n)!$ 属于余弦"}。`,
                ),
              ]),
          slip(
            answer.neg(),
            `This has the wrong sign. The signs $(-1)^{n}$ are already part of the ${sine ? "sine" : "cosine"} series.`,
            `符号错了。符号 $(-1)^{n}$ 本来就是${sine ? "正弦" : "余弦"}级数的一部分。`,
          ),
          ...(k === 1
            ? []
            : [
                slip(
                  atPi.mul(Q.of(c)),
                  `This takes $x = \\pi$ and ignores the powers of $${k}$ below. They make $x = \\frac{\\pi}{${k}}$.`,
                  `这里取了 $x = \\pi$，忽略了分母中 $${k}$ 的幂。它们使 $x = \\frac{\\pi}{${k}}$。`,
                ),
              ]),
          slip(
            c,
            "This takes the function value to be $1$. Evaluate the function at the value of $x$ read from the powers.",
            "这里把函数值当成了 $1$。要在从幂中读出的 $x$ 处求函数值。",
          ),
        ];
        return worked(
          t(`Find the sum of $${c === 1 ? "" : c}${sigma(body)}$.`, `求 $${c === 1 ? "" : c}${sigma(body)}$ 的和。`),
          answer,
          [
            [
              ["Match a standard series", "对应标准级数"],
              t(
                `${sine ? "Odd powers with $(2n + 1)!$" : "Even powers with $(2n)!$"} and alternating signs form the ${sine ? "sine" : "cosine"} series. The powers are of $${x}$, so $x = ${x}$.`,
                `${sine ? "奇次幂配 $(2n + 1)!$" : "偶次幂配 $(2n)!$"}且符号交替，是${sine ? "正弦" : "余弦"}级数。幂的底数是 $${x}$，所以 $x = ${x}$。`,
              ),
            ],
            [
              ["Evaluate", "求值"],
              t(c === 1 ? "So the sum is" : `Multiply by $${c}$:`, c === 1 ? "所以和为" : `乘以 $${c}$：`),
              [`${cf}\\${sine ? "sin" : "cos"} ${x} = ${answer.toLatex()}`],
            ],
          ],
          t(
            `Add terms numerically. With $x \\approx ${xv.toFixed(4)}$, the first ten terms add to about $${dec(c * partial, 4)}$, matching $${answer.toLatex()}$.`,
            `用数值相加检验。$x \\approx ${xv.toFixed(4)}$，前十项之和约为 $${dec(c * partial, 4)}$，与 $${answer.toLatex()}$ 一致。`,
          ),
          mistakes,
        );
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
  intro: t(
    "Differentiating $\\frac{1}{1 - x} = 1 + x + x^{2} + x^{3} + \\cdots$ term by term gives\n\n$$\\frac{1}{(1 - x)^{2}} = 1 + 2x + 3x^{2} + 4x^{3} + \\cdots$$\n\nfor $|x| < 1$, the same interval.\n\nCheck: at $x = \\frac{1}{2}$ the left side is $4$, and $1 + 1 + \\frac{3}{4} + \\frac{1}{2} + \\frac{5}{16} + \\cdots$ approaches $4$.\n\nIn this lesson we differentiate power series term by term to get new series and to sum numerical series.",
    "对 $\\frac{1}{1 - x} = 1 + x + x^{2} + x^{3} + \\cdots$ 逐项求导，得\n\n$$\\frac{1}{(1 - x)^{2}} = 1 + 2x + 3x^{2} + 4x^{3} + \\cdots$$\n\n它在同一个区间 $|x| < 1$ 上成立。\n\n检验：在 $x = \\frac{1}{2}$ 处左边为 $4$，而 $1 + 1 + \\frac{3}{4} + \\frac{1}{2} + \\frac{5}{16} + \\cdots$ 趋于 $4$。\n\n这节课我们对幂级数逐项求导，得到新的级数，并求数项级数的和。",
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
        "A power series can be differentiated term by term inside its interval of convergence. If $f(x) = \\sum c_n x^{n}$ for $|x| < R$, then\n\n$$f'(x) = \\sum_{n=1}^{\\infty} n c_n x^{n-1}, \\qquad |x| < R$$\n\nDifferentiating $\\frac{1}{1 - kx} = \\sum k^{n} x^{n}$ gives $\\frac{k}{(1 - kx)^{2}} = \\sum n k^{n} x^{n-1}$. So the coefficient of $x^{m}$ in $\\frac{1}{(1 - kx)^{2}}$ is $(m + 1)k^{m}$.\n\nCheck: squaring $1 + kx + k^{2}x^{2} + \\cdots$, the $x^{2}$ term collects $k^{2}$ three times ($1 \\cdot k^{2}x^{2}$, $kx \\cdot kx$, $k^{2}x^{2} \\cdot 1$), giving $3k^{2}$.\n\n> **Watch out.** After differentiating, the power $x^{m}$ comes from $n = m + 1$, so the factor is $m + 1$, not $m$.",
        "幂级数在收敛区间内可以逐项求导。若在 $|x| < R$ 上 $f(x) = \\sum c_n x^{n}$，则\n\n$$f'(x) = \\sum_{n=1}^{\\infty} n c_n x^{n-1}, \\qquad |x| < R$$\n\n对 $\\frac{1}{1 - kx} = \\sum k^{n} x^{n}$ 求导得 $\\frac{k}{(1 - kx)^{2}} = \\sum n k^{n} x^{n-1}$。所以 $\\frac{1}{(1 - kx)^{2}}$ 中 $x^{m}$ 的系数为 $(m + 1)k^{m}$。\n\n检验：把 $1 + kx + k^{2}x^{2} + \\cdots$ 平方，$x^{2}$ 项收集到三个 $k^{2}$（$1 \\cdot k^{2}x^{2}$、$kx \\cdot kx$、$k^{2}x^{2} \\cdot 1$），得 $3k^{2}$。\n\n> **注意。** 求导后 $x^{m}$ 来自 $n = m + 1$，所以因子是 $m + 1$，不是 $m$。",
      ),
      generate(rng) {
        const k = rng.pick([-3, -2, -1, 2, 3]);
        const c = rng.int(1, 5);
        const m = rng.int(2, 5);
        const km = qpow(Q.of(k), m);
        const answer = Q.of(c * (m + 1)).mul(km);
        const base = poly([1, ""], [-k, "x"]);
        const f = `\\frac{${c}}{(${base})^{2}}`;
        return worked(
          t(
            `Differentiate the Maclaurin series of $\\frac{1}{${base}}$ to find the coefficient of $x^{${m}}$ in the Maclaurin series of $${f}$.`,
            `对 $\\frac{1}{${base}}$ 的麦克劳林级数求导，求 $${f}$ 的麦克劳林级数中 $x^{${m}}$ 的系数。`,
          ),
          answer,
          [
            [
              ["Write the known series", "写出已知级数"],
              t("The geometric series gives", "由等比级数得"),
              [`\\frac{1}{${base}} = \\sum_{n=0}^{\\infty} ${powTex(k, "n")} x^{n}`],
            ],
            [
              ["Differentiate term by term", "逐项求导"],
              t(`The chain rule brings out a factor $${k}$ on the left:`, `左边由链式法则多出因子 $${k}$：`),
              [`\\frac{${k}}{(${base})^{2}} = \\sum_{n=1}^{\\infty} n \\, ${powTex(k, "n")} x^{n-1}`],
            ],
            [
              ["Read off the coefficient", "读出系数"],
              t(
                `The power $x^{${m}}$ comes from $n = ${m + 1}$. Divide by $${k}$ and multiply by $${c}$:`,
                `$x^{${m}}$ 来自 $n = ${m + 1}$。除以 $${k}$ 再乘以 $${c}$：`,
              ),
              [`${product(`${c}`, `${m + 1}`, powTex(k, `${m}`))} = ${answer.toLatex()}`],
            ],
          ],
          t(
            `Square the series instead. In $\\left(\\sum ${powTex(k, "n")} x^{n}\\right)^{2}$ the term $x^{${m}}$ comes from the $${m + 1}$ pairs of powers $x^{i} \\cdot x^{${m} - i}$, each contributing $${powTex(k, `${m}`)}$. So the coefficient is $${m + 1} \\cdot ${powTex(k, `${m}`)}$, times $${c}$, which is $${answer.toLatex()}$ again.`,
            `改为把级数平方。在 $\\left(\\sum ${powTex(k, "n")} x^{n}\\right)^{2}$ 中，$x^{${m}}$ 来自 $${m + 1}$ 对幂 $x^{i} \\cdot x^{${m} - i}$，每对贡献 $${powTex(k, `${m}`)}$。所以系数为 $${m + 1} \\cdot ${powTex(k, `${m}`)}$，再乘以 $${c}$，同样得 $${answer.toLatex()}$。`,
          ),
          [
            slip(
              Q.of(c * m).mul(km),
              `This uses the factor $${m}$. After differentiating, $x^{${m}}$ comes from $n = ${m + 1}$, so the factor is $${m + 1}$.`,
              `这里用了因子 $${m}$。求导后 $x^{${m}}$ 来自 $n = ${m + 1}$，所以因子是 $${m + 1}$。`,
            ),
            slip(
              Q.of(c).mul(km),
              "This leaves out the factor that differentiation brings down. The coefficient of $x^{m}$ in the original series is not the one in the derivative.",
              "这里漏了求导带下来的因子。原级数中 $x^{m}$ 的系数不等于导数中的系数。",
            ),
            slip(
              Q.of(c * (m + 1)).mul(qpow(Q.of(k), m + 1)),
              `This keeps the factor $${k}$ from the chain rule. The derivative is $\\frac{${k}}{(${base})^{2}}$, so divide by $${k}$.`,
              `这里保留了链式法则带来的因子 $${k}$。导数是 $\\frac{${k}}{(${base})^{2}}$，所以要除以 $${k}$。`,
            ),
          ],
        );
      },
    },
    {
      id: "sums-by-differentiating-series",
      title: t("Sums by differentiating", "通过求导求和"),
      explanation: t(
        "Differentiating a known series brings down the index as a factor, so it gives the sums of series whose terms include the index. Differentiating $\\frac{1}{1 - x} = \\sum x^{n}$ and multiplying by $x$ gives, for $|x| < 1$,\n\n$$\\sum_{n=1}^{\\infty} n x^{n} = \\frac{x}{(1 - x)^{2}}$$\n\nAt $x = \\frac{1}{3}$: $\\sum \\frac{n}{3^{n}} = \\frac{1/3}{(2/3)^{2}} = \\frac{3}{4}$.\n\nCheck: the first five terms add to $\\frac{1}{3} + \\frac{2}{9} + \\frac{3}{27} + \\frac{4}{81} + \\frac{5}{243} \\approx 0.737$, approaching $0.75$.\n\n> **Watch out.** Differentiating gives $\\sum n x^{n-1}$; multiply by $x$ to get $\\sum n x^{n}$.",
        "对已知级数求导会把下标作为因子带下来，所以可以求出各项含下标的级数的和。对 $\\frac{1}{1 - x} = \\sum x^{n}$ 求导再乘以 $x$，当 $|x| < 1$ 时得\n\n$$\\sum_{n=1}^{\\infty} n x^{n} = \\frac{x}{(1 - x)^{2}}$$\n\n取 $x = \\frac{1}{3}$：$\\sum \\frac{n}{3^{n}} = \\frac{1/3}{(2/3)^{2}} = \\frac{3}{4}$。\n\n检验：前五项之和为 $\\frac{1}{3} + \\frac{2}{9} + \\frac{3}{27} + \\frac{4}{81} + \\frac{5}{243} \\approx 0.737$，趋近于 $0.75$。\n\n> **注意。** 求导得到的是 $\\sum n x^{n-1}$；要乘以 $x$ 才是 $\\sum n x^{n}$。",
      ),
      generate(rng) {
        const k = rng.int(2, 9);
        const c = rng.int(1, 5);
        const alternating = rng.bool();
        const x = Q.of(alternating ? -1 : 1, k);
        const base = x.div(Q.one.sub(x).mul(Q.one.sub(x)));
        const s = base.mul(Q.of(alternating ? -c : c));
        const body = alternating ? `\\frac{(-1)^{n+1} ${c === 1 ? "" : c}n}{${k}^{n}}` : `\\frac{${c === 1 ? "" : c}n}{${k}^{n}}`;
        let partial = 0;
        for (let n = 1; n <= 30; n++) partial += ((alternating && n % 2 === 0 ? -1 : 1) * c * n) / k ** n;
        const parts: Step[] = [
          [
            ["Write the series as a known one", "写成已知级数"],
            t(
              alternating
                ? `Since $(-1)^{n+1} = -(-1)^{n}$, the series is $${-c}$ times $\\sum n x^{n}$ at $x = ${x.toLatex()}$, and`
                : `The series is ${c === 1 ? "" : `$${c}$ times `}$\\sum n x^{n}$ at $x = ${x.toLatex()}$, and`,
              alternating
                ? `由于 $(-1)^{n+1} = -(-1)^{n}$，级数是 $\\sum n x^{n}$ 在 $x = ${x.toLatex()}$ 处的值的 $${-c}$ 倍，而`
                : `级数是 $\\sum n x^{n}$ 在 $x = ${x.toLatex()}$ 处的值${c === 1 ? "" : `的 $${c}$ 倍`}，而`,
            ),
            ["\\sum_{n=1}^{\\infty} n x^{n} = \\frac{x}{(1 - x)^{2}}"],
          ],
          [
            ["Evaluate", "求值"],
            t(`Put in $x = ${x.toLatex()}$:`, `代入 $x = ${x.toLatex()}$：`),
            [`\\frac{${x.toLatex()}}{\\left(${Q.one.sub(x).toLatex()}\\right)^{2}} = ${base.toLatex()}`],
          ],
          ...(c === 1 && !alternating
            ? []
            : ([
                [
                  ["Multiply", "乘以系数"],
                  t(`Multiply by $${alternating ? -c : c}$:`, `乘以 $${alternating ? -c : c}$：`),
                  [`${par(Q.of(alternating ? -c : c))} \\cdot ${par(base)} = ${s.toLatex()}`],
                ],
              ] as Step[])),
        ];
        return worked(
          t(`Find the sum of $${sigma(body, 1)}$.`, `求 $${sigma(body, 1)}$ 的和。`),
          s,
          parts,
          t(
            `Add terms numerically. The first thirty terms add to about $${dec(partial, 6)}$, and $${s.toLatex()} \\approx ${dec(s.toNumber(), 6)}$.`,
            `用数值相加检验。前三十项之和约为 $${dec(partial, 6)}$，而 $${s.toLatex()} \\approx ${dec(s.toNumber(), 6)}$。`,
          ),
          [
            slip(
              Q.of(c).div(Q.one.sub(x)),
              "This is the geometric sum $\\sum x^{n}$, without the factor $n$. Differentiating is what brings that factor down.",
              "这是等比级数 $\\sum x^{n}$ 的和，没有因子 $n$。正是求导把这个因子带了下来。",
            ),
            slip(
              s.neg(),
              alternating
                ? "This misses the sign: $(-1)^{n+1} = -(-1)^{n}$, so the series is the negative of $\\sum n x^{n}$."
                : "This has the wrong sign. Every term is positive, so the sum is positive.",
              alternating
                ? "符号漏了：$(-1)^{n+1} = -(-1)^{n}$，所以级数是 $\\sum n x^{n}$ 的相反数。"
                : "符号错了。每一项都是正的，所以和为正。",
            ),
            slip(
              Q.of(alternating ? -c : c).div(Q.one.sub(x).mul(Q.one.sub(x))),
              "This is $\\sum n x^{n-1}$, one power of $x$ short. Multiply by $x$ to get $\\sum n x^{n}$.",
              "这是 $\\sum n x^{n-1}$，少了一个 $x$。乘以 $x$ 才得到 $\\sum n x^{n}$。",
            ),
          ],
        );
      },
    },
  ],
};

/** IntegralSeries is ∫₀ˣ g(t) dt for a g with a standard series, as its first nonzero terms. */
interface IntegralSeries {
  readonly g: string;
  readonly k: number;
  readonly at: (t: number) => number;
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
      k,
      at: (x) => Math.exp(k * x * x),
      terms: [
        [Q.one, 1],
        [Q.of(k, 3), 3],
        [Q.of(k * k, 10), 5],
      ],
    };
  if (kind === 1)
    return {
      g: `\\sin(${kt})`,
      k,
      at: (x) => Math.sin(k * x * x),
      terms: [
        [Q.of(k, 3), 3],
        [Q.of(-(k ** 3), 42), 7],
        [Q.of(k ** 5, 1320), 11],
      ],
    };
  if (kind === 2)
    return {
      g: `\\cos(${kt})`,
      k,
      at: (x) => Math.cos(k * x * x),
      terms: [
        [Q.one, 1],
        [Q.of(-(k * k), 10), 5],
        [Q.of(k ** 4, 216), 9],
      ],
    };
  return {
    g: `\\frac{1}{${poly([1, ""], [k, "t^{2}"])}}`,
    k,
    at: (x) => 1 / (1 + k * x * x),
    terms: [
      [Q.one, 1],
      [Q.of(-k, 3), 3],
      [Q.of(k * k, 5), 5],
    ],
  };
}

/** xPow writes xᵉ. */
const xPow = (e: number) => (e === 1 ? "x" : `x^{${e}}`);

/** tPow writes tᵉ, or nothing for e = 0. */
const tPow = (e: number) => (e === 0 ? "" : e === 1 ? "t" : `t^{${e}}`);

/** simpson approximates the integral of g from 0 to b with Simpson's rule on 100 subintervals. */
function simpson(g: (t: number) => number, b: number): number {
  const n = 100;
  const h = b / n;
  let s = g(0) + g(b);
  for (let i = 1; i < n; i++) s += (i % 2 === 1 ? 4 : 2) * g(i * h);
  return (s * h) / 3;
}

/** approximatingIntegralsUsingTaylorSeries integrates series term by term. */
export const approximatingIntegralsUsingTaylorSeries: TopicDef = {
  id: "approximating-integrals-using-taylor-series",
  title: t("Approximating Integrals Using Taylor Series", "用泰勒级数近似积分"),
  summary: t(
    "Replace an integrand that has no elementary antiderivative by its Taylor series, integrate term by term, and add the first few terms.",
    "把没有初等原函数的被积函数换成它的泰勒级数，逐项积分，再取前几项求和。",
  ),
  intro: t(
    "No formula gives an antiderivative of $e^{-t^{2}}$, but its series is easy to integrate. Since $e^{-t^{2}} = 1 - t^{2} + \\frac{t^{4}}{2} - \\cdots$,\n\n$$\\int_{0}^{x} e^{-t^{2}} \\, dt = x - \\frac{x^{3}}{3} + \\frac{x^{5}}{10} - \\cdots$$\n\nCheck: differentiating the right side term by term gives $1 - x^{2} + \\frac{x^{4}}{2} - \\cdots$, the series of $e^{-x^{2}}$, as the fundamental theorem requires.\n\nIn this lesson we integrate series term by term to write integrals as series and to estimate definite integrals.",
    "$e^{-t^{2}}$ 的原函数没有公式，但它的级数很容易积分。由于 $e^{-t^{2}} = 1 - t^{2} + \\frac{t^{4}}{2} - \\cdots$，\n\n$$\\int_{0}^{x} e^{-t^{2}} \\, dt = x - \\frac{x^{3}}{3} + \\frac{x^{5}}{10} - \\cdots$$\n\n检验：对右边逐项求导得 $1 - x^{2} + \\frac{x^{4}}{2} - \\cdots$，正是 $e^{-x^{2}}$ 的级数，与微积分基本定理一致。\n\n这节课我们对级数逐项积分，把积分写成级数，并估计定积分的值。",
  ),
  prerequisites: ["recognizing-standard-maclaurin-series-for-trigonometric-functions", "differentiating-taylor-series"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "series-for-an-integral",
      title: t("A series for an integral", "积分的级数"),
      explanation: t(
        "A power series can be integrated term by term inside its interval of convergence. $e^{-t^{2}}$ has no elementary antiderivative, but $e^{-t^{2}} = 1 - t^{2} + \\frac{t^{4}}{2} - \\cdots$, so\n\n$$\\int_{0}^{x} e^{-t^{2}} \\, dt = x - \\frac{x^{3}}{3} + \\frac{x^{5}}{10} - \\cdots$$\n\nEach $t^{m}$ becomes $\\frac{x^{m+1}}{m + 1}$.\n\nCheck: differentiating $x - \\frac{x^{3}}{3} + \\frac{x^{5}}{10}$ gives back $1 - x^{2} + \\frac{x^{4}}{2}$.\n\n> **Watch out.** Divide each coefficient by the new power: $\\frac{t^{4}}{2}$ integrates to $\\frac{x^{5}}{10}$, not $\\frac{x^{5}}{2}$.",
        "在收敛区间内部，幂级数可以逐项积分。$e^{-t^{2}}$ 没有初等原函数，但 $e^{-t^{2}} = 1 - t^{2} + \\frac{t^{4}}{2} - \\cdots$，所以\n\n$$\\int_{0}^{x} e^{-t^{2}} \\, dt = x - \\frac{x^{3}}{3} + \\frac{x^{5}}{10} - \\cdots$$\n\n每个 $t^{m}$ 变成 $\\frac{x^{m+1}}{m + 1}$。\n\n检验：对 $x - \\frac{x^{3}}{3} + \\frac{x^{5}}{10}$ 求导，得回 $1 - x^{2} + \\frac{x^{4}}{2}$。\n\n> **注意。** 每个系数都要除以新的次数：$\\frac{t^{4}}{2}$ 积分后是 $\\frac{x^{5}}{10}$，不是 $\\frac{x^{5}}{2}$。",
      ),
      generate(rng) {
        const s = integralSeries(rng);
        const answer = poly(...s.terms.map(([c, e]) => [c, xPow(e)] as const));
        const integrand = poly(...s.terms.map(([c, e]) => [c.mul(Q.of(e)), tPow(e - 1)] as const));
        const back = poly(...s.terms.map(([c, e]) => [c.mul(Q.of(e)), e === 1 ? "" : xPow(e - 1)] as const));
        return fnWorked(
          t(
            `Find the first three nonzero terms of the Maclaurin series for $F(x) = \\int_{0}^{x} ${s.g} \\, dt$, and give their sum.`,
            `求 $F(x) = \\int_{0}^{x} ${s.g} \\, dt$ 的麦克劳林级数的前三个非零项，写出它们的和。`,
          ),
          answer,
          "",
          [
            [
              ["Expand the integrand", "展开被积函数"],
              t("Put $t^{2}$ into a standard series:", "把 $t^{2}$ 代入标准级数："),
              [`${s.g} = ${integrand} + \\cdots`],
            ],
            [
              ["Integrate term by term", "逐项积分"],
              t("Each $t^{m}$ becomes $\\frac{x^{m+1}}{m + 1}$:", "每个 $t^{m}$ 变成 $\\frac{x^{m+1}}{m + 1}$："),
              [`F(x) = ${answer} + \\cdots`],
            ],
          ],
          t(
            `Differentiate the answer term by term. This gives $${back}$, which is the series of the integrand with $x$ in place of $t$, as $F'(x) = ${s.g.replaceAll("t", "x")}$ requires.`,
            `对答案逐项求导，得 $${back}$，正是被积函数以 $x$ 代 $t$ 的级数，与 $F'(x) = ${s.g.replaceAll("t", "x")}$ 一致。`,
          ),
          [
            say(
              poly(...s.terms.map(([c, e]) => [c.mul(Q.of(e)), xPow(e)] as const)),
              "This raises each power but does not divide by the new power.",
              "这里提高了每项的次数，却没有除以新的次数。",
            ),
            say(
              poly(...s.terms.map(([c, e]) => [c, xPow(e + 1)] as const)),
              "Each power is one too high. Integrating $t^{m}$ gives $x^{m+1}$, so the powers here are those of the answer, not one more.",
              "每项的次数都多了一。$t^{m}$ 积分后是 $x^{m+1}$，次数应与答案一致，不能再加一。",
            ),
            say(
              back,
              "This is the series of the integrand itself, with $x$ in place of $t$. It still has to be integrated.",
              "这是被积函数本身的级数（以 $x$ 代 $t$）。还需要积分。",
            ),
          ],
        );
      },
    },
    {
      id: "estimating-a-definite-integral",
      title: t("Estimating a definite integral", "估计定积分的值"),
      explanation: t(
        "Integrate the series and substitute the upper limit. With three terms,\n\n$$\\int_{0}^{1/2} e^{-t^{2}} \\, dt \\approx \\frac{1}{2} - \\frac{(1/2)^{3}}{3} + \\frac{(1/2)^{5}}{10} = \\frac{443}{960}$$\n\nwhich is about $0.46146$. Since the series alternates, the error is at most the next term, $\\frac{(1/2)^{7}}{42} \\approx 0.0002$.\n\nCheck: a numerical integration by Simpson's rule gives $0.46128$, within that error.\n\n> **Watch out.** Substitute the upper limit into the integrated series, not into the series of the integrand.",
        "对级数积分后代入上限。取三项，\n\n$$\\int_{0}^{1/2} e^{-t^{2}} \\, dt \\approx \\frac{1}{2} - \\frac{(1/2)^{3}}{3} + \\frac{(1/2)^{5}}{10} = \\frac{443}{960}$$\n\n约为 $0.46146$。由于级数正负交替，误差不超过下一项 $\\frac{(1/2)^{7}}{42} \\approx 0.0002$。\n\n检验：用辛普森法数值积分得 $0.46128$，在这个误差之内。\n\n> **注意。** 上限要代入积分后的级数，而不是被积函数的级数。",
      ),
      generate(rng) {
        const s = integralSeries(rng);
        const choices = [Q.of(1, 2), Q.of(1, 3), Q.of(1, 4), Q.of(1, 5), Q.of(1, 10), Q.one, Q.of(2, 3), Q.of(3, 4)].filter(
          (b) => Math.abs(s.k) * b.toNumber() ** 2 <= 0.5,
        );
        const b = rng.pick(choices);
        const values = s.terms.map(([c, e]) => c.mul(qpow(b, e)));
        const [v0, v1, v2] = values as [Q, Q, Q];
        const answer = v0.add(v1).add(v2);
        const F = poly(...s.terms.map(([c, e]) => [c, xPow(e)] as const));
        const numeric = simpson(s.at, b.toNumber());
        const sum = values
          .map((v) => v.toLatex())
          .join(" + ")
          .replaceAll("+ -", "- ");
        return worked(
          t(
            `Use the first three nonzero terms of a Maclaurin series to approximate $\\int_{0}^{${b.toLatex()}} ${s.g} \\, dt$.`,
            `用麦克劳林级数的前三个非零项近似 $\\int_{0}^{${b.toLatex()}} ${s.g} \\, dt$。`,
          ),
          answer,
          [
            [
              ["Integrate the series", "对级数积分"],
              t("Expand the integrand and integrate term by term:", "展开被积函数并逐项积分："),
              [`\\int_{0}^{x} ${s.g} \\, dt = ${F} + \\cdots`],
            ],
            [
              ["Substitute the upper limit", "代入上限"],
              t(`Put in $x = ${b.toLatex()}$ and add:`, `代入 $x = ${b.toLatex()}$ 并相加：`),
              [`${sum} = ${answer.toLatex()}`],
            ],
          ],
          t(
            `Integrate numerically instead. Simpson's rule with $100$ subintervals gives about $${dec(numeric, 6)}$, and $${answer.toLatex()} \\approx ${dec(answer.toNumber(), 6)}$. They differ by only about $${small(Math.abs(numeric - answer.toNumber()) || 1e-9)}$, the size of the terms left out.`,
            `改用数值积分。用 $100$ 个小区间的辛普森法得约 $${dec(numeric, 6)}$，而 $${answer.toLatex()} \\approx ${dec(answer.toNumber(), 6)}$。两者只相差约 $${small(Math.abs(numeric - answer.toNumber()) || 1e-9)}$，即舍去各项的大小。`,
          ),
          [
            slip(
              v0.add(v1),
              "This uses only two terms. The question asks for the first three nonzero terms.",
              "这里只用了两项。题目要求前三个非零项。",
            ),
            slip(
              v0.sub(v1).add(v2),
              "This changes the sign of the second term. Each term keeps the sign of its coefficient.",
              "这里改变了第二项的符号。每一项的符号都与其系数相同。",
            ),
            slip(
              v0.add(v1).sub(v2),
              "This changes the sign of the third term. Each term keeps the sign of its coefficient.",
              "这里改变了第三项的符号。每一项的符号都与其系数相同。",
            ),
          ],
        );
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
