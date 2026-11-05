import type { Rng } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import type { ExamSpec } from "../exam.ts";
import { ask, askExact, lowest, ordinal, sg, spec, words } from "../exam.ts";

// ACT Math Prep, Number and Quantity: exponents and radicals, number theory, complex numbers, matrices and vectors.

const mat = (a: number, b: number, c: number, d: number) => `\\begin{bmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{bmatrix}`;
const four = (rng: Rng, lo: number, hi: number) => [rng.int(lo, hi), rng.int(lo, hi), rng.int(lo, hi), rng.int(lo, hi)] as const;
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const cplx = (a: number, b: number) => (b === 0 ? `${a}` : `${a} ${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}i`);
const composites = [21, 27, 33, 39, 49, 51, 57, 63, 69, 77, 81, 87, 91, 93, 99];

/** actExamNumbers are the exam-style questions of the ACT Number and Quantity unit. */
export const actExamNumbers: ExamSpec[] = [
  spec("Simplifying Integer Powers", "化简整数次幂", ["powers-of-integers"], (rng, hard) => {
    const [a, b, c] = [rng.int(2, 9), rng.int(2, 12), rng.int(2, 9)];
    const v = rng.pick(["x", "y", "a", "n"]);
    if (!hard)
      return ask(
        rng,
        `Which expression is equivalent to $${v}^{${b}} \\cdot ${v}^{${c}}$?`,
        `哪个式子等于 $${v}^{${b}} \\cdot ${v}^{${c}}$？`,
        `${v}^{${b + c}}`,
        [`${v}^{${b * c}}`, `${2}${v}^{${b + c}}`, `${v}^{${Math.abs(b - c) + 1}}`, `${2}${v}^{${b * c}}`, `${v}^{${b + c + 1}}`],
        `Add the exponents: $${b} + ${c} = ${b + c}$.`,
        `指数相加：$${b} + ${c} = ${b + c}$。`,
      );
    return ask(
      rng,
      `Which expression is equivalent to $(${a}${v}^{${b}})^{${c > 4 ? 2 : c}}$?`,
      `哪个式子等于 $(${a}${v}^{${b}})^{${c > 4 ? 2 : c}}$？`,
      `${a ** (c > 4 ? 2 : c)}${v}^{${b * (c > 4 ? 2 : c)}}`,
      [
        `${a}${v}^{${b * (c > 4 ? 2 : c)}}`,
        `${a ** (c > 4 ? 2 : c)}${v}^{${b + (c > 4 ? 2 : c)}}`,
        `${a * (c > 4 ? 2 : c)}${v}^{${b * (c > 4 ? 2 : c)}}`,
        `${a * (c > 4 ? 2 : c)}${v}^{${b + (c > 4 ? 2 : c)}}`,
        `${a ** (c > 4 ? 2 : c) + 1}${v}^{${b * (c > 4 ? 2 : c)}}`,
        `${a ** (c > 4 ? 2 : c) + 2}${v}^{${b * (c > 4 ? 2 : c)}}`,
      ],
      `Raise the coefficient to the power and multiply the exponents.`,
      `系数取该次幂，指数相乘。`,
    );
  }),
  spec("Simplifying Negative Exponents", "化简负指数", ["negative-exponents"], (rng, hard) => {
    const [a, n, b, c] = [rng.int(2, 9), rng.int(1, 3), rng.int(1, 9), rng.int(1, 9)];
    if (!hard)
      return ask(
        rng,
        `What is the value of $${a}^{-${n}} \\cdot ${b + 1}$?`,
        `$${a}^{-${n}} \\cdot ${b + 1}$ 的值是多少？`,
        Q.of(b + 1, a ** n),
        [-(a ** n) * (b + 1), Q.of(a ** n, b + 1), Q.of(-(b + 1), a ** n), a ** n * (b + 1)],
        `$${a}^{-${n}} = \\frac{1}{${a ** n}}$.`,
        `$${a}^{-${n}} = \\frac{1}{${a ** n}}$。`,
      );
    return ask(
      rng,
      `For $x \\ne 0$, which expression is equivalent to $\\frac{x^{${b}}}{x^{${b + c}}}$?`,
      `当 $x \\ne 0$ 时，哪个式子等于 $\\frac{x^{${b}}}{x^{${b + c}}}$？`,
      c === 1 ? "\\frac{1}{x}" : `\\frac{1}{x^{${c}}}`,
      [`x^{${c}}`, `-x^{${c}}`, `x^{${2 * b + c}}`, `\\frac{1}{x^{${2 * b + c}}}`],
      `Subtract the exponents to get $x^{-${c}}$, then take the reciprocal.`,
      `指数相减得 $x^{-${c}}$，再取倒数。`,
    );
  }),
  spec("Applying Scientific Notation", "应用科学记数法", ["scientific-notation"], (rng, hard) => {
    const [a, b, m, n] = [rng.int(2, 4), rng.int(1, 2), rng.int(3, 12), rng.int(2, 9)];
    if (!hard)
      return ask(
        rng,
        `What is $(${a} \\times 10^{${m}})(${b} \\times 10^{${n}})$ in scientific notation?`,
        `$(${a} \\times 10^{${m}})(${b} \\times 10^{${n}})$ 用科学记数法表示是什么？`,
        `${a * b} \\times 10^{${m + n}}`,
        [
          `${a * b} \\times 10^{${m * n}}`,
          `${a + b} \\times 10^{${m + n}}`,
          `${a + b} \\times 10^{${m * n}}`,
          `${a * b} \\times 10^{${m + n + 1}}`,
          `${a * b + 1} \\times 10^{${m + n}}`,
          `${a * b + 2} \\times 10^{${m + n + 1}}`,
        ],
        `Multiply the leading numbers and add the exponents.`,
        `前面的数相乘，指数相加。`,
      );
    const d = rng.int(2, 4);
    return ask(
      rng,
      `A space probe is about $${3 * d} \\times 10^{${m + 1}}$ meters from a planet and $${d} \\times 10^{${n}}$ meters from a moon. The first distance is how many times the second?`,
      `一个空间探测器距离一颗行星约 $${3 * d} \\times 10^{${m + 1}}$ 米，距离一颗卫星 $${d} \\times 10^{${n}}$ 米。前一距离是后一距离的多少倍？`,
      `3 \\times 10^{${m + 1 - n}}`,
      [`${2 * d} \\times 10^{${m + 1 - n}}`, `3 \\times 10^{${m + 1 + n}}`, `${4 * d * d} \\times 10^{${m + 1 + n}}`],
      `Divide the leading numbers and subtract the exponents.`,
      `前面的数相除，指数相减。`,
    );
  }),
  spec("Simplifying Rational Exponents", "化简有理指数", ["writing-radicals-using-fractional-exponents"], (rng, hard) => {
    const [b, q] = [rng.int(2, 9), rng.pick([2, 3, 4, 5])];
    const p = lowest(rng.int(2, 19), q);
    if (!hard)
      return ask(
        rng,
        `Which expression is equivalent to $x^{\\frac{${p}}{${q}}}$ for $x > 0$?`,
        `当 $x > 0$ 时，哪个式子等于 $x^{\\frac{${p}}{${q}}}$？`,
        `\\sqrt[${q}]{x^{${p}}}`,
        [`\\sqrt[${p}]{x^{${q}}}`, `\\frac{x^{${p}}}{${q}}`, `${p}\\sqrt[${q}]{x}`, `\\frac{${p}}{${q}}x`],
        `The denominator of the exponent is the index of the root.`,
        `指数的分母是根指数。`,
      );
    const e = rng.pick([2, 3]);
    // The exponent stays a true fraction, and the power stays small enough to work by hand.
    const top = e === 2 ? rng.pick([3, 5]) : rng.pick([2, 4]);
    return ask(
      rng,
      `What is the value of $${b ** e}^{\\frac{${top}}{${e}}}$?`,
      `$${b ** e}^{\\frac{${top}}{${e}}}$ 的值是多少？`,
      b ** top,
      [b ** e * top, (b ** e) ** 2, Q.of(b ** e * top, e), b * top],
      `Since $${b ** e} = ${b}^{${e}}$, the value is $${b}^{${top}}$.`,
      `因为 $${b ** e} = ${b}^{${e}}$，所以值为 $${b}^{${top}}$。`,
    );
  }),
  spec("Evaluating Powers", "幂的求值", ["powers-of-integers", "exponents-with-rational-bases"], (rng, hard) => {
    const [a, n, b, c] = [rng.int(2, 9), rng.int(2, 4), rng.int(2, 9), rng.int(2, 9)];
    if (!hard)
      return ask(
        rng,
        `What is the value of $${a}^{${n}} + ${b}^2$?`,
        `$${a}^{${n}} + ${b}^2$ 的值是多少？`,
        a ** n + b * b,
        [a * n + 2 * b, (a + b) ** 2, a ** n + 2 * b, a * n + b * b],
        `$${a ** n} + ${b * b} = ${a ** n + b * b}$.`,
        `$${a ** n} + ${b * b} = ${a ** n + b * b}$。`,
      );
    return ask(
      rng,
      `What is the value of $\\left(\\frac{${b}}{${b + c}}\\right)^2$?`,
      `$\\left(\\frac{${b}}{${b + c}}\\right)^2$ 的值是多少？`,
      Q.of(b * b, (b + c) * (b + c)),
      [Q.of(2 * b, 2 * (b + c)), Q.of(b * b, b + c), Q.of(2 * b, b + c), Q.of(b, (b + c) * (b + c))],
      `Square the numerator and the denominator.`,
      `分子、分母分别平方。`,
    );
  }),
  spec("Reducing Radical Expressions", "化简根式", ["simplifying-square-roots"], (rng, hard) => {
    const [k, r, m] = [rng.int(2, 12), rng.pick([2, 3, 5, 6, 7, 10]), rng.int(2, 9)];
    if (!hard)
      return ask(
        rng,
        `Which expression is equivalent to $\\sqrt{${k * k * r}}$?`,
        `哪个式子等于 $\\sqrt{${k * k * r}}$？`,
        `${k}\\sqrt{${r}}`,
        [`${r}\\sqrt{${k}}`, `${k * r}`, `${k * k}\\sqrt{${r}}`, `${k + r}\\sqrt{${r}}`, `${k * r}\\sqrt{${r}}`, `${k}\\sqrt{${r + 1}}`],
        `$${k * k * r} = ${k * k} \\cdot ${r}$, and $\\sqrt{${k * k}} = ${k}$.`,
        `$${k * k * r} = ${k * k} \\cdot ${r}$，且 $\\sqrt{${k * k}} = ${k}$。`,
      );
    return ask(
      rng,
      `For $x > 0$, which expression is equivalent to $${m}\\sqrt{${k * k * r}x^2}$?`,
      `当 $x > 0$ 时，哪个式子等于 $${m}\\sqrt{${k * k * r}x^2}$？`,
      `${m * k}x\\sqrt{${r}}`,
      [`${m + k}x\\sqrt{${r}}`, `${m * k}\\sqrt{${r}x}`, `${m * k * k}x\\sqrt{${r}}`, `${k}x\\sqrt{${m * r}}`],
      `Take out $${k}x$ and multiply by the $${m}$ in front.`,
      `提出 $${k}x$，再乘前面的 $${m}$。`,
    );
  }),
  spec("Rewriting Radical Sums and Binomials", "改写根式的和与二项式", ["adding-and-subtracting-radical-expressions"], (rng, hard) => {
    const [a, b, r, c] = [rng.int(2, 7), rng.int(2, 7), rng.pick([2, 3, 5, 6, 7]), rng.int(2, 9)];
    if (!hard)
      return ask(
        rng,
        `Which expression is equivalent to $\\sqrt{${a * a * r}} + \\sqrt{${b * b * r}}$?`,
        `哪个式子等于 $\\sqrt{${a * a * r}} + \\sqrt{${b * b * r}}$？`,
        `${a + b}\\sqrt{${r}}`,
        [`\\sqrt{${(a * a + b * b) * r}}`, `${a * b}\\sqrt{${r}}`, `${a + b}\\sqrt{${2 * r}}`, `${a + b + 1}\\sqrt{${r}}`],
        `The terms are $${a}\\sqrt{${r}}$ and $${b}\\sqrt{${r}}$, which combine.`,
        `两项是 $${a}\\sqrt{${r}}$ 和 $${b}\\sqrt{${r}}$，可以合并。`,
      );
    return ask(
      rng,
      `Which expression is equivalent to $(${c} + \\sqrt{${r}})^2$?`,
      `哪个式子等于 $(${c} + \\sqrt{${r}})^2$？`,
      `${c * c + r} + ${2 * c}\\sqrt{${r}}`,
      [`${c * c + r}`, `${c * c + r} + ${c}\\sqrt{${r}}`, `${c * c} + ${2 * c}\\sqrt{${r}}`, `${c * c + 2 * r} + ${2 * c}\\sqrt{${r}}`],
      `Expand: $${c}^2 + 2(${c})\\sqrt{${r}} + ${r}$.`,
      `展开：$${c}^2 + 2(${c})\\sqrt{${r}} + ${r}$。`,
    );
  }),
  spec("Estimating Roots", "估计根", ["approximating-square-roots-and-cube-roots"], (rng, hard) => {
    const n = rng.int(3, 15);
    const v = n * n + rng.int(1, 2 * n);
    const m = rng.int(2, 9);
    const w = m ** 3 + rng.int(1, 3 * m * m);
    if (!hard)
      return ask(
        rng,
        `The value of $\\sqrt{${v}}$ lies between which two consecutive integers?`,
        `$\\sqrt{${v}}$ 的值在哪两个连续整数之间？`,
        `${n} \\text{ and } ${n + 1}`,
        [`${n - 1} \\text{ and } ${n}`, `${n + 1} \\text{ and } ${n + 2}`, `${n + 2} \\text{ and } ${n + 3}`],
        `$${n}^2 = ${n * n}$ and $${n + 1}^2 = ${(n + 1) * (n + 1)}$.`,
        `$${n}^2 = ${n * n}$，$${n + 1}^2 = ${(n + 1) * (n + 1)}$。`,
      );
    return ask(
      rng,
      `The value of $\\sqrt[3]{${w}}$ lies between which two consecutive integers?`,
      `$\\sqrt[3]{${w}}$ 的值在哪两个连续整数之间？`,
      `${m} \\text{ and } ${m + 1}`,
      [`${m - 1} \\text{ and } ${m}`, `${m + 1} \\text{ and } ${m + 2}`, `${m + 2} \\text{ and } ${m + 3}`],
      `$${m}^3 = ${m ** 3}$ and $${m + 1}^3 = ${(m + 1) ** 3}$.`,
      `$${m}^3 = ${m ** 3}$，$${m + 1}^3 = ${(m + 1) ** 3}$。`,
    );
  }),
  spec("Identifying Characteristics of Powers", "判断幂的特征", ["powers-of-integers"], (rng, hard) => {
    const [a, b, n] = [rng.int(2, 9), rng.int(2, 9), rng.int(1, 6)];
    if (!hard)
      return words(
        rng,
        t(
          `If $x < 0$, which of $${a}x^{${2 * n}}$, $${a}x^{${2 * n + 1}}$, $-${a}x^{${2 * n}}$ and $${a}x$ must be positive?`,
          `若 $x < 0$，$${a}x^{${2 * n}}$、$${a}x^{${2 * n + 1}}$、$-${a}x^{${2 * n}}$ 和 $${a}x$ 中哪个一定为正？`,
        ),
        t(`$${a}x^{${2 * n}}$`, `$${a}x^{${2 * n}}$`),
        [t(`$${a}x^{${2 * n + 1}}$`, `$${a}x^{${2 * n + 1}}$`), t(`$-${a}x^{${2 * n}}$`, `$-${a}x^{${2 * n}}$`), t(`$${a}x$`, `$${a}x$`)],
        t(`A negative number raised to an even power is positive.`, `负数的偶次幂是正数。`),
      );
    return ask(
      rng,
      `If $2^{x} = ${a}$, what is the value of $2^{x + ${b}}$?`,
      `当 $2^{x} = ${a}$ 时，$2^{x + ${b}}$ 是多少？`,
      a * 2 ** b,
      [a + 2 ** b, a * 2 * b, a + b, a ** b],
      `$2^{x + ${b}} = 2^{x} \\cdot 2^{${b}} = ${a}(${2 ** b})$.`,
      `$2^{x + ${b}} = 2^{x} \\cdot 2^{${b}} = ${a}(${2 ** b})$。`,
    );
  }),
  spec(
    "Solving Exponential Equations",
    "解指数方程",
    ["solving-exponential-equations-using-logarithms", "negative-exponents"],
    (rng, hard) => {
      const [b, a, c, x] = [rng.pick([2, 3, 5]), rng.int(2, 5), rng.int(-5, 8), rng.int(1, 6)];
      const e = rng.pick([2, 3]);
      if (!hard)
        return ask(
          rng,
          `What value of $x$ satisfies $${b}^{${a}x ${sg(c === 0 ? 1 : c)}} = ${b}^{${a * x + (c === 0 ? 1 : c)}}$?`,
          `哪个 $x$ 满足 $${b}^{${a}x ${sg(c === 0 ? 1 : c)}} = ${b}^{${a * x + (c === 0 ? 1 : c)}}$？`,
          x,
          [x + 1, a * x, Q.of(a * x + (c === 0 ? 1 : c), a), x + a],
          `Equal bases force equal exponents: $${a}x ${sg(c === 0 ? 1 : c)} = ${a * x + (c === 0 ? 1 : c)}$.`,
          `底相同则指数相等：$${a}x ${sg(c === 0 ? 1 : c)} = ${a * x + (c === 0 ? 1 : c)}$。`,
        );
      return ask(
        rng,
        `What value of $x$ satisfies $${b ** e}^{x} = ${b}^{${e * x + a}} \\cdot ${b}^{-${a}}$?`,
        `哪个 $x$ 满足 $${b ** e}^{x} = ${b}^{${e * x + a}} \\cdot ${b}^{-${a}}$？`,
        x,
        [e * x, x + a, x + e, Q.of(x, e)],
        `The left side is $${b}^{${e}x}$ and the right side is $${b}^{${e * x}}$.`,
        `左边是 $${b}^{${e}x}$，右边是 $${b}^{${e * x}}$。`,
      );
    },
  ),
  spec("Finding a Greatest Common Factor", "求最大公因数", ["greatest-common-factor"], (rng, hard) => {
    const [g, p, q] = [rng.int(2, 15), rng.pick([2, 3, 5, 7]), rng.pick([4, 9, 11, 13, 25])];
    const [a, b] = [g * p, g * q];
    const f = gcd(a, b);
    if (!hard)
      return ask(
        rng,
        `What is the greatest common factor of $${a}$ and $${b}$?`,
        `$${a}$ 和 $${b}$ 的最大公因数是多少？`,
        f,
        [(a * b) / f, f * 2, a + b, Math.abs(b - a) + 1 === f ? 1 : Math.abs(b - a) + 1],
        `Compare the prime factors of the two numbers; the shared part is $${f}$.`,
        `比较两数的质因数，公共部分是 $${f}$。`,
      );
    return ask(
      rng,
      `A teacher splits $${a}$ pencils and $${b}$ erasers into identical kits with nothing left over. What is the greatest number of kits?`,
      `老师把 $${a}$ 支铅笔和 $${b}$ 块橡皮分成相同的文具包，没有剩余。最多能分成多少包？`,
      f,
      [(a * b) / f, a + b, f + 1, Math.max(1, f - 1)],
      `The number of kits must divide both counts, so take the greatest common factor.`,
      `包数必须整除两个数量，所以取最大公因数。`,
    );
  }),
  spec("Applying Divisibility Conditions", "应用整除条件", ["divisibility-rules"], (rng, hard) => {
    const [k, m] = [rng.int(5, 90), rng.pick([3, 4, 6, 9])];
    const n = m * k;
    // Four consecutive numbers around n, and for 3 never both n and a neighbor three away.
    const start = n - (m === 3 ? rng.int(1, 2) : rng.int(0, 3));
    const others = [start, start + 1, start + 2, start + 3].filter((v) => v !== n);
    const shown = rng.shuffle([n, ...others]).join(", ");
    const [a, b] = [rng.int(1, 9), rng.int(0, 9)];
    const s = a + b;
    const d = (3 - (s % 3)) % 3;
    if (!hard)
      return askExact(
        rng,
        `Which of the numbers $${shown}$ is divisible by $${m}$?`,
        `$${shown}$ 中哪个数能被 $${m}$ 整除？`,
        n,
        others,
        `$${n} = ${m}(${k})$.`,
        `$${n} = ${m}(${k})$。`,
      );
    return askExact(
      rng,
      `The three-digit number $${a}${b}d$ is divisible by $3$, where $d$ is its last digit. What is the smallest possible value of $d$?`,
      `三位数 $${a}${b}d$ 能被 $3$ 整除，$d$ 是末位数字。$d$ 的最小可能值是多少？`,
      d,
      [0, 1, 2, 3].filter((v) => v !== d),
      `A number is divisible by $3$ when its digit sum is, and $${s} + ${d}$ is the first such sum.`,
      `各位数字之和能被 $3$ 整除时该数能被 $3$ 整除，$${s} + ${d}$ 是第一个这样的和。`,
    );
  }),
  spec("Finding a Least Common Multiple", "求最小公倍数", ["least-common-multiple"], (rng, hard) => {
    const [g, p, q] = [rng.int(2, 8), rng.pick([2, 3, 5]), rng.pick([3, 4, 7, 9, 11])];
    const [a, b] = [g * p, g * q];
    const l = (a * b) / gcd(a, b);
    if (!hard)
      return ask(
        rng,
        `What is the least common multiple of $${a}$ and $${b}$?`,
        `$${a}$ 和 $${b}$ 的最小公倍数是多少？`,
        l,
        [a * b === l ? l + a : a * b, gcd(a, b), a + b, l + b],
        `List multiples, or divide the product by the greatest common factor $${gcd(a, b)}$.`,
        `列出倍数，或用乘积除以最大公因数 $${gcd(a, b)}$。`,
      );
    return ask(
      rng,
      `Two lights flash together, one every $${a}$ seconds and the other every $${b}$ seconds. After how many seconds do they next flash together?`,
      `两盏灯同时闪烁，一盏每 $${a}$ 秒闪一次，另一盏每 $${b}$ 秒闪一次。多少秒后它们再次同时闪烁？`,
      l,
      [a * b === l ? l + a : a * b, a + b, Math.abs(a - b) + 1, l + b],
      `They coincide at the least common multiple of $${a}$ and $${b}$.`,
      `它们在 $${a}$ 和 $${b}$ 的最小公倍数时重合。`,
    );
  }),
  spec("Using Remainders", "运用余数", ["finding-remainders"], (rng, hard) => {
    const [d, q] = [rng.int(3, 12), rng.int(3, 30)];
    const r = rng.int(1, d - 1);
    const n = d * q + r;
    const k = rng.int(2, 5);
    if (!hard)
      return ask(
        rng,
        `What is the remainder when $${n}$ is divided by $${d}$?`,
        `$${n}$ 除以 $${d}$ 的余数是多少？`,
        r,
        [q, r + 1, d - r === r ? r + 2 : d - r, Math.max(0, r - 1) === r ? r + 3 : r - 1],
        `$${n} = ${d}(${q}) + ${r}$.`,
        `$${n} = ${d}(${q}) + ${r}$。`,
      );
    return ask(
      rng,
      `When a positive integer $n$ is divided by $${d}$, the remainder is $${r}$. What is the remainder when $n + ${d * k}$ is divided by $${d}$?`,
      `正整数 $n$ 除以 $${d}$ 余 $${r}$。$n + ${d * k}$ 除以 $${d}$ 的余数是多少？`,
      r,
      [r + 1, d * k, k, 0, d - r],
      `Adding a multiple of $${d}$ does not change the remainder.`,
      `加上 $${d}$ 的倍数不改变余数。`,
    );
  }),
  spec(
    "Finding a Digit in a Repeating Decimal",
    "求循环小数的某一位",
    ["rational-numbers-as-finite-or-repeating-decimals"],
    (rng, hard) => {
      const dig = [rng.int(1, 4), rng.int(5, 9), rng.int(1, 9)] as const;
      const pos = rng.int(10, 200);
      const at = dig[(pos - 1) % 3]!;
      const near = dig.filter((d) => d !== at);
      const period4 = [rng.int(1, 3), rng.int(4, 5), rng.int(6, 7), rng.int(8, 9)] as const;
      if (!hard)
        return askExact(
          rng,
          `In the repeating decimal $0.\\overline{${dig.join("")}}$, what digit is in the ${ordinal(pos)} place after the decimal point?`,
          `循环小数 $0.\\overline{${dig.join("")}}$ 小数点后第 $${pos}$ 位是什么数字？`,
          at,
          [...near, at + 1 > 9 ? 0 : at + 1, at === 1 ? 2 : at - 1],
          `The cycle has length $3$ and $${pos} = 3(${Math.floor((pos - 1) / 3)}) + ${((pos - 1) % 3) + 1}$, so this place is number $${((pos - 1) % 3) + 1}$ in the cycle: $${at}$.`,
          `周期长为 $3$，且 $${pos} = 3(${Math.floor((pos - 1) / 3)}) + ${((pos - 1) % 3) + 1}$，所以这一位是循环节中的第 $${((pos - 1) % 3) + 1}$ 个数字：$${at}$。`,
        );
      const v = period4[(pos - 1) % 4]!;
      return askExact(
        rng,
        `In the repeating decimal $0.\\overline{${period4.join("")}}$, what digit is in the ${ordinal(pos)} place after the decimal point?`,
        `循环小数 $0.\\overline{${period4.join("")}}$ 小数点后第 $${pos}$ 位是什么数字？`,
        v,
        period4.filter((d) => d !== v),
        `The cycle has length $4$ and $${pos} = 4(${Math.floor((pos - 1) / 4)}) + ${((pos - 1) % 4) + 1}$, so this place is number $${((pos - 1) % 4) + 1}$ in the cycle: $${v}$.`,
        `周期长为 $4$，且 $${pos} = 4(${Math.floor((pos - 1) / 4)}) + ${((pos - 1) % 4) + 1}$，所以这一位是循环节中的第 $${((pos - 1) % 4) + 1}$ 个数字：$${v}$。`,
      );
    },
  ),
  spec("Comparing Repeating Decimals", "比较循环小数", ["writing-repeating-decimals-as-fractions"], (rng, hard) => {
    const [a, b, w] = [rng.int(1, 8), rng.int(12, 98), rng.int(1, 5)];
    const c = b % 11 === 0 ? b + 1 : b;
    if (!hard)
      return ask(
        rng,
        `Which fraction equals $${w}.\\overline{${a}}$?`,
        `哪个分数等于 $${w}.\\overline{${a}}$？`,
        Q.of(9 * w + a, 9),
        [Q.of(10 * w + a, 10), Q.of(9 * w + a, 10), Q.of(99 * w + a, 99), Q.of(9 * w + a + 1, 9)],
        `A one-digit cycle is that digit over $9$, so the number is $${w} + \\frac{${a}}{9}$.`,
        `一位循环节等于该数字除以 $9$，所以这个数是 $${w} + \\frac{${a}}{9}$。`,
      );
    return ask(
      rng,
      `Which of these numbers is the greatest?`,
      `这些数中哪个最大？`,
      `0.\\overline{${c}}`,
      [`0.${c}`, `0.${c}1`, `0.\\overline{${c - 1}}`],
      `Write out the digits and compare place by place: $0.\\overline{${c}} = 0.${c}${c}\\ldots$ agrees with $0.${c}$ and then keeps going, and it passes $0.${c}1$ within the next digits.`,
      `写出各位数字并逐位比较：$0.\\overline{${c}} = 0.${c}${c}\\ldots$ 与 $0.${c}$ 开头相同，但还在继续，并在接下来的数位超过 $0.${c}1$。`,
    );
  }),
  spec("Using Prime Factorizations", "运用质因数分解", ["prime-factorization"], (rng, hard) => {
    const [a, b, c] = [rng.int(1, 5), rng.int(1, 4), rng.int(1, 3)];
    const n = 2 ** a * 3 ** b * 5 ** c;
    if (!hard)
      return ask(
        rng,
        `What is the prime factorization of $${n}$?`,
        `$${n}$ 的质因数分解是什么？`,
        `2^{${a}} \\cdot 3^{${b}} \\cdot 5^{${c}}`,
        [
          `2^{${a + 1}} \\cdot 3^{${b}} \\cdot 5^{${c}}`,
          `2^{${a}} \\cdot 3^{${b + 1}} \\cdot 5^{${c}}`,
          `2^{${a}} \\cdot 3^{${b}} \\cdot 5^{${c + 1}}`,
        ],
        `Divide out $2$, then $3$, then $5$.`,
        `依次除去 $2$、$3$、$5$。`,
      );
    return ask(
      rng,
      `How many positive factors does $2^{${a}} \\cdot 3^{${b}} \\cdot 5^{${c}}$ have?`,
      `$2^{${a}} \\cdot 3^{${b}} \\cdot 5^{${c}}$ 有多少个正因数？`,
      (a + 1) * (b + 1) * (c + 1),
      [a * b * c, a + b + c, a + b + c + 3, (a + 1) * (b + 1) * (c + 1) + 2],
      `Add one to each exponent and multiply.`,
      `每个指数加一后相乘。`,
    );
  }),
  spec("Identifying Prime Numbers", "识别质数", ["prime-and-composite-numbers"], (rng, hard) => {
    const p = rng.pick([23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]);
    const w = rng.shuffle(composites).slice(0, 3);
    const listed = rng.shuffle([p, ...w]).join(", ");
    const lo = rng.int(10, 80);
    const count = Array.from({ length: 10 }, (_, i) => lo + i).filter((v) => {
      for (let d = 2; d * d <= v; d++) if (v % d === 0) return false;
      return true;
    }).length;
    if (!hard)
      return askExact(
        rng,
        `Which of the numbers $${listed}$ is prime?`,
        `$${listed}$ 中哪个数是质数？`,
        p,
        w,
        `The other three have factors other than $1$ and themselves.`,
        `其余三个数还有除 $1$ 和自身以外的因数。`,
      );
    return ask(
      rng,
      `How many prime numbers are there from $${lo}$ through $${lo + 9}$?`,
      `从 $${lo}$ 到 $${lo + 9}$ 有多少个质数？`,
      count,
      [count + 1, count + 2, count + 3],
      `Test each number for small factors, up to its square root.`,
      `对每个数检验不超过其平方根的小因数。`,
    );
  }),
  spec("Determining Parity", "判断奇偶性", ["parity"], (rng, hard) => {
    const [a, b] = [rng.int(2, 9), rng.int(2, 9)];
    const c = 2 * a + 1;
    if (!hard)
      return ask(
        rng,
        `If $n$ is an odd integer, which of $${c}n + ${2 * b + 1}$, $${c}n + ${2 * b}$, $${c}n$ and $n + ${2 * b}$ must be even?`,
        `若 $n$ 是奇数，$${c}n + ${2 * b + 1}$、$${c}n + ${2 * b}$、$${c}n$ 和 $n + ${2 * b}$ 中哪个一定是偶数？`,
        `${c}n + ${2 * b + 1}`,
        [`${c}n + ${2 * b}`, `${c}n`, `n + ${2 * b}`],
        `An odd number times an odd number is odd, and odd plus odd is even.`,
        `奇数乘奇数是奇数，奇数加奇数是偶数。`,
      );
    return ask(
      rng,
      `If $m$ is even and $n$ is odd, which of $m + ${c}n^{${b}}$, $mn + ${2 * a}$, $${c}m$ and $n + ${c}$ must be odd?`,
      `若 $m$ 是偶数、$n$ 是奇数，$m + ${c}n^{${b}}$、$mn + ${2 * a}$、$${c}m$ 和 $n + ${c}$ 中哪个一定是奇数？`,
      `m + ${c}n^{${b}}`,
      [`mn + ${2 * a}`, `${c}m`, `n + ${c}`],
      `Only $m + ${c}n^{${b}}$ is even plus odd.`,
      `只有 $m + ${c}n^{${b}}$ 是偶数加奇数。`,
    );
  }),
  spec(
    "Identifying Irrational Numbers",
    "识别无理数",
    ["classifying-square-roots-and-cube-roots-as-rational-or-irrational"],
    (rng, hard) => {
      const [k, r, c] = [rng.int(2, 12), rng.pick([2, 3, 5, 6, 7, 10]), rng.int(2, 6)];
      if (!hard)
        return ask(
          rng,
          `Which of $\\sqrt{${k * k * r}}$, $\\sqrt{${k * k}}$, $\\frac{${k}}{${r}}$ and $\\sqrt[3]{${k ** 3}}$ is irrational?`,
          `$\\sqrt{${k * k * r}}$、$\\sqrt{${k * k}}$、$\\frac{${k}}{${r}}$ 和 $\\sqrt[3]{${k ** 3}}$ 中哪个是无理数？`,
          `\\sqrt{${k * k * r}}`,
          [`\\sqrt{${k * k}}`, `\\frac{${k}}{${r}}`, `\\sqrt[3]{${k ** 3}}`],
          `$${k * k * r}$ is not a perfect square, since $${r}$ is left under the root.`,
          `$${k * k * r}$ 不是完全平方数，根号内剩下 $${r}$。`,
        );
      return ask(
        rng,
        `Which of $\\sqrt{${r}} \\cdot \\sqrt{${r * c * c}}$, $\\sqrt{${r}} + ${c}$, $${c}\\sqrt{${r}}$ and $\\sqrt{${r}} + \\sqrt{${r * c * c}}$ is rational?`,
        `$\\sqrt{${r}} \\cdot \\sqrt{${r * c * c}}$、$\\sqrt{${r}} + ${c}$、$${c}\\sqrt{${r}}$ 和 $\\sqrt{${r}} + \\sqrt{${r * c * c}}$ 中哪个是有理数？`,
        `\\sqrt{${r}} \\cdot \\sqrt{${r * c * c}}`,
        [`\\sqrt{${r}} + ${c}`, `${c}\\sqrt{${r}}`, `\\sqrt{${r}} + \\sqrt{${r * c * c}}`],
        `The product is $\\sqrt{${r * r * c * c}} = ${r * c}$.`,
        `乘积为 $\\sqrt{${r * r * c * c}} = ${r * c}$。`,
      );
    },
  ),
  spec("Using Properties of Consecutive Integers", "运用连续整数的性质", ["consecutive-integer-problems"], (rng, hard) => {
    const n = rng.int(5, 60);
    if (!hard)
      return ask(
        rng,
        `The sum of three consecutive integers is $${3 * n + 3}$. What is the greatest of the three?`,
        `三个连续整数之和是 $${3 * n + 3}$。其中最大的是多少？`,
        n + 2,
        [n, n + 1, n + 3, n + 4],
        `The middle integer is $\\frac{${3 * n + 3}}{3} = ${n + 1}$.`,
        `中间的数是 $\\frac{${3 * n + 3}}{3} = ${n + 1}$。`,
      );
    return ask(
      rng,
      `The sum of four consecutive even integers is $${4 * (2 * n) + 12}$. What is the least of the four?`,
      `四个连续偶数之和是 $${4 * (2 * n) + 12}$。其中最小的是多少？`,
      2 * n,
      [2 * n + 2, 2 * n + 3, 2 * n + 6, 2 * n - 2],
      `Let the least be $x$: $4x + 12 = ${8 * n + 12}$.`,
      `设最小的数为 $x$：$4x + 12 = ${8 * n + 12}$。`,
    );
  }),
  spec("Identifying True Statements About Integers", "判断关于整数的命题", ["comparing-quantities-under-constraints"], (rng, hard) => {
    const [_a, _b] = [rng.int(2, 9), rng.int(2, 9)];
    const c = rng.int(10, 40);
    if (!hard)
      return words(
        rng,
        t(
          `If $x$ and $y$ are positive integers with $x > y$ and $x + y = ${2 * c + 1}$, which statement must be true?`,
          `若 $x$、$y$ 是正整数，$x > y$，且 $x + y = ${2 * c + 1}$，哪个说法一定正确？`,
        ),
        t(`$x$ is greater than $${c}$.`, `$x$ 大于 $${c}$。`),
        [t(`$y$ is greater than $${c}$.`, `$y$ 大于 $${c}$。`), t(`$x$ is even.`, `$x$ 是偶数。`), t(`$y$ is odd.`, `$y$ 是奇数。`)],
        t(`If $x \\le ${c}$, the sum would be less than $${2 * c + 1}$.`, `若 $x \\le ${c}$，和会小于 $${2 * c + 1}$。`),
      );
    // Each pair shares a factor, so the least common multiple is less than the product.
    const [u0, v0, l0] = rng.pick([
      [4, 6, 12],
      [4, 10, 20],
      [6, 8, 24],
      [6, 9, 18],
      [6, 10, 30],
      [8, 12, 24],
      [9, 12, 36],
      [10, 15, 30],
      [12, 18, 36],
    ] as const);
    const scale = rng.int(1, 4);
    const [u, v, l] = [u0 * scale, v0 * scale, l0 * scale];
    return words(
      rng,
      t(
        `If $n$ is a positive integer divisible by both $${u}$ and $${v}$, which statement must be true?`,
        `若正整数 $n$ 同时能被 $${u}$ 和 $${v}$ 整除，哪个说法一定正确？`,
      ),
      t(`$n$ is divisible by $${l}$.`, `$n$ 能被 $${l}$ 整除。`),
      [
        t(`$n$ is divisible by $${u * v}$.`, `$n$ 能被 $${u * v}$ 整除。`),
        t(`$n$ equals $${l}$.`, `$n$ 等于 $${l}$。`),
        t(`$n$ is divisible by $${u + v}$.`, `$n$ 能被 $${u + v}$ 整除。`),
      ],
      t(
        `$n$ is a common multiple of $${u}$ and $${v}$, and every common multiple is a multiple of the least one, $${l}$. It need not equal $${l}$, and $${u * v}$ is too large to be required.`,
        `$n$ 是 $${u}$ 和 $${v}$ 的公倍数，而每个公倍数都是最小公倍数 $${l}$ 的倍数。它不一定等于 $${l}$，也不一定能被 $${u * v}$ 整除。`,
      ),
    );
  }),
  spec(
    "Simplifying Expressions With the Imaginary Unit",
    "化简含虚数单位的式子",
    ["cyclic-property-of-the-imaginary-unit"],
    (rng, hard) => {
      const n = rng.int(5, 80);
      const vals = ["1", "i", "-1", "-i"];
      const [a, b] = [rng.int(2, 9), rng.int(2, 9)];
      if (!hard)
        return ask(
          rng,
          `What is the value of $i^{${n}}$?`,
          `$i^{${n}}$ 的值是多少？`,
          vals[n % 4]!,
          vals.filter((_, k) => k !== n % 4),
          `The powers repeat every $4$, and $${n}$ leaves a remainder of $${n % 4}$.`,
          `幂每 $4$ 次重复，$${n}$ 除以 $4$ 余 $${n % 4}$。`,
        );
      return ask(
        rng,
        `What is the value of $${a}i^{2} + ${b}i^{4}$?`,
        `$${a}i^{2} + ${b}i^{4}$ 的值是多少？`,
        b - a,
        [a + b, a - b === b - a ? a + b + 1 : a - b, -a - b, a * b],
        `$i^2 = -1$ and $i^4 = 1$.`,
        `$i^2 = -1$，$i^4 = 1$。`,
      );
    },
  ),
  spec("Computing With Complex Numbers", "复数运算", ["cyclic-property-of-the-imaginary-unit"], (rng, hard) => {
    const [a, b, c, d] = four(rng, 1, 9);
    const k = rng.int(2, 5);
    if (!hard)
      return ask(
        rng,
        `What is $(${a} + ${b}i) + (${c} - ${d}i)$?`,
        `$(${a} + ${b}i) + (${c} - ${d}i)$ 等于什么？`,
        cplx(a + c, b - d),
        [cplx(a + c, b + d), cplx(a - c, b - d), `${a + c + b - d || a + c + b + d}i`, cplx(a + c + 1, b - d)],
        `Add the real parts and the imaginary parts separately.`,
        `实部、虚部分别相加。`,
      );
    return ask(
      rng,
      `What is $${k}(${a} + ${b}i) - (${c} - ${d}i)$?`,
      `$${k}(${a} + ${b}i) - (${c} - ${d}i)$ 等于什么？`,
      cplx(k * a - c, k * b + d),
      [cplx(k * a - c, k * b - d), cplx(k * a + c, k * b + d), cplx(a - c, b + d), cplx(k * a - c + 1, k * b + d)],
      `Distribute $${k}$, and subtracting $-${d}i$ adds $${d}i$.`,
      `分配 $${k}$，减去 $-${d}i$ 就是加 $${d}i$。`,
    );
  }),
  spec("Multiplying Complex Numbers", "复数乘法", ["multiplying-binomials"], (rng, hard) => {
    const [a, b, c, d] = four(rng, 1, 9);
    if (!hard)
      return ask(
        rng,
        `What is $${a}i(${c} + ${d}i)$?`,
        `$${a}i(${c} + ${d}i)$ 等于什么？`,
        cplx(-a * d, a * c),
        [cplx(a * d, a * c), `${a * c}i`, cplx(a * c, a * d), cplx(-a * d, a * d), cplx(-a * d + 1, a * c), cplx(a * d, a * c + 1)],
        `$${a}i \\cdot ${d}i = ${a * d}i^2 = ${-a * d}$.`,
        `$${a}i \\cdot ${d}i = ${a * d}i^2 = ${-a * d}$。`,
      );
    return ask(
      rng,
      `What is $(${a} + ${b}i)(${c} + ${d}i)$?`,
      `$(${a} + ${b}i)(${c} + ${d}i)$ 等于什么？`,
      cplx(a * c - b * d, a * d + b * c),
      [cplx(a * c + b * d, a * d + b * c), cplx(a * c, b * d), cplx(a * c - b * d, a * d - b * c), `${a * c - b * d + a * d + b * c}i`],
      `Expand, then use $i^2 = -1$ on the $${b * d}i^2$ term.`,
      `展开后，对 $${b * d}i^2$ 项用 $i^2 = -1$。`,
    );
  }),
  spec("Using Complex Conjugates", "运用共轭复数", ["the-complex-conjugate"], (rng, hard) => {
    const [a, b] = [rng.int(1, 12), rng.int(1, 12)];
    if (!hard)
      return ask(
        rng,
        `What is the complex conjugate of $${a} + ${b}i$?`,
        `$${a} + ${b}i$ 的共轭复数是什么？`,
        cplx(a, -b),
        [cplx(-a, b), cplx(-a, -b), cplx(b, a), cplx(b, -a)],
        `Change only the sign of the imaginary part.`,
        `只改变虚部的符号。`,
      );
    return ask(
      rng,
      `What is $(${a} + ${b}i)(${a} - ${b}i)$?`,
      `$(${a} + ${b}i)(${a} - ${b}i)$ 等于什么？`,
      a * a + b * b,
      [a * a - b * b === a * a + b * b ? 1 : a * a - b * b, cplx(a * a, b * b), a + b, 2 * a * b + 1],
      `The product is $a^2 + b^2 = ${a * a} + ${b * b}$.`,
      `积为 $a^2 + b^2 = ${a * a} + ${b * b}$。`,
    );
  }),
  spec("Dividing Complex Numbers", "复数除法", ["the-complex-conjugate"], (rng, hard) => {
    const [a, b, n] = [rng.int(1, 9), rng.int(1, 9), rng.int(2, 9)];
    const [p, q] = [rng.int(1, 6), rng.int(1, 6)];
    const num = [a * p - b * q, a * q + b * p] as const;
    if (!hard)
      return ask(
        rng,
        `What is $\\frac{${n * a} + ${n * b}i}{${n}}$?`,
        `$\\frac{${n * a} + ${n * b}i}{${n}}$ 等于什么？`,
        cplx(a, b),
        [cplx(n * a, b), cplx(a, n * b), cplx(a + 1, b), cplx(a, b + 1)],
        `Divide both parts by $${n}$.`,
        `两部分都除以 $${n}$。`,
      );
    return ask(
      rng,
      `What is $\\frac{${cplx(num[0], num[1])}}{${p} + ${q}i}$?`,
      `$\\frac{${cplx(num[0], num[1])}}{${p} + ${q}i}$ 等于什么？`,
      cplx(a, b),
      [cplx(a, -b), cplx(b, a), cplx(a + 1, b), cplx(a, b + 1)],
      `Multiply the top and bottom by $${p} - ${q}i$; the denominator becomes $${p * p + q * q}$.`,
      `分子分母同乘 $${p} - ${q}i$，分母变为 $${p * p + q * q}$。`,
    );
  }),
  spec("Combining Matrices", "矩阵加减", ["adding-and-subtracting-matrices"], (rng, hard) => {
    const [a, b, c, d] = four(rng, 1, 9);
    const [e, f, g, h] = four(rng, 1, 9);
    if (!hard)
      return ask(
        rng,
        `What is $${mat(a, b, c, d)} + ${mat(e, f, g, h)}$?`,
        `$${mat(a, b, c, d)} + ${mat(e, f, g, h)}$ 等于什么？`,
        mat(a + e, b + f, c + g, d + h),
        [
          mat(a + e, b + g, c + f, d + h),
          mat(a - e, b - f, c - g, d - h),
          mat(a * e, b * f, c * g, d * h),
          mat(a + e + 1, b + f, c + g, d + h),
        ],
        `Add the entries in matching positions.`,
        `对应位置的项相加。`,
      );
    return ask(
      rng,
      `What is $${mat(a, b, c, d)} - ${mat(e, f, g, h)}$?`,
      `$${mat(a, b, c, d)} - ${mat(e, f, g, h)}$ 等于什么？`,
      mat(a - e, b - f, c - g, d - h),
      [
        mat(e - a, f - b, g - c, h - d),
        mat(a + e, b + f, c + g, d + h),
        mat(a - e, b - f, c - g, d + h),
        mat(a - e + 1, b - f, c - g, d - h),
      ],
      `Subtract the entries in matching positions.`,
      `对应位置的项相减。`,
    );
  }),
  spec("Multiplying a Matrix by a Scalar", "矩阵的数乘", ["scalar-multiplication-of-matrices"], (rng, hard) => {
    const [a, b, c, d] = four(rng, 1, 9);
    const [k, m] = [rng.int(2, 6), rng.int(2, 5)];
    if (!hard)
      return ask(
        rng,
        `What is $${k}${mat(a, b, c, d)}$?`,
        `$${k}${mat(a, b, c, d)}$ 等于什么？`,
        mat(k * a, k * b, k * c, k * d),
        [mat(k * a, b, c, d), mat(k * a, k * b, c, d), mat(k + a, k + b, k + c, k + d), mat(k * a, b, k * c, d)],
        `Multiply every entry by $${k}$.`,
        `每一项都乘 $${k}$。`,
      );
    return ask(
      rng,
      `The matrix $X$ satisfies $${k}X = ${mat(k * a, k * b, k * m * c, k * d)}$. What is the entry in the second row and first column of $X$?`,
      `矩阵 $X$ 满足 $${k}X = ${mat(k * a, k * b, k * m * c, k * d)}$。$X$ 第二行第一列的项是多少？`,
      m * c,
      [k * m * c, b, c, m * c + k],
      `Divide every entry by $${k}$.`,
      `每一项都除以 $${k}$。`,
    );
  }),
  spec("Multiplying Matrices", "矩阵乘法", ["multiplying-matrices"], (rng, hard) => {
    const [a, b, c, d] = four(rng, 1, 6);
    const [e, f, g, h] = four(rng, 1, 6);
    if (!hard)
      return ask(
        rng,
        `What is the entry in the first row and first column of the product $${mat(a, b, c, d)}${mat(e, f, g, h)}$?`,
        `乘积 $${mat(a, b, c, d)}${mat(e, f, g, h)}$ 第一行第一列的项是多少？`,
        a * e + b * g,
        [a * e, a * e + b * f, a * e + c * g, a + e + b + g],
        `Combine row $1$ with column $1$: $${a}(${e}) + ${b}(${g})$.`,
        `第一行与第一列组合：$${a}(${e}) + ${b}(${g})$。`,
      );
    return ask(
      rng,
      `What is $${mat(a, b, c, d)}${mat(e, f, g, h)}$?`,
      `$${mat(a, b, c, d)}${mat(e, f, g, h)}$ 等于什么？`,
      mat(a * e + b * g, a * f + b * h, c * e + d * g, c * f + d * h),
      [
        mat(a * e, b * f, c * g, d * h),
        mat(a * e + c * f, b * e + d * f, a * g + c * h, b * g + d * h),
        mat(a * e + b * f, a * g + b * h, c * e + d * f, c * g + d * h),
        mat(a * e + b * g + 1, a * f + b * h, c * e + d * g, c * f + d * h),
        mat(a * e + b * g, a * f + b * h + 1, c * e + d * g, c * f + d * h),
      ],
      `Each entry combines a row of the first matrix with a column of the second.`,
      `每一项由第一个矩阵的一行与第二个矩阵的一列组合。`,
    );
  }),
  spec("Finding Determinants", "求行列式", ["the-determinant-of-a-2x2-matrix"], (rng, hard) => {
    const [a, b, c, d] = four(rng, 1, 9);
    const x = rng.int(1, 9);
    if (!hard)
      return ask(
        rng,
        `What is the determinant of $${mat(a, b, c, d)}$?`,
        `$${mat(a, b, c, d)}$ 的行列式是多少？`,
        a * d - b * c,
        [
          a * d + b * c,
          b * c - a * d === a * d - b * c ? 1 : b * c - a * d,
          a * b - c * d === a * d - b * c ? 2 : a * b - c * d,
          a * c - b * d === a * d - b * c ? 3 : a * c - b * d,
        ],
        `$${a}(${d}) - ${b}(${c}) = ${a * d - b * c}$.`,
        `$${a}(${d}) - ${b}(${c}) = ${a * d - b * c}$。`,
      );
    const det = a * x - b * c;
    return ask(
      rng,
      `The determinant of $\\begin{bmatrix} ${a} & ${b} \\\\ ${c} & x \\end{bmatrix}$ is $${det}$. What is the value of $x$?`,
      `$\\begin{bmatrix} ${a} & ${b} \\\\ ${c} & x \\end{bmatrix}$ 的行列式是 $${det}$。$x$ 的值是多少？`,
      x,
      [Q.of(det - b * c, a), Q.of(det + a * c, b), x + 1, x + 2],
      `$${a}x - ${b * c} = ${det}$, so $${a}x = ${det + b * c}$.`,
      `$${a}x - ${b * c} = ${det}$，所以 $${a}x = ${det + b * c}$。`,
    );
  }),
  spec("Finding Components of a Vector", "求向量的分量", ["two-dimensional-vectors-expressed-in-component-form"], (rng, hard) => {
    const [a, b, c, d] = four(rng, -9, 9);
    const [p, q] = rng.pick([
      [3, 4],
      [5, 12],
      [6, 8],
      [8, 15],
      [9, 12],
      [7, 24],
    ] as const);
    if (!hard)
      return ask(
        rng,
        `A vector starts at $(${a}, ${b})$ and ends at $(${c}, ${d})$. What is its component form?`,
        `一个向量从 $(${a}, ${b})$ 指向 $(${c}, ${d})$。它的分量形式是什么？`,
        `\\langle ${c - a}, ${d - b} \\rangle`,
        [
          `\\langle ${a - c}, ${b - d} \\rangle`,
          `\\langle ${c + a}, ${d + b} \\rangle`,
          `\\langle ${d - b}, ${c - a} \\rangle`,
          `\\langle ${c - a + 1}, ${d - b + 1} \\rangle`,
          `\\langle ${c - a + 2}, ${d - b} \\rangle`,
        ],
        `Subtract the start from the end.`,
        `终点减起点。`,
      );
    return ask(
      rng,
      `A vector starts at $(${a}, ${b})$ and ends at $(${a + p}, ${b + q})$. What is its magnitude?`,
      `一个向量从 $(${a}, ${b})$ 指向 $(${a + p}, ${b + q})$。它的模是多少？`,
      Math.round(Math.sqrt(p * p + q * q)),
      [p + q, Math.abs(q - p), p * q, Math.round(Math.sqrt(p * p + q * q)) + 1],
      `The components are $${p}$ and $${q}$, so the magnitude is $\\sqrt{${p * p + q * q}}$.`,
      `分量是 $${p}$ 和 $${q}$，所以模是 $\\sqrt{${p * p + q * q}}$。`,
    );
  }),
  spec("Combining Vectors", "向量的合成", ["addition-and-scalar-multiplication-of-cartesian-vectors-in-2d"], (rng, hard) => {
    const [a, b, c, d] = four(rng, -9, 9);
    const k = rng.int(2, 5);
    if (!hard)
      return ask(
        rng,
        `If $\\mathbf{u} = \\langle ${a}, ${b} \\rangle$ and $\\mathbf{v} = \\langle ${c}, ${d} \\rangle$, what is $\\mathbf{u} + \\mathbf{v}$?`,
        `若 $\\mathbf{u} = \\langle ${a}, ${b} \\rangle$，$\\mathbf{v} = \\langle ${c}, ${d} \\rangle$，则 $\\mathbf{u} + \\mathbf{v}$ 是什么？`,
        `\\langle ${a + c}, ${b + d} \\rangle`,
        [
          `\\langle ${a - c}, ${b - d} \\rangle`,
          `\\langle ${a * c}, ${b * d} \\rangle`,
          `\\langle ${a + b}, ${c + d} \\rangle`,
          `\\langle ${a + c + 1}, ${b + d} \\rangle`,
          `\\langle ${a + c}, ${b + d + 1} \\rangle`,
        ],
        `Add matching components.`,
        `对应分量相加。`,
      );
    return ask(
      rng,
      `If $\\mathbf{u} = \\langle ${a}, ${b} \\rangle$ and $\\mathbf{v} = \\langle ${c}, ${d} \\rangle$, what is $${k}\\mathbf{u} - \\mathbf{v}$?`,
      `若 $\\mathbf{u} = \\langle ${a}, ${b} \\rangle$，$\\mathbf{v} = \\langle ${c}, ${d} \\rangle$，则 $${k}\\mathbf{u} - \\mathbf{v}$ 是什么？`,
      `\\langle ${k * a - c}, ${k * b - d} \\rangle`,
      [
        `\\langle ${k * a + c}, ${k * b + d} \\rangle`,
        `\\langle ${k * (a - c)}, ${k * (b - d)} \\rangle`,
        `\\langle ${a - c}, ${b - d} \\rangle`,
        `\\langle ${k * a - c + 1}, ${k * b - d} \\rangle`,
        `\\langle ${k * a - c}, ${k * b - d + 1} \\rangle`,
      ],
      `Multiply $\\mathbf{u}$ by $${k}$, then subtract component by component.`,
      `先把 $\\mathbf{u}$ 乘 $${k}$，再按分量相减。`,
    );
  }),
];
