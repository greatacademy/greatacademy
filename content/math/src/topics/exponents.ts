import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, gcd, num, Q, sci } from "@ga/subject-math";

import { numberProblem, scientificValue, steps } from "../problems.ts";
import { expressed, lesson, type Said, valued, withIntro } from "./grade-6-kit.ts";
import { factorTape, fractionSteps, scienced, stepDown } from "./grade-8-kit.ts";
import { lineFigure, tapeFigure } from "./upper-grades-kit.ts";

/** mono writes a monomial: mono(6, [["x", 5], ["y", 1]]) is "6x^{5}y". */
export function mono(c: number, factors: readonly (readonly [string, number])[]): string {
  const vars = factors
    .filter(([, e]) => e !== 0)
    .map(([v, e]) => (e === 1 ? v : `${v}^{${e}}`))
    .join("");
  if (vars === "") return String(c);
  return c === 1 ? vars : c === -1 ? `-${vars}` : `${c}${vars}`;
}

/** coef writes a coefficient before a variable: "", "-" or "3". */
const coef = (c: number) => (c === 1 ? "" : c === -1 ? "-" : String(c));

/** base writes a rational base in parentheses when it is negative or a fraction. */
export function base(v: Q): string {
  return v.sign() < 0 || !v.isInteger() ? `\\left(${dec10(v)}\\right)` : dec10(v);
}

/** dec10 writes a number with a denominator dividing a power of ten as a decimal, any other as a fraction. */
function dec10(v: Q): string {
  let d = v.d;
  while (d % 10n === 0n) d /= 10n;
  return d === 1n && !v.isInteger() ? dec(v) : num(v);
}

/** standard writes a number in standard notation, with thin-space thousands separators: "45{,}000", "0.00032". */
export function standard(v: Q): string {
  const s = dec(v);
  const [whole = "", frac] = s.replace("-", "").split(".");
  const grouped = whole.length > 4 ? whole.replace(/\B(?=(\d{3})+$)/g, "{,}") : whole;
  return `${v.sign() < 0 ? "-" : ""}${grouped}${frac ? `.${frac}` : ""}`;
}

/** normalize writes a positive v as a × 10^n with 1 ≤ a < 10. */
export function normalize(v: Q): { a: Q; n: number } {
  let a = v;
  let n = 0;
  const ten = Q.of(10);
  while (a.cmp(ten) >= 0) {
    a = a.div(ten);
    n++;
  }
  while (a.cmp(Q.one) < 0) {
    a = a.mul(ten);
    n--;
  }
  return { a, n };
}

/** mantissa draws a in [1, 10) with one or two decimal places, such as 4.5 or 3.07. */
export function mantissa(rng: Rng): Q {
  return rng.bool(0.6) ? Q.of(rng.int(11, 99), 10) : Q.of(rng.int(101, 999), 100);
}

export const powersOfRationalNumbers: TopicDef = {
  id: "powers-of-rational-numbers",
  title: t("Powers of Rational Numbers", "有理数的乘方"),
  summary: t("Square and cube fractions and decimals, positive or negative.", "求分数和小数（正数或负数）的平方与立方。"),
  prerequisites: ["powers-of-integers", "multiplying-fractions", "decimal-arithmetic"],
  encompasses: [
    { topic: "powers-of-integers", weight: 0.4 },
    { topic: "multiplying-fractions", weight: 0.2 },
  ],
  xp: 10,
  standards: ["CCSS.6.EE.A.1", "CCSS.7.NS.A.2"],
  knowledgePoints: [
    {
      id: "powers-of-fractions",
      title: t("Powers of fractions", "分数的乘方"),
      explanation: t(
        "A power of a fraction is the power of its numerator over the power of its denominator, because multiplying fractions multiplies the numerators and the denominators:\n\n$$\\left(\\frac{2}{3}\\right)^{3} = \\frac{2}{3} \\cdot \\frac{2}{3} \\cdot \\frac{2}{3} = \\frac{2^{3}}{3^{3}} = \\frac{8}{27}$$\n\nThe parentheses matter: the exponent applies to the whole fraction, denominator included. As with integers, an odd power of a negative fraction is negative and an even power is positive.",
        "分数的乘方等于分子的乘方除以分母的乘方，因为分数相乘就是分子乘分子、分母乘分母：\n\n$$\\left(\\frac{2}{3}\\right)^{3} = \\frac{2}{3} \\cdot \\frac{2}{3} \\cdot \\frac{2}{3} = \\frac{2^{3}}{3^{3}} = \\frac{8}{27}$$\n\n括号很重要：指数作用于整个分数，包括分母。与整数一样，负分数的奇数次幂为负，偶数次幂为正。",
      ),
      keyPrerequisites: ["powers-of-integers", "multiplying-fractions"],
      generate(rng) {
        const n = rng.pick([2, 2, 3]);
        let a: number;
        let b: number;
        do {
          a = rng.int(1, n === 2 ? 9 : 5);
          b = rng.int(2, n === 2 ? 10 : 5);
        } while (gcd(a, b) !== 1);
        const s = rng.bool(0.4) ? -1 : 1;
        const v = Q.of(s * a, b);
        const value = v.pow(n);
        const top = s < 0 ? `(-${a})^{${n}}` : `${a}^{${n}}`;
        return numberProblem({
          prompt: t(`Evaluate $${base(v)}^{${n}}$.`, `计算 $${base(v)}^{${n}}$。`),
          answer: value,
          wrong: [Q.of((s < 0 && n % 2 === 1 ? -1 : 1) * a ** n, b), value.neg(), Q.of(s * a * n, b * n)],
          solution: t(
            `Raise the numerator and the denominator to the power ${n}:${steps(`${base(v)}^{${n}} = \\frac{${top}}{${b}^{${n}}} = ${num(value)}`)}`,
            `把分子和分母分别乘方 ${n} 次：${steps(`${base(v)}^{${n}} = \\frac{${top}}{${b}^{${n}}} = ${num(value)}`)}`,
          ),
        });
      },
    },
    {
      id: "powers-of-decimals",
      title: t("Powers of decimals", "小数的乘方"),
      explanation: t(
        "Multiply the decimal by itself. Each factor brings its decimal places, so $0.3^{2}$ has $1 + 1 = 2$ decimal places:\n\n$$0.3^{2} = 0.3 \\times 0.3 = 0.09$$\n\nA common mistake is to write $0.9$: compute $3 \\times 3 = 9$, then place the decimal point so that the result has two decimal places.",
        "把这个小数自乘。每个因数都带来它的小数位数，所以 $0.3^{2}$ 有 $1 + 1 = 2$ 位小数：\n\n$$0.3^{2} = 0.3 \\times 0.3 = 0.09$$\n\n常见错误是写成 $0.9$：先算 $3 \\times 3 = 9$，再点上小数点，使结果有两位小数。",
      ),
      keyPrerequisites: ["decimal-arithmetic"],
      generate(rng) {
        const [k, scale, n] = rng.pick<[number, number, number]>([
          [rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15]), 10, 2],
          [rng.int(1, 5), 10, 3],
          [rng.int(2, 9), 100, 2],
        ]);
        const s = rng.bool(0.3) ? -1 : 1;
        const v = Q.of(s * k, scale);
        const value = v.pow(n);
        const places = String(scale).length - 1;
        const shown = s < 0 ? `\\left(${dec(v)}\\right)` : dec(v);
        const factors = Array(n).fill(shown).join(" \\times ");
        return numberProblem({
          prompt: t(`Evaluate $${shown}^{${n}}$.`, `计算 $${shown}^{${n}}$。`),
          answer: value,
          form: "decimal",
          wrong: [Q.of((n % 2 === 1 ? s : 1) * k ** n, scale), value.neg(), Q.of(s * k * n, scale)],
          solution: t(
            `${steps(`${shown}^{${n}} = ${factors} = ${dec(value)}`)}Since $${k}^{${n}} = ${k ** n}$ and the product has $${n} \\times ${places} = ${n * places}$ decimal places, the result is $${dec(value)}$.`,
            `${steps(`${shown}^{${n}} = ${factors} = ${dec(value)}`)}因为 $${k}^{${n}} = ${k ** n}$，乘积有 $${n} \\times ${places} = ${n * places}$ 位小数，所以结果是 $${dec(value)}$。`,
          ),
        });
      },
    },
  ],
};

/** distinct keeps the wrong responses that differ from the answer and from each other. */
function distinct(answer: string, saids: readonly Said[]): Said[] {
  return saids.filter(([s], i) => s !== answer && saids.findIndex(([r]) => r === s) === i);
}

/** zeroAndNegativeExponents evaluates zeroth powers, powers of -1 and negative powers. */
export const zeroAndNegativeExponents: TopicDef = withIntro(
  {
    id: "zero-and-negative-exponents",
    title: t("Zero and Negative Exponents", "零指数与负指数"),
    summary: t(
      "Evaluate $a^{0}$, powers of $-1$ and negative powers such as $2^{-3}$.",
      "计算 $a^{0}$、$-1$ 的乘方，以及 $2^{-3}$ 这样的负指数幂。",
    ),
    prerequisites: ["powers-of-rational-numbers", "dividing-fractions"],
    encompasses: [{ topic: "powers-of-rational-numbers", weight: 0.3 }],
    xp: 10,
    standards: ["CCSS.8.EE.A.1"],
    knowledgePoints: [
      lesson(
        "zeroth-power-and-powers-of-negative-one",
        ["The zeroth power and powers of $-1$", "零次幂与 $-1$ 的乘方"],
        [
          [
            "Count down the powers of $2$: $2^{3} = 8$, $2^{2} = 4$, $2^{1} = 2$. Each step divides by $2$, so $2^{0} = 2 \\div 2 = 1$. This works for every base except $0$: $a^{0} = 1$. Powers of $-1$ take turns. $(-1)^{n}$ is $1$ when $n$ is even and $-1$ when $n$ is odd.",
            "把 $2$ 的幂往下数：$2^{3} = 8$，$2^{2} = 4$，$2^{1} = 2$。每一步都除以 $2$，所以 $2^{0} = 2 \\div 2 = 1$。除了 $0$，任何底数都这样：$a^{0} = 1$。$-1$ 的幂轮流变化：$n$ 是偶数时 $(-1)^{n} = 1$，$n$ 是奇数时 $(-1)^{n} = -1$。",
          ],
          [
            "$(-1)^{3} = (-1)(-1)(-1) = -1$, and one more factor gives $(-1)^{4} = 1$.",
            "$(-1)^{3} = (-1)(-1)(-1) = -1$，再乘一个 $-1$ 得 $(-1)^{4} = 1$。",
          ],
          [
            "In $-5^{0}$ the exponent is on the $5$ only. So $-5^{0} = -(5^{0}) = -1$, not $1$.",
            "在 $-5^{0}$ 中，指数只作用于 $5$。所以 $-5^{0} = -(5^{0}) = -1$，不是 $1$。",
          ],
        ],
        (rng) => {
          const kind = rng.pick(["zero", "zero", "negated", "minusOne"] as const);
          if (kind === "minusOne") {
            const n = rng.int(3, 120);
            const even = n % 2 === 0;
            const value = even ? 1 : -1;
            const pairs = Math.floor(n / 2);
            return valued(
              [`Evaluate $(-1)^{${n}}$.`, `计算 $(-1)^{${n}}$。`],
              value,
              [
                [
                  ["Pair the factors", "两两配对"],
                  [
                    `Each pair $(-1)(-1)$ is $1$. The $${n}$ factors make $${pairs}$ pairs${even ? "" : ", with one $-1$ left over"}.`,
                    `每一对 $(-1)(-1)$ 都等于 $1$。$${n}$ 个因数组成 $${pairs}$ 对${even ? "" : "，还剩一个 $-1$"}。`,
                  ],
                ],
                [
                  ["Read the sign", "确定符号"],
                  [`The exponent is ${even ? "even" : "odd"}, so:`, `指数是${even ? "偶" : "奇"}数，所以：`],
                  [`(-1)^{${n}} = ${value}`],
                ],
              ],
              [
                `Every ${even ? "even" : "odd"} power of $-1$ is the same. A small one shows it: $(-1)^{${even ? 2 : 3}} = ${value}$.`,
                `$-1$ 的${even ? "偶" : "奇"}数次幂都相同。看一个小的：$(-1)^{${even ? 2 : 3}} = ${value}$。`,
              ],
              [
                [
                  -value,
                  `That mixes up even and odd; $${n}$ is ${even ? "even" : "odd"}.`,
                  `这是把奇偶弄反了；$${n}$ 是${even ? "偶" : "奇"}数。`,
                ],
                [-n, "That multiplies $-1$ by the exponent; the exponent counts factors.", "这是用 $-1$ 乘指数；指数表示因数的个数。"],
              ],
            );
          }
          const b = rng.pick([
            Q.of(rng.int(2, 99)),
            Q.of(-rng.int(2, 30)),
            Q.of(rng.int(1, 9), rng.int(10, 13)),
            Q.of(rng.int(11, 99), 10),
          ]);
          if (kind === "negated" && b.sign() > 0 && b.isInteger()) {
            const s = dec10(b);
            return valued(
              [`Evaluate $-${s}^{0}$.`, `计算 $-${s}^{0}$。`],
              -1,
              [
                [
                  ["Find the base", "找出底数"],
                  [`The exponent is on $${s}$ only. The minus sign stays outside the power.`, `指数只作用于 $${s}$，负号留在幂的外面。`],
                ],
                [
                  ["Use the zeroth power", "用零次幂"],
                  [`The power is $1$, then the minus sign comes back:`, `这个幂等于 $1$，再加上负号：`],
                  [`-${s}^{0} = -(1) = -1`],
                ],
              ],
              [
                `Step down from the first power: $${s} \\div ${s} = 1$, and the minus sign makes it $-1$.`,
                `从一次幂往下一步：$${s} \\div ${s} = 1$，再加上负号得 $-1$。`,
              ],
              [
                [
                  1,
                  `That puts the minus sign inside the power; the exponent is on $${s}$ only.`,
                  `这是把负号放进了幂里；指数只作用于 $${s}$。`,
                ],
                [0, "That takes the zeroth power as $0$; it is $1$.", "这是把零次幂当成了 $0$；它等于 $1$。"],
              ],
            );
          }
          return valued(
            [`Evaluate $${base(b)}^{0}$.`, `计算 $${base(b)}^{0}$。`],
            1,
            [
              [
                ["Find the base", "找出底数"],
                b.sign() < 0
                  ? ["The parentheses put the minus sign inside the base.", "括号说明负号在底数里面。"]
                  : ["The base is not $0$, so its zeroth power makes sense.", "底数不是 $0$，所以它的零次幂有意义。"],
              ],
              [
                ["Use the zeroth power", "用零次幂"],
                ["A nonzero base to the power $0$ is $1$:", "非零底数的零次幂是 $1$："],
                [`${base(b)}^{0} = 1`],
              ],
            ],
            [
              "Step down from the first power: any nonzero base divided by itself is $1$.",
              "从一次幂往下一步：任何非零的底数除以它自己都得 $1$。",
            ],
            [
              [0, "That takes the zeroth power as $0$; it is $1$.", "这是把零次幂当成了 $0$；它等于 $1$。"],
              [b, "That leaves the base as it is; the power $0$ does not keep it.", "这是把底数原样留下；零次幂不是底数本身。"],
              [-1, "That adds a minus sign the power does not have.", "这是多了一个负号，这个幂的结果没有负号。"],
            ],
          );
        },
        stepDown(2, 3, [
          "A number line from 0 to 8 with 2³ = 8, 2² = 4, 2¹ = 2 and 2⁰ = 1 marked; each jump to the left halves the number.",
          "一条从 0 到 8 的数轴，标出 2³ = 8、2² = 4、2¹ = 2 和 2⁰ = 1；每向左跳一次，数就减半。",
        ]),
      ),
      {
        ...lesson(
          "negative-exponents",
          ["Negative exponents", "负指数"],
          [
            [
              "Keep stepping down below $2^{0} = 1$. Each step still divides by $2$: $2^{-1} = \\frac{1}{2}$, $2^{-2} = \\frac{1}{4}$, $2^{-3} = \\frac{1}{8}$. So a negative exponent means the reciprocal of the positive power, $a^{-n} = \\frac{1}{a^{n}}$. For a fraction, flip it: $\\left(\\frac{2}{3}\\right)^{-2} = \\left(\\frac{3}{2}\\right)^{2} = \\frac{9}{4}$.",
              "从 $2^{0} = 1$ 继续往下走，每一步还是除以 $2$：$2^{-1} = \\frac{1}{2}$，$2^{-2} = \\frac{1}{4}$，$2^{-3} = \\frac{1}{8}$。所以负指数表示正指数幂的倒数，$a^{-n} = \\frac{1}{a^{n}}$。底数是分数时，把它倒过来：$\\left(\\frac{2}{3}\\right)^{-2} = \\left(\\frac{3}{2}\\right)^{2} = \\frac{9}{4}$。",
            ],
            [
              "A number times its reciprocal is $1$: $2^{-3} \\cdot 2^{3} = \\frac{1}{8} \\cdot 8 = 1$.",
              "一个数乘它的倒数得 $1$：$2^{-3} \\cdot 2^{3} = \\frac{1}{8} \\cdot 8 = 1$。",
            ],
            [
              "A negative exponent does not make the number negative. $2^{-3}$ is $\\frac{1}{8}$, not $-8$.",
              "负指数不会让数变成负数。$2^{-3}$ 是 $\\frac{1}{8}$，不是 $-8$。",
            ],
          ],
          (rng) => {
            const kind = rng.pick(["integer", "integer", "fraction", "negative"] as const);
            let b: Q;
            let n: number;
            if (kind === "fraction") {
              let p: number;
              let q: number;
              do {
                p = rng.int(1, 5);
                q = rng.int(2, 6);
              } while (gcd(p, q) !== 1);
              b = rng.bool() ? Q.of(p, q) : Q.of(q, p);
              n = rng.int(1, 3);
            } else {
              const k = kind === "integer" ? rng.int(2, 10) : -rng.int(2, 5);
              n = rng.int(1, Math.abs(k) <= 3 ? 4 : 2);
              b = Q.of(k);
            }
            const value = b.pow(-n);
            const positive = b.pow(n);
            return valued(
              [`Evaluate $${base(b)}^{-${n}}$.`, `计算 $${base(b)}^{-${n}}$。`],
              value,
              [
                [
                  ["Flip to a positive power", "化成正指数"],
                  ["A negative exponent means the reciprocal of the positive power:", "负指数表示正指数幂的倒数："],
                  [`${base(b)}^{-${n}} = \\frac{1}{${base(b)}^{${n}}}`],
                ],
                [
                  ["Work out the power", "算出幂"],
                  ["Find the power in the denominator, then simplify:", "先算分母里的幂，再化简："],
                  [`\\frac{1}{${base(b)}^{${n}}} = \\frac{1}{${num(positive)}} = ${num(value)}`],
                ],
              ],
              [
                `A number times its reciprocal is $1$: $${num(value)} \\cdot ${base(positive)} = 1$.`,
                `一个数乘它的倒数得 $1$：$${num(value)} \\cdot ${base(positive)} = 1$。`,
              ],
              [
                [
                  positive.neg(),
                  "A negative exponent does not make the value negative; it means the reciprocal.",
                  "负指数不会让结果变成负数，它表示取倒数。",
                ],
                [
                  positive,
                  "That is the positive power; the negative exponent means its reciprocal.",
                  "这是正指数幂；负指数表示取它的倒数。",
                ],
                [
                  b.mul(Q.of(-n)),
                  "That multiplies the base by the exponent; the exponent counts factors.",
                  "这是把底数和指数相乘了；指数表示因数的个数。",
                ],
              ],
              { form: "fraction" },
            );
          },
          fractionSteps(2, 3, [
            "A number line from 0 to 1 with 2⁰ = 1, 2⁻¹ = 1/2, 2⁻² = 1/4 and 2⁻³ = 1/8 marked; each jump to the left halves the number.",
            "一条从 0 到 1 的数轴，标出 2⁰ = 1、2⁻¹ = 1/2、2⁻² = 1/4 和 2⁻³ = 1/8；每向左跳一次，数就减半。",
          ]),
        ),
        keyPrerequisites: ["dividing-fractions"],
      },
    ],
  },
  [
    "A sunflower doubles its height every week. Today it is $8$ cm tall. A week ago it was $4$ cm, two weeks ago $2$ cm, and three weeks ago $1$ cm. Four weeks ago it was only $\\frac{1}{2}$ cm.",
    "一棵向日葵每周长高一倍。今天它高 $8$ 厘米。一周前是 $4$ 厘米，两周前是 $2$ 厘米，三周前是 $1$ 厘米。四周前只有 $\\frac{1}{2}$ 厘米。",
  ],
  ["Each week back halves the height: $1 \\div 2 = \\frac{1}{2}$.", "每往前一周，高度就减半：$1 \\div 2 = \\frac{1}{2}$。"],
  ["find zeroth powers, powers of $-1$ and negative powers.", "求零次幂、$-1$ 的乘方和负指数幂。"],
);

/** productAndQuotientRules multiplies and divides powers and monomials with the same base. */
export const productAndQuotientRules: TopicDef = withIntro(
  {
    id: "product-and-quotient-rules",
    title: t("The Product and Quotient Rules for Exponents", "同底数幂的乘法与除法"),
    summary: t(
      "Multiply powers with the same base by adding exponents, and divide them by subtracting exponents.",
      "同底数幂相乘时指数相加，相除时指数相减。",
    ),
    prerequisites: ["zero-and-negative-exponents", "evaluating-expressions"],
    encompasses: [],
    xp: 10,
    standards: ["CCSS.8.EE.A.1"],
    knowledgePoints: [
      lesson(
        "product-rule",
        ["The product rule", "同底数幂的乘法"],
        [
          [
            "$x^{3} \\cdot x^{4}$ is $3$ factors of $x$ and then $4$ more, $7$ in all. So $x^{m} \\cdot x^{n} = x^{m + n}$ for the same base. With coefficients, multiply the coefficients and add the exponents: $(2x^{3})(5x^{4}) = 10x^{7}$.",
            "$x^{3} \\cdot x^{4}$ 是 $3$ 个 $x$ 再乘 $4$ 个 $x$，共 $7$ 个。所以底数相同时 $x^{m} \\cdot x^{n} = x^{m + n}$。有系数时，系数相乘，指数相加：$(2x^{3})(5x^{4}) = 10x^{7}$。",
          ],
          [
            "Take $x = 2$: $2^{3} \\cdot 2^{4} = 8 \\cdot 16 = 128$, and $2^{7} = 128$.",
            "取 $x = 2$：$2^{3} \\cdot 2^{4} = 8 \\cdot 16 = 128$，而 $2^{7} = 128$。",
          ],
          [
            "Add the exponents, do not multiply them. $x^{3} \\cdot x^{4}$ is $x^{7}$, not $x^{12}$.",
            "指数要相加，不是相乘。$x^{3} \\cdot x^{4}$ 是 $x^{7}$，不是 $x^{12}$。",
          ],
        ],
        (rng) => {
          const a = rng.pick([1, 2, 3, 4, 5, 6, -2, -3]);
          const b = rng.int(2, 9);
          const [m, n] = [rng.int(1, 8), rng.int(2, 8)];
          const two = rng.bool(0.4);
          const [p, q] = two ? [rng.int(1, 4), rng.int(1, 4)] : [0, 0];
          const left = mono(a, [
            ["x", m],
            ["y", p],
          ]);
          const right = mono(b, [
            ["x", n],
            ["y", q],
          ]);
          const answer = mono(a * b, [
            ["x", m + n],
            ["y", p + q],
          ]);
          const added = `${a * b}${two ? `x^{${m} + ${n}}y^{${p} + ${q}}` : `x^{${m} + ${n}}`}`;
          return expressed(
            [`Simplify $(${left})(${right})$.`, `化简 $(${left})(${right})$。`],
            answer,
            [
              [
                ["Multiply the coefficients", "系数相乘"],
                [`$${a} \\cdot ${b} = ${a * b}$.`, `$${a} \\cdot ${b} = ${a * b}$。`],
              ],
              [
                ["Add the exponents", "指数相加"],
                ["The bases match, so add the exponents of each letter:", "底数相同，每个字母的指数相加："],
                [`(${left})(${right}) = ${added} = ${answer}`],
              ],
            ],
            [
              `Count the factors of $x$: $${m}$ of them and $${n}$ more make $${m + n}$.`,
              `数一数 $x$ 的个数：$${m}$ 个再加 $${n}$ 个，共 $${m + n}$ 个。`,
            ],
            distinct(answer, [
              [
                mono(a * b, [
                  ["x", m * n],
                  ["y", p * q],
                ]),
                "That multiplies the exponents; the product rule adds them.",
                "这是把指数相乘了；同底数幂相乘，指数相加。",
              ],
              [
                mono(a + b, [
                  ["x", m + n],
                  ["y", p + q],
                ]),
                "That adds the coefficients; they are multiplied.",
                "这是把系数相加了；系数要相乘。",
              ],
            ]),
            { simplified: true },
          );
        },
        factorTape(
          [
            ["x", 3],
            ["x", 4],
          ],
          "x⁷",
          [
            "A bar of 7 factors of x: a group of 3 and a shaded group of 4, with x⁷ over the whole bar.",
            "一个由 7 个 x 组成的长条：一组 3 个，另一组 4 个涂了颜色，整个长条上方标着 x⁷。",
          ],
        ),
      ),
      lesson(
        "quotient-rule",
        ["The quotient rule", "同底数幂的除法"],
        [
          [
            "In $\\frac{x^{6}}{x^{2}}$, the $2$ factors of $x$ on the bottom cancel $2$ of the $6$ on top. That leaves $4$, so $\\frac{x^{m}}{x^{n}} = x^{m - n}$ when $x \\ne 0$. With coefficients, divide the coefficients and subtract the exponents: $\\frac{12x^{7}}{4x^{2}} = 3x^{5}$.",
            "在 $\\frac{x^{6}}{x^{2}}$ 中，分母的 $2$ 个 $x$ 和分子 $6$ 个 $x$ 中的 $2$ 个约去，剩下 $4$ 个。所以 $x \\ne 0$ 时 $\\frac{x^{m}}{x^{n}} = x^{m - n}$。有系数时，系数相除，指数相减：$\\frac{12x^{7}}{4x^{2}} = 3x^{5}$。",
          ],
          ["Multiply back: $x^{4} \\cdot x^{2} = x^{6}$.", "乘回去验证：$x^{4} \\cdot x^{2} = x^{6}$。"],
          [
            "Subtract the exponents, do not divide them. $\\frac{x^{6}}{x^{2}}$ is $x^{4}$, not $x^{3}$.",
            "指数要相减，不是相除。$\\frac{x^{6}}{x^{2}}$ 是 $x^{4}$，不是 $x^{3}$。",
          ],
        ],
        (rng) => {
          const b = rng.int(1, 6);
          const k = rng.pick([1, 2, 3, 4, 5, -2, -3]);
          const n = rng.int(1, 6);
          const m = n + rng.int(1, 7);
          const top = mono(b * k, [["x", m]]);
          const bottom = mono(b, [["x", n]]);
          const answer = mono(k, [["x", m - n]]);
          return expressed(
            [`Simplify $\\frac{${top}}{${bottom}}$.`, `化简 $\\frac{${top}}{${bottom}}$。`],
            answer,
            [
              [
                ["Divide the coefficients", "系数相除"],
                [`$${b * k} \\div ${b} = ${k}$.`, `$${b * k} \\div ${b} = ${k}$。`],
              ],
              [
                ["Subtract the exponents", "指数相减"],
                ["The bases match, so subtract the exponent on the bottom:", "底数相同，减去分母的指数："],
                [`\\frac{${top}}{${bottom}} = ${coef(k)}x^{${m} - ${n}} = ${answer}`],
              ],
            ],
            [`Multiply back to get the top: $(${answer})(${bottom}) = ${top}$.`, `乘回去得到分子：$(${answer})(${bottom}) = ${top}$。`],
            distinct(answer, [
              [mono(k, [["x", m + n]]), "That adds the exponents; dividing subtracts them.", "这是把指数相加了；相除时指数相减。"],
              ...(m % n === 0
                ? [[mono(k, [["x", m / n]]), "That divides the exponents; they are subtracted.", "这是把指数相除了；指数要相减。"] as const]
                : []),
              ...(b > 1 && b * k - b !== 0
                ? [
                    [
                      mono(b * k - b, [["x", m - n]]),
                      "That subtracts the coefficients; they are divided.",
                      "这是把系数相减了；系数要相除。",
                    ] as const,
                  ]
                : []),
            ]),
            { simplified: true },
          );
        },
        factorTape(
          [
            ["x", 2],
            ["x", 4],
          ],
          "x⁶",
          [
            "A bar of 6 factors of x: the first 2 cancel with the bottom, and the shaded 4 are left.",
            "一个由 6 个 x 组成的长条：前 2 个与分母约去，涂色的 4 个留下。",
          ],
        ),
      ),
    ],
  },
  [
    "A tile wall is $2^{3} = 8$ tiles wide and $2^{2} = 4$ tiles tall. It holds $8 \\cdot 4 = 32$ tiles, and $32$ is $2^{5}$.",
    "一面瓷砖墙宽 $2^{3} = 8$ 块，高 $2^{2} = 4$ 块。它共有 $8 \\cdot 4 = 32$ 块，而 $32$ 就是 $2^{5}$。",
  ],
  ["$3 + 2 = 5$: the exponents add.", "$3 + 2 = 5$：指数相加。"],
  ["multiply and divide powers and monomials with the same base.", "做同底数幂和单项式的乘法与除法。"],
);

/** powerRules raises powers and products to a power and combines the rules of exponents. */
export const powerRules: TopicDef = withIntro(
  {
    id: "power-rules",
    title: t("The Power Rules for Exponents", "幂的乘方与积的乘方"),
    summary: t("Raise powers and products to a power, and combine the rules of exponents.", "求幂的乘方与积的乘方，并综合运用指数法则。"),
    prerequisites: ["product-and-quotient-rules"],
    encompasses: [{ topic: "product-and-quotient-rules", weight: 0.3 }],
    xp: 12,
    standards: ["CCSS.8.EE.A.1"],
    knowledgePoints: [
      lesson(
        "power-of-a-power",
        ["The power of a power", "幂的乘方"],
        [
          [
            "$(x^{3})^{4}$ is $4$ factors of $x^{3}$. That is $3 + 3 + 3 + 3 = 12$ factors of $x$. So $(x^{m})^{n} = x^{mn}$, and the exponents multiply. Each letter inside gets the same treatment: $(x^{2}y)^{3} = x^{6}y^{3}$.",
            "$(x^{3})^{4}$ 是 $4$ 个 $x^{3}$ 相乘，也就是 $3 + 3 + 3 + 3 = 12$ 个 $x$。所以 $(x^{m})^{n} = x^{mn}$，指数相乘。括号里的每个字母都这样：$(x^{2}y)^{3} = x^{6}y^{3}$。",
          ],
          ["Take $x = 2$: $(2^{2})^{3} = 4^{3} = 64$, and $2^{6} = 64$.", "取 $x = 2$：$(2^{2})^{3} = 4^{3} = 64$，而 $2^{6} = 64$。"],
          [
            "Here the exponents multiply. $(x^{3})^{4}$ is $x^{12}$, not $x^{7}$.",
            "这里指数相乘。$(x^{3})^{4}$ 是 $x^{12}$，不是 $x^{7}$。",
          ],
        ],
        (rng) => {
          const [m, n] = [rng.int(2, 9), rng.int(2, 6)];
          const two = rng.bool(0.4);
          const p = two ? rng.int(1, 5) : 0;
          const inner = mono(1, [
            ["x", m],
            ["y", p],
          ]);
          const answer = mono(1, [
            ["x", m * n],
            ["y", p * n],
          ]);
          return expressed(
            [`Simplify $(${inner})^{${n}}$.`, `化简 $(${inner})^{${n}}$。`],
            answer,
            [
              [
                ["Write it out", "写成连乘"],
                [`It is $${n}$ factors of $${inner}$.`, `它是 $${n}$ 个 $${inner}$ 相乘。`],
              ],
              [
                ["Multiply the exponents", "指数相乘"],
                [`Multiply each exponent by $${n}$:`, `每个指数都乘以 $${n}$：`],
                [`(${inner})^{${n}} = ${two ? `x^{${m} \\cdot ${n}}y^{${p} \\cdot ${n}}` : `x^{${m} \\cdot ${n}}`} = ${answer}`],
              ],
            ],
            [
              `Add the copies of the exponent: $${Array(n).fill(m).join(" + ")} = ${m * n}$.`,
              `把每份的指数加起来：$${Array(n).fill(m).join(" + ")} = ${m * n}$。`,
            ],
            distinct(answer, [
              [
                mono(1, [
                  ["x", m + n],
                  ["y", p === 0 ? 0 : p + n],
                ]),
                "That adds the outer exponent; a power of a power multiplies.",
                "这是把外面的指数加上去了；幂的乘方要把指数相乘。",
              ],
              ...(two
                ? [
                    [
                      mono(1, [
                        ["x", m * n],
                        ["y", p],
                      ]),
                      "That raises only $x$; every factor inside is raised.",
                      "这是只给 $x$ 乘方了；括号里的每个因数都要乘方。",
                    ] as const,
                  ]
                : []),
            ]),
            { simplified: true },
          );
        },
        factorTape(
          [
            ["x³", 1],
            ["x³", 1],
            ["x³", 1],
            ["x³", 1],
          ],
          "x¹²",
          ["A bar of 4 pieces, each x³, with x¹² over the whole bar.", "一个由 4 段组成的长条，每段是 x³，整个长条上方标着 x¹²。"],
        ),
      ),
      {
        ...lesson(
          "power-of-a-product",
          ["The power of a product", "积的乘方"],
          [
            [
              "Every factor inside the parentheses is raised to the power, and that includes the coefficient. Write $(2x^{3})^{4}$ as $4$ copies of $2x^{3}$. That gives $4$ twos and $4$ factors of $x^{3}$: $(2x^{3})^{4} = 2^{4}(x^{3})^{4} = 16x^{12}$.",
              "括号里的每个因数都要乘方，系数也不例外。把 $(2x^{3})^{4}$ 写成 $4$ 个 $2x^{3}$ 相乘，就有 $4$ 个 $2$ 和 $4$ 个 $x^{3}$：$(2x^{3})^{4} = 2^{4}(x^{3})^{4} = 16x^{12}$。",
            ],
            ["$(2x)^{2} = 2x \\cdot 2x = 4x^{2}$.", "$(2x)^{2} = 2x \\cdot 2x = 4x^{2}$。"],
            [
              "Raise the coefficient too. $(2x^{3})^{4}$ is $16x^{12}$, not $2x^{12}$.",
              "系数也要乘方。$(2x^{3})^{4}$ 是 $16x^{12}$，不是 $2x^{12}$。",
            ],
          ],
          (rng) => {
            const [c, n] = rng.pick<[number, number]>([
              [rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10]), 2],
              [rng.pick([2, 3, 4, 5]), 3],
              [rng.pick([2, 3]), 4],
              [rng.pick([-2, -3, -4]), rng.int(2, 3)],
            ]);
            const m = rng.int(1, 6);
            const inner = mono(c, [["x", m]]);
            const answer = mono(c ** n, [["x", m * n]]);
            const cc = c < 0 ? `(${c})` : String(c);
            const xm = m === 1 ? "x" : `x^{${m}}`;
            return expressed(
              [`Simplify $(${inner})^{${n}}$.`, `化简 $(${inner})^{${n}}$。`],
              answer,
              [
                [
                  ["Raise each factor", "每个因数都乘方"],
                  [`Raise the coefficient and the power of $x$ to the power $${n}$:`, `系数和 $x$ 的幂都乘方 $${n}$ 次：`],
                  [`(${inner})^{${n}} = ${cc}^{${n}}(${xm})^{${n}}`],
                ],
                [
                  ["Work it out", "算出结果"],
                  ["Find the number, and multiply the exponents of $x$:", "算出数，再把 $x$ 的指数相乘："],
                  [`${cc}^{${n}}(${xm})^{${n}} = ${answer}`],
                ],
              ],
              [
                `The coefficient is $${cc}$ used $${n}$ times: $${Array(n).fill(cc).join(" \\cdot ")} = ${c ** n}$.`,
                `系数是 $${n}$ 个 $${cc}$ 相乘：$${Array(n).fill(cc).join(" \\cdot ")} = ${c ** n}$。`,
              ],
              distinct(answer, [
                [mono(c, [["x", m * n]]), "That leaves the coefficient as it is; it is raised too.", "这是没有给系数乘方；系数也要乘方。"],
                [
                  mono(c * n, [["x", m * n]]),
                  "That multiplies the coefficient by the exponent instead of raising it.",
                  "这是用系数乘指数，而不是给系数乘方。",
                ],
                [
                  mono(c ** n, [["x", m + n]]),
                  "That adds the exponents of $x$; a power of a power multiplies them.",
                  "这是把 $x$ 的指数相加了；幂的乘方要把指数相乘。",
                ],
              ]),
              { simplified: true },
            );
          },
          factorTape(
            [
              ["2x³", 1],
              ["2x³", 1],
              ["2x³", 1],
              ["2x³", 1],
            ],
            "16x¹²",
            ["A bar of 4 pieces, each 2x³, with 16x¹² over the whole bar.", "一个由 4 段组成的长条，每段是 2x³，整个长条上方标着 16x¹²。"],
          ),
        ),
        keyPrerequisites: ["powers-of-integers"],
      },
      lesson(
        "combining-the-rules",
        ["Combining the rules", "综合运用指数法则"],
        [
          [
            "Work in this order. First do the powers. Then multiply, adding the exponents. Then divide, subtracting the exponents: $\\frac{(2x^{3})^{2} \\cdot 3x^{4}}{6x^{5}} = \\frac{4x^{6} \\cdot 3x^{4}}{6x^{5}} = \\frac{12x^{10}}{6x^{5}} = 2x^{5}$.",
            "按这个顺序做：先算乘方，再做乘法，指数相加，最后做除法，指数相减：$\\frac{(2x^{3})^{2} \\cdot 3x^{4}}{6x^{5}} = \\frac{4x^{6} \\cdot 3x^{4}}{6x^{5}} = \\frac{12x^{10}}{6x^{5}} = 2x^{5}$。",
          ],
          ["Follow only the exponent of $x$: $3 \\cdot 2 + 4 - 5 = 5$.", "只看 $x$ 的指数：$3 \\cdot 2 + 4 - 5 = 5$。"],
          [
            "Do the power before you multiply, and square the coefficient too. $(2x^{3})^{2}$ is $4x^{6}$, not $2x^{6}$.",
            "先算乘方再相乘，系数也要平方。$(2x^{3})^{2}$ 是 $4x^{6}$，不是 $2x^{6}$。",
          ],
        ],
        (rng) => {
          const c = rng.int(2, 4);
          const m = rng.int(1, 4);
          const d = rng.int(1, 5);
          const p = rng.int(1, 5);
          const top = c * c * d;
          const divisors = [1, 2, 3, 4, 6, 8, 12].filter((g) => top % g === 0 && g !== top);
          const g = rng.pick(divisors);
          const q = rng.int(1, 2 * m + p - 1);
          const e = 2 * m + p - q;
          const answer = mono(top / g, [["x", e]]);
          const squared = mono(c * c, [["x", 2 * m]]);
          const product = mono(top, [["x", 2 * m + p]]);
          const divisor = mono(g, [["x", q]]);
          const expr = `\\frac{(${mono(c, [["x", m]])})^{2} \\cdot ${mono(d, [["x", p]])}}{${divisor}}`;
          return expressed(
            [`Simplify $${expr}$.`, `化简 $${expr}$。`],
            answer,
            [
              [
                ["Do the power", "先算乘方"],
                ["Square the first factor, coefficient and all:", "把第一个因数平方，系数也要平方："],
                [`(${mono(c, [["x", m]])})^{2} = ${squared}`],
              ],
              [
                ["Multiply", "相乘"],
                ["Multiply the coefficients and add the exponents:", "系数相乘，指数相加："],
                [`${squared} \\cdot ${mono(d, [["x", p]])} = ${product}`],
              ],
              [
                ["Divide", "相除"],
                ["Divide the coefficients and subtract the exponents:", "系数相除，指数相减："],
                [`\\frac{${product}}{${divisor}} = ${answer}`],
              ],
            ],
            [
              `Follow only the exponent of $x$: $2 \\cdot ${m} + ${p} - ${q} = ${e}$.`,
              `只看 $x$ 的指数：$2 \\cdot ${m} + ${p} - ${q} = ${e}$。`,
            ],
            distinct(answer, [
              ...((c * d) % g === 0
                ? [[mono((c * d) / g, [["x", e]]), "That forgets to square the coefficient.", "这是忘了给系数平方。"] as const]
                : []),
              [
                mono(top / g, [["x", m + 2 + p - q]]),
                "That adds $2$ to the exponent instead of doubling it.",
                "这是给指数加 $2$，而不是乘 $2$。",
              ],
              [
                mono(top / g, [["x", 2 * m + p + q]]),
                "That adds the exponent of the divisor; dividing subtracts it.",
                "这是加上了除式的指数；相除时要减去它。",
              ],
            ]),
            { simplified: true },
          );
        },
        lineFigure(
          {
            lo: 0,
            hi: 10,
            step: 1,
            labels: [0, 5, 6, 10],
            marks: [
              { at: 6, text: "x⁶" },
              { at: 10, text: "x¹⁰" },
              { at: 5, text: "x⁵", result: true },
            ],
            jumps: [
              [0, 6],
              [6, 10],
              [10, 5],
            ],
          },
          [
            "A number line of the exponent of x: a jump to 6 for the power, on to 10 for the product, and back to 5 for the quotient.",
            "一条表示 x 的指数的数轴：乘方跳到 6，相乘跳到 10，相除退回到 5。",
          ],
        ),
      ),
    ],
  },
  [
    "A box shaped like a cube has edges of $10^{2}$ cm. Its volume is $(10^{2})^{3}$ cubic centimeters. That is $100 \\cdot 100 \\cdot 100 = 1{,}000{,}000$, or $10^{6}$.",
    "一个正方体盒子的棱长是 $10^{2}$ 厘米。它的体积是 $(10^{2})^{3}$ 立方厘米，也就是 $100 \\cdot 100 \\cdot 100 = 1{,}000{,}000$，即 $10^{6}$。",
  ],
  ["$2 \\cdot 3 = 6$: the exponents multiply.", "$2 \\cdot 3 = 6$：指数相乘。"],
  ["raise powers and products to a power, and combine the rules of exponents.", "求幂的乘方与积的乘方，并综合运用指数法则。"],
);

/** scientificNotation writes large and small numbers as a × 10^n, and back. */
export const scientificNotation: TopicDef = withIntro(
  {
    id: "scientific-notation",
    title: t("Scientific Notation", "科学记数法"),
    summary: t(
      "Write very large and very small numbers as $a \\times 10^{n}$, and back.",
      "把很大或很小的数写成 $a \\times 10^{n}$ 的形式，并能还原。",
    ),
    prerequisites: ["zero-and-negative-exponents"],
    encompasses: [{ topic: "zero-and-negative-exponents", weight: 0.2 }],
    xp: 10,
    standards: ["CCSS.8.EE.A.3"],
    knowledgePoints: [
      lesson(
        "writing-in-scientific-notation",
        ["Writing numbers in scientific notation", "用科学记数法表示数"],
        [
          [
            "A number is in **scientific notation** when it is written $a \\times 10^{n}$, with $1 \\le a < 10$ and $n$ an integer. Move the decimal point until one nonzero digit is in front of it. Then $n$ counts the places moved: $45{,}000 = 4.5 \\times 10^{4}$ and $0.00032 = 3.2 \\times 10^{-4}$.",
            "把数写成 $a \\times 10^{n}$ 的形式，其中 $1 \\le a < 10$，$n$ 是整数，这就是**科学记数法**。移动小数点，使它前面只有一个非零数字。$n$ 就是移动的位数：$45{,}000 = 4.5 \\times 10^{4}$，$0.00032 = 3.2 \\times 10^{-4}$。",
          ],
          ["$4.5 \\times 10^{4} = 4.5 \\times 10{,}000 = 45{,}000$.", "$4.5 \\times 10^{4} = 4.5 \\times 10{,}000 = 45{,}000$。"],
          [
            "A number less than $1$ has a negative exponent. $0.00032$ is $3.2 \\times 10^{-4}$, not $3.2 \\times 10^{4}$.",
            "小于 $1$ 的数指数是负的。$0.00032$ 是 $3.2 \\times 10^{-4}$，不是 $3.2 \\times 10^{4}$。",
          ],
        ],
        (rng) => {
          const a = mantissa(rng);
          const n = rng.pick([rng.int(3, 9), rng.int(-7, -2)]);
          const v = scientificValue(a, n);
          const k = Math.abs(n);
          return scienced(
            [`Write $${standard(v)}$ in scientific notation.`, `用科学记数法表示 $${standard(v)}$。`],
            a,
            n,
            [
              [
                ["Place the point", "点小数点"],
                [`Put the point after the first nonzero digit: $${dec(a)}$.`, `把小数点放在第一个非零数字后面：$${dec(a)}$。`],
              ],
              [
                ["Count the places", "数位数"],
                [
                  `The point moved $${k}$ places to the ${n > 0 ? "left" : "right"}, so the exponent is $${n}$:`,
                  `小数点向${n > 0 ? "左" : "右"}移动了 $${k}$ 位，所以指数是 $${n}$：`,
                ],
                [`${standard(v)} = ${sci(a, n)}`],
              ],
            ],
            [
              `Move the point back $${k}$ places to the ${n > 0 ? "right" : "left"}, and you get $${standard(v)}$ again.`,
              `把小数点向${n > 0 ? "右" : "左"}移回 $${k}$ 位，又得到 $${standard(v)}$。`,
            ],
            [
              [
                a,
                -n,
                n > 0
                  ? "That has the wrong sign; a number of $10$ or more has a positive exponent."
                  : "That has the wrong sign; a number less than $1$ has a negative exponent.",
                n > 0 ? "这是符号错了；大于或等于 $10$ 的数指数是正的。" : "这是符号错了；小于 $1$ 的数指数是负的。",
              ],
              [a, n + 1, "That counts one place too many.", "这是多数了一位。"],
              [a, n - 1, "That counts one place too few.", "这是少数了一位。"],
            ],
          );
        },
        tapeFigure(
          [
            {
              total: "45 000",
              pieces: [{ size: 2, text: "4.5" }, ...Array.from({ length: 4 }, () => ({ size: 1, text: "×10", lit: true }))],
            },
          ],
          [
            "A bar: 4.5 followed by four shaded pieces ×10, with 45 000 over the whole bar.",
            "一个长条：4.5 后面跟着四段涂色的 ×10，整个长条上方标着 45 000。",
          ],
        ),
      ),
      lesson(
        "converting-to-standard-notation",
        ["Converting to standard notation", "把科学记数法还原成一般形式"],
        [
          [
            "Multiplying by $10^{n}$ moves the decimal point $n$ places to the right. Multiplying by $10^{-n}$ moves it $n$ places to the left. Fill the empty places with zeros: $6.07 \\times 10^{5} = 607{,}000$ and $2.5 \\times 10^{-3} = 0.0025$.",
            "乘以 $10^{n}$，小数点向右移动 $n$ 位；乘以 $10^{-n}$，小数点向左移动 $n$ 位。空出的数位补 $0$：$6.07 \\times 10^{5} = 607{,}000$，$2.5 \\times 10^{-3} = 0.0025$。",
          ],
          [
            "Divide by $10$ three times: $2.5 \\div 10 \\div 10 \\div 10 = 0.0025$.",
            "除以三次 $10$：$2.5 \\div 10 \\div 10 \\div 10 = 0.0025$。",
          ],
          [
            "A negative exponent moves the point to the left. $2.5 \\times 10^{-3}$ is $0.0025$, not $2500$.",
            "负指数让小数点向左移。$2.5 \\times 10^{-3}$ 是 $0.0025$，不是 $2500$。",
          ],
        ],
        (rng) => {
          const a = mantissa(rng);
          const n = rng.pick([rng.int(2, 7), rng.int(-5, -1)]);
          const v = scientificValue(a, n);
          const k = Math.abs(n);
          return valued(
            [`Write $${sci(a, n)}$ in standard notation.`, `把 $${sci(a, n)}$ 写成一般形式。`],
            v,
            [
              [
                ["Read the exponent", "看指数"],
                [
                  `The exponent is $${n}$, so the point moves $${k}$ places to the ${n > 0 ? "right" : "left"}.`,
                  `指数是 $${n}$，所以小数点向${n > 0 ? "右" : "左"}移动 $${k}$ 位。`,
                ],
              ],
              [
                ["Move the point", "移动小数点"],
                ["Fill the empty places with zeros:", "空出的数位补 $0$："],
                [`${sci(a, n)} = ${standard(v)}`],
              ],
            ],
            [
              `Write it back in scientific notation: the point moves $${k}$ places to give $${sci(a, n)}$ again.`,
              `再写回科学记数法：小数点移动 $${k}$ 位，又得到 $${sci(a, n)}$。`,
            ],
            [
              [scientificValue(a, -n), "That moves the point the wrong way.", "这是把小数点移错了方向。"],
              [scientificValue(a, n + 1), "That moves the point one place too far.", "这是多移了一位。"],
              [scientificValue(a, n - 1), "That moves the point one place too few.", "这是少移了一位。"],
            ],
            { form: "decimal" },
          );
        },
        tapeFigure(
          [
            {
              total: "0.0025",
              pieces: [{ size: 2, text: "2.5" }, ...Array.from({ length: 3 }, () => ({ size: 1, text: "÷10", lit: true }))],
            },
          ],
          [
            "A bar: 2.5 followed by three shaded pieces ÷10, with 0.0025 over the whole bar.",
            "一个长条：2.5 后面跟着三段涂色的 ÷10，整个长条上方标着 0.0025。",
          ],
        ),
      ),
    ],
  },
  [
    "The Sun is about $150{,}000{,}000$ km from Earth. That is a lot of zeros to write and to read. Scientists write $1.5 \\times 10^{8}$ km instead.",
    "太阳离地球大约 $150{,}000{,}000$ 千米。这么多 $0$，写起来读起来都麻烦。科学家把它写成 $1.5 \\times 10^{8}$ 千米。",
  ],
  ["Move the point in $1.5$ eight places to the right: $150{,}000{,}000$.", "把 $1.5$ 的小数点向右移动八位：$150{,}000{,}000$。"],
  ["write very large and very small numbers in scientific notation, and back.", "用科学记数法表示很大和很小的数，并能还原。"],
);

/** exponentTopics are the exponent and scientific notation topics. */
export const exponentTopics: readonly TopicDef[] = [
  powersOfRationalNumbers,
  zeroAndNegativeExponents,
  productAndQuotientRules,
  powerRules,
  scientificNotation,
];
