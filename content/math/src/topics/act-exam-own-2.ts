import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import type { ExamSpec } from "../exam.ts";
import { cx, par, sg, step, table, tx, words, worked } from "../exam.ts";
import { curvePlot, lineFigure } from "../exam-figures.ts";
import { ask } from "./act-exam-kit.ts";

// ACT Math Prep, questions of its own for the topics it shares with SAT Math Prep: quadratics, polynomials, rational and radical equations, models and functions.

const lin = (a: number, b: number): string => `${cx(a)} ${sg(b)}`.trim();
const quad = (a: number, b: number, c: number): string => `${cx(a, "x^2")} ${tx(b)} ${sg(c)}`.trim();
const fac = (r: number): string => (r === 0 ? "x" : `(x ${sg(-r)})`);

/** actOwnAlgebra2 are the question generators of ACT topics on quadratics, polynomials, rational and radical equations, models and functions, by title. */
export const actOwnAlgebra2: Record<string, ExamSpec["make"]> = {
  "Factoring Quadratic Expressions": (rng, hard) => {
    const [p, q] = [rng.int(1, 9), rng.int(10, 15)];
    if (!hard)
      return ask(
        rng,
        `Which of the following is a factor of $${quad(1, q - p, -p * q)}$?`,
        `下列哪一项是 $${quad(1, q - p, -p * q)}$ 的因式？`,
        `x - ${p}`,
        [`x + ${p}`, `x - ${q}`, `x + ${p + q}`],
        worked(
          [
            step(
              "Find the two numbers",
              "找出两个数",
              `They must multiply to $${-p * q}$ and add to $${q - p}$: $${q}$ and $${-p}$ work, since $${q}(${-p}) = ${-p * q}$ and $${q} + (${-p}) = ${q - p}$.`,
              `它们的积为 $${-p * q}$，和为 $${q - p}$：$${q}$ 与 $${-p}$ 满足，因为 $${q}(${-p}) = ${-p * q}$，$${q} + (${-p}) = ${q - p}$。`,
            ),
            step(
              "Write the factors",
              "写出因式",
              `$${quad(1, q - p, -p * q)} = (x + ${q})(x - ${p})$, so $x - ${p}$ is a factor.`,
              `$${quad(1, q - p, -p * q)} = (x + ${q})(x - ${p})$，所以 $x - ${p}$ 是因式。`,
            ),
          ],
          t(
            `At $x = ${p}$ the expression is $${p * p} + ${(q - p) * p} - ${p * q} = 0$, so $x - ${p}$ divides it.`,
            `$x = ${p}$ 时式子为 $${p * p} + ${(q - p) * p} - ${p * q} = 0$，所以 $x - ${p}$ 整除它。`,
          ),
          [
            t(
              `This has the sign of $${p}$ reversed: $(x + ${q})(x + ${p})$ has a $+${p * q}$ constant.`,
              `这里 $${p}$ 的符号反了：$(x + ${q})(x + ${p})$ 的常数项是 $+${p * q}$。`,
            ),
            t(
              `This has the sign of $${q}$ reversed: the factor with $${q}$ is $x + ${q}$.`,
              `这里 $${q}$ 的符号反了：含 $${q}$ 的因式是 $x + ${q}$。`,
            ),
            t(`This adds the two numbers; a factor holds one of them.`, `这里把两个数相加了；每个因式只含其中一个。`),
          ],
        ),
      );
    const a = rng.pick([2, 3, 5]);
    return ask(
      rng,
      `For all $x$, $${quad(a, a * p + q, p * q)}$ can be written as $(${a}x + m)(x + n)$ for integers $m$ and $n$. What is $m + n$?`,
      `对所有 $x$，$${quad(a, a * p + q, p * q)}$ 可写成 $(${a}x + m)(x + n)$，$m$、$n$ 为整数。$m + n$ 是多少？`,
      p + q,
      [p * q, a + p + q, q - p],
      worked(
        [
          step(
            "Expand the form",
            "展开所给形式",
            `$(${a}x + m)(x + n) = ${a}x^2 + (${a}n + m)x + mn$, so $${a}n + m = ${a * p + q}$ and $mn = ${p * q}$.`,
            `$(${a}x + m)(x + n) = ${a}x^2 + (${a}n + m)x + mn$，所以 $${a}n + m = ${a * p + q}$，$mn = ${p * q}$。`,
          ),
          step(
            "Find m and n",
            "求 m 和 n",
            `$n = ${p}$ and $m = ${q}$ fit: $${a}(${p}) + ${q} = ${a * p + q}$ and $${q}(${p}) = ${p * q}$. So $m + n = ${p + q}$.`,
            `$n = ${p}$，$m = ${q}$ 满足：$${a}(${p}) + ${q} = ${a * p + q}$，$${q}(${p}) = ${p * q}$。所以 $m + n = ${p + q}$。`,
          ),
        ],
        t(
          `Multiply back: $(${a}x + ${q})(x + ${p}) = ${a}x^2 + ${a * p}x + ${q}x + ${p * q} = ${quad(a, a * p + q, p * q)}$.`,
          `乘回去：$(${a}x + ${q})(x + ${p}) = ${a}x^2 + ${a * p}x + ${q}x + ${p * q} = ${quad(a, a * p + q, p * q)}$。`,
        ),
        [
          t(`This is $mn$, the constant term, not $m + n$.`, `这是 $mn$，即常数项，不是 $m + n$。`),
          t(`This also adds the leading coefficient $${a}$.`, `这里把首项系数 $${a}$ 也加进去了。`),
          t(`This is $m - n$, not $m + n$.`, `这是 $m - n$，不是 $m + n$。`),
        ],
      ),
    );
  },
  "Using Factors of a Quadratic": (rng, hard) => {
    const r = rng.int(-9, -1);
    const s = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((v) => v !== -r));
    if (!hard)
      return ask(
        rng,
        `The product $${fac(r)}${fac(s)}$ equals $0$ for which values of $x$?`,
        `$x$ 取何值时，乘积 $${fac(r)}${fac(s)}$ 等于 $0$？`,
        `${r} \\text{ and } ${s}`,
        [`${-r} \\text{ and } ${-s}`, `${r} \\text{ and } ${-s}`, `${-r} \\text{ and } ${s}`],
        worked(
          [
            step(
              "Use the zero product property",
              "用零积性质",
              `A product is $0$ exactly when one of its factors is $0$.`,
              `乘积为 $0$ 当且仅当其中某个因式为 $0$。`,
            ),
            step(
              "Solve each factor",
              "令每个因式为零",
              `$x ${sg(-r)} = 0$ gives $x = ${r}$, and $x ${sg(-s)} = 0$ gives $x = ${s}$.`,
              `$x ${sg(-r)} = 0$ 得 $x = ${r}$，$x ${sg(-s)} = 0$ 得 $x = ${s}$。`,
            ),
          ],
          t(
            `At $x = ${r}$ the first factor is $${r} ${sg(-r)} = 0$, and at $x = ${s}$ the second is $${s} - ${s} = 0$.`,
            `$x = ${r}$ 时第一个因式为 $${r} ${sg(-r)} = 0$，$x = ${s}$ 时第二个因式为 $${s} - ${s} = 0$。`,
          ),
          [
            t(
              `These take the numbers in the factors as they are written; both signs must change.`,
              `这是直接照抄因式里的数；两个符号都要变。`,
            ),
            t(`This changes the sign for only the first factor's zero, not the second.`, `这里只有第一个零点没变号，第二个却变了号。`),
            t(
              `This keeps the sign of the first factor's number; $x ${sg(-r)} = 0$ means $x = ${r}$.`,
              `这里第一个因式的数没有变号；$x ${sg(-r)} = 0$ 表示 $x = ${r}$。`,
            ),
          ],
        ),
      );
    return ask(
      rng,
      `If $x - ${s}$ is a factor of $x^2 + kx ${sg(r * s)}$, what is the value of $k$?`,
      `若 $x - ${s}$ 是 $x^2 + kx ${sg(r * s)}$ 的因式，$k$ 的值是多少？`,
      -(r + s),
      [r + s, r, r * s],
      worked(
        [
          step(
            "Find the other factor",
            "求另一个因式",
            `The constants of the two factors multiply to $${r * s}$, and $-${s} \\times ${-r} = ${r * s}$, so the other factor is $x ${sg(-r)}$.`,
            `两个因式的常数之积为 $${r * s}$，而 $-${s} \\times ${-r} = ${r * s}$，所以另一个因式是 $x ${sg(-r)}$。`,
          ),
          step(
            "Add the x terms",
            "把 x 项相加",
            `$(x - ${s})(x ${sg(-r)})$ has $x$ terms $-${s}x ${sg(-r, "x")}$, so $k = ${-(r + s)}$.`,
            `$(x - ${s})(x ${sg(-r)})$ 的 $x$ 项为 $-${s}x ${sg(-r, "x")}$，所以 $k = ${-(r + s)}$。`,
          ),
        ],
        t(
          `At $x = ${s}$: $${s * s} + (${-(r + s)})(${s}) ${sg(r * s)} = ${s * s - (r + s) * s + r * s}$, so $x - ${s}$ is a factor.`,
          `$x = ${s}$ 时：$${s * s} + (${-(r + s)})(${s}) ${sg(r * s)} = ${s * s - (r + s) * s + r * s}$，所以 $x - ${s}$ 是因式。`,
        ),
        [
          t(
            `This is the sum of the zeros with the sign not changed; the $x$ coefficient is minus that sum.`,
            `这是两个零点之和，没有变号；$x$ 的系数是这个和的相反数。`,
          ),
          t(`This is the other zero, not the $x$ coefficient.`, `这是另一个零点，不是 $x$ 的系数。`),
          t(`This is the constant term of the quadratic.`, `这是二次式的常数项。`),
        ],
      ),
    );
  },
  "Solving Perfect Square Equations": (rng, hard) => {
    const [h, k] = [rng.int(1, 9), rng.int(2, 11)];
    if (!hard)
      return ask(
        rng,
        `What is the greater of the two solutions of $(x - ${h})^2 = ${k * k}$?`,
        `$(x - ${h})^2 = ${k * k}$ 的两个解中，较大的是多少？`,
        h + k,
        [h - k, k, h + k * k],
        worked(
          [
            step(
              "Take both square roots",
              "两边开方",
              `$x - ${h} = ${k}$ or $x - ${h} = -${k}$.`,
              `$x - ${h} = ${k}$ 或 $x - ${h} = -${k}$。`,
            ),
            step(
              "Solve and compare",
              "求解并比较",
              `$x = ${h + k}$ or $x = ${h - k}$, and the greater is $${h + k}$.`,
              `$x = ${h + k}$ 或 $x = ${h - k}$，较大的是 $${h + k}$。`,
            ),
          ],
          t(`$(${h + k} - ${h})^2 = ${k}^2 = ${k * k}$.`, `$(${h + k} - ${h})^2 = ${k}^2 = ${k * k}$。`),
          [
            t(`This is the smaller solution.`, `这是较小的解。`),
            t(`This is the square root alone, before adding $${h}$.`, `这只是平方根，还没有加上 $${h}$。`),
            t(`This adds $${k * k}$ without taking its square root.`, `这里加的是 $${k * k}$，没有开平方。`),
          ],
        ),
      );
    return ask(
      rng,
      `What is the sum of the solutions of $x^2 ${tx(-2 * h)} + ${h * h} = ${k * k}$?`,
      `$x^2 ${tx(-2 * h)} + ${h * h} = ${k * k}$ 的两个解之和是多少？`,
      2 * h,
      [2 * k, h + k, -2 * h],
      worked(
        [
          step(
            "Spot the perfect square",
            "看出完全平方",
            `$x^2 ${tx(-2 * h)} + ${h * h} = (x - ${h})^2$, so the equation is $(x - ${h})^2 = ${k * k}$.`,
            `$x^2 ${tx(-2 * h)} + ${h * h} = (x - ${h})^2$，所以方程为 $(x - ${h})^2 = ${k * k}$。`,
          ),
          step(
            "Solve and add",
            "求解并相加",
            `$x = ${h} + ${k} = ${h + k}$ or $x = ${h} - ${k} = ${h - k}$, and $${h + k} + ${par(h - k)} = ${2 * h}$.`,
            `$x = ${h} + ${k} = ${h + k}$ 或 $x = ${h} - ${k} = ${h - k}$，而 $${h + k} + ${par(h - k)} = ${2 * h}$。`,
          ),
        ],
        t(
          `Written as $x^2 ${tx(-2 * h)} ${sg(h * h - k * k)} = 0$, the solutions add to minus the $x$ coefficient, $${2 * h}$.`,
          `写成 $x^2 ${tx(-2 * h)} ${sg(h * h - k * k)} = 0$，两解之和等于 $x$ 系数的相反数 $${2 * h}$。`,
        ),
        [
          t(`This adds the two square roots $\\pm ${k}$ as if both were positive.`, `这里把 $\\pm ${k}$ 都当成正数相加了。`),
          t(`This is only the greater solution.`, `这只是较大的那个解。`),
          t(`This has the wrong sign: the solutions are centered at $+${h}$.`, `符号错了：两个解以 $+${h}$ 为中心。`),
        ],
      ),
    );
  },
  "Solving Quadratic Equations by Factoring": (rng, hard) => {
    const [r, s] = [rng.int(1, 9), rng.int(10, 14)];
    if (!hard)
      return ask(
        rng,
        `What is the positive solution of $x^2 ${tx(s - r)} = ${r * s}$?`,
        `$x^2 ${tx(s - r)} = ${r * s}$ 的正数解是多少？`,
        r,
        [s, r + s, s - r],
        worked(
          [
            step("Set it equal to zero", "化为等于零", `$x^2 ${tx(s - r)} - ${r * s} = 0$.`, `$x^2 ${tx(s - r)} - ${r * s} = 0$。`),
            step(
              "Factor and solve",
              "分解并求解",
              `$${s}$ and $-${r}$ multiply to $-${r * s}$ and add to $${s - r}$: $(x + ${s})(x - ${r}) = 0$, so $x = -${s}$ or $x = ${r}$, and the positive one is $${r}$.`,
              `$${s}$ 与 $-${r}$ 的积为 $-${r * s}$，和为 $${s - r}$：$(x + ${s})(x - ${r}) = 0$，所以 $x = -${s}$ 或 $x = ${r}$，正数解是 $${r}$。`,
            ),
          ],
          t(`$${r * r} + ${(s - r) * r} = ${r * s}$.`, `$${r * r} + ${(s - r) * r} = ${r * s}$。`),
          [
            t(`This drops the sign of the negative solution $-${s}$.`, `这里把负数解 $-${s}$ 的符号丢掉了。`),
            t(`This adds the two numbers from the factoring.`, `这里把分解时的两个数相加了。`),
            t(`This is the $x$ coefficient, not a solution.`, `这是 $x$ 的系数，不是解。`),
          ],
        ),
      );
    const w = r;
    const l = w + s;
    return ask(
      rng,
      `A rectangle's length is $${s}$ feet more than its width, and its area is $${w * l}$ square feet. What is its width, in feet?`,
      `一个长方形的长比宽多 $${s}$ 英尺，面积为 $${w * l}$ 平方英尺。宽是多少英尺？`,
      w,
      [l, w + 1, 2 * (w + l)],
      worked(
        [
          step(
            "Write the equation",
            "列方程",
            `With width $w$ the length is $w + ${s}$, so $w(w + ${s}) = ${w * l}$, or $w^2 + ${s}w - ${w * l} = 0$.`,
            `设宽为 $w$，长为 $w + ${s}$，所以 $w(w + ${s}) = ${w * l}$，即 $w^2 + ${s}w - ${w * l} = 0$。`,
          ),
          step(
            "Factor and keep the positive root",
            "分解并取正根",
            `$(w - ${w})(w + ${l}) = 0$, so $w = ${w}$ or $w = -${l}$. A length is positive, so $w = ${w}$.`,
            `$(w - ${w})(w + ${l}) = 0$，所以 $w = ${w}$ 或 $w = -${l}$。长度为正，所以 $w = ${w}$。`,
          ),
        ],
        t(
          `The length is $${w} + ${s} = ${l}$, and $${w} \\times ${l} = ${w * l}$.`,
          `长为 $${w} + ${s} = ${l}$，而 $${w} \\times ${l} = ${w * l}$。`,
        ),
        [
          t(`This is the length, not the width.`, `这是长，不是宽。`),
          t(`With this width the area would be $${(w + 1) * (l + 1)}$.`, `宽是这个值的话，面积是 $${(w + 1) * (l + 1)}$。`),
          t(`This is the perimeter, not the width.`, `这是周长，不是宽。`),
        ],
      ),
    );
  },
  "Applying the Quadratic Formula": (rng, hard) => {
    const a = rng.pick([1, 2, 3]);
    const b = rng.pick([1, 3, 5, 7, 9]);
    const c = -rng.int(1, 6);
    const disc = b * b - 4 * a * c;
    if (!hard)
      return ask(
        rng,
        `What are the solutions of $${quad(a, b, c)} = 0$?`,
        `$${quad(a, b, c)} = 0$ 的解是什么？`,
        `\\frac{${-b} \\pm \\sqrt{${disc}}}{${2 * a}}`,
        [
          `\\frac{${b} \\pm \\sqrt{${disc}}}{${2 * a}}`,
          `\\frac{${-b} \\pm \\sqrt{${b * b + 4 * a * c}}}{${2 * a}}`,
          `\\frac{${-b} \\pm \\sqrt{${disc}}}{${a + 7}}`,
        ],
        worked(
          [
            step(
              "Read the coefficients",
              "读出系数",
              `$a = ${a}$, $b = ${b}$ and $c = ${c}$ in $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$.`,
              `在 $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$ 中，$a = ${a}$，$b = ${b}$，$c = ${c}$。`,
            ),
            step(
              "Compute the discriminant",
              "计算判别式",
              `$b^2 - 4ac = ${b * b} - 4(${a})(${c}) = ${b * b} + ${-4 * a * c} = ${disc}$.`,
              `$b^2 - 4ac = ${b * b} - 4(${a})(${c}) = ${b * b} + ${-4 * a * c} = ${disc}$。`,
            ),
            step(
              "Assemble the formula",
              "代入公式",
              `$x = \\frac{${-b} \\pm \\sqrt{${disc}}}{${2 * a}}$.`,
              `$x = \\frac{${-b} \\pm \\sqrt{${disc}}}{${2 * a}}$。`,
            ),
          ],
          t(
            `The two solutions add to $\\frac{${-2 * b}}{${2 * a}} = -\\frac{b}{a}$, as they must for $${quad(a, b, c)}$.`,
            `两解之和为 $\\frac{${-2 * b}}{${2 * a}} = -\\frac{b}{a}$，符合 $${quad(a, b, c)}$ 的要求。`,
          ),
          [
            t(`This uses $b$ instead of $-b$ in front of the root.`, `这里根号前用了 $b$，而不是 $-b$。`),
            t(
              `This adds $4ac$ instead of subtracting it; with $c$ negative, $-4ac$ is positive.`,
              `这里加上了 $4ac$ 而不是减去；$c$ 为负时，$-4ac$ 是正数。`,
            ),
            t(`The denominator is $2a = ${2 * a}$.`, `分母应是 $2a = ${2 * a}$。`),
          ],
        ),
      );
    const [p, q] = [rng.int(2, 9), rng.int(2, 13)];
    const big = p * q;
    return ask(
      rng,
      `The solutions of $x^2 - ${2 * p}x ${sg(p * p - q)} = 0$ can be written as $${p} \\pm \\sqrt{n}$. What is $n$?`,
      `$x^2 - ${2 * p}x ${sg(p * p - q)} = 0$ 的解可写成 $${p} \\pm \\sqrt{n}$。$n$ 是多少？`,
      q,
      [4 * q, big, 2 * q],
      worked(
        [
          step(
            "Compute the discriminant",
            "计算判别式",
            `$b^2 - 4ac = ${4 * p * p} - 4(${p * p - q}) = ${4 * q}$.`,
            `$b^2 - 4ac = ${4 * p * p} - 4(${p * p - q}) = ${4 * q}$。`,
          ),
          step(
            "Simplify the formula",
            "化简公式",
            `$x = \\frac{${2 * p} \\pm \\sqrt{${4 * q}}}{2} = ${p} \\pm \\frac{\\sqrt{${4 * q}}}{2} = ${p} \\pm \\sqrt{${q}}$, since $\\sqrt{${4 * q}} = 2\\sqrt{${q}}$. So $n = ${q}$.`,
            `$x = \\frac{${2 * p} \\pm \\sqrt{${4 * q}}}{2} = ${p} \\pm \\frac{\\sqrt{${4 * q}}}{2} = ${p} \\pm \\sqrt{${q}}$，因为 $\\sqrt{${4 * q}} = 2\\sqrt{${q}}$。所以 $n = ${q}$。`,
          ),
        ],
        t(
          `Complete the square instead: $(x - ${p})^2 = ${p * p} - (${p * p - q}) = ${q}$, so $x = ${p} \\pm \\sqrt{${q}}$.`,
          `也可以配方：$(x - ${p})^2 = ${p * p} - (${p * p - q}) = ${q}$，所以 $x = ${p} \\pm \\sqrt{${q}}$。`,
        ),
        [
          t(
            `This is the whole discriminant; it must still be divided by $2^2$ to sit next to $${p}$.`,
            `这是整个判别式；要放在 $${p}$ 旁边，还得除以 $2^2$。`,
          ),
          t(`This multiplies $${p}$ and $${q}$, which has no place in the formula.`, `这里把 $${p}$ 与 $${q}$ 相乘了，公式里没有这一步。`),
          t(`This halves the discriminant instead of halving its square root.`, `这里把判别式减半了，而应把它的平方根减半。`),
        ],
      ),
    );
  },
  "Using the Discriminant": (rng, hard) => {
    const [a, b, k] = [rng.int(1, 4), rng.int(2, 9), rng.int(1, 8)];
    if (!hard) {
      const kind = rng.int(0, 2);
      const c = kind === 0 ? b * b : kind === 1 ? b * b - k : b * b + k;
      const many = t("Exactly 1 real solution", "恰有 1 个实数解");
      const two = t("Exactly 2 real solutions", "恰有 2 个实数解");
      const none = t("No real solutions", "没有实数解");
      const three = t("Infinitely many real solutions", "有无穷多个实数解");
      const answer = kind === 0 ? many : kind === 1 ? two : none;
      const d = 4 * b * b - 4 * c;
      return words(
        rng,
        t(`How many real solutions does $x^2 ${tx(2 * b)} ${sg(c)} = 0$ have?`, `$x^2 ${tx(2 * b)} ${sg(c)} = 0$ 有多少个实数解？`),
        answer,
        [many, two, none, three].filter((o) => o !== answer),
        worked(
          [
            step(
              "Compute the discriminant",
              "计算判别式",
              `$b^2 - 4ac = ${2 * b}^2 - 4(1)(${c}) = ${4 * b * b} ${sg(-4 * c)} = ${d}$.`,
              `$b^2 - 4ac = ${2 * b}^2 - 4(1)(${c}) = ${4 * b * b} ${sg(-4 * c)} = ${d}$。`,
            ),
            step(
              "Read its sign",
              "看它的符号",
              d > 0
                ? `$${d} > 0$, so there are two real solutions.`
                : d === 0
                  ? `It is $0$, so there is exactly one real solution.`
                  : `$${d} < 0$, so there are no real solutions.`,
              d > 0 ? `$${d} > 0$，所以有两个实数解。` : d === 0 ? `它等于 $0$，所以恰有一个实数解。` : `$${d} < 0$，所以没有实数解。`,
            ),
          ],
          t(
            `Complete the square: $(x + ${b})^2 = ${b * b} ${sg(-c)} = ${b * b - c}$, and a square equals ${b * b - c > 0 ? "a positive number at two values of $x$" : b * b - c === 0 ? "$0$ at one value of $x$" : "a negative number at no value of $x$"}.`,
            `配方：$(x + ${b})^2 = ${b * b} ${sg(-c)} = ${b * b - c}$，而平方${b * b - c > 0 ? "等于正数时有两个 $x$" : b * b - c === 0 ? "等于 $0$ 时只有一个 $x$" : "不可能等于负数"}。`,
          ),
          [
            t(`That needs a discriminant of $0$.`, `这要求判别式为 $0$。`),
            t(`That needs a positive discriminant.`, `这要求判别式为正。`),
            t(`That needs a negative discriminant.`, `这要求判别式为负。`),
            t(`A quadratic equation has at most two solutions.`, `二次方程最多有两个解。`),
          ].filter((_, i) => [many, two, none, three][i] !== answer),
        ),
      );
    }
    const m = 2 * a * b;
    return ask(
      rng,
      `For what value of $c$ does $${quad(a * a, m, 0)} + c = 0$ have exactly one real solution?`,
      `$c$ 为何值时，$${quad(a * a, m, 0)} + c = 0$ 恰有一个实数解？`,
      b * b,
      [m, -b * b, 2 * b],
      worked(
        [
          step(
            "Set the discriminant to zero",
            "令判别式为零",
            `Exactly one solution means $b^2 - 4ac = 0$: $${m}^2 - 4(${a * a})c = ${m * m} - ${4 * a * a}c = 0$.`,
            `恰有一解表示 $b^2 - 4ac = 0$：$${m}^2 - 4(${a * a})c = ${m * m} - ${4 * a * a}c = 0$。`,
          ),
          step(
            "Solve for c",
            "解出 c",
            `$c = \\frac{${m * m}}{${4 * a * a}} = ${b * b}$.`,
            `$c = \\frac{${m * m}}{${4 * a * a}} = ${b * b}$。`,
          ),
        ],
        t(
          `With $c = ${b * b}$ the left side is $(${cx(a)} + ${b})^2$, which is $0$ only at $x = ${Q.of(-b, a).toLatex()}$.`,
          `$c = ${b * b}$ 时左边为 $(${cx(a)} + ${b})^2$，只在 $x = ${Q.of(-b, a).toLatex()}$ 处为 $0$。`,
        ),
        [
          t(`This is the $x$ coefficient, not $c$.`, `这是 $x$ 的系数，不是 $c$。`),
          t(
            `This has the wrong sign: $${m * m} - ${4 * a * a}c = 0$ needs a positive $c$.`,
            `符号错了：$${m * m} - ${4 * a * a}c = 0$ 要求 $c$ 为正。`,
          ),
          t(`This is twice the square root of $c$.`, `这是 $c$ 的平方根的两倍。`),
        ],
      ),
    );
  },
  "Applying Vieta's Formulas": (rng, hard) => {
    const [r, s, a] = [rng.int(1, 9), rng.int(-8, -1), rng.int(2, 5)];
    if (!hard)
      return ask(
        rng,
        `What is the product of the solutions of $${quad(a, -a * (r + s), a * r * s)} = 0$?`,
        `$${quad(a, -a * (r + s), a * r * s)} = 0$ 的两个解之积是多少？`,
        r * s,
        [a * r * s, r + s, -r * s],
        worked(
          [
            step(
              "Recall the product rule",
              "回顾积的公式",
              `For $ax^2 + bx + c = 0$ the solutions multiply to $\\frac{c}{a}$.`,
              `对 $ax^2 + bx + c = 0$，两解之积为 $\\frac{c}{a}$。`,
            ),
            step("Divide", "相除", `$\\frac{${a * r * s}}{${a}} = ${r * s}$.`, `$\\frac{${a * r * s}}{${a}} = ${r * s}$。`),
          ],
          t(
            `Dividing by $${a}$ gives $${quad(1, -(r + s), r * s)} = (x - ${r})(x ${sg(-s)})$, with solutions $${r}$ and $${s}$, and $${r}(${s}) = ${r * s}$.`,
            `除以 $${a}$ 得 $${quad(1, -(r + s), r * s)} = (x - ${r})(x ${sg(-s)})$，解为 $${r}$ 与 $${s}$，而 $${r}(${s}) = ${r * s}$。`,
          ),
          [
            t(`This forgets to divide by the leading coefficient $${a}$.`, `这里忘了除以首项系数 $${a}$。`),
            t(`This is the sum of the solutions, not the product.`, `这是两解之和，不是积。`),
            t(`This has the wrong sign: the product is $+\\frac{c}{a}$.`, `符号错了：积是 $+\\frac{c}{a}$。`),
          ],
        ),
      );
    const [p, q] = [r + s, r * s];
    return ask(
      rng,
      `If $r$ and $s$ are the solutions of $${quad(1, -p, q)} = 0$, what is the value of $r^2 + s^2$?`,
      `若 $r$、$s$ 是 $${quad(1, -p, q)} = 0$ 的解，$r^2 + s^2$ 的值是多少？`,
      p * p - 2 * q,
      [p * p, p * p + 2 * q, p * p - q],
      worked(
        [
          step("Read the sum and product", "读出和与积", `$r + s = ${p}$ and $rs = ${q}$.`, `$r + s = ${p}$，$rs = ${q}$。`),
          step(
            "Use the square of the sum",
            "用和的平方",
            `$(r + s)^2 = r^2 + 2rs + s^2$, so $r^2 + s^2 = ${par(p)}^2 - 2(${q}) = ${p * p} ${sg(-2 * q)} = ${p * p - 2 * q}$.`,
            `$(r + s)^2 = r^2 + 2rs + s^2$，所以 $r^2 + s^2 = ${par(p)}^2 - 2(${q}) = ${p * p} ${sg(-2 * q)} = ${p * p - 2 * q}$。`,
          ),
        ],
        t(
          `The solutions are $${r}$ and $${s}$, and $${r * r} + ${s * s} = ${r * r + s * s}$.`,
          `两解为 $${r}$ 与 $${s}$，而 $${r * r} + ${s * s} = ${r * r + s * s}$。`,
        ),
        [
          t(`This is $(r + s)^2$, which still contains $2rs$.`, `这是 $(r + s)^2$，其中还含有 $2rs$。`),
          t(`This adds $2rs$ instead of subtracting it.`, `这里加上了 $2rs$，而不是减去。`),
          t(`This subtracts $rs$ once instead of twice.`, `这里只减了一次 $rs$，应减两次。`),
        ],
      ),
    );
  },
  "Modeling With Quadratic Equations": (rng, hard) => {
    const [n, d] = [rng.int(3, 20), rng.int(2, 8)];
    if (!hard)
      return ask(
        rng,
        `The product of two positive whole numbers is $${n * (n + d)}$, and one is $${d}$ greater than the other. What is the smaller number?`,
        `两个正整数之积为 $${n * (n + d)}$，一个比另一个大 $${d}$。较小的数是多少？`,
        n,
        [n + d, n + 1, 2 * n + d],
        worked(
          [
            step(
              "Write the equation",
              "列方程",
              `With smaller number $n$: $n(n + ${d}) = ${n * (n + d)}$, or $n^2 + ${d}n - ${n * (n + d)} = 0$.`,
              `设较小的数为 $n$：$n(n + ${d}) = ${n * (n + d)}$，即 $n^2 + ${d}n - ${n * (n + d)} = 0$。`,
            ),
            step(
              "Factor and keep the positive root",
              "分解并取正根",
              `$(n - ${n})(n + ${n + d}) = 0$, and the positive root is $n = ${n}$.`,
              `$(n - ${n})(n + ${n + d}) = 0$，正根为 $n = ${n}$。`,
            ),
          ],
          t(
            `$${n} \\times ${n + d} = ${n * (n + d)}$, and $${n + d} - ${n} = ${d}$.`,
            `$${n} \\times ${n + d} = ${n * (n + d)}$，而 $${n + d} - ${n} = ${d}$。`,
          ),
          [
            t(`This is the greater number.`, `这是较大的数。`),
            t(
              `Then the greater would be $${n + 1 + d}$, and the product $${(n + 1) * (n + 1 + d)}$.`,
              `这样较大的数是 $${n + 1 + d}$，积为 $${(n + 1) * (n + 1 + d)}$。`,
            ),
            t(`This is the sum of the two numbers.`, `这是两数之和。`),
          ],
        ),
      );
    const v = 16 * d;
    const peak = Q.of(d, 2);
    return ask(
      rng,
      `A ball's height, in feet, $t$ seconds after it is thrown is $h = -16t^2 + ${v}t + ${n}$. How many seconds after it is thrown is the ball at its greatest height?`,
      `一个球被抛出 $t$ 秒后的高度（英尺）为 $h = -16t^2 + ${v}t + ${n}$。抛出多少秒后球最高？`,
      peak,
      [d, Q.of(d, 4), d + 2],
      worked(
        [
          step(
            "Find the vertex",
            "求顶点",
            `A downward parabola is highest at its vertex, $t = -\\frac{b}{2a}$, with $a = -16$ and $b = ${v}$.`,
            `开口向下的抛物线在顶点处最高，顶点在 $t = -\\frac{b}{2a}$，其中 $a = -16$，$b = ${v}$。`,
          ),
          step(
            "Compute",
            "计算",
            `$t = -\\frac{${v}}{2(-16)} = \\frac{${v}}{32} = ${peak.toLatex()}$.`,
            `$t = -\\frac{${v}}{2(-16)} = \\frac{${v}}{32} = ${peak.toLatex()}$。`,
          ),
        ],
        t(
          `The height is $${n}$ at $t = 0$ and again at $t = ${d}$, since $-16(${d * d}) + ${v}(${d}) = 0$; the peak lies halfway, at $${peak.toLatex()}$.`,
          `$t = 0$ 与 $t = ${d}$ 时高度都是 $${n}$，因为 $-16(${d * d}) + ${v}(${d}) = 0$；最高点在两者正中，即 $${peak.toLatex()}$。`,
        ),
        [
          t(`At this time the ball is back at its starting height of $${n}$ feet.`, `此时球回到起始高度 $${n}$ 英尺。`),
          t(`This divides by $64$ instead of $32$.`, `这里除以了 $64$，而不是 $32$。`),
          t(`At this time the ball is below its starting height.`, `此时球已低于起始高度。`),
        ],
      ),
    );
  },
  "Factoring Polynomials": (rng, hard) => {
    const [a, b] = [rng.int(2, 9), rng.int(2, 9)];
    if (!hard)
      return ask(
        rng,
        `Which of the following is a factorization of $x^3 + ${a}x^2 - ${b * b}x - ${a * b * b}$?`,
        `下列哪一项是 $x^3 + ${a}x^2 - ${b * b}x - ${a * b * b}$ 的因式分解？`,
        `(x + ${a})(x - ${b})(x + ${b})`,
        [`(x - ${a})(x - ${b})(x + ${b})`, `(x + ${a})(x - ${b})^2`, `(x + ${a})(x^2 + ${b * b})`],
        worked(
          [
            step(
              "Group in pairs",
              "两两分组",
              `$x^2(x + ${a}) - ${b * b}(x + ${a}) = (x + ${a})(x^2 - ${b * b})$.`,
              `$x^2(x + ${a}) - ${b * b}(x + ${a}) = (x + ${a})(x^2 - ${b * b})$。`,
            ),
            step(
              "Factor the difference of squares",
              "分解平方差",
              `$x^2 - ${b * b} = (x - ${b})(x + ${b})$, so the polynomial is $(x + ${a})(x - ${b})(x + ${b})$.`,
              `$x^2 - ${b * b} = (x - ${b})(x + ${b})$，所以多项式为 $(x + ${a})(x - ${b})(x + ${b})$。`,
            ),
          ],
          t(
            `At $x = 1$: $1 + ${a} - ${b * b} - ${a * b * b} = ${1 + a - b * b - a * b * b}$, and $(${1 + a})(${1 - b})(${1 + b}) = ${(1 + a) * (1 - b) * (1 + b)}$.`,
            `取 $x = 1$：$1 + ${a} - ${b * b} - ${a * b * b} = ${1 + a - b * b - a * b * b}$，而 $(${1 + a})(${1 - b})(${1 + b}) = ${(1 + a) * (1 - b) * (1 + b)}$。`,
          ),
          [
            t(`This gives $-${a}x^2$; the $x^2$ term is $+${a}x^2$.`, `这会得到 $-${a}x^2$；而 $x^2$ 项是 $+${a}x^2$。`),
            t(
              `$(x - ${b})^2$ is $x^2 - ${2 * b}x + ${b * b}$, not $x^2 - ${b * b}$.`,
              `$(x - ${b})^2$ 是 $x^2 - ${2 * b}x + ${b * b}$，不是 $x^2 - ${b * b}$。`,
            ),
            t(
              `This has the sign of $${b * b}$ reversed; $x^2 - ${b * b}$ is a difference.`,
              `这里 $${b * b}$ 的符号反了；$x^2 - ${b * b}$ 是差。`,
            ),
          ],
        ),
      );
    const m = rng.int(1, 5);
    return ask(
      rng,
      `How many distinct real zeros does $f(x) = ${cx(m, "x^4")} - ${m * (a + b) ** 2}x^2$ have?`,
      `$f(x) = ${cx(m, "x^4")} - ${m * (a + b) ** 2}x^2$ 有多少个不同的实数零点？`,
      3,
      [2, 4, 1],
      worked(
        [
          step(
            "Factor completely",
            "完全分解",
            `$f(x) = ${cx(m, "x^2")}(x^2 - ${(a + b) ** 2}) = ${cx(m, "x^2")}(x - ${a + b})(x + ${a + b})$.`,
            `$f(x) = ${cx(m, "x^2")}(x^2 - ${(a + b) ** 2}) = ${cx(m, "x^2")}(x - ${a + b})(x + ${a + b})$。`,
          ),
          step(
            "Count distinct zeros",
            "数不同的零点",
            `The zeros are $0$, $${a + b}$ and $${-a - b}$. The factor $x^2$ gives $0$ twice but counts once, so there are $3$.`,
            `零点为 $0$、$${a + b}$、$${-a - b}$。因式 $x^2$ 给出两次 $0$，但只算一个，所以共 $3$ 个。`,
          ),
        ],
        t(
          `$f(${a + b}) = ${m}(${(a + b) ** 4}) - ${m * (a + b) ** 2}(${(a + b) ** 2}) = 0$, and $f(0) = 0$.`,
          `$f(${a + b}) = ${m}(${(a + b) ** 4}) - ${m * (a + b) ** 2}(${(a + b) ** 2}) = 0$，且 $f(0) = 0$。`,
        ),
        [
          t(`This misses the zero at $x = 0$.`, `这里漏掉了 $x = 0$ 这个零点。`),
          t(`This counts the repeated zero $0$ twice; distinct zeros are counted once.`, `这里把重零点 $0$ 算了两次；不同的零点只算一次。`),
          t(`This counts only the zero at $0$.`, `这里只算了 $0$ 这一个零点。`),
        ],
      ),
    );
  },
  "Simplifying Rational Expressions": (rng, hard) => {
    const [a, b, c] = [rng.int(1, 9), rng.int(10, 14), rng.int(2, 6)];
    if (!hard)
      return ask(
        rng,
        `Where it is defined, $\\frac{${quad(1, a + b, a * b)}}{${quad(1, a + c, a * c)}}$ equals which of the following?`,
        `在有定义处，$\\frac{${quad(1, a + b, a * b)}}{${quad(1, a + c, a * c)}}$ 等于下列哪一项？`,
        `\\frac{x + ${b}}{x + ${c}}`,
        [`\\frac{x + ${c}}{x + ${b}}`, `\\frac{${b}}{${c}}`, `\\frac{x + ${a}}{x + ${c}}`],
        worked(
          [
            step(
              "Factor top and bottom",
              "分解分子分母",
              `$\\frac{(x + ${a})(x + ${b})}{(x + ${a})(x + ${c})}$.`,
              `$\\frac{(x + ${a})(x + ${b})}{(x + ${a})(x + ${c})}$。`,
            ),
            step(
              "Cancel the common factor",
              "约去公因式",
              `Only the whole factor $x + ${a}$ is shared, which leaves $\\frac{x + ${b}}{x + ${c}}$.`,
              `只有整个因式 $x + ${a}$ 是公共的，约去后剩 $\\frac{x + ${b}}{x + ${c}}$。`,
            ),
          ],
          t(
            `At $x = 0$: $\\frac{${a * b}}{${a * c}} = \\frac{${b}}{${c}}$, the same as $\\frac{0 + ${b}}{0 + ${c}}$.`,
            `取 $x = 0$：$\\frac{${a * b}}{${a * c}} = \\frac{${b}}{${c}}$，与 $\\frac{0 + ${b}}{0 + ${c}}$ 相同。`,
          ),
          [
            t(`This turns the fraction upside down.`, `这里把分数上下颠倒了。`),
            t(`This cancels the $x$ terms too, which are added, not multiplied.`, `这里把 $x$ 也约掉了，但它们是相加的，不是相乘。`),
            t(`This keeps the factor that cancels in the numerator.`, `这里在分子中留下了本该约去的因式。`),
          ],
        ),
      );
    return ask(
      rng,
      `For $x > ${a}$, what is $\\frac{${c}x - ${c * a}}{x^2 - ${a * a}}$ in simplest form?`,
      `当 $x > ${a}$ 时，$\\frac{${c}x - ${c * a}}{x^2 - ${a * a}}$ 的最简形式是什么？`,
      `\\frac{${c}}{x + ${a}}`,
      [`\\frac{${c}}{x - ${a}}`, `\\frac{${c}x}{x + ${a}}`, `\\frac{1}{x + ${c * a}}`],
      worked(
        [
          step(
            "Factor top and bottom",
            "分解分子分母",
            `$${c}x - ${c * a} = ${c}(x - ${a})$ and $x^2 - ${a * a} = (x - ${a})(x + ${a})$.`,
            `$${c}x - ${c * a} = ${c}(x - ${a})$，$x^2 - ${a * a} = (x - ${a})(x + ${a})$。`,
          ),
          step(
            "Cancel",
            "约分",
            `$x - ${a} \\ne 0$ since $x > ${a}$, so it cancels and leaves $\\frac{${c}}{x + ${a}}$.`,
            `由于 $x > ${a}$，$x - ${a} \\ne 0$，约去后剩 $\\frac{${c}}{x + ${a}}$。`,
          ),
        ],
        t(
          `At $x = ${a + 1}$: $\\frac{${c * (a + 1) - c * a}}{${(a + 1) ** 2 - a * a}} = \\frac{${c}}{${2 * a + 1}}$, and $\\frac{${c}}{${a + 1} + ${a}}$ is the same.`,
          `取 $x = ${a + 1}$：$\\frac{${c * (a + 1) - c * a}}{${(a + 1) ** 2 - a * a}} = \\frac{${c}}{${2 * a + 1}}$，与 $\\frac{${c}}{${a + 1} + ${a}}$ 相同。`,
        ),
        [
          t(`This keeps the factor $x - ${a}$ that cancels instead of $x + ${a}$.`, `这里留下了本该约去的 $x - ${a}$，而不是 $x + ${a}$。`),
          t(
            `This cancels only $-${c * a}$ against $-${a * a}$, leaving $x$ on top.`,
            `这里只用 $-${c * a}$ 和 $-${a * a}$ 约分，分子留下了 $x$。`,
          ),
          t(`This moves $${c}$ into the denominator.`, `这里把 $${c}$ 移到分母里去了。`),
        ],
      ),
    );
  },
  "Combining Rational Expressions": (rng, hard) => {
    const c = rng.int(2, 7);
    // The second numerator stays coprime to c, so the sum is already in lowest terms.
    const b = rng.pick(
      [2, 3, 4, 5, 6, 7, 8, 9].filter((v) => {
        let [m, n] = [v, c];
        while (n !== 0) [m, n] = [n, m % n];
        return m === 1;
      }),
    );
    const a = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== c));
    if (!hard)
      return ask(
        rng,
        `For $x \\ne 0$, which of the following equals $\\frac{${a}}{x} + \\frac{${b}}{${c}x}$?`,
        `当 $x \\ne 0$ 时，下列哪一项等于 $\\frac{${a}}{x} + \\frac{${b}}{${c}x}$？`,
        `\\frac{${a * c + b}}{${c}x}`,
        [`\\frac{${a + b}}{${c + 1}x}`, `\\frac{${a + b}}{${c}x}`, `\\frac{${a * b}}{${c}x^2}`],
        worked(
          [
            step(
              "Use a common denominator",
              "通分",
              `The common denominator is $${c}x$, and $\\frac{${a}}{x} = \\frac{${a * c}}{${c}x}$.`,
              `公分母是 $${c}x$，而 $\\frac{${a}}{x} = \\frac{${a * c}}{${c}x}$。`,
            ),
            step(
              "Add the numerators",
              "分子相加",
              `$\\frac{${a * c} + ${b}}{${c}x} = \\frac{${a * c + b}}{${c}x}$.`,
              `$\\frac{${a * c} + ${b}}{${c}x} = \\frac{${a * c + b}}{${c}x}$。`,
            ),
          ],
          t(
            `At $x = 1$: $${a} + \\frac{${b}}{${c}} = \\frac{${a * c + b}}{${c}}$.`,
            `取 $x = 1$：$${a} + \\frac{${b}}{${c}} = \\frac{${a * c + b}}{${c}}$。`,
          ),
          [
            t(`This adds the tops and the bottoms separately.`, `这里把分子、分母分别相加了。`),
            t(`This does not multiply $${a}$ by $${c}$ when changing the denominator.`, `这里通分时没有把 $${a}$ 乘以 $${c}$。`),
            t(`This multiplies the fractions instead of adding them.`, `这里把两个分数相乘了，而不是相加。`),
          ],
        ),
      );
    return ask(
      rng,
      `Where it is defined, $\\frac{${a}}{x - ${b}} - \\frac{${c}}{x + ${b}}$ equals which of the following?`,
      `在有定义处，$\\frac{${a}}{x - ${b}} - \\frac{${c}}{x + ${b}}$ 等于下列哪一项？`,
      `\\frac{${lin(a - c, (a + c) * b)}}{x^2 - ${b * b}}`,
      [
        `\\frac{${lin(a - c, (a - c) * b)}}{x^2 - ${b * b}}`,
        `\\frac{${a - c}}{x^2 - ${b * b}}`,
        `\\frac{${lin(a + c, (a + c) * b)}}{x^2 - ${b * b}}`,
      ],
      worked(
        [
          step(
            "Use a common denominator",
            "通分",
            `$(x - ${b})(x + ${b}) = x^2 - ${b * b}$, and the numerator is $${a}(x + ${b}) - ${c}(x - ${b})$.`,
            `$(x - ${b})(x + ${b}) = x^2 - ${b * b}$，分子为 $${a}(x + ${b}) - ${c}(x - ${b})$。`,
          ),
          step(
            "Expand the numerator",
            "展开分子",
            `$${a}x + ${a * b} - ${c}x + ${c * b} = ${lin(a - c, (a + c) * b)}$: subtracting $-${c * b}$ adds $${c * b}$.`,
            `$${a}x + ${a * b} - ${c}x + ${c * b} = ${lin(a - c, (a + c) * b)}$：减去 $-${c * b}$ 等于加上 $${c * b}$。`,
          ),
        ],
        t(
          `At $x = 0$: $\\frac{${a}}{-${b}} - \\frac{${c}}{${b}} = -\\frac{${a + c}}{${b}}$, and $\\frac{${(a + c) * b}}{-${b * b}} = -\\frac{${a + c}}{${b}}$.`,
          `取 $x = 0$：$\\frac{${a}}{-${b}} - \\frac{${c}}{${b}} = -\\frac{${a + c}}{${b}}$，而 $\\frac{${(a + c) * b}}{-${b * b}} = -\\frac{${a + c}}{${b}}$。`,
        ),
        [
          t(
            `This subtracts $${c * b}$ instead of adding it: the minus sign reaches $-${b}$ too.`,
            `这里减去了 $${c * b}$，而应加上：负号也作用于 $-${b}$。`,
          ),
          t(`This subtracts the numerators without changing the denominators.`, `这里没有通分就把分子相减了。`),
          t(`This adds the second fraction instead of subtracting it.`, `这里把第二个分数加上了，而不是减去。`),
        ],
      ),
    );
  },
  "Solving Rational Equations": (rng, hard) => {
    const [x, a, b] = [rng.int(2, 15), rng.int(2, 9), rng.int(1, 9)];
    if (!hard) {
      const [n, k] = [rng.int(2, 5), rng.int(2, 6)];
      const m = n + rng.int(1, 3);
      return ask(
        rng,
        `What value of $x$ satisfies $\\frac{x}{x + ${m * k}} = \\frac{${n}}{${n + m}}$?`,
        `哪个 $x$ 值满足 $\\frac{x}{x + ${m * k}} = \\frac{${n}}{${n + m}}$？`,
        n * k,
        [m * k, n * k + m * k, n],
        worked(
          [
            step(
              "Cross-multiply",
              "交叉相乘",
              `$${n + m}x = ${n}(x + ${m * k}) = ${n}x + ${n * m * k}$.`,
              `$${n + m}x = ${n}(x + ${m * k}) = ${n}x + ${n * m * k}$。`,
            ),
            step(
              "Solve",
              "求解",
              `$${m}x = ${n * m * k}$, so $x = ${n * k}$, which keeps the denominator nonzero.`,
              `$${m}x = ${n * m * k}$，所以 $x = ${n * k}$，分母不为零。`,
            ),
          ],
          t(
            `$\\frac{${n * k}}{${n * k + m * k}} = \\frac{${n * k}}{${(n + m) * k}} = \\frac{${n}}{${n + m}}$.`,
            `$\\frac{${n * k}}{${n * k + m * k}} = \\frac{${n * k}}{${(n + m) * k}} = \\frac{${n}}{${n + m}}$。`,
          ),
          [
            t(`This is the amount added in the denominator, not $x$.`, `这是分母中加上的数，不是 $x$。`),
            t(`This is the whole denominator $x + ${m * k}$, not $x$.`, `这是整个分母 $x + ${m * k}$，不是 $x$。`),
            t(
              `This takes the numerator $${n}$ of the fraction as $x$, ignoring the scale.`,
              `这里把分数的分子 $${n}$ 当成 $x$，忽略了倍数。`,
            ),
          ],
        ),
      );
    }
    const c = a * (x + b);
    return ask(
      rng,
      `What is the solution of $\\frac{${c}}{x + ${b}} = ${a}$?`,
      `$\\frac{${c}}{x + ${b}} = ${a}$ 的解是什么？`,
      x,
      [x + 2 * b, c - a, x + 1],
      worked(
        [
          step(
            "Clear the denominator",
            "去分母",
            `Multiply both sides by $x + ${b}$: $${c} = ${a}(x + ${b})$.`,
            `两边乘以 $x + ${b}$：$${c} = ${a}(x + ${b})$。`,
          ),
          step(
            "Solve",
            "求解",
            `$x + ${b} = ${c} \\div ${a} = ${x + b}$, so $x = ${x}$, which does not make the denominator $0$.`,
            `$x + ${b} = ${c} \\div ${a} = ${x + b}$，所以 $x = ${x}$，分母不为 $0$。`,
          ),
        ],
        t(`$\\frac{${c}}{${x} + ${b}} = \\frac{${c}}{${x + b}} = ${a}$.`, `$\\frac{${c}}{${x} + ${b}} = \\frac{${c}}{${x + b}} = ${a}$。`),
        [
          t(`This adds $${b}$ instead of subtracting it at the end.`, `这里最后加上了 $${b}$，而不是减去。`),
          t(`This subtracts $${a}$ from $${c}$ instead of dividing.`, `这里用 $${c}$ 减去 $${a}$，而不是相除。`),
          t(
            `With this $x$ the fraction is $\\frac{${c}}{${x + b + 1}}$, not $${a}$.`,
            `取这个 $x$ 时分数为 $\\frac{${c}}{${x + b + 1}}$，不是 $${a}$。`,
          ),
        ],
      ),
    );
  },
  "Solving Square-Root Equations": (rng, hard) => {
    const [k, a, b] = [rng.int(2, 12), rng.int(1, 5), rng.int(1, 15)];
    const x = k * k * a + b;
    const m = k * a;
    if (!hard)
      return ask(
        rng,
        `What value of $x$ satisfies $\\sqrt{x - ${b}} = ${k}$?`,
        `哪个 $x$ 值满足 $\\sqrt{x - ${b}} = ${k}$？`,
        k * k + b,
        [k + b, k * k - b, 2 * k + b],
        worked(
          [
            step("Square both sides", "两边平方", `$x - ${b} = ${k}^2 = ${k * k}$.`, `$x - ${b} = ${k}^2 = ${k * k}$。`),
            step("Solve", "求解", `$x = ${k * k} + ${b} = ${k * k + b}$.`, `$x = ${k * k} + ${b} = ${k * k + b}$。`),
          ],
          t(`$\\sqrt{${k * k + b} - ${b}} = \\sqrt{${k * k}} = ${k}$.`, `$\\sqrt{${k * k + b} - ${b}} = \\sqrt{${k * k}} = ${k}$。`),
          [
            t(`This adds $${b}$ to $${k}$ without squaring.`, `这里没有平方，直接把 $${b}$ 加到 $${k}$ 上。`),
            t(`This subtracts $${b}$ instead of adding it.`, `这里减去了 $${b}$，而不是加上。`),
            t(`This doubles $${k}$ instead of squaring it.`, `这里把 $${k}$ 乘以 $2$，而不是平方。`),
          ],
        ),
      );
    return ask(
      rng,
      `If $${a}\\sqrt{x - ${b}} + ${m} = ${2 * m}$, and $x$ is a real number, what is $x$?`,
      `若 $${a}\\sqrt{x - ${b}} + ${m} = ${2 * m}$，$x$ 为实数，$x$ 是多少？`,
      k * k + b,
      [x, k + b, (a * k) ** 2 + b + 1],
      worked(
        [
          step(
            "Isolate the root",
            "分离根式",
            `Subtract $${m}$: $${a}\\sqrt{x - ${b}} = ${m}$, then divide by $${a}$: $\\sqrt{x - ${b}} = ${k}$.`,
            `减去 $${m}$：$${a}\\sqrt{x - ${b}} = ${m}$，再除以 $${a}$：$\\sqrt{x - ${b}} = ${k}$。`,
          ),
          step(
            "Square and solve",
            "平方并求解",
            `$x - ${b} = ${k * k}$, so $x = ${k * k + b}$.`,
            `$x - ${b} = ${k * k}$，所以 $x = ${k * k + b}$。`,
          ),
        ],
        t(
          `$${a}\\sqrt{${k * k}} + ${m} = ${a}(${k}) + ${m} = ${2 * m}$.`,
          `$${a}\\sqrt{${k * k}} + ${m} = ${a}(${k}) + ${m} = ${2 * m}$。`,
        ),
        [
          t(
            `This squares before dividing by $${a}$, which keeps a factor of $${a}$ in $x - ${b}$.`,
            `这里先平方后除以 $${a}$，使 $x - ${b}$ 中多了因数 $${a}$。`,
          ),
          t(`This forgets to square $${k}$.`, `这里忘了把 $${k}$ 平方。`),
          t(`This squares $${m}$ without dividing by $${a}$, and adds one more.`, `这里没有除以 $${a}$ 就把 $${m}$ 平方，还多加了 $1$。`),
        ],
      ),
    );
  },
  "Solving Absolute Value Equations": (rng, hard) => {
    const [a, b, c] = [rng.int(1, 12), rng.int(2, 15), rng.int(2, 5)];
    if (!hard)
      return ask(
        rng,
        `What are the solutions of $|x - ${a}| = ${b}$?`,
        `$|x - ${a}| = ${b}$ 的解是什么？`,
        `${a - b} \\text{ and } ${a + b}`,
        [`${a + b} \\text{ only}`, `${-a - b} \\text{ and } ${b - a}`, `${a - b} \\text{ only}`],
        worked(
          [
            step(
              "Split into two cases",
              "分两种情况",
              `$x - ${a} = ${b}$ or $x - ${a} = -${b}$.`,
              `$x - ${a} = ${b}$ 或 $x - ${a} = -${b}$。`,
            ),
            step("Solve each", "分别求解", `$x = ${a + b}$ or $x = ${a - b}$.`, `$x = ${a + b}$ 或 $x = ${a - b}$。`),
          ],
          t(
            `$|${a + b} - ${a}| = ${b}$ and $|${a - b} - ${a}| = |-${b}| = ${b}$.`,
            `$|${a + b} - ${a}| = ${b}$，$|${a - b} - ${a}| = |-${b}| = ${b}$。`,
          ),
          [
            t(`This misses the case $x - ${a} = -${b}$.`, `这里漏掉了 $x - ${a} = -${b}$ 的情况。`),
            t(`These solve $|x + ${a}| = ${b}$, with the sign of $${a}$ reversed.`, `这是 $|x + ${a}| = ${b}$ 的解，$${a}$ 的符号反了。`),
            t(`This misses the case $x - ${a} = ${b}$.`, `这里漏掉了 $x - ${a} = ${b}$ 的情况。`),
          ],
        ),
      );
    return ask(
      rng,
      `What is the sum of all solutions of $${c}|x + ${a}| - ${b} = ${c * b - b}$?`,
      `$${c}|x + ${a}| - ${b} = ${c * b - b}$ 的所有解之和是多少？`,
      -2 * a,
      [2 * a, 0, -a],
      worked(
        [
          step(
            "Isolate the absolute value",
            "分离绝对值",
            `Add $${b}$: $${c}|x + ${a}| = ${c * b}$, then divide by $${c}$: $|x + ${a}| = ${b}$.`,
            `加 $${b}$：$${c}|x + ${a}| = ${c * b}$，再除以 $${c}$：$|x + ${a}| = ${b}$。`,
          ),
          step(
            "Solve and add",
            "求解并相加",
            `$x = ${-a} + ${b} = ${b - a}$ or $x = ${-a} - ${b} = ${-a - b}$, and $${b - a} + ${par(-a - b)} = ${-2 * a}$.`,
            `$x = ${-a} + ${b} = ${b - a}$ 或 $x = ${-a} - ${b} = ${-a - b}$，而 $${b - a} + ${par(-a - b)} = ${-2 * a}$。`,
          ),
        ],
        t(
          `The two solutions sit $${b}$ on either side of $${-a}$, so they add to $2(${-a}) = ${-2 * a}$.`,
          `两个解在 $${-a}$ 两侧各 $${b}$ 处，所以和为 $2(${-a}) = ${-2 * a}$。`,
        ),
        [
          t(
            `This has the wrong sign: the solutions are centered at $${-a}$, not $${a}$.`,
            `符号错了：两个解以 $${-a}$ 为中心，而不是 $${a}$。`,
          ),
          t(`The solutions are not opposites; they are centered at $${-a}$.`, `两个解不是相反数；它们以 $${-a}$ 为中心。`),
          t(`This is the center of the solutions, not their sum.`, `这是两个解的中点，不是它们的和。`),
        ],
      ),
    );
  },
  "Writing Rate and Earnings Models": (rng, hard) => {
    const [r, b, c] = [rng.int(11, 30), rng.int(31, 90), rng.int(3, 9)];
    if (!hard)
      return ask(
        rng,
        `A tutor earns a flat $\\$${b}$ per week plus $\\$${r}$ per hour tutored. Which expression gives the tutor's pay, in dollars, for a week with $h$ hours of tutoring?`,
        `一位家教每周固定得 $\\$${b}$，另外每辅导一小时得 $\\$${r}$。哪个式子表示辅导 $h$ 小时那一周的报酬（美元）？`,
        `${b} + ${r}h`,
        [`${r} + ${b}h`, `${b + r}h`, `${b}h - ${r}`],
        worked(
          [
            step(
              "Write the flat part",
              "写出固定部分",
              `The $${b}$ dollars are paid once a week, whatever $h$ is.`,
              `$${b}$ 美元每周只付一次，与 $h$ 无关。`,
            ),
            step(
              "Add the hourly part",
              "加上按时部分",
              `$${r}$ dollars for each hour is $${r}h$, so the pay is $${b} + ${r}h$.`,
              `每小时 $${r}$ 美元即 $${r}h$，所以报酬是 $${b} + ${r}h$。`,
            ),
          ],
          t(
            `A week with $2$ hours pays $${b} + ${2 * r} = ${b + 2 * r}$ dollars, and $${b} + ${r}(2)$ is the same.`,
            `辅导 $2$ 小时的一周得 $${b} + ${2 * r} = ${b + 2 * r}$ 美元，$${b} + ${r}(2)$ 也一样。`,
          ),
          [
            t(`This swaps the flat amount and the hourly rate.`, `这里把固定收入与时薪对调了。`),
            t(`This pays the flat amount for every hour.`, `这里每小时都付了固定部分。`),
            t(`This multiplies the flat amount by $h$ and subtracts the rate.`, `这里把固定部分乘了 $h$，又减去了时薪。`),
          ],
        ),
      );
    return ask(
      rng,
      `A printer has $${b * 10}$ sheets and uses $${c}$ sheets per minute. Which equation gives the sheets $S$ left after $m$ minutes?`,
      `一台打印机有 $${b * 10}$ 张纸，每分钟用 $${c}$ 张。哪个等式表示 $m$ 分钟后剩余的纸张数 $S$？`,
      `S = ${b * 10} - ${c}m`,
      [`S = ${b * 10} + ${c}m`, `S = ${c} - ${b * 10}m`, `S = ${b * 10}m - ${c}`],
      worked(
        [
          step("Start from the supply", "从起始量出发", `At $m = 0$ there are $${b * 10}$ sheets.`, `$m = 0$ 时有 $${b * 10}$ 张。`),
          step(
            "Subtract the use",
            "减去用量",
            `$${c}$ sheets a minute for $m$ minutes is $${c}m$, so $S = ${b * 10} - ${c}m$.`,
            `每分钟 $${c}$ 张，$m$ 分钟共 $${c}m$ 张，所以 $S = ${b * 10} - ${c}m$。`,
          ),
        ],
        t(
          `After $10$ minutes $${10 * c}$ sheets are used, leaving $${b * 10 - 10 * c}$, and $${b * 10} - ${c}(10) = ${b * 10 - 10 * c}$.`,
          `$10$ 分钟后用了 $${10 * c}$ 张，剩 $${b * 10 - 10 * c}$ 张，而 $${b * 10} - ${c}(10) = ${b * 10 - 10 * c}$。`,
        ),
        [
          t(`This adds sheets as the printer runs; using them takes them away.`, `这里打印时纸张反而增加了；用掉的纸应该减去。`),
          t(`This swaps the starting supply and the rate.`, `这里把起始量与速率对调了。`),
          t(`This multiplies the supply by the minutes.`, `这里把起始量乘以了分钟数。`),
        ],
      ),
    );
  },
  "Expressing Related Quantities": (rng, hard) => {
    const [k, m, n] = [rng.int(2, 6), rng.int(2, 9), rng.int(2, 12)];
    if (!hard)
      return ask(
        rng,
        `Lena is $${k}$ times as old as Kai, and Kai is $${m}$ years younger than Omar. If Omar is $y$ years old, which expression gives Lena's age?`,
        `Lena 的年龄是 Kai 的 $${k}$ 倍，Kai 比 Omar 小 $${m}$ 岁。若 Omar $y$ 岁，哪个式子表示 Lena 的年龄？`,
        `${k}(y - ${m})`,
        [`${k}y - ${m}`, `${k}(y + ${m})`, `\\frac{y - ${m}}{${k}}`],
        worked(
          [
            step(
              "Find Kai's age",
              "求 Kai 的年龄",
              `Kai is $${m}$ years younger than Omar: $y - ${m}$.`,
              `Kai 比 Omar 小 $${m}$ 岁：$y - ${m}$。`,
            ),
            step(
              "Scale to Lena",
              "得到 Lena 的年龄",
              `Lena is $${k}$ times the whole of Kai's age: $${k}(y - ${m})$.`,
              `Lena 的年龄是 Kai 整个年龄的 $${k}$ 倍：$${k}(y - ${m})$。`,
            ),
          ],
          t(
            `If Omar is $${m + 10}$, Kai is $10$ and Lena is $${10 * k}$, and $${k}(${m + 10} - ${m}) = ${10 * k}$.`,
            `若 Omar $${m + 10}$ 岁，则 Kai $10$ 岁，Lena $${10 * k}$ 岁，而 $${k}(${m + 10} - ${m}) = ${10 * k}$。`,
          ),
          [
            t(`This multiplies only $y$ by $${k}$, not the $${m}$.`, `这里只把 $y$ 乘了 $${k}$，没有乘 $${m}$。`),
            t(`This makes Kai older than Omar.`, `这里让 Kai 比 Omar 大了。`),
            t(`This divides by $${k}$; Lena is the older, so multiply.`, `这里除以了 $${k}$；Lena 年龄更大，应该相乘。`),
          ],
        ),
      );
    return ask(
      rng,
      `A box holds $n$ pencils. A second box holds $${n}$ more than $${k}$ times as many. How many pencils are in the two boxes together?`,
      `一个盒子装 $n$ 支铅笔。第二个盒子装的比它的 $${k}$ 倍还多 $${n}$ 支。两个盒子一共有多少支？`,
      `${k + 1}n + ${n}`,
      [`${k}n + ${n}`, `${k + 1}n + ${k * n}`, `${k}(n + ${n})`],
      worked(
        [
          step(
            "Write the second box",
            "写出第二个盒子",
            `$${k}$ times as many is $${k}n$, and $${n}$ more is $${k}n + ${n}$.`,
            `$${k}$ 倍是 $${k}n$，再多 $${n}$ 支是 $${k}n + ${n}$。`,
          ),
          step("Add both boxes", "两盒相加", `$n + ${k}n + ${n} = ${k + 1}n + ${n}$.`, `$n + ${k}n + ${n} = ${k + 1}n + ${n}$。`),
        ],
        t(
          `With $n = 10$ the boxes hold $10$ and $${10 * k + n}$, a total of $${10 + 10 * k + n}$, and $${k + 1}(10) + ${n}$ is the same.`,
          `$n = 10$ 时两盒分别装 $10$ 支和 $${10 * k + n}$ 支，共 $${10 + 10 * k + n}$ 支，$${k + 1}(10) + ${n}$ 也一样。`,
        ),
        [
          t(`This is the second box alone.`, `这只是第二个盒子。`),
          t(`This multiplies the extra $${n}$ by $${k}$ as well.`, `这里把多出的 $${n}$ 也乘了 $${k}$。`),
          t(`This adds $${n}$ before multiplying, and leaves out the first box.`, `这里先加 $${n}$ 再乘，而且漏了第一个盒子。`),
        ],
      ),
    );
  },
  "Using a Given Algebraic Model": (rng, hard) => {
    const [a, b, h] = [rng.int(15, 60), rng.int(3, 12), rng.int(2, 20)];
    if (!hard)
      return ask(
        rng,
        `The cost, in dollars, of renting a kayak for $h$ hours is $C = ${a} + ${b}h$. What is the cost of renting it for $${h}$ hours?`,
        `租一条皮划艇 $h$ 小时的费用（美元）为 $C = ${a} + ${b}h$。租 $${h}$ 小时的费用是多少？`,
        a + b * h,
        [(a + b) * h, a + h, b * h],
        worked(
          [
            step("Substitute", "代入", `$C = ${a} + ${b}(${h})$.`, `$C = ${a} + ${b}(${h})$。`),
            step(
              "Multiply, then add",
              "先乘后加",
              `$${b} \\times ${h} = ${b * h}$, and $${a} + ${b * h} = ${a + b * h}$.`,
              `$${b} \\times ${h} = ${b * h}$，而 $${a} + ${b * h} = ${a + b * h}$。`,
            ),
          ],
          t(
            `$${a + b * h} - ${a} = ${b * h}$ dollars for the hours, and $${b * h} \\div ${b} = ${h}$ hours.`,
            `$${a + b * h} - ${a} = ${b * h}$ 美元是按时计费，$${b * h} \\div ${b} = ${h}$ 小时。`,
          ),
          [
            t(`This adds before multiplying, charging the $${a}$ for every hour.`, `这里先加后乘，每小时都收了 $${a}$。`),
            t(`This adds the hours without multiplying by the rate $${b}$.`, `这里直接加上小时数，没有乘以每小时 $${b}$ 美元。`),
            t(`This leaves out the fixed $${a}$ dollars.`, `这里漏掉了固定的 $${a}$ 美元。`),
          ],
        ),
      );
    const [full, level] = [2 * a + b * h, 2 * a];
    return ask(
      rng,
      `The water level in a draining tank, in centimeters, is $H = ${full} - ${b}t$, where $t$ is hours since it began draining. After how many hours is the level $${level}$ centimeters?`,
      `一个正在排水的水箱的水位（厘米）为 $H = ${full} - ${b}t$，$t$ 是开始排水后的小时数。多少小时后水位为 $${level}$ 厘米？`,
      h,
      [h + 2, h * b, full - h],
      worked(
        [
          step("Set the level", "令水位相等", `$${full} - ${b}t = ${level}$.`, `$${full} - ${b}t = ${level}$。`),
          step(
            "Solve",
            "求解",
            `$${b}t = ${full} - ${level} = ${b * h}$, so $t = ${h}$.`,
            `$${b}t = ${full} - ${level} = ${b * h}$，所以 $t = ${h}$。`,
          ),
        ],
        t(`$${full} - ${b}(${h}) = ${full} - ${b * h} = ${level}$.`, `$${full} - ${b}(${h}) = ${full} - ${b * h} = ${level}$。`),
        [
          t(`After this many hours the level is $${level - 2 * b}$ centimeters.`, `过这么多小时后水位是 $${level - 2 * b}$ 厘米。`),
          t(`This is the drop in centimeters, not the time.`, `这是下降的厘米数，不是时间。`),
          t(`This subtracts the time from the starting level.`, `这里用起始水位减去了时间。`),
        ],
      ),
    );
  },
  "Modeling Perimeter Problems": (rng, hard) => {
    const [w, d] = [rng.int(3, 30), rng.int(2, 12)];
    const p = 2 * (w + w + d);
    if (!hard)
      return ask(
        rng,
        `A garden's length is $${d}$ meters more than its width, and $${p}$ meters of fence just surround it. What is the width, in meters?`,
        `一个花园的长比宽多 $${d}$ 米，正好用 $${p}$ 米栅栏围起来。宽是多少米？`,
        w,
        [w + d, 2 * w, 2 * w + d],
        worked(
          [
            step("Write the perimeter", "写出周长", `With width $w$: $2(w + w + ${d}) = ${p}$.`, `设宽为 $w$：$2(w + w + ${d}) = ${p}$。`),
            step(
              "Solve",
              "求解",
              `$2w + ${d} = ${p / 2}$, so $2w = ${2 * w}$ and $w = ${w}$.`,
              `$2w + ${d} = ${p / 2}$，所以 $2w = ${2 * w}$，$w = ${w}$。`,
            ),
          ],
          t(`The length is $${w + d}$, and $2(${w} + ${w + d}) = ${p}$.`, `长为 $${w + d}$，而 $2(${w} + ${w + d}) = ${p}$。`),
          [
            t(`This is the length, not the width.`, `这是长，不是宽。`),
            t(`This is $2w$, before dividing by $2$.`, `这是 $2w$，还没有除以 $2$。`),
            t(`This is half the perimeter, the width and length together.`, `这是周长的一半，即长与宽之和。`),
          ],
        ),
      );
    // The base stays shorter than the two equal sides together, so the triangle exists.
    const extra = 1 + (d % (w - 1));
    return ask(
      rng,
      `An isosceles triangle has a base that is $${extra}$ ${extra === 1 ? "inch" : "inches"} longer than each equal side. Its perimeter is $${3 * w + extra}$ inches. What is the length of each equal side, in inches?`,
      `一个等腰三角形的底比每条腰长 $${extra}$ 英寸，周长为 $${3 * w + extra}$ 英寸。每条腰长多少英寸？`,
      w,
      [w + extra, 3 * w, w + 3],
      worked(
        [
          step(
            "Write the perimeter",
            "写出周长",
            `With equal sides $s$ the base is $s + ${extra}$: $s + s + (s + ${extra}) = 3s + ${extra} = ${3 * w + extra}$.`,
            `设腰长为 $s$，底为 $s + ${extra}$：$s + s + (s + ${extra}) = 3s + ${extra} = ${3 * w + extra}$。`,
          ),
          step("Solve", "求解", `$3s = ${3 * w}$, so $s = ${w}$.`, `$3s = ${3 * w}$，所以 $s = ${w}$。`),
        ],
        t(
          `The sides are $${w}$, $${w}$ and $${w + extra}$, which add to $${3 * w + extra}$.`,
          `三边为 $${w}$、$${w}$、$${w + extra}$，和为 $${3 * w + extra}$。`,
        ),
        [
          t(`This is the base, not an equal side.`, `这是底，不是腰。`),
          t(`This is $3s$, before dividing by $3$.`, `这是 $3s$，还没有除以 $3$。`),
          t(`With this side the perimeter would be $${3 * (w + 3) + extra}$.`, `腰是这个长度的话，周长是 $${3 * (w + 3) + extra}$。`),
        ],
      ),
    );
  },
  "Modeling Cost Problems": (rng, hard) => {
    const [p, q, u, v] = [rng.int(2, 9), rng.int(10, 18), rng.int(2, 15), rng.int(2, 15)];
    if (!hard)
      return ask(
        rng,
        `A bakery charges $\\$${p}$ per muffin and $\\$${q}$ per cake. Which expression gives the cost, in dollars, of $m$ muffins and $c$ cakes?`,
        `一家面包店每个松饼 $\\$${p}$，每个蛋糕 $\\$${q}$。哪个式子表示 $m$ 个松饼和 $c$ 个蛋糕的费用（美元）？`,
        `${p}m + ${q}c`,
        [`${q}m + ${p}c`, `${p + q}(m + c)`, `${p}m - ${q}c`],
        worked(
          [
            step(
              "Price each item",
              "分别计价",
              `$m$ muffins cost $${p}m$ and $c$ cakes cost $${q}c$.`,
              `$m$ 个松饼要 $${p}m$，$c$ 个蛋糕要 $${q}c$。`,
            ),
            step("Add the costs", "费用相加", `The total is $${p}m + ${q}c$.`, `总费用是 $${p}m + ${q}c$。`),
          ],
          t(
            `$2$ muffins and $1$ cake cost $${2 * p} + ${q} = ${2 * p + q}$, and $${p}(2) + ${q}(1)$ is the same.`,
            `$2$ 个松饼加 $1$ 个蛋糕要 $${2 * p} + ${q} = ${2 * p + q}$，$${p}(2) + ${q}(1)$ 也一样。`,
          ),
          [
            t(`This swaps the two prices.`, `这里把两个价格对调了。`),
            t(`This charges both prices for every item.`, `这里每件都按两种价格收费。`),
            t(`This subtracts the cakes instead of adding them.`, `这里减去了蛋糕的费用，而不是加上。`),
          ],
        ),
      );
    return ask(
      rng,
      `Pens cost $\\$${p}$ each and binders cost $\\$${q}$ each. A student spent $\\$${p * u + q * v}$ and bought $${v}$ binders. How many pens did the student buy?`,
      `钢笔每支 $\\$${p}$，活页夹每个 $\\$${q}$。一名学生花了 $\\$${p * u + q * v}$，买了 $${v}$ 个活页夹。这名学生买了多少支钢笔？`,
      u,
      [v, u + v, u + 2],
      worked(
        [
          step(
            "Subtract the binders",
            "减去活页夹",
            `$${v}$ binders cost $${q}(${v}) = ${q * v}$, leaving $${p * u + q * v} - ${q * v} = ${p * u}$ dollars.`,
            `$${v}$ 个活页夹花 $${q}(${v}) = ${q * v}$，剩下 $${p * u + q * v} - ${q * v} = ${p * u}$ 美元。`,
          ),
          step("Divide by the pen price", "除以钢笔单价", `$${p * u} \\div ${p} = ${u}$ pens.`, `$${p * u} \\div ${p} = ${u}$ 支。`),
        ],
        t(
          `$${p}(${u}) + ${q}(${v}) = ${p * u} + ${q * v} = ${p * u + q * v}$.`,
          `$${p}(${u}) + ${q}(${v}) = ${p * u} + ${q * v} = ${p * u + q * v}$。`,
        ),
        [
          t(`This is the number of binders.`, `这是活页夹的个数。`),
          t(`This is the number of items in all.`, `这是物品的总数。`),
          t(`With this many pens the total would be $${2 * p}$ dollars more.`, `钢笔是这么多支的话，总价会多 $${2 * p}$ 美元。`),
        ],
      ),
    );
  },
  "Modeling Related-Quantity Problems": (rng, hard) => {
    const [n, k, d] = [rng.int(5, 40), rng.int(2, 5), rng.int(2, 15)];
    if (!hard)
      return ask(
        rng,
        `A library shelf holds $${n + k * n + d}$ books, fiction and nonfiction. There are $${d}$ more than $${k}$ times as many fiction books as nonfiction books. How many nonfiction books are there?`,
        `图书馆一个书架上有 $${n + k * n + d}$ 本小说和非小说。小说比非小说的 $${k}$ 倍还多 $${d}$ 本。非小说有多少本？`,
        n,
        [k * n + d, n + d, n + k],
        worked(
          [
            step(
              "Write the equation",
              "列方程",
              `With $n$ nonfiction books there are $${k}n + ${d}$ fiction, so $n + ${k}n + ${d} = ${n + k * n + d}$.`,
              `设非小说 $n$ 本，小说就有 $${k}n + ${d}$ 本，所以 $n + ${k}n + ${d} = ${n + k * n + d}$。`,
            ),
            step("Solve", "求解", `$${k + 1}n = ${(k + 1) * n}$, so $n = ${n}$.`, `$${k + 1}n = ${(k + 1) * n}$，所以 $n = ${n}$。`),
          ],
          t(
            `Fiction: $${k}(${n}) + ${d} = ${k * n + d}$, and $${n} + ${k * n + d} = ${n + k * n + d}$.`,
            `小说：$${k}(${n}) + ${d} = ${k * n + d}$，而 $${n} + ${k * n + d} = ${n + k * n + d}$。`,
          ),
          [
            t(`This is the number of fiction books.`, `这是小说的数量。`),
            t(`This adds the extra $${d}$ to the nonfiction count.`, `这里把多出的 $${d}$ 本加到了非小说上。`),
            t(
              `With this many nonfiction books the shelf would hold $${(k + 1) * k}$ more.`,
              `非小说是这么多本的话，书架上会多出 $${(k + 1) * k}$ 本。`,
            ),
          ],
        ),
      );
    return ask(
      rng,
      `Three consecutive even integers have a sum of $${3 * (2 * n) + 6}$. What is the greatest of the three?`,
      `三个连续偶数之和为 $${3 * (2 * n) + 6}$。其中最大的是多少？`,
      2 * n + 4,
      [2 * n, 2 * n + 2, 2 * n + 6],
      worked(
        [
          step(
            "Name the integers",
            "设出三个数",
            `Consecutive even integers are $e$, $e + 2$ and $e + 4$, with sum $3e + 6 = ${6 * n + 6}$.`,
            `连续偶数为 $e$、$e + 2$、$e + 4$，和为 $3e + 6 = ${6 * n + 6}$。`,
          ),
          step(
            "Solve and add 4",
            "求解后加 4",
            `$3e = ${6 * n}$, so $e = ${2 * n}$, and the greatest is $${2 * n} + 4 = ${2 * n + 4}$.`,
            `$3e = ${6 * n}$，所以 $e = ${2 * n}$，最大的是 $${2 * n} + 4 = ${2 * n + 4}$。`,
          ),
        ],
        t(`$${2 * n} + ${2 * n + 2} + ${2 * n + 4} = ${6 * n + 6}$.`, `$${2 * n} + ${2 * n + 2} + ${2 * n + 4} = ${6 * n + 6}$。`),
        [
          t(`This is the least of the three.`, `这是三个数中最小的。`),
          t(`This is the middle one.`, `这是中间那个。`),
          t(`This goes one even number past the three.`, `这比三个数又多走了一个偶数。`),
        ],
      ),
    );
  },
  "Writing Linear Models From Data": (rng, hard) => {
    const [m, b, s] = [rng.int(2, 9), rng.int(10, 40), rng.int(1, 4)];
    const xs = [s, s + 1, s + 2, s + 3];
    const ys = xs.map((v) => m * v + b);
    if (!hard)
      return ask(
        rng,
        `The table shows the cost $y$, in dollars, of a delivery of $x$ boxes. Which equation fits the table? ${table("x", "y", xs, ys)}`,
        `表中是配送 $x$ 箱的费用 $y$（美元）。哪个等式符合此表？${table("x", "y", xs, ys)}`,
        `y = ${m}x + ${b}`,
        [`y = ${b}x + ${m}`, `y = ${m}x + ${b + m}`, `y = ${m + 1}x + ${b}`],
        worked(
          [
            step(
              "Find the slope",
              "求斜率",
              `Each extra box adds $${ys[1]} - ${ys[0]} = ${m}$ dollars, so the slope is $${m}$.`,
              `每多一箱增加 $${ys[1]} - ${ys[0]} = ${m}$ 美元，所以斜率为 $${m}$。`,
            ),
            step(
              "Find the intercept",
              "求截距",
              `$${ys[0]} = ${m}(${s}) + b$, so $b = ${ys[0]} - ${m * s} = ${b}$.`,
              `$${ys[0]} = ${m}(${s}) + b$，所以 $b = ${ys[0]} - ${m * s} = ${b}$。`,
            ),
          ],
          t(`The last row: $${m}(${s + 3}) + ${b} = ${ys[3]}$.`, `最后一行：$${m}(${s + 3}) + ${b} = ${ys[3]}$。`),
          [
            t(`This swaps the slope and the intercept.`, `这里把斜率与截距对调了。`),
            t(
              `This intercept is $${m}$ too large; it gives $${(ys[0] as number) + m}$ at $x = ${s}$.`,
              `这个截距大了 $${m}$；它在 $x = ${s}$ 时给出 $${(ys[0] as number) + m}$。`,
            ),
            t(`This slope is $1$ too large.`, `这个斜率大了 $1$。`),
          ],
        ),
      );
    return ask(
      rng,
      `A linear model passes through the data points $(${xs[0]}, ${ys[0]})$ and $(${xs[3]}, ${ys[3]})$. What value does it predict at $x = ${s + 10}$?`,
      `一个线性模型过数据点 $(${xs[0]}, ${ys[0]})$ 和 $(${xs[3]}, ${ys[3]})$。它预测 $x = ${s + 10}$ 时的值是多少？`,
      m * (s + 10) + b,
      [m * (s + 10), (ys[0] as number) + 10, m * 10 + b],
      worked(
        [
          step(
            "Find the slope",
            "求斜率",
            `$\\frac{${ys[3]} - ${ys[0]}}{${s + 3} - ${s}} = \\frac{${3 * m}}{3} = ${m}$.`,
            `$\\frac{${ys[3]} - ${ys[0]}}{${s + 3} - ${s}} = \\frac{${3 * m}}{3} = ${m}$。`,
          ),
          step(
            "Move from the first point",
            "从第一个点出发",
            `$x = ${s + 10}$ is $10$ units past $x = ${s}$, so the value is $${ys[0]} + ${m}(10) = ${m * (s + 10) + b}$.`,
            `$x = ${s + 10}$ 比 $x = ${s}$ 多 $10$ 个单位，所以值为 $${ys[0]} + ${m}(10) = ${m * (s + 10) + b}$。`,
          ),
        ],
        t(
          `From the other point: $${ys[3]} + ${m}(7) = ${(ys[3] as number) + 7 * m}$.`,
          `从另一个点出发：$${ys[3]} + ${m}(7) = ${(ys[3] as number) + 7 * m}$。`,
        ),
        [
          t(`This leaves out the intercept $${b}$.`, `这里漏掉了截距 $${b}$。`),
          t(`This adds $10$ without multiplying by the slope.`, `这里加了 $10$，没有乘以斜率。`),
          t(`This evaluates the model at $x = 10$ instead of $x = ${s + 10}$.`, `这里求的是 $x = 10$ 处的值，而不是 $x = ${s + 10}$ 处。`),
        ],
      ),
    );
  },
  "Evaluating a Function": (rng, hard) => {
    const [a, b, c, x] = [rng.int(2, 6), rng.int(1, 9), rng.int(1, 12), rng.int(-5, -1)];
    if (!hard)
      return ask(
        rng,
        `Given $f(x) = ${quad(a, -b, c)}$, what is $f(${x})$?`,
        `已知 $f(x) = ${quad(a, -b, c)}$，$f(${x})$ 是多少？`,
        a * x * x - b * x + c,
        [-a * x * x - b * x + c, a * x * x + b * x + c, 2 * a * x - b * x + c],
        worked(
          [
            step(
              "Substitute with parentheses",
              "带括号代入",
              `$f(${x}) = ${a}(${x})^2 - ${b}(${x}) + ${c}$.`,
              `$f(${x}) = ${a}(${x})^2 - ${b}(${x}) + ${c}$。`,
            ),
            step(
              "Evaluate each term",
              "逐项计算",
              `$${a}(${x * x}) = ${a * x * x}$ and $-${b}(${x}) = ${-b * x}$, so $f(${x}) = ${a * x * x} + ${-b * x} + ${c} = ${a * x * x - b * x + c}$.`,
              `$${a}(${x * x}) = ${a * x * x}$，$-${b}(${x}) = ${-b * x}$，所以 $f(${x}) = ${a * x * x} + ${-b * x} + ${c} = ${a * x * x - b * x + c}$。`,
            ),
          ],
          t(
            `$${a * x * x - b * x + c} - ${c} = ${a * x * x - b * x}$, and $${x}(${a}(${x}) - ${b}) = ${x}(${a * x - b}) = ${a * x * x - b * x}$.`,
            `$${a * x * x - b * x + c} - ${c} = ${a * x * x - b * x}$，而 $${x}(${a}(${x}) - ${b}) = ${x}(${a * x - b}) = ${a * x * x - b * x}$。`,
          ),
          [
            t(`This takes $(${x})^2$ as negative.`, `这里把 $(${x})^2$ 当成了负数。`),
            t(
              `This loses the sign: $-${b}(${x})$ is $+${-b * x}$, and the steps keep it.`,
              `这里符号出错：$-${b}(${x})$ 是 $+${-b * x}$。`,
            ),
            t(`This doubles $${x}$ instead of squaring it.`, `这里把 $${x}$ 乘以 $2$，而不是平方。`),
          ],
        ),
      );
    return ask(
      rng,
      `If $g(x) = ${lin(a, c)}$ and $g(k) = ${a * b + c}$, what is the value of $k$?`,
      `若 $g(x) = ${lin(a, c)}$ 且 $g(k) = ${a * b + c}$，$k$ 的值是多少？`,
      b,
      [a * (a * b + c) + c, b + c, a * b],
      worked(
        [
          step(
            "Set up the equation",
            "列方程",
            `The output is given, so $${a}k + ${c} = ${a * b + c}$.`,
            `给出的是函数值，所以 $${a}k + ${c} = ${a * b + c}$。`,
          ),
          step("Solve", "求解", `$${a}k = ${a * b}$, so $k = ${b}$.`, `$${a}k = ${a * b}$，所以 $k = ${b}$。`),
        ],
        t(`$g(${b}) = ${a}(${b}) + ${c} = ${a * b + c}$.`, `$g(${b}) = ${a}(${b}) + ${c} = ${a * b + c}$。`),
        [
          t(`This puts $${a * b + c}$ in as an input instead of solving for one.`, `这里把 $${a * b + c}$ 当作输入代入了，而没有反解。`),
          t(`This adds $${c}$ instead of subtracting it.`, `这里加上了 $${c}$，而不是减去。`),
          t(`This stops at $${a}k$ without dividing by $${a}$.`, `这里停在 $${a}k$，没有除以 $${a}$。`),
        ],
      ),
    );
  },
  "Evaluating Function Compositions": (rng, hard) => {
    const [a, b, c, x] = [rng.int(2, 7), rng.int(1, 9), rng.int(1, 9), rng.int(1, 6)];
    if (!hard)
      return ask(
        rng,
        `If $f(x) = x^2 + ${c}$ and $g(x) = ${lin(a, -b)}$, what is $f(g(${x}))$?`,
        `若 $f(x) = x^2 + ${c}$，$g(x) = ${lin(a, -b)}$，$f(g(${x}))$ 是多少？`,
        (a * x - b) ** 2 + c,
        [a * (x * x + c) - b, (a * x - b) * (x * x + c), (a * x - b) * 2 + c],
        worked(
          [
            step(
              "Evaluate the inside",
              "先算里面",
              `$g(${x}) = ${a}(${x}) - ${b} = ${a * x - b}$.`,
              `$g(${x}) = ${a}(${x}) - ${b} = ${a * x - b}$。`,
            ),
            step(
              "Evaluate the outside",
              "再算外面",
              `$f(${a * x - b}) = ${par(a * x - b)}^2 + ${c} = ${(a * x - b) ** 2} + ${c} = ${(a * x - b) ** 2 + c}$.`,
              `$f(${a * x - b}) = ${par(a * x - b)}^2 + ${c} = ${(a * x - b) ** 2} + ${c} = ${(a * x - b) ** 2 + c}$。`,
            ),
          ],
          t(
            `Build $f(g(x)) = (${lin(a, -b)})^2 + ${c}$ first and put in $x = ${x}$: $${par(a * x - b)}^2 + ${c} = ${(a * x - b) ** 2 + c}$.`,
            `先写出 $f(g(x)) = (${lin(a, -b)})^2 + ${c}$，再代入 $x = ${x}$：$${par(a * x - b)}^2 + ${c} = ${(a * x - b) ** 2 + c}$。`,
          ),
          [
            t(`This is $g(f(${x}))$, in the other order.`, `这是 $g(f(${x}))$，顺序反了。`),
            t(`This multiplies $g(${x})$ and $f(${x})$ instead of composing them.`, `这里把 $g(${x})$ 与 $f(${x})$ 相乘了，而不是复合。`),
            t(`This doubles $g(${x})$ instead of squaring it.`, `这里把 $g(${x})$ 乘以 $2$，而不是平方。`),
          ],
        ),
      );
    const d = rng.int(2, 6);
    return ask(
      rng,
      `For $f(x) = ${lin(a, b)}$ and $g(x) = ${lin(d, -c)}$, which expression equals $g(f(x))$?`,
      `对 $f(x) = ${lin(a, b)}$，$g(x) = ${lin(d, -c)}$，哪个式子等于 $g(f(x))$？`,
      lin(a * d, b * d - c),
      [lin(a * d, b - c * a), lin(a * d, b * d + c), lin(a + d, b - c)],
      worked(
        [
          step("Substitute f into g", "把 f 代入 g", `$g(f(x)) = ${d}(${lin(a, b)}) - ${c}$.`, `$g(f(x)) = ${d}(${lin(a, b)}) - ${c}$。`),
          step(
            "Distribute and combine",
            "展开并合并",
            `$${a * d}x + ${b * d} - ${c} = ${lin(a * d, b * d - c)}$.`,
            `$${a * d}x + ${b * d} - ${c} = ${lin(a * d, b * d - c)}$。`,
          ),
        ],
        t(
          `At $x = 0$: $f(0) = ${b}$ and $g(${b}) = ${d * b - c}$, the constant of the answer.`,
          `取 $x = 0$：$f(0) = ${b}$，$g(${b}) = ${d * b - c}$，正是答案的常数项。`,
        ),
        [
          t(`This is $f(g(x))$, in the other order.`, `这是 $f(g(x))$，顺序反了。`),
          t(`This adds $${c}$ instead of subtracting it.`, `这里加上了 $${c}$，而不是减去。`),
          t(`This adds the two functions instead of composing them.`, `这里把两个函数相加了，而不是复合。`),
        ],
      ),
    );
  },
  "Writing Function Rules From Data": (rng, hard) => {
    const [m, b] = [rng.pick([-5, -4, -3, -2, 2, 3, 4, 5, 6]), rng.int(7, 18)];
    const xs = [0, 1, 2, 3];
    const ys = xs.map((v) => m * v + b);
    if (!hard)
      return ask(
        rng,
        `Which rule gives $y$ as a function of $x$ for every pair in the table? ${table("x", "y", xs, ys)}`,
        `哪条规则对表中每一对都给出 $y$ 关于 $x$ 的函数？${table("x", "y", xs, ys)}`,
        `y = ${lin(m, b)}`,
        [`y = ${lin(-m, b)}`, `y = ${lin(b, m)}`, `y = ${lin(m, b + 1)}`],
        worked(
          [
            step(
              "Read the constant",
              "读出常数",
              `At $x = 0$, $y = ${b}$, so the constant is $${b}$.`,
              `$x = 0$ 时 $y = ${b}$，所以常数是 $${b}$。`,
            ),
            step(
              "Read the rate",
              "读出变化率",
              `Each step in $x$ changes $y$ by $${ys[1]} - ${b} = ${m}$, so $y = ${lin(m, b)}$.`,
              `$x$ 每增加 $1$，$y$ 变化 $${ys[1]} - ${b} = ${m}$，所以 $y = ${lin(m, b)}$。`,
            ),
          ],
          t(`At $x = 3$: $${m}(3) + ${b} = ${ys[3]}$, as in the table.`, `$x = 3$ 时：$${m}(3) + ${b} = ${ys[3]}$，与表一致。`),
          [
            t(`This rate has the wrong sign.`, `这个变化率符号反了。`),
            t(`This swaps the rate and the constant.`, `这里把变化率与常数对调了。`),
            t(`This gives $${b + 1}$ at $x = 0$, not $${b}$.`, `它在 $x = 0$ 时给出 $${b + 1}$，不是 $${b}$。`),
          ],
        ),
      );
    const a = rng.int(1, 4);
    const squares = xs.map((v) => a * v * v + b);
    return ask(
      rng,
      `Which rule fits every pair in the table? ${table("x", "y", xs, squares)}`,
      `哪条规则符合表中每一对？${table("x", "y", xs, squares)}`,
      `y = ${quad(a, 0, b)}`,
      [`y = ${lin(3 * a, b)}`, `y = ${lin(2 * a, b)}`, `y = ${quad(a, 0, b + 1)}`],
      worked(
        [
          step(
            "Look at the differences",
            "看差",
            `The $y$ values change by $${a}$, $${3 * a}$ and $${5 * a}$, which are not constant, so the rule is not linear.`,
            `$y$ 依次变化 $${a}$、$${3 * a}$、$${5 * a}$，不是常数，所以规则不是线性的。`,
          ),
          step(
            "Match a square rule",
            "匹配平方规则",
            `$y - ${b}$ is $0$, $${a}$, $${4 * a}$, $${9 * a}$, which is $${cx(a, "x^2")}$, so $y = ${quad(a, 0, b)}$.`,
            `$y - ${b}$ 依次为 $0$、$${a}$、$${4 * a}$、$${9 * a}$，即 $${cx(a, "x^2")}$，所以 $y = ${quad(a, 0, b)}$。`,
          ),
        ],
        t(`At $x = 3$: $${a}(9) + ${b} = ${squares[3]}$.`, `$x = 3$ 时：$${a}(9) + ${b} = ${squares[3]}$。`),
        [
          t(
            `This line fits $x = 0$ and $x = 3$ but gives $${3 * a + b}$ at $x = 1$.`,
            `这条直线在 $x = 0$ 和 $x = 3$ 处符合，但在 $x = 1$ 处给出 $${3 * a + b}$。`,
          ),
          t(
            `This line fits $x = 0$ and $x = 2$ but gives $${2 * a + b}$ at $x = 1$.`,
            `这条直线在 $x = 0$ 和 $x = 2$ 处符合，但在 $x = 1$ 处给出 $${2 * a + b}$。`,
          ),
          t(`This gives $${b + 1}$ at $x = 0$, not $${b}$.`, `它在 $x = 0$ 时给出 $${b + 1}$，不是 $${b}$。`),
        ],
      ),
    );
  },
  "Matching Functions to Representations": (rng, hard) => {
    const [m, b] = [rng.pick([-3, -2, -1, 1, 2, 3]), rng.int(-6, 6)];
    if (!hard)
      return ask(
        rng,
        `Which equation could describe the line in the graph?`,
        `哪个等式可能表示图中的直线？`,
        `y = ${lin(m, b)}`,
        [`y = ${lin(-m, b)}`, `y = ${lin(m, b === 0 ? 2 : -b)}`, `y = ${lin(3 * m, b)}`],
        worked(
          [
            step("Read the intercept", "读截距", `The line crosses the $y$-axis at $${b}$.`, `直线与 $y$ 轴交于 $${b}$。`),
            step(
              "Read the slope",
              "读斜率",
              `From one grid point to the next it ${m > 0 ? "rises" : "falls"} $${Math.abs(m)}$ for each unit to the right, so the slope is $${m}$ and the line is $y = ${lin(m, b)}$.`,
              `从一个格点到下一个，每向右一个单位${m > 0 ? "上升" : "下降"} $${Math.abs(m)}$，所以斜率为 $${m}$，直线为 $y = ${lin(m, b)}$。`,
            ),
          ],
          t(
            `The line passes through $(1, ${m + b})$, and $${m}(1) ${sg(b)} = ${m + b}$.`,
            `直线过 $(1, ${m + b})$，而 $${m}(1) ${sg(b)} = ${m + b}$。`,
          ),
          [
            t(`This line slopes the other way.`, `这条直线倾斜方向相反。`),
            t(`This line crosses the $y$-axis at a different point.`, `这条直线与 $y$ 轴交于另一点。`),
            t(`This line is three times as steep.`, `这条直线陡了三倍。`),
          ],
        ),
        lineFigure(m, b),
      );
    const x = rng.int(-4, 4);
    return ask(
      rng,
      `The graph shows the line $y = f(x)$. What is the value of $f(${x})$?`,
      `图中是直线 $y = f(x)$。$f(${x})$ 的值是多少？`,
      m * x + b,
      [-m * x + b, m * x, x],
      worked(
        [
          step(
            "Read the line",
            "读出直线",
            `It crosses the $y$-axis at $${b}$ with slope $${m}$: $f(x) = ${lin(m, b)}$.`,
            `它与 $y$ 轴交于 $${b}$，斜率为 $${m}$：$f(x) = ${lin(m, b)}$。`,
          ),
          step("Evaluate", "求值", `$f(${x}) = ${m}(${x}) ${sg(b)} = ${m * x + b}$.`, `$f(${x}) = ${m}(${x}) ${sg(b)} = ${m * x + b}$。`),
        ],
        t(
          `Above $x = ${x}$ on the horizontal axis, the line is at height $${m * x + b}$ on the graph.`,
          `在横轴 $x = ${x}$ 处，图中直线的高度为 $${m * x + b}$。`,
        ),
        [
          t(`This uses the slope with the wrong sign.`, `这里斜率的符号用反了。`),
          t(`This leaves out the intercept $${b}$.`, `这里漏掉了截距 $${b}$。`),
          t(`This is the input itself, not the output.`, `这是输入本身，不是输出。`),
        ],
      ),
      lineFigure(m, b),
    );
  },
  "Determining Rates of Change": (rng, hard) => {
    const [a, b, c] = [rng.int(1, 5), rng.int(1, 9), rng.int(2, 6)];
    if (!hard) {
      const [y1, rate, x1] = [rng.int(10, 40), rng.int(2, 12), rng.int(1, 5)];
      const y3 = y1 + c * rate;
      return ask(
        rng,
        `A plant was $${y1}$ centimeters tall on day $${x1}$ and $${y3}$ centimeters tall on day $${x1 + c}$. What was its average growth, in centimeters per day, over that time?`,
        `一株植物第 $${x1}$ 天高 $${y1}$ 厘米，第 $${x1 + c}$ 天高 $${y3}$ 厘米。这段时间内平均每天长高多少厘米？`,
        rate,
        [y3 - y1, rate + c, rate + 1],
        worked(
          [
            step(
              "Find both changes",
              "求两个变化量",
              `Height: $${y3} - ${y1} = ${y3 - y1}$ centimeters. Time: $${x1 + c} - ${x1} = ${c}$ days.`,
              `高度：$${y3} - ${y1} = ${y3 - y1}$ 厘米；时间：$${x1 + c} - ${x1} = ${c}$ 天。`,
            ),
            step(
              "Divide",
              "相除",
              `$\\frac{${y3 - y1}}{${c}} = ${rate}$ centimeters per day.`,
              `$\\frac{${y3 - y1}}{${c}} = ${rate}$ 厘米每天。`,
            ),
          ],
          t(
            `Growing $${rate}$ a day for $${c}$ days adds $${c * rate}$, and $${y1} + ${c * rate} = ${y3}$.`,
            `每天长 $${rate}$，$${c}$ 天共长 $${c * rate}$，而 $${y1} + ${c * rate} = ${y3}$。`,
          ),
          [
            t(`This is the total growth, not the growth per day.`, `这是总共长的高度，不是每天的。`),
            t(
              `At this rate the plant would reach $${y1 + c * (rate + c)}$ centimeters.`,
              `按这个速度植物会长到 $${y1 + c * (rate + c)}$ 厘米。`,
            ),
            t(
              `At this rate the plant would reach $${y1 + c * (rate + 1)}$ centimeters.`,
              `按这个速度植物会长到 $${y1 + c * (rate + 1)}$ 厘米。`,
            ),
          ],
        ),
      );
    }
    return ask(
      rng,
      `What is the average rate of change of $f(x) = ${quad(a, b, 0)}$ from $x = 1$ to $x = ${c + 1}$?`,
      `$f(x) = ${quad(a, b, 0)}$ 从 $x = 1$ 到 $x = ${c + 1}$ 的平均变化率是多少？`,
      a * (c + 2) + b,
      [a * (c + 1) ** 2 + b * (c + 1), 2 * a + b, a * (c + 1) + b],
      worked(
        [
          step(
            "Evaluate at both ends",
            "求两端的值",
            `$f(1) = ${a + b}$ and $f(${c + 1}) = ${a}(${(c + 1) ** 2}) + ${b}(${c + 1}) = ${a * (c + 1) ** 2 + b * (c + 1)}$.`,
            `$f(1) = ${a + b}$，$f(${c + 1}) = ${a}(${(c + 1) ** 2}) + ${b}(${c + 1}) = ${a * (c + 1) ** 2 + b * (c + 1)}$。`,
          ),
          step(
            "Divide the change",
            "变化量相除",
            `$\\frac{${a * (c + 1) ** 2 + b * (c + 1)} - ${a + b}}{${c + 1} - 1} = \\frac{${a * (c + 1) ** 2 + b * (c + 1) - a - b}}{${c}} = ${a * (c + 2) + b}$.`,
            `$\\frac{${a * (c + 1) ** 2 + b * (c + 1)} - ${a + b}}{${c + 1} - 1} = \\frac{${a * (c + 1) ** 2 + b * (c + 1) - a - b}}{${c}} = ${a * (c + 2) + b}$。`,
          ),
        ],
        t(
          `A rate of $${a * (c + 2) + b}$ over $${c}$ units gives a rise of $${c * (a * (c + 2) + b)}$, and $${a + b} + ${c * (a * (c + 2) + b)} = ${a * (c + 1) ** 2 + b * (c + 1)}$.`,
          `变化率 $${a * (c + 2) + b}$ 经过 $${c}$ 个单位，增加 $${c * (a * (c + 2) + b)}$，而 $${a + b} + ${c * (a * (c + 2) + b)} = ${a * (c + 1) ** 2 + b * (c + 1)}$。`,
        ),
        [
          t(`This is $f(${c + 1})$, not a rate of change.`, `这是 $f(${c + 1})$，不是变化率。`),
          t(`This is the slope at $x = 1$ only, not the average over the interval.`, `这只是 $x = 1$ 处的斜率，不是区间上的平均值。`),
          t(`This divides $f(${c + 1})$ by $${c + 1}$, ignoring $f(1)$.`, `这里用 $f(${c + 1})$ 除以 $${c + 1}$，忽略了 $f(1)$。`),
        ],
      ),
    );
  },
  "Finding Extreme Values of Quadratics": (rng, hard) => {
    const [h, k, a] = [rng.int(1, 9), rng.int(1, 20), rng.int(2, 5)];
    if (!hard)
      return ask(
        rng,
        `What is the minimum value of $f(x) = ${a}(x - ${h})^2 + ${k}$?`,
        `$f(x) = ${a}(x - ${h})^2 + ${k}$ 的最小值是多少？`,
        k,
        [h, a * k, a * h * h + k],
        worked(
          [
            step(
              "Look at the square",
              "看平方项",
              `$${a}(x - ${h})^2 \\ge 0$, and it is $0$ at $x = ${h}$.`,
              `$${a}(x - ${h})^2 \\ge 0$，在 $x = ${h}$ 时为 $0$。`,
            ),
            step(
              "Read the minimum",
              "读出最小值",
              `So the least value of $f$ is $0 + ${k} = ${k}$.`,
              `所以 $f$ 的最小值是 $0 + ${k} = ${k}$。`,
            ),
          ],
          t(
            `$f(${h}) = ${k}$, while $f(${h + 1}) = ${a + k}$ and $f(${h - 1}) = ${a + k}$ are larger.`,
            `$f(${h}) = ${k}$，而 $f(${h + 1}) = ${a + k}$ 与 $f(${h - 1}) = ${a + k}$ 都更大。`,
          ),
          [
            t(`This is where the minimum occurs, not its value.`, `这是取最小值的位置，不是最小值本身。`),
            t(
              `This multiplies $${k}$ by the leading coefficient, which only scales the square.`,
              `这里把 $${k}$ 乘了首项系数，但首项系数只作用于平方项。`,
            ),
            t(`This is $f(0)$, not the minimum.`, `这是 $f(0)$，不是最小值。`),
          ],
        ),
      );
    return ask(
      rng,
      `For what value of $x$ does $y = -x^2 + ${2 * h}x + ${k}$ reach its maximum?`,
      `$x$ 为何值时，$y = -x^2 + ${2 * h}x + ${k}$ 取最大值？`,
      h,
      [2 * h, -h, h * h + k],
      worked(
        [
          step(
            "Use the vertex formula",
            "用顶点公式",
            `The parabola opens down, so its maximum is at the vertex, $x = -\\frac{b}{2a}$.`,
            `抛物线开口向下，最大值在顶点 $x = -\\frac{b}{2a}$ 处。`,
          ),
          step("Compute", "计算", `$x = -\\frac{${2 * h}}{2(-1)} = ${h}$.`, `$x = -\\frac{${2 * h}}{2(-1)} = ${h}$。`),
        ],
        t(
          `Completing the square: $y = -(x - ${h})^2 + ${h * h + k}$, which is largest when $x = ${h}$.`,
          `配方：$y = -(x - ${h})^2 + ${h * h + k}$，在 $x = ${h}$ 时最大。`,
        ),
        [
          t(`This forgets to divide by $2a$.`, `这里忘了除以 $2a$。`),
          t(`This drops the minus sign of $a = -1$.`, `这里丢掉了 $a = -1$ 的负号。`),
          t(`This is the maximum value of $y$, not the $x$ where it occurs.`, `这是 $y$ 的最大值，不是取得最大值的 $x$。`),
        ],
      ),
    );
  },
  "Locating Points on a Parabola": (rng, hard) => {
    const [h, d, a] = [rng.int(-5, 8), rng.int(1, 6), rng.int(1, 4)];
    const k = rng.int(-6, 9);
    const y = a * d * d + k;
    if (!hard)
      return ask(
        rng,
        `A parabola has its axis of symmetry at $x = ${h}$ and passes through $(${h + d}, ${y})$. Which other point must lie on it?`,
        `一条抛物线的对称轴为 $x = ${h}$，且过点 $(${h + d}, ${y})$。下列哪个点也一定在其上？`,
        `(${h - d}, ${y})`,
        [`(${h + d}, ${-y - 1})`, `(${h - d}, ${-y - 1})`, `(${h}, ${y})`],
        worked(
          [
            step(
              "Measure from the axis",
              "量出到对称轴的距离",
              `The point is $${h + d} - ${par(h)} = ${d}$ units right of $x = ${h}$.`,
              `该点在 $x = ${h}$ 右侧 $${h + d} - ${par(h)} = ${d}$ 个单位。`,
            ),
            step(
              "Reflect",
              "作对称",
              `Its mirror image is $${d}$ units left, at $x = ${h - d}$, with the same height: $(${h - d}, ${y})$.`,
              `它的对称点在左侧 $${d}$ 个单位，即 $x = ${h - d}$，高度相同：$(${h - d}, ${y})$。`,
            ),
          ],
          t(
            `$x = ${h - d}$ and $x = ${h + d}$ are both $${d}$ from $x = ${h}$, so their heights match.`,
            `$x = ${h - d}$ 与 $x = ${h + d}$ 到 $x = ${h}$ 的距离都是 $${d}$，所以高度相同。`,
          ),
          [
            t(`A function has one height at $x = ${h + d}$, and it is $${y}$.`, `函数在 $x = ${h + d}$ 处只有一个高度，即 $${y}$。`),
            t(`The reflection keeps the height; it does not change $${y}$.`, `对称点高度不变；$${y}$ 不会改变。`),
            t(`At the axis the parabola is at its vertex, which has a different height.`, `对称轴上是顶点，高度不同。`),
          ],
        ),
      );
    return ask(
      rng,
      `The $x$-intercepts of a parabola are $${h - d}$ and $${h + d}$, and its vertex has $y$-coordinate $${-a * d * d}$. What is the value of the function at $x = ${h}$?`,
      `一条抛物线的 $x$ 轴截距为 $${h - d}$ 和 $${h + d}$，顶点的 $y$ 坐标为 $${-a * d * d}$。函数在 $x = ${h}$ 处的值是多少？`,
      -a * d * d,
      [0, a * d * d, h],
      worked(
        [
          step(
            "Find the axis",
            "求对称轴",
            `The axis is halfway between the intercepts: $\\frac{${h - d} + ${par(h + d)}}{2} = ${h}$.`,
            `对称轴在两截距正中：$\\frac{${h - d} + ${par(h + d)}}{2} = ${h}$。`,
          ),
          step(
            "Read the vertex",
            "读出顶点",
            `The vertex lies on the axis, so $x = ${h}$ is the vertex and the value there is $${-a * d * d}$.`,
            `顶点在对称轴上，所以 $x = ${h}$ 就是顶点，此处的值为 $${-a * d * d}$。`,
          ),
        ],
        t(
          `The parabola $y = ${a === 1 ? "" : a}(x - ${par(h - d)})(x - ${par(h + d)})$ has these intercepts, and at $x = ${h}$ it gives $${a === 1 ? "" : `${a}`}(${d})(${-d}) = ${-a * d * d}$.`,
          `抛物线 $y = ${a === 1 ? "" : a}(x - ${par(h - d)})(x - ${par(h + d)})$ 有这两个截距，在 $x = ${h}$ 处得 $${a === 1 ? "" : `${a}`}(${d})(${-d}) = ${-a * d * d}$。`,
        ),
        [
          t(`The value is $0$ at the intercepts, not at the vertex.`, `函数值在截距处为 $0$，在顶点处不是。`),
          t(`This has the sign of the vertex height reversed.`, `这里顶点高度的符号反了。`),
          t(`This is the $x$-coordinate, not the value of the function.`, `这是 $x$ 坐标，不是函数值。`),
        ],
      ),
    );
  },
  "Transforming Quadratic Functions": (rng, hard) => {
    const [h, k, p, q] = [rng.int(1, 7), rng.int(1, 9), rng.int(1, 6), rng.int(1, 6)];
    if (!hard)
      return ask(
        rng,
        `The graph of $y = x^2$ is moved $${h}$ units left and $${k}$ units down. Which equation describes the new graph?`,
        `把 $y = x^2$ 的图象向左移 $${h}$ 个单位，向下移 $${k}$ 个单位。哪个等式表示新图象？`,
        `y = (x + ${h})^2 - ${k}`,
        [`y = (x - ${h})^2 - ${k}`, `y = (x + ${h})^2 + ${k}`, `y = (x - ${k})^2 + ${h}`],
        worked(
          [
            step(
              "Shift left",
              "向左平移",
              `Moving left $${h}$ replaces $x$ with $x + ${h}$: $y = (x + ${h})^2$.`,
              `向左移 $${h}$ 是把 $x$ 换成 $x + ${h}$：$y = (x + ${h})^2$。`,
            ),
            step(
              "Shift down",
              "向下平移",
              `Moving down $${k}$ subtracts $${k}$ outside: $y = (x + ${h})^2 - ${k}$.`,
              `向下移 $${k}$ 是在外面减 $${k}$：$y = (x + ${h})^2 - ${k}$。`,
            ),
          ],
          t(
            `The vertex moves from $(0, 0)$ to $(-${h}, -${k})$, and $(-${h} + ${h})^2 - ${k} = -${k}$.`,
            `顶点从 $(0, 0)$ 移到 $(-${h}, -${k})$，而 $(-${h} + ${h})^2 - ${k} = -${k}$。`,
          ),
          [
            t(`This moves the graph right, not left.`, `这是向右移，不是向左。`),
            t(`This moves the graph up, not down.`, `这是向上移，不是向下。`),
            t(`This swaps the two shifts and their directions.`, `这里把两次平移及其方向都弄混了。`),
          ],
        ),
      );
    return ask(
      rng,
      `The vertex of $y = (x - ${h})^2 + ${k}$ is moved $${p}$ units right and $${q}$ units up. What are the coordinates of the new vertex?`,
      `把 $y = (x - ${h})^2 + ${k}$ 的顶点向右移 $${p}$ 个单位，向上移 $${q}$ 个单位。新顶点的坐标是什么？`,
      `(${h + p}, ${k + q})`,
      [`(${h - p}, ${k + q})`, `(${h - p}, ${k - q})`, `(${h + p}, ${k - q})`],
      worked(
        [
          step(
            "Read the vertex",
            "读出顶点",
            `$y = (x - ${h})^2 + ${k}$ has vertex $(${h}, ${k})$.`,
            `$y = (x - ${h})^2 + ${k}$ 的顶点是 $(${h}, ${k})$。`,
          ),
          step(
            "Move it",
            "平移",
            `Right adds to $x$ and up adds to $y$: $(${h} + ${p}, ${k} + ${q}) = (${h + p}, ${k + q})$.`,
            `向右加到 $x$ 上，向上加到 $y$ 上：$(${h} + ${p}, ${k} + ${q}) = (${h + p}, ${k + q})$。`,
          ),
        ],
        t(
          `The new equation is $y = (x - ${h + p})^2 + ${k + q}$, whose vertex is $(${h + p}, ${k + q})$.`,
          `新方程为 $y = (x - ${h + p})^2 + ${k + q}$，顶点为 $(${h + p}, ${k + q})$。`,
        ),
        [
          t(`This moves the vertex left instead of right.`, `这里把顶点向左移了，而不是向右。`),
          t(`This moves the vertex left and down.`, `这里把顶点向左、向下移了。`),
          t(`This moves the vertex down instead of up.`, `这里把顶点向下移了，而不是向上。`),
        ],
      ),
      curvePlot((x) => (x - h) ** 2 + k, [h - 5, h + 5], [k - 5, k + 25]),
    );
  },
  "Evaluating Exponential Functions": (rng, hard) => {
    const [a, b, n] = [rng.int(2, 15), rng.int(2, 4), rng.int(2, 4)];
    if (!hard)
      return ask(
        rng,
        `If $f(x) = ${a} \\cdot ${b}^x$, what is $f(${n})$?`,
        `若 $f(x) = ${a} \\cdot ${b}^x$，$f(${n})$ 是多少？`,
        a * b ** n,
        [(a * b) ** n, a * b * n, a + b ** n],
        worked(
          [
            step(
              "Raise the base",
              "底数取幂",
              `Only $${b}$ is raised to the power: $${b}^{${n}} = ${b ** n}$.`,
              `只有 $${b}$ 取幂：$${b}^{${n}} = ${b ** n}$。`,
            ),
            step("Multiply", "相乘", `$${a} \\times ${b ** n} = ${a * b ** n}$.`, `$${a} \\times ${b ** n} = ${a * b ** n}$。`),
          ],
          t(
            `$f(0) = ${a}$, and multiplying by $${b}$ $${n}$ times gives $${a * b ** n}$.`,
            `$f(0) = ${a}$，再乘 $${n}$ 次 $${b}$ 得 $${a * b ** n}$。`,
          ),
          [
            t(
              `This raises $${a} \\cdot ${b}$ to the power; only $${b}$ is raised.`,
              `这里把 $${a} \\cdot ${b}$ 一起取幂了；只有 $${b}$ 取幂。`,
            ),
            t(`This multiplies by the exponent instead of raising to it.`, `这里乘以了指数，而不是取幂。`),
            t(`This adds $${a}$ instead of multiplying.`, `这里加上了 $${a}$，而不是相乘。`),
          ],
        ),
      );
    return ask(
      rng,
      `A sample of bacteria starts at $${a * 100}$ and doubles every $${b}$ hours. How many bacteria are there after $${b * n}$ hours?`,
      `一份细菌样本起初有 $${a * 100}$ 个，每 $${b}$ 小时翻一番。$${b * n}$ 小时后有多少个？`,
      a * 100 * 2 ** n,
      [a * 100 * 2 ** (b * n), a * 100 * 2 * n, a * 100 + 2 ** n],
      worked(
        [
          step(
            "Count the doublings",
            "数翻番次数",
            `$${b * n}$ hours hold $${b * n} \\div ${b} = ${n}$ doubling periods.`,
            `$${b * n}$ 小时包含 $${b * n} \\div ${b} = ${n}$ 个翻番周期。`,
          ),
          step(
            "Multiply",
            "相乘",
            `$${a * 100} \\times 2^{${n}} = ${a * 100} \\times ${2 ** n} = ${a * 100 * 2 ** n}$.`,
            `$${a * 100} \\times 2^{${n}} = ${a * 100} \\times ${2 ** n} = ${a * 100 * 2 ** n}$。`,
          ),
        ],
        t(
          `Doubling step by step: ${Array.from({ length: n }, (_, i) => `$${a * 100 * 2 ** (i + 1)}$`).join(", ")}.`,
          `逐次翻番：${Array.from({ length: n }, (_, i) => `$${a * 100 * 2 ** (i + 1)}$`).join("、")}。`,
        ),
        [
          t(`This doubles every hour, not every $${b}$ hours.`, `这是每小时翻一番，而不是每 $${b}$ 小时。`),
          t(`This doubles once and multiplies by the count, which is linear growth.`, `这里翻一番后乘以次数，那是线性增长。`),
          t(`This adds $2^{${n}}$ instead of multiplying by it.`, `这里加上了 $2^{${n}}$，而不是乘以它。`),
        ],
      ),
    );
  },
  "Constructing Exponential Models": (rng, hard) => {
    const [a, r] = [rng.int(2, 90) * 100, rng.pick([5, 10, 15, 20, 25, 30])];
    const up = (100 + r) / 100;
    const down = (100 - r) / 100;
    if (!hard)
      return ask(
        rng,
        `A town has $${a}$ residents, and its population grows $${r}\\%$ per year. Which function gives the population $t$ years from now?`,
        `一个小镇有 $${a}$ 名居民，人口每年增长 $${r}\\%$。哪个函数表示 $t$ 年后的人口？`,
        `P(t) = ${a}(${up})^t`,
        [`P(t) = ${a}(${down})^t`, `P(t) = ${a}(${r})^t`, `P(t) = ${a} + ${r}t`],
        worked(
          [
            step(
              "Find the growth factor",
              "求增长因子",
              `Growing by $${r}\\%$ keeps $100\\%$ and adds $${r}\\%$: the factor is $1 + ${r / 100} = ${up}$.`,
              `增长 $${r}\\%$ 是在 $100\\%$ 上再加 $${r}\\%$：因子为 $1 + ${r / 100} = ${up}$。`,
            ),
            step(
              "Write the model",
              "写出模型",
              `Start at $${a}$ and multiply by $${up}$ each year: $P(t) = ${a}(${up})^t$.`,
              `从 $${a}$ 开始，每年乘以 $${up}$：$P(t) = ${a}(${up})^t$。`,
            ),
          ],
          t(
            `After one year: $${a} \\times ${up} = ${Math.round(a * up)}$, which is $${a}$ plus $${r}\\%$ of $${a}$, or $${(a * r) / 100}$.`,
            `一年后：$${a} \\times ${up} = ${Math.round(a * up)}$，即 $${a}$ 加上它的 $${r}\\%$，也就是 $${(a * r) / 100}$。`,
          ),
          [
            t(`This factor shrinks the population; it is for a $${r}\\%$ decrease.`, `这个因子会使人口减少；它对应减少 $${r}\\%$。`),
            t(`This multiplies by $${r}$ each year instead of by $${up}$.`, `这里每年乘以 $${r}$，而不是 $${up}$。`),
            t(`This adds $${r}$ people a year, which is linear, not a percent.`, `这里每年加 $${r}$ 人，是线性增长，不是百分比。`),
          ],
        ),
      );
    return ask(
      rng,
      `A car bought for $\\$${a * 10}$ loses $${r}\\%$ of its value each year. Which expression gives its value, in dollars, after $n$ years?`,
      `一辆车以 $\\$${a * 10}$ 买入，每年贬值 $${r}\\%$。哪个式子表示 $n$ 年后的价值（美元）？`,
      `${a * 10}(${down})^n`,
      [`${a * 10}(${up})^n`, `${a * 10}(${r / 100})^n`, `${a * 10} - ${r}n`],
      worked(
        [
          step(
            "Find what remains",
            "求剩下的比例",
            `Losing $${r}\\%$ leaves $${100 - r}\\%$ of the value, a factor of $${down}$.`,
            `贬值 $${r}\\%$ 后剩 $${100 - r}\\%$，因子为 $${down}$。`,
          ),
          step(
            "Write the model",
            "写出模型",
            `Multiply by $${down}$ each year: $${a * 10}(${down})^n$.`,
            `每年乘以 $${down}$：$${a * 10}(${down})^n$。`,
          ),
        ],
        t(
          `After one year the car loses $${(a * 10 * r) / 100}$ dollars and is worth $${a * 10 - (a * 10 * r) / 100}$, which is $${a * 10} \\times ${down}$.`,
          `一年后车贬值 $${(a * 10 * r) / 100}$ 美元，价值 $${a * 10 - (a * 10 * r) / 100}$，即 $${a * 10} \\times ${down}$。`,
        ),
        [
          t(`This factor grows the value; it is for a $${r}\\%$ increase.`, `这个因子会使价值增加；它对应增加 $${r}\\%$。`),
          t(`This keeps only $${r}\\%$ each year instead of losing it.`, `这里每年只保留 $${r}\\%$，而不是损失 $${r}\\%$。`),
          t(`This subtracts $${r}$ dollars a year, not $${r}\\%$.`, `这里每年减 $${r}$ 美元，而不是 $${r}\\%$。`),
        ],
      ),
    );
  },
  "Identifying Features of Exponential Functions": (rng, hard) => {
    const [a, b, k] = [rng.int(2, 12), rng.int(2, 5), rng.int(1, 12)];
    if (!hard)
      return ask(
        rng,
        `What is the $y$-intercept of the graph of $y = ${a} \\cdot ${b}^x + ${k}$?`,
        `$y = ${a} \\cdot ${b}^x + ${k}$ 的图象的 $y$ 轴截距是多少？`,
        a + k,
        [a, k, a * b + k],
        worked(
          [
            step(
              "Set x to zero",
              "令 x 为零",
              `The $y$-intercept is the value at $x = 0$, and $${b}^0 = 1$.`,
              `$y$ 轴截距是 $x = 0$ 时的值，而 $${b}^0 = 1$。`,
            ),
            step("Evaluate", "求值", `$y = ${a}(1) + ${k} = ${a + k}$.`, `$y = ${a}(1) + ${k} = ${a + k}$。`),
          ],
          t(
            `At $x = 1$, $y = ${a * b + k}$, and dividing out one factor of $${b}$ from the $${a * b}$ leaves $${a}$, plus $${k}$ is $${a + k}$.`,
            `$x = 1$ 时 $y = ${a * b + k}$；从 $${a * b}$ 中除去一个 $${b}$ 得 $${a}$，再加 $${k}$ 得 $${a + k}$。`,
          ),
          [
            t(`This leaves out the added $${k}$.`, `这里漏掉了加上的 $${k}$。`),
            t(`This takes $${b}^0$ as $0$; it is $1$.`, `这里把 $${b}^0$ 当成 $0$；它等于 $1$。`),
            t(`This is the value at $x = 1$, not $x = 0$.`, `这是 $x = 1$ 时的值，不是 $x = 0$ 时的。`),
          ],
        ),
      );
    return ask(
      rng,
      `As $x$ decreases, the graph of $f(x) = ${a} \\cdot ${b}^x - ${k}$ gets closer and closer to a horizontal line. What is the $y$-value of that line?`,
      `随着 $x$ 减小，$f(x) = ${a} \\cdot ${b}^x - ${k}$ 的图象越来越接近一条水平线。这条线的 $y$ 值是多少？`,
      -k,
      [a - k, 0, k],
      worked(
        [
          step(
            "Follow the exponential term",
            "看指数项",
            `As $x$ decreases, $${a} \\cdot ${b}^x$ stays positive and gets as close to $0$ as we like.`,
            `随着 $x$ 减小，$${a} \\cdot ${b}^x$ 始终为正，并且可以任意接近 $0$。`,
          ),
          step(
            "Read the asymptote",
            "读出渐近线",
            `So $f(x)$ approaches $0 - ${k} = ${-k}$: the line is $y = ${-k}$.`,
            `所以 $f(x)$ 趋近 $0 - ${k} = ${-k}$：这条线是 $y = ${-k}$。`,
          ),
        ],
        t(
          `$f(-5) = \\frac{${a}}{${b ** 5}} - ${k}$, already within $${a}$ of $${-k}$ and just above it.`,
          `$f(-5) = \\frac{${a}}{${b ** 5}} - ${k}$，已经非常接近 $${-k}$，并略高于它。`,
        ),
        [
          t(`This is the $y$-intercept, $f(0)$.`, `这是 $y$ 轴截距 $f(0)$。`),
          t(`This is the asymptote before the shift down by $${k}$.`, `这是向下平移 $${k}$ 之前的渐近线。`),
          t(`This has the shift in the wrong direction: $-${k}$ moves the graph down.`, `平移方向反了：$-${k}$ 使图象向下移。`),
        ],
      ),
      curvePlot((x) => a * b ** x - k, [-5, 3], [-k - 5, a * b ** 3 - k]),
    );
  },
  "Finding Points and Zeros of a Function": (rng, hard) => {
    const [r, s, a] = [rng.int(-7, -1), rng.int(1, 8), rng.int(2, 5)];
    if (!hard)
      return ask(
        rng,
        `What is the $x$-intercept of the graph of $y = ${a}x - ${a * s}$?`,
        `$y = ${a}x - ${a * s}$ 的图象的 $x$ 轴截距是多少？`,
        s,
        [-a * s, a, -s],
        worked(
          [
            step(
              "Set y to zero",
              "令 y 为零",
              `An $x$-intercept has $y = 0$: $${a}x - ${a * s} = 0$.`,
              `$x$ 轴截距处 $y = 0$：$${a}x - ${a * s} = 0$。`,
            ),
            step("Solve", "求解", `$${a}x = ${a * s}$, so $x = ${s}$.`, `$${a}x = ${a * s}$，所以 $x = ${s}$。`),
          ],
          t(`$${a}(${s}) - ${a * s} = 0$.`, `$${a}(${s}) - ${a * s} = 0$。`),
          [
            t(`This is the $y$-intercept.`, `这是 $y$ 轴截距。`),
            t(`This is the slope.`, `这是斜率。`),
            t(`This has the wrong sign; at $x = -${s}$, $y = ${-2 * a * s}$.`, `符号错了；$x = -${s}$ 时 $y = ${-2 * a * s}$。`),
          ],
        ),
      );
    return ask(
      rng,
      `Which point is on the graph of $g(x) = (x ${sg(-r)})(x ${sg(-s)})$ and on the $y$-axis?`,
      `哪个点既在 $g(x) = (x ${sg(-r)})(x ${sg(-s)})$ 的图象上，又在 $y$ 轴上？`,
      `(0, ${r * s})`,
      [`(0, ${-r * s})`, `(${r}, 0)`, `(${s}, 0)`],
      worked(
        [
          step("Use x = 0", "取 x = 0", `Every point on the $y$-axis has $x = 0$.`, `$y$ 轴上每个点都有 $x = 0$。`),
          step(
            "Evaluate",
            "求值",
            `$g(0) = (0 ${sg(-r)})(0 ${sg(-s)}) = (${-r})(${-s}) = ${r * s}$, so the point is $(0, ${r * s})$.`,
            `$g(0) = (0 ${sg(-r)})(0 ${sg(-s)}) = (${-r})(${-s}) = ${r * s}$，所以该点为 $(0, ${r * s})$。`,
          ),
        ],
        t(
          `Expanded, $g(x) = x^2 ${tx(-(r + s))} ${sg(r * s)}$, whose constant term is $${r * s}$.`,
          `展开得 $g(x) = x^2 ${tx(-(r + s))} ${sg(r * s)}$，常数项为 $${r * s}$。`,
        ),
        [
          t(`This has the sign of the product reversed: $(${-r})(${-s})$ is negative.`, `这里积的符号反了：$(${-r})(${-s})$ 是负数。`),
          t(`This point is on the graph, but on the $x$-axis, not the $y$-axis.`, `这个点在图象上，但在 $x$ 轴上，不在 $y$ 轴上。`),
          t(`This point is on the graph, but on the $x$-axis, not the $y$-axis.`, `这个点在图象上，但在 $x$ 轴上，不在 $y$ 轴上。`),
        ],
      ),
    );
  },
};
