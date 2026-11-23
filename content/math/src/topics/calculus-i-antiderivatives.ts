import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Coefficient, dec, linear, poly, Q } from "@ga/subject-math";

import { functionProblem, steps } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { reasoned } from "../wrong-reasons.ts";
import { oneOf } from "./calculus-common.ts";

// Calculus I unit 8: Integration, module 8.23.

/** Step is one labelled step of a solution: its title in both languages, what it says, and the lines it displays. */
type Step = readonly [title: readonly [string, string], say: Text, lines?: readonly string[]];

/** walked writes labelled steps, each with its displayed lines, followed by a check that takes a second route. */
function walked(parts: readonly Step[], check: Text): Text {
  const write = (locale: keyof Text) =>
    parts
      .map(
        ([[en, zh], say, lines = []], i) =>
          `${stepLabel(i + 1, en, zh)[locale]} ${say[locale]}${lines.length > 0 ? steps(...lines) : "\n\n"}`,
      )
      .join("") + (locale === "en" ? `**Check.** ${check.en}` : `**检验。** ${check["zh-CN"]}`);
  return t(write("en"), write("zh-CN"));
}

/** fmt writes a value rounded to the given number of decimal places, without trailing zeros. */
const fmt = (v: number, places = 3) => dec(Q.of(Math.round(v * 10 ** places) || 0, 10 ** places));

/** pq writes a rational in LaTeX, in sized parentheses when it is negative. */
const pq = (q: Q) => (q.sign() < 0 ? `\\left(${q.toLatex()}\\right)` : q.toLatex());

/** pn writes an integer, in parentheses when it is negative. */
const pn = (n: number) => (n < 0 ? `(${n})` : `${n}`);

/** fracOf writes k over a denominator, with the sign in front of the fraction: "\frac{3}{x}", "-\frac{3}{x}". */
const fracOf = (k: number, den: string) => (k < 0 ? `-\\frac{${-k}}{${den}}` : `\\frac{${k}}{${den}}`);

/** powerLatex writes x raised to a rational exponent: "x", "x^{3}", "x^{-\frac{1}{2}}". */
const powerLatex = (e: Q, v = "x") => (e.eq(Q.one) ? v : `${v}^{${e.toLatex()}}`);

/** pw writes x raised to a rational exponent, or nothing for the exponent 0. */
const pw = (e: Q) => (e.isZero() ? "" : powerLatex(e));

/** plusC writes an antiderivative from its terms, ending in "+ C". */
const plusC = (...terms: (readonly [Coefficient, string])[]) => `${poly(...terms) || "0"} + C`;

/** coef writes a coefficient in front of a function: "", "-", "3", "\frac{1}{2}". */
const coef = (c: Q) => (c.eq(Q.one) ? "" : c.eq(Q.one.neg()) ? "-" : c.toLatex());

/** xPow writes x to a natural power: "", "x", "x^{2}". */
const xPow = (i: number) => (i === 0 ? "" : i === 1 ? "x" : `x^{${i}}`);

/** exponents are the exponents used for the power rule, excluding −1 and 0. */
const exponents: readonly Q[] = [
  ...[-5, -4, -3, -2, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => Q.of(n)),
  Q.of(1, 2),
  Q.of(3, 2),
  Q.of(5, 2),
  Q.of(-1, 2),
  Q.of(-3, 2),
  Q.of(1, 3),
  Q.of(2, 3),
  Q.of(-1, 3),
  Q.of(4, 3),
];

/** powerTerm chooses k·x^n and returns its integrand and antiderivative terms. */
function powerTerm(rng: Rng, k = 1) {
  const n = rng.pick(exponents);
  const up = n.add(Q.one);
  return { n, integrand: [Q.of(k), powerLatex(n)] as const, antiderivative: [Q.of(k).div(up), powerLatex(up)] as const };
}

/** powerCheck differentiates c·x^(n + 1) back to k·x^n in a displayed line. */
const powerCheck = (c: Q, n: Q) => {
  const up = n.add(Q.one);
  const back = c.mul(up);
  return `\\frac{d}{dx}\\left(${poly([c, powerLatex(up)])}\\right) = ${pq(c)} \\cdot ${pq(up)}${pw(n) ? ` ${pw(n)}` : ""} = ${poly([back, pw(n)]) || "0"}`;
};

/** theAntiderivative introduces antiderivatives and the power rule. */
export const theAntiderivative: TopicDef = {
  id: "the-antiderivative",
  title: t("The Antiderivative", "原函数"),
  summary: t(
    "Recognize antiderivatives, integrate powers of x, and fix the constant of integration from a known value.",
    "识别原函数，求 x 的幂的不定积分，并由已知值确定积分常数。",
  ),
  prerequisites: ["differentiating-trigonometric-functions"],
  encompasses: [],
  xp: 10,
  standards: [],
  intro: t(
    `Differentiation takes a function to its rate of change. Run it backwards and ask which function has derivative $\\cos x$. We know that the derivative of $\\sin x$ is $\\cos x$, so $\\sin x$ is one answer. So is $\\sin x + 5$, because a constant differentiates to $0$.

Check: the derivative of $\\sin x + 5$ is $\\cos x + 0$, which is $\\cos x$.

In this lesson we recognize antiderivatives by differentiating them, integrate powers of $x$ with the power rule, and use a known value to pick one antiderivative from the family.`,
    `求导把函数变成它的变化率。反过来问：哪个函数的导数是 $\\cos x$？我们知道 $\\sin x$ 的导数是 $\\cos x$，所以 $\\sin x$ 是一个答案。$\\sin x + 5$ 也是，因为常数的导数是 $0$。

检验：$\\sin x + 5$ 的导数是 $\\cos x + 0$，也就是 $\\cos x$。

这节课我们通过求导来识别原函数，用幂法则求 $x$ 的幂的积分，并用一个已知值从原函数族中选出一个原函数。`,
  ),
  knowledgePoints: [
    {
      id: "recognizing-antiderivatives",
      title: t("Recognizing antiderivatives", "识别原函数"),
      explanation: t(
        "$F$ is an antiderivative of $f$ if $F'(x) = f(x)$. To check a candidate, differentiate it. Antiderivatives are not unique: $F(x) + C$ works for every constant $C$, and on an interval these are all of them, since a function whose derivative is $0$ everywhere on an interval is constant there. The family is written $\\int f(x) \\, dx = F(x) + C$. For example, $F(x) = x^{3} + 7$ is an antiderivative of $f(x) = 3x^{2}$, because $F'(x) = 3x^{2}$.\n\nCheck: $x^{3} - 2$ is one too. Its derivative is also $3x^{2}$, and it differs from $x^{3} + 7$ by the constant $9$.\n\n> **Watch out.** Differentiate the candidate and compare the result with $f$. Do not differentiate $f$ itself: the derivative of $3x^{2}$ is $6x$, which answers a different question.",
        "若 $F'(x) = f(x)$，则 $F$ 是 $f$ 的一个原函数。检验候选函数时，对它求导即可。原函数不唯一：对任意常数 $C$，$F(x) + C$ 都是；在一个区间上原函数只有这些，因为在区间上导数处处为 $0$ 的函数在该区间上是常数。这一族函数记作 $\\int f(x) \\, dx = F(x) + C$。例如，$F(x) = x^{3} + 7$ 是 $f(x) = 3x^{2}$ 的一个原函数，因为 $F'(x) = 3x^{2}$。\n\n检验：$x^{3} - 2$ 也是。它的导数同样是 $3x^{2}$，它与 $x^{3} + 7$ 相差常数 $9$。\n\n> **注意。** 要对候选函数求导，再把结果与 $f$ 比较。不要对 $f$ 本身求导：$3x^{2}$ 的导数是 $6x$，那是另一个问题的答案。",
      ),
      generate(rng) {
        const a = rng.nonZero(-5, 5);
        const b = rng.int(2, 4);
        const c = rng.nonZero(-9, 9);
        const kind = rng.int(0, 2);
        const [f, right, x0, F, wrong]: [string, string, number, (x: number) => number, (readonly [string, string, string])[]] =
          kind === 0
            ? [
                poly([a * (b + 1), `x^{${b}}`]),
                poly([a, `x^{${b + 1}}`], [c, ""]),
                1,
                (x) => a * x ** (b + 1) + c,
                [
                  [
                    poly([a * (b + 1) * b, xPow(b - 1)]),
                    "This is $f'(x)$: it differentiates $f$ instead of undoing a derivative.",
                    "这是 $f'(x)$：它是对 $f$ 求导，而不是求原函数。",
                  ],
                  [
                    poly([a * (b + 1), `x^{${b + 1}}`]),
                    `Its derivative is $${poly([a * (b + 1) * (b + 1), `x^{${b}}`])}$: the coefficient was not divided by the new exponent $${b + 1}$.`,
                    `它的导数是 $${poly([a * (b + 1) * (b + 1), `x^{${b}}`])}$：系数没有除以新的指数 $${b + 1}$。`,
                  ],
                  [
                    poly([a, `x^{${b + 1}}`], [c, "x"]),
                    `Its derivative is $${poly([a * (b + 1), `x^{${b}}`], [c, ""])}$: the term $${poly([c, "x"])}$ differentiates to $${c}$, not to $0$.`,
                    `它的导数是 $${poly([a * (b + 1), `x^{${b}}`], [c, ""])}$：$${poly([c, "x"])}$ 这一项的导数是 $${c}$，不是 $0$。`,
                  ],
                ],
              ]
            : kind === 1
              ? [
                  poly([a, "\\cos x"]),
                  poly([a, "\\sin x"], [c, ""]),
                  0,
                  (x) => a * Math.sin(x) + c,
                  [
                    [
                      poly([-a, "\\sin x"]),
                      `Its derivative is $${poly([-a, "\\cos x"])}$, with the opposite sign.`,
                      `它的导数是 $${poly([-a, "\\cos x"])}$，符号相反。`,
                    ],
                    [
                      poly([-a, "\\cos x"]),
                      `Its derivative is $${poly([a, "\\sin x"])}$: it is an antiderivative of a sine, not of a cosine.`,
                      `它的导数是 $${poly([a, "\\sin x"])}$：它是正弦的原函数，不是余弦的原函数。`,
                    ],
                    [
                      poly([a, "x\\sin x"]),
                      `By the product rule its derivative is $${poly([a, "\\sin x"], [a, "x\\cos x"])}$, which has an extra term.`,
                      `由乘积法则，它的导数是 $${poly([a, "\\sin x"], [a, "x\\cos x"])}$，多了一项。`,
                    ],
                  ],
                ]
              : [
                  poly([a, "e^{x}"]),
                  poly([a, "e^{x}"], [c, ""]),
                  0,
                  (x) => a * Math.exp(x) + c,
                  [
                    [
                      poly([a, "xe^{x}"]),
                      `By the product rule its derivative is $${poly([a, "e^{x}"], [a, "xe^{x}"])}$, which has an extra term.`,
                      `由乘积法则，它的导数是 $${poly([a, "e^{x}"], [a, "xe^{x}"])}$，多了一项。`,
                    ],
                    [
                      poly([a, "e^{x + 1}"]),
                      `Its derivative is $${poly([a, "e^{x + 1}"])}$, which is $e$ times $f(x)$.`,
                      `它的导数是 $${poly([a, "e^{x + 1}"])}$，是 $f(x)$ 的 $e$ 倍。`,
                    ],
                    [
                      poly([a, "xe^{x - 1}"]),
                      `By the product rule its derivative is $${poly([a, "e^{x - 1}"], [a, "xe^{x - 1}"])}$, not $f(x)$.`,
                      `由乘积法则，它的导数是 $${poly([a, "e^{x - 1}"], [a, "xe^{x - 1}"])}$，不是 $f(x)$。`,
                    ],
                  ],
                ];
        const fx0 = kind === 0 ? a * (b + 1) : a;
        const slope = fmt((F(x0 + 0.001) - F(x0)) / 0.001);
        return reasoned(
          oneOf(
            rng,
            t(`Which function is an antiderivative of $f(x) = ${f}$?`, `下列哪个函数是 $f(x) = ${f}$ 的原函数？`),
            t(`$${right}$`, `$${right}$`),
            wrong.map(([w]) => t(`$${w}$`, `$${w}$`)),
            walked(
              [
                [
                  ["Differentiate the candidate", "对候选函数求导"],
                  t(
                    `An antiderivative of $f$ is a function whose derivative is $f$. Differentiate $${right}$:`,
                    `$f$ 的原函数是导数等于 $f$ 的函数。对 $${right}$ 求导：`,
                  ),
                  [`\\frac{d}{dx}\\left(${right}\\right) = ${f}`],
                ],
                [
                  ["Account for the constant", "看常数项"],
                  t(
                    `The constant $${c}$ differentiates to $0$, so it does not change the derivative. The result is $f(x)$, so $${right}$ is an antiderivative of $f$.`,
                    `常数 $${c}$ 的导数是 $0$，不改变导数。结果正是 $f(x)$，所以 $${right}$ 是 $f$ 的原函数。`,
                  ),
                ],
              ],
              t(
                `Over a short step the slope of $F(x) = ${right}$ should match $f$. From $x = ${x0}$ to $x = ${x0 + 0.001}$:${steps(`\\frac{F(${x0 + 0.001}) - F(${x0})}{0.001} \\approx ${slope}`)}This is close to $f(${x0}) = ${fx0}$.`,
                `在很短的一步上，$F(x) = ${right}$ 的斜率应与 $f$ 一致。从 $x = ${x0}$ 到 $x = ${x0 + 0.001}$：${steps(`\\frac{F(${x0 + 0.001}) - F(${x0})}{0.001} \\approx ${slope}`)}这与 $f(${x0}) = ${fx0}$ 很接近。`,
              ),
            ),
          ),
          wrong.map(([w, en, zh]) => [`$${w}$`, en, zh] as const),
        );
      },
    },
    {
      id: "the-power-rule-for-integration",
      title: t("The power rule for integration", "积分的幂法则"),
      explanation: t(
        "Reversing the power rule for derivatives: for $n \\ne -1$,\n\n$$\\int x^{n} \\, dx = \\frac{x^{n + 1}}{n + 1} + C.$$\n\nRaise the exponent by one, then divide by the new exponent. Rewrite roots and reciprocals as powers first: $\\frac{1}{x^{3}}$ is $x^{-3}$ and $\\sqrt{x}$ is $x^{\\frac{1}{2}}$. For example, for $\\int x^{4} \\, dx$ the exponent $4$ becomes $5$, and dividing by $5$ gives $\\frac{x^{5}}{5} + C$.\n\nCheck: differentiating $\\frac{x^{5}}{5}$ brings down the $5$, which cancels the division and gives $x^{4}$ back.\n\n> **Watch out.** Divide by the new exponent, not the old one: $\\int x^{4} \\, dx$ is not $\\frac{x^{5}}{4} + C$. And the rule needs $n \\ne -1$; for $x^{-1}$ it would divide by $0$.",
        "把求导的幂法则反过来：当 $n \\ne -1$ 时，\n\n$$\\int x^{n} \\, dx = \\frac{x^{n + 1}}{n + 1} + C$$\n\n指数加一，再除以新的指数。先把根式和倒数写成幂：$\\frac{1}{x^{3}}$ 是 $x^{-3}$，$\\sqrt{x}$ 是 $x^{\\frac{1}{2}}$。例如，对 $\\int x^{4} \\, dx$，指数 $4$ 变成 $5$，再除以 $5$，得 $\\frac{x^{5}}{5} + C$。\n\n检验：对 $\\frac{x^{5}}{5}$ 求导，指数 $5$ 乘到前面，与除以 $5$ 抵消，得回 $x^{4}$。\n\n> **注意。** 要除以新的指数，而不是原来的指数：$\\int x^{4} \\, dx$ 不是 $\\frac{x^{5}}{4} + C$。另外这个法则要求 $n \\ne -1$；对 $x^{-1}$ 它会除以 $0$。",
      ),
      generate(rng) {
        const { n, antiderivative } = powerTerm(rng);
        const shown =
          rng.bool(0.4) && n.sign() < 0 && n.d === 1n
            ? `\\frac{1}{x^{${n.neg().toLatex()}}}`
            : n.eq(Q.of(1, 2)) && rng.bool()
              ? "\\sqrt{x}"
              : powerLatex(n);
        const up = n.add(Q.one);
        const answer = plusC(antiderivative);
        return functionProblem({
          prompt: t(`Find $\\int ${shown} \\, dx$.`, `求 $\\int ${shown} \\, dx$。`),
          answer,
          antiderivative: true,
          wrong: [plusC([Q.one, powerLatex(up)]), plusC([n, pw(n.sub(Q.one))]), plusC([up, powerLatex(up)])],
          solution: walked(
            [
              [
                ["Write it as a power", "写成幂"],
                shown === powerLatex(n)
                  ? t(
                      `The integrand is $${powerLatex(n)}$ with $n = ${n.toLatex()}$. This is not $-1$, so the power rule applies.`,
                      `被积函数是 $${powerLatex(n)}$，$n = ${n.toLatex()}$。它不等于 $-1$，所以可以用幂法则。`,
                    )
                  : t(
                      `Write $${shown}$ as $${powerLatex(n)}$, so $n = ${n.toLatex()}$. This is not $-1$, so the power rule applies.`,
                      `把 $${shown}$ 写成 $${powerLatex(n)}$，所以 $n = ${n.toLatex()}$。它不等于 $-1$，所以可以用幂法则。`,
                    ),
              ],
              [
                ["Raise the exponent and divide", "指数加一再相除"],
                t("Add one to the exponent, then divide by the new exponent:", "指数加一，再除以新的指数："),
                [
                  `${n.toLatex()} + 1 = ${up.toLatex()}`,
                  `\\int ${shown} \\, dx = \\frac{${powerLatex(up)}}{${up.toLatex()}} + C = ${answer}`,
                ],
              ],
            ],
            t(
              `Differentiate the answer. The exponent $${up.toLatex()}$ comes down and cancels the division:${steps(powerCheck(antiderivative[0], n))}This is the integrand.`,
              `对答案求导。指数 $${up.toLatex()}$ 乘到前面，与除法抵消：${steps(powerCheck(antiderivative[0], n))}这正是被积函数。`,
            ),
          ),
        });
      },
    },
    {
      id: "antiderivatives-through-a-point",
      title: t("Antiderivatives through a point", "过定点的原函数"),
      explanation: t(
        "A known value picks one antiderivative from the family. Integrate to get $F(x) + C$, substitute the known point, and solve for $C$. If $f'(x) = 6x^{2}$ and $f(1) = 5$, then $f(x) = 2x^{3} + C$. So $2 + C = 5$, which gives $C = 3$ and $f(x) = 2x^{3} + 3$.\n\nCheck: $f(1) = 2 \\cdot 1^{3} + 3 = 5$, and the derivative of $2x^{3} + 3$ is $6x^{2}$.\n\n> **Watch out.** $C$ is not the given value. Substitute the point into $F(x) + C$ and solve. Here $f(1) = 5$, but $C = 3$.",
        "已知一个函数值，就能从原函数族中确定一个。先积分得 $F(x) + C$，代入已知点，解出 $C$。若 $f'(x) = 6x^{2}$ 且 $f(1) = 5$，则 $f(x) = 2x^{3} + C$。所以 $2 + C = 5$，得 $C = 3$，$f(x) = 2x^{3} + 3$。\n\n检验：$f(1) = 2 \\cdot 1^{3} + 3 = 5$，而 $2x^{3} + 3$ 的导数是 $6x^{2}$。\n\n> **注意。** $C$ 不是已知的函数值。要把点代入 $F(x) + C$ 再求解。这里 $f(1) = 5$，但 $C = 3$。",
      ),
      generate(rng) {
        const p = [rng.int(-9, 9), rng.int(-4, 4), rng.nonZero(-3, 3)] as const;
        const a = rng.nonZero(-2, 2);
        const y = rng.int(-10, 10);
        // f'(x) = 3p2 x² + 2p1 x + p0, so that f has integer coefficients.
        const fPrime = poly([3 * p[2], "x^{2}"], [2 * p[1], "x"], [p[0], ""]);
        const F = poly([p[2], "x^{3}"], [p[1], "x^{2}"], [p[0], "x"]);
        const base = p[2] * a ** 3 + p[1] * a * a + p[0] * a;
        const c = y - base;
        const answer = poly([p[2], "x^{3}"], [p[1], "x^{2}"], [p[0], "x"], [c, ""]);
        const sub = `${p[2] === 1 ? "" : p[2] === -1 ? "-" : `${p[2]} \\cdot `}${pn(a)}^{3}${p[1] === 0 ? "" : ` ${p[1] < 0 ? "-" : "+"} ${Math.abs(p[1]) === 1 ? "" : `${Math.abs(p[1])} \\cdot `}${pn(a)}^{2}`}${p[0] === 0 ? "" : ` ${p[0] < 0 ? "-" : "+"} ${Math.abs(p[0]) === 1 ? "" : `${Math.abs(p[0])} \\cdot `}${pn(a)}`}`;
        return functionProblem({
          prompt: t(`Find $f(x)$ if $f'(x) = ${fPrime}$ and $f(${a}) = ${y}$.`, `已知 $f'(x) = ${fPrime}$，$f(${a}) = ${y}$，求 $f(x)$。`),
          prefix: "f(x) =",
          answer,
          wrong: [
            poly([p[2], "x^{3}"], [p[1], "x^{2}"], [p[0], "x"], [y, ""]) || "0",
            F,
            poly([p[2], "x^{3}"], [p[1], "x^{2}"], [p[0], "x"], [y + base, ""]) || "0",
          ],
          solution: walked(
            [
              [
                ["Integrate", "积分"],
                t("Integrate term by term with the power rule, and write one constant:", "用幂法则逐项积分，只写一个常数："),
                [`f(x) = ${F} + C`],
              ],
              [
                ["Use the known value", "用已知值"],
                t(`Substitute $x = ${a}$ and solve for $C$:`, `代入 $x = ${a}$，解出 $C$：`),
                [`f(${a}) = ${base} + C = ${y}`, `C = ${c}`, `f(x) = ${answer}`],
              ],
            ],
            t(
              `The derivative of $${answer}$ is $${fPrime}$, as given. Substituting $x = ${a}$ directly:${steps(`${sub}${c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`} = ${y}`)}This is the given value $f(${a}) = ${y}$.`,
              `$${answer}$ 的导数是 $${fPrime}$，与已知相同。直接代入 $x = ${a}$：${steps(`${sub}${c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`} = ${y}`)}这正是已知的 $f(${a}) = ${y}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theConstantMultipleRuleForIndefiniteIntegrals integrates constant multiples of powers. */
export const theConstantMultipleRuleForIndefiniteIntegrals: TopicDef = {
  id: "the-constant-multiple-rule-for-indefinite-integrals",
  title: t("The Constant Multiple Rule for Indefinite Integrals", "不定积分的常数倍法则"),
  summary: t("Integrate constant multiples of powers of x.", "求 x 的幂的常数倍的不定积分。"),
  prerequisites: ["the-antiderivative"],
  encompasses: [{ topic: "the-antiderivative", weight: 0.5 }],
  xp: 8,
  standards: [],
  intro: t(
    `The power rule gives $\\int x^{2} \\, dx = \\frac{x^{3}}{3} + C$. A constant factor in front of the power stays as a factor: $\\int 5x^{2} \\, dx = \\frac{5x^{3}}{3} + C$.

Check: differentiating $\\frac{5x^{3}}{3}$ gives $\\frac{5 \\cdot 3x^{2}}{3}$, which is $5x^{2}$.

In this lesson we take constants out of integrals, and rewrite roots and reciprocals as powers so that the power rule applies to them.`,
    `幂法则给出 $\\int x^{2} \\, dx = \\frac{x^{3}}{3} + C$。幂前面的常数因子保留为因子：$\\int 5x^{2} \\, dx = \\frac{5x^{3}}{3} + C$。

检验：对 $\\frac{5x^{3}}{3}$ 求导得 $\\frac{5 \\cdot 3x^{2}}{3}$，即 $5x^{2}$。

这节课我们把常数提到积分号外，并把根式和倒数改写成幂，使幂法则可以用于它们。`,
  ),
  knowledgePoints: [
    {
      id: "constant-multiples-of-powers",
      title: t("Constant multiples of powers", "幂的常数倍"),
      explanation: t(
        "To integrate a power, increase the exponent by one and divide by the new exponent, which reverses the power rule for derivatives. Constants come out of integrals: $\\int k f(x) \\, dx = k \\int f(x) \\, dx$. So $\\int 6x^{2} \\, dx = 6 \\cdot \\frac{x^{3}}{3} + C = 2x^{3} + C$.\n\nCheck: differentiating $2x^{3}$ gives $6x^{2}$.\n\n> **Watch out.** Divide only by the new exponent; the constant stays as a factor. $\\int 6x^{2} \\, dx$ is not $6x^{3} + C$, and it is not $\\frac{x^{3}}{3} + C$.",
        "对幂积分时，把指数加 1 再除以新的指数，这正好是求导幂法则的逆过程。常数可以提到积分号外：$\\int k f(x) \\, dx = k \\int f(x) \\, dx$。所以 $\\int 6x^{2} \\, dx = 6 \\cdot \\frac{x^{3}}{3} + C = 2x^{3} + C$。\n\n检验：对 $2x^{3}$ 求导得 $6x^{2}$。\n\n> **注意。** 只除以新的指数，常数保留为因子。$\\int 6x^{2} \\, dx$ 不是 $6x^{3} + C$，也不是 $\\frac{x^{3}}{3} + C$。",
      ),
      generate(rng) {
        const k = rng.pick([-12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
        const { n, integrand, antiderivative } = powerTerm(rng, k);
        const up = n.add(Q.one);
        const answer = plusC(antiderivative);
        return functionProblem({
          prompt: t(`Find $\\int ${poly(integrand)} \\, dx$.`, `求 $\\int ${poly(integrand)} \\, dx$。`),
          answer,
          antiderivative: true,
          wrong: [plusC([Q.of(k), powerLatex(up)]), plusC([Q.of(k).mul(up), powerLatex(up)]), plusC([Q.of(k).mul(n), pw(n.sub(Q.one))])],
          solution: walked(
            [
              [
                ["Take the constant out", "把常数提出来"],
                t(`The constant $${k}$ comes out of the integral:`, `常数 $${k}$ 可以提到积分号外：`),
                [`\\int ${poly(integrand)} \\, dx = ${k} \\int ${powerLatex(n)} \\, dx`],
              ],
              [
                ["Use the power rule", "用幂法则"],
                t(
                  `The exponent becomes $${up.toLatex()}$; divide by it and keep the factor $${k}$:`,
                  `指数变为 $${up.toLatex()}$；除以它，并保留因子 $${k}$：`,
                ),
                [`${k} \\int ${powerLatex(n)} \\, dx = ${k} \\cdot \\frac{${powerLatex(up)}}{${up.toLatex()}} + C = ${answer}`],
              ],
            ],
            t(
              `Differentiate the answer:${steps(powerCheck(antiderivative[0], n))}This is the integrand.`,
              `对答案求导：${steps(powerCheck(antiderivative[0], n))}这正是被积函数。`,
            ),
          ),
        });
      },
    },
    {
      id: "constant-multiples-of-roots-and-reciprocals",
      title: t("Constant multiples of roots and reciprocals", "根式与倒数的常数倍"),
      explanation: t(
        "Roots and reciprocals must be rewritten as powers before integrating, because the power rule only applies once the expression is a power of the variable. Rewrite first, then integrate: $\\frac{k}{x^{n}}$ is $kx^{-n}$ and $k\\sqrt[m]{x^{p}}$ is $kx^{\\frac{p}{m}}$. For example,\n\n$$\\int \\frac{4}{\\sqrt{x}} \\, dx = \\int 4x^{-\\frac{1}{2}} \\, dx = 8x^{\\frac{1}{2}} + C.$$\n\nCheck: differentiating $8x^{\\frac{1}{2}}$ brings down the exponent one half and gives $4x^{-\\frac{1}{2}}$, which is the integrand.\n\n> **Watch out.** A root in the denominator gives a negative exponent: $\\frac{1}{\\sqrt{x}}$ is $x^{-\\frac{1}{2}}$, not $x^{\\frac{1}{2}}$. Rewrite the whole integrand as a power before using the rule.",
        "积分前必须把根式和倒数改写成幂，因为只有当式子是变量的幂时才能用幂法则。先改写再积分：$\\frac{k}{x^{n}}$ 是 $kx^{-n}$，$k\\sqrt[m]{x^{p}}$ 是 $kx^{\\frac{p}{m}}$。例如\n\n$$\\int \\frac{4}{\\sqrt{x}} \\, dx = \\int 4x^{-\\frac{1}{2}} \\, dx = 8x^{\\frac{1}{2}} + C$$\n\n检验：对 $8x^{\\frac{1}{2}}$ 求导，指数二分之一乘到前面，得 $4x^{-\\frac{1}{2}}$，正是被积函数。\n\n> **注意。** 分母中的根式给出负指数：$\\frac{1}{\\sqrt{x}}$ 是 $x^{-\\frac{1}{2}}$，不是 $x^{\\frac{1}{2}}$。用法则之前，先把整个被积函数改写成幂。",
      ),
      generate(rng) {
        const k = rng.int(2, 12);
        const kind = rng.int(0, 3);
        const m = rng.int(2, 6);
        const [shown, n] =
          kind === 0
            ? [`\\frac{${k}}{x^{${m}}}`, Q.of(-m)]
            : kind === 1
              ? [`${k}\\sqrt{x}`, Q.of(1, 2)]
              : kind === 2
                ? [`\\frac{${k}}{\\sqrt{x}}`, Q.of(-1, 2)]
                : [`${k}\\sqrt[3]{x}`, Q.of(1, 3)];
        const up = n.add(Q.one);
        const anti = [Q.of(k).div(up), powerLatex(up)] as const;
        const power = poly([Q.of(k), powerLatex(n)]);
        return functionProblem({
          prompt: t(`Find $\\int ${shown} \\, dx$.`, `求 $\\int ${shown} \\, dx$。`),
          answer: plusC(anti),
          antiderivative: true,
          wrong: [
            plusC([Q.of(k), powerLatex(up)]),
            plusC([Q.of(k).mul(up), powerLatex(up)]),
            plusC([Q.of(k).div(n.sub(Q.one)), powerLatex(n.sub(Q.one))]),
          ],
          solution: walked(
            [
              [
                ["Rewrite as a power", "改写成幂"],
                t(
                  kind === 0 || kind === 2 ? "The power in the denominator gets a negative exponent:" : "A root is a fractional exponent:",
                  kind === 0 || kind === 2 ? "分母中的幂得到负指数：" : "根式就是分数指数：",
                ),
                [`${shown} = ${power}`],
              ],
              [
                ["Use the power rule", "用幂法则"],
                t(
                  `The exponent becomes $${up.toLatex()}$; divide by it and keep the factor $${k}$:`,
                  `指数变为 $${up.toLatex()}$；除以它，并保留因子 $${k}$：`,
                ),
                [`\\int ${power} \\, dx = ${k} \\cdot \\frac{${powerLatex(up)}}{${up.toLatex()}} + C = ${plusC(anti)}`],
              ],
            ],
            t(
              `Differentiate the answer:${steps(powerCheck(anti[0], n))}This is $${shown}$, the integrand.`,
              `对答案求导：${steps(powerCheck(anti[0], n))}这就是被积函数 $${shown}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theSumRuleForIndefiniteIntegrals integrates sums term by term. */
export const theSumRuleForIndefiniteIntegrals: TopicDef = {
  id: "the-sum-rule-for-indefinite-integrals",
  title: t("The Sum Rule for Indefinite Integrals", "不定积分的和法则"),
  summary: t(
    "Integrate polynomials and other sums term by term, expanding products and quotients first.",
    "逐项积分多项式和其他和式，必要时先展开乘积和商。",
  ),
  prerequisites: ["the-constant-multiple-rule-for-indefinite-integrals"],
  encompasses: [{ topic: "the-constant-multiple-rule-for-indefinite-integrals", weight: 0.5 }],
  xp: 10,
  standards: [],
  intro: t(
    `By the constant multiple rule, $\\int 6x^{2} \\, dx = 2x^{3} + C$ and $\\int 4x \\, dx = 2x^{2} + C$. The integral of $6x^{2} + 4x$ is the sum of these, $2x^{3} + 2x^{2} + C$, with a single constant.

Check: differentiating $2x^{3} + 2x^{2}$ gives $6x^{2} + 4x$.

In this lesson we integrate polynomials term by term, and expand products and split quotients before integrating.`,
    `由常数倍法则，$\\int 6x^{2} \\, dx = 2x^{3} + C$，$\\int 4x \\, dx = 2x^{2} + C$。$6x^{2} + 4x$ 的积分就是二者之和 $2x^{3} + 2x^{2} + C$，只需一个常数。

检验：对 $2x^{3} + 2x^{2}$ 求导得 $6x^{2} + 4x$。

这节课我们逐项积分多项式，并在积分前展开乘积、拆开商。`,
  ),
  knowledgePoints: [
    {
      id: "integrating-polynomials",
      title: t("Integrating polynomials", "多项式的积分"),
      explanation: t(
        "Because an integral of a sum is the sum of the integrals, a polynomial is integrated term by term, and only one constant is needed for the whole answer: $\\int (f + g) \\, dx = \\int f \\, dx + \\int g \\, dx$. For example, $\\int (3x^{2} - 4x + 5) \\, dx = x^{3} - 2x^{2} + 5x + C$.\n\nCheck: differentiating $x^{3} - 2x^{2} + 5x$ gives $3x^{2} - 4x + 5$ back.\n\n> **Watch out.** The constant term integrates to a multiple of $x$, not to $0$: $\\int 5 \\, dx = 5x + C$. And one $+ C$ is enough, since the constants of the separate terms add up to one constant.",
        "由于和的积分等于积分的和，多项式可以逐项积分，整个答案只需要一个常数：$\\int (f + g) \\, dx = \\int f \\, dx + \\int g \\, dx$。例如，$\\int (3x^{2} - 4x + 5) \\, dx = x^{3} - 2x^{2} + 5x + C$。\n\n检验：对 $x^{3} - 2x^{2} + 5x$ 求导，得回 $3x^{2} - 4x + 5$。\n\n> **注意。** 常数项积分后是 $x$ 的倍数，不是 $0$：$\\int 5 \\, dx = 5x + C$。另外只需一个 $+ C$，因为各项的常数加起来就是一个常数。",
      ),
      generate(rng) {
        const deg = rng.int(2, 3);
        const cs = [...Array.from({ length: deg }, () => rng.int(-9, 9)), rng.nonZero(-8, 8)];
        const terms = cs.map((c, i) => [c, i] as const).reverse();
        const integrand = poly(...terms.map(([c, i]) => [c, xPow(i)] as const));
        const anti = terms.map(([c, i]) => [Q.of(c, i + 1), xPow(i + 1)] as const);
        const answer = plusC(...anti);
        return functionProblem({
          prompt: t(`Find $\\int (${integrand}) \\, dx$.`, `求 $\\int (${integrand}) \\, dx$。`),
          answer,
          antiderivative: true,
          wrong: [
            plusC(...terms.map(([c, i]) => [c, xPow(i + 1)] as const)),
            plusC(...anti.slice(0, -1)),
            plusC(...terms.map(([c, i]) => [c * i, xPow(Math.max(i - 1, 0))] as const)),
          ],
          solution: walked(
            [
              [
                ["Integrate each term", "逐项积分"],
                t("Each power goes up by $1$, and each coefficient is divided by the new power:", "每一项的次数加 $1$，系数除以新的次数："),
                terms
                  .filter(([c]) => c !== 0)
                  .map(([c, i]) => `\\int ${poly([c, xPow(i)])} \\, dx = ${poly([Q.of(c, i + 1), xPow(i + 1)])}`),
              ],
              [
                ["Add, with one constant", "相加，只写一个常数"],
                t("The sum rule adds the pieces:", "由和法则把各部分相加："),
                [`\\int (${integrand}) \\, dx = ${answer}`],
              ],
            ],
            t(
              `Differentiate the answer term by term:${steps(`\\frac{d}{dx}\\left(${poly(...anti)}\\right) = ${integrand}`)}This is the integrand.`,
              `对答案逐项求导：${steps(`\\frac{d}{dx}\\left(${poly(...anti)}\\right) = ${integrand}`)}这正是被积函数。`,
            ),
          ),
        });
      },
    },
    {
      id: "expanding-before-integrating",
      title: t("Expanding before integrating", "先展开再积分"),
      explanation: t(
        "There is no product or quotient rule for integrals. Expand products and split quotients into separate terms first:\n\n$$\\int \\frac{x^{3} + 4}{x^{2}} \\, dx = \\int (x + 4x^{-2}) \\, dx = \\frac{x^{2}}{2} - 4x^{-1} + C.$$\n\nCheck: differentiating $\\frac{x^{2}}{2} - 4x^{-1}$ gives $x + 4x^{-2}$, and $x + 4x^{-2}$ times $x^{2}$ is $x^{3} + 4$.\n\n> **Watch out.** The integral of a product is not the product of the integrals: $\\int x \\cdot x \\, dx$ is $\\frac{x^{3}}{3} + C$, not $\\frac{x^{2}}{2} \\cdot \\frac{x^{2}}{2} + C$.",
        "积分没有乘积法则或商法则。先展开乘积，把商拆成单独的项：\n\n$$\\int \\frac{x^{3} + 4}{x^{2}} \\, dx = \\int (x + 4x^{-2}) \\, dx = \\frac{x^{2}}{2} - 4x^{-1} + C$$\n\n检验：对 $\\frac{x^{2}}{2} - 4x^{-1}$ 求导得 $x + 4x^{-2}$，而 $x + 4x^{-2}$ 乘以 $x^{2}$ 是 $x^{3} + 4$。\n\n> **注意。** 乘积的积分不等于积分的乘积：$\\int x \\cdot x \\, dx$ 是 $\\frac{x^{3}}{3} + C$，不是 $\\frac{x^{2}}{2} \\cdot \\frac{x^{2}}{2} + C$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-6, 6);
        const b = rng.nonZero(-6, 6);
        if (rng.bool()) {
          const mid = a + b;
          const integrand = `(${linear(1, a)})(${linear(1, b)})`;
          const expanded = poly([1, "x^{2}"], [mid, "x"], [a * b, ""]);
          const anti = [
            [Q.of(1, 3), "x^{3}"],
            [Q.of(mid, 2), "x^{2}"],
            [Q.of(a * b), "x"],
          ] as const;
          const half = (c: number) => poly([Q.of(1, 2), "x^{2}"], [c, "x"]);
          return functionProblem({
            prompt: t(`Find $\\int ${integrand} \\, dx$.`, `求 $\\int ${integrand} \\, dx$。`),
            answer: plusC(...anti),
            antiderivative: true,
            wrong: [
              `\\left(${half(a)}\\right)\\left(${half(b)}\\right) + C`,
              plusC([Q.of(1, 3), "x^{3}"], [Q.of(a * b), "x"]),
              plusC([Q.one, "x^{3}"], [Q.of(mid), "x^{2}"], [Q.of(a * b), "x"]),
            ],
            solution: walked(
              [
                [
                  ["Expand", "展开"],
                  t("There is no product rule for integrals, so multiply out first:", "积分没有乘积法则，所以先乘开："),
                  [`${integrand} = ${expanded}`],
                ],
                [
                  ["Integrate term by term", "逐项积分"],
                  t("Use the power rule on each term:", "对每一项用幂法则："),
                  [`\\int (${expanded}) \\, dx = ${plusC(...anti)}`],
                ],
              ],
              t(
                `Differentiate the answer:${steps(`\\frac{d}{dx}\\left(${poly(...anti)}\\right) = ${expanded}`)}This is the expanded integrand.`,
                `对答案求导：${steps(`\\frac{d}{dx}\\left(${poly(...anti)}\\right) = ${expanded}`)}这正是展开后的被积函数。`,
              ),
            ),
          });
        }
        const n = rng.int(2, 3);
        const top = poly([1, `x^{${n + 1}}`], [b, ""]);
        const split = poly([1, "x"], [b, `x^{${-n}}`]);
        const anti = [
          [Q.of(1, 2), "x^{2}"],
          [Q.of(b, 1 - n), `x^{${1 - n}}`],
        ] as const;
        return functionProblem({
          prompt: t(`Find $\\int \\frac{${top}}{x^{${n}}} \\, dx$.`, `求 $\\int \\frac{${top}}{x^{${n}}} \\, dx$。`),
          answer: plusC(...anti),
          antiderivative: true,
          wrong: [
            `\\frac{${poly([Q.of(1, n + 2), `x^{${n + 2}}`], [b, "x"])}}{${Q.of(1, n + 1).toLatex()}x^{${n + 1}}} + C`,
            plusC([Q.of(1, 2), "x^{2}"], [Q.of(b, 1 + n), `x^{${1 + n}}`]),
            plusC([Q.of(1, 2), "x^{2}"], [Q.of(b), `x^{${1 - n}}`]),
          ],
          solution: walked(
            [
              [
                ["Split the quotient", "拆开商"],
                t("Divide each term of the numerator by the denominator:", "把分子的每一项分别除以分母："),
                [
                  `\\frac{${top}}{x^{${n}}} = \\frac{x^{${n + 1}}}{x^{${n}}} ${b < 0 ? "-" : "+"} \\frac{${Math.abs(b)}}{x^{${n}}} = ${split}`,
                ],
              ],
              [
                ["Integrate term by term", "逐项积分"],
                t("Use the power rule on each term:", "对每一项用幂法则："),
                [`\\int (${split}) \\, dx = ${plusC(...anti)}`],
              ],
            ],
            t(
              `Differentiate the answer:${steps(`\\frac{d}{dx}\\left(${poly(...anti)}\\right) = ${split}`)}Multiplying by $x^{${n}}$ gives $${top}$, the numerator.`,
              `对答案求导：${steps(`\\frac{d}{dx}\\left(${poly(...anti)}\\right) = ${split}`)}乘以 $x^{${n}}$ 得 $${top}$，正是分子。`,
            ),
          ),
        });
      },
    },
  ],
};

/** integratingTheReciprocalFunction integrates 1/x. */
export const integratingTheReciprocalFunction: TopicDef = {
  id: "integrating-the-reciprocal-function",
  title: t("Integrating the Reciprocal Function", "倒数函数的积分"),
  summary: t("Integrate 1/x as ln|x|, alone and within sums and quotients.", "把 1/x 积分为 ln|x|，包括在和式与商中的情形。"),
  prerequisites: ["the-sum-rule-for-indefinite-integrals"],
  encompasses: [{ topic: "the-sum-rule-for-indefinite-integrals", weight: 0.3 }],
  xp: 8,
  standards: [],
  intro: t(
    `The power rule integrates every power of $x$ except one. For $x^{-1}$ the new exponent would be $0$, and the rule would divide by $0$. Another function steps in: the derivative of $\\ln x$ is $\\frac{1}{x}$, so $\\ln x$ is an antiderivative of $\\frac{1}{x}$ for $x > 0$.

Check: $\\ln 2.001 - \\ln 2 \\approx 0.0005$, so over a step of $0.001$ the slope of $\\ln x$ at $2$ is about $0.5$, which is $\\frac{1}{2}$.

In this lesson we integrate $\\frac{1}{x}$ as $\\ln|x|$, on its own and inside sums and quotients.`,
    `幂法则可以积分 $x$ 的所有幂，只有一个例外。对 $x^{-1}$，新的指数是 $0$，法则会除以 $0$。这时由另一个函数来补位：$\\ln x$ 的导数是 $\\frac{1}{x}$，所以当 $x > 0$ 时 $\\ln x$ 是 $\\frac{1}{x}$ 的一个原函数。

检验：$\\ln 2.001 - \\ln 2 \\approx 0.0005$，所以在长 $0.001$ 的一步上，$\\ln x$ 在 $2$ 处的斜率约为 $0.5$，即 $\\frac{1}{2}$。

这节课我们把 $\\frac{1}{x}$ 积分为 $\\ln|x|$，包括它单独出现以及出现在和式与商中的情形。`,
  ),
  knowledgePoints: [
    {
      id: "integrating-one-over-x",
      title: t("Integrating 1/x", "1/x 的积分"),
      explanation: t(
        "The power rule fails for $n = -1$. Instead, the derivative of $\\ln|x|$ is $\\frac{1}{x}$ for $x \\ne 0$, so\n\n$$\\int \\frac{1}{x} \\, dx = \\ln|x| + C.$$\n\nThe absolute value makes the antiderivative valid for negative $x$ too. For example, $\\int \\frac{5}{x} \\, dx = 5\\ln|x| + C$.\n\nCheck: for $x < 0$, $\\ln|x|$ is $\\ln(-x)$, and by the chain rule its derivative is $\\frac{-1}{-x}$, which is $\\frac{1}{x}$.\n\n> **Watch out.** Do not use the power rule here: it would give $\\frac{x^{0}}{0}$, a division by zero. And keep the absolute value, since $\\ln x$ alone is defined only for $x > 0$.",
        "幂法则在 $n = -1$ 时失效。不过当 $x \\ne 0$ 时 $\\ln|x|$ 的导数是 $\\frac{1}{x}$，所以\n\n$$\\int \\frac{1}{x} \\, dx = \\ln|x| + C$$\n\n绝对值使原函数对负的 $x$ 也成立。例如，$\\int \\frac{5}{x} \\, dx = 5\\ln|x| + C$。\n\n检验：当 $x < 0$ 时，$\\ln|x|$ 就是 $\\ln(-x)$，由链式法则它的导数是 $\\frac{-1}{-x}$，即 $\\frac{1}{x}$。\n\n> **注意。** 这里不能用幂法则：它会给出 $\\frac{x^{0}}{0}$，要除以零。另外要保留绝对值，因为 $\\ln x$ 只在 $x > 0$ 时有定义。",
      ),
      generate(rng) {
        const k = rng.nonZero(-12, 12);
        const extra = rng.bool() ? powerTerm(rng, rng.nonZero(-6, 6)) : undefined;
        const recip = fracOf(k, "x");
        const shown = extra ? `${poly(extra.integrand)} ${k < 0 ? "-" : "+"} \\frac{${Math.abs(k)}}{x}` : recip;
        const terms = [...(extra ? [extra.antiderivative] : []), [Q.of(k), "\\ln|x|"] as const];
        const integral = `\\int ${extra ? `\\left(${shown}\\right)` : shown} \\, dx`;
        return functionProblem({
          prompt: t(`Find $${integral}$.`, `求 $${integral}$。`),
          answer: plusC(...terms),
          antiderivative: true,
          wrong: [
            plusC(...(extra ? [extra.antiderivative] : []), [Q.of(-k), "x^{-2}"]),
            plusC(...(extra ? [extra.antiderivative] : []), [Q.of(k), "x"]),
            plusC(...(extra ? [extra.antiderivative] : []), [Q.of(1, k), "\\ln|x|"]),
          ],
          solution: walked(
            [
              [
                ["Integrate the reciprocal term", "积分倒数项"],
                t(
                  "The power rule fails for $x^{-1}$, so use the logarithm, whose derivative is the reciprocal:",
                  "幂法则对 $x^{-1}$ 失效，所以用对数，它的导数正是倒数：",
                ),
                [`\\frac{d}{dx}\\ln|x| = \\frac{1}{x}`, `\\int ${recip} \\, dx = ${poly([k, "\\ln|x|"])} + C`],
              ],
              extra
                ? [
                    ["Integrate the power term", "积分幂函数项"],
                    t(
                      "The power term uses the power rule. Then add the two, with one constant:",
                      "幂函数项用幂法则。再把两部分相加，只写一个常数：",
                    ),
                    [`\\int ${poly(extra.integrand)} \\, dx = ${poly(extra.antiderivative)} + C`, `${integral} = ${plusC(...terms)}`],
                  ]
                : [
                    ["Keep the absolute value", "保留绝对值"],
                    t(
                      `The answer $${plusC(...terms)}$ holds on both sides of $0$. For $x < 0$, $\\ln|x|$ is $\\ln(-x)$, and its derivative is still $\\frac{1}{x}$.`,
                      `答案 $${plusC(...terms)}$ 在 $0$ 的两侧都成立。当 $x < 0$ 时，$\\ln|x|$ 是 $\\ln(-x)$，它的导数仍是 $\\frac{1}{x}$。`,
                    ),
                  ],
            ],
            t(
              `Differentiate the answer:${steps(`\\frac{d}{dx}\\left(${poly(...terms)}\\right) = ${shown}`)}This is the integrand.`,
              `对答案求导：${steps(`\\frac{d}{dx}\\left(${poly(...terms)}\\right) = ${shown}`)}这正是被积函数。`,
            ),
          ),
        });
      },
    },
    {
      id: "quotients-that-produce-logarithms",
      title: t("Quotients that produce logarithms", "产生对数的商"),
      explanation: t(
        "Split a quotient over $x$ into terms. The terms with powers other than $x^{-1}$ use the power rule, and the term with $x^{-1}$ gives a logarithm:\n\n$$\\int \\frac{x^{2} + 3}{x} \\, dx = \\int \\left(x + \\frac{3}{x}\\right) dx = \\frac{x^{2}}{2} + 3\\ln|x| + C.$$\n\nCheck: differentiating $\\frac{x^{2}}{2} + 3\\ln|x|$ gives $x + \\frac{3}{x}$, and $x + \\frac{3}{x}$ times $x$ is $x^{2} + 3$.\n\n> **Watch out.** Only the term with $x^{-1}$ becomes a logarithm. And $\\int \\frac{3}{x} \\, dx$ is $3\\ln|x| + C$, not $-3x^{-2} + C$: that is the derivative of $\\frac{3}{x}$, not an antiderivative.",
        "把除以 $x$ 的商拆成若干项。次数不是 $x^{-1}$ 的项用幂法则，含 $x^{-1}$ 的项积分得对数：\n\n$$\\int \\frac{x^{2} + 3}{x} \\, dx = \\int \\left(x + \\frac{3}{x}\\right) dx = \\frac{x^{2}}{2} + 3\\ln|x| + C$$\n\n检验：对 $\\frac{x^{2}}{2} + 3\\ln|x|$ 求导得 $x + \\frac{3}{x}$，而 $x + \\frac{3}{x}$ 乘以 $x$ 是 $x^{2} + 3$。\n\n> **注意。** 只有含 $x^{-1}$ 的项才变成对数。另外 $\\int \\frac{3}{x} \\, dx$ 是 $3\\ln|x| + C$，不是 $-3x^{-2} + C$：后者是 $\\frac{3}{x}$ 的导数，不是原函数。",
      ),
      generate(rng) {
        const n = rng.int(1, 3);
        const a = rng.nonZero(-6, 6);
        const b = rng.nonZero(-9, 9);
        const top = poly([a, `x^{${n + 1}}`], [b, ""]);
        const den = rng.pick([1, 2, 3]);
        const anti = [
          [Q.of(a, den * (n + 1)), `x^{${n + 1}}`],
          [Q.of(b, den), "\\ln|x|"],
        ] as const;
        const denL = den === 1 ? "x" : `${den}x`;
        const r = Q.of(Math.abs(b), den);
        const powerPart = poly([Q.of(a, den), xPow(n)]);
        const logPart = `${b < 0 ? "-" : ""}\\frac{${r.n}}{${r.d === 1n ? "" : r.d}x}`;
        const split = `${powerPart} ${b < 0 ? "-" : "+"} \\frac{${r.n}}{${r.d === 1n ? "" : r.d}x}`;
        return functionProblem({
          prompt: t(`Find $\\int \\frac{${top}}{${denL}} \\, dx$.`, `求 $\\int \\frac{${top}}{${denL}} \\, dx$。`),
          answer: plusC(...anti),
          antiderivative: true,
          wrong: [
            plusC([Q.of(a, den * (n + 1)), `x^{${n + 1}}`], [Q.of(-b, den), "x^{-2}"]),
            plusC([Q.of(a, den), `x^{${n + 1}}`], [Q.of(b, den), "\\ln|x|"]),
            plusC([Q.of(a, den * (n + 1)), `x^{${n + 1}}`]),
          ],
          solution: walked(
            [
              [
                ["Split the quotient", "拆开商"],
                t("Divide each term of the numerator by the denominator:", "把分子的每一项分别除以分母："),
                [`\\frac{${top}}{${denL}} = ${split}`],
              ],
              [
                ["Integrate each term", "逐项积分"],
                t("The power uses the power rule, and the reciprocal gives a logarithm:", "幂用幂法则，倒数积分得对数："),
                [`\\int ${powerPart} \\, dx = ${poly(anti[0])} + C`, `\\int ${logPart} \\, dx = ${poly(anti[1])} + C`],
              ],
              [
                ["Add, with one constant", "相加，只写一个常数"],
                t("The sum rule adds the pieces:", "由和法则把各部分相加："),
                [`\\int \\frac{${top}}{${denL}} \\, dx = ${plusC(...anti)}`],
              ],
            ],
            t(
              `Differentiate the answer:${steps(`\\frac{d}{dx}\\left(${poly(...anti)}\\right) = ${split}`)}Putting this over the denominator $${denL}$ gives back $\\frac{${top}}{${denL}}$.`,
              `对答案求导：${steps(`\\frac{d}{dx}\\left(${poly(...anti)}\\right) = ${split}`)}通分到分母 $${denL}$ 上，就得回 $\\frac{${top}}{${denL}}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** integratingExponentialFunctions integrates e^(kx + b) and a^x. */
export const integratingExponentialFunctions: TopicDef = {
  id: "integrating-exponential-functions",
  title: t("Integrating Exponential Functions", "指数函数的积分"),
  summary: t("Integrate natural and general exponential functions.", "求自然指数函数和一般指数函数的积分。"),
  prerequisites: ["the-sum-rule-for-indefinite-integrals"],
  encompasses: [],
  xp: 8,
  standards: [],
  intro: t(
    `The derivative of $e^{x}$ is $e^{x}$, so $e^{x}$ is its own antiderivative: $\\int e^{x} \\, dx = e^{x} + C$. With the sum rule, $\\int (e^{x} + 2x) \\, dx = e^{x} + x^{2} + C$.

Check: differentiating $e^{x} + x^{2}$ gives $e^{x} + 2x$.

In this lesson we integrate $e^{kx + b}$, dividing by $k$, and exponentials $a^{x}$ of other bases, dividing by $\\ln a$.`,
    `$e^{x}$ 的导数是 $e^{x}$，所以 $e^{x}$ 是它自己的原函数：$\\int e^{x} \\, dx = e^{x} + C$。用和法则，$\\int (e^{x} + 2x) \\, dx = e^{x} + x^{2} + C$。

检验：对 $e^{x} + x^{2}$ 求导得 $e^{x} + 2x$。

这节课我们积分 $e^{kx + b}$（要除以 $k$），以及其他底数的指数函数 $a^{x}$（要除以 $\\ln a$）。`,
  ),
  knowledgePoints: [
    {
      id: "integrating-natural-exponentials",
      title: t("Integrating natural exponentials", "自然指数函数的积分"),
      explanation: t(
        "The exponential function is its own antiderivative: $\\int e^{x} \\, dx = e^{x} + C$. With a linear exponent, divide by its coefficient, since differentiating $e^{kx + b}$ multiplies by $k$: $\\int e^{kx + b} \\, dx = \\frac{1}{k}e^{kx + b} + C$. For example, $\\int e^{3x} \\, dx = \\frac{1}{3}e^{3x} + C$.\n\nCheck: differentiating $\\frac{1}{3}e^{3x}$ gives $\\frac{1}{3} \\cdot 3e^{3x}$, which is $e^{3x}$.\n\n> **Watch out.** Divide by $k$, do not multiply: $\\int e^{3x} \\, dx$ is not $3e^{3x} + C$, which is the derivative. The exponent stays the same; do not raise it by one as in the power rule.",
        "指数函数是它自己的原函数：$\\int e^{x} \\, dx = e^{x} + C$。指数为一次式时，除以其系数，因为对 $e^{kx + b}$ 求导会乘以 $k$：$\\int e^{kx + b} \\, dx = \\frac{1}{k}e^{kx + b} + C$。例如，$\\int e^{3x} \\, dx = \\frac{1}{3}e^{3x} + C$。\n\n检验：对 $\\frac{1}{3}e^{3x}$ 求导得 $\\frac{1}{3} \\cdot 3e^{3x}$，即 $e^{3x}$。\n\n> **注意。** 要除以 $k$，不是乘以 $k$：$\\int e^{3x} \\, dx$ 不是 $3e^{3x} + C$，那是导数。指数保持不变，不要像幂法则那样把它加一。",
      ),
      generate(rng) {
        const a = rng.nonZero(-12, 12);
        const k = rng.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
        const b = rng.int(-4, 4);
        const e = `e^{${linear(k, b)}}`;
        const c = Q.of(a, k);
        const integrand = poly([a, e]);
        return functionProblem({
          prompt: t(`Find $\\int ${integrand} \\, dx$.`, `求 $\\int ${integrand} \\, dx$。`),
          answer: plusC([c, e]),
          antiderivative: true,
          wrong: [plusC([Q.of(a * k), e]), plusC([Q.of(a), e]), plusC([Q.of(-a, k), e])],
          solution: walked(
            [
              [
                ["Find the chain-rule factor", "找出链式法则的因子"],
                t(
                  `Differentiating $${e}$ multiplies it by $${k}$, the coefficient of $x$ in the exponent:`,
                  `对 $${e}$ 求导会乘以 $${k}$，即指数中 $x$ 的系数：`,
                ),
                [`\\frac{d}{dx}${e} = ${poly([k, e])}`],
              ],
              [
                ["Divide by it", "除以这个因子"],
                t(`To undo that factor, divide the coefficient $${a}$ by $${k}$:`, `为抵消这个因子，把系数 $${a}$ 除以 $${k}$：`),
                [`${a} \\div ${pn(k)} = ${c.toLatex()}`, `\\int ${integrand} \\, dx = ${plusC([c, e])}`],
              ],
            ],
            t(
              `Differentiate the answer:${steps(`\\frac{d}{dx}\\left(${poly([c, e])}\\right) = ${pq(c)} \\cdot ${pn(k)}${e} = ${integrand}`)}This is the integrand.`,
              `对答案求导：${steps(`\\frac{d}{dx}\\left(${poly([c, e])}\\right) = ${pq(c)} \\cdot ${pn(k)}${e} = ${integrand}`)}这正是被积函数。`,
            ),
          ),
        });
      },
    },
    {
      id: "integrating-general-exponentials",
      title: t("Integrating general exponentials", "一般指数函数的积分"),
      explanation: t(
        "Differentiating a power of another base produces an extra natural logarithm factor, so integrating must divide by that same factor. Since $\\frac{d}{dx}a^{x} = a^{x}\\ln a$, we get $\\int a^{x} \\, dx = \\frac{a^{x}}{\\ln a} + C$ for $a > 0$, $a \\ne 1$. For example, $\\int 2^{x} \\, dx = \\frac{2^{x}}{\\ln 2} + C$.\n\nCheck: differentiating $\\frac{2^{x}}{\\ln 2}$ gives $\\frac{2^{x}\\ln 2}{\\ln 2}$, which is $2^{x}$.\n\n> **Watch out.** $a^{x}$ is not a power of $x$, so the power rule does not apply: $\\int 2^{x} \\, dx$ is not $\\frac{2^{x + 1}}{x + 1} + C$. Divide by $\\ln a$; multiplying by it gives the derivative instead.",
        "对其他底数的指数函数求导会多出一个自然对数因子，所以积分时要除以这个因子。由于 $\\frac{d}{dx}a^{x} = a^{x}\\ln a$，当 $a > 0$、$a \\ne 1$ 时 $\\int a^{x} \\, dx = \\frac{a^{x}}{\\ln a} + C$。例如，$\\int 2^{x} \\, dx = \\frac{2^{x}}{\\ln 2} + C$。\n\n检验：对 $\\frac{2^{x}}{\\ln 2}$ 求导得 $\\frac{2^{x}\\ln 2}{\\ln 2}$，即 $2^{x}$。\n\n> **注意。** $a^{x}$ 不是 $x$ 的幂，不能用幂法则：$\\int 2^{x} \\, dx$ 不是 $\\frac{2^{x + 1}}{x + 1} + C$。要除以 $\\ln a$；乘以它得到的是导数。",
      ),
      generate(rng) {
        const base = rng.pick([2, 3, 5, 7, 10]);
        const k = rng.int(1, 12);
        const withPower = rng.bool();
        const p = rng.nonZero(-6, 6);
        const n = rng.int(2, 5);
        const kTimes = k === 1 ? "" : `${k} \\cdot `;
        const expTerm = `${kTimes}${base}^{x}`;
        const powTerm = poly([p, `x^{${n}}`]);
        const powAnti = poly([Q.of(p, n + 1), `x^{${n + 1}}`]);
        const shown = withPower ? `${expTerm} ${p < 0 ? "-" : "+"} ${poly([Math.abs(p), `x^{${n}}`])}` : expTerm;
        const integrand = withPower ? `(${shown})` : shown;
        const expAnti = `\\frac{${kTimes}${base}^{x}}{\\ln ${base}}`;
        const answer = `${expAnti}${withPower ? ` ${p < 0 ? "-" : "+"} ${poly([Q.of(Math.abs(p), n + 1), `x^{${n + 1}}`])}` : ""} + C`;
        return functionProblem({
          prompt: t(`Find $\\int ${integrand} \\, dx$.`, `求 $\\int ${integrand} \\, dx$。`),
          answer,
          antiderivative: true,
          wrong: [
            `${kTimes}${base}^{x}\\ln ${base} + C`,
            `${k === 1 ? "" : `${k} \\cdot `}\\frac{${base}^{x + 1}}{x + 1} + C`,
            `${kTimes}${base}^{x} + C`,
          ],
          solution: walked(
            [
              [
                ["Integrate the exponential", "积分指数函数"],
                t(
                  `The derivative of $${base}^{x}$ is $${base}^{x}\\ln ${base}$, so divide by $\\ln ${base}$:`,
                  `$${base}^{x}$ 的导数是 $${base}^{x}\\ln ${base}$，所以要除以 $\\ln ${base}$：`,
                ),
                [`\\frac{d}{dx}${base}^{x} = ${base}^{x}\\ln ${base}`, `\\int ${expTerm} \\, dx = ${expAnti} + C`],
              ],
              withPower
                ? [
                    ["Integrate the power term", "积分幂函数项"],
                    t(
                      "The power term uses the power rule. Then add the two, with one constant:",
                      "幂函数项用幂法则。再把两部分相加，只写一个常数：",
                    ),
                    [`\\int ${powTerm} \\, dx = ${powAnti} + C`, `\\int ${integrand} \\, dx = ${answer}`],
                  ]
                : [
                    ["Keep the logarithm in the denominator", "把对数留在分母"],
                    t(
                      `Here $\\ln ${base} \\approx ${fmt(Math.log(base))}$ is just a constant, so it stays in the denominator: the integral is $${answer}$.`,
                      `这里 $\\ln ${base} \\approx ${fmt(Math.log(base))}$ 只是一个常数，所以留在分母中：积分是 $${answer}$。`,
                    ),
                  ],
            ],
            t(
              `Differentiate the answer. The constant $\\ln ${base}$ cancels:${steps(`\\frac{d}{dx}${expAnti} = \\frac{${kTimes}${base}^{x}\\ln ${base}}{\\ln ${base}} = ${expTerm}`)}${withPower ? `The power term differentiates back to $${powTerm}$, so the result is the integrand.` : "This is the integrand."}`,
              `对答案求导，常数 $\\ln ${base}$ 被约去：${steps(`\\frac{d}{dx}${expAnti} = \\frac{${kTimes}${base}^{x}\\ln ${base}}{\\ln ${base}} = ${expTerm}`)}${withPower ? `幂函数项求导得回 $${powTerm}$，所以结果正是被积函数。` : "这正是被积函数。"}`,
            ),
          ),
        });
      },
    },
  ],
};

/** TrigRule is an integrand of the form k·f(cx) with its antiderivative before dividing by c. */
interface TrigRule {
  readonly f: (u: string) => string;
  readonly F: (u: string) => string;
  /** sign is the sign of the antiderivative relative to the integrand's coefficient. */
  readonly sign: number;
  /** rule is the integration formula in u, in LaTeX. */
  readonly rule: string;
}

/** integrateScaled builds an integration problem for k·f(cx) given the rule ∫f(u)du = sign·F(u). */
function integrateScaled(rng: Rng, rule: TrigRule) {
  const k = rng.nonZero(-9, 9);
  const c = rng.pick([1, 1, 2, 3, 4, 5, 6]);
  const u = c === 1 ? "x" : `${c}x`;
  const coefficient = Q.of(k * rule.sign, c);
  const answer = `${coef(coefficient)}${rule.F(u)} + C`;
  const integrand = `${coef(Q.of(k))}${rule.f(u)}`;
  const arithmetic =
    rule.sign < 0 || c > 1 ? [`${k}${rule.sign < 0 ? " \\cdot (-1)" : ""}${c > 1 ? ` \\div ${c}` : ""} = ${coefficient.toLatex()}`] : [];
  return functionProblem({
    prompt: t(`Find $\\int ${integrand} \\, dx$.`, `求 $\\int ${integrand} \\, dx$。`),
    answer,
    antiderivative: true,
    wrong: [
      `${coef(Q.of(-k * rule.sign, c))}${rule.F(u)} + C`,
      `${coef(Q.of(k * rule.sign * c))}${rule.F(u)} + C`,
      `${coef(Q.of(k * rule.sign))}${rule.F(u)} + C`,
    ],
    solution: walked(
      [
        [["Recall the rule", "回顾公式"], t("Reversing a derivative rule gives", "把求导法则反过来，得"), [rule.rule]],
        c === 1
          ? [
              ["Keep the constant", "保留常数"],
              t(
                `The constant $${k}$ stays as a factor${rule.sign < 0 ? ", and the rule's minus sign multiplies it" : ""}:`,
                `常数 $${k}$ 保留为因子${rule.sign < 0 ? "，并乘以公式中的负号" : ""}：`,
              ),
              [...arithmetic, `\\int ${integrand} \\, dx = ${answer}`],
            ]
          : [
              ["Divide by the inner coefficient", "除以内层系数"],
              t(
                `Differentiating $${rule.F(u)}$ also multiplies by $${c}$ (chain rule), so divide by $${c}$:`,
                `对 $${rule.F(u)}$ 求导还会乘以 $${c}$（链式法则），所以要除以 $${c}$：`,
              ),
              [...arithmetic, `\\int ${integrand} \\, dx = ${answer}`],
            ],
      ],
      t(
        `Differentiate the answer${c > 1 ? `; the chain rule brings out the factor $${c}$` : ""}:${steps(`\\frac{d}{dx}\\left(${coef(coefficient)}${rule.F(u)}\\right) = ${pq(coefficient)} \\cdot ${pn(rule.sign * c)}${rule.f(u)} = ${integrand}`)}This is the integrand.`,
        `对答案求导${c > 1 ? `，链式法则带出因子 $${c}$` : ""}：${steps(`\\frac{d}{dx}\\left(${coef(coefficient)}${rule.F(u)}\\right) = ${pq(coefficient)} \\cdot ${pn(rule.sign * c)}${rule.f(u)} = ${integrand}`)}这正是被积函数。`,
      ),
    ),
  });
}

/** integratingTrigonometricFunctions integrates the six basic trigonometric derivatives in reverse. */
export const integratingTrigonometricFunctions: TopicDef = {
  id: "integrating-trigonometric-functions",
  title: t("Integrating Trigonometric Functions", "三角函数的积分"),
  summary: t(
    "Integrate sine, cosine and the trigonometric expressions that arise as derivatives.",
    "求正弦、余弦以及作为导数出现的三角表达式的积分。",
  ),
  prerequisites: ["the-sum-rule-for-indefinite-integrals"],
  encompasses: [{ topic: "the-sum-rule-for-indefinite-integrals", weight: 0.3 }],
  xp: 10,
  standards: [],
  intro: t(
    `Each derivative rule for a trigonometric function gives an integral. The derivative of $\\sin x$ is $\\cos x$, so $\\int \\cos x \\, dx = \\sin x + C$. With the sum rule, $\\int (\\cos x + 2x) \\, dx = \\sin x + x^{2} + C$.

Check: differentiating $\\sin x + x^{2}$ gives $\\cos x + 2x$.

In this lesson we integrate sine and cosine, and the expressions $\\sec^{2} x$, $\\csc^{2} x$, $\\sec x \\tan x$ and $\\csc x \\cot x$, also with $cx$ in place of $x$.`,
    `每条三角函数的求导法则都给出一个积分。$\\sin x$ 的导数是 $\\cos x$，所以 $\\int \\cos x \\, dx = \\sin x + C$。用和法则，$\\int (\\cos x + 2x) \\, dx = \\sin x + x^{2} + C$。

检验：对 $\\sin x + x^{2}$ 求导得 $\\cos x + 2x$。

这节课我们积分正弦和余弦，以及 $\\sec^{2} x$、$\\csc^{2} x$、$\\sec x \\tan x$ 和 $\\csc x \\cot x$，也包括用 $cx$ 代替 $x$ 的情形。`,
  ),
  knowledgePoints: [
    {
      id: "integrating-sine-and-cosine",
      title: t("Integrating sine and cosine", "正弦与余弦的积分"),
      explanation: t(
        "Each integral reverses a derivative rule: $\\int \\cos x \\, dx = \\sin x + C$ and $\\int \\sin x \\, dx = -\\cos x + C$. With $cx$ inside, divide by $c$, because the chain rule multiplies by $c$ when differentiating. For example, $\\int \\sin 3x \\, dx = -\\frac{1}{3}\\cos 3x + C$.\n\nCheck: differentiating $-\\frac{1}{3}\\cos 3x$ gives $-\\frac{1}{3} \\cdot (-3\\sin 3x)$, which is $\\sin 3x$.\n\n> **Watch out.** Mind the sign: $\\int \\sin x \\, dx$ is $-\\cos x + C$, because the derivative of $\\cos x$ is $-\\sin x$. Getting this backwards is the most common slip.",
        "每个积分都是某个求导法则的逆过程：$\\int \\cos x \\, dx = \\sin x + C$，$\\int \\sin x \\, dx = -\\cos x + C$。括号内是 $cx$ 时要除以 $c$，因为求导时链式法则会乘以 $c$。例如，$\\int \\sin 3x \\, dx = -\\frac{1}{3}\\cos 3x + C$。\n\n检验：对 $-\\frac{1}{3}\\cos 3x$ 求导得 $-\\frac{1}{3} \\cdot (-3\\sin 3x)$，即 $\\sin 3x$。\n\n> **注意。** 注意符号：$\\int \\sin x \\, dx$ 是 $-\\cos x + C$，因为 $\\cos x$ 的导数是 $-\\sin x$。把符号弄反是最常见的失误。",
      ),
      generate(rng) {
        return rng.bool()
          ? integrateScaled(rng, {
              f: (u) => `\\sin(${u})`,
              F: (u) => `\\cos(${u})`,
              sign: -1,
              rule: "\\int \\sin u \\, du = -\\cos u + C",
            })
          : integrateScaled(rng, { f: (u) => `\\cos(${u})`, F: (u) => `\\sin(${u})`, sign: 1, rule: "\\int \\cos u \\, du = \\sin u + C" });
      },
    },
    {
      id: "integrating-secant-and-cosecant-expressions",
      title: t("Integrating secant and cosecant expressions", "正割与余割表达式的积分"),
      explanation: t(
        "These integrals come directly from the derivatives of tangent, cotangent, secant and cosecant, so recognizing the derivative pattern is the whole method:\n\n- $\\int \\sec^{2} x \\, dx = \\tan x + C$\n- $\\int \\csc^{2} x \\, dx = -\\cot x + C$\n- $\\int \\sec x \\tan x \\, dx = \\sec x + C$\n- $\\int \\csc x \\cot x \\, dx = -\\csc x + C$\n\nFor example, $\\int 3\\sec^{2} x \\, dx = 3\\tan x + C$.\n\nCheck: the derivative of $3\\tan x$ is $3\\sec^{2} x$.\n\n> **Watch out.** The cotangent and cosecant rules carry a minus sign, because the derivatives of $\\cot x$ and $\\csc x$ are negative: $\\int \\csc^{2} x \\, dx$ is $-\\cot x + C$, not $\\cot x + C$.",
        "这些积分直接来自正切、余切、正割和余割的导数，所以认出导数的形式就是全部方法：\n\n- $\\int \\sec^{2} x \\, dx = \\tan x + C$\n- $\\int \\csc^{2} x \\, dx = -\\cot x + C$\n- $\\int \\sec x \\tan x \\, dx = \\sec x + C$\n- $\\int \\csc x \\cot x \\, dx = -\\csc x + C$\n\n例如，$\\int 3\\sec^{2} x \\, dx = 3\\tan x + C$。\n\n检验：$3\\tan x$ 的导数是 $3\\sec^{2} x$。\n\n> **注意。** 余切和余割的公式带负号，因为 $\\cot x$ 和 $\\csc x$ 的导数是负的：$\\int \\csc^{2} x \\, dx$ 是 $-\\cot x + C$，不是 $\\cot x + C$。",
      ),
      generate(rng) {
        const rules: TrigRule[] = [
          { f: (u) => `\\sec^{2}(${u})`, F: (u) => `\\tan(${u})`, sign: 1, rule: "\\int \\sec^{2} u \\, du = \\tan u + C" },
          { f: (u) => `\\csc^{2}(${u})`, F: (u) => `\\cot(${u})`, sign: -1, rule: "\\int \\csc^{2} u \\, du = -\\cot u + C" },
          { f: (u) => `\\sec(${u})\\tan(${u})`, F: (u) => `\\sec(${u})`, sign: 1, rule: "\\int \\sec u \\tan u \\, du = \\sec u + C" },
          { f: (u) => `\\csc(${u})\\cot(${u})`, F: (u) => `\\csc(${u})`, sign: -1, rule: "\\int \\csc u \\cot u \\, du = -\\csc u + C" },
        ];
        return integrateScaled(rng, rng.pick(rules));
      },
    },
  ],
};

/** integrationUsingInverseTrigonometricFunctions integrates to arcsine, arctangent and arcsecant. */
export const integrationUsingInverseTrigonometricFunctions: TopicDef = {
  id: "integration-using-inverse-trigonometric-functions",
  title: t("Integration Using Inverse Trigonometric Functions", "用反三角函数积分"),
  summary: t(
    "Integrate 1/√(a² − x²), 1/(a² + x²) and 1/(x√(x² − 1)) to inverse trigonometric functions.",
    "把 1/√(a² − x²)、1/(a² + x²) 和 1/(x√(x² − 1)) 积分为反三角函数。",
  ),
  prerequisites: ["integrating-trigonometric-functions", "differentiating-inverse-reciprocal-trigonometric-functions"],
  encompasses: [],
  xp: 10,
  standards: [],
  intro: t(
    `The derivative of $\\arctan x$ is $\\frac{1}{1 + x^{2}}$. Reversed, this gives $\\int \\frac{1}{1 + x^{2}} \\, dx = \\arctan x + C$: an integrand with no power, exponential or trigonometric antiderivative still has a simple one.

Check: at $x = 0$ the integrand is $1$, and the slope of $\\arctan x$ at $0$ is $1$ as well, since $\\arctan x \\approx x$ near $0$.

In this lesson we integrate $\\frac{1}{\\sqrt{a^{2} - x^{2}}}$, $\\frac{1}{a^{2} + x^{2}}$ and $\\frac{1}{x\\sqrt{x^{2} - 1}}$ to the arcsine, the arctangent and the arcsecant.`,
    `$\\arctan x$ 的导数是 $\\frac{1}{1 + x^{2}}$。反过来就得到 $\\int \\frac{1}{1 + x^{2}} \\, dx = \\arctan x + C$：一个找不到幂、指数或三角原函数的被积函数，仍有简单的原函数。

检验：在 $x = 0$ 处被积函数等于 $1$，而 $\\arctan x$ 在 $0$ 处的斜率也是 $1$，因为在 $0$ 附近 $\\arctan x \\approx x$。

这节课我们把 $\\frac{1}{\\sqrt{a^{2} - x^{2}}}$、$\\frac{1}{a^{2} + x^{2}}$ 和 $\\frac{1}{x\\sqrt{x^{2} - 1}}$ 积分为反正弦、反正切和反正割。`,
  ),
  knowledgePoints: [
    {
      id: "integrating-to-arcsine",
      title: t("Integrating to arcsine", "积分为反正弦"),
      explanation: t(
        "A square root of a constant minus a square in the denominator signals the arcsine, with the constant under the root fixing the scale. The derivative of $\\arcsin \\frac{x}{a}$ is $\\frac{1}{\\sqrt{a^{2} - x^{2}}}$ for $a > 0$, so\n\n$$\\int \\frac{1}{\\sqrt{a^{2} - x^{2}}} \\, dx = \\arcsin \\frac{x}{a} + C.$$\n\nFor example, with $9 = 3^{2}$ the integral of $\\frac{1}{\\sqrt{9 - x^{2}}}$ is $\\arcsin \\frac{x}{3} + C$.\n\nCheck: at $x = 0$ the integrand is $\\frac{1}{3}$, and the slope of $\\arcsin \\frac{x}{3}$ there is also $\\frac{1}{3}$, since $\\arcsin u \\approx u$ near $0$.\n\n> **Watch out.** Use $a$, not $a^{2}$, inside the arcsine: for $\\sqrt{9 - x^{2}}$ it is $\\arcsin \\frac{x}{3}$, not $\\arcsin \\frac{x}{9}$. And there is no factor $\\frac{1}{a}$ in front, unlike the arctangent rule.",
        "分母中出现常数减平方的平方根时，就是反正弦的信号，根号下的常数决定了缩放比例。当 $a > 0$ 时，$\\arcsin \\frac{x}{a}$ 的导数是 $\\frac{1}{\\sqrt{a^{2} - x^{2}}}$，所以\n\n$$\\int \\frac{1}{\\sqrt{a^{2} - x^{2}}} \\, dx = \\arcsin \\frac{x}{a} + C$$\n\n例如，由 $9 = 3^{2}$，$\\frac{1}{\\sqrt{9 - x^{2}}}$ 的积分是 $\\arcsin \\frac{x}{3} + C$。\n\n检验：在 $x = 0$ 处被积函数等于 $\\frac{1}{3}$，而 $\\arcsin \\frac{x}{3}$ 在那里的斜率也是 $\\frac{1}{3}$，因为在 $0$ 附近 $\\arcsin u \\approx u$。\n\n> **注意。** 反正弦里用 $a$，不是 $a^{2}$：对 $\\sqrt{9 - x^{2}}$ 是 $\\arcsin \\frac{x}{3}$，不是 $\\arcsin \\frac{x}{9}$。另外前面没有因子 $\\frac{1}{a}$，这与反正切的公式不同。",
      ),
      generate(rng) {
        const a = rng.int(4, 9);
        const k = rng.nonZero(-9, 9);
        const root = `\\sqrt{${a * a} - x^{2}}`;
        const answer = `${coef(Q.of(k))}\\arcsin\\left(\\frac{x}{${a}}\\right) + C`;
        return functionProblem({
          prompt: t(`Find $\\int ${fracOf(k, root)} \\, dx$.`, `求 $\\int ${fracOf(k, root)} \\, dx$。`),
          answer,
          antiderivative: true,
          wrong: [
            `${coef(Q.of(k, a))}\\arcsin\\left(\\frac{x}{${a}}\\right) + C`,
            `${coef(Q.of(k))}\\arcsin\\left(\\frac{x}{${a * a}}\\right) + C`,
            `${coef(Q.of(k, a))}\\arctan\\left(\\frac{x}{${a}}\\right) + C`,
          ],
          solution: walked(
            [
              [
                ["Match the form", "对照公式"],
                t(
                  `The root is a constant minus a square, and $${a * a} = ${a}^{2}$. So the integrand is $${k}$ times $\\frac{1}{\\sqrt{a^{2} - x^{2}}}$ with $a = ${a}$.`,
                  `根号下是常数减平方，且 $${a * a} = ${a}^{2}$。所以被积函数是 $${k}$ 乘以 $\\frac{1}{\\sqrt{a^{2} - x^{2}}}$，其中 $a = ${a}$。`,
                ),
              ],
              [
                ["Apply the arcsine rule", "用反正弦公式"],
                t("The rule has no factor in front of the arcsine:", "这个公式在反正弦前面没有因子："),
                [`\\int ${fracOf(k, root)} \\, dx = ${answer}`],
              ],
            ],
            t(
              `Differentiate $\\arcsin\\left(\\frac{x}{${a}}\\right)$ by the chain rule:${steps(`\\frac{d}{dx}\\arcsin\\left(\\frac{x}{${a}}\\right) = \\frac{1}{${a}} \\cdot \\frac{1}{\\sqrt{1 - \\frac{x^{2}}{${a * a}}}} = \\frac{1}{${root}}`)}Times $${k}$, this is the integrand.`,
              `用链式法则对 $\\arcsin\\left(\\frac{x}{${a}}\\right)$ 求导：${steps(`\\frac{d}{dx}\\arcsin\\left(\\frac{x}{${a}}\\right) = \\frac{1}{${a}} \\cdot \\frac{1}{\\sqrt{1 - \\frac{x^{2}}{${a * a}}}} = \\frac{1}{${root}}`)}乘以 $${k}$ 就是被积函数。`,
            ),
          ),
        });
      },
    },
    {
      id: "integrating-to-arctangent-and-arcsecant",
      title: t("Integrating to arctangent and arcsecant", "积分为反正切与反正割"),
      explanation: t(
        "A constant plus a square in the denominator signals the arctangent, and the extra factor of the variable outside a root signals the arcsecant:\n\n$$\\int \\frac{1}{a^{2} + x^{2}} \\, dx = \\frac{1}{a}\\arctan \\frac{x}{a} + C, \\qquad \\int \\frac{1}{x\\sqrt{x^{2} - 1}} \\, dx = \\operatorname{arcsec} x + C \\ (x > 1).$$\n\nFor example, with $a = 2$ the integral of $\\frac{1}{4 + x^{2}}$ is $\\frac{1}{2}\\arctan \\frac{x}{2} + C$.\n\nCheck: at $x = 0$ the integrand is $\\frac{1}{4}$, and the slope of $\\frac{1}{2}\\arctan \\frac{x}{2}$ there is $\\frac{1}{2} \\cdot \\frac{1}{2}$, also $\\frac{1}{4}$.\n\n> **Watch out.** The arctangent rule has the factor $\\frac{1}{a}$, which the arcsine rule does not. And $\\frac{1}{a^{2} + x^{2}}$ does not integrate to a logarithm: the derivative of $\\ln(a^{2} + x^{2})$ is $\\frac{2x}{a^{2} + x^{2}}$.",
        "分母中出现常数加平方时是反正切的信号，根号外多一个变量因子时则是反正割的信号：\n\n$$\\int \\frac{1}{a^{2} + x^{2}} \\, dx = \\frac{1}{a}\\arctan \\frac{x}{a} + C, \\qquad \\int \\frac{1}{x\\sqrt{x^{2} - 1}} \\, dx = \\operatorname{arcsec} x + C \\ (x > 1)$$\n\n例如，取 $a = 2$，$\\frac{1}{4 + x^{2}}$ 的积分是 $\\frac{1}{2}\\arctan \\frac{x}{2} + C$。\n\n检验：在 $x = 0$ 处被积函数等于 $\\frac{1}{4}$，而 $\\frac{1}{2}\\arctan \\frac{x}{2}$ 在那里的斜率是 $\\frac{1}{2} \\cdot \\frac{1}{2}$，也是 $\\frac{1}{4}$。\n\n> **注意。** 反正切公式有因子 $\\frac{1}{a}$，反正弦公式没有。另外 $\\frac{1}{a^{2} + x^{2}}$ 的积分不是对数：$\\ln(a^{2} + x^{2})$ 的导数是 $\\frac{2x}{a^{2} + x^{2}}$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-12, 12);
        if (rng.bool(0.3)) {
          const answer = `${coef(Q.of(k))}\\operatorname{arcsec} x + C`;
          const den = "x\\sqrt{x^{2} - 1}";
          return functionProblem({
            prompt: t(`Find $\\int ${fracOf(k, den)} \\, dx$ for $x > 1$.`, `当 $x > 1$ 时，求 $\\int ${fracOf(k, den)} \\, dx$。`),
            answer,
            antiderivative: true,
            positive: true,
            wrong: [`${coef(Q.of(k))}\\arcsin x + C`, `${coef(Q.of(-k))}\\operatorname{arcsec} x + C`, `${coef(Q.of(k))}\\arctan x + C`],
            solution: walked(
              [
                [
                  ["Recognize the derivative", "认出导数"],
                  t(
                    "The variable times a root of a square minus $1$ is the derivative of the arcsecant:",
                    "变量乘以平方减 $1$ 的平方根，正是反正割的导数：",
                  ),
                  [`\\frac{d}{dx}\\operatorname{arcsec} x = \\frac{1}{${den}} \\quad (x > 1)`],
                ],
                [
                  ["Keep the constant", "保留常数"],
                  t(`The constant $${k}$ stays as a factor:`, `常数 $${k}$ 保留为因子：`),
                  [`\\int ${fracOf(k, den)} \\, dx = ${answer}`],
                ],
              ],
              t(
                `Write $\\operatorname{arcsec} x$ as $\\arccos \\frac{1}{x}$ and differentiate with the chain rule:${steps(`\\frac{d}{dx}\\arccos \\frac{1}{x} = \\frac{-1}{\\sqrt{1 - \\frac{1}{x^{2}}}} \\cdot \\left(-\\frac{1}{x^{2}}\\right) = \\frac{1}{${den}}`)}For $x > 1$, $x^{2}\\sqrt{1 - \\frac{1}{x^{2}}}$ is $${den}$, so this agrees.`,
                `把 $\\operatorname{arcsec} x$ 写成 $\\arccos \\frac{1}{x}$，用链式法则求导：${steps(`\\frac{d}{dx}\\arccos \\frac{1}{x} = \\frac{-1}{\\sqrt{1 - \\frac{1}{x^{2}}}} \\cdot \\left(-\\frac{1}{x^{2}}\\right) = \\frac{1}{${den}}`)}当 $x > 1$ 时，$x^{2}\\sqrt{1 - \\frac{1}{x^{2}}}$ 就是 $${den}$，所以结果一致。`,
              ),
            ),
          });
        }
        const a = rng.int(1, 9);
        const c = Q.of(k, a);
        const arg = a === 1 ? "x" : `\\frac{x}{${a}}`;
        const den = `${a * a} + x^{2}`;
        const answer = `${coef(c)}\\arctan\\left(${arg}\\right) + C`;
        const slope =
          a === 1
            ? `\\frac{d}{dx}\\arctan x = \\frac{1}{1 + x^{2}}`
            : `\\frac{d}{dx}\\arctan\\left(${arg}\\right) = \\frac{1}{${a}} \\cdot \\frac{1}{1 + \\frac{x^{2}}{${a * a}}} = \\frac{${a}}{${den}}`;
        return functionProblem({
          prompt: t(`Find $\\int ${fracOf(k, den)} \\, dx$.`, `求 $\\int ${fracOf(k, den)} \\, dx$。`),
          answer,
          antiderivative: true,
          wrong: [
            `${coef(Q.of(k))}\\arctan\\left(${arg}\\right) + C`,
            `${coef(Q.of(k, a * a))}\\arctan\\left(${arg}\\right) + C`,
            `${coef(Q.of(k))}\\ln(${den}) + C`,
          ],
          solution: walked(
            [
              [
                ["Match the form", "对照公式"],
                t(
                  `The denominator is a constant plus a square, with $${a * a} = ${a}^{2}$, so $a = ${a}$.`,
                  `分母是常数加平方，$${a * a} = ${a}^{2}$，所以 $a = ${a}$。`,
                ),
              ],
              [
                ["Apply the arctangent rule", "用反正切公式"],
                t(
                  `The rule has the factor $\\frac{1}{a}$, here $\\frac{1}{${a}}$:`,
                  `公式有因子 $\\frac{1}{a}$，这里是 $\\frac{1}{${a}}$：`,
                ),
                a === 1
                  ? [`\\int ${fracOf(k, den)} \\, dx = ${answer}`]
                  : [`\\int ${fracOf(k, den)} \\, dx = ${k} \\cdot \\frac{1}{${a}}\\arctan\\left(${arg}\\right) + C = ${answer}`],
              ],
            ],
            t(
              `Differentiate the arctangent by the chain rule:${steps(slope)}Times $${c.toLatex()}$, this gives $${fracOf(k, den)}$, the integrand.`,
              `用链式法则对反正切求导：${steps(slope)}乘以 $${c.toLatex()}$ 得 $${fracOf(k, den)}$，正是被积函数。`,
            ),
          ),
        });
      },
    },
  ],
};

/** integratingHyperbolicFunctions integrates hyperbolic functions and their derivative forms. */
export const integratingHyperbolicFunctions: TopicDef = {
  id: "integrating-hyperbolic-functions",
  title: t("Integrating Hyperbolic Functions", "双曲函数的积分"),
  summary: t(
    "Integrate sinh, cosh and the hyperbolic expressions that arise as derivatives.",
    "求 sinh、cosh 以及作为导数出现的双曲表达式的积分。",
  ),
  prerequisites: ["integrating-exponential-functions", "differentiating-reciprocal-hyperbolic-functions"],
  encompasses: [],
  xp: 10,
  standards: [],
  intro: t(
    `Since $\\sinh x = \\frac{e^{x} - e^{-x}}{2}$, integrating the two exponentials gives $\\frac{e^{x} + e^{-x}}{2}$, which is $\\cosh x$. So $\\int \\sinh x \\, dx = \\cosh x + C$.

Check: the derivative of $\\cosh x$ is $\\sinh x$, with no minus sign, unlike the derivative of $\\cos x$.

In this lesson we integrate $\\sinh$ and $\\cosh$, and the expressions $\\operatorname{sech}^{2} x$, $\\operatorname{csch}^{2} x$, $\\operatorname{sech} x \\tanh x$ and $\\operatorname{csch} x \\coth x$ that arise as derivatives.`,
    `由于 $\\sinh x = \\frac{e^{x} - e^{-x}}{2}$，对两个指数函数分别积分得 $\\frac{e^{x} + e^{-x}}{2}$，即 $\\cosh x$。所以 $\\int \\sinh x \\, dx = \\cosh x + C$。

检验：$\\cosh x$ 的导数是 $\\sinh x$，没有负号，这与 $\\cos x$ 的导数不同。

这节课我们积分 $\\sinh$ 和 $\\cosh$，以及作为导数出现的 $\\operatorname{sech}^{2} x$、$\\operatorname{csch}^{2} x$、$\\operatorname{sech} x \\tanh x$ 和 $\\operatorname{csch} x \\coth x$。`,
  ),
  knowledgePoints: [
    {
      id: "integrating-sinh-and-cosh",
      title: t("Integrating sinh and cosh", "sinh 与 cosh 的积分"),
      explanation: t(
        "Hyperbolic sine and cosine are each other's derivatives without a sign change, so their integrals swap them without a minus sign: $\\int \\sinh x \\, dx = \\cosh x + C$ and $\\int \\cosh x \\, dx = \\sinh x + C$. With $cx$ inside, divide by $c$. For example, $\\int \\sinh 2x \\, dx = \\frac{1}{2}\\cosh 2x + C$.\n\nCheck: differentiating $\\frac{1}{2}\\cosh 2x$ gives $\\frac{1}{2} \\cdot 2\\sinh 2x$, which is $\\sinh 2x$.\n\n> **Watch out.** There is no minus sign here: $\\int \\sinh x \\, dx$ is $\\cosh x + C$, because the derivative of $\\cosh x$ is $\\sinh x$. Do not carry over the sign of $\\int \\sin x \\, dx = -\\cos x + C$.",
        "双曲正弦和双曲余弦互为导数且不变号，所以它们的积分只是互换而不带负号：$\\int \\sinh x \\, dx = \\cosh x + C$，$\\int \\cosh x \\, dx = \\sinh x + C$。括号内是 $cx$ 时除以 $c$。例如，$\\int \\sinh 2x \\, dx = \\frac{1}{2}\\cosh 2x + C$。\n\n检验：对 $\\frac{1}{2}\\cosh 2x$ 求导得 $\\frac{1}{2} \\cdot 2\\sinh 2x$，即 $\\sinh 2x$。\n\n> **注意。** 这里没有负号：$\\int \\sinh x \\, dx$ 是 $\\cosh x + C$，因为 $\\cosh x$ 的导数是 $\\sinh x$。不要照搬 $\\int \\sin x \\, dx = -\\cos x + C$ 中的负号。",
      ),
      generate(rng) {
        return rng.bool()
          ? integrateScaled(rng, {
              f: (u) => `\\sinh(${u})`,
              F: (u) => `\\cosh(${u})`,
              sign: 1,
              rule: "\\int \\sinh u \\, du = \\cosh u + C",
            })
          : integrateScaled(rng, {
              f: (u) => `\\cosh(${u})`,
              F: (u) => `\\sinh(${u})`,
              sign: 1,
              rule: "\\int \\cosh u \\, du = \\sinh u + C",
            });
      },
    },
    {
      id: "integrating-reciprocal-hyperbolic-expressions",
      title: t("Integrating reciprocal hyperbolic expressions", "倒数双曲表达式的积分"),
      explanation: t(
        "Each formula reverses a derivative of a hyperbolic function, so the signs match those in the derivative rules:\n\n- $\\int \\operatorname{sech}^{2} x \\, dx = \\tanh x + C$\n- $\\int \\operatorname{csch}^{2} x \\, dx = -\\coth x + C$\n- $\\int \\operatorname{sech} x \\tanh x \\, dx = -\\operatorname{sech} x + C$\n- $\\int \\operatorname{csch} x \\coth x \\, dx = -\\operatorname{csch} x + C$\n\nFor example, $\\int 4\\operatorname{sech}^{2} x \\, dx = 4\\tanh x + C$.\n\nCheck: the derivative of $4\\tanh x$ is $4\\operatorname{sech}^{2} x$.\n\n> **Watch out.** Three of the four rules carry a minus sign; only $\\operatorname{sech}^{2} x$ integrates without one. Compare $\\int \\sec x \\tan x \\, dx = \\sec x + C$, with no minus sign, and $\\int \\operatorname{sech} x \\tanh x \\, dx = -\\operatorname{sech} x + C$.",
        "每个公式都是某个双曲函数求导的逆过程，所以符号与求导法则中的符号一致：\n\n- $\\int \\operatorname{sech}^{2} x \\, dx = \\tanh x + C$\n- $\\int \\operatorname{csch}^{2} x \\, dx = -\\coth x + C$\n- $\\int \\operatorname{sech} x \\tanh x \\, dx = -\\operatorname{sech} x + C$\n- $\\int \\operatorname{csch} x \\coth x \\, dx = -\\operatorname{csch} x + C$\n\n例如，$\\int 4\\operatorname{sech}^{2} x \\, dx = 4\\tanh x + C$。\n\n检验：$4\\tanh x$ 的导数是 $4\\operatorname{sech}^{2} x$。\n\n> **注意。** 四个公式中有三个带负号，只有 $\\operatorname{sech}^{2} x$ 的积分不带负号。对比 $\\int \\sec x \\tan x \\, dx = \\sec x + C$（没有负号）与 $\\int \\operatorname{sech} x \\tanh x \\, dx = -\\operatorname{sech} x + C$。",
      ),
      generate(rng) {
        const rules: TrigRule[] = [
          {
            f: (u) => `\\operatorname{sech}^{2}(${u})`,
            F: (u) => `\\tanh(${u})`,
            sign: 1,
            rule: "\\int \\operatorname{sech}^{2} u \\, du = \\tanh u + C",
          },
          {
            f: (u) => `\\operatorname{csch}^{2}(${u})`,
            F: (u) => `\\coth(${u})`,
            sign: -1,
            rule: "\\int \\operatorname{csch}^{2} u \\, du = -\\coth u + C",
          },
          {
            f: (u) => `\\operatorname{sech}(${u})\\tanh(${u})`,
            F: (u) => `\\operatorname{sech}(${u})`,
            sign: -1,
            rule: "\\int \\operatorname{sech} u \\tanh u \\, du = -\\operatorname{sech} u + C",
          },
          {
            f: (u) => `\\operatorname{csch}(${u})\\coth(${u})`,
            F: (u) => `\\operatorname{csch}(${u})`,
            sign: -1,
            rule: "\\int \\operatorname{csch} u \\coth u \\, du = -\\operatorname{csch} u + C",
          },
        ];
        return integrateScaled(rng, rng.pick(rules));
      },
    },
  ],
};

/** integrationUsingInverseHyperbolicFunctions integrates to arsinh, arcosh and artanh. */
export const integrationUsingInverseHyperbolicFunctions: TopicDef = {
  id: "integration-using-inverse-hyperbolic-functions",
  title: t("Integration Using Inverse Hyperbolic Functions", "用反双曲函数积分"),
  summary: t(
    "Integrate 1/√(x² + a²), 1/√(x² − 1) and 1/(a² − x²) to inverse hyperbolic functions.",
    "把 1/√(x² + a²)、1/√(x² − 1) 和 1/(a² − x²) 积分为反双曲函数。",
  ),
  prerequisites: [
    "integrating-hyperbolic-functions",
    "integration-using-inverse-trigonometric-functions",
    "differentiating-inverse-hyperbolic-functions",
  ],
  encompasses: [],
  xp: 10,
  standards: [],
  intro: t(
    `The arcsine rule gives $\\int \\frac{1}{\\sqrt{1 - x^{2}}} \\, dx = \\arcsin x + C$. Change the sign under the root and the inverse hyperbolic sine answers instead: the derivative of $\\operatorname{arsinh} x$ is $\\frac{1}{\\sqrt{x^{2} + 1}}$, so $\\int \\frac{1}{\\sqrt{x^{2} + 1}} \\, dx = \\operatorname{arsinh} x + C$.

Check: $\\operatorname{arsinh} x = \\ln\\left(x + \\sqrt{x^{2} + 1}\\right)$, and at $x = 0$ its slope is $1$, the value of the integrand there.

In this lesson we integrate $\\frac{1}{\\sqrt{x^{2} + a^{2}}}$, $\\frac{1}{\\sqrt{x^{2} - 1}}$ and $\\frac{1}{a^{2} - x^{2}}$ to arsinh, arcosh and artanh.`,
    `反正弦公式给出 $\\int \\frac{1}{\\sqrt{1 - x^{2}}} \\, dx = \\arcsin x + C$。把根号下的符号改变，答案就换成反双曲正弦：$\\operatorname{arsinh} x$ 的导数是 $\\frac{1}{\\sqrt{x^{2} + 1}}$，所以 $\\int \\frac{1}{\\sqrt{x^{2} + 1}} \\, dx = \\operatorname{arsinh} x + C$。

检验：$\\operatorname{arsinh} x = \\ln\\left(x + \\sqrt{x^{2} + 1}\\right)$，它在 $x = 0$ 处的斜率是 $1$，正是被积函数在那里的值。

这节课我们把 $\\frac{1}{\\sqrt{x^{2} + a^{2}}}$、$\\frac{1}{\\sqrt{x^{2} - 1}}$ 和 $\\frac{1}{a^{2} - x^{2}}$ 积分为 arsinh、arcosh 和 artanh。`,
  ),
  knowledgePoints: [
    {
      id: "integrating-to-arsinh",
      title: t("Integrating to arsinh", "积分为 arsinh"),
      explanation: t(
        "A square root of a square plus a constant gives the inverse hyperbolic sine:\n\n$$\\int \\frac{1}{\\sqrt{x^{2} + a^{2}}} \\, dx = \\operatorname{arsinh} \\frac{x}{a} + C.$$\n\nFor example, with $a = 3$ the integral of $\\frac{1}{\\sqrt{x^{2} + 9}}$ is $\\operatorname{arsinh} \\frac{x}{3} + C$.\n\nCheck: at $x = 0$ the integrand is $\\frac{1}{3}$. Near $0$, $\\operatorname{arsinh} u \\approx u$, so the slope of $\\operatorname{arsinh} \\frac{x}{3}$ there is also $\\frac{1}{3}$.\n\n> **Watch out.** The sign under the root decides: $\\sqrt{x^{2} + a^{2}}$ gives $\\operatorname{arsinh}$, while $\\sqrt{a^{2} - x^{2}}$ gives $\\arcsin$. Neither rule has a factor $\\frac{1}{a}$ in front.",
        "根号下是平方加常数时，得到反双曲正弦：\n\n$$\\int \\frac{1}{\\sqrt{x^{2} + a^{2}}} \\, dx = \\operatorname{arsinh} \\frac{x}{a} + C$$\n\n例如，取 $a = 3$，$\\frac{1}{\\sqrt{x^{2} + 9}}$ 的积分是 $\\operatorname{arsinh} \\frac{x}{3} + C$。\n\n检验：在 $x = 0$ 处被积函数等于 $\\frac{1}{3}$。在 $0$ 附近 $\\operatorname{arsinh} u \\approx u$，所以 $\\operatorname{arsinh} \\frac{x}{3}$ 在那里的斜率也是 $\\frac{1}{3}$。\n\n> **注意。** 根号下的符号决定答案：$\\sqrt{x^{2} + a^{2}}$ 给出 $\\operatorname{arsinh}$，而 $\\sqrt{a^{2} - x^{2}}$ 给出 $\\arcsin$。两个公式前面都没有因子 $\\frac{1}{a}$。",
      ),
      generate(rng) {
        const a = rng.int(1, 9);
        const k = rng.nonZero(-9, 9);
        const arg = a === 1 ? "x" : `\\frac{x}{${a}}`;
        const root = `\\sqrt{x^{2} + ${a * a}}`;
        const answer = `${coef(Q.of(k))}\\operatorname{arsinh}\\left(${arg}\\right) + C`;
        return functionProblem({
          prompt: t(`Find $\\int ${fracOf(k, root)} \\, dx$.`, `求 $\\int ${fracOf(k, root)} \\, dx$。`),
          answer,
          antiderivative: true,
          wrong: [
            `${coef(Q.of(k, a))}\\operatorname{arsinh}\\left(${arg}\\right) + C`,
            `${coef(Q.of(k, a))}\\arctan\\left(${arg}\\right) + C`,
            `${coef(Q.of(k))}\\operatorname{arcosh}\\left(${arg}\\right) + C`,
          ],
          solution: walked(
            [
              [
                ["Match the form", "对照公式"],
                t(
                  `The root is a square plus a constant, with $${a * a} = ${a}^{2}$. So the answer is an inverse hyperbolic sine with $a = ${a}$.`,
                  `根号下是平方加常数，$${a * a} = ${a}^{2}$。所以答案是反双曲正弦，$a = ${a}$。`,
                ),
              ],
              [
                ["Apply the arsinh rule", "用 arsinh 公式"],
                t("The rule has no factor in front, and the constant stays:", "公式前面没有因子，常数保留："),
                [`\\int ${fracOf(k, root)} \\, dx = ${answer}`],
              ],
            ],
            t(
              `Up to a constant, $\\operatorname{arsinh}\\left(${arg}\\right)$ is $\\ln\\left(x + ${root}\\right)$. Differentiate that:${steps(`\\frac{d}{dx}\\ln\\left(x + ${root}\\right) = \\frac{1 + \\frac{x}{${root}}}{x + ${root}} = \\frac{1}{${root}}`)}Times $${k}$, this is the integrand.`,
              `相差一个常数，$\\operatorname{arsinh}\\left(${arg}\\right)$ 就是 $\\ln\\left(x + ${root}\\right)$。对它求导：${steps(`\\frac{d}{dx}\\ln\\left(x + ${root}\\right) = \\frac{1 + \\frac{x}{${root}}}{x + ${root}} = \\frac{1}{${root}}`)}乘以 $${k}$ 就是被积函数。`,
            ),
          ),
        });
      },
    },
    {
      id: "integrating-to-arcosh-and-artanh",
      title: t("Integrating to arcosh and artanh", "积分为 arcosh 与 artanh"),
      explanation: t(
        "A square minus a constant under a root gives the inverse hyperbolic cosine, and a constant minus a square with no root gives the inverse hyperbolic tangent:\n\n$$\\int \\frac{1}{\\sqrt{x^{2} - a^{2}}} \\, dx = \\operatorname{arcosh} \\frac{x}{a} + C \\ (x > a), \\qquad \\int \\frac{1}{a^{2} - x^{2}} \\, dx = \\frac{1}{a}\\operatorname{artanh} \\frac{x}{a} + C \\ (|x| < a).$$\n\nFor example, with $a = 3$ the integral of $\\frac{1}{9 - x^{2}}$ for $|x| < 3$ is $\\frac{1}{3}\\operatorname{artanh} \\frac{x}{3} + C$.\n\nCheck: at $x = 0$ the integrand is $\\frac{1}{9}$, and the slope of $\\frac{1}{3}\\operatorname{artanh} \\frac{x}{3}$ there is $\\frac{1}{3} \\cdot \\frac{1}{3}$, also $\\frac{1}{9}$.\n\n> **Watch out.** The artanh rule has the factor $\\frac{1}{a}$, like the arctangent rule; the arcosh rule does not. And $a^{2} - x^{2}$ without a root does not give an arcsine.",
        "根号下是平方减常数时得到反双曲余弦，没有根号的常数减平方则得到反双曲正切：\n\n$$\\int \\frac{1}{\\sqrt{x^{2} - a^{2}}} \\, dx = \\operatorname{arcosh} \\frac{x}{a} + C \\ (x > a), \\qquad \\int \\frac{1}{a^{2} - x^{2}} \\, dx = \\frac{1}{a}\\operatorname{artanh} \\frac{x}{a} + C \\ (|x| < a)$$\n\n例如，取 $a = 3$，当 $|x| < 3$ 时 $\\frac{1}{9 - x^{2}}$ 的积分是 $\\frac{1}{3}\\operatorname{artanh} \\frac{x}{3} + C$。\n\n检验：在 $x = 0$ 处被积函数等于 $\\frac{1}{9}$，而 $\\frac{1}{3}\\operatorname{artanh} \\frac{x}{3}$ 在那里的斜率是 $\\frac{1}{3} \\cdot \\frac{1}{3}$，也是 $\\frac{1}{9}$。\n\n> **注意。** artanh 公式有因子 $\\frac{1}{a}$，与反正切公式一样；arcosh 公式没有。另外没有根号的 $a^{2} - x^{2}$ 不会给出反正弦。",
      ),
      generate(rng) {
        const k = rng.nonZero(-12, 12);
        if (rng.bool()) {
          const root = "\\sqrt{x^{2} - 1}";
          const answer = `${coef(Q.of(k))}\\operatorname{arcosh} x + C`;
          return functionProblem({
            prompt: t(`Find $\\int ${fracOf(k, root)} \\, dx$ for $x > 1$.`, `当 $x > 1$ 时，求 $\\int ${fracOf(k, root)} \\, dx$。`),
            answer,
            antiderivative: true,
            positive: true,
            wrong: [
              `${coef(Q.of(k))}\\operatorname{arsinh} x + C`,
              `${coef(Q.of(k))}\\arcsin x + C`,
              `${coef(Q.of(-k))}\\operatorname{arcosh} x + C`,
            ],
            solution: walked(
              [
                [
                  ["Match the form", "对照公式"],
                  t(
                    "The root is a square minus a constant, $\\sqrt{x^{2} - 1}$, so the answer is an inverse hyperbolic cosine:",
                    "根号下是平方减常数，即 $\\sqrt{x^{2} - 1}$，所以答案是反双曲余弦：",
                  ),
                  [`\\frac{d}{dx}\\operatorname{arcosh} x = \\frac{1}{${root}} \\quad (x > 1)`],
                ],
                [
                  ["Keep the constant", "保留常数"],
                  t(`The constant $${k}$ stays as a factor:`, `常数 $${k}$ 保留为因子：`),
                  [`\\int ${fracOf(k, root)} \\, dx = ${answer}`],
                ],
              ],
              t(
                `For $x > 1$, $\\operatorname{arcosh} x$ is $\\ln\\left(x + ${root}\\right)$. Differentiate that:${steps(`\\frac{d}{dx}\\ln\\left(x + ${root}\\right) = \\frac{1 + \\frac{x}{${root}}}{x + ${root}} = \\frac{1}{${root}}`)}Times $${k}$, this is the integrand.`,
                `当 $x > 1$ 时，$\\operatorname{arcosh} x$ 就是 $\\ln\\left(x + ${root}\\right)$。对它求导：${steps(`\\frac{d}{dx}\\ln\\left(x + ${root}\\right) = \\frac{1 + \\frac{x}{${root}}}{x + ${root}} = \\frac{1}{${root}}`)}乘以 $${k}$ 就是被积函数。`,
              ),
            ),
          });
        }
        const a = rng.int(4, 9);
        const c = Q.of(k, a);
        const den = `${a * a} - x^{2}`;
        const answer = `${coef(c)}\\operatorname{artanh}\\left(\\frac{x}{${a}}\\right) + C`;
        return functionProblem({
          prompt: t(`Find $\\int ${fracOf(k, den)} \\, dx$ for $|x| < ${a}$.`, `当 $|x| < ${a}$ 时，求 $\\int ${fracOf(k, den)} \\, dx$。`),
          answer,
          antiderivative: true,
          wrong: [
            `${coef(Q.of(k))}\\operatorname{artanh}\\left(\\frac{x}{${a}}\\right) + C`,
            `${coef(c)}\\arctan\\left(\\frac{x}{${a}}\\right) + C`,
            `${coef(Q.of(k, a * a))}\\operatorname{artanh}\\left(\\frac{x}{${a}}\\right) + C`,
          ],
          solution: walked(
            [
              [
                ["Match the form", "对照公式"],
                t(
                  `The denominator is a constant minus a square with no root, $${a * a} = ${a}^{2}$, and $|x| < ${a}$. So the answer is an inverse hyperbolic tangent with $a = ${a}$.`,
                  `分母是没有根号的常数减平方，$${a * a} = ${a}^{2}$，且 $|x| < ${a}$。所以答案是反双曲正切，$a = ${a}$。`,
                ),
              ],
              [
                ["Apply the artanh rule", "用 artanh 公式"],
                t(
                  `The rule has the factor $\\frac{1}{a}$, here $\\frac{1}{${a}}$:`,
                  `公式有因子 $\\frac{1}{a}$，这里是 $\\frac{1}{${a}}$：`,
                ),
                [
                  `\\int ${fracOf(k, den)} \\, dx = ${k} \\cdot \\frac{1}{${a}}\\operatorname{artanh}\\left(\\frac{x}{${a}}\\right) + C = ${answer}`,
                ],
              ],
            ],
            t(
              `Differentiate the artanh by the chain rule:${steps(`\\frac{d}{dx}\\operatorname{artanh}\\left(\\frac{x}{${a}}\\right) = \\frac{1}{${a}} \\cdot \\frac{1}{1 - \\frac{x^{2}}{${a * a}}} = \\frac{${a}}{${den}}`)}Times $${c.toLatex()}$, this gives $${fracOf(k, den)}$, the integrand.`,
              `用链式法则对 artanh 求导：${steps(`\\frac{d}{dx}\\operatorname{artanh}\\left(\\frac{x}{${a}}\\right) = \\frac{1}{${a}} \\cdot \\frac{1}{1 - \\frac{x^{2}}{${a * a}}} = \\frac{${a}}{${den}}`)}乘以 $${c.toLatex()}$ 得 $${fracOf(k, den)}$，正是被积函数。`,
            ),
          ),
        });
      },
    },
  ],
};

/** reciprocalHyperbolicProblem builds ∫ k/(x√(a² ∓ x²)) dx, integrated to arsech or arcsch. */
function reciprocalHyperbolicProblem(rng: Rng, minus: boolean) {
  const a = minus ? rng.int(4, 9) : rng.int(1, 9);
  const k = rng.nonZero(-12, 12);
  const c = Q.of(-k, a);
  const name = minus ? "arsech" : "arcsch";
  const op = minus ? "-" : "+";
  const arg = a === 1 ? "x" : `\\frac{x}{${a}}`;
  const fn = `\\operatorname{${name}}\\left(${arg}\\right)`;
  const den = `x\\sqrt{${a * a} ${op} x^{2}}`;
  const domain = minus ? `0 < x < ${a}` : "x > 0";
  const answer = `${coef(c)}${fn} + C`;
  const slope =
    a === 1
      ? `\\frac{d}{dx}${fn} = -\\frac{1}{${den}}`
      : `\\frac{d}{dx}${fn} = -\\frac{1}{${a}} \\cdot \\frac{1}{\\frac{x}{${a}}\\sqrt{1 ${op} \\frac{x^{2}}{${a * a}}}} = -\\frac{${a}}{${den}}`;
  return functionProblem({
    prompt: t(`Find $\\int ${fracOf(k, den)} \\, dx$ for $${domain}$.`, `当 $${domain}$ 时，求 $\\int ${fracOf(k, den)} \\, dx$。`),
    answer,
    antiderivative: true,
    positive: true,
    wrong: [
      `${coef(c.neg())}${fn} + C`,
      `${coef(Q.of(-k))}${fn} + C`,
      `${coef(c)}${minus ? `\\arcsin\\left(${arg}\\right)` : `\\operatorname{arsinh}\\left(${arg}\\right)`} + C`,
    ],
    solution: walked(
      [
        [
          ["Match the form", "对照公式"],
          t(
            `The variable $x$ multiplies $\\sqrt{${a * a} ${op} x^{2}}$, a constant ${minus ? "minus" : "plus"} a square, with $${a * a} = ${a}^{2}$. So the answer is an inverse hyperbolic ${minus ? "secant" : "cosecant"} with $a = ${a}$.`,
            `变量 $x$ 乘以 $\\sqrt{${a * a} ${op} x^{2}}$，这是常数${minus ? "减" : "加"}平方，$${a * a} = ${a}^{2}$。所以答案是反双曲${minus ? "正割" : "余割"}，$a = ${a}$。`,
          ),
        ],
        [
          ["Apply the rule with its minus sign", "用公式，带上负号"],
          t(`The rule has the factor $-\\frac{1}{a}$, here $-\\frac{1}{${a}}$:`, `公式有因子 $-\\frac{1}{a}$，这里是 $-\\frac{1}{${a}}$：`),
          [`\\int ${fracOf(k, den)} \\, dx = ${k} \\cdot \\left(-\\frac{1}{${a}}\\right)${fn} + C = ${answer}`],
        ],
      ],
      t(
        `Differentiate the ${name} by the chain rule, for $${domain}$:${steps(slope)}Times $${c.toLatex()}$, this gives $${fracOf(k, den)}$, the integrand.`,
        `在 $${domain}$ 上用链式法则对 ${name} 求导：${steps(slope)}乘以 $${c.toLatex()}$ 得 $${fracOf(k, den)}$，正是被积函数。`,
      ),
    ),
  });
}

/** integrationUsingInverseReciprocalHyperbolicFunctions integrates to arsech and arcsch. */
export const integrationUsingInverseReciprocalHyperbolicFunctions: TopicDef = {
  id: "integration-using-inverse-reciprocal-hyperbolic-functions",
  title: t("Integration Using Inverse Reciprocal Hyperbolic Functions", "用反倒数双曲函数积分"),
  summary: t(
    "Integrate 1/(x√(a² − x²)) and 1/(x√(a² + x²)) to arsech and arcsch.",
    "把 1/(x√(a² − x²)) 和 1/(x√(a² + x²)) 积分为 arsech 和 arcsch。",
  ),
  prerequisites: ["integration-using-inverse-hyperbolic-functions", "differentiating-inverse-reciprocal-hyperbolic-functions"],
  encompasses: [],
  xp: 10,
  standards: [],
  intro: t(
    `The derivative of $\\operatorname{arsech} x$ is $-\\frac{1}{x\\sqrt{1 - x^{2}}}$ for $0 < x < 1$. Reversed, $\\int \\frac{1}{x\\sqrt{1 - x^{2}}} \\, dx = -\\operatorname{arsech} x + C$, with a minus sign.

Check: $\\operatorname{arsech}$ decreases on $(0, 1)$, while the integrand is positive there. So the antiderivative must increase, and $-\\operatorname{arsech} x$ does.

In this lesson we integrate $\\frac{1}{x\\sqrt{a^{2} - x^{2}}}$ and $\\frac{1}{x\\sqrt{a^{2} + x^{2}}}$ to arsech and arcsch, with their minus signs and the factor $\\frac{1}{a}$.`,
    `当 $0 < x < 1$ 时，$\\operatorname{arsech} x$ 的导数是 $-\\frac{1}{x\\sqrt{1 - x^{2}}}$。反过来，$\\int \\frac{1}{x\\sqrt{1 - x^{2}}} \\, dx = -\\operatorname{arsech} x + C$，带一个负号。

检验：$\\operatorname{arsech}$ 在 $(0, 1)$ 上递减，而被积函数在那里为正。所以原函数必须递增，而 $-\\operatorname{arsech} x$ 正是递增的。

这节课我们把 $\\frac{1}{x\\sqrt{a^{2} - x^{2}}}$ 和 $\\frac{1}{x\\sqrt{a^{2} + x^{2}}}$ 积分为 arsech 和 arcsch，并注意它们的负号和因子 $\\frac{1}{a}$。`,
  ),
  knowledgePoints: [
    {
      id: "integrating-to-arsech",
      title: t("Integrating to arsech", "积分为 arsech"),
      explanation: t(
        "When the variable multiplies a root of a constant minus its square, the integral reverses the derivative of the inverse hyperbolic secant. For $0 < x < a$,\n\n$$\\int \\frac{1}{x\\sqrt{a^{2} - x^{2}}} \\, dx = -\\frac{1}{a}\\operatorname{arsech} \\frac{x}{a} + C.$$\n\nThe minus sign comes from the derivative of $\\operatorname{arsech} x$, which is $-\\frac{1}{x\\sqrt{1 - x^{2}}}$. For example, with $a = 2$ the integral of $\\frac{1}{x\\sqrt{4 - x^{2}}}$ for $0 < x < 2$ is $-\\frac{1}{2}\\operatorname{arsech} \\frac{x}{2} + C$.\n\nCheck: by the chain rule, the derivative of $-\\frac{1}{2}\\operatorname{arsech} \\frac{x}{2}$ is $-\\frac{1}{2} \\cdot \\frac{1}{2} \\cdot \\left(-\\frac{1}{\\frac{x}{2}\\sqrt{1 - \\frac{x^{2}}{4}}}\\right)$, which simplifies to $\\frac{1}{x\\sqrt{4 - x^{2}}}$.\n\n> **Watch out.** Keep the minus sign and the factor $\\frac{1}{a}$. Without the minus sign the answer would decrease where the integrand is positive, since $\\operatorname{arsech}$ is a decreasing function.",
        "当变量乘以常数减其平方的平方根时，这个积分是反双曲正割求导的逆过程。当 $0 < x < a$ 时，\n\n$$\\int \\frac{1}{x\\sqrt{a^{2} - x^{2}}} \\, dx = -\\frac{1}{a}\\operatorname{arsech} \\frac{x}{a} + C$$\n\n负号来自 $\\operatorname{arsech} x$ 的导数，它是 $-\\frac{1}{x\\sqrt{1 - x^{2}}}$。例如，取 $a = 2$，当 $0 < x < 2$ 时 $\\frac{1}{x\\sqrt{4 - x^{2}}}$ 的积分是 $-\\frac{1}{2}\\operatorname{arsech} \\frac{x}{2} + C$。\n\n检验：由链式法则，$-\\frac{1}{2}\\operatorname{arsech} \\frac{x}{2}$ 的导数是 $-\\frac{1}{2} \\cdot \\frac{1}{2} \\cdot \\left(-\\frac{1}{\\frac{x}{2}\\sqrt{1 - \\frac{x^{2}}{4}}}\\right)$，化简后是 $\\frac{1}{x\\sqrt{4 - x^{2}}}$。\n\n> **注意。** 要保留负号和因子 $\\frac{1}{a}$。没有负号时，答案会在被积函数为正的地方递减，因为 $\\operatorname{arsech}$ 是递减函数。",
      ),
      generate(rng) {
        return reciprocalHyperbolicProblem(rng, true);
      },
    },
    {
      id: "integrating-to-arcsch",
      title: t("Integrating to arcsch", "积分为 arcsch"),
      explanation: t(
        "When the variable multiplies a root of a constant plus its square, the integral reverses the derivative of the inverse hyperbolic cosecant, which also carries a minus sign. For $x > 0$,\n\n$$\\int \\frac{1}{x\\sqrt{a^{2} + x^{2}}} \\, dx = -\\frac{1}{a}\\operatorname{arcsch} \\frac{x}{a} + C.$$\n\nFor example, with $a = 1$ the integral of $\\frac{1}{x\\sqrt{1 + x^{2}}}$ for $x > 0$ is $-\\operatorname{arcsch} x + C$.\n\nCheck: the derivative of $\\operatorname{arcsch} x$ is $-\\frac{1}{x\\sqrt{1 + x^{2}}}$ for $x > 0$, so the two minus signs cancel.\n\n> **Watch out.** $\\sqrt{a^{2} + x^{2}}$ with a plus sign gives arcsch, and $\\sqrt{a^{2} - x^{2}}$ gives arsech. Both carry a minus sign and the factor $\\frac{1}{a}$.",
        "当变量乘以常数加其平方的平方根时，这个积分是反双曲余割求导的逆过程，同样带有负号。当 $x > 0$ 时，\n\n$$\\int \\frac{1}{x\\sqrt{a^{2} + x^{2}}} \\, dx = -\\frac{1}{a}\\operatorname{arcsch} \\frac{x}{a} + C$$\n\n例如，取 $a = 1$，当 $x > 0$ 时 $\\frac{1}{x\\sqrt{1 + x^{2}}}$ 的积分是 $-\\operatorname{arcsch} x + C$。\n\n检验：当 $x > 0$ 时 $\\operatorname{arcsch} x$ 的导数是 $-\\frac{1}{x\\sqrt{1 + x^{2}}}$，两个负号相互抵消。\n\n> **注意。** 带加号的 $\\sqrt{a^{2} + x^{2}}$ 给出 arcsch，$\\sqrt{a^{2} - x^{2}}$ 给出 arsech。两者都带负号和因子 $\\frac{1}{a}$。",
      ),
      generate(rng) {
        return reciprocalHyperbolicProblem(rng, false);
      },
    },
  ],
};

/** calculusIAntiderivativeTopics are the topics of Calculus I module 8.23. */
export const calculusIAntiderivativeTopics: readonly TopicDef[] = [
  theAntiderivative,
  theConstantMultipleRuleForIndefiniteIntegrals,
  theSumRuleForIndefiniteIntegrals,
  integratingTheReciprocalFunction,
  integratingExponentialFunctions,
  integratingTrigonometricFunctions,
  integrationUsingInverseTrigonometricFunctions,
  integratingHyperbolicFunctions,
  integrationUsingInverseHyperbolicFunctions,
  integrationUsingInverseReciprocalHyperbolicFunctions,
];
