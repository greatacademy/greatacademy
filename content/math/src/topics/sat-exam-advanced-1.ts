import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import type { ExamSpec } from "../exam.ts";
import { cx, mc, mcExact, sg, spec, spr, tx, words } from "../exam.ts";

// SAT Math Prep, Advanced Math: polynomial, rational and exponential expressions, and quadratic equations.

/** satExamAdvanced1 are the exam-style questions of the first modules of the SAT Advanced Math unit. */
export const satExamAdvanced1: ExamSpec[] = [
  spec("Adding Polynomials", "多项式相加", ["adding-and-subtracting-polynomials"], (rng, hard) => {
    const [a, b, c, d, e, f] = [rng.int(2, 7), rng.int(2, 9), rng.int(1, 9), rng.int(2, 7), rng.int(1, 9), rng.int(1, 9)];
    if (!hard)
      return mc(
        rng,
        t(
          `Which expression is equivalent to $(${a}x^2 + ${b}x - ${c}) + (${d}x^2 - ${e}x + ${f})$?`,
          `哪个式子与 $(${a}x^2 + ${b}x - ${c}) + (${d}x^2 - ${e}x + ${f})$ 等价？`,
        ),
        `${a + d}x^2 ${tx(b - e)} ${sg(f - c)}`,
        [
          `${a + d}x^2 ${tx(b + e)} ${sg(f - c)}`,
          `${a + d}x^4 ${tx(b - e)} ${sg(f - c)}`,
          `${a + d}x^2 ${tx(b - e)} ${sg(f + c)}`,
          `${a + d + 1}x^2 ${tx(b - e)} ${sg(f - c)}`,
        ],
        t(
          `Combine like terms: $x^2$ terms give $${a + d}$, $x$ terms give $${b - e}$, and constants give $${f - c}$.`,
          `合并同类项：$x^2$ 项得 $${a + d}$，$x$ 项得 $${b - e}$，常数项得 $${f - c}$。`,
        ),
      );
    return spr(
      t(
        `If $(${a}x^2 + ${b}x - ${c}) - (${d}x^2 - ${e}x + ${f}) = kx^2 + rx - s$ for all $x$, what is the value of $r$?`,
        `若对所有 $x$，$(${a}x^2 + ${b}x - ${c}) - (${d}x^2 - ${e}x + ${f}) = kx^2 + rx - s$，则 $r$ 的值是多少？`,
      ),
      b + e,
      [b - e, a - d, c + f],
      t(
        `Subtracting changes the sign of $-${e}x$, so the $x$ coefficient is $${b} + ${e} = ${b + e}$.`,
        `相减时 $-${e}x$ 变号，所以 $x$ 的系数是 $${b} + ${e} = ${b + e}$。`,
      ),
    );
  }),
  spec("Adding Polynomials Using the Distributive Law", "用分配律做多项式加法", ["distributive-law-for-polynomials"], (rng, hard) => {
    const [k, a, b, m, c, d] = [rng.int(2, 6), rng.int(2, 6), rng.int(1, 9), rng.int(2, 5), rng.int(1, 6), rng.int(1, 9)];
    const X = k * a + m * c;
    const C = k * b - m * d;
    if (!hard)
      return mc(
        rng,
        t(
          `Which expression is equivalent to $${k}(${a}x + ${b}) + ${m}(${c}x - ${d})$?`,
          `哪个式子与 $${k}(${a}x + ${b}) + ${m}(${c}x - ${d})$ 等价？`,
        ),
        `${X}x ${sg(C)}`,
        [`${X}x ${sg(k * b + m * d)}`, `${a + c}x ${sg(b - d)}`, `${k * a + c}x ${sg(k * b - d)}`, `${X + 1}x ${sg(C)}`],
        t(
          `Distribute: $${k * a}x + ${k * b} + ${m * c}x - ${m * d}$. Combine: $${X}x ${sg(C)}$.`,
          `展开：$${k * a}x + ${k * b} + ${m * c}x - ${m * d}$。合并：$${X}x ${sg(C)}$。`,
        ),
      );
    return spr(
      t(
        `The expression $${k}(${a}x + ${b}) - ${m}(${c}x - ${d})$ is equivalent to $px + q$, where $p$ and $q$ are constants. What is the value of $q$?`,
        `式子 $${k}(${a}x + ${b}) - ${m}(${c}x - ${d})$ 与 $px + q$ 等价，其中 $p$、$q$ 是常数。$q$ 的值是多少？`,
      ),
      k * b + m * d,
      [k * b - m * d, b + d, k * a - m * c],
      t(
        `The second product is subtracted, so its constant becomes $+${m * d}$. Hence $q = ${k * b} + ${m * d} = ${k * b + m * d}$.`,
        `第二个乘积被减去，所以它的常数变成 $+${m * d}$。于是 $q = ${k * b} + ${m * d} = ${k * b + m * d}$。`,
      ),
    );
  }),
  spec("Multiplying Binomials", "二项式相乘", ["multiplying-binomials"], (rng, hard) => {
    const [a, b, c, d] = [rng.int(1, 5), rng.nonZero(-7, 7), rng.int(2, 5), rng.nonZero(-7, 7)];
    const mid = a * d + b * c === 0 ? null : a * d + b * c;
    if (!hard)
      return mc(
        rng,
        t(
          `Which expression is equivalent to $(${cx(a)} ${sg(b)})(${c}x ${sg(d)})$?`,
          `哪个式子与 $(${cx(a)} ${sg(b)})(${c}x ${sg(d)})$ 等价？`,
        ),
        `${a * c}x^2 ${mid === null ? "" : `${tx(mid)} `}${sg(b * d)}`,
        [
          `${a * c}x^2 ${sg(b * d)}${mid === null ? "x" : ""}`,
          `${a * c}x^2 ${tx((mid ?? 0) + 1)} ${sg(b + d)}`,
          `${a + c}x^2 ${tx((mid ?? 0) + 2)} ${sg(b * d)}`,
          `${a * c}x ${sg(b * d)}`,
        ],
        t(
          `Multiply each term by each term. The outer and inner products give $${a * d + b * c}x$, and the ends give $${a * c}x^2$ and $${b * d}$.`,
          `每一项都与每一项相乘。外项和内项之积合为 $${a * d + b * c}x$，首尾之积为 $${a * c}x^2$ 和 $${b * d}$。`,
        ),
      );
    return spr(
      t(
        `If $(${cx(a)} ${sg(b)})(${c}x ${sg(d)}) = rx^2 + sx + u$ for all $x$, what is the value of $r + s + u$?`,
        `若对所有 $x$，$(${cx(a)} ${sg(b)})(${c}x ${sg(d)}) = rx^2 + sx + u$，则 $r + s + u$ 的值是多少？`,
      ),
      (a + b) * (c + d),
      [a * c + b * d, a + b + c + d, a * c + b * d + 1],
      t(
        `Setting $x = 1$ makes the right side $r + s + u$, so the sum is $(${a} ${sg(b)})(${c} ${sg(d)}) = ${(a + b) * (c + d)}$.`,
        `令 $x = 1$，右边就是 $r + s + u$，所以和为 $(${a} ${sg(b)})(${c} ${sg(d)}) = ${(a + b) * (c + d)}$。`,
      ),
    );
  }),
  spec("Factoring Polynomials Using the GCF", "提公因式分解多项式", ["factoring-polynomials-using-gcfs"], (rng, hard) => {
    const g = rng.int(2, 6);
    const [a, b, c] = [rng.pick([2, 3, 5]), rng.pick([3, 7]), rng.int(1, 9)];
    if (!hard)
      return mc(
        rng,
        t(`Which expression is equivalent to $${g * a}x^2 + ${g * b}x$?`, `哪个式子与 $${g * a}x^2 + ${g * b}x$ 等价？`),
        `${g}x(${a}x + ${b})`,
        [`${g}(${a}x + ${b})`, `${g}x(${a}x^2 + ${b})`, `${g}x^2(${a} + ${b}x)`, `${g * a}x(x + ${b})`],
        t(`Both terms share $${g}x$. Dividing leaves $${a}x + ${b}$.`, `两项都含 $${g}x$。除以它后剩下 $${a}x + ${b}$。`),
      );
    return spr(
      t(
        `The expression $${g * a}x^3 + ${g * b}x^2 + ${g * c}x$ is equivalent to $${g}x(px^2 + qx + r)$. What is the value of $p + q + r$?`,
        `式子 $${g * a}x^3 + ${g * b}x^2 + ${g * c}x$ 与 $${g}x(px^2 + qx + r)$ 等价。$p + q + r$ 的值是多少？`,
      ),
      a + b + c,
      [g * (a + b + c), a + b, g + a + b + c],
      t(
        `Divide each term by $${g}x$: $p = ${a}$, $q = ${b}$ and $r = ${c}$, so the sum is $${a + b + c}$.`,
        `每项除以 $${g}x$：$p = ${a}$，$q = ${b}$，$r = ${c}$，和为 $${a + b + c}$。`,
      ),
    );
  }),
  spec("Factoring Binomials Using Differences of Squares", "用平方差分解二项式", ["factoring-differences-of-squares"], (rng, hard) => {
    const a = rng.int(2, 9);
    const b = rng.int(1, 9);
    if (!hard)
      return mc(
        rng,
        t(`Which expression is equivalent to $${a * a}x^2 - ${b * b}$?`, `哪个式子与 $${a * a}x^2 - ${b * b}$ 等价？`),
        `(${a}x - ${b})(${a}x + ${b})`,
        [`(${a}x - ${b})^2`, `(${a}x + ${b})^2`, `(${a * a}x - ${b})(x + ${b})`, `(${a}x - ${b * b})(${a}x + 1)`],
        t(`The expression is $(${a}x)^2 - ${b}^2$, a difference of squares.`, `这个式子是 $(${a}x)^2 - ${b}^2$，即平方差。`),
      );
    const u = a + b + rng.int(1, 9);
    return spr(
      t(
        `If $x + y = ${a + b}$ and $x - y = ${u}$, what is the value of $x^2 - y^2$?`,
        `若 $x + y = ${a + b}$，$x - y = ${u}$，则 $x^2 - y^2$ 的值是多少？`,
      ),
      (a + b) * u,
      [a + b + u, u - (a + b), (a + b) * (a + b)],
      t(
        `Since $x^2 - y^2 = (x + y)(x - y)$, the value is $${a + b} \\cdot ${u} = ${(a + b) * u}$, and there is no need to find $x$ and $y$.`,
        `因为 $x^2 - y^2 = (x + y)(x - y)$，值为 $${a + b} \\cdot ${u} = ${(a + b) * u}$，无需求出 $x$ 和 $y$。`,
      ),
    );
  }),
  spec("Factoring Trinomials", "分解三项式", ["factoring-trinomials"], (rng, hard) => {
    const r = rng.int(2, 9);
    const s = r + rng.int(1, 6);
    if (!hard)
      return mc(
        rng,
        t(`Which expression is a factor of $x^2 + ${r + s}x + ${r * s}$?`, `哪个式子是 $x^2 + ${r + s}x + ${r * s}$ 的因式？`),
        `x + ${r}`,
        [`x - ${r}`, `x + ${r * s}`, `x + ${r + s}`, `x - ${s}`],
        t(
          `Two numbers with sum $${r + s}$ and product $${r * s}$ are $${r}$ and $${s}$, so the trinomial is $(x + ${r})(x + ${s})$.`,
          `和为 $${r + s}$、积为 $${r * s}$ 的两数是 $${r}$ 和 $${s}$，所以三项式等于 $(x + ${r})(x + ${s})$。`,
        ),
      );
    return spr(
      t(
        `If $x + ${r}$ is a factor of $x^2 + kx + ${r * s}$, where $k$ is a constant, what is the value of $k$?`,
        `若 $x + ${r}$ 是 $x^2 + kx + ${r * s}$ 的因式，其中 $k$ 是常数，则 $k$ 的值是多少？`,
      ),
      r + s,
      [s, r * s, s - r],
      t(
        `The other factor must be $x + ${s}$, because the constants multiply to $${r * s}$. So $k = ${r} + ${s} = ${r + s}$.`,
        `另一个因式必为 $x + ${s}$，因为常数之积是 $${r * s}$。所以 $k = ${r} + ${s} = ${r + s}$。`,
      ),
    );
  }),
  spec(
    "Factoring Higher-Order Polynomials",
    "分解高次多项式",
    ["factoring-higher-order-polynomials-as-a-difference-of-squares"],
    (rng, hard) => {
      const a = rng.int(2, 12);
      const b = rng.int(2, 7);
      const n = rng.pick([2, 3, 4]);
      if (!hard)
        return mc(
          rng,
          t(`Which expression is equivalent to $x^{${2 * n}} - ${a * a}$?`, `哪个式子与 $x^{${2 * n}} - ${a * a}$ 等价？`),
          `(x^{${n}} - ${a})(x^{${n}} + ${a})`,
          [`(x^{${n}} - ${a})^2`, `(x^{${n}} + ${a})^2`, `(x - ${a})(x^{${2 * n - 1}} + ${a})`, `(x^{${2 * n - 1}} - ${a})(x + ${a})`],
          t(
            `Treat $x^{${2 * n}}$ as $(x^{${n}})^2$, then use the difference of squares.`,
            `把 $x^{${2 * n}}$ 看作 $(x^{${n}})^2$，再用平方差公式。`,
          ),
        );
      return mc(
        rng,
        t(`Which expression is equivalent to $${a * a}x^4 - ${b * b}x^2$?`, `哪个式子与 $${a * a}x^4 - ${b * b}x^2$ 等价？`),
        `x^2(${a}x - ${b})(${a}x + ${b})`,
        [`x^2(${a}x - ${b})^2`, `(${a}x^2 - ${b})(${a}x^2 + ${b})`, `x(${a}x - ${b})(${a}x + ${b})`, `x^2(${a * a}x - ${b})(x + ${b})`],
        t(
          `Take out $x^2$ first, leaving $${a * a}x^2 - ${b * b}$, and then factor that difference of squares.`,
          `先提出 $x^2$，剩下 $${a * a}x^2 - ${b * b}$，再按平方差分解。`,
        ),
      );
    },
  ),
  spec(
    "Simplifying Rational Expressions by Factoring",
    "因式分解化简分式",
    ["simplifying-rational-expressions-by-factoring"],
    (rng, hard) => {
      const a = rng.int(2, 9);
      const k = rng.int(2, 6);
      if (!hard)
        return mc(
          rng,
          t(
            `For $x > ${a}$, which expression is equivalent to $\\frac{${k}x^2 - ${k * a * a}}{x - ${a}}$?`,
            `当 $x > ${a}$ 时，哪个式子与 $\\frac{${k}x^2 - ${k * a * a}}{x - ${a}}$ 等价？`,
          ),
          `${k}x + ${k * a}`,
          [`${k}x - ${k * a}`, `x + ${a}`, `${k}x + ${a}`, `${k}x + ${k * a * a}`],
          t(
            `Factor the numerator as $${k}(x - ${a})(x + ${a})$ and cancel $x - ${a}$.`,
            `把分子分解为 $${k}(x - ${a})(x + ${a})$，约去 $x - ${a}$。`,
          ),
        );
      return mc(
        rng,
        t(
          `For $x > 0$, which expression is equivalent to $\\frac{${k}x^2 + ${k * a}x}{${k}x}$?`,
          `当 $x > 0$ 时，哪个式子与 $\\frac{${k}x^2 + ${k * a}x}{${k}x}$ 等价？`,
        ),
        `x + ${a}`,
        [`x + ${k * a}`, `${k}x + ${a}`, `x^2 + ${a}`, `x + ${a + k}`],
        t(`Factor the numerator as $${k}x(x + ${a})$ and cancel $${k}x$.`, `把分子分解为 $${k}x(x + ${a})$，约去 $${k}x$。`),
      );
    },
  ),
  spec(
    "Simplifying Rational Expressions Using Polynomial Factorization",
    "用多项式分解化简分式",
    ["simplifying-rational-expressions-using-polynomial-factorization"],
    (rng, hard) => {
      const r = rng.int(1, 7);
      const s = r + rng.int(1, 5);
      const u = s + rng.int(1, 4);
      const num = `x^2 + ${r + s}x + ${r * s}`;
      if (!hard)
        return mc(
          rng,
          t(
            `For $x > 0$, which expression is equivalent to $\\frac{${num}}{x + ${s}}$?`,
            `当 $x > 0$ 时，哪个式子与 $\\frac{${num}}{x + ${s}}$ 等价？`,
          ),
          `x + ${r}`,
          [`x + ${s}`, `x + ${r * s}`, `x + ${r + s}`, `x - ${r}`],
          t(
            `Factor the numerator as $(x + ${r})(x + ${s})$ and cancel $x + ${s}$.`,
            `把分子分解为 $(x + ${r})(x + ${s})$，约去 $x + ${s}$。`,
          ),
        );
      return mc(
        rng,
        t(
          `For $x > 0$, which expression is equivalent to $\\frac{${num}}{x^2 + ${s + u}x + ${s * u}}$?`,
          `当 $x > 0$ 时，哪个式子与 $\\frac{${num}}{x^2 + ${s + u}x + ${s * u}}$ 等价？`,
        ),
        `\\frac{x + ${r}}{x + ${u}}`,
        [`\\frac{x + ${s}}{x + ${u}}`, `\\frac{x + ${r}}{x + ${s}}`, `\\frac{${r}}{${u}}`, `\\frac{x + ${r * s}}{x + ${s * u}}`],
        t(
          `The numerator is $(x + ${r})(x + ${s})$ and the denominator is $(x + ${s})(x + ${u})$, so $x + ${s}$ cancels.`,
          `分子是 $(x + ${r})(x + ${s})$，分母是 $(x + ${s})(x + ${u})$，约去 $x + ${s}$。`,
        ),
      );
    },
  ),
  spec("Adding Rational Expressions", "分式相加", ["adding-and-subtracting-rational-expressions"], (rng, hard) => {
    const [a, b, d] = [rng.int(2, 9), rng.int(1, 9), rng.int(2, 9)];
    const e = d + rng.int(1, 5);
    if (!hard)
      return mc(
        rng,
        t(
          `For $x > 0$, which expression is equivalent to $\\frac{${a}}{x} + \\frac{${b}}{x}$?`,
          `当 $x > 0$ 时，哪个式子与 $\\frac{${a}}{x} + \\frac{${b}}{x}$ 等价？`,
        ),
        `\\frac{${a + b}}{x}`,
        [
          `\\frac{${a + b}}{2x}`,
          `\\frac{${a + b}}{x^2}`,
          `\\frac{${a * b}}{x}`,
          `\\frac{${a * b}}{x^2}`,
          `\\frac{${a + b + 1}}{x}`,
          `\\frac{${a + b + 1}}{2x}`,
        ],
        t(`The denominators already match, so add the numerators and keep the denominator.`, `分母已相同，所以分子相加，分母不变。`),
      );
    return mc(
      rng,
      t(
        `For $x > 0$, which expression is equivalent to $\\frac{${a}}{x + ${d}} + \\frac{${b}}{x + ${e}}$?`,
        `当 $x > 0$ 时，哪个式子与 $\\frac{${a}}{x + ${d}} + \\frac{${b}}{x + ${e}}$ 等价？`,
      ),
      `\\frac{${a + b}x + ${a * e + b * d}}{(x + ${d})(x + ${e})}`,
      [
        `\\frac{${a + b}}{2x + ${d + e}}`,
        `\\frac{${a + b}x + ${a * d + b * e}}{(x + ${d})(x + ${e})}`,
        `\\frac{${a + b}}{(x + ${d})(x + ${e})}`,
        `\\frac{${a + b}x + ${a * e + b * d}}{2x + ${d + e}}`,
      ],
      t(
        `The common denominator is the product. The numerator is $${a}(x + ${e}) + ${b}(x + ${d}) = ${a + b}x + ${a * e + b * d}$.`,
        `公分母是两者之积。分子为 $${a}(x + ${e}) + ${b}(x + ${d}) = ${a + b}x + ${a * e + b * d}$。`,
      ),
    );
  }),
  spec(
    "Further Adding Rational Expressions",
    "进一步的分式相加",
    ["adding-rational-expressions-using-polynomial-factorization"],
    (rng, hard) => {
      const a = rng.int(2, 8);
      const b = rng.int(2, 9);
      const c = rng.int(1, 9);
      if (!hard)
        return mc(
          rng,
          t(
            `For $x > ${a}$, which expression is equivalent to $\\frac{1}{x - ${a}} + \\frac{${c}}{x^2 - ${a * a}}$?`,
            `当 $x > ${a}$ 时，哪个式子与 $\\frac{1}{x - ${a}} + \\frac{${c}}{x^2 - ${a * a}}$ 等价？`,
          ),
          `\\frac{x + ${a + c}}{x^2 - ${a * a}}`,
          [
            `\\frac{${c + 1}}{x^2 - ${a * a}}`,
            `\\frac{x + ${a}}{x^2 - ${a * a}}`,
            `\\frac{x + ${a + c + 1}}{x^2 - ${a * a}}`,
            `\\frac{${c + 1}}{x - ${a}}`,
          ],
          t(
            `The second denominator is $(x - ${a})(x + ${a})$. Rewrite the first fraction over it: its numerator becomes $x + ${a}$, and adding $${c}$ gives $x + ${a + c}$.`,
            `第二个分母是 $(x - ${a})(x + ${a})$。把第一个分式化为这个分母：分子变为 $x + ${a}$，再加 $${c}$ 得 $x + ${a + c}$。`,
          ),
        );
      return spr(
        t(
          `If $\\frac{${b}}{x} + \\frac{${b}}{${a}x} = \\frac{k}{${a}x}$ for all $x > 0$, what is the value of $k$?`,
          `若对所有 $x > 0$，$\\frac{${b}}{x} + \\frac{${b}}{${a}x} = \\frac{k}{${a}x}$，则 $k$ 的值是多少？`,
        ),
        b * (a + 1),
        [2 * b, a + b, a * b],
        t(
          `Rewrite the first fraction with denominator $${a}x$: $\\frac{${a * b}}{${a}x}$. Then $k = ${a * b} + ${b} = ${a * b + b}$.`,
          `把第一个分式的分母化为 $${a}x$：$\\frac{${a * b}}{${a}x}$。于是 $k = ${a * b} + ${b} = ${a * b + b}$。`,
        ),
      );
    },
  ),
  spec("Fractions of Fractions", "繁分式", ["fractions-of-fractions"], (rng, hard) => {
    const [a, b, c] = [rng.int(2, 9), rng.int(2, 9), rng.int(2, 9)];
    if (!hard)
      return mc(
        rng,
        t(
          `For $x > 0$, which expression is equivalent to $\\frac{${a}}{\\frac{${b}}{x}}$?`,
          `当 $x > 0$ 时，哪个式子与 $\\frac{${a}}{\\frac{${b}}{x}}$ 等价？`,
        ),
        `\\frac{${a}x}{${b}}`,
        [`\\frac{${a}}{${b}x}`, `\\frac{${b}x}{${a}}`, `\\frac{${b}}{${a}x}`, `${a * b}x`, `\\frac{${a}x}{${b + 1}}`, `${a + b}x`],
        t(
          `Dividing by a fraction multiplies by its reciprocal: $${a} \\cdot \\frac{x}{${b}}$.`,
          `除以分数等于乘以它的倒数：$${a} \\cdot \\frac{x}{${b}}$。`,
        ),
      );
    return spr(
      t(
        `What is the value of $\\frac{1}{\\frac{1}{x} + \\frac{1}{x}}$ when $x = ${2 * c * a}$?`,
        `当 $x = ${2 * c * a}$ 时，$\\frac{1}{\\frac{1}{x} + \\frac{1}{x}}$ 的值是多少？`,
      ),
      c * a,
      [2 * c * a, 4 * c * a, Q.of(1, c * a)],
      t(
        `The denominator is $\\frac{2}{x}$, so the fraction is $\\frac{x}{2} = ${c * a}$.`,
        `分母为 $\\frac{2}{x}$，所以分式等于 $\\frac{x}{2} = ${c * a}$。`,
      ),
    );
  }),
  spec("Exponential Expressions", "指数表达式", ["product-and-quotient-rules"], (rng, hard) => {
    const [a, b, c] = [rng.int(2, 9), rng.int(2, 9), rng.int(2, 6)];
    if (!hard)
      return mc(
        rng,
        t(`Which expression is equivalent to $x^{${a}} \\cdot x^{${b}}$?`, `哪个式子与 $x^{${a}} \\cdot x^{${b}}$ 等价？`),
        `x^{${a + b}}`,
        [`x^{${a * b}}`, `2x^{${a + b}}`, `x^{${a + b + 1}}`, `${a + b}x^{${a * b}}`, `x^{${a * b + 1}}`],
        t(
          `Multiplying powers of the same base adds the exponents: $${a} + ${b} = ${a + b}$.`,
          `同底数幂相乘，指数相加：$${a} + ${b} = ${a + b}$。`,
        ),
      );
    return spr(
      t(
        `If $\\frac{x^{${a + b}} \\cdot x^{${c}}}{x^{${b}}} = x^{k}$ for all $x > 0$, what is the value of $k$?`,
        `若对所有 $x > 0$，$\\frac{x^{${a + b}} \\cdot x^{${c}}}{x^{${b}}} = x^{k}$，则 $k$ 的值是多少？`,
      ),
      a + c,
      [a + 2 * b + c, a + b, (a + b) * c - b],
      t(`Add and subtract exponents: $${a + b} + ${c} - ${b} = ${a + c}$.`, `指数相加减：$${a + b} + ${c} - ${b} = ${a + c}$。`),
    );
  }),
  spec("Simplifying Exponential Expressions", "化简指数表达式", ["combining-exponential-expressions"], (rng, hard) => {
    const [a, b, c] = [rng.int(2, 5), rng.int(2, 5), rng.int(2, 4)];
    if (!hard)
      return mc(
        rng,
        t(`Which expression is equivalent to $(${a}x^{${b}})^{${c}}$?`, `哪个式子与 $(${a}x^{${b}})^{${c}}$ 等价？`),
        `${a ** c}x^{${b * c}}`,
        [`${a * c}x^{${b * c}}`, `${a}x^{${b * c}}`, `${a ** c}x^{${b + c}}`, `${a ** c + 1}x^{${b * c}}`, `${a ** c}x^{${b * c + 1}}`],
        t(
          `Raise both factors to the power $${c}$: $${a}^{${c}} = ${a ** c}$, and exponents multiply: $${b} \\cdot ${c} = ${b * c}$.`,
          `两个因数都取 $${c}$ 次方：$${a}^{${c}} = ${a ** c}$，指数相乘：$${b} \\cdot ${c} = ${b * c}$。`,
        ),
      );
    const n = rng.pick([2, 3, 4, 5]);
    const m = rng.int(1, n - 1 || 1);
    const k = rng.int(2, 5);
    const root = `${n === 2 ? "\\sqrt" : `\\sqrt[${n}]`}{${m === 1 ? "x" : `x^{${m}}`}}`;
    return mc(
      rng,
      t(
        `For $x > 0$, which expression is equivalent to $${root} \\cdot x^{${k}}$?`,
        `当 $x > 0$ 时，哪个式子与 $${root} \\cdot x^{${k}}$ 等价？`,
      ),
      `x^{${Q.of(m + n * k, n).toLatex()}}`,
      [
        `x^{${Q.of(m * k, n)
          .add(Q.of(m * k === n ? 2 : 0))
          .toLatex()}}`,
        `x^{${Q.of(n + m * k, m + n).toLatex()}}`,
        `x^{${Q.of(n + m, n)
          .add(Q.of(k + 1))
          .toLatex()}}`,
        `x^{${k + m + n}}`,
      ],
      t(
        `A root is a fractional exponent, $x^{${Q.of(m, n).toLatex()}}$. Adding the exponents gives $${Q.of(m, n).toLatex()} + ${k} = ${Q.of(m + n * k, n).toLatex()}$.`,
        `根式是分数指数 $x^{${Q.of(m, n).toLatex()}}$。指数相加得 $${Q.of(m, n).toLatex()} + ${k} = ${Q.of(m + n * k, n).toLatex()}$。`,
      ),
    );
  }),
  spec(
    "Simplifying Exponential Expressions Using the Distributive Law",
    "用分配律化简指数表达式",
    ["applying-the-distributive-law-to-exponential-expressions"],
    (rng, hard) => {
      const [a, b, c] = [rng.int(2, 9), rng.int(2, 6), rng.int(2, 5)];
      if (!hard)
        return mc(
          rng,
          t(`Which expression is equivalent to $x^{${a}}(x^{${b}} + ${c})$?`, `哪个式子与 $x^{${a}}(x^{${b}} + ${c})$ 等价？`),
          `x^{${a + b}} + ${c}x^{${a}}`,
          [
            `x^{${a * b}} + ${c}x^{${a}}`,
            `x^{${a + b}} + ${c}`,
            `${c + 1}x^{${a + b}}`,
            `x^{${a + b}} + x^{${a + c}}`,
            `x^{${a + b + 1}} + ${c}x^{${a}}`,
          ],
          t(`Distribute $x^{${a}}$ to both terms, adding exponents on the first.`, `把 $x^{${a}}$ 分配给两项，第一项指数相加。`),
        );
      const n = rng.pick([2, 3, 5]);
      const p = rng.pick([1, 2]);
      return spr(
        t(
          `The expression $${n}^{${a + p}} + ${n}^{${a}}$ equals $k \\cdot ${n}^{${a}}$. What is the value of $k$?`,
          `式子 $${n}^{${a + p}} + ${n}^{${a}}$ 等于 $k \\cdot ${n}^{${a}}$。$k$ 的值是多少？`,
        ),
        n ** p + 1,
        [n ** p, n ** p + 2, 2 * n ** p + 1],
        t(
          `Factor out $${n}^{${a}}$: $${n}^{${a}}(${p === 1 ? n : `${n}^{${p}}`} + 1) = ${n ** p + 1} \\cdot ${n}^{${a}}$.`,
          `提出 $${n}^{${a}}$：$${n}^{${a}}(${p === 1 ? n : `${n}^{${p}}`} + 1) = ${n ** p + 1} \\cdot ${n}^{${a}}$。`,
        ),
      );
    },
  ),
  spec("Perfect Square Quadratic Equations", "完全平方二次方程", ["solving-perfect-square-quadratic-equations"], (rng, hard) => {
    const [k, b] = [rng.int(2, 9), rng.int(1, 9)];
    if (!hard)
      return mc(
        rng,
        t(`What is the positive solution of $(x - ${b})^2 = ${k * k}$?`, `$(x - ${b})^2 = ${k * k}$ 的正解是多少？`),
        b + k,
        [k, k * k + b, b + 2 * k],
        t(
          `Take square roots: $x - ${b} = \\pm ${k}$, so $x = ${b + k}$ or $x = ${b - k}$. The larger one is $${b + k}$.`,
          `开平方：$x - ${b} = \\pm ${k}$，所以 $x = ${b + k}$ 或 $x = ${b - k}$。较大者为 $${b + k}$。`,
        ),
      );
    return spr(
      t(`What is the sum of the solutions of $(x + ${b})^2 = ${k * k}$?`, `$(x + ${b})^2 = ${k * k}$ 的解之和是多少？`),
      -2 * b,
      [2 * k, -b, 2 * b],
      t(
        `The solutions are $-${b} + ${k}$ and $-${b} - ${k}$. The $\\pm ${k}$ cancels, so the sum is $${-2 * b}$.`,
        `解为 $-${b} + ${k}$ 和 $-${b} - ${k}$。$\\pm ${k}$ 相消，所以和为 $${-2 * b}$。`,
      ),
    );
  }),
  spec("Solving Quadratic Equations Using the Zero-Product Rule", "用零积法解二次方程", ["zero-product-rule"], (rng, hard) => {
    const [a, b, d0] = [rng.int(2, 6), rng.int(1, 9), rng.int(1, 9)];
    const d = d0 === b ? d0 + 1 : d0;
    if (!hard)
      return mcExact(
        rng,
        t(`Which value is a solution of $(x - ${b})(x + ${d}) = 0$?`, `哪个值是 $(x - ${b})(x + ${d}) = 0$ 的解？`),
        b,
        [-b, d, b + d],
        t(
          `A product is zero only when a factor is zero, so $x = ${b}$ or $x = -${d}$.`,
          `乘积为零当且仅当有因式为零，所以 $x = ${b}$ 或 $x = -${d}$。`,
        ),
      );
    return spr(
      t(
        `The equation $(${a}x - ${a * b})(x + ${d}) = 0$ has solutions $p$ and $q$. What is the value of $p + q$?`,
        `方程 $(${a}x - ${a * b})(x + ${d}) = 0$ 的解是 $p$ 和 $q$。$p + q$ 的值是多少？`,
      ),
      b - d,
      [a * b - d, b + d, a * b + d],
      t(
        `Set each factor to zero: $x = ${b}$ and $x = -${d}$, so the sum is $${b - d}$.`,
        `令每个因式为零：$x = ${b}$，$x = -${d}$，所以和为 $${b - d}$。`,
      ),
    );
  }),
  spec("Solving Quadratic Equations by Factoring", "因式分解解二次方程", ["solving-quadratic-equations-by-factoring"], (rng, hard) => {
    const r = rng.int(1, 9);
    const s = r + rng.int(1, 8);
    if (!hard)
      return mc(
        rng,
        t(`What is the greater solution of $x^2 - ${s + r}x + ${r * s} = 0$?`, `$x^2 - ${s + r}x + ${r * s} = 0$ 较大的解是多少？`),
        s,
        [r, -s, r + s],
        t(
          `Factor: $(x - ${r})(x - ${s}) = 0$. The solutions are $${r}$ and $${s}$.`,
          `分解：$(x - ${r})(x - ${s}) = 0$。解为 $${r}$ 和 $${s}$。`,
        ),
      );
    return spr(
      t(
        `If $x^2 - ${s - r}x - ${r * s} = 0$ and $x > 0$, what is the value of $x + ${r}$?`,
        `若 $x^2 - ${s - r}x - ${r * s} = 0$ 且 $x > 0$，则 $x + ${r}$ 的值是多少？`,
      ),
      s + r,
      [s, r, 0],
      t(
        `Factor: $(x - ${s})(x + ${r}) = 0$. The positive solution is $${s}$, so $x + ${r} = ${s + r}$.`,
        `分解：$(x - ${s})(x + ${r}) = 0$。正解为 $${s}$，所以 $x + ${r} = ${s + r}$。`,
      ),
    );
  }),
  spec(
    "Solving Quadratic Equations With Leading Coefficients by Factoring",
    "因式分解解首项系数不为 1 的二次方程",
    ["solving-quadratic-equations-with-leading-coefficients-by-factoring"],
    (rng, hard) => {
      const a = rng.pick([2, 3, 5]);
      const r = rng.int(1, 7);
      const s = rng.pick([1, 2, 3, 4].filter((v) => v % a !== 0));
      if (!hard)
        return mcExact(
          rng,
          t(
            `Which value is a solution of $${a}x^2 ${tx(s - a * r)} - ${r * s} = 0$?`,
            `哪个值是 $${a}x^2 ${tx(s - a * r)} - ${r * s} = 0$ 的解？`,
          ),
          r,
          [-r, s === r ? r + a : s, a * r],
          t(
            `Factor: $(${a}x + ${s})(x - ${r}) = 0$. So $x = ${r}$ or $x = ${Q.of(-s, a).toLatex()}$.`,
            `分解：$(${a}x + ${s})(x - ${r}) = 0$。所以 $x = ${r}$ 或 $x = ${Q.of(-s, a).toLatex()}$。`,
          ),
        );
      return spr(
        t(
          `What is the negative solution of $${a}x^2 ${tx(s - a * r)} - ${r * s} = 0$?`,
          `$${a}x^2 ${tx(s - a * r)} - ${r * s} = 0$ 的负解是多少？`,
        ),
        Q.of(-s, a),
        [Q.of(s, a), -s, -r],
        t(
          `Factor: $(${a}x + ${s})(x - ${r}) = 0$. The negative solution comes from $${a}x + ${s} = 0$, which gives $${Q.of(-s, a).toLatex()}$.`,
          `分解：$(${a}x + ${s})(x - ${r}) = 0$。负解来自 $${a}x + ${s} = 0$，得 $${Q.of(-s, a).toLatex()}$。`,
        ),
      );
    },
  ),
  spec("Solving Quadratic Equations Using the Quadratic Formula", "用求根公式解二次方程", ["the-quadratic-formula"], (rng, hard) => {
    const p = rng.int(1, 6);
    const d = rng.pick([2, 3, 5, 6, 7]);
    const c = p * p - d;
    const eq = `x^2 - ${2 * p}x ${sg(c)} = 0`;
    if (!hard)
      return mc(
        rng,
        t(`Which is a solution of $${eq}$?`, `哪个是 $${eq}$ 的解？`),
        `${p} + \\sqrt{${d}}`,
        [`${2 * p} + \\sqrt{${d}}`, `${p} + \\sqrt{${d * 4}}`, `-${p} + \\sqrt{${d}}`, `${p} + ${d}`],
        t(
          `By the formula, $x = \\frac{${2 * p} \\pm \\sqrt{${4 * d}}}{2} = ${p} \\pm \\sqrt{${d}}$.`,
          `由公式，$x = \\frac{${2 * p} \\pm \\sqrt{${4 * d}}}{2} = ${p} \\pm \\sqrt{${d}}$。`,
        ),
      );
    return spr(
      t(
        `The solutions of $${eq}$ are $r$ and $s$. What is the value of $(r - s)^2$?`,
        `$${eq}$ 的解为 $r$ 和 $s$。$(r - s)^2$ 的值是多少？`,
      ),
      4 * d,
      [d, 2 * d, 4 * p * p],
      t(
        `The solutions are $${p} \\pm \\sqrt{${d}}$, so they differ by $2\\sqrt{${d}}$, and its square is $${4 * d}$.`,
        `解为 $${p} \\pm \\sqrt{${d}}$，相差 $2\\sqrt{${d}}$，其平方为 $${4 * d}$。`,
      ),
    );
  }),
  spec(
    "Quadratic Equations With One Real Solution",
    "有一个实数解的二次方程",
    ["quadratic-equations-with-one-real-solution"],
    (rng, hard) => {
      const k = rng.int(2, 9);
      const a = rng.int(2, 5);
      if (!hard)
        return spr(
          t(
            `The equation $${a}x^2 - ${2 * a * k}x + c = 0$ has exactly one real solution, where $c$ is a constant. What is the value of $c$?`,
            `方程 $${a}x^2 - ${2 * a * k}x + c = 0$ 恰有一个实数解，其中 $c$ 是常数。$c$ 的值是多少？`,
          ),
          a * k * k,
          [k * k, 2 * a * k, 4 * a * k * k],
          t(
            `The discriminant must be zero: $${(2 * a * k) ** 2} - ${4 * a}c = 0$, so $c = ${a * k * k}$.`,
            `判别式必须为零：$${(2 * a * k) ** 2} - ${4 * a}c = 0$，所以 $c = ${a * k * k}$。`,
          ),
        );
      return spr(
        t(
          `The equation $${a}x^2 + bx + ${a * k * k} = 0$ has exactly one real solution, and $b > 0$. What is the value of $b$?`,
          `方程 $${a}x^2 + bx + ${a * k * k} = 0$ 恰有一个实数解，且 $b > 0$。$b$ 的值是多少？`,
        ),
        2 * a * k,
        [a * k, -2 * a * k, 4 * a * a * k * k],
        t(
          `The discriminant must be zero: $b^2 = 4(${a})(${a * k * k}) = ${4 * a * a * k * k}$, so the positive value is $b = ${2 * a * k}$.`,
          `判别式必须为零：$b^2 = 4(${a})(${a * k * k}) = ${4 * a * a * k * k}$，所以正值 $b = ${2 * a * k}$。`,
        ),
      );
    },
  ),
  spec(
    "Quadratic Equations With Two Real Solutions",
    "有两个实数解的二次方程",
    ["determining-unknown-parameters-in-quadratic-equations-with-real-solutions"],
    (rng, hard) => {
      const k = rng.int(2, 9);
      const a = rng.int(1, 4);
      const lim = a * k * k;
      const eq = `${a === 1 ? "" : a}x^2 + ${2 * a * k}x + c = 0`;
      const D = `${(2 * a * k) ** 2} - ${4 * a}c`;
      if (!hard && rng.bool()) {
        const down = `${a === 1 ? "-" : -a}x^2 + ${2 * a * k}x + c = 0`;
        return mcExact(
          rng,
          t(`For which value of $c$ does $${down}$ have two distinct real solutions?`, `$c$ 取何值时，$${down}$ 有两个不同的实数解？`),
          -lim + rng.int(1, 5),
          [-lim, -lim - 1, -lim - 3],
          t(
            `The discriminant $${(2 * a * k) ** 2} + ${4 * a}c$ must be positive, so $c > ${-lim}$. Only one option is above $${-lim}$.`,
            `判别式 $${(2 * a * k) ** 2} + ${4 * a}c$ 必须为正，所以 $c > ${-lim}$。只有一个选项大于 $${-lim}$。`,
          ),
        );
      }
      if (!hard)
        return mcExact(
          rng,
          t(`For which value of $c$ does $${eq}$ have two distinct real solutions?`, `$c$ 取何值时，$${eq}$ 有两个不同的实数解？`),
          lim - rng.int(1, 5),
          [lim, lim + 1, lim + 3],
          t(
            `The discriminant $${D}$ must be positive, so $c < ${lim}$. Only one option is below $${lim}$.`,
            `判别式 $${D}$ 必须为正，所以 $c < ${lim}$。只有一个选项小于 $${lim}$。`,
          ),
        );
      return spr(
        t(
          `The equation $${eq}$ has two distinct real solutions, and $c$ is an integer. What is the greatest possible value of $c$?`,
          `方程 $${eq}$ 有两个不同的实数解，且 $c$ 是整数。$c$ 的最大可能值是多少？`,
        ),
        lim - 1,
        [lim, lim + 1, 2 * a * k],
        t(
          `$${D} > 0$ gives $c < ${lim}$, so the greatest integer is $${lim - 1}$.`,
          `$${D} > 0$ 得 $c < ${lim}$，所以最大整数是 $${lim - 1}$。`,
        ),
      );
    },
  ),
  spec(
    "Quadratic Equations With No Real Solutions",
    "没有实数解的二次方程",
    ["determining-unknown-parameters-in-quadratic-equations-with-no-real-solutions"],
    (rng, hard) => {
      const k = rng.int(2, 9);
      const a = rng.int(1, 4);
      const lim = a * k * k;
      const eq = `${a === 1 ? "" : a}x^2 + ${2 * a * k}x + c = 0`;
      const D = `${(2 * a * k) ** 2} - ${4 * a}c`;
      if (!hard && rng.bool()) {
        const down = `${a === 1 ? "-" : -a}x^2 + ${2 * a * k}x + c = 0`;
        return mcExact(
          rng,
          t(`For which value of $c$ does $${down}$ have no real solutions?`, `$c$ 取何值时，$${down}$ 没有实数解？`),
          -lim - rng.int(1, 5),
          [-lim, -lim + 1, -lim + 3],
          t(
            `No real solutions require a negative discriminant: $${(2 * a * k) ** 2} + ${4 * a}c < 0$, so $c < ${-lim}$.`,
            `没有实数解要求判别式为负：$${(2 * a * k) ** 2} + ${4 * a}c < 0$，所以 $c < ${-lim}$。`,
          ),
        );
      }
      if (!hard)
        return mcExact(
          rng,
          t(`For which value of $c$ does $${eq}$ have no real solutions?`, `$c$ 取何值时，$${eq}$ 没有实数解？`),
          lim + rng.int(1, 5),
          [lim, lim - 1, lim - 3],
          t(
            `No real solutions require a negative discriminant: $${D} < 0$, so $c > ${lim}$.`,
            `没有实数解要求判别式为负：$${D} < 0$，所以 $c > ${lim}$。`,
          ),
        );
      return spr(
        t(
          `The equation $${eq}$ has no real solutions, and $c$ is an integer. What is the least possible value of $c$?`,
          `方程 $${eq}$ 没有实数解，且 $c$ 是整数。$c$ 的最小可能值是多少？`,
        ),
        lim + 1,
        [lim, lim - 1, 2 * a * k + 1],
        t(
          `$${D} < 0$ gives $c > ${lim}$, so the least integer is $${lim + 1}$.`,
          `$${D} < 0$ 得 $c > ${lim}$，所以最小整数是 $${lim + 1}$。`,
        ),
      );
    },
  ),
  spec("Counting Solutions to Quadratic Equations", "判断二次方程解的个数", ["the-discriminant-of-a-quadratic-equation"], (rng, hard) => {
    const a = hard ? rng.int(2, 5) : 1;
    const b = rng.int(2, 9);
    const kind = rng.int(0, 2);
    const k = Math.floor((b * b) / (4 * a));
    const exact = (b * b) % (4 * a) === 0;
    const useKind = kind === 1 && !exact ? 0 : kind;
    const c0 = useKind === 0 ? k - rng.int(1, 3) : useKind === 1 ? k : k + rng.int(1, 3);
    const c = c0 === 0 ? -1 : c0;
    const D = b * b - 4 * a * c;
    const ans = [t("Exactly two", "恰好两个"), t("Exactly one", "恰好一个"), t("Zero", "零个")];
    const eq = `${cx(a, "x^2")} + ${b}x ${sg(c)} = 0`;
    return words(
      rng,
      t(`How many distinct real solutions does $${eq}$ have?`, `$${eq}$ 有多少个不同的实数解？`),
      ans[useKind]!,
      [...ans.filter((_, i) => i !== useKind), t("Infinitely many", "无穷多个")],
      t(
        `The discriminant is $${b}^2 - 4(${a})(${c}) = ${D}$, which is ${D > 0 ? "positive" : D === 0 ? "zero" : "negative"}.`,
        `判别式为 $${b}^2 - 4(${a})(${c}) = ${D}$，它${D > 0 ? "为正" : D === 0 ? "为零" : "为负"}。`,
      ),
    );
  }),
  spec("Applying Vieta's Formulas", "应用韦达定理", ["vietas-formulas"], (rng, hard) => {
    const a = rng.int(2, 6);
    const b = rng.nonZero(-9, 9);
    const c0 = rng.nonZero(-9, 9);
    // The equation must have real solutions, so a positive constant too large for the discriminant changes sign.
    const c = b * b - 4 * a * c0 > 0 ? c0 : -Math.abs(c0);
    const eq = `${a}x^2 ${tx(b)} ${sg(c)} = 0`;
    const sum = Q.of(-b, a);
    if (!hard)
      return mc(
        rng,
        t(`What is the sum of the solutions of $${eq}$?`, `$${eq}$ 的解之和是多少？`),
        sum,
        [Q.of(b, a), Q.of(c, a), Q.of(-c, a), Q.of(-b, a + 1)],
        t(
          `The sum of the solutions of $ax^2 + bx + c = 0$ is $-\\frac{b}{a}$, here $${sum.toLatex()}$.`,
          `$ax^2 + bx + c = 0$ 的解之和为 $-\\frac{b}{a}$，这里是 $${sum.toLatex()}$。`,
        ),
      );
    return spr(
      t(`If $r$ and $s$ are the solutions of $${eq}$, what is the value of $rs$?`, `若 $r$ 和 $s$ 是 $${eq}$ 的解，则 $rs$ 的值是多少？`),
      Q.of(c, a),
      [Q.of(-c, a), Q.of(b, a), c],
      t(
        `The product of the solutions is $\\frac{c}{a}$, here $${Q.of(c, a).toLatex()}$.`,
        `解之积为 $\\frac{c}{a}$，这里是 $${Q.of(c, a).toLatex()}$。`,
      ),
    );
  }),
  spec("Solving Quadratic Equations With Unknown Parameters", "解含未知参数的二次方程", ["vietas-formulas"], (rng, hard) => {
    const r = rng.int(1, 8);
    const s = rng.int(1, 8) + r;
    if (!hard)
      return spr(
        t(
          `One solution of $x^2 - kx + ${r * s} = 0$ is $${r}$, where $k$ is a constant. What is the other solution?`,
          `$x^2 - kx + ${r * s} = 0$ 的一个解是 $${r}$，其中 $k$ 是常数。另一个解是多少？`,
        ),
        s,
        [r + s, r * s, -s],
        t(
          `The product of the solutions is $${r * s}$, so the other solution is $\\frac{${r * s}}{${r}} = ${s}$.`,
          `解之积为 $${r * s}$，所以另一个解是 $\\frac{${r * s}}{${r}} = ${s}$。`,
        ),
      );
    return spr(
      t(
        `One solution of $x^2 - kx + ${r * s} = 0$ is $${r}$, where $k$ is a constant. What is the value of $k$?`,
        `$x^2 - kx + ${r * s} = 0$ 的一个解是 $${r}$，其中 $k$ 是常数。$k$ 的值是多少？`,
      ),
      r + s,
      [s, r * s, s - r],
      t(
        `Substitute $x = ${r}$: $${r * r} - ${r}k + ${r * s} = 0$. Dividing by $${r}$ gives $${r} - k + ${s} = 0$, so $k = ${r + s}$.`,
        `代入 $x = ${r}$：$${r * r} - ${r}k + ${r * s} = 0$。除以 $${r}$ 得 $${r} - k + ${s} = 0$，所以 $k = ${r + s}$。`,
      ),
    );
  }),
];
