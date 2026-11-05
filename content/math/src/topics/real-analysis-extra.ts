// The rest of a first course in Real Analysis: order and absolute value, nested intervals, limit points, the
// Cantor set, connectedness, monotone functions, bounded variation, the Stieltjes integral, tests for series,
// uniform limits, approximation, equicontinuity, metric compactness, and a first look at measure.

import type { TopicDef } from "@ga/content";
import { Q } from "@ga/subject-math";

import { ask, choose, point, same, topic } from "../university-kit.ts";

/** interval writes a closed interval in LaTeX. */
const interval = (a: number, b: number) => `[${a}, ${b}]`;

/** binomial returns n choose k for small numbers. */
const binomial = (n: number, k: number): number => (k === 0 ? 1 : (binomial(n, k - 1) * (n - k + 1)) / k);

const orderedField = topic(
  "the-real-numbers-as-an-ordered-field",
  ["The Real Numbers as an Ordered Field", "作为有序域的实数"],
  ["Use the order rules and absolute values that every proof in analysis relies on.", "使用分析证明都要依靠的序规则和绝对值。"],
  ["supremum-and-infimum"],
  [],
  [
    point(
      "multiplying-an-inequality-by-a-negative",
      ["Multiplying an inequality by a negative", "不等式乘负数"],
      [
        "An ordered field allows multiplying an inequality by a positive number, while a negative multiplier reverses the direction. So the largest value of a decreasing expression comes from the smallest allowed input.",
        "有序域允许不等式乘正数，而乘负数时方向相反。所以递减式子的最大值来自允许的最小输入。",
      ],
      (rng) => {
        const a = rng.int(1, 20);
        const b = rng.int(1, 20);
        const m = rng.int(2, 9);
        const c = rng.int(-20, 20);
        return ask(
          [
            `If $-${a} \\le x \\le ${b}$, what is the largest possible value of $${c} - ${m}x$?`,
            `若 $-${a} \\le x \\le ${b}$，$${c} - ${m}x$ 的最大可能值是多少？`,
          ],
          c + m * a,
          [c - m * b, c + m * b, c - m * a],
          [
            `Multiplying by $-${m}$ reverses the order, so the largest value comes from $x = -${a}$.`,
            `乘 $-${m}$ 使不等号反向，所以最大值来自 $x = -${a}$。`,
          ],
        );
      },
    ),
    point(
      "the-reverse-triangle-inequality",
      ["The reverse triangle inequality", "反向三角不等式"],
      [
        "The triangle inequality also gives a lower bound: the size of $x$ is at least the size of $a$ minus the distance from $x$ to $a$. Analysis uses this to keep a quantity away from zero.",
        "三角不等式也给出下界：$x$ 的绝对值至少是 $a$ 的绝对值减去 $x$ 到 $a$ 的距离。分析中用它使某个量远离零。",
      ],
      (rng) => {
        const d = rng.int(1, 12);
        const a = (d + rng.int(1, 25)) * (rng.bool() ? 1 : -1);
        return ask(
          [
            `If $|x - (${a})| < ${d}$, what is the greatest number that is sure to be a lower bound of $|x|$?`,
            `若 $|x - (${a})| < ${d}$，一定是 $|x|$ 的下界的最大数是多少？`,
          ],
          Math.abs(a) - d,
          [Math.abs(a) + d, d, Math.abs(a)],
          [
            `$|x| \\ge |${a}| - |x - (${a})|$, which is more than $${Math.abs(a)} - ${d}$.`,
            `$|x| \\ge |${a}| - |x - (${a})|$，它大于 $${Math.abs(a)} - ${d}$。`,
          ],
        );
      },
    ),
    point(
      "a-bound-for-a-reciprocal",
      ["A bound for a reciprocal", "倒数的界"],
      [
        "Proofs about limits of quotients need the denominator to stay away from zero. Once a lower bound for the size of $x$ is known, flipping it gives an upper bound for the reciprocal.",
        "关于商的极限的证明需要分母远离零。一旦知道 $x$ 绝对值的下界，取倒数就得到倒数的上界。",
      ],
      (rng) => {
        const d = rng.int(1, 12);
        const a = d + rng.int(1, 25);
        return ask(
          [
            `If $|x - ${a}| < ${d}$, what is the smallest number that is sure to be an upper bound of $\\frac{1}{|x|}$?`,
            `若 $|x - ${a}| < ${d}$，一定是 $\\frac{1}{|x|}$ 的上界的最小数是多少？`,
          ],
          Q.of(1, a - d),
          [Q.of(1, a + d), Q.of(1, a), Q.of(1, d)],
          [`Here $|x| > ${a - d}$, and taking reciprocals reverses the order.`, `这里 $|x| > ${a - d}$，取倒数时不等号反向。`],
        );
      },
    ),
  ],
);

const nestedIntervals = topic(
  "the-nested-interval-property",
  ["The Nested Interval Property", "闭区间套性质"],
  ["Trap a real number inside shrinking closed intervals.", "用不断缩小的闭区间夹住一个实数。"],
  ["the-monotone-convergence-theorem"],
  [],
  [
    point(
      "the-intersection-of-closed-intervals",
      ["The intersection of closed intervals", "闭区间的交"],
      [
        "Nested closed bounded intervals always have a common point, and the intersection is the interval from the supremum of the left ends to the infimum of the right ends. Its length is the limit of the lengths.",
        "闭有界区间套总有公共点，它们的交是从左端点的上确界到右端点的下确界的区间。交的长度是长度的极限。",
      ],
      (rng) => {
        const p = rng.int(-20, 20);
        const q = p + rng.int(1, 25);
        const k = rng.int(1, 9);
        return ask(
          [
            `For $n \\ge 1$, let $I_n = \\left[${p} - \\frac{${k}}{n}, ${q} + \\frac{${k}}{n}\\right]$. What is the length of $\\bigcap_{n \\ge 1} I_n$?`,
            `对 $n \\ge 1$，设 $I_n = \\left[${p} - \\frac{${k}}{n}, ${q} + \\frac{${k}}{n}\\right]$。$\\bigcap_{n \\ge 1} I_n$ 的长度是多少？`,
          ],
          q - p,
          [q - p + 2 * k, q - p + k, q],
          [
            `The ends tend to ${p} and ${q}, so the intersection is $${interval(p, q)}$.`,
            `端点趋于 ${p} 和 ${q}，所以交是 $${interval(p, q)}$。`,
          ],
        );
      },
    ),
    point(
      "bisecting-until-the-interval-is-small",
      ["Bisecting until the interval is small", "二分直到区间足够小"],
      [
        "Each bisection halves the length, so after $n$ steps an interval of length $L$ has length $L$ over $2^{n}$. Comparing this with the target shows how many steps a nested interval proof needs.",
        "每次二分使长度减半，所以 $n$ 步后长度为 $L$ 的区间长度变成 $L$ 除以 $2^{n}$。把它与目标比较，就知道区间套证明需要多少步。",
      ],
      (rng) => {
        const l = rng.int(1, 30);
        const m = rng.int(5, 200);
        let n = 0;
        for (let v = l; v * m >= 1 && n < 30; v /= 2) n++;
        return ask(
          [
            `An interval of length ${l} is bisected repeatedly. What is the fewest bisections after which the length is below $\\frac{1}{${m}}$?`,
            `长度为 ${l} 的区间反复二分。至少二分多少次后长度小于 $\\frac{1}{${m}}$？`,
          ],
          n,
          [n - 1, n + 1, l * m],
          [
            `We need $2^{n} > ${l * m}$, and the first power of 2 above that is $2^{${n}}$.`,
            `需要 $2^{n} > ${l * m}$，超过它的第一个 2 的幂是 $2^{${n}}$。`,
          ],
        );
      },
    ),
    point(
      "why-the-intervals-must-be-closed",
      ["Why the intervals must be closed", "为什么区间必须是闭的"],
      [
        "The property needs closed and bounded intervals. Open intervals can shrink toward an end point that none of them contains, and unbounded closed intervals can run away to infinity, leaving nothing in common.",
        "这个性质需要闭且有界的区间。开区间可以缩向一个都不包含的端点，无界闭区间可以跑向无穷，都没有公共点。",
      ],
      (rng) => {
        const k = rng.int(1, 40);
        const a = rng.int(-30, 30);
        return choose(
          rng,
          [
            `Each family below is nested, with $n \\ge 1$. Which family has an empty intersection?`,
            `下面每一族都是套，$n \\ge 1$。哪一族的交是空集？`,
          ],
          same(`\\left(${a}, ${a} + \\frac{${k}}{n}\\right)`),
          [
            same(`\\left[${a}, ${a} + \\frac{${k}}{n}\\right]`),
            same(`\\left[${a} - \\frac{${k}}{n}, ${a} + \\frac{${k}}{n}\\right]`),
            same(`\\left(${a} - \\frac{${k}}{n}, ${a} + \\frac{${k}}{n}\\right)`),
          ],
          [
            `No point lies in every interval that starts just after ${a}, while the others all contain ${a}.`,
            `没有点属于每个刚好从 ${a} 之后开始的区间，而其他各族都包含 ${a}。`,
          ],
        );
      },
    ),
  ],
);

const limitPoints = topic(
  "limit-points-and-closures",
  ["Limit Points and Closures", "极限点与闭包"],
  ["Find the limit points, isolated points and boundary of a set of reals.", "求实数集的极限点、孤立点和边界。"],
  ["open-and-closed-sets-of-reals"],
  [],
  [
    point(
      "counting-limit-points",
      ["Counting limit points", "数极限点"],
      [
        "A limit point of a set is a point that every small interval around it meets in another point of the set. A sequence converging to a value makes that value a limit point, even if it is outside the set.",
        "集合的极限点是这样的点：它周围每个小区间都含有集合中的另一点。收敛到某值的数列使这个值成为极限点，即使它不在集合中。",
      ],
      (rng) => {
        const m = rng.int(2, 30);
        const s = rng.int(-20, 20);
        return ask(
          [
            `How many limit points does the set $\\left\\{ k + \\frac{1}{n} : k = ${s}, ${s + 1}, \\dots, ${s + m - 1},\\ n \\ge 1 \\right\\}$ have?`,
            `集合 $\\left\\{ k + \\frac{1}{n} : k = ${s}, ${s + 1}, \\dots, ${s + m - 1},\\ n \\ge 1 \\right\\}$ 有多少个极限点？`,
          ],
          m,
          [0, m + 1, 2 * m],
          [`Each of the ${m} values of $k$ is a limit point, and nothing else is.`, `$k$ 的 ${m} 个值都是极限点，其他点都不是。`],
        );
      },
    ),
    point(
      "counting-isolated-points",
      ["Counting isolated points", "数孤立点"],
      [
        "An isolated point belongs to the set, but some small interval around it holds no other point of the set. A point added inside an interval is not isolated, while a point added outside its closure is.",
        "孤立点属于集合，但它周围某个小区间不含集合的其他点。加在区间内的点不是孤立点，而加在闭包之外的点是孤立点。",
      ],
      (rng) => {
        const a = rng.int(-10, 10);
        const b = a + rng.int(4, 12);
        const outside = rng.int(1, 6);
        const inside = rng.int(1, 3);
        const points = [
          ...Array.from({ length: outside }, (_, i) => b + 2 + i),
          ...Array.from({ length: inside }, (_, i) => a + 1 + i),
          b,
        ].sort((x, y) => x - y);
        return ask(
          [
            `How many isolated points does the set $(${a}, ${b}) \\cup \\{${points.join(", ")}\\}$ have?`,
            `集合 $(${a}, ${b}) \\cup \\{${points.join(", ")}\\}$ 有多少个孤立点？`,
          ],
          outside,
          [outside + inside, outside + inside + 1, outside + 1],
          [
            `The points above ${b} are isolated; ${b} is a limit point of the interval, and the rest lie inside it.`,
            `大于 ${b} 的点是孤立点；${b} 是区间的极限点，其余的点在区间内。`,
          ],
        );
      },
    ),
    point(
      "counting-boundary-points",
      ["Counting boundary points", "数边界点"],
      [
        "A boundary point has both points of the set and points outside it in every small interval around it. For a union of open intervals, the boundary is the set of end points, each counted once when intervals touch.",
        "边界点周围每个小区间既有集合内的点，也有集合外的点。对开区间的并，边界就是端点的集合，相接的端点只算一次。",
      ],
      (rng) => {
        const m = rng.int(2, 7);
        const touching = rng.int(0, m - 1);
        const parts: string[] = [];
        let at = rng.int(-20, 5);
        for (let i = 0; i < m; i++) {
          const end = at + rng.int(1, 4);
          parts.push(`(${at}, ${end})`);
          at = end + (i < touching ? 0 : rng.int(1, 3));
        }
        return ask(
          [`How many boundary points does $${parts.join(" \\cup ")}$ have?`, `$${parts.join(" \\cup ")}$ 有多少个边界点？`],
          2 * m - touching,
          [2 * m, m + 1, 2 * m + touching],
          [
            `There are ${2 * m} end points before counting, and each touching pair shares one, which removes ${touching}.`,
            `先数出 ${2 * m} 个端点，每对相接的区间共用一个，所以减去 ${touching}。`,
          ],
        );
      },
    ),
  ],
);

const cantorSet = topic(
  "the-cantor-set",
  ["The Cantor Set", "康托尔集"],
  ["Remove middle thirds forever, and measure and test what remains.", "不断去掉中间三分之一，测量并检验剩下的部分。"],
  ["limit-points-and-closures"],
  [],
  [
    point(
      "the-length-left-after-n-steps",
      ["The length left after n steps", "第 n 步后剩下的长度"],
      [
        "Each step removes the open middle third of every remaining interval, so the number of intervals doubles and the total length is multiplied by two thirds. The total length therefore tends to zero.",
        "每一步去掉每个剩余区间中间的开三分之一，所以区间数加倍，总长度乘三分之二。因此总长度趋于零。",
      ],
      (rng) => {
        const n = rng.int(1, 8);
        const l = rng.pick([1, 3, 9, 27, 81, 243]);
        return ask(
          [
            `The middle thirds are removed ${n} ${n === 1 ? "time" : "times"}, starting from $[0, ${l}]$. What total length remains?`,
            `从 $[0, ${l}]$ 开始去掉中间三分之一，共 ${n} 次。剩下的总长度是多少？`,
          ],
          Q.of(l * 2 ** n, 3 ** n),
          [Q.of(l, 3 ** n), Q.of(l * 2 ** (n - 1), 3 ** n), Q.of(l * (3 ** n - 2 ** n), 3 ** n)],
          [`The length is multiplied by $\\frac{2}{3}$ at each of the ${n} steps.`, `${n} 步中每一步长度都乘 $\\frac{2}{3}$。`],
        );
      },
    ),
    point(
      "the-length-removed-at-one-step",
      ["The length removed at one step", "某一步去掉的长度"],
      [
        "Before step $n$ there are $2^{n-1}$ intervals, each of length $3^{-(n-1)}$. The step removes one third of each, and adding all of these removed lengths gives a total of 1 on the unit interval.",
        "第 $n$ 步之前有 $2^{n-1}$ 个区间，每个长 $3^{-(n-1)}$。这一步去掉每个的三分之一，在单位区间上所有去掉的长度之和是 1。",
      ],
      (rng) => {
        const n = rng.int(1, 14);
        const part = rng.bool();
        return part
          ? ask(
              [
                `What length is removed from $[0, 1]$ at step ${n} of the Cantor construction?`,
                `康托尔构造的第 ${n} 步从 $[0, 1]$ 中去掉多少长度？`,
              ],
              Q.of(2 ** (n - 1), 3 ** n),
              [Q.of(2 ** n, 3 ** n), Q.of(1, 3 ** n), Q.of(2 ** (n - 1), 3 ** (n - 1))],
              [`There are $2^{${n - 1}}$ gaps, each of length $3^{-${n}}$.`, `有 $2^{${n - 1}}$ 个空隙，每个长 $3^{-${n}}$。`],
            )
          : ask(
              [
                `How many open intervals are removed in total during the first ${n} steps of the Cantor construction?`,
                `康托尔构造的前 ${n} 步共去掉多少个开区间？`,
              ],
              2 ** n - 1,
              [2 ** n, 2 ** (n - 1), 3 ** n - 1],
              [
                `The steps remove $1, 2, 4, \\dots, 2^{${n - 1}}$ intervals, which add up to ${2 ** n - 1}.`,
                `各步去掉 $1, 2, 4, \\dots, 2^{${n - 1}}$ 个区间，和是 ${2 ** n - 1}。`,
              ],
            );
      },
    ),
    point(
      "membership-from-ternary-digits",
      ["Membership from ternary digits", "由三进制数字判断属于"],
      [
        "A number lies in the Cantor set exactly when it has a base three expansion using only the digits 0 and 2. A digit 1 followed by later nonzero digits places the number inside a removed gap.",
        "一个数属于康托尔集，当且仅当它有只用数字 0 和 2 的三进制展开。数字 1 后面还有非零数字时，这个数落在被去掉的空隙里。",
      ],
      (rng) => {
        const k = rng.int(3, 5);
        const digits = () => Array.from({ length: k - 1 }, () => rng.pick([0, 2]));
        const value = (d: number[]) => d.reduce((s, x) => 3 * s + x, 0);
        const good = [...digits(), 2];
        const bad = () => {
          const d = [...digits(), 2];
          d[rng.int(0, k - 2)] = 1;
          return Q.of(value(d), 3 ** k);
        };
        const a = bad();
        let b = bad();
        let c = bad();
        for (let i = 0; i < 12 && (b.eq(a) || c.eq(a) || b.eq(c)); i++) {
          b = bad();
          c = bad();
        }
        const pair = (q: Q) => same(q.toLatex());
        return choose(
          rng,
          [`Which number belongs to the Cantor set in $[0, 1]$?`, `哪个数属于 $[0, 1]$ 中的康托尔集？`],
          pair(Q.of(value(good), 3 ** k)),
          [pair(a), pair(b), pair(c)],
          [
            `In base three, the answer has the digits $0.${good.join("")}$, with no digit 1.`,
            `答案的三进制数字是 $0.${good.join("")}$，没有数字 1。`,
          ],
        );
      },
    ),
  ],
);

const connected = topic(
  "connected-sets-of-reals",
  ["Connected Sets of Reals", "实数的连通集"],
  [
    "Recognize that connected sets of reals are exactly the intervals, and use that continuity keeps them connected.",
    "认识实数的连通集恰好是区间，并利用连续性保持连通。",
  ],
  ["open-and-closed-sets-of-reals"],
  [],
  [
    point(
      "which-set-is-connected",
      ["Which set is connected", "哪个集合连通"],
      [
        "A set of reals is connected exactly when it contains every number between any two of its points. So a single missing point splits an interval, and the rationals are as far from connected as possible.",
        "实数集连通，当且仅当它包含其任意两点之间的每个数。所以缺一个点就把区间分开，而有理数远不连通。",
      ],
      (rng) => {
        const a = rng.int(-20, 15);
        const b = a + rng.int(3, 15);
        const c = rng.int(a + 1, b - 1);
        return choose(
          rng,
          [`Which of these sets is connected?`, `下面哪个集合是连通的？`],
          same(`[${a}, ${c}) \\cup [${c}, ${b}]`),
          [same(`[${a}, ${c}) \\cup (${c}, ${b}]`), same(`[${a}, ${b}] \\cap \\mathbb{Q}`), same(`[${a}, ${c}) \\cup [${b}, ${b + 3}]`)],
          [`The first pieces join with no gap, to make the interval $[${a}, ${b}]$.`, `这两段没有空隙地接起来，构成区间 $[${a}, ${b}]$。`],
        );
      },
    ),
    point(
      "counting-connected-components",
      ["Counting connected components", "数连通分支"],
      [
        "Removing a point from inside an interval splits one piece into two, while removing a point outside it does nothing. So count how many of the removed points lie strictly inside and add one.",
        "从区间内部去掉一点，把一段分成两段；去掉区间外的点则没有影响。所以数出严格在内部的被去点数，再加一。",
      ],
      (rng) => {
        const a = rng.int(-10, 5);
        const b = a + rng.int(10, 20);
        const inner = rng.int(1, 6);
        const pts = rng.sample(
          Array.from({ length: b - a - 1 }, (_, i) => a + 1 + i),
          inner,
        );
        const outer = rng.int(0, 3);
        const list = [...pts, ...Array.from({ length: outer }, (_, i) => b + 1 + i), a].sort((x, y) => x - y);
        return ask(
          [
            `How many connected components does $[${a}, ${b}] \\setminus \\{${list.join(", ")}\\}$ have?`,
            `$[${a}, ${b}] \\setminus \\{${list.join(", ")}\\}$ 有多少个连通分支？`,
          ],
          inner + 1,
          [list.length + 1, inner, inner + 2],
          [
            `Each removed point strictly inside adds one piece, and there are ${inner} of those; removing the end ${a} splits nothing.`,
            `每个严格在内部的被去点增加一段，这样的点有 ${inner} 个；去掉端点 ${a} 不分割任何部分。`,
          ],
        );
      },
    ),
    point(
      "values-forced-by-connectedness",
      ["Values forced by connectedness", "连通性迫使取到的值"],
      [
        "A continuous function sends a connected set to a connected set, so the image of an interval is an interval. This is the general form of the intermediate value theorem, and it forces all values between two outputs.",
        "连续函数把连通集映成连通集，所以区间的像是区间。这是介值定理的一般形式，它迫使函数取到两个输出之间的所有值。",
      ],
      (rng) => {
        const a = rng.int(-30, 10);
        const b = a + rng.int(2, 20);
        const p = rng.int(-30, 30);
        const q = p + rng.int(2, 40) * (rng.bool() ? 1 : -1);
        return ask(
          [
            `$f$ is continuous on $[${a}, ${b}]$, with $f(${a}) = ${p}$ and $f(${b}) = ${q}$. How many integers must be values of $f$?`,
            `$f$ 在 $[${a}, ${b}]$ 上连续，$f(${a}) = ${p}$，$f(${b}) = ${q}$。一定有多少个整数是 $f$ 的值？`,
          ],
          Math.abs(q - p) + 1,
          [Math.abs(q - p), Math.abs(q - p) - 1, b - a + 1],
          [
            `Every integer from ${Math.min(p, q)} to ${Math.max(p, q)} is forced.`,
            `从 ${Math.min(p, q)} 到 ${Math.max(p, q)} 的每个整数都必须取到。`,
          ],
        );
      },
    ),
  ],
);

const compactImages = topic(
  "continuous-images-of-compact-sets",
  ["Continuous Images of Compact Sets", "紧集的连续像"],
  ["See why continuity on a compact set gives a bounded function that attains its extremes.", "理解为什么紧集上的连续函数有界并取到最值。"],
  ["compactness-on-the-real-line", "connected-sets-of-reals"],
  [],
  [
    point(
      "the-image-of-a-closed-interval",
      ["The image of a closed interval", "闭区间的像"],
      [
        "A continuous image of a closed bounded interval is again a closed bounded interval, because compactness and connectedness are both preserved. To find it, locate the least and greatest values, which are attained.",
        "闭有界区间的连续像仍是闭有界区间，因为紧性和连通性都被保持。要求出它，就找到能取到的最小值和最大值。",
      ],
      (rng) => {
        const a = rng.int(1, 12);
        const b = rng.int(1, 12);
        return ask(
          [
            `What is the length of the image of $[-${a}, ${b}]$ under $f(x) = x^{2}$?`,
            `$[-${a}, ${b}]$ 在 $f(x) = x^{2}$ 下的像的长度是多少？`,
          ],
          Math.max(a, b) ** 2,
          [b * b - a * a === 0 ? a + b : Math.abs(b * b - a * a), a * a + b * b, a + b],
          [
            `The least value is 0, attained inside the interval, and the greatest is $${Math.max(a, b)}^{2}$.`,
            `最小值是 0，在区间内取到；最大值是 $${Math.max(a, b)}^{2}$。`,
          ],
        );
      },
    ),
    point(
      "where-the-maximum-is-attained",
      ["Where the maximum is attained", "最大值在哪里取到"],
      [
        "The maximum of a continuous function on a closed interval is attained, either at a critical point inside or at an end point. A parabola opening down peaks at its vertex only if the vertex lies in the interval.",
        "闭区间上连续函数的最大值能够取到，要么在内部的临界点，要么在端点。开口向下的抛物线只有在顶点属于区间时才在顶点达到峰值。",
      ],
      (rng) => {
        const h = rng.int(-10, 10);
        const k = rng.int(-20, 20);
        const a = rng.int(-12, 8);
        const b = a + rng.int(1, 8);
        const at = (x: number) => k - (x - h) * (x - h);
        const best = h >= a && h <= b ? k : Math.max(at(a), at(b));
        return ask(
          [
            `What is the maximum value of $f(x) = ${k} - (x - (${h}))^{2}$ on $[${a}, ${b}]$?`,
            `$f(x) = ${k} - (x - (${h}))^{2}$ 在 $[${a}, ${b}]$ 上的最大值是多少？`,
          ],
          best,
          [k === best ? k + 1 : k, Math.min(at(a), at(b)), at(a) + at(b)],
          [
            h >= a && h <= b
              ? `The vertex at $x = ${h}$ lies in the interval.`
              : `The vertex at $x = ${h}$ is outside, so the nearer end gives the maximum.`,
            h >= a && h <= b ? `$x = ${h}$ 处的顶点在区间内。` : `$x = ${h}$ 处的顶点在区间外，所以较近的端点给出最大值。`,
          ],
        );
      },
    ),
    point(
      "when-the-conclusion-fails",
      ["When the conclusion fails", "结论何时不成立"],
      [
        "Both hypotheses matter. On a set that is not closed a continuous function can blow up near a missing point, and on a set that is not bounded it can grow forever or approach a value it never reaches.",
        "两个条件都很重要。在不闭的集合上，连续函数可能在缺失点附近爆炸；在无界的集合上，它可能无限增长，或趋近一个永远取不到的值。",
      ],
      (rng) => {
        const a = rng.int(1, 20);
        const b = a + rng.int(1, 20);
        return choose(
          rng,
          [`Which function fails to attain a maximum on the given set?`, `哪个函数在给定集合上取不到最大值？`],
          same(`f(x) = \\frac{1}{x - ${a}} \\text{ on } (${a}, ${b}]`),
          [
            same(`f(x) = \\frac{1}{x} \\text{ on } [${a}, ${b}]`),
            same(`f(x) = x^{2} \\text{ on } [${a}, ${b}]`),
            same(`f(x) = ${b} - x \\text{ on } [${a}, ${b}]`),
          ],
          [
            `Near ${a} the values grow without bound, because ${a} is missing from the set.`,
            `在 ${a} 附近函数值无限增大，因为集合中缺少 ${a}。`,
          ],
        );
      },
    ),
  ],
);

const monotoneJumps = topic(
  "monotone-functions-and-their-jumps",
  ["Monotone Functions and Their Jumps", "单调函数及其跳跃"],
  ["Show that monotone functions can only jump, and bound how many jumps there are.", "说明单调函数只能发生跳跃，并估计跳跃的个数。"],
  ["kinds-of-discontinuities"],
  [],
  [
    point(
      "the-size-of-a-jump",
      ["The size of a jump", "跳跃的大小"],
      [
        "A monotone function has one-sided limits at every point, so its only possible discontinuities are jumps. The size of a jump is the difference between the limit from the right and the limit from the left.",
        "单调函数在每点都有单侧极限，所以它唯一可能的间断是跳跃。跳跃的大小是右极限与左极限之差。",
      ],
      (rng) => {
        const m = rng.int(2, 9);
        const c = rng.int(-20, 20);
        const j = rng.int(1, 25);
        const p = rng.int(-8, 8);
        return ask(
          [
            `$f(x) = ${m}x + (${c})$ for $x < ${p}$, and $f(x) = ${m}x + (${c + j})$ for $x \\ge ${p}$. What is the size of the jump of $f$ at ${p}?`,
            `当 $x < ${p}$ 时 $f(x) = ${m}x + (${c})$，当 $x \\ge ${p}$ 时 $f(x) = ${m}x + (${c + j})$。$f$ 在 ${p} 处的跳跃是多少？`,
          ],
          j,
          [c + j, m * p + c + j, j + m],
          [
            `The linear parts agree at ${p}, so the difference is $${c + j} - (${c}) = ${j}$.`,
            `线性部分在 ${p} 处相同，所以差是 $${c + j} - (${c}) = ${j}$。`,
          ],
        );
      },
    ),
    point(
      "how-many-large-jumps",
      ["How many large jumps", "有多少个大跳跃"],
      [
        "The jumps of an increasing function all fit inside its total rise. So at most the rise divided by the size can be that large, and this counting is what proves that the discontinuities are countable.",
        "增函数的所有跳跃都包含在它的总增量内。所以这样大的跳跃至多有总增量除以大小那么多个，这个计数证明了间断点可数。",
      ],
      (rng) => {
        const s = rng.int(2, 9);
        const rise = rng.int(10, 200);
        const m = rng.int(1, 3);
        return ask(
          [
            `$f$ is increasing on $[0, ${m}]$, with $f(${m}) - f(0) = ${rise}$. What is the greatest possible number of jumps of size at least ${s}?`,
            `$f$ 在 $[0, ${m}]$ 上递增，$f(${m}) - f(0) = ${rise}$。大小至少为 ${s} 的跳跃最多有多少个？`,
          ],
          Math.floor(rise / s),
          [Math.ceil(rise / s) === Math.floor(rise / s) ? rise / s + 1 : Math.ceil(rise / s), rise, s],
          [
            `The jumps fit within the rise, and $${rise} \\div ${s}$ rounded down is ${Math.floor(rise / s)}.`,
            `跳跃都在总增量内，$${rise} \\div ${s}$ 向下取整是 ${Math.floor(rise / s)}。`,
          ],
        );
      },
    ),
    point(
      "jumps-of-a-floor-function",
      ["Jumps of a floor function", "取整函数的跳跃"],
      [
        "The function that rounds $kx$ down to a whole number is increasing, and it jumps by 1 whenever $kx$ reaches an integer. So on an interval, count the multiples of $\\frac{1}{k}$ that lie inside it.",
        "把 $kx$ 向下取整的函数是递增的，每当 $kx$ 到达整数时跳 1。所以在一个区间上，数其中 $\\frac{1}{k}$ 的倍数有多少。",
      ],
      (rng) => {
        const k = rng.int(2, 12);
        const n = rng.int(1, 12);
        return ask(
          [
            `At how many points of the open interval $(0, ${n})$ is $f(x) = \\lfloor ${k}x \\rfloor$ discontinuous?`,
            `$f(x) = \\lfloor ${k}x \\rfloor$ 在开区间 $(0, ${n})$ 中有多少个间断点？`,
          ],
          k * n - 1,
          [k * n, k * n + 1, n],
          [
            `The jumps are at $\\frac{j}{${k}}$ for $j = 1$ to ${k * n - 1}, since ${n} itself is left out.`,
            `跳跃在 $\\frac{j}{${k}}$ 处，$j = 1$ 到 ${k * n - 1}，因为 ${n} 本身不算。`,
          ],
        );
      },
    ),
  ],
);

const boundedVariation = topic(
  "functions-of-bounded-variation",
  ["Functions of Bounded Variation", "有界变差函数"],
  ["Measure the total up and down movement of a function.", "测量函数上下运动的总量。"],
  ["monotone-functions-and-their-jumps"],
  [],
  [
    point(
      "variation-over-a-partition",
      ["Variation over a partition", "分割上的变差"],
      [
        "The variation over a partition adds the sizes of the changes between neighboring points, so a fall counts as much as a rise. Finer partitions can only increase this sum, and its supremum is the total variation.",
        "分割上的变差把相邻点之间变化的绝对值相加，所以下降和上升一样计入。分割越细，和只会增大，它的上确界就是全变差。",
      ],
      (rng) => {
        const n = rng.int(4, 6);
        const values = Array.from({ length: n }, () => rng.int(-15, 15));
        const v = values.slice(1).reduce((s, x, i) => s + Math.abs(x - (values[i] as number)), 0);
        const net = (values[n - 1] as number) - (values[0] as number);
        return ask(
          [
            `A function takes the values $${values.join(", ")}$ at the successive points of a partition. What is its variation over this partition?`,
            `函数在分割的相继各点上取值 $${values.join(", ")}$。它在这个分割上的变差是多少？`,
          ],
          v,
          [Math.abs(net), v + 1, values.reduce((s, x) => s + Math.abs(x), 0)],
          [`Add the sizes of the ${n - 1} changes, which gives ${v}.`, `把 ${n - 1} 次变化的绝对值相加，得 ${v}。`],
        );
      },
    ),
    point(
      "total-variation-of-a-piecewise-monotone-function",
      ["Total variation of a piecewise monotone function", "分段单调函数的全变差"],
      [
        "On a piece where a function is monotone, the variation is just the size of the net change. So split the interval at each turning point, and add the sizes of the changes over the pieces.",
        "在函数单调的一段上，变差就是净变化的绝对值。所以在每个转折点分割区间，再把各段变化的绝对值相加。",
      ],
      (rng) => {
        const a = rng.int(1, 12);
        const b = rng.int(1, 12);
        return ask(
          [`What is the total variation of $f(x) = x^{2}$ on $[-${a}, ${b}]$?`, `$f(x) = x^{2}$ 在 $[-${a}, ${b}]$ 上的全变差是多少？`],
          a * a + b * b,
          [Math.abs(b * b - a * a) + 1, (a + b) ** 2, a + b],
          [`It falls by ${a * a} to 0, and then rises by ${b * b}.`, `它先下降 ${a * a} 到 0，再上升 ${b * b}。`],
        );
      },
    ),
    point(
      "variation-of-an-oscillating-function",
      ["Variation of an oscillating function", "振荡函数的变差"],
      [
        "A sine wave of amplitude $A$ moves up or down by $A$ between its zeros and peaks, so every half period contributes $2A$. A function that oscillates ever faster with fixed amplitude has infinite variation.",
        "振幅为 $A$ 的正弦波在零点和峰值之间上下移动 $A$，所以每半个周期贡献 $2A$。振幅固定而振荡越来越快的函数，全变差是无穷。",
      ],
      (rng) => {
        const amp = rng.int(1, 12);
        const k = rng.int(1, 15);
        return ask(
          [
            `What is the total variation of $f(x) = ${amp === 1 ? "" : amp}\\sin x$ on $[0, ${k === 1 ? "" : k}\\pi]$?`,
            `$f(x) = ${amp === 1 ? "" : amp}\\sin x$ 在 $[0, ${k === 1 ? "" : k}\\pi]$ 上的全变差是多少？`,
          ],
          2 * amp * k,
          [amp * k, 0, 4 * amp * k],
          [`Each of the ${k} half periods contributes $2 \\cdot ${amp}$.`, `${k} 个半周期中每个贡献 $2 \\cdot ${amp}$。`],
        );
      },
    ),
  ],
);

const stieltjes = topic(
  "riemann-stieltjes-integrals",
  ["Riemann-Stieltjes Integrals", "黎曼-斯蒂尔杰斯积分"],
  [
    "Integrate one function against another, so that sums and integrals become one idea.",
    "把一个函数对另一个函数积分，使求和与积分成为同一个概念。",
  ],
  ["riemann-integrability", "functions-of-bounded-variation"],
  [],
  [
    point(
      "integrating-against-a-step",
      ["Integrating against a step", "对阶梯函数积分"],
      [
        "If the integrator is constant except for jumps, only the jumps contribute. So a continuous integrand is evaluated at each jump point and multiplied by the size of that jump, turning the integral into a sum.",
        "如果积分函数除跳跃外是常数，那么只有跳跃有贡献。所以把连续的被积函数在每个跳跃点取值，再乘跳跃大小，积分就变成求和。",
      ],
      (rng) => {
        const c = rng.int(1, 4);
        const d = c + rng.int(1, 3);
        const j1 = rng.int(1, 9);
        const j2 = rng.int(1, 9);
        const k = rng.int(-9, 9);
        const f = (x: number) => x * x + k;
        return ask(
          [
            `$\\alpha$ is constant on $[0, 8]$ except for a jump of ${j1} at ${c} and a jump of ${j2} at ${d}. Evaluate $\\int_{0}^{8} (x^{2} + (${k}))\\, d\\alpha$.`,
            `$\\alpha$ 在 $[0, 8]$ 上除在 ${c} 处跳 ${j1}、在 ${d} 处跳 ${j2} 外都是常数。计算 $\\int_{0}^{8} (x^{2} + (${k}))\\, d\\alpha$。`,
          ],
          j1 * f(c) + j2 * f(d),
          [f(c) + f(d), j1 * f(d) + j2 * f(c), (j1 + j2) * f(8)],
          [
            `$${j1} \\cdot f(${c}) + ${j2} \\cdot f(${d}) = ${j1 * f(c) + j2 * f(d)}$.`,
            `$${j1} \\cdot f(${c}) + ${j2} \\cdot f(${d}) = ${j1 * f(c) + j2 * f(d)}$。`,
          ],
        );
      },
    ),
    point(
      "integrating-against-a-smooth-function",
      ["Integrating against a smooth function", "对光滑函数积分"],
      [
        "If the integrator has a continuous derivative, then $d\\alpha$ can be replaced by the derivative times $dx$. This turns the problem into an ordinary integral, computed with the usual antiderivative.",
        "如果积分函数有连续导数，就可以把 $d\\alpha$ 换成导数乘 $dx$。这样问题变成普通积分，用通常的原函数计算。",
      ],
      (rng) => {
        const b = rng.int(1, 6);
        const m = rng.int(1, 5);
        return ask(
          [`Evaluate $\\int_{0}^{${b}} x^{${m}}\\, d(x^{2})$.`, `计算 $\\int_{0}^{${b}} x^{${m}}\\, d(x^{2})$。`],
          Q.of(2 * b ** (m + 2), m + 2),
          [Q.of(b ** (m + 1), m + 1), Q.of(b ** (m + 2), m + 2), Q.of(2 * b ** (m + 1), m + 1)],
          [`Replace $d(x^{2})$ by $2x\\,dx$, and integrate $2x^{${m + 1}}$.`, `把 $d(x^{2})$ 换成 $2x\\,dx$，再积分 $2x^{${m + 1}}$。`],
        );
      },
    ),
    point(
      "a-sum-as-a-stieltjes-integral",
      ["A sum as a Stieltjes integral", "把和写成斯蒂尔杰斯积分"],
      [
        "The floor function jumps by 1 at each whole number, so integrating against it adds the values of the integrand at those whole numbers. This is why a single theory can cover both sums and integrals.",
        "取整函数在每个整数处跳 1，所以对它积分就是把被积函数在这些整数处的值相加。这正是一个理论能同时包含求和与积分的原因。",
      ],
      (rng) => {
        const n = rng.int(2, 12);
        const a = rng.int(2, 9);
        const b = rng.int(-9, 9);
        const sum = (a * n * (n + 1)) / 2 + b * n;
        return ask(
          [
            `Evaluate $\\int_{0}^{${n} + \\frac{1}{2}} (${a}x + (${b}))\\, d\\lfloor x \\rfloor$.`,
            `计算 $\\int_{0}^{${n} + \\frac{1}{2}} (${a}x + (${b}))\\, d\\lfloor x \\rfloor$。`,
          ],
          sum,
          [sum + b, (a * n * (n - 1)) / 2 + b * n, Math.floor((a * n * n) / 2) + b * n],
          [
            `The jumps at 1 through ${n} add the values $${a}k + (${b})$, for a total of ${sum}.`,
            `1 到 ${n} 处的跳跃把 $${a}k + (${b})$ 的值相加，总和是 ${sum}。`,
          ],
        );
      },
    ),
  ],
);

const improperAnalysis = topic(
  "convergence-of-improper-integrals",
  ["Convergence of Improper Integrals", "反常积分的收敛"],
  ["Decide convergence by comparison, without finding an antiderivative.", "不求原函数，用比较判断收敛。"],
  ["riemann-integrability", "improper-integrals-of-the-second-kind"],
  [],
  [
    point(
      "the-value-of-a-p-integral",
      ["The value of a p-integral", "p 积分的值"],
      [
        "The integral of $x^{-p}$ from 1 to infinity converges exactly when $p$ exceeds 1, and its value is then one over $p - 1$. These integrals are the standard against which others are compared.",
        "$x^{-p}$ 从 1 到无穷的积分当且仅当 $p$ 大于 1 时收敛，这时它的值是 $p - 1$ 分之一。这些积分是用来比较的标准。",
      ],
      (rng) => {
        const q = rng.int(2, 9);
        const r = rng.int(1, 12);
        const p = Q.of(q + r, q);
        return ask(
          [`Evaluate $\\int_{1}^{\\infty} x^{-${p.toLatex()}}\\, dx$.`, `计算 $\\int_{1}^{\\infty} x^{-${p.toLatex()}}\\, dx$。`],
          Q.of(q, r),
          [Q.of(r, q), Q.of(q + r, r), Q.of(q + r, q)],
          [`The value is one over $p - 1 = ${Q.of(r, q).toLatex()}$.`, `值是 $p - 1 = ${Q.of(r, q).toLatex()}$ 的倒数。`],
        );
      },
    ),
    point(
      "comparing-with-a-p-integral",
      ["Comparing with a p-integral", "与 p 积分比较"],
      [
        "For large $x$ a rational function behaves like its leading terms. So compare the integrand with a power of $x$, and it converges at infinity exactly when the overall power is less than $-1$.",
        "当 $x$ 很大时，有理函数的行为像它的首项。所以把被积函数与 $x$ 的幂比较，当总幂次小于 $-1$ 时它在无穷处才收敛。",
      ],
      (rng) => {
        const k = rng.int(1, 6);
        const c = rng.int(1, 30);
        const f = (top: number, bottom: number) => `\\frac{x^{${top}}}{x^{${bottom}} + ${c}}`;
        return choose(
          rng,
          [`Which of these integrals over $[1, \\infty)$ converges?`, `下面哪个在 $[1, \\infty)$ 上的积分收敛？`],
          same(`\\int_{1}^{\\infty} ${f(k, k + 2)}\\, dx`),
          [
            same(`\\int_{1}^{\\infty} ${f(k, k + 1)}\\, dx`),
            same(`\\int_{1}^{\\infty} ${f(k + 1, k + 1)}\\, dx`),
            same(`\\int_{1}^{\\infty} ${f(k + 2, k + 1)}\\, dx`),
          ],
          [
            `The convergent integrand behaves like $x^{-2}$, while the others behave like $x^{-1}$ or larger.`,
            `收敛的被积函数的行为像 $x^{-2}$，其他的像 $x^{-1}$ 或更大。`,
          ],
        );
      },
    ),
    point(
      "a-singularity-at-zero",
      ["A singularity at zero", "零处的奇点"],
      [
        "Near zero the comparison goes the other way: the integral of $x^{-p}$ from 0 to 1 converges exactly when $p$ is less than 1. Its value is then one over $1 - p$.",
        "在零附近比较方向相反：$x^{-p}$ 从 0 到 1 的积分当且仅当 $p$ 小于 1 时收敛。这时它的值是 $1 - p$ 分之一。",
      ],
      (rng) => {
        const q = rng.int(2, 15);
        const r = rng.int(1, q - 1);
        const b = rng.int(1, 3);
        return ask(
          [
            `Evaluate $${b === 1 ? "" : b}\\int_{0}^{1} x^{-${Q.of(r, q).toLatex()}}\\, dx$.`,
            `计算 $${b === 1 ? "" : b}\\int_{0}^{1} x^{-${Q.of(r, q).toLatex()}}\\, dx$。`,
          ],
          Q.of(b * q, q - r),
          [Q.of(b * q, r), Q.of(b * (q - r), q), Q.of(b * r, q)],
          [
            `The antiderivative of the power gives one over $1 - ${Q.of(r, q).toLatex()}$, times ${b}.`,
            `幂的原函数给出 $1 - ${Q.of(r, q).toLatex()}$ 的倒数，再乘 ${b}。`,
          ],
        );
      },
    ),
  ],
);

const dirichletAbel = topic(
  "the-dirichlet-and-abel-tests",
  ["The Dirichlet and Abel Tests", "狄利克雷判别法和阿贝尔判别法"],
  ["Handle series that converge through cancellation by summing by parts.", "用分部求和处理靠抵消而收敛的级数。"],
  ["absolute-and-conditional-convergence-of-series"],
  [],
  [
    point(
      "bounded-partial-sums",
      ["Bounded partial sums", "有界的部分和"],
      [
        "The Dirichlet test needs the partial sums of one factor to be bounded. A repeating pattern whose values add up to zero has bounded partial sums, and the bound is found by following a single period.",
        "狄利克雷判别法要求一个因子的部分和有界。各项之和为零的循环模式，部分和有界，只要跟踪一个周期就能求出这个界。",
      ],
      (rng) => {
        const p = rng.int(1, 15);
        const q = rng.int(1, 15);
        return ask(
          [
            `The sequence $a_k$ repeats ${p}, ${q}, $${-(p + q)}$ forever. What is the largest value of the partial sums $a_1 + \\dots + a_n$?`,
            `数列 $a_k$ 不断重复 ${p}、${q}、$${-(p + q)}$。部分和 $a_1 + \\dots + a_n$ 的最大值是多少？`,
          ],
          p + q,
          [p, q, 2 * (p + q)],
          [`The partial sums cycle through ${p}, ${p + q} and 0.`, `部分和依次循环为 ${p}、${p + q} 和 0。`],
        );
      },
    ),
    point(
      "the-bound-from-summing-by-parts",
      ["The bound from summing by parts", "分部求和给出的界"],
      [
        "If the partial sums of $a_k$ stay within $M$ in size and $b_k$ decreases to zero, then summing by parts bounds a block from $m$ on by $2M b_m$. This bound tends to zero, which gives the Cauchy criterion.",
        "如果 $a_k$ 的部分和绝对值不超过 $M$，且 $b_k$ 递减趋于零，那么分部求和给出从 $m$ 开始的一段不超过 $2M b_m$。这个界趋于零，从而满足柯西准则。",
      ],
      (rng) => {
        const big = rng.int(1, 20);
        const m = rng.int(2, 40);
        return ask(
          [
            `The partial sums of $a_k$ stay within ${big} in size, and $b_k = \\frac{1}{k}$. What bound does summing by parts give for $\\left|\\sum_{k=${m}}^{n} a_k b_k\\right|$?`,
            `$a_k$ 的部分和绝对值不超过 ${big}，$b_k = \\frac{1}{k}$。分部求和给出 $\\left|\\sum_{k=${m}}^{n} a_k b_k\\right|$ 的什么界？`,
          ],
          Q.of(2 * big, m),
          [Q.of(big, m), Q.of(2 * big, m + 1), Q.of(4 * big, m)],
          [
            `The bound is $2M b_m = 2 \\cdot ${big} \\cdot \\frac{1}{${m}}$.`,
            `这个界是 $2M b_m = 2 \\cdot ${big} \\cdot \\frac{1}{${m}}$。`,
          ],
        );
      },
    ),
    point(
      "which-test-applies",
      ["Which test applies", "用哪个判别法"],
      [
        "The Dirichlet test pairs bounded partial sums with a factor decreasing to zero. Abel's test pairs a convergent series with a bounded monotone factor. Telling these apart decides which proof is available for a given series.",
        "狄利克雷判别法把有界的部分和与递减趋于零的因子配对。阿贝尔判别法把收敛级数与有界单调因子配对。区分它们决定了一个级数可以用哪种证明。",
      ],
      (rng) => {
        const k = rng.int(1, 30);
        const s = rng.int(2, 9);
        const useAbel = rng.bool();
        const dirichlet: [string, string] = ["The Dirichlet test", "狄利克雷判别法"];
        const abel: [string, string] = ["Abel's test", "阿贝尔判别法"];
        return choose(
          rng,
          useAbel
            ? [
                `The series $\\sum \\frac{(-1)^{n}}{n} \\left(1 + \\frac{${k}}{n}\\right)$ multiplies a convergent series by a bounded monotone factor. Which test fits this description?`,
                `级数 $\\sum \\frac{(-1)^{n}}{n} \\left(1 + \\frac{${k}}{n}\\right)$ 把收敛级数乘有界单调因子。哪个判别法符合这个描述？`,
              ]
            : [
                `The series $\\sum \\frac{\\sin(${s}n)}{n + ${k}}$ multiplies terms with bounded partial sums by a factor decreasing to zero. Which test fits this description?`,
                `级数 $\\sum \\frac{\\sin(${s}n)}{n + ${k}}$ 把部分和有界的项乘递减趋于零的因子。哪个判别法符合这个描述？`,
              ],
          useAbel ? abel : dirichlet,
          [useAbel ? dirichlet : abel, ["The comparison test", "比较判别法"], ["The ratio test", "比值判别法"]],
          [`The description matches the hypotheses of that test exactly.`, `这个描述正好符合该判别法的条件。`],
        );
      },
    ),
  ],
);

const tails = topic(
  "tails-of-convergent-series",
  ["Tails of Convergent Series", "收敛级数的余项"],
  [
    "Estimate what is left after $n$ terms, and find how far to go for a given accuracy.",
    "估计 $n$ 项之后剩下的部分，并求达到给定精度要走多远。",
  ],
  ["harmonic-series-and-p-series"],
  [],
  [
    point(
      "the-tail-of-a-geometric-series",
      ["The tail of a geometric series", "几何级数的余项"],
      [
        "The tail of a geometric series is itself geometric. It starts with the first omitted term, so its sum is that term divided by one minus the ratio.",
        "几何级数的余项本身也是几何级数。它从第一个被略去的项开始，所以它的和是这一项除以一减公比。",
      ],
      (rng) => {
        const q = rng.int(2, 9);
        const p = rng.int(1, q - 1);
        const n = rng.int(1, 4);
        return ask(
          [
            `What is $\\sum_{k=${n + 1}}^{\\infty} \\left(${Q.of(p, q).toLatex()}\\right)^{k}$?`,
            `$\\sum_{k=${n + 1}}^{\\infty} \\left(${Q.of(p, q).toLatex()}\\right)^{k}$ 是多少？`,
          ],
          Q.of(p ** (n + 1), q ** n * (q - p)),
          [Q.of(p ** n, q ** (n - 1) * (q - p)), Q.of(p, q - p), Q.of(p ** (n + 1), q ** (n + 1))],
          [
            `The first term is $\\left(${Q.of(p, q).toLatex()}\\right)^{${n + 1}}$, and we divide by $1 - ${Q.of(p, q).toLatex()}$.`,
            `首项是 $\\left(${Q.of(p, q).toLatex()}\\right)^{${n + 1}}$，再除以 $1 - ${Q.of(p, q).toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "how-far-to-go-with-a-telescoping-tail",
      ["How far to go with a telescoping tail", "裂项余项要走多远"],
      [
        "Terms of the form $\\frac{1}{k(k+1)}$ telescope, so the tail after $n$ terms is exactly $\\frac{1}{n+1}$. Then the Cauchy criterion becomes a direct question about how large $n$ must be.",
        "形如 $\\frac{1}{k(k+1)}$ 的项可以裂项，所以 $n$ 项之后的余项恰好是 $\\frac{1}{n+1}$。于是柯西准则变成关于 $n$ 必须多大的直接问题。",
      ],
      (rng) => {
        const m = rng.int(5, 900);
        return ask(
          [
            `What is the smallest $n$ with $\\sum_{k=n+1}^{\\infty} \\frac{1}{k(k+1)} < \\frac{1}{${m}}$?`,
            `使 $\\sum_{k=n+1}^{\\infty} \\frac{1}{k(k+1)} < \\frac{1}{${m}}$ 的最小 $n$ 是多少？`,
          ],
          m,
          [m - 1, m + 1, m * m],
          [`The tail is $\\frac{1}{n+1}$, so we need $n + 1 > ${m}$.`, `余项是 $\\frac{1}{n+1}$，所以需要 $n + 1 > ${m}$。`],
        );
      },
    ),
    point(
      "a-tail-bound-from-an-integral",
      ["A tail bound from an integral", "由积分得到的余项界"],
      [
        "For a decreasing positive function, the tail of the series lies below the integral starting from the last term kept. For the reciprocal squares this gives a bound of $\\frac{1}{n}$ after $n$ terms.",
        "对递减的正函数，级数的余项小于从保留的最后一项开始的积分。对平方倒数，这给出 $n$ 项之后的界 $\\frac{1}{n}$。",
      ],
      (rng) => {
        const m = rng.int(5, 900);
        const c = rng.int(1, 6);
        return ask(
          [
            `Using the integral bound, how many terms $n$ of $\\sum \\frac{${c}}{k^{2}}$ are guaranteed to leave a tail below $\\frac{1}{${m}}$? Give the smallest such $n$ with $\\frac{${c}}{n} < \\frac{1}{${m}}$.`,
            `用积分界，$\\sum \\frac{${c}}{k^{2}}$ 取多少项 $n$ 才保证余项小于 $\\frac{1}{${m}}$？给出满足 $\\frac{${c}}{n} < \\frac{1}{${m}}$ 的最小 $n$。`,
          ],
          c * m + 1,
          [c * m, m + 1, c * m * m],
          [`The inequality says $n > ${c * m}$.`, `不等式表示 $n > ${c * m}$。`],
        );
      },
    ),
  ],
);

const uniformLimits = topic(
  "uniform-limits-and-continuity",
  ["Uniform Limits and Continuity", "一致极限与连续性"],
  ["Measure uniform convergence with the supremum, and see that it preserves continuity.", "用上确界衡量一致收敛，并看到它保持连续性。"],
  ["pointwise-and-uniform-convergence"],
  [],
  [
    point(
      "how-large-n-must-be",
      ["How large n must be", "n 必须多大"],
      [
        "Uniform convergence asks for one $n$ that works at every point, which means the supremum of the difference must be small. On a bounded interval, $\\frac{x}{n}$ has its largest difference at the far end.",
        "一致收敛要求有一个 $n$ 对每一点都成立，也就是差的上确界要小。在有界区间上，$\\frac{x}{n}$ 的最大差在最远的端点。",
      ],
      (rng) => {
        const b = rng.int(2, 30);
        const m = rng.int(2, 50);
        return ask(
          [
            `For $f_n(x) = \\frac{x}{n}$ on $[0, ${b}]$, what is the smallest $n$ with $\\sup |f_n| < \\frac{1}{${m}}$?`,
            `对 $[0, ${b}]$ 上的 $f_n(x) = \\frac{x}{n}$，使 $\\sup |f_n| < \\frac{1}{${m}}$ 的最小 $n$ 是多少？`,
          ],
          b * m + 1,
          [b * m, m + 1, b + m],
          [`The supremum is $\\frac{${b}}{n}$, so we need $n > ${b * m}$.`, `上确界是 $\\frac{${b}}{n}$，所以需要 $n > ${b * m}$。`],
        );
      },
    ),
    point(
      "a-supremum-inside-the-interval",
      ["A supremum inside the interval", "区间内部的上确界"],
      [
        "The largest difference is not always at an end point, so use calculus to locate it. For $\\frac{x}{1 + n x^{2}}$, the derivative vanishes at $x = \\frac{1}{\\sqrt{n}}$, and this point gives the supremum.",
        "最大差不一定在端点，所以要用微积分找到它。对 $\\frac{x}{1 + n x^{2}}$，导数在 $x = \\frac{1}{\\sqrt{n}}$ 处为零，这一点给出上确界。",
      ],
      (rng) => {
        const k = rng.int(2, 30);
        return ask(
          [
            `For $x \\ge 0$, what is the supremum of $\\frac{x}{1 + ${k * k} x^{2}}$?`,
            `当 $x \\ge 0$ 时，$\\frac{x}{1 + ${k * k} x^{2}}$ 的上确界是多少？`,
          ],
          Q.of(1, 2 * k),
          [Q.of(1, k), Q.of(1, k * k), Q.of(1, 2 * k * k)],
          [
            `The maximum is at $x = \\frac{1}{${k}}$, where the value is $\\frac{1}{${k}} \\div 2$.`,
            `最大值在 $x = \\frac{1}{${k}}$ 处，值是 $\\frac{1}{${k}} \\div 2$。`,
          ],
        );
      },
    ),
    point(
      "continuity-rules-out-uniform-convergence",
      ["Continuity rules out uniform convergence", "连续性排除一致收敛"],
      [
        "A uniform limit of continuous functions is continuous. So if continuous functions converge to a discontinuous limit, the convergence cannot be uniform, and this is the fastest way to rule it out.",
        "连续函数的一致极限是连续的。所以如果连续函数收敛到不连续的极限，收敛就不可能是一致的，这是排除一致收敛最快的办法。",
      ],
      (rng) => {
        const q = rng.int(2, 25);
        const p = rng.int(1, q - 1);
        const c = rng.int(1, 30);
        return choose(
          rng,
          [`Which sequence does not converge uniformly on the given interval?`, `哪个数列在给定区间上不一致收敛？`],
          same(`x^{n} \\text{ on } [${Q.of(p, q).toLatex()}, 1]`),
          [
            same(`x^{n} \\text{ on } \\left[0, ${Q.of(p, q).toLatex()}\\right]`),
            same(`\\frac{x}{n} \\text{ on } [0, ${c}]`),
            same(`\\frac{\\sin(nx)}{n} \\text{ on } [0, ${c}]`),
          ],
          [
            `The limit of $x^{n}$ jumps from 0 to 1 at $x = 1$, so it is discontinuous.`,
            `$x^{n}$ 的极限在 $x = 1$ 处从 0 跳到 1，所以不连续。`,
          ],
        );
      },
    ),
  ],
);

const differentiatingSequences = topic(
  "differentiating-sequences-of-functions",
  ["Differentiating Sequences of Functions", "函数列的求导"],
  [
    "See why derivatives need more than uniform convergence, and differentiate series term by term.",
    "理解为什么求导需要比一致收敛更多的条件，并逐项求导。",
  ],
  ["uniform-limits-and-continuity"],
  [],
  [
    point(
      "uniform-convergence-does-not-control-slopes",
      ["Uniform convergence does not control slopes", "一致收敛控制不了斜率"],
      [
        "Functions can be uniformly small while wiggling steeply. The sequence $\\frac{\\sin(nx)}{n}$ tends to zero uniformly, yet its derivative at zero stays fixed, so the limit of the derivatives is not the derivative of the limit.",
        "函数可以一致地小，同时陡峭地摆动。数列 $\\frac{\\sin(nx)}{n}$ 一致趋于零，但它在零处的导数保持不变，所以导数的极限不是极限的导数。",
      ],
      (rng) => {
        const a = rng.int(2, 40);
        return ask(
          [
            `Let $f_n(x) = \\frac{${a} \\sin(nx)}{n}$. What is $\\lim_{n \\to \\infty} f_n'(0)$?`,
            `设 $f_n(x) = \\frac{${a} \\sin(nx)}{n}$。$\\lim_{n \\to \\infty} f_n'(0)$ 是多少？`,
          ],
          a,
          [0, 1, 2 * a],
          [
            `$f_n'(x) = ${a} \\cos(nx)$, which equals ${a} at 0 for every $n$, although the limit function is 0.`,
            `$f_n'(x) = ${a} \\cos(nx)$，在 0 处对每个 $n$ 都等于 ${a}，虽然极限函数是 0。`,
          ],
        );
      },
    ),
    point(
      "differentiating-a-series-term-by-term",
      ["Differentiating a series term by term", "逐项求导"],
      [
        "If the series of derivatives converges uniformly, and the original series converges at one point, then the sum may be differentiated term by term. Power series satisfy this on closed intervals inside the radius of convergence.",
        "如果导数级数一致收敛，且原级数在一点收敛，那么和可以逐项求导。幂级数在收敛半径内的闭区间上满足这一点。",
      ],
      (rng) => {
        const q = rng.int(2, 15);
        const p = rng.int(1, q - 1);
        const r = Q.of(p, q);
        return ask(
          [
            `Let $f(x) = \\sum_{k=1}^{\\infty} \\frac{x^{k}}{k}$ for $|x| < 1$. What is $f'\\left(${r.toLatex()}\\right)$?`,
            `对 $|x| < 1$，设 $f(x) = \\sum_{k=1}^{\\infty} \\frac{x^{k}}{k}$。$f'\\left(${r.toLatex()}\\right)$ 是多少？`,
          ],
          Q.of(q, q - p),
          [Q.of(p, q - p), Q.of(q * q, (q - p) * (q - p)), Q.of(q - p, q)],
          [
            `Term by term, $f'(x) = \\sum_{k \\ge 0} x^{k} = \\frac{1}{1 - x}$.`,
            `逐项求导得 $f'(x) = \\sum_{k \\ge 0} x^{k} = \\frac{1}{1 - x}$。`,
          ],
        );
      },
    ),
    point(
      "a-sum-found-by-differentiating",
      ["A sum found by differentiating", "通过求导求和"],
      [
        "Differentiating the geometric series gives the sum of $k x^{k-1}$ as one over $(1 - x)^{2}$. Multiplying by $x$ then gives the sum of $k x^{k}$, which evaluates many series that are not geometric.",
        "对几何级数求导，得到 $k x^{k-1}$ 的和是 $(1 - x)^{2}$ 分之一。再乘 $x$，得到 $k x^{k}$ 的和，这可以求出许多不是几何级数的和。",
      ],
      (rng) => {
        const q = rng.int(2, 15);
        const p = rng.int(1, q - 1);
        const r = Q.of(p, q);
        return ask(
          [
            `Evaluate $\\sum_{k=1}^{\\infty} k \\left(${r.toLatex()}\\right)^{k}$.`,
            `计算 $\\sum_{k=1}^{\\infty} k \\left(${r.toLatex()}\\right)^{k}$。`,
          ],
          Q.of(p * q, (q - p) * (q - p)),
          [Q.of(p, q - p), Q.of(q * q, (q - p) * (q - p)), Q.of(q, q - p)],
          [
            `The sum is $\\frac{x}{(1 - x)^{2}}$ at $x = ${r.toLatex()}$.`,
            `和是 $\\frac{x}{(1 - x)^{2}}$ 在 $x = ${r.toLatex()}$ 处的值。`,
          ],
        );
      },
    ),
  ],
);

const powerUniform = topic(
  "power-series-and-uniform-convergence",
  ["Power Series and Uniform Convergence", "幂级数与一致收敛"],
  ["See where a power series converges uniformly, and what happens at the end points.", "看幂级数在哪里一致收敛，以及在端点发生什么。"],
  ["the-weierstrass-m-test", "radius-of-convergence-of-power-series"],
  [],
  [
    point(
      "a-bound-from-the-m-test",
      ["A bound from the M-test", "M 判别法给出的界"],
      [
        "On a closed interval inside the radius, every term of a power series is dominated by a term of a geometric series. So the Weierstrass test gives uniform convergence there, and the geometric sum bounds the function.",
        "在收敛半径内的闭区间上，幂级数的每一项都被几何级数的项控制。所以魏尔斯特拉斯判别法给出那里的一致收敛，几何级数的和给出函数的界。",
      ],
      (rng) => {
        const big = rng.int(2, 20);
        const r = rng.int(1, big - 1);
        return ask(
          [
            `On $[-${r}, ${r}]$, the terms of $\\sum_{k=0}^{\\infty} \\left(\\frac{x}{${big}}\\right)^{k}$ are dominated by $M_k = \\left(${Q.of(r, big).toLatex()}\\right)^{k}$. What is $\\sum_{k=0}^{\\infty} M_k$?`,
            `在 $[-${r}, ${r}]$ 上，$\\sum_{k=0}^{\\infty} \\left(\\frac{x}{${big}}\\right)^{k}$ 的项被 $M_k = \\left(${Q.of(r, big).toLatex()}\\right)^{k}$ 控制。$\\sum_{k=0}^{\\infty} M_k$ 是多少？`,
          ],
          Q.of(big, big - r),
          [Q.of(r, big - r), Q.of(big, r), Q.of(big - r, big)],
          [
            `The geometric sum is $\\frac{1}{1 - ${Q.of(r, big).toLatex()}}$.`,
            `几何级数的和是 $\\frac{1}{1 - ${Q.of(r, big).toLatex()}}$。`,
          ],
        );
      },
    ),
    point(
      "the-radius-after-differentiating",
      ["The radius after differentiating", "求导后的半径"],
      [
        "Differentiating a power series multiplies the coefficients by a factor that grows only polynomially, and such a factor has an $n$th root tending to 1. So the derivative series has exactly the same radius of convergence.",
        "对幂级数求导，系数只乘多项式增长的因子，这种因子的 $n$ 次方根趋于 1。所以导数级数的收敛半径完全相同。",
      ],
      (rng) => {
        const a = rng.int(2, 30);
        const m = rng.int(1, 5);
        const times = rng.int(1, 4);
        return ask(
          [
            `The series $\\sum_{k=1}^{\\infty} \\frac{k^{${m}} x^{k}}{${a}^{k}}$ is differentiated ${times} ${times === 1 ? "time" : "times"} term by term. What is the radius of convergence of the result?`,
            `对级数 $\\sum_{k=1}^{\\infty} \\frac{k^{${m}} x^{k}}{${a}^{k}}$ 逐项求导 ${times} 次。结果的收敛半径是多少？`,
          ],
          a,
          [a - times, a + m, a * m],
          [
            `Polynomial factors do not change the root test, so the radius stays ${a}.`,
            `多项式因子不改变根值判别的结果，所以半径仍是 ${a}。`,
          ],
        );
      },
    ),
    point(
      "behavior-at-the-end-points",
      ["Behavior at the end points", "端点处的行为"],
      [
        "The radius says nothing about the end points, which must be tested on their own. When a series converges at an end point, Abel's theorem says that its sum is continuous up to and including that point.",
        "收敛半径不说明端点的情况，端点必须单独检验。当级数在端点收敛时，阿贝尔定理说明它的和直到该端点都是连续的。",
      ],
      (rng) => {
        const a = rng.int(2, 40);
        return choose(
          rng,
          [
            `Where does $\\sum_{k=1}^{\\infty} \\frac{x^{k}}{k \\cdot ${a}^{k}}$ converge?`,
            `$\\sum_{k=1}^{\\infty} \\frac{x^{k}}{k \\cdot ${a}^{k}}$ 在哪里收敛？`,
          ],
          same(`[-${a}, ${a})`),
          [same(`(-${a}, ${a})`), same(`(-${a}, ${a}]`), same(`[-${a}, ${a}]`)],
          [
            `At $x = ${a}$ it is the harmonic series, and at $x = -${a}$ it is the alternating harmonic series.`,
            `在 $x = ${a}$ 处是调和级数，在 $x = -${a}$ 处是交错调和级数。`,
          ],
        );
      },
    ),
  ],
);

const bernstein = topic(
  "the-weierstrass-approximation-theorem",
  ["The Weierstrass Approximation Theorem", "魏尔斯特拉斯逼近定理"],
  [
    "Approximate any continuous function uniformly by polynomials, through Bernstein polynomials.",
    "通过伯恩斯坦多项式用多项式一致逼近任何连续函数。",
  ],
  ["uniform-limits-and-continuity"],
  [],
  [
    point(
      "evaluating-a-bernstein-polynomial",
      ["Evaluating a Bernstein polynomial", "计算伯恩斯坦多项式"],
      [
        "The Bernstein polynomial of degree $n$ averages the values of $f$ at $\\frac{k}{n}$, with weights from the binomial distribution. At $x = \\frac{1}{2}$ these weights are simply the binomial coefficients over $2^{n}$.",
        "$n$ 次伯恩斯坦多项式用二项分布作权，对 $f$ 在 $\\frac{k}{n}$ 处的值求平均。在 $x = \\frac{1}{2}$ 处，这些权就是二项式系数除以 $2^{n}$。",
      ],
      (rng) => {
        const n = rng.int(2, 3);
        const values = Array.from({ length: n + 1 }, () => rng.int(-9, 15));
        const top = values.reduce((s, v, k) => s + v * binomial(n, k), 0);
        const label = values.map((v, k) => `f\\left(${Q.of(k, n).toLatex()}\\right) = ${v}`).join(",\\ ");
        return ask(
          [
            `Given $${label}$, what is the degree ${n} Bernstein polynomial of $f$ at $x = \\frac{1}{2}$?`,
            `已知 $${label}$，$f$ 的 ${n} 次伯恩斯坦多项式在 $x = \\frac{1}{2}$ 处的值是多少？`,
          ],
          Q.of(top, 2 ** n),
          [
            Q.of(
              values.reduce((s, v) => s + v, 0),
              n + 1,
            ),
            Q.of(top, 2 ** n + 1),
            Q.of(top + 1, 2 ** n),
          ],
          [
            `The weights are $\\binom{${n}}{k} \\div ${2 ** n}$, and the weighted sum is $${Q.of(top, 2 ** n).toLatex()}$.`,
            `权是 $\\binom{${n}}{k} \\div ${2 ** n}$，加权和是 $${Q.of(top, 2 ** n).toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "the-bernstein-polynomial-of-a-square",
      ["The Bernstein polynomial of a square", "平方函数的伯恩斯坦多项式"],
      [
        "For $f(x) = x^{2}$ the Bernstein polynomial is $x^{2} + \\frac{x(1 - x)}{n}$. The extra term is the variance of a binomial proportion, and it shows the error shrinking as $n$ grows.",
        "对 $f(x) = x^{2}$，伯恩斯坦多项式是 $x^{2} + \\frac{x(1 - x)}{n}$。多出的一项是二项比例的方差，它说明误差随 $n$ 增大而缩小。",
      ],
      (rng) => {
        const q = rng.int(2, 9);
        const p = rng.int(1, q - 1);
        const n = rng.int(2, 15);
        const x = Q.of(p, q);
        return ask(
          [
            `What is the degree ${n} Bernstein polynomial of $x^{2}$, evaluated at $x = ${x.toLatex()}$?`,
            `$x^{2}$ 的 ${n} 次伯恩斯坦多项式在 $x = ${x.toLatex()}$ 处的值是多少？`,
          ],
          Q.of(p * p * n + p * (q - p), q * q * n),
          [Q.of(p * p, q * q), Q.of(p * (q - p), q * q * n), Q.of(p * p * n - p * (q - p), q * q * n)],
          [`Add $x^{2}$ and $\\frac{x(1 - x)}{${n}}$.`, `把 $x^{2}$ 和 $\\frac{x(1 - x)}{${n}}$ 相加。`],
        );
      },
    ),
    point(
      "the-degree-needed-for-an-accuracy",
      ["The degree needed for an accuracy", "达到精度所需的次数"],
      [
        "For $x^{2}$ the error $\\frac{x(1 - x)}{n}$ is greatest at $x = \\frac{1}{2}$, where it equals $\\frac{1}{4n}$. So the required degree comes from one inequality, and it applies uniformly on the whole interval.",
        "对 $x^{2}$，误差 $\\frac{x(1 - x)}{n}$ 在 $x = \\frac{1}{2}$ 处最大，等于 $\\frac{1}{4n}$。所以所需次数由一个不等式得出，它在整个区间上一致成立。",
      ],
      (rng) => {
        const m = rng.int(5, 900);
        return ask(
          [
            `What is the smallest $n$ for which the degree $n$ Bernstein polynomial of $x^{2}$ is within $\\frac{1}{${m}}$ of $x^{2}$ on all of $[0, 1]$, with the error strictly smaller?`,
            `使 $x^{2}$ 的 $n$ 次伯恩斯坦多项式在整个 $[0, 1]$ 上与 $x^{2}$ 的误差严格小于 $\\frac{1}{${m}}$ 的最小 $n$ 是多少？`,
          ],
          Math.floor(m / 4) + 1,
          [m, Math.ceil(m / 2), Math.floor(m / 4) + 2],
          [
            `We need $\\frac{1}{4n} < \\frac{1}{${m}}$, that is $n > \\frac{${m}}{4}$.`,
            `需要 $\\frac{1}{4n} < \\frac{1}{${m}}$，即 $n > \\frac{${m}}{4}$。`,
          ],
        );
      },
    ),
  ],
);

const arzela = topic(
  "equicontinuity-and-the-arzela-ascoli-theorem",
  ["Equicontinuity and the Arzelà-Ascoli Theorem", "等度连续与阿尔泽拉-阿斯科利定理"],
  ["Find when a family of functions has a uniformly convergent subsequence.", "判断函数族何时有一致收敛的子列。"],
  ["uniform-limits-and-continuity"],
  [],
  [
    point(
      "one-delta-for-a-whole-family",
      ["One delta for a whole family", "整族共用一个 delta"],
      [
        "A family is equicontinuous when a single $\\delta$ works for every function and every point. A common bound $L$ on the derivatives gives this, because then $\\delta = \\frac{\\varepsilon}{L}$ works for all of them.",
        "函数族等度连续，是指一个 $\\delta$ 对每个函数和每一点都适用。导数的公共界 $L$ 能保证这一点，因为这时 $\\delta = \\frac{\\varepsilon}{L}$ 对它们都成立。",
      ],
      (rng) => {
        const big = rng.int(2, 20);
        const m = rng.int(2, 50);
        return ask(
          [
            `Every function in a family has $|f'(x)| \\le ${big}$. What $\\delta$ does the bound give for $\\varepsilon = \\frac{1}{${m}}$?`,
            `函数族中每个函数都满足 $|f'(x)| \\le ${big}$。对 $\\varepsilon = \\frac{1}{${m}}$，这个界给出什么 $\\delta$？`,
          ],
          Q.of(1, big * m),
          [Q.of(big, m), Q.of(1, m), Q.of(m, big)],
          [
            `$\\delta = \\frac{\\varepsilon}{L} = \\frac{1}{${m}} \\div ${big}$.`,
            `$\\delta = \\frac{\\varepsilon}{L} = \\frac{1}{${m}} \\div ${big}$。`,
          ],
        );
      },
    ),
    point(
      "which-family-is-equicontinuous",
      ["Which family is equicontinuous", "哪一族等度连续"],
      [
        "Each function in a family may be continuous while the family is not equicontinuous, if steeper and steeper members appear. So check whether the slopes stay bounded across the family on the given interval.",
        "即使每个函数都连续，如果出现越来越陡的成员，这一族也不等度连续。所以要检查在给定区间上整族的斜率是否有界。",
      ],
      (rng) => {
        const a = rng.int(2, 30);
        const b = rng.int(2, 9);
        return choose(
          rng,
          [
            `With $n = 1, 2, 3, \\dots$, which family is equicontinuous on $[0, 1]$?`,
            `$n = 1, 2, 3, \\dots$，哪一族在 $[0, 1]$ 上等度连续？`,
          ],
          same(`f_n(x) = ${a} \\sin(x + n)`),
          [same(`f_n(x) = ${a} \\sin(nx)`), same(`f_n(x) = x^{n} + ${b}`), same(`f_n(x) = ${b} n x`)],
          [
            `Its slopes are at most ${a} for every $n$, while the others get steeper without bound.`,
            `它的斜率对每个 $n$ 都不超过 ${a}，而其他各族越来越陡。`,
          ],
        );
      },
    ),
    point(
      "a-uniform-bound-for-the-family",
      ["A uniform bound for the family", "函数族的一致界"],
      [
        "The theorem needs two things: the family is pointwise bounded and equicontinuous. Then every sequence in it has a uniformly convergent subsequence. Finding a common bound checks the first condition.",
        "定理需要两个条件：函数族逐点有界且等度连续。这时其中每个序列都有一致收敛的子列。求出公共界就验证了第一个条件。",
      ],
      (rng) => {
        const c = rng.int(-20, 20);
        const d = rng.int(1, 20);
        return ask(
          [
            `For $n \\ge 1$, let $f_n(x) = ${c} + \\frac{${d} \\sin(nx)}{n}$. What is the smallest common bound for $|f_n(x)|$ over all $x$ and all $n$?`,
            `对 $n \\ge 1$，设 $f_n(x) = ${c} + \\frac{${d} \\sin(nx)}{n}$。对所有 $x$ 和 $n$，$|f_n(x)|$ 的最小公共界是多少？`,
          ],
          Math.abs(c) + d,
          [Math.abs(c), d, Math.abs(Math.abs(c) - d) + 1],
          [`At $n = 1$ the sine reaches its extreme, which gives $|${c}| + ${d}$.`, `当 $n = 1$ 时正弦达到极值，得 $|${c}| + ${d}$。`],
        );
      },
    ),
  ],
);

const metricCompactness = topic(
  "compactness-in-metric-spaces",
  ["Compactness in Metric Spaces", "度量空间中的紧性"],
  ["Use finite nets of balls, and see why closed and bounded is no longer enough.", "使用球的有限网，并理解为什么闭且有界不再足够。"],
  ["complete-metric-spaces", "open-covers"],
  [],
  [
    point(
      "a-net-for-an-interval",
      ["A net for an interval", "区间的网"],
      [
        "A set is totally bounded when finitely many balls of any given radius cover it. On a line, a ball of radius $\\varepsilon$ is an interval of length $2\\varepsilon$, so the count is the length divided by that, rounded up.",
        "集合完全有界，是指对任意给定半径，有限个球就能覆盖它。在直线上，半径为 $\\varepsilon$ 的球是长度为 $2\\varepsilon$ 的区间，所以个数是长度除以它再向上取整。",
      ],
      (rng) => {
        const l = rng.int(3, 60);
        const m = rng.int(2, 9);
        const n = Math.ceil((l * m) / 2);
        return ask(
          [
            `What is the fewest closed balls of radius $\\frac{1}{${m}}$ needed to cover $[0, ${l}]$?`,
            `覆盖 $[0, ${l}]$ 至少需要多少个半径为 $\\frac{1}{${m}}$ 的闭球？`,
          ],
          n,
          [l * m, n + 1, Math.max(1, n - 1)],
          [
            `Each ball covers length $\\frac{2}{${m}}$, and $${l} \\div \\frac{2}{${m}}$ rounds up to ${n}.`,
            `每个球覆盖长度 $\\frac{2}{${m}}$，$${l} \\div \\frac{2}{${m}}$ 向上取整是 ${n}。`,
          ],
        );
      },
    ),
    point(
      "a-net-for-a-square",
      ["A net for a square", "正方形的网"],
      [
        "With the maximum metric on the plane, balls are squares. So a square region is covered by a grid of balls, whose count is the square of the number needed along one side.",
        "在平面的最大值度量下，球是正方形。所以正方形区域可以用球的网格覆盖，个数是一条边上所需个数的平方。",
      ],
      (rng) => {
        const m = rng.int(2, 7);
        const l = rng.int(2, 20);
        const side = Math.ceil((l * m) / 2);
        return ask(
          [
            `With the metric $d = \\max(|x_1 - x_2|, |y_1 - y_2|)$, how many closed balls of radius $\\frac{1}{${m}}$ does a grid use to cover $[0, ${l}]^{2}$ with as few as possible?`,
            `在度量 $d = \\max(|x_1 - x_2|, |y_1 - y_2|)$ 下，用网格覆盖 $[0, ${l}]^{2}$，半径为 $\\frac{1}{${m}}$ 的闭球最少用多少个？`,
          ],
          side * side,
          [2 * side, side, (l * m) ** 2],
          [
            `Each side needs ${side} balls, so the grid has $${side}^{2}$ of them.`,
            `每条边需要 ${side} 个球，所以网格有 $${side}^{2}$ 个。`,
          ],
        );
      },
    ),
    point(
      "closed-and-bounded-is-not-enough",
      ["Closed and bounded is not enough", "闭且有界不够"],
      [
        "In general metric spaces, compact means complete and totally bounded. An infinite set with the discrete metric is closed and bounded but not compact, and the same happens for the unit ball of an infinite dimensional space.",
        "在一般度量空间中，紧等于完备且完全有界。带离散度量的无限集闭且有界但不紧，无限维空间的单位球也是这样。",
      ],
      (rng) => {
        const a = rng.int(1, 30);
        const n = rng.int(2, 9);
        return choose(
          rng,
          [`Which of these metric spaces is compact?`, `下面哪个度量空间是紧的？`],
          [`The closed ball of radius ${a} in $\\mathbb{R}^{${n}}$`, `$\\mathbb{R}^{${n}}$ 中半径为 ${a} 的闭球`],
          [
            [`The open ball of radius ${a} in $\\mathbb{R}^{${n}}$`, `$\\mathbb{R}^{${n}}$ 中半径为 ${a} 的开球`],
            [`The closed ball of radius ${a} in the space of bounded sequences`, `有界数列空间中半径为 ${a} 的闭球`],
            [`The integers with the discrete metric, a set of diameter 1`, `带离散度量的整数集，其直径为 1`],
          ],
          [`In $\\mathbb{R}^{${n}}$, closed and bounded does imply compact.`, `在 $\\mathbb{R}^{${n}}$ 中，闭且有界确实推出紧。`],
        );
      },
    ),
  ],
);

const metricContinuity = topic(
  "continuity-in-metric-spaces",
  ["Continuity in Metric Spaces", "度量空间中的连续性"],
  ["Compute distances between functions, and describe continuity through open sets.", "计算函数之间的距离，并用开集描述连续性。"],
  ["distances-in-metric-spaces", "defining-continuity-at-a-point"],
  [],
  [
    point(
      "two-distances-between-functions",
      ["Two distances between functions", "函数之间的两种距离"],
      [
        "Functions can be measured by the largest gap between them or by the area between them. These two metrics give different numbers, and a sequence can converge in the area metric but not in the largest gap metric.",
        "函数之间可以用最大差距或它们之间的面积来度量。这两个度量给出不同的数，数列可能按面积度量收敛而不按最大差距度量收敛。",
      ],
      (rng) => {
        const a = rng.pick([-1, 1]) * rng.int(2, 15);
        const b = a > 0 ? a + rng.int(1, 20) : rng.int(2, 20);
        const area = rng.bool();
        return ask(
          area
            ? [
                `On $[0, 1]$, find $d_1(f, g) = \\int_0^1 |f - g|\\, dx$ for $f(x) = ${a}x$ and $g(x) = ${b}x$.`,
                `在 $[0, 1]$ 上，对 $f(x) = ${a}x$ 和 $g(x) = ${b}x$，求 $d_1(f, g) = \\int_0^1 |f - g|\\, dx$。`,
              ]
            : [
                `On $[0, 1]$, find $d_\\infty(f, g) = \\sup |f - g|$ for $f(x) = ${a}x$ and $g(x) = ${b}x$.`,
                `在 $[0, 1]$ 上，对 $f(x) = ${a}x$ 和 $g(x) = ${b}x$，求 $d_\\infty(f, g) = \\sup |f - g|$。`,
              ],
          area ? Q.of(b - a, 2) : b - a,
          area ? [b - a, Q.of(b - a, 3), Q.of(b - a, 4)] : [Q.of(b - a, 2), Q.of(b - a, 3), a + b],
          [
            area ? `The gap is $${b - a}x$, whose integral is half of ${b - a}.` : `The gap $${b - a}x$ is largest at $x = 1$.`,
            area ? `差距是 $${b - a}x$，它的积分是 ${b - a} 的一半。` : `差距 $${b - a}x$ 在 $x = 1$ 处最大。`,
          ],
        );
      },
    ),
    point(
      "the-preimage-of-an-open-set",
      ["The preimage of an open set", "开集的原像"],
      [
        "A function between metric spaces is continuous exactly when the preimage of every open set is open. For a linear function on the line, the preimage of an open interval is an open interval that can be computed directly.",
        "度量空间之间的函数连续，当且仅当每个开集的原像都是开集。对直线上的线性函数，开区间的原像是可以直接算出的开区间。",
      ],
      (rng) => {
        const m = rng.int(2, 12);
        const c = rng.int(-20, 20);
        const p = rng.int(-30, 30);
        const q = p + rng.int(1, 40);
        return ask(
          [
            `What is the length of the preimage of $(${p}, ${q})$ under $f(x) = ${m}x + (${c})$?`,
            `$(${p}, ${q})$ 在 $f(x) = ${m}x + (${c})$ 下的原像的长度是多少？`,
          ],
          Q.of(q - p, m),
          [q - p, m * (q - p), Q.of(q - p + c, m)],
          [
            `The preimage runs from $\\frac{${p} - (${c})}{${m}}$ to $\\frac{${q} - (${c})}{${m}}$.`,
            `原像从 $\\frac{${p} - (${c})}{${m}}$ 到 $\\frac{${q} - (${c})}{${m}}$。`,
          ],
        );
      },
    ),
    point(
      "balls-in-the-discrete-metric",
      ["Balls in the discrete metric", "离散度量中的球"],
      [
        "In the discrete metric every two different points are at distance 1. So a ball of radius at most 1 holds only its center, and a ball of radius greater than 1 holds the whole space. Every set is open here.",
        "在离散度量中，任意两个不同的点距离都是 1。所以半径不超过 1 的开球只含球心，半径大于 1 的开球含整个空间。这里每个集合都是开集。",
      ],
      (rng) => {
        const n = rng.int(3, 60);
        const small = rng.bool();
        const q = rng.int(2, 9);
        const r = small ? Q.of(1, q) : Q.of(q + 1, q);
        return ask(
          [
            `A set of ${n} points has the discrete metric. How many points lie in the open ball of radius $${r.toLatex()}$ around one of them?`,
            `一个 ${n} 点的集合带离散度量。以其中一点为中心、半径为 $${r.toLatex()}$ 的开球中有多少个点？`,
          ],
          small ? 1 : n,
          [small ? n : 1, n - 1, 2],
          small
            ? [`The radius is below 1, so only the center lies inside.`, `半径小于 1，所以只有球心在里面。`]
            : [`The radius is above 1, so every point lies inside.`, `半径大于 1，所以每个点都在里面。`],
        );
      },
    ),
  ],
);

const outerMeasure = topic(
  "outer-measure-on-the-line",
  ["Outer Measure on the Line", "直线上的外测度"],
  ["Extend length to more sets through covers by intervals.", "通过区间覆盖把长度推广到更多集合。"],
  ["sets-of-measure-zero"],
  [],
  [
    point(
      "the-measure-of-overlapping-intervals",
      ["The measure of overlapping intervals", "重叠区间的测度"],
      [
        "The outer measure of a union of intervals is the length of what is actually covered, so overlaps count once. In general outer measure is only subadditive: the measure of a union is at most the sum.",
        "区间并的外测度是实际覆盖的长度，所以重叠部分只算一次。一般来说外测度只有次可加性：并的测度不超过各部分之和。",
      ],
      (rng) => {
        const a = rng.int(-20, 10);
        const b = a + rng.int(3, 15);
        const c = rng.int(a + 1, b - 1);
        const d = b + rng.int(1, 12);
        return ask(
          [`What is the outer measure of $[${a}, ${b}] \\cup [${c}, ${d}]$?`, `$[${a}, ${b}] \\cup [${c}, ${d}]$ 的外测度是多少？`],
          d - a,
          [b - a + (d - c), d - c, b - c],
          [`Together they cover exactly $[${a}, ${d}]$.`, `它们合起来恰好覆盖 $[${a}, ${d}]$。`],
        );
      },
    ),
    point(
      "covering-a-countable-set-cheaply",
      ["Covering a countable set cheaply", "廉价地覆盖可数集"],
      [
        "To show a countable set has measure zero, give the $k$th point an interval of length $\\frac{\\varepsilon}{2^{k}}$. The total length is then at most $\\varepsilon$, however small $\\varepsilon$ is chosen.",
        "要证明可数集测度为零，就给第 $k$ 个点一个长度为 $\\frac{\\varepsilon}{2^{k}}$ 的区间。这样总长度不超过 $\\varepsilon$，不管 $\\varepsilon$ 取得多小。",
      ],
      (rng) => {
        const n = rng.int(2, 9);
        const m = rng.int(2, 30);
        return ask(
          [
            `Points 1 through ${n} of a list get intervals of length $\\frac{\\varepsilon}{2^{k}}$, with $\\varepsilon = \\frac{1}{${m}}$. What is the total length of these ${n} intervals?`,
            `列表中第 1 到第 ${n} 个点得到长度为 $\\frac{\\varepsilon}{2^{k}}$ 的区间，$\\varepsilon = \\frac{1}{${m}}$。这 ${n} 个区间的总长度是多少？`,
          ],
          Q.of(2 ** n - 1, m * 2 ** n),
          [Q.of(1, m), Q.of(1, m * 2 ** n), Q.of(2 ** n + 1, m * 2 ** n)],
          [
            `The sum of $2^{-k}$ up to ${n} is $1 - 2^{-${n}}$, times $\\varepsilon$.`,
            `$2^{-k}$ 到 ${n} 的和是 $1 - 2^{-${n}}$，再乘 $\\varepsilon$。`,
          ],
        );
      },
    ),
    point(
      "removing-a-null-set",
      ["Removing a null set", "去掉零测集"],
      [
        "Removing a set of measure zero does not change the measure. So an interval and the same interval with its rationals removed have the same length, even though one looks far thinner than the other.",
        "去掉测度为零的集合不改变测度。所以一个区间与去掉其中有理数后的区间长度相同，尽管后者看起来薄得多。",
      ],
      (rng) => {
        const a = rng.int(-20, 20);
        const b = a + rng.int(1, 25);
        const c = b + rng.int(1, 8);
        const d = c + rng.int(1, 25);
        return ask(
          [
            `What is the Lebesgue measure of $([${a}, ${b}] \\cup [${c}, ${d}]) \\setminus \\mathbb{Q}$?`,
            `$([${a}, ${b}] \\cup [${c}, ${d}]) \\setminus \\mathbb{Q}$ 的勒贝格测度是多少？`,
          ],
          b - a + d - c,
          [0, d - a, b - a],
          [`The rationals have measure zero, so only the two lengths matter.`, `有理数的测度为零，所以只有两段长度起作用。`],
        );
      },
    ),
  ],
);

const lebesgue = topic(
  "the-lebesgue-integral-of-simple-functions",
  ["The Lebesgue Integral of Simple Functions", "简单函数的勒贝格积分"],
  [
    "Integrate by slicing the range, and meet functions that the Riemann integral cannot handle.",
    "通过切分值域积分，认识黎曼积分处理不了的函数。",
  ],
  ["outer-measure-on-the-line"],
  [],
  [
    point(
      "adding-value-times-measure",
      ["Adding value times measure", "值乘测度相加"],
      [
        "A simple function takes finitely many values, each on a measurable set. Its integral adds each value times the measure of the set where it is taken, with no requirement that those sets be intervals.",
        "简单函数只取有限个值，每个值在一个可测集上取到。它的积分把每个值乘取到该值的集合的测度再相加，不要求这些集合是区间。",
      ],
      (rng) => {
        const [c1, c2, c3] = [rng.int(-9, 12), rng.int(-9, 12), rng.int(-9, 12)];
        const [m1, m2, m3] = [rng.int(1, 9), rng.int(1, 9), rng.int(1, 9)];
        return ask(
          [
            `A simple function takes the value ${c1} on a set of measure ${m1}, ${c2} on a set of measure ${m2} and ${c3} on a set of measure ${m3}, these sets being disjoint. What is its integral?`,
            `简单函数在测度为 ${m1} 的集合上取 ${c1}，在测度为 ${m2} 的集合上取 ${c2}，在测度为 ${m3} 的集合上取 ${c3}，这些集合互不相交。它的积分是多少？`,
          ],
          c1 * m1 + c2 * m2 + c3 * m3,
          [c1 + c2 + c3, m1 + m2 + m3, c1 * m1 + c2 * m2],
          [
            `Add the products of each value and its measure, which gives ${c1 * m1 + c2 * m2 + c3 * m3}.`,
            `把每个值与其测度的积相加，得 ${c1 * m1 + c2 * m2 + c3 * m3}。`,
          ],
        );
      },
    ),
    point(
      "a-function-that-riemann-cannot-integrate",
      ["A function that Riemann cannot integrate", "黎曼积分处理不了的函数"],
      [
        "A function equal to one constant on the rationals and another on the irrationals has no Riemann integral, since upper and lower sums disagree. The Lebesgue integral exists, and the rationals contribute nothing because their measure is zero.",
        "在有理数上取一个常数、在无理数上取另一个常数的函数没有黎曼积分，因为上和与下和不相等。勒贝格积分存在，有理数因测度为零而没有贡献。",
      ],
      (rng) => {
        const c = rng.int(1, 15);
        const d = c + rng.int(1, 15);
        const a = rng.int(-9, 9);
        const b = a + rng.int(1, 12);
        return ask(
          [
            `On $[${a}, ${b}]$, $f(x) = ${d}$ for rational $x$ and $f(x) = ${c}$ for irrational $x$. What is the Lebesgue integral of $f$?`,
            `在 $[${a}, ${b}]$ 上，当 $x$ 是有理数时 $f(x) = ${d}$，当 $x$ 是无理数时 $f(x) = ${c}$。$f$ 的勒贝格积分是多少？`,
          ],
          c * (b - a),
          [d * (b - a), (c + d) * (b - a), 0],
          [`The rationals have measure zero, so only the value ${c} counts.`, `有理数的测度为零，所以只有值 ${c} 起作用。`],
        );
      },
    ),
    point(
      "when-a-limit-escapes-the-integral",
      ["When a limit escapes the integral", "极限逃出积分"],
      [
        "A limit cannot always pass inside an integral. Tall thin spikes can tend to zero at every point while keeping a fixed area, and the dominated convergence theorem excludes this by requiring one integrable upper bound.",
        "极限不总能移到积分号内。高而窄的尖峰可以在每点趋于零，同时保持固定面积；控制收敛定理通过要求一个可积的上界排除这种情况。",
      ],
      (rng) => {
        const a = rng.int(2, 30);
        const b = rng.int(2, 9);
        const inner = rng.bool();
        return ask(
          inner
            ? [
                `Let $f_n = ${a} n$ on $\\left(0, \\frac{${b}}{n}\\right)$ and 0 elsewhere. What is $\\int \\lim_{n \\to \\infty} f_n\\, dx$?`,
                `设 $f_n$ 在 $\\left(0, \\frac{${b}}{n}\\right)$ 上等于 $${a} n$，其他地方为 0。$\\int \\lim_{n \\to \\infty} f_n\\, dx$ 是多少？`,
              ]
            : [
                `Let $f_n = ${a} n$ on $\\left(0, \\frac{${b}}{n}\\right)$ and 0 elsewhere. What is $\\lim_{n \\to \\infty} \\int f_n\\, dx$?`,
                `设 $f_n$ 在 $\\left(0, \\frac{${b}}{n}\\right)$ 上等于 $${a} n$，其他地方为 0。$\\lim_{n \\to \\infty} \\int f_n\\, dx$ 是多少？`,
              ],
          inner ? 0 : a * b,
          inner ? [a * b, a, b] : [0, a, b],
          inner
            ? [`Each point eventually lies outside the spike, so the limit function is 0.`, `每一点最终都在尖峰之外，所以极限函数是 0。`]
            : [
                `Every integral equals $${a} n \\cdot \\frac{${b}}{n} = ${a * b}$.`,
                `每个积分都等于 $${a} n \\cdot \\frac{${b}}{n} = ${a * b}$。`,
              ],
        );
      },
    ),
  ],
);

const baire = topic(
  "nowhere-dense-sets-and-the-baire-category-theorem",
  ["Nowhere Dense Sets and the Baire Category Theorem", "无处稠密集与贝尔纲定理"],
  [
    "Tell thin sets from large ones by category, and use that a complete space is not a countable union of thin sets.",
    "用纲区分稀疏集合和大集合，并利用完备空间不是可数个稀疏集合的并。",
  ],
  ["limit-points-and-closures", "complete-metric-spaces"],
  [],
  [
    point(
      "which-set-is-nowhere-dense",
      ["Which set is nowhere dense", "哪个集合无处稠密"],
      [
        "A set is nowhere dense when its closure contains no interval. So the integers and the Cantor set are nowhere dense, while the rationals are not, since their closure is the entire line.",
        "集合无处稠密，是指它的闭包不含区间。所以整数集和康托尔集无处稠密，而有理数不是，因为它们的闭包是整条直线。",
      ],
      (rng) => {
        const a = rng.int(-20, 20);
        const b = a + rng.int(1, 20);
        const k = rng.int(2, 30);
        return choose(
          rng,
          [`Which set is nowhere dense in $\\mathbb{R}$?`, `哪个集合在 $\\mathbb{R}$ 中无处稠密？`],
          same(`\\left\\{ ${a} + \\frac{${k}}{n} : n \\ge 1 \\right\\}`),
          [same(`\\mathbb{Q} \\cap [${a}, ${b}]`), same(`(${a}, ${b})`), same(`[${a}, ${b}] \\setminus \\mathbb{Q}`)],
          [`Its closure only adds the point ${a}, and it contains no interval.`, `它的闭包只增加点 ${a}，不含任何区间。`],
        );
      },
    ),
    point(
      "the-interior-of-a-closure",
      ["The interior of a closure", "闭包的内部"],
      [
        "To test a set, take its closure first and then look for an interval inside. A dense part of an interval has that whole interval as its closure, so the length of the interior of the closure can be large.",
        "检验集合时，先取闭包，再看里面有没有区间。区间中稠密的部分以整个区间为闭包，所以闭包内部的长度可能很大。",
      ],
      (rng) => {
        const a = rng.int(-20, 10);
        const b = a + rng.int(1, 15);
        const c = b + rng.int(1, 6);
        const n = rng.int(1, 5);
        const list = Array.from({ length: n }, (_, i) => c + i);
        return ask(
          [
            `Let $S = (\\mathbb{Q} \\cap [${a}, ${b}]) \\cup \\{${list.join(", ")}\\}$. What is the length of the interior of the closure of $S$?`,
            `设 $S = (\\mathbb{Q} \\cap [${a}, ${b}]) \\cup \\{${list.join(", ")}\\}$。$S$ 的闭包的内部长度是多少？`,
          ],
          b - a,
          [0, b - a + n, c - a],
          [
            `The closure is $[${a}, ${b}]$ together with isolated points, which add no length.`,
            `闭包是 $[${a}, ${b}]$ 加上孤立点，它们不增加长度。`,
          ],
        );
      },
    ),
    point(
      "using-the-category-theorem",
      ["Using the category theorem", "使用纲定理"],
      [
        "The Baire theorem says a complete metric space is not a countable union of nowhere dense sets. So on the line, the complement of such a union is dense and even uncountable in every interval.",
        "贝尔定理说，完备度量空间不是可数个无处稠密集的并。所以在直线上，这种并的补集是稠密的，并且在每个区间中都不可数。",
      ],
      (rng) => {
        const a = rng.int(-30, 20);
        const b = a + rng.int(1, 20);
        return choose(
          rng,
          [
            `$S$ is a countable union of nowhere dense subsets of $\\mathbb{R}$. What must be true of $[${a}, ${b}] \\setminus S$?`,
            `$S$ 是 $\\mathbb{R}$ 的可数个无处稠密子集的并。$[${a}, ${b}] \\setminus S$ 一定满足什么？`,
          ],
          [`It is not empty, and in fact it is dense in $[${a}, ${b}]$`, `它不是空集，而且在 $[${a}, ${b}]$ 中稠密`],
          [
            [`It is empty`, `它是空集`],
            [`It has measure ${b - a}`, `它的测度是 ${b - a}`],
            [`It is finite`, `它是有限集`],
          ],
          [
            `Otherwise a closed interval, which is complete, would be a countable union of nowhere dense sets.`,
            `否则闭区间这个完备空间就是可数个无处稠密集的并。`,
          ],
        );
      },
    ),
  ],
);

/** realAnalysisExtraTopics holds the topics that complete the Real Analysis course. */
export const realAnalysisExtraTopics: readonly TopicDef[] = [
  orderedField,
  nestedIntervals,
  limitPoints,
  cantorSet,
  connected,
  compactImages,
  monotoneJumps,
  boundedVariation,
  stieltjes,
  improperAnalysis,
  dirichletAbel,
  tails,
  uniformLimits,
  differentiatingSequences,
  powerUniform,
  bernstein,
  arzela,
  metricCompactness,
  metricContinuity,
  outerMeasure,
  lebesgue,
  baire,
];
