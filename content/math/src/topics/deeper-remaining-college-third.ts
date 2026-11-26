// A third knowledge point for the discrete mathematics and machine learning topics that still had two.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";
import { discreteDrawings2 } from "../explanation-drawings-discrete-mathematics-2.ts";

import { numberProblem, why } from "../problems.ts";
import { walked } from "./calculus-i-differentiation.ts";
import { whole } from "./early-grades-more-kit.ts";
import { chooseFilled, frac, fraction, integer, signed, skill } from "./third-kit.ts";

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
    {
      ...skill(
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
      figure: discreteDrawings2["applying-prims-algorithm-to-a-distance-matrix#the-first-edge-from-a-given-start"],
    },
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
        "The expansion of $(1 + u)^{r}$ needs $|u| < 1$, whatever $u$ stands for. So with $u = m^{2}x^{2}$ the condition becomes $|mx| < 1$, and the square root changes the answer compared with a plain $x$. For $(1 + 225x^{2})^{-1}$, $225x^{2} < 1$ means $x^{2} < \\frac{1}{225}$, that is, $|x| < \\frac{1}{15}$.\n\n> **Watch out.** The question asks about $|x|$, so take the square root of the bound on $x^{2}$; halving it, or stopping at $\\frac{1}{m^{2}}$, gives the wrong range.",
        "$(1 + u)^{r}$ 的展开要求 $|u| < 1$，不管 $u$ 代表什么。所以 $u = m^{2}x^{2}$ 时条件变成 $|mx| < 1$，与单独的 $x$ 相比，开平方改变了结果。对 $(1 + 225x^{2})^{-1}$，$225x^{2} < 1$ 即 $x^{2} < \\frac{1}{225}$，也就是 $|x| < \\frac{1}{15}$。\n\n> **注意。** 题目问的是 $|x|$，所以要对 $x^{2}$ 的界开平方；把它减半，或停在 $\\frac{1}{m^{2}}$，都会得到错误的范围。",
      ],
      (rng) => {
        const m = rng.int(2, 12);
        const sign = rng.bool() ? "+" : "-";
        const r = rng.pick(["-1", "-2", "-3", "\\frac{1}{2}", "-\\frac{1}{2}", "\\frac{1}{3}"]);
        const answer = Q.of(1, m);
        return numberProblem({
          prompt: t(
            `The expansion of $(1 ${sign} ${m * m}x^{2})^{${r}}$ in powers of $x$ is valid for $|x| < c$. Find $c$.`,
            `$(1 ${sign} ${m * m}x^{2})^{${r}}$ 按 $x$ 的幂展开，在 $|x| < c$ 时有效。求 $c$。`,
          ),
          answer,
          mistakes: [
            why(
              Q.of(1, m * m),
              "That is the bound on $x^{2}$; take its square root to bound $|x|$.",
              "那是 $x^{2}$ 的界；要开平方才得到 $|x|$ 的界。",
            ),
            why(Q.of(m), "That inverts the bound; solve the inequality for $|x|$.", "那是把界颠倒了；应对 $|x|$ 解不等式。"),
            why(Q.of(1, 2 * m), "That halves instead of taking the square root.", "那是减半，而不是开平方。"),
          ],
          solution: walked(
            [
              [
                ["Require the small quantity below 1", "要求小量小于 1"],
                t(`$${m * m}x^{2} < 1$, so $x^{2} < ${frac(1, m * m)}$.`, `$${m * m}x^{2} < 1$，所以 $x^{2} < ${frac(1, m * m)}$。`),
              ],
              [["Take the square root", "开平方"], t(`$|x| < ${frac(1, m)}$.`, `$|x| < ${frac(1, m)}$。`)],
            ],
            t(
              `At $|x| = ${frac(1, m)}$, $${m * m}x^{2} = ${m * m} \\cdot ${frac(1, m * m)} = 1$, exactly the edge where the expansion stops converging.`,
              `在 $|x| = ${frac(1, m)}$ 处，$${m * m}x^{2} = ${m * m} \\cdot ${frac(1, m * m)} = 1$，正是展开式停止收敛的边界。`,
            ),
          ),
        });
      },
    ),
  ],
  "determining-the-general-term-of-a-sequence-from-its-generating-function": [
    skill(
      "the-growth-from-the-denominator",
      ["The growth from the denominator", "由分母看增长"],
      [
        "A factor $1 - rx$ in the denominator contributes a term with $r^{n}$ to the sequence. For large $n$ the root with the largest size dominates, so the ratio of neighboring terms approaches it. For $G(x) = \\frac{4}{(1 - 15x)(1 + 3x)}$, $a_n = A \\cdot 15^{n} + B(-3)^{n}$ with $A \\ne 0$, and $15^{n}$ soon swamps $(-3)^{n}$, so $\\frac{a_{n+1}}{a_n}$ approaches $15$.\n\n> **Watch out.** The base comes from the factor, not from the numerator: $1 - rx$ gives $r^{n}$. The ratio tends to the root of largest size alone, not to the sum of the roots.",
        "分母中的因式 $1 - rx$ 给数列贡献一个 $r^{n}$ 项。$n$ 很大时，绝对值最大的那个起主导作用，所以相邻两项的比趋近于它。对 $G(x) = \\frac{4}{(1 - 15x)(1 + 3x)}$，$a_n = A \\cdot 15^{n} + B(-3)^{n}$，$A \\ne 0$，而 $15^{n}$ 很快压倒 $(-3)^{n}$，所以 $\\frac{a_{n+1}}{a_n}$ 趋近于 $15$。\n\n> **注意。** 底数来自因式，不是来自分子：$1 - rx$ 给出 $r^{n}$。比值只趋近于绝对值最大的根，而不是两根之和。",
      ],
      (rng) => {
        const r = rng.int(2, 12);
        const s = rng.int(1, r - 1) * (rng.bool() ? 1 : -1);
        const top = rng.int(1, 9);
        const inner = s < 0 ? `(1 + ${s === -1 ? "" : -s}x)` : `(1 - ${s === 1 ? "" : s}x)`;
        const share = Q.of(top, r - s);
        const lead = share.eq(Q.of(1)) ? "" : share.toLatex();
        const ratio = Q.of(s, r).toLatex();
        return numberProblem({
          prompt: t(
            `$G(x) = \\frac{${top}}{(1 - ${r}x)${inner}}$ generates $a_0, a_1, a_2, \\dots$. What does $\\frac{a_{n+1}}{a_n}$ approach for large $n$?`,
            `$G(x) = \\frac{${top}}{(1 - ${r}x)${inner}}$ 生成 $a_0, a_1, a_2, \\dots$。$n$ 很大时 $\\frac{a_{n+1}}{a_n}$ 趋近于多少？`,
          ),
          answer: r,
          form: "integer",
          mistakes: [
            why(
              Math.abs(s),
              "That is the size of the other root, whose term grows more slowly.",
              "那是另一个根的绝对值，它对应的项增长较慢。",
            ),
            why(
              r + Math.abs(s),
              "That adds the roots; the larger one alone sets the growth.",
              "那是把两个根相加了；只有较大的根决定增长。",
            ),
            why(top, "That is the numerator, which only scales the terms.", "那是分子，它只是把各项放大。"),
            why(r + s, "That is the sum of the roots; the larger one alone sets the growth.", "那是两根之和；只有较大的根决定增长。"),
          ].filter((m, i, all) => m.value !== r && all.findIndex((o) => o.value === m.value) === i),
          solution: walked(
            [
              [
                ["Read the roots from the factors", "由因式读出根"],
                t(
                  `$(1 - ${r}x)${inner}$ gives terms in $${r}^{n}$ and $${paren(s)}^{n}$, so $a_n = A \\cdot ${r}^{n} + B \\cdot ${paren(s)}^{n}$ with $A \\ne 0$.`,
                  `$(1 - ${r}x)${inner}$ 给出 $${r}^{n}$ 和 $${paren(s)}^{n}$ 的项，所以 $a_n = A \\cdot ${r}^{n} + B \\cdot ${paren(s)}^{n}$，$A \\ne 0$。`,
                ),
              ],
              [
                ["Compare the sizes", "比较大小"],
                t(
                  `$|${s}| < ${r}$, so for large $n$ the first term dominates and $\\frac{a_{n+1}}{a_n}$ approaches $${r}$.`,
                  `$|${s}| < ${r}$，所以 $n$ 很大时第一项占主导，$\\frac{a_{n+1}}{a_n}$ 趋近于 $${r}$。`,
                ),
              ],
            ],
            t(
              `Partial fractions give $a_n = ${lead}(${r}^{n+1} - ${paren(s)}^{n+1})$, so $\\frac{a_{n+1}}{a_n} = ${r} \\cdot \\frac{1 - (${ratio})^{n+2}}{1 - (${ratio})^{n+1}}$, which tends to $${r}$ because $|${ratio}| < 1$.`,
              `由部分分式得 $a_n = ${lead}(${r}^{n+1} - ${paren(s)}^{n+1})$，所以 $\\frac{a_{n+1}}{a_n} = ${r} \\cdot \\frac{1 - (${ratio})^{n+2}}{1 - (${ratio})^{n+1}}$，因为 $|${ratio}| < 1$，它趋近于 $${r}$。`,
            ),
          ),
        });
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
        "A sum that does not start at 1 is a difference of two sums that do. So subtract the sum up to just below the lower bound, using the formula that the cubes add up to a triangular number squared. For $\\sum_{k=11}^{20} k^3$, the triangular numbers are $210$ and $55$, so the sum is $210^2 - 55^2 = 44100 - 3025 = 41075$.\n\n> **Watch out.** Subtract the sum up to $m - 1$, not up to $m$; and square each triangular number before subtracting, since $(210 - 55)^2$ is not the answer.",
        "不从 1 开始的和，是两个从 1 开始的和之差。所以减去到下界前一项为止的和，公式是立方和等于三角形数的平方。对 $\\sum_{k=11}^{20} k^3$，三角形数是 $210$ 和 $55$，所以和为 $210^2 - 55^2 = 44100 - 3025 = 41075$。\n\n> **注意。** 要减去到 $m - 1$ 的和，而不是到 $m$ 的；要先把每个三角形数平方再相减，因为 $(210 - 55)^2$ 不是答案。",
      ],
      (rng) => {
        const m = rng.int(2, 8);
        const n = m + rng.int(2, 8);
        const upper = (n * (n + 1)) / 2;
        const lower = ((m - 1) * m) / 2;
        const answer = upper * upper - lower * lower;
        const atM = (m * (m + 1)) / 2;
        return numberProblem({
          prompt: t(`Evaluate $\\sum_{k=${m}}^{${n}} k^{3}$.`, `计算 $\\sum_{k=${m}}^{${n}} k^{3}$。`),
          answer,
          form: "integer",
          mistakes: [
            why(
              upper * upper,
              "That is the whole sum from $k = 1$; subtract the cubes below the lower bound.",
              "那是从 $k = 1$ 开始的全部和；还要减去下界以下的立方。",
            ),
            why(
              upper * upper - atM * atM,
              `That subtracts the cubes up to $${m}$, which removes $${m}^3$ as well.`,
              `那是减去了到 $${m}$ 的立方和，把 $${m}^3$ 也去掉了。`,
            ),
            why(
              (upper - lower) ** 2,
              "That subtracts the triangular numbers before squaring; square each one first.",
              "那是先把三角形数相减再平方；应先分别平方。",
            ),
          ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
          solution: walked(
            [
              [
                ["Find the triangular numbers", "求三角形数"],
                m === 2
                  ? t(
                      `$\\frac{${n} \\cdot ${n + 1}}{2} = ${upper}$, and below the bound there is only $k = 1$, whose triangular number is $1$.`,
                      `$\\frac{${n} \\cdot ${n + 1}}{2} = ${upper}$，下界以下只有 $k = 1$，其三角形数是 $1$。`,
                    )
                  : t(
                      `$\\frac{${n} \\cdot ${n + 1}}{2} = ${upper}$ and $\\frac{${m - 1} \\cdot ${m}}{2} = ${lower}$.`,
                      `$\\frac{${n} \\cdot ${n + 1}}{2} = ${upper}$，$\\frac{${m - 1} \\cdot ${m}}{2} = ${lower}$。`,
                    ),
              ],
              [
                ["Subtract their squares", "平方相减"],
                t(
                  `$${upper}^{2} - ${lower}^{2} = ${upper * upper} - ${lower * lower} = ${answer}$.`,
                  `$${upper}^{2} - ${lower}^{2} = ${upper * upper} - ${lower * lower} = ${answer}$。`,
                ),
              ],
            ],
            t(
              `As a difference of squares, $(${upper} - ${lower})(${upper} + ${lower}) = ${upper - lower} \\cdot ${upper + lower} = ${answer}$.`,
              `用平方差公式，$(${upper} - ${lower})(${upper} + ${lower}) = ${upper - lower} \\cdot ${upper + lower} = ${answer}$。`,
            ),
          ),
        });
      },
    ),
  ],
  "first-order-recurrence-relations-with-exponential-forcing": [
    skill(
      "the-constant-from-the-start",
      ["The constant from the start", "由初值求常数"],
      [
        "The general solution adds a multiple of $r^{n}$ to the particular solution. The starting value then fixes that multiple, because at $n = 0$ both powers equal 1. For $a_n = 5a_{n-1} + 2 \\cdot 7^{n}$ with $a_0 = 10$, $7K = 5K + 14$ gives $K = 7$, and $A + 7 = 10$ gives $A = 3$, so $a_n = 3 \\cdot 5^{n} + 7 \\cdot 7^{n}$.\n\n> **Watch out.** At $n = 0$ the starting value is $A + K$, not $A$: subtract $K$ from $a_0$. Find $K$ first, and remember that dividing by $s^{n-1}$ turns the forcing $c \\cdot s^{n}$ into $cs$.",
        "通解是在特解上加 $r^{n}$ 的倍数。初值决定这个倍数，因为 $n = 0$ 时两个幂都等于 1。对 $a_n = 5a_{n-1} + 2 \\cdot 7^{n}$，$a_0 = 10$，由 $7K = 5K + 14$ 得 $K = 7$，由 $A + 7 = 10$ 得 $A = 3$，所以 $a_n = 3 \\cdot 5^{n} + 7 \\cdot 7^{n}$。\n\n> **注意。** $n = 0$ 时初值是 $A + K$，不是 $A$：要从 $a_0$ 中减去 $K$。先求 $K$，并记住除以 $s^{n-1}$ 后强迫项 $c \\cdot s^{n}$ 变成 $cs$。",
      ],
      (rng) => {
        const r = rng.pick([-3, -2, 2, 3, 4]);
        const s = rng.pick([2, 3, 4, 5].filter((v) => v !== r));
        const m = nz(rng, 4);
        const c = m * (s - r);
        const k = s * m;
        const start = rng.int(-20, 20);
        const A = start - k;
        const both = (x: number, y: number) => (x === 0 || y === 0 ? `${x + y}` : `${x}${signed(y)} = ${x + y}`);
        return numberProblem({
          prompt: t(
            `$a_n = ${r}a_{n-1}${c < 0 ? " - " : " + "}${Math.abs(c) === 1 ? "" : `${Math.abs(c)} \\cdot `}${s}^{n}$ with $a_0 = ${start}$ has the solution $a_n = A \\cdot ${paren(r)}^{n} + K \\cdot ${s}^{n}$. Find $A$.`,
            `$a_n = ${r}a_{n-1}${c < 0 ? " - " : " + "}${Math.abs(c) === 1 ? "" : `${Math.abs(c)} \\cdot `}${s}^{n}$，$a_0 = ${start}$，解为 $a_n = A \\cdot ${paren(r)}^{n} + K \\cdot ${s}^{n}$。求 $A$。`,
          ),
          answer: A,
          form: "integer",
          mistakes: [
            why(k, "That is $K$, the coefficient of the particular solution.", "那是特解的系数 $K$。"),
            why(
              start + k,
              "That adds $K$ to $a_0$; at $n = 0$, $A + K = a_0$, so subtract it.",
              "那是把 $K$ 加到 $a_0$ 上；$n = 0$ 时 $A + K = a_0$，应减去它。",
            ),
            why(start, "That is $a_0$ itself, which is $A + K$.", "那是 $a_0$ 本身，它等于 $A + K$。"),
            why(
              start - m,
              "That takes $K = \\frac{c}{s - r}$; dividing by $s^{n-1}$ turns the forcing into $cs$, so $K = \\frac{cs}{s - r}$.",
              "那是取了 $K = \\frac{c}{s - r}$；除以 $s^{n-1}$ 后强迫项变成 $cs$，所以 $K = \\frac{cs}{s - r}$。",
            ),
          ].filter((x, i, all) => x.value !== A && all.findIndex((o) => o.value === x.value) === i),
          solution: walked(
            [
              [
                ["Find $K$", "求 $K$"],
                t(
                  `Substituting $K \\cdot ${s}^{n}$ and dividing by $${s}^{n-1}$: $${s}K = ${r}K${signed(c * s)}$, so $${term(s - r, "K")} = ${c * s}$ and $K = ${k}$.`,
                  `代入 $K \\cdot ${s}^{n}$ 并除以 $${s}^{n-1}$：$${s}K = ${r}K${signed(c * s)}$，所以 $${term(s - r, "K")} = ${c * s}$，$K = ${k}$。`,
                ),
              ],
              [
                ["Use the starting value", "利用初值"],
                t(
                  `At $n = 0$ both powers are $1$, so $A${signed(k)} = ${start}$ and $A = ${start} - ${paren(k)} = ${A}$.`,
                  `$n = 0$ 时两个幂都是 $1$，所以 $A${signed(k)} = ${start}$，$A = ${start} - ${paren(k)} = ${A}$。`,
                ),
              ],
            ],
            t(
              `The rule gives $a_1 = ${both(r * start, c * s)}$, and the formula gives $${both(A * r, k * s)}$.`,
              `由递推得 $a_1 = ${both(r * start, c * s)}$，由公式得 $${both(A * r, k * s)}$。`,
            ),
          ),
        });
      },
    ),
  ],
  "first-order-recurrence-relations-with-polynomial-forcing": [
    skill(
      "the-constant-after-polynomial-forcing",
      ["The constant after polynomial forcing", "多项式强迫项的常数"],
      [
        "After finding the particular solution $cn + e$, add the homogeneous part $A \\cdot r^{n}$. At $n = 0$ the linear part leaves only $e$, so the starting value gives $A$ at once. For $a_n = 5a_{n-1} - 8n + 6$ with the particular solution $2n + 1$ and $a_0 = 4$, $A + 1 = 4$ gives $A = 3$, so $a_n = 3 \\cdot 5^{n} + 2n + 1$.\n\n> **Watch out.** At $n = 0$ the term $cn$ vanishes but $e$ does not, so $A = a_0 - e$. Do not subtract $c$, and do not add $e$.",
        "求出特解 $cn + e$ 后，加上齐次部分 $A \\cdot r^{n}$。$n = 0$ 时线性部分只剩 $e$，所以由初值立刻得到 $A$。对 $a_n = 5a_{n-1} - 8n + 6$，特解为 $2n + 1$，$a_0 = 4$，由 $A + 1 = 4$ 得 $A = 3$，所以 $a_n = 3 \\cdot 5^{n} + 2n + 1$。\n\n> **注意。** $n = 0$ 时 $cn$ 项为零，但 $e$ 不为零，所以 $A = a_0 - e$。不要减去 $c$，也不要加上 $e$。",
      ],
      (rng) => {
        const r = rng.pick([-3, -2, 2, 3, 4]);
        const c = nz(rng, 5);
        const e = nz(rng, 9);
        const alpha = c * (1 - r);
        const beta = e - r * e + r * c;
        const start = rng.int(-20, 20);
        const A = start - e;
        const both = (x: number, y: number) => (x === 0 || y === 0 ? `${x + y}` : `${x}${signed(y)} = ${x + y}`);
        const general = `A \\cdot ${paren(r)}^{n} ${c < 0 ? "-" : "+"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}n${signed(e)}`;
        return numberProblem({
          prompt: t(
            `$a_n = ${r}a_{n-1}${alpha < 0 ? " - " : " + "}${Math.abs(alpha) === 1 ? "" : Math.abs(alpha)}n${signed(beta)}$ with $a_0 = ${start}$ has the particular solution $${term(c, "n")}${signed(e)}$. Write $a_n = ${general}$ and find $A$.`,
            `$a_n = ${r}a_{n-1}${alpha < 0 ? " - " : " + "}${Math.abs(alpha) === 1 ? "" : Math.abs(alpha)}n${signed(beta)}$，$a_0 = ${start}$，特解是 $${term(c, "n")}${signed(e)}$。写成 $a_n = ${general}$，求 $A$。`,
          ),
          answer: A,
          form: "integer",
          mistakes: [
            why(
              start + e,
              "That adds $e$; at $n = 0$, $A + e = a_0$, so subtract it.",
              "那是加上了 $e$；$n = 0$ 时 $A + e = a_0$，应减去它。",
            ),
            why(e, "That is $e$, the constant of the particular solution.", "那是特解的常数 $e$。"),
            why(start - c, "That subtracts $c$, but $cn$ is zero at $n = 0$.", "那是减去了 $c$，但 $n = 0$ 时 $cn$ 为零。"),
            why(
              start,
              "That is $a_0$ itself; the particular solution still contributes $e$ at $n = 0$.",
              "那是 $a_0$ 本身；$n = 0$ 时特解仍贡献 $e$。",
            ),
          ].filter((x, i, all) => x.value !== A && all.findIndex((o) => o.value === x.value) === i),
          solution: walked(
            [
              [
                ["Put $n = 0$", "代入 $n = 0$"],
                t(
                  `$${paren(r)}^{0} = 1$ and the term $${term(c, "n")}$ vanishes, so $a_0 = A${signed(e)}$.`,
                  `$${paren(r)}^{0} = 1$，而 $${term(c, "n")}$ 这一项为零，所以 $a_0 = A${signed(e)}$。`,
                ),
              ],
              [
                ["Solve for $A$", "解出 $A$"],
                t(
                  `$A${signed(e)} = ${start}$, so $A = ${start} - ${paren(e)} = ${A}$.`,
                  `$A${signed(e)} = ${start}$，所以 $A = ${start} - ${paren(e)} = ${A}$。`,
                ),
              ],
            ],
            t(
              `The rule gives $a_1 = ${both(r * start, alpha + beta)}$, and the formula gives $${both(A * r, c + e)}$.`,
              `由递推得 $a_1 = ${both(r * start, alpha + beta)}$，由公式得 $${both(A * r, c + e)}$。`,
            ),
          ),
        });
      },
    ),
  ],
  "functionally-complete-sets": [
    skill(
      "counting-the-true-rows",
      ["Counting the true rows", "数真值行"],
      [
        "Each extra variable doubles the rows of a truth table, and it does not change the value of a connective that ignores it. So count the true cases for the two variables used, and multiply by the doubling. With $9$ variables, $p \\vee q$ is true in $3$ of the $4$ cases for $p$ and $q$, each repeated in $2^{7} = 128$ rows: $3 \\cdot 128 = 384$ rows.\n\n> **Watch out.** Count the rows of the whole table, not just the four cases of $p$ and $q$; each case appears once for every setting of the other variables.",
        "每多一个变量，真值表的行数翻倍，而不用这个变量的联结词的值不变。所以先数用到的两个变量的真值情况，再乘翻倍的倍数。$9$ 个变量时，$p \\vee q$ 在 $p$、$q$ 的 $4$ 种情况中有 $3$ 种为真，每种在 $2^{7} = 128$ 行中重复：共 $3 \\cdot 128 = 384$ 行。\n\n> **注意。** 要数整个真值表的行，而不只是 $p$、$q$ 的四种情况；其他变量的每种取值都使每种情况出现一次。",
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
        const each = 2 ** (n - 2);
        const count = row[1] * each;
        const falseRows = (4 - row[1]) * each;
        const eachText = n === 2 ? "1" : n === 3 ? "2" : `2^{${n - 2}} = ${each}`;
        const times = (a: number) => (a === 1 || each === 1 ? `${a * each}` : `${a} \\cdot ${each} = ${a * each}`);
        return numberProblem({
          prompt: t(
            `A truth table has $${n}$ variables, including $p$ and $q$. In how many of its rows is $p ${row[0]} q$ true?`,
            `真值表有 $${n}$ 个变量，其中包括 $p$ 和 $q$。$p ${row[0]} q$ 在多少行中为真？`,
          ),
          answer: count,
          form: "integer",
          mistakes: [
            why(
              row[1],
              "That counts the cases of $p$ and $q$ alone, ignoring the other variables.",
              "那是只数了 $p$、$q$ 的情况，忽略了其他变量。",
            ),
            why(2 ** n, "That counts every row of the table.", "那是整个真值表的行数。"),
            why(falseRows, `That counts the rows where $p ${row[0]} q$ is false.`, `那是 $p ${row[0]} q$ 为假的行数。`),
            why(
              row[1] * (n - 2),
              `That multiplies by the number of other variables, $${n - 2}$, instead of the $${each}$ ways to set them.`,
              `那是乘以其他变量的个数 $${n - 2}$，而不是它们的 $${each}$ 种取值。`,
            ),
          ].filter((m, i, all) => m.value !== count && m.value !== 0 && all.findIndex((o) => o.value === m.value) === i),
          solution: walked(
            [
              [
                ["Count the true cases of p and q", "数 p、q 的真值情况"],
                t(`$p ${row[0]} q$ is true in $${row[1]}$ of the $4$ cases.`, `$p ${row[0]} q$ 在 $4$ 种情况中有 $${row[1]}$ 种为真。`),
              ],
              [
                ["Repeat for the other variables", "乘以其他变量的取值数"],
                n === 2
                  ? t("There are no other variables, so each case is a single row.", "没有其他变量，所以每种情况只有一行。")
                  : t(
                      `Each case appears in $${eachText}$ rows, so $${times(row[1])}$.`,
                      `每种情况出现在 $${eachText}$ 行中，所以 $${times(row[1])}$。`,
                    ),
              ],
            ],
            t(
              `The false rows number $${times(4 - row[1])}$, and $${count} + ${falseRows} = ${2 ** n} = 2^{${n}}$, the whole table.`,
              `为假的行有 $${times(4 - row[1])}$ 行，而 $${count} + ${falseRows} = ${2 ** n} = 2^{${n}}$，正是整个真值表。`,
            ),
          ),
        });
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
        "Dividing a generating function by $1 - x$ turns a sequence into its partial sums. So the coefficients of $\\frac{1}{(1 - x)(1 - rx)}$ are the sums $1 + r + \\dots + r^{n}$ of a geometric sequence. In $\\frac{1}{(1 - x)(1 - 8x)}$, the coefficient of $x^{3}$ is $1 + 8 + 64 + 512 = 585$.\n\n> **Watch out.** The coefficient of $x^{n}$ adds the $n + 1$ powers from $r^{0}$ to $r^{n}$; it is the whole sum, not the last power $r^{n}$, and it stops at $r^{n}$, not $r^{n+1}$.",
        "生成函数除以 $1 - x$，就把数列变成它的部分和。所以 $\\frac{1}{(1 - x)(1 - rx)}$ 的系数是等比数列的和 $1 + r + \\dots + r^{n}$。在 $\\frac{1}{(1 - x)(1 - 8x)}$ 中，$x^{3}$ 的系数是 $1 + 8 + 64 + 512 = 585$。\n\n> **注意。** $x^{n}$ 的系数是从 $r^{0}$ 到 $r^{n}$ 共 $n + 1$ 个幂之和；它是整个和，不是最后一个幂 $r^{n}$，而且只加到 $r^{n}$，不到 $r^{n+1}$。",
      ],
      (rng) => {
        const r = rng.int(2, 6);
        const n = rng.int(2, 7);
        const sum = (r ** (n + 1) - 1) / (r - 1);
        const powers = Array.from({ length: n + 1 }, (_, i) => r ** i);
        const closed = r === 2 ? `2^{${n + 1}} - 1` : `\\frac{${r}^{${n + 1}} - 1}{${r} - 1} = \\frac{${r ** (n + 1) - 1}}{${r - 1}}`;
        return numberProblem({
          prompt: t(
            `Find the coefficient of $x^{${n}}$ in $\\frac{1}{(1 - x)(1 - ${r}x)}$.`,
            `求 $\\frac{1}{(1 - x)(1 - ${r}x)}$ 中 $x^{${n}}$ 的系数。`,
          ),
          answer: sum,
          form: "integer",
          mistakes: [
            why(
              r ** n,
              `That is the last power $${r}^{${n}}$ alone; the factor $1 - x$ adds all the powers before it too.`,
              `那只是最后一个幂 $${r}^{${n}}$；因式 $1 - x$ 还要把它之前的幂都加上。`,
            ),
            why(
              sum - r ** n,
              `That stops at $${n === 2 ? r : `${r}^{${n - 1}}`}$; the sum runs up to $${r}^{${n}}$.`,
              `那是只加到 $${n === 2 ? r : `${r}^{${n - 1}}`}$；应加到 $${r}^{${n}}$。`,
            ),
            why(
              r ** (n + 1),
              `That is $${r}^{${n + 1}}$, a single power, one step too far.`,
              `那是单个幂 $${r}^{${n + 1}}$，而且多了一步。`,
            ),
            why(
              sum + r ** (n + 1),
              `That adds $${r}^{${n + 1}}$ as well, one power too many.`,
              `那是还加上了 $${r}^{${n + 1}}$，多了一个幂。`,
            ),
          ].filter((x, i, all) => x.value !== sum && all.findIndex((o) => o.value === x.value) === i),
          solution: walked(
            [
              [
                ["Read the two factors", "看两个因式"],
                t(
                  `$\\frac{1}{1 - ${r}x} = \\sum ${r}^{k}x^{k}$, and dividing by $1 - x$ replaces each coefficient by the sum of it and all the earlier ones.`,
                  `$\\frac{1}{1 - ${r}x} = \\sum ${r}^{k}x^{k}$，再除以 $1 - x$，就把每个系数换成它与之前所有系数之和。`,
                ),
              ],
              [
                ["Add the powers", "把各幂相加"],
                t(
                  `The coefficient of $x^{${n}}$ is $${powers.join(" + ")} = ${sum}$.`,
                  `$x^{${n}}$ 的系数是 $${powers.join(" + ")} = ${sum}$。`,
                ),
              ],
            ],
            t(`The geometric sum formula gives $${closed} = ${sum}$.`, `等比数列求和公式给出 $${closed} = ${sum}$。`),
          ),
        });
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
    {
      ...skill(
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
      figure: discreteDrawings2["incidence-matrices#the-ones-in-an-incidence-matrix"],
    },
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
        "The solution has the form $Ar^{n} + Bs^{n} + Kt^{n}$, and at $n = 0$ all three powers equal 1. So the start value minus the particular coefficient gives $A + B$, before using the second condition. For $a_n = 8a_{n-1} - 7a_{n-2} - 8 \\cdot 5^{n}$, with roots $7$ and $1$, dividing by $5^{n-2}$ gives $25K = 40K - 7K - 200$, so $K = 25$; with $a_0 = 30$, $A + B = 30 - 25 = 5$.\n\n> **Watch out.** At $n = 0$, $a_0 = A + B + K$: subtract $K$ from $a_0$, do not add it. And $K$ comes from the forcing term, not from the starting value.",
        "解的形式是 $Ar^{n} + Bs^{n} + Kt^{n}$，$n = 0$ 时三个幂都等于 1。所以初值减去特解系数就得到 $A + B$，这时还没有用到第二个条件。对 $a_n = 8a_{n-1} - 7a_{n-2} - 8 \\cdot 5^{n}$，特征根为 $7$ 和 $1$，除以 $5^{n-2}$ 得 $25K = 40K - 7K - 200$，所以 $K = 25$；由 $a_0 = 30$ 得 $A + B = 30 - 25 = 5$。\n\n> **注意。** $n = 0$ 时 $a_0 = A + B + K$：要从 $a_0$ 中减去 $K$，不是加上。而 $K$ 来自强迫项，不是来自初值。",
      ],
      (rng) => {
        const base = rng.pick([2, 3]);
        const r = rng.pick([4, 5, -2, -3]);
        const s = rng.pick([1, -1, 6].filter((v) => v !== r));
        const m = nz(rng, 3);
        const c = m * (base - r) * (base - s);
        const k = base * base * m;
        const start = rng.int(-30, 30);
        const p = r + s;
        const q = -r * s;
        const answer = start - k;
        const d = (base - r) * (base - s);
        return numberProblem({
          prompt: t(
            `$a_n = ${term(p, "a_{n-1}")}${q < 0 ? " - " : " + "}${Math.abs(q) === 1 ? "" : Math.abs(q)}a_{n-2}${c < 0 ? " - " : " + "}${Math.abs(c)} \\cdot ${base}^{n}$ has characteristic roots ${r} and ${s}. With $a_0 = ${start}$, its solution is $A \\cdot ${paren(r)}^{n} + B \\cdot ${paren(s)}^{n} + K \\cdot ${base}^{n}$. Find $A + B$.`,
            `$a_n = ${term(p, "a_{n-1}")}${q < 0 ? " - " : " + "}${Math.abs(q) === 1 ? "" : Math.abs(q)}a_{n-2}${c < 0 ? " - " : " + "}${Math.abs(c)} \\cdot ${base}^{n}$ 的特征根是 ${r} 和 ${s}。$a_0 = ${start}$ 时，解为 $A \\cdot ${paren(r)}^{n} + B \\cdot ${paren(s)}^{n} + K \\cdot ${base}^{n}$。求 $A + B$。`,
          ),
          answer,
          form: "integer",
          mistakes: [
            why(
              start + k,
              "That adds $K$; at $n = 0$, $A + B + K = a_0$, so subtract it.",
              "那是加上了 $K$；$n = 0$ 时 $A + B + K = a_0$，应减去它。",
            ),
            why(k, "That is $K$, the coefficient of the particular solution.", "那是特解的系数 $K$。"),
            why(start, "That is $a_0$, which is $A + B + K$.", "那是 $a_0$，它等于 $A + B + K$。"),
            why(start - c, "That subtracts the forcing coefficient instead of $K$.", "那是减去了强迫项的系数，而不是 $K$。"),
          ].filter((x, i, all) => x.value !== answer && all.findIndex((o) => o.value === x.value) === i),
          solution: walked(
            [
              [
                ["Find $K$", "求 $K$"],
                t(
                  `Substituting $K \\cdot ${base}^{n}$ and dividing by $${base}^{n-2}$ gives $K(${base} - ${paren(r)})(${base} - ${paren(s)}) = ${paren(c)} \\cdot ${base * base}$, that is, $${d}K = ${c * base * base}$, so $K = ${k}$.`,
                  `代入 $K \\cdot ${base}^{n}$ 并除以 $${base}^{n-2}$，得 $K(${base} - ${paren(r)})(${base} - ${paren(s)}) = ${paren(c)} \\cdot ${base * base}$，即 $${d}K = ${c * base * base}$，所以 $K = ${k}$。`,
                ),
              ],
              [
                ["Use $a_0$", "利用 $a_0$"],
                t(
                  `At $n = 0$ every power is $1$, so $A + B${signed(k)} = ${start}$ and $A + B = ${start} - ${paren(k)} = ${answer}$.`,
                  `$n = 0$ 时每个幂都是 $1$，所以 $A + B${signed(k)} = ${start}$，$A + B = ${start} - ${paren(k)} = ${answer}$。`,
                ),
              ],
            ],
            t(
              `$K = ${k}$ balances the forcing, since $(${base} - ${paren(r)})(${base} - ${paren(s)}) \\cdot ${paren(k)} = ${d * k} = ${paren(c)} \\cdot ${base}^{2}$. And $A + B + K = ${answer}${signed(k)} = ${start}$, the starting value.`,
              `$K = ${k}$ 与强迫项平衡，因为 $(${base} - ${paren(r)})(${base} - ${paren(s)}) \\cdot ${paren(k)} = ${d * k} = ${paren(c)} \\cdot ${base}^{2}$。而 $A + B + K = ${answer}${signed(k)} = ${start}$，正是初值。`,
            ),
          ),
        });
      },
    ),
  ],
  "second-order-recurrence-relations-with-polynomial-forcing": [
    skill(
      "a-constant-particular-solution",
      ["A constant particular solution", "常数特解"],
      [
        "A constant forcing term calls for a constant particular solution $e$, as long as 1 is not a characteristic root. Substituting gives $e = pe + qe + \\beta$, which is one linear equation. For $a_n = 6a_{n-1} + 7a_{n-2} - 24$, $e = 6e + 7e - 24$ gives $12e = 24$, so $e = 2$.\n\n> **Watch out.** Collect the $e$ terms on one side: $(p + q - 1)e = -\\beta$, so the sign of $\\beta$ flips. Then divide by $p + q - 1$, not by $p + q$.",
        "常数强迫项对应常数特解 $e$，只要 1 不是特征根。代入得 $e = pe + qe + \\beta$，这是一个一次方程。对 $a_n = 6a_{n-1} + 7a_{n-2} - 24$，由 $e = 6e + 7e - 24$ 得 $12e = 24$，所以 $e = 2$。\n\n> **注意。** 把含 $e$ 的项移到同一边：$(p + q - 1)e = -\\beta$，所以 $\\beta$ 的符号要变。然后除以 $p + q - 1$，而不是 $p + q$。",
      ],
      (rng) => {
        const p = rng.pick([2, 3, 4, 5]);
        const q = rng.pick([2, 3, 4, 5, 6]);
        const e = nz(rng, 9);
        const beta = e * (1 - p - q);
        return numberProblem({
          prompt: t(
            `$a_n = ${p}a_{n-1} + ${q}a_{n-2}${signed(beta)}$ has a constant particular solution $a_n = e$. Find $e$.`,
            `$a_n = ${p}a_{n-1} + ${q}a_{n-2}${signed(beta)}$ 有常数特解 $a_n = e$。求 $e$。`,
          ),
          answer: e,
          form: "integer",
          mistakes: [
            why(
              -e,
              "The sign is off: moving the $e$ terms to one side gives $(p + q - 1)e = -\\beta$.",
              "符号错了：把含 $e$ 的项移到一边得 $(p + q - 1)e = -\\beta$。",
            ),
            why(beta, "That is the forcing constant $\\beta$ itself.", "那是强迫项的常数 $\\beta$ 本身。"),
            why(
              -beta,
              `That is $${p + q - 1}e$; divide by $${p + q - 1}$ to get $e$.`,
              `那是 $${p + q - 1}e$；还要除以 $${p + q - 1}$ 才得到 $e$。`,
            ),
            ...(beta % (p + q) === 0
              ? [
                  why(
                    -beta / (p + q),
                    `That divides by $${p + q}$; the $e$ on the left makes the factor $${p + q - 1}$.`,
                    `那是除以了 $${p + q}$；左边的 $e$ 使因子成为 $${p + q - 1}$。`,
                  ),
                ]
              : []),
          ].filter((x, i, all) => x.value !== e && all.findIndex((o) => o.value === x.value) === i),
          solution: walked(
            [
              [
                ["Substitute $a_n = e$", "代入 $a_n = e$"],
                t(
                  `$e = ${p}e + ${q}e${signed(beta)} = ${p + q}e${signed(beta)}$.`,
                  `$e = ${p}e + ${q}e${signed(beta)} = ${p + q}e${signed(beta)}$。`,
                ),
              ],
              [
                ["Solve for $e$", "解出 $e$"],
                t(`$${p + q - 1}e = ${-beta}$, so $e = ${e}$.`, `$${p + q - 1}e = ${-beta}$，所以 $e = ${e}$。`),
              ],
            ],
            t(
              `Putting $a_n = ${e}$ into the right side gives $${p * e}${signed(q * e)}${signed(beta)} = ${e}$, the constant itself.`,
              `把 $a_n = ${e}$ 代入右边得 $${p * e}${signed(q * e)}${signed(beta)} = ${e}$，正是这个常数。`,
            ),
          ),
        });
      },
    ),
  ],
  "solving-homogeneous-recurrence-relations-using-generating-functions": [
    skill(
      "early-terms-from-the-numerator",
      ["Early terms from the numerator", "由分子得前几项"],
      [
        "In $\\frac{u + vx}{1 - px - qx^{2}}$, multiplying across gives $a_0 = u$ and $a_1 = pu + v$. So the numerator encodes the starting values, and the denominator encodes the recurrence. For $\\frac{3 + 2x}{1 - 7x - 2x^{2}}$, $a_0 = 3$ and $a_1 = 21 + 2 = 23$.\n\n> **Watch out.** The $x$ coefficient $v$ of the numerator is not $a_1$ itself: the $x$ terms of $(1 - px - qx^{2})G(x)$ give $a_1 - pa_0 = v$. The $q$ term only enters from $a_2$ on.",
        "在 $\\frac{u + vx}{1 - px - qx^{2}}$ 中，交叉相乘得 $a_0 = u$，$a_1 = pu + v$。所以分子记录初值，分母记录递推关系。对 $\\frac{3 + 2x}{1 - 7x - 2x^{2}}$，$a_0 = 3$，$a_1 = 21 + 2 = 23$。\n\n> **注意。** 分子中 $x$ 的系数 $v$ 不是 $a_1$ 本身：$(1 - px - qx^{2})G(x)$ 的 $x$ 项给出 $a_1 - pa_0 = v$。含 $q$ 的项从 $a_2$ 起才起作用。",
      ],
      (rng) => {
        const u = nz(rng, 9);
        const v = nz(rng, 9);
        const p = rng.int(1, 6);
        const q = rng.int(1, 12);
        const answer = p * u + v;
        const num = `${u}${v < 0 ? " - " : " + "}${Math.abs(v) === 1 ? "" : Math.abs(v)}x`;
        const den = `1 - ${p === 1 ? "" : p}x - ${q === 1 ? "" : q}x^{2}`;
        const series = answer === 0 ? `${u}` : `${u}${answer < 0 ? " - " : " + "}${Math.abs(answer) === 1 ? "" : Math.abs(answer)}x`;
        return numberProblem({
          prompt: t(
            `$G(x) = \\frac{${num}}{${den}}$ is the generating function of $a_0, a_1, \\dots$. Find $a_1$.`,
            `$G(x) = \\frac{${num}}{${den}}$ 是 $a_0, a_1, \\dots$ 的生成函数。求 $a_1$。`,
          ),
          answer,
          form: "integer",
          mistakes: [
            why(
              v,
              "That is the $x$ coefficient of the numerator; it equals $a_1 - pa_0$, not $a_1$.",
              "那是分子中 $x$ 的系数；它等于 $a_1 - pa_0$，不是 $a_1$。",
            ),
            why(u + v, "That forgets the factor $p$: $a_1 = pa_0 + v$.", "那是漏掉了因子 $p$：$a_1 = pa_0 + v$。"),
            why(q * u + v, "That uses $q$; the $x^{2}$ term only enters from $a_2$ on.", "那是用了 $q$；$x^{2}$ 项从 $a_2$ 起才起作用。"),
            why(u, "That is $a_0$, the constant term of the numerator.", "那是 $a_0$，分子的常数项。"),
          ].filter((x, i, all) => x.value !== answer && all.findIndex((o) => o.value === x.value) === i),
          solution: walked(
            [
              [
                ["Multiply across", "交叉相乘"],
                t(`$(${den})(a_0 + a_1x + \\dots) = ${num}$.`, `$(${den})(a_0 + a_1x + \\dots) = ${num}$。`),
              ],
              [
                ["Match the coefficients", "比较系数"],
                t(
                  `The constants give $a_0 = ${u}$, and the $x$ terms give $a_1 - ${p === 1 ? "" : p}a_0 = ${v}$, so $a_1 = ${p * u}${signed(v)} = ${answer}$.`,
                  `比较常数项得 $a_0 = ${u}$，比较 $x$ 的项得 $a_1 - ${p === 1 ? "" : p}a_0 = ${v}$，所以 $a_1 = ${p * u}${signed(v)} = ${answer}$。`,
                ),
              ],
            ],
            t(
              `In $(${den})(${series} + \\dots)$ the $x$ coefficient is $${answer}${signed(-p * u)} = ${v}$, the numerator's.`,
              `在 $(${den})(${series} + \\dots)$ 中 $x$ 的系数是 $${answer}${signed(-p * u)} = ${v}$，与分子相符。`,
            ),
          ),
        });
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
        "For small $x$, $(1 + x)^{r}$ is close to $1 + rx$, whatever the real power $r$ is. This gives quick estimates of roots and reciprocals by keeping the first two terms of the expansion. For $1.06^{1/3}$, $x = 0.06$ and $1 + \\frac{1}{3}(0.06) = 1.02$; the true value is $1.0196\\ldots$\n\n> **Watch out.** Multiply $x$ by $r$ with its sign, and keep the leading $1$; the estimate is $1 + rx$, not $1 + x$ or $rx$.",
        "$x$ 很小时，不管实数 $r$ 是多少，$(1 + x)^{r}$ 都接近 $1 + rx$。所以保留展开式的前两项，就能快速估计根和倒数。对 $1.06^{1/3}$，$x = 0.06$，$1 + \\frac{1}{3}(0.06) = 1.02$；真实值为 $1.0196\\ldots$\n\n> **注意。** 要用带符号的 $r$ 乘以 $x$，并保留开头的 $1$；估计值是 $1 + rx$，不是 $1 + x$ 或 $rx$。",
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
        const rq = Q.of(row[1], row[2]);
        const rx = rq.mul(x);
        const xs = k < 0 ? `(${dec(x)})` : dec(x);
        const product = rq.eq(Q.of(-1)) ? `-${xs}` : `${rq.toLatex()} \\cdot ${xs}`;
        const next = rq
          .mul(rq.sub(Q.of(1)))
          .div(Q.of(2))
          .mul(x.pow(2));
        return numberProblem({
          prompt: t(
            `Use the first two terms of the binomial expansion to approximate $${shown}^{${row[0]}}$.`,
            `用二项展开式的前两项近似 $${shown}^{${row[0]}}$。`,
          ),
          answer,
          form: "decimal",
          mistakes: [
            why(Q.of(1).add(x), "That leaves out the power $r$; the second term is $rx$.", "那是漏掉了幂 $r$；第二项是 $rx$。"),
            why(Q.of(1).sub(rx), "That flips the sign of $rx$.", "那是把 $rx$ 的符号弄反了。"),
            why(rx, "That forgets the leading term $1$.", "那是忘了开头的 $1$。"),
          ].filter((m, i, all) => !(m.value as Q).eq(answer) && all.findIndex((o) => (o.value as Q).eq(m.value as Q)) === i),
          solution: walked(
            [
              [["Identify x and r", "确定 x 和 r"], t(`$x = ${dec(x)}$ and $r = ${row[0]}$.`, `$x = ${dec(x)}$，$r = ${row[0]}$。`)],
              [["Find rx", "求 rx"], t(`$${product} = ${dec(rx)}$.`, `$${product} = ${dec(rx)}$。`)],
              [
                ["Add 1", "加 1"],
                t(
                  `$1 ${rx.sign() < 0 ? "-" : "+"} ${dec(rx.abs())} = ${dec(answer)}$.`,
                  `$1 ${rx.sign() < 0 ? "-" : "+"} ${dec(rx.abs())} = ${dec(answer)}$。`,
                ),
              ],
            ],
            t(
              `The next term, $\\binom{r}{2}x^2 = ${dec(next)}$, is far smaller than $rx$, so the estimate is off by only about that much.`,
              `下一项 $\\binom{r}{2}x^2 = ${dec(next)}$ 远小于 $rx$，所以估计值的误差大约只有这么多。`,
            ),
          ),
        });
      },
    ),
  ],
};
