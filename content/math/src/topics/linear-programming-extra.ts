// The rest of a first course in Linear Programming: polyhedra, anti-cycling, bounded variables, complexity,
// modeling techniques, post-optimal analysis, starting plans, network and integer methods, and large programs.

import type { TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import { ask, choose, point, topic } from "../university-kit.ts";
import { drawn } from "./figure-reading-more.ts";
import { arcsFigure } from "./linear-programming-more.ts";

/** binomial computes a small binomial coefficient exactly. */
const binomial = (n: number, k: number): number => {
  let r = 1;
  for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1);
  return r;
};

/** permutationsOf3 lists the six assignments of three workers to three jobs. */
const permutationsOf3 = [
  [0, 1, 2],
  [0, 2, 1],
  [1, 0, 2],
  [1, 2, 0],
  [2, 0, 1],
  [2, 1, 0],
] as const;

const polyhedra = topic(
  "polyhedra-and-extreme-points",
  ["Polyhedra and Extreme Points", "多面体和极点"],
  ["Connect corners of the feasible region with basic solutions, and count them.", "把可行域的角点与基本解联系起来，并计算它们的个数。"],
  ["basic-feasible-solutions", "convex-sets-and-convex-combinations"],
  [],
  [
    point(
      "counting-basic-solutions",
      ["Counting basic solutions", "计算基本解的个数"],
      [
        "A system with $m$ equations and $n$ variables picks $m$ basic columns, so there are at most $\\binom{n}{m}$ basic solutions. This finite count is why the search for an optimal corner must end.",
        "有 $m$ 个方程和 $n$ 个变量的方程组选 $m$ 个基本列，所以至多有 $\\binom{n}{m}$ 个基本解。这个有限的个数就是寻找最优角点必然结束的原因。",
      ],
      (rng) => {
        const m = rng.int(2, 7);
        const n = m + rng.int(1, 8);
        const v = binomial(n, m);
        return ask(
          [
            `A standard form program has ${m} equations and ${n} variables. At most how many basic solutions does it have?`,
            `标准形式的规划有 ${m} 个方程和 ${n} 个变量。它至多有多少个基本解？`,
          ],
          v,
          [n * m, 2 ** n === v ? v + 1 : 2 ** n, binomial(n, m - 1) === v ? v + 2 : binomial(n, m - 1)],
          [
            `Choose which ${m} of the ${n} columns are basic, which gives $\\binom{${n}}{${m}}$ choices.`,
            `从 ${n} 列中选 ${m} 列作为基本列，有 $\\binom{${n}}{${m}}$ 种选法。`,
          ],
        );
      },
    ),
    point(
      "corners-of-a-box-and-a-simplex",
      ["Corners of a box and a simplex", "长方体和单纯形的角点"],
      [
        "The number of corners can grow fast or slowly. A box in $n$ variables has $2^{n}$ corners with only $2n$ constraints, while a simplex with $n$ nonnegative variables and one sum constraint has $n + 1$.",
        "角点的个数可能增长得快或慢。$n$ 个变量的长方体只有 $2n$ 个约束，却有 $2^{n}$ 个角点，而有 $n$ 个非负变量和一个和约束的单纯形有 $n + 1$ 个角点。",
      ],
      (rng) => {
        const n = rng.int(2, 20);
        const box = rng.bool();
        const u = rng.int(2, 30);
        return ask(
          box
            ? [
                `How many corners does the box $0 \\le x_i \\le ${u}$ have, for $i = 1, \\ldots, ${n}$?`,
                `长方体 $0 \\le x_i \\le ${u}$（$i = 1, \\ldots, ${n}$）有多少个角点？`,
              ]
            : [
                `How many corners does the region $x_i \\ge 0$, $x_1 + \\cdots + x_{${n}} \\le ${u}$ have?`,
                `区域 $x_i \\ge 0$，$x_1 + \\cdots + x_{${n}} \\le ${u}$ 有多少个角点？`,
              ],
          box ? 2 ** n : n + 1,
          box ? [2 * n, n + 1, 2 ** n + 2] : [2 ** n, 2 * n === n + 1 ? n : 2 * n, n],
          box
            ? [`Each of the ${n} coordinates is independently at one of its two bounds.`, `这 ${n} 个坐标各自独立地取两个界之一。`]
            : [`The corners are the origin and one point on each of the ${n} axes.`, `角点是原点和 ${n} 条坐标轴上各一点。`],
        );
      },
    ),
    point(
      "testing-a-point-for-a-corner",
      ["Testing a point for a corner", "判断一点是否是角点"],
      [
        "In two variables, a feasible point is a corner when two independent constraints are tight there. A feasible point with fewer tight constraints is the midpoint of a small segment in the region, so it is not extreme.",
        "在两个变量中，可行点是角点，当且仅当有两个独立约束在那里取等号。取等号的约束更少的可行点是区域内一小段线段的中点，所以不是极点。",
      ],
      (rng) => {
        const s = rng.int(4, 12);
        const kind = rng.int(0, 2);
        const x = rng.int(1, s - 1);
        const [px, py] =
          kind === 0 ? [s, 0] : kind === 1 ? [x, s - x] : [Math.max(1, Math.floor(x / 2)), 1 >= s - Math.floor(x / 2) ? 0 : 1];
        const tight = (px === 0 ? 1 : 0) + (py === 0 ? 1 : 0) + (px + py === s ? 1 : 0);
        const yes: [string, string] = ["Yes, it is a corner", "是，它是角点"];
        const no: [string, string] = ["No, it is not a corner", "不，它不是角点"];
        return choose(
          rng,
          [
            `Is $(${px}, ${py})$ a corner of the region $x \\ge 0$, $y \\ge 0$, $x + y \\le ${s}$?`,
            `$(${px}, ${py})$ 是区域 $x \\ge 0$，$y \\ge 0$，$x + y \\le ${s}$ 的角点吗？`,
          ],
          tight >= 2 ? yes : no,
          [
            tight >= 2 ? no : yes,
            ["Only if the objective is maximized there", "只有当目标函数在那里取最大值时"],
            ["It is outside the region", "它在区域之外"],
          ],
          [
            `Exactly ${tight} of the constraints ${tight === 1 ? "is" : "are"} tight at this point, and a corner needs two.`,
            `在这一点恰有 ${tight} 个约束取等号，而角点需要两个。`,
          ],
          drawn(
            { xMin: -1, xMax: s + 1, yMin: -1, yMax: s + 1, labelEvery: s > 8 ? 2 : 1 },
            [
              {
                kind: "polygon",
                points: [
                  [0, 0],
                  [s, 0],
                  [0, s],
                ],
              },
              { kind: "point", at: [px, py], accent: true },
            ],
            t(
              `The triangle with corners (0, 0), (${s}, 0) and (0, ${s}), with the point (${px}, ${py}) marked.`,
              `顶点为 (0, 0)，(${s}, 0) 和 (0, ${s}) 的三角形，标出了点 (${px}, ${py})。`,
            ),
          ),
        );
      },
    ),
  ],
);

const bland = topic(
  "blands-rule-and-cycling",
  ["Bland's Rule and Cycling", "布兰德法则和循环"],
  [
    "Recognize a degenerate pivot, and use an index rule that guarantees the method stops.",
    "识别退化的主元运算，并使用保证方法停止的下标规则。",
  ],
  ["unboundedness-and-degeneracy"],
  [],
  [
    point(
      "the-entering-variable",
      ["The entering variable", "进基变量"],
      [
        "Dantzig's rule enters the variable with the most negative reduced cost, but with degeneracy it can cycle forever. Bland's rule instead enters the eligible variable with the smallest index, and this prevents any cycle.",
        "丹齐格规则让检验数最负的变量进基，但在退化时它可能永远循环。布兰德法则改为让下标最小的合格变量进基，这样就不会出现循环。",
      ],
      (rng) => {
        const costs = [rng.int(-12, 8), rng.int(-12, 8), rng.int(-12, 8), rng.int(-12, 8), rng.int(-12, 8)];
        const at = rng.int(0, 4);
        costs[at] = -rng.int(1, 12);
        const bland = costs.findIndex((c) => c < 0) + 1;
        const low = Math.min(...costs);
        const dantzig = costs.indexOf(low) + 1;
        const useBland = rng.bool();
        return ask(
          [
            `In a maximization tableau, the reduced costs of $x_1, \\ldots, x_5$ are $${costs.join(", ")}$, and negative ones can enter. Which index enters under ${useBland ? "Bland's rule" : "Dantzig's rule"}?`,
            `在最大化单纯形表中，$x_1, \\ldots, x_5$ 的检验数是 $${costs.join(", ")}$，负的可以进基。按${useBland ? "布兰德法则" : "丹齐格规则"}哪个下标进基？`,
          ],
          useBland ? bland : dantzig,
          useBland
            ? [bland === dantzig ? (bland % 5) + 1 : dantzig, 6, bland === 5 ? 4 : bland + 1]
            : [bland === dantzig ? (bland % 5) + 1 : bland, 6, dantzig === 5 ? 4 : dantzig + 1],
          useBland
            ? [`Bland's rule picks the first negative value, which is at index ${bland}.`, `布兰德法则选第一个负值，它在下标 ${bland} 处。`]
            : [
                `Dantzig's rule picks the most negative value, ${low}, at index ${dantzig}.`,
                `丹齐格规则选最负的值 ${low}，它在下标 ${dantzig} 处。`,
              ],
        );
      },
    ),
    point(
      "breaking-a-tie-for-leaving",
      ["Breaking a tie for leaving", "打破离基的平局"],
      [
        "When the minimum ratio is shared by several rows, Bland's rule removes the basic variable with the smallest index. Ties of this kind are exactly what makes the next basis degenerate, since a basic variable becomes zero.",
        "当几行共享最小比值时，布兰德法则让下标最小的基本变量离基。这种平局正是下一个基退化的原因，因为有基本变量变成零。",
      ],
      (rng) => {
        const r = rng.int(2, 12);
        const idx = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 3) as [number, number, number];
        const pivots = [rng.int(1, 6), rng.int(1, 6), rng.int(1, 6)] as [number, number, number];
        const rhs = [r * pivots[0], r * pivots[1], (r + rng.int(1, 5)) * pivots[2]] as [number, number, number];
        const least = Math.min(idx[0], idx[1]);
        return ask(
          [
            `Rows with basic variables $x_{${idx[0]}}, x_{${idx[1]}}, x_{${idx[2]}}$ have right sides ${rhs.join(", ")} and pivot column entries ${pivots.join(", ")}. Which index leaves under Bland's rule?`,
            `基本变量为 $x_{${idx[0]}}, x_{${idx[1]}}, x_{${idx[2]}}$ 的各行右端是 ${rhs.join(", ")}，主元列的元素是 ${pivots.join(", ")}。按布兰德法则哪个下标离基？`,
          ],
          least,
          [Math.max(idx[0], idx[1]), idx[2], 10],
          [
            `The first two rows tie with the ratio ${r}, and the smaller index among them leaves.`,
            `前两行的比值都是 ${r}，其中较小的下标离基。`,
          ],
        );
      },
    ),
    point(
      "a-degenerate-pivot",
      ["A degenerate pivot", "退化的主元运算"],
      [
        "If the leaving row has right side zero, the entering variable stays at zero. The basis changes but the point and the objective do not, so several consecutive pivots can make no visible progress at all.",
        "如果离基行的右端是零，进基变量仍然是零。基变了，但点和目标值都不变，所以连续几次主元运算可能完全看不到进展。",
      ],
      (rng) => {
        const z = rng.int(10, 300);
        const c = rng.int(1, 15);
        const degenerate = rng.bool();
        const ratio = degenerate ? 0 : rng.int(1, 12);
        return ask(
          [
            `The objective is ${z}, the entering variable has reduced cost $-${c}$, and the minimum ratio is ${ratio}. What is the objective after the pivot?`,
            `目标值是 ${z}，进基变量的检验数是 $-${c}$，最小比值是 ${ratio}。主元运算后目标值是多少？`,
          ],
          z + c * ratio,
          degenerate ? [z + c, z - c, z + 1] : [z - c * ratio, z, z + ratio],
          [
            `The objective rises by the size of the reduced cost times the ratio, here $${c} \\cdot ${ratio}$.`,
            `目标值增加检验数的大小乘比值，这里是 $${c} \\cdot ${ratio}$。`,
          ],
        );
      },
    ),
  ],
);

const boundedVariables = topic(
  "the-simplex-method-with-bounded-variables",
  ["The Simplex Method With Bounded Variables", "带界变量的单纯形法"],
  ["Handle lower and upper bounds without adding rows for them.", "不为上下界增加行就能处理它们。"],
  ["pivoting-in-the-simplex-method"],
  [],
  [
    point(
      "shifting-a-lower-bound",
      ["Shifting a lower bound", "平移下界"],
      [
        "A lower bound $x \\ge l$ disappears when we substitute $x = l + x'$ with $x' \\ge 0$. Each constraint's right side then falls by the coefficient of $x$ times $l$, and the objective gains a constant.",
        "令 $x = l + x'$，$x' \\ge 0$，下界 $x \\ge l$ 就消失了。每个约束的右端减少 $x$ 的系数乘 $l$，目标函数增加一个常数。",
      ],
      (rng) => {
        const a = rng.int(2, 12);
        const b = rng.int(2, 12);
        const l = rng.int(2, 15);
        const r = a * l + rng.int(5, 200);
        return ask(
          [
            `In $${a}x + ${b}y \\le ${r}$ with $x \\ge ${l}$, substitute $x = ${l} + x'$. What is the new right side?`,
            `在 $${a}x + ${b}y \\le ${r}$ 中，$x \\ge ${l}$，代入 $x = ${l} + x'$。新的右端是多少？`,
          ],
          r - a * l,
          [r + a * l, r - l, r - b * l],
          [
            `Move $${a} \\cdot ${l}$ across the inequality, away from the right side.`,
            `把 $${a} \\cdot ${l}$ 移到不等式另一边，从右端减去。`,
          ],
        );
      },
    ),
    point(
      "reflecting-an-upper-bound",
      ["Reflecting an upper bound", "反射上界"],
      [
        "A variable at its upper bound $u$ can be replaced by $x = u - x'$, so that $x' \\ge 0$ measures the distance below the bound. In the new row, the coefficient of the variable changes sign and the right side shifts.",
        "处于上界 $u$ 的变量可以换成 $x = u - x'$，于是 $x' \\ge 0$ 表示距上界的距离。在新的行中，这个变量的系数变号，右端也平移。",
      ],
      (rng) => {
        const a = rng.int(2, 12);
        const u = rng.int(2, 20);
        const b = rng.int(1, 200);
        return ask(
          [
            `In $${a}x + y = ${b}$ with $x \\le ${u}$, substitute $x = ${u} - x'$. In the form $-${a}x' + y = R$, what is $R$?`,
            `在 $${a}x + y = ${b}$ 中，$x \\le ${u}$，代入 $x = ${u} - x'$。写成 $-${a}x' + y = R$，$R$ 是多少？`,
          ],
          b - a * u,
          [b + a * u, b - u, a * u - b],
          [
            `The constant $${a} \\cdot ${u}$ moves to the right side and is subtracted from ${b}.`,
            `常数 $${a} \\cdot ${u}$ 移到右端，从 ${b} 中减去。`,
          ],
        );
      },
    ),
    point(
      "the-bound-in-the-ratio-test",
      ["The bound in the ratio test", "比值检验中的界"],
      [
        "With an upper bound, the entering variable may stop for a new reason: it reaches its own bound. So the step is the smallest of the usual ratios and the bound, and if the bound wins, no basis change happens.",
        "有上界时，进基变量可能因新的原因停下：它达到自己的界。所以步长是通常的比值和这个界中最小的，如果界最小，基就不变。",
      ],
      (rng) => {
        const [p1, p2] = [rng.int(1, 6), rng.int(1, 6)];
        const [r1, r2] = [p1 * rng.int(2, 15), p2 * rng.int(2, 15)];
        const u = rng.int(2, 15);
        const step = Math.min(r1 / p1, r2 / p2, u);
        return ask(
          [
            `An entering variable has upper bound ${u}. Two rows have right sides ${r1} and ${r2}, with pivot column entries ${p1} and ${p2}. How far can the variable increase?`,
            `进基变量的上界是 ${u}。两行的右端是 ${r1} 和 ${r2}，主元列元素是 ${p1} 和 ${p2}。这个变量能增加多少？`,
          ],
          step,
          [Math.max(r1 / p1, r2 / p2, u), step + 1, r1 + r2],
          [`Take the smallest of ${r1 / p1}, ${r2 / p2} and the bound ${u}.`, `取 ${r1 / p1}、${r2 / p2} 和界 ${u} 中最小的。`],
        );
      },
    ),
  ],
);

const complexity = topic(
  "the-complexity-of-linear-programming",
  ["The Complexity of Linear Programming", "线性规划的复杂度"],
  [
    "See the worst case of the simplex method, and the central path of interior point methods.",
    "了解单纯形法的最坏情形，以及内点法的中心路径。",
  ],
  ["the-simplex-tableau", "polyhedra-and-extreme-points"],
  [],
  [
    point(
      "the-klee-minty-cube",
      ["The Klee-Minty cube", "克利-明蒂立方体"],
      [
        "The Klee-Minty example squashes a cube so that Dantzig's rule visits every corner, which takes $2^{n} - 1$ pivots in $n$ variables. In practice, though, the simplex method usually needs only a modest multiple of the number of rows.",
        "克利-明蒂例子把立方体压扁，使丹齐格规则访问每个角点，在 $n$ 个变量中需要 $2^{n} - 1$ 次主元运算。但实际上，单纯形法通常只需要行数的不大的倍数。",
      ],
      (rng) => {
        const n = rng.int(3, 30);
        return ask(
          [
            `On the Klee-Minty cube in ${n} variables, how many pivots does Dantzig's rule take?`,
            `在 ${n} 个变量的克利-明蒂立方体上，丹齐格规则需要多少次主元运算？`,
          ],
          2 ** n - 1,
          [2 ** n, n, 2 * n],
          [
            `It visits all $2^{${n}}$ corners, and the number of pivots is one fewer.`,
            `它访问全部 $2^{${n}}$ 个角点，主元运算的次数少一。`,
          ],
        );
      },
    ),
    point(
      "a-point-on-the-central-path",
      ["A point on the central path", "中心路径上的点"],
      [
        "Interior point methods add a barrier $-\\mu \\ln x$ that keeps variables positive. Minimizing $cx - \\mu \\ln x$ gives $x = \\frac{\\mu}{c}$, so as $\\mu$ shrinks, the point follows a smooth central path to the optimum.",
        "内点法加入障碍项 $-\\mu \\ln x$，使变量保持为正。最小化 $cx - \\mu \\ln x$ 得 $x = \\frac{\\mu}{c}$，所以随着 $\\mu$ 减小，这个点沿光滑的中心路径到达最优解。",
      ],
      (rng) => {
        const c = rng.int(2, 25);
        const a = rng.int(1, 12);
        const b = rng.int(2, 40);
        return ask(
          [
            `With $\\mu = ${Q.of(a, b).toLatex()}$, what value of $x > 0$ minimizes $${c}x - \\mu \\ln x$?`,
            `当 $\\mu = ${Q.of(a, b).toLatex()}$ 时，什么 $x > 0$ 使 $${c}x - \\mu \\ln x$ 最小？`,
          ],
          Q.of(a, b * c),
          [Q.of(a * c, b), Q.of(c * b, a), Q.of(a, b)],
          [
            `Setting the derivative $${c} - \\frac{\\mu}{x}$ to zero gives $x = \\frac{\\mu}{${c}}$.`,
            `令导数 $${c} - \\frac{\\mu}{x}$ 等于零，得 $x = \\frac{\\mu}{${c}}$。`,
          ],
        );
      },
    ),
    point(
      "the-duality-gap-on-the-path",
      ["The duality gap on the path", "路径上的对偶间隙"],
      [
        "On the central path, each product of a primal variable and its dual slack equals $\\mu$. So the duality gap is $n\\mu$ with $n$ variables, and this tells us how small $\\mu$ must be for a required accuracy.",
        "在中心路径上，每个原始变量与其对偶松弛的乘积等于 $\\mu$。所以 $n$ 个变量时对偶间隙是 $n\\mu$，这告诉我们达到所需精度时 $\\mu$ 必须多小。",
      ],
      (rng) => {
        const n = rng.int(3, 200);
        const a = rng.int(1, 9);
        const b = rng.pick([10, 100, 1000, 20, 50]);
        return ask(
          [
            `A program has ${n} variables, and an iterate on the central path has $\\mu = ${Q.of(a, b).toLatex()}$. What is the duality gap?`,
            `规划有 ${n} 个变量，中心路径上的迭代点 $\\mu = ${Q.of(a, b).toLatex()}$。对偶间隙是多少？`,
          ],
          Q.of(n * a, b),
          [Q.of(a, b), Q.of(a, n * b), Q.of(2 * n * a, b)],
          [
            `The gap is the number of variables times $\\mu$, here ${n} times the given value.`,
            `间隙是变量个数乘 $\\mu$，这里是 ${n} 乘给定的值。`,
          ],
        );
      },
    ),
  ],
);

const modeling = topic(
  "diet-blending-and-multiperiod-models",
  ["Diet, Blending and Multiperiod Models", "配餐、混合和多阶段模型"],
  ["Write constraints for three classic kinds of planning problem.", "为三类经典的计划问题写约束。"],
  ["formulating-linear-programs"],
  [],
  [
    point(
      "checking-a-diet",
      ["Checking a diet", "检查配餐"],
      [
        "A diet model chooses amounts of foods at the lowest cost, with one lower bound for each nutrient. The amount of a nutrient supplied by a plan is the sum of each food's content times the quantity used.",
        "配餐模型以最低成本选择食物的数量，每种营养素有一个下界。计划提供的营养素的量是每种食物的含量乘使用量之和。",
      ],
      (rng) => {
        const [a, b] = [rng.int(2, 30), rng.int(2, 30)];
        const [x, y] = [rng.int(1, 15), rng.int(1, 15)];
        const need = a * x + b * y + rng.int(-20, 20);
        return ask(
          [
            `Food A has ${a} units of protein and food B has ${b}. A plan uses ${x} of A and ${y} of B, and at least ${need} units are needed. What is the surplus, with a shortfall counted as negative?`,
            `食物 A 含 ${a} 单位蛋白质，食物 B 含 ${b} 单位。计划使用 ${x} 份 A 和 ${y} 份 B，至少需要 ${need} 单位。盈余是多少（不足记为负）？`,
          ],
          a * x + b * y - need,
          [a * x + b * y + need, a + b - need, a * x + b * y],
          [
            `The plan supplies $${a} \\cdot ${x} + ${b} \\cdot ${y}$ units, and we subtract ${need}.`,
            `计划提供 $${a} \\cdot ${x} + ${b} \\cdot ${y}$ 单位，再减去 ${need}。`,
          ],
        );
      },
    ),
    point(
      "linearizing-a-blend-requirement",
      ["Linearizing a blend requirement", "把混合要求线性化"],
      [
        "A ratio such as $\\frac{ax + by}{x + y} \\ge r$ looks nonlinear, but multiplying by $x + y$ gives $(a - r)x + (b - r)y \\ge 0$. So percentage requirements for a blend still fit a linear program.",
        "像 $\\frac{ax + by}{x + y} \\ge r$ 这样的比值看起来是非线性的，但乘 $x + y$ 得 $(a - r)x + (b - r)y \\ge 0$。所以混合的百分比要求仍然适合线性规划。",
      ],
      (rng) => {
        const a = rng.int(5, 90);
        const b = rng.int(5, 90);
        const r = rng.int(5, 90);
        const first = rng.bool();
        return ask(
          [
            `Two ingredients have purity ${a} and ${b} percent, and the blend must be at least ${r} percent. In $px + qy \\ge 0$, what is ${first ? "$p$" : "$q$"}?`,
            `两种原料的纯度是百分之 ${a} 和百分之 ${b}，混合物至少要达到百分之 ${r}。在 $px + qy \\ge 0$ 中，${first ? "$p$" : "$q$"} 是多少？`,
          ],
          first ? a - r : b - r,
          first ? [r - a, a, a + r] : [r - b, b, b + r],
          [`Each coefficient is that ingredient's purity minus the required ${r}.`, `每个系数是该原料的纯度减去要求的 ${r}。`],
        );
      },
    ),
    point(
      "inventory-balance",
      ["Inventory balance", "库存平衡"],
      [
        "A multiperiod plan links its periods with a balance equation: inventory at the end equals inventory at the start, plus production, minus demand. Holding cost is then charged on these inventory variables.",
        "多阶段计划用平衡方程连接各阶段：期末库存等于期初库存加产量减需求。持有成本再按这些库存变量计算。",
      ],
      (rng) => {
        const i0 = rng.int(0, 40);
        const p = [rng.int(20, 80), rng.int(20, 80), rng.int(20, 80)];
        const d = [rng.int(10, 60), rng.int(10, 60), rng.int(10, 60)];
        const end = i0 + (p[0] as number) + (p[1] as number) + (p[2] as number) - (d[0] as number) - (d[1] as number) - (d[2] as number);
        return ask(
          [
            `Starting inventory is ${i0}. Production is ${p.join(", ")} and demand is ${d.join(", ")} in three months. What is the ending inventory, with backorders counted as negative?`,
            `期初库存是 ${i0}。三个月的产量是 ${p.join(", ")}，需求是 ${d.join(", ")}。期末库存是多少（缺货记为负）？`,
          ],
          end,
          [end - i0 === end ? end + 1 : end - i0, end + (d[2] as number), end - (p[2] as number)],
          [`Add the starting stock and all production, and then subtract all of the demand.`, `加上期初库存和全部产量，再减去全部需求。`],
        );
      },
    ),
  ],
);

const linearizing = topic(
  "linearizing-absolute-values-and-minimax",
  ["Linearizing Absolute Values and Minimax", "绝对值和极小极大的线性化"],
  ["Rewrite absolute values and largest-of objectives using extra variables.", "用额外变量改写绝对值和最大值目标。"],
  ["formulating-linear-programs"],
  [],
  [
    point(
      "splitting-an-absolute-value",
      ["Splitting an absolute value", "拆分绝对值"],
      [
        "Write a free variable as $x = u - v$ with $u, v \\ge 0$, so that $|x|$ becomes $u + v$ in a minimization. At an optimum, at most one of the two parts is positive, because otherwise both could shrink.",
        "把自由变量写成 $x = u - v$，$u, v \\ge 0$，于是在最小化中 $|x|$ 变成 $u + v$。在最优解处至多一个部分为正，否则两者都可以减小。",
      ],
      (rng) => {
        const x = rng.int(-60, 60) || 7;
        const first = rng.bool();
        const u = Math.max(x, 0);
        const v = Math.max(-x, 0);
        return ask(
          [
            `At an optimum, $x = u - v$ with $|x| = u + v$, and $x = ${x}$. What is ${first ? "$u$" : "$v$"}?`,
            `在最优解处，$x = u - v$，$|x| = u + v$，$x = ${x}$。${first ? "$u$" : "$v$"} 是多少？`,
          ],
          first ? u : v,
          first ? [v === u ? u + 1 : v, x === u ? u + 2 : x, Math.abs(x) + 1] : [u === v ? v + 1 : u, x === v ? v + 2 : x, Math.abs(x) + 1],
          [`Only one part is positive, and the sign of ${x} tells which one.`, `只有一个部分为正，${x} 的符号决定是哪一个。`],
        );
      },
    ),
    point(
      "the-best-fit-to-absolute-deviations",
      ["The best fit to absolute deviations", "绝对偏差的最佳拟合"],
      [
        "Minimizing the sum of $|x - a_i|$ is a linear program, and the optimal $x$ is a median of the data. This is less sensitive to outliers than the mean, which minimizes the sum of squares instead.",
        "最小化 $|x - a_i|$ 之和是线性规划，最优的 $x$ 是数据的中位数。它比均值对异常值更不敏感，均值是最小化平方和的结果。",
      ],
      (rng) => {
        const count = rng.pick([3, 5, 7]);
        const data = rng
          .sample(
            Array.from({ length: 90 }, (_, i) => i + 1),
            count,
          )
          .sort((a, b) => a - b);
        const med = data[(count - 1) / 2] as number;
        const total = data.reduce((sum, v) => sum + Math.abs(v - med), 0);
        return ask(
          [
            `What is the smallest possible value of $\\sum |x - a_i|$ for the data $${data.join(", ")}$?`,
            `对数据 $${data.join(", ")}$，$\\sum |x - a_i|$ 的最小可能值是多少？`,
          ],
          total,
          [med, total + count, data.reduce((sum, v) => sum + v, 0)],
          [
            `The best $x$ is the median ${med}; add the distances from it to each value.`,
            `最佳的 $x$ 是中位数 ${med}；把它到各值的距离相加。`,
          ],
        );
      },
    ),
    point(
      "a-minimax-objective",
      ["A minimax objective", "极小极大目标"],
      [
        "To minimize the largest of several linear expressions, add a variable $z$ with $z$ at least each expression, and minimize $z$. At the optimum, $z$ equals the largest of the values, and that expression is tight.",
        "要最小化几个线性表达式中最大的一个，增加变量 $z$，使 $z$ 不小于每个表达式，再最小化 $z$。在最优解处，$z$ 等于这些值中最大的，那个表达式取等号。",
      ],
      (rng) => {
        const [a, b] = [rng.int(2, 9), rng.int(2, 9)];
        const [c, d] = [rng.int(1, 40), rng.int(41, 90)];
        const x = Q.of(d - c, a + b);
        const z = Q.of(a * (d - c) + c * (a + b), a + b);
        return ask(
          [
            `Minimize the larger of $${a}x + ${c}$ and $${d} - ${b}x$ over all $x$. What is the smallest value?`,
            `对所有 $x$ 最小化 $${a}x + ${c}$ 和 $${d} - ${b}x$ 中较大的。最小值是多少？`,
          ],
          z,
          [x, Q.of(c + d, 2), Q.of(a * (d - c) + c * (a + b) + a + b, a + b)],
          [
            `The lines cross where they are equal, at $x = ${x.toLatex()}$, and the value there is the answer.`,
            `两条直线在相等处相交，即 $x = ${x.toLatex()}$，那里的值就是答案。`,
          ],
        );
      },
    ),
  ],
);

const piecewise = topic(
  "piecewise-linear-objectives",
  ["Piecewise Linear Objectives", "分段线性目标"],
  [
    "Model rising costs with one variable per segment, and see why falling costs need integers.",
    "每段用一个变量为上升的成本建模，并了解下降的成本为什么需要整数。",
  ],
  ["linearizing-absolute-values-and-minimax"],
  [],
  [
    point(
      "the-cost-of-a-quantity",
      ["The cost of a quantity", "数量的成本"],
      [
        "Suppose the first units cost one rate and later units cost a higher rate. We give each segment its own variable with a capacity, and the cost of any quantity is the sum over segments of rate times the amount used.",
        "假设最初几单位按一个费率，后面的单位按更高的费率。给每段一个有容量的变量，任何数量的成本是各段费率乘使用量之和。",
      ],
      (rng) => {
        const [r1, r2] = [rng.int(2, 9), rng.int(10, 25)];
        const cap = rng.int(10, 60);
        const q = cap + rng.int(1, 40);
        return ask(
          [
            `The first ${cap} units cost ${r1} each, and further units cost ${r2} each. What is the cost of ${q} units?`,
            `最初 ${cap} 单位每单位 ${r1}，之后每单位 ${r2}。${q} 单位的成本是多少？`,
          ],
          r1 * cap + r2 * (q - cap),
          [r1 * q, r2 * q, r1 * cap + r2 * q],
          [
            `Compute $${r1} \\cdot ${cap} + ${r2} \\cdot ${q - cap}$, using the two segments in order.`,
            `按顺序用两段计算 $${r1} \\cdot ${cap} + ${r2} \\cdot ${q - cap}$。`,
          ],
        );
      },
    ),
    point(
      "the-optimal-production-level",
      ["The optimal production level", "最优的生产水平"],
      [
        "With rising unit cost and a fixed selling price, profit is concave. So it is best to produce through every segment whose rate is below the price, and to stop at the first segment whose rate is above it.",
        "单位成本上升而售价固定时，利润是凹函数。所以最好生产完费率低于售价的每一段，并在第一个费率高于售价的段停下。",
      ],
      (rng) => {
        const rates = [rng.int(2, 6), rng.int(7, 11), rng.int(12, 16), rng.int(17, 22)];
        const caps = [rng.int(5, 30), rng.int(5, 30), rng.int(5, 30), rng.int(5, 30)];
        const price = rng.int(5, 23);
        let q = 0;
        for (let i = 0; i < 4; i++) if ((rates[i] as number) < price) q += caps[i] as number;
        return ask(
          [
            `Segments have the unit costs ${rates.join(", ")} and capacities ${caps.join(", ")}, in order. Output sells at ${price} each. How many units should be made, using only profitable segments?`,
            `各段的单位成本依次是 ${rates.join(", ")}，容量依次是 ${caps.join(", ")}。产品每单位售价 ${price}。只用有利润的段，应生产多少单位？`,
          ],
          q,
          [q + (caps[3] as number), caps.reduce((a, b) => a + b, 0) === q ? q + 1 : caps.reduce((a, b) => a + b, 0), q === 0 ? 1 : q + 1],
          [
            `Include each segment whose unit cost is below ${price}, and add up their capacities.`,
            `包括单位成本低于 ${price} 的每一段，再把容量相加。`,
          ],
        );
      },
    ),
    point(
      "convex-or-not",
      ["Convex or not", "是否是凸的"],
      [
        "A minimization fills cheap segments first by itself only if the rates increase, which makes the cost convex. With falling rates, such as volume discounts, it would fill the wrong segment, so integer variables are needed.",
        "只有费率递增，使成本是凸函数时，最小化才会自动先填便宜的段。费率下降时，例如批量折扣，它会先填错误的段，所以需要整数变量。",
      ],
      (rng) => {
        const a = rng.int(2, 30);
        const b = rng.int(2, 30);
        const c = a === b ? a + 1 : b;
        const rising = c > a;
        const lp: [string, string] = ["An ordinary linear program is enough", "普通线性规划就够了"];
        const ip: [string, string] = ["Integer variables are needed", "需要整数变量"];
        return choose(
          rng,
          [
            `In a minimization, a cost has unit rate ${a} on the first segment and ${c} on the second. How can it be modeled?`,
            `在最小化中，成本第一段的单位费率是 ${a}，第二段是 ${c}。怎样建模？`,
          ],
          rising ? lp : ip,
          [rising ? ip : lp, ["It cannot be modeled at all", "它根本不能建模"], ["Only by a quadratic program", "只能用二次规划"]],
          [
            `The rates ${rising ? "rise, so the cost is convex and the cheap segment fills first" : "fall, so the cost is not convex and the order must be forced"}.`,
            `费率${rising ? "上升，所以成本是凸的，便宜的段先填满" : "下降，所以成本不是凸的，必须强制顺序"}。`,
          ],
        );
      },
    ),
  ],
);

const shadow = topic(
  "shadow-prices-in-decisions",
  ["Shadow Prices in Decisions", "决策中的影子价格"],
  ["Use dual values to decide whether to buy more of a resource.", "用对偶值决定是否购买更多资源。"],
  ["right-hand-side-ranging"],
  [],
  [
    point(
      "the-gain-from-more-resource",
      ["The gain from more of a resource", "更多资源的收益"],
      [
        "A shadow price is the dual value of a constraint, and it tells how fast the optimal objective improves per extra unit. The rate holds as long as the change stays within the range where the basis remains optimal.",
        "影子价格是约束的对偶值，它说明每多一单位，最优目标改善多快。只要变化保持在基仍最优的范围内，这个比率就成立。",
      ],
      (rng) => {
        const y = rng.int(2, 25);
        const z = rng.int(100, 900);
        const d = rng.int(1, 15);
        return ask(
          [
            `The optimal profit is ${z}, a resource has shadow price ${y}, and ${d} more units are added, within the allowed range. What is the new profit?`,
            `最优利润是 ${z}，某资源的影子价格是 ${y}，在允许范围内增加 ${d} 单位。新的利润是多少？`,
          ],
          z + y * d,
          [z + y, z + d, z - y * d],
          [
            `The profit rises by $${y} \\cdot ${d}$, because the change is within the range.`,
            `利润增加 $${y} \\cdot ${d}$，因为变化在范围内。`,
          ],
        );
      },
    ),
    point(
      "whether-to-buy",
      ["Whether to buy", "是否购买"],
      [
        "Extra capacity is worth buying only when its market price is below the shadow price. The net gain per unit is then the difference, while a resource with slack has shadow price zero and is not worth buying at any positive price.",
        "只有市场价低于影子价格时，额外的产能才值得购买。这时每单位的净收益是两者之差，而有松弛的资源影子价格为零，任何正价格都不值得买。",
      ],
      (rng) => {
        const y = rng.int(3, 30);
        const price = rng.int(1, 35);
        const d = rng.int(2, 20);
        const net = Math.max(y - price, 0) * d;
        return ask(
          [
            `A resource has shadow price ${y} for up to ${d} more units, and the market price is ${price} per unit. What is the largest net gain from buying?`,
            `某资源在再增加 ${d} 单位内的影子价格是 ${y}，市场价是每单位 ${price}。购买的最大净收益是多少？`,
          ],
          net,
          [y * d, net + d, Math.abs(y - price) * d === net ? net + 2 * d : Math.abs(y - price) * d],
          y > price
            ? [`Buying all ${d} units gains $${y} - ${price}$ on each of them.`, `买下全部 ${d} 单位，每单位收益 $${y} - ${price}$。`]
            : [
                `The price is at least the shadow price, so the best choice is to buy nothing.`,
                `价格不低于影子价格，所以最好的选择是不买。`,
              ],
        );
      },
    ),
    point(
      "the-objective-from-dual-values",
      ["The objective from dual values", "由对偶值得目标值"],
      [
        "By strong duality, the optimal value equals the sum of each right side times its shadow price. So every unit of profit can be attributed to the resources that are actually in short supply.",
        "由强对偶性，最优值等于每个右端乘其影子价格之和。所以每单位利润都可以归因于实际短缺的资源。",
      ],
      (rng) => {
        const b = [rng.int(5, 60), rng.int(5, 60), rng.int(5, 60)] as [number, number, number];
        const y = [rng.int(1, 12), 0, rng.int(1, 12)] as [number, number, number];
        return ask(
          [
            `Three constraints have right sides ${b.join(", ")} and shadow prices ${y.join(", ")}. What is the optimal value?`,
            `三个约束的右端是 ${b.join(", ")}，影子价格是 ${y.join(", ")}。最优值是多少？`,
          ],
          b[0] * y[0] + b[2] * y[2],
          [b[0] + b[1] + b[2], y[0] + y[2], b[0] * y[0] + b[1] + b[2] * y[2]],
          [
            `Compute $${b[0]} \\cdot ${y[0]} + ${b[2]} \\cdot ${y[2]}$; the slack constraint contributes nothing.`,
            `计算 $${b[0]} \\cdot ${y[0]} + ${b[2]} \\cdot ${y[2]}$；有松弛的约束没有贡献。`,
          ],
        );
      },
    ),
  ],
);

const objectiveRanging = topic(
  "objective-coefficient-ranging",
  ["Objective Coefficient Ranging", "目标系数的灵敏度范围"],
  ["Find how far a profit can change before the optimal plan changes.", "求利润能变化多少而最优计划不变。"],
  ["sensitivity-analysis"],
  [],
  [
    point(
      "the-range-at-a-corner",
      ["The range at a corner", "角点处的范围"],
      [
        "A corner stays optimal while the objective's slope lies between the slopes of the two tight constraints. So for a corner of $x + y \\le S$ and $kx + y \\le T$, the plan holds while $c_1$ is between $c_2$ and $kc_2$.",
        "只要目标函数的斜率在两个紧约束的斜率之间，角点就保持最优。所以对 $x + y \\le S$ 和 $kx + y \\le T$ 的角点，只要 $c_1$ 在 $c_2$ 和 $kc_2$ 之间，计划就不变。",
      ],
      (rng) => {
        const k = rng.int(2, 9);
        const c2 = rng.int(2, 25);
        const top = rng.bool();
        return ask(
          [
            `A corner of $x + y \\le S$ and $${k}x + y \\le T$ is optimal for the objective $c_1 x + ${c2}y$. What is the ${top ? "largest" : "smallest"} value of $c_1$ that keeps it optimal?`,
            `$x + y \\le S$ 和 $${k}x + y \\le T$ 的角点对目标 $c_1 x + ${c2}y$ 最优。使它保持最优的 $c_1$ 的${top ? "最大" : "最小"}值是多少？`,
          ],
          top ? k * c2 : c2,
          top ? [c2, k + c2, k * c2 + 1] : [k * c2, Q.of(c2, k), c2 + 1],
          [
            `The ratio $\\frac{c_1}{${c2}}$ must lie between the constraint slopes 1 and ${k}.`,
            `比值 $\\frac{c_1}{${c2}}$ 必须在约束斜率 1 和 ${k} 之间。`,
          ],
        );
      },
    ),
    point(
      "a-nonbasic-coefficient",
      ["A nonbasic coefficient", "非基变量的系数"],
      [
        "A product not in the optimal plan stays out until its profit rises by the size of its reduced cost. At that point it becomes attractive to bring in, so that reduced cost measures how far the profit falls short.",
        "不在最优计划中的产品，要等利润上升到其检验数的大小才进入。到那时才值得引入，所以这个检验数衡量利润差多少。",
      ],
      (rng) => {
        const c = rng.int(2, 40);
        const r = rng.int(1, 20);
        return ask(
          [
            `A product not made in the optimal plan has profit ${c} and reduced cost ${r}, in the amount it falls short. At what profit does it first become worth making?`,
            `最优计划中不生产的产品利润是 ${c}，检验数是 ${r}（表示差额）。利润达到多少时它才开始值得生产？`,
          ],
          c + r,
          [c, r, c - r === c + r ? c + r + 1 : c - r],
          [`Its profit needs to rise by ${r}, starting from ${c}.`, `它的利润需要从 ${c} 上升 ${r}。`],
        );
      },
    ),
    point(
      "the-value-after-a-change",
      ["The value after a change", "变化后的值"],
      [
        "Within the allowed range the plan stays the same, so only the value of the objective changes. A change of a coefficient changes the objective by that change times the quantity of the product in the plan.",
        "在允许范围内计划不变，所以只有目标值变化。系数的变化使目标值改变这个变化量乘计划中产品的数量。",
      ],
      (rng) => {
        const x = rng.int(2, 40);
        const d = rng.int(1, 9);
        const z = rng.int(100, 900);
        const up = rng.bool();
        return ask(
          [
            `The optimal value is ${z}, with ${x} units of a product in the plan. Its profit ${up ? "rises" : "falls"} by ${d}, within the range. What is the new optimal value?`,
            `最优值是 ${z}，计划中有某产品 ${x} 单位。它的利润${up ? "上升" : "下降"} ${d}，在范围内。新的最优值是多少？`,
          ],
          up ? z + d * x : z - d * x,
          [up ? z + d : z - d, up ? z - d * x : z + d * x, z],
          [`The plan is unchanged, so the value moves by $${d} \\cdot ${x}$.`, `计划不变，所以值改变 $${d} \\cdot ${x}$。`],
        );
      },
    ),
  ],
);

const addRow = topic(
  "adding-a-variable-or-a-constraint",
  ["Adding a Variable or a Constraint", "增加变量或约束"],
  ["Re-solve efficiently after a new product or a new requirement appears.", "在出现新产品或新要求后高效地重新求解。"],
  ["sensitivity-analysis", "the-dual-simplex-method"],
  [],
  [
    point(
      "pricing-a-new-product",
      ["Pricing a new product", "为新产品定价"],
      [
        "A new variable should enter when its profit exceeds the value of the resources it uses, at their shadow prices. So we compute its reduced cost from the dual values, and we need no fresh solve when it is not attractive.",
        "当新变量的利润超过它所用资源按影子价格计算的价值时，它应该进入。所以用对偶值计算它的检验数，不值得引入时无需重新求解。",
      ],
      (rng) => {
        const [y1, y2] = [rng.int(1, 9), rng.int(1, 9)];
        const [a1, a2] = [rng.int(1, 9), rng.int(1, 9)];
        const c = rng.int(5, 80);
        return ask(
          [
            `Shadow prices are ${y1} and ${y2}. A new product uses ${a1} and ${a2} units of the resources and earns ${c}. What is its profit minus the value of the resources it uses?`,
            `影子价格是 ${y1} 和 ${y2}。新产品使用这些资源 ${a1} 和 ${a2} 单位，赚 ${c}。它的利润减去所用资源的价值是多少？`,
          ],
          c - y1 * a1 - y2 * a2,
          [c + y1 * a1 + y2 * a2, y1 * a1 + y2 * a2, c - y1 - y2],
          [
            `Resources are worth $${y1} \\cdot ${a1} + ${y2} \\cdot ${a2}$, and that is subtracted from ${c}.`,
            `资源价值 $${y1} \\cdot ${a1} + ${y2} \\cdot ${a2}$，从 ${c} 中减去。`,
          ],
        );
      },
    ),
    point(
      "whether-a-new-constraint-matters",
      ["Whether a new constraint matters", "新约束是否起作用"],
      [
        "If the current optimum already satisfies a new constraint, then it is still optimal and nothing needs to be done. Otherwise, the new row makes the basis primal infeasible, and the dual simplex method repairs it.",
        "如果当前最优解已经满足新约束，它仍然最优，什么都不用做。否则新的行使基原始不可行，由对偶单纯形法修复。",
      ],
      (rng) => {
        const [a, b] = [rng.int(2, 9), rng.int(2, 9)];
        const [x, y] = [rng.int(1, 20), rng.int(1, 20)];
        const r = a * x + b * y + rng.int(-15, 15);
        const ok = a * x + b * y <= r;
        const still: [string, string] = ["The optimum is unchanged", "最优解不变"];
        const repair: [string, string] = ["The dual simplex method must repair it", "必须用对偶单纯形法修复"];
        return choose(
          rng,
          [
            `The current optimum is $(${x}, ${y})$, and we add the constraint $${a}x + ${b}y \\le ${r}$. What happens?`,
            `当前最优解是 $(${x}, ${y})$，增加约束 $${a}x + ${b}y \\le ${r}$。会发生什么？`,
          ],
          ok ? still : repair,
          [ok ? repair : still, ["The program becomes unbounded", "规划变得无界"], ["The dual becomes infeasible", "对偶变得不可行"]],
          [
            `At this point the left side is ${a * x + b * y}, which is ${ok ? "within" : "above"} the limit ${r}.`,
            `在这一点左端是 ${a * x + b * y}，${ok ? "未超过" : "超过了"}限制 ${r}。`,
          ],
        );
      },
    ),
    point(
      "the-new-slack-value",
      ["The new slack value", "新的松弛值"],
      [
        "When a constraint is added, its slack becomes a new basic variable, with the value of the right side minus the left side at the current point. A negative value signals which row the dual simplex method should pivot on.",
        "增加约束时，它的松弛变量成为新的基本变量，值是右端减去当前点处的左端。负值表明对偶单纯形法应在哪一行进行主元运算。",
      ],
      (rng) => {
        const [a, b] = [rng.int(2, 9), rng.int(2, 9)];
        const [x, y] = [rng.int(1, 20), rng.int(1, 20)];
        const r = rng.int(5, 200);
        return ask(
          [
            `At the optimum $(${x}, ${y})$, add $${a}x + ${b}y + s = ${r}$. What is the initial value of the slack $s$?`,
            `在最优解 $(${x}, ${y})$ 处，增加 $${a}x + ${b}y + s = ${r}$。松弛变量 $s$ 的初值是多少？`,
          ],
          r - a * x - b * y,
          [a * x + b * y - r, r, r - x - y],
          [
            `Subtract $${a} \\cdot ${x} + ${b} \\cdot ${y}$ from the right side ${r}.`,
            `从右端 ${r} 减去 $${a} \\cdot ${x} + ${b} \\cdot ${y}$。`,
          ],
        );
      },
    ),
  ],
);

const matrixForm = topic(
  "the-tableau-in-matrix-form",
  ["The Tableau in Matrix Form", "矩阵形式的单纯形表"],
  ["Read every entry of the tableau from the inverse of the basis.", "从基的逆矩阵读出单纯形表的每个元素。"],
  ["the-revised-simplex-method"],
  [],
  [
    point(
      "the-basic-values",
      ["The basic values", "基本变量的值"],
      [
        "With basis matrix $B$, the basic variables take the values $B^{-1}b$. This is the right-hand column of the tableau, and it is the only computation needed to find the current corner point.",
        "基矩阵为 $B$ 时，基本变量取值 $B^{-1}b$。这是单纯形表的右端列，也是求当前角点所需的唯一计算。",
      ],
      (rng) => {
        const [a, c] = [rng.int(1, 6), rng.int(1, 6)];
        const b1 = rng.int(1, 40);
        const b2 = rng.int(1, 40);
        const first = rng.bool();
        return ask(
          [
            `Here $B^{-1} = \\begin{pmatrix} ${a} & 1 \\\\ ${c} & 2 \\end{pmatrix}$ and $b = (${b1}, ${b2})$. What is the ${first ? "first" : "second"} basic value?`,
            `这里 $B^{-1} = \\begin{pmatrix} ${a} & 1 \\\\ ${c} & 2 \\end{pmatrix}$，$b = (${b1}, ${b2})$。第${first ? "一" : "二"}个基本变量的值是多少？`,
          ],
          first ? a * b1 + b2 : c * b1 + 2 * b2,
          first
            ? [
                c * b1 + 2 * b2 === a * b1 + b2 ? a * b1 + b2 + 1 : c * b1 + 2 * b2,
                a * b2 + b1 === a * b1 + b2 ? a * b1 + b2 + 2 : a * b2 + b1,
                a + b1,
              ]
            : [
                a * b1 + b2 === c * b1 + 2 * b2 ? c * b1 + 2 * b2 + 1 : a * b1 + b2,
                c * b2 + 2 * b1 === c * b1 + 2 * b2 ? c * b1 + 2 * b2 + 2 : c * b2 + 2 * b1,
                c + b1,
              ],
          [
            `Multiply the ${first ? "first" : "second"} row of $B^{-1}$ by the vector $b$.`,
            `用 $B^{-1}$ 的第${first ? "一" : "二"}行乘向量 $b$。`,
          ],
        );
      },
    ),
    point(
      "the-dual-values-from-the-inverse",
      ["The dual values from the inverse", "由逆矩阵得对偶值"],
      [
        "The simplex multipliers are $y = c_B B^{-1}$, and at the optimum they solve the dual program. They appear in the objective row under the slack columns, so the final tableau shows the dual solution for free.",
        "单纯形乘子是 $y = c_B B^{-1}$，在最优解处它们解对偶规划。它们出现在目标行中松弛列的下方，所以最终的单纯形表直接给出对偶解。",
      ],
      (rng) => {
        const [a, b, c, d] = [rng.int(1, 6), rng.int(1, 6), rng.int(1, 6), rng.int(1, 6)];
        const [c1, c2] = [rng.int(1, 12), rng.int(1, 12)];
        const first = rng.bool();
        return ask(
          [
            `With $c_B = (${c1}, ${c2})$ and $B^{-1} = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$, what is the ${first ? "first" : "second"} entry of $y = c_B B^{-1}$?`,
            `取 $c_B = (${c1}, ${c2})$，$B^{-1} = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$，$y = c_B B^{-1}$ 的第${first ? "一" : "二"}个元素是多少？`,
          ],
          first ? c1 * a + c2 * c : c1 * b + c2 * d,
          first
            ? [c1 * a + c2 * b === c1 * a + c2 * c ? c1 * a + c2 * c + 1 : c1 * a + c2 * b, c1 * a, c2 * c]
            : [c1 * c + c2 * d === c1 * b + c2 * d ? c1 * b + c2 * d + 1 : c1 * c + c2 * d, c1 * b, c2 * d],
          [
            `Multiply the row vector $c_B$ by the ${first ? "first" : "second"} column of $B^{-1}$.`,
            `用行向量 $c_B$ 乘 $B^{-1}$ 的第${first ? "一" : "二"}列。`,
          ],
        );
      },
    ),
    point(
      "a-reduced-cost-in-matrix-form",
      ["A reduced cost in matrix form", "矩阵形式的检验数"],
      [
        "A column's reduced cost is $c_j - ya_j$, the profit minus the value of the resources it uses. The current basis is optimal for a maximization when every one of these values is at most zero.",
        "一列的检验数是 $c_j - ya_j$，即利润减去它所用资源的价值。对最大化问题，当所有这些值都不超过零时，当前的基就是最优的。",
      ],
      (rng) => {
        const [y1, y2] = [rng.int(0, 9), rng.int(0, 9)];
        const [a1, a2] = [rng.int(1, 9), rng.int(1, 9)];
        const c = rng.int(1, 60);
        return ask(
          [
            `With $y = (${y1}, ${y2})$, a column $a_j = (${a1}, ${a2})$ has $c_j = ${c}$. What is $c_j - ya_j$?`,
            `取 $y = (${y1}, ${y2})$，列 $a_j = (${a1}, ${a2})$ 的 $c_j = ${c}$。$c_j - ya_j$ 是多少？`,
          ],
          c - y1 * a1 - y2 * a2,
          [
            c + y1 * a1 + y2 * a2,
            y1 * a1 + y2 * a2 - c === c - y1 * a1 - y2 * a2 ? c - y1 * a1 - y2 * a2 + 1 : y1 * a1 + y2 * a2 - c,
            c - y1 - y2 === c - y1 * a1 - y2 * a2 ? c - y1 * a1 - y2 * a2 + 2 : c - y1 - y2,
          ],
          [
            `The dot product is $${y1} \\cdot ${a1} + ${y2} \\cdot ${a2}$, which is subtracted from ${c}.`,
            `点积是 $${y1} \\cdot ${a1} + ${y2} \\cdot ${a2}$，从 ${c} 中减去。`,
          ],
        );
      },
    ),
  ],
);

const startingPlans = topic(
  "starting-plans-for-transportation",
  ["Starting Plans for Transportation", "运输问题的初始方案"],
  ["Build a first feasible shipping plan with the northwest corner and Vogel's rules.", "用西北角法和沃格尔法建立第一个可行的运输方案。"],
  ["the-transportation-problem"],
  [],
  [
    point(
      "the-northwest-corner-rule",
      ["The northwest corner rule", "西北角法"],
      [
        "The northwest corner rule starts at the top left and ships as much as possible, moving right when a demand is met and down when a supply runs out. It ignores costs, but it always produces a feasible plan.",
        "西北角法从左上角开始，尽量多运，满足一个需求就向右移，一个供应用完就向下移。它不考虑成本，但总能得到可行方案。",
      ],
      (rng) => {
        const s1 = rng.int(10, 60);
        const d1 = rng.int(5, s1 - 1);
        const d2 = s1 - d1 + rng.int(5, 40);
        return ask(
          [
            `Supplies start with ${s1}, and demands are ${d1} then ${d2}. Under the northwest corner rule, how much does source 1 ship to destination 2?`,
            `第一个供应是 ${s1}，需求依次是 ${d1} 和 ${d2}。按西北角法，产地 1 运到销地 2 多少？`,
          ],
          s1 - d1,
          [d1, d2, s1],
          [
            `Cell (1, 1) ships ${d1}, which leaves $${s1} - ${d1}$ for the next cell.`,
            `单元格 (1, 1) 运 ${d1}，剩下 $${s1} - ${d1}$ 给下一个单元格。`,
          ],
        );
      },
    ),
    point(
      "the-number-of-shipping-cells",
      ["The number of shipping cells", "运输单元格的个数"],
      [
        "A balanced plan with $m$ sources and $n$ destinations has $m + n - 1$ basic cells, because one equation among the supply and demand constraints is redundant. A starting rule produces exactly that many cells in a nondegenerate case.",
        "$m$ 个产地和 $n$ 个销地的平衡方案有 $m + n - 1$ 个基本单元格，因为供需约束中有一个方程是多余的。非退化时，初始规则恰好产生这么多单元格。",
      ],
      (rng) => {
        const m = rng.int(2, 15);
        const n = rng.int(2, 15);
        return ask(
          [
            `A balanced transportation problem has ${m} sources and ${n} destinations. How many basic cells does a plan have?`,
            `平衡运输问题有 ${m} 个产地和 ${n} 个销地。方案有多少个基本单元格？`,
          ],
          m + n - 1,
          [m * n === m + n - 1 ? m + n : m * n, m + n, m + n - 2],
          [
            `There are ${m + n} equations, one of them redundant, so the count is $${m} + ${n} - 1$.`,
            `有 ${m + n} 个方程，其中一个多余，所以个数是 $${m} + ${n} - 1$。`,
          ],
        );
      },
    ),
    point(
      "vogels-penalty",
      ["Vogel's penalty", "沃格尔罚数"],
      [
        "Vogel's method looks at each row's two cheapest cells, and their difference is the penalty for missing the best choice. It ships first in the row or column with the largest penalty, so its plans are usually close to optimal.",
        "沃格尔法看每行最便宜的两个单元格，它们的差是错过最佳选择的罚数。它先在罚数最大的行或列运输，所以方案通常接近最优。",
      ],
      (rng) => {
        const costs = rng.sample(
          Array.from({ length: 60 }, (_, i) => i + 1),
          4,
        );
        const sorted = [...costs].sort((a, b) => a - b);
        const p = (sorted[1] as number) - (sorted[0] as number);
        return ask(
          [
            `A row has the costs $${costs.join(", ")}$. What is its Vogel penalty?`,
            `一行的成本是 $${costs.join(", ")}$。它的沃格尔罚数是多少？`,
          ],
          p,
          [
            (sorted[3] as number) - (sorted[0] as number),
            sorted[0] as number,
            (sorted[2] as number) - (sorted[1] as number) === p ? p + 1 : (sorted[2] as number) - (sorted[1] as number),
          ],
          [
            `The two smallest costs are ${sorted[0]} and ${sorted[1]}, and the penalty is their difference.`,
            `最小的两个成本是 ${sorted[0]} 和 ${sorted[1]}，罚数是它们的差。`,
          ],
        );
      },
    ),
  ],
);

const hungarian = topic(
  "the-hungarian-algorithm",
  ["The Hungarian Algorithm", "匈牙利算法"],
  ["Solve an assignment problem by creating zeros in the cost matrix.", "通过在成本矩阵中产生零来解指派问题。"],
  ["the-assignment-problem"],
  [],
  [
    point(
      "reducing-a-row",
      ["Reducing a row", "行化简"],
      [
        "Subtracting a constant from a whole row changes every assignment's cost by the same amount, so the best assignment stays the same. The algorithm subtracts each row's minimum, and then each column's minimum, to create zeros.",
        "从整行减去一个常数，每个指派的成本改变相同的量，所以最佳指派不变。算法减去每行的最小值，再减去每列的最小值，以产生零。",
      ],
      (rng) => {
        const row = rng.sample(
          Array.from({ length: 70 }, (_, i) => i + 5),
          4,
        );
        const m = Math.min(...row);
        const i = rng.int(0, 3);
        return ask(
          [
            `A row of the cost matrix is $${row.join(", ")}$. After row reduction, what does entry ${i + 1} become?`,
            `成本矩阵的一行是 $${row.join(", ")}$。行化简后第 ${i + 1} 个元素变成多少？`,
          ],
          (row[i] as number) - m,
          [row[i] as number, m, (row[i] as number) - m + 1],
          [`Subtract the smallest entry, ${m}, from entry ${row[i]}.`, `从元素 ${row[i]} 减去最小的元素 ${m}。`],
        );
      },
    ),
    point(
      "the-test-for-optimality",
      ["The test for optimality", "最优性检验"],
      [
        "Cover all the zeros using as few lines as possible. By Konig's theorem, a full assignment on zeros exists exactly when the number of lines equals $n$, and otherwise the matrix is adjusted to create more zeros.",
        "用尽可能少的线覆盖所有的零。由柯尼希定理，在零上存在完全指派，当且仅当线数等于 $n$，否则调整矩阵以产生更多的零。",
      ],
      (rng) => {
        const n = rng.int(3, 12);
        const lines = rng.int(1, n);
        const done: [string, string] = ["An optimal assignment can be read from the zeros", "可以从零读出最优指派"];
        const more: [string, string] = ["The matrix must be adjusted to create more zeros", "必须调整矩阵以产生更多的零"];
        return choose(
          rng,
          [
            `In a ${n} by ${n} reduced matrix, the fewest lines covering all zeros number ${lines}. What should be done next?`,
            `在 ${n} 乘 ${n} 的化简矩阵中，覆盖所有零的最少线数是 ${lines}。下一步应做什么？`,
          ],
          lines === n ? done : more,
          [
            lines === n ? more : done,
            ["The problem has no assignment", "问题没有指派"],
            ["Every entry must be doubled", "每个元素都要加倍"],
          ],
          [`The test compares the ${lines} lines with the size ${n}.`, `这个检验比较 ${lines} 条线和大小 ${n}。`],
        );
      },
    ),
    point(
      "the-best-assignment",
      ["The best assignment", "最佳指派"],
      [
        "Once a complete set of zeros is found, the optimal cost is computed from the original matrix, or equally from the total amount subtracted. For a small matrix, we can confirm the answer by checking every assignment.",
        "找到一整组零后，最优成本由原矩阵计算，或者等于减去的总量。对小矩阵，可以检查每个指派来确认答案。",
      ],
      (rng) => {
        const m = Array.from({ length: 3 }, () => [rng.int(1, 30), rng.int(1, 30), rng.int(1, 30)]);
        const cost = (p: readonly number[]) => p.reduce((sum, j, i) => sum + ((m[i] as number[])[j] as number), 0);
        const all = permutationsOf3.map(cost);
        const best = Math.min(...all);
        const worst = Math.max(...all);
        const tex = m.map((r) => r.join(" & ")).join(" \\\\ ");
        return ask(
          [
            `What is the smallest total cost of assigning three workers to three jobs, one each, with costs $\\begin{pmatrix} ${tex} \\end{pmatrix}$?`,
            `把三名工人一对一指派给三项工作，成本是 $\\begin{pmatrix} ${tex} \\end{pmatrix}$，最小总成本是多少？`,
          ],
          best,
          [worst === best ? best + 1 : worst, best + 1, cost([0, 1, 2]) === best ? best + 2 : cost([0, 1, 2])],
          [
            `Compare the assignments, or reduce the matrix; the cheapest of the six costs ${best}.`,
            `比较各种指派，或化简矩阵；六种中最便宜的成本是 ${best}。`,
          ],
        );
      },
    ),
  ],
);

const networkSimplex = topic(
  "the-network-simplex-method",
  ["The Network Simplex Method", "网络单纯形法"],
  ["Run the simplex method directly on a spanning tree of a network.", "直接在网络的生成树上运行单纯形法。"],
  ["minimum-cost-flow"],
  [],
  [
    point(
      "a-basis-is-a-tree",
      ["A basis is a tree", "基是一棵树"],
      [
        "In a minimum cost flow problem, a basis corresponds to a spanning tree of the network. So with $n$ nodes there are $n - 1$ basic arcs, and the flows on them are fixed by working in from the leaves.",
        "在最小费用流问题中，基对应网络的一棵生成树。所以 $n$ 个结点时有 $n - 1$ 条基本弧，它们上的流从叶子向内依次确定。",
      ],
      (rng) => {
        const n = rng.int(4, 60);
        const e = n - 1 + rng.int(1, 40);
        return ask(
          [
            `A connected network has ${n} nodes and ${e} arcs. How many arcs are basic in the network simplex method?`,
            `连通网络有 ${n} 个结点和 ${e} 条弧。在网络单纯形法中有多少条基本弧？`,
          ],
          n - 1,
          [n, e - n + 1 === n - 1 ? e : e - n + 1, e],
          [
            `A spanning tree on ${n} nodes has $${n} - 1$ arcs, whatever the number of arcs overall.`,
            `${n} 个结点的生成树有 $${n} - 1$ 条弧，与弧的总数无关。`,
          ],
        );
      },
    ),
    point(
      "potentials-and-reduced-costs",
      ["Potentials and reduced costs", "势和检验数"],
      [
        "Node potentials play the role of dual values, with $\\pi_j = \\pi_i + c_{ij}$ along each tree arc. A nontree arc has reduced cost $c_{ij} + \\pi_i - \\pi_j$, and a negative value means it can improve the plan.",
        "结点势起对偶值的作用，沿每条树弧 $\\pi_j = \\pi_i + c_{ij}$。非树弧的检验数是 $c_{ij} + \\pi_i - \\pi_j$，负值表示它可以改善方案。",
      ],
      (rng) => {
        const [sa, at, sb] = [rng.int(1, 20), rng.int(1, 20), rng.int(1, 20)];
        const bt = rng.int(1, 40);
        const value = bt + sb - sa - at;
        return ask(
          [
            `In the network drawn, the tree arcs are $S \\to A$, $A \\to T$ and $S \\to B$, with $\\pi_S = 0$. What is the reduced cost of the nontree arc $B \\to T$?`,
            `在图示网络中，树弧是 $S \\to A$，$A \\to T$ 和 $S \\to B$，$\\pi_S = 0$。非树弧 $B \\to T$ 的检验数是多少？`,
          ],
          value,
          [bt - sb + sa + at, sa + at - bt - sb, bt - sa - at],
          [
            `The tree gives $\\pi_B = ${sb}$ and $\\pi_T = ${sa + at}$, so the value is $${bt} + ${sb} - ${sa + at}$.`,
            `树给出 $\\pi_B = ${sb}$ 和 $\\pi_T = ${sa + at}$，所以值是 $${bt} + ${sb} - ${sa + at}$。`,
          ],
          arcsFigure(
            [
              ["S", "A", sa],
              ["A", "T", at],
              ["S", "B", sb],
              ["B", "T", bt],
            ],
            [
              `A network with arcs S to A cost ${sa}, A to T cost ${at}, S to B cost ${sb} and B to T cost ${bt}.`,
              `网络的弧是 S 到 A 费用 ${sa}，A 到 T 费用 ${at}，S 到 B 费用 ${sb}，B 到 T 费用 ${bt}。`,
            ],
          ),
        );
      },
    ),
    point(
      "pushing-around-a-cycle",
      ["Pushing around a cycle", "沿圈推流"],
      [
        "An entering arc closes one cycle with the tree. Flow increases on forward arcs and decreases on backward arcs, so the push is limited by the smallest flow on a backward arc, and that arc leaves the tree.",
        "进基弧与树形成一个圈。流在前向弧上增加，在后向弧上减少，所以推流量受后向弧上最小流的限制，那条弧离开树。",
      ],
      (rng) => {
        const back = rng.sample(
          Array.from({ length: 50 }, (_, i) => i + 1),
          3,
        );
        const forward = rng.int(1, 40);
        const m = Math.min(...back);
        return ask(
          [
            `A cycle has backward arcs with the flows $${back.join(", ")}$, and a forward arc with the flow ${forward}. How much flow can be pushed?`,
            `一个圈有流为 $${back.join(", ")}$ 的后向弧和流为 ${forward} 的前向弧。能推多少流？`,
          ],
          m,
          [Math.max(...back), forward === m ? m + 1 : forward, m + forward],
          [`Only backward arcs lose flow, so the limit is the smallest of them, ${m}.`, `只有后向弧减少流，所以限制是其中最小的 ${m}。`],
        );
      },
    ),
  ],
);

const branchBound = topic(
  "branch-and-bound",
  ["Branch and Bound", "分支定界"],
  ["Split on a fractional variable, and discard branches using bounds.", "按分数变量分支，并用界剪去分支。"],
  ["integer-programming"],
  [],
  [
    point(
      "the-two-branches",
      ["The two branches", "两个分支"],
      [
        "When a variable has a fractional value in the relaxation, no integer solution has that variable strictly between the neighboring integers. So we split the problem into one branch with $x \\le \\lfloor v \\rfloor$ and another with $x \\ge \\lceil v \\rceil$.",
        "当松弛解中变量取分数值时，没有整数解使这个变量严格在相邻整数之间。所以把问题分成 $x \\le \\lfloor v \\rfloor$ 和 $x \\ge \\lceil v \\rceil$ 两个分支。",
      ],
      (rng) => {
        const b = rng.int(2, 9);
        const a = rng.int(1, 200) * b + rng.int(1, b - 1);
        const lo = Math.floor(a / b);
        const up = rng.bool();
        return ask(
          [
            `The relaxation has $x = ${Q.of(a, b).toLatex()}$. What bound does the ${up ? "upper" : "lower"} branch use, with ${up ? "$x \\ge k$" : "$x \\le k$"}?`,
            `松弛解有 $x = ${Q.of(a, b).toLatex()}$。${up ? "上" : "下"}分支用什么界，${up ? "$x \\ge k$" : "$x \\le k$"}？`,
          ],
          up ? lo + 1 : lo,
          up ? [lo, lo + 2, Q.of(a, b)] : [lo + 1, lo - 1, Q.of(a, b)],
          [
            `The value lies between ${lo} and ${lo + 1}, so ${up ? "round up" : "round down"}.`,
            `这个值在 ${lo} 和 ${lo + 1} 之间，所以${up ? "向上取整" : "向下取整"}。`,
          ],
        );
      },
    ),
    point(
      "pruning-a-branch",
      ["Pruning a branch", "剪枝"],
      [
        "In a maximization, a relaxation's value is an upper bound for its branch, while the best integer solution so far is a lower bound overall. A branch whose bound does not beat the incumbent can be discarded.",
        "在最大化问题中，松弛的值是其分支的上界，而目前最好的整数解是总的下界。界不超过当前最好解的分支可以丢弃。",
      ],
      (rng) => {
        const inc = rng.int(20, 300);
        const b = inc + rng.int(-20, 20);
        const prune = b <= inc;
        const cut: [string, string] = ["Discard this branch", "丢弃这个分支"];
        const keep: [string, string] = ["Keep exploring this branch", "继续探索这个分支"];
        return choose(
          rng,
          [
            `Maximizing, the incumbent has value ${inc}, and a branch's relaxation has value ${b} with a fractional solution. What should be done?`,
            `在最大化中，当前最好解的值是 ${inc}，一个分支的松弛值是 ${b}，解是分数。应该怎么做？`,
          ],
          prune ? cut : keep,
          [
            prune ? keep : cut,
            ["Accept it as the new incumbent", "接受它作为新的最好解"],
            ["Stop the whole search at once", "立刻停止整个搜索"],
          ],
          [
            `The bound ${b} ${prune ? "does not exceed" : "exceeds"} the incumbent ${inc}, which decides the branch.`,
            `界 ${b} ${prune ? "不超过" : "超过"}当前最好解 ${inc}，这决定了这个分支。`,
          ],
        );
      },
    ),
    point(
      "the-optimality-gap",
      ["The optimality gap", "最优性间隙"],
      [
        "The largest bound among the open branches and the incumbent's value enclose the true optimum. Their difference is the gap, which can be reported at any time, so the search may stop as soon as the gap is small enough.",
        "未处理分支的最大界和当前最好解的值夹住真正的最优值。它们的差是间隙，可以随时报告，所以间隙足够小时搜索就可以停止。",
      ],
      (rng) => {
        const inc = rng.int(50, 400);
        const bounds = [inc + rng.int(1, 30), inc + rng.int(1, 30), inc + rng.int(1, 30)];
        const top = Math.max(...bounds);
        return ask(
          [
            `Maximizing, the incumbent has value ${inc}, and the open branches have bounds $${bounds.join(", ")}$. What is the gap?`,
            `在最大化中，当前最好解的值是 ${inc}，未处理分支的界是 $${bounds.join(", ")}$。间隙是多少？`,
          ],
          top - inc,
          [Math.min(...bounds) - inc === top - inc ? top - inc + 1 : Math.min(...bounds) - inc, top, top - inc + 1],
          [`Use the largest bound, ${top}, minus the incumbent ${inc}.`, `用最大的界 ${top} 减去当前最好解 ${inc}。`],
        );
      },
    ),
  ],
);

const knapsack = topic(
  "the-knapsack-problem",
  ["The Knapsack Problem", "背包问题"],
  ["Compare the greedy relaxation with the true integer optimum.", "比较贪心松弛和真正的整数最优解。"],
  ["integer-programming"],
  [],
  [
    point(
      "the-relaxation-by-ratios",
      ["The relaxation by ratios", "按比值的松弛"],
      [
        "If fractions of items are allowed, the optimal rule is greedy: take items in order of value per unit weight, until the capacity runs out. So only one item is ever fractional, and this gives a quick upper bound.",
        "如果允许取物品的一部分，最优规则是贪心的：按单位重量价值的顺序取，直到容量用完。所以至多一个物品是分数，这给出一个快速的上界。",
      ],
      (rng) => {
        const w1 = rng.int(2, 9);
        const w2 = rng.int(2, 9);
        const r1 = rng.int(8, 12);
        const r2 = rng.int(3, 7);
        const cap = w1 + rng.int(1, w2 - 1);
        const left = cap - w1;
        return ask(
          [
            `Item A has weight ${w1} and value ${r1 * w1}, and item B has weight ${w2} and value ${r2 * w2}. With capacity ${cap} and fractions allowed, what is the best total value?`,
            `物品 A 重 ${w1}，价值 ${r1 * w1}；物品 B 重 ${w2}，价值 ${r2 * w2}。容量为 ${cap} 且允许取部分时，最佳总价值是多少？`,
          ],
          r1 * w1 + r2 * left,
          [r1 * w1, r1 * w1 + r2 * w2, r1 * cap],
          [
            `A has the better ratio, so take all of it, and then ${left} units of B at ${r2} per unit.`,
            `A 的比值更好，所以全取，再取 B 的 ${left} 单位，每单位 ${r2}。`,
          ],
        );
      },
    ),
    point(
      "the-integer-optimum",
      ["The integer optimum", "整数最优解"],
      [
        "With whole items only, the greedy choice can be wrong, because it may leave capacity unused. A small instance can be solved by checking the subsets, and a larger one by dynamic programming over the capacity.",
        "只能取整个物品时，贪心选择可能出错，因为它可能留下未用的容量。小实例可以检查子集来解，大实例可以对容量做动态规划。",
      ],
      (rng) => {
        const items = Array.from({ length: 4 }, () => ({ w: rng.int(2, 12), v: rng.int(3, 40) }));
        const total = items.reduce((sum, it) => sum + it.w, 0);
        const cap = rng.int(Math.max(...items.map((it) => it.w)), total - 1);
        let best = 0;
        for (let mask = 0; mask < 16; mask++) {
          let w = 0;
          let v = 0;
          items.forEach((it, i) => {
            if (mask & (1 << i)) {
              w += it.w;
              v += it.v;
            }
          });
          if (w <= cap && v > best) best = v;
        }
        const sumV = items.reduce((sum, it) => sum + it.v, 0);
        return ask(
          [
            `Items have (weight, value) pairs ${items.map((it) => `(${it.w}, ${it.v})`).join(", ")}. With capacity ${cap} and whole items only, what is the best total value?`,
            `物品的（重量，价值）是 ${items.map((it) => `(${it.w}, ${it.v})`).join(", ")}。容量为 ${cap} 且只能取整个物品时，最佳总价值是多少？`,
          ],
          best,
          [sumV === best ? best + 2 : sumV, best + 1, best === 1 ? 2 : best - 1],
          [
            `Check the subsets whose total weight is at most ${cap}; the best value is ${best}.`,
            `检查总重量不超过 ${cap} 的子集；最佳价值是 ${best}。`,
          ],
        );
      },
    ),
    point(
      "a-step-of-dynamic-programming",
      ["A step of dynamic programming", "动态规划的一步"],
      [
        "Let $f(c)$ be the best value at capacity $c$ with the items so far. For a new item of weight $w$ and value $v$, we have $f'(c) = \\max(f(c), f(c - w) + v)$, which compares leaving the item out with taking it.",
        "设 $f(c)$ 是容量 $c$ 时用目前物品的最佳价值。对重量 $w$、价值 $v$ 的新物品，$f'(c) = \\max(f(c), f(c - w) + v)$，比较不取和取这个物品。",
      ],
      (rng) => {
        const a = rng.int(5, 60);
        const b = rng.int(5, 60);
        const v = rng.int(3, 40);
        const w = rng.int(2, 9);
        const c = w + rng.int(1, 20);
        return ask(
          [
            `Before a new item of weight ${w} and value ${v}, $f(${c}) = ${a}$ and $f(${c - w}) = ${b}$. What is the new $f(${c})$?`,
            `在重量 ${w}、价值 ${v} 的新物品之前，$f(${c}) = ${a}$，$f(${c - w}) = ${b}$。新的 $f(${c})$ 是多少？`,
          ],
          Math.max(a, b + v),
          [Math.min(a, b + v), a + b + v, a + v === Math.max(a, b + v) ? a + v + 1 : a + v],
          [`Compare ${a} with $${b} + ${v}$, and keep the larger one.`, `比较 ${a} 和 $${b} + ${v}$，取较大的。`],
        );
      },
    ),
  ],
);

const unimodular = topic(
  "total-unimodularity",
  ["Total Unimodularity", "全单模性"],
  ["See why network programs give whole number answers without integer constraints.", "了解为什么网络规划不加整数约束也给出整数解。"],
  ["integer-programming", "the-assignment-problem"],
  [],
  [
    point(
      "the-determinant-test",
      ["The determinant test", "行列式检验"],
      [
        "A matrix is totally unimodular when every square submatrix has determinant 0, 1 or $-1$. So a single submatrix with a different determinant is enough to show that the matrix does not have this property.",
        "矩阵是全单模的，当且仅当每个方子矩阵的行列式是 0、1 或 $-1$。所以只要有一个子矩阵的行列式不同，就说明矩阵没有这个性质。",
      ],
      (rng) => {
        const [a, b, c, d] = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
        return ask(
          [
            `What is the determinant of the submatrix $\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$?`,
            `子矩阵 $\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$ 的行列式是多少？`,
          ],
          a * d - b * c,
          [
            a * d + b * c,
            b * c - a * d === a * d - b * c ? a * d - b * c + 1 : b * c - a * d,
            a + d === a * d - b * c ? a * d - b * c + 2 : a + d,
          ],
          [`Compute $(${a})(${d}) - (${b})(${c})$.`, `计算 $(${a})(${d}) - (${b})(${c})$。`],
        );
      },
    ),
    point(
      "whole-number-corners",
      ["Whole number corners", "整数角点"],
      [
        "By Cramer's rule, each basic value is an integer divided by the determinant of the basis. When that determinant is $\\pm 1$ and the right side is whole, every corner is a whole number point, so rounding is never needed.",
        "由克拉默法则，每个基本变量的值是整数除以基的行列式。当行列式是 $\\pm 1$ 且右端是整数时，每个角点都是整数点，所以不需要取整。",
      ],
      (rng) => {
        const big = rng.int(2, 9);
        const b1 = rng.int(1, 60);
        const b2 = rng.int(1, 60);
        const nice = rng.bool();
        const det = nice ? 1 : big;
        return ask(
          [
            `A basis has determinant ${det}, and Cramer's rule gives a numerator of ${b1 * big + b2} for one basic variable. What is that variable's value?`,
            `基的行列式是 ${det}，克拉默法则给出一个基本变量的分子是 ${b1 * big + b2}。这个变量的值是多少？`,
          ],
          Q.of(b1 * big + b2, det),
          [Q.of(b1 * big + b2 + 1, det), Q.of(det, b1 * big + b2), b1 * big + b2 + det],
          [`Divide the numerator ${b1 * big + b2} by the determinant ${det}.`, `用行列式 ${det} 除分子 ${b1 * big + b2}。`],
        );
      },
    ),
    point(
      "recognizing-network-matrices",
      ["Recognizing network matrices", "识别网络矩阵"],
      [
        "Node-arc incidence matrices of directed graphs are totally unimodular, and so are bipartite incidence matrices. That is why transportation, assignment and flow problems give whole number answers from plain linear programs.",
        "有向图的结点-弧关联矩阵是全单模的，二部图的关联矩阵也是。这就是运输、指派和流问题用普通线性规划就给出整数解的原因。",
      ],
      (rng) => {
        const n = rng.int(3, 40);
        const family = rng.int(0, 2);
        const name: [string, string] =
          family === 0
            ? [`a transportation problem with ${n} sources`, `有 ${n} 个产地的运输问题`]
            : family === 1
              ? [`an assignment problem with ${n} workers`, `有 ${n} 名工人的指派问题`]
              : [`a maximum flow problem with ${n} nodes`, `有 ${n} 个结点的最大流问题`];
        const right: [string, string] = [
          "Its corners are whole numbers, so the plain relaxation is enough",
          "它的角点是整数，所以普通松弛就够了",
        ];
        return choose(
          rng,
          [
            `With whole number data, what do we know about solving ${name[0]} as a linear program?`,
            `数据是整数时，关于把${name[1]}当作线性规划求解，我们知道什么？`,
          ],
          right,
          [
            ["Its corners are fractional, so branching is required", "它的角点是分数，所以需要分支"],
            ["It has no optimal corner at all", "它根本没有最优角点"],
            ["Its dual always fails to exist", "它的对偶总是不存在"],
          ],
          [`Its constraint matrix is a network matrix, which is totally unimodular.`, `它的约束矩阵是网络矩阵，是全单模的。`],
        );
      },
    ),
  ],
);

const goal = topic(
  "goal-programming",
  ["Goal Programming", "目标规划"],
  ["Balance several competing targets using deviation variables and priorities.", "用偏差变量和优先级平衡多个相互竞争的目标。"],
  ["linearizing-absolute-values-and-minimax"],
  [],
  [
    point(
      "deviation-variables",
      ["Deviation variables", "偏差变量"],
      [
        "A goal is written as $f(x) + d^{-} - d^{+} = t$, where $d^{-}$ measures a shortfall and $d^{+}$ measures an excess. At any plan, at most one of the two is positive, since they measure opposite failures.",
        "目标写成 $f(x) + d^{-} - d^{+} = t$，其中 $d^{-}$ 衡量不足，$d^{+}$ 衡量超出。在任何方案中两者至多一个为正，因为它们衡量相反的偏离。",
      ],
      (rng) => {
        const t = rng.int(20, 200);
        const f = t + rng.int(-30, 30);
        const under = rng.bool();
        return ask(
          [
            `A goal has target ${t}, and a plan achieves ${f}. What is the ${under ? "shortfall $d^{-}$" : "excess $d^{+}$"}?`,
            `目标值是 ${t}，方案达到 ${f}。${under ? "不足 $d^{-}$" : "超出 $d^{+}$"} 是多少？`,
          ],
          under ? Math.max(t - f, 0) : Math.max(f - t, 0),
          under
            ? [Math.max(f - t, 0) === Math.max(t - f, 0) ? 1 : Math.max(f - t, 0), t - f === Math.max(t - f, 0) ? t + 1 : t - f, f]
            : [Math.max(t - f, 0) === Math.max(f - t, 0) ? 1 : Math.max(t - f, 0), f - t === Math.max(f - t, 0) ? f + 1 : f - t, t],
          [
            `Compare the achieved ${f} with the target ${t}; a deviation variable is never negative.`,
            `比较达到的 ${f} 和目标 ${t}；偏差变量永远不为负。`,
          ],
        );
      },
    ),
    point(
      "a-weighted-penalty",
      ["A weighted penalty", "加权罚分"],
      [
        "A weighted goal program minimizes a sum of deviations, each multiplied by a penalty. Only the unwanted direction of each goal is charged, so exceeding a profit target costs nothing while falling short does.",
        "加权目标规划最小化偏差之和，每个偏差乘一个罚数。每个目标只对不希望的方向收费，所以超过利润目标不花钱，而不足才收费。",
      ],
      (rng) => {
        const [t1, t2] = [rng.int(50, 200), rng.int(20, 90)];
        const [f1, f2] = [t1 + rng.int(-25, 25), t2 + rng.int(-20, 20)];
        const [w1, w2] = [rng.int(1, 9), rng.int(1, 9)];
        const pen = w1 * Math.max(t1 - f1, 0) + w2 * Math.max(f2 - t2, 0);
        return ask(
          [
            `Profit should reach ${t1} and overtime should not exceed ${t2}, with penalties ${w1} and ${w2} per unit. A plan has profit ${f1} and overtime ${f2}. What is the total penalty?`,
            `利润应达到 ${t1}，加班不应超过 ${t2}，每单位罚数是 ${w1} 和 ${w2}。方案的利润是 ${f1}，加班是 ${f2}。总罚分是多少？`,
          ],
          pen,
          [
            w1 * Math.abs(t1 - f1) + w2 * Math.abs(f2 - t2) === pen ? pen + 1 : w1 * Math.abs(t1 - f1) + w2 * Math.abs(f2 - t2),
            pen + w1,
            pen + w2 + 1,
          ],
          [
            `Charge only a profit shortfall and an overtime excess, each at its own penalty.`,
            `只对利润不足和加班超出收费，各按自己的罚数计算。`,
          ],
        );
      },
    ),
    point(
      "priorities-come-first",
      ["Priorities come first", "优先级优先"],
      [
        "In preemptive goal programming, a higher priority goal is never traded for a lower one. Plans are compared first on the top goal's deviation, and only ties are settled by the next goal in the list.",
        "在抢占式目标规划中，高优先级目标绝不用来交换低优先级目标。方案先比较最高目标的偏差，只有相同时才由下一个目标决定。",
      ],
      (rng) => {
        const a1 = rng.int(1, 30);
        const b1 = a1 + rng.int(1, 20);
        const a2 = rng.int(20, 60);
        const b2 = rng.int(0, 19);
        const flip = rng.bool();
        const [p1, p2, q1, q2] = flip ? [b1, b2, a1, a2] : [a1, a2, b1, b2];
        const good: [string, string] = [flip ? "Plan Q" : "Plan P", flip ? "方案 Q" : "方案 P"];
        const bad: [string, string] = [flip ? "Plan P" : "Plan Q", flip ? "方案 P" : "方案 Q"];
        return choose(
          rng,
          [
            `Plan P has deviations ${p1} on the first goal and ${p2} on the second. Plan Q has ${q1} and ${q2}. The first goal has strict priority. Which plan is better?`,
            `方案 P 在第一个目标上偏差 ${p1}，在第二个目标上偏差 ${p2}。方案 Q 分别是 ${q1} 和 ${q2}。第一个目标有严格优先级。哪个方案更好？`,
          ],
          good,
          [bad, ["They are tied", "它们相同"], ["It depends on the total of the deviations", "取决于偏差的总和"]],
          [
            `The first goal decides here, because its deviations ${a1} and ${b1} differ.`,
            `这里由第一个目标决定，因为它的偏差 ${a1} 和 ${b1} 不同。`,
          ],
        );
      },
    ),
  ],
);

const gamesLp = topic(
  "solving-matrix-games-by-linear-programming",
  ["Solving Matrix Games by Linear Programming", "用线性规划解矩阵博弈"],
  [
    "Turn a mixed strategy search into a linear program, and read the game value from it.",
    "把混合策略的搜索变成线性规划，并从中读出博弈的值。",
  ],
  ["matrix-games", "strong-duality-and-complementary-slackness"],
  [],
  [
    point(
      "a-mixed-strategy-for-two-by-two",
      ["A mixed strategy for two by two", "二乘二的混合策略"],
      [
        "For the row player in $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ with no saddle point, the best mix makes both columns pay the same. This gives the probability $\\frac{d - c}{a + d - b - c}$ for the first row.",
        "对没有鞍点的 $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ 中的行玩家，最佳混合使两列的收益相同。这给出第一行的概率 $\\frac{d - c}{a + d - b - c}$。",
      ],
      (rng) => {
        const [a, d] = [rng.int(6, 20), rng.int(6, 20)];
        const [b, c] = [rng.int(0, 5), rng.int(0, 5)];
        const den = a + d - b - c;
        return ask(
          [
            `In the game $\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$, with what probability should the row player choose row 1?`,
            `在博弈 $\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$ 中，行玩家应以什么概率选第 1 行？`,
          ],
          Q.of(d - c, den),
          [Q.of(a - b, den), Q.of(a, a + d), Q.of(d - b, den + 1)],
          [
            `Equalize the columns, which gives $\\frac{${d} - ${c}}{${den}}$ for row 1.`,
            `使两列相等，得第 1 行的概率 $\\frac{${d} - ${c}}{${den}}$。`,
          ],
        );
      },
    ),
    point(
      "the-value-of-the-game",
      ["The value of the game", "博弈的值"],
      [
        "Strong duality shows that the row player's best guarantee equals the column player's best guarantee, which is the minimax theorem. For a two by two game without a saddle point, the value is $\\frac{ad - bc}{a + d - b - c}$.",
        "强对偶性说明行玩家的最佳保证等于列玩家的最佳保证，这就是极小极大定理。对没有鞍点的二乘二博弈，值是 $\\frac{ad - bc}{a + d - b - c}$。",
      ],
      (rng) => {
        const [a, d] = [rng.int(6, 20), rng.int(6, 20)];
        const [b, c] = [rng.int(0, 5), rng.int(0, 5)];
        const den = a + d - b - c;
        return ask(
          [
            `What is the value of the game $\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$?`,
            `博弈 $\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$ 的值是多少？`,
          ],
          Q.of(a * d - b * c, den),
          [Q.of(a * d + b * c, den), Q.of(a + d, 2), Q.of(a * d - b * c, den + 1)],
          [
            `Compute $\\frac{${a} \\cdot ${d} - ${b} \\cdot ${c}}{${den}}$.`,
            `计算 $\\frac{${a} \\cdot ${d} - ${b} \\cdot ${c}}{${den}}$。`,
          ],
        );
      },
    ),
    point(
      "shifting-and-rescaling",
      ["Shifting and rescaling", "平移和缩放"],
      [
        "To set up the program, add a constant so all payoffs are positive, which raises the value by that constant. Then with $x_i = \\frac{p_i}{v}$, we minimize $\\sum x_i$, whose optimum is $\\frac{1}{v}$.",
        "建立规划时，加一个常数使所有收益为正，值也增加这个常数。然后令 $x_i = \\frac{p_i}{v}$，最小化 $\\sum x_i$，它的最优值是 $\\frac{1}{v}$。",
      ],
      (rng) => {
        const v = rng.int(2, 30);
        const opt = Q.of(1, v);
        const k = rng.int(1, 20);
        return ask(
          [
            `After adding ${k} to every payoff, the program's optimal $\\sum x_i$ is $${opt.toLatex()}$. What is the value of the original game?`,
            `每个收益加 ${k} 后，规划的最优 $\\sum x_i$ 是 $${opt.toLatex()}$。原博弈的值是多少？`,
          ],
          v - k,
          [v, v + k, k === v - k ? k + 1 : k],
          [
            `The shifted game has value ${v}, the reciprocal of the optimum, and we then subtract ${k}.`,
            `平移后的博弈的值是 ${v}，即最优值的倒数，再减去 ${k}。`,
          ],
        );
      },
    ),
  ],
);

const columnGeneration = topic(
  "column-generation",
  ["Column Generation", "列生成"],
  [
    "Solve huge programs by creating only the columns that are needed, as in cutting stock.",
    "只产生需要的列来解巨大的规划，例如下料问题。",
  ],
  ["the-revised-simplex-method"],
  [],
  [
    point(
      "a-lower-bound-on-rolls",
      ["A lower bound on rolls", "卷数的下界"],
      [
        "In cutting stock, orders must be cut from rolls of fixed width, and there may be an enormous number of cutting patterns. The total width ordered divided by the roll width gives a simple lower bound on the number of rolls.",
        "在下料问题中，订单要从固定宽度的卷上切割，切割方式的数量可能极大。订购的总宽度除以卷宽，给出卷数的一个简单下界。",
      ],
      (rng) => {
        const big = rng.pick([10, 12, 15, 20, 25]);
        const w = [rng.int(2, 7), rng.int(2, 7)] as [number, number];
        const n = [rng.int(5, 40), rng.int(5, 40)] as [number, number];
        const total = w[0] * n[0] + w[1] * n[1];
        return ask(
          [
            `Rolls have width ${big}. Orders are ${n[0]} pieces of width ${w[0]} and ${n[1]} pieces of width ${w[1]}. What is the smallest whole number of rolls allowed by total width?`,
            `卷宽是 ${big}。订单是 ${n[0]} 件宽 ${w[0]} 和 ${n[1]} 件宽 ${w[1]}。按总宽度，卷数的最小整数是多少？`,
          ],
          Math.ceil(total / big),
          [
            Math.ceil(total / big) + 1,
            Math.floor(total / big) === Math.ceil(total / big) ? Math.ceil(total / big) + 2 : Math.floor(total / big),
            n[0] + n[1],
          ],
          [`The total width is ${total}; divide by ${big} and round up.`, `总宽度是 ${total}；除以 ${big} 再向上取整。`],
        );
      },
    ),
    point(
      "pricing-a-pattern",
      ["Pricing a pattern", "为切割方式定价"],
      [
        "Rather than listing all patterns, we ask whether any pattern has negative reduced cost. A pattern uses one roll, at a cost of 1, and earns the dual value of each piece, so its reduced cost is $1 - \\sum y_i a_i$.",
        "不列出所有切割方式，而是问是否有检验数为负的切割方式。一种切割方式用一卷，成本是 1，并赚取每件的对偶值，所以检验数是 $1 - \\sum y_i a_i$。",
      ],
      (rng) => {
        const den = rng.pick([4, 5, 6, 8, 10, 12, 16, 20]);
        const [y1, y2] = [rng.int(1, den - 1), rng.int(1, den - 1)];
        const [a1, a2] = [rng.int(1, 4), rng.int(1, 4)];
        return ask(
          [
            `With dual values $${Q.of(y1, den).toLatex()}$ and $${Q.of(y2, den).toLatex()}$, a pattern cuts ${a1} and ${a2} pieces of the two widths. What is its reduced cost?`,
            `对偶值是 $${Q.of(y1, den).toLatex()}$ 和 $${Q.of(y2, den).toLatex()}$，一种切割方式切两种宽度各 ${a1} 和 ${a2} 件。它的检验数是多少？`,
          ],
          Q.of(den - y1 * a1 - y2 * a2, den),
          [Q.of(y1 * a1 + y2 * a2, den), Q.of(den + y1 * a1 + y2 * a2, den), Q.of(den - y1 - y2 + 1, den)],
          [`Subtract the earned value from the cost 1 of the roll.`, `从一卷的成本 1 中减去赚取的价值。`],
        );
      },
    ),
    point(
      "the-best-new-pattern",
      ["The best new pattern", "最好的新切割方式"],
      [
        "Finding the most attractive pattern is itself a knapsack problem: maximize the total dual value of the pieces, subject to fitting in the roll. If the best value is at most 1, the current solution is optimal.",
        "寻找最有吸引力的切割方式本身就是背包问题：在能放入卷中的条件下，最大化各件的对偶总价值。如果最佳价值不超过 1，当前解就是最优的。",
      ],
      (rng) => {
        const big = rng.int(8, 30);
        const [w1, w2] = rng.sample([2, 3, 4, 5, 6, 7], 2) as [number, number];
        const [v1, v2] = [rng.int(1, 12), rng.int(1, 12)];
        let best = 0;
        for (let a = 0; a * w1 <= big; a++) {
          const b = Math.floor((big - a * w1) / w2);
          best = Math.max(best, a * v1 + b * v2);
        }
        return ask(
          [
            `Pieces of width ${w1} and ${w2} have the dual values ${v1} and ${v2}, in hundredths. What is the largest total value, in hundredths, that fits in a roll of width ${big}?`,
            `宽 ${w1} 和宽 ${w2} 的件的对偶值是 ${v1} 和 ${v2}（单位：百分之一）。在宽 ${big} 的卷中能放下的最大总价值（单位：百分之一）是多少？`,
          ],
          best,
          [
            best + 1,
            best === 1 ? 2 : best - 1,
            Math.floor(big / w1) * v1 + Math.floor(big / w2) * v2 === best
              ? best + 2
              : Math.floor(big / w1) * v1 + Math.floor(big / w2) * v2,
          ],
          [`Try each count of the first piece, and fill what is left with the second.`, `试第一种件的每个件数，再用第二种件填满剩余部分。`],
        );
      },
    ),
  ],
);

/** linearProgrammingExtraTopics holds the topics that complete the Linear Programming course. */
export const linearProgrammingExtraTopics: readonly TopicDef[] = [
  polyhedra,
  bland,
  boundedVariables,
  complexity,
  modeling,
  linearizing,
  piecewise,
  shadow,
  objectiveRanging,
  addRow,
  matrixForm,
  startingPlans,
  hungarian,
  networkSimplex,
  branchBound,
  knapsack,
  unimodular,
  goal,
  gamesLp,
  columnGeneration,
];
