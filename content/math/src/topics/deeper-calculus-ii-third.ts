// Third knowledge points for thin topics of Calculus II, from integration to
// limits of sequences: the reverse question, a harder case or a common trap. See
// `deeperCalculusIIThirdPoints`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import { linear, paren, poly, Q } from "@ga/subject-math";
import { calculusDrawings4 } from "../explanation-drawings-calculus-4.ts";
import { calculusDrawings5 } from "../explanation-drawings-calculus-5.ts";

import { functionProblem, numberProblem, say, steps } from "../problems.ts";
import { ask, choose, type Pair, point } from "../university-kit.ts";
import { reasoned } from "../wrong-reasons.ts";
import { functionWith, walked } from "./calculus-i-differentiation.ts";

/** nz picks a nonzero integer from -r to r. */
const nz = (rng: Rng, r: number) => rng.pick([...Array(2 * r + 1).keys()].map((i) => i - r).filter((i) => i !== 0));
/** same2 writes one formula as a pair for both languages. */
const same2 = (latex: string): Pair => [`$${latex}$`, `$${latex}$`];
/** triples are Pythagorean triples, used so that slant lengths and speeds are whole numbers. */
const triples = [
  [3, 4, 5],
  [4, 3, 5],
  [5, 12, 13],
  [12, 5, 13],
  [8, 15, 17],
] as const;
/** quarterTurns are the axis angles of a polar curve, with their LaTeX and whether x and y swap roles there. */
const quarterTurns = [
  { at: "0", swap: false },
  { at: "\\frac{\\pi}{2}", swap: true },
  { at: "\\pi", swap: false },
  { at: "\\frac{3\\pi}{2}", swap: true },
] as const;
/** kpi asks for a coefficient of pi in both languages. */
const kpi = (en: string, zh: string): Pair => [`${en} Write it as $k\\pi$ and give $k$.`, `${zh}把结果写成 $k\\pi$，求 $k$。`];

/** PairStep is one labelled step of a worked solution: its title and what it says in both languages, and the lines it displays. */
type PairStep = readonly [title: Pair, say: Pair, lines?: readonly string[]];

/** walkPair writes labelled steps, each with its displayed lines, followed by a check that takes a second route. */
const walkPair = (parts: readonly PairStep[], check: Pair): Pair => {
  const write = (zh: boolean) =>
    parts
      .map(([[en, zhTitle], say, lines = []], i) => {
        const label = zh ? `**第${["一", "二", "三", "四", "五"][i]}步：${zhTitle}。**` : `**Step ${i + 1}: ${en}.**`;
        return `${label} ${say[zh ? 1 : 0]}${lines.length > 0 ? steps(...lines) : "\n\n"}`;
      })
      .join("") + (zh ? `**检验。** ${check[1]}` : `**Check.** ${check[0]}`);
  return [write(false), write(true)];
};

const negativeExponent = point(
  "exponentials-in-the-denominator",
  ["Exponentials in the denominator", "分母中的指数函数"],
  [
    "An exponential in the denominator is an exponential with a negative exponent: $\\frac{1}{e^{ax}} = e^{-ax}$. Rewrite it before integrating. The minus sign then enters the factor $-\\frac{1}{a}$, and losing it is the common error. For example, $\\int \\frac{6}{e^{3x}} \\, dx$ is $\\int 6e^{-3x} \\, dx$, which is $-2e^{-3x} + C$.\n\nCheck: the derivative of $-2e^{-3x}$ is $-2 \\cdot (-3)e^{-3x}$, which is $6e^{-3x}$, the integrand.\n\n> **Watch out.** Do not integrate $e^{-ax}$ as $\\frac{1}{a}e^{-ax}$. The coefficient of $x$ is $-a$, so the factor is $-\\frac{1}{a}$.",
    "分母中的指数函数就是指数为负的指数函数：$\\frac{1}{e^{ax}} = e^{-ax}$。积分前先改写。这样负号就进入因子 $-\\frac{1}{a}$，漏掉它是常见的错误。例如，$\\int \\frac{6}{e^{3x}} \\, dx$ 就是 $\\int 6e^{-3x} \\, dx$，等于 $-2e^{-3x} + C$。\n\n检验：$-2e^{-3x}$ 的导数是 $-2 \\cdot (-3)e^{-3x}$，即被积函数 $6e^{-3x}$。\n\n> **注意。** 不要把 $e^{-ax}$ 积分成 $\\frac{1}{a}e^{-ax}$。$x$ 的系数是 $-a$，所以因子是 $-\\frac{1}{a}$。",
  ],
  (rng) => {
    const a = rng.int(2, 9);
    const c = nz(rng, 12);
    const answer = poly([Q.of(-c, a), `e^{-${a}x}`], [1, "C"]);
    const term = poly([Q.of(-c, a), `e^{-${a}x}`]);
    const rewritten = poly([c, `e^{-${a}x}`]);
    const solution = walkPair(
      [
        [
          ["Rewrite", "改写"],
          ["Move the exponential to the numerator by changing the sign of its exponent:", "改变指数的符号，把指数函数移到分子："],
          [`\\frac{${c}}{e^{${a}x}} = ${rewritten}`],
        ],
        [
          ["Integrate", "积分"],
          [`The coefficient of $x$ is $-${a}$, so divide by $-${a}$:`, `$x$ 的系数是 $-${a}$，所以除以 $-${a}$：`],
          [`\\int ${rewritten} \\, dx = ${answer}`],
        ],
      ],
      [
        `Differentiate the answer. The result should be the integrand:${steps(`\\frac{d}{dx}\\left[${term}\\right] = ${Q.of(-c, a).toLatex()} \\cdot (-${a})e^{-${a}x} = ${rewritten}`).trimEnd()}`,
        `对答案求导，结果应当等于被积函数：${steps(`\\frac{d}{dx}\\left[${term}\\right] = ${Q.of(-c, a).toLatex()} \\cdot (-${a})e^{-${a}x} = ${rewritten}`).trimEnd()}`,
      ],
    );
    return functionProblem({
      prompt: t(`Find $\\int \\frac{${c}}{e^{${a}x}} \\, dx$.`, `求 $\\int \\frac{${c}}{e^{${a}x}} \\, dx$。`),
      answer,
      antiderivative: true,
      wrong: [
        poly([Q.of(c, a), `e^{-${a}x}`], [1, "C"]),
        poly([Q.of(-c * a), `e^{-${a}x}`], [1, "C"]),
        poly([Q.of(-c, a), `e^{${a}x}`], [1, "C"]),
      ],
      solution: t(solution[0], solution[1]),
    });
  },
);

const arsechOfExponential = point(
  "arsech-after-substituting-an-exponential",
  ["Arsech after substituting an exponential", "代换指数函数后得到 arsech"],
  [
    "The factor $x$ required by the arsech form can be hidden. In $\\frac{1}{\\sqrt{a^{2} - e^{2x}}}$, let $u = e^{x}$, so $dx = \\frac{du}{u}$ and the integral becomes $\\int \\frac{du}{u\\sqrt{a^{2} - u^{2}}}$, which is $-\\frac{1}{a}\\operatorname{arsech}\\frac{u}{a} + C$. For example, with $a = 2$:\n\n$$\\int \\frac{dx}{\\sqrt{4 - e^{2x}}} = -\\frac{1}{2}\\operatorname{arsech}\\frac{e^{x}}{2} + C.$$\n\nCheck: $u = e^{x}$ gives $du = e^{x}\\,dx$, which is $u\\,dx$, so $dx$ is indeed $\\frac{du}{u}$.\n\n> **Watch out.** The answer is in terms of $e^{x}$, not $x$. After integrating, put back $u = e^{x}$.",
    "arsech 形式所需的因子 $x$ 可能是隐藏的。在 $\\frac{1}{\\sqrt{a^{2} - e^{2x}}}$ 中令 $u = e^{x}$，则 $dx = \\frac{du}{u}$，积分变成 $\\int \\frac{du}{u\\sqrt{a^{2} - u^{2}}}$，结果是 $-\\frac{1}{a}\\operatorname{arsech}\\frac{u}{a} + C$。例如，取 $a = 2$：\n\n$$\\int \\frac{dx}{\\sqrt{4 - e^{2x}}} = -\\frac{1}{2}\\operatorname{arsech}\\frac{e^{x}}{2} + C$$\n\n检验：$u = e^{x}$ 给出 $du = e^{x}\\,dx$，即 $u\\,dx$，所以 $dx$ 确实等于 $\\frac{du}{u}$。\n\n> **注意。** 答案是用 $e^{x}$ 表示的，不是用 $x$。积分后要代回 $u = e^{x}$。",
  ],
  (rng) => {
    const a = rng.int(2, 9);
    const c = nz(rng, 9);
    const fn = `\\operatorname{arsech}\\frac{e^{x}}{${a}}`;
    const form = (co: Q, f: string) => `${poly([co, f])} + C`;
    const right = form(Q.of(-c, a), fn);
    const inU = poly([c, `\\int \\frac{du}{u\\sqrt{${a * a} - u^{2}}}`]);
    const flipped = form(Q.of(c, a), fn);
    const noFactor = form(Q.of(-c), fn);
    const notBack = form(Q.of(-c, a), `\\operatorname{arsech}\\frac{x}{${a}}`);
    return reasoned(
      choose(
        rng,
        [
          `Find $\\int \\frac{${c}}{\\sqrt{${a * a} - e^{2x}}} \\, dx$ for $x < \\ln ${a}$.`,
          `当 $x < \\ln ${a}$ 时，求 $\\int \\frac{${c}}{\\sqrt{${a * a} - e^{2x}}} \\, dx$。`,
        ],
        same2(right),
        [same2(flipped), same2(noFactor), same2(notBack)],
        walkPair(
          [
            [
              ["Substitute", "换元"],
              [
                "Let $u = e^{x}$. Then $du = e^{x}\\,dx$, which is $u\\,dx$, so the missing factor $u$ appears:",
                "令 $u = e^{x}$，则 $du = e^{x}\\,dx$，即 $u\\,dx$，于是缺少的因子 $u$ 出现了：",
              ],
              [`dx = \\frac{du}{u}`, `\\int \\frac{${c}}{\\sqrt{${a * a} - e^{2x}}} \\, dx = ${inU}`],
            ],
            [
              ["Use the arsech form", "用 arsech 形式"],
              [
                `The arsech formula has the factor $-\\frac{1}{${a}}$. Then put back $u = e^{x}$:`,
                `arsech 公式带有因子 $-\\frac{1}{${a}}$。再代回 $u = e^{x}$：`,
              ],
              [`${inU} = ${right}`],
            ],
          ],
          [
            `The integrand has the sign of $${c}$. Since $\\operatorname{arsech}$ decreases while $e^{x}$ increases, the coefficient in front must have the opposite sign to $${c}$, as $${Q.of(-c, a).toLatex()}$ does.`,
            `被积函数的符号与 $${c}$ 相同。由于 $\\operatorname{arsech}$ 递减而 $e^{x}$ 递增，前面的系数必须与 $${c}$ 异号，$${Q.of(-c, a).toLatex()}$ 正是如此。`,
          ],
        ),
      ),
      [
        [
          same2(flipped)[0],
          `The sign is wrong. The arsech formula carries $-\\frac{1}{${a}}$, because arsech decreases.`,
          `符号错了。arsech 公式带有 $-\\frac{1}{${a}}$，因为 arsech 是递减的。`,
        ],
        [
          same2(noFactor)[0],
          `The factor $\\frac{1}{${a}}$ of the arsech formula is missing.`,
          `漏掉了 arsech 公式中的因子 $\\frac{1}{${a}}$。`,
        ],
        [
          same2(notBack)[0],
          "The substitution was not undone. The argument must be $u$ over $a$ with $u = e^{x}$, not $x$ over $a$.",
          "没有代回。自变量应当是 $u$ 除以 $a$，其中 $u = e^{x}$，而不是 $x$ 除以 $a$。",
        ],
      ],
    );
  },
);

const squareWithLeadingCoefficient = point(
  "completing-the-square-with-a-leading-coefficient",
  ["Completing the square with a leading coefficient", "二次项有系数时配方"],
  [
    "When $x^{2}$ has a square coefficient, complete the square as $(kx + h)^{2} + b^{2}$. The substitution $u = kx + h$ then introduces the factor $\\frac{1}{k}$ through $dx = \\frac{du}{k}$, which is easy to leave out. For example, $4x^{2} + 4x + 10$ completes to $(2x + 1)^{2} + 3^{2}$, so:\n\n$$\\int \\frac{dx}{\\sqrt{4x^{2} + 4x + 10}} = \\frac{1}{2}\\operatorname{arsinh}\\frac{2x + 1}{3} + C.$$\n\nCheck: $(2x + 1)^{2} + 9$ expands to $4x^{2} + 4x + 1 + 9$, which is $4x^{2} + 4x + 10$.\n\n> **Watch out.** The shifted variable is $kx + h$, not $x + h$, and the factor in front is $\\frac{1}{k}$.",
    "当 $x^{2}$ 的系数是平方数时，配方成 $(kx + h)^{2} + b^{2}$。代换 $u = kx + h$ 通过 $dx = \\frac{du}{k}$ 带来因子 $\\frac{1}{k}$，这个因子很容易漏掉。例如，$4x^{2} + 4x + 10$ 配方得 $(2x + 1)^{2} + 3^{2}$，所以：\n\n$$\\int \\frac{dx}{\\sqrt{4x^{2} + 4x + 10}} = \\frac{1}{2}\\operatorname{arsinh}\\frac{2x + 1}{3} + C$$\n\n检验：$(2x + 1)^{2} + 9$ 展开得 $4x^{2} + 4x + 1 + 9$，即 $4x^{2} + 4x + 10$。\n\n> **注意。** 平移后的变量是 $kx + h$，不是 $x + h$，前面的因子是 $\\frac{1}{k}$。",
  ],
  (rng) => {
    const k = rng.int(2, 5);
    const h = nz(rng, 6);
    const b = rng.int(2, 6);
    const c = nz(rng, 8);
    const inner = linear(k, h);
    const fn = `\\operatorname{arsinh}\\frac{${inner}}{${b}}`;
    const form = (co: Q, f: string) => `${poly([co, f])} + C`;
    const right = form(Q.of(c, k), fn);
    const q = poly([k * k, "x^{2}"], [2 * k * h, "x"], [h * h + b * b, ""]);
    const inU = poly([Q.of(c, k), `\\int \\frac{du}{\\sqrt{u^{2} + ${b * b}}}`]);
    const noFactor = form(Q.of(c), fn);
    const cosh = form(Q.of(c, k), `\\operatorname{arcosh}\\frac{${inner}}{${b}}`);
    const unscaled = form(Q.of(c, k), `\\operatorname{arsinh}\\frac{${linear(1, h)}}{${b}}`);
    return reasoned(
      choose(
        rng,
        [`Find $\\int \\frac{${c}}{\\sqrt{${q}}} \\, dx$.`, `求 $\\int \\frac{${c}}{\\sqrt{${q}}} \\, dx$。`],
        same2(right),
        [same2(noFactor), same2(cosh), same2(unscaled)],
        walkPair(
          [
            [
              ["Complete the square", "配方"],
              ["Rewrite the quadratic under the root:", "改写根号下的二次式："],
              [`${q} = (${inner})^{2} + ${b}^{2}`],
            ],
            [
              ["Substitute", "换元"],
              [
                `Let $u = ${inner}$. Then $du = ${k}\\,dx$, so $dx$ is $\\frac{du}{${k}}$:`,
                `令 $u = ${inner}$，则 $du = ${k}\\,dx$，所以 $dx$ 等于 $\\frac{du}{${k}}$：`,
              ],
              [`\\int \\frac{${c}}{\\sqrt{${q}}} \\, dx = ${inU}`],
            ],
            [
              ["Integrate and substitute back", "积分并代回"],
              ["Use the arsinh form, then put back $u$:", "用 arsinh 形式，再代回 $u$："],
              [`${inU} = ${right}`],
            ],
          ],
          [
            `Differentiate the answer. The result should be the integrand:${steps(`\\frac{d}{dx}\\left[${poly([Q.of(c, k), fn])}\\right] = ${Q.of(c, k).toLatex()} \\cdot \\frac{1}{\\sqrt{\\left(\\frac{${inner}}{${b}}\\right)^{2} + 1}} \\cdot \\frac{${k}}{${b}} = \\frac{${c}}{\\sqrt{(${inner})^{2} + ${b * b}}}`).trimEnd()}`,
            `对答案求导，结果应当等于被积函数：${steps(`\\frac{d}{dx}\\left[${poly([Q.of(c, k), fn])}\\right] = ${Q.of(c, k).toLatex()} \\cdot \\frac{1}{\\sqrt{\\left(\\frac{${inner}}{${b}}\\right)^{2} + 1}} \\cdot \\frac{${k}}{${b}} = \\frac{${c}}{\\sqrt{(${inner})^{2} + ${b * b}}}`).trimEnd()}`,
          ],
        ),
      ),
      [
        [
          same2(noFactor)[0],
          `The factor $\\frac{1}{${k}}$ from $dx = \\frac{du}{${k}}$ is missing.`,
          `漏掉了由 $dx = \\frac{du}{${k}}$ 带来的因子 $\\frac{1}{${k}}$。`,
        ],
        [
          same2(cosh)[0],
          "The constant is added to the square, not subtracted, so the form is arsinh, not arcosh.",
          "常数是加在平方上的，不是减去的，所以是 arsinh 形式，不是 arcosh。",
        ],
        [
          same2(unscaled)[0],
          `The completed square is $(${inner})^{2}$, so the argument must contain $${inner}$, not $${linear(1, h)}$.`,
          `配方得到的是 $(${inner})^{2}$，所以自变量必须含 $${inner}$，而不是 $${linear(1, h)}$。`,
        ],
      ],
    );
  },
);

const familyFromSquare = point(
  "the-sign-of-the-square-chooses-the-function",
  ["The sign of the square chooses the function", "平方项的符号决定函数"],
  [
    "Only after completing the square can you tell which inverse function appears. Under the root, $a^{2} - (x + h)^{2}$ leads to arsech and $(x + h)^{2} + a^{2}$ leads to arcsch. In both cases the coefficient is $-\\frac{1}{a}$ for $x + h > 0$. For example, $x^{2} + 2x + 10$ completes to $(x + 1)^{2} + 9$, a sum, so with the factor $x + 1$ outside the root the integral is $-\\frac{1}{3}\\operatorname{arcsch}\\frac{x + 1}{3} + C$ for $x > -1$.\n\nCheck: $(x + 1)^{2} + 9$ expands to $x^{2} + 2x + 1 + 9$, which is $x^{2} + 2x + 10$.\n\n> **Watch out.** Decide from the completed square, not from the constant term. $-x^{2} - 2x + 3$ completes to $4 - (x + 1)^{2}$, a difference, which gives arsech.",
    "只有配方后才能看出出现哪个反函数。根号下是 $a^{2} - (x + h)^{2}$ 时得到 arsech，是 $(x + h)^{2} + a^{2}$ 时得到 arcsch。两种情况下，当 $x + h > 0$ 时系数都是 $-\\frac{1}{a}$。例如，$x^{2} + 2x + 10$ 配方得 $(x + 1)^{2} + 9$，是平方和，所以根号外有因子 $x + 1$ 时，当 $x > -1$，积分为 $-\\frac{1}{3}\\operatorname{arcsch}\\frac{x + 1}{3} + C$。\n\n检验：$(x + 1)^{2} + 9$ 展开得 $x^{2} + 2x + 1 + 9$，即 $x^{2} + 2x + 10$。\n\n> **注意。** 要根据配方的结果判断，而不是看常数项。$-x^{2} - 2x + 3$ 配方得 $4 - (x + 1)^{2}$，是平方差，所以得到 arsech。",
  ],
  (rng) => {
    const a = rng.int(2, 7);
    const h = nz(rng, 6);
    const c = nz(rng, 8);
    const plus = rng.bool();
    const u = linear(1, h);
    const q = plus ? poly([1, "x^{2}"], [2 * h, "x"], [h * h + a * a, ""]) : poly([-1, "x^{2}"], [-2 * h, "x"], [a * a - h * h, ""]);
    const form = (co: Q, name: string) => `${poly([co, `\\operatorname{${name}}\\frac{${u}}{${a}}`])} + C`;
    const name = plus ? "arcsch" : "arsech";
    const other = plus ? "arsech" : "arcsch";
    const domain = plus ? `x > ${-h}` : `${-h} < x < ${a - h}`;
    const square = plus ? `(${u})^{2} + ${a * a}` : `${a * a} - (${u})^{2}`;
    const right = form(Q.of(-c, a), name);
    const inU = poly([c, `\\int \\frac{du}{u\\sqrt{${plus ? `u^{2} + ${a * a}` : `${a * a} - u^{2}`}}}`]);
    const swapped = form(Q.of(-c, a), other);
    const noFactor = form(Q.of(-c), name);
    const flipped = form(Q.of(c, a), name);
    return reasoned(
      choose(
        rng,
        [
          `Find $\\int \\frac{${c}}{(${u})\\sqrt{${q}}} \\, dx$ for $${domain}$.`,
          `当 $${domain}$ 时，求 $\\int \\frac{${c}}{(${u})\\sqrt{${q}}} \\, dx$。`,
        ],
        same2(right),
        [same2(swapped), same2(noFactor), same2(flipped)],
        walkPair(
          [
            [["Complete the square", "配方"], ["Rewrite the quadratic under the root:", "改写根号下的二次式："], [`${q} = ${square}`]],
            [
              ["Choose the function", "确定函数"],
              plus
                ? [
                    `This is a square plus a constant, and the factor outside is the same $${u}$. With $u = ${u}$ it is the $\\operatorname{arcsch}$ form with $a = ${a}$:`,
                    `这是平方加常数，根号外的因子也是 $${u}$。令 $u = ${u}$，这是 $a = ${a}$ 的 $\\operatorname{arcsch}$ 形式：`,
                  ]
                : [
                    `This is a constant minus a square, and the factor outside is the same $${u}$. With $u = ${u}$ it is the $\\operatorname{arsech}$ form with $a = ${a}$:`,
                    `这是常数减平方，根号外的因子也是 $${u}$。令 $u = ${u}$，这是 $a = ${a}$ 的 $\\operatorname{arsech}$ 形式：`,
                  ],
              [`\\int \\frac{${c}}{(${u})\\sqrt{${q}}} \\, dx = ${inU}`],
            ],
            [
              ["Integrate and substitute back", "积分并代回"],
              [`The formula has the factor $-\\frac{1}{${a}}$:`, `公式带有因子 $-\\frac{1}{${a}}$：`],
              [`${inU} = ${right}`],
            ],
          ],
          [
            `For $${u} > 0$ the integrand has the sign of $${c}$. Since $\\operatorname{${name}}$ decreases for positive arguments, the coefficient must have the opposite sign to $${c}$, as $${Q.of(-c, a).toLatex()}$ does.`,
            `当 $${u} > 0$ 时，被积函数的符号与 $${c}$ 相同。由于 $\\operatorname{${name}}$ 对正的自变量递减，系数必须与 $${c}$ 异号，$${Q.of(-c, a).toLatex()}$ 正是如此。`,
          ],
        ),
      ),
      [
        [
          same2(swapped)[0],
          plus
            ? "The completed square is a sum, which gives arcsch; arsech comes from a constant minus a square."
            : "The completed square is a constant minus a square, which gives arsech; arcsch comes from a sum.",
          plus ? "配方结果是平方和，得到 arcsch；arsech 来自常数减平方。" : "配方结果是常数减平方，得到 arsech；arcsch 来自平方和。",
        ],
        [same2(noFactor)[0], `The factor $\\frac{1}{${a}}$ of the formula is missing.`, `漏掉了公式中的因子 $\\frac{1}{${a}}$。`],
        [
          same2(flipped)[0],
          `The sign is wrong. The formula's coefficient is $-\\frac{1}{${a}}$.`,
          `符号错了。公式的系数是 $-\\frac{1}{${a}}$。`,
        ],
      ],
    );
  },
);

const pythagoreanIntegrals = point(
  "integrals-that-need-a-pythagorean-identity",
  ["Integrals that need a Pythagorean identity", "需要毕达哥拉斯恒等式的积分"],
  [
    "Squares of tangent and cotangent have no direct formula, but $\\tan^{2}x = \\sec^{2}x - 1$ and $\\cot^{2}x = \\csc^{2}x - 1$ reduce them to known integrals. The result contains an extra term in $x$. For example, $\\int \\tan^{2}x \\, dx = \\int (\\sec^{2}x - 1) \\, dx = \\tan x - x + C$.\n\nCheck: $\\frac{d}{dx}(\\tan x - x) = \\sec^{2}x - 1 = \\tan^{2}x$.\n\n> **Watch out.** Treating $\\tan^{2}x$ as a power is wrong: $\\frac{\\tan^{3}x}{3}$ differentiates to $\\tan^{2}x\\sec^{2}x$. And the $-1$ of the identity integrates to $-x$, which must not be dropped.",
    "正切和余切的平方没有直接的公式，但 $\\tan^{2}x = \\sec^{2}x - 1$ 和 $\\cot^{2}x = \\csc^{2}x - 1$ 把它们化成已知积分。结果中多了一个含 $x$ 的项。例如，$\\int \\tan^{2}x \\, dx = \\int (\\sec^{2}x - 1) \\, dx = \\tan x - x + C$。\n\n检验：$\\frac{d}{dx}(\\tan x - x) = \\sec^{2}x - 1 = \\tan^{2}x$。\n\n> **注意。** 把 $\\tan^{2}x$ 当作普通的幂是错误的：$\\frac{\\tan^{3}x}{3}$ 的导数是 $\\tan^{2}x\\sec^{2}x$。恒等式中的 $-1$ 积分得 $-x$，不能丢掉。",
  ],
  (rng) => {
    const c = nz(rng, 12);
    const kind = rng.pick(["tan", "cot", "unit", "sec"] as const);
    const group = (e: string) => `${c === 1 ? "" : c === -1 ? "-" : c}\\left(${e}\\right)`;
    const integrand = {
      tan: poly([c, "\\tan^{2}x"]),
      cot: poly([c, "\\cot^{2}x"]),
      unit: group("\\sec^{2}x - \\tan^{2}x"),
      sec: group("1 + \\tan^{2}x"),
    }[kind];
    const answer = {
      tan: poly([c, "\\tan x"], [-c, "x"], [1, "C"]),
      cot: poly([-c, "\\cot x"], [-c, "x"], [1, "C"]),
      unit: poly([c, "x"], [1, "C"]),
      sec: poly([c, "\\tan x"], [1, "C"]),
    }[kind];
    const mistakes = {
      tan: [
        say(
          poly([c, "\\tan x"], [c, "x"], [1, "C"]),
          "The identity is $\\tan^{2}x = \\sec^{2}x - 1$, so the term in $x$ is subtracted.",
          "恒等式是 $\\tan^{2}x = \\sec^{2}x - 1$，所以含 $x$ 的项是减去的。",
        ),
        say(
          poly([c, "\\tan x"], [1, "C"]),
          "This integrates $\\sec^{2}x$ but drops the $-1$, which integrates to $-x$.",
          "这里积分了 $\\sec^{2}x$，却丢掉了 $-1$，而它积分得 $-x$。",
        ),
      ],
      cot: [
        say(
          poly([-c, "\\cot x"], [c, "x"], [1, "C"]),
          "The identity is $\\cot^{2}x = \\csc^{2}x - 1$, so the term in $x$ is subtracted.",
          "恒等式是 $\\cot^{2}x = \\csc^{2}x - 1$，所以含 $x$ 的项是减去的。",
        ),
        say(
          poly([c, "\\cot x"], [-c, "x"], [1, "C"]),
          "$\\int \\csc^{2}x \\, dx = -\\cot x + C$, with a minus sign, because $\\frac{d}{dx}\\cot x = -\\csc^{2}x$.",
          "$\\int \\csc^{2}x \\, dx = -\\cot x + C$，带负号，因为 $\\frac{d}{dx}\\cot x = -\\csc^{2}x$。",
        ),
      ],
      unit: [
        say(
          poly([c, "\\tan x"], [-c, "x"], [1, "C"]),
          `This is the integral of $${poly([c, "\\tan^{2}x"])}$ alone; the $\\sec^{2}x$ in the bracket cancels it, since $\\sec^{2}x - \\tan^{2}x = 1$ and the integrand is the constant $${c}$.`,
          `这只是 $${poly([c, "\\tan^{2}x"])}$ 的积分；括号中的 $\\sec^{2}x$ 把它抵消了，因为 $\\sec^{2}x - \\tan^{2}x = 1$，被积函数就是常数 $${c}$。`,
        ),
        say(
          poly([-c, "x"], [1, "C"]),
          "The bracket equals $+1$, not $-1$: $\\sec^{2}x - \\tan^{2}x = 1$.",
          "括号等于 $+1$，不是 $-1$：$\\sec^{2}x - \\tan^{2}x = 1$。",
        ),
      ],
      sec: [
        say(
          poly([c, "\\tan x"], [c, "x"], [1, "C"]),
          "$1 + \\tan^{2}x$ is exactly $\\sec^{2}x$; adding a separate term in $x$ counts the $1$ twice.",
          "$1 + \\tan^{2}x$ 恰好就是 $\\sec^{2}x$；另加一个含 $x$ 的项就把 $1$ 算了两次。",
        ),
        say(
          poly([c, "x"], [1, "C"]),
          "This integrates only the $1$; the bracket is $\\sec^{2}x$, whose integral is $\\tan x$.",
          "这里只积分了 $1$；括号是 $\\sec^{2}x$，它的积分是 $\\tan x$。",
        ),
      ],
    }[kind];
    const identity = {
      tan: "\\tan^{2}x = \\sec^{2}x - 1",
      cot: "\\cot^{2}x = \\csc^{2}x - 1",
      unit: "\\sec^{2}x - \\tan^{2}x = 1",
      sec: "1 + \\tan^{2}x = \\sec^{2}x",
    }[kind];
    const rewritten = {
      tan: group("\\sec^{2}x - 1"),
      cot: group("\\csc^{2}x - 1"),
      unit: poly([c, ""]),
      sec: poly([c, "\\sec^{2}x"]),
    }[kind];
    const derivative = {
      tan: [`${group("\\sec^{2}x - 1")}`, `${poly([c, "\\tan^{2}x"])}`],
      cot: [`${group("\\csc^{2}x - 1")}`, `${poly([c, "\\cot^{2}x"])}`],
      unit: [`${poly([c, ""])}`, `${integrand}`],
      sec: [`${poly([c, "\\sec^{2}x"])}`, `${integrand}`],
    }[kind];
    return functionWith(
      {
        prompt: t(`Find $\\int ${integrand} \\, dx$.`, `求 $\\int ${integrand} \\, dx$。`),
        answer,
        antiderivative: true,
        solution: walked(
          [
            [
              ["Use the identity", "用恒等式"],
              t(`Rewrite the integrand with $${identity}$:`, `用 $${identity}$ 改写被积函数：`),
              [`${integrand} = ${rewritten}`],
            ],
            [
              ["Integrate", "积分"],
              t(
                "Use $\\int \\sec^{2}x \\, dx = \\tan x$, $\\int \\csc^{2}x \\, dx = -\\cot x$ and $\\int 1 \\, dx = x$:",
                "利用 $\\int \\sec^{2}x \\, dx = \\tan x$，$\\int \\csc^{2}x \\, dx = -\\cot x$，$\\int 1 \\, dx = x$：",
              ),
              [`\\int ${integrand} \\, dx = ${answer}`],
            ],
          ],
          t(
            `Differentiate the answer: the derivative is $${derivative[0]}$, which equals $${derivative[1]}$ by the identity.`,
            `对答案求导：导数是 $${derivative[0]}$，由恒等式它等于 $${derivative[1]}$。`,
          ),
        ),
      },
      mistakes,
    );
  },
);

const areaLeftOfYAxis = point(
  "a-region-to-the-left-of-the-y-axis",
  ["A region to the left of the y-axis", "位于 y 轴左侧的区域"],
  [
    "With horizontal strips the length is always right curve minus left curve. When the region lies to the left of the $y$-axis, the right curve is $x = 0$, so the integrand is $0 - g(y)$. Integrating $g$ directly gives a negative number, which cannot be an area. For example, $x = y^{2} - 4$ meets the $y$-axis at $y = \\pm 2$, and the area is $\\int_{-2}^{2} \\left(0 - (y^{2} - 4)\\right) dy = 16 - \\frac{16}{3} = \\frac{32}{3}$.\n\nCheck: the region between a parabola and a chord fills $\\frac{2}{3}$ of the rectangle around it. Here the rectangle is $4$ tall and $4$ wide, and $\\frac{2}{3} \\cdot 16 = \\frac{32}{3}$.\n\n> **Watch out.** Subtract the left curve from the right one, $0 - g(y)$, not $g(y) - 0$; the other order gives a negative number.",
    "用水平条带时，长度总是右边曲线减左边曲线。当区域在 $y$ 轴左侧时，右边曲线是 $x = 0$，所以被积函数是 $0 - g(y)$。直接积分 $g$ 会得到负数，而面积不可能为负。例如，$x = y^{2} - 4$ 与 $y$ 轴交于 $y = \\pm 2$，面积为 $\\int_{-2}^{2} \\left(0 - (y^{2} - 4)\\right) dy = 16 - \\frac{16}{3} = \\frac{32}{3}$。\n\n检验：抛物线与弦之间的区域占外接矩形的 $\\frac{2}{3}$。这里矩形高 $4$、宽 $4$，而 $\\frac{2}{3} \\cdot 16 = \\frac{32}{3}$。\n\n> **注意。** 要用右边曲线减左边曲线，即 $0 - g(y)$，而不是 $g(y) - 0$；反过来会得到负数。",
  ],
  (rng) => {
    const a = rng.int(1, 9);
    const k = rng.int(1, 4);
    const g = poly([k, "y^{2}"], [-k * a * a, ""]);
    const answer = Q.of(4 * k * a ** 3, 3);
    const strip = poly([k * a * a, ""], [-k, "y^{2}"]);
    const mistakes = [
      {
        value: answer.neg(),
        why: t(
          "This integrates $g(y)$ itself, left minus right; the right curve is $x = 0$, so the integrand is $0 - g(y)$.",
          "这是直接对 $g(y)$ 积分，即左减右；右边曲线是 $x = 0$，被积函数应为 $0 - g(y)$。",
        ),
      },
      {
        value: Q.of(2 * k * a ** 3, 3),
        why: t(
          `This integrates only from $y = 0$ to $y = ${a}$; the region also reaches down to $y = -${a}$.`,
          `这里只从 $y = 0$ 积到 $y = ${a}$；区域还向下延伸到 $y = -${a}$。`,
        ),
      },
      {
        value: Q.of(2 * k * a ** 3),
        why: t(
          `This is the whole rectangle, $${2 * a}$ tall and $${k * a * a}$ wide, around the region; the region fills only $\\frac{2}{3}$ of it.`,
          `这是包住区域的整个矩形，高 $${2 * a}$、宽 $${k * a * a}$；区域只占它的 $\\frac{2}{3}$。`,
        ),
      },
    ];
    return numberProblem({
      prompt: t(`Find the area of the region bounded by $x = ${g}$ and the $y$-axis.`, `求由 $x = ${g}$ 和 $y$ 轴围成的区域的面积。`),
      answer,
      mistakes,
      solution: walked(
        [
          [
            ["Find where the curve meets the axis", "求曲线与坐标轴的交点"],
            t(`Set $x = 0$; between the crossings the curve lies to the left of the axis:`, `令 $x = 0$；在两交点之间曲线位于坐标轴左侧：`),
            [`${g} = 0 \\implies y = \\pm ${a}`],
          ],
          [
            ["Integrate right minus left", "对右减左积分"],
            t("The right curve is $x = 0$:", "右边曲线是 $x = 0$："),
            [
              `\\int_{${-a}}^{${a}} \\left(0 - (${g})\\right) dy = \\int_{${-a}}^{${a}} (${strip}) \\, dy = \\Big[${k * a * a}y - ${k === 3 ? "" : Q.of(k, 3).toLatex()}y^{3}\\Big]_{${-a}}^{${a}} = ${answer.toLatex()}`,
            ],
          ],
        ],
        t(
          `The region between a parabola and a chord fills $\\frac{2}{3}$ of the rectangle around it. That rectangle is $${2 * a}$ tall and, at $y = 0$, $${k * a * a}$ wide, so the area is $\\frac{2}{3} \\cdot ${2 * a} \\cdot ${k * a * a} = ${answer.toLatex()}$.`,
          `抛物线与弦之间的区域占外接矩形的 $\\frac{2}{3}$。这个矩形高 $${2 * a}$，在 $y = 0$ 处宽 $${k * a * a}$，所以面积为 $\\frac{2}{3} \\cdot ${2 * a} \\cdot ${k * a * a} = ${answer.toLatex()}$。`,
        ),
      ),
    });
  },
);

const netAndTotal = {
  ...point(
    "total-area-from-the-net-integral",
    ["Total area from the net integral", "由净积分求总面积"],
    [
      "When a curve crosses the axis, the integral over the whole interval is the net of the lobes, not the total area. If the lobes have areas $A$ above and $B$ below, the integral is $A - B$ and the total area is $A + B$. For example, if the lobe above has area $10$ and the integral over the whole interval is $4$, the lobe below contributes $4 - 10 = -6$, so it has area $6$ and the total area is $10 + 6 = 16$.\n\nCheck: the total and the net differ by twice the lobe below: $16 - 4 = 12 = 2 \\cdot 6$.\n\n> **Watch out.** The absolute value of the net integral, $|4| = 4$, is not the total area: the lobes cancel inside the integral before the absolute value is taken.",
      "当曲线穿过坐标轴时，整个区间上的积分是各部分的净值，而不是总面积。如果上方部分面积为 $A$，下方部分面积为 $B$，则积分是 $A - B$，总面积是 $A + B$。例如，上方部分面积为 $10$，整个区间上的积分为 $4$，则下方部分贡献 $4 - 10 = -6$，面积为 $6$，总面积是 $10 + 6 = 16$。\n\n检验：总面积与净积分相差下方部分面积的两倍：$16 - 4 = 12 = 2 \\cdot 6$。\n\n> **注意。** 净积分的绝对值 $|4| = 4$ 不是总面积：取绝对值之前，各部分已在积分中相互抵消。",
    ],
    (rng) => {
      const p = rng.int(-9, -1);
      const m = p + rng.int(1, 5);
      const q = m + rng.int(1, 5);
      const A = rng.int(2, 24);
      const B = rng.int(1, 24);
      const I = A - B;
      const answer = A + B;
      const all = [
        {
          value: Q.of(Math.abs(I)),
          why: t(
            `This is the absolute value of the net integral; the lobes cancel inside $\\int_{${p}}^{${q}} f(x) \\, dx$, so add their areas instead.`,
            `这是净积分的绝对值；在 $\\int_{${p}}^{${q}} f(x) \\, dx$ 中各部分已相互抵消，应把它们的面积相加。`,
          ),
        },
        {
          value: Q.of(A),
          why: t(
            `This is only the lobe above the axis, on $[${p}, ${m}]$; the lobe below on $[${m}, ${q}]$ counts too.`,
            `这只是 $[${p}, ${m}]$ 上轴上方的部分；$[${m}, ${q}]$ 上轴下方的部分也要算。`,
          ),
        },
        {
          value: Q.of(B),
          why: t(
            `This is only the lobe below the axis, on $[${m}, ${q}]$; add the lobe above, of area $${A}$.`,
            `这只是 $[${m}, ${q}]$ 上轴下方的部分；还要加上上方面积为 $${A}$ 的部分。`,
          ),
        },
      ];
      const mistakes = all.filter((x, i) => !x.value.eq(Q.of(answer)) && all.findIndex((y) => y.value.eq(x.value)) === i);
      return numberProblem({
        prompt: t(
          `$f > 0$ on $(${p}, ${m})$ and $f < 0$ on $(${m}, ${q})$, with $\\int_{${p}}^{${m}} f(x) \\, dx = ${A}$ and $\\int_{${p}}^{${q}} f(x) \\, dx = ${I}$. Find the total area between the graph of $f$ and the $x$-axis on $[${p}, ${q}]$.`,
          `$f$ 在 $(${p}, ${m})$ 上为正，在 $(${m}, ${q})$ 上为负，且 $\\int_{${p}}^{${m}} f(x) \\, dx = ${A}$，$\\int_{${p}}^{${q}} f(x) \\, dx = ${I}$。求 $[${p}, ${q}]$ 上 $f$ 的图像与 $x$ 轴之间的总面积。`,
        ),
        answer,
        mistakes,
        solution: walked(
          [
            [
              ["Find the lower lobe", "求下方部分"],
              t("Split the integral at the crossing:", "在交点处拆开积分："),
              [`\\int_{${m}}^{${q}} f(x) \\, dx = ${I} - ${A} = ${-B}`],
            ],
            [
              ["Add the areas", "把面积相加"],
              t(`The lobe below has area $${B}$, so the total is:`, `下方部分面积为 $${B}$，所以总面积为：`),
              [`${A} + ${B} = ${answer}`],
            ],
          ],
          t(
            `The total area and the net integral differ by twice the lobe below: $${answer} - ${I < 0 ? `(${I})` : I} = ${answer - I} = 2 \\cdot ${B}$.`,
            `总面积与净积分相差下方部分面积的两倍：$${answer} - ${I < 0 ? `(${I})` : I} = ${answer - I} = 2 \\cdot ${B}$。`,
          ),
        ),
      });
    },
  ),
  figure: calculusDrawings4["finding-areas-between-curves-that-intersect-at-more-than-two-points#total-area-from-the-net-integral"],
};

const heightFromVolume = point(
  "a-constant-height-from-the-volume",
  ["A constant height from the volume", "由体积求不变的高"],
  [
    "When rectangular cross sections all have the same height $h$, the volume is $\\int h \\cdot w(x) \\, dx$, which is $h$ times the area of the base. So a known volume gives the height once the base area is found by integrating. For example, the base under $y = 1 - x^{2}$ has area $\\int_{-1}^{1} (1 - x^{2}) \\, dx = \\frac{4}{3}$, so a volume of $4$ needs height $4 \\div \\frac{4}{3} = 3$.\n\nCheck: $3 \\cdot \\frac{4}{3} = 4$, the given volume.\n\n> **Watch out.** Divide by the area of the base, not by its width or its greatest height.",
    "当矩形截面的高都等于 $h$ 时，体积是 $\\int h \\cdot w(x) \\, dx$，也就是 $h$ 乘以底面积。所以知道体积后，先积分求出底面积，就能得到高。例如，$y = 1 - x^{2}$ 下方的底面积为 $\\int_{-1}^{1} (1 - x^{2}) \\, dx = \\frac{4}{3}$，所以体积为 $4$ 时高为 $4 \\div \\frac{4}{3} = 3$。\n\n检验：$3 \\cdot \\frac{4}{3} = 4$，正是给定的体积。\n\n> **注意。** 要除以底面的面积，而不是底面的宽度或最大高度。",
  ],
  (rng) => {
    const a = rng.int(1, 6);
    const h = rng.int(2, 9);
    const base = Q.of(4 * a ** 3, 3);
    const V = base.mul(Q.of(h));
    const f = poly([-1, "x^{2}"], [a * a, ""]);
    const all = [
      {
        value: V.div(Q.of(2 * a)),
        why: t(
          `This divides by the width $${2 * a}$ of the base; the volume is the height times the area of the base.`,
          `这是除以底面的宽度 $${2 * a}$；体积等于高乘以底面积。`,
        ),
      },
      {
        value: V.div(Q.of(a * a)),
        why: t(
          `This divides by the greatest height $${a * a}$ of the base; divide by its area.`,
          `这是除以底面的最大高度 $${a * a}$；应除以底面积。`,
        ),
      },
      {
        value: V.div(Q.of(2 * a ** 3)),
        why: t(
          `This divides by the rectangle $${2 * a} \\times ${a * a}$ around the base; the parabolic base fills only $\\frac{2}{3}$ of it.`,
          `这是除以包住底面的 $${2 * a} \\times ${a * a}$ 矩形；抛物线围成的底面只占它的 $\\frac{2}{3}$。`,
        ),
      },
    ];
    const mistakes = all.filter((x, i) => !x.value.eq(Q.of(h)) && all.findIndex((y) => y.value.eq(x.value)) === i);
    return numberProblem({
      prompt: t(
        `The base of a solid is the region bounded by $y = ${f}$ and the $x$-axis. Cross sections perpendicular to the $x$-axis are rectangles of the same height, and the volume is $${V.toLatex()}$. Find the height.`,
        `一个立体的底面是由 $y = ${f}$ 和 $x$ 轴围成的区域。垂直于 $x$ 轴的截面都是高相同的矩形，体积是 $${V.toLatex()}$。求这个高。`,
      ),
      answer: h,
      mistakes,
      solution: walked(
        [
          [
            ["Find the area of the base", "求底面积"],
            t(`The curve meets the axis at $x = \\pm ${a}$:`, `曲线与坐标轴交于 $x = \\pm ${a}$：`),
            [`\\int_{${-a}}^{${a}} (${f}) \\, dx = \\Big[${a * a}x - \\frac{1}{3}x^{3}\\Big]_{${-a}}^{${a}} = ${base.toLatex()}`],
          ],
          [
            ["Divide the volume by the base area", "用体积除以底面积"],
            t("The volume is the height times the base area:", "体积等于高乘以底面积："),
            [`h = ${V.toLatex()} \\div ${base.toLatex()} = ${h}`],
          ],
        ],
        t(
          `Find the base area another way: the region between a parabola and a chord fills $\\frac{2}{3}$ of the rectangle around it, $\\frac{2}{3} \\cdot ${2 * a} \\cdot ${a * a} = ${base.toLatex()}$. Then $${h} \\cdot ${base.toLatex()} = ${V.toLatex()}$, the given volume.`,
          `用另一种方法求底面积：抛物线与弦之间的区域占外接矩形的 $\\frac{2}{3}$，$\\frac{2}{3} \\cdot ${2 * a} \\cdot ${a * a} = ${base.toLatex()}$。于是 $${h} \\cdot ${base.toLatex()} = ${V.toLatex()}$，正是给定的体积。`,
        ),
      ),
    });
  },
);

const overCircularBase = {
  ...point(
    "cross-sections-over-a-circular-base",
    ["Cross sections over a circular base", "圆形底面上的截面"],
    [
      "Over a disc of radius $r$, the chord at $x$ has length $2\\sqrt{r^{2} - x^{2}}$. The radius of the cross section is half the chord when the chord is a diameter. Semicircles on chords build a hemisphere and circles on chords build a sphere, which checks the integral. For example, over the disc $x^{2} + y^{2} \\le 1$ with circles, the radius at $x$ is $\\sqrt{1 - x^{2}}$, the area is $\\pi(1 - x^{2})$, and $V = \\pi\\int_{-1}^{1} (1 - x^{2}) \\, dx = \\frac{4}{3}\\pi$.\n\nCheck: the slices make a sphere of radius $1$, and $\\frac{4}{3}\\pi \\cdot 1^{3} = \\frac{4}{3}\\pi$.\n\n> **Watch out.** The chord is the diameter, so the radius is half of it; using the whole chord as the radius makes every slice four times too large.",
      "在半径为 $r$ 的圆盘上，$x$ 处的弦长是 $2\\sqrt{r^{2} - x^{2}}$。弦作为直径时，截面半径是弦长的一半。以弦为直径的半圆构成半球，以弦为直径的圆构成球，这可以检验积分的结果。例如，在圆盘 $x^{2} + y^{2} \\le 1$ 上取圆形截面，$x$ 处的半径是 $\\sqrt{1 - x^{2}}$，面积是 $\\pi(1 - x^{2})$，$V = \\pi\\int_{-1}^{1} (1 - x^{2}) \\, dx = \\frac{4}{3}\\pi$。\n\n检验：这些截面构成半径为 $1$ 的球，而 $\\frac{4}{3}\\pi \\cdot 1^{3} = \\frac{4}{3}\\pi$。\n\n> **注意。** 弦是直径，所以半径是它的一半；把整条弦当作半径，每个截面都会大四倍。",
    ],
    (rng) => {
      const r = rng.int(1, 18);
      const semi = rng.bool();
      const answer = semi ? Q.of(2 * r ** 3, 3) : Q.of(4 * r ** 3, 3);
      const shape: Pair = semi ? ["semicircles", "半圆"] : ["circles", "圆"];
      const [en, zh] = kpi(
        `The base of a solid is the disc $x^{2} + y^{2} \\le ${r * r}$. Cross sections perpendicular to the $x$-axis are ${shape[0]} whose diameters are chords of the disc. Find the volume.`,
        `一个立体的底面是圆盘 $x^{2} + y^{2} \\le ${r * r}$。垂直于 $x$ 轴的截面是以圆盘的弦为直径的${shape[1]}。求体积。`,
      );
      const factor = semi ? "\\frac{\\pi}{2}" : "\\pi";
      const chordAsRadius = {
        value: answer.mul(Q.of(4)),
        why: t(
          "This uses the whole chord as the radius; the chord is the diameter, so the radius is half of it.",
          "这里把整条弦当作半径；弦是直径，半径是它的一半。",
        ),
      };
      const noSquare = {
        value: Q.of(semi ? r ** 3 : 2 * r ** 3),
        why: t(
          `This keeps only the constant term, $${factor}\\int_{${-r}}^{${r}} ${r * r} \\, dx$; subtract $${factor}\\int_{${-r}}^{${r}} x^{2} \\, dx$ as well.`,
          `这里只算了常数项 $${factor}\\int_{${-r}}^{${r}} ${r * r} \\, dx$；还要减去 $${factor}\\int_{${-r}}^{${r}} x^{2} \\, dx$。`,
        ),
      };
      const mistakes = semi
        ? [
            chordAsRadius,
            {
              value: answer.mul(Q.of(2)),
              why: t(
                "This uses whole circles, of area $\\pi\\rho^{2}$; a semicircle has half that, $\\frac{\\pi}{2}\\rho^{2}$.",
                "这里用了整圆，面积是 $\\pi\\rho^{2}$；半圆只有一半，即 $\\frac{\\pi}{2}\\rho^{2}$。",
              ),
            },
            {
              value: answer.div(Q.of(2)),
              why: t(
                `This integrates only from $x = 0$ to $x = ${r}$; the disc runs from $x = ${-r}$ to $x = ${r}$.`,
                `这里只从 $x = 0$ 积到 $x = ${r}$；圆盘从 $x = ${-r}$ 延伸到 $x = ${r}$。`,
              ),
            },
            noSquare,
          ]
        : [
            chordAsRadius,
            {
              value: answer.div(Q.of(2)),
              why: t(
                "This uses semicircles, of area $\\frac{\\pi}{2}\\rho^{2}$; the sections are whole circles, of area $\\pi\\rho^{2}$.",
                "这里用了半圆，面积是 $\\frac{\\pi}{2}\\rho^{2}$；截面是整圆，面积是 $\\pi\\rho^{2}$。",
              ),
            },
            noSquare,
          ];
      return numberProblem({
        prompt: t(en, zh),
        answer,
        mistakes,
        solution: walked(
          [
            [
              ["Find the area of a section", "求截面面积"],
              t(`The chord at $x$ is a diameter, so the radius is half of it:`, `$x$ 处的弦是直径，所以半径是它的一半：`),
              [
                `\\rho = \\frac{1}{2} \\cdot 2\\sqrt{${r * r} - x^{2}} = \\sqrt{${r * r} - x^{2}}, \\quad A(x) = ${factor}(${r * r} - x^{2})`,
              ],
            ],
            [
              ["Integrate across the disc", "沿圆盘积分"],
              t(`The sections run from $x = ${-r}$ to $x = ${r}$:`, `截面从 $x = ${-r}$ 到 $x = ${r}$：`),
              [
                `V = ${factor}\\int_{${-r}}^{${r}} (${r * r} - x^{2}) \\, dx = ${factor} \\cdot ${Q.of(4 * r ** 3, 3).toLatex()} = ${answer.toLatex()}\\pi`,
              ],
            ],
          ],
          t(
            `The ${semi ? "semicircles build a hemisphere" : "circles build a sphere"} of radius $${r}$, of volume $${semi ? "\\frac{2}{3}" : "\\frac{4}{3}"}\\pi \\cdot ${r}^{3} = ${answer.toLatex()}\\pi$. So $k = ${answer.toLatex()}$.`,
            `这些${semi ? "半圆" : "圆"}构成半径为 $${r}$ 的${semi ? "半球" : "球"}，体积为 $${semi ? "\\frac{2}{3}" : "\\frac{4}{3}"}\\pi \\cdot ${r}^{3} = ${answer.toLatex()}\\pi$。所以 $k = ${answer.toLatex()}$。`,
          ),
        ),
      });
    },
  ),
  figure: calculusDrawings4["volumes-of-solids-with-circular-cross-sections#cross-sections-over-a-circular-base"],
};

const washerAxisOutside = {
  ...point(
    "an-axis-outside-the-region-needs-washers",
    ["An axis outside the region needs washers", "轴在区域外时要用垫圈"],
    [
      "If the axis of rotation does not touch the region, each slice has a hole, so use both radii measured from the axis:\n\n$$V = \\pi\\int_{a}^{b} \\left(R^{2} - r^{2}\\right) dx$$\n\nFor example, the region between $y = x^{2}$ and $y = 1$ rotated about $y = -1$ has $R = 2$ and $r = x^{2} + 1$, so $R^{2} - r^{2} = 3 - 2x^{2} - x^{4}$ and\n\n$$V = \\pi\\left(6 - \\frac{4}{3} - \\frac{2}{5}\\right) = \\frac{64}{15}\\pi$$\n\nCheck: $R^{2} - r^{2}$ splits as $\\left(1 - x^{4}\\right) + 2\\left(1 - x^{2}\\right)$. The first part is the same region about the $x$-axis, $\\frac{8}{5}\\pi$, and the second is $2\\pi$ times the area $\\frac{4}{3}$ of the region, $\\frac{8}{3}\\pi$. Together they make $\\frac{64}{15}\\pi$. Shifting the axis away makes the volume larger.\n\n> **Watch out.** The area of a washer is $\\pi(R^{2} - r^{2})$, not $\\pi(R - r)^{2}$. Squaring the difference gives $\\frac{16}{15}\\pi$ here, which is too small.",
      "如果旋转轴不接触区域，每一片都有一个孔，两个半径都从轴量起：\n\n$$V = \\pi\\int_{a}^{b} \\left(R^{2} - r^{2}\\right) dx$$\n\n例如，$y = x^{2}$ 与 $y = 1$ 之间的区域绕 $y = -1$ 旋转，$R = 2$，$r = x^{2} + 1$，所以 $R^{2} - r^{2} = 3 - 2x^{2} - x^{4}$，\n\n$$V = \\pi\\left(6 - \\frac{4}{3} - \\frac{2}{5}\\right) = \\frac{64}{15}\\pi$$\n\n检验：$R^{2} - r^{2}$ 可拆成 $\\left(1 - x^{4}\\right) + 2\\left(1 - x^{2}\\right)$。第一部分是同一区域绕 $x$ 轴旋转，得 $\\frac{8}{5}\\pi$；第二部分是 $2\\pi$ 乘以区域面积 $\\frac{4}{3}$，得 $\\frac{8}{3}\\pi$。合起来是 $\\frac{64}{15}\\pi$。把轴移远会使体积变大。\n\n> **注意。** 垫圈的面积是 $\\pi(R^{2} - r^{2})$，不是 $\\pi(R - r)^{2}$。先相减再平方，这里得 $\\frac{16}{15}\\pi$，偏小。",
    ],
    (rng) => {
      const a = rng.int(1, 5);
      const c = rng.int(1, 6);
      const below = Q.of(8 * a ** 5, 5);
      const shift = Q.of(8 * a ** 3 * c, 3);
      const answer = below.add(shift);
      const top = a ** 4 + 2 * a * a * c;
      const [en, zh] = kpi(
        `The region bounded by $y = x^{2}$ and $y = ${a * a}$ is rotated about the line $y = ${-c}$. Find the volume.`,
        `由 $y = x^{2}$ 和 $y = ${a * a}$ 围成的区域绕直线 $y = ${-c}$ 旋转。求体积。`,
      );
      const all = [
        {
          value: Q.of(16 * a ** 5, 15),
          why: t(
            "This squares the difference of the radii. A washer has area $\\pi(R^{2} - r^{2})$, not $\\pi(R - r)^{2}$.",
            "这是把两个半径的差平方了。垫圈的面积是 $\\pi(R^{2} - r^{2})$，不是 $\\pi(R - r)^{2}$。",
          ),
        },
        {
          value: below,
          why: t(
            `This rotates about the $x$-axis. The axis is $y = ${-c}$, so add $${c}$ to both radii.`,
            `这是绕 $x$ 轴旋转。旋转轴是 $y = ${-c}$，两个半径都要加 $${c}$。`,
          ),
        },
        {
          value: below.add(Q.of(4 * a ** 3 * c, 3)),
          why: t(
            `The middle terms of the squares were halved. $(x^{2} + ${c})^{2}$ has middle term $${2 * c}x^{2}$, and $(${a * a} + ${c})^{2}$ has middle term $${2 * a * a * c}$.`,
            `平方展开的中间项少了一半。$(x^{2} + ${c})^{2}$ 的中间项是 $${2 * c}x^{2}$，$(${a * a} + ${c})^{2}$ 的中间项是 $${2 * a * a * c}$。`,
          ),
        },
      ];
      return numberProblem({
        prompt: t(en, zh),
        answer,
        mistakes: all.filter((m, i) => all.findIndex((n) => n.value.eq(m.value)) === i),
        solution: walked(
          [
            [
              ["Find the radii", "求半径"],
              t(
                `The axis $y = ${-c}$ lies below the region. The line $y = ${a * a}$ is farther from it and the curve $y = x^{2}$ is nearer, so:`,
                `旋转轴 $y = ${-c}$ 在区域下方。直线 $y = ${a * a}$ 离轴较远，曲线 $y = x^{2}$ 较近，所以：`,
              ),
              [`R = ${a * a} + ${c} = ${a * a + c}, \\quad r = x^{2} + ${c}`],
            ],
            [
              ["Subtract the squares", "求平方差"],
              t("Expand both squares:", "把两个平方展开："),
              [`R^{2} - r^{2} = ${(a * a + c) ** 2} - \\left(x^{4} + ${2 * c}x^{2} + ${c * c}\\right) = ${top} - ${2 * c}x^{2} - x^{4}`],
            ],
            [
              ["Integrate", "积分"],
              t(`The curves meet at $x = \\pm${a}$:`, `两曲线交于 $x = \\pm${a}$：`),
              [
                `V = \\pi\\int_{${-a}}^{${a}} \\left(${top} - ${2 * c}x^{2} - x^{4}\\right) dx = \\pi\\left(${2 * a * top} - ${Q.of(4 * c * a ** 3, 3).toLatex()} - ${Q.of(2 * a ** 5, 5).toLatex()}\\right) = ${answer.toLatex()}\\pi`,
              ],
            ],
          ],
          t(
            `Split $R^{2} - r^{2}$ as $\\left(${a ** 4} - x^{4}\\right) + ${2 * c}\\left(${a * a} - x^{2}\\right)$. The first part is the region rotated about the $x$-axis, $\\pi\\int_{${-a}}^{${a}} \\left(${a ** 4} - x^{4}\\right) dx = ${below.toLatex()}\\pi$. The second is $${2 * c}\\pi$ times the area of the region, $${Q.of(4 * a ** 3, 3).toLatex()}$, which is $${shift.toLatex()}\\pi$. Together they give $${answer.toLatex()}\\pi$, so $k = ${answer.toLatex()}$.`,
            `把 $R^{2} - r^{2}$ 拆成 $\\left(${a ** 4} - x^{4}\\right) + ${2 * c}\\left(${a * a} - x^{2}\\right)$。第一部分是区域绕 $x$ 轴旋转，$\\pi\\int_{${-a}}^{${a}} \\left(${a ** 4} - x^{4}\\right) dx = ${below.toLatex()}\\pi$。第二部分是 $${2 * c}\\pi$ 乘以区域面积 $${Q.of(4 * a ** 3, 3).toLatex()}$，即 $${shift.toLatex()}\\pi$。合起来是 $${answer.toLatex()}\\pi$，所以 $k = ${answer.toLatex()}$。`,
          ),
        ),
      });
    },
  ),
  figure:
    calculusDrawings4["volumes-of-revolution-using-the-disc-method-rotation-about-other-axes#an-axis-outside-the-region-needs-washers"],
};

const shellShiftedAxis = {
  ...point(
    "shells-about-a-line-below-the-axis",
    ["Shells about a line below the axis", "绕轴下方直线的柱壳"],
    [
      "The shell radius is the distance from the axis of rotation to the strip. For rotation about $y = -c$, a strip at height $y$ has radius $y + c$, not $y$. The height of the shell is the length of the strip, which does not change:\n\n$$V = 2\\pi\\int_{a}^{b} (y + c)\\,g(y) \\, dy$$\n\nFor example, the region between the $y$-axis and $x = y^{2}$ for $0 \\le y \\le 1$, rotated about $y = -1$, has\n\n$$V = 2\\pi\\int_{0}^{1} (y + 1)y^{2} \\, dy = 2\\pi\\left(\\frac{1}{4} + \\frac{1}{3}\\right) = \\frac{7}{6}\\pi$$\n\nCheck: with washers, a slice at $x$ runs from $y = \\sqrt{x}$ to $y = 1$, so its radii are $2$ and $1 + \\sqrt{x}$, and $\\pi\\int_{0}^{1} \\left(3 - 2\\sqrt{x} - x\\right) dx = \\frac{7}{6}\\pi$.\n\n> **Watch out.** Keeping the radius $y$ rotates about the $x$-axis instead and gives $\\frac{1}{2}\\pi$ here.",
      "柱壳半径是旋转轴到条带的距离。绕 $y = -c$ 旋转时，高度为 $y$ 的条带半径是 $y + c$，而不是 $y$。柱壳的高是条带的长度，不会改变：\n\n$$V = 2\\pi\\int_{a}^{b} (y + c)\\,g(y) \\, dy$$\n\n例如，$y$ 轴与 $x = y^{2}$ 之间、$0 \\le y \\le 1$ 的区域绕 $y = -1$ 旋转，\n\n$$V = 2\\pi\\int_{0}^{1} (y + 1)y^{2} \\, dy = 2\\pi\\left(\\frac{1}{4} + \\frac{1}{3}\\right) = \\frac{7}{6}\\pi$$\n\n检验：用垫圈法，$x$ 处的切片从 $y = \\sqrt{x}$ 到 $y = 1$，两个半径是 $2$ 和 $1 + \\sqrt{x}$，$\\pi\\int_{0}^{1} \\left(3 - 2\\sqrt{x} - x\\right) dx = \\frac{7}{6}\\pi$。\n\n> **注意。** 沿用半径 $y$ 就变成绕 $x$ 轴旋转，这里得 $\\frac{1}{2}\\pi$。",
    ],
    (rng) => {
      const b = rng.int(1, 4);
      const c = rng.int(1, 5);
      const m = rng.int(1, 4);
      const inner = (shift: number) =>
        Q.of(b ** 4, 4)
          .add(Q.of(shift * b ** 3, 3))
          .add(Q.of(m * b * b, 2))
          .add(Q.of(m * shift * b));
      const answer = inner(c).mul(Q.of(2));
      const alone = inner(0).mul(Q.of(2));
      const extra = Q.of(2 * c).mul(Q.of(b ** 3, 3).add(Q.of(m * b)));
      const g = poly([1, "y^{2}"], [m, ""]);
      const [en, zh] = kpi(
        `The region bounded by $x = ${g}$, the $y$-axis, $y = 0$ and $y = ${b}$ is rotated about the line $y = ${-c}$. Find the volume using shells.`,
        `由 $x = ${g}$、$y$ 轴、$y = 0$ 和 $y = ${b}$ 围成的区域绕直线 $y = ${-c}$ 旋转。用柱壳法求体积。`,
      );
      const all = [
        {
          value: alone,
          why: t(
            `This uses the radius $y$, the distance to the $x$-axis. The axis is $y = ${-c}$, so the radius is $y + ${c}$.`,
            `这里用的半径是 $y$，那是到 $x$ 轴的距离。旋转轴是 $y = ${-c}$，半径应是 $y + ${c}$。`,
          ),
        },
        {
          value: inner(c),
          why: t(
            "This is half the volume: a shell has area $2\\pi rh$, so the factor is $2\\pi$, not $\\pi$.",
            "这是体积的一半：柱壳面积是 $2\\pi rh$，因子是 $2\\pi$，不是 $\\pi$。",
          ),
        },
        {
          value: inner(-c).mul(Q.of(2)),
          why: t(
            `This uses the radius $y - ${c}$, as if the axis were $y = ${c}$. The region lies above $y = ${-c}$, so the radius is $y + ${c}$.`,
            `这里用的半径是 $y - ${c}$，好像旋转轴是 $y = ${c}$。区域在 $y = ${-c}$ 上方，半径应是 $y + ${c}$。`,
          ),
        },
      ];
      return numberProblem({
        prompt: t(en, zh),
        answer,
        mistakes: all.filter((x, i) => !x.value.eq(answer) && all.findIndex((y) => y.value.eq(x.value)) === i),
        solution: walked(
          [
            [
              ["Find the radius and the length", "求半径和长度"],
              t(
                `A strip at height $y$ runs from the $y$-axis to $x = ${g}$, and it is at distance $y + ${c}$ from the line $y = ${-c}$:`,
                `高度 $y$ 处的条带从 $y$ 轴到 $x = ${g}$，到直线 $y = ${-c}$ 的距离是 $y + ${c}$：`,
              ),
              [`V = 2\\pi\\int_{0}^{${b}} (y + ${c})\\left(${g}\\right) dy`],
            ],
            [
              ["Multiply out", "展开"],
              t("Expand the product:", "把乘积展开："),
              [`(y + ${c})\\left(${g}\\right) = ${poly([1, "y^{3}"], [c, "y^{2}"], [m, "y"], [m * c, ""])}`],
            ],
            [
              ["Integrate", "积分"],
              t("Evaluate the antiderivative at the limits:", "把原函数代入上下限："),
              [
                `V = 2\\pi\\left[${poly([Q.of(1, 4), "y^{4}"], [Q.of(c, 3), "y^{3}"], [Q.of(m, 2), "y^{2}"], [m * c, "y"])}\\right]_{0}^{${b}} = 2\\pi\\left(${Q.of(b ** 4, 4).toLatex()} + ${Q.of(c * b ** 3, 3).toLatex()} + ${Q.of(m * b * b, 2).toLatex()} + ${m * c * b}\\right) = ${answer.toLatex()}\\pi`,
              ],
            ],
          ],
          t(
            `Split the radius into $y$ and $${c}$. The radius $y$ alone gives the solid about the $x$-axis, $2\\pi\\int_{0}^{${b}} y\\left(${g}\\right) dy = ${alone.toLatex()}\\pi$. The extra $${c}$ adds $${2 * c}\\pi\\int_{0}^{${b}} \\left(${g}\\right) dy = ${extra.toLatex()}\\pi$. Together they give $${answer.toLatex()}\\pi$, so $k = ${answer.toLatex()}$.`,
            `把半径拆成 $y$ 和 $${c}$。只用半径 $y$ 得到绕 $x$ 轴的立体，$2\\pi\\int_{0}^{${b}} y\\left(${g}\\right) dy = ${alone.toLatex()}\\pi$。多出的 $${c}$ 加上 $${2 * c}\\pi\\int_{0}^{${b}} \\left(${g}\\right) dy = ${extra.toLatex()}\\pi$。合起来是 $${answer.toLatex()}\\pi$，所以 $k = ${answer.toLatex()}$。`,
          ),
        ),
      });
    },
  ),
  figure: calculusDrawings4["the-shell-method-rotating-a-region-about-the-x-axis#shells-about-a-line-below-the-axis"],
};

const shellAxisAbove = point(
  "shells-between-curves-about-a-line-above",
  ["Shells between curves about a line above", "两曲线之间绕上方直线的柱壳"],
  [
    "For an axis above the region at $y = H$, the shell radius is $H - y$, which is positive throughout. The strip length is still right curve minus left curve:\n\n$$V = 2\\pi\\int_{c}^{d} (H - y)\\left(x_{\\text{right}} - x_{\\text{left}}\\right) dy$$\n\nFor example, the region between $x = y^{2}$ and $x = 2y$ meets at $y = 0$ and $y = 2$. About $y = 3$,\n\n$$V = 2\\pi\\int_{0}^{2} (3 - y)(2y - y^{2}) \\, dy = 2\\pi\\int_{0}^{2} \\left(y^{3} - 5y^{2} + 6y\\right) dy = 2\\pi\\left(4 - \\frac{40}{3} + 12\\right) = \\frac{16}{3}\\pi$$\n\nCheck: with washers, a slice at $x$ runs from $y = \\frac{x}{2}$ to $y = \\sqrt{x}$, so its radii are $3 - \\frac{x}{2}$ and $3 - \\sqrt{x}$. Their squares differ by $\\frac{x^{2}}{4} - 4x + 6\\sqrt{x}$, and\n\n$$\\pi\\int_{0}^{4} \\left(\\frac{x^{2}}{4} - 4x + 6\\sqrt{x}\\right) dx = \\pi\\left(\\frac{16}{3} - 32 + 32\\right) = \\frac{16}{3}\\pi$$\n\n> **Watch out.** Using $y$ or $y - H$ as the radius is the common mistake. The radius $y$ gives $\\frac{8}{3}\\pi$ here, the volume about the $x$-axis.",
    "当旋转轴 $y = H$ 在区域上方时，柱壳半径是 $H - y$，处处为正。条带长度仍是右边曲线减左边曲线：\n\n$$V = 2\\pi\\int_{c}^{d} (H - y)\\left(x_{\\text{右}} - x_{\\text{左}}\\right) dy$$\n\n例如，$x = y^{2}$ 与 $x = 2y$ 之间的区域，两曲线交于 $y = 0$ 和 $y = 2$。绕 $y = 3$ 旋转，\n\n$$V = 2\\pi\\int_{0}^{2} (3 - y)(2y - y^{2}) \\, dy = 2\\pi\\int_{0}^{2} \\left(y^{3} - 5y^{2} + 6y\\right) dy = 2\\pi\\left(4 - \\frac{40}{3} + 12\\right) = \\frac{16}{3}\\pi$$\n\n检验：用垫圈法，$x$ 处的切片从 $y = \\frac{x}{2}$ 到 $y = \\sqrt{x}$，两个半径是 $3 - \\frac{x}{2}$ 和 $3 - \\sqrt{x}$。它们的平方差是 $\\frac{x^{2}}{4} - 4x + 6\\sqrt{x}$，\n\n$$\\pi\\int_{0}^{4} \\left(\\frac{x^{2}}{4} - 4x + 6\\sqrt{x}\\right) dx = \\pi\\left(\\frac{16}{3} - 32 + 32\\right) = \\frac{16}{3}\\pi$$\n\n> **注意。** 把 $y$ 或 $y - H$ 当作半径是常见的错误。用半径 $y$ 这里得 $\\frac{8}{3}\\pi$，那是绕 $x$ 轴的体积。",
  ],
  (rng) => {
    const a = rng.int(1, 6);
    const H = a + rng.int(0, 5);
    const value = (sign: number) => Q.of(H * a ** 3, 3).add(Q.of(sign * a ** 4, 6));
    const answer = value(-1);
    const [en, zh] = kpi(
      `The region bounded by $x = y^{2}$ and $x = ${a === 1 ? "" : a}y$ is rotated about the line $y = ${H}$. Find the volume.`,
      `由 $x = y^{2}$ 和 $x = ${a === 1 ? "" : a}y$ 围成的区域绕直线 $y = ${H}$ 旋转。求体积。`,
    );
    const strip = `${a === 1 ? "" : a}y - y^{2}`;
    const twoH = H === 1 ? "2\\pi" : `2\\pi \\cdot ${H}`;
    const all = [
      {
        value: Q.of(a ** 4, 6),
        why: t(
          `This uses the radius $y$, the distance to the $x$-axis. The axis is $y = ${H}$, so the radius is $${H} - y$.`,
          `这里用的半径是 $y$，那是到 $x$ 轴的距离。旋转轴是 $y = ${H}$，半径应是 $${H} - y$。`,
        ),
      },
      {
        value: value(1),
        why: t(
          `This uses the radius $${H} + y$, as if the axis were $y = ${-H}$ below the region. The axis is above, so the radius is $${H} - y$.`,
          `这里用的半径是 $${H} + y$，好像旋转轴是区域下方的 $y = ${-H}$。旋转轴在上方，半径应是 $${H} - y$。`,
        ),
      },
      {
        value: Q.of(H * a ** 3, 3),
        why: t(
          `This uses the radius $${H}$ for every strip. A strip at height $y$ is only $${H} - y$ from the axis.`,
          `这里每个条带都用半径 $${H}$。高度 $y$ 处的条带到轴的距离只有 $${H} - y$。`,
        ),
      },
      {
        value: answer.div(Q.of(2)),
        why: t(
          "This is half the volume: a shell has area $2\\pi rh$, so the factor is $2\\pi$, not $\\pi$.",
          "这是体积的一半：柱壳面积是 $2\\pi rh$，因子是 $2\\pi$，不是 $\\pi$。",
        ),
      },
    ];
    return numberProblem({
      prompt: t(en, zh),
      answer,
      mistakes: all.filter((x, i) => !x.value.eq(answer) && all.findIndex((y) => y.value.eq(x.value)) === i),
      solution: walked(
        [
          [
            ["Find the strip", "求条带"],
            t(
              `The curves meet where $y^{2} = ${a === 1 ? "" : a}y$, at $y = 0$ and $y = ${a}$. Between them $x = ${a === 1 ? "" : a}y$ is on the right, so the strip has length $${strip}$.`,
              `两曲线交于 $y^{2} = ${a === 1 ? "" : a}y$ 处，即 $y = 0$ 和 $y = ${a}$。在两者之间 $x = ${a === 1 ? "" : a}y$ 在右边，所以条带长度是 $${strip}$。`,
            ),
          ],
          [
            ["Find the radius and multiply out", "求半径并展开"],
            t(`The strip is at distance $${H} - y$ below the axis $y = ${H}$:`, `条带在轴 $y = ${H}$ 下方，距离是 $${H} - y$：`),
            [`(${H} - y)\\left(${strip}\\right) = ${poly([1, "y^{3}"], [-(a + H), "y^{2}"], [a * H, "y"])}`],
          ],
          [
            ["Integrate", "积分"],
            t("Evaluate the antiderivative at the limits:", "把原函数代入上下限："),
            [
              `V = 2\\pi\\int_{0}^{${a}} \\left(${poly([1, "y^{3}"], [-(a + H), "y^{2}"], [a * H, "y"])}\\right) dy = 2\\pi\\left(${Q.of(a ** 4, 4).toLatex()} - ${Q.of((a + H) * a ** 3, 3).toLatex()} + ${Q.of(H * a ** 3, 2).toLatex()}\\right) = ${answer.toLatex()}\\pi`,
            ],
          ],
        ],
        t(
          `Split the radius $${H} - y$ into $${H}$ and $-y$. The constant $${H}$ gives $${twoH}$ times the area of the region, $${Q.of(a ** 3, 6).toLatex()}$, which is $${Q.of(H * a ** 3, 3).toLatex()}\\pi$. The $-y$ part takes away the solid about the $x$-axis, and the difference is the volume:${steps(`2\\pi\\int_{0}^{${a}} y\\left(${strip}\\right) dy = ${Q.of(a ** 4, 6).toLatex()}\\pi`, `V = ${Q.of(H * a ** 3, 3).toLatex()}\\pi - ${Q.of(a ** 4, 6).toLatex()}\\pi = ${answer.toLatex()}\\pi`)}So $k = ${answer.toLatex()}$.`,
          `把半径 $${H} - y$ 拆成 $${H}$ 和 $-y$。常数 $${H}$ 给出 $${twoH}$ 乘以区域面积 $${Q.of(a ** 3, 6).toLatex()}$，即 $${Q.of(H * a ** 3, 3).toLatex()}\\pi$。$-y$ 部分去掉绕 $x$ 轴的立体，二者之差就是体积：${steps(`2\\pi\\int_{0}^{${a}} y\\left(${strip}\\right) dy = ${Q.of(a ** 4, 6).toLatex()}\\pi`, `V = ${Q.of(H * a ** 3, 3).toLatex()}\\pi - ${Q.of(a ** 4, 6).toLatex()}\\pi = ${answer.toLatex()}\\pi`)}所以 $k = ${answer.toLatex()}$。`,
        ),
      ),
    });
  },
);

const coneLength = {
  ...point(
    "the-length-of-a-segment-from-its-surface-area",
    ["The length of a segment from its surface area", "由表面积求线段的范围"],
    [
      "Rotating $y = \\frac{p}{q}x$ about the $x$-axis gives a cone. For the reverse question, write the surface area in terms of the upper limit $b$ and solve for it:\n\n$$S = 2\\pi\\int_{0}^{b} y\\sqrt{1 + y'^{2}} \\, dx$$\n\nFor example, for $y = \\frac{3}{4}x$ the factor $\\sqrt{1 + y'^{2}}$ is $\\frac{5}{4}$, so\n\n$$S = 2\\pi\\int_{0}^{b} \\frac{15}{16}x \\, dx = \\frac{15}{16}b^{2}\\pi$$\n\nIf $S = 15\\pi$, then $b^{2} = 16$ and $b = 4$.\n\nCheck: at $b = 4$ the cone has radius $3$ and slant height $5$, and $\\pi r\\ell = \\pi \\cdot 3 \\cdot 5 = 15\\pi$.\n\n> **Watch out.** Keep the factor $\\sqrt{1 + y'^{2}}$: the surface is measured along the slant, not along the $x$-axis. And the equation gives $b^{2}$ first, so take the square root.",
      "把 $y = \\frac{p}{q}x$ 绕 $x$ 轴旋转得到圆锥。对于逆问题，把表面积用上限 $b$ 表示，再解出 $b$：\n\n$$S = 2\\pi\\int_{0}^{b} y\\sqrt{1 + y'^{2}} \\, dx$$\n\n例如，对 $y = \\frac{3}{4}x$，因子 $\\sqrt{1 + y'^{2}}$ 是 $\\frac{5}{4}$，所以\n\n$$S = 2\\pi\\int_{0}^{b} \\frac{15}{16}x \\, dx = \\frac{15}{16}b^{2}\\pi$$\n\n若 $S = 15\\pi$，则 $b^{2} = 16$，$b = 4$。\n\n检验：$b = 4$ 时圆锥底面半径为 $3$，母线长为 $5$，$\\pi r\\ell = \\pi \\cdot 3 \\cdot 5 = 15\\pi$。\n\n> **注意。** 不要丢掉因子 $\\sqrt{1 + y'^{2}}$：曲面面积沿斜边度量，而不是沿 $x$ 轴。方程先给出 $b^{2}$，还要开平方。",
    ],
    (rng) => {
      const [p, q, h] = rng.pick(triples);
      const s = rng.int(1, 9);
      const area = p * h * s * s;
      const slope = Q.of(p, q).toLatex();
      const factor = Q.of(p * h, q * q);
      const all = [
        {
          value: Q.of((q * s) ** 2),
          why: t("This is $b^{2}$; take its square root to find $b$.", "这是 $b^{2}$；还要开平方才得到 $b$。"),
        },
        {
          value: Q.of(h * s),
          why: t(
            `This is the length of the segment along the slant. The question asks for $b$, how far it runs along the $x$-axis.`,
            "这是线段沿斜边的长度。题目求的是 $b$，即它沿 $x$ 轴的范围。",
          ),
        },
        {
          value: Q.of(p * s),
          why: t(
            `This is the radius of the cone at the end, the value of $y$ at $x = b$, not $b$ itself.`,
            "这是圆锥在端点处的半径，即 $x = b$ 时 $y$ 的值，不是 $b$ 本身。",
          ),
        },
      ];
      return numberProblem({
        prompt: t(
          `The curve $y = ${slope}x$, $0 \\le x \\le b$, is rotated about the $x$-axis, and the surface has area $${area}\\pi$. Find $b$.`,
          `曲线 $y = ${slope}x$，$0 \\le x \\le b$，绕 $x$ 轴旋转，所得曲面的面积是 $${area}\\pi$。求 $b$。`,
        ),
        answer: q * s,
        solveFor: "b",
        mistakes: all.filter((x, i) => !x.value.eq(Q.of(q * s)) && all.findIndex((y) => y.value.eq(x.value)) === i),
        solution: walked(
          [
            [
              ["Find the slant factor", "求斜率因子"],
              t(`The slope is $${slope}$, so:`, `斜率是 $${slope}$，所以：`),
              [`\\sqrt{1 + \\left(${slope}\\right)^{2}} = \\sqrt{\\frac{${h * h}}{${q * q}}} = \\frac{${h}}{${q}}`],
            ],
            [
              ["Write the area in terms of b", "用 b 表示面积"],
              t("Integrate from $0$ to $b$:", "从 $0$ 积分到 $b$："),
              [`S = 2\\pi\\int_{0}^{b} ${slope}x \\cdot \\frac{${h}}{${q}} \\, dx = ${factor.toLatex()}b^{2}\\pi`],
            ],
            [
              ["Solve for b", "解出 b"],
              t("Set this equal to the given area and cancel $\\pi$:", "令它等于给定的面积，约去 $\\pi$："),
              [`${factor.toLatex()}b^{2} = ${area}`, `b^{2} = ${(q * s) ** 2}`, `b = ${q * s}`],
            ],
          ],
          t(
            `At $b = ${q * s}$ the cone has radius $${p * s}$ and slant height $${h * s}$, and $\\pi r\\ell = \\pi \\cdot ${p * s} \\cdot ${h * s} = ${area}\\pi$, the given area.`,
            `$b = ${q * s}$ 时圆锥底面半径为 $${p * s}$，母线长为 $${h * s}$，$\\pi r\\ell = \\pi \\cdot ${p * s} \\cdot ${h * s} = ${area}\\pi$，正是给定的面积。`,
          ),
        ),
      });
    },
  ),
  figure: calculusDrawings4["surface-areas-of-revolution-rotation-about-the-x-axis#the-length-of-a-segment-from-its-surface-area"],
};

const bothAxes = {
  ...point(
    "the-same-curve-about-the-other-axis",
    ["The same curve about the other axis", "同一曲线绕另一轴旋转"],
    [
      "The arc length element is the same for both rotations; only the radius changes. Around the $x$-axis the radius is $y$, and around the $y$-axis it is $x$:\n\n$$S_{x} = 2\\pi\\int y \\, ds, \\quad S_{y} = 2\\pi\\int x \\, ds$$\n\nFor example, $y = \\frac{3}{4}x$ for $0 \\le x \\le 4$ has $ds = \\frac{5}{4} \\, dx$. About the $x$-axis the area is $15\\pi$; about the $y$-axis it is\n\n$$2\\pi\\int_{0}^{4} \\frac{5}{4}x \\, dx = 2\\pi \\cdot \\frac{5}{4} \\cdot 8 = 20\\pi$$\n\nCheck: about the $y$-axis the cone has base radius $4$ and slant height $5$, and $\\pi r\\ell = \\pi \\cdot 4 \\cdot 5 = 20\\pi$.\n\n> **Watch out.** It is the wrong radius that causes most errors. Also keep $ds$: with $dx$ alone the area here would come out as $16\\pi$.",
      "两种旋转的弧长元素相同，只有半径不同。绕 $x$ 轴时半径是 $y$，绕 $y$ 轴时半径是 $x$：\n\n$$S_{x} = 2\\pi\\int y \\, ds, \\quad S_{y} = 2\\pi\\int x \\, ds$$\n\n例如，$y = \\frac{3}{4}x$，$0 \\le x \\le 4$，$ds = \\frac{5}{4} \\, dx$。绕 $x$ 轴的面积是 $15\\pi$；绕 $y$ 轴的面积是\n\n$$2\\pi\\int_{0}^{4} \\frac{5}{4}x \\, dx = 2\\pi \\cdot \\frac{5}{4} \\cdot 8 = 20\\pi$$\n\n检验：绕 $y$ 轴时圆锥底面半径为 $4$，母线长为 $5$，$\\pi r\\ell = \\pi \\cdot 4 \\cdot 5 = 20\\pi$。\n\n> **注意。** 大多数错误都出在半径用错。还要保留 $ds$：只用 $dx$，这里会得到 $16\\pi$。",
    ],
    (rng) => {
      const [p, q, h] = rng.pick(triples);
      const s = rng.int(1, 9);
      const xArea = p * h * s * s;
      const answer = q * h * s * s;
      const slope = Q.of(p, q).toLatex();
      const [en, zh] = kpi(
        `Rotating $y = ${slope}x$, $0 \\le x \\le ${q * s}$, about the $x$-axis gives a surface of area $${xArea}\\pi$. Find the area when the same segment is rotated about the $y$-axis.`,
        `把 $y = ${slope}x$，$0 \\le x \\le ${q * s}$，绕 $x$ 轴旋转，得到面积为 $${xArea}\\pi$ 的曲面。求同一线段绕 $y$ 轴旋转所得的面积。`,
      );
      const all = [
        {
          value: xArea,
          why: t(
            "This is the area about the $x$-axis, with radius $y$. About the $y$-axis the radius is $x$.",
            "这是绕 $x$ 轴的面积，半径是 $y$。绕 $y$ 轴时半径是 $x$。",
          ),
        },
        {
          value: h * h * s * s,
          why: t(
            `This uses the length $${h * s}$ of the segment as the radius. The radius at the end is $x = ${q * s}$.`,
            `这里把线段的长度 $${h * s}$ 当作半径。端点处的半径是 $x = ${q * s}$。`,
          ),
        },
        {
          value: q * q * s * s,
          why: t(
            `This integrates with $dx$ instead of $ds$. Each piece of the segment is $\\frac{${h}}{${q}}$ times as long as its shadow on the $x$-axis.`,
            `这里用 $dx$ 代替了 $ds$。线段的每一小段都是它在 $x$ 轴上投影的 $\\frac{${h}}{${q}}$ 倍长。`,
          ),
        },
        {
          value: p * q * s * s,
          why: t(
            `This uses the slope $${slope}$ in place of $\\sqrt{1 + y'^{2}} = \\frac{${h}}{${q}}$.`,
            `这里用斜率 $${slope}$ 代替了 $\\sqrt{1 + y'^{2}} = \\frac{${h}}{${q}}$。`,
          ),
        },
      ];
      return numberProblem({
        prompt: t(en, zh),
        answer,
        mistakes: all.filter((x, i) => x.value !== answer && all.findIndex((y) => y.value === x.value) === i),
        solution: walked(
          [
            [
              ["Find ds", "求 ds"],
              t(`The slope is $${slope}$, so:`, `斜率是 $${slope}$，所以：`),
              [`ds = \\sqrt{1 + \\left(${slope}\\right)^{2}} \\, dx = \\frac{${h}}{${q}} \\, dx`],
            ],
            [
              ["Use the radius x", "用半径 x"],
              t("About the $y$-axis each piece is at distance $x$ from the axis:", "绕 $y$ 轴时每一小段到轴的距离是 $x$："),
              [
                `S = 2\\pi\\int_{0}^{${q * s}} x \\cdot \\frac{${h}}{${q}} \\, dx = 2\\pi \\cdot \\frac{${h}}{${q}} \\cdot ${Q.of((q * s) ** 2, 2).toLatex()} = ${answer}\\pi`,
              ],
            ],
          ],
          t(
            `The surface is a cone with base radius $${q * s}$ and slant height $${h * s}$, so $\\pi r\\ell = \\pi \\cdot ${q * s} \\cdot ${h * s} = ${answer}\\pi$, and $k = ${answer}$.`,
            `这个曲面是底面半径为 $${q * s}$、母线长为 $${h * s}$ 的圆锥，$\\pi r\\ell = \\pi \\cdot ${q * s} \\cdot ${h * s} = ${answer}\\pi$，所以 $k = ${answer}$。`,
          ),
        ),
      });
    },
  ),
  figure: calculusDrawings4["surface-areas-of-revolution-rotation-about-the-y-axis#the-same-curve-about-the-other-axis"],
};

const totalDistance = point(
  "distance-travelled-when-the-particle-turns-back",
  ["Distance travelled when the particle turns back", "质点折返时的路程"],
  [
    "Displacement is $\\int v \\, dt$, but distance is $\\int |v| \\, dt$. When the velocity changes sign, split the integral at that time and add the absolute values, since the two parts of a return trip would otherwise cancel. For example, $v(t) = t - 2$ on $[0, 5]$ turns at $t = 2$: it moves $2$ m back and then $\\frac{9}{2}$ m forward, so the distance is $\\frac{13}{2}$ m, while the displacement is only $\\frac{5}{2}$ m.\n\nCheck: the graph of $v$ makes two triangles with the axis, of areas $\\frac{1}{2} \\cdot 2 \\cdot 2 = 2$ and $\\frac{1}{2} \\cdot 3 \\cdot 3 = \\frac{9}{2}$.\n\n> **Watch out.** Take the absolute value of each piece before adding, not of the whole integral: $\\left|\\int_0^5 v \\, dt\\right| = \\frac{5}{2}$ is the size of the displacement.",
    "位移是 $\\int v \\, dt$，而路程是 $\\int |v| \\, dt$。速度变号时，要在那个时刻把积分分开，并把绝对值相加，否则往返的两段会相互抵消。例如 $[0, 5]$ 上的 $v(t) = t - 2$ 在 $t = 2$ 时折返：先后退 $2$ 米，再前进 $\\frac{9}{2}$ 米，所以路程是 $\\frac{13}{2}$ 米，而位移只有 $\\frac{5}{2}$ 米。\n\n检验：$v$ 的图像与横轴围成两个三角形，面积分别为 $\\frac{1}{2} \\cdot 2 \\cdot 2 = 2$ 和 $\\frac{1}{2} \\cdot 3 \\cdot 3 = \\frac{9}{2}$。\n\n> **注意。** 要先对每一段取绝对值再相加，而不是对整个积分取绝对值：$\\left|\\int_0^5 v \\, dt\\right| = \\frac{5}{2}$ 只是位移的大小。",
  ],
  (rng) => {
    const k = nz(rng, 6);
    const r = rng.int(1, 8);
    const T = r + rng.int(1, 8);
    const [first, second] = [Q.of(Math.abs(k) * r * r, 2), Q.of(Math.abs(k) * (T - r) ** 2, 2)];
    const answer = first.add(second);
    const net = Q.of(k * (T * T - 2 * r * T), 2);
    const v = linear(k, -k * r).replace(/x/g, "t");
    const S = (x: number) => Q.of(k * x * x, 2).sub(Q.of(k * r * x));
    const pq = (q: Q) => (q.sign() < 0 ? `\\left(${q.toLatex()}\\right)` : q.toLatex());
    const all = [
      {
        value: net,
        why: t(
          "This is the displacement, $\\int v \\, dt$; the leg walked back cancels in it.",
          "这是位移 $\\int v \\, dt$；走回头路的那段在其中抵消了。",
        ),
      },
      {
        value: net.abs(),
        why: t(
          "This is the size of the displacement; take the absolute value of each piece before adding, not of the whole integral.",
          "这是位移的大小；要先对每一段取绝对值再相加，而不是对整个积分取绝对值。",
        ),
      },
      {
        value: first,
        why: t(`This stops at the turn at $t = ${r}$; add the motion after it.`, `这里在 $t = ${r}$ 折返时就停止了；还要加上之后的运动。`),
      },
      {
        value: second,
        why: t(
          `This counts only the motion after the turn at $t = ${r}$; add the motion before it.`,
          `这只算了 $t = ${r}$ 折返之后的运动；还要加上之前的运动。`,
        ),
      },
    ];
    const mistakes = all.filter((x, i) => !x.value.eq(answer) && all.findIndex((y) => y.value.eq(x.value)) === i);
    return numberProblem({
      prompt: t(
        `A particle has velocity $v(t) = ${v}$ meters per second. Find the distance it travels from $t = 0$ to $t = ${T}$, in meters.`,
        `质点的速度是 $v(t) = ${v}$ 米每秒。求它从 $t = 0$ 到 $t = ${T}$ 走过的路程，单位是米。`,
      ),
      answer,
      mistakes,
      solution: walked(
        [
          [
            ["Find the turn", "找出折返的时刻"],
            t("The velocity changes sign where it is zero:", "速度在为零处变号："),
            [`${v} = 0 \\implies t = ${r}`],
          ],
          [
            ["Integrate each piece", "逐段积分"],
            t(
              `With the antiderivative $S(t) = ${poly([Q.of(k, 2), "t^{2}"], [-k * r, "t"])}$, add the sizes of the two pieces:`,
              `用原函数 $S(t) = ${poly([Q.of(k, 2), "t^{2}"], [-k * r, "t"])}$，把两段的大小相加：`,
            ),
            [
              `\\left|S(${r}) - S(0)\\right| + \\left|S(${T}) - S(${r})\\right| = \\left|${S(r).toLatex()}\\right| + \\left|${S(T).toLatex()} - ${pq(S(r))}\\right| = ${first.toLatex()} + ${second.toLatex()} = ${answer.toLatex()}`,
            ],
          ],
        ],
        t(
          `The graph of $v$ is a line crossing the axis at $t = ${r}$, so the pieces are triangles with heights $|v(0)| = ${Math.abs(k * r)}$ and $|v(${T})| = ${Math.abs(k * (T - r))}$: $\\frac{1}{2} \\cdot ${r} \\cdot ${Math.abs(k * r)} + \\frac{1}{2} \\cdot ${T - r} \\cdot ${Math.abs(k * (T - r))} = ${answer.toLatex()}$.`,
          `$v$ 的图像是在 $t = ${r}$ 处穿过横轴的直线，所以两段都是三角形，高分别为 $|v(0)| = ${Math.abs(k * r)}$ 和 $|v(${T})| = ${Math.abs(k * (T - r))}$：$\\frac{1}{2} \\cdot ${r} \\cdot ${Math.abs(k * r)} + \\frac{1}{2} \\cdot ${T - r} \\cdot ${Math.abs(k * (T - r))} = ${answer.toLatex()}$。`,
        ),
      ),
    });
  },
);

const initialVelocityFromPositions = point(
  "the-initial-velocity-from-two-positions",
  ["The initial velocity from two positions", "由两个位置求初速度"],
  [
    "Sometimes the initial velocity is not given and two positions are. Integrate twice to get $s(t) = s(0) + v_{0}t + \\frac{1}{2}at^{2}$ for constant acceleration, then use the second position to find $v_{0}$. It is not the average velocity. For example, with $a = 2$, $s(0) = 1$ and $s(3) = 16$: $16 = 1 + 3v_{0} + 9$, so $v_{0} = 2$.\n\nCheck: with constant acceleration the average velocity is the velocity at the middle time, and indeed $\\frac{16 - 1}{3} = 5 = 2 + 2 \\cdot 1.5$.\n\n> **Watch out.** The average velocity $\\frac{s(T) - s(0)}{T}$ includes the effect of the acceleration; subtract $\\frac{1}{2}aT$ from it to get $v_{0}$.",
    "有时不给初速度，而是给两个位置。对恒定加速度积分两次得 $s(t) = s(0) + v_{0}t + \\frac{1}{2}at^{2}$，再用第二个位置求 $v_{0}$。它并不等于平均速度。例如 $a = 2$，$s(0) = 1$，$s(3) = 16$：$16 = 1 + 3v_{0} + 9$，所以 $v_{0} = 2$。\n\n检验：加速度恒定时，平均速度等于中间时刻的速度，确实 $\\frac{16 - 1}{3} = 5 = 2 + 2 \\cdot 1.5$。\n\n> **注意。** 平均速度 $\\frac{s(T) - s(0)}{T}$ 包含了加速度的影响；要从中减去 $\\frac{1}{2}aT$ 才得到 $v_{0}$。",
  ],
  (rng) => {
    const k = nz(rng, 8);
    const T = rng.int(2, 6);
    const v0 = rng.int(-9, 9);
    const s0 = rng.int(-9, 9);
    const sT = Q.of(s0 + v0 * T).add(Q.of(k * T * T, 2));
    const avg = sT.sub(Q.of(s0)).div(Q.of(T));
    const half = Q.of(k * T, 2);
    const push = Q.of(k * T * T, 2);
    const answer = Q.of(v0);
    const pq = (q: Q) => (q.sign() < 0 ? `\\left(${q.toLatex()}\\right)` : q.toLatex());
    const all = [
      {
        value: avg,
        why: t(
          `This is the average velocity, $\\frac{s(${T}) - s(0)}{${T}}$; with acceleration $${k}$ the velocity changes, so subtract $\\frac{1}{2} \\cdot ${paren(k)} \\cdot ${T}$.`,
          `这是平均速度 $\\frac{s(${T}) - s(0)}{${T}}$；加速度为 $${k}$ 时速度在变化，所以要减去 $\\frac{1}{2} \\cdot ${paren(k)} \\cdot ${T}$。`,
        ),
      },
      {
        value: avg.add(half),
        why: t(
          `This adds the acceleration term instead of subtracting it: $${T}v_{0} = s(${T}) - s(0) - \\frac{1}{2} \\cdot ${paren(k)} \\cdot ${T}^{2}$.`,
          `这里把加速度项加上了，应当减去：$${T}v_{0} = s(${T}) - s(0) - \\frac{1}{2} \\cdot ${paren(k)} \\cdot ${T}^{2}$。`,
        ),
      },
      {
        value: Q.of(k * T),
        why: t(
          `This is $aT$, the change in velocity over the trip, not the velocity at the start.`,
          `这是 $aT$，即全程速度的变化量，不是起始速度。`,
        ),
      },
      {
        value: sT.sub(push).div(Q.of(T)),
        why: t(
          `This leaves out the starting position $s(0) = ${s0}$; subtract it from $s(${T})$ before dividing.`,
          `这里漏掉了初始位置 $s(0) = ${s0}$；要先从 $s(${T})$ 中减去它再相除。`,
        ),
      },
    ];
    const mistakes = all.filter((x, i) => !x.value.eq(answer) && all.findIndex((y) => y.value.eq(x.value)) === i);
    return numberProblem({
      prompt: t(
        `A particle has constant acceleration $${k}$ meters per second squared, with $s(0) = ${s0}$ and $s(${T}) = ${sT.toLatex()}$. Find its velocity at $t = 0$, in meters per second.`,
        `质点的加速度恒为 $${k}$ 米每二次方秒，且 $s(0) = ${s0}$，$s(${T}) = ${sT.toLatex()}$。求它在 $t = 0$ 时的速度，单位是米每秒。`,
      ),
      answer,
      mistakes,
      solution: walked(
        [
          [
            ["Integrate twice", "积分两次"],
            t(
              "Integrate the acceleration, then the velocity, keeping $v_{0}$ and $s(0)$ as the constants:",
              "先对加速度积分，再对速度积分，以 $v_{0}$ 和 $s(0)$ 作为常数：",
            ),
            [
              `v(t) = v_{0} + ${k === 1 ? "" : k === -1 ? "-" : k}t`.replace("+ -", "- "),
              `s(t) = ${s0} + v_{0}t + \\frac{1}{2} \\cdot ${paren(k)}t^{2}`,
            ],
          ],
          [
            ["Use the second position", "利用第二个位置"],
            t(`Put in $t = ${T}$ and solve for $v_{0}$:`, `代入 $t = ${T}$，解出 $v_{0}$：`),
            [
              `${sT.toLatex()} = ${s0} + ${T}v_{0} + ${pq(push)}`,
              `${T}v_{0} = ${sT.toLatex()} - ${pq(Q.of(s0))} - ${pq(push)} = ${v0 * T} \\implies v_{0} = ${v0}`,
            ],
          ],
        ],
        t(
          `With constant acceleration the average velocity equals the velocity at the middle time $t = ${Q.of(T, 2).toLatex()}$. The average velocity is $${sT.isInteger() ? `\\frac{${sT.toLatex()} - ${pq(Q.of(s0))}}{${T}}` : `\\left(${sT.toLatex()} - ${pq(Q.of(s0))}\\right) \\div ${T}`} = ${avg.toLatex()}$, and $v(${Q.of(T, 2).toLatex()}) = ${v0} + ${paren(k)} \\cdot ${Q.of(T, 2).toLatex()} = ${avg.toLatex()}$, so $v_{0} = ${v0}$ fits.`,
          `加速度恒定时，平均速度等于中间时刻 $t = ${Q.of(T, 2).toLatex()}$ 的速度。平均速度为 $${sT.isInteger() ? `\\frac{${sT.toLatex()} - ${pq(Q.of(s0))}}{${T}}` : `\\left(${sT.toLatex()} - ${pq(Q.of(s0))}\\right) \\div ${T}`} = ${avg.toLatex()}$，而 $v(${Q.of(T, 2).toLatex()}) = ${v0} + ${paren(k)} \\cdot ${Q.of(T, 2).toLatex()} = ${avg.toLatex()}$，所以 $v_{0} = ${v0}$ 正确。`,
        ),
      ),
    });
  },
);

const astroidSurface = point(
  "surfaces-from-an-astroid",
  ["Surfaces from an astroid", "星形线旋转所得的曲面"],
  [
    "The astroid $x = a\\cos^{3}t$, $y = a\\sin^{3}t$ has $\\frac{dx}{dt} = -3a\\cos^{2}t\\sin t$ and $\\frac{dy}{dt} = 3a\\sin^{2}t\\cos t$, so its speed is $3a|\\sin t\\cos t|$. The surface swept by an arc about the $x$-axis has area $\\int 2\\pi y \\, ds$. For $a = 1$ and the first quarter, $0 \\le t \\le \\frac{\\pi}{2}$, both factors are positive, and $u = \\sin t$ gives\n\n$$S = 2\\pi\\int_{0}^{\\pi/2} \\sin^{3}t \\cdot 3\\sin t\\cos t \\, dt = 6\\pi\\int_{0}^{1} u^{4} \\, du = \\frac{6}{5}\\pi$$\n\nCheck: in Cartesian form the quarter is $y = (1 - x^{2/3})^{3/2}$, with $1 + (y')^{2} = x^{-2/3}$, so $ds = x^{-1/3} \\, dx$. With $w = x^{2/3}$, $x^{-1/3} \\, dx = \\frac{3}{2} \\, dw$, and $2\\pi \\cdot \\frac{3}{2}\\int_{0}^{1} (1 - w)^{3/2} \\, dw = 3\\pi \\cdot \\frac{2}{5}$, which is $\\frac{6}{5}\\pi$.\n\n> **Watch out.** Keep the absolute value. Beyond $t = \\frac{\\pi}{2}$ the factor $\\cos t$ is negative, and without the bars the integral over the upper half, $0 \\le t \\le \\pi$, cancels to $0$.",
    "星形线 $x = a\\cos^{3}t$，$y = a\\sin^{3}t$ 有 $\\frac{dx}{dt} = -3a\\cos^{2}t\\sin t$，$\\frac{dy}{dt} = 3a\\sin^{2}t\\cos t$，所以速率是 $3a|\\sin t\\cos t|$。弧绕 $x$ 轴旋转所得曲面的面积是 $\\int 2\\pi y \\, ds$。取 $a = 1$ 和第一个四分之一段 $0 \\le t \\le \\frac{\\pi}{2}$，两个因子都为正，令 $u = \\sin t$ 得\n\n$$S = 2\\pi\\int_{0}^{\\pi/2} \\sin^{3}t \\cdot 3\\sin t\\cos t \\, dt = 6\\pi\\int_{0}^{1} u^{4} \\, du = \\frac{6}{5}\\pi$$\n\n检验：用直角坐标，这一段是 $y = (1 - x^{2/3})^{3/2}$，$1 + (y')^{2} = x^{-2/3}$，所以 $ds = x^{-1/3} \\, dx$。令 $w = x^{2/3}$，则 $x^{-1/3} \\, dx = \\frac{3}{2} \\, dw$，而 $2\\pi \\cdot \\frac{3}{2}\\int_{0}^{1} (1 - w)^{3/2} \\, dw = 3\\pi \\cdot \\frac{2}{5}$，即 $\\frac{6}{5}\\pi$。\n\n> **注意。** 要保留绝对值。$t$ 超过 $\\frac{\\pi}{2}$ 后 $\\cos t$ 为负，不带绝对值时，上半部分 $0 \\le t \\le \\pi$ 的积分会抵消为 $0$。",
  ],
  (rng) => {
    const a = rng.int(1, 20);
    const kind = rng.pick(["x", "y", "half"] as const);
    const half = kind === "half";
    const quarter = Q.of(6 * a * a, 5);
    const answer = half ? quarter.mul(Q.of(2)) : quarter;
    const A = a === 1 ? "" : `${a}`;
    const axis = kind === "y" ? "y" : "x";
    const top = half ? "\\pi" : "\\frac{\\pi}{2}";
    const [radius, power, u, other] =
      kind === "y" ? ["x", "\\cos^{4}t\\sin t", "\\cos t", "y"] : ["y", "\\sin^{4}t\\cos t", "\\sin t", "x"];
    const [en, zh] = kpi(
      `Find the area of the surface obtained by rotating $x = ${A}\\cos^{3}t, \\; y = ${A}\\sin^{3}t$, $0 \\le t \\le ${top}$, about the $${axis}$-axis.`,
      `求曲线 $x = ${A}\\cos^{3}t, \\; y = ${A}\\sin^{3}t$，$0 \\le t \\le ${top}$，绕 $${axis}$ 轴旋转所得曲面的面积。`,
    );
    const mistakes = half
      ? [
          {
            value: 0,
            why: t(
              "This drops the absolute value of the speed: $\\cos t$ is negative on the second quarter, and an area cannot cancel.",
              "这里丢掉了速率的绝对值：$\\cos t$ 在第二段上为负，而面积不会抵消。",
            ),
          },
          {
            value: quarter,
            why: t(
              "This is the first quarter alone; the second quarter, its mirror image in the $y$-axis, sweeps an equal surface.",
              "这只是第一段；第二段是它关于 $y$ 轴的镜像，扫出的曲面一样大。",
            ),
          },
          {
            value: Q.of(4 * a * a, 5),
            why: t(
              `This takes the speed as $${a === 1 ? "" : a}|\\sin t\\cos t|$; the chain rule on $\\cos^{3}t$ and $\\sin^{3}t$ brings a factor $3$.`,
              `这里把速率当成 $${a === 1 ? "" : a}|\\sin t\\cos t|$；对 $\\cos^{3}t$ 和 $\\sin^{3}t$ 用链式法则会带出因子 $3$。`,
            ),
          },
        ]
      : [
          {
            value: Q.of(3 * a * a, 5),
            why: t(
              "This leaves out the $2$ of $2\\pi$: each point travels a circle of length $2\\pi$ times its radius.",
              "这里漏掉了 $2\\pi$ 中的 $2$：每个点走过的圆周长是 $2\\pi$ 乘以半径。",
            ),
          },
          {
            value: Q.of(2 * a * a, 5),
            why: t(
              `This takes the speed as $${a === 1 ? "" : a}\\sin t\\cos t$; the chain rule on $\\cos^{3}t$ and $\\sin^{3}t$ brings a factor $3$.`,
              `这里把速率当成 $${a === 1 ? "" : a}\\sin t\\cos t$；对 $\\cos^{3}t$ 和 $\\sin^{3}t$ 用链式法则会带出因子 $3$。`,
            ),
          },
          {
            value: Q.of(3 * a * a, 2),
            why: t(
              `This loses the factor $${u}$ of the speed, so the integrand has $${u}$ to the power $3$, not $4$, and integrates to $\\frac{1}{4}$ instead of $\\frac{1}{5}$.`,
              `这里漏掉了速率中的因子 $${u}$，被积式中 $${u}$ 的幂次成了 $3$ 而不是 $4$，积分得 $\\frac{1}{4}$ 而不是 $\\frac{1}{5}$。`,
            ),
          },
        ];
    const substitute =
      kind === "y"
        ? "Let $u = \\cos t$; then $du = -\\sin t \\, dt$ and the limits $0$, $\\frac{\\pi}{2}$ become $1$, $0$:"
        : "Let $u = \\sin t$; then $du = \\cos t \\, dt$ and the limits $0$, $\\frac{\\pi}{2}$ become $0$, $1$:";
    const substituteZh =
      kind === "y"
        ? "令 $u = \\cos t$，则 $du = -\\sin t \\, dt$，积分限 $0$、$\\frac{\\pi}{2}$ 变为 $1$、$0$："
        : "令 $u = \\sin t$，则 $du = \\cos t \\, dt$，积分限 $0$、$\\frac{\\pi}{2}$ 变为 $0$、$1$：";
    const radiusLatex = kind === "y" ? `${A}\\cos^{3}t` : `${A}\\sin^{3}t`;
    return numberProblem({
      prompt: t(en, zh),
      answer,
      mistakes,
      solution: walked(
        [
          [
            ["Find the speed", "求速率"],
            t(
              "Differentiate both coordinates and use $\\cos^{2}t + \\sin^{2}t = 1$:",
              "对两个坐标求导，并用 $\\cos^{2}t + \\sin^{2}t = 1$：",
            ),
            [
              `\\frac{dx}{dt} = -${3 * a}\\cos^{2}t\\sin t, \\quad \\frac{dy}{dt} = ${3 * a}\\sin^{2}t\\cos t`,
              `\\frac{ds}{dt} = ${3 * a}|\\sin t\\cos t|`,
            ],
          ],
          [
            ["Set up the first quarter", "列出第一段"],
            t(
              `The radius is the distance to the $${axis}$-axis, $${radius} = ${radiusLatex}$. On $0 \\le t \\le \\frac{\\pi}{2}$ both $\\sin t$ and $\\cos t$ are positive, so the bars can go:`,
              `半径是到 $${axis}$ 轴的距离 $${radius} = ${radiusLatex}$。在 $0 \\le t \\le \\frac{\\pi}{2}$ 上 $\\sin t$ 和 $\\cos t$ 都为正，所以可以去掉绝对值：`,
            ),
            [
              `S_{1} = 2\\pi\\int_{0}^{\\pi/2} ${radiusLatex} \\cdot ${3 * a}\\sin t\\cos t \\, dt = ${6 * a * a}\\pi\\int_{0}^{\\pi/2} ${power} \\, dt`,
            ],
          ],
          [
            ["Substitute", "换元"],
            t(substitute, substituteZh),
            [`S_{1} = ${6 * a * a}\\pi\\int_{0}^{1} u^{4} \\, du = ${quarter.toLatex()}\\pi`],
          ],
          ...(half
            ? [
                [
                  ["Add the second quarter", "加上第二段"],
                  t(
                    "On $\\frac{\\pi}{2} \\le t \\le \\pi$ the speed is $-\\cos t$ times the positive rest, and this quarter is the mirror image of the first in the $y$-axis, so it sweeps the same area:",
                    "在 $\\frac{\\pi}{2} \\le t \\le \\pi$ 上速率等于 $-\\cos t$ 乘以其余的正因子，这一段是第一段关于 $y$ 轴的镜像，扫出同样的面积：",
                  ),
                  [`S = 2 \\cdot ${quarter.toLatex()}\\pi = ${answer.toLatex()}\\pi`],
                ] as Parameters<typeof walked>[0][number],
              ]
            : []),
        ],
        t(
          `Work in Cartesian form instead. The first quarter is $${radius} = (a^{2/3} - ${other}^{2/3})^{3/2}$ for $0 \\le ${other} \\le a$, with $a = ${a}$. Then\n\n$$1 + \\left(\\frac{d${radius}}{d${other}}\\right)^{2} = \\frac{a^{2/3}}{${other}^{2/3}}$$\n\nSo $ds = a^{1/3}${other}^{-1/3} \\, d${other}$. With $w = ${other}^{2/3}$ we have $${other}^{-1/3} \\, d${other} = \\frac{3}{2} \\, dw$, and\n\n$$S_{1} = 2\\pi a^{1/3} \\cdot \\frac{3}{2}\\int_{0}^{a^{2/3}} (a^{2/3} - w)^{3/2} \\, dw = 3\\pi a^{1/3} \\cdot \\frac{2}{5}a^{5/3} = \\frac{6}{5}\\pi a^{2}$$\n\nWith $a = ${a}$ this is $${quarter.toLatex()}\\pi$${half ? `, and the two mirror-image quarters give $${answer.toLatex()}\\pi$` : ""}.`,
          `改用直角坐标。第一段是 $${radius} = (a^{2/3} - ${other}^{2/3})^{3/2}$，$0 \\le ${other} \\le a$，其中 $a = ${a}$。于是\n\n$$1 + \\left(\\frac{d${radius}}{d${other}}\\right)^{2} = \\frac{a^{2/3}}{${other}^{2/3}}$$\n\n所以 $ds = a^{1/3}${other}^{-1/3} \\, d${other}$。令 $w = ${other}^{2/3}$，则 $${other}^{-1/3} \\, d${other} = \\frac{3}{2} \\, dw$，而\n\n$$S_{1} = 2\\pi a^{1/3} \\cdot \\frac{3}{2}\\int_{0}^{a^{2/3}} (a^{2/3} - w)^{3/2} \\, dw = 3\\pi a^{1/3} \\cdot \\frac{2}{5}a^{5/3} = \\frac{6}{5}\\pi a^{2}$$\n\n当 $a = ${a}$ 时它等于 $${quarter.toLatex()}\\pi$${half ? `，两段互为镜像，合计 $${answer.toLatex()}\\pi$` : ""}。`,
        ),
      ),
    });
  },
);

const netDisplacementVector = point(
  "the-size-of-a-displacement-vector",
  ["The size of a displacement vector", "位移向量的大小"],
  [
    "Integrating a velocity vector gives the displacement vector, component by component, and the distance between the start and end is its length. Do not confuse this with the speed at the final time, or add the absolute values of the components.",
    "对速度向量逐分量积分得到位移向量，起点与终点之间的距离就是它的长度。不要把它与终点时刻的速率混淆，也不要把各分量的绝对值相加。",
  ],
  (rng) => {
    const [p0, q0, h] = rng.pick(triples);
    const p = rng.bool() ? p0 : -p0;
    const q = rng.bool() ? q0 : -q0;
    const T = rng.int(1, 8);
    const answer = h * T * T;
    const v = `\\left\\langle ${2 * p}t, ${2 * q}t \\right\\rangle`;
    return ask(
      [
        `A particle has velocity $\\mathbf{v}(t) = ${v}$. How far is it at $t = ${T}$ from its position at $t = 0$?`,
        `质点的速度是 $\\mathbf{v}(t) = ${v}$。$t = ${T}$ 时它离 $t = 0$ 时的位置有多远？`,
      ],
      answer,
      [2 * h * T, (p0 + q0) * T * T, h * T],
      [
        `The displacement is $\\int_{0}^{${T}} \\mathbf{v} \\, dt = \\left\\langle ${p * T * T}, ${q * T * T} \\right\\rangle$, and its length is $\\sqrt{${(p * T * T) ** 2} + ${(q * T * T) ** 2}} = ${answer}$.`,
        `位移是 $\\int_{0}^{${T}} \\mathbf{v} \\, dt = \\left\\langle ${p * T * T}, ${q * T * T} \\right\\rangle$，它的长度是 $\\sqrt{${(p * T * T) ** 2} + ${(q * T * T) ** 2}} = ${answer}$。`,
      ],
    );
  },
);

const speedFromDot = {
  ...point(
    "speed-changes-from-the-dot-product",
    ["Speed changes from the dot product", "由点积判断速率变化"],
    [
      "The rate of change of speed has the sign of $\\mathbf{v} \\cdot \\mathbf{a}$. A positive dot product means speeding up, a negative one means slowing down, and at zero the acceleration is perpendicular to the velocity, so it only turns the particle at that moment.",
      "速率变化率的符号与 $\\mathbf{v} \\cdot \\mathbf{a}$ 相同。点积为正表示加速，为负表示减速；点积为零时，加速度与速度垂直，此刻只使质点转向。",
    ],
    (rng) => {
      const A = nz(rng, 4);
      const B = nz(rng, 6);
      const C = nz(rng, 4);
      const D = nz(rng, 6);
      const T = rng.int(1, 4);
      const vx = 2 * A * T + B;
      const vy = 2 * C * T + D;
      const ax = 2 * A;
      const ay = 2 * C;
      const dot = vx * ax + vy * ay;
      const r = `\\left\\langle ${poly([A, "t^{2}"], [B, "t"])}, ${poly([C, "t^{2}"], [D, "t"])} \\right\\rangle`;
      const up: Pair = [`It is speeding up`, `它在加速`];
      const down: Pair = [`It is slowing down`, `它在减速`];
      const still: Pair = [`Its speed is momentarily not changing`, `它的速率此刻没有变化`];
      const allOf = [up, down, still];
      const correct = dot > 0 ? up : dot < 0 ? down : still;
      return choose(
        rng,
        [
          `A particle has position $\\mathbf{r}(t) = ${r}$. What is happening to its speed at $t = ${T}$?`,
          `质点的位置是 $\\mathbf{r}(t) = ${r}$。在 $t = ${T}$ 时它的速率如何变化？`,
        ],
        correct,
        allOf.filter((o) => o !== correct),
        [
          `$\\mathbf{v}(${T}) = \\left\\langle ${vx}, ${vy} \\right\\rangle$ and $\\mathbf{a} = \\left\\langle ${ax}, ${ay} \\right\\rangle$, so $\\mathbf{v} \\cdot \\mathbf{a} = ${dot}$. ${dot > 0 ? "This is positive, so the speed is increasing." : dot < 0 ? "This is negative, so the speed is decreasing." : "This is zero, so the acceleration is perpendicular to the velocity and the speed is not changing at this moment."}`,
          `$\\mathbf{v}(${T}) = \\left\\langle ${vx}, ${vy} \\right\\rangle$，$\\mathbf{a} = \\left\\langle ${ax}, ${ay} \\right\\rangle$，所以 $\\mathbf{v} \\cdot \\mathbf{a} = ${dot}$。${dot > 0 ? "它是正的，所以速率在增大。" : dot < 0 ? "它是负的，所以速率在减小。" : "它是零，所以加速度与速度垂直，此刻速率没有变化。"}`,
        ],
      );
    },
  ),
  figure: calculusDrawings5["calculating-acceleration-for-plane-motion-using-differentiation#speed-changes-from-the-dot-product"],
};

const slopeFromValues = point(
  "the-slope-from-values-of-r-and-its-derivative",
  ["The slope from values of r and its derivative", "由 r 及其导数的值求斜率"],
  [
    "With $x = r\\cos\\theta$ and $y = r\\sin\\theta$, the product rule gives the slope of a polar curve:\n\n$$\\frac{dy}{dx} = \\frac{r'\\sin\\theta + r\\cos\\theta}{r'\\cos\\theta - r\\sin\\theta}$$\n\nOn the axes one of $\\sin\\theta$, $\\cos\\theta$ is zero, so the slope is $\\frac{r}{r'}$ at $\\theta = 0$ and $\\theta = \\pi$, and $-\\frac{r'}{r}$ at $\\theta = \\frac{\\pi}{2}$ and $\\theta = \\frac{3\\pi}{2}$. For example, if $r = 3$ and $r' = 2$ at $\\theta = \\frac{\\pi}{2}$, then $\\frac{dx}{d\\theta} = -3$ and $\\frac{dy}{d\\theta} = 2$, so the slope is $-\\frac{2}{3}$.\n\nCheck: the angle $\\psi$ from the radius to the tangent has $\\tan\\psi = \\frac{r}{r'} = \\frac{3}{2}$, and the tangent points at angle $\\frac{\\pi}{2} + \\psi$, whose tangent is $-\\cot\\psi = -\\frac{2}{3}$.\n\n> **Watch out.** The value of $r'$ alone is not the slope: here $r' = 2$ but the slope is $-\\frac{2}{3}$. The derivative $r'$ measures how fast the distance from the pole changes.",
    "由 $x = r\\cos\\theta$、$y = r\\sin\\theta$ 和乘积法则，得极坐标曲线的斜率：\n\n$$\\frac{dy}{dx} = \\frac{r'\\sin\\theta + r\\cos\\theta}{r'\\cos\\theta - r\\sin\\theta}$$\n\n在坐标轴上 $\\sin\\theta$、$\\cos\\theta$ 中有一个为零，所以在 $\\theta = 0$ 和 $\\theta = \\pi$ 处斜率是 $\\frac{r}{r'}$，在 $\\theta = \\frac{\\pi}{2}$ 和 $\\theta = \\frac{3\\pi}{2}$ 处斜率是 $-\\frac{r'}{r}$。例如，若在 $\\theta = \\frac{\\pi}{2}$ 处 $r = 3$，$r' = 2$，则 $\\frac{dx}{d\\theta} = -3$，$\\frac{dy}{d\\theta} = 2$，所以斜率是 $-\\frac{2}{3}$。\n\n检验：从半径到切线的角 $\\psi$ 满足 $\\tan\\psi = \\frac{r}{r'} = \\frac{3}{2}$，切线方向的角是 $\\frac{\\pi}{2} + \\psi$，它的正切是 $-\\cot\\psi = -\\frac{2}{3}$。\n\n> **注意。** 单独的 $r'$ 不是斜率：这里 $r' = 2$，斜率却是 $-\\frac{2}{3}$。导数 $r'$ 度量的是到极点距离变化的快慢。",
  ],
  (rng) => {
    const turn = rng.pick(quarterTurns);
    const r = nz(rng, 9);
    const d = nz(rng, 9);
    const answer = turn.swap ? Q.of(-d, r) : Q.of(r, d);
    /** rates gives cos and sin at the angle, then dx/dθ and dy/dθ in terms of r and r'. */
    const rates = {
      "0": { cos: "1", sin: "0", x: "r'", y: "r", vx: d, vy: r, turned: "" },
      "\\frac{\\pi}{2}": { cos: "0", sin: "1", x: "-r", y: "r'", vx: -r, vy: d, turned: "\\frac{\\pi}{2} + " },
      "\\pi": { cos: "-1", sin: "0", x: "-r'", y: "-r", vx: -d, vy: -r, turned: "\\pi + " },
      "\\frac{3\\pi}{2}": { cos: "0", sin: "-1", x: "r", y: "-r'", vx: r, vy: -d, turned: "\\frac{3\\pi}{2} + " },
    }[turn.at];
    const rule = turn.swap ? "-\\frac{r'}{r}" : "\\frac{r}{r'}";
    const tanPsi = Q.of(r, d);
    const read = turn.swap
      ? t(
          `The tangent points at angle $${rates.turned}\\psi$, and $\\tan\\left(${rates.turned}\\psi\\right) = -\\cot\\psi = ${answer.toLatex()}$.`,
          `切线方向的角是 $${rates.turned}\\psi$，而 $\\tan\\left(${rates.turned}\\psi\\right) = -\\cot\\psi = ${answer.toLatex()}$。`,
        )
      : t(
          `The tangent points at angle $${rates.turned}\\psi$, and ${turn.at === "0" ? "its tangent is" : "since tangent has period $\\pi$, its tangent is"} $\\tan\\psi = ${answer.toLatex()}$.`,
          `切线方向的角是 $${rates.turned}\\psi$，${turn.at === "0" ? "它的正切是" : "由于正切的周期是 $\\pi$，它的正切是"} $\\tan\\psi = ${answer.toLatex()}$。`,
        );
    return numberProblem({
      prompt: t(
        `A polar curve $r = f(\\theta)$ has $f\\left(${turn.at}\\right) = ${r}$ and $f'\\left(${turn.at}\\right) = ${d}$. Find the slope $\\frac{dy}{dx}$ of the curve at $\\theta = ${turn.at}$.`,
        `极坐标曲线 $r = f(\\theta)$ 满足 $f\\left(${turn.at}\\right) = ${r}$，$f'\\left(${turn.at}\\right) = ${d}$。求曲线在 $\\theta = ${turn.at}$ 处的斜率 $\\frac{dy}{dx}$。`,
      ),
      answer,
      mistakes: [
        {
          value: d,
          why: t(
            "This takes $r'$ as the slope; $r'$ is the rate of change of the distance from the pole, not of $y$ with respect to $x$.",
            "这里把 $r'$ 当成了斜率；$r'$ 是到极点距离的变化率，不是 $y$ 对 $x$ 的变化率。",
          ),
        },
        {
          value: turn.swap ? Q.of(r, d) : Q.of(-d, r),
          why: t(
            `This uses the rule for the other pair of axis angles; at $\\theta = ${turn.at}$, $\\cos\\theta = ${rates.cos}$ and $\\sin\\theta = ${rates.sin}$, which give $${rule}$.`,
            `这里用了另一对坐标轴角度的规则；在 $\\theta = ${turn.at}$ 处 $\\cos\\theta = ${rates.cos}$，$\\sin\\theta = ${rates.sin}$，给出的是 $${rule}$。`,
          ),
        },
        {
          value: answer.neg(),
          why: t(
            "The sign is wrong: the derivative of $x = r\\cos\\theta$ is $r'\\cos\\theta - r\\sin\\theta$, with a minus sign.",
            "符号错了：$x = r\\cos\\theta$ 的导数是 $r'\\cos\\theta - r\\sin\\theta$，中间是减号。",
          ),
        },
      ],
      solution: walked(
        [
          [
            ["Write the rates", "写出变化率"],
            t(
              "Differentiate $x = r\\cos\\theta$ and $y = r\\sin\\theta$ by the product rule:",
              "用乘积法则对 $x = r\\cos\\theta$ 和 $y = r\\sin\\theta$ 求导：",
            ),
            ["\\frac{dx}{d\\theta} = r'\\cos\\theta - r\\sin\\theta, \\quad \\frac{dy}{d\\theta} = r'\\sin\\theta + r\\cos\\theta"],
          ],
          [
            ["Put in the angle", "代入角度"],
            t(
              `At $\\theta = ${turn.at}$, $\\cos\\theta = ${rates.cos}$ and $\\sin\\theta = ${rates.sin}$, with $r = ${r}$ and $r' = ${d}$:`,
              `在 $\\theta = ${turn.at}$ 处 $\\cos\\theta = ${rates.cos}$，$\\sin\\theta = ${rates.sin}$，且 $r = ${r}$，$r' = ${d}$：`,
            ),
            [`\\frac{dx}{d\\theta} = ${rates.x} = ${rates.vx}, \\quad \\frac{dy}{d\\theta} = ${rates.y} = ${rates.vy}`],
          ],
          [
            ["Divide", "相除"],
            t("The slope is the quotient of the two rates:", "斜率是两个变化率之商："),
            [`\\frac{dy}{dx} = ${rule} = ${answer.toLatex()}`],
          ],
        ],
        t(
          `Use the angle $\\psi$ from the radius to the tangent, which has $\\tan\\psi = \\frac{r}{r'} = ${tanPsi.toLatex()}$. ${read.en}`,
          `用从半径到切线的角 $\\psi$，它满足 $\\tan\\psi = \\frac{r}{r'} = ${tanPsi.toLatex()}$。${read["zh-CN"]}`,
        ),
      ),
    });
  },
);

/** diagonalTurns are the odd multiples of a quarter of pi, marked by whether r' and r combine as a quotient with the sum on top. */
const diagonalTurns = [
  { at: "\\frac{\\pi}{4}", sumOnTop: true },
  { at: "\\frac{3\\pi}{4}", sumOnTop: false },
  { at: "\\frac{5\\pi}{4}", sumOnTop: true },
  { at: "\\frac{7\\pi}{4}", sumOnTop: false },
] as const;

const diagonalSlopeFromValues = point(
  "diagonal-slopes-from-values-of-r-and-its-derivative",
  ["Diagonal slopes from values of r and its derivative", "由 r 及其导数的值求对角方向的斜率"],
  [
    "At odd multiples of $\\frac{\\pi}{4}$ the sine and cosine have equal size $\\frac{\\sqrt{2}}{2}$, so that factor cancels from the slope formula and the slope is a quotient of $r$ and $r'$. At $\\theta = \\frac{\\pi}{4}$ both are positive:\n\n$$\\frac{dy}{dx} = \\frac{r'\\sin\\theta + r\\cos\\theta}{r'\\cos\\theta - r\\sin\\theta} = \\frac{r' + r}{r' - r}$$\n\nFor example, $r = 3$ and $r' = 1$ there give the slope $\\frac{1 + 3}{1 - 3} = -2$. Whether the sum or the difference is on top depends on the signs of $\\sin\\theta$ and $\\cos\\theta$ in that quadrant.\n\nCheck: the angle $\\psi$ from the radius to the tangent has $\\tan\\psi = \\frac{r}{r'} = 3$, and the tangent points at angle $\\frac{\\pi}{4} + \\psi$. By the addition formula, $\\tan\\left(\\frac{\\pi}{4} + \\psi\\right) = \\frac{1 + 3}{1 - 3} = -2$.\n\n> **Watch out.** At $\\theta = \\frac{3\\pi}{4}$ the cosine is negative, and the slope is $\\frac{r - r'}{r + r'}$. Using the formula for $\\frac{\\pi}{4}$ there gives a wrong slope.",
    "在 $\\frac{\\pi}{4}$ 的奇数倍处，正弦和余弦大小都是 $\\frac{\\sqrt{2}}{2}$，所以这个因子在斜率公式中约去，斜率是 $r$ 与 $r'$ 的商式。在 $\\theta = \\frac{\\pi}{4}$ 处二者都为正：\n\n$$\\frac{dy}{dx} = \\frac{r'\\sin\\theta + r\\cos\\theta}{r'\\cos\\theta - r\\sin\\theta} = \\frac{r' + r}{r' - r}$$\n\n例如，那里 $r = 3$，$r' = 1$，斜率是 $\\frac{1 + 3}{1 - 3} = -2$。分子是和还是差，取决于该象限中 $\\sin\\theta$ 和 $\\cos\\theta$ 的符号。\n\n检验：从半径到切线的角 $\\psi$ 满足 $\\tan\\psi = \\frac{r}{r'} = 3$，切线方向的角是 $\\frac{\\pi}{4} + \\psi$。由和角公式，$\\tan\\left(\\frac{\\pi}{4} + \\psi\\right) = \\frac{1 + 3}{1 - 3} = -2$。\n\n> **注意。** 在 $\\theta = \\frac{3\\pi}{4}$ 处余弦为负，斜率是 $\\frac{r - r'}{r + r'}$。在那里套用 $\\frac{\\pi}{4}$ 的公式会得到错误的斜率。",
  ],
  (rng) => {
    const turn = rng.pick(diagonalTurns);
    const r = rng.int(1, 9) * rng.pick([-1, 1]);
    const options = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== Math.abs(r));
    const d = rng.pick(options) * rng.pick([-1, 1]);
    const answer = turn.sumOnTop ? Q.of(d + r, d - r) : Q.of(r - d, r + d);
    const other = turn.sumOnTop ? Q.of(r - d, r + d) : Q.of(d + r, d - r);
    /** signs gives the signs of cos and sin at the angle, the tangent of the angle, and how the factor cancels. */
    const signs = {
      "\\frac{\\pi}{4}": { cos: "", sin: "", tan: "1" },
      "\\frac{3\\pi}{4}": { cos: "-", sin: "", tan: "-1" },
      "\\frac{5\\pi}{4}": { cos: "-", sin: "-", tan: "1" },
      "\\frac{7\\pi}{4}": { cos: "", sin: "-", tan: "-1" },
    }[turn.at];
    const half = "\\frac{\\sqrt{2}}{2}";
    const symbolic = turn.sumOnTop ? "\\frac{r' + r}{r' - r}" : "\\frac{r - r'}{r + r'}";
    const [top, bottom] = turn.sumOnTop ? [d + r, d - r] : [r - d, r + d];
    const [topSay, bottomSay] = turn.sumOnTop ? ["r' + r", "r' - r"] : ["r - r'", "r + r'"];
    const tanPsi = Q.of(r, d);
    const addition = turn.sumOnTop ? "\\frac{1 + \\tan\\psi}{1 - \\tan\\psi}" : "\\frac{-1 + \\tan\\psi}{1 + \\tan\\psi}";
    return numberProblem({
      prompt: t(
        `A polar curve $r = f(\\theta)$ has $f\\left(${turn.at}\\right) = ${r}$ and $f'\\left(${turn.at}\\right) = ${d}$. Find the slope $\\frac{dy}{dx}$ of the curve at $\\theta = ${turn.at}$.`,
        `极坐标曲线 $r = f(\\theta)$ 满足 $f\\left(${turn.at}\\right) = ${r}$，$f'\\left(${turn.at}\\right) = ${d}$。求曲线在 $\\theta = ${turn.at}$ 处的斜率 $\\frac{dy}{dx}$。`,
      ),
      answer,
      mistakes: [
        {
          value: other,
          why: t(
            `This is the quotient for the neighbouring quadrant; at $\\theta = ${turn.at}$, $\\cos\\theta = ${signs.cos}${half}$ and $\\sin\\theta = ${signs.sin}${half}$, which give $${symbolic}$.`,
            `这是相邻象限的商式；在 $\\theta = ${turn.at}$ 处 $\\cos\\theta = ${signs.cos}${half}$，$\\sin\\theta = ${signs.sin}${half}$，给出的是 $${symbolic}$。`,
          ),
        },
        {
          value: answer.neg(),
          why: t(
            "The sign is wrong: the derivative of $x = r\\cos\\theta$ is $r'\\cos\\theta - r\\sin\\theta$, with a minus sign.",
            "符号错了：$x = r\\cos\\theta$ 的导数是 $r'\\cos\\theta - r\\sin\\theta$，中间是减号。",
          ),
        },
        {
          value: d,
          why: t(
            "This takes $r'$ as the slope; $r'$ is the rate of change of the distance from the pole, not of $y$ with respect to $x$.",
            "这里把 $r'$ 当成了斜率；$r'$ 是到极点距离的变化率，不是 $y$ 对 $x$ 的变化率。",
          ),
        },
      ],
      solution: walked(
        [
          [
            ["Write the slope formula", "写出斜率公式"],
            t(
              "Differentiate $x = r\\cos\\theta$ and $y = r\\sin\\theta$ by the product rule and divide:",
              "用乘积法则对 $x = r\\cos\\theta$ 和 $y = r\\sin\\theta$ 求导再相除：",
            ),
            ["\\frac{dy}{dx} = \\frac{r'\\sin\\theta + r\\cos\\theta}{r'\\cos\\theta - r\\sin\\theta}"],
          ],
          [
            ["Cancel the common factor", "约去公因子"],
            t(
              `At $\\theta = ${turn.at}$, $\\cos\\theta = ${signs.cos}${half}$ and $\\sin\\theta = ${signs.sin}${half}$. The factor $${half}$ cancels and only the signs remain:`,
              `在 $\\theta = ${turn.at}$ 处 $\\cos\\theta = ${signs.cos}${half}$，$\\sin\\theta = ${signs.sin}${half}$。因子 $${half}$ 约去，只留下符号：`,
            ),
            [`\\frac{dy}{dx} = ${symbolic}`],
          ],
          [
            ["Put in the values", "代入数值"],
            t(
              `With $r = ${r}$ and $r' = ${d}$, the top is $${topSay} = ${top}$ and the bottom is $${bottomSay} = ${bottom}$:`,
              `由 $r = ${r}$，$r' = ${d}$，分子 $${topSay} = ${top}$，分母 $${bottomSay} = ${bottom}$：`,
            ),
            [`\\frac{dy}{dx} = ${answer.toLatex()}`],
          ],
        ],
        t(
          `Use the angle $\\psi$ from the radius to the tangent, which has $\\tan\\psi = \\frac{r}{r'} = ${tanPsi.toLatex()}$. The tangent points at angle $${turn.at} + \\psi$, and $\\tan ${turn.at} = ${signs.tan}$, so the addition formula gives\n\n$$\\tan\\left(${turn.at} + \\psi\\right) = ${addition} = ${answer.toLatex()}$$\n\nThis agrees with the slope found above.`,
          `用从半径到切线的角 $\\psi$，它满足 $\\tan\\psi = \\frac{r}{r'} = ${tanPsi.toLatex()}$。切线方向的角是 $${turn.at} + \\psi$，而 $\\tan ${turn.at} = ${signs.tan}$，所以由和角公式\n\n$$\\tan\\left(${turn.at} + \\psi\\right) = ${addition} = ${answer.toLatex()}$$\n\n这与上面求得的斜率一致。`,
        ),
      ),
    });
  },
);

/** zeroDerivativeTurns are the angles at which a polar curve with r' = 0 is examined, with the tangent type there. */
const zeroDerivativeTurns = [
  { at: "0", kind: "vertical" },
  { at: "\\pi", kind: "vertical" },
  { at: "\\frac{\\pi}{2}", kind: "horizontal" },
  { at: "\\frac{3\\pi}{2}", kind: "horizontal" },
  { at: "\\frac{\\pi}{4}", kind: "slanted" },
  { at: "\\frac{3\\pi}{4}", kind: "slanted" },
] as const;

const zeroRadialDerivative = {
  ...point(
    "dr-zero-does-not-mean-a-horizontal-tangent",
    ["A zero of dr does not mean a horizontal tangent", "dr 为零并不意味着水平切线"],
    [
      "Where $r' = 0$ and $r \\ne 0$, the curve is momentarily at a constant distance from the pole, so the tangent is perpendicular to the radius. The rates of $x = r\\cos\\theta$ and $y = r\\sin\\theta$ lose their $r'$ terms:\n\n$$\\frac{dx}{d\\theta} = -r\\sin\\theta, \\qquad \\frac{dy}{d\\theta} = r\\cos\\theta$$\n\nSo the tangent is vertical on the $x$-axis, horizontal on the $y$-axis, and slanted in between. For example, if $r = 3$ and $r' = 0$ at $\\theta = \\frac{\\pi}{4}$, the rates are $-\\frac{3\\sqrt{2}}{2}$ and $\\frac{3\\sqrt{2}}{2}$, so the slope is $-1$.\n\nCheck: the radius at $\\theta = \\frac{\\pi}{4}$ has slope $\\tan\\frac{\\pi}{4} = 1$, and $1 \\cdot (-1) = -1$, so the tangent is indeed perpendicular to the radius.\n\n> **Watch out.** $r' = 0$ does not make $\\frac{dy}{d\\theta}$ zero. The tangent is horizontal only where $\\cos\\theta = 0$ as well.",
      "当 $r' = 0$ 且 $r \\ne 0$ 时，曲线此刻到极点的距离不变，所以切线垂直于半径。$x = r\\cos\\theta$ 和 $y = r\\sin\\theta$ 的变化率中含 $r'$ 的项消失：\n\n$$\\frac{dx}{d\\theta} = -r\\sin\\theta, \\qquad \\frac{dy}{d\\theta} = r\\cos\\theta$$\n\n所以切线在 $x$ 轴上竖直，在 $y$ 轴上水平，在其他方向倾斜。例如，若在 $\\theta = \\frac{\\pi}{4}$ 处 $r = 3$，$r' = 0$，两个变化率分别是 $-\\frac{3\\sqrt{2}}{2}$ 和 $\\frac{3\\sqrt{2}}{2}$，所以斜率是 $-1$。\n\n检验：$\\theta = \\frac{\\pi}{4}$ 处半径的斜率是 $\\tan\\frac{\\pi}{4} = 1$，而 $1 \\cdot (-1) = -1$，所以切线确实垂直于半径。\n\n> **注意。** $r' = 0$ 并不使 $\\frac{dy}{d\\theta}$ 为零。只有同时 $\\cos\\theta = 0$ 时切线才水平。",
    ],
    (rng) => {
      const turn = rng.pick(zeroDerivativeTurns);
      const r = nz(rng, 12);
      /** at gives sin and cos at the angle as multiples of 1 or of the square root of 2 over 2, and the direction of the radius. */
      const at = {
        "0": { s: 0, c: 1, root: false, radius: "along the $x$-axis", radiusZh: "沿 $x$ 轴" },
        "\\pi": { s: 0, c: -1, root: false, radius: "along the $x$-axis", radiusZh: "沿 $x$ 轴" },
        "\\frac{\\pi}{2}": { s: 1, c: 0, root: false, radius: "along the $y$-axis", radiusZh: "沿 $y$ 轴" },
        "\\frac{3\\pi}{2}": { s: -1, c: 0, root: false, radius: "along the $y$-axis", radiusZh: "沿 $y$ 轴" },
        "\\frac{\\pi}{4}": {
          s: 1,
          c: 1,
          root: true,
          radius: "along the line $y = x$, of slope $1$",
          radiusZh: "沿直线 $y = x$，斜率为 $1$",
        },
        "\\frac{3\\pi}{4}": {
          s: 1,
          c: -1,
          root: true,
          radius: "along the line $y = -x$, of slope $-1$",
          radiusZh: "沿直线 $y = -x$，斜率为 $-1$",
        },
      }[turn.at];
      /** value writes n, or n times the square root of 2 over 2 at a diagonal angle, in lowest terms. */
      const value = (n: number) => {
        if (n === 0 || !at.root) return `${n === 0 ? 0 : n}`;
        const sign = n < 0 ? "-" : "";
        const m = Math.abs(n);
        if (m % 2 === 0) return `${sign}${m === 2 ? "" : m / 2}\\sqrt{2}`;
        return `${sign}\\frac{${m === 1 ? "" : m}\\sqrt{2}}{2}`;
      };
      const trig = (n: number) => (at.root ? value(n) : `${n}`);
      const vx = value(-r * at.s);
      const vy = value(r * at.c);
      const horizontal: Pair = ["Horizontal", "水平"];
      const vertical: Pair = ["Vertical", "竖直"];
      const slanted: Pair = ["Neither horizontal nor vertical", "既不水平也不竖直"];
      const none: Pair = ["There is no tangent, because $r'$ is zero", "没有切线，因为 $r'$ 为零"];
      const correct = turn.kind === "horizontal" ? horizontal : turn.kind === "vertical" ? vertical : slanted;
      const slope = -at.c * at.s;
      const read: Pair =
        turn.kind === "horizontal"
          ? [
              "$\\frac{dy}{d\\theta} = 0$ while $\\frac{dx}{d\\theta} \\ne 0$, so the tangent is horizontal.",
              "$\\frac{dy}{d\\theta} = 0$ 而 $\\frac{dx}{d\\theta} \\ne 0$，所以切线水平。",
            ]
          : turn.kind === "vertical"
            ? [
                "$\\frac{dx}{d\\theta} = 0$ while $\\frac{dy}{d\\theta} \\ne 0$, so the tangent is vertical.",
                "$\\frac{dx}{d\\theta} = 0$ 而 $\\frac{dy}{d\\theta} \\ne 0$，所以切线竖直。",
              ]
            : [
                `Neither rate is zero, and their quotient is the slope $${slope}$, so the tangent is slanted.`,
                `两个变化率都不为零，它们的商是斜率 $${slope}$，所以切线是倾斜的。`,
              ];
      const perpendicular: Pair =
        turn.kind === "horizontal"
          ? ["A line perpendicular to the $y$-axis is horizontal.", "垂直于 $y$ 轴的直线是水平的。"]
          : turn.kind === "vertical"
            ? ["A line perpendicular to the $x$-axis is vertical.", "垂直于 $x$ 轴的直线是竖直的。"]
            : [
                `A line perpendicular to it has slope $${slope}$, neither horizontal nor vertical.`,
                `与它垂直的直线斜率为 $${slope}$，既不水平也不竖直。`,
              ];
      const solution = walked(
        [
          [
            ["Drop the r' terms", "去掉含 r' 的项"],
            t("With $r' = 0$, the product rule leaves only the terms with $r$:", "当 $r' = 0$ 时，乘积法则只留下含 $r$ 的项："),
            ["\\frac{dx}{d\\theta} = -r\\sin\\theta, \\quad \\frac{dy}{d\\theta} = r\\cos\\theta"],
          ],
          [
            ["Put in the angle", "代入角度"],
            t(
              `At $\\theta = ${turn.at}$, $\\sin\\theta = ${trig(at.s)}$ and $\\cos\\theta = ${trig(at.c)}$, with $r = ${r}$:`,
              `在 $\\theta = ${turn.at}$ 处 $\\sin\\theta = ${trig(at.s)}$，$\\cos\\theta = ${trig(at.c)}$，且 $r = ${r}$：`,
            ),
            [`\\frac{dx}{d\\theta} = ${vx}, \\quad \\frac{dy}{d\\theta} = ${vy}`],
          ],
          [["Read the tangent", "判断切线"], t(...read)],
        ],
        t(
          `Since $r' = 0$, the tangent is perpendicular to the radius. At $\\theta = ${turn.at}$ the radius lies ${at.radius}. ${perpendicular[0]}`,
          `因为 $r' = 0$，切线垂直于半径。在 $\\theta = ${turn.at}$ 处半径${at.radiusZh}。${perpendicular[1]}`,
        ),
      );
      return reasoned(
        choose(
          rng,
          [
            `A polar curve $r = f(\\theta)$ has $f\\left(${turn.at}\\right) = ${r}$ and $f'\\left(${turn.at}\\right) = 0$. What is the tangent line to the curve at $\\theta = ${turn.at}$ like?`,
            `极坐标曲线 $r = f(\\theta)$ 满足 $f\\left(${turn.at}\\right) = ${r}$，$f'\\left(${turn.at}\\right) = 0$。曲线在 $\\theta = ${turn.at}$ 处的切线是怎样的？`,
          ],
          correct,
          [horizontal, vertical, slanted, none].filter((o) => o !== correct),
          [solution.en, solution["zh-CN"]],
        ),
        [
          [
            horizontal[0],
            "Here $\\cos\\theta \\ne 0$, so $\\frac{dy}{d\\theta} = r\\cos\\theta$ is not zero; $r' = 0$ alone does not make the tangent horizontal.",
            "这里 $\\cos\\theta \\ne 0$，所以 $\\frac{dy}{d\\theta} = r\\cos\\theta$ 不为零；仅凭 $r' = 0$ 不能使切线水平。",
          ],
          [
            vertical[0],
            "Here $\\sin\\theta \\ne 0$, so $\\frac{dx}{d\\theta} = -r\\sin\\theta$ is not zero and the tangent is not vertical.",
            "这里 $\\sin\\theta \\ne 0$，所以 $\\frac{dx}{d\\theta} = -r\\sin\\theta$ 不为零，切线不竖直。",
          ],
          [
            slanted[0],
            "On an axis one of $\\sin\\theta$ and $\\cos\\theta$ is zero, so one of the two rates vanishes and the tangent is horizontal or vertical.",
            "在坐标轴上 $\\sin\\theta$ 和 $\\cos\\theta$ 中有一个为零，所以两个变化率中有一个为零，切线水平或竖直。",
          ],
          [
            none[0],
            "Since $r \\ne 0$, the rates $-r\\sin\\theta$ and $r\\cos\\theta$ are not both zero, so there is a tangent; $r' = 0$ only means the distance from the pole is momentarily constant.",
            "因为 $r \\ne 0$，变化率 $-r\\sin\\theta$ 和 $r\\cos\\theta$ 不会同时为零，所以有切线；$r' = 0$ 只说明到极点的距离此刻不变。",
          ],
        ],
      );
    },
  ),
  figure: calculusDrawings5["horizontal-and-vertical-tangents-to-polar-curves#dr-zero-does-not-mean-a-horizontal-tangent"],
};

const roseTangentsAtPole = {
  ...point(
    "counting-the-tangent-lines-at-the-pole",
    ["Counting the tangent lines at the pole", "数极点处的切线"],
    [
      "A polar curve passing through the pole at $\\theta = \\alpha$, with $r' \\ne 0$ there, has the tangent line $\\theta = \\alpha$. For a rose $r = a\\cos n\\theta$ the zeros of $r$ are\n\n$$\\theta = \\frac{(2k + 1)\\pi}{2n}, \\qquad k = 0, 1, \\ldots, n - 1$$\n\nin $[0, \\pi)$, and angles $\\pi$ further on give the same lines. For example, $r = 2\\cos 2\\theta$ has four petals but meets the pole only along $\\theta = \\frac{\\pi}{4}$ and $\\theta = \\frac{3\\pi}{4}$: two tangent lines, $y = x$ and $y = -x$.\n\nCheck: over a whole turn $\\cos 2\\theta = 0$ at $\\frac{\\pi}{4}$, $\\frac{3\\pi}{4}$, $\\frac{5\\pi}{4}$ and $\\frac{7\\pi}{4}$. These are four rays out of the pole, and opposite rays make up one line, so there are $4 \\div 2 = 2$ lines.\n\n> **Watch out.** Count lines, not petals. When $n$ is even the rose has $2n$ petals but still only $n$ tangent lines at the pole.",
      "极坐标曲线在 $\\theta = \\alpha$ 处经过极点且那里 $r' \\ne 0$ 时，切线是 $\\theta = \\alpha$。对玫瑰线 $r = a\\cos n\\theta$，$r$ 在 $[0, \\pi)$ 中的零点是\n\n$$\\theta = \\frac{(2k + 1)\\pi}{2n}, \\qquad k = 0, 1, \\ldots, n - 1$$\n\n再加 $\\pi$ 的角给出同样的直线。例如，$r = 2\\cos 2\\theta$ 有四片花瓣，却只沿 $\\theta = \\frac{\\pi}{4}$ 和 $\\theta = \\frac{3\\pi}{4}$ 经过极点：两条切线 $y = x$ 和 $y = -x$。\n\n检验：在一整圈上，$\\cos 2\\theta = 0$ 的角是 $\\frac{\\pi}{4}$、$\\frac{3\\pi}{4}$、$\\frac{5\\pi}{4}$ 和 $\\frac{7\\pi}{4}$。它们是从极点出发的四条射线，相反的两条射线组成一条直线，所以有 $4 \\div 2 = 2$ 条直线。\n\n> **注意。** 数的是直线，不是花瓣。$n$ 为偶数时玫瑰线有 $2n$ 片花瓣，但在极点处仍然只有 $n$ 条切线。",
    ],
    (rng) => {
      const n = rng.int(2, 9);
      const a = rng.int(1, 9);
      const fn = rng.pick(["\\cos", "\\sin"] as const);
      const eq = `r = ${a === 1 ? "" : a}${fn} ${n}\\theta`;
      const ks = n <= 4 ? [...Array(n).keys()].join(", ") : `0, 1, \\ldots, ${n - 1}`;
      const zeros = fn === "\\cos" ? `\\theta = \\frac{(2k + 1)\\pi}{${2 * n}}` : `\\theta = \\frac{k\\pi}{${n}}`;
      const petals = n % 2 === 0 ? 2 * n : n;
      return numberProblem({
        prompt: t(`How many different lines are tangent to the rose $${eq}$ at the pole?`, `玫瑰线 $${eq}$ 在极点处有多少条不同的切线？`),
        answer: n,
        form: "integer",
        mistakes: [
          {
            value: 2 * n,
            why: t(
              `This counts the $${2 * n}$ rays along which the rose leaves the pole${n % 2 === 0 ? ", which is also the number of petals" : ""}; two opposite rays lie on one line.`,
              `这数的是玫瑰线离开极点的 $${2 * n}$ 条射线${n % 2 === 0 ? "，也就是花瓣数" : ""}；相反的两条射线在同一条直线上。`,
            ),
          },
          {
            value: n + 1,
            why: t(
              "This counts both ends of $[0, \\pi]$, but $\\theta$ and $\\theta + \\pi$ give the same line.",
              "这里把 $[0, \\pi]$ 的两个端点都算上了，但 $\\theta$ 和 $\\theta + \\pi$ 给出同一条直线。",
            ),
          },
          {
            value: n - 1,
            why: t(
              `This misses one of the zeros; $${fn} ${n}\\theta = 0$ has exactly $${n}$ solutions in $[0, \\pi)$.`,
              `这里漏掉了一个零点；$${fn} ${n}\\theta = 0$ 在 $[0, \\pi)$ 中恰有 $${n}$ 个解。`,
            ),
          },
        ],
        solution: walked(
          [
            [
              ["Find where r is zero", "求 r 的零点"],
              t(
                `The rose reaches the pole where $${fn} ${n}\\theta = 0$. In $[0, \\pi)$ this happens at`,
                `玫瑰线在 $${fn} ${n}\\theta = 0$ 处到达极点。在 $[0, \\pi)$ 中，这发生在`,
              ),
              [`${zeros}, \\quad k = ${ks}`],
            ],
            [
              ["Count the lines", "数直线"],
              t(
                `At each zero $r' \\ne 0$, so the tangent there is the line through the pole at that angle. A zero $\\pi$ further on gives the same line again. So the $${n}$ angles give $${n}$ different lines${n % 2 === 0 ? `, though the rose has $${petals}$ petals` : ""}.`,
                `在每个零点处 $r' \\ne 0$，所以那里的切线是沿该角度过极点的直线。比某个零点大 $\\pi$ 的零点给出同一条直线。所以这 $${n}$ 个角给出 $${n}$ 条不同的直线${n % 2 === 0 ? `，尽管玫瑰线有 $${petals}$ 片花瓣` : ""}。`,
              ),
            ],
          ],
          t(
            `Count over a whole turn instead. On $[0, 2\\pi)$ the equation $${fn} ${n}\\theta = 0$ has $${2 * n}$ solutions, spaced $\\frac{\\pi}{${n}}$ apart, so the rose leaves the pole along $${2 * n}$ rays. Each line through the pole holds two opposite rays, so there are $${2 * n} \\div 2 = ${n}$ lines.`,
            `改为在一整圈上数。在 $[0, 2\\pi)$ 上方程 $${fn} ${n}\\theta = 0$ 有 $${2 * n}$ 个解，间隔 $\\frac{\\pi}{${n}}$，所以玫瑰线沿 $${2 * n}$ 条射线离开极点。过极点的每条直线包含两条相反的射线，所以有 $${2 * n} \\div 2 = ${n}$ 条直线。`,
          ),
        ),
      });
    },
  ),
  figure:
    calculusDrawings5[
      "horizontal-and-vertical-tangents-to-polar-curves-in-non-differentiable-cases#counting-the-tangent-lines-at-the-pole"
    ],
};

const parameterFromTangentSlope = point(
  "a-parameter-from-a-tangent-or-normal-slope",
  ["A parameter from a tangent or normal slope", "由切线或法线的斜率求参数"],
  [
    "This is the reverse of finding a tangent. For $r = a + b\\cos\\theta$ at $\\theta = \\frac{\\pi}{2}$ we have $r = a$ and $r' = -b\\sin\\frac{\\pi}{2} = -b$, and on the $y$-axis the slope is $-\\frac{r'}{r}$:\n\n$$\\frac{dy}{dx} = -\\frac{r'}{r} = \\frac{b}{a}$$\n\nSet this equal to the given slope and solve. A normal has the negative reciprocal slope, so convert it first. For example, if the normal to $r = 4 + b\\cos\\theta$ at $\\theta = \\frac{\\pi}{2}$ has slope $-2$, the tangent has slope $\\frac{1}{2}$, so $\\frac{b}{4} = \\frac{1}{2}$ and $b = 2$.\n\nCheck: with $b = 2$, $r = 4$ and $r' = -2$, so $\\frac{dx}{d\\theta} = r'\\cos\\theta - r\\sin\\theta = -4$ and $\\frac{dy}{d\\theta} = r'\\sin\\theta + r\\cos\\theta = -2$. The tangent slope is $\\frac{1}{2}$ and the normal slope is $-2$, as given.\n\n> **Watch out.** Do not set the normal slope equal to $\\frac{b}{a}$. Here that would give $b = -8$.",
    "这是求切线的逆问题。对 $r = a + b\\cos\\theta$，在 $\\theta = \\frac{\\pi}{2}$ 处有 $r = a$，$r' = -b\\sin\\frac{\\pi}{2} = -b$，而在 $y$ 轴上斜率是 $-\\frac{r'}{r}$：\n\n$$\\frac{dy}{dx} = -\\frac{r'}{r} = \\frac{b}{a}$$\n\n令它等于给定的斜率再求解。法线的斜率是切线斜率的负倒数，所以要先换算。例如，若 $r = 4 + b\\cos\\theta$ 在 $\\theta = \\frac{\\pi}{2}$ 处的法线斜率是 $-2$，则切线斜率是 $\\frac{1}{2}$，所以 $\\frac{b}{4} = \\frac{1}{2}$，$b = 2$。\n\n检验：$b = 2$ 时 $r = 4$，$r' = -2$，所以 $\\frac{dx}{d\\theta} = r'\\cos\\theta - r\\sin\\theta = -4$，$\\frac{dy}{d\\theta} = r'\\sin\\theta + r\\cos\\theta = -2$。切线斜率是 $\\frac{1}{2}$，法线斜率是 $-2$，与给定的一致。\n\n> **注意。** 不要让法线斜率等于 $\\frac{b}{a}$。这里那样做会得到 $b = -8$。",
  ],
  (rng) => {
    const a = rng.int(2, 9);
    const b = nz(rng, 12);
    const normal = rng.bool();
    const tangent = Q.of(b, a);
    const given = normal ? Q.of(-a, b) : tangent;
    const line: Pair = normal ? ["normal", "法线"] : ["tangent", "切线"];
    const curve = `r = ${a} + b\\cos\\theta`;
    const mistakes = [
      {
        value: -b,
        why: t(
          "The sign of $r'$ is lost: the derivative of $b\\cos\\theta$ is $-b\\sin\\theta$, so $r' = -b$ at this angle.",
          "$r'$ 的符号丢了：$b\\cos\\theta$ 的导数是 $-b\\sin\\theta$，所以在这个角度上 $r' = -b$。",
        ),
      },
      normal
        ? {
            value: given.mul(Q.of(a)),
            why: t(
              `This sets the normal slope equal to $\\frac{b}{${a}}$; the tangent slope is the negative reciprocal, $${tangent.toLatex()}$.`,
              `这里让法线斜率等于 $\\frac{b}{${a}}$；切线斜率是它的负倒数 $${tangent.toLatex()}$。`,
            ),
          }
        : {
            value: Q.of(a).div(given),
            why: t(
              `This uses the slope $\\frac{${a}}{b}$, upside down; on the $y$-axis the slope is $-\\frac{r'}{r} = \\frac{b}{${a}}$.`,
              `这里用了上下颠倒的斜率 $\\frac{${a}}{b}$；在 $y$ 轴上斜率是 $-\\frac{r'}{r} = \\frac{b}{${a}}$。`,
            ),
          },
      normal
        ? {
            value: tangent,
            why: t(
              `This is the tangent slope $\\frac{b}{${a}}$ itself; $b$ is $${a}$ times it.`,
              `这是切线斜率 $\\frac{b}{${a}}$ 本身；$b$ 是它的 $${a}$ 倍。`,
            ),
          }
        : {
            value: given.div(Q.of(a)),
            why: t(
              `This divides the slope by $${a}$; from $\\frac{b}{${a}} = ${given.toLatex()}$, multiply by $${a}$.`,
              `这里把斜率除以了 $${a}$；由 $\\frac{b}{${a}} = ${given.toLatex()}$，应乘以 $${a}$。`,
            ),
          },
    ];
    const dx = -a;
    const dy = -b;
    return numberProblem({
      prompt: t(
        `The ${line[0]} line to the polar curve $${curve}$ at $\\theta = \\frac{\\pi}{2}$ has slope $${given.toLatex()}$. Find $b$.`,
        `极坐标曲线 $${curve}$ 在 $\\theta = \\frac{\\pi}{2}$ 处的${line[1]}斜率是 $${given.toLatex()}$。求 $b$。`,
      ),
      answer: b,
      form: "integer",
      mistakes,
      solution: walked(
        [
          [
            ["Find r and r' at the angle", "求该角度处的 r 和 r'"],
            t(
              "At $\\theta = \\frac{\\pi}{2}$, $\\cos\\theta = 0$ and $\\sin\\theta = 1$:",
              "在 $\\theta = \\frac{\\pi}{2}$ 处 $\\cos\\theta = 0$，$\\sin\\theta = 1$：",
            ),
            [`r = ${a}, \\quad r' = -b\\sin\\frac{\\pi}{2} = -b`],
          ],
          [
            ["Write the tangent slope", "写出切线斜率"],
            t(
              `On the $y$-axis the slope is $-\\frac{r'}{r} = \\frac{b}{${a}}$.${normal ? ` The normal slope $${given.toLatex()}$ is the negative reciprocal of the tangent slope, so the tangent slope is $${tangent.toLatex()}$.` : ""}`,
              `在 $y$ 轴上斜率是 $-\\frac{r'}{r} = \\frac{b}{${a}}$。${normal ? `法线斜率 $${given.toLatex()}$ 是切线斜率的负倒数，所以切线斜率是 $${tangent.toLatex()}$。` : ""}`,
            ),
            [`\\frac{b}{${a}} = ${tangent.toLatex()}`],
          ],
          [["Solve", "求解"], t(`Multiply by $${a}$:`, `两边乘以 $${a}$：`), [`b = ${b}`]],
        ],
        t(
          `Put $b = ${b}$ back. At $\\theta = \\frac{\\pi}{2}$, $r = ${a}$ and $r' = ${-b}$, so $\\frac{dx}{d\\theta} = -r = ${dx}$ and $\\frac{dy}{d\\theta} = r' = ${dy}$. The tangent slope is $${tangent.toLatex()}$${normal ? `, and the normal slope is its negative reciprocal $${given.toLatex()}$` : ""}, as given.`,
          `把 $b = ${b}$ 代回。在 $\\theta = \\frac{\\pi}{2}$ 处 $r = ${a}$，$r' = ${-b}$，所以 $\\frac{dx}{d\\theta} = -r = ${dx}$，$\\frac{dy}{d\\theta} = r' = ${dy}$。切线斜率是 $${tangent.toLatex()}$${normal ? `，法线斜率是它的负倒数 $${given.toLatex()}$` : ""}，与给定的一致。`,
        ),
      ),
    });
  },
);

const commonRegion = {
  ...point(
    "the-region-common-to-two-circles",
    ["The region common to two circles", "两圆的公共区域"],
    [
      "For the region inside both curves, use whichever $r$ is smaller at each angle, so the integral splits where the curves cross. The circles $r = 2\\cos\\theta$ and $r = 2\\sin\\theta$ cross at $\\theta = \\frac{\\pi}{4}$. The sine is smaller on $\\left[0, \\frac{\\pi}{4}\\right]$, the cosine on $\\left[\\frac{\\pi}{4}, \\frac{\\pi}{2}\\right]$, and the two pieces are mirror images in $y = x$, so\n\n$$A = 2 \\cdot \\frac{1}{2}\\int_{0}^{\\pi/4} 4\\sin^{2}\\theta \\, d\\theta = 2\\left[\\theta - \\frac{\\sin 2\\theta}{2}\\right]_{0}^{\\pi/4} = \\frac{\\pi}{2} - 1$$\n\nCheck: the circles have radius $1$ and centres $(1, 0)$ and $(0, 1)$, and the lens is two circular segments cut off by the chord from $(0, 0)$ to $(1, 1)$. That chord subtends a right angle at each centre, so each segment has area $\\frac{\\pi}{4} - \\frac{1}{2}$, and two of them make $\\frac{\\pi}{2} - 1$.\n\n> **Watch out.** Integrating $\\frac{1}{2}r^{2}$ with the larger $r$, or with one formula over the whole range, gives the region inside either circle, not inside both.",
      "对于同时在两条曲线内部的区域，每个角度都取较小的 $r$，所以积分要在两曲线相交处分开。圆 $r = 2\\cos\\theta$ 和 $r = 2\\sin\\theta$ 交于 $\\theta = \\frac{\\pi}{4}$。在 $\\left[0, \\frac{\\pi}{4}\\right]$ 上正弦较小，在 $\\left[\\frac{\\pi}{4}, \\frac{\\pi}{2}\\right]$ 上余弦较小，两部分关于 $y = x$ 互为镜像，所以\n\n$$A = 2 \\cdot \\frac{1}{2}\\int_{0}^{\\pi/4} 4\\sin^{2}\\theta \\, d\\theta = 2\\left[\\theta - \\frac{\\sin 2\\theta}{2}\\right]_{0}^{\\pi/4} = \\frac{\\pi}{2} - 1$$\n\n检验：两圆半径为 $1$，圆心是 $(1, 0)$ 和 $(0, 1)$，透镜形区域是被从 $(0, 0)$ 到 $(1, 1)$ 的弦切下的两个弓形。这条弦在每个圆心处所对的角是直角，所以每个弓形的面积是 $\\frac{\\pi}{4} - \\frac{1}{2}$，两个合起来是 $\\frac{\\pi}{2} - 1$。\n\n> **注意。** 用较大的 $r$ 积分 $\\frac{1}{2}r^{2}$，或在整个范围上只用一个公式，得到的是在某一个圆内的区域，而不是同时在两个圆内的区域。",
    ],
    (rng) => {
      const a = rng.int(1, 30);
      const s = a * a;
      const c = s === 1 ? "" : `${s}`;
      const answer = `${c}\\left(\\frac{\\pi}{2} - 1\\right)`;
      const doubled = `${c}\\left(\\pi - 2\\right)`;
      const halfOnly = `${c}\\left(\\frac{\\pi}{4} - \\frac{1}{2}\\right)`;
      const quarterDisc = poly([Q.of(s, 2), "\\pi"]);
      const solution = walked(
        [
          [
            ["Find where the circles cross", "求两圆的交点"],
            t(
              `Set $${2 * a}\\cos\\theta = ${2 * a}\\sin\\theta$, so $\\tan\\theta = 1$:`,
              `令 $${2 * a}\\cos\\theta = ${2 * a}\\sin\\theta$，则 $\\tan\\theta = 1$：`,
            ),
            ["\\theta = \\frac{\\pi}{4}"],
          ],
          [
            ["Take the smaller radius", "取较小的半径"],
            t(
              "On $\\left[0, \\frac{\\pi}{4}\\right]$ the sine circle is nearer the pole, and on $\\left[\\frac{\\pi}{4}, \\frac{\\pi}{2}\\right]$ the cosine circle is. The two pieces are mirror images in $y = x$, so take twice the first:",
              "在 $\\left[0, \\frac{\\pi}{4}\\right]$ 上正弦圆离极点较近，在 $\\left[\\frac{\\pi}{4}, \\frac{\\pi}{2}\\right]$ 上余弦圆较近。两部分关于 $y = x$ 互为镜像，所以取第一部分的两倍：",
            ),
            [`A = 2 \\cdot \\frac{1}{2}\\int_{0}^{\\pi/4} ${4 * s}\\sin^{2}\\theta \\, d\\theta`],
          ],
          [
            ["Integrate", "积分"],
            t("Use $\\sin^{2}\\theta = \\frac{1 - \\cos 2\\theta}{2}$:", "用 $\\sin^{2}\\theta = \\frac{1 - \\cos 2\\theta}{2}$："),
            [
              `A = ${2 * s}\\left[\\theta - \\frac{\\sin 2\\theta}{2}\\right]_{0}^{\\pi/4} = ${2 * s}\\left(\\frac{\\pi}{4} - \\frac{1}{2}\\right) = ${answer}`,
            ],
          ],
        ],
        t(
          `Use plane geometry. The circles have radius $${a}$ and centres $(${a}, 0)$ and $(0, ${a})$, and the region is two circular segments cut off by the common chord from $(0, 0)$ to $(${a}, ${a})$. The chord subtends a right angle at each centre, so each segment is a quarter disc less a right triangle:\n\n$$${poly([Q.of(s, 4), "\\pi"])} - ${Q.of(s, 2).toLatex()} = ${halfOnly}$$\n\nTwo segments make $${answer}$.`,
          `用平面几何。两圆半径为 $${a}$，圆心是 $(${a}, 0)$ 和 $(0, ${a})$，区域是被公共弦（从 $(0, 0)$ 到 $(${a}, ${a})$）切下的两个弓形。这条弦在每个圆心处所对的角是直角，所以每个弓形是四分之一圆减去一个直角三角形：\n\n$$${poly([Q.of(s, 4), "\\pi"])} - ${Q.of(s, 2).toLatex()} = ${halfOnly}$$\n\n两个弓形合起来是 $${answer}$。`,
        ),
      );
      return reasoned(
        choose(
          rng,
          [
            `Find the area of the region inside both $r = ${2 * a}\\cos\\theta$ and $r = ${2 * a}\\sin\\theta$.`,
            `求同时在 $r = ${2 * a}\\cos\\theta$ 和 $r = ${2 * a}\\sin\\theta$ 内部的区域的面积。`,
          ],
          same2(answer),
          [same2(doubled), same2(halfOnly), same2(quarterDisc)],
          [solution.en, solution["zh-CN"]],
        ),
        [
          [
            same2(doubled)[0],
            "This leaves out the $\\frac{1}{2}$ of the polar area formula $\\frac{1}{2}\\int r^{2} \\, d\\theta$.",
            "这里漏掉了极坐标面积公式 $\\frac{1}{2}\\int r^{2} \\, d\\theta$ 中的 $\\frac{1}{2}$。",
          ],
          [
            same2(halfOnly)[0],
            "This is only the piece on $\\left[0, \\frac{\\pi}{4}\\right]$; the piece bounded by the cosine circle is its mirror image and adds the same.",
            "这只是 $\\left[0, \\frac{\\pi}{4}\\right]$ 上的部分；由余弦圆界定的部分是它的镜像，面积相同，也要加上。",
          ],
          [
            same2(quarterDisc)[0],
            "This is half of one disc, from a single formula over the whole range; at each angle the smaller of the two radii must be used.",
            "这是一个圆盘的一半，是在整个范围上只用一个公式得到的；每个角度都要取两个半径中较小的那个。",
          ],
        ],
      );
    },
  ),
  figure: calculusDrawings5["the-area-bounded-by-two-polar-curves#the-region-common-to-two-circles"],
};

const recursiveLimit = point(
  "limits-of-sequences-defined-by-a-recurrence",
  ["Limits of sequences defined by a recurrence", "由递推式定义的数列的极限"],
  [
    "The recurrence $a_{n+1} = ra_{n} + b$ with $|r| < 1$ has the solution $a_{n} = L + r^{n}(a_{0} - L)$, where $L = \\frac{b}{1 - r}$. Since $r^{n} \\to 0$, the sequence converges to $L$, and the starting value does not affect the limit.",
    "递推式 $a_{n+1} = ra_{n} + b$（$|r| < 1$）的解是 $a_{n} = L + r^{n}(a_{0} - L)$，其中 $L = \\frac{b}{1 - r}$。因为 $r^{n} \\to 0$，数列收敛到 $L$，而初值不影响极限。",
  ],
  (rng) => {
    const q = rng.int(2, 9);
    const p = rng.pick([...Array(2 * q - 1).keys()].map((i) => i - q + 1).filter((i) => i !== 0));
    const r = Q.of(p, q);
    const b = nz(rng, 12);
    const a0 = rng.int(-9, 9);
    const L = Q.of(b).div(Q.one.sub(r));
    const step = poly([r, "a_{n}"], [b, ""]);
    return ask(
      [
        `A sequence has $a_{0} = ${a0}$ and $a_{n+1} = ${step}$. Find $\\lim_{n \\to \\infty} a_{n}$.`,
        `数列满足 $a_{0} = ${a0}$，$a_{n+1} = ${step}$。求 $\\lim_{n \\to \\infty} a_{n}$。`,
      ],
      L,
      [a0, b, Q.of(b).div(Q.one.add(r))],
      [
        `The ratio has size less than $1$, so the sequence converges. Its limit $L$ satisfies $L = ${poly([r, "L"], [b, ""])}$, which gives $L = ${L.toLatex()}$, whatever the value of $a_{0}$.`,
        `比的绝对值小于 $1$，所以数列收敛。极限 $L$ 满足 $L = ${poly([r, "L"], [b, ""])}$，解得 $L = ${L.toLatex()}$，与 $a_{0}$ 的值无关。`,
      ],
    );
  },
);

const factorialAgainstPowers = point(
  "factorials-against-powers-of-n",
  ["Factorials against powers of n", "阶乘与 n 的幂比较"],
  [
    "Factorials beat fixed exponentials, but $n^{n}$ beats factorials: $\\frac{n!}{n^{n}} \\le \\frac{1}{n}$, since each of the other factors is at most $1$. And $\\frac{(n + k)!}{n!}$ is a polynomial of degree $k$, so it can be compared directly with $n^{k}$.",
    "阶乘超过固定底数的指数函数，但 $n^{n}$ 超过阶乘：$\\frac{n!}{n^{n}} \\le \\frac{1}{n}$，因为其余每个因子都不超过 $1$。而 $\\frac{(n + k)!}{n!}$ 是 $k$ 次多项式，可以直接与 $n^{k}$ 比较。",
  ],
  (rng) => {
    const c = rng.int(2, 9) * rng.pick([-1, 1]);
    const kind = rng.pick(["over-nn", "over-exp", "shift", "power"] as const);
    const a = rng.int(2, 9);
    const k = rng.int(1, 4);
    const expr = {
      "over-nn": `\\frac{${c} \\cdot n!}{n^{n}}`,
      "over-exp": `\\frac{${c} \\cdot n!}{${a}^{n}}`,
      shift: `\\frac{${c} \\cdot (n + ${k})!}{n! \\, n^{${k}}}`,
      power: `\\frac{${c}n^{${a}}}{n!}`,
    }[kind];
    const inf = c > 0 ? "\\infty" : "-\\infty";
    const answer = kind === "shift" ? `${c}` : kind === "over-exp" ? inf : "0";
    const opts = ["0", `${c}`, inf, "1"].filter((o) => o !== answer).slice(0, 3);
    const whyEn = {
      "over-nn": `$\\frac{n!}{n^{n}} \\le \\frac{1}{n}$, so the sequence is squeezed to $0$.`,
      "over-exp": `The factorial eventually gains factors larger than $${a}$, so the size of the quotient grows without bound.`,
      shift: `$\\frac{(n + ${k})!}{n!}$ is a polynomial of degree $${k}$ with leading coefficient $1$, so its quotient by $n^{${k}}$ tends to $1$.`,
      power: `The factorial grows faster than any fixed power of $n$, so the quotient tends to $0$.`,
    }[kind];
    const whyZh = {
      "over-nn": `$\\frac{n!}{n^{n}} \\le \\frac{1}{n}$，所以由夹逼定理，数列趋于 $0$。`,
      "over-exp": `阶乘最终会乘上大于 $${a}$ 的因子，所以商的大小无限增大。`,
      shift: `$\\frac{(n + ${k})!}{n!}$ 是首项系数为 $1$ 的 $${k}$ 次多项式，所以它除以 $n^{${k}}$ 趋于 $1$。`,
      power: `阶乘比 $n$ 的任何固定次幂增长得都快，所以商趋于 $0$。`,
    }[kind];
    return choose(
      rng,
      [`Find $\\lim_{n \\to \\infty} ${expr}$.`, `求 $\\lim_{n \\to \\infty} ${expr}$。`],
      same2(answer),
      opts.map(same2),
      [`${whyEn} The limit is $${answer}$.`, `${whyZh}极限是 $${answer}$。`],
    );
  },
);

const mixedDominance = point(
  "dominant-terms-across-different-kinds-of-growth",
  ["Dominant terms across different kinds of growth", "不同增长类型中的主导项"],
  [
    "The growth order is: logarithms, then powers of $n$, then exponentials, then factorials. In a quotient of mixed terms, only the dominant kind matters on each side, so the limit is the ratio of its coefficients and the other coefficients play no part.",
    "增长的顺序是：对数、$n$ 的幂、指数、阶乘。在混合项的商中，每一边只有主导的那一类起作用，所以极限是它们系数的比，其他系数不起作用。",
  ],
  (rng) => {
    const c = nz(rng, 9);
    const d = nz(rng, 9);
    const e = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== Math.abs(d)));
    const p = rng.int(2, 7);
    const k = rng.int(2, 6);
    const kind = rng.pick(["factorial", "exponential", "power"] as const);
    const big = { factorial: "n!", exponential: `${p}^{n}`, power: `n^{${k}}` }[kind];
    const small = { factorial: `${p}^{n}`, exponential: `n^{${k}}`, power: "\\ln n" }[kind];
    const term = (co: number, body: string): [number, string] => [co, /^\d/.test(body) && Math.abs(co) !== 1 ? `\\cdot ${body}` : body];
    const top = poly(term(c, big), term(1, small));
    const bottom = poly(term(d, big), term(e, small));
    const answer = Q.of(c, d);
    return ask(
      [`Find $\\lim_{n \\to \\infty} \\frac{${top}}{${bottom}}$.`, `求 $\\lim_{n \\to \\infty} \\frac{${top}}{${bottom}}$。`],
      answer,
      [Q.of(1, e), Q.of(c, e), Q.of(c + 1, d + e === 0 ? 1 : d + e)],
      [
        `$${big}$ grows faster than $${small}$, so dividing through by $${big}$ leaves the ratio of their coefficients, $${answer.toLatex()}$.`,
        `$${big}$ 比 $${small}$ 增长得快，所以分子分母同除以 $${big}$，得它们的系数之比 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const largestTerm = point(
  "the-largest-term-of-a-sequence",
  ["The largest term of a sequence", "数列的最大项"],
  [
    "A sequence need not be monotonic from the start. If $f$ rises and then falls with a peak at an integer, the largest term of $a_{n} = f(n)$ is at that integer, and the sequence decreases after it. Differentiating $f$ locates the peak.",
    "数列不一定从一开始就单调。如果 $f$ 先升后降，峰值在某个整数处，那么 $a_{n} = f(n)$ 的最大项就在这个整数处，此后数列递减。对 $f$ 求导就能找到峰值。",
  ],
  (rng) => {
    const k = rng.int(2, 9);
    const p = rng.int(1, 5);
    const peak = p * k;
    const a = `${p === 1 ? "n" : `n^{${p}}`}e^{-n/${k}}`;
    return ask(
      [`For which $n$ is the term $a_{n} = ${a}$ largest?`, `当 $n$ 为何值时，$a_{n} = ${a}$ 这一项最大？`],
      peak,
      [peak + 1, k, p + k],
      [
        `With $f(x) = ${p === 1 ? "x" : `x^{${p}}`}e^{-x/${k}}$, the derivative has the sign of $${p} - \\frac{x}{${k}}$. It changes from positive to negative at $x = ${peak}$, which is an integer, so the largest term is $a_{${peak}}$.`,
        `设 $f(x) = ${p === 1 ? "x" : `x^{${p}}`}e^{-x/${k}}$，导数的符号与 $${p} - \\frac{x}{${k}}$ 相同。它在 $x = ${peak}$ 处由正变负，这是整数，所以最大项是 $a_{${peak}}$。`,
      ],
    );
  },
);

const ratioWithLinearFactor = point(
  "ratios-that-settle-only-after-a-while",
  ["Ratios that settle only after a while", "比值过一段时间才稳定"],
  [
    "For $a_{n} = n\\left(\\frac{p}{q}\\right)^{n}$ the ratio is $\\frac{n + 1}{n} \\cdot \\frac{p}{q}$, which may start above $1$. Solving the strict inequality gives where the decrease begins. If the boundary is an integer, the ratio there equals $1$, so that $n$ does not count.",
    "对 $a_{n} = n\\left(\\frac{p}{q}\\right)^{n}$，比值是 $\\frac{n + 1}{n} \\cdot \\frac{p}{q}$，开始时可能大于 $1$。解严格不等式就能知道从哪里开始递减。如果边界是整数，那里的比值等于 $1$，所以这个 $n$ 不算。",
  ],
  (rng) => {
    const q = rng.int(3, 15);
    const p = rng.int(1, q - 1);
    const bound = Q.of(p, q - p);
    const floor = Math.floor(p / (q - p));
    const N = floor + 1;
    const r = Q.of(p, q).toLatex();
    return ask(
      [
        `Let $a_{n} = n\\left(${r}\\right)^{n}$. Find the smallest $N$ such that $a_{n+1} < a_{n}$ for every $n \\ge N$.`,
        `设 $a_{n} = n\\left(${r}\\right)^{n}$。求最小的 $N$，使得对每个 $n \\ge N$ 都有 $a_{n+1} < a_{n}$。`,
      ],
      N,
      [floor === 0 ? 2 : floor, N + 1, q],
      [
        `$\\frac{a_{n+1}}{a_{n}} = \\frac{n + 1}{n} \\cdot ${r} < 1$ means $n > ${bound.toLatex()}$. The smallest such integer is $${N}$.`,
        `$\\frac{a_{n+1}}{a_{n}} = \\frac{n + 1}{n} \\cdot ${r} < 1$ 即 $n > ${bound.toLatex()}$。满足它的最小整数是 $${N}$。`,
      ],
    );
  },
);

/** deeperCalculusIIThirdPoints maps topics of Calculus II, from integration to limits of sequences, to a third knowledge point. */
export const deeperCalculusIIThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "integrating-exponential-functions-using-linear-substitution": [negativeExponent],
  "integration-by-substitution-with-inverse-reciprocal-hyperbolic-functions": [arsechOfExponential],
  "integration-using-hyperbolic-functions-and-completing-the-square": [squareWithLeadingCoefficient],
  "integration-using-inverse-reciprocal-hyperbolic-functions-and-completing-the-square": [familyFromSquare],
  "integration-using-basic-trigonometric-identities": [pythagoreanIntegrals],
  "the-area-between-curves-expressed-as-functions-of-y": [areaLeftOfYAxis],
  "finding-areas-between-curves-that-intersect-at-more-than-two-points": [netAndTotal],
  "volumes-of-solids-with-rectangular-cross-sections": [heightFromVolume],
  "volumes-of-solids-with-circular-cross-sections": [overCircularBase],
  "volumes-of-revolution-using-the-disc-method-rotation-about-other-axes": [washerAxisOutside],
  "the-shell-method-rotating-a-region-about-the-x-axis": [shellShiftedAxis],
  "the-shell-method-rotating-a-region-between-two-curves-about-the-x-axis": [shellAxisAbove],
  "surface-areas-of-revolution-rotation-about-the-x-axis": [coneLength],
  "surface-areas-of-revolution-rotation-about-the-y-axis": [bothAxes],
  "determining-characteristics-of-moving-objects-using-integration": [totalDistance],
  "calculating-the-position-function-of-a-particle-using-integration": [initialVelocityFromPositions],
  "surface-areas-of-revolution-for-parametric-curves": [astroidSurface],
  "integrating-vector-valued-functions": [netDisplacementVector],
  "calculating-acceleration-for-plane-motion-using-differentiation": [speedFromDot],
  "differentiating-curves-given-in-polar-form": [slopeFromValues],
  "further-differentiation-of-curves-given-in-polar-form": [diagonalSlopeFromValues],
  "horizontal-and-vertical-tangents-to-polar-curves": [zeroRadialDerivative],
  "horizontal-and-vertical-tangents-to-polar-curves-in-non-differentiable-cases": [roseTangentsAtPole],
  "tangent-and-normal-lines-to-polar-curves": [parameterFromTangentSlope],
  "the-area-bounded-by-two-polar-curves": [commonRegion],
  "further-convergence-of-geometric-sequences": [recursiveLimit],
  "limits-of-sequences-with-factorials": [factorialAgainstPowers],
  "determining-limits-of-sequences-using-relative-magnitudes": [mixedDominance],
  "identifying-monotonic-sequences-using-differentiation": [largestTerm],
  "identifying-monotonic-sequences-using-ratios": [ratioWithLinearFactor],
};
