import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { numberProblem } from "../problems.ts";

export const mathematicsForMachineLearningSetTheoryTopics: TopicDef[] = [
  // 1.1.8 Indicator Functions for Predicates
  {
    id: "indicator-functions-for-predicates",
    title: t("Indicator Functions for Predicates", "谓词的示性函数"),
    summary: t(
      "The indicator function of a predicate $P(x)$, written $\\mathbf{1}_P(x)$ or $I(P(x))$, equals $1$ when $P(x)$ is true and $0$ when it is false.",
      "谓词 $P(x)$ 的示性函数记作 $\\mathbf{1}_P(x)$ 或 $I(P(x))$，当 $P(x)$ 为真时取 $1$，为假时取 $0$。",
    ),
    prerequisites: ["indicator-functions"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-indicator-functions-for-predicates",
        title: t("Evaluating indicator functions of predicates", "计算谓词的示性函数"),
        explanation: t(
          "Turning a true or false statement into one or zero lets you count with ordinary arithmetic, which is how many loss functions and accuracies are written. $\\mathbb{I}[P(x)] = 1$ if $P(x)$ holds, and $0$ otherwise. Summing indicators counts how many elements satisfy the predicate: $\\sum_{i=1}^n \\mathbb{I}[P(x_i)]$.",
          "把真或假的陈述变成 1 或 0，就可以用普通的算术来计数，许多损失函数和准确率都是这样写出来的。若 $P(x)$ 成立则 $\\mathbb{I}[P(x)] = 1$，否则为 $0$。对示性函数求和等于满足谓词条件的元素总数：$\\sum_{i=1}^n \\mathbb{I}[P(x_i)]$。",
        ),
        generate: (rng: Rng): Problem => {
          const kind = rng.int(0, 1);
          if (kind === 0) {
            // Count misclassifications (0-1 loss) in a dataset
            const n = rng.int(8, 20);
            const numErrors = rng.int(2, n - 2);
            return numberProblem({
              prompt: t(
                `In a binary classification task, a dataset contains $n = ${n}$ samples with labels $y_i \\in \\{0, 1\\}$ and predictions $\\hat{y}_i$. Exactly $${numErrors}$ samples have $\\hat{y}_i \\neq y_i$. Compute the zero-one classification loss $L_{0\\text{-}1} = \\sum_{i=1}^{${n}} \\mathbb{I}[y_i \\neq \\hat{y}_i]$.`,
                `在二分类任务中，一个包含 $n = ${n}$ 个样本的数据集具有真实标签 $y_i \\in \\{0, 1\\}$ 和模型预测值 $\\hat{y}_i$。其中恰好有 $${numErrors}$ 个样本满足 $\\hat{y}_i \\neq y_i$。计算 0-1 分类损失 $L_{0\\text{-}1} = \\sum_{i=1}^{${n}} \\mathbb{I}[y_i \\neq \\hat{y}_i]$。`,
              ),
              answer: numErrors,
              wrong: [n - numErrors, Q.of(numErrors, n), n],
              solution: t(
                `Each misclassified sample contributes $\\mathbb{I}[y_i \\neq \\hat{y}_i] = 1$, and each correctly classified sample contributes $0$. Thus the total sum is $${numErrors}$.`,
                `每个分类错误的样本贡献 $\\mathbb{I}[y_i \\neq \\hat{y}_i] = 1$，每个分类正确的样本贡献 $0$。因此总和为 $${numErrors}$。`,
              ),
            });
          }

          // Sum of indicator over integer range: condition x^2 >= c or x mod m == r
          const n = rng.int(15, 45);
          const threshold = rng.int(4, n - 4);
          const count = n - threshold + 1;

          return numberProblem({
            prompt: t(
              `Let $P(x)$ be the predicate $x \\ge ${threshold}$. Evaluate the sum $S = \\sum_{x=1}^{${n}} \\mathbb{I}[x \\ge ${threshold}]$.`,
              `设谓词 $P(x)$ 为 $x \\ge ${threshold}$。计算和式 $S = \\sum_{x=1}^{${n}} \\mathbb{I}[x \\ge ${threshold}]$。`,
            ),
            answer: count,
            wrong: [n - threshold, threshold - 1, n - threshold + 2],
            solution: t(
              `The predicate $x \\ge ${threshold}$ is satisfied for integers $x \\in \\{${threshold}, ${threshold + 1}, \\dots, ${n}\\}$. The number of such integers is $${n} - ${threshold} + 1 = ${count}$.`,
              `当整数 $x \\in \\{${threshold}, ${threshold + 1}, \\dots, ${n}\\}$ 时谓词 $x \\ge ${threshold}$ 成立。这样的整数共有 $${n} - ${threshold} + 1 = ${count}$ 个。`,
            ),
          });
        },
      },
    ],
  },

  // 1.3.9 Supremum and Infimum
  {
    id: "supremum-and-infimum",
    title: t("Supremum and Infimum", "上确界与下确界"),
    summary: t(
      "The supremum sup(S) is the least upper bound of a set S, and the infimum inf(S) is the greatest lower bound. Unlike the maximum and minimum, the supremum and infimum need not belong to the set S.",
      "上确界 sup(S) 是集合 S 的最小上界，下确界 inf(S) 是最大下界。与最大值和最小值不同，上确界和下确界不一定属于集合 S 本身。",
    ),
    prerequisites: ["the-maximum-and-minimum-of-a-set"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-supremum-and-infimum",
        title: t("Evaluating supremum and infimum of bounded sets", "求有界集合的上确界与下确界"),
        explanation: t(
          "For an open interval (a, b), sup((a, b)) = b and inf((a, b)) = a, neither of which is a maximum or minimum. For S = {c - d/n : n in N+}, sup(S) = c and inf(S) = c - d.",
          "对于开区间 (a, b)，sup((a, b)) = b 且 inf((a, b)) = a，两者都不是最大值或最小值。对于 S = {c - d/n : n in N+}，sup(S) = c 且 inf(S) = c - d。",
        ),
        generate: (rng: Rng): Problem => {
          const kind = rng.int(0, 1);
          if (kind === 0) {
            // Sequence set S = { c - k / n : n >= 1 }
            const c = rng.int(2, 20);
            const k = rng.int(1, 10);
            const askSup = rng.bool();
            const ans = askSup ? c : c - k;

            return numberProblem({
              prompt: t(
                `Consider the set of real numbers $S = \\left\\{ ${c} - \\frac{${k}}{n} : n \\in \\mathbb{N}^+ \\right\\} = \\left\\{ ${c - k}, ${c} - \\frac{${k}}{2}, ${c} - \\frac{${k}}{3}, \\dots \\right\\}$. Find the exact value of $${askSup ? "\\sup(S)" : "\\inf(S)"}$.`,
                `考虑实数集合 $S = \\left\\{ ${c} - \\frac{${k}}{n} : n \\in \\mathbb{N}^+ \\right\\} = \\left\\{ ${c - k}, ${c} - \\frac{${k}}{2}, ${c} - \\frac{${k}}{3}, \\dots \\right\\}$。求 $${askSup ? "\\sup(S)" : "\\inf(S)"}$ 的精确值。`,
              ),
              answer: ans,
              wrong: [askSup ? c - k : c, Q.of(2 * c - k, 2), askSup ? c + k : c],
              solution: t(
                askSup
                  ? `As $n \\to \\infty$, the terms strictly increase toward $${c}$. Every element in $S$ is strictly less than $${c}$, and for any $\\varepsilon > 0$, choosing $n > \\frac{${k}}{\\varepsilon}$ gives an element in $S$ greater than $${c} - \\varepsilon$. Thus $\\sup(S) = ${c}$.`
                  : `The sequence is strictly increasing with $n$, so the smallest element occurs at $n = 1$, giving $\\inf(S) = \\min(S) = ${c} - \\frac{${k}}{1} = ${ans}$.`,
                askSup
                  ? `当 $n \\to \\infty$ 时，各项严格递增并趋于 $${c}$。$S$ 中的每个元素都严格小于 $${c}$，且对任意 $\\varepsilon > 0$，取 $n > \\frac{${k}}{\\varepsilon}$ 即可找到大于 $${c} - \\varepsilon$ 的元素。因此 $\\sup(S) = ${c}$。`
                  : `该数列随 $n$ 严格单调递增，故最小值在 $n = 1$ 处取得，因此 $\\inf(S) = \\min(S) = ${c} - \\frac{${k}}{1} = ${ans}$。`,
              ),
            });
          }

          // Interval (a, b]
          const a = rng.int(-15, 10);
          const len = rng.int(2, 12);
          const b = a + len;
          const askSup = rng.bool();
          const ans = askSup ? b : a;

          return numberProblem({
            prompt: t(
              `Consider the half-open interval $S = (${a}, ${b}]$. Determine the exact value of $${askSup ? "\\sup(S)" : "\\inf(S)"}$.`,
              `考虑半开区间 $S = (${a}, ${b}]$。求 $${askSup ? "\\sup(S)" : "\\inf(S)"}$ 的精确值。`,
            ),
            answer: ans,
            wrong: [askSup ? a : b, askSup ? b - 1 : a + 1, len],
            solution: t(
              askSup
                ? `The maximum element of $(${a}, ${b}]$ is $${b}$, so $\\sup(S) = \\max(S) = ${b}$.`
                : `The elements of $(${a}, ${b}]$ are all strictly greater than $${a}$, and values approach $${a}$ arbitrarily closely. Therefore $\\inf(S) = ${a}$.`,
              askSup
                ? `半开区间 $(${a}, ${b}]$ 的最大元素为 $${b}$，故 $\\sup(S) = \\max(S) = ${b}$。`
                : `$(${a}, ${b}]$ 中的所有元素均严格大于 $${a}$，且可任意接近 $${a}$。因此 $\\inf(S) = ${a}$。`,
            ),
          });
        },
      },
    ],
  },

  // 1.3.10 Argmax and Argmin Notation
  {
    id: "argmax-and-argmin-notation",
    title: t("Argmax and Argmin Notation", "Argmax 与 Argmin 记号"),
    summary: t(
      "While max f(x) and min f(x) represent the extreme values of a function, argmax f(x) and argmin f(x) denote the argument (input value) at which those extreme values are attained.",
      "max f(x) 和 min f(x) 代表函数的最值，而 argmax f(x) 和 argmin f(x) 代表取得该最值时对应的自变量自变量输入值。",
    ),
    prerequisites: ["supremum-and-infimum"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-argmax-and-argmin-functions",
        title: t("Evaluating argmax and argmin of parameterized functions", "计算参数化函数的 argmax 与 argmin"),
        explanation: t(
          "The maximum is the largest value a function reaches, while the argmax is the input where it is reached, so the two answer different questions. For $f(x) = -a(x - h)^2 + k$ with $a > 0$, $\\max f(x) = k$ and $\\operatorname{argmax}_x f(x) = h$. For $g(x) = a(x - h)^2 + k$, $\\min g(x) = k$ and $\\operatorname{argmin}_x g(x) = h$.",
          "最大值是函数能达到的最大函数值，而 argmax 是达到它的那个输入，所以两者回答的是不同的问题。对于 $f(x) = -a(x - h)^2 + k$（$a > 0$），$\\max f(x) = k$ 且 $\\operatorname{argmax}_x f(x) = h$。对于 $g(x) = a(x - h)^2 + k$，$\\min g(x) = k$ 且 $\\operatorname{argmin}_x g(x) = h$。",
        ),
        generate: (rng: Rng): Problem => {
          const a = rng.int(1, 5);
          const h = rng.int(-9, 12);
          const k = rng.int(-15, 25);
          const isMin = rng.bool();

          const aStr = a === 1 ? "" : `${a}`;
          const hStr = h >= 0 ? `- ${h}` : `+ ${-h}`;
          const kStr = k >= 0 ? `+ ${k}` : `- ${-k}`;
          const funcLatex = isMin ? `${aStr}(x ${hStr})^2 ${kStr}` : `-${aStr}(x ${hStr})^2 ${kStr}`;

          return numberProblem({
            prompt: t(
              `Given the objective function $f(x) = ${funcLatex}$ defined for all $x \\in \\mathbb{R}$, find the value of $x^* = \\operatorname{${isMin ? "argmin" : "argmax"}}_{x \\in \\mathbb{R}} f(x)$.`,
              `给定定义在所有 $x \\in \\mathbb{R}$ 上的目标函数 $f(x) = ${funcLatex}$，求 $x^* = \\operatorname{${isMin ? "argmin" : "argmax"}}_{x \\in \\mathbb{R}} f(x)$ 的值。`,
            ),
            answer: h,
            wrong: [-h, k, -k],
            solution: t(
              isMin
                ? `Since $a = ${a} > 0$, the squared term $(x ${hStr})^2 \\ge 0$ is minimized when $x = ${h}$, giving minimum value $f(${h}) = ${k}$. Therefore, $\\operatorname{argmin}_{x \\in \\mathbb{R}} f(x) = ${h}$.`
                : `Since $a = ${a} > 0$, the negative term $-${aStr}(x ${hStr})^2 \\le 0$ attains its maximum of $0$ when $x = ${h}$, giving maximum value $f(${h}) = ${k}$. Therefore, $\\operatorname{argmax}_{x \\in \\mathbb{R}} f(x) = ${h}$.`,
              isMin
                ? `由于 $a = ${a} > 0$，平方项 $(x ${hStr})^2 \\ge 0$ 在 $x = ${h}$ 时取最小值 $0$，对应的最小值为 $f(${h}) = ${k}$。因此 $\\operatorname{argmin}_{x \\in \\mathbb{R}} f(x) = ${h}$。`
                : `由于 $a = ${a} > 0$，非正项 $-${aStr}(x ${hStr})^2 \\le 0$ 在 $x = ${h}$ 时取得最大值 $0$，对应的最大值为 $f(${h}) = ${k}$。因此 $\\operatorname{argmax}_{x \\in \\mathbb{R}} f(x) = ${h}$。`,
            ),
          });
        },
      },
    ],
  },

  // 1.3.11 Finding Argmax and Argmin From Tables and Graphs
  {
    id: "finding-argmax-and-argmin-from-tables-and-graphs",
    title: t("Finding Argmax and Argmin From Tables and Graphs", "从表格与图象中求 Argmax 与 Argmin"),
    summary: t(
      "Identifying the input argument that optimizes an objective function given by a discrete table of values or evaluations.",
      "从离散数值表格或评估数据中识别使目标函数达到最优的自变量输入值。",
    ),
    prerequisites: ["argmax-and-argmin-notation"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "identifying-tabular-argmax-argmin",
        title: t("Identifying argmax and argmin from tables", "根据表格数据求 argmax 与 argmin"),
        explanation: t(
          "To find $\\operatorname{argmin}_x L(x)$ from a table of pairs $(x, L(x))$, inspect the values $L(x)$, locate the minimum value, and return the corresponding argument $x$.",
          "要从数对 $(x, L(x))$ 的表格中求 $\\operatorname{argmin}_x L(x)$，先查看 $L(x)$ 的取值，找出最小值，然后返回对应的自变量 $x$。",
        ),
        generate: (rng: Rng): Problem => {
          // Table of hyperparameter values (e.g. depth d in 1..6) and loss values
          const numRows = rng.int(4, 6);
          const startX = rng.int(1, 5);
          const step = rng.int(1, 3);
          const xs = Array.from({ length: numRows }, (_, i) => startX + i * step);

          // Generate distinct loss values
          const baseLoss = rng.int(10, 40);
          const losses: number[] = [];
          for (let i = 0; i < numRows; i++) {
            losses.push(baseLoss + rng.int(1, 30));
          }
          // ensure uniqueness
          for (let i = 1; i < numRows; i++) {
            while (losses.slice(0, i).includes(losses[i]!)) {
              losses[i] = losses[i]! + rng.int(1, 10);
            }
          }

          const isMin = rng.bool();
          let bestIdx = 0;
          for (let i = 1; i < numRows; i++) {
            if (isMin ? losses[i]! < losses[bestIdx]! : losses[i]! > losses[bestIdx]!) {
              bestIdx = i;
            }
          }

          const optArg = xs[bestIdx]!;
          const optVal = losses[bestIdx]!;

          // Format markdown table
          const header = isMin
            ? t("| $x$ | Loss $\\mathcal{L}(x)$ |", "| $x$ | 损失 $\\mathcal{L}(x)$ |")
            : t("| $x$ | Accuracy $\\mathcal{A}(x)$ (%) |", "| $x$ | 准确率 $\\mathcal{A}(x)$ (%) |");
          const rows = xs.map((x, i) => `| $${x}$ | $${losses[i]}$ |`).join("\n");
          const table = (h: string) => `${h}\n|:---:|:---:|\n${rows}`;

          return numberProblem({
            prompt: t(
              `The table below reports the validation ${isMin ? "loss $\\mathcal{L}(x)$" : "accuracy $\\mathcal{A}(x)$"} for different values of a parameter $x$:\n\n${table(header.en)}\n\nFind $x^* = \\operatorname{${isMin ? "argmin" : "argmax"}}_{x} ${isMin ? "\\mathcal{L}(x)" : "\\mathcal{A}(x)"}$.`,
              `下表记录了不同参数值 $x$ 对应的验证${isMin ? "损失 $\\mathcal{L}(x)$" : "准确率 $\\mathcal{A}(x)$"}：\n\n${table(header["zh-CN"])}\n\n求 $x^* = \\operatorname{${isMin ? "argmin" : "argmax"}}_{x} ${isMin ? "\\mathcal{L}(x)" : "\\mathcal{A}(x)"}$。`,
            ),
            answer: optArg,
            wrong: [optVal, xs[(bestIdx + 1) % numRows]!, bestIdx + 1],
            solution: t(
              `Looking at the table, the ${isMin ? "minimum loss" : "maximum accuracy"} is $${optVal}$, which occurs at $x = ${optArg}$. Therefore, $\\operatorname{${isMin ? "argmin" : "argmax"}}_{x} = ${optArg}$.`,
              `查阅表格，${isMin ? "最小损失" : "最大准确率"}为 $${optVal}$，在 $x = ${optArg}$ 处取得。因此 $\\operatorname{${isMin ? "argmin" : "argmax"}}_{x} = ${optArg}$。`,
            ),
          });
        },
      },
    ],
  },
];
