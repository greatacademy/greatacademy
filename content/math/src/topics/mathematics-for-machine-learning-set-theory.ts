import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { plane, poly, Q } from "@ga/subject-math";
import { machineLearningDrawings1 } from "../explanation-drawings-mathematics-for-machine-learning-1.ts";
import { numberProblem, why } from "../problems.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** distinct drops the mistakes whose value repeats an earlier one. */
const distinct = <M extends { readonly value: number | Q }>(ms: readonly M[]): M[] =>
  ms.filter((m, i) => ms.findIndex((o) => `${o.value}` === `${m.value}`) === i);

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
    intro: t(
      "A classifier labels $5$ images, and $2$ of its labels are wrong. Writing $\\mathbb{I}[\\hat{y}_i \\ne y_i]$ for each image gives $0, 1, 0, 0, 1$, and the sum $2$ is the number of errors, the zero-one loss.\n\nCheck: the $3$ correct images contribute $0$ each, so the sum is $1 + 1 = 2$.\n\nIn this lesson we evaluate sums of indicators, combine indicators with products and complements, and find the expected value of a sum of indicators.",
      "一个分类器给 $5$ 张图片贴标签，其中 $2$ 个标签是错的。对每张图片写出 $\\mathbb{I}[\\hat{y}_i \\ne y_i]$，得到 $0, 1, 0, 0, 1$，和 $2$ 就是错误的个数，即 0-1 损失。\n\n检验：$3$ 张正确的图片各贡献 $0$，所以和是 $1 + 1 = 2$。\n\n本课我们计算示性函数的和，用乘积与补组合示性函数，并求示性函数之和的期望。",
    ),
    knowledgePoints: [
      {
        id: "evaluating-indicator-functions-for-predicates",
        title: t("Evaluating indicator functions of predicates", "计算谓词的示性函数"),
        explanation: t(
          "Turning a true or false statement into one or zero lets you count with ordinary arithmetic, which is how many loss functions and accuracies are written. $\\mathbb{I}[P(x)] = 1$ if $P(x)$ holds, and $0$ otherwise. Summing indicators counts how many elements satisfy the predicate: $\\sum_{i=1}^n \\mathbb{I}[P(x_i)]$.\n\nFor example, $\\sum_{x=1}^{10} \\mathbb{I}[x \\ge 7] = 4$, since the predicate holds for $x = 7, 8, 9, 10$.\n\nCheck: the six values $x = 1, \\dots, 6$ contribute $0$ each, and $4 + 6 = 10$ accounts for every term.\n\n> **Watch out.** Count both ends: from $a$ to $n$ there are $n - a + 1$ integers, not $n - a$.",
          "把真或假的陈述变成 1 或 0，就可以用普通的算术来计数，许多损失函数和准确率都是这样写出来的。若 $P(x)$ 成立则 $\\mathbb{I}[P(x)] = 1$，否则为 $0$。对示性函数求和等于满足谓词条件的元素总数：$\\sum_{i=1}^n \\mathbb{I}[P(x_i)]$。\n\n例如 $\\sum_{x=1}^{10} \\mathbb{I}[x \\ge 7] = 4$，因为谓词在 $x = 7, 8, 9, 10$ 时成立。\n\n检验：$x = 1, \\dots, 6$ 这六个值各贡献 $0$，而 $4 + 6 = 10$ 正好是全部的项数。\n\n> **注意。** 两端都要算上：从 $a$ 到 $n$ 有 $n - a + 1$ 个整数，而不是 $n - a$ 个。",
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
              mistakes: distinct([
                why(
                  n - numErrors,
                  "That counts the correct samples, where the indicator is $0$.",
                  "这数的是正确的样本，而那里示性函数为 $0$。",
                ),
                why(
                  Q.of(numErrors, n),
                  "That is the error rate; the loss here is the sum, not the average.",
                  "这是错误率；这里的损失是和，不是平均值。",
                ),
                why(n, "That counts every sample, as if each indicator were $1$.", "这数了所有样本，好像每个示性函数都是 $1$。"),
              ]),
              solution: walked(
                [
                  [
                    ["Score each sample", "给每个样本打分"],
                    t(
                      `A misclassified sample has $\\mathbb{I}[y_i \\neq \\hat{y}_i] = 1$, and a correct one has $0$.`,
                      `分类错误的样本有 $\\mathbb{I}[y_i \\neq \\hat{y}_i] = 1$，正确的样本为 $0$。`,
                    ),
                  ],
                  [
                    ["Add the scores", "把分数相加"],
                    t(
                      `There are $${numErrors}$ ones and $${n - numErrors}$ zeros, so the sum is $${numErrors}$.`,
                      `共有 $${numErrors}$ 个 $1$ 和 $${n - numErrors}$ 个 $0$，所以和为 $${numErrors}$。`,
                    ),
                  ],
                ],
                t(
                  `The $${numErrors}$ errors and $${n - numErrors}$ correct samples make up all $${n}$ samples, and only the errors add to the loss.`,
                  `$${numErrors}$ 个错误和 $${n - numErrors}$ 个正确的样本合起来是全部 $${n}$ 个样本，只有错误计入损失。`,
                ),
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
            mistakes: distinct([
              why(
                n - threshold,
                `That leaves out one end; $x = ${threshold}$ itself satisfies the predicate.`,
                `这漏掉了一端；$x = ${threshold}$ 本身满足谓词。`,
              ),
              why(
                threshold - 1,
                `That counts $x = 1, \\dots, ${threshold - 1}$, where the indicator is $0$.`,
                `这数的是 $x = 1, \\dots, ${threshold - 1}$，而那里示性函数为 $0$。`,
              ),
              why(n - threshold + 2, "That counts one integer too many.", "这多数了一个整数。"),
            ]),
            solution: walked(
              [
                [
                  ["Find where the predicate holds", "找谓词成立的位置"],
                  t(
                    `The indicator is $1$ for $x \\in \\{${threshold}, ${threshold + 1}, \\dots, ${n}\\}$ and $0$ for smaller $x$.`,
                    `当 $x \\in \\{${threshold}, ${threshold + 1}, \\dots, ${n}\\}$ 时示性函数为 $1$，更小的 $x$ 处为 $0$。`,
                  ),
                ],
                [
                  ["Count them", "计数"],
                  t(
                    `From $${threshold}$ to $${n}$ there are $${n} - ${threshold} + 1 = ${count}$ integers.`,
                    `从 $${threshold}$ 到 $${n}$ 共有 $${n} - ${threshold} + 1 = ${count}$ 个整数。`,
                  ),
                ],
              ],
              t(
                `The other $${threshold - 1}$ values of $x$ contribute $0$, and $${count} + ${threshold - 1} = ${n}$ accounts for every term.`,
                `其余 $${threshold - 1}$ 个 $x$ 贡献 $0$，而 $${count} + ${threshold - 1} = ${n}$ 正好是全部的项数。`,
              ),
            ),
          });
        },
      },
      {
        id: "combining-indicators",
        title: t("Combining indicators with products and complements", "用乘积与补组合示性函数"),
        explanation: t(
          "Indicators follow the logic of their predicates through ordinary arithmetic. A product is $1$ only when both factors are $1$, and subtracting from $1$ swaps $0$ and $1$:\n$$\\mathbb{I}[P]\\,\\mathbb{I}[Q] = \\mathbb{I}[P \\text{ and } Q], \\qquad 1 - \\mathbb{I}[P] = \\mathbb{I}[\\text{not } P].$$\nSo $\\sum_{x=1}^{10} \\mathbb{I}[x \\ge 4]\\,\\mathbb{I}[x \\text{ is even}]$ counts the even numbers from $4$ to $10$, which gives $4$, and $\\sum_{x=1}^{10} (1 - \\mathbb{I}[x \\ge 4]) = 3$ counts $1, 2, 3$.\n\nCheck: the even numbers from $4$ to $10$ are $4, 6, 8, 10$, four of them, and $3 + 7 = 10$ splits the integers from $1$ to $10$ into those below $4$ and the rest.\n\n> **Watch out.** A complement counts what is left over: subtract the count inside from the total, rather than reporting the count inside.",
          "示性函数通过普通算术遵循其谓词的逻辑。乘积只有在两个因子都为 $1$ 时才为 $1$，用 $1$ 去减则交换 $0$ 与 $1$：\n$$\\mathbb{I}[P]\\,\\mathbb{I}[Q] = \\mathbb{I}[P \\text{ 且 } Q], \\qquad 1 - \\mathbb{I}[P] = \\mathbb{I}[\\text{非 } P].$$\n所以 $\\sum_{x=1}^{10} \\mathbb{I}[x \\ge 4]\\,\\mathbb{I}[x \\text{ 为偶数}]$ 统计从 $4$ 到 $10$ 的偶数，结果为 $4$；而 $\\sum_{x=1}^{10} (1 - \\mathbb{I}[x \\ge 4]) = 3$ 统计的是 $1, 2, 3$。\n\n检验：从 $4$ 到 $10$ 的偶数是 $4, 6, 8, 10$，共四个；而 $3 + 7 = 10$ 把 $1$ 到 $10$ 的整数分成小于 $4$ 的和其余的。\n\n> **注意。** 补统计的是剩下的部分：要用总数减去里面的个数，而不是直接报出里面的个数。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(12, 40);
          const lo = rng.int(2, Math.floor(n / 2));
          const hi = rng.int(lo + 3, n - 1);
          const m = rng.pick([2, 3, 4, 5]);
          const kind = rng.int(0, 2);
          const xs = Array.from({ length: n }, (_, i) => i + 1);
          const mult = (x: number) => x % m === 0;
          const pick = [(x: number) => x >= lo && x <= hi, (x: number) => x >= lo && mult(x), (x: number) => !(x >= lo && x <= hi)][kind]!;
          const ans = xs.filter(pick).length;
          const multTex = t(`${m} \\mid x`, `${m} \\mid x`);
          const body = [
            `\\mathbb{I}[x \\ge ${lo}]\\,\\mathbb{I}[x \\le ${hi}]`,
            `\\mathbb{I}[x \\ge ${lo}]\\,\\mathbb{I}[${multTex.en}]`,
            `\\big(1 - \\mathbb{I}[${lo} \\le x \\le ${hi}]\\big)`,
          ][kind]!;
          const count = [
            t(`the integers from $${lo}$ to $${hi}$`, `从 $${lo}$ 到 $${hi}$ 的整数`),
            t(`the multiples of $${m}$ from $${lo}$ to $${n}$`, `从 $${lo}$ 到 $${n}$ 中 $${m}$ 的倍数`),
            t(`the integers from $1$ to $${n}$ outside $[${lo}, ${hi}]$`, `从 $1$ 到 $${n}$ 中不在 $[${lo}, ${hi}]$ 内的整数`),
          ][kind]!;
          const inRange = hi - lo + 1;
          const below = Math.floor((lo - 1) / m);
          const upTo = Math.floor(n / m);
          const counted = [
            t(
              `From $${lo}$ to $${hi}$ there are $${hi} - ${lo} + 1 = ${ans}$ integers.`,
              `从 $${lo}$ 到 $${hi}$ 共有 $${hi} - ${lo} + 1 = ${ans}$ 个整数。`,
            ),
            t(
              `Up to $${n}$ there are $${upTo}$ multiples of $${m}$, and $${below}$ of them are below $${lo}$, which leaves $${upTo} - ${below} = ${ans}$.`,
              `到 $${n}$ 为止共有 $${upTo}$ 个 $${m}$ 的倍数，其中 $${below}$ 个小于 $${lo}$，剩下 $${upTo} - ${below} = ${ans}$ 个。`,
            ),
            t(
              `The range $[${lo}, ${hi}]$ holds $${inRange}$ integers, so $${n} - ${inRange} = ${ans}$ lie outside it.`,
              `区间 $[${lo}, ${hi}]$ 内有 $${inRange}$ 个整数，所以有 $${n} - ${inRange} = ${ans}$ 个在它之外。`,
            ),
          ][kind]!;
          return numberProblem({
            prompt: t(
              `Evaluate $\\displaystyle\\sum_{x=1}^{${n}} ${body}$${kind === 1 ? `, where $${m} \\mid x$ means $${m}$ divides $x$` : ""}.`,
              `求 $\\displaystyle\\sum_{x=1}^{${n}} ${body}$ 的值${kind === 1 ? `，其中 $${m} \\mid x$ 表示 $${m}$ 整除 $x$` : ""}。`,
            ),
            answer: ans,
            form: "integer",
            mistakes: distinct([
              kind === 2
                ? why(
                    inRange,
                    "That counts the integers inside the range; the complement counts those outside.",
                    "这数的是区间内的整数；补数的是区间外的。",
                  )
                : why(n - ans, "That counts the terms where the summand is $0$.", "这数的是被加项为 $0$ 的项。"),
              kind === 1
                ? why(
                    n - lo + 1,
                    `That counts every $x \\ge ${lo}$ and leaves out the factor $\\mathbb{I}[${m} \\mid x]$.`,
                    `这数了所有 $x \\ge ${lo}$，漏掉了因子 $\\mathbb{I}[${m} \\mid x]$。`,
                  )
                : why(
                    inRange - 1,
                    kind === 0 ? "That leaves out one end of the range." : "That counts the range without one of its ends.",
                    kind === 0 ? "这漏掉了区间的一端。" : "这数的是区间内的整数，还漏掉了一端。",
                  ),
              why(ans + 1, "That counts one integer too many.", "这多数了一个整数。"),
            ]),
            solution: walked(
              [
                [
                  ["Read the summand", "读被加项"],
                  t(
                    `The summand is $1$ exactly for ${count.en}, and $0$ otherwise.`,
                    `被加项恰好在${count["zh-CN"]}处为 $1$，其余为 $0$。`,
                  ),
                ],
                [["Count", "计数"], counted],
              ],
              t(
                `The terms equal to $0$ number $${n} - ${ans} = ${n - ans}$, and the two counts together cover all $${n}$ terms.`,
                `等于 $0$ 的项有 $${n} - ${ans} = ${n - ans}$ 个，两部分合起来正好是全部 $${n}$ 项。`,
              ),
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
    intro: t(
      "Take $S = \\left\\{1 - \\frac{1}{n} : n \\in \\mathbb{N}^{+}\\right\\} = \\left\\{0, \\frac{1}{2}, \\frac{2}{3}, \\dots\\right\\}$. Every element is below $1$ and the elements come as close to $1$ as we like, so $\\sup S = 1$, though $1$ is not in $S$ and $S$ has no maximum. The smallest element is $0$, so $\\inf S = \\min S = 0$.\n\nCheck: a number below $1$, such as $0.99$, is passed by the element $1 - \\frac{1}{200} = 0.995$, so it is not an upper bound.\n\nIn this lesson we find the supremum and infimum of intervals, of sets given by a formula in $n$, of sets whose terms alternate around a limit, and of sums of sets.",
      "取 $S = \\left\\{1 - \\frac{1}{n} : n \\in \\mathbb{N}^{+}\\right\\} = \\left\\{0, \\frac{1}{2}, \\frac{2}{3}, \\dots\\right\\}$。每个元素都小于 $1$，且元素可以任意接近 $1$，所以 $\\sup S = 1$，尽管 $1$ 不在 $S$ 中，$S$ 也没有最大值。最小的元素是 $0$，所以 $\\inf S = \\min S = 0$。\n\n检验：小于 $1$ 的数，比如 $0.99$，会被元素 $1 - \\frac{1}{200} = 0.995$ 超过，所以它不是上界。\n\n本课我们求区间、由 $n$ 的式子给出的集合、各项围绕极限交错的集合以及集合之和的上确界与下确界。",
    ),
    knowledgePoints: [
      {
        id: "evaluating-supremum-and-infimum",
        title: t("Evaluating supremum and infimum of bounded sets", "求有界集合的上确界与下确界"),
        explanation: t(
          "For an open interval $(a, b)$, $\\sup (a, b) = b$ and $\\inf (a, b) = a$, neither of which is a maximum or minimum. For $S = \\{c - \\frac{d}{n} : n \\in \\mathbb{N}^{+}\\}$ with $d > 0$, $\\sup S = c$ and $\\inf S = c - d$.\n\nFor $S = \\{5 - \\frac{2}{n} : n \\in \\mathbb{N}^{+}\\} = \\{3, 4, \\frac{13}{3}, \\dots\\}$, the terms rise toward $5$, so $\\sup S = 5$, and the first term is the smallest, so $\\inf S = 3$.\n\nCheck: $3$ is in $S$, at $n = 1$, so it is also the minimum, while $5$ is not in $S$, since $\\frac{2}{n} > 0$ for every $n$.\n\n> **Watch out.** A supremum or infimum need not belong to the set. Do not step to a nearby element because the end itself is left out.",
          "对于开区间 $(a, b)$，$\\sup (a, b) = b$ 且 $\\inf (a, b) = a$，两者都不是最大值或最小值。对于 $S = \\{c - \\frac{d}{n} : n \\in \\mathbb{N}^{+}\\}$（$d > 0$），$\\sup S = c$ 且 $\\inf S = c - d$。\n\n对 $S = \\{5 - \\frac{2}{n} : n \\in \\mathbb{N}^{+}\\} = \\{3, 4, \\frac{13}{3}, \\dots\\}$，各项增大趋向 $5$，所以 $\\sup S = 5$；第一项最小，所以 $\\inf S = 3$。\n\n检验：$3$ 在 $S$ 中（$n = 1$），所以它也是最小值；而 $5$ 不在 $S$ 中，因为对每个 $n$ 都有 $\\frac{2}{n} > 0$。\n\n> **注意。** 上确界或下确界不必属于集合。不要因为端点本身不在集合里就改取附近的元素。",
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
              mistakes: [
                askSup
                  ? why(c - k, "That is the smallest element, at $n = 1$, which is the infimum.", "这是最小的元素（$n = 1$），它是下确界。")
                  : why(
                      c,
                      "That is the limit of the terms, which is the supremum; the infimum is the smallest element.",
                      "这是各项的极限，它是上确界；下确界是最小的元素。",
                    ),
                askSup
                  ? why(
                      Q.of(2 * c - k, 2),
                      "That is the term at $n = 2$, but the later terms keep rising past it.",
                      "这是 $n = 2$ 时的项，但后面的项还在继续增大，超过了它。",
                    )
                  : why(
                      Q.of(2 * c - k, 2),
                      "That is the term at $n = 2$, but the term at $n = 1$ is smaller.",
                      "这是 $n = 2$ 时的项，但 $n = 1$ 时的项更小。",
                    ),
                ...(askSup
                  ? [
                      why(
                        c + k,
                        `That adds $\\frac{${k}}{n}$ instead of subtracting it; every element is below ${c}.`,
                        `这是加上而不是减去 $\\frac{${k}}{n}$；每个元素都小于 ${c}。`,
                      ),
                    ]
                  : []),
              ],
              solution: walked(
                [
                  [
                    ["Follow the terms", "观察各项"],
                    t(
                      `The terms $${c} - \\frac{${k}}{n}$ increase with $n$ and tend to $${c}$, and each of them is less than $${c}$.`,
                      `各项 $${c} - \\frac{${k}}{n}$ 随 $n$ 增大，趋于 $${c}$，且每一项都小于 $${c}$。`,
                    ),
                  ],
                  askSup
                    ? [
                        ["Find the least upper bound", "求最小上界"],
                        t(
                          `So $${c}$ is an upper bound, and for any $\\varepsilon > 0$, choosing $n > \\frac{${k}}{\\varepsilon}$ gives an element above $${c} - \\varepsilon$, so no smaller number is an upper bound. Thus $\\sup(S) = ${c}$.`,
                          `所以 $${c}$ 是上界；对任意 $\\varepsilon > 0$，取 $n > \\frac{${k}}{\\varepsilon}$ 即可得到大于 $${c} - \\varepsilon$ 的元素，所以更小的数都不是上界。因此 $\\sup(S) = ${c}$。`,
                        ),
                      ]
                    : [
                        ["Take the first term", "取第一项"],
                        t(
                          `Since the terms increase, the smallest is at $n = 1$: $\\inf(S) = \\min(S) = ${c} - ${k} = ${ans}$.`,
                          `各项递增，所以最小的一项在 $n = 1$ 处：$\\inf(S) = \\min(S) = ${c} - ${k} = ${ans}$。`,
                        ),
                      ],
                ],
                askSup
                  ? t(
                      `$${c}$ itself is not in $S$, since $\\frac{${k}}{n} > 0$ for every $n$, so $S$ has no maximum and its supremum is not an element.`,
                      `$${c}$ 本身不在 $S$ 中，因为对每个 $n$ 都有 $\\frac{${k}}{n} > 0$，所以 $S$ 没有最大值，它的上确界不是元素。`,
                    )
                  : t(
                      `The term at $n = 2$ is $${Q.of(2 * c - k, 2).toLatex()}$, which is larger than $${ans}$, as every later term is.`,
                      `$n = 2$ 时的项是 $${Q.of(2 * c - k, 2).toLatex()}$，比 $${ans}$ 大，后面的每一项也都比它大。`,
                    ),
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
            mistakes: [
              askSup
                ? why(a, "That is the lower end, which is the infimum.", "这是下端，它是下确界。")
                : why(b, "That is the upper end, which is the supremum.", "这是上端，它是上确界。"),
              askSup
                ? why(
                    b - 1,
                    `That steps below ${b}, but ${b} is in the set and is its largest element.`,
                    `这退到了 ${b} 以下，但 ${b} 在集合中，是最大的元素。`,
                  )
                : why(
                    a + 1,
                    `That steps inside because ${a} is not in the set, but the infimum need not belong to it.`,
                    `这因为 ${a} 不在集合中而往里走了一步，但下确界不必属于集合。`,
                  ),
              why(len, "That is the length of the interval, not one of its ends.", "这是区间的长度，而不是它的端点。"),
            ].filter((m, i, all) => all.findIndex((o) => o.value === m.value) === i),
            solution: walked(
              askSup
                ? [
                    [
                      ["Find the upper bounds", "找上界"],
                      t(
                        `Every element of $(${a}, ${b}]$ is at most $${b}$, so $${b}$ is an upper bound.`,
                        `$(${a}, ${b}]$ 中的每个元素都不超过 $${b}$，所以 $${b}$ 是上界。`,
                      ),
                    ],
                    [
                      ["Use the largest element", "用最大元素"],
                      t(
                        `$${b}$ itself is in the set, so no smaller number is an upper bound: $\\sup(S) = \\max(S) = ${b}$.`,
                        `$${b}$ 本身在集合中，所以更小的数都不是上界：$\\sup(S) = \\max(S) = ${b}$。`,
                      ),
                    ],
                  ]
                : [
                    [
                      ["Find the lower bounds", "找下界"],
                      t(
                        `Every element of $(${a}, ${b}]$ is greater than $${a}$, so $${a}$ is a lower bound.`,
                        `$(${a}, ${b}]$ 中的每个元素都大于 $${a}$，所以 $${a}$ 是下界。`,
                      ),
                    ],
                    [
                      ["Rule out larger bounds", "排除更大的下界"],
                      t(
                        `Elements of the set come as close to $${a}$ as we like, so no larger number is a lower bound: $\\inf(S) = ${a}$.`,
                        `集合中的元素可以任意接近 $${a}$，所以更大的数都不是下界：$\\inf(S) = ${a}$。`,
                      ),
                    ],
                  ],
              askSup
                ? t(
                    `A number below $${b}$ is passed by the element $${b}$, so it cannot be an upper bound.`,
                    `小于 $${b}$ 的数会被元素 $${b}$ 超过，所以它不可能是上界。`,
                  )
                : t(
                    `$${a}$ is not in the set, so $S$ has no minimum, yet below any number above $${a}$ there are elements of the set.`,
                    `$${a}$ 不在集合中，所以 $S$ 没有最小值，但在任何大于 $${a}$ 的数之下都有集合中的元素。`,
                  ),
            ),
          });
        },
      },
      {
        id: "bounds-of-alternating-sets",
        title: t("Supremum and infimum of alternating sets", "交错集合的上确界与下确界"),
        explanation: t(
          "When the terms of a set alternate around a value, look at the two sides separately. For $S = \\left\\{ c + \\frac{(-1)^n k}{n} : n \\in \\mathbb{N}^+ \\right\\}$ with $k > 0$, the odd terms $c - k, c - \\frac{k}{3}, \\dots$ rise toward $c$ from below and the even terms $c + \\frac{k}{2}, c + \\frac{k}{4}, \\dots$ fall toward $c$ from above.\n\nSo the largest element is the first even term and the smallest is the first odd term: $\\sup S = \\max S = c + \\frac{k}{2}$ and $\\inf S = \\min S = c - k$. The limit $c$ is neither.\n\nCheck: for $c = 1$ and $k = 4$ the terms are $-3, 3, -\\frac{1}{3}, 2, \\dots$, whose largest is $3 = 1 + \\frac{4}{2}$ and whose smallest is $-3 = 1 - 4$.\n\n> **Watch out.** The first term has $n = 1$, which is odd, so it lies below $c$. The largest element is the second term, not the first.",
          "当集合中的项围绕某个值交错时，分别观察两侧。对 $S = \\left\\{ c + \\frac{(-1)^n k}{n} : n \\in \\mathbb{N}^+ \\right\\}$（$k > 0$），奇数项 $c - k, c - \\frac{k}{3}, \\dots$ 从下方增大趋向 $c$，偶数项 $c + \\frac{k}{2}, c + \\frac{k}{4}, \\dots$ 从上方减小趋向 $c$。\n\n所以最大元素是第一个偶数项，最小元素是第一个奇数项：$\\sup S = \\max S = c + \\frac{k}{2}$，$\\inf S = \\min S = c - k$。极限 $c$ 两者都不是。\n\n检验：当 $c = 1$、$k = 4$ 时，各项为 $-3, 3, -\\frac{1}{3}, 2, \\dots$，最大的是 $3 = 1 + \\frac{4}{2}$，最小的是 $-3 = 1 - 4$。\n\n> **注意。** 第一项的 $n = 1$ 是奇数，所以它在 $c$ 之下。最大元素是第二项，而不是第一项。",
        ),
        generate: (rng: Rng): Problem => {
          const c = rng.int(-5, 8);
          const k = rng.int(1, 9);
          const askSup = rng.bool();
          const sup = Q.of(c).add(Q.of(k, 2));
          const inf = Q.of(c - k);
          const ans = askSup ? sup : inf;
          const cTex = c === 0 ? "" : `${c} + `;
          return numberProblem({
            prompt: t(
              `Let $S = \\left\\{ ${cTex}\\frac{(-1)^n \\cdot ${k}}{n} : n \\in \\mathbb{N}^+ \\right\\}$. Find $${askSup ? "\\sup S" : "\\inf S"}$.`,
              `设 $S = \\left\\{ ${cTex}\\frac{(-1)^n \\cdot ${k}}{n} : n \\in \\mathbb{N}^+ \\right\\}$。求 $${askSup ? "\\sup S" : "\\inf S"}$。`,
            ),
            answer: ans,
            form: "fraction",
            mistakes: [
              why(
                c,
                `That is the limit ${c} of the terms, which is neither the largest nor the smallest element.`,
                `这是各项的极限 ${c}，它既不是最大元素，也不是最小元素。`,
              ),
              askSup
                ? why(
                    c + k,
                    `That gives the first term a plus sign, but $n = 1$ is odd, so the first term is $${inf.toLatex()}$.`,
                    `这给第一项取了正号，但 $n = 1$ 是奇数，所以第一项是 $${inf.toLatex()}$。`,
                  )
                : why(
                    Q.of(c).sub(Q.of(k, 2)),
                    "That gives the term at $n = 2$ a minus sign, but $n = 2$ is even, so that term lies above the limit.",
                    "这给 $n = 2$ 的项取了负号，但 $n = 2$ 是偶数，所以这一项在极限之上。",
                  ),
              askSup
                ? why(inf, "That is the smallest element, at $n = 1$, which is the infimum.", "这是最小的元素（$n = 1$），它是下确界。")
                : why(sup, "That is the largest element, at $n = 2$, which is the supremum.", "这是最大的元素（$n = 2$），它是上确界。"),
            ],
            solution: walked(
              [
                [
                  ["Split by parity", "按奇偶分开"],
                  t(
                    `The odd terms are $${inf.toLatex()}, \\dots$, increasing toward $${c}$; the even terms are $${sup.toLatex()}, \\dots$, decreasing toward $${c}$.`,
                    `奇数项为 $${inf.toLatex()}, \\dots$，增大趋向 $${c}$；偶数项为 $${sup.toLatex()}, \\dots$，减小趋向 $${c}$。`,
                  ),
                ],
                askSup
                  ? [
                      ["Take the first even term", "取第一个偶数项"],
                      t(
                        `The largest element is the first even term, so $\\sup S = \\max S = ${sup.toLatex()}$, at $n = 2$.`,
                        `最大元素是第一个偶数项，所以 $\\sup S = \\max S = ${sup.toLatex()}$，在 $n = 2$ 处取到。`,
                      ),
                    ]
                  : [
                      ["Take the first odd term", "取第一个奇数项"],
                      t(
                        `The smallest element is the first odd term, so $\\inf S = \\min S = ${inf.toLatex()}$, at $n = 1$.`,
                        `最小元素是第一个奇数项，所以 $\\inf S = \\min S = ${inf.toLatex()}$，在 $n = 1$ 处取到。`,
                      ),
                    ],
              ],
              askSup
                ? t(
                    `Every odd term is below ${c}, and every later even term, $${cTex}\\frac{${k}}{n}$ with $n \\ge 4$, is below $${sup.toLatex()}$.`,
                    `每个奇数项都小于 ${c}，而之后的每个偶数项，即 $n \\ge 4$ 时的 $${cTex}\\frac{${k}}{n}$，都小于 $${sup.toLatex()}$。`,
                  )
                : t(
                    `Every even term is above ${c}, and every later odd term, $${c === 0 ? "-" : `${c} - `}\\frac{${k}}{n}$ with $n \\ge 3$, is above $${inf.toLatex()}$.`,
                    `每个偶数项都大于 ${c}，而之后的每个奇数项，即 $n \\ge 3$ 时的 $${c === 0 ? "-" : `${c} - `}\\frac{${k}}{n}$，都大于 $${inf.toLatex()}$。`,
                  ),
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
    intro: t(
      "The function $f(x) = 8 - 2(x - 3)^{2}$ is largest when the square is $0$, at $x = 3$. So $\\max_x f(x) = 8$, the highest value, while $\\operatorname{argmax}_x f(x) = 3$, the input where it is reached.\n\nCheck: $f(3) = 8 - 0 = 8$, and $f(2) = f(4) = 8 - 2 = 6$ are smaller.\n\nIn this lesson we find the argmax or argmin of a quadratic, find the argmin over the integers, and see that rescaling a function does not move its argmax.",
      "函数 $f(x) = 8 - 2(x - 3)^{2}$ 在平方为 $0$ 时最大，即 $x = 3$ 处。所以 $\\max_x f(x) = 8$ 是最高的函数值，而 $\\operatorname{argmax}_x f(x) = 3$ 是取到它的输入。\n\n检验：$f(3) = 8 - 0 = 8$，而 $f(2) = f(4) = 8 - 2 = 6$ 都更小。\n\n本课我们求二次函数的 argmax 或 argmin，求整数上的 argmin，并看到缩放函数不会移动它的 argmax。",
    ),
    knowledgePoints: [
      {
        id: "evaluating-argmax-and-argmin-functions",
        title: t("Evaluating argmax and argmin of parameterized functions", "计算参数化函数的 argmax 与 argmin"),
        explanation: t(
          "The maximum is the largest value a function reaches, while the argmax is the input where it is reached, so the two answer different questions. For $f(x) = -a(x - h)^2 + k$ with $a > 0$, $\\max f(x) = k$ and $\\operatorname{argmax}_x f(x) = h$. For $g(x) = a(x - h)^2 + k$, $\\min g(x) = k$ and $\\operatorname{argmin}_x g(x) = h$. A quadratic written out in full is first brought to this form by completing the square.\n\nFor $f(x) = -2x^{2} + 12x - 10$, completing the square gives $f(x) = -2(x - 3)^{2} + 8$, so $\\operatorname{argmax}_x f(x) = 3$ and $\\max f(x) = 8$.\n\nCheck: $f(3) = -2(9) + 12(3) - 10 = -18 + 36 - 10 = 8$.\n\n> **Watch out.** In $(x - h)^{2}$ the vertex is at $x = h$, so $(x + 3)^{2}$ puts it at $-3$. And the argmax is the input $h$, not the value $k$.",
          "最大值是函数能达到的最大函数值，而 argmax 是达到它的那个输入，所以两者回答的是不同的问题。对于 $f(x) = -a(x - h)^2 + k$（$a > 0$），$\\max f(x) = k$ 且 $\\operatorname{argmax}_x f(x) = h$。对于 $g(x) = a(x - h)^2 + k$，$\\min g(x) = k$ 且 $\\operatorname{argmin}_x g(x) = h$。展开写的二次函数要先配方化成这种形式。\n\n对 $f(x) = -2x^{2} + 12x - 10$，配方得 $f(x) = -2(x - 3)^{2} + 8$，所以 $\\operatorname{argmax}_x f(x) = 3$，$\\max f(x) = 8$。\n\n检验：$f(3) = -2(9) + 12(3) - 10 = -18 + 36 - 10 = 8$。\n\n> **注意。** 在 $(x - h)^{2}$ 中顶点在 $x = h$，所以 $(x + 3)^{2}$ 的顶点在 $-3$。而且 argmax 是输入 $h$，不是函数值 $k$。",
        ),
        generate: (rng: Rng): Problem => {
          const a = rng.int(1, 5);
          const h = rng.nonZero(-9, 12);
          const k = rng.int(-15, 25);
          const isMin = rng.bool();
          const sign = isMin ? 1 : -1;
          const expanded = poly([sign * a, "x^2"], [-2 * sign * a * h, "x"], [sign * a * h * h + k, ""]);

          const aStr = a === 1 ? "" : `${a}`;
          const hStr = h >= 0 ? `- ${h}` : `+ ${-h}`;
          const kStr = k === 0 ? "" : k > 0 ? `+ ${k}` : `- ${-k}`;
          const funcLatex = isMin ? `${aStr}(x ${hStr})^2 ${kStr}` : `-${aStr}(x ${hStr})^2 ${kStr}`;

          return numberProblem({
            prompt: t(
              `Given the objective function $f(x) = ${expanded}$ defined for all $x \\in \\mathbb{R}$, find the value of $x^* = \\operatorname{${isMin ? "argmin" : "argmax"}}_{x \\in \\mathbb{R}} f(x)$.`,
              `给定定义在所有 $x \\in \\mathbb{R}$ 上的目标函数 $f(x) = ${expanded}$，求 $x^* = \\operatorname{${isMin ? "argmin" : "argmax"}}_{x \\in \\mathbb{R}} f(x)$ 的值。`,
            ),
            answer: h,
            mistakes: distinct([
              why(
                -h,
                `That reads the sign wrongly: $(x ${hStr})^2$ is $0$ at $x = ${h}$.`,
                `这把符号读反了：$(x ${hStr})^2$ 在 $x = ${h}$ 处为 $0$。`,
              ),
              why(
                k,
                `That is the ${isMin ? "minimum" : "maximum"} value $f(${h})$; the ${isMin ? "argmin" : "argmax"} is the input.`,
                `这是${isMin ? "最小" : "最大"}值 $f(${h})$；${isMin ? "argmin" : "argmax"} 是输入。`,
              ),
              why(
                -k,
                "That is the negative of the extreme value, which is not an input of $f$ at all.",
                "这是最值的相反数，根本不是 $f$ 的输入。",
              ),
            ]),
            solution: walked(
              [
                [["Complete the square", "配方"], t(`$f(x) = ${funcLatex}$.`, `$f(x) = ${funcLatex}$。`)],
                isMin
                  ? [
                      ["Minimize the square", "使平方项最小"],
                      t(
                        `The term $${aStr}(x ${hStr})^2 \\ge 0$ is smallest, $0$, at $x = ${h}$, so $\\operatorname{argmin}_{x \\in \\mathbb{R}} f(x) = ${h}$.`,
                        `项 $${aStr}(x ${hStr})^2 \\ge 0$ 在 $x = ${h}$ 处最小，为 $0$，所以 $\\operatorname{argmin}_{x \\in \\mathbb{R}} f(x) = ${h}$。`,
                      ),
                    ]
                  : [
                      ["Maximize the negative term", "使负项最大"],
                      t(
                        `The term $-${aStr}(x ${hStr})^2 \\le 0$ is largest, $0$, at $x = ${h}$, so $\\operatorname{argmax}_{x \\in \\mathbb{R}} f(x) = ${h}$.`,
                        `项 $-${aStr}(x ${hStr})^2 \\le 0$ 在 $x = ${h}$ 处最大，为 $0$，所以 $\\operatorname{argmax}_{x \\in \\mathbb{R}} f(x) = ${h}$。`,
                      ),
                    ],
              ],
              t(
                `At $x = ${h}$ the ${isMin ? "minimum" : "maximum"} value is $f(${h}) = ${k}$, and any other $x$ makes the square positive, so $f(x) ${isMin ? ">" : "<"} ${k}$ there.`,
                `在 $x = ${h}$ 处${isMin ? "最小" : "最大"}值为 $f(${h}) = ${k}$，其他任何 $x$ 都使平方为正，所以那里 $f(x) ${isMin ? ">" : "<"} ${k}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "argmin-over-the-integers",
        figure: machineLearningDrawings1["argmax-and-argmin-notation#argmin-over-the-integers"],
        title: t("Arg min over a restricted domain", "受限定义域上的 arg min"),
        explanation: t(
          "The domain written under $\\operatorname{argmin}$ matters: restricting it can move the minimizer. For a parabola that opens upward, the value grows with distance from the vertex in both directions, so over the integers the minimizer is the integer nearest the vertex.\n\nFor $g(x) = (3x - 7)^2$, the real minimizer is $x = \\frac{7}{3} \\approx 2.33$, but $\\operatorname{argmin}_{x \\in \\mathbb{Z}} g(x) = 2$, since $g(2) = 1 < g(3) = 4$. Rounding the vertex works here; simply taking the floor or ceiling does not always.\n\nCheck: $g(1) = 16$ is larger still, and $g$ only grows as $x$ moves further from $\\frac{7}{3}$.\n\n> **Watch out.** Compare $g$ at the two integers on either side of the vertex; the floor alone is wrong whenever the vertex is nearer the integer above it.",
          "写在 $\\operatorname{argmin}$ 下面的定义域很重要：限制定义域可能改变最小值点。开口向上的抛物线，函数值随着离顶点越远而越大，所以在整数上的最小值点是离顶点最近的整数。\n\n对 $g(x) = (3x - 7)^2$，实数最小值点为 $x = \\frac{7}{3} \\approx 2.33$，但 $\\operatorname{argmin}_{x \\in \\mathbb{Z}} g(x) = 2$，因为 $g(2) = 1 < g(3) = 4$。这里把顶点四舍五入是对的；直接向下或向上取整则不一定对。\n\n检验：$g(1) = 16$ 更大，而且 $x$ 离 $\\frac{7}{3}$ 越远，$g$ 越大。\n\n> **注意。** 要比较顶点两侧两个整数处的 $g$ 值；只要顶点离上面的整数更近，只向下取整就错了。",
        ),
        generate: (rng: Rng): Problem => {
          const q = rng.pick([3, 4, 5, 6, 7]);
          const p = rng.pick(
            Array.from({ length: 12 * q }, (_, i) => i - 4 * q).filter((v) => v % q !== 0 && 2 * (((v % q) + q) % q) !== q),
          );
          const nearest = Math.round(p / q);
          const other = p / q > nearest ? nearest + 1 : nearest - 1;
          const g = (x: number) => (q * x - p) ** 2;
          const pTex = p < 0 ? `+ ${-p}` : `- ${p}`;
          return numberProblem({
            prompt: t(
              `Find $\\operatorname{argmin}_{x \\in \\mathbb{Z}} \\,(${q}x ${pTex})^2$.`,
              `求 $\\operatorname{argmin}_{x \\in \\mathbb{Z}} \\,(${q}x ${pTex})^2$。`,
            ),
            answer: nearest,
            form: "integer",
            mistakes: distinct([
              why(
                other,
                `That is the other integer next to the vertex, where $g(${other}) = ${g(other)}$ is larger than $g(${nearest}) = ${g(nearest)}$.`,
                `这是顶点旁边的另一个整数，那里 $g(${other}) = ${g(other)}$ 比 $g(${nearest}) = ${g(nearest)}$ 大。`,
              ),
              why(
                0,
                `That is not near the real minimizer $${Q.of(p, q).toLatex()}$; $g(0) = ${g(0)}$.`,
                `这不在实数最小值点 $${Q.of(p, q).toLatex()}$ 附近；$g(0) = ${g(0)}$。`,
              ),
              why(
                p,
                `That solves $x ${pTex} = 0$ but forgets the coefficient $${q}$ of $x$.`,
                `这解的是 $x ${pTex} = 0$，忘了 $x$ 的系数 $${q}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the real minimizer", "求实数最小值点"],
                  t(
                    `The square is $0$ at $x = ${Q.of(p, q).toLatex()}$, between $${Math.min(nearest, other)}$ and $${Math.max(nearest, other)}$.`,
                    `平方在 $x = ${Q.of(p, q).toLatex()}$ 处为 $0$，它位于 $${Math.min(nearest, other)}$ 与 $${Math.max(nearest, other)}$ 之间。`,
                  ),
                ],
                [
                  ["Compare the neighbors", "比较相邻的整数"],
                  t(
                    `$g(${nearest}) = ${g(nearest)}$ and $g(${other}) = ${g(other)}$, so the integer minimizer is $${nearest}$.`,
                    `$g(${nearest}) = ${g(nearest)}$，$g(${other}) = ${g(other)}$，所以整数最小值点为 $${nearest}$。`,
                  ),
                ],
              ],
              t(
                `Integers further out are further from $${Q.of(p, q).toLatex()}$, so $g$ is larger there than at $${nearest}$ and $${other}$.`,
                `更远的整数离 $${Q.of(p, q).toLatex()}$ 更远，所以那里的 $g$ 比在 $${nearest}$ 和 $${other}$ 处更大。`,
              ),
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
      "Identifying the input argument that optimizes an objective function given by a discrete table of values or by a graph.",
      "从离散数值表格或图象中识别使目标函数达到最优的自变量输入值。",
    ),
    prerequisites: ["argmax-and-argmin-notation"],
    encompasses: [],
    xp: 10,
    intro: t(
      "A model is trained with depths $2, 4, 6, 8$, and its validation losses are $31, 24, 27, 35$. The smallest loss is $24$, and it belongs to depth $4$, so the depth to choose is $\\operatorname{argmin} = 4$, not the loss $24$.\n\nCheck: every other loss, $31$, $27$ and $35$, is larger than $24$.\n\nIn this lesson we read the argmax and argmin of a function from a table of values and from a graph.",
      "用深度 $2, 4, 6, 8$ 训练一个模型，验证损失依次为 $31, 24, 27, 35$。最小的损失是 $24$，它属于深度 $4$，所以应选的深度是 $\\operatorname{argmin} = 4$，而不是损失 $24$。\n\n检验：其余的损失 $31$、$27$、$35$ 都大于 $24$。\n\n本课我们从数值表格和图象中读出函数的 argmax 与 argmin。",
    ),
    knowledgePoints: [
      {
        id: "identifying-tabular-argmax-argmin",
        title: t("Identifying argmax and argmin from tables", "根据表格数据求 argmax 与 argmin"),
        explanation: t(
          "To find $\\operatorname{argmin}_x L(x)$ from a table of pairs $(x, L(x))$, inspect the values $L(x)$, locate the minimum value, and return the corresponding argument $x$.\n\nFor example, if the table pairs $x = 3, 5, 7, 9$ with accuracies $81, 88, 86, 79$, the largest accuracy is $88$ in the row $x = 5$, so $\\operatorname{argmax}_x \\mathcal{A}(x) = 5$.\n\nCheck: the other accuracies $81$, $86$ and $79$ are all below $88$.\n\n> **Watch out.** Answer with the entry in the $x$ column, not the optimal value and not the row number: here the row number is $2$, but the argmax is $5$.",
          "要从数对 $(x, L(x))$ 的表格中求 $\\operatorname{argmin}_x L(x)$，先查看 $L(x)$ 的取值，找出最小值，然后返回对应的自变量 $x$。\n\n例如，若表格把 $x = 3, 5, 7, 9$ 与准确率 $81, 88, 86, 79$ 配对，最大的准确率是 $x = 5$ 那一行的 $88$，所以 $\\operatorname{argmax}_x \\mathcal{A}(x) = 5$。\n\n检验：其余的准确率 $81$、$86$、$79$ 都小于 $88$。\n\n> **注意。** 要回答 $x$ 一列中的数，既不是最优值，也不是行号：这里行号是 $2$，而 argmax 是 $5$。",
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
            mistakes: distinct([
              why(
                optVal,
                `That is the ${isMin ? "minimum loss" : "maximum accuracy"} itself; the question asks for the input $x$ that gives it.`,
                `这是${isMin ? "最小损失" : "最大准确率"}本身；题目要的是取得它的输入 $x$。`,
              ),
              why(
                xs[(bestIdx + 1) % numRows]!,
                `That is the $x$ of a neighboring row, whose value $${losses[(bestIdx + 1) % numRows]}$ is not the ${isMin ? "smallest" : "largest"}.`,
                `这是相邻一行的 $x$，它的值 $${losses[(bestIdx + 1) % numRows]}$ 不是${isMin ? "最小" : "最大"}的。`,
              ),
              why(
                bestIdx + 1,
                "That is the row number of the best entry, not the value in its $x$ column.",
                "这是最优一行的行号，而不是它在 $x$ 一列中的数。",
              ),
            ]),
            solution: walked(
              [
                [
                  [`Find the ${isMin ? "smallest" : "largest"} value`, isMin ? "找最小值" : "找最大值"],
                  t(
                    `Among the values $${losses.join(", ")}$, the ${isMin ? "minimum loss" : "maximum accuracy"} is $${optVal}$.`,
                    `在取值 $${losses.join(", ")}$ 中，${isMin ? "最小损失" : "最大准确率"}是 $${optVal}$。`,
                  ),
                ],
                [
                  ["Read its input", "读出对应输入"],
                  t(
                    `The value $${optVal}$ sits in the row $x = ${optArg}$, so the ${isMin ? "argmin" : "argmax"} is $${optArg}$, not the value $${optVal}$.`,
                    `值 $${optVal}$ 在 $x = ${optArg}$ 这一行，所以 ${isMin ? "argmin" : "argmax"} 是 $${optArg}$，而不是函数值 $${optVal}$。`,
                  ),
                ],
              ],
              t(
                `Every other value in the table is ${isMin ? "larger" : "smaller"} than $${optVal}$.`,
                `表中其余的值都${isMin ? "大于" : "小于"} $${optVal}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "reading-argmax-argmin-from-graphs",
        figure: machineLearningDrawings1["finding-argmax-and-argmin-from-tables-and-graphs#reading-argmax-argmin-from-graphs"],
        title: t("Reading argmax and argmin from graphs", "从图象中读出 argmax 与 argmin"),
        explanation: t(
          "On a graph of $L(x)$, the minimum value is the height of the lowest point, and $\\operatorname{argmin}_x L(x)$ is that point's $x$-coordinate: read across to the horizontal axis, not up to the vertical one. Likewise, $\\operatorname{argmax}$ is the $x$-coordinate of the highest point.\n\nFor example, if the plotted points are $(1, 6), (2, 3), (3, 8), (4, 5)$, the lowest point is $(2, 3)$, so $\\operatorname{argmin}_x L(x) = 2$ and the minimum value is $3$.\n\nCheck: the other heights $6$, $8$ and $5$ are all above $3$.\n\n> **Watch out.** Do not answer with the height of the point, and do not confuse argmin with argmax: here the highest point $(3, 8)$ gives the argmax $3$.",
          "在 $L(x)$ 的图象上，最小值是最低点的高度，而 $\\operatorname{argmin}_x L(x)$ 是该点的横坐标：要向横轴读数，而不是向纵轴读数。同样，$\\operatorname{argmax}$ 是最高点的横坐标。\n\n例如，若画出的点是 $(1, 6), (2, 3), (3, 8), (4, 5)$，最低点是 $(2, 3)$，所以 $\\operatorname{argmin}_x L(x) = 2$，最小值是 $3$。\n\n检验：其余的高度 $6$、$8$、$5$ 都高于 $3$。\n\n> **注意。** 不要回答点的高度，也不要把 argmin 与 argmax 弄混：这里最高点 $(3, 8)$ 给出的是 argmax $3$。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(5, 7);
          const ys = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], n);
          const isMin = rng.bool();
          const best = ys.indexOf(isMin ? Math.min(...ys) : Math.max(...ys));
          const pts = ys.map((y, i) => [i + 1, y] as const);
          const figure = {
            svg: plane({ xMin: 0, xMax: 8, yMin: 0, yMax: 10, labelEvery: 1 }, [
              ...pts.slice(1).map(([x, y], i) => ({ kind: "segment" as const, a: pts[i]!, b: [x, y] as const })),
              ...pts.map((at) => ({ kind: "point" as const, at })),
            ]),
            alt: t(
              `A graph of ${isMin ? "the loss" : "the score"} at x = 1 to ${n}, with values ${ys.join(", ")}.`,
              `${isMin ? "损失" : "得分"}在 x = 1 到 ${n} 处的图象，取值依次为 ${ys.join("、")}。`,
            ),
          };
          const name = isMin ? "argmin" : "argmax";
          const f = isMin ? "\\mathcal{L}(x)" : "\\mathcal{S}(x)";
          const value = ys[best]!;
          return {
            ...numberProblem({
              prompt: t(
                `The graph shows ${isMin ? "a loss" : "a score"} $${f}$ at the inputs $x = 1, 2, \\ldots, ${n}$. Find $\\operatorname{${name}}_{x} ${f}$.`,
                `图象给出了${isMin ? "损失" : "得分"} $${f}$ 在输入 $x = 1, 2, \\ldots, ${n}$ 处的值。求 $\\operatorname{${name}}_{x} ${f}$。`,
              ),
              answer: best + 1,
              mistakes: distinct([
                why(
                  value,
                  `That is the height of the ${isMin ? "lowest" : "highest"} point, its $y$-coordinate; the ${name} is its $x$-coordinate.`,
                  `这是${isMin ? "最低" : "最高"}点的高度，即纵坐标；${name} 是它的横坐标。`,
                ),
                why(
                  best === 0 ? 2 : best,
                  `That is the input next to the ${isMin ? "lowest" : "highest"} point; its value $${ys[best === 0 ? 1 : best - 1]}$ is not the ${isMin ? "smallest" : "largest"}.`,
                  `这是${isMin ? "最低" : "最高"}点旁边的输入；它的值 $${ys[best === 0 ? 1 : best - 1]}$ 不是${isMin ? "最小" : "最大"}的。`,
                ),
                why(
                  ys.indexOf(isMin ? Math.max(...ys) : Math.min(...ys)) + 1,
                  `That is the $x$-coordinate of the ${isMin ? "highest" : "lowest"} point, the ${isMin ? "argmax" : "argmin"} instead of the ${name}.`,
                  `这是${isMin ? "最高" : "最低"}点的横坐标，求成了 ${isMin ? "argmax" : "argmin"}，而不是 ${name}。`,
                ),
              ]),
              solution: walked(
                [
                  [
                    [`Find the ${isMin ? "lowest" : "highest"} point`, isMin ? "找最低点" : "找最高点"],
                    t(
                      `The heights are $${ys.join(", ")}$, and the ${isMin ? "lowest" : "highest"} point is $(${best + 1}, ${value})$.`,
                      `各点的高度是 $${ys.join(", ")}$，${isMin ? "最低" : "最高"}点是 $(${best + 1}, ${value})$。`,
                    ),
                  ],
                  [
                    ["Read its x-coordinate", "读出横坐标"],
                    t(
                      `The ${name} is its $x$-coordinate, $${best + 1}$; the ${isMin ? "minimum" : "maximum"} value itself is $${value}$.`,
                      `${name} 是它的横坐标 $${best + 1}$；${isMin ? "最小" : "最大"}值本身是 $${value}$。`,
                    ),
                  ],
                ],
                t(
                  `Every other point is ${isMin ? "higher" : "lower"} than $${value}$.`,
                  `其余各点都${isMin ? "高于" : "低于"} $${value}$。`,
                ),
              ),
            }),
            figure,
          };
        },
      },
    ],
  },
];
