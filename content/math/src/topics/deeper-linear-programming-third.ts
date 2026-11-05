// Third knowledge points for thin topics of Linear Programming: the reverse question, a harder
// case or a common trap. See `deeperLinearProgrammingThirdPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { poly, Q } from "@ga/subject-math";

import { ask, point } from "../university-kit.ts";

/** column writes a column vector. */
const column = (values: readonly number[]) => `\\begin{pmatrix} ${values.join(" \\\\ ")} \\end{pmatrix}`;
/** smallest gives the smallest of a nonempty list of fractions. */
const smallest = (values: readonly Q[]) => values.reduce((a, b) => (b.cmp(a) < 0 ? b : a));

const threeConstraintFarkas = point(
  "a-certificate-from-three-constraints",
  ["A certificate from three constraints", "来自三个约束的证明"],
  [
    "A Farkas certificate combines constraints with nonnegative multipliers so that the variables cancel and an impossible inequality remains. With $x \\le a$, $y \\le b$ and $px + qy \\ge c$, the multipliers $p$, $q$ and $1$ show that the system is infeasible as soon as $c > pa + qb$.",
    "法卡斯证明用非负乘数组合约束，使变量相消，留下不可能成立的不等式。对 $x \\le a$，$y \\le b$ 和 $px + qy \\ge c$，乘数 $p$，$q$ 和 $1$ 说明只要 $c > pa + qb$，方程组就不可行。",
  ],
  (rng) => {
    const a = rng.int(2, 12);
    const b = rng.int(2, 12);
    const p = rng.int(2, 9);
    const q = rng.int(2, 9);
    const answer = p * a + q * b;
    return ask(
      [
        `The constraints are $x \\le ${a}$, $y \\le ${b}$ and $${p}x + ${q}y \\ge c$. What is the largest value of $c$ for which the system is feasible?`,
        `约束为 $x \\le ${a}$，$y \\le ${b}$ 和 $${p}x + ${q}y \\ge c$。使方程组可行的 $c$ 的最大值是多少？`,
      ],
      answer,
      [a + b, p * a, q * b],
      [
        `Multiplying the first two constraints by $${p}$ and $${q}$ and adding gives $${p}x + ${q}y \\le ${answer}$. So $c$ can be at most $${answer}$, and $x = ${a}$, $y = ${b}$ attains it.`,
        `把前两个约束分别乘以 $${p}$ 和 $${q}$ 再相加，得 $${p}x + ${q}y \\le ${answer}$。所以 $c$ 至多为 $${answer}$，并且 $x = ${a}$，$y = ${b}$ 能取到。`,
      ],
    );
  },
);

const ratioTest = point(
  "the-ratio-test-with-nonpositive-entries",
  ["The ratio test with nonpositive entries", "含非正元素的比值检验"],
  [
    "The ratio test limits how far the entering variable can rise. Only rows with a positive entry in its column set a limit, because a row with a zero or negative entry stays feasible as the variable grows. Taking ratios in those rows is a common mistake.",
    "比值检验限制进基变量能增加多少。只有该列元素为正的行才构成限制，因为元素为零或负的行在变量增大时保持可行。在这些行中取比值是常见的错误。",
  ],
  (rng) => {
    const free = rng.int(0, 2);
    const entries = [0, 1, 2].map((i) => (i === free ? rng.int(-5, 0) : rng.int(1, 6)));
    const right = [rng.int(1, 30), rng.int(1, 30), rng.int(1, 30)];
    const ratios = entries.flatMap((e, i) => (e > 0 ? [Q.of(right[i] as number, e)] : []));
    const answer = smallest(ratios);
    const allRatios = entries.flatMap((e, i) => (e !== 0 ? [Q.of(right[i] as number, Math.abs(e))] : []));
    const largest = ratios.reduce((a, b) => (b.cmp(a) > 0 ? b : a));
    return ask(
      [
        `In a simplex tableau, the entering column is $${column(entries)}$ and the right side is $${column(right)}$. How far can the entering variable rise?`,
        `在单纯形表中，进基列是 $${column(entries)}$，右端是 $${column(right)}$。进基变量最多能增加多少？`,
      ],
      answer,
      [smallest(allRatios), largest, Q.of(Math.min(...right))],
      [
        `Only rows with positive entries set a limit, and row ${free + 1} does not. The ratios are $${ratios.map((r) => r.toLatex()).join(", ")}$, and the smallest is $${answer.toLatex()}$.`,
        `只有元素为正的行才构成限制，第 ${free + 1} 行不构成限制。比值是 $${ratios.map((r) => r.toLatex()).join(", ")}$，最小的是 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const slacknessDual = point(
  "finding-the-dual-by-complementary-slackness",
  ["Finding the dual by complementary slackness", "由互补松弛求对偶解"],
  [
    "If a primal variable is positive at an optimum, its dual constraint must be tight there. So when both primal variables are positive, the two dual constraints become equations, and solving them gives the dual solution. Its value then equals the primal value, which proves optimality.",
    "如果原始变量在最优解处为正，那么它的对偶约束在那里必须是紧的。所以当两个原始变量都为正时，两个对偶约束变为等式，解它们就得到对偶解。它的值等于原始值，这证明了最优性。",
  ],
  (rng) => {
    let a = rng.int(1, 6);
    const b = rng.int(1, 6);
    const c = rng.int(1, 6);
    const d = rng.int(1, 6);
    if (a * d === b * c) a = a === 6 ? 1 : a + 1;
    if (a * d === b * c) a = a === 6 ? 1 : a + 1;
    const y1 = rng.int(1, 6);
    const y2 = rng.int(1, 6);
    const c1 = a * y1 + c * y2;
    const c2 = b * y1 + d * y2;
    const x1 = rng.int(1, 6);
    const x2 = rng.int(1, 6);
    const b1 = a * x1 + b * x2;
    const b2 = c * x1 + d * x2;
    const row = (p: number, q: number, first: string, second: string) => poly([p, first], [q, second]);
    return ask(
      [
        `Maximize $${row(c1, c2, "x_1", "x_2")}$ subject to $${row(a, b, "x_1", "x_2")} \\le ${b1}$, $${row(c, d, "x_1", "x_2")} \\le ${b2}$, $x \\ge 0$. The point $x = (${x1}, ${x2})$ is optimal. What is $y_1$ in the optimal dual solution?`,
        `在 $${row(a, b, "x_1", "x_2")} \\le ${b1}$，$${row(c, d, "x_1", "x_2")} \\le ${b2}$，$x \\ge 0$ 的条件下最大化 $${row(c1, c2, "x_1", "x_2")}$。点 $x = (${x1}, ${x2})$ 是最优解。最优对偶解中的 $y_1$ 是多少？`,
      ],
      y1,
      [y2 === y1 ? y1 + 1 : y2, y1 + y2, Q.of(c1, a)],
      [
        `Both $x_1$ and $x_2$ are positive, so the dual constraints are tight: $${row(a, c, "y_1", "y_2")} = ${c1}$ and $${row(b, d, "y_1", "y_2")} = ${c2}$. Solving gives $y_1 = ${y1}$ and $y_2 = ${y2}$.`,
        `$x_1$ 和 $x_2$ 都为正，所以对偶约束是紧的：$${row(a, c, "y_1", "y_2")} = ${c1}$，$${row(b, d, "y_1", "y_2")} = ${c2}$。解得 $y_1 = ${y1}$，$y_2 = ${y2}$。`,
      ],
    );
  },
);

const howFarDown = point(
  "how-far-a-resource-can-fall",
  ["How far a resource can fall", "资源最多能减少多少"],
  [
    "Lowering a resource by $\\delta$ changes the basic values to $x_B - \\delta \\, d$, where $d$ is the column of $B^{-1}$ for that resource. So positive entries of $d$ limit a decrease, while negative entries limit an increase. The two directions use different rows of the column.",
    "把资源减少 $\\delta$ 使基变量的值变为 $x_B - \\delta \\, d$，其中 $d$ 是 $B^{-1}$ 中对应这个资源的列。所以 $d$ 的正元素限制减少，而负元素限制增加。两个方向用的是这一列的不同行。",
  ],
  (rng) => {
    const positive = rng.int(0, 2);
    const negative = (positive + rng.int(1, 2)) % 3;
    const entries = [0, 1, 2].map((i) =>
      i === positive ? rng.int(1, 6) : i === negative ? -rng.int(1, 6) : rng.pick([-3, -2, -1, 1, 2, 3, 4]),
    );
    const values = [rng.int(5, 60), rng.int(5, 60), rng.int(5, 60)];
    const down = entries.flatMap((e, i) => (e > 0 ? [Q.of(values[i] as number, e)] : []));
    const up = entries.flatMap((e, i) => (e < 0 ? [Q.of(values[i] as number, -e)] : []));
    const answer = smallest(down);
    const shown = down.map((r) => r.toLatex()).join(", ");
    return ask(
      [
        `The optimal basic values are $x_B = ${column(values)}$, and the column of $B^{-1}$ for a resource is $${column(entries)}$. How far can this resource fall before the basis stops being feasible?`,
        `最优基变量的值是 $x_B = ${column(values)}$，某资源对应的 $B^{-1}$ 的列是 $${column(entries)}$。这个资源最多减少多少，基仍然可行？`,
      ],
      answer,
      [smallest(up), smallest([...down, ...up]).eq(answer) ? answer.add(Q.of(1)) : smallest([...down, ...up]), Q.of(Math.min(...values))],
      [
        down.length === 1
          ? `A decrease reduces only the basic values with positive entries in the column. Only one row qualifies, and its ratio is $${answer.toLatex()}$.`
          : `A decrease reduces only the basic values with positive entries in the column. The ratios for these rows are $${shown}$, and the smallest is $${answer.toLatex()}$.`,
        down.length === 1
          ? `减少资源只会使列中元素为正的基变量的值减小。只有一行符合，它的比值是 $${answer.toLatex()}$。`
          : `减少资源只会使列中元素为正的基变量的值减小。这些行的比值是 $${shown}$，最小的是 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const cutSlack = point(
  "why-a-gomory-cut-keeps-integer-points",
  ["Why a Gomory cut keeps integer points", "戈莫里割为什么保留整数点"],
  [
    "The Gomory cut $f_1 s_1 + f_2 s_2 \\ge f_0$ uses fractional parts, and a negative coefficient has a fractional part that is positive, such as $\\frac{2}{3}$ for $-\\frac{4}{3}$. At an integer feasible point, the slack of the cut is a nonnegative integer, so no such point is removed.",
    "戈莫里割 $f_1 s_1 + f_2 s_2 \\ge f_0$ 使用小数部分，负系数的小数部分是正的，例如 $-\\frac{4}{3}$ 的小数部分是 $\\frac{2}{3}$。在整数可行点处，割的松弛量是非负整数，所以不会去掉这样的点。",
  ],
  (rng) => {
    const d = rng.pick([3, 4, 5, 7]);
    const fraction = (n: number) => ((n % d) + d) % d;
    let A = 0;
    let B = 0;
    let R = 0;
    let p = 0;
    let q = 0;
    let x = 0;
    while (fraction(R) === 0 || fraction(A) === 0 || fraction(B) === 0 || R <= 0) {
      A = rng.int(-9, 9);
      B = rng.int(-9, 9);
      p = rng.int(0, 4);
      q = rng.int(0, 4);
      x = rng.int(0, 5);
      R = A * p + B * q + d * x;
    }
    const fa = Q.of(fraction(A), d);
    const fb = Q.of(fraction(B), d);
    const fr = Q.of(fraction(R), d);
    const answer = fa
      .mul(Q.of(p))
      .add(fb.mul(Q.of(q)))
      .sub(fr);
    const row = poly([1, "x_1"], [Q.of(A, d), "s_1"], [Q.of(B, d), "s_2"]);
    const cut = poly([fa, "s_1"], [fb, "s_2"]);
    return ask(
      [
        `A tableau row reads $${row} = ${Q.of(R, d).toLatex()}$. The point with $s_1 = ${p}$, $s_2 = ${q}$ and $x_1 = ${x}$ is integer and feasible. What is the left side minus the right side of the Gomory cut from this row at this point?`,
        `单纯形表的一行是 $${row} = ${Q.of(R, d).toLatex()}$。满足 $s_1 = ${p}$，$s_2 = ${q}$，$x_1 = ${x}$ 的点是整数可行点。在这一点，由这一行得到的戈莫里割的左边减右边是多少？`,
      ],
      answer,
      [Q.of(-x), fr, fa.mul(Q.of(p)).add(fb.mul(Q.of(q)))],
      [
        `The cut is $${cut} \\ge ${fr.toLatex()}$, using fractional parts. Substituting gives $${fa
          .mul(Q.of(p))
          .add(fb.mul(Q.of(q)))
          .toLatex()} - ${fr.toLatex()} = ${answer.toLatex()}$, a nonnegative integer as expected.`,
        `用小数部分，割是 $${cut} \\ge ${fr.toLatex()}$。代入得 $${fa
          .mul(Q.of(p))
          .add(fb.mul(Q.of(q)))
          .toLatex()} - ${fr.toLatex()} = ${answer.toLatex()}$，如预期是非负整数。`,
      ],
    );
  },
);

/** deeperLinearProgrammingThirdPoints maps topics of Linear Programming to a third knowledge point. */
export const deeperLinearProgrammingThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "infeasible-programs-and-farkas-lemma": [threeConstraintFarkas],
  "pivoting-in-the-simplex-method": [ratioTest],
  "weak-duality": [slacknessDual],
  "right-hand-side-ranging": [howFarDown],
  "gomory-cutting-planes": [cutSlack],
};
