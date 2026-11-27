import { t } from "@ga/content";

import type { ExamSpec } from "../exam.ts";
import { cx, sg, step, tx, words, worked } from "../exam.ts";
import { regionFigure } from "../exam-figures.ts";
import { ask } from "./act-exam-kit.ts";

// ACT Math Prep, questions of its own for the topics it shares with SAT Math Prep: expressions, linear equations, inequalities and systems.

const lin = (a: number, b: number): string => `${cx(a)} ${sg(b)}`.trim();
const quad = (a: number, b: number, c: number): string => `${cx(a, "x^2")} ${tx(b)} ${sg(c)}`.trim();

/** actOwnAlgebra1 are the question generators of ACT topics on expressions, linear equations, inequalities and systems, by title. */
export const actOwnAlgebra1: Record<string, ExamSpec["make"]> = {
  "Combining Like Terms": (rng, hard) => {
    const [a, b, c, d] = [rng.int(5, 12), rng.int(2, 9), rng.int(1, 4), rng.int(2, 9)];
    if (!hard)
      return ask(
        rng,
        `For all real numbers $x$, the expression $(${quad(a, b, 0)}) - (${quad(c, -d, 0)})$ is equivalent to which of the following?`,
        `对所有实数 $x$，式子 $(${quad(a, b, 0)}) - (${quad(c, -d, 0)})$ 与下列哪一项等价？`,
        quad(a - c, b + d, 0),
        [quad(a - c, b - d, 0), quad(a + c, b + d, 0), quad(a - c, -b - d, 0)],
        worked(
          [
            step(
              "Distribute the minus sign",
              "去掉括号",
              `The minus sign changes the sign of every term in the second group: $-(${quad(c, -d, 0)}) = ${quad(-c, d, 0)}$.`,
              `减号使第二组的每一项都变号：$-(${quad(c, -d, 0)}) = ${quad(-c, d, 0)}$。`,
            ),
            step(
              "Combine like terms",
              "合并同类项",
              `$x^2$ terms: $${a} - ${c} = ${a - c}$. $x$ terms: $${b} + ${d} = ${b + d}$. The result is $${quad(a - c, b + d, 0)}$.`,
              `$x^2$ 项：$${a} - ${c} = ${a - c}$；$x$ 项：$${b} + ${d} = ${b + d}$。结果是 $${quad(a - c, b + d, 0)}$。`,
            ),
          ],
          t(
            `At $x = 1$ the original is $(${a + b}) - (${c - d}) = ${a + b - c + d}$, and $${a - c} + ${b + d} = ${a - c + b + d}$ as well.`,
            `取 $x = 1$：原式为 $(${a + b}) - (${c - d}) = ${a + b - c + d}$，而 $${a - c} + ${b + d} = ${a - c + b + d}$，两者相同。`,
          ),
          [
            t(`This leaves $-${d}x$ unchanged; subtracting it adds $${d}x$.`, `这里没有给 $-${d}x$ 变号；减去它等于加上 $${d}x$。`),
            t(`This adds $${c}x^2$ instead of subtracting it.`, `这里把 $${c}x^2$ 加上了，而不是减去。`),
            t(
              `This changes the sign of $${b}x$ from the first group, which is not subtracted.`,
              `这里把第一组的 $${b}x$ 也变了号，但它并没有被减。`,
            ),
          ],
        ),
      );
    const [e, f] = [rng.int(2, 7), rng.int(1, 9)];
    return ask(
      rng,
      `The sides of a triangle have lengths $${lin(a, b)}$, $${lin(c + 1, -d)}$ and $${lin(e, f)}$ inches. Which expression gives the perimeter, in inches?`,
      `一个三角形三边长为 $${lin(a, b)}$、$${lin(c + 1, -d)}$ 和 $${lin(e, f)}$ 英寸。哪个式子表示其周长（英寸）？`,
      lin(a + c + 1 + e, b - d + f),
      [lin(a + c + 1 + e, b + d + f), lin(a + c + e, b - d + f), lin(a + c + 1 + e, b - d - f)],
      worked(
        [
          step(
            "Add the x terms",
            "把 x 项相加",
            `The perimeter is the sum of the three sides. The $x$ terms give $${a} + ${c + 1} + ${e} = ${a + c + 1 + e}$, so $${a + c + 1 + e}x$.`,
            `周长是三边之和。$x$ 项相加：$${a} + ${c + 1} + ${e} = ${a + c + 1 + e}$，即 $${a + c + 1 + e}x$。`,
          ),
          step(
            "Add the constants",
            "把常数相加",
            `With their signs: $${b} - ${d} + ${f} = ${b - d + f}$, so the perimeter is $${lin(a + c + 1 + e, b - d + f)}$.`,
            `连同符号相加：$${b} - ${d} + ${f} = ${b - d + f}$，所以周长是 $${lin(a + c + 1 + e, b - d + f)}$。`,
          ),
        ],
        t(
          `At $x = 1$ the sides are $${a + b}$, $${c + 1 - d}$ and $${e + f}$, which add to $${a + b + c + 1 - d + e + f}$, and so does $${a + c + 1 + e} ${sg(b - d + f)}$.`,
          `取 $x = 1$：三边为 $${a + b}$、$${c + 1 - d}$、$${e + f}$，和为 $${a + b + c + 1 - d + e + f}$，$${a + c + 1 + e} ${sg(b - d + f)}$ 也一样。`,
        ),
        [
          t(`This adds $${d}$ although the second side has $-${d}$.`, `第二条边是 $-${d}$，这里却加上了 $${d}$。`),
          t(
            `This takes the second side's $x$ coefficient as $${c}$ instead of $${c + 1}$.`,
            `这里把第二条边的 $x$ 系数当成了 $${c}$，而不是 $${c + 1}$。`,
          ),
          t(`This subtracts the third side's $${f}$ instead of adding it.`, `这里把第三条边的 $${f}$ 减去了，而不是加上。`),
        ],
      ),
    );
  },
  "Distributing Over Binomials": (rng, hard) => {
    const [a, b, c, d, e] = [rng.int(2, 9), rng.int(2, 9), rng.int(1, 9), rng.int(2, 6), rng.int(1, 9)];
    if (!hard)
      return ask(
        rng,
        `Which expression is equivalent to $${a}(${lin(b, -c)}) - ${d}(x + ${e})$ for all real $x$?`,
        `对所有实数 $x$，哪个式子与 $${a}(${lin(b, -c)}) - ${d}(x + ${e})$ 等价？`,
        lin(a * b - d, -a * c - d * e),
        [lin(a * b - d, -a * c + d * e), lin(a * b + d, -a * c - d * e), lin(a * b, -a * c - d * e)],
        worked(
          [
            step(
              "Distribute each factor",
              "分别展开",
              `$${a}(${lin(b, -c)}) = ${a * b}x - ${a * c}$, and $-${d}(x + ${e}) = -${d}x - ${d * e}$: the $-${d}$ multiplies both terms.`,
              `$${a}(${lin(b, -c)}) = ${a * b}x - ${a * c}$，$-${d}(x + ${e}) = -${d}x - ${d * e}$：$-${d}$ 乘以两项。`,
            ),
            step(
              "Combine like terms",
              "合并同类项",
              `$${a * b}x - ${d}x = ${a * b - d}x$ and $-${a * c} - ${d * e} = ${-a * c - d * e}$, giving $${lin(a * b - d, -a * c - d * e)}$.`,
              `$${a * b}x - ${d}x = ${a * b - d}x$，$-${a * c} - ${d * e} = ${-a * c - d * e}$，得 $${lin(a * b - d, -a * c - d * e)}$。`,
            ),
          ],
          t(
            `At $x = 0$ the original is $${a}(-${c}) - ${d}(${e}) = ${-a * c - d * e}$, the constant of the answer.`,
            `取 $x = 0$：原式为 $${a}(-${c}) - ${d}(${e}) = ${-a * c - d * e}$，正是答案的常数项。`,
          ),
          [
            t(`This multiplies only $x$ by $-${d}$ and adds $${d * e}$.`, `这里只把 $x$ 乘了 $-${d}$，却加上了 $${d * e}$。`),
            t(`This adds $${d}x$, dropping the minus sign in front of $${d}$.`, `这里加上了 $${d}x$，丢掉了 $${d}$ 前面的负号。`),
            t(`This leaves out the $-${d}x$ term.`, `这里漏掉了 $-${d}x$ 这一项。`),
          ],
        ),
      );
    return ask(
      rng,
      `When $${a}(x - ${c}) + ${d}(${b}x + ${e})$ is simplified, what is the constant term?`,
      `化简 $${a}(x - ${c}) + ${d}(${b}x + ${e})$ 后，常数项是多少？`,
      d * e - a * c,
      [d * e + a * c, e - c, a * d - c * e],
      worked(
        [
          step(
            "Find each constant",
            "找出每个常数",
            `The constants come from multiplying each factor by the number in its parentheses: $${a}(-${c}) = ${-a * c}$ and $${d}(${e}) = ${d * e}$.`,
            `常数来自每个因数乘以括号里的数：$${a}(-${c}) = ${-a * c}$，$${d}(${e}) = ${d * e}$。`,
          ),
          step("Add them", "相加", `$${-a * c} + ${d * e} = ${d * e - a * c}$.`, `$${-a * c} + ${d * e} = ${d * e - a * c}$。`),
        ],
        t(
          `At $x = 0$ the whole expression is $${a}(-${c}) + ${d}(${e}) = ${d * e - a * c}$, which is its constant term.`,
          `取 $x = 0$：整个式子为 $${a}(-${c}) + ${d}(${e}) = ${d * e - a * c}$，就是常数项。`,
        ),
        [
          t(`This treats $-${c}$ as $+${c}$.`, `这里把 $-${c}$ 当成了 $+${c}$。`),
          t(
            `This adds the numbers in the parentheses without multiplying by $${a}$ and $${d}$.`,
            `这里只把括号里的数相加，没有乘以 $${a}$ 和 $${d}$。`,
          ),
          t(
            `This multiplies the wrong pairs: the outside numbers together and the inside ones together.`,
            `这里乘错了搭配：把外面的数相乘，再把里面的数相乘。`,
          ),
        ],
      ),
    );
  },
  "Expanding Products of Binomials": (rng, hard) => {
    const a = rng.int(2, 12);
    const b = a + rng.int(1, 6);
    if (!hard)
      return ask(
        rng,
        `Which of the following is equivalent to $(x + ${a})(x - ${b})$?`,
        `下列哪一项与 $(x + ${a})(x - ${b})$ 等价？`,
        quad(1, a - b, -a * b),
        [quad(1, b - a, -a * b), quad(1, a - b, a * b), quad(1, 0, -a * b)],
        worked(
          [
            step(
              "Multiply each term by each term",
              "逐项相乘",
              `$x \\cdot x = x^2$, $x(-${b}) = -${b}x$, $${a} \\cdot x = ${a}x$ and $${a}(-${b}) = -${a * b}$.`,
              `$x \\cdot x = x^2$，$x(-${b}) = -${b}x$，$${a} \\cdot x = ${a}x$，$${a}(-${b}) = -${a * b}$。`,
            ),
            step(
              "Combine the middle terms",
              "合并中间两项",
              `$-${b}x + ${a}x = ${cx(a - b)}$, so the product is $${quad(1, a - b, -a * b)}$.`,
              `$-${b}x + ${a}x = ${cx(a - b)}$，所以乘积是 $${quad(1, a - b, -a * b)}$。`,
            ),
          ],
          t(
            `At $x = 1$: $(${1 + a})(${1 - b}) = ${(1 + a) * (1 - b)}$, and $1 ${sg(a - b)} - ${a * b} = ${1 + a - b - a * b}$.`,
            `取 $x = 1$：$(${1 + a})(${1 - b}) = ${(1 + a) * (1 - b)}$，而 $1 ${sg(a - b)} - ${a * b} = ${1 + a - b - a * b}$。`,
          ),
          [
            t(
              `This gives the middle term the wrong sign, as if the product were $(x - ${a})(x + ${b})$.`,
              `这里中间项符号反了，好像乘的是 $(x - ${a})(x + ${b})$。`,
            ),
            t(`The last term is $${a} \\times (-${b})$, which is negative.`, `末项是 $${a} \\times (-${b})$，是负的。`),
            t(`This leaves out the middle terms $-${b}x + ${a}x$.`, `这里漏掉了中间两项 $-${b}x + ${a}x$。`),
          ],
        ),
      );
    const [c, d] = [rng.int(2, 7), rng.int(2, 7)];
    return ask(
      rng,
      `When $(${c}x + ${a})(${d}x - ${b})$ is multiplied out and like terms are combined, what is the coefficient of $x$?`,
      `展开 $(${c}x + ${a})(${d}x - ${b})$ 并合并同类项后，$x$ 的系数是多少？`,
      a * d - b * c,
      [a * d + b * c, a - b, c * d],
      worked(
        [
          step(
            "Find the outer and inner products",
            "求外项积和内项积",
            `Outer: $${c}x \\cdot (-${b}) = -${b * c}x$. Inner: $${a} \\cdot ${d}x = ${a * d}x$.`,
            `外项积：$${c}x \\cdot (-${b}) = -${b * c}x$；内项积：$${a} \\cdot ${d}x = ${a * d}x$。`,
          ),
          step(
            "Combine them",
            "合并",
            `$${a * d}x - ${b * c}x$ has coefficient $${a * d} - ${b * c} = ${a * d - b * c}$.`,
            `$${a * d}x - ${b * c}x$ 的系数是 $${a * d} - ${b * c} = ${a * d - b * c}$。`,
          ),
        ],
        t(
          `At $x = 1$: $(${c + a})(${d - b}) = ${(c + a) * (d - b)}$, and $${c * d} ${sg(a * d - b * c)} - ${a * b} = ${c * d + a * d - b * c - a * b}$.`,
          `取 $x = 1$：$(${c + a})(${d - b}) = ${(c + a) * (d - b)}$，而 $${c * d} ${sg(a * d - b * c)} - ${a * b} = ${c * d + a * d - b * c - a * b}$。`,
        ),
        [
          t(`This drops the minus sign of $-${b}$ in the outer product.`, `这里在外项积中丢掉了 $-${b}$ 的负号。`),
          t(`This adds the constants without multiplying them by the $x$ coefficients.`, `这里只把常数相加，没有乘以 $x$ 的系数。`),
          t(`This is the coefficient of $x^2$, not of $x$.`, `这是 $x^2$ 的系数，不是 $x$ 的系数。`),
        ],
      ),
    );
  },
  "Factoring Algebraic Expressions": (rng, hard) => {
    const [g, m, n] = [rng.int(2, 9), rng.int(2, 7), rng.pick([3, 5, 7, 11, 13])];
    if (!hard)
      return ask(
        rng,
        `Which of the following is a factored form of $${g * m}x^2 - ${g * n}x$?`,
        `下列哪一项是 $${g * m}x^2 - ${g * n}x$ 的因式分解？`,
        `${g}x(${m}x - ${n})`,
        [`${g}x(${m}x + ${n})`, `${g}(${m}x - ${n})`, `${g}x(${m}x^2 - ${n}x)`],
        worked(
          [
            step(
              "Find the greatest common factor",
              "找出最大公因式",
              `$${g * m}$ and $${g * n}$ share $${g}$, and both terms contain $x$, so the common factor is $${g}x$.`,
              `$${g * m}$ 与 $${g * n}$ 的公因数是 $${g}$，两项都含 $x$，所以公因式是 $${g}x$。`,
            ),
            step(
              "Divide it out",
              "提出公因式",
              `$${g * m}x^2 \\div ${g}x = ${m}x$ and $-${g * n}x \\div ${g}x = -${n}$, so the form is $${g}x(${m}x - ${n})$.`,
              `$${g * m}x^2 \\div ${g}x = ${m}x$，$-${g * n}x \\div ${g}x = -${n}$，所以结果是 $${g}x(${m}x - ${n})$。`,
            ),
          ],
          t(
            `Multiply back: $${g}x \\cdot ${m}x = ${g * m}x^2$ and $${g}x \\cdot (-${n}) = -${g * n}x$.`,
            `乘回去：$${g}x \\cdot ${m}x = ${g * m}x^2$，$${g}x \\cdot (-${n}) = -${g * n}x$。`,
          ),
          [
            t(`This loses the minus sign: it multiplies back to $+${g * n}x$.`, `这里丢了负号：乘回去是 $+${g * n}x$。`),
            t(
              `This takes out $${g}$ but not $x$: it multiplies back to $${g * m}x - ${g * n}$.`,
              `这里只提出了 $${g}$，没有提出 $x$：乘回去是 $${g * m}x - ${g * n}$。`,
            ),
            t(
              `This writes $x$ outside but does not divide it out: it multiplies back to a cubic.`,
              `这里把 $x$ 写在外面却没有从括号里除掉：乘回去是三次式。`,
            ),
          ],
        ),
      );
    return ask(
      rng,
      `The expression $${g * m}x^2y + ${g * n}xy^2$ equals $${g}xy \\cdot Q$. What is $Q$?`,
      `式子 $${g * m}x^2y + ${g * n}xy^2$ 等于 $${g}xy \\cdot Q$。$Q$ 是什么？`,
      `${m}x + ${n}y`,
      [`${m}x^2 + ${n}y^2`, `${m}y + ${n}x`, `${m}x + ${n}`],
      worked(
        [
          step(
            "Divide the first term",
            "第一项相除",
            `$${g * m}x^2y \\div ${g}xy = ${m}x$: one factor of $x$ and the $y$ go.`,
            `$${g * m}x^2y \\div ${g}xy = ${m}x$：约去一个 $x$ 和 $y$。`,
          ),
          step(
            "Divide the second term",
            "第二项相除",
            `$${g * n}xy^2 \\div ${g}xy = ${n}y$, so $Q = ${m}x + ${n}y$.`,
            `$${g * n}xy^2 \\div ${g}xy = ${n}y$，所以 $Q = ${m}x + ${n}y$。`,
          ),
        ],
        t(
          `Multiply back: $${g}xy(${m}x + ${n}y) = ${g * m}x^2y + ${g * n}xy^2$.`,
          `乘回去：$${g}xy(${m}x + ${n}y) = ${g * m}x^2y + ${g * n}xy^2$。`,
        ),
        [
          t(
            `This divides only the numbers and keeps the powers: it multiplies back to $x^3y$ and $xy^3$ terms.`,
            `这里只除了系数，保留了乘方：乘回去是 $x^3y$ 和 $xy^3$ 项。`,
          ),
          t(
            `This swaps the variables: $${g}xy \\cdot ${m}y = ${g * m}xy^2$, not $${g * m}x^2y$.`,
            `这里把变量对调了：$${g}xy \\cdot ${m}y = ${g * m}xy^2$，不是 $${g * m}x^2y$。`,
          ),
          t(`This drops the $y$ left over in the second term.`, `这里漏掉了第二项剩下的 $y$。`),
        ],
      ),
    );
  },
  "Simplifying by Canceling Factors": (rng, hard) => {
    const [a, b, k] = [rng.int(2, 12), rng.int(1, 9), rng.int(1, 12)];
    if (!hard) {
      const m = rng.int(2, 6);
      return ask(
        rng,
        `For $x \\ne ${a}$, the expression $\\frac{${m}x^2 - ${m * a * a}}{x - ${a}}$ simplifies to which of the following?`,
        `当 $x \\ne ${a}$ 时，$\\frac{${m}x^2 - ${m * a * a}}{x - ${a}}$ 化简后是下列哪一项？`,
        `${m}x + ${m * a}`,
        [`${m}x - ${m * a}`, `x + ${m * a}`, `${m}x + ${a}`],
        worked(
          [
            step(
              "Factor the numerator",
              "分解分子",
              `Take out $${m}$ and use the difference of squares: $${m}x^2 - ${m * a * a} = ${m}(x^2 - ${a * a}) = ${m}(x - ${a})(x + ${a})$.`,
              `提出 $${m}$ 再用平方差：$${m}x^2 - ${m * a * a} = ${m}(x^2 - ${a * a}) = ${m}(x - ${a})(x + ${a})$。`,
            ),
            step(
              "Cancel the common factor",
              "约去公因式",
              `$x - ${a}$ cancels, since $x \\ne ${a}$, and leaves $${m}(x + ${a}) = ${m}x + ${m * a}$.`,
              `因为 $x \\ne ${a}$，可以约去 $x - ${a}$，剩下 $${m}(x + ${a}) = ${m}x + ${m * a}$。`,
            ),
          ],
          t(
            `At $x = 0$: $\\frac{-${m * a * a}}{-${a}} = ${m * a}$, the same as $${m}(0) + ${m * a}$.`,
            `取 $x = 0$：$\\frac{-${m * a * a}}{-${a}} = ${m * a}$，与 $${m}(0) + ${m * a}$ 相同。`,
          ),
          [
            t(
              `This keeps the factor $x - ${a}$ that cancels instead of $x + ${a}$.`,
              `这里留下了本该约去的 $x - ${a}$，而不是 $x + ${a}$。`,
            ),
            t(`This drops the factor $${m}$ from the $x$ term.`, `这里把 $x$ 项的因数 $${m}$ 丢掉了。`),
            t(`This multiplies only $x$ by $${m}$, not the $${a}$.`, `这里只把 $x$ 乘了 $${m}$，没有乘 $${a}$。`),
          ],
        ),
      );
    }
    return ask(
      rng,
      `What is the value of $\\frac{x^2 + ${a + b}x + ${a * b}}{x + ${a}}$ when $x = ${k}$?`,
      `当 $x = ${k}$ 时，$\\frac{x^2 + ${a + b}x + ${a * b}}{x + ${a}}$ 的值是多少？`,
      k + b,
      [k + a, k + a + b, k * b],
      worked(
        [
          step(
            "Factor the numerator",
            "分解分子",
            `Two numbers with sum $${a + b}$ and product $${a * b}$ are $${a}$ and $${b}$, so $x^2 + ${a + b}x + ${a * b} = (x + ${a})(x + ${b})$.`,
            `和为 $${a + b}$、积为 $${a * b}$ 的两个数是 $${a}$ 和 $${b}$，所以 $x^2 + ${a + b}x + ${a * b} = (x + ${a})(x + ${b})$。`,
          ),
          step(
            "Cancel and substitute",
            "约分后代入",
            `The expression is $x + ${b}$, which is $${k} + ${b} = ${k + b}$ at $x = ${k}$.`,
            `式子化为 $x + ${b}$，当 $x = ${k}$ 时为 $${k} + ${b} = ${k + b}$。`,
          ),
        ],
        t(
          `Substitute directly: $\\frac{${k * k} + ${(a + b) * k} + ${a * b}}{${k + a}} = \\frac{${(k + a) * (k + b)}}{${k + a}} = ${k + b}$.`,
          `直接代入：$\\frac{${k * k} + ${(a + b) * k} + ${a * b}}{${k + a}} = \\frac{${(k + a) * (k + b)}}{${k + a}} = ${k + b}$。`,
        ),
        [
          t(`This keeps the factor $x + ${a}$ that cancels.`, `这里留下了本该约去的 $x + ${a}$。`),
          t(
            `This adds $x$ and the middle coefficient $${a + b}$ without factoring.`,
            `这里没有因式分解，直接把 $x$ 与中间系数 $${a + b}$ 相加。`,
          ),
          t(`This multiplies $x$ by $${b}$ instead of adding.`, `这里把 $x$ 乘以 $${b}$，而不是相加。`),
        ],
      ),
    );
  },
  "Evaluating Algebraic Expressions": (rng, hard) => {
    const [x, y, a, b] = [-rng.int(2, 7), rng.int(2, 9), rng.int(2, 5), rng.int(2, 6)];
    if (!hard)
      return ask(
        rng,
        `What is the value of $${a}x^2 - ${b}y$ when $x = ${x}$ and $y = ${y}$?`,
        `当 $x = ${x}$，$y = ${y}$ 时，$${a}x^2 - ${b}y$ 的值是多少？`,
        a * x * x - b * y,
        [-a * x * x - b * y, a * x * x + b * y, a * 2 * x - b * y],
        worked(
          [
            step(
              "Square first",
              "先算平方",
              `$(${x})^2 = ${x * x}$: the square of a negative number is positive.`,
              `$(${x})^2 = ${x * x}$：负数的平方是正数。`,
            ),
            step(
              "Multiply, then subtract",
              "再乘，后减",
              `$${a}(${x * x}) - ${b}(${y}) = ${a * x * x} - ${b * y} = ${a * x * x - b * y}$.`,
              `$${a}(${x * x}) - ${b}(${y}) = ${a * x * x} - ${b * y} = ${a * x * x - b * y}$。`,
            ),
          ],
          t(
            `Add $${b * y}$ back: $${a * x * x - b * y} + ${b * y} = ${a * x * x}$, and $${a * x * x} \\div ${a} = ${x * x} = (${x})^2$.`,
            `加回 $${b * y}$：$${a * x * x - b * y} + ${b * y} = ${a * x * x}$，而 $${a * x * x} \\div ${a} = ${x * x} = (${x})^2$。`,
          ),
          [
            t(
              `This takes $(${x})^2$ as $-${x * x}$, squaring without the parentheses.`,
              `这里把 $(${x})^2$ 算成 $-${x * x}$，平方时没加括号。`,
            ),
            t(`This adds $${b}y$ instead of subtracting it.`, `这里把 $${b}y$ 加上了，而不是减去。`),
            t(`This doubles $${x}$ instead of squaring it.`, `这里把 $${x}$ 乘以 $2$，而不是平方。`),
          ],
        ),
      );
    const z = rng.int(1, 6);
    return ask(
      rng,
      `If $x = ${x}$, $y = ${y}$ and $z = ${z}$, what is the value of $x(y - z)^2 + yz$?`,
      `若 $x = ${x}$，$y = ${y}$，$z = ${z}$，则 $x(y - z)^2 + yz$ 的值是多少？`,
      x * (y - z) ** 2 + y * z,
      [(x * (y - z)) ** 2 + y * z, x * (y - z) + y * z, x * (y - z) ** 2 - y * z],
      worked(
        [
          step(
            "Work inside the parentheses",
            "先算括号内",
            `$y - z = ${y} - ${z} = ${y - z}$, and its square is $${(y - z) ** 2}$.`,
            `$y - z = ${y} - ${z} = ${y - z}$，平方为 $${(y - z) ** 2}$。`,
          ),
          step(
            "Multiply by x",
            "乘以 x",
            `$x(y - z)^2 = ${x} \\times ${(y - z) ** 2} = ${x * (y - z) ** 2}$; only the parentheses are squared, not $x$.`,
            `$x(y - z)^2 = ${x} \\times ${(y - z) ** 2} = ${x * (y - z) ** 2}$；只有括号被平方，$x$ 不平方。`,
          ),
          step(
            "Add yz",
            "加上 yz",
            `$yz = ${y * z}$, so the value is $${x * (y - z) ** 2} + ${y * z} = ${x * (y - z) ** 2 + y * z}$.`,
            `$yz = ${y * z}$，所以值为 $${x * (y - z) ** 2} + ${y * z} = ${x * (y - z) ** 2 + y * z}$。`,
          ),
        ],
        t(
          `Subtract $yz$: $${x * (y - z) ** 2 + y * z} - ${y * z} = ${x * (y - z) ** 2}$, and $${x * (y - z) ** 2} \\div (${x}) = ${(y - z) ** 2} = ${y - z}^2$.`,
          `减去 $yz$：$${x * (y - z) ** 2 + y * z} - ${y * z} = ${x * (y - z) ** 2}$，而 $${x * (y - z) ** 2} \\div (${x}) = ${(y - z) ** 2} = ${y - z}^2$。`,
        ),
        [
          t(`This squares $x$ together with $y - z$.`, `这里把 $x$ 与 $y - z$ 一起平方了。`),
          t(`This forgets to square $y - z$.`, `这里忘了把 $y - z$ 平方。`),
          t(`This subtracts $yz$ instead of adding it.`, `这里减去了 $yz$，而不是加上。`),
        ],
      ),
    );
  },
  "Solving Linear Equations": (rng, hard) => {
    const [x, c, b] = [rng.int(-9, 12), rng.int(1, 5), rng.int(1, 15)];
    const a = c + rng.int(1, 6);
    const d = (a - c) * x + b;
    if (!hard)
      return ask(
        rng,
        `What value of $x$ satisfies $${a}x ${sg(b)} = ${cx(c)} ${sg(d)}$?`,
        `哪个 $x$ 值满足 $${a}x ${sg(b)} = ${cx(c)} ${sg(d)}$？`,
        x,
        [x + 2, -x + 1, d + b],
        worked(
          [
            step(
              "Collect the x terms",
              "把 x 项移到一边",
              `Subtract $${cx(c)}$ from both sides: $${cx(a - c)} ${sg(b)} = ${d}$.`,
              `两边减去 $${cx(c)}$：$${cx(a - c)} ${sg(b)} = ${d}$。`,
            ),
            step(
              "Isolate x",
              "求出 x",
              `Subtract $${b}$: $${cx(a - c)} = ${d - b}$, so $x = ${x}$.`,
              `减去 $${b}$：$${cx(a - c)} = ${d - b}$，所以 $x = ${x}$。`,
            ),
          ],
          t(
            `Left: $${a}(${x}) + ${b} = ${a * x + b}$. Right: $${c}(${x}) ${sg(d)} = ${c * x + d}$. They match.`,
            `左边：$${a}(${x}) + ${b} = ${a * x + b}$；右边：$${c}(${x}) ${sg(d)} = ${c * x + d}$，两者相等。`,
          ),
          [
            t(`Substituting it makes the two sides differ by $${2 * (a - c)}$.`, `代入后两边相差 $${2 * (a - c)}$。`),
            t(`This is not what the steps give; substituting it leaves the two sides unequal.`, `按步骤得不到它；代入后两边不相等。`),
            t(
              `This adds the constants instead of moving $${b}$ across with a minus sign.`,
              `这里把常数相加了，而不是把 $${b}$ 变号移过去。`,
            ),
          ],
        ),
      );
    const k = rng.int(2, 4);
    return ask(
      rng,
      `If $${a}x - ${b} = ${a * x - b}$, what is the value of $${k * a}x + ${c}$?`,
      `若 $${a}x - ${b} = ${a * x - b}$，则 $${k * a}x + ${c}$ 的值是多少？`,
      k * a * x + c,
      [x, a * x + c, k * (a * x - b) + c],
      worked(
        [
          step("Find ax", `求 ${a}x`, `Add $${b}$ to both sides: $${a}x = ${a * x}$.`, `两边加 $${b}$：$${a}x = ${a * x}$。`),
          step(
            "Scale it",
            "按倍数放大",
            `$${k * a}x$ is $${k}$ times $${a}x$: $${k} \\times ${a * x} = ${k * a * x}$.`,
            `$${k * a}x$ 是 $${a}x$ 的 $${k}$ 倍：$${k} \\times ${a * x} = ${k * a * x}$。`,
          ),
          step("Add the constant", "加上常数", `$${k * a * x} + ${c} = ${k * a * x + c}$.`, `$${k * a * x} + ${c} = ${k * a * x + c}$。`),
        ],
        t(
          `Solve fully: $x = ${a * x} \\div ${a} = ${x}$, and $${k * a}(${x}) + ${c} = ${k * a * x + c}$.`,
          `完整求解：$x = ${a * x} \\div ${a} = ${x}$，而 $${k * a}(${x}) + ${c} = ${k * a * x + c}$。`,
        ),
        [
          t(`This is $x$ itself, not the expression asked for.`, `这是 $x$ 本身，而不是题目要求的式子。`),
          t(`This uses $${a}x$ without multiplying it by $${k}$.`, `这里用了 $${a}x$，却没有乘以 $${k}$。`),
          t(`This scales $${a}x - ${b}$, keeping the $-${b}$ inside.`, `这里把 $${a}x - ${b}$ 整个放大，把 $-${b}$ 也带进去了。`),
        ],
      ),
    );
  },
  "Solving Linear Equations With Parentheses": (rng, hard) => {
    const [x, c, k, b] = [rng.int(1, 12), rng.int(2, 5), rng.int(2, 3), rng.int(1, 9)];
    const a = c * k;
    const d = k * (x - b) - x;
    if (!hard)
      return ask(
        rng,
        `What is the solution of the equation $${a}(x - ${b}) = ${c}(x ${sg(d)})$?`,
        `方程 $${a}(x - ${b}) = ${c}(x ${sg(d)})$ 的解是什么？`,
        x,
        [x + 1, x - b, x + b],
        worked(
          [
            step(
              "Distribute both sides",
              "两边展开",
              `$${a}x - ${a * b} = ${c}x ${sg(c * d)}$.`,
              `$${a}x - ${a * b} = ${c}x ${sg(c * d)}$。`,
            ),
            step(
              "Collect and divide",
              "移项后相除",
              `$${a - c}x = ${c * d + a * b}$, so $x = ${c * d + a * b} \\div ${a - c} = ${x}$.`,
              `$${a - c}x = ${c * d + a * b}$，所以 $x = ${c * d + a * b} \\div ${a - c} = ${x}$。`,
            ),
          ],
          t(
            `Left: $${a}(${x - b}) = ${a * (x - b)}$. Right: $${c}(${x + d}) = ${c * (x + d)}$. They match.`,
            `左边：$${a}(${x - b}) = ${a * (x - b)}$；右边：$${c}(${x + d}) = ${c * (x + d)}$，两者相等。`,
          ),
          [
            t(`Substituting it makes the left side $${a - c}$ more than the right.`, `代入后左边比右边大 $${a - c}$。`),
            t(`Substituting it makes the left side $${b * (a - c)}$ less than the right.`, `代入后左边比右边小 $${b * (a - c)}$。`),
            t(`Substituting it makes the left side $${b * (a - c)}$ more than the right.`, `代入后左边比右边大 $${b * (a - c)}$。`),
          ],
        ),
      );
    const e = c * (2 * x - b) - (x + k);
    return ask(
      rng,
      `If $${c}(2x - ${b}) - (x + ${k}) = ${e}$, what is $x$?`,
      `若 $${c}(2x - ${b}) - (x + ${k}) = ${e}$，$x$ 是多少？`,
      x,
      [x + k, x + 2, x + b],
      worked(
        [
          step(
            "Distribute, minus sign included",
            "展开，连同负号",
            `The minus sign applies to both $x$ and $${k}$: $${2 * c}x - ${c * b} - x - ${k} = ${e}$.`,
            `负号作用于 $x$ 和 $${k}$：$${2 * c}x - ${c * b} - x - ${k} = ${e}$。`,
          ),
          step(
            "Combine and solve",
            "合并后求解",
            `$${2 * c - 1}x - ${c * b + k} = ${e}$, so $${2 * c - 1}x = ${e + c * b + k}$ and $x = ${x}$.`,
            `$${2 * c - 1}x - ${c * b + k} = ${e}$，所以 $${2 * c - 1}x = ${e + c * b + k}$，$x = ${x}$。`,
          ),
        ],
        t(
          `$${c}(${2 * x - b}) - (${x + k}) = ${c * (2 * x - b)} - ${x + k} = ${e}$.`,
          `$${c}(${2 * x - b}) - (${x + k}) = ${c * (2 * x - b)} - ${x + k} = ${e}$。`,
        ),
        [
          t(`Substituting it makes the left side $${k * (2 * c - 1)}$ more than $${e}$.`, `代入后左边比 $${e}$ 大 $${k * (2 * c - 1)}$。`),
          t(`Substituting it makes the left side $${2 * (2 * c - 1)}$ more than $${e}$.`, `代入后左边比 $${e}$ 大 $${2 * (2 * c - 1)}$。`),
          t(`Substituting it makes the left side $${b * (2 * c - 1)}$ more than $${e}$.`, `代入后左边比 $${e}$ 大 $${b * (2 * c - 1)}$。`),
        ],
      ),
    );
  },
  "Solving Literal Equations": (rng, hard) => {
    const [a, b, c] = [rng.int(2, 9), rng.pick([2, 3, 5, 7]), rng.int(1, 20)];
    if (!hard)
      return ask(
        rng,
        `If $${a}x - ${b}y = ${c}$, which of the following expresses $y$ in terms of $x$?`,
        `若 $${a}x - ${b}y = ${c}$，下列哪一项用 $x$ 表示 $y$？`,
        `\\frac{${a}x - ${c}}{${b}}`,
        [`\\frac{${c} - ${a}x}{${b}}`, `\\frac{${a}x + ${c}}{${b}}`, `${a}x - ${c + b}`],
        worked(
          [
            step(
              "Isolate the y term",
              "让 y 项单独留下",
              `Subtract $${a}x$ from both sides: $-${b}y = ${c} - ${a}x$.`,
              `两边减去 $${a}x$：$-${b}y = ${c} - ${a}x$。`,
            ),
            step(
              "Divide by the coefficient",
              "除以系数",
              `Divide by $-${b}$, which changes every sign: $y = \\frac{${a}x - ${c}}{${b}}$.`,
              `除以 $-${b}$，每一项都变号：$y = \\frac{${a}x - ${c}}{${b}}$。`,
            ),
          ],
          t(
            `Take $x = ${c + b}$: then $y = \\frac{${a * (c + b) - c}}{${b}}$, and $${a}(${c + b}) - ${b} \\cdot \\frac{${a * (c + b) - c}}{${b}} = ${a * (c + b)} - ${a * (c + b) - c} = ${c}$.`,
            `取 $x = ${c + b}$：$y = \\frac{${a * (c + b) - c}}{${b}}$，而 $${a}(${c + b}) - ${b} \\cdot \\frac{${a * (c + b) - c}}{${b}} = ${a * (c + b)} - ${a * (c + b) - c} = ${c}$。`,
          ),
          [
            t(`This divides by $${b}$ instead of $-${b}$, so both signs are wrong.`, `这里除以 $${b}$ 而不是 $-${b}$，两个符号都错了。`),
            t(
              `This adds $${c}$, as if $${a}x$ had been moved with the wrong sign.`,
              `这里加上了 $${c}$，好像移项时把 $${a}x$ 的符号弄错了。`,
            ),
            t(`This subtracts $${b}$ instead of dividing by it.`, `这里减去了 $${b}$，而不是除以它。`),
          ],
        ),
      );
    return ask(
      rng,
      `A shop's charge, $C$ dollars, for a repair of $h$ hours is $C = ${c} + ${a}h$. Which equation gives $h$ in terms of $C$?`,
      `一家店修理 $h$ 小时收费 $C$ 美元，$C = ${c} + ${a}h$。哪个等式用 $C$ 表示 $h$？`,
      `h = \\frac{C - ${c}}{${a}}`,
      [`h = \\frac{C + ${c}}{${a}}`, `h = \\frac{C}{${a}} - ${c}`, `h = ${a}C - ${c}`],
      worked(
        [
          step(
            "Remove the fixed charge",
            "减去固定收费",
            `Subtract $${c}$ from both sides: $C - ${c} = ${a}h$.`,
            `两边减去 $${c}$：$C - ${c} = ${a}h$。`,
          ),
          step(
            "Divide the whole difference",
            "整个差相除",
            `Divide both sides by $${a}$: $h = \\frac{C - ${c}}{${a}}$.`,
            `两边除以 $${a}$：$h = \\frac{C - ${c}}{${a}}$。`,
          ),
        ],
        t(
          `A $2$-hour repair costs $C = ${c} + ${2 * a} = ${c + 2 * a}$, and $\\frac{${c + 2 * a} - ${c}}{${a}} = 2$.`,
          `修 $2$ 小时收费 $C = ${c} + ${2 * a} = ${c + 2 * a}$，而 $\\frac{${c + 2 * a} - ${c}}{${a}} = 2$。`,
        ),
        [
          t(`This adds the fixed charge instead of taking it away.`, `这里把固定收费加上了，而不是减去。`),
          t(`This divides only $C$ by $${a}$, not the whole $C - ${c}$.`, `这里只把 $C$ 除以 $${a}$，没有把整个 $C - ${c}$ 相除。`),
          t(`This multiplies by $${a}$ instead of dividing.`, `这里乘以了 $${a}$，而不是除以它。`),
        ],
      ),
    );
  },
  "Identifying Characteristics of Linear Equations": (rng, hard) => {
    const [a, b, c] = [rng.int(2, 9), rng.int(2, 9), rng.int(1, 40)];
    if (!hard) {
      const kind = rng.int(0, 2);
      const right = kind === 0 ? `${a}x + ${a * b}` : kind === 1 ? `${a}x + ${a * b + c}` : `${a + 1}x + ${a * b}`;
      const none = t("No real solution", "没有实数解");
      const one = t("Exactly 1 real solution", "恰有 1 个实数解");
      const many = t("Infinitely many real solutions", "有无穷多个实数解");
      const two = t("Exactly 2 real solutions", "恰有 2 个实数解");
      const answer = kind === 0 ? many : kind === 1 ? none : one;
      const compare =
        kind === 0
          ? t(
              `Both sides are $${a}x + ${a * b}$: subtracting $${a}x$ leaves $${a * b} = ${a * b}$, true for every $x$.`,
              `两边都是 $${a}x + ${a * b}$：减去 $${a}x$ 剩下 $${a * b} = ${a * b}$，对任何 $x$ 都成立。`,
            )
          : kind === 1
            ? t(
                `Subtracting $${a}x$ leaves $${a * b} = ${a * b + c}$, which is false for every $x$.`,
                `减去 $${a}x$ 剩下 $${a * b} = ${a * b + c}$，对任何 $x$ 都不成立。`,
              )
            : t(
                `The $x$ coefficients $${a}$ and $${a + 1}$ differ: subtracting gives $x = 0$, one solution.`,
                `$x$ 系数 $${a}$ 与 $${a + 1}$ 不同：相减得 $x = 0$，只有一个解。`,
              );
      return words(
        rng,
        t(`How many real solutions does $${a}(x + ${b}) = ${right}$ have?`, `$${a}(x + ${b}) = ${right}$ 有多少个实数解？`),
        answer,
        [many, none, one, two].filter((o) => o !== answer),
        worked(
          [
            step("Distribute the left side", "展开左边", `$${a}(x + ${b}) = ${a}x + ${a * b}$.`, `$${a}(x + ${b}) = ${a}x + ${a * b}$。`),
            step("Compare the two sides", "比较两边", compare.en, compare["zh-CN"]),
          ],
          kind === 2
            ? t(
                `At $x = 0$ both sides equal $${a * b}$, and at $x = 1$ they are $${a + a * b}$ and $${a + 1 + a * b}$, so only $x = 0$ works.`,
                `$x = 0$ 时两边都等于 $${a * b}$；$x = 1$ 时分别为 $${a + a * b}$ 与 $${a + 1 + a * b}$，所以只有 $x = 0$ 成立。`,
              )
            : kind === 0
              ? t(
                  `At $x = 0$ both sides are $${a * b}$, and at $x = 1$ both are $${a + a * b}$.`,
                  `$x = 0$ 时两边都是 $${a * b}$，$x = 1$ 时两边都是 $${a + a * b}$。`,
                )
              : t(
                  `At $x = 0$ the sides are $${a * b}$ and $${a * b + c}$; they always differ by $${c}$.`,
                  `$x = 0$ 时两边是 $${a * b}$ 与 $${a * b + c}$；它们始终相差 $${c}$。`,
                ),
          [
            t(`That needs the same $x$ term and the same constant on both sides.`, `这要求两边的 $x$ 项和常数都相同。`),
            t(`That needs the same $x$ term with different constants.`, `这要求两边 $x$ 项相同而常数不同。`),
            t(`That needs different $x$ terms on the two sides.`, `这要求两边的 $x$ 项不同。`),
            t(`A linear equation can never have exactly two solutions.`, `一次方程不可能恰有两个解。`),
          ].filter((_, i) => [many, none, one, two][i] !== answer),
        ),
      );
    }
    return ask(
      rng,
      `For what value of $k$ does the equation $kx + ${b} = ${a}x + ${b + c}$ have no solution?`,
      `$k$ 为何值时，方程 $kx + ${b} = ${a}x + ${b + c}$ 无解？`,
      a,
      [c, b, a + b],
      worked(
        [
          step(
            "Know what no solution needs",
            "明确无解的条件",
            `No solution means the $x$ terms cancel and leave a false statement, so the $x$ coefficients must be equal.`,
            `无解意味着 $x$ 项消去后剩下矛盾，所以两边 $x$ 的系数必须相等。`,
          ),
          step(
            "Set k",
            "确定 k",
            `$k = ${a}$, and then $${b} = ${b + c}$ is false, since the constants differ.`,
            `$k = ${a}$，此时剩下 $${b} = ${b + c}$，因常数不同而不成立。`,
          ),
        ],
        t(
          `With $k = ${a}$, subtracting $${a}x$ leaves $${b} = ${b + c}$ for every $x$. With any other $k$, $x = \\frac{${c}}{k - ${a}}$ is a solution.`,
          `$k = ${a}$ 时，减去 $${a}x$ 对任何 $x$ 都剩下 $${b} = ${b + c}$。$k$ 取其他值时，$x = \\frac{${c}}{k - ${a}}$ 就是解。`,
        ),
        [
          t(`This is the difference of the constants, not an $x$ coefficient.`, `这是两边常数的差，不是 $x$ 的系数。`),
          t(`This is the constant on the left, not an $x$ coefficient.`, `这是左边的常数，不是 $x$ 的系数。`),
          t(`With this $k$ the $x$ terms do not cancel, so there is one solution.`, `取这个 $k$ 时 $x$ 项不能消去，方程有一个解。`),
        ],
      ),
    );
  },
  "Writing Linear Inequalities": (rng, hard) => {
    const [s, r, g] = [rng.int(50, 200), rng.int(8, 40), rng.int(300, 900)];
    if (!hard)
      return ask(
        rng,
        `Noor has saved $\\$${s}$ and adds $\\$${r}$ each week. Which inequality can be used to find the number of weeks, $w$, until Noor has at least $\\$${g}$?`,
        `Noor 已存 $\\$${s}$，每周再存 $\\$${r}$。哪个不等式可用来求至少存到 $\\$${g}$ 所需的周数 $w$？`,
        `${s} + ${r}w \\ge ${g}`,
        [`${s} + ${r}w \\le ${g}`, `${r} + ${s}w \\ge ${g}`, `${s}w + ${r}w \\ge ${g}`],
        worked(
          [
            step(
              "Write the savings",
              "写出存款",
              `The start is $${s}$ and $${r}$ is added each week, so after $w$ weeks Noor has $${s} + ${r}w$ dollars.`,
              `起点是 $${s}$，每周加 $${r}$，所以 $w$ 周后 Noor 有 $${s} + ${r}w$ 美元。`,
            ),
            step(
              "Choose the symbol",
              "选择不等号",
              `"At least $${g}$" means greater than or equal to: $${s} + ${r}w \\ge ${g}$.`,
              `“至少 $${g}$”表示大于或等于：$${s} + ${r}w \\ge ${g}$。`,
            ),
          ],
          t(
            `After $0$ weeks Noor has $${s}$, short of the goal, and $${s} \\ge ${g}$ is false, as it should be.`,
            `$0$ 周时 Noor 有 $${s}$，未达目标，而 $${s} \\ge ${g}$ 不成立，正合题意。`,
          ),
          [
            t(`This says at most $${g}$, the opposite of at least.`, `这表示最多 $${g}$，与“至少”相反。`),
            t(`This swaps the start and the weekly amount.`, `这里把起点与每周存的钱对调了。`),
            t(
              `This multiplies the starting $${s}$ by $w$, though it is saved only once.`,
              `这里把起点 $${s}$ 也乘了 $w$，但它只存了一次。`,
            ),
          ],
        ),
      );
    const [d, b, p] = [rng.int(140, 220), rng.int(15, 60), rng.int(1000, 3000)];
    return ask(
      rng,
      `An elevator holds at most $${p}$ pounds. A $${d}$-pound operator rides with boxes of $${b}$ pounds each. Which inequality describes the number of boxes, $n$, the elevator can carry?`,
      `一部电梯最多载重 $${p}$ 磅。一名 $${d}$ 磅的操作员与每箱 $${b}$ 磅的箱子同乘。哪个不等式描述电梯能运的箱数 $n$？`,
      `${d} + ${b}n \\le ${p}`,
      [`${d} + ${b}n \\ge ${p}`, `${b} + ${d}n \\le ${p}`, `${d}n + ${b}n \\le ${p}`],
      worked(
        [
          step(
            "Write the load",
            "写出载重",
            `The operator rides once and each box adds $${b}$ pounds: the load is $${d} + ${b}n$.`,
            `操作员只算一次，每箱加 $${b}$ 磅：载重是 $${d} + ${b}n$。`,
          ),
          step(
            "Choose the symbol",
            "选择不等号",
            `"At most $${p}$" means less than or equal to: $${d} + ${b}n \\le ${p}$.`,
            `“最多 $${p}$”表示小于或等于：$${d} + ${b}n \\le ${p}$。`,
          ),
        ],
        t(
          `With no boxes the load is $${d}$ pounds, which is allowed, and $${d} \\le ${p}$ is true.`,
          `没有箱子时载重 $${d}$ 磅，是允许的，而 $${d} \\le ${p}$ 成立。`,
        ),
        [
          t(`This says the load is at least $${p}$, the opposite of at most.`, `这表示载重至少 $${p}$，与“最多”相反。`),
          t(`This swaps the operator's weight and a box's weight.`, `这里把操作员的体重与每箱的重量对调了。`),
          t(`This counts the operator $n$ times.`, `这里把操作员算了 $n$ 次。`),
        ],
      ),
    );
  },
  "Finding a Threshold From a Linear Inequality": (rng, hard) => {
    const [f, r, n] = [rng.int(15, 60), rng.int(2, 9), rng.int(8, 40)];
    if (!hard) {
      const budget = f + r * n + rng.int(0, r - 1);
      return ask(
        rng,
        `A gym charges a $\\$${f}$ sign-up fee and $\\$${r}$ per visit. What is the greatest number of visits Sam can pay for with $\\$${budget}$?`,
        `一家健身房收 $\\$${f}$ 注册费，每次 $\\$${r}$。Sam 用 $\\$${budget}$ 最多能支付多少次？`,
        n,
        [n + 1, n - 1, Math.floor(budget / r)],
        worked(
          [
            step(
              "Write the inequality",
              "列不等式",
              `The cost of $v$ visits is $${f} + ${r}v$, and it may not exceed the budget: $${f} + ${r}v \\le ${budget}$.`,
              `$v$ 次的费用是 $${f} + ${r}v$，不能超过预算：$${f} + ${r}v \\le ${budget}$。`,
            ),
            step(
              "Solve and round",
              "求解并取整",
              `$${r}v \\le ${budget - f}$, so $v \\le \\frac{${budget - f}}{${r}}$. ${(budget - f) % r === 0 ? `That is exactly $${n}$.` : `Only whole visits count, so round down to $${n}$.`}`,
              `$${r}v \\le ${budget - f}$，所以 $v \\le \\frac{${budget - f}}{${r}}$。${(budget - f) % r === 0 ? `正好是 $${n}$。` : `次数必须是整数，向下取整得 $${n}$。`}`,
            ),
          ],
          t(
            `$${n}$ visits cost $${f} + ${r * n} = ${f + r * n} \\le ${budget}$, and $${n + 1}$ would cost $${f + r * (n + 1)}$, too much.`,
            `$${n}$ 次花费 $${f} + ${r * n} = ${f + r * n} \\le ${budget}$，而 $${n + 1}$ 次要 $${f + r * (n + 1)}$，超出预算。`,
          ),
          [
            t(
              `$${n + 1}$ visits cost $${f + r * (n + 1)}$, more than $${budget}$.`,
              `$${n + 1}$ 次要 $${f + r * (n + 1)}$，超过 $${budget}$。`,
            ),
            t(`Sam can afford one more visit than this.`, `Sam 还能再多去一次。`),
            t(`This divides the whole budget by $${r}$ and forgets the sign-up fee.`, `这里把整个预算除以 $${r}$，忘了注册费。`),
          ],
        ),
      );
    }
    const goal = f + r * n - rng.int(0, r - 1);
    return ask(
      rng,
      `A school club has $\\$${f}$ and sells cards for $\\$${r}$ each. What is the least number of cards it must sell to have at least $\\$${goal}$?`,
      `一个学校社团有 $\\$${f}$，每张卡片卖 $\\$${r}$。要拥有至少 $\\$${goal}$，最少要卖多少张？`,
      n,
      [n + 1, n - 1, Math.ceil(goal / r)],
      worked(
        [
          step(
            "Write the inequality",
            "列不等式",
            `After $c$ cards the club has $${f} + ${r}c$, which must reach the goal: $${f} + ${r}c \\ge ${goal}$.`,
            `卖出 $c$ 张后社团有 $${f} + ${r}c$，必须达到目标：$${f} + ${r}c \\ge ${goal}$。`,
          ),
          step(
            "Solve and round",
            "求解并取整",
            `$${r}c \\ge ${goal - f}$, so $c \\ge \\frac{${goal - f}}{${r}}$. ${(goal - f) % r === 0 ? `That is exactly $${n}$.` : `Only whole cards can be sold, so round up to $${n}$.`}`,
            `$${r}c \\ge ${goal - f}$，所以 $c \\ge \\frac{${goal - f}}{${r}}$。${(goal - f) % r === 0 ? `正好是 $${n}$。` : `卡片数必须是整数，向上取整得 $${n}$。`}`,
          ),
        ],
        t(
          `$${n}$ cards give $${f} + ${r * n} = ${f + r * n} \\ge ${goal}$, while $${n - 1}$ give only $${f + r * (n - 1)}$.`,
          `卖 $${n}$ 张得 $${f} + ${r * n} = ${f + r * n} \\ge ${goal}$，而 $${n - 1}$ 张只有 $${f + r * (n - 1)}$。`,
        ),
        [
          t(`The goal is already reached with one card fewer than this.`, `少卖一张就已经达到目标了。`),
          t(
            `$${n - 1}$ cards leave the club at $${f + r * (n - 1)}$, short of $${goal}$.`,
            `卖 $${n - 1}$ 张社团只有 $${f + r * (n - 1)}$，不足 $${goal}$。`,
          ),
          t(
            `This divides the whole goal by $${r}$ and forgets the $${f}$ the club already has.`,
            `这里把整个目标除以 $${r}$，忘了社团已有的 $${f}$。`,
          ),
        ],
      ),
    );
  },
  "Graphing Linear Inequalities": (rng, hard) => {
    const [m, b] = [rng.pick([-3, -2, -1, 1, 2, 3]), rng.int(-5, 6)];
    const above = rng.int(0, 1) === 1;
    const line = lin(m, b);
    if (!hard) {
      const sign = above ? ">" : "<";
      const other = above ? "<" : ">";
      return ask(
        rng,
        `Which inequality is shown by the graph, where the boundary line is dashed and the solutions are shaded?`,
        `图中边界线为虚线，解的区域画有阴影。这是哪个不等式的图象？`,
        `y ${sign} ${line}`,
        [`y ${other} ${line}`, `y ${sign} ${lin(-m, b)}`, `y ${sign} ${lin(m, b === 0 ? 1 : -b)}`],
        worked(
          [
            step(
              "Read the boundary line",
              "读出边界线",
              `The line crosses the $y$-axis at $${b}$ and rises $${m}$ for each step right, so it is $y = ${line}$.`,
              `直线与 $y$ 轴交于 $${b}$，每向右一格升高 $${m}$，所以是 $y = ${line}$。`,
            ),
            step(
              "Read the shading and the line style",
              "读出阴影与线型",
              `The shading is ${above ? "above" : "below"} the line, so $y ${sign}$, and the dashed line means the line itself is left out: $y ${sign} ${line}$.`,
              `阴影在直线${above ? "上方" : "下方"}，所以是 $y ${sign}$；虚线表示不含直线本身：$y ${sign} ${line}$。`,
            ),
          ],
          t(
            `The point $(0, ${above ? b + 1 : b - 1})$ lies in the shading, and $${above ? b + 1 : b - 1} ${sign} ${b}$ is true.`,
            `点 $(0, ${above ? b + 1 : b - 1})$ 在阴影内，而 $${above ? b + 1 : b - 1} ${sign} ${b}$ 成立。`,
          ),
          [
            t(`This shades the other side of the line.`, `这表示的是直线另一侧的区域。`),
            t(`This line slopes the other way.`, `这条直线的倾斜方向相反。`),
            t(`This line crosses the $y$-axis at a different point.`, `这条直线与 $y$ 轴交于另一点。`),
          ],
        ),
        regionFigure(m, b, above),
      );
    }
    const x = rng.int(-3, 3);
    const on = m * x + b;
    const inside = `(${x}, ${above ? on + 2 : on - 2})`;
    return ask(
      rng,
      `The graph shows the solutions of $y ${above ? ">" : "<"} ${line}$. Which point is a solution?`,
      `图中是 $y ${above ? ">" : "<"} ${line}$ 的解。哪个点是解？`,
      inside,
      [`(${x}, ${on})`, `(${x}, ${above ? on - 2 : on + 2})`, `(${x}, ${above ? on - 5 : on + 5})`],
      worked(
        [
          step(
            "Find the line at this x",
            "求该 x 处直线的高度",
            `Every option has $x = ${x}$, where the line is at $y = ${m}(${x}) ${sg(b)} = ${on}$.`,
            `每个选项都有 $x = ${x}$，此处直线的高度为 $y = ${m}(${x}) ${sg(b)} = ${on}$。`,
          ),
          step(
            "Pick the side",
            "选出正确一侧",
            `Solutions have $y ${above ? ">" : "<"} ${on}$ and the dashed line itself is not included, so the point is $${inside}$.`,
            `解满足 $y ${above ? ">" : "<"} ${on}$，虚线本身不算，所以是点 $${inside}$。`,
          ),
        ],
        t(
          `Substitute: $${above ? on + 2 : on - 2} ${above ? ">" : "<"} ${m}(${x}) ${sg(b)} = ${on}$ is true.`,
          `代入：$${above ? on + 2 : on - 2} ${above ? ">" : "<"} ${m}(${x}) ${sg(b)} = ${on}$ 成立。`,
        ),
        [
          t(`This point is on the dashed line, which is not part of the solutions.`, `这个点在虚线上，虚线不属于解。`),
          t(`This point is on the wrong side of the line.`, `这个点在直线的另一侧。`),
          t(`This point is even farther on the wrong side of the line.`, `这个点在直线另一侧，而且更远。`),
        ],
      ),
      regionFigure(m, b, above),
    );
  },
  "Using Systems of Linear Inequalities": (rng, hard) => {
    const [x, y, a, b] = [rng.int(1, 8), rng.int(1, 9), rng.int(1, 4), rng.int(2, 5)];
    const low = y - a * x - rng.int(1, 5);
    const high = y + b * x + rng.int(1, 5);
    if (!hard)
      return ask(
        rng,
        `Which point lies in the solution set of the system $y > ${lin(a, low)}$ and $y < ${lin(-b, high + 2 * b * x)}$?`,
        `哪个点在不等式组 $y > ${lin(a, low)}$ 且 $y < ${lin(-b, high + 2 * b * x)}$ 的解集中？`,
        `(${x}, ${y})`,
        [`(${x}, ${a * x + low})`, `(${x}, ${a * x + low - 3})`, `(${x}, ${-b * x + high + 2 * b * x + 3})`],
        worked(
          [
            step(
              "Find both bounds at this x",
              "求该 x 处的上下界",
              `Every option has $x = ${x}$. The first line is at $${a}(${x}) ${sg(low)} = ${a * x + low}$ and the second at $-${b}(${x}) ${sg(high + 2 * b * x)} = ${-b * x + high + 2 * b * x}$.`,
              `每个选项都有 $x = ${x}$。第一条直线高度为 $${a}(${x}) ${sg(low)} = ${a * x + low}$，第二条为 $-${b}(${x}) ${sg(high + 2 * b * x)} = ${-b * x + high + 2 * b * x}$。`,
            ),
            step(
              "Pick the y between them",
              "选出介于两者之间的 y",
              `$y$ must be greater than $${a * x + low}$ and less than $${-b * x + high + 2 * b * x}$, and only $y = ${y}$ is.`,
              `$y$ 必须大于 $${a * x + low}$ 且小于 $${-b * x + high + 2 * b * x}$，只有 $y = ${y}$ 满足。`,
            ),
          ],
          t(
            `$${y} > ${a * x + low}$ and $${y} < ${-b * x + high + 2 * b * x}$ are both true.`,
            `$${y} > ${a * x + low}$ 与 $${y} < ${-b * x + high + 2 * b * x}$ 都成立。`,
          ),
          [
            t(`This point is on the first boundary, and $>$ leaves it out.`, `这个点在第一条边界上，而 $>$ 不含边界。`),
            t(`This point is below the first boundary.`, `这个点在第一条边界下方。`),
            t(`This point is above the second boundary.`, `这个点在第二条边界上方。`),
          ],
        ),
      );
    const [p, q] = [rng.int(20, 60), rng.int(3, 9)];
    const most = rng.int(4, 12);
    return ask(
      rng,
      `A student works $x$ hours at $\\$${q}$ per hour and spends $y$ hours in practice, with $x + y \\le ${most + p}$ and $y \\ge ${p}$. What is the greatest amount the student can earn?`,
      `一名学生打工 $x$ 小时，每小时 $\\$${q}$，练习 $y$ 小时，且 $x + y \\le ${most + p}$，$y \\ge ${p}$。这名学生最多能挣多少？`,
      q * most,
      [q * (most + p), q * p, most + q],
      worked(
        [
          step(
            "Find the most hours of work",
            "求最多的工作时数",
            `Earnings are $${q}x$, so $x$ should be as large as allowed. With $y \\ge ${p}$, $x \\le ${most + p} - y \\le ${most + p} - ${p} = ${most}$.`,
            `收入是 $${q}x$，所以 $x$ 越大越好。由 $y \\ge ${p}$，$x \\le ${most + p} - y \\le ${most + p} - ${p} = ${most}$。`,
          ),
          step(
            "Compute the earnings",
            "计算收入",
            `$${q} \\times ${most} = ${q * most}$ dollars.`,
            `$${q} \\times ${most} = ${q * most}$ 美元。`,
          ),
        ],
        t(
          `$x = ${most}$ and $y = ${p}$ satisfy both: $${most} + ${p} = ${most + p}$ and $${p} \\ge ${p}$. A larger $x$ would need $y < ${p}$.`,
          `$x = ${most}$，$y = ${p}$ 满足两个条件：$${most} + ${p} = ${most + p}$，$${p} \\ge ${p}$。$x$ 再大就需要 $y < ${p}$。`,
        ),
        [
          t(`This pays every hour, practice included, as work.`, `这里把练习的时间也当作工作时间计酬了。`),
          t(`This pays the practice hours instead of the work hours.`, `这里给练习时间计酬，而不是工作时间。`),
          t(`This adds the hours and the rate instead of multiplying.`, `这里把时数与时薪相加，而不是相乘。`),
        ],
      ),
    );
  },
  "Solving Linear Systems": (rng, hard) => {
    const [x, y] = [rng.int(-6, 12), rng.int(-6, 12)];
    if (!hard)
      return ask(
        rng,
        `If $x + y = ${x + y}$ and $x - y = ${x - y}$, what is the value of $x$?`,
        `若 $x + y = ${x + y}$ 且 $x - y = ${x - y}$，$x$ 的值是多少？`,
        x,
        [y, x + y, x - y === x ? x + 1 : x - y],
        worked(
          [
            step(
              "Add the equations",
              "两式相加",
              `The $y$ terms cancel: $2x = ${x + y} + ${x - y < 0 ? `(${x - y})` : x - y} = ${2 * x}$.`,
              `$y$ 项抵消：$2x = ${x + y} + ${x - y < 0 ? `(${x - y})` : x - y} = ${2 * x}$。`,
            ),
            step("Divide by 2", "除以 2", `$x = ${2 * x} \\div 2 = ${x}$.`, `$x = ${2 * x} \\div 2 = ${x}$。`),
          ],
          t(
            `Then $y = ${x + y} - ${x < 0 ? `(${x})` : x} = ${y}$, and $${x < 0 ? `(${x})` : x} - ${y < 0 ? `(${y})` : y} = ${x - y}$ as given.`,
            `于是 $y = ${x + y} - ${x < 0 ? `(${x})` : x} = ${y}$，而 $${x < 0 ? `(${x})` : x} - ${y < 0 ? `(${y})` : y} = ${x - y}$，与题设一致。`,
          ),
          [
            t(`This is the value of $y$, not $x$.`, `这是 $y$ 的值，不是 $x$。`),
            t(`This is $x + y$, before dividing by $2$.`, `这是 $x + y$，还没有除以 $2$。`),
            t(`This is the value of $x - y$ from the second equation.`, `这是第二个方程中 $x - y$ 的值。`),
          ],
        ),
      );
    const [a, c] = [rng.int(2, 6), rng.int(2, 6)];
    const b = y - a * x;
    return ask(
      rng,
      `Given $y = ${lin(a, b)}$ and $${c}x + y = ${c * x + y}$, what is the value of $y$?`,
      `已知 $y = ${lin(a, b)}$ 且 $${c}x + y = ${c * x + y}$，$y$ 的值是多少？`,
      y,
      [x, y + a, c * x + y],
      worked(
        [
          step(
            "Substitute for y",
            "代入 y",
            `$${c}x + (${lin(a, b)}) = ${c * x + y}$, so $${a + c}x ${sg(b)} = ${c * x + y}$ and $x = ${x}$.`,
            `$${c}x + (${lin(a, b)}) = ${c * x + y}$，所以 $${a + c}x ${sg(b)} = ${c * x + y}$，$x = ${x}$。`,
          ),
          step("Find y", "求 y", `$y = ${a}(${x}) ${sg(b)} = ${y}$.`, `$y = ${a}(${x}) ${sg(b)} = ${y}$。`),
        ],
        t(
          `In the second equation: $${c}(${x}) + ${y < 0 ? `(${y})` : y} = ${c * x + y}$.`,
          `代入第二个方程：$${c}(${x}) + ${y < 0 ? `(${y})` : y} = ${c * x + y}$。`,
        ),
        [
          t(`This is the value of $x$; the question asks for $y$.`, `这是 $x$ 的值；题目问的是 $y$。`),
          t(`This adds the slope $${a}$ once too often.`, `这里多加了一次斜率 $${a}$。`),
          t(`This is the right side of the second equation, not $y$.`, `这是第二个方程的右边，不是 $y$。`),
        ],
      ),
    );
  },
  "Solving Systems by Elimination": (rng, hard) => {
    const [x, y, a, b, c] = [rng.int(-5, 9), rng.int(-5, 9), rng.int(2, 7), rng.int(2, 5), rng.int(2, 5)];
    if (!hard)
      return ask(
        rng,
        `What is the value of $y$ in the solution of the system $${a}x + ${b}y = ${a * x + b * y}$ and $${a}x - ${c}y = ${a * x - c * y}$?`,
        `方程组 $${a}x + ${b}y = ${a * x + b * y}$，$${a}x - ${c}y = ${a * x - c * y}$ 的解中，$y$ 的值是多少？`,
        y,
        [x, y + 1, b + c],
        worked(
          [
            step(
              "Subtract to cancel x",
              "相减消去 x",
              `Both equations have $${a}x$. First minus second: $${b}y - (-${c}y) = ${b + c}y$ and $${a * x + b * y} - ${a * x - c * y < 0 ? `(${a * x - c * y})` : a * x - c * y} = ${(b + c) * y}$.`,
              `两个方程都有 $${a}x$。第一式减第二式：$${b}y - (-${c}y) = ${b + c}y$，$${a * x + b * y} - ${a * x - c * y < 0 ? `(${a * x - c * y})` : a * x - c * y} = ${(b + c) * y}$。`,
            ),
            step("Divide", "相除", `$${b + c}y = ${(b + c) * y}$, so $y = ${y}$.`, `$${b + c}y = ${(b + c) * y}$，所以 $y = ${y}$。`),
          ],
          t(
            `Then $${a}x = ${a * x + b * y} - ${b}(${y}) = ${a * x}$ gives $x = ${x}$, and $${a}(${x}) - ${c}(${y}) = ${a * x - c * y}$ as given.`,
            `于是 $${a}x = ${a * x + b * y} - ${b}(${y}) = ${a * x}$，$x = ${x}$，而 $${a}(${x}) - ${c}(${y}) = ${a * x - c * y}$，与题设一致。`,
          ),
          [
            t(`This is the value of $x$, not $y$.`, `这是 $x$ 的值，不是 $y$。`),
            t(`Substituting it makes the first equation off by $${b}$.`, `代入后第一个方程相差 $${b}$。`),
            t(`This is the coefficient $${b + c}$ of $y$ after subtracting, not $y$.`, `这是相减后 $y$ 的系数 $${b + c}$，不是 $y$。`),
          ],
        ),
      );
    const d = a + 1;
    return ask(
      rng,
      `If $${a}x + ${b}y = ${a * x + b * y}$ and $${d}x - ${b}y = ${d * x - b * y}$, what is the value of $x + y$?`,
      `若 $${a}x + ${b}y = ${a * x + b * y}$ 且 $${d}x - ${b}y = ${d * x - b * y}$，$x + y$ 的值是多少？`,
      x + y,
      [x, y, x - y === x + y ? x + y + 1 : x - y],
      worked(
        [
          step(
            "Add to cancel y",
            "相加消去 y",
            `$${b}y$ and $-${b}y$ cancel: $${a + d}x = ${(a + d) * x}$, so $x = ${x}$.`,
            `$${b}y$ 与 $-${b}y$ 抵消：$${a + d}x = ${(a + d) * x}$，所以 $x = ${x}$。`,
          ),
          step(
            "Find y",
            "求 y",
            `$${b}y = ${a * x + b * y} - ${a}(${x}) = ${b * y}$, so $y = ${y}$.`,
            `$${b}y = ${a * x + b * y} - ${a}(${x}) = ${b * y}$，所以 $y = ${y}$。`,
          ),
          step(
            "Add",
            "相加",
            `$x + y = ${x} + ${y < 0 ? `(${y})` : y} = ${x + y}$.`,
            `$x + y = ${x} + ${y < 0 ? `(${y})` : y} = ${x + y}$。`,
          ),
        ],
        t(
          `In the second equation: $${d}(${x}) - ${b}(${y}) = ${d * x - b * y}$.`,
          `代入第二个方程：$${d}(${x}) - ${b}(${y}) = ${d * x - b * y}$。`,
        ),
        [
          t(`This is $x$ alone; the question asks for $x + y$.`, `这只是 $x$；题目问的是 $x + y$。`),
          t(`This is $y$ alone; the question asks for $x + y$.`, `这只是 $y$；题目问的是 $x + y$。`),
          t(`This subtracts $y$ instead of adding it.`, `这里减去了 $y$，而不是加上。`),
        ],
      ),
    );
  },
  "Determining How Many Solutions a System Has": (rng, hard) => {
    const [a, b, c, k] = [rng.int(2, 7), rng.int(2, 7), rng.int(1, 9), rng.int(2, 4)];
    if (!hard) {
      const kind = rng.int(0, 2);
      const second =
        kind === 0
          ? `${k * a}x + ${k * b}y = ${k * c}`
          : kind === 1
            ? `${k * a}x + ${k * b}y = ${k * c + 1}`
            : `${k * a + 1}x + ${k * b}y = ${k * c}`;
      const many = t("Infinitely many", "无穷多个");
      const none = t("None", "没有");
      const one = t("Exactly 1", "恰好 1 个");
      const two = t("Exactly 2", "恰好 2 个");
      const answer = kind === 0 ? many : kind === 1 ? none : one;
      const compare =
        kind === 0
          ? t(
              `It matches the second equation exactly, so both are the same line: every point on it is a solution.`,
              `它与第二个方程完全相同，两者是同一条直线：线上每个点都是解。`,
            )
          : kind === 1
            ? t(
                `The left sides match but $${k * c} \\ne ${k * c + 1}$: the lines are parallel and never meet.`,
                `左边相同而 $${k * c} \\ne ${k * c + 1}$：两直线平行，永不相交。`,
              )
            : t(
                `The $x$ coefficients $${k * a}$ and $${k * a + 1}$ differ, so the slopes differ and the lines cross once.`,
                `$x$ 系数 $${k * a}$ 与 $${k * a + 1}$ 不同，斜率不同，两直线恰交于一点。`,
              );
      return words(
        rng,
        t(
          `How many solutions does the system $${a}x + ${b}y = ${c}$ and $${second}$ have?`,
          `方程组 $${a}x + ${b}y = ${c}$，$${second}$ 有多少个解？`,
        ),
        answer,
        [many, none, one, two].filter((o) => o !== answer),
        worked(
          [
            step(
              "Scale the first equation",
              "把第一个方程放大",
              `Multiply it by $${k}$: $${k * a}x + ${k * b}y = ${k * c}$.`,
              `乘以 $${k}$：$${k * a}x + ${k * b}y = ${k * c}$。`,
            ),
            step("Compare with the second", "与第二个方程比较", compare.en, compare["zh-CN"]),
          ],
          kind === 2
            ? t(
                `Subtracting the scaled first equation from the second leaves $x = 0$, and then $y = \\frac{${c}}{${b}}$: one point.`,
                `第二个方程减去放大后的第一个方程得 $x = 0$，再得 $y = \\frac{${c}}{${b}}$：只有一个点。`,
              )
            : kind === 0
              ? t(
                  `The point $(0, \\frac{${c}}{${b}})$ satisfies both, and so does every other point of the first line.`,
                  `点 $(0, \\frac{${c}}{${b}})$ 满足两个方程，第一条直线上的其他点也一样。`,
                )
              : t(
                  `Subtracting the scaled first equation from the second leaves $0 = 1$, which is never true.`,
                  `第二个方程减去放大后的第一个方程得 $0 = 1$，永远不成立。`,
                ),
          [
            t(`That needs the second equation to be a multiple of the first.`, `这要求第二个方程是第一个方程的倍数。`),
            t(`That needs the same left side with a different right side.`, `这要求左边相同而右边不同。`),
            t(`That needs the two lines to have different slopes.`, `这要求两直线的斜率不同。`),
            t(`Two different lines meet at most once, so two solutions is impossible.`, `两条不同的直线最多交于一点，不可能恰有两个解。`),
          ].filter((_, i) => [many, none, one, two][i] !== answer),
        ),
      );
    }
    return ask(
      rng,
      `For what value of $m$ does the system $y = ${lin(a, c)}$ and $${k}y = mx + ${k * c + 1}$ have no solution?`,
      `$m$ 为何值时，方程组 $y = ${lin(a, c)}$，$${k}y = mx + ${k * c + 1}$ 无解？`,
      k * a,
      [a, k + a, k * c],
      worked(
        [
          step(
            "Write the second line in slope form",
            "把第二条直线化为斜截式",
            `Divide by $${k}$: $y = \\frac{m}{${k}}x + \\frac{${k * c + 1}}{${k}}$, with slope $\\frac{m}{${k}}$.`,
            `除以 $${k}$：$y = \\frac{m}{${k}}x + \\frac{${k * c + 1}}{${k}}$，斜率为 $\\frac{m}{${k}}$。`,
          ),
          step(
            "Make the lines parallel",
            "令两直线平行",
            `No solution means equal slopes with different intercepts: $\\frac{m}{${k}} = ${a}$, so $m = ${k * a}$.`,
            `无解意味着斜率相等而截距不同：$\\frac{m}{${k}} = ${a}$，所以 $m = ${k * a}$。`,
          ),
        ],
        t(
          `The intercepts are $${c}$ and $\\frac{${k * c + 1}}{${k}} = ${c} + \\frac{1}{${k}}$, which differ, so the parallel lines never meet.`,
          `两截距为 $${c}$ 与 $\\frac{${k * c + 1}}{${k}} = ${c} + \\frac{1}{${k}}$，并不相同，所以两条平行线永不相交。`,
        ),
        [
          t(`This forgets that $y$ has the coefficient $${k}$ in the second equation.`, `这里忘了第二个方程中 $y$ 的系数是 $${k}$。`),
          t(`This adds $${k}$ to the slope instead of multiplying.`, `这里把 $${k}$ 加到斜率上，而不是相乘。`),
          t(`This scales the intercept, not the slope.`, `这里放大的是截距，不是斜率。`),
        ],
      ),
    );
  },
  "Modeling Word Problems With Systems": (rng, hard) => {
    const [p, q] = [rng.int(8, 20), rng.int(3, 7)];
    const [u, v] = [rng.int(20, 90), rng.int(20, 90)];
    if (!hard)
      return ask(
        rng,
        `A theater sold $${u + v}$ tickets. Adult tickets cost $\\$${p}$ and student tickets cost $\\$${q}$, and sales totaled $\\$${p * u + q * v}$. How many adult tickets were sold?`,
        `一家剧院售出 $${u + v}$ 张票。成人票 $\\$${p}$，学生票 $\\$${q}$，总收入 $\\$${p * u + q * v}$。售出多少张成人票？`,
        u,
        [v === u ? u + 1 : v, u + 5, u + v - 5 === u ? u + 7 : u + v - 5],
        worked(
          [
            step(
              "Write one equation",
              "列出方程",
              `Let $a$ be adult tickets, so $${u + v} - a$ are student tickets: $${p}a + ${q}(${u + v} - a) = ${p * u + q * v}$.`,
              `设成人票 $a$ 张，学生票就是 $${u + v} - a$ 张：$${p}a + ${q}(${u + v} - a) = ${p * u + q * v}$。`,
            ),
            step(
              "Solve",
              "求解",
              `$${p - q}a + ${q * (u + v)} = ${p * u + q * v}$, so $${p - q}a = ${(p - q) * u}$ and $a = ${u}$.`,
              `$${p - q}a + ${q * (u + v)} = ${p * u + q * v}$，所以 $${p - q}a = ${(p - q) * u}$，$a = ${u}$。`,
            ),
          ],
          t(
            `$${u}$ adult and $${v}$ student tickets: $${p}(${u}) + ${q}(${v}) = ${p * u} + ${q * v} = ${p * u + q * v}$.`,
            `成人票 $${u}$ 张、学生票 $${v}$ 张：$${p}(${u}) + ${q}(${v}) = ${p * u} + ${q * v} = ${p * u + q * v}$。`,
          ),
          [
            t(`This is the number of student tickets.`, `这是学生票的张数。`),
            t(
              `With this many adult tickets the sales would be $${5 * (p - q)}$ dollars too high.`,
              `成人票是这么多张的话，收入会多出 $${5 * (p - q)}$ 美元。`,
            ),
            t(`With this many adult tickets the sales would not match the total.`, `成人票是这么多张的话，收入与总额不符。`),
          ],
        ),
      );
    return ask(
      rng,
      `A band's merchandise table sells shirts and caps. One sale of $3$ shirts and $2$ caps costs $\\$${3 * p + 2 * q}$, and another of $2$ shirts and $3$ caps costs $\\$${2 * p + 3 * q}$. What is the price of $1$ shirt and $1$ cap together?`,
      `一支乐队的摊位卖衬衫和帽子。一笔 $3$ 件衬衫加 $2$ 顶帽子为 $\\$${3 * p + 2 * q}$，另一笔 $2$ 件衬衫加 $3$ 顶帽子为 $\\$${2 * p + 3 * q}$。$1$ 件衬衫加 $1$ 顶帽子一共多少钱？`,
      p + q,
      [p, q, 5 * p + 5 * q],
      worked(
        [
          step(
            "Add the two sales",
            "两笔相加",
            `$(3s + 2c) + (2s + 3c) = 5s + 5c$, and $${3 * p + 2 * q} + ${2 * p + 3 * q} = ${5 * (p + q)}$.`,
            `$(3s + 2c) + (2s + 3c) = 5s + 5c$，而 $${3 * p + 2 * q} + ${2 * p + 3 * q} = ${5 * (p + q)}$。`,
          ),
          step("Divide by 5", "除以 5", `$s + c = ${5 * (p + q)} \\div 5 = ${p + q}$.`, `$s + c = ${5 * (p + q)} \\div 5 = ${p + q}$。`),
        ],
        t(
          `Subtracting the sales instead gives $s - c = ${p - q}$, so $s = ${p}$ and $c = ${q}$, and $${p} + ${q} = ${p + q}$.`,
          `两笔相减得 $s - c = ${p - q}$，于是 $s = ${p}$，$c = ${q}$，而 $${p} + ${q} = ${p + q}$。`,
        ),
        [
          t(`This is the price of a shirt alone.`, `这只是一件衬衫的价钱。`),
          t(`This is the price of a cap alone.`, `这只是一顶帽子的价钱。`),
          t(`This is $5$ shirts and $5$ caps, before dividing by $5$.`, `这是 $5$ 件衬衫加 $5$ 顶帽子，还没有除以 $5$。`),
        ],
      ),
    );
  },
  "Using a System Solution": (rng, hard) => {
    const [s, d] = [rng.int(4, 20), rng.int(2, 12)];
    if (!hard)
      return ask(
        rng,
        `If $x + y = ${s}$ and $x - y = ${d}$, what is the value of $x^2 - y^2$?`,
        `若 $x + y = ${s}$ 且 $x - y = ${d}$，$x^2 - y^2$ 的值是多少？`,
        s * d,
        [s + d, s * s - d * d, (s - d) * (s - d)],
        worked(
          [
            step("Factor the expression", "因式分解", `$x^2 - y^2 = (x + y)(x - y)$.`, `$x^2 - y^2 = (x + y)(x - y)$。`),
            step("Use the given values", "代入已知值", `$${s} \\times ${d} = ${s * d}$.`, `$${s} \\times ${d} = ${s * d}$。`),
          ],
          t(
            `Solve instead: $x = \\frac{${s + d}}{2}$ and $y = \\frac{${s - d}}{2}$, so $x^2 - y^2 = \\frac{${(s + d) ** 2} - ${(s - d) ** 2}}{4} = ${s * d}$.`,
            `也可以先解：$x = \\frac{${s + d}}{2}$，$y = \\frac{${s - d}}{2}$，所以 $x^2 - y^2 = \\frac{${(s + d) ** 2} - ${(s - d) ** 2}}{4} = ${s * d}$。`,
          ),
          [
            t(`This adds the two factors instead of multiplying them.`, `这里把两个因式相加，而不是相乘。`),
            t(
              `This squares the given values: $(x + y)^2 - (x - y)^2$ is not $x^2 - y^2$.`,
              `这里把已知值平方了：$(x + y)^2 - (x - y)^2$ 不是 $x^2 - y^2$。`,
            ),
            t(`This squares the difference of the given values.`, `这里把已知值之差平方了。`),
          ],
        ),
      );
    const [x, y] = [rng.int(1, 15), rng.int(1, 15)];
    return ask(
      rng,
      `If $2x + y = ${2 * x + y}$ and $x + 2y = ${x + 2 * y}$, what is the value of $x + y$?`,
      `若 $2x + y = ${2 * x + y}$ 且 $x + 2y = ${x + 2 * y}$，$x + y$ 的值是多少？`,
      x + y,
      [3 * (x + y), 2 * (x + y), x + y + 3],
      worked(
        [
          step(
            "Add the equations",
            "两式相加",
            `$(2x + y) + (x + 2y) = 3x + 3y$, and $${2 * x + y} + ${x + 2 * y} = ${3 * (x + y)}$.`,
            `$(2x + y) + (x + 2y) = 3x + 3y$，而 $${2 * x + y} + ${x + 2 * y} = ${3 * (x + y)}$。`,
          ),
          step("Divide by 3", "除以 3", `$x + y = ${3 * (x + y)} \\div 3 = ${x + y}$.`, `$x + y = ${3 * (x + y)} \\div 3 = ${x + y}$。`),
        ],
        t(
          `Subtracting the equations gives $x - y = ${x - y}$, so $x = ${x}$ and $y = ${y}$, and $${x} + ${y} = ${x + y}$.`,
          `两式相减得 $x - y = ${x - y}$，于是 $x = ${x}$，$y = ${y}$，而 $${x} + ${y} = ${x + y}$。`,
        ),
        [
          t(`This is $3x + 3y$, before dividing by $3$.`, `这是 $3x + 3y$，还没有除以 $3$。`),
          t(`This is $2(x + y)$, twice the value asked for.`, `这是 $2(x + y)$，是所求值的两倍。`),
          t(`This adds $3$ instead of dividing by it.`, `这里加了 $3$，而不是除以 $3$。`),
        ],
      ),
    );
  },
};
