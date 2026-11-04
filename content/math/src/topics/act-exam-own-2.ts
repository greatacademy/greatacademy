import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import type { ExamSpec } from "../exam.ts";
import { ask, cx, sg, table, tx, words } from "../exam.ts";
import { curvePlot, lineFigure } from "../exam-figures.ts";

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
        `Find two numbers with product $${-p * q}$ and sum $${q - p}$: they are $${q}$ and $${-p}$. So it factors as $(x + ${q})(x - ${p})$.`,
        `找积为 $${-p * q}$、和为 $${q - p}$ 的两数：$${q}$ 和 $${-p}$。所以分解为 $(x + ${q})(x - ${p})$。`,
      );
    const a = rng.pick([2, 3, 5]);
    return ask(
      rng,
      `For all $x$, $${quad(a, a * p + q, p * q)}$ can be written as $(${a}x + m)(x + n)$ for integers $m$ and $n$. What is $m + n$?`,
      `对所有 $x$，$${quad(a, a * p + q, p * q)}$ 可写成 $(${a}x + m)(x + n)$，$m$、$n$ 为整数。$m + n$ 是多少？`,
      p + q,
      [p * q, a + p + q, q - p],
      `Matching terms gives $m = ${q}$ and $n = ${p}$, since $${a}(${p}) + ${q} = ${a * p + q}$ and $${p}(${q}) = ${p * q}$. Their sum is $${p + q}$.`,
      `比较各项得 $m = ${q}$，$n = ${p}$，因为 $${a}(${p}) + ${q} = ${a * p + q}$，$${p}(${q}) = ${p * q}$。和为 $${p + q}$。`,
    );
  },
  "Using Factors of a Quadratic": (rng, hard) => {
    const [r, s] = [rng.int(-9, -1), rng.int(1, 12)];
    if (!hard)
      return ask(
        rng,
        `The product $${fac(r)}${fac(s)}$ equals $0$ for which values of $x$?`,
        `$x$ 取何值时，乘积 $${fac(r)}${fac(s)}$ 等于 $0$？`,
        `${r} \\text{ and } ${s}`,
        [`${-r} \\text{ and } ${-s}`, `${r} \\text{ and } ${-s}`, `${-r} \\text{ and } ${s}`],
        `A product is $0$ when a factor is $0$: $x ${sg(-r)} = 0$ gives $${r}$, and $x ${sg(-s)} = 0$ gives $${s}$.`,
        `乘积为 $0$ 当且仅当某因式为 $0$：$x ${sg(-r)} = 0$ 得 $${r}$，$x ${sg(-s)} = 0$ 得 $${s}$。`,
      );
    return ask(
      rng,
      `If $x - ${s}$ is a factor of $x^2 + kx ${sg(r * s)}$, what is the value of $k$?`,
      `若 $x - ${s}$ 是 $x^2 + kx ${sg(r * s)}$ 的因式，$k$ 的值是多少？`,
      -(r + s),
      [r + s, r, r * s],
      `The other factor must be $x ${sg(-r)}$, since the constants multiply to $${r * s}$. The $x$ terms add to $${-s - r}x$, so $k = ${-(r + s)}$.`,
      `另一个因式必为 $x ${sg(-r)}$，因常数之积为 $${r * s}$。$x$ 项之和为 $${-s - r}x$，所以 $k = ${-(r + s)}$。`,
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
        `Take both square roots: $x - ${h} = \\pm ${k}$. So $x$ is $${h + k}$ or $${h - k}$, and the greater is $${h + k}$.`,
        `两边开方：$x - ${h} = \\pm ${k}$。所以 $x$ 为 $${h + k}$ 或 $${h - k}$，较大者为 $${h + k}$。`,
      );
    return ask(
      rng,
      `What is the sum of the solutions of $x^2 ${tx(-2 * h)} + ${h * h} = ${k * k}$?`,
      `$x^2 ${tx(-2 * h)} + ${h * h} = ${k * k}$ 的两个解之和是多少？`,
      2 * h,
      [2 * k, h + k, -2 * h],
      `The left side is $(x - ${h})^2$, so $x = ${h} \\pm ${k}$. The $\\pm ${k}$ cancels in the sum, leaving $2(${h}) = ${2 * h}$.`,
      `左边是 $(x - ${h})^2$，所以 $x = ${h} \\pm ${k}$。求和时 $\\pm ${k}$ 抵消，得 $2(${h}) = ${2 * h}$。`,
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
        `Rewrite it as $x^2 ${tx(s - r)} - ${r * s} = 0$, which factors as $(x + ${s})(x - ${r}) = 0$. The positive solution is $${r}$.`,
        `改写为 $x^2 ${tx(s - r)} - ${r * s} = 0$，分解为 $(x + ${s})(x - ${r}) = 0$。正数解为 $${r}$。`,
      );
    const w = r;
    const l = w + s;
    return ask(
      rng,
      `A rectangle's length is $${s}$ feet more than its width, and its area is $${w * l}$ square feet. What is its width, in feet?`,
      `一个长方形的长比宽多 $${s}$ 英尺，面积为 $${w * l}$ 平方英尺。宽是多少英尺？`,
      w,
      [l, w + 1, 2 * (w + l)],
      `The width satisfies $w(w + ${s}) = ${w * l}$, which factors as $(w - ${w})(w + ${l}) = 0$. A length must be positive, so $w = ${w}$.`,
      `宽满足 $w(w + ${s}) = ${w * l}$，分解为 $(w - ${w})(w + ${l}) = 0$。长度为正，所以 $w = ${w}$。`,
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
        `Use $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$ with $a = ${a}$, $b = ${b}$ and $c = ${c}$. The radicand is $${b * b} - 4(${a})(${c}) = ${disc}$.`,
        `用 $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$，其中 $a = ${a}$，$b = ${b}$，$c = ${c}$。根号内为 $${b * b} - 4(${a})(${c}) = ${disc}$。`,
      );
    const [p, q] = [rng.int(2, 9), rng.int(2, 13)];
    const big = p * q;
    return ask(
      rng,
      `The solutions of $x^2 - ${2 * p}x ${sg(p * p - q)} = 0$ can be written as $${p} \\pm \\sqrt{n}$. What is $n$?`,
      `$x^2 - ${2 * p}x ${sg(p * p - q)} = 0$ 的解可写成 $${p} \\pm \\sqrt{n}$。$n$ 是多少？`,
      q,
      [4 * q, big, 2 * q],
      `The discriminant is $${4 * p * p} - 4(${p * p - q}) = ${4 * q}$, and $\\frac{\\sqrt{${4 * q}}}{2} = \\sqrt{${q}}$. So $n = ${q}$.`,
      `判别式为 $${4 * p * p} - 4(${p * p - q}) = ${4 * q}$，且 $\\frac{\\sqrt{${4 * q}}}{2} = \\sqrt{${q}}$。所以 $n = ${q}$。`,
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
      return words(
        rng,
        t(`How many real solutions does $x^2 ${tx(2 * b)} ${sg(c)} = 0$ have?`, `$x^2 ${tx(2 * b)} ${sg(c)} = 0$ 有多少个实数解？`),
        answer,
        [many, two, none, three].filter((o) => o !== answer),
        t(
          `The discriminant is $${4 * b * b} - 4(${c}) = ${4 * b * b - 4 * c}$. Positive means two solutions, zero means one, and negative means none.`,
          `判别式为 $${4 * b * b} - 4(${c}) = ${4 * b * b - 4 * c}$。为正有两个解，为零有一个解，为负没有解。`,
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
      `One solution means the discriminant is $0$: $${m * m} - 4(${a * a})c = 0$, so $c = ${b * b}$.`,
      `恰有一解表示判别式为 $0$：$${m * m} - 4(${a * a})c = 0$，所以 $c = ${b * b}$。`,
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
        `The product of the solutions is the constant term divided by the leading coefficient: $\\frac{${a * r * s}}{${a}} = ${r * s}$.`,
        `两解之积等于常数项除以首项系数：$\\frac{${a * r * s}}{${a}} = ${r * s}$。`,
      );
    const [p, q] = [r + s, r * s];
    return ask(
      rng,
      `If $r$ and $s$ are the solutions of $${quad(1, -p, q)} = 0$, what is the value of $r^2 + s^2$?`,
      `若 $r$、$s$ 是 $${quad(1, -p, q)} = 0$ 的解，$r^2 + s^2$ 的值是多少？`,
      p * p - 2 * q,
      [p * p, p * p + 2 * q, p * p - q],
      `Here $r + s = ${p}$ and $rs = ${q}$, and $r^2 + s^2 = (r + s)^2 - 2rs = ${p * p} - 2(${q}) = ${p * p - 2 * q}$.`,
      `这里 $r + s = ${p}$，$rs = ${q}$，且 $r^2 + s^2 = (r + s)^2 - 2rs = ${p * p} - 2(${q}) = ${p * p - 2 * q}$。`,
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
        `Let the smaller be $n$. Then $n(n + ${d}) = ${n * (n + d)}$, which factors as $(n - ${n})(n + ${n + d}) = 0$, so $n = ${n}$.`,
        `设较小者为 $n$，则 $n(n + ${d}) = ${n * (n + d)}$，分解为 $(n - ${n})(n + ${n + d}) = 0$，所以 $n = ${n}$。`,
      );
    const v = 16 * d;
    const peak = Q.of(d, 2);
    return ask(
      rng,
      `A ball's height, in feet, $t$ seconds after it is thrown is $h = -16t^2 + ${v}t + ${n}$. How many seconds after it is thrown is the ball at its greatest height?`,
      `一个球被抛出 $t$ 秒后的高度（英尺）为 $h = -16t^2 + ${v}t + ${n}$。抛出多少秒后球最高？`,
      peak,
      [d, Q.of(d, 4), d + 2],
      `The vertex of a parabola is at $t = -\\frac{b}{2a} = \\frac{${v}}{32}$, which is $${peak.toLatex()}$.`,
      `抛物线顶点在 $t = -\\frac{b}{2a} = \\frac{${v}}{32}$，即 $${peak.toLatex()}$。`,
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
        `Group the terms: $x^2(x + ${a}) - ${b * b}(x + ${a}) = (x + ${a})(x^2 - ${b * b})$, and the last factor is a difference of squares.`,
        `分组：$x^2(x + ${a}) - ${b * b}(x + ${a}) = (x + ${a})(x^2 - ${b * b})$，最后的因式是平方差。`,
      );
    const m = rng.int(1, 5);
    return ask(
      rng,
      `How many distinct real zeros does $f(x) = ${cx(m, "x^4")} - ${m * (a + b) ** 2}x^2$ have?`,
      `$f(x) = ${cx(m, "x^4")} - ${m * (a + b) ** 2}x^2$ 有多少个不同的实数零点？`,
      3,
      [2, 4, 1],
      `It factors as $${cx(m, "x^2")}(x - ${a + b})(x + ${a + b})$. The zeros are $0$, $${a + b}$ and $${-a - b}$, because the repeated factor $x^2$ gives only one zero.`,
      `分解为 $${cx(m, "x^2")}(x - ${a + b})(x + ${a + b})$。零点为 $0$、$${a + b}$、$${-a - b}$，重因式 $x^2$ 只给出一个零点。`,
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
        `Factor both: $\\frac{(x + ${a})(x + ${b})}{(x + ${a})(x + ${c})}$. Only whole factors cancel, so $x + ${a}$ goes and the rest stays.`,
        `两边分解：$\\frac{(x + ${a})(x + ${b})}{(x + ${a})(x + ${c})}$。只能约去整个因式，所以约去 $x + ${a}$，其余保留。`,
      );
    return ask(
      rng,
      `For $x > ${a}$, what is $\\frac{${c}x - ${c * a}}{x^2 - ${a * a}}$ in simplest form?`,
      `当 $x > ${a}$ 时，$\\frac{${c}x - ${c * a}}{x^2 - ${a * a}}$ 的最简形式是什么？`,
      `\\frac{${c}}{x + ${a}}`,
      [`\\frac{${c}}{x - ${a}}`, `\\frac{${c}x}{x + ${a}}`, `\\frac{1}{x + ${c * a}}`],
      `The top is $${c}(x - ${a})$ and the bottom is $(x - ${a})(x + ${a})$. Canceling $x - ${a}$ leaves $\\frac{${c}}{x + ${a}}$.`,
      `分子为 $${c}(x - ${a})$，分母为 $(x - ${a})(x + ${a})$。约去 $x - ${a}$ 得 $\\frac{${c}}{x + ${a}}$。`,
    );
  },
  "Combining Rational Expressions": (rng, hard) => {
    const [a, b, c] = [rng.int(2, 9), rng.int(2, 9), rng.int(2, 7)];
    if (!hard)
      return ask(
        rng,
        `For $x \\ne 0$, which of the following equals $\\frac{${a}}{x} + \\frac{${b}}{${c}x}$?`,
        `当 $x \\ne 0$ 时，下列哪一项等于 $\\frac{${a}}{x} + \\frac{${b}}{${c}x}$？`,
        `\\frac{${a * c + b}}{${c}x}`,
        [`\\frac{${a + b}}{${c + 1}x}`, `\\frac{${a + b}}{${c}x}`, `\\frac{${a * b}}{${c}x^2}`],
        `The common denominator is $${c}x$. The first fraction becomes $\\frac{${a * c}}{${c}x}$, and the numerators add to $${a * c + b}$.`,
        `公分母是 $${c}x$。第一个分数变为 $\\frac{${a * c}}{${c}x}$，分子相加得 $${a * c + b}$。`,
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
      `The numerator is $${a}(x + ${b}) - ${c}(x - ${b})$. The second product's sign flips, so the constants are $${a * b} + ${c * b} = ${(a + c) * b}$.`,
      `分子为 $${a}(x + ${b}) - ${c}(x - ${b})$。第二个积要变号，所以常数为 $${a * b} + ${c * b} = ${(a + c) * b}$。`,
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
        `Cross-multiply: $${n + m}x = ${n}x + ${n * m * k}$. So $${m}x = ${n * m * k}$ and $x = ${n * k}$, which keeps the denominator nonzero.`,
        `交叉相乘：$${n + m}x = ${n}x + ${n * m * k}$。所以 $${m}x = ${n * m * k}$，$x = ${n * k}$，分母不为零。`,
      );
    }
    const c = a * (x + b);
    return ask(
      rng,
      `What is the solution of $\\frac{${c}}{x + ${b}} = ${a}$?`,
      `$\\frac{${c}}{x + ${b}} = ${a}$ 的解是什么？`,
      x,
      [x + 2 * b, c - a, x + 1],
      `Multiply both sides by $x + ${b}$: $${c} = ${a}(x + ${b})$. So $x + ${b} = ${x + b}$ and $x = ${x}$, which does not make the denominator $0$.`,
      `两边乘以 $x + ${b}$：$${c} = ${a}(x + ${b})$。所以 $x + ${b} = ${x + b}$，$x = ${x}$，分母不为 $0$。`,
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
        `Square both sides to get $x - ${b} = ${k * k}$, so $x = ${k * k + b}$. Checking gives $\\sqrt{${k * k}} = ${k}$.`,
        `两边平方得 $x - ${b} = ${k * k}$，所以 $x = ${k * k + b}$。检验：$\\sqrt{${k * k}} = ${k}$。`,
      );
    return ask(
      rng,
      `If $${a}\\sqrt{x - ${b}} + ${m} = ${2 * m}$, and $x$ is a real number, what is $x$?`,
      `若 $${a}\\sqrt{x - ${b}} + ${m} = ${2 * m}$，$x$ 为实数，$x$ 是多少？`,
      k * k + b,
      [x, k + b, (a * k) ** 2 + b + 1],
      `Isolate the root: $${a}\\sqrt{x - ${b}} = ${a * k}$, so $\\sqrt{x - ${b}} = ${k}$. Squaring gives $x - ${b} = ${k * k}$ and $x = ${k * k + b}$.`,
      `先分离根式：$${a}\\sqrt{x - ${b}} = ${a * k}$，所以 $\\sqrt{x - ${b}} = ${k}$。平方得 $x - ${b} = ${k * k}$，$x = ${k * k + b}$。`,
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
        `The distance from $x$ to $${a}$ is $${b}$, so $x$ is $${b}$ on either side of $${a}$: $${a - b}$ and $${a + b}$.`,
        `$x$ 到 $${a}$ 的距离是 $${b}$，所以 $x$ 在 $${a}$ 两侧各 $${b}$ 处：$${a - b}$ 和 $${a + b}$。`,
      );
    return ask(
      rng,
      `What is the sum of all solutions of $${c}|x + ${a}| - ${b} = ${c * b - b}$?`,
      `$${c}|x + ${a}| - ${b} = ${c * b - b}$ 的所有解之和是多少？`,
      -2 * a,
      [2 * a, 0, -a],
      `Isolate the absolute value: $|x + ${a}| = ${b}$. So $x = ${-a} \\pm ${b}$, and the sum of the two solutions is $${-2 * a}$.`,
      `先分离绝对值：$|x + ${a}| = ${b}$。所以 $x = ${-a} \\pm ${b}$，两解之和为 $${-2 * a}$。`,
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
        `The flat amount is paid once and the hourly rate is multiplied by the hours, so the pay is $${b} + ${r}h$.`,
        `固定部分只算一次，时薪乘以小时数，所以报酬是 $${b} + ${r}h$。`,
      );
    return ask(
      rng,
      `A printer has $${b * 10}$ sheets and uses $${c}$ sheets per minute. Which equation gives the sheets $S$ left after $m$ minutes?`,
      `一台打印机有 $${b * 10}$ 张纸，每分钟用 $${c}$ 张。哪个等式表示 $m$ 分钟后剩余的纸张数 $S$？`,
      `S = ${b * 10} - ${c}m`,
      [`S = ${b * 10} + ${c}m`, `S = ${c} - ${b * 10}m`, `S = ${b * 10}m - ${c}`],
      `The supply starts at $${b * 10}$ and falls by $${c}$ each minute, so subtract $${c}m$ from the starting number.`,
      `纸张从 $${b * 10}$ 开始，每分钟减少 $${c}$，所以从起始数中减去 $${c}m$。`,
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
        `Kai is $y - ${m}$ years old, and Lena's age is $${k}$ times the whole of that: $${k}(y - ${m})$.`,
        `Kai 是 $y - ${m}$ 岁，Lena 的年龄是这整个式子的 $${k}$ 倍：$${k}(y - ${m})$。`,
      );
    return ask(
      rng,
      `A box holds $n$ pencils. A second box holds $${n}$ more than $${k}$ times as many. How many pencils are in the two boxes together?`,
      `一个盒子装 $n$ 支铅笔。第二个盒子装的比它的 $${k}$ 倍还多 $${n}$ 支。两个盒子一共有多少支？`,
      `${k + 1}n + ${n}`,
      [`${k}n + ${n}`, `${k + 1}n + ${k * n}`, `${k}(n + ${n})`],
      `The second box holds $${k}n + ${n}$. Adding the first box's $n$ gives $${k + 1}n + ${n}$.`,
      `第二个盒子装 $${k}n + ${n}$ 支，再加第一个盒子的 $n$ 支，得 $${k + 1}n + ${n}$。`,
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
        `Substitute $h = ${h}$: $${a} + ${b}(${h}) = ${a + b * h}$.`,
        `代入 $h = ${h}$：$${a} + ${b}(${h}) = ${a + b * h}$。`,
      );
    return ask(
      rng,
      `A candle's height, in centimeters, is $H = ${a * 2} - ${b}t$, where $t$ is hours burned. After how many hours is the height $${2 * a - b * h}$ centimeters?`,
      `一支蜡烛的高度（厘米）为 $H = ${a * 2} - ${b}t$，$t$ 是燃烧的小时数。多少小时后高度为 $${2 * a - b * h}$ 厘米？`,
      h,
      [h + 2, h * b, 2 * a - h],
      `Set $${a * 2} - ${b}t = ${2 * a - b * h}$. Then $${b}t = ${b * h}$ and $t = ${h}$.`,
      `令 $${a * 2} - ${b}t = ${2 * a - b * h}$，则 $${b}t = ${b * h}$，$t = ${h}$。`,
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
        `The perimeter gives $2(w + w + ${d}) = ${p}$, so $2w + ${d} = ${p / 2}$ and $w = ${w}$.`,
        `由周长得 $2(w + w + ${d}) = ${p}$，所以 $2w + ${d} = ${p / 2}$，$w = ${w}$。`,
      );
    const k = rng.int(2, 4);
    return ask(
      rng,
      `An isosceles triangle has a base that is $${k}$ times the length of each equal side, less $${d}$ inches. Its perimeter is $${(k + 2) * w - d}$ inches. What is the length of each equal side, in inches?`,
      `一个等腰三角形的底等于腰长的 $${k}$ 倍再减 $${d}$ 英寸，周长为 $${(k + 2) * w - d}$ 英寸。每条腰长多少英寸？`,
      w,
      [w + d, k * w - d, w + k],
      `With equal sides $s$, the perimeter is $s + s + ${k}s - ${d} = ${k + 2}s - ${d}$. Setting it equal gives $${k + 2}s = ${(k + 2) * w}$, so $s = ${w}$.`,
      `设腰长为 $s$，周长为 $s + s + ${k}s - ${d} = ${k + 2}s - ${d}$。令其相等得 $${k + 2}s = ${(k + 2) * w}$，所以 $s = ${w}$。`,
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
        `Each price multiplies its own quantity, and the two costs add: $${p}m + ${q}c$.`,
        `每个价格乘以各自的数量，再相加：$${p}m + ${q}c$。`,
      );
    return ask(
      rng,
      `Pens cost $\\$${p}$ each and binders cost $\\$${q}$ each. A student spent $\\$${p * u + q * v}$ and bought $${v}$ binders. How many pens did the student buy?`,
      `钢笔每支 $\\$${p}$，活页夹每个 $\\$${q}$。一名学生花了 $\\$${p * u + q * v}$，买了 $${v}$ 个活页夹。这名学生买了多少支钢笔？`,
      u,
      [v, u + v, u + 2],
      `The binders cost $${q}(${v}) = ${q * v}$ dollars, leaving $${p * u}$ dollars. Dividing by $${p}$ gives $${u}$ pens.`,
      `活页夹花 $${q}(${v}) = ${q * v}$ 美元，还剩 $${p * u}$ 美元。除以 $${p}$ 得 $${u}$ 支。`,
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
        `With $n$ nonfiction books, $n + ${k}n + ${d} = ${n + k * n + d}$. So $${k + 1}n = ${(k + 1) * n}$ and $n = ${n}$.`,
        `设非小说 $n$ 本，$n + ${k}n + ${d} = ${n + k * n + d}$。所以 $${k + 1}n = ${(k + 1) * n}$，$n = ${n}$。`,
      );
    return ask(
      rng,
      `Three consecutive even integers have a sum of $${3 * (2 * n) + 6}$. What is the greatest of the three?`,
      `三个连续偶数之和为 $${3 * (2 * n) + 6}$。其中最大的是多少？`,
      2 * n + 4,
      [2 * n, 2 * n + 2, 2 * n + 6],
      `The integers are $e$, $e + 2$ and $e + 4$, so $3e + 6 = ${6 * n + 6}$ and $e = ${2 * n}$. The greatest is $${2 * n + 4}$.`,
      `三个数为 $e$、$e + 2$、$e + 4$，所以 $3e + 6 = ${6 * n + 6}$，$e = ${2 * n}$。最大的是 $${2 * n + 4}$。`,
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
        `Each extra box adds $${m}$, so the slope is $${m}$. Then $${ys[0]} = ${m}(${s}) + b$ gives $b = ${b}$.`,
        `每多一箱加 $${m}$，所以斜率为 $${m}$。由 $${ys[0]} = ${m}(${s}) + b$ 得 $b = ${b}$。`,
      );
    return ask(
      rng,
      `A linear model passes through the data points $(${xs[0]}, ${ys[0]})$ and $(${xs[3]}, ${ys[3]})$. What value does it predict at $x = ${s + 10}$?`,
      `一个线性模型过数据点 $(${xs[0]}, ${ys[0]})$ 和 $(${xs[3]}, ${ys[3]})$。它预测 $x = ${s + 10}$ 时的值是多少？`,
      m * (s + 10) + b,
      [m * (s + 10), (ys[0] as number) + 10, m * 10 + b],
      `The slope is $\\frac{${ys[3]} - ${ys[0]}}{3} = ${m}$. Moving $10$ units from the first point gives $${ys[0]} + ${m}(10) = ${m * (s + 10) + b}$.`,
      `斜率为 $\\frac{${ys[3]} - ${ys[0]}}{3} = ${m}$。从第一个点移动 $10$ 个单位得 $${ys[0]} + ${m}(10) = ${m * (s + 10) + b}$。`,
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
        `Put $${x}$ in parentheses: $${a}(${x})^2 - ${b}(${x}) + ${c} = ${a * x * x} + ${-b * x} + ${c} = ${a * x * x - b * x + c}$.`,
        `把 $${x}$ 放入括号：$${a}(${x})^2 - ${b}(${x}) + ${c} = ${a * x * x} + ${-b * x} + ${c} = ${a * x * x - b * x + c}$。`,
      );
    return ask(
      rng,
      `If $g(x) = ${lin(a, c)}$ and $g(k) = ${a * b + c}$, what is the value of $k$?`,
      `若 $g(x) = ${lin(a, c)}$ 且 $g(k) = ${a * b + c}$，$k$ 的值是多少？`,
      b,
      [a * (a * b + c) + c, b + c, a * b],
      `Here the output is given, so solve $${a}k + ${c} = ${a * b + c}$: $${a}k = ${a * b}$ and $k = ${b}$.`,
      `这里给出的是函数值，解 $${a}k + ${c} = ${a * b + c}$：$${a}k = ${a * b}$，$k = ${b}$。`,
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
        `Work from the inside out: $g(${x}) = ${a * x - b}$, and then $f(${a * x - b}) = ${(a * x - b) ** 2} + ${c} = ${(a * x - b) ** 2 + c}$.`,
        `由内向外算：$g(${x}) = ${a * x - b}$，于是 $f(${a * x - b}) = ${(a * x - b) ** 2} + ${c} = ${(a * x - b) ** 2 + c}$。`,
      );
    const d = rng.int(2, 6);
    return ask(
      rng,
      `For $f(x) = ${lin(a, b)}$ and $g(x) = ${lin(d, -c)}$, which expression equals $g(f(x))$?`,
      `对 $f(x) = ${lin(a, b)}$，$g(x) = ${lin(d, -c)}$，哪个式子等于 $g(f(x))$？`,
      lin(a * d, b * d - c),
      [lin(a * d, b - c * a), lin(a * d, b * d + c), lin(a + d, b - c)],
      `Replace $x$ in $g$ with the whole of $f(x)$: $${d}(${lin(a, b)}) - ${c} = ${lin(a * d, b * d - c)}$.`,
      `把 $g$ 中的 $x$ 换成整个 $f(x)$：$${d}(${lin(a, b)}) - ${c} = ${lin(a * d, b * d - c)}$。`,
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
        `At $x = 0$ the value is $${b}$, which is the constant, and each step in $x$ changes $y$ by $${m}$.`,
        `$x = 0$ 时值为 $${b}$，这就是常数；$x$ 每增加 $1$，$y$ 变化 $${m}$。`,
      );
    const a = rng.int(1, 4);
    const squares = xs.map((v) => a * v * v + b);
    return ask(
      rng,
      `Which rule fits every pair in the table? ${table("x", "y", xs, squares)}`,
      `哪条规则符合表中每一对？${table("x", "y", xs, squares)}`,
      `y = ${quad(a, 0, b)}`,
      [`y = ${lin(3 * a, b)}`, `y = ${lin(2 * a, b)}`, `y = ${quad(a, 0, b + 1)}`],
      `The differences $${a}$, $${3 * a}$, $${5 * a}$ are not constant, so the rule is not linear. They grow like the differences of squares, and $x = 0$ gives the constant $${b}$.`,
      `差 $${a}$、$${3 * a}$、$${5 * a}$ 不是常数，所以不是线性。它们按平方数之差增长，$x = 0$ 给出常数 $${b}$。`,
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
        `Read the $y$-intercept, $${b}$, where the line crosses the $y$-axis. Then count the rise over the run between grid points to get the slope, $${m}$.`,
        `读 $y$ 轴截距 $${b}$，即直线与 $y$ 轴的交点。再数格点间的纵向变化比横向变化得斜率 $${m}$。`,
        lineFigure(m, b),
      );
    const x = rng.int(-4, 4);
    return ask(
      rng,
      `The graph shows the line $y = f(x)$. What is the value of $f(${x})$?`,
      `图中是直线 $y = f(x)$。$f(${x})$ 的值是多少？`,
      m * x + b,
      [-m * x + b, m * x, x],
      `Find $x = ${x}$ on the horizontal axis and go to the line. The height there is $${m}(${x}) ${sg(b)} = ${m * x + b}$.`,
      `在横轴上找到 $x = ${x}$，走到直线上。那里的高度是 $${m}(${x}) ${sg(b)} = ${m * x + b}$。`,
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
        `Divide the change in height by the change in days: $\\frac{${y3} - ${y1}}{${c}} = ${rate}$.`,
        `用高度的变化除以天数的变化：$\\frac{${y3} - ${y1}}{${c}} = ${rate}$。`,
      );
    }
    return ask(
      rng,
      `What is the average rate of change of $f(x) = ${quad(a, b, 0)}$ from $x = 1$ to $x = ${c + 1}$?`,
      `$f(x) = ${quad(a, b, 0)}$ 从 $x = 1$ 到 $x = ${c + 1}$ 的平均变化率是多少？`,
      a * (c + 2) + b,
      [a * (c + 1) ** 2 + b * (c + 1), 2 * a + b, a * (c + 1) + b],
      `$f(1) = ${a + b}$ and $f(${c + 1}) = ${a * (c + 1) ** 2 + b * (c + 1)}$. The change $${a * (c + 1) ** 2 + b * (c + 1) - a - b}$ divided by $${c}$ is $${a * (c + 2) + b}$.`,
      `$f(1) = ${a + b}$，$f(${c + 1}) = ${a * (c + 1) ** 2 + b * (c + 1)}$。变化量 $${a * (c + 1) ** 2 + b * (c + 1) - a - b}$ 除以 $${c}$ 得 $${a * (c + 2) + b}$。`,
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
        `A square is never negative, so the least value comes when $x = ${h}$ makes the square $0$. That leaves $${k}$.`,
        `平方不会是负数，所以当 $x = ${h}$ 使平方为 $0$ 时取最小值，剩下 $${k}$。`,
      );
    return ask(
      rng,
      `For what value of $x$ does $y = -x^2 + ${2 * h}x + ${k}$ reach its maximum?`,
      `$x$ 为何值时，$y = -x^2 + ${2 * h}x + ${k}$ 取最大值？`,
      h,
      [2 * h, -h, h * h + k],
      `The vertex is at $x = -\\frac{b}{2a} = -\\frac{${2 * h}}{2(-1)} = ${h}$.`,
      `顶点在 $x = -\\frac{b}{2a} = -\\frac{${2 * h}}{2(-1)} = ${h}$。`,
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
        `Points at equal distances from the axis have equal heights. The point is $${d}$ to the right of $x = ${h}$, so its mirror image is at $x = ${h - d}$.`,
        `到对称轴距离相等的点高度相同。该点在 $x = ${h}$ 右侧 $${d}$ 处，其对称点在 $x = ${h - d}$。`,
      );
    return ask(
      rng,
      `The $x$-intercepts of a parabola are $${h - d}$ and $${h + d}$, and its vertex has $y$-coordinate $${-a * d * d}$. What is the value of the function at $x = ${h}$?`,
      `一条抛物线的 $x$ 轴截距为 $${h - d}$ 和 $${h + d}$，顶点的 $y$ 坐标为 $${-a * d * d}$。函数在 $x = ${h}$ 处的值是多少？`,
      -a * d * d,
      [0, a * d * d, h],
      `The axis lies halfway between the intercepts, at $x = ${h}$, and that is where the vertex is. So the value there is the vertex's $y$-coordinate, $${-a * d * d}$.`,
      `对称轴在两截距的正中，即 $x = ${h}$，顶点就在这里。所以此处的值就是顶点的 $y$ 坐标 $${-a * d * d}$。`,
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
        `Moving left means adding inside the square, and moving down means subtracting outside it.`,
        `向左移是在平方内加，向下移是在平方外减。`,
      );
    return ask(
      rng,
      `The vertex of $y = (x - ${h})^2 + ${k}$ is moved $${p}$ units right and $${q}$ units up. What are the coordinates of the new vertex?`,
      `把 $y = (x - ${h})^2 + ${k}$ 的顶点向右移 $${p}$ 个单位，向上移 $${q}$ 个单位。新顶点的坐标是什么？`,
      `(${h + p}, ${k + q})`,
      [`(${h - p}, ${k + q})`, `(${h - p}, ${k - q})`, `(${h + p}, ${k - q})`],
      `The vertex starts at $(${h}, ${k})$. Moving right adds to $x$ and moving up adds to $y$.`,
      `顶点原在 $(${h}, ${k})$。向右移加到 $x$ 上，向上移加到 $y$ 上。`,
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
        `Only the base is raised to the power: $${b}^{${n}} = ${b ** n}$, and $${a}(${b ** n}) = ${a * b ** n}$.`,
        `只有底数取幂：$${b}^{${n}} = ${b ** n}$，$${a}(${b ** n}) = ${a * b ** n}$。`,
      );
    return ask(
      rng,
      `A sample of bacteria starts at $${a * 100}$ and doubles every $${b}$ hours. How many bacteria are there after $${b * n}$ hours?`,
      `一份细菌样本起初有 $${a * 100}$ 个，每 $${b}$ 小时翻一番。$${b * n}$ 小时后有多少个？`,
      a * 100 * 2 ** n,
      [a * 100 * 2 ** (b * n), a * 100 * 2 * n, a * 100 + 2 ** n],
      `In $${b * n}$ hours the number doubles $${n}$ times, so multiply by $2^{${n}} = ${2 ** n}$.`,
      `$${b * n}$ 小时内翻番 $${n}$ 次，所以乘以 $2^{${n}} = ${2 ** n}$。`,
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
        `Growing by $${r}\\%$ means multiplying by $1 + ${r / 100} = ${up}$ each year, so the model is $${a}(${up})^t$.`,
        `增长 $${r}\\%$ 表示每年乘以 $1 + ${r / 100} = ${up}$，所以模型为 $${a}(${up})^t$。`,
      );
    return ask(
      rng,
      `A car bought for $\\$${a * 10}$ loses $${r}\\%$ of its value each year. Which expression gives its value, in dollars, after $n$ years?`,
      `一辆车以 $\\$${a * 10}$ 买入，每年贬值 $${r}\\%$。哪个式子表示 $n$ 年后的价值（美元）？`,
      `${a * 10}(${down})^n`,
      [`${a * 10}(${up})^n`, `${a * 10}(${r / 100})^n`, `${a * 10} - ${r}n`],
      `Losing $${r}\\%$ leaves $${100 - r}\\%$, so the value is multiplied by $${down}$ each year.`,
      `贬值 $${r}\\%$ 后剩 $${100 - r}\\%$，所以价值每年乘以 $${down}$。`,
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
        `At $x = 0$, $${b}^0 = 1$, so $y = ${a} + ${k} = ${a + k}$.`,
        `当 $x = 0$ 时 $${b}^0 = 1$，所以 $y = ${a} + ${k} = ${a + k}$。`,
      );
    return ask(
      rng,
      `As $x$ decreases, the graph of $f(x) = ${a} \\cdot ${b}^x - ${k}$ gets closer and closer to a horizontal line. What is the $y$-value of that line?`,
      `随着 $x$ 减小，$f(x) = ${a} \\cdot ${b}^x - ${k}$ 的图象越来越接近一条水平线。这条线的 $y$ 值是多少？`,
      -k,
      [a - k, 0, k],
      `The term $${a} \\cdot ${b}^x$ is always positive and gets as close to $0$ as we like. So $f(x)$ stays above $${-k}$ and gets close to it.`,
      `$${a} \\cdot ${b}^x$ 总是正数，且可以任意接近 $0$。所以 $f(x)$ 总大于 $${-k}$，并且可以任意接近它。`,
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
        `An $x$-intercept is where $y = 0$: $${a}x = ${a * s}$, so $x = ${s}$.`,
        `$x$ 轴截距处 $y = 0$：$${a}x = ${a * s}$，所以 $x = ${s}$。`,
      );
    return ask(
      rng,
      `Which point is on the graph of $g(x) = (x ${sg(-r)})(x ${sg(-s)})$ and on the $y$-axis?`,
      `哪个点既在 $g(x) = (x ${sg(-r)})(x ${sg(-s)})$ 的图象上，又在 $y$ 轴上？`,
      `(0, ${r * s})`,
      [`(0, ${-r * s})`, `(${r}, 0)`, `(${s}, 0)`],
      `Points on the $y$-axis have $x = 0$, and $g(0) = (${-r})(${-s}) = ${r * s}$.`,
      `$y$ 轴上的点 $x = 0$，且 $g(0) = (${-r})(${-s}) = ${r * s}$。`,
    );
  },
};
