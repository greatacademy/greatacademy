// A third knowledge point for the school, exam and calculator topics that still had two.

import type { KnowledgePointDef } from "@ga/content";
import { Q } from "@ga/subject-math";
import { algebraDrawings } from "../explanation-drawings-algebra.ts";
import { calculusDrawings5 } from "../explanation-drawings-calculus-5.ts";
import { geometryDrawings2 } from "../explanation-drawings-geometry-2.ts";
import { trigDrawings } from "../explanation-drawings-trig.ts";
import { choose, type Pair, whole } from "./early-grades-more-kit.ts";
import { chooseFilled, decimal, frac, integer, signed, skill } from "./third-kit.ts";

/** Rng is the random source a generator receives. */
type Rng = Parameters<KnowledgePointDef["generate"]>[0];

/** nz picks a nonzero integer of size at most n. */
const nz = (rng: Rng, n: number) => rng.int(1, n) * (rng.bool() ? 1 : -1);

/** paren writes a negative number in parentheses. */
const paren = (n: number) => (n < 0 ? `(${n})` : `${n}`);

/** factorOf writes x - p as a factor. */
const factorOf = (p: number) => (p < 0 ? `(x + ${-p})` : p === 0 ? "x" : `(x - ${p})`);

/** tableText lists pairs of inputs and outputs in words a table would show. */
const tableText = (xs: readonly number[], ys: readonly (number | string)[]) => xs.map((x, i) => `${x} \\to ${ys[i]}`).join(",\\ ");

/** deeperRemainingAlgebraThirdPoints holds the third knowledge points of topics in the algebra shard. */
export const deeperRemainingAlgebraThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "angles-in-the-coordinate-plane": [
    {
      ...skill(
        "coterminal-angles",
        ["Coterminal angles", "终边相同的角"],
        [
          "Adding or subtracting full turns leaves the terminal side where it was, so such angles are called coterminal. To find the one from $0^{\\circ}$ up to $360^{\\circ}$, add or subtract $360^{\\circ}$ until it lands there.",
          "加减整圈不改变终边，这样的角叫终边相同的角。要找 $0^{\\circ}$ 到 $360^{\\circ}$ 之间的那个，就反复加减 $360^{\\circ}$，直到落入这个范围。",
        ],
        (rng) => {
          const base = rng.int(1, 71) * 5;
          const turns = rng.int(1, 3) * (rng.bool() ? 1 : -1);
          const angle = base + 360 * turns;
          return whole(
            [
              `Which angle from $0^{\\circ}$ up to $360^{\\circ}$ is coterminal with $${angle}^{\\circ}$? Give the number of degrees.`,
              `在 $0^{\\circ}$ 到 $360^{\\circ}$ 之间，哪个角与 $${angle}^{\\circ}$ 终边相同？写出度数。`,
            ],
            base,
            [360 - base, (base + 180) % 360, turns > 0 ? base + 360 : base - 360].filter((w) => w !== base),
            [
              `${Math.abs(turns) === 1 ? "One full turn lands" : `$${Math.abs(turns)}$ full turns land`} in the range: $${angle}^{\\circ} ${turns > 0 ? "-" : "+"} ${Math.abs(turns) === 1 ? "" : `${Math.abs(turns)} \\cdot `}360^{\\circ} = ${base}^{\\circ}$.`,
              `加减 $${Math.abs(turns)}$ 整圈后落入这个范围：$${angle}^{\\circ} ${turns > 0 ? "-" : "+"} ${Math.abs(turns) === 1 ? "" : `${Math.abs(turns)} \\cdot `}360^{\\circ} = ${base}^{\\circ}$。`,
            ],
          );
        },
      ),
      figure: trigDrawings["angles-in-the-coordinate-plane#coterminal-angles"],
    },
  ],
  "calculating-perimeters-in-the-plane": [
    {
      ...skill(
        "the-perimeter-of-a-right-triangle",
        ["The perimeter of a right triangle", "直角三角形的周长"],
        [
          "When two sides of a triangle lie along grid lines, their lengths come from subtracting coordinates. The third side then comes from the Pythagorean theorem, and the perimeter adds all three.",
          "三角形有两条边沿着网格线时，它们的长度由坐标相减得到。第三条边用勾股定理求，周长是三条边的和。",
        ],
        (rng) => {
          const [p, q, r] = rng.pick<[number, number, number]>([
            [3, 4, 5],
            [6, 8, 10],
            [5, 12, 13],
            [8, 15, 17],
            [9, 12, 15],
            [7, 24, 25],
          ]);
          const x = rng.int(-9, 9);
          const y = rng.int(-9, 9);
          const left = rng.bool() ? 1 : -1;
          const down = rng.bool() ? 1 : -1;
          return whole(
            [
              `Find the perimeter of the triangle with vertices $(${x}, ${y})$, $(${x + left * p}, ${y})$ and $(${x}, ${y + down * q})$.`,
              `求顶点为 $(${x}, ${y})$、$(${x + left * p}, ${y})$ 和 $(${x}, ${y + down * q})$ 的三角形的周长。`,
            ],
            p + q + r,
            [p + q, 2 * (p + q), (p * q) / 2],
            [
              `The legs are $${p}$ and $${q}$, read off the coordinates. The third side is $\\sqrt{${p}^2 + ${q}^2} = ${r}$, so the perimeter is $${p} + ${q} + ${r} = ${p + q + r}$.`,
              `由坐标读出两条直角边是 $${p}$ 和 $${q}$。第三边是 $\\sqrt{${p}^2 + ${q}^2} = ${r}$，所以周长是 $${p} + ${q} + ${r} = ${p + q + r}$。`,
            ],
          );
        },
      ),
      figure: geometryDrawings2["calculating-perimeters-in-the-plane#the-perimeter-of-a-right-triangle"],
    },
  ],
  "coin-problems": [
    skill(
      "three-kinds-of-coins",
      ["Three kinds of coins", "三种硬币"],
      [
        `With three kinds of coins, write every count in terms of one unknown using the relations given. Then the total value gives a single equation, with each count multiplied by its value in cents.

Say there are $n$ nickels, twice as many dimes, and $3$ more quarters than nickels, worth $275$ cents. The counts are $n$, $2n$ and $n + 3$, so $5n + 10 \\cdot 2n + 25(n + 3) = 275$. That is $50n + 75 = 275$, so $50n = 200$ and $n = 4$. Check: $20 + 80 + 175 = 275$.

> **Watch out.** Multiply each count by its own coin value, and the whole of $n + 3$ by $25$: $25(n + 3) = 25n + 75$. The answer $n$ is the number of nickels, not of quarters.`,
        `有三种硬币时，用已知关系把每种的个数都写成同一个未知数的式子。这样总价值给出一个方程，每种个数乘它的面值（分）。

比如有 $n$ 枚 $5$ 分硬币，$10$ 分硬币是它的两倍，$25$ 分硬币比 $5$ 分硬币多 $3$ 枚，共 $275$ 分。三种的枚数是 $n$、$2n$ 和 $n + 3$，所以 $5n + 10 \\cdot 2n + 25(n + 3) = 275$，即 $50n + 75 = 275$，$50n = 200$，$n = 4$。检验：$20 + 80 + 175 = 275$。

> **注意。** 每种的枚数乘以它自己的面值，$25$ 要乘整个 $n + 3$：$25(n + 3) = 25n + 75$。答案 $n$ 是 $5$ 分硬币的枚数，不是 $25$ 分硬币的。`,
      ],
      (rng) => {
        const n = rng.int(2, 30);
        const k = rng.int(1, 9);
        const cents = 50 * n + 25 * k;
        return whole(
          [
            `A box holds $n$ nickels ($5$ cents), twice as many dimes ($10$ cents), and $${k}$ more quarters ($25$ cents) than nickels. They are worth $${cents}$ cents in all. Find $n$.`,
            `盒子里有 $n$ 枚 $5$ 分硬币，$10$ 分硬币的个数是它的两倍，$25$ 分硬币比 $5$ 分硬币多 $${k}$ 枚。总价值是 $${cents}$ 分。求 $n$。`,
          ],
          n,
          [n + k, 2 * n, Math.floor(cents / 40)],
          [
            `**Write every count in terms of $n$.** There are $n$ nickels, $2n$ dimes and $n + ${k}$ quarters.

**Write the value equation.** Each count times its coin value, in cents: $$5n + 10 \\cdot 2n + 25(n + ${k}) = ${cents}.$$ Multiplying out, $5n + 20n + 25n + ${25 * k} = ${cents}$, so $50n = ${cents} - ${25 * k} = ${cents - 25 * k}$ and $n = ${n}$.

**Check.** $${n}$ nickels, $${2 * n}$ dimes and $${n + k}$ quarters are worth $${5 * n} + ${20 * n} + ${25 * (n + k)} = ${cents}$ cents.`,
            `**用 $n$ 表示每种的枚数。** $5$ 分硬币 $n$ 枚，$10$ 分硬币 $2n$ 枚，$25$ 分硬币 $n + ${k}$ 枚。

**列价值方程。** 每种的枚数乘以面值（分）：$$5n + 10 \\cdot 2n + 25(n + ${k}) = ${cents}.$$ 去括号得 $5n + 20n + 25n + ${25 * k} = ${cents}$，所以 $50n = ${cents} - ${25 * k} = ${cents - 25 * k}$，$n = ${n}$。

**检验。** $${n}$ 枚 $5$ 分、$${2 * n}$ 枚 $10$ 分和 $${n + k}$ 枚 $25$ 分硬币共值 $${5 * n} + ${20 * n} + ${25 * (n + k)} = ${cents}$ 分。`,
          ],
        );
      },
    ),
  ],
  "consistency-and-dependency": [
    {
      ...skill(
        "the-coefficient-that-makes-no-solution",
        ["The coefficient that makes no solution", "使方程组无解的系数"],
        [
          `A system has no solution when its lines are parallel and different. So the coefficients on the left must be in one ratio, while the constants on the right are not in that ratio.

For $2x + 3y = 1$ and $6x + ty = 5$: the $x$-coefficient is multiplied by $3$, so the left sides are proportional when $t = 3 \\cdot 3 = 9$. Then $6x + 9y$ would equal both $3 \\cdot 1 = 3$ and $5$, which is impossible, so there is no solution.

> **Watch out.** Multiply the $y$-coefficient by the same factor, with its sign: for $2x - 3y = 1$ the answer is $t = 3 \\cdot (-3) = -9$, not $9$ and not $-3$.`,
          `方程组无解，当且仅当两条直线平行且不重合。所以左边的系数要成同一比例，而右边的常数不成这个比例。

对 $2x + 3y = 1$ 和 $6x + ty = 5$：$x$ 的系数乘了 $3$，所以当 $t = 3 \\cdot 3 = 9$ 时左边成比例。这时 $6x + 9y$ 既要等于 $3 \\cdot 1 = 3$ 又要等于 $5$，这不可能，所以无解。

> **注意。** $y$ 的系数要乘以同一个倍数，连同符号：对 $2x - 3y = 1$，答案是 $t = 3 \\cdot (-3) = -9$，不是 $9$，也不是 $-3$。`,
        ],
        (rng) => {
          const a = rng.int(1, 9);
          const b = nz(rng, 9);
          const c = rng.int(1, 9);
          const k = rng.int(2, 6);
          const d = k * c + rng.int(1, 9);
          return integer(
            [
              `For what value of $t$ does the system $${a}x ${b < 0 ? "-" : "+"} ${Math.abs(b)}y = ${c}$, $${k * a}x + ty = ${d}$ have no solution?`,
              `$t$ 为何值时，方程组 $${a}x ${b < 0 ? "-" : "+"} ${Math.abs(b)}y = ${c}$，$${k * a}x + ty = ${d}$ 无解？`,
            ],
            k * b,
            [b, -k * b, k * b + k],
            [
              `**Find the factor.** The $x$-coefficient goes from $${a}$ to $${k * a}$, a factor of $${k}$. For parallel lines the second left side must be $${k}$ times the first, so $t = ${k} \\cdot ${b < 0 ? `(${b})` : b} = ${k * b}$.

**Check.** With $t = ${k * b}$, the first equation times $${k}$ reads $${k * a}x ${b < 0 ? "-" : "+"} ${Math.abs(k * b)}y = ${k * c}$, but the second says the same left side equals $${d}$. Since $${d} \\ne ${k * c}$, the lines are parallel and different, and there is no solution.`,
              `**找倍数。** $x$ 的系数从 $${a}$ 变成 $${k * a}$，是 $${k}$ 倍。两直线平行时，第二个方程的左边必须是第一个的 $${k}$ 倍，所以 $t = ${k} \\cdot ${b < 0 ? `(${b})` : b} = ${k * b}$。

**检验。** $t = ${k * b}$ 时，第一个方程乘以 $${k}$ 得 $${k * a}x ${b < 0 ? "-" : "+"} ${Math.abs(k * b)}y = ${k * c}$，而第二个方程说同一个左边等于 $${d}$。因为 $${d} \\ne ${k * c}$，两条直线平行且不重合，方程组无解。`,
            ],
          );
        },
      ),
      figure: algebraDrawings["consistency-and-dependency#the-coefficient-that-makes-no-solution"],
    },
  ],
  "end-behavior": [
    skill(
      "end-behavior-from-factors",
      ["End behavior from factors", "由因式看端点行为"],
      [
        `End behavior depends only on the leading term, and the leading term of a product can be found without multiplying out. Multiplying out, the highest power of $x$ comes from multiplying the $x$ of every factor together, so the powers add up, and the number in front multiplies it.

For $f(x) = -2(x - 1)^{3}(x + 4)^{2}$: the factor $(x - 1)^{3}$ contributes $x^{3}$ and $(x + 4)^{2}$ contributes $x^{2}$, so the leading term is $-2x^{3} \\cdot x^{2} = -2x^{5}$. Degree $5$ is odd and $-2$ is negative, so the graph rises to the left and falls to the right.

> **Watch out.** The degree is the **sum** of the powers, $3 + 2 = 5$, not their product and not the largest one. And the numbers inside the factors, such as $-1$ and $4$, only move the graph sideways; they do not change the end behavior.`,
        `端点行为只取决于首项，而乘积的首项不必展开就能求出。展开时，$x$ 的最高次幂来自把每个因式中的 $x$ 相乘，所以次数相加，前面的数再乘上去。

对于 $f(x) = -2(x - 1)^{3}(x + 4)^{2}$：因式 $(x - 1)^{3}$ 贡献 $x^{3}$，$(x + 4)^{2}$ 贡献 $x^{2}$，所以首项是 $-2x^{3} \\cdot x^{2} = -2x^{5}$。次数 $5$ 是奇数，$-2$ 是负数，所以图象左端上升、右端下降。

> **注意。** 次数是各因式次数之**和**，$3 + 2 = 5$，不是乘积，也不是其中较大的那个。因式里的数（如 $-1$ 和 $4$）只让图象左右移动，不改变端点行为。`,
      ],
      (rng) => {
        const a = nz(rng, 5);
        const m = rng.int(1, 4);
        const n = rng.int(1, 4);
        const p = rng.int(-8, 8);
        const q0 = rng.int(-8, 8);
        const q = q0 === p ? (p === 8 ? 7 : p + 1) : q0;
        const degree = m + n;
        const rightUp = a > 0;
        const leftUp = degree % 2 === 0 ? rightUp : !rightUp;
        const text = (l: boolean, r: boolean): Pair => [
          `${l ? "Rises" : "Falls"} to the left, ${r ? "rises" : "falls"} to the right`,
          `左端${l ? "上升" : "下降"}，右端${r ? "上升" : "下降"}`,
        ];
        return choose(
          rng,
          [
            `Describe the end behavior of $f(x) = ${a === 1 ? "" : a === -1 ? "-" : a}${factorOf(p)}${m === 1 ? "" : `^{${m}}`}${factorOf(q)}${n === 1 ? "" : `^{${n}}`}$.`,
            `描述 $f(x) = ${a === 1 ? "" : a === -1 ? "-" : a}${factorOf(p)}${m === 1 ? "" : `^{${m}}`}${factorOf(q)}${n === 1 ? "" : `^{${n}}`}$ 的端点行为。`,
          ],
          text(leftUp, rightUp),
          [text(!leftUp, rightUp), text(leftUp, !rightUp), text(!leftUp, !rightUp)],
          [
            `**Step 1: the leading term.** Each factor starts with $x$, so multiplying out, the highest power is $${m === 1 ? "x" : `x^{${m}}`} \\cdot ${n === 1 ? "x" : `x^{${n}}`} = x^{${degree}}$, the powers adding to $${m} + ${n} = ${degree}$. With the number in front, the leading term is $${a === 1 ? "" : a === -1 ? "-" : a}x^{${degree}}$.

**Step 2: the right end.** For a large positive $x$, $x^{${degree}}$ is positive and the coefficient $${a}$ is ${a > 0 ? "positive" : "negative"}, so the graph ${rightUp ? "rises" : "falls"} to the right.

**Step 3: the left end.** For a large negative $x$, $x^{${degree}}$ is ${degree % 2 === 0 ? "positive, since the degree is even" : "negative, since the degree is odd"}, so the graph ${leftUp ? "rises" : "falls"} to the left.

**Check.** At $x = 100$ every factor is positive, so the sign of $f(100)$ is the sign of $${a}$: ${a > 0 ? "positive" : "negative"}, matching a graph that ${rightUp ? "rises" : "falls"} to the right.`,
            `**第一步：求首项。** 每个因式都以 $x$ 开头，展开后最高次幂是 $${m === 1 ? "x" : `x^{${m}}`} \\cdot ${n === 1 ? "x" : `x^{${n}}`} = x^{${degree}}$，次数相加得 $${m} + ${n} = ${degree}$。乘上前面的数，首项是 $${a === 1 ? "" : a === -1 ? "-" : a}x^{${degree}}$。

**第二步：右端。** 当 $x$ 是很大的正数时，$x^{${degree}}$ 为正，系数 $${a}$ 为${a > 0 ? "正" : "负"}，所以图象右端${rightUp ? "上升" : "下降"}。

**第三步：左端。** 当 $x$ 是绝对值很大的负数时，${degree % 2 === 0 ? "次数为偶数" : "次数为奇数"}，$x^{${degree}}$ 为${degree % 2 === 0 ? "正" : "负"}，所以图象左端${leftUp ? "上升" : "下降"}。

**检验。** 当 $x = 100$ 时每个因式都是正数，所以 $f(100)$ 与 $${a}$ 同号，为${a > 0 ? "正" : "负"}，与右端${rightUp ? "上升" : "下降"}相符。`,
          ],
        );
      },
    ),
  ],
  "explicit-and-recursive-arithmetic-formulas": [
    skill(
      "a-far-term-from-a-recursive-rule",
      ["A far term from a recursive rule", "由递推式求很远的项"],
      [
        `A recursive rule would need every earlier term, one at a time. Converting it to an explicit formula reaches a far term in one step: from $a_1$ to $a_n$ the rule is used $n - 1$ times, so $n - 1$ differences are added to the first term. With $a_1 = 4$ and $a_n = a_{n-1} + 3$:

$$a_{100} = 4 + 99 \\cdot 3 = 4 + 297 = 301.$$

> **Watch out.** Multiply the difference by $n - 1$, not by $n$: the first term takes no step, and $4 + 100 \\cdot 3 = 304$ is $a_{101}$. Do not drop the first term either: $99 \\cdot 3 = 297$ is only the total change.`,
        `递推式要一项一项地算出前面所有的项。把它化成通项公式，一步就能得到很远的项：从 $a_1$ 到 $a_n$ 规则用了 $n - 1$ 次，所以首项加上 $n - 1$ 个公差。当 $a_1 = 4$，$a_n = a_{n-1} + 3$ 时：

$$a_{100} = 4 + 99 \\cdot 3 = 4 + 297 = 301.$$

> **注意。** 公差要乘以 $n - 1$ 而不是 $n$：首项不用走，$4 + 100 \\cdot 3 = 304$ 是 $a_{101}$。也不要丢掉首项：$99 \\cdot 3 = 297$ 只是总的变化量。`,
      ],
      (rng) => {
        const first = rng.int(-20, 20);
        const d = nz(rng, 9);
        const n = rng.int(20, 200);
        const value = first + (n - 1) * d;
        const step = d < 0 ? [`subtracting $${-d}$`, `减去 $${-d}$`] : [`adding $${d}$`, `加上 $${d}$`];
        return integer(
          [
            `A sequence has $a_1 = ${first}$ and $a_n = a_{n-1}${signed(d)}$. Find $a_{${n}}$.`,
            `数列满足 $a_1 = ${first}$，$a_n = a_{n-1}${signed(d)}$。求 $a_{${n}}$。`,
          ],
          value,
          [first + n * d, (n - 1) * d, first * n + d],
          [
            `The rule is arithmetic, each step ${step[0]}, so $d = ${d}$. From $a_1$ to $a_{${n}}$ the rule is used $${n} - 1 = ${n - 1}$ times, which the explicit formula $a_n = a_1 + (n - 1)d$ adds up at once:\n\n$$a_{${n}} = ${first} + ${n - 1} \\cdot ${paren(d)} = ${first}${signed((n - 1) * d)} = ${value}$$\n\n**Check.** The change from $a_1$ is $${value} - ${paren(first)} = ${value - first}$, and $${value - first} \\div ${paren(d)} = ${n - 1}$ steps, one for each term after the first.`,
            `这是等差的规则，每一步${step[1]}，所以 $d = ${d}$。从 $a_1$ 到 $a_{${n}}$ 规则用了 $${n} - 1 = ${n - 1}$ 次，通项公式 $a_n = a_1 + (n - 1)d$ 一次就把它们加起来：\n\n$$a_{${n}} = ${first} + ${n - 1} \\cdot ${paren(d)} = ${first}${signed((n - 1) * d)} = ${value}$$\n\n**检验。** 相对 $a_1$ 的变化量是 $${value} - ${paren(first)} = ${value - first}$，而 $${value - first} \\div ${paren(d)} = ${n - 1}$ 步，首项之后的每一项各一步。`,
          ],
        );
      },
    ),
  ],
  "many-variable-equations": [
    skill(
      "factoring-out-the-letter",
      ["Factoring out the letter", "提取字母"],
      [
        `When the wanted letter appears in two terms, it cannot be isolated by dividing one coefficient away. Gather those terms on one side and everything else on the other, then factor the letter out: the distributive law read backwards turns $ax - cx$ into $x(a - c)$. Only then can you divide by the other factor, which is assumed to be nonzero.

Solve $ax + b = cx + d$ for $x$. Subtract $cx$ and $b$ from both sides: $ax - cx = d - b$. Factor: $x(a - c) = d - b$. Divide by $a - c$: $x = \\frac{d - b}{a - c}$. With numbers, $a = 5$, $b = 1$, $c = 2$, $d = 7$, this gives $x = \\frac{6}{3} = 2$, and indeed $5 \\cdot 2 + 1 = 11 = 2 \\cdot 2 + 7$.

> **Watch out.** Keep the order of each subtraction: moving $b$ to the right gives $d - b$, not $b - d$. And the factor left after taking out $x$ is $a - c$, a difference, not the product $ac$ or the sum $a + c$.`,
        `要求的字母出现在两项中时，不能靠除以一个系数把它单独留下。先把这两项移到同一边、其余各项移到另一边，再提取这个字母：把分配律反过来用，$ax - cx$ 就成了 $x(a - c)$。这时才能除以另一个因式（假定它不为零）。

由 $ax + b = cx + d$ 解出 $x$。两边都减去 $cx$ 和 $b$：$ax - cx = d - b$。提取 $x$：$x(a - c) = d - b$。除以 $a - c$：$x = \\frac{d - b}{a - c}$。代入数，$a = 5$，$b = 1$，$c = 2$，$d = 7$，得 $x = \\frac{6}{3} = 2$，确实 $5 \\cdot 2 + 1 = 11 = 2 \\cdot 2 + 7$。

> **注意。** 每个减法的顺序都要保持：把 $b$ 移到右边得 $d - b$，不是 $b - d$。提取 $x$ 后剩下的因式是差 $a - c$，不是积 $ac$，也不是和 $a + c$。`,
      ],
      (rng) => {
        const [x, a, b, c, d] = rng.sample(["x", "y", "z", "w", "k", "m", "n", "p", "q", "r", "s", "t", "u", "v"], 5) as [
          string,
          string,
          string,
          string,
          string,
        ];
        return chooseFilled(
          rng,
          [
            `Solve $${a}${x} + ${b} = ${c}${x} + ${d}$ for $${x}$. Assume no variable you divide by is zero.`,
            `解出 $${x}$：$${a}${x} + ${b} = ${c}${x} + ${d}$。假定除数不为零。`,
          ],
          `${x} = ${frac(`${d} - ${b}`, `${a} - ${c}`)}`,
          [
            `${x} = ${frac(`${d} + ${b}`, `${a} + ${c}`)}`,
            `${x} = ${frac(`${b} - ${d}`, `${a} - ${c}`)}`,
            `${x} = ${frac(`${d} - ${b}`, `${a}${c}`)}`,
          ],
          [
            `**Gather the $${x}$ terms.** Subtract $${c}${x}$ and $${b}$ from both sides, so that every term with $${x}$ is on the left: $$${a}${x} - ${c}${x} = ${d} - ${b}.$$

**Factor and divide.** Taking $${x}$ out of both terms gives $${x}(${a} - ${c}) = ${d} - ${b}$. Dividing by $${a} - ${c}$, assumed nonzero: $$${x} = ${frac(`${d} - ${b}`, `${a} - ${c}`)}.$$

**Check.** Put it back into the equation. The left side minus the right side is $(${a} - ${c})${x} - (${d} - ${b})$, and with this $${x}$ that is $(${a} - ${c}) \\cdot ${frac(`${d} - ${b}`, `${a} - ${c}`)} - (${d} - ${b}) = (${d} - ${b}) - (${d} - ${b}) = 0$, so the two sides are equal.`,
            `**把含 $${x}$ 的项移到一边。** 两边都减去 $${c}${x}$ 和 $${b}$，使含 $${x}$ 的项都在左边：$$${a}${x} - ${c}${x} = ${d} - ${b}.$$

**提取再相除。** 从两项中提取 $${x}$，得 $${x}(${a} - ${c}) = ${d} - ${b}$。两边除以 $${a} - ${c}$（假定不为零）：$$${x} = ${frac(`${d} - ${b}`, `${a} - ${c}`)}.$$

**检验。** 代回原方程。左边减右边是 $(${a} - ${c})${x} - (${d} - ${b})$，代入这个 $${x}$ 得 $(${a} - ${c}) \\cdot ${frac(`${d} - ${b}`, `${a} - ${c}`)} - (${d} - ${b}) = (${d} - ${b}) - (${d} - ${b}) = 0$，所以两边相等。`,
          ],
        );
      },
    ),
  ],
  "metric-units-of-length": [
    skill(
      "adding-lengths-in-two-units",
      ["Adding lengths in two units", "不同单位的长度相加"],
      [
        `Lengths can be added only when they are in the same unit, just as $3$ apples and $2$ pears are not $5$ of either. A kilometer is $1000$ times as long as a meter, so each kilometer is $1000$ meters: convert the kilometers by **multiplying** by $1000$, and then add the meters.

A walk of $2.4\\text{ km}$ and then $350\\text{ m}$ is $2.4 \\cdot 1000 = 2400\\text{ m}$ and $350\\text{ m}$, so $2400 + 350 = 2750\\text{ m}$ in all.

> **Watch out.** Adding the numbers as they stand, $2.4 + 350$, mixes the units. Multiply by $1000$, not $100$: $2.4\\text{ km}$ is $2400$ m, not $240$ m. And mind the decimal point: $2.4 \\cdot 1000$ is $2400$, not $24000$.`,
        `长度必须化成同一单位才能相加，就像 $3$ 个苹果和 $2$ 个梨不是 $5$ 个苹果。$1$ 千米是 $1$ 米的 $1000$ 倍长，所以每千米是 $1000$ 米：千米数要**乘** $1000$ 化成米，再与米数相加。

先走 $2.4\\text{ km}$ 再走 $350\\text{ m}$，就是 $2.4 \\cdot 1000 = 2400\\text{ m}$ 加 $350\\text{ m}$，共 $2400 + 350 = 2750\\text{ m}$。

> **注意。** 直接把数相加，$2.4 + 350$，是把不同单位混在一起。要乘 $1000$ 而不是 $100$：$2.4\\text{ km}$ 是 $2400$ m，不是 $240$ m。还要注意小数点：$2.4 \\cdot 1000$ 是 $2400$，不是 $24000$。`,
      ],
      (rng) => {
        const k = rng.int(11, 99);
        const m = rng.int(10, 99) * 10;
        return whole(
          [
            `A runner goes $${k / 10}\\text{ km}$ and then $${m}\\text{ m}$. How many meters is that in all?`,
            `一名跑者先跑 $${k / 10}\\text{ km}$，再跑 $${m}\\text{ m}$。一共多少米？`,
          ],
          k * 100 + m,
          [k * 10 + m, k * 1000 + m, k + m],
          [
            `**Step 1: convert the kilometers.** A kilometer is $1000$ m, a larger unit, so the number of meters is bigger: $${k / 10}\\text{ km} = ${k / 10} \\cdot 1000\\text{ m} = ${k * 100}\\text{ m}$.

**Step 2: add.** Both lengths are now in meters: $${k * 100} + ${m} = ${k * 100 + m}\\text{ m}$.

**Check.** Going back, $${k * 100 + m}\\text{ m} = ${(k * 100 + m) / 1000}\\text{ km}$, which is the $${k / 10}$ km run plus the $${m / 1000}$ km of the $${m}$ m.`,
            `**第一步：换算千米。** $1$ 千米是 $1000$ 米，千米是较大的单位，所以米数更大：$${k / 10}\\text{ km} = ${k / 10} \\cdot 1000\\text{ m} = ${k * 100}\\text{ m}$。

**第二步：相加。** 现在两段长度都以米为单位：$${k * 100} + ${m} = ${k * 100 + m}\\text{ m}$。

**检验。** 换算回去，$${k * 100 + m}\\text{ m} = ${(k * 100 + m) / 1000}\\text{ km}$，正是 $${k / 10}$ km 加上 $${m}$ m 即 $${m / 1000}$ km。`,
          ],
        );
      },
    ),
  ],
  "metric-units-of-mass": [
    skill(
      "the-total-mass-of-many-items",
      ["The total mass of many items", "许多物品的总质量"],
      [
        `Small items are weighed in grams, but the total of many of them reads better in kilograms. First multiply to find the total in grams. Then convert: a kilogram is $1000$ times as heavy as a gram, so every $1000$ g make one kg, and we **divide** by $1000$.

Twelve apples of $150\\text{ g}$ weigh $12 \\cdot 150 = 1800\\text{ g}$ together, and $1800 \\div 1000 = 1.8\\text{ kg}$.

> **Watch out.** Divide by $1000$, not by $100$ or $10000$: a kilogram is a thousand grams. And do not stop at $1800$, which is the total in grams, not in kilograms.`,
        `小物品用克来称，而许多件的总量用千克更清楚。先相乘得到总克数。再换算：$1$ 千克是 $1$ 克的 $1000$ 倍重，所以每 $1000$ g 合成 $1$ kg，要**除以** $1000$。

十二个 $150\\text{ g}$ 的苹果共重 $12 \\cdot 150 = 1800\\text{ g}$，而 $1800 \\div 1000 = 1.8\\text{ kg}$。

> **注意。** 要除以 $1000$，不是 $100$ 或 $10000$：$1$ 千克是 $1000$ 克。也不要停在 $1800$，那是总克数，不是千克数。`,
      ],
      (rng) => {
        const n = rng.int(3, 40);
        const g = rng.int(12, 95) * 5;
        return decimal(
          [
            `Each of $${n}$ books has a mass of $${g}\\text{ g}$. What is their total mass in kilograms?`,
            `$${n}$ 本书每本的质量是 $${g}\\text{ g}$。它们的总质量是多少千克？`,
          ],
          Q.of(n * g, 1000),
          [Q.of(n * g, 100), Q.of(n * g, 10000), Q.of(n * g)],
          [
            `**Step 1: the total in grams.** $${n}$ books of $${g}$ g each weigh $${n} \\times ${g} = ${n * g}\\text{ g}$.

**Step 2: convert to kilograms.** A kilogram is $1000$ g, a larger unit, so the number gets smaller: $${n * g} \\div 1000 = ${(n * g) / 1000}\\text{ kg}$.

**Check.** Each book is $${g / 1000}$ kg, so $${n}$ of them are $${n}$ times that, $${(n * g) / 1000}$ kg; and $${(n * g) / 1000} \\cdot 1000 = ${n * g}$ g.`,
            `**第一步：总克数。** $${n}$ 本书每本 $${g}$ g，共重 $${n} \\times ${g} = ${n * g}\\text{ g}$。

**第二步：换算成千克。** $1$ 千克是 $1000$ g，千克是较大的单位，所以数变小：$${n * g} \\div 1000 = ${(n * g) / 1000}\\text{ kg}$。

**检验。** 每本书是 $${g / 1000}$ kg，$${n}$ 本就是它的 $${n}$ 倍，即 $${(n * g) / 1000}$ kg；而 $${(n * g) / 1000} \\cdot 1000 = ${n * g}$ g。`,
          ],
        );
      },
    ),
  ],
  "modeling-using-the-law-of-sines": [
    {
      ...skill(
        "how-many-triangles-fit",
        ["How many triangles fit", "能构成几个三角形"],
        [
          "Given two sides and an angle opposite one of them, the law of sines may give no triangle, one or two. Compare the side opposite with the height $b\\sin A$ and with the other side $b$.",
          "已知两边和其中一边的对角时，由正弦定理可能得到零个、一个或两个三角形。把这个对边与高 $b\\sin A$ 和另一条边 $b$ 比较。",
        ],
        (rng) => {
          const b = 2 * rng.int(3, 30);
          const height = b / 2;
          const a = rng.pick([rng.int(1, height - 1), height, rng.int(height + 1, b - 1), b + rng.int(1, 9)]);
          const count = a < height ? 0 : a === height ? 1 : a < b ? 2 : 1;
          return whole(
            [
              `A surveyor measures $A = 30^{\\circ}$, side $b = ${b}$ and the side opposite $A$ as $a = ${a}$. How many different triangles fit these measurements?`,
              `测量员测得 $A = 30^{\\circ}$，边 $b = ${b}$，$A$ 的对边 $a = ${a}$。有多少个不同的三角形符合这些数据？`,
            ],
            count,
            [0, 1, 2].filter((n) => n !== count),
            a < height
              ? [
                  `The height is $${b} \\sin 30^{\\circ} = ${height}$. Since $a = ${a} < ${height}$, the side is too short to reach the base line, so there are $0$ triangles.`,
                  `高是 $${b} \\sin 30^{\\circ} = ${height}$。因为 $a = ${a} < ${height}$，这条边够不到底边所在直线，所以有 $0$ 个三角形。`,
                ]
              : a === height
                ? [
                    `The height is $${b} \\sin 30^{\\circ} = ${height}$. Since $a$ equals the height, the side just reaches the base line at a right angle, so there is $1$ triangle.`,
                    `高是 $${b} \\sin 30^{\\circ} = ${height}$。因为 $a$ 等于高，这条边恰好垂直地碰到底边所在直线，所以有 $1$ 个三角形。`,
                  ]
                : a < b
                  ? [
                      `The height is $${b} \\sin 30^{\\circ} = ${height}$. Since $${height} < ${a} < ${b}$, the side meets the base line at two points on the same side of $A$, so there are $2$ triangles.`,
                      `高是 $${b} \\sin 30^{\\circ} = ${height}$。因为 $${height} < ${a} < ${b}$，这条边与底边所在直线在 $A$ 的同一侧有两个交点，所以有 $2$ 个三角形。`,
                    ]
                  : [
                      `The height is $${b} \\sin 30^{\\circ} = ${height}$. Since $a = ${a} > ${b}$, the side meets the base line at two points, but only one is on the correct side of $A$, so there is $1$ triangle.`,
                      `高是 $${b} \\sin 30^{\\circ} = ${height}$。因为 $a = ${a} > ${b}$，这条边与底边所在直线有两个交点，但只有一个在 $A$ 的正确一侧，所以有 $1$ 个三角形。`,
                    ],
          );
        },
      ),
      figure: trigDrawings["modeling-using-the-law-of-sines#how-many-triangles-fit"],
    },
  ],
  "modeling-with-inverse-variation": [
    skill(
      "inverse-square-models",
      ["Inverse square models", "反平方模型"],
      [
        `Some quantities vary inversely with the **square** of another: $y = \\frac{c}{x^{2}}$. The light of a lamp is like this, since it spreads over a sphere whose area grows like the square of the distance. Multiplying $x$ by $k$ then multiplies $x^{2}$ by $k^{2}$, so $y$ is **divided** by $k^{2}$.

At $2$ m a lamp gives $36$ units of brightness; at $6$ m, three times as far, it gives $36 \\div 3^{2} = 36 \\div 9 = 4$ units.

> **Watch out.** Dividing by $3$ alone, giving $12$, treats the model as plain inverse variation; the square makes the light fade faster. And a farther lamp looks dimmer, so the answer is smaller than $36$, never larger.`,
        `有些量与另一个量的**平方**成反比：$y = \\frac{c}{x^{2}}$。灯光就是这样，因为光分布在球面上，而球面的面积随距离的平方增长。$x$ 乘 $k$ 时，$x^{2}$ 乘 $k^{2}$，所以 $y$ 要**除以** $k^{2}$。

一盏灯在 $2$ 米处亮度是 $36$ 单位；在 $6$ 米处，距离是三倍，亮度是 $36 \\div 3^{2} = 36 \\div 9 = 4$ 单位。

> **注意。** 只除以 $3$ 得 $12$，是把它当成了普通的反比例；平方使亮度减弱得更快。而且离灯越远越暗，所以答案比 $36$ 小，绝不会更大。`,
      ],
      (rng) => {
        const k = rng.int(2, 6);
        const m = rng.int(2, 20);
        const d = rng.int(1, 9);
        const start = k * k * m;
        return whole(
          [
            `The brightness of a lamp varies inversely with the square of the distance from it. At $${d}$ m it is $${start}$ units. What is it at $${k * d}$ m?`,
            `灯的亮度与到灯的距离的平方成反比。在 $${d}$ 米处亮度是 $${start}$ 单位。在 $${k * d}$ 米处是多少？`,
          ],
          m,
          [k * m, start * k, start - k],
          [
            `**Step 1: the factor on the distance.** The distance goes from $${d}$ m to $${k * d}$ m, so it is multiplied by $${k * d} \\div ${d} = ${k}$.

**Step 2: divide by its square.** The brightness varies inversely with the square of the distance, so it is divided by $${k}^{2} = ${k * k}$: $${start} \\div ${k * k} = ${m}$ units.

**Check.** By the formula, $c = ${start} \\cdot ${d}^{2} = ${start * d * d}$, and at $${k * d}$ m the brightness is $\\frac{${start * d * d}}{${k * d}^{2}} = \\frac{${start * d * d}}{${k * k * d * d}} = ${m}$, dimmer than before.`,
            `**第一步：距离的倍数。** 距离从 $${d}$ 米变成 $${k * d}$ 米，乘了 $${k * d} \\div ${d} = ${k}$。

**第二步：除以它的平方。** 亮度与距离的平方成反比，所以除以 $${k}^{2} = ${k * k}$：$${start} \\div ${k * k} = ${m}$ 单位。

**检验。** 由公式，$c = ${start} \\cdot ${d}^{2} = ${start * d * d}$，在 $${k * d}$ 米处亮度是 $\\frac{${start * d * d}}{${k * d}^{2}} = \\frac{${start * d * d}}{${k * k * d * d}} = ${m}$，比原来暗。`,
          ],
        );
      },
    ),
  ],
  "piecewise-functions": [
    skill(
      "solving-an-equation-in-pieces",
      ["Solving an equation in pieces", "分段解方程"],
      [
        `Each formula of a piecewise function speaks only for its own part of the domain. So to solve an equation, solve it with **each** formula separately, then keep a solution only if it lies in the part where that formula applies.

Take $f(x) = 2x + 1$ if $x < 3$ and $f(x) = x + 4$ if $x \\ge 3$, and solve $f(x) = 5$. The first formula gives $2x + 1 = 5$, so $x = 2$; since $2 < 3$, this formula really does apply there, and $x = 2$ is a solution. The second gives $x + 4 = 5$, so $x = 1$; but $1$ is not $\\ge 3$, so at $x = 1$ the function uses the other formula, and $x = 1$ is rejected.

> **Watch out.** Solving each piece's equation is only half the work: a value outside its piece's condition is not a solution, however neatly it came out. Check every candidate against its own condition.`,
        `分段函数的每个公式只管它自己那一部分定义域。所以解方程时，要用**每个**公式分别求解，然后只保留落在该公式适用范围内的解。

设 $x < 3$ 时 $f(x) = 2x + 1$，$x \\ge 3$ 时 $f(x) = x + 4$，解 $f(x) = 5$。第一个公式给出 $2x + 1 = 5$，得 $x = 2$；因为 $2 < 3$，这个公式在那里确实适用，所以 $x = 2$ 是解。第二个公式给出 $x + 4 = 5$，得 $x = 1$；但 $1$ 不满足 $\\ge 3$，在 $x = 1$ 处函数用的是另一个公式，所以舍去 $x = 1$。

> **注意。** 解出每一段的方程只是完成了一半：不满足这一段条件的值不是解，不管它算得多么整齐。每个候选值都要用它自己那一段的条件检验。`,
      ],
      (rng) => {
        const c = rng.int(-4, 6);
        const a = rng.int(2, 6);
        const d = rng.int(2, 6);
        const x1 = c - rng.int(1, 5);
        const x2 = x1 - rng.int(1, 4);
        const b = nz(rng, 9);
        const v = a * x1 + b;
        const e = v - d * x2 === 0 ? 1 : v - d * x2;
        const second = (v - e) / d;
        return integer(
          [
            `Let $f(x) = ${a}x${signed(b)}$ if $x < ${c}$ and $f(x) = ${d}x${signed(e)}$ if $x \\ge ${c}$. Solve $f(x) = ${v}$.`,
            `设 $x < ${c}$ 时 $f(x) = ${a}x${signed(b)}$，$x \\ge ${c}$ 时 $f(x) = ${d}x${signed(e)}$。解 $f(x) = ${v}$。`,
          ],
          x1,
          [Number.isInteger(second) ? second : x2, c, v],
          [
            `**Step 1: the first piece.** Solve $${a}x${signed(b)} = ${v}$: ${b > 0 ? `subtract $${b}$` : `add $${-b}$`} to get $${a}x = ${v - b}$, then divide by $${a}$: $x = ${x1}$. Since $${x1} < ${c}$, this piece applies there, so $x = ${x1}$ is a solution.

**Step 2: the second piece.** Solve $${d}x${signed(e)} = ${v}$: ${e > 0 ? `subtract $${e}$` : `add $${-e}$`} to get $${d}x = ${v - e}$, then divide by $${d}$: $x = ${Q.of(v - e, d).toLatex()}$. This is less than $${c}$, so it fails $x \\ge ${c}$ and is rejected.

**Check.** $f(${x1}) = ${a}(${x1})${signed(b)} = ${a * x1}${signed(b)} = ${v}$, using the first formula because $${x1} < ${c}$.`,
            `**第一步：第一段。** 解 $${a}x${signed(b)} = ${v}$：${b > 0 ? `两边减去 $${b}$` : `两边加上 $${-b}$`}得 $${a}x = ${v - b}$，再除以 $${a}$：$x = ${x1}$。因为 $${x1} < ${c}$，这一段在那里适用，所以 $x = ${x1}$ 是解。

**第二步：第二段。** 解 $${d}x${signed(e)} = ${v}$：${e > 0 ? `两边减去 $${e}$` : `两边加上 $${-e}$`}得 $${d}x = ${v - e}$，再除以 $${d}$：$x = ${Q.of(v - e, d).toLatex()}$。它小于 $${c}$，不满足 $x \\ge ${c}$，所以舍去。

**检验。** $f(${x1}) = ${a}(${x1})${signed(b)} = ${a * x1}${signed(b)} = ${v}$，因为 $${x1} < ${c}$，用的是第一个公式。`,
          ],
        );
      },
    ),
  ],
  "range-advanced-cases": [
    {
      ...skill(
        "the-range-of-a-reciprocal-function",
        ["The range of a reciprocal function", "倒数函数的值域"],
        [
          `A fraction is zero only when its top is zero. So a fraction whose top is a nonzero constant, such as $\\frac{6}{x - 2}$, is **never** $0$. It takes every other value: to get $3$, solve $\\frac{6}{x - 2} = 3$, which gives $x - 2 = 2$, so $x = 4$; any nonzero target works the same way.

So $f(x) = \\frac{6}{x - 2} + 1$ takes every value except $0 + 1 = 1$: its range is all real numbers except $1$. On the graph, $y = 1$ is the horizontal asymptote, the height the graph approaches but never reaches.

> **Watch out.** The excluded output is the number **added**, $1$, not the $2$ in the denominator: $x = 2$ is the input left out of the domain, the vertical asymptote. And the range is not just $y > 1$: the fraction is negative for $x < 2$, so outputs below $1$ occur too.`,
          `分数为零当且仅当分子为零。所以分子是非零常数的分数，例如 $\\frac{6}{x - 2}$，**永远**不等于 $0$。其他值它都能取到：要得到 $3$，解 $\\frac{6}{x - 2} = 3$，得 $x - 2 = 2$，即 $x = 4$；任何非零的目标值都可以这样得到。

所以 $f(x) = \\frac{6}{x - 2} + 1$ 取到除 $0 + 1 = 1$ 以外的所有值：它的值域是除 $1$ 以外的全体实数。在图象上，$y = 1$ 是水平渐近线，即图象无限接近却达不到的高度。

> **注意。** 取不到的输出是**加上**的那个数 $1$，而不是分母里的 $2$：$x = 2$ 是定义域中去掉的输入，是竖直渐近线。另外，值域不只是 $y > 1$：当 $x < 2$ 时分数为负，所以小于 $1$ 的输出也会出现。`,
        ],
        (rng) => {
          const a = nz(rng, 9);
          let h = nz(rng, 9);
          const k = nz(rng, 9);
          if (h === k) h = -h;
          const den = factorOf(h).replace(/[()]/g, "");
          return chooseFilled(
            rng,
            [
              `Find the range of $f(x) = ${frac(a, factorOf(h).replace(/[()]/g, ""))}${signed(k)}$.`,
              `求 $f(x) = ${frac(a, factorOf(h).replace(/[()]/g, ""))}${signed(k)}$ 的值域。`,
            ],
            `y \\ne ${k}`,
            [`y \\ne ${h}`, `y > ${k}`, `\\text{all real numbers}`],
            [
              `**Step 1: the fraction.** The top of $\\frac{${a}}{${den}}$ is $${a}$, which is not zero, so the fraction is never $0$. It takes every other value: for any nonzero $c$, the input $x = ${h} + \\frac{${a}}{c}$ gives exactly $c$.

**Step 2: add the constant.** $f(x)$ is the fraction ${k < 0 ? `minus $${-k}$` : `plus $${k}$`}, so it takes every value except $0${signed(k)} = ${k}$. The range is $y \\ne ${k}$.

**Check.** Setting $f(x) = ${k}$ would need $\\frac{${a}}{${den}} = 0$, impossible. A nearby value is reached: $f(${h + a}) = \\frac{${a}}{${a}}${signed(k)} = ${k + 1}$.`,
              `**第一步：看分数。** $\\frac{${a}}{${den}}$ 的分子是 $${a}$，不为零，所以分数永远不等于 $0$。其他值它都能取到：对任何非零的 $c$，输入 $x = ${h} + \\frac{${a}}{c}$ 恰好得到 $c$。

**第二步：加上常数。** $f(x)$ 等于分数${k < 0 ? `减 $${-k}$` : `加 $${k}$`}，所以取到除 $0${signed(k)} = ${k}$ 以外的所有值。值域是 $y \\ne ${k}$。

**检验。** 要使 $f(x) = ${k}$，需要 $\\frac{${a}}{${den}} = 0$，这不可能。附近的值能取到：$f(${h + a}) = \\frac{${a}}{${a}}${signed(k)} = ${k + 1}$。`,
            ],
          );
        },
      ),
      figure: algebraDrawings["range-advanced-cases#the-range-of-a-reciprocal-function"],
    },
  ],
  "recursive-formulas-for-arithmetic-sequences": [
    skill(
      "the-difference-from-two-distant-terms",
      ["The difference from two distant terms", "由相隔的两项求公差"],
      [
        `Between two terms of an arithmetic sequence, the rule adds $d$ once for every step, and from $a_m$ to $a_{m+s}$ there are $s$ steps. So the change in value is $s$ times $d$, and dividing the change by the number of steps gives the rule. If $a_2 = 5$ and $a_7 = 30$, there are $7 - 2 = 5$ steps:

$$5d = 30 - 5 = 25, \\qquad d = 5.$$

> **Watch out.** The change, $25$, is not $d$: it is $d$ added five times. Count the steps as the difference of the indexes, and subtract the earlier term from the later one, so that a decrease gives a negative $d$.`,
        `在等差数列的两项之间，规则每走一步加一次 $d$，从 $a_m$ 到 $a_{m+s}$ 共 $s$ 步。所以数值的变化是 $s$ 个 $d$，用变化量除以步数就得到递推规则。若 $a_2 = 5$，$a_7 = 30$，共 $7 - 2 = 5$ 步：

$$5d = 30 - 5 = 25, \\qquad d = 5.$$

> **注意。** 变化量 $25$ 不是 $d$：它是 $d$ 加了五次。步数是两个下标之差；要用较后的项减去较前的项，这样数值减少时 $d$ 为负。`,
      ],
      (rng) => {
        const m = rng.int(1, 12);
        const steps = rng.int(2, 12);
        const d = nz(rng, 9);
        const first = rng.int(-30, 30);
        const last = first + steps * d;
        return integer(
          [
            `A sequence follows $a_n = a_{n-1} + d$, with $a_{${m}} = ${first}$ and $a_{${m + steps}} = ${last}$. Find $d$.`,
            `数列满足 $a_n = a_{n-1} + d$，$a_{${m}} = ${first}$，$a_{${m + steps}} = ${last}$。求 $d$。`,
          ],
          d,
          [steps * d, -d, d + steps],
          [
            `From $a_{${m}}$ to $a_{${m + steps}}$ there are $${m + steps} - ${m} = ${steps}$ steps, and each adds $d$, so the change is $${steps}d$:\n\n$$${steps}d = ${last} - ${paren(first)} = ${steps * d}$$\n\nDividing by the number of steps, $d = ${steps * d} \\div ${steps} = ${d}$.\n\n**Check.** Adding $${steps}$ steps of $${d}$ to $a_{${m}}$: $${first} + ${steps} \\cdot ${paren(d)} = ${last}$, the given $a_{${m + steps}}$.`,
            `从 $a_{${m}}$ 到 $a_{${m + steps}}$ 共 $${m + steps} - ${m} = ${steps}$ 步，每步加 $d$，所以变化量是 $${steps}d$：\n\n$$${steps}d = ${last} - ${paren(first)} = ${steps * d}$$\n\n除以步数，$d = ${steps * d} \\div ${steps} = ${d}$。\n\n**检验。** 在 $a_{${m}}$ 上加 $${steps}$ 步、每步 $${d}$：$${first} + ${steps} \\cdot ${paren(d)} = ${last}$，正是所给的 $a_{${m + steps}}$。`,
          ],
        );
      },
    ),
  ],
  "solving-for-variables-in-arithmetic-sequences": [
    skill(
      "three-terms-with-a-known-sum",
      ["Three terms with a known sum", "和已知的三项"],
      [
        "Writing three consecutive terms as $m - d$, $m$ and $m + d$ makes the differences cancel in the sum: $(m - d) + m + (m + d) = 3m$. So the middle term is one third of the sum, and the others follow from it. If three terms add up to $36$ with common difference $5$, the middle term is $36 \\div 3 = 12$ and the terms are $7, 12, 17$.\n\n> **Watch out.** One third of the sum is the middle term, not the smallest: the smallest is one common difference below it, $12 - 5 = 7$. And subtracting $d$ from the whole sum, $36 - 5$, skips the division by $3$.",
        "把连续三项写成 $m - d$、$m$、$m + d$，求和时公差就抵消了：$(m - d) + m + (m + d) = 3m$。所以中间一项是和的三分之一，其他两项由它得出。若三项之和是 $36$，公差是 $5$，中间一项是 $36 \\div 3 = 12$，三项是 $7, 12, 17$。\n\n> **注意。** 和的三分之一是中间一项，不是最小的一项：最小的一项比它小一个公差，$12 - 5 = 7$。用整个和减去 $d$，即 $36 - 5$，漏掉了除以 $3$ 这一步。",
      ],
      (rng) => {
        const m = rng.int(-20, 30);
        const d = rng.int(1, 12);
        const [lead, ...rest] = [m - d, m, m + d].filter((v) => v !== 0);
        const sum = `${lead}${rest.map((v) => signed(v)).join("")}`;
        return integer(
          [
            `Three consecutive terms of an arithmetic sequence add up to $${3 * m}$, and the common difference is $${d}$. Find the smallest term.`,
            `等差数列连续三项的和是 $${3 * m}$，公差是 $${d}$。求最小的一项。`,
          ],
          m - d,
          [m, m + d, 3 * m - d],
          [
            `**Step 1: the middle term.** Write the terms as $m - d$, $m$ and $m + d$. Their sum is $3m$, so the middle term is $${3 * m} \\div 3 = ${m}$.\n\n**Step 2: the smallest term.** The smallest is one common difference below the middle: $${m} - ${d} = ${m - d}$.\n\n**Check.** The terms are $${m - d}, ${m}, ${m + d}$, and $${sum} = ${3 * m}$.`,
            `**第一步：中间一项。** 把三项写成 $m - d$、$m$、$m + d$。它们的和是 $3m$，所以中间一项是 $${3 * m} \\div 3 = ${m}$。\n\n**第二步：最小的一项。** 最小的一项比中间一项小一个公差：$${m} - ${d} = ${m - d}$。\n\n**检验。** 三项是 $${m - d}, ${m}, ${m + d}$，且 $${sum} = ${3 * m}$。`,
          ],
        );
      },
    ),
  ],
  "speed-time-graphs": [
    {
      ...skill(
        "distance-from-the-area",
        ["Distance from the area", "由面积求路程"],
        [
          "The area under a speed-time graph is the distance traveled, because speed times time is distance. A speed-up from rest makes a triangle, and steady speed makes a rectangle.",
          "速度-时间图象下方的面积就是路程，因为速度乘时间就是路程。从静止加速得到三角形，匀速得到矩形。",
        ],
        (rng) => {
          const v = 2 * rng.int(1, 15);
          const t = rng.int(2, 20);
          const s = rng.int(2, 30);
          return whole(
            [
              `A speed-time graph rises in a straight line from $0$ to $${v}$ m/s over $${t}$ s, and then stays level for $${s}$ s. How far does the object travel, in meters?`,
              `速度-时间图象在 $${t}$ 秒内从 $0$ 沿直线升到 $${v}$ 米/秒，然后保持水平 $${s}$ 秒。物体走了多少米？`,
            ],
            (v * t) / 2 + v * s,
            [v * t + v * s, v * s, (v * (t + s)) / 2],
            [
              `The area under the graph is the distance. The triangle has area $${(v * t) / 2}$ and the rectangle has area $${v * s}$, so the total is $${(v * t) / 2 + v * s}$ m.`,
              `图象下方的面积就是路程。三角形面积是 $${(v * t) / 2}$，矩形面积是 $${v * s}$，所以总路程是 $${(v * t) / 2 + v * s}$ 米。`,
            ],
          );
        },
      ),
      figure: algebraDrawings["speed-time-graphs#distance-from-the-area"],
    },
  ],
  "systems-with-decimal-coefficients": [
    skill(
      "a-mixture-system",
      ["A mixture system", "混合问题的方程组"],
      [
        `Mixture problems give one equation for the total amount and one for the amount of the ingredient. A $10\\%$ solution contains $0.1$ of its volume as the ingredient, so the second equation has decimal coefficients, and multiplying it by a power of $10$ clears them.

Say $5$ liters of a $20\\%$ solution and $x$ liters of a $50\\%$ solution together hold $2.5$ liters of acid. The acid equation is $0.2 \\cdot 5 + 0.5x = 2.5$; times $10$ it is $10 + 5x = 25$, so $x = 3$. Check: $1 + 1.5 = 2.5$.

> **Watch out.** Write each percentage as a decimal, $30\\%$ as $0.3$, and multiply the right side by $10$ as well. And answer the question asked: the problem may want $y$, not $x$.`,
        `混合问题有一个关于总量的方程，还有一个关于成分含量的方程。浓度 $10\\%$ 的溶液中，成分占体积的 $0.1$，所以第二个方程的系数是小数，把它乘以 $10$ 的幂就能去掉小数。

比如 $5$ 升浓度 $20\\%$ 的溶液和 $x$ 升浓度 $50\\%$ 的溶液共含 $2.5$ 升酸。酸的方程是 $0.2 \\cdot 5 + 0.5x = 2.5$，乘以 $10$ 得 $10 + 5x = 25$，所以 $x = 3$。检验：$1 + 1.5 = 2.5$。

> **注意。** 每个百分数都写成小数，$30\\%$ 写成 $0.3$，右边也要乘以 $10$。还要回答题目问的量：题目可能要的是 $y$，不是 $x$。`,
      ],
      (rng) => {
        const x = rng.int(1, 40);
        const y = rng.int(1, 40);
        const total = x + y;
        const acid = (x + 3 * y) / 10;
        return whole(
          [
            `$${total}$ liters of a mixture contain $${acid}$ liters of acid. It was made from $x$ liters of a $10\\%$ solution and $y$ liters of a $30\\%$ solution. Find $y$.`,
            `$${total}$ 升混合液含 $${acid}$ 升酸，由 $x$ 升浓度 $10\\%$ 的溶液和 $y$ 升浓度 $30\\%$ 的溶液配成。求 $y$。`,
          ],
          y,
          [x, Math.round(acid), total - Math.round(acid)],
          [
            `**Write the equations.** The volumes add to the total, and the acid in each part adds to the acid in the mixture: $$x + y = ${total}, \\qquad 0.1x + 0.3y = ${acid}.$$

**Clear the decimals.** Multiply the second equation by $10$: $x + 3y = ${x + 3 * y}$.

**Eliminate $x$.** Subtract the first equation: $2y = ${x + 3 * y} - ${total} = ${2 * y}$, so $y = ${y}$.

**Check.** Then $x = ${total} - ${y} = ${x}$, and the acid is $0.1 \\cdot ${x} + 0.3 \\cdot ${y} = ${x / 10} + ${(3 * y) / 10} = ${acid}$ liters.`,
            `**列方程。** 两部分的体积之和是总量，各部分含的酸之和是混合液含的酸：$$x + y = ${total}, \\qquad 0.1x + 0.3y = ${acid}.$$

**去掉小数。** 第二个方程乘以 $10$：$x + 3y = ${x + 3 * y}$。

**消去 $x$。** 减去第一个方程：$2y = ${x + 3 * y} - ${total} = ${2 * y}$，所以 $y = ${y}$。

**检验。** 于是 $x = ${total} - ${y} = ${x}$，含酸 $0.1 \\cdot ${x} + 0.3 \\cdot ${y} = ${x / 10} + ${(3 * y) / 10} = ${acid}$ 升。`,
          ],
        );
      },
    ),
  ],
  "systems-with-fractional-coefficients": [
    skill(
      "matching-fractions-in-both-equations",
      ["Matching fractions in both equations", "两个方程中相同的分数"],
      [
        `When the same fractions appear in both equations, it is quicker not to clear them. Treat each fraction as a single quantity: adding or subtracting the equations removes one of them at once, and the other can then be solved.

For $\\frac{x}{3} + \\frac{y}{2} = 7$ and $\\frac{x}{3} - \\frac{y}{2} = 1$, the terms $\\frac{y}{2}$ and $-\\frac{y}{2}$ cancel when the equations are added: $2 \\cdot \\frac{x}{3} = 8$, so $\\frac{x}{3} = 4$ and $x = 12$. Check: $\\frac{y}{2} = 7 - 4 = 3$, so $y = 6$, and $4 - 3 = 1$.

> **Watch out.** Finding $\\frac{x}{3} = 4$ is not the end: $x$ is $3 \\cdot 4 = 12$, not $4$. Divide by $2$ after adding, then multiply by the denominator.`,
        `两个方程中出现相同的分数时，不去分母反而更快。把每个分数看成一个整体：把方程相加或相减，其中一个立刻消去，再解另一个。

对 $\\frac{x}{3} + \\frac{y}{2} = 7$ 和 $\\frac{x}{3} - \\frac{y}{2} = 1$，相加时 $\\frac{y}{2}$ 和 $-\\frac{y}{2}$ 抵消：$2 \\cdot \\frac{x}{3} = 8$，所以 $\\frac{x}{3} = 4$，$x = 12$。检验：$\\frac{y}{2} = 7 - 4 = 3$，所以 $y = 6$，而 $4 - 3 = 1$。

> **注意。** 求出 $\\frac{x}{3} = 4$ 还没完：$x$ 是 $3 \\cdot 4 = 12$，不是 $4$。相加后先除以 $2$，再乘以分母。`,
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const m = nz(rng, 8);
        const n = nz(rng, 8);
        return integer(
          [
            `Solve for $x$: $${frac("x", a)} + ${frac("y", b)} = ${m + n}$ and $${frac("x", a)} - ${frac("y", b)} = ${m - n}$.`,
            `解出 $x$：$${frac("x", a)} + ${frac("y", b)} = ${m + n}$，$${frac("x", a)} - ${frac("y", b)} = ${m - n}$。`,
          ],
          a * m,
          [m, b * n, a * (m + n)],
          [
            `**Add the equations.** The terms $${frac("y", b)}$ and $-${frac("y", b)}$ cancel, leaving $2 \\cdot ${frac("x", a)} = ${m + n} + ${m - n < 0 ? `(${m - n})` : m - n} = ${2 * m}$.

**Solve for $x$.** Dividing by $2$ gives $${frac("x", a)} = ${m}$, and multiplying by $${a}$ gives $x = ${a * m}$.

**Check.** From the first equation, $${frac("y", b)} = ${m + n} - ${m < 0 ? `(${m})` : m} = ${n}$. Then the second equation gives $${m} - ${n < 0 ? `(${n})` : n} = ${m - n}$, as it should.`,
            `**两个方程相加。** $${frac("y", b)}$ 和 $-${frac("y", b)}$ 抵消，剩下 $2 \\cdot ${frac("x", a)} = ${m + n} + ${m - n < 0 ? `(${m - n})` : m - n} = ${2 * m}$。

**解出 $x$。** 两边除以 $2$ 得 $${frac("x", a)} = ${m}$，再乘以 $${a}$ 得 $x = ${a * m}$。

**检验。** 由第一个方程，$${frac("y", b)} = ${m + n} - ${m < 0 ? `(${m})` : m} = ${n}$。代入第二个方程得 $${m} - ${n < 0 ? `(${n})` : n} = ${m - n}$，正确。`,
          ],
        );
      },
    ),
  ],
  "trigonometric-ratios-of-quadrantal-angles-outside-the-standard-range": [
    skill(
      "a-combination-at-a-quadrantal-angle",
      ["A combination at a quadrantal angle", "象限角处的组合"],
      [
        "Every multiple of $90^{\\circ}$ reduces to one of four positions on the unit circle. So add or subtract multiples of $360^{\\circ}$ to land from $0^{\\circ}$ up to $360^{\\circ}$, read off the sine and cosine there, and then combine them.",
        "$90^{\\circ}$ 的每个倍数都化成单位圆上四个位置之一。所以先加减 $360^{\\circ}$ 的倍数，落到 $0^{\\circ}$ 到 $360^{\\circ}$ 之间，读出那里的正弦和余弦，再组合。",
      ],
      (rng) => {
        const k = rng.int(5, 40) * (rng.bool() ? 1 : -1);
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const angle = 90 * k;
        const spot = ((k % 4) + 4) % 4;
        const s = [0, 1, 0, -1][spot] as number;
        const c = [1, 0, -1, 0][spot] as number;
        return integer(
          [
            `Evaluate $${a}\\sin(${angle}^{\\circ}) + ${b}\\cos(${angle}^{\\circ})$.`,
            `计算 $${a}\\sin(${angle}^{\\circ}) + ${b}\\cos(${angle}^{\\circ})$。`,
          ],
          a * s + b * c,
          [a * c + b * s, -(a * s + b * c), a + b],
          [
            `$${angle}^{\\circ}$ ends at the same place as $${spot * 90}^{\\circ}$, where the sine is $${s}$ and the cosine is $${c}$. So the value is $${a} \\cdot (${s}) + ${b} \\cdot (${c}) = ${a * s + b * c}$.`,
            `$${angle}^{\\circ}$ 与 $${spot * 90}^{\\circ}$ 终边相同，那里正弦是 $${s}$，余弦是 $${c}$。所以值为 $${a} \\cdot (${s}) + ${b} \\cdot (${c}) = ${a * s + b * c}$。`,
          ],
        );
      },
    ),
  ],
  "two-step-unit-conversions": [
    skill(
      "converting-a-speed",
      ["Converting a speed", "换算速度"],
      [
        `A speed has two units, one on top and one underneath, and both must be converted. From km/h to m/s: a kilometer is $1000$ m, so the number of meters per hour is $1000$ times the number of kilometers; an hour is $3600$ s, so in one second only $\\frac{1}{3600}$ of that distance is covered. Together we multiply by $1000$ and divide by $3600$, which is dividing by $3.6$:

$$72\\text{ km/h} = \\frac{72 \\cdot 1000\\text{ m}}{3600\\text{ s}} = 20\\text{ m/s}.$$

Going from m/s to km/h reverses both steps, so it multiplies by $3.6$.

> **Watch out.** Converting only the top, $72 \\cdot 1000 = 72000$, gives meters per **hour**, not per second. And multiplying by $3.6$ where we should divide goes the wrong way: a second is so short that a speed in m/s is a smaller number than the same speed in km/h.`,
        `速度有两个单位，一个在上，一个在下，两个都要换算。从 km/h 到 m/s：$1$ 千米是 $1000$ 米，所以每小时的米数是千米数的 $1000$ 倍；$1$ 小时是 $3600$ 秒，所以一秒只走其中的 $\\frac{1}{3600}$。合起来是乘 $1000$ 再除以 $3600$，也就是除以 $3.6$：

$$72\\text{ km/h} = \\frac{72 \\cdot 1000\\text{ m}}{3600\\text{ s}} = 20\\text{ m/s}.$$

从 m/s 到 km/h 两步都反过来，所以乘 $3.6$。

> **注意。** 只换算上面的单位，$72 \\cdot 1000 = 72000$，得到的是米每**小时**，不是米每秒。该除的时候乘 $3.6$ 就走反了：一秒很短，所以同一个速度用 m/s 表示的数比用 km/h 表示的小。`,
      ],
      (rng) => {
        const m = rng.int(1, 40);
        const toSeconds = rng.bool();
        return whole(
          toSeconds
            ? [`Convert $${36 * m}\\text{ km/h}$ to meters per second.`, `把 $${36 * m}\\text{ km/h}$ 换算成米/秒。`]
            : [`Convert $${10 * m}\\text{ m/s}$ to kilometers per hour.`, `把 $${10 * m}\\text{ m/s}$ 换算成千米/时。`],
          toSeconds ? 10 * m : 36 * m,
          toSeconds ? [36 * m * 36, 36 * m * 1000, 100 * m] : [10 * m * 60, 360 * m, m],
          [
            `${toSeconds ? `**Step 1: kilometers to meters.** Each kilometer is $1000$ m, so the number on top gets $1000$ times bigger: $${36 * m}\\text{ km/h} = ${36000 * m}\\text{ m/h}$.

**Step 2: hours to seconds.** An hour is $3600$ s, so in one second the distance is $3600$ times smaller: $${36000 * m} \\div 3600 = ${10 * m}\\text{ m/s}$.

**Check.** The speed in m/s is the smaller number, as it should be, and $${10 * m} \\cdot 3.6 = ${36 * m}$.` : `**Step 1: meters to kilometers.** Every $1000$ m make $1$ km, so the number on top gets $1000$ times smaller: $${10 * m}\\text{ m/s} = ${m / 100}\\text{ km/s}$.

**Step 2: seconds to hours.** An hour is $3600$ s, so in an hour the distance is $3600$ times as far: $${m / 100} \\cdot 3600 = ${36 * m}\\text{ km/h}$.

**Check.** The speed in km/h is the larger number, as it should be, and $${36 * m} \\div 3.6 = ${10 * m}$.`}`,
            `${toSeconds ? `**第一步：千米化成米。** $1$ 千米是 $1000$ 米，所以上面的数变成 $1000$ 倍：$${36 * m}\\text{ km/h} = ${36000 * m}\\text{ m/h}$。

**第二步：小时化成秒。** $1$ 小时是 $3600$ 秒，所以一秒走的路程是一小时的 $3600$ 分之一：$${36000 * m} \\div 3600 = ${10 * m}\\text{ m/s}$。

**检验。** 用 m/s 表示的数较小，合乎道理；而 $${10 * m} \\cdot 3.6 = ${36 * m}$。` : `**第一步：米化成千米。** 每 $1000$ 米合成 $1$ 千米，所以上面的数缩小为 $1000$ 分之一：$${10 * m}\\text{ m/s} = ${m / 100}\\text{ km/s}$。

**第二步：秒化成小时。** $1$ 小时是 $3600$ 秒，所以一小时走的路程是一秒的 $3600$ 倍：$${m / 100} \\cdot 3600 = ${36 * m}\\text{ km/h}$。

**检验。** 用 km/h 表示的数较大，合乎道理；而 $${36 * m} \\div 3.6 = ${10 * m}$。`}`,
          ],
        );
      },
    ),
  ],
  "vertical-line-test": [
    skill(
      "points-that-break-the-test",
      ["Points that break the test", "破坏检验的点"],
      [
        `Two points with the same input and different outputs, such as $(2, 5)$ and $(2, -1)$, lie on one vertical line, the line $x = 2$, so a relation containing both fails the vertical line test and is not a function. That means a list of points can be checked without drawing it: compare the first coordinates.

For $\\{(1, 4), (3, 0), (k, 6)\\}$, the new point $(k, 6)$ spoils the function only if $k$ is an input already used with a different output. With $k = 3$ the input $3$ would have the outputs $0$ and $6$; with $k = 4$ or $k = 0$ nothing goes wrong, because $4$ and $0$ are not inputs yet.

> **Watch out.** $k$ is a **first** coordinate, an input, so compare it with the other first coordinates. Matching it to an output, such as $k = 4$ above, puts no two points on one vertical line.`,
        `输入相同、输出不同的两个点，例如 $(2, 5)$ 和 $(2, -1)$，在同一条竖直线 $x = 2$ 上，所以含有这两点的关系不能通过竖直线检验，不是函数。这说明检查点列时不必画图：比较第一个坐标即可。

对于 $\\{(1, 4), (3, 0), (k, 6)\\}$，新点 $(k, 6)$ 只有当 $k$ 是已用过、且输出不同的输入时，才会破坏函数。$k = 3$ 时，输入 $3$ 会有输出 $0$ 和 $6$；$k = 4$ 或 $k = 0$ 时没有问题，因为 $4$ 和 $0$ 还不是输入。

> **注意。** $k$ 是**第一个**坐标，即输入，所以要与其他点的第一个坐标比较。让它等于某个输出（例如上面的 $k = 4$），并不会使两个点落在同一条竖直线上。`,
      ],
      (rng) => {
        const xs = rng.sample([-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 3);
        const ys = rng.sample([-9, -8, -7, 10, 11, 12, 13, 14, 15, 16], 4);
        const hit = rng.pick(xs);
        const list = xs.map((x, i) => `(${x}, ${ys[i]})`).join(", ");
        return chooseFilled(
          rng,
          [
            `The relation $\\{${list}, (k, ${ys[3]})\\}$ fails to be a function for exactly one of these values of $k$. Which one?`,
            `关系 $\\{${list}, (k, ${ys[3]})\\}$ 恰好在下面一个 $k$ 值时不是函数。是哪一个？`,
          ],
          `k = ${hit}`,
          [`k = ${ys[0]}`, `k = ${ys[3]}`, `k = ${ys[1]}`],
          [
            `**Step 1: list the inputs in use.** The first coordinates of the other points are $${xs.join(", ")}$, with the outputs $${ys.slice(0, 3).join(", ")}$.

**Step 2: find the clash.** The point $(k, ${ys[3]})$ breaks the function only when $k$ is one of those inputs, since its output $${ys[3]}$ differs from all of theirs. Of the choices, only $k = ${hit}$ is an input already in use.

**Check.** With $k = ${hit}$ the relation holds $(${hit}, ${ys[xs.indexOf(hit)]})$ and $(${hit}, ${ys[3]})$, two points on the vertical line $x = ${hit}$: the input $${hit}$ has two outputs.`,
            `**第一步：列出已用的输入。** 其他点的第一个坐标是 $${xs.join(", ")}$，对应的输出是 $${ys.slice(0, 3).join(", ")}$。

**第二步：找出冲突。** 点 $(k, ${ys[3]})$ 的输出 $${ys[3]}$ 与它们的输出都不同，所以只有当 $k$ 是这些输入之一时才会破坏函数。在选项中，只有 $k = ${hit}$ 是已用过的输入。

**检验。** $k = ${hit}$ 时，关系中有 $(${hit}, ${ys[xs.indexOf(hit)]})$ 和 $(${hit}, ${ys[3]})$ 两点，都在竖直线 $x = ${hit}$ 上：输入 $${hit}$ 有两个输出。`,
          ],
        );
      },
    ),
  ],
};

/** deeperRemainingExamThirdPoints holds the third knowledge points of topics in the exam shard. */
export const deeperRemainingExamThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "completing-the-square-with-odd-linear-terms": [
    skill(
      "solving-with-an-odd-coefficient",
      ["Solving with an odd coefficient", "一次项系数为奇数时求解"],
      [
        `Completing the square works the same way when the coefficient of $x$ is odd; half of it is simply a fraction. For $x^{2} + 3x - 10 = 0$, move the constant across, $x^{2} + 3x = 10$, and add $\\left(\\frac{3}{2}\\right)^{2} = \\frac{9}{4}$ to both sides, the number that makes the left side a perfect square:

$$\\left(x + \\frac{3}{2}\\right)^{2} = 10 + \\frac{9}{4} = \\frac{49}{4}.$$

Taking square roots, $x + \\frac{3}{2} = \\pm\\frac{7}{2}$, so $x = -\\frac{3}{2} + \\frac{7}{2} = 2$ or $x = -\\frac{3}{2} - \\frac{7}{2} = -5$. The halves cancel and the roots are whole.

> **Watch out.** Subtract the half, do not add it: $x = \\frac{3}{2} + \\frac{7}{2} = 5$ forgets the sign in $x + \\frac{3}{2}$. Neither the sum $2 + 5 = 7$ of the sizes of the roots nor the constant $10$ is a solution.`,
        `$x$ 的系数是奇数时，配方的做法完全一样，它的一半只是一个分数。对于 $x^{2} + 3x - 10 = 0$，把常数移到右边，$x^{2} + 3x = 10$，两边加上 $\\left(\\frac{3}{2}\\right)^{2} = \\frac{9}{4}$，这个数使左边成为完全平方：

$$\\left(x + \\frac{3}{2}\\right)^{2} = 10 + \\frac{9}{4} = \\frac{49}{4}.$$

开平方，$x + \\frac{3}{2} = \\pm\\frac{7}{2}$，所以 $x = -\\frac{3}{2} + \\frac{7}{2} = 2$ 或 $x = -\\frac{3}{2} - \\frac{7}{2} = -5$。二分之一抵消了，根是整数。

> **注意。** 要减去一半，不是加上：$x = \\frac{3}{2} + \\frac{7}{2} = 5$ 忘了 $x + \\frac{3}{2}$ 中的符号。两根大小之和 $2 + 5 = 7$ 和常数 $10$ 都不是解。`,
      ],
      (rng) => {
        const r = rng.int(1, 12);
        const s = r + 2 * rng.int(0, 6) + 1;
        const b = s - r;
        return whole(
          [
            `Complete the square to solve $x^{2} + ${b === 1 ? "" : b}x - ${r * s} = 0$. What is the positive solution?`,
            `用配方法解 $x^{2} + ${b === 1 ? "" : b}x - ${r * s} = 0$。正数解是多少？`,
          ],
          r,
          [s, r + s, r * s],
          [
            `**Step 1: move the constant.** $x^{2} + ${b === 1 ? "" : b}x = ${r * s}$.

**Step 2: complete the square.** Add the square of half the coefficient of $x$, $\\left(${frac(b, 2)}\\right)^{2} = ${frac(b * b, 4)}$, to both sides:

$$\\left(x + ${frac(b, 2)}\\right)^{2} = ${r * s} + ${frac(b * b, 4)} = ${frac((r + s) * (r + s), 4)}.$$

**Step 3: take square roots.** $x + ${frac(b, 2)} = \\pm ${frac(r + s, 2)}$. The positive solution takes the plus sign: $x = -${frac(b, 2)} + ${frac(r + s, 2)} = ${frac(r + s - b, 2)} = ${r}$. The other is $-${frac(b, 2)} - ${frac(r + s, 2)} = -${s}$.

**Check.** $${r}^{2} + ${b === 1 ? "" : `${b} \\cdot `}${r} - ${r * s} = ${r * r} + ${b * r} - ${r * s} = 0$.`,
            `**第一步：移项。** $x^{2} + ${b === 1 ? "" : b}x = ${r * s}$。

**第二步：配方。** 两边加上 $x$ 的系数一半的平方，$\\left(${frac(b, 2)}\\right)^{2} = ${frac(b * b, 4)}$：

$$\\left(x + ${frac(b, 2)}\\right)^{2} = ${r * s} + ${frac(b * b, 4)} = ${frac((r + s) * (r + s), 4)}.$$

**第三步：开平方。** $x + ${frac(b, 2)} = \\pm ${frac(r + s, 2)}$。正数解取正号：$x = -${frac(b, 2)} + ${frac(r + s, 2)} = ${frac(r + s - b, 2)} = ${r}$。另一个解是 $-${frac(b, 2)} - ${frac(r + s, 2)} = -${s}$。

**检验。** $${r}^{2} + ${b === 1 ? "" : `${b} \\cdot `}${r} - ${r * s} = ${r * r} + ${b * r} - ${r * s} = 0$。`,
          ],
        );
      },
    ),
  ],
  "converting-units-of-area-to-larger-units": [
    skill(
      "area-from-lengths-in-smaller-units",
      ["Area from lengths in smaller units", "由较小单位的长度求面积"],
      [
        `When the sides are in centimeters and the area is wanted in square meters, either convert each side to meters first, or find the area in square centimeters and convert it at the end. A square meter is $100$ cm by $100$ cm, so it holds $100 \\cdot 100 = 10000$ square centimeters, and converting the area **divides by $10000$**.

A rectangle $250$ cm by $80$ cm has area $250 \\cdot 80 = 20000\\text{ cm}^{2}$, which is $20000 \\div 10000 = 2\\text{ m}^{2}$. Converting the sides first gives the same: $2.5 \\cdot 0.8 = 2\\text{ m}^{2}$.

> **Watch out.** Dividing the area by $100$ uses the length factor on an area, and $1000$ is the factor of no unit here. And an area multiplies the sides; adding them, as in $250 + 80$, gives half the perimeter.`,
        `边长以厘米给出、面积要用平方米表示时，可以先把每条边化成米，也可以先求平方厘米数，最后换算。$1$ 平方米是 $100$ cm 乘 $100$ cm，含 $100 \\cdot 100 = 10000$ 平方厘米，所以换算面积要**除以 $10000$**。

$250$ cm 乘 $80$ cm 的长方形，面积是 $250 \\cdot 80 = 20000\\text{ cm}^{2}$，即 $20000 \\div 10000 = 2\\text{ m}^{2}$。先换算边长结果相同：$2.5 \\cdot 0.8 = 2\\text{ m}^{2}$。

> **注意。** 面积除以 $100$，是把长度的换算率用在面积上；$1000$ 在这里不是任何单位的换算率。面积是边长相乘；把边长相加，如 $250 + 80$，得到的是周长的一半。`,
      ],
      (rng) => {
        const a = rng.int(2, 40) * 50;
        const b = rng.int(2, 40) * 10;
        return decimal(
          [
            `A rectangle is $${a}\\text{ cm}$ by $${b}\\text{ cm}$. What is its area in square meters?`,
            `长方形的长是 $${a}\\text{ cm}$，宽是 $${b}\\text{ cm}$。它的面积是多少平方米？`,
          ],
          Q.of(a * b, 10000),
          [Q.of(a * b, 100), Q.of(a * b, 1000), Q.of(a + b, 100)],
          [
            `**Step 1: the area in square centimeters.** $${a} \\times ${b} = ${a * b}\\text{ cm}^{2}$.

**Step 2: convert.** A square meter holds $100 \\cdot 100 = 10000\\text{ cm}^{2}$, a larger unit, so divide by $10000$: $${a * b} \\div 10000 = ${(a * b) / 10000}\\text{ m}^{2}$.

**Check.** Converting the sides first, $${a}\\text{ cm} = ${a / 100}\\text{ m}$ and $${b}\\text{ cm} = ${b / 100}\\text{ m}$, and $${a / 100} \\times ${b / 100} = ${(a * b) / 10000}$.`,
            `**第一步：平方厘米数。** $${a} \\times ${b} = ${a * b}\\text{ cm}^{2}$。

**第二步：换算。** $1$ 平方米含 $100 \\cdot 100 = 10000\\text{ cm}^{2}$，是较大的单位，所以除以 $10000$：$${a * b} \\div 10000 = ${(a * b) / 10000}\\text{ m}^{2}$。

**检验。** 先换算边长，$${a}\\text{ cm} = ${a / 100}\\text{ m}$，$${b}\\text{ cm} = ${b / 100}\\text{ m}$，而 $${a / 100} \\times ${b / 100} = ${(a * b) / 10000}$。`,
          ],
        );
      },
    ),
  ],
  "perfect-square-quadratic-equations-with-one-or-no-solutions": [
    skill(
      "the-single-solution",
      ["The single solution", "唯一的解"],
      [
        `A quadratic $x^{2} + bx + c = 0$ has exactly one solution only when its left side is a perfect square, since a square is zero at just one number. To match $x^{2} + bx + 49$ with a square, its constant must be $49 = 7^{2}$, so the square is

$$(x + 7)^{2} = x^{2} + 14x + 49 \\qquad \\text{or} \\qquad (x - 7)^{2} = x^{2} - 14x + 49.$$

If $b$ is positive, it is $(x + 7)^{2}$, with $b = 14$, and the solution is the number that makes $x + 7$ zero: $x = -7$.

> **Watch out.** The solution of $(x + 7)^{2} = 0$ is $-7$, not $7$: the sign flips. And $b = 14$ is the coefficient, not the solution; nor is the constant $49$.`,
        `二次方程 $x^{2} + bx + c = 0$ 恰有一个解，只有在左边是完全平方式时才会发生，因为平方只在一个数处等于零。要让 $x^{2} + bx + 49$ 成为完全平方，常数 $49 = 7^{2}$，所以这个平方是

$$(x + 7)^{2} = x^{2} + 14x + 49 \\qquad \\text{或} \\qquad (x - 7)^{2} = x^{2} - 14x + 49.$$

如果 $b$ 是正数，就是 $(x + 7)^{2}$，$b = 14$，解是使 $x + 7$ 为零的数：$x = -7$。

> **注意。** $(x + 7)^{2} = 0$ 的解是 $-7$，不是 $7$：符号要反过来。$b = 14$ 是系数，不是解；常数 $49$ 也不是。`,
      ],
      (rng) => {
        const c = rng.int(2, 30);
        const positive = rng.bool();
        return integer(
          [
            `For a ${positive ? "positive" : "negative"} value of $b$, the equation $x^{2} + bx + ${c * c} = 0$ has exactly one solution. What is that solution?`,
            `当 $b$ 取某个${positive ? "正" : "负"}值时，方程 $x^{2} + bx + ${c * c} = 0$ 恰有一个解。这个解是多少？`,
          ],
          positive ? -c : c,
          [positive ? c : -c, positive ? 2 * c : -2 * c, c * c],
          [
            `**Step 1: the square.** One solution means the left side is a perfect square. Its constant is $${c * c} = ${c}^{2}$, so it is $(x + ${c})^{2} = x^{2} + ${2 * c}x + ${c * c}$ or $(x - ${c})^{2} = x^{2} - ${2 * c}x + ${c * c}$.

**Step 2: choose by the sign of $b$.** A ${positive ? "positive" : "negative"} $b$ gives $b = ${positive ? 2 * c : -2 * c}$ and the equation $(x ${positive ? "+" : "-"} ${c})^{2} = 0$.

**Step 3: solve.** A square is zero only when what is squared is zero: $x ${positive ? "+" : "-"} ${c} = 0$, so $x = ${positive ? -c : c}$.

**Check.** $${paren(positive ? -c : c)}^{2} + ${paren(positive ? 2 * c : -2 * c)} \\cdot ${paren(positive ? -c : c)} + ${c * c} = ${c * c} - ${2 * c * c} + ${c * c} = 0$.`,
            `**第一步：完全平方。** 恰有一个解说明左边是完全平方式。常数是 $${c * c} = ${c}^{2}$，所以它是 $(x + ${c})^{2} = x^{2} + ${2 * c}x + ${c * c}$ 或 $(x - ${c})^{2} = x^{2} - ${2 * c}x + ${c * c}$。

**第二步：由 $b$ 的符号选择。** $b$ 为${positive ? "正" : "负"}时 $b = ${positive ? 2 * c : -2 * c}$，方程是 $(x ${positive ? "+" : "-"} ${c})^{2} = 0$。

**第三步：求解。** 平方为零只能是底数为零：$x ${positive ? "+" : "-"} ${c} = 0$，所以 $x = ${positive ? -c : c}$。

**检验。** $${paren(positive ? -c : c)}^{2} + ${paren(positive ? 2 * c : -2 * c)} \\cdot ${paren(positive ? -c : c)} + ${c * c} = ${c * c} - ${2 * c * c} + ${c * c} = 0$。`,
          ],
        );
      },
    ),
  ],
  "unit-conversions-using-base-units-of-length": [
    skill(
      "a-perimeter-in-another-unit",
      ["A perimeter in another unit", "用另一单位表示周长"],
      [
        `For a fence around a rectangle, first find the perimeter in the unit of the sides, and then convert it once. A yard is $3$ times as long as a foot, so every $3$ feet make one yard: the number of yards is the number of feet **divided** by $3$.

A garden $20$ ft by $16$ ft has perimeter $2 \\cdot (20 + 16) = 72$ ft, which is $72 \\div 3 = 24$ yd.

> **Watch out.** Do not stop at $72$, the perimeter in feet, and go around all four sides: $20 + 16$ is only half the way. Multiplying by $3$ makes the number bigger, but a yard is the larger unit, so there are fewer yards than feet.`,
        `给长方形围篱笆，先用边的单位求周长，再一次换算。$1$ 码是 $1$ 英尺的 $3$ 倍长，所以每 $3$ 英尺合成 $1$ 码：码数是英尺数**除以** $3$。

长 $20$ 英尺、宽 $16$ 英尺的花园，周长是 $2 \\cdot (20 + 16) = 72$ 英尺，即 $72 \\div 3 = 24$ 码。

> **注意。** 不要停在 $72$，那是英尺数；也要绕满四条边：$20 + 16$ 只是一半。乘 $3$ 会使数变大，但码是较大的单位，码数应比英尺数少。`,
      ],
      (rng) => {
        const a = rng.int(2, 60);
        const yards = rng.int(Math.ceil((2 * a + 2) / 3) + 1, Math.ceil((2 * a + 2) / 3) + 30);
        const b = (3 * yards - 2 * a) / 2;
        const usable = Number.isInteger(b) ? b : b + 1.5;
        const y = (2 * (a + usable)) / 3;
        return whole(
          [
            `How many yards of fence go around a rectangle that is $${a}$ feet by $${usable}$ feet?`,
            `围住长 $${a}$ 英尺、宽 $${usable}$ 英尺的长方形需要多少码围栏？`,
          ],
          y,
          [2 * (a + usable), (a + usable) / 3 === Math.floor((a + usable) / 3) ? (a + usable) / 3 : y + 2, y * 9],
          [
            `**Step 1: the perimeter in feet.** Go around all four sides: $2 \\cdot (${a} + ${usable}) = ${2 * (a + usable)}$ feet.

**Step 2: convert to yards.** A yard is $3$ feet, a larger unit, so divide: $${2 * (a + usable)} \\div 3 = ${y}$ yards.

**Check.** There are fewer yards than feet, $${y} < ${2 * (a + usable)}$, and $${y} \\cdot 3 = ${2 * (a + usable)}$ feet, the perimeter.`,
            `**第一步：以英尺计的周长。** 绕满四条边：$2 \\cdot (${a} + ${usable}) = ${2 * (a + usable)}$ 英尺。

**第二步：换算成码。** $1$ 码是 $3$ 英尺，码是较大的单位，所以除：$${2 * (a + usable)} \\div 3 = ${y}$ 码。

**检验。** 码数比英尺数少，$${y} < ${2 * (a + usable)}$；而 $${y} \\cdot 3 = ${2 * (a + usable)}$ 英尺，正是周长。`,
          ],
        );
      },
    ),
  ],
  "unit-conversions-using-base-units-of-mass": [
    skill(
      "a-total-in-pounds",
      ["A total in pounds", "以磅表示总量"],
      [
        `Multiply first to find the total in the smaller unit, and then convert it once. A pound is $16$ times as heavy as an ounce, so every $16$ ounces make a pound: the number of pounds is the number of ounces **divided** by $16$.

$24$ packets of $4$ oz weigh $24 \\cdot 4 = 96$ oz, which is $96 \\div 16 = 6$ lb.

> **Watch out.** Do not stop at $96$, the total in ounces, and do not answer with the number of packets. A pound is $16$ ounces, not $8$: dividing by $8$ gives twice the right number of pounds.`,
        `先相乘得到较小单位的总量，再一次换算。$1$ 磅是 $1$ 盎司的 $16$ 倍重，所以每 $16$ 盎司合成 $1$ 磅：磅数是盎司数**除以** $16$。

$24$ 包每包 $4$ 盎司，共重 $24 \\cdot 4 = 96$ 盎司，即 $96 \\div 16 = 6$ 磅。

> **注意。** 不要停在 $96$，那是盎司数，也不要用包数作答。$1$ 磅是 $16$ 盎司，不是 $8$ 盎司：除以 $8$ 得到的磅数多了一倍。`,
      ],
      (rng) => {
        const pounds = rng.int(2, 60);
        const each = rng.pick([2, 4, 8]);
        const n = (16 * pounds) / each;
        return whole(
          [
            `A shop has $${n}$ packets, each weighing $${each}$ ounces. What is their total weight in pounds?`,
            `商店有 $${n}$ 包货物，每包重 $${each}$ 盎司。总重是多少磅？`,
          ],
          pounds,
          [n * each, n, pounds * 2],
          [
            `**Step 1: the total in ounces.** $${n}$ packets of $${each}$ ounces weigh $${n} \\times ${each} = ${n * each}$ ounces.

**Step 2: convert to pounds.** A pound is $16$ ounces, a larger unit, so divide: $${n * each} \\div 16 = ${pounds}$ pounds.

**Check.** There are fewer pounds than ounces, and $${pounds} \\cdot 16 = ${n * each}$ ounces, the total.`,
            `**第一步：总盎司数。** $${n}$ 包每包 $${each}$ 盎司，共 $${n} \\times ${each} = ${n * each}$ 盎司。

**第二步：换算成磅。** $1$ 磅是 $16$ 盎司，磅是较大的单位，所以除：$${n * each} \\div 16 = ${pounds}$ 磅。

**检验。** 磅数比盎司数少；而 $${pounds} \\cdot 16 = ${n * each}$ 盎司，正是总重。`,
          ],
        );
      },
    ),
  ],
  "unit-conversions-using-units-of-time": [
    skill(
      "total-time-for-many-items",
      ["Total time for many items", "许多件的总时间"],
      [
        `Times per item often use a small unit, while a total reads better in a larger one. Multiply first to find the total in seconds, and then convert once: a minute is $60$ times as long as a second, so every $60$ s make one minute, and we **divide** by $60$.

A printer that takes $12$ s per page needs $25 \\cdot 12 = 300$ s for $25$ pages, which is $300 \\div 60 = 5$ min.

> **Watch out.** Do not stop at $300$, which counts seconds, not minutes, and do not answer with the number of items. A minute is $60$ seconds, not $100$.`,
        `每件所用的时间常用小单位，而总时间用大单位更清楚。先相乘得到总秒数，再一次换算：$1$ 分钟是 $1$ 秒的 $60$ 倍长，所以每 $60$ 秒合成 $1$ 分钟，要**除以** $60$。

打印机每页用 $12$ 秒，打 $25$ 页要 $25 \\cdot 12 = 300$ 秒，即 $300 \\div 60 = 5$ 分钟。

> **注意。** 不要停在 $300$，那是秒数，不是分钟数，也不要用件数作答。$1$ 分钟是 $60$ 秒，不是 $100$ 秒。`,
      ],
      (rng) => {
        const minutes = rng.int(2, 60);
        const each = rng.pick([2, 3, 4, 5, 6, 10, 12, 15, 20, 30]);
        const n = (60 * minutes) / each;
        return whole(
          [
            `A machine takes $${each}$ seconds per item. How many minutes does it take to make $${n}$ items?`,
            `一台机器每件用 $${each}$ 秒。做 $${n}$ 件要多少分钟？`,
          ],
          minutes,
          [n * each, n, minutes * 60],
          [
            `**Step 1: the total in seconds.** $${n}$ items at $${each}$ seconds each take $${n} \\times ${each} = ${n * each}$ seconds.

**Step 2: convert to minutes.** A minute is $60$ seconds, a larger unit, so divide: $${n * each} \\div 60 = ${minutes}$ minutes.

**Check.** There are fewer minutes than seconds, and $${minutes} \\cdot 60 = ${n * each}$ seconds, the total.`,
            `**第一步：总秒数。** $${n}$ 件每件 $${each}$ 秒，共 $${n} \\times ${each} = ${n * each}$ 秒。

**第二步：换算成分钟。** $1$ 分钟是 $60$ 秒，分钟是较大的单位，所以除：$${n * each} \\div 60 = ${minutes}$ 分钟。

**检验。** 分钟数比秒数少；而 $${minutes} \\cdot 60 = ${n * each}$ 秒，正是总时间。`,
          ],
        );
      },
    ),
  ],
};

/** deeperRemainingCalculusThirdPoints holds the third knowledge points of the calculator topics in the calculus shard. */
export const deeperRemainingCalculusThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "evaluating-expressions-using-a-graphing-calculator": [
    skill(
      "reading-e-notation",
      ["Reading E notation", "读懂 E 记法"],
      [
        "Calculators show large numbers in a short form, where E followed by a number means multiplying by that power of 10. So the display 3.2E4 means 3.2 times 10000, which is 32000.",
        "计算器用简短的形式显示大数，E 后面的数表示乘 10 的这个次幂。所以显示 3.2E4 表示 3.2 乘 10000，也就是 32000。",
      ],
      (rng) => {
        const m = rng.int(11, 99);
        const n = rng.int(2, 6);
        const value = m * 10 ** (n - 1);
        return whole(
          [
            `A calculator displays $${m / 10}\\text{E}${n}$. What whole number is that?`,
            `计算器显示 $${m / 10}\\text{E}${n}$。这是哪个整数？`,
          ],
          value,
          [m * 10 ** n, m * 10 ** (n - 2), m * 10 ** (n + 1)],
          [
            `The E means times a power of ten: $${m / 10} \\times 10^{${n}} = ${value}$.`,
            `E 表示乘 10 的幂：$${m / 10} \\times 10^{${n}} = ${value}$。`,
          ],
        );
      },
    ),
  ],
  "exploring-functions-using-technology": [
    {
      ...skill(
        "a-minimum-from-the-graph-of-the-derivative",
        ["A minimum from the graph of the derivative", "由导函数图象找极小值"],
        [
          "On a graph of $f'$, a local minimum of $f$ is where $f'$ crosses the axis from negative to positive. So only crossings in that direction count, not every zero.",
          "在 $f'$ 的图象上，$f$ 的局部极小值出现在 $f'$ 由负变正穿过坐标轴的地方。所以只有这个方向的穿越才算，并非每个零点都算。",
        ],
        (rng) => {
          const p = rng.int(-9, 4);
          const q = p + rng.int(1, 9);
          const a = rng.int(1, 5) * (rng.bool() ? 1 : -1);
          const answer = a > 0 ? q : p;
          return integer(
            [
              `You graph $Y_1 = f'(x) = ${a === 1 ? "" : a === -1 ? "-" : a}${factorOf(p)}${factorOf(q)}$. At what $x$ does $f$ have a local minimum?`,
              `你画出 $Y_1 = f'(x) = ${a === 1 ? "" : a === -1 ? "-" : a}${factorOf(p)}${factorOf(q)}$。$f$ 在哪个 $x$ 处有局部极小值？`,
            ],
            answer,
            [a > 0 ? p : q, (p + q) % 2 === 0 ? (p + q) / 2 : answer + 1, a],
            [`$f'$ goes from negative to positive at $x = ${answer}$.`, `$f'$ 在 $x = ${answer}$ 处由负变正。`],
          );
        },
      ),
      figure: calculusDrawings5["exploring-functions-using-technology#a-minimum-from-the-graph-of-the-derivative"],
    },
  ],
  "finding-definite-integrals-using-a-graphing-calculator": [
    skill(
      "checking-a-result-with-symmetry",
      ["Checking a result with symmetry", "用对称性检验结果"],
      [
        "Symmetry predicts some integrals without any calculation. An odd function over a symmetric interval gives 0, and an even function gives twice the integral over the right half.",
        "对称性可以不经计算就预测某些积分。奇函数在对称区间上积分为 0，偶函数的积分是右半部分积分的两倍。",
      ],
      (rng) => {
        const a = rng.int(1, 9);
        const v = nz(rng, 40);
        const even = rng.bool();
        const name: Pair = even ? ["even", "偶"] : ["odd", "奇"];
        return integer(
          [
            `$f$ is an ${name[0]} function, and a calculator gives $\\int_{0}^{${a}} f(x)\\,dx = ${v}$. What is $\\int_{-${a}}^{${a}} f(x)\\,dx$?`,
            `$f$ 是${name[1]}函数，计算器给出 $\\int_{0}^{${a}} f(x)\\,dx = ${v}$。$\\int_{-${a}}^{${a}} f(x)\\,dx$ 是多少？`,
          ],
          even ? 2 * v : 0,
          even ? [0, v, -2 * v] : [2 * v, v, -v],
          [
            even ? `The two halves are equal, so the total is ${2 * v}.` : "The two halves cancel, so the total is 0.",
            even ? `两半相等，所以总和是 ${2 * v}。` : "两半互相抵消，所以总和是 0。",
          ],
        );
      },
    ),
  ],
  "finding-derivatives-using-a-graphing-calculator": [
    skill(
      "a-symmetric-difference-from-a-table",
      ["A symmetric difference from a table", "由表格求对称差商"],
      [
        "A table of values is enough for a numerical derivative. Subtract the outputs on either side of the point, and divide by the full distance between the two inputs, which is $2h$.",
        "有一张数值表就能求数值导数。把点两侧的输出相减，再除以两个输入之间的整段距离，也就是 $2h$。",
      ],
      (rng) => {
        const a = rng.int(1, 9);
        const m = nz(rng, 40);
        const low = rng.int(-50, 50);
        return integer(
          [
            `A table shows $f(${a - 0.5}) = ${low / 10}$ and $f(${a + 0.5}) = ${(low + 10 * m) / 10}$. Use a symmetric difference to estimate $f'(${a})$.`,
            `表格显示 $f(${a - 0.5}) = ${low / 10}$，$f(${a + 0.5}) = ${(low + 10 * m) / 10}$。用对称差商估计 $f'(${a})$。`,
          ],
          m,
          [2 * m, -m, m + 1],
          [`The change in output is ${m} over a distance of 1, so the estimate is ${m}.`, `输出变化 ${m}，距离是 1，所以估计值是 ${m}。`],
        );
      },
    ),
  ],
  "finding-extrema-of-functions-using-a-graphing-calculator": [
    skill(
      "an-extreme-value-at-an-endpoint",
      ["An extreme value at an endpoint", "端点处的最值"],
      [
        "On a closed interval the largest or smallest value may be at an endpoint, which a calculator's maximum command can miss. So compare the critical points with both endpoints before answering.",
        "在闭区间上，最大值或最小值可能在端点处，而计算器的求极值命令可能漏掉。所以回答之前，要把临界点与两个端点比较。",
      ],
      (rng) => {
        const xs = [0, rng.int(1, 3), rng.int(4, 6), rng.int(7, 9)];
        const ys = rng.sample([-20, -15, -11, -8, -5, -2, 1, 3, 6, 9, 13, 17, 22, 27], 4);
        const wantMax = rng.bool();
        const best = wantMax ? Math.max(...ys) : Math.min(...ys);
        const at = xs[ys.indexOf(best)] as number;
        return whole(
          [
            `On $[${xs[0]}, ${xs[3]}]$, the critical points of a continuous $f$ are $x = ${xs[1]}$ and $x = ${xs[2]}$. The values $x \\to f(x)$ are $${tableText(xs, ys)}$. At what $x$ is the absolute ${wantMax ? "maximum" : "minimum"}?`,
            `在 $[${xs[0]}, ${xs[3]}]$ 上，连续函数 $f$ 的临界点是 $x = ${xs[1]}$ 和 $x = ${xs[2]}$。$x \\to f(x)$ 的值是 $${tableText(xs, ys)}$。绝对${wantMax ? "最大" : "最小"}值在哪个 $x$ 处？`,
          ],
          at,
          xs.filter((x) => x !== at),
          [
            `The ${wantMax ? "largest" : "smallest"} of the four values is ${best}, at $x = ${at}$.`,
            `四个值中${wantMax ? "最大" : "最小"}的是 ${best}，在 $x = ${at}$ 处。`,
          ],
        );
      },
    ),
  ],
  "finding-intersections-of-functions-using-a-graphing-calculator": [
    {
      ...skill(
        "intersections-from-sign-changes",
        ["Intersections from sign changes", "由符号变化找交点"],
        [
          "Two continuous graphs must cross wherever their difference changes sign. So a table of $f - g$ gives a lower bound on the number of intersections, by counting the sign changes.",
          "两个连续函数的差变号的地方，图象一定相交。所以由 $f - g$ 的数值表数变号次数，可以得到交点个数的下界。",
        ],
        (rng) => {
          const xs = [0, 1, 2, 3, 4, 5, 6];
          const ys = xs.map(() => nz(rng, 9));
          let changes = 0;
          for (let i = 1; i < ys.length; i++) if ((ys[i] as number) * (ys[i - 1] as number) < 0) changes++;
          return whole(
            [
              `$f$ and $g$ are continuous, and a table gives $x \\to f(x) - g(x)$ as $${tableText(xs, ys)}$. What is the least number of intersections on $[0, 6]$ that this table guarantees?`,
              `$f$ 和 $g$ 连续，表格给出 $x \\to f(x) - g(x)$：$${tableText(xs, ys)}$。这张表保证 $[0, 6]$ 上至少有几个交点？`,
            ],
            changes,
            [changes + 1, changes + 2, 7],
            [
              `The difference changes sign ${changes} times, and each change forces a crossing.`,
              `差变号 ${changes} 次，每次变号都必有一个交点。`,
            ],
          );
        },
      ),
      figure: calculusDrawings5["finding-intersections-of-functions-using-a-graphing-calculator#intersections-from-sign-changes"],
    },
  ],
  "finding-roots-of-functions-using-a-graphing-calculator": [
    skill(
      "one-step-of-bisection",
      ["One step of bisection", "二分法的一步"],
      [
        "If a continuous function has opposite signs at two ends, a root lies between them. Testing the midpoint keeps the half where the signs still differ, which cuts the interval in two at each step.",
        "连续函数在两端异号时，两端之间有根。检验中点后，保留仍然异号的那一半，这样每一步都把区间减半。",
      ],
      (rng) => {
        const a = rng.int(-9, 9);
        const m = a + rng.int(1, 9);
        const b = 2 * m - a;
        const value = nz(rng, 9);
        const keepLeft = value > 0;
        return chooseFilled(
          rng,
          [
            `$f$ is continuous, with $f(${a}) < 0$, $f(${b}) > 0$ and $f(${m}) = ${value}$. In which interval must a root lie?`,
            `$f$ 连续，$f(${a}) < 0$，$f(${b}) > 0$，$f(${m}) = ${value}$。根一定在哪个区间内？`,
          ],
          keepLeft ? `(${a}, ${m})` : `(${m}, ${b})`,
          [keepLeft ? `(${m}, ${b})` : `(${a}, ${m})`, `(${b}, ${b + (b - m)})`, `(${a - (m - a)}, ${a})`],
          [
            keepLeft
              ? `$f(${m})$ is positive and $f(${a})$ is negative, so the signs differ on $(${a}, ${m})$. By the intermediate value theorem a root lies there.`
              : `$f(${m})$ is negative and $f(${b})$ is positive, so the signs differ on $(${m}, ${b})$. By the intermediate value theorem a root lies there.`,
            keepLeft
              ? `$f(${m})$ 为正，$f(${a})$ 为负，所以在 $(${a}, ${m})$ 上异号。由介值定理，那里有根。`
              : `$f(${m})$ 为负，$f(${b})$ 为正，所以在 $(${m}, ${b})$ 上异号。由介值定理，那里有根。`,
          ],
        );
      },
    ),
  ],
};
