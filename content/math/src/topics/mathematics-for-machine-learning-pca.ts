import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { numberProblem } from "../problems.ts";

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
    knowledgePoints: [
      {
        id: "evaluating-pca-total-variance",
        title: t("Computing total variance and proportion of variance explained", "计算总方差与方差解释比例"),
        explanation: t(
          "Each principal component carries a share of the total variance equal to its eigenvalue, so the share explained is that eigenvalue divided by the sum of all of them. The total variance is $\\operatorname{Tr}(S) = \\sum_i \\lambda_i$. The proportion of variance explained by the first $k$ components is $\\frac{\\sum_{i=1}^k \\lambda_i}{\\sum_{i=1}^d \\lambda_i}$.",
          "每个主成分所承载的方差份额等于它的特征值，所以解释的比例就是该特征值除以所有特征值之和。总方差为 $\\operatorname{Tr}(S) = \\sum_i \\lambda_i$。前 $k$ 个主成分所解释的方差比例为 $\\frac{\\sum_{i=1}^k \\lambda_i}{\\sum_{i=1}^d \\lambda_i}$。",
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
              wrong: [lambdas[0]!, Q.of(total, d), total - lambdas[d - 1]!],
              solution: t(
                `The total variance equals the sum of the eigenvalues of the covariance matrix: $\\operatorname{Tr}(S) = ${lambdas.join(" + ")} = ${total}$.`,
                `总方差等于协方差矩阵的所有特征值之和：$\\operatorname{Tr}(S) = ${lambdas.join(" + ")} = ${total}$。`,
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
            wrong: [Q.of(lam1, lam2 + lam3), Q.of(lam2 + lam3, total), Q.of(1, 3)],
            solution: t(
              `Total variance is $\\sum_{i=1}^3 \\lambda_i = ${lam1} + ${lam2} + ${lam3} = ${total}$. The proportion explained by the first principal component is $${prop.toLatex()}$.`,
              `总方差为 $\\sum_{i=1}^3 \\lambda_i = ${lam1} + ${lam2} + ${lam3} = ${total}$。第一主成分解释的比例为 $${prop.toLatex()}$。`,
            ),
          });
        },
      },
      {
        id: "choosing-how-many-components-to-keep",
        title: t("Choosing how many components to keep", "确定保留的主成分个数"),
        explanation: t(
          "A common rule keeps the fewest leading components whose combined share of the variance reaches a target such as $90\\%$. Sort the eigenvalues from largest to smallest, add them up one at a time, and stop as soon as the running total divided by the total variance reaches the target.\n\nFor eigenvalues $50, 30, 12, 5, 3$ (total $100$), the running shares are $50\\%, 80\\%, 92\\%, \\dots$, so $3$ components are needed for $90\\%$ but only $2$ for $80\\%$.",
          "常用的规则是：保留最少的前几个主成分，使它们合计的方差占比达到目标，例如 $90\\%$。把特征值从大到小排列，逐个累加，一旦累计和除以总方差达到目标就停止。\n\n对于特征值 $50, 30, 12, 5, 3$（总和 $100$），累计占比为 $50\\%, 80\\%, 92\\%, \\dots$，所以要达到 $90\\%$ 需要 $3$ 个主成分，而 $80\\%$ 只需要 $2$ 个。",
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
          return numberProblem({
            prompt: t(
              `The covariance matrix of a dataset with $${d}$ features has eigenvalues $${lambdas.join(", ")}$. What is the smallest number of principal components that together explain at least $${target}\\%$ of the total variance?`,
              `某数据集有 $${d}$ 个特征，其协方差矩阵的特征值为 $${lambdas.join(", ")}$。至少需要几个主成分，才能合计解释不少于 $${target}\\%$ 的总方差？`,
            ),
            answer: k,
            form: "integer",
            wrong: [k - 1, k + 1, Math.ceil((d * target) / 100)].filter((w) => w >= 1 && w <= d),
            solution: t(
              `The total variance is $${total}$. The running shares are $${shares}$, and the first to reach $${target}\\%$ is the share of the first $${k}$ components, so $${k}$ components are needed.`,
              `总方差为 $${total}$。累计占比依次为 $${shares}$，第一个达到 $${target}\\%$ 的是前 $${k}$ 个主成分的占比，所以需要 $${k}$ 个主成分。`,
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
    knowledgePoints: [
      {
        id: "finding-principal-component-eigenvalues",
        title: t("Finding dominant eigenvalues of covariance matrices", "求协方差矩阵的主特征值"),
        explanation: t(
          "For a $2 \\times 2$ covariance matrix $S$, the eigenvalues solve $\\det(S - \\lambda I) = 0$. The first principal component has the larger eigenvalue as its variance: $\\lambda_1 = \\max(\\lambda_1, \\lambda_2)$.",
          "对于 $2 \\times 2$ 协方差矩阵 $S$，特征值由 $\\det(S - \\lambda I) = 0$ 确定。第一主成分的方差为较大的特征值 $\\lambda_1 = \\max(\\lambda_1, \\lambda_2)$。",
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

          return numberProblem({
            prompt: t(
              `The sample covariance matrix of a 2-dimensional dataset is $S = \\begin{pmatrix} ${s11} & ${tr.s12} \\\\ ${tr.s12} & ${s22} \\end{pmatrix}$. Find the variance $\\lambda_{${askMax ? "1" : "2"}}$ along the ${askMax ? "first (dominant)" : "second"} principal component by calculating the ${askMax ? "larger" : "smaller"} eigenvalue of $S$.`,
              `一个 2 维数据集的样本协方差矩阵为 $S = \\begin{pmatrix} ${s11} & ${tr.s12} \\\\ ${tr.s12} & ${s22} \\end{pmatrix}$。通过计算 $S$ 的${askMax ? "较大" : "较小"}特征值，求${askMax ? "第一（主）" : "第二"}主成分方向上的方差 $\\lambda_{${askMax ? "1" : "2"}}$。`,
            ),
            answer: targetLambda,
            wrong: [askMax ? actualL2 : actualL1, askMax ? s11 : s22, s11 + s22],
            solution: t(
              `The characteristic equation is $\\det(S - \\lambda I) = (${s11} - \\lambda)(${s22} - \\lambda) - (${tr.s12})^2 = \\lambda^2 - ${s11 + s22}\\lambda + ${s11 * s22 - tr.s12 * tr.s12} = 0$. Factoring gives $(\\lambda - ${actualL1})(\\lambda - ${actualL2}) = 0$, so the eigenvalues are $\\lambda_1 = ${actualL1}$ and $\\lambda_2 = ${actualL2}$. The requested eigenvalue is $${targetLambda}$.`,
              `特征方程为 $\\det(S - \\lambda I) = (${s11} - \\lambda)(${s22} - \\lambda) - (${tr.s12})^2 = \\lambda^2 - ${s11 + s22}\\lambda + ${s11 * s22 - tr.s12 * tr.s12} = 0$。因式分解得 $(\\lambda - ${actualL1})(\\lambda - ${actualL2}) = 0$，特征值为 $\\lambda_1 = ${actualL1}$ 与 $\\lambda_2 = ${actualL2}$。所求特征值为 $${targetLambda}$。`,
            ),
          });
        },
      },
      {
        id: "the-direction-of-the-first-component",
        title: t("Finding the direction of the first principal component", "求第一主成分的方向"),
        explanation: t(
          "Once the largest eigenvalue $\\lambda_1$ is known, its eigenvector gives the direction of the first principal axis. The first row of $(S - \\lambda_1 I)\\mathbf{v} = \\mathbf{0}$ reads $(s_{11} - \\lambda_1)v_1 + s_{12}v_2 = 0$, so the axis has slope\n$$\\frac{v_2}{v_1} = \\frac{\\lambda_1 - s_{11}}{s_{12}}.$$\nFor $S = \\begin{pmatrix} 13 & 4 \\\\ 4 & 7 \\end{pmatrix}$ with $\\lambda_1 = 15$, the slope is $\\frac{15 - 13}{4} = \\frac{1}{2}$: the data spread most along the direction $(2, 1)$.",
          "求出最大特征值 $\\lambda_1$ 后，它的特征向量给出第一主轴的方向。方程 $(S - \\lambda_1 I)\\mathbf{v} = \\mathbf{0}$ 的第一行为 $(s_{11} - \\lambda_1)v_1 + s_{12}v_2 = 0$，所以主轴的斜率为\n$$\\frac{v_2}{v_1} = \\frac{\\lambda_1 - s_{11}}{s_{12}}.$$\n对 $S = \\begin{pmatrix} 13 & 4 \\\\ 4 & 7 \\end{pmatrix}$，$\\lambda_1 = 15$，斜率为 $\\frac{15 - 13}{4} = \\frac{1}{2}$：数据沿方向 $(2, 1)$ 分散得最开。",
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
            wrong: [Q.of(l2 - s11, s12), Q.of(s12, l1 - s11), slope.neg()],
            solution: t(
              `The first row of $(S - ${l1}I)\\mathbf{v} = \\mathbf{0}$ is $(${s11} - ${l1})v_1 + (${s12})v_2 = 0$, so $\\frac{v_2}{v_1} = \\frac{${l1} - ${s11}}{${s12}} = ${slope.toLatex()}$.`,
              `$(S - ${l1}I)\\mathbf{v} = \\mathbf{0}$ 的第一行为 $(${s11} - ${l1})v_1 + (${s12})v_2 = 0$，所以 $\\frac{v_2}{v_1} = \\frac{${l1} - ${s11}}{${s12}} = ${slope.toLatex()}$。`,
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
    knowledgePoints: [
      {
        id: "svd-singular-value-to-pca-variance",
        title: t("Relating singular values of centered data to principal component variances", "由中心化数据的奇异值计算主成分方差"),
        explanation: t(
          "Given the singular value $\\sigma_i$ of the centered $n \\times d$ data matrix $X_c$, the variance along the $i$-th principal component is $\\lambda_i = \\frac{\\sigma_i^2}{n - 1}$.",
          "已知 $n \\times d$ 中心化数据矩阵 $X_c$ 的奇异值 $\\sigma_i$，沿第 $i$ 个主成分的方差为 $\\lambda_i = \\frac{\\sigma_i^2}{n - 1}$。",
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
            wrong: [sigmaSquared, Q.of(sigma, nMinus1), Q.of(sigmaSquared, sampleN)],
            solution: t(
              `Using the connection $\\lambda_1 = \\frac{\\sigma_1^2}{n - 1} = \\frac{${sigma}^2}{${sampleN} - 1} = \\frac{${sigmaSquared}}{${nMinus1}} = ${variance.toLatex()}$.`,
              `由公式 $\\lambda_1 = \\frac{\\sigma_1^2}{n - 1} = \\frac{${sigma}^2}{${sampleN} - 1} = \\frac{${sigmaSquared}}{${nMinus1}} = ${variance.toLatex()}$。`,
            ),
          });
        },
      },
      {
        id: "variance-shares-from-singular-values",
        title: t("Variance shares from singular values", "由奇异值求方差占比"),
        explanation: t(
          "Each covariance eigenvalue is $\\frac{\\sigma_i^2}{n - 1}$, and the common factor $\\frac{1}{n - 1}$ cancels in a ratio. So the share of variance explained by the first $k$ components can be read straight from the singular values:\n$$\\frac{\\sigma_1^2 + \\cdots + \\sigma_k^2}{\\sigma_1^2 + \\cdots + \\sigma_d^2}.$$\nThe singular values must be squared first: with $\\sigma = (4, 2, 1)$, the first component explains $\\frac{16}{21}$ of the variance, not $\\frac{4}{7}$.",
          "每个协方差特征值都是 $\\frac{\\sigma_i^2}{n - 1}$，而公因子 $\\frac{1}{n - 1}$ 在比值中约去。所以前 $k$ 个主成分解释的方差占比可以直接由奇异值得到：\n$$\\frac{\\sigma_1^2 + \\cdots + \\sigma_k^2}{\\sigma_1^2 + \\cdots + \\sigma_d^2}.$$\n奇异值必须先平方：若 $\\sigma = (4, 2, 1)$，第一主成分解释的方差占比为 $\\frac{16}{21}$，而不是 $\\frac{4}{7}$。",
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
            wrong: [
              Q.of(
                plain,
                sigmas.reduce((s, v) => s + v, 0),
              ),
              Q.of(top, n - 1),
              Q.of(total - top, total),
            ],
            solution: t(
              `The eigenvalues are $\\frac{\\sigma_i^2}{${n - 1}}$, and the factor cancels, so the share is $\\frac{${sq.slice(0, k).join(" + ")}}{${sq.join(" + ")}} = ${answer.toLatex()}$.`,
              `特征值为 $\\frac{\\sigma_i^2}{${n - 1}}$，因子约去，所以占比为 $\\frac{${sq.slice(0, k).join(" + ")}}{${sq.join(" + ")}} = ${answer.toLatex()}$。`,
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
    knowledgePoints: [
      {
        id: "computing-principal-component-scores",
        title: t("Computing principal component projection scores", "计算主成分投影得分"),
        explanation: t(
          "A principal component score is the coordinate of a centered data point along the component direction, found by a dot product with the unit eigenvector. $z_1 = \\mathbf{v}_1^T \\mathbf{x}_c = \\sum_{i=1}^d v_{1i} x_{ci}$. The projected score $z_1$ is the coordinate along the first principal axis.",
          "主成分得分是中心化后的数据点沿主成分方向的坐标，通过与单位特征向量做点积得到。$z_1 = \\mathbf{v}_1^T \\mathbf{x}_c = \\sum_{i=1}^d v_{1i} x_{ci}$。投影得分 $z_1$ 表示沿第一主成分轴的坐标。",
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
            wrong: [dotVal, Q.of(a * xVal1 - b * xVal2, c), Q.of(dotVal, c * c)],
            solution: t(
              `$z_1 = \\mathbf{v}_1^T \\mathbf{x}_c = \\left(\\frac{${a}}{${c}}\\right)(${xVal1}) + \\left(\\frac{${b}}{${c}}\\right)(${xVal2}) = \\frac{${a * xVal1} + (${b * xVal2})}{${c}} = \\frac{${dotVal}}{${c}} = ${exactScore.toLatex()}$.`,
              `$z_1 = \\mathbf{v}_1^T \\mathbf{x}_c = \\left(\\frac{${a}}{${c}}\\right)(${xVal1}) + \\left(\\frac{${b}}{${c}}\\right)(${xVal2}) = \\frac{${a * xVal1} + (${b * xVal2})}{${c}} = \\frac{${dotVal}}{${c}} = ${exactScore.toLatex()}$。`,
            ),
          });
        },
      },
      {
        id: "reconstruction-error-of-a-projection",
        title: t("The reconstruction error of keeping one component", "只保留一个主成分时的重构误差"),
        explanation: t(
          "Keeping only the first component replaces $\\mathbf{x}_c$ by its reconstruction $\\hat{\\mathbf{x}} = z_1 \\mathbf{v}_1$. Because the principal directions are orthonormal, $\\mathbf{x}_c = z_1\\mathbf{v}_1 + z_2\\mathbf{v}_2$, and the squared error is the part that was dropped:\n$$\\|\\mathbf{x}_c - \\hat{\\mathbf{x}}\\|^2 = z_2^2 = \\|\\mathbf{x}_c\\|^2 - z_1^2.$$\nWith $\\mathbf{v}_1 = (\\frac{3}{5}, \\frac{4}{5})$ and $\\mathbf{x}_c = (5, 0)$: $z_1 = 3$, so the error is $25 - 9 = 16$.",
          "只保留第一主成分时，用重构 $\\hat{\\mathbf{x}} = z_1 \\mathbf{v}_1$ 代替 $\\mathbf{x}_c$。由于主方向是标准正交的，$\\mathbf{x}_c = z_1\\mathbf{v}_1 + z_2\\mathbf{v}_2$，平方误差就是被舍弃的部分：\n$$\\|\\mathbf{x}_c - \\hat{\\mathbf{x}}\\|^2 = z_2^2 = \\|\\mathbf{x}_c\\|^2 - z_1^2.$$\n若 $\\mathbf{v}_1 = (\\frac{3}{5}, \\frac{4}{5})$，$\\mathbf{x}_c = (5, 0)$：$z_1 = 3$，所以误差为 $25 - 9 = 16$。",
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
          return numberProblem({
            prompt: t(
              `The first principal direction is $\\mathbf{v}_1 = \\left(\\frac{${a}}{${c}}, ${b < 0 ? "-" : ""}\\frac{${Math.abs(b)}}{${c}}\\right)$. A centered point $\\mathbf{x}_c = (${x1}, ${x2})$ is reconstructed from its first score alone as $\\hat{\\mathbf{x}} = z_1 \\mathbf{v}_1$. Find the squared reconstruction error $\\|\\mathbf{x}_c - \\hat{\\mathbf{x}}\\|^2$.`,
              `第一主方向为 $\\mathbf{v}_1 = \\left(\\frac{${a}}{${c}}, ${b < 0 ? "-" : ""}\\frac{${Math.abs(b)}}{${c}}\\right)$。中心化的点 $\\mathbf{x}_c = (${x1}, ${x2})$ 只用第一得分重构为 $\\hat{\\mathbf{x}} = z_1 \\mathbf{v}_1$。求平方重构误差 $\\|\\mathbf{x}_c - \\hat{\\mathbf{x}}\\|^2$。`,
            ),
            answer: err,
            form: "fraction",
            wrong: [z1.mul(z1), Q.of(norm), Q.of(norm).sub(z1)],
            solution: t(
              `$z_1 = \\frac{${a}(${x1}) + (${b})(${x2})}{${c}} = ${z1.toLatex()}$ and $\\|\\mathbf{x}_c\\|^2 = ${norm}$, so the error is $${norm} - \\left(${z1.toLatex()}\\right)^2 = ${err.toLatex()}$.`,
              `$z_1 = \\frac{${a}(${x1}) + (${b})(${x2})}{${c}} = ${z1.toLatex()}$，$\\|\\mathbf{x}_c\\|^2 = ${norm}$，所以误差为 $${norm} - \\left(${z1.toLatex()}\\right)^2 = ${err.toLatex()}$。`,
            ),
          });
        },
      },
    ],
  },
];
