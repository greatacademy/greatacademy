import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { numberProblem, why } from "../problems.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** distinct drops the mistakes whose value repeats an earlier one. */
const distinct = <M extends { readonly value: unknown }>(ms: readonly M[]): M[] =>
  ms.filter((m, i) => ms.findIndex((o) => String(o.value) === String(m.value)) === i);

/** p wraps a negative number in parentheses. */
const p = (n: number) => (n < 0 ? `(${n})` : `${n}`);

export const mathematicsForMachineLearningPcaTopics: TopicDef[] = [
  // 8.25.1 Introduction to Principal Component Analysis
  {
    id: "introduction-to-principal-component-analysis",
    title: t("Introduction to Principal Component Analysis", "主成分分析引论"),
    summary: t(
      "Principal component analysis (PCA) finds orthogonal directions of maximum variance in high-dimensional data. The total variance of all $d$ features equals the trace of the covariance matrix: $\\operatorname{tr}(S) = \\sum_{i=1}^{d} \\lambda_i$.",
      "主成分分析（PCA）在高维数据中寻找方差最大的正交方向。全部 $d$ 个特征的总方差等于协方差矩阵的迹：$\\operatorname{tr}(S) = \\sum_{i=1}^{d} \\lambda_i$。",
    ),
    prerequisites: ["multiple-linear-regression-with-matrices"],
    encompasses: [],
    xp: 12,
    intro: t(
      "Readings from $4$ sensors have a covariance matrix with eigenvalues $12, 5, 2, 1$. The total variance is $20$, and the first two principal components carry $12 + 5 = 17$ of it, a share of $\\frac{17}{20}$, so two new features keep most of the information in four.\n\nCheck: $12 + 5 + 2 + 1 = 20$, and $\\frac{17}{20} = \\frac{85}{100}$, which is $85\\%$.\n\nIn this lesson we compute the total variance, the share of it that leading components explain, and how many components to keep.",
      "$4$ 个传感器的读数的协方差矩阵有特征值 $12, 5, 2, 1$。总方差为 $20$，前两个主成分承载了其中的 $12 + 5 = 17$，占比 $\\frac{17}{20}$，所以两个新特征就保留了四个特征中的大部分信息。\n\n检验：$12 + 5 + 2 + 1 = 20$，且 $\\frac{17}{20} = \\frac{85}{100}$，即 $85\\%$。\n\n本课我们计算总方差、前几个主成分解释的方差占比，以及应保留几个主成分。",
    ),
    knowledgePoints: [
      {
        id: "evaluating-pca-total-variance",
        title: t("Computing total variance and proportion of variance explained", "计算总方差与方差解释比例"),
        explanation: t(
          "Each principal component carries a share of the total variance equal to its eigenvalue, so the share explained is that eigenvalue divided by the sum of all of them. The total variance is $\\operatorname{Tr}(S) = \\sum_i \\lambda_i$. The proportion of variance explained by the first $k$ components is $\\frac{\\sum_{i=1}^k \\lambda_i}{\\sum_{i=1}^d \\lambda_i}$.\n\nFor example, eigenvalues $30, 15, 5$ give the total variance $50$, and the first component explains $\\frac{30}{50} = \\frac{3}{5}$ of it.\n\nCheck: the three shares $\\frac{30}{50}$, $\\frac{15}{50}$ and $\\frac{5}{50}$ add to $1$.\n\n> **Watch out.** Divide by the sum of all the eigenvalues, not by the sum of the others: $\\frac{30}{15 + 5} = \\frac{3}{2}$ is more than $1$, which no share can be.",
          "每个主成分所承载的方差份额等于它的特征值，所以解释的比例就是该特征值除以所有特征值之和。总方差为 $\\operatorname{Tr}(S) = \\sum_i \\lambda_i$。前 $k$ 个主成分所解释的方差比例为 $\\frac{\\sum_{i=1}^k \\lambda_i}{\\sum_{i=1}^d \\lambda_i}$。\n\n例如，特征值 $30, 15, 5$ 给出总方差 $50$，第一主成分解释了其中的 $\\frac{30}{50} = \\frac{3}{5}$。\n\n检验：三个占比 $\\frac{30}{50}$、$\\frac{15}{50}$、$\\frac{5}{50}$ 之和为 $1$。\n\n> **注意。** 要除以所有特征值之和，而不是其余特征值之和：$\\frac{30}{15 + 5} = \\frac{3}{2}$ 大于 $1$，任何占比都不可能这样。",
        ),
        generate: (rng: Rng): Problem => {
          const kind = rng.int(0, 1);
          if (kind === 0) {
            // Total variance
            const d = rng.int(3, 5);
            const lambdas: number[] = [];
            let total = 0;
            for (let i = 0; i < d; i++) {
              const lam = rng.int(5, 50);
              lambdas.push(lam);
              total += lam;
            }
            lambdas.sort((a, b) => b - a);

            return numberProblem({
              prompt: t(
                `A dataset with $d = ${d}$ features has a sample covariance matrix $S$ with eigenvalues $\\lambda = [${lambdas.join(", ")}]$. Calculate the total variance of the dataset.`,
                `一个具有 $d = ${d}$ 个特征的数据集，其样本协方差矩阵 $S$ 的特征值为 $\\lambda = [${lambdas.join(", ")}]$。计算数据集的总方差。`,
              ),
              answer: total,
              mistakes: distinct([
                why(
                  lambdas[0]!,
                  "That is only the largest eigenvalue, the variance of the first component; the total adds all of them.",
                  "这只是最大的特征值，即第一主成分的方差；总方差要把所有特征值相加。",
                ),
                why(
                  Q.of(total, d),
                  "That is the average eigenvalue; the total variance is their sum, not their mean.",
                  "这是特征值的平均数；总方差是它们的和，而不是平均数。",
                ),
                why(
                  total - lambdas[d - 1]!,
                  `That leaves out the smallest eigenvalue $${lambdas[d - 1]}$; every component's variance counts.`,
                  `这漏掉了最小的特征值 $${lambdas[d - 1]}$；每个主成分的方差都要算进去。`,
                ),
              ]),
              solution: walked(
                [
                  [
                    ["Recall the rule", "回顾规则"],
                    t(
                      "The total variance is the trace of $S$, which equals the sum of its eigenvalues.",
                      "总方差是 $S$ 的迹，它等于 $S$ 的特征值之和。",
                    ),
                  ],
                  [
                    ["Add the eigenvalues", "把特征值相加"],
                    t(
                      `$\\operatorname{Tr}(S) = ${lambdas.join(" + ")} = ${total}$.`,
                      `$\\operatorname{Tr}(S) = ${lambdas.join(" + ")} = ${total}$。`,
                    ),
                  ],
                ],
                t(
                  `The total is larger than every single eigenvalue, the largest being $${lambdas[0]}$.`,
                  `总和大于每一个特征值，其中最大的是 $${lambdas[0]}$。`,
                ),
              ),
            });
          }

          // Proportion of variance explained by first component (as exact rational Q)
          const lam1 = rng.int(12, 60);
          const lam2 = rng.int(4, lam1 - 1);
          const lam3 = rng.int(1, lam2);
          const total = lam1 + lam2 + lam3;
          const prop = Q.of(lam1, total);

          return numberProblem({
            prompt: t(
              `The sample covariance matrix of a 3-dimensional dataset has eigenvalues $\\lambda_1 = ${lam1}$, $\\lambda_2 = ${lam2}$, and $\\lambda_3 = ${lam3}$. What proportion of the total variance is explained by the first principal component? Give your answer as an exact fraction.`,
              `一个 3 维数据集的样本协方差矩阵具有特征值 $\\lambda_1 = ${lam1}$、$\\lambda_2 = ${lam2}$ 和 $\\lambda_3 = ${lam3}$。第一主成分解释了总方差的多少比例？以精确分数作答。`,
            ),
            answer: prop,
            mistakes: distinct([
              why(
                Q.of(lam1, lam2 + lam3),
                "That divides by the other two eigenvalues only; the share divides by the total variance.",
                "这只除以了另外两个特征值；占比要除以总方差。",
              ),
              why(
                Q.of(lam2 + lam3, total),
                "That is the share of the other two components, the part the first one does not explain.",
                "这是另外两个主成分的占比，即第一主成分没有解释的部分。",
              ),
              why(Q.of(1, 3), "That assumes the three components share the variance equally.", "这假设三个主成分平分了方差。"),
            ]),
            solution: walked(
              [
                [
                  ["Find the total variance", "求总方差"],
                  t(
                    `$\\sum_{i=1}^3 \\lambda_i = ${lam1} + ${lam2} + ${lam3} = ${total}$.`,
                    `$\\sum_{i=1}^3 \\lambda_i = ${lam1} + ${lam2} + ${lam3} = ${total}$。`,
                  ),
                ],
                [
                  ["Divide the first eigenvalue", "用第一特征值相除"],
                  t(
                    `The first principal component explains $\\frac{${lam1}}{${total}} = ${prop.toLatex()}$ of the total variance.`,
                    `第一主成分解释了总方差的 $\\frac{${lam1}}{${total}} = ${prop.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `The other two components explain $\\frac{${lam2 + lam3}}{${total}}$, and the two shares add to $1$.`,
                `另外两个主成分解释了 $\\frac{${lam2 + lam3}}{${total}}$，两个占比之和为 $1$。`,
              ),
            ),
          });
        },
      },
      {
        id: "choosing-how-many-components-to-keep",
        title: t("Choosing how many components to keep", "确定保留的主成分个数"),
        explanation: t(
          "A common rule keeps the fewest leading components whose combined share of the variance reaches a target such as $90\\%$. Sort the eigenvalues from largest to smallest, add them up one at a time, and stop as soon as the running total divided by the total variance reaches the target.\n\nFor eigenvalues $50, 30, 12, 5, 3$ (total $100$), the running shares are $50\\%, 80\\%, 92\\%, \\dots$, so $3$ components are needed for $90\\%$ but only $2$ for $80\\%$.\n\nCheck: $50 + 30 + 12 = 92$ reaches $90$, while $50 + 30 = 80$ does not.\n\n> **Watch out.** Stop at the first running share that reaches the target: keeping all $5$ components also passes $90\\%$, but $3$ is the fewest.",
          "常用的规则是：保留最少的前几个主成分，使它们合计的方差占比达到目标，例如 $90\\%$。把特征值从大到小排列，逐个累加，一旦累计和除以总方差达到目标就停止。\n\n对于特征值 $50, 30, 12, 5, 3$（总和 $100$），累计占比为 $50\\%, 80\\%, 92\\%, \\dots$，所以要达到 $90\\%$ 需要 $3$ 个主成分，而 $80\\%$ 只需要 $2$ 个。\n\n检验：$50 + 30 + 12 = 92$ 达到了 $90$，而 $50 + 30 = 80$ 没有达到。\n\n> **注意。** 要在第一个达到目标的累计占比处停止：保留全部 $5$ 个主成分也超过 $90\\%$，但最少只需 $3$ 个。",
        ),
        generate: (rng: Rng): Problem => {
          const d = rng.int(4, 6);
          const lambdas = rng.sample([1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60], d).sort((a, b) => b - a);
          const total = lambdas.reduce((s, v) => s + v, 0);
          const target = rng.pick([70, 80, 90, 95]);
          const running: number[] = [];
          lambdas.forEach((v, i) => {
            running.push((running[i - 1] ?? 0) + v);
          });
          const k = running.findIndex((r) => r * 100 >= target * total) + 1;
          const shares = running
            .slice(0, k)
            .map((r) => `\\frac{${r}}{${total}}`)
            .join(",\\ ");
          const before = k > 1 ? running[k - 2]! : 0;
          const reached = running[k - 1]!;
          return numberProblem({
            prompt: t(
              `The covariance matrix of a dataset with $${d}$ features has eigenvalues $${lambdas.join(", ")}$. What is the smallest number of principal components that together explain at least $${target}\\%$ of the total variance?`,
              `某数据集有 $${d}$ 个特征，其协方差矩阵的特征值为 $${lambdas.join(", ")}$。至少需要几个主成分，才能合计解释不少于 $${target}\\%$ 的总方差？`,
            ),
            answer: k,
            form: "integer",
            mistakes: distinct(
              [
                why(
                  k - 1,
                  `With one component fewer the running share is only $\\frac{${before}}{${total}}$, still below $${target}\\%$.`,
                  `少一个主成分时累计占比只有 $\\frac{${before}}{${total}}$，仍低于 $${target}\\%$。`,
                ),
                why(
                  k + 1,
                  `That keeps one component too many; the first $${k}$ already reach $${target}\\%$.`,
                  `这多保留了一个主成分；前 $${k}$ 个已经达到 $${target}\\%$。`,
                ),
                why(
                  Math.ceil((d * target) / 100),
                  `That keeps $${target}\\%$ of the features rather than $${target}\\%$ of the variance.`,
                  `这是保留了 $${target}\\%$ 的特征个数，而不是 $${target}\\%$ 的方差。`,
                ),
              ].filter((m) => Number(m.value) >= 1 && Number(m.value) <= d),
            ),
            solution: walked(
              [
                [
                  ["Add the eigenvalues in order", "依次累加特征值"],
                  t(
                    `The total variance is $${total}$, and the running shares are $${shares}$.`,
                    `总方差为 $${total}$，累计占比依次为 $${shares}$。`,
                  ),
                ],
                [
                  ["Stop at the target", "在目标处停止"],
                  t(
                    `The first share to reach $${target}\\%$ is that of the first $${k}$ components, so $${k}$ components are needed.`,
                    `第一个达到 $${target}\\%$ 的是前 $${k}$ 个主成分的占比，所以需要 $${k}$ 个主成分。`,
                  ),
                ],
              ],
              k > 1
                ? t(
                    `$${reached}$ out of $${total}$ reaches $${target}\\%$, while $${before}$ out of $${total}$ falls short.`,
                    `$${total}$ 中的 $${reached}$ 达到了 $${target}\\%$，而 $${total}$ 中的 $${before}$ 没有达到。`,
                  )
                : t(
                    `The first eigenvalue alone, $${reached}$ out of $${total}$, already reaches $${target}\\%$.`,
                    `仅第一个特征值，即 $${total}$ 中的 $${reached}$，就已达到 $${target}\\%$。`,
                  ),
            ),
          });
        },
      },
    ],
  },

  // 8.25.2 Computing Principal Components
  {
    id: "computing-principal-components",
    title: t("Computing Principal Components", "计算主成分"),
    summary: t(
      "The principal directions are the unit eigenvectors of the sample covariance matrix $S$, ordered by decreasing eigenvalue $\\lambda_1 \\ge \\lambda_2 \\ge \\cdots \\ge \\lambda_d$.",
      "主成分方向是样本协方差矩阵 $S$ 的单位特征向量，按特征值降序排列：$\\lambda_1 \\ge \\lambda_2 \\ge \\cdots \\ge \\lambda_d$。",
    ),
    prerequisites: ["introduction-to-principal-component-analysis"],
    encompasses: [],
    xp: 12,
    intro: t(
      "The heights and weights of a class have the covariance matrix $S = \\begin{pmatrix} 5 & 2 \\\\ 2 & 2 \\end{pmatrix}$. Its eigenvalues are $6$ and $1$, so the first principal component carries variance $6$, along the eigenvector direction $(2, 1)$.\n\nCheck: $6 + 1 = 7$ is the trace $5 + 2$, and $6 \\times 1 = 6$ is the determinant $5 \\times 2 - 2^2$.\n\nIn this lesson we find the eigenvalues of a $2 \\times 2$ covariance matrix and the direction of its first principal component.",
      "一个班级身高与体重的协方差矩阵为 $S = \\begin{pmatrix} 5 & 2 \\\\ 2 & 2 \\end{pmatrix}$。它的特征值是 $6$ 和 $1$，所以第一主成分的方差为 $6$，方向是特征向量 $(2, 1)$。\n\n检验：$6 + 1 = 7$ 等于迹 $5 + 2$，$6 \\times 1 = 6$ 等于行列式 $5 \\times 2 - 2^2$。\n\n本课我们求 $2 \\times 2$ 协方差矩阵的特征值及其第一主成分的方向。",
    ),
    knowledgePoints: [
      {
        id: "finding-principal-component-eigenvalues",
        title: t("Finding dominant eigenvalues of covariance matrices", "求协方差矩阵的主特征值"),
        explanation: t(
          "For a $2 \\times 2$ covariance matrix $S$, the eigenvalues solve $\\det(S - \\lambda I) = 0$. The first principal component has the larger eigenvalue as its variance: $\\lambda_1 = \\max(\\lambda_1, \\lambda_2)$.\n\nFor example, $S = \\begin{pmatrix} 13 & 4 \\\\ 4 & 7 \\end{pmatrix}$ gives $(13 - \\lambda)(7 - \\lambda) - 16 = \\lambda^2 - 20\\lambda + 75 = (\\lambda - 15)(\\lambda - 5)$, so $\\lambda_1 = 15$ and $\\lambda_2 = 5$.\n\nCheck: $15 + 5 = 20$ is the trace $13 + 7$, and $15 \\times 5 = 75$ is the determinant $91 - 16$.\n\n> **Watch out.** The eigenvalues are not the diagonal entries: the off-diagonal entry $4$ pushes them apart, from $13$ and $7$ out to $15$ and $5$.",
          "对于 $2 \\times 2$ 协方差矩阵 $S$，特征值由 $\\det(S - \\lambda I) = 0$ 确定。第一主成分的方差为较大的特征值 $\\lambda_1 = \\max(\\lambda_1, \\lambda_2)$。\n\n例如，$S = \\begin{pmatrix} 13 & 4 \\\\ 4 & 7 \\end{pmatrix}$ 给出 $(13 - \\lambda)(7 - \\lambda) - 16 = \\lambda^2 - 20\\lambda + 75 = (\\lambda - 15)(\\lambda - 5)$，所以 $\\lambda_1 = 15$，$\\lambda_2 = 5$。\n\n检验：$15 + 5 = 20$ 等于迹 $13 + 7$，$15 \\times 5 = 75$ 等于行列式 $91 - 16$。\n\n> **注意。** 特征值不是对角元素：非对角元素 $4$ 把它们推开，从 $13$ 和 $7$ 变为 $15$ 和 $5$。",
        ),
        generate: (rng: Rng): Problem => {
          // Construct 2x2 symmetric matrix with integer eigenvalues
          const triangles = [
            { s12: 3, k: 8, delta: 10 },
            { s12: 4, k: 6, delta: 10 },
            { s12: 6, k: 5, delta: 13 },
            { s12: 6, k: 16, delta: 20 },
            { s12: 8, k: 12, delta: 20 },
            { s12: 4, k: 15, delta: 17 },
          ];
          const tr = rng.pick(triangles);
          const baseL2 = rng.int(2, 15);
          const actualL1 = baseL2 + tr.delta;
          const actualL2 = baseL2;

          // s11 + s22 = actualL1 + actualL2 = 2*baseL2 + delta
          // s11 - s22 = tr.k
          // 2*s11 = 2*baseL2 + delta + tr.k
          // Since delta and k have same parity in (6,8,10): 10 and 8 are both even!
          // In (12, 5, 13): 13 and 5 are both odd! So delta + k is always even!
          const s11 = baseL2 + Math.floor((tr.delta + tr.k) / 2);
          const s22 = baseL2 + Math.floor((tr.delta - tr.k) / 2);

          const askMax = rng.bool();
          const targetLambda = askMax ? actualL1 : actualL2;
          const det = s11 * s22 - tr.s12 * tr.s12;

          return numberProblem({
            prompt: t(
              `The sample covariance matrix of a 2-dimensional dataset is $S = \\begin{pmatrix} ${s11} & ${tr.s12} \\\\ ${tr.s12} & ${s22} \\end{pmatrix}$. Find the variance $\\lambda_{${askMax ? "1" : "2"}}$ along the ${askMax ? "first (dominant)" : "second"} principal component by calculating the ${askMax ? "larger" : "smaller"} eigenvalue of $S$.`,
              `一个 2 维数据集的样本协方差矩阵为 $S = \\begin{pmatrix} ${s11} & ${tr.s12} \\\\ ${tr.s12} & ${s22} \\end{pmatrix}$。通过计算 $S$ 的${askMax ? "较大" : "较小"}特征值，求${askMax ? "第一（主）" : "第二"}主成分方向上的方差 $\\lambda_{${askMax ? "1" : "2"}}$。`,
            ),
            answer: targetLambda,
            mistakes: distinct([
              why(
                askMax ? actualL2 : actualL1,
                `That is the ${askMax ? "smaller" : "larger"} eigenvalue; the question asks for the ${askMax ? "larger" : "smaller"} one.`,
                `这是${askMax ? "较小" : "较大"}的特征值；题目要的是${askMax ? "较大" : "较小"}的那个。`,
              ),
              why(
                askMax ? s11 : s22,
                "That is a diagonal entry of $S$; the off-diagonal entries move the eigenvalues away from the diagonal.",
                "这是 $S$ 的对角元素；非对角元素会使特征值偏离对角元素。",
              ),
              why(s11 + s22, "That is the trace, the sum of both eigenvalues.", "这是迹，即两个特征值之和。"),
            ]),
            solution: walked(
              [
                [
                  ["Write the characteristic equation", "写出特征方程"],
                  t(
                    `$\\det(S - \\lambda I) = (${s11} - \\lambda)(${s22} - \\lambda) - ${tr.s12}^2 = \\lambda^2 - ${s11 + s22}\\lambda + ${det} = 0$.`,
                    `$\\det(S - \\lambda I) = (${s11} - \\lambda)(${s22} - \\lambda) - ${tr.s12}^2 = \\lambda^2 - ${s11 + s22}\\lambda + ${det} = 0$。`,
                  ),
                ],
                [
                  ["Factor it", "因式分解"],
                  t(
                    `$(\\lambda - ${actualL1})(\\lambda - ${actualL2}) = 0$, so $\\lambda_1 = ${actualL1}$ and $\\lambda_2 = ${actualL2}$. The requested eigenvalue is $${targetLambda}$.`,
                    `$(\\lambda - ${actualL1})(\\lambda - ${actualL2}) = 0$，所以 $\\lambda_1 = ${actualL1}$，$\\lambda_2 = ${actualL2}$。所求特征值为 $${targetLambda}$。`,
                  ),
                ],
              ],
              t(
                `$${actualL1} + ${actualL2} = ${s11 + s22}$ is the trace, and $${actualL1} \\times ${actualL2} = ${det}$ is the determinant.`,
                `$${actualL1} + ${actualL2} = ${s11 + s22}$ 是迹，$${actualL1} \\times ${actualL2} = ${det}$ 是行列式。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-direction-of-the-first-component",
        title: t("Finding the direction of the first principal component", "求第一主成分的方向"),
        explanation: t(
          "Once the largest eigenvalue $\\lambda_1$ is known, its eigenvector gives the direction of the first principal axis. The first row of $(S - \\lambda_1 I)\\mathbf{v} = \\mathbf{0}$ reads $(s_{11} - \\lambda_1)v_1 + s_{12}v_2 = 0$, so the axis has slope\n$$\\frac{v_2}{v_1} = \\frac{\\lambda_1 - s_{11}}{s_{12}}.$$\nFor $S = \\begin{pmatrix} 13 & 4 \\\\ 4 & 7 \\end{pmatrix}$ with $\\lambda_1 = 15$, the slope is $\\frac{15 - 13}{4} = \\frac{1}{2}$: the data spread most along the direction $(2, 1)$.\n\nCheck: $S$ times $(2, 1)$ is $(26 + 4, 8 + 7) = (30, 15)$, which is $15$ times $(2, 1)$.\n\n> **Watch out.** Use the larger eigenvalue: the smaller one, $5$, gives the slope $\\frac{5 - 13}{4} = -2$, the second principal direction, at right angles to the first.",
          "求出最大特征值 $\\lambda_1$ 后，它的特征向量给出第一主轴的方向。方程 $(S - \\lambda_1 I)\\mathbf{v} = \\mathbf{0}$ 的第一行为 $(s_{11} - \\lambda_1)v_1 + s_{12}v_2 = 0$，所以主轴的斜率为\n$$\\frac{v_2}{v_1} = \\frac{\\lambda_1 - s_{11}}{s_{12}}.$$\n对 $S = \\begin{pmatrix} 13 & 4 \\\\ 4 & 7 \\end{pmatrix}$，$\\lambda_1 = 15$，斜率为 $\\frac{15 - 13}{4} = \\frac{1}{2}$：数据沿方向 $(2, 1)$ 分散得最开。\n\n检验：$S$ 乘以 $(2, 1)$ 得 $(26 + 4, 8 + 7) = (30, 15)$，正是 $(2, 1)$ 的 $15$ 倍。\n\n> **注意。** 要用较大的特征值：较小的特征值 $5$ 给出斜率 $\\frac{5 - 13}{4} = -2$，那是与第一主方向垂直的第二主方向。",
        ),
        generate: (rng: Rng): Problem => {
          // s11 - s22 = k and the eigenvalue gap is delta, with s12^2 = (delta^2 - k^2) / 4.
          const tr = rng.pick([
            { s12: 3, k: 8, delta: 10 },
            { s12: 4, k: 6, delta: 10 },
            { s12: 6, k: 5, delta: 13 },
            { s12: 6, k: 16, delta: 20 },
            { s12: 8, k: 12, delta: 20 },
            { s12: 4, k: 15, delta: 17 },
            { s12: 12, k: 10, delta: 26 },
          ]);
          const l2 = rng.int(2, 15);
          const l1 = l2 + tr.delta;
          const swap = rng.bool();
          const big = l2 + (tr.delta + tr.k) / 2;
          const small = l2 + (tr.delta - tr.k) / 2;
          const s11 = swap ? small : big;
          const s22 = swap ? big : small;
          const s12 = rng.pick([1, -1]) * tr.s12;
          const slope = Q.of(l1 - s11, s12);
          return numberProblem({
            prompt: t(
              `The covariance matrix $S = \\begin{pmatrix} ${s11} & ${s12} \\\\ ${s12} & ${s22} \\end{pmatrix}$ has largest eigenvalue $\\lambda_1 = ${l1}$. Find the slope $\\frac{v_2}{v_1}$ of the first principal direction $\\mathbf{v} = (v_1, v_2)$.`,
              `协方差矩阵 $S = \\begin{pmatrix} ${s11} & ${s12} \\\\ ${s12} & ${s22} \\end{pmatrix}$ 的最大特征值为 $\\lambda_1 = ${l1}$。求第一主方向 $\\mathbf{v} = (v_1, v_2)$ 的斜率 $\\frac{v_2}{v_1}$。`,
            ),
            answer: slope,
            form: "fraction",
            mistakes: distinct([
              why(
                Q.of(l2 - s11, s12),
                `That uses the smaller eigenvalue $${l2}$, which gives the second principal direction.`,
                `这用了较小的特征值 $${l2}$，得到的是第二主方向。`,
              ),
              why(
                Q.of(s12, l1 - s11),
                "That is upside down: it is $\\frac{v_1}{v_2}$, not $\\frac{v_2}{v_1}$.",
                "这上下颠倒了：它是 $\\frac{v_1}{v_2}$，而不是 $\\frac{v_2}{v_1}$。",
              ),
              why(
                slope.neg(),
                `That has the wrong sign; moving $${s11} - ${l1}$ across the equation changes its sign.`,
                `这符号错了；把 $${s11} - ${l1}$ 移到等式另一边时要变号。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Write the first row", "写出第一行"],
                  t(
                    `The first row of $(S - ${l1}I)\\mathbf{v} = \\mathbf{0}$ is $(${s11} - ${l1})v_1 + ${p(s12)}v_2 = 0$.`,
                    `$(S - ${l1}I)\\mathbf{v} = \\mathbf{0}$ 的第一行为 $(${s11} - ${l1})v_1 + ${p(s12)}v_2 = 0$。`,
                  ),
                ],
                [
                  ["Solve for the slope", "求斜率"],
                  t(
                    `$\\frac{v_2}{v_1} = \\frac{${l1} - ${s11}}{${s12}} = ${slope.toLatex()}$.`,
                    `$\\frac{v_2}{v_1} = \\frac{${l1} - ${s11}}{${s12}} = ${slope.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `The second row gives the same slope: $\\frac{${s12}}{${l1} - ${s22}} = ${slope.toLatex()}$.`,
                `第二行给出相同的斜率：$\\frac{${s12}}{${l1} - ${s22}} = ${slope.toLatex()}$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 8.25.3 The Connection Between PCA and SVD
  {
    id: "the-connection-between-pca-and-svd",
    title: t("The Connection Between PCA and SVD", "PCA 与 SVD 的联系"),
    summary: t(
      "If the centered $n \\times d$ data matrix has SVD $X_c = U\\Sigma V^T$, the right singular vectors (columns of $V$) are the principal directions, and the covariance eigenvalues are $\\lambda_i = \\frac{\\sigma_i^2}{n - 1}$.",
      "若中心化的 $n \\times d$ 数据矩阵有奇异值分解 $X_c = U\\Sigma V^T$，则右奇异向量（$V$ 的列）就是主成分方向，协方差特征值为 $\\lambda_i = \\frac{\\sigma_i^2}{n - 1}$。",
    ),
    prerequisites: ["computing-principal-components"],
    encompasses: [],
    xp: 12,
    intro: t(
      "A centered data matrix of $n = 11$ readings has largest singular value $\\sigma_1 = 20$. Without forming the covariance matrix at all, the first principal component has variance $\\lambda_1 = \\frac{20^2}{11 - 1} = 40$.\n\nCheck: $40 \\times 10 = 400$, which is $20^2$.\n\nIn this lesson we turn the singular values of centered data into principal component variances and into shares of the total variance.",
      "一个由 $n = 11$ 个读数组成的中心化数据矩阵，最大奇异值为 $\\sigma_1 = 20$。完全不必构造协方差矩阵，第一主成分的方差就是 $\\lambda_1 = \\frac{20^2}{11 - 1} = 40$。\n\n检验：$40 \\times 10 = 400$，正是 $20^2$。\n\n本课我们把中心化数据的奇异值化为主成分的方差，以及总方差中的占比。",
    ),
    knowledgePoints: [
      {
        id: "svd-singular-value-to-pca-variance",
        title: t("Relating singular values of centered data to principal component variances", "由中心化数据的奇异值计算主成分方差"),
        explanation: t(
          "Given the singular value $\\sigma_i$ of the centered $n \\times d$ data matrix $X_c$, the variance along the $i$-th principal component is $\\lambda_i = \\frac{\\sigma_i^2}{n - 1}$.\n\nFor example, with $n = 26$ rows and $\\sigma_1 = 15$, the first component has variance $\\lambda_1 = \\frac{225}{25} = 9$.\n\nCheck: $9 \\times 25 = 225$, which is $15^2$.\n\n> **Watch out.** Square the singular value and divide by $n - 1$, not by $n$: $\\frac{15}{25}$ and $\\frac{225}{26}$ are both wrong.",
          "已知 $n \\times d$ 中心化数据矩阵 $X_c$ 的奇异值 $\\sigma_i$，沿第 $i$ 个主成分的方差为 $\\lambda_i = \\frac{\\sigma_i^2}{n - 1}$。\n\n例如，$n = 26$ 行、$\\sigma_1 = 15$ 时，第一主成分的方差为 $\\lambda_1 = \\frac{225}{25} = 9$。\n\n检验：$9 \\times 25 = 225$，正是 $15^2$。\n\n> **注意。** 要把奇异值平方，再除以 $n - 1$，而不是除以 $n$：$\\frac{15}{25}$ 和 $\\frac{225}{26}$ 都是错的。",
        ),
        generate: (rng: Rng): Problem => {
          const sampleN = rng.int(21, 201);
          const nMinus1 = sampleN - 1;
          const sigma = rng.int(10, 120);
          const sigmaSquared = sigma * sigma;
          const variance = Q.of(sigmaSquared, nMinus1);

          return numberProblem({
            prompt: t(
              `A dataset of $n = ${sampleN}$ observations is centered into a matrix $X_c$. The singular value decomposition $X_c = U \\Sigma V^T$ yields a largest singular value of $\\sigma_1 = ${sigma}$. What is the variance $\\lambda_1$ of the first principal component? Enter your answer as an exact rational number.`,
              `包含 $n = ${sampleN}$ 个观测值的数据集经中心化后得到矩阵 $X_c$。其奇异值分解 $X_c = U \\Sigma V^T$ 求得的最大奇异值为 $\\sigma_1 = ${sigma}$。求第一主成分的方差 $\\lambda_1$（以精确有理数形式作答）。`,
            ),
            answer: variance,
            mistakes: distinct([
              why(
                sigmaSquared,
                `That is $\\sigma_1^2$ before dividing by $n - 1 = ${nMinus1}$.`,
                `这是还没除以 $n - 1 = ${nMinus1}$ 的 $\\sigma_1^2$。`,
              ),
              why(Q.of(sigma, nMinus1), "That divides the singular value without squaring it first.", "这没有先把奇异值平方就做了除法。"),
              why(
                Q.of(sigmaSquared, sampleN),
                `That divides by $n = ${sampleN}$; the sample variance divides by $n - 1 = ${nMinus1}$.`,
                `这除以了 $n = ${sampleN}$；样本方差要除以 $n - 1 = ${nMinus1}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Square the singular value", "把奇异值平方"],
                  t(`$\\sigma_1^2 = ${sigma}^2 = ${sigmaSquared}$.`, `$\\sigma_1^2 = ${sigma}^2 = ${sigmaSquared}$。`),
                ],
                [
                  ["Divide by the degrees of freedom", "除以自由度"],
                  t(
                    `$\\lambda_1 = \\frac{\\sigma_1^2}{n - 1} = \\frac{${sigmaSquared}}{${sampleN} - 1} = \\frac{${sigmaSquared}}{${nMinus1}} = ${variance.toLatex()}$.`,
                    `$\\lambda_1 = \\frac{\\sigma_1^2}{n - 1} = \\frac{${sigmaSquared}}{${sampleN} - 1} = \\frac{${sigmaSquared}}{${nMinus1}} = ${variance.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `$${variance.toLatex()}$ times $${nMinus1}$ gives back $${sigmaSquared}$, which is $${sigma}^2$.`,
                `$${variance.toLatex()}$ 乘以 $${nMinus1}$ 还原为 $${sigmaSquared}$，正是 $${sigma}^2$。`,
              ),
            ),
          });
        },
      },
      {
        id: "variance-shares-from-singular-values",
        title: t("Variance shares from singular values", "由奇异值求方差占比"),
        explanation: t(
          "Each covariance eigenvalue is $\\frac{\\sigma_i^2}{n - 1}$, and the common factor $\\frac{1}{n - 1}$ cancels in a ratio. So the share of variance explained by the first $k$ components can be read straight from the singular values:\n$$\\frac{\\sigma_1^2 + \\cdots + \\sigma_k^2}{\\sigma_1^2 + \\cdots + \\sigma_d^2}.$$\nThe singular values must be squared first: with $\\sigma = (4, 2, 1)$, the first component explains $\\frac{16}{21}$ of the variance, not $\\frac{4}{7}$.\n\nCheck: the squares are $16, 4, 1$, and $16 + 4 + 1 = 21$.\n\n> **Watch out.** Do not divide by $n - 1$ inside a share: the factor is in every eigenvalue and cancels, and dividing by it gives a variance, not a share.",
          "每个协方差特征值都是 $\\frac{\\sigma_i^2}{n - 1}$，而公因子 $\\frac{1}{n - 1}$ 在比值中约去。所以前 $k$ 个主成分解释的方差占比可以直接由奇异值得到：\n$$\\frac{\\sigma_1^2 + \\cdots + \\sigma_k^2}{\\sigma_1^2 + \\cdots + \\sigma_d^2}.$$\n奇异值必须先平方：若 $\\sigma = (4, 2, 1)$，第一主成分解释的方差占比为 $\\frac{16}{21}$，而不是 $\\frac{4}{7}$。\n\n检验：平方依次为 $16, 4, 1$，且 $16 + 4 + 1 = 21$。\n\n> **注意。** 求占比时不要除以 $n - 1$：这个因子在每个特征值里都有，会约去；除以它得到的是方差，而不是占比。",
        ),
        generate: (rng: Rng): Problem => {
          const sigmas = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15], 3).sort((a, b) => b - a);
          const k = rng.int(1, 2);
          const sq = sigmas.map((s) => s * s);
          const total = sq.reduce((s, v) => s + v, 0);
          const top = sq.slice(0, k).reduce((s, v) => s + v, 0);
          const answer = Q.of(top, total);
          const n = rng.int(20, 120);
          const plain = sigmas.slice(0, k).reduce((s, v) => s + v, 0);
          return numberProblem({
            prompt: t(
              `A centered data matrix with $n = ${n}$ rows has singular values $\\sigma_1 = ${sigmas[0]}$, $\\sigma_2 = ${sigmas[1]}$, $\\sigma_3 = ${sigmas[2]}$. What fraction of the total variance ${k === 1 ? "does the first principal component" : "do the first two principal components"} explain?`,
              `一个有 $n = ${n}$ 行的中心化数据矩阵，奇异值为 $\\sigma_1 = ${sigmas[0]}$，$\\sigma_2 = ${sigmas[1]}$，$\\sigma_3 = ${sigmas[2]}$。${k === 1 ? "第一主成分" : "前两个主成分"}解释了总方差的几分之几？`,
            ),
            answer,
            form: "fraction",
            mistakes: distinct([
              why(
                Q.of(
                  plain,
                  sigmas.reduce((s, v) => s + v, 0),
                ),
                "That uses the singular values without squaring them; the variances are the squares.",
                "这直接用了奇异值而没有平方；方差对应的是平方。",
              ),
              why(
                Q.of(top, n - 1),
                `That divides by $n - 1 = ${n - 1}$, which gives a variance rather than a share of the total.`,
                `这除以了 $n - 1 = ${n - 1}$，得到的是方差，而不是总方差中的占比。`,
              ),
              why(
                Q.of(total - top, total),
                "That is the share of the components left out, not of the ones kept.",
                "这是被舍弃的主成分的占比，而不是保留的主成分的占比。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Square the singular values", "把奇异值平方"],
                  t(
                    `The squares are $${sq.join(", ")}$, so the eigenvalues are these divided by $${n - 1}$, a factor that cancels in the share.`,
                    `平方依次为 $${sq.join(", ")}$，特征值是它们除以 $${n - 1}$，这个因子在占比中约去。`,
                  ),
                ],
                [
                  ["Form the share", "求占比"],
                  t(
                    `$\\frac{${sq.slice(0, k).join(" + ")}}{${sq.join(" + ")}} = ${answer.toLatex()}$.`,
                    `$\\frac{${sq.slice(0, k).join(" + ")}}{${sq.join(" + ")}} = ${answer.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `The components left out explain $\\frac{${total - top}}{${total}}$, and the two shares add to $1$.`,
                `被舍弃的主成分解释了 $\\frac{${total - top}}{${total}}$，两个占比之和为 $1$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 8.25.4 Feature Extraction Using PCA
  {
    id: "feature-extraction-using-pca",
    title: t("Feature Extraction Using PCA", "使用 PCA 进行特征提取"),
    summary: t(
      "Projecting a centered point $\\mathbf{x}_c \\in \\mathbb{R}^d$ onto the first principal direction $\\mathbf{v}_1$ gives the score $z_1 = \\mathbf{v}_1^T\\mathbf{x}_c$. With $k$ components, $\\mathbf{z} = V_k^T\\mathbf{x}_c$ reduces the dimension from $d$ to $k$.",
      "把中心化数据点 $\\mathbf{x}_c \\in \\mathbb{R}^d$ 投影到第一主成分方向 $\\mathbf{v}_1$ 上，得到得分 $z_1 = \\mathbf{v}_1^T\\mathbf{x}_c$。取 $k$ 个主成分时，$\\mathbf{z} = V_k^T\\mathbf{x}_c$ 把维数从 $d$ 降到 $k$。",
    ),
    prerequisites: ["the-connection-between-pca-and-svd"],
    encompasses: [],
    xp: 12,
    intro: t(
      "A centered point with two features, $\\mathbf{x}_c = (5, 10)$, is compressed onto the first principal direction $\\mathbf{v}_1 = (\\frac{3}{5}, \\frac{4}{5})$. Its score is $z_1 = 3 + 8 = 11$, one number in place of two.\n\nCheck: $\\frac{3}{5} \\times 5 = 3$ and $\\frac{4}{5} \\times 10 = 8$.\n\nIn this lesson we compute principal component scores and the squared error of rebuilding a point from its first score alone.",
      "一个有两个特征的中心化数据点 $\\mathbf{x}_c = (5, 10)$ 被压缩到第一主方向 $\\mathbf{v}_1 = (\\frac{3}{5}, \\frac{4}{5})$ 上。它的得分是 $z_1 = 3 + 8 = 11$，用一个数代替了两个数。\n\n检验：$\\frac{3}{5} \\times 5 = 3$，$\\frac{4}{5} \\times 10 = 8$。\n\n本课我们计算主成分得分，以及只用第一得分重构数据点时的平方误差。",
    ),
    knowledgePoints: [
      {
        id: "computing-principal-component-scores",
        title: t("Computing principal component projection scores", "计算主成分投影得分"),
        explanation: t(
          "A principal component score is the coordinate of a centered data point along the component direction, found by a dot product with the unit eigenvector. $z_1 = \\mathbf{v}_1^T \\mathbf{x}_c = \\sum_{i=1}^d v_{1i} x_{ci}$. The projected score $z_1$ is the coordinate along the first principal axis.\n\nFor example, with $\\mathbf{v}_1 = (\\frac{3}{5}, \\frac{4}{5})$ and $\\mathbf{x}_c = (5, -5)$, $z_1 = \\frac{15 - 20}{5} = -1$.\n\nCheck: $\\frac{3}{5} \\times 5 = 3$ and $\\frac{4}{5} \\times (-5) = -4$, and $3 + (-4) = -1$.\n\n> **Watch out.** Keep the denominator: the dot product of the numerators, $15 - 20 = -5$, must still be divided by $5$.",
          "主成分得分是中心化后的数据点沿主成分方向的坐标，通过与单位特征向量做点积得到。$z_1 = \\mathbf{v}_1^T \\mathbf{x}_c = \\sum_{i=1}^d v_{1i} x_{ci}$。投影得分 $z_1$ 表示沿第一主成分轴的坐标。\n\n例如，取 $\\mathbf{v}_1 = (\\frac{3}{5}, \\frac{4}{5})$，$\\mathbf{x}_c = (5, -5)$，则 $z_1 = \\frac{15 - 20}{5} = -1$。\n\n检验：$\\frac{3}{5} \\times 5 = 3$，$\\frac{4}{5} \\times (-5) = -4$，而 $3 + (-4) = -1$。\n\n> **注意。** 不要丢掉分母：分子的点积 $15 - 20 = -5$ 还要除以 $5$。",
        ),
        generate: (rng: Rng): Problem => {
          // Unit vector with integer / simple rational components
          // e.g. v1 = (3/5, 4/5) or (4/5, -3/5)
          const pyth = rng.pick([
            { a: 3, b: 4, c: 5 },
            { a: 4, b: 3, c: 5 },
            { a: 5, b: 12, c: 13 },
            { a: 12, b: 5, c: 13 },
            { a: 6, b: 8, c: 10 },
          ]);
          const signB = rng.bool() ? 1 : -1;
          const a = pyth.a;
          const b = pyth.b * signB;
          const c = pyth.c;

          const xVal1 = rng.int(-10, 15);
          const xVal2 = rng.int(-10, 15);
          const dotVal = a * xVal1 + b * xVal2;
          const exactScore = Q.of(dotVal, c);

          const vLatex = `\\mathbf{v}_1 = \\begin{bmatrix} \\frac{${a}}{${c}} \\\\[4pt] \\frac{${b}}{${c}} \\end{bmatrix}`;
          const xLatex = `\\mathbf{x}_c = \\begin{bmatrix} ${xVal1} \\\\[4pt] ${xVal2} \\end{bmatrix}`;

          return numberProblem({
            prompt: t(
              `In PCA, a centered data point is $\\mathbf{x}_c = ${xLatex}$ and the first principal unit direction is $${vLatex}$. Calculate the principal component score $z_1 = \\mathbf{v}_1^T \\mathbf{x}_c$.`,
              `在主成分分析中，中心化数据点为 $\\mathbf{x}_c = ${xLatex}$，第一主成分单位方向向量为 $${vLatex}$。计算第一主成分得分 $z_1 = \\mathbf{v}_1^T \\mathbf{x}_c$。`,
            ),
            answer: exactScore,
            mistakes: distinct([
              why(
                dotVal,
                `That forgets to divide by $${c}$, the common denominator of $\\mathbf{v}_1$.`,
                `这忘了除以 $\\mathbf{v}_1$ 的公分母 $${c}$。`,
              ),
              why(
                Q.of(a * xVal1 - b * xVal2, c),
                "That subtracts the second product instead of adding it.",
                "这把第二个乘积减去了，而不是加上。",
              ),
              why(Q.of(dotVal, c * c), `That divides by $${c}$ twice.`, `这除了两次 $${c}$。`),
            ]),
            solution: walked(
              [
                [
                  ["Multiply matching entries", "对应分量相乘"],
                  t(
                    `$z_1 = \\left(\\frac{${a}}{${c}}\\right)(${xVal1}) + \\left(\\frac{${b}}{${c}}\\right)(${xVal2}) = \\frac{${a * xVal1} + ${p(b * xVal2)}}{${c}}$.`,
                    `$z_1 = \\left(\\frac{${a}}{${c}}\\right)(${xVal1}) + \\left(\\frac{${b}}{${c}}\\right)(${xVal2}) = \\frac{${a * xVal1} + ${p(b * xVal2)}}{${c}}$。`,
                  ),
                ],
                [
                  ["Simplify", "化简"],
                  t(
                    `$z_1 = \\frac{${dotVal}}{${c}} = ${exactScore.toLatex()}$.`,
                    `$z_1 = \\frac{${dotVal}}{${c}} = ${exactScore.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `$${c} z_1 = ${dotVal}$, the dot product of $(${a}, ${b})$ with $\\mathbf{x}_c$.`,
                `$${c} z_1 = ${dotVal}$，正是 $(${a}, ${b})$ 与 $\\mathbf{x}_c$ 的点积。`,
              ),
            ),
          });
        },
      },
      {
        id: "reconstruction-error-of-a-projection",
        title: t("The reconstruction error of keeping one component", "只保留一个主成分时的重构误差"),
        explanation: t(
          "Keeping only the first component replaces $\\mathbf{x}_c$ by its reconstruction $\\hat{\\mathbf{x}} = z_1 \\mathbf{v}_1$. Because the principal directions are orthonormal, $\\mathbf{x}_c = z_1\\mathbf{v}_1 + z_2\\mathbf{v}_2$, and the squared error is the part that was dropped:\n$$\\|\\mathbf{x}_c - \\hat{\\mathbf{x}}\\|^2 = z_2^2 = \\|\\mathbf{x}_c\\|^2 - z_1^2.$$\nWith $\\mathbf{v}_1 = (\\frac{3}{5}, \\frac{4}{5})$ and $\\mathbf{x}_c = (5, 0)$: $z_1 = 3$, so the error is $25 - 9 = 16$.\n\nCheck: along $\\mathbf{v}_2 = (-\\frac{4}{5}, \\frac{3}{5})$ the dropped score is $z_2 = -4$, and $(-4)^2 = 16$.\n\n> **Watch out.** Subtract the square $z_1^2$, not $z_1$ itself, and do not stop at $z_1^2 = 9$: that is the part kept, not the part lost.",
          "只保留第一主成分时，用重构 $\\hat{\\mathbf{x}} = z_1 \\mathbf{v}_1$ 代替 $\\mathbf{x}_c$。由于主方向是标准正交的，$\\mathbf{x}_c = z_1\\mathbf{v}_1 + z_2\\mathbf{v}_2$，平方误差就是被舍弃的部分：\n$$\\|\\mathbf{x}_c - \\hat{\\mathbf{x}}\\|^2 = z_2^2 = \\|\\mathbf{x}_c\\|^2 - z_1^2.$$\n若 $\\mathbf{v}_1 = (\\frac{3}{5}, \\frac{4}{5})$，$\\mathbf{x}_c = (5, 0)$：$z_1 = 3$，所以误差为 $25 - 9 = 16$。\n\n检验：沿 $\\mathbf{v}_2 = (-\\frac{4}{5}, \\frac{3}{5})$ 被舍弃的得分是 $z_2 = -4$，而 $(-4)^2 = 16$。\n\n> **注意。** 要减去平方 $z_1^2$，而不是 $z_1$ 本身；也不要停在 $z_1^2 = 9$：那是保留的部分，而不是损失的部分。",
        ),
        generate: (rng: Rng): Problem => {
          const [a, b0, c] = rng.pick([
            [3, 4, 5],
            [4, 3, 5],
            [5, 12, 13],
            [12, 5, 13],
            [8, 15, 17],
            [15, 8, 17],
          ] as const);
          const b = rng.pick([1, -1]) * b0;
          const x1 = rng.int(-8, 10);
          const x2 = rng.pick([-7, -5, -3, -2, -1, 1, 2, 3, 5, 7]);
          const z1 = Q.of(a * x1 + b * x2, c);
          const norm = x1 * x1 + x2 * x2;
          const err = Q.of(norm).sub(z1.mul(z1));
          const z2num = a * x2 - b * x1;
          return numberProblem({
            prompt: t(
              `The first principal direction is $\\mathbf{v}_1 = \\left(\\frac{${a}}{${c}}, ${b < 0 ? "-" : ""}\\frac{${Math.abs(b)}}{${c}}\\right)$. A centered point $\\mathbf{x}_c = (${x1}, ${x2})$ is reconstructed from its first score alone as $\\hat{\\mathbf{x}} = z_1 \\mathbf{v}_1$. Find the squared reconstruction error $\\|\\mathbf{x}_c - \\hat{\\mathbf{x}}\\|^2$.`,
              `第一主方向为 $\\mathbf{v}_1 = \\left(\\frac{${a}}{${c}}, ${b < 0 ? "-" : ""}\\frac{${Math.abs(b)}}{${c}}\\right)$。中心化的点 $\\mathbf{x}_c = (${x1}, ${x2})$ 只用第一得分重构为 $\\hat{\\mathbf{x}} = z_1 \\mathbf{v}_1$。求平方重构误差 $\\|\\mathbf{x}_c - \\hat{\\mathbf{x}}\\|^2$。`,
            ),
            answer: err,
            form: "fraction",
            mistakes: distinct([
              why(
                z1.mul(z1),
                "That is $z_1^2$, the part of the squared length that is kept, not the part lost.",
                "这是 $z_1^2$，即平方长度中保留的部分，而不是损失的部分。",
              ),
              why(
                Q.of(norm),
                "That is the whole squared length $\\|\\mathbf{x}_c\\|^2$, with nothing taken away for the kept part.",
                "这是整个平方长度 $\\|\\mathbf{x}_c\\|^2$，没有减去保留的部分。",
              ),
              why(Q.of(norm).sub(z1), "That subtracts $z_1$ instead of its square $z_1^2$.", "这减去的是 $z_1$，而不是它的平方 $z_1^2$。"),
            ]),
            solution: walked(
              [
                [
                  ["Find the first score", "求第一得分"],
                  t(
                    `$z_1 = \\frac{${a}(${x1}) + (${b})(${x2})}{${c}} = ${z1.toLatex()}$.`,
                    `$z_1 = \\frac{${a}(${x1}) + (${b})(${x2})}{${c}} = ${z1.toLatex()}$。`,
                  ),
                ],
                [
                  ["Subtract its square", "减去得分的平方"],
                  t(
                    `$\\|\\mathbf{x}_c\\|^2 = ${p(x1)}^2 + ${p(x2)}^2 = ${norm}$, so the error is $${norm} - \\left(${z1.toLatex()}\\right)^2 = ${err.toLatex()}$.`,
                    `$\\|\\mathbf{x}_c\\|^2 = ${p(x1)}^2 + ${p(x2)}^2 = ${norm}$，所以误差为 $${norm} - \\left(${z1.toLatex()}\\right)^2 = ${err.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `The dropped score along the direction at right angles to $\\mathbf{v}_1$ is $\\frac{${z2num}}{${c}}$, and its square is also $${err.toLatex()}$.`,
                `沿与 $\\mathbf{v}_1$ 垂直的方向被舍弃的得分是 $\\frac{${z2num}}{${c}}$，它的平方也是 $${err.toLatex()}$。`,
              ),
            ),
          });
        },
      },
    ],
  },
];
