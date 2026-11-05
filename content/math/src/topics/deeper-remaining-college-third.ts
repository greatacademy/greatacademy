// A third knowledge point for the discrete mathematics and machine learning topics that still had two.

import type { KnowledgePointDef } from "@ga/content";
import { dec, Q } from "@ga/subject-math";

import { whole } from "./early-grades-more-kit.ts";
import { chooseFilled, decimal, frac, fraction, integer, signed, skill } from "./third-kit.ts";

/** Rng is the random source a generator receives. */
type Rng = Parameters<KnowledgePointDef["generate"]>[0];

/** nz picks a nonzero integer of size at most n. */
const nz = (rng: Rng, n: number) => rng.int(1, n) * (rng.bool() ? 1 : -1);

/** mat writes a matrix from its rows. */
const mat = (rows: readonly (readonly (number | string)[])[]) =>
  `\\begin{pmatrix} ${rows.map((r) => r.join(" & ")).join(" \\\\ ")} \\end{pmatrix}`;

/** vec writes a column vector. */
const vec = (...xs: readonly number[]) => mat(xs.map((x) => [x]));

/** paren writes a negative number in parentheses. */
const paren = (n: number) => (n < 0 ? `(${n})` : `${n}`);

/** term writes a coefficient and what it multiplies, as the first term of a sum. */
const term = (c: number, v: string) => `${c === 1 ? "" : c === -1 ? "-" : c}${v}`;

/** deeperRemainingCollegeThirdPoints holds these third knowledge points, by topic. */
export const deeperRemainingCollegeThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "applying-prims-algorithm-to-a-distance-matrix": [
    skill(
      "the-first-edge-from-a-given-start",
      ["The first edge from a given start", "从给定起点出发的第一条边"],
      [
        "Prim's algorithm grows a single tree from its starting vertex. So the first edge is the smallest entry in the row of that vertex, even when a smaller edge exists elsewhere in the matrix.",
        "普里姆算法从起点开始长成一棵树。所以第一条边是这个顶点所在行中最小的元素，即使矩阵别处有更小的边。",
      ],
      (rng) => {
        const w = rng.sample([3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 23], 6);
        const [ab, ac, ad, bc, bd, cd] = w as [number, number, number, number, number, number];
        const rows = [
          ["-", ab, ac, ad],
          [ab, "-", bc, bd],
          [ac, bc, "-", cd],
          [ad, bd, cd, "-"],
        ];
        const start = rng.int(0, 3);
        const name = ["A", "B", "C", "D"][start] as string;
        const row = (rows[start] as (number | string)[]).filter((x): x is number => typeof x === "number");
        return whole(
          [
            `The edge weights of a complete graph on $A, B, C, D$ are given by $${mat(rows)}$. Prim's algorithm starts at $${name}$. What is the weight of the first edge it adds?`,
            `完全图（顶点 $A, B, C, D$）的边权由 $${mat(rows)}$ 给出。普里姆算法从 $${name}$ 开始。它加入的第一条边的权是多少？`,
          ],
          Math.min(...row),
          [Math.max(...row), Math.min(...w), (row[1] as number) + 1],
          [`The smallest entry in the row of $${name}$ is ${Math.min(...row)}.`, `$${name}$ 所在行中最小的元素是 ${Math.min(...row)}。`],
        );
      },
    ),
  ],
  "argmax-and-argmin-notation": [
    skill(
      "argmax-under-a-rescaling",
      ["Argmax under a rescaling", "缩放后的最大值点"],
      [
        "Multiplying a function by a positive number and adding a constant changes its largest value but not where it occurs. This is why a loss can be rescaled freely without changing the best parameter.",
        "函数乘一个正数再加常数，会改变最大值，但不改变它出现的位置。所以损失函数可以任意缩放，最优参数不变。",
      ],
      (rng) => {
        const p = nz(rng, 20);
        const q = nz(rng, 20);
        const a = rng.int(2, 9);
        const b = nz(rng, 9);
        return integer(
          [
            `A function $f$ has its unique maximum value ${q} at $x = ${p}$. Find $\\operatorname{argmax}_{x} \\left(${a}f(x)${signed(b)}\\right)$.`,
            `函数 $f$ 在 $x = ${p}$ 处取唯一最大值 ${q}。求 $\\operatorname{argmax}_{x} \\left(${a}f(x)${signed(b)}\\right)$。`,
          ],
          p,
          [q, a * q + b, a * p + b],
          [
            `The rescaled function is largest at the same place, $x = ${p}$; only the value becomes ${a * q + b}.`,
            `缩放后的函数在同一处最大，即 $x = ${p}$；只有最大值变成 ${a * q + b}。`,
          ],
        );
      },
    ),
  ],
  "computing-principal-components": [
    skill(
      "the-second-variance-from-the-trace",
      ["The second variance from the trace", "由迹求第二个方差"],
      [
        "The eigenvalues of a covariance matrix add up to its trace, which is the sum of the variances on the diagonal. So once the largest eigenvalue is known, the other one in two dimensions needs no further work.",
        "协方差矩阵的特征值之和等于它的迹，也就是对角线上方差的和。所以在二维中知道最大特征值后，另一个不需要再计算。",
      ],
      (rng) => {
        const l = rng.int(1, 30);
        const m = rng.int(1, 3);
        const big = l + 25 * m;
        const swap = rng.bool();
        const p = l + (swap ? 16 : 9) * m;
        const r = l + (swap ? 9 : 16) * m;
        return whole(
          [
            `The covariance matrix $${mat([
              [p, 12 * m],
              [12 * m, r],
            ])}$ has largest eigenvalue ${big}. What is the other eigenvalue?`,
            `协方差矩阵 $${mat([
              [p, 12 * m],
              [12 * m, r],
            ])}$ 的最大特征值是 ${big}。另一个特征值是多少？`,
          ],
          l,
          [p + r, big - 12 * m, p],
          [`The trace is ${p + r}, and $${p + r} - ${big} = ${l}$.`, `迹是 ${p + r}，$${p + r} - ${big} = ${l}$。`],
        );
      },
    ),
  ],
  "conditional-expectation-for-continuous-random-variables": [
    skill(
      "a-linear-function-given-a-value",
      ["A linear function given a value", "给定值时的线性函数"],
      [
        "Conditional expectation is linear, just like ordinary expectation. So once $E[X \\mid Y = y]$ is known as a function of $y$, the expectation of $rX + s$ follows by substituting and scaling.",
        "条件期望和普通期望一样是线性的。所以知道 $E[X \\mid Y = y]$ 是 $y$ 的函数后，$rX + s$ 的期望可以代入再缩放得到。",
      ],
      (rng) => {
        const p = rng.int(2, 6);
        const q = nz(rng, 9);
        const r = rng.int(2, 6);
        const s = nz(rng, 9);
        const y = rng.int(1, 9);
        return integer(
          [
            `Suppose $E[X \\mid Y = y] = ${p}y${signed(q)}$. Find $E[${r}X${signed(s)} \\mid Y = ${y}]$.`,
            `设 $E[X \\mid Y = y] = ${p}y${signed(q)}$。求 $E[${r}X${signed(s)} \\mid Y = ${y}]$。`,
          ],
          r * (p * y + q) + s,
          [p * y + q, r * (p * y + q), r * p * y + q + s],
          [
            `At $y = ${y}$ the expectation of $X$ is ${p * y + q}, so the answer is $${r} \\cdot ${paren(p * y + q)}${signed(s)}$.`,
            `$y = ${y}$ 时 $X$ 的期望是 ${p * y + q}，所以答案是 $${r} \\cdot ${paren(p * y + q)}${signed(s)}$。`,
          ],
        );
      },
    ),
  ],
  "conditional-variance-for-continuous-random-variables": [
    skill(
      "scaling-a-conditional-variance",
      ["Scaling a conditional variance", "条件方差的缩放"],
      [
        "Given $Y$, the variable $X$ behaves like any other random variable. So a multiplier comes out of the conditional variance squared, and an added constant has no effect on the spread.",
        "给定 $Y$ 时，$X$ 与其他随机变量一样。所以乘数提到条件方差外面时要平方，而加上的常数不影响离散程度。",
      ],
      (rng) => {
        const c = rng.int(1, 6);
        const y = rng.int(1, 6);
        const a = rng.int(2, 5);
        const b = nz(rng, 20);
        const v = c * y * y;
        return whole(
          [
            `Suppose $\\operatorname{Var}(X \\mid Y = y) = ${term(c, "y^{2}")}$. Find $\\operatorname{Var}(${a}X${signed(b)} \\mid Y = ${y})$.`,
            `设 $\\operatorname{Var}(X \\mid Y = y) = ${term(c, "y^{2}")}$。求 $\\operatorname{Var}(${a}X${signed(b)} \\mid Y = ${y})$。`,
          ],
          a * a * v,
          [a * v, a * a * v + Math.abs(b), v],
          [
            `The variance given $y = ${y}$ is ${v}, and the multiplier gives a factor of ${a * a}.`,
            `$y = ${y}$ 时方差是 ${v}，乘数带来因子 ${a * a}。`,
          ],
        );
      },
    ),
  ],
  "determining-ranges-of-validity-for-generalized-binomial-expansions": [
    skill(
      "validity-with-a-squared-variable",
      ["Validity with a squared variable", "含平方变量时的有效范围"],
      [
        "The expansion of $(1 + u)^{r}$ needs $|u| < 1$, whatever $u$ stands for. So with $u = m^{2}x^{2}$ the condition becomes $|mx| < 1$, and the square root changes the answer compared with a plain $x$.",
        "$(1 + u)^{r}$ 的展开要求 $|u| < 1$，不管 $u$ 代表什么。所以 $u = m^{2}x^{2}$ 时条件变成 $|mx| < 1$，与单独的 $x$ 相比，开平方改变了结果。",
      ],
      (rng) => {
        const m = rng.int(2, 12);
        const sign = rng.bool() ? "+" : "-";
        const r = rng.pick(["-1", "-2", "-3", "\\frac{1}{2}", "-\\frac{1}{2}", "\\frac{1}{3}"]);
        return fraction(
          [
            `The expansion of $(1 ${sign} ${m * m}x^{2})^{${r}}$ in powers of $x$ is valid for $|x| < c$. Find $c$.`,
            `$(1 ${sign} ${m * m}x^{2})^{${r}}$ 按 $x$ 的幂展开，在 $|x| < c$ 时有效。求 $c$。`,
          ],
          Q.of(1, m),
          [Q.of(1, m * m), Q.of(m), Q.of(1, 2 * m)],
          [`$${m * m}x^{2} < 1$ gives $|x| < ${frac(1, m)}$.`, `$${m * m}x^{2} < 1$ 得 $|x| < ${frac(1, m)}$。`],
        );
      },
    ),
  ],
  "determining-the-general-term-of-a-sequence-from-its-generating-function": [
    skill(
      "the-growth-from-the-denominator",
      ["The growth from the denominator", "由分母看增长"],
      [
        "A factor $1 - rx$ in the denominator contributes a term with $r^{n}$ to the sequence. For large $n$ the root with the largest size dominates, so the ratio of neighboring terms approaches it.",
        "分母中的因式 $1 - rx$ 给数列贡献一个 $r^{n}$ 项。$n$ 很大时，绝对值最大的那个起主导作用，所以相邻两项的比趋近于它。",
      ],
      (rng) => {
        const r = rng.int(2, 12);
        const s = rng.int(1, r - 1) * (rng.bool() ? 1 : -1);
        const top = rng.int(1, 9);
        const inner = s < 0 ? `(1 + ${s === -1 ? "" : -s}x)` : `(1 - ${s === 1 ? "" : s}x)`;
        return whole(
          [
            `$G(x) = \\frac{${top}}{(1 - ${r}x)${inner}}$ generates $a_0, a_1, a_2, \\dots$. What does $\\frac{a_{n+1}}{a_n}$ approach for large $n$?`,
            `$G(x) = \\frac{${top}}{(1 - ${r}x)${inner}}$ 生成 $a_0, a_1, a_2, \\dots$。$n$ 很大时 $\\frac{a_{n+1}}{a_n}$ 趋近于多少？`,
          ],
          r,
          [Math.abs(s) === r ? r + 1 : Math.abs(s), r + Math.abs(s), top],
          [
            `The terms grow like $${r}^{n}$, since ${r} is larger in size than ${s}.`,
            `各项按 $${r}^{n}$ 增长，因为 ${r} 的绝对值大于 ${s}。`,
          ],
        );
      },
    ),
  ],
  "euclidean-manhattan-and-minkowski-distance": [
    skill(
      "the-chebyshev-distance",
      ["The Chebyshev distance", "切比雪夫距离"],
      [
        "As the order of a Minkowski distance grows, the largest coordinate difference takes over. In the limit, the Chebyshev distance is simply the largest absolute difference among the coordinates.",
        "闵可夫斯基距离的阶数增大时，最大的坐标差占主导。取极限得到切比雪夫距离，就是各坐标差绝对值中最大的那个。",
      ],
      (rng) => {
        const x = [nz(rng, 9), nz(rng, 9), nz(rng, 9), nz(rng, 9)];
        const y = [nz(rng, 9), nz(rng, 9), nz(rng, 9), nz(rng, 9)];
        const d = x.map((v, i) => Math.abs(v - (y[i] as number)));
        const most = Math.max(...d);
        const sum = d.reduce((a, b) => a + b, 0);
        return whole(
          [
            `Find the Chebyshev distance $D_{\\infty}(\\mathbf{x}, \\mathbf{y})$ between $\\mathbf{x} = (${x.join(", ")})$ and $\\mathbf{y} = (${y.join(", ")})$.`,
            `求 $\\mathbf{x} = (${x.join(", ")})$ 和 $\\mathbf{y} = (${y.join(", ")})$ 之间的切比雪夫距离 $D_{\\infty}(\\mathbf{x}, \\mathbf{y})$。`,
          ],
          most,
          [sum, Math.min(...d), most + 1],
          [`The absolute differences are ${d.join(", ")}, and the largest is ${most}.`, `差的绝对值是 ${d.join("、")}，最大的是 ${most}。`],
        );
      },
    ),
  ],
  "feature-extraction-using-pca": [
    skill(
      "reconstructing-a-point-from-its-score",
      ["Reconstructing a point from its score", "由得分重构数据点"],
      [
        "Keeping one component stores only a score for each point. To return to the original space, multiply the principal direction by that score, which gives the closest point on the line.",
        "只保留一个主成分时，每个点只存一个得分。要回到原来的空间，就用主方向乘这个得分，得到直线上最近的点。",
      ],
      (rng) => {
        const [a, b, c] = rng.pick<[number, number, number]>([
          [3, 4, 5],
          [4, 3, 5],
          [5, 12, 13],
          [12, 5, 13],
          [8, 15, 17],
          [15, 8, 17],
        ]);
        const m = nz(rng, 9);
        const s = c * m;
        return chooseFilled(
          rng,
          [
            `The first principal direction is $\\mathbf{v}_1 = \\left(${frac(a, c)}, ${frac(b, c)}\\right)$, and a centered point has score ${s}. Find its reconstruction from this one component.`,
            `第一主方向是 $\\mathbf{v}_1 = \\left(${frac(a, c)}, ${frac(b, c)}\\right)$，一个中心化后的点的得分是 ${s}。求只用这一个主成分的重构结果。`,
          ],
          `(${a * m}, ${b * m})`,
          [`(${b * m}, ${a * m})`, `(${a * s}, ${b * s})`, `(${-a * m}, ${-b * m})`],
          [`$${s} \\cdot \\mathbf{v}_1 = (${a * m}, ${b * m})$.`, `$${s} \\cdot \\mathbf{v}_1 = (${a * m}, ${b * m})$。`],
        );
      },
    ),
  ],
  "finding-argmax-and-argmin-from-tables-and-graphs": [
    skill(
      "the-argmax-of-a-sum",
      ["The argmax of a sum", "和的最大值点"],
      [
        "The best input for a sum need not be the best input for either part. So a combined score, such as accuracy minus a penalty, has to be worked out at each input before comparing.",
        "和的最优输入不一定是任一部分的最优输入。所以综合得分（比如准确率减去惩罚）要在每个输入处算出来，再作比较。",
      ],
      (rng) => {
        const f = rng.sample([2, 4, 5, 7, 9, 11, 12, 14, 15, 17], 5);
        const g = rng.sample([1, 3, 6, 8, 10, 13, 16, 18, 19, 20], 5);
        const sums = f.map((v, i) => v + (g[i] as number));
        let best = Math.max(...sums);
        const at = sums.indexOf(best);
        if (sums.filter((v) => v === best).length > 1) {
          g[at] = (g[at] as number) + 1;
          sums[at] = (sums[at] as number) + 1;
          best += 1;
        }
        return whole(
          [
            `For $x = 1, 2, 3, 4, 5$, $f(x)$ takes the values $${f.join(", ")}$ and $g(x)$ takes the values $${g.join(", ")}$. Find $\\operatorname{argmax}_{x} \\left(f(x) + g(x)\\right)$.`,
            `当 $x = 1, 2, 3, 4, 5$ 时，$f(x)$ 依次取 $${f.join(", ")}$，$g(x)$ 依次取 $${g.join(", ")}$。求 $\\operatorname{argmax}_{x} \\left(f(x) + g(x)\\right)$。`,
          ],
          at + 1,
          [1, 2, 3, 4, 5].filter((n) => n !== at + 1),
          [
            `The sums are ${sums.join(", ")}, and the largest, ${best}, comes at $x = ${at + 1}$.`,
            `和依次是 ${sums.join("、")}，最大的 ${best} 在 $x = ${at + 1}$ 处。`,
          ],
        );
      },
    ),
  ],
  "finite-cubic-series": [
    skill(
      "a-sum-of-cubes-between-bounds",
      ["A sum of cubes between bounds", "两个界之间的立方和"],
      [
        "A sum that does not start at 1 is a difference of two sums that do. So subtract the sum up to just below the lower bound, using the formula that the cubes add up to a triangular number squared.",
        "不从 1 开始的和，是两个从 1 开始的和之差。所以减去到下界前一项为止的和，公式是立方和等于三角形数的平方。",
      ],
      (rng) => {
        const m = rng.int(2, 8);
        const n = m + rng.int(2, 8);
        const upper = (n * (n + 1)) / 2;
        const lower = ((m - 1) * m) / 2;
        return whole(
          [`Evaluate $\\sum_{k=${m}}^{${n}} k^{3}$.`, `计算 $\\sum_{k=${m}}^{${n}} k^{3}$。`],
          upper * upper - lower * lower,
          [upper * upper, upper * upper - (((m * (m + 1)) / 2) * (m * (m + 1))) / 2, (upper - lower) ** 2],
          [
            `Take the sum up to ${n} minus the sum up to ${m - 1}, each a square of a triangular number: $${upper}^{2} - ${lower}^{2} = ${upper * upper - lower * lower}$.`,
            `用到 ${n} 的和减去到 ${m - 1} 的和，它们都是三角形数的平方：$${upper}^{2} - ${lower}^{2} = ${upper * upper - lower * lower}$。`,
          ],
        );
      },
    ),
  ],
  "first-order-recurrence-relations-with-exponential-forcing": [
    skill(
      "the-constant-from-the-start",
      ["The constant from the start", "由初值求常数"],
      [
        "The general solution adds a multiple of $r^{n}$ to the particular solution. The starting value then fixes that multiple, because at $n = 0$ both powers equal 1.",
        "通解是在特解上加 $r^{n}$ 的倍数。初值决定这个倍数，因为 $n = 0$ 时两个幂都等于 1。",
      ],
      (rng) => {
        const r = rng.pick([-3, -2, 2, 3, 4]);
        const s = rng.pick([2, 3, 4, 5].filter((v) => v !== r));
        const m = nz(rng, 4);
        const c = m * (s - r);
        const k = s * m;
        const start = rng.int(-20, 20);
        return integer(
          [
            `$a_n = ${r}a_{n-1}${c < 0 ? " - " : " + "}${Math.abs(c) === 1 ? "" : `${Math.abs(c)} \\cdot `}${s}^{n}$ with $a_0 = ${start}$ has the solution $a_n = A \\cdot ${paren(r)}^{n} + K \\cdot ${s}^{n}$. Find $A$.`,
            `$a_n = ${r}a_{n-1}${c < 0 ? " - " : " + "}${Math.abs(c) === 1 ? "" : `${Math.abs(c)} \\cdot `}${s}^{n}$，$a_0 = ${start}$，解为 $a_n = A \\cdot ${paren(r)}^{n} + K \\cdot ${s}^{n}$。求 $A$。`,
          ],
          start - k,
          [k, start + k, start],
          [
            `Substituting gives $K = ${k}$, and $A + K = ${start}$ at $n = 0$, so $A = ${start - k}$.`,
            `代入得 $K = ${k}$，$n = 0$ 时 $A + K = ${start}$，所以 $A = ${start - k}$。`,
          ],
        );
      },
    ),
  ],
  "first-order-recurrence-relations-with-polynomial-forcing": [
    skill(
      "the-constant-after-polynomial-forcing",
      ["The constant after polynomial forcing", "多项式强迫项的常数"],
      [
        "After finding the particular solution $cn + e$, add the homogeneous part $A \\cdot r^{n}$. At $n = 0$ the linear part leaves only $e$, so the starting value gives $A$ at once.",
        "求出特解 $cn + e$ 后，加上齐次部分 $A \\cdot r^{n}$。$n = 0$ 时线性部分只剩 $e$，所以由初值立刻得到 $A$。",
      ],
      (rng) => {
        const r = rng.pick([-3, -2, 2, 3, 4]);
        const c = nz(rng, 5);
        const e = nz(rng, 9);
        const alpha = c * (1 - r);
        const beta = e - r * e + r * c;
        const start = rng.int(-20, 20);
        return integer(
          [
            `$a_n = ${r}a_{n-1}${alpha < 0 ? " - " : " + "}${Math.abs(alpha)}n${signed(beta)}$ with $a_0 = ${start}$ has the particular solution $${term(c, "n")}${signed(e)}$. Write $a_n = A \\cdot ${paren(r)}^{n} ${c < 0 ? "-" : "+"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}n${signed(e)}$ and find $A$.`,
            `$a_n = ${r}a_{n-1}${alpha < 0 ? " - " : " + "}${Math.abs(alpha)}n${signed(beta)}$，$a_0 = ${start}$，特解是 $${term(c, "n")}${signed(e)}$。写成 $a_n = A \\cdot ${paren(r)}^{n} ${c < 0 ? "-" : "+"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}n${signed(e)}$，求 $A$。`,
          ],
          start - e,
          [start + e, e, start - c],
          [
            `At $n = 0$, $A + ${paren(e)} = ${start}$, so $A = ${start - e}$.`,
            `$n = 0$ 时 $A + ${paren(e)} = ${start}$，所以 $A = ${start - e}$。`,
          ],
        );
      },
    ),
  ],
  "functionally-complete-sets": [
    skill(
      "counting-the-true-rows",
      ["Counting the true rows", "数真值行"],
      [
        "Each extra variable doubles the rows of a truth table, and it does not change the value of a connective that ignores it. So count the true cases for the two variables used, and multiply by the doubling.",
        "每多一个变量，真值表的行数翻倍，而不用这个变量的联结词的值不变。所以先数用到的两个变量的真值情况，再乘翻倍的倍数。",
      ],
      (rng) => {
        const row = rng.pick<[string, number]>([
          ["\\wedge", 1],
          ["\\vee", 3],
          ["\\uparrow", 3],
          ["\\downarrow", 1],
          ["\\oplus", 2],
          ["\\rightarrow", 3],
        ]);
        const n = rng.int(2, 7);
        const count = row[1] * 2 ** (n - 2);
        return whole(
          [
            `A truth table has ${n} variables, including $p$ and $q$. In how many of its rows is $p ${row[0]} q$ true?`,
            `真值表有 ${n} 个变量，其中包括 $p$ 和 $q$。$p ${row[0]} q$ 在多少行中为真？`,
          ],
          count,
          [row[1], 2 ** n, (4 - row[1]) * 2 ** (n - 2) === count ? count + 1 : (4 - row[1]) * 2 ** (n - 2)],
          [
            `It is true in ${row[1]} of the 4 cases for $p$ and $q$, and the other variables give $2^{${n - 2}}$ rows for each.`,
            `在 $p$、$q$ 的 4 种情况中有 ${row[1]} 种为真，其他变量使每种有 $2^{${n - 2}}$ 行。`,
          ],
        );
      },
    ),
  ],
  "further-vector-gradients": [
    skill(
      "the-gradient-of-a-squared-distance",
      ["The gradient of a squared distance", "距离平方的梯度"],
      [
        "The gradient of $\\|\\mathbf{x} - \\mathbf{c}\\|^{2}$ is $2(\\mathbf{x} - \\mathbf{c})$, which points directly away from $\\mathbf{c}$. So a gradient step on this function moves the point toward $\\mathbf{c}$.",
        "$\\|\\mathbf{x} - \\mathbf{c}\\|^{2}$ 的梯度是 $2(\\mathbf{x} - \\mathbf{c})$，它指向背离 $\\mathbf{c}$ 的方向。所以沿这个函数做梯度下降，点就向 $\\mathbf{c}$ 移动。",
      ],
      (rng) => {
        const x = [nz(rng, 9), nz(rng, 9)] as const;
        const c = [nz(rng, 9), nz(rng, 9)] as const;
        return chooseFilled(
          rng,
          [
            `Let $f(\\mathbf{x}) = \\|\\mathbf{x} - \\mathbf{c}\\|^{2}$ with $\\mathbf{c} = ${vec(...c)}$. Find $\\nabla f$ at $\\mathbf{x} = ${vec(...x)}$.`,
            `设 $f(\\mathbf{x}) = \\|\\mathbf{x} - \\mathbf{c}\\|^{2}$，$\\mathbf{c} = ${vec(...c)}$。求 $\\mathbf{x} = ${vec(...x)}$ 处的 $\\nabla f$。`,
          ],
          vec(2 * (x[0] - c[0]), 2 * (x[1] - c[1])),
          [vec(x[0] - c[0], x[1] - c[1]), vec(2 * (c[0] - x[0]), 2 * (c[1] - x[1])), vec(2 * x[0], 2 * x[1])],
          [
            `The gradient is $2(\\mathbf{x} - \\mathbf{c})$, whose components are $2(${x[0]} - (${c[0]})) = ${2 * (x[0] - c[0])}$ and $2(${x[1]} - (${c[1]})) = ${2 * (x[1] - c[1])}$.`,
            `梯度是 $2(\\mathbf{x} - \\mathbf{c})$，其分量为 $2(${x[0]} - (${c[0]})) = ${2 * (x[0] - c[0])}$ 和 $2(${x[1]} - (${c[1]})) = ${2 * (x[1] - c[1])}$。`,
          ],
        );
      },
    ),
  ],
  "generating-functions-for-inhomogeneous-recurrence-relations": [
    skill(
      "partial-sums-from-a-factor",
      ["Partial sums from a factor", "因式与部分和"],
      [
        "Dividing a generating function by $1 - x$ turns a sequence into its partial sums. So the coefficients of $\\frac{1}{(1 - x)(1 - rx)}$ are the sums $1 + r + \\dots + r^{n}$ of a geometric sequence.",
        "生成函数除以 $1 - x$，就把数列变成它的部分和。所以 $\\frac{1}{(1 - x)(1 - rx)}$ 的系数是等比数列的和 $1 + r + \\dots + r^{n}$。",
      ],
      (rng) => {
        const r = rng.int(2, 6);
        const n = rng.int(2, 7);
        const sum = (r ** (n + 1) - 1) / (r - 1);
        return whole(
          [
            `Find the coefficient of $x^{${n}}$ in $\\frac{1}{(1 - x)(1 - ${r}x)}$.`,
            `求 $\\frac{1}{(1 - x)(1 - ${r}x)}$ 中 $x^{${n}}$ 的系数。`,
          ],
          sum,
          [r ** n, sum - r ** n === r ** n ? sum + 1 : sum - r ** n, r ** (n + 1)],
          [`It is $1 + ${r} + \\dots + ${r}^{${n}} = ${sum}$.`, `它是 $1 + ${r} + \\dots + ${r}^{${n}} = ${sum}$。`],
        );
      },
    ),
  ],
  "gradients-with-respect-to-a-variable-subset": [
    skill(
      "the-best-block-given-the-other",
      ["The best block given the other", "固定另一块时的最优解"],
      [
        "Setting the gradient with respect to one block of variables to zero gives its best value while the others stay fixed. This one step is the basis of alternating minimization.",
        "令关于一块变量的梯度为零，就得到其他变量固定时这一块的最优值。这一步是交替最小化的基础。",
      ],
      (rng) => {
        const a = rng.int(1, 6);
        const m = nz(rng, 5);
        const b = 2 * a * m;
        const c = rng.int(1, 9);
        const y = nz(rng, 9);
        return integer(
          [
            `Let $f(x, y) = ${term(a, "x^{2}")} ${b < 0 ? "-" : "+"} ${Math.abs(b)}xy + ${term(c, "y^{2}")}$. With $y = ${y}$ held fixed, which $x$ makes $\\frac{\\partial f}{\\partial x} = 0$?`,
            `设 $f(x, y) = ${term(a, "x^{2}")} ${b < 0 ? "-" : "+"} ${Math.abs(b)}xy + ${term(c, "y^{2}")}$。固定 $y = ${y}$，哪个 $x$ 使 $\\frac{\\partial f}{\\partial x} = 0$？`,
          ],
          -m * y,
          [m * y, b * y, -b * y],
          [
            `$${2 * a}x + ${paren(b)} \\cdot ${paren(y)} = 0$ gives $x = ${-m * y}$.`,
            `$${2 * a}x + ${paren(b)} \\cdot ${paren(y)} = 0$，得 $x = ${-m * y}$。`,
          ],
        );
      },
    ),
  ],
  "incidence-matrices": [
    skill(
      "the-ones-in-an-incidence-matrix",
      ["The ones in an incidence matrix", "关联矩阵中 1 的个数"],
      [
        "Each column of the incidence matrix of a simple graph has exactly two ones, one for each end of the edge. So the total number of ones is twice the number of edges, whatever the vertex count.",
        "简单图的关联矩阵每一列恰有两个 1，对应边的两个端点。所以 1 的总数是边数的两倍，与顶点数无关。",
      ],
      (rng) => {
        const v = rng.int(4, 20);
        const e = rng.int(3, 40);
        const usable = Math.min(e, (v * (v - 1)) / 2);
        return whole(
          [
            `A simple graph has ${v} vertices and ${usable} edges. How many entries of its incidence matrix equal 1?`,
            `简单图有 ${v} 个顶点、${usable} 条边。它的关联矩阵中有多少个元素等于 1？`,
          ],
          2 * usable,
          [usable, v * usable, 2 * v],
          [`Each of the ${usable} columns holds two ones.`, `${usable} 列中每列有两个 1。`],
        );
      },
    ),
  ],
  "indicator-functions-for-predicates": [
    skill(
      "the-expected-count-of-an-indicator",
      ["The expected count of an indicator", "指示函数的期望计数"],
      [
        "The expected value of an indicator is the probability of its predicate, since it is 1 exactly when the predicate holds. So the expected sum over many samples is the number of samples times that probability.",
        "指示函数的期望就是谓词的概率，因为它恰好在谓词成立时为 1。所以许多样本上求和的期望，是样本数乘这个概率。",
      ],
      (rng) => {
        const q = rng.pick([2, 4, 5, 8, 10, 20, 25]);
        const p = rng.int(1, q - 1);
        const n = q * rng.int(2, 40);
        return whole(
          [
            `Each of ${n} independent samples is classified correctly with probability $${Q.of(p, q).toLatex()}$. What is the expected value of $\\sum_{i=1}^{${n}} \\mathbb{I}[\\hat{y}_i = y_i]$?`,
            `${n} 个独立样本中，每个被正确分类的概率是 $${Q.of(p, q).toLatex()}$。$\\sum_{i=1}^{${n}} \\mathbb{I}[\\hat{y}_i = y_i]$ 的期望是多少？`,
          ],
          (n * p) / q,
          [n, n - (n * p) / q === (n * p) / q ? (n * p) / q + 1 : n - (n * p) / q, p],
          [`$${n} \\cdot ${Q.of(p, q).toLatex()} = ${(n * p) / q}$.`, `$${n} \\cdot ${Q.of(p, q).toLatex()} = ${(n * p) / q}$。`],
        );
      },
    ),
  ],
  "introduction-to-principal-component-analysis": [
    skill(
      "the-share-of-variance-kept",
      ["The share of variance kept", "保留的方差比例"],
      [
        "Each component accounts for a share of the total variance equal to its eigenvalue divided by the sum of all the eigenvalues. Keeping several components adds up their shares.",
        "每个主成分所占总方差的比例，等于它的特征值除以所有特征值之和。保留几个主成分，就把它们的比例相加。",
      ],
      (rng) => {
        const values = rng.sample([2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 25, 30, 32, 40], 4).sort((a, b) => b - a);
        const k = rng.int(1, 2);
        const kept = values.slice(0, k).reduce((a, b) => a + b, 0);
        const total = values.reduce((a, b) => a + b, 0);
        return fraction(
          [
            `A covariance matrix has eigenvalues $${values.join(", ")}$. What fraction of the total variance ${k === 1 ? "does the first component" : "do the first two components"} keep?`,
            `协方差矩阵的特征值是 $${values.join(", ")}$。前 ${k === 1 ? "一" : "两"}个主成分保留了总方差的几分之几？`,
          ],
          Q.of(kept, total),
          [Q.of(k, 4), Q.of(kept, total - kept), Q.of(total - kept, total)],
          [
            `The kept eigenvalues sum to $${kept}$ and all of them sum to $${total}$, so the share is $${Q.of(kept, total).toLatex()}$.`,
            `保留的特征值之和是 $${kept}$，全部特征值之和是 $${total}$，所以比例是 $${Q.of(kept, total).toLatex()}$。`,
          ],
        );
      },
    ),
  ],
  "matrix-gradients": [
    skill(
      "the-gradient-of-the-frobenius-norm",
      ["The gradient of the Frobenius norm", "弗罗贝尼乌斯范数的梯度"],
      [
        "The squared Frobenius norm is the sum of the squares of all the entries, so each entry contributes separately. Differentiating entry by entry shows that the gradient is $2X$.",
        "弗罗贝尼乌斯范数的平方是所有元素的平方和，所以每个元素分别起作用。逐元素求导可知梯度是 $2X$。",
      ],
      (rng) => {
        const [a, b, c, d] = [nz(rng, 9), nz(rng, 9), nz(rng, 9), nz(rng, 9)];
        return chooseFilled(
          rng,
          [
            `Let $f(X) = \\|X\\|_{F}^{2} = \\operatorname{tr}(X^{T}X)$. Find $\\nabla_{X} f$ at $X = ${mat([
              [a, b],
              [c, d],
            ])}$.`,
            `设 $f(X) = \\|X\\|_{F}^{2} = \\operatorname{tr}(X^{T}X)$。求 $X = ${mat([
              [a, b],
              [c, d],
            ])}$ 处的 $\\nabla_{X} f$。`,
          ],
          mat([
            [2 * a, 2 * b],
            [2 * c, 2 * d],
          ]),
          [
            mat([
              [a, b],
              [c, d],
            ]),
            mat([
              [2 * a, 2 * c],
              [2 * b, 2 * d],
            ]),
            mat([
              [a * a, b * b],
              [c * c, d * d],
            ]),
          ],
          [
            `Each entry $x_{ij}$ contributes $x_{ij}^{2}$, whose derivative is $2x_{ij}$.`,
            `每个元素 $x_{ij}$ 贡献 $x_{ij}^{2}$，其导数是 $2x_{ij}$。`,
          ],
        );
      },
    ),
  ],
  "nondeterministic-turing-machines": [
    skill(
      "counting-accepting-branches",
      ["Counting accepting branches", "数接受的分支"],
      [
        "A nondeterministic machine accepts when at least one branch accepts, so a single branch is enough. Counting how many branches accept shows how rare the right guesses can be among all the leaves.",
        "非确定型机器只要有一个分支接受就接受，所以一个分支就够了。数有多少分支接受，可以看出在所有叶子中正确的猜测可以多么稀少。",
      ],
      (rng) => {
        const b = rng.int(2, 4);
        const d = rng.int(3, 7);
        const k = rng.int(1, d - 1);
        return whole(
          [
            `A nondeterministic machine has exactly ${b} moves at each of its ${d} steps. A branch accepts when its first ${k} choices are the one correct choice each, whatever follows. How many branches accept?`,
            `一台非确定型机器在 ${d} 步中每步恰有 ${b} 种选择。一个分支接受，当且仅当前 ${k} 次选择都是唯一正确的选择，后面不限。有多少分支接受？`,
          ],
          b ** (d - k),
          [b ** d, b ** k, d - k],
          [
            `The first ${k} choices are fixed, and the other ${d - k} are free, which gives $${b}^{${d - k}}$.`,
            `前 ${k} 次选择固定，其余 ${d - k} 次任意，所以是 $${b}^{${d - k}}$。`,
          ],
        );
      },
    ),
  ],
  "processing-strings-using-turing-machines": [
    skill(
      "the-output-on-the-tape",
      ["The output on the tape", "纸带上的输出"],
      [
        "A Turing machine computes by rewriting its tape as it moves. To find the output, follow the transitions one symbol at a time, keeping track of what gets written in each cell.",
        "图灵机边移动边改写纸带来计算。要求输出，就一个符号一个符号地跟随转移，记下每个格子写入了什么。",
      ],
      (rng) => {
        const n = rng.int(5, 9);
        const bits = Array.from({ length: n }, () => rng.int(0, 1));
        const text = bits.join("");
        const out = bits.map((b) => 1 - b).join("");
        return chooseFilled(
          rng,
          [
            `A Turing machine starts on the first symbol of $${text}$. Its transitions are $\\delta(q_0, 0) = (q_0, 1, R)$ and $\\delta(q_0, 1) = (q_0, 0, R)$, and it halts on a blank. What is on the tape at the end?`,
            `图灵机从 $${text}$ 的第一个符号开始。转移是 $\\delta(q_0, 0) = (q_0, 1, R)$，$\\delta(q_0, 1) = (q_0, 0, R)$，遇到空白停机。最后纸带上是什么？`,
          ],
          out,
          [text, [...out].reverse().join(""), [...text].reverse().join("")],
          [`Each symbol is replaced by the other one as the head moves right.`, `读写头向右移动时，每个符号都换成另一个。`],
        );
      },
    ),
  ],
  "regular-graphs": [
    skill(
      "the-vertices-from-the-edges",
      ["The vertices from the edges", "由边数求顶点数"],
      [
        "In a regular graph every vertex has the same degree, so the handshake lemma reads $nk = 2E$. Knowing the degree and the number of edges therefore gives the number of vertices.",
        "正则图中每个顶点的度相同，所以握手定理写成 $nk = 2E$。因此知道度和边数，就能求出顶点数。",
      ],
      (rng) => {
        const k = rng.int(2, 8);
        const half = rng.int(k + 1, k + 15);
        const v = k % 2 === 0 ? half : 2 * half;
        const e = (v * k) / 2;
        return whole(
          [`A ${k}-regular graph has ${e} edges. How many vertices does it have?`, `一个 ${k}-正则图有 ${e} 条边。它有多少个顶点？`],
          v,
          [v + 2, v * k, e + 1],
          [`$n \\cdot ${k} = 2 \\cdot ${e}$, so $n = ${v}$.`, `$n \\cdot ${k} = 2 \\cdot ${e}$，所以 $n = ${v}$。`],
        );
      },
    ),
  ],
  "second-order-recurrence-relations-with-exponential-forcing": [
    skill(
      "the-sum-of-the-constants",
      ["The sum of the constants", "常数的和"],
      [
        "The solution has the form $Ar^{n} + Bs^{n} + Kt^{n}$, and at $n = 0$ all three powers equal 1. So the start value minus the particular coefficient gives $A + B$, before using the second condition.",
        "解的形式是 $Ar^{n} + Bs^{n} + Kt^{n}$，$n = 0$ 时三个幂都等于 1。所以初值减去特解系数就得到 $A + B$，这时还没有用到第二个条件。",
      ],
      (rng) => {
        const t = rng.pick([2, 3]);
        const r = rng.pick([4, 5, -2, -3]);
        const s = rng.pick([1, -1, 6].filter((v) => v !== r));
        const m = nz(rng, 3);
        const c = m * (t - r) * (t - s);
        const k = t * t * m;
        const start = rng.int(-30, 30);
        const p = r + s;
        const q = -r * s;
        return integer(
          [
            `$a_n = ${term(p, "a_{n-1}")}${q < 0 ? " - " : " + "}${Math.abs(q) === 1 ? "" : Math.abs(q)}a_{n-2}${c < 0 ? " - " : " + "}${Math.abs(c)} \\cdot ${t}^{n}$ has characteristic roots ${r} and ${s}. With $a_0 = ${start}$, its solution is $A \\cdot ${paren(r)}^{n} + B \\cdot ${paren(s)}^{n} + K \\cdot ${t}^{n}$. Find $A + B$.`,
            `$a_n = ${term(p, "a_{n-1}")}${q < 0 ? " - " : " + "}${Math.abs(q) === 1 ? "" : Math.abs(q)}a_{n-2}${c < 0 ? " - " : " + "}${Math.abs(c)} \\cdot ${t}^{n}$ 的特征根是 ${r} 和 ${s}。$a_0 = ${start}$ 时，解为 $A \\cdot ${paren(r)}^{n} + B \\cdot ${paren(s)}^{n} + K \\cdot ${t}^{n}$。求 $A + B$。`,
          ],
          start - k,
          [start + k, k, start],
          [
            `Substituting $K \\cdot ${t}^{n}$ and dividing by $${t}^{n-2}$ gives $K(${t} - ${paren(r)})(${t} - ${paren(s)}) = ${paren(c)} \\cdot ${t * t}$, so $K = ${k}$. At $n = 0$, $A + B + K = ${start}$, so $A + B = ${start - k}$.`,
            `代入 $K \\cdot ${t}^{n}$ 并除以 $${t}^{n-2}$，得 $K(${t} - ${paren(r)})(${t} - ${paren(s)}) = ${paren(c)} \\cdot ${t * t}$，所以 $K = ${k}$。当 $n = 0$ 时 $A + B + K = ${start}$，所以 $A + B = ${start - k}$。`,
          ],
        );
      },
    ),
  ],
  "second-order-recurrence-relations-with-polynomial-forcing": [
    skill(
      "a-constant-particular-solution",
      ["A constant particular solution", "常数特解"],
      [
        "A constant forcing term calls for a constant particular solution $e$, as long as 1 is not a characteristic root. Substituting gives $e = pe + qe + \\beta$, which is one linear equation.",
        "常数强迫项对应常数特解 $e$，只要 1 不是特征根。代入得 $e = pe + qe + \\beta$，这是一个一次方程。",
      ],
      (rng) => {
        const p = rng.pick([2, 3, 4, 5]);
        const q = rng.pick([2, 3, 4, 5, 6]);
        const e = nz(rng, 9);
        const beta = e * (1 - p - q);
        return integer(
          [
            `$a_n = ${p}a_{n-1} + ${q}a_{n-2}${signed(beta)}$ has a constant particular solution $a_n = e$. Find $e$.`,
            `$a_n = ${p}a_{n-1} + ${q}a_{n-2}${signed(beta)}$ 有常数特解 $a_n = e$。求 $e$。`,
          ],
          e,
          [-e, beta, e + p],
          [
            `$e = ${p + q}e${signed(beta)}$ gives $${p + q - 1}e = ${-beta}$, so $e = ${e}$.`,
            `$e = ${p + q}e${signed(beta)}$ 得 $${p + q - 1}e = ${-beta}$，所以 $e = ${e}$。`,
          ],
        );
      },
    ),
  ],
  "solving-homogeneous-recurrence-relations-using-generating-functions": [
    skill(
      "early-terms-from-the-numerator",
      ["Early terms from the numerator", "由分子得前几项"],
      [
        "In $\\frac{u + vx}{1 - px - qx^{2}}$, multiplying across gives $a_0 = u$ and $a_1 = pu + v$. So the numerator encodes the starting values, and the denominator encodes the recurrence.",
        "在 $\\frac{u + vx}{1 - px - qx^{2}}$ 中，交叉相乘得 $a_0 = u$，$a_1 = pu + v$。所以分子记录初值，分母记录递推关系。",
      ],
      (rng) => {
        const u = nz(rng, 9);
        const v = nz(rng, 9);
        const p = rng.int(1, 6);
        const q = rng.int(1, 12);
        return integer(
          [
            `$G(x) = \\frac{${u}${signed(v)}x}{1 - ${p === 1 ? "" : p}x - ${q}x^{2}}$ is the generating function of $a_0, a_1, \\dots$. Find $a_1$.`,
            `$G(x) = \\frac{${u}${signed(v)}x}{1 - ${p === 1 ? "" : p}x - ${q}x^{2}}$ 是 $a_0, a_1, \\dots$ 的生成函数。求 $a_1$。`,
          ],
          p * u + v,
          [v, u + v, q * u + v],
          [
            `$a_1 = ${p} \\cdot ${paren(u)} + ${paren(v)} = ${p * u + v}$.`,
            `$a_1 = ${p} \\cdot ${paren(u)} + ${paren(v)} = ${p * u + v}$。`,
          ],
        );
      },
    ),
  ],
  "the-chain-rule-for-total-derivatives": [
    skill(
      "the-shape-of-a-composite-jacobian",
      ["The shape of a composite Jacobian", "复合雅可比矩阵的形状"],
      [
        "A Jacobian has one row per output and one column per input. In $J_{g}J_{f}$ the sizes must match in the middle, and the result has the outputs of $g$ and the inputs of $f$.",
        "雅可比矩阵每个输出一行，每个输入一列。在 $J_{g}J_{f}$ 中，中间的尺寸必须相符，结果的行数是 $g$ 的输出数，列数是 $f$ 的输入数。",
      ],
      (rng) => {
        const [a, b, c] = rng.sample([2, 3, 4, 5, 6, 7, 8, 9, 10, 12], 3) as [number, number, number];
        return chooseFilled(
          rng,
          [
            `$\\mathbf{f}: \\mathbb{R}^{${a}} \\to \\mathbb{R}^{${b}}$ and $\\mathbf{g}: \\mathbb{R}^{${b}} \\to \\mathbb{R}^{${c}}$. What is the size of the Jacobian of $\\mathbf{g} \\circ \\mathbf{f}$?`,
            `$\\mathbf{f}: \\mathbb{R}^{${a}} \\to \\mathbb{R}^{${b}}$，$\\mathbf{g}: \\mathbb{R}^{${b}} \\to \\mathbb{R}^{${c}}$。$\\mathbf{g} \\circ \\mathbf{f}$ 的雅可比矩阵的尺寸是多少？`,
          ],
          `${c} \\times ${a}`,
          [`${a} \\times ${c}`, `${b} \\times ${a}`, `${c} \\times ${b}`],
          [
            `It has ${c} outputs and ${a} inputs, as the middle size ${b} cancels.`,
            `它有 ${c} 个输出、${a} 个输入，中间的尺寸 ${b} 消去。`,
          ],
        );
      },
    ),
  ],
  "the-connection-between-pca-and-svd": [
    skill(
      "the-singular-value-from-a-variance",
      ["The singular value from a variance", "由方差求奇异值"],
      [
        "The eigenvalues of the covariance matrix and the singular values of the centered data satisfy $\\lambda = \\frac{\\sigma^{2}}{n - 1}$. So a variance and the number of rows give the singular value by working backward.",
        "协方差矩阵的特征值与中心化数据的奇异值满足 $\\lambda = \\frac{\\sigma^{2}}{n - 1}$。所以由方差和行数可以反推出奇异值。",
      ],
      (rng) => {
        const m = rng.int(2, 10);
        const k = rng.int(1, 12);
        const n = m * m + 1;
        return whole(
          [
            `A centered data matrix has ${n} rows, and a principal component has variance ${k * k}. What is the matching singular value?`,
            `中心化数据矩阵有 ${n} 行，某个主成分的方差是 ${k * k}。对应的奇异值是多少？`,
          ],
          k * m,
          [k, k * k * m * m, k * k * m],
          [
            `$\\sigma^{2} = ${k * k} \\cdot ${n - 1} = ${k * k * m * m}$, so $\\sigma = ${k * m}$.`,
            `$\\sigma^{2} = ${k * k} \\cdot ${n - 1} = ${k * k * m * m}$，所以 $\\sigma = ${k * m}$。`,
          ],
        );
      },
    ),
  ],
  "the-degree-of-a-vertex": [
    skill(
      "the-missing-degree",
      ["The missing degree", "缺失的度"],
      [
        "Every edge has two ends, so the degrees of a graph add up to twice the number of edges. This is the handshake lemma, and it finds one missing degree when the others are known.",
        "每条边有两个端点，所以图的度数之和是边数的两倍。这就是握手定理，已知其他度时可以求出缺失的度。",
      ],
      (rng) => {
        const n = rng.int(5, 8);
        const degrees = Array.from({ length: n }, () => 0);
        let edges = 0;
        for (let i = 0; i < n; i++) {
          for (let j = i + 1; j < n; j++) {
            if (rng.bool()) {
              degrees[i] = (degrees[i] as number) + 1;
              degrees[j] = (degrees[j] as number) + 1;
              edges++;
            }
          }
        }
        const hidden = rng.int(0, n - 1);
        const answer = degrees[hidden] as number;
        const others = degrees.filter((_, i) => i !== hidden);
        return whole(
          [
            `A simple graph has ${edges} edges and ${n} vertices. ${n - 1} of the vertices have degrees $${others.join(", ")}$. What is the degree of the last vertex?`,
            `简单图有 ${edges} 条边、${n} 个顶点。其中 ${n - 1} 个顶点的度是 $${others.join(", ")}$。最后一个顶点的度是多少？`,
          ],
          answer,
          [answer + 2, answer + 1, edges],
          [
            `The degrees add up to ${2 * edges}, and the others add up to ${2 * edges - answer}.`,
            `度数之和是 ${2 * edges}，其他顶点的度数之和是 ${2 * edges - answer}。`,
          ],
        );
      },
    ),
  ],
  "the-hadamard-product": [
    skill(
      "the-hadamard-product-with-the-identity",
      ["The Hadamard product with the identity", "与单位矩阵的阿达马积"],
      [
        "The identity matrix is not the neutral element of the entrywise product, since its zeros erase every off-diagonal entry. So $A \\odot I$ keeps only the diagonal of $A$, and its entries add up to the trace.",
        "单位矩阵不是逐元素乘积的中性元，因为它的零消去了所有非对角元素。所以 $A \\odot I$ 只保留 $A$ 的对角线，其元素之和等于迹。",
      ],
      (rng) => {
        const a = [nz(rng, 9), nz(rng, 9), nz(rng, 9)];
        const off = [nz(rng, 9), nz(rng, 9), nz(rng, 9), nz(rng, 9), nz(rng, 9), nz(rng, 9)];
        const matrix = mat([
          [a[0] as number, off[0] as number, off[1] as number],
          [off[2] as number, a[1] as number, off[3] as number],
          [off[4] as number, off[5] as number, a[2] as number],
        ]);
        const trace = a.reduce((x, y) => x + y, 0);
        const all = trace + off.reduce((x, y) => x + y, 0);
        return integer(
          [`Let $A = ${matrix}$. Find the sum of the entries of $A \\odot I$.`, `设 $A = ${matrix}$。求 $A \\odot I$ 所有元素的和。`],
          trace,
          [all, 3, trace + 1],
          [`Only the diagonal survives, and it adds up to ${trace}.`, `只有对角线保留下来，其和是 ${trace}。`],
        );
      },
    ),
  ],
  "total-and-tensor-derivatives": [
    skill(
      "the-number-of-partial-derivatives",
      ["The number of partial derivatives", "偏导数的个数"],
      [
        "The derivative of a map between arrays holds one partial derivative for each pair of an output entry and an input entry. So its number of entries is the product of the two sizes, which is why it is a tensor.",
        "数组之间映射的导数，对每一对输出元素和输入元素都有一个偏导数。所以它的元素个数是两个大小的积，这就是它是张量的原因。",
      ],
      (rng) => {
        const m = rng.int(2, 8);
        const n = rng.int(2, 8);
        const p = rng.int(2, 9);
        return whole(
          [
            `A map takes a matrix of size $${m} \\times ${n}$ to a vector in $\\mathbb{R}^{${p}}$. How many entries does its derivative have?`,
            `一个映射把 $${m} \\times ${n}$ 矩阵变成 $\\mathbb{R}^{${p}}$ 中的向量。它的导数有多少个元素？`,
          ],
          m * n * p,
          [m * n, m + n + p, n * p],
          [
            `Each of the ${p} outputs has a partial derivative for each of the ${m * n} inputs, so there are $${p} \\cdot ${m * n} = ${m * n * p}$ entries.`,
            `${p} 个输出中，每个对 ${m * n} 个输入各有一个偏导数，所以共有 $${p} \\cdot ${m * n} = ${m * n * p}$ 个元素。`,
          ],
        );
      },
    ),
  ],
  "vector-gradients": [
    skill(
      "the-gradient-of-a-regularized-objective",
      ["The gradient of a regularized objective", "正则化目标的梯度"],
      [
        "Gradients add across a sum, so each part can be handled alone. The linear term $\\mathbf{a}^{T}\\mathbf{x}$ contributes $\\mathbf{a}$, and the penalty $k\\mathbf{x}^{T}\\mathbf{x}$ contributes $2k\\mathbf{x}$.",
        "和的梯度等于梯度的和，所以每部分可以单独处理。线性项 $\\mathbf{a}^{T}\\mathbf{x}$ 贡献 $\\mathbf{a}$，惩罚项 $k\\mathbf{x}^{T}\\mathbf{x}$ 贡献 $2k\\mathbf{x}$。",
      ],
      (rng) => {
        const a = [nz(rng, 9), nz(rng, 9)] as const;
        const x = [nz(rng, 6), nz(rng, 6)] as const;
        const k = rng.int(2, 5);
        return chooseFilled(
          rng,
          [
            `Let $f(\\mathbf{x}) = \\mathbf{a}^{T}\\mathbf{x} + ${k}\\mathbf{x}^{T}\\mathbf{x}$ with $\\mathbf{a} = ${vec(...a)}$. Find $\\nabla f$ at $\\mathbf{x} = ${vec(...x)}$.`,
            `设 $f(\\mathbf{x}) = \\mathbf{a}^{T}\\mathbf{x} + ${k}\\mathbf{x}^{T}\\mathbf{x}$，$\\mathbf{a} = ${vec(...a)}$。求 $\\mathbf{x} = ${vec(...x)}$ 处的 $\\nabla f$。`,
          ],
          vec(a[0] + 2 * k * x[0], a[1] + 2 * k * x[1]),
          [vec(a[0] + k * x[0], a[1] + k * x[1]), vec(2 * k * x[0], 2 * k * x[1]), vec(a[0] - 2 * k * x[0], a[1] - 2 * k * x[1])],
          [
            `The gradient is $\\mathbf{a} + ${2 * k}\\mathbf{x}$, whose components are $${a[0]} + ${2 * k}(${x[0]}) = ${a[0] + 2 * k * x[0]}$ and $${a[1]} + ${2 * k}(${x[1]}) = ${a[1] + 2 * k * x[1]}$.`,
            `梯度是 $\\mathbf{a} + ${2 * k}\\mathbf{x}$，其分量为 $${a[0]} + ${2 * k}(${x[0]}) = ${a[0] + 2 * k * x[0]}$ 和 $${a[1]} + ${2 * k}(${x[1]}) = ${a[1] + 2 * k * x[1]}$。`,
          ],
        );
      },
    ),
  ],
  "walks-paths-and-distances-in-directed-graphs": [
    skill(
      "walks-of-length-three-from-a-matrix",
      ["Walks of length three from a matrix", "由矩阵求长度为 3 的路线"],
      [
        "Entry $(i, j)$ of the $k$th power of an adjacency matrix counts the walks of length $k$ from $i$ to $j$. So walks of length three come from multiplying the matrix by itself twice.",
        "邻接矩阵 $k$ 次幂的 $(i, j)$ 元素，就是从 $i$ 到 $j$ 长度为 $k$ 的路线数。所以长度为 3 的路线数由矩阵自乘两次得到。",
      ],
      (rng) => {
        const mul = (x: number[][], y: number[][]) =>
          x.map((row) => [0, 1, 2].map((j) => row.reduce((s, v, k) => s + v * ((y[k] as number[])[j] as number), 0)));
        let m: number[][];
        let i: number;
        let j: number;
        let answer: number;
        do {
          m = [0, 1, 2].map(() => [0, 1, 2].map(() => rng.int(0, 1)));
          i = rng.int(0, 2);
          j = rng.int(0, 2);
          answer = (mul(mul(m, m), m)[i] as number[])[j] as number;
        } while (answer === 0 || m.some((row) => row.every((v) => v === 0)));
        const squared = mul(m, m);
        const square = (squared[i] as number[])[j] as number;
        const rowOfSquare = squared[i] as number[];
        const column = m.map((row) => row[j] as number);
        const names = ["A", "B", "C"];
        return whole(
          [
            `A directed graph on $A, B, C$ has adjacency matrix $${mat(m)}$. How many walks of length 3 go from $${names[i]}$ to $${names[j]}$?`,
            `顶点为 $A, B, C$ 的有向图的邻接矩阵是 $${mat(m)}$。从 $${names[i]}$ 到 $${names[j]}$ 长度为 3 的路线有多少条？`,
          ],
          answer,
          [
            square === answer ? answer + 1 : square,
            answer + 2,
            (m[i] as number[])[j] === answer ? answer + 3 : ((m[i] as number[])[j] as number),
          ],
          [
            `Row $${names[i]}$ of the matrix squared is $(${rowOfSquare.join(", ")})$. Multiply it by column $${names[j]}$ of the matrix, $(${column.join(", ")})$: $${rowOfSquare.map((v, k) => `${v} \\cdot ${column[k]}`).join(" + ")} = ${answer}$.`,
            `矩阵平方的 $${names[i]}$ 行是 $(${rowOfSquare.join(", ")})$。乘以矩阵的 $${names[j]}$ 列 $(${column.join(", ")})$：$${rowOfSquare.map((v, k) => `${v} \\cdot ${column[k]}`).join(" + ")} = ${answer}$。`,
          ],
        );
      },
    ),
  ],
  "working-with-the-generalized-binomial-theorem": [
    skill(
      "a-first-order-approximation",
      ["A first-order approximation", "一阶近似"],
      [
        "For small $x$, $(1 + x)^{r}$ is close to $1 + rx$, whatever the real power $r$ is. This gives quick estimates of roots and reciprocals by keeping the first two terms of the expansion.",
        "$x$ 很小时，不管实数 $r$ 是多少，$(1 + x)^{r}$ 都接近 $1 + rx$。所以保留展开式的前两项，就能快速估计根和倒数。",
      ],
      (rng) => {
        const row = rng.pick<[string, number, number]>([
          ["\\frac{1}{2}", 1, 2],
          ["-\\frac{1}{2}", -1, 2],
          ["\\frac{1}{4}", 1, 4],
          ["-1", -1, 1],
          ["-2", -2, 1],
          ["3", 3, 1],
          ["-\\frac{1}{4}", -1, 4],
          ["\\frac{5}{2}", 5, 2],
        ]);
        const k = rng.int(1, 9) * (rng.bool() ? 1 : -1);
        const x = Q.of(k, 100);
        const answer = Q.of(1).add(Q.of(row[1], row[2]).mul(x));
        const shown = ((100 + k) / 100).toFixed(2);
        return decimal(
          [
            `Use the first two terms of the binomial expansion to approximate $${shown}^{${row[0]}}$.`,
            `用二项展开式的前两项近似 $${shown}^{${row[0]}}$。`,
          ],
          answer,
          [Q.of(1).add(x), Q.of(1).add(Q.of(-row[1], row[2]).mul(x)), Q.of(row[1], row[2]).mul(x)],
          [
            `With $x = ${(k / 100).toFixed(2)}$ and $r = ${row[0]}$, the estimate is $1 + rx = 1 + ${row[1] < 0 ? `\\left(${row[0]}\\right)` : row[0]} \\cdot ${k < 0 ? `(${(k / 100).toFixed(2)})` : (k / 100).toFixed(2)} = ${dec(answer)}$.`,
            `$x = ${(k / 100).toFixed(2)}$，$r = ${row[0]}$，估计值是 $1 + rx = 1 + ${row[1] < 0 ? `\\left(${row[0]}\\right)` : row[0]} \\cdot ${k < 0 ? `(${(k / 100).toFixed(2)})` : (k / 100).toFixed(2)} = ${dec(answer)}$。`,
          ],
        );
      },
    ),
  ],
};
