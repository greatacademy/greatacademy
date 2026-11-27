// A third knowledge point for the discrete mathematics and machine learning topics that still had two.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";
import { discreteDrawings2 } from "../explanation-drawings-discrete-mathematics-2.ts";

import { numberProblem, why } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";
import { walked } from "./calculus-i-differentiation.ts";
import { chooseFilled, frac, signed, skill } from "./third-kit.ts";

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
          "Prim's algorithm grows a single tree from its starting vertex. So the first edge is the smallest entry in the row of that vertex, even when a smaller edge exists elsewhere in the matrix. In the drawing, the start is $B$: the first edge is the smallest entry of row $B$, $2$, to $C$, while the $1$ between $A$ and $C$ is smaller but does not touch $B$. On six vertices, if row $E$ holds $31, 27, 40, 35, 29$ and the matrix has a $25$ elsewhere, Prim's algorithm from $E$ first adds the edge of weight $27$.\n\n> **Watch out.** Look only at the row of the starting vertex; the smallest entry of the whole matrix may not touch it. And Prim's algorithm takes the smallest entry of that row, not the largest.",
          "普里姆算法从起点开始长成一棵树。所以第一条边是这个顶点所在行中最小的元素，即使矩阵别处有更小的边。图中起点是 $B$：第一条边是 $B$ 行最小的元素 $2$，连到 $C$；$A$ 与 $C$ 之间的 $1$ 虽然更小，但它不与 $B$ 相连。在六个顶点上，若 $E$ 行为 $31, 27, 40, 35, 29$，而矩阵别处有一个 $25$，则从 $E$ 出发的普里姆算法先加入权为 $27$ 的边。\n\n> **注意。** 只看起点所在的行；整个矩阵的最小元素可能不与它相连。而且普里姆算法取这一行最小的元素，不是最大的。",
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
          const answer = Math.min(...row);
          const others = [0, 1, 2, 3].filter((j) => j !== start);
          const to = ["A", "B", "C", "D"][(rows[start] as (number | string)[]).indexOf(answer)] as string;
          const entries = others.map((j) => `${["A", "B", "C", "D"][j]}\\colon ${(rows[start] as (number | string)[])[j]}`).join(",\\ ");
          const lightest = Math.min(...w);
          return numberProblem({
            prompt: t(
              `The edge weights of a complete graph on $A, B, C, D$ are given by $${mat(rows)}$. Prim's algorithm starts at $${name}$. What is the weight of the first edge it adds?`,
              `完全图（顶点 $A, B, C, D$）的边权由 $${mat(rows)}$ 给出。普里姆算法从 $${name}$ 开始。它加入的第一条边的权是多少？`,
            ),
            answer,
            form: "integer",
            mistakes: [
              why(
                Math.max(...row),
                `That is the largest entry of row $${name}$; Prim's algorithm takes the lightest edge.`,
                `那是 $${name}$ 行最大的元素；普里姆算法取最轻的边。`,
              ),
              why(
                lightest,
                `That is the smallest entry of the whole matrix, but its edge does not touch $${name}$.`,
                `那是整个矩阵中最小的元素，但它的边不与 $${name}$ 相连。`,
              ),
              why(
                (row[1] as number) + 1,
                `That is not the smallest entry of row $${name}$; compare its three entries again.`,
                `那不是 $${name}$ 行中最小的元素；重新比较这一行的三个元素。`,
              ),
            ].filter((x, i, all) => x.value !== answer && all.findIndex((o) => o.value === x.value) === i),
            solution: walked(
              [
                [["Read the row of the start", "读起点所在的行"], t(`Row $${name}$ holds $${entries}$.`, `$${name}$ 行为 $${entries}$。`)],
                [
                  ["Take the smallest", "取最小的元素"],
                  t(
                    `The smallest is $${answer}$, so the first edge is $${name}${to}$, of weight $${answer}$.`,
                    `最小的是 $${answer}$，所以第一条边是 $${name}${to}$，权为 $${answer}$。`,
                  ),
                ],
              ],
              lightest === answer
                ? t(
                    `Here $${answer}$ is also the smallest entry of the whole matrix, and its edge touches $${name}$, so nothing lighter could come first.`,
                    `这里 $${answer}$ 也是整个矩阵中最小的元素，而且它的边与 $${name}$ 相连，所以不可能有更轻的边先加入。`,
                  )
                : t(
                    `The matrix's smallest entry, $${lightest}$, lies outside row $${name}$, so its edge does not touch the tree yet and cannot be first.`,
                    `矩阵中最小的元素 $${lightest}$ 不在 $${name}$ 行，所以它的边还没有接触到树，不可能最先加入。`,
                  ),
            ),
          });
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
        "Multiplying a function by a positive number and adding a constant changes its largest value but not where it occurs. This is why a loss can be rescaled freely without changing the best parameter.\n\nFor example, if $f$ has its maximum value $6$ at $x = 4$, then $3f(x) - 5$ also peaks at $x = 4$, with value $3 \\times 6 - 5 = 13$.\n\nCheck: wherever $f(x) < 6$, also $3f(x) - 5 < 13$, so no other point can beat $x = 4$.\n\n> **Watch out.** The argmax is a location, not a value: the answer is $4$, not the new maximum $13$, and the rescaling is not applied to the location, so not $3 \\times 4 - 5 = 7$ either.",
        "函数乘一个正数再加常数，会改变最大值，但不改变它出现的位置。所以损失函数可以任意缩放，最优参数不变。\n\n例如，若 $f$ 在 $x = 4$ 处取最大值 $6$，则 $3f(x) - 5$ 也在 $x = 4$ 处最大，最大值为 $3 \\times 6 - 5 = 13$。\n\n检验：凡是 $f(x) < 6$ 的地方，都有 $3f(x) - 5 < 13$，所以没有别的点能超过 $x = 4$。\n\n> **注意。** 最大值点是位置，不是数值：答案是 $4$，不是新的最大值 $13$；缩放也不作用在位置上，所以也不是 $3 \\times 4 - 5 = 7$。",
      ],
      (rng) => {
        const p = nz(rng, 20);
        const q = nz(rng, 20);
        const a = rng.int(2, 9);
        const b = nz(rng, 9);
        return numberProblem({
          prompt: t(
            `A function $f$ has its unique maximum value ${q} at $x = ${p}$. Find $\\operatorname{argmax}_{x} \\left(${a}f(x)${signed(b)}\\right)$.`,
            `函数 $f$ 在 $x = ${p}$ 处取唯一最大值 ${q}。求 $\\operatorname{argmax}_{x} \\left(${a}f(x)${signed(b)}\\right)$。`,
          ),
          answer: p,
          form: "integer",
          mistakes: [
            why(
              q,
              "That is the maximum value of $f$; the argmax asks where the maximum occurs.",
              "这是 $f$ 的最大值；最大值点问的是最大值出现在哪里。",
            ),
            why(
              a * q + b,
              "That is the maximum value of the rescaled function; the argmax is the place where it is reached.",
              "这是缩放后函数的最大值；最大值点是取到它的位置。",
            ),
            why(
              a * p + b,
              "That applies the rescaling to the location; the rescaling changes the values of $f$, not where the largest one sits.",
              "这是把缩放作用到了位置上；缩放改变的是 $f$ 的值，而不是最大值所在的位置。",
            ),
          ].filter((m, i, ms) => ms.findIndex((o) => o.value === m.value) === i),
          solution: walked(
            [
              [
                ["See what the rescaling does", "看缩放的作用"],
                t(
                  `Since $${a} > 0$, $${a}f(x)${signed(b)}$ is larger exactly where $f(x)$ is larger, so both are largest at the same $x$.`,
                  `因为 $${a} > 0$，$${a}f(x)${signed(b)}$ 在 $f(x)$ 较大的地方恰好也较大，所以两者在同一个 $x$ 处最大。`,
                ),
              ],
              [
                ["Read off the location", "读出位置"],
                t(
                  `$f$ is largest at $x = ${p}$, so the argmax is $${p}$; only the value changes, to $${a} \\times ${paren(q)}${signed(b)} = ${a * q + b}$.`,
                  `$f$ 在 $x = ${p}$ 处最大，所以最大值点是 $${p}$；只有最大值变为 $${a} \\times ${paren(q)}${signed(b)} = ${a * q + b}$。`,
                ),
              ],
            ],
            t(
              `At any other $x$, $f(x) < ${q}$, so $${a}f(x)${signed(b)} < ${a * q + b}$: the rescaled function is smaller there too.`,
              `在其他任何 $x$ 处 $f(x) < ${q}$，所以 $${a}f(x)${signed(b)} < ${a * q + b}$：缩放后的函数在那里也更小。`,
            ),
          ),
        });
      },
    ),
  ],
  "computing-principal-components": [
    skill(
      "the-second-variance-from-the-trace",
      ["The second variance from the trace", "由迹求第二个方差"],
      [
        "The eigenvalues of a covariance matrix add up to its trace, which is the sum of the variances on the diagonal. So once the largest eigenvalue is known, the other one in two dimensions needs no further work.\n\nFor example, $\\begin{pmatrix} 25 & 12 \\\\ 12 & 18 \\end{pmatrix}$ has trace $25 + 18 = 43$, so if its largest eigenvalue is $34$, the other is $43 - 34 = 9$.\n\nCheck: the eigenvalues also multiply to the determinant, and $34 \\times 9 = 306 = 25 \\times 18 - 12^2$.\n\n> **Watch out.** The trace adds only the diagonal entries; the covariance $12$ off the diagonal plays no part in it, and the trace itself is the sum of both eigenvalues, not the second one.",
        "协方差矩阵的特征值之和等于它的迹，也就是对角线上方差的和。所以在二维中知道最大特征值后，另一个不需要再计算。\n\n例如，$\\begin{pmatrix} 25 & 12 \\\\ 12 & 18 \\end{pmatrix}$ 的迹是 $25 + 18 = 43$，若它的最大特征值是 $34$，则另一个是 $43 - 34 = 9$。\n\n检验：特征值之积等于行列式，而 $34 \\times 9 = 306 = 25 \\times 18 - 12^2$。\n\n> **注意。** 迹只把对角线元素相加；对角线外的协方差 $12$ 与迹无关，而迹本身是两个特征值之和，不是第二个特征值。",
      ],
      (rng) => {
        const l = rng.int(1, 30);
        const m = rng.int(1, 3);
        const big = l + 25 * m;
        const swap = rng.bool();
        const p = l + (swap ? 16 : 9) * m;
        const r = l + (swap ? 9 : 16) * m;
        return numberProblem({
          prompt: t(
            `The covariance matrix $${mat([
              [p, 12 * m],
              [12 * m, r],
            ])}$ has largest eigenvalue ${big}. What is the other eigenvalue?`,
            `协方差矩阵 $${mat([
              [p, 12 * m],
              [12 * m, r],
            ])}$ 的最大特征值是 ${big}。另一个特征值是多少？`,
          ),
          answer: l,
          form: "integer",
          mistakes: [
            why(
              p + r,
              `That is the trace, the sum of both eigenvalues; subtract the largest one, $${big}$.`,
              `这是迹，即两个特征值之和；还要减去最大特征值 $${big}$。`,
            ),
            why(
              big - 12 * m,
              `That subtracts the off-diagonal covariance $${12 * m}$ from the largest eigenvalue; the eigenvalues add up to the trace instead.`,
              `这是用最大特征值减去对角线外的协方差 $${12 * m}$；应利用两个特征值之和等于迹。`,
            ),
            why(
              p,
              `That is the first variance on the diagonal; the eigenvalues are not the diagonal entries unless the covariance $${12 * m}$ is $0$.`,
              `这是对角线上的第一个方差；除非协方差 $${12 * m}$ 为 $0$，特征值并不是对角线元素。`,
            ),
          ].filter((x, i, ms) => ms.findIndex((o) => o.value === x.value) === i),
          solution: walked(
            [
              [
                ["Add the diagonal", "把对角线相加"],
                t(
                  `The trace is $${p} + ${r} = ${p + r}$, and it equals the sum of the two eigenvalues.`,
                  `迹是 $${p} + ${r} = ${p + r}$，它等于两个特征值之和。`,
                ),
              ],
              [
                ["Subtract the largest eigenvalue", "减去最大特征值"],
                t(`The other eigenvalue is $${p + r} - ${big} = ${l}$.`, `另一个特征值是 $${p + r} - ${big} = ${l}$。`),
              ],
            ],
            t(
              `The eigenvalues multiply to the determinant: $${big} \\times ${l} = ${big * l}$ and $${p} \\times ${r} - ${12 * m}^2 = ${p * r - 144 * m * m}$.`,
              `特征值之积等于行列式：$${big} \\times ${l} = ${big * l}$，且 $${p} \\times ${r} - ${12 * m}^2 = ${p * r - 144 * m * m}$。`,
            ),
          ),
        });
      },
    ),
  ],
  "conditional-expectation-for-continuous-random-variables": [
    skill(
      "a-linear-function-given-a-value",
      ["A linear function given a value", "给定值时的线性函数"],
      [
        "Conditional expectation is linear, just like ordinary expectation. So once $E[X \\mid Y = y]$ is known as a function of $y$, the expectation of $rX + s$ follows by substituting and scaling.\n\nFor example, if $E[X \\mid Y = y] = 3y - 2$, then $E[X \\mid Y = 2] = 4$ and $E[4X + 5 \\mid Y = 2] = 4 \\times 4 + 5 = 21$.\n\nCheck: as a function of $y$, $E[4X + 5 \\mid Y = y] = 4(3y - 2) + 5 = 12y - 3$, which is $21$ at $y = 2$.\n\n> **Watch out.** The multiplier scales the whole conditional mean, constant included: $4(3y - 2)$, not $4 \\times 3y - 2$; and the added $5$ stays in the answer.",
        "条件期望和普通期望一样是线性的。所以知道 $E[X \\mid Y = y]$ 是 $y$ 的函数后，$rX + s$ 的期望可以代入再缩放得到。\n\n例如，若 $E[X \\mid Y = y] = 3y - 2$，则 $E[X \\mid Y = 2] = 4$，$E[4X + 5 \\mid Y = 2] = 4 \\times 4 + 5 = 21$。\n\n检验：作为 $y$ 的函数，$E[4X + 5 \\mid Y = y] = 4(3y - 2) + 5 = 12y - 3$，在 $y = 2$ 处为 $21$。\n\n> **注意。** 乘数要乘整个条件均值，包括常数：是 $4(3y - 2)$，不是 $4 \\times 3y - 2$；加上的 $5$ 也要留在答案里。",
      ],
      (rng) => {
        const p = rng.int(2, 6);
        const q = nz(rng, 9);
        const r = rng.int(2, 6);
        const s = nz(rng, 9);
        const y = rng.int(1, 9);
        const e = p * y + q;
        return numberProblem({
          prompt: t(
            `Suppose $E[X \\mid Y = y] = ${p}y${signed(q)}$. Find $E[${r}X${signed(s)} \\mid Y = ${y}]$.`,
            `设 $E[X \\mid Y = y] = ${p}y${signed(q)}$。求 $E[${r}X${signed(s)} \\mid Y = ${y}]$。`,
          ),
          answer: r * e + s,
          form: "integer",
          mistakes: [
            why(
              e,
              `That is $E[X \\mid Y = ${y}]$ itself; the question asks for the expectation of $${r}X${signed(s)}$.`,
              `这只是 $E[X \\mid Y = ${y}]$；题目求的是 $${r}X${signed(s)}$ 的期望。`,
            ),
            why(r * e, `That scales by $${r}$ but leaves out the added constant $${s}$.`, `这乘了 $${r}$，却漏掉了加上的常数 $${s}$。`),
            why(
              r * p * y + q + s,
              `That scales only the $${p}y$ term; the multiplier $${r}$ applies to the constant $${q}$ as well.`,
              `这只把 $${p}y$ 项乘了倍数；乘数 $${r}$ 也要作用在常数 $${q}$ 上。`,
            ),
          ].filter((x, i, ms) => ms.findIndex((o) => o.value === x.value) === i),
          solution: walked(
            [
              [
                ["Substitute the value", "代入给定值"],
                t(
                  `$E[X \\mid Y = ${y}] = ${p} \\times ${y}${signed(q)} = ${e}$.`,
                  `$E[X \\mid Y = ${y}] = ${p} \\times ${y}${signed(q)} = ${e}$。`,
                ),
              ],
              [
                ["Scale and shift", "缩放并平移"],
                t(
                  `By linearity, $E[${r}X${signed(s)} \\mid Y = ${y}] = ${r} \\times ${paren(e)}${signed(s)} = ${r * e + s}$.`,
                  `由线性性，$E[${r}X${signed(s)} \\mid Y = ${y}] = ${r} \\times ${paren(e)}${signed(s)} = ${r * e + s}$。`,
                ),
              ],
            ],
            t(
              `As a function of $y$, $E[${r}X${signed(s)} \\mid Y = y] = ${r * p}y${signed(r * q + s)}$, and $${r * p} \\times ${y}${signed(r * q + s)} = ${r * e + s}$.`,
              `作为 $y$ 的函数，$E[${r}X${signed(s)} \\mid Y = y] = ${r * p}y${signed(r * q + s)}$，而 $${r * p} \\times ${y}${signed(r * q + s)} = ${r * e + s}$。`,
            ),
          ),
        });
      },
    ),
  ],
  "conditional-variance-for-continuous-random-variables": [
    skill(
      "scaling-a-conditional-variance",
      ["Scaling a conditional variance", "条件方差的缩放"],
      [
        "Given $Y$, the variable $X$ behaves like any other random variable. So a multiplier comes out of the conditional variance squared, and an added constant has no effect on the spread.\n\nFor example, if $\\operatorname{Var}(X \\mid Y = y) = 2y^{2}$, then $\\operatorname{Var}(X \\mid Y = 2) = 8$ and $\\operatorname{Var}(3X - 7 \\mid Y = 2) = 3^2 \\times 8 = 72$.\n\nCheck: the shift $-7$ moves every value and the mean alike, while the factor $3$ triples each deviation from the mean, so each squared deviation grows $9$ times, and $72 = 9 \\times 8$.\n\n> **Watch out.** The multiplier comes out squared, $9$ and not $3$; and the constant adds nothing to the variance, so the answer is not $72 + 7$.",
        "给定 $Y$ 时，$X$ 与其他随机变量一样。所以乘数提到条件方差外面时要平方，而加上的常数不影响离散程度。\n\n例如，若 $\\operatorname{Var}(X \\mid Y = y) = 2y^{2}$，则 $\\operatorname{Var}(X \\mid Y = 2) = 8$，$\\operatorname{Var}(3X - 7 \\mid Y = 2) = 3^2 \\times 8 = 72$。\n\n检验：平移 $-7$ 让每个取值和均值一起移动，而因子 $3$ 让每个离差变为三倍，所以每个离差的平方变为 $9$ 倍，$72 = 9 \\times 8$。\n\n> **注意。** 乘数提出来时要平方，是 $9$ 而不是 $3$；常数对方差没有贡献，所以答案不是 $72 + 7$。",
      ],
      (rng) => {
        const c = rng.int(1, 6);
        const y = rng.int(1, 6);
        const a = rng.int(2, 5);
        const b = nz(rng, 20);
        const v = c * y * y;
        return numberProblem({
          prompt: t(
            `Suppose $\\operatorname{Var}(X \\mid Y = y) = ${term(c, "y^{2}")}$. Find $\\operatorname{Var}(${a}X${signed(b)} \\mid Y = ${y})$.`,
            `设 $\\operatorname{Var}(X \\mid Y = y) = ${term(c, "y^{2}")}$。求 $\\operatorname{Var}(${a}X${signed(b)} \\mid Y = ${y})$。`,
          ),
          answer: a * a * v,
          form: "integer",
          mistakes: [
            why(
              a * v,
              `That multiplies by $${a}$; a multiplier comes out of a variance squared, as $${a}^2 = ${a * a}$.`,
              `这是乘以 $${a}$；乘数从方差中提出来时要平方，即 $${a}^2 = ${a * a}$。`,
            ),
            why(
              a * a * v + Math.abs(b),
              `That adds the constant $${Math.abs(b)}$; shifting $X$ moves its mean too, so the spread does not change.`,
              `这是加上了常数 $${Math.abs(b)}$；平移 $X$ 时均值也一起移动，离散程度不变。`,
            ),
            why(
              v,
              `That is $\\operatorname{Var}(X \\mid Y = ${y})$ alone; the multiplier $${a}$ still has to come out, squared.`,
              `这只是 $\\operatorname{Var}(X \\mid Y = ${y})$；还要把乘数 $${a}$ 平方后提出来。`,
            ),
          ],
          solution: walked(
            [
              [
                ["Evaluate the conditional variance", "求条件方差"],
                t(
                  `$\\operatorname{Var}(X \\mid Y = ${y}) = ${c === 1 ? "" : `${c} \\times `}${y}^{2} = ${v}$.`,
                  `$\\operatorname{Var}(X \\mid Y = ${y}) = ${c === 1 ? "" : `${c} \\times `}${y}^{2} = ${v}$。`,
                ),
              ],
              [
                ["Scale and drop the shift", "缩放并去掉平移"],
                t(
                  `$\\operatorname{Var}(${a}X${signed(b)} \\mid Y = ${y}) = ${a}^2 \\times ${v} = ${a * a * v}$; the constant $${b}$ does not change the spread.`,
                  `$\\operatorname{Var}(${a}X${signed(b)} \\mid Y = ${y}) = ${a}^2 \\times ${v} = ${a * a * v}$；常数 $${b}$ 不改变离散程度。`,
                ),
              ],
            ],
            t(
              `The conditional standard deviation $\\sqrt{${v}}$ is multiplied by $${a}$, and squaring gives back $${a * a} \\times ${v} = ${a * a * v}$.`,
              `条件标准差 $\\sqrt{${v}}$ 乘以 $${a}$，再平方得到 $${a * a} \\times ${v} = ${a * a * v}$。`,
            ),
          ),
        });
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
        "As the order of a Minkowski distance grows, the largest coordinate difference takes over. In the limit, the Chebyshev distance is simply the largest absolute difference among the coordinates.\n\nFor example, $\\mathbf{x} = (1, -4, 6)$ and $\\mathbf{y} = (3, 2, 5)$ have absolute differences $2, 6, 1$, so $D_{\\infty}(\\mathbf{x}, \\mathbf{y}) = 6$.\n\nCheck: the Manhattan distance $2 + 6 + 1 = 9$ is larger, as it always is, and the Euclidean distance $\\sqrt{4 + 36 + 1} = \\sqrt{41}$ lies between $6$ and $9$.\n\n> **Watch out.** Take absolute values before comparing: the signed differences are $-2, -6, 1$, and the largest of those, $1$, is not the distance; and do not add the differences, which gives the Manhattan distance.",
        "闵可夫斯基距离的阶数增大时，最大的坐标差占主导。取极限得到切比雪夫距离，就是各坐标差绝对值中最大的那个。\n\n例如，$\\mathbf{x} = (1, -4, 6)$ 与 $\\mathbf{y} = (3, 2, 5)$ 的坐标差绝对值是 $2, 6, 1$，所以 $D_{\\infty}(\\mathbf{x}, \\mathbf{y}) = 6$。\n\n检验：曼哈顿距离 $2 + 6 + 1 = 9$ 更大，这总是成立的；欧几里得距离 $\\sqrt{4 + 36 + 1} = \\sqrt{41}$ 介于 $6$ 和 $9$ 之间。\n\n> **注意。** 比较之前要先取绝对值：带符号的差是 $-2, -6, 1$，其中最大的 $1$ 并不是距离；也不要把差加起来，那是曼哈顿距离。",
      ],
      (rng) => {
        const x = [nz(rng, 9), nz(rng, 9), nz(rng, 9), nz(rng, 9)];
        const y = [nz(rng, 9), nz(rng, 9), nz(rng, 9), nz(rng, 9)];
        const d = x.map((v, i) => Math.abs(v - (y[i] as number)));
        const most = Math.max(...d);
        const sum = d.reduce((a, b) => a + b, 0);
        const signedMost = Math.max(...x.map((v, i) => v - (y[i] as number)));
        return numberProblem({
          prompt: t(
            `Find the Chebyshev distance $D_{\\infty}(\\mathbf{x}, \\mathbf{y})$ between $\\mathbf{x} = (${x.join(", ")})$ and $\\mathbf{y} = (${y.join(", ")})$.`,
            `求 $\\mathbf{x} = (${x.join(", ")})$ 和 $\\mathbf{y} = (${y.join(", ")})$ 之间的切比雪夫距离 $D_{\\infty}(\\mathbf{x}, \\mathbf{y})$。`,
          ),
          answer: most,
          form: "integer",
          mistakes: [
            why(
              sum,
              "That adds the absolute differences, which is the Manhattan distance; the Chebyshev distance keeps only the largest.",
              "这是把差的绝对值相加，得到的是曼哈顿距离；切比雪夫距离只取最大的那个。",
            ),
            why(
              Math.min(...d),
              "That is the smallest absolute difference; the Chebyshev distance is the largest.",
              "这是最小的差的绝对值；切比雪夫距离取最大的。",
            ),
            why(
              signedMost,
              "That is the largest signed difference $x_i - y_i$; take absolute values first, since a large negative difference counts too.",
              "这是带符号的差 $x_i - y_i$ 中最大的；要先取绝对值，绝对值大的负差也要算。",
            ),
          ].filter((m, i, ms) => ms.findIndex((o) => o.value === m.value) === i),
          solution: walked(
            [
              [
                ["Take the absolute differences", "求差的绝对值"],
                t(
                  `$${x.map((v, i) => `|${v} - ${paren(y[i] as number)}|`).join(", ")}$ are $${d.join(", ")}$.`,
                  `$${x.map((v, i) => `|${v} - ${paren(y[i] as number)}|`).join(", ")}$ 依次是 $${d.join(", ")}$。`,
                ),
              ],
              [
                ["Keep the largest", "取最大的"],
                t(
                  `The largest is $${most}$, so $D_{\\infty}(\\mathbf{x}, \\mathbf{y}) = ${most}$.`,
                  `最大的是 $${most}$，所以 $D_{\\infty}(\\mathbf{x}, \\mathbf{y}) = ${most}$。`,
                ),
              ],
            ],
            t(
              `The Chebyshev distance is never more than the Manhattan distance, and $${most} \\le ${sum}$.`,
              `切比雪夫距离从不超过曼哈顿距离，而 $${most} \\le ${sum}$。`,
            ),
          ),
        });
      },
    ),
  ],
  "feature-extraction-using-pca": [
    skill(
      "reconstructing-a-point-from-its-score",
      ["Reconstructing a point from its score", "由得分重构数据点"],
      [
        "Keeping one component stores only a score for each point. To return to the original space, multiply the principal direction by that score, which gives the closest point on the line.\n\nFor example, with $\\mathbf{v}_1 = \\left(\\frac{3}{5}, \\frac{4}{5}\\right)$ and score $10$, the reconstruction is $10\\mathbf{v}_1 = (6, 8)$.\n\nCheck: $\\mathbf{v}_1$ has length $1$, so the reconstruction has length $10$, the score: $\\sqrt{6^2 + 8^2} = 10$.\n\n> **Watch out.** Multiply the whole unit vector, denominators included: $(10 \\times 3, 10 \\times 4) = (30, 40)$ forgets the $\\frac{1}{5}$; and keep the coordinates in order, $(6, 8)$ and not $(8, 6)$.",
        "只保留一个主成分时，每个点只存一个得分。要回到原来的空间，就用主方向乘这个得分，得到直线上最近的点。\n\n例如，$\\mathbf{v}_1 = \\left(\\frac{3}{5}, \\frac{4}{5}\\right)$、得分为 $10$ 时，重构结果是 $10\\mathbf{v}_1 = (6, 8)$。\n\n检验：$\\mathbf{v}_1$ 的长度是 $1$，所以重构结果的长度等于得分 $10$：$\\sqrt{6^2 + 8^2} = 10$。\n\n> **注意。** 要乘整个单位向量，连分母一起：$(10 \\times 3, 10 \\times 4) = (30, 40)$ 忘了 $\\frac{1}{5}$；坐标顺序也不能颠倒，是 $(6, 8)$ 而不是 $(8, 6)$。",
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
        const wrong = [`(${b * m}, ${a * m})`, `(${a * s}, ${b * s})`, `(${-a * m}, ${-b * m})`];
        const solution = walked(
          [
            [
              ["Scale the direction by the score", "用得分缩放方向"],
              t(
                `The reconstruction is $${s}\\mathbf{v}_1 = ${s}\\left(${frac(a, c)}, ${frac(b, c)}\\right)$.`,
                `重构结果是 $${s}\\mathbf{v}_1 = ${s}\\left(${frac(a, c)}, ${frac(b, c)}\\right)$。`,
              ),
            ],
            [
              ["Multiply each coordinate", "逐个坐标相乘"],
              t(
                `$\\left(${frac(`${s} \\times ${a}`, c)}, ${frac(`${s} \\times ${b}`, c)}\\right) = (${a * m}, ${b * m})$.`,
                `$\\left(${frac(`${s} \\times ${a}`, c)}, ${frac(`${s} \\times ${b}`, c)}\\right) = (${a * m}, ${b * m})$。`,
              ),
            ],
          ],
          t(
            `Since $\\mathbf{v}_1$ has length $1$, the reconstruction has length $|${s}|$: $\\sqrt{${paren(a * m)}^2 + ${paren(b * m)}^2} = ${Math.abs(s)}$.`,
            `因为 $\\mathbf{v}_1$ 的长度是 $1$，重构结果的长度是 $|${s}|$：$\\sqrt{${paren(a * m)}^2 + ${paren(b * m)}^2} = ${Math.abs(s)}$。`,
          ),
        );
        return reasoned(
          chooseFilled(
            rng,
            [
              `The first principal direction is $\\mathbf{v}_1 = \\left(${frac(a, c)}, ${frac(b, c)}\\right)$, and a centered point has score ${s}. Find its reconstruction from this one component.`,
              `第一主方向是 $\\mathbf{v}_1 = \\left(${frac(a, c)}, ${frac(b, c)}\\right)$，一个中心化后的点的得分是 ${s}。求只用这一个主成分的重构结果。`,
            ],
            `(${a * m}, ${b * m})`,
            wrong,
            [solution.en, solution["zh-CN"]],
          ),
          [
            [
              `$${wrong[0]}$`,
              "This swaps the two coordinates; the first coordinate comes from the first entry of $\\mathbf{v}_1$.",
              "这把两个坐标对调了；第一个坐标来自 $\\mathbf{v}_1$ 的第一个分量。",
            ],
            [
              `$${wrong[1]}$`,
              `This multiplies the score by the numerators only; each entry of $\\mathbf{v}_1$ also divides by $${c}$.`,
              `这只用得分乘了分子；$\\mathbf{v}_1$ 的每个分量还要除以 $${c}$。`,
            ],
            [
              `$${wrong[2]}$`,
              `This flips the sign; the score $${s}$ multiplies $\\mathbf{v}_1$ as it is.`,
              `这把符号弄反了；得分 $${s}$ 直接乘 $\\mathbf{v}_1$。`,
            ],
          ],
        );
      },
    ),
  ],
  "finding-argmax-and-argmin-from-tables-and-graphs": [
    skill(
      "the-argmax-of-a-sum",
      ["The argmax of a sum", "和的最大值点"],
      [
        "The best input for a sum need not be the best input for either part. So a combined score, such as accuracy minus a penalty, has to be worked out at each input before comparing.\n\nFor example, if $f$ takes $9, 4, 7$ and $g$ takes $2, 8, 6$ at $x = 1, 2, 3$, the sums are $11, 12, 13$, so $\\operatorname{argmax}_{x} \\left(f(x) + g(x)\\right) = 3$, although $f$ is largest at $x = 1$ and $g$ at $x = 2$.\n\nCheck: $13$ beats both other sums, $11$ and $12$, so no other input ties with $x = 3$.\n\n> **Watch out.** The answer is the input $3$, not the largest sum $13$; and the argmax of one part, $1$ or $2$ here, says nothing on its own about the sum.",
        "和的最优输入不一定是任一部分的最优输入。所以综合得分（比如准确率减去惩罚）要在每个输入处算出来，再作比较。\n\n例如，若在 $x = 1, 2, 3$ 处 $f$ 取 $9, 4, 7$，$g$ 取 $2, 8, 6$，则和为 $11, 12, 13$，所以 $\\operatorname{argmax}_{x} \\left(f(x) + g(x)\\right) = 3$，尽管 $f$ 在 $x = 1$ 处最大，$g$ 在 $x = 2$ 处最大。\n\n检验：$13$ 大于另外两个和 $11$ 与 $12$，所以没有别的输入与 $x = 3$ 并列。\n\n> **注意。** 答案是输入 $3$，不是最大的和 $13$；单独一部分的最大值点（这里是 $1$ 或 $2$）本身不能说明和的情况。",
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
        const second = Math.max(...sums.filter((_, i) => i !== at));
        return numberProblem({
          prompt: t(
            `For $x = 1, 2, 3, 4, 5$, $f(x)$ takes the values $${f.join(", ")}$ and $g(x)$ takes the values $${g.join(", ")}$. Find $\\operatorname{argmax}_{x} \\left(f(x) + g(x)\\right)$.`,
            `当 $x = 1, 2, 3, 4, 5$ 时，$f(x)$ 依次取 $${f.join(", ")}$，$g(x)$ 依次取 $${g.join(", ")}$。求 $\\operatorname{argmax}_{x} \\left(f(x) + g(x)\\right)$。`,
          ),
          answer: at + 1,
          form: "integer",
          mistakes: [
            why(
              f.indexOf(Math.max(...f)) + 1,
              "That is where $f$ alone is largest; the best input for the sum has to be found from the sums themselves.",
              "这是 $f$ 单独最大的位置；和的最大值点要由各处的和来确定。",
            ),
            why(
              g.indexOf(Math.max(...g)) + 1,
              "That is where $g$ alone is largest; the best input for the sum has to be found from the sums themselves.",
              "这是 $g$ 单独最大的位置；和的最大值点要由各处的和来确定。",
            ),
            why(
              best,
              "That is the largest sum itself; the argmax asks for the input $x$ where it occurs.",
              "这是最大的和本身；最大值点问的是取到它的输入 $x$。",
            ),
            why(
              sums.indexOf(Math.min(...sums)) + 1,
              "That is where the sum is smallest, the argmin; the question asks for the argmax.",
              "这是和最小的位置，即最小值点；题目问的是最大值点。",
            ),
          ].filter((m, i, ms) => ms.findIndex((o) => o.value === m.value) === i),
          solution: walked(
            [
              [
                ["Add at each input", "在每个输入处相加"],
                t(
                  `For $x = 1, 2, 3, 4, 5$ the sums $f(x) + g(x)$ are $${f.map((v, i) => `${v} + ${g[i]} = ${sums[i]}`).join(", ")}$.`,
                  `当 $x = 1, 2, 3, 4, 5$ 时，和 $f(x) + g(x)$ 依次为 $${f.map((v, i) => `${v} + ${g[i]} = ${sums[i]}`).join(", ")}$。`,
                ),
              ],
              [
                ["Pick the largest sum", "选出最大的和"],
                t(`The largest sum, $${best}$, comes at $x = ${at + 1}$.`, `最大的和 $${best}$ 在 $x = ${at + 1}$ 处。`),
              ],
            ],
            t(
              `The next largest sum is $${second}$, and $${best} > ${second}$, so $x = ${at + 1}$ is the only maximizer.`,
              `第二大的和是 $${second}$，而 $${best} > ${second}$，所以 $x = ${at + 1}$ 是唯一的最大值点。`,
            ),
          ),
        });
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
        "The gradient of $\\|\\mathbf{x} - \\mathbf{c}\\|^{2}$ is $2(\\mathbf{x} - \\mathbf{c})$, which points directly away from $\\mathbf{c}$. So a gradient step on this function moves the point toward $\\mathbf{c}$.\n\nFor example, with $\\mathbf{c} = (1, 3)$ at $\\mathbf{x} = (4, 1)$, the gradient is $2(3, -2) = (6, -4)$.\n\nCheck: a step of $\\frac{1}{2}$ against the gradient gives $(4, 1) - (3, -2) = (1, 3)$, which is $\\mathbf{c}$, the minimum.\n\n> **Watch out.** Keep the factor $2$ from the square, and subtract in the order $\\mathbf{x} - \\mathbf{c}$: $2(\\mathbf{c} - \\mathbf{x}) = (-6, 4)$ is the negative gradient, the direction of descent.",
        "$\\|\\mathbf{x} - \\mathbf{c}\\|^{2}$ 的梯度是 $2(\\mathbf{x} - \\mathbf{c})$，它指向背离 $\\mathbf{c}$ 的方向。所以沿这个函数做梯度下降，点就向 $\\mathbf{c}$ 移动。\n\n例如，$\\mathbf{c} = (1, 3)$ 时，在 $\\mathbf{x} = (4, 1)$ 处梯度为 $2(3, -2) = (6, -4)$。\n\n检验：逆着梯度走 $\\frac{1}{2}$ 步，得到 $(4, 1) - (3, -2) = (1, 3)$，正是最小值点 $\\mathbf{c}$。\n\n> **注意。** 不要丢掉平方带来的因子 $2$，并按 $\\mathbf{x} - \\mathbf{c}$ 的顺序相减：$2(\\mathbf{c} - \\mathbf{x}) = (-6, 4)$ 是负梯度，即下降方向。",
      ],
      (rng) => {
        const x = [nz(rng, 9), nz(rng, 9)] as const;
        const c = [nz(rng, 9), nz(rng, 9)] as const;
        const wrong = [vec(x[0] - c[0], x[1] - c[1]), vec(2 * (c[0] - x[0]), 2 * (c[1] - x[1])), vec(2 * x[0], 2 * x[1])];
        const solution = walked(
          [
            [
              ["Recall the gradient", "回顾梯度公式"],
              t(
                "Each component of $\\|\\mathbf{x} - \\mathbf{c}\\|^{2}$ is a square $(x_i - c_i)^2$ with derivative $2(x_i - c_i)$, so $\\nabla f = 2(\\mathbf{x} - \\mathbf{c})$.",
                "$\\|\\mathbf{x} - \\mathbf{c}\\|^{2}$ 的每一项是平方 $(x_i - c_i)^2$，导数为 $2(x_i - c_i)$，所以 $\\nabla f = 2(\\mathbf{x} - \\mathbf{c})$。",
              ),
            ],
            [
              ["Substitute the point", "代入该点"],
              t(
                `The components are $2(${x[0]} - ${paren(c[0])}) = ${2 * (x[0] - c[0])}$ and $2(${x[1]} - ${paren(c[1])}) = ${2 * (x[1] - c[1])}$.`,
                `各分量为 $2(${x[0]} - ${paren(c[0])}) = ${2 * (x[0] - c[0])}$ 和 $2(${x[1]} - ${paren(c[1])}) = ${2 * (x[1] - c[1])}$。`,
              ),
            ],
          ],
          t(
            `A step of $\\frac{1}{2}$ against the gradient lands on the minimum: $(${x[0]} - ${paren(x[0] - c[0])}, ${x[1]} - ${paren(x[1] - c[1])}) = (${c[0]}, ${c[1]})$, which is $\\mathbf{c}$.`,
            `逆着梯度走 $\\frac{1}{2}$ 步正好到达最小值点：$(${x[0]} - ${paren(x[0] - c[0])}, ${x[1]} - ${paren(x[1] - c[1])}) = (${c[0]}, ${c[1]})$，即 $\\mathbf{c}$。`,
          ),
        );
        const right = vec(2 * (x[0] - c[0]), 2 * (x[1] - c[1]));
        const filled: string[] = [];
        for (const w of wrong) if (w !== right && !filled.includes(w)) filled.push(w);
        for (let step = 1; filled.length < 3 && step < 30; step++) {
          const near = right.replace(/-?\d+/, (n) => String(Number(n) + step));
          if (near !== right && !filled.includes(near)) filled.push(near);
        }
        const nearby = filled
          .filter((o) => !wrong.includes(o))
          .map((o): [string, string, string] => [
            `$${o}$`,
            `This changes the first component; it is $2(${x[0]} - ${paren(c[0])}) = ${2 * (x[0] - c[0])}$.`,
            `这改变了第一个分量；它应为 $2(${x[0]} - ${paren(c[0])}) = ${2 * (x[0] - c[0])}$。`,
          ]);
        return reasoned(
          chooseFilled(
            rng,
            [
              `Let $f(\\mathbf{x}) = \\|\\mathbf{x} - \\mathbf{c}\\|^{2}$ with $\\mathbf{c} = ${vec(...c)}$. Find $\\nabla f$ at $\\mathbf{x} = ${vec(...x)}$.`,
              `设 $f(\\mathbf{x}) = \\|\\mathbf{x} - \\mathbf{c}\\|^{2}$，$\\mathbf{c} = ${vec(...c)}$。求 $\\mathbf{x} = ${vec(...x)}$ 处的 $\\nabla f$。`,
            ],
            right,
            wrong,
            [solution.en, solution["zh-CN"]],
          ),
          [
            [
              `$${wrong[0]}$`,
              "This is $\\mathbf{x} - \\mathbf{c}$ without the factor $2$ that the square contributes.",
              "这是 $\\mathbf{x} - \\mathbf{c}$，漏掉了平方带来的因子 $2$。",
            ],
            [
              `$${wrong[1]}$`,
              "This is $2(\\mathbf{c} - \\mathbf{x})$, the negative gradient; the gradient points away from $\\mathbf{c}$.",
              "这是 $2(\\mathbf{c} - \\mathbf{x})$，即负梯度；梯度指向背离 $\\mathbf{c}$ 的方向。",
            ],
            [
              `$${wrong[2]}$`,
              "This is $2\\mathbf{x}$, the gradient of $\\|\\mathbf{x}\\|^{2}$; the center $\\mathbf{c}$ has to be subtracted first.",
              "这是 $2\\mathbf{x}$，即 $\\|\\mathbf{x}\\|^{2}$ 的梯度；要先减去中心 $\\mathbf{c}$。",
            ],
            ...nearby,
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
        "Setting the gradient with respect to one block of variables to zero gives its best value while the others stay fixed. This one step is the basis of alternating minimization.\n\nFor example, $f(x, y) = 2x^{2} + 8xy + y^{2}$ has $\\frac{\\partial f}{\\partial x} = 4x + 8y$, so with $y = 3$ held fixed, $4x + 24 = 0$ gives $x = -6$.\n\nCheck: $4 \\times (-6) + 24 = 0$, and since the coefficient $2$ of $x^{2}$ is positive, this zero is the minimum in $x$.\n\n> **Watch out.** Differentiate $2x^{2}$ to $4x$ and divide by that $4$, not by $2$; and keep the sign, since $x = -6$, not $6$.",
        "令关于一块变量的梯度为零，就得到其他变量固定时这一块的最优值。这一步是交替最小化的基础。\n\n例如，$f(x, y) = 2x^{2} + 8xy + y^{2}$ 有 $\\frac{\\partial f}{\\partial x} = 4x + 8y$，所以固定 $y = 3$ 时，由 $4x + 24 = 0$ 得 $x = -6$。\n\n检验：$4 \\times (-6) + 24 = 0$，又因为 $x^{2}$ 的系数 $2$ 是正数，这个零点是关于 $x$ 的最小值点。\n\n> **注意。** $2x^{2}$ 求导得 $4x$，要除以这个 $4$，而不是 $2$；还要保留符号，是 $x = -6$，不是 $6$。",
      ],
      (rng) => {
        const a = rng.int(1, 6);
        const m = nz(rng, 5);
        const b = 2 * a * m;
        const c = rng.int(1, 9);
        const y = nz(rng, 9);
        return numberProblem({
          prompt: t(
            `Let $f(x, y) = ${term(a, "x^{2}")} ${b < 0 ? "-" : "+"} ${Math.abs(b)}xy + ${term(c, "y^{2}")}$. With $y = ${y}$ held fixed, which $x$ makes $\\frac{\\partial f}{\\partial x} = 0$?`,
            `设 $f(x, y) = ${term(a, "x^{2}")} ${b < 0 ? "-" : "+"} ${Math.abs(b)}xy + ${term(c, "y^{2}")}$。固定 $y = ${y}$，哪个 $x$ 使 $\\frac{\\partial f}{\\partial x} = 0$？`,
          ),
          answer: -m * y,
          form: "integer",
          mistakes: [
            why(
              m * y,
              "That has the wrong sign; moving the $y$ term across the equals sign changes its sign.",
              "这个符号错了；把含 $y$ 的项移到等号另一边时要变号。",
            ),
            why(
              b * y,
              `That is the $y$ term $${b}y$ at $y = ${y}$ itself; solve for $x$ by moving it across and dividing by $${2 * a}$.`,
              `这是含 $y$ 的项 $${b}y$ 在 $y = ${y}$ 时的值；要把它移项再除以 $${2 * a}$ 才能解出 $x$。`,
            ),
            why(
              -b * y,
              `That moves the $y$ term across but forgets to divide by the coefficient $${2 * a}$ of $x$ in the derivative.`,
              `这移了项，却忘了除以导数中 $x$ 的系数 $${2 * a}$。`,
            ),
          ],
          solution: walked(
            [
              [
                ["Differentiate in x", "求偏导数"],
                t(
                  `$\\frac{\\partial f}{\\partial x} = ${2 * a}x ${b < 0 ? "-" : "+"} ${Math.abs(b)}y$, which at $y = ${y}$ is $${2 * a}x${signed(b * y)}$.`,
                  `$\\frac{\\partial f}{\\partial x} = ${2 * a}x ${b < 0 ? "-" : "+"} ${Math.abs(b)}y$，在 $y = ${y}$ 时为 $${2 * a}x${signed(b * y)}$。`,
                ),
              ],
              [
                ["Set it to zero", "令其为零"],
                t(
                  `$${2 * a}x${signed(b * y)} = 0$ gives $x = ${frac(-b * y, 2 * a)} = ${-m * y}$.`,
                  `由 $${2 * a}x${signed(b * y)} = 0$ 得 $x = ${frac(-b * y, 2 * a)} = ${-m * y}$。`,
                ),
              ],
            ],
            t(
              `$${2 * a} \\times ${paren(-m * y)}${signed(b * y)} = 0$, and the coefficient of $x^{2}$ is positive, so this is the minimum in $x$.`,
              `$${2 * a} \\times ${paren(-m * y)}${signed(b * y)} = 0$，且 $x^{2}$ 的系数为正，所以这是关于 $x$ 的最小值点。`,
            ),
          ),
        });
      },
    ),
  ],
  "incidence-matrices": [
    {
      ...skill(
        "the-ones-in-an-incidence-matrix",
        ["The ones in an incidence matrix", "关联矩阵中 1 的个数"],
        [
          "Each column of the incidence matrix of a simple graph has exactly two ones, one for each end of the edge. So the total number of ones is twice the number of edges, whatever the vertex count. The drawing shows a simple graph with $4$ edges, whose incidence matrix holds $2 \\cdot 4 = 8$ ones. A simple graph with $30$ vertices and $60$ edges has $2 \\cdot 60 = 120$ ones in its incidence matrix.\n\n> **Watch out.** Each edge has two ends, so it puts two ones in its column, not one. And the number of vertices does not enter the count; it only sets how many rows there are.",
          "简单图的关联矩阵每一列恰有两个 1，对应边的两个端点。所以 1 的总数是边数的两倍，与顶点数无关。图中的简单图有 $4$ 条边，它的关联矩阵中有 $2 \\cdot 4 = 8$ 个 1。有 $30$ 个顶点、$60$ 条边的简单图，其关联矩阵中有 $2 \\cdot 60 = 120$ 个 1。\n\n> **注意。** 每条边有两个端点，所以它在所在列放两个 1，而不是一个。顶点数不影响这个个数；它只决定有多少行。",
        ],
        (rng) => {
          const v = rng.int(4, 20);
          const e = rng.int(3, 40);
          const usable = Math.min(e, (v * (v - 1)) / 2);
          const answer = 2 * usable;
          return numberProblem({
            prompt: t(
              `A simple graph has ${v} vertices and ${usable} edges. How many entries of its incidence matrix equal 1?`,
              `简单图有 ${v} 个顶点、${usable} 条边。它的关联矩阵中有多少个元素等于 1？`,
            ),
            answer,
            form: "integer",
            mistakes: [
              why(
                usable,
                "That puts one $1$ in each column; an edge has two ends, so its column has two.",
                "那是每列只放一个 $1$；一条边有两个端点，所以它的列有两个。",
              ),
              why(v * usable, "That is the number of all the entries, zeros included.", "那是所有元素的个数，包括零。"),
              why(2 * v, "That doubles the number of vertices; the ones come from the edges.", "那是把顶点数加倍；1 来自边。"),
            ].filter((x, i, all) => x.value !== answer && all.findIndex((o) => o.value === x.value) === i),
            solution: walked(
              [
                [
                  ["Look at one column", "看一列"],
                  t(
                    `Each of the ${usable} columns stands for an edge and has a $1$ in the rows of its two ends.`,
                    `${usable} 列中每列代表一条边，在它两个端点所在的行为 $1$。`,
                  ),
                ],
                [
                  ["Add the columns", "把各列相加"],
                  t(`So the matrix holds $2 \\cdot ${usable} = ${answer}$ ones.`, `所以矩阵中共有 $2 \\cdot ${usable} = ${answer}$ 个 1。`),
                ],
              ],
              t(
                `Counting by rows instead, each row holds as many ones as its vertex's degree, and by the handshake lemma the ${v} degrees add up to $2 \\cdot ${usable} = ${answer}$.`,
                `改为按行计数，每行 1 的个数等于该顶点的度，由握手定理，${v} 个顶点的度数之和为 $2 \\cdot ${usable} = ${answer}$。`,
              ),
            ),
          });
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
        "The expected value of an indicator is the probability of its predicate, since it is 1 exactly when the predicate holds. So the expected sum over many samples is the number of samples times that probability.\n\nFor example, if each of $40$ samples is classified correctly with probability $\\frac{3}{4}$, the expected number of correct ones is $40 \\times \\frac{3}{4} = 30$.\n\nCheck: the expected number of wrong ones is $40 \\times \\frac{1}{4} = 10$, and $30 + 10 = 40$, every sample.\n\n> **Watch out.** The indicator counts the correct samples only, so the answer is not all $40$, nor the $10$ expected mistakes; and each term contributes the probability $\\frac{3}{4}$, not its numerator $3$.",
        "指示函数的期望就是谓词的概率，因为它恰好在谓词成立时为 1。所以许多样本上求和的期望，是样本数乘这个概率。\n\n例如，若 $40$ 个样本中每个被正确分类的概率都是 $\\frac{3}{4}$，则正确个数的期望是 $40 \\times \\frac{3}{4} = 30$。\n\n检验：分类错误个数的期望是 $40 \\times \\frac{1}{4} = 10$，而 $30 + 10 = 40$，正好是全部样本。\n\n> **注意。** 指示函数只数正确的样本，所以答案不是全部 $40$ 个，也不是错误个数的期望 $10$；每一项贡献的是概率 $\\frac{3}{4}$，而不是它的分子 $3$。",
      ],
      (rng) => {
        const q = rng.pick([2, 4, 5, 8, 10, 20, 25]);
        const p = rng.int(1, q - 1);
        const n = q * rng.int(2, 40);
        const prob = Q.of(p, q).toLatex();
        const mean = (n * p) / q;
        return numberProblem({
          prompt: t(
            `Each of ${n} independent samples is classified correctly with probability $${prob}$. What is the expected value of $\\sum_{i=1}^{${n}} \\mathbb{I}[\\hat{y}_i = y_i]$?`,
            `${n} 个独立样本中，每个被正确分类的概率是 $${prob}$。$\\sum_{i=1}^{${n}} \\mathbb{I}[\\hat{y}_i = y_i]$ 的期望是多少？`,
          ),
          answer: mean,
          form: "integer",
          mistakes: [
            why(
              n,
              "That counts every sample as correct; each indicator is $1$ only with the given probability.",
              "这是把每个样本都算作正确；每个指示函数只以给定的概率取 $1$。",
            ),
            why(
              n - mean,
              "That is the expected number of misclassified samples; the indicator counts the correct ones.",
              "这是分类错误样本个数的期望；指示函数数的是正确的样本。",
            ),
            why(
              p,
              `That is only the numerator of the probability; each of the ${n} terms has expected value $${prob}$, and they add up.`,
              `这只是概率的分子；${n} 项中每一项的期望都是 $${prob}$，要把它们加起来。`,
            ),
          ],
          solution: walked(
            [
              [
                ["Find the mean of one indicator", "求一个指示函数的期望"],
                t(
                  `$\\mathbb{I}[\\hat{y}_i = y_i]$ is $1$ with probability $${prob}$ and $0$ otherwise, so its expected value is $${prob}$.`,
                  `$\\mathbb{I}[\\hat{y}_i = y_i]$ 以概率 $${prob}$ 取 $1$，否则取 $0$，所以它的期望是 $${prob}$。`,
                ),
              ],
              [
                ["Add over the samples", "对样本求和"],
                t(
                  `By linearity of expectation, the sum has expected value $${n} \\times ${prob} = ${mean}$.`,
                  `由期望的线性性，和的期望是 $${n} \\times ${prob} = ${mean}$。`,
                ),
              ],
            ],
            t(
              `The expected number of misclassified samples is $${n} - ${mean} = ${n - mean}$, and the two counts add to all $${n}$ samples.`,
              `分类错误个数的期望是 $${n} - ${mean} = ${n - mean}$，两者之和正是全部 $${n}$ 个样本。`,
            ),
          ),
        });
      },
    ),
  ],
  "introduction-to-principal-component-analysis": [
    skill(
      "the-share-of-variance-kept",
      ["The share of variance kept", "保留的方差比例"],
      [
        "Each component accounts for a share of the total variance equal to its eigenvalue divided by the sum of all the eigenvalues. Keeping several components adds up their shares.\n\nFor example, eigenvalues $12, 5, 2, 1$ add to $20$, so the first two components keep $\\frac{12 + 5}{20} = \\frac{17}{20}$ of the variance.\n\nCheck: the share lost is $\\frac{2 + 1}{20} = \\frac{3}{20}$, and $\\frac{17}{20} + \\frac{3}{20} = 1$.\n\n> **Watch out.** Divide by the sum of all the eigenvalues, not by the ones left out: $\\frac{17}{3}$ is more than $1$, which no share can be; and two of four components do not keep $\\frac{2}{4}$, since the shares are weighted by the eigenvalues.",
        "每个主成分所占总方差的比例，等于它的特征值除以所有特征值之和。保留几个主成分，就把它们的比例相加。\n\n例如，特征值 $12, 5, 2, 1$ 之和为 $20$，所以前两个主成分保留了 $\\frac{12 + 5}{20} = \\frac{17}{20}$ 的方差。\n\n检验：损失的比例是 $\\frac{2 + 1}{20} = \\frac{3}{20}$，且 $\\frac{17}{20} + \\frac{3}{20} = 1$。\n\n> **注意。** 要除以所有特征值之和，而不是除以舍去的那些：$\\frac{17}{3}$ 大于 $1$，任何比例都不可能这样；四个主成分保留两个，也不是保留 $\\frac{2}{4}$，因为比例要按特征值加权。",
      ],
      (rng) => {
        const values = rng.sample([2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 25, 30, 32, 40], 4).sort((a, b) => b - a);
        const k = rng.int(1, 2);
        const kept = values.slice(0, k).reduce((a, b) => a + b, 0);
        const total = values.reduce((a, b) => a + b, 0);
        const share = Q.of(kept, total);
        const lost = Q.of(total - kept, total);
        const reduce = (top: number, q: Q) => (frac(top, total) === q.toLatex() ? q.toLatex() : `${frac(top, total)} = ${q.toLatex()}`);
        return numberProblem({
          prompt: t(
            `A covariance matrix has eigenvalues $${values.join(", ")}$. What fraction of the total variance ${k === 1 ? "does the first component" : "do the first two components"} keep?`,
            `协方差矩阵的特征值是 $${values.join(", ")}$。前 ${k === 1 ? "一" : "两"}个主成分保留了总方差的几分之几？`,
          ),
          answer: share,
          mistakes: [
            why(
              Q.of(k, 4),
              `That counts components, ${k} of 4; each component's share is weighted by its eigenvalue.`,
              `这是在数主成分的个数，4 个中的 ${k} 个；每个主成分的比例要按它的特征值加权。`,
            ),
            why(
              Q.of(kept, total - kept),
              `That divides by the eigenvalues left out, $${total - kept}$; a share divides by the total $${total}$.`,
              `这是除以舍去的特征值之和 $${total - kept}$；比例应除以总和 $${total}$。`,
            ),
            why(
              lost,
              "That is the share of variance lost by the dropped components, not the share kept.",
              "这是舍去的主成分损失的方差比例，而不是保留的比例。",
            ),
          ],
          solution: walked(
            [
              [
                ["Add the kept and all eigenvalues", "求保留的和全部特征值之和"],
                t(
                  `The kept eigenvalues give $${k === 1 ? `${kept}` : `${values[0]} + ${values[1]} = ${kept}`}$, and all of them give $${values.join(" + ")} = ${total}$.`,
                  `保留的特征值为 $${k === 1 ? `${kept}` : `${values[0]} + ${values[1]} = ${kept}`}$，全部特征值之和为 $${values.join(" + ")} = ${total}$。`,
                ),
              ],
              [["Divide", "相除"], t(`The share kept is $${reduce(kept, share)}$.`, `保留的比例是 $${reduce(kept, share)}$。`)],
            ],
            t(
              `The share lost is $${reduce(total - kept, lost)}$, and $${share.toLatex()} + ${lost.toLatex()} = 1$.`,
              `损失的比例是 $${reduce(total - kept, lost)}$，且 $${share.toLatex()} + ${lost.toLatex()} = 1$。`,
            ),
          ),
        });
      },
    ),
  ],
  "matrix-gradients": [
    skill(
      "the-gradient-of-the-frobenius-norm",
      ["The gradient of the Frobenius norm", "弗罗贝尼乌斯范数的梯度"],
      [
        "The squared Frobenius norm is the sum of the squares of all the entries, so each entry contributes separately. Differentiating entry by entry shows that the gradient is $2X$.\n\nFor example, $X = \\begin{pmatrix} 1 & -2 \\\\ 3 & 4 \\end{pmatrix}$ has $\\|X\\|_{F}^{2} = 1 + 4 + 9 + 16 = 30$ and $\\nabla_{X} f = \\begin{pmatrix} 2 & -4 \\\\ 6 & 8 \\end{pmatrix}$.\n\nCheck: only the term $x_{12}^{2}$ involves $x_{12}$, and its derivative at $x_{12} = -2$ is $2 \\times (-2) = -4$, the top-right entry.\n\n> **Watch out.** The gradient is $2X$ itself, not its transpose $2X^{T}$, and not the matrix of squares, which is $f$'s terms rather than their derivatives; and keep the factor $2$.",
        "弗罗贝尼乌斯范数的平方是所有元素的平方和，所以每个元素分别起作用。逐元素求导可知梯度是 $2X$。\n\n例如，$X = \\begin{pmatrix} 1 & -2 \\\\ 3 & 4 \\end{pmatrix}$ 有 $\\|X\\|_{F}^{2} = 1 + 4 + 9 + 16 = 30$，且 $\\nabla_{X} f = \\begin{pmatrix} 2 & -4 \\\\ 6 & 8 \\end{pmatrix}$。\n\n检验：只有 $x_{12}^{2}$ 这一项含 $x_{12}$，它在 $x_{12} = -2$ 处的导数是 $2 \\times (-2) = -4$，正是右上角的元素。\n\n> **注意。** 梯度就是 $2X$ 本身，不是它的转置 $2X^{T}$，也不是各元素平方组成的矩阵，那是 $f$ 的各项而不是它们的导数；因子 $2$ 也不能丢。",
      ],
      (rng) => {
        const [a, b, c, d] = [nz(rng, 9), nz(rng, 9), nz(rng, 9), nz(rng, 9)];
        const right = mat([
          [2 * a, 2 * b],
          [2 * c, 2 * d],
        ]);
        const wrong = [
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
        ];
        const filled: string[] = [];
        for (const w of wrong) if (w !== right && !filled.includes(w)) filled.push(w);
        for (let step = 1; filled.length < 3 && step < 30; step++) {
          const near = right.replace(/-?\d+/, (n) => String(Number(n) + step));
          if (near !== right && !filled.includes(near)) filled.push(near);
        }
        const nearby = filled
          .filter((o) => !wrong.includes(o))
          .map((o): [string, string, string] => [
            `$${o}$`,
            `This changes the top-left entry; it is $2 \\times ${paren(a)} = ${2 * a}$.`,
            `这改变了左上角的元素；它应为 $2 \\times ${paren(a)} = ${2 * a}$。`,
          ]);
        const solution = walked(
          [
            [
              ["Write the norm as a sum", "把范数写成和"],
              t(
                `$f(X) = x_{11}^{2} + x_{12}^{2} + x_{21}^{2} + x_{22}^{2}$, and each entry appears only in its own square, so $\\frac{\\partial f}{\\partial x_{ij}} = 2x_{ij}$ and $\\nabla_{X} f = 2X$.`,
                `$f(X) = x_{11}^{2} + x_{12}^{2} + x_{21}^{2} + x_{22}^{2}$，每个元素只出现在自己的平方中，所以 $\\frac{\\partial f}{\\partial x_{ij}} = 2x_{ij}$，$\\nabla_{X} f = 2X$。`,
              ),
            ],
            [["Double each entry", "把每个元素加倍"], t(`$2X = ${right}$.`, `$2X = ${right}$。`)],
          ],
          t(
            `The top-left entry: only $x_{11}^{2}$ involves $x_{11}$, and its derivative at $x_{11} = ${a}$ is $2 \\times ${paren(a)} = ${2 * a}$.`,
            `看左上角：只有 $x_{11}^{2}$ 含 $x_{11}$，它在 $x_{11} = ${a}$ 处的导数是 $2 \\times ${paren(a)} = ${2 * a}$。`,
          ),
        );
        return reasoned(
          chooseFilled(
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
            right,
            wrong,
            [solution.en, solution["zh-CN"]],
          ),
          [
            [
              `$${wrong[0]}$`,
              "This is $X$ itself; each square $x_{ij}^{2}$ has derivative $2x_{ij}$, so the factor $2$ is missing.",
              "这是 $X$ 本身；每个平方 $x_{ij}^{2}$ 的导数是 $2x_{ij}$，漏掉了因子 $2$。",
            ],
            [
              `$${wrong[1]}$`,
              "This is $2X^{T}$, with the off-diagonal entries swapped; the derivative with respect to $x_{ij}$ belongs in position $(i, j)$.",
              "这是 $2X^{T}$，对角线外的元素被对调了；关于 $x_{ij}$ 的导数应放在 $(i, j)$ 位置。",
            ],
            [
              `$${wrong[2]}$`,
              "This squares each entry, giving the terms of $f$ rather than their derivatives $2x_{ij}$.",
              "这是把每个元素平方，得到的是 $f$ 的各项，而不是它们的导数 $2x_{ij}$。",
            ],
            ...nearby,
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
        "A nondeterministic machine accepts when at least one branch accepts, so a single branch is enough. Counting how many branches accept shows how rare the right guesses can be among all the leaves. With $2$ moves at each of $4$ steps there are $2^4 = 16$ branches; if the first $3$ choices must each be the correct one, only the last choice is free, so $2$ branches accept.\n\n> **Watch out.** The fixed choices contribute a factor of $1$ each, and only the free ones multiply. With $3$ moves at each of $5$ steps and the first $2$ fixed, $3^3 = 27$ branches accept, not $3^2 = 9$.",
        "非确定型机器只要有一个分支接受就接受，所以一个分支就够了。数有多少分支接受，可以看出在所有叶子中正确的猜测可以多么稀少。每步有 $2$ 种选择、共 $4$ 步时有 $2^4 = 16$ 个分支；若前 $3$ 次选择都必须是正确的那一个，只有最后一次可以任意，所以有 $2$ 个分支接受。\n\n> **注意。** 固定的选择每次只贡献因子 $1$，只有任意的选择才相乘。每步有 $3$ 种选择、共 $5$ 步、前 $2$ 次固定时，接受的分支有 $3^3 = 27$ 个，而不是 $3^2 = 9$ 个。",
      ],
      (rng) => {
        const b = rng.int(2, 4);
        const d = rng.int(3, 7);
        const k = rng.int(1, d - 1);
        const answer = b ** (d - k);
        const pw = (x: number, e: number) => (e === 1 ? `${x}` : `${x}^{${e}}`);
        return numberProblem({
          prompt: t(
            `A nondeterministic machine has exactly ${b} moves at each of its ${d} steps. A branch accepts when its first ${k} choices are the one correct choice each, whatever follows. How many branches accept?`,
            `一台非确定型机器在 ${d} 步中每步恰有 ${b} 种选择。一个分支接受，当且仅当前 ${k} 次选择都是唯一正确的选择，后面不限。有多少分支接受？`,
          ),
          answer,
          form: "integer",
          mistakes: [
            why(b ** d, "That counts every branch, accepting or not.", "那是所有分支的个数，不论是否接受。"),
            why(
              b ** k,
              `That lets the ${k} fixed choices vary; they are fixed, and the other ${d - k} are the free ones.`,
              `那是让 ${k} 次固定的选择变化；它们是固定的，任意的是其余 ${d - k} 次。`,
            ),
            why(
              d - k,
              "That is the number of free steps, not the number of branches they make.",
              "那是任意的步数，而不是它们产生的分支数。",
            ),
            why(b ** d - answer, "That counts the branches that reject.", "那是拒绝的分支数。"),
          ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
          solution: walked(
            [
              [
                ["The fixed choices", "固定的选择"],
                t(
                  `Each of the first ${k} choices must be the one correct move, so they allow only one way.`,
                  `前 ${k} 次选择都必须是唯一正确的那一个，所以只有一种方式。`,
                ),
              ],
              [
                ["The free choices", "任意的选择"],
                t(
                  `Each of the other ${d - k} steps has ${b} moves, so the accepting branches number`,
                  `其余 ${d - k} 步每步有 ${b} 种选择，所以接受的分支数为`,
                ),
                [d - k === 1 ? `${answer}` : `${pw(b, d - k)} = ${answer}`],
              ],
            ],
            t(
              `There are $${pw(b, d)} = ${b ** d}$ branches in all, and the accepting ones are the fraction $\\frac{1}{${pw(b, k)}}$ of them: $\\frac{${b ** d}}{${b ** k}} = ${answer}$.`,
              `分支共有 $${pw(b, d)} = ${b ** d}$ 个，接受的分支占其中的 $\\frac{1}{${pw(b, k)}}$：$\\frac{${b ** d}}{${b ** k}} = ${answer}$。`,
            ),
          ),
        });
      },
    ),
  ],
  "processing-strings-using-turing-machines": [
    skill(
      "the-output-on-the-tape",
      ["The output on the tape", "纸带上的输出"],
      [
        "A Turing machine computes by rewriting its tape as it moves. To find the output, follow the transitions one symbol at a time, keeping track of what gets written in each cell. A machine that writes $1$ over $0$ and $0$ over $1$ while moving right turns $0110$ into $1001$, and read as a binary number that is $1001_2 = 9$.\n\n> **Watch out.** The machine rewrites each cell in place; it does not reverse the string. On $0011$ the tape ends as $1100$, which is $12$, not $0011$ read backwards.",
        "图灵机边移动边改写纸带来计算。要求输出，就一个符号一个符号地跟随转移，记下每个格子写入了什么。一台向右移动时把 $0$ 改写成 $1$、把 $1$ 改写成 $0$ 的机器会把 $0110$ 变成 $1001$，作为二进制数读就是 $1001_2 = 9$。\n\n> **注意。** 机器在原位改写每个格子，并不把串倒过来。对 $0011$，纸带最后为 $1100$，即 $12$，而不是把 $0011$ 倒过来读。",
      ],
      (rng) => {
        const n = rng.int(5, 9);
        const bits = Array.from({ length: n }, () => rng.int(0, 1));
        const text = bits.join("");
        const out = bits.map((b) => 1 - b).join("");
        const answer = Number.parseInt(out, 2);
        const input = Number.parseInt(text, 2);
        const terms = (s: string) =>
          [...s]
            .map((c, i) => (c === "1" ? s.length - 1 - i : -1))
            .filter((e) => e >= 0)
            .map((e) => (e === 0 ? "1" : e === 1 ? "2" : `2^{${e}}`))
            .join(" + ");
        const value = (s: string, v: number) => (v === 0 ? `${s}_2 = 0` : `${s}_2 = ${terms(s)} = ${v}`);
        return numberProblem({
          prompt: t(
            `A Turing machine starts on the first symbol of $${text}$. Its transitions are $\\delta(q_0, 0) = (q_0, 1, R)$ and $\\delta(q_0, 1) = (q_0, 0, R)$, and it halts on a blank. Read as a binary number, what is on the tape at the end? Give it in decimal.`,
            `图灵机从 $${text}$ 的第一个符号开始。转移是 $\\delta(q_0, 0) = (q_0, 1, R)$，$\\delta(q_0, 1) = (q_0, 0, R)$，遇到空白停机。把最后纸带上的内容当作二进制数，它的十进制值是多少？`,
          ),
          answer,
          form: "integer",
          mistakes: [
            why(input, "That is the value of the input; the machine flips every symbol.", "那是输入的值；机器会把每个符号都取反。"),
            why(
              Number.parseInt([...out].reverse().join(""), 2),
              "That reads the tape from right to left; the leftmost symbol is the most significant.",
              "那是从右往左读纸带；最左边的符号是最高位。",
            ),
            why(
              2 ** n - input,
              `That subtracts the input from $2^{${n}}$; flipping all ${n} bits subtracts it from $2^{${n}} - 1$.`,
              `那是用 $2^{${n}}$ 减去输入；把 ${n} 位全部取反相当于用 $2^{${n}} - 1$ 减去输入。`,
            ),
          ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
          solution: walked(
            [
              [
                ["Follow the transitions", "跟随转移"],
                t(
                  "Moving right, the machine writes $1$ over each $0$ and $0$ over each $1$, then halts at the blank:",
                  "机器向右移动，把每个 $0$ 改写成 $1$、每个 $1$ 改写成 $0$，然后在空白处停机：",
                ),
                [`${text} \\to ${out}`],
              ],
              [
                ["Read it in binary", "按二进制读"],
                t("The leftmost symbol is the most significant:", "最左边的符号是最高位："),
                [value(out, answer)],
              ],
            ],
            t(
              `Every place holds a $1$ in exactly one of the two strings, so the input and the output add to $${"1".repeat(n)}_2$: $${input} + ${answer} = ${2 ** n - 1} = 2^{${n}} - 1$.`,
              `每一位恰好在两个串中的一个里是 $1$，所以输入与输出之和为 $${"1".repeat(n)}_2$：$${input} + ${answer} = ${2 ** n - 1} = 2^{${n}} - 1$。`,
            ),
          ),
        });
      },
    ),
  ],
  "regular-graphs": [
    skill(
      "the-vertices-from-the-edges",
      ["The vertices from the edges", "由边数求顶点数"],
      [
        "In a regular graph every vertex has the same degree, so the handshake lemma reads $nk = 2E$. Knowing the degree and the number of edges therefore gives the number of vertices. The graph drawn has degree $3$ and $9$ edges, so $3n = 18$ and $n = 6$. A $10$-regular graph with $75$ edges has $n = \\frac{2 \\cdot 75}{10} = 15$ vertices.\n\n> **Watch out.** Double the edges before dividing by the degree: $\\frac{E}{k}$ counts each edge from only one end.",
        "正则图中每个顶点的度相同，所以握手定理写成 $nk = 2E$。因此知道度和边数，就能求出顶点数。图中的图度为 $3$、有 $9$ 条边，所以 $3n = 18$，$n = 6$。有 $75$ 条边的 $10$-正则图有 $n = \\frac{2 \\cdot 75}{10} = 15$ 个顶点。\n\n> **注意。** 先把边数加倍，再除以度：$\\frac{E}{k}$ 只从一端数了每条边。",
      ],
      (rng) => {
        const k = rng.int(2, 8);
        const half = rng.int(k + 1, k + 15);
        const v = k % 2 === 0 ? half : 2 * half;
        const e = (v * k) / 2;
        return numberProblem({
          prompt: t(
            `A ${k}-regular graph has ${e} edges. How many vertices does it have?`,
            `一个 ${k}-正则图有 ${e} 条边。它有多少个顶点？`,
          ),
          answer: v,
          form: "integer",
          mistakes: [
            why(v * k, "That multiplies by the degree; divide the degree sum by it instead.", "那是乘以了度；应当用度数之和除以它。"),
            why(
              e / k,
              "That divides the edges by the degree; the degree sum is twice the edges.",
              "那是用边数除以度；度数之和是边数的两倍。",
            ),
            why(2 * e, "That is the degree sum $2E$, not the number of vertices.", "那是度数之和 $2E$，不是顶点数。"),
            why(
              e + 1,
              "That is close to the number of edges; the vertices come from $nk = 2E$.",
              "那接近边数；顶点数要由 $nk = 2E$ 求出。",
            ),
            why(v + 2, "That is too many: solve $nk = 2E$ again.", "太多了：重新解 $nk = 2E$。"),
          ].filter((x, i, all) => Number.isInteger(x.value) && x.value !== v && all.findIndex((o) => o.value === x.value) === i),
          solution: walked(
            [
              [
                ["Use the handshake lemma", "用握手定理"],
                t(
                  `Every vertex has degree ${k}, so $n \\cdot ${k} = 2 \\cdot ${e} = ${2 * e}$.`,
                  `每个顶点的度都是 ${k}，所以 $n \\cdot ${k} = 2 \\cdot ${e} = ${2 * e}$。`,
                ),
              ],
              [["Divide by the degree", "除以度"], t(`$n = \\frac{${2 * e}}{${k}} = ${v}$.`, `$n = \\frac{${2 * e}}{${k}} = ${v}$。`)],
            ],
            t(
              `$\\frac{${v} \\cdot ${k}}{2} = ${e}$ edges, and $${k} \\le ${v - 1}$, so a simple ${k}-regular graph on ${v} vertices can exist.`,
              `$\\frac{${v} \\cdot ${k}}{2} = ${e}$ 条边，且 $${k} \\le ${v - 1}$，所以 ${v} 个顶点的 ${k}-正则简单图可以存在。`,
            ),
          ),
        });
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
        "A Jacobian has one row per output and one column per input. In $J_{g}J_{f}$ the sizes must match in the middle, and the result has the outputs of $g$ and the inputs of $f$.\n\nFor example, for $\\mathbf{f}: \\mathbb{R}^{3} \\to \\mathbb{R}^{5}$ and $\\mathbf{g}: \\mathbb{R}^{5} \\to \\mathbb{R}^{2}$, $J_{g}$ is $2 \\times 5$ and $J_{f}$ is $5 \\times 3$, so $J_{g}J_{f}$ is $2 \\times 3$.\n\nCheck: $\\mathbf{g} \\circ \\mathbf{f}$ maps $\\mathbb{R}^{3}$ to $\\mathbb{R}^{2}$, so it has $2$ outputs and $3$ inputs, which is $2 \\times 3$ again.\n\n> **Watch out.** Rows count outputs and come first: the size is $2 \\times 3$, not $3 \\times 2$; and it is neither factor's size, $2 \\times 5$ or $5 \\times 3$.",
        "雅可比矩阵每个输出一行，每个输入一列。在 $J_{g}J_{f}$ 中，中间的尺寸必须相符，结果的行数是 $g$ 的输出数，列数是 $f$ 的输入数。\n\n例如，对 $\\mathbf{f}: \\mathbb{R}^{3} \\to \\mathbb{R}^{5}$ 和 $\\mathbf{g}: \\mathbb{R}^{5} \\to \\mathbb{R}^{2}$，$J_{g}$ 是 $2 \\times 5$，$J_{f}$ 是 $5 \\times 3$，所以 $J_{g}J_{f}$ 是 $2 \\times 3$。\n\n检验：$\\mathbf{g} \\circ \\mathbf{f}$ 把 $\\mathbb{R}^{3}$ 映到 $\\mathbb{R}^{2}$，有 $2$ 个输出、$3$ 个输入，同样是 $2 \\times 3$。\n\n> **注意。** 行数对应输出，写在前面：尺寸是 $2 \\times 3$，不是 $3 \\times 2$；它也不是任一因子的尺寸 $2 \\times 5$ 或 $5 \\times 3$。",
      ],
      (rng) => {
        const [a, b, c] = rng.sample([2, 3, 4, 5, 6, 7, 8, 9, 10, 12], 3) as [number, number, number];
        const solution = walked(
          [
            [
              ["Size each Jacobian", "确定每个雅可比矩阵的尺寸"],
              t(
                `$J_{\\mathbf{f}}$ has ${b} rows for its outputs and ${a} columns for its inputs, so it is $${b} \\times ${a}$; likewise $J_{\\mathbf{g}}$ is $${c} \\times ${b}$.`,
                `$J_{\\mathbf{f}}$ 的 ${b} 行对应输出，${a} 列对应输入，所以是 $${b} \\times ${a}$；同理 $J_{\\mathbf{g}}$ 是 $${c} \\times ${b}$。`,
              ),
            ],
            [
              ["Multiply", "相乘"],
              t(
                `By the chain rule $J_{\\mathbf{g} \\circ \\mathbf{f}} = J_{\\mathbf{g}}J_{\\mathbf{f}}$, and $(${c} \\times ${b})(${b} \\times ${a})$ gives $${c} \\times ${a}$.`,
                `由链式法则 $J_{\\mathbf{g} \\circ \\mathbf{f}} = J_{\\mathbf{g}}J_{\\mathbf{f}}$，而 $(${c} \\times ${b})(${b} \\times ${a})$ 得到 $${c} \\times ${a}$。`,
              ),
            ],
          ],
          t(
            `$\\mathbf{g} \\circ \\mathbf{f}$ maps $\\mathbb{R}^{${a}}$ to $\\mathbb{R}^{${c}}$, so it has ${c} outputs and ${a} inputs, and the middle size ${b} cancels.`,
            `$\\mathbf{g} \\circ \\mathbf{f}$ 把 $\\mathbb{R}^{${a}}$ 映到 $\\mathbb{R}^{${c}}$，有 ${c} 个输出、${a} 个输入，中间的尺寸 ${b} 消去。`,
          ),
        );
        return reasoned(
          chooseFilled(
            rng,
            [
              `$\\mathbf{f}: \\mathbb{R}^{${a}} \\to \\mathbb{R}^{${b}}$ and $\\mathbf{g}: \\mathbb{R}^{${b}} \\to \\mathbb{R}^{${c}}$. What is the size of the Jacobian of $\\mathbf{g} \\circ \\mathbf{f}$?`,
              `$\\mathbf{f}: \\mathbb{R}^{${a}} \\to \\mathbb{R}^{${b}}$，$\\mathbf{g}: \\mathbb{R}^{${b}} \\to \\mathbb{R}^{${c}}$。$\\mathbf{g} \\circ \\mathbf{f}$ 的雅可比矩阵的尺寸是多少？`,
            ],
            `${c} \\times ${a}`,
            [`${a} \\times ${c}`, `${b} \\times ${a}`, `${c} \\times ${b}`],
            [solution.en, solution["zh-CN"]],
          ),
          [
            [
              `$${a} \\times ${c}$`,
              "This puts the inputs first; a Jacobian has one row per output, so the outputs come first.",
              "这把输入放在前面了；雅可比矩阵每个输出一行，所以输出数在前。",
            ],
            [
              `$${b} \\times ${a}$`,
              "This is the size of $J_{\\mathbf{f}}$ alone; the composite also passes through $\\mathbf{g}$.",
              "这只是 $J_{\\mathbf{f}}$ 的尺寸；复合函数还要经过 $\\mathbf{g}$。",
            ],
            [
              `$${c} \\times ${b}$`,
              "This is the size of $J_{\\mathbf{g}}$ alone; the composite takes the inputs of $\\mathbf{f}$.",
              "这只是 $J_{\\mathbf{g}}$ 的尺寸；复合函数的输入是 $\\mathbf{f}$ 的输入。",
            ],
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
        "The eigenvalues of the covariance matrix and the singular values of the centered data satisfy $\\lambda = \\frac{\\sigma^{2}}{n - 1}$. So a variance and the number of rows give the singular value by working backward.\n\nFor example, with $17$ rows and variance $9$, $\\sigma^{2} = 9 \\times 16 = 144$, so $\\sigma = 12$.\n\nCheck: $\\frac{12^{2}}{17 - 1} = \\frac{144}{16} = 9$, the variance we started from.\n\n> **Watch out.** Multiply by $n - 1 = 16$, not by $n$; and take the square root at the end: $144$ is $\\sigma^{2}$, while $\\sqrt{9} = 3$ leaves out the factor $n - 1$ altogether.",
        "协方差矩阵的特征值与中心化数据的奇异值满足 $\\lambda = \\frac{\\sigma^{2}}{n - 1}$。所以由方差和行数可以反推出奇异值。\n\n例如，有 $17$ 行、方差为 $9$ 时，$\\sigma^{2} = 9 \\times 16 = 144$，所以 $\\sigma = 12$。\n\n检验：$\\frac{12^{2}}{17 - 1} = \\frac{144}{16} = 9$，正是原来的方差。\n\n> **注意。** 要乘 $n - 1 = 16$，而不是 $n$；最后还要开平方：$144$ 是 $\\sigma^{2}$，而 $\\sqrt{9} = 3$ 完全漏掉了因子 $n - 1$。",
      ],
      (rng) => {
        const m = rng.int(2, 10);
        const k = rng.int(1, 12);
        const n = m * m + 1;
        const v = k * k;
        const s2 = v * m * m;
        return numberProblem({
          prompt: t(
            `A centered data matrix has ${n} rows, and a principal component has variance ${v}. What is the matching singular value?`,
            `中心化数据矩阵有 ${n} 行，某个主成分的方差是 ${v}。对应的奇异值是多少？`,
          ),
          answer: k * m,
          form: "integer",
          mistakes: [
            why(
              k,
              `That is the square root of the variance alone; first multiply the variance by $n - 1 = ${n - 1}$.`,
              `这只是方差的平方根；要先把方差乘以 $n - 1 = ${n - 1}$。`,
            ),
            why(s2, "That is $\\sigma^{2}$; the singular value is its square root.", "这是 $\\sigma^{2}$；奇异值是它的平方根。"),
            why(
              v * m,
              `That multiplies the variance by $\\sqrt{n - 1} = ${m}$; it is $\\sigma^{2}$, not $\\sigma$, that equals the variance times $n - 1$.`,
              `这是把方差乘以 $\\sqrt{n - 1} = ${m}$；等于方差乘 $n - 1$ 的是 $\\sigma^{2}$，而不是 $\\sigma$。`,
            ),
          ],
          solution: walked(
            [
              [
                ["Solve for the square", "解出平方"],
                t(
                  `From $\\lambda = \\frac{\\sigma^{2}}{n - 1}$, $\\sigma^{2} = ${v} \\times ${n - 1} = ${s2}$.`,
                  `由 $\\lambda = \\frac{\\sigma^{2}}{n - 1}$ 得 $\\sigma^{2} = ${v} \\times ${n - 1} = ${s2}$。`,
                ),
              ],
              [["Take the square root", "开平方"], t(`$\\sigma = \\sqrt{${s2}} = ${k * m}$.`, `$\\sigma = \\sqrt{${s2}} = ${k * m}$。`)],
            ],
            t(
              `$\\frac{${k * m}^{2}}{${n} - 1} = \\frac{${s2}}{${n - 1}} = ${v}$, the given variance.`,
              `$\\frac{${k * m}^{2}}{${n} - 1} = \\frac{${s2}}{${n - 1}} = ${v}$，正是给定的方差。`,
            ),
          ),
        });
      },
    ),
  ],
  "the-degree-of-a-vertex": [
    skill(
      "the-missing-degree",
      ["The missing degree", "缺失的度"],
      [
        "Every edge has two ends, so the degrees of a graph add up to twice the number of edges. This is the handshake lemma, and it finds one missing degree when the others are known. A graph with $4$ vertices and $4$ edges whose first three degrees are $3, 2, 2$ has degree sum $2 \\cdot 4 = 8$, so the last degree is $8 - 7 = 1$.\n\n> **Watch out.** Subtract from twice the number of edges, not from the number of edges itself.",
        "每条边有两个端点，所以图的度数之和是边数的两倍。这就是握手定理，已知其他度时可以求出缺失的度。有 $4$ 个顶点、$4$ 条边的图，前三个顶点的度为 $3, 2, 2$，度数之和为 $2 \\cdot 4 = 8$，所以最后一个顶点的度是 $8 - 7 = 1$。\n\n> **注意。** 要从边数的两倍中减，而不是从边数本身中减。",
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
        const known = 2 * edges - answer;
        return numberProblem({
          prompt: t(
            `A simple graph has ${edges} edges and ${n} vertices. ${n - 1} of the vertices have degrees $${others.join(", ")}$. What is the degree of the last vertex?`,
            `简单图有 ${edges} 条边、${n} 个顶点。其中 ${n - 1} 个顶点的度是 $${others.join(", ")}$。最后一个顶点的度是多少？`,
          ),
          answer,
          form: "integer",
          mistakes: [
            why(edges, "That is the number of edges, not a degree.", "那是边数，不是度。"),
            why(
              edges - known,
              "That subtracts from the number of edges; the degrees add up to twice the edges.",
              "那是从边数中减；度数之和是边数的两倍。",
            ),
            why(answer + 1, "That is one too many: add the known degrees again.", "多了一：重新把已知的度相加。"),
            why(
              answer + 2,
              "That is two too many: each edge adds $1$ to each of its two ends, not $2$.",
              "多了二：每条边使两个端点的度各加 $1$，不是 $2$。",
            ),
          ].filter((x, i, all) => x.value !== answer && all.findIndex((o) => o.value === x.value) === i),
          solution: walked(
            [
              [
                ["Find the degree sum", "求度数之和"],
                t(`The degrees add up to $2 \\cdot ${edges} = ${2 * edges}$.`, `度数之和是 $2 \\cdot ${edges} = ${2 * edges}$。`),
              ],
              [
                ["Subtract the known degrees", "减去已知的度"],
                t(
                  `The others add up to ${known}, so the last degree is $${2 * edges} - ${known} = ${answer}$.`,
                  `其他顶点的度数之和是 ${known}，所以最后一个顶点的度是 $${2 * edges} - ${known} = ${answer}$。`,
                ),
              ],
            ],
            t(
              `$${[...others, answer].join(" + ")} = ${2 * edges}$, and $0 \\le ${answer} \\le ${n - 1}$, as a degree in a simple graph on ${n} vertices must be.`,
              `$${[...others, answer].join(" + ")} = ${2 * edges}$，且 $0 \\le ${answer} \\le ${n - 1}$，符合 ${n} 个顶点的简单图中度的范围。`,
            ),
          ),
        });
      },
    ),
  ],
  "the-hadamard-product": [
    skill(
      "the-hadamard-product-with-the-identity",
      ["The Hadamard product with the identity", "与单位矩阵的阿达马积"],
      [
        "The identity matrix is not the neutral element of the entrywise product, since its zeros erase every off-diagonal entry. So $A \\odot I$ keeps only the diagonal of $A$, and its entries add up to the trace.\n\nFor example, $A = \\begin{pmatrix} 2 & 5 \\\\ -1 & 4 \\end{pmatrix}$ gives $A \\odot I = \\begin{pmatrix} 2 & 0 \\\\ 0 & 4 \\end{pmatrix}$, whose entries add up to $6$.\n\nCheck: the trace of $A$ is $2 + 4 = 6$, and the erased entries $5$ and $-1$ make up the rest of the total $10$.\n\n> **Watch out.** $A \\odot I$ is not $A$, so the answer is not the sum $10$ of all the entries; and it is not the sum $2$ of the entries of $I$, since each $1$ of $I$ keeps an entry of $A$.",
        "单位矩阵不是逐元素乘积的中性元，因为它的零消去了所有非对角元素。所以 $A \\odot I$ 只保留 $A$ 的对角线，其元素之和等于迹。\n\n例如，$A = \\begin{pmatrix} 2 & 5 \\\\ -1 & 4 \\end{pmatrix}$ 给出 $A \\odot I = \\begin{pmatrix} 2 & 0 \\\\ 0 & 4 \\end{pmatrix}$，其元素之和为 $6$。\n\n检验：$A$ 的迹是 $2 + 4 = 6$，被消去的元素 $5$ 和 $-1$ 构成总和 $10$ 的其余部分。\n\n> **注意。** $A \\odot I$ 不是 $A$，所以答案不是全部元素之和 $10$；也不是 $I$ 的元素之和 $2$，因为 $I$ 中的每个 $1$ 保留的是 $A$ 的一个元素。",
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
        const rest = off.reduce((x, y) => x + y, 0);
        const all = trace + rest;
        return numberProblem({
          prompt: t(
            `Let $A = ${matrix}$. Find the sum of the entries of $A \\odot I$.`,
            `设 $A = ${matrix}$。求 $A \\odot I$ 所有元素的和。`,
          ),
          answer: trace,
          form: "integer",
          mistakes: [
            why(
              all,
              "That adds every entry of $A$, as if $A \\odot I = A$; the zeros of $I$ erase the off-diagonal entries.",
              "这是把 $A$ 的所有元素相加，好像 $A \\odot I = A$；$I$ 中的零会消去非对角元素。",
            ),
            why(
              3,
              "That is the sum of the entries of $I$; each $1$ of $I$ keeps the matching entry of $A$.",
              "这是 $I$ 的元素之和；$I$ 中的每个 $1$ 保留的是 $A$ 中对应的元素。",
            ),
            why(
              rest,
              "That adds the off-diagonal entries, which are the ones $I$ erases; the diagonal is what survives.",
              "这是把非对角元素相加，而它们正是被 $I$ 消去的；保留下来的是对角线。",
            ),
          ].filter((m, i, ms) => ms.findIndex((o) => o.value === m.value) === i),
          solution: walked(
            [
              [
                ["Multiply entry by entry", "逐元素相乘"],
                t(
                  `$I$ has $1$ on the diagonal and $0$ elsewhere, so $A \\odot I = ${mat([
                    [a[0] as number, 0, 0],
                    [0, a[1] as number, 0],
                    [0, 0, a[2] as number],
                  ])}$.`,
                  `$I$ 的对角线为 $1$，其余为 $0$，所以 $A \\odot I = ${mat([
                    [a[0] as number, 0, 0],
                    [0, a[1] as number, 0],
                    [0, 0, a[2] as number],
                  ])}$。`,
                ),
              ],
              [
                ["Add the entries", "把元素相加"],
                t(
                  `$${a[0]} + ${paren(a[1] as number)} + ${paren(a[2] as number)} = ${trace}$.`,
                  `$${a[0]} + ${paren(a[1] as number)} + ${paren(a[2] as number)} = ${trace}$。`,
                ),
              ],
            ],
            t(
              `The erased entries add up to $${rest}$, and $${trace} + ${paren(rest)} = ${all}$, the sum of all the entries of $A$.`,
              `被消去的元素之和是 $${rest}$，而 $${trace} + ${paren(rest)} = ${all}$，正是 $A$ 所有元素之和。`,
            ),
          ),
        });
      },
    ),
  ],
  "total-and-tensor-derivatives": [
    skill(
      "the-number-of-partial-derivatives",
      ["The number of partial derivatives", "偏导数的个数"],
      [
        "The derivative of a map between arrays holds one partial derivative for each pair of an output entry and an input entry. So its number of entries is the product of the two sizes, which is why it is a tensor.\n\nFor example, a map from $3 \\times 4$ matrices to $\\mathbb{R}^{5}$ has $12$ inputs and $5$ outputs, so its derivative has $5 \\times 12 = 60$ entries.\n\nCheck: arranged as an array of shape $5 \\times 3 \\times 4$, it holds $5 \\times 3 \\times 4 = 60$ entries again.\n\n> **Watch out.** Multiply the sizes, do not add them: $3 + 4 + 5 = 12$ counts nothing useful; and every one of the $12$ matrix entries is an input, not just one row or column of them.",
        "数组之间映射的导数，对每一对输出元素和输入元素都有一个偏导数。所以它的元素个数是两个大小的积，这就是它是张量的原因。\n\n例如，从 $3 \\times 4$ 矩阵到 $\\mathbb{R}^{5}$ 的映射有 $12$ 个输入、$5$ 个输出，所以它的导数有 $5 \\times 12 = 60$ 个元素。\n\n检验：把它排成形状为 $5 \\times 3 \\times 4$ 的数组，同样有 $5 \\times 3 \\times 4 = 60$ 个元素。\n\n> **注意。** 要把大小相乘，而不是相加：$3 + 4 + 5 = 12$ 没有意义；矩阵的 $12$ 个元素每一个都是输入，而不只是其中一行或一列。",
      ],
      (rng) => {
        const m = rng.int(2, 8);
        const n = rng.int(2, 8);
        const p = rng.int(2, 9);
        return numberProblem({
          prompt: t(
            `A map takes a matrix of size $${m} \\times ${n}$ to a vector in $\\mathbb{R}^{${p}}$. How many entries does its derivative have?`,
            `一个映射把 $${m} \\times ${n}$ 矩阵变成 $\\mathbb{R}^{${p}}$ 中的向量。它的导数有多少个元素？`,
          ),
          answer: m * n * p,
          form: "integer",
          mistakes: [
            why(
              m * n,
              `That counts the inputs only; each of the ${p} outputs has its own partial derivative for every input.`,
              `这只数了输入；${p} 个输出中的每一个对每个输入都有自己的偏导数。`,
            ),
            why(
              m + n + p,
              "That adds the sizes; one partial derivative for each output and input pair means multiplying them.",
              "这是把大小相加；每一对输出与输入各有一个偏导数，所以要相乘。",
            ),
            why(
              n * p,
              `That uses only ${n} inputs, one row of the matrix; all ${m * n} entries of the matrix are inputs.`,
              `这只用了 ${n} 个输入，即矩阵的一行；矩阵的全部 ${m * n} 个元素都是输入。`,
            ),
          ].filter((x, i, ms) => ms.findIndex((o) => o.value === x.value) === i),
          solution: walked(
            [
              [
                ["Count inputs and outputs", "数输入和输出"],
                t(
                  `The input matrix has $${m} \\times ${n} = ${m * n}$ entries, and the output has ${p} entries.`,
                  `输入矩阵有 $${m} \\times ${n} = ${m * n}$ 个元素，输出有 ${p} 个元素。`,
                ),
              ],
              [
                ["Multiply", "相乘"],
                t(
                  `Each output has a partial derivative for each input, so there are $${p} \\times ${m * n} = ${m * n * p}$ entries.`,
                  `每个输出对每个输入都有一个偏导数，所以共有 $${p} \\times ${m * n} = ${m * n * p}$ 个元素。`,
                ),
              ],
            ],
            t(
              `Arranged as an array of shape $${p} \\times ${m} \\times ${n}$, the derivative holds $${p} \\times ${m} \\times ${n} = ${m * n * p}$ entries.`,
              `排成形状为 $${p} \\times ${m} \\times ${n}$ 的数组，导数共有 $${p} \\times ${m} \\times ${n} = ${m * n * p}$ 个元素。`,
            ),
          ),
        });
      },
    ),
  ],
  "vector-gradients": [
    skill(
      "the-gradient-of-a-regularized-objective",
      ["The gradient of a regularized objective", "正则化目标的梯度"],
      [
        "Gradients add across a sum, so each part can be handled alone. The linear term $\\mathbf{a}^{T}\\mathbf{x}$ contributes $\\mathbf{a}$, and the penalty $k\\mathbf{x}^{T}\\mathbf{x}$ contributes $2k\\mathbf{x}$.\n\nFor example, with $\\mathbf{a} = (3, -1)$, $k = 2$ and $\\mathbf{x} = (1, 2)$, the gradient is $(3, -1) + 4(1, 2) = (7, 7)$.\n\nCheck: the part of $f$ that involves $x_1$ is $3x_1 + 2x_1^{2}$, whose derivative $3 + 4x_1$ is $7$ at $x_1 = 1$.\n\n> **Watch out.** The penalty $k\\mathbf{x}^{T}\\mathbf{x}$ gives $2k\\mathbf{x}$, not $k\\mathbf{x}$, because each $x_i^{2}$ has derivative $2x_i$; and the linear term still contributes $\\mathbf{a}$, with a plus sign.",
        "和的梯度等于梯度的和，所以每部分可以单独处理。线性项 $\\mathbf{a}^{T}\\mathbf{x}$ 贡献 $\\mathbf{a}$，惩罚项 $k\\mathbf{x}^{T}\\mathbf{x}$ 贡献 $2k\\mathbf{x}$。\n\n例如，$\\mathbf{a} = (3, -1)$、$k = 2$、$\\mathbf{x} = (1, 2)$ 时，梯度为 $(3, -1) + 4(1, 2) = (7, 7)$。\n\n检验：$f$ 中含 $x_1$ 的部分是 $3x_1 + 2x_1^{2}$，其导数 $3 + 4x_1$ 在 $x_1 = 1$ 处为 $7$。\n\n> **注意。** 惩罚项 $k\\mathbf{x}^{T}\\mathbf{x}$ 给出 $2k\\mathbf{x}$，而不是 $k\\mathbf{x}$，因为每个 $x_i^{2}$ 的导数是 $2x_i$；线性项仍贡献 $\\mathbf{a}$，符号为正。",
      ],
      (rng) => {
        const a = [nz(rng, 9), nz(rng, 9)] as const;
        const x = [nz(rng, 6), nz(rng, 6)] as const;
        const k = rng.int(2, 5);
        const right = vec(a[0] + 2 * k * x[0], a[1] + 2 * k * x[1]);
        const wrong = [
          vec(a[0] + k * x[0], a[1] + k * x[1]),
          vec(2 * k * x[0], 2 * k * x[1]),
          vec(a[0] - 2 * k * x[0], a[1] - 2 * k * x[1]),
        ];
        const filled: string[] = [];
        for (const w of wrong) if (w !== right && !filled.includes(w)) filled.push(w);
        for (let step = 1; filled.length < 3 && step < 30; step++) {
          const near = right.replace(/-?\d+/, (n) => String(Number(n) + step));
          if (near !== right && !filled.includes(near)) filled.push(near);
        }
        const nearby = filled
          .filter((o) => !wrong.includes(o))
          .map((o): [string, string, string] => [
            `$${o}$`,
            `This changes the first component; it is $${a[0]} + ${2 * k} \\times ${paren(x[0])} = ${a[0] + 2 * k * x[0]}$.`,
            `这改变了第一个分量；它应为 $${a[0]} + ${2 * k} \\times ${paren(x[0])} = ${a[0] + 2 * k * x[0]}$。`,
          ]);
        const solution = walked(
          [
            [
              ["Add the two gradients", "把两部分梯度相加"],
              t(
                `$\\nabla(\\mathbf{a}^{T}\\mathbf{x}) = \\mathbf{a}$ and $\\nabla(${k}\\mathbf{x}^{T}\\mathbf{x}) = ${2 * k}\\mathbf{x}$, so $\\nabla f = \\mathbf{a} + ${2 * k}\\mathbf{x}$.`,
                `$\\nabla(\\mathbf{a}^{T}\\mathbf{x}) = \\mathbf{a}$，$\\nabla(${k}\\mathbf{x}^{T}\\mathbf{x}) = ${2 * k}\\mathbf{x}$，所以 $\\nabla f = \\mathbf{a} + ${2 * k}\\mathbf{x}$。`,
              ),
            ],
            [
              ["Substitute the point", "代入该点"],
              t(
                `The components are $${a[0]} + ${2 * k} \\times ${paren(x[0])} = ${a[0] + 2 * k * x[0]}$ and $${a[1]} + ${2 * k} \\times ${paren(x[1])} = ${a[1] + 2 * k * x[1]}$.`,
                `各分量为 $${a[0]} + ${2 * k} \\times ${paren(x[0])} = ${a[0] + 2 * k * x[0]}$ 和 $${a[1]} + ${2 * k} \\times ${paren(x[1])} = ${a[1] + 2 * k * x[1]}$。`,
              ),
            ],
          ],
          t(
            `The part of $f$ that involves $x_1$ is $${term(a[0], "x_1")} + ${k}x_1^{2}$, whose derivative $${a[0]} + ${2 * k}x_1$ at $x_1 = ${x[0]}$ is $${a[0] + 2 * k * x[0]}$, the first component.`,
            `$f$ 中含 $x_1$ 的部分是 $${term(a[0], "x_1")} + ${k}x_1^{2}$，其导数 $${a[0]} + ${2 * k}x_1$ 在 $x_1 = ${x[0]}$ 处为 $${a[0] + 2 * k * x[0]}$，正是第一个分量。`,
          ),
        );
        return reasoned(
          chooseFilled(
            rng,
            [
              `Let $f(\\mathbf{x}) = \\mathbf{a}^{T}\\mathbf{x} + ${k}\\mathbf{x}^{T}\\mathbf{x}$ with $\\mathbf{a} = ${vec(...a)}$. Find $\\nabla f$ at $\\mathbf{x} = ${vec(...x)}$.`,
              `设 $f(\\mathbf{x}) = \\mathbf{a}^{T}\\mathbf{x} + ${k}\\mathbf{x}^{T}\\mathbf{x}$，$\\mathbf{a} = ${vec(...a)}$。求 $\\mathbf{x} = ${vec(...x)}$ 处的 $\\nabla f$。`,
            ],
            right,
            wrong,
            [solution.en, solution["zh-CN"]],
          ),
          [
            [
              `$${wrong[0]}$`,
              `This is $\\mathbf{a} + ${k}\\mathbf{x}$; the penalty contributes $2k\\mathbf{x} = ${2 * k}\\mathbf{x}$, since each $x_i^{2}$ has derivative $2x_i$.`,
              `这是 $\\mathbf{a} + ${k}\\mathbf{x}$；惩罚项贡献 $2k\\mathbf{x} = ${2 * k}\\mathbf{x}$，因为每个 $x_i^{2}$ 的导数是 $2x_i$。`,
            ],
            [
              `$${wrong[1]}$`,
              "This is the gradient of the penalty alone; the linear term adds $\\mathbf{a}$.",
              "这只是惩罚项的梯度；线性项还要加上 $\\mathbf{a}$。",
            ],
            [
              `$${wrong[2]}$`,
              `This subtracts $${2 * k}\\mathbf{x}$; the penalty is added in $f$, so its gradient is added too.`,
              `这是减去了 $${2 * k}\\mathbf{x}$；惩罚项在 $f$ 中是加上的，所以它的梯度也要加上。`,
            ],
            ...nearby,
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
        "Entry $(i, j)$ of the $k$th power of an adjacency matrix counts the walks of length $k$ from $i$ to $j$. So walks of length three come from multiplying the matrix by itself twice. For the matrix $\\begin{pmatrix} 0 & 1 \\\\ 1 & 1 \\end{pmatrix}$ on $A, B$, the square is $\\begin{pmatrix} 1 & 1 \\\\ 1 & 2 \\end{pmatrix}$ and the cube is $\\begin{pmatrix} 1 & 2 \\\\ 2 & 3 \\end{pmatrix}$, so $2$ walks of length 3 go from $A$ to $B$.\n\n> **Watch out.** The square counts walks of length 2 and the matrix itself walks of length 1; and the rows give the starting vertex, so do not read the entry from $j$ to $i$ instead.",
        "邻接矩阵 $k$ 次幂的 $(i, j)$ 元素，就是从 $i$ 到 $j$ 长度为 $k$ 的路线数。所以长度为 3 的路线数由矩阵自乘两次得到。对 $A, B$ 上的矩阵 $\\begin{pmatrix} 0 & 1 \\\\ 1 & 1 \\end{pmatrix}$，平方为 $\\begin{pmatrix} 1 & 1 \\\\ 1 & 2 \\end{pmatrix}$，立方为 $\\begin{pmatrix} 1 & 2 \\\\ 2 & 3 \\end{pmatrix}$，所以从 $A$ 到 $B$ 长度为 3 的路线有 $2$ 条。\n\n> **注意。** 平方数的是长度为 2 的路线，矩阵本身数的是长度为 1 的路线；而且行表示起点，不要读成从 $j$ 到 $i$ 的元素。",
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
        const cube = mul(squared, m);
        const rowOfMatrix = m[i] as number[];
        const columnOfSquare = squared.map((row) => row[j] as number);
        const picked = (values: number[], ones: number[]) => {
          const kept = [0, 1, 2].filter((k) => ones[k] === 1).map((k) => values[k] as number);
          return kept.length === 1 ? `${answer}` : `${kept.join(" + ")} = ${answer}`;
        };
        const onesIn = (ones: number[]) =>
          [0, 1, 2]
            .filter((k) => ones[k] === 1)
            .map((k) => `$${names[k]}$`)
            .join(", ");
        return numberProblem({
          prompt: t(
            `A directed graph on $A, B, C$ has adjacency matrix $${mat(m)}$. How many walks of length 3 go from $${names[i]}$ to $${names[j]}$?`,
            `顶点为 $A, B, C$ 的有向图的邻接矩阵是 $${mat(m)}$。从 $${names[i]}$ 到 $${names[j]}$ 长度为 3 的路线有多少条？`,
          ),
          answer,
          form: "integer",
          mistakes: [
            why(square, "That is the entry of the square, which counts walks of length 2.", "那是平方的元素，数的是长度为 2 的路线。"),
            why(
              rowOfMatrix[j] as number,
              "That is the entry of the matrix itself, which counts walks of length 1.",
              "那是矩阵本身的元素，数的是长度为 1 的路线。",
            ),
            why(
              (cube[j] as number[])[i] as number,
              `That counts the walks from $${names[j]}$ to $${names[i]}$; the row gives the start.`,
              `那是数了从 $${names[j]}$ 到 $${names[i]}$ 的路线；行表示起点。`,
            ),
            why(answer + 1, "That is one too many: multiply the row by the column again.", "多了一：重新用行乘以列。"),
            why(answer + 2, "That is two too many: multiply the row by the column again.", "多了二：重新用行乘以列。"),
          ].filter((x, k, all) => x.value !== answer && all.findIndex((o) => o.value === x.value) === k),
          solution: walked(
            [
              [
                ["Square the matrix", "求矩阵的平方"],
                t(
                  `Row $${names[i]}$ of the matrix squared is $(${rowOfSquare.join(", ")})$, the walks of length 2 from $${names[i]}$.`,
                  `矩阵平方的 $${names[i]}$ 行是 $(${rowOfSquare.join(", ")})$，即从 $${names[i]}$ 出发长度为 2 的路线数。`,
                ),
              ],
              [
                [`Multiply by column $${names[j]}$`, `乘以 $${names[j]}$ 列`],
                t(
                  `Column $${names[j]}$ of the matrix is $(${column.join(", ")})$, with $1$s in the rows of ${onesIn(column)}, so add those entries of the row: $${picked(rowOfSquare, column)}$.`,
                  `矩阵的 $${names[j]}$ 列是 $(${column.join(", ")})$，在 ${onesIn(column)} 所在的行为 $1$，所以把行中这些位置的元素相加：$${picked(rowOfSquare, column)}$。`,
                ),
              ],
            ],
            t(
              `Grouping the other way, row $${names[i]}$ of the matrix is $(${rowOfMatrix.join(", ")})$ and column $${names[j]}$ of the square is $(${columnOfSquare.join(", ")})$; adding the entries where the row has $1$s gives $${picked(columnOfSquare, rowOfMatrix)}$ again.`,
              `换一种结合方式：矩阵的 $${names[i]}$ 行是 $(${rowOfMatrix.join(", ")})$，平方的 $${names[j]}$ 列是 $(${columnOfSquare.join(", ")})$；把行中为 $1$ 的位置对应的元素相加，同样得到 $${picked(columnOfSquare, rowOfMatrix)}$。`,
            ),
          ),
        });
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
