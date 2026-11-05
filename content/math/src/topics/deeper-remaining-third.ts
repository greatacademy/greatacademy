// A third knowledge point for the school, exam and calculator topics that still had two.

import type { KnowledgePointDef } from "@ga/content";
import { Q } from "@ga/subject-math";

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
    skill(
      "coterminal-angles",
      ["Coterminal angles", "终边相同的角"],
      [
        "Adding or subtracting full turns leaves the terminal side where it was, so such angles are called coterminal. To find the one from 0 up to 360 degrees, add or subtract 360 until it lands there.",
        "加减整圈不改变终边，这样的角叫终边相同的角。要找 0 到 360 度之间的那个，就反复加减 360，直到落入这个范围。",
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
          [360 - base, (base + 180) % 360, Math.abs(angle) % 180 === base ? base + 5 : Math.abs(angle) % 180],
          [
            `$${angle} ${turns > 0 ? "-" : "+"} ${360 * Math.abs(turns)} = ${base}$, which is in the range.`,
            `$${angle} ${turns > 0 ? "-" : "+"} ${360 * Math.abs(turns)} = ${base}$，在这个范围内。`,
          ],
        );
      },
    ),
  ],
  "calculating-perimeters-in-the-plane": [
    skill(
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
            `The legs are ${p} and ${q}, so the third side is ${r}, and the sum is ${p + q + r}.`,
            `两条直角边是 ${p} 和 ${q}，所以第三边是 ${r}，三边之和是 ${p + q + r}。`,
          ],
        );
      },
    ),
  ],
  "coin-problems": [
    skill(
      "three-kinds-of-coins",
      ["Three kinds of coins", "三种硬币"],
      [
        "With three kinds of coins, write every count in terms of one unknown using the relations given. Then the total value gives a single equation, with each count multiplied by its value in cents.",
        "有三种硬币时，用已知关系把每种的个数都写成同一个未知数的式子。这样总价值给出一个方程，每种个数乘它的面值（分）。",
      ],
      (rng) => {
        const n = rng.int(2, 30);
        const k = rng.int(1, 9);
        const cents = 50 * n + 25 * k;
        return whole(
          [
            `A box holds $n$ nickels (5 cents), twice as many dimes (10 cents), and ${k} more quarters (25 cents) than nickels. They are worth ${cents} cents in all. Find $n$.`,
            `盒子里有 $n$ 枚 5 分硬币，10 分硬币的个数是它的两倍，25 分硬币比 5 分硬币多 ${k} 枚。总价值是 ${cents} 分。求 $n$。`,
          ],
          n,
          [n + k, 2 * n, Math.floor(cents / 40)],
          [
            `$5n + 20n + 25(n + ${k}) = ${cents}$ gives $50n = ${cents - 25 * k}$, so $n = ${n}$.`,
            `$5n + 20n + 25(n + ${k}) = ${cents}$，得 $50n = ${cents - 25 * k}$，所以 $n = ${n}$。`,
          ],
        );
      },
    ),
  ],
  "consistency-and-dependency": [
    skill(
      "the-coefficient-that-makes-no-solution",
      ["The coefficient that makes no solution", "使方程组无解的系数"],
      [
        "A system has no solution when its lines are parallel and different. So the coefficients on the left must be in one ratio, while the constants on the right are not in that ratio.",
        "方程组无解，当且仅当两条直线平行且不重合。所以左边的系数要成同一比例，而右边的常数不成这个比例。",
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
            `The second left side must be ${k} times the first, so $t = ${k * b}$. The constant ${d} is not ${k} times ${c}, so the lines differ.`,
            `第二个方程的左边必须是第一个的 ${k} 倍，所以 $t = ${k * b}$。常数 ${d} 不是 ${c} 的 ${k} 倍，所以两条直线不重合。`,
          ],
        );
      },
    ),
  ],
  "end-behavior": [
    skill(
      "end-behavior-from-factors",
      ["End behavior from factors", "由因式看端点行为"],
      [
        "Multiplying out is not needed to find end behavior. The degree is the sum of the powers of the factors, and the leading coefficient is the number in front, assuming each factor starts with $x$.",
        "看端点行为不需要展开。次数是各因式次数之和，首项系数是前面的数（假定每个因式都以 $x$ 开头）。",
      ],
      (rng) => {
        const a = nz(rng, 5);
        const m = rng.int(1, 4);
        const n = rng.int(1, 4);
        const p = rng.int(-8, 8);
        const q = rng.int(-8, 8);
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
            `The degree is ${degree}, which is ${degree % 2 === 0 ? "even" : "odd"}, and the leading coefficient is ${a}.`,
            `次数是 ${degree}，是${degree % 2 === 0 ? "偶数" : "奇数"}，首项系数是 ${a}。`,
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
        "A recursive rule would need every earlier term, one at a time. Converting it to an explicit formula reaches a far term in one step, with $n - 1$ differences added to the first term.",
        "递推式要一项一项地算出前面所有的项。把它化成通项公式，一步就能得到很远的项：首项加上 $n - 1$ 个公差。",
      ],
      (rng) => {
        const first = rng.int(-20, 20);
        const d = nz(rng, 9);
        const n = rng.int(20, 200);
        return integer(
          [
            `A sequence has $a_1 = ${first}$ and $a_n = a_{n-1}${signed(d)}$. Find $a_{${n}}$.`,
            `数列满足 $a_1 = ${first}$，$a_n = a_{n-1}${signed(d)}$。求 $a_{${n}}$。`,
          ],
          first + (n - 1) * d,
          [first + n * d, (n - 1) * d, first * n + d],
          [
            `$a_{${n}} = ${first} + ${n - 1} \\cdot ${paren(d)} = ${first + (n - 1) * d}$.`,
            `$a_{${n}} = ${first} + ${n - 1} \\cdot ${paren(d)} = ${first + (n - 1) * d}$。`,
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
        "When the wanted letter appears in two terms, gather those terms on one side and factor it out. Only then can you divide by the other factor, which is assumed to be nonzero.",
        "要求的字母出现在两项中时，先把这两项移到同一边，再提取这个字母。这时才能除以另一个因式（假定它不为零）。",
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
            `$${a}${x} - ${c}${x} = ${d} - ${b}$, so $${x}(${a} - ${c}) = ${d} - ${b}$.`,
            `$${a}${x} - ${c}${x} = ${d} - ${b}$，所以 $${x}(${a} - ${c}) = ${d} - ${b}$。`,
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
        "Lengths can only be added once they are in the same unit. So first convert the kilometers to meters, multiplying by 1000, and then add the two numbers of meters.",
        "长度必须化成同一单位才能相加。所以先把千米化成米（乘 1000），再把两个米数相加。",
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
            `$${k / 10}\\text{ km} = ${k * 100}\\text{ m}$, and adding ${m} gives ${k * 100 + m}.`,
            `$${k / 10}\\text{ km} = ${k * 100}\\text{ m}$，加上 ${m} 得 ${k * 100 + m}。`,
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
        "Small items are weighed in grams, but a large total reads better in kilograms. So multiply to get the total in grams first, and then divide by 1000.",
        "小物品用克来称，而大的总量用千克更清楚。所以先相乘得到总克数，再除以 1000。",
      ],
      (rng) => {
        const n = rng.int(3, 40);
        const g = rng.int(12, 95) * 5;
        return decimal(
          [
            `Each of ${n} books has a mass of $${g}\\text{ g}$. What is their total mass in kilograms?`,
            `${n} 本书每本的质量是 $${g}\\text{ g}$。它们的总质量是多少千克？`,
          ],
          Q.of(n * g, 1000),
          [Q.of(n * g, 100), Q.of(n * g, 10000), Q.of(n * g)],
          [
            `$${n} \\times ${g} = ${n * g}\\text{ g}$, and dividing by 1000 gives the kilograms.`,
            `$${n} \\times ${g} = ${n * g}\\text{ g}$，除以 1000 得到千克数。`,
          ],
        );
      },
    ),
  ],
  "modeling-using-the-law-of-sines": [
    skill(
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
          [0, 1, 2, 3].filter((n) => n !== count),
          [
            `The height is $${b} \\sin 30^{\\circ} = ${height}$. With $a = ${a}$ compared to ${height} and ${b}, there ${count === 1 ? "is 1 triangle" : `are ${count} triangles`}.`,
            `高是 $${b} \\sin 30^{\\circ} = ${height}$。把 $a = ${a}$ 与 ${height} 和 ${b} 比较，有 ${count} 个三角形。`,
          ],
        );
      },
    ),
  ],
  "modeling-with-inverse-variation": [
    skill(
      "inverse-square-models",
      ["Inverse square models", "反平方模型"],
      [
        "Some quantities vary inversely with the square of another, such as the brightness of a light with distance. Multiplying the distance by $k$ then divides the brightness by $k^{2}$, not by $k$.",
        "有些量与另一个量的平方成反比，比如光的亮度与距离。距离乘 $k$ 时，亮度除以 $k^{2}$，而不是除以 $k$。",
      ],
      (rng) => {
        const k = rng.int(2, 6);
        const m = rng.int(2, 20);
        const d = rng.int(1, 9);
        const start = k * k * m;
        return whole(
          [
            `The brightness of a lamp varies inversely with the square of the distance from it. At ${d} m it is ${start} units. What is it at ${k * d} m?`,
            `灯的亮度与到灯的距离的平方成反比。在 ${d} 米处亮度是 ${start} 单位。在 ${k * d} 米处是多少？`,
          ],
          m,
          [k * m, start * k, start - k],
          [
            `The distance is multiplied by ${k}, so the brightness is divided by ${k * k}: ${m}.`,
            `距离乘 ${k}，所以亮度除以 ${k * k}：${m}。`,
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
        "To solve an equation with a piecewise function, solve it in each piece separately. Then keep a solution only if it lies in the part of the domain where that piece applies.",
        "解分段函数的方程时，要在每一段分别求解。然后只保留落在这一段定义域内的解。",
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
            `The first piece gives $x = ${x1}$, which is below ${c}. The second gives $x = ${Q.of(v - e, d).toLatex()}$, which is not at least ${c}, so it is rejected.`,
            `第一段得 $x = ${x1}$，小于 ${c}。第二段得 $x = ${Q.of(v - e, d).toLatex()}$，不满足至少为 ${c}，所以舍去。`,
          ],
        );
      },
    ),
  ],
  "range-advanced-cases": [
    skill(
      "the-range-of-a-reciprocal-function",
      ["The range of a reciprocal function", "倒数函数的值域"],
      [
        "A fraction with a constant top can be very large or very small but never zero. So $\\frac{a}{x - h} + k$ takes every value except $k$, which is the horizontal asymptote.",
        "分子是常数的分数可以很大或很小，但不会是零。所以 $\\frac{a}{x - h} + k$ 取到除 $k$ 以外的所有值，$k$ 就是水平渐近线。",
      ],
      (rng) => {
        const a = nz(rng, 9);
        let h = nz(rng, 9);
        const k = nz(rng, 9);
        if (h === k) h = -h;
        return chooseFilled(
          rng,
          [
            `Find the range of $f(x) = ${frac(a, factorOf(h).replace(/[()]/g, ""))}${signed(k)}$.`,
            `求 $f(x) = ${frac(a, factorOf(h).replace(/[()]/g, ""))}${signed(k)}$ 的值域。`,
          ],
          `y \\ne ${k}`,
          [`y \\ne ${h}`, `y > ${k}`, `\\text{all real numbers}`],
          [
            `The fraction is never 0, so $f(x)$ is never ${k}, and it takes every other value.`,
            `分数不会是 0，所以 $f(x)$ 不会等于 ${k}，其他值都能取到。`,
          ],
        );
      },
    ),
  ],
  "recursive-formulas-for-arithmetic-sequences": [
    skill(
      "the-difference-from-two-distant-terms",
      ["The difference from two distant terms", "由相隔的两项求公差"],
      [
        "Between two terms of an arithmetic sequence, the difference is added once for every step. So divide the change in value by the number of steps between them to find the rule.",
        "在等差数列的两项之间，每走一步加一次公差。所以用数值的变化除以它们之间的步数，就得到递推规则。",
      ],
      (rng) => {
        const m = rng.int(1, 12);
        const steps = rng.int(2, 12);
        const d = nz(rng, 9);
        const first = rng.int(-30, 30);
        return integer(
          [
            `A sequence follows $a_n = a_{n-1} + d$, with $a_{${m}} = ${first}$ and $a_{${m + steps}} = ${first + steps * d}$. Find $d$.`,
            `数列满足 $a_n = a_{n-1} + d$，$a_{${m}} = ${first}$，$a_{${m + steps}} = ${first + steps * d}$。求 $d$。`,
          ],
          d,
          [steps * d, -d, d + steps],
          [`The change is ${steps * d} over ${steps} steps, so $d = ${d}$.`, `变化量是 ${steps * d}，经过 ${steps} 步，所以 $d = ${d}$。`],
        );
      },
    ),
  ],
  "solving-for-variables-in-arithmetic-sequences": [
    skill(
      "three-terms-with-a-known-sum",
      ["Three terms with a known sum", "和已知的三项"],
      [
        "Writing three consecutive terms as $m - d$, $m$ and $m + d$ makes the differences cancel in the sum. So the middle term is one third of the sum, and the others follow from it.",
        "把连续三项写成 $m - d$、$m$、$m + d$，求和时公差就抵消了。所以中间一项是和的三分之一，其他两项由它得出。",
      ],
      (rng) => {
        const m = rng.int(-20, 30);
        const d = rng.int(1, 12);
        return integer(
          [
            `Three consecutive terms of an arithmetic sequence add up to ${3 * m}, and the common difference is ${d}. Find the smallest term.`,
            `等差数列连续三项的和是 ${3 * m}，公差是 ${d}。求最小的一项。`,
          ],
          m - d,
          [m, m + d, 3 * m - d],
          [
            `The middle term is $${3 * m} \\div 3 = ${m}$, so the smallest is $${m} - ${d} = ${m - d}$.`,
            `中间一项是 $${3 * m} \\div 3 = ${m}$，所以最小的是 $${m} - ${d} = ${m - d}$。`,
          ],
        );
      },
    ),
  ],
  "speed-time-graphs": [
    skill(
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
            `A speed-time graph rises in a straight line from 0 to ${v} m/s over ${t} s, and then stays level for ${s} s. How far does the object travel, in meters?`,
            `速度-时间图象在 ${t} 秒内从 0 沿直线升到 ${v} 米/秒，然后保持水平 ${s} 秒。物体走了多少米？`,
          ],
          (v * t) / 2 + v * s,
          [v * t + v * s, v * s, (v * (t + s)) / 2],
          [
            `The triangle has area ${(v * t) / 2} and the rectangle has area ${v * s}.`,
            `三角形面积是 ${(v * t) / 2}，矩形面积是 ${v * s}。`,
          ],
        );
      },
    ),
  ],
  "systems-with-decimal-coefficients": [
    skill(
      "a-mixture-system",
      ["A mixture system", "混合问题的方程组"],
      [
        "Mixture problems give one equation for the total amount and one for the amount of the ingredient, which has decimal coefficients. Multiplying that second equation by a power of 10 clears them.",
        "混合问题有一个关于总量的方程，还有一个关于成分含量的方程，后者的系数是小数。把第二个方程乘 10 的幂就能去掉小数。",
      ],
      (rng) => {
        const x = rng.int(1, 40);
        const y = rng.int(1, 40);
        const total = x + y;
        const acid = (x + 3 * y) / 10;
        return whole(
          [
            `${total} liters of a mixture contain ${acid} liters of acid. It was made from $x$ liters of a 10% solution and $y$ liters of a 30% solution. Find $y$.`,
            `${total} 升混合液含 ${acid} 升酸，由 $x$ 升浓度 10% 的溶液和 $y$ 升浓度 30% 的溶液配成。求 $y$。`,
          ],
          y,
          [x, Math.round(acid), total - Math.round(acid)],
          [
            `$x + y = ${total}$ and $0.1x + 0.3y = ${acid}$. Multiplying the second by 10 and subtracting gives $2y = ${2 * y}$.`,
            `$x + y = ${total}$，$0.1x + 0.3y = ${acid}$。第二式乘 10 再相减，得 $2y = ${2 * y}$。`,
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
        "When the same fractions appear in both equations, it is quicker not to clear them. Adding or subtracting the equations removes one fraction at once, and the other can then be solved.",
        "两个方程中出现相同的分数时，不去分母反而更快。把方程相加或相减，一个分数立刻消去，再解另一个。",
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
            `Adding gives $2 \\cdot ${frac("x", a)} = ${2 * m}$, so $${frac("x", a)} = ${m}$ and $x = ${a * m}$.`,
            `相加得 $2 \\cdot ${frac("x", a)} = ${2 * m}$，所以 $${frac("x", a)} = ${m}$，$x = ${a * m}$。`,
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
        "Every multiple of 90 degrees reduces to one of four positions on the unit circle. So find the remainder after dividing by 360, read off the sine and cosine there, and then combine them.",
        "90 度的每个倍数都化成单位圆上四个位置之一。所以先求除以 360 的余数，读出那里的正弦和余弦，再组合。",
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
            `$${angle}^{\\circ}$ ends at the same place as $${spot * 90}^{\\circ}$, where sine is ${s} and cosine is ${c}.`,
            `$${angle}^{\\circ}$ 与 $${spot * 90}^{\\circ}$ 终边相同，那里正弦是 ${s}，余弦是 ${c}。`,
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
        "A speed has two units to convert, one on top and one on the bottom. Turning kilometers into meters multiplies by 1000, and turning hours into seconds divides by 3600, so the net effect is dividing by 3.6.",
        "速度有两个单位要换算，一个在上面，一个在下面。千米化成米要乘 1000，小时化成秒要除以 3600，合起来就是除以 3.6。",
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
            toSeconds ? `$${36 * m} \\times 1000 \\div 3600 = ${10 * m}$.` : `$${10 * m} \\times 3600 \\div 1000 = ${36 * m}$.`,
            toSeconds ? `$${36 * m} \\times 1000 \\div 3600 = ${10 * m}$。` : `$${10 * m} \\times 3600 \\div 1000 = ${36 * m}$。`,
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
        "Two points with the same input and different outputs lie on one vertical line, so the relation is not a function. Comparing the first coordinates is therefore enough to check a list of points.",
        "输入相同、输出不同的两个点在同一条竖直线上，所以这个关系不是函数。因此检查点列时，只需比较第一个坐标。",
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
          [`With $k = ${hit}$, the input ${hit} has two different outputs.`, `$k = ${hit}$ 时，输入 ${hit} 有两个不同的输出。`],
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
        "An odd coefficient of $x$ gives a half in the completed square, which is not a problem. The fractions in $\\left(x + \\frac{b}{2}\\right)^{2}$ work out, and the roots can still be whole numbers.",
        "$x$ 的系数为奇数时，配方中会出现二分之一，这并不是问题。$\\left(x + \\frac{b}{2}\\right)^{2}$ 中的分数算下去，根仍可能是整数。",
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
            `$\\left(x + ${frac(b, 2)}\\right)^{2} = ${frac((r + s) * (r + s), 4)}$, so $x = -${frac(b, 2)} + ${frac(r + s, 2)} = ${r}$.`,
            `$\\left(x + ${frac(b, 2)}\\right)^{2} = ${frac((r + s) * (r + s), 4)}$，所以 $x = -${frac(b, 2)} + ${frac(r + s, 2)} = ${r}$。`,
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
        "If the sides are given in a smaller unit, either convert each side first or convert the area at the end. A square meter holds 10000 square centimeters, so converting the area divides by 10000, not 100.",
        "边长用较小单位给出时，可以先换算每条边，也可以最后换算面积。1 平方米含 10000 平方厘米，所以换算面积要除以 10000，而不是 100。",
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
            `$${a} \\times ${b} = ${a * b}\\text{ cm}^{2}$, and dividing by 10000 gives square meters.`,
            `$${a} \\times ${b} = ${a * b}\\text{ cm}^{2}$，除以 10000 得到平方米数。`,
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
        "A quadratic with exactly one solution is a perfect square, so $x^{2} + bx + c^{2}$ must equal $(x + c)^{2}$ or $(x - c)^{2}$. The sign of $b$ decides which, and the solution is the number that makes the square zero.",
        "恰有一个解的二次方程是完全平方，所以 $x^{2} + bx + c^{2}$ 必须等于 $(x + c)^{2}$ 或 $(x - c)^{2}$。$b$ 的符号决定是哪一个，解就是使平方为零的数。",
      ],
      (rng) => {
        const c = rng.int(1, 30);
        const positive = rng.bool();
        return integer(
          [
            `For a ${positive ? "positive" : "negative"} value of $b$, the equation $x^{2} + bx + ${c * c} = 0$ has exactly one solution. What is that solution?`,
            `当 $b$ 取某个${positive ? "正" : "负"}值时，方程 $x^{2} + bx + ${c * c} = 0$ 恰有一个解。这个解是多少？`,
          ],
          positive ? -c : c,
          [positive ? c : -c, positive ? 2 * c : -2 * c, c * c],
          [
            `$b = ${positive ? 2 * c : -2 * c}$ gives $(x ${positive ? "+" : "-"} ${c})^{2} = 0$, so $x = ${positive ? -c : c}$.`,
            `$b = ${positive ? 2 * c : -2 * c}$ 给出 $(x ${positive ? "+" : "-"} ${c})^{2} = 0$，所以 $x = ${positive ? -c : c}$。`,
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
        "Find the perimeter in the unit of the sides, and only then convert it. Since a yard is 3 feet, the number of yards is the number of feet divided by 3.",
        "先用边的单位求周长，然后再换算。因为 1 码等于 3 英尺，所以码数是英尺数除以 3。",
      ],
      (rng) => {
        const a = rng.int(2, 60);
        const yards = rng.int(Math.ceil((2 * a + 2) / 6) + 1, Math.ceil((2 * a + 2) / 6) + 30);
        const b = (3 * yards - 2 * a) / 2;
        const usable = Number.isInteger(b) ? b : b + 1.5;
        const y = (2 * (a + usable)) / 3;
        return whole(
          [
            `How many yards of fence go around a rectangle that is ${a} feet by ${usable} feet?`,
            `围住长 ${a} 英尺、宽 ${usable} 英尺的长方形需要多少码围栏？`,
          ],
          y,
          [2 * (a + usable), (a + usable) / 3 === Math.floor((a + usable) / 3) ? (a + usable) / 3 : y + 2, y * 9],
          [
            `The perimeter is ${2 * (a + usable)} feet, and dividing by 3 gives ${y} yards.`,
            `周长是 ${2 * (a + usable)} 英尺，除以 3 得 ${y} 码。`,
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
        "Multiply first to get the total in the smaller unit, and then convert it. Since a pound is 16 ounces, a total in ounces is divided by 16 to give pounds.",
        "先相乘得到较小单位的总量，然后换算。因为 1 磅等于 16 盎司，所以盎司总数除以 16 得到磅数。",
      ],
      (rng) => {
        const pounds = rng.int(2, 60);
        const each = rng.pick([2, 4, 8]);
        const n = (16 * pounds) / each;
        return whole(
          [
            `A shop has ${n} packets, each weighing ${each} ounces. What is their total weight in pounds?`,
            `商店有 ${n} 包货物，每包重 ${each} 盎司。总重是多少磅？`,
          ],
          pounds,
          [n * each, n, pounds * 2],
          [
            `$${n} \\times ${each} = ${n * each}$ ounces, and $${n * each} \\div 16 = ${pounds}$.`,
            `$${n} \\times ${each} = ${n * each}$ 盎司，$${n * each} \\div 16 = ${pounds}$。`,
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
        "Rates per item often use a small unit of time, while the total reads better in a larger one. So multiply to get the total seconds, and then divide by 60 for minutes.",
        "每件所用的时间常用小的时间单位，而总时间用大的单位更清楚。所以先相乘得到总秒数，再除以 60 得到分钟数。",
      ],
      (rng) => {
        const minutes = rng.int(2, 60);
        const each = rng.pick([2, 3, 4, 5, 6, 10, 12, 15, 20, 30]);
        const n = (60 * minutes) / each;
        return whole(
          [
            `A machine takes ${each} seconds per item. How many minutes does it take to make ${n} items?`,
            `一台机器每件用 ${each} 秒。做 ${n} 件要多少分钟？`,
          ],
          minutes,
          [n * each, n, minutes * 60],
          [
            `$${n} \\times ${each} = ${n * each}$ seconds, and $${n * each} \\div 60 = ${minutes}$.`,
            `$${n} \\times ${each} = ${n * each}$ 秒，$${n * each} \\div 60 = ${minutes}$。`,
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
          [m * 10 ** n, m + n, Math.round(m / 10) ** n],
          [
            `The E means times a power of ten: $${m / 10} \\times 10^{${n}} = ${value}$.`,
            `E 表示乘 10 的幂：$${m / 10} \\times 10^{${n}} = ${value}$。`,
          ],
        );
      },
    ),
  ],
  "exploring-functions-using-technology": [
    skill(
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
    skill(
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
            keepLeft ? `The signs differ between ${a} and ${m}.` : `The signs differ between ${m} and ${b}.`,
            keepLeft ? `${a} 和 ${m} 处异号。` : `${m} 和 ${b} 处异号。`,
          ],
        );
      },
    ),
  ],
};
