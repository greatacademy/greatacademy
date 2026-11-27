// Third knowledge points for thin topics of Linear Programming: the reverse question, a harder
// case or a common trap. See `deeperLinearProgrammingThirdPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { poly, Q } from "@ga/subject-math";

import { point } from "../university-kit.ts";
import { solved } from "./linear-programming.ts";

/** column writes a column vector. */
const column = (values: readonly number[]) => `\\begin{pmatrix} ${values.join(" \\\\ ")} \\end{pmatrix}`;
/** smallest gives the smallest of a nonempty list of fractions. */
const smallest = (values: readonly Q[]) => values.reduce((a, b) => (b.cmp(a) < 0 ? b : a));

const threeConstraintFarkas = point(
  "a-certificate-from-three-constraints",
  ["A certificate from three constraints", "来自三个约束的证明"],
  [
    "A Farkas certificate combines constraints with nonnegative multipliers so that the variables cancel and an impossible inequality remains. With $x \\le a$, $y \\le b$ and $px + qy \\ge c$, the multipliers $p$, $q$ and $1$ show that the system is infeasible as soon as $c > pa + qb$.\n\nWith $x \\le 4$, $y \\le 5$ and $2x + 3y \\ge c$, the multipliers 2 and 3 give $2x + 3y \\le 2(4) + 3(5) = 23$. So the system is feasible for $c \\le 23$ and infeasible for $c = 24$.\n\nCheck: $x = 4$, $y = 5$ gives $2x + 3y = 23$, so $c = 23$ is attained.\n\n> **Watch out.** Multiply each bound by the coefficient of its variable before adding; adding the bounds alone gives a number with no meaning here.",
    "法卡斯证明用非负乘数组合约束，使变量相消，留下不可能成立的不等式。对 $x \\le a$，$y \\le b$ 和 $px + qy \\ge c$，乘数 $p$，$q$ 和 $1$ 说明只要 $c > pa + qb$，方程组就不可行。\n\n对 $x \\le 4$，$y \\le 5$ 和 $2x + 3y \\ge c$，乘数 2 和 3 给出 $2x + 3y \\le 2(4) + 3(5) = 23$。所以 $c \\le 23$ 时方程组可行，$c = 24$ 时不可行。\n\n检验：$x = 4$，$y = 5$ 给出 $2x + 3y = 23$，所以 $c = 23$ 能取到。\n\n> **注意。** 相加之前要把每个上界乘以它所对应变量的系数；只把上界相加得到的数在这里没有意义。",
  ],
  (rng) => {
    const a = rng.int(2, 12);
    const b = rng.int(2, 12);
    const p = rng.int(2, 9);
    const q = rng.int(2, 9);
    const answer = p * a + q * b;
    return solved(
      [
        `The constraints are $x \\le ${a}$, $y \\le ${b}$ and $${p}x + ${q}y \\ge c$. What is the largest value of $c$ for which the system is feasible?`,
        `约束为 $x \\le ${a}$，$y \\le ${b}$ 和 $${p}x + ${q}y \\ge c$。使方程组可行的 $c$ 的最大值是多少？`,
      ],
      answer,
      [
        [a + b, "That adds the bounds without multiplying them by the coefficients.", "这把上界直接相加，没有乘以系数。"],
        [p * a, `That uses only the bound on $x$ and forgets the ${q}y term.`, `这只用了 $x$ 的上界，忘了 ${q}y 这一项。`],
        [q * b, `That uses only the bound on $y$ and forgets the ${p}x term.`, `这只用了 $y$ 的上界，忘了 ${p}x 这一项。`],
        [
          answer + 1,
          `For that value the certificate gives $${answer + 1} \\le ${p}x + ${q}y \\le ${answer}$, which is impossible.`,
          `对这个值，证明给出 $${answer + 1} \\le ${p}x + ${q}y \\le ${answer}$，不可能成立。`,
        ],
      ],
      [
        [
          ["Combine the bounds", "组合上界"],
          [
            `Multiplying $x \\le ${a}$ by ${p} and $y \\le ${b}$ by ${q} and adding gives $${p}x + ${q}y \\le ${p}(${a}) + ${q}(${b}) = ${answer}$.`,
            `把 $x \\le ${a}$ 乘以 ${p}，$y \\le ${b}$ 乘以 ${q}，相加得 $${p}x + ${q}y \\le ${p}(${a}) + ${q}(${b}) = ${answer}$。`,
          ],
        ],
        [
          ["Compare with the third constraint", "与第三个约束比较"],
          [
            `So $${p}x + ${q}y \\ge c$ can hold only when $c \\le ${answer}$.`,
            `所以只有 $c \\le ${answer}$ 时 $${p}x + ${q}y \\ge c$ 才能成立。`,
          ],
        ],
      ],
      [
        `The point $x = ${a}$, $y = ${b}$ gives $${p}(${a}) + ${q}(${b}) = ${answer}$, so $c = ${answer}$ is attained.`,
        `点 $x = ${a}$，$y = ${b}$ 给出 $${p}(${a}) + ${q}(${b}) = ${answer}$，所以 $c = ${answer}$ 能取到。`,
      ],
    );
  },
);

const ratioTest = point(
  "the-ratio-test-with-nonpositive-entries",
  ["The ratio test with nonpositive entries", "含非正元素的比值检验"],
  [
    "The ratio test limits how far the entering variable can rise. Only rows with a positive entry in its column set a limit, because a row with a zero or negative entry stays feasible as the variable grows. Taking ratios in those rows is a common mistake.\n\nWith entering column $(2, -3, 4)$ and right side $(10, 3, 12)$, only rows 1 and 3 count. Their ratios are $\\frac{10}{2} = 5$ and $\\frac{12}{4} = 3$, so the variable can rise by 3. Row 2 would give the ratio 1, but it does not limit anything.\n\nCheck: at a rise of 3 the basic values are $10 - 6 = 4$, $3 + 9 = 12$ and $12 - 12 = 0$, all nonnegative.\n\n> **Watch out.** A row with a negative entry gains as the variable rises, so it never limits the rise, however small its ratio looks.",
    "比值检验限制进基变量能增加多少。只有该列元素为正的行才构成限制，因为元素为零或负的行在变量增大时保持可行。在这些行中取比值是常见的错误。\n\n进基列是 $(2, -3, 4)$，右端是 $(10, 3, 12)$，只有第 1 行和第 3 行算数。它们的比值是 $\\frac{10}{2} = 5$ 和 $\\frac{12}{4} = 3$，所以变量最多增加 3。第 2 行会给出比值 1，但它不构成限制。\n\n检验：增加 3 时基变量的值是 $10 - 6 = 4$，$3 + 9 = 12$ 和 $12 - 12 = 0$，都非负。\n\n> **注意。** 元素为负的行在变量增大时反而增大，所以不论它的比值看起来多小，都不限制增加量。",
  ],
  (rng) => {
    const free = rng.int(0, 2);
    const entries = [0, 1, 2].map((i) => (i === free ? rng.int(-5, 0) : rng.int(1, 6)));
    const right = [rng.int(1, 30), rng.int(1, 30), rng.int(1, 30)];
    const ratios = entries.flatMap((e, i) => (e > 0 ? [Q.of(right[i] as number, e)] : []));
    const answer = smallest(ratios);
    const allRatios = entries.flatMap((e, i) => (e !== 0 ? [Q.of(right[i] as number, Math.abs(e))] : []));
    const largest = ratios.reduce((a, b) => (b.cmp(a) > 0 ? b : a));
    const after = entries.map((e, i) =>
      Q.of(right[i] as number)
        .sub(answer.mul(Q.of(e)))
        .toLatex(),
    );
    return solved(
      [
        `In a simplex tableau, the entering column is $${column(entries)}$ and the right side is $${column(right)}$. How far can the entering variable rise?`,
        `在单纯形表中，进基列是 $${column(entries)}$，右端是 $${column(right)}$。进基变量最多能增加多少？`,
      ],
      answer,
      [
        [
          smallest(allRatios),
          `That takes a ratio in row ${free + 1}, whose entry is not positive, so it never limits the rise.`,
          `这在第 ${free + 1} 行取了比值，但那一行的元素不是正的，从不限制增加量。`,
        ],
        [largest, "That is the largest ratio; the smallest one stops the rise first.", "这是最大的比值；最小的比值会先挡住增加。"],
        [
          Q.of(Math.min(...right)),
          "That is the smallest right side, without dividing by the entries.",
          "这是最小的右端，没有除以列中的元素。",
        ],
      ],
      [
        [
          ["Keep the positive rows", "保留元素为正的行"],
          [
            `Row ${free + 1} has the entry ${entries[free]}, which is not positive, so only the other two rows set a limit.`,
            `第 ${free + 1} 行的元素是 ${entries[free]}，不是正的，所以只有另外两行构成限制。`,
          ],
        ],
        [
          ["Take the smallest ratio", "取最小比值"],
          [
            `Their ratios are $${ratios.map((r) => r.toLatex()).join(", ")}$, and the smallest is $${answer.toLatex()}$.`,
            `它们的比值是 $${ratios.map((r) => r.toLatex()).join(", ")}$，最小的是 $${answer.toLatex()}$。`,
          ],
        ],
      ],
      [
        `At a rise of $${answer.toLatex()}$ the basic values become $${after.join(", ")}$, all nonnegative, with a zero in the limiting row.`,
        `增加 $${answer.toLatex()}$ 时基变量的值变为 $${after.join(", ")}$，都非负，限制行变为零。`,
      ],
    );
  },
);

const slacknessDual = point(
  "finding-the-dual-by-complementary-slackness",
  ["Finding the dual by complementary slackness", "由互补松弛求对偶解"],
  [
    "If a primal variable is positive at an optimum, its dual constraint must be tight there. So when both primal variables are positive, the two dual constraints become equations, and solving them gives the dual solution. Its value then equals the primal value, which proves optimality.\n\nMaximize $5x_1 + 4x_2$ subject to $x_1 + x_2 \\le 5$ and $2x_1 + x_2 \\le 8$, with optimum $x = (3, 2)$. Both variables are positive, so $y_1 + 2y_2 = 5$ and $y_1 + y_2 = 4$, which give $y_1 = 3$ and $y_2 = 1$.\n\nCheck: the dual value $5(3) + 8(1) = 23$ equals the primal value $5(3) + 4(2) = 23$.\n\n> **Watch out.** The dual constraints use the columns of the primal: the coefficients of $x_1$ in both rows form the first dual constraint.",
    "如果原始变量在最优解处为正，那么它的对偶约束在那里必须是紧的。所以当两个原始变量都为正时，两个对偶约束变为等式，解它们就得到对偶解。它的值等于原始值，这证明了最优性。\n\n在 $x_1 + x_2 \\le 5$ 和 $2x_1 + x_2 \\le 8$ 的条件下最大化 $5x_1 + 4x_2$，最优解是 $x = (3, 2)$。两个变量都为正，所以 $y_1 + 2y_2 = 5$，$y_1 + y_2 = 4$，解得 $y_1 = 3$，$y_2 = 1$。\n\n检验：对偶值 $5(3) + 8(1) = 23$ 等于原始值 $5(3) + 4(2) = 23$。\n\n> **注意。** 对偶约束用的是原规划的列：两行中 $x_1$ 的系数构成第一个对偶约束。",
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
    const det = a * d - b * c;
    const lead = det === 1 ? "" : det === -1 ? "-" : `${det}`;
    return solved(
      [
        `Maximize $${row(c1, c2, "x_1", "x_2")}$ subject to $${row(a, b, "x_1", "x_2")} \\le ${b1}$, $${row(c, d, "x_1", "x_2")} \\le ${b2}$, $x \\ge 0$. The point $x = (${x1}, ${x2})$ is optimal. What is $y_1$ in the optimal dual solution?`,
        `在 $${row(a, b, "x_1", "x_2")} \\le ${b1}$，$${row(c, d, "x_1", "x_2")} \\le ${b2}$，$x \\ge 0$ 的条件下最大化 $${row(c1, c2, "x_1", "x_2")}$。点 $x = (${x1}, ${x2})$ 是最优解。最优对偶解中的 $y_1$ 是多少？`,
      ],
      y1,
      [
        y2 === y1
          ? [y1 + 1, "That does not satisfy both tight dual constraints.", "这不能同时满足两个紧的对偶约束。"]
          : [y2, "That is $y_2$, the price of the second constraint.", "这是 $y_2$，第二个约束的价格。"],
        [y1 + y2, "That adds the two dual values instead of giving $y_1$ alone.", "这把两个对偶值相加了，而不是只求 $y_1$。"],
        [Q.of(c1, a), "That solves the first dual constraint as if $y_2$ were 0.", "这在解第一个对偶约束时把 $y_2$ 当成了 0。"],
      ],
      [
        [
          ["Make the dual constraints tight", "对偶约束取等号"],
          [
            `Both $x_1$ and $x_2$ are positive, so $${row(a, c, "y_1", "y_2")} = ${c1}$ and $${row(b, d, "y_1", "y_2")} = ${c2}$.`,
            `$x_1$ 和 $x_2$ 都为正，所以 $${row(a, c, "y_1", "y_2")} = ${c1}$，$${row(b, d, "y_1", "y_2")} = ${c2}$。`,
          ],
        ],
        [
          ["Solve the equations", "解方程组"],
          [
            `Eliminating $y_2$ gives $${lead}y_1 = ${d}(${c1}) - ${c}(${c2}) = ${det * y1}$, so $y_1 = ${y1}$, and then $y_2 = ${y2}$.`,
            `消去 $y_2$ 得 $${lead}y_1 = ${d}(${c1}) - ${c}(${c2}) = ${det * y1}$，所以 $y_1 = ${y1}$，进而 $y_2 = ${y2}$。`,
          ],
        ],
      ],
      [
        `The dual value $${b1}(${y1}) + ${b2}(${y2}) = ${b1 * y1 + b2 * y2}$ equals the primal value $${c1}(${x1}) + ${c2}(${x2}) = ${c1 * x1 + c2 * x2}$.`,
        `对偶值 $${b1}(${y1}) + ${b2}(${y2}) = ${b1 * y1 + b2 * y2}$ 等于原始值 $${c1}(${x1}) + ${c2}(${x2}) = ${c1 * x1 + c2 * x2}$。`,
      ],
    );
  },
);

const howFarDown = point(
  "how-far-a-resource-can-fall",
  ["How far a resource can fall", "资源最多能减少多少"],
  [
    "Lowering a resource by $\\delta$ changes the basic values to $x_B - \\delta \\, d$, where $d$ is the column of $B^{-1}$ for that resource. So positive entries of $d$ limit a decrease, while negative entries limit an increase. The two directions use different rows of the column.\n\nWith $x_B = (12, 9, 20)$ and $d = (3, -1, 4)$, a fall of $\\delta$ gives $12 - 3\\delta$, $9 + \\delta$ and $20 - 4\\delta$. The ratios $\\frac{12}{3} = 4$ and $\\frac{20}{4} = 5$ limit it, so the resource can fall by 4.\n\nCheck: at $\\delta = 4$ the values are $0$, $13$ and $4$, all nonnegative.\n\n> **Watch out.** For a decrease, only the positive entries count; the row with $-1$ grows as the resource falls and limits only an increase.",
    "把资源减少 $\\delta$ 使基变量的值变为 $x_B - \\delta \\, d$，其中 $d$ 是 $B^{-1}$ 中对应这个资源的列。所以 $d$ 的正元素限制减少，而负元素限制增加。两个方向用的是这一列的不同行。\n\n取 $x_B = (12, 9, 20)$，$d = (3, -1, 4)$，减少 $\\delta$ 后值为 $12 - 3\\delta$，$9 + \\delta$ 和 $20 - 4\\delta$。比值 $\\frac{12}{3} = 4$ 和 $\\frac{20}{4} = 5$ 构成限制，所以资源最多减少 4。\n\n检验：$\\delta = 4$ 时值是 $0$，$13$ 和 $4$，都非负。\n\n> **注意。** 对减少来说，只有正元素才算数；元素为 $-1$ 的行在资源减少时增大，只限制增加。",
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
    const mixed = smallest([...down, ...up]);
    const after = entries.map((e, i) =>
      Q.of(values[i] as number)
        .sub(answer.mul(Q.of(e)))
        .toLatex(),
    );
    return solved(
      [
        `The optimal basic values are $x_B = ${column(values)}$, and the column of $B^{-1}$ for a resource is $${column(entries)}$. How far can this resource fall before the basis stops being feasible?`,
        `最优基变量的值是 $x_B = ${column(values)}$，某资源对应的 $B^{-1}$ 的列是 $${column(entries)}$。这个资源最多减少多少，基仍然可行？`,
      ],
      answer,
      [
        [
          smallest(up),
          "That uses the rows with negative entries, which limit an increase, not a decrease.",
          "这用了元素为负的行，它们限制的是增加，而不是减少。",
        ],
        mixed.eq(answer)
          ? [answer.add(Q.of(1)), "The fall stops exactly when the first value reaches zero.", "减少量恰好在第一个值变为零时停止。"]
          : [
              mixed,
              "That mixes in a row with a negative entry, whose value grows as the resource falls.",
              "这混进了元素为负的行，资源减少时它的值反而增大。",
            ],
        [
          Q.of(Math.min(...values)),
          "That is the smallest basic value, without dividing by the entries of the column.",
          "这是最小的基变量值，没有除以列中的元素。",
        ],
      ],
      [
        [
          ["Find the rows that fall", "找出会减小的行"],
          [
            "A fall of $\\delta$ subtracts $\\delta$ times each entry, so only rows with positive entries go down.",
            "减少 $\\delta$ 时每行减去 $\\delta$ 乘它的元素，所以只有元素为正的行会减小。",
          ],
        ],
        [
          ["Take the smallest ratio", "取最小比值"],
          down.length === 1
            ? [`Only one row qualifies, and its ratio is $${answer.toLatex()}$.`, `只有一行符合，它的比值是 $${answer.toLatex()}$。`]
            : [
                `The ratios for these rows are $${shown}$, and the smallest is $${answer.toLatex()}$.`,
                `这些行的比值是 $${shown}$，最小的是 $${answer.toLatex()}$。`,
              ],
        ],
      ],
      [
        `At $\\delta = ${answer.toLatex()}$ the basic values are $${after.join(", ")}$, all nonnegative, with a zero in the limiting row.`,
        `$\\delta = ${answer.toLatex()}$ 时基变量的值是 $${after.join(", ")}$，都非负，限制行变为零。`,
      ],
    );
  },
);

const cutSlack = point(
  "why-a-gomory-cut-keeps-integer-points",
  ["Why a Gomory cut keeps integer points", "戈莫里割为什么保留整数点"],
  [
    "The Gomory cut $f_1 s_1 + f_2 s_2 \\ge f_0$ uses fractional parts, and a negative coefficient has a fractional part that is positive, such as $\\frac{2}{3}$ for $-\\frac{4}{3}$. At an integer feasible point, the slack of the cut is a nonnegative integer, so no such point is removed.\n\nThe row $x_1 + \\frac{1}{3}s_1 - \\frac{4}{3}s_2 = \\frac{5}{3}$ gives the cut $\\frac{1}{3}s_1 + \\frac{2}{3}s_2 \\ge \\frac{2}{3}$. At the integer point $s_1 = 1$, $s_2 = 2$, $x_1 = 4$ of the row, the left side minus the right side of the cut is $\\frac{1}{3} + \\frac{4}{3} - \\frac{2}{3} = 1$.\n\nCheck: the row holds there, since $4 + \\frac{1}{3} - \\frac{8}{3} = \\frac{5}{3}$, and the difference 1 is a nonnegative integer.\n\n> **Watch out.** The fractional part of a negative coefficient is found by adding whole numbers until it lies from 0 up to 1, so $-\\frac{4}{3}$ gives $\\frac{2}{3}$, not $\\frac{1}{3}$.",
    "戈莫里割 $f_1 s_1 + f_2 s_2 \\ge f_0$ 使用小数部分，负系数的小数部分是正的，例如 $-\\frac{4}{3}$ 的小数部分是 $\\frac{2}{3}$。在整数可行点处，割的松弛量是非负整数，所以不会去掉这样的点。\n\n行 $x_1 + \\frac{1}{3}s_1 - \\frac{4}{3}s_2 = \\frac{5}{3}$ 给出割 $\\frac{1}{3}s_1 + \\frac{2}{3}s_2 \\ge \\frac{2}{3}$。在这一行的整数点 $s_1 = 1$，$s_2 = 2$，$x_1 = 4$ 处，割的左边减右边是 $\\frac{1}{3} + \\frac{4}{3} - \\frac{2}{3} = 1$。\n\n检验：这一点满足该行，因为 $4 + \\frac{1}{3} - \\frac{8}{3} = \\frac{5}{3}$，而差 1 是非负整数。\n\n> **注意。** 负系数的小数部分要加上整数直到落在 0 到 1 之间，所以 $-\\frac{4}{3}$ 给出 $\\frac{2}{3}$，而不是 $\\frac{1}{3}$。",
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
    const left = fa.mul(Q.of(p)).add(fb.mul(Q.of(q)));
    return solved(
      [
        `A tableau row reads $${row} = ${Q.of(R, d).toLatex()}$. The point with $s_1 = ${p}$, $s_2 = ${q}$ and $x_1 = ${x}$ is integer and feasible. What is the left side minus the right side of the Gomory cut from this row at this point?`,
        `单纯形表的一行是 $${row} = ${Q.of(R, d).toLatex()}$。满足 $s_1 = ${p}$，$s_2 = ${q}$，$x_1 = ${x}$ 的点是整数可行点。在这一点，由这一行得到的戈莫里割的左边减右边是多少？`,
      ],
      answer,
      [
        [
          Q.of(-x),
          "That works with the row itself, not with the cut made of fractional parts.",
          "这用的是这一行本身，而不是由小数部分构成的割。",
        ],
        [fr, "That is the right side of the cut alone.", "这只是割的右端。"],
        [left, "That is the left side of the cut, before subtracting the right side.", "这是割的左边，还没有减去右端。"],
      ],
      [
        [
          ["Write the cut", "写出割"],
          [`The fractional parts give the cut $${cut} \\ge ${fr.toLatex()}$.`, `取小数部分得到割 $${cut} \\ge ${fr.toLatex()}$。`],
        ],
        [
          ["Substitute the point", "代入这一点"],
          [
            `The left side is $${fa.toLatex()}(${p}) + ${fb.toLatex()}(${q}) = ${left.toLatex()}$, and $${left.toLatex()} - ${fr.toLatex()} = ${answer.toLatex()}$.`,
            `左边是 $${fa.toLatex()}(${p}) + ${fb.toLatex()}(${q}) = ${left.toLatex()}$，$${left.toLatex()} - ${fr.toLatex()} = ${answer.toLatex()}$。`,
          ],
        ],
      ],
      [
        `The difference $${answer.toLatex()}$ is a nonnegative integer, so the cut keeps this integer point.`,
        `差 $${answer.toLatex()}$ 是非负整数，所以割保留了这个整数点。`,
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
