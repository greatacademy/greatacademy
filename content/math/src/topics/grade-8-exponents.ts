import type { KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import { expressionProblem, numberProblem, steps } from "../problems.ts";
import type { Pair, Walk } from "./early-grades-more-kit.ts";
import { base, mono } from "./exponents.ts";
import { expressed, lesson, type Said, valued, withIntro } from "./grade-6-kit.ts";
import { factorTape, fractionSteps, stepDown } from "./grade-8-kit.ts";
import { tapeFigure } from "./upper-grades-kit.ts";

// 8th Grade Math, exponents: the zeroth power, powers of -1, negative exponents, evaluating expressions with
// integer exponents, and the product, quotient, power, power-of-a-product and power-of-a-quotient rules.

/** ccss is a helper for writing Common Core codes. */
const ccss = (...codes: string[]) => codes.map((c) => `CCSS.${c}`);

/** topic builds a TopicDef with the common fields filled in. */
function topic(
  id: string,
  title: Text,
  summary: Text,
  prerequisites: string[],
  standards: string[],
  knowledgePoints: KnowledgePointDef[],
): TopicDef {
  return { id, title, summary, prerequisites, encompasses: [], xp: 10, standards: ccss(...standards), knowledgePoints };
}

/** Factors are the variables of a monomial with their exponents, which may be negative or zero. */
type Factors = readonly (readonly [string, number])[];

/** positive writes c times the factors with positive exponents only: positive(Q.of(-3, 2), [["x", 2], ["y", -3]]) is "-\frac{3x^{2}}{2y^{3}}". */
export function positive(c: Q, factors: Factors): string {
  const top = mono(
    Number(c.abs().n),
    factors.filter(([, e]) => e > 0),
  );
  const bottom = mono(
    Number(c.d),
    factors.filter(([, e]) => e < 0).map(([v, e]) => [v, -e] as const),
  );
  const sign = c.sign() < 0 ? "-" : "";
  return bottom === "1" ? `${sign}${top}` : `${sign}\\frac{${top}}{${bottom}}`;
}

/** power writes b^e, with a negative or fractional base in parentheses. */
const power = (b: Q | number, e: number) => `${base(b instanceof Q ? b : Q.of(b))}^{${e}}`;

/** exponentProblem asks for the exponent k when expr is written as a single power b^k. */
function exponentProblem(b: number, expr: string, k: number, work: Text, wrong: readonly number[]): Problem {
  return numberProblem({
    prompt: t(
      `Write $${expr}$ as a single power of $${b}$, in the form $${b}^{n}$. What is $n$?`,
      `把 $${expr}$ 写成以 $${b}$ 为底的一个幂 $${b}^{n}$。$n$ 是多少？`,
    ),
    answer: k,
    form: "integer",
    solveFor: "n",
    wrong,
    solution: work,
  });
}

/** signed writes an integer for use after an operator: "(-3)" or "3". */
const signed = (n: number) => (n < 0 ? `(${n})` : String(n));

/** smallBases are integer bases whose small powers stay readable. */
const smallBases = [2, 3, 4, 5, 6, 7, 10];

/** fractionBases are fractional bases for powers. */
const fractionBases = [Q.of(1, 2), Q.of(2, 3), Q.of(3, 4), Q.of(1, 3), Q.of(3, 2), Q.of(2, 5), Q.of(5, 2), Q.of(4, 3)];

// ---------------------------------------------------------------------------
// Integer exponents

/** theZerothPower evaluates zeroth powers, alone and in expressions. */
export const theZerothPower = withIntro(
  topic(
    "the-zeroth-power",
    t("The Zeroth Power", "零次幂"),
    t(
      "Any nonzero number to the power 0 is 1. Going down the powers of a number divides by the number each time, so one step below the first power gives 1. A minus sign in front of a power is not part of the base: −5⁰ = −1, while (−5)⁰ = 1.",
      "任何非零数的零次幂都等于 1。幂的指数每减少 1，就要除以一次底数，所以比一次幂再低一步就得到 1。幂前面的负号不属于底数：−5⁰ = −1，而 (−5)⁰ = 1。",
    ),
    ["exponents-with-rational-bases"],
    ["8.EE.A.1"],
    [
      lesson(
        "zeroth-powers-of-numbers",
        ["Zeroth powers of numbers", "数的零次幂"],
        [
          [
            "Count down the powers of $2$: $2^{3} = 8$, $2^{2} = 4$, $2^{1} = 2$. Each step divides by $2$. One more step gives $2^{0} = 2 \\div 2 = 1$. This works for any base except $0$: $(-7)^{0} = 1$ and $\\left(\\frac{3}{4}\\right)^{0} = 1$.",
            "把 $2$ 的幂往下数：$2^{3} = 8$，$2^{2} = 4$，$2^{1} = 2$。每一步都除以 $2$。再走一步就是 $2^{0} = 2 \\div 2 = 1$。除了 $0$，任何底数都这样：$(-7)^{0} = 1$，$\\left(\\frac{3}{4}\\right)^{0} = 1$。",
          ],
          ["$5^{0}$ is $5^{1} \\div 5 = 5 \\div 5 = 1$ too.", "$5^{0}$ 也是 $5^{1} \\div 5 = 5 \\div 5 = 1$。"],
          [
            "In $-7^{0}$ the exponent belongs to the $7$ only. So $-7^{0} = -(7^{0}) = -1$, not $1$.",
            "在 $-7^{0}$ 中，指数只属于 $7$。所以 $-7^{0} = -(7^{0}) = -1$，不是 $1$。",
          ],
        ],
        (rng) => {
          const n = rng.int(2, 99);
          const kind = rng.pick(["plain", "negative-base", "minus", "fraction", "decimal"] as const);
          const f = rng.pick(fractionBases);
          const d = Q.of(rng.int(11, 99), 10);
          const forms: Record<typeof kind, readonly [string, number]> = {
            plain: [`${n}^{0}`, 1],
            "negative-base": [`(-${n})^{0}`, 1],
            minus: [`-${n}^{0}`, -1],
            fraction: [power(rng.bool() ? f.neg() : f, 0), 1],
            decimal: [power(d, 0), 1],
          };
          const [expr, answer] = forms[kind];
          const sign: Record<typeof kind, Pair> = {
            plain: ["The base is positive, so there is no minus sign to keep.", "底数是正数，没有负号。"],
            "negative-base": [
              `The exponent is on all of $(-${n})$, so the minus sign is inside the power.`,
              `指数作用于整个 $(-${n})$，负号在幂里面。`,
            ],
            minus: [`The exponent is on $${n}$ only; the minus sign stays outside the power.`, `指数只作用于 $${n}$；负号留在幂的外面。`],
            fraction: ["The parentheses make the whole fraction the base.", "括号说明整个分数是底数。"],
            decimal: ["The parentheses make the whole decimal the base.", "括号说明整个小数是底数。"],
          };
          return valued(
            [`Evaluate $${expr}$.`, `计算 $${expr}$。`],
            answer,
            [
              [["Find the base", "找出底数"], sign[kind]],
              [
                ["Use the zeroth power", "用零次幂"],
                ["A nonzero base to the power $0$ is $1$:", "非零底数的零次幂是 $1$："],
                [kind === "minus" ? `-${n}^{0} = -(1) = -1` : `${expr} = 1`],
              ],
            ],
            kind === "minus"
              ? [
                  `Step down from the first power: $${n}^{0} = ${n} \\div ${n} = 1$, and the minus sign makes it $-1$.`,
                  `从一次幂往下一步：$${n}^{0} = ${n} \\div ${n} = 1$，再加上负号得 $-1$。`,
                ]
              : [
                  "Step down from the first power: any base divided by itself is $1$.",
                  "从一次幂往下一步：任何非零的底数除以它自己都得 $1$。",
                ],
            [
              [0, "That takes the zeroth power as $0$; it is $1$.", "这是把零次幂当成了 $0$；它等于 $1$。"],
              kind === "plain"
                ? [n, "That leaves the base as it is; the power $0$ does not keep it.", "这是把底数原样留下；零次幂不是底数本身。"]
                : [0, "", ""],
              kind === "minus"
                ? [
                    1,
                    `That puts the minus sign inside the power; the exponent is on $${n}$ only.`,
                    `这是把负号放进了幂里；指数只作用于 $${n}$。`,
                  ]
                : [-1, "That adds a minus sign the power does not have.", "这是多了一个负号，这个幂的结果没有负号。"],
            ],
          );
        },
        stepDown(2, 3, [
          "A number line from 0 to 8 with 2³ = 8, 2² = 4, 2¹ = 2 and 2⁰ = 1 marked; each jump to the left halves the number.",
          "一条从 0 到 8 的数轴，标出 2³ = 8、2² = 4、2¹ = 2 和 2⁰ = 1；每向左跳一次，数就减半。",
        ]),
      ),
      lesson(
        "zeroth-powers-in-expressions",
        ["Zeroth powers in expressions", "式子中的零次幂"],
        [
          [
            "First change every zeroth power to $1$. Then work out the rest. $4 \\cdot 7^{0} + 3^{0} = 4 \\cdot 1 + 1 = 5$. With a letter, look at what the exponent is on: $5x^{0} = 5 \\cdot 1 = 5$, but $(5x)^{0} = 1$.",
            "先把每个零次幂换成 $1$，再算其余部分。$4 \\cdot 7^{0} + 3^{0} = 4 \\cdot 1 + 1 = 5$。有字母时，要看指数作用在什么上：$5x^{0} = 5 \\cdot 1 = 5$，而 $(5x)^{0} = 1$。",
          ],
          [
            "Take $x = 3$: $5 \\cdot 3^{0} = 5 \\cdot 1 = 5$, and $(5 \\cdot 3)^{0} = 15^{0} = 1$.",
            "取 $x = 3$：$5 \\cdot 3^{0} = 5 \\cdot 1 = 5$，$(5 \\cdot 3)^{0} = 15^{0} = 1$。",
          ],
          ["$5x^{0}$ is not $1$. The exponent is on $x$ only, so the $5$ stays.", "$5x^{0}$ 不是 $1$。指数只作用于 $x$，所以 $5$ 还在。"],
        ],
        (rng) => {
          const x = rng.pick([-4, -3, -2, 2, 3, 5, 6]);
          const term = (): readonly [string, number, number, number] => {
            const c = rng.int(2, 9);
            const b = rng.int(2, 12);
            return rng.pick([
              [`${c} \\cdot ${b}^{0}`, c, 0, c],
              [`${b}^{0}`, 1, 0, 1],
              [`(${c}x)^{0}`, 1, 0, 1],
              [`${c}x^{0}`, c, 0, 1],
              [`${c}x`, c * x, c * x, c * x],
            ] as const);
          };
          for (;;) {
            const ts = [term(), term(), term()].slice(0, rng.int(2, 3));
            if (!ts.some(([s]) => s.includes("x^{0}") || s.includes("x)^{0}"))) continue;
            const ops = ts.map((_, i) => (i === 0 ? 1 : rng.pick([1, -1])));
            const expr = ts.map(([s], i) => (i === 0 ? s : `${ops[i]! > 0 ? "+" : "-"} ${s}`)).join(" ");
            const total = (k: 1 | 2 | 3) => ts.reduce((acc, tm, i) => acc + ops[i]! * tm[k], 0);
            const ones = ts.map(([s, v]) => (s.includes("^{0}") ? String(v) : `${s.replace("x", "")} \\cdot ${signed(x)}`));
            const work = ones.map((s, i) => (i === 0 ? s : `${ops[i]! > 0 ? "+" : "-"} ${s}`)).join(" ");
            const values = ts.map(([, v], i) => ops[i]! * v);
            return valued(
              [`Evaluate $${expr}$ for $x = ${x}$.`, `当 $x = ${x}$ 时，求 $${expr}$ 的值。`],
              total(1),
              [
                [
                  ["Replace the zeroth powers", "换掉零次幂"],
                  [
                    `Each zeroth power is $1$, and $x$ is $${x}$; in $cx^{0}$ only $x$ is raised to $0$:`,
                    `每个零次幂都是 $1$，$x$ 是 $${x}$；在 $cx^{0}$ 中只有 $x$ 是零次幂：`,
                  ],
                  [`${expr} = ${work}`],
                ],
                [["Work it out", "算出结果"], ["Multiply, then add and subtract:", "先乘，再加减："], [`${work} = ${total(1)}`]],
              ],
              [
                `Add the terms one by one: $${values.map(signed).join(" + ")} = ${total(1)}$.`,
                `逐项相加：$${values.map(signed).join(" + ")} = ${total(1)}$。`,
              ],
              [
                [total(2), "That takes each zeroth power as $0$ instead of $1$.", "这是把每个零次幂当成了 $0$，而不是 $1$。"],
                [
                  total(3),
                  "That reads $cx^{0}$ as $(cx)^{0}$; the exponent is on $x$ only.",
                  "这是把 $cx^{0}$ 当成了 $(cx)^{0}$；指数只作用于 $x$。",
                ],
              ],
            );
          }
        },
        tapeFigure(
          [
            {
              total: "5",
              pieces: [
                { size: 4, text: "4 · 7⁰" },
                { size: 1, text: "3⁰", lit: true },
              ],
            },
          ],
          ["A bar of length 5 made of a piece 4 · 7⁰ = 4 and a piece 3⁰ = 1.", "一个长度为 5 的长条，由 4 · 7⁰ = 4 和 3⁰ = 1 两段组成。"],
        ),
      ),
      lesson(
        "an-exponent-that-gives-one",
        ["An exponent that gives one", "使幂等于一的指数"],
        [
          [
            "A power of a number like $3$ equals $1$ only when the exponent is $0$. So $3^{2x - 6} = 1$ means $2x - 6 = 0$. Then $2x = 6$ and $x = 3$.",
            "像 $3$ 这样的数，它的幂只有在指数为 $0$ 时才等于 $1$。所以 $3^{2x - 6} = 1$ 就是 $2x - 6 = 0$。于是 $2x = 6$，$x = 3$。",
          ],
          ["Put $x = 3$ back: $2 \\cdot 3 - 6 = 0$, and $3^{0} = 1$.", "把 $x = 3$ 代回去：$2 \\cdot 3 - 6 = 0$，而 $3^{0} = 1$。"],
          [
            "Set the whole exponent to $0$, not $x$. $x = 0$ gives $3^{-6}$, which is not $1$.",
            "要让整个指数等于 $0$，而不是让 $x$ 等于 $0$。$x = 0$ 得到 $3^{-6}$，它不是 $1$。",
          ],
        ],
        (rng) => {
          const b = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10]);
          const k = rng.int(2, 7);
          const answer = rng.int(2, 12);
          const c = k * answer;
          return valued(
            [`Find $x$ if $${b}^{${k}x - ${c}} = 1$.`, `已知 $${b}^{${k}x - ${c}} = 1$，求 $x$。`],
            answer,
            [
              [
                ["Set the exponent to zero", "令指数为零"],
                [`Only the power $0$ gives $1$, so:`, `只有零次幂等于 $1$，所以：`],
                [`${k}x - ${c} = 0`],
              ],
              [
                ["Solve", "解方程"],
                [`Add $${c}$, then divide by $${k}$:`, `两边加 $${c}$，再除以 $${k}$：`],
                [`${k}x = ${c}`, `x = ${answer}`],
              ],
            ],
            [
              `Put it back: $${k} \\cdot ${answer} - ${c} = 0$, and $${b}^{0} = 1$.`,
              `代回去：$${k} \\cdot ${answer} - ${c} = 0$，而 $${b}^{0} = 1$。`,
            ],
            [
              [c, `That forgets to divide by $${k}$.`, `这是忘了除以 $${k}$。`],
              [-answer, `That moves $${c}$ across without changing its sign.`, `这是移项时没有改变 $${c}$ 的符号。`],
              [0, "That sets $x$ to $0$ instead of the whole exponent.", "这是让 $x$ 等于 $0$，而不是让整个指数等于 $0$。"],
            ],
            { solveFor: "x" },
          );
        },
        stepDown(3, 2, [
          "A number line from 0 to 9 with 3² = 9, 3¹ = 3 and 3⁰ = 1 marked; each jump to the left divides by 3.",
          "一条从 0 到 9 的数轴，标出 3² = 9、3¹ = 3 和 3⁰ = 1；每向左跳一次就除以 3。",
        ]),
      ),
    ],
  ),
  [
    "Ben cuts a sheet of paper in half, then cuts every piece in half again. $3$ rounds give $2^{3} = 8$ pieces, $2$ rounds give $2^{2} = 4$, and $1$ round gives $2^{1} = 2$. With no rounds at all he still has $1$ sheet.",
    "小本把一张纸对半剪开，再把每一张都对半剪开。剪 $3$ 轮得到 $2^{3} = 8$ 张，剪 $2$ 轮得到 $2^{2} = 4$ 张，剪 $1$ 轮得到 $2^{1} = 2$ 张。一轮都不剪，还是 $1$ 张。",
  ],
  ["Each step down divides by $2$: $2 \\div 2 = 1$, so $2^{0} = 1$.", "每往下一步都除以 $2$：$2 \\div 2 = 1$，所以 $2^{0} = 1$。"],
  ["find zeroth powers of numbers and use them in expressions and equations.", "求数的零次幂，并在式子和方程中使用它。"],
);

/** powersOfNegativeOne evaluates powers of -1 by the parity of the exponent. */
export const powersOfNegativeOne = topic(
  "powers-of-negative-one",
  t("Powers of Negative One", "−1 的乘方"),
  t(
    "Multiplying by −1 flips the sign, so the powers of −1 alternate between −1 and 1: an even power of −1 is 1 and an odd power is −1. Without parentheses, −1ⁿ means −(1ⁿ), which is −1 for every n.",
    "乘以 −1 会改变符号，所以 −1 的乘方在 −1 和 1 之间交替：−1 的偶数次幂是 1，奇数次幂是 −1。没有括号时，−1ⁿ 表示 −(1ⁿ)，对任何 n 都等于 −1。",
  ),
  ["exponents-with-rational-bases"],
  ["8.EE.A.1"],
  [
    {
      id: "even-and-odd-powers-of-negative-one",
      title: t("Even and odd powers", "偶数次幂与奇数次幂"),
      explanation: t(
        "$(-1)^{2} = 1$, $(-1)^{3} = -1$, $(-1)^{4} = 1$, and so on: the factors pair up into $(-1)(-1) = 1$, and an odd exponent leaves one $-1$ over. So $(-1)^{58} = 1$ because $58$ is even, and $(-1)^{77} = -1$ because $77$ is odd.",
        "$(-1)^{2} = 1$，$(-1)^{3} = -1$，$(-1)^{4} = 1$，依此类推：因数两两配成 $(-1)(-1) = 1$，指数为奇数时会剩下一个 $-1$。所以 $(-1)^{58} = 1$，因为 $58$ 是偶数；$(-1)^{77} = -1$，因为 $77$ 是奇数。",
      ),
      generate(rng) {
        const n = rng.bool(0.3) ? rng.int(5, 12) : rng.int(13, 250);
        const answer = n % 2 === 0 ? 1 : -1;
        return numberProblem({
          prompt: t(`Evaluate $(-1)^{${n}}$.`, `计算 $(-1)^{${n}}$。`),
          answer,
          form: "integer",
          // The other sign, and multiplying -1 by the exponent.
          wrong: [-answer, -n],
          solution: t(
            `$${n}$ is ${n % 2 === 0 ? "even, so the factors of $-1$ pair up into $1$s" : "odd, so after pairing the factors one $-1$ is left over"}:${steps(`(-1)^{${n}} = ${answer}`)}`,
            `$${n}$ 是${n % 2 === 0 ? "偶数，所以 $-1$ 这些因数两两配成 $1$" : "奇数，所以因数两两配对后还剩一个 $-1$"}：${steps(`(-1)^{${n}} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "negative-signs-and-powers-of-one",
      title: t("Negative signs and powers", "负号与乘方"),
      explanation: t(
        "In $(-1)^{n}$ the base is $-1$; in $-1^{n}$ the base is $1$, and the minus sign is applied afterward, so $-1^{n} = -1$ for every $n$. For example, $-1^{4} + (-1)^{6} = -1 + 1 = 0$ and $(-1)^{3} \\cdot (-1)^{5} = (-1)(-1) = 1$.",
        "在 $(-1)^{n}$ 中，底数是 $-1$；在 $-1^{n}$ 中，底数是 $1$，负号是算完乘方后再加上的，所以对任何 $n$ 都有 $-1^{n} = -1$。例如 $-1^{4} + (-1)^{6} = -1 + 1 = 0$，$(-1)^{3} \\cdot (-1)^{5} = (-1)(-1) = 1$。",
      ),
      generate(rng) {
        // A term is a power of -1 with or without parentheses: [LaTeX, value, value with the parentheses misread].
        const term = (): readonly [string, number, number] => {
          const n = rng.int(2, 60);
          const v = n % 2 === 0 ? 1 : -1;
          return rng.bool() ? [`(-1)^{${n}}`, v, v] : [`-1^{${n}}`, -1, v];
        };
        for (;;) {
          const [a, b] = [term(), term()];
          if (!a[0].startsWith("-1") && !b[0].startsWith("-1")) continue;
          const op = rng.pick(["+", "-", "\\cdot"] as const);
          const f = (x: number, y: number) => (op === "+" ? x + y : op === "-" ? x - y : x * y);
          const expr = `${a[0]} ${op} ${b[0].startsWith("-") && op !== "\\cdot" ? `(${b[0]})` : op === "\\cdot" && b[0].startsWith("-") ? `(${b[0]})` : b[0]}`;
          const answer = f(a[1], b[1]);
          return numberProblem({
            prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
            answer,
            form: "integer",
            // Reading -1^n as (-1)^n, and flipping the sign.
            wrong: [f(a[2], b[2]), -answer, f(a[1], -b[1])],
            solution: t(
              `Without parentheses the exponent applies to $1$ only, so $-1^{n} = -1$; with them, an even power of $-1$ is $1$ and an odd power is $-1$:${steps(`${expr} = ${signed(a[1])} ${op} ${signed(b[1])} = ${answer}`)}`,
              `没有括号时，指数只作用于 $1$，所以 $-1^{n} = -1$；有括号时，$-1$ 的偶数次幂为 $1$，奇数次幂为 $-1$：${steps(`${expr} = ${signed(a[1])} ${op} ${signed(b[1])} = ${answer}`)}`,
            ),
          });
        }
      },
    },
  ],
);

/** negativeExponents evaluates negative powers and rewrites them with positive exponents. */
export const negativeExponents = withIntro(
  topic(
    "negative-exponents",
    t("Negative Exponents", "负整数指数"),
    t(
      "A negative exponent means the reciprocal of the positive power: b⁻ⁿ = 1/bⁿ for any nonzero b. It does not make the number negative: 2⁻³ = 1/8. For a fraction, (a/b)⁻ⁿ = (b/a)ⁿ.",
      "负整数指数表示正整数次幂的倒数：对任何非零的 b，b⁻ⁿ = 1/bⁿ。它并不会使数变成负数：2⁻³ = 1/8。对于分数，(a/b)⁻ⁿ = (b/a)ⁿ。",
    ),
    ["the-zeroth-power"],
    ["8.EE.A.1"],
    [
      lesson(
        "evaluating-negative-powers",
        ["Evaluating negative powers", "计算负整数指数幂"],
        [
          [
            "Keep stepping down past $2^{0} = 1$, dividing by $2$ each time: $2^{-1} = \\frac{1}{2}$, $2^{-2} = \\frac{1}{4}$, $2^{-3} = \\frac{1}{8}$. So $b^{-n} = \\frac{1}{b^{n}}$. For a fraction, flip it and use the positive power: $\\left(\\frac{2}{3}\\right)^{-2} = \\left(\\frac{3}{2}\\right)^{2} = \\frac{9}{4}$.",
            "从 $2^{0} = 1$ 继续往下走，每次除以 $2$：$2^{-1} = \\frac{1}{2}$，$2^{-2} = \\frac{1}{4}$，$2^{-3} = \\frac{1}{8}$。所以 $b^{-n} = \\frac{1}{b^{n}}$。对于分数，先把它倒过来，再用正指数：$\\left(\\frac{2}{3}\\right)^{-2} = \\left(\\frac{3}{2}\\right)^{2} = \\frac{9}{4}$。",
          ],
          [
            "Multiply back: $2^{-3} \\cdot 2^{3} = \\frac{1}{8} \\cdot 8 = 1 = 2^{0}$.",
            "乘回去：$2^{-3} \\cdot 2^{3} = \\frac{1}{8} \\cdot 8 = 1 = 2^{0}$。",
          ],
          [
            "A negative exponent does not make the number negative. $2^{-3}$ is $\\frac{1}{8}$, not $-8$.",
            "负指数不会让数变成负数。$2^{-3}$ 是 $\\frac{1}{8}$，不是 $-8$。",
          ],
        ],
        (rng) => {
          const kind = rng.pick(["integer", "negative", "fraction"] as const);
          const b = kind === "fraction" ? rng.pick(fractionBases) : Q.of(kind === "negative" ? -rng.int(2, 5) : rng.pick(smallBases));
          const n = b.abs().cmp(Q.of(5)) > 0 || !b.isInteger() ? rng.int(1, 3) : rng.int(1, 4);
          const answer = Q.one.div(b.pow(n));
          const flipped = Q.one.div(b);
          return valued(
            [`Evaluate $${power(b, -n)}$.`, `计算 $${power(b, -n)}$。`],
            answer,
            [
              b.isInteger()
                ? [
                    ["Write the reciprocal", "写成倒数"],
                    ["A negative exponent means one over the positive power:", "负指数表示正整数次幂的倒数："],
                    [`${power(b, -n)} = \\frac{1}{${power(b, n)}}`],
                  ]
                : [
                    ["Flip the fraction", "把分数倒过来"],
                    ["The reciprocal of the base takes the positive exponent:", "底数取倒数，指数变成正数："],
                    [`${power(b, -n)} = ${power(flipped, n)}`],
                  ],
              [
                ["Work out the power", "算出这个幂"],
                ["Multiply the factors:", "把因数乘起来："],
                [
                  b.isInteger()
                    ? `\\frac{1}{${power(b, n)}} = \\frac{1}{${b.pow(n).toLatex()}}${answer.toLatex().startsWith("-") ? ` = ${answer.toLatex()}` : ""}`
                    : `${power(flipped, n)} = ${answer.toLatex()}`,
                ],
              ],
            ],
            [
              `Multiply back by the positive power. The product should be $${power(b, 0)} = 1$, and it is: $${answer.toLatex()} \\cdot ${b.pow(n).toLatex().startsWith("-") ? `\\left(${b.pow(n).toLatex()}\\right)` : b.pow(n).toLatex()} = 1$.`,
              `乘以正整数次幂验证。乘积应当是 $${power(b, 0)} = 1$，确实如此：$${answer.toLatex()} \\cdot ${b.pow(n).toLatex().startsWith("-") ? `\\left(${b.pow(n).toLatex()}\\right)` : b.pow(n).toLatex()} = 1$。`,
            ],
            [
              [b.pow(n).neg(), "That makes the number negative instead of taking the reciprocal.", "这是把数变成了负数，而不是取倒数。"],
              [
                Q.one.div(b.mul(Q.of(n))),
                "That multiplies the base by the exponent before taking the reciprocal.",
                "这是先用底数乘指数，再取倒数。",
              ],
              [b.pow(n), "That drops the minus sign of the exponent.", "这是丢掉了指数的负号。"],
              [b.mul(Q.of(-n)), "That multiplies the base by the exponent.", "这是用底数乘指数。"],
            ],
          );
        },
        fractionSteps(2, 3, [
          "A number line from 0 to 1 with 2⁰ = 1, 2⁻¹ = 1/2, 2⁻² = 1/4 and 2⁻³ = 1/8 marked; each jump to the left halves the number.",
          "一条从 0 到 1 的数轴，标出 2⁰ = 1、2⁻¹ = 1/2、2⁻² = 1/4 和 2⁻³ = 1/8；每向左跳一次，数就减半。",
        ]),
      ),
      lesson(
        "writing-with-positive-exponents",
        ["Writing with positive exponents", "写成正整数指数"],
        [
          [
            "A factor with a negative exponent moves across the fraction bar, and its exponent turns positive. Only that factor moves. $3x^{-2} = \\frac{3}{x^{2}}$, because the exponent is on $x$ alone. A negative power below the bar moves up: $\\frac{1}{y^{-4}} = y^{4}$.",
            "带负指数的因数移到分数线的另一边，指数变成正数。只有这个因数移动。$3x^{-2} = \\frac{3}{x^{2}}$，因为指数只作用于 $x$。分数线下面的负指数幂移到上面：$\\frac{1}{y^{-4}} = y^{4}$。",
          ],
          [
            "Try $x = 2$: $3 \\cdot 2^{-2} = 3 \\cdot \\frac{1}{4} = \\frac{3}{4}$, and $\\frac{3}{2^{2}} = \\frac{3}{4}$ too.",
            "取 $x = 2$：$3 \\cdot 2^{-2} = 3 \\cdot \\frac{1}{4} = \\frac{3}{4}$，而 $\\frac{3}{2^{2}}$ 也是 $\\frac{3}{4}$。",
          ],
          [
            "Leave the number in front where it is. $3x^{-2}$ is not $\\frac{1}{3x^{2}}$.",
            "前面的数不要动。$3x^{-2}$ 不是 $\\frac{1}{3x^{2}}$。",
          ],
        ],
        (rng) => {
          const c = rng.pick([1, 2, 3, 4, 5, 7, -2, -3]);
          const [m, n] = [rng.int(1, 6), rng.int(1, 5)];
          const kind = rng.pick(["one", "two", "below"] as const);
          if (kind === "below") {
            const expr = `\\frac{${c}}{x^{-${m}}}`;
            const xm = mono(1, [["x", m]]);
            const answer = mono(c, [["x", m]]);
            return expressed(
              [`Write $${expr}$ using only positive exponents.`, `只用正整数指数写出 $${expr}$。`],
              answer,
              [
                [
                  ["Find the negative power", "找出负指数幂"],
                  [`$x^{-${m}}$ is below the bar.`, `$x^{-${m}}$ 在分数线下面。`],
                ],
                [
                  ["Move it up", "移到上面"],
                  ["It crosses the bar and its exponent turns positive:", "它越过分数线，指数变成正数："],
                  [`${expr} = ${answer}`],
                ],
              ],
              [
                `Dividing by $x^{-${m}} = \\frac{1}{${xm}}$ is multiplying by $${xm}$, so the result is $${answer}$.`,
                `除以 $x^{-${m}} = \\frac{1}{${xm}}$ 就是乘以 $${xm}$，所以结果是 $${answer}$。`,
              ],
              [
                [
                  `\\frac{${c}}{${xm}}`,
                  "That changes the sign of the exponent but leaves the power below the bar.",
                  "这是改了指数的符号，却把幂留在了分数线下面。",
                ],
                [`\\frac{${xm}}{${c}}`, "That moves the number as well; only the power moves.", "这是把数也移动了；只有幂要移动。"],
              ],
              { simplified: true },
            );
          }
          const fs: Factors =
            kind === "one"
              ? [["x", -m]]
              : [
                  ["x", m],
                  ["y", -n],
                ];
          const expr = mono(c, fs);
          const answer = positive(Q.of(c), fs);
          const moving = kind === "one" ? `x^{-${m}}` : `y^{-${n}}`;
          const moved = kind === "one" ? mono(1, [["x", m]]) : mono(1, [["y", n]]);
          return expressed(
            [`Write $${expr}$ using only positive exponents.`, `只用正整数指数写出 $${expr}$。`],
            answer,
            [
              [
                ["Find the negative power", "找出负指数幂"],
                [`Only $${moving}$ has a negative exponent.`, `只有 $${moving}$ 的指数是负数。`],
              ],
              [
                ["Move it below the bar", "移到分数线下面"],
                [`It becomes $${moved}$ below the bar; the rest stays on top:`, `它在分数线下面变成 $${moved}$；其余部分留在上面：`],
                [`${expr} = ${answer}`],
              ],
            ],
            [
              `Multiply out: $${moving} = \\frac{1}{${moved}}$, so $${expr} = ${kind === "one" ? c : mono(c, [["x", m]])} \\cdot \\frac{1}{${moved}} = ${answer}$.`,
              `乘出来：$${moving} = \\frac{1}{${moved}}$，所以 $${expr} = ${kind === "one" ? c : mono(c, [["x", m]])} \\cdot \\frac{1}{${moved}} = ${answer}$。`,
            ],
            [
              [
                kind === "one" ? `\\frac{1}{${mono(c, [["x", m]])}}` : `\\frac{x^{${m}}}{${mono(c, [["y", n]])}}`,
                "That moves the number in front as well; only the power with the negative exponent moves.",
                "这是把前面的数也移动了；只有负指数幂要移动。",
              ],
              [
                mono(
                  -c,
                  fs.map(([v, e]) => [v, Math.abs(e)] as const),
                ),
                "That makes the number negative instead of moving the power.",
                "这是把数变成负数，而不是移动这个幂。",
              ],
            ],
            { simplified: true },
          );
        },
        tapeFigure(
          [
            {
              pieces: [
                { size: 1, text: "3" },
                { size: 1, text: "x⁻²", lit: true },
              ],
            },
            {
              pieces: [
                { size: 1, text: "3" },
                { size: 1, text: "÷ x²", lit: true },
              ],
            },
          ],
          [
            "Two bars of the same length: 3 then x⁻² on top, and 3 then ÷ x² below, showing that only the x part moves.",
            "两个一样长的长条：上面是 3 和 x⁻²，下面是 3 和 ÷ x²，说明只有 x 的部分移动。",
          ],
        ),
      ),
      lesson(
        "the-exponent-that-gives-a-unit-fraction",
        ["The exponent that gives a unit fraction", "得到单位分数的指数"],
        [
          [
            "Read a negative exponent backwards. $\\frac{1}{9} = \\frac{1}{3^{2}} = 3^{-2}$, so $3^{x} = \\frac{1}{9}$ means $x = -2$. Flipping the base flips the sign: $\\left(\\frac{1}{3}\\right)^{x} = 9$ means $3^{-x} = 3^{2}$, so $x = -2$ again.",
            "把负指数倒过来读。$\\frac{1}{9} = \\frac{1}{3^{2}} = 3^{-2}$，所以 $3^{x} = \\frac{1}{9}$ 说明 $x = -2$。底数倒过来，指数就变号：$\\left(\\frac{1}{3}\\right)^{x} = 9$ 就是 $3^{-x} = 3^{2}$，所以 $x$ 还是 $-2$。",
          ],
          ["Put it back: $3^{-2} = \\frac{1}{3^{2}} = \\frac{1}{9}$.", "代回去：$3^{-2} = \\frac{1}{3^{2}} = \\frac{1}{9}$。"],
          [
            "Keep the sign. $3^{2} = 9$, not $\\frac{1}{9}$, so $x = 2$ is wrong.",
            "要保留符号。$3^{2} = 9$，不是 $\\frac{1}{9}$，所以 $x = 2$ 是错的。",
          ],
        ],
        (rng) => {
          const b = rng.pick([2, 3, 4, 5, 10]);
          const n = rng.int(2, 5);
          const p = b ** n;
          const flipped = rng.bool();
          const answer = -n;
          return valued(
            flipped
              ? [`Find $x$ if $\\left(\\frac{1}{${b}}\\right)^{x} = ${p}$.`, `已知 $\\left(\\frac{1}{${b}}\\right)^{x} = ${p}$，求 $x$。`]
              : [`Find $x$ if $${b}^{x} = \\frac{1}{${p}}$.`, `已知 $${b}^{x} = \\frac{1}{${p}}$，求 $x$。`],
            answer,
            [
              [
                ["Write both sides as powers of the same base", "两边写成同底数的幂"],
                flipped
                  ? [`$\\frac{1}{${b}} = ${b}^{-1}$ and $${p} = ${b}^{${n}}$:`, `$\\frac{1}{${b}} = ${b}^{-1}$，$${p} = ${b}^{${n}}$：`]
                  : [
                      `$${p} = ${b}^{${n}}$, so its reciprocal has exponent $-${n}$:`,
                      `$${p} = ${b}^{${n}}$，所以它的倒数的指数是 $-${n}$：`,
                    ],
                [flipped ? `${b}^{-x} = ${b}^{${n}}` : `${b}^{x} = ${b}^{-${n}}`],
              ],
              [
                ["Match the exponents", "让指数相等"],
                ["The bases match, so the exponents must too:", "底数相同，指数也必须相同："],
                [flipped ? `-x = ${n}` : `x = -${n}`, ...(flipped ? [`x = -${n}`] : [])],
              ],
            ],
            flipped
              ? [
                  `Put it back: $\\left(\\frac{1}{${b}}\\right)^{-${n}} = ${b}^{${n}} = ${p}$.`,
                  `代回去：$\\left(\\frac{1}{${b}}\\right)^{-${n}} = ${b}^{${n}} = ${p}$。`,
                ]
              : [
                  `Put it back: $${b}^{-${n}} = \\frac{1}{${b}^{${n}}} = \\frac{1}{${p}}$.`,
                  `代回去：$${b}^{-${n}} = \\frac{1}{${b}^{${n}}} = \\frac{1}{${p}}$。`,
                ],
            [
              [n, "That drops the minus sign of the exponent.", "这是丢掉了指数的负号。"],
              [answer - 1, "That counts one factor too many.", "这是多数了一个因数。"],
              [answer + 1, "That counts one factor too few.", "这是少数了一个因数。"],
              [-p, `That uses $${p}$ itself as the exponent.`, `这是把 $${p}$ 本身当成了指数。`],
            ],
            { solveFor: "x" },
          );
        },
        fractionSteps(3, 2, [
          "A number line from 0 to 1 with 3⁰ = 1, 3⁻¹ = 1/3 and 3⁻² = 1/9 marked; each jump to the left divides by 3.",
          "一条从 0 到 1 的数轴，标出 3⁰ = 1、3⁻¹ = 1/3 和 3⁻² = 1/9；每向左跳一次就除以 3。",
        ]),
      ),
    ],
  ),
  [
    "A chef halves a $1$-liter jug of soup again and again. After one pour there is $\\frac{1}{2}$ liter, after two $\\frac{1}{4}$, after three $\\frac{1}{8}$.",
    "厨师把 $1$ 升汤一次次地倒掉一半。倒一次剩 $\\frac{1}{2}$ 升，倒两次剩 $\\frac{1}{4}$ 升，倒三次剩 $\\frac{1}{8}$ 升。",
  ],
  [
    "$\\frac{1}{8} = \\frac{1}{2^{3}}$, and we write it $2^{-3}$: three halvings below $2^{0} = 1$.",
    "$\\frac{1}{8} = \\frac{1}{2^{3}}$，我们把它写成 $2^{-3}$：从 $2^{0} = 1$ 往下减半三次。",
  ],
  [
    "read negative exponents as reciprocals and write expressions with positive exponents.",
    "把负指数读成倒数，并把式子写成正整数指数的形式。",
  ],
);

/** evaluatingExpressionsWithIntegerExponents evaluates numerical and algebraic expressions with zero and negative exponents. */
export const evaluatingExpressionsWithIntegerExponents = topic(
  "evaluating-expressions-with-integer-exponents",
  t("Evaluating Expressions With Integer Exponents", "计算含整数指数的式子"),
  t(
    "Evaluate zero and negative powers first, following the order of operations: b⁰ = 1 and b⁻ⁿ = 1/bⁿ. A coefficient in front of a power multiplies the power after it is evaluated: 3 · 2⁻² = 3/4.",
    "按照运算顺序，先算零次幂和负整数指数幂：b⁰ = 1，b⁻ⁿ = 1/bⁿ。幂前面的系数要在算出幂之后再相乘：3 · 2⁻² = 3/4。",
  ),
  ["negative-exponents", "evaluating-expressions-with-positive-integer-exponents"],
  ["8.EE.A.1"],
  [
    {
      id: "numerical-expressions-with-integer-exponents",
      title: t("Numerical expressions", "数的式子"),
      explanation: t(
        "A negative exponent means the reciprocal of the positive power, $a^{-n} = \\frac{1}{a^{n}}$, and any nonzero number to the power zero is $1$. Evaluate every power first, then multiply, divide, add and subtract in the usual order.\n\nIn $3 \\cdot 2^{-2} + 5^{0}$, evaluate the powers first: $2^{-2} = \\frac{1}{4}$ and $5^{0} = 1$. Then $3 \\cdot \\frac{1}{4} + 1 = \\frac{7}{4}$. A negative exponent never makes the value negative.",
        "负整数指数表示正整数次幂的倒数，$a^{-n} = \\frac{1}{a^{n}}$；任何非零数的零次幂都等于 $1$。先算出每个乘方，再按通常的顺序进行乘除和加减。\n\n在 $3 \\cdot 2^{-2} + 5^{0}$ 中先算乘方：$2^{-2} = \\frac{1}{4}$，$5^{0} = 1$。于是 $3 \\cdot \\frac{1}{4} + 1 = \\frac{7}{4}$。负整数指数不会使值变成负数。",
      ),
      generate(rng) {
        const [b, k] = [rng.pick([2, 3, 4, 5, 10]), rng.int(1, 3)];
        const c = rng.int(2, 9);
        const [d, j] = [rng.pick([2, 3, 4, 6]), rng.int(1, 2)];
        const third = rng.pick(["zero", "negative"] as const);
        const op = rng.pick([1, -1]);
        const p = Q.of(b).pow(k);
        const q = third === "zero" ? Q.one : Q.one.div(Q.of(d).pow(j));
        const second = third === "zero" ? `${d}^{0}` : `${d}^{-${j}}`;
        const expr = `${c} \\cdot ${b}^{-${k}} ${op > 0 ? "+" : "-"} ${second}`;
        const value = (first: Q, other: Q) =>
          Q.of(c)
            .mul(first)
            .add(other.mul(Q.of(op)));
        const answer = value(Q.one.div(p), q);
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
          answer,
          // Negative powers taken as negative numbers, the zeroth power taken as 0, and the coefficient raised to the power too.
          wrong: [
            value(p.neg(), third === "zero" ? Q.one : Q.of(d).pow(j).neg()),
            value(Q.one.div(p), third === "zero" ? Q.zero : q),
            Q.one.div(Q.of(c * b).pow(k)).add(q.mul(Q.of(op))),
          ],
          solution: t(
            `Evaluate the powers first: $${b}^{-${k}} = \\frac{1}{${p.toLatex()}}$ and $${second} = ${q.toLatex()}$.${steps(`${c} \\cdot \\frac{1}{${p.toLatex()}} ${op > 0 ? "+" : "-"} ${q.toLatex()} = ${answer.toLatex()}`)}`,
            `先算乘方：$${b}^{-${k}} = \\frac{1}{${p.toLatex()}}$，$${second} = ${q.toLatex()}$。${steps(`${c} \\cdot \\frac{1}{${p.toLatex()}} ${op > 0 ? "+" : "-"} ${q.toLatex()} = ${answer.toLatex()}`)}`,
          ),
        });
      },
    },
    {
      id: "substituting-into-negative-powers",
      title: t("Substituting into negative powers", "代入负整数指数幂"),
      explanation: t(
        "To evaluate $3x^{-2} - x^{0}$ for $x = -2$, substitute in parentheses: $3(-2)^{-2} - (-2)^{0} = 3 \\cdot \\frac{1}{4} - 1 = -\\frac{1}{4}$. The exponent applies to $x$, not to $3x$, and $(-2)^{-2}$ is positive because the power $(-2)^{2}$ is.",
        "求 $x = -2$ 时 $3x^{-2} - x^{0}$ 的值，代入时加上括号：$3(-2)^{-2} - (-2)^{0} = 3 \\cdot \\frac{1}{4} - 1 = -\\frac{1}{4}$。指数作用于 $x$ 而不是 $3x$；$(-2)^{-2}$ 是正数，因为 $(-2)^{2}$ 是正数。",
      ),
      generate(rng) {
        const x = rng.pick([-3, -2, 2, 3, 4, 5]);
        const c = rng.int(2, 8);
        const k = rng.int(1, Math.abs(x) > 3 ? 1 : 2);
        const d = rng.pick([0, 1, 2, 3, 5]);
        const op = rng.pick([1, -1]);
        const last = d === 0 ? "x^{0}" : String(d);
        const lastValue = d === 0 ? Q.one : Q.of(d);
        const expr = `${c}x^{-${k}} ${op > 0 ? "+" : "-"} ${last}`;
        const px = Q.of(x).pow(k);
        const answer = Q.of(c)
          .div(px)
          .add(lastValue.mul(Q.of(op)));
        return numberProblem({
          prompt: t(`Evaluate $${expr}$ for $x = ${x}$.`, `当 $x = ${x}$ 时，求 $${expr}$ 的值。`),
          answer,
          // The power read as a negative number, the coefficient raised to the power too, and the zeroth power taken as 0.
          wrong: [
            Q.of(c)
              .mul(px.neg())
              .add(lastValue.mul(Q.of(op))),
            Q.one.div(Q.of(c * x).pow(k)).add(lastValue.mul(Q.of(op))),
            ...(d === 0 ? [Q.of(c).div(px)] : []),
          ],
          solution: t(
            `Substitute $x = ${x}$ in parentheses and evaluate the powers first:${steps(`${c}(${x})^{-${k}} ${op > 0 ? "+" : "-"} ${d === 0 ? `(${x})^{0}` : d} = ${c} \\cdot \\frac{1}{${px.toLatex()}} ${op > 0 ? "+" : "-"} ${lastValue.toLatex()} = ${answer.toLatex()}`)}`,
            `把 $x = ${x}$ 加括号代入，先算乘方：${steps(`${c}(${x})^{-${k}} ${op > 0 ? "+" : "-"} ${d === 0 ? `(${x})^{0}` : d} = ${c} \\cdot \\frac{1}{${px.toLatex()}} ${op > 0 ? "+" : "-"} ${lastValue.toLatex()} = ${answer.toLatex()}`)}`,
          ),
        });
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// The rules of exponents

/** exps draws a nonzero exponent, negative with the given probability. */
function exps(rng: Rng, negative = 0.35): number {
  const e = rng.int(1, 9);
  return rng.bool(negative) ? -e : e;
}

/** theProductRuleForExponents multiplies powers of the same base by adding exponents. */
export const theProductRuleForExponents = withIntro(
  topic(
    "the-product-rule-for-exponents",
    t("The Product Rule for Exponents", "同底数幂的乘法"),
    t(
      "To multiply powers of the same base, keep the base and add the exponents: bᵐ · bⁿ = bᵐ⁺ⁿ. The rule holds for negative exponents too. The exponents are added, not multiplied, and the bases must be the same.",
      "同底数幂相乘，底数不变，指数相加：bᵐ · bⁿ = bᵐ⁺ⁿ。指数为负数时法则同样成立。指数是相加而不是相乘，而且底数必须相同。",
    ),
    ["negative-exponents"],
    ["8.EE.A.1"],
    [
      lesson(
        "multiplying-powers-of-a-number",
        ["Multiplying powers of a number", "同底数的数的幂相乘"],
        [
          [
            "$5^{3} \\cdot 5^{4}$ is three factors of $5$ and then four more. That is $7$ factors in all, so $5^{3} \\cdot 5^{4} = 5^{3 + 4} = 5^{7}$. With a negative exponent some factors cancel: $5^{3} \\cdot 5^{-7} = 5^{3 + (-7)} = 5^{-4}$.",
            "$5^{3} \\cdot 5^{4}$ 是三个 $5$ 相乘，再乘四个 $5$。一共 $7$ 个因数，所以 $5^{3} \\cdot 5^{4} = 5^{3 + 4} = 5^{7}$。指数是负数时，有些因数会约掉：$5^{3} \\cdot 5^{-7} = 5^{3 + (-7)} = 5^{-4}$。",
          ],
          [
            "$2^{2} \\cdot 2^{3} = 4 \\cdot 8 = 32$, and $2^{5} = 32$ too.",
            "$2^{2} \\cdot 2^{3} = 4 \\cdot 8 = 32$，而 $2^{5}$ 也是 $32$。",
          ],
          [
            "Add the exponents, do not multiply them. $5^{3} \\cdot 5^{4}$ is not $5^{12}$.",
            "指数要相加，不是相乘。$5^{3} \\cdot 5^{4}$ 不是 $5^{12}$。",
          ],
        ],
        (rng) => {
          const b = rng.int(2, 9);
          const es = Array.from({ length: rng.bool(0.3) ? 3 : 2 }, () => exps(rng));
          const k = es.reduce((a, e) => a + e, 0);
          const expr = es.map((e) => `${b}^{${e}}`).join(" \\cdot ");
          const allUp = es.every((e) => e > 0);
          return valued(
            [
              `Write $${expr}$ as a single power of $${b}$, in the form $${b}^{n}$. What is $n$?`,
              `把 $${expr}$ 写成以 $${b}$ 为底的一个幂 $${b}^{n}$。$n$ 是多少？`,
            ],
            k,
            [
              [
                ["Check the bases", "看底数"],
                [`Every factor is a power of $${b}$, so the exponents add:`, `每个因数都是 $${b}$ 的幂，所以指数相加：`],
                [`${expr} = ${b}^{${es.map(signed).join(" + ")}}`],
              ],
              [
                ["Add the exponents", "指数相加"],
                ["Add them with their signs:", "带着符号相加："],
                [`${es.map(signed).join(" + ")} = ${k}`],
              ],
            ],
            allUp
              ? [
                  `Count the factors of $${b}$: groups of $${es.join("$ and $")}$ make $${k}$ in all.`,
                  `数 $${b}$ 的个数：$${es.join("$ 个、$")}$ 个合起来共 $${k}$ 个。`,
                ]
              : [
                  `Think of each negative power as dividing: every factor of $${b}$ below the bar cancels one above, which leaves $${b}^{${k}}$.`,
                  `把负指数幂看成除法：分数线下面的每个 $${b}$ 约掉上面的一个，剩下 $${b}^{${k}}$。`,
                ],
            [
              [
                es.reduce((a, e) => a * e, 1),
                "That multiplies the exponents; multiplying powers adds them.",
                "这是把指数相乘了；同底数幂相乘，指数相加。",
              ],
              [es.reduce((a, e) => a + Math.abs(e), 0), "That drops the minus signs of the exponents.", "这是丢掉了指数的负号。"],
            ],
            { solveFor: "n" },
          );
        },
        factorTape(
          [
            ["5", 3],
            ["5", 4],
          ],
          "5⁷",
          [
            "One bar of 7 factors of 5: a group of 3 and a shaded group of 4, with 5⁷ over the whole bar.",
            "一个由 7 个因数 5 组成的长条：一组 3 个和涂色的一组 4 个，整个长条上方写着 5⁷。",
          ],
        ),
      ),
      lesson(
        "multiplying-monomials",
        ["Multiplying monomials", "单项式相乘"],
        [
          [
            "To multiply monomials, multiply the numbers in front. Then add the exponents of each letter. $(2x^{3}y)(-4x^{5}y^{2}) = -8x^{8}y^{3}$, since $y$ means $y^{1}$. A negative exponent goes below the bar: $x^{2} \\cdot x^{-5} = x^{-3} = \\frac{1}{x^{3}}$.",
            "单项式相乘，先把前面的数相乘，再把同一个字母的指数相加。$(2x^{3}y)(-4x^{5}y^{2}) = -8x^{8}y^{3}$，因为 $y$ 就是 $y^{1}$。负指数要移到分数线下面：$x^{2} \\cdot x^{-5} = x^{-3} = \\frac{1}{x^{3}}$。",
          ],
          [
            "Count the letters: $x^{3}$ and $x^{5}$ hold $3 + 5 = 8$ factors of $x$, and $y$ and $y^{2}$ hold $3$ factors of $y$.",
            "数字母：$x^{3}$ 和 $x^{5}$ 共有 $3 + 5 = 8$ 个 $x$，$y$ 和 $y^{2}$ 共有 $3$ 个 $y$。",
          ],
          ["The numbers in front multiply. $2$ and $-4$ give $-8$, not $-2$.", "前面的数要相乘。$2$ 和 $-4$ 得 $-8$，不是 $-2$。"],
        ],
        (rng) => {
          const [a, b] = [rng.pick([1, 2, 3, 4, 5, -2, -3]), rng.pick([2, 3, 4, 5, 6, -1, -4])];
          const [m, n] = [rng.int(1, 7), rng.bool(0.3) ? -rng.int(1, 9) : rng.int(1, 6)];
          const [p, q] = rng.bool(0.5) ? [rng.int(1, 4), rng.int(1, 4)] : [0, 0];
          const left: Factors = [
            ["x", m],
            ["y", p],
          ];
          const right: Factors = [
            ["x", n],
            ["y", q],
          ];
          const sumF: Factors = [
            ["x", m + n],
            ["y", p + q],
          ];
          const answer = positive(Q.of(a * b), sumF);
          const timesF: Factors = [
            ["x", m * n],
            ["y", p * q],
          ];
          const saids: Said[] = [];
          if (m * n !== m + n || p * q !== p + q)
            saids.push([
              positive(Q.of(a * b), timesF),
              "That multiplies the exponents; multiplying powers adds them.",
              "这是把指数相乘了；同底数幂相乘，指数相加。",
            ]);
          if (a + b !== a * b)
            saids.push([
              positive(Q.of(a + b), sumF),
              "That adds the numbers in front; they multiply.",
              "这是把前面的数相加了；它们应该相乘。",
            ]);
          return expressed(
            [
              `Simplify $(${mono(a, left)})(${mono(b, right)})$. Use only positive exponents.`,
              `化简 $(${mono(a, left)})(${mono(b, right)})$，结果只用正整数指数。`,
            ],
            answer,
            [
              [
                ["Multiply the numbers", "数相乘"],
                ["The numbers in front multiply:", "前面的数相乘："],
                [`${a} \\cdot ${signed(b)} = ${a * b}`],
              ],
              [
                ["Add the exponents", "指数相加"],
                [
                  "Add the exponents of each letter, and move any negative power below the bar:",
                  "同一个字母的指数相加，负指数幂移到分数线下面：",
                ],
                [`x^{${m} + ${signed(n)}}${p + q ? `y^{${p} + ${q}}` : ""} \\to ${answer}`],
              ],
            ],
            [
              `Count the factors of $x$: $${m}$ and $${signed(n)}$ make $${m + n}$${p + q ? `; of $y$: $${p}$ and $${q}$ make $${p + q}$` : ""}.`,
              `数 $x$ 的个数：$${m}$ 和 $${signed(n)}$ 合起来是 $${m + n}$${p + q ? `；$y$ 的个数：$${p}$ 和 $${q}$ 合起来是 $${p + q}$` : ""}。`,
            ],
            saids,
            { simplified: true },
          );
        },
        factorTape(
          [
            ["x", 3],
            ["x", 5],
          ],
          "x⁸",
          [
            "One bar of 8 factors of x: a group of 3 and a shaded group of 5, with x⁸ over the whole bar.",
            "一个由 8 个因数 x 组成的长条：一组 3 个和涂色的一组 5 个，整个长条上方写着 x⁸。",
          ],
        ),
      ),
      lesson(
        "a-missing-exponent-in-a-product-or-quotient",
        ["A missing exponent in a product or quotient", "积或商中缺失的指数"],
        [
          [
            "$2^{3} \\times 2^{x} = 2^{7}$. Multiplying adds the exponents, so $3 + x = 7$ and $x = 4$. For a quotient the exponents subtract: $2^{9} \\div 2^{x} = 2^{7}$ gives $9 - x = 7$, so $x = 2$.",
            "$2^{3} \\times 2^{x} = 2^{7}$。相乘时指数相加，所以 $3 + x = 7$，$x = 4$。相除时指数相减：$2^{9} \\div 2^{x} = 2^{7}$ 得 $9 - x = 7$，所以 $x = 2$。",
          ],
          [
            "Put it back: $2^{3} \\times 2^{4} = 8 \\times 16 = 128 = 2^{7}$.",
            "代回去：$2^{3} \\times 2^{4} = 8 \\times 16 = 128 = 2^{7}$。",
          ],
          [
            "Do not add the two exponents you see. $3 + 7 = 10$ is not the missing one.",
            "不要把看到的两个指数相加。$3 + 7 = 10$ 不是缺的那个指数。",
          ],
        ],
        (rng) => {
          const b = rng.pick([2, 3, 5, 7, 10]);
          const m = rng.int(2, 12);
          const n = rng.pick([...Array(11).keys()].map((i) => i + 2).filter((v) => v !== m));
          const product = rng.bool();
          const answer = product ? n - m : m - n;
          const op = product ? "\\times" : "\\div";
          return valued(
            [`Find $x$ if $${b}^{${m}} ${op} ${b}^{x} = ${b}^{${n}}$.`, `已知 $${b}^{${m}} ${op} ${b}^{x} = ${b}^{${n}}$，求 $x$。`],
            answer,
            [
              [
                ["Write an equation for the exponents", "列出指数的方程"],
                [
                  product ? "Multiplying adds the exponents:" : "Dividing subtracts the exponents:",
                  product ? "相乘时指数相加：" : "相除时指数相减：",
                ],
                [product ? `${m} + x = ${n}` : `${m} - x = ${n}`],
              ],
              [
                ["Solve", "解方程"],
                [
                  product ? `Subtract $${m}$:` : `Move $x$ across and subtract $${n}$:`,
                  product ? `两边减 $${m}$：` : `移项，再减去 $${n}$：`,
                ],
                [`x = ${product ? `${n} - ${m}` : `${m} - ${n}`} = ${answer}`],
              ],
            ],
            [
              product
                ? `Put it back: $${m} + ${signed(answer)} = ${n}$, the exponent on the right.`
                : `Put it back: $${m} - ${signed(answer)} = ${n}$, the exponent on the right.`,
              product
                ? `代回去：$${m} + ${signed(answer)} = ${n}$，正是右边的指数。`
                : `代回去：$${m} - ${signed(answer)} = ${n}$，正是右边的指数。`,
            ],
            [
              [m + n, "That adds the two exponents you can see.", "这是把看得见的两个指数相加了。"],
              [-answer, "That subtracts in the wrong order.", "这是减反了。"],
              [m * n, "That multiplies the exponents.", "这是把指数相乘了。"],
            ],
            { solveFor: "x" },
          );
        },
        tapeFigure(
          [
            {
              total: "2⁷",
              pieces: [
                { size: 3, text: "2³" },
                { size: 4, text: "2ˣ", lit: true },
              ],
            },
          ],
          [
            "A bar of 7 factors of 2 over the brace 2⁷, made of a part 2³ of 3 factors and a shaded part 2ˣ of 4 factors.",
            "一个长条上方写着 2⁷，共 7 个因数 2，分成 3 个因数的 2³ 和涂色的 4 个因数的 2ˣ。",
          ],
        ),
      ),
    ],
  ),
  [
    "A tray holds $10^{2} = 100$ seeds. A shed holds $10^{3} = 1{,}000$ trays. How many seeds are in the shed?",
    "一个托盘装 $10^{2} = 100$ 粒种子。一个棚子放 $10^{3} = 1{,}000$ 个托盘。棚子里一共有多少粒种子？",
  ],
  [
    "$100 \\times 1{,}000 = 100{,}000$, which is $1$ with $5$ zeros: $10^{2} \\cdot 10^{3} = 10^{5}$, and $2 + 3 = 5$.",
    "$100 \\times 1{,}000 = 100{,}000$，是 $1$ 后面跟 $5$ 个 $0$：$10^{2} \\cdot 10^{3} = 10^{5}$，而 $2 + 3 = 5$。",
  ],
  ["multiply powers of the same base by adding their exponents.", "用指数相加的方法计算同底数幂的乘法。"],
);

/** theQuotientRuleForExponents divides powers of the same base by subtracting exponents. */
export const theQuotientRuleForExponents = topic(
  "the-quotient-rule-for-exponents",
  t("The Quotient Rule for Exponents", "同底数幂的除法"),
  t(
    "To divide powers of the same nonzero base, keep the base and subtract the exponent of the denominator from that of the numerator: bᵐ ÷ bⁿ = bᵐ⁻ⁿ. If the denominator has the larger exponent, the result has a negative exponent.",
    "同底数（非零）幂相除，底数不变，用分子的指数减去分母的指数：bᵐ ÷ bⁿ = bᵐ⁻ⁿ。如果分母的指数较大，结果的指数为负数。",
  ),
  ["the-product-rule-for-exponents"],
  ["8.EE.A.1"],
  [
    {
      id: "dividing-powers-of-a-number",
      title: t("Dividing powers of a number", "同底数的数的幂相除"),
      explanation: t(
        "In $\\frac{7^{9}}{7^{4}}$, four factors of $7$ cancel, leaving $7^{9 - 4} = 7^{5}$. Subtract in order, numerator minus denominator: $\\frac{7^{2}}{7^{6}} = 7^{2 - 6} = 7^{-4}$. With negative exponents, subtracting a negative adds: $\\frac{7^{3}}{7^{-2}} = 7^{3 - (-2)} = 7^{5}$.",
        "在 $\\frac{7^{9}}{7^{4}}$ 中，约去四个 $7$，剩下 $7^{9 - 4} = 7^{5}$。要按顺序相减，分子的指数减分母的指数：$\\frac{7^{2}}{7^{6}} = 7^{2 - 6} = 7^{-4}$。有负指数时，减去负数就是加：$\\frac{7^{3}}{7^{-2}} = 7^{3 - (-2)} = 7^{5}$。",
      ),
      generate(rng) {
        const b = rng.int(2, 9);
        const [m, n] = [exps(rng, 0.3), exps(rng, 0.3)];
        if (m === n) return this.generate(rng);
        const k = m - n;
        const expr = rng.bool(0.7) ? `\\frac{${b}^{${m}}}{${b}^{${n}}}` : `${b}^{${m}} \\div ${b}^{${n}}`;
        return exponentProblem(
          b,
          expr,
          k,
          t(
            `The bases are the same, so subtract the exponents, numerator minus denominator:${steps(`${expr} = ${b}^{${m} - ${signed(n)}} = ${b}^{${k}}`)}`,
            `底数相同，指数相减，用分子的指数减分母的指数：${steps(`${expr} = ${b}^{${m} - ${signed(n)}} = ${b}^{${k}}`)}`,
          ),
          // Subtracting the other way, adding, and dividing the exponents.
          [n - m, m + n, ...(n !== 0 && m % n === 0 ? [m / n] : [])],
        );
      },
    },
    {
      id: "dividing-monomials",
      title: t("Dividing monomials", "单项式相除"),
      explanation: t(
        "Divide the coefficients and subtract the exponents of each variable: $\\frac{12x^{7}y^{2}}{4x^{2}y^{5}} = 3x^{5}y^{-3} = \\frac{3x^{5}}{y^{3}}$. A variable whose exponent comes out negative ends up in the denominator.",
        "系数相除，同一个字母的指数相减：$\\frac{12x^{7}y^{2}}{4x^{2}y^{5}} = 3x^{5}y^{-3} = \\frac{3x^{5}}{y^{3}}$。指数算出来为负数的字母最后在分母中。",
      ),
      generate(rng) {
        const d = rng.int(2, 6);
        const k = rng.pick([1, 2, 3, 4, 5, -2, -3]);
        const [m, n] = [rng.int(2, 9), rng.int(1, 6)];
        const [p, q] = [rng.int(1, 5), rng.int(1, 6)];
        if (m === n && p === q) return this.generate(rng);
        const top: Factors = [
          ["x", m],
          ["y", p],
        ];
        const bottom: Factors = [
          ["x", n],
          ["y", q],
        ];
        const diff: Factors = [
          ["x", m - n],
          ["y", p - q],
        ];
        const expr = `\\frac{${mono(d * k, top)}}{${mono(d, bottom)}}`;
        const answer = positive(Q.of(k), diff);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$. Use only positive exponents.`, `化简 $${expr}$，结果只用正整数指数。`),
          answer,
          simplified: true,
          // Subtracting the coefficients, dividing the exponents, and subtracting the wrong way round.
          wrong: [
            ...(k === 1 ? [] : [positive(Q.of(d * k - d), diff)]),
            positive(Q.of(k), [
              ["x", n - m],
              ["y", q - p],
            ]),
            positive(Q.of(k), [
              ["x", m + n],
              ["y", p + q],
            ]),
          ],
          solution: t(
            `Divide the coefficients and subtract the exponents of each variable:${steps(`${expr} = ${k === 1 ? "" : k === -1 ? "-" : k}x^{${m} - ${n}}y^{${p} - ${q}} = ${answer}`)}`,
            `系数相除，同一个字母的指数相减：${steps(`${expr} = ${k === 1 ? "" : k === -1 ? "-" : k}x^{${m} - ${n}}y^{${p} - ${q}} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
);

/** thePowerRuleForExponents raises a power to a power by multiplying exponents. */
export const thePowerRuleForExponents = withIntro(
  topic(
    "the-power-rule-for-exponents",
    t("The Power Rule for Exponents", "幂的乘方"),
    t(
      "To raise a power to a power, keep the base and multiply the exponents: (bᵐ)ⁿ = bᵐⁿ. The signs of the exponents multiply like any numbers, so (b⁻²)³ = b⁻⁶ and (b⁻²)⁻³ = b⁶.",
      "幂的乘方，底数不变，指数相乘：(bᵐ)ⁿ = bᵐⁿ。指数的符号按普通乘法相乘，所以 (b⁻²)³ = b⁻⁶，(b⁻²)⁻³ = b⁶。",
    ),
    ["the-product-rule-for-exponents"],
    ["8.EE.A.1"],
    [
      lesson(
        "powers-of-powers-of-a-number",
        ["Powers of powers of a number", "数的幂的乘方"],
        [
          [
            "$(3^{2})^{4}$ is four copies of $3^{2}$: $3^{2} \\cdot 3^{2} \\cdot 3^{2} \\cdot 3^{2} = 3^{2 + 2 + 2 + 2} = 3^{8}$. Adding $2$ four times is $2 \\times 4$. So to raise a power to a power, multiply the exponents.",
            "$(3^{2})^{4}$ 是四个 $3^{2}$ 相乘：$3^{2} \\cdot 3^{2} \\cdot 3^{2} \\cdot 3^{2} = 3^{2 + 2 + 2 + 2} = 3^{8}$。四个 $2$ 相加就是 $2 \\times 4$。所以幂的乘方，指数相乘。",
          ],
          ["$(2^{2})^{3} = 4^{3} = 64$, and $2^{6} = 64$ too.", "$(2^{2})^{3} = 4^{3} = 64$，而 $2^{6}$ 也是 $64$。"],
          ["Multiply the exponents, do not add them. $(3^{2})^{4}$ is not $3^{6}$.", "指数要相乘，不是相加。$(3^{2})^{4}$ 不是 $3^{6}$。"],
        ],
        (rng) => {
          const b = rng.int(2, 9);
          const [m, n] = [exps(rng, 0.35), rng.bool(0.3) ? -rng.int(2, 5) : rng.int(2, 6)];
          const two = rng.bool(0.3);
          const p = two ? rng.int(1, 6) : 0;
          const expr = two ? `(${b}^{${m}})^{${n}} \\cdot ${b}^{${p}}` : `(${b}^{${m}})^{${n}}`;
          const k = m * n + p;
          return valued(
            [
              `Write $${expr}$ as a single power of $${b}$, in the form $${b}^{n}$. What is $n$?`,
              `把 $${expr}$ 写成以 $${b}$ 为底的一个幂 $${b}^{n}$。$n$ 是多少？`,
            ],
            k,
            [
              [
                ["Multiply the exponents", "指数相乘"],
                ["A power raised to a power multiplies the exponents:", "幂的乘方，指数相乘："],
                [`(${b}^{${m}})^{${n}} = ${b}^{${m} \\cdot ${signed(n)}} = ${b}^{${m * n}}`],
              ],
              two
                ? [
                    ["Add the last exponent", "加上最后的指数"],
                    ["Multiplying powers adds the exponents:", "同底数幂相乘，指数相加："],
                    [`${b}^{${m * n}} \\cdot ${b}^{${p}} = ${b}^{${k}}`],
                  ]
                : [
                    ["Read the exponent", "读出指数"],
                    [`So $n = ${k}$.`, `所以 $n = ${k}$。`],
                  ],
            ],
            n > 0
              ? [
                  `Write it as repeated multiplication: each of the $${n}$ copies of $${b}^{${m}}$ adds $${m}$ to the exponent, so the total is $${n} \\times ${signed(m)} = ${m * n}$${two ? `, and $${m * n} + ${p} = ${k}$` : ""}.`,
                  `写成连乘：$${n}$ 个 $${b}^{${m}}$ 相乘，每个都给指数加上 $${m}$，共 $${n} \\times ${signed(m)} = ${m * n}$${two ? `，再 $${m * n} + ${p} = ${k}$` : ""}。`,
                ]
              : [
                  `A negative outer exponent flips the power: $(${b}^{${m}})^{${n}} = \\frac{1}{(${b}^{${m}})^{${-n}}}$, and $${-n}$ copies of $${signed(m)}$ make $${-m * n}$, so the exponent is $${m * n}$${two ? `; then $${m * n} + ${p} = ${k}$` : ""}.`,
                  `外面的负指数把幂翻到分母：$(${b}^{${m}})^{${n}} = \\frac{1}{(${b}^{${m}})^{${-n}}}$，$${-n}$ 个 $${signed(m)}$ 合起来是 $${-m * n}$，所以指数是 $${m * n}$${two ? `；再 $${m * n} + ${p} = ${k}$` : ""}。`,
                ],
            [
              [m + n + p, "That adds the exponents instead of multiplying them.", "这是把指数相加了，应该相乘。"],
              two
                ? [m * n * p, "That multiplies all the exponents; the last one is added.", "这是把所有指数都相乘了；最后一个应该相加。"]
                : [-k, "That gets the sign of the exponent wrong.", "这是把指数的符号弄错了。"],
            ],
            { solveFor: "n" },
          );
        },
        factorTape(
          [
            ["3", 2],
            ["3", 2],
            ["3", 2],
            ["3", 2],
          ],
          "3⁸",
          [
            "One bar of 8 factors of 3 in four groups of 2, shaded in turn, with 3⁸ over the whole bar.",
            "一个由 8 个因数 3 组成的长条，分成四组，每组 2 个，深浅交替，整个长条上方写着 3⁸。",
          ],
        ),
      ),
      lesson(
        "powers-of-powers-of-variables",
        ["Powers of powers of variables", "字母的幂的乘方"],
        [
          [
            "Letters follow the same rule: $(x^{m})^{n} = x^{mn}$. So $(x^{4})^{2} = x^{8}$. With other factors, use the power rule first, then add exponents: $(x^{4})^{2} \\cdot x^{-3} = x^{8} \\cdot x^{-3} = x^{5}$. A negative result goes below the bar: $(x^{3})^{-2} = x^{-6} = \\frac{1}{x^{6}}$.",
            "字母也遵守同样的法则：$(x^{m})^{n} = x^{mn}$。所以 $(x^{4})^{2} = x^{8}$。有别的因数时，先用幂的乘方，再把指数相加：$(x^{4})^{2} \\cdot x^{-3} = x^{8} \\cdot x^{-3} = x^{5}$。结果的指数是负数时，移到分数线下面：$(x^{3})^{-2} = x^{-6} = \\frac{1}{x^{6}}$。",
          ],
          ["$(x^{4})^{2} = x^{4} \\cdot x^{4} = x^{4 + 4} = x^{8}$.", "$(x^{4})^{2} = x^{4} \\cdot x^{4} = x^{4 + 4} = x^{8}$。"],
          [
            "Do the power rule before adding. $(x^{4})^{2} \\cdot x^{-3}$ is not $x^{4 + 2 - 3}$.",
            "先用幂的乘方，再相加。$(x^{4})^{2} \\cdot x^{-3}$ 不是 $x^{4 + 2 - 3}$。",
          ],
        ],
        (rng) => {
          for (;;) {
            const [m, n] = [rng.bool(0.3) ? -rng.int(1, 5) : rng.int(2, 6), rng.bool(0.4) ? -rng.int(2, 4) : rng.int(2, 5)];
            const p = rng.bool(0.5) ? exps(rng, 0.5) : 0;
            const k = m * n + p;
            if (k === 0) continue;
            const expr = p ? `(x^{${m}})^{${n}} \\cdot x^{${p}}` : `(x^{${m}})^{${n}}`;
            const answer = positive(Q.one, [["x", k]]);
            const walk: Walk[] = [
              [
                ["Multiply the exponents", "指数相乘"],
                ["The power rule comes first:", "先用幂的乘方："],
                [`(x^{${m}})^{${n}} = x^{${m * n}}`],
              ],
            ];
            if (p)
              walk.push([
                ["Add the last exponent", "加上最后的指数"],
                ["Multiplying powers adds the exponents:", "同底数幂相乘，指数相加："],
                [`x^{${m * n}} \\cdot x^{${p}} = x^{${k}}`],
              ]);
            walk.push(
              k < 0
                ? [
                    ["Use a positive exponent", "化成正指数"],
                    ["Move the power below the bar:", "把幂移到分数线下面："],
                    [`x^{${k}} = ${answer}`],
                  ]
                : [["Write the answer", "写出答案"], ["The exponent is already positive:", "指数已经是正数："], [answer]],
            );
            const saids: Said[] = [];
            for (const [e, en, zh] of [
              [m + n + p, "That adds the exponents instead of multiplying them.", "这是把指数相加了，应该相乘。"],
              [-k, "That gets the sign of the exponent wrong.", "这是把指数的符号弄错了。"],
            ] as const)
              if (e !== k && e !== 0 && !saids.some(([s]) => s === positive(Q.one, [["x", e]])))
                saids.push([positive(Q.one, [["x", e]]), en, zh]);
            return expressed(
              [`Simplify $${expr}$. Use only positive exponents.`, `化简 $${expr}$，结果只用正整数指数。`],
              answer,
              walk,
              [
                `Undo it: $x^{${m * n}}$ is $(x^{${m}})^{${n}}$ because $${m} \\cdot ${signed(n)} = ${m * n}$${p ? `, and $${m * n} + ${signed(p)} = ${k}$` : ""}.`,
                `倒过来验证：$x^{${m * n}}$ 就是 $(x^{${m}})^{${n}}$，因为 $${m} \\cdot ${signed(n)} = ${m * n}$${p ? `，而 $${m * n} + ${signed(p)} = ${k}$` : ""}。`,
              ],
              saids,
              { simplified: true },
            );
          }
        },
        factorTape(
          [
            ["x⁴", 1],
            ["x⁴", 1],
          ],
          "x⁸",
          [
            "A bar of two equal parts x⁴ and x⁴, the second shaded, with x⁸ over the whole bar.",
            "一个长条分成两段相等的 x⁴ 和 x⁴，第二段涂色，整个长条上方写着 x⁸。",
          ],
        ),
      ),
      lesson(
        "matching-powers-with-different-bases",
        ["Matching powers with different bases", "使不同底数的幂一致"],
        [
          [
            "$8^{2} \\times 2^{3}$ has two different bases. But $8 = 2^{3}$, so $8^{2} = (2^{3})^{2} = 2^{6}$. Now the bases match: $2^{6} \\times 2^{3} = 2^{9}$.",
            "$8^{2} \\times 2^{3}$ 的底数不同。但 $8 = 2^{3}$，所以 $8^{2} = (2^{3})^{2} = 2^{6}$。这样底数就相同了：$2^{6} \\times 2^{3} = 2^{9}$。",
          ],
          [
            "$8^{2} \\times 2^{3} = 64 \\times 8 = 512$, and $2^{9} = 512$.",
            "$8^{2} \\times 2^{3} = 64 \\times 8 = 512$，而 $2^{9} = 512$。",
          ],
          [
            "Rewrite the base first. Adding $2 + 3$ right away gives $2^{5}$, which is wrong.",
            "要先改写底数。直接把 $2 + 3$ 相加得 $2^{5}$，是错的。",
          ],
        ],
        (rng) => {
          const [small, large, ratio] = rng.pick([
            [2, 4, 2],
            [2, 8, 3],
            [2, 16, 4],
            [2, 32, 5],
            [3, 9, 2],
            [3, 27, 3],
            [5, 25, 2],
          ]) as [number, number, number];
          const m = rng.int(2, 9);
          const k = rng.int(2, 9);
          const answer = ratio * m + k;
          return valued(
            [
              `Find $x$ if $${large}^{${m}} \\times ${small}^{${k}} = ${small}^{x}$.`,
              `已知 $${large}^{${m}} \\times ${small}^{${k}} = ${small}^{x}$，求 $x$。`,
            ],
            answer,
            [
              [
                ["Rewrite the larger base", "改写较大的底数"],
                [`$${large}$ is a power of $${small}$, so use the power rule:`, `$${large}$ 是 $${small}$ 的幂，用幂的乘方：`],
                [`${large} = ${small}^{${ratio}}`, `${large}^{${m}} = ${small}^{${ratio} \\cdot ${m}} = ${small}^{${ratio * m}}`],
              ],
              [["Add the exponents", "指数相加"], ["Now the bases match:", "现在底数相同了："], [`${ratio * m} + ${k} = ${answer}`]],
            ],
            [
              `Count factors of $${small}$: each $${large}$ holds $${ratio}$ of them, so $${m}$ copies of $${large}$ hold $${ratio * m}$, and $${k}$ more make $${answer}$.`,
              `数 $${small}$ 的个数：每个 $${large}$ 含 $${ratio}$ 个，$${m}$ 个 $${large}$ 含 $${ratio * m}$ 个，再加 $${k}$ 个，共 $${answer}$ 个。`,
            ],
            [
              [m + k, "That adds the exponents before rewriting the base.", "这是没有改写底数就把指数相加了。"],
              [
                ratio * (m + k),
                `That rewrites $${small}^{${k}}$ as well, but it already has base $${small}$.`,
                `这是把 $${small}^{${k}}$ 也改写了，但它的底数本来就是 $${small}$。`,
              ],
              [m * k, "That multiplies the exponents.", "这是把指数相乘了。"],
            ],
            { solveFor: "x" },
          );
        },
        factorTape(
          [
            ["2", 3],
            ["2", 3],
            ["2", 3],
          ],
          "2⁹",
          [
            "A bar of 9 factors of 2 over the brace 2⁹: two groups of 3 for 8² and a shaded group of 3 for 2³.",
            "一个长条上方写着 2⁹，共 9 个因数 2：两组各 3 个表示 8²，涂色的一组 3 个表示 2³。",
          ],
        ),
      ),
    ],
  ),
  [
    "A square tile has sides of $2^{3} = 8$ centimeters. Its area is $(2^{3})^{2}$ square centimeters.",
    "一块正方形瓷砖的边长是 $2^{3} = 8$ 厘米。它的面积是 $(2^{3})^{2}$ 平方厘米。",
  ],
  ["$8 \\times 8 = 64 = 2^{6}$, and $3 \\times 2 = 6$.", "$8 \\times 8 = 64 = 2^{6}$，而 $3 \\times 2 = 6$。"],
  ["raise a power to a power by multiplying the exponents.", "用指数相乘的方法计算幂的乘方。"],
);

/** thePowerOfProductRuleForExponents raises a product to a power factor by factor. */
export const thePowerOfProductRuleForExponents = topic(
  "the-power-of-product-rule-for-exponents",
  t("The Power of Product Rule for Exponents", "积的乘方法则"),
  t(
    "A power of a product is the product of the powers of its factors: (ab)ⁿ = aⁿbⁿ. Every factor inside the parentheses is raised to the power, including the coefficient and its sign: (−2x³)² = 4x⁶.",
    "积的乘方等于各因数乘方的积：(ab)ⁿ = aⁿbⁿ。括号里的每个因数都要乘方，包括系数和它的符号：(−2x³)² = 4x⁶。",
  ),
  ["the-power-rule-for-exponents"],
  ["8.EE.A.1"],
  [
    {
      id: "powers-of-monomials",
      title: t("Powers of monomials", "单项式的乘方"),
      explanation: t(
        "$(3x^{4})^{2} = 3^{2}(x^{4})^{2} = 9x^{8}$. Raise the coefficient to the power, not multiply it by the exponent: $3^{2} = 9$, not $6$. A negative coefficient keeps its sign for an odd power: $(-2x^{2})^{3} = -8x^{6}$.",
        "$(3x^{4})^{2} = 3^{2}(x^{4})^{2} = 9x^{8}$。系数要乘方，而不是乘以指数：$3^{2} = 9$，不是 $6$。系数为负数时，奇数次幂仍为负：$(-2x^{2})^{3} = -8x^{6}$。",
      ),
      generate(rng) {
        const c = rng.pick([2, 3, 4, 5, -2, -3]);
        const n = rng.int(2, Math.abs(c) > 3 ? 2 : 4);
        const [m, p] = [rng.int(1, 6), rng.bool(0.4) ? rng.int(1, 4) : 0];
        const inside: Factors = [
          ["x", m],
          ["y", p],
        ];
        const out: Factors = [
          ["x", m * n],
          ["y", p * n],
        ];
        const cn = c ** n;
        const expr = `(${mono(c, inside)})^{${n}}`;
        const answer = mono(cn, out);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer,
          simplified: true,
          // Multiplying the coefficient by the exponent, leaving the coefficient alone, adding exponents, and losing the sign.
          wrong: [
            mono(c * n, out),
            mono(c, out),
            mono(
              cn,
              inside.map(([v, e]) => [v, e ? e + n : 0] as const),
            ),
            mono(-cn, out),
          ],
          solution: t(
            `Raise every factor to the power $${n}$:${steps(`${expr} = ${c < 0 ? `(${c})` : c}^{${n}}${m ? `(${m === 1 ? "x" : `x^{${m}}`})^{${n}}` : ""}${p ? `(${p === 1 ? "y" : `y^{${p}}`})^{${n}}` : ""} = ${answer}`)}`,
            `括号里的每个因数都乘 $${n}$ 次方：${steps(`${expr} = ${c < 0 ? `(${c})` : c}^{${n}}${m ? `(${m === 1 ? "x" : `x^{${m}}`})^{${n}}` : ""}${p ? `(${p === 1 ? "y" : `y^{${p}}`})^{${n}}` : ""} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "powers-of-products-with-negative-exponents",
      title: t("Negative exponents in powers of products", "积的乘方中的负整数指数"),
      explanation: t(
        "$(2x^{3}y^{-1})^{-2} = 2^{-2}x^{-6}y^{2} = \\frac{y^{2}}{4x^{6}}$. Multiply each exponent by the outer one, signs included, then move the factors with negative exponents below the fraction bar. The coefficient $2^{-2}$ becomes $\\frac{1}{4}$.",
        "$(2x^{3}y^{-1})^{-2} = 2^{-2}x^{-6}y^{2} = \\frac{y^{2}}{4x^{6}}$。每个指数都乘以外面的指数（连同符号），再把带负整数指数的因数移到分数线下方。系数 $2^{-2}$ 变成 $\\frac{1}{4}$。",
      ),
      generate(rng) {
        const c = rng.pick([1, 2, 3, 5]);
        const n = rng.pick([-1, -2, -3, 2, 3]);
        const [m, p] = [rng.int(1, 4), -rng.int(1, 3)];
        if (n > 0 && c === 1) return this.generate(rng);
        if (Math.abs(n) === 3 && c > 3) return this.generate(rng);
        const inside: Factors = [
          ["x", m],
          ["y", p],
        ];
        const out: Factors = [
          ["x", m * n],
          ["y", p * n],
        ];
        const coef = Q.of(c).pow(n);
        const expr = `(${mono(c, inside)})^{${n}}`;
        const answer = positive(coef, out);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$. Use only positive exponents.`, `化简 $${expr}$，结果只用正整数指数。`),
          answer,
          simplified: true,
          // Not raising the coefficient, multiplying it by the exponent, and adding the exponents.
          wrong: [
            positive(Q.of(c), out),
            positive(Q.of(Math.abs(c * n)), out),
            positive(
              coef,
              inside.map(([v, e]) => [v, e + n] as const),
            ),
          ],
          solution: t(
            `Multiply each exponent by $${n}$, then write the factors with negative exponents below the fraction bar:${steps(`${expr} = ${c}^{${n}}x^{${m * n}}y^{${p * n}} = ${answer}`)}`,
            `每个指数都乘以 $${n}$，再把带负整数指数的因数写到分数线下方：${steps(`${expr} = ${c}^{${n}}x^{${m * n}}y^{${p * n}} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
);

/** thePowerOfQuotientRuleForExponents raises a quotient to a power, numerator and denominator alike. */
export const thePowerOfQuotientRuleForExponents = topic(
  "the-power-of-quotient-rule-for-exponents",
  t("The Power of Quotient Rule for Exponents", "商的乘方法则"),
  t(
    "A power of a quotient is the quotient of the powers: (a/b)ⁿ = aⁿ/bⁿ. Both the numerator and the denominator are raised to the power. A negative exponent flips the fraction first: (a/b)⁻ⁿ = (b/a)ⁿ.",
    "商的乘方等于分子、分母分别乘方的商：(a/b)ⁿ = aⁿ/bⁿ。分子和分母都要乘方。负整数指数先把分数颠倒：(a/b)⁻ⁿ = (b/a)ⁿ。",
  ),
  ["the-power-of-product-rule-for-exponents"],
  ["8.EE.A.1"],
  [
    {
      id: "powers-of-fractions",
      title: t("Powers of fractions", "分数的乘方"),
      explanation: t(
        "To raise a fraction to a power, raise both the numerator and the denominator to that power: $\\left(\\frac{a}{b}\\right)^{n} = \\frac{a^{n}}{b^{n}}$. A negative exponent flips the fraction, so $\\left(\\frac{a}{b}\\right)^{-n} = \\left(\\frac{b}{a}\\right)^{n}$.\n\n$\\left(\\frac{2}{3}\\right)^{4} = \\frac{2^{4}}{3^{4}} = \\frac{16}{81}$: raise the denominator as well as the numerator. With a negative exponent, flip first: $\\left(\\frac{2}{5}\\right)^{-2} = \\left(\\frac{5}{2}\\right)^{2} = \\frac{25}{4}$.",
        "分数的乘方，把分子和分母分别乘方：$\\left(\\frac{a}{b}\\right)^{n} = \\frac{a^{n}}{b^{n}}$。负整数指数会把分数颠倒，所以 $\\left(\\frac{a}{b}\\right)^{-n} = \\left(\\frac{b}{a}\\right)^{n}$。\n\n$\\left(\\frac{2}{3}\\right)^{4} = \\frac{2^{4}}{3^{4}} = \\frac{16}{81}$：分母和分子一样都要乘方。指数为负数时先颠倒：$\\left(\\frac{2}{5}\\right)^{-2} = \\left(\\frac{5}{2}\\right)^{2} = \\frac{25}{4}$。",
      ),
      generate(rng) {
        const f0 = rng.pick([Q.of(1, 2), Q.of(2, 3), Q.of(3, 4), Q.of(1, 3), Q.of(2, 5), Q.of(3, 5), Q.of(4, 5), Q.of(5, 3), Q.of(3, 2)]);
        const f = rng.bool(0.3) ? f0.neg() : f0;
        const negative = rng.bool(0.45);
        const n = rng.int(2, f0.n > 3n || f0.d > 3n ? 3 : 4) * (negative ? -1 : 1);
        const k = Math.abs(n);
        const answer = f.pow(k);
        const result = negative ? Q.one.div(answer) : answer;
        const [a, b] = negative ? [Number(f.d), Number(f.n)] : [Number(f.n), Number(f.d)];
        return numberProblem({
          prompt: t(`Evaluate $${power(f, n)}$.`, `计算 $${power(f, n)}$。`),
          answer: result,
          // Raising only the numerator, multiplying by the exponent, and not flipping for a negative exponent.
          wrong: [Q.of(a ** k, b), Q.of(a * k, b), ...(negative ? [answer] : [])],
          solution: t(
            `${negative ? `Flip the fraction to make the exponent positive, then raise` : "Raise"} the numerator and the denominator to the power:${steps(`${power(f, n)} = ${negative ? `${power(Q.one.div(f), -n)} = ` : ""}${result.toLatex()}`)}`,
            `${negative ? "先把分数颠倒，使指数变为正数，再把" : "把"}分子和分母分别乘方：${steps(`${power(f, n)} = ${negative ? `${power(Q.one.div(f), -n)} = ` : ""}${result.toLatex()}`)}`,
          ),
        });
      },
    },
    {
      id: "powers-of-algebraic-fractions",
      title: t("Powers of algebraic fractions", "字母分式的乘方"),
      explanation: t(
        "A fraction with variables is raised to a power the same way as a numerical one. Each factor on top and each factor on the bottom gets the exponent, and a factor that is already a power has its exponents multiplied.\n\n$\\left(\\frac{x^{2}}{3y}\\right)^{3} = \\frac{(x^{2})^{3}}{3^{3}y^{3}} = \\frac{x^{6}}{27y^{3}}$. Raise every factor of the numerator and of the denominator, including the number $3$.",
        "含字母的分式乘方与数的分数乘方方法相同：分子的每个因数和分母的每个因数都要乘方，本身已经是幂的因数则把指数相乘。\n\n$\\left(\\frac{x^{2}}{3y}\\right)^{3} = \\frac{(x^{2})^{3}}{3^{3}y^{3}} = \\frac{x^{6}}{27y^{3}}$。分子和分母的每个因数都要乘方，包括数 $3$。",
      ),
      generate(rng) {
        const [a, c] = [rng.pick([1, 2, 3]), rng.pick([2, 3, 5])];
        if (a === c) return this.generate(rng);
        const n = rng.int(2, a > 2 || c > 3 ? 2 : 3);
        const [m, p] = [rng.int(1, 5), rng.int(1, 4)];
        const top = mono(a, [["x", m]]);
        const bottom = mono(c, [["y", p]]);
        const expr = `\\left(\\frac{${top}}{${bottom}}\\right)^{${n}}`;
        const answer = `\\frac{${mono(a ** n, [["x", m * n]])}}{${mono(c ** n, [["y", p * n]])}}`;
        return expressionProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer,
          simplified: true,
          // Not raising the number in the denominator, raising only the numerator, and adding exponents.
          wrong: [
            `\\frac{${mono(a ** n, [["x", m * n]])}}{${mono(c, [["y", p * n]])}}`,
            `\\frac{${mono(a ** n, [["x", m * n]])}}{${bottom}}`,
            `\\frac{${mono(a ** n, [["x", m + n]])}}{${mono(c ** n, [["y", p + n]])}}`,
          ],
          solution: t(
            `Raise every factor of the numerator and the denominator to the power $${n}$:${steps(`${expr} = \\frac{${a === 1 ? "" : `${a}^{${n}}`}(${m === 1 ? "x" : `x^{${m}}`})^{${n}}}{${c}^{${n}}(${p === 1 ? "y" : `y^{${p}}`})^{${n}}} = ${answer}`)}`,
            `分子和分母的每个因数都乘 $${n}$ 次方：${steps(`${expr} = \\frac{${a === 1 ? "" : `${a}^{${n}}`}(${m === 1 ? "x" : `x^{${m}}`})^{${n}}}{${c}^{${n}}(${p === 1 ? "y" : `y^{${p}}`})^{${n}}} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
);

/** combiningTheRulesOfExponents uses several rules of exponents in one simplification. */
export const combiningTheRulesOfExponents = topic(
  "combining-the-rules-of-exponents",
  t("Combining the Rules of Exponents", "综合运用幂的运算法则"),
  t(
    "To simplify an expression with several powers, apply the power rules to anything in parentheses first, then combine powers of the same base by adding exponents for products and subtracting them for quotients. Write the final answer with positive exponents.",
    "化简含有多个幂的式子时，先对括号里的部分用乘方法则，再把同底数的幂合并：相乘时指数相加，相除时指数相减。最后的结果用正整数指数表示。",
  ),
  ["the-quotient-rule-for-exponents", "the-power-of-quotient-rule-for-exponents"],
  ["8.EE.A.1"],
  [
    {
      id: "combining-rules-with-numbers",
      title: t("Combining rules with numbers", "数的幂的综合运算"),
      explanation: t(
        "$\\frac{2^{5} \\cdot 2^{-2}}{(2^{2})^{3}}$: the numerator is $2^{5 + (-2)} = 2^{3}$ and the denominator is $2^{2 \\cdot 3} = 2^{6}$, so the quotient is $2^{3 - 6} = 2^{-3}$. Work out the exponent step by step before evaluating anything.",
        "$\\frac{2^{5} \\cdot 2^{-2}}{(2^{2})^{3}}$：分子是 $2^{5 + (-2)} = 2^{3}$，分母是 $2^{2 \\cdot 3} = 2^{6}$，所以商是 $2^{3 - 6} = 2^{-3}$。先一步步算出指数，再考虑求值。",
      ),
      generate(rng) {
        const b = rng.int(2, 9);
        const [m, n] = [exps(rng, 0.3), exps(rng, 0.3)];
        const [p, q] = [rng.bool(0.3) ? -rng.int(1, 4) : rng.int(2, 4), rng.int(2, 4)];
        const powerOnTop = rng.bool();
        const top = powerOnTop ? m + p * q : m + n;
        const bottom = powerOnTop ? n : p * q;
        const expr = powerOnTop
          ? `\\frac{${b}^{${m}} \\cdot (${b}^{${p}})^{${q}}}{${b}^{${n}}}`
          : `\\frac{${b}^{${m}} \\cdot ${b}^{${n}}}{(${b}^{${p}})^{${q}}}`;
        const k = top - bottom;
        return exponentProblem(
          b,
          expr,
          k,
          t(
            `Simplify the numerator and the denominator, then subtract the exponents:${steps(`${expr} = \\frac{${b}^{${top}}}{${b}^{${bottom}}} = ${b}^{${top} - ${signed(bottom)}} = ${b}^{${k}}`)}`,
            `先化简分子和分母，再把指数相减：${steps(`${expr} = \\frac{${b}^{${top}}}{${b}^{${bottom}}} = ${b}^{${top} - ${signed(bottom)}} = ${b}^{${k}}`)}`,
          ),
          // Adding the power instead of multiplying, and subtracting the wrong way round.
          [powerOnTop ? m + p + q - n : m + n - (p + q), bottom - top],
        );
      },
    },
    {
      id: "combining-rules-with-monomials",
      title: t("Combining rules with monomials", "单项式的综合运算"),
      explanation: t(
        "$\\frac{(2x^{3})^{2} \\cdot x^{-4}}{8x} = \\frac{4x^{6} \\cdot x^{-4}}{8x} = \\frac{4x^{2}}{8x} = \\frac{x}{2}$. Expand the power first, combine the numerator, then divide the coefficients and subtract the exponents.",
        "$\\frac{(2x^{3})^{2} \\cdot x^{-4}}{8x} = \\frac{4x^{6} \\cdot x^{-4}}{8x} = \\frac{4x^{2}}{8x} = \\frac{x}{2}$。先展开乘方，再合并分子，最后系数相除、指数相减。",
      ),
      generate(rng) {
        const c = rng.pick([2, 3]);
        const n = rng.pick([2, 3]);
        const m = rng.int(1, 4);
        const p = exps(rng, 0.6);
        const d = rng.pick([1, 2, 3, 4, 6, 8, 9, 12]);
        const e = rng.int(1, 6);
        const k = m * n + p - e;
        const coef = Q.of(c ** n, d);
        if (k === 0 && coef.isInteger() && coef.eq(Q.one)) return this.generate(rng);
        const expr = `\\frac{(${mono(c, [["x", m]])})^{${n}} \\cdot ${p === 1 ? "x" : `x^{${p}}`}}{${mono(d, [["x", e]])}}`;
        const answer = positive(coef, [["x", k]]);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$. Use only positive exponents.`, `化简 $${expr}$，结果只用正整数指数。`),
          answer,
          simplified: true,
          // Not raising the coefficient, adding the power's exponents, and dividing exponents' signs wrongly.
          wrong: [positive(Q.of(c, d), [["x", k]]), positive(coef, [["x", m + n + p - e]]), positive(coef, [["x", m * n + p + e]])],
          solution: t(
            `Expand the power, combine the numerator, then divide:${steps(`${expr} = \\frac{${mono(c ** n, [["x", m * n]])} \\cdot x^{${p}}}{${mono(d, [["x", e]])}} = \\frac{${mono(c ** n, [["x", m * n + p]])}}{${mono(d, [["x", e]])}} = ${answer}`)}`,
            `先展开乘方，合并分子，再相除：${steps(`${expr} = \\frac{${mono(c ** n, [["x", m * n]])} \\cdot x^{${p}}}{${mono(d, [["x", e]])}} = \\frac{${mono(c ** n, [["x", m * n + p]])}}{${mono(d, [["x", e]])}} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
);

/** grade8ExponentTopics lists the 8th grade topics on integer exponents and the rules of exponents. */
export const grade8ExponentTopics: readonly TopicDef[] = [
  theZerothPower,
  powersOfNegativeOne,
  negativeExponents,
  evaluatingExpressionsWithIntegerExponents,
  theProductRuleForExponents,
  theQuotientRuleForExponents,
  thePowerRuleForExponents,
  thePowerOfProductRuleForExponents,
  thePowerOfQuotientRuleForExponents,
  combiningTheRulesOfExponents,
];
