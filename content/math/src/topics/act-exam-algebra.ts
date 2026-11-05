import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import type { ExamSpec } from "../exam.ts";
import { ask, askExact, sg, spec, words } from "../exam.ts";

// ACT Math Prep, Algebra: the expressions, equations, inequalities and models that have no SAT Math Prep counterpart.

const names = [
  ["A gym", "健身房"],
  ["A phone plan", "手机套餐"],
  ["A rental shop", "租赁店"],
  ["A streaming service", "流媒体服务"],
] as const;

/** actExamAlgebra are the exam-style questions of the ACT Algebra unit that have no SAT counterpart. */
export const actExamAlgebra: ExamSpec[] = [
  spec("Expanding Powers of Binomials", "展开二项式的幂", ["squaring-binomials"], (rng, hard) => {
    const [a, b, n] = [rng.int(2, 9), rng.nonZero(-9, 9), rng.int(2, 6)];
    const v = rng.pick(["x", "y", "t", "n"]);
    if (!hard)
      return ask(
        rng,
        `Which expression is equivalent to $(${v} ${sg(b)})^2$?`,
        `哪个式子等于 $(${v} ${sg(b)})^2$？`,
        `${v}^2 ${sg(2 * b)}${v} + ${b * b}`,
        [
          `${v}^2 + ${b * b}`,
          `${v}^2 ${sg(b)}${v} + ${b * b}`,
          `${v}^2 ${sg(-2 * b)}${v} + ${b * b}`,
          `${v}^2 ${sg(2 * b)}${v} + ${2 * Math.abs(b)}`,
          `${v}^2 ${sg(2 * b)}${v} - ${b * b}`,
        ],
        `The middle term is $2(${b})${v}$ and the last term is $(${b})^2$.`,
        `中间项是 $2(${b})${v}$，末项是 $(${b})^2$。`,
      );
    return ask(
      rng,
      `Which expression is equivalent to $(${a}x ${sg(b * n)}y)^2$?`,
      `哪个式子等于 $(${a}x ${sg(b * n)}y)^2$？`,
      `${a * a}x^2 ${sg(2 * a * b * n)}xy + ${b * b * n * n}y^2`,
      [
        `${a * a}x^2 + ${b * b * n * n}y^2`,
        `${a * a}x^2 ${sg(a * b * n)}xy + ${b * b * n * n}y^2`,
        `${a}x^2 ${sg(2 * a * b * n)}xy + ${Math.abs(b * n)}y^2`,
        `${a * a}x^2 ${sg(-2 * a * b * n)}xy + ${b * b * n * n}y^2`,
      ],
      `Square each term and add twice their product, $2(${a}x)(${b * n}y)$.`,
      `每项平方，再加两项之积的两倍 $2(${a}x)(${b * n}y)$。`,
    );
  }),
  spec("Rewriting Expressions Using Relations", "用关系式改写式子", ["evaluating-expressions-using-given-relations"], (rng, hard) => {
    const [k, a, b, c] = [rng.int(2, 9), rng.int(2, 9), rng.int(2, 12), rng.int(1, 12)];
    if (!hard)
      return ask(
        rng,
        `If $y = x + ${b}$, which expression is equivalent to $${a}y - ${c}$?`,
        `若 $y = x + ${b}$，哪个式子等于 $${a}y - ${c}$？`,
        `${a}x ${sg(a * b - c === 0 ? 1 : a * b - c)}`,
        [
          `${a}x ${sg(b - c === 0 ? 2 : b - c)}`,
          `x ${sg(a * b - c === 0 ? 1 : a * b - c)}`,
          `${a}x ${sg(a * b + c)}`,
          `${a + 1}x ${sg(a * b - c === 0 ? 1 : a * b - c)}`,
        ],
        `Replace $y$ and distribute: $${a}(x + ${b}) - ${c}$.`,
        `代入 $y$ 并分配：$${a}(x + ${b}) - ${c}$。`,
      );
    return ask(
      rng,
      `If $a = ${k}b$ and $b = ${c + 1}c$, which expression is equivalent to $a + b$ in terms of $c$?`,
      `若 $a = ${k}b$，$b = ${c + 1}c$，用 $c$ 表示 $a + b$，哪个式子正确？`,
      `${(k + 1) * (c + 1)}c`,
      [`${k * (c + 1)}c`, `${k + c + 1}c`, `${(k + 1) * (c + 1) + 1}c`, `${k * (c + 1) * (c + 1)}c`],
      `$a = ${k * (c + 1)}c$, and adding $b$ gives $${(k + 1) * (c + 1)}c$.`,
      `$a = ${k * (c + 1)}c$，加上 $b$ 得 $${(k + 1) * (c + 1)}c$。`,
    );
  }),
  spec("Working Backward to Find an Unknown", "倒推求未知数", ["two-step-equations"], (rng, hard) => {
    const [x, a, b, c] = [rng.int(2, 30), rng.int(2, 6), rng.int(2, 20), rng.int(2, 5)];
    if (!hard)
      return ask(
        rng,
        `A number is multiplied by $${a}$, and then $${b}$ is added. The result is $${a * x + b}$. What is the number?`,
        `一个数乘 $${a}$，再加 $${b}$，结果是 $${a * x + b}$。这个数是多少？`,
        x,
        [a * x, Q.of(a * x + b, a), x + b, x + a],
        `Subtract $${b}$, then divide by $${a}$.`,
        `减去 $${b}$，再除以 $${a}$。`,
      );
    return ask(
      rng,
      `A number is increased by $${b}$, the sum is multiplied by $${a}$, and $${c}$ is subtracted. The result is $${a * (x + b) - c}$. What is the number?`,
      `一个数加 $${b}$，和乘 $${a}$，再减 $${c}$，结果是 $${a * (x + b) - c}$。这个数是多少？`,
      x,
      [x + b, x + b + c, x + c, Q.of(a * (x + b) - c, a)],
      `Add $${c}$, divide by $${a}$, then subtract $${b}$.`,
      `加 $${c}$，除以 $${a}$，再减 $${b}$。`,
    );
  }),
  spec("Evaluating Expressions After Solving", "解方程后求值", ["equations-with-variables-on-both-sides"], (rng, hard) => {
    const [x, a, b, c, d] = [rng.int(1, 12), rng.int(2, 9), rng.int(1, 15), rng.int(2, 9), rng.int(1, 20)];
    if (!hard)
      return ask(
        rng,
        `If $${a}x + ${b} = ${a * x + b}$, what is the value of $${c}x + ${d}$?`,
        `若 $${a}x + ${b} = ${a * x + b}$，$${c}x + ${d}$ 的值是多少？`,
        c * x + d,
        [x, c * x, c * (x + d), a * x + d],
        `First $x = ${x}$, then $${c}(${x}) + ${d} = ${c * x + d}$.`,
        `先得 $x = ${x}$，再算 $${c}(${x}) + ${d} = ${c * x + d}$。`,
      );
    return ask(
      rng,
      `If $${a * c}x + ${c * b} = ${c * (a * x + b)}$, what is the value of $${a}x + ${b}$?`,
      `若 $${a * c}x + ${c * b} = ${c * (a * x + b)}$，$${a}x + ${b}$ 的值是多少？`,
      a * x + b,
      [x, c * (a * x + b), a * x, a * x + b + c],
      `Divide the whole equation by $${c}$; there is no need to find $x$ first.`,
      `整个方程除以 $${c}$，不必先求 $x$。`,
    );
  }),
  spec("Applying Linear Formulas", "应用线性公式", ["rearranging-formulas"], (rng, hard) => {
    const [c, l, w, k] = [rng.int(1, 30) * 5, rng.int(5, 30), rng.int(2, 20), rng.int(2, 9)];
    if (!hard)
      return ask(
        rng,
        `The formula $F = \\frac{9}{5}C + 32$ converts temperatures. What is $F$ when $C = ${c}$?`,
        `公式 $F = \\frac{9}{5}C + 32$ 用于换算温度。当 $C = ${c}$ 时，$F$ 是多少？`,
        (9 * c) / 5 + 32,
        [(9 * c) / 5, c + 32, (9 * c) / 5 + 32 + 9, 2 * c + 32 === (9 * c) / 5 + 32 ? c : 2 * c + 32],
        `$\\frac{9}{5}(${c}) + 32 = ${(9 * c) / 5} + 32$.`,
        `$\\frac{9}{5}(${c}) + 32 = ${(9 * c) / 5} + 32$。`,
      );
    return ask(
      rng,
      `The perimeter of a rectangle is given by $P = 2l + 2w$. If $P = ${2 * l + 2 * (w + k)}$ and $l = ${l}$, what is $w$?`,
      `长方形的周长公式为 $P = 2l + 2w$。若 $P = ${2 * l + 2 * (w + k)}$，$l = ${l}$，$w$ 是多少？`,
      w + k,
      [2 * (w + k), l + w + k, Q.of(2 * l + 2 * (w + k), 4), w + k + 1],
      `$2w = ${2 * l + 2 * (w + k)} - ${2 * l} = ${2 * (w + k)}$.`,
      `$2w = ${2 * l + 2 * (w + k)} - ${2 * l} = ${2 * (w + k)}$。`,
    );
  }),
  spec("Solving Linear Inequalities", "解一次不等式", ["further-solving-linear-inequalities"], (rng, hard) => {
    const [a, x, b, c] = [rng.int(2, 9), rng.int(-9, 12), rng.int(1, 20), rng.int(2, 9)];
    if (!hard)
      return ask(
        rng,
        `Which is the solution set of $${a}x + ${b} > ${a * x + b}$?`,
        `$${a}x + ${b} > ${a * x + b}$ 的解集是什么？`,
        `x > ${x}`,
        [`x < ${x}`, `x > ${x + 1}`, `x < ${x + 1}`, `x > ${a * x}`, `x > ${x - 1}`],
        `Subtract $${b}$, then divide by the positive number $${a}$.`,
        `减去 $${b}$，再除以正数 $${a}$。`,
      );
    return ask(
      rng,
      `Which is the solution set of $${b} - ${c}x \\le ${b - c * x}$?`,
      `$${b} - ${c}x \\le ${b - c * x}$ 的解集是什么？`,
      `x \\ge ${x}`,
      [`x \\le ${x}`, `x \\ge ${-x}`, `x \\le ${-x}`, `x \\ge ${x + 1}`, `x \\le ${x + 1}`],
      `Dividing by $-${c}$ reverses the sign.`,
      `除以 $-${c}$ 时不等号方向改变。`,
    );
  }),
  spec("Identifying Consequences of Inequalities", "判断不等式的推论", ["further-solving-linear-inequalities"], (rng, hard) => {
    const [a, b, c] = [rng.int(1, 20), rng.int(2, 9), rng.int(1, 9)];
    if (!hard)
      return words(
        rng,
        t(`If $x - ${c} > ${a}$, which statement must be true?`, `若 $x - ${c} > ${a}$，哪个说法一定正确？`),
        t(`$x > ${a + c}$`, `$x > ${a + c}$`),
        [t(`$x < ${a + c}$`, `$x < ${a + c}$`), t(`$x > ${a + c + 1}$`, `$x > ${a + c + 1}$`), t(`$x < ${a}$`, `$x < ${a}$`)],
        t(`Adding $${c}$ to both sides keeps the direction of the inequality.`, `两边加 $${c}$，不等号方向不变。`),
      );
    return words(
      rng,
      t(`If $x < y < -${a}$ and $k = -${b}$, which statement must be true?`, `若 $x < y < -${a}$，$k = -${b}$，哪个说法一定正确？`),
      t(`$kx > ky$`, `$kx > ky$`),
      [t(`$kx < ky$`, `$kx < ky$`), t(`$xy < 0$`, `$xy < 0$`), t(`$x + y > 0$`, `$x + y > 0$`)],
      t(
        `Multiplying $x < y$ by the negative number $k$ reverses the sign; the product of two negatives is positive, and their sum is negative.`,
        `$x < y$ 乘负数 $k$ 时方向改变；两个负数之积为正，它们的和为负。`,
      ),
    );
  }),
  spec("Solving Three-Variable Systems", "解三元方程组", ["solving-3x3-systems-of-equations-using-gaussian-elimination"], (rng, hard) => {
    const [x, y, z] = [rng.int(1, 9), rng.int(1, 9), rng.int(1, 9)];
    const [a, b] = [rng.int(2, 4), rng.int(2, 4)];
    if (!hard)
      return ask(
        rng,
        `If $x + y = ${x + y}$, $y + z = ${y + z}$ and $x + z = ${x + z}$, what is the value of $x + y + z$?`,
        `若 $x + y = ${x + y}$，$y + z = ${y + z}$，$x + z = ${x + z}$，$x + y + z$ 的值是多少？`,
        x + y + z,
        [2 * (x + y + z), x + y, x + y + z + 1, x + y + z + 2],
        `Add the equations to get $2(x + y + z) = ${2 * (x + y + z)}$.`,
        `三式相加得 $2(x + y + z) = ${2 * (x + y + z)}$。`,
      );
    return ask(
      rng,
      `The system $x + y + z = ${x + y + z}$, $${a}x + y + z = ${a * x + y + z}$ and $x + ${b}y + z = ${x + b * y + z}$ has one solution. What is the value of $z$?`,
      `方程组 $x + y + z = ${x + y + z}$，$${a}x + y + z = ${a * x + y + z}$，$x + ${b}y + z = ${x + b * y + z}$ 有唯一解。$z$ 的值是多少？`,
      z,
      [x === z ? z + 1 : x, y === z ? z + 2 : y, x + y + z, z + 3],
      `Subtracting the first equation gives $${a - 1}x = ${(a - 1) * x}$ and $${b - 1}y = ${(b - 1) * y}$, so $x = ${x}$ and $y = ${y}$. Then $z = ${x + y + z} - ${x} - ${y} = ${z}$.`,
      `减去第一个方程得 $${a - 1}x = ${(a - 1) * x}$，$${b - 1}y = ${(b - 1) * y}$，所以 $x = ${x}$，$y = ${y}$。于是 $z = ${x + y + z} - ${x} - ${y} = ${z}$。`,
    );
  }),
  spec("Expanding Binomial Powers", "展开二项式幂", ["expanding-a-binomial-using-binomial-coefficients"], (rng, hard) => {
    const [a, b, first] = [rng.int(2, 15), rng.int(2, 7), rng.int(0, 1) === 0];
    if (!hard)
      return ask(
        rng,
        `What is the coefficient of $${first ? "x^2" : "x"}$ in the expansion of $(x + ${a})^3$?`,
        `$(x + ${a})^3$ 的展开式中 $${first ? "x^2" : "x"}$ 的系数是多少？`,
        first ? 3 * a : 3 * a * a,
        [a, a * a, a * a * a, first ? 3 * a * a : 3 * a, 3],
        `The expansion is $x^3 + 3(${a})x^2 + 3(${a})^2x + (${a})^3$.`,
        `展开式为 $x^3 + 3(${a})x^2 + 3(${a})^2x + (${a})^3$。`,
      );
    return ask(
      rng,
      `What is the coefficient of $x^2$ in the expansion of $${b}(x + ${a})^4$?`,
      `$${b}(x + ${a})^4$ 的展开式中，$x^2$ 的系数是多少？`,
      6 * a * a * b,
      [4 * a * a * b, 6 * a * b, 6 * a * a, 4 * a * b],
      `The binomial coefficient is $6$, so the term is $6(${a})^2x^2$, and then multiply by $${b}$.`,
      `二项式系数是 $6$，所以该项为 $6(${a})^2x^2$，再乘 $${b}$。`,
    );
  }),
  spec("Solving Higher-Degree Equations", "解高次方程", ["solving-cubic-equations-by-grouping"], (rng, hard) => {
    const [r, s, a] = [rng.int(1, 12), rng.int(2, 9), rng.int(2, 7)];
    if (!hard)
      return ask(
        rng,
        `What is the greatest solution of $x(x - ${r})(x + ${s}) = 0$?`,
        `$x(x - ${r})(x + ${s}) = 0$ 的最大解是多少？`,
        r,
        [s, -s, 0, r + s],
        `A product is $0$ when a factor is $0$, so the solutions are $0$, $${r}$ and $${-s}$. The greatest is $${r}$.`,
        `积为 $0$ 时某个因式为 $0$，所以解是 $0$、$${r}$ 和 $${-s}$，最大的是 $${r}$。`,
      );
    return ask(
      rng,
      `How many distinct real solutions does $x^3 + ${a}x^2 - ${s * s}x - ${a * s * s} = 0$ have?`,
      `$x^3 + ${a}x^2 - ${s * s}x - ${a * s * s} = 0$ 有多少个不同的实数解？`,
      a === s ? 2 : 3,
      a === s ? [1, 3, 0] : [1, 2, 0],
      `By grouping, it factors as $(x + ${a})(x - ${s})(x + ${s})$.`,
      `分组后可分解为 $(x + ${a})(x - ${s})(x + ${s})$。`,
    );
  }),
  spec(
    "Identifying Characteristics of Rational Expressions",
    "判断有理式的特征",
    ["the-domain-and-range-of-a-rational-function"],
    (rng, hard) => {
      const [a, b, c] = [rng.int(1, 12), rng.nonZero(-9, 9), rng.int(2, 9)];
      if (!hard)
        return ask(
          rng,
          `For what value of $x$ is $\\frac{${c}}{x - ${a}}$ not defined?`,
          `$x$ 为何值时 $\\frac{${c}}{x - ${a}}$ 没有定义？`,
          a,
          [-a, c, 0, a + c],
          `The denominator is zero at $x = ${a}$.`,
          `$x = ${a}$ 时分母为零。`,
        );
      const other = b === a ? a + 1 : b;
      return ask(
        rng,
        `The expression $\\frac{x + ${c}}{(x - ${a})(x ${sg(-other)})}$ is not defined for which values of $x$?`,
        `$\\frac{x + ${c}}{(x - ${a})(x ${sg(-other)})}$ 在 $x$ 为哪些值时没有定义？`,
        `${a} \\text{ and } ${other}`,
        [`${-a} \\text{ and } ${-other}`, `${-c} \\text{ only}`, `${a} \\text{ only}`, `${-c}, ${a} \\text{ and } ${other}`],
        `Only the denominator matters, and it is zero at $${a}$ and $${other}$.`,
        `只看分母，它在 $${a}$ 和 $${other}$ 处为零。`,
      );
    },
  ),
  spec("Solving Proportions", "解比例", ["proportions"], (rng, hard) => {
    const [a, b, k, c] = [rng.int(2, 9), rng.int(2, 9), rng.int(2, 9), rng.int(1, 9)];
    if (!hard)
      return ask(
        rng,
        `What value of $x$ satisfies $\\frac{${a}}{${b}} = \\frac{x}{${b * k}}$?`,
        `哪个 $x$ 满足 $\\frac{${a}}{${b}} = \\frac{x}{${b * k}}$？`,
        a * k,
        [a + k, b * k, Q.of(a, k), a * k + 1],
        `The denominator was multiplied by $${k}$, so the numerator is too.`,
        `分母乘了 $${k}$，分子也要乘。`,
      );
    return ask(
      rng,
      `What value of $x$ satisfies $\\frac{x + ${c}}{${a}} = \\frac{${b * k}}{${b}}$?`,
      `哪个 $x$ 满足 $\\frac{x + ${c}}{${a}} = \\frac{${b * k}}{${b}}$？`,
      a * k - c,
      [a * k, a * k + c, k - c, a + k - c],
      `The right side is $${k}$, so $x + ${c} = ${a * k}$.`,
      `右边等于 $${k}$，所以 $x + ${c} = ${a * k}$。`,
    );
  }),
  spec("Isolating Variables From Powers", "从幂中分离变量", ["solving-equations-using-cube-roots"], (rng, hard) => {
    const [x, a, b] = [rng.int(2, 7), rng.int(2, 6), rng.int(1, 30)];
    if (!hard)
      return ask(
        rng,
        `If $${a}x^3 = ${a * x ** 3}$, what is the value of $x$?`,
        `若 $${a}x^3 = ${a * x ** 3}$，$x$ 的值是多少？`,
        x,
        [x ** 3, x + 1, Q.of(a * x ** 3, 3), x * a],
        `Divide by $${a}$, then take the cube root of $${x ** 3}$.`,
        `除以 $${a}$，再取 $${x ** 3}$ 的立方根。`,
      );
    return ask(
      rng,
      `What are all the real solutions of $${a}x^2 - ${b} = ${a * x * x - b}$?`,
      `$${a}x^2 - ${b} = ${a * x * x - b}$ 的全部实数解是什么？`,
      `x = \\pm ${x}`,
      [`x = ${x}`, `x = ${-x}`, `x = \\pm ${x * x}`, `x = \\pm ${x + 1}`],
      `Add $${b}$ and divide by $${a}$ to get $x^2 = ${x * x}$, which has two real roots.`,
      `加 $${b}$ 再除以 $${a}$，得 $x^2 = ${x * x}$，它有两个实数根。`,
    );
  }),
  spec("Identifying Characteristics of Radical Expressions", "判断根式的特征", ["square-roots-with-domain-restrictions"], (rng, hard) => {
    const [a, c] = [rng.int(1, 30), rng.int(2, 9)];
    if (!hard)
      return ask(
        rng,
        `What is the least value of $x$ for which $\\sqrt{x - ${a}}$ is a real number?`,
        `使 $\\sqrt{x - ${a}}$ 为实数的 $x$ 的最小值是多少？`,
        a,
        [-a, 0, a + 1, a - 1],
        `The expression under the root must be at least $0$, so $x \\ge ${a}$.`,
        `根号内必须不小于 $0$，所以 $x \\ge ${a}$。`,
      );
    return ask(
      rng,
      `What is the greatest value of $x$ for which $\\sqrt{${c * a} - ${c}x}$ is a real number?`,
      `使 $\\sqrt{${c * a} - ${c}x}$ 为实数的 $x$ 的最大值是多少？`,
      a,
      [c * a, -a, a + c, a - 1],
      `$${c * a} - ${c}x \\ge 0$ means $x \\le ${a}$.`,
      `$${c * a} - ${c}x \\ge 0$ 即 $x \\le ${a}$。`,
    );
  }),
  spec("Identifying Characteristics of Absolute Values", "判断绝对值的特征", ["absolute-value-expressions"], (rng, hard) => {
    const [a, b, c] = [rng.int(1, 20), rng.int(1, 20), rng.int(1, 9)];
    if (!hard)
      return ask(
        rng,
        `What is the value of $|${a} - ${a + b}| + ${c}$?`,
        `$|${a} - ${a + b}| + ${c}$ 的值是多少？`,
        b + c,
        [c - b === b + c ? 0 : c - b, -b - c, b, 2 * a + b + c],
        `$|${-b}| = ${b}$, and adding $${c}$ gives $${b + c}$.`,
        `$|${-b}| = ${b}$，加 $${c}$ 得 $${b + c}$。`,
      );
    return ask(
      rng,
      `What is the least possible value of $|x - ${a}| + ${b}$?`,
      `$|x - ${a}| + ${b}$ 的最小可能值是多少？`,
      b,
      [a + b, 0, a, a === b ? a + 2 : b + 1],
      `An absolute value is at least $0$, and it equals $0$ when $x = ${a}$.`,
      `绝对值至少为 $0$，当 $x = ${a}$ 时等于 $0$。`,
    );
  }),
  spec("Determining Absolute-Value Solution Sets", "确定绝对值方程的解集", ["absolute-value-equations"], (rng, hard) => {
    const [c, d, a] = [rng.int(-9, 12), rng.int(1, 15), rng.int(2, 6)];
    if (!hard)
      return ask(
        rng,
        `What is the solution set of $|x ${sg(c === 0 ? 1 : -c)}| = ${d}$?`,
        `$|x ${sg(c === 0 ? 1 : -c)}| = ${d}$ 的解集是什么？`,
        `\\{${(c === 0 ? -1 : c) - d}, ${(c === 0 ? -1 : c) + d}\\}`,
        [
          `\\{${(c === 0 ? -1 : c) + d}\\}`,
          `\\{${-(c === 0 ? -1 : c) - d}, ${-(c === 0 ? -1 : c) + d}\\}`,
          `\\{${-d}, ${d}\\}`,
          `\\{${(c === 0 ? -1 : c) - d - 1}, ${(c === 0 ? -1 : c) + d + 1}\\}`,
        ],
        `The distance from $${c === 0 ? -1 : c}$ is $${d}$ in each direction.`,
        `到 $${c === 0 ? -1 : c}$ 的距离在两个方向上都是 $${d}$。`,
      );
    const v = rng.pick([-3, -2, -1, 0, 1, 2, 3]);
    const count = v < 0 ? 0 : v === 0 ? 1 : 2;
    const inner = `|x ${sg(c === 0 ? 1 : c)}|`;
    const [whyEn, whyZh] =
      v < 0
        ? ["an absolute value is never negative", "绝对值不可能为负"]
        : v === 0
          ? ["only the value that makes the inside zero works", "只有使绝对值内部为零的值才满足"]
          : ["the inside can equal either a positive number or its opposite", "绝对值内部可以等于这个正数或它的相反数"];
    return askExact(
      rng,
      `How many real solutions does $${a}${inner} + ${d} = ${d + a * v}$ have?`,
      `$${a}${inner} + ${d} = ${d + a * v}$ 有多少个实数解？`,
      count,
      [0, 1, 2, 3].filter((n) => n !== count),
      `It gives $${inner} = ${v}$, and ${whyEn}.`,
      `得到 $${inner} = ${v}$，而${whyZh}。`,
    );
  }),
  spec("Solving Absolute Value Inequalities", "解绝对值不等式", ["absolute-value-inequalities"], (rng, hard) => {
    const [c, d] = [rng.int(1, 12), rng.int(1, 15)];
    if (!hard)
      return ask(
        rng,
        `What is the solution set of $|x - ${c}| < ${d}$?`,
        `$|x - ${c}| < ${d}$ 的解集是什么？`,
        `${c - d} < x < ${c + d}`,
        [`x < ${c - d} \\text{ or } x > ${c + d}`, `${-c - d} < x < ${-c + d}`, `x < ${c + d}`, `${c - d - 1} < x < ${c + d + 1}`],
        `The values lie within $${d}$ of $${c}$.`,
        `这些值与 $${c}$ 的距离小于 $${d}$。`,
      );
    return ask(
      rng,
      `What is the solution set of $|x - ${c}| \\ge ${d}$?`,
      `$|x - ${c}| \\ge ${d}$ 的解集是什么？`,
      `x \\le ${c - d} \\text{ or } x \\ge ${c + d}`,
      [
        `${c - d} \\le x \\le ${c + d}`,
        `x \\ge ${c + d}`,
        `x \\le ${-c - d} \\text{ or } x \\ge ${-c + d}`,
        `x \\le ${c - d - 1} \\text{ or } x \\ge ${c + d + 1}`,
      ],
      `The values are at least $${d}$ away from $${c}$, which gives two rays.`,
      `这些值与 $${c}$ 的距离至少是 $${d}$，形成两条射线。`,
    );
  }),
  spec("Writing Structural Linear Models", "列结构性线性模型", ["modeling-with-linear-equations"], (rng, hard) => {
    const [h, r, s, x] = [rng.int(2, 9) * 5, rng.int(2, 9), rng.int(2, 9), rng.int(2, 6)];
    if (!hard)
      return ask(
        rng,
        `A stack starts $${h}$ centimeters high, and each book added raises it $${r}$ centimeters. Which expression gives its height after $b$ books are added?`,
        `一摞书起始高 $${h}$ 厘米，每加一本书升高 $${r}$ 厘米。加 $b$ 本书后的高度是哪个式子？`,
        `${h} + ${r}b`,
        [`${r} + ${h}b`, `${h + r}b`, `${h}b - ${r}`, `${h} - ${r}b`],
        `The starting height is fixed, and the height grows by $${r}$ for each book.`,
        `起始高度固定，每本书增加 $${r}$。`,
      );
    return ask(
      rng,
      `A rectangle has width $w$ and a length $${x}$ times its width plus $${s}$. Which expression gives its perimeter?`,
      `长方形宽为 $w$，长是宽的 $${x}$ 倍再加 $${s}$。哪个式子给出它的周长？`,
      `${2 * x + 2}w + ${2 * s}`,
      [`${x + 1}w + ${s}`, `${2 * x}w + ${2 * s}`, `${x}w^2 + ${s}w`, `${2 * x + 2}w + ${s}`],
      `Double the sum of $w$ and $${x}w + ${s}$.`,
      `把 $w$ 与 $${x}w + ${s}$ 的和乘 $2$。`,
    );
  }),
  spec("Writing Quantity and Spending Models", "列数量和花费模型", ["modeling-with-linear-equations"], (rng, hard) => {
    const [p, q, m, n] = [rng.int(2, 9), rng.int(10, 19), rng.int(40, 200), rng.int(2, 6)];
    if (!hard)
      return ask(
        rng,
        `Pens cost $\\$${p}$ each and notebooks cost $\\$${q}$ each. Which equation states that $x$ pens and $y$ notebooks cost $\\$${m}$ in all?`,
        `钢笔每支 $${p}$ 美元，笔记本每本 $${q}$ 美元。哪个方程表示 $x$ 支钢笔和 $y$ 本笔记本共花 $${m}$ 美元？`,
        `${p}x + ${q}y = ${m}`,
        [`${q}x + ${p}y = ${m}`, `x + y = ${m}`, `${p + q}xy = ${m}`, `${p}x - ${q}y = ${m}`],
        `Each count multiplies its own price.`,
        `每个数量乘各自的价格。`,
      );
    return ask(
      rng,
      `Pens cost $\\$${p}$ each and notebooks cost $\\$${q}$ each. A buyer gets $${n}$ times as many pens as notebooks. Which expression gives the total cost of $y$ notebooks and those pens?`,
      `钢笔每支 $${p}$ 美元，笔记本每本 $${q}$ 美元。买的钢笔数是笔记本数的 $${n}$ 倍。哪个式子给出 $y$ 本笔记本和这些钢笔的总费用？`,
      `${p * n + q}y`,
      [`${p + q}y`, `${p + q * n}y`, `${p * n}y + ${q}`, `${p * q * n}y`],
      `The pens cost $${p}(${n}y)$, and the notebooks cost $${q}y$.`,
      `钢笔花 $${p}(${n}y)$，笔记本花 $${q}y$。`,
    );
  }),
  spec("Modeling Mixture Problems", "混合问题建模", ["modeling-with-systems"], (rng, hard) => {
    const [a, p, b, q] = [rng.int(1, 8) * 10, rng.int(1, 4) * 10, rng.int(1, 8) * 10, rng.int(5, 9) * 10];
    const acid = (a * p + b * q) / 100;
    if (!hard)
      return ask(
        rng,
        `A chemist mixes $${a}$ liters of a $${p}\\%$ acid solution with $${b}$ liters of a $${q}\\%$ acid solution. How many liters of acid does the mixture contain?`,
        `化学家把 $${a}$ 升 $${p}\\%$ 的酸溶液与 $${b}$ 升 $${q}\\%$ 的酸溶液混合。混合液含多少升酸？`,
        acid,
        [((a + b) * (p + q)) / 100 === acid ? acid + 1 : Q.of((a + b) * (p + q), 100), (a * p) / 100, (b * q) / 100, a + b],
        `$${(a * p) / 100} + ${(b * q) / 100} = ${acid}$ liters.`,
        `$${(a * p) / 100} + ${(b * q) / 100} = ${acid}$ 升。`,
      );
    return ask(
      rng,
      `A chemist mixes $${a}$ liters of a $${p}\\%$ acid solution with $${b}$ liters of a $${q}\\%$ acid solution. What percent of the mixture is acid? Give the number without the percent sign.`,
      `化学家把 $${a}$ 升 $${p}\\%$ 的酸溶液与 $${b}$ 升 $${q}\\%$ 的酸溶液混合。混合液中酸占百分之几？（只填数字。）`,
      Q.of(a * p + b * q, a + b),
      [Q.of(p + q, 2), Q.of(a * p + b * q, 100), p + q, Q.of(a * p + b * q + 100, a + b)],
      `The acid is $${acid}$ liters out of $${a + b}$ liters.`,
      `酸有 $${acid}$ 升，总量是 $${a + b}$ 升。`,
    );
  }),
  spec("Equating Linear Models", "令线性模型相等", ["systems-of-linear-equations"], (rng, hard) => {
    const [name, nameZh] = rng.pick(names);
    const [r, d, m] = [rng.int(2, 15), rng.int(1, 6), rng.int(2, 20)];
    const [f] = [rng.int(1, 12) * 5];
    if (!hard)
      return ask(
        rng,
        `${name} offers two options: $\\$${f + d * m}$ plus $\\$${r}$ per month, or $\\$${f}$ plus $\\$${r + d}$ per month. After how many months do they cost the same?`,
        `${nameZh}有两种选择：$${f + d * m}$ 美元加每月 $${r}$ 美元，或 $${f}$ 美元加每月 $${r + d}$ 美元。多少个月后费用相同？`,
        m,
        [d * m, Q.of(f + d * m, r), m + d, m + 1],
        `$${f + d * m} + ${r}x = ${f} + ${r + d}x$ gives $${d}x = ${d * m}$.`,
        `$${f + d * m} + ${r}x = ${f} + ${r + d}x$ 得 $${d}x = ${d * m}$。`,
      );
    return ask(
      rng,
      `${name} offers two options: $\\$${f + d * m}$ plus $\\$${r}$ per month, or $\\$${f}$ plus $\\$${r + d}$ per month. What is the total cost, in dollars, when the two options are equal?`,
      `${nameZh}有两种选择：$${f + d * m}$ 美元加每月 $${r}$ 美元，或 $${f}$ 美元加每月 $${r + d}$ 美元。两种费用相等时，总费用是多少美元？`,
      f + (r + d) * m,
      [m, f + r * m, f + d * m, f + (r + d) * (m + 1)],
      `They are equal at $${m}$ months, so the cost is $${f} + ${r + d}(${m})$.`,
      `$${m}$ 个月时相等，所以费用是 $${f} + ${r + d}(${m})$。`,
    );
  }),
  spec(
    "Modeling With Nonlinear Equations",
    "用非线性方程建模",
    ["modeling-with-quadratic-equations", "modeling-with-linear-equations"],
    (rng, hard) => {
      const [w, d] = [rng.int(2, 15), rng.int(1, 9)];
      if (!hard)
        return ask(
          rng,
          `A rectangle's length is $${d}$ more than its width $w$. Which equation states that its area is $${w * (w + d)}$?`,
          `长方形的长比宽 $w$ 多 $${d}$。哪个方程表示其面积为 $${w * (w + d)}$？`,
          `w(w + ${d}) = ${w * (w + d)}`,
          [`2w + ${d} = ${w * (w + d)}`, `w + ${d} = ${w * (w + d)}`, `w^2 + ${d} = ${w * (w + d)}`, `2w + 2(w + ${d}) = ${w * (w + d)}`],
          `Area is length times width.`,
          `面积等于长乘宽。`,
        );
      return ask(
        rng,
        `A rectangle's length is $${d}$ more than its width. Its area is $${w * (w + d)}$ square units. What is its perimeter, in units?`,
        `长方形的长比宽多 $${d}$。面积为 $${w * (w + d)}$ 平方单位。它的周长是多少单位？`,
        2 * (2 * w + d),
        [2 * w + d, w * (w + d), 4 * w, 2 * (2 * w + d) + 2],
        `The width is $${w}$ and the length is $${w + d}$.`,
        `宽是 $${w}$，长是 $${w + d}$。`,
      );
    },
  ),
];
