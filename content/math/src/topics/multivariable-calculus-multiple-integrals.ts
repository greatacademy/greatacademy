import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { paren, poly, Q } from "@ga/subject-math";
import { multivariableDrawings3 } from "../explanation-drawings-multivariable-3.ts";
import { multivariableDrawings4 } from "../explanation-drawings-multivariable-4.ts";
import { multivariableDrawings5 } from "../explanation-drawings-multivariable-5.ts";
import { explainedChoice, numberProblem, why } from "../problems.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** asQ turns a number into a rational number so that values can be compared. */
const asQ = (c: number | Q): Q => (typeof c === "number" ? Q.of(c) : c);

/** distinct drops the mistakes whose value is the answer or repeats an earlier one. */
function distinct<M extends { readonly value: number | Q }>(answer: number | Q, mistakes: readonly M[]): M[] {
  return mistakes.filter((m, i, all) => !asQ(m.value).eq(asQ(answer)) && all.findIndex((x) => asQ(x.value).eq(asQ(m.value))) === i);
}

/** coef writes a coefficient in front of a term, leaving out a 1. */
const coef = (n: number): string => (n === 1 ? "" : n === -1 ? "-" : `${n}`);

/** Pythagorean triples for clean coordinates. */
const pythagoreanTriples = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [6, 8, 10],
  [9, 12, 15],
  [12, 16, 20],
  [15, 20, 25],
] as const;

// ---------------------------------------------------------------------------
// 3.13 Riemann Sums
// ---------------------------------------------------------------------------

/** doubleSummations evaluates nested discrete summations. */
export const doubleSummations: TopicDef = {
  id: "double-summations",
  title: t("Double Summations", "二重求和"),
  summary: t(
    "Double summations sum terms over two index variables, evaluating the inner sum first or splitting when separable.",
    "二重求和对两个指标变量上的项求和，先计算内层求和，或在可分离时拆分计算。",
  ),
  intro: t(
    "Evaluate $\\sum_{i=1}^{3}\\sum_{j=1}^{4} (5i - j)$ from the inside out. For a fixed $i$ the inner sum has four terms: $\\sum_{j=1}^{4} (5i - j) = 20i - 10$. The outer sum then gives $\\sum_{i=1}^{3} (20i - 10) = 20 \\cdot 6 - 30 = 90$.\n\nCheck: split the summand instead. The term $5i$ is added once for each of the $4$ values of $j$, and the term $j$ once for each of the $3$ values of $i$: $5 \\cdot 4 \\cdot 6 - 3 \\cdot 10 = 120 - 30 = 90$.\n\nIn this lesson we evaluate double sums, splitting them into single sums when the summand separates and working from the inside out when it does not.",
    "由内向外计算 $\\sum_{i=1}^{3}\\sum_{j=1}^{4} (5i - j)$。固定 $i$ 时，内层和有四项：$\\sum_{j=1}^{4} (5i - j) = 20i - 10$。外层和于是给出 $\\sum_{i=1}^{3} (20i - 10) = 20 \\cdot 6 - 30 = 90$。\n\n检验：改为拆开被加项。$5i$ 这一项对 $j$ 的 $4$ 个取值各加一次，$j$ 这一项对 $i$ 的 $3$ 个取值各加一次：$5 \\cdot 4 \\cdot 6 - 3 \\cdot 10 = 120 - 30 = 90$。\n\n本课我们计算二重和：被加项可分离时拆成单重和，不可分离时由内向外计算。",
  ),
  prerequisites: ["left-and-right-riemann-sums-in-sigma-notation"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-separable-double-summations",
      title: t("Evaluating separable double summations", "计算可分离的二重求和"),
      explanation: t(
        "When the summand is a sum of a term depending on one index and a term depending on the other, each part can be summed on its own. For a linear summand $\\sum_{i=1}^m \\sum_{j=1}^n (ai + bj)$, sum each term independently using $\\sum_{k=1}^N k = \\frac{N(N+1)}{2}$:\n\n$$\\sum_{i=1}^m \\sum_{j=1}^n (ai + bj) = a n \\frac{m(m+1)}{2} + b m \\frac{n(n+1)}{2}.$$\n\nFor $\\sum_{i=1}^{2}\\sum_{j=1}^{3} (6i + j)$ this gives $6 \\cdot 3 \\cdot 3 + 1 \\cdot 2 \\cdot 6 = 54 + 12 = 66$.\n\n> **Watch out.** The term $ai$ does not depend on $j$, so it is added once for every value of $j$: multiply $\\sum i$ by $n$, the number of values of the other index, not by $m$.",
        "当被加项是只依赖于一个下标的项与只依赖于另一个下标的项之和时，每一部分可以分别求和。对于线性求和项 $\\sum_{i=1}^m \\sum_{j=1}^n (ai + bj)$，利用 $\\sum_{k=1}^N k = \\frac{N(N+1)}{2}$ 独立求和：\n\n$$\\sum_{i=1}^m \\sum_{j=1}^n (ai + bj) = a n \\frac{m(m+1)}{2} + b m \\frac{n(n+1)}{2}$$\n\n对 $\\sum_{i=1}^{2}\\sum_{j=1}^{3} (6i + j)$，得 $6 \\cdot 3 \\cdot 3 + 1 \\cdot 2 \\cdot 6 = 54 + 12 = 66$。\n\n> **注意。** $ai$ 这一项与 $j$ 无关，所以对 $j$ 的每个取值都加一次：$\\sum i$ 要乘以另一个下标的取值个数 $n$，而不是 $m$。",
      ),
      generate(rng: Rng): Problem {
        const m = rng.int(2, 6);
        const n = rng.int(2, 6);
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-4, 4);
        const sumI = (m * (m + 1)) / 2;
        const sumJ = (n * (n + 1)) / 2;
        const ans = a * n * sumI + b * m * sumJ;
        const term = poly([a, "i"], [b, "j"]);
        const average = Q.of(a * (m + 1), 2).add(Q.of(b * (n + 1), 2));
        return numberProblem({
          prompt: t(
            `Evaluate the double sum $\\sum_{i=1}^{${m}} \\sum_{j=1}^{${n}} (${term})$.`,
            `计算二重求和 $\\sum_{i=1}^{${m}} \\sum_{j=1}^{${n}} (${term})$ 的值。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              a * sumI + b * sumJ,
              `That adds each single sum once. The term $${poly([a, "i"])}$ is added for each of the $${n}$ values of $j$, and $${poly([b, "j"])}$ for each of the $${m}$ values of $i$.`,
              `那是每个单重和只加了一次。$${poly([a, "i"])}$ 对 $j$ 的 $${n}$ 个取值各加一次，$${poly([b, "j"])}$ 对 $i$ 的 $${m}$ 个取值各加一次。`,
            ),
            why(
              a * m * sumI + b * n * sumJ,
              `The counts are swapped: $\\sum i$ is multiplied by the number of values of $j$, which is $${n}$, not $${m}$.`,
              `个数配错了：$\\sum i$ 要乘以 $j$ 的取值个数 $${n}$，而不是 $${m}$。`,
            ),
            why(
              (a * n * m * (m - 1)) / 2 + (b * m * n * (n - 1)) / 2,
              "That sums each index from $0$ to one less than its limit; both indices start at $1$.",
              "那是让每个下标从 $0$ 加到上限减一；两个下标都从 $1$ 开始。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Split the summand", "拆开被加项"],
                t(
                  `$${a}i$ does not depend on $j$ and $${b}j$ does not depend on $i$, so the sum is $${a} \\cdot ${n}\\sum_{i=1}^{${m}} i + ${paren(b)} \\cdot ${m}\\sum_{j=1}^{${n}} j$.`,
                  `$${a}i$ 与 $j$ 无关，$${b}j$ 与 $i$ 无关，所以和为 $${a} \\cdot ${n}\\sum_{i=1}^{${m}} i + ${paren(b)} \\cdot ${m}\\sum_{j=1}^{${n}} j$。`,
                ),
              ],
              [
                ["Evaluate the single sums", "计算单重和"],
                t(
                  `$\\sum_{i=1}^{${m}} i = \\frac{${m} \\cdot ${m + 1}}{2} = ${sumI}$ and $\\sum_{j=1}^{${n}} j = \\frac{${n} \\cdot ${n + 1}}{2} = ${sumJ}$.`,
                  `$\\sum_{i=1}^{${m}} i = \\frac{${m} \\cdot ${m + 1}}{2} = ${sumI}$，$\\sum_{j=1}^{${n}} j = \\frac{${n} \\cdot ${n + 1}}{2} = ${sumJ}$。`,
                ),
              ],
              [
                ["Combine", "合并"],
                t(
                  `$${a} \\cdot ${n} \\cdot ${sumI} + ${paren(b)} \\cdot ${m} \\cdot ${sumJ} = ${a * n * sumI} + ${paren(b * m * sumJ)} = ${ans}$.`,
                  `$${a} \\cdot ${n} \\cdot ${sumI} + ${paren(b)} \\cdot ${m} \\cdot ${sumJ} = ${a * n * sumI} + ${paren(b * m * sumJ)} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `There are $${m * n}$ terms, and their average is the summand at the average indices $i = ${Q.of(m + 1, 2).toLatex()}$, $j = ${Q.of(n + 1, 2).toLatex()}$, namely $${average.toLatex()}$. Then $${m * n} \\cdot ${paren(average)} = ${ans}$.`,
              `共有 $${m * n}$ 项，它们的平均值是被加项在平均下标 $i = ${Q.of(m + 1, 2).toLatex()}$，$j = ${Q.of(n + 1, 2).toLatex()}$ 处的值，即 $${average.toLatex()}$。于是 $${m * n} \\cdot ${paren(average)} = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "separable-double-sums-of-products",
      title: t("Separable double sums of products", "可分离的乘积型二重求和"),
      explanation: t(
        "When the summand is a product of a factor depending only on $i$ and a factor depending only on $j$, the double sum splits into a product of two single sums:\n\n$$\\sum_{i=1}^{m}\\sum_{j=1}^{n} c\\,ij = c\\left(\\sum_{i=1}^{m} i\\right)\\left(\\sum_{j=1}^{n} j\\right) = c \\cdot \\frac{m(m+1)}{2} \\cdot \\frac{n(n+1)}{2}.$$\n\nThis works because the inner sum treats $i$ as a constant that can be pulled out. For $\\sum_{i=1}^{3}\\sum_{j=1}^{7} 2ij$ the single sums are $6$ and $28$, so the total is $2 \\cdot 6 \\cdot 28 = 336$.\n\n> **Watch out.** A product separates into a product of sums, not a sum of sums. And $\\sum_{j} j$ adds the values $1, 2, \\dots, n$; it is not the number of terms $n$.",
        "当被加项是只依赖 $i$ 的因子与只依赖 $j$ 的因子之积时，二重求和可拆成两个单重求和之积：\n\n$$\\sum_{i=1}^{m}\\sum_{j=1}^{n} c\\,ij = c\\left(\\sum_{i=1}^{m} i\\right)\\left(\\sum_{j=1}^{n} j\\right) = c \\cdot \\frac{m(m+1)}{2} \\cdot \\frac{n(n+1)}{2}$$\n\n这是因为内层求和把 $i$ 当作常数，可以提出。对 $\\sum_{i=1}^{3}\\sum_{j=1}^{7} 2ij$，两个单重和是 $6$ 和 $28$，所以总和是 $2 \\cdot 6 \\cdot 28 = 336$。\n\n> **注意。** 乘积拆成的是和的乘积，而不是和的和。$\\sum_{j} j$ 把 $1, 2, \\dots, n$ 这些值相加，它不是项数 $n$。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(1, 5);
        const m = rng.int(2, 6);
        const n = rng.int(2, 6);
        const si = (m * (m + 1)) / 2;
        const sj = (n * (n + 1)) / 2;
        const ans = c * si * sj;
        const term = `${coef(c)}ij`;
        const lead = c === 1 ? "" : `${c} \\cdot `;
        return numberProblem({
          prompt: t(`Evaluate $\\sum_{i=1}^{${m}} \\sum_{j=1}^{${n}} ${term}$.`, `计算 $\\sum_{i=1}^{${m}} \\sum_{j=1}^{${n}} ${term}$。`),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              c * (si + sj),
              "That adds the two single sums; a product $ij$ separates into the product of the sums.",
              "那是把两个单重和相加；乘积 $ij$ 拆成的是两个和的乘积。",
            ),
            why(
              c * si * n,
              `That counts the $${n}$ values of $j$ instead of adding them: $\\sum_{j=1}^{${n}} j = ${sj}$.`,
              `那是数了 $j$ 的 $${n}$ 个取值，而不是把它们相加：$\\sum_{j=1}^{${n}} j = ${sj}$。`,
            ),
            why(
              c * m * sj,
              `That counts the $${m}$ values of $i$ instead of adding them: $\\sum_{i=1}^{${m}} i = ${si}$.`,
              `那是数了 $i$ 的 $${m}$ 个取值，而不是把它们相加：$\\sum_{i=1}^{${m}} i = ${si}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Separate the sum", "分离求和"],
                t(
                  `For a fixed $i$ the inner sum is $${coef(c)}i\\sum_{j=1}^{${n}} j$, so the whole sum is $${lead}\\left(\\sum_{i=1}^{${m}} i\\right)\\left(\\sum_{j=1}^{${n}} j\\right)$.`,
                  `固定 $i$ 时，内层和为 $${coef(c)}i\\sum_{j=1}^{${n}} j$，所以整个和为 $${lead}\\left(\\sum_{i=1}^{${m}} i\\right)\\left(\\sum_{j=1}^{${n}} j\\right)$。`,
                ),
              ],
              [["Multiply", "相乘"], t(`$${lead}${si} \\cdot ${sj} = ${ans}$.`, `$${lead}${si} \\cdot ${sj} = ${ans}$。`)],
            ],
            t(
              `The $${m * n}$ products $ij$ average $${Q.of(m + 1, 2).toLatex()} \\cdot ${Q.of(n + 1, 2).toLatex()}$, and $${lead}${m * n} \\cdot ${Q.of((m + 1) * (n + 1), 4).toLatex()} = ${ans}$.`,
              `$${m * n}$ 个乘积 $ij$ 的平均值是 $${Q.of(m + 1, 2).toLatex()} \\cdot ${Q.of(n + 1, 2).toLatex()}$，而 $${lead}${m * n} \\cdot ${Q.of((m + 1) * (n + 1), 4).toLatex()} = ${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** partitionsOfIntervals covers partitions and mesh norms. */
export const partitionsOfIntervals: TopicDef = {
  id: "partitions-of-intervals",
  title: t("Partitions of Intervals", "区间的分割与网格模"),
  summary: t(
    "A partition P of [a, b] divides the interval into subintervals; the norm ||P|| is the maximum subinterval width.",
    "区间 [a, b] 的分割 P 将区间划分为子区间；分割的模 ||P|| 是各子区间宽度的最大值。",
  ),
  intro: t(
    "Cut $[2, 9]$ into $7$ equal pieces: each has width $\\frac{9 - 2}{7} = 1$, so the norm is $\\|P\\| = 1$. Now use the cut points $P = \\{2, 3, 6, 9\\}$ instead. The widths are $1, 3, 3$, and the norm is the largest of them, $\\|P\\| = 3$.\n\nCheck: the widths of any partition add up to the length of the interval, and $1 + 3 + 3 = 7 = 9 - 2$.\n\nIn this lesson we find the widths of the pieces of a partition and its norm, the width of the widest piece.",
    "把 $[2, 9]$ 切成 $7$ 个相等的小段：每段宽 $\\frac{9 - 2}{7} = 1$，所以模为 $\\|P\\| = 1$。改用分点 $P = \\{2, 3, 6, 9\\}$。各段宽度为 $1, 3, 3$，模是其中最大的，$\\|P\\| = 3$。\n\n检验：任何分割的各段宽度之和都等于区间长度，而 $1 + 3 + 3 = 7 = 9 - 2$。\n\n本课我们求分割各小段的宽度以及分割的模，即最宽小段的宽度。",
  ),
  prerequisites: ["double-summations"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "mesh-of-regular-interval-partitions",
      title: t("Mesh of regular interval partitions", "等距区间分割的网格模"),
      explanation: t(
        "The mesh of a partition is the width of its widest piece, so for equal pieces it is simply the length of the interval divided by the number of pieces. A regular partition of $[a, b]$ into $n$ subintervals has equal widths $\\Delta x = \\frac{b - a}{n}$. The norm (or mesh) is $\\|P\\| = \\Delta x$. For $[-1, 5]$ cut into $3$ pieces, $\\|P\\| = \\frac{5 - (-1)}{3} = 2$.\n\n> **Watch out.** Subtract a negative left end carefully: $5 - (-1) = 6$, not $4$. And divide by the number of pieces $n$, not by the $n + 1$ cut points.",
        "分割的细度是最宽小段的宽度，所以对于等分的情形，它就是区间长度除以段数。将区间 $[a, b]$ 进行 $n$ 等分所得的等距分割，各子区间宽度均为 $\\Delta x = \\frac{b - a}{n}$。分割的模（网格模）即为 $\\|P\\| = \\Delta x$。把 $[-1, 5]$ 切成 $3$ 段，$\\|P\\| = \\frac{5 - (-1)}{3} = 2$。\n\n> **注意。** 左端点为负时要小心减法：$5 - (-1) = 6$，不是 $4$。要除以段数 $n$，而不是 $n + 1$ 个分点。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-5, 5);
        const L = rng.int(2, 20);
        const b = a + L;
        const n = rng.pick([2, 4, 5, 8, 10]);
        const ans = Q.of(L, n);
        return numberProblem({
          prompt: t(
            `Find the norm $\\|P\\|$ of a regular partition $P$ dividing the interval $[${a}, ${b}]$ into ${n} equal subintervals.`,
            `求将区间 $[${a}, ${b}]$ 均分为 ${n} 个子区间的等距分割 $P$ 的模 $\\|P\\|$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(L),
              `That is the length of the whole interval; divide it among the $${n}$ pieces.`,
              `那是整个区间的长度；要把它平分给 $${n}$ 段。`,
            ),
            why(
              Q.of(L, n + 1),
              `That divides by the $${n + 1}$ cut points; there are $${n}$ pieces between them.`,
              `那是除以 $${n + 1}$ 个分点；它们之间只有 $${n}$ 段。`,
            ),
            ...(a < 0
              ? [
                  why(
                    Q.of(b + a, n),
                    `The sign of the left end was lost: $${b} - (${a}) = ${L}$, not $${b + a}$.`,
                    `左端点的符号丢了：$${b} - (${a}) = ${L}$，不是 $${b + a}$。`,
                  ),
                ]
              : []),
          ]),
          solution: walked(
            [
              [["Find the length", "求长度"], t(`$b - a = ${b} - ${paren(a)} = ${L}$.`, `$b - a = ${b} - ${paren(a)} = ${L}$。`)],
              [
                ["Divide among the pieces", "平分给各段"],
                t(
                  `Each of the $${n}$ pieces has width $\\frac{${L}}{${n}} = ${ans.toLatex()}$, so $\\|P\\| = ${ans.toLatex()}$.`,
                  `$${n}$ 段中每段的宽度为 $\\frac{${L}}{${n}} = ${ans.toLatex()}$，所以 $\\|P\\| = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `$${n}$ pieces of width $${ans.toLatex()}$ starting at $${a}$ end at $${a} + ${n} \\cdot ${paren(ans)} = ${b}$, the right end.`,
              `从 $${a}$ 出发，$${n}$ 段宽为 $${ans.toLatex()}$ 的小段终止于 $${a} + ${n} \\cdot ${paren(ans)} = ${b}$，正是右端点。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-norm-of-an-irregular-partition",
      title: t("The norm of an irregular partition", "非等分划分的范数"),
      explanation: t(
        "A partition $P = \\{x_0, x_1, \\dots, x_n\\}$ of $[a, b]$ need not have equal pieces. Its norm $\\|P\\|$ is the length of the longest subinterval, $\\max_i (x_i - x_{i-1})$. Refining a partition can only keep or shrink the norm, and $\\|P\\| \\to 0$ is what makes Riemann sums converge to the integral. For $P = \\{0, 2, \\frac{5}{2}, 6\\}$ the widths are $2, \\frac{1}{2}, \\frac{7}{2}$, so $\\|P\\| = \\frac{7}{2}$.\n\n> **Watch out.** The norm is a width, the difference of neighboring points. It is not the largest point, not the smallest width, and not the average width.",
        "区间 $[a, b]$ 的划分 $P = \\{x_0, x_1, \\dots, x_n\\}$ 不必等分。它的范数 $\\|P\\|$ 是最长子区间的长度 $\\max_i (x_i - x_{i-1})$。加细划分只会使范数保持或变小，而 $\\|P\\| \\to 0$ 正是黎曼和收敛到积分的条件。对 $P = \\{0, 2, \\frac{5}{2}, 6\\}$，各段宽度为 $2, \\frac{1}{2}, \\frac{7}{2}$，所以 $\\|P\\| = \\frac{7}{2}$。\n\n> **注意。** 范数是一个宽度，即相邻两点之差。它不是最大的分点，不是最小的宽度，也不是平均宽度。",
      ),
      generate(rng: Rng): Problem {
        const start = rng.int(-4, 3);
        const gaps = Array.from({ length: rng.int(3, 5) }, () => rng.pick([1, 2, 3, 4, 5].map((g) => g / 2)));
        const pts = [start];
        for (const g of gaps) pts.push(pts[pts.length - 1]! + g);
        const end = pts[pts.length - 1]!;
        const half = (x: number) => Q.of(Math.round(x * 2), 2);
        const fmt = (x: number) => half(x).toLatex();
        const max = Math.max(...gaps);
        const min = Math.min(...gaps);
        const total = end - start;
        const answer = half(max);
        return numberProblem({
          prompt: t(
            `Find the norm $\\|P\\|$ of the partition $P = \\{${pts.map(fmt).join(", ")}\\}$ of $[${fmt(start)}, ${fmt(end)}]$.`,
            `求区间 $[${fmt(start)}, ${fmt(end)}]$ 的划分 $P = \\{${pts.map(fmt).join(", ")}\\}$ 的范数 $\\|P\\|$。`,
          ),
          answer,
          mistakes: distinct(answer, [
            why(half(min), "That is the shortest subinterval; the norm is the longest one.", "那是最短的子区间；范数是最长的子区间。"),
            why(
              Q.of(Math.round(total * 2), 2 * gaps.length),
              "That is the average width, which is the norm only when all pieces are equal.",
              "那是平均宽度，只有各段相等时它才是范数。",
            ),
            why(
              half(end),
              "That is the largest cut point; the norm is a width, the difference of neighboring points.",
              "那是最大的分点；范数是宽度，即相邻分点之差。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Subtract neighboring points", "相邻分点相减"],
                t(`The subinterval lengths are $${gaps.map(fmt).join(", ")}$.`, `各子区间长度为 $${gaps.map(fmt).join(", ")}$。`),
              ],
              [
                ["Take the largest", "取最大值"],
                t(`The longest is $${fmt(max)}$, so $\\|P\\| = ${fmt(max)}$.`, `最长的是 $${fmt(max)}$，所以 $\\|P\\| = ${fmt(max)}$。`),
              ],
            ],
            t(
              `The lengths add up to $${half(total).toLatex()} = ${fmt(end)} - ${paren(half(start))}$, the length of the interval, and none of them exceeds $${fmt(max)}$.`,
              `各长度之和为 $${half(total).toLatex()} = ${fmt(end)} - ${paren(half(start))}$，正是区间长度，且没有一个超过 $${fmt(max)}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** calculatingDoubleSummationsOverPartitions computes areas of subrectangles. */
export const calculatingDoubleSummationsOverPartitions: TopicDef = {
  id: "calculating-double-summations-over-partitions",
  title: t("Calculating Double Summations Over Partitions", "在网格分割上计算二重求和"),
  summary: t(
    "A partition of a rectangle R = [a, b] × [c, d] creates subrectangles with area ΔA = Δx Δy.",
    "矩形 R = [a, b] × [c, d] 的分割形成多个子矩形，其面积微元为 ΔA = Δx Δy。",
  ),
  intro: t(
    "Divide $R = [0, 12] \\times [1, 3]$ into $4$ pieces in $x$ and $2$ in $y$. Each subrectangle is $\\Delta x = 3$ wide and $\\Delta y = 1$ tall, so $\\Delta A = 3$. A Riemann sum adds $f(x_i^*, y_j^*)\\,\\Delta A$ over all $8$ subrectangles; for the constant $f = 1$ it is $8 \\cdot 3 = 24$.\n\nCheck: a constant $1$ must give the area of $R$, and $R$ has area $12 \\cdot 2 = 24$.\n\nIn this lesson we find the area of the subrectangles of a grid and add up double Riemann sums over them.",
    "把 $R = [0, 12] \\times [1, 3]$ 在 $x$ 方向分成 $4$ 段，在 $y$ 方向分成 $2$ 段。每个子矩形宽 $\\Delta x = 3$，高 $\\Delta y = 1$，所以 $\\Delta A = 3$。黎曼和对全部 $8$ 个子矩形累加 $f(x_i^*, y_j^*)\\,\\Delta A$；对常数 $f = 1$，它等于 $8 \\cdot 3 = 24$。\n\n检验：常数 $1$ 必须给出 $R$ 的面积，而 $R$ 的面积是 $12 \\cdot 2 = 24$。\n\n本课我们求网格中子矩形的面积，并在其上累加二重黎曼和。",
  ),
  prerequisites: ["partitions-of-intervals"],
  encompasses: [{ topic: "partitions-of-intervals", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "area-of-subrectangles-in-grid-partitions",
      figure: multivariableDrawings3["calculating-double-summations-over-partitions#area-of-subrectangles-in-grid-partitions"],
      title: t("Area of subrectangles in grid partitions", "网格分割中子矩形的面积"),
      explanation: t(
        "Each small rectangle has the width of one horizontal piece and the height of one vertical piece, so its area is their product. For $R = [a, b] \\times [c, d]$ partitioned by $m$ divisions in $x$ and $n$ divisions in $y$, each subrectangle has area:\n\n$$\\Delta A = \\Delta x \\Delta y = \\left(\\frac{b - a}{m}\\right)\\left(\\frac{d - c}{n}\\right).$$\n\nFor $[1, 13] \\times [0, 2]$ with $6$ pieces in $x$ and $4$ in $y$, $\\Delta A = 2 \\cdot \\frac{1}{2} = 1$.\n\n> **Watch out.** Divide each side by its own number of pieces and multiply the results. Dividing the whole area by $m + n$ is wrong: there are $mn$ subrectangles.",
        "每个小矩形的宽是一个水平小段的宽度，高是一个竖直小段的长度，所以面积是两者的乘积。对于被 $x$ 方向 $m$ 等分、$y$ 方向 $n$ 等分的矩形 $R = [a, b] \\times [c, d]$，每个子矩形的面积为：\n\n$$\\Delta A = \\Delta x \\Delta y = \\left(\\frac{b - a}{m}\\right)\\left(\\frac{d - c}{n}\\right)$$\n\n对 $[1, 13] \\times [0, 2]$，$x$ 方向 $6$ 段，$y$ 方向 $4$ 段，$\\Delta A = 2 \\cdot \\frac{1}{2} = 1$。\n\n> **注意。** 每条边除以它自己的段数，再把结果相乘。用总面积除以 $m + n$ 是错的：子矩形共有 $mn$ 个。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(0, 4);
        const Lx = rng.int(2, 10);
        const b = a + Lx;
        const c = rng.int(0, 4);
        const Ly = rng.int(2, 10);
        const d = c + Ly;
        const m = rng.int(2, 5);
        const n = rng.int(2, 5);
        const ans = Q.of(Lx * Ly, m * n);
        return numberProblem({
          prompt: t(
            `A rectangle $R = [${a}, ${b}] \\times [${c}, ${d}]$ is divided into regular subrectangles by partitioning $[${a}, ${b}]$ into ${m} subintervals and $[${c}, ${d}]$ into ${n} subintervals. Find the area $\\Delta A$ of each subrectangle.`,
            `矩形 $R = [${a}, ${b}] \\times [${c}, ${d}]$ 通过将 $[${a}, ${b}]$ 均分为 ${m} 个子区间并将 $[${c}, ${d}]$ 均分为 ${n} 个子区间划分为等距子矩形。求每个子矩形的面积 $\\Delta A$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(Lx * Ly),
              `That is the area of all of $R$; it is shared by $${m * n}$ subrectangles.`,
              `那是整个 $R$ 的面积；它由 $${m * n}$ 个子矩形分摊。`,
            ),
            why(
              Q.of(Lx * Ly, m + n),
              `That divides by $${m} + ${n}$; there are $${m} \\cdot ${n} = ${m * n}$ subrectangles.`,
              `那是除以 $${m} + ${n}$；子矩形共有 $${m} \\cdot ${n} = ${m * n}$ 个。`,
            ),
            why(
              Q.of(Lx + Ly, m + n),
              "That adds the sides instead of multiplying the widths of a piece in each direction.",
              "那是把边长相加，而不是把两个方向上一小段的宽度相乘。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the widths", "求宽度"],
                t(
                  `$\\Delta x = \\frac{${b} - ${a}}{${m}} = ${Q.of(Lx, m).toLatex()}$ and $\\Delta y = \\frac{${d} - ${c}}{${n}} = ${Q.of(Ly, n).toLatex()}$.`,
                  `$\\Delta x = \\frac{${b} - ${a}}{${m}} = ${Q.of(Lx, m).toLatex()}$，$\\Delta y = \\frac{${d} - ${c}}{${n}} = ${Q.of(Ly, n).toLatex()}$。`,
                ),
              ],
              [
                ["Multiply", "相乘"],
                t(
                  `$\\Delta A = \\Delta x\\,\\Delta y = ${Q.of(Lx, m).toLatex()} \\cdot ${Q.of(Ly, n).toLatex()} = ${ans.toLatex()}$.`,
                  `$\\Delta A = \\Delta x\\,\\Delta y = ${Q.of(Lx, m).toLatex()} \\cdot ${Q.of(Ly, n).toLatex()} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The $${m * n}$ subrectangles together cover $R$: $${m * n} \\cdot ${ans.toLatex()} = ${Lx * Ly} = ${Lx} \\cdot ${Ly}$.`,
              `$${m * n}$ 个子矩形合起来覆盖 $R$：$${m * n} \\cdot ${ans.toLatex()} = ${Lx * Ly} = ${Lx} \\cdot ${Ly}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "a-double-riemann-sum-with-upper-right-corners",
      title: t("A double Riemann sum with upper-right corners", "取右上角的二重黎曼和"),
      explanation: t(
        "A double Riemann sum adds $f(x_i^*, y_j^*)\\,\\Delta A$ over every subrectangle. On $[0, m] \\times [0, n]$ with unit squares, the upper-right corner of square $(i, j)$ is $(i, j)$ and $\\Delta A = 1$, so for $f(x, y) = x + y$\n\n$$\\sum_{i=1}^{m}\\sum_{j=1}^{n} (i + j) = n\\sum_{i=1}^{m} i + m\\sum_{j=1}^{n} j.$$\n\nEach single sum is counted once for every value of the other index. On $[0, 2] \\times [0, 1]$ the corners are $(1, 1)$ and $(2, 1)$, and the sum is $2 + 3 = 5 = 1 \\cdot 3 + 2 \\cdot 1$.\n\n> **Watch out.** The upper-right corners have indices starting at $1$; starting at $0$ gives the lower-left corners and a smaller sum. And the factor $n$ in front of $\\sum i$ is needed.",
        "二重黎曼和对每个子矩形累加 $f(x_i^*, y_j^*)\\,\\Delta A$。在 $[0, m] \\times [0, n]$ 上用单位正方形划分时，第 $(i, j)$ 个正方形的右上角为 $(i, j)$，且 $\\Delta A = 1$，所以对 $f(x, y) = x + y$ 有\n\n$$\\sum_{i=1}^{m}\\sum_{j=1}^{n} (i + j) = n\\sum_{i=1}^{m} i + m\\sum_{j=1}^{n} j$$\n\n每个单重求和都对另一个指标的每个取值计算一次。在 $[0, 2] \\times [0, 1]$ 上，角点为 $(1, 1)$ 和 $(2, 1)$，和为 $2 + 3 = 5 = 1 \\cdot 3 + 2 \\cdot 1$。\n\n> **注意。** 右上角的下标从 $1$ 开始；从 $0$ 开始得到的是左下角，和会变小。$\\sum i$ 前面的因子 $n$ 不能少。",
      ),
      generate(rng: Rng): Problem {
        const m = rng.int(2, 6);
        const n = rng.int(2, 6);
        const c = rng.int(1, 3);
        const si = (m * (m + 1)) / 2;
        const sj = (n * (n + 1)) / 2;
        const ans = c * (n * si + m * sj);
        const f = c === 1 ? "x + y" : `${c}(x + y)`;
        const lead = c === 1 ? "" : `${c}`;
        return numberProblem({
          prompt: t(
            `$R = [0, ${m}] \\times [0, ${n}]$ is divided into unit squares. Find the Riemann sum of $f(x, y) = ${f}$ using the upper-right corner of each square as the sample point.`,
            `把 $R = [0, ${m}] \\times [0, ${n}]$ 分成单位正方形。以每个正方形的右上角为样本点，求 $f(x, y) = ${f}$ 的黎曼和。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              c * (si + sj),
              `That adds each single sum once; $\\sum i$ is counted for each of the $${n}$ values of $j$, and $\\sum j$ for each of the $${m}$ values of $i$.`,
              `那是每个单重和只加一次；$\\sum i$ 对 $j$ 的 $${n}$ 个取值各计一次，$\\sum j$ 对 $i$ 的 $${m}$ 个取值各计一次。`,
            ),
            why(
              ans - 2 * c * m * n,
              "That uses the lower-left corners, with indices starting at $0$.",
              "那是用了左下角，下标从 $0$ 开始。",
            ),
            why(
              ans - c * m * n,
              "That uses the centers of the squares, not the upper-right corners.",
              "那是用了正方形的中心，而不是右上角。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Set up the sum", "列出和式"],
                t(
                  `The corner of square $(i, j)$ is $(i, j)$ and $\\Delta A = 1$, so the sum is $${lead}\\sum_{i=1}^{${m}}\\sum_{j=1}^{${n}} (i + j)$.`,
                  `第 $(i, j)$ 个正方形的角点是 $(i, j)$，$\\Delta A = 1$，所以和为 $${lead}\\sum_{i=1}^{${m}}\\sum_{j=1}^{${n}} (i + j)$。`,
                ),
              ],
              [
                ["Split and evaluate", "拆开并计算"],
                t(
                  `$${lead}(${n} \\cdot ${si} + ${m} \\cdot ${sj}) = ${lead}${c === 1 ? "" : " \\cdot "}${n * si + m * sj}${c === 1 ? "" : ` = ${ans}`}$.`,
                  `$${lead}(${n} \\cdot ${si} + ${m} \\cdot ${sj}) = ${lead}${c === 1 ? "" : " \\cdot "}${n * si + m * sj}${c === 1 ? "" : ` = ${ans}`}$。`,
                ),
              ],
            ],
            t(
              `The $${m * n}$ corner values of $x + y$ average $${Q.of(m + 1, 2).toLatex()} + ${Q.of(n + 1, 2).toLatex()} = ${Q.of(m + n + 2, 2).toLatex()}$, and $${lead}${c === 1 ? "" : " \\cdot "}${m * n} \\cdot ${Q.of(m + n + 2, 2).toLatex()} = ${ans}$.`,
              `$x + y$ 在 $${m * n}$ 个角点的值平均为 $${Q.of(m + 1, 2).toLatex()} + ${Q.of(n + 1, 2).toLatex()} = ${Q.of(m + n + 2, 2).toLatex()}$，而 $${lead}${c === 1 ? "" : " \\cdot "}${m * n} \\cdot ${Q.of(m + n + 2, 2).toLatex()} = ${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** approximatingVolumesUsingLowerRiemannSums computes lower Riemann sums. */
export const approximatingVolumesUsingLowerRiemannSums: TopicDef = {
  id: "approximating-volumes-using-lower-riemann-sums",
  title: t("Approximating Volumes Using Lower Riemann Sums", "利用下黎曼和近似体积"),
  summary: t(
    "The lower Riemann sum L(f, P) evaluates the function at its infimum on each subrectangle, providing a lower bound on volume.",
    "下黎曼和 L(f, P) 在每个子矩形上取函数值的下确界，给出立体体积的下界近似。",
  ),
  intro: t(
    "Take $f(x, y) = x + 2y$ on $[0, 4] \\times [0, 2]$, cut into a $2 \\times 2$ grid of cells $2$ wide and $1$ tall, so $\\Delta A = 2$. Since $f$ increases in both variables, its smallest value on each cell is at the lower-left corner: $(0, 0), (2, 0), (0, 1), (2, 1)$ give $0, 2, 2, 4$. So $L(f, P) = (0 + 2 + 2 + 4) \\cdot 2 = 16$.\n\nCheck: the exact volume is $\\int_0^4\\int_0^2 (x + 2y)\\,dy\\,dx = 16 + 16 = 32$, and a lower sum must not exceed it: $16 \\le 32$.\n\nIn this lesson we compute lower Riemann sums by finding where the function is smallest on each cell.",
    "取 $[0, 4] \\times [0, 2]$ 上的 $f(x, y) = x + 2y$，分成 $2 \\times 2$ 的网格，每格宽 $2$、高 $1$，所以 $\\Delta A = 2$。由于 $f$ 对两个变量都递增，它在每格上的最小值在左下角：$(0, 0), (2, 0), (0, 1), (2, 1)$ 给出 $0, 2, 2, 4$。所以 $L(f, P) = (0 + 2 + 2 + 4) \\cdot 2 = 16$。\n\n检验：精确体积是 $\\int_0^4\\int_0^2 (x + 2y)\\,dy\\,dx = 16 + 16 = 32$，下和不能超过它：$16 \\le 32$。\n\n本课我们找出函数在每格上最小的位置，计算黎曼下和。",
  ),
  prerequisites: ["calculating-double-summations-over-partitions"],
  encompasses: [{ topic: "calculating-double-summations-over-partitions", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-lower-riemann-sums-for-monotone-surfaces",
      title: t("Computing lower Riemann sums for monotone surfaces", "计算单调曲面的下黎曼和"),
      explanation: t(
        "For an increasing function $f(x, y) = ax + by + c$ ($a, b > 0$) on $[0, 2] \\times [0, 2]$ with $2 \\times 2$ grid (sub-squares of width 1), the minimum on each square $[x_{i-1}, x_i] \\times [y_{j-1}, y_j]$ is at the bottom-left corner $(x_{i-1}, y_{j-1})$:\n\n$$L(f, P) = \\sum_{i=1}^2 \\sum_{j=1}^2 f(x_{i-1}, y_{j-1}) \\Delta A.$$\n\nFor $f = x + y + 10$ the corner values are $10, 11, 11, 12$, so $L = 44$.\n\n> **Watch out.** The constant term is part of every cell's value, so it is added four times. And the corners are the lower-left ones; the upper-right corners give the upper sum.",
        "对于在 $[0, 2] \\times [0, 2]$ 上划分为 $2 \\times 2$ 网格（边长为 1 的小正方形）的递增函数 $f(x, y) = ax + by + c$（$a, b > 0$），每个小正方形 $[x_{i-1}, x_i] \\times [y_{j-1}, y_j]$ 上的最小值取在左下角 $(x_{i-1}, y_{j-1})$：\n\n$$L(f, P) = \\sum_{i=1}^2 \\sum_{j=1}^2 f(x_{i-1}, y_{j-1}) \\Delta A$$\n\n对 $f = x + y + 10$，各角点的值为 $10, 11, 11, 12$，所以 $L = 44$。\n\n> **注意。** 常数项出现在每一格的值里，所以要加四次。所用的是左下角；右上角给出的是上和。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const c = rng.int(1, 8);
        const ans = 2 * a + 2 * b + 4 * c;
        const f = poly([a, "x"], [b, "y"], [c, ""]);
        const exact = 4 * a + 4 * b + 4 * c;
        return numberProblem({
          prompt: t(
            `Find the lower Riemann sum $L(f, P)$ for $f(x, y) = ${f}$ over $R = [0, 2] \\times [0, 2]$ using a regular $2 \\times 2$ partition with equal sub-squares of side length $1$.`,
            `对于函数 $f(x, y) = ${f}$，在矩形区域 $R = [0, 2] \\times [0, 2]$ 上采用边长为 $1$ 的 $2 \\times 2$ 等距正方形网格分割，求其下黎曼和 $L(f, P)$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              6 * a + 6 * b + 4 * c,
              "That uses the upper-right corners, where $f$ is largest; that is the upper sum.",
              "那是用了右上角，$f$ 在那里最大；那是上和。",
            ),
            why(
              exact,
              "That uses the centers of the squares; the lower sum needs the smallest value on each square.",
              "那是用了正方形的中心；下和要用每个正方形上的最小值。",
            ),
            why(
              2 * a + 2 * b + c,
              `The constant $${c}$ belongs to all four corner values, so it is added four times.`,
              `常数 $${c}$ 出现在四个角点的值里，所以要加四次。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Locate the minimum", "确定最小值的位置"],
                t(
                  "$f$ increases in $x$ and in $y$, so on each square it is smallest at the lower-left corner: $(0, 0), (1, 0), (0, 1), (1, 1)$.",
                  "$f$ 关于 $x$ 和 $y$ 都递增，所以在每个正方形上最小值在左下角：$(0, 0), (1, 0), (0, 1), (1, 1)$。",
                ),
              ],
              [
                ["Evaluate", "求值"],
                t(
                  `$f(0, 0) = ${c}$, $f(1, 0) = ${a + c}$, $f(0, 1) = ${b + c}$, $f(1, 1) = ${a + b + c}$.`,
                  `$f(0, 0) = ${c}$，$f(1, 0) = ${a + c}$，$f(0, 1) = ${b + c}$，$f(1, 1) = ${a + b + c}$。`,
                ),
              ],
              [
                ["Add with the area", "乘面积相加"],
                t(
                  `$\\Delta A = 1$, so $L(f, P) = ${c} + ${a + c} + ${b + c} + ${a + b + c} = ${ans}$.`,
                  `$\\Delta A = 1$，所以 $L(f, P) = ${c} + ${a + c} + ${b + c} + ${a + b + c} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `The exact volume is $\\int_0^2\\int_0^2 f\\,dy\\,dx = ${exact}$, and the lower sum is below it by $${2 * a + 2 * b}$, as it must be.`,
              `精确体积为 $\\int_0^2\\int_0^2 f\\,dy\\,dx = ${exact}$，下和比它小 $${2 * a + 2 * b}$，理应如此。`,
            ),
          ),
        });
      },
    },
    {
      id: "a-lower-sum-for-a-product-function",
      title: t("A lower sum for $cxy$", "函数 $cxy$ 的下和"),
      explanation: t(
        "For $f(x, y) = cxy$ with $c > 0$ on the first quadrant, $f$ increases in both variables, so its minimum on each subsquare is at the lower-left corner. With an $m \\times m$ regular partition of $[0, mh]^2$, the corners are $(ih, jh)$ for $i, j = 0, \\dots, m - 1$, and\n\n$$L = \\sum_{i=0}^{m-1}\\sum_{j=0}^{m-1} c(ih)(jh)\\,h^2 = ch^4\\left(\\frac{m(m-1)}{2}\\right)^2.$$\n\nFor $6xy$ on $[0, 4]^2$ with a $2 \\times 2$ partition, $h = 2$ and only the corner $(2, 2)$ is nonzero: $L = 24 \\cdot 4 = 96 = 6 \\cdot 16 \\cdot 1^2$.\n\n> **Watch out.** The power of $h$ is $4$: two factors come from $x$ and $y$ and two from the area $h^2$. And the lower-left indices run from $0$ to $m - 1$.",
        "对第一象限上的 $f(x, y) = cxy$（$c > 0$），$f$ 关于两个变量都递增，所以在每个小正方形上的最小值在左下角取得。对 $[0, mh]^2$ 作 $m \\times m$ 等分，各角点为 $(ih, jh)$，$i, j = 0, \\dots, m - 1$，于是\n\n$$L = \\sum_{i=0}^{m-1}\\sum_{j=0}^{m-1} c(ih)(jh)\\,h^2 = ch^4\\left(\\frac{m(m-1)}{2}\\right)^2$$\n\n对 $[0, 4]^2$ 上的 $6xy$ 作 $2 \\times 2$ 划分，$h = 2$，只有角点 $(2, 2)$ 处非零：$L = 24 \\cdot 4 = 96 = 6 \\cdot 16 \\cdot 1^2$。\n\n> **注意。** $h$ 的次数是 $4$：两个因子来自 $x$ 和 $y$，两个来自面积 $h^2$。左下角的下标从 $0$ 到 $m - 1$。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(1, 5);
        const m = rng.int(2, 4);
        const h = rng.int(1, 2);
        const lo = (m * (m - 1)) / 2;
        const hi = (m * (m + 1)) / 2;
        const ans = c * h ** 4 * lo * lo;
        const side = m * h;
        const exact = Q.of(c * side ** 4, 4);
        return numberProblem({
          prompt: t(
            `Find the lower Riemann sum of $f(x, y) = ${coef(c)}xy$ over $[0, ${side}] \\times [0, ${side}]$ using a regular $${m} \\times ${m}$ partition.`,
            `用 $${m} \\times ${m}$ 等分划分，求 $f(x, y) = ${coef(c)}xy$ 在 $[0, ${side}] \\times [0, ${side}]$ 上的下黎曼和。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              c * h ** 4 * hi * hi,
              "That uses the upper-right corners, indices $1$ to $m$; that is the upper sum.",
              "那是用了右上角，下标从 $1$ 到 $m$；那是上和。",
            ),
            why(
              c * h ** 2 * lo * lo,
              "One factor $h^2$ is missing: $x$ and $y$ give $h^2$, and the area of a square gives another $h^2$.",
              "少了一个因子 $h^2$：$x$ 与 $y$ 给出 $h^2$，正方形的面积又给出一个 $h^2$。",
            ),
            why(
              c * h ** 4 * lo * hi,
              "That mixes the corners, lower in one variable and upper in the other.",
              "那是混用了角点，一个变量取下端，另一个取上端。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Locate the minimum", "确定最小值的位置"],
                t(
                  `Each square has side $${h}$, and $f$ is smallest at the lower-left corner $(${h}i, ${h}j)$ with $i, j = 0, \\dots, ${m - 1}$.`,
                  `每个正方形边长为 $${h}$，$f$ 在左下角 $(${h}i, ${h}j)$ 处最小，$i, j = 0, \\dots, ${m - 1}$。`,
                ),
              ],
              [
                ["Separate the sum", "分离求和"],
                t(
                  `$L = ${c} \\cdot ${h}^4 \\left(\\sum_{i=0}^{${m - 1}} i\\right)^2 = ${c} \\cdot ${h ** 4} \\cdot ${lo}^2 = ${ans}$.`,
                  `$L = ${c} \\cdot ${h}^4 \\left(\\sum_{i=0}^{${m - 1}} i\\right)^2 = ${c} \\cdot ${h ** 4} \\cdot ${lo}^2 = ${ans}$。`,
                ),
              ],
            ],
            t(
              `The exact volume is $${c} \\cdot \\frac{${side}^2}{2} \\cdot \\frac{${side}^2}{2} = ${exact.toLatex()}$, and $${ans} \\le ${exact.toLatex()}$.`,
              `精确体积为 $${c} \\cdot \\frac{${side}^2}{2} \\cdot \\frac{${side}^2}{2} = ${exact.toLatex()}$，而 $${ans} \\le ${exact.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** approximatingVolumesUsingUpperRiemannSums computes upper Riemann sums. */
export const approximatingVolumesUsingUpperRiemannSums: TopicDef = {
  id: "approximating-volumes-using-upper-riemann-sums",
  title: t("Approximating Volumes Using Upper Riemann Sums", "利用上黎曼和近似体积"),
  summary: t(
    "The upper Riemann sum U(f, P) evaluates the function at its supremum on each subrectangle, providing an upper bound on volume.",
    "上黎曼和 U(f, P) 在每个子矩形上取函数值的上确界，给出立体体积的上界近似。",
  ),
  intro: t(
    "Take $f(x, y) = 2x + y$ on $[0, 2] \\times [0, 4]$, cut into a $2 \\times 2$ grid of cells $1$ wide and $2$ tall, so $\\Delta A = 2$. Since $f$ increases in both variables, its largest value on each cell is at the upper-right corner: $(1, 2), (2, 2), (1, 4), (2, 4)$ give $4, 6, 6, 8$. So $U(f, P) = (4 + 6 + 6 + 8) \\cdot 2 = 48$.\n\nCheck: the exact volume is $\\int_0^2\\int_0^4 (2x + y)\\,dy\\,dx = 16 + 16 = 32$, and an upper sum must not be below it: $48 \\ge 32$.\n\nIn this lesson we compute upper Riemann sums by finding where the function is largest on each cell.",
    "取 $[0, 2] \\times [0, 4]$ 上的 $f(x, y) = 2x + y$，分成 $2 \\times 2$ 的网格，每格宽 $1$、高 $2$，所以 $\\Delta A = 2$。由于 $f$ 对两个变量都递增，它在每格上的最大值在右上角：$(1, 2), (2, 2), (1, 4), (2, 4)$ 给出 $4, 6, 6, 8$。所以 $U(f, P) = (4 + 6 + 6 + 8) \\cdot 2 = 48$。\n\n检验：精确体积是 $\\int_0^2\\int_0^4 (2x + y)\\,dy\\,dx = 16 + 16 = 32$，上和不能小于它：$48 \\ge 32$。\n\n本课我们找出函数在每格上最大的位置，计算黎曼上和。",
  ),
  prerequisites: ["approximating-volumes-using-lower-riemann-sums"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-upper-riemann-sums-for-monotone-surfaces",
      title: t("Computing upper Riemann sums for monotone surfaces", "计算单调曲面的上黎曼和"),
      explanation: t(
        "For an increasing function $f(x, y) = ax + by + c$ ($a, b > 0$) on $[0, 2] \\times [0, 2]$ with $2 \\times 2$ grid, the maximum on each square $[x_{i-1}, x_i] \\times [y_{j-1}, y_j]$ is at the top-right corner $(x_i, y_j)$:\n\n$$U(f, P) = \\sum_{i=1}^2 \\sum_{j=1}^2 f(x_i, y_j) \\Delta A.$$\n\nFor $f = x + y + 10$ the corner values are $12, 13, 13, 14$, so $U = 52$.\n\n> **Watch out.** The top-right corners are $(1, 1), (2, 1), (1, 2), (2, 2)$, all four away from the origin. The constant term is again added once per square.",
        "对于在 $[0, 2] \\times [0, 2]$ 上划分为 $2 \\times 2$ 网格的递增函数 $f(x, y) = ax + by + c$（$a, b > 0$），每个子方块上的最大值取在右上角 $(x_i, y_j)$：\n\n$$U(f, P) = \\sum_{i=1}^2 \\sum_{j=1}^2 f(x_i, y_j) \\Delta A$$\n\n对 $f = x + y + 10$，各角点的值为 $12, 13, 13, 14$，所以 $U = 52$。\n\n> **注意。** 右上角是 $(1, 1), (2, 1), (1, 2), (2, 2)$，四个点都不在原点。常数项同样每个正方形加一次。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const c = rng.int(1, 8);
        const ans = 6 * a + 6 * b + 4 * c;
        const f = poly([a, "x"], [b, "y"], [c, ""]);
        const exact = 4 * a + 4 * b + 4 * c;
        return numberProblem({
          prompt: t(
            `Find the upper Riemann sum $U(f, P)$ for $f(x, y) = ${f}$ over $R = [0, 2] \\times [0, 2]$ using a regular $2 \\times 2$ partition with equal sub-squares of side length $1$.`,
            `对于函数 $f(x, y) = ${f}$，在矩形区域 $R = [0, 2] \\times [0, 2]$ 上采用边长为 $1$ 的 $2 \\times 2$ 等距正方形网格分割，求其上黎曼和 $U(f, P)$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              2 * a + 2 * b + 4 * c,
              "That uses the lower-left corners, where $f$ is smallest; that is the lower sum.",
              "那是用了左下角，$f$ 在那里最小；那是下和。",
            ),
            why(
              exact,
              "That uses the centers of the squares; the upper sum needs the largest value on each square.",
              "那是用了正方形的中心；上和要用每个正方形上的最大值。",
            ),
            why(
              6 * a + 6 * b + c,
              `The constant $${c}$ belongs to all four corner values, so it is added four times.`,
              `常数 $${c}$ 出现在四个角点的值里，所以要加四次。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Locate the maximum", "确定最大值的位置"],
                t(
                  "$f$ increases in $x$ and in $y$, so on each square it is largest at the upper-right corner: $(1, 1), (2, 1), (1, 2), (2, 2)$.",
                  "$f$ 关于 $x$ 和 $y$ 都递增，所以在每个正方形上最大值在右上角：$(1, 1), (2, 1), (1, 2), (2, 2)$。",
                ),
              ],
              [
                ["Evaluate", "求值"],
                t(
                  `$f(1, 1) = ${a + b + c}$, $f(2, 1) = ${2 * a + b + c}$, $f(1, 2) = ${a + 2 * b + c}$, $f(2, 2) = ${2 * a + 2 * b + c}$.`,
                  `$f(1, 1) = ${a + b + c}$，$f(2, 1) = ${2 * a + b + c}$，$f(1, 2) = ${a + 2 * b + c}$，$f(2, 2) = ${2 * a + 2 * b + c}$。`,
                ),
              ],
              [
                ["Add with the area", "乘面积相加"],
                t(
                  `$\\Delta A = 1$, so $U(f, P) = ${a + b + c} + ${2 * a + b + c} + ${a + 2 * b + c} + ${2 * a + 2 * b + c} = ${ans}$.`,
                  `$\\Delta A = 1$，所以 $U(f, P) = ${a + b + c} + ${2 * a + b + c} + ${a + 2 * b + c} + ${2 * a + 2 * b + c} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `The exact volume is $\\int_0^2\\int_0^2 f\\,dy\\,dx = ${exact}$, and the upper sum is above it by $${2 * a + 2 * b}$, as it must be.`,
              `精确体积为 $\\int_0^2\\int_0^2 f\\,dy\\,dx = ${exact}$，上和比它大 $${2 * a + 2 * b}$，理应如此。`,
            ),
          ),
        });
      },
    },
    {
      id: "an-upper-sum-for-a-sum-of-squares",
      title: t("An upper sum for $c(x^2 + y^2)$", "函数 $c(x^2 + y^2)$ 的上和"),
      explanation: t(
        "For $f(x, y) = c(x^2 + y^2)$ with $c > 0$ on the first quadrant, the maximum on each subsquare is at the upper-right corner. With an $m \\times m$ regular partition of $[0, mh]^2$ the corners are $(ih, jh)$ for $i, j = 1, \\dots, m$, and\n\n$$U = \\sum_{i=1}^{m}\\sum_{j=1}^{m} c(i^2 + j^2)h^2 \\cdot h^2 = ch^4 \\cdot 2m\\sum_{i=1}^{m} i^2.$$\n\nThe factor $2m$ appears because each square $i^2$ is counted once for every $j$, and symmetrically for $j^2$. For $5(x^2 + y^2)$ on $[0, 2]^2$ with a $2 \\times 2$ partition, the corner values of $x^2 + y^2$ are $2, 5, 5, 8$, so $U = 5 \\cdot 20 = 100 = 5 \\cdot 4 \\cdot 5$.\n\n> **Watch out.** Both $x^2$ and $y^2$ contribute, each counted $m$ times, which is where $2m$ comes from; and the power of $h$ is $4$, two from the squares and two from the area.",
        "对第一象限上的 $f(x, y) = c(x^2 + y^2)$（$c > 0$），每个小正方形上的最大值在右上角。对 $[0, mh]^2$ 作 $m \\times m$ 等分，角点为 $(ih, jh)$，$i, j = 1, \\dots, m$，于是\n\n$$U = \\sum_{i=1}^{m}\\sum_{j=1}^{m} c(i^2 + j^2)h^2 \\cdot h^2 = ch^4 \\cdot 2m\\sum_{i=1}^{m} i^2$$\n\n出现因子 $2m$ 是因为每个 $i^2$ 对每个 $j$ 都计算一次，$j^2$ 同理。对 $[0, 2]^2$ 上的 $5(x^2 + y^2)$ 作 $2 \\times 2$ 划分，$x^2 + y^2$ 在各角点的值为 $2, 5, 5, 8$，所以 $U = 5 \\cdot 20 = 100 = 5 \\cdot 4 \\cdot 5$。\n\n> **注意。** $x^2$ 和 $y^2$ 都有贡献，各计 $m$ 次，这就是 $2m$ 的来源；$h$ 的次数是 $4$，两次来自平方，两次来自面积。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(1, 4);
        const m = rng.int(2, 5);
        const h = rng.int(1, 2);
        const s2 = (m * (m + 1) * (2 * m + 1)) / 6;
        const s2lo = ((m - 1) * m * (2 * m - 1)) / 6;
        const ans = c * h ** 4 * 2 * m * s2;
        const side = m * h;
        const exact = Q.of(2 * c * side ** 4, 3);
        const f = c === 1 ? "x^2 + y^2" : `${c}(x^2 + y^2)`;
        return numberProblem({
          prompt: t(
            `Find the upper Riemann sum of $f(x, y) = ${f}$ over $[0, ${side}] \\times [0, ${side}]$ using a regular $${m} \\times ${m}$ partition.`,
            `用 $${m} \\times ${m}$ 等分划分，求 $f(x, y) = ${f}$ 在 $[0, ${side}] \\times [0, ${side}]$ 上的上黎曼和。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              c * h ** 4 * 2 * m * s2lo,
              "That uses the lower-left corners, indices $0$ to $m - 1$; that is the lower sum.",
              "那是用了左下角，下标从 $0$ 到 $m - 1$；那是下和。",
            ),
            why(
              c * h ** 2 * 2 * m * s2,
              "One factor $h^2$ is missing: the squares give $h^2$, and the area of a square gives another $h^2$.",
              "少了一个因子 $h^2$：平方给出 $h^2$，正方形的面积又给出一个 $h^2$。",
            ),
            why(
              c * h ** 4 * m * s2,
              "That counts only $x^2$; $y^2$ contributes the same amount, which doubles the sum.",
              "那是只算了 $x^2$；$y^2$ 贡献同样多，和要加倍。",
            ),
            why(
              c * h ** 4 * 2 * s2,
              `Each $i^2$ is added once for every one of the $${m}$ values of $j$; the factor $${m}$ is missing.`,
              `每个 $i^2$ 对 $j$ 的 $${m}$ 个取值都要加一次；少了因子 $${m}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Locate the maximum", "确定最大值的位置"],
                t(
                  `$f$ increases in both variables, so each square uses its upper-right corner $(${h}i, ${h}j)$ with $i, j = 1, \\dots, ${m}$, and $\\Delta A = ${h * h}$.`,
                  `$f$ 关于两个变量都递增，所以每个正方形用右上角 $(${h}i, ${h}j)$，$i, j = 1, \\dots, ${m}$，$\\Delta A = ${h * h}$。`,
                ),
              ],
              [
                ["Separate the sum", "分离求和"],
                t(
                  `$\\sum_{i, j} (i^2 + j^2) = 2 \\cdot ${m}\\sum_{i=1}^{${m}} i^2 = ${2 * m} \\cdot ${s2}$.`,
                  `$\\sum_{i, j} (i^2 + j^2) = 2 \\cdot ${m}\\sum_{i=1}^{${m}} i^2 = ${2 * m} \\cdot ${s2}$。`,
                ),
              ],
              [
                ["Multiply", "相乘"],
                t(
                  `$U = ${c} \\cdot ${h}^4 \\cdot ${2 * m} \\cdot ${s2} = ${ans}$.`,
                  `$U = ${c} \\cdot ${h}^4 \\cdot ${2 * m} \\cdot ${s2} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `The exact volume is $\\int_0^{${side}}\\int_0^{${side}} f\\,dy\\,dx = \\frac{2 \\cdot ${c} \\cdot ${side}^4}{3} = ${exact.toLatex()}$, and $${ans} \\ge ${exact.toLatex()}$.`,
              `精确体积为 $\\int_0^{${side}}\\int_0^{${side}} f\\,dy\\,dx = \\frac{2 \\cdot ${c} \\cdot ${side}^4}{3} = ${exact.toLatex()}$，而 $${ans} \\ge ${exact.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** lowerRiemannSumsOverGeneralRectangularPartitions computes lower sums for unequal grids. */
export const lowerRiemannSumsOverGeneralRectangularPartitions: TopicDef = {
  id: "lower-riemann-sums-over-general-rectangular-partitions",
  title: t("Lower Riemann Sums Over General Rectangular Partitions", "一般矩形分割上的下黎曼和"),
  summary: t(
    "For partitions whose subrectangles have different widths, a lower sum weights each infimum by its own area $\\Delta A_{ij} = \\Delta x_i\\,\\Delta y_j$.",
    "对于子矩形宽度不等的分割，下和把每个下确界乘以各自的面积 $\\Delta A_{ij} = \\Delta x_i\\,\\Delta y_j$ 再求和。",
  ),
  intro: t(
    "Take $f(x, y) = x + y$ on $[0, 3] \\times [0, 1]$, with $x$ cut at $0, 1, 3$. The two cells are $[0, 1] \\times [0, 1]$ of area $1$ and $[1, 3] \\times [0, 1]$ of area $2$. The minima are at the lower-left corners, $f(0, 0) = 0$ and $f(1, 0) = 1$, so $L = 0 \\cdot 1 + 1 \\cdot 2 = 2$.\n\nCheck: the exact volume is $\\int_0^3\\int_0^1 (x + y)\\,dy\\,dx = \\frac{9}{2} + \\frac{3}{2} = 6$, and $2 \\le 6$.\n\nIn this lesson we compute lower sums over partitions whose cells have different sizes, weighting each minimum by the area of its own cell.",
    "取 $[0, 3] \\times [0, 1]$ 上的 $f(x, y) = x + y$，$x$ 在 $0, 1, 3$ 处分割。两个小格是面积为 $1$ 的 $[0, 1] \\times [0, 1]$ 和面积为 $2$ 的 $[1, 3] \\times [0, 1]$。最小值在左下角，$f(0, 0) = 0$，$f(1, 0) = 1$，所以 $L = 0 \\cdot 1 + 1 \\cdot 2 = 2$。\n\n检验：精确体积是 $\\int_0^3\\int_0^1 (x + y)\\,dy\\,dx = \\frac{9}{2} + \\frac{3}{2} = 6$，而 $2 \\le 6$。\n\n本课我们在小格大小不等的分割上计算下和，每个最小值乘以它自己那一格的面积。",
  ),
  prerequisites: ["approximating-volumes-using-lower-riemann-sums"],
  encompasses: [{ topic: "approximating-volumes-using-lower-riemann-sums", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "lower-sum-with-unequal-subinterval-widths",
      figure: multivariableDrawings3["lower-riemann-sums-over-general-rectangular-partitions#lower-sum-with-unequal-subinterval-widths"],
      title: t("Lower sum with unequal subinterval widths", "非等距子区间下的下黎曼和"),
      explanation: t(
        "A lower sum uses the smallest value of the function on each small rectangle, which for an increasing function is at the corner nearest the origin. For a partition with cut points $x = [0, x_1, x_2]$ and $y = [0, y_1, y_2]$, the lower sum of an increasing function $f(x, y) = ax + by$ is:\n\n$$L(f, P) = \\sum_{i=1}^2 \\sum_{j=1}^2 f(x_{i-1}, y_{j-1}) \\Delta x_i \\Delta y_j.$$\n\nFor $f = x + y$ with $x$ cut at $0, 4, 5$ and $y$ at $0, 1, 2$, the cells have areas $4, 1, 4, 1$ and lower-left values $0, 4, 1, 5$, so $L = 0 + 4 + 4 + 5 = 13$.\n\n> **Watch out.** Each value is multiplied by the area of its own cell, $\\Delta x_i\\,\\Delta y_j$; the cells are not equal, so one common area does not work.",
        "下和在每个小矩形上取函数的最小值，对于增函数，最小值在离原点最近的角上。对于分割节点为 $x = [0, x_1, x_2]$ 与 $y = [0, y_1, y_2]$ 的非等距分割，单调递增函数 $f(x, y) = ax + by$ 的下黎曼和为：\n\n$$L(f, P) = \\sum_{i=1}^2 \\sum_{j=1}^2 f(x_{i-1}, y_{j-1}) \\Delta x_i \\Delta y_j$$\n\n对 $f = x + y$，$x$ 在 $0, 4, 5$ 处分割，$y$ 在 $0, 1, 2$ 处分割，各格面积为 $4, 1, 4, 1$，左下角的值为 $0, 4, 1, 5$，所以 $L = 0 + 4 + 4 + 5 = 13$。\n\n> **注意。** 每个值要乘以它自己那一格的面积 $\\Delta x_i\\,\\Delta y_j$；各格不相等，不能用同一个面积。",
      ),
      generate(rng: Rng): Problem {
        const x1 = rng.int(1, 3);
        const dx2 = rng.int(1, 3);
        const x2 = x1 + dx2;
        const y1 = rng.int(1, 3);
        const dy2 = rng.int(1, 3);
        const y2 = y1 + dy2;
        const a = rng.int(1, 4);
        const b = rng.int(1, 4);
        const term2 = a * x1 * dx2 * y1;
        const term3 = b * y1 * x1 * dy2;
        const term4 = (a * x1 + b * y1) * dx2 * dy2;
        const ans = term2 + term3 + term4;
        const upper =
          (a * x1 + b * y1) * x1 * y1 + (a * x2 + b * y1) * dx2 * y1 + (a * x1 + b * y2) * x1 * dy2 + (a * x2 + b * y2) * dx2 * dy2;
        const values = 2 * (a * x1 + b * y1);
        const exact = Q.of(a * x2 * x2 * y2 + b * y2 * y2 * x2, 2);
        return numberProblem({
          prompt: t(
            `Find the lower Riemann sum $L(f, P)$ for $f(x, y) = ${poly([a, "x"], [b, "y"])}$ on $R = [0, ${x2}] \\times [0, ${y2}]$ with partition points $x \\in \\{0, ${x1}, ${x2}\\}$ and $y \\in \\{0, ${y1}, ${y2}\\}$.`,
            `对于函数 $f(x, y) = ${poly([a, "x"], [b, "y"])}$，在矩形区域 $R = [0, ${x2}] \\times [0, ${y2}]$ 上，采用分割节点 $x \\in \\{0, ${x1}, ${x2}\\}$ 与 $y \\in \\{0, ${y1}, ${y2}\\}$，求其下黎曼和 $L(f, P)$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              upper,
              "That uses the upper-right corners, where $f$ is largest; that is the upper sum.",
              "那是用了右上角，$f$ 在那里最大；那是上和。",
            ),
            why(
              values,
              "That adds the corner values without multiplying each by the area of its cell.",
              "那是只把角点的值相加，没有乘以各自小格的面积。",
            ),
            why(
              Q.of(values * x2 * y2, 4),
              `That gives every cell the same area $\\frac{${x2 * y2}}{4}$; the cells have different areas $\\Delta x_i\\,\\Delta y_j$.`,
              `那是给每格同样的面积 $\\frac{${x2 * y2}}{4}$；各格面积 $\\Delta x_i\\,\\Delta y_j$ 并不相同。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the widths", "求宽度"],
                t(
                  `$\\Delta x_1 = ${x1}$, $\\Delta x_2 = ${dx2}$, $\\Delta y_1 = ${y1}$, $\\Delta y_2 = ${dy2}$.`,
                  `$\\Delta x_1 = ${x1}$，$\\Delta x_2 = ${dx2}$，$\\Delta y_1 = ${y1}$，$\\Delta y_2 = ${dy2}$。`,
                ),
              ],
              [
                ["Use the lower-left corners", "用左下角"],
                t(
                  `$f$ is increasing, so the minima are $f(0, 0) = 0$, $f(${x1}, 0) = ${a * x1}$, $f(0, ${y1}) = ${b * y1}$, $f(${x1}, ${y1}) = ${a * x1 + b * y1}$.`,
                  `$f$ 递增，所以各最小值为 $f(0, 0) = 0$，$f(${x1}, 0) = ${a * x1}$，$f(0, ${y1}) = ${b * y1}$，$f(${x1}, ${y1}) = ${a * x1 + b * y1}$。`,
                ),
              ],
              [
                ["Weight by the areas", "乘以面积"],
                t(
                  `$L = 0 + ${a * x1} \\cdot ${dx2} \\cdot ${y1} + ${b * y1} \\cdot ${x1} \\cdot ${dy2} + ${a * x1 + b * y1} \\cdot ${dx2} \\cdot ${dy2} = ${term2} + ${term3} + ${term4} = ${ans}$.`,
                  `$L = 0 + ${a * x1} \\cdot ${dx2} \\cdot ${y1} + ${b * y1} \\cdot ${x1} \\cdot ${dy2} + ${a * x1 + b * y1} \\cdot ${dx2} \\cdot ${dy2} = ${term2} + ${term3} + ${term4} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `The exact volume is $\\int_0^{${x2}}\\int_0^{${y2}} f\\,dy\\,dx = ${exact.toLatex()}$, and $${ans} \\le ${exact.toLatex()}$.`,
              `精确体积为 $\\int_0^{${x2}}\\int_0^{${y2}} f\\,dy\\,dx = ${exact.toLatex()}$，而 $${ans} \\le ${exact.toLatex()}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "a-lower-sum-for-xy-over-an-irregular-grid",
      title: t("A lower sum for $cxy$ over an irregular grid", "不规则网格上 $cxy$ 的下和"),
      explanation: t(
        "On a general partition each subrectangle $[x_{i-1}, x_i] \\times [y_{j-1}, y_j]$ has its own area $\\Delta x_i\\,\\Delta y_j$. For $f(x, y) = cxy$ with $c > 0$ on $[0, x_2] \\times [0, y_2]$, the minimum on each piece is at its lower-left corner $(x_{i-1}, y_{j-1})$. Every piece touching an axis has minimum $0$, so only the piece $[x_1, x_2] \\times [y_1, y_2]$ contributes:\n\n$$L = c\\,x_1y_1(x_2 - x_1)(y_2 - y_1).$$\n\nFor $xy$ with $x$ cut at $0, 4, 5$ and $y$ at $0, 1, 3$, $L = 4 \\cdot 1 \\cdot 1 \\cdot 2 = 8$.\n\n> **Watch out.** The surviving value is taken at $(x_1, y_1)$, the lower-left corner of the last cell, and multiplied by that cell's area only, not by the area of the whole rectangle.",
        "在一般划分中，每个子矩形 $[x_{i-1}, x_i] \\times [y_{j-1}, y_j]$ 的面积为 $\\Delta x_i\\,\\Delta y_j$。对 $[0, x_2] \\times [0, y_2]$ 上的 $f(x, y) = cxy$（$c > 0$），每块上的最小值在左下角 $(x_{i-1}, y_{j-1})$。贴着坐标轴的块最小值为 $0$，所以只有 $[x_1, x_2] \\times [y_1, y_2]$ 有贡献：\n\n$$L = c\\,x_1y_1(x_2 - x_1)(y_2 - y_1)$$\n\n对 $xy$，$x$ 在 $0, 4, 5$ 处分割，$y$ 在 $0, 1, 3$ 处分割，$L = 4 \\cdot 1 \\cdot 1 \\cdot 2 = 8$。\n\n> **注意。** 留下的值取在最后一格的左下角 $(x_1, y_1)$，只乘以这一格的面积，而不是整个矩形的面积。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(1, 3);
        const x1 = rng.int(1, 3);
        const x2 = x1 + rng.int(1, 3);
        const y1 = rng.int(1, 3);
        const y2 = y1 + rng.int(1, 3);
        const ans = c * x1 * y1 * (x2 - x1) * (y2 - y1);
        const upper = c * (x1 * x1 + x2 * (x2 - x1)) * (y1 * y1 + y2 * (y2 - y1));
        const exact = Q.of(c * x2 * x2 * y2 * y2, 4);
        return numberProblem({
          prompt: t(
            `Find the lower Riemann sum of $f(x, y) = ${coef(c)}xy$ on $[0, ${x2}] \\times [0, ${y2}]$ for the partition with $x \\in \\{0, ${x1}, ${x2}\\}$ and $y \\in \\{0, ${y1}, ${y2}\\}$.`,
            `对 $x \\in \\{0, ${x1}, ${x2}\\}$、$y \\in \\{0, ${y1}, ${y2}\\}$ 的划分，求 $f(x, y) = ${coef(c)}xy$ 在 $[0, ${x2}] \\times [0, ${y2}]$ 上的下黎曼和。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(upper, "That uses the upper-right corners; that is the upper sum.", "那是用了右上角；那是上和。"),
            why(
              c * x1 * y1 * x2 * y2,
              `That multiplies by the area $${x2 * y2}$ of the whole rectangle; only the cell $[${x1}, ${x2}] \\times [${y1}, ${y2}]$ contributes.`,
              `那是乘以整个矩形的面积 $${x2 * y2}$；只有 $[${x1}, ${x2}] \\times [${y1}, ${y2}]$ 这一格有贡献。`,
            ),
            why(
              c * x2 * y2 * (x2 - x1) * (y2 - y1),
              `That evaluates at $(${x2}, ${y2})$, the largest value of the last cell; the lower sum needs its smallest value at $(${x1}, ${y1})$.`,
              `那是在 $(${x2}, ${y2})$ 处取值，即最后一格的最大值；下和要用它在 $(${x1}, ${y1})$ 处的最小值。`,
            ),
            why(c * x1 * y1, "That forgets to multiply by the area of the cell.", "那是忘了乘以这一格的面积。"),
          ]),
          solution: walked(
            [
              [
                ["Find the minima", "求最小值"],
                t(
                  `$f$ increases in both variables, so each cell uses its lower-left corner. Three cells touch an axis, where $f = 0$.`,
                  `$f$ 对两个变量都递增，所以每格用左下角。有三格贴着坐标轴，那里 $f = 0$。`,
                ),
              ],
              [
                ["Add the one nonzero term", "加上唯一的非零项"],
                t(
                  `$f(${x1}, ${y1}) = ${c * x1 * y1}$ and the cell $[${x1}, ${x2}] \\times [${y1}, ${y2}]$ has area $${x2 - x1} \\cdot ${y2 - y1}$, so $L = ${c * x1 * y1} \\cdot ${(x2 - x1) * (y2 - y1)} = ${ans}$.`,
                  `$f(${x1}, ${y1}) = ${c * x1 * y1}$，小格 $[${x1}, ${x2}] \\times [${y1}, ${y2}]$ 的面积为 $${x2 - x1} \\cdot ${y2 - y1}$，所以 $L = ${c * x1 * y1} \\cdot ${(x2 - x1) * (y2 - y1)} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `The exact volume is $${c} \\cdot \\frac{${x2}^2}{2} \\cdot \\frac{${y2}^2}{2} = ${exact.toLatex()}$, and $${ans} \\le ${exact.toLatex()}$.`,
              `精确体积为 $${c} \\cdot \\frac{${x2}^2}{2} \\cdot \\frac{${y2}^2}{2} = ${exact.toLatex()}$，而 $${ans} \\le ${exact.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** upperRiemannSumsOverGeneralRectangularPartitions computes upper sums for unequal grids. */
export const upperRiemannSumsOverGeneralRectangularPartitions: TopicDef = {
  id: "upper-riemann-sums-over-general-rectangular-partitions",
  title: t("Upper Riemann Sums Over General Rectangular Partitions", "一般矩形分割上的上黎曼和"),
  summary: t(
    "For a general partition, the upper sum adds the products of each subrectangle's supremum with its area $\\Delta A_{ij}$.",
    "对于一般分割，上和把每个子矩形上的上确界与其面积 $\\Delta A_{ij}$ 的乘积相加。",
  ),
  intro: t(
    "Take $f(x, y) = 2x + y$ on $[0, 1] \\times [0, 3]$, with $y$ cut at $0, 2, 3$. The cells are $[0, 1] \\times [0, 2]$ of area $2$ and $[0, 1] \\times [2, 3]$ of area $1$. The maxima are at the upper-right corners, $f(1, 2) = 4$ and $f(1, 3) = 5$, so $U = 4 \\cdot 2 + 5 \\cdot 1 = 13$.\n\nCheck: the exact volume is $\\int_0^1\\int_0^3 (2x + y)\\,dy\\,dx = 3 + \\frac{9}{2} = \\frac{15}{2}$, and $13 \\ge \\frac{15}{2}$.\n\nIn this lesson we compute upper sums over partitions whose cells have different sizes, weighting each maximum by the area of its own cell.",
    "取 $[0, 1] \\times [0, 3]$ 上的 $f(x, y) = 2x + y$，$y$ 在 $0, 2, 3$ 处分割。两格是面积为 $2$ 的 $[0, 1] \\times [0, 2]$ 和面积为 $1$ 的 $[0, 1] \\times [2, 3]$。最大值在右上角，$f(1, 2) = 4$，$f(1, 3) = 5$，所以 $U = 4 \\cdot 2 + 5 \\cdot 1 = 13$。\n\n检验：精确体积是 $\\int_0^1\\int_0^3 (2x + y)\\,dy\\,dx = 3 + \\frac{9}{2} = \\frac{15}{2}$，而 $13 \\ge \\frac{15}{2}$。\n\n本课我们在小格大小不等的分割上计算上和，每个最大值乘以它自己那一格的面积。",
  ),
  prerequisites: ["approximating-volumes-using-upper-riemann-sums"],
  encompasses: [{ topic: "approximating-volumes-using-upper-riemann-sums", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "upper-sum-with-unequal-subinterval-widths",
      title: t("Upper sum with unequal subinterval widths", "非等距子区间下的上黎曼和"),
      explanation: t(
        "For cut points $x = [0, x_1, x_2]$ and $y = [0, y_1, y_2]$, the upper sum of an increasing function $f(x, y) = ax + by$ evaluates the supremum at top-right corners:\n\n$$U(f, P) = \\sum_{i=1}^2 \\sum_{j=1}^2 f(x_i, y_j) \\Delta x_i \\Delta y_j.$$\n\nFor $f = x + y$ with $x$ cut at $0, 4, 5$ and $y$ at $0, 1, 2$, the upper-right values are $5, 6, 6, 7$ on cells of area $4, 1, 4, 1$, so $U = 20 + 6 + 24 + 7 = 57$.\n\n> **Watch out.** Pair each corner with the area of the cell it belongs to: $(x_1, y_1)$ goes with $\\Delta x_1\\,\\Delta y_1$, $(x_2, y_1)$ with $\\Delta x_2\\,\\Delta y_1$, and so on.",
        "对于分割节点 $x = [0, x_1, x_2]$ 与 $y = [0, y_1, y_2]$，单调递增函数 $f(x, y) = ax + by$ 的上黎曼和在右上角计算上确界：\n\n$$U(f, P) = \\sum_{i=1}^2 \\sum_{j=1}^2 f(x_i, y_j) \\Delta x_i \\Delta y_j$$\n\n对 $f = x + y$，$x$ 在 $0, 4, 5$ 处分割，$y$ 在 $0, 1, 2$ 处分割，右上角的值为 $5, 6, 6, 7$，所在小格面积为 $4, 1, 4, 1$，所以 $U = 20 + 6 + 24 + 7 = 57$。\n\n> **注意。** 每个角点要配上它所在小格的面积：$(x_1, y_1)$ 配 $\\Delta x_1\\,\\Delta y_1$，$(x_2, y_1)$ 配 $\\Delta x_2\\,\\Delta y_1$，依此类推。",
      ),
      generate(rng: Rng): Problem {
        const x1 = rng.int(1, 3);
        const dx2 = rng.int(1, 3);
        const x2 = x1 + dx2;
        const y1 = rng.int(1, 3);
        const dy2 = rng.int(1, 3);
        const y2 = y1 + dy2;
        const a = rng.int(1, 4);
        const b = rng.int(1, 4);
        const v = [a * x1 + b * y1, a * x2 + b * y1, a * x1 + b * y2, a * x2 + b * y2] as const;
        const t1 = v[0] * x1 * y1;
        const t2 = v[1] * dx2 * y1;
        const t3 = v[2] * x1 * dy2;
        const t4 = v[3] * dx2 * dy2;
        const ans = t1 + t2 + t3 + t4;
        const lower = a * x1 * dx2 * y1 + b * y1 * x1 * dy2 + (a * x1 + b * y1) * dx2 * dy2;
        const values = v[0] + v[1] + v[2] + v[3];
        const exact = Q.of(a * x2 * x2 * y2 + b * y2 * y2 * x2, 2);
        return numberProblem({
          prompt: t(
            `Find the upper Riemann sum $U(f, P)$ for $f(x, y) = ${poly([a, "x"], [b, "y"])}$ on $R = [0, ${x2}] \\times [0, ${y2}]$ with partition points $x \\in \\{0, ${x1}, ${x2}\\}$ and $y \\in \\{0, ${y1}, ${y2}\\}$.`,
            `对于函数 $f(x, y) = ${poly([a, "x"], [b, "y"])}$，在矩形区域 $R = [0, ${x2}] \\times [0, ${y2}]$ 上，采用分割节点 $x \\in \\{0, ${x1}, ${x2}\\}$ 与 $y \\in \\{0, ${y1}, ${y2}\\}$，求其上黎曼和 $U(f, P)$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              lower,
              "That uses the lower-left corners, where $f$ is smallest; that is the lower sum.",
              "那是用了左下角，$f$ 在那里最小；那是下和。",
            ),
            why(
              values,
              "That adds the corner values without multiplying each by the area of its cell.",
              "那是只把角点的值相加，没有乘以各自小格的面积。",
            ),
            why(
              Q.of(values * x2 * y2, 4),
              `That gives every cell the same area $\\frac{${x2 * y2}}{4}$; the cells have different areas $\\Delta x_i\\,\\Delta y_j$.`,
              `那是给每格同样的面积 $\\frac{${x2 * y2}}{4}$；各格面积 $\\Delta x_i\\,\\Delta y_j$ 并不相同。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the widths", "求宽度"],
                t(
                  `$\\Delta x_1 = ${x1}$, $\\Delta x_2 = ${dx2}$, $\\Delta y_1 = ${y1}$, $\\Delta y_2 = ${dy2}$.`,
                  `$\\Delta x_1 = ${x1}$，$\\Delta x_2 = ${dx2}$，$\\Delta y_1 = ${y1}$，$\\Delta y_2 = ${dy2}$。`,
                ),
              ],
              [
                ["Use the upper-right corners", "用右上角"],
                t(
                  `$f$ is increasing, so the maxima are $f(${x1}, ${y1}) = ${v[0]}$, $f(${x2}, ${y1}) = ${v[1]}$, $f(${x1}, ${y2}) = ${v[2]}$, $f(${x2}, ${y2}) = ${v[3]}$.`,
                  `$f$ 递增，所以各最大值为 $f(${x1}, ${y1}) = ${v[0]}$，$f(${x2}, ${y1}) = ${v[1]}$，$f(${x1}, ${y2}) = ${v[2]}$，$f(${x2}, ${y2}) = ${v[3]}$。`,
                ),
              ],
              [
                ["Weight by the areas", "乘以面积"],
                t(
                  `$U = ${v[0]} \\cdot ${x1 * y1} + ${v[1]} \\cdot ${dx2 * y1} + ${v[2]} \\cdot ${x1 * dy2} + ${v[3]} \\cdot ${dx2 * dy2} = ${ans}$.`,
                  `$U = ${v[0]} \\cdot ${x1 * y1} + ${v[1]} \\cdot ${dx2 * y1} + ${v[2]} \\cdot ${x1 * dy2} + ${v[3]} \\cdot ${dx2 * dy2} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `The exact volume is $\\int_0^{${x2}}\\int_0^{${y2}} f\\,dy\\,dx = ${exact.toLatex()}$, and $${ans} \\ge ${exact.toLatex()}$.`,
              `精确体积为 $\\int_0^{${x2}}\\int_0^{${y2}} f\\,dy\\,dx = ${exact.toLatex()}$，而 $${ans} \\ge ${exact.toLatex()}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "an-upper-sum-for-xy-over-an-irregular-grid",
      title: t("An upper sum for $cxy$ over an irregular grid", "不规则网格上 $cxy$ 的上和"),
      explanation: t(
        "For $f(x, y) = cxy$ with $c > 0$ the maximum on each subrectangle is at its upper-right corner $(x_i, y_j)$. Because $f$ is a product, the upper sum factors into one sum for $x$ and one for $y$:\n\n$$U = c\\left(\\sum_i x_i\\,\\Delta x_i\\right)\\left(\\sum_j y_j\\,\\Delta y_j\\right).$$\n\nThis saves computing every subrectangle separately. For $xy$ with $x$ cut at $0, 4, 5$ and $y$ at $0, 1, 3$, the factors are $4 \\cdot 4 + 5 \\cdot 1 = 21$ and $1 \\cdot 1 + 3 \\cdot 2 = 7$, so $U = 147$.\n\n> **Watch out.** Each cut point is multiplied by the width of the piece that ends at it: $x_i$ goes with $\\Delta x_i = x_i - x_{i-1}$, not with the next width.",
        "对 $f(x, y) = cxy$（$c > 0$），每个子矩形上的最大值在右上角 $(x_i, y_j)$。由于 $f$ 是乘积，上和可分解为 $x$ 的和与 $y$ 的和之积：\n\n$$U = c\\left(\\sum_i x_i\\,\\Delta x_i\\right)\\left(\\sum_j y_j\\,\\Delta y_j\\right)$$\n\n这样无需逐个计算每个子矩形。对 $xy$，$x$ 在 $0, 4, 5$ 处分割，$y$ 在 $0, 1, 3$ 处分割，两个因子为 $4 \\cdot 4 + 5 \\cdot 1 = 21$ 和 $1 \\cdot 1 + 3 \\cdot 2 = 7$，所以 $U = 147$。\n\n> **注意。** 每个分点乘以以它为右端的那一段的宽度：$x_i$ 配 $\\Delta x_i = x_i - x_{i-1}$，而不是下一段的宽度。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(1, 3);
        const x1 = rng.int(1, 3);
        const x2 = x1 + rng.int(1, 3);
        const y1 = rng.int(1, 3);
        const y2 = y1 + rng.int(1, 3);
        const sx = x1 * x1 + x2 * (x2 - x1);
        const sy = y1 * y1 + y2 * (y2 - y1);
        const ans = c * sx * sy;
        const exact = Q.of(c * x2 * x2 * y2 * y2, 4);
        return numberProblem({
          prompt: t(
            `Find the upper Riemann sum of $f(x, y) = ${coef(c)}xy$ on $[0, ${x2}] \\times [0, ${y2}]$ for the partition with $x \\in \\{0, ${x1}, ${x2}\\}$ and $y \\in \\{0, ${y1}, ${y2}\\}$.`,
            `对 $x \\in \\{0, ${x1}, ${x2}\\}$、$y \\in \\{0, ${y1}, ${y2}\\}$ 的划分，求 $f(x, y) = ${coef(c)}xy$ 在 $[0, ${x2}] \\times [0, ${y2}]$ 上的上黎曼和。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              c * x1 * y1 * (x2 - x1) * (y2 - y1),
              "That uses the lower-left corners; that is the lower sum.",
              "那是用了左下角；那是下和。",
            ),
            why(
              c * x2 * x2 * y2 * y2,
              `That uses the largest value $f(${x2}, ${y2})$ for the whole rectangle; each cell has its own maximum.`,
              `那是对整个矩形都用最大值 $f(${x2}, ${y2})$；每格有自己的最大值。`,
            ),
            why(
              c * (x1 + x2) * (y1 + y2),
              "That adds the cut points without multiplying each by its width.",
              "那是把分点相加，没有乘以各自的宽度。",
            ),
            why(
              c * sx * y2,
              `The $y$ factor must also be a sum of $y_j\\,\\Delta y_j$, which is $${sy}$, not $${y2}$.`,
              `$y$ 的因子也必须是 $y_j\\,\\Delta y_j$ 之和，即 $${sy}$，而不是 $${y2}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Factor the sum", "分解和式"],
                t(
                  `$U = ${c}\\left(\\sum_i x_i\\,\\Delta x_i\\right)\\left(\\sum_j y_j\\,\\Delta y_j\\right)$ because $f$ is a product and each maximum is at an upper-right corner.`,
                  `因为 $f$ 是乘积，且每个最大值在右上角，所以 $U = ${c}\\left(\\sum_i x_i\\,\\Delta x_i\\right)\\left(\\sum_j y_j\\,\\Delta y_j\\right)$。`,
                ),
              ],
              [
                ["Evaluate each factor", "计算每个因子"],
                t(
                  `$\\sum_i x_i\\,\\Delta x_i = ${x1} \\cdot ${x1} + ${x2} \\cdot ${x2 - x1} = ${sx}$ and $\\sum_j y_j\\,\\Delta y_j = ${y1} \\cdot ${y1} + ${y2} \\cdot ${y2 - y1} = ${sy}$.`,
                  `$\\sum_i x_i\\,\\Delta x_i = ${x1} \\cdot ${x1} + ${x2} \\cdot ${x2 - x1} = ${sx}$，$\\sum_j y_j\\,\\Delta y_j = ${y1} \\cdot ${y1} + ${y2} \\cdot ${y2 - y1} = ${sy}$。`,
                ),
              ],
              [
                ["Multiply", "相乘"],
                t(`$U = ${c} \\cdot ${sx} \\cdot ${sy} = ${ans}$.`, `$U = ${c} \\cdot ${sx} \\cdot ${sy} = ${ans}$。`),
              ],
            ],
            t(
              `The exact volume is $${c} \\cdot \\frac{${x2}^2}{2} \\cdot \\frac{${y2}^2}{2} = ${exact.toLatex()}$, and $${ans} \\ge ${exact.toLatex()}$.`,
              `精确体积为 $${c} \\cdot \\frac{${x2}^2}{2} \\cdot \\frac{${y2}^2}{2} = ${exact.toLatex()}$，而 $${ans} \\ge ${exact.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** definingDoubleIntegralsUsingLowerAndUpperRiemannSums formalizes double integrals via Darboux sums. */
export const definingDoubleIntegralsUsingLowerAndUpperRiemannSums: TopicDef = {
  id: "defining-double-integrals-using-lower-and-upper-riemann-sums",
  title: t("Defining Double Integrals Using Lower and Upper Riemann Sums", "利用上下黎曼和定义二重积分"),
  summary: t(
    "A bounded function $f$ is integrable on $R$ if $\\sup_P L(f, P) = \\inf_P U(f, P)$; the common value is the double integral $\\iint_R f\\,dA$.",
    "若有界函数 $f$ 满足 $\\sup_P L(f, P) = \\inf_P U(f, P)$，则 $f$ 在 $R$ 上可积，这个公共值就是二重积分 $\\iint_R f\\,dA$。",
  ),
  intro: t(
    "Take $f(x, y) = x + y$ on $[0, 1]^2$ with a $2 \\times 2$ grid, so $\\Delta A = \\frac{1}{4}$. The lower-left corner values are $0, \\frac{1}{2}, \\frac{1}{2}, 1$, giving $L = \\frac{1}{2}$, and the upper-right values are $1, \\frac{3}{2}, \\frac{3}{2}, 2$, giving $U = \\frac{3}{2}$. The gap is $U - L = 1$; with $n$ parts each way it is $\\frac{2}{n}$, which shrinks to $0$, so $f$ is integrable.\n\nCheck: the integral $\\int_0^1\\int_0^1 (x + y)\\,dy\\,dx = 1$ lies between the two sums, $\\frac{1}{2} \\le 1 \\le \\frac{3}{2}$.\n\nIn this lesson we measure the gap between upper and lower sums and use it to decide integrability and how fine a partition must be.",
    "取 $[0, 1]^2$ 上的 $f(x, y) = x + y$，作 $2 \\times 2$ 网格，$\\Delta A = \\frac{1}{4}$。左下角的值为 $0, \\frac{1}{2}, \\frac{1}{2}, 1$，得 $L = \\frac{1}{2}$；右上角的值为 $1, \\frac{3}{2}, \\frac{3}{2}, 2$，得 $U = \\frac{3}{2}$。差为 $U - L = 1$；每个方向分 $n$ 份时差为 $\\frac{2}{n}$，趋于 $0$，所以 $f$ 可积。\n\n检验：积分 $\\int_0^1\\int_0^1 (x + y)\\,dy\\,dx = 1$ 位于两个和之间，$\\frac{1}{2} \\le 1 \\le \\frac{3}{2}$。\n\n本课我们度量上和与下和之差，并用它判断可积性以及分割需要多细。",
  ),
  prerequisites: ["lower-riemann-sums-over-general-rectangular-partitions", "upper-riemann-sums-over-general-rectangular-partitions"],
  encompasses: [
    { topic: "lower-riemann-sums-over-general-rectangular-partitions", weight: 0.3 },
    { topic: "upper-riemann-sums-over-general-rectangular-partitions", weight: 0.3 },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "riemann-integrability-criterion-for-double-integrals",
      title: t("Riemann integrability criterion for double integrals", "二重积分的黎曼可积性准则"),
      explanation: t(
        "A function $f$ is Riemann integrable over $R$ if and only if for every $\\varepsilon > 0$, there exists a partition $P$ such that $U(f, P) - L(f, P) < \\varepsilon$. For $f(x, y) = ax + by$ on $[0, W] \\times [0, H]$ with regular $n \\times n$ subdivisions:\n\n$$U(f, P_n) - L(f, P_n) = (aW + bH)\\frac{WH}{n}.$$\n\nFor $5x + y$ on $[0, 1] \\times [0, 2]$ with $n = 4$, the gap is $(5 + 2) \\cdot \\frac{2}{4} = \\frac{7}{2}$.\n\n> **Watch out.** On each cell $f$ rises by $a\\frac{W}{n} + b\\frac{H}{n}$, and the cells' areas add up to $WH$; so the gap falls like $\\frac{1}{n}$, not $\\frac{1}{n^2}$.",
        "函数 $f$ 在矩形 $R$ 上黎曼可积，当且仅当对任意 $\\varepsilon > 0$，存在分割 $P$ 使得 $U(f, P) - L(f, P) < \\varepsilon$。对于在 $[0, W] \\times [0, H]$ 上采用 $n \\times n$ 等距分割的函数 $f(x, y) = ax + by$：\n\n$$U(f, P_n) - L(f, P_n) = (aW + bH)\\frac{WH}{n}$$\n\n对 $[0, 1] \\times [0, 2]$ 上的 $5x + y$，$n = 4$ 时差为 $(5 + 2) \\cdot \\frac{2}{4} = \\frac{7}{2}$。\n\n> **注意。** 在每格上 $f$ 增加 $a\\frac{W}{n} + b\\frac{H}{n}$，而各格面积之和是 $WH$；所以差按 $\\frac{1}{n}$ 减小，而不是 $\\frac{1}{n^2}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 4);
        const b = rng.int(1, 4);
        const W = rng.int(2, 5);
        const H = rng.int(2, 5);
        const n = rng.int(2, 10);
        const rise = a * W + b * H;
        const num = rise * W * H;
        const ans = Q.of(num, n);
        return numberProblem({
          prompt: t(
            `For $f(x, y) = ${poly([a, "x"], [b, "y"])}$ on $R = [0, ${W}] \\times [0, ${H}]$, find the difference $U(f, P_n) - L(f, P_n)$ between the upper and lower Riemann sums under an $n \\times n$ regular partition with $n = ${n}$.`,
            `对于矩形区域 $R = [0, ${W}] \\times [0, ${H}]$ 上的函数 $f(x, y) = ${poly([a, "x"], [b, "y"])}$，求在 $n = ${n}$ 的 $n \\times n$ 等距分割下，上下黎曼和之差 $U(f, P_n) - L(f, P_n)$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(num),
              `That is the gap for a single cell; with $${n}$ parts each way the rise on each cell is divided by $${n}$.`,
              `那是只有一格时的差；每个方向分成 $${n}$ 份时，每格内的增量要除以 $${n}$。`,
            ),
            why(
              Q.of(num, n * n),
              `That divides by $n^2 = ${n * n}$; the areas still add up to $${W * H}$, so only the rise per cell shrinks, by $\\frac{1}{${n}}$.`,
              `那是除以 $n^2 = ${n * n}$；各格面积之和仍为 $${W * H}$，只有每格的增量缩小为 $\\frac{1}{${n}}$。`,
            ),
            why(
              Q.of((a + b) * W * H, n),
              `The rise across a cell is $${a} \\cdot \\frac{${W}}{${n}} + ${b} \\cdot \\frac{${H}}{${n}}$, so the side lengths multiply the coefficients.`,
              `一格内的增量是 $${a} \\cdot \\frac{${W}}{${n}} + ${b} \\cdot \\frac{${H}}{${n}}$，所以边长要乘到系数上。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the rise on a cell", "求一格内的增量"],
                t(
                  `On a cell $\\frac{${W}}{${n}}$ by $\\frac{${H}}{${n}}$, $f$ rises from its lower-left to its upper-right corner by $${a} \\cdot \\frac{${W}}{${n}} + ${b} \\cdot \\frac{${H}}{${n}} = \\frac{${rise}}{${n}}$.`,
                  `在 $\\frac{${W}}{${n}}$ 乘 $\\frac{${H}}{${n}}$ 的小格上，$f$ 从左下角到右上角增加 $${a} \\cdot \\frac{${W}}{${n}} + ${b} \\cdot \\frac{${H}}{${n}} = \\frac{${rise}}{${n}}$。`,
                ),
              ],
              [
                ["Add over the cells", "对各格求和"],
                t(
                  `Every cell has the same rise, and the areas add up to $${W * H}$, so $U - L = \\frac{${rise}}{${n}} \\cdot ${W * H} = ${ans.toLatex()}$.`,
                  `每格的增量相同，面积之和为 $${W * H}$，所以 $U - L = \\frac{${rise}}{${n}} \\cdot ${W * H} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `With one cell the gap would be $f(${W}, ${H}) \\cdot ${W * H} = ${num}$, and $${n}$ parts each way divide it by $${n}$: $\\frac{${num}}{${n}} = ${ans.toLatex()}$.`,
              `只有一格时差为 $f(${W}, ${H}) \\cdot ${W * H} = ${num}$，每个方向分成 $${n}$ 份就把它除以 $${n}$：$\\frac{${num}}{${n}} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-gap-between-upper-and-lower-sums-for-xy",
      title: t("The gap between upper and lower sums for $cxy$", "$cxy$ 上和与下和之差"),
      explanation: t(
        "A function is integrable when $U(f, P_n) - L(f, P_n) \\to 0$. For $f(x, y) = cxy$ on $[0, a] \\times [0, b]$ with an $n \\times n$ regular partition, each piece contributes $c(x_iy_j - x_{i-1}y_{j-1})\\Delta A$. Summing $ij - (i-1)(j-1) = i + j - 1$ over all $i, j$ gives $n^3$, so\n\n$$U - L = \\frac{c\\,a^2b^2}{n^4} \\cdot n^3 = \\frac{c\\,a^2b^2}{n},$$\n\nwhich tends to $0$ as $n \\to \\infty$. For $5xy$ on $[0, 1]^2$ with $n = 2$, the upper and lower corner values of $xy$ add to $\\frac{9}{4}$ and $\\frac{1}{4}$, so $U - L = 5 \\cdot 2 \\cdot \\frac{1}{4} = \\frac{5}{2}$.\n\n> **Watch out.** The difference $ij - (i - 1)(j - 1)$ is $i + j - 1$, not $i + j$; and $x_iy_j$ carries $\\frac{ab}{n^2}$ while $\\Delta A$ carries another $\\frac{ab}{n^2}$, which is where $a^2b^2$ comes from.",
        "当 $U(f, P_n) - L(f, P_n) \\to 0$ 时函数可积。对 $[0, a] \\times [0, b]$ 上的 $f(x, y) = cxy$ 作 $n \\times n$ 等分，每块贡献 $c(x_iy_j - x_{i-1}y_{j-1})\\Delta A$。对所有 $i, j$ 求 $ij - (i-1)(j-1) = i + j - 1$ 的和得 $n^3$，所以\n\n$$U - L = \\frac{c\\,a^2b^2}{n^4} \\cdot n^3 = \\frac{c\\,a^2b^2}{n},$$\n\n当 $n \\to \\infty$ 时趋于 $0$。对 $[0, 1]^2$ 上的 $5xy$，$n = 2$ 时 $xy$ 在上、下角点的值之和为 $\\frac{9}{4}$ 和 $\\frac{1}{4}$，所以 $U - L = 5 \\cdot 2 \\cdot \\frac{1}{4} = \\frac{5}{2}$。\n\n> **注意。** $ij - (i - 1)(j - 1)$ 等于 $i + j - 1$，不是 $i + j$；$x_iy_j$ 带有 $\\frac{ab}{n^2}$，$\\Delta A$ 又带一个 $\\frac{ab}{n^2}$，这就是 $a^2b^2$ 的来源。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(1, 3);
        const a = rng.int(1, 4);
        const b = rng.int(1, 4);
        const n = rng.int(2, 6);
        const k = c * a * a * b * b;
        const ans = Q.of(k, n);
        return numberProblem({
          prompt: t(
            `For $f(x, y) = ${coef(c)}xy$ on $[0, ${a}] \\times [0, ${b}]$, find $U(f, P) - L(f, P)$ for the regular $${n} \\times ${n}$ partition $P$.`,
            `对 $[0, ${a}] \\times [0, ${b}]$ 上的 $f(x, y) = ${coef(c)}xy$，求 $${n} \\times ${n}$ 等分划分 $P$ 的 $U(f, P) - L(f, P)$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(k, n * n),
              "That takes $\\sum (i + j - 1)$ to be $n^2$; it is $n^3$, one $n$ for each of $i$, $j$ and the number of terms.",
              "那是把 $\\sum (i + j - 1)$ 当成 $n^2$；它是 $n^3$。",
            ),
            why(
              Q.of(c * a * b, n),
              `That keeps only one factor $${a * b}$; the corner values carry $${a * b}$ and the cell area carries $${a * b}$ again.`,
              `那是只保留了一个因子 $${a * b}$；角点的值带有 $${a * b}$，小格面积又带有 $${a * b}$。`,
            ),
            why(
              Q.of(k * (n + 1), n * n),
              "That uses $ij - (i - 1)(j - 1) = i + j$; the product $(i - 1)(j - 1)$ also contributes $+1$, so it is $i + j - 1$.",
              "那是取 $ij - (i - 1)(j - 1) = i + j$；乘积 $(i - 1)(j - 1)$ 还贡献 $+1$，所以是 $i + j - 1$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Write the gap on a cell", "写出一格上的差"],
                t(
                  `With $h = \\frac{${a}}{${n}}$ and $k = \\frac{${b}}{${n}}$, cell $(i, j)$ contributes $${c}hk\\,[ij - (i - 1)(j - 1)] \\cdot hk = ${c}h^2k^2(i + j - 1)$.`,
                  `取 $h = \\frac{${a}}{${n}}$，$k = \\frac{${b}}{${n}}$，第 $(i, j)$ 格贡献 $${c}hk\\,[ij - (i - 1)(j - 1)] \\cdot hk = ${c}h^2k^2(i + j - 1)$。`,
                ),
              ],
              [
                ["Add over the cells", "对各格求和"],
                t(
                  `$\\sum_{i, j = 1}^{${n}} (i + j - 1) = ${n}^3$, so $U - L = ${c} \\cdot \\frac{${a * a} \\cdot ${b * b}}{${n}^4} \\cdot ${n}^3 = ${ans.toLatex()}$.`,
                  `$\\sum_{i, j = 1}^{${n}} (i + j - 1) = ${n}^3$，所以 $U - L = ${c} \\cdot \\frac{${a * a} \\cdot ${b * b}}{${n}^4} \\cdot ${n}^3 = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `With a single cell the gap would be $f(${a}, ${b}) \\cdot ${a * b} = ${k}$, and the formula $\\frac{${k}}{n}$ gives that at $n = 1$.`,
              `只有一格时差为 $f(${a}, ${b}) \\cdot ${a * b} = ${k}$，公式 $\\frac{${k}}{n}$ 在 $n = 1$ 时正好给出它。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 3.14 Double Integrals
// ---------------------------------------------------------------------------

/** doubleIntegralsOverRectangularDomains computes iterated integrals using Fubini's theorem. */
export const doubleIntegralsOverRectangularDomains: TopicDef = {
  id: "double-integrals-over-rectangular-domains",
  title: t("Double Integrals Over Rectangular Domains", "矩形区域上的二重积分"),
  summary: t(
    "By Fubini's theorem, the double integral of a continuous function over [a, b] × [c, d] equals the iterated integral in either order.",
    "由富比尼定理，连续函数在矩形 [a, b] × [c, d] 上的二重积分等于按任意顺序计算的二次积分。",
  ),
  intro: t(
    "Evaluate $\\iint_R (2x + 4y)\\,dA$ over $R = [1, 2] \\times [0, 3]$. Integrating in $y$ first, with $x$ held fixed, gives $\\int_0^3 (2x + 4y)\\,dy = 6x + 18$. Then $\\int_1^2 (6x + 18)\\,dx = 9 + 18 = 27$.\n\nCheck: Fubini's theorem allows the other order. $\\int_1^2 (2x + 4y)\\,dx = 3 + 4y$, and $\\int_0^3 (3 + 4y)\\,dy = 9 + 18 = 27$.\n\nIn this lesson we evaluate double integrals over rectangles as iterated integrals, one variable at a time.",
    "计算 $\\iint_R (2x + 4y)\\,dA$，其中 $R = [1, 2] \\times [0, 3]$。先固定 $x$ 对 $y$ 积分，得 $\\int_0^3 (2x + 4y)\\,dy = 6x + 18$。再求 $\\int_1^2 (6x + 18)\\,dx = 9 + 18 = 27$。\n\n检验：富比尼定理允许换一个次序。$\\int_1^2 (2x + 4y)\\,dx = 3 + 4y$，而 $\\int_0^3 (3 + 4y)\\,dy = 9 + 18 = 27$。\n\n本课我们把矩形上的二重积分写成二次积分，一次对一个变量积分。",
  ),
  prerequisites: ["defining-double-integrals-using-lower-and-upper-riemann-sums"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-iterated-integrals-over-rectangles",
      figure: multivariableDrawings3["double-integrals-over-rectangular-domains#evaluating-iterated-integrals-over-rectangles"],
      title: t("Evaluating iterated integrals over rectangles", "计算矩形区域上的二次积分"),
      explanation: t(
        "Integrate with respect to one variable while treating the other as a constant, then integrate the result with respect to the remaining variable. For $R = [a, b] \\times [c, d]$, evaluate by integrating with respect to $y$ then $x$:\n\n$$\\iint_R (px + qy)\\,dA = \\int_a^b \\left[\\int_c^d (px + qy)\\,dy\\right]dx = p\\frac{b^2 - a^2}{2}(d - c) + q(b - a)\\frac{d^2 - c^2}{2}.$$\n\nFor $x + 5y$ on $[0, 2] \\times [0, 1]$ this is $1 \\cdot 2 \\cdot 1 + 5 \\cdot 2 \\cdot \\frac{1}{2} = 7$.\n\n> **Watch out.** The antiderivative $\\frac{y^2}{2}$ evaluated from $c$ to $d$ gives $\\frac{d^2 - c^2}{2}$, not $\\frac{(d - c)^2}{2}$. And in the inner integral $px$ is a constant, so it is multiplied by the length $d - c$.",
        "先对一个变量积分，把另一个变量当作常数，再对所得结果关于剩下的变量积分。对于 $R = [a, b] \\times [c, d]$，先对 $y$ 积分再对 $x$ 积分：\n\n$$\\iint_R (px + qy)\\,dA = \\int_a^b \\left[\\int_c^d (px + qy)\\,dy\\right]dx = p\\frac{b^2 - a^2}{2}(d - c) + q(b - a)\\frac{d^2 - c^2}{2}$$\n\n对 $[0, 2] \\times [0, 1]$ 上的 $x + 5y$，结果为 $1 \\cdot 2 \\cdot 1 + 5 \\cdot 2 \\cdot \\frac{1}{2} = 7$。\n\n> **注意。** 原函数 $\\frac{y^2}{2}$ 从 $c$ 到 $d$ 取值得 $\\frac{d^2 - c^2}{2}$，不是 $\\frac{(d - c)^2}{2}$。在内层积分中 $px$ 是常数，所以要乘以长度 $d - c$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(0, 3);
        const b = a + rng.int(1, 4);
        const c = rng.int(0, 3);
        const d = c + rng.int(1, 4);
        const p = rng.nonZero(-3, 3);
        const q = rng.nonZero(-3, 3);
        const intX = (b * b - a * a) * (d - c);
        const intY = (b - a) * (d * d - c * c);
        const num = p * intX + q * intY;
        const ans = Q.of(num, 2);
        const f = poly([p, "x"], [q, "y"]);
        const inner = poly([p * (d - c), "x"], [Q.of(q * (d * d - c * c), 2), ""]);
        const partX = Q.of(p * intX, 2);
        const partY = Q.of(q * intY, 2);
        return numberProblem({
          prompt: t(
            `Evaluate the double integral $\\iint_R (${f})\\,dA$ over the rectangular region $R = [${a}, ${b}] \\times [${c}, ${d}]$.`,
            `计算二重积分 $\\iint_R (${f})\\,dA$，其中矩形区域为 $R = [${a}, ${b}] \\times [${c}, ${d}]$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(num),
              "The factors $\\frac{1}{2}$ from the antiderivatives $\\frac{x^2}{2}$ and $\\frac{y^2}{2}$ are missing.",
              "少了原函数 $\\frac{x^2}{2}$ 与 $\\frac{y^2}{2}$ 带来的因子 $\\frac{1}{2}$。",
            ),
            why(
              Q.of(p * (b - a) ** 2 * (d - c) + q * (b - a) * (d - c) ** 2, 2),
              "That squares the lengths $b - a$ and $d - c$; the antiderivatives give differences of squares, $b^2 - a^2$ and $d^2 - c^2$.",
              "那是把长度 $b - a$、$d - c$ 平方；原函数给出的是平方差 $b^2 - a^2$ 与 $d^2 - c^2$。",
            ),
            why(
              Q.of(p * (b * b - a * a) + q * intY, 2),
              `In the inner integral $${poly([p, "x"])}$ is a constant, so it is multiplied by the length $${d - c}$ of the $y$ interval.`,
              `在内层积分中 $${poly([p, "x"])}$ 是常数，所以要乘以 $y$ 区间的长度 $${d - c}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Integrate in y", "对 y 积分"],
                t(
                  `$\\int_{${c}}^{${d}} (${f})\\,dy = (${poly([p, "x"])})(${d - c}) + ${paren(q)} \\cdot \\frac{${d * d - c * c}}{2} = ${inner}$.`,
                  `$\\int_{${c}}^{${d}} (${f})\\,dy = (${poly([p, "x"])})(${d - c}) + ${paren(q)} \\cdot \\frac{${d * d - c * c}}{2} = ${inner}$。`,
                ),
              ],
              [
                ["Integrate in x", "对 x 积分"],
                t(
                  `$\\int_{${a}}^{${b}} \\left(${inner}\\right) dx = ${ans.toLatex()}$.`,
                  `$\\int_{${a}}^{${b}} \\left(${inner}\\right) dx = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `In the other order, $\\int_{${a}}^{${b}} (${f})\\,dx = ${poly([Q.of(p * (b * b - a * a), 2), ""], [q * (b - a), "y"])}$, and integrating over $[${c}, ${d}]$ gives $${partX.toLatex()} + ${paren(partY)} = ${ans.toLatex()}$.`,
              `换个次序，$\\int_{${a}}^{${b}} (${f})\\,dx = ${poly([Q.of(p * (b * b - a * a), 2), ""], [q * (b - a), "y"])}$，再在 $[${c}, ${d}]$ 上积分得 $${partX.toLatex()} + ${paren(partY)} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "separable-double-integrals-of-monomials",
      figure: multivariableDrawings3["double-integrals-over-rectangular-domains#separable-double-integrals-of-monomials"],
      title: t("Separable double integrals of monomials", "单项式的可分离二重积分"),
      explanation: t(
        "When the integrand is a product $g(x)h(y)$ and the region is a rectangle, Fubini's theorem lets the double integral split into a product of single integrals:\n\n$$\\iint_{[0, a] \\times [0, b]} c\\,x^py^q\\,dA = c\\cdot\\frac{a^{p+1}}{p+1}\\cdot\\frac{b^{q+1}}{q+1}.$$\n\nThis only works on rectangles, where the limits of one variable do not depend on the other. For $5x^2y$ on $[0, 3] \\times [0, 2]$ the factors are $\\int_0^3 x^2\\,dx = 9$ and $\\int_0^2 y\\,dy = 2$, so the integral is $5 \\cdot 9 \\cdot 2 = 90$.\n\n> **Watch out.** Each factor raises the power by one and divides by the new power. The two single integrals are multiplied, not added.",
        "当被积函数是乘积 $g(x)h(y)$ 且区域为矩形时，由富比尼定理，二重积分可拆成单重积分之积：\n\n$$\\iint_{[0, a] \\times [0, b]} c\\,x^py^q\\,dA = c\\cdot\\frac{a^{p+1}}{p+1}\\cdot\\frac{b^{q+1}}{q+1}$$\n\n这只适用于矩形区域，因为此时一个变量的积分限不依赖另一个变量。对 $[0, 3] \\times [0, 2]$ 上的 $5x^2y$，两个因子是 $\\int_0^3 x^2\\,dx = 9$ 和 $\\int_0^2 y\\,dy = 2$，所以积分为 $5 \\cdot 9 \\cdot 2 = 90$。\n\n> **注意。** 每个因子都要把次数加一，再除以新的次数。两个单重积分要相乘，而不是相加。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(1, 4);
        const p = rng.int(1, 2);
        const q = rng.int(1, 3);
        const a = rng.int(1, 3);
        const b = rng.int(1, 3);
        const ix = Q.of(a ** (p + 1), p + 1);
        const iy = Q.of(b ** (q + 1), q + 1);
        const ans = ix.mul(iy).mul(Q.of(c));
        const mono = (v: string, e: number) => (e === 1 ? v : `${v}^{${e}}`);
        const integrand = `${coef(c)}${mono("x", p)}${mono("y", q)}`;
        const lead = c === 1 ? "" : `${c} \\cdot `;
        const bound = c * a ** p * b ** q * a * b;
        return numberProblem({
          prompt: t(
            `Evaluate $\\iint_R ${integrand}\\,dA$ over $R = [0, ${a}] \\times [0, ${b}]$.`,
            `计算 $\\iint_R ${integrand}\\,dA$，其中 $R = [0, ${a}] \\times [0, ${b}]$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(c * a ** (p + 1) * b ** (q + 1)),
              `The antiderivatives divide by the new powers $${p + 1}$ and $${q + 1}$; those divisions are missing.`,
              `原函数要除以新的次数 $${p + 1}$ 和 $${q + 1}$；这两个除法漏了。`,
            ),
            why(
              Q.of(c * a ** p * b ** q),
              `That evaluates the integrand at the corner $(${a}, ${b})$ instead of integrating it.`,
              `那是在角点 $(${a}, ${b})$ 处取被积函数的值，而不是积分。`,
            ),
            why(
              ix.add(iy).mul(Q.of(c)),
              "That adds the two single integrals; for a product integrand they multiply.",
              "那是把两个单重积分相加；被积函数是乘积时它们要相乘。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Separate the integral", "分离积分"],
                t(
                  `The region is a rectangle and the integrand is a product, so $\\iint_R ${integrand}\\,dA = ${lead}\\int_0^{${a}} ${mono("x", p)}\\,dx \\cdot \\int_0^{${b}} ${mono("y", q)}\\,dy$.`,
                  `区域是矩形，被积函数是乘积，所以 $\\iint_R ${integrand}\\,dA = ${lead}\\int_0^{${a}} ${mono("x", p)}\\,dx \\cdot \\int_0^{${b}} ${mono("y", q)}\\,dy$。`,
                ),
              ],
              [
                ["Evaluate each factor", "计算每个因子"],
                t(
                  `$\\int_0^{${a}} ${mono("x", p)}\\,dx = \\frac{${a}^{${p + 1}}}{${p + 1}} = ${ix.toLatex()}$ and $\\int_0^{${b}} ${mono("y", q)}\\,dy = \\frac{${b}^{${q + 1}}}{${q + 1}} = ${iy.toLatex()}$, so the integral is $${lead}${ix.toLatex()} \\cdot ${iy.toLatex()} = ${ans.toLatex()}$.`,
                  `$\\int_0^{${a}} ${mono("x", p)}\\,dx = \\frac{${a}^{${p + 1}}}{${p + 1}} = ${ix.toLatex()}$，$\\int_0^{${b}} ${mono("y", q)}\\,dy = \\frac{${b}^{${q + 1}}}{${q + 1}} = ${iy.toLatex()}$，所以积分为 $${lead}${ix.toLatex()} \\cdot ${iy.toLatex()} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The integrand is at most $${c * a ** p * b ** q}$ on $R$, whose area is $${a * b}$, so the integral can be at most $${bound}$; indeed $${ans.toLatex()} \\le ${bound}$.`,
              `被积函数在 $R$ 上至多为 $${c * a ** p * b ** q}$，$R$ 的面积为 $${a * b}$，所以积分至多为 $${bound}$；确实 $${ans.toLatex()} \\le ${bound}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** doubleIntegralsOverNonRectangularDomains evaluates integrals over non-rectangular regions. */
export const doubleIntegralsOverNonRectangularDomains: TopicDef = {
  id: "double-integrals-over-non-rectangular-domains",
  title: t("Double Integrals Over Non-Rectangular Domains", "非矩形区域上的二重积分"),
  summary: t(
    "Double integrals over non-rectangular regions are evaluated by describing the domain using variable limits of integration.",
    "通过用变量积分限刻画非矩形区域，可将其上的二重积分转化为二次积分进行计算。",
  ),
  intro: t(
    "Integrate $y$ over the triangle bounded by $x = 0$, $y = 0$ and $x + y = 3$. At a fixed $x$ the triangle runs from $y = 0$ up to $y = 3 - x$, so the inner limits depend on $x$: $\\int_0^3 \\int_0^{3 - x} y\\,dy\\,dx = \\int_0^3 \\frac{(3 - x)^2}{2}\\,dx = \\frac{27}{6} = \\frac{9}{2}$.\n\nCheck: describe the triangle the other way, $0 \\le y \\le 3$ and $0 \\le x \\le 3 - y$. Then $\\int_0^3 y(3 - y)\\,dy = \\frac{27}{2} - 9 = \\frac{9}{2}$.\n\nIn this lesson we integrate over regions that are not rectangles by letting the inner limits depend on the outer variable.",
    "在由 $x = 0$、$y = 0$ 和 $x + y = 3$ 围成的三角形上对 $y$ 积分。固定 $x$ 时，三角形从 $y = 0$ 延伸到 $y = 3 - x$，所以内层积分限依赖 $x$：$\\int_0^3 \\int_0^{3 - x} y\\,dy\\,dx = \\int_0^3 \\frac{(3 - x)^2}{2}\\,dx = \\frac{27}{6} = \\frac{9}{2}$。\n\n检验：换一种方式描述三角形，$0 \\le y \\le 3$，$0 \\le x \\le 3 - y$。则 $\\int_0^3 y(3 - y)\\,dy = \\frac{27}{2} - 9 = \\frac{9}{2}$。\n\n本课我们让内层积分限依赖外层变量，在不是矩形的区域上积分。",
  ),
  prerequisites: ["double-integrals-over-rectangular-domains"],
  encompasses: [{ topic: "double-integrals-over-rectangular-domains", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "integrating-over-triangular-domains",
      figure: multivariableDrawings3["double-integrals-over-non-rectangular-domains#integrating-over-triangular-domains"],
      title: t("Integrating over triangular domains", "在三角形区域上求二重积分"),
      explanation: t(
        "Over a triangle the inner limits depend on the outer variable, because the height of the region changes as you move across it. For a triangular region $T$ bounded by $x = 0$, $y = 0$, and $x + y = c$ ($c > 0$):\n\n$$\\iint_T ax\\,dA = \\int_0^c \\int_0^{c - x} ax\\,dy\\,dx = \\int_0^c ax(c - x)\\,dx = a\\frac{c^3}{6}.$$\n\nFor $5x$ and $x + y = 2$ the integral is $5 \\cdot \\frac{8}{6} = \\frac{20}{3}$.\n\n> **Watch out.** The inner upper limit is $c - x$, the height of the triangle at $x$. Using $c$ integrates over the whole square $[0, c]^2$ instead.",
        "在三角形区域上，内层积分限依赖于外层变量，因为区域的高度随位置而变化。对于由 $x = 0$、$y = 0$ 与 $x + y = c$（$c > 0$）所围成的三角形区域 $T$：\n\n$$\\iint_T ax\\,dA = \\int_0^c \\int_0^{c - x} ax\\,dy\\,dx = \\int_0^c ax(c - x)\\,dx = a\\frac{c^3}{6}$$\n\n对 $5x$ 与 $x + y = 2$，积分为 $5 \\cdot \\frac{8}{6} = \\frac{20}{3}$。\n\n> **注意。** 内层上限是 $c - x$，即三角形在 $x$ 处的高度。用 $c$ 就变成在整个正方形 $[0, c]^2$ 上积分了。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(2, 10);
        const k = rng.int(1, 6);
        const a = 6 * k;
        const ans = k * c * c * c;
        return numberProblem({
          prompt: t(
            `Evaluate the double integral $\\iint_T ${a}x\\,dA$ over the triangular region $T$ bounded by the lines $x = 0$, $y = 0$, and $x + y = ${c}$.`,
            `计算二重积分 $\\iint_T ${a}x\\,dA$，其中 $T$ 为由直线 $x = 0$、$y = 0$ 与 $x + y = ${c}$ 所围成的三角形区域。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              3 * k * c ** 3,
              `That takes $y$ from $0$ to $${c}$ for every $x$, which is the square $[0, ${c}]^2$; the triangle stops at $y = ${c} - x$.`,
              `那是对每个 $x$ 都让 $y$ 从 $0$ 到 $${c}$，那是正方形 $[0, ${c}]^2$；三角形止于 $y = ${c} - x$。`,
            ),
            why(
              2 * k * c ** 3,
              "That takes $y$ from $0$ to $x$, which is the triangle below the line $y = x$.",
              "那是让 $y$ 从 $0$ 到 $x$，那是直线 $y = x$ 下方的三角形。",
            ),
            why(
              3 * k * c * c,
              `That integrates $${a}x$ over $x$ alone and leaves out the height $${c} - x$ of the region.`,
              `那是只对 $x$ 积分 $${a}x$，漏掉了区域的高度 $${c} - x$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Describe the triangle", "描述三角形"],
                t(`$T$ is $0 \\le x \\le ${c}$ and $0 \\le y \\le ${c} - x$.`, `$T$ 为 $0 \\le x \\le ${c}$，$0 \\le y \\le ${c} - x$。`),
              ],
              [
                ["Integrate in y", "对 y 积分"],
                t(
                  `$\\int_0^{${c} - x} ${a}x\\,dy = ${a}x(${c} - x) = ${poly([a * c, "x"], [-a, "x^2"])}$.`,
                  `$\\int_0^{${c} - x} ${a}x\\,dy = ${a}x(${c} - x) = ${poly([a * c, "x"], [-a, "x^2"])}$。`,
                ),
              ],
              [
                ["Integrate in x", "对 x 积分"],
                t(
                  `$\\int_0^{${c}} (${poly([a * c, "x"], [-a, "x^2"])})\\,dx = ${a}\\left(\\frac{${c}^3}{2} - \\frac{${c}^3}{3}\\right) = ${a} \\cdot \\frac{${c ** 3}}{6} = ${ans}$.`,
                  `$\\int_0^{${c}} (${poly([a * c, "x"], [-a, "x^2"])})\\,dx = ${a}\\left(\\frac{${c}^3}{2} - \\frac{${c}^3}{3}\\right) = ${a} \\cdot \\frac{${c ** 3}}{6} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `In the other order, $\\int_0^{${c}} \\int_0^{${c} - y} ${a}x\\,dx\\,dy = \\int_0^{${c}} ${3 * k}(${c} - y)^2\\,dy = ${k} \\cdot ${c}^3 = ${ans}$.`,
              `换个次序，$\\int_0^{${c}} \\int_0^{${c} - y} ${a}x\\,dx\\,dy = \\int_0^{${c}} ${3 * k}(${c} - y)^2\\,dy = ${k} \\cdot ${c}^3 = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "integrating-over-the-region-between-a-line-and-a-parabola",
      figure:
        multivariableDrawings4["double-integrals-over-non-rectangular-domains#integrating-over-the-region-between-a-line-and-a-parabola"],
      title: t("Integrating between a line and a parabola", "在直线与抛物线之间积分"),
      explanation: t(
        "To integrate over the region between $y = x^2$ and $y = kx$, first find where the curves meet: $x^2 = kx$ gives $x = 0$ and $x = k$. For $0 \\le x \\le k$ the line lies above the parabola, so\n\n$$\\iint_D c\\,dA = \\int_0^k \\int_{x^2}^{kx} c\\,dy\\,dx = c\\int_0^k (kx - x^2)\\,dx = \\frac{ck^3}{6}.$$\n\nFor the constant $8$ between $y = x^2$ and $y = 3x$, the integral is $8 \\cdot \\frac{27}{6} = 36$.\n\n> **Watch out.** The inner integral runs from the lower curve to the upper one, here from $x^2$ up to $kx$. Reversing them gives the negative of the answer.",
        "要在 $y = x^2$ 与 $y = kx$ 之间的区域上积分，先求交点：$x^2 = kx$ 得 $x = 0$ 和 $x = k$。在 $0 \\le x \\le k$ 上直线在抛物线上方，所以\n\n$$\\iint_D c\\,dA = \\int_0^k \\int_{x^2}^{kx} c\\,dy\\,dx = c\\int_0^k (kx - x^2)\\,dx = \\frac{ck^3}{6}$$\n\n对 $y = x^2$ 与 $y = 3x$ 之间的常数 $8$，积分为 $8 \\cdot \\frac{27}{6} = 36$。\n\n> **注意。** 内层积分从下方曲线到上方曲线，这里从 $x^2$ 到 $kx$。把两者弄反就得到答案的相反数。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(1, 6);
        const c = rng.int(1, 6);
        const ans = Q.of(c * k ** 3, 6);
        const line = `${coef(k)}x`;
        return numberProblem({
          prompt: t(
            `Evaluate $\\iint_D ${c}\\,dA$, where $D$ is the region between $y = x^2$ and $y = ${line}$.`,
            `计算 $\\iint_D ${c}\\,dA$，其中 $D$ 是 $y = x^2$ 与 $y = ${line}$ 之间的区域。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(c * k ** 3, 2),
              "That integrates up to the line from $y = 0$; the region starts at the parabola, so subtract $x^2$.",
              "那是从 $y = 0$ 积到直线；区域从抛物线开始，要减去 $x^2$。",
            ),
            why(
              Q.of(c * k ** 3, 3),
              "That is the integral under the parabola; the region lies above the parabola and below the line.",
              "那是抛物线下方的积分；区域在抛物线上方、直线下方。",
            ),
            why(
              ans.neg(),
              "The limits are upside down; for $0 < x < k$ the line is above the parabola.",
              "积分上下限颠倒了；在 $0 < x < k$ 上直线在抛物线上方。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the crossings", "求交点"],
                t(
                  `$x^2 = ${line}$ at $x = 0$ and $x = ${k}$, and the line is on top between them.`,
                  `$x^2 = ${line}$ 在 $x = 0$ 和 $x = ${k}$ 处成立，其间直线在上方。`,
                ),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `$\\int_0^{${k}} \\int_{x^2}^{${line}} ${c}\\,dy\\,dx = ${c}\\int_0^{${k}} (${line} - x^2)\\,dx = ${c}\\left(\\frac{${k ** 3}}{2} - \\frac{${k ** 3}}{3}\\right) = ${ans.toLatex()}$.`,
                  `$\\int_0^{${k}} \\int_{x^2}^{${line}} ${c}\\,dy\\,dx = ${c}\\int_0^{${k}} (${line} - x^2)\\,dx = ${c}\\left(\\frac{${k ** 3}}{2} - \\frac{${k ** 3}}{3}\\right) = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `With horizontal strips, $x$ runs from $\\frac{y}{${k}}$ to $\\sqrt{y}$ for $0 \\le y \\le ${k * k}$: $${c}\\left(\\frac{2}{3} \\cdot ${k ** 3} - \\frac{${k ** 4}}{${2 * k}}\\right) = ${ans.toLatex()}$.`,
              `用水平条带，$0 \\le y \\le ${k * k}$ 时 $x$ 从 $\\frac{y}{${k}}$ 到 $\\sqrt{y}$：$${c}\\left(\\frac{2}{3} \\cdot ${k ** 3} - \\frac{${k ** 4}}{${2 * k}}\\right) = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** propertiesOfDoubleIntegrals covers linearity and domain additivity. */
export const propertiesOfDoubleIntegrals: TopicDef = {
  id: "properties-of-double-integrals",
  title: t("Properties of Double Integrals", "二重积分的性质"),
  summary: t(
    "Double integrals are linear, additive over non-overlapping subregions, and preserve inequalities.",
    "二重积分具有线性性质、对不重叠子区域的可加性以及保序性。",
  ),
  intro: t(
    "On $R = [0, 2] \\times [0, 3]$ suppose $\\iint_R f\\,dA = 4$ and $\\iint_R g\\,dA = -1$. Linearity gives $\\iint_R (3f - 2g + 1)\\,dA = 3 \\cdot 4 - 2 \\cdot (-1) + 1 \\cdot \\operatorname{Area}(R) = 12 + 2 + 6 = 20$.\n\nCheck: try constant functions with those integrals, $f = \\frac{2}{3}$ and $g = -\\frac{1}{6}$ on a region of area $6$. Then $3f - 2g + 1 = \\frac{10}{3}$, and $\\frac{10}{3} \\cdot 6 = 20$.\n\nIn this lesson we combine known double integrals using linearity, remembering that a constant integrates to itself times the area.",
    "在 $R = [0, 2] \\times [0, 3]$ 上，设 $\\iint_R f\\,dA = 4$，$\\iint_R g\\,dA = -1$。由线性性，$\\iint_R (3f - 2g + 1)\\,dA = 3 \\cdot 4 - 2 \\cdot (-1) + 1 \\cdot \\operatorname{Area}(R) = 12 + 2 + 6 = 20$。\n\n检验：取积分相同的常数函数，在面积为 $6$ 的区域上 $f = \\frac{2}{3}$，$g = -\\frac{1}{6}$。则 $3f - 2g + 1 = \\frac{10}{3}$，而 $\\frac{10}{3} \\cdot 6 = 20$。\n\n本课我们利用线性性组合已知的二重积分，并记住常数的积分等于它乘以面积。",
  ),
  prerequisites: ["double-integrals-over-non-rectangular-domains"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "linearity-and-decomposition-of-double-integrals",
      title: t("Linearity and decomposition of double integrals", "二重积分的线性性与区域分解性"),
      explanation: t(
        "Double integrals are linear just like single integrals, so known integrals of separate functions combine with the same coefficients. By linearity of the double integral:\n\n$$\\iint_R (\\alpha f(x, y) + \\beta g(x, y))\\,dA = \\alpha \\iint_R f(x, y)\\,dA + \\beta \\iint_R g(x, y)\\,dA.$$\n\nWith $\\iint_R f\\,dA = 10$ and $\\iint_R g\\,dA = -3$, $\\iint_R (2f + 5g)\\,dA = 20 - 15 = 5$.\n\n> **Watch out.** Keep each coefficient with its own integral and carry the signs: a positive coefficient times a negative integral is negative.",
        "二重积分和单积分一样是线性的，所以各个函数的已知积分可以按相同的系数组合。由二重积分的线性性质：\n\n$$\\iint_R (\\alpha f(x, y) + \\beta g(x, y))\\,dA = \\alpha \\iint_R f(x, y)\\,dA + \\beta \\iint_R g(x, y)\\,dA$$\n\n若 $\\iint_R f\\,dA = 10$，$\\iint_R g\\,dA = -3$，则 $\\iint_R (2f + 5g)\\,dA = 20 - 15 = 5$。\n\n> **注意。** 每个系数要配上它自己的积分，并保留符号：正系数乘以负积分得负数。",
      ),
      generate(rng: Rng): Problem {
        const I1 = rng.nonZero(-8, 8);
        const I2 = rng.nonZero(-8, 8);
        const alpha = rng.nonZero(-4, 4);
        const beta = rng.nonZero(-4, 4);
        const ans = alpha * I1 + beta * I2;
        const combo = poly([alpha, "f(x, y)"], [beta, "g(x, y)"]);
        return numberProblem({
          prompt: t(
            `Suppose $\\iint_R f(x, y)\\,dA = ${I1}$ and $\\iint_R g(x, y)\\,dA = ${I2}$. Find the value of $\\iint_R (${combo})\\,dA$.`,
            `设 $\\iint_R f(x, y)\\,dA = ${I1}$ 且 $\\iint_R g(x, y)\\,dA = ${I2}$。计算 $\\iint_R (${combo})\\,dA$ 的值。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              alpha * I1 - beta * I2,
              `The sign of the second term is lost: it is $${paren(beta)} \\cdot ${paren(I2)} = ${beta * I2}$.`,
              `第二项的符号丢了：它是 $${paren(beta)} \\cdot ${paren(I2)} = ${beta * I2}$。`,
            ),
            why(I1 + I2, "That adds the two integrals without their coefficients.", "那是把两个积分直接相加，漏了系数。"),
            why(
              alpha * I2 + beta * I1,
              "The coefficients are swapped: $\\alpha$ goes with the integral of $f$.",
              "系数配错了：$\\alpha$ 应配 $f$ 的积分。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Apply linearity", "应用线性性"],
                t(
                  `$\\iint_R (${poly([alpha, "f"], [beta, "g"])})\\,dA = ${poly([alpha, "\\iint_R f\\,dA"], [beta, "\\iint_R g\\,dA"])}$.`,
                  `$\\iint_R (${poly([alpha, "f"], [beta, "g"])})\\,dA = ${poly([alpha, "\\iint_R f\\,dA"], [beta, "\\iint_R g\\,dA"])}$。`,
                ),
              ],
              [
                ["Substitute", "代入"],
                t(
                  `$${alpha} \\cdot ${paren(I1)} + ${paren(beta)} \\cdot ${paren(I2)} = ${alpha * I1} + ${paren(beta * I2)} = ${ans}$.`,
                  `$${alpha} \\cdot ${paren(I1)} + ${paren(beta)} \\cdot ${paren(I2)} = ${alpha * I1} + ${paren(beta * I2)} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `On a region of area $1$ the constants $f = ${I1}$ and $g = ${I2}$ have these integrals, and then $${poly([alpha, "f"], [beta, "g"])} = ${ans}$ everywhere, so its integral is $${ans}$.`,
              `在面积为 $1$ 的区域上，常数 $f = ${I1}$、$g = ${I2}$ 正好有这些积分，此时处处 $${poly([alpha, "f"], [beta, "g"])} = ${ans}$，所以其积分为 $${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "adding-a-constant-to-the-integrand",
      figure: multivariableDrawings4["properties-of-double-integrals#adding-a-constant-to-the-integrand"],
      title: t("Adding a constant to the integrand", "被积函数加上常数"),
      explanation: t(
        "Linearity says $\\iint_R (\\alpha f + k)\\,dA = \\alpha\\iint_R f\\,dA + k\\iint_R 1\\,dA$. The integral of the constant $1$ is the area of $R$, so a constant $k$ adds $k \\cdot \\operatorname{Area}(R)$, not just $k$. On a rectangle $[a, b] \\times [c, d]$ the area is $(b - a)(d - c)$. For $R = [0, 5] \\times [0, 2]$ and $\\iint_R f\\,dA = 3$, $\\iint_R (2f + 1)\\,dA = 6 + 1 \\cdot 10 = 16$.\n\n> **Watch out.** The coefficient $\\alpha$ multiplies only the integral of $f$; the constant term contributes its own $k \\cdot \\operatorname{Area}(R)$.",
        "由线性性，$\\iint_R (\\alpha f + k)\\,dA = \\alpha\\iint_R f\\,dA + k\\iint_R 1\\,dA$。常数 $1$ 的积分是 $R$ 的面积，所以常数 $k$ 贡献的是 $k \\cdot \\operatorname{Area}(R)$，而不只是 $k$。矩形 $[a, b] \\times [c, d]$ 的面积为 $(b - a)(d - c)$。对 $R = [0, 5] \\times [0, 2]$ 和 $\\iint_R f\\,dA = 3$，$\\iint_R (2f + 1)\\,dA = 6 + 1 \\cdot 10 = 16$。\n\n> **注意。** 系数 $\\alpha$ 只乘 $f$ 的积分；常数项单独贡献 $k \\cdot \\operatorname{Area}(R)$。",
      ),
      generate(rng: Rng): Problem {
        const I = rng.nonZero(-8, 8);
        const alpha = rng.pick([-3, -2, 2, 3, 4]);
        const k = rng.nonZero(-4, 4);
        const a = rng.int(-2, 2);
        const b = a + rng.int(1, 4);
        const c = rng.int(-2, 2);
        const d = c + rng.int(1, 3);
        const area = (b - a) * (d - c);
        const ans = alpha * I + k * area;
        const value = Q.of(ans, area);
        return numberProblem({
          prompt: t(
            `$R = [${a}, ${b}] \\times [${c}, ${d}]$ and $\\iint_R f\\,dA = ${I}$. Find $\\iint_R (${poly([alpha, "f"], [k, ""])})\\,dA$.`,
            `$R = [${a}, ${b}] \\times [${c}, ${d}]$，且 $\\iint_R f\\,dA = ${I}$。求 $\\iint_R (${poly([alpha, "f"], [k, ""])})\\,dA$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              alpha * I + k,
              `The constant contributes $${k}$ times the area $${area}$ of $R$, not just $${k}$.`,
              `常数贡献的是 $${k}$ 乘以 $R$ 的面积 $${area}$，而不只是 $${k}$。`,
            ),
            why(
              alpha * (I + k * area),
              `That multiplies the constant term by $${alpha}$ too; $${alpha}$ multiplies only $f$.`,
              `那是把常数项也乘了 $${alpha}$；$${alpha}$ 只乘 $f$。`,
            ),
            why(
              alpha * I,
              "The constant term is left out; it adds $k \\cdot \\operatorname{Area}(R)$.",
              "漏了常数项；它贡献 $k \\cdot \\operatorname{Area}(R)$。",
            ),
            why(I + k * area, `The coefficient $${alpha}$ of $f$ is left out.`, `漏了 $f$ 的系数 $${alpha}$。`),
          ]),
          solution: walked(
            [
              [
                ["Find the area", "求面积"],
                t(
                  `$\\operatorname{Area}(R) = (${b} - ${paren(a)})(${d} - ${paren(c)}) = ${b - a} \\cdot ${d - c} = ${area}$.`,
                  `$\\operatorname{Area}(R) = (${b} - ${paren(a)})(${d} - ${paren(c)}) = ${b - a} \\cdot ${d - c} = ${area}$。`,
                ),
              ],
              [
                ["Apply linearity", "应用线性性"],
                t(
                  `$${alpha}\\iint_R f\\,dA + ${paren(k)}\\iint_R 1\\,dA = ${alpha} \\cdot ${paren(I)} + ${paren(k)} \\cdot ${area} = ${ans}$.`,
                  `$${alpha}\\iint_R f\\,dA + ${paren(k)}\\iint_R 1\\,dA = ${alpha} \\cdot ${paren(I)} + ${paren(k)} \\cdot ${area} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `If $f$ were the constant $${Q.of(I, area).toLatex()}$, which has integral $${I}$ over $R$, the integrand would be the constant $${value.toLatex()}$, and $${paren(value)} \\cdot ${area} = ${ans}$.`,
              `若 $f$ 是常数 $${Q.of(I, area).toLatex()}$，它在 $R$ 上的积分为 $${I}$，则被积函数是常数 $${value.toLatex()}$，而 $${paren(value)} \\cdot ${area} = ${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** typeIAndIiRegionsInTwoDimensionalSpace classifies plane regions into Type I and Type II. */
export const typeIAndIiRegionsInTwoDimensionalSpace: TopicDef = {
  id: "type-i-and-ii-regions-in-two-dimensional-space",
  title: t("Type I and II Regions in Two-Dimensional Space", "二维空间中的 X-型（Type I）与 Y-型（Type II）区域"),
  summary: t(
    "Type I regions lie between two continuous functions of x; Type II regions lie between two continuous functions of y.",
    "X-型区域（Type I）夹在关于 x 的两条连续曲线之间；Y-型区域（Type II）夹在关于 y 的两条连续曲线之间。",
  ),
  intro: t(
    "Take the triangle with vertices $(0, 0)$, $(3, 0)$ and $(3, 1)$. With vertical strips it is Type I: $0 \\le x \\le 3$ and $0 \\le y \\le \\frac{x}{3}$. With horizontal strips it is Type II: $0 \\le y \\le 1$ and $3y \\le x \\le 3$, because the slanted side $y = \\frac{x}{3}$ solved for $x$ is $x = 3y$.\n\nCheck: both descriptions give the same area, $\\int_0^3 \\frac{x}{3}\\,dx = \\frac{3}{2}$ and $\\int_0^1 (3 - 3y)\\,dy = \\frac{3}{2}$.\n\nIn this lesson we recognize Type I and Type II descriptions of plane regions and rewrite a region from one type to the other.",
    "取顶点为 $(0, 0)$、$(3, 0)$、$(3, 1)$ 的三角形。用竖直条带，它是 Type I 型：$0 \\le x \\le 3$，$0 \\le y \\le \\frac{x}{3}$。用水平条带，它是 Type II 型：$0 \\le y \\le 1$，$3y \\le x \\le 3$，因为斜边 $y = \\frac{x}{3}$ 解出 $x$ 是 $x = 3y$。\n\n检验：两种描述给出同样的面积，$\\int_0^3 \\frac{x}{3}\\,dx = \\frac{3}{2}$，$\\int_0^1 (3 - 3y)\\,dy = \\frac{3}{2}$。\n\n本课我们识别平面区域的 Type I 与 Type II 描述，并把区域从一种类型改写成另一种。",
  ),
  prerequisites: ["properties-of-double-integrals"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "identifying-type-i-and-type-ii-regions",
      figure: multivariableDrawings4["type-i-and-ii-regions-in-two-dimensional-space#identifying-type-i-and-type-ii-regions"],
      title: t("Identifying Type I and Type II regions", "识别 X-型与 Y-型区域"),
      explanation: t(
        "A region is described with vertical strips when its top and bottom are graphs of functions of the horizontal variable, and with horizontal strips in the opposite case. A region $D$ is **Type I** if $D = \\{(x, y) : a \\le x \\le b, g_1(x) \\le y \\le g_2(x)\\}$. It is **Type II** if $D = \\{(x, y) : c \\le y \\le d, h_1(y) \\le x \\le h_2(y)\\}$. For example $\\{1 \\le y \\le 2,\\ y \\le x \\le y^2\\}$ is a Type II description: $y$ has constant bounds and $x$ lies between two functions of $y$.\n\n> **Watch out.** Decide by which variable has constant bounds. The other variable's bounds are functions of it, and that is the variable integrated first.",
        "当区域的上下边界是水平变量的函数图像时，用竖直条带描述它；反之则用水平条带。若区域可表示为 $D = \\{(x, y) : a \\le x \\le b, g_1(x) \\le y \\le g_2(x)\\}$，则称为 **X-型区域（Type I）**。若可表示为 $D = \\{(x, y) : c \\le y \\le d, h_1(y) \\le x \\le h_2(y)\\}$，则称为 **Y-型区域（Type II）**。例如 $\\{1 \\le y \\le 2,\\ y \\le x \\le y^2\\}$ 是 Y-型描述：$y$ 的界是常数，$x$ 夹在 $y$ 的两个函数之间。\n\n> **注意。** 要看哪个变量的界是常数。另一个变量的界是它的函数，并且先对另一个变量积分。",
      ),
      generate(rng: Rng): Problem {
        const isType1 = rng.bool();
        const a = rng.int(1, 4);
        const b = rng.int(1, 4);
        const [u, v] = isType1 ? ["x", "y"] : ["y", "x"];
        const lo = poly([b, `${u}^2`]);
        const hi = poly([b * a, u]);
        const set = `\\{(x, y) : 0 \\le ${u} \\le ${a}, ${lo} \\le ${v} \\le ${hi}\\}`;
        const typeI = t("Type I", "X-型（Type I）");
        const typeII = t("Type II", "Y-型（Type II）");
        const neither = t("Neither Type I nor Type II", "既非 X-型亦非 Y-型");
        const right = isType1 ? typeI : typeII;
        const other = isType1 ? typeII : typeI;
        return explainedChoice(rng, {
          prompt: t(
            `The plane region $D$ is written as $D = ${set}$. Is this written form a Type I description, a Type II description, or neither?`,
            `平面区域 $D$ 写成 $D = ${set}$。这个写法是 X-型（Type I）描述、Y-型（Type II）描述，还是两者皆非？`,
          ),
          correct: right,
          wrong: [
            {
              option: other,
              why: t(
                `That type needs constant bounds on $${v}$; here $${v}$ lies between functions of $${u}$.`,
                `那种类型要求 $${v}$ 的界是常数；这里 $${v}$ 夹在 $${u}$ 的函数之间。`,
              ),
            },
            {
              option: neither,
              why: t(
                `Constant bounds on one variable and function bounds on the other make one of the two types; here $${u}$ has the constant bounds.`,
                `一个变量的界是常数、另一个变量的界是函数，就是两种类型之一；这里 $${u}$ 的界是常数。`,
              ),
            },
          ],
          solution: walked(
            [
              [
                ["Find the constant bounds", "找出常数界"],
                t(`$${u}$ runs between the constants $0$ and $${a}$.`, `$${u}$ 在常数 $0$ 与 $${a}$ 之间。`),
              ],
              [
                ["Read the other bounds", "读出另一组界"],
                t(
                  `$${v}$ runs from $${lo}$ to $${hi}$, two functions of $${u}$. So this is a ${right.en} description.`,
                  `$${v}$ 从 $${lo}$ 到 $${hi}$，是 $${u}$ 的两个函数。所以这是${right["zh-CN"]}描述。`,
                ),
              ],
            ],
            t(
              `The bounds are in the right order: $${lo} \\le ${hi}$ for $0 \\le ${u} \\le ${a}$, and they meet at both ends, $${u} = 0$ and $${u} = ${a}$.`,
              `上下界的顺序正确：$0 \\le ${u} \\le ${a}$ 时 $${lo} \\le ${hi}$，并且两者在两端 $${u} = 0$ 与 $${u} = ${a}$ 处相等。`,
            ),
          ),
        });
      },
    },
    {
      id: "rewriting-a-type-i-triangle-as-type-ii",
      figure: multivariableDrawings4["type-i-and-ii-regions-in-two-dimensional-space#rewriting-a-type-i-triangle-as-type-ii"],
      title: t("Rewriting a Type I triangle as Type II", "把 Type I 三角形改写为 Type II"),
      explanation: t(
        "The triangle $\\{0 \\le x \\le a,\\ 0 \\le y \\le mx\\}$ is Type I. To describe it as Type II, read off the full range of $y$, which is $0 \\le y \\le ma$, and then solve the slanted side for $x$: $y = mx$ gives $x = \\frac{y}{m}$. A horizontal line at height $y$ enters the triangle at $x = \\frac{y}{m}$ and leaves at $x = a$, so the region is $\\{0 \\le y \\le ma,\\ \\frac{y}{m} \\le x \\le a\\}$. For $\\{0 \\le x \\le 1,\\ 0 \\le y \\le 7x\\}$ this is $\\{0 \\le y \\le 7,\\ \\frac{y}{7} \\le x \\le 1\\}$.\n\n> **Watch out.** The slanted side is the left boundary of a horizontal strip and $x = a$ the right one. The top of the $y$ range is the height $ma$ of the corner $(a, ma)$, not $a$.",
        "三角形 $\\{0 \\le x \\le a,\\ 0 \\le y \\le mx\\}$ 是 Type I 型。要写成 Type II 型，先读出 $y$ 的完整范围 $0 \\le y \\le ma$，再把斜边解出 $x$：由 $y = mx$ 得 $x = \\frac{y}{m}$。高度为 $y$ 的水平线在 $x = \\frac{y}{m}$ 进入三角形、在 $x = a$ 离开，所以区域为 $\\{0 \\le y \\le ma,\\ \\frac{y}{m} \\le x \\le a\\}$。对 $\\{0 \\le x \\le 1,\\ 0 \\le y \\le 7x\\}$，结果是 $\\{0 \\le y \\le 7,\\ \\frac{y}{7} \\le x \\le 1\\}$。\n\n> **注意。** 斜边是水平条带的左边界，$x = a$ 是右边界。$y$ 范围的上端是角点 $(a, ma)$ 的高度 $ma$，不是 $a$。",
      ),
      generate(rng: Rng): Problem {
        const m = rng.int(2, 6);
        const a = rng.int(1, 6);
        const set = (y: string, x: string) => t(`$\\{${y},\\ ${x}\\}$`, `$\\{${y},\\ ${x}\\}$`);
        return explainedChoice(rng, {
          prompt: t(
            `Describe $D = \\{(x, y) : 0 \\le x \\le ${a},\\ 0 \\le y \\le ${m}x\\}$ as a Type II region.`,
            `把 $D = \\{(x, y) : 0 \\le x \\le ${a},\\ 0 \\le y \\le ${m}x\\}$ 写成 Type II 型区域。`,
          ),
          correct: set(`0 \\le y \\le ${m * a}`, `\\frac{y}{${m}} \\le x \\le ${a}`),
          wrong: [
            {
              option: set(`0 \\le y \\le ${m * a}`, `0 \\le x \\le \\frac{y}{${m}}`),
              why: t(
                `That is the part to the left of the line, above $y = ${m}x$; a horizontal strip of $D$ starts at the line and ends at $x = ${a}$.`,
                `那是直线左侧、$y = ${m}x$ 上方的部分；$D$ 的水平条带从直线开始，到 $x = ${a}$ 结束。`,
              ),
            },
            {
              option: set(`0 \\le y \\le ${a}`, `\\frac{y}{${m}} \\le x \\le ${a}`),
              why: t(
                `$y$ reaches $${m} \\cdot ${a} = ${m * a}$ at the corner $(${a}, ${m * a})$, not $${a}$.`,
                `$y$ 在角点 $(${a}, ${m * a})$ 处达到 $${m} \\cdot ${a} = ${m * a}$，不是 $${a}$。`,
              ),
            },
            {
              option: set(`0 \\le y \\le ${m * a}`, `${m}y \\le x \\le ${a}`),
              why: t(
                `Solving $y = ${m}x$ for $x$ gives $x = \\frac{y}{${m}}$, not $${m}y$.`,
                `由 $y = ${m}x$ 解出 $x$ 得 $x = \\frac{y}{${m}}$，不是 $${m}y$。`,
              ),
            },
          ],
          solution: walked(
            [
              [
                ["Find the range of y", "求 y 的范围"],
                t(
                  `The highest point is the corner $(${a}, ${m * a})$, so $0 \\le y \\le ${m * a}$.`,
                  `最高点是角点 $(${a}, ${m * a})$，所以 $0 \\le y \\le ${m * a}$。`,
                ),
              ],
              [
                ["Find the range of x", "求 x 的范围"],
                t(
                  `At height $y$ a horizontal line enters at the slanted side $x = \\frac{y}{${m}}$ and leaves at $x = ${a}$.`,
                  `在高度 $y$ 处，水平线从斜边 $x = \\frac{y}{${m}}$ 进入，在 $x = ${a}$ 离开。`,
                ),
              ],
            ],
            t(
              `Both descriptions give the area $\\frac{${m} \\cdot ${a}^2}{2} = ${Q.of(m * a * a, 2).toLatex()}$: $\\int_0^{${a}} ${m}x\\,dx = \\int_0^{${m * a}} \\left(${a} - \\frac{y}{${m}}\\right) dy = ${Q.of(m * a * a, 2).toLatex()}$.`,
              `两种描述给出同样的面积 $\\frac{${m} \\cdot ${a}^2}{2} = ${Q.of(m * a * a, 2).toLatex()}$：$\\int_0^{${a}} ${m}x\\,dx = \\int_0^{${m * a}} \\left(${a} - \\frac{y}{${m}}\\right) dy = ${Q.of(m * a * a, 2).toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** doubleIntegralsOverTypeIRegions computes integrals over Type I regions. */
export const doubleIntegralsOverTypeIRegions: TopicDef = {
  id: "double-integrals-over-type-i-regions",
  title: t("Double Integrals Over Type I Regions", "X-型区域上的二重积分"),
  summary: t(
    "On a Type I region, integrate with respect to y between the curve limits g1(x) and g2(x), then integrate with respect to x.",
    "在 X-型区域上，先对 y 在上下曲线限界 g1(x) 与 g2(x) 之间积分，再对 x 积分。",
  ),
  intro: t(
    "Integrate $y$ over $D = \\{0 \\le x \\le 1,\\ x^2 \\le y \\le x\\}$. The inner integral is $\\int_{x^2}^{x} y\\,dy = \\frac{x^2 - x^4}{2}$, a function of $x$ alone, and the outer one is $\\int_0^1 \\frac{x^2 - x^4}{2}\\,dx = \\frac{1}{2}\\left(\\frac{1}{3} - \\frac{1}{5}\\right) = \\frac{1}{15}$.\n\nCheck: as a Type II region $D$ is $0 \\le y \\le 1$, $y \\le x \\le \\sqrt{y}$, and $\\int_0^1 y(\\sqrt{y} - y)\\,dy = \\frac{2}{5} - \\frac{1}{3} = \\frac{1}{15}$.\n\nIn this lesson we evaluate double integrals over Type I regions, with $y$ integrated first between two curves.",
    "在 $D = \\{0 \\le x \\le 1,\\ x^2 \\le y \\le x\\}$ 上对 $y$ 积分。内层积分为 $\\int_{x^2}^{x} y\\,dy = \\frac{x^2 - x^4}{2}$，只依赖 $x$；外层为 $\\int_0^1 \\frac{x^2 - x^4}{2}\\,dx = \\frac{1}{2}\\left(\\frac{1}{3} - \\frac{1}{5}\\right) = \\frac{1}{15}$。\n\n检验：作为 Type II 区域，$D$ 为 $0 \\le y \\le 1$，$y \\le x \\le \\sqrt{y}$，而 $\\int_0^1 y(\\sqrt{y} - y)\\,dy = \\frac{2}{5} - \\frac{1}{3} = \\frac{1}{15}$。\n\n本课我们计算 X-型区域上的二重积分，先在两条曲线之间对 $y$ 积分。",
  ),
  prerequisites: ["type-i-and-ii-regions-in-two-dimensional-space"],
  encompasses: [{ topic: "type-i-and-ii-regions-in-two-dimensional-space", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-double-integrals-over-parabolic-regions",
      title: t("Evaluating double integrals over parabolic regions", "在抛物线区域上计算二重积分"),
      explanation: t(
        "Integrate first in the direction whose limits are functions, then integrate the resulting function of the outer variable over its constant limits. For $D = \\{(x, y) : 0 \\le x \\le a, 0 \\le y \\le bx\\}$:\n\n$$\\iint_D kx\\,dA = \\int_0^a \\left[\\int_0^{bx} kx\\,dy\\right]dx = \\int_0^a bkx^2\\,dx = bk\\frac{a^3}{3}.$$\n\nFor $2x$ over $0 \\le x \\le 3$, $0 \\le y \\le x$, this is $\\int_0^3 2x^2\\,dx = 18$.\n\n> **Watch out.** In the inner integral $kx$ does not depend on $y$, so it is simply multiplied by the length $bx$ of the strip; it is not integrated as a power of $x$.",
        "先沿积分限为函数的方向积分，再把所得关于外层变量的函数在常数限上积分。对于区域 $D = \\{(x, y) : 0 \\le x \\le a, 0 \\le y \\le bx\\}$：\n\n$$\\iint_D kx\\,dA = \\int_0^a \\left[\\int_0^{bx} kx\\,dy\\right]dx = \\int_0^a bkx^2\\,dx = bk\\frac{a^3}{3}$$\n\n对 $0 \\le x \\le 3$，$0 \\le y \\le x$ 上的 $2x$，结果为 $\\int_0^3 2x^2\\,dx = 18$。\n\n> **注意。** 在内层积分中 $kx$ 与 $y$ 无关，所以只需乘以条带的长度 $bx$；不要把它当作 $x$ 的幂来积分。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 6);
        const b = rng.int(1, 4);
        const m = rng.int(1, 4);
        const k = 3 * m;
        const ans = b * m * a * a * a;
        const line = `${coef(b)}x`;
        return numberProblem({
          prompt: t(
            `Evaluate the double integral $\\iint_D ${k}x\\,dA$ over the Type I region $D$ bounded by $y = 0$, $y = ${line}$, and $x = ${a}$.`,
            `计算二重积分 $\\iint_D ${k}x\\,dA$，其中 $D$ 为由 $y = 0$、$y = ${line}$ 与 $x = ${a}$ 所围成的 X-型区域。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(3 * m * b * a ** 3, 2),
              `That takes $y$ up to $${b * a}$ for every $x$, which is the rectangle $[0, ${a}] \\times [0, ${b * a}]$; the top is the line $y = ${line}$.`,
              `那是对每个 $x$ 都让 $y$ 到 $${b * a}$，那是矩形 $[0, ${a}] \\times [0, ${b * a}]$；上边界是直线 $y = ${line}$。`,
            ),
            why(
              Q.of(m * b * b * a ** 3, 2),
              `That integrates $${k}x$ as if the inner variable were $x$; with respect to $y$ it is a constant times the length $${line}$.`,
              `那是把内层当成对 $x$ 积分 $${k}x$；对 $y$ 积分时它是常数，乘以长度 $${line}$。`,
            ),
            why(
              3 * ans,
              "The antiderivative of $x^2$ is $\\frac{x^3}{3}$; the division by $3$ is missing.",
              "$x^2$ 的原函数是 $\\frac{x^3}{3}$；漏了除以 $3$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Integrate in y", "对 y 积分"],
                t(
                  `$\\int_0^{${line}} ${k}x\\,dy = ${k}x \\cdot ${line} = ${k * b}x^2$.`,
                  `$\\int_0^{${line}} ${k}x\\,dy = ${k}x \\cdot ${line} = ${k * b}x^2$。`,
                ),
              ],
              [
                ["Integrate in x", "对 x 积分"],
                t(
                  `$\\int_0^{${a}} ${k * b}x^2\\,dx = ${k * b} \\cdot \\frac{${a}^3}{3} = ${ans}$.`,
                  `$\\int_0^{${a}} ${k * b}x^2\\,dx = ${k * b} \\cdot \\frac{${a}^3}{3} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `As a Type II region, $0 \\le y \\le ${b * a}$ and $\\frac{y}{${b}} \\le x \\le ${a}$: $\\int_0^{${b * a}} \\frac{${k}}{2}\\left(${a * a} - \\frac{y^2}{${b * b}}\\right) dy = \\frac{${k}}{2}\\left(${a * a * a * b} - \\frac{${a * a * a * b}}{3}\\right) = ${ans}$.`,
              `作为 Type II 区域，$0 \\le y \\le ${b * a}$，$\\frac{y}{${b}} \\le x \\le ${a}$：$\\int_0^{${b * a}} \\frac{${k}}{2}\\left(${a * a} - \\frac{y^2}{${b * b}}\\right) dy = \\frac{${k}}{2}\\left(${a * a * a * b} - \\frac{${a * a * a * b}}{3}\\right) = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "integrating-xy-over-a-type-i-triangle",
      figure: multivariableDrawings4["double-integrals-over-type-i-regions#integrating-xy-over-a-type-i-triangle"],
      title: t("Integrating $cxy$ over a Type I triangle", "在 Type I 三角形上积分 $cxy$"),
      explanation: t(
        "For a Type I region the inner integral runs in $y$ between two functions of $x$, and the outer integral runs in $x$ between constants. Over the triangle $0 \\le x \\le a$, $0 \\le y \\le x$:\n\n$$\\int_0^a \\int_0^x c\\,xy\\,dy\\,dx = \\int_0^a c\\,x \\cdot \\frac{x^2}{2}\\,dx = \\frac{ca^4}{8}.$$\n\nThe inner result is a function of $x$ alone, which the outer integral then finishes. Over $0 \\le x \\le 2$, $0 \\le y \\le 2x$ instead, $2xy$ gives $\\int_0^2 2x \\cdot \\frac{4x^2}{2}\\,dx = 16$.\n\n> **Watch out.** The inner limit $y = x$ makes the inner result $\\frac{x^2}{2}$ times $cx$; using $y = a$ instead integrates over the whole square and doubles the answer.",
        "对 Type I 型区域，内层对 $y$ 积分，上下限是 $x$ 的函数；外层对 $x$ 在常数之间积分。在三角形 $0 \\le x \\le a$，$0 \\le y \\le x$ 上：\n\n$$\\int_0^a \\int_0^x c\\,xy\\,dy\\,dx = \\int_0^a c\\,x \\cdot \\frac{x^2}{2}\\,dx = \\frac{ca^4}{8}$$\n\n内层结果只依赖 $x$，再由外层积分完成。若改为 $0 \\le x \\le 2$，$0 \\le y \\le 2x$，则 $2xy$ 给出 $\\int_0^2 2x \\cdot \\frac{4x^2}{2}\\,dx = 16$。\n\n> **注意。** 内层上限 $y = x$ 使内层结果为 $cx$ 乘以 $\\frac{x^2}{2}$；若用 $y = a$，就是在整个正方形上积分，答案翻倍。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 6);
        const c = rng.int(1, 5);
        const ans = Q.of(c * a ** 4, 8);
        const cc = coef(c);
        return numberProblem({
          prompt: t(
            `Evaluate $\\iint_D ${cc}xy\\,dA$, where $D = \\{(x, y) : 0 \\le x \\le ${a},\\ 0 \\le y \\le x\\}$.`,
            `计算 $\\iint_D ${cc}xy\\,dA$，其中 $D = \\{(x, y) : 0 \\le x \\le ${a},\\ 0 \\le y \\le x\\}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(c * a ** 4, 4),
              `That is the integral over the square $[0, ${a}]^2$; the inner integral stops at $y = x$.`,
              `那是正方形 $[0, ${a}]^2$ 上的积分；内层积分止于 $y = x$。`,
            ),
            why(
              Q.of(c * a ** 4, 2),
              "The outer antiderivative of $x^3$ is $\\frac{x^4}{4}$; the division by $4$ is missing.",
              "外层 $x^3$ 的原函数是 $\\frac{x^4}{4}$；漏了除以 $4$。",
            ),
            why(
              Q.of(c * a ** 4, 6),
              "The outer antiderivative of $x^3$ is $\\frac{x^4}{4}$, not $\\frac{x^4}{3}$.",
              "外层 $x^3$ 的原函数是 $\\frac{x^4}{4}$，不是 $\\frac{x^4}{3}$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Integrate in y", "对 y 积分"],
                t(
                  `$\\int_0^x ${cc}xy\\,dy = ${cc}x \\cdot \\frac{x^2}{2} = \\frac{${cc}x^3}{2}$.`,
                  `$\\int_0^x ${cc}xy\\,dy = ${cc}x \\cdot \\frac{x^2}{2} = \\frac{${cc}x^3}{2}$。`,
                ),
              ],
              [
                ["Integrate in x", "对 x 积分"],
                t(
                  `$\\int_0^{${a}} \\frac{${cc}x^3}{2}\\,dx = \\frac{${c} \\cdot ${a}^4}{8} = ${ans.toLatex()}$.`,
                  `$\\int_0^{${a}} \\frac{${cc}x^3}{2}\\,dx = \\frac{${c} \\cdot ${a}^4}{8} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `As a Type II region, $0 \\le y \\le ${a}$ and $y \\le x \\le ${a}$: $\\int_0^{${a}} ${cc}y \\cdot \\frac{${a * a} - y^2}{2}\\,dy = \\frac{${c}}{2}\\left(\\frac{${a ** 4}}{2} - \\frac{${a ** 4}}{4}\\right) = ${ans.toLatex()}$.`,
              `作为 Type II 区域，$0 \\le y \\le ${a}$，$y \\le x \\le ${a}$：$\\int_0^{${a}} ${cc}y \\cdot \\frac{${a * a} - y^2}{2}\\,dy = \\frac{${c}}{2}\\left(\\frac{${a ** 4}}{2} - \\frac{${a ** 4}}{4}\\right) = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** doubleIntegralsOverTypeIiRegions computes integrals over Type II regions. */
export const doubleIntegralsOverTypeIiRegions: TopicDef = {
  id: "double-integrals-over-type-ii-regions",
  title: t("Double Integrals Over Type II Regions", "Y-型区域上的二重积分"),
  summary: t(
    "On a Type II region, integrate with respect to x between curve limits h1(y) and h2(y), then integrate with respect to y.",
    "在 Y-型区域上，先对 x 在左右曲线限界 h1(y) 与 h2(y) 之间积分，再对 y 积分。",
  ),
  intro: t(
    "Integrate $y$ over $D = \\{0 \\le y \\le 1,\\ y \\le x \\le 2 - y\\}$, the triangle with vertices $(0, 0)$, $(2, 0)$ and $(1, 1)$. A horizontal strip at height $y$ has length $2 - 2y$, so $\\int_0^1 \\int_y^{2 - y} y\\,dx\\,dy = \\int_0^1 y(2 - 2y)\\,dy = 1 - \\frac{2}{3} = \\frac{1}{3}$.\n\nCheck: the triangle has area $1$ and its centroid is at height $\\frac{0 + 0 + 1}{3} = \\frac{1}{3}$, so $\\iint_D y\\,dA = 1 \\cdot \\frac{1}{3}$.\n\nIn this lesson we evaluate double integrals over Type II regions, with $x$ integrated first between two curves in $y$.",
    "在 $D = \\{0 \\le y \\le 1,\\ y \\le x \\le 2 - y\\}$ 上对 $y$ 积分，它是顶点为 $(0, 0)$、$(2, 0)$、$(1, 1)$ 的三角形。高度为 $y$ 的水平条带长为 $2 - 2y$，所以 $\\int_0^1 \\int_y^{2 - y} y\\,dx\\,dy = \\int_0^1 y(2 - 2y)\\,dy = 1 - \\frac{2}{3} = \\frac{1}{3}$。\n\n检验：三角形面积为 $1$，形心高度为 $\\frac{0 + 0 + 1}{3} = \\frac{1}{3}$，所以 $\\iint_D y\\,dA = 1 \\cdot \\frac{1}{3}$。\n\n本课我们计算 Y-型区域上的二重积分，先在两条关于 $y$ 的曲线之间对 $x$ 积分。",
  ),
  prerequisites: ["type-i-and-ii-regions-in-two-dimensional-space"],
  encompasses: [{ topic: "type-i-and-ii-regions-in-two-dimensional-space", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-double-integrals-with-horizontal-strips",
      title: t("Evaluating double integrals with horizontal strips", "利用水平微元条计算 Y-型二重积分"),
      explanation: t(
        "When the region is bounded on the left and right by functions of the vertical variable, integrate with respect to the horizontal variable first. For $D = \\{(x, y) : 0 \\le y \\le b, 0 \\le x \\le ay\\}$:\n\n$$\\iint_D ky\\,dA = \\int_0^b \\left[\\int_0^{ay} ky\\,dx\\right]dy = \\int_0^b aky^2\\,dy = ak\\frac{b^3}{3}.$$\n\nFor $2y$ over $0 \\le y \\le 3$, $0 \\le x \\le y$, this is $\\int_0^3 2y^2\\,dy = 18$.\n\n> **Watch out.** In the inner integral $ky$ is a constant, multiplied by the strip length $ay$. The strip ends at the line $x = ay$, not at $x = ab$.",
        "当区域的左右边界是竖直变量的函数时，先对水平变量积分。对于区域 $D = \\{(x, y) : 0 \\le y \\le b, 0 \\le x \\le ay\\}$：\n\n$$\\iint_D ky\\,dA = \\int_0^b \\left[\\int_0^{ay} ky\\,dx\\right]dy = \\int_0^b aky^2\\,dy = ak\\frac{b^3}{3}$$\n\n对 $0 \\le y \\le 3$，$0 \\le x \\le y$ 上的 $2y$，结果为 $\\int_0^3 2y^2\\,dy = 18$。\n\n> **注意。** 在内层积分中 $ky$ 是常数，乘以条带长度 $ay$。条带止于直线 $x = ay$，而不是 $x = ab$。",
      ),
      generate(rng: Rng): Problem {
        const b = rng.int(1, 6);
        const a = rng.int(1, 4);
        const m = rng.int(1, 4);
        const k = 3 * m;
        const ans = a * m * b * b * b;
        const line = `${coef(a)}y`;
        return numberProblem({
          prompt: t(
            `Evaluate the double integral $\\iint_D ${k}y\\,dA$ over the Type II region $D$ bounded by $x = 0$, $x = ${line}$, and $y = ${b}$.`,
            `计算二重积分 $\\iint_D ${k}y\\,dA$，其中 $D$ 为由 $x = 0$、$x = ${line}$ 与 $y = ${b}$ 所围成的 Y-型区域。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(3 * m * a * b ** 3, 2),
              `That takes $x$ up to $${a * b}$ for every $y$, which is the rectangle $[0, ${a * b}] \\times [0, ${b}]$; the strip ends at $x = ${line}$.`,
              `那是对每个 $y$ 都让 $x$ 到 $${a * b}$，那是矩形 $[0, ${a * b}] \\times [0, ${b}]$；条带止于 $x = ${line}$。`,
            ),
            why(
              Q.of(m * a * a * b ** 3, 2),
              `That integrates $${k}y$ as if the inner variable were $y$; with respect to $x$ it is a constant times the length $${line}$.`,
              `那是把内层当成对 $y$ 积分 $${k}y$；对 $x$ 积分时它是常数，乘以长度 $${line}$。`,
            ),
            why(
              3 * ans,
              "The antiderivative of $y^2$ is $\\frac{y^3}{3}$; the division by $3$ is missing.",
              "$y^2$ 的原函数是 $\\frac{y^3}{3}$；漏了除以 $3$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Integrate in x", "对 x 积分"],
                t(
                  `$\\int_0^{${line}} ${k}y\\,dx = ${k}y \\cdot ${line} = ${k * a}y^2$.`,
                  `$\\int_0^{${line}} ${k}y\\,dx = ${k}y \\cdot ${line} = ${k * a}y^2$。`,
                ),
              ],
              [
                ["Integrate in y", "对 y 积分"],
                t(
                  `$\\int_0^{${b}} ${k * a}y^2\\,dy = ${k * a} \\cdot \\frac{${b}^3}{3} = ${ans}$.`,
                  `$\\int_0^{${b}} ${k * a}y^2\\,dy = ${k * a} \\cdot \\frac{${b}^3}{3} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `As a Type I region, $0 \\le x \\le ${a * b}$ and $\\frac{x}{${a}} \\le y \\le ${b}$: $\\int_0^{${a * b}} \\frac{${k}}{2}\\left(${b * b} - \\frac{x^2}{${a * a}}\\right) dx = \\frac{${k}}{2}\\left(${a * b ** 3} - \\frac{${a * b ** 3}}{3}\\right) = ${ans}$.`,
              `作为 Type I 区域，$0 \\le x \\le ${a * b}$，$\\frac{x}{${a}} \\le y \\le ${b}$：$\\int_0^{${a * b}} \\frac{${k}}{2}\\left(${b * b} - \\frac{x^2}{${a * a}}\\right) dx = \\frac{${k}}{2}\\left(${a * b ** 3} - \\frac{${a * b ** 3}}{3}\\right) = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "integrating-x-over-a-type-ii-parabolic-region",
      title: t("Integrating $cx$ over a Type II parabolic region", "在 Type II 抛物线区域上积分 $cx$"),
      explanation: t(
        "For a Type II region the inner integral runs in $x$ between two functions of $y$. Over $0 \\le y \\le b$, $0 \\le x \\le y^2$:\n\n$$\\int_0^b \\int_0^{y^2} c\\,x\\,dx\\,dy = \\int_0^b \\frac{c\\,y^4}{2}\\,dy = \\frac{cb^5}{10}.$$\n\nIntegrating in $x$ first avoids splitting the region, because its left and right boundaries are single curves in $y$. For $7x$ with $b = 1$ the integral is $\\frac{7}{10}$.\n\n> **Watch out.** The inner result is $\\frac{x^2}{2}$ at $x = y^2$, which is $\\frac{y^4}{2}$, not $\\frac{y^2}{2}$.",
        "对 Type II 型区域，内层对 $x$ 积分，上下限是 $y$ 的函数。在 $0 \\le y \\le b$，$0 \\le x \\le y^2$ 上：\n\n$$\\int_0^b \\int_0^{y^2} c\\,x\\,dx\\,dy = \\int_0^b \\frac{c\\,y^4}{2}\\,dy = \\frac{cb^5}{10}$$\n\n先对 $x$ 积分无需拆分区域，因为左右边界都是关于 $y$ 的单一曲线。对 $7x$ 与 $b = 1$，积分为 $\\frac{7}{10}$。\n\n> **注意。** 内层结果是 $\\frac{x^2}{2}$ 在 $x = y^2$ 处的值，即 $\\frac{y^4}{2}$，不是 $\\frac{y^2}{2}$。",
      ),
      generate(rng: Rng): Problem {
        const b = rng.int(1, 5);
        const c = rng.int(1, 6);
        const ans = Q.of(c * b ** 5, 10);
        const cc = coef(c);
        return numberProblem({
          prompt: t(
            `Evaluate $\\iint_D ${cc}x\\,dA$, where $D = \\{(x, y) : 0 \\le y \\le ${b},\\ 0 \\le x \\le y^2\\}$.`,
            `计算 $\\iint_D ${cc}x\\,dA$，其中 $D = \\{(x, y) : 0 \\le y \\le ${b},\\ 0 \\le x \\le y^2\\}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(c * b ** 5, 5),
              "The inner antiderivative of $x$ is $\\frac{x^2}{2}$; the factor $\\frac{1}{2}$ is missing.",
              "内层 $x$ 的原函数是 $\\frac{x^2}{2}$；漏了因子 $\\frac{1}{2}$。",
            ),
            why(
              Q.of(c * b ** 3, 6),
              "That uses $x \\le y$; the right boundary is $x = y^2$, so the inner result is $\\frac{y^4}{2}$.",
              "那是用了 $x \\le y$；右边界是 $x = y^2$，所以内层结果是 $\\frac{y^4}{2}$。",
            ),
            why(
              Q.of(c * b ** 5, 2),
              "The outer antiderivative of $y^4$ is $\\frac{y^5}{5}$; the division by $5$ is missing.",
              "外层 $y^4$ 的原函数是 $\\frac{y^5}{5}$；漏了除以 $5$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Integrate in x", "对 x 积分"],
                t(
                  `$\\int_0^{y^2} ${cc}x\\,dx = \\frac{${cc}(y^2)^2}{2} = \\frac{${cc}y^4}{2}$.`,
                  `$\\int_0^{y^2} ${cc}x\\,dx = \\frac{${cc}(y^2)^2}{2} = \\frac{${cc}y^4}{2}$。`,
                ),
              ],
              [
                ["Integrate in y", "对 y 积分"],
                t(
                  `$\\int_0^{${b}} \\frac{${cc}y^4}{2}\\,dy = \\frac{${c} \\cdot ${b}^5}{10} = ${ans.toLatex()}$.`,
                  `$\\int_0^{${b}} \\frac{${cc}y^4}{2}\\,dy = \\frac{${c} \\cdot ${b}^5}{10} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `As a Type I region, $0 \\le x \\le ${b * b}$ and $\\sqrt{x} \\le y \\le ${b}$: $\\int_0^{${b * b}} ${cc}x(${b} - \\sqrt{x})\\,dx = ${c}\\left(\\frac{${b ** 5}}{2} - \\frac{2 \\cdot ${b ** 5}}{5}\\right) = ${ans.toLatex()}$.`,
              `作为 Type I 区域，$0 \\le x \\le ${b * b}$，$\\sqrt{x} \\le y \\le ${b}$：$\\int_0^{${b * b}} ${cc}x(${b} - \\sqrt{x})\\,dx = ${c}\\left(\\frac{${b ** 5}}{2} - \\frac{2 \\cdot ${b ** 5}}{5}\\right) = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** doubleIntegralsOverPartitionedRegions splits regions when boundary definitions change. */
export const doubleIntegralsOverPartitionedRegions: TopicDef = {
  id: "double-integrals-over-partitioned-regions",
  title: t("Double Integrals Over Partitioned Regions", "分块区域上的二重积分"),
  summary: t(
    "When a region's upper or lower boundary is piecewise defined, split the double integral into a sum over non-overlapping subregions.",
    "当区域的上下边界呈分段定义时，将二重积分拆分为各不重叠子区域上的积分之和。",
  ),
  intro: t(
    "Integrate $y$ over the L-shape $R_1 \\cup R_2$ with $R_1 = [0, 1] \\times [0, 3]$ and $R_2 = [1, 4] \\times [0, 1]$. The pieces overlap only along an edge, so the integral is the sum: $\\iint_{R_1} y\\,dA = 1 \\cdot \\frac{9}{2}$ and $\\iint_{R_2} y\\,dA = 3 \\cdot \\frac{1}{2}$, for a total of $\\frac{9}{2} + \\frac{3}{2} = 6$.\n\nCheck: the L-shape is the rectangle $[0, 4] \\times [0, 3]$ minus $[1, 4] \\times [1, 3]$, and $4 \\cdot \\frac{9}{2} - 3 \\cdot \\frac{9 - 1}{2} = 18 - 12 = 6$.\n\nIn this lesson we integrate over regions that split into simpler pieces, adding the integrals over the pieces.",
    "在 L 形 $R_1 \\cup R_2$ 上对 $y$ 积分，其中 $R_1 = [0, 1] \\times [0, 3]$，$R_2 = [1, 4] \\times [0, 1]$。两块只在一条边上重叠，所以积分是两者之和：$\\iint_{R_1} y\\,dA = 1 \\cdot \\frac{9}{2}$，$\\iint_{R_2} y\\,dA = 3 \\cdot \\frac{1}{2}$，合计 $\\frac{9}{2} + \\frac{3}{2} = 6$。\n\n检验：L 形是矩形 $[0, 4] \\times [0, 3]$ 去掉 $[1, 4] \\times [1, 3]$，而 $4 \\cdot \\frac{9}{2} - 3 \\cdot \\frac{9 - 1}{2} = 18 - 12 = 6$。\n\n本课我们在可分成简单几块的区域上积分，把各块上的积分相加。",
  ),
  prerequisites: ["double-integrals-over-type-i-regions", "double-integrals-over-type-ii-regions"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-double-integrals-by-domain-decomposition",
      figure: multivariableDrawings4["double-integrals-over-partitioned-regions#evaluating-double-integrals-by-domain-decomposition"],
      title: t("Evaluating double integrals by domain decomposition", "通过区域分割计算二重积分"),
      explanation: t(
        "Splitting a region into simpler pieces lets you use convenient limits on each, and the integral over the whole is the sum of the pieces. If $R = R_1 \\cup R_2$ with disjoint interiors, then $\\iint_R f\\,dA = \\iint_{R_1} f\\,dA + \\iint_{R_2} f\\,dA$. For two adjacent rectangles $R_1 = [0, c] \\times [0, h_1]$ and $R_2 = [c, d] \\times [0, h_2]$:\n\n$$\\iint_R k\\,dA = k\\left(c h_1 + (d - c)h_2\\right).$$\n\nFor $k = 5$ on $[0, 6] \\times [0, 1] \\cup [6, 7] \\times [0, 2]$ the integral is $5(6 + 2) = 40$.\n\n> **Watch out.** The second rectangle is $d - c$ wide, not $d$: it starts where the first one ends.",
        "把区域分成更简单的几部分，每部分都可以用方便的积分限，整体上的积分就是各部分积分的和。若 $R = R_1 \\cup R_2$ 且内部不相交，则 $\\iint_R f\\,dA = \\iint_{R_1} f\\,dA + \\iint_{R_2} f\\,dA$。对于两个相邻矩形 $R_1 = [0, c] \\times [0, h_1]$ 与 $R_2 = [c, d] \\times [0, h_2]$：\n\n$$\\iint_R k\\,dA = k\\left(c h_1 + (d - c)h_2\\right)$$\n\n对 $[0, 6] \\times [0, 1] \\cup [6, 7] \\times [0, 2]$ 上的 $k = 5$，积分为 $5(6 + 2) = 40$。\n\n> **注意。** 第二个矩形宽 $d - c$，不是 $d$：它从第一个矩形的终点开始。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(1, 5);
        const w2 = rng.int(1, 5);
        const d = c + w2;
        const h1 = rng.int(1, 6);
        const h2 = rng.int(1, 6);
        const k = rng.int(1, 4);
        const area1 = c * h1;
        const area2 = w2 * h2;
        const ans = k * (area1 + area2);
        const H = Math.max(h1, h2);
        const missing = h1 >= h2 ? w2 * (h1 - h2) : c * (h2 - h1);
        return numberProblem({
          prompt: t(
            `Find the value of $\\iint_R ${k}\\,dA$ over the L-shaped union of two rectangular regions $R_1 = [0, ${c}] \\times [0, ${h1}]$ and $R_2 = [${c}, ${d}] \\times [0, ${h2}]$.`,
            `计算 $\\iint_R ${k}\\,dA$ 的值，其中积分区域 $R = R_1 \\cup R_2$ 为两个相邻矩形 $R_1 = [0, ${c}] \\times [0, ${h1}]$ 与 $R_2 = [${c}, ${d}] \\times [0, ${h2}]$ 的无缝拼接区域。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              k * (area1 + d * h2),
              `That gives $R_2$ the width $${d}$; it runs from $${c}$ to $${d}$, so its width is $${w2}$.`,
              `那是让 $R_2$ 宽 $${d}$；它从 $${c}$ 到 $${d}$，宽为 $${w2}$。`,
            ),
            why(
              k * area1,
              "That leaves out $R_2$; the integral over the union adds both pieces.",
              "那漏了 $R_2$；并集上的积分要把两块都加上。",
            ),
            why(
              area1 + area2,
              `That is the area of $R$; the integrand $${k}$ multiplies it.`,
              `那是 $R$ 的面积；还要乘以被积函数 $${k}$。`,
            ),
            why(
              k * d * H,
              `That integrates over the whole bounding rectangle $[0, ${d}] \\times [0, ${H}]$, including the missing corner.`,
              `那是在整个外接矩形 $[0, ${d}] \\times [0, ${H}]$ 上积分，包括了缺掉的角。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the areas", "求面积"],
                t(
                  `$\\operatorname{Area}(R_1) = ${c} \\cdot ${h1} = ${area1}$ and $\\operatorname{Area}(R_2) = (${d} - ${c}) \\cdot ${h2} = ${area2}$.`,
                  `$\\operatorname{Area}(R_1) = ${c} \\cdot ${h1} = ${area1}$，$\\operatorname{Area}(R_2) = (${d} - ${c}) \\cdot ${h2} = ${area2}$。`,
                ),
              ],
              [
                ["Add the pieces", "把两块相加"],
                t(
                  `$\\iint_R ${k}\\,dA = ${k}(${area1} + ${area2}) = ${ans}$.`,
                  `$\\iint_R ${k}\\,dA = ${k}(${area1} + ${area2}) = ${ans}$。`,
                ),
              ],
            ],
            t(
              `$R$ is the rectangle $[0, ${d}] \\times [0, ${H}]$ of area $${d * H}$ minus a missing piece of area $${missing}$, so $${k}(${d * H} - ${missing}) = ${ans}$.`,
              `$R$ 是面积为 $${d * H}$ 的矩形 $[0, ${d}] \\times [0, ${H}]$ 去掉面积为 $${missing}$ 的一块，所以 $${k}(${d * H} - ${missing}) = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "integrating-x-over-an-l-shaped-region",
      title: t("Integrating $cx$ over an L-shaped region", "在 L 形区域上积分 $cx$"),
      explanation: t(
        "When a region splits into pieces that overlap only along edges, the integral over the region is the sum of the integrals over the pieces: $\\iint_{R_1 \\cup R_2} f\\,dA = \\iint_{R_1} f\\,dA + \\iint_{R_2} f\\,dA$. For a non-constant integrand each piece must be integrated with its own limits. For $f = cx$ on $[p, q] \\times [0, h]$ the integral is $c\\,\\frac{q^2 - p^2}{2}\\,h$. For $5x$ on $[0, 1] \\times [0, 3] \\cup [1, 2] \\times [0, 1]$ the pieces give $5 \\cdot \\frac{1}{2} \\cdot 3 = \\frac{15}{2}$ and $5 \\cdot \\frac{4 - 1}{2} \\cdot 1 = \\frac{15}{2}$, so the total is $15$.\n\n> **Watch out.** The second piece starts at $x = a$, so its $x$ integral is $\\frac{b^2 - a^2}{2}$, not $\\frac{b^2}{2}$; using $\\frac{b^2}{2}$ counts the strip $[0, a]$ twice.",
        "当区域可分成只在边上重叠的几块时，区域上的积分等于各块积分之和：$\\iint_{R_1 \\cup R_2} f\\,dA = \\iint_{R_1} f\\,dA + \\iint_{R_2} f\\,dA$。对非常数被积函数，每块都要用自己的积分限。对 $[p, q] \\times [0, h]$ 上的 $f = cx$，积分为 $c\\,\\frac{q^2 - p^2}{2}\\,h$。对 $[0, 1] \\times [0, 3] \\cup [1, 2] \\times [0, 1]$ 上的 $5x$，两块分别给出 $5 \\cdot \\frac{1}{2} \\cdot 3 = \\frac{15}{2}$ 和 $5 \\cdot \\frac{4 - 1}{2} \\cdot 1 = \\frac{15}{2}$，合计 $15$。\n\n> **注意。** 第二块从 $x = a$ 开始，所以它的 $x$ 积分是 $\\frac{b^2 - a^2}{2}$，不是 $\\frac{b^2}{2}$；用 $\\frac{b^2}{2}$ 会把 $[0, a]$ 这一条算两次。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(1, 4);
        const a = rng.int(1, 3);
        const b = a + rng.int(1, 3);
        const h1 = rng.int(2, 5);
        const h2 = rng.int(1, h1 - 1);
        const i1 = Q.of(c * a * a * h1, 2);
        const i2 = Q.of(c * (b * b - a * a) * h2, 2);
        const ans = i1.add(i2);
        const cc = coef(c);
        const whole = Q.of(c * b * b * h1, 2);
        const cut = Q.of(c * (b * b - a * a) * (h1 - h2), 2);
        return numberProblem({
          prompt: t(
            `Evaluate $\\iint_R ${cc}x\\,dA$ over the L-shaped region $R = R_1 \\cup R_2$ with $R_1 = [0, ${a}] \\times [0, ${h1}]$ and $R_2 = [${a}, ${b}] \\times [0, ${h2}]$.`,
            `计算 L 形区域 $R = R_1 \\cup R_2$ 上的 $\\iint_R ${cc}x\\,dA$，其中 $R_1 = [0, ${a}] \\times [0, ${h1}]$，$R_2 = [${a}, ${b}] \\times [0, ${h2}]$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              whole,
              `That integrates over the bounding rectangle $[0, ${b}] \\times [0, ${h1}]$, including the empty corner above $R_2$.`,
              `那是在外接矩形 $[0, ${b}] \\times [0, ${h1}]$ 上积分，包括了 $R_2$ 上方的空角。`,
            ),
            why(
              Q.of(c * (a * a * h1 + b * b * h2), 2),
              `That integrates $x$ from $0$ to $${b}$ on $R_2$; it starts at $x = ${a}$, so use $\\frac{${b * b} - ${a * a}}{2}$.`,
              `那是在 $R_2$ 上对 $x$ 从 $0$ 积到 $${b}$；它从 $x = ${a}$ 开始，所以要用 $\\frac{${b * b} - ${a * a}}{2}$。`,
            ),
            why(i1, "That leaves out $R_2$; the integral over the union adds both pieces.", "那漏了 $R_2$；并集上的积分要把两块都加上。"),
          ]),
          solution: walked(
            [
              [
                ["Integrate over the first piece", "第一块上的积分"],
                t(
                  `$\\iint_{R_1} ${cc}x\\,dA = ${c} \\cdot \\frac{${a * a}}{2} \\cdot ${h1} = ${i1.toLatex()}$.`,
                  `$\\iint_{R_1} ${cc}x\\,dA = ${c} \\cdot \\frac{${a * a}}{2} \\cdot ${h1} = ${i1.toLatex()}$。`,
                ),
              ],
              [
                ["Integrate over the second piece", "第二块上的积分"],
                t(
                  `$\\iint_{R_2} ${cc}x\\,dA = ${c} \\cdot \\frac{${b * b} - ${a * a}}{2} \\cdot ${h2} = ${i2.toLatex()}$.`,
                  `$\\iint_{R_2} ${cc}x\\,dA = ${c} \\cdot \\frac{${b * b} - ${a * a}}{2} \\cdot ${h2} = ${i2.toLatex()}$。`,
                ),
              ],
              [
                ["Add", "相加"],
                t(`$${i1.toLatex()} + ${i2.toLatex()} = ${ans.toLatex()}$.`, `$${i1.toLatex()} + ${i2.toLatex()} = ${ans.toLatex()}$。`),
              ],
            ],
            t(
              `The bounding rectangle $[0, ${b}] \\times [0, ${h1}]$ gives $${whole.toLatex()}$, and the empty corner $[${a}, ${b}] \\times [${h2}, ${h1}]$ gives $${cut.toLatex()}$; their difference is $${ans.toLatex()}$.`,
              `外接矩形 $[0, ${b}] \\times [0, ${h1}]$ 给出 $${whole.toLatex()}$，空角 $[${a}, ${b}] \\times [${h2}, ${h1}]$ 给出 $${cut.toLatex()}$；两者之差为 $${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** changingTheOrderOfIntegrationInDoubleIntegrals reverses integration order. */
export const changingTheOrderOfIntegrationInDoubleIntegrals: TopicDef = {
  id: "changing-the-order-of-integration-in-double-integrals",
  title: t("Changing the Order of Integration in Double Integrals", "交换二重积分的积分次序"),
  summary: t(
    "Reversing the order of integration often renders an otherwise intractable iterated integral easily solvable.",
    "通过交换积分次序，往往能将原本难以甚至无法求出初等原函数的二次积分转化为易求的积分。",
  ),
  intro: t(
    "The integral $\\int_0^1 \\int_y^1 e^{x^2}\\,dx\\,dy$ cannot be done as written, since $e^{x^2}$ has no elementary antiderivative. Its region is the triangle $0 \\le y \\le x \\le 1$, which is also $0 \\le x \\le 1$, $0 \\le y \\le x$. In that order the inner integral is $\\int_0^x e^{x^2}\\,dy = xe^{x^2}$, and $\\int_0^1 xe^{x^2}\\,dx = \\frac{e - 1}{2}$.\n\nCheck: $e^{x^2}$ lies between $1$ and $e$ on a triangle of area $\\frac{1}{2}$, so the integral lies between $\\frac{1}{2}$ and $\\frac{e}{2}$, and $\\frac{e - 1}{2} \\approx 0.86$ does.\n\nIn this lesson we reverse the order of integration by redescribing the region, which can turn a hard integral into an easy one.",
    "积分 $\\int_0^1 \\int_y^1 e^{x^2}\\,dx\\,dy$ 按原样无法计算，因为 $e^{x^2}$ 没有初等原函数。它的区域是三角形 $0 \\le y \\le x \\le 1$，也就是 $0 \\le x \\le 1$，$0 \\le y \\le x$。按这个次序，内层积分为 $\\int_0^x e^{x^2}\\,dy = xe^{x^2}$，而 $\\int_0^1 xe^{x^2}\\,dx = \\frac{e - 1}{2}$。\n\n检验：在面积为 $\\frac{1}{2}$ 的三角形上 $e^{x^2}$ 介于 $1$ 与 $e$ 之间，所以积分介于 $\\frac{1}{2}$ 与 $\\frac{e}{2}$ 之间，而 $\\frac{e - 1}{2} \\approx 0.86$ 确实如此。\n\n本课我们通过重新描述区域来交换积分次序，这可以把难算的积分变成容易的积分。",
  ),
  prerequisites: ["double-integrals-over-partitioned-regions"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "reversing-order-to-enable-integration",
      title: t("Reversing order to enable integration", "交换积分次序以求值"),
      explanation: t(
        "Sketch the region and describe it the other way around; the new order of integration can make an impossible inner integral easy. The integral $\\int_0^a \\int_y^a x^2\\,dx\\,dy$ is evaluated by reversing the order:\n\n$$\\int_0^a \\left[\\int_0^x x^2\\,dy\\right]dx = \\int_0^a x^3\\,dx = \\frac{a^4}{4}.$$\n\nFor $\\int_0^1 \\int_y^1 3x^2\\,dx\\,dy$ this gives $\\int_0^1 3x^3\\,dx = \\frac{3}{4}$.\n\n> **Watch out.** The region $y \\le x$ lies below the diagonal, so after reversing, $y$ runs from $0$ up to $x$, not from $x$ up to $a$.",
        "画出区域并换一种方式描述它；新的积分次序可以使原来无法计算的内层积分变得容易。积分 $\\int_0^a \\int_y^a x^2\\,dx\\,dy$ 可通过交换积分次序计算：\n\n$$\\int_0^a \\left[\\int_0^x x^2\\,dy\\right]dx = \\int_0^a x^3\\,dx = \\frac{a^4}{4}$$\n\n对 $\\int_0^1 \\int_y^1 3x^2\\,dx\\,dy$，结果为 $\\int_0^1 3x^3\\,dx = \\frac{3}{4}$。\n\n> **注意。** 区域 $y \\le x$ 在对角线下方，所以交换后 $y$ 从 $0$ 到 $x$，而不是从 $x$ 到 $a$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 35);
        const a4 = a ** 4;
        const ans = Q.of(a4, 4);
        return numberProblem({
          prompt: t(
            `Evaluate the iterated integral $\\int_0^{${a}} \\int_y^{${a}} x^2\\,dx\\,dy$ by reversing the order of integration.`,
            `通过交换积分次序计算二次积分 $\\int_0^{${a}} \\int_y^{${a}} x^2\\,dx\\,dy$ 的值。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(a4, 12),
              `That takes $y$ from $x$ to $${a}$, the triangle above the diagonal; the region $y \\le x$ lies below it.`,
              `那是让 $y$ 从 $x$ 到 $${a}$，那是对角线上方的三角形；区域 $y \\le x$ 在它下方。`,
            ),
            why(
              Q.of(a4, 3),
              `That integrates over the whole square $[0, ${a}]^2$; the region is only the half with $y \\le x$.`,
              `那是在整个正方形 $[0, ${a}]^2$ 上积分；区域只是 $y \\le x$ 的那一半。`,
            ),
            why(
              Q.of(a ** 3, 3),
              "That leaves out the inner integral, which multiplies $x^2$ by the strip length $x$.",
              "那是漏了内层积分；它把 $x^2$ 乘以条带长度 $x$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Read the region", "读出区域"],
                t(
                  `The limits say $0 \\le y \\le ${a}$ and $y \\le x \\le ${a}$: the triangle below the diagonal, which is also $0 \\le x \\le ${a}$, $0 \\le y \\le x$.`,
                  `积分限给出 $0 \\le y \\le ${a}$，$y \\le x \\le ${a}$：对角线下方的三角形，也就是 $0 \\le x \\le ${a}$，$0 \\le y \\le x$。`,
                ),
              ],
              [
                ["Integrate in the new order", "按新次序积分"],
                t(
                  `$\\int_0^{${a}} \\int_0^x x^2\\,dy\\,dx = \\int_0^{${a}} x^3\\,dx = \\frac{${a}^4}{4} = ${ans.toLatex()}$.`,
                  `$\\int_0^{${a}} \\int_0^x x^2\\,dy\\,dx = \\int_0^{${a}} x^3\\,dx = \\frac{${a}^4}{4} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The original order works too: $\\int_y^{${a}} x^2\\,dx = \\frac{${a ** 3} - y^3}{3}$, and $\\int_0^{${a}} \\frac{${a ** 3} - y^3}{3}\\,dy = \\frac{1}{3}\\left(${a4} - \\frac{${a4}}{4}\\right) = ${ans.toLatex()}$.`,
              `原次序也能算：$\\int_y^{${a}} x^2\\,dx = \\frac{${a ** 3} - y^3}{3}$，而 $\\int_0^{${a}} \\frac{${a ** 3} - y^3}{3}\\,dy = \\frac{1}{3}\\left(${a4} - \\frac{${a4}}{4}\\right) = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "reversing-an-integral-with-a-square-root-limit",
      title: t("Reversing an integral with a square-root limit", "交换含平方根积分限的积分次序"),
      explanation: t(
        "The integral $\\int_0^{a^2} \\int_{\\sqrt{y}}^{a} f\\,dx\\,dy$ covers the region $\\sqrt{y} \\le x \\le a$, $0 \\le y \\le a^2$. Squaring $x = \\sqrt{y}$ gives $y = x^2$, so the same region is $0 \\le x \\le a$, $0 \\le y \\le x^2$. Sketching the region before changing the limits is the safest way to get them right. Reversing the order gives\n\n$$\\int_0^a \\int_0^{x^2} f\\,dy\\,dx.$$\n\nFor $\\int_0^{36} \\int_{\\sqrt{y}}^{6} x\\,dx\\,dy$ this is $\\int_0^6 x^3\\,dx = 324$.\n\n> **Watch out.** The region is below the parabola $y = x^2$, so $y$ runs from $0$ to $x^2$; letting $y$ run all the way to $a^2$ covers a rectangle.",
        "积分 $\\int_0^{a^2} \\int_{\\sqrt{y}}^{a} f\\,dx\\,dy$ 覆盖区域 $\\sqrt{y} \\le x \\le a$，$0 \\le y \\le a^2$。把 $x = \\sqrt{y}$ 两边平方得 $y = x^2$，所以同一区域是 $0 \\le x \\le a$，$0 \\le y \\le x^2$。换限之前先画出区域是最稳妥的做法。交换次序得\n\n$$\\int_0^a \\int_0^{x^2} f\\,dy\\,dx$$\n\n对 $\\int_0^{36} \\int_{\\sqrt{y}}^{6} x\\,dx\\,dy$，结果为 $\\int_0^6 x^3\\,dx = 324$。\n\n> **注意。** 区域在抛物线 $y = x^2$ 下方，所以 $y$ 从 $0$ 到 $x^2$；让 $y$ 一直到 $a^2$ 就覆盖了一个矩形。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const c = rng.int(1, 6);
        const ans = Q.of(c * a ** 4, 4);
        const cc = coef(c);
        return numberProblem({
          prompt: t(
            `Evaluate $\\int_0^{${a * a}} \\int_{\\sqrt{y}}^{${a}} ${cc}x\\,dx\\,dy$ by reversing the order of integration.`,
            `交换积分次序，计算 $\\int_0^{${a * a}} \\int_{\\sqrt{y}}^{${a}} ${cc}x\\,dx\\,dy$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(c * a ** 4, 2),
              `That lets $y$ run to $${a * a}$ for every $x$, a rectangle; the region lies below $y = x^2$.`,
              `那是对每个 $x$ 都让 $y$ 到 $${a * a}$，是一个矩形；区域在 $y = x^2$ 下方。`,
            ),
            why(
              Q.of(c * a ** 3, 3),
              "The inner integral multiplies $cx$ by the strip length $x^2$, so the outer integrand is $cx^3$, not $cx^2$.",
              "内层积分把 $cx$ 乘以条带长度 $x^2$，所以外层被积函数是 $cx^3$，不是 $cx^2$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Redescribe the region", "重新描述区域"],
                t(
                  `$\\sqrt{y} \\le x \\le ${a}$ with $0 \\le y \\le ${a * a}$ is the region under $y = x^2$: $0 \\le x \\le ${a}$, $0 \\le y \\le x^2$.`,
                  `$\\sqrt{y} \\le x \\le ${a}$，$0 \\le y \\le ${a * a}$ 是 $y = x^2$ 下方的区域：$0 \\le x \\le ${a}$，$0 \\le y \\le x^2$。`,
                ),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `$\\int_0^{${a}} \\int_0^{x^2} ${cc}x\\,dy\\,dx = \\int_0^{${a}} ${cc}x^3\\,dx = \\frac{${c} \\cdot ${a ** 4}}{4} = ${ans.toLatex()}$.`,
                  `$\\int_0^{${a}} \\int_0^{x^2} ${cc}x\\,dy\\,dx = \\int_0^{${a}} ${cc}x^3\\,dx = \\frac{${c} \\cdot ${a ** 4}}{4} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The original order also works here: $\\int_{\\sqrt{y}}^{${a}} ${cc}x\\,dx = \\frac{${c}(${a * a} - y)}{2}$, and $\\int_0^{${a * a}} \\frac{${c}(${a * a} - y)}{2}\\,dy = \\frac{${c}}{2} \\cdot \\frac{${a ** 4}}{2} = ${ans.toLatex()}$.`,
              `这里原次序也能算：$\\int_{\\sqrt{y}}^{${a}} ${cc}x\\,dx = \\frac{${c}(${a * a} - y)}{2}$，而 $\\int_0^{${a * a}} \\frac{${c}(${a * a} - y)}{2}\\,dy = \\frac{${c}}{2} \\cdot \\frac{${a ** 4}}{2} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 3.15 Triple Integrals
// ---------------------------------------------------------------------------

/** repeatedIntegralsInThreeDimensions evaluates iterated integrals in 3D. */
export const repeatedIntegralsInThreeDimensions: TopicDef = {
  id: "repeated-integrals-in-three-dimensions",
  title: t("Repeated Integrals in Three Dimensions", "三维空间中的三次积分"),
  summary: t(
    "A triple iterated integral evaluates three successive single integrals from the innermost variable outward.",
    "三次积分通过从最内层变量逐次向外层计算三个连续的定积分来求值。",
  ),
  intro: t(
    "Evaluate $\\int_0^2 \\int_0^1 \\int_0^3 (2x + z)\\,dz\\,dy\\,dx$ from the inside out. The $z$ integral is $6x + \\frac{9}{2}$, which does not depend on $y$, so the $y$ integral over $[0, 1]$ leaves it unchanged. The $x$ integral is then $\\int_0^2 \\left(6x + \\frac{9}{2}\\right) dx = 12 + 9 = 21$.\n\nCheck: integrate in $x$ first instead. $\\int_0^2 (2x + z)\\,dx = 4 + 2z$, then $y$ multiplies by $1$, and $\\int_0^3 (4 + 2z)\\,dz = 12 + 9 = 21$.\n\nIn this lesson we evaluate triple iterated integrals one variable at a time, from the innermost outward.",
    "由内向外计算 $\\int_0^2 \\int_0^1 \\int_0^3 (2x + z)\\,dz\\,dy\\,dx$。对 $z$ 积分得 $6x + \\frac{9}{2}$，它与 $y$ 无关，所以在 $[0, 1]$ 上对 $y$ 积分后不变。再对 $x$ 积分，$\\int_0^2 \\left(6x + \\frac{9}{2}\\right) dx = 12 + 9 = 21$。\n\n检验：改为先对 $x$ 积分。$\\int_0^2 (2x + z)\\,dx = 4 + 2z$，对 $y$ 积分乘以 $1$，而 $\\int_0^3 (4 + 2z)\\,dz = 12 + 9 = 21$。\n\n本课我们由最内层向外，一次一个变量地计算三次积分。",
  ),
  prerequisites: ["double-integrals-over-rectangular-domains"],
  encompasses: [{ topic: "double-integrals-over-rectangular-domains", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-iterated-triple-integrals",
      title: t("Evaluating iterated triple integrals", "计算三次积分"),
      explanation: t(
        "A triple integral is evaluated from the inside out, one variable at a time, treating the variables not yet integrated as constants. Evaluate $\\int_0^a \\int_0^b \\int_0^c (x + y + z)\\,dz\\,dy\\,dx$ successively from $z$, to $y$, to $x$:\n\n$$\\int_0^a \\int_0^b \\int_0^c (x + y + z)\\,dz\\,dy\\,dx = abc\\frac{a + b + c}{2}.$$\n\nFor $a = 6$ and $b = c = 1$ this is $6 \\cdot \\frac{8}{2} = 24$.\n\n> **Watch out.** A variable that is not being integrated is a constant and gets multiplied by the length of the interval. Each variable that is integrated brings a factor $\\frac{1}{2}$ from its antiderivative.",
        "三重积分由内向外逐个变量计算，把还没有积分的变量当作常数。按 $z$、$y$、$x$ 的顺序依次计算三次积分 $\\int_0^a \\int_0^b \\int_0^c (x + y + z)\\,dz\\,dy\\,dx$：\n\n$$\\int_0^a \\int_0^b \\int_0^c (x + y + z)\\,dz\\,dy\\,dx = abc\\frac{a + b + c}{2}$$\n\n当 $a = 6$，$b = c = 1$ 时，结果为 $6 \\cdot \\frac{8}{2} = 24$。\n\n> **注意。** 不在积分的变量是常数，要乘以区间的长度。被积分的变量由原函数带来因子 $\\frac{1}{2}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const c = rng.int(1, 5);
        const num = a * b * c * (a + b + c);
        const ans = Q.of(num, 2);
        return numberProblem({
          prompt: t(
            `Evaluate the iterated triple integral $\\int_0^{${a}} \\int_0^{${b}} \\int_0^{${c}} (x + y + z)\\,dz\\,dy\\,dx$.`,
            `计算三次积分 $\\int_0^{${a}} \\int_0^{${b}} \\int_0^{${c}} (x + y + z)\\,dz\\,dy\\,dx$ 的值。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(Q.of(num), "The factors $\\frac{1}{2}$ from the antiderivatives are missing.", "漏了原函数带来的因子 $\\frac{1}{2}$。"),
            why(
              Q.of(a * a + b * b + c * c, 2),
              "That integrates each variable over its own interval only; the other two lengths still multiply each term.",
              "那是每个变量只在自己的区间上积分；每一项还要乘以另外两个区间的长度。",
            ),
            why(
              a * b * c,
              `That is the volume $${a * b * c}$ of the box, the integral of $1$; the integrand is $x + y + z$.`,
              `那是长方体的体积 $${a * b * c}$，即 $1$ 的积分；被积函数是 $x + y + z$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Integrate in z", "对 z 积分"],
                t(
                  `$\\int_0^{${c}} (x + y + z)\\,dz = ${c}(x + y) + \\frac{${c * c}}{2}$.`,
                  `$\\int_0^{${c}} (x + y + z)\\,dz = ${c}(x + y) + \\frac{${c * c}}{2}$。`,
                ),
              ],
              [
                ["Integrate in y", "对 y 积分"],
                t(
                  `$\\int_0^{${b}} \\left(${poly([c, "x"], [c, "y"])} + \\frac{${c * c}}{2}\\right)dy = ${poly([b * c, "x"])} + \\frac{${b * c}(${b + c})}{2}$.`,
                  `$\\int_0^{${b}} \\left(${poly([c, "x"], [c, "y"])} + \\frac{${c * c}}{2}\\right)dy = ${poly([b * c, "x"])} + \\frac{${b * c}(${b + c})}{2}$。`,
                ),
              ],
              [
                ["Integrate in x", "对 x 积分"],
                t(
                  `$\\int_0^{${a}} \\left(${poly([b * c, "x"])} + \\frac{${b * c}(${b + c})}{2}\\right)dx = \\frac{${b * c * a * a}}{2} + \\frac{${a * b * c * (b + c)}}{2} = ${ans.toLatex()}$.`,
                  `$\\int_0^{${a}} \\left(${poly([b * c, "x"])} + \\frac{${b * c}(${b + c})}{2}\\right)dx = \\frac{${b * c * a * a}}{2} + \\frac{${a * b * c * (b + c)}}{2} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The average of $x + y + z$ over the box is $\\frac{${a}}{2} + \\frac{${b}}{2} + \\frac{${c}}{2} = ${Q.of(a + b + c, 2).toLatex()}$, and times the volume $${a * b * c}$ that is $${ans.toLatex()}$.`,
              `$x + y + z$ 在长方体上的平均值为 $\\frac{${a}}{2} + \\frac{${b}}{2} + \\frac{${c}}{2} = ${Q.of(a + b + c, 2).toLatex()}$，乘以体积 $${a * b * c}$ 得 $${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "a-repeated-integral-with-nested-variable-limits",
      title: t("A repeated integral with nested limits", "积分限嵌套的累次积分"),
      explanation: t(
        "In a repeated triple integral the limits may depend on the outer variables. Work from the inside out: integrate in $z$ first, then $y$, then $x$. For\n\n$$\\int_0^a \\int_0^x \\int_0^y c\\,dz\\,dy\\,dx = c\\int_0^a \\int_0^x y\\,dy\\,dx = c\\int_0^a \\frac{x^2}{2}\\,dx = \\frac{ca^3}{6},$$\n\neach step leaves a function of the remaining variables only. With $c = 12$ and $a = 1$ the integral is $2$.\n\n> **Watch out.** The inner limit $y$ and the middle limit $x$ are variables, not the outer number $a$. Replacing them by $a$ integrates over a larger solid.",
        "在累次三重积分中，积分限可以依赖外层变量。由内向外计算：先对 $z$，再对 $y$，最后对 $x$。对\n\n$$\\int_0^a \\int_0^x \\int_0^y c\\,dz\\,dy\\,dx = c\\int_0^a \\int_0^x y\\,dy\\,dx = c\\int_0^a \\frac{x^2}{2}\\,dx = \\frac{ca^3}{6},$$\n\n每一步都只剩下其余变量的函数。当 $c = 12$，$a = 1$ 时积分为 $2$。\n\n> **注意。** 内层上限 $y$ 和中层上限 $x$ 是变量，不是外层的数 $a$。把它们换成 $a$ 就是在更大的立体上积分。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 6);
        const c = rng.int(1, 6);
        const ans = Q.of(c * a ** 3, 6);
        const cc = coef(c);
        return numberProblem({
          prompt: t(
            `Evaluate $\\int_0^{${a}} \\int_0^x \\int_0^y ${c}\\,dz\\,dy\\,dx$.`,
            `计算 $\\int_0^{${a}} \\int_0^x \\int_0^y ${c}\\,dz\\,dy\\,dx$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(c * a ** 3),
              `That integrates over the whole cube $[0, ${a}]^3$; the limits $y$ and $x$ cut it down.`,
              `那是在整个立方体 $[0, ${a}]^3$ 上积分；积分限 $y$ 和 $x$ 把它截小了。`,
            ),
            why(
              Q.of(c * a ** 3, 2),
              `That lets $z$ run up to $${a}$; the inner limit is $y$.`,
              `那是让 $z$ 一直到 $${a}$；内层上限是 $y$。`,
            ),
            why(
              Q.of(c * a ** 2, 2),
              "The outer integral is missing; $\\frac{x^2}{2}$ still has to be integrated over $x$.",
              "漏了外层积分；$\\frac{x^2}{2}$ 还要对 $x$ 积分。",
            ),
          ]),
          solution: walked(
            [
              [["Integrate in z", "对 z 积分"], t(`$\\int_0^y ${c}\\,dz = ${cc}y$.`, `$\\int_0^y ${c}\\,dz = ${cc}y$。`)],
              [
                ["Integrate in y", "对 y 积分"],
                t(`$\\int_0^x ${cc}y\\,dy = \\frac{${cc}x^2}{2}$.`, `$\\int_0^x ${cc}y\\,dy = \\frac{${cc}x^2}{2}$。`),
              ],
              [
                ["Integrate in x", "对 x 积分"],
                t(
                  `$\\int_0^{${a}} \\frac{${cc}x^2}{2}\\,dx = \\frac{${c} \\cdot ${a ** 3}}{6} = ${ans.toLatex()}$.`,
                  `$\\int_0^{${a}} \\frac{${cc}x^2}{2}\\,dx = \\frac{${c} \\cdot ${a ** 3}}{6} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The solid $0 \\le z \\le y \\le x \\le ${a}$ is one of the $6$ equal pieces of the cube $[0, ${a}]^3$ cut out by ordering the coordinates, so the integral is $\\frac{${c} \\cdot ${a ** 3}}{6} = ${ans.toLatex()}$.`,
              `立体 $0 \\le z \\le y \\le x \\le ${a}$ 是按坐标大小顺序把立方体 $[0, ${a}]^3$ 分成的 $6$ 个相等部分之一，所以积分为 $\\frac{${c} \\cdot ${a ** 3}}{6} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** tripleIntegralsOverRectangularDomains computes triple integrals over rectangular boxes. */
export const tripleIntegralsOverRectangularDomains: TopicDef = {
  id: "triple-integrals-over-rectangular-domains",
  title: t("Triple Integrals Over Rectangular Domains", "长方体区域上的三重积分"),
  summary: t(
    "Over a rectangular box [a, b] × [c, d] × [p, q], Fubini's theorem allows integrating in any of the six possible variable permutations.",
    "在长方体区域 [a, b] × [c, d] × [p, q] 上，富比尼定理允许按六种变量排列顺序中的任意一种进行积分。",
  ),
  intro: t(
    "Integrate $x + 2z$ over the box $B = [0, 2] \\times [0, 1] \\times [0, 3]$. By linearity, $\\iiint_B x\\,dV = \\frac{4}{2} \\cdot 1 \\cdot 3 = 6$ and $\\iiint_B 2z\\,dV = 2 \\cdot 2 \\cdot 1 \\cdot \\frac{9}{2} = 18$, so the integral is $24$.\n\nCheck: on a box the average of $x$ is $1$ and the average of $z$ is $\\frac{3}{2}$, so the average of $x + 2z$ is $4$, and $4$ times the volume $6$ is $24$.\n\nIn this lesson we integrate over boxes, where Fubini's theorem lets us choose any order and products split into single integrals.",
    "在长方体 $B = [0, 2] \\times [0, 1] \\times [0, 3]$ 上积分 $x + 2z$。由线性性，$\\iiint_B x\\,dV = \\frac{4}{2} \\cdot 1 \\cdot 3 = 6$，$\\iiint_B 2z\\,dV = 2 \\cdot 2 \\cdot 1 \\cdot \\frac{9}{2} = 18$，所以积分为 $24$。\n\n检验：在长方体上 $x$ 的平均值为 $1$，$z$ 的平均值为 $\\frac{3}{2}$，所以 $x + 2z$ 的平均值为 $4$，乘以体积 $6$ 得 $24$。\n\n本课我们在长方体上积分：富比尼定理允许任选次序，乘积可以拆成单重积分。",
  ),
  prerequisites: ["repeated-integrals-in-three-dimensions"],
  encompasses: [{ topic: "repeated-integrals-in-three-dimensions", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "product-property-of-separable-triple-integrals",
      title: t("Product property of separable triple integrals", "可分离三重积分的乘积性质"),
      explanation: t(
        "For a product of single-variable functions $f(x)g(y)h(z)$ over a box $[0, a] \\times [0, b] \\times [0, c]$, the triple integral factors into single integrals:\n\n$$\\iiint_B xyz\\,dV = \\left(\\int_0^a x\\,dx\\right)\\left(\\int_0^b y\\,dy\\right)\\left(\\int_0^c z\\,dz\\right) = \\frac{(abc)^2}{8}.$$\n\nOver $[0, 2] \\times [0, 3] \\times [0, 5]$ this is $\\frac{30^2}{8} = \\frac{225}{2}$.\n\n> **Watch out.** The three single integrals are multiplied, not added, and each one is $\\frac{a^2}{2}$, so the result is divided by $8$.",
        "在长方体 $[0, a] \\times [0, b] \\times [0, c]$ 上，单变量乘积函数 $f(x)g(y)h(z)$ 的三重积分可因式分解为三个单积分的乘积：\n\n$$\\iiint_B xyz\\,dV = \\left(\\int_0^a x\\,dx\\right)\\left(\\int_0^b y\\,dy\\right)\\left(\\int_0^c z\\,dz\\right) = \\frac{(abc)^2}{8}$$\n\n在 $[0, 2] \\times [0, 3] \\times [0, 5]$ 上，结果为 $\\frac{30^2}{8} = \\frac{225}{2}$。\n\n> **注意。** 三个单积分要相乘而不是相加，并且每一个都是 $\\frac{a^2}{2}$ 的形式，所以结果要除以 $8$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 4);
        const b = rng.int(1, 4);
        const c = rng.int(1, 4);
        const prod = a * b * c;
        const ans = Q.of(prod * prod, 8);
        return numberProblem({
          prompt: t(
            `Evaluate $\\iiint_B xyz\\,dV$ over the rectangular box $B = [0, ${a}] \\times [0, ${b}] \\times [0, ${c}]$.`,
            `计算三重积分 $\\iiint_B xyz\\,dV$ 的值，其中长方体区域为 $B = [0, ${a}] \\times [0, ${b}] \\times [0, ${c}]$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(prod * prod),
              "Each factor $\\int_0^a x\\,dx$ is $\\frac{a^2}{2}$; the three halves are missing.",
              "每个因子 $\\int_0^a x\\,dx$ 都是 $\\frac{a^2}{2}$；漏了三个 $\\frac{1}{2}$。",
            ),
            why(
              Q.of(a * a + b * b + c * c, 2),
              "That adds the three single integrals; for a product integrand they multiply.",
              "那是把三个单积分相加；被积函数是乘积时它们要相乘。",
            ),
            why(
              prod,
              `That is the volume $${prod}$ of the box; the integrand is $xyz$, not $1$.`,
              `那是长方体的体积 $${prod}$；被积函数是 $xyz$，不是 $1$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Factor the integral", "分解积分"],
                t(
                  `The integrand is a product and the domain is a box, so $\\iiint_B xyz\\,dV = \\int_0^{${a}} x\\,dx \\cdot \\int_0^{${b}} y\\,dy \\cdot \\int_0^{${c}} z\\,dz$.`,
                  `被积函数是乘积且区域是长方体，所以 $\\iiint_B xyz\\,dV = \\int_0^{${a}} x\\,dx \\cdot \\int_0^{${b}} y\\,dy \\cdot \\int_0^{${c}} z\\,dz$。`,
                ),
              ],
              [
                ["Multiply the factors", "因子相乘"],
                t(
                  `$\\frac{${a * a}}{2} \\cdot \\frac{${b * b}}{2} \\cdot \\frac{${c * c}}{2} = \\frac{${prod * prod}}{8} = ${ans.toLatex()}$.`,
                  `$\\frac{${a * a}}{2} \\cdot \\frac{${b * b}}{2} \\cdot \\frac{${c * c}}{2} = \\frac{${prod * prod}}{8} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The average of $xyz$ over the box is $\\frac{${a}}{2} \\cdot \\frac{${b}}{2} \\cdot \\frac{${c}}{2} = ${Q.of(prod, 8).toLatex()}$, and times the volume $${prod}$ that is $${ans.toLatex()}$.`,
              `$xyz$ 在长方体上的平均值为 $\\frac{${a}}{2} \\cdot \\frac{${b}}{2} \\cdot \\frac{${c}}{2} = ${Q.of(prod, 8).toLatex()}$，乘以体积 $${prod}$ 得 $${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "a-triple-integral-of-a-single-variable-over-a-box",
      figure: multivariableDrawings4["triple-integrals-over-rectangular-domains#a-triple-integral-of-a-single-variable-over-a-box"],
      title: t("Integrating $cx^2$ over a box", "在长方体上积分 $cx^2$"),
      explanation: t(
        "If the integrand depends on only one variable, integrating the other two over a box simply multiplies by the lengths of their intervals:\n\n$$\\iiint_{[0, a] \\times [0, b] \\times [0, d]} c\\,x^2\\,dV = c\\cdot\\frac{a^3}{3}\\cdot b \\cdot d.$$\n\nThe factor $bd$ is the area of the cross-section perpendicular to the $x$-axis. For $2x^2$ over $[0, 6] \\times [0, 1] \\times [0, 1]$ this is $2 \\cdot 72 = 144$.\n\n> **Watch out.** The integrals in $y$ and $z$ are not $1$; they are the lengths $b$ and $d$. And $x^2$ integrates to $\\frac{a^3}{3}$, not $a^2$.",
        "若被积函数只依赖一个变量，在长方体上对另外两个变量积分就相当于乘以它们区间的长度：\n\n$$\\iiint_{[0, a] \\times [0, b] \\times [0, d]} c\\,x^2\\,dV = c\\cdot\\frac{a^3}{3}\\cdot b \\cdot d$$\n\n因子 $bd$ 是垂直于 $x$ 轴的截面面积。对 $[0, 6] \\times [0, 1] \\times [0, 1]$ 上的 $2x^2$，结果为 $2 \\cdot 72 = 144$。\n\n> **注意。** 对 $y$ 和 $z$ 的积分不是 $1$，而是长度 $b$ 和 $d$。$x^2$ 积分得 $\\frac{a^3}{3}$，不是 $a^2$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 4);
        const b = rng.int(1, 4);
        const d = rng.int(1, 4);
        const c = rng.int(1, 3);
        const ans = Q.of(c * a ** 3 * b * d, 3);
        const lead = c === 1 ? "" : `${c} \\cdot `;
        return numberProblem({
          prompt: t(
            `Evaluate $\\iiint_B ${coef(c)}x^2\\,dV$ over the box $B = [0, ${a}] \\times [0, ${b}] \\times [0, ${d}]$.`,
            `计算 $\\iiint_B ${coef(c)}x^2\\,dV$，其中长方体 $B = [0, ${a}] \\times [0, ${b}] \\times [0, ${d}]$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(c * a ** 3, 3),
              `The integrals in $y$ and $z$ multiply by the lengths $${b}$ and $${d}$; they are missing.`,
              `对 $y$、$z$ 的积分要乘以长度 $${b}$ 和 $${d}$；漏了。`,
            ),
            why(
              Q.of(c * a ** 2 * b * d),
              `That is the largest value $${c * a * a}$ of the integrand times the volume; integrating $x^2$ gives $\\frac{${a}^3}{3}$.`,
              `那是被积函数的最大值 $${c * a * a}$ 乘以体积；对 $x^2$ 积分得 $\\frac{${a}^3}{3}$。`,
            ),
            why(
              Q.of(c * a ** 3 * b * d),
              "The antiderivative of $x^2$ is $\\frac{x^3}{3}$; the division by $3$ is missing.",
              "$x^2$ 的原函数是 $\\frac{x^3}{3}$；漏了除以 $3$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Integrate the constant directions", "对常数方向积分"],
                t(
                  `$y$ and $z$ do not appear, so they contribute the lengths: $\\iiint_B ${coef(c)}x^2\\,dV = ${lead}${b} \\cdot ${d}\\int_0^{${a}} x^2\\,dx$.`,
                  `被积函数不含 $y$、$z$，它们贡献长度：$\\iiint_B ${coef(c)}x^2\\,dV = ${lead}${b} \\cdot ${d}\\int_0^{${a}} x^2\\,dx$。`,
                ),
              ],
              [
                ["Integrate in x", "对 x 积分"],
                t(
                  `$${lead}${b * d} \\cdot \\frac{${a ** 3}}{3} = ${ans.toLatex()}$.`,
                  `$${lead}${b * d} \\cdot \\frac{${a ** 3}}{3} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The integrand lies between $0$ and $${c * a * a}$ on a box of volume $${a * b * d}$, so the integral lies between $0$ and $${c * a * a * a * b * d}$; $${ans.toLatex()}$ is a third of the upper bound, as for $\\int_0^a x^2\\,dx$ against $a \\cdot a^2$.`,
              `被积函数在体积为 $${a * b * d}$ 的长方体上介于 $0$ 与 $${c * a * a}$ 之间，所以积分介于 $0$ 与 $${c * a * a * a * b * d}$ 之间；$${ans.toLatex()}$ 恰为上界的三分之一，正如 $\\int_0^a x^2\\,dx$ 与 $a \\cdot a^2$ 之比。`,
            ),
          ),
        });
      },
    },
  ],
};

/** typeIIiAndIiiRegionsInThreeDimensionalSpace classifies 3D regions into Types I, II, and III. */
export const typeIIiAndIiiRegionsInThreeDimensionalSpace: TopicDef = {
  id: "type-i-ii-and-iii-regions-in-three-dimensional-space",
  title: t("Type I, II, and III Regions in Three-Dimensional Space", "三维空间中的 Type I、II 与 III 型区域"),
  summary: t(
    "Type I regions project to the xy-plane (z bounds), Type II project to the xz-plane (y bounds), and Type III project to the yz-plane (x bounds).",
    "Type I 型区域向 xy 平面投影（z 处于两曲面之间），Type II 向 xz 平面投影（y 处于两曲面之间），Type III 向 yz 平面投影（x 处于两曲面之间）。",
  ),
  intro: t(
    "The wedge $E = \\{0 \\le x \\le 2,\\ 0 \\le y \\le 3,\\ 0 \\le z \\le 2 - x\\}$ is Type I: $z$ lies between the surfaces $z = 0$ and $z = 2 - x$ over the rectangle $[0, 2] \\times [0, 3]$ in the $xy$-plane. Its volume is $\\iint (2 - x)\\,dA = 3 \\cdot 2 = 6$.\n\nCheck: $E$ is also Type II, with $0 \\le y \\le 3$ over the triangle $x \\ge 0$, $z \\ge 0$, $x + z \\le 2$ in the $xz$-plane. That triangle has area $2$, and $3 \\cdot 2 = 6$.\n\nIn this lesson we classify solids by which variable lies between two surfaces, and find the region they project onto.",
    "楔形体 $E = \\{0 \\le x \\le 2,\\ 0 \\le y \\le 3,\\ 0 \\le z \\le 2 - x\\}$ 是 Type I 型：在 $xy$ 平面的矩形 $[0, 2] \\times [0, 3]$ 上，$z$ 夹在曲面 $z = 0$ 与 $z = 2 - x$ 之间。它的体积为 $\\iint (2 - x)\\,dA = 3 \\cdot 2 = 6$。\n\n检验：$E$ 也是 Type II 型，在 $xz$ 平面的三角形 $x \\ge 0$，$z \\ge 0$，$x + z \\le 2$ 上 $0 \\le y \\le 3$。该三角形面积为 $2$，而 $3 \\cdot 2 = 6$。\n\n本课我们按哪个变量夹在两个曲面之间来给立体分类，并求出它们的投影区域。",
  ),
  prerequisites: ["triple-integrals-over-rectangular-domains"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "classifying-3d-regions-by-bounding-surfaces",
      title: t("Classifying 3D regions by bounding surfaces", "按曲面边界分类三维区域"),
      explanation: t(
        "A 3D region is:\n- **Type I** if bounded between two surfaces $z = u_1(x, y)$ and $z = u_2(x, y)$.\n- **Type II** if bounded between two surfaces $y = v_1(x, z)$ and $y = v_2(x, z)$.\n- **Type III** if bounded between two surfaces $x = w_1(y, z)$ and $x = w_2(y, z)$.\n\nFor example $\\{(y, z) \\in D,\\ y^2 \\le x \\le 4\\}$ is Type III: $x$ lies between two functions of $y$ and $z$.\n\n> **Watch out.** The type is named by the variable that lies between two surfaces, and the other two variables range over the projection $D$. A function of $x$ and $y$ appearing somewhere does not make a region Type I unless $z$ is the variable it bounds.",
        "三维区域的分类：\n- **Type I**：夹在两个曲面 $z = u_1(x, y)$ 与 $z = u_2(x, y)$ 之间。\n- **Type II**：夹在两个曲面 $y = v_1(x, z)$ 与 $y = v_2(x, z)$ 之间。\n- **Type III**：夹在两个曲面 $x = w_1(y, z)$ 与 $x = w_2(y, z)$ 之间。\n\n例如 $\\{(y, z) \\in D,\\ y^2 \\le x \\le 4\\}$ 是 Type III 型：$x$ 夹在 $y$、$z$ 的两个函数之间。\n\n> **注意。** 类型由夹在两个曲面之间的那个变量决定，另外两个变量取遍投影 $D$。某处出现 $x$、$y$ 的函数，并不说明区域是 Type I 型，除非它界定的是 $z$。",
      ),
      generate(rng: Rng): Problem {
        const choice = rng.int(1, 3) - 1;
        const a = rng.int(1, 4);
        const b = rng.int(1, 4);
        const [bound, u, v] = (
          [
            ["z", "x", "y"],
            ["y", "x", "z"],
            ["x", "y", "z"],
          ] as const
        )[choice]!;
        const names = [
          t("Type I (bounded in z)", "Type I 型（z 处于两曲面之间）"),
          t("Type II (bounded in y)", "Type II 型（y 处于两曲面之间）"),
          t("Type III (bounded in x)", "Type III 型（x 处于两曲面之间）"),
        ];
        const varOf = ["z", "y", "x"] as const;
        const set = `\\{(x, y, z) : (${u}, ${v}) \\in D, 0 \\le ${bound} \\le ${poly([a, `${u}^2`])} + ${poly([b, `${v}^2`])}\\}`;
        return explainedChoice(rng, {
          prompt: t(
            `Classify the 3D solid region $E = ${set}$ as Type I, Type II, or Type III.`,
            `将三维立体区域 $E = ${set}$ 分类为 Type I、Type II 或 Type III 型。`,
          ),
          correct: names[choice]!,
          wrong: [0, 1, 2]
            .filter((i) => i !== choice)
            .map((i) => ({
              option: names[i]!,
              why: t(
                `That type needs $${varOf[i]}$ between two surfaces; here $${varOf[i]}$ ranges over $D$ and $${bound}$ is the bounded variable.`,
                `那种类型要求 $${varOf[i]}$ 夹在两个曲面之间；这里 $${varOf[i]}$ 取遍 $D$，被夹住的是 $${bound}$。`,
              ),
            })),
          solution: walked(
            [
              [
                ["Find the bounded variable", "找出被夹住的变量"],
                t(
                  `$${bound}$ lies between $0$ and $${poly([a, `${u}^2`])} + ${poly([b, `${v}^2`])}$, two continuous functions of $(${u}, ${v})$.`,
                  `$${bound}$ 介于 $0$ 与 $${poly([a, `${u}^2`])} + ${poly([b, `${v}^2`])}$ 之间，它们是 $(${u}, ${v})$ 的两个连续函数。`,
                ),
              ],
              [
                ["Name the type", "确定类型"],
                t(
                  `A region bounded in $${bound}$ over a region $D$ of the $${u}${v}$-plane is ${names[choice]!.en}.`,
                  `在 $${u}${v}$ 平面区域 $D$ 上于 $${bound}$ 方向有界的区域是${names[choice]!["zh-CN"]}。`,
                ),
              ],
            ],
            t(
              `The integral over $E$ is then $\\iint_D \\int_0^{${poly([a, `${u}^2`])} + ${poly([b, `${v}^2`])}} f\\,d${bound}\\,dA$, with $d${bound}$ innermost, as the type requires.`,
              `于是 $E$ 上的积分为 $\\iint_D \\int_0^{${poly([a, `${u}^2`])} + ${poly([b, `${v}^2`])}} f\\,d${bound}\\,dA$，$d${bound}$ 在最内层，正符合该类型。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-projection-of-a-tetrahedron-for-each-region-type",
      figure:
        multivariableDrawings4["type-i-ii-and-iii-regions-in-three-dimensional-space#the-projection-of-a-tetrahedron-for-each-region-type"],
      title: t("The projection of a tetrahedron for each region type", "按区域类型取四面体的投影"),
      explanation: t(
        "The tetrahedron cut from the first octant by $\\frac{x}{a} + \\frac{y}{b} + \\frac{z}{c} = 1$ is of all three types. Viewing it as Type I means projecting onto the $xy$-plane, Type II onto the $xz$-plane, and Type III onto the $yz$-plane. Each projection is a right triangle whose legs are the two intercepts in that plane, so its area is half their product, for example $\\frac{ab}{2}$ in the $xy$-plane. For $\\frac{x}{8} + \\frac{y}{2} + \\frac{z}{7} = 1$ viewed as Type II, the projection onto the $xz$-plane has area $\\frac{8 \\cdot 7}{2} = 28$.\n\n> **Watch out.** Type II projects onto the $xz$-plane, so its legs are the $x$- and $z$-intercepts. The projection is a triangle, so take half the product of the legs.",
        "平面 $\\frac{x}{a} + \\frac{y}{b} + \\frac{z}{c} = 1$ 在第一卦限截出的四面体同时属于三种类型。视为 Type I 型时投影到 $xy$ 平面，Type II 型投影到 $xz$ 平面，Type III 型投影到 $yz$ 平面。每个投影都是直角三角形，两条直角边是该平面内的两个截距，所以面积为两者乘积的一半，例如在 $xy$ 平面上为 $\\frac{ab}{2}$。把 $\\frac{x}{8} + \\frac{y}{2} + \\frac{z}{7} = 1$ 视为 Type II 型，它在 $xz$ 平面上的投影面积为 $\\frac{8 \\cdot 7}{2} = 28$。\n\n> **注意。** Type II 型投影到 $xz$ 平面，所以直角边是 $x$ 截距和 $z$ 截距。投影是三角形，要取两直角边乘积的一半。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 6);
        const b = rng.int(1, 6);
        const c = rng.int(1, 6);
        const kind = rng.int(1, 3);
        const planes = [
          ["xy", a, b, "I"],
          ["xz", a, c, "II"],
          ["yz", b, c, "III"],
        ] as const;
        const [plane, u, v, roman] = planes[kind - 1]!;
        const ans = Q.of(u * v, 2);
        return numberProblem({
          prompt: t(
            `$E$ is the tetrahedron bounded by the coordinate planes and $\\frac{x}{${a}} + \\frac{y}{${b}} + \\frac{z}{${c}} = 1$. Viewed as a Type ${roman} region, $E$ lies over a region $D$ in a coordinate plane. Find the area of $D$.`,
            `$E$ 是由坐标平面与 $\\frac{x}{${a}} + \\frac{y}{${b}} + \\frac{z}{${c}} = 1$ 围成的四面体。视为 Type ${roman} 型区域时，$E$ 位于某个坐标平面内区域 $D$ 的上方。求 $D$ 的面积。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            ...planes
              .filter((p) => p[3] !== roman)
              .map(([p, pu, pv, r]) =>
                why(
                  Q.of(pu * pv, 2),
                  `That is the projection onto the $${p}$-plane, which belongs to Type ${r}.`,
                  `那是投影到 $${p}$ 平面，对应 Type ${r} 型。`,
                ),
              ),
            why(
              Q.of(a * b * c, 6),
              "That is the volume of $E$; the question asks for the area of its projection.",
              "那是 $E$ 的体积；题目问的是投影的面积。",
            ),
            why(
              Q.of(u * v),
              `$D$ is a right triangle with legs $${u}$ and $${v}$, so its area is half their product.`,
              `$D$ 是直角边为 $${u}$ 和 $${v}$ 的直角三角形，面积是乘积的一半。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Choose the plane", "选择平面"],
                t(
                  `Type ${roman} projects onto the $${plane}$-plane, where the intercepts are $${u}$ and $${v}$.`,
                  `Type ${roman} 型投影到 $${plane}$ 平面，那里的截距是 $${u}$ 和 $${v}$。`,
                ),
              ],
              [
                ["Find the area", "求面积"],
                t(
                  `$D$ is a right triangle with legs $${u}$ and $${v}$, so its area is $\\frac{${u} \\cdot ${v}}{2} = ${ans.toLatex()}$.`,
                  `$D$ 是直角边为 $${u}$ 和 $${v}$ 的直角三角形，面积为 $\\frac{${u} \\cdot ${v}}{2} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `A tetrahedron has volume $\\frac{1}{3}$ base times height. With base $D$ and the third intercept $${(a * b * c) / (u * v)}$ as height, $\\frac{1}{3} \\cdot ${ans.toLatex()} \\cdot ${(a * b * c) / (u * v)} = ${Q.of(a * b * c, 6).toLatex()} = \\frac{${a} \\cdot ${b} \\cdot ${c}}{6}$, the volume of $E$.`,
              `四面体的体积是 $\\frac{1}{3}$ 底面积乘高。以 $D$ 为底、第三个截距 $${(a * b * c) / (u * v)}$ 为高，$\\frac{1}{3} \\cdot ${ans.toLatex()} \\cdot ${(a * b * c) / (u * v)} = ${Q.of(a * b * c, 6).toLatex()} = \\frac{${a} \\cdot ${b} \\cdot ${c}}{6}$，正是 $E$ 的体积。`,
            ),
          ),
        });
      },
    },
  ],
};

/** tripleIntegralsOverTypeIRegions computes integrals over Type I solids. */
export const tripleIntegralsOverTypeIRegions: TopicDef = {
  id: "triple-integrals-over-type-i-regions",
  title: t("Triple Integrals Over Type I Regions", "Type I 型三维区域上的三重积分"),
  summary: t(
    "For a Type I region, integrate first with respect to z from u1(x, y) to u2(x, y), then over the projection in the xy-plane.",
    "对于 Type I 型区域，先对 z 从 u1(x, y) 积到 u2(x, y)，再在 xy 平面的投影区域上进行二重积分。",
  ),
  intro: t(
    "Find the volume of the solid $E$ under $z = x^2$ above the rectangle $[0, 1] \\times [0, 2]$. The inner integral $\\int_0^{x^2} dz = x^2$ is the height of the solid, and $\\int_0^1 \\int_0^2 x^2\\,dy\\,dx = 2 \\cdot \\frac{1}{3} = \\frac{2}{3}$.\n\nCheck: slice at a fixed $x$. The cross-section is a rectangle of width $2$ and height $x^2$, so its area is $2x^2$, and $\\int_0^1 2x^2\\,dx = \\frac{2}{3}$.\n\nIn this lesson we integrate over Type I solids, with $z$ innermost between a bottom and a top surface.",
    "求曲面 $z = x^2$ 下方、矩形 $[0, 1] \\times [0, 2]$ 上方的立体 $E$ 的体积。内层积分 $\\int_0^{x^2} dz = x^2$ 是立体的高度，而 $\\int_0^1 \\int_0^2 x^2\\,dy\\,dx = 2 \\cdot \\frac{1}{3} = \\frac{2}{3}$。\n\n检验：固定 $x$ 作截面。截面是宽 $2$、高 $x^2$ 的矩形，面积为 $2x^2$，而 $\\int_0^1 2x^2\\,dx = \\frac{2}{3}$。\n\n本课我们在 Type I 型立体上积分，$z$ 在最内层，介于底面和顶面之间。",
  ),
  prerequisites: ["type-i-ii-and-iii-regions-in-three-dimensional-space"],
  encompasses: [{ topic: "type-i-ii-and-iii-regions-in-three-dimensional-space", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "integrating-under-a-surface-over-a-rectangle",
      figure: multivariableDrawings4["triple-integrals-over-type-i-regions#integrating-under-a-surface-over-a-rectangle"],
      title: t("Integrating under a surface over a rectangle", "在矩形投影上计算曲顶柱体的体积积分"),
      explanation: t(
        "Integrating the constant one over a solid gives its volume, and the inner integral in the vertical direction gives the height of the solid above each point. For $E$ bounded by $0 \\le x \\le a$, $0 \\le y \\le b$, and $0 \\le z \\le cxy$:\n\n$$\\iiint_E 1\\,dV = \\int_0^a \\int_0^b \\int_0^{cxy} 1\\,dz\\,dy\\,dx = c\\frac{a^2 b^2}{4}.$$\n\nUnder $z = 6xy$ over $[0, 1] \\times [0, 2]$ the volume is $6 \\cdot \\frac{1 \\cdot 4}{4} = 6$.\n\n> **Watch out.** The height $cxy$ varies, so it is integrated over the rectangle, not multiplied by its area; using the largest height $cab$ gives a box that contains the solid.",
        "在立体上积分常数 1 得到它的体积，竖直方向的内层积分给出立体在每一点上方的高度。对于由 $0 \\le x \\le a$、$0 \\le y \\le b$ 与 $0 \\le z \\le cxy$ 所围成的区域 $E$：\n\n$$\\iiint_E 1\\,dV = \\int_0^a \\int_0^b \\int_0^{cxy} 1\\,dz\\,dy\\,dx = c\\frac{a^2 b^2}{4}$$\n\n在 $[0, 1] \\times [0, 2]$ 上方、$z = 6xy$ 下方，体积为 $6 \\cdot \\frac{1 \\cdot 4}{4} = 6$。\n\n> **注意。** 高度 $cxy$ 是变化的，所以要在矩形上积分它，而不是乘以面积；用最大高度 $cab$ 得到的是包住立体的长方体。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const c = rng.int(1, 4);
        const num = c * a * a * b * b;
        const ans = Q.of(num, 4);
        return numberProblem({
          prompt: t(
            `Find the volume $\\iiint_E 1\\,dV$ of the solid $E$ lying above the rectangle $D = [0, ${a}] \\times [0, ${b}]$ and below the surface $z = ${coef(c)}xy$.`,
            `计算立体 $E$ 的体积 $\\iiint_E 1\\,dV$，其中 $E$ 位于矩形 $D = [0, ${a}] \\times [0, ${b}]$ 上方且在曲面 $z = ${coef(c)}xy$ 下方。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(num),
              `That is the box of height $${c * a * b}$, the largest height, over the area $${a * b}$; the height varies.`,
              `那是以最大高度 $${c * a * b}$ 乘以面积 $${a * b}$ 的长方体；高度是变化的。`,
            ),
            why(
              Q.of(num, 2),
              "Only one of the two factors $\\frac{1}{2}$, from $\\int x\\,dx$ and $\\int y\\,dy$, is kept.",
              "$\\int x\\,dx$ 与 $\\int y\\,dy$ 带来的两个 $\\frac{1}{2}$ 只保留了一个。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Integrate in z", "对 z 积分"],
                t(
                  `$\\int_0^{${coef(c)}xy} 1\\,dz = ${coef(c)}xy$, the height of $E$.`,
                  `$\\int_0^{${coef(c)}xy} 1\\,dz = ${coef(c)}xy$，即 $E$ 的高度。`,
                ),
              ],
              [
                ["Integrate over D", "在 D 上积分"],
                t(
                  `$${c}\\int_0^{${a}} x\\,dx \\int_0^{${b}} y\\,dy = ${c} \\cdot \\frac{${a * a}}{2} \\cdot \\frac{${b * b}}{2} = ${ans.toLatex()}$.`,
                  `$${c}\\int_0^{${a}} x\\,dx \\int_0^{${b}} y\\,dy = ${c} \\cdot \\frac{${a * a}}{2} \\cdot \\frac{${b * b}}{2} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The average height of $${coef(c)}xy$ over $D$ is $${c} \\cdot \\frac{${a}}{2} \\cdot \\frac{${b}}{2}$, a quarter of the largest height $${c * a * b}$, so the volume is a quarter of the box: $\\frac{${num}}{4} = ${ans.toLatex()}$.`,
              `$${coef(c)}xy$ 在 $D$ 上的平均高度为 $${c} \\cdot \\frac{${a}}{2} \\cdot \\frac{${b}}{2}$，是最大高度 $${c * a * b}$ 的四分之一，所以体积是长方体的四分之一：$\\frac{${num}}{4} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "integrating-a-constant-under-a-slanted-plane",
      title: t("Integrating a constant under a slanted plane", "在斜平面下积分常数"),
      explanation: t(
        "For a Type I solid $E = \\{(x, y) \\in D,\\ 0 \\le z \\le u(x, y)\\}$, integrating $k$ in $z$ first gives $k\\,u(x, y)$, which is then integrated over $D$. Under the plane $z = x + y$ above $[0, a] \\times [0, b]$:\n\n$$\\iiint_E k\\,dV = k\\iint_D (x + y)\\,dA = k\\left(\\frac{a^2b}{2} + \\frac{ab^2}{2}\\right).$$\n\nFor $k = 1$ over $[0, 5] \\times [0, 1]$ this is $\\frac{25}{2} + \\frac{5}{2} = 15$.\n\n> **Watch out.** $\\iint_D x\\,dA$ is $\\frac{a^2}{2}$ times the length $b$ of the other side, not $\\frac{a^2}{2}$ alone.",
        "对 Type I 型立体 $E = \\{(x, y) \\in D,\\ 0 \\le z \\le u(x, y)\\}$，先对 $z$ 积分常数 $k$ 得 $k\\,u(x, y)$，再在 $D$ 上积分。在 $[0, a] \\times [0, b]$ 上方、平面 $z = x + y$ 下方：\n\n$$\\iiint_E k\\,dV = k\\iint_D (x + y)\\,dA = k\\left(\\frac{a^2b}{2} + \\frac{ab^2}{2}\\right)$$\n\n对 $k = 1$ 与 $[0, 5] \\times [0, 1]$，结果为 $\\frac{25}{2} + \\frac{5}{2} = 15$。\n\n> **注意。** $\\iint_D x\\,dA$ 是 $\\frac{a^2}{2}$ 乘以另一边的长度 $b$，而不只是 $\\frac{a^2}{2}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 4);
        const b = rng.int(1, 4);
        const k = rng.int(2, 5);
        const ans = Q.of(k * (a * a * b + a * b * b), 2);
        return numberProblem({
          prompt: t(
            `$E$ lies above $D = [0, ${a}] \\times [0, ${b}]$ and below $z = x + y$. Evaluate $\\iiint_E ${k}\\,dV$.`,
            `$E$ 位于 $D = [0, ${a}] \\times [0, ${b}]$ 上方、$z = x + y$ 下方。计算 $\\iiint_E ${k}\\,dV$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(k * (a * a * b + a * b * b)),
              "The factors $\\frac{1}{2}$ from $\\int x\\,dx$ and $\\int y\\,dy$ are missing.",
              "漏了 $\\int x\\,dx$ 与 $\\int y\\,dy$ 带来的因子 $\\frac{1}{2}$。",
            ),
            why(
              Q.of(k * (a * a + b * b), 2),
              "Each term also carries the length of the other side: $\\iint_D x\\,dA = \\frac{a^2}{2} \\cdot b$.",
              "每一项还要乘以另一边的长度：$\\iint_D x\\,dA = \\frac{a^2}{2} \\cdot b$。",
            ),
            why(
              Q.of(k * (a + b), 2),
              `That is $${k}$ times the average height; multiply by the area $${a * b}$ of $D$.`,
              `那是 $${k}$ 乘以平均高度；还要乘以 $D$ 的面积 $${a * b}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Integrate in z", "对 z 积分"],
                t(`$\\int_0^{x + y} ${k}\\,dz = ${k}(x + y)$.`, `$\\int_0^{x + y} ${k}\\,dz = ${k}(x + y)$。`),
              ],
              [
                ["Integrate over D", "在 D 上积分"],
                t(
                  `$${k}\\iint_D (x + y)\\,dA = ${k}\\left(\\frac{${a * a}}{2} \\cdot ${b} + ${a} \\cdot \\frac{${b * b}}{2}\\right) = ${ans.toLatex()}$.`,
                  `$${k}\\iint_D (x + y)\\,dA = ${k}\\left(\\frac{${a * a}}{2} \\cdot ${b} + ${a} \\cdot \\frac{${b * b}}{2}\\right) = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The plane $z = x + y$ is linear, so its average height over $D$ is its value at the center $\\left(\\frac{${a}}{2}, \\frac{${b}}{2}\\right)$, which is $${Q.of(a + b, 2).toLatex()}$; and $${k} \\cdot ${Q.of(a + b, 2).toLatex()} \\cdot ${a * b} = ${ans.toLatex()}$.`,
              `平面 $z = x + y$ 是线性的，所以它在 $D$ 上的平均高度就是在中心 $\\left(\\frac{${a}}{2}, \\frac{${b}}{2}\\right)$ 处的值 $${Q.of(a + b, 2).toLatex()}$；而 $${k} \\cdot ${Q.of(a + b, 2).toLatex()} \\cdot ${a * b} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** tripleIntegralsOverTypeIiRegions computes integrals over Type II solids. */
export const tripleIntegralsOverTypeIiRegions: TopicDef = {
  id: "triple-integrals-over-type-ii-regions",
  title: t("Triple Integrals Over Type II Regions", "Type II 型三维区域上的三重积分"),
  summary: t(
    "On a Type II region, integrate first with respect to y between bounding surfaces, then over the xz-projection.",
    "在 Type II 型区域上，先对 y 在两个曲面之间积分，再在 xz 投影平面上进行二重积分。",
  ),
  intro: t(
    "Find the volume of $E = \\{0 \\le x \\le 3,\\ 0 \\le z \\le 2,\\ 0 \\le y \\le 2 - z\\}$. Here $y$ lies between two surfaces, so integrate in $y$ first: the thickness is $2 - z$, and $\\int_0^3 \\int_0^2 (2 - z)\\,dz\\,dx = 3 \\cdot 2 = 6$.\n\nCheck: $E$ is a prism. Its cross-section in the $yz$-plane is the triangle $y, z \\ge 0$, $y + z \\le 2$ of area $2$, and it has length $3$ in $x$, so its volume is $6$.\n\nIn this lesson we integrate over Type II solids, with $y$ innermost and the outer integral over the projection in the $xz$-plane.",
    "求 $E = \\{0 \\le x \\le 3,\\ 0 \\le z \\le 2,\\ 0 \\le y \\le 2 - z\\}$ 的体积。这里 $y$ 夹在两个曲面之间，所以先对 $y$ 积分：厚度为 $2 - z$，而 $\\int_0^3 \\int_0^2 (2 - z)\\,dz\\,dx = 3 \\cdot 2 = 6$。\n\n检验：$E$ 是一个棱柱。它在 $yz$ 平面上的截面是三角形 $y, z \\ge 0$，$y + z \\le 2$，面积为 $2$，沿 $x$ 方向长 $3$，所以体积为 $6$。\n\n本课我们在 Type II 型立体上积分，$y$ 在最内层，外层在 $xz$ 平面的投影上积分。",
  ),
  prerequisites: ["type-i-ii-and-iii-regions-in-three-dimensional-space"],
  encompasses: [{ topic: "type-i-ii-and-iii-regions-in-three-dimensional-space", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "integrating-with-respect-to-y-first",
      title: t("Integrating with respect to y first", "先对 y 积分的三重积分计算"),
      explanation: t(
        "When the solid is bounded by surfaces given as functions for that variable, integrate in that direction first to get the thickness of the solid. For $E$ bounded by $0 \\le x \\le a$, $0 \\le z \\le b$, and $0 \\le y \\le cxz$:\n\n$$\\iiint_E 1\\,dV = \\int_0^a \\int_0^b \\int_0^{cxz} 1\\,dy\\,dz\\,dx = c\\frac{a^2 b^2}{4}.$$\n\nFor $0 \\le y \\le 8xz$ over $[0, 1] \\times [0, 1]$ in $x$ and $z$ the volume is $\\frac{8}{4} = 2$.\n\n> **Watch out.** The thickness $cxz$ varies over the $xz$-projection; integrate it there rather than multiplying the largest thickness by the area.",
        "当立体由以该变量表示的曲面围成时，先沿那个方向积分，得到立体的厚度。对于由 $0 \\le x \\le a$、$0 \\le z \\le b$ 与 $0 \\le y \\le cxz$ 所围成的区域 $E$：\n\n$$\\iiint_E 1\\,dV = \\int_0^a \\int_0^b \\int_0^{cxz} 1\\,dy\\,dz\\,dx = c\\frac{a^2 b^2}{4}$$\n\n对 $x$、$z$ 在 $[0, 1] \\times [0, 1]$ 上、$0 \\le y \\le 8xz$，体积为 $\\frac{8}{4} = 2$。\n\n> **注意。** 厚度 $cxz$ 在 $xz$ 投影上是变化的；要在那里积分它，而不是用最大厚度乘以面积。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const c = rng.int(1, 4);
        const num = c * a * a * b * b;
        const ans = Q.of(num, 4);
        return numberProblem({
          prompt: t(
            `Find the volume of the solid $E$ bounded by $0 \\le x \\le ${a}$, $0 \\le z \\le ${b}$, and $0 \\le y \\le ${coef(c)}xz$.`,
            `求由 $0 \\le x \\le ${a}$、$0 \\le z \\le ${b}$ 与 $0 \\le y \\le ${coef(c)}xz$ 所围成几何体 $E$ 的体积。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(num),
              `That uses the largest thickness $${c * a * b}$ everywhere; the thickness $${coef(c)}xz$ varies.`,
              `那是处处用最大厚度 $${c * a * b}$；厚度 $${coef(c)}xz$ 是变化的。`,
            ),
            why(
              Q.of(num, 2),
              "Only one of the two factors $\\frac{1}{2}$, from $\\int x\\,dx$ and $\\int z\\,dz$, is kept.",
              "$\\int x\\,dx$ 与 $\\int z\\,dz$ 带来的两个 $\\frac{1}{2}$ 只保留了一个。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Integrate in y", "对 y 积分"],
                t(
                  `$\\int_0^{${coef(c)}xz} 1\\,dy = ${coef(c)}xz$, the thickness of $E$.`,
                  `$\\int_0^{${coef(c)}xz} 1\\,dy = ${coef(c)}xz$，即 $E$ 的厚度。`,
                ),
              ],
              [
                ["Integrate over the projection", "在投影上积分"],
                t(
                  `$${c}\\int_0^{${a}} x\\,dx \\int_0^{${b}} z\\,dz = ${c} \\cdot \\frac{${a * a}}{2} \\cdot \\frac{${b * b}}{2} = ${ans.toLatex()}$.`,
                  `$${c}\\int_0^{${a}} x\\,dx \\int_0^{${b}} z\\,dz = ${c} \\cdot \\frac{${a * a}}{2} \\cdot \\frac{${b * b}}{2} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The average of $xz$ over $[0, ${a}] \\times [0, ${b}]$ is $\\frac{${a}}{2} \\cdot \\frac{${b}}{2}$, so the volume is $${c} \\cdot \\frac{${a * b}}{4} \\cdot ${a * b} = ${ans.toLatex()}$.`,
              `$xz$ 在 $[0, ${a}] \\times [0, ${b}]$ 上的平均值为 $\\frac{${a}}{2} \\cdot \\frac{${b}}{2}$，所以体积为 $${c} \\cdot \\frac{${a * b}}{4} \\cdot ${a * b} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "integrating-y-over-a-type-ii-solid",
      title: t("Integrating $cy$ over a Type II solid", "在 Type II 型立体上积分 $cy$"),
      explanation: t(
        "For a Type II solid the inner integral runs in $y$, between two surfaces that depend on $x$ and $z$, and the outer double integral runs over the projection $D$ in the $xz$-plane. For $0 \\le y \\le kx$ over $D = [0, a] \\times [0, b]$ in $x$ and $z$:\n\n$$\\iint_D \\int_0^{kx} c\\,y\\,dy\\,dA = \\iint_D \\frac{c\\,k^2x^2}{2}\\,dA = \\frac{c\\,k^2a^3b}{6}.$$\n\nFor $4y$ with $k = 4$ and $a = b = 1$ this is $\\frac{4 \\cdot 16}{6} = \\frac{32}{3}$.\n\n> **Watch out.** The inner integral is $\\frac{(kx)^2}{2}$, so $k$ appears squared, and the outer $x$ integral of $x^2$ divides by $3$.",
        "对 Type II 型立体，内层对 $y$ 积分，上下限是依赖 $x$ 和 $z$ 的曲面；外层在 $xz$ 平面的投影 $D$ 上作二重积分。对 $0 \\le y \\le kx$，$D$ 为 $x$、$z$ 的 $[0, a] \\times [0, b]$：\n\n$$\\iint_D \\int_0^{kx} c\\,y\\,dy\\,dA = \\iint_D \\frac{c\\,k^2x^2}{2}\\,dA = \\frac{c\\,k^2a^3b}{6}$$\n\n对 $4y$，$k = 4$，$a = b = 1$，结果为 $\\frac{4 \\cdot 16}{6} = \\frac{32}{3}$。\n\n> **注意。** 内层积分是 $\\frac{(kx)^2}{2}$，所以 $k$ 是平方的；外层对 $x^2$ 积分要除以 $3$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 3);
        const b = rng.int(1, 4);
        const k = rng.int(1, 3);
        const c = rng.int(1, 3);
        const ans = Q.of(c * k * k * a ** 3 * b, 6);
        const ck = coef(c * k * k);
        return numberProblem({
          prompt: t(
            `$E = \\{(x, y, z) : 0 \\le x \\le ${a},\\ 0 \\le z \\le ${b},\\ 0 \\le y \\le ${coef(k)}x\\}$. Evaluate $\\iiint_E ${coef(c)}y\\,dV$.`,
            `$E = \\{(x, y, z) : 0 \\le x \\le ${a},\\ 0 \\le z \\le ${b},\\ 0 \\le y \\le ${coef(k)}x\\}$。计算 $\\iiint_E ${coef(c)}y\\,dV$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(c * k * a * a * b, 2),
              `That is $${c}$ times the volume of $E$; the integrand $${coef(c)}y$ is not constant.`,
              `那是 $${c}$ 乘以 $E$ 的体积；被积函数 $${coef(c)}y$ 不是常数。`,
            ),
            why(
              Q.of(c * k * k * a ** 3 * b, 2),
              "The outer antiderivative of $x^2$ is $\\frac{x^3}{3}$; the division by $3$ is missing.",
              "外层 $x^2$ 的原函数是 $\\frac{x^3}{3}$；漏了除以 $3$。",
            ),
            why(
              Q.of(c * k * k * a ** 3 * b, 3),
              "The inner antiderivative of $y$ is $\\frac{y^2}{2}$; the factor $\\frac{1}{2}$ is missing.",
              "内层 $y$ 的原函数是 $\\frac{y^2}{2}$；漏了因子 $\\frac{1}{2}$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Integrate in y", "对 y 积分"],
                t(
                  `$\\int_0^{${coef(k)}x} ${coef(c)}y\\,dy = \\frac{${ck}x^2}{2}$.`,
                  `$\\int_0^{${coef(k)}x} ${coef(c)}y\\,dy = \\frac{${ck}x^2}{2}$。`,
                ),
              ],
              [
                ["Integrate over the projection", "在投影上积分"],
                t(
                  `$\\int_0^{${b}} \\int_0^{${a}} \\frac{${ck}x^2}{2}\\,dx\\,dz = \\frac{${c * k * k} \\cdot ${a ** 3}}{6} \\cdot ${b} = ${ans.toLatex()}$.`,
                  `$\\int_0^{${b}} \\int_0^{${a}} \\frac{${ck}x^2}{2}\\,dx\\,dz = \\frac{${c * k * k} \\cdot ${a ** 3}}{6} \\cdot ${b} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `Along each segment $0 \\le y \\le ${coef(k)}x$ the average of $${coef(c)}y$ is $\\frac{${coef(c * k)}x}{2}$, and the segment has length $${coef(k)}x$, which again gives $\\frac{${ck}x^2}{2}$ before the outer integral.`,
              `在每条线段 $0 \\le y \\le ${coef(k)}x$ 上 $${coef(c)}y$ 的平均值为 $\\frac{${coef(c * k)}x}{2}$，线段长为 $${coef(k)}x$，在外层积分之前同样得到 $\\frac{${ck}x^2}{2}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** tripleIntegralsOverTypeIiiRegions computes integrals over Type III solids. */
export const tripleIntegralsOverTypeIiiRegions: TopicDef = {
  id: "triple-integrals-over-type-iii-regions",
  title: t("Triple Integrals Over Type III Regions", "Type III 型三维区域上的三重积分"),
  summary: t(
    "On a Type III region, integrate first with respect to x between bounding surfaces, then over the yz-projection.",
    "在 Type III 型区域上，先对 x 在两个曲面之间积分，再在 yz 投影平面上进行二重积分。",
  ),
  intro: t(
    "Find the volume of $E = \\{0 \\le y \\le 3,\\ 0 \\le z \\le 1,\\ 0 \\le x \\le 3 - y\\}$. Here $x$ lies between two surfaces, so integrate in $x$ first: the depth is $3 - y$, and $\\int_0^1 \\int_0^3 (3 - y)\\,dy\\,dz = \\frac{9}{2}$.\n\nCheck: $E$ is a prism whose cross-section in the $xy$-plane is the triangle $x, y \\ge 0$, $x + y \\le 3$ of area $\\frac{9}{2}$, with height $1$ in $z$, so its volume is $\\frac{9}{2}$.\n\nIn this lesson we integrate over Type III solids, with $x$ innermost and the outer integral over the projection in the $yz$-plane.",
    "求 $E = \\{0 \\le y \\le 3,\\ 0 \\le z \\le 1,\\ 0 \\le x \\le 3 - y\\}$ 的体积。这里 $x$ 夹在两个曲面之间，所以先对 $x$ 积分：深度为 $3 - y$，而 $\\int_0^1 \\int_0^3 (3 - y)\\,dy\\,dz = \\frac{9}{2}$。\n\n检验：$E$ 是一个棱柱，它在 $xy$ 平面上的截面是三角形 $x, y \\ge 0$，$x + y \\le 3$，面积为 $\\frac{9}{2}$，沿 $z$ 方向高 $1$，所以体积为 $\\frac{9}{2}$。\n\n本课我们在 Type III 型立体上积分，$x$ 在最内层，外层在 $yz$ 平面的投影上积分。",
  ),
  prerequisites: ["type-i-ii-and-iii-regions-in-three-dimensional-space"],
  encompasses: [{ topic: "type-i-ii-and-iii-regions-in-three-dimensional-space", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "integrating-with-respect-to-x-first",
      title: t("Integrating with respect to x first", "先对 x 积分的三重积分计算"),
      explanation: t(
        "Choose the innermost variable to be the one whose bounds are given as functions of the other two, so the limits are easy to write. For $E$ bounded by $0 \\le y \\le a$, $0 \\le z \\le b$, and $0 \\le x \\le cyz$:\n\n$$\\iiint_E 1\\,dV = \\int_0^a \\int_0^b \\int_0^{cyz} 1\\,dx\\,dz\\,dy = c\\frac{a^2 b^2}{4}.$$\n\nFor $0 \\le x \\le 5yz$ with $0 \\le y \\le 2$ and $0 \\le z \\le 6$ the volume is $5 \\cdot \\frac{4 \\cdot 36}{4} = 180$.\n\n> **Watch out.** The depth $cyz$ varies over the $yz$-projection, so it must be integrated there; each of $\\int y\\,dy$ and $\\int z\\,dz$ brings a factor $\\frac{1}{2}$.",
        "选择边界由另外两个变量的函数给出的那个变量作为最内层变量，这样积分限容易写出。对于由 $0 \\le y \\le a$、$0 \\le z \\le b$ 与 $0 \\le x \\le cyz$ 所围成的区域 $E$：\n\n$$\\iiint_E 1\\,dV = \\int_0^a \\int_0^b \\int_0^{cyz} 1\\,dx\\,dz\\,dy = c\\frac{a^2 b^2}{4}$$\n\n对 $0 \\le x \\le 5yz$，$0 \\le y \\le 2$，$0 \\le z \\le 6$，体积为 $5 \\cdot \\frac{4 \\cdot 36}{4} = 180$。\n\n> **注意。** 深度 $cyz$ 在 $yz$ 投影上是变化的，必须在那里积分；$\\int y\\,dy$ 与 $\\int z\\,dz$ 各带来一个因子 $\\frac{1}{2}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const c = rng.int(1, 4);
        const num = c * a * a * b * b;
        const ans = Q.of(num, 4);
        return numberProblem({
          prompt: t(
            `Find the volume of the solid $E$ bounded by $0 \\le y \\le ${a}$, $0 \\le z \\le ${b}$, and $0 \\le x \\le ${coef(c)}yz$.`,
            `求由 $0 \\le y \\le ${a}$、$0 \\le z \\le ${b}$ 与 $0 \\le x \\le ${coef(c)}yz$ 所围成几何体 $E$ 的体积。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(num),
              `That uses the largest depth $${c * a * b}$ everywhere; the depth $${coef(c)}yz$ varies.`,
              `那是处处用最大深度 $${c * a * b}$；深度 $${coef(c)}yz$ 是变化的。`,
            ),
            why(
              Q.of(num, 2),
              "Only one of the two factors $\\frac{1}{2}$, from $\\int y\\,dy$ and $\\int z\\,dz$, is kept.",
              "$\\int y\\,dy$ 与 $\\int z\\,dz$ 带来的两个 $\\frac{1}{2}$ 只保留了一个。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Integrate in x", "对 x 积分"],
                t(
                  `$\\int_0^{${coef(c)}yz} 1\\,dx = ${coef(c)}yz$, the depth of $E$.`,
                  `$\\int_0^{${coef(c)}yz} 1\\,dx = ${coef(c)}yz$，即 $E$ 的深度。`,
                ),
              ],
              [
                ["Integrate over the projection", "在投影上积分"],
                t(
                  `$${c}\\int_0^{${a}} y\\,dy \\int_0^{${b}} z\\,dz = ${c} \\cdot \\frac{${a * a}}{2} \\cdot \\frac{${b * b}}{2} = ${ans.toLatex()}$.`,
                  `$${c}\\int_0^{${a}} y\\,dy \\int_0^{${b}} z\\,dz = ${c} \\cdot \\frac{${a * a}}{2} \\cdot \\frac{${b * b}}{2} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The average of $yz$ over $[0, ${a}] \\times [0, ${b}]$ is $\\frac{${a}}{2} \\cdot \\frac{${b}}{2}$, so the volume is $${c} \\cdot \\frac{${a * b}}{4} \\cdot ${a * b} = ${ans.toLatex()}$.`,
              `$yz$ 在 $[0, ${a}] \\times [0, ${b}]$ 上的平均值为 $\\frac{${a}}{2} \\cdot \\frac{${b}}{2}$，所以体积为 $${c} \\cdot \\frac{${a * b}}{4} \\cdot ${a * b} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "integrating-x-over-a-type-iii-solid",
      title: t("Integrating $x$ over a Type III solid", "在 Type III 型立体上积分 $x$"),
      explanation: t(
        "For a Type III solid the inner integral runs in $x$, between surfaces that depend on $y$ and $z$, and the outer double integral runs over the projection $D$ in the $yz$-plane. For $0 \\le x \\le ky$ over $D = [0, a] \\times [0, b]$ in $y$ and $z$:\n\n$$\\iint_D \\int_0^{ky} x\\,dx\\,dA = \\iint_D \\frac{k^2y^2}{2}\\,dA = \\frac{k^2a^3b}{6}.$$\n\nIt is the Type II computation with the roles of $x$ and $y$ exchanged. For $k = 4$ and $a = b = 1$ it is $\\frac{16}{6} = \\frac{8}{3}$.\n\n> **Watch out.** The inner integral is $\\frac{(ky)^2}{2}$, so $k$ appears squared; and the integrand $x$ is not $1$, so the answer is not the volume.",
        "对 Type III 型立体，内层对 $x$ 积分，上下限是依赖 $y$ 和 $z$ 的曲面；外层在 $yz$ 平面的投影 $D$ 上作二重积分。对 $0 \\le x \\le ky$，$D$ 为 $y$、$z$ 的 $[0, a] \\times [0, b]$：\n\n$$\\iint_D \\int_0^{ky} x\\,dx\\,dA = \\iint_D \\frac{k^2y^2}{2}\\,dA = \\frac{k^2a^3b}{6}$$\n\n这就是把 Type II 计算中 $x$ 与 $y$ 的角色互换。对 $k = 4$，$a = b = 1$，结果为 $\\frac{16}{6} = \\frac{8}{3}$。\n\n> **注意。** 内层积分是 $\\frac{(ky)^2}{2}$，所以 $k$ 是平方的；被积函数 $x$ 不是 $1$，所以答案不是体积。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 4);
        const b = rng.int(1, 4);
        const k = rng.int(1, 3);
        const ans = Q.of(k * k * a ** 3 * b, 6);
        const kk = coef(k * k);
        return numberProblem({
          prompt: t(
            `$E = \\{(x, y, z) : 0 \\le y \\le ${a},\\ 0 \\le z \\le ${b},\\ 0 \\le x \\le ${coef(k)}y\\}$. Evaluate $\\iiint_E x\\,dV$.`,
            `$E = \\{(x, y, z) : 0 \\le y \\le ${a},\\ 0 \\le z \\le ${b},\\ 0 \\le x \\le ${coef(k)}y\\}$。计算 $\\iiint_E x\\,dV$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(k * a * a * b, 2),
              "That is the volume of $E$; the integrand $x$ is not $1$.",
              "那是 $E$ 的体积；被积函数 $x$ 不是 $1$。",
            ),
            why(
              Q.of(k * k * a ** 3 * b, 2),
              "The outer antiderivative of $y^2$ is $\\frac{y^3}{3}$; the division by $3$ is missing.",
              "外层 $y^2$ 的原函数是 $\\frac{y^3}{3}$；漏了除以 $3$。",
            ),
            ...(k === 1
              ? []
              : [
                  why(
                    Q.of(k * a ** 3 * b, 6),
                    `The inner integral is $\\frac{(${k}y)^2}{2}$, so $${k}$ is squared.`,
                    `内层积分是 $\\frac{(${k}y)^2}{2}$，所以 $${k}$ 要平方。`,
                  ),
                ]),
          ]),
          solution: walked(
            [
              [
                ["Integrate in x", "对 x 积分"],
                t(`$\\int_0^{${coef(k)}y} x\\,dx = \\frac{${kk}y^2}{2}$.`, `$\\int_0^{${coef(k)}y} x\\,dx = \\frac{${kk}y^2}{2}$。`),
              ],
              [
                ["Integrate over the projection", "在投影上积分"],
                t(
                  `$\\int_0^{${b}} \\int_0^{${a}} \\frac{${kk}y^2}{2}\\,dy\\,dz = \\frac{${k * k} \\cdot ${a ** 3}}{6} \\cdot ${b} = ${ans.toLatex()}$.`,
                  `$\\int_0^{${b}} \\int_0^{${a}} \\frac{${kk}y^2}{2}\\,dy\\,dz = \\frac{${k * k} \\cdot ${a ** 3}}{6} \\cdot ${b} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The volume of $E$ is $\\frac{${k} \\cdot ${a * a}}{2} \\cdot ${b} = ${Q.of(k * a * a * b, 2).toLatex()}$, and the average of $x$ over $E$ is $\\frac{${ans.toLatex()}}{${Q.of(k * a * a * b, 2).toLatex()}} = ${Q.of(k * a, 3).toLatex()}$, a third of the largest depth $${k * a}$, as it should be for a wedge.`,
              `$E$ 的体积为 $\\frac{${k} \\cdot ${a * a}}{2} \\cdot ${b} = ${Q.of(k * a * a * b, 2).toLatex()}$，$x$ 在 $E$ 上的平均值为 $\\frac{${ans.toLatex()}}{${Q.of(k * a * a * b, 2).toLatex()}} = ${Q.of(k * a, 3).toLatex()}$，是最大深度 $${k * a}$ 的三分之一，正符合楔形体。`,
            ),
          ),
        });
      },
    },
  ],
};

/** calculatingVolumesOfSolidsUsingTripleIntegrals computes volumes of polyhedra. */
export const calculatingVolumesOfSolidsUsingTripleIntegrals: TopicDef = {
  id: "calculating-volumes-of-solids-using-triple-integrals",
  title: t("Calculating Volumes of Solids Using Triple Integrals", "利用三重积分计算立体的体积"),
  summary: t("The volume of a solid $E$ is the triple integral $\\iiint_E 1\\,dV$.", "立体 $E$ 的体积等于三重积分 $\\iiint_E 1\\,dV$。"),
  intro: t(
    "Find the volume of $E = \\{0 \\le x \\le 1,\\ 0 \\le y \\le 1,\\ x + y \\le z \\le 3\\}$. The inner integral $\\int_{x + y}^{3} 1\\,dz = 3 - x - y$ is the height of the solid, and $\\int_0^1 \\int_0^1 (3 - x - y)\\,dy\\,dx = 3 - \\frac{1}{2} - \\frac{1}{2} = 2$.\n\nCheck: $E$ is the box $[0, 1]^2 \\times [0, 3]$ of volume $3$ with the part under $z = x + y$ removed. That part has average height $1$ over an area $1$, so $3 - 1 = 2$.\n\nIn this lesson we find volumes as $\\iiint_E 1\\,dV$, with the inner integral giving the height of the solid over each point.",
    "求 $E = \\{0 \\le x \\le 1,\\ 0 \\le y \\le 1,\\ x + y \\le z \\le 3\\}$ 的体积。内层积分 $\\int_{x + y}^{3} 1\\,dz = 3 - x - y$ 是立体的高度，而 $\\int_0^1 \\int_0^1 (3 - x - y)\\,dy\\,dx = 3 - \\frac{1}{2} - \\frac{1}{2} = 2$。\n\n检验：$E$ 是体积为 $3$ 的长方体 $[0, 1]^2 \\times [0, 3]$ 去掉 $z = x + y$ 下方的部分。那部分在面积 $1$ 上的平均高度为 $1$，所以 $3 - 1 = 2$。\n\n本课我们用 $\\iiint_E 1\\,dV$ 求体积，内层积分给出立体在每一点上方的高度。",
  ),
  prerequisites: ["triple-integrals-over-type-i-regions"],
  encompasses: [{ topic: "triple-integrals-over-type-i-regions", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "volume-of-a-standard-simplex",
      figure: multivariableDrawings4["calculating-volumes-of-solids-using-triple-integrals#volume-of-a-standard-simplex"],
      title: t("Volume of a standard simplex", "标准四面体的体积"),
      explanation: t(
        "A tetrahedron cut off by a plane from the corner of the first octant has one sixth of the volume of the box with the same intercepts. The tetrahedron bounded by the coordinate planes and $\\frac{x}{a} + \\frac{y}{b} + \\frac{z}{c} = 1$ ($a, b, c > 0$) has volume:\n\n$$\\text{Vol}(E) = \\iiint_E 1\\,dV = \\frac{abc}{6}.$$\n\nWith intercepts $8$, $9$ and $1$ the volume is $\\frac{72}{6} = 12$.\n\n> **Watch out.** Over a triangular base a pyramid has a third of the prism, so the box is divided by $2$ for the triangle and by $3$ for the pyramid, $6$ in all.",
        "被平面从第一卦限的角上截下的四面体，体积是具有相同截距的长方体体积的六分之一。由坐标平面与平面 $\\frac{x}{a} + \\frac{y}{b} + \\frac{z}{c} = 1$（$a, b, c > 0$）围成的四面体的体积为：\n\n$$\\text{Vol}(E) = \\iiint_E 1\\,dV = \\frac{abc}{6}$$\n\n截距为 $8$、$9$ 和 $1$ 时，体积为 $\\frac{72}{6} = 12$。\n\n> **注意。** 三角形底面上的锥体是棱柱的三分之一，所以长方体要因三角形除以 $2$，再因锥体除以 $3$，共除以 $6$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 7);
        const b = rng.int(1, 7);
        const c = rng.int(1, 7);
        const ans = Q.of(a * b * c, 6);
        return numberProblem({
          prompt: t(
            `Find the volume of the solid tetrahedron bounded by the coordinate planes $x = 0$, $y = 0$, $z = 0$, and the plane $\\frac{x}{${a}} + \\frac{y}{${b}} + \\frac{z}{${c}} = 1$.`,
            `求由坐标平面 $x = 0$、$y = 0$、$z = 0$ 与平面 $\\frac{x}{${a}} + \\frac{y}{${b}} + \\frac{z}{${c}} = 1$ 所围成的四面体体积。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              a * b * c,
              "That is the box spanned by the intercepts; the tetrahedron is a sixth of it.",
              "那是截距张成的长方体；四面体只是它的六分之一。",
            ),
            why(
              Q.of(a * b * c, 2),
              "That is the prism over the triangular base; the tetrahedron is a third of it.",
              "那是以三角形为底的棱柱；四面体是它的三分之一。",
            ),
            why(
              Q.of(a * b * c, 3),
              "That takes a third of the rectangle times the height; the base is a triangle, half of the rectangle.",
              "那是矩形乘高的三分之一；底面是三角形，只有矩形的一半。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Integrate in z", "对 z 积分"],
                t(
                  `Over the triangle $x, y \\ge 0$, $\\frac{x}{${a}} + \\frac{y}{${b}} \\le 1$ the height is $${c}\\left(1 - \\frac{x}{${a}} - \\frac{y}{${b}}\\right)$.`,
                  `在三角形 $x, y \\ge 0$，$\\frac{x}{${a}} + \\frac{y}{${b}} \\le 1$ 上，高度为 $${c}\\left(1 - \\frac{x}{${a}} - \\frac{y}{${b}}\\right)$。`,
                ),
              ],
              [
                ["Integrate over the triangle", "在三角形上积分"],
                t(
                  `The height is linear, so its average is its value $\\frac{${c}}{3}$ at the centroid $\\left(\\frac{${a}}{3}, \\frac{${b}}{3}\\right)$; times the area $${Q.of(a * b, 2).toLatex()}$ this is $${ans.toLatex()}$.`,
                  `高度是线性的，所以平均值等于在形心 $\\left(\\frac{${a}}{3}, \\frac{${b}}{3}\\right)$ 处的值 $\\frac{${c}}{3}$；乘以面积 $${Q.of(a * b, 2).toLatex()}$ 得 $${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `As a pyramid with base area $${Q.of(a * b, 2).toLatex()}$ and height $${c}$: $\\frac{1}{3} \\cdot ${Q.of(a * b, 2).toLatex()} \\cdot ${c} = ${ans.toLatex()}$.`,
              `看作底面积 $${Q.of(a * b, 2).toLatex()}$、高 $${c}$ 的锥体：$\\frac{1}{3} \\cdot ${Q.of(a * b, 2).toLatex()} \\cdot ${c} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-volume-under-a-paraboloid-over-a-rectangle",
      figure: multivariableDrawings4["calculating-volumes-of-solids-using-triple-integrals#the-volume-under-a-paraboloid-over-a-rectangle"],
      title: t("The volume under a paraboloid over a rectangle", "矩形上方抛物面下的体积"),
      explanation: t(
        "The volume of a solid $E$ is $\\iiint_E 1\\,dV$. For the solid above $[0, a] \\times [0, b]$ and below $z = x^2 + y^2$, the $z$-integral gives the height of the surface, leaving\n\n$$V = \\int_0^a \\int_0^b (x^2 + y^2)\\,dy\\,dx = \\frac{a^3b}{3} + \\frac{ab^3}{3}.$$\n\nEach term comes from one square in the integrand, multiplied by the length of the other side. Over $[0, 6] \\times [0, 1]$ the volume is $72 + 2 = 74$.\n\n> **Watch out.** $\\iint x^2\\,dA$ is $\\frac{a^3}{3}$ times the other length $b$. And the height varies, so the largest height times the area is too big.",
        "立体 $E$ 的体积为 $\\iiint_E 1\\,dV$。对 $[0, a] \\times [0, b]$ 上方、$z = x^2 + y^2$ 下方的立体，对 $z$ 积分得到曲面高度，于是\n\n$$V = \\int_0^a \\int_0^b (x^2 + y^2)\\,dy\\,dx = \\frac{a^3b}{3} + \\frac{ab^3}{3}$$\n\n每一项来自被积函数中的一个平方项，再乘以另一边的长度。在 $[0, 6] \\times [0, 1]$ 上方，体积为 $72 + 2 = 74$。\n\n> **注意。** $\\iint x^2\\,dA$ 是 $\\frac{a^3}{3}$ 乘以另一边的长度 $b$。高度是变化的，用最大高度乘以面积会偏大。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const ans = Q.of(a ** 3 * b + a * b ** 3, 3);
        return numberProblem({
          prompt: t(
            `Find the volume of the solid above $[0, ${a}] \\times [0, ${b}]$ in the $xy$-plane and below the paraboloid $z = x^2 + y^2$.`,
            `求 $xy$ 平面上 $[0, ${a}] \\times [0, ${b}]$ 上方、抛物面 $z = x^2 + y^2$ 下方的立体体积。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(a ** 3 + b ** 3, 3),
              "Each term must also be multiplied by the length of the other side.",
              "每一项还要乘以另一边的长度。",
            ),
            why(
              a * b * (a * a + b * b),
              `That is the largest height $${a * a + b * b}$ times the area $${a * b}$; the height varies.`,
              `那是最大高度 $${a * a + b * b}$ 乘以面积 $${a * b}$；高度是变化的。`,
            ),
            why(
              Q.of(a ** 3 * b + a * b ** 3, 2),
              "The antiderivative of $x^2$ is $\\frac{x^3}{3}$, not $\\frac{x^3}{2}$.",
              "$x^2$ 的原函数是 $\\frac{x^3}{3}$，不是 $\\frac{x^3}{2}$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Integrate in z", "对 z 积分"],
                t("$\\int_0^{x^2 + y^2} 1\\,dz = x^2 + y^2$, the height.", "$\\int_0^{x^2 + y^2} 1\\,dz = x^2 + y^2$，即高度。"),
              ],
              [
                ["Integrate over the rectangle", "在矩形上积分"],
                t(
                  `$\\int_0^{${a}} \\int_0^{${b}} (x^2 + y^2)\\,dy\\,dx = \\frac{${a ** 3}}{3} \\cdot ${b} + ${a} \\cdot \\frac{${b ** 3}}{3} = ${ans.toLatex()}$.`,
                  `$\\int_0^{${a}} \\int_0^{${b}} (x^2 + y^2)\\,dy\\,dx = \\frac{${a ** 3}}{3} \\cdot ${b} + ${a} \\cdot \\frac{${b ** 3}}{3} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The average of $x^2$ on $[0, ${a}]$ is $\\frac{${a * a}}{3}$ and of $y^2$ on $[0, ${b}]$ is $\\frac{${b * b}}{3}$, so the average height is $${Q.of(a * a + b * b, 3).toLatex()}$, and times the area $${a * b}$ that is $${ans.toLatex()}$.`,
              `$x^2$ 在 $[0, ${a}]$ 上的平均值为 $\\frac{${a * a}}{3}$，$y^2$ 在 $[0, ${b}]$ 上的平均值为 $\\frac{${b * b}}{3}$，所以平均高度为 $${Q.of(a * a + b * b, 3).toLatex()}$，乘以面积 $${a * b}$ 得 $${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** changingTheOrderOfIntegrationInTripleIntegralsChangingProjection switches the projection plane. */
export const changingTheOrderOfIntegrationInTripleIntegralsChangingProjection: TopicDef = {
  id: "changing-the-order-of-integration-in-triple-integrals-changing-projection",
  title: t("Changing the Order of Integration in Triple Integrals: Changing Projection", "交换三重积分的积分次序：更换投影平面"),
  summary: t(
    "Switching the projection plane (e.g., from xy to xz) simplifies boundaries when faces are aligned with coordinate axes.",
    "更换投影平面（例如由 xy 平面转为 xz 平面）能够在立体侧面与坐标轴平行时大幅简化积分限。",
  ),
  intro: t(
    "The solid bounded by $x = 0$, $y = 0$, $z = 0$, $z = 1$ and $x + y = 4$ is a prism. Projecting onto the $xy$-plane gives the triangle $x, y \\ge 0$, $x + y \\le 4$ of area $8$, and the height is $1$, so $\\iiint_E 1\\,dV = 8$.\n\nCheck: project onto the $xz$-plane instead, the rectangle $[0, 4] \\times [0, 1]$, with $0 \\le y \\le 4 - x$: $\\int_0^1 \\int_0^4 (4 - x)\\,dx\\,dz = 8$.\n\nIn this lesson we choose the coordinate plane to project onto so that the limits of the triple integral are as simple as possible.",
    "由 $x = 0$、$y = 0$、$z = 0$、$z = 1$ 与 $x + y = 4$ 围成的立体是一个棱柱。向 $xy$ 平面投影得到三角形 $x, y \\ge 0$，$x + y \\le 4$，面积为 $8$，高为 $1$，所以 $\\iiint_E 1\\,dV = 8$。\n\n检验：改为向 $xz$ 平面投影，得到矩形 $[0, 4] \\times [0, 1]$，且 $0 \\le y \\le 4 - x$：$\\int_0^1 \\int_0^4 (4 - x)\\,dx\\,dz = 8$。\n\n本课我们选择投影的坐标平面，使三重积分的积分限尽量简单。",
  ),
  prerequisites: ["calculating-volumes-of-solids-using-triple-integrals"],
  encompasses: [
    {
      topic: "calculating-volumes-of-solids-using-triple-integrals",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "reprojecting-triple-integrals-from-xy-to-xz-plane",
      figure:
        multivariableDrawings4[
          "changing-the-order-of-integration-in-triple-integrals-changing-projection#reprojecting-triple-integrals-from-xy-to-xz-plane"
        ],
      title: t("Reprojecting triple integrals from xy to xz plane", "将三重积分从 xy 投影转为 xz 投影"),
      explanation: t(
        "The same solid can be projected onto different coordinate planes, and choosing the plane that makes the boundaries simplest leads to easier limits. For a wedge $0 \\le x \\le a$, $0 \\le y \\le b$, $0 \\le z \\le 1 - x/a$, projecting onto the $xz$-plane gives region $0 \\le z \\le 1, 0 \\le x \\le a(1 - z)$. Then $\\iiint_E 1\\,dV = \\int_0^1 \\int_0^{a(1-z)} \\int_0^b 1\\,dy\\,dx\\,dz = \\frac{ab}{2}$. For $x + 10z = 10$ and $0 \\le y \\le 3$ this is $15$.\n\n> **Watch out.** The projection onto the $xz$-plane is a triangle, so its area is half of $a \\cdot 1$. The solid has constant thickness in $y$, so it is a prism, not a pyramid: there is no extra factor $\\frac{1}{3}$.",
        "同一个立体可以投影到不同的坐标平面上，选择使边界最简单的平面，积分限就更容易。对于楔形体 $0 \\le x \\le a$、$0 \\le y \\le b$、$0 \\le z \\le 1 - x/a$，向 $xz$ 平面投影得到平面区域 $0 \\le z \\le 1, 0 \\le x \\le a(1 - z)$。积分化为 $\\iiint_E 1\\,dV = \\int_0^1 \\int_0^{a(1-z)} \\int_0^b 1\\,dy\\,dx\\,dz = \\frac{ab}{2}$。对 $x + 10z = 10$ 与 $0 \\le y \\le 3$，结果为 $15$。\n\n> **注意。** 在 $xz$ 平面上的投影是三角形，面积是 $a \\cdot 1$ 的一半。立体在 $y$ 方向厚度不变，是棱柱而不是锥体，没有额外的因子 $\\frac{1}{3}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 8);
        const b = rng.int(2, 8);
        const ans = Q.of(a * b, 2);
        return numberProblem({
          prompt: t(
            `Evaluate the volume of the solid wedge bounded by $x = 0$, $y = 0$, $z = 0$, $y = ${b}$, and $x + ${a}z = ${a}$ by projecting onto the $xz$-plane and integrating with respect to $y$ first.`,
            `通过向 $xz$ 平面投影并优先对 $y$ 积分，计算由 $x = 0$、$y = 0$、$z = 0$、$y = ${b}$ 与 $x + ${a}z = ${a}$ 所围成楔形体的体积。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              a * b,
              `That uses the rectangle $[0, ${a}] \\times [0, 1]$; the projection is the triangle under $x + ${a}z = ${a}$.`,
              `那是用矩形 $[0, ${a}] \\times [0, 1]$；投影是 $x + ${a}z = ${a}$ 下方的三角形。`,
            ),
            why(
              Q.of(a * b, 6),
              "That treats the wedge as a pyramid; its thickness in $y$ is constant, so it is a prism.",
              "那是把楔形体当成锥体；它在 $y$ 方向厚度不变，是棱柱。",
            ),
            why(
              Q.of(a, 2),
              `That is the area of the projection; the thickness $${b}$ in $y$ is missing.`,
              `那是投影的面积；漏了 $y$ 方向的厚度 $${b}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Project onto the xz-plane", "向 xz 平面投影"],
                t(
                  `The projection is the triangle $0 \\le z \\le 1$, $0 \\le x \\le ${a}(1 - z)$, and over it $0 \\le y \\le ${b}$.`,
                  `投影是三角形 $0 \\le z \\le 1$，$0 \\le x \\le ${a}(1 - z)$，其上 $0 \\le y \\le ${b}$。`,
                ),
              ],
              [
                ["Integrate in y", "对 y 积分"],
                t(
                  `$\\int_0^{${b}} 1\\,dy = ${b}$, the same over the whole projection.`,
                  `$\\int_0^{${b}} 1\\,dy = ${b}$，在整个投影上相同。`,
                ),
              ],
              [
                ["Integrate over the projection", "在投影上积分"],
                t(
                  `$${b}\\int_0^1 ${a}(1 - z)\\,dz = ${b} \\cdot \\frac{${a}}{2} = ${ans.toLatex()}$.`,
                  `$${b}\\int_0^1 ${a}(1 - z)\\,dz = ${b} \\cdot \\frac{${a}}{2} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `Projected onto the $xy$-plane, the solid lies over $[0, ${a}] \\times [0, ${b}]$ with height $1 - \\frac{x}{${a}}$, whose average is $\\frac{1}{2}$; and $\\frac{1}{2} \\cdot ${a * b} = ${ans.toLatex()}$.`,
              `向 $xy$ 平面投影，立体位于 $[0, ${a}] \\times [0, ${b}]$ 上方，高度为 $1 - \\frac{x}{${a}}$，平均值为 $\\frac{1}{2}$；而 $\\frac{1}{2} \\cdot ${a * b} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-volume-of-a-parabolic-cylinder-slab",
      figure:
        multivariableDrawings4[
          "changing-the-order-of-integration-in-triple-integrals-changing-projection#the-volume-of-a-parabolic-cylinder-slab"
        ],
      title: t("The volume of a parabolic cylinder slab", "抛物柱面板块的体积"),
      explanation: t(
        "Choosing the right projection can make a triple integral simple. The solid bounded by the parabolic cylinder $y = x^2$, the plane $y = a^2$, and the planes $z = 0$ and $z = h$ has a constant height $h$ over its projection onto the $xy$-plane. That projection is the region $x^2 \\le y \\le a^2$, whose area is $\\int_{-a}^{a} (a^2 - x^2)\\,dx = \\frac{4a^3}{3}$, so the volume is $\\frac{4a^3h}{3}$. For $y = 25$ and $0 \\le z \\le 3$ this is $\\frac{4 \\cdot 125 \\cdot 3}{3} = 500$.\n\n> **Watch out.** The parabola reaches $y = a^2$ at both $x = -a$ and $x = a$, so integrate over $[-a, a]$, not only $[0, a]$; and multiply the area by the height $h$.",
        "选择合适的投影可以让三重积分变简单。由抛物柱面 $y = x^2$、平面 $y = a^2$ 以及平面 $z = 0$、$z = h$ 围成的立体，在其 $xy$ 平面投影上高度恒为 $h$。投影区域为 $x^2 \\le y \\le a^2$，面积为 $\\int_{-a}^{a} (a^2 - x^2)\\,dx = \\frac{4a^3}{3}$，所以体积为 $\\frac{4a^3h}{3}$。对 $y = 25$ 与 $0 \\le z \\le 3$，结果为 $\\frac{4 \\cdot 125 \\cdot 3}{3} = 500$。\n\n> **注意。** 抛物线在 $x = -a$ 和 $x = a$ 两处都达到 $y = a^2$，所以要在 $[-a, a]$ 上积分，而不只是 $[0, a]$；还要把面积乘以高度 $h$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 4);
        const h = rng.int(1, 8);
        const ans = Q.of(4 * a ** 3 * h, 3);
        const area = Q.of(4 * a ** 3, 3);
        return numberProblem({
          prompt: t(
            `Find the volume of the solid bounded by $y = x^2$, $y = ${a * a}$, $z = 0$, and $z = ${h}$.`,
            `求由 $y = x^2$、$y = ${a * a}$、$z = 0$ 和 $z = ${h}$ 围成的立体体积。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(2 * a ** 3 * h, 3),
              `That uses only $0 \\le x \\le ${a}$; the region also covers $-${a} \\le x \\le 0$.`,
              `那只用了 $0 \\le x \\le ${a}$；区域还包括 $-${a} \\le x \\le 0$。`,
            ),
            why(
              2 * a ** 3 * h,
              `That uses the rectangle $[-${a}, ${a}] \\times [0, ${a * a}]$; the region lies above the parabola.`,
              `那是用矩形 $[-${a}, ${a}] \\times [0, ${a * a}]$；区域位于抛物线上方。`,
            ),
            why(area, `That is the area of the projection; multiply by the height $${h}$.`, `那是投影的面积；还要乘以高度 $${h}$。`),
          ]),
          solution: walked(
            [
              [
                ["Project onto the xy-plane", "向 xy 平面投影"],
                t(
                  `The projection is $-${a} \\le x \\le ${a}$, $x^2 \\le y \\le ${a * a}$, with area $\\int_{-${a}}^{${a}} (${a * a} - x^2)\\,dx = ${area.toLatex()}$.`,
                  `投影为 $-${a} \\le x \\le ${a}$，$x^2 \\le y \\le ${a * a}$，面积为 $\\int_{-${a}}^{${a}} (${a * a} - x^2)\\,dx = ${area.toLatex()}$。`,
                ),
              ],
              [
                ["Multiply by the height", "乘以高度"],
                t(
                  `The height in $z$ is $${h}$, so $V = ${area.toLatex()} \\cdot ${h} = ${ans.toLatex()}$.`,
                  `$z$ 方向的高度为 $${h}$，所以 $V = ${area.toLatex()} \\cdot ${h} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The region above a parabola up to a chord is $\\frac{2}{3}$ of the enclosing rectangle, here $${2 * a} \\times ${a * a}$, so its area is $\\frac{2}{3} \\cdot ${2 * a ** 3} = ${area.toLatex()}$, as found.`,
              `抛物线与弦之间的区域是外接矩形的 $\\frac{2}{3}$，这里矩形为 $${2 * a} \\times ${a * a}$，所以面积为 $\\frac{2}{3} \\cdot ${2 * a ** 3} = ${area.toLatex()}$，与所得一致。`,
            ),
          ),
        });
      },
    },
  ],
};

/** changingTheOrderOfIntegrationInTripleIntegralsChangingRegion reorders limits over variable regions. */
export const changingTheOrderOfIntegrationInTripleIntegralsChangingRegion: TopicDef = {
  id: "changing-the-order-of-integration-in-triple-integrals-changing-region",
  title: t("Changing the Order of Integration in Triple Integrals: Changing Region", "交换三重积分的积分次序：重构积分限"),
  summary: t(
    "Reordering the variables in an iterated triple integral requires reconstructing the limits from the 3D boundary inequalities.",
    "在三次积分中调整变量积分顺序，需要根据三维边界不等式系统重新确定各层积分限。",
  ),
  intro: t(
    "$\\int_0^1 \\int_0^2 \\int_z^1 e^{x^2}\\,dx\\,dy\\,dz$ cannot be done in this order, since $e^{x^2}$ has no elementary antiderivative. The limits say $0 \\le z \\le x \\le 1$, which also reads $0 \\le x \\le 1$, $0 \\le z \\le x$. So the integral is $\\int_0^2 \\int_0^1 \\int_0^x e^{x^2}\\,dz\\,dx\\,dy = 2\\int_0^1 x e^{x^2}\\,dx = e - 1$.\n\nCheck: with the integrand $1$, both orders give the volume: $\\int_0^1 (1 - z) \\cdot 2\\,dz = 1$ and $2\\int_0^1 x\\,dx = 1$, so the new limits describe the same solid.\n\nIn this lesson we reorder triple integrals by rewriting the inequalities that define the solid.",
    "$\\int_0^1 \\int_0^2 \\int_z^1 e^{x^2}\\,dx\\,dy\\,dz$ 不能按这个次序计算，因为 $e^{x^2}$ 没有初等原函数。积分限表示 $0 \\le z \\le x \\le 1$，也可读作 $0 \\le x \\le 1$，$0 \\le z \\le x$。所以积分为 $\\int_0^2 \\int_0^1 \\int_0^x e^{x^2}\\,dz\\,dx\\,dy = 2\\int_0^1 x e^{x^2}\\,dx = e - 1$。\n\n检验：被积函数换成 $1$ 时，两种次序都给出体积：$\\int_0^1 (1 - z) \\cdot 2\\,dz = 1$，$2\\int_0^1 x\\,dx = 1$，所以新积分限描述的是同一个立体。\n\n本课我们通过改写定义立体的不等式来交换三重积分的次序。",
  ),
  prerequisites: ["changing-the-order-of-integration-in-triple-integrals-changing-projection"],
  encompasses: [
    {
      topic: "changing-the-order-of-integration-in-triple-integrals-changing-projection",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "permuting-limits-of-integration-in-iterated-integrals",
      title: t("Permuting limits of integration in iterated integrals", "置换三次积分中的积分限"),
      explanation: t(
        "To change the order, describe the same region with the variables nested differently, reading the new limits from the inequalities that define the region. To evaluate $\\int_0^a \\int_0^b \\int_z^a x\\,dx\\,dy\\,dz$, swap the $x$ and $z$ integrations: $0 \\le z \\le x \\le a \\iff 0 \\le x \\le a, 0 \\le z \\le x$:\n\n$$\\int_0^b \\int_0^a \\int_0^x x\\,dz\\,dx\\,dy = \\int_0^b \\int_0^a x^2\\,dx\\,dy = b\\frac{a^3}{3}.$$\n\nWith $a = 6$ and $b = 1$ this is $72$.\n\n> **Watch out.** After the swap, $z$ runs from $0$ up to $x$: the inequality $z \\le x$ stays the same, only the variable it bounds changes. Letting $z$ run to $a$, or from $x$ to $a$, describes a different solid.",
        "要交换次序，就用不同的嵌套方式描述同一个区域，从定义区域的不等式中读出新的积分限。计算 $\\int_0^a \\int_0^b \\int_z^a x\\,dx\\,dy\\,dz$ 时，对调 $x$ 与 $z$ 的积分次序：$0 \\le z \\le x \\le a \\iff 0 \\le x \\le a, 0 \\le z \\le x$：\n\n$$\\int_0^b \\int_0^a \\int_0^x x\\,dz\\,dx\\,dy = \\int_0^b \\int_0^a x^2\\,dx\\,dy = b\\frac{a^3}{3}$$\n\n当 $a = 6$，$b = 1$ 时，结果为 $72$。\n\n> **注意。** 交换后 $z$ 从 $0$ 到 $x$：不等式 $z \\le x$ 不变，变的只是它界定的变量。让 $z$ 到 $a$，或从 $x$ 到 $a$，描述的是另一个立体。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const ans = Q.of(b * a * a * a, 3);
        return numberProblem({
          prompt: t(
            `Evaluate the iterated triple integral $\\int_0^{${a}} \\int_0^{${b}} \\int_z^{${a}} x\\,dx\\,dy\\,dz$ by changing the order of integration.`,
            `通过交换积分次序计算三次积分 $\\int_0^{${a}} \\int_0^{${b}} \\int_z^{${a}} x\\,dx\\,dy\\,dz$ 的值。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(b * a ** 3, 2),
              `That lets $z$ run up to $${a}$ after the swap; it runs up to $x$.`,
              `那是交换后让 $z$ 一直到 $${a}$；它只到 $x$。`,
            ),
            why(
              Q.of(b * a ** 3, 6),
              `That lets $z$ run from $x$ to $${a}$, which reverses $z \\le x$; it runs from $0$ to $x$.`,
              `那是让 $z$ 从 $x$ 到 $${a}$，把 $z \\le x$ 反了过来；它应从 $0$ 到 $x$。`,
            ),
            why(
              b * a ** 3,
              "The antiderivative of $x^2$ is $\\frac{x^3}{3}$; the division by $3$ is missing.",
              "$x^2$ 的原函数是 $\\frac{x^3}{3}$；漏了除以 $3$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Rewrite the limits", "改写积分限"],
                t(
                  `$0 \\le z \\le ${a}$, $z \\le x \\le ${a}$ is the same as $0 \\le x \\le ${a}$, $0 \\le z \\le x$, so the integral is $\\int_0^{${b}} \\int_0^{${a}} \\int_0^x x\\,dz\\,dx\\,dy$.`,
                  `$0 \\le z \\le ${a}$，$z \\le x \\le ${a}$ 等价于 $0 \\le x \\le ${a}$，$0 \\le z \\le x$，所以积分为 $\\int_0^{${b}} \\int_0^{${a}} \\int_0^x x\\,dz\\,dx\\,dy$。`,
                ),
              ],
              [["Integrate in z", "对 z 积分"], t("$\\int_0^x x\\,dz = x^2$.", "$\\int_0^x x\\,dz = x^2$。")],
              [
                ["Integrate in x and y", "对 x 和 y 积分"],
                t(
                  `$\\int_0^{${b}} \\int_0^{${a}} x^2\\,dx\\,dy = ${b} \\cdot \\frac{${a ** 3}}{3} = ${ans.toLatex()}$.`,
                  `$\\int_0^{${b}} \\int_0^{${a}} x^2\\,dx\\,dy = ${b} \\cdot \\frac{${a ** 3}}{3} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `In the original order, $\\int_z^{${a}} x\\,dx = \\frac{${a * a} - z^2}{2}$, and $\\int_0^{${a}} \\frac{${a * a} - z^2}{2}\\,dz = \\frac{1}{2}\\left(${a ** 3} - \\frac{${a ** 3}}{3}\\right) = \\frac{${a ** 3}}{3}$; times $${b}$ that is $${ans.toLatex()}$.`,
              `按原次序，$\\int_z^{${a}} x\\,dx = \\frac{${a * a} - z^2}{2}$，而 $\\int_0^{${a}} \\frac{${a * a} - z^2}{2}\\,dz = \\frac{1}{2}\\left(${a ** 3} - \\frac{${a ** 3}}{3}\\right) = \\frac{${a ** 3}}{3}$；乘以 $${b}$ 得 $${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "reordering-the-limits-of-a-nested-triple-integral",
      title: t("Reordering the limits of a nested triple integral", "重排嵌套三重积分的积分限"),
      explanation: t(
        "The integral $\\int_0^a \\int_0^x \\int_0^y f\\,dz\\,dy\\,dx$ covers the solid $0 \\le z \\le y \\le x \\le a$. Writing the chain of inequalities makes any other order easy to read off. For the order $dy\\,dz\\,dx$, the outermost variable $x$ runs from $0$ to $a$, then $z$ runs from $0$ to $x$, and finally $y$ lies between them, from $z$ to $x$:\n\n$$\\int_0^a \\int_0^x \\int_z^x f\\,dy\\,dz\\,dx.$$\n\n> **Watch out.** Each limit comes from the neighbours of the variable in the chain: a variable's lower limit is the next smaller variable still inside it, or $0$, and its upper limit is the next larger one, or $a$. Leaving out a neighbour describes a larger solid.",
        "积分 $\\int_0^a \\int_0^x \\int_0^y f\\,dz\\,dy\\,dx$ 覆盖立体 $0 \\le z \\le y \\le x \\le a$。写出这串不等式后，任何其他次序都容易读出。对次序 $dy\\,dz\\,dx$，最外层 $x$ 从 $0$ 到 $a$，然后 $z$ 从 $0$ 到 $x$，最后 $y$ 夹在它们之间，从 $z$ 到 $x$：\n\n$$\\int_0^a \\int_0^x \\int_z^x f\\,dy\\,dz\\,dx$$\n\n> **注意。** 每个积分限都来自该变量在不等式链中的相邻项：下限是比它小、且尚未积分到外层的相邻变量（或 $0$），上限是比它大的相邻变量（或 $a$）。漏掉相邻项就描述了更大的立体。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 9);
        const f = rng.pick(["x", "y", "z", "xy", "xz", "yz", "xyz"]);
        const opt = (s: string) => t(`$${s}$`, `$${s}$`);
        return explainedChoice(rng, {
          prompt: t(
            `Rewrite $\\int_0^{${a}} \\int_0^x \\int_0^y ${f}\\,dz\\,dy\\,dx$ in the order $dx\\,dy\\,dz$.`,
            `把 $\\int_0^{${a}} \\int_0^x \\int_0^y ${f}\\,dz\\,dy\\,dx$ 改写为 $dx\\,dy\\,dz$ 次序。`,
          ),
          correct: opt(`\\int_0^{${a}} \\int_z^{${a}} \\int_y^{${a}} ${f}\\,dx\\,dy\\,dz`),
          wrong: [
            {
              option: opt(`\\int_0^{${a}} \\int_0^z \\int_0^y ${f}\\,dx\\,dy\\,dz`),
              why: t(
                "That keeps the old shape of the limits; it puts $y$ below $z$ and $x$ below $y$, the reverse of $z \\le y \\le x$.",
                "那是照搬原来的积分限形状；它让 $y$ 在 $z$ 下方、$x$ 在 $y$ 下方，与 $z \\le y \\le x$ 相反。",
              ),
            },
            {
              option: opt(`\\int_0^{${a}} \\int_z^{${a}} \\int_0^y ${f}\\,dx\\,dy\\,dz`),
              why: t(
                `The limits for $x$ are reversed: $x \\ge y$, so $x$ runs from $y$ to $${a}$.`,
                `$x$ 的积分限反了：$x \\ge y$，所以 $x$ 从 $y$ 到 $${a}$。`,
              ),
            },
            {
              option: opt(`\\int_0^{${a}} \\int_0^{${a}} \\int_y^{${a}} ${f}\\,dx\\,dy\\,dz`),
              why: t(
                "That lets $y$ start at $0$, dropping $z \\le y$, so it covers a larger solid.",
                "那是让 $y$ 从 $0$ 开始，丢掉了 $z \\le y$，覆盖的立体更大。",
              ),
            },
          ],
          solution: walked(
            [
              [
                ["Write the solid as a chain", "把立体写成不等式链"],
                t(`The limits say $0 \\le z \\le y \\le x \\le ${a}$.`, `积分限表示 $0 \\le z \\le y \\le x \\le ${a}$。`),
              ],
              [
                ["Read off the new limits", "读出新的积分限"],
                t(
                  `Outermost, $z$ runs over $[0, ${a}]$; then $y$ over $[z, ${a}]$; innermost, $x$ over $[y, ${a}]$.`,
                  `最外层 $z$ 取 $[0, ${a}]$；然后 $y$ 取 $[z, ${a}]$；最内层 $x$ 取 $[y, ${a}]$。`,
                ),
              ],
            ],
            t(
              `With the integrand $1$ both orders give the same volume: $\\int_0^{${a}} \\int_z^{${a}} (${a} - y)\\,dy\\,dz = \\int_0^{${a}} \\frac{(${a} - z)^2}{2}\\,dz = \\frac{${a ** 3}}{6}$, the volume of $0 \\le z \\le y \\le x \\le ${a}$.`,
              `被积函数为 $1$ 时两种次序给出相同的体积：$\\int_0^{${a}} \\int_z^{${a}} (${a} - y)\\,dy\\,dz = \\int_0^{${a}} \\frac{(${a} - z)^2}{2}\\,dz = \\frac{${a ** 3}}{6}$，正是 $0 \\le z \\le y \\le x \\le ${a}$ 的体积。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 3.16 Change of Variables for Double Integrals
// ---------------------------------------------------------------------------

/** doubleIntegralsInPlanePolarCoordinates integrates functions over circular disks. */
export const doubleIntegralsInPlanePolarCoordinates: TopicDef = {
  id: "double-integrals-in-plane-polar-coordinates",
  title: t("Double Integrals in Plane Polar Coordinates", "平面极坐标下的二重积分"),
  summary: t(
    "Converting to plane polar coordinates introduces the area element dA = r dr dθ, simplifying integrals over circular regions.",
    "转化为平面极坐标会引入面积微元 dA = r dr dθ，能极大简化在圆形或扇形区域上的积分计算。",
  ),
  intro: t(
    "Integrate $x^2 + y^2$ over the ring $1 \\le x^2 + y^2 \\le 4$. In polar coordinates the ring is $1 \\le r \\le 2$, $0 \\le \\theta \\le 2\\pi$, the integrand is $r^2$ and $dA = r\\,dr\\,d\\theta$, so the integral is $2\\pi \\int_1^2 r^3\\,dr = 2\\pi \\cdot \\frac{15}{4} = \\frac{15\\pi}{2}$.\n\nCheck: the ring is the disk of radius $2$ minus the disk of radius $1$, and over a disk of radius $R$ the integral is $\\frac{\\pi R^4}{2}$, so $8\\pi - \\frac{\\pi}{2} = \\frac{15\\pi}{2}$.\n\nIn this lesson we evaluate double integrals in polar coordinates, where $dA = r\\,dr\\,d\\theta$.",
    "在圆环 $1 \\le x^2 + y^2 \\le 4$ 上积分 $x^2 + y^2$。在极坐标中圆环为 $1 \\le r \\le 2$，$0 \\le \\theta \\le 2\\pi$，被积函数为 $r^2$，$dA = r\\,dr\\,d\\theta$，所以积分为 $2\\pi \\int_1^2 r^3\\,dr = 2\\pi \\cdot \\frac{15}{4} = \\frac{15\\pi}{2}$。\n\n检验：圆环是半径为 $2$ 的圆盘减去半径为 $1$ 的圆盘，而在半径为 $R$ 的圆盘上积分为 $\\frac{\\pi R^4}{2}$，所以 $8\\pi - \\frac{\\pi}{2} = \\frac{15\\pi}{2}$。\n\n本课我们在极坐标下计算二重积分，其中 $dA = r\\,dr\\,d\\theta$。",
  ),
  prerequisites: ["changing-the-order-of-integration-in-double-integrals", "polar-coordinate-transformations"],
  encompasses: [{ topic: "polar-coordinate-transformations", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "integrating-radial-functions-over-disks",
      title: t("Integrating radial functions over disks", "在圆盘上积分径向函数"),
      explanation: t(
        "In polar coordinates a disk has constant limits and the area element carries an extra factor of the radius, so radial functions become simple to integrate. For a disk $D$ of radius $R$ centered at the origin, the integral of $x^2 + y^2 = r^2$ is:\n\n$$\\iint_D (x^2 + y^2)\\,dA = \\int_0^{2\\pi} \\int_0^R r^2 \\cdot r\\,dr\\,d\\theta = 2\\pi \\left[\\frac{r^4}{4}\\right]_0^R = \\frac{\\pi R^4}{2}.$$\n\nOver the unit disk this is $\\frac{\\pi}{2}$.\n\n> **Watch out.** The integrand $r^2$ is multiplied by the $r$ of $dA$, giving $r^3$, whose antiderivative is $\\frac{r^4}{4}$; and the angle contributes the full $2\\pi$.",
        "在极坐标中，圆盘的积分限是常数，面积微元多一个半径因子，所以径向函数变得容易积分。对于以原点为中心、半径为 $R$ 的圆盘 $D$，$x^2 + y^2 = r^2$ 的二重积分为：\n\n$$\\iint_D (x^2 + y^2)\\,dA = \\int_0^{2\\pi} \\int_0^R r^2 \\cdot r\\,dr\\,d\\theta = 2\\pi \\left[\\frac{r^4}{4}\\right]_0^R = \\frac{\\pi R^4}{2}$$\n\n在单位圆盘上结果为 $\\frac{\\pi}{2}$。\n\n> **注意。** 被积函数 $r^2$ 要乘以 $dA$ 中的 $r$，得到 $r^3$，其原函数为 $\\frac{r^4}{4}$；角度贡献完整的 $2\\pi$。",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(2, 35);
        const ans = Q.of(R ** 4, 2);
        return numberProblem({
          prompt: t(
            `Find the value of $\\frac{1}{\\pi} \\iint_D (x^2 + y^2)\\,dA$, where $D$ is the disk of radius $${R}$ centered at the origin.`,
            `计算 $\\frac{1}{\\pi} \\iint_D (x^2 + y^2)\\,dA$ 的值，其中 $D$ 为以原点为中心、半径为 $${R}$ 的圆盘。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(2 * R ** 3, 3),
              "$dA = r\\,dr\\,d\\theta$; the factor $r$ from the area element is missing.",
              "$dA = r\\,dr\\,d\\theta$；漏了面积微元中的因子 $r$。",
            ),
            why(Q.of(R ** 4, 4), "The angle runs from $0$ to $2\\pi$; that uses only half of it.", "角度从 $0$ 到 $2\\pi$；那只用了一半。"),
            why(
              R ** 4,
              "The antiderivative of $r^3$ is $\\frac{r^4}{4}$, not $\\frac{r^4}{2}$.",
              "$r^3$ 的原函数是 $\\frac{r^4}{4}$，不是 $\\frac{r^4}{2}$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Convert to polar coordinates", "化为极坐标"],
                t(
                  `$x^2 + y^2 = r^2$, $dA = r\\,dr\\,d\\theta$, and the disk is $0 \\le r \\le ${R}$, $0 \\le \\theta \\le 2\\pi$.`,
                  `$x^2 + y^2 = r^2$，$dA = r\\,dr\\,d\\theta$，圆盘为 $0 \\le r \\le ${R}$，$0 \\le \\theta \\le 2\\pi$。`,
                ),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `$\\int_0^{2\\pi} \\int_0^{${R}} r^3\\,dr\\,d\\theta = 2\\pi \\cdot \\frac{${R ** 4}}{4} = ${ans.toLatex()}\\pi$, and dividing by $\\pi$ gives $${ans.toLatex()}$.`,
                  `$\\int_0^{2\\pi} \\int_0^{${R}} r^3\\,dr\\,d\\theta = 2\\pi \\cdot \\frac{${R ** 4}}{4} = ${ans.toLatex()}\\pi$，除以 $\\pi$ 得 $${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The average of $r^2$ over the disk is $\\frac{${R * R}}{2}$, half the largest value, because more area lies far from the center; times the area $${R * R}\\pi$ that is $${ans.toLatex()}\\pi$.`,
              `$r^2$ 在圆盘上的平均值为 $\\frac{${R * R}}{2}$，是最大值的一半，因为更多面积离中心较远；乘以面积 $${R * R}\\pi$ 得 $${ans.toLatex()}\\pi$。`,
            ),
          ),
        });
      },
    },
    {
      id: "integrating-the-distance-from-the-origin-over-a-disk",
      title: t("Integrating distance from the origin over a disk", "在圆盘上积分到原点的距离"),
      explanation: t(
        "In polar coordinates $\\sqrt{x^2 + y^2} = r$ and $dA = r\\,dr\\,d\\theta$, so the extra factor $r$ from the area element must not be forgotten. Over the disk of radius $R$:\n\n$$\\iint_D c\\sqrt{x^2 + y^2}\\,dA = \\int_0^{2\\pi} \\int_0^R c\\,r \\cdot r\\,dr\\,d\\theta = \\frac{2\\pi cR^3}{3}.$$\n\nFor $6\\sqrt{x^2 + y^2}$ over the unit disk this is $4\\pi$.\n\n> **Watch out.** $\\sqrt{x^2 + y^2}$ is $r$, not $r^2$; together with the $r$ of $dA$ the integrand becomes $c\\,r^2$.",
        "在极坐标中 $\\sqrt{x^2 + y^2} = r$，$dA = r\\,dr\\,d\\theta$，面积元中多出的因子 $r$ 不能忘记。在半径为 $R$ 的圆盘上：\n\n$$\\iint_D c\\sqrt{x^2 + y^2}\\,dA = \\int_0^{2\\pi} \\int_0^R c\\,r \\cdot r\\,dr\\,d\\theta = \\frac{2\\pi cR^3}{3}$$\n\n对单位圆盘上的 $6\\sqrt{x^2 + y^2}$，结果为 $4\\pi$。\n\n> **注意。** $\\sqrt{x^2 + y^2}$ 是 $r$，不是 $r^2$；连同 $dA$ 中的 $r$，被积函数变为 $c\\,r^2$。",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(1, 6);
        const c = rng.int(1, 5);
        const ans = Q.of(2 * c * R ** 3, 3);
        const cc = coef(c);
        return numberProblem({
          prompt: t(
            `$D$ is the disk of radius $${R}$ centered at the origin. Find $\\frac{1}{\\pi}\\iint_D ${cc}\\sqrt{x^2 + y^2}\\,dA$.`,
            `$D$ 是以原点为圆心、半径为 $${R}$ 的圆盘。求 $\\frac{1}{\\pi}\\iint_D ${cc}\\sqrt{x^2 + y^2}\\,dA$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              c * R * R,
              "$dA = r\\,dr\\,d\\theta$; the factor $r$ from the area element is missing.",
              "$dA = r\\,dr\\,d\\theta$；漏了面积微元中的因子 $r$。",
            ),
            why(Q.of(c * R ** 4, 2), "$\\sqrt{x^2 + y^2}$ is $r$, not $r^2$.", "$\\sqrt{x^2 + y^2}$ 是 $r$，不是 $r^2$。"),
            why(
              Q.of(c * R ** 3, 3),
              "The angle runs from $0$ to $2\\pi$; that uses only half of it.",
              "角度从 $0$ 到 $2\\pi$；那只用了一半。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Convert to polar coordinates", "化为极坐标"],
                t(
                  `The integrand is $${cc}r$ and $dA = r\\,dr\\,d\\theta$, so it becomes $${cc}r^2\\,dr\\,d\\theta$.`,
                  `被积函数为 $${cc}r$，$dA = r\\,dr\\,d\\theta$，所以化为 $${cc}r^2\\,dr\\,d\\theta$。`,
                ),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `$\\int_0^{2\\pi} \\int_0^{${R}} ${cc}r^2\\,dr\\,d\\theta = 2\\pi \\cdot \\frac{${c} \\cdot ${R ** 3}}{3}$, and dividing by $\\pi$ gives $${ans.toLatex()}$.`,
                  `$\\int_0^{2\\pi} \\int_0^{${R}} ${cc}r^2\\,dr\\,d\\theta = 2\\pi \\cdot \\frac{${c} \\cdot ${R ** 3}}{3}$，除以 $\\pi$ 得 $${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The average distance from the center over a disk of radius $${R}$ is $\\frac{2}{3} \\cdot ${R}$, so the integral is $${c} \\cdot \\frac{${2 * R}}{3} \\cdot ${R * R}\\pi = ${ans.toLatex()}\\pi$.`,
              `半径为 $${R}$ 的圆盘上到中心的平均距离为 $\\frac{2}{3} \\cdot ${R}$，所以积分为 $${c} \\cdot \\frac{${2 * R}}{3} \\cdot ${R * R}\\pi = ${ans.toLatex()}\\pi$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** doubleIntegralsBetweenPolarCurves integrates over polar regions bounded by curves. */
export const doubleIntegralsBetweenPolarCurves: TopicDef = {
  id: "double-integrals-between-polar-curves",
  title: t("Double Integrals Between Polar Curves", "极坐标曲线族所围区域上的二重积分"),
  summary: t(
    "Double integrals over annular or sector regions are computed by setting variable r limits between two bounding curves.",
    "在环形或扇形区域上的二重积分，通过在两条边界曲线之间设定变动的 r 积分限来计算。",
  ),
  intro: t(
    "Find the area between the circles $r = 2\\cos\\theta$ and $r = 4\\cos\\theta$. Both are traced once for $-\\frac{\\pi}{2} \\le \\theta \\le \\frac{\\pi}{2}$, and along each ray $r$ runs from $2\\cos\\theta$ to $4\\cos\\theta$, so the area is $\\int_{-\\pi/2}^{\\pi/2} \\int_{2\\cos\\theta}^{4\\cos\\theta} r\\,dr\\,d\\theta = \\int_{-\\pi/2}^{\\pi/2} 6\\cos^2\\theta\\,d\\theta = 3\\pi$.\n\nCheck: $r = 4\\cos\\theta$ is the circle of radius $2$ centered at $(2, 0)$ and $r = 2\\cos\\theta$ the circle of radius $1$ centered at $(1, 0)$, inside it. So the area is $4\\pi - \\pi = 3\\pi$.\n\nIn this lesson we integrate over regions whose radius runs between two polar curves.",
    "求圆 $r = 2\\cos\\theta$ 与 $r = 4\\cos\\theta$ 之间的面积。两者都在 $-\\frac{\\pi}{2} \\le \\theta \\le \\frac{\\pi}{2}$ 上描一遍，沿每条射线 $r$ 从 $2\\cos\\theta$ 到 $4\\cos\\theta$，所以面积为 $\\int_{-\\pi/2}^{\\pi/2} \\int_{2\\cos\\theta}^{4\\cos\\theta} r\\,dr\\,d\\theta = \\int_{-\\pi/2}^{\\pi/2} 6\\cos^2\\theta\\,d\\theta = 3\\pi$。\n\n检验：$r = 4\\cos\\theta$ 是圆心 $(2, 0)$、半径 $2$ 的圆，$r = 2\\cos\\theta$ 是其内部圆心 $(1, 0)$、半径 $1$ 的圆。所以面积为 $4\\pi - \\pi = 3\\pi$。\n\n本课我们在半径介于两条极坐标曲线之间的区域上积分。",
  ),
  prerequisites: ["double-integrals-in-plane-polar-coordinates"],
  encompasses: [{ topic: "double-integrals-in-plane-polar-coordinates", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "integrating-over-annular-polar-regions",
      figure: multivariableDrawings4["double-integrals-between-polar-curves#integrating-over-annular-polar-regions"],
      title: t("Integrating over annular polar regions", "在圆环扇形区域上的极坐标二重积分"),
      explanation: t(
        "An annular sector is a rectangle in polar coordinates, with the radius between two values and the angle between two values. For an annular sector $r_1 \\le r \\le r_2$ and $0 \\le \\theta \\le \\frac{\\pi}{k}$, the area divided by $\\pi$ is:\n\n$$\\frac{1}{\\pi}\\iint_R 1\\,dA = \\frac{1}{\\pi}\\int_0^{\\pi/k} \\int_{r_1}^{r_2} r\\,dr\\,d\\theta = \\frac{r_2^2 - r_1^2}{2k}.$$\n\nFor $1 \\le r \\le 3$ and $0 \\le \\theta \\le \\frac{\\pi}{8}$ this is $\\frac{8}{16} = \\frac{1}{2}$.\n\n> **Watch out.** Subtract the squares, $r_2^2 - r_1^2$, not the square of the width $(r_2 - r_1)^2$; and start $r$ at the inner radius, since the hole is not part of the region.",
        "环形扇区在极坐标中是一个矩形，半径和角度都介于两个值之间。对于圆环扇形区域 $r_1 \\le r \\le r_2$ 且 $0 \\le \\theta \\le \\frac{\\pi}{k}$，其面积除以 $\\pi$ 为：\n\n$$\\frac{1}{\\pi}\\iint_R 1\\,dA = \\frac{1}{\\pi}\\int_0^{\\pi/k} \\int_{r_1}^{r_2} r\\,dr\\,d\\theta = \\frac{r_2^2 - r_1^2}{2k}$$\n\n对 $1 \\le r \\le 3$ 与 $0 \\le \\theta \\le \\frac{\\pi}{8}$，结果为 $\\frac{8}{16} = \\frac{1}{2}$。\n\n> **注意。** 要用平方之差 $r_2^2 - r_1^2$，而不是宽度的平方 $(r_2 - r_1)^2$；$r$ 从内半径开始，因为空洞不属于区域。",
      ),
      generate(rng: Rng): Problem {
        const r1 = rng.int(1, 5);
        const dr = rng.int(1, 6);
        const r2 = r1 + dr;
        const k = rng.int(2, 6);
        const diffSq = r2 * r2 - r1 * r1;
        const ans = Q.of(diffSq, 2 * k);
        return numberProblem({
          prompt: t(
            `Find the value of $\\frac{1}{\\pi} \\iint_R 1\\,dA$ over the annular sector $R = \\{(r, \\theta) : ${r1} \\le r \\le ${r2}, 0 \\le \\theta \\le \\frac{\\pi}{${k}}\\}$.`,
            `计算 $\\frac{1}{\\pi} \\iint_R 1\\,dA$ 的值，其中 $R = \\{(r, \\theta) : ${r1} \\le r \\le ${r2}, 0 \\le \\theta \\le \\frac{\\pi}{${k}}\\}$ 为圆环扇形区域。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(diffSq, k),
              "The antiderivative of $r$ is $\\frac{r^2}{2}$; the factor $\\frac{1}{2}$ is missing.",
              "$r$ 的原函数是 $\\frac{r^2}{2}$；漏了因子 $\\frac{1}{2}$。",
            ),
            why(
              Q.of(dr * dr, 2 * k),
              `That squares the width $${dr}$; the radial integral gives $${r2}^2 - ${r1}^2$.`,
              `那是把宽度 $${dr}$ 平方；径向积分给出 $${r2}^2 - ${r1}^2$。`,
            ),
            why(
              Q.of(r2 * r2, 2 * k),
              `That starts $r$ at $0$; the region starts at $r = ${r1}$.`,
              `那是让 $r$ 从 $0$ 开始；区域从 $r = ${r1}$ 开始。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Integrate in r", "对 r 积分"],
                t(
                  `$\\int_{${r1}}^{${r2}} r\\,dr = \\frac{${r2 * r2} - ${r1 * r1}}{2} = \\frac{${diffSq}}{2}$.`,
                  `$\\int_{${r1}}^{${r2}} r\\,dr = \\frac{${r2 * r2} - ${r1 * r1}}{2} = \\frac{${diffSq}}{2}$。`,
                ),
              ],
              [
                ["Integrate in θ and divide by π", "对 θ 积分并除以 π"],
                t(
                  `$\\frac{\\pi}{${k}} \\cdot \\frac{${diffSq}}{2} = ${ans.toLatex()}\\pi$, and dividing by $\\pi$ gives $${ans.toLatex()}$.`,
                  `$\\frac{\\pi}{${k}} \\cdot \\frac{${diffSq}}{2} = ${ans.toLatex()}\\pi$，除以 $\\pi$ 得 $${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The whole ring has area $\\pi(${r2 * r2} - ${r1 * r1}) = ${diffSq}\\pi$, and the angle $\\frac{\\pi}{${k}}$ is $\\frac{1}{${2 * k}}$ of a turn, so the sector has $\\frac{${diffSq}}{${2 * k}}\\pi = ${ans.toLatex()}\\pi$.`,
              `整个圆环的面积为 $\\pi(${r2 * r2} - ${r1 * r1}) = ${diffSq}\\pi$，角度 $\\frac{\\pi}{${k}}$ 占一圈的 $\\frac{1}{${2 * k}}$，所以扇形面积为 $\\frac{${diffSq}}{${2 * k}}\\pi = ${ans.toLatex()}\\pi$。`,
            ),
          ),
        });
      },
    },
    {
      id: "areas-enclosed-by-classic-polar-curves",
      figure: multivariableDrawings4["double-integrals-between-polar-curves#areas-enclosed-by-classic-polar-curves"],
      title: t("Areas enclosed by classic polar curves", "经典极坐标曲线围成的面积"),
      explanation: t(
        "The area enclosed by $r = f(\\theta)$ is $\\frac{1}{2}\\int f(\\theta)^2\\,d\\theta$ over one full trace of the curve. Three standard results follow:\n\n- The circle $r = 2a\\cos\\theta$ (or $2a\\sin\\theta$) is traced once for $\\theta \\in [0, \\pi]$ and encloses $\\pi a^2$.\n- The cardioid $r = a(1 + \\cos\\theta)$ encloses $\\frac{3}{2}\\pi a^2$.\n- The rose $r = a\\cos(n\\theta)$ encloses $\\frac{\\pi a^2}{4}$ when $n$ is odd ($n$ petals) and $\\frac{\\pi a^2}{2}$ when $n$ is even ($2n$ petals).\n\nFor example the cardioid $r = 7(1 + \\cos\\theta)$ encloses $\\frac{147\\pi}{2}$.\n\n> **Watch out.** Integrate over one trace only: a circle $r = 2a\\cos\\theta$ is complete on $[0, \\pi]$, and on $[0, 2\\pi]$ it is traced twice. Its radius is $a$, not $2a$.",
        "曲线 $r = f(\\theta)$ 围成的面积是在曲线完整描一遍的范围上计算 $\\frac{1}{2}\\int f(\\theta)^2\\,d\\theta$。由此得三个标准结果：\n\n- 圆 $r = 2a\\cos\\theta$（或 $2a\\sin\\theta$）在 $\\theta \\in [0, \\pi]$ 上描一遍，面积为 $\\pi a^2$。\n- 心形线 $r = a(1 + \\cos\\theta)$ 面积为 $\\frac{3}{2}\\pi a^2$。\n- 玫瑰线 $r = a\\cos(n\\theta)$：$n$ 为奇数时（$n$ 瓣）面积为 $\\frac{\\pi a^2}{4}$，$n$ 为偶数时（$2n$ 瓣）面积为 $\\frac{\\pi a^2}{2}$。\n\n例如心形线 $r = 7(1 + \\cos\\theta)$ 围成的面积为 $\\frac{147\\pi}{2}$。\n\n> **注意。** 只在描一遍的范围上积分：圆 $r = 2a\\cos\\theta$ 在 $[0, \\pi]$ 上已经完整，在 $[0, 2\\pi]$ 上会描两遍。它的半径是 $a$，不是 $2a$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 6);
        const kind = rng.int(1, 3);
        const trig = rng.pick(["\\cos", "\\sin"]);
        const n = rng.int(2, 5);
        const aa = a * a;
        const lead = a === 1 ? "" : `${a}`;
        const curve =
          kind === 1 ? `r = ${2 * a}${trig}\\theta` : kind === 2 ? `r = ${lead}(1 + ${trig}\\theta)` : `r = ${lead}${trig}(${n}\\theta)`;
        const odd = n % 2 === 1;
        const ans = kind === 1 ? Q.of(aa) : kind === 2 ? Q.of(3 * aa, 2) : Q.of(aa, odd ? 4 : 2);
        const name = kind === 1 ? ["circle", "圆"] : kind === 2 ? ["cardioid", "心形线"] : ["rose", "玫瑰线"];
        const mistakes =
          kind === 1
            ? [
                why(
                  4 * aa,
                  `That uses $${2 * a}$ as the radius; $${2 * a}$ is the diameter, so the radius is $${a}$.`,
                  `那是把 $${2 * a}$ 当作半径；$${2 * a}$ 是直径，半径为 $${a}$。`,
                ),
                why(
                  2 * aa,
                  "That integrates over $[0, 2\\pi]$, which traces the circle twice.",
                  "那是在 $[0, 2\\pi]$ 上积分，把圆描了两遍。",
                ),
              ]
            : kind === 2
              ? [
                  why(
                    aa,
                    `That drops the $${trig}^2\\theta$ term of $(1 + ${trig}\\theta)^2$, which contributes $\\pi$ over a turn.`,
                    `那是丢掉了 $(1 + ${trig}\\theta)^2$ 中的 $${trig}^2\\theta$ 项，它在一圈上贡献 $\\pi$。`,
                  ),
                  why(3 * aa, "The area formula has a factor $\\frac{1}{2}$; it is missing.", "面积公式有因子 $\\frac{1}{2}$；漏了。"),
                ]
              : [
                  why(
                    Q.of(aa, odd ? 2 : 4),
                    odd
                      ? `For odd $n = ${n}$ the curve is traced twice over $[0, 2\\pi]$, so only half of that integral counts.`
                      : `For even $n = ${n}$ the curve is traced once over $[0, 2\\pi]$, with $${2 * n}$ petals; nothing is counted twice.`,
                    odd
                      ? `$n = ${n}$ 为奇数时，曲线在 $[0, 2\\pi]$ 上描两遍，只能取那个积分的一半。`
                      : `$n = ${n}$ 为偶数时，曲线在 $[0, 2\\pi]$ 上描一遍，共 $${2 * n}$ 瓣，没有重复计算。`,
                  ),
                  why(
                    ans.mul(Q.of(n)),
                    "The total does not grow with the number of petals; more petals are thinner.",
                    "总面积不随花瓣数增加；花瓣越多越细。",
                  ),
                ];
        const area =
          kind === 1
            ? t(
                `$\\frac{1}{2}\\int_0^{\\pi} ${4 * aa}${trig}^2\\theta\\,d\\theta = ${2 * aa} \\cdot \\frac{\\pi}{2} = ${aa === 1 ? "" : aa}\\pi$.`,
                `$\\frac{1}{2}\\int_0^{\\pi} ${4 * aa}${trig}^2\\theta\\,d\\theta = ${2 * aa} \\cdot \\frac{\\pi}{2} = ${aa === 1 ? "" : aa}\\pi$。`,
              )
            : kind === 2
              ? t(
                  `$\\frac{1}{2}\\int_0^{2\\pi} ${aa === 1 ? "" : aa}(1 + ${trig}\\theta)^2\\,d\\theta = \\frac{${aa}}{2}(2\\pi + 0 + \\pi) = ${ans.toLatex()}\\pi$.`,
                  `$\\frac{1}{2}\\int_0^{2\\pi} ${aa === 1 ? "" : aa}(1 + ${trig}\\theta)^2\\,d\\theta = \\frac{${aa}}{2}(2\\pi + 0 + \\pi) = ${ans.toLatex()}\\pi$。`,
                )
              : t(
                  `$\\frac{1}{2}\\int_0^{2\\pi} ${aa === 1 ? "" : aa}${trig}^2(${n}\\theta)\\,d\\theta = \\frac{${aa}}{2}\\pi$, ${odd ? `and for odd $n$ this traces the ${n} petals twice, so the area is $\\frac{${aa}}{4}\\pi$` : `which traces the ${2 * n} petals once`}.`,
                  `$\\frac{1}{2}\\int_0^{2\\pi} ${aa === 1 ? "" : aa}${trig}^2(${n}\\theta)\\,d\\theta = \\frac{${aa}}{2}\\pi$，${odd ? `$n$ 为奇数时这把 ${n} 瓣描了两遍，所以面积为 $\\frac{${aa}}{4}\\pi$` : `这正好把 ${2 * n} 瓣描一遍`}。`,
                );
        const check =
          kind === 1
            ? t(
                `$r = ${2 * a}${trig}\\theta$ is a circle through the origin of diameter $${2 * a}$, so of radius $${a}$ and area $${aa === 1 ? "" : aa}\\pi$.`,
                `$r = ${2 * a}${trig}\\theta$ 是过原点、直径为 $${2 * a}$ 的圆，半径为 $${a}$，面积为 $${aa === 1 ? "" : aa}\\pi$。`,
              )
            : kind === 2
              ? t(
                  `Over a turn $(1 + ${trig}\\theta)^2$ averages $1 + 0 + \\frac{1}{2} = \\frac{3}{2}$, so the area is $\\frac{1}{2} \\cdot 2\\pi \\cdot ${aa} \\cdot \\frac{3}{2} = ${ans.toLatex()}\\pi$.`,
                  `在一圈上 $(1 + ${trig}\\theta)^2$ 的平均值为 $1 + 0 + \\frac{1}{2} = \\frac{3}{2}$，所以面积为 $\\frac{1}{2} \\cdot 2\\pi \\cdot ${aa} \\cdot \\frac{3}{2} = ${ans.toLatex()}\\pi$。`,
                )
              : t(
                  `Each petal is traced while $${trig}(${n}\\theta)$ keeps one sign, over an angle $\\frac{\\pi}{${n}}$, and has area $\\frac{${aa}}{2} \\cdot \\frac{\\pi}{${2 * n}}$; there are $${odd ? n : 2 * n}$ petals, giving $${ans.toLatex()}\\pi$.`,
                  `每一瓣在 $${trig}(${n}\\theta)$ 保持同号、角度为 $\\frac{\\pi}{${n}}$ 的范围内描出，面积为 $\\frac{${aa}}{2} \\cdot \\frac{\\pi}{${2 * n}}$；共 $${odd ? n : 2 * n}$ 瓣，得 $${ans.toLatex()}\\pi$。`,
                );
        return numberProblem({
          prompt: t(
            `Find $\\frac{1}{\\pi}$ times the area enclosed by the ${name[0]} $${curve}$.`,
            `求${name[1]} $${curve}$ 围成面积的 $\\frac{1}{\\pi}$ 倍。`,
          ),
          answer: ans,
          mistakes: distinct(ans, mistakes),
          solution: walked(
            [
              [["Integrate one trace", "在描一遍的范围上积分"], area],
              [["Divide by π", "除以 π"], t(`The answer is $${ans.toLatex()}$.`, `答案为 $${ans.toLatex()}$。`)],
            ],
            check,
          ),
        });
      },
    },
  ],
};

/** computingAreasUsingAChangeOfVariables computes areas of ellipses and general regions. */
export const computingAreasUsingAChangeOfVariables: TopicDef = {
  id: "computing-areas-using-a-change-of-variables",
  title: t("Computing Areas Using a Change of Variables", "利用变量代换计算平面图形面积"),
  summary: t(
    "By the change of variables formula, $\\operatorname{Area}(R) = \\iint_S |J(u, v)|\\,du\\,dv$: the Jacobian scales area from a simpler region $S$.",
    "由变量代换公式，$\\operatorname{Area}(R) = \\iint_S |J(u, v)|\\,du\\,dv$：雅可比行列式把较简单区域 $S$ 的面积缩放为 $R$ 的面积。",
  ),
  intro: t(
    "The map $x = 2u + v$, $y = u + 3v$ sends the triangle $S$: $u, v \\ge 0$, $u + v \\le 1$ to a triangle $R$. Its Jacobian is $\\begin{vmatrix} 2 & 1 \\\\ 1 & 3 \\end{vmatrix} = 5$, so $\\operatorname{Area}(R) = 5 \\cdot \\operatorname{Area}(S) = 5 \\cdot \\frac{1}{2} = \\frac{5}{2}$.\n\nCheck: the corners of $S$ go to $(0, 0)$, $(2, 1)$ and $(1, 3)$, and the triangle with these corners has area $\\frac{1}{2}|2 \\cdot 3 - 1 \\cdot 1| = \\frac{5}{2}$.\n\nIn this lesson we find areas by mapping a simple region onto the given one and multiplying by the absolute value of the Jacobian.",
    "映射 $x = 2u + v$，$y = u + 3v$ 把三角形 $S$：$u, v \\ge 0$，$u + v \\le 1$ 映为三角形 $R$。其雅可比行列式为 $\\begin{vmatrix} 2 & 1 \\\\ 1 & 3 \\end{vmatrix} = 5$，所以 $\\operatorname{Area}(R) = 5 \\cdot \\operatorname{Area}(S) = 5 \\cdot \\frac{1}{2} = \\frac{5}{2}$。\n\n检验：$S$ 的顶点映到 $(0, 0)$、$(2, 1)$ 和 $(1, 3)$，以它们为顶点的三角形面积为 $\\frac{1}{2}|2 \\cdot 3 - 1 \\cdot 1| = \\frac{5}{2}$。\n\n本课我们把简单区域映到所给区域上，再乘以雅可比行列式的绝对值来求面积。",
  ),
  prerequisites: ["the-image-of-an-affine-transformation", "the-jacobian"],
  encompasses: [
    { topic: "the-image-of-an-affine-transformation", weight: 0.3 },
    { topic: "the-jacobian", weight: 0.3 },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "area-of-elliptical-regions-via-affine-substitution",
      title: t("Area of elliptical regions via affine substitution", "通过仿射代换求椭圆区域面积"),
      explanation: t(
        "Stretching the unit disk by different factors along the axes produces an ellipse, and its area is the area of the disk times the product of the factors. Under the transformation $x = au, y = bv$, the unit disk $u^2 + v^2 \\le 1$ maps to the ellipse $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} \\le 1$. The Jacobian is $J = ab$, so $\\text{Area}(E) = \\pi ab$. For $\\frac{x^2}{144} + y^2 \\le 1$ the area is $12\\pi$.\n\n> **Watch out.** The stretch factors are the semi-axes $a$ and $b$, the square roots of the denominators. And the Jacobian multiplies: the factors are not added.",
        "沿两轴按不同比例拉伸单位圆盘就得到椭圆，它的面积等于圆盘面积乘以两个比例的乘积。在变换 $x = au, y = bv$ 下，单位圆盘 $u^2 + v^2 \\le 1$ 被映射为椭圆 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} \\le 1$。雅可比行列式为 $J = ab$，因此椭圆面积为 $\\text{Area}(E) = \\pi ab$。对 $\\frac{x^2}{144} + y^2 \\le 1$，面积为 $12\\pi$。\n\n> **注意。** 拉伸比例是半轴 $a$ 和 $b$，即分母的平方根。雅可比行列式是相乘，不是相加。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 10);
        const b = rng.int(2, 10);
        const ans = a * b;
        return numberProblem({
          prompt: t(
            `Find the value of $\\frac{\\text{Area}(E)}{\\pi}$ for the elliptical region $E$ defined by $\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} \\le 1$.`,
            `计算椭圆区域 $E: \\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} \\le 1$ 的面积与 $\\pi$ 的比值 $\\frac{\\text{Area}(E)}{\\pi}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              a + b,
              `That adds the semi-axes; the Jacobian is their product $${a} \\cdot ${b}$.`,
              `那是把半轴相加；雅可比行列式是它们的乘积 $${a} \\cdot ${b}$。`,
            ),
            why(
              a * a * b * b,
              `That uses the denominators $${a * a}$ and $${b * b}$; the semi-axes are their square roots.`,
              `那是用了分母 $${a * a}$ 和 $${b * b}$；半轴是它们的平方根。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Substitute", "代换"],
                t(
                  `With $x = ${a}u$ and $y = ${b}v$ the ellipse becomes the unit disk $u^2 + v^2 \\le 1$.`,
                  `令 $x = ${a}u$，$y = ${b}v$，椭圆变为单位圆盘 $u^2 + v^2 \\le 1$。`,
                ),
              ],
              [
                ["Multiply by the Jacobian", "乘以雅可比行列式"],
                t(
                  `$J = \\begin{vmatrix} ${a} & 0 \\\\ 0 & ${b} \\end{vmatrix} = ${ans}$, so the area is $${ans} \\cdot \\pi = ${ans}\\pi$, and dividing by $\\pi$ gives $${ans}$.`,
                  `$J = \\begin{vmatrix} ${a} & 0 \\\\ 0 & ${b} \\end{vmatrix} = ${ans}$，所以面积为 $${ans} \\cdot \\pi = ${ans}\\pi$，除以 $\\pi$ 得 $${ans}$。`,
                ),
              ],
            ],
            t(
              `The ellipse fits in the rectangle $${2 * a} \\times ${2 * b}$ of area $${4 * ans}$, and $${ans}\\pi$ is $\\frac{\\pi}{4}$ of it, the same ratio as a disk to its square.`,
              `椭圆位于面积为 $${4 * ans}$ 的矩形 $${2 * a} \\times ${2 * b}$ 内，而 $${ans}\\pi$ 是它的 $\\frac{\\pi}{4}$，与圆盘和外切正方形之比相同。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-area-of-a-parallelogram-from-a-linear-change-of-variables",
      figure:
        multivariableDrawings4["computing-areas-using-a-change-of-variables#the-area-of-a-parallelogram-from-a-linear-change-of-variables"],
      title: t("The area of a parallelogram by a change of variables", "用变量替换求平行四边形面积"),
      explanation: t(
        "A region $\\{0 \\le px + qy \\le U,\\ 0 \\le rx + sy \\le V\\}$ is a parallelogram. Substituting $u = px + qy$ and $v = rx + sy$ turns it into the rectangle $[0, U] \\times [0, V]$. Since $\\frac{\\partial(u, v)}{\\partial(x, y)} = ps - qr$, the Jacobian of the inverse map is $\\frac{1}{|ps - qr|}$, and\n\n$$\\operatorname{Area} = \\iint 1\\,dx\\,dy = \\frac{UV}{|ps - qr|}.$$\n\nFor $0 \\le 2x + y \\le 7$, $0 \\le x + 4y \\le 7$ the determinant is $7$ and the area is $\\frac{49}{7} = 7$.\n\n> **Watch out.** $ps - qr$ is the Jacobian of $(u, v)$ in terms of $(x, y)$, so the area element $dx\\,dy$ is $du\\,dv$ divided by it, not multiplied. The determinant has a minus sign: $ps - qr$, not $ps + qr$.",
        "区域 $\\{0 \\le px + qy \\le U,\\ 0 \\le rx + sy \\le V\\}$ 是平行四边形。令 $u = px + qy$，$v = rx + sy$，它变为矩形 $[0, U] \\times [0, V]$。由于 $\\frac{\\partial(u, v)}{\\partial(x, y)} = ps - qr$，逆变换的雅可比行列式为 $\\frac{1}{|ps - qr|}$，于是\n\n$$\\operatorname{Area} = \\iint 1\\,dx\\,dy = \\frac{UV}{|ps - qr|}$$\n\n对 $0 \\le 2x + y \\le 7$，$0 \\le x + 4y \\le 7$，行列式为 $7$，面积为 $\\frac{49}{7} = 7$。\n\n> **注意。** $ps - qr$ 是 $(u, v)$ 关于 $(x, y)$ 的雅可比行列式，所以面积元 $dx\\,dy$ 是 $du\\,dv$ 除以它，而不是乘以它。行列式带减号：是 $ps - qr$，不是 $ps + qr$。",
      ),
      generate(rng: Rng): Problem {
        let p = 1;
        let q = 1;
        let r = 1;
        let s = 1;
        while (p * s - q * r === 0) {
          p = rng.int(1, 3);
          q = rng.nonZero(-3, 3);
          r = rng.nonZero(-3, 3);
          s = rng.int(1, 3);
        }
        const det = p * s - q * r;
        const d = Math.abs(det);
        const U = rng.int(1, 6);
        const V = rng.int(1, 6);
        const ans = Q.of(U * V, d);
        const plus = Math.abs(p * s + q * r);
        const [x1, y1, x2, y2] = [Q.of(U * s, det), Q.of(-U * r, det), Q.of(-q * V, det), Q.of(p * V, det)];
        return numberProblem({
          prompt: t(
            `Find the area of the region $R = \\{(x, y) : 0 \\le ${poly([p, "x"], [q, "y"])} \\le ${U},\\ 0 \\le ${poly([r, "x"], [s, "y"])} \\le ${V}\\}$.`,
            `求区域 $R = \\{(x, y) : 0 \\le ${poly([p, "x"], [q, "y"])} \\le ${U},\\ 0 \\le ${poly([r, "x"], [s, "y"])} \\le ${V}\\}$ 的面积。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              U * V * d,
              `That multiplies by $${d}$; the area element is $dx\\,dy = \\frac{1}{${d}}\\,du\\,dv$.`,
              `那是乘以 $${d}$；面积元是 $dx\\,dy = \\frac{1}{${d}}\\,du\\,dv$。`,
            ),
            why(
              U * V,
              `That is the area of the rectangle in the $uv$-plane; the Jacobian factor $\\frac{1}{${d}}$ is missing.`,
              `那是 $uv$ 平面中矩形的面积；漏了雅可比因子 $\\frac{1}{${d}}$。`,
            ),
            ...(plus === 0
              ? []
              : [
                  why(
                    Q.of(U * V, plus),
                    `That uses $ps + qr$; the determinant is $ps - qr = ${det}$.`,
                    `那是用了 $ps + qr$；行列式是 $ps - qr = ${det}$。`,
                  ),
                ]),
          ]),
          solution: walked(
            [
              [
                ["Substitute", "代换"],
                t(
                  `With $u = ${poly([p, "x"], [q, "y"])}$ and $v = ${poly([r, "x"], [s, "y"])}$, $R$ becomes the rectangle $[0, ${U}] \\times [0, ${V}]$.`,
                  `令 $u = ${poly([p, "x"], [q, "y"])}$，$v = ${poly([r, "x"], [s, "y"])}$，$R$ 变为矩形 $[0, ${U}] \\times [0, ${V}]$。`,
                ),
              ],
              [
                ["Find the Jacobian", "求雅可比行列式"],
                t(
                  `$\\frac{\\partial(u, v)}{\\partial(x, y)} = ${p} \\cdot ${s} - ${paren(q)} \\cdot ${paren(r)} = ${det}$, so $dx\\,dy = \\frac{1}{${d}}\\,du\\,dv$.`,
                  `$\\frac{\\partial(u, v)}{\\partial(x, y)} = ${p} \\cdot ${s} - ${paren(q)} \\cdot ${paren(r)} = ${det}$，所以 $dx\\,dy = \\frac{1}{${d}}\\,du\\,dv$。`,
                ),
              ],
              [
                ["Compute the area", "计算面积"],
                t(`$\\frac{${U} \\cdot ${V}}{${d}} = ${ans.toLatex()}$.`, `$\\frac{${U} \\cdot ${V}}{${d}} = ${ans.toLatex()}$。`),
              ],
            ],
            t(
              `The sides from the origin end at $\\left(${x1.toLatex()}, ${y1.toLatex()}\\right)$ and $\\left(${x2.toLatex()}, ${y2.toLatex()}\\right)$, and the parallelogram they span has area $\\left|${paren(x1)} \\cdot ${paren(y2)} - ${paren(x2)} \\cdot ${paren(y1)}\\right| = ${ans.toLatex()}$.`,
              `从原点出发的两边终点为 $\\left(${x1.toLatex()}, ${y1.toLatex()}\\right)$ 和 $\\left(${x2.toLatex()}, ${y2.toLatex()}\\right)$，它们张成的平行四边形面积为 $\\left|${paren(x1)} \\cdot ${paren(y2)} - ${paren(x2)} \\cdot ${paren(y1)}\\right| = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** computingDoubleIntegralsUsingAChangeOfVariables applies general changes of variables. */
export const computingDoubleIntegralsUsingAChangeOfVariables: TopicDef = {
  id: "computing-double-integrals-using-a-change-of-variables",
  title: t("Computing Double Integrals Using a Change of Variables", "应用变量代换计算二重积分"),
  summary: t(
    "The change of variables formula $\\iint_R f(x, y)\\,dA = \\iint_G f(x(u, v), y(u, v))\\,|J(u, v)|\\,du\\,dv$ turns a complicated region into a simple one such as a rectangle.",
    "变量代换公式 $\\iint_R f(x, y)\\,dA = \\iint_G f(x(u, v), y(u, v))\\,|J(u, v)|\\,du\\,dv$ 把复杂区域化为矩形等简单区域。",
  ),
  intro: t(
    "Evaluate $\\iint_R (x - y)\\,dA$ over $R = \\{0 \\le x + y \\le 2,\\ 0 \\le x - y \\le 4\\}$. With $u = x + y$ and $v = x - y$ the region is the rectangle $[0, 2] \\times [0, 4]$, the integrand is $v$, and $dA = \\frac{1}{2}\\,du\\,dv$, so the integral is $\\frac{1}{2}\\int_0^4 \\int_0^2 v\\,du\\,dv = \\frac{1}{2} \\cdot 2 \\cdot 8 = 8$.\n\nCheck: $R$ has area $\\frac{2 \\cdot 4}{2} = 4$, and $x - y$ is spread evenly over $[0, 4]$ across it, with average $2$; and $4 \\cdot 2 = 8$.\n\nIn this lesson we evaluate double integrals by changing to coordinates in which the region is a rectangle.",
    "计算 $\\iint_R (x - y)\\,dA$，其中 $R = \\{0 \\le x + y \\le 2,\\ 0 \\le x - y \\le 4\\}$。令 $u = x + y$，$v = x - y$，区域变为矩形 $[0, 2] \\times [0, 4]$，被积函数为 $v$，$dA = \\frac{1}{2}\\,du\\,dv$，所以积分为 $\\frac{1}{2}\\int_0^4 \\int_0^2 v\\,du\\,dv = \\frac{1}{2} \\cdot 2 \\cdot 8 = 8$。\n\n检验：$R$ 的面积为 $\\frac{2 \\cdot 4}{2} = 4$，$x - y$ 在其上均匀分布于 $[0, 4]$，平均值为 $2$；而 $4 \\cdot 2 = 8$。\n\n本课我们换到使区域成为矩形的坐标来计算二重积分。",
  ),
  prerequisites: ["computing-areas-using-a-change-of-variables", "double-integrals-in-plane-polar-coordinates"],
  encompasses: [{ topic: "computing-areas-using-a-change-of-variables", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "integrating-over-parallelograms-via-linear-coordinates",
      figure:
        multivariableDrawings4[
          "computing-double-integrals-using-a-change-of-variables#integrating-over-parallelograms-via-linear-coordinates"
        ],
      title: t("Integrating over parallelograms via linear coordinates", "通过线性坐标代换在平行四边形上积分"),
      explanation: t(
        "New coordinates built from the boundary lines turn the parallelogram into a rectangle, and the Jacobian factor corrects for the change in area. For a region $R$ bounded by $0 \\le x + y \\le U$ and $0 \\le x - y \\le V$, set $u = x + y, v = x - y$. The Jacobian determinant is $\\frac{\\partial(u, v)}{\\partial(x, y)} = -2 \\implies |J(u, v)| = \\frac{1}{2}$. Thus $\\iint_R 1\\,dA = \\frac{UV}{2}$. For $U = 1$ and $V = 20$ the area is $10$.\n\n> **Watch out.** The factor in $dA$ is the reciprocal of $\\left|\\frac{\\partial(u, v)}{\\partial(x, y)}\\right| = 2$, so it is $\\frac{1}{2}$, applied once.",
        "由边界直线构造的新坐标把平行四边形变成矩形，雅可比因子修正面积的变化。对于由 $0 \\le x + y \\le U$ 与 $0 \\le x - y \\le V$ 所围成的平行四边形区域 $R$，令 $u = x + y, v = x - y$。雅可比行列式为 $\\frac{\\partial(u, v)}{\\partial(x, y)} = -2 \\implies |J(u, v)| = \\frac{1}{2}$。故其面积为 $\\iint_R 1\\,dA = \\frac{UV}{2}$。当 $U = 1$，$V = 20$ 时面积为 $10$。\n\n> **注意。** $dA$ 中的因子是 $\\left|\\frac{\\partial(u, v)}{\\partial(x, y)}\\right| = 2$ 的倒数，即 $\\frac{1}{2}$，只乘一次。",
      ),
      generate(rng: Rng): Problem {
        const U = rng.int(2, 12);
        const V = rng.int(2, 12);
        const ans = Q.of(U * V, 2);
        return numberProblem({
          prompt: t(
            `Use the change of variables $u = x + y$ and $v = x - y$ to find the area $\\iint_R 1\\,dA$ of the region $R$ bounded by $x + y = 0$, $x + y = ${U}$, $x - y = 0$, and $x - y = ${V}$.`,
            `利用变量代换 $u = x + y$ 与 $v = x - y$，计算由直线 $x + y = 0$、$x + y = ${U}$、$x - y = 0$ 与 $x - y = ${V}$ 所围成区域 $R$ 的面积 $\\iint_R 1\\,dA$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              U * V,
              "That is the area of the rectangle in the $uv$-plane; the factor $\\frac{1}{2}$ is missing.",
              "那是 $uv$ 平面中矩形的面积；漏了因子 $\\frac{1}{2}$。",
            ),
            why(
              2 * U * V,
              "That multiplies by $2$; the area element is $\\frac{1}{2}\\,du\\,dv$, the reciprocal.",
              "那是乘以 $2$；面积元是 $\\frac{1}{2}\\,du\\,dv$，取倒数。",
            ),
            why(
              Q.of(U * V, 4),
              "The factor $\\frac{1}{2}$ is applied twice; it enters once.",
              "因子 $\\frac{1}{2}$ 用了两次；只应乘一次。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Map the region", "变换区域"],
                t(
                  `In the $uv$-plane $R$ becomes the rectangle $[0, ${U}] \\times [0, ${V}]$.`,
                  `在 $uv$ 平面中 $R$ 变为矩形 $[0, ${U}] \\times [0, ${V}]$。`,
                ),
              ],
              [
                ["Find the Jacobian", "求雅可比行列式"],
                t(
                  "$\\frac{\\partial(u, v)}{\\partial(x, y)} = \\begin{vmatrix} 1 & 1 \\\\ 1 & -1 \\end{vmatrix} = -2$, so $dA = \\frac{1}{2}\\,du\\,dv$.",
                  "$\\frac{\\partial(u, v)}{\\partial(x, y)} = \\begin{vmatrix} 1 & 1 \\\\ 1 & -1 \\end{vmatrix} = -2$，所以 $dA = \\frac{1}{2}\\,du\\,dv$。",
                ),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `$\\frac{1}{2} \\cdot ${U} \\cdot ${V} = ${ans.toLatex()}$.`,
                  `$\\frac{1}{2} \\cdot ${U} \\cdot ${V} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `$R$ is a rectangle in the $xy$-plane, since the lines $x + y = c$ and $x - y = c$ are perpendicular. Its sides are $\\frac{${U}}{\\sqrt{2}}$ and $\\frac{${V}}{\\sqrt{2}}$, so its area is $\\frac{${U * V}}{2} = ${ans.toLatex()}$.`,
              `$R$ 在 $xy$ 平面中是矩形，因为直线 $x + y = c$ 与 $x - y = c$ 互相垂直。它的边长为 $\\frac{${U}}{\\sqrt{2}}$ 和 $\\frac{${V}}{\\sqrt{2}}$，所以面积为 $\\frac{${U * V}}{2} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "integrating-x-plus-y-over-a-rotated-square",
      figure: multivariableDrawings4["computing-double-integrals-using-a-change-of-variables#integrating-x-plus-y-over-a-rotated-square"],
      title: t("Integrating $x + y$ with $u = x + y$, $v = x - y$", "用 $u = x + y$，$v = x - y$ 积分 $x + y$"),
      explanation: t(
        "With $u = x + y$ and $v = x - y$, we have $x = \\frac{u + v}{2}$ and $y = \\frac{u - v}{2}$, so $\\left|\\frac{\\partial(x, y)}{\\partial(u, v)}\\right| = \\frac{1}{2}$ and $dA = \\frac{1}{2}\\,du\\,dv$. The region $0 \\le x + y \\le U$, $0 \\le x - y \\le V$ becomes the rectangle $[0, U] \\times [0, V]$, and the integrand $x + y$ becomes $u$:\n\n$$\\iint_R (x + y)\\,dA = \\frac{1}{2}\\int_0^V \\int_0^U u\\,du\\,dv = \\frac{U^2V}{4}.$$\n\nFor $U = 8$ and $V = 1$ this is $16$.\n\n> **Watch out.** The integrand $x + y$ becomes $u$, not $v$, so it is $U$ that appears squared; and the factor $\\frac{1}{2}$ of $dA$ comes on top of the $\\frac{1}{2}$ from $\\int u\\,du$.",
        "令 $u = x + y$，$v = x - y$，则 $x = \\frac{u + v}{2}$，$y = \\frac{u - v}{2}$，所以 $\\left|\\frac{\\partial(x, y)}{\\partial(u, v)}\\right| = \\frac{1}{2}$，$dA = \\frac{1}{2}\\,du\\,dv$。区域 $0 \\le x + y \\le U$，$0 \\le x - y \\le V$ 变为矩形 $[0, U] \\times [0, V]$，被积函数 $x + y$ 变为 $u$：\n\n$$\\iint_R (x + y)\\,dA = \\frac{1}{2}\\int_0^V \\int_0^U u\\,du\\,dv = \\frac{U^2V}{4}$$\n\n当 $U = 8$，$V = 1$ 时结果为 $16$。\n\n> **注意。** 被积函数 $x + y$ 变为 $u$ 而不是 $v$，所以平方的是 $U$；$dA$ 的因子 $\\frac{1}{2}$ 要和 $\\int u\\,du$ 的 $\\frac{1}{2}$ 一起乘上。",
      ),
      generate(rng: Rng): Problem {
        const U = rng.int(1, 6);
        const V = rng.int(1, 6);
        const ans = Q.of(U * U * V, 4);
        return numberProblem({
          prompt: t(
            `Use $u = x + y$, $v = x - y$ to evaluate $\\iint_R (x + y)\\,dA$, where $R = \\{0 \\le x + y \\le ${U},\\ 0 \\le x - y \\le ${V}\\}$.`,
            `用 $u = x + y$，$v = x - y$ 计算 $\\iint_R (x + y)\\,dA$，其中 $R = \\{0 \\le x + y \\le ${U},\\ 0 \\le x - y \\le ${V}\\}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(Q.of(U * U * V, 2), "The Jacobian factor $\\frac{1}{2}$ of $dA$ is missing.", "漏了 $dA$ 的雅可比因子 $\\frac{1}{2}$。"),
            why(
              U * U * V,
              "Both factors $\\frac{1}{2}$ are missing: the one in $dA$ and the one from $\\int u\\,du$.",
              "两个因子 $\\frac{1}{2}$ 都漏了：$dA$ 中的和 $\\int u\\,du$ 带来的。",
            ),
            why(Q.of(U * V * V, 4), "The integrand $x + y$ becomes $u$, not $v$.", "被积函数 $x + y$ 变为 $u$，不是 $v$。"),
          ]),
          solution: walked(
            [
              [
                ["Change variables", "变量代换"],
                t(
                  `The region becomes $[0, ${U}] \\times [0, ${V}]$, $x + y = u$ and $dA = \\frac{1}{2}\\,du\\,dv$.`,
                  `区域变为 $[0, ${U}] \\times [0, ${V}]$，$x + y = u$，$dA = \\frac{1}{2}\\,du\\,dv$。`,
                ),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `$\\frac{1}{2}\\int_0^{${V}} \\int_0^{${U}} u\\,du\\,dv = \\frac{1}{2} \\cdot \\frac{${U * U}}{2} \\cdot ${V} = ${ans.toLatex()}$.`,
                  `$\\frac{1}{2}\\int_0^{${V}} \\int_0^{${U}} u\\,du\\,dv = \\frac{1}{2} \\cdot \\frac{${U * U}}{2} \\cdot ${V} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `$R$ has area $\\frac{${U * V}}{2}$, and $x + y$ is spread evenly over $[0, ${U}]$ across it, with average $\\frac{${U}}{2}$; the product is $${ans.toLatex()}$.`,
              `$R$ 的面积为 $\\frac{${U * V}}{2}$，$x + y$ 在其上均匀分布于 $[0, ${U}]$，平均值为 $\\frac{${U}}{2}$；两者之积为 $${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 3.17 Change of Variables for Triple Integrals
// ---------------------------------------------------------------------------

/** cylindricalPolarCoordinates converts between Cartesian and cylindrical coordinates. */
export const cylindricalPolarCoordinates: TopicDef = {
  id: "cylindrical-polar-coordinates",
  title: t("Cylindrical Polar Coordinates", "柱面坐标系"),
  summary: t(
    "Cylindrical coordinates represent a 3D point as (r, θ, z), where (r, θ) are plane polar coordinates and z is the vertical height.",
    "柱面坐标系将三维空间点表示为 (r, θ, z)，其中 (r, θ) 为 xy 平面上的极坐标，z 为竖直高度坐标。",
  ),
  intro: t(
    "Convert $(-1, \\sqrt{3}, 4)$ to cylindrical coordinates. The radius is $r = \\sqrt{1 + 3} = 2$. The point $(-1, \\sqrt{3})$ is in the second quadrant with $\\tan\\theta = -\\sqrt{3}$, so $\\theta = \\frac{2\\pi}{3}$. The height stays $z = 4$, giving $\\left(2, \\frac{2\\pi}{3}, 4\\right)$.\n\nCheck: $2\\cos\\frac{2\\pi}{3} = -1$ and $2\\sin\\frac{2\\pi}{3} = \\sqrt{3}$, which recovers the point.\n\nIn this lesson we convert between Cartesian coordinates $(x, y, z)$ and cylindrical coordinates $(r, \\theta, z)$.",
    "把 $(-1, \\sqrt{3}, 4)$ 化为柱坐标。半径为 $r = \\sqrt{1 + 3} = 2$。点 $(-1, \\sqrt{3})$ 在第二象限，$\\tan\\theta = -\\sqrt{3}$，所以 $\\theta = \\frac{2\\pi}{3}$。高度保持 $z = 4$，得 $\\left(2, \\frac{2\\pi}{3}, 4\\right)$。\n\n检验：$2\\cos\\frac{2\\pi}{3} = -1$，$2\\sin\\frac{2\\pi}{3} = \\sqrt{3}$，恢复了原来的点。\n\n本课我们在直角坐标 $(x, y, z)$ 与柱坐标 $(r, \\theta, z)$ 之间相互转换。",
  ),
  prerequisites: ["the-jacobian-of-a-three-dimensional-transformation"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "converting-cartesian-points-to-cylindrical-coordinates",
      figure: multivariableDrawings5["cylindrical-polar-coordinates#converting-cartesian-points-to-cylindrical-coordinates"],
      title: t("Converting Cartesian points to cylindrical coordinates", "将直角坐标转换为柱坐标"),
      explanation: t(
        "Cylindrical coordinates use polar coordinates in the horizontal plane and keep the height unchanged, so find the radius and angle from the first two coordinates. To convert $(x, y, z)$ to cylindrical coordinates $(r, \\theta, z)$, compute $r = \\sqrt{x^2 + y^2}$, $\\tan\\theta = \\frac{y}{x}$, and retain $z$. For $(-6, 8, 3)$ the radius is $\\sqrt{36 + 64} = 10$.\n\n> **Watch out.** $r$ is the distance from the $z$-axis, so it uses only $x$ and $y$; take the square root of $x^2 + y^2$, and do not add the coordinates themselves.",
        "柱坐标在水平面内使用极坐标，高度保持不变，所以由前两个坐标求出半径和角度。将直角坐标 $(x, y, z)$ 转换为柱坐标 $(r, \\theta, z)$：$r = \\sqrt{x^2 + y^2}$，$\\tan\\theta = \\frac{y}{x}$，且 $z$ 坐标保持不变。对 $(-6, 8, 3)$，半径为 $\\sqrt{36 + 64} = 10$。\n\n> **注意。** $r$ 是到 $z$ 轴的距离，所以只用 $x$ 和 $y$；要对 $x^2 + y^2$ 开平方，而不是把坐标本身相加。",
      ),
      generate(rng: Rng): Problem {
        const [a0, b0, c0] = rng.pick(pythagoreanTriples);
        const k = rng.int(1, 3);
        const x = a0 * k;
        const y = b0 * k;
        const r = c0 * k;
        const z = rng.int(-5, 5);
        return numberProblem({
          prompt: t(
            `Find the radial coordinate $r$ in cylindrical coordinates $(r, \\theta, z)$ for the point with Cartesian coordinates $(${x}, ${y}, ${z})$.`,
            `求直角坐标为 $(${x}, ${y}, ${z})$ 的点在柱坐标系 $(r, \\theta, z)$ 下的径向坐标 $r$。`,
          ),
          answer: r,
          mistakes: distinct(r, [
            why(r * r, `That is $x^2 + y^2 = ${r * r}$; take its square root.`, `那是 $x^2 + y^2 = ${r * r}$；还要开平方。`),
            why(
              x + y,
              "That adds the coordinates; the distance from the axis is $\\sqrt{x^2 + y^2}$.",
              "那是把坐标相加；到轴的距离是 $\\sqrt{x^2 + y^2}$。",
            ),
            why(Math.abs(z), "That is the height $|z|$; $r$ is measured in the horizontal plane.", "那是高度 $|z|$；$r$ 在水平面内度量。"),
          ]),
          solution: walked(
            [
              [
                ["Use the horizontal coordinates", "用水平坐标"],
                t("$r = \\sqrt{x^2 + y^2}$; the height $z$ does not enter.", "$r = \\sqrt{x^2 + y^2}$；高度 $z$ 不参与。"),
              ],
              [
                ["Substitute", "代入"],
                t(
                  `$r = \\sqrt{${x * x} + ${y * y}} = \\sqrt{${r * r}} = ${r}$.`,
                  `$r = \\sqrt{${x * x} + ${y * y}} = \\sqrt{${r * r}} = ${r}$。`,
                ),
              ],
            ],
            t(
              `$${r}$ is at least each of $${x}$ and $${y}$, as a hypotenuse must be, and $${x}^2 + ${y}^2 = ${r}^2$.`,
              `$${r}$ 不小于 $${x}$ 和 $${y}$，正如斜边应有的那样，并且 $${x}^2 + ${y}^2 = ${r}^2$。`,
            ),
          ),
        });
      },
    },
    {
      id: "converting-cylindrical-coordinates-to-x",
      figure: multivariableDrawings5["cylindrical-polar-coordinates#converting-cylindrical-coordinates-to-x"],
      title: t("Converting cylindrical coordinates to $x$", "由柱坐标求 $x$"),
      explanation: t(
        "A point with cylindrical coordinates $(r, \\theta, z)$ has Cartesian coordinates $x = r\\cos\\theta$, $y = r\\sin\\theta$ and the same $z$. The value of $\\cos\\theta$ for standard angles such as $\\frac{\\pi}{3}$ or $\\frac{2\\pi}{3}$ gives the $x$-coordinate directly, and its sign follows the quadrant of $\\theta$. For $\\left(4, \\frac{5\\pi}{6}, 1\\right)$, $x = 4\\cos\\frac{5\\pi}{6} = -2\\sqrt{3}$.\n\n> **Watch out.** $\\cos\\theta$ is negative in the second and third quadrants, so $x$ is negative there. And $\\cos\\frac{\\pi}{3} = \\frac{1}{2}$, so $x$ is half of $r$, not $r$ itself.",
        "柱坐标为 $(r, \\theta, z)$ 的点，其直角坐标为 $x = r\\cos\\theta$，$y = r\\sin\\theta$，$z$ 不变。对 $\\frac{\\pi}{3}$、$\\frac{2\\pi}{3}$ 等标准角，$\\cos\\theta$ 的值直接给出 $x$ 坐标，其符号由 $\\theta$ 所在象限决定。对 $\\left(4, \\frac{5\\pi}{6}, 1\\right)$，$x = 4\\cos\\frac{5\\pi}{6} = -2\\sqrt{3}$。\n\n> **注意。** $\\cos\\theta$ 在第二、三象限为负，所以那里 $x$ 为负。$\\cos\\frac{\\pi}{3} = \\frac{1}{2}$，所以 $x$ 是 $r$ 的一半，而不是 $r$ 本身。",
      ),
      generate(rng: Rng): Problem {
        const angles = [
          ["0", 1],
          ["\\frac{\\pi}{3}", 0.5],
          ["\\frac{\\pi}{2}", 0],
          ["\\frac{2\\pi}{3}", -0.5],
          ["\\pi", -1],
          ["\\frac{4\\pi}{3}", -0.5],
          ["\\frac{3\\pi}{2}", 0],
          ["\\frac{5\\pi}{3}", 0.5],
        ] as const;
        const [th, cos] = rng.pick(angles);
        const r = 2 * rng.int(1, 4);
        const z = rng.int(-5, 5);
        const ans = r * cos;
        const cosLatex = cos === 0.5 ? "\\frac{1}{2}" : cos === -0.5 ? "-\\frac{1}{2}" : `${cos}`;
        return numberProblem({
          prompt: t(
            `A point has cylindrical coordinates $(r, \\theta, z) = (${r}, ${th}, ${z})$. Find its $x$-coordinate.`,
            `某点的柱坐标为 $(r, \\theta, z) = (${r}, ${th}, ${z})$。求它的 $x$ 坐标。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            ...(ans === 0 ? [] : [why(-ans, `The sign is wrong: $\\cos ${th} = ${cosLatex}$.`, `符号错了：$\\cos ${th} = ${cosLatex}$。`)]),
            why(
              r,
              `That is $r$ itself; $x = r\\cos\\theta$ with $\\cos ${th} = ${cosLatex}$.`,
              `那是 $r$ 本身；$x = r\\cos\\theta$，且 $\\cos ${th} = ${cosLatex}$。`,
            ),
            why(
              z,
              "That is the height $z$, which is the same in both systems; $x = r\\cos\\theta$.",
              "那是高度 $z$，在两种坐标中相同；$x = r\\cos\\theta$。",
            ),
            why(
              ans === 0 ? r / 2 : ans * 2,
              `$\\cos ${th} = ${cosLatex}$, so $x = ${r} \\cdot ${cosLatex.startsWith("-") ? `\\left(${cosLatex}\\right)` : cosLatex}$.`,
              `$\\cos ${th} = ${cosLatex}$，所以 $x = ${r} \\cdot ${cosLatex.startsWith("-") ? `\\left(${cosLatex}\\right)` : cosLatex}$。`,
            ),
          ]),
          solution: walked(
            [
              [["Use x = r cos θ", "用 x = r cos θ"], t(`$\\cos ${th} = ${cosLatex}$.`, `$\\cos ${th} = ${cosLatex}$。`)],
              [
                ["Multiply", "相乘"],
                t(
                  `$x = ${r} \\cdot ${cosLatex.startsWith("-") ? `\\left(${cosLatex}\\right)` : cosLatex} = ${ans}$.`,
                  `$x = ${r} \\cdot ${cosLatex.startsWith("-") ? `\\left(${cosLatex}\\right)` : cosLatex} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `$|x| = ${Math.abs(ans)}$ is at most $r = ${r}$, and the sign matches the quadrant of $\\theta = ${th}$${ans === 0 ? ", which lies on the $y$-axis" : ""}.`,
              `$|x| = ${Math.abs(ans)}$ 不超过 $r = ${r}$，符号与 $\\theta = ${th}$ 所在象限一致${ans === 0 ? "，该角落在 $y$ 轴上" : ""}。`,
            ),
          ),
        });
      },
    },
  ],
};

/** surfacesInCylindricalPolarCoordinates identifies surfaces described in cylindrical coordinates. */
export const surfacesInCylindricalPolarCoordinates: TopicDef = {
  id: "surfaces-in-cylindrical-polar-coordinates",
  title: t("Surfaces in Cylindrical Polar Coordinates", "柱坐标系中的几何曲面"),
  summary: t(
    "Simple equations in cylindrical coordinates represent basic surfaces: r = c is a cylinder, θ = c is a half-plane, and z = c r is a cone.",
    "柱坐标系下的简单方程表示基本空间曲面：r = c 为圆柱面，θ = c 为半平面，z = c r 为圆锥面。",
  ),
  intro: t(
    "What surface is $r = 4\\sin\\theta$? Multiplying by $r$ gives $r^2 = 4r\\sin\\theta$, that is $x^2 + y^2 = 4y$, and completing the square gives $x^2 + (y - 2)^2 = 4$. Since $z$ is free, this is a circular cylinder of radius $2$ whose axis is the vertical line through $(0, 2)$.\n\nCheck: at $\\theta = \\frac{\\pi}{2}$ the equation gives $r = 4$, the point $(0, 4)$, which is at distance $2$ from $(0, 2)$; at $\\theta = 0$ it gives $r = 0$, the origin, also at distance $2$.\n\nIn this lesson we recognize surfaces given in cylindrical coordinates and write Cartesian surfaces in cylindrical form.",
    "$r = 4\\sin\\theta$ 是什么曲面？两边乘以 $r$ 得 $r^2 = 4r\\sin\\theta$，即 $x^2 + y^2 = 4y$，配方得 $x^2 + (y - 2)^2 = 4$。由于 $z$ 任意，这是半径为 $2$、轴为过 $(0, 2)$ 的竖直直线的圆柱面。\n\n检验：$\\theta = \\frac{\\pi}{2}$ 时 $r = 4$，即点 $(0, 4)$，它到 $(0, 2)$ 的距离为 $2$；$\\theta = 0$ 时 $r = 0$，即原点，到 $(0, 2)$ 的距离也是 $2$。\n\n本课我们识别柱坐标给出的曲面，并把直角坐标曲面写成柱坐标形式。",
  ),
  prerequisites: ["cylindrical-polar-coordinates"],
  encompasses: [{ topic: "cylindrical-polar-coordinates", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "identifying-surfaces-given-in-cylindrical-coordinates",
      figure: multivariableDrawings5["surfaces-in-cylindrical-polar-coordinates#identifying-surfaces-given-in-cylindrical-coordinates"],
      title: t("Identifying surfaces given in cylindrical coordinates", "识别柱坐标方程所表示的曲面"),
      explanation: t(
        "Common cylindrical surfaces:\n- $r = c$ ($c > 0$): Circular cylinder parallel to the $z$-axis.\n- $z = cr$: Circular cone with apex at the origin.\n- $z = cr^2$: Circular paraboloid opening along the $z$-axis.\n- $\\theta = c$: Vertical half-plane passing through the $z$-axis.\n\nFor example $z = 20r^2$ is $z = 20(x^2 + y^2)$, a paraboloid: its slice at height $z$ is a circle of radius $\\sqrt{\\frac{z}{20}}$.\n\n> **Watch out.** $z = cr$, with the first power of $r$, is a cone, and $z = cr^2$ is a paraboloid. An equation that leaves $z$ out, like $r = c$, allows every height, so it is a cylinder and not a sphere.",
        "常见柱坐标曲面：\n- $r = c$（$c > 0$）：母线平行于 $z$ 轴的圆柱面。\n- $z = cr$：顶点位于原点的圆锥面。\n- $z = cr^2$：沿 $z$ 轴开口的旋转抛物面。\n- $\\theta = c$：过 $z$ 轴的垂直半平面。\n\n例如 $z = 20r^2$ 即 $z = 20(x^2 + y^2)$，是抛物面：它在高度 $z$ 处的截面是半径为 $\\sqrt{\\frac{z}{20}}$ 的圆。\n\n> **注意。** $z = cr$（$r$ 的一次方）是圆锥面，$z = cr^2$ 是抛物面。不含 $z$ 的方程如 $r = c$ 允许任意高度，所以是圆柱面而不是球面。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(2, 15);
        const type = rng.int(0, 3);
        const cylinder = t("Circular cylinder", "圆柱面");
        const cone = t("Circular cone", "圆锥面");
        const paraboloid = t("Circular paraboloid", "旋转抛物面");
        const fixesR = t("A cylinder fixes $r$, the distance from the $z$-axis", "圆柱面固定的是 $r$，即到 $z$ 轴的距离");
        const choice =
          type === 0
            ? {
                eq: `r = ${c}`,
                right: cylinder,
                wrong: [
                  {
                    option: cone,
                    why: t(
                      "A cone has $z$ growing with $r$, like $z = cr$; here $z$ does not appear",
                      "圆锥面的 $z$ 随 $r$ 增长，如 $z = cr$；这里没有出现 $z$",
                    ),
                  },
                  {
                    option: paraboloid,
                    why: t("A paraboloid has $z = cr^2$; here $z$ does not appear", "抛物面是 $z = cr^2$；这里没有出现 $z$"),
                  },
                  {
                    option: t("Sphere", "球面"),
                    why: t(
                      `A sphere would be $r^2 + z^2 = ${c * c}$; $r = ${c}$ allows every height $z$`,
                      `球面应为 $r^2 + z^2 = ${c * c}$；$r = ${c}$ 允许任意高度 $z$`,
                    ),
                  },
                ],
                convert: t(`$r = ${c}$ means $x^2 + y^2 = ${c * c}$ with $z$ free.`, `$r = ${c}$ 即 $x^2 + y^2 = ${c * c}$，$z$ 任意。`),
                check: t(
                  `Every horizontal slice is the same circle of radius $${c}$ about the $z$-axis, at every height, which is a cylinder.`,
                  `每个水平截面都是绕 $z$ 轴、半径为 $${c}$ 的同一个圆，各高度都相同，这正是圆柱面。`,
                ),
              }
            : type === 1
              ? {
                  eq: `z = ${c}r`,
                  right: cone,
                  wrong: [
                    { option: cylinder, why: fixesR },
                    {
                      option: paraboloid,
                      why: t(
                        "A paraboloid has $z$ proportional to $r^2$; here it is proportional to $r$",
                        "抛物面的 $z$ 与 $r^2$ 成正比；这里与 $r$ 成正比",
                      ),
                    },
                    {
                      option: t("Plane", "平面"),
                      why: t(
                        `A plane would be like $z = ${c}x$; $z = ${c}\\sqrt{x^2 + y^2}$ is the same in every direction around the $z$-axis`,
                        `平面形如 $z = ${c}x$；$z = ${c}\\sqrt{x^2 + y^2}$ 绕 $z$ 轴各方向都一样`,
                      ),
                    },
                  ],
                  convert: t(
                    `$z = ${c}r$ means $z = ${c}\\sqrt{x^2 + y^2}$, so $z^2 = ${c * c}(x^2 + y^2)$ with $z \\ge 0$.`,
                    `$z = ${c}r$ 即 $z = ${c}\\sqrt{x^2 + y^2}$，所以 $z^2 = ${c * c}(x^2 + y^2)$，$z \\ge 0$。`,
                  ),
                  check: t(
                    `The slice at height $z$ is a circle of radius $\\frac{z}{${c}}$, growing in proportion to $z$ from a point at the origin, which is a cone.`,
                    `高度 $z$ 处的截面是半径为 $\\frac{z}{${c}}$ 的圆，从原点的一个点开始与 $z$ 成正比地增长，这正是圆锥面。`,
                  ),
                }
              : type === 2
                ? {
                    eq: `z = ${c}r^2`,
                    right: paraboloid,
                    wrong: [
                      { option: cylinder, why: fixesR },
                      {
                        option: cone,
                        why: t(
                          "A cone has $z$ proportional to $r$; here it is proportional to $r^2$",
                          "圆锥面的 $z$ 与 $r$ 成正比；这里与 $r^2$ 成正比",
                        ),
                      },
                      {
                        option: t("Hyperboloid", "双曲面"),
                        why: t(
                          "A hyperboloid has $z^2$ and $r^2$ with opposite signs; here $z$ appears to the first power",
                          "双曲面中 $z^2$ 与 $r^2$ 符号相反；这里 $z$ 是一次方",
                        ),
                      },
                    ],
                    convert: t(`$z = ${c}r^2$ means $z = ${c}(x^2 + y^2)$.`, `$z = ${c}r^2$ 即 $z = ${c}(x^2 + y^2)$。`),
                    check: t(
                      `The slice through the axis at $y = 0$ is the parabola $z = ${c}x^2$, and rotating it about the $z$-axis gives a paraboloid.`,
                      `过轴的截面 $y = 0$ 是抛物线 $z = ${c}x^2$，绕 $z$ 轴旋转得到抛物面。`,
                    ),
                  }
                : {
                    eq: `\\theta = \\frac{\\pi}{${c}}`,
                    right: t("Vertical half-plane", "垂直半平面"),
                    wrong: [
                      { option: cylinder, why: t("A cylinder fixes $r$, not the angle $\\theta$", "圆柱面固定的是 $r$，不是角 $\\theta$") },
                      {
                        option: cone,
                        why: t(
                          "A cone fixes the ratio of $z$ to $r$; here $r$ and $z$ are both free",
                          "圆锥面固定的是 $z$ 与 $r$ 之比；这里 $r$ 和 $z$ 都任意",
                        ),
                      },
                      {
                        option: t("Sphere", "球面"),
                        why: t(
                          "A sphere fixes the distance from the origin; here only the direction around the axis is fixed",
                          "球面固定的是到原点的距离；这里只固定了绕轴的方向",
                        ),
                      },
                    ],
                    convert: t(
                      `$\\theta = \\frac{\\pi}{${c}}$ fixes the direction around the $z$-axis, with $r \\ge 0$ and $z$ free.`,
                      `$\\theta = \\frac{\\pi}{${c}}$ 固定了绕 $z$ 轴的方向，$r \\ge 0$，$z$ 任意。`,
                    ),
                    check: t(
                      `The points $\\left(r, \\frac{\\pi}{${c}}, z\\right)$ for all $r \\ge 0$ and all $z$ fill a flat sheet that ends at the $z$-axis, a half-plane; the other half has $\\theta = \\frac{\\pi}{${c}} + \\pi$.`,
                      `所有 $r \\ge 0$、所有 $z$ 的点 $\\left(r, \\frac{\\pi}{${c}}, z\\right)$ 构成止于 $z$ 轴的平面片，即半平面；另一半的 $\\theta = \\frac{\\pi}{${c}} + \\pi$。`,
                    ),
                  };
        return explainedChoice(rng, {
          prompt: t(
            `Identify the geometric surface represented by the cylindrical coordinate equation $${choice.eq}$.`,
            `识别由柱坐标方程 $${choice.eq}$ 所表示的几何曲面。`,
          ),
          correct: choice.right,
          wrong: choice.wrong,
          solution: walked(
            [
              [["Convert to Cartesian form", "化为直角坐标"], choice.convert],
              [
                ["Name the surface", "说出曲面"],
                t(`The surface is a ${choice.right.en.toLowerCase()}.`, `该曲面是${choice.right["zh-CN"]}。`),
              ],
            ],
            choice.check,
          ),
        });
      },
    },
    {
      id: "writing-cartesian-surfaces-in-cylindrical-coordinates",
      figure: multivariableDrawings5["surfaces-in-cylindrical-polar-coordinates#writing-cartesian-surfaces-in-cylindrical-coordinates"],
      title: t("Writing Cartesian surfaces in cylindrical coordinates", "把直角坐标曲面写成柱坐标"),
      explanation: t(
        "To convert a surface to cylindrical coordinates, replace $x^2 + y^2$ by $r^2$ and leave $z$ unchanged. For example, the cylinder $x^2 + y^2 = a^2$ becomes $r = a$, the paraboloid $z = k(x^2 + y^2)$ becomes $z = kr^2$, and the sphere $x^2 + y^2 + z^2 = a^2$ becomes $r^2 + z^2 = a^2$. A cone $z = k\\sqrt{x^2 + y^2}$ becomes $z = kr$, since $r \\ge 0$. So $z = 12\\sqrt{x^2 + y^2}$ becomes $z = 12r$.\n\n> **Watch out.** $x^2 + y^2$ is $r^2$, not $r$, while $\\sqrt{x^2 + y^2}$ is $r$. The variable $z$ is the same in both systems, so it keeps its power.",
        "把曲面化为柱坐标时，用 $r^2$ 替换 $x^2 + y^2$，$z$ 不变。例如圆柱面 $x^2 + y^2 = a^2$ 变为 $r = a$，抛物面 $z = k(x^2 + y^2)$ 变为 $z = kr^2$，球面 $x^2 + y^2 + z^2 = a^2$ 变为 $r^2 + z^2 = a^2$。锥面 $z = k\\sqrt{x^2 + y^2}$ 变为 $z = kr$，因为 $r \\ge 0$。所以 $z = 12\\sqrt{x^2 + y^2}$ 变为 $z = 12r$。\n\n> **注意。** $x^2 + y^2$ 是 $r^2$ 而不是 $r$，$\\sqrt{x^2 + y^2}$ 才是 $r$。$z$ 在两种坐标中相同，次数不变。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 9);
        const kind = rng.int(1, 4);
        const opt = (s: string) => t(`$${s}$`, `$${s}$`);
        const cart = [`x^2 + y^2 = ${a * a}`, `z = ${a}(x^2 + y^2)`, `x^2 + y^2 + z^2 = ${a * a}`, `z = ${a}\\sqrt{x^2 + y^2}`][kind - 1]!;
        const right = [`r = ${a}`, `z = ${a}r^2`, `r^2 + z^2 = ${a * a}`, `z = ${a}r`][kind - 1]!;
        const sq = t("$x^2 + y^2$ is $r^2$, not $r$", "$x^2 + y^2$ 是 $r^2$，不是 $r$");
        const zSame = t("$z$ is the same in both systems, so it is not squared", "$z$ 在两种坐标中相同，不应平方");
        const swap = t("That swaps the roles of $r$ and $z$", "那是把 $r$ 和 $z$ 的角色对调了");
        const table: readonly (readonly (readonly [string, Text])[])[] = [
          [
            [
              `r = ${a * a}`,
              t(`$x^2 + y^2 = r^2$, so $r^2 = ${a * a}$ and $r = ${a}$`, `$x^2 + y^2 = r^2$，所以 $r^2 = ${a * a}$，$r = ${a}$`),
            ],
            [`r^2 = ${a}`, t(`The right side stays $${a * a}$: $r^2 = ${a * a}$`, `右边仍是 $${a * a}$：$r^2 = ${a * a}$`)],
            [
              `\\theta = ${a}`,
              t("$\\theta$ is an angle; the equation fixes the distance from the $z$-axis", "$\\theta$ 是角；方程固定的是到 $z$ 轴的距离"),
            ],
          ],
          [
            [`z = ${a}r`, sq],
            [`z^2 = ${a}r^2`, zSame],
            [`r = ${a}z^2`, swap],
          ],
          [
            [
              `r + z = ${a}`,
              t("The squares stay: $x^2 + y^2$ is $r^2$ and $z^2$ stays $z^2$", "平方不能去掉：$x^2 + y^2$ 是 $r^2$，$z^2$ 仍是 $z^2$"),
            ],
            [`r^2 = ${a * a}`, t("That loses the $z^2$ term, which stays as it is", "那是丢掉了 $z^2$ 项，它应保持不变")],
            [`r^2 + z^2 = ${a}`, t(`The right side stays $${a * a}$`, `右边仍是 $${a * a}$`)],
          ],
          [
            [`z = ${a}r^2`, t("$\\sqrt{x^2 + y^2}$ is $r$, not $r^2$", "$\\sqrt{x^2 + y^2}$ 是 $r$，不是 $r^2$")],
            [`z^2 = ${a}r`, zSame],
            [`r = ${a}z`, swap],
          ],
        ];
        const wrong = table[kind - 1]!;
        const point = [`(${a}, 0, 5)`, `(1, 0, ${a})`, `(${a}, 0, 0)`, `(1, 0, ${a})`][kind - 1]!;
        const cyl = [`r = ${a}`, `r = 1, z = ${a}`, `r = ${a}, z = 0`, `r = 1, z = ${a}`][kind - 1]!;
        return explainedChoice(rng, {
          prompt: t(`Write the surface $${cart}$ in cylindrical coordinates.`, `把曲面 $${cart}$ 写成柱坐标方程。`),
          correct: opt(right),
          wrong: wrong.map(([s, why]) => ({ option: opt(s), why })),
          solution: walked(
            [
              [
                ["Replace x² + y²", "替换 x² + y²"],
                t(
                  "Replace $x^2 + y^2$ by $r^2$ (and $\\sqrt{x^2 + y^2}$ by $r$), and keep $z$.",
                  "用 $r^2$ 替换 $x^2 + y^2$（用 $r$ 替换 $\\sqrt{x^2 + y^2}$），$z$ 保持不变。",
                ),
              ],
              [["Write the equation", "写出方程"], t(`The surface is $${right}$.`, `曲面为 $${right}$。`)],
            ],
            t(
              `The point $${point}$ lies on $${cart}$, and its cylindrical coordinates $${cyl}$ satisfy $${right}$.`,
              `点 $${point}$ 在 $${cart}$ 上，它的柱坐标 $${cyl}$ 满足 $${right}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** sphericalPolarCoordinates converts points between Cartesian and spherical coordinates. */
export const sphericalPolarCoordinates: TopicDef = {
  id: "spherical-polar-coordinates",
  title: t("Spherical Polar Coordinates", "球面坐标系"),
  summary: t(
    "Spherical coordinates describe a 3D point as (ρ, θ, φ), with radial distance ρ, azimuthal angle θ, and polar/colatitude angle φ.",
    "球面坐标系将空间点表示为 (ρ, θ, φ)，其中 ρ 为与原点的距离，θ 为方位角，φ 为极角（余纬角）。",
  ),
  intro: t(
    "Convert $(1, 1, \\sqrt{6})$ to spherical coordinates. The distance from the origin is $\\rho = \\sqrt{1 + 1 + 6} = 2\\sqrt{2}$. The angle from the positive $z$-axis has $\\cos\\varphi = \\frac{\\sqrt{6}}{2\\sqrt{2}} = \\frac{\\sqrt{3}}{2}$, so $\\varphi = \\frac{\\pi}{6}$. The shadow $(1, 1)$ is at angle $\\theta = \\frac{\\pi}{4}$.\n\nCheck: $\\rho\\sin\\varphi\\cos\\theta = 2\\sqrt{2} \\cdot \\frac{1}{2} \\cdot \\frac{\\sqrt{2}}{2} = 1$ and $\\rho\\cos\\varphi = 2\\sqrt{2} \\cdot \\frac{\\sqrt{3}}{2} = \\sqrt{6}$, which recovers $x$ and $z$.\n\nIn this lesson we find the spherical coordinates $(\\rho, \\theta, \\varphi)$ of a point.",
    "把 $(1, 1, \\sqrt{6})$ 化为球坐标。到原点的距离为 $\\rho = \\sqrt{1 + 1 + 6} = 2\\sqrt{2}$。与 $z$ 轴正方向的夹角满足 $\\cos\\varphi = \\frac{\\sqrt{6}}{2\\sqrt{2}} = \\frac{\\sqrt{3}}{2}$，所以 $\\varphi = \\frac{\\pi}{6}$。投影 $(1, 1)$ 的角度为 $\\theta = \\frac{\\pi}{4}$。\n\n检验：$\\rho\\sin\\varphi\\cos\\theta = 2\\sqrt{2} \\cdot \\frac{1}{2} \\cdot \\frac{\\sqrt{2}}{2} = 1$，$\\rho\\cos\\varphi = 2\\sqrt{2} \\cdot \\frac{\\sqrt{3}}{2} = \\sqrt{6}$，恢复了 $x$ 与 $z$。\n\n本课我们求点的球坐标 $(\\rho, \\theta, \\varphi)$。",
  ),
  prerequisites: ["the-jacobian-of-a-three-dimensional-transformation"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "converting-cartesian-points-to-spherical-coordinates",
      figure: multivariableDrawings5["spherical-polar-coordinates#converting-cartesian-points-to-spherical-coordinates"],
      title: t("Converting Cartesian points to spherical coordinates", "将直角坐标转换为球面坐标"),
      explanation: t(
        "For a point $(x, y, z)$, the spherical radial distance is $\\rho = \\sqrt{x^2 + y^2 + z^2}$, the polar angle is $\\cos\\phi = \\frac{z}{\\rho}$, and the azimuthal angle is $\\tan\\theta = \\frac{y}{x}$. For $(2, 10, 11)$, $\\rho = \\sqrt{4 + 100 + 121} = \\sqrt{225} = 15$.\n\n> **Watch out.** $\\rho$ is the distance from the origin, so it uses all three coordinates, while the cylindrical $r$ uses only $x$ and $y$. Square the coordinates before adding, and take the square root at the end.",
        "对于空间点 $(x, y, z)$，其球面径向距离为 $\\rho = \\sqrt{x^2 + y^2 + z^2}$，极角满足 $\\cos\\phi = \\frac{z}{\\rho}$，方位角满足 $\\tan\\theta = \\frac{y}{x}$。对 $(2, 10, 11)$，$\\rho = \\sqrt{4 + 100 + 121} = \\sqrt{225} = 15$。\n\n> **注意。** $\\rho$ 是到原点的距离，用到全部三个坐标，而柱坐标的 $r$ 只用 $x$ 和 $y$。要先平方再相加，最后开平方。",
      ),
      generate(rng: Rng): Problem {
        // Integer sum of three squares
        const triples = [
          [1, 2, 2, 3],
          [2, 3, 6, 7],
          [1, 4, 8, 9],
          [4, 4, 7, 9],
          [2, 6, 9, 11],
          [6, 6, 7, 11],
        ] as const;
        const [a, b, c, rho] = rng.pick(triples);
        const k = rng.int(1, 8);
        const x = a * k;
        const y = b * k;
        const z = c * k;
        const ans = rho * k;
        return numberProblem({
          prompt: t(
            `Find the spherical radial distance $\\rho$ for the point with Cartesian coordinates $(${x}, ${y}, ${z})$.`,
            `求直角坐标为 $(${x}, ${y}, ${z})$ 的点在球面坐标系下的径向距离 $\\rho$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(ans * ans, `That is $\\rho^2 = ${ans * ans}$; take its square root.`, `那是 $\\rho^2 = ${ans * ans}$；还要开平方。`),
            why(
              x + y + z,
              "That adds the coordinates; square them first and take the square root of the sum.",
              "那是把坐标相加；要先平方，再对和开平方。",
            ),
          ]),
          solution: walked(
            [
              [["Use the distance formula", "用距离公式"], t("$\\rho = \\sqrt{x^2 + y^2 + z^2}$.", "$\\rho = \\sqrt{x^2 + y^2 + z^2}$。")],
              [
                ["Substitute", "代入"],
                t(
                  `$\\rho = \\sqrt{${x * x} + ${y * y} + ${z * z}} = \\sqrt{${ans * ans}} = ${ans}$.`,
                  `$\\rho = \\sqrt{${x * x} + ${y * y} + ${z * z}} = \\sqrt{${ans * ans}} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `The point is $${k === 1 ? "" : `${k}`}(${a}, ${b}, ${c})$, and $${a}^2 + ${b}^2 + ${c}^2 = ${rho * rho} = ${rho}^2$, so $\\rho = ${k === 1 ? "" : `${k} \\cdot `}${rho}${k === 1 ? "" : ` = ${ans}`}$.`,
              `该点为 $${k === 1 ? "" : `${k}`}(${a}, ${b}, ${c})$，而 $${a}^2 + ${b}^2 + ${c}^2 = ${rho * rho} = ${rho}^2$，所以 $\\rho = ${k === 1 ? "" : `${k} \\cdot `}${rho}${k === 1 ? "" : ` = ${ans}`}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "finding-the-polar-angle-phi-of-a-point",
      figure: multivariableDrawings5["spherical-polar-coordinates#finding-the-polar-angle-phi-of-a-point"],
      title: t("Finding the angle $\\varphi$ of a point", "求点的极角 $\\varphi$"),
      explanation: t(
        "In spherical coordinates $\\varphi$ is the angle from the positive $z$-axis, with $0 \\le \\varphi \\le \\pi$, and $\\cos\\varphi = \\frac{z}{\\rho}$. A useful shortcut compares $z$ with $r = \\sqrt{x^2 + y^2}$: if $z = r$ then $\\varphi = \\frac{\\pi}{4}$, if $z = 0$ then $\\varphi = \\frac{\\pi}{2}$, and if $z = -r$ then $\\varphi = \\frac{3\\pi}{4}$. For $(1, \\sqrt{3}, -2)$, $r = 2$ and $z = -r$, so $\\varphi = \\frac{3\\pi}{4}$.\n\n> **Watch out.** $\\varphi$ is measured from the positive $z$-axis, not up from the $xy$-plane. A point below the $xy$-plane has $\\varphi > \\frac{\\pi}{2}$, never a negative angle.",
        "在球坐标中，$\\varphi$ 是与 $z$ 轴正方向的夹角，$0 \\le \\varphi \\le \\pi$，且 $\\cos\\varphi = \\frac{z}{\\rho}$。一个实用的捷径是比较 $z$ 与 $r = \\sqrt{x^2 + y^2}$：若 $z = r$ 则 $\\varphi = \\frac{\\pi}{4}$，若 $z = 0$ 则 $\\varphi = \\frac{\\pi}{2}$，若 $z = -r$ 则 $\\varphi = \\frac{3\\pi}{4}$。对 $(1, \\sqrt{3}, -2)$，$r = 2$ 且 $z = -r$，所以 $\\varphi = \\frac{3\\pi}{4}$。\n\n> **注意。** $\\varphi$ 从 $z$ 轴正方向量起，而不是从 $xy$ 平面向上量。位于 $xy$ 平面下方的点 $\\varphi > \\frac{\\pi}{2}$，不会是负角。",
      ),
      generate(rng: Rng): Problem {
        const [a, b, c] = rng.pick(pythagoreanTriples);
        const x = a * rng.pick([-1, 1]);
        const y = b * rng.pick([-1, 1]);
        const kind = rng.int(0, 2);
        const z = [c, 0, -c][kind]!;
        const angles = ["\\frac{\\pi}{4}", "\\frac{\\pi}{2}", "\\frac{3\\pi}{4}"];
        const cosines = ["\\frac{\\sqrt{2}}{2}", "0", "-\\frac{\\sqrt{2}}{2}"];
        const opt = (s: string) => t(`$${s}$`, `$${s}$`);
        const rho = kind === 1 ? `${c}` : `${c}\\sqrt{2}`;
        const needs = [
          t(
            `$\\varphi = \\frac{\\pi}{4}$ needs $z = r = ${c}$; here $z = ${z}$`,
            `$\\varphi = \\frac{\\pi}{4}$ 需要 $z = r = ${c}$；这里 $z = ${z}$`,
          ),
          t(
            `$\\varphi = \\frac{\\pi}{2}$ is the $xy$-plane, where $z = 0$; here $z = ${z}$`,
            `$\\varphi = \\frac{\\pi}{2}$ 是 $xy$ 平面，那里 $z = 0$；这里 $z = ${z}$`,
          ),
          t(
            `$\\varphi = \\frac{3\\pi}{4}$ needs $z = -r = ${-c}$; here $z = ${z}$`,
            `$\\varphi = \\frac{3\\pi}{4}$ 需要 $z = -r = ${-c}$；这里 $z = ${z}$`,
          ),
        ];
        const extra =
          kind === 1
            ? {
                option: opt("\\frac{\\pi}{3}"),
                why: t(
                  "$\\cos\\frac{\\pi}{3} = \\frac{1}{2}$ would need $z = \\frac{\\rho}{2}$; here $z = 0$",
                  "$\\cos\\frac{\\pi}{3} = \\frac{1}{2}$ 需要 $z = \\frac{\\rho}{2}$；这里 $z = 0$",
                ),
              }
            : {
                option: opt("0"),
                why: t("$\\varphi = 0$ is the positive $z$-axis, where $x = y = 0$", "$\\varphi = 0$ 是 $z$ 轴正半轴，那里 $x = y = 0$"),
              };
        return explainedChoice(rng, {
          prompt: t(
            `Find the spherical angle $\\varphi$ of the point $(${x}, ${y}, ${z})$.`,
            `求点 $(${x}, ${y}, ${z})$ 的球坐标角 $\\varphi$。`,
          ),
          correct: opt(angles[kind]!),
          wrong: [...[0, 1, 2].filter((i) => i !== kind).map((i) => ({ option: opt(angles[i]!), why: needs[i]! })), extra],
          solution: walked(
            [
              [
                ["Find r and ρ", "求 r 与 ρ"],
                t(
                  `$r = \\sqrt{${a * a} + ${b * b}} = ${c}$ and $\\rho = \\sqrt{${c * c} + ${z * z}} = ${rho}$.`,
                  `$r = \\sqrt{${a * a} + ${b * b}} = ${c}$，$\\rho = \\sqrt{${c * c} + ${z * z}} = ${rho}$。`,
                ),
              ],
              [
                ["Find φ", "求 φ"],
                t(
                  `$\\cos\\varphi = \\frac{z}{\\rho} = \\frac{${z}}{${rho}} = ${cosines[kind]}$, so $\\varphi = ${angles[kind]}$.`,
                  `$\\cos\\varphi = \\frac{z}{\\rho} = \\frac{${z}}{${rho}} = ${cosines[kind]}$，所以 $\\varphi = ${angles[kind]}$。`,
                ),
              ],
            ],
            t(
              `$\\rho\\cos\\varphi = ${rho} \\cdot ${kind === 2 ? `\\left(${cosines[kind]}\\right)` : cosines[kind]} = ${z}$ recovers $z$, and $\\rho\\sin\\varphi = ${c}$ recovers $r$.`,
              `$\\rho\\cos\\varphi = ${rho} \\cdot ${kind === 2 ? `\\left(${cosines[kind]}\\right)` : cosines[kind]} = ${z}$ 恢复了 $z$，$\\rho\\sin\\varphi = ${c}$ 恢复了 $r$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** surfacesInSphericalPolarCoordinates identifies surfaces described in spherical coordinates. */
export const surfacesInSphericalPolarCoordinates: TopicDef = {
  id: "surfaces-in-spherical-polar-coordinates",
  title: t("Surfaces in Spherical Polar Coordinates", "球面坐标系中的几何曲面"),
  summary: t(
    "In spherical coordinates, ρ = c represents a sphere, φ = c is a cone, and θ = c is a half-plane.",
    "在球面坐标系中，ρ = c 表示球面，φ = c 表示圆锥面，θ = c 表示半平面。",
  ),
  intro: t(
    "What surface is $\\rho\\cos\\varphi = 10$? Since $z = \\rho\\cos\\varphi$, the equation says $z = 10$: a horizontal plane at height $10$.\n\nCheck: along the $z$-axis, $\\varphi = 0$ gives $\\rho = 10$, the point $(0, 0, 10)$; at $\\varphi = \\frac{\\pi}{4}$, $\\rho = 10\\sqrt{2}$ and the height is $10\\sqrt{2} \\cdot \\frac{\\sqrt{2}}{2} = 10$ again.\n\nIn this lesson we recognize the surfaces that simple equations in spherical coordinates describe.",
    "$\\rho\\cos\\varphi = 10$ 是什么曲面？由于 $z = \\rho\\cos\\varphi$，方程就是 $z = 10$：高度为 $10$ 的水平面。\n\n检验：沿 $z$ 轴 $\\varphi = 0$ 时 $\\rho = 10$，即点 $(0, 0, 10)$；$\\varphi = \\frac{\\pi}{4}$ 时 $\\rho = 10\\sqrt{2}$，高度为 $10\\sqrt{2} \\cdot \\frac{\\sqrt{2}}{2} = 10$，仍是 $10$。\n\n本课我们识别球坐标中简单方程所表示的曲面。",
  ),
  prerequisites: ["spherical-polar-coordinates"],
  encompasses: [{ topic: "spherical-polar-coordinates", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "identifying-surfaces-given-in-spherical-coordinates",
      figure: multivariableDrawings5["surfaces-in-spherical-polar-coordinates#identifying-surfaces-given-in-spherical-coordinates"],
      title: t("Identifying surfaces given in spherical coordinates", "识别球面坐标方程所表示的曲面"),
      explanation: t(
        "Standard spherical surfaces:\n- $\\rho = c$ ($c > 0$): Sphere of radius $c$ centered at the origin.\n- $\\phi = c$ ($0 < c < \\pi/2$): Circular cone with opening angle $c$ around the positive $z$-axis.\n- $\\theta = c$: Vertical half-plane.\n\nThe angle $\\phi = \\frac{\\pi}{2}$ is the exception: it is the $xy$-plane. And $\\phi = \\frac{2\\pi}{3}$ is a cone opening downward, around the negative $z$-axis.\n\n> **Watch out.** $\\phi$ is the angle from the $z$-axis, so fixing it gives a cone; $\\theta$ is the angle around the axis, so fixing it gives a half-plane. $\\rho$ is the distance from the origin, not from the axis, so $\\rho = c$ is a sphere and not a cylinder.",
        "常见球面坐标曲面：\n- $\\rho = c$（$c > 0$）：以原点为中心、半径为 $c$ 的球面。\n- $\\phi = c$（$0 < c < \\pi/2$）：以正 $z$ 轴为对称轴、半顶角为 $c$ 的圆锥面。\n- $\\theta = c$：过 $z$ 轴的垂直半平面。\n\n$\\phi = \\frac{\\pi}{2}$ 是例外：它是 $xy$ 平面。而 $\\phi = \\frac{2\\pi}{3}$ 是向下开口、绕 $z$ 轴负半轴的圆锥面。\n\n> **注意。** $\\phi$ 是与 $z$ 轴的夹角，固定它得到圆锥面；$\\theta$ 是绕轴的角，固定它得到半平面。$\\rho$ 是到原点而不是到轴的距离，所以 $\\rho = c$ 是球面而不是圆柱面。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(2, 15);
        const type = rng.int(0, 2);
        const sphere = t("Sphere", "球面");
        const cone = t("Circular cone", "圆锥面");
        const plane = t("Plane", "平面");
        const choice =
          type === 0
            ? {
                eq: `\\rho = ${c}`,
                right: sphere,
                wrong: [
                  {
                    option: cone,
                    why: t(
                      "A cone fixes $\\phi$, the angle from the $z$-axis; here the distance from the origin is fixed",
                      "圆锥面固定的是 $\\phi$，即与 $z$ 轴的夹角；这里固定的是到原点的距离",
                    ),
                  },
                  {
                    option: t("Circular cylinder", "圆柱面"),
                    why: t(
                      "A cylinder fixes the distance from the $z$-axis; $\\rho$ is the distance from the origin",
                      "圆柱面固定的是到 $z$ 轴的距离；$\\rho$ 是到原点的距离",
                    ),
                  },
                  {
                    option: t("Paraboloid", "抛物面"),
                    why: t(
                      "A paraboloid has $z$ to the first power; here every coordinate is squared",
                      "抛物面中 $z$ 是一次方；这里每个坐标都是平方",
                    ),
                  },
                ],
                convert: t(`$\\rho = ${c}$ means $x^2 + y^2 + z^2 = ${c * c}$.`, `$\\rho = ${c}$ 即 $x^2 + y^2 + z^2 = ${c * c}$。`),
                check: t(
                  `The points $(${c}, 0, 0)$, $(0, ${c}, 0)$ and $(0, 0, ${c})$ all lie on it, each at distance $${c}$ from the origin.`,
                  `点 $(${c}, 0, 0)$、$(0, ${c}, 0)$ 和 $(0, 0, ${c})$ 都在其上，到原点的距离都是 $${c}$。`,
                ),
              }
            : type === 1
              ? c === 2
                ? {
                    eq: "\\phi = \\frac{\\pi}{2}",
                    right: plane,
                    wrong: [
                      { option: sphere, why: t("A sphere fixes $\\rho$; here $\\rho$ is free", "球面固定的是 $\\rho$；这里 $\\rho$ 任意") },
                      {
                        option: cone,
                        why: t(
                          "Other values of $\\phi$ give cones, but at $\\frac{\\pi}{2}$ the cone opens out flat",
                          "其他 $\\phi$ 值给出圆锥面，但在 $\\frac{\\pi}{2}$ 处圆锥张开成平面",
                        ),
                      },
                      {
                        option: t("Circular cylinder", "圆柱面"),
                        why: t(
                          "A cylinder fixes the distance from the $z$-axis; here it is free",
                          "圆柱面固定的是到 $z$ 轴的距离；这里它任意",
                        ),
                      },
                    ],
                    convert: t(
                      "$z = \\rho\\cos\\frac{\\pi}{2} = 0$ for every $\\rho$ and $\\theta$.",
                      "对任意 $\\rho$ 与 $\\theta$，$z = \\rho\\cos\\frac{\\pi}{2} = 0$。",
                    ),
                    check: t(
                      "Every ray at right angles to the $z$-axis lies in the $xy$-plane, and together they fill it.",
                      "与 $z$ 轴垂直的每条射线都在 $xy$ 平面内，它们合起来正好填满这个平面。",
                    ),
                  }
                : {
                    eq: `\\phi = \\frac{\\pi}{${c}}`,
                    right: cone,
                    wrong: [
                      {
                        option: sphere,
                        why: t(
                          "A sphere fixes $\\rho$; here $\\rho$ is free along each ray",
                          "球面固定的是 $\\rho$；这里沿每条射线 $\\rho$ 任意",
                        ),
                      },
                      {
                        option: t("Circular cylinder", "圆柱面"),
                        why: t(
                          "A cylinder fixes the distance $\\rho\\sin\\phi$ from the $z$-axis; here it grows with $\\rho$",
                          "圆柱面固定的是到 $z$ 轴的距离 $\\rho\\sin\\phi$；这里它随 $\\rho$ 增长",
                        ),
                      },
                      {
                        option: plane,
                        why: t(
                          "Only $\\phi = \\frac{\\pi}{2}$ is a plane; a smaller angle gives a cone",
                          "只有 $\\phi = \\frac{\\pi}{2}$ 是平面；更小的角给出圆锥面",
                        ),
                      },
                    ],
                    convert: t(
                      `Every point makes the angle $\\frac{\\pi}{${c}}$ with the positive $z$-axis, so $\\frac{r}{z} = \\tan\\frac{\\pi}{${c}}$ is constant.`,
                      `每个点与 $z$ 轴正方向的夹角都是 $\\frac{\\pi}{${c}}$，所以 $\\frac{r}{z} = \\tan\\frac{\\pi}{${c}}$ 为常数。`,
                    ),
                    check: t(
                      `The slice at height $z > 0$ is a circle of radius $z\\tan\\frac{\\pi}{${c}}$, growing in proportion to $z$ from the origin, which is a cone.`,
                      `高度 $z > 0$ 处的截面是半径为 $z\\tan\\frac{\\pi}{${c}}$ 的圆，从原点起与 $z$ 成正比地增长，这正是圆锥面。`,
                    ),
                  }
              : {
                  eq: `\\theta = \\frac{\\pi}{${c}}`,
                  right: t("Vertical half-plane", "垂直半平面"),
                  wrong: [
                    { option: sphere, why: t("A sphere fixes $\\rho$; here $\\rho$ is free", "球面固定的是 $\\rho$；这里 $\\rho$ 任意") },
                    {
                      option: cone,
                      why: t(
                        "A cone fixes $\\phi$, the angle from the $z$-axis; $\\theta$ is the angle around it",
                        "圆锥面固定的是 $\\phi$，即与 $z$ 轴的夹角；$\\theta$ 是绕轴的角",
                      ),
                    },
                    {
                      option: t("Cylinder", "柱面"),
                      why: t("A cylinder fixes the distance from the $z$-axis; here it is free", "柱面固定的是到 $z$ 轴的距离；这里它任意"),
                    },
                  ],
                  convert: t(
                    `$\\theta = \\frac{\\pi}{${c}}$ fixes the direction around the $z$-axis, with $\\rho$ and $\\phi$ free.`,
                    `$\\theta = \\frac{\\pi}{${c}}$ 固定了绕 $z$ 轴的方向，$\\rho$ 与 $\\phi$ 任意。`,
                  ),
                  check: t(
                    "With $\\phi$ running from $0$ to $\\pi$, the points sweep from the positive to the negative $z$-axis on one side only, filling a half-plane bounded by the axis.",
                    "$\\phi$ 从 $0$ 到 $\\pi$，点从 $z$ 轴正半轴扫到负半轴，且只在一侧，填满以该轴为边界的半平面。",
                  ),
                };
        return explainedChoice(rng, {
          prompt: t(
            `Identify the geometric surface represented by the spherical coordinate equation $${choice.eq}$.`,
            `识别由球面坐标方程 $${choice.eq}$ 所表示的几何曲面。`,
          ),
          correct: choice.right,
          wrong: choice.wrong,
          solution: walked(
            [
              [["Read the equation", "解读方程"], choice.convert],
              [
                ["Name the surface", "说出曲面"],
                t(`The surface is a ${choice.right.en.toLowerCase()}.`, `该曲面是${choice.right["zh-CN"]}。`),
              ],
            ],
            choice.check,
          ),
        });
      },
    },
    {
      id: "spheres-through-the-origin-in-spherical-coordinates",
      figure: multivariableDrawings5["surfaces-in-spherical-polar-coordinates#spheres-through-the-origin-in-spherical-coordinates"],
      title: t("Spheres through the origin in spherical coordinates", "球坐标中过原点的球面"),
      explanation: t(
        "Multiplying $\\rho = k\\cos\\varphi$ by $\\rho$ gives $\\rho^2 = k\\rho\\cos\\varphi$, that is $x^2 + y^2 + z^2 = kz$. Completing the square gives $x^2 + y^2 + \\left(z - \\frac{k}{2}\\right)^2 = \\frac{k^2}{4}$, a sphere of radius $\\frac{k}{2}$ through the origin. In the same way $\\rho = k\\sin\\varphi\\cos\\theta$ is $x^2 + y^2 + z^2 = kx$ and $\\rho = k\\sin\\varphi\\sin\\theta$ is $x^2 + y^2 + z^2 = ky$, also spheres of radius $\\frac{k}{2}$. So $\\rho = 30\\sin\\varphi\\cos\\theta$ is a sphere of radius $15$.\n\n> **Watch out.** $k$ is the diameter, the largest value of $\\rho$, not the radius. And the right side of $\\left(z - \\frac{k}{2}\\right)^2 = \\frac{k^2}{4}$ is the square of the radius.",
        "把 $\\rho = k\\cos\\varphi$ 两边乘以 $\\rho$ 得 $\\rho^2 = k\\rho\\cos\\varphi$，即 $x^2 + y^2 + z^2 = kz$。配方得 $x^2 + y^2 + \\left(z - \\frac{k}{2}\\right)^2 = \\frac{k^2}{4}$，是过原点、半径为 $\\frac{k}{2}$ 的球面。同理，$\\rho = k\\sin\\varphi\\cos\\theta$ 即 $x^2 + y^2 + z^2 = kx$，$\\rho = k\\sin\\varphi\\sin\\theta$ 即 $x^2 + y^2 + z^2 = ky$，也都是半径为 $\\frac{k}{2}$ 的球面。所以 $\\rho = 30\\sin\\varphi\\cos\\theta$ 是半径为 $15$ 的球面。\n\n> **注意。** $k$ 是直径，即 $\\rho$ 的最大值，不是半径。$\\left(z - \\frac{k}{2}\\right)^2 = \\frac{k^2}{4}$ 的右边是半径的平方。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(1, 10);
        const kind = rng.int(0, 2);
        const form = ["\\cos\\varphi", "\\sin\\varphi\\cos\\theta", "\\sin\\varphi\\sin\\theta"][kind]!;
        const v = ["z", "x", "y"][kind]!;
        const far = [`(0, 0, ${k})`, `(${k}, 0, 0)`, `(0, ${k}, 0)`][kind]!;
        const ans = Q.of(k, 2);
        const kk = k === 1 ? "" : `${k}`;
        return numberProblem({
          prompt: t(
            `The surface $\\rho = ${kk}${form}$ is a sphere. Find its radius.`,
            `曲面 $\\rho = ${kk}${form}$ 是一个球面。求其半径。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              k,
              `$${k}$ is the diameter, the largest value of $\\rho$; the radius is half of it.`,
              `$${k}$ 是直径，即 $\\rho$ 的最大值；半径是它的一半。`,
            ),
            why(
              Q.of(k * k, 4),
              `$${Q.of(k * k, 4).toLatex()}$ is the square of the radius; take its square root.`,
              `$${Q.of(k * k, 4).toLatex()}$ 是半径的平方；还要开平方。`,
            ),
            why(
              Q.of(k, 4),
              `That halves the radius $${ans.toLatex()}$ again; the radius is $\\frac{${k}}{2}$ itself.`,
              `那是把半径 $${ans.toLatex()}$ 又减半；半径就是 $\\frac{${k}}{2}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Multiply by ρ", "乘以 ρ"],
                t(
                  `$\\rho^2 = ${kk}\\rho${form}$ is $x^2 + y^2 + z^2 = ${kk}${v}$.`,
                  `$\\rho^2 = ${kk}\\rho${form}$ 即 $x^2 + y^2 + z^2 = ${kk}${v}$。`,
                ),
              ],
              [
                ["Complete the square", "配方"],
                t(
                  `$\\left(${v} - ${ans.toLatex()}\\right)^2$ plus the other two squares equals $${Q.of(k * k, 4).toLatex()}$, so the radius is $${ans.toLatex()}$.`,
                  `$\\left(${v} - ${ans.toLatex()}\\right)^2$ 加上另两个平方等于 $${Q.of(k * k, 4).toLatex()}$，所以半径为 $${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The sphere passes through the origin and through $${far}$, the farthest point, at distance $${k}$; these are the two ends of a diameter, so the radius is $${ans.toLatex()}$.`,
              `球面经过原点和最远点 $${far}$，两者相距 $${k}$，是一条直径的两端，所以半径为 $${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** tripleIntegralsInCylindricalPolarCoordinates integrates in cylindrical coordinates. */
export const tripleIntegralsInCylindricalPolarCoordinates: TopicDef = {
  id: "triple-integrals-in-cylindrical-polar-coordinates",
  title: t("Triple Integrals in Cylindrical Polar Coordinates", "柱面坐标系下的三重积分"),
  summary: t(
    "In cylindrical coordinates, the volume element is dV = r dr dθ dz, ideal for solids with axial symmetry.",
    "在柱面坐标系中，体积微元为 dV = r dr dθ dz，非常适合计算具有轴对称性的几何体上的积分。",
  ),
  intro: t(
    "Find the volume of the solid between the paraboloid $z = r^2$ and the plane $z = 4$. Along each vertical line $r^2 \\le z \\le 4$, and the paraboloid meets the plane at $r = 2$, so the volume is $\\int_0^{2\\pi} \\int_0^2 \\int_{r^2}^4 r\\,dz\\,dr\\,d\\theta = 2\\pi \\int_0^2 (4r - r^3)\\,dr = 2\\pi(8 - 4) = 8\\pi$.\n\nCheck: the cylinder $r \\le 2$, $0 \\le z \\le 4$ has volume $16\\pi$, and the solid above a paraboloid fills exactly half of its cylinder, $8\\pi$.\n\nIn this lesson we evaluate triple integrals in cylindrical coordinates, with $dV = r\\,dz\\,dr\\,d\\theta$.",
    "求抛物面 $z = r^2$ 与平面 $z = 4$ 之间立体的体积。沿每条竖直线 $r^2 \\le z \\le 4$，抛物面与平面交于 $r = 2$，所以体积为 $\\int_0^{2\\pi} \\int_0^2 \\int_{r^2}^4 r\\,dz\\,dr\\,d\\theta = 2\\pi \\int_0^2 (4r - r^3)\\,dr = 2\\pi(8 - 4) = 8\\pi$。\n\n检验：圆柱 $r \\le 2$，$0 \\le z \\le 4$ 的体积为 $16\\pi$，而抛物面上方的立体正好占其圆柱的一半，即 $8\\pi$。\n\n本课我们在柱坐标中计算三重积分，$dV = r\\,dz\\,dr\\,d\\theta$。",
  ),
  prerequisites: ["surfaces-in-cylindrical-polar-coordinates", "changing-the-order-of-integration-in-triple-integrals-changing-region"],
  encompasses: [
    {
      topic: "surfaces-in-cylindrical-polar-coordinates",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "volume-of-cylindrical-solid-via-triple-integral",
      figure: multivariableDrawings5["triple-integrals-in-cylindrical-polar-coordinates#volume-of-cylindrical-solid-via-triple-integral"],
      title: t("Volume of cylindrical solid via triple integral", "利用柱坐标三重积分计算圆柱体体积"),
      explanation: t(
        "In cylindrical coordinates a cylinder has constant limits for all three variables, and the extra factor of the radius gives the familiar volume formula. For a cylinder bounded by $r \\le R$ and $0 \\le z \\le H$, the volume divided by $\\pi$ is:\n\n$$\\frac{\\text{Vol}(E)}{\\pi} = \\frac{1}{\\pi}\\int_0^{2\\pi} \\int_0^R \\int_0^H r\\,dz\\,dr\\,d\\theta = R^2 H.$$\n\nFor $x^2 + y^2 \\le 121$ and $0 \\le z \\le 1$ this is $121$.\n\n> **Watch out.** The volume element is $r\\,dz\\,dr\\,d\\theta$: without the factor $r$ the result is wrong. And $\\int_0^R r\\,dr = \\frac{R^2}{2}$, whose $\\frac{1}{2}$ cancels the $2$ of $2\\pi$.",
        "在柱坐标中，圆柱体三个变量的积分限都是常数，多出的半径因子给出熟悉的体积公式。对于由 $r \\le R$ 与 $0 \\le z \\le H$ 所界定的圆柱体，其体积除以 $\\pi$ 为：\n\n$$\\frac{\\text{Vol}(E)}{\\pi} = \\frac{1}{\\pi}\\int_0^{2\\pi} \\int_0^R \\int_0^H r\\,dz\\,dr\\,d\\theta = R^2 H$$\n\n对 $x^2 + y^2 \\le 121$ 与 $0 \\le z \\le 1$，结果为 $121$。\n\n> **注意。** 体积元是 $r\\,dz\\,dr\\,d\\theta$：漏掉因子 $r$ 结果就错了。$\\int_0^R r\\,dr = \\frac{R^2}{2}$，其中的 $\\frac{1}{2}$ 与 $2\\pi$ 的 $2$ 相消。",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(2, 10);
        const H = rng.int(2, 12);
        const ans = R * R * H;
        return numberProblem({
          prompt: t(
            `Use cylindrical coordinates to evaluate $\\frac{1}{\\pi} \\iiint_E 1\\,dV$ for the solid cylinder $E$ bounded by $x^2 + y^2 \\le ${R * R}$ and $0 \\le z \\le ${H}$.`,
            `利用柱坐标系计算实心圆柱体 $E: x^2 + y^2 \\le ${R * R}, 0 \\le z \\le ${H}$ 的体积与 $\\pi$ 的比值 $\\frac{1}{\\pi} \\iiint_E 1\\,dV$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              2 * R * H,
              "That leaves out the factor $r$ of $dV$, integrating $1\\,dr$ instead of $r\\,dr$.",
              "那是漏了 $dV$ 中的因子 $r$，积的是 $1\\,dr$ 而不是 $r\\,dr$。",
            ),
            why(
              2 * ans,
              `$\\int_0^{${R}} r\\,dr = \\frac{${R * R}}{2}$; the $\\frac{1}{2}$ is missing.`,
              `$\\int_0^{${R}} r\\,dr = \\frac{${R * R}}{2}$；漏了 $\\frac{1}{2}$。`,
            ),
            why(
              Q.of(ans, 2),
              "That runs $\\theta$ over $\\pi$ only; a full turn is $2\\pi$.",
              "那是让 $\\theta$ 只走了 $\\pi$；一整圈是 $2\\pi$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Set the limits", "确定积分限"],
                t(
                  `$x^2 + y^2 \\le ${R * R}$ means $0 \\le r \\le ${R}$; also $0 \\le z \\le ${H}$ and $0 \\le \\theta \\le 2\\pi$, with $dV = r\\,dz\\,dr\\,d\\theta$.`,
                  `$x^2 + y^2 \\le ${R * R}$ 即 $0 \\le r \\le ${R}$；另有 $0 \\le z \\le ${H}$，$0 \\le \\theta \\le 2\\pi$，$dV = r\\,dz\\,dr\\,d\\theta$。`,
                ),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `$\\int_0^{2\\pi} d\\theta \\int_0^{${R}} r\\,dr \\int_0^{${H}} dz = 2\\pi \\cdot \\frac{${R * R}}{2} \\cdot ${H} = ${ans}\\pi$, and dividing by $\\pi$ gives $${ans}$.`,
                  `$\\int_0^{2\\pi} d\\theta \\int_0^{${R}} r\\,dr \\int_0^{${H}} dz = 2\\pi \\cdot \\frac{${R * R}}{2} \\cdot ${H} = ${ans}\\pi$，除以 $\\pi$ 得 $${ans}$。`,
                ),
              ],
            ],
            t(
              `A cylinder's volume is base times height: $\\pi \\cdot ${R}^2 \\cdot ${H} = ${ans}\\pi$.`,
              `圆柱体积等于底面积乘高：$\\pi \\cdot ${R}^2 \\cdot ${H} = ${ans}\\pi$。`,
            ),
          ),
        });
      },
    },
    {
      id: "integrating-x-squared-plus-y-squared-over-a-cylinder",
      figure:
        multivariableDrawings5["triple-integrals-in-cylindrical-polar-coordinates#integrating-x-squared-plus-y-squared-over-a-cylinder"],
      title: t("Integrating $x^2 + y^2$ over a cylinder", "在圆柱体上积分 $x^2 + y^2$"),
      explanation: t(
        "In cylindrical coordinates $x^2 + y^2 = r^2$ and $dV = r\\,dz\\,dr\\,d\\theta$. Over the solid cylinder $r \\le R$, $0 \\le z \\le H$:\n\n$$\\iiint_E (x^2 + y^2)\\,dV = \\int_0^{2\\pi} \\int_0^R \\int_0^H r^2 \\cdot r\\,dz\\,dr\\,d\\theta = 2\\pi \\cdot \\frac{R^4}{4} \\cdot H = \\frac{\\pi R^4H}{2}.$$\n\nThis is the moment of inertia of the cylinder about its axis. For $R = 2$ and $H = 10$ it is $80\\pi$.\n\n> **Watch out.** The integrand $r^2$ and the factor $r$ of $dV$ multiply to $r^3$, so the radial integral is $\\frac{R^4}{4}$, not $\\frac{R^3}{3}$.",
        "在柱坐标中 $x^2 + y^2 = r^2$，$dV = r\\,dz\\,dr\\,d\\theta$。在实心圆柱 $r \\le R$，$0 \\le z \\le H$ 上：\n\n$$\\iiint_E (x^2 + y^2)\\,dV = \\int_0^{2\\pi} \\int_0^R \\int_0^H r^2 \\cdot r\\,dz\\,dr\\,d\\theta = 2\\pi \\cdot \\frac{R^4}{4} \\cdot H = \\frac{\\pi R^4H}{2}$$\n\n这就是圆柱体绕其轴的转动惯量。当 $R = 2$，$H = 10$ 时它是 $80\\pi$。\n\n> **注意。** 被积函数 $r^2$ 与 $dV$ 的因子 $r$ 相乘得 $r^3$，所以径向积分是 $\\frac{R^4}{4}$，不是 $\\frac{R^3}{3}$。",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(1, 4);
        const H = rng.int(1, 7);
        const ans = Q.of(R ** 4 * H, 2);
        return numberProblem({
          prompt: t(
            `$E$ is the solid cylinder $x^2 + y^2 \\le ${R * R}$, $0 \\le z \\le ${H}$. Find $\\frac{1}{\\pi}\\iiint_E (x^2 + y^2)\\,dV$.`,
            `$E$ 是实心圆柱 $x^2 + y^2 \\le ${R * R}$，$0 \\le z \\le ${H}$。求 $\\frac{1}{\\pi}\\iiint_E (x^2 + y^2)\\,dV$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(2 * R ** 3 * H, 3),
              "That leaves out the factor $r$ of $dV$, integrating $r^2$ instead of $r^3$.",
              "那是漏了 $dV$ 的因子 $r$，积的是 $r^2$ 而不是 $r^3$。",
            ),
            why(
              R * R * H,
              "That is the volume divided by $\\pi$; the integrand $r^2$ was dropped.",
              "那是体积除以 $\\pi$；丢掉了被积函数 $r^2$。",
            ),
            why(
              Q.of(R ** 4 * H, 4),
              "That runs $\\theta$ over $\\pi$ only; a full turn is $2\\pi$.",
              "那是让 $\\theta$ 只走了 $\\pi$；一整圈是 $2\\pi$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Convert", "化为柱坐标"],
                t(
                  `$x^2 + y^2 = r^2$ and $dV = r\\,dz\\,dr\\,d\\theta$, so the integrand becomes $r^3$ over $0 \\le r \\le ${R}$, $0 \\le z \\le ${H}$.`,
                  `$x^2 + y^2 = r^2$，$dV = r\\,dz\\,dr\\,d\\theta$，所以被积函数变为 $r^3$，范围 $0 \\le r \\le ${R}$，$0 \\le z \\le ${H}$。`,
                ),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `$2\\pi \\cdot \\frac{${R ** 4}}{4} \\cdot ${H}$, and dividing by $\\pi$ gives $${ans.toLatex()}$.`,
                  `$2\\pi \\cdot \\frac{${R ** 4}}{4} \\cdot ${H}$，除以 $\\pi$ 得 $${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The average of $r^2$ over a disk of radius $${R}$ is $\\frac{${R * R}}{2}$, and the cylinder has volume $${R * R * H}\\pi$, so the integral is $\\frac{${R * R}}{2} \\cdot ${R * R * H}\\pi = ${ans.toLatex()}\\pi$.`,
              `$r^2$ 在半径 $${R}$ 的圆盘上的平均值为 $\\frac{${R * R}}{2}$，圆柱体积为 $${R * R * H}\\pi$，所以积分为 $\\frac{${R * R}}{2} \\cdot ${R * R * H}\\pi = ${ans.toLatex()}\\pi$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** tripleIntegralsInSphericalPolarCoordinates integrates in spherical coordinates. */
export const tripleIntegralsInSphericalPolarCoordinates: TopicDef = {
  id: "triple-integrals-in-spherical-polar-coordinates",
  title: t("Triple Integrals in Spherical Polar Coordinates", "球面坐标系下的三重积分"),
  summary: t(
    "In spherical coordinates, dV = ρ² sin φ dρ dφ dθ, greatly simplifying integration over spherical solids and cones.",
    "在球面坐标系中，体积微元为 dV = ρ² sin φ dρ dφ dθ，能极大简化在球体、球壳与圆锥体上的积分计算。",
  ),
  intro: t(
    "Find the volume of the spherical shell $1 \\le \\rho \\le 2$. With $dV = \\rho^2\\sin\\varphi\\,d\\rho\\,d\\varphi\\,d\\theta$ the integral splits into three factors: $\\int_0^{2\\pi} d\\theta \\cdot \\int_0^{\\pi} \\sin\\varphi\\,d\\varphi \\cdot \\int_1^2 \\rho^2\\,d\\rho = 2\\pi \\cdot 2 \\cdot \\frac{8 - 1}{3} = \\frac{28\\pi}{3}$.\n\nCheck: the ball of radius $2$ has volume $\\frac{32\\pi}{3}$ and the ball of radius $1$ has volume $\\frac{4\\pi}{3}$; the shell is the difference, $\\frac{28\\pi}{3}$.\n\nIn this lesson we evaluate triple integrals in spherical coordinates, with $dV = \\rho^2\\sin\\varphi\\,d\\rho\\,d\\varphi\\,d\\theta$.",
    "求球壳 $1 \\le \\rho \\le 2$ 的体积。由 $dV = \\rho^2\\sin\\varphi\\,d\\rho\\,d\\varphi\\,d\\theta$，积分分成三个因子：$\\int_0^{2\\pi} d\\theta \\cdot \\int_0^{\\pi} \\sin\\varphi\\,d\\varphi \\cdot \\int_1^2 \\rho^2\\,d\\rho = 2\\pi \\cdot 2 \\cdot \\frac{8 - 1}{3} = \\frac{28\\pi}{3}$。\n\n检验：半径 $2$ 的球体积为 $\\frac{32\\pi}{3}$，半径 $1$ 的球体积为 $\\frac{4\\pi}{3}$；球壳是两者之差 $\\frac{28\\pi}{3}$。\n\n本课我们在球坐标中计算三重积分，$dV = \\rho^2\\sin\\varphi\\,d\\rho\\,d\\varphi\\,d\\theta$。",
  ),
  prerequisites: ["surfaces-in-spherical-polar-coordinates", "triple-integrals-in-cylindrical-polar-coordinates"],
  encompasses: [
    {
      topic: "surfaces-in-spherical-polar-coordinates",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "volume-of-spherical-ball-via-triple-integral",
      figure: multivariableDrawings5["triple-integrals-in-spherical-polar-coordinates#volume-of-spherical-ball-via-triple-integral"],
      title: t("Volume of spherical ball via triple integral", "利用球面坐标三重积分计算球体体积"),
      explanation: t(
        "In spherical coordinates a ball has constant limits, and the volume element includes the square of the distance times the sine of the polar angle. For a sphere of radius $R$ ($\\rho \\le R$):\n\n$$\\frac{\\text{Vol}(B)}{\\pi} = \\frac{1}{\\pi}\\int_0^{2\\pi} \\int_0^\\pi \\int_0^R \\rho^2\\sin\\phi\\,d\\rho\\,d\\phi\\,d\\theta = \\frac{4}{3}R^3.$$\n\nFor the unit ball the value is $\\frac{4}{3}$.\n\n> **Watch out.** The factor is $\\rho^2$, not $\\rho$, and $\\int_0^R \\rho^2\\,d\\rho = \\frac{R^3}{3}$ keeps its $\\frac{1}{3}$. The angle $\\phi$ runs to $\\pi$, not $\\frac{\\pi}{2}$, which would give only the upper half.",
        "在球坐标中，球体的积分限都是常数，体积微元包含距离的平方乘以极角的正弦。对于半径为 $R$ 的球体（$\\rho \\le R$）：\n\n$$\\frac{\\text{Vol}(B)}{\\pi} = \\frac{1}{\\pi}\\int_0^{2\\pi} \\int_0^\\pi \\int_0^R \\rho^2\\sin\\phi\\,d\\rho\\,d\\phi\\,d\\theta = \\frac{4}{3}R^3$$\n\n对单位球，结果为 $\\frac{4}{3}$。\n\n> **注意。** 因子是 $\\rho^2$ 而不是 $\\rho$，$\\int_0^R \\rho^2\\,d\\rho = \\frac{R^3}{3}$ 要保留 $\\frac{1}{3}$。角 $\\phi$ 要走到 $\\pi$，而不是 $\\frac{\\pi}{2}$，否则只得到上半球。",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(2, 35);
        const ans = Q.of(4 * R * R * R, 3);
        return numberProblem({
          prompt: t(
            `Use spherical coordinates to evaluate $\\frac{1}{\\pi} \\iiint_B 1\\,dV$ for the solid sphere $B: x^2 + y^2 + z^2 \\le ${R * R}$.`,
            `利用球面坐标系计算球体 $B: x^2 + y^2 + z^2 \\le ${R * R}$ 的体积与 $\\pi$ 的比值 $\\frac{1}{\\pi} \\iiint_B 1\\,dV$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              4 * R ** 3,
              `$\\int_0^{${R}} \\rho^2\\,d\\rho = \\frac{${R ** 3}}{3}$; the $\\frac{1}{3}$ is missing.`,
              `$\\int_0^{${R}} \\rho^2\\,d\\rho = \\frac{${R ** 3}}{3}$；漏了 $\\frac{1}{3}$。`,
            ),
            why(2 * R * R, "That uses $\\rho$ in place of $\\rho^2$ in the volume element.", "那是在体积元中用 $\\rho$ 代替了 $\\rho^2$。"),
            why(
              Q.of(2 * R ** 3, 3),
              "That runs $\\phi$ only to $\\frac{\\pi}{2}$, the upper half of the ball.",
              "那是让 $\\phi$ 只走到 $\\frac{\\pi}{2}$，只得上半球。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Set the limits", "确定积分限"],
                t(
                  `$0 \\le \\rho \\le ${R}$, $0 \\le \\phi \\le \\pi$, $0 \\le \\theta \\le 2\\pi$, with $dV = \\rho^2 \\sin\\phi\\,d\\rho\\,d\\phi\\,d\\theta$.`,
                  `$0 \\le \\rho \\le ${R}$，$0 \\le \\phi \\le \\pi$，$0 \\le \\theta \\le 2\\pi$，$dV = \\rho^2 \\sin\\phi\\,d\\rho\\,d\\phi\\,d\\theta$。`,
                ),
              ],
              [
                ["Integrate the three factors", "计算三个因子"],
                t(
                  `$2\\pi \\cdot 2 \\cdot \\frac{${R ** 3}}{3} = ${ans.toLatex()}\\pi$, and dividing by $\\pi$ gives $${ans.toLatex()}$.`,
                  `$2\\pi \\cdot 2 \\cdot \\frac{${R ** 3}}{3} = ${ans.toLatex()}\\pi$，除以 $\\pi$ 得 $${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `This is the familiar $\\frac{4}{3}\\pi R^3$ with $R = ${R}$. It is a little over half of the bounding cube of side $${2 * R}$, as a ball should be: $\\frac{4}{3}\\pi \\div 8 \\approx 0.52$.`,
              `这正是熟悉的 $\\frac{4}{3}\\pi R^3$，$R = ${R}$。它比边长 $${2 * R}$ 的外切立方体的一半略多，球理应如此：$\\frac{4}{3}\\pi \\div 8 \\approx 0.52$。`,
            ),
          ),
        });
      },
    },
    {
      id: "integrating-the-squared-distance-over-a-ball",
      figure: multivariableDrawings5["triple-integrals-in-spherical-polar-coordinates#integrating-the-squared-distance-over-a-ball"],
      title: t("Integrating the squared distance over a ball", "在球体上积分距离的平方"),
      explanation: t(
        "In spherical coordinates $x^2 + y^2 + z^2 = \\rho^2$ and $dV = \\rho^2\\sin\\varphi\\,d\\rho\\,d\\varphi\\,d\\theta$. Over the ball $\\rho \\le R$ the angular integrals give $\\int_0^{2\\pi}\\int_0^{\\pi} \\sin\\varphi\\,d\\varphi\\,d\\theta = 4\\pi$, so\n\n$$\\iiint_B c(x^2 + y^2 + z^2)\\,dV = 4\\pi c\\int_0^R \\rho^4\\,d\\rho = \\frac{4\\pi cR^5}{5}.$$\n\nThe factor $4\\pi$ is the total solid angle around the origin, and the extra $\\rho^2$ from the volume element raises the power of $\\rho$ from $2$ to $4$. For $c = 10$ over the unit ball the integral is $8\\pi$.\n\n> **Watch out.** Keep both factors $\\rho^2$: one from the integrand and one from $dV$. And $\\varphi$ runs to $\\pi$, so the angular integrals give $4\\pi$, not $2\\pi$.",
        "在球坐标中 $x^2 + y^2 + z^2 = \\rho^2$，$dV = \\rho^2\\sin\\varphi\\,d\\rho\\,d\\varphi\\,d\\theta$。在球体 $\\rho \\le R$ 上，角度积分为 $\\int_0^{2\\pi}\\int_0^{\\pi} \\sin\\varphi\\,d\\varphi\\,d\\theta = 4\\pi$，所以\n\n$$\\iiint_B c(x^2 + y^2 + z^2)\\,dV = 4\\pi c\\int_0^R \\rho^4\\,d\\rho = \\frac{4\\pi cR^5}{5}$$\n\n因子 $4\\pi$ 是绕原点的全部立体角，体积元中额外的 $\\rho^2$ 把 $\\rho$ 的次数从 $2$ 提高到 $4$。当 $c = 10$ 时，在单位球上的积分为 $8\\pi$。\n\n> **注意。** 两个 $\\rho^2$ 都要保留：一个来自被积函数，一个来自 $dV$。$\\varphi$ 走到 $\\pi$，所以角度积分是 $4\\pi$，不是 $2\\pi$。",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(1, 5);
        const c = rng.int(1, 6);
        const ans = Q.of(4 * c * R ** 5, 5);
        const cc = c === 1 ? "" : `${c}`;
        return numberProblem({
          prompt: t(
            `$B$ is the ball $x^2 + y^2 + z^2 \\le ${R * R}$. Find $\\frac{1}{\\pi}\\iiint_B ${cc}(x^2 + y^2 + z^2)\\,dV$.`,
            `$B$ 是球体 $x^2 + y^2 + z^2 \\le ${R * R}$。求 $\\frac{1}{\\pi}\\iiint_B ${cc}(x^2 + y^2 + z^2)\\,dV$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(4 * c * R ** 3, 3),
              "That leaves out the $\\rho^2$ of $dV$, integrating $\\rho^2$ instead of $\\rho^4$.",
              "那是漏了 $dV$ 中的 $\\rho^2$，积的是 $\\rho^2$ 而不是 $\\rho^4$。",
            ),
            why(
              c * R ** 4,
              "That uses only one factor $\\rho$ from $dV$, integrating $\\rho^3$; the volume element has $\\rho^2$.",
              "那是只从 $dV$ 取了一个 $\\rho$，积的是 $\\rho^3$；体积元中是 $\\rho^2$。",
            ),
            why(
              Q.of(2 * c * R ** 5, 5),
              "That runs $\\varphi$ only to $\\frac{\\pi}{2}$; over the whole ball the angular integrals give $4\\pi$.",
              "那是让 $\\varphi$ 只走到 $\\frac{\\pi}{2}$；整个球上角度积分是 $4\\pi$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Convert", "化为球坐标"],
                t(
                  `The integrand is $${cc}\\rho^2$ and $dV = \\rho^2\\sin\\varphi\\,d\\rho\\,d\\varphi\\,d\\theta$; the angular integrals give $4\\pi$.`,
                  `被积函数为 $${cc}\\rho^2$，$dV = \\rho^2\\sin\\varphi\\,d\\rho\\,d\\varphi\\,d\\theta$；角度积分为 $4\\pi$。`,
                ),
              ],
              [
                ["Integrate in ρ", "对 ρ 积分"],
                t(
                  `$\\int_0^{${R}} ${cc}\\rho^4\\,d\\rho = \\frac{${c * R ** 5}}{5}$, so the integral is $4\\pi \\cdot \\frac{${c * R ** 5}}{5}$, and dividing by $\\pi$ gives $${ans.toLatex()}$.`,
                  `$\\int_0^{${R}} ${cc}\\rho^4\\,d\\rho = \\frac{${c * R ** 5}}{5}$，所以积分为 $4\\pi \\cdot \\frac{${c * R ** 5}}{5}$，除以 $\\pi$ 得 $${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The average of $\\rho^2$ over a ball of radius $${R}$ is $\\frac{3}{5} \\cdot ${R * R}$, and the ball has volume $${Q.of(4 * R ** 3, 3).toLatex()}\\pi$; so the integral is $${c} \\cdot \\frac{3}{5} \\cdot ${R * R} \\cdot ${Q.of(4 * R ** 3, 3).toLatex()}\\pi = ${ans.toLatex()}\\pi$.`,
              `$\\rho^2$ 在半径 $${R}$ 的球上的平均值为 $\\frac{3}{5} \\cdot ${R * R}$，球的体积为 $${Q.of(4 * R ** 3, 3).toLatex()}\\pi$；所以积分为 $${c} \\cdot \\frac{3}{5} \\cdot ${R * R} \\cdot ${Q.of(4 * R ** 3, 3).toLatex()}\\pi = ${ans.toLatex()}\\pi$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** computingTripleIntegralsUsingAChangeOfVariables applies 3D coordinate transformations. */
export const computingTripleIntegralsUsingAChangeOfVariables: TopicDef = {
  id: "computing-triple-integrals-using-a-change-of-variables",
  title: t("Computing Triple Integrals Using a Change of Variables", "应用变量代换计算三重积分"),
  summary: t(
    "In three dimensions, $\\iiint_E f\\,dV = \\iiint_G f\\,|J(u, v, w)|\\,du\\,dv\\,dw$ turns ellipsoids and other solids into simpler ones.",
    "在三维中，$\\iiint_E f\\,dV = \\iiint_G f\\,|J(u, v, w)|\\,du\\,dv\\,dw$ 把椭球等立体化为较简单的立体。",
  ),
  intro: t(
    "Find the volume of $E = \\{0 \\le x + y \\le 1,\\ 0 \\le y + z \\le 2,\\ 0 \\le z + x \\le 3\\}$. With $u = x + y$, $v = y + z$, $w = z + x$ the solid becomes the box $[0, 1] \\times [0, 2] \\times [0, 3]$ of volume $6$. The Jacobian is $\\frac{\\partial(u, v, w)}{\\partial(x, y, z)} = \\begin{vmatrix} 1 & 1 & 0 \\\\ 0 & 1 & 1 \\\\ 1 & 0 & 1 \\end{vmatrix} = 2$, so $dV = \\frac{1}{2}\\,du\\,dv\\,dw$ and the volume is $3$.\n\nCheck: solving for $x, y, z$, the edges of $E$ from the origin end at $\\left(\\frac{1}{2}, \\frac{1}{2}, -\\frac{1}{2}\\right)$, $(-1, 1, 1)$ and $\\left(\\frac{3}{2}, -\\frac{3}{2}, \\frac{3}{2}\\right)$, and the absolute value of their triple product is $3$.\n\nIn this lesson we evaluate triple integrals by a change of variables that turns the solid into a box or a ball.",
    "求 $E = \\{0 \\le x + y \\le 1,\\ 0 \\le y + z \\le 2,\\ 0 \\le z + x \\le 3\\}$ 的体积。令 $u = x + y$，$v = y + z$，$w = z + x$，立体变为体积为 $6$ 的长方体 $[0, 1] \\times [0, 2] \\times [0, 3]$。雅可比行列式为 $\\frac{\\partial(u, v, w)}{\\partial(x, y, z)} = \\begin{vmatrix} 1 & 1 & 0 \\\\ 0 & 1 & 1 \\\\ 1 & 0 & 1 \\end{vmatrix} = 2$，所以 $dV = \\frac{1}{2}\\,du\\,dv\\,dw$，体积为 $3$。\n\n检验：解出 $x, y, z$，$E$ 从原点出发的三条棱终点为 $\\left(\\frac{1}{2}, \\frac{1}{2}, -\\frac{1}{2}\\right)$、$(-1, 1, 1)$ 和 $\\left(\\frac{3}{2}, -\\frac{3}{2}, \\frac{3}{2}\\right)$，它们的混合积的绝对值为 $3$。\n\n本课我们用把立体变为长方体或球的变量代换来计算三重积分。",
  ),
  prerequisites: ["triple-integrals-in-spherical-polar-coordinates", "computing-double-integrals-using-a-change-of-variables"],
  encompasses: [
    {
      topic: "triple-integrals-in-spherical-polar-coordinates",
      weight: 0.3,
    },
    {
      topic: "computing-double-integrals-using-a-change-of-variables",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "volume-of-ellipsoids-via-scaled-spherical-coordinates",
      title: t("Volume of ellipsoids via scaled spherical coordinates", "通过伸缩坐标代换计算椭球体体积"),
      explanation: t(
        "Scaling each coordinate turns the ellipsoid into a unit ball, so its volume is the volume of the ball times the product of the three scale factors. The ellipsoid $E: \\frac{x^2}{a^2} + \\frac{y^2}{b^2} + \\frac{z^2}{c^2} \\le 1$ transforms to the unit ball under $x = au, y = bv, z = cw$ with Jacobian $J = abc$. The volume is $\\text{Vol}(E) = \\frac{4}{3}\\pi abc$. For $\\frac{x^2}{49} + \\frac{y^2}{4} + z^2 \\le 1$ it is $\\frac{4}{3}\\pi \\cdot 14 = \\frac{56}{3}\\pi$.\n\n> **Watch out.** The scale factors are the semi-axes, the square roots of the denominators, and they multiply. The unit ball has volume $\\frac{4}{3}\\pi$, so keep the $\\frac{4}{3}$.",
        "对每个坐标进行缩放把椭球体变成单位球，所以它的体积等于球的体积乘以三个缩放比例的乘积。作伸缩变换 $x = au, y = bv, z = cw$，椭球体 $E: \\frac{x^2}{a^2} + \\frac{y^2}{b^2} + \\frac{z^2}{c^2} \\le 1$ 转化为单位球体，其雅可比行列式为 $J = abc$。因此椭球体体积为 $\\text{Vol}(E) = \\frac{4}{3}\\pi abc$。对 $\\frac{x^2}{49} + \\frac{y^2}{4} + z^2 \\le 1$，体积为 $\\frac{4}{3}\\pi \\cdot 14 = \\frac{56}{3}\\pi$。\n\n> **注意。** 缩放比例是半轴，即分母的平方根，而且是相乘。单位球的体积是 $\\frac{4}{3}\\pi$，要保留 $\\frac{4}{3}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 6);
        const b = rng.int(2, 6);
        const c = rng.int(2, 6);
        const prod = a * b * c;
        const ans = Q.of(4 * prod, 3);
        return numberProblem({
          prompt: t(
            `Find the value of $\\frac{\\text{Vol}(E)}{\\pi}$ for the solid ellipsoid $E: \\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} + \\frac{z^2}{${c * c}} \\le 1$.`,
            `计算实心椭球体 $E: \\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} + \\frac{z^2}{${c * c}} \\le 1$ 的体积与 $\\pi$ 的比值 $\\frac{\\text{Vol}(E)}{\\pi}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              4 * prod,
              "The unit ball has volume $\\frac{4}{3}\\pi$; the $\\frac{1}{3}$ is missing.",
              "单位球的体积是 $\\frac{4}{3}\\pi$；漏了 $\\frac{1}{3}$。",
            ),
            why(
              Q.of(4 * (a + b + c), 3),
              `That adds the semi-axes; the Jacobian is their product $${a} \\cdot ${b} \\cdot ${c}$.`,
              `那是把半轴相加；雅可比行列式是它们的乘积 $${a} \\cdot ${b} \\cdot ${c}$。`,
            ),
            why(
              Q.of(4 * prod * prod, 3),
              `That uses the denominators $${a * a}$, $${b * b}$ and $${c * c}$; the semi-axes are their square roots.`,
              `那是用了分母 $${a * a}$、$${b * b}$ 和 $${c * c}$；半轴是它们的平方根。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Substitute", "代换"],
                t(
                  `With $x = ${a}u$, $y = ${b}v$, $z = ${c}w$ the ellipsoid becomes the unit ball $u^2 + v^2 + w^2 \\le 1$.`,
                  `令 $x = ${a}u$，$y = ${b}v$，$z = ${c}w$，椭球体变为单位球 $u^2 + v^2 + w^2 \\le 1$。`,
                ),
              ],
              [
                ["Multiply by the Jacobian", "乘以雅可比行列式"],
                t(
                  `$J = ${a} \\cdot ${b} \\cdot ${c} = ${prod}$, so $\\text{Vol}(E) = ${prod} \\cdot \\frac{4}{3}\\pi = ${ans.toLatex()}\\pi$, and dividing by $\\pi$ gives $${ans.toLatex()}$.`,
                  `$J = ${a} \\cdot ${b} \\cdot ${c} = ${prod}$，所以 $\\text{Vol}(E) = ${prod} \\cdot \\frac{4}{3}\\pi = ${ans.toLatex()}\\pi$，除以 $\\pi$ 得 $${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The ellipsoid fits in the box $${2 * a} \\times ${2 * b} \\times ${2 * c}$ of volume $${8 * prod}$, and $${ans.toLatex()}\\pi$ is $\\frac{\\pi}{6}$ of it, the same ratio as a ball to its cube.`,
              `椭球体位于体积为 $${8 * prod}$ 的长方体 $${2 * a} \\times ${2 * b} \\times ${2 * c}$ 内，而 $${ans.toLatex()}\\pi$ 是它的 $\\frac{\\pi}{6}$，与球和外切立方体之比相同。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-volume-of-a-parallelepiped-by-a-linear-change-of-variables",
      figure:
        multivariableDrawings5[
          "computing-triple-integrals-using-a-change-of-variables#the-volume-of-a-parallelepiped-by-a-linear-change-of-variables"
        ],
      title: t("The volume of a parallelepiped by a change of variables", "用变量替换求平行六面体体积"),
      explanation: t(
        "A solid $\\{0 \\le u \\le U,\\ 0 \\le v \\le V,\\ 0 \\le w \\le W\\}$, where $u, v, w$ are linear in $x, y, z$, is a parallelepiped. The substitution maps it to a box of volume $UVW$, and $dV = \\left|\\frac{\\partial(u, v, w)}{\\partial(x, y, z)}\\right|^{-1} du\\,dv\\,dw$. So the volume is $\\frac{UVW}{|J|}$, where $J$ is the determinant of the coefficient matrix. For a triangular coefficient matrix $J$ is the product of the diagonal entries. For $\\{0 \\le 4x + y \\le 2,\\ 0 \\le 5y \\le 5,\\ 0 \\le z \\le 10\\}$, $J = 4 \\cdot 5 \\cdot 1 = 20$ and the volume is $\\frac{100}{20} = 5$.\n\n> **Watch out.** Divide by $|J|$, do not multiply: $J$ measures how $u, v, w$ stretch $x, y, z$. For a triangular matrix $J$ is the product of the diagonal entries, not their sum, and the entries off the diagonal do not matter.",
        "若 $u, v, w$ 是 $x, y, z$ 的线性函数，则立体 $\\{0 \\le u \\le U,\\ 0 \\le v \\le V,\\ 0 \\le w \\le W\\}$ 是平行六面体。替换把它映成体积为 $UVW$ 的长方体，且 $dV = \\left|\\frac{\\partial(u, v, w)}{\\partial(x, y, z)}\\right|^{-1} du\\,dv\\,dw$。所以体积为 $\\frac{UVW}{|J|}$，其中 $J$ 是系数矩阵的行列式。系数矩阵为三角矩阵时，$J$ 等于对角元素之积。对 $\\{0 \\le 4x + y \\le 2,\\ 0 \\le 5y \\le 5,\\ 0 \\le z \\le 10\\}$，$J = 4 \\cdot 5 \\cdot 1 = 20$，体积为 $\\frac{100}{20} = 5$。\n\n> **注意。** 要除以 $|J|$，不是乘：$J$ 衡量 $u, v, w$ 对 $x, y, z$ 的拉伸。三角矩阵的 $J$ 是对角元素之积而不是之和，对角线以外的元素不影响它。",
      ),
      generate(rng: Rng): Problem {
        const d1 = rng.int(1, 3);
        const d2 = rng.int(1, 3);
        const d3 = rng.int(1, 3);
        const p = rng.nonZero(-2, 2);
        const q = rng.int(-2, 2);
        const r = rng.nonZero(-2, 2);
        const U = rng.int(1, 4);
        const V = rng.int(1, 4);
        const W = rng.int(1, 4);
        const J = d1 * d2 * d3;
        const ans = Q.of(U * V * W, J);
        return numberProblem({
          prompt: t(
            `Find the volume of $E = \\{0 \\le ${poly([d1, "x"], [p, "y"], [q, "z"])} \\le ${U},\\ 0 \\le ${poly([d2, "y"], [r, "z"])} \\le ${V},\\ 0 \\le ${poly([d3, "z"])} \\le ${W}\\}$.`,
            `求 $E = \\{0 \\le ${poly([d1, "x"], [p, "y"], [q, "z"])} \\le ${U},\\ 0 \\le ${poly([d2, "y"], [r, "z"])} \\le ${V},\\ 0 \\le ${poly([d3, "z"])} \\le ${W}\\}$ 的体积。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              U * V * W * J,
              `That multiplies by $J = ${J}$; the volume element is $dV = \\frac{1}{${J}}\\,du\\,dv\\,dw$.`,
              `那是乘以 $J = ${J}$；体积元是 $dV = \\frac{1}{${J}}\\,du\\,dv\\,dw$。`,
            ),
            why(
              U * V * W,
              `That is the volume of the box in $uvw$-space; the factor $\\frac{1}{${J}}$ is missing.`,
              `那是 $uvw$ 空间中长方体的体积；漏了因子 $\\frac{1}{${J}}$。`,
            ),
            why(
              Q.of(U * V * W, d1 + d2 + d3),
              "That adds the diagonal entries; the determinant of a triangular matrix is their product.",
              "那是把对角元素相加；三角矩阵的行列式是它们的乘积。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Substitute", "代换"],
                t(
                  `With $u, v, w$ the three expressions, $E$ becomes the box $[0, ${U}] \\times [0, ${V}] \\times [0, ${W}]$ of volume $${U * V * W}$.`,
                  `以三个表达式为 $u, v, w$，$E$ 变为体积为 $${U * V * W}$ 的长方体 $[0, ${U}] \\times [0, ${V}] \\times [0, ${W}]$。`,
                ),
              ],
              [
                ["Find the Jacobian", "求雅可比行列式"],
                t(
                  `The coefficient matrix is triangular, so $J = ${d1} \\cdot ${d2} \\cdot ${d3} = ${J}$ and the volume is $\\frac{${U * V * W}}{${J}} = ${ans.toLatex()}$.`,
                  `系数矩阵为三角矩阵，所以 $J = ${d1} \\cdot ${d2} \\cdot ${d3} = ${J}$，体积为 $\\frac{${U * V * W}}{${J}} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `Slice by $z$: $z$ runs over an interval of length $${Q.of(W, d3).toLatex()}$, and each slice is a parallelogram in $x, y$ of area $\\frac{${U} \\cdot ${V}}{${d1} \\cdot ${d2}}$; the product is $${ans.toLatex()}$.`,
              `按 $z$ 切片：$z$ 的范围长度为 $${Q.of(W, d3).toLatex()}$，每个切片是 $x, y$ 平面中面积为 $\\frac{${U} \\cdot ${V}}{${d1} \\cdot ${d2}}$ 的平行四边形；乘积为 $${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Export all Unit 3 topics
// ---------------------------------------------------------------------------

export const multivariableCalculusMultipleIntegralTopics: readonly TopicDef[] = [
  // 3.13 Riemann Sums
  doubleSummations,
  partitionsOfIntervals,
  calculatingDoubleSummationsOverPartitions,
  approximatingVolumesUsingLowerRiemannSums,
  approximatingVolumesUsingUpperRiemannSums,
  lowerRiemannSumsOverGeneralRectangularPartitions,
  upperRiemannSumsOverGeneralRectangularPartitions,
  definingDoubleIntegralsUsingLowerAndUpperRiemannSums,

  // 3.14 Double Integrals
  doubleIntegralsOverRectangularDomains,
  doubleIntegralsOverNonRectangularDomains,
  propertiesOfDoubleIntegrals,
  typeIAndIiRegionsInTwoDimensionalSpace,
  doubleIntegralsOverTypeIRegions,
  doubleIntegralsOverTypeIiRegions,
  doubleIntegralsOverPartitionedRegions,
  changingTheOrderOfIntegrationInDoubleIntegrals,

  // 3.15 Triple Integrals
  repeatedIntegralsInThreeDimensions,
  tripleIntegralsOverRectangularDomains,
  typeIIiAndIiiRegionsInThreeDimensionalSpace,
  tripleIntegralsOverTypeIRegions,
  tripleIntegralsOverTypeIiRegions,
  tripleIntegralsOverTypeIiiRegions,
  calculatingVolumesOfSolidsUsingTripleIntegrals,
  changingTheOrderOfIntegrationInTripleIntegralsChangingProjection,
  changingTheOrderOfIntegrationInTripleIntegralsChangingRegion,

  // 3.16 Change of Variables for Double Integrals
  doubleIntegralsInPlanePolarCoordinates,
  doubleIntegralsBetweenPolarCurves,
  computingAreasUsingAChangeOfVariables,
  computingDoubleIntegralsUsingAChangeOfVariables,

  // 3.17 Change of Variables for Triple Integrals
  cylindricalPolarCoordinates,
  surfacesInCylindricalPolarCoordinates,
  sphericalPolarCoordinates,
  surfacesInSphericalPolarCoordinates,
  tripleIntegralsInCylindricalPolarCoordinates,
  tripleIntegralsInSphericalPolarCoordinates,
  computingTripleIntegralsUsingAChangeOfVariables,
];
