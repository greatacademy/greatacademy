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
                `A dataset with $d = ${d}$ features has a sample covariance matrix $S$ with eigenvalues $\\lambda = [${lambdas.join(", ")}]$. Calculate the total variance $\\operatorname{Tr}(S) = \\sum_{i=1}^{${d}} \\lambda_i$.`,
                `一个具有 $d = ${d}$ 个特征的数据集，其样本协方差矩阵 $S$ 的特征值为 $\\lambda = [${lambdas.join(", ")}]$。计算数据集的总方差 $\\operatorname{Tr}(S) = \\sum_{i=1}^{${d}} \\lambda_i$。`,
              ),
              answer: total,
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
              `The sample covariance matrix of a 3-dimensional dataset has eigenvalues $\\lambda_1 = ${lam1}$, $\\lambda_2 = ${lam2}$, and $\\lambda_3 = ${lam3}$. What proportion of the total variance is explained by the first principal component? Give your answer as an exact rational number $\\frac{\\lambda_1}{\\sum_{i=1}^3 \\lambda_i}$.`,
              `一个 3 维数据集的样本协方差矩阵具有特征值 $\\lambda_1 = ${lam1}$、$\\lambda_2 = ${lam2}$ 和 $\\lambda_3 = ${lam3}$。第一主成分解释了总方差的多少比例？以精确有理数 $\\frac{\\lambda_1}{\\sum_{i=1}^3 \\lambda_i}$ 形式作答。`,
            ),
            answer: prop,
            solution: t(
              `Total variance is $\\sum_{i=1}^3 \\lambda_i = ${lam1} + ${lam2} + ${lam3} = ${total}$. The proportion explained by the first principal component is $\\frac{${lam1}}{${total}} = ${prop.toLatex()}$.`,
              `总方差为 $\\sum_{i=1}^3 \\lambda_i = ${lam1} + ${lam2} + ${lam3} = ${total}$。第一主成分解释的比例为 $\\frac{${lam1}}{${total}} = ${prop.toLatex()}$。`,
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
              `The sample covariance matrix of a 2-dimensional dataset is $S = \\begin{pmatrix} ${s11} & ${tr.s12} \\\\ ${tr.s12} & ${s22} \\end{pmatrix}$. Find the variance $\\lambda_${askMax ? "1" : "2"}$ along the ${askMax ? "first (dominant)" : "second"} principal component by calculating the ${askMax ? "larger" : "smaller"} eigenvalue of $S$.`,
              `一个 2 维数据集的样本协方差矩阵为 $S = \\begin{pmatrix} ${s11} & ${tr.s12} \\\\ ${tr.s12} & ${s22} \\end{pmatrix}$。通过计算 $S$ 的${askMax ? "较大" : "较小"}特征值，求${askMax ? "第一（主）" : "第二"}主成分方向上的方差 $\\lambda_${askMax ? "1" : "2"}$。`,
            ),
            answer: targetLambda,
            solution: t(
              `The characteristic equation is $\\det(S - \\lambda I) = (${s11} - \\lambda)(${s22} - \\lambda) - (${tr.s12})^2 = \\lambda^2 - ${s11 + s22}\\lambda + ${s11 * s22 - tr.s12 * tr.s12} = 0$. Factoring gives $(\\lambda - ${actualL1})(\\lambda - ${actualL2}) = 0$, so the eigenvalues are $\\lambda_1 = ${actualL1}$ and $\\lambda_2 = ${actualL2}$. The requested eigenvalue is $${targetLambda}$.`,
              `特征方程为 $\\det(S - \\lambda I) = (${s11} - \\lambda)(${s22} - \\lambda) - (${tr.s12})^2 = \\lambda^2 - ${s11 + s22}\\lambda + ${s11 * s22 - tr.s12 * tr.s12} = 0$。因式分解得 $(\\lambda - ${actualL1})(\\lambda - ${actualL2}) = 0$，特征值为 $\\lambda_1 = ${actualL1}$ 与 $\\lambda_2 = ${actualL2}$。所求特征值为 $${targetLambda}$。`,
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
              `A dataset of $n = ${sampleN}$ observations is centered into a matrix $X_c$. The singular value decomposition $X_c = U \\Sigma V^T$ yields a largest singular value of $\\sigma_1 = ${sigma}$. What is the variance $\\lambda_1$ of the first principal component, given by $\\lambda_1 = \\frac{\\sigma_1^2}{n - 1}$? Enter your answer as an exact rational number.`,
              `包含 $n = ${sampleN}$ 个观测值的数据集经中心化后得到矩阵 $X_c$。其奇异值分解 $X_c = U \\Sigma V^T$ 求得的最大奇异值为 $\\sigma_1 = ${sigma}$。由公式 $\\lambda_1 = \\frac{\\sigma_1^2}{n - 1}$，求第一主成分的方差 $\\lambda_1$（以精确有理数形式作答）。`,
            ),
            answer: variance,
            solution: t(
              `Using the connection $\\lambda_1 = \\frac{\\sigma_1^2}{n - 1} = \\frac{${sigma}^2}{${sampleN} - 1} = \\frac{${sigmaSquared}}{${nMinus1}} = ${variance.toLatex()}$.`,
              `由公式 $\\lambda_1 = \\frac{\\sigma_1^2}{n - 1} = \\frac{${sigma}^2}{${sampleN} - 1} = \\frac{${sigmaSquared}}{${nMinus1}} = ${variance.toLatex()}$。`,
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
            solution: t(
              `$z_1 = \\mathbf{v}_1^T \\mathbf{x}_c = \\left(\\frac{${a}}{${c}}\\right)(${xVal1}) + \\left(\\frac{${b}}{${c}}\\right)(${xVal2}) = \\frac{${a * xVal1} + (${b * xVal2})}{${c}} = \\frac{${dotVal}}{${c}} = ${exactScore.toLatex()}$.`,
              `$z_1 = \\mathbf{v}_1^T \\mathbf{x}_c = \\left(\\frac{${a}}{${c}}\\right)(${xVal1}) + \\left(\\frac{${b}}{${c}}\\right)(${xVal2}) = \\frac{${a * xVal1} + (${b * xVal2})}{${c}} = \\frac{${dotVal}}{${c}} = ${exactScore.toLatex()}$。`,
            ),
          });
        },
      },
    ],
  },
];
