import type { KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import type { Pair, Walk } from "./early-grades-more-kit.ts";
import { base, mono } from "./exponents.ts";
import { chosen, expressed, lesson, type Said, valued, withIntro } from "./grade-6-kit.ts";
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

/** distinct keeps the wrong responses that differ from the answer and from one another. */
const distinct = (answer: string, saids: readonly Said[]): Said[] =>
  saids.filter(([r], i) => r !== answer && saids.findIndex(([s]) => s === r) === i);

/** near writes a rational number rounded to two decimal places. */
const near = (v: Q) => String(Math.round(v.toNumber() * 100) / 100);

/** raised writes the k-th power of an integer, with a negative base in parentheses. */
const raised = (n: bigint, k: number) => `${n < 0n ? `(${n})` : n}^{${k}}`;

/** powersOfNegativeOne evaluates powers of -1 by the parity of the exponent. */
export const powersOfNegativeOne = withIntro(
  topic(
    "powers-of-negative-one",
    t("Powers of Negative One", "−1 的乘方"),
    t(
      "Multiplying by −1 flips the sign, so the powers of −1 alternate between −1 and 1: an even power of −1 is 1 and an odd power is −1. Without parentheses, −1ⁿ means −(1ⁿ), which is −1 for every n.",
      "乘以 −1 会改变符号，所以 −1 的乘方在 −1 和 1 之间交替：−1 的偶数次幂是 1，奇数次幂是 −1。没有括号时，−1ⁿ 表示 −(1ⁿ)，对任何 n 都等于 −1。",
    ),
    ["exponents-with-rational-bases"],
    ["8.EE.A.1"],
    [
      lesson(
        "even-and-odd-powers-of-negative-one",
        ["Even and odd powers", "偶数次幂与奇数次幂"],
        [
          [
            "$(-1)^{2} = 1$, $(-1)^{3} = -1$, $(-1)^{4} = 1$, and so on: the factors pair up into $(-1)(-1) = 1$, and an odd exponent leaves one $-1$ over. So $(-1)^{58} = 1$ because $58$ is even, and $(-1)^{77} = -1$ because $77$ is odd.",
            "$(-1)^{2} = 1$，$(-1)^{3} = -1$，$(-1)^{4} = 1$，依此类推：因数两两配成 $(-1)(-1) = 1$，指数为奇数时会剩下一个 $-1$。所以 $(-1)^{58} = 1$，因为 $58$ 是偶数；$(-1)^{77} = -1$，因为 $77$ 是奇数。",
          ],
          [
            "Step back one power: $(-1)^{76}$ has an even exponent, so it is $1$, and $1 \\cdot (-1) = -1 = (-1)^{77}$.",
            "往回退一次：$(-1)^{76}$ 的指数是偶数，所以它是 $1$，而 $1 \\cdot (-1) = -1 = (-1)^{77}$。",
          ],
          [
            "A power is not a product with the exponent: $(-1)^{77}$ is $-1$, not $-77$.",
            "乘方不是与指数相乘：$(-1)^{77}$ 是 $-1$，不是 $-77$。",
          ],
        ],
        (rng) => {
          const n = rng.bool(0.3) ? rng.int(5, 12) : rng.int(13, 250);
          const even = n % 2 === 0;
          const answer = even ? 1 : -1;
          return valued(
            [`Evaluate $(-1)^{${n}}$.`, `计算 $(-1)^{${n}}$。`],
            answer,
            [
              [
                ["Even or odd", "看奇偶"],
                [
                  `$${n}$ ends in $${n % 10}$, so it is ${even ? "even" : "odd"}.`,
                  `$${n}$ 的个位是 $${n % 10}$，所以它是${even ? "偶数" : "奇数"}。`,
                ],
              ],
              [
                ["Pair the factors", "两两配对"],
                even
                  ? [`The $${n}$ factors of $-1$ pair up into $1$s with none left over:`, `$${n}$ 个 $-1$ 两两配成 $1$，没有剩余：`]
                  : [
                      `The $${n}$ factors of $-1$ pair up into $1$s with one $-1$ left over:`,
                      `$${n}$ 个 $-1$ 两两配成 $1$ 后，还剩一个 $-1$：`,
                    ],
                [`(-1)^{${n}} = ${answer}`],
              ],
            ],
            even
              ? [
                  `Step back one power: $(-1)^{${n - 1}}$ has an odd exponent, so it is $-1$, and $-1 \\cdot (-1) = 1$.`,
                  `往回退一次：$(-1)^{${n - 1}}$ 的指数是奇数，所以它是 $-1$，而 $-1 \\cdot (-1) = 1$。`,
                ]
              : [
                  `Step back one power: $(-1)^{${n - 1}}$ has an even exponent, so it is $1$, and $1 \\cdot (-1) = -1$.`,
                  `往回退一次：$(-1)^{${n - 1}}$ 的指数是偶数，所以它是 $1$，而 $1 \\cdot (-1) = -1$。`,
                ],
            [
              [
                -answer,
                even
                  ? "That is the sign of an odd power; with an even exponent the pairs leave nothing over."
                  : "That is the sign of an even power; with an odd exponent one −1 is left over.",
                even ? "这是奇数次幂的符号；指数为偶数时两两配对后没有剩余。" : "这是偶数次幂的符号；指数为奇数时会剩下一个 −1。",
              ],
              [-n, "That multiplies −1 by the exponent; a power multiplies −1 by itself.", "这是用 −1 乘以指数了；乘方是 −1 自己连乘。"],
            ],
          );
        },
        factorTape(
          [
            ["−1", 2],
            ["−1", 2],
            ["−1", 1],
          ],
          "(−1)⁵",
          [
            "Five factors of −1 under (−1)⁵: two shaded and unshaded pairs, each making 1, and one −1 left over.",
            "(−1)⁵ 下面是 5 个因数 −1：两组配对，每组得 1，还剩一个 −1。",
          ],
        ),
      ),
      lesson(
        "negative-signs-and-powers-of-one",
        ["Negative signs and powers", "负号与乘方"],
        [
          [
            "In $(-1)^{n}$ the base is $-1$; in $-1^{n}$ the base is $1$, and the minus sign is applied afterward, so $-1^{n} = -1$ for every $n$. For example, $-1^{4} + (-1)^{6} = -1 + 1 = 0$ and $(-1)^{3} \\cdot (-1)^{5} = (-1)(-1) = 1$.",
            "在 $(-1)^{n}$ 中，底数是 $-1$；在 $-1^{n}$ 中，底数是 $1$，负号是算完乘方后再加上的，所以对任何 $n$ 都有 $-1^{n} = -1$。例如 $-1^{4} + (-1)^{6} = -1 + 1 = 0$，$(-1)^{3} \\cdot (-1)^{5} = (-1)(-1) = 1$。",
          ],
          ["Put in the hidden parentheses: $-1^{4}$ is $-(1^{4}) = -(1) = -1$.", "补上省略的括号：$-1^{4}$ 是 $-(1^{4}) = -(1) = -1$。"],
          [
            "Without parentheses the exponent does not reach the minus sign: $-1^{4}$ is $-1$, not $1$.",
            "没有括号时，指数管不到负号：$-1^{4}$ 是 $-1$，不是 $1$。",
          ],
        ],
        (rng) => {
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
            const second = b[0].startsWith("-") ? `(${b[0]})` : b[0];
            const expr = `${a[0]} ${op} ${second}`;
            const answer = f(a[1], b[1]);
            const bare = [a, b].find((x) => x[0].startsWith("-1"))!;
            return valued(
              [`Evaluate $${expr}$.`, `计算 $${expr}$。`],
              answer,
              [
                [
                  ["Find each base", "看清底数"],
                  [
                    "Without parentheses the base is $1$ and the minus sign comes after; with them the base is $-1$:",
                    "没有括号时底数是 $1$，负号最后再加；有括号时底数是 $-1$：",
                  ],
                  [`${a[0]} = ${a[1]}`, `${b[0]} = ${b[1]}`],
                ],
                [
                  ["Combine", "计算"],
                  ["Put the two values together:", "把两个值合起来计算："],
                  [`${a[1]} ${op} ${signed(b[1])} = ${answer}`],
                ],
              ],
              [
                `Put in the hidden parentheses: $${bare[0]}$ is $-(${bare[0].slice(1)}) = -1$, whatever the exponent.`,
                `补上省略的括号：$${bare[0]}$ 是 $-(${bare[0].slice(1)}) = -1$，与指数无关。`,
              ],
              [
                [
                  f(a[2], b[2]),
                  "That reads −1ⁿ as (−1)ⁿ; without parentheses the exponent applies to 1 only.",
                  "这是把 −1ⁿ 当成了 (−1)ⁿ；没有括号时，指数只作用于 1。",
                ],
                [
                  -answer,
                  "That has the opposite sign; settle the sign of each term before combining.",
                  "这是符号反了；先定好每一项的符号再计算。",
                ],
              ],
            );
          }
        },
        tapeFigure(
          [
            {
              total: "(−1)⁴ = 1",
              pieces: [
                { size: 1, text: "−1" },
                { size: 1, text: "−1" },
                { size: 1, text: "−1" },
                { size: 1, text: "−1" },
              ],
            },
            {
              total: "−1⁴ = −1",
              pieces: [
                { size: 1, text: "−", lit: true },
                { size: 1, text: "1" },
                { size: 1, text: "1" },
                { size: 1, text: "1" },
                { size: 1, text: "1" },
              ],
            },
          ],
          [
            "Two bars: (−1)⁴ is four factors of −1 and equals 1; −1⁴ is a shaded minus sign in front of four factors of 1 and equals −1.",
            "两个长条：(−1)⁴ 是 4 个因数 −1，等于 1；−1⁴ 是涂色的负号加上 4 个因数 1，等于 −1。",
          ],
        ),
      ),
    ],
  ),
  [
    "A light switch is flipped once for every guest who walks in. It starts off, and $57$ guests arrive. Is the light on or off?",
    "每进来一位客人，电灯开关就拨一次。开关一开始是关着的，来了 $57$ 位客人。灯是亮着还是关着？",
  ],
  [
    "Each pair of flips puts it back, and $57$ is odd, so one flip is left over: it is on. Powers of $-1$ work the same way: $(-1)^{57} = -1$.",
    "每拨两次就回到原样，$57$ 是奇数，所以多出一次：灯亮着。$-1$ 的乘方也是这样：$(-1)^{57} = -1$。",
  ],
  [
    "evaluate powers of $-1$ from whether the exponent is even or odd, and tell $(-1)^{n}$ from $-1^{n}$.",
    "根据指数的奇偶求 $-1$ 的乘方，并区分 $(-1)^{n}$ 和 $-1^{n}$。",
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
export const evaluatingExpressionsWithIntegerExponents = withIntro(
  topic(
    "evaluating-expressions-with-integer-exponents",
    t("Evaluating Expressions With Integer Exponents", "计算含整数指数的式子"),
    t(
      "Evaluate zero and negative powers first, following the order of operations: b⁰ = 1 and b⁻ⁿ = 1/bⁿ. A coefficient in front of a power multiplies the power after it is evaluated: 3 · 2⁻² = 3/4.",
      "按照运算顺序，先算零次幂和负整数指数幂：b⁰ = 1，b⁻ⁿ = 1/bⁿ。幂前面的系数要在算出幂之后再相乘：3 · 2⁻² = 3/4。",
    ),
    ["negative-exponents", "evaluating-expressions-with-positive-integer-exponents"],
    ["8.EE.A.1"],
    [
      lesson(
        "numerical-expressions-with-integer-exponents",
        ["Numerical expressions", "数的式子"],
        [
          [
            "A negative exponent means the reciprocal of the positive power, $a^{-n} = \\frac{1}{a^{n}}$, and any nonzero number to the power zero is $1$. Evaluate every power first, then multiply, divide, add and subtract in the usual order. In $3 \\cdot 2^{-2} + 5^{0}$, evaluate the powers first: $2^{-2} = \\frac{1}{4}$ and $5^{0} = 1$. Then $3 \\cdot \\frac{1}{4} + 1 = \\frac{7}{4}$.",
            "负整数指数表示正整数次幂的倒数，$a^{-n} = \\frac{1}{a^{n}}$；任何非零数的零次幂都等于 $1$。先算出每个乘方，再按通常的顺序进行乘除和加减。在 $3 \\cdot 2^{-2} + 5^{0}$ 中先算乘方：$2^{-2} = \\frac{1}{4}$，$5^{0} = 1$。于是 $3 \\cdot \\frac{1}{4} + 1 = \\frac{7}{4}$。",
          ],
          [
            "In decimals: $2^{-2} = 0.25$, so $3 \\cdot 0.25 + 1 = 1.75$, which is seven quarters.",
            "用小数验算：$2^{-2} = 0.25$，所以 $3 \\cdot 0.25 + 1 = 1.75$，正是四分之七。",
          ],
          [
            "A negative exponent never makes the value negative: $2^{-2}$ is $0.25$, not $-4$.",
            "负整数指数不会使值变成负数：$2^{-2}$ 是 $0.25$，不是 $-4$。",
          ],
        ],
        (rng) => {
          const [b, k] = [rng.pick([2, 3, 4, 5, 10]), rng.int(1, 3)];
          const c = rng.int(2, 9);
          const [d, j] = [rng.pick([2, 3, 4, 6]), rng.int(1, 2)];
          const zero = rng.bool();
          const op = rng.pick([1, -1]);
          const sign = op > 0 ? "+" : "-";
          const p = Q.of(b).pow(k);
          const q = zero ? Q.one : Q.one.div(Q.of(d).pow(j));
          const second = zero ? `${d}^{0}` : `${d}^{-${j}}`;
          const expr = `${c} \\cdot ${b}^{-${k}} ${sign} ${second}`;
          const value = (first: Q, other: Q) =>
            Q.of(c)
              .mul(first)
              .add(other.mul(Q.of(op)));
          const first = Q.of(c).div(p);
          const answer = value(Q.one.div(p), q);
          return valued(
            [`Evaluate $${expr}$.`, `计算 $${expr}$。`],
            answer,
            [
              [
                ["Evaluate the powers", "先算乘方"],
                [
                  zero
                    ? "A negative power is the reciprocal of the positive power, and a zeroth power is $1$:"
                    : "Each negative power is the reciprocal of the positive power:",
                  zero ? "负整数指数幂是正整数次幂的倒数，零次幂是 $1$：" : "每个负整数指数幂都是正整数次幂的倒数：",
                ],
                [`${b}^{-${k}} = \\frac{1}{${p.toLatex()}}`, `${second} = ${q.toLatex()}`],
              ],
              [
                ["Multiply, then add or subtract", "先乘，再加减"],
                ["Multiply by the coefficient before combining:", "先乘系数，再加减："],
                [
                  `${c} \\cdot \\frac{1}{${p.toLatex()}} ${sign} ${q.toLatex()} = ${first.toLatex()} ${sign} ${q.toLatex()} = ${answer.toLatex()}`,
                ],
              ],
            ],
            [
              `In decimals the two terms are about $${near(first)}$ and $${near(q)}$, and the value is about $${near(answer)}$.`,
              `用小数估算：两项约为 $${near(first)}$ 和 $${near(q)}$，结果约为 $${near(answer)}$。`,
            ],
            [
              [
                value(p.neg(), zero ? Q.one : Q.of(d).pow(j).neg()),
                "That reads each negative power as a negative number; it is a reciprocal.",
                "这是把负整数指数幂当成了负数；它是倒数。",
              ],
              ...(zero
                ? [[value(Q.one.div(p), Q.zero), "That takes the zeroth power as 0; it is 1.", "这是把零次幂当成了 0；它等于 1。"] as const]
                : []),
              [
                Q.one.div(Q.of(c * b).pow(k)).add(q.mul(Q.of(op))),
                "That raises the coefficient too; the exponent applies to the base only.",
                "这是把系数也乘方了；指数只作用于底数。",
              ],
            ],
          );
        },
        stepDown(2, 3, [
          "A number line from 0 to 8 marking 2³ = 8, 2² = 4, 2¹ = 2 and 2⁰ = 1, each jump halving the number.",
          "从 0 到 8 的数轴，标出 2³ = 8、2² = 4、2¹ = 2 和 2⁰ = 1，每跳一次数减半。",
        ]),
      ),
      lesson(
        "substituting-into-negative-powers",
        ["Substituting into negative powers", "代入负整数指数幂"],
        [
          [
            "To evaluate $3x^{-2} - x^{0}$ for $x = -2$, substitute in parentheses: $3(-2)^{-2} - (-2)^{0} = 3 \\cdot \\frac{1}{4} - 1 = -\\frac{1}{4}$. The exponent applies to $x$, not to $3x$.",
            "求 $x = -2$ 时 $3x^{-2} - x^{0}$ 的值，代入时加上括号：$3(-2)^{-2} - (-2)^{0} = 3 \\cdot \\frac{1}{4} - 1 = -\\frac{1}{4}$。指数作用于 $x$ 而不是 $3x$。",
          ],
          ["In decimals: $3 \\cdot 0.25 - 1 = -0.25$, a negative quarter.", "用小数验算：$3 \\cdot 0.25 - 1 = -0.25$，是负四分之一。"],
          [
            "$(-2)^{-2}$ is positive, because the power $(-2)^{2} = 4$ is: it is $0.25$, not $-0.25$ and not $4$.",
            "$(-2)^{-2}$ 是正数，因为 $(-2)^{2} = 4$ 是正数：它是 $0.25$，既不是 $-0.25$，也不是 $4$。",
          ],
        ],
        (rng) => {
          const x = rng.pick([-3, -2, 2, 3, 4, 5]);
          const c = rng.int(2, 8);
          const k = rng.int(1, Math.abs(x) > 3 ? 1 : 2);
          const d = rng.pick([0, 1, 2, 3, 5]);
          const op = rng.pick([1, -1]);
          const sign = op > 0 ? "+" : "-";
          const last = d === 0 ? "x^{0}" : String(d);
          const lastValue = d === 0 ? Q.one : Q.of(d);
          const expr = `${c}x^{-${k}} ${sign} ${last}`;
          const px = Q.of(x).pow(k);
          const first = Q.of(c).div(px);
          const answer = first.add(lastValue.mul(Q.of(op)));
          const substituted = `${c}(${x})^{-${k}} ${sign} ${d === 0 ? `(${x})^{0}` : d}`;
          return valued(
            [`Evaluate $${expr}$ for $x = ${x}$.`, `当 $x = ${x}$ 时，求 $${expr}$ 的值。`],
            answer,
            [
              [
                ["Substitute", "代入"],
                [`Put $${x}$ in place of $x$, in parentheses:`, `把 $${x}$ 加上括号代替 $x$：`],
                [`${expr} = ${substituted}`],
              ],
              [
                ["Evaluate the powers", "算乘方"],
                ["The negative power is a reciprocal:", "负整数指数幂是倒数："],
                [`(${x})^{-${k}} = \\frac{1}{${px.toLatex()}}`, ...(d === 0 ? [`(${x})^{0} = 1`] : [])],
              ],
              [
                ["Finish", "算出结果"],
                ["Multiply by the coefficient, then add or subtract:", "先乘系数，再加减："],
                [`${c} \\cdot \\frac{1}{${px.toLatex()}} ${sign} ${lastValue.toLatex()} = ${answer.toLatex()}`],
              ],
            ],
            [
              `In decimals: the first term is about $${near(first)}$, and $${near(first)} ${sign} ${lastValue.toLatex()}$ is about $${near(answer)}$.`,
              `用小数估算：第一项约为 $${near(first)}$，$${near(first)} ${sign} ${lastValue.toLatex()}$ 约为 $${near(answer)}$。`,
            ],
            [
              [
                Q.of(c)
                  .mul(px.neg())
                  .add(lastValue.mul(Q.of(op))),
                "That reads the negative power as a negative number; it is a reciprocal.",
                "这是把负整数指数幂当成了负数；它是倒数。",
              ],
              [
                Q.one.div(Q.of(c * x).pow(k)).add(lastValue.mul(Q.of(op))),
                "That raises the coefficient too; the exponent applies to x only.",
                "这是把系数也乘方了；指数只作用于 x。",
              ],
              ...(d === 0 ? [[first, "That takes the zeroth power as 0; it is 1.", "这是把零次幂当成了 0；它等于 1。"] as const] : []),
            ],
          );
        },
        fractionSteps(2, 2, [
          "A number line from 0 to 1 marking 1, 2⁻¹ = 1/2 and 2⁻² = 1/4: each negative power of 2 is half the one before.",
          "从 0 到 1 的数轴，标出 1、2⁻¹ = 1/2 和 2⁻² = 1/4：2 的每个负整数指数幂都是前一个的一半。",
        ]),
      ),
    ],
  ),
  [
    "A bacterium splits in two every hour. Now there are $3$. How many were there $2$ hours ago?",
    "一种细菌每小时一分为二。现在有 $3$ 个。$2$ 小时前有多少个？",
  ],
  [
    "Going back an hour halves the count, so $2$ hours ago there were $3 \\cdot 2^{-2} = 3 \\cdot 0.25 = 0.75$, three quarters of a bacterium: the growth was already under way.",
    "每往回一小时数量减半，所以 $2$ 小时前是 $3 \\cdot 2^{-2} = 3 \\cdot 0.25 = 0.75$，即四分之三个：那时分裂已经在进行中。",
  ],
  [
    "evaluate numerical expressions with zero and negative exponents, and substitute values into them.",
    "计算含零指数和负整数指数的数的式子，并把数值代入这样的式子。",
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
export const theQuotientRuleForExponents = withIntro(
  topic(
    "the-quotient-rule-for-exponents",
    t("The Quotient Rule for Exponents", "同底数幂的除法"),
    t(
      "To divide powers of the same nonzero base, keep the base and subtract the exponent of the denominator from that of the numerator: bᵐ ÷ bⁿ = bᵐ⁻ⁿ. If the denominator has the larger exponent, the result has a negative exponent.",
      "同底数（非零）幂相除，底数不变，用分子的指数减去分母的指数：bᵐ ÷ bⁿ = bᵐ⁻ⁿ。如果分母的指数较大，结果的指数为负数。",
    ),
    ["the-product-rule-for-exponents"],
    ["8.EE.A.1"],
    [
      lesson(
        "dividing-powers-of-a-number",
        ["Dividing powers of a number", "同底数的数的幂相除"],
        [
          [
            "In $\\frac{7^{9}}{7^{4}}$, four factors of $7$ cancel, leaving $7^{9 - 4} = 7^{5}$. Subtract in order, numerator minus denominator: $\\frac{7^{2}}{7^{6}} = 7^{2 - 6} = 7^{-4}$. With negative exponents, subtracting a negative adds: $\\frac{7^{3}}{7^{-2}} = 7^{3 - (-2)} = 7^{5}$.",
            "在 $\\frac{7^{9}}{7^{4}}$ 中，约去四个 $7$，剩下 $7^{9 - 4} = 7^{5}$。要按顺序相减，分子的指数减分母的指数：$\\frac{7^{2}}{7^{6}} = 7^{2 - 6} = 7^{-4}$。有负指数时，减去负数就是加：$\\frac{7^{3}}{7^{-2}} = 7^{3 - (-2)} = 7^{5}$。",
          ],
          ["Multiply back: $7^{5} \\cdot 7^{4} = 7^{9}$, the numerator.", "乘回去：$7^{5} \\cdot 7^{4} = 7^{9}$，正是分子。"],
          [
            "Subtract the exponents, do not divide them: $7^{8} \\div 7^{2}$ is $7^{6}$, not $7^{4}$.",
            "指数要相减，不是相除：$7^{8} \\div 7^{2}$ 是 $7^{6}$，不是 $7^{4}$。",
          ],
        ],
        (rng) => {
          for (;;) {
            const b = rng.int(2, 9);
            const [m, n] = [exps(rng, 0.3), exps(rng, 0.3)];
            if (m === n) continue;
            const k = m - n;
            const expr = rng.bool(0.7) ? `\\frac{${b}^{${m}}}{${b}^{${n}}}` : `${b}^{${m}} \\div ${b}^{${n}}`;
            return valued(
              [
                `Write $${expr}$ as a single power of $${b}$, in the form $${b}^{n}$. What is $n$?`,
                `把 $${expr}$ 写成以 $${b}$ 为底的一个幂 $${b}^{n}$。$n$ 是多少？`,
              ],
              k,
              [
                [
                  ["Check the bases", "看底数"],
                  [
                    `Both powers have base $${b}$, so subtract the exponents, numerator minus denominator:`,
                    `两个幂的底数都是 $${b}$，所以指数相减，用分子的指数减分母的指数：`,
                  ],
                  [`${expr} = ${b}^{${m} - ${signed(n)}}`],
                ],
                [["Subtract", "相减"], ["Subtract with the signs:", "带着符号相减："], [`${m} - ${signed(n)} = ${k}`]],
              ],
              [
                `Multiply back: $${b}^{${k}} \\cdot ${b}^{${n}} = ${b}^{${k} + ${signed(n)}} = ${b}^{${m}}$, the numerator.`,
                `乘回去：$${b}^{${k}} \\cdot ${b}^{${n}} = ${b}^{${k} + ${signed(n)}} = ${b}^{${m}}$，正是分子。`,
              ],
              [
                [
                  n - m,
                  "That subtracts the wrong way round; take the denominator's exponent from the numerator's.",
                  "这是减反了；应该用分子的指数减分母的指数。",
                ],
                [m + n, "That adds the exponents; dividing powers subtracts them.", "这是把指数相加了；同底数幂相除，指数相减。"],
                ...(m % n === 0
                  ? [
                      [
                        m / n,
                        "That divides the exponents; dividing powers subtracts them.",
                        "这是把指数相除了；同底数幂相除，指数相减。",
                      ] as const,
                    ]
                  : []),
              ],
              { solveFor: "n" },
            );
          }
        },
        factorTape(
          [
            ["7", 5],
            ["7", 4],
          ],
          "7⁹",
          [
            "Nine factors of 7 under 7⁹: the shaded 4 cancel with the four factors of 7⁴ in the denominator, leaving 5.",
            "7⁹ 下面是 9 个因数 7：涂色的 4 个与分母 7⁴ 的 4 个因数约去，剩下 5 个。",
          ],
        ),
      ),
      lesson(
        "dividing-monomials",
        ["Dividing monomials", "单项式相除"],
        [
          [
            "Divide the coefficients and subtract the exponents of each variable: $\\frac{12x^{7}y^{2}}{4x^{2}y^{5}} = 3x^{5}y^{-3} = \\frac{3x^{5}}{y^{3}}$. A variable whose exponent comes out negative ends up in the denominator.",
            "系数相除，同一个字母的指数相减：$\\frac{12x^{7}y^{2}}{4x^{2}y^{5}} = 3x^{5}y^{-3} = \\frac{3x^{5}}{y^{3}}$。指数算出来为负数的字母最后在分母中。",
          ],
          [
            "Multiply back: $3x^{5}y^{-3}$ times $4x^{2}y^{5}$ is $12x^{7}y^{2}$, the numerator.",
            "乘回去：$3x^{5}y^{-3}$ 乘 $4x^{2}y^{5}$ 得 $12x^{7}y^{2}$，正是分子。",
          ],
          [
            "The coefficients divide; they are not subtracted: $12$ over $4$ is $3$, not $8$.",
            "系数要相除，不是相减：$12$ 除以 $4$ 得 $3$，不是 $8$。",
          ],
        ],
        (rng) => {
          for (;;) {
            const d = rng.int(2, 6);
            const k = rng.pick([1, 2, 3, 4, 5, -2, -3]);
            const [m, n] = [rng.int(2, 9), rng.int(1, 6)];
            const [p, q] = [rng.int(1, 5), rng.int(1, 6)];
            if (m === n && p === q) continue;
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
            const saids: Said[] = [
              ...(k === 1
                ? []
                : [
                    [
                      positive(Q.of(d * k - d), diff),
                      "That subtracts the coefficients; they divide.",
                      "这是把系数相减了；系数应该相除。",
                    ] as const,
                  ]),
              [
                positive(Q.of(k), [
                  ["x", n - m],
                  ["y", q - p],
                ]),
                "That subtracts the wrong way round; take the denominator's exponents from the numerator's.",
                "这是减反了；应该用分子的指数减分母的指数。",
              ],
              [
                positive(Q.of(k), [
                  ["x", m + n],
                  ["y", p + q],
                ]),
                "That adds the exponents; dividing powers subtracts them.",
                "这是把指数相加了；同底数幂相除，指数相减。",
              ],
            ];
            return expressed(
              [`Simplify $${expr}$. Use only positive exponents.`, `化简 $${expr}$，结果只用正整数指数。`],
              answer,
              [
                [["Divide the numbers", "系数相除"], ["Divide the coefficients:", "系数相除："], [`${d * k} \\div ${d} = ${k}`]],
                [
                  ["Subtract the exponents", "指数相减"],
                  [
                    "Subtract the exponents of each letter, and move any negative power below the bar:",
                    "同一个字母的指数相减，负指数幂移到分数线下面：",
                  ],
                  [`${mono(k, [])}x^{${m} - ${n}}y^{${p} - ${q}} = ${mono(k, diff)} = ${answer}`],
                ],
              ],
              [
                `Count the factors of $x$: $${m}$ on top and $${n}$ below leave $${m - n}$; of $y$: $${p}$ on top and $${q}$ below leave $${p - q}$.`,
                `数 $x$ 的个数：上面 $${m}$ 个、下面 $${n}$ 个，剩 $${m - n}$；$y$：上面 $${p}$ 个、下面 $${q}$ 个，剩 $${p - q}$。`,
              ],
              distinct(answer, saids),
              { simplified: true },
            );
          }
        },
        factorTape(
          [
            ["x", 5],
            ["x", 2],
          ],
          "x⁷",
          [
            "Seven factors of x under x⁷: the shaded 2 cancel with x² in the denominator, leaving x⁵.",
            "x⁷ 下面是 7 个因数 x：涂色的 2 个与分母的 x² 约去，剩下 x⁵。",
          ],
        ),
      ),
    ],
  ),
  [
    "A hard drive holds $10^{12}$ bytes, and a photo takes $10^{7}$ bytes. How many photos fit?",
    "一块硬盘能存 $10^{12}$ 字节，一张照片占 $10^{7}$ 字节。能存多少张照片？",
  ],
  [
    "$10^{12} \\div 10^{7} = 10^{5} = 100{,}000$ photos: seven of the twelve factors of $10$ cancel, and $12 - 7 = 5$.",
    "$10^{12} \\div 10^{7} = 10^{5} = 100{,}000$ 张：$12$ 个因数 $10$ 中约去 $7$ 个，$12 - 7 = 5$。",
  ],
  ["divide powers of the same base by subtracting their exponents.", "用指数相减的方法计算同底数幂的除法。"],
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
export const thePowerOfProductRuleForExponents = withIntro(
  topic(
    "the-power-of-product-rule-for-exponents",
    t("The Power of Product Rule for Exponents", "积的乘方法则"),
    t(
      "A power of a product is the product of the powers of its factors: (ab)ⁿ = aⁿbⁿ. Every factor inside the parentheses is raised to the power, including the coefficient and its sign: (−2x³)² = 4x⁶.",
      "积的乘方等于各因数乘方的积：(ab)ⁿ = aⁿbⁿ。括号里的每个因数都要乘方，包括系数和它的符号：(−2x³)² = 4x⁶。",
    ),
    ["the-power-rule-for-exponents"],
    ["8.EE.A.1"],
    [
      lesson(
        "powers-of-monomials",
        ["Powers of monomials", "单项式的乘方"],
        [
          [
            "$(3x^{4})^{2} = 3^{2}(x^{4})^{2} = 9x^{8}$: every factor inside the parentheses is raised to the power. A negative coefficient keeps its sign for an odd power: $(-2x^{2})^{3} = -8x^{6}$, and loses it for an even one: $(-2x^{2})^{2} = 4x^{4}$.",
            "$(3x^{4})^{2} = 3^{2}(x^{4})^{2} = 9x^{8}$：括号里的每个因数都要乘方。系数为负数时，奇数次幂仍为负：$(-2x^{2})^{3} = -8x^{6}$；偶数次幂变为正：$(-2x^{2})^{2} = 4x^{4}$。",
          ],
          [
            "Write it out: $(3x^{4})^{2} = 3x^{4} \\cdot 3x^{4}$, which is $3 \\cdot 3 = 9$ and $4 + 4 = 8$ factors of $x$.",
            "展开写：$(3x^{4})^{2} = 3x^{4} \\cdot 3x^{4}$，系数是 $3 \\cdot 3 = 9$，$x$ 有 $4 + 4 = 8$ 个。",
          ],
          [
            "Raise the coefficient to the power, do not multiply it by the exponent: $3^{2} = 9$, not $6$.",
            "系数要乘方，而不是乘以指数：$3^{2} = 9$，不是 $6$。",
          ],
        ],
        (rng) => {
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
          return expressed(
            [`Simplify $${expr}$.`, `化简 $${expr}$。`],
            answer,
            [
              [
                ["Raise the number", "系数乘方"],
                [`The coefficient is raised to the power $${n}$:`, `系数乘 $${n}$ 次方：`],
                [`${signed(c)}^{${n}} = ${cn}`],
              ],
              [
                ["Multiply the exponents", "指数相乘"],
                ["Each power of a letter is raised to a power, so its exponent is multiplied:", "每个字母的幂再乘方，指数相乘："],
                [`(x^{${m}})^{${n}} = x^{${m * n}}`, ...(p ? [`(y^{${p}})^{${n}} = y^{${p * n}}`] : [])],
              ],
            ],
            [
              `Write it out: $${n}$ copies of $${mono(c, inside)}$ multiply to $${cn}$ from the numbers and $${m * n}$ factors of $x$.`,
              `展开写：$${n}$ 个 $${mono(c, inside)}$ 相乘，系数得 $${cn}$，$x$ 共有 $${m * n}$ 个。`,
            ],
            distinct(answer, [
              [
                mono(c * n, out),
                "That multiplies the coefficient by the exponent; it is raised to the power.",
                "这是用系数乘以指数了；系数要乘方。",
              ],
              [
                mono(c, out),
                "That leaves the coefficient alone; every factor is raised to the power.",
                "这是没有把系数乘方；每个因数都要乘方。",
              ],
              [
                mono(
                  cn,
                  inside.map(([v, e]) => [v, e ? e + n : 0] as const),
                ),
                "That adds the exponents; a power of a power multiplies them.",
                "这是把指数相加了；幂的乘方，指数相乘。",
              ],
              [
                mono(-cn, out),
                c > 0
                  ? "That gives the result a minus sign; a positive number to any power is positive."
                  : n % 2 === 0
                    ? "That keeps the minus sign; an even power of a negative number is positive."
                    : "That drops the minus sign; an odd power of a negative number is negative.",
                c > 0
                  ? "这是给结果加了负号；正数的任何次幂都是正数。"
                  : n % 2 === 0
                    ? "这是保留了负号；负数的偶数次幂是正数。"
                    : "这是丢掉了负号；负数的奇数次幂是负数。",
              ],
            ]),
            { simplified: true },
          );
        },
        factorTape(
          [
            ["3x⁴", 1],
            ["3x⁴", 1],
          ],
          "(3x⁴)² = 9x⁸",
          [
            "Two equal factors 3x⁴ under (3x⁴)² = 9x⁸: the numbers multiply to 9 and the powers of x add to x⁸.",
            "(3x⁴)² = 9x⁸ 下面是两个相同的因数 3x⁴：数相乘得 9，x 的幂合起来是 x⁸。",
          ],
        ),
      ),
      lesson(
        "powers-of-products-with-negative-exponents",
        ["Negative exponents in powers of products", "积的乘方中的负整数指数"],
        [
          [
            "$(2x^{3}y^{-1})^{-2} = 2^{-2}x^{-6}y^{2} = \\frac{y^{2}}{4x^{6}}$. Multiply each exponent by the outer one, signs included, then move the factors with negative exponents below the fraction bar. The coefficient $2^{-2}$ becomes one quarter.",
            "$(2x^{3}y^{-1})^{-2} = 2^{-2}x^{-6}y^{2} = \\frac{y^{2}}{4x^{6}}$。每个指数都乘以外面的指数（连同符号），再把带负整数指数的因数移到分数线下方。系数 $2^{-2}$ 变成四分之一。",
          ],
          [
            "Check one factor: $y^{-1}$ to the power $-2$ is $y^{(-1)(-2)} = y^{2}$, which stays on top.",
            "检查一个因数：$y^{-1}$ 的 $-2$ 次方是 $y^{(-1)(-2)} = y^{2}$，留在分子上。",
          ],
          [
            "The coefficient gets the exponent too: $2^{-2}$ is one quarter, not $2$ and not $-4$.",
            "系数也要乘方：$2^{-2}$ 是四分之一，既不是 $2$，也不是 $-4$。",
          ],
        ],
        (rng) => {
          for (;;) {
            const c = rng.pick([1, 2, 3, 5]);
            const n = rng.pick([-1, -2, -3, 2, 3]);
            const [m, p] = [rng.int(1, 4), -rng.int(1, 3)];
            if ((n > 0 && c === 1) || (Math.abs(n) === 3 && c > 3)) continue;
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
            const raw = `${c === 1 ? "" : `${c}^{${n}}`}x^{${m * n}}y^{${p * n}}`;
            return expressed(
              [`Simplify $${expr}$. Use only positive exponents.`, `化简 $${expr}$，结果只用正整数指数。`],
              answer,
              [
                [
                  ["Multiply each exponent", "每个指数相乘"],
                  [`Multiply each exponent by $${n}$, signs included:`, `每个指数都乘以 $${n}$，连同符号：`],
                  [`${expr} = ${raw}`],
                ],
                [
                  ["Move negative powers", "移动负指数幂"],
                  ["Write the factors with negative exponents below the fraction bar:", "把带负整数指数的因数写到分数线下方："],
                  [`${raw} = ${answer}`],
                ],
              ],
              [
                `Check the $y$ factor: $${p} \\cdot ${signed(n)} = ${p * n}$, so it ends up ${p * n > 0 ? "on top" : "below the bar"}.`,
                `检查 $y$ 这个因数：$${p} \\cdot ${signed(n)} = ${p * n}$，所以它在${p * n > 0 ? "分子上" : "分数线下方"}。`,
              ],
              distinct(answer, [
                [
                  positive(Q.of(c), out),
                  "That leaves the coefficient unraised; it gets the exponent too.",
                  "这是没有把系数乘方；系数也要乘方。",
                ],
                [
                  positive(Q.of(Math.abs(c * n)), out),
                  "That multiplies the coefficient by the exponent; it is raised to the power.",
                  "这是用系数乘以指数了；系数要乘方。",
                ],
                [
                  positive(
                    coef,
                    inside.map(([v, e]) => [v, e + n] as const),
                  ),
                  "That adds the exponents; a power of a power multiplies them.",
                  "这是把指数相加了；幂的乘方，指数相乘。",
                ],
              ]),
              { simplified: true },
            );
          }
        },
        factorTape(
          [
            ["2x³y⁻¹", 1],
            ["2x³y⁻¹", 1],
          ],
          "(2x³y⁻¹)²",
          [
            "Two equal factors 2x³y⁻¹ under (2x³y⁻¹)²; the power −2 is one over this product.",
            "(2x³y⁻¹)² 下面是两个相同的因数 2x³y⁻¹；−2 次方就是这个积的倒数。",
          ],
        ),
      ),
    ],
  ),
  ["A square tile has sides of $3x$ centimeters. What is its area?", "一块正方形瓷砖的边长是 $3x$ 厘米。它的面积是多少？"],
  [
    "$(3x)^{2} = 3x \\cdot 3x = 9x^{2}$ square centimeters: both the $3$ and the $x$ are squared, not just the $x$.",
    "$(3x)^{2} = 3x \\cdot 3x = 9x^{2}$ 平方厘米：$3$ 和 $x$ 都要平方，不只是 $x$。",
  ],
  [
    "raise a product to a power by raising each of its factors, with positive and negative exponents.",
    "把积的每个因数分别乘方，计算正整数和负整数指数的积的乘方。",
  ],
);

/** thePowerOfQuotientRuleForExponents raises a quotient to a power, numerator and denominator alike. */
export const thePowerOfQuotientRuleForExponents = withIntro(
  topic(
    "the-power-of-quotient-rule-for-exponents",
    t("The Power of Quotient Rule for Exponents", "商的乘方法则"),
    t(
      "A power of a quotient is the quotient of the powers: (a/b)ⁿ = aⁿ/bⁿ. Both the numerator and the denominator are raised to the power. A negative exponent flips the fraction first: (a/b)⁻ⁿ = (b/a)ⁿ.",
      "商的乘方等于分子、分母分别乘方的商：(a/b)ⁿ = aⁿ/bⁿ。分子和分母都要乘方。负整数指数先把分数颠倒：(a/b)⁻ⁿ = (b/a)ⁿ。",
    ),
    ["the-power-of-product-rule-for-exponents"],
    ["8.EE.A.1"],
    [
      lesson(
        "powers-of-fractions",
        ["Powers of fractions", "分数的乘方"],
        [
          [
            "To raise a fraction to a power, raise both the numerator and the denominator: $\\left(\\frac{2}{3}\\right)^{4} = \\frac{2^{4}}{3^{4}} = \\frac{16}{81}$. A negative exponent flips the fraction first: $\\left(\\frac{2}{5}\\right)^{-2} = \\left(\\frac{5}{2}\\right)^{2} = \\frac{25}{4}$.",
            "分数的乘方，把分子和分母分别乘方：$\\left(\\frac{2}{3}\\right)^{4} = \\frac{2^{4}}{3^{4}} = \\frac{16}{81}$。负整数指数先把分数颠倒：$\\left(\\frac{2}{5}\\right)^{-2} = \\left(\\frac{5}{2}\\right)^{2} = \\frac{25}{4}$。",
          ],
          [
            "Count the factors: $3^{4} = 81$ below and $2^{4} = 16$ on top, four factors of each.",
            "数因数：分母 $3^{4} = 81$，分子 $2^{4} = 16$，各有四个因数。",
          ],
          [
            "Raise the denominator as well as the numerator: two thirds to the fourth is not sixteen thirds.",
            "分母和分子一样都要乘方：三分之二的四次方不是三分之十六。",
          ],
        ],
        (rng) => {
          const f0 = rng.pick([Q.of(1, 2), Q.of(2, 3), Q.of(3, 4), Q.of(1, 3), Q.of(2, 5), Q.of(3, 5), Q.of(4, 5), Q.of(5, 3), Q.of(3, 2)]);
          const f = rng.bool(0.3) ? f0.neg() : f0;
          const negative = rng.bool(0.45);
          const k = rng.int(2, f0.n > 3n || f0.d > 3n ? 3 : 4);
          const n = negative ? -k : k;
          const g = negative ? Q.one.div(f) : f;
          const result = g.pow(k);
          const [a, b] = [Number(g.n), Number(g.d)];
          const split = `\\frac{${raised(g.n, k)}}{${b}^{${k}}} = ${result.toLatex()}`;
          return valued(
            [`Evaluate $${power(f, n)}$.`, `计算 $${power(f, n)}$。`],
            result,
            negative
              ? [
                  [
                    ["Flip the fraction", "颠倒分数"],
                    ["A negative exponent flips the fraction and makes the exponent positive:", "负整数指数把分数颠倒，指数变为正数："],
                    [`${power(f, n)} = ${power(g, k)}`],
                  ],
                  [
                    ["Raise both parts", "分子分母都乘方"],
                    ["Raise the numerator and the denominator:", "把分子和分母分别乘方："],
                    [`${power(g, k)} = ${split}`],
                  ],
                ]
              : [
                  [
                    ["Split the power", "分开乘方"],
                    ["The power goes to the numerator and the denominator:", "乘方分别作用于分子和分母："],
                    [`${power(f, k)} = \\frac{${raised(g.n, k)}}{${b}^{${k}}}`],
                  ],
                  [
                    ["Work out each power", "算出每个乘方"],
                    ["Multiply out the top and the bottom:", "分别算出分子和分母："],
                    [`\\frac{${raised(g.n, k)}}{${b}^{${k}}} = ${result.toLatex()}`],
                  ],
                ],
            [
              `Count the factors: $${k}$ factors of $${b}$ make $${b ** k}$ below, and $${k}$ factors of $${signed(a)}$ make $${a ** k}$ on top.`,
              `数因数：分母是 $${k}$ 个 $${b}$，得 $${b ** k}$；分子是 $${k}$ 个 $${signed(a)}$，得 $${a ** k}$。`,
            ],
            [
              [
                Q.of(a ** k, b),
                "That raises only the numerator; the denominator gets the power too.",
                "这是只把分子乘方了；分母也要乘方。",
              ],
              [
                Q.of(a * k, b),
                "That multiplies the numerator by the exponent instead of raising it.",
                "这是用分子乘以指数了，而不是乘方。",
              ],
              ...(negative
                ? [
                    [
                      f.pow(k),
                      "That does not flip the fraction; a negative exponent means the reciprocal.",
                      "这是没有颠倒分数；负整数指数表示倒数。",
                    ] as const,
                  ]
                : []),
              ...(negative && f.sign() > 0
                ? [
                    [
                      result.neg(),
                      "That makes the value negative; a negative exponent flips the fraction, it does not change the sign.",
                      "这是把结果变成负数了；负整数指数是把分数颠倒，而不是改变符号。",
                    ] as const,
                  ]
                : []),
            ],
          );
        },
        factorTape(
          [
            ["2/3", 1],
            ["2/3", 1],
            ["2/3", 1],
            ["2/3", 1],
          ],
          "(2/3)⁴ = 16/81",
          [
            "Four equal factors 2/3 under (2/3)⁴ = 16/81: the tops multiply to 16 and the bottoms to 81.",
            "(2/3)⁴ = 16/81 下面是四个相同的因数 2/3：分子相乘得 16，分母相乘得 81。",
          ],
        ),
      ),
      lesson(
        "powers-of-algebraic-fractions",
        ["Powers of algebraic fractions", "字母分式的乘方"],
        [
          [
            "A fraction with variables is raised to a power the same way: each factor on top and each factor on the bottom gets the exponent, and a factor that is already a power has its exponents multiplied. $\\left(\\frac{x^{2}}{3y}\\right)^{3} = \\frac{(x^{2})^{3}}{3^{3}y^{3}} = \\frac{x^{6}}{27y^{3}}$.",
            "含字母的分式乘方方法相同：分子的每个因数和分母的每个因数都要乘方，本身已经是幂的因数则把指数相乘。$\\left(\\frac{x^{2}}{3y}\\right)^{3} = \\frac{(x^{2})^{3}}{3^{3}y^{3}} = \\frac{x^{6}}{27y^{3}}$。",
          ],
          [
            "Count the factors of $x$: three copies of $x^{2}$ hold $6$, so the top is $x^{6}$.",
            "数 $x$ 的个数：三个 $x^{2}$ 共有 $6$ 个，所以分子是 $x^{6}$。",
          ],
          [
            "The number in the denominator is raised too: $3$ becomes $27$, not $3$.",
            "分母中的数也要乘方：$3$ 变成 $27$，而不是仍为 $3$。",
          ],
        ],
        (rng) => {
          for (;;) {
            const [a, c] = [rng.pick([1, 2, 3]), rng.pick([2, 3, 5])];
            if (a === c) continue;
            const n = rng.int(2, a > 2 || c > 3 ? 2 : 3);
            const [m, p] = [rng.int(1, 5), rng.int(1, 4)];
            const top = mono(a, [["x", m]]);
            const bottom = mono(c, [["y", p]]);
            const expr = `\\left(\\frac{${top}}{${bottom}}\\right)^{${n}}`;
            const answer = `\\frac{${mono(a ** n, [["x", m * n]])}}{${mono(c ** n, [["y", p * n]])}}`;
            const each = `\\frac{${a === 1 ? "" : `${a}^{${n}}`}(${m === 1 ? "x" : `x^{${m}}`})^{${n}}}{${c}^{${n}}(${p === 1 ? "y" : `y^{${p}}`})^{${n}}}`;
            return expressed(
              [`Simplify $${expr}$.`, `化简 $${expr}$。`],
              answer,
              [
                [
                  ["Raise each factor", "每个因数乘方"],
                  ["Give every factor of the numerator and the denominator the exponent:", "分子和分母的每个因数都乘方："],
                  [`${expr} = ${each}`],
                ],
                [
                  ["Work out each power", "算出每个乘方"],
                  ["Raise the numbers and multiply the exponents:", "数要乘方，字母的指数相乘："],
                  [`${each} = ${answer}`],
                ],
              ],
              [
                `Count the factors of $x$: $${n}$ copies of $x^{${m}}$ hold $${m * n}$; of $y$: $${n}$ copies of $y^{${p}}$ hold $${p * n}$.`,
                `数字母：$${n}$ 个 $x^{${m}}$ 共有 $${m * n}$ 个 $x$；$${n}$ 个 $y^{${p}}$ 共有 $${p * n}$ 个 $y$。`,
              ],
              distinct(answer, [
                [
                  `\\frac{${mono(a ** n, [["x", m * n]])}}{${mono(c, [["y", p * n]])}}`,
                  "That leaves the number in the denominator unraised.",
                  "这是没有把分母中的数乘方。",
                ],
                [
                  `\\frac{${mono(a ** n, [["x", m * n]])}}{${bottom}}`,
                  "That raises only the numerator; the denominator gets the power too.",
                  "这是只把分子乘方了；分母也要乘方。",
                ],
                [
                  `\\frac{${mono(a ** n, [["x", m + n]])}}{${mono(c ** n, [["y", p + n]])}}`,
                  "That adds the exponents; a power of a power multiplies them.",
                  "这是把指数相加了；幂的乘方，指数相乘。",
                ],
              ]),
              { simplified: true },
            );
          }
        },
        factorTape(
          [
            ["x²/3y", 1],
            ["x²/3y", 1],
            ["x²/3y", 1],
          ],
          "(x²/3y)³ = x⁶/27y³",
          [
            "Three equal factors x²/3y under (x²/3y)³ = x⁶/27y³: the tops multiply to x⁶ and the bottoms to 27y³.",
            "(x²/3y)³ = x⁶/27y³ 下面是三个相同的因数 x²/3y：分子相乘得 x⁶，分母相乘得 27y³。",
          ],
        ),
      ),
    ],
  ),
  [
    "A photo is shrunk to two thirds of its width and two thirds of its height. What fraction of its area is left?",
    "一张照片的宽和高都缩小到原来的三分之二。面积剩下原来的几分之几？",
  ],
  [
    "Four ninths: $\\left(\\frac{2}{3}\\right)^{2} = \\frac{2^{2}}{3^{2}} = \\frac{4}{9}$, since both the top and the bottom are squared.",
    "九分之四：$\\left(\\frac{2}{3}\\right)^{2} = \\frac{2^{2}}{3^{2}} = \\frac{4}{9}$，因为分子和分母都要平方。",
  ],
  [
    "raise fractions and algebraic fractions to powers, flipping them for negative exponents.",
    "计算分数和字母分式的乘方，遇到负整数指数时先把分数颠倒。",
  ],
);

/** combiningTheRulesOfExponents uses several rules of exponents in one simplification. */
export const combiningTheRulesOfExponents = withIntro(
  topic(
    "combining-the-rules-of-exponents",
    t("Combining the Rules of Exponents", "综合运用幂的运算法则"),
    t(
      "To simplify an expression with several powers, apply the power rules to anything in parentheses first, then combine powers of the same base by adding exponents for products and subtracting them for quotients. Write the final answer with positive exponents.",
      "化简含有多个幂的式子时，先对括号里的部分用乘方法则，再把同底数的幂合并：相乘时指数相加，相除时指数相减。最后的结果用正整数指数表示。",
    ),
    ["the-quotient-rule-for-exponents", "the-power-of-quotient-rule-for-exponents"],
    ["8.EE.A.1"],
    [
      lesson(
        "combining-rules-with-numbers",
        ["Combining rules with numbers", "数的幂的综合运算"],
        [
          [
            "In $\\frac{2^{5} \\cdot 2^{-2}}{(2^{2})^{3}}$, the numerator is $2^{5 + (-2)} = 2^{3}$ and the denominator is $2^{2 \\cdot 3} = 2^{6}$, so the quotient is $2^{3 - 6} = 2^{-3}$. Work out the exponent step by step before evaluating anything.",
            "在 $\\frac{2^{5} \\cdot 2^{-2}}{(2^{2})^{3}}$ 中，分子是 $2^{5 + (-2)} = 2^{3}$，分母是 $2^{2 \\cdot 3} = 2^{6}$，所以商是 $2^{3 - 6} = 2^{-3}$。先一步步算出指数，再考虑求值。",
          ],
          ["Track the exponents in one line: $5 + (-2) - 2 \\cdot 3 = -3$.", "把指数写在一行里验算：$5 + (-2) - 2 \\cdot 3 = -3$。"],
          [
            "A power of a power multiplies the exponents: $(2^{2})^{3}$ is $2^{6}$, not $2^{5}$.",
            "幂的乘方要把指数相乘：$(2^{2})^{3}$ 是 $2^{6}$，不是 $2^{5}$。",
          ],
        ],
        (rng) => {
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
          const line = powerOnTop
            ? `${m} + ${signed(p)} \\cdot ${q} - ${signed(n)} = ${k}`
            : `${m} + ${signed(n)} - ${signed(p)} \\cdot ${q} = ${k}`;
          return valued(
            [
              `Write $${expr}$ as a single power of $${b}$, in the form $${b}^{n}$. What is $n$?`,
              `把 $${expr}$ 写成以 $${b}$ 为底的一个幂 $${b}^{n}$。$n$ 是多少？`,
            ],
            k,
            [
              [
                ["Simplify the top and the bottom", "化简分子和分母"],
                ["A product adds exponents and a power of a power multiplies them:", "相乘时指数相加，幂的乘方指数相乘："],
                [`${expr} = \\frac{${b}^{${top}}}{${b}^{${bottom}}}`],
              ],
              [
                ["Divide", "相除"],
                ["Subtract the exponent of the denominator:", "减去分母的指数："],
                [`${top} - ${signed(bottom)} = ${k}`],
              ],
            ],
            [`Track every exponent in one line: $${line}$.`, `把所有指数写在一行里验算：$${line}$。`],
            [
              [
                powerOnTop ? m + p + q - n : m + n - (p + q),
                "That adds the exponents of the power of a power; they multiply.",
                "这是把幂的乘方中的指数相加了；应该相乘。",
              ],
              [
                bottom - top,
                "That subtracts the wrong way round; take the bottom's exponent from the top's.",
                "这是减反了；应该用分子的指数减分母的指数。",
              ],
            ],
            { solveFor: "n" },
          );
        },
        tapeFigure(
          [
            { total: "2⁵ · 2⁻² = 2³", pieces: Array.from({ length: 3 }, () => ({ size: 1, text: "2" })) },
            { total: "(2²)³ = 2⁶", pieces: Array.from({ length: 6 }, (_, i) => ({ size: 1, text: "2", lit: i < 3 })) },
          ],
          [
            "Two bars: the numerator 2³ with 3 factors of 2, and the denominator 2⁶ with 6; 3 of the 6 cancel, and the other 3 shaded ones stay below the bar, giving 2⁻³.",
            "两个长条：分子 2³ 有 3 个因数 2，分母 2⁶ 有 6 个；约去 3 个后，另外 3 个留在分数线下方，结果是 2⁻³。",
          ],
        ),
      ),
      lesson(
        "combining-rules-with-monomials",
        ["Combining rules with monomials", "单项式的综合运算"],
        [
          [
            "$\\frac{(2x^{3})^{2} \\cdot x^{-4}}{8x} = \\frac{4x^{6} \\cdot x^{-4}}{8x} = \\frac{4x^{2}}{8x} = \\frac{x}{2}$. Expand the power first, combine the numerator, then divide the coefficients and subtract the exponents.",
            "$\\frac{(2x^{3})^{2} \\cdot x^{-4}}{8x} = \\frac{4x^{6} \\cdot x^{-4}}{8x} = \\frac{4x^{2}}{8x} = \\frac{x}{2}$。先展开乘方，再合并分子，最后系数相除、指数相减。",
          ],
          [
            "Track the exponents of $x$ in one line: $3 \\cdot 2 + (-4) - 1 = 1$, and the numbers: $2^{2} \\div 8$ is one half.",
            "把 $x$ 的指数写在一行里验算：$3 \\cdot 2 + (-4) - 1 = 1$；数：$2^{2} \\div 8$ 是二分之一。",
          ],
          [
            "Square the coefficient inside the parentheses: $(2x^{3})^{2}$ starts with $4$, not $2$.",
            "括号里的系数要平方：$(2x^{3})^{2}$ 的系数是 $4$，不是 $2$。",
          ],
        ],
        (rng) => {
          for (;;) {
            const c = rng.pick([2, 3]);
            const n = rng.pick([2, 3]);
            const m = rng.int(1, 4);
            const p = exps(rng, 0.6);
            const d = rng.pick([1, 2, 3, 4, 6, 8, 9, 12]);
            const e = rng.int(1, 6);
            const k = m * n + p - e;
            const coef = Q.of(c ** n, d);
            if (k === 0 && coef.eq(Q.one)) continue;
            const px = p === 1 ? "x" : `x^{${p}}`;
            const expr = `\\frac{(${mono(c, [["x", m]])})^{${n}} \\cdot ${px}}{${mono(d, [["x", e]])}}`;
            const answer = positive(coef, [["x", k]]);
            const expanded = `\\frac{${mono(c ** n, [["x", m * n]])} \\cdot ${px}}{${mono(d, [["x", e]])}}`;
            const combined = `\\frac{${mono(c ** n, [["x", m * n + p]])}}{${mono(d, [["x", e]])}}`;
            return expressed(
              [`Simplify $${expr}$. Use only positive exponents.`, `化简 $${expr}$，结果只用正整数指数。`],
              answer,
              [
                [
                  ["Expand the power", "展开乘方"],
                  ["Raise every factor in the parentheses:", "括号里的每个因数都乘方："],
                  [`${expr} = ${expanded}`],
                ],
                [["Combine the top", "合并分子"], ["Multiplying adds the exponents:", "相乘时指数相加："], [`${expanded} = ${combined}`]],
                [["Divide", "相除"], ["Divide the numbers and subtract the exponents:", "数相除，指数相减："], [`${combined} = ${answer}`]],
              ],
              [
                `Track the exponents of $x$ in one line: $${m} \\cdot ${n} + ${signed(p)} - ${e} = ${k}$.`,
                `把 $x$ 的指数写在一行里验算：$${m} \\cdot ${n} + ${signed(p)} - ${e} = ${k}$。`,
              ],
              distinct(answer, [
                [
                  positive(Q.of(c, d), [["x", k]]),
                  "That leaves the coefficient unraised; it is raised to the power too.",
                  "这是没有把系数乘方；系数也要乘方。",
                ],
                [
                  positive(coef, [["x", m + n + p - e]]),
                  "That adds the exponents of the power of a power; they multiply.",
                  "这是把幂的乘方中的指数相加了；应该相乘。",
                ],
                [
                  positive(coef, [["x", m * n + p + e]]),
                  "That adds the exponent of the denominator; dividing subtracts it.",
                  "这是把分母的指数加上了；相除时指数相减。",
                ],
              ]),
              { simplified: true },
            );
          }
        },
        tapeFigure(
          [
            {
              total: "(2x³)² = 4x⁶",
              pieces: [
                { size: 3, text: "2x³" },
                { size: 3, text: "2x³", lit: true },
              ],
            },
          ],
          [
            "A bar for (2x³)² = 4x⁶ made of two equal parts 2x³, one of them shaded.",
            "表示 (2x³)² = 4x⁶ 的长条，由两个相同的部分 2x³ 组成，其中一个涂色。",
          ],
        ),
      ),
    ],
  ),
  [
    "A cube has edges of $x^{2}$ meters. How many cubes with edges of $x$ meters fit inside it?",
    "一个立方体的棱长是 $x^{2}$ 米。它里面能放多少个棱长为 $x$ 米的立方体？",
  ],
  [
    "Its volume is $(x^{2})^{3} = x^{6}$, and each small cube is $x^{3}$, so $x^{6} \\div x^{3} = x^{3}$ cubes fit: one rule after another.",
    "它的体积是 $(x^{2})^{3} = x^{6}$，每个小立方体是 $x^{3}$，所以能放 $x^{6} \\div x^{3} = x^{3}$ 个：一条法则接着一条法则。",
  ],
  [
    "simplify expressions that need several rules of exponents at once, with numbers and with monomials.",
    "化简需要同时用到几条幂的运算法则的式子，包括数的幂和单项式。",
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

/** aLongSumOfPowers adds consecutive powers of -1; it is the third point of powers-of-negative-one, to take the place of the one in the deeper files. */
export const aLongSumOfPowers = lesson(
  "a-long-sum-of-powers",
  ["A long sum of powers", "一长串幂的和"],
  [
    [
      "Consecutive powers of $-1$ alternate, so each odd power and the next even power cancel: $(-1)^{1} + (-1)^{2} = -1 + 1 = 0$. A sum with an even number of terms is $0$, and with an odd number of terms one $-1$ is left over.",
      "$-1$ 的连续幂交替出现，所以每个奇次幂和下一个偶次幂相互抵消：$(-1)^{1} + (-1)^{2} = -1 + 1 = 0$。偶数项之和是 $0$；奇数项时还剩下一个 $-1$。",
    ],
    [
      "Try a short sum: $(-1)^{1} + (-1)^{2} + (-1)^{3} = -1 + 1 - 1 = -1$, three terms with one left over.",
      "试一个短的：$(-1)^{1} + (-1)^{2} + (-1)^{3} = -1 + 1 - 1 = -1$，三项，剩下一个。",
    ],
    [
      "Do not count the terms as the answer: the sum of $100$ such powers is $0$, not $100$.",
      "不要把项数当成答案：$100$ 个这样的幂之和是 $0$，不是 $100$。",
    ],
  ],
  (rng) => {
    const n = rng.int(5, 120);
    const even = n % 2 === 0;
    const answer = even ? 0 : -1;
    const pairs = Math.floor(n / 2);
    return valued(
      [
        `Evaluate $(-1)^{1} + (-1)^{2} + (-1)^{3} + \\cdots + (-1)^{${n}}$.`,
        `计算 $(-1)^{1} + (-1)^{2} + (-1)^{3} + \\cdots + (-1)^{${n}}$。`,
      ],
      answer,
      [
        [
          ["Pair the terms", "两两配对"],
          ["Each odd power and the next even power cancel:", "每个奇次幂和下一个偶次幂相互抵消："],
          ["(-1)^{1} + (-1)^{2} = -1 + 1 = 0"],
        ],
        [
          ["Count what is left", "看剩下什么"],
          even
            ? [
                `$${n}$ terms make $${pairs}$ pairs with nothing left over, so the sum is $0$.`,
                `$${n}$ 项正好配成 $${pairs}$ 对，没有剩余，所以和是 $0$。`,
              ]
            : [
                `$${n}$ terms make $${pairs}$ pairs, and the last term, $(-1)^{${n}} = -1$, is left over.`,
                `$${n}$ 项配成 $${pairs}$ 对，最后一项 $(-1)^{${n}} = -1$ 剩了下来。`,
              ],
        ],
      ],
      even
        ? ["Try a short sum with an even number of terms: $-1 + 1 - 1 + 1 = 0$.", "试一个偶数项的短式子：$-1 + 1 - 1 + 1 = 0$。"]
        : ["Try a short sum with an odd number of terms: $-1 + 1 - 1 = -1$.", "试一个奇数项的短式子：$-1 + 1 - 1 = -1$。"],
      [
        [n, "That counts the terms instead of adding them.", "这是数了项数，而不是把它们相加。"],
        [-n, "That treats every term as −1; the even powers are 1.", "这是把每一项都当成了 −1；偶次幂是 1。"],
        even
          ? [-1, "That leaves a −1 over, but an even number of terms pairs up completely.", "这是多剩了一个 −1；偶数项正好全部配对。"]
          : [
              0,
              "That pairs up every term, but with an odd number of terms the last −1 is left over.",
              "这是把每一项都配对了；奇数项时最后一个 −1 会剩下。",
            ],
      ],
    );
  },
  factorTape(
    [
      ["−1", 1],
      ["1", 1],
      ["−1", 1],
      ["1", 1],
      ["−1", 1],
    ],
    "−1 + 1 − 1 + 1 − 1 = −1",
    [
      "Five terms in a row, −1 and 1 taking turns: two pairs cancel, and one −1 is left at the end.",
      "一排五项，−1 和 1 交替出现：两对相互抵消，最后剩下一个 −1。",
    ],
  ),
);

/** theNegativeExponentThatFits finds the negative exponent that writes a fraction as a power; it is the third point of evaluating-expressions-with-integer-exponents, to take the place of the one in the deeper files. */
export const theNegativeExponentThatFits = lesson(
  "the-negative-exponent-that-fits",
  ["The negative exponent that fits", "符合的负指数"],
  [
    [
      "A fraction with a power in the denominator can be written with a negative exponent: $\\frac{5}{8} = 5 \\cdot \\frac{1}{2^{3}} = 5 \\cdot 2^{-3}$. To find a missing exponent, write the denominator as a power of the base, then change the sign.",
      "分母是幂的分数可以写成负指数的形式：$\\frac{5}{8} = 5 \\cdot \\frac{1}{2^{3}} = 5 \\cdot 2^{-3}$。求缺失的指数时，先把分母写成底数的幂，再改变符号。",
    ],
    [
      "Substitute back: $2^{-3}$ is one eighth, and $5$ of those are five eighths.",
      "代回去：$2^{-3}$ 是八分之一，$5$ 个八分之一就是八分之五。",
    ],
    [
      "The denominator is not the exponent: $8 = 2^{3}$, so the exponent is $-3$, not $-8$.",
      "分母不是指数：$8 = 2^{3}$，所以指数是 $-3$，不是 $-8$。",
    ],
  ],
  (rng) => {
    const b = rng.pick([2, 3, 4, 5, 10]);
    const n = rng.int(1, 4);
    const k = rng.int(1, 9);
    const lhs = k === 1 ? "" : `${k} \\cdot `;
    const box = `${lhs}${b}^{\\square} = \\frac{${k}}{${b ** n}}`;
    return valued(
      [`What number goes in the box? $$${box}$$`, `方框里是什么数？$$${box}$$`],
      -n,
      [
        [
          ["Write the denominator as a power", "把分母写成幂"],
          [`$${b ** n}$ is $${n}$ factor${n === 1 ? "" : "s"} of $${b}$:`, `$${b ** n}$ 是 $${n}$ 个 $${b}$ 相乘：`],
          [`${b ** n} = ${b}^{${n}}`],
        ],
        [
          ["Change the sign", "改变符号"],
          ["One over a power is the power with the opposite exponent:", "一个幂的倒数就是指数取相反数的幂："],
          [`\\frac{${k}}{${b}^{${n}}} = ${lhs}${b}^{-${n}}`],
        ],
      ],
      [
        `Substitute back: $${b}^{-${n}}$ is one over $${b ** n}$, and $${k}$ of those give the fraction.`,
        `代回去：$${b}^{-${n}}$ 是 $${b ** n}$ 分之一，$${k}$ 个这样的数就是这个分数。`,
      ],
      [
        [n, "That forgets the minus sign; a power in the denominator has a negative exponent.", "这是漏掉了负号；分母中的幂指数为负。"],
        [
          -(b ** n),
          "That uses the denominator itself as the exponent; write it as a power of the base first.",
          "这是把分母本身当成了指数；应先把它写成底数的幂。",
        ],
      ],
    );
  },
  fractionSteps(2, 3, [
    "A number line from 0 to 1 marking 1, 2⁻¹ = 1/2, 2⁻² = 1/4 and 2⁻³ = 1/8: each negative power of 2 halves the one before.",
    "从 0 到 1 的数轴，标出 1、2⁻¹ = 1/2、2⁻² = 1/4 和 2⁻³ = 1/8：2 的每个负整数指数幂都是前一个的一半。",
  ]),
);

/** theMissingExponentInAQuotient finds a missing exponent in a quotient of powers; it is the third point of the-quotient-rule-for-exponents, to take the place of the one in the deeper files. */
export const theMissingExponentInAQuotient = lesson(
  "the-missing-exponent-in-a-quotient",
  ["The missing exponent in a quotient", "商中缺失的指数"],
  [
    [
      "A quotient of powers subtracts the exponents, so a missing exponent in the denominator is the top exponent minus the result: in $\\frac{x^{9}}{x^{\\square}} = x^{2}$, $9 - \\square = 2$, so the box is $7$. A negative result only means the denominator had the larger power.",
      "幂的商是指数相减，所以分母中缺失的指数等于分子的指数减去结果：在 $\\frac{x^{9}}{x^{\\square}} = x^{2}$ 中，$9 - \\square = 2$，所以方框里是 $7$。结果为负，只说明分母的幂更大。",
    ],
    ["Substitute: $9 - 7 = 2$, the exponent of the result.", "代入：$9 - 7 = 2$，正是结果的指数。"],
    [
      "The box is what is taken away, not added: in that quotient the box is $7$, not $11$.",
      "方框里是被减去的数，不是加上的数：在这个商中方框里是 $7$，不是 $11$。",
    ],
  ],
  (rng) => {
    const a = rng.int(2, 15);
    const c = rng.int(-9, 12);
    const v = rng.pick(["x", "y", "a", "t"]);
    const box = `\\frac{${v}^{${a}}}{${v}^{\\square}} = ${v}^{${c}}`;
    return valued(
      [`What number goes in the box? $$${box}$$`, `方框里是什么数？$$${box}$$`],
      a - c,
      [
        [
          ["Write the rule", "写出法则"],
          ["Dividing powers subtracts the exponents:", "同底数幂相除，指数相减："],
          [`${a} - \\square = ${c}`],
        ],
        [
          ["Solve", "求解"],
          ["Take the result away from the top exponent:", "用分子的指数减去结果："],
          [`\\square = ${a} - ${signed(c)} = ${a - c}`],
        ],
      ],
      [
        `Substitute: $${a} - ${signed(a - c)} = ${c}$, the exponent of the result.`,
        `代入：$${a} - ${signed(a - c)} = ${c}$，正是结果的指数。`,
      ],
      [
        [
          a + c,
          "That adds the result to the top exponent; the box is what is taken away.",
          "这是把结果加到分子的指数上了；方框里是被减去的数。",
        ],
        [c - a, "That subtracts the wrong way round.", "这是减反了。"],
        [a, "That copies the top exponent; the result has to be taken away from it.", "这是照抄了分子的指数；还要减去结果。"],
      ],
    );
  },
  factorTape(
    [
      ["x", 2],
      ["x", 7],
    ],
    "x⁹",
    [
      "Nine factors of x under x⁹: the shaded 7 cancel with the denominator, leaving x².",
      "x⁹ 下面是 9 个因数 x：涂色的 7 个与分母约去，剩下 x²。",
    ],
  ),
);

/** theExponentInsideTheParentheses finds a missing exponent inside a power of a product; it is the third point of the-power-of-product-rule-for-exponents, to take the place of the one in the deeper files. */
export const theExponentInsideTheParentheses = lesson(
  "the-exponent-inside-the-parentheses",
  ["The exponent inside the parentheses", "括号内的指数"],
  [
    [
      "Raising a product to a power applies the power to every factor, so an exponent inside is multiplied by the outer power. To find a missing exponent inside, divide the outer result by the outer power: in $(2x^{\\square})^{3} = 8x^{12}$, $\\square \\cdot 3 = 12$, so the box is $4$.",
      "积的乘方要把每个因数都乘方，所以括号内的指数要乘以外面的指数。求括号内缺失的指数，就用结果的指数除以外面的指数：在 $(2x^{\\square})^{3} = 8x^{12}$ 中，$\\square \\cdot 3 = 12$，所以方框里是 $4$。",
    ],
    ["Substitute: $(2x^{4})^{3} = 2^{3}x^{4 \\cdot 3} = 8x^{12}$.", "代入：$(2x^{4})^{3} = 2^{3}x^{4 \\cdot 3} = 8x^{12}$。"],
    [
      "The exponents multiply, so divide; do not subtract: the box is $4$, not $12 - 3 = 9$.",
      "指数是相乘的，所以要相除，不能相减：方框里是 $4$，不是 $12 - 3 = 9$。",
    ],
  ],
  (rng) => {
    const k = rng.int(2, 5);
    const a = rng.int(2, 8);
    const n = rng.int(2, 4);
    const box = `(${k}x^{\\square})^{${n}} = ${k ** n}x^{${a * n}}`;
    return valued(
      [`What number goes in the box? $$${box}$$`, `方框里是什么数？$$${box}$$`],
      a,
      [
        [
          ["Write the rule", "写出法则"],
          [`The power $${n}$ multiplies the exponent inside:`, `外面的 $${n}$ 次方使括号内的指数乘以 $${n}$：`],
          [`\\square \\cdot ${n} = ${a * n}`],
        ],
        [["Divide", "相除"], [`Divide by $${n}$:`, `除以 $${n}$：`], [`\\square = ${a * n} \\div ${n} = ${a}`]],
      ],
      [
        `Substitute: $(${k}x^{${a}})^{${n}} = ${k}^{${n}}x^{${a} \\cdot ${n}} = ${k ** n}x^{${a * n}}$.`,
        `代入：$(${k}x^{${a}})^{${n}} = ${k}^{${n}}x^{${a} \\cdot ${n}} = ${k ** n}x^{${a * n}}$。`,
      ],
      [
        [
          a * n - n,
          "That subtracts the outer power; a power of a power multiplies, so divide.",
          "这是减去了外面的指数；幂的乘方是指数相乘，所以要相除。",
        ],
        [a * n, "That copies the exponent of the result; divide it by the outer power.", "这是照抄了结果的指数；还要除以外面的指数。"],
        [a + n, "That adds the outer power; the exponents multiply.", "这是加上了外面的指数；指数应该相乘。"],
      ],
    );
  },
  factorTape(
    [
      ["2x⁴", 1],
      ["2x⁴", 1],
      ["2x⁴", 1],
    ],
    "8x¹²",
    [
      "Three equal factors 2x⁴ under 8x¹²: the numbers multiply to 8 and three groups of 4 factors of x make 12.",
      "8x¹² 下面是三个相同的因数 2x⁴：数相乘得 8，三组各 4 个 x 共 12 个。",
    ],
  ),
);

/** aNegativePowerTurnsTheFractionOver evaluates a fraction to a negative power; it is the third point of the-power-of-quotient-rule-for-exponents, to take the place of the one in the deeper files. */
export const aNegativePowerTurnsTheFractionOver = lesson(
  "a-negative-power-turns-the-fraction-over",
  ["A negative power turns the fraction over", "负指数把分数颠倒"],
  [
    [
      "A negative exponent means the reciprocal, so a fraction to a negative power is the turned-over fraction to the positive power: $\\left(\\frac{2}{3}\\right)^{-2} = \\left(\\frac{3}{2}\\right)^{2} = \\frac{9}{4}$.",
      "负指数表示倒数，所以分数的负次幂等于颠倒后的分数的正次幂：$\\left(\\frac{2}{3}\\right)^{-2} = \\left(\\frac{3}{2}\\right)^{2} = \\frac{9}{4}$。",
    ],
    [
      "Multiply back: two thirds squared is four ninths, and four ninths times nine quarters is $1$.",
      "乘回去：三分之二的平方是九分之四，九分之四乘四分之九等于 $1$。",
    ],
    [
      "The result is not negative because of the exponent's sign: it is nine quarters, not negative nine quarters.",
      "结果并不因指数为负而成为负数：它是四分之九，不是负四分之九。",
    ],
  ],
  (rng) => {
    const [a, b] = rng.pick<[number, number]>([
      [2, 3],
      [3, 4],
      [2, 5],
      [3, 5],
      [4, 5],
      [1, 2],
      [1, 3],
      [5, 6],
      [3, 7],
      [2, 7],
      [5, 7],
      [1, 4],
      [3, 8],
      [5, 8],
      [4, 7],
    ]);
    const n = rng.int(1, 3) === 3 ? 3 : 2;
    const f = `\\left(\\frac{${a}}{${b}}\\right)`;
    const g = `\\left(\\frac{${b}}{${a}}\\right)`;
    return valued(
      [`Evaluate $${f}^{-${n}}$.`, `计算 $${f}^{-${n}}$。`],
      Q.of(b ** n, a ** n),
      [
        [
          ["Turn the fraction over", "颠倒分数"],
          ["A negative exponent means the reciprocal:", "负指数表示倒数："],
          [`${f}^{-${n}} = ${g}^{${n}}`],
        ],
        [
          ["Raise both parts", "分子分母都乘方"],
          ["Raise the numerator and the denominator:", "把分子和分母分别乘方："],
          [`${g}^{${n}} = \\frac{${b}^{${n}}}{${a}^{${n}}} = ${Q.of(b ** n, a ** n).toLatex()}`],
        ],
      ],
      [
        `Count the factors: $${n}$ factors of $${b}$ make $${b ** n}$ on top, and $${n}$ factors of $${a}$ make $${a ** n}$ below.`,
        `数因数：分子是 $${n}$ 个 $${b}$，得 $${b ** n}$；分母是 $${n}$ 个 $${a}$，得 $${a ** n}$。`,
      ],
      [
        [
          Q.of(a ** n, b ** n),
          "That does not turn the fraction over; a negative exponent means the reciprocal.",
          "这是没有颠倒分数；负指数表示倒数。",
        ],
        [
          Q.of(-(b ** n), a ** n),
          "That makes the value negative; the exponent's sign turns the fraction over, not the sign.",
          "这是把结果变成负数了；指数的负号是把分数颠倒，不是改变符号。",
        ],
        [Q.of(b * n, a * n), "That multiplies by the exponent instead of raising to the power.", "这是乘以指数了，而不是乘方。"],
      ],
    );
  },
  factorTape(
    [
      ["3/2", 1],
      ["3/2", 1],
    ],
    "(2/3)⁻² = (3/2)² = 9/4",
    [
      "Two equal factors 3/2 under (2/3)⁻² = (3/2)² = 9/4: the turned-over fraction, squared.",
      "(2/3)⁻² = (3/2)² = 9/4 下面是两个相同的因数 3/2：颠倒后的分数再平方。",
    ],
  ),
);

/** thePowerThatDoesNotMatch picks the one form that is not a given power; it is the third point of combining-the-rules-of-exponents, to take the place of the one in the deeper files. */
export const thePowerThatDoesNotMatch = lesson(
  "the-power-that-does-not-match",
  ["The power that does not match", "不相等的幂"],
  [
    [
      "Multiplying powers adds the exponents and raising a power to a power multiplies them. Mixing up the two rules is the usual slip, so work out each form before comparing: $x^{2} \\cdot x^{3} = x^{5}$, but $(x^{2})^{3} = x^{6}$.",
      "幂相乘是指数相加，幂的乘方是指数相乘。把这两条法则混淆是常见错误，所以比较之前先把每个式子算出来：$x^{2} \\cdot x^{3} = x^{5}$，而 $(x^{2})^{3} = x^{6}$。",
    ],
    [
      "Write it out: $(x^{2})^{3} = x^{2} \\cdot x^{2} \\cdot x^{2}$, which has $2 + 2 + 2 = 6$ factors of $x$.",
      "展开写：$(x^{2})^{3} = x^{2} \\cdot x^{2} \\cdot x^{2}$，共有 $2 + 2 + 2 = 6$ 个 $x$。",
    ],
    [
      "Forms that look alike can differ: $x^{2} \\cdot x^{3}$ is $x^{5}$, not $x^{6}$.",
      "看起来相似的式子可能不相等：$x^{2} \\cdot x^{3}$ 是 $x^{5}$，不是 $x^{6}$。",
    ],
  ],
  (rng) => {
    const [p, q] = rng.pick<[number, number]>([
      [2, 3],
      [2, 4],
      [2, 5],
      [3, 4],
      [2, 6],
      [3, 5],
      [2, 7],
      [3, 6],
      [4, 5],
      [3, 7],
    ]);
    const n = p * q;
    const k = rng.int(2, 9);
    const r = rng.int(2, n - 2);
    const v = rng.pick(["x", "y", "a", "m"]);
    const m = (s: string): Pair => [`$${s}$`, `$${s}$`];
    const odd = `${v}^{${p}} \\cdot ${v}^{${q}}`;
    const power = `(${v}^{${p}})^{${q}}`;
    const product = `${v}^{${r}} \\cdot ${v}^{${n - r}}`;
    const quotient = `\\frac{${v}^{${n + k}}}{${v}^{${k}}}`;
    return chosen(
      rng,
      [`Which of these is not equal to $${v}^{${n}}$?`, `哪个不等于 $${v}^{${n}}$？`],
      m(odd),
      [
        [
          m(power),
          `A power of a power multiplies: ${p} × ${q} = ${n}, so it equals ${v}^${n}.`,
          `幂的乘方指数相乘：${p} × ${q} = ${n}，所以它等于 ${v}^${n}。`,
        ],
        [
          m(product),
          `A product adds: ${r} + ${n - r} = ${n}, so it equals ${v}^${n}.`,
          `相乘时指数相加：${r} + ${n - r} = ${n}，所以它等于 ${v}^${n}。`,
        ],
        [
          m(quotient),
          `A quotient subtracts: ${n + k} − ${k} = ${n}, so it equals ${v}^${n}.`,
          `相除时指数相减：${n + k} − ${k} = ${n}，所以它等于 ${v}^${n}。`,
        ],
      ],
      [
        [
          ["Work out each one", "逐个计算"],
          ["Apply the rule each form uses:", "按每个式子用到的法则计算："],
          [`${power} = ${v}^{${n}}`, `${product} = ${v}^{${n}}`, `${quotient} = ${v}^{${n}}`, `${odd} = ${v}^{${p + q}}`],
        ],
        [
          ["Find the odd one out", "找出不相等的"],
          [`Only $${odd}$ is not $${v}^{${n}}$: it is $${v}^{${p + q}}$.`, `只有 $${odd}$ 不等于 $${v}^{${n}}$：它是 $${v}^{${p + q}}$。`],
        ],
      ],
      [
        `Multiplying adds the exponents: $${p} + ${q} = ${p + q}$, which is not $${n}$.`,
        `相乘时指数相加：$${p} + ${q} = ${p + q}$，不是 $${n}$。`,
      ],
    );
  },
  tapeFigure(
    [
      {
        total: "x² · x³ = x⁵",
        pieces: [
          { size: 2, text: "x²" },
          { size: 3, text: "x³", lit: true },
        ],
      },
      {
        total: "(x²)³ = x⁶",
        pieces: [
          { size: 2, text: "x²" },
          { size: 2, text: "x²", lit: true },
          { size: 2, text: "x²" },
        ],
      },
    ],
    [
      "Two bars on one scale: x² · x³ is 2 + 3 = 5 factors of x, while (x²)³ is three groups of 2, which is 6 factors.",
      "同一比例的两个长条：x² · x³ 是 2 + 3 = 5 个因数 x，而 (x²)³ 是三组 2 个，共 6 个因数。",
    ],
  ),
);
