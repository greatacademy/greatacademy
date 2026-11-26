import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly } from "@ga/subject-math";

import { numberProblem, why, yesNo } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";
import { oneOf } from "./calculus-common.ts";
import { walked } from "./calculus-i-differentiation.ts";
import { isPrimeNumber, range } from "./methods-of-proof-common.ts";

// Methods of Proof unit 4: divisibility, the Euclidean algorithm and proof by induction.

/** gcd is the greatest common divisor of two integers. */
export const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/** lcm is the least common multiple of two positive integers. */
export const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;

/** floorDiv is the quotient of the division algorithm: the q with a = bq + r and 0 ≤ r < b. */
export const floorDiv = (a: number, b: number) => Math.floor(a / b);

/** mod is the remainder of the division algorithm, always in 0..b−1. */
export const mod = (a: number, b: number) => ((a % b) + b) % b;

/** bezout finds integers x, y with ax + by = gcd(a, b), by the extended Euclidean algorithm. */
export function bezout(a: number, b: number): [number, number] {
  if (b === 0) return [Math.sign(a) || 1, 0];
  const [x, y] = bezout(b, mod(a, b));
  return [y, x - floorDiv(a, b) * y];
}

/** factorize lists the prime factorization of n > 1 as [prime, exponent] pairs. */
export function factorize(n: number): [number, number][] {
  const out: [number, number][] = [];
  let m = n;
  for (let p = 2; p * p <= m; p++) {
    let e = 0;
    while (m % p === 0) {
      m /= p;
      e++;
    }
    if (e > 0) out.push([p, e]);
  }
  if (m > 1) out.push([m, 1]);
  return out;
}

/** signed writes "+ 3" or "- 3" after a term, or nothing for 0. */
const signed = (c: number) => (c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`);

/** p puts a negative number in parentheses. */
const p = (n: number): string => (n < 0 ? `(${n})` : `${n}`);

/** firstOf keeps the first mistake for each wrong value. */
const firstOf = <T extends { readonly value: unknown }>(ms: readonly T[]): T[] =>
  ms.filter((m, i) => ms.findIndex((x) => String(x.value) === String(m.value)) === i);

/** math wraps LaTeX as an option. */
const math = (s: string) => t(`$${s}$`, `$${s}$`);

/** parity classifies integers and expressions as even or odd. */
export const parity: TopicDef = {
  id: "parity",
  title: t("Parity", "奇偶性"),
  summary: t(
    "Every integer is either even or odd; parity of sums and products follows simple rules.",
    "每个整数要么是偶数，要么是奇数；和与积的奇偶性遵循简单的规则。",
  ),
  intro: t(
    "Is $37 \\cdot 59 + 84$ even or odd? Replace each number by its parity: odd times odd is odd, and odd plus even is odd. So the result is odd, found without multiplying.\n\nCheck: $37 \\cdot 59 = 2183$ and $2183 + 84 = 2267$, which ends in $7$ and is odd.\n\nIn this lesson we decide the parity of sums, products and powers from the parities of their parts, and count the odd and even integers in a range.",
    "$37 \\cdot 59 + 84$ 是偶数还是奇数？把每个数换成它的奇偶性：奇乘奇得奇，奇加偶得奇。所以结果是奇数，无需做乘法。\n\n检验：$37 \\cdot 59 = 2183$，$2183 + 84 = 2267$，个位是 $7$，是奇数。\n\n本课我们由各部分的奇偶性判断和、积与幂的奇偶性，并数出一个范围内奇数和偶数的个数。",
  ),
  prerequisites: ["even-and-odd-numbers"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "parity-of-arithmetic-expressions",
      title: t("Parity of expressions", "表达式的奇偶性"),
      explanation: t(
        "Track only parity: even + odd is odd, odd · odd is odd, and a product is even if any factor is even. So $37 \\cdot 59 + 84$ is odd + even, which is odd, without computing it.\n\n> **Watch out.** A power has the parity of its base, whatever the exponent: $3^4 = 81$ is odd although $4$ is even.",
        "只需跟踪奇偶性：偶 + 奇 = 奇，奇 · 奇 = 奇，乘积中只要有一个因数是偶数，乘积就是偶数。所以无需计算，$37 \\cdot 59 + 84$ 是奇 + 偶，为奇数。\n\n> **注意。** 幂与底数同奇偶，与指数无关：$3^4 = 81$ 是奇数，尽管 $4$ 是偶数。",
      ),
      generate(rng) {
        const a = rng.int(11, 99);
        const b = rng.int(11, 99);
        const c = rng.int(11, 99);
        const e = rng.int(2, 9);
        const P = (n: number): [string, string] => (mod(n, 2) === 0 ? ["even", "偶"] : ["odd", "奇"]);
        const last = (base: number) => {
          let d = 1;
          for (let i = 0; i < e; i++) d = (d * base) % 10;
          return d;
        };
        // Each form: the expression, its value mod 2, its parity pattern, and a check by computing.
        const forms: [string, number, [string, string], [string, string]][] = [
          [
            `${a} \\cdot ${b} + ${c}`,
            a * b + c,
            [`${P(a)[0]} · ${P(b)[0]} + ${P(c)[0]}`, `${P(a)[1]} · ${P(b)[1]} + ${P(c)[1]}`],
            [`$${a} \\cdot ${b} + ${c} = ${a * b + c}$.`, `$${a} \\cdot ${b} + ${c} = ${a * b + c}$。`],
          ],
          [
            `${a}^{${e}} + ${b}`,
            a + b,
            [`${P(a)[0]} + ${P(b)[0]}`, `${P(a)[1]} + ${P(b)[1]}`],
            [
              `$${a}^{${e}}$ ends in $${last(a)}$, so $${a}^{${e}} + ${b}$ ends in $${(last(a) + b) % 10}$.`,
              `$${a}^{${e}}$ 的个位是 $${last(a)}$，所以 $${a}^{${e}} + ${b}$ 的个位是 $${(last(a) + b) % 10}$。`,
            ],
          ],
          [
            `${a} \\cdot ${b} \\cdot ${c} - 1`,
            a * b * c - 1,
            [`${P(a)[0]} · ${P(b)[0]} · ${P(c)[0]} − odd`, `${P(a)[1]} · ${P(b)[1]} · ${P(c)[1]} − 奇`],
            [`$${a} \\cdot ${b} \\cdot ${c} - 1 = ${a * b * c - 1}$.`, `$${a} \\cdot ${b} \\cdot ${c} - 1 = ${a * b * c - 1}$。`],
          ],
          [
            `${a}^{${e}} - ${b}^{${e}}`,
            a - b,
            [`${P(a)[0]} − ${P(b)[0]}`, `${P(a)[1]} − ${P(b)[1]}`],
            [
              `$${a}^{${e}}$ ends in $${last(a)}$ and $${b}^{${e}}$ ends in $${last(b)}$, and two endings of the same parity give an even difference, of different parity an odd one.`,
              `$${a}^{${e}}$ 的个位是 $${last(a)}$，$${b}^{${e}}$ 的个位是 $${last(b)}$；两个个位奇偶相同则差为偶数，不同则差为奇数。`,
            ],
          ],
          [
            `${a} + ${b} + ${c}`,
            a + b + c,
            [`${P(a)[0]} + ${P(b)[0]} + ${P(c)[0]}`, `${P(a)[1]} + ${P(b)[1]} + ${P(c)[1]}`],
            [`$${a} + ${b} + ${c} = ${a + b + c}$.`, `$${a} + ${b} + ${c} = ${a + b + c}$。`],
          ],
          [
            `(${a} + ${b}) \\cdot ${c}`,
            (a + b) * c,
            [`(${P(a)[0]} + ${P(b)[0]}) · ${P(c)[0]}`, `(${P(a)[1]} + ${P(b)[1]}) · ${P(c)[1]}`],
            [
              `$(${a} + ${b}) \\cdot ${c} = ${a + b} \\cdot ${c} = ${(a + b) * c}$.`,
              `$(${a} + ${b}) \\cdot ${c} = ${a + b} \\cdot ${c} = ${(a + b) * c}$。`,
            ],
          ],
        ];
        const index = rng.int(0, forms.length - 1);
        const [expr, v, pattern, check] = forms[index]!;
        const r = mod(v, 2);
        const options = [t("Even", "偶数"), t("Odd", "奇数")];
        const power = index === 1 || index === 3;
        return reasoned(
          oneOf(
            rng,
            t(`Is $${expr}$ even or odd?`, `$${expr}$ 是偶数还是奇数？`),
            options[r]!,
            [options[1 - r]!],
            walked(
              [
                [
                  ["Replace each number by its parity", "把每个数换成奇偶性"],
                  t(
                    `${power ? "A power has the parity of its base. " : ""}The expression becomes ${pattern[0]}.`,
                    `${power ? "幂与底数同奇偶。" : ""}表达式变为 ${pattern[1]}。`,
                  ),
                ],
                [
                  ["Combine", "合并"],
                  t(
                    `A product is odd only when every factor is odd, and a sum or difference is odd only when exactly one part is odd. The result is ${r === 0 ? "even" : "odd"}.`,
                    `积为奇数当且仅当每个因数都是奇数；和或差为奇数当且仅当恰有一部分是奇数。结果是${r === 0 ? "偶数" : "奇数"}。`,
                  ),
                ],
              ],
              t(check[0], check[1]),
            ),
          ),
          [
            power
              ? [
                  options[1 - r]!.en,
                  "A power has the parity of its base; the exponent does not change it.",
                  "幂与底数同奇偶；指数不改变它。",
                ]
              : [
                  options[1 - r]!.en,
                  "Recheck each part: a product is even as soon as one factor is even, and two odd parts add to an even number.",
                  "逐项再查一遍：只要有一个因数是偶数，积就是偶数；两个奇数相加得偶数。",
                ],
          ],
        );
      },
    },
    {
      id: "counting-odd-and-even-integers",
      title: t("Counting odd and even integers", "统计奇数与偶数的个数"),
      explanation: t(
        "Between $a$ and $b$ the integers alternate in parity. From $3$ to $20$ there are $18$ integers: $9$ odd and $9$ even. From $3$ to $21$ there are $19$: the ends are odd, so $10$ are odd.\n\n> **Watch out.** From $a$ to $b$ there are $b - a + 1$ integers, not $b - a$. When the count is odd, the parity of the two ends gets the extra one.",
        "从 $a$ 到 $b$ 的整数奇偶交替。从 $3$ 到 $20$ 共 $18$ 个整数：$9$ 个奇数，$9$ 个偶数。从 $3$ 到 $21$ 共 $19$ 个：两端都是奇数，所以有 $10$ 个奇数。\n\n> **注意。** 从 $a$ 到 $b$ 共有 $b - a + 1$ 个整数，而不是 $b - a$ 个。个数为奇数时，多出的一个属于两端的奇偶性。",
      ),
      generate(rng) {
        const a = rng.int(-30, 40);
        const b = a + rng.int(5, 60);
        const odd = rng.bool();
        const wanted = range(a, b).filter((x) => mod(x, 2) === (odd ? 1 : 0));
        const count = wanted.length;
        const first = wanted[0]!;
        const end = wanted[wanted.length - 1]!;
        const total = b - a + 1;
        const word = odd ? t("odd", "奇数") : t("even", "偶数");
        return numberProblem({
          prompt: t(
            `How many ${word.en} integers $n$ satisfy $${a} \\le n \\le ${b}$?`,
            `满足 $${a} \\le n \\le ${b}$ 的${word["zh-CN"]}有多少个？`,
          ),
          answer: count,
          wrong: [count + 1],
          mistakes: firstOf([
            why(total - count, `That counts the ${odd ? "even" : "odd"} integers.`, `这数的是${odd ? "偶数" : "奇数"}。`),
            why(
              Math.floor((b - a) / 2),
              `That halves $${b} - ${a < 0 ? `(${a})` : a}$, but there are $${total}$ integers, and the ends decide which parity gets any extra one.`,
              `这是把 $${b} - ${a < 0 ? `(${a})` : a}$ 减半，但整数有 $${total}$ 个，两端决定多出的那个属于哪种奇偶性。`,
            ),
            why(
              total,
              `That counts every integer in the range, not only the ${word.en} ones.`,
              `这数的是范围内的所有整数，而不只是${word["zh-CN"]}。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the first and last", "找出第一个和最后一个"],
                t(
                  `The ${word.en} integers in the range run from $${first}$ to $${end}$ in steps of $2$.`,
                  `范围内的${word["zh-CN"]}从 $${first}$ 到 $${end}$，每次加 $2$。`,
                ),
              ],
              [
                ["Count the steps", "数步数"],
                t(
                  `$\\frac{${end} - ${p(first)}}{2} + 1 = ${(end - first) / 2} + 1 = ${count}$.`,
                  `$\\frac{${end} - ${p(first)}}{2} + 1 = ${(end - first) / 2} + 1 = ${count}$。`,
                ),
              ],
            ],
            t(
              `There are $${total}$ integers in all, and the other parity takes $${total - count}$ of them: $${count} + ${total - count} = ${total}$.`,
              `共有 $${total}$ 个整数，另一种奇偶性占 $${total - count}$ 个：$${count} + ${total - count} = ${total}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** integerDivisibility applies the definition a | b. */
export const integerDivisibility: TopicDef = {
  id: "integer-divisibility",
  title: t("Integer Divisibility", "整数的整除"),
  summary: t(
    "For integers a and b, a | b when b = ak for some integer k; negative numbers and 0 follow the same definition.",
    "对整数 a、b，若存在整数 k 使 b = ak，则 a | b；负数和 0 也遵循同样的定义。",
  ),
  intro: t(
    "Does $-6$ divide $42$? By definition, $a \\mid b$ means $b = ak$ for some integer $k$. Here $42 = (-6)(-7)$, and $-7$ is an integer, so $-6 \\mid 42$. A negative divisor is no obstacle.\n\nCheck: $42 \\div (-6) = -7$ exactly, with nothing left over.\n\nIn this lesson we decide divisibility for any integers, zero and negatives included, and count the divisors and multiples of a number.",
    "$-6$ 整除 $42$ 吗？按定义，$a \\mid b$ 表示存在整数 $k$ 使 $b = ak$。这里 $42 = (-6)(-7)$，而 $-7$ 是整数，所以 $-6 \\mid 42$。负的除数不是障碍。\n\n检验：$42 \\div (-6) = -7$，正好除尽。\n\n本课我们对任意整数（包括零和负数）判断整除，并数出一个数的因数和倍数。",
  ),
  prerequisites: ["proving-divisibility"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "deciding-divisibility",
      title: t("Deciding divisibility", "判断整除"),
      explanation: t(
        "One integer divides another when the second is an integer multiple of the first, which allows negative numbers and zero. $-6 \\mid 42$ since $42 = (-6)(-7)$; $7 \\mid 0$ since $0 = 7 \\cdot 0$; but $0 \\nmid 5$, because $0 \\cdot k = 0$ for every $k$. Signs do not affect divisibility.\n\n> **Watch out.** $a \\mid b$ is a statement, not a fraction, and the order matters: it says $b$ is a multiple of $a$. So $7 \\mid 0$ is true, while $0 \\mid 7$ is false.",
        "一个整数整除另一个整数，是指后者是前者的整数倍，这里允许负数和零。$-6 \\mid 42$，因为 $42 = (-6)(-7)$；$7 \\mid 0$，因为 $0 = 7 \\cdot 0$；但 $0 \\nmid 5$，因为对每个 $k$，$0 \\cdot k = 0$。符号不影响整除性。\n\n> **注意。** $a \\mid b$ 是一个命题，不是分数，而且顺序很重要：它说的是 $b$ 是 $a$ 的倍数。所以 $7 \\mid 0$ 成立，而 $0 \\mid 7$ 不成立。",
      ),
      generate(rng) {
        const kind = rng.int(0, 5);
        let a: number;
        let b: number;
        if (kind === 0) {
          a = rng.int(2, 15) * (rng.bool() ? -1 : 1);
          b = 0;
        } else if (kind === 1) {
          a = 0;
          b = rng.int(1, 30) * (rng.bool() ? -1 : 1);
        } else {
          a = rng.int(2, 15) * (rng.bool() ? -1 : 1);
          b = (kind < 4 ? a * rng.int(-12, 12) : a * rng.int(-12, 12) + rng.int(1, Math.abs(a) - 1)) || a;
        }
        const value = a === 0 ? b === 0 : b % a === 0;
        const k = a === 0 ? 0 : b / a;
        const q = a === 0 ? 0 : Math.floor(b / a);
        const ak = a < 0 ? `(${a})k` : `${a}k`;
        const steps: [[string, string], Text][] =
          a === 0
            ? [
                [
                  ["Write the definition", "写出定义"],
                  t(
                    `$0 \\mid ${b}$ would need an integer $k$ with $${b} = 0 \\cdot k$.`,
                    `$0 \\mid ${b}$ 需要整数 $k$ 使 $${b} = 0 \\cdot k$。`,
                  ),
                ],
                [
                  ["Look for k", "寻找 k"],
                  t(
                    `$0 \\cdot k = 0$ for every $k$, and $${b} \\ne 0$, so no $k$ works: $0 \\nmid ${b}$.`,
                    `对每个 $k$，$0 \\cdot k = 0$，而 $${b} \\ne 0$，所以没有 $k$ 满足：$0 \\nmid ${b}$。`,
                  ),
                ],
              ]
            : [
                [
                  ["Write the definition", "写出定义"],
                  t(
                    `$${a} \\mid ${b}$ means $${b} = ${ak}$ for some integer $k$.`,
                    `$${a} \\mid ${b}$ 表示存在整数 $k$ 使 $${b} = ${ak}$。`,
                  ),
                ],
                value
                  ? [
                      ["Find k", "求出 k"],
                      t(
                        `$k = \\frac{${b}}{${a}} = ${k}$ is an integer, so $${a} \\mid ${b}$.`,
                        `$k = \\frac{${b}}{${a}} = ${k}$ 是整数，所以 $${a} \\mid ${b}$。`,
                      ),
                    ]
                  : [
                      ["Look for k", "寻找 k"],
                      t(
                        `$\\frac{${b}}{${a}}$ lies strictly between $${q}$ and $${q + 1}$, so it is not an integer: $${a} \\nmid ${b}$.`,
                        `$\\frac{${b}}{${a}}$ 严格介于 $${q}$ 与 $${q + 1}$ 之间，不是整数：$${a} \\nmid ${b}$。`,
                      ),
                    ],
              ];
        const check =
          a === 0
            ? t("The only multiple of $0$ is $0$ itself.", "$0$ 的倍数只有 $0$ 本身。")
            : value
              ? t(`Multiply back: $(${a})(${k}) = ${b}$.`, `乘回去：$(${a})(${k}) = ${b}$。`)
              : t(
                  `The neighbouring multiples are $(${a})(${q}) = ${a * q}$ and $(${a})(${q + 1}) = ${a * (q + 1)}$, and $${b}$ is neither.`,
                  `相邻的倍数是 $(${a})(${q}) = ${a * q}$ 和 $(${a})(${q + 1}) = ${a * (q + 1)}$，$${b}$ 都不是。`,
                );
        const reason: [string, string] =
          a === 0
            ? ["$0 \\cdot k$ is $0$ for every $k$, so $0$ divides only $0$.", "对每个 $k$，$0 \\cdot k$ 都是 $0$，所以 $0$ 只整除 $0$。"]
            : b === 0
              ? ["$0$ is a multiple of every integer: take $k = 0$.", "$0$ 是每个整数的倍数：取 $k = 0$。"]
              : value && (a < 0 || b < 0)
                ? [
                    "Signs do not matter: look for an integer $k$, negative allowed, with $b = ak$.",
                    "符号无关紧要：寻找整数 $k$（可以为负）使 $b = ak$。",
                  ]
                : value
                  ? ["Divide: the quotient is a whole number, so the multiple exists.", "做除法：商是整数，所以这个倍数关系成立。"]
                  : ["Divide: the quotient must be a whole number, and here it is not.", "做除法：商必须是整数，而这里不是。"];
        return reasoned(
          oneOf(
            rng,
            t(`Is it true that $${a} \\mid ${b}$?`, `$${a} \\mid ${b}$ 成立吗？`),
            yesNo[value ? 0 : 1]!,
            [yesNo[value ? 1 : 0]!],
            walked(steps, check),
          ),
          [[yesNo[value ? 1 : 0]!.en, reason[0], reason[1]]],
        );
      },
    },
    {
      id: "counting-divisors-and-multiples",
      title: t("Counting divisors and multiples", "统计因数与倍数"),
      explanation: t(
        "The multiples of $d$ between $1$ and $N$ are $d, 2d, \\dots, \\lfloor N/d \\rfloor d$. The positive divisors of $36$ are $1, 2, 3, 4, 6, 9, 12, 18, 36$: nine of them, and eighteen counting negatives. Divisors come in pairs $d$ and $\\frac{n}{d}$, so it is enough to search up to $\\sqrt{n}$.\n\n> **Watch out.** Count the multiples of $d$ by their indices, from $\\lceil \\frac{a}{d} \\rceil$ to $\\lfloor \\frac{b}{d} \\rfloor$ inclusive, and remember that $0$ is a multiple too. Dividing the length of the range by $d$ can be off by one.",
        "$1$ 到 $N$ 之间 $d$ 的倍数是 $d, 2d, \\dots, \\lfloor N/d \\rfloor d$。$36$ 的正因数是 $1, 2, 3, 4, 6, 9, 12, 18, 36$，共九个；算上负因数共十八个。因数成对出现：$d$ 与 $\\frac{n}{d}$，所以只需找到 $\\sqrt{n}$ 为止。\n\n> **注意。** 按下标数 $d$ 的倍数，从 $\\lceil \\frac{a}{d} \\rceil$ 到 $\\lfloor \\frac{b}{d} \\rfloor$（含两端），并记住 $0$ 也是倍数。用区间长度除以 $d$ 可能差一。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const d = rng.int(3, 17);
          const a = rng.int(-60, 60);
          const b = a + rng.int(30, 200);
          const count = range(a, b).filter((x) => x % d === 0).length;
          const lo = Math.ceil(a / d) + 0;
          const hi = Math.floor(b / d) + 0;
          return numberProblem({
            prompt: t(
              `How many integers $n$ with $${a} \\le n \\le ${b}$ are divisible by $${d}$?`,
              `满足 $${a} \\le n \\le ${b}$ 且能被 $${d}$ 整除的整数 $n$ 有多少个？`,
            ),
            answer: count,
            wrong: [count + 1],
            mistakes: firstOf([
              why(
                Math.floor((b - a) / d),
                "Dividing the length of the range by the divisor can miss a multiple at the ends; count by indices.",
                "用区间长度除以除数可能漏掉端点处的倍数；要按下标来数。",
              ),
              ...(a > 0
                ? [
                    why(
                      Math.floor(b / d),
                      `That counts the multiples from $1$ to $${b}$; the range starts at $${a}$.`,
                      `这数的是 $1$ 到 $${b}$ 的倍数；而范围从 $${a}$ 开始。`,
                    ),
                  ]
                : []),
            ]),
            solution: walked(
              [
                [
                  ["Find the first and last multiples", "找出第一个和最后一个倍数"],
                  t(
                    `The first is $${d} \\cdot ${p(lo)} = ${lo * d}$ and the last is $${d} \\cdot ${p(hi)} = ${hi * d}$.`,
                    `第一个是 $${d} \\cdot ${lo} = ${lo * d}$，最后一个是 $${d} \\cdot ${hi} = ${hi * d}$。`,
                  ),
                ],
                [
                  ["Count the indices", "数下标"],
                  t(
                    `The indices run from $${lo}$ to $${hi}$: $${hi} - ${p(lo)} + 1 = ${count}$.`,
                    `下标从 $${lo}$ 到 $${hi}$：$${hi} - ${p(lo)} + 1 = ${count}$。`,
                  ),
                ],
              ],
              t(
                `One step beyond each end leaves the range: $${(lo - 1) * d} < ${a}$ and $${(hi + 1) * d} > ${b}$.`,
                `再往外一步就出了范围：$${(lo - 1) * d} < ${a}$，$${(hi + 1) * d} > ${b}$。`,
              ),
            ),
          });
        }
        const n = rng.int(12, 200);
        const all = rng.bool();
        const divisors = range(1, n).filter((x) => n % x === 0);
        const pos = divisors.length;
        const pairs = divisors.filter((x) => x * x <= n).map((x) => (x * x === n ? `${x} \\cdot ${x}` : `${x} \\cdot ${n / x}`));
        const factors = factorize(n);
        const formula = factors.map(([, e]) => `(${e} + 1)`).join("");
        const product = factors.map(([p, e]) => (e === 1 ? `${p}` : `${p}^{${e}}`)).join(" \\cdot ");
        return numberProblem({
          prompt: t(`How many ${all ? "" : "positive "}integers divide $${n}$?`, `有多少个${all ? "" : "正"}整数整除 $${n}$？`),
          answer: all ? 2 * pos : pos,
          wrong: [pos + 1],
          mistakes: firstOf([
            all
              ? why(
                  pos,
                  "That counts only the positive divisors; each has a negative partner.",
                  "这只数了正因数；每个正因数都有对应的负因数。",
                )
              : why(
                  2 * pos,
                  "That counts the negative divisors too; the question asks for positive ones.",
                  "这把负因数也算进去了；题目问的是正因数。",
                ),
            why(
              all ? 2 * (pos - 2) : pos - 2,
              `That leaves out $1$ and $${n}$, which divide $${n}$ too.`,
              `这漏掉了 $1$ 和 $${n}$，它们也整除 $${n}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Pair the divisors", "把因数配对"],
                t(
                  `Searching up to $\\sqrt{${n}}$: $${n} = ${pairs.join(" = ")}$.`,
                  `找到 $\\sqrt{${n}}$ 为止：$${n} = ${pairs.join(" = ")}$。`,
                ),
              ],
              [
                ["Count them", "数一数"],
                t(
                  `The positive divisors are $${divisors.join(", ")}$: $${pos}$ of them${all ? `. Each has a negative partner, giving $${2 * pos}$` : ""}.`,
                  `正因数是 $${divisors.join(", ")}$，共 $${pos}$ 个${all ? `。每个都有对应的负因数，共 $${2 * pos}$ 个` : ""}。`,
                ),
              ],
            ],
            t(
              `From $${n} = ${product}$, the number of positive divisors is $${formula} = ${pos}$.`,
              `由 $${n} = ${product}$，正因数的个数是 $${formula} = ${pos}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theDivisionAlgorithm writes a = bq + r with 0 ≤ r < b. */
export const theDivisionAlgorithm: TopicDef = {
  id: "the-division-algorithm",
  title: t("The Division Algorithm", "带余除法"),
  summary: t(
    "For integers a and b > 0 there are unique integers q and r with a = bq + r and 0 ≤ r < b.",
    "对整数 a 与 b > 0，存在唯一的整数 q、r，使 a = bq + r 且 0 ≤ r < b。",
  ),
  intro: t(
    "Divide $-23$ by $5$. The remainder must satisfy $0 \\le r < 5$, so the quotient is $-4.6$ rounded down, $q = -5$. Then $r = -23 - 5 \\cdot (-5) = -23 + 25 = 2$.\n\nCheck: $5 \\cdot (-5) + 2 = -25 + 2 = -23$, and $0 \\le 2 < 5$.\n\nIn this lesson we find the quotient and the remainder of the division algorithm, for negative numbers as well as positive ones.",
    "用 $5$ 除 $-23$。余数必须满足 $0 \\le r < 5$，所以商是 $-4.6$ 向下取整，即 $q = -5$。于是 $r = -23 - 5 \\cdot (-5) = -23 + 25 = 2$。\n\n检验：$5 \\cdot (-5) + 2 = -25 + 2 = -23$，且 $0 \\le 2 < 5$。\n\n本课我们求带余除法的商和余数，负数和正数都包括。",
  ),
  prerequisites: ["integer-divisibility"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "remainders-of-negative-integers",
      title: t("Remainders", "余数"),
      explanation: t(
        "The division algorithm requires a remainder between zero and the divisor, so for negative numbers the quotient must be rounded down. The remainder is never negative. $-23 = 5 \\cdot (-5) + 2$, so dividing $-23$ by $5$ gives $q = -5$ and $r = 2$, not $q = -4$, $r = -3$.\n\n> **Watch out.** The remainder of a negative number is not the remainder of its absolute value: $23$ leaves $3$ on division by $5$, but $-23$ leaves $2$.",
        "带余除法要求余数介于零和除数之间，所以对于负数，商必须向下取整。余数永远不为负。$-23 = 5 \\cdot (-5) + 2$，所以 $-23$ 除以 $5$ 得 $q = -5$，$r = 2$，而不是 $q = -4$，$r = -3$。\n\n> **注意。** 负数的余数不是它绝对值的余数：$23$ 除以 $5$ 余 $3$，而 $-23$ 余 $2$。",
      ),
      generate(rng) {
        const b = rng.int(3, 15);
        const a = rng.int(-150, 150);
        const r = mod(a, b);
        const q = floorDiv(a, b);
        return numberProblem({
          prompt: t(
            `Write $${a} = ${b}q + r$ with $0 \\le r < ${b}$. Find $r$.`,
            `把 $${a}$ 写成 $${b}q + r$，其中 $0 \\le r < ${b}$。求 $r$。`,
          ),
          answer: r,
          wrong: [b - r],
          mistakes: firstOf([
            why(
              Math.abs(a) % b,
              `That is the remainder of $${Math.abs(a)}$; for a negative number the quotient is rounded down.`,
              `这是 $${Math.abs(a)}$ 的余数；对负数，商要向下取整。`,
            ),
            why(
              a % b,
              `A remainder is never negative; it must lie between $0$ and $${b - 1}$.`,
              `余数从不为负；它必须在 $0$ 到 $${b - 1}$ 之间。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the quotient", "求商"],
                t(
                  `$q = \\lfloor \\frac{${a}}{${b}} \\rfloor = ${q}$, the largest integer with $${b}q \\le ${a}$.`,
                  `$q = \\lfloor \\frac{${a}}{${b}} \\rfloor = ${q}$，即满足 $${b}q \\le ${a}$ 的最大整数。`,
                ),
              ],
              [
                ["Find the remainder", "求余数"],
                t(
                  `$r = ${a} - ${b} \\cdot ${p(q)} = ${a} - ${p(b * q)} = ${r}$.`,
                  `$r = ${a} - ${b} \\cdot ${p(q)} = ${a} - ${p(b * q)} = ${r}$。`,
                ),
              ],
            ],
            t(
              `$${b} \\cdot ${p(q)} + ${r} = ${a}$, and $0 \\le ${r} < ${b}$.`,
              `$${b} \\cdot ${p(q)} + ${r} = ${a}$，且 $0 \\le ${r} < ${b}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "quotients-of-the-division-algorithm",
      title: t("Quotients", "商"),
      explanation: t(
        "The quotient is the floor of the exact ratio, which is what keeps the remainder from becoming negative. The quotient is $q = \\lfloor a/b \\rfloor$, rounding down even for negative $a$: dividing $-23$ by $5$ gives $q = \\lfloor -4.6 \\rfloor = -5$.\n\n> **Watch out.** Round down, not toward zero. For a negative ratio, rounding down moves away from zero: $-4.6$ becomes $-5$, not $-4$.",
        "商是精确比值的向下取整，正是这一点保证余数不会变成负数。商是 $q = \\lfloor a/b \\rfloor$，即使 $a$ 为负也向下取整：$-23$ 除以 $5$ 得 $q = \\lfloor -4.6 \\rfloor = -5$。\n\n> **注意。** 要向下取整，而不是向零取整。比值为负时，向下取整会远离零：$-4.6$ 变为 $-5$，而不是 $-4$。",
      ),
      generate(rng) {
        const b = rng.int(3, 15);
        const a = rng.int(-200, 200);
        const q = floorDiv(a, b);
        const r = mod(a, b);
        const ratio = Math.round((a / b) * 100) / 100;
        const exact = r === 0;
        return numberProblem({
          prompt: t(
            `Write $${a} = ${b}q + r$ with $0 \\le r < ${b}$. Find $q$.`,
            `把 $${a}$ 写成 $${b}q + r$，其中 $0 \\le r < ${b}$。求 $q$。`,
          ),
          answer: q,
          wrong: [-q],
          mistakes: firstOf([
            why(
              Math.trunc(a / b),
              "That rounds toward zero; the quotient rounds down, so the remainder stays non-negative.",
              "这是向零取整；商要向下取整，余数才不为负。",
            ),
            why(
              q + 1,
              `With that quotient, $${b}q$ is larger than $${a}$ and the remainder would be negative.`,
              `用这个商，$${b}q$ 比 $${a}$ 大，余数会是负的。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Divide", "做除法"],
                t(
                  exact ? `$\\frac{${a}}{${b}} = ${a / b}$ exactly.` : `$\\frac{${a}}{${b}} \\approx ${ratio}$.`,
                  exact ? `$\\frac{${a}}{${b}} = ${a / b}$，正好除尽。` : `$\\frac{${a}}{${b}} \\approx ${ratio}$。`,
                ),
              ],
              [
                ["Round down", "向下取整"],
                t(`$q = \\lfloor \\frac{${a}}{${b}} \\rfloor = ${q}$.`, `$q = \\lfloor \\frac{${a}}{${b}} \\rfloor = ${q}$。`),
              ],
            ],
            t(
              `$r = ${a} - ${b} \\cdot ${p(q)} = ${r}$ lies in $[0, ${b})$, as a remainder must.`,
              `$r = ${a} - ${b} \\cdot ${p(q)} = ${r}$ 在 $[0, ${b})$ 中，正符合余数的要求。`,
            ),
          ),
        });
      },
    },
  ],
};

/** euclidSteps lists the divisions of the Euclidean algorithm on a > b > 0. */
function euclidSteps(a: number, b: number): string[] {
  const lines: string[] = [];
  let [x, y] = [a, b];
  while (y !== 0) {
    lines.push(`${x} = ${y} \\cdot ${floorDiv(x, y)} + ${mod(x, y)}`);
    [x, y] = [y, mod(x, y)];
  }
  return lines;
}

/** euclidPair picks a pair with a nontrivial Euclidean algorithm. */
function euclidPair(rng: Rng, coprime = false): [number, number] {
  for (;;) {
    const g = coprime ? 1 : rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13]);
    const a = g * rng.int(5, 40);
    const b = g * rng.int(3, 30);
    if (a > b && gcd(a, b) === g && euclidSteps(a, b).length >= 3) return [a, b];
  }
}

/** theEuclideanAlgorithm computes greatest common divisors by repeated division. */
export const theEuclideanAlgorithm: TopicDef = {
  id: "the-euclidean-algorithm",
  title: t("The Euclidean Algorithm", "欧几里得算法"),
  summary: t(
    "gcd(a, b) = gcd(b, r) where r is the remainder of a divided by b; repeating until the remainder is 0 gives the gcd.",
    "gcd(a, b) = gcd(b, r)，其中 r 是 a 除以 b 的余数；重复直到余数为 0，就得到最大公因数。",
  ),
  intro: t(
    "Find $\\gcd(252, 105)$. Divide and keep the remainder: $252 = 105 \\cdot 2 + 42$, then $105 = 42 \\cdot 2 + 21$, then $42 = 21 \\cdot 2 + 0$. Each step keeps the gcd the same, and the last nonzero remainder, $21$, is the gcd.\n\nCheck: $252 = 21 \\cdot 12$ and $105 = 21 \\cdot 5$, and $12$ and $5$ share no factor, so nothing larger than $21$ divides both.\n\nIn this lesson we see why one division step keeps the gcd, and run the whole algorithm to compute it.",
    "求 $\\gcd(252, 105)$。做除法并保留余数：$252 = 105 \\cdot 2 + 42$，然后 $105 = 42 \\cdot 2 + 21$，然后 $42 = 21 \\cdot 2 + 0$。每一步最大公因数都不变，最后一个非零余数 $21$ 就是最大公因数。\n\n检验：$252 = 21 \\cdot 12$，$105 = 21 \\cdot 5$，而 $12$ 与 $5$ 没有公因数，所以没有比 $21$ 更大的数同时整除两者。\n\n本课我们说明一步除法为什么保持最大公因数，并完整运行算法来计算它。",
  ),
  prerequisites: ["the-division-algorithm", "greatest-common-factor"],
  encompasses: [{ topic: "greatest-common-factor", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "one-step-of-the-euclidean-algorithm",
      title: t("One step", "一步"),
      explanation: t(
        "If $a = bq + r$, every common divisor of $a$ and $b$ divides $r = a - bq$, and every common divisor of $b$ and $r$ divides $a$. So $\\gcd(a, b) = \\gcd(b, r)$: $\\gcd(252, 105) = \\gcd(105, 42)$.\n\n> **Watch out.** The new pair uses the remainder, so subtract $b$ as many times as it fits. Subtracting it once gives $a - b$, which is the remainder only when the quotient is $1$.",
        "若 $a = bq + r$，则 $a$ 与 $b$ 的每个公因数都整除 $r = a - bq$，$b$ 与 $r$ 的每个公因数也都整除 $a$。所以 $\\gcd(a, b) = \\gcd(b, r)$：$\\gcd(252, 105) = \\gcd(105, 42)$。\n\n> **注意。** 新的一对用的是余数，所以要尽可能多次地减去 $b$。只减一次得 $a - b$，只有商为 $1$ 时它才是余数。",
      ),
      generate(rng) {
        const [a, b] = euclidPair(rng);
        const r = mod(a, b);
        const q = floorDiv(a, b);
        return numberProblem({
          prompt: t(
            `The Euclidean algorithm gives $\\gcd(${a}, ${b}) = \\gcd(${b}, r)$. Find $r$.`,
            `欧几里得算法给出 $\\gcd(${a}, ${b}) = \\gcd(${b}, r)$。求 $r$。`,
          ),
          answer: r,
          wrong: [r + 1],
          mistakes: firstOf([
            why(
              a - b,
              `That subtracts $${b}$ once; it fits $${q}$ times, and $r$ is what is left after that.`,
              `这只减了一次 $${b}$；它能减 $${q}$ 次，$r$ 是减完后剩下的。`,
            ),
            why(q, "That is the quotient; the new pair keeps the remainder.", "这是商；新的一对保留的是余数。"),
            why(
              gcd(a, b),
              "That is the gcd at the end of the algorithm; this step asks only for the next remainder.",
              "这是算法最后得到的最大公因数；这一步只问下一个余数。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Divide", "做除法"],
                t(
                  `$${b}$ fits into $${a}$ $${q}$ times: $${b} \\cdot ${q} = ${b * q}$.`,
                  `$${a}$ 里有 $${q}$ 个 $${b}$：$${b} \\cdot ${q} = ${b * q}$。`,
                ),
              ],
              [
                ["Take the remainder", "取余数"],
                t(`$${a} = ${b} \\cdot ${q} + ${r}$, so $r = ${r}$.`, `$${a} = ${b} \\cdot ${q} + ${r}$，所以 $r = ${r}$。`),
              ],
            ],
            t(
              `$${r} < ${b}$, as a remainder must be, and $${b * q} + ${r} = ${a}$.`,
              `$${r} < ${b}$，符合余数的要求，且 $${b * q} + ${r} = ${a}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "computing-gcds-with-the-euclidean-algorithm",
      title: t("Computing the gcd", "计算最大公因数"),
      explanation: t(
        "A common divisor of two numbers also divides their remainder, so replacing the pair by the smaller number and the remainder keeps the gcd the same. Repeat until the remainder is $0$; the last nonzero remainder is the gcd. $252 = 105 \\cdot 2 + 42$, $105 = 42 \\cdot 2 + 21$, $42 = 21 \\cdot 2 + 0$, so $\\gcd(252, 105) = 21$.\n\n> **Watch out.** Keep going until a remainder is $0$, and then read the remainder just before it. Stopping after the first division gives only the first remainder.",
        "两个数的公因数也整除它们的余数，所以把这一对数换成较小的数和余数，最大公因数不变。重复直到余数为 $0$；最后一个非零余数就是最大公因数。$252 = 105 \\cdot 2 + 42$，$105 = 42 \\cdot 2 + 21$，$42 = 21 \\cdot 2 + 0$，所以 $\\gcd(252, 105) = 21$。\n\n> **注意。** 要一直做到余数为 $0$，然后读它前面的那个余数。只做第一步除法得到的只是第一个余数。",
      ),
      generate(rng) {
        const [a, b] = euclidPair(rng);
        const g = gcd(a, b);
        const steps = euclidSteps(a, b);
        return numberProblem({
          prompt: t(`Use the Euclidean algorithm to find $\\gcd(${a}, ${b})$.`, `用欧几里得算法求 $\\gcd(${a}, ${b})$。`),
          answer: g,
          wrong: [g * 2],
          mistakes: firstOf([
            why(
              mod(a, b),
              "That is the first remainder; keep dividing until a remainder is $0$.",
              "这是第一个余数；要继续除，直到余数为 $0$。",
            ),
            why(1, `The two numbers do share a factor: run the divisions to the end.`, `这两个数确实有公因数：把除法做到底。`),
          ]),
          solution: walked(
            [
              [
                ["Divide until the remainder is 0", "除到余数为 0"],
                t("Each line divides the previous divisor by the previous remainder:", "每一行用上一行的除数除以上一行的余数："),
                steps,
              ],
              [["Read the gcd", "读出最大公因数"], t(`The last nonzero remainder is $${g}$.`, `最后一个非零余数是 $${g}$。`)],
            ],
            t(
              `$${a} = ${g} \\cdot ${a / g}$ and $${b} = ${g} \\cdot ${b / g}$, and $\\gcd(${a / g}, ${b / g}) = 1$, so no larger number divides both.`,
              `$${a} = ${g} \\cdot ${a / g}$，$${b} = ${g} \\cdot ${b / g}$，且 $\\gcd(${a / g}, ${b / g}) = 1$，所以没有更大的数同时整除两者。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theExtendedEuclideanAlgorithm writes gcd(a, b) as a combination of a and b. */
export const theExtendedEuclideanAlgorithm: TopicDef = {
  id: "the-extended-euclidean-algorithm",
  title: t("The Extended Euclidean Algorithm", "扩展欧几里得算法"),
  summary: t(
    "Working the Euclidean algorithm backwards writes gcd(a, b) = ax + by for integers x and y (Bézout's identity).",
    "把欧几里得算法倒推回去，可以把 gcd(a, b) 写成 ax + by（x、y 为整数），即裴蜀等式。",
  ),
  intro: t(
    "Write $1 = \\gcd(35, 12)$ as $35x + 12y$. The Euclidean algorithm gives $35 = 12 \\cdot 2 + 11$ and $12 = 11 \\cdot 1 + 1$. Work back: $1 = 12 - 11 = 12 - (35 - 2 \\cdot 12) = 3 \\cdot 12 - 35$. So $x = -1$ and $y = 3$.\n\nCheck: $35 \\cdot (-1) + 12 \\cdot 3 = -35 + 36 = 1$.\n\nIn this lesson we find Bézout coefficients by working back through the algorithm, and scale an identity to reach a multiple of the gcd.",
    "把 $1 = \\gcd(35, 12)$ 写成 $35x + 12y$。欧几里得算法给出 $35 = 12 \\cdot 2 + 11$ 与 $12 = 11 \\cdot 1 + 1$。倒推：$1 = 12 - 11 = 12 - (35 - 2 \\cdot 12) = 3 \\cdot 12 - 35$。所以 $x = -1$，$y = 3$。\n\n检验：$35 \\cdot (-1) + 12 \\cdot 3 = -35 + 36 = 1$。\n\n本课我们沿算法倒推求裴蜀系数，并把等式放大以得到最大公因数的倍数。",
  ),
  prerequisites: ["the-euclidean-algorithm"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "bezout-coefficients",
      title: t("Bézout coefficients", "裴蜀系数"),
      explanation: t(
        "Working back through the Euclidean algorithm writes the gcd as an integer combination of the two original numbers. From $35 = 12 \\cdot 2 + 11$ and $12 = 11 \\cdot 1 + 1$: $1 = 12 - 11 = 12 - (35 - 2 \\cdot 12) = 3 \\cdot 12 - 35$. So $35x + 12y = 1$ with $x = -1$, $y = 3$. Adding $12$ to $x$ and subtracting $35$ from $y$ gives another solution, such as $x = 11$, $y = -32$.\n\n> **Watch out.** The coefficients are not unique. To land in a required range, shift $x$ by multiples of $\\frac{b}{g}$ and $y$ by the matching multiples of $\\frac{a}{g}$, in opposite directions.",
        "沿着欧几里得算法倒推，就能把最大公因数写成两个原数的整数组合。由 $35 = 12 \\cdot 2 + 11$ 与 $12 = 11 \\cdot 1 + 1$：$1 = 12 - 11 = 12 - (35 - 2 \\cdot 12) = 3 \\cdot 12 - 35$。所以 $35x + 12y = 1$ 有解 $x = -1$，$y = 3$。把 $x$ 加 $12$、$y$ 减 $35$ 得到另一组解，例如 $x = 11$，$y = -32$。\n\n> **注意。** 系数不唯一。要落在指定范围内，就把 $x$ 加减 $\\frac{b}{g}$ 的倍数，同时把 $y$ 朝相反方向加减相应倍数的 $\\frac{a}{g}$。",
      ),
      generate(rng) {
        const [a, b] = euclidPair(rng);
        const g = gcd(a, b);
        const m = b / g;
        const [x0] = bezout(a, b);
        const y0 = (g - a * x0) / b;
        const x = mod(x0, m);
        const y = (g - a * x) / b;
        const shift = (x - x0) / m;
        return numberProblem({
          prompt: t(
            `There are integers $x, y$ with $${a}x + ${b}y = ${g}$ and $0 \\le x < ${m}$. Find $x$.`,
            `存在整数 $x, y$ 使 $${a}x + ${b}y = ${g}$ 且 $0 \\le x < ${m}$。求 $x$。`,
          ),
          answer: x,
          wrong: [x + 1],
          mistakes: firstOf([
            why(
              m - x,
              `That has the wrong sign: $${a} \\cdot ${m - x}$ makes the combination come to $-${g}$ plus a multiple of $${b}$.`,
              `符号反了：$${a} \\cdot ${m - x}$ 使组合等于 $-${g}$ 加上 $${b}$ 的倍数。`,
            ),
            why(
              x0,
              `That $x$ solves the equation but lies outside $0 \\le x < ${m}$; shift it by a multiple of $${m}$.`,
              `这个 $x$ 满足方程，但不在 $0 \\le x < ${m}$ 内；要加减 $${m}$ 的倍数。`,
            ),
          ]),
          solution: walked(
            [
              [["Run the algorithm", "运行算法"], t("The divisions are:", "各步除法为："), euclidSteps(a, b)],
              [
                ["Work back", "倒推"],
                t(
                  `Substituting each remainder back, from the last line up, gives $${a}(${x0}) + ${b}(${y0}) = ${g}$.`,
                  `从最后一行往上逐个代回余数，得 $${a}(${x0}) + ${b}(${y0}) = ${g}$。`,
                ),
              ],
              [
                ["Shift into range", "移到范围内"],
                shift === 0
                  ? t(`$x = ${x0}$ already lies in $0 \\le x < ${m}$.`, `$x = ${x0}$ 已在 $0 \\le x < ${m}$ 内。`)
                  : t(
                      `Add $${shift} \\cdot ${m}$ to $x$ and subtract $${shift} \\cdot ${a / g}$ from $y$: $x = ${x}$, $y = ${y}$.`,
                      `给 $x$ 加上 $${shift} \\cdot ${m}$，给 $y$ 减去 $${shift} \\cdot ${a / g}$：$x = ${x}$，$y = ${y}$。`,
                    ),
              ],
            ],
            t(
              `$${a} \\cdot ${x} + ${b} \\cdot ${p(y)} = ${a * x} - ${-b * y} = ${g}$.`,
              `$${a} \\cdot ${x} + ${b} \\cdot ${p(y)} = ${a * x} - ${-b * y} = ${g}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "scaling-bezout-identities",
      title: t("Scaling a Bézout identity", "放大裴蜀等式"),
      explanation: t(
        "Multiplying both sides of the identity by the same integer turns a solution for the gcd into a solution for any multiple of it. If $ax_0 + by_0 = g$, then multiplying by $k$ solves $ax + by = kg$: $x = kx_0$, $y = ky_0$. From $35(-1) + 12(3) = 1$ we get $35(-5) + 12(15) = 5$.\n\n> **Watch out.** Multiply both coefficients by $k$. Scaling only one of them, or adding $k$ instead of multiplying, breaks the equation.",
        "把恒等式两边乘以同一个整数，就把关于最大公因数的解变成关于它任意倍数的解。若 $ax_0 + by_0 = g$，两边乘 $k$ 就得到 $ax + by = kg$ 的解：$x = kx_0$，$y = ky_0$。由 $35(-1) + 12(3) = 1$ 得 $35(-5) + 12(15) = 5$。\n\n> **注意。** 两个系数都要乘以 $k$。只放大其中一个，或者把乘 $k$ 换成加 $k$，等式就不成立了。",
      ),
      generate(rng) {
        const [a, b] = euclidPair(rng);
        const g = gcd(a, b);
        const [x0, y0] = bezout(a, b);
        const k = rng.int(2, 9);
        const askX = rng.bool();
        const own = askX ? x0 : y0;
        const other = askX ? y0 : x0;
        return numberProblem({
          prompt: t(
            `Given $${a}(${x0}) + ${b}(${y0}) = ${g}$, find the solution of $${a}x + ${b}y = ${k * g}$ with ${askX ? `$y = ${k * y0}$. What is $x$?` : `$x = ${k * x0}$. What is $y$?`}`,
            `已知 $${a}(${x0}) + ${b}(${y0}) = ${g}$，求 $${a}x + ${b}y = ${k * g}$ 满足${askX ? `$y = ${k * y0}$ 的解。$x$ 是多少？` : `$x = ${k * x0}$ 的解。$y$ 是多少？`}`,
          ),
          answer: k * own,
          wrong: [k * own + 1],
          mistakes: firstOf([
            why(own, `That is the coefficient before scaling; multiply it by $${k}$ too.`, `这是放大前的系数；它也要乘以 $${k}$。`),
            why(own + k, `That adds $${k}$; the whole identity is multiplied by $${k}$.`, `这是加 $${k}$；整个等式是乘以 $${k}$。`),
            why(k * other, `That is the other unknown, $${askX ? "y" : "x"}$.`, `这是另一个未知数 $${askX ? "y" : "x"}$。`),
          ]),
          solution: walked(
            [
              [
                ["Compare the right sides", "比较右边"],
                t(
                  `$${k * g} = ${k} \\cdot ${g}$, so multiply the identity by $${k}$.`,
                  `$${k * g} = ${k} \\cdot ${g}$，所以把等式乘以 $${k}$。`,
                ),
              ],
              [
                ["Multiply both coefficients", "两个系数都乘"],
                t(
                  `$${a}(${k * x0}) + ${b}(${k * y0}) = ${k * g}$, so $${askX ? "x" : "y"} = ${k * own}$.`,
                  `$${a}(${k * x0}) + ${b}(${k * y0}) = ${k * g}$，所以 $${askX ? "x" : "y"} = ${k * own}$。`,
                ),
              ],
            ],
            t(
              `$${a} \\cdot ${p(k * x0)} = ${a * k * x0}$ and $${b} \\cdot ${p(k * y0)} = ${b * k * y0}$, which add to $${k * g}$.`,
              `$${a} \\cdot ${p(k * x0)} = ${a * k * x0}$，$${b} \\cdot ${p(k * y0)} = ${b * k * y0}$，两者之和为 $${k * g}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** linearDiophantineEquations solves ax + by = c in integers. */
export const linearDiophantineEquations: TopicDef = {
  id: "linear-diophantine-equations",
  title: t("Linear Diophantine Equations", "线性丢番图方程"),
  summary: t(
    "ax + by = c has integer solutions exactly when gcd(a, b) | c; they are x = x₀ + (b/g)t, y = y₀ − (a/g)t.",
    "ax + by = c 有整数解当且仅当 gcd(a, b) | c；通解为 x = x₀ + (b/g)t，y = y₀ − (a/g)t。",
  ),
  intro: t(
    "Does $6x + 15y = 21$ have integer solutions? Every $6x + 15y$ is a multiple of $\\gcd(6, 15) = 3$, and $21 = 3 \\cdot 7$ is one, so yes: from $6 \\cdot (-2) + 15 \\cdot 1 = 3$, multiply by $7$ to get $x = -14$, $y = 7$. But $6x + 15y = 20$ has none, since $3 \\nmid 20$.\n\nCheck: $6 \\cdot (-14) + 15 \\cdot 7 = -84 + 105 = 21$.\n\nIn this lesson we decide whether a linear equation has integer solutions, and count the solutions in positive integers.",
    "$6x + 15y = 21$ 有整数解吗？每个 $6x + 15y$ 都是 $\\gcd(6, 15) = 3$ 的倍数，而 $21 = 3 \\cdot 7$ 正是，所以有：由 $6 \\cdot (-2) + 15 \\cdot 1 = 3$，乘以 $7$ 得 $x = -14$，$y = 7$。但 $6x + 15y = 20$ 无解，因为 $3 \\nmid 20$。\n\n检验：$6 \\cdot (-14) + 15 \\cdot 7 = -84 + 105 = 21$。\n\n本课我们判断线性方程是否有整数解，并数出它的正整数解。",
  ),
  prerequisites: ["the-extended-euclidean-algorithm"],
  encompasses: [{ topic: "the-extended-euclidean-algorithm", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "existence-of-integer-solutions",
      title: t("Existence of solutions", "解的存在性"),
      explanation: t(
        "$g = \\gcd(a, b)$ divides $ax + by$ for all integers $x, y$, so a solution needs $g \\mid c$; Bézout's identity shows this is enough. $6x + 15y = 21$ has solutions; $6x + 15y = 20$ does not.\n\n> **Watch out.** The test is whether the gcd divides $c$, not whether $a$ or $b$ does. $6x + 15y = 21$ has solutions although neither $6$ nor $15$ divides $21$.",
        "$g = \\gcd(a, b)$ 整除任意整数 $x, y$ 对应的 $ax + by$，所以有解需要 $g \\mid c$；裴蜀等式说明这也是充分的。$6x + 15y = 21$ 有解，$6x + 15y = 20$ 无解。\n\n> **注意。** 判别的是最大公因数是否整除 $c$，而不是 $a$ 或 $b$ 是否整除 $c$。$6x + 15y = 21$ 有解，尽管 $6$ 和 $15$ 都不整除 $21$。",
      ),
      generate(rng) {
        const g = rng.int(1, 9);
        let a: number;
        let b: number;
        do {
          a = g * rng.int(2, 15);
          b = g * rng.int(2, 15);
        } while (gcd(a, b) !== g);
        const value = rng.bool();
        const c = value ? g * rng.int(1, 30) : g * rng.int(1, 30) + rng.int(1, Math.max(1, g - 1));
        const ok = c % g === 0;
        const [x0, y0] = bezout(a, b);
        const scale = c / g;
        const check = ok
          ? t(
              `$${a}(${x0}) + ${b}(${y0}) = ${g}$; multiplying by $${scale}$ gives $${a} \\cdot ${p(x0 * scale)} + ${b} \\cdot ${p(y0 * scale)} = ${c}$.`,
              `$${a}(${x0}) + ${b}(${y0}) = ${g}$；乘以 $${scale}$ 得 $${a} \\cdot ${p(x0 * scale)} + ${b} \\cdot ${p(y0 * scale)} = ${c}$。`,
            )
          : t(
              `$${a}x + ${b}y = ${g}(${a / g}x + ${b / g}y)$ is always a multiple of $${g}$, while $${c}$ leaves remainder $${c % g}$ on division by $${g}$.`,
              `$${a}x + ${b}y = ${g}(${a / g}x + ${b / g}y)$ 总是 $${g}$ 的倍数，而 $${c}$ 除以 $${g}$ 余 $${c % g}$。`,
            );
        return reasoned(
          oneOf(
            rng,
            t(`Does $${a}x + ${b}y = ${c}$ have a solution in integers?`, `$${a}x + ${b}y = ${c}$ 有整数解吗？`),
            yesNo[ok ? 0 : 1]!,
            [yesNo[ok ? 1 : 0]!],
            walked(
              [
                [["Find the gcd", "求最大公因数"], t(`$\\gcd(${a}, ${b}) = ${g}$.`, `$\\gcd(${a}, ${b}) = ${g}$。`)],
                [
                  ["Test the right side", "检验右边"],
                  ok
                    ? t(
                        `$${c} = ${g} \\cdot ${scale}$, so $${g} \\mid ${c}$ and there are solutions.`,
                        `$${c} = ${g} \\cdot ${scale}$，所以 $${g} \\mid ${c}$，有解。`,
                      )
                    : t(`$${g} \\nmid ${c}$, so there are no solutions.`, `$${g} \\nmid ${c}$，所以无解。`),
                ],
              ],
              check,
            ),
          ),
          [
            ok
              ? [
                  yesNo[1]!.en,
                  `The gcd divides the right side, and then Bézout's identity, scaled, gives a solution.`,
                  "最大公因数整除右边，于是把裴蜀等式放大就得到一个解。",
                ]
              : [
                  yesNo[0]!.en,
                  "Every value of $ax + by$ is a multiple of $\\gcd(a, b)$; compare that with the right side.",
                  "$ax + by$ 的每个值都是 $\\gcd(a, b)$ 的倍数；拿它和右边比较。",
                ],
          ],
        );
      },
    },
    {
      id: "counting-positive-solutions",
      title: t("Counting positive solutions", "统计正整数解"),
      explanation: t(
        "All solutions of a linear Diophantine equation come from one by adding steps along a parameter, so find the parameter values that keep both positive. The solutions of $3x + 5y = 52$ are $x = 4 + 5t$, $y = 8 - 3t$. Both are positive for $t = 0, 1, 2$, so there are three positive solutions: $(4, 8)$, $(9, 5)$, $(14, 2)$.\n\n> **Watch out.** Both unknowns must stay positive. Stop as soon as $y$ would reach $0$ or below: $y = 8 - 3 \\cdot 3 = -1$ is not allowed.",
        "线性丢番图方程的所有解都可以由一个解沿参数逐步得到，所以找出使两者都为正的参数值。$3x + 5y = 52$ 的解为 $x = 4 + 5t$，$y = 8 - 3t$。当 $t = 0, 1, 2$ 时两者都为正，所以有三组正整数解：$(4, 8)$、$(9, 5)$、$(14, 2)$。\n\n> **注意。** 两个未知数都必须保持为正。一旦 $y$ 会变成 $0$ 或负数就停下：$y = 8 - 3 \\cdot 3 = -1$ 是不允许的。",
      ),
      generate(rng) {
        for (;;) {
          const a = rng.int(2, 12);
          const b = rng.int(2, 12);
          const c = rng.int(20, 150);
          const g = gcd(a, b);
          if (a === b || c % g !== 0) continue;
          const sols = range(1, c).filter((x) => c - a * x > 0 && (c - a * x) % b === 0);
          if (sols.length === 0) continue;
          const x1 = sols[0]!;
          const y1 = (c - a * x1) / b;
          const stepX = b / g;
          const stepY = a / g;
          const n = sols.length;
          const lastY = y1 - stepY * (n - 1);
          return numberProblem({
            prompt: t(
              `How many pairs of positive integers $(x, y)$ satisfy $${a}x + ${b}y = ${c}$?`,
              `有多少对正整数 $(x, y)$ 满足 $${a}x + ${b}y = ${c}$？`,
            ),
            answer: n,
            wrong: [n + 1, n - 1],
            mistakes: firstOf([
              why(
                Math.floor(c / (a * b)),
                `Dividing $${c}$ by $${a} \\cdot ${b}$ only estimates the size; list the solutions along the parameter.`,
                `用 $${c}$ 除以 $${a} \\cdot ${b}$ 只是估计大小；要沿参数列出各个解。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the first solution", "找出第一个解"],
                  t(
                    `The smallest positive $x$ that works is $x = ${x1}$, with $y = \\frac{${c} - ${a * x1}}{${b}} = ${y1}$.`,
                    `满足条件的最小正 $x$ 是 $x = ${x1}$，此时 $y = \\frac{${c} - ${a * x1}}{${b}} = ${y1}$。`,
                  ),
                ],
                [
                  ["Step along", "逐步推进"],
                  t(
                    `All solutions are $x = ${x1} + ${stepX}t$, $y = ${y1} - ${stepY}t$. Both stay positive for $t = 0, \\dots, ${n - 1}$: $${n}$ ${n === 1 ? "solution" : "solutions"}.`,
                    `所有解为 $x = ${x1} + ${stepX}t$，$y = ${y1} - ${stepY}t$。当 $t = 0, \\dots, ${n - 1}$ 时两者都为正：共 $${n}$ 组。`,
                  ),
                ],
              ],
              t(
                `The solutions are ${sols.map((x) => `$(${x}, ${(c - a * x) / b})$`).join(", ")}, and one more step would give $y = ${lastY} - ${stepY} = ${lastY - stepY} \\le 0$.`,
                `这些解是 ${sols.map((x) => `$(${x}, ${(c - a * x) / b})$`).join("、")}，再走一步会得到 $y = ${lastY} - ${stepY} = ${lastY - stepY} \\le 0$。`,
              ),
            ),
          });
        }
      },
    },
  ],
};

/** Step is one titled step of a walked solution. */
type Step = [[string, string], Text];

/** Property is a divisibility claim with numbers filled in, its reasoning and the reason the other answer fails. */
interface Property {
  readonly claim: Text;
  readonly value: boolean;
  readonly steps: Step[];
  readonly check: Text;
  readonly reason: [string, string];
}

/** divisibilityProperty picks a concrete divisibility claim. */
function divisibilityProperty(rng: Rng): Property {
  const kind = rng.int(0, 5);
  const d = rng.int(2, 15);
  if (kind === 0)
    return {
      claim: t(`If $${d} \\mid m$ and $m \\mid n$, must $${d} \\mid n$?`, `若 $${d} \\mid m$ 且 $m \\mid n$，是否一定有 $${d} \\mid n$？`),
      value: true,
      steps: [
        [
          ["Write each as a multiple", "写成倍数"],
          t(`$m = ${d}j$ and $n = mk$ for some integers $j$ and $k$.`, `存在整数 $j$、$k$ 使 $m = ${d}j$，$n = mk$。`),
        ],
        [
          ["Substitute", "代入"],
          t(
            `$n = mk = ${d}j \\cdot k = ${d}(jk)$, and $jk$ is an integer, so $${d} \\mid n$.`,
            `$n = mk = ${d}j \\cdot k = ${d}(jk)$，$jk$ 是整数，所以 $${d} \\mid n$。`,
          ),
        ],
      ],
      check: t(
        `Take $m = ${2 * d}$ and $n = ${6 * d}$: $${6 * d} = ${d} \\cdot 6$, a multiple of $${d}$, as claimed.`,
        `取 $m = ${2 * d}$，$n = ${6 * d}$：$${6 * d} = ${d} \\cdot 6$，是 $${d}$ 的倍数，与结论一致。`,
      ),
      reason: [
        "Write both as multiples and substitute: the two factors multiply into one integer.",
        "把两者都写成倍数再代入：两个因子相乘仍是一个整数。",
      ],
    };
  if (kind === 1) {
    const a = rng.int(2, 12);
    const b = rng.pick(range(2, 12).filter((x) => x !== a));
    const g = gcd(a, b);
    const L = lcm(a, b);
    const value = g === 1;
    return {
      claim: t(
        `If $${a} \\mid m$ and $${b} \\mid m$, must $${a * b} \\mid m$?`,
        `若 $${a} \\mid m$ 且 $${b} \\mid m$，是否一定有 $${a * b} \\mid m$？`,
      ),
      value,
      steps: [
        [
          ["Find the least common multiple", "求最小公倍数"],
          t(
            `Every common multiple of $${a}$ and $${b}$ is a multiple of $\\operatorname{lcm}(${a}, ${b}) = \\frac{${a} \\cdot ${b}}{${g}} = ${L}$.`,
            `$${a}$ 与 $${b}$ 的每个公倍数都是 $\\operatorname{lcm}(${a}, ${b}) = \\frac{${a} \\cdot ${b}}{${g}} = ${L}$ 的倍数。`,
          ),
        ],
        value
          ? [
              ["Compare with the product", "与乘积比较"],
              t(
                `$\\gcd(${a}, ${b}) = 1$, so the lcm is the whole product $${a * b}$, and $${a * b} \\mid m$.`,
                `$\\gcd(${a}, ${b}) = 1$，所以最小公倍数就是整个乘积 $${a * b}$，于是 $${a * b} \\mid m$。`,
              ),
            ]
          : [
              ["Find a counterexample", "找反例"],
              t(
                `The lcm $${L}$ is smaller than $${a * b}$, so $m = ${L}$ is divisible by both but not by $${a * b}$.`,
                `最小公倍数 $${L}$ 小于 $${a * b}$，所以 $m = ${L}$ 能被两者整除，却不能被 $${a * b}$ 整除。`,
              ),
            ],
      ],
      check: value
        ? t(
            `The multiples of $${a}$ up to $${a * b}$ are $${range(1, b)
              .map((i) => i * a)
              .join(", ")}$, and only the last is a multiple of $${b}$.`,
            `不超过 $${a * b}$ 的 $${a}$ 的倍数是 $${range(1, b)
              .map((i) => i * a)
              .join(", ")}$，其中只有最后一个是 $${b}$ 的倍数。`,
          )
        : t(
            `$${L} = ${a} \\cdot ${L / a} = ${b} \\cdot ${L / b}$, and $0 < ${L} < ${a * b}$, so $${a * b} \\nmid ${L}$.`,
            `$${L} = ${a} \\cdot ${L / a} = ${b} \\cdot ${L / b}$，且 $0 < ${L} < ${a * b}$，所以 $${a * b} \\nmid ${L}$。`,
          ),
      reason: value
        ? ["With no common factor, the least common multiple is the whole product.", "没有公因数时，最小公倍数就是整个乘积。"]
        : [
            "The two numbers share a factor: try $m$ equal to their least common multiple.",
            "这两个数有公因数：试取 $m$ 为它们的最小公倍数。",
          ],
    };
  }
  if (kind === 2)
    return {
      claim: t(
        `If $${d} \\mid m + n$ and $${d} \\mid m$, must $${d} \\mid n$?`,
        `若 $${d} \\mid m + n$ 且 $${d} \\mid m$，是否一定有 $${d} \\mid n$？`,
      ),
      value: true,
      steps: [
        [
          ["Write each as a multiple", "写成倍数"],
          t(`$m + n = ${d}i$ and $m = ${d}j$ for some integers $i$ and $j$.`, `存在整数 $i$、$j$ 使 $m + n = ${d}i$，$m = ${d}j$。`),
        ],
        [
          ["Subtract", "相减"],
          t(
            `$n = (m + n) - m = ${d}i - ${d}j = ${d}(i - j)$, so $${d} \\mid n$.`,
            `$n = (m + n) - m = ${d}i - ${d}j = ${d}(i - j)$，所以 $${d} \\mid n$。`,
          ),
        ],
      ],
      check: t(
        `Take $m = ${d}$ and $m + n = ${3 * d}$: then $n = ${2 * d} = ${d} \\cdot 2$, a multiple of $${d}$.`,
        `取 $m = ${d}$，$m + n = ${3 * d}$：则 $n = ${2 * d} = ${d} \\cdot 2$，是 $${d}$ 的倍数。`,
      ),
      reason: [
        "Subtract: a difference of two multiples of the same number is again a multiple of it.",
        "相减：同一个数的两个倍数之差仍是它的倍数。",
      ],
    };
  if (kind === 3)
    return {
      claim: t(`If $${d} \\mid m + n$, must $${d} \\mid m$?`, `若 $${d} \\mid m + n$，是否一定有 $${d} \\mid m$？`),
      value: false,
      steps: [
        [
          ["See what is known", "看已知条件"],
          t(
            "Only the sum is a multiple; the parts can each leave remainders that cancel.",
            "只知道和是倍数；两部分各自可以留下余数并相互抵消。",
          ),
        ],
        [
          ["Find a counterexample", "找反例"],
          t(`Take $m = 1$ and $n = ${d - 1}$, so $m + n = ${d}$.`, `取 $m = 1$，$n = ${d - 1}$，则 $m + n = ${d}$。`),
        ],
      ],
      check: t(
        `$${d} \\mid ${d}$, but $1$ is not a multiple of $${d}$, so $${d} \\nmid 1$.`,
        `$${d} \\mid ${d}$，但 $1$ 不是 $${d}$ 的倍数，所以 $${d} \\nmid 1$。`,
      ),
      reason: [
        "Only the sum is known to be a multiple; try small numbers whose remainders cancel.",
        "只知道和是倍数；试一些余数能相互抵消的小数。",
      ],
    };
  if (kind === 4) {
    const k = rng.int(2, 5);
    return {
      claim: t(`If $${d} \\mid m$, must $${d} \\mid m^{${k}}$?`, `若 $${d} \\mid m$，是否一定有 $${d} \\mid m^{${k}}$？`),
      value: true,
      steps: [
        [
          ["Factor the power", "拆开幂"],
          t(
            `$m^{${k}} = m \\cdot m${k === 2 ? "" : `^{${k - 1}}`}$ is a multiple of $m$.`,
            `$m^{${k}} = m \\cdot m${k === 2 ? "" : `^{${k - 1}}`}$ 是 $m$ 的倍数。`,
          ),
        ],
        [
          ["Chain the divisibility", "传递整除"],
          t(
            `$${d} \\mid m$ and $m \\mid m^{${k}}$, so $${d} \\mid m^{${k}}$.`,
            `$${d} \\mid m$ 且 $m \\mid m^{${k}}$，所以 $${d} \\mid m^{${k}}$。`,
          ),
        ],
      ],
      check: t(
        `Take $m = ${d}$: $${d}^{${k}} = ${d} \\cdot ${d}${k === 2 ? "" : `^{${k - 1}}`}$, a multiple of $${d}$.`,
        `取 $m = ${d}$：$${d}^{${k}} = ${d} \\cdot ${d}${k === 2 ? "" : `^{${k - 1}}`}$，是 $${d}$ 的倍数。`,
      ),
      reason: ["A power of $m$ has $m$ itself as a factor.", "$m$ 的幂以 $m$ 本身为因数。"],
    };
  }
  const c = rng.int(2, 9);
  return {
    claim: t(`If $${d} \\mid m$, must $${d * c} \\mid ${c}m$?`, `若 $${d} \\mid m$，是否一定有 $${d * c} \\mid ${c}m$？`),
    value: true,
    steps: [
      [["Write m as a multiple", "把 m 写成倍数"], t(`$m = ${d}j$ for some integer $j$.`, `存在整数 $j$ 使 $m = ${d}j$。`)],
      [
        ["Multiply by " + c, `乘以 ${c}`],
        t(
          `$${c}m = ${c} \\cdot ${d}j = ${d * c}j$, so $${d * c} \\mid ${c}m$.`,
          `$${c}m = ${c} \\cdot ${d}j = ${d * c}j$，所以 $${d * c} \\mid ${c}m$。`,
        ),
      ],
    ],
    check: t(
      `Take $m = ${3 * d}$: $${c} \\cdot ${3 * d} = ${3 * c * d} = ${d * c} \\cdot 3$.`,
      `取 $m = ${3 * d}$：$${c} \\cdot ${3 * d} = ${3 * c * d} = ${d * c} \\cdot 3$。`,
    ),
    reason: ["Multiply both sides of $m = dj$ by the same number.", "把 $m = dj$ 两边乘以同一个数。"],
  };
}

/** propertiesOfIntegerDivisibility uses transitivity, combinations and lcms. */
export const propertiesOfIntegerDivisibility: TopicDef = {
  id: "properties-of-integer-divisibility",
  title: t("Properties of Integer Divisibility", "整除的性质"),
  summary: t(
    "Divisibility is transitive, passes to linear combinations, and a | m, b | m imply lcm(a, b) | m.",
    "整除具有传递性，可传递给线性组合；并且 a | m、b | m 推出 lcm(a, b) | m。",
  ),
  intro: t(
    "If $2 \\mid m$ and $3 \\mid m$, must $6 \\mid m$? Every common multiple of $2$ and $3$ is a multiple of their least common multiple, and $2$ and $3$ share no factor, so $\\operatorname{lcm}(2, 3) = 6$. So yes, $6 \\mid m$.\n\nCheck: the common multiples of $2$ and $3$ up to $30$ are $6, 12, 18, 24, 30$, each a multiple of $6$.\n\nIn this lesson we decide which divisibility claims hold by writing numbers as multiples, refute the false ones with small counterexamples, and find least common multiples.",
    "若 $2 \\mid m$ 且 $3 \\mid m$，是否一定有 $6 \\mid m$？$2$ 与 $3$ 的每个公倍数都是它们最小公倍数的倍数，而 $2$ 与 $3$ 没有公因数，所以 $\\operatorname{lcm}(2, 3) = 6$。因此 $6 \\mid m$ 成立。\n\n检验：不超过 $30$ 的 $2$ 与 $3$ 的公倍数是 $6, 12, 18, 24, 30$，每个都是 $6$ 的倍数。\n\n本课我们通过把数写成倍数来判断哪些整除命题成立，用小的反例否定不成立的命题，并求最小公倍数。",
  ),
  prerequisites: ["integer-divisibility", "least-common-multiple"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "which-divisibility-claims-hold",
      title: t("Which claims hold", "哪些命题成立"),
      explanation: t(
        "Each true divisibility claim follows from writing numbers as multiples, and each false one is shown by a small counterexample. True: if $a \\mid b$ and $b \\mid c$ then $a \\mid c$; if $a \\mid b$ and $a \\mid c$ then $a \\mid bx + cy$. False in general: $a \\mid b + c \\Rightarrow a \\mid b$, and $a \\mid m, b \\mid m \\Rightarrow ab \\mid m$ (try $4 \\mid 12$, $6 \\mid 12$, $24 \\nmid 12$).\n\n> **Watch out.** $a \\mid m$ and $b \\mid m$ give only $\\operatorname{lcm}(a, b) \\mid m$. The product $ab$ divides $m$ only when $\\gcd(a, b) = 1$.",
        "每个成立的整除命题都可以通过把数写成倍数来证明，每个不成立的命题都可以用一个小的反例说明。成立：若 $a \\mid b$ 且 $b \\mid c$，则 $a \\mid c$；若 $a \\mid b$ 且 $a \\mid c$，则 $a \\mid bx + cy$。一般不成立：$a \\mid b + c \\Rightarrow a \\mid b$，以及 $a \\mid m, b \\mid m \\Rightarrow ab \\mid m$（试 $4 \\mid 12$，$6 \\mid 12$，$24 \\nmid 12$）。\n\n> **注意。** 由 $a \\mid m$ 和 $b \\mid m$ 只能得到 $\\operatorname{lcm}(a, b) \\mid m$。只有当 $\\gcd(a, b) = 1$ 时，乘积 $ab$ 才整除 $m$。",
      ),
      generate(rng) {
        const p = divisibilityProperty(rng);
        const other = yesNo[p.value ? 1 : 0]!;
        return reasoned(oneOf(rng, p.claim, yesNo[p.value ? 0 : 1]!, [other], walked(p.steps, p.check)), [
          [other.en, p.reason[0], p.reason[1]],
        ]);
      },
    },
    {
      id: "smallest-common-multiples",
      title: t("Smallest common multiples", "最小公倍数"),
      explanation: t(
        "Every common multiple of two numbers is a multiple of their least common multiple, so the least common multiple is the smallest positive one. If $a \\mid m$ and $b \\mid m$ for a positive integer $m$, then $\\operatorname{lcm}(a, b) \\mid m$, so the smallest such $m$ is $\\operatorname{lcm}(a, b) = ab/\\gcd(a, b)$.\n\n> **Watch out.** The product $ab$ is always a common multiple, but it is the least one only when $a$ and $b$ share no factor.",
        "两个数的每个公倍数都是它们最小公倍数的倍数，所以最小公倍数是最小的正公倍数。若正整数 $m$ 满足 $a \\mid m$ 且 $b \\mid m$，则 $\\operatorname{lcm}(a, b) \\mid m$，所以这样的最小 $m$ 是 $\\operatorname{lcm}(a, b) = ab/\\gcd(a, b)$。\n\n> **注意。** 乘积 $ab$ 总是公倍数，但只有当 $a$ 与 $b$ 没有公因数时它才是最小的。",
      ),
      generate(rng) {
        const a = rng.int(4, 30);
        const b = rng.int(4, 30);
        const c = rng.bool() ? rng.int(2, 10) : 1;
        const g = gcd(a, b);
        const L1 = lcm(a, b);
        const L = lcm(L1, c);
        const h = gcd(L1, c);
        const steps: Step[] = [
          [
            ["Combine the first two", "合并前两个数"],
            t(
              `$\\gcd(${a}, ${b}) = ${g}$, so $\\operatorname{lcm}(${a}, ${b}) = \\frac{${a} \\cdot ${b}}{${g}} = ${L1}$.`,
              `$\\gcd(${a}, ${b}) = ${g}$，所以 $\\operatorname{lcm}(${a}, ${b}) = \\frac{${a} \\cdot ${b}}{${g}} = ${L1}$。`,
            ),
          ],
          c === 1
            ? [
                ["Take the least", "取最小者"],
                t(
                  `Every common multiple is a multiple of $${L1}$, so the smallest positive one is $m = ${L1}$.`,
                  `每个公倍数都是 $${L1}$ 的倍数，所以最小的正公倍数是 $m = ${L1}$。`,
                ),
              ]
            : [
                [`Bring in ${c}`, `加入 ${c}`],
                t(
                  `$\\gcd(${L1}, ${c}) = ${h}$, so $m = \\operatorname{lcm}(${L1}, ${c}) = \\frac{${L1} \\cdot ${c}}{${h}} = ${L}$.`,
                  `$\\gcd(${L1}, ${c}) = ${h}$，所以 $m = \\operatorname{lcm}(${L1}, ${c}) = \\frac{${L1} \\cdot ${c}}{${h}} = ${L}$。`,
                ),
              ],
        ];
        const parts = (c === 1 ? [a, b] : [a, b, c]).map((x) => `${L} = ${x} \\cdot ${L / x}`).join(", \\; ");
        return numberProblem({
          prompt: t(
            `What is the smallest positive integer $m$ divisible by ${c === 1 ? `$${a}$ and $${b}$` : `$${a}$, $${b}$ and $${c}$`}?`,
            `能被 ${c === 1 ? `$${a}$ 和 $${b}$` : `$${a}$、$${b}$ 和 $${c}$`} 整除的最小正整数 $m$ 是多少？`,
          ),
          answer: L,
          wrong: [L * 2],
          mistakes: firstOf([
            why(
              a * b * c,
              "The product is a common multiple, but not the least one when the numbers share a factor.",
              "乘积是公倍数，但当这些数有公因数时它不是最小的。",
            ),
            why(
              g,
              "That is the greatest common divisor, which divides the numbers; the question asks for a number they divide.",
              "这是最大公因数，它整除这些数；题目要的是被这些数整除的数。",
            ),
          ]),
          solution: walked(steps, t(`$${parts}$, so $${L}$ is divisible by each.`, `$${parts}$，所以 $${L}$ 能被每个数整除。`)),
        });
      },
    },
  ],
};

/** isSquarefree tests whether no prime squared divides n. */
const isSquarefree = (n: number) => factorize(n).every(([, e]) => e === 1);

/** texOf writes a factorization such as 2^3 · 5. */
const texOf = (f: readonly (readonly [number, number])[]) => f.map(([q, e]) => (e === 1 ? `${q}` : `${q}^{${e}}`)).join(" \\cdot ");

/** propertiesOfPrimeDivisibility applies Euclid's lemma. */
export const propertiesOfPrimeDivisibility: TopicDef = {
  id: "properties-of-prime-divisibility",
  title: t("Properties of Prime Divisibility", "素数整除的性质"),
  summary: t(
    "Euclid's lemma: if a prime p divides mn, then p | m or p | n. This fails for composite divisors.",
    "欧几里得引理：若素数 p 整除 mn，则 p | m 或 p | n。对合数除数不成立。",
  ),
  intro: t(
    "Suppose $7 \\mid 15n$. Must $7 \\mid n$? The divisor $7$ is prime and $7 \\nmid 15$, so by Euclid's lemma it divides the other factor: $7 \\mid n$.\n\nCheck: for $n = 1, \\dots, 6$ the products $15, 30, 45, 60, 75, 90$ leave remainders $1, 2, 3, 4, 5, 6$ on division by $7$, and $n = 7$ gives $105 = 7 \\cdot 15$.\n\nIn this lesson we use Euclid's lemma for prime divisors, build counterexamples for composite ones, and find the smallest $m$ with $d \\mid m^k$.",
    "设 $7 \\mid 15n$。是否一定有 $7 \\mid n$？除数 $7$ 是素数，且 $7 \\nmid 15$，所以由欧几里得引理，它整除另一个因数：$7 \\mid n$。\n\n检验：$n = 1, \\dots, 6$ 时乘积 $15, 30, 45, 60, 75, 90$ 除以 $7$ 的余数是 $1, 2, 3, 4, 5, 6$，而 $n = 7$ 时 $105 = 7 \\cdot 15$。\n\n本课我们对素数除数使用欧几里得引理，为合数除数构造反例，并求满足 $d \\mid m^k$ 的最小 $m$。",
  ),
  prerequisites: ["properties-of-integer-divisibility", "linear-diophantine-equations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "euclids-lemma",
      title: t("Euclid's lemma", "欧几里得引理"),
      explanation: t(
        "If $p$ is prime, $p \\mid mn$ and $p \\nmid m$, then $\\gcd(p, m) = 1$, so $px + my = 1$ and $n = pnx + mny$ is divisible by $p$. For composite $d$ it fails: $6 \\mid 4 \\cdot 3$ but $6 \\nmid 4$ and $6 \\nmid 3$.\n\n> **Watch out.** The lemma needs a prime. A composite divisor can split its prime factors between $m$ and $n$, as $6 = 2 \\cdot 3$ does in $6 \\mid 4 \\cdot 3$.",
        "若 $p$ 是素数，$p \\mid mn$ 且 $p \\nmid m$，则 $\\gcd(p, m) = 1$，于是 $px + my = 1$，$n = pnx + mny$ 能被 $p$ 整除。对合数 $d$ 不成立：$6 \\mid 4 \\cdot 3$，但 $6 \\nmid 4$ 且 $6 \\nmid 3$。\n\n> **注意。** 引理要求除数是素数。合数除数可以把它的素因数分给 $m$ 和 $n$，就像 $6 \\mid 4 \\cdot 3$ 中的 $6 = 2 \\cdot 3$ 那样。",
      ),
      generate(rng) {
        const d = rng.int(2, 40);
        const power = rng.bool();
        const k = rng.int(2, 4);
        const value = power ? isSquarefree(d) : isPrimeNumber(d);
        const f = factorize(d);
        const tex = texOf(f);
        const claim = power
          ? t(`If $${d} \\mid m^{${k}}$, must $${d} \\mid m$?`, `若 $${d} \\mid m^{${k}}$，是否一定有 $${d} \\mid m$？`)
          : t(
              `If $${d} \\mid mn$ and $${d} \\nmid m$, must $${d} \\mid n$?`,
              `若 $${d} \\mid mn$ 且 $${d} \\nmid m$，是否一定有 $${d} \\mid n$？`,
            );
        let steps: Step[];
        let check: Text;
        let reason: [string, string];
        if (!power && value) {
          steps = [
            [
              ["Check that the divisor is prime", "确认除数是素数"],
              t(
                `$${d}$ has no divisor strictly between $1$ and $${d}$, so it is prime.`,
                `$${d}$ 在 $1$ 与 $${d}$ 之间没有因数，所以它是素数。`,
              ),
            ],
            [
              ["Apply Euclid's lemma", "应用欧几里得引理"],
              t(`$${d} \\mid mn$ and $${d} \\nmid m$, so $${d} \\mid n$.`, `$${d} \\mid mn$ 且 $${d} \\nmid m$，所以 $${d} \\mid n$。`),
            ],
          ];
          check = t(
            `Take $m = ${d + 1}$: $${d + 1}n = ${d}n + n$, so $${d} \\mid ${d + 1}n$ exactly when $${d} \\mid n$.`,
            `取 $m = ${d + 1}$：$${d + 1}n = ${d}n + n$，所以 $${d} \\mid ${d + 1}n$ 当且仅当 $${d} \\mid n$。`,
          );
          reason = [
            "For a prime divisor, $p \\mid mn$ forces $p \\mid m$ or $p \\mid n$: this is Euclid's lemma.",
            "对素数除数，$p \\mid mn$ 迫使 $p \\mid m$ 或 $p \\mid n$：这就是欧几里得引理。",
          ];
        } else if (!power) {
          const q = f[0]![0];
          const n = d / q;
          steps = [
            [["Factor the divisor", "分解除数"], t(`$${d} = ${q} \\cdot ${n}$ is composite.`, `$${d} = ${q} \\cdot ${n}$ 是合数。`)],
            [
              ["Split the factors", "拆分因数"],
              t(`Give one factor to each: $m = ${q}$ and $n = ${n}$.`, `把两个因数分别给出：$m = ${q}$，$n = ${n}$。`),
            ],
          ];
          check = t(
            `$mn = ${d}$, so $${d} \\mid mn$; but $${q}$ and $${n}$ are positive and less than $${d}$, so $${d}$ divides neither.`,
            `$mn = ${d}$，所以 $${d} \\mid mn$；但 $${q}$ 和 $${n}$ 都是小于 $${d}$ 的正数，所以 $${d}$ 不整除其中任何一个。`,
          );
          reason = ["A composite divisor can split its prime factors between $m$ and $n$.", "合数除数可以把它的素因数分给 $m$ 和 $n$。"];
        } else if (value) {
          const q = f[f.length - 1]![0];
          const rest = d / q;
          steps = [
            [
              ["Factor the divisor", "分解除数"],
              t(`$${d} = ${tex}$, with each prime appearing once.`, `$${d} = ${tex}$，每个素数只出现一次。`),
            ],
            [
              ["Apply Euclid's lemma to each prime", "对每个素数用欧几里得引理"],
              t(
                `Each prime of $${d}$ divides $m^{${k}} = m \\cdots m$, so it divides $m$.`,
                `$${d}$ 的每个素数都整除 $m^{${k}} = m \\cdots m$，所以它整除 $m$。`,
              ),
            ],
            [
              ["Multiply the primes", "把素数相乘"],
              t(
                `Distinct primes that each divide $m$ have their product dividing $m$, so $${d} \\mid m$.`,
                `各自整除 $m$ 的不同素数，其乘积也整除 $m$，所以 $${d} \\mid m$。`,
              ),
            ],
          ];
          check = t(
            `Leaving a prime out of $m$ leaves it out of $m^{${k}}$: with $m = ${rest}$, $${rest}^{${k}} = ${rest ** k}$ is not divisible by $${q}$, so no counterexample can drop a prime.`,
            `$m$ 中缺一个素数，$m^{${k}}$ 中也缺它：取 $m = ${rest}$，$${rest}^{${k}} = ${rest ** k}$ 不能被 $${q}$ 整除，所以反例不可能少一个素数。`,
          );
          reason = [
            "Each prime of the divisor appears once, and a prime dividing $m^k$ divides $m$.",
            "除数的每个素数只出现一次，而整除 $m^k$ 的素数也整除 $m$。",
          ];
        } else {
          const m = f.reduce((acc, [q, e]) => acc * q ** Math.ceil(e / k), 1);
          steps = [
            [["Factor the divisor", "分解除数"], t(`$${d} = ${tex}$ has a repeated prime.`, `$${d} = ${tex}$ 含有重复的素数。`)],
            [
              ["Use a smaller power in m", "在 m 中用较低的幂"],
              t(
                `Raising to the power $${k}$ multiplies each exponent by $${k}$, so $m = ${m}$ already gives enough of every prime.`,
                `升到 $${k}$ 次幂会把每个指数乘以 $${k}$，所以 $m = ${m}$ 已经提供了足够的每个素数。`,
              ),
            ],
          ];
          check = t(
            `$${m}^{${k}} = ${m ** k} = ${d} \\cdot ${m ** k / d}$, but $0 < ${m} < ${d}$, so $${d} \\nmid ${m}$.`,
            `$${m}^{${k}} = ${m ** k} = ${d} \\cdot ${m ** k / d}$，但 $0 < ${m} < ${d}$，所以 $${d} \\nmid ${m}$。`,
          );
          reason = [
            "A repeated prime in the divisor can be reached in $m^k$ by a smaller power in $m$.",
            "除数中重复的素数，可以由 $m$ 中较低的幂在 $m^k$ 里凑够。",
          ];
        }
        const other = yesNo[value ? 1 : 0]!;
        return reasoned(oneOf(rng, claim, yesNo[value ? 0 : 1]!, [other], walked(steps, check)), [[other.en, reason[0], reason[1]]]);
      },
    },
    {
      id: "smallest-m-with-d-dividing-a-power",
      title: t("Divisors of powers", "幂的因数"),
      explanation: t(
        "Raising a number to a power multiplies the exponent of every prime in it, so each prime must appear often enough to reach the divisor's exponent. $d \\mid m^k$ exactly when each prime $p^e$ in $d$ has $p^{\\lceil e/k \\rceil} \\mid m$. The smallest positive $m$ with $72 = 2^3 \\cdot 3^2 \\mid m^2$ is $2^2 \\cdot 3 = 12$.\n\n> **Watch out.** Round each $\\frac{e}{k}$ up, not down: $2^3 \\mid m^2$ needs $2^2 \\mid m$, because $2^1$ in $m$ gives only $2^2$ in $m^2$.",
        "把一个数升幂会使其中每个素数的指数相乘，所以每个素数必须出现足够多次，才能达到因数中的指数。$d \\mid m^k$ 当且仅当 $d$ 中每个素数幂 $p^e$ 都满足 $p^{\\lceil e/k \\rceil} \\mid m$。满足 $72 = 2^3 \\cdot 3^2 \\mid m^2$ 的最小正整数 $m$ 是 $2^2 \\cdot 3 = 12$。\n\n> **注意。** 每个 $\\frac{e}{k}$ 要向上取整，而不是向下：$2^3 \\mid m^2$ 要求 $2^2 \\mid m$，因为 $m$ 中的 $2^1$ 在 $m^2$ 中只给出 $2^2$。",
      ),
      generate(rng) {
        let d: number;
        do d = rng.int(8, 400);
        while (isSquarefree(d));
        const k = rng.int(2, 3);
        const f = factorize(d);
        const m = f.reduce((acc, [q, e]) => acc * q ** Math.ceil(e / k), 1);
        const down = f.reduce((acc, [q, e]) => acc * q ** Math.floor(e / k), 1);
        const rad = f.reduce((acc, [q]) => acc * q, 1);
        const each = f.map(([q, e]) => `${q}^{\\lceil ${e}/${k} \\rceil} = ${q}^{${Math.ceil(e / k)}}`).join(", \\; ");
        return numberProblem({
          prompt: t(
            `What is the smallest positive integer $m$ such that $${d} \\mid m^{${k}}$?`,
            `使 $${d} \\mid m^{${k}}$ 的最小正整数 $m$ 是多少？`,
          ),
          answer: m,
          wrong: [Math.round(Math.sqrt(d)), m * rad],
          mistakes: firstOf([
            why(
              d,
              `$m = ${d}$ works, but a smaller $m$ already gives enough of each prime in $m^{${k}}$.`,
              `$m = ${d}$ 可以，但更小的 $m$ 已经能在 $m^{${k}}$ 中提供足够的每个素数。`,
            ),
            why(
              down,
              "That rounds the exponents down; each must be rounded up to reach the divisor.",
              "这是把指数向下取整了；每个指数都要向上取整才能达到除数。",
            ),
            why(
              rad,
              "That takes each prime once; a prime with a high exponent may need a higher power in $m$.",
              "这是每个素数只取一次；指数较高的素数在 $m$ 中可能需要更高的幂。",
            ),
          ]),
          solution: walked(
            [
              [["Factor the divisor", "分解除数"], t(`$${d} = ${texOf(f)}$.`, `$${d} = ${texOf(f)}$。`)],
              [["Round each exponent up", "每个指数向上取整"], t(`$${each}$, so $m = ${m}$.`, `$${each}$，所以 $m = ${m}$。`)],
            ],
            t(`$${m}^{${k}} = ${m ** k} = ${d} \\cdot ${m ** k / d}$.`, `$${m}^{${k}} = ${m ** k} = ${d} \\cdot ${m ** k / d}$。`),
          ),
        });
      },
    },
  ],
};

/** mathematicalInduction proves statements for all n ≥ n₀. */
export const mathematicalInduction: TopicDef = {
  id: "mathematical-induction",
  title: t("Mathematical Induction", "数学归纳法"),
  summary: t(
    "Prove P(n₀), then prove P(k) ⇒ P(k + 1) for every k ≥ n₀; together these prove P(n) for all n ≥ n₀.",
    "证明 P(n₀)，再对每个 k ≥ n₀ 证明 P(k) ⇒ P(k + 1)；二者合起来证明了对所有 n ≥ n₀，P(n) 成立。",
  ),
  intro: t(
    "Prove $1 + 3 + 5 + \\dots + (2n - 1) = n^2$ for every $n \\ge 1$. Base case: for $n = 1$ the sum is $1 = 1^2$. Inductive step: assume the sum up to $2k - 1$ is $k^2$; adding the next odd number $2k + 1$ gives $k^2 + 2k + 1 = (k + 1)^2$. So the formula passes from each $n$ to the next, starting at $1$.\n\nCheck: for $n = 4$, $1 + 3 + 5 + 7 = 16 = 4^2$.\n\nIn this lesson we set up the base case and the inductive step of an induction proof, and find the term that the step adds to a sum.",
    "证明对每个 $n \\ge 1$ 有 $1 + 3 + 5 + \\dots + (2n - 1) = n^2$。基础步骤：$n = 1$ 时和为 $1 = 1^2$。归纳步骤：假设加到 $2k - 1$ 的和是 $k^2$；再加上下一个奇数 $2k + 1$ 得 $k^2 + 2k + 1 = (k + 1)^2$。所以公式从 $1$ 开始，由每个 $n$ 传到下一个。\n\n检验：$n = 4$ 时，$1 + 3 + 5 + 7 = 16 = 4^2$。\n\n本课我们建立归纳证明的基础步骤与归纳步骤，并找出归纳步骤给和式新增的那一项。",
  ),
  prerequisites: ["direct-proof", "sigma-notation"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "base-case-and-inductive-step",
      title: t("Base case and inductive step", "基础步骤与归纳步骤"),
      explanation: t(
        "To prove $P(n)$ for all $n \\ge 1$: check the **base case** $P(1)$, then in the **inductive step** assume $P(k)$ (the inductive hypothesis) for an arbitrary $k \\ge 1$ and prove $P(k + 1)$.\n\n> **Watch out.** The inductive step assumes the statement for one arbitrary $k$, not for all $n$. Assuming it for all $n$ assumes what is to be proved.",
        "要对所有 $n \\ge 1$ 证明 $P(n)$：先验证**基础步骤** $P(1)$，再在**归纳步骤**中对任意 $k \\ge 1$ 假设 $P(k)$（归纳假设），证明 $P(k + 1)$。\n\n> **注意。** 归纳步骤只对任意一个 $k$ 假设命题成立，而不是对所有 $n$。假设对所有 $n$ 成立就等于假设了要证明的结论。",
      ),
      generate(rng) {
        const n0 = rng.int(0, 6);
        const a = rng.int(2, 9);
        const c = rng.int(1, Math.min(20, a ** n0 - n0));
        const stmt = rng.pick([
          (n: string) => `${a}^{${n}} \\ge ${n} + ${c}`,
          (n: string) => `${a} \\mid ${a + 1}^{${n}} - 1`,
          (n: string) => `\\textstyle\\sum_{i=1}^{${n}} ${a}i = ${a}\\frac{${n === "k + 1" ? "(k + 1)(k + 2)" : `${n}(${n} + 1)`}}{2}`,
        ]);
        const right = t(
          `Assume $${stmt("k")}$ for some $k \\ge ${n0}$; prove $${stmt("k + 1")}$.`,
          `对某个 $k \\ge ${n0}$ 假设 $${stmt("k")}$；证明 $${stmt("k + 1")}$。`,
        );
        const back = t(`Assume $${stmt("k + 1")}$; prove $${stmt("k")}$.`, `假设 $${stmt("k + 1")}$；证明 $${stmt("k")}$。`);
        const base = t(`Prove $${stmt(`${n0}`)}$.`, `证明 $${stmt(`${n0}`)}$。`);
        const all = t(
          `Assume $${stmt("n")}$ for all $n \\ge ${n0}$; prove $${stmt("k + 1")}$.`,
          `假设对所有 $n \\ge ${n0}$ 有 $${stmt("n")}$；证明 $${stmt("k + 1")}$。`,
        );
        return reasoned(
          oneOf(
            rng,
            t(
              `To prove $${stmt("n")}$ for all integers $n \\ge ${n0}$ by induction, what does the inductive step do?`,
              `用数学归纳法证明对所有整数 $n \\ge ${n0}$ 有 $${stmt("n")}$，归纳步骤要做什么？`,
            ),
            right,
            [back, base, all],
            walked(
              [
                [
                  ["Name the two parts", "说出两个部分"],
                  t(
                    `The base case proves the statement at $n = ${n0}$; the inductive step links each $k$ to the next value $k + 1$.`,
                    `基础步骤证明 $n = ${n0}$ 时命题成立；归纳步骤把每个 $k$ 与下一个值 $k + 1$ 连起来。`,
                  ),
                ],
                [
                  ["State the step", "写出归纳步骤"],
                  t(
                    `Assume the statement for one arbitrary $k \\ge ${n0}$ and prove it for $k + 1$.`,
                    `对任意一个 $k \\ge ${n0}$ 假设命题成立，证明它对 $k + 1$ 成立。`,
                  ),
                ],
              ],
              t(
                `Together the parts reach every $n$: the base case gives $${n0}$, and the step then gives $${n0 + 1}$, $${n0 + 2}$, and so on.`,
                `两部分合起来覆盖每个 $n$：基础步骤给出 $${n0}$，归纳步骤接着给出 $${n0 + 1}$、$${n0 + 2}$，依此类推。`,
              ),
            ),
          ),
          [
            [
              back.en,
              "That runs the step backwards: it proves the smaller case from the larger one.",
              "这把步骤反过来了：它由较大的情形证明较小的情形。",
            ],
            [base.en, "That is the base case, not the inductive step.", "这是基础步骤，不是归纳步骤。"],
            [all.en, "Assuming the statement for all $n$ assumes what is to be proved.", "假设对所有 $n$ 成立，就是假设了要证明的结论。"],
          ],
        );
      },
    },
    {
      id: "the-inductive-step-for-sums",
      title: t("The inductive step for sums", "求和公式的归纳步骤"),
      explanation: t(
        "The sum up to the next term is the sum up to the current term plus one more term, so the hypothesis replaces the first part. For $\\sum_{i=1}^{n} (2i - 1) = n^2$: assume $\\sum_{i=1}^{k} (2i - 1) = k^2$. Then $\\sum_{i=1}^{k+1} (2i - 1) = k^2 + (2(k + 1) - 1) = k^2 + 2k + 1 = (k + 1)^2$. The new term is the summand at $i = k + 1$.\n\n> **Watch out.** The new term is the summand at $i = k + 1$, not at $i = k$: substitute $k + 1$ for every $i$.",
        "到下一项的和等于到当前项的和再加一项，所以归纳假设可以替换前一部分。对 $\\sum_{i=1}^{n} (2i - 1) = n^2$：假设 $\\sum_{i=1}^{k} (2i - 1) = k^2$。则 $\\sum_{i=1}^{k+1} (2i - 1) = k^2 + (2(k + 1) - 1) = k^2 + 2k + 1 = (k + 1)^2$。新增的项是 $i = k + 1$ 时的求和项。\n\n> **注意。** 新增的项是 $i = k + 1$ 时的求和项，而不是 $i = k$ 时的：要把每个 $i$ 都换成 $k + 1$。",
      ),
      generate(rng) {
        const a = rng.int(1, 9);
        const b = rng.int(1, 9) * (rng.bool() ? 1 : -1);
        const co = a === 1 ? "" : `${a}`;
        const term = (i: string) => `${co}${i}${signed(b)}`;
        const ak = `${co}k`;
        const right = `${ak}${signed(a + b)}`;
        const wrongs: [string, string, string][] = [
          [
            `${ak}${signed(b)}`,
            "That is the summand at $i = k$, already inside the first $k$ terms.",
            "这是 $i = k$ 时的求和项，已经包含在前 $k$ 项里。",
          ],
          [`${ak}${signed(a)}`, `That drops the constant $${b}$ of the summand.`, `这丢掉了求和项中的常数 $${b}$。`],
          [
            `${ak}${signed(2 * a + b)}`,
            "That is the summand at $i = k + 2$, one term too far.",
            "这是 $i = k + 2$ 时的求和项，多走了一项。",
          ],
          [
            `${co}(k + 1)k`,
            "That multiplies instead of adding one term: the sums differ by a single summand.",
            "这是相乘而不是加一项：两个和只相差一个求和项。",
          ],
        ];
        return reasoned(
          oneOf(
            rng,
            t(
              `In proving a formula for $\\sum_{i=1}^{n} (${term("i")})$ by induction, $\\sum_{i=1}^{k+1} (${term("i")})$ equals $\\sum_{i=1}^{k} (${term("i")})$ plus what?`,
              `用归纳法证明 $\\sum_{i=1}^{n} (${term("i")})$ 的公式时，$\\sum_{i=1}^{k+1} (${term("i")})$ 等于 $\\sum_{i=1}^{k} (${term("i")})$ 加上什么？`,
            ),
            math(right),
            wrongs.map(([w]) => math(w)),
            walked(
              [
                [
                  ["Split off the last term", "分出最后一项"],
                  t(
                    "The sum up to $k + 1$ is the sum up to $k$ plus the summand at $i = k + 1$.",
                    "加到 $k + 1$ 的和等于加到 $k$ 的和再加上 $i = k + 1$ 时的求和项。",
                  ),
                ],
                [["Substitute", "代入"], t(`$${term("(k + 1)")} = ${right}$.`, `$${term("(k + 1)")} = ${right}$。`)],
              ],
              t(
                `At $k = 1$ the new term is the summand at $i = 2$: $${a} \\cdot 2${signed(b)} = ${2 * a + b}$, and the answer gives $${a} \\cdot 1${signed(a + b)} = ${2 * a + b}$.`,
                `$k = 1$ 时新增的是 $i = 2$ 的求和项：$${a} \\cdot 2${signed(b)} = ${2 * a + b}$，而答案给出 $${a} \\cdot 1${signed(a + b)} = ${2 * a + b}$。`,
              ),
            ),
          ),
          wrongs.map(([w, en, zh]) => [`$${w}$`, en, zh]),
        );
      },
    },
  ],
};

/** firstFrom finds the least N ≤ limit such that f holds for every n from N to limit. */
function firstFrom(f: (n: number) => boolean, from: number, limit: number): number {
  let N = limit;
  while (N - 1 >= from && f(N - 1)) N--;
  return N;
}

/** provingInequalitiesUsingInduction proves inequalities like 2ⁿ > n² for large n. */
export const provingInequalitiesUsingInduction: TopicDef = {
  id: "proving-inequalities-using-induction",
  title: t("Proving Inequalities Using Induction", "用归纳法证明不等式"),
  summary: t(
    "Inequalities like 2ⁿ > n² hold from some n₀ on; the inductive step chains the hypothesis with an estimate.",
    "像 2ⁿ > n² 这样的不等式从某个 n₀ 起成立；归纳步骤把归纳假设与一个估计串联起来。",
  ),
  intro: t(
    "Where does $2^n > n^2$ start to hold for good? Try small values: $n = 4$ gives $16 > 16$, which is false, and $n = 5$ gives $32 > 25$, which is true. From $k \\ge 5$ on, each step doubles the left side, while the right side grows by the factor $\\left(\\frac{k + 1}{k}\\right)^2 \\le 1.44$. So an induction proof starts at $n_0 = 5$.\n\nCheck: $n = 6$ gives $64 > 36$, and $n = 7$ gives $128 > 49$.\n\nIn this lesson we find where an inequality starts to hold and chain the inductive hypothesis with an estimate to prove it from there.",
    "$2^n > n^2$ 从哪里开始一直成立？试几个小的值：$n = 4$ 时 $16 > 16$ 不成立，$n = 5$ 时 $32 > 25$ 成立。从 $k \\ge 5$ 起，每一步左边翻倍，而右边只乘以 $\\left(\\frac{k + 1}{k}\\right)^2 \\le 1.44$。所以归纳证明从 $n_0 = 5$ 开始。\n\n检验：$n = 6$ 时 $64 > 36$，$n = 7$ 时 $128 > 49$。\n\n本课我们找出不等式从哪里开始成立，并把归纳假设与一个估计串联起来，从那里证明它。",
  ),
  prerequisites: ["mathematical-induction"],
  encompasses: [{ topic: "mathematical-induction", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "finding-the-base-case",
      title: t("Finding the base case", "确定起点"),
      explanation: t(
        "Induction needs a starting value where the statement holds and from which every step works, so check small values to find where it begins. $2^n > n^2$ fails for $n = 2, 3, 4$ but holds for $n = 5$ ($32 > 25$) and every larger $n$, so an induction proof starts at $n_0 = 5$.\n\n> **Watch out.** The first $n$ where an inequality holds need not be the start: $2^1 > 1^2$, yet $n = 2$ fails. The start is where it holds from then on.",
        "归纳法需要一个使命题成立、并且由此每一步都成立的起点，所以要检查较小的值，找出从哪里开始。$2^n > n^2$ 在 $n = 2, 3, 4$ 时不成立，但在 $n = 5$ 时成立（$32 > 25$），且对更大的 $n$ 都成立，所以归纳证明从 $n_0 = 5$ 开始。\n\n> **注意。** 不等式第一次成立的 $n$ 不一定是起点：$2^1 > 1^2$，但 $n = 2$ 时不成立。起点是从此以后一直成立的地方。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        let tex: string;
        let L: (n: number) => number;
        let R: (n: number) => number;
        if (kind === 0) {
          const a = rng.int(2, 3);
          const c = rng.int(3, 60);
          tex = `${a}^n > ${c}n`;
          L = (n) => a ** n;
          R = (n) => c * n;
        } else if (kind === 1) {
          // These pairs fail for some n, so that there is a starting value to find.
          const [a, k] = rng.pick([
            [2, 2],
            [2, 3],
            [2, 4],
            [3, 3],
            [3, 4],
          ] as const);
          tex = `${a}^n > n^{${k}}`;
          L = (n) => a ** n;
          R = (n) => n ** k;
        } else {
          const a = rng.int(2, 6);
          tex = `n! > ${a}^n`;
          L = (n) => range(1, n).reduce((x, y) => x * y, 1);
          R = (n) => a ** n;
        }
        const f = (n: number) => L(n) > R(n);
        const N = firstFrom(f, 1, 40);
        const line = (n: number) => `n = ${n}: \\; ${L(n)} ${f(n) ? ">" : "\\le"} ${R(n)}`;
        const early = range(1, N - 1).find(f);
        const later = early === undefined ? undefined : range(early, N - 1).find((n) => !f(n));
        return numberProblem({
          prompt: t(
            `What is the smallest positive integer $n_0$ such that $${tex}$ holds for every integer $n \\ge n_0$?`,
            `使 $${tex}$ 对每个整数 $n \\ge n_0$ 都成立的最小正整数 $n_0$ 是多少？`,
          ),
          answer: N,
          wrong: [N + 1],
          mistakes: firstOf([
            why(
              N - 1,
              `At $n = ${N - 1}$ the inequality fails: $${L(N - 1)} \\le ${R(N - 1)}$.`,
              `$n = ${N - 1}$ 时不等式不成立：$${L(N - 1)} \\le ${R(N - 1)}$。`,
            ),
            ...(early !== undefined && later !== undefined
              ? [
                  why(
                    early,
                    `It holds at $n = ${early}$ but fails again at $n = ${later}$; the start is where it holds from then on.`,
                    `它在 $n = ${early}$ 时成立，但在 $n = ${later}$ 时又不成立；起点是从此一直成立的地方。`,
                  ),
                ]
              : []),
            why(N + 1, `It already holds at $n = ${N}$: $${L(N)} > ${R(N)}$.`, `它在 $n = ${N}$ 时已经成立：$${L(N)} > ${R(N)}$。`),
          ]),
          solution: walked(
            [
              [
                ["Test values near the start", "检验起点附近的值"],
                t("Compare the two sides:", "比较两边："),
                [line(N - 1), line(N), line(N + 1)],
              ],
              [
                ["Check that it keeps holding", "确认之后一直成立"],
                t(
                  `From $n = ${N}$ on, each increase of $n$ multiplies the left side by more than the right side, so the inequality never fails again; the inductive step proves this.`,
                  `从 $n = ${N}$ 起，$n$ 每增加一，左边乘上的倍数都比右边大，所以不等式不会再不成立；归纳步骤证明了这一点。`,
                ),
              ],
            ],
            t(
              `At $n = ${N + 2}$: $${L(N + 2)} > ${R(N + 2)}$, as the step predicts, while $n = ${N - 1}$ fails, so the start is $n_0 = ${N}$.`,
              `$n = ${N + 2}$ 时：$${L(N + 2)} > ${R(N + 2)}$，与归纳步骤的预期一致；而 $n = ${N - 1}$ 时不成立，所以起点是 $n_0 = ${N}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "chaining-the-inductive-hypothesis",
      title: t("Chaining the hypothesis", "串联归纳假设"),
      explanation: t(
        "For an inequality, apply the hypothesis to part of the next expression and then show that the extra amount is at least what is needed. To prove $3^n > 5n$ for $n \\ge 3$: assume $3^k > 5k$. Then $3^{k+1} = 3 \\cdot 3^k > 15k = 5k + 10k \\ge 5k + 5 = 5(k + 1)$, using $10k \\ge 5$.\n\n> **Watch out.** Multiplying the hypothesis by $a$ multiplies the whole right side: $a \\cdot ck = (ac)k$, not $ck + a$.",
        "对于不等式，把归纳假设用在下一个表达式的一部分上，再证明多出的量至少达到所需的量。证明 $n \\ge 3$ 时 $3^n > 5n$：假设 $3^k > 5k$。则 $3^{k+1} = 3 \\cdot 3^k > 15k = 5k + 10k \\ge 5k + 5 = 5(k + 1)$，其中用到 $10k \\ge 5$。\n\n> **注意。** 把归纳假设乘以 $a$ 时，整个右边都要乘：$a \\cdot ck = (ac)k$，而不是 $ck + a$。",
      ),
      generate(rng) {
        const a = rng.int(2, 7);
        const c = rng.int(3, 15);
        const K = firstFrom((k) => a ** k > c * k, 1, 40);
        const wrongs: [string, string, string][] = [
          [
            `${a}^{k+1} > ${c}k + ${a}`,
            `That adds $${a}$ instead of multiplying the whole right side by $${a}$.`,
            `这是加上 $${a}$，而不是把整个右边乘以 $${a}$。`,
          ],
          [
            `${a}^{k+1} > ${c}(k + 1)k`,
            `That multiplies by $k + 1$, but the left side was multiplied by $${a}$.`,
            `这是乘以 $k + 1$，但左边乘的是 $${a}$。`,
          ],
          [
            `${a}^{k+1} > ${c + a}k`,
            `That adds $${a}$ to the coefficient instead of multiplying it.`,
            `这是把 $${a}$ 加到系数上，而不是乘上去。`,
          ],
          [
            `${a}^{k+1} > ${c}k^{${a}}`,
            `That raises $k$ to the power $${a}$; multiplying by $${a}$ only scales the right side.`,
            `这是把 $k$ 升到 $${a}$ 次幂；乘以 $${a}$ 只是把右边放大。`,
          ],
        ];
        return reasoned(
          oneOf(
            rng,
            t(
              `Assume $${a}^k > ${c}k$. Multiplying by $${a}$, which inequality follows for $${a}^{k+1}$?`,
              `假设 $${a}^k > ${c}k$。两边乘以 $${a}$，关于 $${a}^{k+1}$ 可得哪个不等式？`,
            ),
            math(`${a}^{k+1} > ${a * c}k`),
            wrongs.map(([w]) => math(w)),
            walked(
              [
                [
                  ["Multiply the hypothesis", "把归纳假设相乘"],
                  t(
                    `$${a}^{k+1} = ${a} \\cdot ${a}^k > ${a} \\cdot ${c}k = ${a * c}k$.`,
                    `$${a}^{k+1} = ${a} \\cdot ${a}^k > ${a} \\cdot ${c}k = ${a * c}k$。`,
                  ),
                ],
                [
                  ["See what remains", "看还需要什么"],
                  t(
                    `To finish the step it remains to show $${a * c}k \\ge ${c}(k + 1)$, which is $${(a - 1) * c}k \\ge ${c}$ and holds for $k \\ge 1$.`,
                    `要完成归纳步骤，还需证明 $${a * c}k \\ge ${c}(k + 1)$，即 $${(a - 1) * c}k \\ge ${c}$，这对 $k \\ge 1$ 成立。`,
                  ),
                ],
              ],
              t(
                `Take $k = ${K}$, where $${a}^{${K}} = ${a ** K} > ${c * K}$: then $${a}^{${K + 1}} = ${a ** (K + 1)} > ${a * c * K} = ${a * c} \\cdot ${K}$.`,
                `取 $k = ${K}$，此时 $${a}^{${K}} = ${a ** K} > ${c * K}$：则 $${a}^{${K + 1}} = ${a ** (K + 1)} > ${a * c * K} = ${a * c} \\cdot ${K}$。`,
              ),
            ),
          ),
          wrongs.map(([w, en, zh]) => [`$${w}$`, en, zh]),
        );
      },
    },
  ],
};

/** provingDivisibilityUsingInduction proves d | f(n) for all n. */
export const provingDivisibilityUsingInduction: TopicDef = {
  id: "proving-divisibility-using-induction",
  title: t("Proving Divisibility Using Induction", "用归纳法证明整除性"),
  summary: t(
    "Write f(k + 1) as a multiple of f(k) plus a multiple of d; then d | f(k) gives d | f(k + 1).",
    "把 f(k + 1) 写成 f(k) 的倍数加上 d 的倍数；于是由 d | f(k) 得 d | f(k + 1)。",
  ),
  intro: t(
    "Prove $5 \\mid 6^n - 1$ for every $n \\ge 1$. Base case: $6^1 - 1 = 5$. Inductive step: $6^{k+1} - 1 = 6 \\cdot 6^k - 6 + 5 = 6(6^k - 1) + 5$. The hypothesis gives $5 \\mid 6^k - 1$, and $5 \\mid 5$, so $5 \\mid 6^{k+1} - 1$.\n\nCheck: $6^3 - 1 = 215 = 5 \\cdot 43$.\n\nIn this lesson we rewrite the next term so that the hypothesis appears inside it, and find the largest number that divides every term of a sequence.",
    "证明对每个 $n \\ge 1$ 有 $5 \\mid 6^n - 1$。基础步骤：$6^1 - 1 = 5$。归纳步骤：$6^{k+1} - 1 = 6 \\cdot 6^k - 6 + 5 = 6(6^k - 1) + 5$。归纳假设给出 $5 \\mid 6^k - 1$，又 $5 \\mid 5$，所以 $5 \\mid 6^{k+1} - 1$。\n\n检验：$6^3 - 1 = 215 = 5 \\cdot 43$。\n\n本课我们改写下一项，使归纳假设出现在其中，并求整除数列每一项的最大整数。",
  ),
  prerequisites: ["mathematical-induction", "properties-of-integer-divisibility"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "rewriting-the-next-term",
      title: t("Rewriting the next term", "改写下一项"),
      explanation: t(
        "Rewrite the next expression so that the expression from the hypothesis appears inside it, and the rest is visibly divisible. To prove $7 \\mid 8^n - 1$: $8^{k+1} - 1 = 8 \\cdot 8^k - 8 + 7 = 8(8^k - 1) + 7$. The inductive hypothesis says $7 \\mid 8^k - 1$, and $7 \\mid 7$, so $7 \\mid 8^{k+1} - 1$.\n\n> **Watch out.** A rewriting is only useful if what is left over is a multiple of the divisor. Expand it back to check it equals the next term, then check the leftover.",
        "改写下一个表达式，使归纳假设中的表达式出现在其中，而剩下的部分明显可以被整除。证明 $7 \\mid 8^n - 1$：$8^{k+1} - 1 = 8 \\cdot 8^k - 8 + 7 = 8(8^k - 1) + 7$。归纳假设给出 $7 \\mid 8^k - 1$，又 $7 \\mid 7$，所以 $7 \\mid 8^{k+1} - 1$。\n\n> **注意。** 只有剩下的部分是除数的倍数，改写才有用。先展开验证它等于下一项，再检查剩下的部分。",
      ),
      generate(rng) {
        const a = rng.int(3, 20);
        const c = rng.int(1, a - 2);
        const d = a - c;
        const f = (k: string) => `${a}^{${k}} - ${c}^{${k}}`;
        const wrongs: [string, string, string][] = [
          [
            `${a}(${f("k")}) + ${c}^{k}`,
            `That leftover has lost the factor $${a} - ${c} = ${d}$, so it need not be divisible by $${d}$.`,
            `剩下的部分丢掉了因数 $${a} - ${c} = ${d}$，所以不一定能被 $${d}$ 整除。`,
          ],
          [
            `${c}(${f("k")}) + ${a}^{k}`,
            `Pulling out $${c}$ leaves $${d} \\cdot ${a}^k$, not $${a}^k$; this leftover has lost the factor $${d}$.`,
            `提出 $${c}$ 后剩下的是 $${d} \\cdot ${a}^k$，而不是 $${a}^k$；这个剩余部分丢掉了因数 $${d}$。`,
          ],
          [
            `${a}(${f("k")}) - ${d} \\cdot ${a}^{k}`,
            `Expanding $${a}(${f("k")})$ gives $-${a} \\cdot ${c}^k$, so the correction must involve $${c}^k$, not $${a}^k$.`,
            `展开 $${a}(${f("k")})$ 得到 $-${a} \\cdot ${c}^k$，所以修正项应含 $${c}^k$，而不是 $${a}^k$。`,
          ],
          [
            `(${f("k")}) + ${d}`,
            `Raising the power multiplies by $${a}$ and $${c}$; adding a constant does not give the next term.`,
            `指数加一相当于乘以 $${a}$ 与 $${c}$；加一个常数得不到下一项。`,
          ],
        ];
        return reasoned(
          oneOf(
            rng,
            t(
              `To prove $${d} \\mid ${f("n")}$ by induction, which rewriting of $${f("k+1")}$ works?`,
              `用归纳法证明 $${d} \\mid ${f("n")}$，$${f("k+1")}$ 的哪种改写可行？`,
            ),
            math(`${a}(${f("k")}) + ${d} \\cdot ${c}^{k}`),
            wrongs.map(([w]) => math(w)),
            walked(
              [
                [
                  ["Bring in the hypothesis", "引入归纳假设"],
                  t(
                    `Subtract and add $${a} \\cdot ${c}^k$: $${f("k+1")} = ${a} \\cdot ${a}^k - ${a} \\cdot ${c}^k + ${a} \\cdot ${c}^k - ${c} \\cdot ${c}^k$.`,
                    `减去再加上 $${a} \\cdot ${c}^k$：$${f("k+1")} = ${a} \\cdot ${a}^k - ${a} \\cdot ${c}^k + ${a} \\cdot ${c}^k - ${c} \\cdot ${c}^k$。`,
                  ),
                ],
                [
                  ["Group the terms", "分组"],
                  t(
                    `This is $${a}(${f("k")}) + (${a} - ${c})${c}^k = ${a}(${f("k")}) + ${d} \\cdot ${c}^k$. The hypothesis gives $${d} \\mid ${f("k")}$, and the second part is a multiple of $${d}$.`,
                    `这等于 $${a}(${f("k")}) + (${a} - ${c})${c}^k = ${a}(${f("k")}) + ${d} \\cdot ${c}^k$。归纳假设给出 $${d} \\mid ${f("k")}$，第二部分是 $${d}$ 的倍数。`,
                  ),
                ],
              ],
              t(
                `At $k = 1$: $${a}(${a} - ${c}) + ${d} \\cdot ${c} = ${a * d} + ${d * c} = ${a * a - c * c}$, which is $${a}^2 - ${c}^2$.`,
                `$k = 1$ 时：$${a}(${a} - ${c}) + ${d} \\cdot ${c} = ${a * d} + ${d * c} = ${a * a - c * c}$，正是 $${a}^2 - ${c}^2$。`,
              ),
            ),
          ),
          wrongs.map(([w, en, zh]) => [`$${w}$`, en, zh]),
        );
      },
    },
    {
      id: "the-largest-guaranteed-divisor",
      title: t("The largest guaranteed divisor", "必然的最大因数"),
      explanation: t(
        "$a^n - 1$ is divisible by $a - 1$ for every $n \\ge 1$, and at $n = 1$ it equals $a - 1$, so no larger integer divides every term. For $n^3 - n$ the answer is $6$: it is $(n - 1)n(n + 1)$, and $2^3 - 2 = 6$.\n\n> **Watch out.** A number that divides every term must divide the first one, so the answer is at most the value at $n = 1$. Then show that this value divides every later term.",
        "对每个 $n \\ge 1$，$a^n - 1$ 都能被 $a - 1$ 整除；而 $n = 1$ 时它等于 $a - 1$，所以没有更大的整数能整除所有项。对 $n^3 - n$，答案是 $6$：它等于 $(n - 1)n(n + 1)$，且 $2^3 - 2 = 6$。\n\n> **注意。** 整除每一项的数必须整除第一项，所以答案不超过 $n = 1$ 时的值。然后再证明这个值整除之后的每一项。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const a = rng.int(3, 30);
        const c = rng.int(1, Math.min(9, a - 1));
        let tex: string;
        let f: (n: number) => number;
        let factor: Text;
        if (kind === 0) {
          tex = `${a}^n - 1`;
          f = (n) => a ** n - 1;
          factor = t(
            `$${a}^n - 1 = (${a} - 1)(${a}^{n-1} + \\dots + ${a} + 1)$, so $${a - 1}$ divides every term.`,
            `$${a}^n - 1 = (${a} - 1)(${a}^{n-1} + \\dots + ${a} + 1)$，所以 $${a - 1}$ 整除每一项。`,
          );
        } else if (kind === 1) {
          tex = `${a}^{n} - ${c}^{n}`;
          f = (n) => a ** n - c ** n;
          factor = t(
            `$${a}^{k+1} - ${c}^{k+1} = ${a}(${a}^k - ${c}^k) + ${a - c} \\cdot ${c}^k$, so by induction $${a - c}$ divides every term.`,
            `$${a}^{k+1} - ${c}^{k+1} = ${a}(${a}^k - ${c}^k) + ${a - c} \\cdot ${c}^k$，所以由归纳法 $${a - c}$ 整除每一项。`,
          );
        } else {
          tex = `${a}^{2n} - 1`;
          f = (n) => a ** (2 * n) - 1;
          factor = t(
            `$${a}^{2n} - 1 = (${a * a})^n - 1$, which is divisible by $${a * a} - 1 = ${a * a - 1}$ for every $n$.`,
            `$${a}^{2n} - 1 = (${a * a})^n - 1$，对每个 $n$ 都能被 $${a * a} - 1 = ${a * a - 1}$ 整除。`,
          );
        }
        const g = range(1, 4).reduce((acc, n) => gcd(acc, f(n)), 0);
        return numberProblem({
          prompt: t(
            `What is the largest integer that divides $${tex}$ for every positive integer $n$?`,
            `对每个正整数 $n$ 都能整除 $${tex}$ 的最大整数是多少？`,
          ),
          answer: g,
          wrong: [a + 1],
          mistakes: firstOf([
            why(2 * g, `That does not divide the term at $n = 1$, which is $${f(1)}$.`, `它不整除 $n = 1$ 时的项 $${f(1)}$。`),
            why(a, `That is the base; the divisor comes from the term at $n = 1$.`, `这是底数；因数来自 $n = 1$ 时的项。`),
          ]),
          solution: walked(
            [
              [
                ["Bound by the first term", "用第一项给出上界"],
                t(
                  `A number dividing every term divides the term at $n = 1$, which is $${f(1)}$; so the answer is at most $${f(1)}$.`,
                  `整除每一项的数一定整除 $n = 1$ 时的项 $${f(1)}$；所以答案不超过 $${f(1)}$。`,
                ),
              ],
              [["Show it divides every term", "证明它整除每一项"], factor],
            ],
            t(`At $n = 2$: $${f(2)} = ${g} \\cdot ${f(2) / g}$.`, `$n = 2$ 时：$${f(2)} = ${g} \\cdot ${f(2) / g}$。`),
          ),
        });
      },
    },
  ],
};

/** provingMatrixIdentitiesUsingInduction proves formulas for powers of matrices. */
export const provingMatrixIdentitiesUsingInduction: TopicDef = {
  id: "proving-matrix-identities-using-induction",
  title: t("Proving Matrix Identities Using Induction", "用归纳法证明矩阵恒等式"),
  summary: t("Guess a formula for Aⁿ, then prove it by induction using Aᵏ⁺¹ = AᵏA.", "猜出 Aⁿ 的公式，再利用 Aᵏ⁺¹ = AᵏA 用归纳法证明。"),
  intro: t(
    "Let $A = \\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix}$. Then $A^2 = \\begin{pmatrix} 1 & 4 \\\\ 0 & 1 \\end{pmatrix}$ and $A^3 = \\begin{pmatrix} 1 & 6 \\\\ 0 & 1 \\end{pmatrix}$, which suggests that $A^n$ has top-right entry $2n$. Induction proves it: if $A^k$ has top-right entry $2k$, then $A^{k+1} = A^k A$ has top-right entry $1 \\cdot 2 + 2k \\cdot 1 = 2(k + 1)$.\n\nCheck: $A^4 = A^3 A$ has top-right entry $1 \\cdot 2 + 6 \\cdot 1 = 8 = 2 \\cdot 4$.\n\nIn this lesson we guess formulas for the entries of matrix powers and prove them with the inductive step $A^{k+1} = A^k A$.",
    "设 $A = \\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix}$。则 $A^2 = \\begin{pmatrix} 1 & 4 \\\\ 0 & 1 \\end{pmatrix}$，$A^3 = \\begin{pmatrix} 1 & 6 \\\\ 0 & 1 \\end{pmatrix}$，这提示 $A^n$ 右上角的元素是 $2n$。归纳法可以证明：若 $A^k$ 右上角的元素是 $2k$，则 $A^{k+1} = A^k A$ 右上角的元素是 $1 \\cdot 2 + 2k \\cdot 1 = 2(k + 1)$。\n\n检验：$A^4 = A^3 A$ 右上角的元素是 $1 \\cdot 2 + 6 \\cdot 1 = 8 = 2 \\cdot 4$。\n\n本课我们猜出矩阵幂各元素的公式，并用归纳步骤 $A^{k+1} = A^k A$ 证明它们。",
  ),
  prerequisites: ["mathematical-induction", "powers-of-matrices"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "entries-of-matrix-powers",
      title: t("Entries of matrix powers", "矩阵幂的元素"),
      explanation: t(
        "Compute the first few powers to guess a pattern for the entries, then prove the pattern by induction. By induction, $\\begin{pmatrix} 1 & a \\\\ 0 & 1 \\end{pmatrix}^n = \\begin{pmatrix} 1 & na \\\\ 0 & 1 \\end{pmatrix}$ and $\\begin{pmatrix} b & 1 \\\\ 0 & b \\end{pmatrix}^n = \\begin{pmatrix} b^n & nb^{n-1} \\\\ 0 & b^n \\end{pmatrix}$.\n\n> **Watch out.** A power of a matrix is not the matrix of powers of its entries: the top-right entry of $\\begin{pmatrix} 1 & a \\\\ 0 & 1 \\end{pmatrix}^n$ is $na$, not $a^n$.",
        "先计算前几次幂，猜出元素的规律，再用归纳法证明这个规律。由归纳法，$\\begin{pmatrix} 1 & a \\\\ 0 & 1 \\end{pmatrix}^n = \\begin{pmatrix} 1 & na \\\\ 0 & 1 \\end{pmatrix}$，$\\begin{pmatrix} b & 1 \\\\ 0 & b \\end{pmatrix}^n = \\begin{pmatrix} b^n & nb^{n-1} \\\\ 0 & b^n \\end{pmatrix}$。\n\n> **注意。** 矩阵的幂不是把各元素分别取幂：$\\begin{pmatrix} 1 & a \\\\ 0 & 1 \\end{pmatrix}^n$ 右上角的元素是 $na$，而不是 $a^n$。",
      ),
      generate(rng) {
        const n = rng.int(4, 20);
        if (rng.bool()) {
          const a = rng.int(-9, 9) || 2;
          return numberProblem({
            prompt: t(
              `Find the top-right entry of $\\begin{pmatrix} 1 & ${a} \\\\ 0 & 1 \\end{pmatrix}^{${n}}$.`,
              `求 $\\begin{pmatrix} 1 & ${a} \\\\ 0 & 1 \\end{pmatrix}^{${n}}$ 右上角的元素。`,
            ),
            answer: n * a,
            wrong: [n * a + a * a],
            mistakes: firstOf([
              ...(Math.abs(a) ** n < 1e9
                ? [
                    why(
                      a ** n,
                      "That raises the entry to a power; matrix powers do not work entry by entry.",
                      "这是把元素取幂；矩阵的幂不能逐个元素计算。",
                    ),
                  ]
                : []),
              why(
                (n - 1) * a,
                `That is the entry of the power $${n - 1}$; the $${n}$th power has $${n}$ copies of $${a}$.`,
                `这是 $${n - 1}$ 次幂的元素；$${n}$ 次幂含有 $${n}$ 个 $${a}$。`,
              ),
              why(a, "That is the entry of the matrix itself, the first power.", "这是矩阵本身（一次幂）的元素。"),
            ]),
            solution: walked(
              [
                [
                  ["Find the pattern", "找出规律"],
                  t(
                    `Multiplying by the matrix once more adds $${a}$ to the top-right entry: $1 \\cdot ${p(a)} + ka \\cdot 1 = (k + 1)a$ with $a = ${a}$.`,
                    `再乘一次这个矩阵，右上角的元素就加上 $${a}$：$1 \\cdot ${p(a)} + ka \\cdot 1 = (k + 1)a$，其中 $a = ${a}$。`,
                  ),
                ],
                [
                  ["Apply it at the power", "代入幂次"],
                  t(
                    `The entry of the $${n}$th power is $${n} \\cdot ${p(a)} = ${n * a}$.`,
                    `$${n}$ 次幂的元素是 $${n} \\cdot ${p(a)} = ${n * a}$。`,
                  ),
                ],
              ],
              t(
                `The square has top-right entry $1 \\cdot ${p(a)} + ${p(a)} \\cdot 1 = ${2 * a} = 2 \\cdot ${p(a)}$, as the formula says for $n = 2$.`,
                `平方的右上角元素是 $1 \\cdot ${p(a)} + ${p(a)} \\cdot 1 = ${2 * a} = 2 \\cdot ${p(a)}$，与公式在 $n = 2$ 时一致。`,
              ),
            ),
          });
        }
        const b = rng.int(2, 3);
        const m = rng.int(3, 8);
        return numberProblem({
          prompt: t(
            `Find the top-right entry of $\\begin{pmatrix} ${b} & 1 \\\\ 0 & ${b} \\end{pmatrix}^{${m}}$.`,
            `求 $\\begin{pmatrix} ${b} & 1 \\\\ 0 & ${b} \\end{pmatrix}^{${m}}$ 右上角的元素。`,
          ),
          answer: m * b ** (m - 1),
          wrong: [(m - 1) * b ** (m - 2)],
          mistakes: firstOf([
            why(b ** m, `That is a diagonal entry, $${b}^{${m}}$.`, `这是对角元素 $${b}^{${m}}$。`),
            why(
              m * b ** m,
              "The power of the base in the corner is one less than the power of the matrix.",
              "角上元素中底数的指数比矩阵的幂次小一。",
            ),
            why(
              b ** (m - 1),
              `That misses the factor $${m}$: the corner collects $${m}$ equal products.`,
              `这漏掉了因数 $${m}$：角上元素累积了 $${m}$ 个相同的乘积。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Recall the formula", "回忆公式"],
                t(
                  `By induction, the $n$th power has diagonal entries $${b}^n$ and top-right entry $n \\cdot ${b}^{n-1}$.`,
                  `由归纳法，$n$ 次幂的对角元素是 $${b}^n$，右上角元素是 $n \\cdot ${b}^{n-1}$。`,
                ),
              ],
              [
                ["Substitute", "代入"],
                t(
                  `$${m} \\cdot ${b}^{${m - 1}} = ${m} \\cdot ${b ** (m - 1)} = ${m * b ** (m - 1)}$.`,
                  `$${m} \\cdot ${b}^{${m - 1}} = ${m} \\cdot ${b ** (m - 1)} = ${m * b ** (m - 1)}$。`,
                ),
              ],
            ],
            t(
              `The square has top-right entry $${b} \\cdot 1 + 1 \\cdot ${b} = ${2 * b} = 2 \\cdot ${b}^{1}$, as the formula says for $n = 2$.`,
              `平方的右上角元素是 $${b} \\cdot 1 + 1 \\cdot ${b} = ${2 * b} = 2 \\cdot ${b}^{1}$，与公式在 $n = 2$ 时一致。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-inductive-step-for-matrix-powers",
      title: t("The inductive step", "归纳步骤"),
      explanation: t(
        "Multiply the assumed formula for one power by the matrix once more and check that the entries match the formula for the next power. Assume $A^k = \\begin{pmatrix} 1 & ka \\\\ 0 & 1 \\end{pmatrix}$. Then $A^{k+1} = A^k A = \\begin{pmatrix} 1 & ka \\\\ 0 & 1 \\end{pmatrix}\\begin{pmatrix} 1 & a \\\\ 0 & 1 \\end{pmatrix} = \\begin{pmatrix} 1 & (k + 1)a \\\\ 0 & 1 \\end{pmatrix}$.\n\n> **Watch out.** Multiply rows by columns: the off-diagonal entry of $A^k A$ is a sum of two products, one through each diagonal entry.",
        "把假设的某次幂公式再乘一次矩阵，检查各元素是否与下一次幂的公式一致。假设 $A^k = \\begin{pmatrix} 1 & ka \\\\ 0 & 1 \\end{pmatrix}$。则 $A^{k+1} = A^k A = \\begin{pmatrix} 1 & ka \\\\ 0 & 1 \\end{pmatrix}\\begin{pmatrix} 1 & a \\\\ 0 & 1 \\end{pmatrix} = \\begin{pmatrix} 1 & (k + 1)a \\\\ 0 & 1 \\end{pmatrix}$。\n\n> **注意。** 要用行乘列：$A^k A$ 的非对角元素是两个乘积之和，分别经过两个对角元素。",
      ),
      generate(rng) {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const lower = rng.bool();
        const pm = (x: string, y: string) =>
          lower ? `\\begin{pmatrix} ${x} & 0 \\\\ ${y} & ${x} \\end{pmatrix}` : `\\begin{pmatrix} ${x} & ${y} \\\\ 0 & ${x} \\end{pmatrix}`;
        const A = pm(`${b}`, `${a}`);
        const Ak = pm(`${b}^k`, `${a}k \\cdot ${b}^{k-1}`);
        const right = pm(`${b}^{k+1}`, `${a}(k + 1) \\cdot ${b}^{k}`);
        const wrongs: [string, string, string][] = [
          [
            pm(`${b}^{k+1}`, `${a}k \\cdot ${b}^{k}`),
            "That keeps only one of the two products in the off-diagonal entry.",
            "这只保留了非对角元素两个乘积中的一个。",
          ],
          [
            pm(`${b}^{k+1}`, `${a}(k + 1) \\cdot ${b}^{k+1}`),
            "The power of the base off the diagonal is one less than on it.",
            "非对角元素中底数的指数比对角元素小一。",
          ],
          [
            pm(`${b}^{k}`, `${a}(k + 1) \\cdot ${b}^{k}`),
            `The diagonal entries multiply by $${b}$ once more, giving $${b}^{k+1}$.`,
            `对角元素再乘一次 $${b}$，得到 $${b}^{k+1}$。`,
          ],
        ];
        return reasoned(
          oneOf(
            rng,
            t(
              `Let $A = ${A}$ and assume $A^k = ${Ak}$. What is $A^{k+1} = A^k A$?`,
              `设 $A = ${A}$，并假设 $A^k = ${Ak}$。$A^{k+1} = A^k A$ 是什么？`,
            ),
            math(right),
            wrongs.map(([w]) => math(w)),
            walked(
              [
                [
                  ["Multiply the diagonal entries", "对角元素相乘"],
                  t(`$${b}^k \\cdot ${b} = ${b}^{k+1}$.`, `$${b}^k \\cdot ${b} = ${b}^{k+1}$。`),
                ],
                [
                  ["Add the two products off the diagonal", "非对角元素是两个乘积之和"],
                  t(
                    `$${b}^k \\cdot ${a} + ${a}k \\cdot ${b}^{k-1} \\cdot ${b} = ${a} \\cdot ${b}^k + ${a}k \\cdot ${b}^k = ${a}(k + 1) \\cdot ${b}^k$.`,
                    `$${b}^k \\cdot ${a} + ${a}k \\cdot ${b}^{k-1} \\cdot ${b} = ${a} \\cdot ${b}^k + ${a}k \\cdot ${b}^k = ${a}(k + 1) \\cdot ${b}^k$。`,
                  ),
                ],
              ],
              t(
                `At $k = 1$ the result gives the off-diagonal entry $${a} \\cdot 2 \\cdot ${b} = ${2 * a * b}$, and $A^2$ computed directly has $${b} \\cdot ${a} + ${a} \\cdot ${b} = ${2 * a * b}$.`,
                `$k = 1$ 时结果给出非对角元素 $${a} \\cdot 2 \\cdot ${b} = ${2 * a * b}$，而直接计算 $A^2$ 得 $${b} \\cdot ${a} + ${a} \\cdot ${b} = ${2 * a * b}$。`,
              ),
            ),
          ),
          wrongs.map(([w, en, zh]) => [`$${w}$`, en, zh]),
        );
      },
    },
  ],
};

/** strongInductionAndRecurrenceRelations uses strong induction for recursively defined sequences. */
export const strongInductionAndRecurrenceRelations: TopicDef = {
  id: "strong-induction-and-recurrence-relations",
  title: t("Strong Induction and Recurrence Relations", "强归纳法与递推关系"),
  summary: t(
    "Strong induction assumes P(n₀), …, P(k) to prove P(k + 1); it suits recurrences where each term depends on several earlier ones.",
    "强归纳法假设 P(n₀), …, P(k) 均成立来证明 P(k + 1)；适用于每一项依赖前面若干项的递推关系。",
  ),
  intro: t(
    "Let $a_0 = 2$, $a_1 = 5$ and $a_n = 5a_{n-1} - 6a_{n-2}$. The formula $a_n = 2^n + 3^n$ gives $a_0 = 2$ and $a_1 = 5$. If it holds for $a_{k-1}$ and $a_k$, then $a_{k+1} = 5(2^k + 3^k) - 6(2^{k-1} + 3^{k-1}) = 2^{k+1} + 3^{k+1}$, because $2^{k-1}(5 \\cdot 2 - 6) = 2^{k+1}$ and $3^{k-1}(5 \\cdot 3 - 6) = 3^{k+1}$. Strong induction, which assumes every earlier case, proves the formula for all $n$.\n\nCheck: $a_2 = 5 \\cdot 5 - 6 \\cdot 2 = 13 = 2^2 + 3^2$.\n\nIn this lesson we compute the terms of recurrences and prove closed forms for them by strong induction.",
    "设 $a_0 = 2$，$a_1 = 5$，$a_n = 5a_{n-1} - 6a_{n-2}$。公式 $a_n = 2^n + 3^n$ 给出 $a_0 = 2$，$a_1 = 5$。若它对 $a_{k-1}$ 与 $a_k$ 成立，则 $a_{k+1} = 5(2^k + 3^k) - 6(2^{k-1} + 3^{k-1}) = 2^{k+1} + 3^{k+1}$，因为 $2^{k-1}(5 \\cdot 2 - 6) = 2^{k+1}$，$3^{k-1}(5 \\cdot 3 - 6) = 3^{k+1}$。强归纳法假设前面所有情形都成立，由此证明公式对所有 $n$ 成立。\n\n检验：$a_2 = 5 \\cdot 5 - 6 \\cdot 2 = 13 = 2^2 + 3^2$。\n\n本课我们计算递推关系的各项，并用强归纳法证明它们的通项公式。",
  ),
  prerequisites: ["mathematical-induction", "recursive-sequences"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "computing-terms-of-a-recurrence",
      title: t("Computing terms", "计算项"),
      explanation: t(
        "A recurrence gives each term from earlier ones, so starting from the initial values you can compute the terms one after another. A recurrence such as $a_n = a_{n-1} + 2a_{n-2}$ with $a_0 = 0$, $a_1 = 1$ determines every term: $a_2 = 1$, $a_3 = 3$, $a_4 = 5$, $a_5 = 11$.\n\n> **Watch out.** Each term uses the two before it, so compute the terms in order. Using $a_{n-1}$ twice instead of $a_{n-1}$ and $a_{n-2}$ is a common slip.",
        "递推关系由前面的项给出每一项，所以从初值出发可以逐项计算。像 $a_n = a_{n-1} + 2a_{n-2}$、$a_0 = 0$、$a_1 = 1$ 这样的递推关系确定了每一项：$a_2 = 1$，$a_3 = 3$，$a_4 = 5$，$a_5 = 11$。\n\n> **注意。** 每一项都用到它前面的两项，所以要按顺序计算。把 $a_{n-1}$ 用两次，而不是分别用 $a_{n-1}$ 和 $a_{n-2}$，是常见的失误。",
      ),
      generate(rng) {
        const pc = rng.int(-3, 4) || 1;
        const qc = rng.int(-3, 4) || 2;
        const a0 = rng.int(-3, 5);
        const a1 = rng.int(-3, 5);
        const n = rng.int(4, 7);
        const seq = [a0, a1];
        for (let i = 2; i <= n; i++) seq.push(pc * seq[i - 1]! + qc * seq[i - 2]!);
        const rec = `a_n = ${pc === 1 ? "" : pc === -1 ? "-" : pc}a_{n-1}${qc === 1 ? " + " : qc === -1 ? " - " : qc > 0 ? ` + ${qc}` : ` - ${-qc}`}a_{n-2}`;
        const lines = range(2, n).map(
          (i) => `a_{${i}} = ${pc} \\cdot ${p(seq[i - 1]!)} ${qc < 0 ? "-" : "+"} ${Math.abs(qc)} \\cdot ${p(seq[i - 2]!)} = ${seq[i]}`,
        );
        return numberProblem({
          prompt: t(
            `Let $a_0 = ${a0}$, $a_1 = ${a1}$ and $${rec}$ for $n \\ge 2$. Find $a_{${n}}$.`,
            `设 $a_0 = ${a0}$，$a_1 = ${a1}$，且 $n \\ge 2$ 时 $${rec}$。求 $a_{${n}}$。`,
          ),
          answer: seq[n]!,
          wrong: [seq[n]! + 1],
          mistakes: firstOf([
            why(seq[n - 1]!, `That is $a_{${n - 1}}$, one term short.`, `这是 $a_{${n - 1}}$，少算了一项。`),
            why(
              pc * seq[n - 1]! + qc * seq[n - 1]!,
              `That uses $a_{${n - 1}}$ twice; the second part needs $a_{${n - 2}}$.`,
              `这把 $a_{${n - 1}}$ 用了两次；第二部分应当用 $a_{${n - 2}}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Compute the terms in order", "按顺序计算各项"],
                t("Each line uses the two terms before it:", "每一行都用到它前面的两项："),
                lines,
              ],
              [["Read off the term", "读出所求项"], t(`$a_{${n}} = ${seq[n]}$.`, `$a_{${n}} = ${seq[n]}$。`)],
            ],
            t(
              `Substitute the last three terms: $${seq[n]} - ${p(pc)} \\cdot ${p(seq[n - 1]!)} - ${p(qc)} \\cdot ${p(seq[n - 2]!)} = 0$, so the last term fits the recurrence.`,
              `代入最后三项：$${seq[n]} - ${p(pc)} \\cdot ${p(seq[n - 1]!)} - ${p(qc)} \\cdot ${p(seq[n - 2]!)} = 0$，所以最后一项符合递推关系。`,
            ),
          ),
        });
      },
    },
    {
      id: "verifying-closed-forms",
      title: t("Closed forms", "通项公式"),
      explanation: t(
        "If $a_n = 5a_{n-1} - 6a_{n-2}$, then $a_n = A \\cdot 2^n + B \\cdot 3^n$ satisfies the recurrence for any $A, B$, since $2$ and $3$ are roots of $x^2 = 5x - 6$. The initial values fix $A$ and $B$; strong induction then proves the formula for every $n$.\n\n> **Watch out.** Fitting the recurrence is not enough: the formula must also give both initial values $a_0$ and $a_1$.",
        "若 $a_n = 5a_{n-1} - 6a_{n-2}$，则对任意 $A, B$，$a_n = A \\cdot 2^n + B \\cdot 3^n$ 都满足递推关系，因为 $2$ 和 $3$ 是 $x^2 = 5x - 6$ 的根。初始值确定 $A$ 与 $B$；再用强归纳法证明公式对每个 $n$ 成立。\n\n> **注意。** 只满足递推关系还不够：公式还必须给出两个初始值 $a_0$ 和 $a_1$。",
      ),
      generate(rng) {
        let r: number;
        let s: number;
        do {
          r = rng.int(-3, 5);
          s = rng.int(-3, 5);
        } while (r === s || r === 0 || s === 0 || r + s === 0);
        const A = rng.int(-4, 4) || 1;
        let B = rng.int(-4, 4) || 2;
        if (B === A) B = A === 2 ? 3 : 2;
        const pq = r + s;
        const q = -r * s;
        const a0 = A + B;
        const a1 = A * r + B * s;
        const a2 = pq * a1 + q * a0;
        const base = (x: number) => (x < 0 ? `(${x})` : `${x}`);
        const form = (x: number, u: number, y: number, v: number) =>
          `${x} \\cdot ${base(u)}^n ${y < 0 ? "-" : "+"} ${Math.abs(y)} \\cdot ${base(v)}^n`;
        const rec = `a_n = ${poly([pq, "a_{n-1}"], [q, "a_{n-2}"])}`;
        const eq = `x^2 = ${poly([pq, "x"], [q, ""])}`;
        const wrongs: [string, string, string][] = [
          [
            `a_n = ${form(B, r, A, s)}`,
            `That swaps the coefficients: at $n = 1$ it gives $${B * r + A * s}$, not $${a1}$.`,
            `这把系数交换了：$n = 1$ 时它给出 $${B * r + A * s}$，而不是 $${a1}$。`,
          ],
          [`a_n = ${form(A, -r, B, -s)}`, `Those bases are the negatives of the roots of $${eq}$.`, `这些底数是 $${eq}$ 的根的相反数。`],
          [
            `a_n = ${form(A + 1, r, B - 1, s)}`,
            `That gives $a_0 = ${a0}$ but $a_1 = ${(A + 1) * r + (B - 1) * s}$, not $${a1}$.`,
            `它给出 $a_0 = ${a0}$，但 $a_1 = ${(A + 1) * r + (B - 1) * s}$，而不是 $${a1}$。`,
          ],
          [
            `a_n = ${form(A, r + 1, B, s + 1)}`,
            `Those bases are not roots of $${eq}$, so the formula does not fit the recurrence.`,
            `这些底数不是 $${eq}$ 的根，所以公式不满足递推关系。`,
          ],
        ];
        return reasoned(
          oneOf(
            rng,
            t(
              `Let $a_0 = ${a0}$, $a_1 = ${a1}$ and $${rec}$. Which formula gives $a_n$?`,
              `设 $a_0 = ${a0}$，$a_1 = ${a1}$，且 $${rec}$。哪个公式给出 $a_n$？`,
            ),
            math(`a_n = ${form(A, r, B, s)}`),
            wrongs.map(([w]) => math(w)),
            walked(
              [
                [
                  ["Find the roots", "求根"],
                  t(
                    `$${base(r)}$ and $${base(s)}$ are the roots of $${eq}$, so every formula $A \\cdot ${base(r)}^n + B \\cdot ${base(s)}^n$ fits the recurrence.`,
                    `$${base(r)}$ 与 $${base(s)}$ 是 $${eq}$ 的根，所以每个形如 $A \\cdot ${base(r)}^n + B \\cdot ${base(s)}^n$ 的公式都满足递推关系。`,
                  ),
                ],
                [
                  ["Match the initial values", "匹配初始值"],
                  t(
                    `$n = 0$ gives $A + B = ${a0}$ and $n = 1$ gives $${poly([r, "A"], [s, "B"])} = ${a1}$, so $A = ${A}$ and $B = ${B}$. By strong induction the formula holds for all $n$.`,
                    `$n = 0$ 给出 $A + B = ${a0}$，$n = 1$ 给出 $${poly([r, "A"], [s, "B"])} = ${a1}$，所以 $A = ${A}$，$B = ${B}$。由强归纳法，公式对所有 $n$ 成立。`,
                  ),
                ],
              ],
              t(
                `The recurrence gives $a_2 = ${a2}$, and the formula gives $${A} \\cdot ${r * r} ${B < 0 ? "-" : "+"} ${Math.abs(B)} \\cdot ${s * s} = ${A * r * r + B * s * s}$.`,
                `递推关系给出 $a_2 = ${a2}$，公式给出 $${A} \\cdot ${r * r} ${B < 0 ? "-" : "+"} ${Math.abs(B)} \\cdot ${s * s} = ${A * r * r + B * s * s}$。`,
              ),
            ),
          ),
          wrongs.map(([w, en, zh]) => [`$${w}$`, en, zh]),
        );
      },
    },
  ],
};

/** methodsOfProofNumberTheoryTopics are the new topics of Methods of Proof unit 4. */
export const methodsOfProofNumberTheoryTopics: readonly TopicDef[] = [
  parity,
  integerDivisibility,
  theDivisionAlgorithm,
  theEuclideanAlgorithm,
  theExtendedEuclideanAlgorithm,
  linearDiophantineEquations,
  propertiesOfIntegerDivisibility,
  propertiesOfPrimeDivisibility,
  mathematicalInduction,
  provingInequalitiesUsingInduction,
  provingDivisibilityUsingInduction,
  provingMatrixIdentitiesUsingInduction,
  strongInductionAndRecurrenceRelations,
];
