import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import type { ExamSpec } from "../exam.ts";
import { mc, sg, spr, x } from "../exam.ts";

// SAT Math Prep, Algebra: linear equations, word problems, two-variable models and linear functions.

/** satExamAlgebra1 are the exam-style questions of the first modules of the SAT Algebra unit. */
export const satExamAlgebra1: ExamSpec[] = [
  x(
    "Evaluating Expressions",
    "求代数式的值",
    ["evaluating-expressions"],
    t(
      "The exam often gives one value and asks for an expression. Substitute carefully and follow the order of operations, since the wrong options come from slips in that order.",
      "考试常给出一个值，要求求代数式的值。仔细代入并遵守运算顺序，因为错误选项正是来自这些顺序上的失误。",
    ),
    t(
      "Harder questions give an equation first. Look for the expression inside the equation, because you often need it as a whole and never need the variable itself.",
      "较难的题先给一个方程。要在方程中寻找所求的式子，因为往往只需要它的整体，而无需求出变量本身。",
    ),
    (rng, hard) => {
      const a = rng.int(2, 6);
      const c = rng.int(2, 9);
      if (!hard) {
        const v = rng.int(2, 6);
        const b = rng.int(2, 5);
        const ans = b * v * v - c;
        return mc(
          rng,
          t(`What is the value of $${b}x^2 - ${c}$ when $x = ${v}$?`, `当 $x = ${v}$ 时，$${b}x^2 - ${c}$ 的值是多少？`),
          ans,
          [(b * v) ** 2 - c, 2 * b * v - c, b * v * v + c],
          t(
            `Square first, then multiply, then subtract: $${b}(${v})^2 - ${c} = ${b}(${v * v}) - ${c} = ${ans}$.`,
            `先平方，再相乘，最后相减：$${b}(${v})^2 - ${c} = ${b}(${v * v}) - ${c} = ${ans}$。`,
          ),
        );
      }
      const v = rng.int(2, 7);
      const k = rng.int(2, 4);
      const d = rng.int(1, 9);
      const lhs = a * v - c;
      const ans = k * lhs + d;
      return mc(
        rng,
        t(
          `If $${a}x - ${c} = ${lhs}$, what is the value of $${k * a}x - ${k * c} ${sg(d)}$?`,
          `若 $${a}x - ${c} = ${lhs}$，则 $${k * a}x - ${k * c} ${sg(d)}$ 的值是多少？`,
        ),
        ans,
        [k * lhs, lhs + d, k * a * v + d],
        t(
          `The expression $${k * a}x - ${k * c}$ is $${k}$ times $${a}x - ${c}$, so it equals $${k}(${lhs}) = ${k * lhs}$. Adding $${d}$ gives $${ans}$, without solving for $x$.`,
          `式子 $${k * a}x - ${k * c}$ 是 $${a}x - ${c}$ 的 $${k}$ 倍，所以等于 $${k}(${lhs}) = ${k * lhs}$。再加 $${d}$ 得 $${ans}$，无需解出 $x$。`,
        ),
      );
    },
  ),
  x(
    "Solving One-Step Addition Equations",
    "解一步加减方程",
    ["one-step-equations-addition"],
    t(
      "These questions rarely stop at the variable. Solve for it, then read the question again, since it may ask for a related quantity instead.",
      "这类题很少只问变量。先解出变量，再重读题目，因为它可能问的是相关的另一个量。",
    ),
    t(
      "In harder questions the number is hidden in a context. Write the one-step equation that the sentence describes before you compute anything.",
      "较难的题把数字藏在情境里。先写出句子描述的一步方程，再进行计算。",
    ),
    (rng, hard) => {
      const a = rng.int(6, 40);
      const b = rng.int(45, 120);
      const k = rng.int(2, 9);
      if (!hard) {
        const ans = b - a + k;
        return mc(
          rng,
          t(`If $x + ${a} = ${b}$, what is the value of $x + ${a + k}$?`, `若 $x + ${a} = ${b}$，则 $x + ${a + k}$ 的值是多少？`),
          b + k,
          [ans, b - a, b + a + k],
          t(
            `$x + ${a + k}$ is $${k}$ more than $x + ${a}$, so its value is $${b} + ${k} = ${b + k}$.`,
            `$x + ${a + k}$ 比 $x + ${a}$ 大 $${k}$，所以它的值是 $${b} + ${k} = ${b + k}$。`,
          ),
        );
      }
      const ans = b - a;
      return spr(
        t(
          `A tank held some water. After $${a}$ liters were added, it held $${b}$ liters. Then $${k}$ liters were removed. How many liters more does the tank hold now than it held at the start?`,
          `水箱里原有一些水。加入 $${a}$ 升后，水箱有 $${b}$ 升。然后又放出 $${k}$ 升。现在水箱里的水比最初多多少升？`,
        ),
        a - k,
        [ans, ans - k, a + k],
        t(
          `The start $s$ satisfies $s + ${a} = ${b}$, so $s = ${ans}$. Now the tank holds $${b} - ${k} = ${b - k}$ liters, which is $${b - k} - ${ans} = ${a - k}$ liters more.`,
          `设最初为 $s$，则 $s + ${a} = ${b}$，所以 $s = ${ans}$。现在水箱有 $${b} - ${k} = ${b - k}$ 升，比最初多 $${b - k} - ${ans} = ${a - k}$ 升。`,
        ),
      );
    },
  ),
  x(
    "Solving One-Step Multiplication Equations",
    "解一步乘除方程",
    ["one-step-equations-multiplication"],
    t(
      "Divide both sides by the coefficient, then answer what is asked. Questions often ask for a multiple of the variable, which you can reach by scaling the equation directly.",
      "两边除以系数，再回答所问。题目常问变量的某个倍数，可以直接把方程按比例缩放得到。",
    ),
    t(
      "A fractional coefficient is cleared by multiplying by its reciprocal. Keep the numbers as fractions until the last step to avoid rounding.",
      "分数系数用乘以其倒数来消去。最后一步之前都保留分数，以免产生舍入误差。",
    ),
    (rng, hard) => {
      const a = rng.int(3, 9);
      const v = rng.int(3, 15);
      if (!hard) {
        const k = rng.int(2, 5);
        return mc(
          rng,
          t(`If $${a}x = ${a * v}$, what is the value of $${k * a}x$?`, `若 $${a}x = ${a * v}$，则 $${k * a}x$ 的值是多少？`),
          k * a * v,
          [v, k * v, a * v + k],
          t(
            `$${k * a}x$ is $${k}$ times $${a}x$, so it equals $${k}(${a * v}) = ${k * a * v}$.`,
            `$${k * a}x$ 是 $${a}x$ 的 $${k}$ 倍，所以等于 $${k}(${a * v}) = ${k * a * v}$。`,
          ),
        );
      }
      const d = rng.pick([3, 4, 5, 7]);
      const n = rng.int(2, d - 1);
      const m = rng.int(2, 8);
      const ans = d * m;
      return spr(
        t(`If $\\frac{${n}}{${d}}x = ${n * m}$, what is the value of $x$?`, `若 $\\frac{${n}}{${d}}x = ${n * m}$，则 $x$ 的值是多少？`),
        ans,
        [n * m * n, m, Q.of(n * m * n, d)],
        t(
          `Multiply both sides by the reciprocal $\\frac{${d}}{${n}}$: $x = ${n * m} \\cdot \\frac{${d}}{${n}} = ${ans}$.`,
          `两边同乘倒数 $\\frac{${d}}{${n}}$：$x = ${n * m} \\cdot \\frac{${d}}{${n}} = ${ans}$。`,
        ),
      );
    },
  ),
  x(
    "Solving Multistep Linear Equations",
    "解多步一次方程",
    ["equations-with-variables-on-both-sides"],
    t(
      "Collect variable terms on one side and constants on the other. Check your value in the original equation when you have time, because sign errors produce the wrong options.",
      "把变量项移到一边，常数移到另一边。有时间就把结果代回原方程检验，因为符号错误正好产生错误选项。",
    ),
    t(
      "Harder questions ask for an expression at the solution, so finish the equation and then evaluate. Do not stop at the value of the variable.",
      "较难的题要求解处某式子的值，所以解完方程后还要求值。不要停在变量的值上。",
    ),
    (rng, hard) => {
      const v = rng.int(2, 9);
      const a = rng.int(5, 9);
      const c = rng.int(2, a - 1);
      const b = rng.int(2, 15);
      const d = (a - c) * v + b;
      const eq = `${a}x + ${b} = ${c}x + ${d}`;
      if (!hard)
        return mc(
          rng,
          t(`What value of $x$ satisfies $${eq}$?`, `哪个 $x$ 的值满足 $${eq}$？`),
          v,
          [Q.of(d + b, a - c), Q.of(d - b, a + c), v + 1],
          t(
            `Subtract $${c}x$ and $${b}$ from both sides: $${a - c}x = ${d - b}$, so $x = ${v}$.`,
            `两边同减 $${c}x$ 和 $${b}$：$${a - c}x = ${d - b}$，所以 $x = ${v}$。`,
          ),
        );
      const k = rng.int(2, 6);
      const ans = k * v - 1;
      return spr(
        t(`If $${eq}$, what is the value of $${k}x - 1$?`, `若 $${eq}$，则 $${k}x - 1$ 的值是多少？`),
        ans,
        [v, k * v, k * (v - 1)],
        t(
          `Subtract $${c}x$ and $${b}$: $${a - c}x = ${d - b}$, so $x = ${v}$. Then $${k}(${v}) - 1 = ${ans}$.`,
          `两边同减 $${c}x$ 和 $${b}$：$${a - c}x = ${d - b}$，所以 $x = ${v}$。于是 $${k}(${v}) - 1 = ${ans}$。`,
        ),
      );
    },
  ),
  x(
    "Solving Equations With Fractional Coefficients",
    "解分数系数方程",
    ["solving-linear-equations-with-fractional-coefficients"],
    t(
      "Multiply every term by the common denominator first, which removes the fractions in one step and leaves an ordinary linear equation.",
      "先把每一项都乘以公分母，一步消去分数，留下普通的一次方程。",
    ),
    t(
      "When the variable appears on both sides with different denominators, use the least common multiple and multiply every term, including the constants.",
      "当变量在两边且分母不同时，用最小公倍数，并且每一项都要乘，包括常数项。",
    ),
    (rng, hard) => {
      const d = rng.pick([2, 3, 4, 5]);
      const v = d * rng.int(2, 8);
      const b = rng.int(1, 9);
      if (!hard) {
        const r = v / d + b;
        return mc(
          rng,
          t(`If $\\frac{x}{${d}} + ${b} = ${r}$, what is the value of $x$?`, `若 $\\frac{x}{${d}} + ${b} = ${r}$，则 $x$ 的值是多少？`),
          v,
          [r * d, r - b, (r + b) * d],
          t(
            `Subtract $${b}$: $\\frac{x}{${d}} = ${r - b}$. Multiply by $${d}$: $x = ${v}$.`,
            `减去 $${b}$：$\\frac{x}{${d}} = ${r - b}$。乘以 $${d}$：$x = ${v}$。`,
          ),
        );
      }
      const [p, q] = rng.pick([
        [3, 4],
        [2, 3],
        [2, 5],
        [3, 5],
        [4, 5],
      ] as const);
      const k = rng.int(1, 6);
      const w = p * q * k;
      const c = k * (q - p);
      return mc(
        rng,
        t(
          `If $\\frac{x}{${p}} = \\frac{x}{${q}} + ${c}$, what is the value of $x$?`,
          `若 $\\frac{x}{${p}} = \\frac{x}{${q}} + ${c}$，则 $x$ 的值是多少？`,
        ),
        w,
        [(p + q) * c, c, p * c],
        t(
          `Multiply every term by $${p * q}$: $${q}x = ${p}x + ${p * q * c}$. Subtract $${p}x$: $${q - p}x = ${p * q * c}$, so $x = ${w}$.`,
          `每一项乘以 $${p * q}$：$${q}x = ${p}x + ${p * q * c}$。减去 $${p}x$：$${q - p}x = ${p * q * c}$，所以 $x = ${w}$。`,
        ),
      );
    },
  ),
  x(
    "Solving Linear Equations Containing Binomials",
    "解含二项式的一次方程",
    ["equations-with-parentheses"],
    t(
      "Distribute carefully before collecting terms. A negative sign outside the parentheses changes every term inside, and that slip is one of the listed options.",
      "合并同类项之前先仔细去括号。括号外的负号会改变括号内每一项的符号，这种失误就是选项之一。",
    ),
    t(
      "With two binomials, distribute both and only then collect terms. The harder form subtracts a binomial, so the second constant changes sign.",
      "有两个二项式时，先都展开再合并同类项。较难的形式是减去一个二项式，所以第二个常数要变号。",
    ),
    (rng, hard) => {
      const a = rng.int(2, 6);
      const v = rng.int(2, 9);
      const b = rng.int(1, 8);
      if (!hard) {
        const r = a * (v + b);
        return mc(
          rng,
          t(`If $${a}(x + ${b}) = ${r}$, what is the value of $x + ${b}$?`, `若 $${a}(x + ${b}) = ${r}$，则 $x + ${b}$ 的值是多少？`),
          v + b,
          [v, r - b, r],
          t(
            `Divide both sides by $${a}$. The quantity $x + ${b}$ can be kept whole: $x + ${b} = ${v + b}$.`,
            `两边除以 $${a}$。可以把 $x + ${b}$ 看作整体：$x + ${b} = ${v + b}$。`,
          ),
        );
      }
      const c = rng.int(2, a + 1);
      const d = rng.int(1, 8);
      const sub = c + rng.int(1, 3);
      const value = a * (v + b) + sub * v - c * (v - d);
      return mc(
        rng,
        t(
          `What value of $x$ satisfies $${a}(x + ${b}) + ${sub}x - ${c}(x - ${d}) = ${value}$?`,
          `哪个 $x$ 的值满足 $${a}(x + ${b}) + ${sub}x - ${c}(x - ${d}) = ${value}$？`,
        ),
        v,
        [Q.of(value - a * b + c * d, a + sub - c), Q.of(value - a * b - c * d, a + sub + c), v + 2],
        t(
          `Distribute: $${a}x + ${a * b} + ${sub}x - ${c}x + ${c * d} = ${value}$. Collect terms: $${a + sub - c}x + ${a * b + c * d} = ${value}$, so $${a + sub - c}x = ${value - a * b - c * d}$ and $x = ${v}$.`,
          `展开：$${a}x + ${a * b} + ${sub}x - ${c}x + ${c * d} = ${value}$。合并：$${a + sub - c}x + ${a * b + c * d} = ${value}$，所以 $${a + sub - c}x = ${value - a * b - c * d}$，$x = ${v}$。`,
        ),
      );
    },
  ),
];
