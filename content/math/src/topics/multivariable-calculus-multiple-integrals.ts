import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { paren, poly, Q } from "@ga/subject-math";
import { choiceProblem, numberProblem, steps } from "../problems.ts";

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

/** Helper for multiple-choice problems with shuffled options. */
function pickChoice(rng: Rng, prompt: Text, right: Text, wrong: readonly Text[], solution: Text): Problem {
  const all = [right, ...wrong];
  const perm = rng.shuffle(all.map((_, i) => i));
  const options = perm.map((i) => all[i]!);
  const correct = perm.indexOf(0);
  return choiceProblem({ prompt, options, correct, solution });
}

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
  prerequisites: ["left-and-right-riemann-sums-in-sigma-notation"],
  encompasses: [{ topic: "left-and-right-riemann-sums-in-sigma-notation", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-separable-double-summations",
      title: t("Evaluating separable double summations", "计算可分离的二重求和"),
      explanation: t(
        "When the summand is a sum of a term depending on one index and a term depending on the other, each part can be summed on its own. For a linear summand $\\sum_{i=1}^m \\sum_{j=1}^n (ai + bj)$, sum each term independently using $\\sum_{k=1}^N k = \\frac{N(N+1)}{2}$:\n\n$$\\sum_{i=1}^m \\sum_{j=1}^n (ai + bj) = a n \\frac{m(m+1)}{2} + b m \\frac{n(n+1)}{2}.$$",
        "当被加项是只依赖于一个下标的项与只依赖于另一个下标的项之和时，每一部分可以分别求和。对于线性求和项 $\\sum_{i=1}^m \\sum_{j=1}^n (ai + bj)$，利用 $\\sum_{k=1}^N k = \\frac{N(N+1)}{2}$ 独立求和：\n\n$$\\sum_{i=1}^m \\sum_{j=1}^n (ai + bj) = a n \\frac{m(m+1)}{2} + b m \\frac{n(n+1)}{2}。$$",
      ),
      generate(rng: Rng): Problem {
        const m = rng.int(2, 6);
        const n = rng.int(2, 6);
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-4, 4);

        const sumI = (m * (m + 1)) / 2;
        const sumJ = (n * (n + 1)) / 2;
        const ans = a * n * sumI + b * m * sumJ;

        const prompt = t(
          `Evaluate the double sum $\\sum_{i=1}^{${m}} \\sum_{j=1}^{${n}} (${poly([a, "i"], [b, "j"])})$.`,
          `计算二重求和 $\\sum_{i=1}^{${m}} \\sum_{j=1}^{${n}} (${poly([a, "i"], [b, "j"])})$ 的值。`,
        );
        const solution = t(
          steps(
            `Distribute the summation: $\\sum_{i=1}^{${m}} \\sum_{j=1}^{${n}} (${poly([a, "i"], [b, "j"])}) = ${poly([a, `\\sum_{j=1}^{${n}} \\left(\\sum_{i=1}^{${m}} i\\right)`], [b, `\\sum_{i=1}^{${m}} \\left(\\sum_{j=1}^{${n}} j\\right)`])}$.`,
            `Compute the single sums: $\\sum_{i=1}^{${m}} i = \\frac{${m}(${m + 1})}{2} = ${sumI}$ and $\\sum_{j=1}^{${n}} j = \\frac{${n}(${n + 1})}{2} = ${sumJ}$.`,
            `Combine with outer limits: $${a}(${n})(${sumI}) + ${paren(b)}(${m})(${sumJ}) = ${a * n * sumI} + (${b * m * sumJ}) = ${ans}$.`,
          ),
          steps(
            `展开求和式：$\\sum_{i=1}^{${m}} \\sum_{j=1}^{${n}} (${poly([a, "i"], [b, "j"])}) = ${poly([a, `\\sum_{j=1}^{${n}} \\left(\\sum_{i=1}^{${m}} i\\right)`], [b, `\\sum_{i=1}^{${m}} \\left(\\sum_{j=1}^{${n}} j\\right)`])}$。`,
            `计算一重和：$\\sum_{i=1}^{${m}} i = \\frac{${m}(${m + 1})}{2} = ${sumI}$ 且 $\\sum_{j=1}^{${n}} j = \\frac{${n}(${n + 1})}{2} = ${sumJ}$。`,
            `代入外层项：$${a}(${n})(${sumI}) + ${paren(b)}(${m})(${sumJ}) = ${a * n * sumI} + (${b * m * sumJ}) = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [ans + m * n, ans - m * n, a * sumI + b * sumJ],
        });
      },
    },
    {
      id: "separable-double-sums-of-products",
      title: t("Separable double sums of products", "可分离的乘积型二重求和"),
      explanation: t(
        "When the summand is a product of a factor depending only on $i$ and a factor depending only on $j$, the double sum splits into a product of two single sums:\n\n$$\\sum_{i=1}^{m}\\sum_{j=1}^{n} c\\,ij = c\\left(\\sum_{i=1}^{m} i\\right)\\left(\\sum_{j=1}^{n} j\\right) = c \\cdot \\frac{m(m+1)}{2} \\cdot \\frac{n(n+1)}{2}.$$\n\nThis works because the inner sum treats $i$ as a constant that can be pulled out.",
        "当被加项是只依赖 $i$ 的因子与只依赖 $j$ 的因子之积时，二重求和可拆成两个单重求和之积：\n\n$$\\sum_{i=1}^{m}\\sum_{j=1}^{n} c\\,ij = c\\left(\\sum_{i=1}^{m} i\\right)\\left(\\sum_{j=1}^{n} j\\right) = c \\cdot \\frac{m(m+1)}{2} \\cdot \\frac{n(n+1)}{2}。$$\n\n这是因为内层求和把 $i$ 当作常数，可以提出。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(1, 5);
        const m = rng.int(2, 6);
        const n = rng.int(2, 6);
        const si = (m * (m + 1)) / 2;
        const sj = (n * (n + 1)) / 2;
        const ans = c * si * sj;
        const term = c === 1 ? "ij" : `${c}ij`;
        return numberProblem({
          prompt: t(`Evaluate $\\sum_{i=1}^{${m}} \\sum_{j=1}^{${n}} ${term}$.`, `计算 $\\sum_{i=1}^{${m}} \\sum_{j=1}^{${n}} ${term}$。`),
          answer: ans,
          wrong: [c * si * n, c * m * sj, c * (si + sj), c * m * n],
          solution: t(
            `The sum separates: $${c === 1 ? "" : `${c} \\cdot `}\\left(\\sum_{i=1}^{${m}} i\\right)\\left(\\sum_{j=1}^{${n}} j\\right) = ${c === 1 ? "" : `${c} \\cdot `}${si} \\cdot ${sj} = ${ans}$.`,
            `求和可分离：$${c === 1 ? "" : `${c} \\cdot `}\\left(\\sum_{i=1}^{${m}} i\\right)\\left(\\sum_{j=1}^{${n}} j\\right) = ${c === 1 ? "" : `${c} \\cdot `}${si} \\cdot ${sj} = ${ans}$。`,
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
  prerequisites: ["double-summations"],
  encompasses: [{ topic: "double-summations", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "mesh-of-regular-interval-partitions",
      title: t("Mesh of regular interval partitions", "等距区间分割的网格模"),
      explanation: t(
        "The mesh of a partition is the width of its widest piece, so for equal pieces it is simply the length of the interval divided by the number of pieces. A regular partition of $[a, b]$ into $n$ subintervals has equal widths $\\Delta x = \\frac{b - a}{n}$. The norm (or mesh) is $\\|P\\| = \\Delta x$.",
        "分割的细度是最宽小段的宽度，所以对于等分的情形，它就是区间长度除以段数。将区间 $[a, b]$ 进行 $n$ 等分所得的等距分割，各子区间宽度均为 $\\Delta x = \\frac{b - a}{n}$。分割的模（网格模）即为 $\\|P\\| = \\Delta x$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-5, 5);
        const L = rng.int(2, 20);
        const b = a + L;
        const n = rng.pick([2, 4, 5, 8, 10]);
        const ans = Q.of(L, n);

        const prompt = t(
          `Find the norm $\\|P\\|$ of a regular partition $P$ dividing the interval $[${a}, ${b}]$ into ${n} equal subintervals.`,
          `求将区间 $[${a}, ${b}]$ 均分为 ${n} 个子区间的等距分割 $P$ 的模 $\\|P\\|$。`,
        );
        const solution = t(
          steps(
            `The length of the interval is $b - a = ${b} - (${a}) = ${L}$.`,
            `For $n = ${n}$ equal subintervals, the width of each subinterval is $\\Delta x = \\frac{b - a}{n} = \\frac{${L}}{${n}} = ${ans.toLatex()}$.`,
            `The norm of the partition is $\\|P\\| = ${ans.toLatex()}$.`,
          ),
          steps(
            `区间总长度为 $b - a = ${b} - (${a}) = ${L}$。`,
            `均分为 $n = ${n}$ 个子区间，每个子区间的宽度为 $\\Delta x = \\frac{b - a}{n} = \\frac{${L}}{${n}} = ${ans.toLatex()}$。`,
            `分割的模为 $\\|P\\| = ${ans.toLatex()}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.of(L), ans.mul(Q.of(2)), Q.of(b - a + 1, n)],
        });
      },
    },
    {
      id: "the-norm-of-an-irregular-partition",
      title: t("The norm of an irregular partition", "非等分划分的范数"),
      explanation: t(
        "A partition $P = \\{x_0, x_1, \\dots, x_n\\}$ of $[a, b]$ need not have equal pieces. Its norm $\\|P\\|$ is the length of the longest subinterval, $\\max_i (x_i - x_{i-1})$. Refining a partition can only keep or shrink the norm, and $\\|P\\| \\to 0$ is what makes Riemann sums converge to the integral.",
        "区间 $[a, b]$ 的划分 $P = \\{x_0, x_1, \\dots, x_n\\}$ 不必等分。它的范数 $\\|P\\|$ 是最长子区间的长度 $\\max_i (x_i - x_{i-1})$。加细划分只会使范数保持或变小，而 $\\|P\\| \\to 0$ 正是黎曼和收敛到积分的条件。",
      ),
      generate(rng: Rng): Problem {
        const start = rng.int(-4, 3);
        const gaps = Array.from({ length: rng.int(3, 5) }, () => rng.pick([1, 2, 3, 4, 5].map((g) => g / 2)));
        const pts = [start];
        for (const g of gaps) pts.push(pts[pts.length - 1]! + g);
        const max = Math.max(...gaps);
        const min = Math.min(...gaps);
        const fmt = (x: number) => Q.of(Math.round(x * 2), 2).toLatex();
        const total = pts[pts.length - 1]! - start;
        return numberProblem({
          prompt: t(
            `Find the norm $\\|P\\|$ of the partition $P = \\{${pts.map(fmt).join(", ")}\\}$ of $[${fmt(start)}, ${fmt(pts[pts.length - 1]!)}]$.`,
            `求区间 $[${fmt(start)}, ${fmt(pts[pts.length - 1]!)}]$ 的划分 $P = \\{${pts.map(fmt).join(", ")}\\}$ 的范数 $\\|P\\|$。`,
          ),
          answer: Q.of(Math.round(max * 2), 2),
          wrong: [Q.of(Math.round(min * 2), 2), Q.of(Math.round(total * 2), 2 * gaps.length), gaps.length],
          solution: t(
            `The subinterval lengths are $${gaps.map((g) => fmt(g)).join(", ")}$. The longest is $${fmt(max)}$, so $\\|P\\| = ${fmt(max)}$.`,
            `各子区间长度为 $${gaps.map((g) => fmt(g)).join(", ")}$。最长的是 $${fmt(max)}$，所以 $\\|P\\| = ${fmt(max)}$。`,
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
  prerequisites: ["partitions-of-intervals"],
  encompasses: [{ topic: "partitions-of-intervals", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "area-of-subrectangles-in-grid-partitions",
      title: t("Area of subrectangles in grid partitions", "网格分割中子矩形的面积"),
      explanation: t(
        "Each small rectangle has the width of one horizontal piece and the height of one vertical piece, so its area is their product. For $R = [a, b] \\times [c, d]$ partitioned by $m$ divisions in $x$ and $n$ divisions in $y$, each subrectangle has area:\n\n$$\\Delta A = \\Delta x \\Delta y = \\left(\\frac{b - a}{m}\\right)\\left(\\frac{d - c}{n}\\right).$$",
        "每个小矩形的宽是一个水平小段的宽度，高是一个竖直小段的长度，所以面积是两者的乘积。对于被 $x$ 方向 $m$ 等分、$y$ 方向 $n$ 等分的矩形 $R = [a, b] \\times [c, d]$，每个子矩形的面积为：\n\n$$\\Delta A = \\Delta x \\Delta y = \\left(\\frac{b - a}{m}\\right)\\left(\\frac{d - c}{n}\\right)。$$",
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

        const prompt = t(
          `A rectangle $R = [${a}, ${b}] \\times [${c}, ${d}]$ is divided into regular subrectangles by partitioning $[${a}, ${b}]$ into ${m} subintervals and $[${c}, ${d}]$ into ${n} subintervals. Find the area $\\Delta A$ of each subrectangle.`,
          `矩形 $R = [${a}, ${b}] \\times [${c}, ${d}]$ 通过将 $[${a}, ${b}]$ 均分为 ${m} 个子区间并将 $[${c}, ${d}]$ 均分为 ${n} 个子区间划分为等距子矩形。求每个子矩形的面积 $\\Delta A$。`,
        );
        const solution = t(
          steps(
            `Compute the grid step sizes: $\\Delta x = \\frac{${b} - ${a}}{${m}} = \\frac{${Lx}}{${m}}$ and $\\Delta y = \\frac{${d} - ${c}}{${n}} = \\frac{${Ly}}{${n}}$.`,
            `Multiply the dimensions: $\\Delta A = \\Delta x \\cdot \\Delta y = \\left(\\frac{${Lx}}{${m}}\\right)\\left(\\frac{${Ly}}{${n}}\\right) = ${ans.toLatex()}$.`,
          ),
          steps(
            `计算步长：$\\Delta x = \\frac{${b} - ${a}}{${m}} = \\frac{${Lx}}{${m}}$ 且 $\\Delta y = \\frac{${d} - ${c}}{${n}} = \\frac{${Ly}}{${n}}$。`,
            `相乘求得子矩形面积：$\\Delta A = \\Delta x \\cdot \\Delta y = \\left(\\frac{${Lx}}{${m}}\\right)\\left(\\frac{${Ly}}{${n}}\\right) = ${ans.toLatex()}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.of(Lx * Ly), ans.mul(Q.of(2)), Q.of(Lx + Ly, m + n)],
        });
      },
    },
    {
      id: "a-double-riemann-sum-with-upper-right-corners",
      title: t("A double Riemann sum with upper-right corners", "取右上角的二重黎曼和"),
      explanation: t(
        "A double Riemann sum adds $f(x_i^*, y_j^*)\\,\\Delta A$ over every subrectangle. On $[0, m] \\times [0, n]$ with unit squares, the upper-right corner of square $(i, j)$ is $(i, j)$ and $\\Delta A = 1$, so for $f(x, y) = x + y$\n\n$$\\sum_{i=1}^{m}\\sum_{j=1}^{n} (i + j) = n\\sum_{i=1}^{m} i + m\\sum_{j=1}^{n} j.$$\n\nEach single sum is counted once for every value of the other index.",
        "二重黎曼和对每个子矩形累加 $f(x_i^*, y_j^*)\\,\\Delta A$。在 $[0, m] \\times [0, n]$ 上用单位正方形划分时，第 $(i, j)$ 个正方形的右上角为 $(i, j)$，且 $\\Delta A = 1$，所以对 $f(x, y) = x + y$ 有\n\n$$\\sum_{i=1}^{m}\\sum_{j=1}^{n} (i + j) = n\\sum_{i=1}^{m} i + m\\sum_{j=1}^{n} j。$$\n\n每个单重求和都对另一个指标的每个取值计算一次。",
      ),
      generate(rng: Rng): Problem {
        const m = rng.int(2, 6);
        const n = rng.int(2, 6);
        const c = rng.int(1, 3);
        const si = (m * (m + 1)) / 2;
        const sj = (n * (n + 1)) / 2;
        const ans = c * (n * si + m * sj);
        const f = c === 1 ? "x + y" : `${c}(x + y)`;
        return numberProblem({
          prompt: t(
            `$R = [0, ${m}] \\times [0, ${n}]$ is divided into unit squares. Find the Riemann sum of $f(x, y) = ${f}$ using the upper-right corner of each square as the sample point.`,
            `把 $R = [0, ${m}] \\times [0, ${n}]$ 分成单位正方形。以每个正方形的右上角为样本点，求 $f(x, y) = ${f}$ 的黎曼和。`,
          ),
          answer: ans,
          wrong: [ans - 2 * c * m * n, c * (si + sj), ans - c * m * n, c * m * n * (m + n)],
          solution: t(
            `$\\Delta A = 1$, so the sum is $${c === 1 ? "" : c}\\sum_{i=1}^{${m}}\\sum_{j=1}^{${n}} (i + j) = ${c === 1 ? "" : `${c}`}(${n} \\cdot ${si} + ${m} \\cdot ${sj}) = ${ans}$.`,
            `$\\Delta A = 1$，所以和为 $${c === 1 ? "" : c}\\sum_{i=1}^{${m}}\\sum_{j=1}^{${n}} (i + j) = ${c === 1 ? "" : `${c}`}(${n} \\cdot ${si} + ${m} \\cdot ${sj}) = ${ans}$。`,
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
  prerequisites: ["calculating-double-summations-over-partitions"],
  encompasses: [{ topic: "calculating-double-summations-over-partitions", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-lower-riemann-sums-for-monotone-surfaces",
      title: t("Computing lower Riemann sums for monotone surfaces", "计算单调曲面的下黎曼和"),
      explanation: t(
        "For an increasing function $f(x, y) = ax + by + c$ ($a, b > 0$) on $[0, 2] \\times [0, 2]$ with $2 \\times 2$ grid (sub-squares of width 1), the minimum on each square $[x_{i-1}, x_i] \\times [y_{j-1}, y_j]$ is at the bottom-left corner $(x_{i-1}, y_{j-1})$:\n\n$$L(f, P) = \\sum_{i=1}^2 \\sum_{j=1}^2 f(x_{i-1}, y_{j-1}) \\Delta A.$$",
        "对于在 $[0, 2] \\times [0, 2]$ 上划分为 $2 \\times 2$ 网格（边长为 1 的小正方形）的递增函数 $f(x, y) = ax + by + c$（$a, b > 0$），每个小正方形 $[x_{i-1}, x_i] \\times [y_{j-1}, y_j]$ 上的最小值取在左下角 $(x_{i-1}, y_{j-1})$：\n\n$$L(f, P) = \\sum_{i=1}^2 \\sum_{j=1}^2 f(x_{i-1}, y_{j-1}) \\Delta A。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const c = rng.int(1, 8);

        // 4 sub-squares: [0, 1]x[0, 1], [1, 2]x[0, 1], [0, 1]x[1, 2], [1, 2]x[1, 2]
        // Bottom-left corners: (0, 0), (1, 0), (0, 1), (1, 1)
        // Values: c, a + c, b + c, a + b + c
        // Sum = 2a + 2b + 4c. Each has area Delta A = 1*1 = 1.
        const ans = 2 * a + 2 * b + 4 * c;

        const prompt = t(
          `Find the lower Riemann sum $L(f, P)$ for $f(x, y) = ${poly([a, "x"], [b, "y"], [c, ""])}$ over $R = [0, 2] \\times [0, 2]$ using a regular $2 \\times 2$ partition with equal sub-squares of side length $1$.`,
          `对于函数 $f(x, y) = ${poly([a, "x"], [b, "y"], [c, ""])}$，在矩形区域 $R = [0, 2] \\times [0, 2]$ 上采用边长为 $1$ 的 $2 \\times 2$ 等距正方形网格分割，求其下黎曼和 $L(f, P)$。`,
        );
        const solution = t(
          steps(
            `Because $f(x, y)$ is strictly increasing in both $x$ and $y$, the minimum on each sub-square occurs at the lower-left corner.`,
            `The four bottom-left sample points are $(0, 0), (1, 0), (0, 1), (1, 1)$.`,
            `Evaluate the function: $f(0, 0) = ${c}$, $f(1, 0) = ${a + c}$, $f(0, 1) = ${b + c}$, $f(1, 1) = ${a + b + c}$.`,
            `Multiply by $\\Delta A = 1$: $L(f, P) = 1 \\cdot (${c} + ${a + c} + ${b + c} + ${a + b + c}) = ${ans}$.`,
          ),
          steps(
            `由于 $f(x, y)$ 关于 $x$ 和 $y$ 均严格单调递增，故每个子方块上的最小值均取在左下角。`,
            `四个左下角采样点为 $(0, 0), (1, 0), (0, 1), (1, 1)$。`,
            `计算各点函数值：$f(0, 0) = ${c}$，$f(1, 0) = ${a + c}$，$f(0, 1) = ${b + c}$，$f(1, 1) = ${a + b + c}$。`,
            `乘以面积微元 $\\Delta A = 1$：$L(f, P) = 1 \\cdot (${c} + ${a + c} + ${b + c} + ${a + b + c}) = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [ans + 4, ans - 4, ans + 2 * a],
        });
      },
    },
    {
      id: "a-lower-sum-for-a-product-function",
      title: t("A lower sum for $cxy$", "函数 $cxy$ 的下和"),
      explanation: t(
        "For $f(x, y) = cxy$ with $c > 0$ on the first quadrant, $f$ increases in both variables, so its minimum on each subsquare is at the lower-left corner. With an $m \\times m$ regular partition of $[0, mh]^2$, the corners are $(ih, jh)$ for $i, j = 0, \\dots, m - 1$, and\n\n$$L = \\sum_{i=0}^{m-1}\\sum_{j=0}^{m-1} c(ih)(jh)\\,h^2 = ch^4\\left(\\frac{m(m-1)}{2}\\right)^2.$$",
        "对第一象限上的 $f(x, y) = cxy$（$c > 0$），$f$ 关于两个变量都递增，所以在每个小正方形上的最小值在左下角取得。对 $[0, mh]^2$ 作 $m \\times m$ 等分，各角点为 $(ih, jh)$，$i, j = 0, \\dots, m - 1$，于是\n\n$$L = \\sum_{i=0}^{m-1}\\sum_{j=0}^{m-1} c(ih)(jh)\\,h^2 = ch^4\\left(\\frac{m(m-1)}{2}\\right)^2。$$",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(1, 5);
        const m = rng.int(2, 4);
        const h = rng.int(1, 2);
        const lo = (m * (m - 1)) / 2;
        const hi = (m * (m + 1)) / 2;
        const ans = c * h ** 4 * lo * lo;
        return numberProblem({
          prompt: t(
            `Find the lower Riemann sum of $f(x, y) = ${c === 1 ? "" : c}xy$ over $[0, ${m * h}] \\times [0, ${m * h}]$ using a regular $${m} \\times ${m}$ partition.`,
            `用 $${m} \\times ${m}$ 等分划分，求 $f(x, y) = ${c === 1 ? "" : c}xy$ 在 $[0, ${m * h}] \\times [0, ${m * h}]$ 上的下黎曼和。`,
          ),
          answer: ans,
          wrong: [c * h ** 4 * hi * hi, c * h ** 2 * lo * lo, c * h ** 4 * lo * hi],
          solution: t(
            `Each square has side $${h}$ and the minimum is at the lower-left corner, so $L = ${c} \\cdot ${h}^4 \\left(\\sum_{i=0}^{${m - 1}} i\\right)^2 = ${c} \\cdot ${h ** 4} \\cdot ${lo}^2 = ${ans}$.`,
            `每个正方形边长为 $${h}$，最小值在左下角，所以 $L = ${c} \\cdot ${h}^4 \\left(\\sum_{i=0}^{${m - 1}} i\\right)^2 = ${c} \\cdot ${h ** 4} \\cdot ${lo}^2 = ${ans}$。`,
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
  prerequisites: ["approximating-volumes-using-lower-riemann-sums"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-upper-riemann-sums-for-monotone-surfaces",
      title: t("Computing upper Riemann sums for monotone surfaces", "计算单调曲面的上黎曼和"),
      explanation: t(
        "For an increasing function $f(x, y) = ax + by + c$ ($a, b > 0$) on $[0, 2] \\times [0, 2]$ with $2 \\times 2$ grid, the maximum on each square $[x_{i-1}, x_i] \\times [y_{j-1}, y_j]$ is at the top-right corner $(x_i, y_j)$:\n\n$$U(f, P) = \\sum_{i=1}^2 \\sum_{j=1}^2 f(x_i, y_j) \\Delta A.$$",
        "对于在 $[0, 2] \\times [0, 2]$ 上划分为 $2 \\times 2$ 网格的递增函数 $f(x, y) = ax + by + c$（$a, b > 0$），每个子方块上的最大值取在右上角 $(x_i, y_j)$：\n\n$$U(f, P) = \\sum_{i=1}^2 \\sum_{j=1}^2 f(x_i, y_j) \\Delta A。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const c = rng.int(1, 8);

        // 4 sub-squares with corners: (1, 1), (2, 1), (1, 2), (2, 2)
        // Values: a + b + c, 2a + b + c, a + 2b + c, 2a + 2b + c
        // Sum = 6a + 6b + 4c. Delta A = 1.
        const ans = 6 * a + 6 * b + 4 * c;

        const prompt = t(
          `Find the upper Riemann sum $U(f, P)$ for $f(x, y) = ${poly([a, "x"], [b, "y"], [c, ""])}$ over $R = [0, 2] \\times [0, 2]$ using a regular $2 \\times 2$ partition with equal sub-squares of side length $1$.`,
          `对于函数 $f(x, y) = ${poly([a, "x"], [b, "y"], [c, ""])}$，在矩形区域 $R = [0, 2] \\times [0, 2]$ 上采用边长为 $1$ 的 $2 \\times 2$ 等距正方形网格分割，求其上黎曼和 $U(f, P)$。`,
        );
        const solution = t(
          steps(
            `Because $f(x, y)$ is strictly increasing in both $x$ and $y$, the maximum on each sub-square occurs at the upper-right corner.`,
            `The four top-right sample points are $(1, 1), (2, 1), (1, 2), (2, 2)$.`,
            `Evaluate the function: $f(1, 1) = ${a + b + c}$, $f(2, 1) = ${2 * a + b + c}$, $f(1, 2) = ${a + 2 * b + c}$, $f(2, 2) = ${2 * a + 2 * b + c}$.`,
            `Multiply by $\\Delta A = 1$: $U(f, P) = 1 \\cdot (${a + b + c} + ${2 * a + b + c} + ${a + 2 * b + c} + ${2 * a + 2 * b + c}) = ${ans}$.`,
          ),
          steps(
            `由于 $f(x, y)$ 关于 $x$ 和 $y$ 严格单调递增，故每个子方块上的最大值均取在右上角。`,
            `四个右上角采样点为 $(1, 1), (2, 1), (1, 2), (2, 2)$。`,
            `计算各点函数值：$f(1, 1) = ${a + b + c}$，$f(2, 1) = ${2 * a + b + c}$，$f(1, 2) = ${a + 2 * b + c}$，$f(2, 2) = ${2 * a + 2 * b + c}$。`,
            `乘以面积微元 $\\Delta A = 1$：$U(f, P) = 1 \\cdot (${a + b + c} + ${2 * a + b + c} + ${a + 2 * b + c} + ${2 * a + 2 * b + c}) = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [ans + 4, ans - 4, ans - 2 * a],
        });
      },
    },
    {
      id: "an-upper-sum-for-a-sum-of-squares",
      title: t("An upper sum for $c(x^2 + y^2)$", "函数 $c(x^2 + y^2)$ 的上和"),
      explanation: t(
        "For $f(x, y) = c(x^2 + y^2)$ with $c > 0$ on the first quadrant, the maximum on each subsquare is at the upper-right corner. With an $m \\times m$ regular partition of $[0, mh]^2$ the corners are $(ih, jh)$ for $i, j = 1, \\dots, m$, and\n\n$$U = \\sum_{i=1}^{m}\\sum_{j=1}^{m} c(i^2 + j^2)h^2 \\cdot h^2 = ch^4 \\cdot 2m\\sum_{i=1}^{m} i^2.$$\n\nThe factor $2m$ appears because each square $i^2$ is counted once for every $j$, and symmetrically for $j^2$.",
        "对第一象限上的 $f(x, y) = c(x^2 + y^2)$（$c > 0$），每个小正方形上的最大值在右上角。对 $[0, mh]^2$ 作 $m \\times m$ 等分，角点为 $(ih, jh)$，$i, j = 1, \\dots, m$，于是\n\n$$U = \\sum_{i=1}^{m}\\sum_{j=1}^{m} c(i^2 + j^2)h^2 \\cdot h^2 = ch^4 \\cdot 2m\\sum_{i=1}^{m} i^2。$$\n\n出现因子 $2m$ 是因为每个 $i^2$ 对每个 $j$ 都计算一次，$j^2$ 同理。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(1, 4);
        const m = rng.int(2, 5);
        const h = rng.int(1, 2);
        const s2 = (m * (m + 1) * (2 * m + 1)) / 6;
        const s2lo = ((m - 1) * m * (2 * m - 1)) / 6;
        const ans = c * h ** 4 * 2 * m * s2;
        return numberProblem({
          prompt: t(
            `Find the upper Riemann sum of $f(x, y) = ${c === 1 ? "x^2 + y^2" : `${c}(x^2 + y^2)`}$ over $[0, ${m * h}] \\times [0, ${m * h}]$ using a regular $${m} \\times ${m}$ partition.`,
            `用 $${m} \\times ${m}$ 等分划分，求 $f(x, y) = ${c === 1 ? "x^2 + y^2" : `${c}(x^2 + y^2)`}$ 在 $[0, ${m * h}] \\times [0, ${m * h}]$ 上的上黎曼和。`,
          ),
          answer: ans,
          wrong: [c * h ** 4 * 2 * m * s2lo, c * h ** 2 * 2 * m * s2, c * h ** 4 * m * s2, c * h ** 4 * 2 * s2],
          solution: t(
            `The maximum on each square is at the upper-right corner, so $U = ${c} \\cdot ${h}^4 \\cdot 2 \\cdot ${m} \\sum_{i=1}^{${m}} i^2 = ${c} \\cdot ${h ** 4} \\cdot ${2 * m} \\cdot ${s2} = ${ans}$.`,
            `每个正方形上的最大值在右上角，所以 $U = ${c} \\cdot ${h}^4 \\cdot 2 \\cdot ${m} \\sum_{i=1}^{${m}} i^2 = ${c} \\cdot ${h ** 4} \\cdot ${2 * m} \\cdot ${s2} = ${ans}$。`,
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
  prerequisites: ["approximating-volumes-using-lower-riemann-sums"],
  encompasses: [{ topic: "approximating-volumes-using-lower-riemann-sums", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "lower-sum-with-unequal-subinterval-widths",
      title: t("Lower sum with unequal subinterval widths", "非等距子区间下的下黎曼和"),
      explanation: t(
        "A lower sum uses the smallest value of the function on each small rectangle, which for an increasing function is at the corner nearest the origin. For a partition with cut points $x = [0, x_1, x_2]$ and $y = [0, y_1, y_2]$, the lower sum of an increasing function $f(x, y) = ax + by$ is:\n\n$$L(f, P) = \\sum_{i=1}^2 \\sum_{j=1}^2 f(x_{i-1}, y_{j-1}) \\Delta x_i \\Delta y_j.$$",
        "下和在每个小矩形上取函数的最小值，对于增函数，最小值在离原点最近的角上。对于分割节点为 $x = [0, x_1, x_2]$ 与 $y = [0, y_1, y_2]$ 的非等距分割，单调递增函数 $f(x, y) = ax + by$ 的下黎曼和为：\n\n$$L(f, P) = \\sum_{i=1}^2 \\sum_{j=1}^2 f(x_{i-1}, y_{j-1}) \\Delta x_i \\Delta y_j。$$",
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

        // f(x, y) = ax + by
        // Corners:
        // (0, 0): f=0, area = x1 * y1
        // (x1, 0): f = a*x1, area = dx2 * y1
        // (0, y1): f = b*y1, area = x1 * dy2
        // (x1, y1): f = a*x1 + b*y1, area = dx2 * dy2
        const term1 = 0;
        const term2 = a * x1 * dx2 * y1;
        const term3 = b * y1 * x1 * dy2;
        const term4 = (a * x1 + b * y1) * dx2 * dy2;
        const ans = term1 + term2 + term3 + term4;

        const prompt = t(
          `Find the lower Riemann sum $L(f, P)$ for $f(x, y) = ${poly([a, "x"], [b, "y"])}$ on $R = [0, ${x2}] \\times [0, ${y2}]$ with partition points $x \\in \\{0, ${x1}, ${x2}\\}$ and $y \\in \\{0, ${y1}, ${y2}\\}$.`,
          `对于函数 $f(x, y) = ${poly([a, "x"], [b, "y"])}$，在矩形区域 $R = [0, ${x2}] \\times [0, ${y2}]$ 上，采用分割节点 $x \\in \\{0, ${x1}, ${x2}\\}$ 与 $y \\in \\{0, ${y1}, ${y2}\\}$，求其下黎曼和 $L(f, P)$。`,
        );
        const solution = t(
          steps(
            `The subinterval lengths are $\\Delta x_1 = ${x1}$, $\\Delta x_2 = ${dx2}$ and $\\Delta y_1 = ${y1}$, $\\Delta y_2 = ${dy2}$.`,
            `Because $f$ is increasing, each infimum is at the bottom-left corner of each subrectangle:`,
            `1. $(0, 0)$: $f(0, 0) = 0$, contribution is $0$.`,
            `2. $(${x1}, 0)$: $f(${x1}, 0) = ${a * x1}$, contribution is $(${a * x1})(${dx2})(${y1}) = ${term2}$.`,
            `3. $(0, ${y1})$: $f(0, ${y1}) = ${b * y1}$, contribution is $(${b * y1})(${x1})(${dy2}) = ${term3}$.`,
            `4. $(${x1}, ${y1})$: $f(${x1}, ${y1}) = ${a * x1 + b * y1}$, contribution is $(${a * x1 + b * y1})(${dx2})(${dy2}) = ${term4}$.`,
            `Summing all contributions: $L(f, P) = ${term2} + ${term3} + ${term4} = ${ans}$.`,
          ),
          steps(
            `各子区间长度为 $\\Delta x_1 = ${x1}$，$\\Delta x_2 = ${dx2}$ 且 $\\Delta y_1 = ${y1}$，$\\Delta y_2 = ${dy2}$。`,
            `由于 $f$ 单调递增，每个子矩形上的下确界均取在左下角：`,
            `1. $(0, 0)$：$f(0, 0) = 0$，贡献为 $0$。`,
            `2. $(${x1}, 0)$：$f(${x1}, 0) = ${a * x1}$，贡献为 $(${a * x1})(${dx2})(${y1}) = ${term2}$。`,
            `3. $(0, ${y1})$：$f(0, ${y1}) = ${b * y1}$，贡献为 $(${b * y1})(${x1})(${dy2}) = ${term3}$。`,
            `4. $(${x1}, ${y1})$：$f(${x1}, ${y1}) = ${a * x1 + b * y1}$，贡献为 $(${a * x1 + b * y1})(${dx2})(${dy2}) = ${term4}$。`,
            `总和为：$L(f, P) = ${term2} + ${term3} + ${term4} = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [ans + x1 * y1, ans - x1 * y1, ans * 2],
        });
      },
    },
    {
      id: "a-lower-sum-for-xy-over-an-irregular-grid",
      title: t("A lower sum for $cxy$ over an irregular grid", "不规则网格上 $cxy$ 的下和"),
      explanation: t(
        "On a general partition each subrectangle $[x_{i-1}, x_i] \\times [y_{j-1}, y_j]$ has its own area $\\Delta x_i\\,\\Delta y_j$. For $f(x, y) = cxy$ with $c > 0$ on $[0, x_2] \\times [0, y_2]$, the minimum on each piece is at its lower-left corner $(x_{i-1}, y_{j-1})$. Every piece touching an axis has minimum $0$, so only the piece $[x_1, x_2] \\times [y_1, y_2]$ contributes:\n\n$$L = c\\,x_1y_1(x_2 - x_1)(y_2 - y_1).$$",
        "在一般划分中，每个子矩形 $[x_{i-1}, x_i] \\times [y_{j-1}, y_j]$ 的面积为 $\\Delta x_i\\,\\Delta y_j$。对 $[0, x_2] \\times [0, y_2]$ 上的 $f(x, y) = cxy$（$c > 0$），每块上的最小值在左下角 $(x_{i-1}, y_{j-1})$。贴着坐标轴的块最小值为 $0$，所以只有 $[x_1, x_2] \\times [y_1, y_2]$ 有贡献：\n\n$$L = c\\,x_1y_1(x_2 - x_1)(y_2 - y_1)。$$",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(1, 3);
        const x1 = rng.int(1, 3);
        const x2 = x1 + rng.int(1, 3);
        const y1 = rng.int(1, 3);
        const y2 = y1 + rng.int(1, 3);
        const ans = c * x1 * y1 * (x2 - x1) * (y2 - y1);
        const upper = c * (x1 * x1 + x2 * (x2 - x1)) * (y1 * y1 + y2 * (y2 - y1));
        return numberProblem({
          prompt: t(
            `Find the lower Riemann sum of $f(x, y) = ${c === 1 ? "" : c}xy$ on $[0, ${x2}] \\times [0, ${y2}]$ for the partition with $x \\in \\{0, ${x1}, ${x2}\\}$ and $y \\in \\{0, ${y1}, ${y2}\\}$.`,
            `对 $x \\in \\{0, ${x1}, ${x2}\\}$、$y \\in \\{0, ${y1}, ${y2}\\}$ 的划分，求 $f(x, y) = ${c === 1 ? "" : c}xy$ 在 $[0, ${x2}] \\times [0, ${y2}]$ 上的下黎曼和。`,
          ),
          answer: ans,
          wrong: [upper, c * x1 * y1 * x2 * y2, c * x2 * y2 * (x2 - x1) * (y2 - y1), c * x1 * y1],
          solution: t(
            `Only the piece $[${x1}, ${x2}] \\times [${y1}, ${y2}]$ has a nonzero minimum, $f(${x1}, ${y1}) = ${c * x1 * y1}$, and its area is $${x2 - x1} \\cdot ${y2 - y1}$. So $L = ${c * x1 * y1} \\cdot ${(x2 - x1) * (y2 - y1)} = ${ans}$.`,
            `只有 $[${x1}, ${x2}] \\times [${y1}, ${y2}]$ 这一块的最小值非零，为 $f(${x1}, ${y1}) = ${c * x1 * y1}$，面积为 $${x2 - x1} \\cdot ${y2 - y1}$。所以 $L = ${c * x1 * y1} \\cdot ${(x2 - x1) * (y2 - y1)} = ${ans}$。`,
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
  prerequisites: ["approximating-volumes-using-upper-riemann-sums"],
  encompasses: [{ topic: "approximating-volumes-using-upper-riemann-sums", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "upper-sum-with-unequal-subinterval-widths",
      title: t("Upper sum with unequal subinterval widths", "非等距子区间下的上黎曼和"),
      explanation: t(
        "For cut points $x = [0, x_1, x_2]$ and $y = [0, y_1, y_2]$, the upper sum of an increasing function $f(x, y) = ax + by$ evaluates the supremum at top-right corners:\n\n$$U(f, P) = \\sum_{i=1}^2 \\sum_{j=1}^2 f(x_i, y_j) \\Delta x_i \\Delta y_j.$$",
        "对于分割节点 $x = [0, x_1, x_2]$ 与 $y = [0, y_1, y_2]$，单调递增函数 $f(x, y) = ax + by$ 的上黎曼和在右上角计算上确界：\n\n$$U(f, P) = \\sum_{i=1}^2 \\sum_{j=1}^2 f(x_i, y_j) \\Delta x_i \\Delta y_j。$$",
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

        // Top-right corners:
        // (x1, y1): f = a*x1 + b*y1, area = x1 * y1
        // (x2, y1): f = a*x2 + b*y1, area = dx2 * y1
        // (x1, y2): f = a*x1 + b*y2, area = x1 * dy2
        // (x2, y2): f = a*x2 + b*y2, area = dx2 * dy2
        const t1 = (a * x1 + b * y1) * x1 * y1;
        const t2 = (a * x2 + b * y1) * dx2 * y1;
        const t3 = (a * x1 + b * y2) * x1 * dy2;
        const t4 = (a * x2 + b * y2) * dx2 * dy2;
        const ans = t1 + t2 + t3 + t4;

        const prompt = t(
          `Find the upper Riemann sum $U(f, P)$ for $f(x, y) = ${poly([a, "x"], [b, "y"])}$ on $R = [0, ${x2}] \\times [0, ${y2}]$ with partition points $x \\in \\{0, ${x1}, ${x2}\\}$ and $y \\in \\{0, ${y1}, ${y2}\\}$.`,
          `对于函数 $f(x, y) = ${poly([a, "x"], [b, "y"])}$，在矩形区域 $R = [0, ${x2}] \\times [0, ${y2}]$ 上，采用分割节点 $x \\in \\{0, ${x1}, ${x2}\\}$ 与 $y \\in \\{0, ${y1}, ${y2}\\}$，求其上黎曼和 $U(f, P)$。`,
        );
        const solution = t(
          steps(
            `The subinterval lengths are $\\Delta x_1 = ${x1}$, $\\Delta x_2 = ${dx2}$ and $\\Delta y_1 = ${y1}$, $\\Delta y_2 = ${dy2}$.`,
            `Because $f$ is increasing, each supremum is at the top-right corner of each subrectangle:`,
            `1. $(${x1}, ${y1})$: $f(${x1}, ${y1}) = ${a * x1 + b * y1}$, contribution is $(${a * x1 + b * y1})(${x1})(${y1}) = ${t1}$.`,
            `2. $(${x2}, ${y1})$: $f(${x2}, ${y1}) = ${a * x2 + b * y1}$, contribution is $(${a * x2 + b * y1})(${dx2})(${y1}) = ${t2}$.`,
            `3. $(${x1}, ${y2})$: $f(${x1}, ${y2}) = ${a * x1 + b * y2}$, contribution is $(${a * x1 + b * y2})(${x1})(${dy2}) = ${t3}$.`,
            `4. $(${x2}, ${y2})$: $f(${x2}, ${y2}) = ${a * x2 + b * y2}$, contribution is $(${a * x2 + b * y2})(${dx2})(${dy2}) = ${t4}$.`,
            `Summing all contributions: $U(f, P) = ${t1} + ${t2} + ${t3} + ${t4} = ${ans}$.`,
          ),
          steps(
            `各子区间长度为 $\\Delta x_1 = ${x1}$，$\\Delta x_2 = ${dx2}$ 且 $\\Delta y_1 = ${y1}$，$\\Delta y_2 = ${dy2}$。`,
            `由于 $f$ 单调递增，每个子矩形上的上确界均取在右上角：`,
            `1. $(${x1}, ${y1})$：$f(${x1}, ${y1}) = ${a * x1 + b * y1}$，贡献为 $(${a * x1 + b * y1})(${x1})(${y1}) = ${t1}$。`,
            `2. $(${x2}, ${y1})$：$f(${x2}, ${y1}) = ${a * x2 + b * y1}$，贡献为 $(${a * x2 + b * y1})(${dx2})(${y1}) = ${t2}$。`,
            `3. $(${x1}, ${y2})$：$f(${x1}, ${y2}) = ${a * x1 + b * y2}$，贡献为 $(${a * x1 + b * y2})(${x1})(${dy2}) = ${t3}$。`,
            `4. $(${x2}, ${y2})$：$f(${x2}, ${y2}) = ${a * x2 + b * y2}$，贡献为 $(${a * x2 + b * y2})(${dx2})(${dy2}) = ${t4}$。`,
            `总和为：$U(f, P) = ${t1} + ${t2} + ${t3} + ${t4} = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [ans - x1 * y1, ans + x1 * y1, ans + 2],
        });
      },
    },
    {
      id: "an-upper-sum-for-xy-over-an-irregular-grid",
      title: t("An upper sum for $cxy$ over an irregular grid", "不规则网格上 $cxy$ 的上和"),
      explanation: t(
        "For $f(x, y) = cxy$ with $c > 0$ the maximum on each subrectangle is at its upper-right corner $(x_i, y_j)$. Because $f$ is a product, the upper sum factors into one sum for $x$ and one for $y$:\n\n$$U = c\\left(\\sum_i x_i\\,\\Delta x_i\\right)\\left(\\sum_j y_j\\,\\Delta y_j\\right).$$\n\nThis saves computing every subrectangle separately.",
        "对 $f(x, y) = cxy$（$c > 0$），每个子矩形上的最大值在右上角 $(x_i, y_j)$。由于 $f$ 是乘积，上和可分解为 $x$ 的和与 $y$ 的和之积：\n\n$$U = c\\left(\\sum_i x_i\\,\\Delta x_i\\right)\\left(\\sum_j y_j\\,\\Delta y_j\\right)。$$\n\n这样无需逐个计算每个子矩形。",
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
        return numberProblem({
          prompt: t(
            `Find the upper Riemann sum of $f(x, y) = ${c === 1 ? "" : c}xy$ on $[0, ${x2}] \\times [0, ${y2}]$ for the partition with $x \\in \\{0, ${x1}, ${x2}\\}$ and $y \\in \\{0, ${y1}, ${y2}\\}$.`,
            `对 $x \\in \\{0, ${x1}, ${x2}\\}$、$y \\in \\{0, ${y1}, ${y2}\\}$ 的划分，求 $f(x, y) = ${c === 1 ? "" : c}xy$ 在 $[0, ${x2}] \\times [0, ${y2}]$ 上的上黎曼和。`,
          ),
          answer: ans,
          wrong: [c * x1 * y1 * (x2 - x1) * (y2 - y1), c * x2 * x2 * y2 * y2, c * (x1 + x2) * (y1 + y2), c * sx * y2],
          solution: t(
            `$\\sum_i x_i\\,\\Delta x_i = ${x1} \\cdot ${x1} + ${x2} \\cdot ${x2 - x1} = ${sx}$ and $\\sum_j y_j\\,\\Delta y_j = ${y1} \\cdot ${y1} + ${y2} \\cdot ${y2 - y1} = ${sy}$, so $U = ${c} \\cdot ${sx} \\cdot ${sy} = ${ans}$.`,
            `$\\sum_i x_i\\,\\Delta x_i = ${x1} \\cdot ${x1} + ${x2} \\cdot ${x2 - x1} = ${sx}$，$\\sum_j y_j\\,\\Delta y_j = ${y1} \\cdot ${y1} + ${y2} \\cdot ${y2 - y1} = ${sy}$，所以 $U = ${c} \\cdot ${sx} \\cdot ${sy} = ${ans}$。`,
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
        "A function $f$ is Riemann integrable over $R$ if and only if for every $\\varepsilon > 0$, there exists a partition $P$ such that $U(f, P) - L(f, P) < \\varepsilon$. For $f(x, y) = ax + by$ on $[0, W] \\times [0, H]$ with regular $n \\times n$ subdivisions:\n\n$$U(f, P_n) - L(f, P_n) = (aW + bH)\\frac{WH}{n}.$$",
        "函数 $f$ 在矩形 $R$ 上黎曼可积，当且仅当对任意 $\\varepsilon > 0$，存在分割 $P$ 使得 $U(f, P) - L(f, P) < \\varepsilon$。对于在 $[0, W] \\times [0, H]$ 上采用 $n \\times n$ 等距分割的函数 $f(x, y) = ax + by$：\n\n$$U(f, P_n) - L(f, P_n) = (aW + bH)\\frac{WH}{n}。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 4);
        const b = rng.int(1, 4);
        const W = rng.int(2, 5);
        const H = rng.int(2, 5);
        const n = rng.int(2, 10);

        const num = (a * W + b * H) * W * H;
        const ans = Q.of(num, n);

        const prompt = t(
          `For $f(x, y) = ${poly([a, "x"], [b, "y"])}$ on $R = [0, ${W}] \\times [0, ${H}]$, find the difference $U(f, P_n) - L(f, P_n)$ between the upper and lower Riemann sums under an $n \\times n$ regular partition with $n = ${n}$.`,
          `对于矩形区域 $R = [0, ${W}] \\times [0, ${H}]$ 上的函数 $f(x, y) = ${poly([a, "x"], [b, "y"])}$，求在 $n = ${n}$ 的 $n \\times n$ 等距分割下，上下黎曼和之差 $U(f, P_n) - L(f, P_n)$。`,
        );
        const solution = t(
          steps(
            `On each sub-square of side length $\\frac{${W}}{${n}}$ and $\\frac{${H}}{${n}}$, the oscillation of $f$ is $M_{ij} - m_{ij} = a\\left(\\frac{${W}}{${n}}\\right) + b\\left(\\frac{${H}}{${n}}\\right) = \\frac{${a * W + b * H}}{${n}}$.`,
            `Summing over all $n^2$ subrectangles with area $\\Delta A = \\frac{${W}\\cdot${H}}{n^2}$ yields:`,
            `$$U(f, P_n) - L(f, P_n) = n^2 \\left(\\frac{${a * W + b * H}}{${n}}\\right)\\left(\\frac{${W * H}}{n^2}\\right) = \\frac{${num}}{${n}} = ${ans.toLatex()}.$$ `,
          ),
          steps(
            `在边长分别为 $\\frac{${W}}{${n}}$ 与 $\\frac{${H}}{${n}}$ 的每个子方块上，$f$ 的振幅为 $M_{ij} - m_{ij} = a\\left(\\frac{${W}}{${n}}\\right) + b\\left(\\frac{${H}}{${n}}\\right) = \\frac{${a * W + b * H}}{${n}}$。`,
            `对全部 $n^2$ 个面积为 $\\Delta A = \\frac{${W}\\cdot${H}}{n^2}$ 的子矩形累加得到：`,
            `$$U(f, P_n) - L(f, P_n) = n^2 \\left(\\frac{${a * W + b * H}}{${n}}\\right)\\left(\\frac{${W * H}}{n^2}\\right) = \\frac{${num}}{${n}} = ${ans.toLatex()}。$$ `,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.of(num), ans.mul(Q.of(2)), ans.div(Q.of(2))],
        });
      },
    },
    {
      id: "the-gap-between-upper-and-lower-sums-for-xy",
      title: t("The gap between upper and lower sums for $cxy$", "$cxy$ 上和与下和之差"),
      explanation: t(
        "A function is integrable when $U(f, P_n) - L(f, P_n) \\to 0$. For $f(x, y) = cxy$ on $[0, a] \\times [0, b]$ with an $n \\times n$ regular partition, each piece contributes $c(x_iy_j - x_{i-1}y_{j-1})\\Delta A$. Summing $ij - (i-1)(j-1) = i + j - 1$ over all $i, j$ gives $n^3$, so\n\n$$U - L = \\frac{c\\,a^2b^2}{n^4} \\cdot n^3 = \\frac{c\\,a^2b^2}{n},$$\n\nwhich tends to $0$ as $n \\to \\infty$.",
        "当 $U(f, P_n) - L(f, P_n) \\to 0$ 时函数可积。对 $[0, a] \\times [0, b]$ 上的 $f(x, y) = cxy$ 作 $n \\times n$ 等分，每块贡献 $c(x_iy_j - x_{i-1}y_{j-1})\\Delta A$。对所有 $i, j$ 求 $ij - (i-1)(j-1) = i + j - 1$ 的和得 $n^3$，所以\n\n$$U - L = \\frac{c\\,a^2b^2}{n^4} \\cdot n^3 = \\frac{c\\,a^2b^2}{n},$$\n\n当 $n \\to \\infty$ 时趋于 $0$。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(1, 3);
        const a = rng.int(1, 4);
        const b = rng.int(1, 4);
        const n = rng.int(2, 6);
        const ans = Q.of(c * a * a * b * b, n);
        return numberProblem({
          prompt: t(
            `For $f(x, y) = ${c === 1 ? "" : c}xy$ on $[0, ${a}] \\times [0, ${b}]$, find $U(f, P) - L(f, P)$ for the regular $${n} \\times ${n}$ partition $P$.`,
            `对 $[0, ${a}] \\times [0, ${b}]$ 上的 $f(x, y) = ${c === 1 ? "" : c}xy$，求 $${n} \\times ${n}$ 等分划分 $P$ 的 $U(f, P) - L(f, P)$。`,
          ),
          answer: ans,
          wrong: [Q.of(c * a * a * b * b, n * n), Q.of(c * a * b, n), Q.of(c * a * a * b * b, 4), Q.of(2 * c * a * a * b * b, n)],
          solution: t(
            `$U - L = \\dfrac{c\\,a^2b^2}{n} = \\dfrac{${c} \\cdot ${a * a} \\cdot ${b * b}}{${n}} = ${ans.toLatex()}$.`,
            `$U - L = \\dfrac{c\\,a^2b^2}{n} = \\dfrac{${c} \\cdot ${a * a} \\cdot ${b * b}}{${n}} = ${ans.toLatex()}$。`,
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
  prerequisites: ["defining-double-integrals-using-lower-and-upper-riemann-sums"],
  encompasses: [{ topic: "defining-double-integrals-using-lower-and-upper-riemann-sums", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-iterated-integrals-over-rectangles",
      title: t("Evaluating iterated integrals over rectangles", "计算矩形区域上的二次积分"),
      explanation: t(
        "Integrate with respect to one variable while treating the other as a constant, then integrate the result with respect to the remaining variable. For $R = [a, b] \\times [c, d]$, evaluate by integrating with respect to $y$ then $x$:\n\n$$\\iint_R (px + qy)\\,dA = \\int_a^b \\left[\\int_c^d (px + qy)\\,dy\\right]dx = p\\frac{b^2 - a^2}{2}(d - c) + q(b - a)\\frac{d^2 - c^2}{2}.$$",
        "先对一个变量积分，把另一个变量当作常数，再对所得结果关于剩下的变量积分。对于 $R = [a, b] \\times [c, d]$，先对 $y$ 积分再对 $x$ 积分：\n\n$$\\iint_R (px + qy)\\,dA = \\int_a^b \\left[\\int_c^d (px + qy)\\,dy\\right]dx = p\\frac{b^2 - a^2}{2}(d - c) + q(b - a)\\frac{d^2 - c^2}{2}。$$",
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

        const prompt = t(
          `Evaluate the double integral $\\iint_R (${poly([p, "x"], [q, "y"])})\\,dA$ over the rectangular region $R = [${a}, ${b}] \\times [${c}, ${d}]$.`,
          `计算二重积分 $\\iint_R (${poly([p, "x"], [q, "y"])})\\,dA$，其中矩形区域为 $R = [${a}, ${b}] \\times [${c}, ${d}]$。`,
        );
        const solution = t(
          steps(
            `Set up the iterated integral by Fubini's theorem:\n\n$$\\int_{${a}}^{${b}} \\int_{${c}}^{${d}} (${poly([p, "x"], [q, "y"])})\\,dy\\,dx$$`,
            `Integrate with respect to $y$:\n\n$$\\left[${poly([p, "xy"], [q, "\\frac{y^2}{2}"])}\\right]_{${c}}^{${d}} = ${p}(${d - c})x + ${paren(q)} \\cdot \\frac{${d * d - c * c}}{2} = ${poly([p * (d - c), "x"], [Q.of(q * (d * d - c * c), 2), ""])}.$$ `,
            `Integrate with respect to $x$ from $${a}$ to $${b}$:\n\n$$\\int_{${a}}^{${b}} \\left(${poly([p * (d - c), "x"], [Q.of(q * (d * d - c * c), 2), ""])}\\right) dx = ${ans.toLatex()}.$$ `,
          ),
          steps(
            `由富比尼定理建立二次积分：\n\n$$\\int_{${a}}^{${b}} \\int_{${c}}^{${d}} (${poly([p, "x"], [q, "y"])})\\,dy\\,dx$$`,
            `先对 $y$ 积分：\n\n$$\\left[${poly([p, "xy"], [q, "\\frac{y^2}{2}"])}\\right]_{${c}}^{${d}} = ${p}(${d - c})x + ${paren(q)} \\cdot \\frac{${d * d - c * c}}{2} = ${poly([p * (d - c), "x"], [Q.of(q * (d * d - c * c), 2), ""])}。$$ `,
            `再对 $x$ 从 $${a}$ 积到 $${b}$：\n\n$$\\int_{${a}}^{${b}} \\left(${poly([p * (d - c), "x"], [Q.of(q * (d * d - c * c), 2), ""])}\\right) dx = ${ans.toLatex()}。$$ `,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [ans.neg(), ans.add(Q.of(1)), Q.of(num)],
        });
      },
    },
    {
      id: "separable-double-integrals-of-monomials",
      title: t("Separable double integrals of monomials", "单项式的可分离二重积分"),
      explanation: t(
        "When the integrand is a product $g(x)h(y)$ and the region is a rectangle, Fubini's theorem lets the double integral split into a product of single integrals:\n\n$$\\iint_{[0, a] \\times [0, b]} c\\,x^py^q\\,dA = c\\cdot\\frac{a^{p+1}}{p+1}\\cdot\\frac{b^{q+1}}{q+1}.$$\n\nThis only works on rectangles, where the limits of one variable do not depend on the other.",
        "当被积函数是乘积 $g(x)h(y)$ 且区域为矩形时，由富比尼定理，二重积分可拆成单重积分之积：\n\n$$\\iint_{[0, a] \\times [0, b]} c\\,x^py^q\\,dA = c\\cdot\\frac{a^{p+1}}{p+1}\\cdot\\frac{b^{q+1}}{q+1}。$$\n\n这只适用于矩形区域，因为此时一个变量的积分限不依赖另一个变量。",
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
        const integrand = `${c === 1 ? "" : c}${mono("x", p)}${mono("y", q)}`;
        return numberProblem({
          prompt: t(
            `Evaluate $\\iint_R ${integrand}\\,dA$ over $R = [0, ${a}] \\times [0, ${b}]$.`,
            `计算 $\\iint_R ${integrand}\\,dA$，其中 $R = [0, ${a}] \\times [0, ${b}]$。`,
          ),
          answer: ans,
          wrong: [Q.of(c * a ** (p + 1) * b ** (q + 1)), Q.of(c * a ** p * b ** q), ans.mul(Q.of(p + 1, p + 2))],
          solution: t(
            `$${c === 1 ? "" : `${c} \\cdot `}\\int_0^{${a}} ${mono("x", p)}\\,dx \\cdot \\int_0^{${b}} ${mono("y", q)}\\,dy = ${c === 1 ? "" : `${c} \\cdot `}${ix.toLatex()} \\cdot ${iy.toLatex()} = ${ans.toLatex()}$.`,
            `$${c === 1 ? "" : `${c} \\cdot `}\\int_0^{${a}} ${mono("x", p)}\\,dx \\cdot \\int_0^{${b}} ${mono("y", q)}\\,dy = ${c === 1 ? "" : `${c} \\cdot `}${ix.toLatex()} \\cdot ${iy.toLatex()} = ${ans.toLatex()}$。`,
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
  prerequisites: ["double-integrals-over-rectangular-domains"],
  encompasses: [{ topic: "double-integrals-over-rectangular-domains", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "integrating-over-triangular-domains",
      title: t("Integrating over triangular domains", "在三角形区域上求二重积分"),
      explanation: t(
        "Over a triangle the inner limits depend on the outer variable, because the height of the region changes as you move across it. For a triangular region $T$ bounded by $x = 0$, $y = 0$, and $x + y = c$ ($c > 0$):\n\n$$\\iint_T ax\\,dA = \\int_0^c \\int_0^{c - x} ax\\,dy\\,dx = \\int_0^c ax(c - x)\\,dx = a\\frac{c^3}{6}.$$",
        "在三角形区域上，内层积分限依赖于外层变量，因为区域的高度随位置而变化。对于由 $x = 0$、$y = 0$ 与 $x + y = c$（$c > 0$）所围成的三角形区域 $T$：\n\n$$\\iint_T ax\\,dA = \\int_0^c \\int_0^{c - x} ax\\,dy\\,dx = \\int_0^c ax(c - x)\\,dx = a\\frac{c^3}{6}。$$",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(2, 10);
        const k = rng.int(1, 6);
        const a = 6 * k;
        const ans = k * c * c * c;

        const prompt = t(
          `Evaluate the double integral $\\iint_T ${a}x\\,dA$ over the triangular region $T$ bounded by the lines $x = 0$, $y = 0$, and $x + y = ${c}$.`,
          `计算二重积分 $\\iint_T ${a}x\\,dA$，其中 $T$ 为由直线 $x = 0$、$y = 0$ 与 $x + y = ${c}$ 所围成的三角形区域。`,
        );
        const solution = t(
          steps(
            `Describe $T$ as $0 \\le x \\le ${c}$ and $0 \\le y \\le ${c} - x$.`,
            `Set up the iterated integral:\n\n$$\\int_0^{${c}} \\int_0^{${c} - x} ${a}x\\,dy\\,dx = \\int_0^{${c}} ${a}x(${c} - x)\\,dx = ${a} \\int_0^{${c}} (${c}x - x^2)\\,dx.$$`,
            `Evaluate the antiderivative:\n\n$$\\left[\\frac{${c}x^2}{2} - \\frac{x^3}{3}\\right]_0^{${c}} = \\frac{${c}^3}{2} - \\frac{${c}^3}{3} = \\frac{${c}^3}{6} = \\frac{${c * c * c}}{6}.$$, `,
            `Multiply by $${a} = 6(${k})$:\n\n$$${a} \\cdot \\frac{${c * c * c}}{6} = ${k}(${c * c * c}) = ${ans}.$$ `,
          ),
          steps(
            `将区域 $T$ 表示为 $0 \\le x \\le ${c}$ 与 $0 \\le y \\le ${c} - x$。`,
            `建立二次积分：\n\n$$\\int_0^{${c}} \\int_0^{${c} - x} ${a}x\\,dy\\,dx = \\int_0^{${c}} ${a}x(${c} - x)\\,dx = ${a} \\int_0^{${c}} (${c}x - x^2)\\,dx。$$`,
            `求原函数值：\n\n$$\\left[\\frac{${c}x^2}{2} - \\frac{x^3}{3}\\right]_0^{${c}} = \\frac{${c}^3}{2} - \\frac{${c}^3}{3} = \\frac{${c}^3}{6} = \\frac{${c * c * c}}{6}。$$, `,
            `乘以常数系数 $${a} = 6(${k})$：\n\n$$${a} \\cdot \\frac{${c * c * c}}{6} = ${k}(${c * c * c}) = ${ans}。$$ `,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [ans * 2, ans - c, ans + c],
        });
      },
    },
    {
      id: "integrating-over-the-region-between-a-line-and-a-parabola",
      title: t("Integrating between a line and a parabola", "在直线与抛物线之间积分"),
      explanation: t(
        "To integrate over the region between $y = x^2$ and $y = kx$, first find where the curves meet: $x^2 = kx$ gives $x = 0$ and $x = k$. For $0 \\le x \\le k$ the line lies above the parabola, so\n\n$$\\iint_D c\\,dA = \\int_0^k \\int_{x^2}^{kx} c\\,dy\\,dx = c\\int_0^k (kx - x^2)\\,dx = \\frac{ck^3}{6}.$$",
        "要在 $y = x^2$ 与 $y = kx$ 之间的区域上积分，先求交点：$x^2 = kx$ 得 $x = 0$ 和 $x = k$。在 $0 \\le x \\le k$ 上直线在抛物线上方，所以\n\n$$\\iint_D c\\,dA = \\int_0^k \\int_{x^2}^{kx} c\\,dy\\,dx = c\\int_0^k (kx - x^2)\\,dx = \\frac{ck^3}{6}。$$",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(1, 6);
        const c = rng.int(1, 6);
        const ans = Q.of(c * k ** 3, 6);
        return numberProblem({
          prompt: t(
            `Evaluate $\\iint_D ${c}\\,dA$, where $D$ is the region between $y = x^2$ and $y = ${k === 1 ? "" : k}x$.`,
            `计算 $\\iint_D ${c}\\,dA$，其中 $D$ 是 $y = x^2$ 与 $y = ${k === 1 ? "" : k}x$ 之间的区域。`,
          ),
          answer: ans,
          wrong: [Q.of(c * k ** 3, 2), Q.of(c * k ** 3, 3), ans.neg(), Q.of(c * k ** 2, 6)],
          solution: t(
            `The curves meet at $x = 0$ and $x = ${k}$. So $\\int_0^{${k}} ${c}(${k === 1 ? "" : k}x - x^2)\\,dx = ${c}\\left(\\frac{${k ** 3}}{2} - \\frac{${k ** 3}}{3}\\right) = ${ans.toLatex()}$.`,
            `两曲线交于 $x = 0$ 和 $x = ${k}$。所以 $\\int_0^{${k}} ${c}(${k === 1 ? "" : k}x - x^2)\\,dx = ${c}\\left(\\frac{${k ** 3}}{2} - \\frac{${k ** 3}}{3}\\right) = ${ans.toLatex()}$。`,
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
  prerequisites: ["double-integrals-over-non-rectangular-domains"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "linearity-and-decomposition-of-double-integrals",
      title: t("Linearity and decomposition of double integrals", "二重积分的线性性与区域分解性"),
      explanation: t(
        "Double integrals are linear just like single integrals, so known integrals of separate functions combine with the same coefficients. By linearity of the double integral:\n\n$$\\iint_R (\\alpha f(x, y) + \\beta g(x, y))\\,dA = \\alpha \\iint_R f(x, y)\\,dA + \\beta \\iint_R g(x, y)\\,dA.$$",
        "二重积分和单积分一样是线性的，所以各个函数的已知积分可以按相同的系数组合。由二重积分的线性性质：\n\n$$\\iint_R (\\alpha f(x, y) + \\beta g(x, y))\\,dA = \\alpha \\iint_R f(x, y)\\,dA + \\beta \\iint_R g(x, y)\\,dA。$$",
      ),
      generate(rng: Rng): Problem {
        const I1 = rng.nonZero(-8, 8);
        const I2 = rng.nonZero(-8, 8);
        const alpha = rng.nonZero(-4, 4);
        const beta = rng.nonZero(-4, 4);
        const ans = alpha * I1 + beta * I2;

        const prompt = t(
          `Suppose $\\iint_R f(x, y)\\,dA = ${I1}$ and $\\iint_R g(x, y)\\,dA = ${I2}$. Find the value of $\\iint_R (${poly([alpha, "f(x, y)"], [beta, "g(x, y)"])})\\,dA$.`,
          `设 $\\iint_R f(x, y)\\,dA = ${I1}$ 且 $\\iint_R g(x, y)\\,dA = ${I2}$。计算 $\\iint_R (${poly([alpha, "f(x, y)"], [beta, "g(x, y)"])})\\,dA$ 的值。`,
        );
        const solution = t(
          steps(
            `Apply linearity: $\\iint_R (${poly([alpha, "f"], [beta, "g"])})\\,dA = ${poly([alpha, "\\iint_R f\\,dA"], [beta, "\\iint_R g\\,dA"])}$.`,
            `Substitute the given integral values:\n\n$$${alpha}(${I1}) + ${paren(beta)}(${I2}) = ${alpha * I1} + (${beta * I2}) = ${ans}.$$ `,
          ),
          steps(
            `应用线性性质：$\\iint_R (${poly([alpha, "f"], [beta, "g"])})\\,dA = ${poly([alpha, "\\iint_R f\\,dA"], [beta, "\\iint_R g\\,dA"])}$。`,
            `代入已知积分值：\n\n$$${alpha}(${I1}) + ${paren(beta)}(${I2}) = ${alpha * I1} + (${beta * I2}) = ${ans}。$$ `,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [alpha * I1 - beta * I2, -ans, ans + alpha + beta],
        });
      },
    },
    {
      id: "adding-a-constant-to-the-integrand",
      title: t("Adding a constant to the integrand", "被积函数加上常数"),
      explanation: t(
        "Linearity says $\\iint_R (\\alpha f + k)\\,dA = \\alpha\\iint_R f\\,dA + k\\iint_R 1\\,dA$. The integral of the constant $1$ is the area of $R$, so a constant $k$ adds $k \\cdot \\operatorname{Area}(R)$, not just $k$. On a rectangle $[a, b] \\times [c, d]$ the area is $(b - a)(d - c)$.",
        "由线性性，$\\iint_R (\\alpha f + k)\\,dA = \\alpha\\iint_R f\\,dA + k\\iint_R 1\\,dA$。常数 $1$ 的积分是 $R$ 的面积，所以常数 $k$ 贡献的是 $k \\cdot \\operatorname{Area}(R)$，而不只是 $k$。矩形 $[a, b] \\times [c, d]$ 的面积为 $(b - a)(d - c)$。",
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
        return numberProblem({
          prompt: t(
            `$R = [${a}, ${b}] \\times [${c}, ${d}]$ and $\\iint_R f\\,dA = ${I}$. Find $\\iint_R (${poly([alpha, "f"], [k, ""])})\\,dA$.`,
            `$R = [${a}, ${b}] \\times [${c}, ${d}]$，且 $\\iint_R f\\,dA = ${I}$。求 $\\iint_R (${poly([alpha, "f"], [k, ""])})\\,dA$。`,
          ),
          answer: ans,
          wrong: [alpha * I + k, alpha * (I + k * area), alpha * I, I + k * area],
          solution: t(
            `$\\operatorname{Area}(R) = ${b - a} \\cdot ${d - c} = ${area}$, so the integral is $${alpha} \\cdot ${paren(I)} + ${paren(k)} \\cdot ${area} = ${ans}$.`,
            `$\\operatorname{Area}(R) = ${b - a} \\cdot ${d - c} = ${area}$，所以积分为 $${alpha} \\cdot ${paren(I)} + ${paren(k)} \\cdot ${area} = ${ans}$。`,
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
  prerequisites: ["properties-of-double-integrals"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "identifying-type-i-and-type-ii-regions",
      title: t("Identifying Type I and Type II regions", "识别 X-型与 Y-型区域"),
      explanation: t(
        "A region is described with vertical strips when its top and bottom are graphs of functions of the horizontal variable, and with horizontal strips in the opposite case. A region $D$ is **Type I** if $D = \\{(x, y) : a \\le x \\le b, g_1(x) \\le y \\le g_2(x)\\}$. It is **Type II** if $D = \\{(x, y) : c \\le y \\le d, h_1(y) \\le x \\le h_2(y)\\}$.",
        "当区域的上下边界是水平变量的函数图像时，用竖直条带描述它；反之则用水平条带。若区域可表示为 $D = \\{(x, y) : a \\le x \\le b, g_1(x) \\le y \\le g_2(x)\\}$，则称为 **X-型区域（Type I）**。若可表示为 $D = \\{(x, y) : c \\le y \\le d, h_1(y) \\le x \\le h_2(y)\\}$，则称为 **Y-型区域（Type II）**。",
      ),
      generate(rng: Rng): Problem {
        const isType1 = rng.bool();
        const a = rng.int(1, 4);
        const b = rng.int(1, 4);

        let desc: Text;
        let right: Text;
        let wrong: readonly Text[];
        let solText: Text;

        if (isType1) {
          desc = t(
            `\\{(x, y) : 0 \\le x \\le ${a}, ${poly([b, "x^2"])} \\le y \\le ${poly([b * a, "x"])}\\}`,
            `\\{(x, y) : 0 \\le x \\le ${a}, ${poly([b, "x^2"])} \\le y \\le ${poly([b * a, "x"])}\\}`,
          );
          right = t("Type I (X-simple)", "X-型区域（Type I）");
          wrong = [t("Type II (Y-simple)", "Y-型区域（Type II）"), t("Neither Type I nor Type II", "既非 X-型亦非 Y-型")];
          solText = t(
            `The variable $x$ lies between constant bounds $0 \\le x \\le ${a}$, and $y$ is bounded between two functions of $x$: $g_1(x) = ${poly([b, "x^2"])}$ and $g_2(x) = ${poly([b * a, "x"])}$.`,
            `变量 $x$ 具有常数界 $0 \\le x \\le ${a}$，而 $y$ 夹在 $x$ 的两个函数 $g_1(x) = ${poly([b, "x^2"])}$ 与 $g_2(x) = ${poly([b * a, "x"])}$ 之间。`,
          );
        } else {
          desc = t(
            `\\{(x, y) : 0 \\le y \\le ${a}, ${poly([b, "y^2"])} \\le x \\le ${poly([b * a, "y"])}\\}`,
            `\\{(x, y) : 0 \\le y \\le ${a}, ${poly([b, "y^2"])} \\le x \\le ${poly([b * a, "y"])}\\}`,
          );
          right = t("Type II (Y-simple)", "Y-型区域（Type II）");
          wrong = [t("Type I (X-simple)", "X-型区域（Type I）"), t("Neither Type I nor Type II", "既非 X-型亦非 Y-型")];
          solText = t(
            `The variable $y$ lies between constant bounds $0 \\le y \\le ${a}$, and $x$ is bounded between two functions of $y$: $h_1(y) = ${poly([b, "y^2"])}$ and $h_2(y) = ${poly([b * a, "y"])}$.`,
            `变量 $y$ 具有常数界 $0 \\le y \\le ${a}$，而 $x$ 夹在 $y$ 的两个函数 $h_1(y) = ${poly([b, "y^2"])}$ 与 $h_2(y) = ${poly([b * a, "y"])}$ 之间。`,
          );
        }

        const prompt = t(
          `Classify the plane region $D = ${desc.en}$ as Type I, Type II, or neither.`,
          `将平面区域 $D = ${desc["zh-CN"]}$ 分类为 X-型（Type I）、Y-型（Type II）或两者皆非。`,
        );
        const solution = t(`The region is ${right.en} because ${solText.en}`, `该区域为${right["zh-CN"]}，因为${solText["zh-CN"]}`);
        return pickChoice(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "rewriting-a-type-i-triangle-as-type-ii",
      title: t("Rewriting a Type I triangle as Type II", "把 Type I 三角形改写为 Type II"),
      explanation: t(
        "The triangle $\\{0 \\le x \\le a,\\ 0 \\le y \\le mx\\}$ is Type I. To describe it as Type II, read off the full range of $y$, which is $0 \\le y \\le ma$, and then solve the slanted side for $x$: $y = mx$ gives $x = \\frac{y}{m}$. A horizontal line at height $y$ enters the triangle at $x = \\frac{y}{m}$ and leaves at $x = a$, so the region is $\\{0 \\le y \\le ma,\\ \\frac{y}{m} \\le x \\le a\\}$.",
        "三角形 $\\{0 \\le x \\le a,\\ 0 \\le y \\le mx\\}$ 是 Type I 型。要写成 Type II 型，先读出 $y$ 的完整范围 $0 \\le y \\le ma$，再把斜边解出 $x$：由 $y = mx$ 得 $x = \\frac{y}{m}$。高度为 $y$ 的水平线在 $x = \\frac{y}{m}$ 进入三角形、在 $x = a$ 离开，所以区域为 $\\{0 \\le y \\le ma,\\ \\frac{y}{m} \\le x \\le a\\}$。",
      ),
      generate(rng: Rng): Problem {
        const m = rng.int(2, 6);
        const a = rng.int(1, 6);
        const set = (y: string, x: string) => t(`$\\{${y},\\ ${x}\\}$`, `$\\{${y},\\ ${x}\\}$`);
        return pickChoice(
          rng,
          t(
            `Describe $D = \\{(x, y) : 0 \\le x \\le ${a},\\ 0 \\le y \\le ${m}x\\}$ as a Type II region.`,
            `把 $D = \\{(x, y) : 0 \\le x \\le ${a},\\ 0 \\le y \\le ${m}x\\}$ 写成 Type II 型区域。`,
          ),
          set(`0 \\le y \\le ${m * a}`, `\\frac{y}{${m}} \\le x \\le ${a}`),
          [
            set(`0 \\le y \\le ${m * a}`, `0 \\le x \\le \\frac{y}{${m}}`),
            set(`0 \\le y \\le ${a}`, `\\frac{y}{${m}} \\le x \\le ${a}`),
            set(`0 \\le y \\le ${m * a}`, `${m}y \\le x \\le ${a}`),
          ],
          t(
            `$y$ runs from $0$ to $${m} \\cdot ${a} = ${m * a}$. At height $y$, $x$ runs from the line $x = \\frac{y}{${m}}$ to $x = ${a}$.`,
            `$y$ 从 $0$ 到 $${m} \\cdot ${a} = ${m * a}$。在高度 $y$ 处，$x$ 从直线 $x = \\frac{y}{${m}}$ 到 $x = ${a}$。`,
          ),
        );
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
  prerequisites: ["type-i-and-ii-regions-in-two-dimensional-space"],
  encompasses: [{ topic: "type-i-and-ii-regions-in-two-dimensional-space", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-double-integrals-over-parabolic-regions",
      title: t("Evaluating double integrals over parabolic regions", "在抛物线区域上计算二重积分"),
      explanation: t(
        "Integrate first in the direction whose limits are functions, then integrate the resulting function of the outer variable over its constant limits. For $D = \\{(x, y) : 0 \\le x \\le a, 0 \\le y \\le bx\\}$:\n\n$$\\iint_D kx\\,dA = \\int_0^a \\left[\\int_0^{bx} kx\\,dy\\right]dx = \\int_0^a bkx^2\\,dx = bk\\frac{a^3}{3}.$$",
        "先沿积分限为函数的方向积分，再把所得关于外层变量的函数在常数限上积分。对于区域 $D = \\{(x, y) : 0 \\le x \\le a, 0 \\le y \\le bx\\}$：\n\n$$\\iint_D kx\\,dA = \\int_0^a \\left[\\int_0^{bx} kx\\,dy\\right]dx = \\int_0^a bkx^2\\,dx = bk\\frac{a^3}{3}。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 6);
        const b = rng.int(1, 4);
        const m = rng.int(1, 4);
        const k = 3 * m;
        const ans = b * m * a * a * a;

        const prompt = t(
          `Evaluate the double integral $\\iint_D ${k}x\\,dA$ over the Type I region $D$ bounded by $y = 0$, $y = ${b}x$, and $x = ${a}$.`,
          `计算二重积分 $\\iint_D ${k}x\\,dA$，其中 $D$ 为由 $y = 0$、$y = ${b}x$ 与 $x = ${a}$ 所围成的 X-型区域。`,
        );
        const solution = t(
          steps(
            `Set up the iterated integral for the Type I region:\n\n$$\\int_0^{${a}} \\int_0^{${b}x} ${k}x\\,dy\\,dx$$`,
            `Integrate with respect to $y$:\n\n$$\\int_0^{${b}x} ${k}x\\,dy = ${k}x[y]_0^{${b}x} = ${k * b}x^2.$$`,
            `Integrate with respect to $x$:\n\n$$\\int_0^{${a}} ${k * b}x^2\\,dx = ${k * b} \\left[\\frac{x^3}{3}\\right]_0^{${a}} = ${b * m}(${a}^3) = ${ans}.$$ `,
          ),
          steps(
            `针对 X-型区域建立二次积分：\n\n$$\\int_0^{${a}} \\int_0^{${b}x} ${k}x\\,dy\\,dx$$`,
            `先对 $y$ 积分：\n\n$$\\int_0^{${b}x} ${k}x\\,dy = ${k}x[y]_0^{${b}x} = ${k * b}x^2。$$`,
            `再对 $x$ 积分：\n\n$$\\int_0^{${a}} ${k * b}x^2\\,dx = ${k * b} \\left[\\frac{x^3}{3}\\right]_0^{${a}} = ${b * m}(${a}^3) = ${ans}。$$ `,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [ans * 2, ans - a * b, ans + a * b],
        });
      },
    },
    {
      id: "integrating-xy-over-a-type-i-triangle",
      title: t("Integrating $cxy$ over a Type I triangle", "在 Type I 三角形上积分 $cxy$"),
      explanation: t(
        "For a Type I region the inner integral runs in $y$ between two functions of $x$, and the outer integral runs in $x$ between constants. Over the triangle $0 \\le x \\le a$, $0 \\le y \\le x$:\n\n$$\\int_0^a \\int_0^x c\\,xy\\,dy\\,dx = \\int_0^a c\\,x \\cdot \\frac{x^2}{2}\\,dx = \\frac{ca^4}{8}.$$\n\nThe inner result is a function of $x$ alone, which the outer integral then finishes.",
        "对 Type I 型区域，内层对 $y$ 积分，上下限是 $x$ 的函数；外层对 $x$ 在常数之间积分。在三角形 $0 \\le x \\le a$，$0 \\le y \\le x$ 上：\n\n$$\\int_0^a \\int_0^x c\\,xy\\,dy\\,dx = \\int_0^a c\\,x \\cdot \\frac{x^2}{2}\\,dx = \\frac{ca^4}{8}。$$\n\n内层结果只依赖 $x$，再由外层积分完成。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 6);
        const c = rng.int(1, 5);
        const ans = Q.of(c * a ** 4, 8);
        return numberProblem({
          prompt: t(
            `Evaluate $\\iint_D ${c === 1 ? "" : c}xy\\,dA$, where $D = \\{(x, y) : 0 \\le x \\le ${a},\\ 0 \\le y \\le x\\}$.`,
            `计算 $\\iint_D ${c === 1 ? "" : c}xy\\,dA$，其中 $D = \\{(x, y) : 0 \\le x \\le ${a},\\ 0 \\le y \\le x\\}$。`,
          ),
          answer: ans,
          wrong: [Q.of(c * a ** 4, 4), Q.of(c * a ** 3, 6), Q.of(c * a ** 4, 2), Q.of(c * a ** 4, 6)],
          solution: t(
            `Inner: $\\int_0^x ${c === 1 ? "" : c}xy\\,dy = \\frac{${c === 1 ? "" : c}x^3}{2}$. Outer: $\\int_0^{${a}} \\frac{${c === 1 ? "" : c}x^3}{2}\\,dx = \\frac{${c} \\cdot ${a ** 4}}{8} = ${ans.toLatex()}$.`,
            `内层：$\\int_0^x ${c === 1 ? "" : c}xy\\,dy = \\frac{${c === 1 ? "" : c}x^3}{2}$。外层：$\\int_0^{${a}} \\frac{${c === 1 ? "" : c}x^3}{2}\\,dx = \\frac{${c} \\cdot ${a ** 4}}{8} = ${ans.toLatex()}$。`,
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
  prerequisites: ["type-i-and-ii-regions-in-two-dimensional-space"],
  encompasses: [{ topic: "type-i-and-ii-regions-in-two-dimensional-space", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-double-integrals-with-horizontal-strips",
      title: t("Evaluating double integrals with horizontal strips", "利用水平微元条计算 Y-型二重积分"),
      explanation: t(
        "When the region is bounded on the left and right by functions of the vertical variable, integrate with respect to the horizontal variable first. For $D = \\{(x, y) : 0 \\le y \\le b, 0 \\le x \\le ay\\}$:\n\n$$\\iint_D ky\\,dA = \\int_0^b \\left[\\int_0^{ay} ky\\,dx\\right]dy = \\int_0^b aky^2\\,dy = ak\\frac{b^3}{3}.$$",
        "当区域的左右边界是竖直变量的函数时，先对水平变量积分。对于区域 $D = \\{(x, y) : 0 \\le y \\le b, 0 \\le x \\le ay\\}$：\n\n$$\\iint_D ky\\,dA = \\int_0^b \\left[\\int_0^{ay} ky\\,dx\\right]dy = \\int_0^b aky^2\\,dy = ak\\frac{b^3}{3}。$$",
      ),
      generate(rng: Rng): Problem {
        const b = rng.int(1, 6);
        const a = rng.int(1, 4);
        const m = rng.int(1, 4);
        const k = 3 * m;
        const ans = a * m * b * b * b;

        const prompt = t(
          `Evaluate the double integral $\\iint_D ${k}y\\,dA$ over the Type II region $D$ bounded by $x = 0$, $x = ${a}y$, and $y = ${b}$.`,
          `计算二重积分 $\\iint_D ${k}y\\,dA$，其中 $D$ 为由 $x = 0$、$x = ${a}y$ 与 $y = ${b}$ 所围成的 Y-型区域。`,
        );
        const solution = t(
          steps(
            `Set up the iterated integral with horizontal slices:\n\n$$\\int_0^{${b}} \\int_0^{${a}y} ${k}y\\,dx\\,dy$$`,
            `Integrate with respect to $x$:\n\n$$\\int_0^{${a}y} ${k}y\\,dx = ${k}y[x]_0^{${a}y} = ${k * a}y^2.$$`,
            `Integrate with respect to $y$:\n\n$$\\int_0^{${b}} ${k * a}y^2\\,dy = ${k * a} \\left[\\frac{y^3}{3}\\right]_0^{${b}} = ${a * m}(${b}^3) = ${ans}.$$ `,
          ),
          steps(
            `利用水平分割建立二次积分：\n\n$$\\int_0^{${b}} \\int_0^{${a}y} ${k}y\\,dx\\,dy$$`,
            `先对 $x$ 积分：\n\n$$\\int_0^{${a}y} ${k}y\\,dx = ${k}y[x]_0^{${a}y} = ${k * a}y^2。$$`,
            `再对 $y$ 积分：\n\n$$\\int_0^{${b}} ${k * a}y^2\\,dy = ${k * a} \\left[\\frac{y^3}{3}\\right]_0^{${b}} = ${a * m}(${b}^3) = ${ans}。$$ `,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [ans * 2, ans - a * b, ans + a * b],
        });
      },
    },
    {
      id: "integrating-x-over-a-type-ii-parabolic-region",
      title: t("Integrating $cx$ over a Type II parabolic region", "在 Type II 抛物线区域上积分 $cx$"),
      explanation: t(
        "For a Type II region the inner integral runs in $x$ between two functions of $y$. Over $0 \\le y \\le b$, $0 \\le x \\le y^2$:\n\n$$\\int_0^b \\int_0^{y^2} c\\,x\\,dx\\,dy = \\int_0^b \\frac{c\\,y^4}{2}\\,dy = \\frac{cb^5}{10}.$$\n\nIntegrating in $x$ first avoids splitting the region, because its left and right boundaries are single curves in $y$.",
        "对 Type II 型区域，内层对 $x$ 积分，上下限是 $y$ 的函数。在 $0 \\le y \\le b$，$0 \\le x \\le y^2$ 上：\n\n$$\\int_0^b \\int_0^{y^2} c\\,x\\,dx\\,dy = \\int_0^b \\frac{c\\,y^4}{2}\\,dy = \\frac{cb^5}{10}。$$\n\n先对 $x$ 积分无需拆分区域，因为左右边界都是关于 $y$ 的单一曲线。",
      ),
      generate(rng: Rng): Problem {
        const b = rng.int(1, 5);
        const c = rng.int(1, 6);
        const ans = Q.of(c * b ** 5, 10);
        return numberProblem({
          prompt: t(
            `Evaluate $\\iint_D ${c === 1 ? "" : c}x\\,dA$, where $D = \\{(x, y) : 0 \\le y \\le ${b},\\ 0 \\le x \\le y^2\\}$.`,
            `计算 $\\iint_D ${c === 1 ? "" : c}x\\,dA$，其中 $D = \\{(x, y) : 0 \\le y \\le ${b},\\ 0 \\le x \\le y^2\\}$。`,
          ),
          answer: ans,
          wrong: [Q.of(c * b ** 5, 5), Q.of(c * b ** 3, 6), Q.of(c * b ** 4, 8), Q.of(c * b ** 5, 2)],
          solution: t(
            `Inner: $\\int_0^{y^2} ${c === 1 ? "" : c}x\\,dx = \\frac{${c === 1 ? "" : c}y^4}{2}$. Outer: $\\int_0^{${b}} \\frac{${c === 1 ? "" : c}y^4}{2}\\,dy = \\frac{${c} \\cdot ${b ** 5}}{10} = ${ans.toLatex()}$.`,
            `内层：$\\int_0^{y^2} ${c === 1 ? "" : c}x\\,dx = \\frac{${c === 1 ? "" : c}y^4}{2}$。外层：$\\int_0^{${b}} \\frac{${c === 1 ? "" : c}y^4}{2}\\,dy = \\frac{${c} \\cdot ${b ** 5}}{10} = ${ans.toLatex()}$。`,
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
  prerequisites: ["double-integrals-over-type-i-regions", "double-integrals-over-type-ii-regions"],
  encompasses: [
    { topic: "double-integrals-over-type-i-regions", weight: 0.3 },
    { topic: "double-integrals-over-type-ii-regions", weight: 0.3 },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-double-integrals-by-domain-decomposition",
      title: t("Evaluating double integrals by domain decomposition", "通过区域分割计算二重积分"),
      explanation: t(
        "Splitting a region into simpler pieces lets you use convenient limits on each, and the integral over the whole is the sum of the pieces. If $R = R_1 \\cup R_2$ with disjoint interiors, then $\\iint_R f\\,dA = \\iint_{R_1} f\\,dA + \\iint_{R_2} f\\,dA$. For two adjacent rectangles $R_1 = [0, c] \\times [0, h_1]$ and $R_2 = [c, d] \\times [0, h_2]$:\n\n$$\\iint_R k\\,dA = k\\left(c h_1 + (d - c)h_2\\right).$$",
        "把区域分成更简单的几部分，每部分都可以用方便的积分限，整体上的积分就是各部分积分的和。若 $R = R_1 \\cup R_2$ 且内部不相交，则 $\\iint_R f\\,dA = \\iint_{R_1} f\\,dA + \\iint_{R_2} f\\,dA$。对于两个相邻矩形 $R_1 = [0, c] \\times [0, h_1]$ 与 $R_2 = [c, d] \\times [0, h_2]$：\n\n$$\\iint_R k\\,dA = k\\left(c h_1 + (d - c)h_2\\right)。$$",
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

        const prompt = t(
          `Find the value of $\\iint_R ${k}\\,dA$ over the L-shaped union of two rectangular regions $R_1 = [0, ${c}] \\times [0, ${h1}]$ and $R_2 = [${c}, ${d}] \\times [0, ${h2}]$.`,
          `计算 $\\iint_R ${k}\\,dA$ 的值，其中积分区域 $R = R_1 \\cup R_2$ 为两个相邻矩形 $R_1 = [0, ${c}] \\times [0, ${h1}]$ 与 $R_2 = [${c}, ${d}] \\times [0, ${h2}]$ 的无缝拼接区域。`,
        );
        const solution = t(
          steps(
            `Compute the area of each subregion:\n\n$$\\text{Area}(R_1) = ${c} \\times ${h1} = ${area1}, \\quad \\text{Area}(R_2) = (${d} - ${c}) \\times ${h2} = ${w2} \\times ${h2} = ${area2}.$$`,
            `Total area is $\\text{Area}(R) = ${area1} + ${area2} = ${area1 + area2}$.`,
            `Multiply by the integrand $k = ${k}$:\n\n$$\\iint_R ${k}\\,dA = ${k}(${area1 + area2}) = ${ans}.$$ `,
          ),
          steps(
            `分别计算每个子矩形的面积：\n\n$$\\text{Area}(R_1) = ${c} \\times ${h1} = ${area1}，\\quad \\text{Area}(R_2) = (${d} - ${c}) \\times ${h2} = ${w2} \\times ${h2} = ${area2}。$$`,
            `总面积为 $\\text{Area}(R) = ${area1} + ${area2} = ${area1 + area2}$。`,
            `乘以被积常数 $k = ${k}$：\n\n$$\\iint_R ${k}\\,dA = ${k}(${area1 + area2}) = ${ans}。$$ `,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [ans + k * c, ans - k * w2, k * area1],
        });
      },
    },
    {
      id: "integrating-x-over-an-l-shaped-region",
      title: t("Integrating $cx$ over an L-shaped region", "在 L 形区域上积分 $cx$"),
      explanation: t(
        "When a region splits into pieces that overlap only along edges, the integral over the region is the sum of the integrals over the pieces: $\\iint_{R_1 \\cup R_2} f\\,dA = \\iint_{R_1} f\\,dA + \\iint_{R_2} f\\,dA$. For a non-constant integrand each piece must be integrated with its own limits. For $f = cx$ on $[p, q] \\times [0, h]$ the integral is $c\\,\\frac{q^2 - p^2}{2}\\,h$.",
        "当区域可分成只在边上重叠的几块时，区域上的积分等于各块积分之和：$\\iint_{R_1 \\cup R_2} f\\,dA = \\iint_{R_1} f\\,dA + \\iint_{R_2} f\\,dA$。对非常数被积函数，每块都要用自己的积分限。对 $[p, q] \\times [0, h]$ 上的 $f = cx$，积分为 $c\\,\\frac{q^2 - p^2}{2}\\,h$。",
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
        return numberProblem({
          prompt: t(
            `Evaluate $\\iint_R ${c === 1 ? "" : c}x\\,dA$ over the L-shaped region $R = R_1 \\cup R_2$ with $R_1 = [0, ${a}] \\times [0, ${h1}]$ and $R_2 = [${a}, ${b}] \\times [0, ${h2}]$.`,
            `计算 L 形区域 $R = R_1 \\cup R_2$ 上的 $\\iint_R ${c === 1 ? "" : c}x\\,dA$，其中 $R_1 = [0, ${a}] \\times [0, ${h1}]$，$R_2 = [${a}, ${b}] \\times [0, ${h2}]$。`,
          ),
          answer: ans,
          wrong: [Q.of(c * b * b * h1, 2), Q.of(c * b * b * h2, 2), Q.of(c * (a * a * h1 + b * b * h2), 2), i1],
          solution: t(
            `$\\iint_{R_1} = ${c} \\cdot \\frac{${a * a}}{2} \\cdot ${h1} = ${i1.toLatex()}$ and $\\iint_{R_2} = ${c} \\cdot \\frac{${b * b} - ${a * a}}{2} \\cdot ${h2} = ${i2.toLatex()}$. The total is $${ans.toLatex()}$.`,
            `$\\iint_{R_1} = ${c} \\cdot \\frac{${a * a}}{2} \\cdot ${h1} = ${i1.toLatex()}$，$\\iint_{R_2} = ${c} \\cdot \\frac{${b * b} - ${a * a}}{2} \\cdot ${h2} = ${i2.toLatex()}$。总和为 $${ans.toLatex()}$。`,
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
  prerequisites: ["double-integrals-over-partitioned-regions"],
  encompasses: [{ topic: "double-integrals-over-partitioned-regions", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "reversing-order-to-enable-integration",
      title: t("Reversing order to enable integration", "交换积分次序以求值"),
      explanation: t(
        "Sketch the region and describe it the other way around; the new order of integration can make an impossible inner integral easy. The integral $\\int_0^a \\int_y^a x^2\\,dx\\,dy$ is evaluated by reversing the order:\n\n$$\\int_0^a \\left[\\int_0^x x^2\\,dy\\right]dx = \\int_0^a x^3\\,dx = \\frac{a^4}{4}.$$",
        "画出区域并换一种方式描述它；新的积分次序可以使原来无法计算的内层积分变得容易。积分 $\\int_0^a \\int_y^a x^2\\,dx\\,dy$ 可通过交换积分次序计算：\n\n$$\\int_0^a \\left[\\int_0^x x^2\\,dy\\right]dx = \\int_0^a x^3\\,dx = \\frac{a^4}{4}。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 35);
        const ans = Q.of(a * a * a * a, 4);

        const prompt = t(
          `Evaluate the iterated integral $\\int_0^{${a}} \\int_y^{${a}} x^2\\,dx\\,dy$ by reversing the order of integration.`,
          `通过交换积分次序计算二次积分 $\\int_0^{${a}} \\int_y^{${a}} x^2\\,dx\\,dy$ 的值。`,
        );
        const solution = t(
          steps(
            `Identify the domain from the limits: $0 \\le y \\le ${a}$ and $y \\le x \\le ${a}$.`,
            `This is the triangle bounded by $y = 0$, $x = ${a}$, and $y = x$.`,
            `Reverse the order: for $0 \\le x \\le ${a}$, $y$ ranges from $0$ to $x$:\n\n$$\\int_0^{${a}} \\int_0^x x^2\\,dy\\,dx$$`,
            `Integrate with respect to $y$:\n\n$$\\int_0^x x^2\\,dy = x^2[y]_0^x = x^3.$$`,
            `Integrate with respect to $x$:\n\n$$\\int_0^{${a}} x^3\\,dx = \\left[\\frac{x^4}{4}\\right]_0^{${a}} = \\frac{${a}^4}{4} = ${ans.toLatex()}.$$ `,
          ),
          steps(
            `根据原积分限确定积分区域：$0 \\le y \\le ${a}$ 且 $y \\le x \\le ${a}$。`,
            `该区域是由 $y = 0$、$x = ${a}$ 与 $y = x$ 围成的三角形。`,
            `交换积分次序：当 $0 \\le x \\le ${a}$ 时，$y$ 从 $0$ 变到 $x$：\n\n$$\\int_0^{${a}} \\int_0^x x^2\\,dy\\,dx$$`,
            `先对 $y$ 积分：\n\n$$\\int_0^x x^2\\,dy = x^2[y]_0^x = x^3。$$`,
            `再对 $x$ 积分：\n\n$$\\int_0^{${a}} x^3\\,dx = \\left[\\frac{x^4}{4}\\right]_0^{${a}} = \\frac{${a}^4}{4} = ${ans.toLatex()}。$$ `,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.of(a * a * a * a, 2), Q.of(a * a * a * a, 3), ans.mul(Q.of(2))],
        });
      },
    },
    {
      id: "reversing-an-integral-with-a-square-root-limit",
      title: t("Reversing an integral with a square-root limit", "交换含平方根积分限的积分次序"),
      explanation: t(
        "The integral $\\int_0^{a^2} \\int_{\\sqrt{y}}^{a} f\\,dx\\,dy$ covers the region $\\sqrt{y} \\le x \\le a$, $0 \\le y \\le a^2$. Squaring $x = \\sqrt{y}$ gives $y = x^2$, so the same region is $0 \\le x \\le a$, $0 \\le y \\le x^2$. Sketching the region before changing the limits is the safest way to get them right. Reversing the order gives\n\n$$\\int_0^a \\int_0^{x^2} f\\,dy\\,dx.$$",
        "积分 $\\int_0^{a^2} \\int_{\\sqrt{y}}^{a} f\\,dx\\,dy$ 覆盖区域 $\\sqrt{y} \\le x \\le a$，$0 \\le y \\le a^2$。把 $x = \\sqrt{y}$ 两边平方得 $y = x^2$，所以同一区域是 $0 \\le x \\le a$，$0 \\le y \\le x^2$。换限之前先画出区域是最稳妥的做法。交换次序得\n\n$$\\int_0^a \\int_0^{x^2} f\\,dy\\,dx。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const c = rng.int(1, 6);
        const ans = Q.of(c * a ** 4, 4);
        return numberProblem({
          prompt: t(
            `Evaluate $\\int_0^{${a * a}} \\int_{\\sqrt{y}}^{${a}} ${c === 1 ? "" : c}x\\,dx\\,dy$ by reversing the order of integration.`,
            `交换积分次序，计算 $\\int_0^{${a * a}} \\int_{\\sqrt{y}}^{${a}} ${c === 1 ? "" : c}x\\,dx\\,dy$。`,
          ),
          answer: ans,
          wrong: [Q.of(c * a ** 3, 3), Q.of(c * a ** 4, 2), Q.of(c * a ** 4, 8), Q.of(c * a ** 3, 4)],
          solution: t(
            `The region is $0 \\le x \\le ${a}$, $0 \\le y \\le x^2$. So $\\int_0^{${a}} \\int_0^{x^2} ${c === 1 ? "" : c}x\\,dy\\,dx = \\int_0^{${a}} ${c === 1 ? "" : c}x^3\\,dx = \\frac{${c} \\cdot ${a ** 4}}{4} = ${ans.toLatex()}$.`,
            `区域为 $0 \\le x \\le ${a}$，$0 \\le y \\le x^2$。所以 $\\int_0^{${a}} \\int_0^{x^2} ${c === 1 ? "" : c}x\\,dy\\,dx = \\int_0^{${a}} ${c === 1 ? "" : c}x^3\\,dx = \\frac{${c} \\cdot ${a ** 4}}{4} = ${ans.toLatex()}$。`,
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
  prerequisites: ["double-integrals-over-rectangular-domains"],
  encompasses: [{ topic: "double-integrals-over-rectangular-domains", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-iterated-triple-integrals",
      title: t("Evaluating iterated triple integrals", "计算三次积分"),
      explanation: t(
        "A triple integral is evaluated from the inside out, one variable at a time, treating the variables not yet integrated as constants. Evaluate $\\int_0^a \\int_0^b \\int_0^c (x + y + z)\\,dz\\,dy\\,dx$ successively from $z$, to $y$, to $x$:\n\n$$\\int_0^a \\int_0^b \\int_0^c (x + y + z)\\,dz\\,dy\\,dx = abc\\frac{a + b + c}{2}.$$",
        "三重积分由内向外逐个变量计算，把还没有积分的变量当作常数。按 $z$、$y$、$x$ 的顺序依次计算三次积分 $\\int_0^a \\int_0^b \\int_0^c (x + y + z)\\,dz\\,dy\\,dx$：\n\n$$\\int_0^a \\int_0^b \\int_0^c (x + y + z)\\,dz\\,dy\\,dx = abc\\frac{a + b + c}{2}。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const c = rng.int(1, 5);

        const num = a * b * c * (a + b + c);
        const ans = Q.of(num, 2);

        const prompt = t(
          `Evaluate the iterated triple integral $\\int_0^{${a}} \\int_0^{${b}} \\int_0^{${c}} (x + y + z)\\,dz\\,dy\\,dx$.`,
          `计算三次积分 $\\int_0^{${a}} \\int_0^{${b}} \\int_0^{${c}} (x + y + z)\\,dz\\,dy\\,dx$ 的值。`,
        );
        const solution = t(
          steps(
            `Integrate with respect to $z$:\n\n$$\\int_0^{${c}} (x + y + z)\\,dz = \\left[(x + y)z + \\frac{z^2}{2}\\right]_0^{${c}} = ${c}(x + y) + \\frac{${c * c}}{2}.$$`,
            `Integrate with respect to $y$ from $0$ to $${b}$:\n\n$$\\int_0^{${b}} \\left(${poly([c, "x"])} + ${poly([c, "y"])} + \\frac{${c * c}}{2}\\right)dy = ${poly([b * c, "x"])} + ${c}\\frac{${b * b}}{2} + \\frac{${b * c * c}}{2} = ${poly([b * c, "x"])} + \\frac{${b * c}(${b + c})}{2}.$$`,
            `Integrate with respect to $x$ from $0$ to $${a}$:\n\n$$\\int_0^{${a}} \\left(${poly([b * c, "x"])} + \\frac{${b * c}(${b + c})}{2}\\right)dx = ${b * c}\\frac{${a * a}}{2} + ${a}\\frac{${b * c}(${b + c})}{2} = \\frac{${num}}{2} = ${ans.toLatex()}.$$ `,
          ),
          steps(
            `先对 $z$ 积分：\n\n$$\\int_0^{${c}} (x + y + z)\\,dz = \\left[(x + y)z + \\frac{z^2}{2}\\right]_0^{${c}} = ${c}(x + y) + \\frac{${c * c}}{2}。$$`,
            `再对 $y$ 从 $0$ 积到 $${b}$：\n\n$$\\int_0^{${b}} \\left(${poly([c, "x"])} + ${poly([c, "y"])} + \\frac{${c * c}}{2}\\right)dy = ${poly([b * c, "x"])} + ${c}\\frac{${b * b}}{2} + \\frac{${b * c * c}}{2} = ${poly([b * c, "x"])} + \\frac{${b * c}(${b + c})}{2}。$$`,
            `最后对 $x$ 从 $0$ 积到 $${a}$：\n\n$$\\int_0^{${a}} \\left(${poly([b * c, "x"])} + \\frac{${b * c}(${b + c})}{2}\\right)dx = ${b * c}\\frac{${a * a}}{2} + ${a}\\frac{${b * c}(${b + c})}{2} = \\frac{${num}}{2} = ${ans.toLatex()}。$$ `,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.of(num), ans.mul(Q.of(2)), ans.div(Q.of(2))],
        });
      },
    },
    {
      id: "a-repeated-integral-with-nested-variable-limits",
      title: t("A repeated integral with nested limits", "积分限嵌套的累次积分"),
      explanation: t(
        "In a repeated triple integral the limits may depend on the outer variables. Work from the inside out: integrate in $z$ first, then $y$, then $x$. For\n\n$$\\int_0^a \\int_0^x \\int_0^y c\\,dz\\,dy\\,dx = c\\int_0^a \\int_0^x y\\,dy\\,dx = c\\int_0^a \\frac{x^2}{2}\\,dx = \\frac{ca^3}{6},$$\n\neach step leaves a function of the remaining variables only.",
        "在累次三重积分中，积分限可以依赖外层变量。由内向外计算：先对 $z$，再对 $y$，最后对 $x$。对\n\n$$\\int_0^a \\int_0^x \\int_0^y c\\,dz\\,dy\\,dx = c\\int_0^a \\int_0^x y\\,dy\\,dx = c\\int_0^a \\frac{x^2}{2}\\,dx = \\frac{ca^3}{6},$$\n\n每一步都只剩下其余变量的函数。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 6);
        const c = rng.int(1, 6);
        const ans = Q.of(c * a ** 3, 6);
        return numberProblem({
          prompt: t(
            `Evaluate $\\int_0^{${a}} \\int_0^x \\int_0^y ${c}\\,dz\\,dy\\,dx$.`,
            `计算 $\\int_0^{${a}} \\int_0^x \\int_0^y ${c}\\,dz\\,dy\\,dx$。`,
          ),
          answer: ans,
          wrong: [Q.of(c * a ** 3), Q.of(c * a ** 3, 2), Q.of(c * a ** 3, 3), Q.of(c * a ** 2, 2)],
          solution: t(
            `Inner: $\\int_0^y ${c}\\,dz = ${c === 1 ? "" : c}y$. Middle: $\\int_0^x ${c === 1 ? "" : c}y\\,dy = \\frac{${c === 1 ? "" : c}x^2}{2}$. Outer: $\\int_0^{${a}} \\frac{${c === 1 ? "" : c}x^2}{2}\\,dx = \\frac{${c} \\cdot ${a ** 3}}{6} = ${ans.toLatex()}$.`,
            `内层：$\\int_0^y ${c}\\,dz = ${c === 1 ? "" : c}y$。中层：$\\int_0^x ${c === 1 ? "" : c}y\\,dy = \\frac{${c === 1 ? "" : c}x^2}{2}$。外层：$\\int_0^{${a}} \\frac{${c === 1 ? "" : c}x^2}{2}\\,dx = \\frac{${c} \\cdot ${a ** 3}}{6} = ${ans.toLatex()}$。`,
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
  prerequisites: ["repeated-integrals-in-three-dimensions"],
  encompasses: [{ topic: "repeated-integrals-in-three-dimensions", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "product-property-of-separable-triple-integrals",
      title: t("Product property of separable triple integrals", "可分离三重积分的乘积性质"),
      explanation: t(
        "For a product of single-variable functions $f(x)g(y)h(z)$ over a box $[0, a] \\times [0, b] \\times [0, c]$, the triple integral factors into single integrals:\n\n$$\\iiint_B xyz\\,dV = \\left(\\int_0^a x\\,dx\\right)\\left(\\int_0^b y\\,dy\\right)\\left(\\int_0^c z\\,dz\\right) = \\frac{(abc)^2}{8}.$$",
        "在长方体 $[0, a] \\times [0, b] \\times [0, c]$ 上，单变量乘积函数 $f(x)g(y)h(z)$ 的三重积分可因式分解为三个单积分的乘积：\n\n$$\\iiint_B xyz\\,dV = \\left(\\int_0^a x\\,dx\\right)\\left(\\int_0^b y\\,dy\\right)\\left(\\int_0^c z\\,dz\\right) = \\frac{(abc)^2}{8}。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 4);
        const b = rng.int(1, 4);
        const c = rng.int(1, 4);

        const prod = a * b * c;
        const ans = Q.of(prod * prod, 8);

        const prompt = t(
          `Evaluate $\\iiint_B xyz\\,dV$ over the rectangular box $B = [0, ${a}] \\times [0, ${b}] \\times [0, ${c}]$.`,
          `计算三重积分 $\\iiint_B xyz\\,dV$ 的值，其中长方体区域为 $B = [0, ${a}] \\times [0, ${b}] \\times [0, ${c}]$。`,
        );
        const solution = t(
          steps(
            `Because the integrand is separable and the domain is a box, factor into three independent integrals:\n\n$$\\iiint_B xyz\\,dV = \\left(\\int_0^{${a}} x\\,dx\\right)\\left(\\int_0^{${b}} y\\,dy\\right)\\left(\\int_0^{${c}} z\\,dz\\right)$$`,
            `Compute each factor: $\\frac{${a}^2}{2} = \\frac{${a * a}}{2}$, $\\frac{${b}^2}{2} = \\frac{${b * b}}{2}$, $\\frac{${c}^2}{2} = \\frac{${c * c}}{2}$.`,
            `Multiply the results: $\\frac{${a * a}}{2} \\times \\frac{${b * b}}{2} \\times \\frac{${c * c}}{2} = \\frac{${prod * prod}}{8} = ${ans.toLatex()}$.`,
          ),
          steps(
            `由于被积函数可分离且积分区域为长方体，可因式分解为三个独立的单积分：\n\n$$\\iiint_B xyz\\,dV = \\left(\\int_0^{${a}} x\\,dx\\right)\\left(\\int_0^{${b}} y\\,dy\\right)\\left(\\int_0^{${c}} z\\,dz\\right)$$`,
            `计算各因子：$\\frac{${a}^2}{2} = \\frac{${a * a}}{2}$，$\\frac{${b}^2}{2} = \\frac{${b * b}}{2}$，$\\frac{${c}^2}{2} = \\frac{${c * c}}{2}$。`,
            `各因子相乘：$\\frac{${a * a}}{2} \\times \\frac{${b * b}}{2} \\times \\frac{${c * c}}{2} = \\frac{${prod * prod}}{8} = ${ans.toLatex()}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.of(prod * prod, 4), Q.of(prod * prod, 2), ans.mul(Q.of(2))],
        });
      },
    },
    {
      id: "a-triple-integral-of-a-single-variable-over-a-box",
      title: t("Integrating $cx^2$ over a box", "在长方体上积分 $cx^2$"),
      explanation: t(
        "If the integrand depends on only one variable, integrating the other two over a box simply multiplies by the lengths of their intervals:\n\n$$\\iiint_{[0, a] \\times [0, b] \\times [0, d]} c\\,x^2\\,dV = c\\cdot\\frac{a^3}{3}\\cdot b \\cdot d.$$\n\nThe factor $bd$ is the area of the cross-section perpendicular to the $x$-axis.",
        "若被积函数只依赖一个变量，在长方体上对另外两个变量积分就相当于乘以它们区间的长度：\n\n$$\\iiint_{[0, a] \\times [0, b] \\times [0, d]} c\\,x^2\\,dV = c\\cdot\\frac{a^3}{3}\\cdot b \\cdot d。$$\n\n因子 $bd$ 是垂直于 $x$ 轴的截面面积。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 4);
        const b = rng.int(1, 4);
        const d = rng.int(1, 4);
        const c = rng.int(1, 3);
        const ans = Q.of(c * a ** 3 * b * d, 3);
        return numberProblem({
          prompt: t(
            `Evaluate $\\iiint_B ${c === 1 ? "" : c}x^2\\,dV$ over the box $B = [0, ${a}] \\times [0, ${b}] \\times [0, ${d}]$.`,
            `计算 $\\iiint_B ${c === 1 ? "" : c}x^2\\,dV$，其中长方体 $B = [0, ${a}] \\times [0, ${b}] \\times [0, ${d}]$。`,
          ),
          answer: ans,
          wrong: [Q.of(c * a ** 3, 3), Q.of(c * a ** 2 * b * d), Q.of(c * a ** 3 * b * d), Q.of(c * a ** 2 * b * d, 2)],
          solution: t(
            `$${c === 1 ? "" : `${c} \\cdot `}\\int_0^{${a}} x^2\\,dx \\cdot ${b} \\cdot ${d} = ${c === 1 ? "" : `${c} \\cdot `}\\frac{${a ** 3}}{3} \\cdot ${b * d} = ${ans.toLatex()}$.`,
            `$${c === 1 ? "" : `${c} \\cdot `}\\int_0^{${a}} x^2\\,dx \\cdot ${b} \\cdot ${d} = ${c === 1 ? "" : `${c} \\cdot `}\\frac{${a ** 3}}{3} \\cdot ${b * d} = ${ans.toLatex()}$。`,
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
  prerequisites: ["triple-integrals-over-rectangular-domains"],
  encompasses: [{ topic: "triple-integrals-over-rectangular-domains", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "classifying-3d-regions-by-bounding-surfaces",
      title: t("Classifying 3D regions by bounding surfaces", "按曲面边界分类三维区域"),
      explanation: t(
        "A 3D region is:\n- **Type I** if bounded between two surfaces $z = u_1(x, y)$ and $z = u_2(x, y)$.\n- **Type II** if bounded between two surfaces $y = v_1(x, z)$ and $y = v_2(x, z)$.\n- **Type III** if bounded between two surfaces $x = w_1(y, z)$ and $x = w_2(y, z)$.",
        "三维区域的分类：\n- **Type I**：夹在两个曲面 $z = u_1(x, y)$ 与 $z = u_2(x, y)$ 之间。\n- **Type II**：夹在两个曲面 $y = v_1(x, z)$ 与 $y = v_2(x, z)$ 之间。\n- **Type III**：夹在两个曲面 $x = w_1(y, z)$ 与 $x = w_2(y, z)$ 之间。",
      ),
      generate(rng: Rng): Problem {
        const choice = rng.int(1, 3);
        const a = rng.int(1, 4);
        const b = rng.int(1, 4);

        let desc: Text;
        let right: Text;
        let wrong: readonly Text[];
        let sol: Text;

        if (choice === 1) {
          desc = t(
            `\\{(x, y, z) : (x, y) \\in D, 0 \\le z \\le ${poly([a, "x^2"])} + ${poly([b, "y^2"])}\\}`,
            `\\{(x, y, z) : (x, y) \\in D, 0 \\le z \\le ${poly([a, "x^2"])} + ${poly([b, "y^2"])}\\}`,
          );
          right = t("Type I (bounded in z)", "Type I 型（z 处于两曲面之间）");
          wrong = [
            t("Type II (bounded in y)", "Type II 型（y 处于两曲面之间）"),
            t("Type III (bounded in x)", "Type III 型（x 处于两曲面之间）"),
          ];
          sol = t(
            `The variable $z$ is bounded between two continuous functions of $(x, y)$, so the solid is Type I.`,
            `变量 $z$ 夹在 $(x, y)$ 的两个连续函数之间，故该几何体为 Type I 型。`,
          );
        } else if (choice === 2) {
          desc = t(
            `\\{(x, y, z) : (x, z) \\in D, 0 \\le y \\le ${poly([a, "x^2"])} + ${poly([b, "z^2"])}\\}`,
            `\\{(x, y, z) : (x, z) \\in D, 0 \\le y \\le ${poly([a, "x^2"])} + ${poly([b, "z^2"])}\\}`,
          );
          right = t("Type II (bounded in y)", "Type II 型（y 处于两曲面之间）");
          wrong = [
            t("Type I (bounded in z)", "Type I 型（z 处于两曲面之间）"),
            t("Type III (bounded in x)", "Type III 型（x 处于两曲面之间）"),
          ];
          sol = t(
            `The variable $y$ is bounded between two continuous functions of $(x, z)$, so the solid is Type II.`,
            `变量 $y$ 夹在 $(x, z)$ 的两个连续函数之间，故该几何体为 Type II 型。`,
          );
        } else {
          desc = t(
            `\\{(x, y, z) : (y, z) \\in D, 0 \\le x \\le ${poly([a, "y^2"])} + ${poly([b, "z^2"])}\\}`,
            `\\{(x, y, z) : (y, z) \\in D, 0 \\le x \\le ${poly([a, "y^2"])} + ${poly([b, "z^2"])}\\}`,
          );
          right = t("Type III (bounded in x)", "Type III 型（x 处于两曲面之间）");
          wrong = [
            t("Type I (bounded in z)", "Type I 型（z 处于两曲面之间）"),
            t("Type II (bounded in y)", "Type II 型（y 处于两曲面之间）"),
          ];
          sol = t(
            `The variable $x$ is bounded between two continuous functions of $(y, z)$, so the solid is Type III.`,
            `变量 $x$ 夹在 $(y, z)$ 的两个连续函数之间，故该几何体为 Type III 型。`,
          );
        }

        const prompt = t(
          `Classify the 3D solid region $E = ${desc.en}$ as Type I, Type II, or Type III.`,
          `将三维立体区域 $E = ${desc["zh-CN"]}$ 分类为 Type I、Type II 或 Type III 型。`,
        );
        const solution = t(`The region is ${right.en} because ${sol.en}`, `该区域为${right["zh-CN"]}，因为${sol["zh-CN"]}`);
        return pickChoice(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "the-projection-of-a-tetrahedron-for-each-region-type",
      title: t("The projection of a tetrahedron for each region type", "按区域类型取四面体的投影"),
      explanation: t(
        "The tetrahedron cut from the first octant by $\\frac{x}{a} + \\frac{y}{b} + \\frac{z}{c} = 1$ is of all three types. Viewing it as Type I means projecting onto the $xy$-plane, Type II onto the $xz$-plane, and Type III onto the $yz$-plane. Each projection is a right triangle whose legs are the two intercepts in that plane, so its area is half their product, for example $\\frac{ab}{2}$ in the $xy$-plane.",
        "平面 $\\frac{x}{a} + \\frac{y}{b} + \\frac{z}{c} = 1$ 在第一卦限截出的四面体同时属于三种类型。视为 Type I 型时投影到 $xy$ 平面，Type II 型投影到 $xz$ 平面，Type III 型投影到 $yz$ 平面。每个投影都是直角三角形，两条直角边是该平面内的两个截距，所以面积为两者乘积的一半，例如在 $xy$ 平面上为 $\\frac{ab}{2}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 6);
        const b = rng.int(1, 6);
        const c = rng.int(1, 6);
        const kind = rng.int(1, 3);
        const [plane, u, v] = kind === 1 ? ["xy", a, b] : kind === 2 ? ["xz", a, c] : ["yz", b, c];
        const roman = ["I", "II", "III"][kind - 1]!;
        const ans = Q.of(u * v, 2);
        return numberProblem({
          prompt: t(
            `$E$ is the tetrahedron bounded by the coordinate planes and $\\frac{x}{${a}} + \\frac{y}{${b}} + \\frac{z}{${c}} = 1$. Viewed as a Type ${roman} region, $E$ lies over a region $D$ in a coordinate plane. Find the area of $D$.`,
            `$E$ 是由坐标平面与 $\\frac{x}{${a}} + \\frac{y}{${b}} + \\frac{z}{${c}} = 1$ 围成的四面体。视为 Type ${roman} 型区域时，$E$ 位于某个坐标平面内区域 $D$ 的上方。求 $D$ 的面积。`,
          ),
          answer: ans,
          wrong: [Q.of(a * b, 2), Q.of(a * c, 2), Q.of(b * c, 2), Q.of(a * b * c, 6), Q.of(u * v)],
          solution: t(
            `Type ${roman} projects onto the $${plane}$-plane, where $D$ is a right triangle with legs $${u}$ and $${v}$. Its area is $\\frac{${u} \\cdot ${v}}{2} = ${ans.toLatex()}$.`,
            `Type ${roman} 型投影到 $${plane}$ 平面，$D$ 是直角边为 $${u}$ 和 $${v}$ 的直角三角形，面积为 $\\frac{${u} \\cdot ${v}}{2} = ${ans.toLatex()}$。`,
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
  prerequisites: ["type-i-ii-and-iii-regions-in-three-dimensional-space"],
  encompasses: [{ topic: "type-i-ii-and-iii-regions-in-three-dimensional-space", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "integrating-under-a-surface-over-a-rectangle",
      title: t("Integrating under a surface over a rectangle", "在矩形投影上计算曲顶柱体的体积积分"),
      explanation: t(
        "Integrating the constant one over a solid gives its volume, and the inner integral in the vertical direction gives the height of the solid above each point. For $E$ bounded by $0 \\le x \\le a$, $0 \\le y \\le b$, and $0 \\le z \\le cxy$:\n\n$$\\iiint_E 1\\,dV = \\int_0^a \\int_0^b \\int_0^{cxy} 1\\,dz\\,dy\\,dx = c\\frac{a^2 b^2}{4}.$$",
        "在立体上积分常数 1 得到它的体积，竖直方向的内层积分给出立体在每一点上方的高度。对于由 $0 \\le x \\le a$、$0 \\le y \\le b$ 与 $0 \\le z \\le cxy$ 所围成的区域 $E$：\n\n$$\\iiint_E 1\\,dV = \\int_0^a \\int_0^b \\int_0^{cxy} 1\\,dz\\,dy\\,dx = c\\frac{a^2 b^2}{4}。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const c = rng.int(1, 4);

        const num = c * a * a * b * b;
        const ans = Q.of(num, 4);

        const prompt = t(
          `Find the volume $\\iiint_E 1\\,dV$ of the solid $E$ lying above the rectangle $D = [0, ${a}] \\times [0, ${b}]$ and below the surface $z = ${c}xy$.`,
          `计算立体 $E$ 的体积 $\\iiint_E 1\\,dV$，其中 $E$ 位于矩形 $D = [0, ${a}] \\times [0, ${b}]$ 上方且在曲面 $z = ${c}xy$ 下方。`,
        );
        const solution = t(
          steps(
            `Set up the triple integral with $z$ ranging from $0$ to $${c}xy$:\n\n$$\\int_0^{${a}} \\int_0^{${b}} \\int_0^{${c}xy} 1\\,dz\\,dy\\,dx = \\int_0^{${a}} \\int_0^{${b}} ${c}xy\\,dy\\,dx.$$`,
            `Separate the integrals: $${c}\\left(\\int_0^{${a}} x\\,dx\\right)\\left(\\int_0^{${b}} y\\,dy\\right) = ${c}\\left(\\frac{${a * a}}{2}\\right)\\left(\\frac{${b * b}}{2}\\right) = \\frac{${num}}{4} = ${ans.toLatex()}$.`,
          ),
          steps(
            `建立三重积分，内层 $z$ 从 $0$ 变到 $${c}xy$：\n\n$$\\int_0^{${a}} \\int_0^{${b}} \\int_0^{${c}xy} 1\\,dz\\,dy\\,dx = \\int_0^{${a}} \\int_0^{${b}} ${c}xy\\,dy\\,dx。$$`,
            `分离单积分计算：$${c}\\left(\\int_0^{${a}} x\\,dx\\right)\\left(\\int_0^{${b}} y\\,dy\\right) = ${c}\\left(\\frac{${a * a}}{2}\\right)\\left(\\frac{${b * b}}{2}\\right) = \\frac{${num}}{4} = ${ans.toLatex()}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.of(num, 2), Q.of(num), ans.mul(Q.of(2))],
        });
      },
    },
    {
      id: "integrating-a-constant-under-a-slanted-plane",
      title: t("Integrating a constant under a slanted plane", "在斜平面下积分常数"),
      explanation: t(
        "For a Type I solid $E = \\{(x, y) \\in D,\\ 0 \\le z \\le u(x, y)\\}$, integrating $k$ in $z$ first gives $k\\,u(x, y)$, which is then integrated over $D$. Under the plane $z = x + y$ above $[0, a] \\times [0, b]$:\n\n$$\\iiint_E k\\,dV = k\\iint_D (x + y)\\,dA = k\\left(\\frac{a^2b}{2} + \\frac{ab^2}{2}\\right).$$",
        "对 Type I 型立体 $E = \\{(x, y) \\in D,\\ 0 \\le z \\le u(x, y)\\}$，先对 $z$ 积分常数 $k$ 得 $k\\,u(x, y)$，再在 $D$ 上积分。在 $[0, a] \\times [0, b]$ 上方、平面 $z = x + y$ 下方：\n\n$$\\iiint_E k\\,dV = k\\iint_D (x + y)\\,dA = k\\left(\\frac{a^2b}{2} + \\frac{ab^2}{2}\\right)。$$",
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
          wrong: [Q.of(k * (a * a * b + a * b * b)), Q.of(k * a * b * (a + b)), Q.of(k * (a + b), 2), Q.of(k * (a * a + b * b), 2)],
          solution: t(
            `$\\iiint_E ${k}\\,dV = ${k}\\iint_D (x + y)\\,dA = ${k}\\left(\\frac{${a * a} \\cdot ${b}}{2} + \\frac{${a} \\cdot ${b * b}}{2}\\right) = ${ans.toLatex()}$.`,
            `$\\iiint_E ${k}\\,dV = ${k}\\iint_D (x + y)\\,dA = ${k}\\left(\\frac{${a * a} \\cdot ${b}}{2} + \\frac{${a} \\cdot ${b * b}}{2}\\right) = ${ans.toLatex()}$。`,
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
  prerequisites: ["type-i-ii-and-iii-regions-in-three-dimensional-space"],
  encompasses: [{ topic: "type-i-ii-and-iii-regions-in-three-dimensional-space", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "integrating-with-respect-to-y-first",
      title: t("Integrating with respect to y first", "先对 y 积分的三重积分计算"),
      explanation: t(
        "When the solid is bounded by surfaces given as functions for that variable, integrate in that direction first to get the thickness of the solid. For $E$ bounded by $0 \\le x \\le a$, $0 \\le z \\le b$, and $0 \\le y \\le cxz$:\n\n$$\\iiint_E 1\\,dV = \\int_0^a \\int_0^b \\int_0^{cxz} 1\\,dy\\,dz\\,dx = c\\frac{a^2 b^2}{4}.$$",
        "当立体由以该变量表示的曲面围成时，先沿那个方向积分，得到立体的厚度。对于由 $0 \\le x \\le a$、$0 \\le z \\le b$ 与 $0 \\le y \\le cxz$ 所围成的区域 $E$：\n\n$$\\iiint_E 1\\,dV = \\int_0^a \\int_0^b \\int_0^{cxz} 1\\,dy\\,dz\\,dx = c\\frac{a^2 b^2}{4}。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const c = rng.int(1, 4);

        const num = c * a * a * b * b;
        const ans = Q.of(num, 4);

        const prompt = t(
          `Find the volume of the solid $E$ bounded by $0 \\le x \\le ${a}$, $0 \\le z \\le ${b}$, and $0 \\le y \\le ${c}xz$.`,
          `求由 $0 \\le x \\le ${a}$、$0 \\le z \\le ${b}$ 与 $0 \\le y \\le ${c}xz$ 所围成几何体 $E$ 的体积。`,
        );
        const solution = t(
          steps(
            `Set up the iterated integral with $y$ as the innermost variable:\n\n$$\\int_0^{${a}} \\int_0^{${b}} \\int_0^{${c}xz} 1\\,dy\\,dz\\,dx = \\int_0^{${a}} \\int_0^{${b}} ${c}xz\\,dz\\,dx.$$`,
            `Factor into single integrals: $${c}\\left(\\int_0^{${a}} x\\,dx\\right)\\left(\\int_0^{${b}} z\\,dz\\right) = ${c}\\left(\\frac{${a * a}}{2}\\right)\\left(\\frac{${b * b}}{2}\\right) = ${ans.toLatex()}$.`,
          ),
          steps(
            `建立以 $y$ 为最内层变量的二次积分：\n\n$$\\int_0^{${a}} \\int_0^{${b}} \\int_0^{${c}xz} 1\\,dy\\,dz\\,dx = \\int_0^{${a}} \\int_0^{${b}} ${c}xz\\,dz\\,dx。$$`,
            `因式分解为单积分求积：$${c}\\left(\\int_0^{${a}} x\\,dx\\right)\\left(\\int_0^{${b}} z\\,dz\\right) = ${c}\\left(\\frac{${a * a}}{2}\\right)\\left(\\frac{${b * b}}{2}\\right) = ${ans.toLatex()}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.of(num, 2), Q.of(num), ans.mul(Q.of(2))],
        });
      },
    },
    {
      id: "integrating-y-over-a-type-ii-solid",
      title: t("Integrating $cy$ over a Type II solid", "在 Type II 型立体上积分 $cy$"),
      explanation: t(
        "For a Type II solid the inner integral runs in $y$, between two surfaces that depend on $x$ and $z$, and the outer double integral runs over the projection $D$ in the $xz$-plane. For $0 \\le y \\le kx$ over $D = [0, a] \\times [0, b]$ in $x$ and $z$:\n\n$$\\iint_D \\int_0^{kx} c\\,y\\,dy\\,dA = \\iint_D \\frac{c\\,k^2x^2}{2}\\,dA = \\frac{c\\,k^2a^3b}{6}.$$",
        "对 Type II 型立体，内层对 $y$ 积分，上下限是依赖 $x$ 和 $z$ 的曲面；外层在 $xz$ 平面的投影 $D$ 上作二重积分。对 $0 \\le y \\le kx$，$D$ 为 $x$、$z$ 的 $[0, a] \\times [0, b]$：\n\n$$\\iint_D \\int_0^{kx} c\\,y\\,dy\\,dA = \\iint_D \\frac{c\\,k^2x^2}{2}\\,dA = \\frac{c\\,k^2a^3b}{6}。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 3);
        const b = rng.int(1, 4);
        const k = rng.int(1, 3);
        const c = rng.int(1, 3);
        const ans = Q.of(c * k * k * a ** 3 * b, 6);
        return numberProblem({
          prompt: t(
            `$E = \\{(x, y, z) : 0 \\le x \\le ${a},\\ 0 \\le z \\le ${b},\\ 0 \\le y \\le ${k === 1 ? "" : k}x\\}$. Evaluate $\\iiint_E ${c === 1 ? "" : c}y\\,dV$.`,
            `$E = \\{(x, y, z) : 0 \\le x \\le ${a},\\ 0 \\le z \\le ${b},\\ 0 \\le y \\le ${k === 1 ? "" : k}x\\}$。计算 $\\iiint_E ${c === 1 ? "" : c}y\\,dV$。`,
          ),
          answer: ans,
          wrong: [
            Q.of(c * k * a * a * b, 2),
            Q.of(c * k * k * a ** 3 * b, 2),
            Q.of(c * k * k * a ** 3 * b, 3),
            Q.of(c * k * k * a * a * b, 4),
          ],
          solution: t(
            `Inner: $\\int_0^{${k === 1 ? "" : k}x} ${c === 1 ? "" : c}y\\,dy = \\frac{${c * k * k === 1 ? "" : c * k * k}x^2}{2}$. Then $\\int_0^{${b}} \\int_0^{${a}} \\frac{${c * k * k === 1 ? "" : c * k * k}x^2}{2}\\,dx\\,dz = \\frac{${c * k * k} \\cdot ${a ** 3}}{6} \\cdot ${b} = ${ans.toLatex()}$.`,
            `内层：$\\int_0^{${k === 1 ? "" : k}x} ${c === 1 ? "" : c}y\\,dy = \\frac{${c * k * k === 1 ? "" : c * k * k}x^2}{2}$。再算 $\\int_0^{${b}} \\int_0^{${a}} \\frac{${c * k * k === 1 ? "" : c * k * k}x^2}{2}\\,dx\\,dz = \\frac{${c * k * k} \\cdot ${a ** 3}}{6} \\cdot ${b} = ${ans.toLatex()}$。`,
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
  prerequisites: ["type-i-ii-and-iii-regions-in-three-dimensional-space"],
  encompasses: [{ topic: "type-i-ii-and-iii-regions-in-three-dimensional-space", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "integrating-with-respect-to-x-first",
      title: t("Integrating with respect to x first", "先对 x 积分的三重积分计算"),
      explanation: t(
        "Choose the innermost variable to be the one whose bounds are given as functions of the other two, so the limits are easy to write. For $E$ bounded by $0 \\le y \\le a$, $0 \\le z \\le b$, and $0 \\le x \\le cyz$:\n\n$$\\iiint_E 1\\,dV = \\int_0^a \\int_0^b \\int_0^{cyz} 1\\,dx\\,dz\\,dy = c\\frac{a^2 b^2}{4}.$$",
        "选择边界由另外两个变量的函数给出的那个变量作为最内层变量，这样积分限容易写出。对于由 $0 \\le y \\le a$、$0 \\le z \\le b$ 与 $0 \\le x \\le cyz$ 所围成的区域 $E$：\n\n$$\\iiint_E 1\\,dV = \\int_0^a \\int_0^b \\int_0^{cyz} 1\\,dx\\,dz\\,dy = c\\frac{a^2 b^2}{4}。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const c = rng.int(1, 4);

        const num = c * a * a * b * b;
        const ans = Q.of(num, 4);

        const prompt = t(
          `Find the volume of the solid $E$ bounded by $0 \\le y \\le ${a}$, $0 \\le z \\le ${b}$, and $0 \\le x \\le ${c}yz$.`,
          `求由 $0 \\le y \\le ${a}$、$0 \\le z \\le ${b}$ 与 $0 \\le x \\le ${c}yz$ 所围成几何体 $E$ 的体积。`,
        );
        const solution = t(
          steps(
            `Set up the iterated integral with $x$ as the innermost variable:\n\n$$\\int_0^{${a}} \\int_0^{${b}} \\int_0^{${c}yz} 1\\,dx\\,dz\\,dy = \\int_0^{${a}} \\int_0^{${b}} ${c}yz\\,dz\\,dy.$$`,
            `Factor into single integrals: $${c}\\left(\\int_0^{${a}} y\\,dy\\right)\\left(\\int_0^{${b}} z\\,dz\\right) = ${c}\\left(\\frac{${a * a}}{2}\\right)\\left(\\frac{${b * b}}{2}\\right) = ${ans.toLatex()}$.`,
          ),
          steps(
            `建立以 $x$ 为最内层变量的二次积分：\n\n$$\\int_0^{${a}} \\int_0^{${b}} \\int_0^{${c}yz} 1\\,dx\\,dz\\,dy = \\int_0^{${a}} \\int_0^{${b}} ${c}yz\\,dz\\,dy。$$`,
            `因式分解为单积分求积：$${c}\\left(\\int_0^{${a}} y\\,dy\\right)\\left(\\int_0^{${b}} z\\,dz\\right) = ${c}\\left(\\frac{${a * a}}{2}\\right)\\left(\\frac{${b * b}}{2}\\right) = ${ans.toLatex()}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.of(num, 2), Q.of(num), ans.mul(Q.of(2))],
        });
      },
    },
    {
      id: "integrating-x-over-a-type-iii-solid",
      title: t("Integrating $x$ over a Type III solid", "在 Type III 型立体上积分 $x$"),
      explanation: t(
        "For a Type III solid the inner integral runs in $x$, between surfaces that depend on $y$ and $z$, and the outer double integral runs over the projection $D$ in the $yz$-plane. For $0 \\le x \\le ky$ over $D = [0, a] \\times [0, b]$ in $y$ and $z$:\n\n$$\\iint_D \\int_0^{ky} x\\,dx\\,dA = \\iint_D \\frac{k^2y^2}{2}\\,dA = \\frac{k^2a^3b}{6}.$$\n\nIt is the Type II computation with the roles of $x$ and $y$ exchanged.",
        "对 Type III 型立体，内层对 $x$ 积分，上下限是依赖 $y$ 和 $z$ 的曲面；外层在 $yz$ 平面的投影 $D$ 上作二重积分。对 $0 \\le x \\le ky$，$D$ 为 $y$、$z$ 的 $[0, a] \\times [0, b]$：\n\n$$\\iint_D \\int_0^{ky} x\\,dx\\,dA = \\iint_D \\frac{k^2y^2}{2}\\,dA = \\frac{k^2a^3b}{6}。$$\n\n这就是把 Type II 计算中 $x$ 与 $y$ 的角色互换。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 4);
        const b = rng.int(1, 4);
        const k = rng.int(1, 3);
        const ans = Q.of(k * k * a ** 3 * b, 6);
        return numberProblem({
          prompt: t(
            `$E = \\{(x, y, z) : 0 \\le y \\le ${a},\\ 0 \\le z \\le ${b},\\ 0 \\le x \\le ${k === 1 ? "" : k}y\\}$. Evaluate $\\iiint_E x\\,dV$.`,
            `$E = \\{(x, y, z) : 0 \\le y \\le ${a},\\ 0 \\le z \\le ${b},\\ 0 \\le x \\le ${k === 1 ? "" : k}y\\}$。计算 $\\iiint_E x\\,dV$。`,
          ),
          answer: ans,
          wrong: [Q.of(k * a * a * b, 2), Q.of(k * k * a ** 3 * b, 2), Q.of(k * k * a * a * b, 4), Q.of(k * a ** 3 * b, 6)],
          solution: t(
            `Inner: $\\int_0^{${k === 1 ? "" : k}y} x\\,dx = \\frac{${k * k === 1 ? "" : k * k}y^2}{2}$. Then $\\int_0^{${b}} \\int_0^{${a}} \\frac{${k * k === 1 ? "" : k * k}y^2}{2}\\,dy\\,dz = \\frac{${k * k} \\cdot ${a ** 3}}{6} \\cdot ${b} = ${ans.toLatex()}$.`,
            `内层：$\\int_0^{${k === 1 ? "" : k}y} x\\,dx = \\frac{${k * k === 1 ? "" : k * k}y^2}{2}$。再算 $\\int_0^{${b}} \\int_0^{${a}} \\frac{${k * k === 1 ? "" : k * k}y^2}{2}\\,dy\\,dz = \\frac{${k * k} \\cdot ${a ** 3}}{6} \\cdot ${b} = ${ans.toLatex()}$。`,
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
  prerequisites: ["triple-integrals-over-type-i-regions"],
  encompasses: [{ topic: "triple-integrals-over-type-i-regions", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "volume-of-a-standard-simplex",
      title: t("Volume of a standard simplex", "标准四面体的体积"),
      explanation: t(
        "A tetrahedron cut off by a plane from the corner of the first octant has one sixth of the volume of the box with the same intercepts. The tetrahedron bounded by the coordinate planes and $\\frac{x}{a} + \\frac{y}{b} + \\frac{z}{c} = 1$ ($a, b, c > 0$) has volume:\n\n$$\\text{Vol}(E) = \\iiint_E 1\\,dV = \\frac{abc}{6}.$$",
        "被平面从第一卦限的角上截下的四面体，体积是具有相同截距的长方体体积的六分之一。由坐标平面与平面 $\\frac{x}{a} + \\frac{y}{b} + \\frac{z}{c} = 1$（$a, b, c > 0$）围成的四面体的体积为：\n\n$$\\text{Vol}(E) = \\iiint_E 1\\,dV = \\frac{abc}{6}。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 7);
        const b = rng.int(1, 7);
        const c = rng.int(1, 7);
        const ans = Q.of(a * b * c, 6);

        const prompt = t(
          `Find the volume of the solid tetrahedron bounded by the coordinate planes $x = 0$, $y = 0$, $z = 0$, and the plane $\\frac{x}{${a}} + \\frac{y}{${b}} + \\frac{z}{${c}} = 1$.`,
          `求由坐标平面 $x = 0$、$y = 0$、$z = 0$ 与平面 $\\frac{x}{${a}} + \\frac{y}{${b}} + \\frac{z}{${c}} = 1$ 所围成的四面体体积。`,
        );
        const solution = t(
          steps(
            `Set up the triple integral for volume $\\text{Vol}(E) = \\iiint_E 1\\,dV$:`,
            `$$\\int_0^{${a}} \\int_0^{${b}(1 - x/${a})} \\int_0^{${c}(1 - x/${a} - y/${b})} 1\\,dz\\,dy\\,dx$$`,
            `The volume of a right tetrahedron with intercept lengths $a, b, c$ is $\\frac{1}{3}(\\text{Base Area}) \\times (\\text{Height}) = \\frac{1}{3}\\left(\\frac{ab}{2}\\right)c = \\frac{abc}{6}$.`,
            `Evaluating with $a = ${a}$, $b = ${b}$, $c = ${c}$ yields $\\frac{${a * b * c}}{6} = ${ans.toLatex()}$.`,
          ),
          steps(
            `建立体积的三重积分 $\\text{Vol}(E) = \\iiint_E 1\\,dV$：`,
            `$$\\int_0^{${a}} \\int_0^{${b}(1 - x/${a})} \\int_0^{${c}(1 - x/${a} - y/${b})} 1\\,dz\\,dy\\,dx$$`,
            `三条直角边截距为 $a, b, c$ 的直角四面体体积为 $\\frac{1}{3}(\\text{底面积}) \\times (\\text{高}) = \\frac{1}{3}\\left(\\frac{ab}{2}\\right)c = \\frac{abc}{6}$。`,
            `代入 $a = ${a}$、$b = ${b}$、$c = ${c}$ 得到 $\\frac{${a * b * c}}{6} = ${ans.toLatex()}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.of(a * b * c, 2), Q.of(a * b * c, 3), ans.mul(Q.of(2))],
        });
      },
    },
    {
      id: "the-volume-under-a-paraboloid-over-a-rectangle",
      title: t("The volume under a paraboloid over a rectangle", "矩形上方抛物面下的体积"),
      explanation: t(
        "The volume of a solid $E$ is $\\iiint_E 1\\,dV$. For the solid above $[0, a] \\times [0, b]$ and below $z = x^2 + y^2$, the $z$-integral gives the height of the surface, leaving\n\n$$V = \\int_0^a \\int_0^b (x^2 + y^2)\\,dy\\,dx = \\frac{a^3b}{3} + \\frac{ab^3}{3}.$$\n\nEach term comes from one square in the integrand, multiplied by the length of the other side.",
        "立体 $E$ 的体积为 $\\iiint_E 1\\,dV$。对 $[0, a] \\times [0, b]$ 上方、$z = x^2 + y^2$ 下方的立体，对 $z$ 积分得到曲面高度，于是\n\n$$V = \\int_0^a \\int_0^b (x^2 + y^2)\\,dy\\,dx = \\frac{a^3b}{3} + \\frac{ab^3}{3}。$$\n\n每一项来自被积函数中的一个平方项，再乘以另一边的长度。",
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
          wrong: [Q.of(a ** 3 + b ** 3, 3), Q.of(a * b * (a * a + b * b)), Q.of(a ** 3 * b + a * b ** 3, 2), Q.of(a * a * b * b, 2)],
          solution: t(
            `$V = \\int_0^{${a}} \\int_0^{${b}} (x^2 + y^2)\\,dy\\,dx = \\frac{${a ** 3} \\cdot ${b}}{3} + \\frac{${a} \\cdot ${b ** 3}}{3} = ${ans.toLatex()}$.`,
            `$V = \\int_0^{${a}} \\int_0^{${b}} (x^2 + y^2)\\,dy\\,dx = \\frac{${a ** 3} \\cdot ${b}}{3} + \\frac{${a} \\cdot ${b ** 3}}{3} = ${ans.toLatex()}$。`,
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
      title: t("Reprojecting triple integrals from xy to xz plane", "将三重积分从 xy 投影转为 xz 投影"),
      explanation: t(
        "The same solid can be projected onto different coordinate planes, and choosing the plane that makes the boundaries simplest leads to easier limits. For a wedge $0 \\le x \\le a$, $0 \\le y \\le b$, $0 \\le z \\le 1 - x/a$, projecting onto the $xz$-plane gives region $0 \\le z \\le 1, 0 \\le x \\le a(1 - z)$. Then $\\iiint_E 1\\,dV = \\int_0^1 \\int_0^{a(1-z)} \\int_0^b 1\\,dy\\,dx\\,dz = \\frac{ab}{2}$.",
        "同一个立体可以投影到不同的坐标平面上，选择使边界最简单的平面，积分限就更容易。对于楔形体 $0 \\le x \\le a$、$0 \\le y \\le b$、$0 \\le z \\le 1 - x/a$，向 $xz$ 平面投影得到平面区域 $0 \\le z \\le 1, 0 \\le x \\le a(1 - z)$。积分化为 $\\iiint_E 1\\,dV = \\int_0^1 \\int_0^{a(1-z)} \\int_0^b 1\\,dy\\,dx\\,dz = \\frac{ab}{2}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 8);
        const b = rng.int(2, 8);
        const ans = Q.of(a * b, 2);

        const prompt = t(
          `Evaluate the volume of the solid wedge bounded by $x = 0$, $y = 0$, $z = 0$, $y = ${b}$, and $x + ${a}z = ${a}$ by projecting onto the $xz$-plane and integrating with respect to $y$ first.`,
          `通过向 $xz$ 平面投影并优先对 $y$ 积分，计算由 $x = 0$、$y = 0$、$z = 0$、$y = ${b}$ 与 $x + ${a}z = ${a}$ 所围成楔形体的体积。`,
        );
        const solution = t(
          steps(
            `Projecting onto the $xz$-plane, the cross-section is the triangle $0 \\le z \\le 1$ and $0 \\le x \\le ${a}(1 - z)$.`,
            `Because the solid has uniform thickness in $y$, $0 \\le y \\le ${b}$, integrating $y$ gives $\\int_0^{${b}} 1\\,dy = ${b}$.`,
            `The remaining double integral over the $xz$-projection is $\\int_0^1 \\int_0^{${a}(1 - z)} ${b}\\,dx\\,dz = ${b} \\int_0^1 ${a}(1 - z)\\,dz = ${b} \\cdot \\frac{${a}}{2} = ${ans.toLatex()}$.`,
          ),
          steps(
            `向 $xz$ 平面投影，所得截面为三角形 $0 \\le z \\le 1$ 且 $0 \\le x \\le ${a}(1 - z)$。`,
            `由于该楔形体在 $y$ 方向厚度均匀，$0 \\le y \\le ${b}$，对 $y$ 积分得到 $\\int_0^{${b}} 1\\,dy = ${b}$。`,
            `在 $xz$ 投影上的二重积分为 $\\int_0^1 \\int_0^{${a}(1 - z)} ${b}\\,dx\\,dz = ${b} \\int_0^1 ${a}(1 - z)\\,dz = ${b} \\cdot \\frac{${a}}{2} = ${ans.toLatex()}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.of(a * b), Q.of(a * b, 3), ans.mul(Q.of(2))],
        });
      },
    },
    {
      id: "the-volume-of-a-parabolic-cylinder-slab",
      title: t("The volume of a parabolic cylinder slab", "抛物柱面板块的体积"),
      explanation: t(
        "Choosing the right projection can make a triple integral simple. The solid bounded by the parabolic cylinder $y = x^2$, the plane $y = a^2$, and the planes $z = 0$ and $z = h$ has a constant height $h$ over its projection onto the $xy$-plane. That projection is the region $x^2 \\le y \\le a^2$, whose area is $\\int_{-a}^{a} (a^2 - x^2)\\,dx = \\frac{4a^3}{3}$, so the volume is $\\frac{4a^3h}{3}$.",
        "选择合适的投影可以让三重积分变简单。由抛物柱面 $y = x^2$、平面 $y = a^2$ 以及平面 $z = 0$、$z = h$ 围成的立体，在其 $xy$ 平面投影上高度恒为 $h$。投影区域为 $x^2 \\le y \\le a^2$，面积为 $\\int_{-a}^{a} (a^2 - x^2)\\,dx = \\frac{4a^3}{3}$，所以体积为 $\\frac{4a^3h}{3}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 4);
        const h = rng.int(1, 8);
        const ans = Q.of(4 * a ** 3 * h, 3);
        return numberProblem({
          prompt: t(
            `Find the volume of the solid bounded by $y = x^2$, $y = ${a * a}$, $z = 0$, and $z = ${h}$.`,
            `求由 $y = x^2$、$y = ${a * a}$、$z = 0$ 和 $z = ${h}$ 围成的立体体积。`,
          ),
          answer: ans,
          wrong: [Q.of(2 * a ** 3 * h, 3), Q.of(2 * a ** 3 * h), Q.of(4 * a ** 3, 3), Q.of(a ** 3 * h, 3)],
          solution: t(
            `The projection onto the $xy$-plane is $-${a} \\le x \\le ${a}$, $x^2 \\le y \\le ${a * a}$, with area $\\int_{-${a}}^{${a}} (${a * a} - x^2)\\,dx = ${Q.of(4 * a ** 3, 3).toLatex()}$. The height is $${h}$, so $V = ${ans.toLatex()}$.`,
            `在 $xy$ 平面上的投影为 $-${a} \\le x \\le ${a}$，$x^2 \\le y \\le ${a * a}$，面积为 $\\int_{-${a}}^{${a}} (${a * a} - x^2)\\,dx = ${Q.of(4 * a ** 3, 3).toLatex()}$。高度为 $${h}$，所以 $V = ${ans.toLatex()}$。`,
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
        "To change the order, describe the same region with the variables nested differently, reading the new limits from the inequalities that define the region. To evaluate $\\int_0^a \\int_0^b \\int_z^a x\\,dx\\,dy\\,dz$, swap the $x$ and $z$ integrations: $0 \\le z \\le x \\le a \\iff 0 \\le x \\le a, 0 \\le z \\le x$:\n\n$$\\int_0^b \\int_0^a \\int_0^x x\\,dz\\,dx\\,dy = \\int_0^b \\int_0^a x^2\\,dx\\,dy = b\\frac{a^3}{3}.$$",
        "要交换次序，就用不同的嵌套方式描述同一个区域，从定义区域的不等式中读出新的积分限。计算 $\\int_0^a \\int_0^b \\int_z^a x\\,dx\\,dy\\,dz$ 时，对调 $x$ 与 $z$ 的积分次序：$0 \\le z \\le x \\le a \\iff 0 \\le x \\le a, 0 \\le z \\le x$：\n\n$$\\int_0^b \\int_0^a \\int_0^x x\\,dz\\,dx\\,dy = \\int_0^b \\int_0^a x^2\\,dx\\,dy = b\\frac{a^3}{3}。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const ans = Q.of(b * a * a * a, 3);

        const prompt = t(
          `Evaluate the iterated triple integral $\\int_0^{${a}} \\int_0^{${b}} \\int_z^{${a}} x\\,dx\\,dy\\,dz$ by changing the order of integration.`,
          `通过交换积分次序计算三次积分 $\\int_0^{${a}} \\int_0^{${b}} \\int_z^{${a}} x\\,dx\\,dy\\,dz$ 的值。`,
        );
        const solution = t(
          steps(
            `The limits for $x$ and $z$ are $0 \\le z \\le ${a}$ and $z \\le x \\le ${a}$.`,
            `Reversing the order gives $0 \\le x \\le ${a}$ and $0 \\le z \\le x$.`,
            `The iterated integral becomes $\\int_0^{${b}} \\int_0^{${a}} \\int_0^x x\\,dz\\,dx\\,dy$.`,
            `Integrate with respect to $z$: $\\int_0^x x\\,dz = x^2$.`,
            `Integrate with respect to $x$: $\\int_0^{${a}} x^2\\,dx = \\frac{${a}^3}{3} = \\frac{${a * a * a}}{3}$.`,
            `Integrate with respect to $y$: $\\int_0^{${b}} \\frac{${a * a * a}}{3}\\,dy = ${b} \\times \\frac{${a * a * a}}{3} = ${ans.toLatex()}$.`,
          ),
          steps(
            `由原积分限知 $x$ 与 $z$ 满足 $0 \\le z \\le ${a}$ 且 $z \\le x \\le ${a}$。`,
            `对调积分次序得到 $0 \\le x \\le ${a}$ 且 $0 \\le z \\le x$。`,
            `三次积分变为 $\\int_0^{${b}} \\int_0^{${a}} \\int_0^x x\\,dz\\,dx\\,dy$。`,
            `先对 $z$ 积分：$\\int_0^x x\\,dz = x^2$。`,
            `再对 $x$ 积分：$\\int_0^{${a}} x^2\\,dx = \\frac{${a}^3}{3} = \\frac{${a * a * a}}{3}$。`,
            `最后对 $y$ 积分：$\\int_0^{${b}} \\frac{${a * a * a}}{3}\\,dy = ${b} \\times \\frac{${a * a * a}}{3} = ${ans.toLatex()}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.of(b * a * a * a, 2), Q.of(b * a * a * a), ans.mul(Q.of(2))],
        });
      },
    },
    {
      id: "reordering-the-limits-of-a-nested-triple-integral",
      title: t("Reordering the limits of a nested triple integral", "重排嵌套三重积分的积分限"),
      explanation: t(
        "The integral $\\int_0^a \\int_0^x \\int_0^y f\\,dz\\,dy\\,dx$ covers the solid $0 \\le z \\le y \\le x \\le a$. Writing the chain of inequalities makes any other order easy to read off. For the order $dx\\,dy\\,dz$, the outermost variable $z$ runs from $0$ to $a$, then $y$ runs from $z$ to $a$, and finally $x$ runs from $y$ to $a$:\n\n$$\\int_0^a \\int_z^a \\int_y^a f\\,dx\\,dy\\,dz.$$",
        "积分 $\\int_0^a \\int_0^x \\int_0^y f\\,dz\\,dy\\,dx$ 覆盖立体 $0 \\le z \\le y \\le x \\le a$。写出这串不等式后，任何其他次序都容易读出。对次序 $dx\\,dy\\,dz$，最外层 $z$ 从 $0$ 到 $a$，然后 $y$ 从 $z$ 到 $a$，最后 $x$ 从 $y$ 到 $a$：\n\n$$\\int_0^a \\int_z^a \\int_y^a f\\,dx\\,dy\\,dz。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 9);
        const f = rng.pick(["x", "y", "z", "xy", "xz", "yz", "xyz"]);
        const opt = (s: string) => t(`$${s}$`, `$${s}$`);
        return pickChoice(
          rng,
          t(
            `Rewrite $\\int_0^{${a}} \\int_0^x \\int_0^y ${f}\\,dz\\,dy\\,dx$ in the order $dx\\,dy\\,dz$.`,
            `把 $\\int_0^{${a}} \\int_0^x \\int_0^y ${f}\\,dz\\,dy\\,dx$ 改写为 $dx\\,dy\\,dz$ 次序。`,
          ),
          opt(`\\int_0^{${a}} \\int_z^{${a}} \\int_y^{${a}} ${f}\\,dx\\,dy\\,dz`),
          [
            opt(`\\int_0^{${a}} \\int_0^z \\int_0^y ${f}\\,dx\\,dy\\,dz`),
            opt(`\\int_0^{${a}} \\int_z^{${a}} \\int_0^y ${f}\\,dx\\,dy\\,dz`),
            opt(`\\int_0^{${a}} \\int_0^{${a}} \\int_y^{${a}} ${f}\\,dx\\,dy\\,dz`),
          ],
          t(
            `The solid is $0 \\le z \\le y \\le x \\le ${a}$. So $z$ runs over $[0, ${a}]$, $y$ over $[z, ${a}]$, and $x$ over $[y, ${a}]$.`,
            `立体为 $0 \\le z \\le y \\le x \\le ${a}$。所以 $z$ 取 $[0, ${a}]$，$y$ 取 $[z, ${a}]$，$x$ 取 $[y, ${a}]$。`,
          ),
        );
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
  prerequisites: ["changing-the-order-of-integration-in-double-integrals", "polar-coordinate-transformations"],
  encompasses: [
    {
      topic: "changing-the-order-of-integration-in-double-integrals",
      weight: 0.3,
    },
    { topic: "polar-coordinate-transformations", weight: 0.3 },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "integrating-radial-functions-over-disks",
      title: t("Integrating radial functions over disks", "在圆盘上积分径向函数"),
      explanation: t(
        "In polar coordinates a disk has constant limits and the area element carries an extra factor of the radius, so radial functions become simple to integrate. For a disk $D$ of radius $R$ centered at the origin, the integral of $x^2 + y^2 = r^2$ is:\n\n$$\\iint_D (x^2 + y^2)\\,dA = \\int_0^{2\\pi} \\int_0^R r^2 \\cdot r\\,dr\\,d\\theta = 2\\pi \\left[\\frac{r^4}{4}\\right]_0^R = \\frac{\\pi R^4}{2}.$$",
        "在极坐标中，圆盘的积分限是常数，面积微元多一个半径因子，所以径向函数变得容易积分。对于以原点为中心、半径为 $R$ 的圆盘 $D$，$x^2 + y^2 = r^2$ 的二重积分为：\n\n$$\\iint_D (x^2 + y^2)\\,dA = \\int_0^{2\\pi} \\int_0^R r^2 \\cdot r\\,dr\\,d\\theta = 2\\pi \\left[\\frac{r^4}{4}\\right]_0^R = \\frac{\\pi R^4}{2}。$$",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(2, 35);
        const ans = Q.of(R * R * R * R, 2);

        const prompt = t(
          `Find the value of $\\frac{1}{\\pi} \\iint_D (x^2 + y^2)\\,dA$, where $D$ is the disk of radius $${R}$ centered at the origin.`,
          `计算 $\\frac{1}{\\pi} \\iint_D (x^2 + y^2)\\,dA$ 的值，其中 $D$ 为以原点为中心、半径为 $${R}$ 的圆盘。`,
        );
        const solution = t(
          steps(
            `Convert to polar coordinates: $x^2 + y^2 = r^2$ and $dA = r\\,dr\\,d\\theta$.`,
            `The limits for disk $D$ are $0 \\le r \\le ${R}$ and $0 \\le \\theta \\le 2\\pi$:`,
            `$$\\iint_D (x^2 + y^2)\\,dA = \\int_0^{2\\pi} \\int_0^{${R}} r^3\\,dr\\,d\\theta = 2\\pi \\left[\\frac{r^4}{4}\\right]_0^{${R}} = 2\\pi \\cdot \\frac{${R * R * R * R}}{4} = \\pi \\cdot ${ans.toLatex()}.$$ `,
            `Dividing by $\\pi$ gives $${ans.toLatex()}$.`,
          ),
          steps(
            `转化为极坐标：$x^2 + y^2 = r^2$ 且 $dA = r\\,dr\\,d\\theta$。`,
            `圆盘 $D$ 的积分限为 $0 \\le r \\le ${R}$ 与 $0 \\le \\theta \\le 2\\pi$：`,
            `$$\\iint_D (x^2 + y^2)\\,dA = \\int_0^{2\\pi} \\int_0^{${R}} r^3\\,dr\\,d\\theta = 2\\pi \\left[\\frac{r^4}{4}\\right]_0^{${R}} = 2\\pi \\cdot \\frac{${R * R * R * R}}{4} = \\pi \\cdot ${ans.toLatex()}。$$ `,
            `除以 $\\pi$ 得到 $${ans.toLatex()}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.of(R * R * R * R, 4), Q.of(R * R), ans.mul(Q.of(2))],
        });
      },
    },
    {
      id: "integrating-the-distance-from-the-origin-over-a-disk",
      title: t("Integrating distance from the origin over a disk", "在圆盘上积分到原点的距离"),
      explanation: t(
        "In polar coordinates $\\sqrt{x^2 + y^2} = r$ and $dA = r\\,dr\\,d\\theta$, so the extra factor $r$ from the area element must not be forgotten. Over the disk of radius $R$:\n\n$$\\iint_D c\\sqrt{x^2 + y^2}\\,dA = \\int_0^{2\\pi} \\int_0^R c\\,r \\cdot r\\,dr\\,d\\theta = \\frac{2\\pi cR^3}{3}.$$",
        "在极坐标中 $\\sqrt{x^2 + y^2} = r$，$dA = r\\,dr\\,d\\theta$，面积元中多出的因子 $r$ 不能忘记。在半径为 $R$ 的圆盘上：\n\n$$\\iint_D c\\sqrt{x^2 + y^2}\\,dA = \\int_0^{2\\pi} \\int_0^R c\\,r \\cdot r\\,dr\\,d\\theta = \\frac{2\\pi cR^3}{3}。$$",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(1, 6);
        const c = rng.int(1, 5);
        const ans = Q.of(2 * c * R ** 3, 3);
        return numberProblem({
          prompt: t(
            `$D$ is the disk of radius $${R}$ centered at the origin. Find $\\frac{1}{\\pi}\\iint_D ${c === 1 ? "" : c}\\sqrt{x^2 + y^2}\\,dA$.`,
            `$D$ 是以原点为圆心、半径为 $${R}$ 的圆盘。求 $\\frac{1}{\\pi}\\iint_D ${c === 1 ? "" : c}\\sqrt{x^2 + y^2}\\,dA$。`,
          ),
          answer: ans,
          wrong: [Q.of(c * R * R), Q.of(c * R ** 3, 3), Q.of(c * R ** 4, 2), Q.of(2 * c * R * R, 3)],
          solution: t(
            `$\\int_0^{2\\pi} \\int_0^{${R}} ${c === 1 ? "" : c}r^2\\,dr\\,d\\theta = 2\\pi \\cdot \\frac{${c} \\cdot ${R ** 3}}{3}$. Dividing by $\\pi$ gives $${ans.toLatex()}$.`,
            `$\\int_0^{2\\pi} \\int_0^{${R}} ${c === 1 ? "" : c}r^2\\,dr\\,d\\theta = 2\\pi \\cdot \\frac{${c} \\cdot ${R ** 3}}{3}$。除以 $\\pi$ 得 $${ans.toLatex()}$。`,
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
  prerequisites: ["double-integrals-in-plane-polar-coordinates"],
  encompasses: [{ topic: "double-integrals-in-plane-polar-coordinates", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "integrating-over-annular-polar-regions",
      title: t("Integrating over annular polar regions", "在圆环扇形区域上的极坐标二重积分"),
      explanation: t(
        "An annular sector is a rectangle in polar coordinates, with the radius between two values and the angle between two values. For an annular sector $r_1 \\le r \\le r_2$ and $0 \\le \\theta \\le \\frac{\\pi}{k}$, the area divided by $\\pi$ is:\n\n$$\\frac{1}{\\pi}\\iint_R 1\\,dA = \\frac{1}{\\pi}\\int_0^{\\pi/k} \\int_{r_1}^{r_2} r\\,dr\\,d\\theta = \\frac{r_2^2 - r_1^2}{2k}.$$",
        "环形扇区在极坐标中是一个矩形，半径和角度都介于两个值之间。对于圆环扇形区域 $r_1 \\le r \\le r_2$ 且 $0 \\le \\theta \\le \\frac{\\pi}{k}$，其面积除以 $\\pi$ 为：\n\n$$\\frac{1}{\\pi}\\iint_R 1\\,dA = \\frac{1}{\\pi}\\int_0^{\\pi/k} \\int_{r_1}^{r_2} r\\,dr\\,d\\theta = \\frac{r_2^2 - r_1^2}{2k}。$$",
      ),
      generate(rng: Rng): Problem {
        const r1 = rng.int(1, 5);
        const dr = rng.int(1, 6);
        const r2 = r1 + dr;
        const k = rng.int(2, 6);

        const diffSq = r2 * r2 - r1 * r1;
        const ans = Q.of(diffSq, 2 * k);

        const prompt = t(
          `Find the value of $\\frac{1}{\\pi} \\iint_R 1\\,dA$ over the annular sector $R = \\{(r, \\theta) : ${r1} \\le r \\le ${r2}, 0 \\le \\theta \\le \\frac{\\pi}{${k}}\\}$.`,
          `计算 $\\frac{1}{\\pi} \\iint_R 1\\,dA$ 的值，其中 $R = \\{(r, \\theta) : ${r1} \\le r \\le ${r2}, 0 \\le \\theta \\le \\frac{\\pi}{${k}}\\}$ 为圆环扇形区域。`,
        );
        const solution = t(
          steps(
            `Set up the polar integral: $\\iint_R 1\\,dA = \\int_0^{\\pi/${k}} \\int_{${r1}}^{${r2}} r\\,dr\\,d\\theta$.`,
            `Integrate with respect to $r$:\n\n$$\\int_{${r1}}^{${r2}} r\\,dr = \\left[\\frac{r^2}{2}\\right]_{${r1}}^{${r2}} = \\frac{${r2 * r2} - ${r1 * r1}}{2} = \\frac{${diffSq}}{2}.$$`,
            `Integrate with respect to $\\theta$:\n\n$$\\int_0^{\\pi/${k}} \\frac{${diffSq}}{2}\\,d\\theta = \\frac{\\pi}{${k}} \\cdot \\frac{${diffSq}}{2} = \\pi \\cdot \\frac{${diffSq}}{${2 * k}} = \\pi \\cdot ${ans.toLatex()}.$$ `,
            `Dividing by $\\pi$ yields $${ans.toLatex()}$.`,
          ),
          steps(
            `建立极坐标积分：$\\iint_R 1\\,dA = \\int_0^{\\pi/${k}} \\int_{${r1}}^{${r2}} r\\,dr\\,d\\theta$。`,
            `对 $r$ 积分：\n\n$$\\int_{${r1}}^{${r2}} r\\,dr = \\left[\\frac{r^2}{2}\\right]_{${r1}}^{${r2}} = \\frac{${r2 * r2} - ${r1 * r1}}{2} = \\frac{${diffSq}}{2}。$$`,
            `对 $\\theta$ 积分：\n\n$$\\int_0^{\\pi/${k}} \\frac{${diffSq}}{2}\\,d\\theta = \\frac{\\pi}{${k}} \\cdot \\frac{${diffSq}}{2} = \\pi \\cdot \\frac{${diffSq}}{${2 * k}} = \\pi \\cdot ${ans.toLatex()}。$$ `,
            `除以 $\\pi$ 得到 $${ans.toLatex()}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.of(diffSq, k), Q.of(diffSq, 4 * k), ans.mul(Q.of(2))],
        });
      },
    },
    {
      id: "areas-enclosed-by-classic-polar-curves",
      title: t("Areas enclosed by classic polar curves", "经典极坐标曲线围成的面积"),
      explanation: t(
        "The area enclosed by $r = f(\\theta)$ is $\\frac{1}{2}\\int f(\\theta)^2\\,d\\theta$ over one full trace of the curve. Three standard results follow:\n\n- The circle $r = 2a\\cos\\theta$ (or $2a\\sin\\theta$) is traced once for $\\theta \\in [0, \\pi]$ and encloses $\\pi a^2$.\n- The cardioid $r = a(1 + \\cos\\theta)$ encloses $\\frac{3}{2}\\pi a^2$.\n- The rose $r = a\\cos(n\\theta)$ encloses $\\frac{\\pi a^2}{4}$ when $n$ is odd ($n$ petals) and $\\frac{\\pi a^2}{2}$ when $n$ is even ($2n$ petals).",
        "曲线 $r = f(\\theta)$ 围成的面积是在曲线完整描一遍的范围上计算 $\\frac{1}{2}\\int f(\\theta)^2\\,d\\theta$。由此得三个标准结果：\n\n- 圆 $r = 2a\\cos\\theta$（或 $2a\\sin\\theta$）在 $\\theta \\in [0, \\pi]$ 上描一遍，面积为 $\\pi a^2$。\n- 心形线 $r = a(1 + \\cos\\theta)$ 面积为 $\\frac{3}{2}\\pi a^2$。\n- 玫瑰线 $r = a\\cos(n\\theta)$：$n$ 为奇数时（$n$ 瓣）面积为 $\\frac{\\pi a^2}{4}$，$n$ 为偶数时（$2n$ 瓣）面积为 $\\frac{\\pi a^2}{2}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 6);
        const kind = rng.int(1, 3);
        const trig = rng.pick(["\\cos", "\\sin"]);
        const n = rng.int(2, 5);
        const curve =
          kind === 1
            ? `r = ${2 * a}${trig}\\theta`
            : kind === 2
              ? `r = ${a === 1 ? "" : a}(1 + ${trig}\\theta)`
              : `r = ${a === 1 ? "" : a}${trig}(${n}\\theta)`;
        const ans = kind === 1 ? Q.of(a * a) : kind === 2 ? Q.of(3 * a * a, 2) : Q.of(a * a, n % 2 === 1 ? 4 : 2);
        const name = kind === 1 ? ["circle", "圆"] : kind === 2 ? ["cardioid", "心形线"] : ["rose", "玫瑰线"];
        const why =
          kind === 1
            ? t(
                `$\\frac{1}{2}\\int_0^{\\pi} ${4 * a * a}${trig}^2\\theta\\,d\\theta = ${a * a}\\pi$.`,
                `$\\frac{1}{2}\\int_0^{\\pi} ${4 * a * a}${trig}^2\\theta\\,d\\theta = ${a * a}\\pi$。`,
              )
            : kind === 2
              ? t(
                  `$\\frac{1}{2}\\int_0^{2\\pi} ${a * a}(1 + ${trig}\\theta)^2\\,d\\theta = \\frac{${a * a}}{2} \\cdot 3\\pi$.`,
                  `$\\frac{1}{2}\\int_0^{2\\pi} ${a * a}(1 + ${trig}\\theta)^2\\,d\\theta = \\frac{${a * a}}{2} \\cdot 3\\pi$。`,
                )
              : t(
                  `$n = ${n}$ is ${n % 2 === 1 ? `odd, so there are $${n}$ petals and the area is $\\frac{\\pi a^2}{4}$` : `even, so there are $${2 * n}$ petals and the area is $\\frac{\\pi a^2}{2}$`} with $a = ${a}$.`,
                  `$n = ${n}$ 为${n % 2 === 1 ? `奇数，共 $${n}$ 瓣，面积为 $\\frac{\\pi a^2}{4}$` : `偶数，共 $${2 * n}$ 瓣，面积为 $\\frac{\\pi a^2}{2}$`}，其中 $a = ${a}$。`,
                );
        return numberProblem({
          prompt: t(
            `Find $\\frac{1}{\\pi}$ times the area enclosed by the ${name[0]} $${curve}$.`,
            `求${name[1]} $${curve}$ 围成面积的 $\\frac{1}{\\pi}$ 倍。`,
          ),
          answer: ans,
          wrong: [Q.of(a * a), Q.of(4 * a * a), Q.of(3 * a * a, 2), Q.of(a * a, 2), Q.of(a * a, 4)],
          solution: t(`${why.en} Dividing by $\\pi$ gives $${ans.toLatex()}$.`, `${why["zh-CN"]}除以 $\\pi$ 得 $${ans.toLatex()}$。`),
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
        "Stretching the unit disk by different factors along the axes produces an ellipse, and its area is the area of the disk times the product of the factors. Under the transformation $x = au, y = bv$, the unit disk $u^2 + v^2 \\le 1$ maps to the ellipse $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} \\le 1$. The Jacobian is $J = ab$, so $\\text{Area}(E) = \\pi ab$.",
        "沿两轴按不同比例拉伸单位圆盘就得到椭圆，它的面积等于圆盘面积乘以两个比例的乘积。在变换 $x = au, y = bv$ 下，单位圆盘 $u^2 + v^2 \\le 1$ 被映射为椭圆 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} \\le 1$。雅可比行列式为 $J = ab$，因此椭圆面积为 $\\text{Area}(E) = \\pi ab$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 10);
        const b = rng.int(2, 10);
        const ans = a * b;

        const prompt = t(
          `Find the value of $\\frac{\\text{Area}(E)}{\\pi}$ for the elliptical region $E$ defined by $\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} \\le 1$.`,
          `计算椭圆区域 $E: \\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} \\le 1$ 的面积与 $\\pi$ 的比值 $\\frac{\\text{Area}(E)}{\\pi}$。`,
        );
        const solution = t(
          steps(
            `Substitute $x = ${a}u$ and $y = ${b}v$. The boundary becomes $u^2 + v^2 \\le 1$, the unit disk $S$.`,
            `Compute the Jacobian determinant:\n\n$$J = \\begin{vmatrix} ${a} & 0 \\\\ 0 & ${b} \\end{vmatrix} = ${a} \\times ${b} = ${ans}.$$`,
            `The area is $\\text{Area}(E) = \\iint_S |J|\\,du\\,dv = ${ans} \\iint_S 1\\,du\\,dv = ${ans}(\\pi \\cdot 1^2) = ${ans}\\pi$.`,
            `Dividing by $\\pi$ gives $${ans}$.`,
          ),
          steps(
            `作代换 $x = ${a}u$ 与 $y = ${b}v$，椭圆边界转化为单位圆盘 $S: u^2 + v^2 \\le 1$。`,
            `计算雅可比行列式：\n\n$$J = \\begin{vmatrix} ${a} & 0 \\\\ 0 & ${b} \\end{vmatrix} = ${a} \\times ${b} = ${ans}。$$`,
            `根据代换公式，椭圆面积为 $\\text{Area}(E) = \\iint_S |J|\\,du\\,dv = ${ans} \\iint_S 1\\,du\\,dv = ${ans}(\\pi \\cdot 1^2) = ${ans}\\pi$。`,
            `除以 $\\pi$ 得到 $${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [a + b, 2 * a * b, ans + a],
        });
      },
    },
    {
      id: "the-area-of-a-parallelogram-from-a-linear-change-of-variables",
      title: t("The area of a parallelogram by a change of variables", "用变量替换求平行四边形面积"),
      explanation: t(
        "A region $\\{0 \\le px + qy \\le U,\\ 0 \\le rx + sy \\le V\\}$ is a parallelogram. Substituting $u = px + qy$ and $v = rx + sy$ turns it into the rectangle $[0, U] \\times [0, V]$. Since $\\frac{\\partial(u, v)}{\\partial(x, y)} = ps - qr$, the Jacobian of the inverse map is $\\frac{1}{|ps - qr|}$, and\n\n$$\\operatorname{Area} = \\iint 1\\,dx\\,dy = \\frac{UV}{|ps - qr|}.$$",
        "区域 $\\{0 \\le px + qy \\le U,\\ 0 \\le rx + sy \\le V\\}$ 是平行四边形。令 $u = px + qy$，$v = rx + sy$，它变为矩形 $[0, U] \\times [0, V]$。由于 $\\frac{\\partial(u, v)}{\\partial(x, y)} = ps - qr$，逆变换的雅可比行列式为 $\\frac{1}{|ps - qr|}$，于是\n\n$$\\operatorname{Area} = \\iint 1\\,dx\\,dy = \\frac{UV}{|ps - qr|}。$$",
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
        const U = rng.int(1, 6);
        const V = rng.int(1, 6);
        const ans = Q.of(U * V, Math.abs(det));
        return numberProblem({
          prompt: t(
            `Find the area of the region $R = \\{(x, y) : 0 \\le ${poly([p, "x"], [q, "y"])} \\le ${U},\\ 0 \\le ${poly([r, "x"], [s, "y"])} \\le ${V}\\}$.`,
            `求区域 $R = \\{(x, y) : 0 \\le ${poly([p, "x"], [q, "y"])} \\le ${U},\\ 0 \\le ${poly([r, "x"], [s, "y"])} \\le ${V}\\}$ 的面积。`,
          ),
          answer: ans,
          wrong: [Q.of(U * V * Math.abs(det)), Q.of(U * V), Q.of(U * V, Math.abs(p * s + q * r) || 1), Q.of(U * V, 2)],
          solution: t(
            `With $u = ${poly([p, "x"], [q, "y"])}$ and $v = ${poly([r, "x"], [s, "y"])}$, $\\frac{\\partial(u, v)}{\\partial(x, y)} = ${p} \\cdot ${s} - ${paren(q)} \\cdot ${paren(r)} = ${det}$. So $\\operatorname{Area} = \\frac{${U} \\cdot ${V}}{${Math.abs(det)}} = ${ans.toLatex()}$.`,
            `令 $u = ${poly([p, "x"], [q, "y"])}$，$v = ${poly([r, "x"], [s, "y"])}$，则 $\\frac{\\partial(u, v)}{\\partial(x, y)} = ${p} \\cdot ${s} - ${paren(q)} \\cdot ${paren(r)} = ${det}$。所以 $\\operatorname{Area} = \\frac{${U} \\cdot ${V}}{${Math.abs(det)}} = ${ans.toLatex()}$。`,
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
  prerequisites: ["computing-areas-using-a-change-of-variables", "double-integrals-in-plane-polar-coordinates"],
  encompasses: [
    { topic: "computing-areas-using-a-change-of-variables", weight: 0.3 },
    { topic: "double-integrals-in-plane-polar-coordinates", weight: 0.3 },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "integrating-over-parallelograms-via-linear-coordinates",
      title: t("Integrating over parallelograms via linear coordinates", "通过线性坐标代换在平行四边形上积分"),
      explanation: t(
        "New coordinates built from the boundary lines turn the parallelogram into a rectangle, and the Jacobian factor corrects for the change in area. For a region $R$ bounded by $0 \\le x + y \\le U$ and $0 \\le x - y \\le V$, set $u = x + y, v = x - y$. The Jacobian determinant is $\\frac{\\partial(u, v)}{\\partial(x, y)} = -2 \\implies |J(u, v)| = \\frac{1}{2}$. Thus $\\iint_R 1\\,dA = \\frac{UV}{2}$.",
        "由边界直线构造的新坐标把平行四边形变成矩形，雅可比因子修正面积的变化。对于由 $0 \\le x + y \\le U$ 与 $0 \\le x - y \\le V$ 所围成的平行四边形区域 $R$，令 $u = x + y, v = x - y$。雅可比行列式为 $\\frac{\\partial(u, v)}{\\partial(x, y)} = -2 \\implies |J(u, v)| = \\frac{1}{2}$。故其面积为 $\\iint_R 1\\,dA = \\frac{UV}{2}$。",
      ),
      generate(rng: Rng): Problem {
        const U = rng.int(2, 12);
        const V = rng.int(2, 12);
        const ans = Q.of(U * V, 2);

        const prompt = t(
          `Use the change of variables $u = x + y$ and $v = x - y$ to find the area $\\iint_R 1\\,dA$ of the region $R$ bounded by $x + y = 0$, $x + y = ${U}$, $x - y = 0$, and $x - y = ${V}$.`,
          `利用变量代换 $u = x + y$ 与 $v = x - y$，计算由直线 $x + y = 0$、$x + y = ${U}$、$x - y = 0$ 与 $x - y = ${V}$ 所围成区域 $R$ 的面积 $\\iint_R 1\\,dA$。`,
        );
        const solution = t(
          steps(
            `In the $uv$-plane, the region $G$ is the rectangle $[0, ${U}] \\times [0, ${V}]$.`,
            `Compute the Jacobian determinant:\n\n$$\\frac{\\partial(u, v)}{\\partial(x, y)} = \\begin{vmatrix} 1 & 1 \\\\ 1 & -1 \\end{vmatrix} = -1 - 1 = -2 \\implies \\left|\\frac{\\partial(x, y)}{\\partial(u, v)}\\right| = \\frac{1}{|-2|} = \\frac{1}{2}.$$`,
            `Apply the change of variables formula:\n\n$$\\iint_R 1\\,dA = \\iint_G \\frac{1}{2}\\,du\\,dv = \\frac{1}{2}\\text{Area}(G) = \\frac{${U} \\times ${V}}{2} = ${ans.toLatex()}.$$ `,
          ),
          steps(
            `在 $uv$ 平面内，新积分区域 $G$ 为矩形 $[0, ${U}] \\times [0, ${V}]$。`,
            `计算雅可比行列式：\n\n$$\\frac{\\partial(u, v)}{\\partial(x, y)} = \\begin{vmatrix} 1 & 1 \\\\ 1 & -1 \\end{vmatrix} = -1 - 1 = -2 \\implies \\left|\\frac{\\partial(x, y)}{\\partial(u, v)}\\right| = \\frac{1}{|-2|} = \\frac{1}{2}。$$`,
            `应用二重积分变量代换公式：\n\n$$\\iint_R 1\\,dA = \\iint_G \\frac{1}{2}\\,du\\,dv = \\frac{1}{2}\\text{Area}(G) = \\frac{${U} \\times ${V}}{2} = ${ans.toLatex()}。$$ `,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.of(U * V), Q.of(U * V, 4), ans.mul(Q.of(2))],
        });
      },
    },
    {
      id: "integrating-x-plus-y-over-a-rotated-square",
      title: t("Integrating $x + y$ with $u = x + y$, $v = x - y$", "用 $u = x + y$，$v = x - y$ 积分 $x + y$"),
      explanation: t(
        "With $u = x + y$ and $v = x - y$, we have $x = \\frac{u + v}{2}$ and $y = \\frac{u - v}{2}$, so $\\left|\\frac{\\partial(x, y)}{\\partial(u, v)}\\right| = \\frac{1}{2}$ and $dA = \\frac{1}{2}\\,du\\,dv$. The region $0 \\le x + y \\le U$, $0 \\le x - y \\le V$ becomes the rectangle $[0, U] \\times [0, V]$, and the integrand $x + y$ becomes $u$:\n\n$$\\iint_R (x + y)\\,dA = \\frac{1}{2}\\int_0^V \\int_0^U u\\,du\\,dv = \\frac{U^2V}{4}.$$",
        "令 $u = x + y$，$v = x - y$，则 $x = \\frac{u + v}{2}$，$y = \\frac{u - v}{2}$，所以 $\\left|\\frac{\\partial(x, y)}{\\partial(u, v)}\\right| = \\frac{1}{2}$，$dA = \\frac{1}{2}\\,du\\,dv$。区域 $0 \\le x + y \\le U$，$0 \\le x - y \\le V$ 变为矩形 $[0, U] \\times [0, V]$，被积函数 $x + y$ 变为 $u$：\n\n$$\\iint_R (x + y)\\,dA = \\frac{1}{2}\\int_0^V \\int_0^U u\\,du\\,dv = \\frac{U^2V}{4}。$$",
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
          wrong: [Q.of(U * U * V, 2), Q.of(U * U * V), Q.of(U * V, 2), Q.of(U * V * V, 4)],
          solution: t(
            `$dA = \\frac{1}{2}\\,du\\,dv$, so the integral is $\\frac{1}{2}\\int_0^{${V}} \\int_0^{${U}} u\\,du\\,dv = \\frac{1}{2} \\cdot \\frac{${U * U}}{2} \\cdot ${V} = ${ans.toLatex()}$.`,
            `$dA = \\frac{1}{2}\\,du\\,dv$，所以积分为 $\\frac{1}{2}\\int_0^{${V}} \\int_0^{${U}} u\\,du\\,dv = \\frac{1}{2} \\cdot \\frac{${U * U}}{2} \\cdot ${V} = ${ans.toLatex()}$。`,
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
  prerequisites: ["the-jacobian-of-a-three-dimensional-transformation"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "converting-cartesian-points-to-cylindrical-coordinates",
      title: t("Converting Cartesian points to cylindrical coordinates", "将直角坐标转换为柱坐标"),
      explanation: t(
        "Cylindrical coordinates use polar coordinates in the horizontal plane and keep the height unchanged, so find the radius and angle from the first two coordinates. To convert $(x, y, z)$ to cylindrical coordinates $(r, \\theta, z)$, compute $r = \\sqrt{x^2 + y^2}$, $\\tan\\theta = \\frac{y}{x}$, and retain $z$.",
        "柱坐标在水平面内使用极坐标，高度保持不变，所以由前两个坐标求出半径和角度。将直角坐标 $(x, y, z)$ 转换为柱坐标 $(r, \\theta, z)$：$r = \\sqrt{x^2 + y^2}$，$\\tan\\theta = \\frac{y}{x}$，且 $z$ 坐标保持不变。",
      ),
      generate(rng: Rng): Problem {
        const [a0, b0, c0] = rng.pick(pythagoreanTriples);
        const k = rng.int(1, 3);
        const x = a0 * k;
        const y = b0 * k;
        const r = c0 * k;
        const z = rng.int(-5, 5);

        const ans = r;

        const prompt = t(
          `Find the radial coordinate $r$ in cylindrical coordinates $(r, \\theta, z)$ for the point with Cartesian coordinates $(${x}, ${y}, ${z})$.`,
          `求直角坐标为 $(${x}, ${y}, ${z})$ 的点在柱坐标系 $(r, \\theta, z)$ 下的径向坐标 $r$。`,
        );
        const solution = t(
          steps(
            `The radial coordinate in cylindrical coordinates is $r = \\sqrt{x^2 + y^2}$.`,
            `Substitute $x = ${x}$ and $y = ${y}$:\n\n$$r = \\sqrt{(${x})^2 + (${y})^2} = \\sqrt{${x * x} + ${y * y}} = \\sqrt{${r * r}} = ${ans}.$$`,
          ),
          steps(
            `柱坐标系中的径向坐标公式为 $r = \\sqrt{x^2 + y^2}$。`,
            `代入 $x = ${x}$ 与 $y = ${y}$：\n\n$$r = \\sqrt{(${x})^2 + (${y})^2} = \\sqrt{${x * x} + ${y * y}} = \\sqrt{${r * r}} = ${ans}。$$`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [r * r, Math.abs(z), x + y],
        });
      },
    },
    {
      id: "converting-cylindrical-coordinates-to-x",
      title: t("Converting cylindrical coordinates to $x$", "由柱坐标求 $x$"),
      explanation: t(
        "A point with cylindrical coordinates $(r, \\theta, z)$ has Cartesian coordinates $x = r\\cos\\theta$, $y = r\\sin\\theta$ and the same $z$. The value of $\\cos\\theta$ for standard angles such as $\\frac{\\pi}{3}$ or $\\frac{2\\pi}{3}$ gives the $x$-coordinate directly, and its sign follows the quadrant of $\\theta$.",
        "柱坐标为 $(r, \\theta, z)$ 的点，其直角坐标为 $x = r\\cos\\theta$，$y = r\\sin\\theta$，$z$ 不变。对 $\\frac{\\pi}{3}$、$\\frac{2\\pi}{3}$ 等标准角，$\\cos\\theta$ 的值直接给出 $x$ 坐标，其符号由 $\\theta$ 所在象限决定。",
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
        return numberProblem({
          prompt: t(
            `A point has cylindrical coordinates $(r, \\theta, z) = (${r}, ${th}, ${z})$. Find its $x$-coordinate.`,
            `某点的柱坐标为 $(r, \\theta, z) = (${r}, ${th}, ${z})$。求它的 $x$ 坐标。`,
          ),
          answer: ans,
          wrong: [-ans, r, z, ans === 0 ? r / 2 : ans * 2],
          solution: t(`$x = r\\cos\\theta = ${r}\\cos ${th} = ${ans}$.`, `$x = r\\cos\\theta = ${r}\\cos ${th} = ${ans}$。`),
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
  prerequisites: ["cylindrical-polar-coordinates"],
  encompasses: [{ topic: "cylindrical-polar-coordinates", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "identifying-surfaces-given-in-cylindrical-coordinates",
      title: t("Identifying surfaces given in cylindrical coordinates", "识别柱坐标方程所表示的曲面"),
      explanation: t(
        "Common cylindrical surfaces:\n- $r = c$ ($c > 0$): Circular cylinder parallel to the $z$-axis.\n- $z = cr$: Circular cone with apex at the origin.\n- $z = cr^2$: Circular paraboloid opening along the $z$-axis.\n- $\\theta = c$: Vertical half-plane passing through the $z$-axis.",
        "常见柱坐标曲面：\n- $r = c$（$c > 0$）：母线平行于 $z$ 轴的圆柱面。\n- $z = cr$：顶点位于原点的圆锥面。\n- $z = cr^2$：沿 $z$ 轴开口的旋转抛物面。\n- $\\theta = c$：过 $z$ 轴的垂直半平面。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(2, 15);
        const type = rng.int(0, 3);

        let eq: string;
        let right: Text;
        let wrong: readonly Text[];
        let sol: Text;

        if (type === 0) {
          eq = `r = ${c}`;
          right = t("Circular cylinder", "圆柱面");
          wrong = [t("Circular cone", "圆锥面"), t("Circular paraboloid", "旋转抛物面"), t("Sphere", "球面")];
          sol = t(
            `$r = ${c} \\iff x^2 + y^2 = ${c * c}$, which is a circular cylinder of radius $${c}$ around the $z$-axis.`,
            `$r = ${c} \\iff x^2 + y^2 = ${c * c}$，表示以 $z$ 轴为对称轴、半径为 ${c} 的圆柱面。`,
          );
        } else if (type === 1) {
          eq = `z = ${c}r`;
          right = t("Circular cone", "圆锥面");
          wrong = [t("Circular cylinder", "圆柱面"), t("Circular paraboloid", "旋转抛物面"), t("Plane", "平面")];
          sol = t(
            `$z = ${c}r \\iff z^2 = ${c * c}(x^2 + y^2)$ (for $z \\ge 0$), which is a circular cone with vertex at the origin.`,
            `$z = ${c}r \\iff z^2 = ${c * c}(x^2 + y^2)$（$z \\ge 0$），表示顶点位于原点的上半圆锥面。`,
          );
        } else if (type === 2) {
          eq = `z = ${c}r^2`;
          right = t("Circular paraboloid", "旋转抛物面");
          wrong = [t("Circular cylinder", "圆柱面"), t("Circular cone", "圆锥面"), t("Hyperboloid", "双曲面")];
          sol = t(
            `$z = ${c}r^2 \\iff z = ${c}(x^2 + y^2)$, which is a circular paraboloid opening upwards along the $z$-axis.`,
            `$z = ${c}r^2 \\iff z = ${c}(x^2 + y^2)$，表示沿 $z$ 轴向上开口的旋转抛物面。`,
          );
        } else {
          eq = `\\theta = \\frac{\\pi}{${c}}`;
          right = t("Vertical half-plane", "垂直半平面");
          wrong = [t("Circular cylinder", "圆柱面"), t("Circular cone", "圆锥面"), t("Sphere", "球面")];
          sol = t(
            `$\\theta = \\frac{\\pi}{${c}}$ defines a vertical half-plane emanating from the $z$-axis at constant azimuth angle.`,
            `$\\theta = \\frac{\\pi}{${c}}$ 表示由 $z$ 轴出发、方位角恒定的垂直半平面。`,
          );
        }

        const prompt = t(
          `Identify the geometric surface represented by the cylindrical coordinate equation $${eq}$.`,
          `识别由柱坐标方程 $${eq}$ 所表示的几何曲面。`,
        );
        const solution = t(
          `The equation represents a ${right.en.toLowerCase()} because ${sol.en}`,
          `该方程表示一个${right["zh-CN"]}，因为${sol["zh-CN"]}`,
        );
        return pickChoice(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "writing-cartesian-surfaces-in-cylindrical-coordinates",
      title: t("Writing Cartesian surfaces in cylindrical coordinates", "把直角坐标曲面写成柱坐标"),
      explanation: t(
        "To convert a surface to cylindrical coordinates, replace $x^2 + y^2$ by $r^2$ and leave $z$ unchanged. For example, the cylinder $x^2 + y^2 = a^2$ becomes $r = a$, the paraboloid $z = k(x^2 + y^2)$ becomes $z = kr^2$, and the sphere $x^2 + y^2 + z^2 = a^2$ becomes $r^2 + z^2 = a^2$. A cone $z = k\\sqrt{x^2 + y^2}$ becomes $z = kr$, since $r \\ge 0$.",
        "把曲面化为柱坐标时，用 $r^2$ 替换 $x^2 + y^2$，$z$ 不变。例如圆柱面 $x^2 + y^2 = a^2$ 变为 $r = a$，抛物面 $z = k(x^2 + y^2)$ 变为 $z = kr^2$，球面 $x^2 + y^2 + z^2 = a^2$ 变为 $r^2 + z^2 = a^2$。锥面 $z = k\\sqrt{x^2 + y^2}$ 变为 $z = kr$，因为 $r \\ge 0$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 9);
        const kind = rng.int(1, 4);
        const opt = (s: string) => t(`$${s}$`, `$${s}$`);
        const cart = [`x^2 + y^2 = ${a * a}`, `z = ${a}(x^2 + y^2)`, `x^2 + y^2 + z^2 = ${a * a}`, `z = ${a}\\sqrt{x^2 + y^2}`][kind - 1]!;
        const right = [`r = ${a}`, `z = ${a}r^2`, `r^2 + z^2 = ${a * a}`, `z = ${a}r`][kind - 1]!;
        const wrong = [
          [`r = ${a * a}`, `r^2 = ${a}`, `\\theta = ${a}`],
          [`z = ${a}r`, `z^2 = ${a}r^2`, `r = ${a}z^2`],
          [`r + z = ${a}`, `r^2 = ${a * a}`, `r^2 + z^2 = ${a}`],
          [`z = ${a}r^2`, `z^2 = ${a}r`, `r = ${a}z`],
        ][kind - 1]!;
        return pickChoice(
          rng,
          t(`Write the surface $${cart}$ in cylindrical coordinates.`, `把曲面 $${cart}$ 写成柱坐标方程。`),
          opt(right),
          wrong.map(opt),
          t(
            `Replace $x^2 + y^2$ by $r^2$ (and $\\sqrt{x^2 + y^2}$ by $r$) to get $${right}$.`,
            `用 $r^2$ 替换 $x^2 + y^2$（用 $r$ 替换 $\\sqrt{x^2 + y^2}$），得 $${right}$。`,
          ),
        );
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
  prerequisites: ["the-jacobian-of-a-three-dimensional-transformation"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "converting-cartesian-points-to-spherical-coordinates",
      title: t("Converting Cartesian points to spherical coordinates", "将直角坐标转换为球面坐标"),
      explanation: t(
        "For a point $(x, y, z)$, the spherical radial distance is $\\rho = \\sqrt{x^2 + y^2 + z^2}$, the polar angle is $\\cos\\phi = \\frac{z}{\\rho}$, and the azimuthal angle is $\\tan\\theta = \\frac{y}{x}$.",
        "对于空间点 $(x, y, z)$，其球面径向距离为 $\\rho = \\sqrt{x^2 + y^2 + z^2}$，极角满足 $\\cos\\phi = \\frac{z}{\\rho}$，方位角满足 $\\tan\\theta = \\frac{y}{x}$。",
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

        const prompt = t(
          `Find the spherical radial distance $\\rho$ for the point with Cartesian coordinates $(${x}, ${y}, ${z})$.`,
          `求直角坐标为 $(${x}, ${y}, ${z})$ 的点在球面坐标系下的径向距离 $\\rho$。`,
        );
        const solution = t(
          steps(
            `The spherical radial distance is $\\rho = \\sqrt{x^2 + y^2 + z^2}$.`,
            `Substitute $x = ${x}$, $y = ${y}$, $z = ${z}$:\n\n$$\\rho = \\sqrt{(${x})^2 + (${y})^2 + (${z})^2} = \\sqrt{${x * x} + ${y * y} + ${z * z}} = \\sqrt{${ans * ans}} = ${ans}.$$`,
          ),
          steps(
            `球面径向距离公式为 $\\rho = \\sqrt{x^2 + y^2 + z^2}$。`,
            `代入 $x = ${x}$、$y = ${y}$、$z = ${z}$：\n\n$$\\rho = \\sqrt{(${x})^2 + (${y})^2 + (${z})^2} = \\sqrt{${x * x} + ${y * y} + ${z * z}} = \\sqrt{${ans * ans}} = ${ans}。$$`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [ans * ans, x + y + z, ans + 2],
        });
      },
    },
    {
      id: "finding-the-polar-angle-phi-of-a-point",
      title: t("Finding the angle $\\varphi$ of a point", "求点的极角 $\\varphi$"),
      explanation: t(
        "In spherical coordinates $\\varphi$ is the angle from the positive $z$-axis, with $0 \\le \\varphi \\le \\pi$, and $\\cos\\varphi = \\frac{z}{\\rho}$. A useful shortcut compares $z$ with $r = \\sqrt{x^2 + y^2}$: if $z = r$ then $\\varphi = \\frac{\\pi}{4}$, if $z = 0$ then $\\varphi = \\frac{\\pi}{2}$, and if $z = -r$ then $\\varphi = \\frac{3\\pi}{4}$.",
        "在球坐标中，$\\varphi$ 是与 $z$ 轴正方向的夹角，$0 \\le \\varphi \\le \\pi$，且 $\\cos\\varphi = \\frac{z}{\\rho}$。一个实用的捷径是比较 $z$ 与 $r = \\sqrt{x^2 + y^2}$：若 $z = r$ 则 $\\varphi = \\frac{\\pi}{4}$，若 $z = 0$ 则 $\\varphi = \\frac{\\pi}{2}$，若 $z = -r$ 则 $\\varphi = \\frac{3\\pi}{4}$。",
      ),
      generate(rng: Rng): Problem {
        const [a, b, c] = rng.pick(pythagoreanTriples);
        const x = a * rng.pick([-1, 1]);
        const y = b * rng.pick([-1, 1]);
        const kind = rng.int(0, 2);
        const z = [c, 0, -c][kind]!;
        const angles = ["\\frac{\\pi}{4}", "\\frac{\\pi}{2}", "\\frac{3\\pi}{4}"];
        const opt = (s: string) => t(`$${s}$`, `$${s}$`);
        const rho = kind === 1 ? `${c}` : `${c}\\sqrt{2}`;
        return pickChoice(
          rng,
          t(`Find the spherical angle $\\varphi$ of the point $(${x}, ${y}, ${z})$.`, `求点 $(${x}, ${y}, ${z})$ 的球坐标角 $\\varphi$。`),
          opt(angles[kind]!),
          [...angles.filter((_, i) => i !== kind), kind === 1 ? "\\frac{\\pi}{3}" : "0"].map(opt),
          t(
            `$r = \\sqrt{${a * a} + ${b * b}} = ${c}$ and $\\rho = ${rho}$, so $\\cos\\varphi = \\frac{${z}}{${rho}}$ and $\\varphi = ${angles[kind]}$.`,
            `$r = \\sqrt{${a * a} + ${b * b}} = ${c}$，$\\rho = ${rho}$，所以 $\\cos\\varphi = \\frac{${z}}{${rho}}$，$\\varphi = ${angles[kind]}$。`,
          ),
        );
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
  prerequisites: ["spherical-polar-coordinates"],
  encompasses: [{ topic: "spherical-polar-coordinates", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "identifying-surfaces-given-in-spherical-coordinates",
      title: t("Identifying surfaces given in spherical coordinates", "识别球面坐标方程所表示的曲面"),
      explanation: t(
        "Standard spherical surfaces:\n- $\\rho = c$ ($c > 0$): Sphere of radius $c$ centered at the origin.\n- $\\phi = c$ ($0 < c < \\pi/2$): Circular cone with opening angle $c$ around the positive $z$-axis.\n- $\\theta = c$: Vertical half-plane.",
        "常见球面坐标曲面：\n- $\\rho = c$（$c > 0$）：以原点为中心、半径为 $c$ 的球面。\n- $\\phi = c$（$0 < c < \\pi/2$）：以正 $z$ 轴为对称轴、半顶角为 $c$ 的圆锥面。\n- $\\theta = c$：过 $z$ 轴的垂直半平面。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(2, 15);
        const type = rng.int(0, 2);

        let eq: string;
        let right: Text;
        let wrong: readonly Text[];
        let sol: Text;

        if (type === 0) {
          eq = `\\rho = ${c}`;
          right = t("Sphere", "球面");
          wrong = [t("Circular cone", "圆锥面"), t("Circular cylinder", "圆柱面"), t("Paraboloid", "抛物面")];
          sol = t(
            `$\\rho = ${c} \\iff x^2 + y^2 + z^2 = ${c * c}$, which is a sphere of radius $${c}$ centered at the origin.`,
            `$\\rho = ${c} \\iff x^2 + y^2 + z^2 = ${c * c}$，表示以原点为中心、半径为 ${c} 的球面。`,
          );
        } else if (type === 1) {
          eq = `\\phi = \\frac{\\pi}{${c}}`;
          right = t("Circular cone", "圆锥面");
          wrong = [t("Sphere", "球面"), t("Circular cylinder", "圆柱面"), t("Plane", "平面")];
          sol = t(
            `$\\phi = \\frac{\\pi}{${c}}$ defines a cone with vertex at the origin and half-angle $\\frac{\\pi}{${c}}$ from the positive $z$-axis.`,
            `$\\phi = \\frac{\\pi}{${c}}$ 表示顶点位于原点、与正 $z$ 轴夹角恒为 $\\frac{\\pi}{${c}}$ 的圆锥面。`,
          );
        } else {
          eq = `\\theta = \\frac{\\pi}{${c}}`;
          right = t("Vertical half-plane", "垂直半平面");
          wrong = [t("Sphere", "球面"), t("Circular cone", "圆锥面"), t("Cylinder", "柱面")];
          sol = t(
            `$\\theta = \\frac{\\pi}{${c}}$ is a vertical half-plane passing through the $z$-axis.`,
            `$\\theta = \\frac{\\pi}{${c}}$ 表示过 $z$ 轴的垂直半平面。`,
          );
        }

        const prompt = t(
          `Identify the geometric surface represented by the spherical coordinate equation $${eq}$.`,
          `识别由球面坐标方程 $${eq}$ 所表示的几何曲面。`,
        );
        const solution = t(
          `The equation represents a ${right.en.toLowerCase()} because ${sol.en}`,
          `该方程表示一个${right["zh-CN"]}，因为${sol["zh-CN"]}`,
        );
        return pickChoice(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "spheres-through-the-origin-in-spherical-coordinates",
      title: t("Spheres through the origin in spherical coordinates", "球坐标中过原点的球面"),
      explanation: t(
        "Multiplying $\\rho = k\\cos\\varphi$ by $\\rho$ gives $\\rho^2 = k\\rho\\cos\\varphi$, that is $x^2 + y^2 + z^2 = kz$. Completing the square gives $x^2 + y^2 + \\left(z - \\frac{k}{2}\\right)^2 = \\frac{k^2}{4}$, a sphere of radius $\\frac{k}{2}$ through the origin. In the same way $\\rho = k\\sin\\varphi\\cos\\theta$ is $x^2 + y^2 + z^2 = kx$ and $\\rho = k\\sin\\varphi\\sin\\theta$ is $x^2 + y^2 + z^2 = ky$, also spheres of radius $\\frac{k}{2}$.",
        "把 $\\rho = k\\cos\\varphi$ 两边乘以 $\\rho$ 得 $\\rho^2 = k\\rho\\cos\\varphi$，即 $x^2 + y^2 + z^2 = kz$。配方得 $x^2 + y^2 + \\left(z - \\frac{k}{2}\\right)^2 = \\frac{k^2}{4}$，是过原点、半径为 $\\frac{k}{2}$ 的球面。同理，$\\rho = k\\sin\\varphi\\cos\\theta$ 即 $x^2 + y^2 + z^2 = kx$，$\\rho = k\\sin\\varphi\\sin\\theta$ 即 $x^2 + y^2 + z^2 = ky$，也都是半径为 $\\frac{k}{2}$ 的球面。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(1, 10);
        const kind = rng.int(0, 2);
        const form = ["\\cos\\varphi", "\\sin\\varphi\\cos\\theta", "\\sin\\varphi\\sin\\theta"][kind]!;
        const v = ["z", "x", "y"][kind]!;
        const ans = Q.of(k, 2);
        return numberProblem({
          prompt: t(
            `The surface $\\rho = ${k === 1 ? "" : k}${form}$ is a sphere. Find its radius.`,
            `曲面 $\\rho = ${k === 1 ? "" : k}${form}$ 是一个球面。求其半径。`,
          ),
          answer: ans,
          wrong: [Q.of(k), Q.of(k * k, 4), Q.of(k, 4), Q.of(2 * k)],
          solution: t(
            `Multiplying by $\\rho$ gives $x^2 + y^2 + z^2 = ${k === 1 ? "" : k}${v}$. Completing the square in $${v}$ gives radius $\\frac{${k}}{2}${ans.isInteger() ? ` = ${ans.toLatex()}` : ""}$.`,
            `两边乘以 $\\rho$ 得 $x^2 + y^2 + z^2 = ${k === 1 ? "" : k}${v}$。对 $${v}$ 配方得半径为 $\\frac{${k}}{2}${ans.isInteger() ? ` = ${ans.toLatex()}` : ""}$。`,
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
  prerequisites: ["surfaces-in-cylindrical-polar-coordinates", "changing-the-order-of-integration-in-triple-integrals-changing-region"],
  encompasses: [
    {
      topic: "surfaces-in-cylindrical-polar-coordinates",
      weight: 0.3,
    },
    {
      topic: "changing-the-order-of-integration-in-triple-integrals-changing-region",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "volume-of-cylindrical-solid-via-triple-integral",
      title: t("Volume of cylindrical solid via triple integral", "利用柱坐标三重积分计算圆柱体体积"),
      explanation: t(
        "In cylindrical coordinates a cylinder has constant limits for all three variables, and the extra factor of the radius gives the familiar volume formula. For a cylinder bounded by $r \\le R$ and $0 \\le z \\le H$, the volume divided by $\\pi$ is:\n\n$$\\frac{\\text{Vol}(E)}{\\pi} = \\frac{1}{\\pi}\\int_0^{2\\pi} \\int_0^R \\int_0^H r\\,dz\\,dr\\,d\\theta = R^2 H.$$",
        "在柱坐标中，圆柱体三个变量的积分限都是常数，多出的半径因子给出熟悉的体积公式。对于由 $r \\le R$ 与 $0 \\le z \\le H$ 所界定的圆柱体，其体积除以 $\\pi$ 为：\n\n$$\\frac{\\text{Vol}(E)}{\\pi} = \\frac{1}{\\pi}\\int_0^{2\\pi} \\int_0^R \\int_0^H r\\,dz\\,dr\\,d\\theta = R^2 H。$$",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(2, 10);
        const H = rng.int(2, 12);
        const ans = R * R * H;

        const prompt = t(
          `Use cylindrical coordinates to evaluate $\\frac{1}{\\pi} \\iiint_E 1\\,dV$ for the solid cylinder $E$ bounded by $x^2 + y^2 \\le ${R * R}$ and $0 \\le z \\le ${H}$.`,
          `利用柱坐标系计算实心圆柱体 $E: x^2 + y^2 \\le ${R * R}, 0 \\le z \\le ${H}$ 的体积与 $\\pi$ 的比值 $\\frac{1}{\\pi} \\iiint_E 1\\,dV$。`,
        );
        const solution = t(
          steps(
            `In cylindrical coordinates, $x^2 + y^2 \\le ${R * R} \\iff 0 \\le r \\le ${R}$.`,
            `The volume element is $dV = r\\,dz\\,dr\\,d\\theta$.`,
            `Set up the integral: $\\iiint_E 1\\,dV = \\int_0^{2\\pi} d\\theta \\int_0^{${R}} r\\,dr \\int_0^{${H}} dz = 2\\pi \\cdot \\frac{${R * R}}{2} \\cdot ${H} = \\pi \\cdot ${ans}$.`,
            `Dividing by $\\pi$ yields $${ans}$.`,
          ),
          steps(
            `在柱坐标下，$x^2 + y^2 \\le ${R * R} \\iff 0 \\le r \\le ${R}$。`,
            `体积微元为 $dV = r\\,dz\\,dr\\,d\\theta$。`,
            `建立积分：$\\iiint_E 1\\,dV = \\int_0^{2\\pi} d\\theta \\int_0^{${R}} r\\,dr \\int_0^{${H}} dz = 2\\pi \\cdot \\frac{${R * R}}{2} \\cdot ${H} = \\pi \\cdot ${ans}$。`,
            `除以 $\\pi$ 得到 $${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [R * H, 2 * ans, ans + R * R],
        });
      },
    },
    {
      id: "integrating-x-squared-plus-y-squared-over-a-cylinder",
      title: t("Integrating $x^2 + y^2$ over a cylinder", "在圆柱体上积分 $x^2 + y^2$"),
      explanation: t(
        "In cylindrical coordinates $x^2 + y^2 = r^2$ and $dV = r\\,dz\\,dr\\,d\\theta$. Over the solid cylinder $r \\le R$, $0 \\le z \\le H$:\n\n$$\\iiint_E (x^2 + y^2)\\,dV = \\int_0^{2\\pi} \\int_0^R \\int_0^H r^2 \\cdot r\\,dz\\,dr\\,d\\theta = 2\\pi \\cdot \\frac{R^4}{4} \\cdot H = \\frac{\\pi R^4H}{2}.$$\n\nThis is the moment of inertia of the cylinder about its axis.",
        "在柱坐标中 $x^2 + y^2 = r^2$，$dV = r\\,dz\\,dr\\,d\\theta$。在实心圆柱 $r \\le R$，$0 \\le z \\le H$ 上：\n\n$$\\iiint_E (x^2 + y^2)\\,dV = \\int_0^{2\\pi} \\int_0^R \\int_0^H r^2 \\cdot r\\,dz\\,dr\\,d\\theta = 2\\pi \\cdot \\frac{R^4}{4} \\cdot H = \\frac{\\pi R^4H}{2}。$$\n\n这就是圆柱体绕其轴的转动惯量。",
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
          wrong: [Q.of(2 * R ** 3 * H, 3), Q.of(R ** 4 * H), Q.of(R * R * H), Q.of(R ** 4 * H, 4)],
          solution: t(
            `$\\int_0^{2\\pi} \\int_0^{${R}} \\int_0^{${H}} r^3\\,dz\\,dr\\,d\\theta = 2\\pi \\cdot \\frac{${R ** 4}}{4} \\cdot ${H}$. Dividing by $\\pi$ gives $${ans.toLatex()}$.`,
            `$\\int_0^{2\\pi} \\int_0^{${R}} \\int_0^{${H}} r^3\\,dz\\,dr\\,d\\theta = 2\\pi \\cdot \\frac{${R ** 4}}{4} \\cdot ${H}$。除以 $\\pi$ 得 $${ans.toLatex()}$。`,
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
  prerequisites: ["surfaces-in-spherical-polar-coordinates", "triple-integrals-in-cylindrical-polar-coordinates"],
  encompasses: [
    {
      topic: "surfaces-in-spherical-polar-coordinates",
      weight: 0.3,
    },
    {
      topic: "triple-integrals-in-cylindrical-polar-coordinates",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "volume-of-spherical-ball-via-triple-integral",
      title: t("Volume of spherical ball via triple integral", "利用球面坐标三重积分计算球体体积"),
      explanation: t(
        "In spherical coordinates a ball has constant limits, and the volume element includes the square of the distance times the sine of the polar angle. For a sphere of radius $R$ ($\\rho \\le R$):\n\n$$\\frac{\\text{Vol}(B)}{\\pi} = \\frac{1}{\\pi}\\int_0^{2\\pi} \\int_0^\\pi \\int_0^R \\rho^2\\sin\\phi\\,d\\rho\\,d\\phi\\,d\\theta = \\frac{4}{3}R^3.$$",
        "在球坐标中，球体的积分限都是常数，体积微元包含距离的平方乘以极角的正弦。对于半径为 $R$ 的球体（$\\rho \\le R$）：\n\n$$\\frac{\\text{Vol}(B)}{\\pi} = \\frac{1}{\\pi}\\int_0^{2\\pi} \\int_0^\\pi \\int_0^R \\rho^2\\sin\\phi\\,d\\rho\\,d\\phi\\,d\\theta = \\frac{4}{3}R^3。$$",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(2, 35);
        const ans = Q.of(4 * R * R * R, 3);

        const prompt = t(
          `Use spherical coordinates to evaluate $\\frac{1}{\\pi} \\iiint_B 1\\,dV$ for the solid sphere $B: x^2 + y^2 + z^2 \\le ${R * R}$.`,
          `利用球面坐标系计算球体 $B: x^2 + y^2 + z^2 \\le ${R * R}$ 的体积与 $\\pi$ 的比值 $\\frac{1}{\\pi} \\iiint_B 1\\,dV$。`,
        );
        const solution = t(
          steps(
            `In spherical coordinates, the limits for the ball are $0 \\le \\rho \\le ${R}$, $0 \\le \\phi \\le \\pi$, and $0 \\le \\theta \\le 2\\pi$.`,
            `The volume element is $dV = \\rho^2 \\sin\\phi\\,d\\rho\\,d\\phi\\,d\\theta$.`,
            `Evaluate the triple integral:\n\n$$\\iiint_B 1\\,dV = \\left(\\int_0^{2\\pi} d\\theta\\right)\\left(\\int_0^\\pi \\sin\\phi\\,d\\phi\\right)\\left(\\int_0^{${R}} \\rho^2\\,d\\rho\\right) = 2\\pi \\times 2 \\times \\frac{${R}^3}{3} = \\frac{4\\pi}{3}(${R * R * R}) = \\pi \\cdot ${ans.toLatex()}.$$ `,
            `Dividing by $\\pi$ yields $${ans.toLatex()}$.`,
          ),
          steps(
            `在球面坐标下，整球的积分限为 $0 \\le \\rho \\le ${R}$、$0 \\le \\phi \\le \\pi$ 与 $0 \\le \\theta \\le 2\\pi$。`,
            `体积微元为 $dV = \\rho^2 \\sin\\phi\\,d\\rho\\,d\\phi\\,d\\theta$。`,
            `计算三重积分：\n\n$$\\iiint_B 1\\,dV = \\left(\\int_0^{2\\pi} d\\theta\\right)\\left(\\int_0^\\pi \\sin\\phi\\,d\\phi\\right)\\left(\\int_0^{${R}} \\rho^2\\,d\\rho\\right) = 2\\pi \\times 2 \\times \\frac{${R}^3}{3} = \\frac{4\\pi}{3}(${R * R * R}) = \\pi \\cdot ${ans.toLatex()}。$$ `,
            `除以 $\\pi$ 得到 $${ans.toLatex()}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.of(R * R * R, 3), ans.mul(Q.of(2)), ans.div(Q.of(2))],
        });
      },
    },
    {
      id: "integrating-the-squared-distance-over-a-ball",
      title: t("Integrating the squared distance over a ball", "在球体上积分距离的平方"),
      explanation: t(
        "In spherical coordinates $x^2 + y^2 + z^2 = \\rho^2$ and $dV = \\rho^2\\sin\\varphi\\,d\\rho\\,d\\varphi\\,d\\theta$. Over the ball $\\rho \\le R$ the angular integrals give $\\int_0^{2\\pi}\\int_0^{\\pi} \\sin\\varphi\\,d\\varphi\\,d\\theta = 4\\pi$, so\n\n$$\\iiint_B c(x^2 + y^2 + z^2)\\,dV = 4\\pi c\\int_0^R \\rho^4\\,d\\rho = \\frac{4\\pi cR^5}{5}.$$\n\nThe factor $4\\pi$ is the total solid angle around the origin, and the extra $\\rho^2$ from the volume element raises the power of $\\rho$ from $2$ to $4$.",
        "在球坐标中 $x^2 + y^2 + z^2 = \\rho^2$，$dV = \\rho^2\\sin\\varphi\\,d\\rho\\,d\\varphi\\,d\\theta$。在球体 $\\rho \\le R$ 上，角度积分为 $\\int_0^{2\\pi}\\int_0^{\\pi} \\sin\\varphi\\,d\\varphi\\,d\\theta = 4\\pi$，所以\n\n$$\\iiint_B c(x^2 + y^2 + z^2)\\,dV = 4\\pi c\\int_0^R \\rho^4\\,d\\rho = \\frac{4\\pi cR^5}{5}。$$\n\n因子 $4\\pi$ 是绕原点的全部立体角，体积元中额外的 $\\rho^2$ 把 $\\rho$ 的次数从 $2$ 提高到 $4$。",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(1, 5);
        const c = rng.int(1, 6);
        const ans = Q.of(4 * c * R ** 5, 5);
        return numberProblem({
          prompt: t(
            `$B$ is the ball $x^2 + y^2 + z^2 \\le ${R * R}$. Find $\\frac{1}{\\pi}\\iiint_B ${c === 1 ? "" : c}(x^2 + y^2 + z^2)\\,dV$.`,
            `$B$ 是球体 $x^2 + y^2 + z^2 \\le ${R * R}$。求 $\\frac{1}{\\pi}\\iiint_B ${c === 1 ? "" : c}(x^2 + y^2 + z^2)\\,dV$。`,
          ),
          answer: ans,
          wrong: [Q.of(4 * c * R ** 3, 3), Q.of(c * R ** 4), Q.of(2 * c * R ** 5, 5), Q.of(4 * c * R ** 4, 5)],
          solution: t(
            `The angular integrals give $4\\pi$ and $\\int_0^{${R}} ${c === 1 ? "" : c}\\rho^4\\,d\\rho = \\frac{${c} \\cdot ${R ** 5}}{5}$. Dividing $4\\pi \\cdot \\frac{${c * R ** 5}}{5}$ by $\\pi$ gives $${ans.toLatex()}$.`,
            `角度积分为 $4\\pi$，且 $\\int_0^{${R}} ${c === 1 ? "" : c}\\rho^4\\,d\\rho = \\frac{${c} \\cdot ${R ** 5}}{5}$。把 $4\\pi \\cdot \\frac{${c * R ** 5}}{5}$ 除以 $\\pi$ 得 $${ans.toLatex()}$。`,
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
        "Scaling each coordinate turns the ellipsoid into a unit ball, so its volume is the volume of the ball times the product of the three scale factors. The ellipsoid $E: \\frac{x^2}{a^2} + \\frac{y^2}{b^2} + \\frac{z^2}{c^2} \\le 1$ transforms to the unit ball under $x = au, y = bv, z = cw$ with Jacobian $J = abc$. The volume is $\\text{Vol}(E) = \\frac{4}{3}\\pi abc$.",
        "对每个坐标进行缩放把椭球体变成单位球，所以它的体积等于球的体积乘以三个缩放比例的乘积。作伸缩变换 $x = au, y = bv, z = cw$，椭球体 $E: \\frac{x^2}{a^2} + \\frac{y^2}{b^2} + \\frac{z^2}{c^2} \\le 1$ 转化为单位球体，其雅可比行列式为 $J = abc$。因此椭球体体积为 $\\text{Vol}(E) = \\frac{4}{3}\\pi abc$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 6);
        const b = rng.int(2, 6);
        const c = rng.int(2, 6);
        const prod = a * b * c;
        const ans = Q.of(4 * prod, 3);

        const prompt = t(
          `Find the value of $\\frac{\\text{Vol}(E)}{\\pi}$ for the solid ellipsoid $E: \\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} + \\frac{z^2}{${c * c}} \\le 1$.`,
          `计算实心椭球体 $E: \\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} + \\frac{z^2}{${c * c}} \\le 1$ 的体积与 $\\pi$ 的比值 $\\frac{\\text{Vol}(E)}{\\pi}$。`,
        );
        const solution = t(
          steps(
            `Apply the transformation $x = ${a}u, y = ${b}v, z = ${c}w$. The region becomes the unit ball $B: u^2 + v^2 + w^2 \\le 1$.`,
            `The Jacobian determinant is $J = \\begin{vmatrix} ${a} & 0 & 0 \\\\ 0 & ${b} & 0 \\\\ 0 & 0 & ${c} \\end{vmatrix} = ${a} \\times ${b} \\times ${c} = ${prod}$.`,
            `Compute the volume: $\\text{Vol}(E) = \\iiint_B |J|\\,du\\,dv\\,dw = ${prod} \\times \\text{Vol}(B) = ${prod}\\left(\\frac{4}{3}\\pi \\cdot 1^3\\right) = \\pi \\cdot ${ans.toLatex()}$.`,
            `Dividing by $\\pi$ yields $${ans.toLatex()}$.`,
          ),
          steps(
            `作变量代换 $x = ${a}u, y = ${b}v, z = ${c}w$，椭球体转化为单位球体 $B: u^2 + v^2 + w^2 \\le 1$。`,
            `雅可比行列式为 $J = \\begin{vmatrix} ${a} & 0 & 0 \\\\ 0 & ${b} & 0 \\\\ 0 & 0 & ${c} \\end{vmatrix} = ${a} \\times ${b} \\times ${c} = ${prod}$。`,
            `计算体积：$\\text{Vol}(E) = \\iiint_B |J|\\,du\\,dv\\,dw = ${prod} \\times \\text{Vol}(B) = ${prod}\\left(\\frac{4}{3}\\pi \\cdot 1^3\\right) = \\pi \\cdot ${ans.toLatex()}$。`,
            `除以 $\\pi$ 得到 $${ans.toLatex()}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.of(prod, 3), ans.mul(Q.of(2)), Q.of(4 * prod)],
        });
      },
    },
    {
      id: "the-volume-of-a-parallelepiped-by-a-linear-change-of-variables",
      title: t("The volume of a parallelepiped by a change of variables", "用变量替换求平行六面体体积"),
      explanation: t(
        "A solid $\\{0 \\le u \\le U,\\ 0 \\le v \\le V,\\ 0 \\le w \\le W\\}$, where $u, v, w$ are linear in $x, y, z$, is a parallelepiped. The substitution maps it to a box of volume $UVW$, and $dV = \\left|\\frac{\\partial(u, v, w)}{\\partial(x, y, z)}\\right|^{-1} du\\,dv\\,dw$. So the volume is $\\frac{UVW}{|J|}$, where $J$ is the determinant of the coefficient matrix. For a triangular coefficient matrix $J$ is the product of the diagonal entries.",
        "若 $u, v, w$ 是 $x, y, z$ 的线性函数，则立体 $\\{0 \\le u \\le U,\\ 0 \\le v \\le V,\\ 0 \\le w \\le W\\}$ 是平行六面体。替换把它映成体积为 $UVW$ 的长方体，且 $dV = \\left|\\frac{\\partial(u, v, w)}{\\partial(x, y, z)}\\right|^{-1} du\\,dv\\,dw$。所以体积为 $\\frac{UVW}{|J|}$，其中 $J$ 是系数矩阵的行列式。系数矩阵为三角矩阵时，$J$ 等于对角元素之积。",
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
          wrong: [Q.of(U * V * W * J), Q.of(U * V * W), Q.of(U * V * W, d1 + d2 + d3), Q.of(U * V * W, 6)],
          solution: t(
            `The coefficient matrix is triangular with determinant $J = ${d1} \\cdot ${d2} \\cdot ${d3} = ${J}$. So the volume is $\\frac{${U} \\cdot ${V} \\cdot ${W}}{${J}} = ${ans.toLatex()}$.`,
            `系数矩阵为三角矩阵，行列式 $J = ${d1} \\cdot ${d2} \\cdot ${d3} = ${J}$。所以体积为 $\\frac{${U} \\cdot ${V} \\cdot ${W}}{${J}} = ${ans.toLatex()}$。`,
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
