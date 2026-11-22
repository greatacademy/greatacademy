// A third knowledge point for the short exam and probability topics, one map for each shard that holds them.

import type { KnowledgePointDef } from "@ga/content";
import { gcd, Q } from "@ga/subject-math";
import { gradeDrawings5 } from "../explanation-drawings-grades-5.ts";

import { choose, chooseMath, whole } from "./early-grades-more-kit.ts";
import { frac, fraction, skill } from "./third-kit.ts";

/** deeperExamThirdPoints holds the third knowledge points of the exam shard's topics, by topic. */
export const deeperExamThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "evaluating-numerical-expressions-containing-radicals": [
    skill(
      "a-root-over-a-whole-expression",
      ["A root over a whole expression", "覆盖整个式子的根号"],
      [
        "The bar of a root groups everything beneath it, so the whole expression is worked out before the root is taken. The root of a sum is not the sum of the roots.",
        "根号的横线把下面的内容都括在一起，所以先算出整个式子，再开方。和的平方根不等于平方根的和。",
      ],
      (rng) => {
        const [a, b, c] = rng.pick<[number, number, number]>([
          [3, 4, 5],
          [6, 8, 10],
          [5, 12, 13],
          [8, 15, 17],
          [9, 12, 15],
          [7, 24, 25],
          [20, 21, 29],
          [12, 16, 20],
          [15, 20, 25],
          [10, 24, 26],
        ]);
        const k = rng.int(2, 7);
        const add = rng.int(1, 30);
        return whole(
          [`Evaluate $${k}\\sqrt{${a * a} + ${b * b}} + ${add}$.`, `计算 $${k}\\sqrt{${a * a} + ${b * b}} + ${add}$。`],
          k * c + add,
          [k * (a + b) + add, k * c, c + add],
          [
            `$${a * a} + ${b * b} = ${c * c}$, whose root is $${c}$, and $${k} \\times ${c} + ${add} = ${k * c + add}$.`,
            `$${a * a} + ${b * b} = ${c * c}$，开方得 $${c}$，$${k} \\times ${c} + ${add} = ${k * c + add}$。`,
          ],
        );
      },
    ),
  ],
  "simplifying-expressions-with-surds": [
    skill(
      "the-product-of-conjugate-surds",
      ["The product of conjugate surds", "共轭根式的积"],
      [
        "The product of a sum and a difference of the same two terms is a difference of squares. With surds this removes every root, which is why such pairs are used to rationalize denominators.",
        "同样两项的和与差相乘，得到平方差。对根式来说这会去掉所有根号，所以这样的一对可用来有理化分母。",
      ],
      (rng) => {
        const a = rng.int(2, 12);
        const r = rng.pick([2, 3, 5, 6, 7, 10, 11]);
        const k = rng.int(1, 4);
        const answer = a * a - k * k * r;
        const shown = k === 1 ? `\\sqrt{${r}}` : `${k}\\sqrt{${r}}`;
        return chooseMath(
          rng,
          [`Simplify $(${a} + ${shown})(${a} - ${shown})$.`, `化简 $(${a} + ${shown})(${a} - ${shown})$。`],
          `${answer}`,
          [`${a * a + k * k * r}`, `${(a - k) * (a + k)}`, `${a * a} - 2 \\cdot ${a} \\cdot ${shown}`],
          [
            `$${a}^{2} - (${shown})^{2} = ${a * a} - ${k * k * r} = ${answer}$.`,
            `$${a}^{2} - (${shown})^{2} = ${a * a} - ${k * k * r} = ${answer}$。`,
          ],
        );
      },
    ),
  ],
  "identifying-the-number-of-solutions-to-a-system-by-inspection": [
    skill(
      "the-value-giving-infinitely-many-solutions",
      ["The value giving infinitely many solutions", "使解有无穷多个的值"],
      [
        "A system has infinitely many solutions when one equation is a multiple of the other, constant included. So the ratio of the known coefficients sets the value of the unknown one.",
        "一个方程是另一个方程的倍数（包括常数）时，方程组有无穷多个解。所以已知系数之比决定未知的值。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const c = rng.int(2, 15);
        const m = rng.int(2, 6);
        return whole(
          [
            `For what value of $k$ does the system $${a}x + ${b}y = ${c}$ and $${a * m}x + ${b * m}y = k$ have infinitely many solutions?`,
            `$k$ 为何值时，方程组 $${a}x + ${b}y = ${c}$ 和 $${a * m}x + ${b * m}y = k$ 有无穷多个解？`,
          ],
          c * m,
          [c, c + m, c * m + 1],
          [
            `The second left side is ${m} times the first, so $k = ${m} \\times ${c} = ${c * m}$.`,
            `第二个方程的左边是第一个的 ${m} 倍，所以 $k = ${m} \\times ${c} = ${c * m}$。`,
          ],
        );
      },
    ),
  ],
  "identifying-maximum-and-minimum-values-of-a-function": [
    {
      ...skill(
        "the-extreme-value-on-an-interval",
        ["The extreme value on an interval", "区间上的最值"],
        [
          "On a closed interval, a parabola's greatest and least values occur at the vertex, if it lies inside, or at the ends. So compare these few values rather than only using the vertex.",
          "在闭区间上，抛物线的最大值和最小值出现在顶点（如果在区间内）或端点。所以要比较这几个值，不能只看顶点。",
        ],
        (rng) => {
          const h = rng.int(-4, 4);
          const k = rng.int(1, 9);
          const left = h + rng.int(1, 3);
          const right = left + rng.int(1, 4);
          const g = (x: number) => (x - h) ** 2 + k;
          const min = rng.bool();
          const answer = min ? g(left) : g(right);
          return chooseMath(
            rng,
            [
              `What is the ${min ? "minimum" : "maximum"} value of $f(x) = ${h === 0 ? "x" : `(x ${h < 0 ? `+ ${-h}` : `- ${h}`})`}^{2} + ${k}$ on the interval $${left} \\le x \\le ${right}$?`,
              `$f(x) = ${h === 0 ? "x" : `(x ${h < 0 ? `+ ${-h}` : `- ${h}`})`}^{2} + ${k}$ 在区间 $${left} \\le x \\le ${right}$ 上的${min ? "最小值" : "最大值"}是多少？`,
            ],
            `${answer}`,
            [`${min ? g(right) : g(left)}`, `${k}`, `${g(right) + g(left)}`],
            [
              `The vertex at $x = ${h}$ lies left of the interval, so $f$ rises throughout, and the ${min ? "left" : "right"} end gives ${answer}.`,
              `顶点 $x = ${h}$ 在区间左侧，所以 $f$ 在区间上一直上升，${min ? "左" : "右"}端点给出 ${answer}。`,
            ],
          );
        },
      ),
      figure: gradeDrawings5["identifying-maximum-and-minimum-values-of-a-function#the-extreme-value-on-an-interval"],
    },
  ],
};

/** deeperCollegeThirdPoints holds the third knowledge points of the college shard's probability topics, by topic. */
export const deeperCollegeThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "experimental-probability": [
    skill(
      "more-trials-for-a-steadier-estimate",
      ["More trials for a steadier estimate", "试验越多估计越稳定"],
      [
        "An experimental probability wanders when trials are few and settles near the true value as trials grow: with $10$ spins, one extra red moves the estimate by $\\frac{1}{10}$, but with $1000$ spins only by $\\frac{1}{1000}$. So the estimate from the most trials is the one to trust.\n\n> **Watch out.** A round-looking or familiar estimate is not more reliable. Judge by the number of trials, not by the value.",
        "试验次数少时实验概率波动大，次数增多后稳定在真实值附近：转 $10$ 次时，多一次红色会使估计变化 $\\frac{1}{10}$，转 $1000$ 次时只变化 $\\frac{1}{1000}$。所以试验次数最多的估计最可信。\n\n> **注意。** 估计值看起来整齐或熟悉，并不代表更可靠。要看试验次数，而不是看数值。",
      ],
      (rng) => {
        const counts = rng.shuffle([rng.int(5, 15), rng.int(20, 60), rng.int(100, 300), rng.int(1000, 5000)]);
        const most = Math.max(...counts);
        const student = (i: number): [string, string] => [
          `Group ${i + 1}, with ${counts[i]} spins`,
          `第 ${i + 1} 组，转了 ${counts[i]} 次`,
        ];
        const best = counts.indexOf(most);
        return choose(
          rng,
          [
            "Four groups each spin the same spinner and estimate the probability of red. Whose estimate should be trusted the most?",
            "四组同学转同一个转盘，估计转到红色的概率。谁的估计最可信？",
          ],
          student(best),
          [0, 1, 2, 3].filter((i) => i !== best).map(student),
          [
            `**Step 1: compare the trials.** The groups spun $${counts.join("$, $")}$ times. One extra red changes an estimate by $1$ divided by the number of spins, so the fewer the spins, the more the estimate jumps around.\n\n**Step 2: pick the most trials.** $${most}$ is the largest number of spins, so Group ${best + 1}'s estimate is the steadiest and should be trusted the most.\n\n**Check.** $${most}$ is larger than each of the other counts, $${counts.filter((x) => x !== most).join("$, $")}$, so no group spun more.`,
            `**第一步：比较试验次数。** 各组分别转了 $${counts.join("$、$")}$ 次。多一次红色会使估计变化 $1$ 除以转动次数，所以次数越少，估计波动越大。\n\n**第二步：选次数最多的。** $${most}$ 是最多的次数，所以第 ${best + 1} 组的估计最稳定，最可信。\n\n**检验。** $${most}$ 比其他各组的次数 $${counts.filter((x) => x !== most).join("$、$")}$ 都大，没有哪组转得更多。`,
          ],
        );
      },
    ),
  ],
  "using-experimental-probability-to-make-predictions": [
    skill(
      "predicting-from-a-total-remaining",
      ["Predicting what remains", "预测剩下的部分"],
      [
        'A prediction multiplies an experimental probability by the number of future trials: if $3$ of every $4$ throws have gone in, about $3$ of every $4$ of the next ones will too. When some trials have already happened, predict only those left, and add what has been seen if the question asks for a total.\n\n> **Watch out.** Read which count is asked for. "How many of the next throws" is the prediction alone; adding the throws already made answers a different question.',
        "预测就是用实验概率乘将来的试验次数：如果每 $4$ 次罚球进 $3$ 次，接下来也大约每 $4$ 次进 $3$ 次。如果一些试验已经发生，只预测剩下的；若问的是总数，再加上已看到的。\n\n> **注意。** 看清问的是哪个数。“接下来投中多少次”只是预测部分；加上已经投中的次数回答的是另一个问题。",
      ],
      (rng) => {
        const d = rng.pick([4, 5, 10, 20]);
        const n = rng.int(1, d - 1);
        const done = d * rng.int(2, 10);
        const seen = (done * n) / d;
        const left = d * rng.int(2, 20);
        const expected = (left * n) / d;
        return whole(
          [
            `A player has made ${seen} of ${done} free throws so far. At this rate, how many of the next ${left} throws would be expected to go in?`,
            `一名球员到目前为止 ${done} 次罚球投中 ${seen} 次。按这个比率，接下来 ${left} 次预计投中多少次？`,
          ],
          expected,
          [expected + seen, left - expected === expected ? expected + 1 : left - expected, left],
          [
            `**Step 1: find the rate.** The experimental probability of a basket is $${frac(seen, done)} = ${frac(n / gcd(n, d), d / gcd(n, d))}$.\n\n**Step 2: apply it to the throws left.** Only the next ${left} throws are asked about: $${frac(n / gcd(n, d), d / gcd(n, d))} \\times ${left} = ${expected}$.\n\n**Check.** Compare the rates: $${frac(expected, left)}$ and $${frac(seen, done)}$ cross-multiply to $${expected} \\times ${done} = ${expected * done}$ and $${seen} \\times ${left} = ${seen * left}$, which are equal, and $${expected}$ is between $0$ and $${left}$.`,
            `**第一步：求比率。** 投中的实验概率是 $${frac(seen, done)} = ${frac(n / gcd(n, d), d / gcd(n, d))}$。\n\n**第二步：用于剩下的罚球。** 只问接下来的 ${left} 次：$${frac(n / gcd(n, d), d / gcd(n, d))} \\times ${left} = ${expected}$。\n\n**检验。** 比较两个比率：$${frac(expected, left)}$ 与 $${frac(seen, done)}$ 交叉相乘得 $${expected} \\times ${done} = ${expected * done}$ 和 $${seen} \\times ${left} = ${seen * left}$，两者相等，且 $${expected}$ 在 $0$ 与 $${left}$ 之间。`,
          ],
        );
      },
    ),
  ],
  "compound-events-in-probability-from-experimental-data": [
    skill(
      "an-or-event-from-a-two-way-table",
      ["An or event from a two-way table", "由双向表求“或”事件"],
      [
        "An or event counts everything in a row together with everything in a column. The cell where they meet appears in both, so it must be counted only once: in a $2 \\times 2$ table that leaves three cells, and only the cell with neither property is left out.\n\n> **Watch out.** Adding the row total and the column total counts the shared cell twice. Either add the three cells, or subtract the shared cell once.",
        "“或”事件要把一行的全部和一列的全部都算上。行列相交的格子在两者中都出现，只能算一次：在 $2 \\times 2$ 的表中这就是三个格子，只有两种属性都没有的格子被排除。\n\n> **注意。** 把行合计与列合计相加会把公共格子算两次。要么把三个格子相加，要么把公共格子减去一次。",
      ],
      (rng) => {
        const a = rng.int(4, 30);
        const b = rng.int(4, 30);
        const c = rng.int(4, 30);
        const d = rng.int(4, 30);
        const n = a + b + c + d;
        const table = `\\begin{array}{|c|c|c|}\\hline & \\text{tea} & \\text{coffee} \\\\ \\hline \\text{student} & ${a} & ${b} \\\\ \\hline \\text{teacher} & ${c} & ${d} \\\\ \\hline\\end{array}`;
        const zh = `\\begin{array}{|c|c|c|}\\hline & \\text{茶} & \\text{咖啡} \\\\ \\hline \\text{学生} & ${a} & ${b} \\\\ \\hline \\text{老师} & ${c} & ${d} \\\\ \\hline\\end{array}`;
        return fraction(
          [
            `A survey gave this table. What is the experimental probability that a person chosen at random is a student or drinks tea? $$${table}$$`,
            `调查得到这张表。随机选一人，是学生或喝茶的实验概率是多少？$$${zh}$$`,
          ],
          Q.of(a + b + c, n),
          [Q.of(a + b + a + c, n), Q.of(a, n), Q.of(a + b, n)],
          [
            `**Step 1: find the cells.** A person qualifies if they are a student (the whole first row, $${a}$ and $${b}$) or drink tea (the first column, which adds the $${c}$ teachers). The $${a}$ students who drink tea are in both, and are counted once: $${a} + ${b} + ${c} = ${a + b + c}$.\n\n**Step 2: divide by the total.** Everyone surveyed is $${a} + ${b} + ${c} + ${d} = ${n}$, so the probability is $${frac(a + b + c, n)}$.\n\n**Check.** The only cell left out is the teachers who drink coffee, $${d}$, and $${n} - ${a + b + c} = ${d}$. By the totals, $${a + b} + ${a + c} - ${a} = ${a + b + c}$ as well.`,
            `**第一步：找出格子。** 是学生（整个第一行 $${a}$ 和 $${b}$）或喝茶（第一列，再加上 $${c}$ 名老师）的人都符合。喝茶的 $${a}$ 名学生两者都是，只算一次：$${a} + ${b} + ${c} = ${a + b + c}$。\n\n**第二步：除以总数。** 调查总人数是 $${a} + ${b} + ${c} + ${d} = ${n}$，所以概率是 $${frac(a + b + c, n)}$。\n\n**检验。** 唯一被排除的格子是喝咖啡的老师 $${d}$ 人，$${n} - ${a + b + c} = ${d}$。用合计算：$${a + b} + ${a + c} - ${a} = ${a + b + c}$，结果相同。`,
          ],
        );
      },
    ),
  ],
  "computing-probabilities-of-events-containing-complements-using-venn-diagrams": [
    skill(
      "neither-event-from-the-probabilities",
      ["Neither event, from the probabilities", "由概率求两事件都不发生"],
      [
        'Neither event happening is the region outside both circles of a Venn diagram, and everything else is inside at least one circle. So neither is the complement of the union: find $P(A \\cup B)$ with the addition rule, and then take it away from $1$.\n\n> **Watch out.** $1 - P(A) - P(B)$ takes the overlap away twice, and $1 - P(A \\cap B)$ is "not both", which still includes $A$ only and $B$ only.',
        "两事件都不发生是韦恩图中两圆之外的区域，其余部分都至少在一个圆内。所以“都不发生”是并事件的补事件：先用加法公式求 $P(A \\cup B)$，再用 $1$ 减去它。\n\n> **注意。** $1 - P(A) - P(B)$ 把重叠部分减了两次；$1 - P(A \\cap B)$ 是“不同时发生”，其中仍包括仅 $A$ 和仅 $B$。",
      ],
      (rng) => {
        const both = rng.int(1, 3) * 5;
        const a = both + rng.int(1, 8) * 5;
        const b = both + rng.int(1, 8) * 5;
        const safeUnion = a + b - both;
        return fraction(
          [
            `For events $A$ and $B$, $P(A) = ${a}\\%$, $P(B) = ${b}\\%$ and $P(A \\cap B) = ${both}\\%$. What is the probability of neither event, as a fraction?`,
            `事件 $A$、$B$ 满足 $P(A) = ${a}\\%$，$P(B) = ${b}\\%$，$P(A \\cap B) = ${both}\\%$。两事件都不发生的概率是多少（写成分数）？`,
          ],
          Q.of(100 - safeUnion, 100),
          [Q.of(safeUnion, 100), Q.of(Math.abs(100 - a - b) || 1, 100), Q.of(100 - both, 100)],
          [
            `**Step 1: find the union.** By the addition rule, $P(A \\cup B) = ${a}\\% + ${b}\\% - ${both}\\% = ${safeUnion}\\%$.\n\n**Step 2: take the complement.** Neither is everything outside the union: $100\\% - ${safeUnion}\\% = ${100 - safeUnion}\\% = ${Q.of(100 - safeUnion, 100).toLatex()}$.\n\n**Check.** Fill in the four regions: $A$ only $${a - both}\\%$, both $${both}\\%$, $B$ only $${b - both}\\%$, neither $${100 - safeUnion}\\%$. They add to $${a - both} + ${both} + ${b - both} + ${100 - safeUnion} = 100$ percent, and each lies between $0$ and $100$ percent.`,
            `**第一步：求并事件。** 由加法公式，$P(A \\cup B) = ${a}\\% + ${b}\\% - ${both}\\% = ${safeUnion}\\%$。\n\n**第二步：取补事件。** “都不发生”是并事件之外的一切：$100\\% - ${safeUnion}\\% = ${100 - safeUnion}\\% = ${Q.of(100 - safeUnion, 100).toLatex()}$。\n\n**检验。** 填出四个区域：仅 $A$ 为 $${a - both}\\%$，两者都有 $${both}\\%$，仅 $B$ 为 $${b - both}\\%$，都不为 $${100 - safeUnion}\\%$。它们之和 $${a - both} + ${both} + ${b - both} + ${100 - safeUnion} = 100$，且每个都在 $0$ 到 $100\\%$ 之间。`,
          ],
        );
      },
    ),
  ],
};
