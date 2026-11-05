import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Coefficient, linear, poly, Q } from "@ga/subject-math";

import { functionProblem, steps } from "../problems.ts";
import { oneOf, par } from "./calculus-common.ts";

// Calculus I unit 8: Integration, module 8.23.

/** powerLatex writes x raised to a rational exponent: "x", "x^{3}", "x^{-\frac{1}{2}}". */
const powerLatex = (e: Q, v = "x") => (e.eq(Q.one) ? v : `${v}^{${e.toLatex()}}`);

/** plusC writes an antiderivative from its terms, ending in "+ C". */
const plusC = (...terms: (readonly [Coefficient, string])[]) => `${poly(...terms) || "0"} + C`;

/** coef writes a coefficient in front of a function: "", "-", "3", "\frac{1}{2}". */
const coef = (c: Q) => (c.eq(Q.one) ? "" : c.eq(Q.one.neg()) ? "-" : c.toLatex());

/** xPow writes x to a natural power: "", "x", "x^{2}". */
const xPow = (i: number) => (i === 0 ? "" : i === 1 ? "x" : `x^{${i}}`);

/** exponents are the exponents used for the power rule, excluding −1. */
const exponents: readonly Q[] = [
  ...[-5, -4, -3, -2, 0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => Q.of(n)),
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
  return { n, integrand: [Q.of(k), n.isZero() ? "" : powerLatex(n)] as const, antiderivative: [Q.of(k).div(up), powerLatex(up)] as const };
}

/** theAntiderivative introduces antiderivatives and the power rule. */
export const theAntiderivative: TopicDef = {
  id: "the-antiderivative",
  title: t("The Antiderivative", "原函数"),
  summary: t(
    "Recognize antiderivatives, integrate powers of x, and fix the constant of integration from a known value.",
    "识别原函数，求 x 的幂的不定积分，并由已知值确定积分常数。",
  ),
  prerequisites: ["the-mean-value-theorem"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-antiderivatives",
      title: t("Recognizing antiderivatives", "识别原函数"),
      explanation: t(
        "$F$ is an antiderivative of $f$ if $F'(x) = f(x)$. To check a candidate, differentiate it. Antiderivatives are not unique: $F(x) + C$ works for every constant $C$, and by the mean value theorem these are all of them on an interval. The family is written $\\int f(x) \\, dx = F(x) + C$.",
        "若 $F'(x) = f(x)$，则 $F$ 是 $f$ 的一个原函数。检验候选函数时，对它求导即可。原函数不唯一：对任意常数 $C$，$F(x) + C$ 都是；由中值定理，在一个区间上原函数只有这些。这一族函数记作 $\\int f(x) \\, dx = F(x) + C$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-5, 5);
        const b = rng.int(2, 4);
        const c = rng.int(-9, 9);
        const kind = rng.int(0, 2);
        const [f, right, wrong] =
          kind === 0
            ? [
                poly([a * (b + 1), `x^{${b}}`]),
                poly([a, `x^{${b + 1}}`], [c, ""]),
                [poly([a * (b + 1) * b, xPow(b - 1)]), poly([a * (b + 1), `x^{${b + 1}}`]), poly([a, `x^{${b + 1}}`], [c, "x"])],
              ]
            : kind === 1
              ? [
                  `${a === 1 ? "" : a === -1 ? "-" : a}\\cos x`,
                  `${a === 1 ? "" : a === -1 ? "-" : a}\\sin x${c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`}`,
                  [
                    `${-a === 1 ? "" : -a === -1 ? "-" : -a}\\sin x`,
                    `${-a === 1 ? "" : -a === -1 ? "-" : -a}\\cos x`,
                    `${a === 1 ? "" : a === -1 ? "-" : a}x\\sin x`,
                  ],
                ]
              : [
                  `${a === 1 ? "" : a === -1 ? "-" : a}e^{x}`,
                  `${a === 1 ? "" : a === -1 ? "-" : a}e^{x}${c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`}`,
                  [
                    `${a === 1 ? "" : a === -1 ? "-" : a}xe^{x}`,
                    `${a === 1 ? "" : a === -1 ? "-" : a}e^{x + 1}`,
                    `${a === 1 ? "" : a === -1 ? "-" : a}e^{x - 1}x`,
                  ],
                ];
        return oneOf(
          rng,
          t(`Which function is an antiderivative of $f(x) = ${f}$?`, `下列哪个函数是 $f(x) = ${f}$ 的原函数？`),
          t(`$${right}$`, `$${right}$`),
          wrong.map((w) => t(`$${w}$`, `$${w}$`)),
          t(
            `Differentiating $${right}$ gives $${f}$; the constant term differentiates to $0$. None of the others has derivative $${f}$.`,
            `对 $${right}$ 求导得 $${f}$，常数项的导数为 $0$。其他选项的导数都不是 $${f}$。`,
          ),
        );
      },
    },
    {
      id: "the-power-rule-for-integration",
      title: t("The power rule for integration", "积分的幂法则"),
      explanation: t(
        "Reversing the power rule for derivatives: for $n \\ne -1$,\n\n$$\\int x^{n} \\, dx = \\frac{x^{n + 1}}{n + 1} + C.$$\n\nRaise the exponent by one, then divide by the new exponent. Rewrite roots and reciprocals as powers first: $\\frac{1}{x^{3}} = x^{-3}$, $\\sqrt{x} = x^{\\frac{1}{2}}$.",
        "把求导的幂法则反过来：当 $n \\ne -1$ 时，\n\n$$\\int x^{n} \\, dx = \\frac{x^{n + 1}}{n + 1} + C$$\n\n指数加一，再除以新的指数。先把根式和倒数写成幂：$\\frac{1}{x^{3}} = x^{-3}$，$\\sqrt{x} = x^{\\frac{1}{2}}$。",
      ),
      generate(rng) {
        const { n, antiderivative } = powerTerm(rng);
        const shown =
          rng.bool(0.4) && n.sign() < 0 && n.d === 1n
            ? `\\frac{1}{x^{${n.neg().toLatex()}}}`
            : n.eq(Q.of(1, 2)) && rng.bool()
              ? "\\sqrt{x}"
              : n.isZero()
                ? "1"
                : powerLatex(n);
        const up = n.add(Q.one);
        return functionProblem({
          prompt: t(`Find $\\int ${shown} \\, dx$.`, `求 $\\int ${shown} \\, dx$。`),
          answer: plusC(antiderivative),
          antiderivative: true,
          wrong: [plusC([Q.one, powerLatex(up)]), plusC([n, powerLatex(n.sub(Q.one))]), plusC([up, powerLatex(up)])],
          solution: t(
            `${shown === powerLatex(n) || shown === "1" ? "" : `Write $${shown} = ${powerLatex(n)}$. `}Raise the exponent to $${up.toLatex()}$ and divide by it: $${plusC(antiderivative)}$.`,
            `${shown === powerLatex(n) || shown === "1" ? "" : `把 $${shown}$ 写成 $${powerLatex(n)}$。`}指数加一变为 $${up.toLatex()}$，再除以它：$${plusC(antiderivative)}$。`,
          ),
        });
      },
    },
    {
      id: "antiderivatives-through-a-point",
      title: t("Antiderivatives through a point", "过定点的原函数"),
      explanation: t(
        "A known value picks one antiderivative from the family. Integrate to get $F(x) + C$, substitute the known point, and solve for $C$. If $f'(x) = 6x^{2}$ and $f(1) = 5$: $f(x) = 2x^{3} + C$, $2 + C = 5$, so $f(x) = 2x^{3} + 3$.",
        "已知一个函数值，就能从原函数族中确定一个。先积分得 $F(x) + C$，代入已知点，解出 $C$。若 $f'(x) = 6x^{2}$ 且 $f(1) = 5$：$f(x) = 2x^{3} + C$，$2 + C = 5$，所以 $f(x) = 2x^{3} + 3$。",
      ),
      generate(rng) {
        const p = [rng.int(-9, 9), rng.int(-4, 4), rng.nonZero(-3, 3)];
        const a = rng.int(-2, 2);
        const y = rng.int(-10, 10);
        // f'(x) = p2·(3x²)·… : choose f'(x) = 3p2 x² + 2p1 x + p0 so that f has integer coefficients.
        const fPrime = poly([3 * p[2]!, "x^{2}"], [2 * p[1]!, "x"], [p[0]!, ""]);
        const base = p[2]! * a ** 3 + p[1]! * a * a + p[0]! * a;
        const c = y - base;
        const answer = poly([p[2]!, "x^{3}"], [p[1]!, "x^{2}"], [p[0]!, "x"], [c, ""]) || "0";
        return functionProblem({
          prompt: t(`Find $f(x)$ if $f'(x) = ${fPrime}$ and $f(${a}) = ${y}$.`, `已知 $f'(x) = ${fPrime}$，$f(${a}) = ${y}$，求 $f(x)$。`),
          prefix: "f(x) =",
          answer,
          wrong: [
            poly([p[2]!, "x^{3}"], [p[1]!, "x^{2}"], [p[0]!, "x"], [y, ""]) || "0",
            poly([p[2]!, "x^{3}"], [p[1]!, "x^{2}"], [p[0]!, "x"]) || "0",
            poly([p[2]!, "x^{3}"], [p[1]!, "x^{2}"], [p[0]!, "x"], [y + base, ""]) || "0",
          ],
          solution: t(
            `$f(x) = ${poly([p[2]!, "x^{3}"], [p[1]!, "x^{2}"], [p[0]!, "x"]) || "0"} + C$. Then $f(${a}) = ${base} + C = ${y}$, so $C = ${c}$ and $f(x) = ${answer}$.`,
            `$f(x) = ${poly([p[2]!, "x^{3}"], [p[1]!, "x^{2}"], [p[0]!, "x"]) || "0"} + C$。由 $f(${a}) = ${base} + C = ${y}$ 得 $C = ${c}$，所以 $f(x) = ${answer}$。`,
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
  knowledgePoints: [
    {
      id: "constant-multiples-of-powers",
      title: t("Constant multiples of powers", "幂的常数倍"),
      explanation: t(
        "To integrate a power, increase the exponent by one and divide by the new exponent, which reverses the power rule for derivatives. Constants come out of integrals: $\\int k f(x) \\, dx = k \\int f(x) \\, dx$. So $\\int 6x^{2} \\, dx = 6 \\cdot \\frac{x^{3}}{3} + C = 2x^{3} + C$.",
        "对幂积分时，把指数加 1 再除以新的指数，这正好是求导幂法则的逆过程。常数可以提到积分号外：$\\int k f(x) \\, dx = k \\int f(x) \\, dx$。所以 $\\int 6x^{2} \\, dx = 6 \\cdot \\frac{x^{3}}{3} + C = 2x^{3} + C$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-12, 12);
        const { n, integrand, antiderivative } = powerTerm(rng, k);
        const up = n.add(Q.one);
        return functionProblem({
          prompt: t(`Find $\\int ${poly(integrand)} \\, dx$.`, `求 $\\int ${poly(integrand)} \\, dx$。`),
          answer: plusC(antiderivative),
          antiderivative: true,
          wrong: [
            plusC([Q.of(k), powerLatex(up)]),
            plusC([Q.of(k).mul(up), powerLatex(up)]),
            plusC([Q.of(k).mul(n), powerLatex(n.sub(Q.one))]),
          ],
          solution: t(
            `$\\int ${poly(integrand)} \\, dx = ${k} \\cdot \\frac{${powerLatex(up)}}{${up.toLatex()}} + C = ${plusC(antiderivative)}$.`,
            `$\\int ${poly(integrand)} \\, dx = ${k} \\cdot \\frac{${powerLatex(up)}}{${up.toLatex()}} + C = ${plusC(antiderivative)}$。`,
          ),
        });
      },
    },
    {
      id: "constant-multiples-of-roots-and-reciprocals",
      title: t("Constant multiples of roots and reciprocals", "根式与倒数的常数倍"),
      explanation: t(
        "Roots and reciprocals must be rewritten as powers before integrating, because the power rule only applies once the expression is a power of the variable. Rewrite first, then integrate. $\\frac{k}{x^{n}} = kx^{-n}$ and $k\\sqrt[m]{x^{p}} = kx^{\\frac{p}{m}}$. For example $\\int \\frac{4}{\\sqrt{x}} \\, dx = \\int 4x^{-\\frac{1}{2}} \\, dx = 8x^{\\frac{1}{2}} + C$.",
        "积分前必须把根式和倒数改写成幂，因为只有当式子是变量的幂时才能用幂法则。先改写再积分。$\\frac{k}{x^{n}} = kx^{-n}$，$k\\sqrt[m]{x^{p}} = kx^{\\frac{p}{m}}$。例如 $\\int \\frac{4}{\\sqrt{x}} \\, dx = \\int 4x^{-\\frac{1}{2}} \\, dx = 8x^{\\frac{1}{2}} + C$。",
      ),
      generate(rng) {
        const k = rng.int(1, 12);
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
        return functionProblem({
          prompt: t(`Find $\\int ${shown} \\, dx$.`, `求 $\\int ${shown} \\, dx$。`),
          answer: plusC(anti),
          antiderivative: true,
          wrong: [
            plusC([Q.of(k), powerLatex(up)]),
            plusC([Q.of(k).mul(up), powerLatex(up)]),
            plusC([Q.of(k).div(n.sub(Q.one)), powerLatex(n.sub(Q.one))]),
          ],
          solution: t(
            `$${shown} = ${poly([Q.of(k), powerLatex(n)])}$, so the integral is $${k} \\cdot \\frac{${powerLatex(up)}}{${up.toLatex()}} + C = ${plusC(anti)}$.`,
            `$${shown} = ${poly([Q.of(k), powerLatex(n)])}$，所以积分为 $${k} \\cdot \\frac{${powerLatex(up)}}{${up.toLatex()}} + C = ${plusC(anti)}$。`,
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
  knowledgePoints: [
    {
      id: "integrating-polynomials",
      title: t("Integrating polynomials", "多项式的积分"),
      explanation: t(
        "Because an integral of a sum is the sum of the integrals, a polynomial is integrated term by term, and only one constant is needed for the whole answer. Integrals split over sums: $\\int (f + g) \\, dx = \\int f \\, dx + \\int g \\, dx$. Integrate each term and write one $+ C$ at the end.",
        "由于和的积分等于积分的和，多项式可以逐项积分，整个答案只需要一个常数。积分对和式可拆开：$\\int (f + g) \\, dx = \\int f \\, dx + \\int g \\, dx$。逐项积分，最后只写一个 $+ C$。",
      ),
      generate(rng) {
        const cs = [rng.int(-9, 9), rng.int(-9, 9), rng.int(-9, 9), rng.nonZero(-8, 8)];
        const deg = rng.int(2, 3);
        const terms = cs.slice(0, deg + 1).map((c, i) => [c, xPow(i)] as const);
        const integrand = poly(...[...terms].reverse());
        const anti = [...terms].reverse().map(([c, _], j) => {
          const i = deg - j;
          return [Q.of(c, i + 1), xPow(i + 1)] as const;
        });
        const shownTerms = [...terms]
          .reverse()
          .map(([c], j) => [c, deg - j] as const)
          .filter(([c]) => c !== 0)
          .map(([c, i]) => `\\frac{${c}}{${i + 1}}x^{${i + 1}}`)
          .join(" + ");
        return functionProblem({
          prompt: t(`Find $\\int (${integrand}) \\, dx$.`, `求 $\\int (${integrand}) \\, dx$。`),
          answer: plusC(...anti),
          antiderivative: true,
          wrong: [
            plusC(...[...terms].reverse().map(([c, _], j) => [c, xPow(deg - j + 1)] as const)),
            plusC(...anti.slice(0, -1)),
            plusC(...[...terms].reverse().map(([c, _], j) => [c * (deg - j), xPow(Math.max(deg - j - 1, 0))] as const)),
          ],
          solution: t(
            `Integrate term by term. Each power goes up by 1, and each coefficient is divided by the new power:${steps(`\\int (${integrand}) \\, dx = ${shownTerms} + C = ${plusC(...anti)}`)}`,
            `逐项积分。每一项的次数加 1，系数除以新的次数：${steps(`\\int (${integrand}) \\, dx = ${shownTerms} + C = ${plusC(...anti)}`)}`,
          ),
        });
      },
    },
    {
      id: "expanding-before-integrating",
      title: t("Expanding before integrating", "先展开再积分"),
      explanation: t(
        "There is no product or quotient rule for integrals. Expand products and split quotients into separate terms first: $\\int \\frac{x^{3} + 4}{x^{2}} \\, dx = \\int (x + 4x^{-2}) \\, dx = \\frac{x^{2}}{2} - 4x^{-1} + C$.",
        "积分没有乘积法则或商法则。先展开乘积，把商拆成单独的项：$\\int \\frac{x^{3} + 4}{x^{2}} \\, dx = \\int (x + 4x^{-2}) \\, dx = \\frac{x^{2}}{2} - 4x^{-1} + C$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-6, 6);
        const b = rng.nonZero(-6, 6);
        if (rng.bool()) {
          const mid = a + b;
          const integrand = `(${linear(1, a)})(${linear(1, b)})`;
          const anti = [
            [Q.of(1, 3), "x^{3}"],
            [Q.of(mid, 2), "x^{2}"],
            [Q.of(a * b), "x"],
          ] as const;
          return functionProblem({
            prompt: t(`Find $\\int ${integrand} \\, dx$.`, `求 $\\int ${integrand} \\, dx$。`),
            answer: plusC(...anti),
            antiderivative: true,
            wrong: [
              `\\left(\\frac{x^{2}}{2} + ${par(a)}x\\right)\\left(\\frac{x^{2}}{2} + ${par(b)}x\\right) + C`,
              plusC([Q.of(1, 3), "x^{3}"], [Q.of(a * b), "x"]),
              plusC([Q.one, "x^{3}"], [Q.of(mid), "x^{2}"], [Q.of(a * b), "x"]),
            ],
            solution: t(
              `Expand: $${integrand} = ${poly([1, "x^{2}"], [mid, "x"], [a * b, ""])}$. Then integrate term by term: $${plusC(...anti)}$.`,
              `展开：$${integrand} = ${poly([1, "x^{2}"], [mid, "x"], [a * b, ""])}$。再逐项积分：$${plusC(...anti)}$。`,
            ),
          });
        }
        const n = rng.int(2, 3);
        const top = poly([1, `x^{${n + 1}}`], [b, ""]);
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
          solution: t(
            `Split the quotient: $\\frac{${top}}{x^{${n}}} = ${poly([1, "x"], [b, `x^{${-n}}`])}$. Then $\\int (${poly([1, "x"], [b, `x^{${-n}}`])}) \\, dx = ${plusC(...anti)}$.`,
            `把商拆开：$\\frac{${top}}{x^{${n}}} = ${poly([1, "x"], [b, `x^{${-n}}`])}$。于是 $\\int (${poly([1, "x"], [b, `x^{${-n}}`])}) \\, dx = ${plusC(...anti)}$。`,
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
  knowledgePoints: [
    {
      id: "integrating-one-over-x",
      title: t("Integrating 1/x", "1/x 的积分"),
      explanation: t(
        "The power rule fails for $n = -1$. Instead, since $\\frac{d}{dx}\\ln|x| = \\frac{1}{x}$ for $x \\ne 0$,\n\n$$\\int \\frac{1}{x} \\, dx = \\ln|x| + C.$$\n\nThe absolute value makes the antiderivative valid for negative $x$ too.",
        "幂法则在 $n = -1$ 时失效。由于当 $x \\ne 0$ 时 $\\frac{d}{dx}\\ln|x| = \\frac{1}{x}$，\n\n$$\\int \\frac{1}{x} \\, dx = \\ln|x| + C$$\n\n绝对值使原函数对负的 $x$ 也成立。",
      ),
      generate(rng) {
        const k = rng.nonZero(-12, 12);
        const extra = rng.bool() ? powerTerm(rng, rng.nonZero(-6, 6)) : undefined;
        const shown = extra ? `${poly(extra.integrand)} ${k < 0 ? "-" : "+"} \\frac{${Math.abs(k)}}{x}` : `\\frac{${k}}{x}`;
        const terms = [...(extra ? [extra.antiderivative] : []), [Q.of(k), "\\ln|x|"] as const];
        return functionProblem({
          prompt: t(
            `Find $\\int ${extra ? `\\left(${shown}\\right)` : shown} \\, dx$.`,
            `求 $\\int ${extra ? `\\left(${shown}\\right)` : shown} \\, dx$。`,
          ),
          answer: plusC(...terms),
          antiderivative: true,
          wrong: [
            plusC(...(extra ? [extra.antiderivative] : []), [Q.of(-k), "x^{-2}"]),
            plusC(...(extra ? [extra.antiderivative] : []), [Q.of(k), "x"]),
            plusC(...(extra ? [extra.antiderivative] : []), [Q.of(1, k), "\\ln|x|"]),
          ],
          solution: t(
            `Since $\\frac{d}{dx}\\ln|x| = \\frac{1}{x}$, $\\int \\frac{${k}}{x} \\, dx = ${coef(Q.of(k))}\\ln|x| + C$${extra ? `, and the power term integrates by the power rule: $${plusC(...terms)}$` : ""}.`,
            `由 $\\frac{d}{dx}\\ln|x| = \\frac{1}{x}$，$\\int \\frac{${k}}{x} \\, dx = ${coef(Q.of(k))}\\ln|x| + C$${extra ? `，幂函数项用幂法则积分：$${plusC(...terms)}$` : ""}。`,
          ),
        });
      },
    },
    {
      id: "quotients-that-produce-logarithms",
      title: t("Quotients that produce logarithms", "产生对数的商"),
      explanation: t(
        "The power rule fails for the reciprocal of the variable, whose antiderivative is the natural logarithm of its absolute value. Split a quotient over $x$ into terms; the term with $x^{-1}$ gives a logarithm. $\\int \\frac{x^{2} + 3}{x} \\, dx = \\int \\left(x + \\frac{3}{x}\\right) dx = \\frac{x^{2}}{2} + 3\\ln|x| + C$.",
        "幂法则对变量的倒数不适用，它的原函数是其绝对值的自然对数。把除以 $x$ 的商拆成若干项；含 $x^{-1}$ 的项积分得对数。$\\int \\frac{x^{2} + 3}{x} \\, dx = \\int \\left(x + \\frac{3}{x}\\right) dx = \\frac{x^{2}}{2} + 3\\ln|x| + C$。",
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
        return functionProblem({
          prompt: t(`Find $\\int \\frac{${top}}{${denL}} \\, dx$.`, `求 $\\int \\frac{${top}}{${denL}} \\, dx$。`),
          answer: plusC(...anti),
          antiderivative: true,
          wrong: [
            plusC([Q.of(a, den * (n + 1)), `x^{${n + 1}}`], [Q.of(-b, den), "x^{-2}"]),
            plusC([Q.of(a, den), `x^{${n + 1}}`], [Q.of(b, den), "\\ln|x|"]),
            plusC([Q.of(a, den * (n + 1)), `x^{${n + 1}}`]),
          ],
          solution: t(
            `$\\frac{${top}}{${denL}} = ${poly([Q.of(a, den), xPow(n)], [Q.of(b, den), "x^{-1}"]).replace("x^{-1}", "\\cdot\\frac{1}{x}")}$, so the integral is $${plusC(...anti)}$.`,
            `$\\frac{${top}}{${denL}} = ${poly([Q.of(a, den), xPow(n)], [Q.of(b, den), "x^{-1}"]).replace("x^{-1}", "\\cdot\\frac{1}{x}")}$，所以积分为 $${plusC(...anti)}$。`,
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
  knowledgePoints: [
    {
      id: "integrating-natural-exponentials",
      title: t("Integrating natural exponentials", "自然指数函数的积分"),
      explanation: t(
        "The exponential function is its own antiderivative, and when the exponent has a coefficient, dividing by it undoes the factor the chain rule would produce. $\\int e^{x} \\, dx = e^{x} + C$. With a linear exponent, divide by its coefficient: $\\int e^{kx + b} \\, dx = \\frac{1}{k}e^{kx + b} + C$, since differentiating $e^{kx + b}$ multiplies by $k$.",
        "指数函数的原函数就是它自己；当指数有系数时，除以这个系数可以抵消链式法则产生的因子。$\\int e^{x} \\, dx = e^{x} + C$。指数为一次式时，除以其系数：$\\int e^{kx + b} \\, dx = \\frac{1}{k}e^{kx + b} + C$，因为对 $e^{kx + b}$ 求导会乘以 $k$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-12, 12);
        const k = rng.nonZero(-6, 6);
        const b = rng.int(-4, 4);
        const e = `e^{${linear(k, b)}}`;
        const c = Q.of(a, k);
        return functionProblem({
          prompt: t(`Find $\\int ${coef(Q.of(a))}${e} \\, dx$.`, `求 $\\int ${coef(Q.of(a))}${e} \\, dx$。`),
          answer: plusC([c, e]),
          antiderivative: true,
          wrong: [plusC([Q.of(a * k), e]), plusC([Q.of(a), e]), plusC([Q.of(-a, k), e])],
          solution: t(
            `Differentiating $${e}$ multiplies by $${k}$, so divide by $${k}$: $${plusC([c, e])}$.`,
            `对 $${e}$ 求导会乘以 $${k}$，所以除以 $${k}$：$${plusC([c, e])}$。`,
          ),
        });
      },
    },
    {
      id: "integrating-general-exponentials",
      title: t("Integrating general exponentials", "一般指数函数的积分"),
      explanation: t(
        "Differentiating a power of another base produces an extra natural logarithm factor, so integrating must divide by that same factor. Since $\\frac{d}{dx}a^{x} = a^{x}\\ln a$, $\\int a^{x} \\, dx = \\frac{a^{x}}{\\ln a} + C$ for $a > 0$, $a \\ne 1$.",
        "对其他底数的指数函数求导会多出一个自然对数因子，所以积分时要除以这个因子。由于 $\\frac{d}{dx}a^{x} = a^{x}\\ln a$，当 $a > 0$、$a \\ne 1$ 时 $\\int a^{x} \\, dx = \\frac{a^{x}}{\\ln a} + C$。",
      ),
      generate(rng) {
        const base = rng.pick([2, 3, 5, 7, 10]);
        const k = rng.int(1, 12);
        const withPower = rng.bool();
        const p = rng.nonZero(-6, 6);
        const n = rng.int(2, 5);
        const kTimes = k === 1 ? "" : `${k}\\cdot `;
        const shown =
          `${k === 1 ? "" : k}\\cdot ${base}^{x}${withPower ? ` ${p < 0 ? "-" : "+"} ${Math.abs(p) === 1 ? "" : Math.abs(p)}x^{${n}}` : ""}`.replace(
            /^\\cdot /,
            "",
          );
        const integrand = withPower ? `(${shown})` : shown;
        const answer = `\\frac{${kTimes}${base}^{x}}{\\ln ${base}}${withPower ? ` ${p < 0 ? "-" : "+"} ${coef(Q.of(Math.abs(p), n + 1))}x^{${n + 1}}` : ""} + C`;
        return functionProblem({
          prompt: t(`Find $\\int ${integrand} \\, dx$.`, `求 $\\int ${integrand} \\, dx$。`),
          answer,
          antiderivative: true,
          wrong: [
            `${kTimes}${base}^{x}\\ln ${base} + C`,
            `${k === 1 ? "" : k}\\cdot\\frac{${base}^{x + 1}}{x + 1} + C`.replace(/^\\cdot/, ""),
            `${kTimes}${base}^{x} + C`,
          ],
          solution: t(
            `Since $\\frac{d}{dx}${base}^{x} = ${base}^{x}\\ln ${base}$, $\\int ${base}^{x} \\, dx = \\frac{${base}^{x}}{\\ln ${base}} + C$${withPower ? ", and the power term uses the power rule" : ""}. So the integral is $${answer}$.`,
            `由 $\\frac{d}{dx}${base}^{x} = ${base}^{x}\\ln ${base}$，$\\int ${base}^{x} \\, dx = \\frac{${base}^{x}}{\\ln ${base}} + C$${withPower ? "，幂函数项用幂法则" : ""}。所以积分等于 $${answer}$。`,
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
}

/** integrateScaled builds an integration problem for k·f(cx) given the rule ∫f(u)du = sign·F(u). */
function integrateScaled(rng: Rng, rule: TrigRule, kinds: { en: string; zh: string }) {
  const k = rng.nonZero(-9, 9);
  const c = rng.pick([1, 1, 2, 3, 4, 5, 6]);
  const u = c === 1 ? "x" : `${c}x`;
  const coefficient = Q.of(k * rule.sign, c);
  const answer = `${coef(coefficient)}${rule.F(u)} + C`;
  const integrand = `${coef(Q.of(k))}${rule.f(u)}`;
  return functionProblem({
    prompt: t(`Find $\\int ${integrand} \\, dx$.`, `求 $\\int ${integrand} \\, dx$。`),
    answer,
    antiderivative: true,
    wrong: [
      `${coef(Q.of(-k * rule.sign, c))}${rule.F(u)} + C`,
      `${coef(Q.of(k * rule.sign * c))}${rule.F(u)} + C`,
      `${coef(Q.of(k * rule.sign))}${rule.F(u)} + C`,
    ],
    solution: t(
      c === 1
        ? `${kinds.en} So the integral is $${answer}$.`
        : `${kinds.en} Differentiating $${rule.F(u)}$ also multiplies by $${c}$ (chain rule), so divide by $${c}$: $${answer}$.`,
      c === 1
        ? `${kinds.zh}所以积分是 $${answer}$。`
        : `${kinds.zh}对 $${rule.F(u)}$ 求导还会乘以 $${c}$（链式法则），所以除以 $${c}$：$${answer}$。`,
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
  knowledgePoints: [
    {
      id: "integrating-sine-and-cosine",
      title: t("Integrating sine and cosine", "正弦与余弦的积分"),
      explanation: t(
        "Each integral reverses a derivative rule, so check your answer by differentiating it; the sign of the cosine term is the most common mistake. $\\int \\cos x \\, dx = \\sin x + C$ and $\\int \\sin x \\, dx = -\\cos x + C$; watch the sign, since $\\frac{d}{dx}\\cos x = -\\sin x$. With $cx$ inside, divide by $c$: $\\int \\sin 3x \\, dx = -\\frac{1}{3}\\cos 3x + C$.",
        "每个积分都是某个求导法则的逆过程，所以可以通过求导检验答案；余弦项的符号是最常见的错误。$\\int \\cos x \\, dx = \\sin x + C$，$\\int \\sin x \\, dx = -\\cos x + C$；注意符号，因为 $\\frac{d}{dx}\\cos x = -\\sin x$。括号内是 $cx$ 时除以 $c$：$\\int \\sin 3x \\, dx = -\\frac{1}{3}\\cos 3x + C$。",
      ),
      generate(rng) {
        return rng.bool()
          ? integrateScaled(
              rng,
              { f: (u) => `\\sin(${u})`, F: (u) => `\\cos(${u})`, sign: -1 },
              {
                en: "$\\int \\sin u \\, du = -\\cos u + C$.",
                zh: "$\\int \\sin u \\, du = -\\cos u + C$。",
              },
            )
          : integrateScaled(
              rng,
              { f: (u) => `\\cos(${u})`, F: (u) => `\\sin(${u})`, sign: 1 },
              {
                en: "$\\int \\cos u \\, du = \\sin u + C$.",
                zh: "$\\int \\cos u \\, du = \\sin u + C$。",
              },
            );
      },
    },
    {
      id: "integrating-secant-and-cosecant-expressions",
      title: t("Integrating secant and cosecant expressions", "正割与余割表达式的积分"),
      explanation: t(
        "These integrals come directly from the derivatives of tangent, cotangent, secant and cosecant, so recognizing the derivative pattern is the whole method. Each derivative rule gives an integral:\n\n- $\\int \\sec^{2} x \\, dx = \\tan x + C$\n- $\\int \\csc^{2} x \\, dx = -\\cot x + C$\n- $\\int \\sec x \\tan x \\, dx = \\sec x + C$\n- $\\int \\csc x \\cot x \\, dx = -\\csc x + C$",
        "这些积分直接来自正切、余切、正割和余割的导数，所以认出导数的形式就是全部方法。每条求导法则都给出一个积分：\n\n- $\\int \\sec^{2} x \\, dx = \\tan x + C$\n- $\\int \\csc^{2} x \\, dx = -\\cot x + C$\n- $\\int \\sec x \\tan x \\, dx = \\sec x + C$\n- $\\int \\csc x \\cot x \\, dx = -\\csc x + C$",
      ),
      generate(rng) {
        const rules: [TrigRule, string, string][] = [
          [
            { f: (u) => `\\sec^{2}(${u})`, F: (u) => `\\tan(${u})`, sign: 1 },
            "$\\int \\sec^{2} u \\, du = \\tan u + C$.",
            "$\\int \\sec^{2} u \\, du = \\tan u + C$。",
          ],
          [
            { f: (u) => `\\csc^{2}(${u})`, F: (u) => `\\cot(${u})`, sign: -1 },
            "$\\int \\csc^{2} u \\, du = -\\cot u + C$.",
            "$\\int \\csc^{2} u \\, du = -\\cot u + C$。",
          ],
          [
            { f: (u) => `\\sec(${u})\\tan(${u})`, F: (u) => `\\sec(${u})`, sign: 1 },
            "$\\int \\sec u \\tan u \\, du = \\sec u + C$.",
            "$\\int \\sec u \\tan u \\, du = \\sec u + C$。",
          ],
          [
            { f: (u) => `\\csc(${u})\\cot(${u})`, F: (u) => `\\csc(${u})`, sign: -1 },
            "$\\int \\csc u \\cot u \\, du = -\\csc u + C$.",
            "$\\int \\csc u \\cot u \\, du = -\\csc u + C$。",
          ],
        ];
        const [rule, en, zh] = rng.pick(rules);
        return integrateScaled(rng, rule, { en, zh });
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
  knowledgePoints: [
    {
      id: "integrating-to-arcsine",
      title: t("Integrating to arcsine", "积分为反正弦"),
      explanation: t(
        "A square root of a constant minus a square in the denominator signals the arcsine, with the constant under the root fixing the scale. From $\\frac{d}{dx}\\arcsin \\frac{x}{a} = \\frac{1}{\\sqrt{a^{2} - x^{2}}}$ for $a > 0$:\n\n$$\\int \\frac{1}{\\sqrt{a^{2} - x^{2}}} \\, dx = \\arcsin \\frac{x}{a} + C.$$",
        "分母中出现常数减平方的平方根时，就是反正弦的信号，根号下的常数决定了缩放比例。由 $a > 0$ 时 $\\frac{d}{dx}\\arcsin \\frac{x}{a} = \\frac{1}{\\sqrt{a^{2} - x^{2}}}$：\n\n$$\\int \\frac{1}{\\sqrt{a^{2} - x^{2}}} \\, dx = \\arcsin \\frac{x}{a} + C$$",
      ),
      generate(rng) {
        const a = rng.int(4, 9);
        const k = rng.nonZero(-9, 9);
        const answer = `${coef(Q.of(k))}\\arcsin\\left(\\frac{x}{${a}}\\right) + C`;
        return functionProblem({
          prompt: t(
            `Find $\\int \\frac{${k}}{\\sqrt{${a * a} - x^{2}}} \\, dx$.`,
            `求 $\\int \\frac{${k}}{\\sqrt{${a * a} - x^{2}}} \\, dx$。`,
          ),
          answer,
          antiderivative: true,
          wrong: [
            `${coef(Q.of(k, a))}\\arcsin\\left(\\frac{x}{${a}}\\right) + C`,
            `${coef(Q.of(k))}\\arcsin\\left(\\frac{x}{${a * a}}\\right) + C`,
            `${coef(Q.of(k, a))}\\arctan\\left(\\frac{x}{${a}}\\right) + C`,
          ],
          solution: t(
            `$${a * a} = ${a}^{2}$, so $\\int \\frac{${k}}{\\sqrt{${a}^{2} - x^{2}}} \\, dx = ${answer}$.`,
            `$${a * a} = ${a}^{2}$，所以 $\\int \\frac{${k}}{\\sqrt{${a}^{2} - x^{2}}} \\, dx = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "integrating-to-arctangent-and-arcsecant",
      title: t("Integrating to arctangent and arcsecant", "积分为反正切与反正割"),
      explanation: t(
        "A constant plus a square in the denominator signals the arctangent, and the extra factor of the variable outside a root signals the arcsecant. $$\\int \\frac{1}{a^{2} + x^{2}} \\, dx = \\frac{1}{a}\\arctan \\frac{x}{a} + C, \\qquad \\int \\frac{1}{x\\sqrt{x^{2} - 1}} \\, dx = \\operatorname{arcsec} x + C \\ (x > 1).$$\n\nNote the factor $\\frac{1}{a}$ for arctangent, which arcsine does not have.",
        "分母中出现常数加平方时是反正切的信号，根号外多一个变量因子时则是反正割的信号。$$\\int \\frac{1}{a^{2} + x^{2}} \\, dx = \\frac{1}{a}\\arctan \\frac{x}{a} + C, \\qquad \\int \\frac{1}{x\\sqrt{x^{2} - 1}} \\, dx = \\operatorname{arcsec} x + C \\ (x > 1)$$\n\n注意反正切有因子 $\\frac{1}{a}$，而反正弦没有。",
      ),
      generate(rng) {
        const k = rng.nonZero(-12, 12);
        if (rng.bool(0.3)) {
          const answer = `${coef(Q.of(k))}\\operatorname{arcsec} x + C`;
          return functionProblem({
            prompt: t(
              `Find $\\int \\frac{${k}}{x\\sqrt{x^{2} - 1}} \\, dx$ for $x > 1$.`,
              `当 $x > 1$ 时，求 $\\int \\frac{${k}}{x\\sqrt{x^{2} - 1}} \\, dx$。`,
            ),
            answer,
            antiderivative: true,
            positive: true,
            wrong: [`${coef(Q.of(k))}\\arcsin x + C`, `${coef(Q.of(-k))}\\operatorname{arcsec} x + C`, `${coef(Q.of(k))}\\arctan x + C`],
            solution: t(
              `$\\frac{d}{dx}\\operatorname{arcsec} x = \\frac{1}{x\\sqrt{x^{2} - 1}}$ for $x > 1$, so the integral is $${answer}$.`,
              `当 $x > 1$ 时 $\\frac{d}{dx}\\operatorname{arcsec} x = \\frac{1}{x\\sqrt{x^{2} - 1}}$，所以积分为 $${answer}$。`,
            ),
          });
        }
        const a = rng.int(1, 9);
        const c = Q.of(k, a);
        const arg = a === 1 ? "x" : `\\frac{x}{${a}}`;
        const answer = `${coef(c)}\\arctan\\left(${arg}\\right) + C`;
        return functionProblem({
          prompt: t(`Find $\\int \\frac{${k}}{${a * a} + x^{2}} \\, dx$.`, `求 $\\int \\frac{${k}}{${a * a} + x^{2}} \\, dx$。`),
          answer,
          antiderivative: true,
          wrong: [
            `${coef(Q.of(k))}\\arctan\\left(${arg}\\right) + C`,
            `${coef(Q.of(k, a * a))}\\arctan\\left(${arg}\\right) + C`,
            `${coef(Q.of(k))}\\ln(${a * a} + x^{2}) + C`,
          ],
          solution: t(
            `With $a = ${a}$: $\\int \\frac{${k}}{${a}^{2} + x^{2}} \\, dx = ${k} \\cdot \\frac{1}{${a}}\\arctan ${arg} + C = ${answer}$.`,
            `取 $a = ${a}$：$\\int \\frac{${k}}{${a}^{2} + x^{2}} \\, dx = ${k} \\cdot \\frac{1}{${a}}\\arctan ${arg} + C = ${answer}$。`,
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
  knowledgePoints: [
    {
      id: "integrating-sinh-and-cosh",
      title: t("Integrating sinh and cosh", "sinh 与 cosh 的积分"),
      explanation: t(
        "Hyperbolic sine and cosine are each other's derivatives without a sign change, so their integrals also swap them without a minus sign. Unlike sine and cosine, there is no sign change: $\\int \\sinh x \\, dx = \\cosh x + C$ and $\\int \\cosh x \\, dx = \\sinh x + C$. With $cx$ inside, divide by $c$.",
        "双曲正弦和双曲余弦互为导数且不变号，所以它们的积分也只是互换而不带负号。与正弦、余弦不同，这里没有符号变化：$\\int \\sinh x \\, dx = \\cosh x + C$，$\\int \\cosh x \\, dx = \\sinh x + C$。括号内是 $cx$ 时除以 $c$。",
      ),
      generate(rng) {
        return rng.bool()
          ? integrateScaled(
              rng,
              { f: (u) => `\\sinh(${u})`, F: (u) => `\\cosh(${u})`, sign: 1 },
              {
                en: "$\\int \\sinh u \\, du = \\cosh u + C$.",
                zh: "$\\int \\sinh u \\, du = \\cosh u + C$。",
              },
            )
          : integrateScaled(
              rng,
              { f: (u) => `\\cosh(${u})`, F: (u) => `\\sinh(${u})`, sign: 1 },
              {
                en: "$\\int \\cosh u \\, du = \\sinh u + C$.",
                zh: "$\\int \\cosh u \\, du = \\sinh u + C$。",
              },
            );
      },
    },
    {
      id: "integrating-reciprocal-hyperbolic-expressions",
      title: t("Integrating reciprocal hyperbolic expressions", "倒数双曲表达式的积分"),
      explanation: t(
        "Each formula reverses a derivative of a hyperbolic function, so the signs match those in the derivative rules. Reversing the derivative rules:\n\n- $\\int \\operatorname{sech}^{2} x \\, dx = \\tanh x + C$\n- $\\int \\operatorname{csch}^{2} x \\, dx = -\\coth x + C$\n- $\\int \\operatorname{sech} x \\tanh x \\, dx = -\\operatorname{sech} x + C$\n- $\\int \\operatorname{csch} x \\coth x \\, dx = -\\operatorname{csch} x + C$",
        "每个公式都是某个双曲函数求导的逆过程，所以符号与求导法则中的符号一致。把求导法则反过来：\n\n- $\\int \\operatorname{sech}^{2} x \\, dx = \\tanh x + C$\n- $\\int \\operatorname{csch}^{2} x \\, dx = -\\coth x + C$\n- $\\int \\operatorname{sech} x \\tanh x \\, dx = -\\operatorname{sech} x + C$\n- $\\int \\operatorname{csch} x \\coth x \\, dx = -\\operatorname{csch} x + C$",
      ),
      generate(rng) {
        const rules: [TrigRule, string, string][] = [
          [
            { f: (u) => `\\operatorname{sech}^{2}(${u})`, F: (u) => `\\tanh(${u})`, sign: 1 },
            "$\\int \\operatorname{sech}^{2} u \\, du = \\tanh u + C$.",
            "$\\int \\operatorname{sech}^{2} u \\, du = \\tanh u + C$。",
          ],
          [
            { f: (u) => `\\operatorname{csch}^{2}(${u})`, F: (u) => `\\coth(${u})`, sign: -1 },
            "$\\int \\operatorname{csch}^{2} u \\, du = -\\coth u + C$.",
            "$\\int \\operatorname{csch}^{2} u \\, du = -\\coth u + C$。",
          ],
          [
            { f: (u) => `\\operatorname{sech}(${u})\\tanh(${u})`, F: (u) => `\\operatorname{sech}(${u})`, sign: -1 },
            "$\\int \\operatorname{sech} u \\tanh u \\, du = -\\operatorname{sech} u + C$.",
            "$\\int \\operatorname{sech} u \\tanh u \\, du = -\\operatorname{sech} u + C$。",
          ],
          [
            { f: (u) => `\\operatorname{csch}(${u})\\coth(${u})`, F: (u) => `\\operatorname{csch}(${u})`, sign: -1 },
            "$\\int \\operatorname{csch} u \\coth u \\, du = -\\operatorname{csch} u + C$.",
            "$\\int \\operatorname{csch} u \\coth u \\, du = -\\operatorname{csch} u + C$。",
          ],
        ];
        const [rule, en, zh] = rng.pick(rules);
        return integrateScaled(rng, rule, { en, zh });
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
  knowledgePoints: [
    {
      id: "integrating-to-arsinh",
      title: t("Integrating to arsinh", "积分为 arsinh"),
      explanation: t(
        "A square root of a square plus a constant gives the inverse hyperbolic sine, while a constant minus a square under the root gives the arcsine instead. $$\\int \\frac{1}{\\sqrt{x^{2} + a^{2}}} \\, dx = \\operatorname{arsinh} \\frac{x}{a} + C.$$\n\nCompare $\\int \\frac{1}{\\sqrt{a^{2} - x^{2}}} \\, dx = \\arcsin \\frac{x}{a} + C$: the sign under the root decides between the hyperbolic and the circular function.",
        "根号下是平方加常数时得到反双曲正弦，而根号下是常数减平方时得到的是反正弦。$$\\int \\frac{1}{\\sqrt{x^{2} + a^{2}}} \\, dx = \\operatorname{arsinh} \\frac{x}{a} + C$$\n\n与 $\\int \\frac{1}{\\sqrt{a^{2} - x^{2}}} \\, dx = \\arcsin \\frac{x}{a} + C$ 对比：根号下的符号决定是双曲函数还是三角函数。",
      ),
      generate(rng) {
        const a = rng.int(1, 9);
        const k = rng.nonZero(-9, 9);
        const arg = a === 1 ? "x" : `\\frac{x}{${a}}`;
        const answer = `${coef(Q.of(k))}\\operatorname{arsinh}\\left(${arg}\\right) + C`;
        return functionProblem({
          prompt: t(
            `Find $\\int \\frac{${k}}{\\sqrt{x^{2} + ${a * a}}} \\, dx$.`,
            `求 $\\int \\frac{${k}}{\\sqrt{x^{2} + ${a * a}}} \\, dx$。`,
          ),
          answer,
          antiderivative: true,
          wrong: [
            `${coef(Q.of(k, a))}\\operatorname{arsinh}\\left(${arg}\\right) + C`,
            `${coef(Q.of(k, a))}\\arctan\\left(${arg}\\right) + C`,
            `${coef(Q.of(k))}\\operatorname{arcosh}\\left(${arg}\\right) + C`,
          ],
          solution: t(
            `With $a = ${a}$: $\\int \\frac{${k}}{\\sqrt{x^{2} + ${a}^{2}}} \\, dx = ${answer}$, since $\\frac{d}{dx}\\operatorname{arsinh} ${arg} = \\frac{1}{\\sqrt{x^{2} + ${a * a}}}$.`,
            `取 $a = ${a}$：$\\int \\frac{${k}}{\\sqrt{x^{2} + ${a}^{2}}} \\, dx = ${answer}$，因为 $\\frac{d}{dx}\\operatorname{arsinh} ${arg} = \\frac{1}{\\sqrt{x^{2} + ${a * a}}}$。`,
          ),
        });
      },
    },
    {
      id: "integrating-to-arcosh-and-artanh",
      title: t("Integrating to arcosh and artanh", "积分为 arcosh 与 artanh"),
      explanation: t(
        "A square minus a constant under a root gives the inverse hyperbolic cosine, and a constant minus a square with no root gives the inverse hyperbolic tangent. $$\\int \\frac{1}{\\sqrt{x^{2} - a^{2}}} \\, dx = \\operatorname{arcosh} \\frac{x}{a} + C \\ (x > a), \\qquad \\int \\frac{1}{a^{2} - x^{2}} \\, dx = \\frac{1}{a}\\operatorname{artanh} \\frac{x}{a} + C \\ (|x| < a).$$",
        "根号下是平方减常数时得到反双曲余弦，没有根号的常数减平方则得到反双曲正切。$$\\int \\frac{1}{\\sqrt{x^{2} - a^{2}}} \\, dx = \\operatorname{arcosh} \\frac{x}{a} + C \\ (x > a), \\qquad \\int \\frac{1}{a^{2} - x^{2}} \\, dx = \\frac{1}{a}\\operatorname{artanh} \\frac{x}{a} + C \\ (|x| < a)$$",
      ),
      generate(rng) {
        const k = rng.nonZero(-12, 12);
        if (rng.bool()) {
          const answer = `${coef(Q.of(k))}\\operatorname{arcosh} x + C`;
          return functionProblem({
            prompt: t(
              `Find $\\int \\frac{${k}}{\\sqrt{x^{2} - 1}} \\, dx$ for $x > 1$.`,
              `当 $x > 1$ 时，求 $\\int \\frac{${k}}{\\sqrt{x^{2} - 1}} \\, dx$。`,
            ),
            answer,
            antiderivative: true,
            positive: true,
            wrong: [
              `${coef(Q.of(k))}\\operatorname{arsinh} x + C`,
              `${coef(Q.of(k))}\\arcsin x + C`,
              `${coef(Q.of(-k))}\\operatorname{arcosh} x + C`,
            ],
            solution: t(
              `$\\frac{d}{dx}\\operatorname{arcosh} x = \\frac{1}{\\sqrt{x^{2} - 1}}$ for $x > 1$, so the integral is $${answer}$.`,
              `当 $x > 1$ 时 $\\frac{d}{dx}\\operatorname{arcosh} x = \\frac{1}{\\sqrt{x^{2} - 1}}$，所以积分为 $${answer}$。`,
            ),
          });
        }
        const a = rng.int(4, 9);
        const c = Q.of(k, a);
        const answer = `${coef(c)}\\operatorname{artanh}\\left(\\frac{x}{${a}}\\right) + C`;
        return functionProblem({
          prompt: t(
            `Find $\\int \\frac{${k}}{${a * a} - x^{2}} \\, dx$ for $|x| < ${a}$.`,
            `当 $|x| < ${a}$ 时，求 $\\int \\frac{${k}}{${a * a} - x^{2}} \\, dx$。`,
          ),
          answer,
          antiderivative: true,
          wrong: [
            `${coef(Q.of(k))}\\operatorname{artanh}\\left(\\frac{x}{${a}}\\right) + C`,
            `${coef(c)}\\arctan\\left(\\frac{x}{${a}}\\right) + C`,
            `${coef(Q.of(k, a * a))}\\operatorname{artanh}\\left(\\frac{x}{${a}}\\right) + C`,
          ],
          solution: t(
            `With $a = ${a}$: $\\int \\frac{${k}}{${a}^{2} - x^{2}} \\, dx = ${k} \\cdot \\frac{1}{${a}}\\operatorname{artanh}\\frac{x}{${a}} + C = ${answer}$.`,
            `取 $a = ${a}$：$\\int \\frac{${k}}{${a}^{2} - x^{2}} \\, dx = ${k} \\cdot \\frac{1}{${a}}\\operatorname{artanh}\\frac{x}{${a}} + C = ${answer}$。`,
          ),
        });
      },
    },
  ],
};

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
  knowledgePoints: [
    {
      id: "integrating-to-arsech",
      title: t("Integrating to arsech", "积分为 arsech"),
      explanation: t(
        "When the variable multiplies a root of a constant minus its square, the integral reverses the derivative of the inverse hyperbolic secant. For $0 < x < a$,\n\n$$\\int \\frac{1}{x\\sqrt{a^{2} - x^{2}}} \\, dx = -\\frac{1}{a}\\operatorname{arsech} \\frac{x}{a} + C.$$\n\nThe minus sign comes from $\\frac{d}{dx}\\operatorname{arsech} x = -\\frac{1}{x\\sqrt{1 - x^{2}}}$.",
        "当变量乘以常数减其平方的平方根时，这个积分是反双曲正割求导的逆过程。当 $0 < x < a$ 时，\n\n$$\\int \\frac{1}{x\\sqrt{a^{2} - x^{2}}} \\, dx = -\\frac{1}{a}\\operatorname{arsech} \\frac{x}{a} + C$$\n\n负号来自 $\\frac{d}{dx}\\operatorname{arsech} x = -\\frac{1}{x\\sqrt{1 - x^{2}}}$。",
      ),
      generate(rng) {
        const a = rng.int(4, 9);
        const k = rng.nonZero(-12, 12);
        const c = Q.of(-k, a);
        const answer = `${coef(c)}\\operatorname{arsech}\\left(\\frac{x}{${a}}\\right) + C`;
        return functionProblem({
          prompt: t(
            `Find $\\int \\frac{${k}}{x\\sqrt{${a * a} - x^{2}}} \\, dx$ for $0 < x < ${a}$.`,
            `当 $0 < x < ${a}$ 时，求 $\\int \\frac{${k}}{x\\sqrt{${a * a} - x^{2}}} \\, dx$。`,
          ),
          answer,
          antiderivative: true,
          positive: true,
          wrong: [
            `${coef(c.neg())}\\operatorname{arsech}\\left(\\frac{x}{${a}}\\right) + C`,
            `${coef(Q.of(-k))}\\operatorname{arsech}\\left(\\frac{x}{${a}}\\right) + C`,
            `${coef(c)}\\arcsin\\left(\\frac{x}{${a}}\\right) + C`,
          ],
          solution: t(
            `With $a = ${a}$: $\\int \\frac{${k}}{x\\sqrt{${a}^{2} - x^{2}}} \\, dx = ${k} \\cdot \\left(-\\frac{1}{${a}}\\right)\\operatorname{arsech}\\frac{x}{${a}} + C = ${answer}$.`,
            `取 $a = ${a}$：$\\int \\frac{${k}}{x\\sqrt{${a}^{2} - x^{2}}} \\, dx = ${k} \\cdot \\left(-\\frac{1}{${a}}\\right)\\operatorname{arsech}\\frac{x}{${a}} + C = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "integrating-to-arcsch",
      title: t("Integrating to arcsch", "积分为 arcsch"),
      explanation: t(
        "When the variable multiplies a root of a constant plus its square, the integral reverses the derivative of the inverse hyperbolic cosecant, which also carries a minus sign. For $x > 0$,\n\n$$\\int \\frac{1}{x\\sqrt{a^{2} + x^{2}}} \\, dx = -\\frac{1}{a}\\operatorname{arcsch} \\frac{x}{a} + C.$$",
        "当变量乘以常数加其平方的平方根时，这个积分是反双曲余割求导的逆过程，同样带有负号。当 $x > 0$ 时，\n\n$$\\int \\frac{1}{x\\sqrt{a^{2} + x^{2}}} \\, dx = -\\frac{1}{a}\\operatorname{arcsch} \\frac{x}{a} + C$$",
      ),
      generate(rng) {
        const a = rng.int(1, 9);
        const k = rng.nonZero(-12, 12);
        const c = Q.of(-k, a);
        const arg = a === 1 ? "x" : `\\frac{x}{${a}}`;
        const answer = `${coef(c)}\\operatorname{arcsch}\\left(${arg}\\right) + C`;
        return functionProblem({
          prompt: t(
            `Find $\\int \\frac{${k}}{x\\sqrt{${a * a} + x^{2}}} \\, dx$ for $x > 0$.`,
            `当 $x > 0$ 时，求 $\\int \\frac{${k}}{x\\sqrt{${a * a} + x^{2}}} \\, dx$。`,
          ),
          answer,
          antiderivative: true,
          positive: true,
          wrong: [
            `${coef(c.neg())}\\operatorname{arcsch}\\left(${arg}\\right) + C`,
            `${coef(Q.of(-k))}\\operatorname{arcsch}\\left(${arg}\\right) + C`,
            `${coef(c)}\\operatorname{arsinh}\\left(${arg}\\right) + C`,
          ],
          solution: t(
            `With $a = ${a}$: $\\int \\frac{${k}}{x\\sqrt{${a}^{2} + x^{2}}} \\, dx = ${k} \\cdot \\left(-\\frac{1}{${a}}\\right)\\operatorname{arcsch} ${arg} + C = ${answer}$.`,
            `取 $a = ${a}$：$\\int \\frac{${k}}{x\\sqrt{${a}^{2} + x^{2}}} \\, dx = ${k} \\cdot \\left(-\\frac{1}{${a}}\\right)\\operatorname{arcsch} ${arg} + C = ${answer}$。`,
          ),
        });
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
