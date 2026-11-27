// Third knowledge points for thin topics of Real Analysis: the reverse question, a harder case
// or a common trap. See `deeperRealAnalysisThirdPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { poly, Q } from "@ga/subject-math";
import { analysisDrawings1 } from "../explanation-drawings-real-analysis-1.ts";

import { why } from "../problems.ts";
import { ask, choose, type Pair, point } from "../university-kit.ts";
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
    "An absolutely convergent series keeps its sum under every rearrangement, however the terms are shuffled. So a rearranged geometric series with ratio between $-1$ and $1$ still has the sum of the original, and the original sum can be used without following the new order.",
    "绝对收敛的级数无论如何重排，和都不变。所以公比在 $-1$ 和 $1$ 之间的几何级数重排后仍有原来的和，可以直接用原来的和，而不必追踪新的次序。",
  ],
  (rng) => {
    const c = rng.int(1, 9);
    const r = rng.int(2, 9);
    const answer = Q.of(c * r, r + 1);
    const start = c === 1 ? "" : `${c}`;
    return ask(
      [
        `Rearrange $\\sum_{n \\ge 0} ${start}\\left(-\\frac{1}{${r}}\\right)^{n}$ so that two positive terms come before each negative term. What is the sum of the new series?`,
        `重排 $\\sum_{n \\ge 0} ${start}\\left(-\\frac{1}{${r}}\\right)^{n}$，使每个负项之前有两个正项。新级数的和是多少？`,
      ],
      answer,
      [Q.of(c * r * r, r * r - 1), Q.of(c * r, r - 1), Q.of(c)],
      [
        `The series converges absolutely, so the sum is unchanged. It is the geometric sum $\\frac{${c}}{1 + \\frac{1}{${r}}} = ${answer.toLatex()}$.`,
        `这个级数绝对收敛，所以和不变。它是几何级数的和 $\\frac{${c}}{1 + \\frac{1}{${r}}} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const cauchyProductReverse = point(
  "recovering-a-factor-of-a-cauchy-product",
  ["Recovering a factor of a Cauchy product", "还原柯西积的因子"],
  [
    "The Cauchy product is built from $c_n = \\sum_{k=0}^{n} a_k b_{n-k}$. If the $a_k$ and the $c_n$ are known and $a_0 \\ne 0$, these equations can be solved one at a time for the $b_n$, in the same way as long division of power series.",
    "柯西积由 $c_n = \\sum_{k=0}^{n} a_k b_{n-k}$ 构成。如果已知 $a_k$ 和 $c_n$，且 $a_0 \\ne 0$，那么可以逐个解这些方程求出 $b_n$，这与幂级数的长除法相同。",
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
    return ask(
      [
        `The series $\\sum a_n$ begins with $a_0, a_1, a_2 = ${a0}, ${a1}, ${a2}$, and its Cauchy product with $\\sum b_n$ begins with $c_0, c_1, c_2 = ${c0}, ${c1}, ${c2}$. Find $b_2$.`,
        `级数 $\\sum a_n$ 以 $a_0, a_1, a_2 = ${a0}, ${a1}, ${a2}$ 开始，它与 $\\sum b_n$ 的柯西积以 $c_0, c_1, c_2 = ${c0}, ${c1}, ${c2}$ 开始。求 $b_2$。`,
      ],
      b2,
      [c2, a0 * (c2 - a2 * b0), a0 * (c2 - a1 * b1)],
      [
        `Solving in order gives $b_0 = ${b0}$ and $b_1 = ${b1}$. Then $c_2 = a_0 b_2 + a_1 b_1 + a_2 b_0$ becomes $${c2} = ${poly([a0, "b_2"], [a1 * b1 + a2 * b0, ""])}$, so $b_2 = ${b2}$.`,
        `依次求解得 $b_0 = ${b0}$，$b_1 = ${b1}$。于是 $c_2 = a_0 b_2 + a_1 b_1 + a_2 b_0$ 变为 $${c2} = ${poly([a0, "b_2"], [a1 * b1 + a2 * b0, ""])}$，所以 $b_2 = ${b2}$。`,
      ],
    );
  },
);

const removingDiscontinuity = point(
  "the-value-that-removes-a-discontinuity",
  ["The value that removes a discontinuity", "消除间断的值"],
  [
    "A removable discontinuity has a limit but the wrong value or no value at the point. To remove it, set the value equal to the limit. For a rational function, cancel the common factor first, because the limit is not found by substituting into the original fraction.",
    "可去间断点处有极限，但函数值错误或没有定义。要消除它，就令函数值等于极限。对有理函数要先约去公因式，因为极限不能通过代入原来的分式求得。",
  ],
  (rng) => {
    const a = rng.int(1, 9);
    let b = rng.pick([-9, -7, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 7, 8]);
    if (b === a) b = a + 1;
    const top = poly([1, "x^{2}"], [-(a + b), "x"], [a * b, ""]);
    const answer = a - b;
    return ask(
      [
        `The function $f(x) = \\frac{${top}}{x - ${a}}$ is not defined at $x = ${a}$. What value of $f(${a})$ makes $f$ continuous there?`,
        `函数 $f(x) = \\frac{${top}}{x - ${a}}$ 在 $x = ${a}$ 处没有定义。$f(${a})$ 取什么值时 $f$ 在该点连续？`,
      ],
      answer,
      [a + b, a, b],
      [
        `The factor $x - ${a}$ cancels, which leaves $${poly([1, "x"], [-b, ""])}$. Its limit at $x = ${a}$ is $${answer}$, so this is the required value.`,
        `约去因式 $x - ${a}$，剩下 $${poly([1, "x"], [-b, ""])}$。它在 $x = ${a}$ 处的极限是 $${answer}$，所以这就是所求的值。`,
      ],
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
    "Each step of bisection evaluates at the midpoint and keeps the half on which the sign changes, so the root stays trapped. After $n$ steps, the interval has length $\\frac{1}{2^{n}}$ of the original, and its endpoints come from following the choices one at a time.",
    "二分法的每一步都在中点求值，并保留符号变化的那一半，所以根始终被夹住。经过 $n$ 步后，区间的长度是原来的 $\\frac{1}{2^{n}}$，它的端点要逐次根据选择得出。",
  ],
  (rng) => {
    const m = rng.int(1, 9);
    let N = rng.int(m * m + 1, (m + 2) * (m + 2) - 1);
    if (Number.isInteger(Math.sqrt(N))) N += 1;
    let lo = 4 * m;
    let hi = 4 * m + 8;
    const mids: string[] = [];
    for (let i = 0; i < 3; i++) {
      const mid = (lo + hi) / 2;
      mids.push(Q.of(mid, 4).toLatex());
      if (mid * mid < 16 * N) lo = mid;
      else hi = mid;
    }
    const answer = Q.of(lo, 4);
    return ask(
      [
        `To solve $x^{2} = ${N}$, bisection starts on $[${m}, ${m + 2}]$. What is the left endpoint of the interval kept after three steps?`,
        `为解 $x^{2} = ${N}$，二分法从 $[${m}, ${m + 2}]$ 开始。三步后保留的区间的左端点是多少？`,
      ],
      answer,
      [Q.of(hi, 4), Q.of(m + 1), Q.of(Math.floor(Math.sqrt(N)))],
      [
        `The midpoints tested are $${mids.join(", ")}$. Comparing each square with $${N}$ leaves the interval from $${answer.toLatex()}$ to $${Q.of(hi, 4).toLatex()}$.`,
        `依次检验的中点是 $${mids.join(", ")}$。把每个平方与 $${N}$ 比较，留下从 $${answer.toLatex()}$ 到 $${Q.of(hi, 4).toLatex()}$ 的区间。`,
      ],
    );
  },
);

const contractionBound = point(
  "the-error-bound-of-a-contraction",
  ["The error bound of a contraction", "压缩映射的误差界"],
  [
    "On a complete metric space, a contraction with constant $q < 1$ has a unique fixed point $x^{*}$, and completeness is what makes the iterates converge to it. The estimate $d(x_n, x^{*}) \\le \\frac{q^{n}}{1 - q} d(x_0, x_1)$ bounds the error before the limit is known.",
    "在完备度量空间上，常数 $q < 1$ 的压缩映射有唯一不动点 $x^{*}$，完备性正是迭代收敛到它的原因。估计式 $d(x_n, x^{*}) \\le \\frac{q^{n}}{1 - q} d(x_0, x_1)$ 在极限未知时就给出误差的界。",
  ],
  (rng) => {
    const k = rng.int(2, 5);
    const n = rng.int(2, 5);
    const D = rng.int(1, 12);
    const answer = Q.of(D * k, k ** n * (k - 1));
    return ask(
      [
        `A contraction on a complete metric space has constant $q = \\frac{1}{${k}}$, and its iterates have $d(x_0, x_1) = ${D}$. What upper bound does the standard estimate give for $d(x_{${n}}, x^{*})$?`,
        `完备度量空间上的压缩映射的常数为 $q = \\frac{1}{${k}}$，其迭代满足 $d(x_0, x_1) = ${D}$。标准估计式给出 $d(x_{${n}}, x^{*})$ 的什么上界？`,
      ],
      answer,
      [Q.of(D, k ** n), Q.of(D * k, k - 1), Q.of(D, k ** n * (k - 1))],
      [
        `The estimate gives $\\frac{q^{${n}}}{1 - q} \\cdot ${D}$, with $q^{${n}} = \\frac{1}{${k ** n}}$ and $1 - q = \\frac{${k - 1}}{${k}}$. The result is $${answer.toLatex()}$.`,
        `估计式给出 $\\frac{q^{${n}}}{1 - q} \\cdot ${D}$，其中 $q^{${n}} = \\frac{1}{${k ** n}}$，$1 - q = \\frac{${k - 1}}{${k}}$。结果是 $${answer.toLatex()}$。`,
      ],
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
    "When an open cover is made of overlapping intervals, a short interval fits inside a single member only if it is shorter than a limit set by the overlap. A Lebesgue number of an open cover is a $\\delta > 0$ such that every set of diameter less than $\\delta$ lies inside a single member of the cover. An open cover of a compact set always has one, and it is the number behind many proofs by compactness. For overlapping open intervals, the danger is an interval that reaches past the overlap of two neighbours: it sticks out of both.",
    "当开覆盖由互相重叠的区间组成时，只有比重叠所确定的界限更短的小区间，才能放进单个成员之内。开覆盖的勒贝格数是这样一个 $\\delta > 0$：每个直径小于 $\\delta$ 的集合都落在覆盖的某一个成员之内。紧集的开覆盖总有勒贝格数，许多紧性证明都依赖它。对于互相重叠的开区间，危险在于小区间越过两个相邻区间的重叠部分：这时它同时伸出这两个区间。",
  ],
  (rng) => {
    const w = rng.int(2, 9);
    const s = rng.int(1, 2 * w - 1);
    const answer = 2 * w - s;
    const center = s === 1 ? "k" : `${s}k`;
    return ask(
      [
        `The open intervals $(${center} - ${w}, ${center} + ${w})$, for all integers $k$, cover the real line. What is the largest $\\delta$ such that every closed interval of length less than $\\delta$ lies inside one of them?`,
        `对所有整数 $k$，开区间 $(${center} - ${w}, ${center} + ${w})$ 覆盖实数轴。使每个长度小于 $\\delta$ 的闭区间都落在其中一个开区间内的最大 $\\delta$ 是多少？`,
      ],
      answer,
      [w === answer ? answer + 1 : w, s === answer ? answer + 2 : s, 2 * w],
      [
        `A closed interval of length $\\ell$ fits in a member exactly when some center lies in an open range of length $${2 * w} - \\ell$. Centers are spaced $${s}$ apart, so this is guaranteed when $\\ell < ${answer}$.`,
        `长度为 $\\ell$ 的闭区间能放进某个成员，当且仅当某个中心落在长度为 $${2 * w} - \\ell$ 的开范围内。中心的间距是 $${s}$，所以当 $\\ell < ${answer}$ 时这一定成立。`,
      ],
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
      "Rolle's theorem gives an upper bound on the number of zeros, since zeros of $f$ are separated by zeros of $f'$. To find the exact count, evaluate $f$ at the critical points as well: the signs of these values show how many times the graph actually crosses the axis.",
      "罗尔定理给出零点个数的上界，因为 $f$ 的零点被 $f'$ 的零点分隔。要求出准确的个数，还要计算 $f$ 在临界点的值：这些值的符号说明图像实际穿过坐标轴多少次。",
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
      const why: Pair =
        answer === 3
          ? ["They have opposite signs, so the graph crosses the axis three times.", "它们符号相反，所以图像穿过坐标轴三次。"]
          : answer === 2
            ? [
                "One of them is zero, so the graph touches the axis there and crosses it once elsewhere.",
                "其中一个为零，所以图像在该处与坐标轴相切，并在别处穿过一次。",
              ]
            : ["They have the same sign, so the graph crosses the axis only once.", "它们符号相同，所以图像只穿过坐标轴一次。"];
      return ask(
        [`How many distinct real zeros does $${f}$ have?`, `$${f}$ 有多少个不同的实零点？`],
        answer,
        [0, 1, 2, 3].filter((v) => v !== answer),
        [
          `The critical points are $x = ${a}$ and $x = ${-a}$, where the values are $${low}$ and $${high}$. ${why[0]}`,
          `临界点是 $x = ${a}$ 和 $x = ${-a}$，函数值分别是 $${low}$ 和 $${high}$。${why[1]}`,
        ],
      );
    },
  ),
  figure: analysisDrawings1["rolles-theorem-and-counting-zeros#counting-the-exact-zeros-of-a-cubic"],
};

const darbouxCount = point(
  "the-zeros-forced-by-sign-changes",
  ["The zeros forced by sign changes", "符号变化迫使的零点"],
  [
    "A derivative need not be continuous, yet Darboux's theorem gives it the intermediate value property. So each change of sign among known values of $f'$ forces a zero between them, and nothing else is forced, which means that the sign changes give the guaranteed number of zeros.",
    "导数不一定连续，但达布定理使它具有介值性质。所以 $f'$ 的已知值中，每次符号变化都迫使其间有一个零点，除此之外没有别的强制，这意味着符号变化数就是可保证的零点个数。",
  ],
  (rng) => {
    const n = rng.int(4, 7);
    const values = [...Array(n).keys()].map(() => rng.pick([-9, -7, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 7, 8]));
    let changes = 0;
    for (let i = 1; i < n; i++) if ((values[i - 1] as number) * (values[i] as number) < 0) changes++;
    const shown = values.map((v, i) => `f'(${i}) = ${v}`).join(", ");
    return ask(
      [
        `A function is differentiable on $[0, ${n - 1}]$, with $${shown}$. What is the smallest number of zeros that $f'$ must have on this interval?`,
        `函数在 $[0, ${n - 1}]$ 上可导，且 $${shown}$。$f'$ 在这个区间上至少必须有多少个零点？`,
      ],
      changes,
      [n - 1 === changes ? changes + 1 : n - 1, changes + 1, values.filter((v) => v < 0).length],
      [
        `The listed values change sign $${changes}$ ${changes === 1 ? "time" : "times"}, and Darboux's theorem puts a zero of $f'$ in each such gap. A function could have no other zeros of $f'$, so the minimum is $${changes}$.`,
        `所列的值变号 $${changes}$ 次，达布定理在每个这样的区间内给出 $f'$ 的一个零点。函数可以使 $f'$ 没有其他零点，所以最小值是 $${changes}$。`,
      ],
    );
  },
);

const escapingMass = point(
  "an-integral-limit-that-beats-the-pointwise-limit",
  ["An integral limit that beats the pointwise limit", "积分极限不等于逐点极限的积分"],
  [
    "A sequence of functions can tend to zero at every point while its integrals tend to something else, because a tall narrow peak keeps carrying area near one point. So a limit and an integral can be exchanged only with a condition such as uniform convergence, and here it fails.",
    "函数列可以在每一点都趋于零，而积分却趋于别的值，因为又高又窄的尖峰在一点附近持续携带面积。所以只有在一致收敛这样的条件下才能交换极限与积分，而这里这个条件不成立。",
  ],
  (rng) => {
    const k = rng.int(1, 12);
    const p = rng.int(2, 5);
    const answer = Q.of(k, p);
    const start = k === 1 ? "" : `${k} `;
    const inner = p === 2 ? "x" : `x^{${p - 1}}`;
    return ask(
      [
        `Let $f_n(x) = ${start}n ${inner} (1 - x^{${p}})^{n}$ on $[0, 1]$. It tends to $0$ at every point. What is $\\lim_{n \\to \\infty} \\int_0^1 f_n(x) \\, dx$?`,
        `设 $[0, 1]$ 上的 $f_n(x) = ${start}n ${inner} (1 - x^{${p}})^{n}$。它在每一点都趋于 $0$。$\\lim_{n \\to \\infty} \\int_0^1 f_n(x) \\, dx$ 是多少？`,
      ],
      answer,
      [0, Q.of(k), Q.of(k, p + 1)],
      [
        `Substituting $u = 1 - x^{${p}}$ gives $\\int_0^1 f_n \\, dx = \\frac{${start}n}{${p}(n + 1)}$, which tends to $${answer.toLatex()}$. This is not $0$, the integral of the pointwise limit.`,
        `代换 $u = 1 - x^{${p}}$，得 $\\int_0^1 f_n \\, dx = \\frac{${start}n}{${p}(n + 1)}$，它趋于 $${answer.toLatex()}$。这不是逐点极限的积分 $0$。`,
      ],
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
