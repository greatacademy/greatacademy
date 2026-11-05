// A third knowledge point for the short exam and probability topics, one map for each shard that holds them.

import type { KnowledgePointDef } from "@ga/content";
import { gcd, Q } from "@ga/subject-math";

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
            `$${a * a} + ${b * b} = ${c * c}$, whose root is ${c}, and $${k} \\times ${c} + ${add} = ${k * c + add}$.`,
            `$${a * a} + ${b * b} = ${c * c}$，开方得 ${c}，$${k} \\times ${c} + ${add} = ${k * c + add}$。`,
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
    skill(
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
            `What is the ${min ? "minimum" : "maximum"} value of $f(x) = (x ${h < 0 ? `+ ${-h}` : `- ${h}`})^{2}${k < 0 ? ` - ${-k}` : ` + ${k}`}$ on the interval $${left} \\le x \\le ${right}$?`,
            `$f(x) = (x ${h < 0 ? `+ ${-h}` : `- ${h}`})^{2}${k < 0 ? ` - ${-k}` : ` + ${k}`}$ 在区间 $${left} \\le x \\le ${right}$ 上的${min ? "最小值" : "最大值"}是多少？`,
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
  ],
};

/** deeperCollegeThirdPoints holds the third knowledge points of the college shard's probability topics, by topic. */
export const deeperCollegeThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "experimental-probability": [
    skill(
      "more-trials-for-a-steadier-estimate",
      ["More trials for a steadier estimate", "试验越多估计越稳定"],
      [
        "An experimental probability wanders when trials are few and settles near the true value as trials grow. So the estimate from the most trials is the one to trust.",
        "试验次数少时实验概率波动大，次数增多后稳定在真实值附近。所以试验次数最多的估计最可信。",
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
            `More trials give a steadier estimate, and ${most} is the largest number of spins.`,
            `试验越多，估计越稳定，${most} 是最多的次数。`,
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
        "A prediction multiplies an experimental probability by the number of future trials. When some trials have already happened, predict only those left and add what has been seen.",
        "预测就是用实验概率乘将来的试验次数。如果一些试验已经发生，只预测剩下的，再加上已看到的。",
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
            `The rate is $${frac(seen, done)} = ${frac(n / gcd(n, d), d / gcd(n, d))}$, and $${frac(n / gcd(n, d), d / gcd(n, d))} \\times ${left} = ${expected}$.`,
            `比率是 $${frac(seen, done)} = ${frac(n / gcd(n, d), d / gcd(n, d))}$，$${frac(n / gcd(n, d), d / gcd(n, d))} \\times ${left} = ${expected}$。`,
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
        "An or event counts everything in a row together with everything in a column. The cell where they meet appears in both, so it must be counted only once.",
        "“或”事件要把一行的全部和一列的全部都算上。行列相交的格子在两者中都出现，只能算一次。",
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
            `$${a} + ${b} + ${c} = ${a + b + c}$ people qualify out of ${n}, as ${a} is counted once.`,
            `共 ${n} 人中有 $${a} + ${b} + ${c} = ${a + b + c}$ 人符合，${a} 只算一次。`,
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
        "Neither event happening is the complement of at least one happening. So find the probability of the union with the addition rule, and then take it away from 1.",
        "两事件都不发生，是至少一个发生的补事件。所以先用加法公式求并事件的概率，再用 1 减去它。",
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
            `$P(A \\cup B) = ${a} + ${b} - ${both} = ${safeUnion}$ percent, and the complement is ${100 - safeUnion} percent.`,
            `$P(A \\cup B) = ${a} + ${b} - ${both} = ${safeUnion}$%，补事件是 ${100 - safeUnion}%。`,
          ],
        );
      },
    ),
  ],
};
