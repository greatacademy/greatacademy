// Further knowledge points for topics of Real Analysis, each a skill the topic's own points
// leave out. See `deeperRealAnalysisPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { numberProblem, why } from "../problems.ts";

import { ask, point } from "../university-kit.ts";
import { type Step, walked } from "./calculus-i-differentiation.ts";
import { solution, solved } from "./real-analysis.ts";

/** frac builds a rational number with a positive denominator. */
const frac = (n: number, d: number) => (d < 0 ? Q.of(-n, -d) : Q.of(n, d));

/** coef writes a coefficient before a symbol, leaving out 1. */
const coef = (c: number, symbol: string) => (c === 1 ? symbol : c === -1 ? `-${symbol}` : `${c}${symbol}`);

/** signed writes a term with its sign, for use after another term. */
const signed = (c: number, symbol = "") => `${c < 0 ? "-" : "+"} ${symbol === "" ? Math.abs(c) : coef(Math.abs(c), symbol)}`;

const supremumOfSums = point(
  "the-supremum-of-a-sum-of-sets",
  ["The supremum of a sum of sets", "集合之和的上确界"],
  [
    "The sum set $A + B$ holds every $a + b$ with $a$ in $A$ and $b$ in $B$. Its supremum is $\\sup A + \\sup B$, whether or not those values are attained. The proof is an approximation: take elements of $A$ and $B$ within $\\frac{\\varepsilon}{2}$ of their suprema.",
    "和集 $A + B$ 包含所有 $a + b$，其中 $a$ 属于 $A$，$b$ 属于 $B$。它的上确界是 $\\sup A + \\sup B$，不管这些值是否取到。证明用的是逼近：在 $A$ 和 $B$ 中取距各自上确界不超过 $\\frac{\\varepsilon}{2}$ 的元素。",
  ],
  (rng) => {
    const [a, b] = [rng.int(-9, 5), rng.int(1, 8)];
    const [c, d] = [rng.int(-9, 5), rng.int(1, 8)];
    const [top1, top2] = [a + b, c + d];
    const inf = rng.bool();
    const answer = inf ? a + c : top1 + top2;
    return ask(
      [
        `$A$ is the open interval $(${a}, ${top1})$ and $B$ is the open interval $(${c}, ${top2})$. What is the ${inf ? "infimum" : "supremum"} of $A + B$?`,
        `$A$ 是开区间 $(${a}, ${top1})$，$B$ 是开区间 $(${c}, ${top2})$。$A + B$ 的${inf ? "下确界" : "上确界"}是多少？`,
      ],
      answer,
      [inf ? top1 + top2 : a + c, top1 + c, a + top2, answer + 1].filter((v) => v !== answer),
      [
        inf ? `Infimums add: $(${a}) + (${c}) = ${answer}$.` : `Suprema add: $(${top1}) + (${top2}) = ${answer}$.`,
        inf ? `下确界相加：$(${a}) + (${c}) = ${answer}$。` : `上确界相加：$(${top1}) + (${top2}) = ${answer}$。`,
      ],
    );
  },
);

const fractionsBetween = point(
  "counting-fractions-in-an-interval",
  ["Counting fractions in an interval", "数区间中的分数"],
  [
    "The Archimedean property shows that for large $n$ the multiples of $\\frac{1}{n}$ have spacing small enough to land in any interval. Counting them makes this concrete: between two whole numbers $a < b$, the multiples of $\\frac{1}{n}$ strictly inside number $n (b - a) - 1$, which grows without limit.",
    "阿基米德性质说明：当 $n$ 很大时，$\\frac{1}{n}$ 的倍数间隔足够小，能落在任何区间内。数一数就更具体：在两个整数 $a < b$ 之间，严格在内部的 $\\frac{1}{n}$ 的倍数有 $n (b - a) - 1$ 个，它无限增长。",
  ],
  (rng) => {
    const a = rng.int(-5, 5);
    const b = a + rng.int(1, 4);
    const n = rng.int(2, 12);
    const answer = n * (b - a) - 1;
    return ask(
      [
        `How many multiples of $\\frac{1}{${n}}$ lie strictly between ${a} and ${b}?`,
        `严格在 ${a} 和 ${b} 之间的 $\\frac{1}{${n}}$ 的倍数有多少个？`,
      ],
      answer,
      [answer + 1, answer + 2, n, n * b - 1].filter((v) => v !== answer),
      [
        `Including both ends there are $${n} \\cdot ${b - a} + 1$ multiples, and removing the 2 ends leaves ${answer}.`,
        `算上两端共有 $${n} \\cdot ${b - a} + 1$ 个倍数，去掉两端后剩 ${answer} 个。`,
      ],
    );
  },
);

const leadingCoefficients = point(
  "the-limit-of-a-rational-sequence",
  ["The limit of a rational sequence", "有理式数列的极限"],
  [
    "For a quotient of polynomials in $n$ of the same degree, divide the top and bottom by the highest power of $n$. Every other term then tends to 0 by the algebra of limits. So the limit is the ratio of the leading coefficients, and the lower terms have no effect.",
    "对于 $n$ 的同次多项式之商，分子分母同除以 $n$ 的最高次幂。由极限的代数性质，其余各项都趋于 0。所以极限是首项系数之比，低次项没有影响。",
  ],
  (rng) => {
    const [a, c] = [rng.int(1, 9), rng.int(2, 9)];
    const [b, d] = [rng.pick([-7, -4, -2, -1, 1, 3, 5, 8]), rng.pick([-6, -3, -1, 1, 2, 4, 9])];
    const answer = frac(a, c);
    return ask(
      [
        `What is the limit of $\\frac{${coef(a, "n^2")} ${signed(b, "n")}}{${coef(c, "n^2")} ${signed(d)}}$ as $n \\to \\infty$?`,
        `当 $n \\to \\infty$ 时，$\\frac{${coef(a, "n^2")} ${signed(b, "n")}}{${coef(c, "n^2")} ${signed(d)}}$ 的极限是多少？`,
      ],
      answer,
      [frac(c, a), frac(b, d), frac(a + b, c + d === 0 ? 1 : c + d), Q.of(0, 1)],
      [
        `Dividing by $n^2$ gives $\\frac{${a} + \\cdots}{${c} + \\cdots}$, where the other terms tend to 0. So the limit is $${answer.toLatex()}$.`,
        `除以 $n^2$ 得 $\\frac{${a} + \\cdots}{${c} + \\cdots}$，其余各项趋于 0。所以极限是 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const limsup = point(
  "limit-superior-and-inferior",
  ["Limit superior and inferior", "上极限与下极限"],
  [
    "A bounded sequence may have no limit, yet it always has a largest and a smallest limit of subsequences. These are the limit superior and the limit inferior. The sequence converges exactly when the two are equal. For $a + b (-1)^n + \\frac{c}{n}$, the last term dies away and the first two leave two limit points.\n\nFor $x_n = 1 + 3 (-1)^n + \\frac{2}{n}$, the even terms tend to $1 + 3 = 4$ and the odd terms to $1 - 3 = -2$. So the limit superior is $4$ and the limit inferior is $-2$.\n\nCheck: $x_{100} = 4.02$ and $x_{101} = -2 + \\frac{2}{101} \\approx -1.98$, close to the two limits, and every index is even or odd, so no other limit point exists.\n\n> **Watch out.** The limit superior is not the largest term. Here $x_2 = 5$ is bigger than $4$, but finitely many early terms do not affect the limit superior.",
    "有界数列可能没有极限，但子数列的极限总有最大值和最小值，分别称为上极限和下极限。数列收敛当且仅当两者相等。对 $a + b (-1)^n + \\frac{c}{n}$，最后一项趋于零，前两项留下两个极限点。\n\n对 $x_n = 1 + 3 (-1)^n + \\frac{2}{n}$，偶数项趋于 $1 + 3 = 4$，奇数项趋于 $1 - 3 = -2$。所以上极限是 $4$，下极限是 $-2$。\n\n检验：$x_{100} = 4.02$，$x_{101} = -2 + \\frac{2}{101} \\approx -1.98$，都接近这两个极限；每个下标不是偶数就是奇数，所以没有别的极限点。\n\n> **注意。** 上极限不是最大的项。这里 $x_2 = 5$ 比 $4$ 大，但有限个前面的项不影响上极限。",
  ],
  (rng) => {
    const a = rng.nonZero(-6, 6);
    const b = rng.int(1, 6);
    const c = rng.int(1, 9);
    const sup = rng.bool();
    const answer = sup ? a + b : a - b;
    const other = sup ? a - b : a + b;
    return solved(
      [
        `What is the limit ${sup ? "superior" : "inferior"} of $x_n = ${a} + ${coef(b, "(-1)^n")} + \\frac{${c}}{n}$?`,
        `$x_n = ${a} + ${coef(b, "(-1)^n")} + \\frac{${c}}{n}$ 的${sup ? "上" : "下"}极限是多少？`,
      ],
      answer,
      [
        why(
          other,
          `That is the limit ${sup ? "inferior" : "superior"}, the ${sup ? "smaller" : "larger"} of the two subsequential limits.`,
          `这是${sup ? "下" : "上"}极限，即两个子数列极限中较${sup ? "小" : "大"}的一个。`,
        ),
        why(
          a,
          `That is the midpoint of the two limits; the terms keep jumping between them and never settle at $${a}$.`,
          `这是两个极限的中点；各项在两者之间来回跳动，从不停在 $${a}$。`,
        ),
        why(
          answer + c,
          `That keeps $\\frac{${c}}{n}$ at $n = 1$; this term tends to 0, and early terms do not affect the limit ${sup ? "superior" : "inferior"}.`,
          `这保留了 $n = 1$ 时的 $\\frac{${c}}{n}$；这一项趋于 0，前面的项不影响${sup ? "上" : "下"}极限。`,
        ),
        why(b, `That is only the size of the oscillation; it leaves out the constant $${a}$.`, `这只是振荡的幅度；漏掉了常数 $${a}$。`),
      ],
      solution(
        [
          [
            ["Drop the vanishing term", "去掉趋于零的项"],
            [
              `The term $\\frac{${c}}{n}$ tends to 0, so it does not change any subsequential limit.`,
              `$\\frac{${c}}{n}$ 趋于 0，所以它不改变任何子数列的极限。`,
            ],
          ],
          [
            ["Split even and odd indices", "按下标奇偶分开"],
            [
              `For even $n$ the terms tend to $${a} + ${b} = ${a + b}$, and for odd $n$ to $${a} - ${b} = ${a - b}$.`,
              `$n$ 为偶数时各项趋于 $${a} + ${b} = ${a + b}$，$n$ 为奇数时趋于 $${a} - ${b} = ${a - b}$。`,
            ],
          ],
          [
            [`Take the ${sup ? "larger" : "smaller"} limit`, sup ? "取较大的极限" : "取较小的极限"],
            [
              `The limit ${sup ? "superior" : "inferior"} is the ${sup ? "larger" : "smaller"} of the two, $${answer}$.`,
              `${sup ? "上" : "下"}极限是两者中较${sup ? "大" : "小"}的，即 $${answer}$。`,
            ],
          ],
        ],
        [
          `Every index is even or odd, so every convergent subsequence tends to $${a + b}$ or $${a - b}$, and $${answer}$ is the ${sup ? "largest" : "smallest"} of these.`,
          `每个下标不是偶数就是奇数，所以每个收敛子数列都趋于 $${a + b}$ 或 $${a - b}$，而 $${answer}$ 是其中${sup ? "最大" : "最小"}的。`,
        ],
      ),
    );
  },
);

const tailBound = point(
  "bounding-the-tail-of-a-p-series",
  ["Bounding the tail of a p-series", "估计 p 级数的尾部"],
  [
    "Comparing with an integral bounds what remains of a convergent $p$-series. The sum of $\\frac{1}{k^p}$ over $k > n$ is less than $\\int_n^\\infty x^{-p} \\, dx = \\frac{1}{(p - 1) n^{p - 1}}$. So the partial sum to $n$ is known with an explicit error, and the bound shows how slowly small $p$ converges. For $p = 2$ and $n = 3$, $\\sum_{k > 3} \\frac{1}{k^{2}} < \\int_{3}^{\\infty} \\frac{dx}{x^{2}} = \\frac{1}{3}$.\n\nCheck: the whole sum is $\\frac{\\pi^{2}}{6} \\approx 1.6449$, and the first three terms give about $1.3611$. So the tail is about $0.2838$, which is indeed below $\\frac{1}{3}$.\n\n> **Watch out.** The integral starts at $n$, not at $n + 1$: starting at $n + 1$ gives a lower bound for the tail instead.",
    "与积分比较可以估计收敛 $p$ 级数的余项。$k > n$ 时 $\\frac{1}{k^p}$ 之和小于 $\\int_n^\\infty x^{-p} \\, dx = \\frac{1}{(p - 1) n^{p - 1}}$。所以到 $n$ 的部分和有明确的误差，这个界也说明了 $p$ 较小时收敛有多慢。对 $p = 2$，$n = 3$，$\\sum_{k > 3} \\frac{1}{k^{2}} < \\int_{3}^{\\infty} \\frac{dx}{x^{2}} = \\frac{1}{3}$。\n\n检验：整个和是 $\\frac{\\pi^{2}}{6} \\approx 1.6449$，前三项之和约为 $1.3611$。所以尾部约为 $0.2838$，确实小于 $\\frac{1}{3}$。\n\n> **注意。** 积分从 $n$ 开始，而不是从 $n + 1$ 开始：从 $n + 1$ 开始得到的是尾部的下界。",
  ],
  (rng) => {
    const p = rng.int(2, 5);
    const n = rng.int(2, [20, 10, 5, 2][p - 2] ?? 2);
    const answer = Q.of(1, (p - 1) * n ** (p - 1));
    const lower = Q.of(1, (p - 1) * (n + 1) ** (p - 1));
    const last = 2000;
    let tail = 1 / ((p - 1) * (last + 0.5) ** (p - 1));
    for (let k = n + 1; k <= last; k += 1) tail += 1 / k ** p;
    const value = p === 2 ? `\\frac{1}{${n}}` : `\\frac{1}{${p - 1} \\cdot ${n}^{${p - 1}}} = ${answer.toLatex()}`;
    const parts: Step[] = [
      [
        ["Compare with the integral", "与积分比较"],
        t(
          "Each term $\\frac{1}{k^{p}}$ is less than the area under $x^{-p}$ from $k - 1$ to $k$, so the tail is less than the integral from $n$:",
          "每一项 $\\frac{1}{k^{p}}$ 都小于 $x^{-p}$ 从 $k - 1$ 到 $k$ 下方的面积，所以尾部小于从 $n$ 开始的积分：",
        ),
        [`\\sum_{k > ${n}} \\frac{1}{k^{${p}}} < \\int_{${n}}^{\\infty} x^{-${p}}\\,dx`],
      ],
      [
        ["Evaluate the integral", "计算积分"],
        t(
          `Put $p = ${p}$ and $n = ${n}$ into $\\frac{1}{(p - 1) n^{p - 1}}$:`,
          `把 $p = ${p}$，$n = ${n}$ 代入 $\\frac{1}{(p - 1) n^{p - 1}}$：`,
        ),
        [`\\int_{${n}}^{\\infty} x^{-${p}}\\,dx = ${value}`],
      ],
    ];
    return numberProblem({
      prompt: t(
        `What does the integral bound $\\frac{1}{(p - 1) n^{p - 1}}$ give for $\\sum_{k > ${n}} \\frac{1}{k^{${p}}}$?`,
        `积分界 $\\frac{1}{(p - 1) n^{p - 1}}$ 对 $\\sum_{k > ${n}} \\frac{1}{k^{${p}}}$ 给出什么结果？`,
      ),
      answer,
      mistakes: (
        [
          [
            Q.of(1, n ** (p - 1)),
            "This forgets to divide by $p - 1$, which comes from the antiderivative",
            "这里忘了除以 $p - 1$，它来自原函数",
          ],
          [
            lower,
            `This starts the integral at $${n + 1}$; that gives a lower bound for the tail, not an upper bound`,
            `这里积分从 $${n + 1}$ 开始；那样得到的是尾部的下界，而不是上界`,
          ],
          [
            Q.of(1, (p - 1) * n ** p),
            `This keeps the power $${p}$; integrating lowers it to $${p - 1}$`,
            `这里保留了幂次 $${p}$；积分后幂次降为 $${p - 1}$`,
          ],
          [
            Q.of(1, p * n ** (p - 1)),
            `This divides by $${p}$; the antiderivative of $x^{-${p}}$ has $-${p - 1}$ in front`,
            `这里除以了 $${p}$；$x^{-${p}}$ 的原函数前面是 $-${p - 1}$`,
          ],
        ] as const
      )
        .filter(([v], i, all) => !v.eq(answer) && all.findIndex(([u]) => u.eq(v)) === i)
        .map(([v, en, zh]) => why(v, en, zh)),
      solution: walked(
        parts,
        t(
          `Add the terms numerically. The tail is about $${tail.toFixed(5)}$, which lies between the integral from $${n + 1}$, about $${lower.toNumber().toFixed(5)}$, and the bound $${answer.toLatex()} \\approx ${answer.toNumber().toFixed(5)}$.`,
          `用数值把各项加起来。尾部约为 $${tail.toFixed(5)}$，介于从 $${n + 1}$ 开始的积分（约 $${lower.toNumber().toFixed(5)}$）与界 $${answer.toLatex()} \\approx ${answer.toNumber().toFixed(5)}$ 之间。`,
        ),
      ),
    });
  },
);

const discreteBall = point(
  "balls-in-the-discrete-metric",
  ["Balls in the discrete metric", "离散度量中的球"],
  [
    "The discrete metric sets the distance between two different points to 1. So an open ball of radius at most 1 contains only its center, and a ball of larger radius contains the whole space. Every subset is therefore open, which shows how strongly topology depends on the metric.\n\nOn a set of four points $p, q, s, u$ with the discrete metric, the ball of radius $\\frac{1}{2}$ about $p$ is $\\{p\\}$, and so is the ball of radius $1$. The ball of radius $\\frac{3}{2}$ is the whole set of four points.\n\nCheck: $d(p, q) = 1$, which is not less than $1$ but is less than $\\frac{3}{2}$, and the same holds for $s$ and $u$.\n\n> **Watch out.** A radius of exactly $1$ still gives only the center, because an open ball needs a distance strictly less than the radius.",
    "离散度量把两个不同点的距离定为 1。所以半径不超过 1 的开球只含球心，半径更大的开球含整个空间。因此每个子集都是开集，这说明拓扑多么依赖度量。\n\n在带离散度量的四点集 $p, q, s, u$ 上，以 $p$ 为心、半径 $\\frac{1}{2}$ 的球是 $\\{p\\}$，半径 $1$ 的球也是。半径 $\\frac{3}{2}$ 的球是整个四点集。\n\n检验：$d(p, q) = 1$，它不小于 $1$，但小于 $\\frac{3}{2}$；$s$ 和 $u$ 也一样。\n\n> **注意。** 半径恰好为 $1$ 时球中仍只有球心，因为开球要求距离严格小于半径。",
  ],
  (rng) => {
    const size = rng.int(3, 20);
    const small = rng.bool();
    const r = small ? frac(rng.int(1, 9), 10) : frac(rng.int(11, 40), 10);
    const answer = small ? 1 : size;
    return solved(
      [
        `A set with ${size} points has the discrete metric. How many points lie in an open ball of radius $${r.toLatex()}$?`,
        `有 ${size} 个点的集合带离散度量。半径为 $${r.toLatex()}$ 的开球中有多少个点？`,
      ],
      answer,
      [
        small
          ? why(
              size,
              `That counts every point, but the other points are at distance 1, which is not less than $${r.toLatex()}$.`,
              `这数了所有的点，但其他点的距离是 1，并不小于 $${r.toLatex()}$。`,
            )
          : why(
              1,
              `That counts only the center, but the radius $${r.toLatex()}$ is more than 1, so the points at distance 1 are inside too.`,
              `这只数了球心，但半径 $${r.toLatex()}$ 大于 1，所以距离为 1 的点也在球内。`,
            ),
        why(
          size - 1,
          small
            ? "That counts the other points instead of the center; they are too far, while the center, at distance 0, is inside."
            : "That leaves out the center, which is at distance 0 and always lies in its own ball.",
          small ? "这数的是其他点而不是球心；它们太远了，而距离为 0 的球心在球内。" : "这漏掉了球心，它的距离是 0，总在自己的球内。",
        ),
        why(
          2,
          "That counts the center and one other point; all other points are at the same distance 1, so they are all inside or all outside.",
          "这数了球心和另一个点；其他点的距离都是 1，所以要么全在球内，要么全在球外。",
        ),
        why(0, "An open ball always contains its center, which is at distance 0.", "开球总含球心，球心的距离是 0。"),
      ],
      solution(
        [
          [
            ["Compare the distances with the radius", "把距离与半径比较"],
            [
              `The center is at distance 0 and every other point at distance 1, while the radius is $${r.toLatex()}$, ${small ? "less" : "more"} than 1.`,
              `球心的距离是 0，其他每个点的距离是 1，而半径 $${r.toLatex()}$ ${small ? "小于" : "大于"} 1。`,
            ],
          ],
          [
            ["Count the points inside", "数球内的点"],
            [
              small
                ? "Only the center has distance less than the radius, so the ball holds 1 point."
                : `Every point has distance less than the radius, so the ball holds all ${size} points.`,
              small ? "只有球心的距离小于半径，所以球中有 1 个点。" : `每个点的距离都小于半径，所以球中有全部 ${size} 个点。`,
            ],
          ],
        ],
        [
          small
            ? `$1 < ${r.toLatex()}$ is false, so no point other than the center is inside, and the center itself is.`
            : `$1 < ${r.toLatex()}$ holds, so the ${size - 1} other points and the center are all inside, ${size} in all.`,
          small
            ? `$1 < ${r.toLatex()}$ 不成立，所以除球心外没有点在球内，而球心本身在内。`
            : `$1 < ${r.toLatex()}$ 成立，所以其他 ${size - 1} 个点和球心都在球内，共 ${size} 个。`,
        ],
      ),
    );
  },
);

const boundaryPoints = point(
  "counting-boundary-points",
  ["Counting boundary points", "数边界点"],
  [
    "A boundary point has both points of the set and points of its complement in every neighborhood. For a finite union of separated intervals and single points, the boundary consists of the endpoints of the intervals and the isolated points. Whether an endpoint belongs to the set makes no difference.\n\nThe set $[0, 2) \\cup \\{5\\}$ has the boundary $\\{0, 2, 5\\}$, so it has 3 boundary points.\n\nCheck: every neighborhood of $2$ holds points of $[0, 2)$ and points above $2$, and every neighborhood of $5$ holds $5$ and points near $5$ outside the set. A point such as $1$ has the neighborhood $(\\frac{1}{2}, \\frac{3}{2})$ inside the set, so it is not a boundary point.\n\n> **Watch out.** Do not leave out an endpoint because it belongs to the set: $[0, 2]$ and $(0, 2)$ have the same boundary $\\{0, 2\\}$.",
    "边界点的每个邻域中都既有集合中的点，也有补集中的点。对若干分离的区间和单点的有限并，边界由各区间的端点和孤立点组成。端点是否属于这个集合没有影响。\n\n集合 $[0, 2) \\cup \\{5\\}$ 的边界是 $\\{0, 2, 5\\}$，所以它有 3 个边界点。\n\n检验：$2$ 的每个邻域都含 $[0, 2)$ 中的点和大于 $2$ 的点，$5$ 的每个邻域都含 $5$ 以及 $5$ 附近不在集合中的点。像 $1$ 这样的点有包含在集合内的邻域 $(\\frac{1}{2}, \\frac{3}{2})$，所以不是边界点。\n\n> **注意。** 不要因为端点属于集合就把它漏掉：$[0, 2]$ 和 $(0, 2)$ 的边界都是 $\\{0, 2\\}$。",
  ],
  (rng) => {
    const [a, b, c, d, e] = [rng.int(-9, -5), rng.int(-4, -2), rng.int(0, 3), rng.int(4, 7), rng.int(8, 12)];
    const kind = rng.int(0, 3);
    const texts = [
      `(${a}, ${b}) \\cup \\{${c}\\}`,
      `[${a}, ${b}) \\cup (${c}, ${d}]`,
      `(${a}, ${b}] \\cup [${c}, ${d}) \\cup \\{${e}\\}`,
      `\\{${a}, ${c}\\} \\cup (${d}, ${e})`,
    ];
    const answer = [3, 4, 5, 4][kind] as number;
    const text = texts[kind] as string;
    const ends = (
      [
        [a, b],
        [a, b, c, d],
        [a, b, c, d],
        [d, e],
      ][kind] ?? []
    ).join(", ");
    const isolated = ([[c], [], [e], [a, c]][kind] ?? []).join(", ");
    const all = (
      [
        [a, b, c],
        [a, b, c, d],
        [a, b, c, d, e],
        [a, c, d, e],
      ][kind] ?? []
    ).join(", ");
    return solved(
      [`How many boundary points does the set $${text}$ have?`, `集合 $${text}$ 有多少个边界点？`],
      answer,
      [
        isolated === ""
          ? why(
              answer - 1,
              "That leaves out an endpoint that belongs to the set; it is still a boundary point, since points of the complement lie just beside it.",
              "这漏掉了属于集合的端点；它仍是边界点，因为紧挨着它就有补集中的点。",
            )
          : why(
              answer - 1,
              "That leaves out an isolated point; every neighborhood of it meets the complement, so it is a boundary point.",
              "这漏掉了孤立点；它的每个邻域都与补集相交，所以它是边界点。",
            ),
        isolated === ""
          ? why(
              answer + 1,
              "That counts a point that is not on the boundary; an interior point of an interval has a neighborhood inside the set.",
              "这数了不在边界上的点；区间的内点有包含在集合内的邻域。",
            )
          : why(
              answer + 1,
              "That gives an isolated point two endpoints, as if it were an interval; it is a single boundary point.",
              "这把孤立点当作区间，给了它两个端点；它只是一个边界点。",
            ),
        why(
          2,
          "That counts only the endpoints of one piece; every piece of the set adds its own boundary points.",
          "这只数了一部分的端点；集合的每一部分都有自己的边界点。",
        ),
        why(
          0,
          "That treats the set as having no boundary; only the empty set and the whole line have no boundary points.",
          "这把集合当作没有边界；只有空集和整条直线没有边界点。",
        ),
        why(
          6,
          "That counts points that are not on the boundary; the boundary holds only the endpoints of the intervals and the isolated points.",
          "这数了不在边界上的点；边界只含区间的端点和孤立点。",
        ),
      ],
      solution(
        [
          [
            ["Take the endpoints of the intervals", "取区间的端点"],
            [
              `Each interval gives its two endpoints, whether or not they belong to the set: $${ends}$.`,
              `每个区间给出两个端点，不管它们是否属于集合：$${ends}$。`,
            ],
          ],
          [
            ["Add the isolated points", "加上孤立点"],
            isolated === ""
              ? ["The set has no isolated points.", "这个集合没有孤立点。"]
              : [`Each isolated point is a boundary point too: $${isolated}$.`, `每个孤立点也是边界点：$${isolated}$。`],
          ],
        ],
        [
          `The boundary is $\\{${all}\\}$, with ${answer} points. Any other point has a small neighborhood lying wholly inside the set or wholly outside it.`,
          `边界是 $\\{${all}\\}$，共 ${answer} 个点。其他任何点都有一个小邻域完全在集合内或完全在集合外。`,
        ],
      ),
    );
  },
);

const oddSquare = point(
  "the-derivative-of-x-times-its-absolute-value",
  ["The derivative of x times its absolute value", "x 乘其绝对值的导数"],
  [
    "The function $x |x|$ equals $x^2$ for positive $x$ and $-x^2$ for negative $x$. Both one-sided derivatives at 0 are 0, so it is differentiable there, and its derivative is $2 |x|$. That derivative has a corner at 0, so this is a differentiable function whose derivative is not differentiable.\n\nFor $f(x) = 3x |x|$, the derivative is $6 |x|$, so $f'(-2) = 12$.\n\nCheck: for $x < 0$ the function is $-3x^2$, whose derivative $-6x$ is $12$ at $x = -2$.\n\n> **Watch out.** For negative $x$ the derivative is $-2x$ times the coefficient, not $2x$ times it, so $f'$ is never negative when the coefficient is positive.",
    "函数 $x |x|$ 在 $x$ 为正时等于 $x^2$，为负时等于 $-x^2$。在 0 处两个单侧导数都是 0，所以它在那里可导，导数是 $2 |x|$。这个导数在 0 处有尖点，所以这是一个可导但导数不可导的函数。\n\n对 $f(x) = 3x |x|$，导数是 $6 |x|$，所以 $f'(-2) = 12$。\n\n检验：$x < 0$ 时函数是 $-3x^2$，它的导数 $-6x$ 在 $x = -2$ 处等于 $12$。\n\n> **注意。** 对负的 $x$，导数是系数乘 $-2x$，而不是乘 $2x$，所以系数为正时 $f'$ 从不为负。",
  ],
  (rng) => {
    const c = rng.int(1, 9);
    const a = rng.pick([-7, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6]);
    const answer = 2 * c * Math.abs(a);
    const h = 0.001;
    const quotient = (c * (a + h) * Math.abs(a + h) - c * a * Math.abs(a)) / h;
    return solved(
      [`If $f(x) = ${coef(c, "x |x|")}$, what is $f'(${a})$?`, `若 $f(x) = ${coef(c, "x |x|")}$，$f'(${a})$ 是多少？`],
      answer,
      [
        why(
          2 * c * a,
          `That uses $${2 * c}x$, the derivative of $${coef(c, "x^2")}$; for negative $x$ the function is $-${coef(c, "x^2")}$, whose derivative is $-${2 * c}x$.`,
          `这用的是 $${2 * c}x$，即 $${coef(c, "x^2")}$ 的导数；$x$ 为负时函数是 $-${coef(c, "x^2")}$，导数是 $-${2 * c}x$。`,
        ),
        why(c * Math.abs(a), "That forgets the factor 2 that comes from differentiating the square.", "这忘了对平方求导得到的因子 2。"),
        why(
          c * a * Math.abs(a),
          `That is $f(${a})$ itself, the value of the function, not its slope.`,
          `这是函数值 $f(${a})$ 本身，而不是斜率。`,
        ),
        why(
          answer + 2,
          "That adds an extra 2; by the product rule $(x |x|)' = |x| + |x| = 2 |x|$, with nothing added.",
          "这多加了 2；由乘积法则 $(x |x|)' = |x| + |x| = 2 |x|$，没有别的项。",
        ),
        why(
          2 * c,
          `That drops the factor $|x|$; the derivative $${2 * c} |x|$ depends on $x$.`,
          `这丢掉了因子 $|x|$；导数 $${2 * c} |x|$ 依赖于 $x$。`,
        ),
      ],
      solution(
        [
          [
            ["Split by sign", "按符号分段"],
            [
              `For $x > 0$, $f(x) = ${coef(c, "x^2")}$, and for $x < 0$, $f(x) = -${coef(c, "x^2")}$.`,
              `$x > 0$ 时 $f(x) = ${coef(c, "x^2")}$，$x < 0$ 时 $f(x) = -${coef(c, "x^2")}$。`,
            ],
          ],
          [
            ["Differentiate each piece", "对每一段求导"],
            [
              `The derivative is $${2 * c}x$ for $x > 0$ and $-${2 * c}x$ for $x < 0$, so $f'(x) = ${2 * c} |x|$. At 0 both one-sided derivatives are 0, so the formula holds there too.`,
              `$x > 0$ 时导数是 $${2 * c}x$，$x < 0$ 时是 $-${2 * c}x$，所以 $f'(x) = ${2 * c} |x|$。在 0 处两个单侧导数都是 0，所以公式在那里也成立。`,
            ],
          ],
          [
            ["Evaluate", "计算"],
            [`$f'(${a}) = ${2 * c} |${a}| = ${answer}$.`, `$f'(${a}) = ${2 * c} |${a}| = ${answer}$。`],
          ],
        ],
        [
          `The difference quotient $\\frac{f(${a} + h) - f(${a})}{h}$ at $h = 0.001$ is about $${quotient.toFixed(3)}$, close to $${answer}$.`,
          `差商 $\\frac{f(${a} + h) - f(${a})}{h}$ 在 $h = 0.001$ 时约为 $${quotient.toFixed(3)}$，接近 $${answer}$。`,
        ],
      ),
    );
  },
);

const taylorCoefficient = point(
  "a-taylor-coefficient-from-a-derivative",
  ["A Taylor coefficient from a derivative", "由导数求泰勒系数"],
  [
    "The Taylor polynomial of $f$ at 0 has the coefficient $\\frac{f^{(n)}(0)}{n!}$ on $x^n$. The reason is that the $n$th derivative of $x^n$ is $n!$ and it is the only term that survives at 0. So derivatives at a point determine the polynomial, and conversely.",
    "$f$ 在 0 处的泰勒多项式中 $x^n$ 的系数是 $\\frac{f^{(n)}(0)}{n!}$。原因是 $x^n$ 的 $n$ 阶导数是 $n!$，而且在 0 处只有这一项留下来。所以某点的导数决定多项式，反之亦然。",
  ],
  (rng) => {
    const n = rng.int(2, 6);
    const m = rng.int(2, 60);
    let factorial = 1;
    for (let i = 2; i <= n; i++) factorial *= i;
    const answer = frac(m, factorial);
    return ask(
      [
        `If the derivative of order ${n} of $f$ at 0 is ${m}, what is the coefficient of $x^{${n}}$ in its Taylor polynomial at 0?`,
        `若 $f$ 在 0 处的 ${n} 阶导数是 ${m}，它在 0 处的泰勒多项式中 $x^{${n}}$ 的系数是多少？`,
      ],
      answer,
      [frac(m, n), Q.of(m, 1), frac(factorial, m), frac(m, factorial * n)].filter((v) => !v.eq(answer)),
      [`Divide by the factorial: $\\frac{${m}}{${n}!} = ${answer.toLatex()}$.`, `除以阶乘：$\\frac{${m}}{${n}!} = ${answer.toLatex()}$。`],
    );
  },
);

const lowerSum = point(
  "upper-and-lower-sums-of-the-identity",
  ["Upper and lower sums of the identity", "恒等函数的上和与下和"],
  [
    "For $f(x) = x$ on $[0, 1]$ with $n$ equal parts, each lower sum uses left endpoints and each upper sum right endpoints. They come to $\\frac{n - 1}{2 n}$ and $\\frac{n + 1}{2 n}$. Their difference $\\frac{1}{n}$ tends to 0, so the integral exists and equals $\\frac{1}{2}$.",
    "对 $[0, 1]$ 上的 $f(x) = x$ 作 $n$ 等分，下和用左端点，上和用右端点。它们分别是 $\\frac{n - 1}{2 n}$ 和 $\\frac{n + 1}{2 n}$。它们的差 $\\frac{1}{n}$ 趋于 0，所以积分存在且等于 $\\frac{1}{2}$。",
  ],
  (rng) => {
    const n = rng.int(2, 30);
    const lower = rng.bool();
    const answer = lower ? frac(n - 1, 2 * n) : frac(n + 1, 2 * n);
    return ask(
      [
        `What is the ${lower ? "lower" : "upper"} sum of $f(x) = x$ on $[0, 1]$ with ${n} equal parts?`,
        `$[0, 1]$ 上的 $f(x) = x$ 作 ${n} 等分，${lower ? "下" : "上"}和是多少？`,
      ],
      answer,
      [lower ? frac(n + 1, 2 * n) : frac(n - 1, 2 * n), Q.of(1, 2), Q.of(1, n), frac(n - 1, n)],
      [
        `The ${lower ? "left" : "right"} endpoints give $\\frac{1}{${n}} \\cdot \\frac{${lower ? n - 1 : n + 1} \\cdot ${n}}{2 \\cdot ${n}} = ${answer.toLatex()}$.`,
        `${lower ? "左" : "右"}端点给出 $\\frac{1}{${n}} \\cdot \\frac{${lower ? n - 1 : n + 1} \\cdot ${n}}{2 \\cdot ${n}} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const variableLimit = point(
  "an-accumulation-function-with-a-moving-limit",
  ["An accumulation function with a moving limit", "变上限的积分函数"],
  [
    "When the upper limit of an integral is itself a function, combine the fundamental theorem with the chain rule. The derivative of $\\int_0^{x^2} g(t) \\, dt$ is $g(x^2) \\cdot 2 x$. This holds wherever $g$ is continuous, because then the inner accumulation function is differentiable.",
    "当积分上限本身是函数时，把微积分基本定理和链式法则结合起来。$\\int_0^{x^2} g(t) \\, dt$ 的导数是 $g(x^2) \\cdot 2 x$。只要 $g$ 连续这就成立，因为这时内层的积分函数可导。",
  ],
  (rng) => {
    const [c, a, m] = [rng.int(1, 9), rng.int(1, 5), rng.int(1, 4)];
    const answer = (m * a * a + c) * 2 * a;
    return ask(
      [
        `If $F(x) = \\int_0^{x^2} (${coef(m, "t")} + ${c}) \\, dt$, what is $F'(${a})$?`,
        `若 $F(x) = \\int_0^{x^2} (${coef(m, "t")} + ${c}) \\, dt$，$F'(${a})$ 是多少？`,
      ],
      answer,
      [m * a * a + c, m * a + c, (m * a + c) * 2 * a, answer + 2 * a].filter((v) => v !== answer),
      [
        `$F'(x) = (${coef(m, "x^2")} + ${c}) \\cdot 2 x$, which at $x = ${a}$ is $${m * a * a + c} \\cdot ${2 * a} = ${answer}$.`,
        `$F'(x) = (${coef(m, "x^2")} + ${c}) \\cdot 2 x$，在 $x = ${a}$ 处等于 $${m * a * a + c} \\cdot ${2 * a} = ${answer}$。`,
      ],
    );
  },
);

const coverLength = point(
  "the-total-length-of-a-shrinking-cover",
  ["The total length of a shrinking cover", "收缩覆盖的总长度"],
  [
    "To cover a countable list of points by intervals of small total length, give the $k$th point an interval of length $\\frac{\\varepsilon}{2^k}$. The lengths form a geometric series with sum $\\varepsilon$. This is the standard proof that every countable set has measure zero, however dense it may be.",
    "要用总长度很小的区间覆盖可数个点，就给第 $k$ 个点一个长度为 $\\frac{\\varepsilon}{2^k}$ 的区间。这些长度构成和为 $\\varepsilon$ 的几何级数。这是每个可数集（不管多稠密）测度为零的标准证明。",
  ],
  (rng) => {
    const e = rng.pick([1, 2, 3, 5, 7]);
    const d = rng.pick([10, 100, 1000]);
    const n = rng.int(2, 6);
    const answer = frac(e * (2 ** n - 1), d * 2 ** n);
    const eps = frac(e, d);
    return ask(
      [
        `The $k$th of ${n} points gets an interval of length $\\frac{\\varepsilon}{2^k}$, with $\\varepsilon = ${eps.toLatex()}$. What is the total length of the ${n} intervals?`,
        `${n} 个点中第 $k$ 个点得到长度为 $\\frac{\\varepsilon}{2^k}$ 的区间，$\\varepsilon = ${eps.toLatex()}$。这 ${n} 个区间的总长度是多少？`,
      ],
      answer,
      [eps, frac(e, d * 2 ** n), frac(e * n, d * 2 ** n), frac(e * (2 ** n - 1), d)],
      [
        `The sum of $\\frac{1}{2^k}$ for $k$ up to ${n} is $1 - \\frac{1}{2^{${n}}}$. Multiplying by $\\varepsilon$ gives $${answer.toLatex()}$.`,
        `$k$ 到 ${n} 的 $\\frac{1}{2^k}$ 之和是 $1 - \\frac{1}{2^{${n}}}$。乘 $\\varepsilon$ 得 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const iterationsNeeded = point(
  "how-many-iterations-are-enough",
  ["How many iterations are enough", "迭代多少次才够"],
  [
    "For a contraction with constant $L$, the error after $n$ steps is at most $\\frac{L^n}{1 - L} |x_1 - x_0|$. Since this bound uses only the first step, it can tell in advance how many iterations will reach a desired accuracy. Choose the smallest $n$ that brings it below the tolerance.\n\nFor $L = \\frac{1}{2}$ and $|x_1 - x_0| = 3$, the bound is $\\frac{6}{2^n}$. It falls below $\\frac{1}{100}$ when $2^n > 600$, and $2^9 = 512$ while $2^{10} = 1024$, so $n = 10$.\n\nCheck: $\\frac{6}{1024} \\approx 0.0059 < 0.01$, while $\\frac{6}{512} \\approx 0.0117 > 0.01$.\n\n> **Watch out.** Keep the factor $\\frac{1}{1 - L}$. Without it the bound would be $\\frac{3}{2^n}$, which gives $n = 9$, too few steps for the guarantee.",
    "对常数为 $L$ 的压缩映射，$n$ 步后的误差不超过 $\\frac{L^n}{1 - L} |x_1 - x_0|$。这个界只用到第一步，所以能预先知道多少次迭代才能达到所需精度。选择使它低于容差的最小 $n$。\n\n对 $L = \\frac{1}{2}$，$|x_1 - x_0| = 3$，界是 $\\frac{6}{2^n}$。它低于 $\\frac{1}{100}$ 当且仅当 $2^n > 600$，而 $2^9 = 512$，$2^{10} = 1024$，所以 $n = 10$。\n\n检验：$\\frac{6}{1024} \\approx 0.0059 < 0.01$，而 $\\frac{6}{512} \\approx 0.0117 > 0.01$。\n\n> **注意。** 要保留因子 $\\frac{1}{1 - L}$。没有它，界就成了 $\\frac{3}{2^n}$，得到 $n = 9$，步数不足以保证精度。",
  ],
  (rng) => {
    const denominator = rng.pick([2, 3, 4, 5]);
    const d = rng.int(1, 6);
    const k = rng.pick([10, 20, 50, 100, 200, 500, 1000]);
    let n = 1;
    while ((d * denominator) / (denominator - 1) >= denominator ** n / k) n++;
    let short = 0;
    while (d >= denominator ** short / k) short++;
    const front = frac(d * denominator, denominator - 1).toLatex();
    const target = frac(d * denominator * k, denominator - 1).toLatex();
    const bound = (m: number) => frac(d * denominator, (denominator - 1) * denominator ** m).toLatex();
    const powers = n === 1 ? `${target} < ${denominator}` : `${denominator ** (n - 1)} \\le ${target} < ${denominator ** n}`;
    return solved(
      [
        `A contraction has constant $L = \\frac{1}{${denominator}}$ and $|x_1 - x_0| = ${d}$. What is the smallest $n$ for which the bound $\\frac{L^n}{1 - L} |x_1 - x_0|$ falls below $\\frac{1}{${k}}$?`,
        `压缩映射的常数 $L = \\frac{1}{${denominator}}$，$|x_1 - x_0| = ${d}$。使界 $\\frac{L^n}{1 - L} |x_1 - x_0|$ 低于 $\\frac{1}{${k}}$ 的最小 $n$ 是多少？`,
      ],
      n,
      [
        why(
          n + 1,
          `That is one step more than needed; at $n = ${n}$ the bound is already $${bound(n)}$, below $\\frac{1}{${k}}$.`,
          `这比所需多一步；$n = ${n}$ 时界已经是 $${bound(n)}$，低于 $\\frac{1}{${k}}$。`,
        ),
        n - 1 > 0
          ? why(
              n - 1,
              `That stops one step early; at $n = ${n - 1}$ the bound is $${bound(n - 1)}$, which is not below $\\frac{1}{${k}}$.`,
              `这早停了一步；$n = ${n - 1}$ 时界是 $${bound(n - 1)}$，并不低于 $\\frac{1}{${k}}$。`,
            )
          : why(
              n + 2,
              `That is two steps more than needed; the question asks for the smallest $n$, and $n = ${n}$ already works.`,
              `这比所需多两步；题目要的是最小的 $n$，而 $n = ${n}$ 已经满足。`,
            ),
        why(
          n + 3,
          `That is three steps more than needed; the question asks for the smallest $n$, and $n = ${n}$ already works.`,
          `这比所需多三步；题目要的是最小的 $n$，而 $n = ${n}$ 已经满足。`,
        ),
        why(
          k,
          `That is the denominator of the tolerance $\\frac{1}{${k}}$, not a number of steps.`,
          `这是容差 $\\frac{1}{${k}}$ 的分母，而不是步数。`,
        ),
        why(
          short,
          "That leaves out the factor $\\frac{1}{1 - L}$; without it the estimate is too small, so too few steps seem enough.",
          "这漏掉了因子 $\\frac{1}{1 - L}$；没有它估计值偏小，看起来较少的步数就够了。",
        ),
      ],
      solution(
        [
          [
            ["Write the bound", "写出误差界"],
            [
              `With $L = \\frac{1}{${denominator}}$, $\\frac{1}{1 - L} = ${frac(denominator, denominator - 1).toLatex()}$, so the bound is $${front} \\cdot \\frac{1}{${denominator}^n}$.`,
              `$L = \\frac{1}{${denominator}}$ 时 $\\frac{1}{1 - L} = ${frac(denominator, denominator - 1).toLatex()}$，所以界是 $${front} \\cdot \\frac{1}{${denominator}^n}$。`,
            ],
          ],
          [
            ["Compare with the tolerance", "与容差比较"],
            [
              `The bound is below $\\frac{1}{${k}}$ when $${denominator}^n > ${target}$. Since $${powers}$, the smallest such $n$ is $${n}$.`,
              `当 $${denominator}^n > ${target}$ 时界低于 $\\frac{1}{${k}}$。由于 $${powers}$，满足条件的最小 $n$ 是 $${n}$。`,
            ],
          ],
        ],
        [
          `At $n = ${n}$ the bound is $${bound(n)} < \\frac{1}{${k}}$, while at $n = ${n - 1}$ it is $${bound(n - 1)}$, which is not below $\\frac{1}{${k}}$.`,
          `$n = ${n}$ 时界是 $${bound(n)} < \\frac{1}{${k}}$，而 $n = ${n - 1}$ 时是 $${bound(n - 1)}$，并不低于 $\\frac{1}{${k}}$。`,
        ],
      ),
    );
  },
);

/** deeperRealAnalysisPoints maps topics of Real Analysis to their further knowledge points. */
export const deeperRealAnalysisPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "supremum-and-infimum": [supremumOfSums],
  "the-archimedean-property": [fractionsBetween],
  "the-algebra-of-limits": [leadingCoefficients],
  "subsequences-and-the-bolzano-weierstrass-theorem": [limsup],
  "harmonic-series-and-p-series": [tailBound],
  "distances-in-metric-spaces": [discreteBall],
  "open-and-closed-sets-of-reals": [boundaryPoints],
  "differentiability-in-analysis": [oddSquare],
  "taylors-theorem-with-remainder": [taylorCoefficient],
  "bounds-and-means-of-integrals": [lowerSum],
  "the-fundamental-theorem-in-analysis": [variableLimit],
  "sets-of-measure-zero": [coverLength],
  "the-contraction-mapping-principle": [iterationsNeeded],
};
