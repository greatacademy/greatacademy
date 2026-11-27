import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import type { ExamSpec } from "../exam.ts";
import { cx, mc, mcExact, par, sg, spec, spr, step, tx, words, worked } from "../exam.ts";

// SAT Math Prep, Advanced Math: polynomial, rational and exponential expressions, and quadratic equations.

/** joined writes the terms of a sum that are not empty, one space apart. */
const joined = (...parts: string[]): string => parts.filter(Boolean).join(" ");

/** xt writes a coefficient with $x$, or $0$ when the coefficient is zero. */
const xt = (n: number): string => (n === 0 ? "0" : cx(n));

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
        worked(
          [
            step(
              "Remove the parentheses",
              "去括号",
              `A plus sign in front keeps every sign: $${a}x^2 + ${b}x - ${c} + ${d}x^2 - ${cx(e)} + ${f}$.`,
              `前面是加号，各项符号不变：$${a}x^2 + ${b}x - ${c} + ${d}x^2 - ${cx(e)} + ${f}$。`,
            ),
            step(
              "Combine like terms",
              "合并同类项",
              `$${a}x^2 + ${d}x^2 = ${a + d}x^2$, $${b}x - ${cx(e)} = ${xt(b - e)}$ and $-${c} + ${f} = ${f - c}$.`,
              `$${a}x^2 + ${d}x^2 = ${a + d}x^2$，$${b}x - ${cx(e)} = ${xt(b - e)}$，$-${c} + ${f} = ${f - c}$。`,
            ),
          ],
          t(
            `At $x = 1$ the sum is $(${a} + ${b} - ${c}) + (${d} - ${e} + ${f}) = ${a + b - c + d - e + f}$, and the answer gives $${joined(`${a + d}`, sg(b - e), sg(f - c))} = ${a + b - c + d - e + f}$.`,
            `$x = 1$ 时原式为 $(${a} + ${b} - ${c}) + (${d} - ${e} + ${f}) = ${a + b - c + d - e + f}$，答案给出 $${joined(`${a + d}`, sg(b - e), sg(f - c))} = ${a + b - c + d - e + f}$。`,
          ),
          [
            t(
              `This adds $${cx(e)}$, but the second polynomial has $-${cx(e)}$, so the $x$ terms give $${b} - ${e}$.`,
              `这是加上了 $${cx(e)}$，而第二个多项式中是 $-${cx(e)}$，所以一次项是 $${b} - ${e}$。`,
            ),
            t(
              `Adding like terms adds coefficients only: $${a}x^2 + ${d}x^2 = ${a + d}x^2$, and the power stays $2$.`,
              `合并同类项只把系数相加：$${a}x^2 + ${d}x^2 = ${a + d}x^2$，次数仍是 $2$。`,
            ),
            t(
              `This treats $-${c}$ as $+${c}$; the constants give $-${c} + ${f} = ${f - c}$.`,
              `这是把 $-${c}$ 当成了 $+${c}$；常数项是 $-${c} + ${f} = ${f - c}$。`,
            ),
            t(
              `The $x^2$ coefficients add to $${a} + ${d} = ${a + d}$, not $${a + d + 1}$.`,
              `$x^2$ 的系数之和是 $${a} + ${d} = ${a + d}$，不是 $${a + d + 1}$。`,
            ),
          ],
        ),
      );
    return spr(
      t(
        `If $(${a}x^2 + ${b}x - ${c}) - (${d}x^2 - ${e}x + ${f}) = kx^2 + rx - s$ for all $x$, what is the value of $r$?`,
        `若对所有 $x$，$(${a}x^2 + ${b}x - ${c}) - (${d}x^2 - ${e}x + ${f}) = kx^2 + rx - s$，则 $r$ 的值是多少？`,
      ),
      b + e,
      [b - e, a - d, c + f],
      worked(
        [
          step(
            "Change the signs",
            "变号",
            `Subtracting the second polynomial changes every sign in it: $-${d}x^2 + ${cx(e)} - ${f}$.`,
            `减去第二个多项式，其中每一项都变号：$-${d}x^2 + ${cx(e)} - ${f}$。`,
          ),
          step(
            "Collect the x terms",
            "合并一次项",
            `$${b}x + ${cx(e)} = ${b + e}x$, so $r = ${b + e}$.`,
            `$${b}x + ${cx(e)} = ${b + e}x$，所以 $r = ${b + e}$。`,
          ),
        ],
        t(
          `At $x = 1$ the left side is $(${a} + ${b} - ${c}) - (${d} - ${e} + ${f}) = ${a + b - c - d + e - f}$, and with $k = ${a - d}$, $r = ${b + e}$ and $s = ${c + f}$ the right side is $${a - d} + ${b + e} - ${c + f} = ${a + b - c - d + e - f}$.`,
          `$x = 1$ 时左边为 $(${a} + ${b} - ${c}) - (${d} - ${e} + ${f}) = ${a + b - c - d + e - f}$；取 $k = ${a - d}$，$r = ${b + e}$，$s = ${c + f}$，右边为 $${a - d} + ${b + e} - ${c + f} = ${a + b - c - d + e - f}$。`,
        ),
        [
          t(
            `This keeps the sign of $-${cx(e)}$; subtracting it gives $+${cx(e)}$, so $r = ${b} + ${e}$.`,
            `这是没有给 $-${cx(e)}$ 变号；减去它得 $+${cx(e)}$，所以 $r = ${b} + ${e}$。`,
          ),
          t(`This is $k$, the $x^2$ coefficient $${a} - ${d}$, not $r$.`, `这是 $k$，即 $x^2$ 的系数 $${a} - ${d}$，不是 $r$。`),
          t(`This is $s$: the constants give $-${c} - ${f} = -${c + f}$.`, `这是 $s$：常数项为 $-${c} - ${f} = -${c + f}$。`),
        ],
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
        worked(
          [
            step(
              "Distribute",
              "去括号",
              `$${k}(${a}x + ${b}) = ${k * a}x + ${k * b}$ and $${m}(${cx(c)} - ${d}) = ${m * c}x - ${m * d}$.`,
              `$${k}(${a}x + ${b}) = ${k * a}x + ${k * b}$，$${m}(${cx(c)} - ${d}) = ${m * c}x - ${m * d}$。`,
            ),
            step(
              "Combine like terms",
              "合并同类项",
              `$${k * a}x + ${m * c}x = ${X}x$ and $${k * b} - ${m * d} = ${C}$.`,
              `$${k * a}x + ${m * c}x = ${X}x$，$${k * b} - ${m * d} = ${C}$。`,
            ),
          ],
          t(
            `At $x = 1$ the expression is $${k} \\times ${a + b} + ${m} \\times ${par(c - d)} = ${k * (a + b) + m * (c - d)}$, and $${X} + ${par(C)} = ${X + C}$ as well.`,
            `$x = 1$ 时原式为 $${k} \\times ${a + b} + ${m} \\times ${par(c - d)} = ${k * (a + b) + m * (c - d)}$，而 $${X} + ${par(C)} = ${X + C}$，两者相同。`,
          ),
          [
            t(
              `This writes $${m} \\times (-${d})$ as $+${m * d}$; the product is $-${m * d}$.`,
              `这是把 $${m} \\times (-${d})$ 写成了 $+${m * d}$；乘积应是 $-${m * d}$。`,
            ),
            t(`This drops the parentheses without multiplying by $${k}$ and $${m}$.`, `这是直接去掉括号，没有乘以 $${k}$ 和 $${m}$。`),
            t(
              `This multiplies the first parentheses by $${k}$ but leaves the second one without its factor $${m}$.`,
              `这是第一个括号乘了 $${k}$，第二个括号却没有乘 $${m}$。`,
            ),
            t(
              `The $x$ terms give $${k * a} + ${m * c} = ${X}$, not $${X + 1}$.`,
              `一次项是 $${k * a} + ${m * c} = ${X}$，不是 $${X + 1}$。`,
            ),
          ],
        ),
      );
    return spr(
      t(
        `The expression $${k}(${a}x + ${b}) - ${m}(${c}x - ${d})$ is equivalent to $px + q$, where $p$ and $q$ are constants. What is the value of $q$?`,
        `式子 $${k}(${a}x + ${b}) - ${m}(${c}x - ${d})$ 与 $px + q$ 等价，其中 $p$、$q$ 是常数。$q$ 的值是多少？`,
      ),
      k * b + m * d,
      [k * b - m * d, b + d, k * a - m * c],
      worked(
        [
          step(
            "Distribute the first product",
            "展开第一个乘积",
            `$${k}(${a}x + ${b}) = ${k * a}x + ${k * b}$.`,
            `$${k}(${a}x + ${b}) = ${k * a}x + ${k * b}$。`,
          ),
          step(
            "Subtract the second",
            "减去第二个乘积",
            `$-${m}(${cx(c)} - ${d}) = -${m * c}x + ${m * d}$, since $-${m} \\times (-${d}) = ${m * d}$.`,
            `$-${m}(${cx(c)} - ${d}) = -${m * c}x + ${m * d}$，因为 $-${m} \\times (-${d}) = ${m * d}$。`,
          ),
          step(
            "Collect the constants",
            "合并常数项",
            `$q = ${k * b} + ${m * d} = ${k * b + m * d}$.`,
            `$q = ${k * b} + ${m * d} = ${k * b + m * d}$。`,
          ),
        ],
        t(
          `At $x = 0$ the expression is $${k} \\times ${b} - ${m} \\times (-${d}) = ${k * b + m * d}$, which is $q$.`,
          `$x = 0$ 时原式为 $${k} \\times ${b} - ${m} \\times (-${d}) = ${k * b + m * d}$，正是 $q$。`,
        ),
        [
          t(
            `This subtracts $${m * d}$, but $-${m}$ times $-${d}$ is $+${m * d}$.`,
            `这是减去了 $${m * d}$，但 $-${m}$ 乘 $-${d}$ 得 $+${m * d}$。`,
          ),
          t(
            `This adds $${b}$ and $${d}$ without multiplying by $${k}$ and $${m}$.`,
            `这是把 $${b}$ 和 $${d}$ 直接相加，没有乘以 $${k}$ 和 $${m}$。`,
          ),
          t(`This is $p$, the $x$ coefficient $${k * a} - ${m * c}$, not $q$.`, `这是 $p$，即一次项系数 $${k * a} - ${m * c}$，不是 $q$。`),
        ],
      ),
    );
  }),
  spec("Multiplying Binomials", "二项式相乘", ["multiplying-binomials"], (rng, hard) => {
    const [a, b, c, d] = [rng.int(1, 5), rng.nonZero(-7, 7), rng.int(2, 5), rng.nonZero(-7, 7)];
    const mid = a * d + b * c === 0 ? null : a * d + b * c;
    const S = a * d + b * c;
    const ends = step(
      "First and last terms",
      "首项与末项",
      `$${cx(a)} \\times ${c}x = ${a * c}x^2$ and $${par(b)} \\times ${par(d)} = ${b * d}$.`,
      `$${cx(a)} \\times ${c}x = ${a * c}x^2$，$${par(b)} \\times ${par(d)} = ${b * d}$。`,
    );
    const middle = step(
      "Outer and inner terms",
      "外项与内项",
      `$${cx(a)} \\times ${par(d)} = ${cx(a * d)}$ and $${par(b)} \\times ${c}x = ${cx(b * c)}$, which ${mid === null ? "cancel" : `add to $${cx(S)}$`}.`,
      `$${cx(a)} \\times ${par(d)} = ${cx(a * d)}$，$${par(b)} \\times ${c}x = ${cx(b * c)}$，${mid === null ? "两者相消" : `合为 $${cx(S)}$`}。`,
    );
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
        worked(
          [ends, middle],
          t(
            `At $x = 1$ the product is $(${a} ${sg(b)})(${c} ${sg(d)}) = ${(a + b) * (c + d)}$, and the answer gives $${joined(`${a * c}`, sg(S), sg(b * d))} = ${(a + b) * (c + d)}$.`,
            `$x = 1$ 时乘积为 $(${a} ${sg(b)})(${c} ${sg(d)}) = ${(a + b) * (c + d)}$，答案给出 $${joined(`${a * c}`, sg(S), sg(b * d))} = ${(a + b) * (c + d)}$。`,
          ),
          [
            mid === null
              ? t(
                  `The middle terms cancel, so there is no $x$ term, but this puts an $x$ on the constant $${b * d}$.`,
                  `中间两项相消，没有一次项，这里却给常数 $${b * d}$ 加上了 $x$。`,
                )
              : t(
                  `This multiplies only the first terms and the last terms, leaving out the outer and inner products, $${cx(S)}$.`,
                  `这是只乘了首项与首项、末项与末项，漏掉了外项与内项之积 $${cx(S)}$。`,
                ),
            t(
              `The constant is the product $${par(b)} \\times ${par(d)} = ${b * d}$, not the sum $${b + d}$.`,
              `常数项是乘积 $${par(b)} \\times ${par(d)} = ${b * d}$，不是和 $${b + d}$。`,
            ),
            t(
              `The $x^2$ coefficient is the product $${a} \\times ${c} = ${a * c}$, not the sum $${a + c}$.`,
              `$x^2$ 的系数是乘积 $${a} \\times ${c} = ${a * c}$，不是和 $${a + c}$。`,
            ),
            t(
              `The product of $${cx(a)}$ and $${c}x$ is $${a * c}x^2$, not $${a * c}x$.`,
              `$${cx(a)}$ 与 $${c}x$ 之积是 $${a * c}x^2$，不是 $${a * c}x$。`,
            ),
          ],
        ),
      );
    return spr(
      t(
        `If $(${cx(a)} ${sg(b)})(${c}x ${sg(d)}) = rx^2 + sx + u$ for all $x$, what is the value of $r + s + u$?`,
        `若对所有 $x$，$(${cx(a)} ${sg(b)})(${c}x ${sg(d)}) = rx^2 + sx + u$，则 $r + s + u$ 的值是多少？`,
      ),
      (a + b) * (c + d),
      [a * c + b * d, a + b + c + d, a * c + b * d + 1],
      worked(
        [
          step(
            "Use x = 1",
            "令未知数为一",
            `Setting $x = 1$ turns $rx^2 + sx + u$ into $r + s + u$.`,
            `令 $x = 1$，$rx^2 + sx + u$ 就变成 $r + s + u$。`,
          ),
          step(
            "Evaluate the left side",
            "计算左边",
            `$(${a} ${sg(b)})(${c} ${sg(d)}) = ${par(a + b)} \\times ${par(c + d)} = ${(a + b) * (c + d)}$.`,
            `$(${a} ${sg(b)})(${c} ${sg(d)}) = ${par(a + b)} \\times ${par(c + d)} = ${(a + b) * (c + d)}$。`,
          ),
        ],
        t(
          `Expanding gives $r = ${a * c}$, $s = ${S}$ and $u = ${b * d}$, and $${a * c} + ${par(S)} + ${par(b * d)} = ${(a + b) * (c + d)}$.`,
          `展开得 $r = ${a * c}$，$s = ${S}$，$u = ${b * d}$，而 $${a * c} + ${par(S)} + ${par(b * d)} = ${(a + b) * (c + d)}$。`,
        ),
        [
          t(
            `This adds only $r$ and $u$, leaving out the middle coefficient $s = ${S}$.`,
            `这是只加了 $r$ 和 $u$，漏掉了中间的系数 $s = ${S}$。`,
          ),
          t(
            `This adds the four numbers in the binomials instead of multiplying the binomials out.`,
            `这是把两个二项式里的四个数相加，而不是把二项式乘开。`,
          ),
          t(`This counts the middle coefficient as $1$, but it is $s = ${S}$.`, `这是把中间的系数当成了 $1$，实际上 $s = ${S}$。`),
        ],
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
        worked(
          [
            step(
              "Find a common factor",
              "找公因式",
              `Both terms contain $${g}x$: $${g * a}x^2 = ${g}x \\times ${a}x$ and $${g * b}x = ${g}x \\times ${b}$.`,
              `两项都含 $${g}x$：$${g * a}x^2 = ${g}x \\times ${a}x$，$${g * b}x = ${g}x \\times ${b}$。`,
            ),
            step(
              "Factor it out",
              "提出公因式",
              `$${g * a}x^2 + ${g * b}x = ${g}x(${a}x + ${b})$.`,
              `$${g * a}x^2 + ${g * b}x = ${g}x(${a}x + ${b})$。`,
            ),
          ],
          t(
            `Multiplying back: $${g}x \\times ${a}x + ${g}x \\times ${b} = ${g * a}x^2 + ${g * b}x$.`,
            `乘回去：$${g}x \\times ${a}x + ${g}x \\times ${b} = ${g * a}x^2 + ${g * b}x$。`,
          ),
          [
            t(
              `Expanding gives $${g * a}x + ${g * b}$: an $x$ was dropped instead of being taken out of both terms.`,
              `展开得 $${g * a}x + ${g * b}$：这是把 $x$ 丢掉了，而不是从两项中提出。`,
            ),
            t(
              `Expanding gives $${g * a}x^3 + ${g * b}x$: the first term inside should be $${a}x$, not $${a}x^2$.`,
              `展开得 $${g * a}x^3 + ${g * b}x$：括号内第一项应是 $${a}x$，不是 $${a}x^2$。`,
            ),
            t(
              `Expanding gives $${g * a}x^2 + ${g * b}x^3$: $x^2$ is not a factor of $${g * b}x$.`,
              `展开得 $${g * a}x^2 + ${g * b}x^3$：$x^2$ 不是 $${g * b}x$ 的因式。`,
            ),
            t(
              `Expanding gives $${g * a}x^2 + ${g * a * b}x$: dividing $${g * b}x$ by $${g * a}x$ does not leave $${b}$.`,
              `展开得 $${g * a}x^2 + ${g * a * b}x$：$${g * b}x$ 除以 $${g * a}x$ 得不到 $${b}$。`,
            ),
          ],
        ),
      );
    return spr(
      t(
        `The expression $${g * a}x^3 + ${g * b}x^2 + ${g * c}x$ is equivalent to $${g}x(px^2 + qx + r)$. What is the value of $p + q + r$?`,
        `式子 $${g * a}x^3 + ${g * b}x^2 + ${g * c}x$ 与 $${g}x(px^2 + qx + r)$ 等价。$p + q + r$ 的值是多少？`,
      ),
      a + b + c,
      [g * (a + b + c), a + b, g + a + b + c],
      worked(
        [
          step(
            "Divide each term",
            "逐项相除",
            `$${g * a}x^3 \\div ${g}x = ${a}x^2$, $${g * b}x^2 \\div ${g}x = ${b}x$ and $${g * c}x \\div ${g}x = ${c}$.`,
            `$${g * a}x^3 \\div ${g}x = ${a}x^2$，$${g * b}x^2 \\div ${g}x = ${b}x$，$${g * c}x \\div ${g}x = ${c}$。`,
          ),
          step(
            "Add the coefficients",
            "系数相加",
            `$p + q + r = ${a} + ${b} + ${c} = ${a + b + c}$.`,
            `$p + q + r = ${a} + ${b} + ${c} = ${a + b + c}$。`,
          ),
        ],
        t(
          `At $x = 1$ the expression is $${g * a} + ${g * b} + ${g * c} = ${g * (a + b + c)}$, which is $${g} \\times ${a + b + c}$.`,
          `$x = 1$ 时原式为 $${g * a} + ${g * b} + ${g * c} = ${g * (a + b + c)}$，即 $${g} \\times ${a + b + c}$。`,
        ),
        [
          t(`This adds the original coefficients without dividing them by $${g}$.`, `这是把原来的系数相加，没有除以 $${g}$。`),
          t(`This leaves out $r = ${c}$, the constant inside the parentheses.`, `这是漏掉了括号内的常数 $r = ${c}$。`),
          t(
            `This adds $${g}$ to the sum, but the factor $${g}x$ stays outside the parentheses.`,
            `这是把 $${g}$ 也加进去了，但公因式 $${g}x$ 在括号外。`,
          ),
        ],
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
        worked(
          [
            step(
              "Write both as squares",
              "写成平方",
              `$${a * a}x^2 = (${a}x)^2$ and $${b * b} = ${b}^2$.`,
              `$${a * a}x^2 = (${a}x)^2$，$${b * b} = ${b}^2$。`,
            ),
            step(
              "Use the pattern",
              "套用公式",
              `$p^2 - q^2 = (p - q)(p + q)$ with $p = ${a}x$ and $q = ${b}$.`,
              `$p^2 - q^2 = (p - q)(p + q)$，其中 $p = ${a}x$，$q = ${b}$。`,
            ),
          ],
          t(
            `Expanding: $${a * a}x^2 + ${a * b}x - ${a * b}x - ${b * b} = ${a * a}x^2 - ${b * b}$.`,
            `展开：$${a * a}x^2 + ${a * b}x - ${a * b}x - ${b * b} = ${a * a}x^2 - ${b * b}$。`,
          ),
          [
            t(
              `$(${a}x - ${b})^2 = ${a * a}x^2 - ${2 * a * b}x + ${b * b}$ has a middle term and a plus constant.`,
              `$(${a}x - ${b})^2 = ${a * a}x^2 - ${2 * a * b}x + ${b * b}$，有中间项，常数项也是正的。`,
            ),
            t(
              `$(${a}x + ${b})^2 = ${a * a}x^2 + ${2 * a * b}x + ${b * b}$ has a middle term.`,
              `$(${a}x + ${b})^2 = ${a * a}x^2 + ${2 * a * b}x + ${b * b}$，有中间项。`,
            ),
            t(
              `Expanding gives $${a * a}x^2 + ${a * a * b - b}x - ${b * b}$, whose middle term does not cancel.`,
              `展开得 $${a * a}x^2 + ${a * a * b - b}x - ${b * b}$，中间项没有消去。`,
            ),
            t(
              `Expanding gives $${a * a}x^2 - ${a * b * b - a}x - ${b * b}$, whose middle term does not cancel.`,
              `展开得 $${a * a}x^2 - ${a * b * b - a}x - ${b * b}$，中间项没有消去。`,
            ),
          ],
        ),
      );
    const u = a + b + rng.int(1, 9);
    return spr(
      t(
        `If $x + y = ${a + b}$ and $x - y = ${u}$, what is the value of $x^2 - y^2$?`,
        `若 $x + y = ${a + b}$，$x - y = ${u}$，则 $x^2 - y^2$ 的值是多少？`,
      ),
      (a + b) * u,
      [a + b + u, u - (a + b), (a + b) * (a + b)],
      worked(
        [
          step("Factor", "分解", `$x^2 - y^2 = (x + y)(x - y)$.`, `$x^2 - y^2 = (x + y)(x - y)$。`),
          step("Substitute", "代入", `$${a + b} \\times ${u} = ${(a + b) * u}$.`, `$${a + b} \\times ${u} = ${(a + b) * u}$。`),
        ],
        t(
          `Adding the equations gives $2x = ${a + b + u}$ and subtracting gives $2y = ${a + b - u}$, so $4(x^2 - y^2) = ${a + b + u}^2 - (${a + b - u})^2 = ${4 * (a + b) * u}$, which is $4 \\times ${(a + b) * u}$.`,
          `两式相加得 $2x = ${a + b + u}$，相减得 $2y = ${a + b - u}$，所以 $4(x^2 - y^2) = ${a + b + u}^2 - (${a + b - u})^2 = ${4 * (a + b) * u}$，即 $4 \\times ${(a + b) * u}$。`,
        ),
        [
          t(`This adds the two given values instead of multiplying them.`, `这是把两个已知值相加，而不是相乘。`),
          t(`This subtracts the two given values instead of multiplying them.`, `这是把两个已知值相减，而不是相乘。`),
          t(
            `This squares $x + y$; the factor $x - y = ${u}$ is needed instead of a second $x + y$.`,
            `这是把 $x + y$ 平方了；第二个因式应是 $x - y = ${u}$。`,
          ),
        ],
      ),
    );
  }),
  spec("Factoring Trinomials", "分解三项式", ["factoring-trinomials"], (rng, hard) => {
    const r = rng.int(2, 9);
    const s = r + rng.int(1, 6);
    const pair = step(
      "Find the pair",
      "找出两个数",
      `Two numbers with product $${r * s}$ and sum $${r + s}$ are $${r}$ and $${s}$.`,
      `积为 $${r * s}$、和为 $${r + s}$ 的两个数是 $${r}$ 和 $${s}$。`,
    );
    if (!hard)
      return mc(
        rng,
        t(`Which expression is a factor of $x^2 + ${r + s}x + ${r * s}$?`, `哪个式子是 $x^2 + ${r + s}x + ${r * s}$ 的因式？`),
        `x + ${r}`,
        [`x - ${r}`, `x + ${r * s}`, `x + ${r + s}`, `x - ${s}`],
        worked(
          [
            pair,
            step(
              "Factor",
              "分解",
              `$x^2 + ${r + s}x + ${r * s} = (x + ${r})(x + ${s})$, so $x + ${r}$ is a factor.`,
              `$x^2 + ${r + s}x + ${r * s} = (x + ${r})(x + ${s})$，所以 $x + ${r}$ 是因式。`,
            ),
          ],
          t(
            `At $x = -${r}$ the trinomial is $${r * r} - ${(r + s) * r} + ${r * s} = 0$, as a factor $x + ${r}$ requires.`,
            `$x = -${r}$ 时三项式为 $${r * r} - ${(r + s) * r} + ${r * s} = 0$，符合 $x + ${r}$ 是因式的要求。`,
          ),
          [
            t(
              `A factor $x - ${r}$ would make the trinomial zero at $x = ${r}$, but there it is $${r * r + (r + s) * r + r * s}$.`,
              `若 $x - ${r}$ 是因式，三项式在 $x = ${r}$ 时应为零，但那时它等于 $${r * r + (r + s) * r + r * s}$。`,
            ),
            t(`$${r * s}$ is the product of the two constants, not one of them.`, `$${r * s}$ 是两个常数之积，不是其中一个。`),
            t(`$${r + s}$ is the sum of the two constants, not one of them.`, `$${r + s}$ 是两个常数之和，不是其中一个。`),
            t(
              `A factor $x - ${s}$ would make the trinomial zero at $x = ${s}$, but all its terms are positive there.`,
              `若 $x - ${s}$ 是因式，三项式在 $x = ${s}$ 时应为零，但那时各项都是正的。`,
            ),
          ],
        ),
      );
    return spr(
      t(
        `If $x + ${r}$ is a factor of $x^2 + kx + ${r * s}$, where $k$ is a constant, what is the value of $k$?`,
        `若 $x + ${r}$ 是 $x^2 + kx + ${r * s}$ 的因式，其中 $k$ 是常数，则 $k$ 的值是多少？`,
      ),
      r + s,
      [s, r * s, s - r],
      worked(
        [
          step(
            "Find the other factor",
            "求另一个因式",
            `The constants of the factors multiply to $${r * s}$, so the other factor is $x + ${s}$.`,
            `两个因式的常数之积为 $${r * s}$，所以另一个因式是 $x + ${s}$。`,
          ),
          step(
            "Expand",
            "展开",
            `$(x + ${r})(x + ${s}) = x^2 + ${r + s}x + ${r * s}$, so $k = ${r + s}$.`,
            `$(x + ${r})(x + ${s}) = x^2 + ${r + s}x + ${r * s}$，所以 $k = ${r + s}$。`,
          ),
        ],
        t(
          `At $x = -${r}$ the factor $x + ${r}$ is zero, and so is $${r * r} - ${(r + s) * r} + ${r * s} = 0$.`,
          `$x = -${r}$ 时因式 $x + ${r}$ 为零，而 $${r * r} - ${(r + s) * r} + ${r * s} = 0$ 也为零。`,
        ),
        [
          t(
            `This is the other factor's constant, $${s}$; $k$ is the sum $${r} + ${s}$.`,
            `这是另一个因式的常数 $${s}$；$k$ 是和 $${r} + ${s}$。`,
          ),
          t(`This is the constant term $${r * s}$, a product, not $k$.`, `这是常数项 $${r * s}$，是乘积，不是 $k$。`),
          t(
            `This subtracts $${r}$ from $${s}$, but both constants are positive, so they add.`,
            `这是用 $${s}$ 减 $${r}$，但两个常数都是正的，应相加。`,
          ),
        ],
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
          worked(
            [
              step(
                "See the squares",
                "看出平方",
                `$x^{${2 * n}} = (x^{${n}})^2$ and $${a * a} = ${a}^2$.`,
                `$x^{${2 * n}} = (x^{${n}})^2$，$${a * a} = ${a}^2$。`,
              ),
              step(
                "Factor",
                "分解",
                `By the difference of squares, $x^{${2 * n}} - ${a * a} = (x^{${n}} - ${a})(x^{${n}} + ${a})$.`,
                `由平方差公式，$x^{${2 * n}} - ${a * a} = (x^{${n}} - ${a})(x^{${n}} + ${a})$。`,
              ),
            ],
            t(
              `Expanding: $x^{${2 * n}} + ${a}x^{${n}} - ${a}x^{${n}} - ${a * a} = x^{${2 * n}} - ${a * a}$.`,
              `展开：$x^{${2 * n}} + ${a}x^{${n}} - ${a}x^{${n}} - ${a * a} = x^{${2 * n}} - ${a * a}$。`,
            ),
            [
              t(
                `$(x^{${n}} - ${a})^2 = x^{${2 * n}} - ${2 * a}x^{${n}} + ${a * a}$ has a middle term and a plus constant.`,
                `$(x^{${n}} - ${a})^2 = x^{${2 * n}} - ${2 * a}x^{${n}} + ${a * a}$，有中间项，常数项也是正的。`,
              ),
              t(
                `$(x^{${n}} + ${a})^2 = x^{${2 * n}} + ${2 * a}x^{${n}} + ${a * a}$ has a middle term.`,
                `$(x^{${n}} + ${a})^2 = x^{${2 * n}} + ${2 * a}x^{${n}} + ${a * a}$，有中间项。`,
              ),
              t(
                `Expanding gives $x^{${2 * n}} - ${a}x^{${2 * n - 1}} + ${a}x - ${a * a}$, whose middle terms do not cancel.`,
                `展开得 $x^{${2 * n}} - ${a}x^{${2 * n - 1}} + ${a}x - ${a * a}$，中间项没有消去。`,
              ),
              t(
                `Expanding gives $x^{${2 * n}} + ${a}x^{${2 * n - 1}} - ${a}x - ${a * a}$, whose middle terms do not cancel.`,
                `展开得 $x^{${2 * n}} + ${a}x^{${2 * n - 1}} - ${a}x - ${a * a}$，中间项没有消去。`,
              ),
            ],
          ),
        );
      return mc(
        rng,
        t(`Which expression is equivalent to $${a * a}x^4 - ${b * b}x^2$?`, `哪个式子与 $${a * a}x^4 - ${b * b}x^2$ 等价？`),
        `x^2(${a}x - ${b})(${a}x + ${b})`,
        [`x^2(${a}x - ${b})^2`, `(${a}x^2 - ${b})(${a}x^2 + ${b})`, `x(${a}x - ${b})(${a}x + ${b})`, `x^2(${a * a}x - ${b})(x + ${b})`],
        worked(
          [
            step(
              "Take out x squared",
              "先提公因式",
              `Both terms contain $x^2$: $${a * a}x^4 - ${b * b}x^2 = x^2(${a * a}x^2 - ${b * b})$.`,
              `两项都含 $x^2$：$${a * a}x^4 - ${b * b}x^2 = x^2(${a * a}x^2 - ${b * b})$。`,
            ),
            step(
              "Factor the difference of squares",
              "分解平方差",
              `$${a * a}x^2 - ${b * b} = (${a}x - ${b})(${a}x + ${b})$.`,
              `$${a * a}x^2 - ${b * b} = (${a}x - ${b})(${a}x + ${b})$。`,
            ),
          ],
          t(
            `At $x = 2$: $${a * a} \\times 16 - ${b * b} \\times 4 = ${16 * a * a - 4 * b * b}$, and $4(${2 * a} - ${b})(${2 * a} + ${b}) = ${4 * (4 * a * a - b * b)}$.`,
            `$x = 2$ 时：$${a * a} \\times 16 - ${b * b} \\times 4 = ${16 * a * a - 4 * b * b}$，而 $4(${2 * a} - ${b})(${2 * a} + ${b}) = ${4 * (4 * a * a - b * b)}$。`,
          ),
          [
            t(
              `$(${a}x - ${b})^2$ has a middle term; what remains after $x^2$ is a difference of squares, not a square.`,
              `$(${a}x - ${b})^2$ 有中间项；提出 $x^2$ 后剩下的是平方差，不是完全平方。`,
            ),
            t(
              `$(${a}x^2 - ${b})(${a}x^2 + ${b}) = ${a * a}x^4 - ${b * b}$, which lacks the factor $x^2$ on $${b * b}$.`,
              `$(${a}x^2 - ${b})(${a}x^2 + ${b}) = ${a * a}x^4 - ${b * b}$，$${b * b}$ 后面少了 $x^2$。`,
            ),
            t(
              `$x(${a}x - ${b})(${a}x + ${b}) = ${a * a}x^3 - ${b * b}x$: only one $x$ was taken out.`,
              `$x(${a}x - ${b})(${a}x + ${b}) = ${a * a}x^3 - ${b * b}x$：只提出了一个 $x$。`,
            ),
            t(
              `$(${a * a}x - ${b})(x + ${b})$ has a middle term, so it is not $${a * a}x^2 - ${b * b}$.`,
              `$(${a * a}x - ${b})(x + ${b})$ 展开有中间项，不等于 $${a * a}x^2 - ${b * b}$。`,
            ),
          ],
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
          worked(
            [
              step(
                "Factor the numerator",
                "分解分子",
                `$${k}x^2 - ${k * a * a} = ${k}(x^2 - ${a * a}) = ${k}(x - ${a})(x + ${a})$.`,
                `$${k}x^2 - ${k * a * a} = ${k}(x^2 - ${a * a}) = ${k}(x - ${a})(x + ${a})$。`,
              ),
              step(
                "Cancel",
                "约分",
                `For $x > ${a}$, $x - ${a} \\neq 0$, so cancelling leaves $${k}(x + ${a}) = ${k}x + ${k * a}$.`,
                `当 $x > ${a}$ 时 $x - ${a} \\neq 0$，约去后剩下 $${k}(x + ${a}) = ${k}x + ${k * a}$。`,
              ),
            ],
            t(
              `At $x = ${a + 1}$ the denominator is $1$ and the numerator is $${k * (a + 1) ** 2} - ${k * a * a} = ${k * (2 * a + 1)}$; the answer gives $${k * (a + 1)} + ${k * a} = ${k * (2 * a + 1)}$.`,
              `$x = ${a + 1}$ 时分母为 $1$，分子为 $${k * (a + 1) ** 2} - ${k * a * a} = ${k * (2 * a + 1)}$；答案给出 $${k * (a + 1)} + ${k * a} = ${k * (2 * a + 1)}$。`,
            ),
            [
              t(`The factor left after cancelling is $x + ${a}$, not $x - ${a}$.`, `约分后剩下的因式是 $x + ${a}$，不是 $x - ${a}$。`),
              t(`This forgets the common factor $${k}$ of the numerator.`, `这是忘了分子的公因数 $${k}$。`),
              t(
                `This multiplies only $x$ by $${k}$; the factor $${k}$ multiplies all of $x + ${a}$.`,
                `这是只给 $x$ 乘了 $${k}$；$${k}$ 要乘整个 $x + ${a}$。`,
              ),
              t(
                `This cancels without factoring; the constant is $${k} \\times ${a} = ${k * a}$.`,
                `这是没有分解就约分；常数应为 $${k} \\times ${a} = ${k * a}$。`,
              ),
            ],
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
        worked(
          [
            step(
              "Factor the numerator",
              "分解分子",
              `$${k}x^2 + ${k * a}x = ${k}x(x + ${a})$.`,
              `$${k}x^2 + ${k * a}x = ${k}x(x + ${a})$。`,
            ),
            step(
              "Cancel",
              "约分",
              `For $x > 0$, $${k}x \\neq 0$, so the expression is $x + ${a}$.`,
              `当 $x > 0$ 时 $${k}x \\neq 0$，所以原式等于 $x + ${a}$。`,
            ),
          ],
          t(
            `At $x = 1$: $\\frac{${k} + ${k * a}}{${k}} = ${a + 1}$, and the answer gives $1 + ${a} = ${a + 1}$.`,
            `$x = 1$ 时：$\\frac{${k} + ${k * a}}{${k}} = ${a + 1}$，答案给出 $1 + ${a} = ${a + 1}$。`,
          ),
          [
            t(`Dividing $${k * a}x$ by $${k}x$ leaves $${a}$, not $${k * a}$.`, `$${k * a}x$ 除以 $${k}x$ 得 $${a}$，不是 $${k * a}$。`),
            t(`Dividing $${k}x^2$ by $${k}x$ leaves $x$, not $${k}x$.`, `$${k}x^2$ 除以 $${k}x$ 得 $x$，不是 $${k}x$。`),
            t(`Dividing $${k}x^2$ by $${k}x$ leaves $x$, not $x^2$.`, `$${k}x^2$ 除以 $${k}x$ 得 $x$，不是 $x^2$。`),
            t(`This adds $${k}$ instead of dividing it out.`, `这是把 $${k}$ 加上了，而不是约去。`),
          ],
        ),
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
          worked(
            [
              step(
                "Factor the numerator",
                "分解分子",
                `$${num} = (x + ${r})(x + ${s})$, since $${r} \\times ${s} = ${r * s}$ and $${r} + ${s} = ${r + s}$.`,
                `$${num} = (x + ${r})(x + ${s})$，因为 $${r} \\times ${s} = ${r * s}$，$${r} + ${s} = ${r + s}$。`,
              ),
              step(
                "Cancel",
                "约分",
                `For $x > 0$, $x + ${s} \\neq 0$, so the expression is $x + ${r}$.`,
                `当 $x > 0$ 时 $x + ${s} \\neq 0$，所以原式等于 $x + ${r}$。`,
              ),
            ],
            t(
              `At $x = 1$: $\\frac{${1 + r + s + r * s}}{${1 + s}} = ${1 + r}$, and the answer gives $1 + ${r} = ${1 + r}$.`,
              `$x = 1$ 时：$\\frac{${1 + r + s + r * s}}{${1 + s}} = ${1 + r}$，答案给出 $1 + ${r} = ${1 + r}$。`,
            ),
            [
              t(`This is the factor that cancels, not the one that remains.`, `这是被约去的因式，不是剩下的那个。`),
              t(
                `$${r * s}$ is the product of the constants, not the constant of a factor.`,
                `$${r * s}$ 是两个常数之积，不是某个因式的常数。`,
              ),
              t(`$${r + s}$ is the sum of the constants, not the constant of a factor.`, `$${r + s}$ 是两个常数之和，不是某个因式的常数。`),
              t(
                `All the terms of the numerator are positive, so its factors are $x + ${r}$ and $x + ${s}$.`,
                `分子各项都是正的，所以它的因式是 $x + ${r}$ 和 $x + ${s}$。`,
              ),
            ],
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
        worked(
          [
            step(
              "Factor both",
              "分别分解",
              `The numerator is $(x + ${r})(x + ${s})$ and the denominator is $(x + ${s})(x + ${u})$.`,
              `分子是 $(x + ${r})(x + ${s})$，分母是 $(x + ${s})(x + ${u})$。`,
            ),
            step(
              "Cancel",
              "约分",
              `The common factor $x + ${s}$ cancels, leaving $\\frac{x + ${r}}{x + ${u}}$.`,
              `约去公因式 $x + ${s}$，剩下 $\\frac{x + ${r}}{x + ${u}}$。`,
            ),
          ],
          t(
            `At $x = 1$: $\\frac{${(1 + r) * (1 + s)}}{${(1 + s) * (1 + u)}} = ${Q.of((1 + r) * (1 + s), (1 + s) * (1 + u)).toLatex()}$, and $\\frac{1 + ${r}}{1 + ${u}}$ is the same number.`,
            `$x = 1$ 时：$\\frac{${(1 + r) * (1 + s)}}{${(1 + s) * (1 + u)}} = ${Q.of((1 + r) * (1 + s), (1 + s) * (1 + u)).toLatex()}$，而 $\\frac{1 + ${r}}{1 + ${u}}$ 是同一个数。`,
          ),
          [
            t(
              `This keeps the common factor $x + ${s}$ and cancels $x + ${r}$, which is only in the numerator.`,
              `这是保留了公因式 $x + ${s}$，却约去了只在分子中的 $x + ${r}$。`,
            ),
            t(
              `The factor $x + ${s}$ is in both parts, so it cancels; the denominator keeps $x + ${u}$.`,
              `因式 $x + ${s}$ 在分子分母中都有，应约去；分母剩下 $x + ${u}$。`,
            ),
            t(`This cancels the $x$ terms too, but only whole common factors cancel.`, `这是把 $x$ 也约掉了，但只有整个公因式才能约去。`),
            t(`This divides the constants without factoring.`, `这是没有分解，直接用常数相除。`),
          ],
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
        worked(
          [
            step(
              "Compare the denominators",
              "比较分母",
              `Both fractions have the denominator $x$ already.`,
              `两个分式的分母已经都是 $x$。`,
            ),
            step(
              "Add the numerators",
              "分子相加",
              `$\\frac{${a} + ${b}}{x} = \\frac{${a + b}}{x}$.`,
              `$\\frac{${a} + ${b}}{x} = \\frac{${a + b}}{x}$。`,
            ),
          ],
          t(
            `At $x = 2$: $\\frac{${a}}{2} + \\frac{${b}}{2} = \\frac{${a + b}}{2}$, which is the answer at $x = 2$.`,
            `$x = 2$ 时：$\\frac{${a}}{2} + \\frac{${b}}{2} = \\frac{${a + b}}{2}$，正是答案在 $x = 2$ 时的值。`,
          ),
          [
            t(`This adds the denominators too; only the numerators add.`, `这是把分母也相加了；只有分子相加。`),
            t(`This multiplies the denominators, but they are equal and stay $x$.`, `这是把分母相乘了，但分母相同，应保持为 $x$。`),
            t(`This multiplies the numerators instead of adding them.`, `这是把分子相乘了，而不是相加。`),
            t(`This multiplies the fractions instead of adding them.`, `这是把两个分式相乘了，而不是相加。`),
            t(`The numerators add to $${a + b}$, not $${a + b + 1}$.`, `分子之和是 $${a + b}$，不是 $${a + b + 1}$。`),
            t(`This adds the denominators and miscounts the numerators.`, `这是把分母相加，分子也算错了。`),
          ],
        ),
      );
    const bx = b === 1 ? `(x + ${d})` : `${b}(x + ${d})`;
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
      worked(
        [
          step(
            "Use a common denominator",
            "通分",
            `Multiply the first fraction by $\\frac{x + ${e}}{x + ${e}}$ and the second by $\\frac{x + ${d}}{x + ${d}}$, so both are over $(x + ${d})(x + ${e})$.`,
            `第一个分式乘以 $\\frac{x + ${e}}{x + ${e}}$，第二个乘以 $\\frac{x + ${d}}{x + ${d}}$，分母都化为 $(x + ${d})(x + ${e})$。`,
          ),
          step(
            "Add the numerators",
            "分子相加",
            `$${a}(x + ${e}) + ${bx} = ${a}x + ${a * e} + ${cx(b)} + ${b * d} = ${a + b}x + ${a * e + b * d}$.`,
            `$${a}(x + ${e}) + ${bx} = ${a}x + ${a * e} + ${cx(b)} + ${b * d} = ${a + b}x + ${a * e + b * d}$。`,
          ),
        ],
        t(
          `At $x = 0$: $\\frac{${a}}{${d}} + \\frac{${b}}{${e}} = \\frac{${a * e + b * d}}{${d * e}}$, which is the answer at $x = 0$.`,
          `$x = 0$ 时：$\\frac{${a}}{${d}} + \\frac{${b}}{${e}} = \\frac{${a * e + b * d}}{${d * e}}$，正是答案在 $x = 0$ 时的值。`,
        ),
        [
          t(
            `This adds numerators and denominators separately, which is not how fractions add.`,
            `这是分子加分子、分母加分母，分式不能这样相加。`,
          ),
          t(
            `This pairs each numerator with its own denominator's constant, but $${a}$ multiplies $x + ${e}$ and $${b}$ multiplies $x + ${d}$.`,
            `这是让每个分子乘了自己分母的常数，但 $${a}$ 应乘 $x + ${e}$，$${b}$ 应乘 $x + ${d}$。`,
          ),
          t(`This adds the numerators without rewriting them over the common denominator.`, `这是没有通分就把分子相加。`),
          t(
            `The numerator is right, but the common denominator is the product $(x + ${d})(x + ${e})$, not a sum.`,
            `分子对了，但公分母是乘积 $(x + ${d})(x + ${e})$，不是和。`,
          ),
        ],
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
          worked(
            [
              step(
                "Factor the second denominator",
                "分解第二个分母",
                `$x^2 - ${a * a} = (x - ${a})(x + ${a})$.`,
                `$x^2 - ${a * a} = (x - ${a})(x + ${a})$。`,
              ),
              step(
                "Rewrite the first fraction",
                "改写第一个分式",
                `Multiply it by $\\frac{x + ${a}}{x + ${a}}$: $\\frac{1}{x - ${a}} = \\frac{x + ${a}}{x^2 - ${a * a}}$.`,
                `乘以 $\\frac{x + ${a}}{x + ${a}}$：$\\frac{1}{x - ${a}} = \\frac{x + ${a}}{x^2 - ${a * a}}$。`,
              ),
              step(
                "Add the numerators",
                "分子相加",
                `$\\frac{x + ${a} + ${c}}{x^2 - ${a * a}} = \\frac{x + ${a + c}}{x^2 - ${a * a}}$.`,
                `$\\frac{x + ${a} + ${c}}{x^2 - ${a * a}} = \\frac{x + ${a + c}}{x^2 - ${a * a}}$。`,
              ),
            ],
            t(
              `At $x = ${a + 1}$ the sum is $1 + \\frac{${c}}{${2 * a + 1}} = \\frac{${2 * a + 1 + c}}{${2 * a + 1}}$, and the answer gives $\\frac{${2 * a + 1 + c}}{${2 * a + 1}}$ too.`,
              `$x = ${a + 1}$ 时和为 $1 + \\frac{${c}}{${2 * a + 1}} = \\frac{${2 * a + 1 + c}}{${2 * a + 1}}$，答案给出的也是 $\\frac{${2 * a + 1 + c}}{${2 * a + 1}}$。`,
            ),
            [
              t(
                `This adds the numerators $1$ and $${c}$ without rewriting the first fraction over $x^2 - ${a * a}$.`,
                `这是没有把第一个分式化为分母 $x^2 - ${a * a}$，就把分子 $1$ 和 $${c}$ 相加。`,
              ),
              t(`This rewrites the first fraction but forgets to add $${c}$.`, `这是改写了第一个分式，却忘了加上 $${c}$。`),
              t(
                `The first numerator becomes $x + ${a}$, so the sum is $x + ${a + c}$, with no extra $1$.`,
                `第一个分子变成 $x + ${a}$，所以和是 $x + ${a + c}$，没有多出的 $1$。`,
              ),
              t(
                `This adds the numerators and keeps the smaller denominator, which changes the value.`,
                `这是把分子相加并保留较小的分母，结果的值变了。`,
              ),
            ],
          ),
        );
      return spr(
        t(
          `If $\\frac{${b}}{x} + \\frac{${b}}{${a}x} = \\frac{k}{${a}x}$ for all $x > 0$, what is the value of $k$?`,
          `若对所有 $x > 0$，$\\frac{${b}}{x} + \\frac{${b}}{${a}x} = \\frac{k}{${a}x}$，则 $k$ 的值是多少？`,
        ),
        b * (a + 1),
        [2 * b, a + b, a * b],
        worked(
          [
            step(
              "Use a common denominator",
              "通分",
              `Multiply the first fraction by $\\frac{${a}}{${a}}$: $\\frac{${b}}{x} = \\frac{${a * b}}{${a}x}$.`,
              `第一个分式乘以 $\\frac{${a}}{${a}}$：$\\frac{${b}}{x} = \\frac{${a * b}}{${a}x}$。`,
            ),
            step("Add the numerators", "分子相加", `$k = ${a * b} + ${b} = ${a * b + b}$.`, `$k = ${a * b} + ${b} = ${a * b + b}$。`),
          ],
          t(
            `At $x = 1$: $${b} + \\frac{${b}}{${a}} = \\frac{${a * b + b}}{${a}}$, which is $\\frac{k}{${a}}$ with $k = ${a * b + b}$.`,
            `$x = 1$ 时：$${b} + \\frac{${b}}{${a}} = \\frac{${a * b + b}}{${a}}$，即 $\\frac{k}{${a}}$，其中 $k = ${a * b + b}$。`,
          ),
          [
            t(
              `This adds the numerators before giving both fractions the denominator $${a}x$.`,
              `这是没有把两个分式都化为分母 $${a}x$，就把分子相加。`,
            ),
            t(
              `This adds $${a}$ to $${b}$ instead of multiplying $${b}$ by $${a}$.`,
              `这是把 $${a}$ 和 $${b}$ 相加，而不是用 $${a}$ 乘 $${b}$。`,
            ),
            t(
              `This is the rewritten first numerator, $${a * b}$, without the second numerator $${b}$.`,
              `这只是改写后的第一个分子 $${a * b}$，没有加上第二个分子 $${b}$。`,
            ),
          ],
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
        worked(
          [
            step(
              "Multiply by the reciprocal",
              "乘以倒数",
              `Dividing by $\\frac{${b}}{x}$ is multiplying by $\\frac{x}{${b}}$.`,
              `除以 $\\frac{${b}}{x}$ 就是乘以 $\\frac{x}{${b}}$。`,
            ),
            step(
              "Simplify",
              "化简",
              `$${a} \\times \\frac{x}{${b}} = \\frac{${a}x}{${b}}$.`,
              `$${a} \\times \\frac{x}{${b}} = \\frac{${a}x}{${b}}$。`,
            ),
          ],
          t(
            `At $x = ${b}$ the inner fraction is $1$, so the expression is $${a}$, and $\\frac{${a} \\times ${b}}{${b}} = ${a}$.`,
            `$x = ${b}$ 时内层分式为 $1$，原式等于 $${a}$，而 $\\frac{${a} \\times ${b}}{${b}} = ${a}$。`,
          ),
          [
            t(
              `This divides by $x$ again, but dividing by $\\frac{${b}}{x}$ moves the $x$ to the numerator.`,
              `这是又除以了 $x$，但除以 $\\frac{${b}}{x}$ 会把 $x$ 移到分子上。`,
            ),
            t(`This swaps the roles of $${a}$ and $${b}$.`, `这是把 $${a}$ 和 $${b}$ 的位置弄反了。`),
            t(
              `This is the reciprocal of the answer: $\\frac{${b}}{x}$ divided by $${a}$, the wrong way round.`,
              `这是答案的倒数：用 $\\frac{${b}}{x}$ 除以 $${a}$，方向反了。`,
            ),
            t(`This multiplies by $${b}$ instead of dividing by it.`, `这是乘以了 $${b}$，而不是除以它。`),
            t(`The denominator is $${b}$, not $${b + 1}$.`, `分母是 $${b}$，不是 $${b + 1}$。`),
            t(
              `This adds $${a}$ and $${b}$, but dividing by a fraction multiplies by its reciprocal.`,
              `这是把 $${a}$ 和 $${b}$ 相加了，但除以分数要乘以它的倒数。`,
            ),
          ],
        ),
      );
    return spr(
      t(
        `What is the value of $\\frac{1}{\\frac{1}{x} + \\frac{1}{x}}$ when $x = ${2 * c * a}$?`,
        `当 $x = ${2 * c * a}$ 时，$\\frac{1}{\\frac{1}{x} + \\frac{1}{x}}$ 的值是多少？`,
      ),
      c * a,
      [2 * c * a, 4 * c * a, Q.of(1, c * a)],
      worked(
        [
          step(
            "Add the inner fractions",
            "内层分式相加",
            `$\\frac{1}{x} + \\frac{1}{x} = \\frac{2}{x}$.`,
            `$\\frac{1}{x} + \\frac{1}{x} = \\frac{2}{x}$。`,
          ),
          step("Take the reciprocal", "取倒数", `$\\frac{1}{\\frac{2}{x}} = \\frac{x}{2}$.`, `$\\frac{1}{\\frac{2}{x}} = \\frac{x}{2}$。`),
          step("Substitute", "代入", `$\\frac{${2 * c * a}}{2} = ${c * a}$.`, `$\\frac{${2 * c * a}}{2} = ${c * a}$。`),
        ],
        t(
          `Directly: $\\frac{1}{${2 * c * a}} + \\frac{1}{${2 * c * a}} = \\frac{1}{${c * a}}$, and its reciprocal is $${c * a}$.`,
          `直接计算：$\\frac{1}{${2 * c * a}} + \\frac{1}{${2 * c * a}} = \\frac{1}{${c * a}}$，它的倒数是 $${c * a}$。`,
        ),
        [
          t(`This is $x$ itself, but the expression is half of $x$.`, `这是 $x$ 本身，但原式是 $x$ 的一半。`),
          t(`This multiplies $x$ by $2$ instead of dividing by $2$.`, `这是把 $x$ 乘以 $2$，而不是除以 $2$。`),
          t(
            `This is the denominator $\\frac{1}{x} + \\frac{1}{x}$, before taking the reciprocal.`,
            `这是分母 $\\frac{1}{x} + \\frac{1}{x}$ 的值，还没有取倒数。`,
          ),
        ],
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
        worked(
          [
            step(
              "Use the product rule",
              "用同底数幂乘法",
              `Both factors are powers of $x$, and multiplying powers of one base adds the exponents.`,
              `两个因数都是 $x$ 的幂，同底数幂相乘，指数相加。`,
            ),
            step(
              "Add the exponents",
              "指数相加",
              `$${a} + ${b} = ${a + b}$, so the product is $x^{${a + b}}$.`,
              `$${a} + ${b} = ${a + b}$，所以积为 $x^{${a + b}}$。`,
            ),
          ],
          t(
            `At $x = 2$: $${2 ** a} \\times ${2 ** b} = ${2 ** (a + b)}$, which is $2^{${a + b}}$.`,
            `$x = 2$ 时：$${2 ** a} \\times ${2 ** b} = ${2 ** (a + b)}$，正是 $2^{${a + b}}$。`,
          ),
          [
            t(`This multiplies the exponents, which is the rule for a power of a power.`, `这是把指数相乘了，那是幂的乘方的法则。`),
            t(`Multiplying $x^{${a}}$ by $x^{${b}}$ does not double the coefficient.`, `$x^{${a}}$ 乘 $x^{${b}}$ 不会使系数变成 $2$。`),
            t(`The exponents add to $${a + b}$, not $${a + b + 1}$.`, `指数之和是 $${a + b}$，不是 $${a + b + 1}$。`),
            t(`This multiplies the exponents and puts their sum in front.`, `这是把指数相乘，又把它们的和放在前面作系数。`),
            t(`This multiplies the exponents and adds $1$.`, `这是把指数相乘再加 $1$。`),
          ],
        ),
      );
    return spr(
      t(
        `If $\\frac{x^{${a + b}} \\cdot x^{${c}}}{x^{${b}}} = x^{k}$ for all $x > 0$, what is the value of $k$?`,
        `若对所有 $x > 0$，$\\frac{x^{${a + b}} \\cdot x^{${c}}}{x^{${b}}} = x^{k}$，则 $k$ 的值是多少？`,
      ),
      a + c,
      [a + 2 * b + c, a + b, (a + b) * c - b],
      worked(
        [
          step(
            "Multiply",
            "相乘",
            `$x^{${a + b}} \\times x^{${c}} = x^{${a + b + c}}$.`,
            `$x^{${a + b}} \\times x^{${c}} = x^{${a + b + c}}$。`,
          ),
          step(
            "Divide",
            "相除",
            `Dividing by $x^{${b}}$ subtracts its exponent: $${a + b + c} - ${b} = ${a + c}$.`,
            `除以 $x^{${b}}$ 就减去它的指数：$${a + b + c} - ${b} = ${a + c}$。`,
          ),
        ],
        t(
          `Cancelling first: $\\frac{x^{${a + b}}}{x^{${b}}} = x^{${a}}$, and $x^{${a}} \\times x^{${c}} = x^{${a + c}}$.`,
          `先约分：$\\frac{x^{${a + b}}}{x^{${b}}} = x^{${a}}$，再乘 $x^{${c}}$ 得 $x^{${a + c}}$。`,
        ),
        [
          t(`This adds the exponent of the denominator instead of subtracting it.`, `这是加上了分母的指数，而不是减去。`),
          t(`This keeps only the first exponent, $${a + b}$.`, `这是只保留了第一个指数 $${a + b}$。`),
          t(
            `This multiplies $${a + b}$ by $${c}$, but the exponents of a product add.`,
            `这是用 $${a + b}$ 乘 $${c}$，但乘积的指数应相加。`,
          ),
        ],
      ),
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
        worked(
          [
            step(
              "Raise each factor",
              "每个因数都乘方",
              `$(${a}x^{${b}})^{${c}} = ${a}^{${c}} \\times (x^{${b}})^{${c}}$.`,
              `$(${a}x^{${b}})^{${c}} = ${a}^{${c}} \\times (x^{${b}})^{${c}}$。`,
            ),
            step(
              "Evaluate",
              "计算",
              `$${a}^{${c}} = ${a ** c}$, and the exponents multiply: $(x^{${b}})^{${c}} = x^{${b * c}}$.`,
              `$${a}^{${c}} = ${a ** c}$，指数相乘：$(x^{${b}})^{${c}} = x^{${b * c}}$。`,
            ),
          ],
          t(
            `Writing out the $${c}$ factors of $${a}x^{${b}}$: the coefficient is $${Array(c).fill(a).join(" \\times ")} = ${a ** c}$ and the exponent is $${Array(c).fill(b).join(" + ")} = ${b * c}$.`,
            `把 $${c}$ 个 $${a}x^{${b}}$ 写出来相乘：系数为 $${Array(c).fill(a).join(" \\times ")} = ${a ** c}$，指数为 $${Array(c).fill(b).join(" + ")} = ${b * c}$。`,
          ),
          [
            t(
              `This multiplies $${a}$ by $${c}$, but the coefficient is raised to the power: $${a}^{${c}}$.`,
              `这是用 $${a}$ 乘 $${c}$，但系数要乘方：$${a}^{${c}}$。`,
            ),
            t(
              `This leaves the coefficient $${a}$ unraised, but it is raised to the power $${c}$ too.`,
              `这是没有给系数 $${a}$ 乘方，但它也要取 $${c}$ 次方。`,
            ),
            t(`This adds the exponents, but a power of a power multiplies them.`, `这是把指数相加了，但幂的乘方要把指数相乘。`),
            t(`The coefficient is $${a ** c}$, not $${a ** c + 1}$.`, `系数是 $${a ** c}$，不是 $${a ** c + 1}$。`),
            t(`The exponent is $${b * c}$, not $${b * c + 1}$.`, `指数是 $${b * c}$，不是 $${b * c + 1}$。`),
          ],
        ),
      );
    const n = rng.pick([2, 3, 4, 5]);
    const m = rng.int(1, n - 1 || 1);
    const k = rng.int(2, 5);
    const root = `${n === 2 ? "\\sqrt" : `\\sqrt[${n}]`}{${m === 1 ? "x" : `x^{${m}}`}}`;
    const f = Q.of(m, n).toLatex();
    const total = Q.of(m + n * k, n).toLatex();
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
      worked(
        [
          step("Write the root as a power", "把根式写成幂", `$${root} = x^{${f}}$.`, `$${root} = x^{${f}}$。`),
          step(
            "Add the exponents",
            "指数相加",
            `$${f} + ${k} = ${total}$, so the product is $x^{${total}}$.`,
            `$${f} + ${k} = ${total}$，所以积为 $x^{${total}}$。`,
          ),
        ],
        t(
          `Raising to the power $${n}$: $(${root} \\times x^{${k}})^{${n}} = ${m === 1 ? "x" : `x^{${m}}`} \\times x^{${n * k}} = x^{${m + n * k}}$, and $(x^{${total}})^{${n}} = x^{${m + n * k}}$ too.`,
          `两边取 $${n}$ 次方：$(${root} \\times x^{${k}})^{${n}} = ${m === 1 ? "x" : `x^{${m}}`} \\times x^{${n * k}} = x^{${m + n * k}}$，而 $(x^{${total}})^{${n}} = x^{${m + n * k}}$，两者相同。`,
        ),
        [
          t(
            `Multiplying powers of $x$ adds the exponents; this does not come from $${f} + ${k}$.`,
            `同底数幂相乘，指数相加；这个结果不是 $${f} + ${k}$。`,
          ),
          t(
            `This mixes up the index $${n}$ and the power $${m}$ of the root; the root is $x^{${f}}$.`,
            `这是把根指数 $${n}$ 和被开方数的指数 $${m}$ 弄混了；根式等于 $x^{${f}}$。`,
          ),
          t(
            `This adds too much: the root is $x^{${f}}$, and the other exponent is $${k}$.`,
            `这是加多了：根式是 $x^{${f}}$，另一个指数是 $${k}$。`,
          ),
          t(
            `This adds the index of the root as a whole number, but the index divides the exponent.`,
            `这是把根指数当整数加上了，但根指数是用来除指数的。`,
          ),
        ],
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
          worked(
            [
              step(
                "Distribute",
                "分配",
                `$x^{${a}}(x^{${b}} + ${c}) = x^{${a}} \\times x^{${b}} + x^{${a}} \\times ${c}$.`,
                `$x^{${a}}(x^{${b}} + ${c}) = x^{${a}} \\times x^{${b}} + x^{${a}} \\times ${c}$。`,
              ),
              step(
                "Simplify each term",
                "化简每一项",
                `$x^{${a}} \\times x^{${b}} = x^{${a + b}}$ and $x^{${a}} \\times ${c} = ${c}x^{${a}}$.`,
                `$x^{${a}} \\times x^{${b}} = x^{${a + b}}$，$x^{${a}} \\times ${c} = ${c}x^{${a}}$。`,
              ),
            ],
            t(
              `At $x = 2$: $${2 ** a} \\times (${2 ** b} + ${c}) = ${2 ** a * (2 ** b + c)}$, and $${2 ** (a + b)} + ${c} \\times ${2 ** a} = ${2 ** (a + b) + c * 2 ** a}$.`,
              `$x = 2$ 时：$${2 ** a} \\times (${2 ** b} + ${c}) = ${2 ** a * (2 ** b + c)}$，而 $${2 ** (a + b)} + ${c} \\times ${2 ** a} = ${2 ** (a + b) + c * 2 ** a}$。`,
            ),
            [
              t(
                `This multiplies the exponents $${a}$ and $${b}$, but multiplying powers adds them.`,
                `这是把指数 $${a}$ 和 $${b}$ 相乘，但同底数幂相乘指数相加。`,
              ),
              t(`This forgets to multiply $${c}$ by $x^{${a}}$.`, `这是忘了用 $x^{${a}}$ 乘 $${c}$。`),
              t(
                `$x^{${a + b}}$ and $${c}x^{${a}}$ are not like terms, so they cannot be combined.`,
                `$x^{${a + b}}$ 与 $${c}x^{${a}}$ 不是同类项，不能合并。`,
              ),
              t(
                `This treats $${c}$ as an exponent, but $x^{${a}} \\times ${c}$ is $${c}x^{${a}}$.`,
                `这是把 $${c}$ 当成了指数，但 $x^{${a}} \\times ${c} = ${c}x^{${a}}$。`,
              ),
              t(
                `The first exponent is $${a} + ${b} = ${a + b}$, not $${a + b + 1}$.`,
                `第一项的指数是 $${a} + ${b} = ${a + b}$，不是 $${a + b + 1}$。`,
              ),
            ],
          ),
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
        worked(
          [
            step(
              "Split the larger power",
              "拆开较大的幂",
              p === 1
                ? `$${n}^{${a + 1}} = ${n} \\times ${n}^{${a}}$.`
                : `$${n}^{${a + 2}} = ${n}^{2} \\times ${n}^{${a}} = ${n * n} \\times ${n}^{${a}}$.`,
              p === 1
                ? `$${n}^{${a + 1}} = ${n} \\times ${n}^{${a}}$。`
                : `$${n}^{${a + 2}} = ${n}^{2} \\times ${n}^{${a}} = ${n * n} \\times ${n}^{${a}}$。`,
            ),
            step(
              "Factor out",
              "提公因式",
              `$${n ** p} \\times ${n}^{${a}} + ${n}^{${a}} = (${n ** p} + 1) \\times ${n}^{${a}}$, so $k = ${n ** p + 1}$.`,
              `$${n ** p} \\times ${n}^{${a}} + ${n}^{${a}} = (${n ** p} + 1) \\times ${n}^{${a}}$，所以 $k = ${n ** p + 1}$。`,
            ),
          ],
          t(
            `Dividing both sides by $${n}^{${a}}$: $k = \\frac{${n}^{${a + p}}}{${n}^{${a}}} + 1 = ${n ** p} + 1 = ${n ** p + 1}$.`,
            `两边同除以 $${n}^{${a}}$：$k = \\frac{${n}^{${a + p}}}{${n}^{${a}}} + 1 = ${n ** p} + 1 = ${n ** p + 1}$。`,
          ),
          [
            t(`This forgets the $1$ that $${n}^{${a}}$ itself leaves after factoring.`, `这是忘了 $${n}^{${a}}$ 本身提出后剩下的 $1$。`),
            t(
              `This adds $2$, but the term $${n}^{${a}}$ leaves only $1$ after factoring.`,
              `这是加了 $2$，但 $${n}^{${a}}$ 提出后只剩 $1$。`,
            ),
            t(`This doubles $${n ** p}$, but only one term contains it.`, `这是把 $${n ** p}$ 加倍了，但只有一项含有它。`),
          ],
        ),
      );
    },
  ),
  spec("Perfect Square Quadratic Equations", "完全平方二次方程", ["solving-perfect-square-quadratic-equations"], (rng, hard) => {
    const [k, b] = [rng.int(2, 9), rng.int(1, 9)];
    if (!hard) {
      // When both solutions are positive, the question asks for the greater one, so that only one option is correct.
      const both = b - k > 0;
      return mc(
        rng,
        both
          ? t(`What is the greater solution of $(x - ${b})^2 = ${k * k}$?`, `$(x - ${b})^2 = ${k * k}$ 较大的解是多少？`)
          : t(`What is the positive solution of $(x - ${b})^2 = ${k * k}$?`, `$(x - ${b})^2 = ${k * k}$ 的正解是多少？`),
        b + k,
        [k, k * k + b, b + 2 * k],
        worked(
          [
            step("Take square roots", "开平方", `$x - ${b} = ${k}$ or $x - ${b} = -${k}$.`, `$x - ${b} = ${k}$ 或 $x - ${b} = -${k}$。`),
            step("Solve each", "分别求解", `$x = ${b + k}$ or $x = ${b - k}$.`, `$x = ${b + k}$ 或 $x = ${b - k}$。`),
            step(
              "Choose",
              "取舍",
              both ? `Both are positive; the greater is $${b + k}$.` : `Only $${b + k}$ is positive.`,
              both ? `两个都是正数，较大的是 $${b + k}$。` : `只有 $${b + k}$ 是正数。`,
            ),
          ],
          t(`$(${b + k} - ${b})^2 = ${k}^2 = ${k * k}$.`, `$(${b + k} - ${b})^2 = ${k}^2 = ${k * k}$。`),
          [
            t(`This is the square root $${k}$, before adding $${b}$.`, `这是平方根 $${k}$，还没有加上 $${b}$。`),
            t(`This adds $${b}$ to $${k * k}$ without taking the square root.`, `这是没有开平方，就把 $${b}$ 加到 $${k * k}$ 上。`),
            t(`This adds $${k}$ twice.`, `这是把 $${k}$ 加了两次。`),
          ],
        ),
      );
    }
    return spr(
      t(`What is the sum of the solutions of $(x + ${b})^2 = ${k * k}$?`, `$(x + ${b})^2 = ${k * k}$ 的解之和是多少？`),
      -2 * b,
      [2 * k, -b, 2 * b],
      worked(
        [
          step(
            "Take square roots",
            "开平方",
            `$x + ${b} = \\pm ${k}$, so $x = -${b} + ${k}$ or $x = -${b} - ${k}$.`,
            `$x + ${b} = \\pm ${k}$，所以 $x = -${b} + ${k}$ 或 $x = -${b} - ${k}$。`,
          ),
          step(
            "Add",
            "相加",
            `The $\\pm ${k}$ parts cancel: $(-${b} + ${k}) + (-${b} - ${k}) = ${-2 * b}$.`,
            `$\\pm ${k}$ 相消：$(-${b} + ${k}) + (-${b} - ${k}) = ${-2 * b}$。`,
          ),
        ],
        t(
          `The solutions are $${k - b}$ and $${-b - k}$, and $${k - b} + (${-b - k}) = ${-2 * b}$.`,
          `两个解是 $${k - b}$ 和 $${-b - k}$，而 $${k - b} + (${-b - k}) = ${-2 * b}$。`,
        ),
        [
          t(
            `This is the distance between the solutions, $2 \\times ${k}$, not their sum.`,
            `这是两个解之间的距离 $2 \\times ${k}$，不是它们的和。`,
          ),
          t(`This counts $-${b}$ once, but each solution contributes $-${b}$.`, `这是只算了一个 $-${b}$，但每个解都含有 $-${b}$。`),
          t(`The sign is wrong: $(x + ${b})^2$ is centered at $x = -${b}$.`, `符号错了：$(x + ${b})^2$ 以 $x = -${b}$ 为中心。`),
        ],
      ),
    );
  }),
  spec("Solving Quadratic Equations Using the Zero-Product Rule", "用零积法解二次方程", ["zero-product-rule"], (rng, hard) => {
    const [a, b, d0] = [rng.int(2, 6), rng.int(1, 9), rng.int(1, 9)];
    const d = d0 === b ? d0 + 1 : d0;
    const at = (v: number): number => (v - b) * (v + d);
    if (!hard)
      return mcExact(
        rng,
        t(`Which value is a solution of $(x - ${b})(x + ${d}) = 0$?`, `哪个值是 $(x - ${b})(x + ${d}) = 0$ 的解？`),
        b,
        [-b, d, b + d],
        worked(
          [
            step(
              "Use the zero-product rule",
              "用零积法则",
              `A product is zero only when a factor is zero: $x - ${b} = 0$ or $x + ${d} = 0$.`,
              `乘积为零当且仅当有一个因式为零：$x - ${b} = 0$ 或 $x + ${d} = 0$。`,
            ),
            step("Solve", "求解", `$x = ${b}$ or $x = -${d}$; only $${b}$ is listed.`, `$x = ${b}$ 或 $x = -${d}$；选项中只有 $${b}$。`),
          ],
          t(`$(${b} - ${b})(${b} + ${d}) = 0 \\times ${b + d} = 0$.`, `$(${b} - ${b})(${b} + ${d}) = 0 \\times ${b + d} = 0$。`),
          [
            t(
              `At $x = -${b}$ the product is $${-2 * b} \\times ${par(d - b)} = ${at(-b)}$, not zero; solving $x - ${b} = 0$ gives $+${b}$.`,
              `$x = -${b}$ 时乘积为 $${-2 * b} \\times ${par(d - b)} = ${at(-b)}$，不为零；解 $x - ${b} = 0$ 得 $+${b}$。`,
            ),
            t(
              `At $x = ${d}$ the product is $${par(d - b)} \\times ${2 * d} = ${at(d)}$, not zero; the factor $x + ${d}$ gives $-${d}$.`,
              `$x = ${d}$ 时乘积为 $${par(d - b)} \\times ${2 * d} = ${at(d)}$，不为零；因式 $x + ${d}$ 给出 $-${d}$。`,
            ),
            t(
              `At $x = ${b + d}$ the product is $${d} \\times ${b + 2 * d} = ${at(b + d)}$; adding the constants does not give a solution.`,
              `$x = ${b + d}$ 时乘积为 $${d} \\times ${b + 2 * d} = ${at(b + d)}$；把常数相加得不到解。`,
            ),
          ],
        ),
      );
    return spr(
      t(
        `The equation $(${a}x - ${a * b})(x + ${d}) = 0$ has solutions $p$ and $q$. What is the value of $p + q$?`,
        `方程 $(${a}x - ${a * b})(x + ${d}) = 0$ 的解是 $p$ 和 $q$。$p + q$ 的值是多少？`,
      ),
      b - d,
      [a * b - d, b + d, a * b + d],
      worked(
        [
          step(
            "First factor",
            "第一个因式",
            `$${a}x - ${a * b} = 0$ gives $${a}x = ${a * b}$, so $x = ${b}$.`,
            `$${a}x - ${a * b} = 0$ 得 $${a}x = ${a * b}$，所以 $x = ${b}$。`,
          ),
          step("Second factor", "第二个因式", `$x + ${d} = 0$ gives $x = -${d}$.`, `$x + ${d} = 0$ 得 $x = -${d}$。`),
          step("Add", "相加", `$${b} + (-${d}) = ${b - d}$.`, `$${b} + (-${d}) = ${b - d}$。`),
        ],
        t(
          `Both values make a factor zero: $${a} \\times ${b} - ${a * b} = 0$ and $-${d} + ${d} = 0$.`,
          `两个值都使某个因式为零：$${a} \\times ${b} - ${a * b} = 0$，$-${d} + ${d} = 0$。`,
        ),
        [
          t(
            `This uses $${a * b}$ as a solution, but dividing by $${a}$ gives $x = ${b}$.`,
            `这是把 $${a * b}$ 当成了解，但要除以 $${a}$，得 $x = ${b}$。`,
          ),
          t(`The second solution is $-${d}$, not $${d}$.`, `第二个解是 $-${d}$，不是 $${d}$。`),
          t(
            `This uses $${a * b}$ and $+${d}$, but the solutions are $${b}$ and $-${d}$.`,
            `这是用了 $${a * b}$ 和 $+${d}$，但解是 $${b}$ 和 $-${d}$。`,
          ),
        ],
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
        worked(
          [
            step(
              "Factor",
              "分解",
              `Two numbers with product $${r * s}$ and sum $${r + s}$ are $${r}$ and $${s}$: $(x - ${r})(x - ${s}) = 0$.`,
              `积为 $${r * s}$、和为 $${r + s}$ 的两个数是 $${r}$ 和 $${s}$：$(x - ${r})(x - ${s}) = 0$。`,
            ),
            step("Solve", "求解", `$x = ${r}$ or $x = ${s}$; the greater is $${s}$.`, `$x = ${r}$ 或 $x = ${s}$；较大的是 $${s}$。`),
          ],
          t(`Put $x = ${s}$: $${s * s} - ${(r + s) * s} + ${r * s} = 0$.`, `代入 $x = ${s}$：$${s * s} - ${(r + s) * s} + ${r * s} = 0$。`),
          [
            t(`This is the smaller solution.`, `这是较小的解。`),
            t(
              `The factors are $x - ${r}$ and $x - ${s}$, so both solutions are positive.`,
              `因式是 $x - ${r}$ 和 $x - ${s}$，所以两个解都是正数。`,
            ),
            t(`This is the sum of the solutions, $${r} + ${s}$.`, `这是两个解之和 $${r} + ${s}$。`),
          ],
        ),
      );
    return spr(
      t(
        `If $x^2 - ${s - r}x - ${r * s} = 0$ and $x > 0$, what is the value of $x + ${r}$?`,
        `若 $x^2 - ${s - r}x - ${r * s} = 0$ 且 $x > 0$，则 $x + ${r}$ 的值是多少？`,
      ),
      s + r,
      [s, r, 0],
      worked(
        [
          step(
            "Factor",
            "分解",
            `$(x - ${s})(x + ${r}) = 0$, since $-${s} \\times ${r} = -${r * s}$ and $-${s} + ${r} = -${s - r}$.`,
            `$(x - ${s})(x + ${r}) = 0$，因为 $-${s} \\times ${r} = -${r * s}$，$-${s} + ${r} = -${s - r}$。`,
          ),
          step(
            "Take the positive solution",
            "取正解",
            `$x = ${s}$ or $x = -${r}$; with $x > 0$, $x = ${s}$.`,
            `$x = ${s}$ 或 $x = -${r}$；因为 $x > 0$，$x = ${s}$。`,
          ),
          step("Evaluate", "计算", `$x + ${r} = ${s} + ${r} = ${s + r}$.`, `$x + ${r} = ${s} + ${r} = ${s + r}$。`),
        ],
        t(`Put $x = ${s}$: $${s * s} - ${(s - r) * s} - ${r * s} = 0$.`, `代入 $x = ${s}$：$${s * s} - ${(s - r) * s} - ${r * s} = 0$。`),
        [
          t(`This is $x$ itself, but the question asks for $x + ${r}$.`, `这是 $x$ 本身，但题目问的是 $x + ${r}$。`),
          t(`This is only the $${r}$ that is added; $x = ${s}$ must be added to it.`, `这只是要加上的 $${r}$，还要加上 $x = ${s}$。`),
          t(`This uses the negative solution $x = -${r}$, but $x > 0$.`, `这是用了负解 $x = -${r}$，但 $x > 0$。`),
        ],
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
      const eq = `${a}x^2 ${tx(s - a * r)} - ${r * s}`;
      const value = (v: number): number => a * v * v + (s - a * r) * v - r * s;
      const factor = step(
        "Factor",
        "分解",
        `$${eq} = (${a}x + ${s})(x - ${r})$, since $${a} \\times (-${r}) + ${s} = ${s - a * r}$ and $${s} \\times (-${r}) = -${r * s}$.`,
        `$${eq} = (${a}x + ${s})(x - ${r})$，因为 $${a} \\times (-${r}) + ${s} = ${s - a * r}$，$${s} \\times (-${r}) = -${r * s}$。`,
      );
      if (!hard) {
        const second = s === r ? r + a : s;
        return mcExact(
          rng,
          t(
            `Which value is a solution of $${a}x^2 ${tx(s - a * r)} - ${r * s} = 0$?`,
            `哪个值是 $${a}x^2 ${tx(s - a * r)} - ${r * s} = 0$ 的解？`,
          ),
          r,
          [-r, second, a * r],
          worked(
            [
              factor,
              step(
                "Solve",
                "求解",
                `$x = ${r}$ or $x = ${Q.of(-s, a).toLatex()}$; only $${r}$ is listed.`,
                `$x = ${r}$ 或 $x = ${Q.of(-s, a).toLatex()}$；选项中只有 $${r}$。`,
              ),
            ],
            t(
              `Put $x = ${r}$: $${a * r * r} ${sg((s - a * r) * r)} - ${r * s} = 0$.`,
              `代入 $x = ${r}$：$${a * r * r} ${sg((s - a * r) * r)} - ${r * s} = 0$。`,
            ),
            [
              t(
                `At $x = -${r}$ the left side is $${value(-r)}$, not zero; the factor $x - ${r}$ gives $+${r}$.`,
                `$x = -${r}$ 时左边为 $${value(-r)}$，不为零；因式 $x - ${r}$ 给出 $+${r}$。`,
              ),
              t(
                `At $x = ${second}$ the left side is $${value(second)}$, not zero.`,
                `$x = ${second}$ 时左边为 $${value(second)}$，不为零。`,
              ),
              t(
                `At $x = ${a * r}$ the left side is $${value(a * r)}$, not zero; the leading coefficient does not multiply the solution.`,
                `$x = ${a * r}$ 时左边为 $${value(a * r)}$，不为零；首项系数不乘到解上。`,
              ),
            ],
          ),
        );
      }
      return spr(
        t(
          `What is the negative solution of $${a}x^2 ${tx(s - a * r)} - ${r * s} = 0$?`,
          `$${a}x^2 ${tx(s - a * r)} - ${r * s} = 0$ 的负解是多少？`,
        ),
        Q.of(-s, a),
        [Q.of(s, a), -s, -r],
        worked(
          [
            factor,
            step(
              "Solve the other factor",
              "解另一个因式",
              `The negative solution comes from $${a}x + ${s} = 0$: $x = ${Q.of(-s, a).toLatex()}$.`,
              `负解来自 $${a}x + ${s} = 0$：$x = ${Q.of(-s, a).toLatex()}$。`,
            ),
          ],
          t(
            `The product of the solutions is $\\frac{c}{a} = ${Q.of(-r * s, a).toLatex()}$, and $${r} \\times \\left(${Q.of(-s, a).toLatex()}\\right) = ${Q.of(-r * s, a).toLatex()}$.`,
            `两个解之积为 $\\frac{c}{a} = ${Q.of(-r * s, a).toLatex()}$，而 $${r} \\times \\left(${Q.of(-s, a).toLatex()}\\right) = ${Q.of(-r * s, a).toLatex()}$。`,
          ),
          [
            t(`This drops the minus sign: $${a}x = -${s}$.`, `这是丢了负号：$${a}x = -${s}$。`),
            t(`This forgets to divide by $${a}$.`, `这是忘了除以 $${a}$。`),
            t(`$-${r}$ is not a solution; the factor $x - ${r}$ gives $+${r}$.`, `$-${r}$ 不是解；因式 $x - ${r}$ 给出 $+${r}$。`),
          ],
        ),
      );
    },
  ),
  spec("Solving Quadratic Equations Using the Quadratic Formula", "用求根公式解二次方程", ["the-quadratic-formula"], (rng, hard) => {
    const p = rng.int(1, 6);
    const d = rng.pick([2, 3, 5, 6, 7]);
    const c = p * p - d;
    const eq = `x^2 - ${2 * p}x ${sg(c)} = 0`;
    const disc = step(
      "Find the discriminant",
      "求判别式",
      `With $a = 1$, $b = -${2 * p}$ and $c = ${c}$: $b^2 - 4ac = ${4 * p * p} ${sg(-4 * c)} = ${4 * d}$.`,
      `其中 $a = 1$，$b = -${2 * p}$，$c = ${c}$：$b^2 - 4ac = ${4 * p * p} ${sg(-4 * c)} = ${4 * d}$。`,
    );
    const formula = step(
      "Apply the formula",
      "代入公式",
      `$x = \\frac{${2 * p} \\pm \\sqrt{${4 * d}}}{2} = \\frac{${2 * p} \\pm 2\\sqrt{${d}}}{2} = ${p} \\pm \\sqrt{${d}}$.`,
      `$x = \\frac{${2 * p} \\pm \\sqrt{${4 * d}}}{2} = \\frac{${2 * p} \\pm 2\\sqrt{${d}}}{2} = ${p} \\pm \\sqrt{${d}}$。`,
    );
    if (!hard)
      return mc(
        rng,
        t(`Which is a solution of $${eq}$?`, `哪个是 $${eq}$ 的解？`),
        `${p} + \\sqrt{${d}}`,
        [`${2 * p} + \\sqrt{${d}}`, `${p} + \\sqrt{${d * 4}}`, `-${p} + \\sqrt{${d}}`, `${p} + ${d}`],
        worked(
          [disc, formula],
          t(
            `$(${p} + \\sqrt{${d}})^2 - ${2 * p}(${p} + \\sqrt{${d}}) = ${p * p} + ${2 * p}\\sqrt{${d}} + ${d} - ${2 * p * p} - ${2 * p}\\sqrt{${d}} = ${d - p * p}$, the opposite of the constant $${c}$, so the left side is $0$.`,
            `$(${p} + \\sqrt{${d}})^2 - ${2 * p}(${p} + \\sqrt{${d}}) = ${p * p} + ${2 * p}\\sqrt{${d}} + ${d} - ${2 * p * p} - ${2 * p}\\sqrt{${d}} = ${d - p * p}$，恰为常数 $${c}$ 的相反数，所以左边为 $0$。`,
          ),
          [
            t(`This uses $-b = ${2 * p}$ without dividing it by $2$.`, `这是用了 $-b = ${2 * p}$，却没有除以 $2$。`),
            t(
              `This forgets that $\\sqrt{${4 * d}} = 2\\sqrt{${d}}$ is divided by $2$ as well.`,
              `这是忘了 $\\sqrt{${4 * d}} = 2\\sqrt{${d}}$ 也要除以 $2$。`,
            ),
            t(
              `The first term has the wrong sign: $-b = ${2 * p}$, so it is $+${p}$.`,
              `第一项的符号错了：$-b = ${2 * p}$，所以是 $+${p}$。`,
            ),
            t(`This adds $${d}$ instead of $\\sqrt{${d}}$.`, `这是加上了 $${d}$，而不是 $\\sqrt{${d}}$。`),
          ],
        ),
      );
    return spr(
      t(
        `The solutions of $${eq}$ are $r$ and $s$. What is the value of $(r - s)^2$?`,
        `$${eq}$ 的解为 $r$ 和 $s$。$(r - s)^2$ 的值是多少？`,
      ),
      4 * d,
      [d, 2 * d, 4 * p * p],
      worked(
        [
          disc,
          formula,
          step(
            "Square the difference",
            "差的平方",
            `$r - s = \\pm 2\\sqrt{${d}}$, and $(2\\sqrt{${d}})^2 = 4 \\times ${d} = ${4 * d}$.`,
            `$r - s = \\pm 2\\sqrt{${d}}$，而 $(2\\sqrt{${d}})^2 = 4 \\times ${d} = ${4 * d}$。`,
          ),
        ],
        t(
          `By Vieta, $r + s = ${2 * p}$ and $rs = ${c}$, so $(r - s)^2 = (r + s)^2 - 4rs = ${4 * p * p} ${sg(-4 * c)} = ${4 * d}$.`,
          `由韦达定理，$r + s = ${2 * p}$，$rs = ${c}$，所以 $(r - s)^2 = (r + s)^2 - 4rs = ${4 * p * p} ${sg(-4 * c)} = ${4 * d}$。`,
        ),
        [
          t(
            `This squares $\\sqrt{${d}}$ but forgets the factor $2$ in $2\\sqrt{${d}}$.`,
            `这是只把 $\\sqrt{${d}}$ 平方，忘了 $2\\sqrt{${d}}$ 中的 $2$。`,
          ),
          t(`This doubles $${d}$, but squaring the $2$ gives $4$.`, `这是把 $${d}$ 乘了 $2$，但 $2$ 的平方是 $4$。`),
          t(`This is $(r + s)^2$, not $(r - s)^2$.`, `这是 $(r + s)^2$，不是 $(r - s)^2$。`),
        ],
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
          worked(
            [
              step(
                "Set the discriminant to zero",
                "令判别式为零",
                `One real solution means $b^2 - 4ac = 0$: $${(2 * a * k) ** 2} - ${4 * a}c = 0$.`,
                `恰有一个实数解意味着 $b^2 - 4ac = 0$：$${(2 * a * k) ** 2} - ${4 * a}c = 0$。`,
              ),
              step(
                "Solve",
                "求解",
                `$c = \\frac{${(2 * a * k) ** 2}}{${4 * a}} = ${a * k * k}$.`,
                `$c = \\frac{${(2 * a * k) ** 2}}{${4 * a}} = ${a * k * k}$。`,
              ),
            ],
            t(
              `Then $${a}x^2 - ${2 * a * k}x + ${a * k * k} = ${a}(x - ${k})^2$, which is zero only at $x = ${k}$.`,
              `此时 $${a}x^2 - ${2 * a * k}x + ${a * k * k} = ${a}(x - ${k})^2$，只在 $x = ${k}$ 时为零。`,
            ),
            [
              t(`This forgets the leading coefficient $${a}$ in $4ac$.`, `这是忘了 $4ac$ 中的首项系数 $${a}$。`),
              t(`This is the size of the middle coefficient, $${2 * a * k}$, not $c$.`, `这是一次项系数的大小 $${2 * a * k}$，不是 $c$。`),
              t(
                `This divides $${(2 * a * k) ** 2}$ by $${a}$ instead of by $${4 * a}$.`,
                `这是用 $${(2 * a * k) ** 2}$ 除以 $${a}$，而不是除以 $${4 * a}$。`,
              ),
            ],
          ),
        );
      return spr(
        t(
          `The equation $${a}x^2 + bx + ${a * k * k} = 0$ has exactly one real solution, and $b > 0$. What is the value of $b$?`,
          `方程 $${a}x^2 + bx + ${a * k * k} = 0$ 恰有一个实数解，且 $b > 0$。$b$ 的值是多少？`,
        ),
        2 * a * k,
        [a * k, -2 * a * k, 4 * a * a * k * k],
        worked(
          [
            step(
              "Set the discriminant to zero",
              "令判别式为零",
              `$b^2 - 4 \\times ${a} \\times ${a * k * k} = 0$, so $b^2 = ${4 * a * a * k * k}$.`,
              `$b^2 - 4 \\times ${a} \\times ${a * k * k} = 0$，所以 $b^2 = ${4 * a * a * k * k}$。`,
            ),
            step(
              "Take the positive root",
              "取正根",
              `$b = \\sqrt{${4 * a * a * k * k}} = ${2 * a * k}$, since $b > 0$.`,
              `因为 $b > 0$，$b = \\sqrt{${4 * a * a * k * k}} = ${2 * a * k}$。`,
            ),
          ],
          t(
            `Then $${a}x^2 + ${2 * a * k}x + ${a * k * k} = ${a}(x + ${k})^2$, which is zero only at $x = -${k}$.`,
            `此时 $${a}x^2 + ${2 * a * k}x + ${a * k * k} = ${a}(x + ${k})^2$，只在 $x = -${k}$ 时为零。`,
          ),
          [
            t(
              `This misses the factor $2$: $\\sqrt{${4 * a * a * k * k}} = ${2 * a * k}$.`,
              `这是漏了因数 $2$：$\\sqrt{${4 * a * a * k * k}} = ${2 * a * k}$。`,
            ),
            t(`This is the negative root, but the question says $b > 0$.`, `这是负根，但题目说 $b > 0$。`),
            t(`This is $b^2$, not $b$.`, `这是 $b^2$，不是 $b$。`),
          ],
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
      const B = (2 * a * k) ** 2;
      if (!hard && rng.bool()) {
        const down = `${a === 1 ? "-" : -a}x^2 + ${2 * a * k}x + c = 0`;
        const ans = -lim + rng.int(1, 5);
        return mcExact(
          rng,
          t(`For which value of $c$ does $${down}$ have two distinct real solutions?`, `$c$ 取何值时，$${down}$ 有两个不同的实数解？`),
          ans,
          [-lim, -lim - 1, -lim - 3],
          worked(
            [
              step(
                "Write the discriminant",
                "写出判别式",
                `With leading coefficient $${-a}$: $${B} - 4 \\times (${-a}) \\times c = ${B} + ${4 * a}c$.`,
                `首项系数为 $${-a}$：$${B} - 4 \\times (${-a}) \\times c = ${B} + ${4 * a}c$。`,
              ),
              step(
                "Make it positive",
                "令其为正",
                `$${B} + ${4 * a}c > 0$ gives $c > ${-lim}$.`,
                `$${B} + ${4 * a}c > 0$ 得 $c > ${-lim}$。`,
              ),
              step("Pick the option", "选出选项", `Only $${ans}$ is greater than $${-lim}$.`, `只有 $${ans}$ 大于 $${-lim}$。`),
            ],
            t(
              `With $c = ${ans}$ the discriminant is $${B} + ${4 * a} \\times (${ans}) = ${B + 4 * a * ans}$, which is positive.`,
              `当 $c = ${ans}$ 时判别式为 $${B} + ${4 * a} \\times (${ans}) = ${B + 4 * a * ans}$，为正。`,
            ),
            [
              t(
                `At $c = ${-lim}$ the discriminant is $0$, which gives one solution, not two.`,
                `$c = ${-lim}$ 时判别式为 $0$，只有一个解，不是两个。`,
              ),
              t(
                `At $c = ${-lim - 1}$ the discriminant is $${-4 * a}$, negative, so there are no real solutions.`,
                `$c = ${-lim - 1}$ 时判别式为 $${-4 * a}$，为负，没有实数解。`,
              ),
              t(
                `At $c = ${-lim - 3}$ the discriminant is $${-12 * a}$, negative, so there are no real solutions.`,
                `$c = ${-lim - 3}$ 时判别式为 $${-12 * a}$，为负，没有实数解。`,
              ),
            ],
          ),
        );
      }
      if (!hard) {
        const ans = lim - rng.int(1, 5);
        return mcExact(
          rng,
          t(`For which value of $c$ does $${eq}$ have two distinct real solutions?`, `$c$ 取何值时，$${eq}$ 有两个不同的实数解？`),
          ans,
          [lim, lim + 1, lim + 3],
          worked(
            [
              step("Write the discriminant", "写出判别式", `$b^2 - 4ac = ${D}$.`, `$b^2 - 4ac = ${D}$。`),
              step("Make it positive", "令其为正", `$${D} > 0$ gives $c < ${lim}$.`, `$${D} > 0$ 得 $c < ${lim}$。`),
              step("Pick the option", "选出选项", `Only $${ans}$ is less than $${lim}$.`, `只有 $${ans}$ 小于 $${lim}$。`),
            ],
            t(
              `With $c = ${ans}$ the discriminant is $${B} - ${4 * a} \\times ${ans} = ${B - 4 * a * ans}$, which is positive.`,
              `当 $c = ${ans}$ 时判别式为 $${B} - ${4 * a} \\times ${ans} = ${B - 4 * a * ans}$，为正。`,
            ),
            [
              t(
                `At $c = ${lim}$ the discriminant is $0$, which gives one solution, not two.`,
                `$c = ${lim}$ 时判别式为 $0$，只有一个解，不是两个。`,
              ),
              t(
                `At $c = ${lim + 1}$ the discriminant is $${-4 * a}$, negative, so there are no real solutions.`,
                `$c = ${lim + 1}$ 时判别式为 $${-4 * a}$，为负，没有实数解。`,
              ),
              t(
                `At $c = ${lim + 3}$ the discriminant is $${-12 * a}$, negative, so there are no real solutions.`,
                `$c = ${lim + 3}$ 时判别式为 $${-12 * a}$，为负，没有实数解。`,
              ),
            ],
          ),
        );
      }
      return spr(
        t(
          `The equation $${eq}$ has two distinct real solutions, and $c$ is an integer. What is the greatest possible value of $c$?`,
          `方程 $${eq}$ 有两个不同的实数解，且 $c$ 是整数。$c$ 的最大可能值是多少？`,
        ),
        lim - 1,
        [lim, lim + 1, 2 * a * k],
        worked(
          [
            step("Make the discriminant positive", "令判别式为正", `$${D} > 0$.`, `$${D} > 0$。`),
            step("Solve for c", "解出常数", `$${4 * a}c < ${B}$, so $c < ${lim}$.`, `$${4 * a}c < ${B}$，所以 $c < ${lim}$。`),
            step(
              "Take the greatest integer",
              "取最大整数",
              `The greatest integer below $${lim}$ is $${lim - 1}$.`,
              `小于 $${lim}$ 的最大整数是 $${lim - 1}$。`,
            ),
          ],
          t(
            `At $c = ${lim - 1}$ the discriminant is $${4 * a}$, positive, while at $c = ${lim}$ it is $0$.`,
            `$c = ${lim - 1}$ 时判别式为 $${4 * a}$，为正；而 $c = ${lim}$ 时为 $0$。`,
          ),
          [
            t(`At $c = ${lim}$ the discriminant is $0$, so there is only one solution.`, `$c = ${lim}$ 时判别式为 $0$，只有一个解。`),
            t(
              `At $c = ${lim + 1}$ the discriminant is negative, so there are no real solutions.`,
              `$c = ${lim + 1}$ 时判别式为负，没有实数解。`,
            ),
            t(`This is the coefficient of $x$, not a bound on $c$.`, `这是一次项系数，不是 $c$ 的界限。`),
          ],
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
      const B = (2 * a * k) ** 2;
      if (!hard && rng.bool()) {
        const down = `${a === 1 ? "-" : -a}x^2 + ${2 * a * k}x + c = 0`;
        const ans = -lim - rng.int(1, 5);
        return mcExact(
          rng,
          t(`For which value of $c$ does $${down}$ have no real solutions?`, `$c$ 取何值时，$${down}$ 没有实数解？`),
          ans,
          [-lim, -lim + 1, -lim + 3],
          worked(
            [
              step(
                "Write the discriminant",
                "写出判别式",
                `With leading coefficient $${-a}$: $${B} - 4 \\times (${-a}) \\times c = ${B} + ${4 * a}c$.`,
                `首项系数为 $${-a}$：$${B} - 4 \\times (${-a}) \\times c = ${B} + ${4 * a}c$。`,
              ),
              step(
                "Make it negative",
                "令其为负",
                `$${B} + ${4 * a}c < 0$ gives $c < ${-lim}$.`,
                `$${B} + ${4 * a}c < 0$ 得 $c < ${-lim}$。`,
              ),
              step("Pick the option", "选出选项", `Only $${ans}$ is less than $${-lim}$.`, `只有 $${ans}$ 小于 $${-lim}$。`),
            ],
            t(
              `With $c = ${ans}$ the discriminant is $${B} + ${4 * a} \\times (${ans}) = ${B + 4 * a * ans}$, which is negative.`,
              `当 $c = ${ans}$ 时判别式为 $${B} + ${4 * a} \\times (${ans}) = ${B + 4 * a * ans}$，为负。`,
            ),
            [
              t(`At $c = ${-lim}$ the discriminant is $0$, which gives one real solution.`, `$c = ${-lim}$ 时判别式为 $0$，有一个实数解。`),
              t(
                `At $c = ${-lim + 1}$ the discriminant is $${4 * a}$, positive, which gives two real solutions.`,
                `$c = ${-lim + 1}$ 时判别式为 $${4 * a}$，为正，有两个实数解。`,
              ),
              t(
                `At $c = ${-lim + 3}$ the discriminant is $${12 * a}$, positive, which gives two real solutions.`,
                `$c = ${-lim + 3}$ 时判别式为 $${12 * a}$，为正，有两个实数解。`,
              ),
            ],
          ),
        );
      }
      if (!hard) {
        const ans = lim + rng.int(1, 5);
        return mcExact(
          rng,
          t(`For which value of $c$ does $${eq}$ have no real solutions?`, `$c$ 取何值时，$${eq}$ 没有实数解？`),
          ans,
          [lim, lim - 1, lim - 3],
          worked(
            [
              step("Write the discriminant", "写出判别式", `$b^2 - 4ac = ${D}$.`, `$b^2 - 4ac = ${D}$。`),
              step("Make it negative", "令其为负", `$${D} < 0$ gives $c > ${lim}$.`, `$${D} < 0$ 得 $c > ${lim}$。`),
              step("Pick the option", "选出选项", `Only $${ans}$ is greater than $${lim}$.`, `只有 $${ans}$ 大于 $${lim}$。`),
            ],
            t(
              `With $c = ${ans}$ the discriminant is $${B} - ${4 * a} \\times ${ans} = ${B - 4 * a * ans}$, which is negative.`,
              `当 $c = ${ans}$ 时判别式为 $${B} - ${4 * a} \\times ${ans} = ${B - 4 * a * ans}$，为负。`,
            ),
            [
              t(`At $c = ${lim}$ the discriminant is $0$, which gives one real solution.`, `$c = ${lim}$ 时判别式为 $0$，有一个实数解。`),
              t(
                `At $c = ${lim - 1}$ the discriminant is $${4 * a}$, positive, which gives two real solutions.`,
                `$c = ${lim - 1}$ 时判别式为 $${4 * a}$，为正，有两个实数解。`,
              ),
              t(
                `At $c = ${lim - 3}$ the discriminant is $${12 * a}$, positive, which gives two real solutions.`,
                `$c = ${lim - 3}$ 时判别式为 $${12 * a}$，为正，有两个实数解。`,
              ),
            ],
          ),
        );
      }
      return spr(
        t(
          `The equation $${eq}$ has no real solutions, and $c$ is an integer. What is the least possible value of $c$?`,
          `方程 $${eq}$ 没有实数解，且 $c$ 是整数。$c$ 的最小可能值是多少？`,
        ),
        lim + 1,
        [lim, lim - 1, 2 * a * k + 1],
        worked(
          [
            step("Make the discriminant negative", "令判别式为负", `$${D} < 0$.`, `$${D} < 0$。`),
            step("Solve for c", "解出常数", `$${4 * a}c > ${B}$, so $c > ${lim}$.`, `$${4 * a}c > ${B}$，所以 $c > ${lim}$。`),
            step(
              "Take the least integer",
              "取最小整数",
              `The least integer above $${lim}$ is $${lim + 1}$.`,
              `大于 $${lim}$ 的最小整数是 $${lim + 1}$。`,
            ),
          ],
          t(
            `At $c = ${lim + 1}$ the discriminant is $${-4 * a}$, negative, while at $c = ${lim}$ it is $0$.`,
            `$c = ${lim + 1}$ 时判别式为 $${-4 * a}$，为负；而 $c = ${lim}$ 时为 $0$。`,
          ),
          [
            t(`At $c = ${lim}$ the discriminant is $0$, so there is one real solution.`, `$c = ${lim}$ 时判别式为 $0$，有一个实数解。`),
            t(
              `At $c = ${lim - 1}$ the discriminant is positive, so there are two real solutions.`,
              `$c = ${lim - 1}$ 时判别式为正，有两个实数解。`,
            ),
            t(
              `This adds $1$ to the coefficient of $x$, but the bound comes from the discriminant.`,
              `这是给一次项系数加了 $1$，但界限来自判别式。`,
            ),
          ],
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
    const fours = a === 1 ? `4 \\times ${par(c)}` : `4 \\times ${a} \\times ${par(c)}`;
    const reasons = [
      t(`Two solutions need a positive discriminant, but it is $${D}$.`, `有两个解需要判别式为正，但它是 $${D}$。`),
      t(`One solution needs a discriminant of $0$, but it is $${D}$.`, `有一个解需要判别式为 $0$，但它是 $${D}$。`),
      t(`No real solutions need a negative discriminant, but it is $${D}$.`, `没有实数解需要判别式为负，但它是 $${D}$。`),
    ];
    return words(
      rng,
      t(`How many distinct real solutions does $${eq}$ have?`, `$${eq}$ 有多少个不同的实数解？`),
      ans[useKind]!,
      [...ans.filter((_, i) => i !== useKind), t("Infinitely many", "无穷多个")],
      worked(
        [
          step("Find the discriminant", "求判别式", `$b^2 - 4ac = ${b}^2 - ${fours} = ${D}$.`, `$b^2 - 4ac = ${b}^2 - ${fours} = ${D}$。`),
          step(
            "Read its sign",
            "看符号",
            D > 0
              ? `The discriminant is positive, so there are two distinct real solutions.`
              : D === 0
                ? `The discriminant is zero, so there is exactly one real solution.`
                : `The discriminant is negative, so there are no real solutions.`,
            D > 0 ? `判别式为正，所以有两个不同的实数解。` : D === 0 ? `判别式为零，所以恰有一个实数解。` : `判别式为负，所以没有实数解。`,
          ),
        ],
        D > 0
          ? t(
              `The formula gives $x = \\frac{-${b} \\pm \\sqrt{${D}}}{${2 * a}}$, two different values because $\\sqrt{${D}} > 0$.`,
              `公式给出 $x = \\frac{-${b} \\pm \\sqrt{${D}}}{${2 * a}}$，因为 $\\sqrt{${D}} > 0$，这是两个不同的值。`,
            )
          : D === 0
            ? t(
                `With a zero discriminant the formula gives only $x = -\\frac{${b}}{${2 * a}} = ${Q.of(-b, 2 * a).toLatex()}$.`,
                `判别式为零时，公式只给出 $x = -\\frac{${b}}{${2 * a}} = ${Q.of(-b, 2 * a).toLatex()}$。`,
              )
            : t(
                `The formula would need $\\sqrt{${D}}$, the square root of a negative number, which is not real.`,
                `公式需要 $\\sqrt{${D}}$，即负数的平方根，它不是实数。`,
              ),
        [
          ...[0, 1, 2].filter((i) => i !== useKind).map((i) => reasons[i]!),
          t(`A quadratic equation has at most two solutions, never infinitely many.`, `二次方程至多有两个解，不会有无穷多个。`),
        ],
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
    const D = b * b - 4 * a * c;
    if (!hard)
      return mc(
        rng,
        t(`What is the sum of the solutions of $${eq}$?`, `$${eq}$ 的解之和是多少？`),
        sum,
        [Q.of(b, a), Q.of(c, a), Q.of(-c, a), Q.of(-b, a + 1)],
        worked(
          [
            step(
              "Read the coefficients",
              "读出系数",
              `Here $a = ${a}$, $b = ${b}$ and $c = ${c}$.`,
              `这里 $a = ${a}$，$b = ${b}$，$c = ${c}$。`,
            ),
            step(
              "Use the sum rule",
              "用和的公式",
              `The solutions add to $-\\frac{b}{a}$, which here is $${sum.toLatex()}$.`,
              `两个解之和为 $-\\frac{b}{a}$，这里是 $${sum.toLatex()}$。`,
            ),
          ],
          t(
            `The discriminant is $${D} > 0$, so there are two real solutions, $\\frac{-b + \\sqrt{${D}}}{2a}$ and $\\frac{-b - \\sqrt{${D}}}{2a}$. Their roots cancel when added, leaving $\\frac{-2b}{2a} = -\\frac{b}{a} = ${sum.toLatex()}$.`,
            `判别式为 $${D} > 0$，有两个实数解 $\\frac{-b + \\sqrt{${D}}}{2a}$ 和 $\\frac{-b - \\sqrt{${D}}}{2a}$。相加时根号部分相消，剩下 $\\frac{-2b}{2a} = -\\frac{b}{a} = ${sum.toLatex()}$。`,
          ),
          [
            t(`This drops the minus sign of $-\\frac{b}{a}$.`, `这是丢了 $-\\frac{b}{a}$ 中的负号。`),
            t(`$\\frac{c}{a}$ is the product of the solutions, not their sum.`, `$\\frac{c}{a}$ 是两个解之积，不是和。`),
            t(`This uses $c$ in place of $b$.`, `这是用 $c$ 代替了 $b$。`),
            t(`The denominator is $a = ${a}$, not $${a + 1}$.`, `分母是 $a = ${a}$，不是 $${a + 1}$。`),
          ],
        ),
      );
    return spr(
      t(`If $r$ and $s$ are the solutions of $${eq}$, what is the value of $rs$?`, `若 $r$ 和 $s$ 是 $${eq}$ 的解，则 $rs$ 的值是多少？`),
      Q.of(c, a),
      [Q.of(-c, a), Q.of(b, a), c],
      worked(
        [
          step(
            "Read the coefficients",
            "读出系数",
            `Here $a = ${a}$, $b = ${b}$ and $c = ${c}$.`,
            `这里 $a = ${a}$，$b = ${b}$，$c = ${c}$。`,
          ),
          step(
            "Use the product rule",
            "用积的公式",
            `The solutions multiply to $\\frac{c}{a}$, which here is $${Q.of(c, a).toLatex()}$.`,
            `两个解之积为 $\\frac{c}{a}$，这里是 $${Q.of(c, a).toLatex()}$。`,
          ),
        ],
        t(
          `Multiplying the two solutions of the formula: $\\frac{b^2 - (b^2 - 4ac)}{4a^2} = \\frac{4ac}{4a^2} = \\frac{c}{a}$, with discriminant $${D} > 0$, so both are real.`,
          `把公式给出的两个解相乘：$\\frac{b^2 - (b^2 - 4ac)}{4a^2} = \\frac{4ac}{4a^2} = \\frac{c}{a}$；判别式为 $${D} > 0$，两个解都是实数。`,
        ),
        [
          t(`The product is $\\frac{c}{a}$, without a minus sign.`, `积是 $\\frac{c}{a}$，没有负号。`),
          t(`This uses $b$; the product of the solutions uses $c$.`, `这是用了 $b$；解之积用的是 $c$。`),
          t(`This forgets to divide by $a = ${a}$.`, `这是忘了除以 $a = ${a}$。`),
        ],
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
        worked(
          [
            step(
              "Use the product of the solutions",
              "用两解之积",
              `The solutions of $x^2 - kx + ${r * s} = 0$ multiply to $${r * s}$.`,
              `$x^2 - kx + ${r * s} = 0$ 的两个解之积为 $${r * s}$。`,
            ),
            step("Divide", "相除", `The other solution is $${r * s} \\div ${r} = ${s}$.`, `另一个解是 $${r * s} \\div ${r} = ${s}$。`),
          ],
          t(
            `Then $k = ${r} + ${s} = ${r + s}$, and $x = ${s}$ gives $${s * s} - ${(r + s) * s} + ${r * s} = 0$.`,
            `于是 $k = ${r} + ${s} = ${r + s}$，而 $x = ${s}$ 时 $${s * s} - ${(r + s) * s} + ${r * s} = 0$。`,
          ),
          [
            t(`This is $k$, the sum of the solutions, not the other solution.`, `这是 $k$，即两个解之和，不是另一个解。`),
            t(`This is the product of the solutions, $${r * s}$.`, `这是两个解之积 $${r * s}$。`),
            t(
              `The product $${r * s}$ is positive, so the other solution has the same sign as $${r}$.`,
              `积 $${r * s}$ 为正，所以另一个解与 $${r}$ 同号。`,
            ),
          ],
        ),
      );
    return spr(
      t(
        `One solution of $x^2 - kx + ${r * s} = 0$ is $${r}$, where $k$ is a constant. What is the value of $k$?`,
        `$x^2 - kx + ${r * s} = 0$ 的一个解是 $${r}$，其中 $k$ 是常数。$k$ 的值是多少？`,
      ),
      r + s,
      [s, r * s, s - r],
      worked(
        [
          step(
            "Substitute",
            "代入",
            `Put $x = ${r}$: $${r * r} - ${cx(r, "k")} + ${r * s} = 0$.`,
            `代入 $x = ${r}$：$${r * r} - ${cx(r, "k")} + ${r * s} = 0$。`,
          ),
          step(
            "Solve for k",
            "解出参数",
            r === 1 ? `$k = ${r * r + r * s}$.` : `$${r}k = ${r * r + r * s}$, so $k = ${r + s}$.`,
            r === 1 ? `$k = ${r * r + r * s}$。` : `$${r}k = ${r * r + r * s}$，所以 $k = ${r + s}$。`,
          ),
        ],
        t(
          `The other solution is $${r * s} \\div ${r} = ${s}$, and the solutions add to $${r} + ${s} = ${r + s}$, which is $k$.`,
          `另一个解是 $${r * s} \\div ${r} = ${s}$，两个解之和为 $${r} + ${s} = ${r + s}$，正是 $k$。`,
        ),
        [
          t(`This is the other solution, $${s}$, but $k$ is the sum of both solutions.`, `这是另一个解 $${s}$，但 $k$ 是两个解之和。`),
          t(`This is the product of the solutions, but $k$ is their sum.`, `这是两个解之积，但 $k$ 是它们的和。`),
          t(`This subtracts the solutions, but $k$ is their sum.`, `这是两个解之差，但 $k$ 是它们的和。`),
        ],
      ),
    );
  }),
];
