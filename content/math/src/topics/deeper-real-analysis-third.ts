// Third knowledge points for thin topics of Real Analysis: the reverse question, a harder case
// or a common trap. See `deeperRealAnalysisThirdPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { poly, Q } from "@ga/subject-math";
import { analysisDrawings1 } from "../explanation-drawings-real-analysis-1.ts";

import { why } from "../problems.ts";
import { choose, type Pair, point } from "../university-kit.ts";
import { reasoned } from "../wrong-reasons.ts";
import { asPair, solution, solved } from "./real-analysis.ts";

const supOfImage = {
  ...point(
    "the-supremum-after-a-reflection",
    ["The supremum after a reflection", "反射之后的上确界"],
    [
      "Multiplying a set by a negative number turns it upside down: upper bounds become lower bounds. So the supremum of $\\{c - kx : x \\in A\\}$ with $k > 0$ comes from the infimum of $A$, and using the supremum of $A$ here is a common mistake.\n\nIf $\\inf A = 2$ and $\\sup A = 4$, then $\\{10 - 2x : x \\in A\\}$ has supremum $10 - 2 \\cdot 2 = 6$ and infimum $10 - 2 \\cdot 4 = 2$.\n\nCheck: for every $x \\ge 2$ we have $10 - 2x \\le 6$, and $x$ can be taken as close to $2$ as we like, so $6$ is the least upper bound.\n\n> **Watch out.** The minus sign swaps the roles: the supremum of the new set comes from $\\inf A$, not from $\\sup A$.",
      "把集合乘以负数会使它上下颠倒：上界变成下界。所以当 $k > 0$ 时，$\\{c - kx : x \\in A\\}$ 的上确界来自 $A$ 的下确界，这里使用 $A$ 的上确界是常见的错误。\n\n如果 $\\inf A = 2$，$\\sup A = 4$，那么 $\\{10 - 2x : x \\in A\\}$ 的上确界是 $10 - 2 \\cdot 2 = 6$，下确界是 $10 - 2 \\cdot 4 = 2$。\n\n检验：对每个 $x \\ge 2$ 都有 $10 - 2x \\le 6$，而 $x$ 可以任意接近 $2$，所以 $6$ 是最小上界。\n\n> **注意。** 负号交换了角色：新集合的上确界来自 $\\inf A$，而不是 $\\sup A$。",
    ],
    (rng) => {
      const i = rng.int(-9, 5);
      const s = i + rng.int(1, 9);
      const k = rng.int(2, 6);
      const c = rng.int(-9, 9);
      const answer = c - k * i;
      const ki = i < 0 ? `${k} \\cdot (${i})` : i === 1 ? `${k}` : `${k} \\cdot ${i}`;
      return solved(
        [
          `A bounded set $A$ has $\\inf A = ${i}$ and $\\sup A = ${s}$. What is the supremum of $\\{${c} - ${k}x : x \\in A\\}$?`,
          `有界集 $A$ 满足 $\\inf A = ${i}$，$\\sup A = ${s}$。$\\{${c} - ${k}x : x \\in A\\}$ 的上确界是多少？`,
        ],
        answer,
        [
          why(
            c - k * s,
            `That uses $\\sup A$; it gives the infimum of the new set, since $-${k}x$ is smallest when $x$ is largest.`,
            `这用的是 $\\sup A$；它给出新集合的下确界，因为 $x$ 最大时 $-${k}x$ 最小。`,
          ),
          why(
            c + k * i,
            `That drops the minus sign; the set is $${c} - ${k}x$, not $${c} + ${k}x$.`,
            `这丢掉了负号；集合是 $${c} - ${k}x$，而不是 $${c} + ${k}x$。`,
          ),
          why(
            k * s,
            `That is $${k} \\sup A$ alone; it leaves out $${c}$ and the minus sign.`,
            `这只是 $${k} \\sup A$；漏掉了 $${c}$ 和负号。`,
          ),
        ],
        solution(
          [
            [
              ["See which end matters", "看哪一端起作用"],
              [
                `$${c} - ${k}x$ decreases as $x$ grows, so it is largest when $x$ is smallest, and the supremum uses $\\inf A = ${i}$.`,
                `$${c} - ${k}x$ 随 $x$ 增大而减小，所以 $x$ 最小时它最大，上确界用 $\\inf A = ${i}$。`,
              ],
            ],
            [
              ["Evaluate", "计算"],
              [`The supremum is $${c} - ${ki} = ${answer}$.`, `上确界是 $${c} - ${ki} = ${answer}$。`],
            ],
          ],
          [
            `Every $x \\in A$ has $x \\ge ${i}$, so $${c} - ${k}x \\le ${answer}$, and $x$ close to $${i}$ brings the value as close to $${answer}$ as we like.`,
            `每个 $x \\in A$ 都满足 $x \\ge ${i}$，所以 $${c} - ${k}x \\le ${answer}$，而接近 $${i}$ 的 $x$ 使这个值任意接近 $${answer}$。`,
          ],
        ),
      );
    },
  ),
  figure: analysisDrawings1["suprema-of-sets-of-reals#the-supremum-after-a-reflection"],
};

const whichFixedPoint = point(
  "which-fixed-point-a-recursion-reaches",
  ["Which fixed point a recursion reaches", "递推到达哪个不动点"],
  [
    "The limit of a recursion must be a fixed point, but there may be several. To decide among them, compare $a_{n+1}$ with $a_n$ to find the direction of the sequence, and then look for the bound that stops it. The starting value can matter.\n\nFor $a_{n+1} = \\frac{a_n^{2} + 3}{4}$, the fixed points solve $x^2 - 4x + 3 = 0$, so they are $1$ and $3$. Starting at $a_1 = 2$ gives $a_2 = \\frac{7}{4}$, so the sequence falls, and it stays above $1$. Its limit is $1$.\n\nCheck: starting at $a_1 = 4$ instead gives $a_2 = \\frac{19}{4} > 4$, and the sequence grows without bound, so the starting value really does matter.\n\n> **Watch out.** Do not take the fixed point nearest to the start. Between $1$ and $3$ the sequence moves down, away from $3$, so $3$ cannot be the limit.",
    "递推的极限必须是不动点，但不动点可能有多个。要作出判断，就比较 $a_{n+1}$ 与 $a_n$，确定数列的方向，再找到阻止它的界。初始值可能会起作用。\n\n对 $a_{n+1} = \\frac{a_n^{2} + 3}{4}$，不动点满足 $x^2 - 4x + 3 = 0$，所以是 $1$ 和 $3$。从 $a_1 = 2$ 开始得 $a_2 = \\frac{7}{4}$，数列下降，并保持在 $1$ 之上。它的极限是 $1$。\n\n检验：如果从 $a_1 = 4$ 开始，得 $a_2 = \\frac{19}{4} > 4$，数列无限增大，所以初始值确实起作用。\n\n> **注意。** 不要取离起点最近的不动点。在 $1$ 和 $3$ 之间，数列向下移动，远离 $3$，所以 $3$ 不可能是极限。",
  ],
  (rng) => {
    const r = rng.int(1, 7);
    const s = r + rng.int(2, 8);
    const t = rng.int(r + 1, s - 1);
    const next = Q.of(t * t + r * s, r + s);
    return solved(
      [
        `Let $a_{n+1} = \\frac{a_n^{2} + ${r * s}}{${r + s}}$ with $a_1 = ${t}$. What is the limit of $a_n$?`,
        `设 $a_{n+1} = \\frac{a_n^{2} + ${r * s}}{${r + s}}$，$a_1 = ${t}$。$a_n$ 的极限是多少？`,
      ],
      r,
      [
        why(
          s,
          `That is the other fixed point, but between $${r}$ and $${s}$ the sequence moves away from it.`,
          `这是另一个不动点，但在 $${r}$ 和 $${s}$ 之间，数列远离它。`,
        ),
        why(
          t,
          `That is the starting value; the sequence does not stay there, since $a_2 = ${next.toLatex()}$.`,
          `这是初始值；数列不会停在那里，因为 $a_2 = ${next.toLatex()}$。`,
        ),
        why(
          Q.of(r + s, 2),
          `That is the midpoint of the two fixed points, which is not a fixed point itself.`,
          `这是两个不动点的中点，它本身不是不动点。`,
        ),
      ],
      solution(
        [
          [
            ["Find the fixed points", "求不动点"],
            [
              `$x = \\frac{x^{2} + ${r * s}}{${r + s}}$ gives $(x - ${r})(x - ${s}) = 0$, so the fixed points are $${r}$ and $${s}$.`,
              `由 $x = \\frac{x^{2} + ${r * s}}{${r + s}}$ 得 $(x - ${r})(x - ${s}) = 0$，所以不动点是 $${r}$ 和 $${s}$。`,
            ],
          ],
          [
            ["Find the direction", "确定方向"],
            [
              `$a_{n+1} - a_n = \\frac{(a_n - ${r})(a_n - ${s})}{${r + s}}$ is negative between $${r}$ and $${s}$, so the sequence decreases.`,
              `在 $${r}$ 和 $${s}$ 之间，$a_{n+1} - a_n = \\frac{(a_n - ${r})(a_n - ${s})}{${r + s}}$ 为负，所以数列递减。`,
            ],
          ],
          [
            ["Find the bound", "找出界"],
            [
              `$a_{n+1} - ${r} = \\frac{a_n^{2} - ${r * r}}{${r + s}} > 0$ whenever $a_n > ${r}$, so the sequence stays above $${r}$ and converges to the fixed point $${r}$.`,
              `只要 $a_n > ${r}$，就有 $a_{n+1} - ${r} = \\frac{a_n^{2} - ${r * r}}{${r + s}} > 0$，所以数列保持在 $${r}$ 之上，收敛到不动点 $${r}$。`,
            ],
          ],
        ],
        [
          `$a_2 = \\frac{${t * t} + ${r * s}}{${r + s}} = ${next.toLatex()}$, which lies between $${r}$ and $${t}$, as a decreasing sequence above $${r}$ requires.`,
          `$a_2 = \\frac{${t * t} + ${r * s}}{${r + s}} = ${next.toLatex()}$，它在 $${r}$ 和 $${t}$ 之间，与在 $${r}$ 之上递减的数列相符。`,
        ],
      ),
    );
  },
);

const harmonicGap = point(
  "a-gap-that-does-not-shrink",
  ["A gap that does not shrink", "不缩小的差距"],
  [
    "For a Cauchy sequence, it is not enough that consecutive terms get close. The harmonic partial sums have steps that tend to zero, yet $a_{2n} - a_n$ stays at least $\\frac{1}{2}$ for every $n$, because it has $n$ terms that are each at least $\\frac{1}{2n}$. So they are not Cauchy.\n\nFor $a_n = 1 + \\frac{1}{2} + \\cdots + \\frac{1}{n}$, the gap $a_4 - a_2 = \\frac{1}{3} + \\frac{1}{4} = \\frac{7}{12}$, which is above $\\frac{1}{2}$, although the step $a_4 - a_3 = \\frac{1}{4}$ is small.\n\nCheck: each of the two terms is at least $\\frac{1}{4}$, so their sum is at least $2 \\cdot \\frac{1}{4} = \\frac{1}{2}$, as the general argument says.\n\n> **Watch out.** The difference $a_{2n} - a_n$ keeps the terms from $\\frac{1}{n+1}$ to $\\frac{1}{2n}$, which is $n$ terms, not just the last one.",
    "对柯西数列来说，仅仅相邻项接近是不够的。调和级数部分和的步长趋于零，但对每个 $n$，$a_{2n} - a_n$ 都至少为 $\\frac{1}{2}$，因为它有 $n$ 项，每项至少为 $\\frac{1}{2n}$。所以它们不是柯西数列。\n\n对 $a_n = 1 + \\frac{1}{2} + \\cdots + \\frac{1}{n}$，差距 $a_4 - a_2 = \\frac{1}{3} + \\frac{1}{4} = \\frac{7}{12}$，大于 $\\frac{1}{2}$，尽管步长 $a_4 - a_3 = \\frac{1}{4}$ 很小。\n\n检验：两项中每一项都至少是 $\\frac{1}{4}$，所以它们的和至少是 $2 \\cdot \\frac{1}{4} = \\frac{1}{2}$，与一般的论证一致。\n\n> **注意。** 差 $a_{2n} - a_n$ 保留从 $\\frac{1}{n+1}$ 到 $\\frac{1}{2n}$ 的项，共 $n$ 项，而不只是最后一项。",
  ],
  (rng) => {
    const c = rng.int(1, 6);
    const n = rng.int(2, 6);
    let answer = Q.of(0);
    for (let k = n + 1; k <= 2 * n; k++) answer = answer.add(Q.of(c, k));
    const start = c === 1 ? "" : `${c}`;
    const terms = Array.from({ length: n }, (_, i) => `\\frac{${c}}{${n + 1 + i}}`).join(" + ");
    return solved(
      [
        `Let $a_n = ${start}\\left(1 + \\frac{1}{2} + \\cdots + \\frac{1}{n}\\right)$. Find $a_{${2 * n}} - a_{${n}}$.`,
        `设 $a_n = ${start}\\left(1 + \\frac{1}{2} + \\cdots + \\frac{1}{n}\\right)$。求 $a_{${2 * n}} - a_{${n}}$。`,
      ],
      answer,
      [
        why(
          Q.of(c, 2 * n),
          `That keeps only the last term $\\frac{${c}}{${2 * n}}$; there are $${n}$ terms.`,
          `这只保留了最后一项 $\\frac{${c}}{${2 * n}}$；共有 $${n}$ 项。`,
        ),
        why(
          Q.of(c, n),
          `That is $${n}$ copies of the last term, a lower bound; the earlier terms are larger.`,
          `这是 $${n}$ 个最后一项，只是一个下界；前面的项更大。`,
        ),
        why(
          Q.of(c, 2),
          `That is the general lower bound $${Q.of(c, 2).toLatex()}$, not the exact difference.`,
          `这是一般的下界 $${Q.of(c, 2).toLatex()}$，不是精确的差。`,
        ),
      ],
      solution(
        [
          [
            ["Cancel the common terms", "消去公共项"],
            [
              `$a_{${2 * n}} - a_{${n}}$ keeps the terms with denominators from $${n + 1}$ to $${2 * n}$: $${terms}$.`,
              `$a_{${2 * n}} - a_{${n}}$ 保留分母从 $${n + 1}$ 到 $${2 * n}$ 的项：$${terms}$。`,
            ],
          ],
          [
            ["Add them", "相加"],
            [`The sum is $${answer.toLatex()}$.`, `和是 $${answer.toLatex()}$。`],
          ],
        ],
        [
          `Each of the $${n}$ terms is at least $\\frac{${c}}{${2 * n}}$, so the sum is at least $${Q.of(c, 2).toLatex()}$, and indeed $${answer.toLatex()} > ${Q.of(c, 2).toLatex()}$. So such gaps do not tend to zero.`,
          `$${n}$ 项中每一项都至少是 $\\frac{${c}}{${2 * n}}$，所以和至少是 $${Q.of(c, 2).toLatex()}$，而确实 $${answer.toLatex()} > ${Q.of(c, 2).toLatex()}$。所以这样的差距不趋于零。`,
        ],
      ),
    );
  },
);

const classifyAlternating = point(
  "classifying-a-general-alternating-series",
  ["Classifying a general alternating series", "判断一般的交错级数"],
  [
    "An alternating sign alone proves nothing. First check that the terms tend to zero, since otherwise the series diverges. Then compare the absolute values with a $p$-series: convergence means absolute convergence, and divergence leaves conditional convergence by the alternating series test.\n\nFor $\\sum \\frac{(-1)^n}{\\sqrt{n}}$, the terms tend to zero and decrease in size, so the series converges. The absolute values $\\frac{1}{n^{1/2}}$ form a $p$-series with $p = \\frac{1}{2} \\le 1$, which diverges, so the convergence is conditional.\n\nCheck: for $\\sum \\frac{(-1)^n}{n^{2}}$ the absolute values form a $p$-series with $p = 2 > 1$, so that series converges absolutely, while $\\sum (-1)^n \\frac{n}{n + 1}$ diverges, because its terms tend to $\\pm 1$, not to zero.\n\n> **Watch out.** Test the terms first. The alternating series test needs terms that tend to zero, and a series whose terms do not tend to zero diverges whatever its signs.",
    "仅有交错符号不能说明什么。首先检查通项是否趋于零，否则级数发散。然后把绝对值与 $p$ 级数比较：收敛意味着绝对收敛，发散时由交错级数判别法得到条件收敛。\n\n对 $\\sum \\frac{(-1)^n}{\\sqrt{n}}$，通项趋于零且绝对值递减，所以级数收敛。绝对值 $\\frac{1}{n^{1/2}}$ 构成 $p = \\frac{1}{2} \\le 1$ 的 $p$ 级数，发散，所以是条件收敛。\n\n检验：对 $\\sum \\frac{(-1)^n}{n^{2}}$，绝对值构成 $p = 2 > 1$ 的 $p$ 级数，所以它绝对收敛；而 $\\sum (-1)^n \\frac{n}{n + 1}$ 发散，因为通项趋于 $\\pm 1$ 而不是零。\n\n> **注意。** 先检查通项。交错级数判别法要求通项趋于零，通项不趋于零的级数不管符号如何都发散。",
  ],
  (rng) => {
    const c = rng.int(2, 9);
    const absolutely: Pair = ["It converges absolutely", "它绝对收敛"];
    const conditionally: Pair = ["It converges conditionally", "它条件收敛"];
    const diverges: Pair = ["It diverges", "它发散"];
    const cases: { term: string; result: Pair; why: Pair }[] = [
      {
        term: `\\frac{(-1)^k k}{k + ${c}}`,
        result: diverges,
        why: [
          "The absolute values of the terms tend to $1$, so the terms do not tend to zero and the series diverges.",
          "通项的绝对值趋于 $1$，所以通项不趋于零，级数发散。",
        ],
      },
      {
        term: `\\frac{(-1)^k k^{2}}{k^{2} + ${c}}`,
        result: diverges,
        why: [
          "The absolute values of the terms tend to $1$, so the terms do not tend to zero and the series diverges.",
          "通项的绝对值趋于 $1$，所以通项不趋于零，级数发散。",
        ],
      },
      {
        term: `\\frac{(-1)^k}{k^{2} + ${c}}`,
        result: absolutely,
        why: [
          "The absolute values are below $\\frac{1}{k^{2}}$, and that series converges, so the convergence is absolute.",
          "绝对值小于 $\\frac{1}{k^{2}}$，而那个级数收敛，所以是绝对收敛。",
        ],
      },
      {
        term: `\\frac{(-1)^k k}{k^{3} + ${c}}`,
        result: absolutely,
        why: [
          "The absolute values are below $\\frac{1}{k^{2}}$, and that series converges, so the convergence is absolute.",
          "绝对值小于 $\\frac{1}{k^{2}}$，而那个级数收敛，所以是绝对收敛。",
        ],
      },
      {
        term: `\\frac{(-1)^k}{k + ${c}}`,
        result: conditionally,
        why: [
          "The absolute values behave like $\\frac{1}{k}$, whose series diverges, but they decrease to zero, so the alternating series test gives conditional convergence.",
          "绝对值的行为类似 $\\frac{1}{k}$，其级数发散，但它们递减趋于零，所以由交错级数判别法得条件收敛。",
        ],
      },
      {
        term: `\\frac{(-1)^k k}{k^{2} + ${c}}`,
        result: conditionally,
        why: [
          "The absolute values behave like $\\frac{1}{k}$, whose series diverges, but they eventually decrease to zero, so the alternating series test gives conditional convergence.",
          "绝对值的行为类似 $\\frac{1}{k}$，其级数发散，但它们最终递减趋于零，所以由交错级数判别法得条件收敛。",
        ],
      },
    ];
    const chosen = rng.pick(cases);
    const size = chosen.term.replace("(-1)^k ", "").replace("(-1)^k", "1");
    const steps: Record<string, [Pair, Pair, Pair]> = {
      [diverges[0]]: [
        [`The size of the terms is $${size}$, which tends to $1$, not $0$.`, `通项的大小是 $${size}$，它趋于 $1$，而不是 $0$。`],
        ["By the term test, a series whose terms do not tend to $0$ diverges.", "由通项检验法，通项不趋于 $0$ 的级数发散。"],
        [
          `At $k = 100$ the size is already within $\\frac{${c}}{100}$ of $1$, so the terms keep their size.`,
          `在 $k = 100$ 处，大小与 $1$ 的差已经小于 $\\frac{${c}}{100}$，所以通项的大小不会消失。`,
        ],
      ],
      [absolutely[0]]: [
        [`The size of the terms is $${size}$, which tends to $0$.`, `通项的大小是 $${size}$，它趋于 $0$。`],
        [
          "That size is below $\\frac{1}{k^{2}}$, and $\\sum \\frac{1}{k^{2}}$ converges, so the series converges absolutely.",
          "这个大小小于 $\\frac{1}{k^{2}}$，而 $\\sum \\frac{1}{k^{2}}$ 收敛，所以级数绝对收敛。",
        ],
        [
          `Adding $${c}$ to the denominator only makes the fraction smaller, so $${size} < \\frac{1}{k^{2}}$ for every $k$.`,
          `给分母加上 $${c}$ 只会使分数变小，所以对每个 $k$ 都有 $${size} < \\frac{1}{k^{2}}$。`,
        ],
      ],
      [conditionally[0]]: [
        [
          `The size of the terms is $${size}$. It is eventually decreasing to $0$, but $k$ times it tends to $1$, so it behaves like $\\frac{1}{k}$ and its series diverges.`,
          `通项的大小是 $${size}$。它最终递减趋于 $0$，但它乘 $k$ 趋于 $1$，所以它的行为类似 $\\frac{1}{k}$，其级数发散。`,
        ],
        [
          "The signs alternate and the sizes decrease to $0$, so the alternating series test gives convergence. The convergence is conditional.",
          "符号交错，大小递减趋于 $0$，所以由交错级数判别法，级数收敛。这是条件收敛。",
        ],
        [
          `At $k = 100$, $k$ times the size is within $\\frac{${c}}{100}$ of $1$, which confirms the comparison with $\\frac{1}{k}$.`,
          `在 $k = 100$ 处，大小乘 $k$ 与 $1$ 的差小于 $\\frac{${c}}{100}$，这证实了与 $\\frac{1}{k}$ 的比较。`,
        ],
      ],
    };
    const [first, second, check] = steps[chosen.result[0]] as [Pair, Pair, Pair];
    const against: Record<string, Record<string, Pair>> = {
      [diverges[0]]: {
        [absolutely[0]]: ["The sizes tend to $1$, so their series cannot converge.", "大小趋于 $1$，所以它们的级数不可能收敛。"],
        [conditionally[0]]: [
          "Convergence of any kind needs terms that tend to $0$, and these tend to $1$ in size.",
          "任何收敛都要求通项趋于 $0$，而这些通项的大小趋于 $1$。",
        ],
      },
      [absolutely[0]]: {
        [conditionally[0]]: [
          "The absolute values converge too, so the convergence is absolute, not merely conditional.",
          "绝对值之和也收敛，所以是绝对收敛，而不仅仅是条件收敛。",
        ],
        [diverges[0]]: [
          "The sizes are below $\\frac{1}{k^{2}}$, whose series converges, so the series converges.",
          "大小小于 $\\frac{1}{k^{2}}$，其级数收敛，所以级数收敛。",
        ],
      },
      [conditionally[0]]: {
        [absolutely[0]]: [
          "The sizes behave like $\\frac{1}{k}$, and $\\sum \\frac{1}{k}$ diverges.",
          "大小的行为类似 $\\frac{1}{k}$，而 $\\sum \\frac{1}{k}$ 发散。",
        ],
        [diverges[0]]: [
          "The sizes decrease to $0$ and the signs alternate, so the alternating series test gives convergence.",
          "大小递减趋于 $0$ 且符号交错，所以由交错级数判别法，级数收敛。",
        ],
      },
    };
    const reasons = Object.entries(against[chosen.result[0]] ?? {}).map(([o, w]): [string, string, string] => [o, w[0], w[1]]);
    return reasoned(
      choose(
        rng,
        [`What does $\\sum_{k=1}^{\\infty} ${chosen.term}$ do?`, `$\\sum_{k=1}^{\\infty} ${chosen.term}$ 的敛散性如何？`],
        chosen.result,
        [absolutely, conditionally, diverges].filter((o) => o !== chosen.result),
        asPair(
          solution(
            [
              [["Test the terms", "检验通项"], first],
              [["Compare the sizes", "比较大小"], second],
            ],
            check,
          ),
        ),
      ),
      reasons,
    );
  },
);

const absoluteRearrangement = point(
  "rearranging-an-absolutely-convergent-series",
  ["Rearranging an absolutely convergent series", "重排绝对收敛的级数"],
  [
    "An absolutely convergent series keeps its sum under every rearrangement, however the terms are shuffled. So a rearranged geometric series with ratio between $-1$ and $1$ still has the sum of the original, and the original sum can be used without following the new order.\n\nFor $\\sum_{n \\ge 0} \\left(-\\frac{1}{2}\\right)^{n}$, the absolute values form $\\sum \\frac{1}{2^{n}} = 2$, which is finite. So any rearrangement has the original sum $\\frac{1}{1 + \\frac{1}{2}} = \\frac{2}{3}$.\n\nCheck: the partial sums of the original order are $1, \\frac{1}{2}, \\frac{3}{4}, \\frac{5}{8}$, closing in on $\\frac{2}{3}$ from both sides.\n\n> **Watch out.** The ratio is negative, so the denominator is $1 + \\frac{1}{r}$, not $1 - \\frac{1}{r}$. And only absolute convergence protects the sum: a conditionally convergent series can be rearranged to any sum.",
    "绝对收敛的级数无论如何重排，和都不变。所以公比在 $-1$ 和 $1$ 之间的几何级数重排后仍有原来的和，可以直接用原来的和，而不必追踪新的次序。\n\n对 $\\sum_{n \\ge 0} \\left(-\\frac{1}{2}\\right)^{n}$，绝对值构成 $\\sum \\frac{1}{2^{n}} = 2$，是有限的。所以任何重排都有原来的和 $\\frac{1}{1 + \\frac{1}{2}} = \\frac{2}{3}$。\n\n检验：原来次序的部分和是 $1, \\frac{1}{2}, \\frac{3}{4}, \\frac{5}{8}$，从两侧逼近 $\\frac{2}{3}$。\n\n> **注意。** 公比是负的，所以分母是 $1 + \\frac{1}{r}$，不是 $1 - \\frac{1}{r}$。而且只有绝对收敛才能保住和：条件收敛的级数可以重排成任意的和。",
  ],
  (rng) => {
    const c = rng.int(1, 9);
    const r = rng.int(2, 9);
    const answer = Q.of(c * r, r + 1);
    const start = c === 1 ? "" : `${c}`;
    return solved(
      [
        `Rearrange $\\sum_{n \\ge 0} ${start}\\left(-\\frac{1}{${r}}\\right)^{n}$ so that two positive terms come before each negative term. What is the sum of the new series?`,
        `重排 $\\sum_{n \\ge 0} ${start}\\left(-\\frac{1}{${r}}\\right)^{n}$，使每个负项之前有两个正项。新级数的和是多少？`,
      ],
      answer,
      [
        why(
          Q.of(c * r * r, r * r - 1),
          "That is the sum of the positive terms alone; the negative terms still come, only later.",
          "这只是正项的和；负项仍然都会出现，只是出现得晚一些。",
        ),
        why(
          Q.of(c * r, r - 1),
          "That is the sum of the absolute values, which drops the minus signs of the odd terms.",
          "这是绝对值的和，丢掉了奇数项的负号。",
        ),
        why(Q.of(c), "That is only the first term, not the sum of the series.", "这只是第一项，不是级数的和。"),
      ],
      solution(
        [
          [
            ["Check absolute convergence", "检验绝对收敛"],
            [
              `The absolute values form a geometric series with ratio $\\frac{1}{${r}} < 1$, so the series converges absolutely and every rearrangement has the same sum.`,
              `绝对值构成公比为 $\\frac{1}{${r}} < 1$ 的几何级数，所以级数绝对收敛，每种重排的和都相同。`,
            ],
          ],
          [
            ["Sum the original order", "按原来的次序求和"],
            [
              `The geometric sum is $\\frac{${c}}{1 + \\frac{1}{${r}}} = ${answer.toLatex()}$.`,
              `几何级数的和是 $\\frac{${c}}{1 + \\frac{1}{${r}}} = ${answer.toLatex()}$。`,
            ],
          ],
        ],
        [
          `Multiplying $${answer.toLatex()}$ by $1 + \\frac{1}{${r}} = \\frac{${r + 1}}{${r}}$ gives back the first term $${c}$.`,
          `把 $${answer.toLatex()}$ 乘以 $1 + \\frac{1}{${r}} = \\frac{${r + 1}}{${r}}$，又得到第一项 $${c}$。`,
        ],
      ),
    );
  },
);

const cauchyProductReverse = point(
  "recovering-a-factor-of-a-cauchy-product",
  ["Recovering a factor of a Cauchy product", "还原柯西积的因子"],
  [
    "The Cauchy product is built from $c_n = \\sum_{k=0}^{n} a_k b_{n-k}$. If the $a_k$ and the $c_n$ are known and $a_0 \\ne 0$, these equations can be solved one at a time for the $b_n$, in the same way as long division of power series.\n\nLet $a_0, a_1, a_2 = 1, 2, 1$ and $c_0, c_1, c_2 = 2, 5, 7$. Then $c_0 = a_0 b_0$ gives $b_0 = 2$, $c_1 = a_0 b_1 + a_1 b_0$ gives $5 = b_1 + 4$, so $b_1 = 1$, and $c_2 = a_0 b_2 + a_1 b_1 + a_2 b_0$ gives $7 = b_2 + 2 + 2$, so $b_2 = 3$.\n\nCheck: the products $a_0 b_2, a_1 b_1, a_2 b_0$ are $3, 2, 2$, and they add to $7 = c_2$.\n\n> **Watch out.** Each $c_n$ contains every product whose indices add to $n$. Leaving one of them out is the usual slip, and so is forgetting to divide by $a_0$.",
    "柯西积由 $c_n = \\sum_{k=0}^{n} a_k b_{n-k}$ 构成。如果已知 $a_k$ 和 $c_n$，且 $a_0 \\ne 0$，那么可以逐个解这些方程求出 $b_n$，这与幂级数的长除法相同。\n\n设 $a_0, a_1, a_2 = 1, 2, 1$，$c_0, c_1, c_2 = 2, 5, 7$。由 $c_0 = a_0 b_0$ 得 $b_0 = 2$；由 $c_1 = a_0 b_1 + a_1 b_0$ 得 $5 = b_1 + 4$，所以 $b_1 = 1$；由 $c_2 = a_0 b_2 + a_1 b_1 + a_2 b_0$ 得 $7 = b_2 + 2 + 2$，所以 $b_2 = 3$。\n\n检验：乘积 $a_0 b_2, a_1 b_1, a_2 b_0$ 是 $3, 2, 2$，相加得 $7 = c_2$。\n\n> **注意。** 每个 $c_n$ 包含下标之和为 $n$ 的所有乘积。漏掉其中一个是常见的错误，忘了除以 $a_0$ 也是。",
  ],
  (rng) => {
    const a0 = rng.pick([1, -1]);
    const a1 = rng.int(-5, 5);
    const a2 = rng.int(-5, 5);
    const b0 = rng.pick([-3, -2, -1, 1, 2, 3, 4]);
    const b1 = rng.int(-5, 5);
    const b2 = rng.int(-6, 6);
    const c0 = a0 * b0;
    const c1 = a0 * b1 + a1 * b0;
    const c2 = a0 * b2 + a1 * b1 + a2 * b0;
    return solved(
      [
        `The series $\\sum a_n$ begins with $a_0, a_1, a_2 = ${a0}, ${a1}, ${a2}$, and its Cauchy product with $\\sum b_n$ begins with $c_0, c_1, c_2 = ${c0}, ${c1}, ${c2}$. Find $b_2$.`,
        `级数 $\\sum a_n$ 以 $a_0, a_1, a_2 = ${a0}, ${a1}, ${a2}$ 开始，它与 $\\sum b_n$ 的柯西积以 $c_0, c_1, c_2 = ${c0}, ${c1}, ${c2}$ 开始。求 $b_2$。`,
      ],
      b2,
      [
        why(
          c2,
          "That takes $c_2$ itself, as if $c_2 = a_0 b_2$; the products $a_1 b_1$ and $a_2 b_0$ are left in.",
          "这是直接取 $c_2$，好像 $c_2 = a_0 b_2$；乘积 $a_1 b_1$ 和 $a_2 b_0$ 没有减去。",
        ),
        why(a0 * (c2 - a2 * b0), `That forgets the product $a_1 b_1 = ${a1 * b1}$.`, `这忘了乘积 $a_1 b_1 = ${a1 * b1}$。`),
        why(a0 * (c2 - a1 * b1), `That forgets the product $a_2 b_0 = ${a2 * b0}$.`, `这忘了乘积 $a_2 b_0 = ${a2 * b0}$。`),
      ],
      solution(
        [
          [
            ["Solve for the first two terms", "先解出前两项"],
            [
              `$c_0 = a_0 b_0$ gives $b_0 = ${b0}$, and $c_1 = a_0 b_1 + a_1 b_0$ gives $b_1 = ${b1}$.`,
              `由 $c_0 = a_0 b_0$ 得 $b_0 = ${b0}$，由 $c_1 = a_0 b_1 + a_1 b_0$ 得 $b_1 = ${b1}$。`,
            ],
          ],
          [
            ["Solve the third equation", "解第三个方程"],
            [
              `$c_2 = a_0 b_2 + a_1 b_1 + a_2 b_0$ becomes $${c2} = ${poly([a0, "b_2"], [a1 * b1 + a2 * b0, ""])}$, so $b_2 = ${b2}$.`,
              `$c_2 = a_0 b_2 + a_1 b_1 + a_2 b_0$ 变为 $${c2} = ${poly([a0, "b_2"], [a1 * b1 + a2 * b0, ""])}$，所以 $b_2 = ${b2}$。`,
            ],
          ],
        ],
        [
          `The products $a_0 b_2, a_1 b_1, a_2 b_0$ are $${a0 * b2}, ${a1 * b1}, ${a2 * b0}$, and they add to $${c2} = c_2$.`,
          `乘积 $a_0 b_2, a_1 b_1, a_2 b_0$ 是 $${a0 * b2}, ${a1 * b1}, ${a2 * b0}$，相加得 $${c2} = c_2$。`,
        ],
      ),
    );
  },
);

const removingDiscontinuity = point(
  "the-value-that-removes-a-discontinuity",
  ["The value that removes a discontinuity", "消除间断的值"],
  [
    "A removable discontinuity has a limit but the wrong value or no value at the point. To remove it, set the value equal to the limit. For a rational function, cancel the common factor first, because the limit is not found by substituting into the original fraction.\n\nFor $f(x) = \\frac{x^{2} - 5x + 6}{x - 2}$, the numerator is $(x - 2)(x - 3)$, so $f(x) = x - 3$ for $x \\ne 2$. The limit at $2$ is $-1$, and setting $f(2) = -1$ makes $f$ continuous.\n\nCheck: the cancelled form agrees with $f$ away from $2$; at $x = 4$, $\\frac{16 - 20 + 6}{2} = 1 = 4 - 3$.\n\n> **Watch out.** Substituting $x = 2$ into the original fraction gives $\\frac{0}{0}$, which is no value at all. Evaluate the cancelled form, and keep the sign of the remaining factor.",
    "可去间断点处有极限，但函数值错误或没有定义。要消除它，就令函数值等于极限。对有理函数要先约去公因式，因为极限不能通过代入原来的分式求得。\n\n对 $f(x) = \\frac{x^{2} - 5x + 6}{x - 2}$，分子是 $(x - 2)(x - 3)$，所以 $x \\ne 2$ 时 $f(x) = x - 3$。在 $2$ 处的极限是 $-1$，令 $f(2) = -1$ 就使 $f$ 连续。\n\n检验：约分后的形式在 $2$ 以外与 $f$ 一致；在 $x = 4$ 处，$\\frac{16 - 20 + 6}{2} = 1 = 4 - 3$。\n\n> **注意。** 把 $x = 2$ 代入原来的分式得到 $\\frac{0}{0}$，这根本不是一个值。要用约分后的形式求值，并保留剩下因式的符号。",
  ],
  (rng) => {
    const a = rng.int(1, 9);
    let b = rng.pick([-9, -7, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 7, 8]);
    if (b === a) b = a + 1;
    const top = poly([1, "x^{2}"], [-(a + b), "x"], [a * b, ""]);
    const answer = a - b;
    const rest = poly([1, "x"], [-b, ""]);
    return solved(
      [
        `The function $f(x) = \\frac{${top}}{x - ${a}}$ is not defined at $x = ${a}$. What value of $f(${a})$ makes $f$ continuous there?`,
        `函数 $f(x) = \\frac{${top}}{x - ${a}}$ 在 $x = ${a}$ 处没有定义。$f(${a})$ 取什么值时 $f$ 在该点连续？`,
      ],
      answer,
      [
        why(a + b, `That takes the remaining factor with the wrong sign; it is $${rest}$.`, `这把剩下因式的符号弄错了；它是 $${rest}$。`),
        why(a, "That is the point itself, not the value of the function there.", "这是那个点本身，不是函数在该点的值。"),
        why(b, "That is the other zero of the numerator, not the limit at the point.", "这是分子的另一个零点，不是在该点的极限。"),
      ],
      solution(
        [
          [
            ["Factor and cancel", "分解并约分"],
            [
              `The numerator is $(x - ${a})(${rest})$, so $f(x) = ${rest}$ for $x \\ne ${a}$.`,
              `分子是 $(x - ${a})(${rest})$，所以 $x \\ne ${a}$ 时 $f(x) = ${rest}$。`,
            ],
          ],
          [
            ["Take the limit", "求极限"],
            [
              `As $x \\to ${a}$, $${rest} \\to ${answer}$, so the value $f(${a}) = ${answer}$ makes $f$ continuous.`,
              `当 $x \\to ${a}$ 时，$${rest} \\to ${answer}$，所以令 $f(${a}) = ${answer}$ 就使 $f$ 连续。`,
            ],
          ],
        ],
        [
          `Expanding $(x - ${a})(${rest})$ gives back $${top}$, so the cancellation is right.`,
          `展开 $(x - ${a})(${rest})$ 又得到 $${top}$，所以约分是对的。`,
        ],
      ),
    );
  },
);

const rationalIrrational = point(
  "continuity-of-a-function-split-by-rationality",
  ["Continuity of a function split by rationality", "按有理性分段的函数的连续性"],
  [
    "Every point is a limit of rational numbers and also a limit of irrational numbers. So if a function follows one formula on the rationals and another on the irrationals, the sequential criterion allows continuity only at points where the two formulas agree.\n\nLet $f(x) = 2x + 1$ for rational $x$ and $f(x) = 4 - x$ for irrational $x$. The formulas agree when $2x + 1 = 4 - x$, that is at $x = 1$, where both give $3$. So $f$ is continuous at $1$ and nowhere else.\n\nCheck: at $x = 0$, rational points near $0$ give values near $1$ and irrational points give values near $4$, so $f$ jumps there.\n\n> **Watch out.** Solve the equation carefully: collect the $x$ terms on one side and the constants on the other, and divide by the difference of the slopes.",
    "每个点既是有理数的极限，也是无理数的极限。所以如果函数在有理数上用一个公式，在无理数上用另一个公式，序列判据只允许它在两个公式相等的点连续。\n\n设有理数 $x$ 处 $f(x) = 2x + 1$，无理数 $x$ 处 $f(x) = 4 - x$。两个公式在 $2x + 1 = 4 - x$ 时相等，即在 $x = 1$ 处，两者都给出 $3$。所以 $f$ 在 $1$ 处连续，在别处都不连续。\n\n检验：在 $x = 0$ 处，附近的有理点给出接近 $1$ 的值，无理点给出接近 $4$ 的值，所以 $f$ 在那里跳跃。\n\n> **注意。** 解方程要仔细：把含 $x$ 的项移到一边，常数移到另一边，再除以两个斜率之差。",
  ],
  (rng) => {
    const a = rng.int(-5, 6);
    let c = rng.int(-5, 6);
    if (c === a) c = a + 1;
    const b = rng.int(-9, 9);
    let d = rng.int(-9, 9);
    if (d === b) d = b + 1;
    const answer = Q.of(d - b, a - c);
    const first = poly([a, "x"], [b, ""]) || "0";
    const second = poly([c, "x"], [d, ""]) || "0";
    const value = Q.of(a).mul(answer).add(Q.of(b));
    const zero = answer.neg().eq(answer);
    return solved(
      [
        `Let $f(x) = ${first}$ for rational $x$ and $f(x) = ${second}$ for irrational $x$. At which point is $f$ continuous?`,
        `当 $x$ 为有理数时，$f(x) = ${first}$；当 $x$ 为无理数时，$f(x) = ${second}$。$f$ 在哪一点连续？`,
      ],
      answer,
      [
        zero
          ? why(
              1,
              `At $x = 1$ the formulas give $${a + b}$ and $${c + d}$, which differ.`,
              `在 $x = 1$ 处，两个公式给出 $${a + b}$ 和 $${c + d}$，两者不同。`,
            )
          : why(
              answer.neg(),
              "That has the sign reversed; recheck which side each term moves to.",
              "这把符号弄反了；重新检查每一项移到哪一边。",
            ),
        why(Q.of(d + b, a - c), `That moves the constant $${b}$ across without changing its sign.`, `这是把常数 $${b}$ 移过去时没有变号。`),
        why(Q.of(d - b, 1), `That forgets to divide by the difference of the slopes, $${a - c}$.`, `这忘了除以两个斜率之差 $${a - c}$。`),
      ],
      solution(
        [
          [
            ["Use both kinds of sequence", "用两种序列"],
            [
              `A rational sequence tending to $x$ gives values tending to $${first}$, and an irrational one gives values tending to $${second}$. Continuity needs these to agree.`,
              `趋于 $x$ 的有理数列给出趋于 $${first}$ 的值，无理数列给出趋于 $${second}$ 的值。连续性要求两者相等。`,
            ],
          ],
          [
            ["Solve for the point", "解出这一点"],
            [
              `$${first} = ${second}$ gives $${poly([a - c, "x"])} = ${d - b}$, so $x = ${answer.toLatex()}$.`,
              `由 $${first} = ${second}$ 得 $${poly([a - c, "x"])} = ${d - b}$，所以 $x = ${answer.toLatex()}$。`,
            ],
          ],
        ],
        [
          `At $x = ${answer.toLatex()}$ both formulas give $${value.toLatex()}$, so the values near it from either kind of number approach $f(${answer.toLatex()})$.`,
          `在 $x = ${answer.toLatex()}$ 处，两个公式都给出 $${value.toLatex()}$，所以两种数在它附近的值都趋于 $f(${answer.toLatex()})$。`,
        ],
      ),
    );
  },
);

const threeBisections = point(
  "the-interval-after-three-bisections",
  ["The interval after three bisections", "三次二分后的区间"],
  [
    "Each step of bisection evaluates at the midpoint and keeps the half on which the sign changes, so the root stays trapped. After $n$ steps, the interval has length $\\frac{1}{2^{n}}$ of the original, and its endpoints come from following the choices one at a time.\n\nTo solve $x^{2} = 2$ from $[1, 3]$: the midpoint $2$ has $2^{2} = 4 > 2$, so keep $[1, 2]$; the midpoint $\\frac{3}{2}$ has square $\\frac{9}{4} > 2$, so keep $\\left[1, \\frac{3}{2}\\right]$; the midpoint $\\frac{5}{4}$ has square $\\frac{25}{16} < 2$, so keep $\\left[\\frac{5}{4}, \\frac{3}{2}\\right]$.\n\nCheck: $\\frac{25}{16} < 2 < \\frac{9}{4}$, so the root is still trapped, and the length is $\\frac{1}{4}$, which is $\\frac{1}{8}$ of the original length $2$.\n\n> **Watch out.** Compare the square of each midpoint with the target, not the midpoint itself. And the third midpoint need not be the left endpoint: it is the left end only when its square is too small.",
    "二分法的每一步都在中点求值，并保留符号变化的那一半，所以根始终被夹住。经过 $n$ 步后，区间的长度是原来的 $\\frac{1}{2^{n}}$，它的端点要逐次根据选择得出。\n\n从 $[1, 3]$ 开始解 $x^{2} = 2$：中点 $2$ 满足 $2^{2} = 4 > 2$，保留 $[1, 2]$；中点 $\\frac{3}{2}$ 的平方 $\\frac{9}{4} > 2$，保留 $\\left[1, \\frac{3}{2}\\right]$；中点 $\\frac{5}{4}$ 的平方 $\\frac{25}{16} < 2$，保留 $\\left[\\frac{5}{4}, \\frac{3}{2}\\right]$。\n\n检验：$\\frac{25}{16} < 2 < \\frac{9}{4}$，所以根仍被夹住，长度是 $\\frac{1}{4}$，是原长 $2$ 的 $\\frac{1}{8}$。\n\n> **注意。** 要把每个中点的平方与目标比较，而不是中点本身。而且第三个中点不一定是左端点：只有当它的平方太小时，它才是左端。",
  ],
  (rng) => {
    const m = rng.int(1, 9);
    let N = rng.int(m * m + 1, (m + 2) * (m + 2) - 1);
    if (Number.isInteger(Math.sqrt(N))) N += 1;
    let lo = 4 * m;
    let hi = 4 * m + 8;
    const tests: Pair[] = [];
    for (let i = 0; i < 3; i++) {
      const mid = (lo + hi) / 2;
      const at = Q.of(mid, 4).toLatex();
      const square = Q.of(mid * mid, 16).toLatex();
      if (mid * mid < 16 * N) {
        lo = mid;
        tests.push([
          `$\\left(${at}\\right)^{2} = ${square} < ${N}$, keep the right half`,
          `$\\left(${at}\\right)^{2} = ${square} < ${N}$，保留右半`,
        ]);
      } else {
        hi = mid;
        tests.push([
          `$\\left(${at}\\right)^{2} = ${square} > ${N}$, keep the left half`,
          `$\\left(${at}\\right)^{2} = ${square} > ${N}$，保留左半`,
        ]);
      }
    }
    const answer = Q.of(lo, 4);
    const right = Q.of(hi, 4);
    return solved(
      [
        `To solve $x^{2} = ${N}$, bisection starts on $[${m}, ${m + 2}]$. What is the left endpoint of the interval kept after three steps?`,
        `为解 $x^{2} = ${N}$，二分法从 $[${m}, ${m + 2}]$ 开始。三步后保留的区间的左端点是多少？`,
      ],
      answer,
      [
        why(right, "That is the right endpoint of the kept interval.", "这是保留区间的右端点。"),
        why(Q.of(m + 1), "That is the first midpoint; two more steps still move the endpoints.", "这是第一个中点；后面两步还会移动端点。"),
        why(
          Q.of(Math.floor(Math.sqrt(N))),
          "That is the whole part of the root, not an endpoint that bisection produces.",
          "这是根的整数部分，不是二分法得到的端点。",
        ),
      ],
      solution(
        [
          [
            ["Test the midpoints", "检验中点"],
            [`${tests.map((test) => test[0]).join("; ")}.`, `${tests.map((test) => test[1]).join("；")}。`],
          ],
          [
            ["Read off the interval", "读出区间"],
            [
              `The interval kept is $\\left[${answer.toLatex()}, ${right.toLatex()}\\right]$, so its left endpoint is $${answer.toLatex()}$.`,
              `保留的区间是 $\\left[${answer.toLatex()}, ${right.toLatex()}\\right]$，所以左端点是 $${answer.toLatex()}$。`,
            ],
          ],
        ],
        [
          `The square of $${answer.toLatex()}$ is below $${N}$ and the square of $${right.toLatex()}$ is above it, and the length is $\\frac{1}{4}$, an eighth of the original $2$.`,
          `$${answer.toLatex()}$ 的平方小于 $${N}$，$${right.toLatex()}$ 的平方大于它，长度是 $\\frac{1}{4}$，是原长 $2$ 的八分之一。`,
        ],
      ),
    );
  },
);

const contractionBound = point(
  "the-error-bound-of-a-contraction",
  ["The error bound of a contraction", "压缩映射的误差界"],
  [
    "On a complete metric space, a contraction with constant $q < 1$ has a unique fixed point $x^{*}$, and completeness is what makes the iterates converge to it. The estimate $d(x_n, x^{*}) \\le \\frac{q^{n}}{1 - q} d(x_0, x_1)$ bounds the error before the limit is known.\n\nWith $q = \\frac{1}{2}$, $d(x_0, x_1) = 3$ and $n = 2$: $q^{2} = \\frac{1}{4}$ and $1 - q = \\frac{1}{2}$, so the bound is $\\frac{1/4}{1/2} \\times 3 = \\frac{3}{2}$.\n\nCheck: the steps from $x_2$ onward are at most $\\frac{3}{4}, \\frac{3}{8}, \\frac{3}{16}, \\dots$, and these add to $\\frac{3}{2}$.\n\n> **Watch out.** Dividing by $1 - q = \\frac{k - 1}{k}$ multiplies by $\\frac{k}{k - 1}$; do not divide by $k - 1$ alone.",
    "在完备度量空间上，常数 $q < 1$ 的压缩映射有唯一不动点 $x^{*}$，完备性正是迭代收敛到它的原因。估计式 $d(x_n, x^{*}) \\le \\frac{q^{n}}{1 - q} d(x_0, x_1)$ 在极限未知时就给出误差的界。\n\n取 $q = \\frac{1}{2}$，$d(x_0, x_1) = 3$，$n = 2$：$q^{2} = \\frac{1}{4}$，$1 - q = \\frac{1}{2}$，所以界是 $\\frac{1/4}{1/2} \\times 3 = \\frac{3}{2}$。\n\n检验：从 $x_2$ 起的各步至多是 $\\frac{3}{4}, \\frac{3}{8}, \\frac{3}{16}, \\dots$，它们相加得 $\\frac{3}{2}$。\n\n> **注意。** 除以 $1 - q = \\frac{k - 1}{k}$ 就是乘以 $\\frac{k}{k - 1}$；不要只除以 $k - 1$。",
  ],
  (rng) => {
    const k = rng.int(2, 5);
    const n = rng.int(2, 5);
    const D = rng.int(1, 12);
    const answer = Q.of(D * k, k ** n * (k - 1));
    return solved(
      [
        `A contraction on a complete metric space has constant $q = \\frac{1}{${k}}$, and its iterates have $d(x_0, x_1) = ${D}$. What upper bound does the standard estimate give for $d(x_{${n}}, x^{*})$?`,
        `完备度量空间上的压缩映射的常数为 $q = \\frac{1}{${k}}$，其迭代满足 $d(x_0, x_1) = ${D}$。标准估计式给出 $d(x_{${n}}, x^{*})$ 的什么上界？`,
      ],
      answer,
      [
        why(
          Q.of(D, k ** n),
          "That is only the size of the next step; the factor $\\frac{1}{1 - q}$ adds the steps after it.",
          "这只是下一步的大小；因子 $\\frac{1}{1 - q}$ 把之后的各步也加上。",
        ),
        why(
          Q.of(D * k, k - 1),
          `That leaves out $q^{${n}}$; it is the bound for $x_0$, before any iteration.`,
          `这漏掉了 $q^{${n}}$；它是迭代之前 $x_0$ 的界。`,
        ),
        why(
          Q.of(D, k ** n * (k - 1)),
          `That divides by $${k - 1}$ instead of by $1 - q = \\frac{${k - 1}}{${k}}$.`,
          `这是除以 $${k - 1}$，而不是除以 $1 - q = \\frac{${k - 1}}{${k}}$。`,
        ),
      ],
      solution(
        [
          [
            ["Compute the factors", "计算各因子"],
            [
              `$q^{${n}} = \\frac{1}{${k ** n}}$ and $1 - q = \\frac{${k - 1}}{${k}}$, so $\\frac{q^{${n}}}{1 - q} = ${Q.of(k, k ** n * (k - 1)).toLatex()}$.`,
              `$q^{${n}} = \\frac{1}{${k ** n}}$，$1 - q = \\frac{${k - 1}}{${k}}$，所以 $\\frac{q^{${n}}}{1 - q} = ${Q.of(k, k ** n * (k - 1)).toLatex()}$。`,
            ],
          ],
          [
            ["Scale by the first step", "乘以第一步的距离"],
            [
              `Multiplying by $d(x_0, x_1) = ${D}$ gives the bound $${answer.toLatex()}$.`,
              `乘以 $d(x_0, x_1) = ${D}$，得到上界 $${answer.toLatex()}$。`,
            ],
          ],
        ],
        [
          `The steps from $x_{${n}}$ onward are at most $${Q.of(D, k ** n).toLatex()}$, then $${Q.of(D, k ** (n + 1)).toLatex()}$, and so on, a geometric series whose sum is $${answer.toLatex()}$.`,
          `从 $x_{${n}}$ 起的各步至多是 $${Q.of(D, k ** n).toLatex()}$，然后是 $${Q.of(D, k ** (n + 1)).toLatex()}$，依此类推，这个几何级数的和是 $${answer.toLatex()}$。`,
        ],
      ),
    );
  },
);

const subsequenceLimit = point(
  "the-largest-limit-of-a-subsequence",
  ["The largest limit of a subsequence", "子列的最大极限"],
  [
    "A sequence in a compact interval always has a convergent subsequence, by Bolzano and Weierstrass, even if the sequence itself diverges. Different subsequences can have different limits, and terms that shrink away, such as those with $\\frac{1}{n}$, do not affect any of them.\n\nFor $x_n = 3(-1)^{n} + 1 + \\frac{5}{n}$, the even terms $4 + \\frac{5}{n}$ tend to $4$, and the odd terms $-2 + \\frac{5}{n}$ tend to $-2$. So the largest limit of a subsequence is $4$.\n\nCheck: every term lies between $-2$ and $9$, so the sequence stays in a compact interval, and any convergent subsequence has a limit of $4$ or $-2$.\n\n> **Watch out.** The term $\\frac{5}{n}$ makes the early terms larger, but it vanishes in every limit. Do not add it to the answer.",
    "由波尔查诺-魏尔斯特拉斯定理，紧区间中的数列总有收敛子列，即使数列本身发散。不同的子列可以有不同的极限，而像含 $\\frac{1}{n}$ 这样逐渐消失的项不影响任何极限。\n\n对 $x_n = 3(-1)^{n} + 1 + \\frac{5}{n}$，偶数项 $4 + \\frac{5}{n}$ 趋于 $4$，奇数项 $-2 + \\frac{5}{n}$ 趋于 $-2$。所以子列极限的最大值是 $4$。\n\n检验：每一项都在 $-2$ 和 $9$ 之间，所以数列留在一个紧区间内，任何收敛子列的极限都是 $4$ 或 $-2$。\n\n> **注意。** $\\frac{5}{n}$ 这一项使前面的项更大，但它在每个极限中都消失。不要把它加到答案里。",
  ],
  (rng) => {
    const a = rng.int(1, 9);
    const c = rng.int(-9, 9);
    const d = rng.int(1, 9);
    const x = poly([a, "(-1)^{n}"], [c, ""], [1, `\\frac{${d}}{n}`]);
    const answer = a + c;
    return solved(
      [
        `The sequence $x_n = ${x}$ diverges, but it has convergent subsequences. What is the largest limit of a convergent subsequence?`,
        `数列 $x_n = ${x}$ 发散，但它有收敛子列。收敛子列的极限的最大值是多少？`,
      ],
      answer,
      [
        why(
          a + c + d,
          `That keeps $\\frac{${d}}{n}$ at its value for $n = 1$; it tends to $0$.`,
          `这是让 $\\frac{${d}}{n}$ 保持 $n = 1$ 时的值；它趋于 $0$。`,
        ),
        why(c, `That is the centre of the oscillation, which no subsequence approaches.`, `这是振荡的中心，没有子列趋近它。`),
        why(
          c - a,
          `That is the limit of the odd terms, the smallest limit, not the largest.`,
          `这是奇数项的极限，是最小的极限，不是最大的。`,
        ),
      ],
      solution(
        [
          [
            ["Drop the vanishing term", "去掉趋于零的项"],
            [`$\\frac{${d}}{n} \\to 0$, so it affects no limit.`, `$\\frac{${d}}{n} \\to 0$，所以它不影响任何极限。`],
          ],
          [
            ["Split by parity", "按奇偶分开"],
            [
              `The even terms tend to $${c} + ${a} = ${c + a}$ and the odd terms to $${c} - ${a} = ${c - a}$. The largest limit is $${answer}$.`,
              `偶数项趋于 $${c} + ${a} = ${c + a}$，奇数项趋于 $${c} - ${a} = ${c - a}$。最大的极限是 $${answer}$。`,
            ],
          ],
        ],
        [
          `Every subsequence has infinitely many even terms or infinitely many odd terms, so a convergent one tends to $${c + a}$ or $${c - a}$, and $${c + a} > ${c - a}$.`,
          `每个子列都有无穷多个偶数项或无穷多个奇数项，所以收敛的子列趋于 $${c + a}$ 或 $${c - a}$，而 $${c + a} > ${c - a}$。`,
        ],
      ),
    );
  },
);

const lebesgueNumber = point(
  "the-overlap-of-a-cover",
  ["The overlap of a cover", "覆盖的重叠"],
  [
    "When an open cover is made of overlapping intervals, a short interval fits inside a single member only if it is shorter than a limit set by the overlap. A Lebesgue number of an open cover is a $\\delta > 0$ such that every set of diameter less than $\\delta$ lies inside a single member of the cover. An open cover of a compact set always has one, and it is the number behind many proofs by compactness. For overlapping open intervals, the danger is an interval that reaches past the overlap of two neighbours: it sticks out of both.\n\nThe intervals $(2k - 3, 2k + 3)$ have half-width $3$ and centers $2$ apart. Neighbours such as $(-3, 3)$ and $(-1, 5)$ overlap in $(-1, 3)$, of length $6 - 2 = 4$, so the largest such $\\delta$ is $4$.\n\nCheck: the closed interval $[-1, 3]$ has length $4$, and it lies in no member, because each open member misses at least one of its ends.\n\n> **Watch out.** The answer is the length of the overlap, the width $2w$ minus the spacing, not the width of one interval or the spacing itself.",
    "当开覆盖由互相重叠的区间组成时，只有比重叠所确定的界限更短的小区间，才能放进单个成员之内。开覆盖的勒贝格数是这样一个 $\\delta > 0$：每个直径小于 $\\delta$ 的集合都落在覆盖的某一个成员之内。紧集的开覆盖总有勒贝格数，许多紧性证明都依赖它。对于互相重叠的开区间，危险在于小区间越过两个相邻区间的重叠部分：这时它同时伸出这两个区间。\n\n区间 $(2k - 3, 2k + 3)$ 的半宽是 $3$，中心间距是 $2$。相邻的 $(-3, 3)$ 和 $(-1, 5)$ 重叠于 $(-1, 3)$，长度为 $6 - 2 = 4$，所以这样的最大 $\\delta$ 是 $4$。\n\n检验：闭区间 $[-1, 3]$ 的长度是 $4$，它不落在任何成员内，因为每个开成员都至少缺它的一个端点。\n\n> **注意。** 答案是重叠部分的长度，即宽度 $2w$ 减去间距，不是一个区间的宽度，也不是间距本身。",
  ],
  (rng) => {
    const w = rng.int(2, 9);
    const s = rng.int(1, 2 * w - 1);
    const answer = 2 * w - s;
    const center = s === 1 ? "k" : `${s}k`;
    const longer = (value: number) =>
      why(
        value,
        `That is longer than the overlap $${answer}$ of two neighbours, so an interval that long can stick out of both.`,
        `这比两个相邻区间的重叠 $${answer}$ 更长，所以这么长的区间可能同时伸出两者。`,
      );
    return solved(
      [
        `The open intervals $(${center} - ${w}, ${center} + ${w})$, for all integers $k$, cover the real line. What is the largest $\\delta$ such that every closed interval of length less than $\\delta$ lies inside one of them?`,
        `对所有整数 $k$，开区间 $(${center} - ${w}, ${center} + ${w})$ 覆盖实数轴。使每个长度小于 $\\delta$ 的闭区间都落在其中一个开区间内的最大 $\\delta$ 是多少？`,
      ],
      answer,
      [
        w === answer
          ? longer(answer + 1)
          : why(
              w,
              "That is the half-width of one interval; what matters is how far neighbours overlap.",
              "这是一个区间的半宽；关键是相邻区间重叠多少。",
            ),
        s === answer
          ? longer(answer + 2)
          : why(
              s,
              `That is the spacing of the centers, not the overlap $${2 * w} - ${s}$.`,
              `这是中心的间距，不是重叠 $${2 * w} - ${s}$。`,
            ),
        why(
          2 * w,
          "That is the length of one member; only intervals shorter than the overlap are sure to fit.",
          "这是一个成员的长度；只有比重叠更短的区间才一定放得进。",
        ),
      ],
      solution(
        [
          [
            ["Fit one interval", "放进一个区间"],
            [
              `A closed interval of length $\\ell$ fits in a member exactly when that member's center lies in an open range of length $${2 * w} - \\ell$.`,
              `长度为 $\\ell$ 的闭区间能放进某个成员，当且仅当这个成员的中心落在长度为 $${2 * w} - \\ell$ 的开范围内。`,
            ],
          ],
          [
            ["Use the spacing", "利用间距"],
            [
              `Centers are spaced $${s}$ apart, so such a range always contains one when $${2 * w} - \\ell > ${s}$, that is when $\\ell < ${answer}$.`,
              `中心的间距是 $${s}$，所以当 $${2 * w} - \\ell > ${s}$，即 $\\ell < ${answer}$ 时，这样的范围总含有一个中心。`,
            ],
          ],
        ],
        [
          `The closed interval $[${s - w}, ${w}]$, the overlap of the members centered at $0$ and $${s}$, has length $${answer}$ and lies in no member, so no larger $\\delta$ works.`,
          `闭区间 $[${s - w}, ${w}]$ 是中心在 $0$ 和 $${s}$ 的两个成员的重叠，长度为 $${answer}$，它不落在任何成员内，所以更大的 $\\delta$ 不行。`,
        ],
      ),
    );
  },
);

const uniformSqrt = point(
  "a-uniform-delta-for-a-square-root",
  ["A uniform delta for a square root", "平方根的一致 delta"],
  [
    "The square root is uniformly continuous on $[0, \\infty)$ although its slope is unbounded near zero, because $|\\sqrt{x} - \\sqrt{y}| \\le \\sqrt{|x - y|}$. So a suitable $\\delta$ is proportional to $\\varepsilon^{2}$, not to $\\varepsilon$, and the steepest place to test is at $x = 0$.\n\nFor $f(x) = \\sqrt{x}$ and $\\varepsilon = \\frac{1}{10}$: $\\sqrt{\\delta} = \\frac{1}{10}$ gives $\\delta = \\frac{1}{100}$. Then $|x - y| < \\frac{1}{100}$ gives $|\\sqrt{x} - \\sqrt{y}| < \\frac{1}{10}$ everywhere on $[0, \\infty)$.\n\nCheck: at $x = 0$ and $y = \\frac{1}{100}$ the difference is exactly $\\frac{1}{10}$, so no larger $\\delta$ works.\n\n> **Watch out.** Square the whole of $\\frac{\\varepsilon}{c}$: the factor $c$ is squared along with $\\varepsilon$.",
    "平方根在 $[0, \\infty)$ 上一致连续，尽管它在零附近的斜率无界，因为 $|\\sqrt{x} - \\sqrt{y}| \\le \\sqrt{|x - y|}$。所以合适的 $\\delta$ 与 $\\varepsilon^{2}$ 成正比，而不是与 $\\varepsilon$ 成正比，最陡的检验位置是 $x = 0$。\n\n对 $f(x) = \\sqrt{x}$ 和 $\\varepsilon = \\frac{1}{10}$：由 $\\sqrt{\\delta} = \\frac{1}{10}$ 得 $\\delta = \\frac{1}{100}$。于是在整个 $[0, \\infty)$ 上，$|x - y| < \\frac{1}{100}$ 推出 $|\\sqrt{x} - \\sqrt{y}| < \\frac{1}{10}$。\n\n检验：在 $x = 0$，$y = \\frac{1}{100}$ 处，差恰好是 $\\frac{1}{10}$，所以更大的 $\\delta$ 不行。\n\n> **注意。** 要把整个 $\\frac{\\varepsilon}{c}$ 平方：因子 $c$ 和 $\\varepsilon$ 一起平方。",
  ],
  (rng) => {
    const c = rng.int(2, 6);
    const k = rng.int(2, 12);
    const answer = Q.of(1, (c * k) ** 2);
    return solved(
      [
        `For $f(x) = ${c}\\sqrt{x}$ on $[0, \\infty)$ and $\\varepsilon = \\frac{1}{${k}}$, what is the largest $\\delta$ such that $|x - y| < \\delta$ always gives $|f(x) - f(y)| < \\varepsilon$?`,
        `对 $[0, \\infty)$ 上的 $f(x) = ${c}\\sqrt{x}$ 和 $\\varepsilon = \\frac{1}{${k}}$，使 $|x - y| < \\delta$ 总能推出 $|f(x) - f(y)| < \\varepsilon$ 的最大 $\\delta$ 是多少？`,
      ],
      answer,
      [
        why(
          Q.of(1, c * k),
          `That forgets to square: $\\delta$ is proportional to $\\varepsilon^{2}$.`,
          `这忘了平方：$\\delta$ 与 $\\varepsilon^{2}$ 成正比。`,
        ),
        why(
          Q.of(1, k),
          `That takes $\\delta = \\varepsilon$, ignoring both the factor $${c}$ and the square.`,
          `这是取 $\\delta = \\varepsilon$，忽略了因子 $${c}$ 和平方。`,
        ),
        why(
          Q.of(1, c * k * k),
          `That squares $\\varepsilon$ but not the factor $${c}$.`,
          `这只把 $\\varepsilon$ 平方，没有把因子 $${c}$ 平方。`,
        ),
      ],
      solution(
        [
          [
            ["Bound the difference", "估计差"],
            [
              `$|f(x) - f(y)| = ${c}|\\sqrt{x} - \\sqrt{y}| \\le ${c}\\sqrt{|x - y|}$, with equality when one of the points is $0$.`,
              `$|f(x) - f(y)| = ${c}|\\sqrt{x} - \\sqrt{y}| \\le ${c}\\sqrt{|x - y|}$，当其中一点是 $0$ 时取等号。`,
            ],
          ],
          [
            ["Solve for delta", "解出 δ"],
            [
              `$${c}\\sqrt{\\delta} = \\frac{1}{${k}}$ gives $\\sqrt{\\delta} = \\frac{1}{${c * k}}$, so $\\delta = ${answer.toLatex()}$.`,
              `由 $${c}\\sqrt{\\delta} = \\frac{1}{${k}}$ 得 $\\sqrt{\\delta} = \\frac{1}{${c * k}}$，所以 $\\delta = ${answer.toLatex()}$。`,
            ],
          ],
        ],
        [
          `At $x = 0$ and $y = ${answer.toLatex()}$, $|f(x) - f(y)| = ${c} \\cdot \\frac{1}{${c * k}} = \\frac{1}{${k}}$ exactly, so no larger $\\delta$ works.`,
          `在 $x = 0$，$y = ${answer.toLatex()}$ 处，$|f(x) - f(y)| = ${c} \\cdot \\frac{1}{${c * k}} = \\frac{1}{${k}}$，恰好等于 $\\varepsilon$，所以更大的 $\\delta$ 不行。`,
        ],
      ),
    );
  },
);

const exactCubicZeros = {
  ...point(
    "counting-the-exact-zeros-of-a-cubic",
    ["Counting the exact zeros of a cubic", "精确计算三次函数的零点"],
    [
      "Rolle's theorem gives an upper bound on the number of zeros, since zeros of $f$ are separated by zeros of $f'$. To find the exact count, evaluate $f$ at the critical points as well: the signs of these values show how many times the graph actually crosses the axis.\n\nFor $f(x) = x^{3} - 3x + 1$, $f'(x) = 3x^{2} - 3$ vanishes at $x = \\pm 1$, and $f(1) = -1$, $f(-1) = 3$. The critical values have opposite signs, so $f$ has three real zeros.\n\nCheck: $f(-2) = -1$, $f(0) = 1$, $f(1) = -1$ and $f(2) = 3$ change sign three times.\n\n> **Watch out.** Rolle's bound of three is only a maximum. When a critical value is $0$, that zero is a double zero and counts once.",
      "罗尔定理给出零点个数的上界，因为 $f$ 的零点被 $f'$ 的零点分隔。要求出准确的个数，还要计算 $f$ 在临界点的值：这些值的符号说明图像实际穿过坐标轴多少次。\n\n对 $f(x) = x^{3} - 3x + 1$，$f'(x) = 3x^{2} - 3$ 在 $x = \\pm 1$ 处为零，且 $f(1) = -1$，$f(-1) = 3$。两个临界值符号相反，所以 $f$ 有三个实零点。\n\n检验：$f(-2) = -1$，$f(0) = 1$，$f(1) = -1$，$f(2) = 3$，符号变化三次。\n\n> **注意。** 罗尔定理给出的三只是最大值。当某个临界值为 $0$ 时，那个零点是二重零点，只算一次。",
    ],
    (rng) => {
      const a = rng.int(1, 4);
      const edge = 2 * a ** 3;
      const mode = rng.int(0, 2);
      const c =
        mode === 0 ? rng.int(-edge + 1, edge - 1) : mode === 1 ? rng.pick([-edge, edge]) : rng.pick([-1, 1]) * (edge + rng.int(1, 20));
      const low = c - edge;
      const high = c + edge;
      const answer = low < 0 && high > 0 ? 3 : low === 0 || high === 0 ? 2 : 1;
      const f = poly([1, "x^{3}"], [-3 * a * a, "x"], [c, ""]);
      const verdict: Pair =
        answer === 3
          ? ["They have opposite signs, so the graph crosses the axis three times.", "它们符号相反，所以图像穿过坐标轴三次。"]
          : answer === 2
            ? [
                "One of them is zero, so the graph touches the axis there and crosses it once elsewhere.",
                "其中一个为零，所以图像在该处与坐标轴相切，并在别处穿过一次。",
              ]
            : ["They have the same sign, so the graph crosses the axis only once.", "它们符号相同，所以图像只穿过坐标轴一次。"];
      const reasons: Record<number, Pair> = {
        0: [
          "A cubic runs from $-\\infty$ to $+\\infty$, so it has at least one real zero.",
          "三次函数从 $-\\infty$ 变到 $+\\infty$，所以至少有一个实零点。",
        ],
        1: [
          `The critical values $${low}$ and $${high}$ show that the graph meets the axis more than once.`,
          `临界值 $${low}$ 和 $${high}$ 说明图像与坐标轴不止相交一次。`,
        ],
        2: [
          `Two zeros need a critical value of $0$, and neither $${low}$ nor $${high}$ is $0$.`,
          `两个零点要求某个临界值为 $0$，而 $${low}$ 和 $${high}$ 都不是 $0$。`,
        ],
        3: [
          `Three is only Rolle's upper bound; the critical values $${low}$ and $${high}$ do not have opposite signs.`,
          `三只是罗尔定理的上界；临界值 $${low}$ 和 $${high}$ 并不异号。`,
        ],
      };
      return solved(
        [`How many distinct real zeros does $${f}$ have?`, `$${f}$ 有多少个不同的实零点？`],
        answer,
        [0, 1, 2, 3].filter((v) => v !== answer).map((v) => why(v, (reasons[v] as Pair)[0], (reasons[v] as Pair)[1])),
        solution(
          [
            [
              ["Find the critical points", "求临界点"],
              [
                `$f'(x) = 3x^{2} - ${3 * a * a}$ vanishes at $x = ${a}$ and $x = ${-a}$.`,
                `$f'(x) = 3x^{2} - ${3 * a * a}$ 在 $x = ${a}$ 和 $x = ${-a}$ 处为零。`,
              ],
            ],
            [
              ["Read the critical values", "看临界值"],
              [`$f(${a}) = ${low}$ and $f(${-a}) = ${high}$. ${verdict[0]}`, `$f(${a}) = ${low}$，$f(${-a}) = ${high}$。${verdict[1]}`],
            ],
          ],
          [
            `$f$ is monotone on $(-\\infty, ${-a}]$, $[${-a}, ${a}]$ and $[${a}, \\infty)$, and it runs from $-\\infty$ to $+\\infty$, so each piece holds at most one zero, and counting the pieces that reach the axis gives $${answer}$.`,
            `$f$ 在 $(-\\infty, ${-a}]$、$[${-a}, ${a}]$ 和 $[${a}, \\infty)$ 上单调，并从 $-\\infty$ 变到 $+\\infty$，所以每一段至多有一个零点，数出到达坐标轴的段，得到 $${answer}$。`,
          ],
        ),
      );
    },
  ),
  figure: analysisDrawings1["rolles-theorem-and-counting-zeros#counting-the-exact-zeros-of-a-cubic"],
};

const darbouxCount = point(
  "the-zeros-forced-by-sign-changes",
  ["The zeros forced by sign changes", "符号变化迫使的零点"],
  [
    "A derivative need not be continuous, yet Darboux's theorem gives it the intermediate value property. So each change of sign among known values of $f'$ forces a zero between them, and nothing else is forced, which means that the sign changes give the guaranteed number of zeros.\n\nSuppose $f'(0) = 2$, $f'(1) = -1$, $f'(2) = -3$ and $f'(3) = 4$. The signs run $+, -, -, +$, with changes between $0$ and $1$ and between $2$ and $3$, so $f'$ must have at least $2$ zeros.\n\nCheck: between $1$ and $2$ both values are negative, so nothing forces a zero there, and the piecewise linear $f'$ through these values has exactly $2$ zeros.\n\n> **Watch out.** Count only changes of sign between neighbouring values. Neither the number of gaps nor the number of negative values is the answer.",
    "导数不一定连续，但达布定理使它具有介值性质。所以 $f'$ 的已知值中，每次符号变化都迫使其间有一个零点，除此之外没有别的强制，这意味着符号变化数就是可保证的零点个数。\n\n设 $f'(0) = 2$，$f'(1) = -1$，$f'(2) = -3$，$f'(3) = 4$。符号依次是 $+, -, -, +$，在 $0$ 与 $1$ 之间、$2$ 与 $3$ 之间变号，所以 $f'$ 至少有 $2$ 个零点。\n\n检验：在 $1$ 与 $2$ 之间两个值都是负的，没有什么迫使那里有零点；经过这些值的分段线性 $f'$ 恰好有 $2$ 个零点。\n\n> **注意。** 只数相邻值之间的符号变化。区间段数和负值个数都不是答案。",
  ],
  (rng) => {
    const n = rng.int(4, 7);
    const values = [...Array(n).keys()].map(() => rng.pick([-9, -7, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 7, 8]));
    let changes = 0;
    for (let i = 1; i < n; i++) if ((values[i - 1] as number) * (values[i] as number) < 0) changes++;
    const shown = values.map((v, i) => `f'(${i}) = ${v}`).join(", ");
    const signs = values.map((v) => (v > 0 ? "+" : "-")).join(", ");
    const negatives = values.filter((v) => v < 0).length;
    const more = why(
      changes + 1,
      "That adds a zero that nothing forces; $f'$ can avoid zero wherever the sign does not change.",
      "这多加了一个没有被迫出现的零点；在不变号的地方 $f'$ 可以不为零。",
    );
    return solved(
      [
        `A function is differentiable on $[0, ${n - 1}]$, with $${shown}$. What is the smallest number of zeros that $f'$ must have on this interval?`,
        `函数在 $[0, ${n - 1}]$ 上可导，且 $${shown}$。$f'$ 在这个区间上至少必须有多少个零点？`,
      ],
      changes,
      [
        n - 1 === changes
          ? more
          : why(
              n - 1,
              "That counts every gap between listed values, but a gap without a change of sign forces no zero.",
              "这数的是所有相邻值之间的区间，但不变号的区间不迫使零点出现。",
            ),
        more,
        why(
          negatives,
          "That counts the negative values, not the changes of sign between neighbours.",
          "这数的是负值的个数，而不是相邻值之间的符号变化。",
        ),
      ],
      solution(
        [
          [
            ["List the signs", "列出符号"],
            [
              `The signs of $f'(0), \\dots, f'(${n - 1})$ are $${signs}$, which change $${changes}$ ${changes === 1 ? "time" : "times"}.`,
              `$f'(0), \\dots, f'(${n - 1})$ 的符号是 $${signs}$，共变号 $${changes}$ 次。`,
            ],
          ],
          [
            ["Apply Darboux's theorem", "应用达布定理"],
            [
              `Each change of sign forces a zero of $f'$ in that gap, so $f'$ has at least $${changes}$ zeros.`,
              `每次变号都迫使 $f'$ 在该区间内有一个零点，所以 $f'$ 至少有 $${changes}$ 个零点。`,
            ],
          ],
        ],
        [
          `The piecewise linear $f'$ through the listed values has exactly one zero in each gap with a change of sign and none elsewhere, so no more than $${changes}$ are forced.`,
          `经过所列值的分段线性 $f'$ 在每个变号的区间内恰有一个零点，别处没有，所以被迫出现的零点不超过 $${changes}$ 个。`,
        ],
      ),
    );
  },
);

const escapingMass = point(
  "an-integral-limit-that-beats-the-pointwise-limit",
  ["An integral limit that beats the pointwise limit", "积分极限不等于逐点极限的积分"],
  [
    "A sequence of functions can tend to zero at every point while its integrals tend to something else, because a tall narrow peak keeps carrying area near one point. So a limit and an integral can be exchanged only with a condition such as uniform convergence, and here it fails.\n\nFor $f_n(x) = n x (1 - x^{2})^{n}$, the substitution $u = 1 - x^{2}$, $du = -2x \\, dx$ gives $\\int_0^1 f_n \\, dx = \\frac{n}{2} \\int_0^1 u^{n} \\, du = \\frac{n}{2(n + 1)}$, which tends to $\\frac{1}{2}$.\n\nCheck: for $n = 1$, $\\int_0^1 (x - x^{3}) \\, dx = \\frac{1}{2} - \\frac{1}{4} = \\frac{1}{4}$, and the formula gives $\\frac{1}{2 \\times 2} = \\frac{1}{4}$ too.\n\n> **Watch out.** The pointwise limit is $0$, so its integral is $0$, but that is not the limit of the integrals. Also keep the factor $\\frac{1}{p}$ that the substitution brings in.",
    "函数列可以在每一点都趋于零，而积分却趋于别的值，因为又高又窄的尖峰在一点附近持续携带面积。所以只有在一致收敛这样的条件下才能交换极限与积分，而这里这个条件不成立。\n\n对 $f_n(x) = n x (1 - x^{2})^{n}$，代换 $u = 1 - x^{2}$，$du = -2x \\, dx$，得 $\\int_0^1 f_n \\, dx = \\frac{n}{2} \\int_0^1 u^{n} \\, du = \\frac{n}{2(n + 1)}$，它趋于 $\\frac{1}{2}$。\n\n检验：$n = 1$ 时，$\\int_0^1 (x - x^{3}) \\, dx = \\frac{1}{2} - \\frac{1}{4} = \\frac{1}{4}$，公式也给出 $\\frac{1}{2 \\times 2} = \\frac{1}{4}$。\n\n> **注意。** 逐点极限是 $0$，它的积分是 $0$，但这不是积分的极限。还要保留代换带来的因子 $\\frac{1}{p}$。",
  ],
  (rng) => {
    const k = rng.int(1, 12);
    const p = rng.int(2, 5);
    const answer = Q.of(k, p);
    const start = k === 1 ? "" : `${k} `;
    const inner = p === 2 ? "x" : `x^{${p - 1}}`;
    const first = poly([k, inner], [-k, `x^{${2 * p - 1}}`]);
    return solved(
      [
        `Let $f_n(x) = ${start}n ${inner} (1 - x^{${p}})^{n}$ on $[0, 1]$. It tends to $0$ at every point. What is $\\lim_{n \\to \\infty} \\int_0^1 f_n(x) \\, dx$?`,
        `设 $[0, 1]$ 上的 $f_n(x) = ${start}n ${inner} (1 - x^{${p}})^{n}$。它在每一点都趋于 $0$。$\\lim_{n \\to \\infty} \\int_0^1 f_n(x) \\, dx$ 是多少？`,
      ],
      answer,
      [
        why(
          0,
          "That is the integral of the pointwise limit; the limit and the integral cannot be exchanged here.",
          "这是逐点极限的积分；这里极限与积分不能交换。",
        ),
        why(
          Q.of(k),
          `That drops the factor $\\frac{1}{${p}}$ from $du = -${p} ${inner} \\, dx$.`,
          `这丢掉了 $du = -${p} ${inner} \\, dx$ 带来的因子 $\\frac{1}{${p}}$。`,
        ),
        why(
          Q.of(k, p + 1),
          `That divides by $${p + 1}$ instead of by $${p}$, the factor that the substitution brings in.`,
          `这是除以 $${p + 1}$，而不是除以代换带来的因子 $${p}$。`,
        ),
      ],
      solution(
        [
          [
            ["Substitute", "换元"],
            [
              `With $u = 1 - x^{${p}}$ and $du = -${p} ${inner} \\, dx$, $\\int_0^1 f_n \\, dx = \\frac{${start}n}{${p}} \\int_0^1 u^{n} \\, du = \\frac{${start}n}{${p}(n + 1)}$.`,
              `令 $u = 1 - x^{${p}}$，$du = -${p} ${inner} \\, dx$，则 $\\int_0^1 f_n \\, dx = \\frac{${start}n}{${p}} \\int_0^1 u^{n} \\, du = \\frac{${start}n}{${p}(n + 1)}$。`,
            ],
          ],
          [
            ["Let n grow", "令项数增大"],
            [
              `Since $\\frac{n}{n + 1} \\to 1$, the integrals tend to $${answer.toLatex()}$, which is not $0$.`,
              `由于 $\\frac{n}{n + 1} \\to 1$，积分趋于 $${answer.toLatex()}$，不是 $0$。`,
            ],
          ],
        ],
        [
          `For $n = 1$, $\\int_0^1 (${first}) \\, dx = ${Q.of(k, 2 * p).toLatex()}$, which matches $\\frac{${start}n}{${p}(n + 1)}$ at $n = 1$.`,
          `$n = 1$ 时，$\\int_0^1 (${first}) \\, dx = ${Q.of(k, 2 * p).toLatex()}$，与 $\\frac{${start}n}{${p}(n + 1)}$ 在 $n = 1$ 时的值一致。`,
        ],
      ),
    );
  },
);

const mTestTerms = point(
  "how-many-terms-the-m-test-requires",
  ["How many terms the M-test requires", "M 判别法需要多少项"],
  [
    "The M-test does more than prove convergence: it bounds the error of a partial sum by the tail of the series $\\sum M_k$, at every $x$ at once. So the number of terms needed for a given accuracy can be found without looking at any particular $x$.\n\nFor $\\sum \\frac{\\sin(kx)}{3^{k}}$ and the accuracy $\\frac{1}{100}$, the tail after $N$ terms is at most $\\sum_{k > N} \\frac{1}{3^{k}} = \\frac{1}{2 \\cdot 3^{N}}$. We need $2 \\cdot 3^{N} \\ge 100$: $2 \\cdot 27 = 54$ is too small and $2 \\cdot 81 = 162$ is enough, so $N = 4$.\n\nCheck: the bound for $N = 4$ is $\\frac{1}{162} \\le \\frac{1}{100}$, while for $N = 3$ it is $\\frac{1}{54}$, which is larger.\n\n> **Watch out.** The tail after $N$ terms starts at $k = N + 1$, so its sum is $\\frac{1}{3^{N}}$ times $\\frac{1}{3 - 1}$, not $\\frac{1}{3^{N+1}}$.",
    "M 判别法不只证明收敛：它用级数 $\\sum M_k$ 的尾部同时在每个 $x$ 处给出部分和的误差界。所以可以不考虑任何具体的 $x$，就求出达到给定精度所需的项数。\n\n对 $\\sum \\frac{\\sin(kx)}{3^{k}}$ 和精度 $\\frac{1}{100}$，前 $N$ 项之后的尾部至多是 $\\sum_{k > N} \\frac{1}{3^{k}} = \\frac{1}{2 \\cdot 3^{N}}$。需要 $2 \\cdot 3^{N} \\ge 100$：$2 \\cdot 27 = 54$ 太小，$2 \\cdot 81 = 162$ 够了，所以 $N = 4$。\n\n检验：$N = 4$ 时的界是 $\\frac{1}{162} \\le \\frac{1}{100}$，而 $N = 3$ 时是 $\\frac{1}{54}$，更大。\n\n> **注意。** 前 $N$ 项之后的尾部从 $k = N + 1$ 开始，所以它的和是 $\\frac{1}{3^{N}}$ 乘 $\\frac{1}{3 - 1}$，而不是 $\\frac{1}{3^{N+1}}$。",
  ],
  (rng) => {
    const r = rng.int(2, 5);
    const m = rng.int(10, 2000);
    let N = 0;
    while (r ** N * (r - 1) < m) N++;
    const tail = r ** N * (r - 1);
    const before = r ** (N - 1) * (r - 1);
    const denominator = r === 2 ? "2^{N}" : `${r - 1} \\cdot ${r}^{N}`;
    return solved(
      [
        `For $\\sum_{k=1}^{\\infty} \\frac{\\sin(kx)}{${r}^{k}}$, what is the smallest $N$ for which the M-test bound on the error of the first $N$ terms is at most $\\frac{1}{${m}}$?`,
        `对 $\\sum_{k=1}^{\\infty} \\frac{\\sin(kx)}{${r}^{k}}$，使前 $N$ 项误差的 M 判别法上界不超过 $\\frac{1}{${m}}$ 的最小 $N$ 是多少？`,
      ],
      N,
      [
        why(N + 1, "That number of terms works, but it is not the smallest.", "这个项数可行，但不是最小的。"),
        why(
          N - 1,
          `With $${N - 1}$ terms the bound is $\\frac{1}{${before}}$, which is above $\\frac{1}{${m}}$.`,
          `取 $${N - 1}$ 项时界是 $\\frac{1}{${before}}$，大于 $\\frac{1}{${m}}$。`,
        ),
        why(N + 2, "That number of terms works, but two fewer are enough.", "这个项数可行，但少两项就够了。"),
      ],
      solution(
        [
          [
            ["Bound the tail", "估计尾部"],
            [
              `With $M_k = \\frac{1}{${r}^{k}}$, the error of the first $N$ terms is at most $\\sum_{k > N} \\frac{1}{${r}^{k}} = \\frac{1}{${denominator}}$.`,
              `取 $M_k = \\frac{1}{${r}^{k}}$，前 $N$ 项的误差至多是 $\\sum_{k > N} \\frac{1}{${r}^{k}} = \\frac{1}{${denominator}}$。`,
            ],
          ],
          [
            ["Find the first large enough denominator", "找到第一个足够大的分母"],
            [
              `The denominator is $${before}$ for $N = ${N - 1}$ and $${tail}$ for $N = ${N}$, the first value of at least $${m}$.`,
              `$N = ${N - 1}$ 时分母是 $${before}$，$N = ${N}$ 时是 $${tail}$，这是第一个不小于 $${m}$ 的值。`,
            ],
          ],
        ],
        [
          `$\\frac{1}{${tail}} \\le \\frac{1}{${m}}$, while $\\frac{1}{${before}} > \\frac{1}{${m}}$, so $N = ${N}$ is the smallest.`,
          `$\\frac{1}{${tail}} \\le \\frac{1}{${m}}$，而 $\\frac{1}{${before}} > \\frac{1}{${m}}$，所以 $N = ${N}$ 是最小的。`,
        ],
      ),
    );
  },
);

/** deeperRealAnalysisThirdPoints maps topics of Real Analysis to a third knowledge point. */
export const deeperRealAnalysisThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "suprema-of-sets-of-reals": [supOfImage],
  "the-monotone-convergence-theorem": [whichFixedPoint],
  "cauchy-sequences": [harmonicGap],
  "absolute-and-conditional-convergence-of-series": [classifyAlternating],
  "rearrangements-of-series": [absoluteRearrangement],
  "cauchy-products-of-series": [cauchyProductReverse],
  "kinds-of-discontinuities": [removingDiscontinuity],
  "the-sequential-criterion-for-continuity": [rationalIrrational],
  "the-bisection-proof": [threeBisections],
  "complete-metric-spaces": [contractionBound],
  "compactness-on-the-real-line": [subsequenceLimit],
  "open-covers": [lebesgueNumber],
  "uniform-continuity": [uniformSqrt],
  "rolles-theorem-and-counting-zeros": [exactCubicZeros],
  "darbouxs-theorem": [darbouxCount],
  "exchanging-limits-and-integrals": [escapingMass],
  "the-weierstrass-m-test": [mTestTerms],
};
