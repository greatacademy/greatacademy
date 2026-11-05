import { t } from "@ga/content";

import type { ExamLesson } from "../exam.ts";

/** satExamLessons are the lessons of the SAT exam topics, by topic id. */
export const satExamLessons: Readonly<Record<string, ExamLesson>> = {
  "sat-exam-adding-polynomials": {
    tip: t(
      "To add polynomials, drop the parentheses and combine like terms: add the coefficients of each power of $x$ and keep the power unchanged. For example, $(2x^2 + x) + (x^2 + 5x) = 3x^2 + 6x$. A term whose coefficients cancel disappears, so do not leave a zero term behind.",
      "多项式相加时，去掉括号后合并同类项：把 $x$ 的同次幂系数相加，幂次不变。例如 $(2x^2 + x) + (x^2 + 5x) = 3x^2 + 6x$。如果某一项的系数相互抵消，这一项就消失了，不必保留零项。",
    ),
    hardTip: t(
      "Subtracting a polynomial changes the sign of every term in the second parentheses, not just the first: $(x^2 + 3x) - (x^2 - 2x) = 5x$. Then read off the coefficient the unknown stands for by matching powers of $x$ on both sides. The usual wrong answer forgets to flip a negative term.",
      "减去一个多项式时，第二个括号里的每一项都要变号，而不只是第一项：$(x^2 + 3x) - (x^2 - 2x) = 5x$。然后比较等式两边 $x$ 的同次幂，读出未知数对应的系数。常见的错误答案就是忘了给负项变号。",
    ),
  },
  "sat-exam-adding-polynomials-using-the-distributive-law": {
    tip: t(
      "First multiply each outside number through its parentheses, then add the two results by combining like terms. For example, $2(x + 5) + 4(x - 1) = 2x + 10 + 4x - 4 = 6x + 6$. The trap is multiplying only the first term inside a parenthesis.",
      "先把括号外的数分别乘进各自的括号，再把两个结果合并同类项。例如 $2(x + 5) + 4(x - 1) = 2x + 10 + 4x - 4 = 6x + 6$。容易犯的错误是只乘了括号里的第一项。",
    ),
    hardTip: t(
      "When the second product is subtracted, distribute the negative along with the factor, so a minus inside turns into a plus: $2(x + 5) - 4(x - 1) = 2x + 10 - 4x + 4 = -2x + 14$. Then match the $x$ coefficient and constant with $px + q$, and report only the one asked for.",
      "如果第二个乘积是被减去的，要把负号连同系数一起分配，括号内的减号因此变成加号：$2(x + 5) - 4(x - 1) = 2x + 10 - 4x + 4 = -2x + 14$。再与 $px + q$ 对照 $x$ 的系数和常数项，只回答题目问的那一个。",
    ),
  },
  "sat-exam-multiplying-binomials": {
    tip: t(
      "Multiply each term of the first binomial by each term of the second, which makes four products, then combine the two middle ones. For example, $(x - 3)(4x - 1) = 4x^2 - x - 12x + 3 = 4x^2 - 13x + 3$. Watch the signs: two negatives multiply to a positive constant.",
      "把第一个二项式的每一项分别乘第二个二项式的每一项，共得四个乘积，再合并中间两项。例如 $(x - 3)(4x - 1) = 4x^2 - x - 12x + 3 = 4x^2 - 13x + 3$。注意符号：两个负数相乘，常数项为正。",
    ),
    hardTip: t(
      "You could expand and add the three coefficients, but there is a shortcut. An identity holds for every $x$, and substituting $x = 1$ turns $rx^2 + sx + u$ into $r + s + u$. So just evaluate the factored side at $x = 1$: for $(x + 2)(3x - 1)$ the sum of coefficients is $3 \\cdot 2 = 6$.",
      "可以展开后把三个系数相加，但有捷径。恒等式对所有 $x$ 都成立，代入 $x = 1$ 后 $rx^2 + sx + u$ 就变成 $r + s + u$。所以只要算出因式形式在 $x = 1$ 时的值：$(x + 2)(3x - 1)$ 的系数和是 $3 \\cdot 2 = 6$。",
    ),
  },
  "sat-exam-factoring-polynomials-using-the-gcf": {
    tip: t(
      "Find the greatest common factor of the terms: the largest number dividing all coefficients, times the lowest power of $x$ present in every term. Divide each term by it and write the quotient in parentheses. For example, $10x^2 + 15x = 5x(2x + 3)$. Check by distributing back.",
      "先找各项的最大公因式：能整除所有系数的最大数，乘上每一项都含有的 $x$ 的最低次幂。用它去除每一项，把商写进括号。例如 $10x^2 + 15x = 5x(2x + 3)$。可以再分配回去检验。",
    ),
    hardTip: t(
      "With three terms and a given outside factor, divide every term by that factor to reveal each coefficient inside. For example, $8x^3 + 12x^2 + 4x = 4x(2x^2 + 3x + 1)$. Remember that dividing a term by $x$ lowers its exponent by one, and the last term still contributes a constant.",
      "有三项且已给定括号外的因式时，用这个因式去除每一项，就能得到括号内的各个系数。例如 $8x^3 + 12x^2 + 4x = 4x(2x^2 + 3x + 1)$。记住除以 $x$ 会使指数减一，最后一项仍然留下一个常数。",
    ),
  },
  "sat-exam-factoring-binomials-using-differences-of-squares": {
    tip: t(
      "A difference of two perfect squares factors as $a^2 - b^2 = (a - b)(a + b)$. Write each term as a square, including the coefficient: $9x^2 - 4 = (3x)^2 - 2^2 = (3x - 2)(3x + 2)$. A sum of squares does not factor this way, and the coefficient must be square-rooted too.",
      "两个完全平方数之差可以分解为 $a^2 - b^2 = (a - b)(a + b)$。把每一项写成平方，系数也要写进去：$9x^2 - 4 = (3x)^2 - 2^2 = (3x - 2)(3x + 2)$。平方和不能这样分解，而且系数也要开方。",
    ),
    hardTip: t(
      "When a problem gives the sum and difference of two quantities and asks for the difference of their squares, do not solve for each one. Use $x^2 - y^2 = (x + y)(x - y)$ directly and multiply the given values. For example, a sum of $3$ and a difference of $7$ give $21$.",
      "题目给出两个量的和与差，问它们的平方差时，不必分别求出这两个量。直接用 $x^2 - y^2 = (x + y)(x - y)$，把给定的值相乘即可。例如和为 $3$、差为 $7$ 时，平方差就是 $21$。",
    ),
  },
  "sat-exam-factoring-trinomials": {
    tip: t(
      "To factor $x^2 + bx + c$, look for two numbers whose product is $c$ and whose sum is $b$. They become the constants in the factors. For $x^2 + 8x + 15$, the numbers $3$ and $5$ work, so it equals $(x + 3)(x + 5)$. Pairs with the right product but wrong sum are the usual distractors.",
      "分解 $x^2 + bx + c$ 时，找两个数，使它们的积为 $c$、和为 $b$，它们就是因式里的常数。对 $x^2 + 8x + 15$，$3$ 和 $5$ 符合，所以它等于 $(x + 3)(x + 5)$。积对而和不对的数对是常见的干扰项。",
    ),
    hardTip: t(
      "Here one factor is known and the middle coefficient is missing. The constants of the two factors must multiply to the constant term, so divide to find the other factor's constant; then their sum is the middle coefficient. If $x + 2$ is a factor of $x^2 + kx + 18$, the other is $x + 9$ and $k = 11$.",
      "这里已知一个因式，缺的是中间项系数。两个因式的常数之积等于常数项，所以用除法求出另一个因式的常数，两常数之和就是中间项系数。若 $x + 2$ 是 $x^2 + kx + 18$ 的因式，另一个因式是 $x + 9$，于是 $k = 11$。",
    ),
  },
  "sat-exam-factoring-higher-order-polynomials": {
    tip: t(
      "An even power is itself a square, because $x^{2n} = (x^n)^2$. So a high power minus a perfect square is still a difference of squares: $x^{6} - 49 = (x^{3} - 7)(x^{3} + 7)$. Halve the exponent, do not take its square root; that is the trap in the wrong options.",
      "偶次幂本身就是平方，因为 $x^{2n} = (x^n)^2$。所以高次幂减去一个完全平方数仍是平方差：$x^{6} - 49 = (x^{3} - 7)(x^{3} + 7)$。指数要减半，而不是开方，这正是错误选项设下的陷阱。",
    ),
    hardTip: t(
      "When both terms share a power of $x$, take out that common factor first, then look at what remains. For example, $9x^4 - 16x^2 = x^2(9x^2 - 16) = x^2(3x - 4)(3x + 4)$. Options that stop after one step, or that drop the outside $x^2$, are not fully equivalent or fully factored.",
      "两项有公共的 $x$ 幂时，先提出公因式，再看剩下的部分。例如 $9x^4 - 16x^2 = x^2(9x^2 - 16) = x^2(3x - 4)(3x + 4)$。只分解到一半的选项没有分解彻底，漏掉外面 $x^2$ 的选项则与原式不等价。",
    ),
  },
  "sat-exam-simplifying-rational-expressions-by-factoring": {
    tip: t(
      "Factor the numerator completely, first any common number and then any difference of squares, and cancel the factor that also appears in the denominator. For example, $\\frac{3x^2 - 27}{x - 3} = \\frac{3(x - 3)(x + 3)}{x - 3} = 3x + 9$. Only whole factors cancel, never single terms.",
      "把分子彻底分解：先提公因数，再用平方差公式，然后约去分母中也有的因式。例如 $\\frac{3x^2 - 27}{x - 3} = \\frac{3(x - 3)(x + 3)}{x - 3} = 3x + 9$。只能约去整个因式，不能约去单独的项。",
    ),
    hardTip: t(
      "If the denominator is a monomial such as $3x$, factor it out of the numerator's terms and cancel, which amounts to dividing every term by it: $\\frac{3x^2 + 12x}{3x} = \\frac{3x(x + 4)}{3x} = x + 4$. The tempting mistake is to divide only one term of the numerator.",
      "分母是 $3x$ 这样的单项式时，把它从分子各项中提出来再约分，相当于用它除分子的每一项：$\\frac{3x^2 + 12x}{3x} = \\frac{3x(x + 4)}{3x} = x + 4$。容易出的错是只除了分子的一项。",
    ),
  },
  "sat-exam-simplifying-rational-expressions-using-polynomial-factorization": {
    tip: t(
      "Factor the trinomial on top into two binomials, using numbers with the right sum and product, then cancel the binomial equal to the denominator. For example, $\\frac{x^2 + 6x + 5}{x + 1} = \\frac{(x + 1)(x + 5)}{x + 1} = x + 5$. Do not cancel the $x$ terms individually.",
      "用和与积都符合的两个数，把分子的三项式分解成两个二项式，再约去与分母相同的那个。例如 $\\frac{x^2 + 6x + 5}{x + 1} = \\frac{(x + 1)(x + 5)}{x + 1} = x + 5$。不要把 $x$ 项单独约掉。",
    ),
    hardTip: t(
      "Now both numerator and denominator are trinomials, so factor each one separately and cancel the binomial they share; what is left stays as a fraction. For example, $\\frac{x^2 + 3x + 2}{x^2 + 5x + 6} = \\frac{(x + 1)(x + 2)}{(x + 2)(x + 3)} = \\frac{x + 1}{x + 3}$.",
      "现在分子和分母都是三项式，要分别分解，再约去公共的二项式，剩下的部分仍写成分式。例如 $\\frac{x^2 + 3x + 2}{x^2 + 5x + 6} = \\frac{(x + 1)(x + 2)}{(x + 2)(x + 3)} = \\frac{x + 1}{x + 3}$。",
    ),
  },
  "sat-exam-adding-rational-expressions": {
    tip: t(
      "Fractions with the same denominator add by adding the numerators and keeping that denominator: $\\frac{2}{y} + \\frac{7}{y} = \\frac{9}{y}$. The denominator does not double. Options showing a doubled or squared denominator come from treating the bottoms like the tops.",
      "分母相同的分式相加，只把分子相加，分母不变：$\\frac{2}{y} + \\frac{7}{y} = \\frac{9}{y}$。分母不会变成两倍。选项中分母翻倍或变成平方的，都是把分母当成分子一样处理造成的。",
    ),
    hardTip: t(
      "With different denominators, use their product as the common denominator. Multiply each numerator by the other denominator, then add: $\\frac{3}{x + 1} + \\frac{2}{x + 5} = \\frac{3(x + 5) + 2(x + 1)}{(x + 1)(x + 5)} = \\frac{5x + 17}{(x + 1)(x + 5)}$. Simply adding tops and bottoms is wrong.",
      "分母不同时，用它们的乘积作公分母。每个分子乘上另一个分式的分母，再相加：$\\frac{3}{x + 1} + \\frac{2}{x + 5} = \\frac{3(x + 5) + 2(x + 1)}{(x + 1)(x + 5)} = \\frac{5x + 17}{(x + 1)(x + 5)}$。把分子、分母各自直接相加是错的。",
    ),
  },
  "sat-exam-further-adding-rational-expressions": {
    tip: t(
      "Factor the more complicated denominator first; it often already contains the simpler one, so it serves as the common denominator. For $\\frac{1}{x - 3} + \\frac{5}{x^2 - 9}$, multiply the first fraction's top and bottom by $x + 3$, giving $\\frac{x + 3 + 5}{x^2 - 9} = \\frac{x + 8}{x^2 - 9}$.",
      "先分解较复杂的分母，它往往已经含有较简单的分母，可以直接作公分母。对 $\\frac{1}{x - 3} + \\frac{5}{x^2 - 9}$，把第一个分式的分子分母同乘 $x + 3$，得到 $\\frac{x + 3 + 5}{x^2 - 9} = \\frac{x + 8}{x^2 - 9}$。",
    ),
    hardTip: t(
      "When the target denominator is given, rewrite each fraction over it. If a denominator lacks a factor, multiply its top by that factor; then the unknown is the sum of the new numerators. For $\\frac{3}{x} + \\frac{1}{5x} = \\frac{k}{5x}$, the first becomes $\\frac{15}{5x}$, so $k = 16$. Do not add the original numerators.",
      "题目给定目标分母时，把每个分式都化成这个分母。若分母缺某个因数，就把分子乘上它，未知数就是新分子之和。对 $\\frac{3}{x} + \\frac{1}{5x} = \\frac{k}{5x}$，第一个分式变成 $\\frac{15}{5x}$，所以 $k = 16$。不要直接把原来的分子相加。",
    ),
  },
  "sat-exam-fractions-of-fractions": {
    tip: t(
      "Dividing by a fraction is multiplying by its reciprocal, so a fraction inside a denominator flips: $\\frac{a}{\\frac{b}{x}} = a \\cdot \\frac{x}{b} = \\frac{ax}{b}$. For instance, $\\frac{3}{\\frac{5}{x}} = \\frac{3x}{5}$. The variable moves up into the numerator; options that keep it below have not flipped.",
      "除以一个分数就是乘它的倒数，所以分母里的分数要倒过来：$\\frac{a}{\\frac{b}{x}} = a \\cdot \\frac{x}{b} = \\frac{ax}{b}$。例如 $\\frac{3}{\\frac{5}{x}} = \\frac{3x}{5}$。变量移到了分子上，仍把它留在下面的选项就是没有取倒数。",
    ),
    hardTip: t(
      "If the denominator is a sum of fractions, combine it into one fraction first, then flip, then substitute. For example, $\\frac{1}{\\frac{1}{x} + \\frac{2}{x}} = \\frac{1}{\\frac{3}{x}} = \\frac{x}{3}$, which equals $5$ when $x = 15$. Flipping each piece separately, to get $x + x$, is the error to avoid.",
      "如果分母是几个分数之和，先合并成一个分数，再取倒数，最后代入数值。例如 $\\frac{1}{\\frac{1}{x} + \\frac{2}{x}} = \\frac{1}{\\frac{3}{x}} = \\frac{x}{3}$，当 $x = 15$ 时等于 $5$。把每一部分分别取倒数、得到 $x + x$ 是要避免的错误。",
    ),
  },
  "sat-exam-exponential-expressions": {
    tip: t(
      "When powers of the same base are multiplied, keep the base and add the exponents: $y^{3} \\cdot y^{5} = y^{8}$. Three factors of $y$ and five more make eight in all. Multiplying the exponents, which would give $y^{15}$, is the standard wrong choice.",
      "同底数幂相乘，底数不变，指数相加：$y^{3} \\cdot y^{5} = y^{8}$。三个 $y$ 再加五个 $y$，一共八个。把指数相乘得到 $y^{15}$ 是典型的错误选项。",
    ),
    hardTip: t(
      "With a product over a quotient, apply both rules: add exponents for multiplication in the numerator, then subtract the denominator's exponent. For example, $\\frac{x^{3} \\cdot x^{5}}{x^{4}} = x^{3 + 5 - 4} = x^{4}$. Dividing exponents instead of subtracting is the mistake that leads to wrong values of $k$.",
      "既有乘积又有商时，两条法则都要用：分子相乘时指数相加，再减去分母的指数。例如 $\\frac{x^{3} \\cdot x^{5}}{x^{4}} = x^{3 + 5 - 4} = x^{4}$。把指数相除而不是相减，就会得到错误的 $k$。",
    ),
  },
  "sat-exam-simplifying-exponential-expressions": {
    tip: t(
      "A power of a product applies to every factor: raise the coefficient to the power and multiply the exponents of the variable. So $(2y^{3})^{5} = 2^{5}y^{15} = 32y^{15}$. Common wrong answers multiply the coefficient by the outside exponent, or add the exponents instead of multiplying them.",
      "积的乘方要作用到每个因数上：系数乘方，变量的指数相乘。所以 $(2y^{3})^{5} = 2^{5}y^{15} = 32y^{15}$。常见的错误是把系数与外面的指数相乘，或者把指数相加而不是相乘。",
    ),
    hardTip: t(
      "To combine a root with a power, rewrite the root as a fractional exponent, $\\sqrt[n]{x} = x^{\\frac{1}{n}}$, then add exponents over a common denominator. For example, $\\sqrt{x} \\cdot x^{2} = x^{\\frac{1}{2} + 2} = x^{\\frac{5}{2}}$. Do not confuse the index of the root with a whole-number exponent.",
      "要把根式与幂合并，先把根式写成分数指数 $\\sqrt[n]{x} = x^{\\frac{1}{n}}$，再通分把指数相加。例如 $\\sqrt{x} \\cdot x^{2} = x^{\\frac{1}{2} + 2} = x^{\\frac{5}{2}}$。不要把根指数当成整数指数。",
    ),
  },
  "sat-exam-simplifying-exponential-expressions-using-the-distributive-law": {
    tip: t(
      "Distribute the outside power to each term in the parentheses. On a term with the same base, add exponents; on a plain number, simply write the product. For example, $x^{3}(x^{5} + 2) = x^{8} + 2x^{3}$. Forgetting to multiply the constant term is the frequent slip here.",
      "把括号外的幂分配给括号里的每一项。遇到同底数的项，指数相加；遇到常数，直接写成乘积。例如 $x^{3}(x^{5} + 2) = x^{8} + 2x^{3}$。常见的疏漏是忘了乘常数项。",
    ),
    hardTip: t(
      "Adding powers does not add their exponents. Instead, factor out the smaller power and write the larger as a multiple of it, since $a^{n + 1} = a \\cdot a^{n}$. For example, $3^{6} + 3^{5} = 3^{5}(3 + 1) = 4 \\cdot 3^{5}$. The multiple is the number left in the parentheses.",
      "幂相加时指数不能相加。应当提出较小的幂，并把较大的幂写成它的倍数，因为 $a^{n + 1} = a \\cdot a^{n}$。例如 $3^{6} + 3^{5} = 3^{5}(3 + 1) = 4 \\cdot 3^{5}$。倍数就是括号里剩下的数。",
    ),
  },
  "sat-exam-perfect-square-quadratic-equations": {
    tip: t(
      "If a squared expression equals a number, take square roots and keep both signs: $(x - 2)^2 = 9$ means $x - 2 = \\pm 3$, so $x = 5$ or $x = -1$. Then pick the one the question requests. Using only the positive root would miss a solution and could give the wrong one.",
      "平方式等于一个数时，两边开方并保留正负两个符号：$(x - 2)^2 = 9$ 即 $x - 2 = \\pm 3$，所以 $x = 5$ 或 $x = -1$。再按题目要求选取。只取正根会漏解，还可能选错。",
    ),
    hardTip: t(
      "For the sum of the solutions, write them as $-h + r$ and $-h - r$ when the equation is $(x + h)^2 = r^2$. The roots cancel in the sum, leaving $-2h$. For instance, $(x + 5)^2 = 49$ has solutions adding to $-10$. Do not forget the sign of the shift.",
      "求两解之和时，若方程为 $(x + h)^2 = r^2$，就把解写成 $-h + r$ 和 $-h - r$。相加时根抵消，只剩 $-2h$。例如 $(x + 5)^2 = 49$ 的两解之和为 $-10$。别忘了平移量的符号。",
    ),
  },
  "sat-exam-solving-quadratic-equations-using-the-zero-product-rule": {
    tip: t(
      "A product equals zero only if one of its factors is zero. So set each factor to zero and solve: $(x + 2)(x - 9) = 0$ gives $x = -2$ or $x = 9$. Notice the sign flips; offering the constants as they appear in the factors is the classic wrong answer.",
      "乘积为零，当且仅当至少一个因式为零。所以令每个因式为零再求解：$(x + 2)(x - 9) = 0$ 得 $x = -2$ 或 $x = 9$。注意符号相反；把因式里的常数原样当作解是典型的错误答案。",
    ),
    hardTip: t(
      "When a factor has a coefficient on $x$, solve its linear equation fully rather than reading the constant. For $(2x - 6)(x + 1) = 0$, the first factor gives $x = 3$ and the second $x = -1$, whose sum is $2$. Skipping that division by the coefficient produces wrong totals.",
      "因式中 $x$ 有系数时，要把这个一次方程完整解出来，不能直接读常数。对 $(2x - 6)(x + 1) = 0$，第一个因式得 $x = 3$，第二个得 $x = -1$，两解之和为 $2$。漏掉除以系数这一步，就会得到错误的和。",
    ),
  },
  "sat-exam-solving-quadratic-equations-by-factoring": {
    tip: t(
      "Factor the trinomial into two binomials, set each to zero, and compare the solutions. For $x^2 - 9x + 20 = 0$, the numbers multiplying to $20$ and adding to $-9$ are $-4$ and $-5$, so $x = 4$ or $x = 5$. Answer only with the solution the question names, such as the greater one.",
      "把三项式分解成两个二项式，令每个为零，再比较两个解。对 $x^2 - 9x + 20 = 0$，积为 $20$、和为 $-9$ 的两个数是 $-4$ 和 $-5$，所以 $x = 4$ 或 $x = 5$。只回答题目指定的那个解，比如较大的解。",
    ),
    hardTip: t(
      "A negative constant means the factors have opposite signs, so one solution is positive and one negative. Use the condition given to choose, and then evaluate the expression asked for. For $x^2 + x - 6 = 0$ and $x > 0$, we get $x = 2$, so $x + 5 = 7$. Stopping at $x$ itself is the trap.",
      "常数项为负说明两个因式的常数异号，一个解为正、一个解为负。用题目条件选出正确的解，再算所问的表达式。对 $x^2 + x - 6 = 0$ 且 $x > 0$，得 $x = 2$，于是 $x + 5 = 7$。只求到 $x$ 就停下是个陷阱。",
    ),
  },
  "sat-exam-solving-quadratic-equations-with-leading-coefficients-by-factoring": {
    tip: t(
      "With a leading coefficient, try factors like $(ax + m)(x + n)$ whose outer and inner products add to the middle term, then set each to zero. For example, $3x^2 + x - 2 = (3x - 2)(x + 1)$, so $x = \\frac{2}{3}$ or $x = -1$. Check the middle term by expanding.",
      "有首项系数时，试写成 $(ax + m)(x + n)$ 的形式，使外项积与内项积之和等于中间项，再令每个因式为零。例如 $3x^2 + x - 2 = (3x - 2)(x + 1)$，所以 $x = \\frac{2}{3}$ 或 $x = -1$。展开检验中间项。",
    ),
    hardTip: t(
      "To find a specific root such as the negative one, factor as usual and decide which factor produces it; a factor with a coefficient on $x$ gives a fraction. For $2x^2 + 3x - 5 = (2x + 5)(x - 1)$, the negative solution is $-\\frac{5}{2}$. Remember to divide by the coefficient, not just flip the sign.",
      "要求特定的根（如负根）时，照常分解，再判断它来自哪个因式；$x$ 带系数的因式通常给出分数。对 $2x^2 + 3x - 5 = (2x + 5)(x - 1)$，负根是 $-\\frac{5}{2}$。记得除以系数，而不只是改变符号。",
    ),
  },
  "sat-exam-solving-quadratic-equations-using-the-quadratic-formula": {
    tip: t(
      "When factoring fails, use $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$. Identify $a$, $b$ and $c$ with signs, compute the discriminant, simplify the radical, and divide every term by $2a$. For $x^2 - 6x + 7 = 0$: $x = \\frac{6 \\pm \\sqrt{8}}{2} = 3 \\pm \\sqrt{2}$. Do not divide only the first term.",
      "无法分解时，用求根公式 $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$。带符号确定 $a$、$b$、$c$，算出判别式，化简根式，再把每一项都除以 $2a$。对 $x^2 - 6x + 7 = 0$：$x = \\frac{6 \\pm \\sqrt{8}}{2} = 3 \\pm \\sqrt{2}$。不要只除第一项。",
    ),
    hardTip: t(
      "Beyond finding the roots, you combine them. In $r - s$ the rational parts cancel, leaving twice the radical part, so the difference is $\\frac{\\sqrt{b^2 - 4ac}}{a}$ for $a > 0$. Squaring removes the radical: for $x^2 - 2x - 1 = 0$, roots $1 \\pm \\sqrt{2}$ differ by $2\\sqrt{2}$, and $(r - s)^2 = 8$.",
      "除了求根，还要把两根组合起来。在 $r - s$ 中有理部分抵消，只剩根式部分的两倍，因此当 $a > 0$ 时差为 $\\frac{\\sqrt{b^2 - 4ac}}{a}$。平方后根号消失：对 $x^2 - 2x - 1 = 0$，两根 $1 \\pm \\sqrt{2}$ 相差 $2\\sqrt{2}$，所以 $(r - s)^2 = 8$。",
    ),
  },
  "sat-exam-quadratic-equations-with-one-real-solution": {
    tip: t(
      "Exactly one real solution means the discriminant is zero: $b^2 - 4ac = 0$. Substitute the known coefficients and solve for $c$. For $3x^2 - 12x + c = 0$: $144 - 12c = 0$, so $c = 12$. Keep the leading coefficient in $4ac$; leaving it out gives the distractor.",
      "恰有一个实数解意味着判别式为零：$b^2 - 4ac = 0$。代入已知系数，解出 $c$。对 $3x^2 - 12x + c = 0$：$144 - 12c = 0$，所以 $c = 12$。别把首项系数从 $4ac$ 中漏掉，否则会落入干扰项。",
    ),
    hardTip: t(
      "This time the unknown is the middle coefficient, so setting the discriminant to zero gives $b^2 = 4ac$, an equation with two roots of opposite sign. Use the stated sign to choose. For $3x^2 + bx + 12 = 0$ with $b > 0$: $b^2 = 144$, so $b = 12$. Remember to take the square root at the end.",
      "这次未知的是中间项系数，令判别式为零得 $b^2 = 4ac$，它有一正一负两个根，要按题目给定的符号选择。对 $3x^2 + bx + 12 = 0$ 且 $b > 0$：$b^2 = 144$，所以 $b = 12$。最后别忘了开平方。",
    ),
  },
  "sat-exam-quadratic-equations-with-two-real-solutions": {
    tip: t(
      "Two distinct real solutions require a positive discriminant, $b^2 - 4ac > 0$. Turn it into an inequality for the unknown, then test the options. For $x^2 + 6x + c = 0$: $36 - 4c > 0$, so $c < 9$. The boundary value itself gives just one solution, so it does not qualify.",
      "有两个不同实数解要求判别式为正，即 $b^2 - 4ac > 0$。把它化成关于未知数的不等式，再检验选项。对 $x^2 + 6x + c = 0$：$36 - 4c > 0$，所以 $c < 9$。边界值只给出一个解，不符合要求。",
    ),
    hardTip: t(
      "To find the greatest integer value, solve the same strict inequality and step just inside the boundary. For $x^2 + 10x + c = 0$: $100 - 4c > 0$ gives $c < 25$, so the greatest integer is $24$. Reporting the boundary itself is the trap, because it produces a repeated root.",
      "要求最大的整数值，先解同样的严格不等式，再取边界内最靠近边界的整数。对 $x^2 + 10x + c = 0$：$100 - 4c > 0$ 得 $c < 25$，最大整数是 $24$。直接回答边界值是陷阱，因为它会产生重根。",
    ),
  },
  "sat-exam-quadratic-equations-with-no-real-solutions": {
    tip: t(
      "No real solutions means the discriminant is negative, $b^2 - 4ac < 0$, so the graph never meets the $x$-axis. Solve for the unknown and pick the option satisfying it. For $x^2 + 4x + c = 0$: $16 - 4c < 0$, so $c > 4$. Check the direction of the inequality before choosing.",
      "没有实数解表示判别式为负，即 $b^2 - 4ac < 0$，图像与 $x$ 轴没有交点。解出未知数的范围，选出满足条件的选项。对 $x^2 + 4x + c = 0$：$16 - 4c < 0$，所以 $c > 4$。选择前先确认不等号的方向。",
    ),
    hardTip: t(
      "For the least integer value, the inequality from the negative discriminant gives a lower bound that is not itself allowed. For $x^2 + 2x + c = 0$: $4 - 4c < 0$ gives $c > 1$, so the least integer is $2$. The bound is excluded because it makes the discriminant exactly zero.",
      "求最小的整数值时，由判别式为负得到的不等式给出一个下界，而下界本身不能取。对 $x^2 + 2x + c = 0$：$4 - 4c < 0$ 得 $c > 1$，所以最小整数是 $2$。下界被排除，是因为它恰好使判别式等于零。",
    ),
  },
  "sat-exam-counting-solutions-to-quadratic-equations": {
    tip: t(
      "Compute the discriminant $b^2 - 4ac$ and look at its sign: positive means exactly two real solutions, zero means one, negative means none. For $x^2 + 6x + 2 = 0$, it is $36 - 8 = 28$, so there are two. You never have to find the solutions themselves.",
      "计算判别式 $b^2 - 4ac$ 并看它的符号：为正有两个实数解，为零有一个，为负没有。对 $x^2 + 6x + 2 = 0$，判别式是 $36 - 8 = 28$，所以有两个解。完全不必真的把解求出来。",
    ),
    hardTip: t(
      "A positive leading coefficient and positive constant make $4ac$ large, and the discriminant can turn negative, so there may be zero real solutions. For $2x^2 + 3x + 4 = 0$, it is $9 - 32 = -23$, so none exist. Multiply $4ac$ carefully, including the leading coefficient, before judging the sign.",
      "首项系数和常数项都为正时，$4ac$ 可能较大，判别式可能变成负数，这时没有实数解。对 $2x^2 + 3x + 4 = 0$，判别式是 $9 - 32 = -23$，没有实数解。判断符号之前，要连同首项系数把 $4ac$ 算准。",
    ),
  },
  "sat-exam-applying-vieta-s-formulas": {
    tip: t(
      "For $ax^2 + bx + c = 0$, the solutions add up to $-\\frac{b}{a}$, so you do not need to solve. First move everything to one side, then read the coefficients with signs. For $2x^2 - 5x + 1 = 0$, the sum is $\\frac{5}{2}$. Forgetting the negative sign or the division by $a$ produces the wrong options.",
      "对 $ax^2 + bx + c = 0$，两解之和是 $-\\frac{b}{a}$，所以不必解方程。先把所有项移到一边，再带符号读出系数。对 $2x^2 - 5x + 1 = 0$，两解之和为 $\\frac{5}{2}$。漏掉负号或忘了除以 $a$ 就会选到错误选项。",
    ),
    hardTip: t(
      "The product of the solutions of $ax^2 + bx + c = 0$ is $\\frac{c}{a}$, with no extra sign change, unlike the sum. For $5x^2 + 2x - 3 = 0$, $rs = -\\frac{3}{5}$. Mixing up the formulas, or dividing $b$ rather than $c$ by $a$, is the mistake that the options anticipate.",
      "$ax^2 + bx + c = 0$ 两解之积是 $\\frac{c}{a}$，与两解之和不同，不用再变号。对 $5x^2 + 2x - 3 = 0$，$rs = -\\frac{3}{5}$。把两个公式弄混，或者用 $b$ 而不是 $c$ 去除以 $a$，正是选项预设的错误。",
    ),
  },
  "sat-exam-solving-quadratic-equations-with-unknown-parameters": {
    tip: t(
      "If one solution is known and the constant term is given, use the product of the solutions. In $x^2 - kx + 15 = 0$, the solutions multiply to $15$, so if one is $5$, the other is $3$. You do not need $k$ for this, and the sum formula would not help since it contains $k$.",
      "已知一个解和常数项时，用两解之积。在 $x^2 - kx + 15 = 0$ 中，两解之积为 $15$，若一个解是 $5$，另一个就是 $3$。这里不需要知道 $k$，而两解之和的公式含有 $k$，帮不上忙。",
    ),
    hardTip: t(
      "A solution makes the equation true, so substitute it to find the parameter. In $x^2 - kx + 10 = 0$ with solution $2$: $4 - 2k + 10 = 0$, so $k = 7$. As a check, the other solution is $5$, and the sum $2 + 5$ matches. The sign in front of $k$ matters here.",
      "解能使方程成立，所以把它代入就能求出参数。在 $x^2 - kx + 10 = 0$ 中，若 $2$ 是解：$4 - 2k + 10 = 0$，所以 $k = 7$。检验：另一个解是 $5$，和 $2 + 5$ 正好吻合。这里 $k$ 前面的符号很重要。",
    ),
  },
  "sat-exam-quadratic-functions": {
    tip: t(
      "To evaluate a quadratic, replace $x$ with the input and follow the order of operations: square first, then multiply by the coefficient, then add. For $g(x) = 2x^2 - 3x + 1$ at $x = 3$: $2(9) - 9 + 1 = 10$. Multiplying before squaring, which would treat $2x^2$ as $(2x)^2$, gives the wrong value.",
      "求二次函数的值时，把 $x$ 换成输入值，按运算顺序来：先平方，再乘系数，最后相加减。对 $g(x) = 2x^2 - 3x + 1$，在 $x = 3$ 处：$2(9) - 9 + 1 = 10$。如果先乘后平方，把 $2x^2$ 当成 $(2x)^2$，结果就错了。",
    ),
    hardTip: t(
      "A negative input needs parentheses. Its square is positive, while a linear term with a negative coefficient turns positive too. For $g(x) = 2x^2 - 3x + 1$ at $x = -3$: $2(9) + 9 + 1 = 28$. The common errors are squaring to a negative number and missing the sign change in the linear term.",
      "负数输入要加括号。它的平方是正数，而一次项系数为负时，这一项也变成正的。对 $g(x) = 2x^2 - 3x + 1$，在 $x = -3$ 处：$2(9) + 9 + 1 = 28$。常见错误是把平方算成负数，或者漏掉一次项的变号。",
    ),
  },
  "sat-exam-graphs-of-quadratic-functions": {
    tip: t(
      "The vertex is the turning point of a parabola: the lowest point when it opens up, the highest when it opens down. Find that point on the grid and read its coordinates, $x$ first and then $y$. Writing them in the opposite order, or using an intercept instead, is the typical mistake.",
      "顶点是抛物线的转折点：开口向上时是最低点，开口向下时是最高点。在网格上找到这个点，先读 $x$ 再读 $y$。把坐标顺序写反，或者误用截距，是典型的错误。",
    ),
    hardTip: t(
      "To match a graph to an equation, read the vertex $(h, k)$ and use $f(x) = a(x - h)^2 + k$. The horizontal shift appears with the opposite sign, so a vertex at $x = -2$ gives $(x + 2)^2$. Then check direction: opening up means $a > 0$, opening down means $a < 0$.",
      "把图像与方程对应时，读出顶点 $(h, k)$，用 $f(x) = a(x - h)^2 + k$。水平平移在式中符号相反，所以顶点在 $x = -2$ 时对应 $(x + 2)^2$。再看开口方向：向上则 $a > 0$，向下则 $a < 0$。",
    ),
  },
  "sat-exam-finding-extreme-values-of-quadratic-functions-in-vertex-form": {
    tip: t(
      "In $f(x) = a(x - h)^2 + k$ with $a > 0$, the square is never negative, so the output is smallest when the square is zero. That least output is $k$. For example, $4(x - 1)^2 + 9$ has minimum value $9$. Do not answer with $h$, which is the input that produces it.",
      "在 $f(x) = a(x - h)^2 + k$ 中，若 $a > 0$，平方项不会为负，所以平方项为零时输出最小，最小值就是 $k$。例如 $4(x - 1)^2 + 9$ 的最小值是 $9$。不要回答 $h$，它只是取得最小值时的输入。",
    ),
    hardTip: t(
      "With a negative coefficient the parabola opens down, so the extreme is a maximum, reached where the squared term is zero. Solve $x - h = 0$ to find the location: $-2(x - 6)^2 + 1$ peaks at $x = 6$. Here the question wants the input, not the value $k$, and the sign inside the parentheses flips.",
      "系数为负时抛物线开口向下，极值是最大值，在平方项为零处取得。解 $x - h = 0$ 求位置：$-2(x - 6)^2 + 1$ 在 $x = 6$ 处达到最高。这里问的是输入，不是值 $k$，而且括号内的符号要反过来。",
    ),
  },
  "sat-exam-using-standard-and-factored-forms-to-reason-about-quadratic-functions": {
    tip: t(
      "The $y$-intercept is the output at $x = 0$. In factored form, substitute zero and multiply everything, including the leading number. For $f(x) = 2(x + 3)(x - 4)$: $f(0) = 2(3)(-4) = -24$, so the intercept is $(0, -24)$. Do not confuse this with the $x$-intercepts, which come from the factors.",
      "$y$ 轴截距就是 $x = 0$ 时的输出。在因式形式中，代入零后把所有数相乘，包括最前面的系数。对 $f(x) = 2(x + 3)(x - 4)$：$f(0) = 2(3)(-4) = -24$，截距是 $(0, -24)$。别把它和 $x$ 轴截距混淆，后者来自各个因式。",
    ),
    hardTip: t(
      "To get $b$ in standard form without expanding it all, use that $(x + m)(x + n)$ has $x$ coefficient $m + n$, then multiply by the leading number. For $2(x + 3)(x - 4)$: $m + n = -1$, so $b = -2$. Omitting the leading factor is the slip to watch for.",
      "不必全部展开也能求标准形式中的 $b$：$(x + m)(x + n)$ 的 $x$ 系数是 $m + n$，再乘上最前面的系数。对 $2(x + 3)(x - 4)$：$m + n = -1$，所以 $b = -2$。要留意别漏乘前面的系数。",
    ),
  },
  "sat-exam-using-symmetry-to-reason-about-quadratic-functions": {
    tip: t(
      "A parabola is symmetric about the vertical line through its vertex, so two inputs with equal outputs sit equally far from that line. Therefore the vertex's $x$-coordinate is their average: if $f(1) = f(7)$, it is $\\frac{1 + 7}{2} = 4$. You do not need the equation of $f$.",
      "抛物线关于过顶点的竖直线对称，所以输出相等的两个输入到这条线的距离相等。因此顶点的 $x$ 坐标就是它们的平均数：若 $f(1) = f(7)$，则为 $\\frac{1 + 7}{2} = 4$。不需要知道 $f$ 的解析式。",
    ),
    hardTip: t(
      "Given the axis and one point, reflect that point across the axis. Find the horizontal distance from the point to the axis, then move the same distance to the other side. With axis $x = 3$ and a point at $x = 1$, the distance is $2$, so the mirror input is $5$; the output stays the same.",
      "已知对称轴和一个点时，把这个点关于对称轴作对称。先算出点到轴的水平距离，再向另一侧移动同样距离。对称轴为 $x = 3$、点在 $x = 1$ 时，距离是 $2$，对称的输入就是 $5$，输出不变。",
    ),
  },
  "sat-exam-identifying-quadratic-functions-from-tabular-data": {
    tip: t(
      "In a table, the vertex is the input around which outputs mirror each other, with its output in the centre. Use $f(x) = a(x - h)^2 + k$: the output's change one step from the vertex equals $a$. If $f$ goes $7, 4, 3, 4, 7$ centred at $x = 1$, then $f(x) = (x - 1)^2 + 3$.",
      "在表格中，顶点是输出左右对称的中心输入，它的输出位于正中。用 $f(x) = a(x - h)^2 + k$：离顶点一步时输出的变化量就是 $a$。若输出依次为 $7, 4, 3, 4, 7$，中心在 $x = 1$，则 $f(x) = (x - 1)^2 + 3$。",
    ),
    hardTip: t(
      "A value beyond the table comes from the formula: find the vertex and $a$, count the steps from the vertex to the new input, then compute $a \\cdot \\text{steps}^2 + k$. With vertex $(1, 3)$ and $a = 1$, the input $5$ is four steps away, so the output is $19$. The outputs do not grow linearly, so do not extend by a constant.",
      "表外的值要靠公式求：先找顶点和 $a$，数一数新输入离顶点几步，再算 $a \\cdot \\text{steps}^2 + k$（steps 为步数）。顶点为 $(1, 3)$、$a = 1$ 时，输入 $5$ 离顶点四步，输出为 $19$。输出不是线性增长的，不能按固定差值外推。",
    ),
  },
  "sat-exam-modeling-number-problems-with-quadratic-equations": {
    tip: t(
      'Translate word by word. Name one number $x$, write the other in terms of it ("$3$ greater" becomes $x + 3$), and let "product" mean multiply. So a number and one $3$ greater with product $40$ give $x(x + 3) = 40$. Options that add the numbers misread "product".',
      "逐词翻译。设一个数为 $x$，用它表示另一个数（“大 $3$”写成 $x + 3$），“积”表示相乘。所以一个数与比它大 $3$ 的数之积为 $40$，就写成 $x(x + 3) = 40$。把两数相加的选项误读了“积”。",
    ),
    hardTip: t(
      "After writing the equation, move everything to one side and factor. Then discard any negative solution, since the integers are positive, and answer what was asked. For a difference of $2$ and product $48$: $x^2 + 2x - 48 = (x + 8)(x - 6) = 0$, so the smaller is $6$ and the greater is $8$. Do not report the smaller.",
      "列出方程后，把所有项移到一边并分解。由于是正整数，要舍去负解，再回答题目问的那个数。若差为 $2$、积为 $48$：$x^2 + 2x - 48 = (x + 8)(x - 6) = 0$，较小的数是 $6$，较大的数是 $8$。别把较小的数当答案。",
    ),
  },
  "sat-exam-solving-border-problems-with-quadratic-equations": {
    tip: t(
      "A border of width $x$ lies on both sides of the rectangle, so each dimension grows by $2x$, not $x$. The total area equals new length times new width: a $5$ by $3$ picture with a border and total area $35$ gives $(5 + 2x)(3 + 2x) = 35$. Options with a single $x$ forget the far side.",
      "宽度为 $x$ 的边框位于矩形的两侧，所以每条边增加 $2x$，而不是 $x$。总面积等于新长乘新宽：$5$ 乘 $3$ 的图片加边框后总面积为 $35$，则 $(5 + 2x)(3 + 2x) = 35$。只加一个 $x$ 的选项忘了另一侧。",
    ),
    hardTip: t(
      "To get the width, set up the area equation, expand, move the total across and factor; reject the negative root, since a width must be positive. For a $5$ by $3$ plot and total area $35$: $4x^2 + 16x - 20 = 0$, so $(x + 5)(x - 1) = 0$ and $x = 1$. Trying each option in the product also works.",
      "要求宽度，就列面积方程、展开、把总面积移过来并分解；宽度必须为正，舍去负根。对 $5$ 乘 $3$ 的地块和总面积 $35$：$4x^2 + 16x - 20 = 0$，所以 $(x + 5)(x - 1) = 0$，$x = 1$。把各选项代入乘积检验也可以。",
    ),
  },
  "sat-exam-interpreting-quadratic-functions-in-modeling-contexts": {
    tip: t(
      "In $P(t) = a(t - h)^2 + k$ with $a < 0$, the squared term can only lower the output, so $k$ is the greatest value reached, in the units of the output. For $-3(t - 4)^2 + 90$ measuring earnings, $90$ is the highest earnings. It is not the starting value, which would be $P(0)$.",
      "在 $P(t) = a(t - h)^2 + k$ 中，若 $a < 0$，平方项只会使输出减小，所以 $k$ 是能达到的最大值，单位与输出相同。对表示收益的 $-3(t - 4)^2 + 90$，$90$ 就是最高收益。它不是起始值，起始值应为 $P(0)$。",
    ),
    hardTip: t(
      "The number $h$ inside $(t - h)^2$ is measured in the units of the input: it is the input at which the extreme happens. For $-3(t - 4)^2 + 90$, the value $4$ is the input producing the greatest output. Do not read it as an amount of the output itself or as a rate of change.",
      "$(t - h)^2$ 中的 $h$ 用的是输入的单位：它是取得极值时的输入。对 $-3(t - 4)^2 + 90$，$4$ 就是使输出达到最大的输入。不要把它理解为输出的大小或变化率。",
    ),
  },
  "sat-exam-interpreting-graphs-of-quadratic-functions-in-modeling-contexts": {
    tip: t(
      "Connect the graph to the story: the horizontal axis gives time and the vertical axis gives height. The greatest height is the $y$-coordinate of the top point of the curve. If the peak is at $(2, 5)$, the object reaches height $5$ after $2$ seconds. Reading the wrong coordinate is the usual error.",
      "把图像与情境联系起来：横轴是时间，纵轴是高度。最大高度就是曲线最高点的 $y$ 坐标。若最高点是 $(2, 5)$，物体在 $2$ 秒后到达高度 $5$。读错坐标是常见的错误。",
    ),
    hardTip: t(
      "Landing means the height is back to zero, so find where the curve meets the horizontal axis again and read that $x$-value. By symmetry, starting from the ground, the landing time is twice the time of the peak: a peak after $2$ seconds means landing after $4$. Do not stop at the peak time.",
      "落地表示高度回到零，所以要找曲线再次与横轴相交的位置，读出 $x$ 值。根据对称性，从地面出发时，落地时间是到达最高点时间的两倍：$2$ 秒到达最高点，则 $4$ 秒落地。不要停在到达最高点的时间。",
    ),
  },
  "sat-exam-modeling-planar-motion-using-quadratic-functions": {
    tip: t(
      "The height function $h(t) = at^2 + bt + c$ with $a < 0$ peaks at its vertex, $t = -\\frac{b}{2a}$. Use it directly: for $h(t) = -16t^2 + 32t$, the peak is at $t = \\frac{32}{32} = 1$ second. Forgetting the factor $2$ in the denominator gives the landing time instead.",
      "高度函数 $h(t) = at^2 + bt + c$ 中 $a < 0$，在顶点 $t = -\\frac{b}{2a}$ 处达到最高。直接用公式：对 $h(t) = -16t^2 + 32t$，最高点在 $t = \\frac{32}{32} = 1$ 秒。忘了分母中的 $2$，算出的就成了落地时间。",
    ),
    hardTip: t(
      "The greatest height takes one more step: find the peak time with $t = -\\frac{b}{2a}$, then substitute it back into $h(t)$. For $h(t) = -16t^2 + 32t$, the peak time is $1$, so the height is $-16 + 32 = 16$ feet. Time is not the answer; the output is.",
      "求最大高度还要多一步：先用 $t = -\\frac{b}{2a}$ 求出到达最高点的时间，再把它代回 $h(t)$。对 $h(t) = -16t^2 + 32t$，时间是 $1$，高度为 $-16 + 32 = 16$ 英尺。答案是输出的高度，而不是时间。",
    ),
  },
  "sat-exam-elementary-cubic-functions": {
    tip: t(
      "To evaluate a cubic, cube the input first, keeping its sign, since an odd power of a negative is negative. Then apply the coefficient and add the constant. For $g(x) = 2x^3 + 1$ at $x = -3$: $2(-27) + 1 = -53$. Mistaking the cube for a positive number gives a wrong option.",
      "求三次函数的值时，先把输入立方并保留符号，因为负数的奇次幂仍为负。再乘系数，加常数。对 $g(x) = 2x^3 + 1$，在 $x = -3$ 处：$2(-27) + 1 = -53$。把立方算成正数，就会选到错误选项。",
    ),
    hardTip: t(
      "Going backwards, undo the operations in reverse: divide by the coefficient, then take the cube root. For $3x^3 = 81$: $x^3 = 27$, so $x = 3$. A cube root has just one real value, with no $\\pm$ as there is for a square root, and it is not one third of the number.",
      "反过来求解时，按相反顺序撤销运算：先除以系数，再开立方。对 $3x^3 = 81$：$x^3 = 27$，所以 $x = 3$。立方根只有一个实数值，不像平方根那样有 $\\pm$，它也不是原数的三分之一。",
    ),
  },
  "sat-exam-higher-degree-polynomials": {
    tip: t(
      "Set each factor to zero to list the zeros of a factored polynomial, and include any bare $x$, which gives zero. A repeated factor gives one distinct zero however high its power is. For $x^2(x - 4)(x + 3)^3$, the distinct zeros are $0$, $4$ and $-3$, so there are three.",
      "令每个因式为零，列出因式形式多项式的零点，单独的 $x$ 也要算，它给出零点 $0$。重复因式无论幂次多高，都只算一个不同的零点。对 $x^2(x - 4)(x + 3)^3$，不同的零点是 $0$、$4$ 和 $-3$，共三个。",
    ),
    hardTip: t(
      "To add the distinct zeros, list each once, with the sign opposite to the constant in its factor, then add. For $(x + 3)^2(x - 5)(x - 1)$, the zeros are $-3$, $5$ and $1$, with sum $3$. Counting a squared factor twice, as if adding with multiplicity, leads to a wrong total.",
      "求不同零点之和时，每个零点只列一次，符号与因式中的常数相反，再相加。对 $(x + 3)^2(x - 5)(x - 1)$，零点是 $-3$、$5$ 和 $1$，和为 $3$。把平方因式算两次，按重数相加，就会得到错误的和。",
    ),
  },
  "sat-exam-graphs-of-higher-degree-polynomials": {
    tip: t(
      "A graph's $x$-intercepts are the zeros, and each zero $a$ corresponds to a factor $x - a$. So an intercept at $x = 2$ means $x - 2$ is a factor, and one at $x = -3$ means $x + 3$. The sign flips between the graph's reading and the factor; that is what wrong options exploit.",
      "图像的 $x$ 轴截距就是零点，每个零点 $a$ 对应因式 $x - a$。所以截距在 $x = 2$ 表示 $x - 2$ 是因式，在 $x = -3$ 则表示 $x + 3$ 是因式。从图上读的数和因式里的符号相反，错误选项正是利用这一点。",
    ),
    hardTip: t(
      "Find every point where the curve meets the $x$-axis, including the origin and any place it only touches and turns back. Read each $x$-value with its sign, then add. If a graph meets the axis at $-3$, $1$ and $4$, the sum of its zeros is $2$. Do not add $y$-values of turning points.",
      "找出曲线与 $x$ 轴的所有公共点，包括原点以及只相切后折回的地方。带符号读出每个 $x$ 值，再相加。若图像与轴交于 $-3$、$1$ 和 $4$，零点之和为 $2$。不要把转折点的 $y$ 值加进去。",
    ),
  },
  "sat-exam-polynomial-transformations": {
    tip: t(
      "A shift right by $h$ replaces $x$ with $x - h$, inside the power; a shift up by $k$ adds $k$ outside. So moving $y = x^3$ right $2$ and up $6$ gives $y = (x - 2)^3 + 6$. Right means minus, not plus, and the options swap exactly that sign or put the numbers in the wrong places.",
      "向右平移 $h$ 就是把 $x$ 换成 $x - h$，写在幂的里面；向上平移 $k$ 就是在外面加 $k$。所以把 $y = x^3$ 向右移 $2$、向上移 $6$，得 $y = (x - 2)^3 + 6$。向右是减号而不是加号，选项正是在这个符号或数字位置上做文章。",
    ),
    hardTip: t(
      "With a function defined by shifts, evaluate from the inside out: compute the new input, look up $f$ there, then apply the outside change. If $f(5) = 2$ and $g(x) = f(x + 1) - 4$, then $g(4) = f(5) - 4 = -2$. Do not add the shift to the output or use the original input.",
      "函数由平移定义时，从里到外求值：先算新的输入，查出 $f$ 在那里的值，再做外面的变化。若 $f(5) = 2$ 且 $g(x) = f(x + 1) - 4$，则 $g(4) = f(5) - 4 = -2$。不要把内部的平移量加到输出上，也不要直接用原来的输入。",
    ),
  },
  "sat-exam-further-polynomial-transformations": {
    tip: t(
      "To locate a zero of a transformed function, set the inside expression equal to the known zero of $f$ and solve. If $f(2) = 0$ and $g(x) = 5f(x + 3)$, then $x + 3 = 2$, so $x = -1$. A multiplier outside stretches the outputs, and a zero stays zero, so it does not matter.",
      "求变换后函数的零点，令括号内的表达式等于 $f$ 的已知零点，再解方程。若 $f(2) = 0$ 且 $g(x) = 5f(x + 3)$，则 $x + 3 = 2$，所以 $x = -1$。外面的倍数只拉伸输出，零乘任何数仍为零，所以不影响零点。",
    ),
    hardTip: t(
      "A maximum is an output, so only changes outside the function affect it. Horizontal shifts move where it happens, not its size. Multiply the maximum by a positive factor, then add the vertical shift: if $f$ peaks at $6$, then $2f(x - 9) + 3$ peaks at $15$. A negative factor would turn it into a minimum.",
      "最大值是输出，所以只有函数外面的变化才影响它。水平平移只改变它出现的位置，不改变大小。把最大值乘以正的倍数，再加上竖直平移：若 $f$ 最大为 $6$，则 $2f(x - 9) + 3$ 最大为 $15$。倍数为负时，它会变成最小值。",
    ),
  },
  "sat-exam-using-the-factor-theorem-to-reason-about-polynomials": {
    tip: t(
      "The factor theorem says $p(a) = 0$ exactly when $x - a$ is a factor of $p(x)$. So a zero at $x = 6$ gives the factor $x - 6$, and a zero at $x = -1$ gives $x + 1$. The option with the opposite sign is the trap, so subtract the zero from $x$.",
      "因式定理指出：$p(a) = 0$ 当且仅当 $x - a$ 是 $p(x)$ 的因式。所以零点 $x = 6$ 对应因式 $x - 6$，零点 $x = -1$ 对应 $x + 1$。符号相反的选项是陷阱，要用 $x$ 减去零点。",
    ),
    hardTip: t(
      "If $x - a$ is a factor, the polynomial is zero at $x = a$. Substitute $a$ for every $x$, add the numbers, and set the result equal to zero to find the unknown constant. For $x - 1$ and $x^3 + 2x + k$: $1 + 2 + k = 0$, so $k = -3$. Do not substitute the opposite number.",
      "若 $x - a$ 是因式，则多项式在 $x = a$ 处为零。把所有 $x$ 换成 $a$，算出数值，令结果为零，就能求出未知常数。对 $x - 1$ 和 $x^3 + 2x + k$：$1 + 2 + k = 0$，所以 $k = -3$。不要代入相反数。",
    ),
  },
  "sat-exam-exponential-functions": {
    tip: t(
      "In $f(x) = a(b)^x$, compute the power first, then multiply by $a$. For $f(x) = 5(3)^x$: $f(2) = 5 \\cdot 9 = 45$. Multiplying $a$ and $b$ first, which would give $15^2$, is the mistake to avoid; the exponent applies only to the base, not to the coefficient.",
      "在 $f(x) = a(b)^x$ 中，先算幂，再乘 $a$。对 $f(x) = 5(3)^x$：$f(2) = 5 \\cdot 9 = 45$。先把 $a$ 和 $b$ 相乘、算成 $15^2$ 是要避免的错误；指数只作用于底数，不作用于系数。",
    ),
    hardTip: t(
      "To find the input from an output, undo the coefficient by dividing, then ask which power of the base gives the result. For $f(x) = 5(3)^x$ and $f(k) = 135$: $3^k = 27$, so $k = 3$. Dividing the output by the base repeatedly and counting the steps gives the same answer.",
      "由输出求输入时，先除以系数，再问底数的几次幂等于结果。对 $f(x) = 5(3)^x$ 且 $f(k) = 135$：$3^k = 27$，所以 $k = 3$。也可以不断除以底数并数一数步数，结果相同。",
    ),
  },
  "sat-exam-maxima-and-minima-of-exponential-functions": {
    tip: t(
      "An exponential with base above $1$ and a positive coefficient always increases, so on an interval its greatest value is at the right endpoint. For $f(x) = 2(3)^x$ on $0 \\le x \\le 3$, that is $f(3) = 54$. There is no turning point inside, so evaluate only the endpoint.",
      "底数大于 $1$、系数为正的指数函数始终递增，所以在区间上，最大值出现在右端点。对 $f(x) = 2(3)^x$，$0 \\le x \\le 3$，最大值是 $f(3) = 54$。区间内部没有转折点，只需计算端点。",
    ),
    hardTip: t(
      "A base between $0$ and $1$ makes a positive exponential decrease, so the roles switch: the least value is at the right endpoint and the greatest at the left. For $81\\left(\\frac{1}{3}\\right)^x$ on $0 \\le x \\le 2$, the least value is $9$. Check the base before choosing the endpoint.",
      "底数在 $0$ 和 $1$ 之间时，系数为正的指数函数递减，情况就反过来了：最小值在右端点，最大值在左端点。对 $81\\left(\\frac{1}{3}\\right)^x$，$0 \\le x \\le 2$，最小值是 $9$。选端点之前先看底数。",
    ),
  },
  "sat-exam-exponential-functions-containing-unknown-parameters": {
    tip: t(
      "A known input and output give an equation for the coefficient. Substitute them into $f(x) = a(b)^x$, compute the power, and divide. If $f(x) = a(3)^x$ and $f(2) = 18$, then $9a = 18$, so $a = 2$. Do not assume the output at $x = 0$ when another input is given.",
      "已知一组输入和输出，就得到关于系数的方程。把它们代入 $f(x) = a(b)^x$，算出幂再相除。若 $f(x) = a(3)^x$ 且 $f(2) = 18$，则 $9a = 18$，所以 $a = 2$。给的不是 $x = 0$ 时，不要把它当作初始值。",
    ),
    hardTip: t(
      "With both parameters unknown, use $f(0)$ first: since $b^0 = 1$, it equals $a$. Then substitute the second point, divide by $a$, and take the root, keeping the positive value. If $f(0) = 3$ and $f(2) = 75$, then $3b^2 = 75$, so $b = 5$. Forgetting the final root leaves $b^2$.",
      "两个参数都未知时，先用 $f(0)$：因为 $b^0 = 1$，它就等于 $a$。再代入第二个点，除以 $a$，开方并取正值。若 $f(0) = 3$ 且 $f(2) = 75$，则 $3b^2 = 75$，所以 $b = 5$。忘了最后开方就只求到了 $b^2$。",
    ),
  },
  "sat-exam-constructing-exponential-functions-from-descriptions": {
    tip: t(
      "A starting amount that is multiplied by a fixed number each step has the form $f(x) = (\\text{start})(\\text{factor})^x$. Starting at $5$ and tripling each step gives $f(x) = 5(3)^x$. The start goes in front and the factor is the base; options that swap them or use addition describe something else.",
      "初始量每步乘一个固定的数，形式就是 $f(x) = (\\text{start})(\\text{factor})^x$，其中 start 是初始量，factor 是倍数。从 $5$ 开始、每步变成三倍，就是 $f(x) = 5(3)^x$。初始量在前，倍数作底数；调换两者或写成加法的选项描述的是别的情形。",
    ),
    hardTip: t(
      "When the multiplying happens once every several time units, the exponent counts multiplications, not time units. For tripling every $4$ days, the exponent after $t$ days is $\\frac{t}{4}$: $f(t) = 5(3)^{t/4}$. Check it: at $t = 4$ exactly one tripling occurred. Writing $4t$ is the opposite mistake.",
      "如果每隔几个时间单位才乘一次，指数要数相乘的次数，而不是时间单位数。每 $4$ 天变成三倍时，$t$ 天后的指数是 $\\frac{t}{4}$：$f(t) = 5(3)^{t/4}$。检验：$t = 4$ 时恰好变了一次。写成 $4t$ 就正好弄反了。",
    ),
  },
  "sat-exam-exponential-functions-expressed-in-equivalent-forms": {
    tip: t(
      "A number times $x$ in the exponent can be moved into the base with the power law, $b^{nx} = (b^{n})^x$. So $5(3)^{2x} = 5(9)^x$. The coefficient stays out of it. Options that multiply the base by the exponent's number, or that change the coefficient, are not equivalent.",
      "指数上 $x$ 的系数可以用幂的乘方法则移到底数上：$b^{nx} = (b^{n})^x$。所以 $5(3)^{2x} = 5(9)^x$，系数不受影响。把底数与指数的系数相乘，或者改变系数的选项，都不等价。",
    ),
    hardTip: t(
      "A number added in the exponent splits off as a factor, since $b^{x + n} = b^x \\cdot b^n$. Compute $b^n$ and multiply it by the coefficient. So $5(3)^{x + 2} = 5 \\cdot 9 \\cdot 3^x = 45(3)^x$. Compare the two rules: added numbers become a factor in front, multiplied numbers change the base.",
      "指数上加的数可以拆成一个因数，因为 $b^{x + n} = b^x \\cdot b^n$。算出 $b^n$，再乘系数。所以 $5(3)^{x + 2} = 5 \\cdot 9 \\cdot 3^x = 45(3)^x$。对比两条法则：指数上加的数变成前面的因数，乘的数则改变底数。",
    ),
  },
  "sat-exam-constructing-exponential-growth-models": {
    tip: t(
      "Growing by $r$ percent keeps the whole amount and adds that share, so the yearly factor is $1 + \\frac{r}{100}$. A value of $300$ growing $7\\%$ yearly is $300(1.07)^t$. Using $0.07$ alone as the base would shrink the amount, and multiplying by $t$ describes linear growth instead.",
      "增长 $r$ 个百分点，就是保留全部原有量再加上这一部分，所以每年的倍数是 $1 + \\frac{r}{100}$。$300$ 每年增长 $7\\%$，就是 $300(1.07)^t$。单用 $0.07$ 作底数会让数量变小，乘以 $t$ 描述的则是线性增长。",
    ),
    hardTip: t(
      "To compute a compounded balance, write the model and apply the factor once per period, so the interest also earns interest. For $200$ dollars at $3\\%$ for $2$ years: $200(1.03)^2 = 212.18$, about $212$ dollars. Simple interest would give $212$ only by rounding; with longer periods the gap widens, so compound step by step.",
      "计算复利余额时，写出模型，每期乘一次倍数，这样利息也会生息。$200$ 美元、年利率 $3\\%$、存 $2$ 年：$200(1.03)^2 = 212.18$，约 $212$ 美元。期限越长，与单利的差距越大，所以要逐期按复利计算，最后再四舍五入。",
    ),
  },
  "sat-exam-constructing-exponential-decay-models": {
    tip: t(
      "Losing $r$ percent leaves $100 - r$ percent, and that remaining share is the base: a loss of $20\\%$ means the factor $0.8$. An item worth $900$ then follows $900(0.8)^t$. The usual wrong base is the lost share itself, $0.2$, or $1.2$, which would describe growth.",
      "减少 $r$ 个百分点，就剩下 $100 - r$ 个百分点，这个剩余比例就是底数：减少 $20\\%$ 意味着倍数是 $0.8$。价值 $900$ 的物品就遵循 $900(0.8)^t$。常见的错误底数是减少的比例 $0.2$，或者表示增长的 $1.2$。",
    ),
    hardTip: t(
      "A half-life is the time for an amount to halve. Divide the elapsed time by the half-life to count halvings, then multiply by $\\frac{1}{2}$ that many times. For $640$ grams with half-life $3$ hours, after $12$ hours there are $4$ halvings, leaving $40$ grams. Dividing the amount by the count is wrong.",
      "半衰期是数量减半所用的时间。用经过的时间除以半衰期，得到减半的次数，再乘上相应次数的 $\\frac{1}{2}$。$640$ 克、半衰期 $3$ 小时，$12$ 小时后减半 $4$ 次，剩下 $40$ 克。把数量直接除以次数是错的。",
    ),
  },
  "sat-exam-determining-unknown-parameters-in-exponential-models": {
    tip: t(
      "The coefficient $a$ in $N(t) = a(b)^t$ is the starting amount. Given a later count, substitute the time and the count, then divide by the power. If $N(t) = a(3)^t$ and there are $270$ after $2$ hours, then $9a = 270$, so it began with $30$. Do not divide by the time itself.",
      "$N(t) = a(b)^t$ 中的系数 $a$ 就是初始量。已知后来的数量时，代入时间和数量，再除以幂。若 $N(t) = a(3)^t$ 且 $2$ 小时后有 $270$，则 $9a = 270$，初始量是 $30$。不要直接除以时间。",
    ),
    hardTip: t(
      "To find the growth factor from two amounts, divide the final amount by the start, which gives $b$ raised to the elapsed time, then take that root. A rise from $50$ to $450$ in $2$ hours gives $b^2 = 9$, so $b = 3$. Reporting the ratio without taking the root is the trap.",
      "由两个数量求增长倍数时，用末量除以初量，得到 $b$ 的“经过时间”次幂，再开相应次方。$2$ 小时内从 $50$ 增到 $450$，得 $b^2 = 9$，所以 $b = 3$。只算出比值而不开方是个陷阱。",
    ),
  },
  "sat-exam-interpreting-exponential-models": {
    tip: t(
      "In $M(t) = a(b)^t$, the coefficient $a$ is the value at $t = 0$, because any base to the power zero is $1$. So in a model of visitors $150(1.1)^t$, the $150$ is the visitor count at the start. It is not the amount of yearly growth and not a later value.",
      "在 $M(t) = a(b)^t$ 中，系数 $a$ 是 $t = 0$ 时的值，因为任何底数的零次幂都是 $1$。所以在访客模型 $150(1.1)^t$ 中，$150$ 是起始时的访客数。它既不是每年的增长量，也不是后来的某个值。",
    ),
    hardTip: t(
      "The base tells the rate of change: $1 + r$ means growth of $r$ as a percent per period, and $1 - r$ means decline. A base of $1.1$ means a $10\\%$ increase each year, relative to the current amount. It is not a fixed count added each year, nor a $110\\%$ increase, which would be a base of $2.1$.",
      "底数说明变化率：$1 + r$ 表示每期增长百分比 $r$，$1 - r$ 表示下降。底数 $1.1$ 表示相对当前数量每年增加 $10\\%$。它不是每年增加固定的数量，也不是增加 $110\\%$，后者的底数应为 $2.1$。",
    ),
  },
  "sat-exam-absolute-value-equations": {
    tip: t(
      "The equation $|A| = c$ with $c > 0$ splits in two: $A = c$ or $A = -c$, since both are at distance $c$ from zero. For $|x + 1| = 6$: $x = 5$ or $x = -7$. Geometrically, these are the points $6$ away from $-1$. Keep both solutions; the wrong options lose one or flip signs.",
      "当 $c > 0$ 时，方程 $|A| = c$ 分成两种情形：$A = c$ 或 $A = -c$，因为两者到零的距离都是 $c$。对 $|x + 1| = 6$：$x = 5$ 或 $x = -7$。从几何上看，它们是到 $-1$ 距离为 $6$ 的点。两个解都要保留，错误选项要么漏解，要么符号有误。",
    ),
    hardTip: t(
      "First isolate the absolute value by undoing what surrounds it: subtract the constant, then divide by the coefficient. Then split. The solutions of $|x - m| = d$ are $m \\pm d$, so they add to $2m$. For $2|x - 4| + 3 = 9$: $|x - 4| = 3$, giving a sum of $8$.",
      "先把绝对值孤立出来，撤销外面的运算：减去常数，再除以系数。然后再分情况。$|x - m| = d$ 的解是 $m \\pm d$，所以两解之和是 $2m$。对 $2|x - 4| + 3 = 9$：$|x - 4| = 3$，两解之和为 $8$。",
    ),
  },
  "sat-exam-rational-equations": {
    tip: t(
      "When the variable is in a denominator, multiply both sides by it to bring it up, then divide. For $\\frac{12}{y} = 3$: $12 = 3y$, so $y = 4$. Multiplying the number by the value on the right instead, which would give $36$, is the common mistake. Check by substituting.",
      "变量在分母时，两边同乘这个变量把它移上来，再做除法。对 $\\frac{12}{y} = 3$：$12 = 3y$，所以 $y = 4$。把两个数相乘得到 $36$ 是常见错误。可以代回去检验。",
    ),
    hardTip: t(
      "For one fraction equal to another, cross-multiply: $\\frac{a}{b} = \\frac{c}{d}$ means $ad = bc$. Treat the binomial in the denominator as one quantity, in parentheses. For $\\frac{3}{x + 2} = \\frac{9}{15}$: $45 = 9(x + 2)$, so $x + 2 = 5$ and $x = 3$. Remember the last step of subtracting.",
      "两个分数相等时，交叉相乘：$\\frac{a}{b} = \\frac{c}{d}$ 意味着 $ad = bc$。把分母中的二项式作为一个整体，加上括号。对 $\\frac{3}{x + 2} = \\frac{9}{15}$：$45 = 9(x + 2)$，所以 $x + 2 = 5$，$x = 3$。别忘了最后那一步减法。",
    ),
  },
  "sat-exam-radical-equations": {
    tip: t(
      "Squaring undoes a square root. Square both sides, including the number on the right, then solve the linear equation. For $\\sqrt{x + 3} = 5$: $x + 3 = 25$, so $x = 22$. Forgetting to square the right side is the main trap; substitute back to confirm the root checks.",
      "平方可以消去平方根。两边同时平方，包括右边的数，再解一次方程。对 $\\sqrt{x + 3} = 5$：$x + 3 = 25$，所以 $x = 22$。主要的陷阱是忘了给右边平方；可以代回去确认根号成立。",
    ),
    hardTip: t(
      "Isolate the radical before squaring: undo the added constant, then the coefficient. For $3\\sqrt{x - 2} + 4 = 19$: $3\\sqrt{x - 2} = 15$, so $\\sqrt{x - 2} = 5$ and $x = 27$. Squaring too early creates a messy cross term and is the source of the wrong answers.",
      "平方之前先把根式孤立出来：先撤销加上的常数，再撤销系数。对 $3\\sqrt{x - 2} + 4 = 19$：$3\\sqrt{x - 2} = 15$，所以 $\\sqrt{x - 2} = 5$，$x = 27$。过早平方会产生复杂的交叉项，错误答案也由此而来。",
    ),
  },
  "sat-exam-equations-containing-multiple-radicals": {
    tip: t(
      "With a single radical on each side, squaring removes both, and the radicands are equal. Solve the resulting linear equation, then check that both radicands are non-negative. For $\\sqrt{3x + 2} = \\sqrt{2x + 7}$: $3x + 2 = 2x + 7$, so $x = 5$. No extra terms appear in this case.",
      "两边各只有一个根式时，平方后根号都消失，被开方数相等。解所得的一次方程，再确认两个被开方数都不为负。对 $\\sqrt{3x + 2} = \\sqrt{2x + 7}$：$3x + 2 = 2x + 7$，所以 $x = 5$。这种情况下不会出现多余的项。",
    ),
    hardTip: t(
      "If a side has two terms, squaring it gives a middle term: $(\\sqrt{x} + c)^2 = x + 2c\\sqrt{x} + c^2$. Isolate the remaining radical and square again or read its value. For $\\sqrt{x + 5} = \\sqrt{x} + 1$: $x + 5 = x + 2\\sqrt{x} + 1$, so $\\sqrt{x} = 2$ and $x = 4$. Omitting the middle term is the classic error.",
      "如果一边有两项，平方时会产生中间项：$(\\sqrt{x} + c)^2 = x + 2c\\sqrt{x} + c^2$。孤立剩下的根式，再平方或直接读出它的值。对 $\\sqrt{x + 5} = \\sqrt{x} + 1$：$x + 5 = x + 2\\sqrt{x} + 1$，所以 $\\sqrt{x} = 2$，$x = 4$。漏掉中间项是典型错误。",
    ),
  },
  "sat-exam-absolute-value-functions": {
    tip: t(
      "The graph of $f(x) = |x - h| + k$ is a V with its corner at $(h, k)$. Read the corner from the grid, then build the equation, remembering the sign inside flips: a corner at $(-3, 1)$ gives $|x + 3| + 1$. A V opening down would need a negative in front.",
      "$f(x) = |x - h| + k$ 的图像是 V 形，拐角在 $(h, k)$。从网格读出拐角，再写方程，注意括号内符号相反：拐角 $(-3, 1)$ 对应 $|x + 3| + 1$。若 V 形开口向下，前面要有负号。",
    ),
    hardTip: t(
      "Because an absolute value is at least $0$, the least value of $|x - h| + k$ is $k$. Adding a number outside shifts the graph up, and every output rises by that amount, including the minimum. For $f(x) = |x - 1| + 2$, the function $f(x) + 3$ has minimum $5$. The input of the corner is unchanged.",
      "绝对值至少为 $0$，所以 $|x - h| + k$ 的最小值是 $k$。在外面加一个数会使图像上移，所有输出都增加这个数，最小值也不例外。对 $f(x) = |x - 1| + 2$，函数 $f(x) + 3$ 的最小值是 $5$，拐角的输入不变。",
    ),
  },
  "sat-exam-rational-functions": {
    tip: t(
      "A fraction is zero exactly when its numerator is zero and its denominator is not. So set the numerator to zero and solve. For $\\frac{x + 4}{x - 2}$, the zero is at $x = -4$. The value from the denominator, $x = 2$, is where the function is undefined, a tempting wrong option.",
      "分式等于零，当且仅当分子为零且分母不为零。所以令分子为零并求解。对 $\\frac{x + 4}{x - 2}$，零点在 $x = -4$。由分母得到的 $x = 2$ 是函数没有定义的地方，是个诱人的错误选项。",
    ),
    hardTip: t(
      "Division by zero has no meaning, so a rational function is undefined where its denominator is zero. Set the denominator to zero and solve for $x$. For $\\frac{7}{x + 5}$, it is undefined at $x = -5$. The sign flips from what appears in the denominator, and the numerator plays no part.",
      "除以零没有意义，所以有理函数在分母为零处没有定义。令分母为零，解出 $x$。对 $\\frac{7}{x + 5}$，在 $x = -5$ 处没有定义。结果的符号与分母中出现的相反，分子在这里不起作用。",
    ),
  },
  "sat-exam-solving-multivariable-equations": {
    tip: t(
      "To isolate one variable, treat the others like numbers and undo operations in reverse order: first remove added terms, then divide by the coefficient. From $m = 3k + 5n$: $k = \\frac{m - 5n}{3}$. The whole difference goes over the coefficient; dividing only one term is the usual error.",
      "要孤立一个变量，把其他变量当作数，按相反顺序撤销运算：先去掉相加的项，再除以系数。由 $m = 3k + 5n$ 得 $k = \\frac{m - 5n}{3}$。整个差都要除以系数，只除一项是常见错误。",
    ),
    hardTip: t(
      "If the target variable is inside parentheses multiplied by others, divide by the entire outer product first, and only then remove the term next to the target. From $6S = 3w(p + q)$: $p + q = \\frac{6S}{3w}$, so $p = \\frac{6S}{3w} - q$. Subtracting before dividing is the mistake.",
      "目标变量在括号内且括号外乘有其他量时，先除以括号外的整个乘积，然后才去掉目标旁边的项。由 $6S = 3w(p + q)$ 得 $p + q = \\frac{6S}{3w}$，所以 $p = \\frac{6S}{3w} - q$。先减后除就错了。",
    ),
  },
  "sat-exam-further-multivariable-equations": {
    tip: t(
      "Solve for the requested letter as in any linear equation. Move the other variable's term across, changing its sign, then divide everything by the coefficient. From $5a + 3b = c$: $3b = c - 5a$, so $b = \\frac{c - 5a}{3}$. Be careful which letter is asked for and which term changes sign.",
      "像解一次方程一样解出所求字母。把另一个变量的项移过去并变号，再把所有项除以系数。由 $5a + 3b = c$ 得 $3b = c - 5a$，所以 $b = \\frac{c - 5a}{3}$。注意问的是哪个字母，以及哪一项要变号。",
    ),
    hardTip: t(
      "When the target appears on both sides with letter coefficients, collect its terms on one side, factor it out, and divide by the bracket. From $px + 4 = qx + 10$: $px - qx = 6$, so $x(p - q) = 6$ and $x = \\frac{6}{p - q}$. Keep the order consistent, because $q - p$ would change the sign.",
      "目标变量出现在两边且系数是字母时，把含它的项集中到一边，提出公因式，再除以括号。由 $px + 4 = qx + 10$ 得 $px - qx = 6$，所以 $x(p - q) = 6$，$x = \\frac{6}{p - q}$。注意顺序一致，写成 $q - p$ 符号就变了。",
    ),
  },
  "sat-exam-solving-multivariable-rational-equations": {
    tip: t(
      "If the target is in a denominator, multiply both sides by that denominator to bring it up, then divide by whatever accompanies it. From $m = \\frac{6n}{5w}$: $5wm = 6n$, so $w = \\frac{6n}{5m}$. The other letter ends up below the target's coefficient; options leaving it above skipped a step.",
      "目标在分母时，两边同乘这个分母把它移上来，再除以与它相乘的量。由 $m = \\frac{6n}{5w}$ 得 $5wm = 6n$，所以 $w = \\frac{6n}{5m}$。另一个字母最后落到分母上，仍留在分子上的选项漏了一步。",
    ),
    hardTip: t(
      "With a sum of fractions, combine it over a common denominator into one fraction, then take the reciprocal of both sides to reach the target. From $\\frac{1}{a} + \\frac{3}{b} = \\frac{1}{c}$: $\\frac{b + 3a}{ab} = \\frac{1}{c}$, so $c = \\frac{ab}{b + 3a}$. Taking reciprocals term by term is invalid.",
      "分式相加时，先通分合并成一个分式，再对两边取倒数得到目标。由 $\\frac{1}{a} + \\frac{3}{b} = \\frac{1}{c}$ 得 $\\frac{b + 3a}{ab} = \\frac{1}{c}$，所以 $c = \\frac{ab}{b + 3a}$。逐项取倒数是不成立的。",
    ),
  },
  "sat-exam-solving-multivariable-nonlinear-equations": {
    tip: t(
      "If the target is squared, peel away everything else first in reverse order of operations, and take the square root last, over the whole expression. From $E = 3m^2 c + 1$: $m^2 = \\frac{E - 1}{3c}$, so $m = \\sqrt{\\frac{E - 1}{3c}}$ for $m > 0$. The added constant must be subtracted before any division.",
      "目标变量带平方时，先按运算的相反顺序去掉其他部分，最后再对整个表达式开方。由 $E = 3m^2 c + 1$ 得 $m^2 = \\frac{E - 1}{3c}$，所以当 $m > 0$ 时 $m = \\sqrt{\\frac{E - 1}{3c}}$。要先减去加上的常数，再做除法。",
    ),
    hardTip: t(
      "If the target is under a root, first divide away any outside coefficient, then square both sides, squaring that coefficient's divisor too, and finally clear the denominator. From $P = 2\\sqrt{\\frac{w}{3k}}$: $\\frac{P^2}{4} = \\frac{w}{3k}$, so $w = \\frac{3kP^2}{4}$. Forgetting to square the coefficient is the trap.",
      "目标在根号下时，先除掉根号外的系数，再两边平方，这个系数也要平方，最后去分母。由 $P = 2\\sqrt{\\frac{w}{3k}}$ 得 $\\frac{P^2}{4} = \\frac{w}{3k}$，所以 $w = \\frac{3kP^2}{4}$。忘了把系数平方是常见陷阱。",
    ),
  },
  "sat-exam-identifying-intercepts-of-functions-from-graphs": {
    tip: t(
      "The $y$-intercept is where the graph crosses the vertical axis, so its $x$-coordinate is $0$. Find that crossing on the grid and read its height, then write the point as $(0, b)$. If the curve crosses at height $-3$, the point is $(0, -3)$. Do not reverse the coordinates.",
      "$y$ 轴截距是图像与竖直轴的交点，所以它的 $x$ 坐标是 $0$。在网格上找到这个交点并读出高度，写成 $(0, b)$。若曲线在高度 $-3$ 处相交，这个点就是 $(0, -3)$。不要把坐标写反。",
    ),
    hardTip: t(
      "An $x$-intercept is where the graph meets the horizontal axis, so its height is $0$. A graph can have several, so look only to the right of the origin for the positive one and read the value there. Points where the curve merely turns, above or below the axis, do not count.",
      "$x$ 轴截距是图像与水平轴的交点，此处高度为 $0$。图像可能有多个截距，要找正的那个，只看原点右侧并读出那里的值。曲线在轴上方或下方转折的点都不算。",
    ),
  },
  "sat-exam-interpreting-graph-properties-in-modeling-contexts": {
    tip: t(
      "In a context graph, the $y$-intercept is the output when the input is zero, so it describes the starting situation. If a graph shows fuel left in a truck against hours driven, it is the fuel at the moment driving begins. It is not a rate, and it is not the end of the process.",
      "在情境图中，$y$ 轴截距是输入为零时的输出，所以它描述的是初始状态。若图像表示卡车剩余燃油随行驶时间的变化，它就是开始行驶那一刻的燃油量。它不是变化率，也不是过程的终点。",
    ),
    hardTip: t(
      "An $x$-intercept is the input at which the output reaches zero. For a quantity that is running out, that is the moment nothing is left. On a graph of fuel left against hours driven, it is the driving time at which the tank is empty. Its units are those of the horizontal axis.",
      "$x$ 轴截距是输出变为零时的输入。对于逐渐耗尽的量，它就是一点不剩的时刻。在剩余燃油随行驶时间变化的图上，它是油箱耗尽时已行驶的时间。它的单位是横轴的单位。",
    ),
  },
  "sat-exam-solving-linear-quadratic-systems-of-equations": {
    tip: t(
      "When both equations give $y$, set the right sides equal, move everything to one side, and factor. The zeros are the $x$-values of the solutions. For $y = x^2 + 3$ and $y = 4x$: $x^2 - 4x + 3 = 0$, so $x = 1$ or $x = 3$. Do not forget to combine the constants before factoring.",
      "两个方程都给出 $y$ 时，令右边相等，把所有项移到一边，再分解。其零点就是解的 $x$ 值。对 $y = x^2 + 3$ 和 $y = 4x$：$x^2 - 4x + 3 = 0$，所以 $x = 1$ 或 $x = 3$。分解前别忘了合并常数。",
    ),
    hardTip: t(
      "The sum of the $x$-values can be read straight from the combined quadratic: $x_1 + x_2 = -\\frac{b}{a}$. For $y = x^2 + 3$ and $y = 4x$, the combined equation has $a = 1$, $b = -4$, so the sum is $4$. Be sure to use the combined equation, not either original one.",
      "$x$ 值之和可以直接从合并后的二次方程读出：$x_1 + x_2 = -\\frac{b}{a}$。对 $y = x^2 + 3$ 和 $y = 4x$，合并后的方程中 $a = 1$、$b = -4$，所以和为 $4$。一定要用合并后的方程，而不是原来的任一方程。",
    ),
  },
  "sat-exam-solving-challenging-linear-quadratic-systems-of-equations": {
    tip: t(
      "Equate the two expressions for $y$, collect terms, and divide by any common factor before factoring. A solution of a system is a pair, so substitute each $x$ into the linear equation to find its $y$. For $y = 3x^2 + 6$ and $y = 9x$: $x^2 - 3x + 2 = 0$, giving $(1, 9)$ and $(2, 18)$.",
      "令两个 $y$ 的表达式相等，合并同类项，分解前先除以公因数。方程组的解是有序数对，所以要把每个 $x$ 代入一次方程求出 $y$。对 $y = 3x^2 + 6$ 和 $y = 9x$：$x^2 - 3x + 2 = 0$，解为 $(1, 9)$ 和 $(2, 18)$。",
    ),
    hardTip: t(
      "After finding both $x$-values, compute each $y$ using the simpler equation, then compare. For $y = 3x^2 + 6$ and $y = 9x$, the outputs at $x = 1$ and $x = 2$ are $9$ and $18$, so the greater is $18$. A negative slope would reverse which $x$ gives the greater $y$, so calculate rather than assume. The answer is a $y$-value, not $x$.",
      "求出两个 $x$ 后，用较简单的方程算出各自的 $y$，再比较。对 $y = 3x^2 + 6$ 和 $y = 9x$，$x = 1$ 和 $x = 2$ 时的输出是 $9$ 和 $18$，较大的是 $18$。斜率为负时，较大的 $y$ 对应的 $x$ 会反过来，所以要算而不是猜。答案是 $y$ 值，不是 $x$。",
    ),
  },
  "sat-exam-exploiting-structure-to-solve-nonlinear-systems-of-equations": {
    tip: t(
      "When you see a difference of squares with the sum or difference given, factor rather than solve: $a^2 - b^2 = (a + b)(a - b)$. Divide the known product by the known factor. If $a + b = 4$ and $a^2 - b^2 = 28$, then $a - b = 7$. Finding each variable separately is unnecessary work.",
      "看到平方差且已知和或差时，要分解而不是求解：$a^2 - b^2 = (a + b)(a - b)$。用已知的积除以已知的因式。若 $a + b = 4$ 且 $a^2 - b^2 = 28$，则 $a - b = 7$。分别求出每个变量是多余的。",
    ),
    hardTip: t(
      "A sum of squares comes from squaring the sum: $(a + b)^2 = a^2 + 2ab + b^2$. So $a^2 + b^2 = (a + b)^2 - 2ab$. With $a + b = 7$ and $ab = 10$, it is $49 - 20 = 29$. Squaring the sum without subtracting $2ab$, which forgets the middle term, gives the distractor.",
      "平方和来自和的平方：$(a + b)^2 = a^2 + 2ab + b^2$，所以 $a^2 + b^2 = (a + b)^2 - 2ab$。当 $a + b = 7$、$ab = 10$ 时，结果是 $49 - 20 = 29$。只把和平方而不减 $2ab$，就漏了中间项，落入干扰项。",
    ),
  },
  "sat-exam-linear-quadratic-systems-with-one-solution": {
    tip: t(
      "The line and parabola touch once exactly when the combined quadratic has one solution. Equate them, collect everything on one side, and set the discriminant to zero. For $y = x^2 + 2$ and $y = 2x + c$: $x^2 - 2x + 2 - c = 0$, so $4 - 4(2 - c) = 0$ and $c = 1$. The whole constant term is $2 - c$.",
      "直线与抛物线恰好相切一次，就是合并后的二次方程只有一个解。令两式相等，全部移到一边，再令判别式为零。对 $y = x^2 + 2$ 和 $y = 2x + c$：$x^2 - 2x + 2 - c = 0$，所以 $4 - 4(2 - c) = 0$，$c = 1$。整个常数项是 $2 - c$。",
    ),
    hardTip: t(
      "When the unknown is the slope, it becomes the middle coefficient of the combined quadratic, so the discriminant gives its square. Apply the sign condition afterward. For $y = 2x^2 + 8$ and $y = kx$ with $k > 0$: $k^2 = 4(2)(8) = 64$, so $k = 8$. Remember to take the root, and keep the leading coefficient.",
      "未知的是斜率时，它成为合并后二次方程的中间项系数，判别式给出它的平方，然后再用符号条件。对 $y = 2x^2 + 8$ 和 $y = kx$ 且 $k > 0$：$k^2 = 4(2)(8) = 64$，所以 $k = 8$。记得开方，也别漏掉首项系数。",
    ),
  },
  "sat-exam-linear-quadratic-systems-with-zero-or-two-solutions": {
    tip: t(
      "No solution means the line misses the parabola, so the combined quadratic's discriminant is negative. Equate, collect, and solve the inequality, then test the options. For $y = x^2 + c$ and $y = 2x + 3$: $x^2 - 2x + c - 3 = 0$, and $4 - 4(c - 3) < 0$ gives $c > 4$. Treat $c - 3$ as one constant.",
      "无解表示直线与抛物线不相交，即合并后二次方程的判别式为负。令两式相等、合并，解不等式，再检验选项。对 $y = x^2 + c$ 和 $y = 2x + 3$：$x^2 - 2x + c - 3 = 0$，由 $4 - 4(c - 3) < 0$ 得 $c > 4$。把 $c - 3$ 当作一个常数。",
    ),
    hardTip: t(
      "Two solutions need a positive discriminant, which gives a strict bound; the greatest integer lies just below it. For $y = x^2 + c$ and $y = 6x$: $x^2 - 6x + c = 0$, so $36 - 4c > 0$ gives $c < 9$, and the greatest integer is $8$. At the bound itself the line is tangent, with one solution.",
      "两个解要求判别式为正，这给出一个严格的界，最大整数就在它下方。对 $y = x^2 + c$ 和 $y = 6x$：$x^2 - 6x + c = 0$，由 $36 - 4c > 0$ 得 $c < 9$，最大整数是 $8$。恰好取边界时，直线与抛物线相切，只有一个解。",
    ),
  },
  "sat-exam-other-systems-of-nonlinear-equations": {
    tip: t(
      "Substitute the known variable into the nonlinear equation, simplify, and solve. If $y$ is given, $x^2 + y = c$ becomes $x^2 = c - y$. For $x^2 + y = 12$ and $y = 3$: $x^2 = 9$, so $x = \\pm 3$. Use the stated condition to select the sign that the problem allows.",
      "把已知的变量代入非线性方程，化简后求解。已知 $y$ 时，$x^2 + y = c$ 就变成 $x^2 = c - y$。对 $x^2 + y = 12$ 和 $y = 3$：$x^2 = 9$，所以 $x = \\pm 3$。用题目给出的条件选定符号。",
    ),
    hardTip: t(
      "When one equation has $x$ in a denominator, equate the two expressions for $y$ and multiply by $x$ to clear the fraction. That gives a quadratic to factor. For $y = \\frac{6}{x}$ and $y = x + 5$ with $x > 0$: $x(x + 5) = 6$, so $x = 1$ and $y = 6$. Report the variable the question names.",
      "一个方程的分母含 $x$ 时，令两个 $y$ 的表达式相等，同乘 $x$ 去分母，就得到可分解的二次方程。对 $y = \\frac{6}{x}$ 和 $y = x + 5$ 且 $x > 0$：$x(x + 5) = 6$，所以 $x = 1$，$y = 6$。回答题目所问的那个变量。",
    ),
  },
  "sat-exam-evaluating-expressions": {
    tip: t(
      "Substitute the value in parentheses and follow the order of operations: powers first, then multiplication, then addition or subtraction. For $2x^2 + 5$ at $x = 4$: $2(16) + 5 = 37$. The usual wrong answer multiplies the coefficient and input before squaring, which gives $(2 \\cdot 4)^2 + 5$.",
      "把数值放进括号代入，按运算顺序计算：先乘方，再乘法，最后加减。对 $2x^2 + 5$，在 $x = 4$ 时：$2(16) + 5 = 37$。常见的错误答案是先把系数和输入相乘再平方，也就是 $(2 \\cdot 4)^2 + 5$。",
    ),
    hardTip: t(
      "When an expression is a multiple of the given one, there is no need to find $x$. Spot the multiple, scale the known value, then apply any extra term. If $2x + 1 = 7$, then $8x + 4$ is $4$ times that, so $8x + 4 + 3 = 28 + 3 = 31$. Compare the coefficients to see the factor.",
      "一个表达式是已知表达式的倍数时，不必求 $x$。找出倍数，把已知值放大，再处理多出来的项。若 $2x + 1 = 7$，则 $8x + 4$ 是它的 $4$ 倍，所以 $8x + 4 + 3 = 28 + 3 = 31$。比较系数就能看出倍数。",
    ),
  },
  "sat-exam-solving-one-step-addition-equations": {
    tip: t(
      "You can jump straight from one expression to a related one. Compare them: if the new one has a constant that is greater by some amount, its value is greater by that amount as well. If $x + 9 = 30$, then $x + 14$ is $5$ more, so it is $35$. Solving for $x$ first also works, but do not stop there.",
      "可以直接从一个表达式推到相关的另一个。比较两者：新表达式的常数大多少，它的值也就大多少。若 $x + 9 = 30$，则 $x + 14$ 比它大 $5$，等于 $35$。先解出 $x$ 也可以，但不要停在那一步。",
    ),
    hardTip: t(
      "Follow the story in order. Add or subtract to find the unknown start, compute the current amount, and finally compare the two. A bin gets $6$ kilograms, reaching $20$, so it started at $14$; removing $2$ leaves $18$, which is $4$ more than at the start. The question asks for this comparison, not for the current amount.",
      "按情节顺序来。用加减法求出未知的初始量，算出当前的量，最后比较两者。一个箱子加入 $6$ 千克后达到 $20$，所以原来是 $14$；再取走 $2$ 后剩 $18$，比原来多 $4$。题目要的是这个差，而不是当前的量。",
    ),
  },
  "sat-exam-solving-one-step-multiplication-equations": {
    tip: t(
      "If the target is a multiple of the given expression, multiply the known value by the same factor, with no need to solve first. Given $3x = 12$, the expression $15x$ is $5$ times $3x$, so it is $60$. Solving gives $x = 4$, which is a stop on the way and not the requested value.",
      "如果目标是已知表达式的倍数，把已知值乘以同样的倍数即可，不必先求解。已知 $3x = 12$，$15x$ 是 $3x$ 的 $5$ 倍，所以等于 $60$。解出 $x = 4$ 只是中途的一步，不是所求的值。",
    ),
    hardTip: t(
      "To undo a fractional coefficient, multiply both sides by its reciprocal, since a fraction times its reciprocal is $1$. For $\\frac{2}{5}x = 4$: $x = 4 \\cdot \\frac{5}{2} = 10$. Multiplying by the fraction itself, instead of flipping it, is the slip that the wrong options reflect.",
      "要消去分数系数，两边同乘它的倒数，因为分数乘倒数等于 $1$。对 $\\frac{2}{5}x = 4$：$x = 4 \\cdot \\frac{5}{2} = 10$。错误选项反映的疏漏，就是乘了分数本身而没有取倒数。",
    ),
  },
  "sat-exam-solving-multistep-linear-equations": {
    tip: t(
      "Collect the variable terms on one side and the numbers on the other, using inverse operations on both sides, then divide by the coefficient. For $7x + 2 = 4x + 14$: $3x = 12$, so $x = 4$. Each move must change sign; adding instead of subtracting is the frequent error.",
      "用逆运算把含变量的项移到一边，常数移到另一边，再除以系数。对 $7x + 2 = 4x + 14$：$3x = 12$，所以 $x = 4$。每次移项都要变号，该减却加是常见错误。",
    ),
    hardTip: t(
      "Solve the equation as usual, then substitute into the expression requested, because the question does not ask for $x$. For $7x + 2 = 4x + 14$, we get $x = 4$, so $3x + 5 = 17$. Often the collected equation contains a shortcut: here $3x = 12$ already supplies part of the expression.",
      "照常解方程，再代入所问的表达式，因为题目问的不是 $x$。对 $7x + 2 = 4x + 14$，得 $x = 4$，所以 $3x + 5 = 17$。合并后的方程常常藏着捷径：这里 $3x = 12$ 已经提供了表达式的一部分。",
    ),
  },
  "sat-exam-solving-equations-with-fractional-coefficients": {
    tip: t(
      "Work in reverse: remove the added number first, then multiply by the denominator to undo the division. For $\\frac{x}{4} - 3 = 2$: $\\frac{x}{4} = 5$, so $x = 20$. Multiplying before removing the constant is allowed only if every term is multiplied, which is where errors arise.",
      "反向操作：先去掉加减的数，再乘分母以撤销除法。对 $\\frac{x}{4} - 3 = 2$：$\\frac{x}{4} = 5$，所以 $x = 20$。如果先乘，就必须每一项都乘，错误往往出在这里。",
    ),
    hardTip: t(
      "With fractions on both sides, multiply every term by the least common denominator so the fractions vanish, including the term without a denominator. For $\\frac{x}{3} = \\frac{x}{5} + 2$, multiply by $15$: $5x = 3x + 30$, so $x = 15$. Forgetting to scale the whole number is the trap.",
      "两边都有分数时，每一项都乘最小公分母以消去分数，没有分母的项也要乘。对 $\\frac{x}{3} = \\frac{x}{5} + 2$，同乘 $15$：$5x = 3x + 30$，所以 $x = 15$。陷阱就在于忘了把整数项也乘上去。",
    ),
  },
  "sat-exam-solving-linear-equations-containing-binomials": {
    tip: t(
      "If the question asks for the binomial itself, keep it as one block and divide both sides by the outside number. For $5(x - 2) = 40$: $x - 2 = 8$, and you can stop there. Going on to $x$, which is $10$ here, answers a different question and is a listed wrong choice.",
      "如果题目问的就是这个二项式，把它当作一个整体，两边除以括号外的数。对 $5(x - 2) = 40$：$x - 2 = 8$，到这里就可以停了。继续求出 $x$（这里是 $10$）回答的是另一个问题，也是预设的错误选项。",
    ),
    hardTip: t(
      "With several parentheses, distribute each with its sign, especially a subtracted one, then collect terms and solve. For $2(x + 1) + 3x - 4(x - 2) = 13$: $2x + 2 + 3x - 4x + 8 = 13$, so $x + 10 = 13$ and $x = 3$. A negative multiplier flips the sign of the constant.",
      "有多个括号时，带着符号逐个分配，尤其是被减去的括号，然后合并同类项并求解。对 $2(x + 1) + 3x - 4(x - 2) = 13$：$2x + 2 + 3x - 4x + 8 = 13$，所以 $x + 10 = 13$，$x = 3$。负的乘数会使常数变号。",
    ),
  },
  "sat-exam-solving-linear-equations-containing-binomials-by-factoring": {
    tip: t(
      "When the same binomial appears in several terms, treat it like a single variable and combine its coefficients. For $7(2x + 1) - 5(2x + 1) = 18$: $2(2x + 1) = 18$, so $2x + 1 = 9$. There is no need to expand, and the requested value is that of the block.",
      "同一个二项式出现在几项中时，把它当作一个变量，合并它的系数。对 $7(2x + 1) - 5(2x + 1) = 18$：$2(2x + 1) = 18$，所以 $2x + 1 = 9$。不必展开，题目要的就是这个整体的值。",
    ),
    hardTip: t(
      "To reach $x$, take one further step after the block: factor out the binomial, combine its coefficients, divide, then solve the small linear equation. For $7(2x + 1) - 5(2x + 1) = 18$: $2x + 1 = 9$, so $x = 4$. Stopping at the block's value is the wrong answer here.",
      "要求 $x$，在求出整体后还要多走一步：提出二项式，合并系数，相除，再解这个简单的一次方程。对 $7(2x + 1) - 5(2x + 1) = 18$：$2x + 1 = 9$，所以 $x = 4$。这里停在整体的值上就错了。",
    ),
  },
  "sat-exam-solving-linear-equations-with-binomials-on-both-sides": {
    tip: t(
      "Distribute on each side, combine the numbers on each side, then collect the $x$ terms and solve. For $6(x + 1) = 5(x + 2) + 3$: $6x + 6 = 5x + 13$, so $x = 7$. Multiply the outside number by both terms inside. A solution of $x = 0$ is perfectly possible, so trust the algebra.",
      "两边分别去括号，合并各边的数，再把 $x$ 项集中并求解。对 $6(x + 1) = 5(x + 2) + 3$：$6x + 6 = 5x + 13$，所以 $x = 7$。括号外的数要乘括号内的两项。解为 $x = 0$ 完全可能，要相信计算结果。",
    ),
    hardTip: t(
      "These questions either give two binomial products with $x$ left over on both sides, or ask for a further expression. Distribute, collect and divide by the $x$ coefficient that remains: $4(x + 1) = 2(x + 5)$ gives $2x = 6$, so $x = 3$. If an expression like $2x - 1$ is requested, substitute afterward to get $5$.",
      "这类题要么是两边都是二项式的乘积、$x$ 项还有剩余，要么问另一个表达式的值。去括号、合并，再除以剩下的 $x$ 系数：$4(x + 1) = 2(x + 5)$ 得 $2x = 6$，所以 $x = 3$。如果问的是 $2x - 1$ 这样的表达式，再代入得 $5$。",
    ),
  },
  "sat-exam-constructing-models-with-one-variable-linear-equations": {
    tip: t(
      "A total with a one-time charge and a per-unit charge has the form $\\text{fixed} + \\text{rate} \\cdot n = \\text{total}$. A $20$ dollar sign-up plus $4$ dollars per lesson, totaling $60$, gives $20 + 4n = 60$. Only the rate multiplies $n$; options attaching the variable to the fee, or adding the total, misread the situation.",
      "总费用由一次性费用和按单位收费组成，形式是 $\\text{fixed} + \\text{rate} \\cdot n = \\text{total}$（固定费加上单价乘以数量，等于总额）。$20$ 美元报名费加每节课 $4$ 美元，总共 $60$，就是 $20 + 4n = 60$。只有单价乘 $n$；把变量放在一次性费用上的选项都误读了情境。",
    ),
    hardTip: t(
      "A discount per unit changes the rate before it multiplies $n$; the one-time fee is unaffected. So find the adjusted rate first. A $20$ dollar sign-up with lessons at $9$ dollars, less $5$ dollars off each, totaling $60$, gives $20 + 4n = 60$. Subtracting the discount just once from the total is the error to avoid.",
      "按单位的折扣要先改变单价，再乘 $n$；一次性费用不受影响。所以先算调整后的单价。$20$ 美元报名费，每节课 $9$ 美元，每节优惠 $5$ 美元，总共 $60$，就是 $20 + 4n = 60$。把折扣只从总额中减一次是要避免的错误。",
    ),
  },
  "sat-exam-modeling-and-solving-problems-using-linear-equations": {
    tip: t(
      "Write the total as fixed fee plus rate times the count, then solve: subtract the fee and divide by the rate. A $25$ dollar fee plus $6$ dollars per ticket, charged $85$ dollars in all, gives $6n = 60$, so $n = 10$. Dividing the total by the rate without removing the fee is the trap.",
      "把总额写成固定费用加单价乘数量，然后求解：减去固定费用，再除以单价。$25$ 美元手续费加每张票 $6$ 美元，共收 $85$ 美元，得 $6n = 60$，所以 $n = 10$。不减固定费用就直接除以单价是个陷阱。",
    ),
    hardTip: t(
      "Comparing two plans, write each total as fee plus rate times $n$, and set them equal. Then collect the $n$ terms on one side and solve. For $20 + 8n$ and $35 + 5n$: $3n = 15$, so $n = 5$. Dividing by a rate instead of the difference between the rates gives a wrong count.",
      "比较两种方案时，把各自的总额写成固定费用加单价乘 $n$，令它们相等，再把 $n$ 项集中到一边并求解。对 $20 + 8n$ 和 $35 + 5n$：$3n = 15$，所以 $n = 5$。除以某个单价而不是单价之差，数量就算错了。",
    ),
  },
  "sat-exam-solving-two-variable-linear-models": {
    tip: t(
      "An equation like $ax + by = T$ links two counts to a total. Substitute the known count, subtract the money it brought, then divide by the other price. For $5x + 3y = 50$ with $x = 4$: $20 + 3y = 50$, so $y = 10$. Be sure to put the known count with its own coefficient.",
      "像 $ax + by = T$ 这样的方程把两个数量和总额联系起来。代入已知的数量，减去它带来的金额，再除以另一个单价。对 $5x + 3y = 50$，$x = 4$ 时：$20 + 3y = 50$，所以 $y = 10$。要把已知数量与它自己的系数相乘。",
    ),
    hardTip: t(
      "If the total stays fixed, a rise in one count must be offset by a fall in the other. The extra money is $a$ times the rise; dividing it by $b$ gives the fall in $y$. In $5x + 3y = 50$, raising $x$ by $6$ brings $30$ more, so $y$ decreases by $10$. No starting values are needed.",
      "总额不变时，一个数量增加，另一个就必须减少。多出来的金额是 $a$ 乘增加量，再除以 $b$，就是 $y$ 的减少量。在 $5x + 3y = 50$ 中，$x$ 增加 $6$ 就多出 $30$，所以 $y$ 减少 $10$。不需要知道原来的数量。",
    ),
  },
  "sat-exam-constructing-models-with-two-variable-linear-equations": {
    tip: t(
      "Each kind of item contributes its price times its count, and the two parts add up to the total: $(\\text{price}_1)x + (\\text{price}_2)y = \\text{total}$. Mugs at $6$ dollars and cups at $2$ dollars with sales of $100$ dollars give $6x + 2y = 100$. Pair each price with its own variable, and do not multiply the prices together.",
      "每种物品的贡献是单价乘数量，两部分加起来等于总额：$(\\text{price}_1)x + (\\text{price}_2)y = \\text{total}$。杯子每个 $6$ 美元，水杯每个 $2$ 美元，销售额 $100$ 美元，就写成 $6x + 2y = 100$。每个单价要配它自己的变量，不要把两个单价相乘。",
    ),
    hardTip: t(
      "Now the units disagree: the time per item is in minutes while the total is in hours. Convert before writing the equation, by multiplying the hours by $60$. Items taking $5$ and $4$ minutes, with $10$ hours in all, give $5x + 4y = 600$. Leaving the total in hours is the trap in the options.",
      "这里单位不一致：每件的用时以分钟计，总时间却以小时计。写方程之前要先换算，把小时数乘 $60$。每件分别用 $5$ 分钟和 $4$ 分钟、一共 $10$ 小时，就写成 $5x + 4y = 600$。选项中的陷阱就是总时间仍用小时。",
    ),
  },
  "sat-exam-interpreting-two-variable-linear-equations": {
    tip: t(
      "A term such as $6x$ is a price times a count, so it stands for the money from that kind of item, in dollars. It is neither the price of one item nor the number sold. In $6x + 2y = 100$ with $x$ mugs, the term $6x$ means the sales from mugs. Use the units to confirm.",
      "像 $6x$ 这样的项是单价乘数量，所以它表示这种物品带来的金额，单位是美元。它既不是单件的价格，也不是售出的数量。在 $6x + 2y = 100$ 中，若 $x$ 表示杯子数量，$6x$ 就是杯子的销售额。可用单位来确认。",
    ),
    hardTip: t(
      "Setting one variable to zero means none of that item was sold, so the matching value of the other variable is how many of the remaining item alone would reach the total. In $6x + 2y = 100$ with $y = 0$, the value $x = \\frac{100}{6}$ is the count of mugs required with no cups. It is an intercept of the line, not a price.",
      "令一个变量为零，表示这种物品一件也没卖，此时另一个变量的值，就是只靠另一种物品达到总额所需的数量。在 $6x + 2y = 100$ 中令 $y = 0$，$x = \\frac{100}{6}$ 是不卖水杯时所需的杯子数。它是直线的截距，不是价格。",
    ),
  },
  "sat-exam-interpreting-coefficients-of-two-variable-linear-equations": {
    tip: t(
      "In $y = b - mx$, the coefficient $m$ multiplies the input, so it says how much $y$ falls for each added unit of $x$. In a model of a phone's charge, $y = 90 - 5x$ with $x$ in hours, the $5$ is the charge used per hour. The number $b$, not $m$, is the starting amount.",
      "在 $y = b - mx$ 中，系数 $m$ 乘输入，所以它表示 $x$ 每增加一个单位，$y$ 减少多少。在手机电量模型 $y = 90 - 5x$ 中，$x$ 以小时计，$5$ 就是每小时消耗的电量。起始量是 $b$，不是 $m$。",
    ),
    hardTip: t(
      "The drop over any stretch of input depends only on its length, so multiply the rate by the length, and ignore the starting amount and where the stretch begins. With $y = 90 - 5x$, any $4$ hours use $20$ units. Answering with a remaining amount such as $90 - 20$ is the mistake here.",
      "任意一段输入上的减少量只取决于这段的长度，所以用变化率乘长度，不必管起始量和这段从何时开始。对 $y = 90 - 5x$，任意 $4$ 小时都消耗 $20$ 个单位。回答剩余量，如 $90 - 20$，就错了。",
    ),
  },
  "sat-exam-modeling-totals-using-two-variable-linear-equations": {
    tip: t(
      "The total of a sale is the sum of two pieces, each a price times a number sold. Hats at $9$ dollars and socks at $4$ dollars, for $130$ dollars in all, give $9x + 4y = 130$. Options that write $x + y$ on the left count items rather than dollars, so they cannot equal a money total.",
      "销售总额是两部分之和，每部分都是单价乘售出数量。帽子每顶 $9$ 美元，袜子每双 $4$ 美元，一共 $130$ 美元，就写成 $9x + 4y = 130$。左边写成 $x + y$ 的选项数的是件数而不是金额，不可能等于总金额。",
    ),
    hardTip: t(
      "A second fact, the number of items, lets you replace $y$ with $n - x$. Substitute into the money equation and solve: at $9$ and $4$ dollars, with $20$ items and $130$ dollars, $9x + 4(20 - x) = 130$ gives $5x = 50$, so $x = 10$. Report the count of the kind asked for.",
      "第二个条件是总件数，它让你可以把 $y$ 换成 $n - x$。代入金额方程求解：单价为 $9$ 和 $4$ 美元，共 $20$ 件、$130$ 美元时，$9x + 4(20 - x) = 130$ 得 $5x = 50$，所以 $x = 10$。回答题目所问的那种物品的数量。",
    ),
  },
  "sat-exam-modeling-geometry-problems-using-linear-equations": {
    tip: t(
      "Write the length in terms of the width from the sentence, then use perimeter $= 2(\\text{length} + \\text{width})$. If the length is $3$ more than twice the width and the perimeter is $36$: $2(w + 2w + 3) = 36$, so $3w + 3 = 18$ and $w = 5$. Remember that a perimeter counts each side pair, so the $2$ must be there.",
      "根据题意用宽表示长，再用周长 $= 2(\\text{length} + \\text{width})$（长加宽的两倍）。若长比宽的两倍多 $3$、周长为 $36$：$2(w + 2w + 3) = 36$，所以 $3w + 3 = 18$，$w = 5$。周长包括两组对边，这个 $2$ 不能漏。",
    ),
    hardTip: t(
      "Area needs both dimensions, so solve for the width first, then calculate the length, and finally multiply. In the example with length $2w + 3$ and perimeter $36$, the width is $5$ and the length $13$, so the area is $65$. Stopping after the width, or mixing up perimeter and area, gives the wrong options.",
      "面积需要两个边长，所以先解出宽，再算长，最后相乘。例如长为 $2w + 3$、周长为 $36$ 时，宽是 $5$，长是 $13$，面积就是 $65$。求出宽就停下，或者把周长和面积弄混，都会得到错误选项。",
    ),
  },
  "sat-exam-evaluating-linear-functions": {
    tip: t(
      "To evaluate a linear function, replace $x$ with the input, multiply by the slope, then apply the constant. For $g(x) = -4x + 3$: $g(5) = -20 + 3 = -17$. Keep the signs: a negative times a positive is negative, and subtracting a number makes the result more negative.",
      "求一次函数的值时，把 $x$ 换成输入，乘斜率，再加上常数。对 $g(x) = -4x + 3$：$g(5) = -20 + 3 = -17$。注意符号：负数乘正数得负数，减去一个数会使结果更小。",
    ),
    hardTip: t(
      "A difference of outputs does not need both values. The constant cancels, so $f(a) - f(b) = m(a - b)$ for slope $m$. For $g(x) = -4x + 3$: $g(9) - g(6) = -4(3) = -12$. You can also compute both outputs and subtract, watching the order and the two negatives.",
      "求输出之差不必算出两个值。常数相互抵消，所以对斜率 $m$，有 $f(a) - f(b) = m(a - b)$。对 $g(x) = -4x + 3$：$g(9) - g(6) = -4(3) = -12$。也可以算出两个输出再相减，要注意顺序和两个负号。",
    ),
  },
  "sat-exam-working-with-function-composition": {
    tip: t(
      "In $f(g(a))$, work from the inside out: compute $g(a)$ first, then use that result as the input to $f$. With $f(x) = 2x + 1$ and $g(x) = x - 4$: $g(7) = 3$ and $f(3) = 7$. Doing the outer function first, $g(f(7))$, is a different calculation and gives a distractor.",
      "在 $f(g(a))$ 中，从里到外计算：先算 $g(a)$，再把结果作为 $f$ 的输入。设 $f(x) = 2x + 1$、$g(x) = x - 4$：$g(7) = 3$，$f(3) = 7$。先算外层，即 $g(f(7))$，是另一种运算，会得到干扰项。",
    ),
    hardTip: t(
      "For an algebraic composition, replace every $x$ in the outer function with the inner expression in parentheses, then distribute and combine. With $f(x) = 2x + 1$ and $g(x) = 3x - 4$: $f(g(x)) = 2(3x - 4) + 1 = 6x - 7$. Multiplying the two rules together is not composition.",
      "代数形式的复合，要把外层函数中的每个 $x$ 换成带括号的内层表达式，再分配并合并。设 $f(x) = 2x + 1$、$g(x) = 3x - 4$：$f(g(x)) = 2(3x - 4) + 1 = 6x - 7$。把两个函数式相乘并不是复合。",
    ),
  },
  "sat-exam-identifying-tables-corresponding-to-linear-functions": {
    tip: t(
      "To match a table to an equation, substitute two or three inputs and compare the outputs, row by row. For $y = 2x - 5$: at $x = 1$, $y = -3$; at $x = 2$, $y = -1$. A wrong table may have the correct pattern of change but a shifted start, so one row alone may not be enough.",
      "把表格与方程对应时，代入两三个输入，逐行比较输出。对 $y = 2x - 5$：$x = 1$ 时 $y = -3$；$x = 2$ 时 $y = -1$。错误的表格可能变化规律正确但起点错位，所以只看一行可能不够。",
    ),
    hardTip: t(
      "When the inputs are unevenly spaced, the outputs do not change by equal steps, so do not judge by consecutive differences. Instead test each row in the equation, especially the later ones. For $y = 2x - 5$: inputs $1, 3, 7$ must give $-3, 1, 9$. A table that matches at the beginning can go wrong at the end.",
      "输入间隔不均匀时，输出的变化也不相等，所以不能凭相邻差判断。应当把每一行都代入方程检验，特别是后面几行。对 $y = 2x - 5$：输入 $1, 3, 7$ 应得到 $-3, 1, 9$。开头相符的表格，到后面也可能出错。",
    ),
  },
  "sat-exam-identifying-linear-functions-corresponding-to-tables": {
    tip: t(
      "Find the slope from the change in output per unit of input, then get the intercept from any row: $b = y - mx$. If the table runs $(2, 1), (3, 3), (4, 5)$, the slope is $2$ and $b = 1 - 4 = -3$, so $f(x) = 2x - 3$. Beware of subtracting a negative in the last step.",
      "用每单位输入的输出变化求斜率，再用任一行求截距：$b = y - mx$。若表中为 $(2, 1), (3, 3), (4, 5)$，斜率是 $2$，$b = 1 - 4 = -3$，所以 $f(x) = 2x - 3$。最后一步减去负数时要当心。",
    ),
    hardTip: t(
      "If the inputs jump by different amounts, divide the output change by the input change rather than reading the difference between adjacent outputs. For rows $(1, 5)$ and $(4, 14)$: the slope is $\\frac{9}{3} = 3$, then $b = 5 - 3 = 2$, so $f(x) = 3x + 2$. Treating the output difference as the slope is the trap.",
      "输入的跳跃不一致时，要用输出变化除以输入变化，而不是直接读相邻输出之差。对 $(1, 5)$ 和 $(4, 14)$ 两行：斜率是 $\\frac{9}{3} = 3$，再得 $b = 5 - 3 = 2$，所以 $f(x) = 3x + 2$。把输出之差当成斜率就落入了陷阱。",
    ),
  },
  "sat-exam-analyzing-functions-in-tabular-form": {
    tip: t(
      "To extend a linear table, note the output change per step of input and keep applying it from the last row. If $f$ goes $4, 7, 10, 13$ for inputs $1, 2, 3, 4$, then $f(6) = 13 + 2(3) = 19$. The trap is counting the wrong number of steps past the table's end.",
      "要延伸一次函数的表格，找出输入每走一步时输出的变化，再从最后一行继续。若输入 $1, 2, 3, 4$ 对应 $f$ 值 $4, 7, 10, 13$，则 $f(6) = 13 + 2(3) = 19$。陷阱是把表格之后的步数数错。",
    ),
    hardTip: t(
      "To find which input gives an output, build the equation: compute the slope using two rows, find the intercept, set $mx + b$ equal to the target, and solve. If rows $(1, 4)$ and $(3, 10)$ apply, $f(x) = 3x + 1$, and $f(x) = 31$ at $x = 10$. Uneven inputs make shortcuts by steps unreliable.",
      "要找出哪个输入给出某个输出，就建立方程：用两行求斜率，求截距，令 $mx + b$ 等于目标值再求解。若有 $(1, 4)$ 和 $(3, 10)$ 两行，则 $f(x) = 3x + 1$，$f(x) = 31$ 时 $x = 10$。输入不均匀时，按步数估算并不可靠。",
    ),
  },
  "sat-exam-function-tables-containing-unknown-parameters": {
    tip: t(
      "A linear function changes by equal amounts over equal steps. With evenly spaced inputs, find the constant step from two known neighbours and apply it to reach the blank. If the outputs are $6, 11, k, 21$ for consecutive inputs, the step is $5$, so $k = 16$. Check that the next known value also fits.",
      "一次函数在相等的步长上变化量相等。输入间隔均匀时，用相邻的两个已知值求出固定步长，再推到空白处。若连续输入对应的输出为 $6, 11, k, 21$，步长是 $5$，所以 $k = 16$。再检验下一个已知值是否也吻合。",
    ),
    hardTip: t(
      "If the inputs are unevenly spaced, a fixed output step does not exist, so compute the slope as output change over input change. Then multiply by the input gap to the blank. With $(2, 7)$, $(4, 13)$ and $(9, k)$: the slope is $3$, and five more inputs add $15$, so $k = 28$.",
      "输入间隔不均匀时，不存在固定的输出步长，所以要用输出变化除以输入变化求斜率，再乘到空白处的输入差。对 $(2, 7)$、$(4, 13)$ 和 $(9, k)$：斜率是 $3$，输入再加 $5$ 时输出增加 $15$，所以 $k = 28$。",
    ),
  },
  "sat-exam-interpreting-coefficients-of-lines-in-slope-intercept-form": {
    tip: t(
      "In $y = mx + b$, the constant $b$ is the output when $x = 0$, so in a story it is the amount at the start, in the output's units. In $y = 5x + 40$ for a stack of books over days, $40$ is the number of books at the outset. It is not a per-day change; that is $m$.",
      "在 $y = mx + b$ 中，常数 $b$ 是 $x = 0$ 时的输出，所以在情境中它是起始量，单位与输出相同。在书堆随天数变化的 $y = 5x + 40$ 中，$40$ 是一开始的书数。它不是每天的变化量，后者是 $m$。",
    ),
    hardTip: t(
      "The slope is the change in $y$ per unit of $x$, so the change over several units is the slope times their number. For $y = 5x + 40$, over $6$ days $y$ changes by $30$. A rising line gives a positive change. Adding the constant $b$ gives a final amount, which is not what is asked.",
      "斜率是 $x$ 每变化一个单位时 $y$ 的变化量，所以几个单位上的总变化就是斜率乘单位数。对 $y = 5x + 40$，$6$ 天内 $y$ 变化 $30$。上升的直线变化量为正。再加上常数 $b$ 得到的是最终的量，不是题目所问。",
    ),
  },
  "sat-exam-finding-equations-of-lines-using-slopes-and-points": {
    tip: t(
      "Start from $y = mx + b$ with the given slope, substitute the point's coordinates, and solve for $b$. For slope $3$ through $(2, 1)$: $1 = 3(2) + b$, so $b = -5$ and $y = 3x - 5$. Substituting the coordinates in swapped positions is a typical cause of error.",
      "从带已知斜率的 $y = mx + b$ 出发，代入点的坐标，解出 $b$。斜率为 $3$、过 $(2, 1)$ 时：$1 = 3(2) + b$，所以 $b = -5$，$y = 3x - 5$。把坐标代反是常见的错因。",
    ),
    hardTip: t(
      "With two points, first find the slope, $m = \\frac{y_2 - y_1}{x_2 - x_1}$, keeping the order the same on top and bottom. Then use either point to find $b$. Through $(1, 2)$ and $(3, 8)$: $m = 3$, and $2 = 3 + b$ gives $b = -1$, so $y = 3x - 1$.",
      "已知两点时，先求斜率 $m = \\frac{y_2 - y_1}{x_2 - x_1}$，分子分母的顺序要一致。再用任一点求 $b$。过 $(1, 2)$ 和 $(3, 8)$：$m = 3$，由 $2 = 3 + b$ 得 $b = -1$，所以 $y = 3x - 1$。",
    ),
  },
  "sat-exam-graphs-of-linear-equations-in-slope-intercept-form": {
    tip: t(
      "Read two facts from $y = mx + b$. A negative $m$ means the line falls from left to right, and a positive one means it rises. The value $b$ tells where it crosses the $y$-axis: above the origin when positive, below when negative. So $y = 3x - 2$ rises and crosses below the origin.",
      "从 $y = mx + b$ 读出两件事。$m$ 为负表示直线从左到右下降，为正表示上升。$b$ 说明它与 $y$ 轴的交点：为正在原点上方，为负在原点下方。所以 $y = 3x - 2$ 上升，并在原点下方与 $y$ 轴相交。",
    ),
    hardTip: t(
      "Shifting a line vertically changes only $b$: up by $d$ adds $d$ to the constant, and the slope stays. Write the new equation, then substitute the point's $x$-coordinate. Shifting $y = 3x - 2$ up $5$ gives $y = 3x + 3$, whose value at $x = 2$ is $9$. Do not change the input by the shift.",
      "直线竖直平移只改变 $b$：向上移 $d$，常数就加 $d$，斜率不变。写出新方程，再代入点的 $x$ 坐标。把 $y = 3x - 2$ 上移 $5$，得 $y = 3x + 3$，它在 $x = 2$ 处的值是 $9$。不要用平移量去改变输入。",
    ),
  },
  "sat-exam-constructing-and-analyzing-slope-intercept-equations": {
    tip: t(
      "To read a slope from $ax + by = c$, solve for $y$: move the $x$ term across, then divide every term by $y$'s coefficient. The number multiplying $x$ is the slope. For $4x + 5y = 20$: $y = -\\frac{4}{5}x + 4$. The sign flips on moving across; forgetting that is the common wrong answer.",
      "要从 $ax + by = c$ 读出斜率，就解出 $y$：把 $x$ 项移过去，再把每一项除以 $y$ 的系数，$x$ 前的数就是斜率。对 $4x + 5y = 20$：$y = -\\frac{4}{5}x + 4$。移项时符号改变，忘了这一点就会得到常见的错误答案。",
    ),
    hardTip: t(
      "The $y$-intercept occurs where $x = 0$, so delete the $x$ term and solve what remains. For $4x + 5y = 20$: $5y = 20$, so $y = 4$. The right-hand number alone is not the intercept unless $y$'s coefficient is $1$; dividing by that coefficient is the required step.",
      "$y$ 轴截距出现在 $x = 0$ 处，所以去掉 $x$ 项，解剩下的部分。对 $4x + 5y = 20$：$5y = 20$，所以 $y = 4$。除非 $y$ 的系数为 $1$，否则右边的数本身并不是截距；必须除以这个系数。",
    ),
  },
  "sat-exam-properties-of-lines-given-in-standard-or-general-form": {
    tip: t(
      "The $x$-intercept is where a line meets the horizontal axis, so set $y = 0$ and solve; write the result as a point with zero second coordinate. For $5x + 2y = 30$: $5x = 30$, so the point is $(6, 0)$. Swapping the coordinates, or setting $x = 0$, gives the wrong point.",
      "$x$ 轴截距是直线与水平轴的交点，所以令 $y = 0$ 并求解，结果写成第二个坐标为零的点。对 $5x + 2y = 30$：$5x = 30$，所以这个点是 $(6, 0)$。把坐标写反，或者令 $x = 0$，都会得到错误的点。",
    ),
    hardTip: t(
      "A line crossing both axes forms a right triangle with them. The two intercepts are its legs, so find each one, by setting $y = 0$ and then $x = 0$, and compute $\\frac{1}{2} \\cdot \\text{base} \\cdot \\text{height}$. For $5x + 2y = 30$: legs $6$ and $15$, area $45$. Forgetting the $\\frac{1}{2}$ is the trap.",
      "与两坐标轴都相交的直线和它们围成一个直角三角形。两个截距就是直角边，所以分别令 $y = 0$ 和 $x = 0$ 求出它们，再算 $\\frac{1}{2} \\cdot \\text{base} \\cdot \\text{height}$（底乘高的一半）。对 $5x + 2y = 30$：直角边为 $6$ 和 $15$，面积为 $45$。忘了 $\\frac{1}{2}$ 就落入陷阱。",
    ),
  },
  "sat-exam-analyzing-linear-equations-in-general-form": {
    tip: t(
      "The slope of $ax + by = c$ depends only on the ratio of $a$ to $b$. A parallel line has both coefficients scaled by the same number, while its constant must not scale by that number, or it would be the same line. For $2x + 5y = 7$, the line $4x + 10y = 9$ qualifies, but $4x + 10y = 14$ does not.",
      "$ax + by = c$ 的斜率只取决于 $a$ 与 $b$ 之比。平行线的两个系数按同一倍数放大，而常数不能按这个倍数放大，否则就是同一条直线。对 $2x + 5y = 7$，直线 $4x + 10y = 9$ 符合，$4x + 10y = 14$ 则不符合。",
    ),
    hardTip: t(
      "You need not find each $y$-coordinate. Since a line's slope equals rise over run, the change in $y$ between two points is the slope times the change in $x$. For $2x + 5y = 7$, the slope is $-\\frac{2}{5}$, and moving right by $5$ lowers $y$ by $2$, so the earlier $y$ minus the later one is $2$. Watch the order of subtraction.",
      "不必求出每个 $y$ 坐标。斜率等于纵向变化除以横向变化，所以两点间 $y$ 的变化等于斜率乘 $x$ 的变化。对 $2x + 5y = 7$，斜率是 $-\\frac{2}{5}$，向右移 $5$ 时 $y$ 减少 $2$，所以前一个 $y$ 减后一个 $y$ 等于 $2$。注意相减的顺序。",
    ),
  },
  "sat-exam-constructing-linear-functions-using-slope-intercept-form": {
    tip: t(
      "The value at zero is the intercept, because $f(0) = b$. Use the other pair to find the slope: output change over input change. If $f(0) = 4$ and $f(3) = 13$, then $b = 4$, $m = \\frac{9}{3} = 3$, and $f(x) = 3x + 4$. Dividing by the wrong gap is the usual slip.",
      "零处的值就是截距，因为 $f(0) = b$。再用另一组数求斜率：输出变化除以输入变化。若 $f(0) = 4$、$f(3) = 13$，则 $b = 4$，$m = \\frac{9}{3} = 3$，$f(x) = 3x + 4$。除错了间隔是常见的疏漏。",
    ),
    hardTip: t(
      "Without the value at zero, get the slope from the two points, then walk back along the line to $x = 0$: $f(0) = f(a) - ma$. If $f(2) = 7$ and $f(6) = 19$: $m = 3$, so $f(0) = 7 - 6 = 1$. Be careful with signs when the slope is negative, since subtracting a negative adds.",
      "没有零处的值时，先由两点求斜率，再沿直线退回到 $x = 0$：$f(0) = f(a) - ma$。若 $f(2) = 7$、$f(6) = 19$：$m = 3$，所以 $f(0) = 7 - 6 = 1$。斜率为负时要注意符号，减去负数等于加。",
    ),
  },
  "sat-exam-parallel-lines": {
    tip: t(
      "Parallel lines have equal slopes. If the given line is in the form $ax + by = c$, rewrite it as $y = -\\frac{a}{b}x + \\frac{c}{b}$ and read the slope. For $4x + 7y = 21$, the slope is $-\\frac{4}{7}$, which any parallel line shares. A perpendicular's reciprocal, or a dropped minus sign, gives the wrong options.",
      "平行线的斜率相等。若给定直线形如 $ax + by = c$，把它改写成 $y = -\\frac{a}{b}x + \\frac{c}{b}$ 并读出斜率。对 $4x + 7y = 21$，斜率是 $-\\frac{4}{7}$，所有平行线都是这个斜率。错误选项来自取了垂线的倒数，或者丢了负号。",
    ),
    hardTip: t(
      "A parallel line has the known slope but a new intercept, so substitute its given point into $y = mx + b$ and solve for $b$. Parallel to $x + 2y = 5$ through $(4, 1)$: slope $-\\frac{1}{2}$, and $1 = -2 + b$ gives $b = 3$. The original line's intercept does not carry over.",
      "平行线斜率已知但截距不同，所以把给定的点代入 $y = mx + b$，解出 $b$。与 $x + 2y = 5$ 平行且过 $(4, 1)$ 时：斜率为 $-\\frac{1}{2}$，由 $1 = -2 + b$ 得 $b = 3$。原直线的截距不能照搬。",
    ),
  },
  "sat-exam-slopes-of-perpendicular-lines": {
    tip: t(
      "Slopes of perpendicular lines multiply to $-1$, so flip the fraction and change the sign. The perpendicular slope to $\\frac{5}{4}$ is $-\\frac{4}{5}$, and to $-3$ it is $\\frac{1}{3}$. Doing only one of the two steps, the reciprocal or the sign, produces the tempting wrong choices.",
      "互相垂直的直线斜率之积为 $-1$，所以把分数倒过来并改变符号。与 $\\frac{5}{4}$ 垂直的斜率是 $-\\frac{4}{5}$，与 $-3$ 垂直的斜率是 $\\frac{1}{3}$。只做倒数或只改符号，就会得到诱人的错误选项。",
    ),
    hardTip: t(
      "If the line is in the form $ax - by = c$, first solve for $y$ to get its slope, then take the negative reciprocal. For $5x - 3y = 4$: $y = \\frac{5}{3}x - \\frac{4}{3}$, so the perpendicular slope is $-\\frac{3}{5}$. Mind the minus in front of $y$, which changes the sign of the slope.",
      "直线形如 $ax - by = c$ 时，先解出 $y$ 得到斜率，再取负倒数。对 $5x - 3y = 4$：$y = \\frac{5}{3}x - \\frac{4}{3}$，所以垂线斜率是 $-\\frac{3}{5}$。注意 $y$ 前面的负号，它会改变斜率的符号。",
    ),
  },
  "sat-exam-perpendicular-lines": {
    tip: t(
      "To write a perpendicular line, take the negative reciprocal of the given slope, substitute the point in $y = mx + b$ and solve for $b$. Perpendicular to $y = 2x + 7$ through $(6, 1)$: the slope is $-\\frac{1}{2}$ and $1 = -3 + b$, so $y = -\\frac{1}{2}x + 4$. The old intercept is irrelevant.",
      "写垂线方程时，取已知斜率的负倒数，把点代入 $y = mx + b$，解出 $b$。与 $y = 2x + 7$ 垂直且过 $(6, 1)$ 时：斜率为 $-\\frac{1}{2}$，$1 = -3 + b$，所以 $y = -\\frac{1}{2}x + 4$。原来的截距没有关系。",
    ),
    hardTip: t(
      "A point $(0, c)$ is the $y$-intercept, so $c$ is the same as $b$. Move along the perpendicular line from its known point to $x = 0$: the change in $y$ is the slope times the change in $x$. From $(6, 1)$ with slope $-\\frac{1}{2}$, a run of $-6$ adds $3$, so $c = 4$.",
      "点 $(0, c)$ 是 $y$ 轴上的点，所以 $c$ 就是 $b$。沿垂线从已知点移到 $x = 0$：$y$ 的变化等于斜率乘 $x$ 的变化。从 $(6, 1)$ 出发，斜率为 $-\\frac{1}{2}$，横向移动 $-6$ 时增加 $3$，所以 $c = 4$。",
    ),
  },
  "sat-exam-modeling-with-linear-functions": {
    tip: t(
      "Substitute the number of time units into the function, multiply by the rate, and add the start. For a bank balance $f(x) = 150 + 6x$ after $x$ weeks, the balance after $9$ weeks is $150 + 54 = 204$. Using only the rate times time, without the start, gives the amount gained.",
      "把时间单位数代入函数，乘变化率，再加初始值。对 $x$ 周后的存款 $f(x) = 150 + 6x$，$9$ 周后的余额是 $150 + 54 = 204$。只算变化率乘时间而不加初始值，得到的只是增加量。",
    ),
    hardTip: t(
      "Here the output is known and the time is not. Set the function equal to the value, subtract the start, then divide by the rate. For $f(x) = 150 + 6x$ and value $210$: $6x = 60$, so $x = 10$. Dividing the whole value by the rate ignores the start, and that is a tempting mistake.",
      "这里输出已知，时间未知。令函数等于这个值，减去初始值，再除以变化率。对 $f(x) = 150 + 6x$，值为 $210$ 时：$6x = 60$，所以 $x = 10$。把整个值除以变化率就忽略了初始值，这是个诱人的错误。",
    ),
  },
  "sat-exam-constructing-models-using-linear-functions": {
    tip: t(
      "A start plus a constant change per unit has the form $f(x) = \\text{start} + \\text{rate} \\cdot x$. A tree $80$ centimeters tall that grows $6$ per month gives $f(x) = 80 + 6x$. Options that multiply start and rate together, or attach $x$ to the start, misread the description.",
      "初始值加每单位固定变化量，形式就是 $f(x) = \\text{start} + \\text{rate} \\cdot x$（初始值加上变化率乘以 $x$）。一棵 $80$ 厘米高、每月长 $6$ 厘米的树，就是 $f(x) = 80 + 6x$。把初始值和变化率相乘，或把 $x$ 放在初始值上的选项，都误读了描述。",
    ),
    hardTip: t(
      "With two later measurements, the start is not given. Divide the change in value by the elapsed time to get the rate, and then go back to time zero by subtracting the rate times the first time. For $104$ at $x = 4$ and $116$ at $x = 6$: rate $6$, start $80$. Using the first measured value as the start is wrong.",
      "只有后来的两次测量时，初始值并未给出。用数值变化除以经过的时间求变化率，再回推到时间零：减去变化率乘第一次的时间。$x = 4$ 时为 $104$，$x = 6$ 时为 $116$：变化率是 $6$，初始值是 $80$。把第一次测量值当成初始值是错的。",
    ),
  },
  "sat-exam-further-constructing-models-using-linear-functions": {
    tip: t(
      "When the rate's unit differs from the variable's, convert first. A pump moving $3$ liters per minute, with time $h$ in hours, moves $180$ liters per hour. With $50$ liters already moved, $P(h) = 50 + 180h$. Options keeping $3h$ mix units, so they are too small by a factor of $60$.",
      "变化率的单位与变量的单位不同时，要先换算。水泵每分钟抽 $3$ 升，时间 $h$ 以小时计，则每小时抽 $180$ 升。已抽 $50$ 升时，$P(h) = 50 + 180h$。保留 $3h$ 的选项混用了单位，小了 $60$ 倍。",
    ),
    hardTip: t(
      "With a mix of minutes and hours, turn everything into the rate's unit, add the times, and then multiply by the rate; finally add the amount already done. A pump at $3$ liters per minute for $20$ minutes and a further $1$ hour runs $80$ minutes, moving $240$ liters; with $50$ earlier, $290$ in all.",
      "分钟和小时混在一起时，全部换算成变化率的单位，把时间相加，再乘变化率，最后加上已完成的量。水泵每分钟 $3$ 升，先运行 $20$ 分钟再运行 $1$ 小时，共 $80$ 分钟，抽 $240$ 升；加上之前的 $50$ 升，一共 $290$ 升。",
    ),
  },
  "sat-exam-interpreting-coefficients-of-linear-functions-in-context": {
    tip: t(
      "The coefficient of $x$ is the change in output for each extra unit of input, carrying the units of output per input. In $f(x) = 8x + 25$ for a pile of coins after $x$ days, the $8$ is how many coins are added each day. It is not the initial pile, which is the constant.",
      "$x$ 的系数是输入每增加一个单位时输出的变化，单位是“输出每输入”。在 $x$ 天后硬币堆的模型 $f(x) = 8x + 25$ 中，$8$ 是每天增加的硬币数。它不是最初的数量，那是常数项。",
    ),
    hardTip: t(
      "A difference such as $f(a + 1) - f(a)$ compares consecutive inputs, so it is the change during one unit of time. For a linear function, that equals the slope, wherever you begin. With $f(x) = 8x + 25$, the difference $f(7) - f(6)$ is the gain during one day, namely $8$, and not a total.",
      "像 $f(a + 1) - f(a)$ 这样的差比较的是相邻的输入，所以它是一个时间单位内的变化。对一次函数，无论从哪里开始，它都等于斜率。对 $f(x) = 8x + 25$，$f(7) - f(6)$ 是一天内的增加量，即 $8$，而不是总量。",
    ),
  },
  "sat-exam-interpreting-graphs-of-linear-functions": {
    tip: t(
      "The point where a line crosses the vertical axis has $x = 0$, so in context it is the value at the very start of the process. For a line of a tank's fuel against days, with crossing $(0, 60)$, there are $60$ units of fuel at day zero. It is not a rate of change.",
      "直线与竖轴的交点满足 $x = 0$，所以在情境中它表示过程刚开始时的值。对油箱燃料随天数变化的直线，若交点是 $(0, 60)$，则第零天有 $60$ 个单位的燃料。它不是变化率。",
    ),
    hardTip: t(
      "If the crossing is not shown, compute it from two points. Find the slope, then step back from the first point to $x = 0$ by subtracting slope times its $x$-coordinate. Through $(2, 68)$ and $(6, 84)$: the slope is $4$, and the value at $x = 0$ is $68 - 8 = 60$.",
      "如果图上没有直接给出交点，就用两点来算。先求斜率，再从第一个点退回到 $x = 0$：减去斜率乘它的 $x$ 坐标。过 $(2, 68)$ 和 $(6, 84)$ 时：斜率是 $4$，$x = 0$ 时的值为 $68 - 8 = 60$。",
    ),
  },
  "sat-exam-modeling-using-slope-intercept-form": {
    tip: t(
      "Identify the start and the change per unit, then decide the sign: a quantity that shrinks has a negative slope. A pencil $190$ millimeters long losing $5$ per week gives $y = 190 - 5x$. The start is the constant, and $x$ goes with the rate. A plus sign would have the pencil grow.",
      "找出起始量和每单位的变化，再确定符号：减少的量斜率为负。一支 $190$ 毫米长的铅笔每周减少 $5$ 毫米，就是 $y = 190 - 5x$。起始量是常数，$x$ 配变化率。若写成加号，铅笔反而变长了。",
    ),
    hardTip: t(
      "Set the model equal to the target amount and solve for time: subtract the target from the start, then divide by the rate. For $y = 190 - 5x$ and a length of $40$: $5x = 150$, so $x = 30$. Dividing the target by the rate, or the start by the rate, ignores what was already used.",
      "令模型等于目标量，求时间：用起始量减去目标量，再除以变化率。对 $y = 190 - 5x$，长度为 $40$ 时：$5x = 150$，所以 $x = 30$。用目标量或起始量直接除以变化率，都忽略了实际减少的部分。",
    ),
  },
  "sat-exam-solving-simple-systems-of-linear-equations": {
    tip: t(
      "If one equation already gives $y$, substitute that expression for $y$ in the other, in parentheses, and solve for $x$. Then return for $y$. For $y = x + 4$ and $2x + y = 10$: $3x + 4 = 10$, so $x = 2$ and $y = 6$. A solution is the ordered pair, so check the order.",
      "一个方程已经给出 $y$ 时，把这个表达式加括号代入另一个方程，解出 $x$，再回头求 $y$。对 $y = x + 4$ 和 $2x + y = 10$：$3x + 4 = 10$，所以 $x = 2$，$y = 6$。解是有序数对，注意顺序。",
    ),
    hardTip: t(
      "To get a combination such as $x + y$, solve for both variables by substitution and then combine them. For $y = x + 4$ and $2x + y = 10$, you find $x = 2$ and $y = 6$, so $x + y = 8$. Answering with one variable only is the classic error.",
      "要求 $x + y$ 这样的组合，先用代入法求出两个变量，再组合。对 $y = x + 4$ 和 $2x + y = 10$，得 $x = 2$、$y = 6$，所以 $x + y = 8$。只回答一个变量是典型错误。",
    ),
  },
  "sat-exam-identifying-structure-in-systems-of-linear-equations": {
    tip: t(
      "If the coefficients swap between equations, adding them makes $x$ and $y$ share a coefficient. Then divide to reach $x + y$. For $2x + 3y = 7$ and $3x + 2y = 8$: $5x + 5y = 15$, so $x + y = 3$. You never need the individual values.",
      "如果两个方程的系数对调，相加后 $x$ 和 $y$ 的系数就相同，再相除就得到 $x + y$。对 $2x + 3y = 7$ 和 $3x + 2y = 8$：$5x + 5y = 15$，所以 $x + y = 3$。完全不必求出每个变量的值。",
    ),
    hardTip: t(
      "Subtracting the equations, rather than adding, leaves a multiple of $x - y$. Subtract so that $x$ stays positive and then divide. For $2x + 3y = 7$ and $3x + 2y = 8$: second minus first gives $x - y = 1$. Reversing the order would give the opposite sign, so note which equation comes first.",
      "把两个方程相减而不是相加，就剩下 $x - y$ 的倍数。相减时让 $x$ 的系数为正，再相除。对 $2x + 3y = 7$ 和 $3x + 2y = 8$：用第二个减第一个得 $x - y = 1$。顺序反了符号就相反，要留意谁减谁。",
    ),
  },
  "sat-exam-solving-systems-of-equations-using-addition-or-subtraction": {
    tip: t(
      "If one variable has opposite coefficients in the two equations, adding them cancels it. Then solve the single equation that remains. For $2x + 5y = 1$ and $3x - 5y = 19$: $5x = 20$, so $x = 4$. Check the signs first, since opposites are added, not subtracted.",
      "如果某个变量在两个方程中系数相反，相加就能消去它，再解剩下的方程。对 $2x + 5y = 1$ 和 $3x - 5y = 19$：$5x = 20$，所以 $x = 4$。先看符号，相反的系数要相加，而不是相减。",
    ),
    hardTip: t(
      "If a variable has identical coefficients, subtract one equation from the other to cancel it, subtracting every term. Then substitute the result to find the other variable. For $4x + 2y = 10$ and $3x + 2y = 7$: $x = 3$, then $9 + 2y = 7$, so $y = -1$. Remember that $y$ is what is requested.",
      "如果某个变量系数相同，就用一个方程减去另一个来消去它，每一项都要减。再把结果代入，求另一个变量。对 $4x + 2y = 10$ 和 $3x + 2y = 7$：$x = 3$，然后 $9 + 2y = 7$，所以 $y = -1$。记住题目要的是 $y$。",
    ),
  },
  "sat-exam-solving-systems-of-equations-using-elimination": {
    tip: t(
      "When coefficients do not line up, multiply one equation so a variable's coefficients match, then subtract. For $3x + 4y = 11$ and $x + y = 3$, multiply the second by $4$: $4x + 4y = 12$. Subtracting gives $x = 1$. Multiply every term, including the right side, or the answer will be off.",
      "系数对不上时，把一个方程乘一个数，使某个变量的系数相同，再相减。对 $3x + 4y = 11$ 和 $x + y = 3$，把第二个方程乘 $4$：$4x + 4y = 12$。相减得 $x = 1$。每一项都要乘，包括右边，否则答案就错了。",
    ),
    hardTip: t(
      "Sometimes both equations must be multiplied. Scale each so that one variable's coefficient becomes the least common multiple, then subtract. For $3x + 2y = 8$ and $2x + 3y = 7$, use $3$ and $2$: $9x + 6y = 24$ and $4x + 6y = 14$, so $5x = 10$ and $x = 2$. A result of zero can be correct.",
      "有时两个方程都要乘。分别放大，使某个变量的系数成为最小公倍数，再相减。对 $3x + 2y = 8$ 和 $2x + 3y = 7$，分别乘 $3$ 和 $2$：$9x + 6y = 24$，$4x + 6y = 14$，所以 $5x = 10$，$x = 2$。结果为零也可能是对的。",
    ),
  },
  "sat-exam-modeling-word-problems-with-systems-of-linear-equations": {
    tip: t(
      "A story with counts and money gives two equations: one that adds the counts, $x + y = n$, and one that adds price times count. For $30$ seats, at $8$ and $3$ dollars, raising $160$ dollars: $x + y = 30$ and $8x + 3y = 160$. Mixing prices into the count equation is the usual error.",
      "有数量也有金额的情境给出两个方程：一个把数量相加，$x + y = n$；一个把单价乘数量相加。$30$ 个座位，票价 $8$ 和 $3$ 美元，收入 $160$ 美元：$x + y = 30$，$8x + 3y = 160$。把单价写进数量方程是常见错误。",
    ),
    hardTip: t(
      "To solve the system, write $y = n - x$ from the count equation and substitute into the money equation. For $x + y = 30$ and $8x + 3y = 160$: $8x + 90 - 3x = 160$, so $5x = 70$ and $x = 14$. Make sure the answer describes the kind of item that the question names.",
      "解这个方程组时，由数量方程写出 $y = n - x$，代入金额方程。对 $x + y = 30$ 和 $8x + 3y = 160$：$8x + 90 - 3x = 160$，所以 $5x = 70$，$x = 14$。确认答案对应的是题目所问的那种物品。",
    ),
  },
  "sat-exam-solving-problems-with-systems-of-linear-equations": {
    tip: t(
      "Compare the two purchases. If one has exactly one more of an item and otherwise matches, the price of that item is the difference in totals. If not, multiply the equations to match one item, then subtract. For $4a + 3b = 25$ and $3a + 2b = 18$, doubling and tripling gives $a = 4$.",
      "比较两次购买。如果其中一次恰好多买了一件某物品，其余相同，那么差价就是这件物品的价格。否则就把方程放大，使某种物品的数量相同，再相减。对 $4a + 3b = 25$ 和 $3a + 2b = 18$，分别乘 $2$ 和 $3$ 后得 $a = 4$。",
    ),
    hardTip: t(
      "The total for one of each needs both prices. Find the first by comparing or eliminating, then substitute it into either purchase to find the second, and add. With $4a + 3b = 25$ and $3a + 2b = 18$: $a = 4$, then $b = 3$, so one of each costs $7$. Reporting a single price is the trap.",
      "各买一件的总价需要两个价格。先通过比较或消元求出一个，再代入任一次购买求出另一个，然后相加。对 $4a + 3b = 25$ 和 $3a + 2b = 18$：$a = 4$，$b = 3$，各买一件共 $7$ 美元。只回答一个价格就落入了陷阱。",
    ),
  },
  "sat-exam-solving-problems-with-systems-of-linear-equations-in-standard-form": {
    tip: t(
      "Look for a coefficient that is a simple multiple of its partner: multiply that equation so they match, then subtract. For $3x + 2y = 12$ and $7x + 4y = 26$, double the first and subtract: $x = 2$. Only one equation needs to be multiplied here, and all of its terms must be scaled.",
      "找一个恰好是另一方程对应系数简单倍数的系数：把方程相应放大，使它们相同，再相减。对 $3x + 2y = 12$ 和 $7x + 4y = 26$，把第一个乘 $2$ 再相减：$x = 2$。这里只需放大一个方程，但它的每一项都要乘。",
    ),
    hardTip: t(
      "A new expression such as $ax + by$ does not match either equation, so find both variables and substitute. For $3x + 2y = 12$ and $7x + 4y = 26$: $x = 2$ and $y = 3$, so $3x + 4y = 18$. Adjusting a given right-hand side by guesswork rarely gives the correct total.",
      "$ax + by$ 这样的新表达式与两个方程都不一致，所以要求出两个变量再代入。对 $3x + 2y = 12$ 和 $7x + 4y = 26$：$x = 2$，$y = 3$，所以 $3x + 4y = 18$。凭猜测调整右边的数很难得到正确结果。",
    ),
  },
  "sat-exam-the-intersection-of-two-lines": {
    tip: t(
      "Two lines meet where they share both coordinates. Set the right sides equal, solve for $x$, then substitute into either line for $y$. For $y = 2x + 1$ and $y = -x + 7$: $3x = 6$, so the point is $(2, 5)$. Check the other line, since a pair fitting only one line is a typical wrong option.",
      "两条直线的交点同时满足两个方程。令右边相等，解出 $x$，再代入任一直线求 $y$。对 $y = 2x + 1$ 和 $y = -x + 7$：$3x = 6$，交点是 $(2, 5)$。再用另一条直线检验，只满足一条直线的点是典型的错误选项。",
    ),
    hardTip: t(
      "Naming the intersection $(a, b)$ changes only the final step: find the point as usual and then evaluate the combination. For $y = 2x + 1$ and $y = -x + 7$, we have $a = 2$ and $b = 5$, so $a + b = 7$. Do not stop after finding $a$; this is what the distractors expect.",
      "把交点记作 $(a, b)$ 只改变最后一步：照常求出交点，再算所要的组合。对 $y = 2x + 1$ 和 $y = -x + 7$，$a = 2$、$b = 5$，所以 $a + b = 7$。不要求出 $a$ 就停下，干扰项等的就是这一步。",
    ),
  },
  "sat-exam-the-relationship-between-systems-of-linear-equations-and-graphs": {
    tip: t(
      "Compare slopes and intercepts to know how two lines relate. Different slopes mean they cross once; the same slope with different intercepts means parallel with no meeting point; both the same means one line. So $y = 3x - 1$ and $y = 3x + 4$ are parallel. The sign and size of intercepts matter only here.",
      "比较斜率和截距，就能判断两条直线的关系。斜率不同，交于一点；斜率相同而截距不同，平行且不相交；两者都相同，则是同一条直线。所以 $y = 3x - 1$ 和 $y = 3x + 4$ 平行。截距只在斜率相同时才起作用。",
    ),
    hardTip: t(
      "The solution of a graphed system is the crossing point of the lines. A horizontal line $y = c$ fixes the height, so substitute $c$ into the other equation and solve for $x$. For $y = 2$ and $y = 3x - 7$: $3x = 9$, so $x = 3$. Report the $x$-coordinate when that is what is asked.",
      "图像表示的方程组，其解就是两条直线的交点。水平线 $y = c$ 确定了高度，所以把 $c$ 代入另一个方程，解出 $x$。对 $y = 2$ 和 $y = 3x - 7$：$3x = 9$，所以 $x = 3$。题目问 $x$ 坐标时就回答它。",
    ),
  },
  "sat-exam-determining-the-number-of-solutions-to-a-linear-equation": {
    tip: t(
      "Simplify each side to the form $ax + b$ and compare. Different $x$ coefficients: exactly one solution. Same coefficients and different constants: none. Everything the same: infinitely many. For $2(x + 3) = 5x + 1$, the coefficients $2$ and $5$ differ, so one solution exists. No solving is needed.",
      "把两边都化简成 $ax + b$ 的形式再比较。$x$ 的系数不同：恰有一个解。系数相同而常数不同：无解。全都相同：无穷多解。对 $2(x + 3) = 5x + 1$，系数 $2$ 和 $5$ 不同，所以有一个解。不必真的求解。",
    ),
    hardTip: t(
      "With extra terms on one side, combine them after distributing, before comparing coefficients. For $4(x + 2) - 2x = 2x + 8$, the left side is $2x + 8$, so the two sides match and every $x$ works. Comparing before combining, or stopping at the first coefficient seen, leads to the wrong count.",
      "一边有多余的项时，要先去括号再合并，然后才比较系数。对 $4(x + 2) - 2x = 2x + 8$，左边是 $2x + 8$，两边完全相同，任何 $x$ 都成立。合并之前就比较，或者只看第一个系数，都会数错解的个数。",
    ),
  },
  "sat-exam-linear-equations-with-infinitely-many-solutions": {
    tip: t(
      "Infinitely many solutions means the two sides are the same expression. Distribute the left side and match its constant to the unknown. For $4(x + 2) = 4x + c$, the left side is $4x + 8$, so $c = 8$. Using the number inside the parentheses, without multiplying, is the distractor.",
      "无穷多解表示两边是同一个表达式。把左边展开，让它的常数与未知数对应。对 $4(x + 2) = 4x + c$，左边是 $4x + 8$，所以 $c = 8$。直接用括号里的数而不乘系数，就是干扰项。",
    ),
    hardTip: t(
      "With two unknowns, match both: the $x$ coefficient and the constant. Expand first, then compare, and combine as asked. For $2(5x + 3) = px + q$: $10x + 6$, so $p = 10$, $q = 6$ and $p + q = 16$. Multiplying only the first term inside the parentheses would give a wrong $q$.",
      "有两个未知数时，要同时对应 $x$ 的系数和常数。先展开再比较，然后按要求组合。对 $2(5x + 3) = px + q$：$10x + 6$，所以 $p = 10$，$q = 6$，$p + q = 16$。只乘括号内的第一项，$q$ 就错了。",
    ),
  },
  "sat-exam-linear-equations-with-no-solutions": {
    tip: t(
      "A linear equation has no solution when the $x$ coefficients on both sides match but the constants differ, since then the $x$ terms cancel and leave a false statement. For $2(x + 3) = cx + 9$: the left side is $2x + 6$, so $c = 2$. With a different $c$ there would be one solution.",
      "当两边 $x$ 的系数相同而常数不同时，一次方程无解，因为 $x$ 项抵消后剩下一个错误的等式。对 $2(x + 3) = cx + 9$：左边是 $2x + 6$，所以 $c = 2$。$c$ 取别的值时就会有一个解。",
    ),
    hardTip: t(
      "When the unknown multiplies a binomial, distribute it, set the $x$ coefficients equal, and then confirm the constants differ. For $12x + 5 = r(4x + 3)$: $12 = 4r$, so $r = 3$, and the constants $5$ and $9$ differ. If they had matched, the equation would have infinitely many solutions instead.",
      "未知数乘一个二项式时，先展开，令 $x$ 的系数相等，再确认常数不同。对 $12x + 5 = r(4x + 3)$：$12 = 4r$，所以 $r = 3$，常数 $5$ 和 $9$ 不同。如果常数相同，方程就会有无穷多解。",
    ),
  },
  "sat-exam-determining-the-number-of-solutions-to-a-linear-system": {
    tip: t(
      "Compare the two equations by their ratios. If one is an exact multiple of the other, right side included, they describe the same line, giving infinitely many solutions. If only the left sides are proportional, there is none; otherwise there is exactly one. So $x + 2y = 3$ and $4x + 8y = 12$ are the same line.",
      "用比例比较两个方程。如果一个方程恰是另一个的倍数（包括右边），它们就是同一条直线，有无穷多解。如果只有左边成比例，就无解；其他情况恰有一个解。所以 $x + 2y = 3$ 和 $4x + 8y = 12$ 是同一条直线。",
    ),
    hardTip: t(
      "If the equations are in different forms, rewrite one to match the other before comparing. Clear the fractions in $y = -\\frac{1}{2}x + \\frac{3}{2}$ to get $x + 2y = 3$; then $4x + 8y = 12$ is its multiple, so the lines coincide. Do not decide from appearances, since fractions can hide this relationship.",
      "两个方程形式不同时，要先把一个改写成与另一个相同的形式再比较。去掉 $y = -\\frac{1}{2}x + \\frac{3}{2}$ 的分母，得到 $x + 2y = 3$；而 $4x + 8y = 12$ 是它的倍数，所以两线重合。不要凭外观判断，分数会把这种关系藏起来。",
    ),
  },
  "sat-exam-linear-systems-with-infinitely-many-solutions": {
    tip: t(
      "Infinitely many solutions means the second equation is an exact multiple of the first. Find the multiplier from a matching pair of coefficients, then apply it to the right side. For $2x + 5y = 7$ and $6x + 15y = q$, the multiplier is $3$, so $q = 21$. Any other value would make the lines parallel.",
      "无穷多解表示第二个方程恰是第一个的倍数。由一对对应系数求出倍数，再用到右边。对 $2x + 5y = 7$ 和 $6x + 15y = q$，倍数是 $3$，所以 $q = 21$。取其他值时，两条直线就平行了。",
    ),
    hardTip: t(
      "With two unknowns, use the one complete pair of coefficients to fix the multiplier, then apply it to everything else. For $2x + 5y = 7$ and $px + 20y = q$, the $y$ terms show the multiplier $4$, so $p = 8$ and $q = 28$, adding to $36$. Do not estimate $p$ and $q$ separately.",
      "有两个未知数时，用唯一完整的一对系数确定倍数，再用到其他各项。对 $2x + 5y = 7$ 和 $px + 20y = q$，$y$ 项表明倍数是 $4$，所以 $p = 8$，$q = 28$，和为 $36$。不要分别去估计 $p$ 和 $q$。",
    ),
  },
  "sat-exam-parametrizing-systems-of-linear-equations": {
    tip: t(
      "A system with infinitely many solutions is really one line, so keep one equation and solve for $y$. Then let $x = t$ and write $y$ in terms of $t$. For $y - 2x = 5$ and $3y - 6x = 15$: $y = 2x + 5$, so the solutions are $(t, 2t + 5)$. Keep the coordinates in order.",
      "有无穷多解的方程组实际上是一条直线，所以留下一个方程，解出 $y$。再令 $x = t$，用 $t$ 表示 $y$。对 $y - 2x = 5$ 和 $3y - 6x = 15$：$y = 2x + 5$，解是 $(t, 2t + 5)$。注意坐标的顺序。",
    ),
    hardTip: t(
      "The parametrized form $(t, mt + c)$ comes from the line $y = mx + c$. Read $c$ from the equation by solving for $y$, then put in the given first coordinate as $t$ to find the second. For $y - 2x = 5$, the point $(4, r)$ has $r = 2(4) + 5 = 13$. The unknown $c$ must not be skipped.",
      "参数形式 $(t, mt + c)$ 来自直线 $y = mx + c$。解出 $y$ 读出 $c$，再把给定的第一个坐标当作 $t$，求出第二个坐标。对 $y - 2x = 5$，点 $(4, r)$ 的 $r = 2(4) + 5 = 13$。未知的 $c$ 不能跳过。",
    ),
  },
  "sat-exam-linear-systems-with-no-solution": {
    tip: t(
      "No solution means parallel lines: the $x$ and $y$ coefficients are proportional, but the right sides are not. Use the known coefficient pair to find the multiplier, then apply it to the unknown coefficient. For $2x + 3y = 7$ and $px + 12y = 30$, the multiplier is $4$, so $p = 8$, and $30 \\neq 28$ confirms it.",
      "无解表示两线平行：$x$、$y$ 的系数成比例，但右边不成比例。用已知的一对系数求倍数，再用到未知系数上。对 $2x + 3y = 7$ 和 $px + 12y = 30$，倍数是 $4$，所以 $p = 8$，而 $30 \\neq 28$ 也印证了这一点。",
    ),
    hardTip: t(
      "If the unknown is the right-hand side and the left sides are already proportional, every value gives parallel lines, except the one value that would make the equations multiples. For $2x + 3y = 7$ and $6x + 9y = n$, any $n$ except $21$ works. Picking $n = 21$ gives the same line, the trap here.",
      "如果未知数在右边且左边已经成比例，那么除了使两方程成倍数的那个值，其他值都使两线平行。对 $2x + 3y = 7$ 和 $6x + 9y = n$，除 $21$ 外的任何 $n$ 都符合。这里的陷阱是选 $n = 21$，那样会得到同一条直线。",
    ),
  },
  "sat-exam-constructing-models-with-one-variable-linear-inequalities": {
    tip: t(
      'Add what is already there to the rate times the count, then choose the sign from the words: "at least" means $\\ge$ and "at most" means $\\le$. A team with $40$ dollars earning $5$ per ticket and hoping for at least $200$ gives $40 + 5n \\ge 200$. Choosing the sign from the verb alone misleads.',
      "把已有的量加上单价乘数量，再根据措辞选符号：“至少”是 $\\ge$，“至多”是 $\\le$。一支队伍已有 $40$ 美元，每张票赚 $5$ 美元，希望至少 $200$ 美元，就写成 $40 + 5n \\ge 200$。只看动词来选符号容易出错。",
    ),
    hardTip: t(
      "A capacity limit works the same way: the total load includes every part of the load, including any fixed weight, so add it to the variable part and compare to the maximum. A lift holding at most $900$ kilograms with a $70$ kilogram rider and $c$ crates of $20$ kilograms gives $70 + 20c \\le 900$.",
      "载重上限也是同样的道理：总载重包括所有部分，固定重量也要算，所以把它加到变化的部分上，再与上限比较。一台升降机最多载 $900$ 千克，有一名 $70$ 千克的操作员和 $c$ 个 $20$ 千克的箱子，就写成 $70 + 20c \\le 900$。",
    ),
  },
  "sat-exam-modeling-and-solving-with-one-variable-linear-inequalities": {
    tip: t(
      "Set up the budget inequality, solve as with an equation, and interpret the result in whole units. For a fee of $10$ dollars plus $4$ per day and a budget of $51$: $4d \\le 41$, so $d \\le 10.25$. Under a ceiling, round down, so the greatest whole number of days is $10$; rounding up exceeds the budget.",
      "列出预算不等式，像解方程一样求解，再按整数单位解释结果。费用为 $10$ 美元加每天 $4$ 美元、预算为 $51$ 时：$4d \\le 41$，所以 $d \\le 10.25$。有上限时要向下取整，最多 $10$ 天；向上取整就超出预算了。",
    ),
    hardTip: t(
      "With a goal to reach, the solved inequality is a minimum, and a fractional answer must be rounded up, even if the decimal is small, or the goal is missed. With $10$ dollars and $4$ per item, needing at least $51$: $n \\ge 10.25$, so at least $11$ items. Normal rounding to the nearest would fail.",
      "要达到某个目标时，解出的不等式给的是下限，分数答案必须向上取整，哪怕小数部分很小，否则就达不到目标。已有 $10$ 美元，每件赚 $4$ 美元，至少需要 $51$ 美元：$n \\ge 10.25$，所以至少 $11$ 件。按四舍五入是不行的。",
    ),
  },
  "sat-exam-modeling-and-solving-with-one-variable-linear-inequalities-advanced-cases": {
    tip: t(
      "To compare two plans, write the costs and set the one claimed cheaper below the other. Then solve and move to the next whole number. Plan A at $20$ plus $2$ per use and plan B at $4$ per use: $20 + 2n < 4n$, so $n > 10$ and the least is $11$. Equal cost does not count as less.",
      "比较两种方案时，写出费用，让被认为更便宜的那个小于另一个，解出后取下一个整数。方案 A 为 $20$ 加每次 $2$，方案 B 为每次 $4$：$20 + 2n < 4n$，所以 $n > 10$，最小是 $11$。费用相等不算更便宜。",
    ),
    hardTip: t(
      "What is already loaded shares the limit, so it must be included in the total before you divide. Then round down, because only whole objects can be added. With a limit of $100$, a load of $20$ and items of $9$: $20 + 9c \\le 100$, so $c \\le 8.88\\ldots$ and at most $8$ fit. Ignoring the existing load overcounts.",
      "已经装上的部分也占用上限，所以相除之前要把它算进总量。再向下取整，因为只能增加整件物品。上限 $100$、已装 $20$、每件 $9$ 时：$20 + 9c \\le 100$，所以 $c \\le 8.88\\ldots$，最多 $8$ 件。忽略已有的载重会多算。",
    ),
  },
  "sat-exam-compound-inequalities": {
    tip: t(
      "Apply each step to all three parts: subtract the constant from every part, then divide every part. For $5 < 2x + 1 < 13$: $2 < x < 6$. Then choose an option strictly inside. With strict signs, the endpoints themselves do not satisfy it, and they are often offered as distractors.",
      "每一步都作用到三个部分：每部分都减去常数，再每部分都相除。对 $5 < 2x + 1 < 13$：$2 < x < 6$。然后选严格落在其中的选项。不等号是严格的，端点本身不满足，而它们常常被设为干扰项。",
    ),
    hardTip: t(
      "To count integers, simplify to a range and count using $\\text{high} - \\text{low} + 1$ when both ends are included. For $5 \\le 2x + 1 \\le 15$: $2 \\le x \\le 7$, which holds $7 - 2 + 1 = 6$ integers. Simply subtracting forgets an endpoint, which is the classic off-by-one error.",
      "要数整数个数，先化简成一个范围，两端都包含时用 $\\text{high} - \\text{low} + 1$（上端减下端加一）。对 $5 \\le 2x + 1 \\le 15$：$2 \\le x \\le 7$，共 $7 - 2 + 1 = 6$ 个整数。只做减法就漏了一个端点，这是典型的差一错误。",
    ),
  },
  "sat-exam-constructing-models-with-compound-inequalities": {
    tip: t(
      "A quantity between two limits becomes $\\text{low} \\le s \\le \\text{high}$. The word inclusive means both endpoints are allowed, so both signs are $\\le$, with the variable in the middle. A temperature from $18$ to $25$ degrees inclusive gives $18 \\le T \\le 25$. Strict signs would exclude the limits.",
      "介于两个界限之间的量写成 $\\text{low} \\le s \\le \\text{high}$（$s$ 不小于下限，也不大于上限）。“包含端点”表示两端都可以取，所以两个符号都是 $\\le$，变量在中间。温度为 $18$ 到 $25$ 度（含端点）就是 $18 \\le T \\le 25$。严格不等号会把界限排除在外。",
    ),
    hardTip: t(
      "Here the bounded quantity is not the variable itself but the total spent, so build that expression first and place it in the middle. With at least $50$ and at most $70$ dollars, a fee of $20$ and items at $5$: $50 \\le 20 + 5n \\le 70$. Bounding $n$ directly with the money limits is the error.",
      "这里受限的不是变量本身，而是总花费，所以要先写出这个表达式，再放到中间。至少 $50$、至多 $70$ 美元，手续费 $20$，每件 $5$ 美元：$50 \\le 20 + 5n \\le 70$。直接用金额界限去限制 $n$ 是错的。",
    ),
  },
  "sat-exam-solutions-of-two-variable-linear-inequalities": {
    tip: t(
      "A point is a solution if substituting its coordinates makes the inequality true. Test each option, keeping $x$ and $y$ in their places. For $2x + 5y < 20$: $(1, 2)$ gives $12$, which works, while $(5, 3)$ gives $25$, which does not. Watch whether the sign is strict.",
      "把点的坐标代入后不等式成立，这个点就是解。逐个检验选项，注意 $x$ 和 $y$ 的位置。对 $2x + 5y < 20$：$(1, 2)$ 得 $12$，成立；$(5, 3)$ 得 $25$，不成立。注意不等号是否严格。",
    ),
    hardTip: t(
      "A point with one coordinate fixed reduces the inequality to one variable. Substitute $y = 0$, solve, and take the largest value allowed. For $4x + 3y \\le 20$: $4x \\le 20$, so $x \\le 5$. Because the sign includes equality, the boundary value is itself allowed here.",
      "固定一个坐标后，不等式就只剩一个变量。代入 $y = 0$，解出后取允许的最大值。对 $4x + 3y \\le 20$：$4x \\le 20$，所以 $x \\le 5$。由于不等号包含等号，这里边界值本身是可以取到的。",
    ),
  },
  "sat-exam-modeling-with-two-variable-linear-inequalities": {
    tip: t(
      'The total cost of two items is each price times its count, added together, and a budget gives "at most", so $\\le$. Books at $7$ dollars and pens at $3$ with a budget of $90$ give $7b + 3p \\le 90$. Check the letters: the price must attach to the correct item.',
      "两种物品的总费用是各自单价乘数量再相加，预算表示“至多”，所以用 $\\le$。书每本 $7$ 美元，笔每支 $3$ 美元，预算 $90$ 美元，就写成 $7b + 3p \\le 90$。检查字母：单价要配对应的物品。",
    ),
    hardTip: t(
      'Earnings with a goal use $\\ge$ for "at least". Extra facts, such as a minimum of hours in one job, are separate conditions, and they do not change the total\'s expression. Earning $9$ and $4$ dollars per hour with a goal of $100$ gives $9t + 4h \\ge 100$, however many hours are required at either job.',
      "有目标的收入用 $\\ge$ 表示“至少”。额外条件，比如某份工作的最低时长，是单独的条件，不会改变总收入的表达式。每小时分别赚 $9$ 和 $4$ 美元，目标 $100$ 美元，就写成 $9t + 4h \\ge 100$，无论哪份工作要求多少小时。",
    ),
  },
  "sat-exam-modeling-and-solving-two-variable-linear-inequalities": {
    tip: t(
      "Substitute the known count, subtract its cost from the budget, then divide by the other price, and round down for whole items. Books at $7$ dollars and pens at $3$, with $40$ dollars and $4$ books: $28 + 3p \\le 40$, so $p \\le 4$. Spending must not go over, so rounding up is not allowed.",
      "代入已知的数量，从预算中减去它的费用，再除以另一个单价，并向下取整。书每本 $7$ 美元，笔每支 $3$ 美元，有 $40$ 美元且买 $4$ 本书：$28 + 3p \\le 40$，所以 $p \\le 4$。花费不能超支，所以不能向上取整。",
    ),
    hardTip: t(
      "With an earnings goal, the same steps give a minimum, so any fraction rounds up instead. Items at $7$ and $3$ dollars, with $4$ large ones sold and a goal of at least $36$: $28 + 3s \\ge 36$, so $s \\ge \\frac{8}{3}$ and at least $3$ are needed. Rounding down leaves you short.",
      "有收入目标时，同样的步骤给出的是下限，所以小数要向上取整。两种物品分别 $7$ 和 $3$ 美元，已售出 $4$ 件大的，目标至少 $36$ 美元：$28 + 3s \\ge 36$，所以 $s \\ge \\frac{8}{3}$，至少需要 $3$ 件。向下取整就不够了。",
    ),
  },
  "sat-exam-systems-of-two-variable-inequalities": {
    tip: t(
      "A solution of a system must make every inequality true. Test each point in both, and reject it as soon as one fails. For $y > x + 2$ and $x + y < 10$: $(2, 5)$ works, since $5 > 4$ and $7 < 10$, while $(3, 2)$ fails the first. Passing just one is the trap.",
      "方程组的解必须使每个不等式都成立。把每个点代入两个不等式，一旦有一个不成立就排除。对 $y > x + 2$ 和 $x + y < 10$：$(2, 5)$ 成立，因为 $5 > 4$ 且 $7 < 10$；而 $(3, 2)$ 不满足第一个。只满足一个就是陷阱。",
    ),
    hardTip: t(
      "Fixing $x$ turns each inequality into a bound on $y$, so together they give an interval. With strict signs, the bounds are out, so pick the greatest integer below the upper bound. For $x = 2$ in $y > x + 2$ and $x + y < 10$: $4 < y < 8$, and the greatest integer is $7$.",
      "固定 $x$ 后，每个不等式都成为 $y$ 的一个界限，合起来给出一个区间。不等号严格时，界限本身不能取，所以选小于上界的最大整数。在 $y > x + 2$ 和 $x + y < 10$ 中令 $x = 2$：$4 < y < 8$，最大整数是 $7$。",
    ),
  },
  "sat-exam-modeling-with-systems-of-inequalities": {
    tip: t(
      "Translate each sentence into its own inequality, one for the money and one for the number of items. Prices weight the money line but not the count line. Shirts at $9$ dollars and socks at $3$, spending at most $150$ on at least $25$ pieces: $9x + 3y \\le 150$ and $x + y \\ge 25$.",
      "把每句话分别翻译成一个不等式：一个管金额，一个管数量。单价只出现在金额不等式中，不出现在数量不等式中。衬衫每件 $9$ 美元，袜子每双 $3$ 美元，最多花 $150$ 美元，至少买 $25$ 件：$9x + 3y \\le 150$，$x + y \\ge 25$。",
    ),
    hardTip: t(
      "An added requirement on one kind becomes a third inequality, on that variable alone; do not merge it with the total. Requiring at least $5$ shirts besides the conditions above adds $x \\ge 5$ to $9x + 3y \\le 150$ and $x + y \\ge 25$. Check that each sign matches its phrase.",
      "对某一种物品的额外要求是第三个不等式，只涉及这个变量，不要把它并入总量。除上述条件外还要求至少 $5$ 件衬衫，就在 $9x + 3y \\le 150$ 和 $x + y \\ge 25$ 之外再加上 $x \\ge 5$。检查每个符号是否与措辞相符。",
    ),
  },
  "sat-exam-modeling-and-solving-systems-of-linear-inequalities": {
    tip: t(
      "To maximize the expensive item, use the fewest items allowed, so as to free money. Replace the cheap count by $n - x$ and solve. Prices of $8$ and $3$, at least $10$ items and at most $60$ dollars: $8x + 3(10 - x) \\le 60$, so $5x \\le 30$ and $x \\le 6$. Using a larger total lowers $x$.",
      "要使贵的物品尽量多，就用允许的最少总件数，以省出钱来。把便宜物品的数量写成 $n - x$ 再求解。单价 $8$ 和 $3$，至少 $10$ 件，至多 $60$ 美元：$8x + 3(10 - x) \\le 60$，所以 $5x \\le 30$，$x \\le 6$。总件数更多时，$x$ 反而变小。",
    ),
    hardTip: t(
      "To maximize the total count, buy as little of the expensive item as the rules allow, then spend what remains on the cheap one. Prices of $8$ and $3$, with at most $60$ dollars and at least $6$ expensive: $48$ dollars is used, the other $12$ buy $4$ cheap items, for $10$ in all. Round the cheap count down if needed.",
      "要使总件数最多，贵的物品按规定买得尽量少，剩下的钱都买便宜的。单价 $8$ 和 $3$，至多 $60$ 美元，贵的至少 $6$ 件：用掉 $48$ 美元，其余 $12$ 美元可买 $4$ 件便宜的，一共 $10$ 件。需要时把便宜物品的数量向下取整。",
    ),
  },
  "sat-exam-sampling-bias-and-validity": {
    tip: t(
      "A valid estimate needs a sample chosen at random from the entire population in question. Asking only a convenient or self-selected group, such as visitors to a single place, leaves others out. To learn about a town's drivers, pick drivers at random from every driver in town, not just those near one garage.",
      "有效的估计需要从所研究的整个总体中随机抽样。只问方便接触或自愿响应的群体，比如某一地点的来访者，就把其他人排除在外了。要了解全镇司机，应从全镇所有司机中随机抽取，而不是只问某个车库附近的司机。",
    ),
    hardTip: t(
      "Judge a survey by how it was chosen, not by how many people it reached. A non-random group, such as volunteers or a club, may differ systematically from the population, and more of them will not fix that. The correct statement says the result may be biased because the sample was not random from everyone.",
      "评判调查要看样本怎样选取，而不是人数多少。非随机的群体，比如志愿者或某个社团，可能与总体有系统性差异，人数再多也无法弥补。正确的说法是：结果可能有偏差，因为样本不是从所有人中随机抽取的。",
    ),
  },
  "sat-exam-estimation-from-proportions-and-samples": {
    tip: t(
      "A random sample's proportion estimates the population's. Multiply the population by the fraction found in the sample. If $8$ of $40$ sampled students walk to school and there are $900$ students, about $\\frac{8}{40} \\cdot 900 = 180$ walk. Do not simply scale by a difference between the two sizes.",
      "随机样本的比例可以用来估计总体的比例。用总体数量乘样本中的比例。若抽样的 $40$ 名学生中有 $8$ 名走路上学，全校 $900$ 人，则约有 $\\frac{8}{40} \\cdot 900 = 180$ 人走路上学。不要按两个规模之差来估算。",
    ),
    hardTip: t(
      "If the question asks about those without the trait, estimate those with it, then subtract, or multiply by the complement. If $3$ of $60$ sampled parts fail and a plant makes $2000$ parts, then about $100$ fail, and about $1900$ pass. Reading carefully which group is asked for avoids the distractor.",
      "如果问的是不具备该特征的那部分，就先估算具备的，再相减，或者乘互补的比例。若抽样 $60$ 个零件中有 $3$ 个不合格，工厂生产 $2000$ 个，则约 $100$ 个不合格，约 $1900$ 个合格。看清问的是哪一组，就能避开干扰项。",
    ),
  },
  "sat-exam-interpreting-survey-data": {
    tip: t(
      "A random sample supports an approximate claim about only the group it was drawn from. So if $60\\%$ of randomly chosen members of a gym prefer mornings, about $60\\%$ of all members of that gym do. Claims about everyone in the country, or claims that it is exactly so, go too far.",
      "随机样本只能支持关于其来源总体的近似结论。所以如果随机选取的健身房会员中有 $60\\%$ 喜欢早晨，那么该健身房全体会员中约有 $60\\%$ 喜欢早晨。声称全国的人都如此，或者说恰好如此，都超出了结论的范围。",
    ),
    hardTip: t(
      "A count within the sample uses the sample size, not the population, multiplied by the percent as a decimal. For $60\\%$ of a sample of $150$: $0.6 \\cdot 150 = 90$. Read what the question counts: people in the sample, not an estimate for the whole group.",
      "样本内部的人数，要用样本容量（而不是总体）乘小数形式的百分比。样本 $150$ 人的 $60\\%$：$0.6 \\cdot 150 = 90$。看清题目数的是什么：是样本里的人，而不是对整个群体的估计。",
    ),
  },
  "sat-exam-margin-of-error": {
    tip: t(
      "A margin of error creates a range around an estimate: subtract it for the low end and add it for the high end. If $56\\%$ is reported with a margin of $3\\%$, the plausible values run from $53\\%$ to $59\\%$. Doubling the margin or using only one side of it is the wrong approach.",
      "误差范围在估计值周围形成一个区间：减去它得到下端，加上它得到上端。若报告 $56\\%$、误差范围 $3\\%$，合理的取值从 $53\\%$ 到 $59\\%$。把误差范围加倍，或者只用一侧，都不对。",
    ),
    hardTip: t(
      "To find the greatest plausible count, add the margin to the estimate and apply that percent to the whole population. For $56\\%$ with a margin of $3\\%$ in a town of $10{,}000$: the top is $59\\%$, or $5900$ people. Using the estimate without the margin gives the central value, not the greatest.",
      "要求最大的合理人数，把误差范围加到估计值上，再用这个百分比乘总体。对 $56\\%$、误差范围 $3\\%$、$10{,}000$ 人的镇：上端是 $59\\%$，即 $5900$ 人。不加误差范围得到的只是中心值，不是最大值。",
    ),
  },
  "sat-exam-the-mean-of-a-dataset": {
    tip: t(
      "The mean is the sum of all values divided by how many there are. Include negative values with their signs. For $9, -3, 6, 12, 1$: the sum is $25$ and the count is $5$, so the mean is $5$. Dropping a negative sign or dividing by the wrong count gives wrong options.",
      "平均数等于所有值之和除以个数。负值要带符号计入。对 $9, -3, 6, 12, 1$：和为 $25$，个数为 $5$，平均数是 $5$。漏掉负号或除错个数，就会得到错误选项。",
    ),
    hardTip: t(
      "Adding the same number to every value raises the sum by that number for each value, so the mean rises by exactly that number. If $4$ values have mean $10$ and each increases by $3$, the new mean is $13$. You do not need the data, and you must not add the increase times the count.",
      "每个值都加上同一个数，总和就按个数增加，所以平均数恰好增加这个数。若 $4$ 个值的平均数是 $10$，每个都加 $3$，新的平均数是 $13$。不需要知道具体数据，也不要把增加量乘个数加到平均数上。",
    ),
  },
  "sat-exam-the-median-of-a-dataset": {
    tip: t(
      "Sort the data first; the median of an odd number of values is the middle one. For $8, 1, 9, 3, 6$: the sorted list is $1, 3, 6, 8, 9$, so the median is $6$. Taking the middle entry of the unsorted list is the mistake the options reward.",
      "先排序；奇数个数据的中位数就是正中间的那个。对 $8, 1, 9, 3, 6$：排序后为 $1, 3, 6, 8, 9$，中位数是 $6$。直接取未排序列表的中间项，正是选项所预设的错误。",
    ),
    hardTip: t(
      "With an even number of values, no single value is in the middle, so average the two central ones after sorting. Keep repeated values in the list. For $2, 10, 4, 4, 12, 8$: sorted, it is $2, 4, 4, 8, 10, 12$, and the median is $\\frac{4 + 8}{2} = 6$. The result need not be in the data.",
      "数据个数为偶数时，没有单独的中间值，所以排序后取中间两个数的平均。重复的值要保留。对 $2, 10, 4, 4, 12, 8$：排序后为 $2, 4, 4, 8, 10, 12$，中位数是 $\\frac{4 + 8}{2} = 6$。结果不一定出现在数据中。",
    ),
  },
  "sat-exam-comparing-measures-of-center": {
    tip: t(
      "The mean uses every value's size, while the median uses only the middle position. So a single extreme high value pulls the mean above the median. In $3, 4, 5, 6, 42$, the median is $5$ and the mean is $12$. You can often decide without calculating, by spotting the outlier's side.",
      "平均数用到每个值的大小，中位数只用中间的位置。所以一个极大值会把平均数拉到中位数之上。在 $3, 4, 5, 6, 42$ 中，中位数是 $5$，平均数是 $12$。常常不用计算，只看离群值在哪一侧就能判断。",
    ),
    hardTip: t(
      "Removing an outlier affects the mean much more than the median, which only shifts to a neighbouring position. In $3, 4, 5, 6, 42$, removing the outlier drops the mean from $12$ to $4.5$, and the median just from $5$ to $4.5$. Find both before-and-after values if unsure, and compare the sizes of the changes.",
      "去掉离群值对平均数的影响远大于中位数，中位数只是移到相邻的位置。在 $3, 4, 5, 6, 42$ 中，去掉离群值后平均数从 $12$ 降到 $4.5$，中位数只从 $5$ 变到 $4.5$。不确定时，算出前后的值，比较变化的大小。",
    ),
  },
  "sat-exam-the-relationship-between-means-and-sums": {
    tip: t(
      "Rearranging the definition of the mean gives sum $=$ mean $\\times$ count. For $12$ runners with a mean time of $30$ minutes, the total time is $360$ minutes. No individual values are needed, and dividing rather than multiplying is the most common slip here.",
      "把平均数的定义变形，就得到总和 $=$ 平均数 $\\times$ 个数。$12$ 名跑者的平均用时为 $30$ 分钟，总用时就是 $360$ 分钟。不需要知道每个人的值，这里最常见的疏漏是把乘法做成了除法。",
    ),
    hardTip: t(
      "To combine groups of different sizes, do not average the two means. Find each group's sum, add them, and divide by the total count. For $10$ values with mean $20$ and $30$ values with mean $40$: $\\frac{200 + 1200}{40} = 35$. The larger group pulls the result toward its mean.",
      "合并规模不同的两组时，不能把两个平均数直接平均。要求出每组的总和，相加，再除以总个数。$10$ 个值平均为 $20$，$30$ 个值平均为 $40$：$\\frac{200 + 1200}{40} = 35$。规模大的一组会把结果拉向它的平均数。",
    ),
  },
  "sat-exam-finding-unknown-observations-from-centrality-measures": {
    tip: t(
      "Multiply the target mean by the total count to get the sum required, then subtract the known values. To average $80$ over $4$ tests with scores of $70$, $85$ and $90$: the sum must be $320$, so the last score is $75$. Averaging the known scores with the target does not work.",
      "用目标平均数乘总个数，得到所需的总和，再减去已知的值。要让 $4$ 次测验平均 $80$，前三次为 $70$、$85$、$90$：总和应为 $320$，所以最后一次是 $75$。把已知分数与目标值一起平均是不行的。",
    ),
    hardTip: t(
      "A median with even count is the average of the two middle values, so if one middle value is unknown: double the median and subtract the known one. In the ordered list $1, 3, x, 9, 11, 12$ with median $7$: $\\frac{x + 9}{2} = 7$, so $x = 5$. Make sure that the result keeps the list in order.",
      "偶数个数据的中位数是中间两个值的平均，所以若其中一个未知：把中位数乘 $2$，再减去已知的那个。在有序列表 $1, 3, x, 9, 11, 12$ 中，中位数为 $7$：$\\frac{x + 9}{2} = 7$，所以 $x = 5$。确认结果仍使列表保持有序。",
    ),
  },
  "sat-exam-tabular-datasets": {
    tip: t(
      "Read the row with the values and check the units in its label. A total means adding every column in that row. If a table shows rainfall of $4, 7, 2, 5$ over four months, the total is $18$, in whatever units the label names. Do not include the year or month headers in the sum.",
      "读出存放数值的那一行，并看清标签上的单位。总量就是把这一行的每一列相加。若表中四个月的降雨量为 $4, 7, 2, 5$，总量就是 $18$，单位按标签所写。不要把年份或月份的表头算进去。",
    ),
    hardTip: t(
      "A change compares only the two columns named, later minus earlier; a negative result means a decrease. The values between them do not matter. If rainfall goes $4, 7, 2, 5$, the change from the second month to the third is $2 - 7 = -5$. Keep the sign; a positive answer reverses the order.",
      "变化量只比较指定的两列，用后者减前者；结果为负表示减少。它们之间的值无关紧要。若降雨量依次为 $4, 7, 2, 5$，从第二个月到第三个月的变化是 $2 - 7 = -5$。保留符号，答案为正就是顺序反了。",
    ),
  },
  "sat-exam-frequency-tables": {
    tip: t(
      "In a frequency table, each frequency tells how many times its value occurs. So the number of data values equals the sum of the frequencies, not the number of columns and not a sum of the values themselves. With frequencies $3, 6, 2$, the data set contains $11$ values.",
      "在频数表中，每个频数表示对应的值出现了几次。所以数据的总个数等于频数之和，既不是列数，也不是这些值本身的和。频数为 $3, 6, 2$ 时，数据共有 $11$ 个值。",
    ),
    hardTip: t(
      'To count values satisfying a condition, select the columns that meet it and add just their frequencies. "Greater than" excludes the stated value, while "at least" includes it. If value $6$ occurs $2$ times and value $7$ occurs $5$ times, then $7$ values are greater than $5$. Do not add the values themselves.',
      "要数满足条件的值有多少个，选出符合条件的列，只把它们的频数相加。“大于”不包括给定的值，“至少”则包括。若值 $6$ 出现 $2$ 次、值 $7$ 出现 $5$ 次，则大于 $5$ 的值有 $7$ 个。不要把值本身相加。",
    ),
  },
  "sat-exam-box-plots": {
    tip: t(
      "A box plot shows five numbers: minimum, first quartile, median, third quartile and maximum. The line inside the box marks the median; read its position on the scale. The middle of the box's width and the centre of the whiskers are not necessarily the median, so trust the inner line.",
      "箱线图显示五个数：最小值、第一四分位数、中位数、第三四分位数和最大值。箱内的线标出中位数，在刻度上读出它的位置。箱宽的中点或须线的中心不一定是中位数，要以箱内这条线为准。",
    ),
    hardTip: t(
      "The interquartile range is the width of the box: the third quartile minus the first, read from the box's two ends. If a box runs from $12$ to $28$, the range is $16$. The whiskers do not count; using the two extremes gives the overall range, which is a different measure.",
      "四分位距就是箱子的宽度：第三四分位数减第一四分位数，从箱子的两端读出。箱子从 $12$ 到 $28$ 时，四分位距是 $16$。须线不算在内；用两个极值算出的是全距，那是另一个量。",
    ),
  },
  "sat-exam-measuring-centrality-from-frequency-tables": {
    tip: t(
      "For the mean, multiply each value by its frequency and add, then divide by the sum of the frequencies. With value $1$ twice, value $3$ five times and value $5$ three times: $\\frac{2 + 15 + 15}{10} = 3.2$. Dividing by the number of columns, or just averaging the listed values, ignores repetition.",
      "求平均数时，把每个值乘它的频数再相加，然后除以频数之和。值 $1$ 出现 $2$ 次，值 $3$ 出现 $5$ 次，值 $5$ 出现 $3$ 次：$\\frac{2 + 15 + 15}{10} = 3.2$。除以列数，或者只平均表中列出的值，都忽略了重复。",
    ),
    hardTip: t(
      "For the median, find the total count, locate the middle position, and walk through the columns adding frequencies until you reach it. With frequencies $2, 5, 3$ for values $1, 3, 5$, the $5$th and $6$th of $10$ values both fall on $3$, so the median is $3$. It is not the middle column automatically.",
      "求中位数时，先求总个数，确定中间位置，再按列累加频数，直到到达这个位置。值 $1, 3, 5$ 的频数为 $2, 5, 3$ 时，$10$ 个值中的第 $5$ 和第 $6$ 个都落在 $3$ 上，所以中位数是 $3$。它不一定就是中间那一列。",
    ),
  },
  "sat-exam-bounding-statistical-metrics": {
    tip: t(
      "With grouped integers, the exact values are unknown, but the largest sum comes from putting every value at the top of its group. Multiply each frequency by the upper limit and add. For $3$ values in $0\\text{-}9$ and $2$ in $10\\text{-}19$: $3(9) + 2(19) = 65$. For the least sum, use lower limits.",
      "分组的整数数据虽然具体值未知，但总和最大时，每个值都取所在组的上限。把每个频数乘上限再相加。$0\\text{-}9$ 组有 $3$ 个，$10\\text{-}19$ 组有 $2$ 个：$3(9) + 2(19) = 65$。求最小总和时用下限。",
    ),
    hardTip: t(
      "The range is maximum minus minimum, so to make it greatest, take the lowest possible value of the lowest non-empty group and the highest possible value of the top group. For groups $0\\text{-}9$ and $30\\text{-}39$, it is $39 - 0 = 39$. Subtracting the lower limits of the groups understates the range.",
      "全距是最大值减最小值，所以要使它最大，就取最低的非空组的最小可能值，以及最高组的最大可能值。对 $0\\text{-}9$ 和 $30\\text{-}39$ 两组，全距是 $39 - 0 = 39$。只用两组的下限相减会低估全距。",
    ),
  },
  "sat-exam-comparing-data-sets": {
    tip: t(
      "Compare a centre and a spread. Sets symmetric about the same value share a mean. Then look at how far the values lie from it: the farther, the greater the standard deviation. So $4, 5, 6$ and $0, 5, 10$ have equal means, but the second has more spread. A larger range usually signals this.",
      "比较中心和离散程度。关于同一个值对称的数据集，平均数相同。再看各值离它多远：离得越远，标准差越大。所以 $4, 5, 6$ 和 $0, 5, 10$ 平均数相同，但后者更分散。全距更大通常也说明了这一点。",
    ),
    hardTip: t(
      "The range of a set is its largest value minus its smallest. Compute each set's range separately, then subtract in the order the question states. For $4, 5, 6$ and $0, 5, 10$, the ranges are $2$ and $10$, so the second minus the first is $8$. Comparing means here would give zero, a useless result.",
      "数据集的全距是最大值减最小值。分别算出两个数据集的全距，再按题目规定的顺序相减。对 $4, 5, 6$ 和 $0, 5, 10$，全距为 $2$ 和 $10$，后者减前者得 $8$。这里比较平均数只会得到零，毫无用处。",
    ),
  },
  "sat-exam-comparing-data-sets-presented-visually": {
    tip: t(
      "Read the median from the line inside the box. If every value of a set is raised by the same amount, the whole plot slides along the scale, so the median rises by that amount. A plot with median $40$ shifted up by $6$ has median $46$. Do not read the shifted value from the unchanged plot.",
      "从箱内的线读出中位数。如果数据集的每个值都增加同一个数，整个图沿刻度平移，中位数也增加这个数。中位数为 $40$ 的图上移 $6$ 后，中位数是 $46$。不要直接拿未平移的图来回答。",
    ),
    hardTip: t(
      "The interquartile range is the box's width, the third quartile minus the first. A shift moves both ends equally, so their difference does not change, and the width stays the same. A box from $30$ to $48$ has an interquartile range of $18$ before and after any shift. Adding the shift is the trap.",
      "四分位距是箱子的宽度，即第三四分位数减第一四分位数。平移使两端移动相同的量，差不变，宽度也不变。从 $30$ 到 $48$ 的箱子，平移前后四分位距都是 $18$。把平移量加上去就落入了陷阱。",
    ),
  },
  "sat-exam-comparing-centrality-measures-from-frequency-tables": {
    tip: t(
      "Find the median by locating the middle position through the frequencies, and the mean by weighting each value with its frequency. A rare large value barely moves the median but raises the mean. For values $1, 2, 3, 30$ with frequencies $4, 4, 4, 1$: median $2$, mean $\\frac{54}{13}$, so the mean is greater.",
      "通过频数定位中间位置得到中位数，用频数加权得到平均数。很少出现的大值几乎不影响中位数，却能抬高平均数。值 $1, 2, 3, 30$ 的频数为 $4, 4, 4, 1$ 时：中位数是 $2$，平均数是 $\\frac{54}{13}$，所以平均数更大。",
    ),
    hardTip: t(
      "For the exact difference, compute both measures as fractions. The mean is the weighted sum over the total count, and the median comes from the middle position. Then subtract with a common denominator: for the table above, $\\frac{54}{13} - 2 = \\frac{28}{13}$. Rounding too soon would lose the exact answer.",
      "要求确切的差，就把两个量都算成分数。平均数是加权和除以总个数，中位数来自中间位置。再通分相减：对上面的表，$\\frac{54}{13} - 2 = \\frac{28}{13}$。过早取近似就得不到精确答案。",
    ),
  },
  "sat-exam-comparing-centrality-measures-with-symmetric-datasets": {
    tip: t(
      "A symmetric data set has values mirrored about a centre, so the mean and the median both equal that centre. In $3, 8, 10, 12, 17$, each value pairs with one equally far from $10$. Hence the two measures agree without any calculation. Check the pairs before reaching for the arithmetic.",
      "对称数据集的值关于中心成镜像，所以平均数和中位数都等于这个中心。在 $3, 8, 10, 12, 17$ 中，每个值都能配到一个与 $10$ 距离相等的值。所以不必计算，两个量就相等。动手算之前先看能否配对。",
    ),
    hardTip: t(
      "To find a missing value of a symmetric set, first identify the centre from a pair that already mirrors. Then match the unpaired value: its partner is equally far on the other side. If the centre is $10$ and $3$ is unpaired, the missing value is $17$, since $3$ is $7$ below the centre.",
      "要找对称数据集中缺失的值，先由已成镜像的一对确定中心，再给未配对的值找伙伴：它在另一侧距离相等的位置。若中心是 $10$，未配对的值是 $3$，缺失的值就是 $17$，因为 $3$ 在中心下方 $7$ 处。",
    ),
  },
  "sat-exam-comparing-statistical-effects-of-data-change": {
    tip: t(
      "Adding a constant to every value moves the centre by that constant but leaves the gaps between values alone. So the mean and median grow, and the range and standard deviation stay the same. For $2, 5, 9$ plus $4$: $6, 9, 13$ has a mean greater by $4$ and the same spread.",
      "每个值都加一个常数，中心就移动这个常数，而值与值之间的间距不变。所以平均数和中位数增大，全距和标准差不变。$2, 5, 9$ 都加 $4$ 得 $6, 9, 13$，平均数大 $4$，分散程度相同。",
    ),
    hardTip: t(
      "Multiplying every value by a constant stretches the data, so the gaps are scaled too, and with them the range. Scale the old range by the constant rather than recomputing, or multiply the two extremes. For $2, 5, 9$ times $5$: the range goes from $7$ to $35$. Unlike a shift, this changes the spread.",
      "每个值都乘一个常数会拉伸数据，间距和全距也随之放大。把原全距乘这个常数，不必重算，或者把两个极值分别相乘。$2, 5, 9$ 都乘 $5$：全距从 $7$ 变成 $35$。与平移不同，这会改变分散程度。",
    ),
  },
  "sat-exam-effects-of-additional-data-on-centrality-measures": {
    tip: t(
      "Compare the new value to the current mean. A value above the mean pulls it up, one below pulls it down, and one exactly at the mean leaves it unchanged. If $6$ scores average $70$ and a $75$ arrives, the mean increases. The size of the set affects only how much.",
      "把新值与当前平均数比较。高于平均数会拉高它，低于会拉低它，恰好相等则不变。若 $6$ 个分数平均 $70$，新来一个 $75$，平均数就增大。数据多少只影响变化的大小。",
    ),
    hardTip: t(
      "For the exact new mean, restore the old sum by multiplying mean by count, add the new value, and divide by the count plus one. For $6$ scores averaging $70$ and a new score of $91$: $\\frac{420 + 91}{7} = 73$. Averaging the old mean and new value overweights the single newcomer.",
      "要求确切的新平均数，先用平均数乘个数还原原总和，加上新值，再除以个数加一。$6$ 个分数平均 $70$，新分数为 $91$：$\\frac{420 + 91}{7} = 73$。把旧平均数和新值直接平均，就过分看重了这一个新值。",
    ),
  },
  "sat-exam-simple-probabilities-in-real-world-contexts": {
    tip: t(
      "Probability is the number of favorable outcomes over the total number of outcomes. Add all the groups first to get the total. A box with $3$ pink, $6$ gray and $11$ black pens gives pink a chance of $\\frac{3}{20}$. Comparing pink with the non-pink only, which gives $\\frac{3}{17}$, is a ratio and not a probability.",
      "概率等于有利结果数除以总结果数。先把所有组加起来得到总数。盒中有 $3$ 支粉色、$6$ 支灰色、$11$ 支黑色笔时，抽到粉色的概率是 $\\frac{3}{20}$。只与非粉色相比得到 $\\frac{3}{17}$，这是比值，不是概率。",
    ),
    hardTip: t(
      "When a favorable item is added, the total grows too, so set up an equation that reflects both. A probability of $\\frac{1}{2}$ means favorable equals the rest. With $3$ pink and $17$ others, $3 + x = 17$, so $14$ pink pens must be added. Keeping the old total in the denominator gives a wrong result.",
      "加入有利物品时，总数也会增加，所以方程要同时反映两者。概率为 $\\frac{1}{2}$ 意味着有利数量等于其余数量。$3$ 支粉色、$17$ 支其他颜色时，$3 + x = 17$，所以要加 $14$ 支粉色笔。分母仍用原总数就错了。",
    ),
  },
  "sat-exam-calculating-probabilities-from-datasets": {
    tip: t(
      'Count the list\'s entries that satisfy the condition, counting repeats each time, and divide by the full number of entries. In $3, 8, 12, 12, 5$, those greater than $10$ number two, so the probability is $\\frac{2}{5}$. Note that "greater than" excludes the boundary value itself.',
      "数出列表中满足条件的项，重复的值每次都要算，再除以总项数。在 $3, 8, 12, 12, 5$ 中，大于 $10$ 的有两项，概率是 $\\frac{2}{5}$。注意“大于”不包括边界值本身。",
    ),
    hardTip: t(
      "A property such as even or odd also requires checking each entry in turn. Even numbers end in $0, 2, 4, 6$ or $8$; zero counts as even. In $3, 8, 12, 12, 5$, three entries are even, so the probability is $\\frac{3}{5}$. Scan the entire list, since unsorted data makes it easy to miss one.",
      "奇偶这样的性质也要逐项检查。偶数的末位是 $0, 2, 4, 6$ 或 $8$，零也是偶数。在 $3, 8, 12, 12, 5$ 中有三项是偶数，概率是 $\\frac{3}{5}$。要把整个列表扫一遍，数据未排序时很容易漏掉。",
    ),
  },
  "sat-exam-simple-probabilities-from-two-way-frequency-tables": {
    tip: t(
      'For "one person chosen from everyone", the denominator is the grand total. An "and" condition selects a single inner cell. If $12$ people are both adults and said no, among $60$ surveyed, the probability is $\\frac{12}{60} = \\frac{1}{5}$. Dividing by a row total instead answers a conditional question.',
      "“从所有人中选一人”时，分母是总计。“且”条件对应一个内部单元格。如果 $60$ 名受访者中有 $12$ 人既是成年人又回答否，概率就是 $\\frac{12}{60} = \\frac{1}{5}$。除以行合计回答的是条件概率问题。",
    ),
    hardTip: t(
      "If the question names only one attribute, use that row's or column's total as the numerator, over the grand total. If $25$ of $60$ respondents are adults in the total column, the probability of choosing an adult is $\\frac{25}{60} = \\frac{5}{12}$. Do not pick an inner cell, which adds a second condition.",
      "题目只提到一个属性时，用那一行或那一列的合计作分子，总计作分母。若 $60$ 名受访者中合计有 $25$ 名成年人，选到成年人的概率是 $\\frac{25}{60} = \\frac{5}{12}$。不要选内部单元格，那样多加了一个条件。",
    ),
  },
  "sat-exam-conditional-probabilities-from-two-way-frequency-tables": {
    tip: t(
      '"Given that" shrinks the group you choose from, so the denominator is the total for the given category. Find the matching cell within that row. If $9$ of the $15$ adults said yes, the probability of yes given adult is $\\frac{9}{15}$. The grand total plays no part in this.',
      "“已知”缩小了选取的范围，所以分母是已知类别的合计。再在那一行中找到符合的单元格。若 $15$ 名成年人中有 $9$ 人回答是，已知成年人时回答是的概率就是 $\\frac{9}{15}$。总计在这里不起作用。",
    ),
    hardTip: t(
      "The given condition may be a column instead of a row, so read it carefully: the denominator is that column's total. If $10$ people said no and $4$ of them are adults, the probability of adult given no is $\\frac{4}{10}$. Swapping the condition and the target, $\\frac{4}{15}$, is the main trap.",
      "已知条件也可能对应一列而不是一行，所以要看清：分母是那一列的合计。若 $10$ 人回答否，其中 $4$ 人是成年人，已知回答否时是成年人的概率是 $\\frac{4}{10}$。把条件和目标对调得到 $\\frac{4}{15}$，是主要的陷阱。",
    ),
  },
  "sat-exam-calculating-conditional-probabilities": {
    tip: t(
      "If the chosen person comes from a named subgroup, the percent stated for that subgroup is already the probability. Other percents, and the overall size, do not matter. If $75\\%$ of a club's drivers carpool, a driver chosen at random carpools with probability $\\frac{3}{4}$. Multiplying the percents answers a different question.",
      "如果选取的人来自指定的子群，为这个子群给出的百分比就是概率。其他百分比和总人数都无关紧要。若俱乐部的司机中有 $75\\%$ 拼车，随机选一名司机，拼车的概率就是 $\\frac{3}{4}$。把百分比相乘回答的是另一个问题。",
    ),
    hardTip: t(
      "To count those in both categories, apply the percents in sequence: take the first percent of the whole, then the second of that result. Of $500$ people, if $40\\%$ drive and $25\\%$ of drivers carpool, then $200$ drive and $50$ carpool. Adding the percents, or applying the second to the whole, gives a wrong count.",
      "要数同时属于两类的人，依次应用百分比：先取总数的第一个百分比，再取结果的第二个百分比。$500$ 人中，若 $40\\%$ 开车，开车者中 $25\\%$ 拼车，则 $200$ 人开车，$50$ 人拼车。把百分比相加，或把第二个百分比用于总数，都数错了。",
    ),
  },
  "sat-exam-making-predictions-using-best-fit-lines": {
    tip: t(
      "A prediction is the line's output at the given input. Substitute $x$ into the equation and calculate, multiplying before adding. For the line $y = 3x + 8$ at $x = 20$, the predicted value is $68$. A prediction is not a guarantee, and actual data points may lie off the line.",
      "预测值就是直线在给定输入处的输出。把 $x$ 代入方程计算，先乘后加。对直线 $y = 3x + 8$，在 $x = 20$ 处的预测值是 $68$。预测并不保证准确，实际数据点可能不在直线上。",
    ),
    hardTip: t(
      "To go from a predicted output back to the input, set the equation equal to that output and solve: subtract the intercept, then divide by the slope. For $y = 3x + 8$ with $y = 68$: $3x = 60$, so $x = 20$. Substituting the output as if it were $x$ is the frequent error.",
      "要从预测的输出反推输入，令方程等于这个输出再求解：减去截距，再除以斜率。对 $y = 3x + 8$，$y = 68$ 时：$3x = 60$，所以 $x = 20$。把输出当作 $x$ 代入是常见的错误。",
    ),
  },
  "sat-exam-the-slope-of-a-best-fit-line": {
    tip: t(
      "The slope of a best-fit line is the predicted change in the output per one unit of the input. Say both units in your interpretation. For $y = 2x + 15$ modeling weight in grams after $x$ days, $2$ means a predicted gain of $2$ grams per day. The number $15$ is the predicted starting weight.",
      "最佳拟合线的斜率是输入每增加一个单位时输出的预测变化量。解释时要说出两个单位。对表示 $x$ 天后重量（克）的 $y = 2x + 15$，$2$ 表示预计每天增加 $2$ 克。$15$ 是预测的初始重量。",
    ),
    hardTip: t(
      "Given two points on the line, compute the slope as the change in $y$ over the change in $x$, subtracting in the same order. Through $(2, 9)$ and $(7, 19)$: $\\frac{19 - 9}{7 - 2} = 2$. Upside-down division, or using data points that do not lie on the line, leads to wrong values.",
      "已知直线上的两点时，用 $y$ 的变化除以 $x$ 的变化求斜率，相减的顺序要一致。过 $(2, 9)$ 和 $(7, 19)$：$\\frac{19 - 9}{7 - 2} = 2$。把分子分母颠倒，或者用了不在直线上的数据点，结果就错了。",
    ),
  },
  "sat-exam-identifying-best-fit-lines": {
    tip: t(
      "Estimate two things from the scatterplot. The slope is how much the cloud rises per unit across, with the sign showing up or down. The intercept is where the cloud would hit the vertical axis. If the points rise about $2$ per unit from near $3$, choose $y = 2x + 3$. Reject options with the wrong sign first.",
      "从散点图估计两件事。斜率是点云每向右一个单位上升多少，符号表示上升或下降。截距是点云延伸到竖轴的位置。若点约每单位上升 $2$，从 $3$ 附近开始，就选 $y = 2x + 3$。先排除符号错误的选项。",
    ),
    hardTip: t(
      "To describe an association, say its direction and its form. Rising points show a positive association, falling points a negative one. If they follow a straight band, it is linear; if they curve, it is nonlinear; if they form a shapeless cloud, there is none. Check the direction from left to right.",
      "描述相关关系时，要说明方向和形式。点上升是正相关，点下降是负相关。若沿一条直带分布，是线性的；若呈曲线，是非线性的；若毫无形状，就是没有相关。方向要从左往右看。",
    ),
  },
  "sat-exam-analyzing-residuals-of-best-fit-lines": {
    tip: t(
      "A residual is the actual value minus the predicted value. Compute the line's output at the point's $x$, then subtract it from the point's $y$. For the line $y = 2x + 5$ and the point $(10, 28)$, the prediction is $25$, so the residual is $3$. Reversing the subtraction flips the sign.",
      "残差等于实际值减预测值。先算直线在该点 $x$ 处的输出，再用该点的 $y$ 减去它。对直线 $y = 2x + 5$ 和点 $(10, 28)$，预测值是 $25$，残差就是 $3$。减反了，符号就相反。",
    ),
    hardTip: t(
      "The residual's sign gives the point's location: positive means above the line, negative means below, and its size is the vertical distance. For $y = 2x + 5$ and the point $(10, 21)$, the prediction is $25$, so the point is $4$ units below the line. Do not measure horizontally.",
      "残差的符号说明点的位置：正表示在直线上方，负表示在下方，其大小就是竖直距离。对 $y = 2x + 5$ 和点 $(10, 21)$，预测值是 $25$，所以这个点在直线下方 $4$ 个单位。不要按水平方向测量。",
    ),
  },
  "sat-exam-interpreting-data-plots": {
    tip: t(
      "To find the greatest $y$-value, look for the highest point on the plot and read straight across to the vertical axis. It need not be the point farthest to the right. Check the axis scale, because each gridline may stand for more than one unit, and do not report the point's $x$-value.",
      "要找最大的 $y$ 值，就找图上最高的点，水平读到竖轴上。它不一定是最右边的点。要看清坐标轴的刻度，因为每条网格线可能不止代表一个单位，也不要回答这个点的 $x$ 值。",
    ),
    hardTip: t(
      'To count points above a value, imagine a horizontal line at that height and count the points strictly above it. Points on the line do not qualify under "greater than". If points have heights $3, 6, 8, 11$ and the line is at $6$, the count is two. Do not count the gridlines.',
      "要数高于某个值的点，想象在这个高度画一条水平线，数严格在线上方的点。在“大于”的条件下，线上的点不算。若各点高度为 $3, 6, 8, 11$，线在 $6$ 处，就有两个点。不要去数网格线。",
    ),
  },
  "sat-exam-interpreting-time-series-graphs": {
    tip: t(
      "On a time graph, the horizontal axis gives when and the vertical axis gives how much. To find when something peaks, locate the highest point of the curve, then read straight down to the time axis. A peak over $x = 6$ happens $6$ hours in. The peak's height is not what is asked.",
      "在时间图上，横轴表示何时，纵轴表示多少。要找何时达到峰值，就找曲线的最高点，再竖直向下读到时间轴。峰值在 $x = 6$ 上方，表示第 $6$ 小时达到。这里问的不是峰值的高度。",
    ),
    hardTip: t(
      "The greatest amount shown is the height of the curve's highest point. Read straight across from it to the vertical axis and use the axis's units. If the curve tops out at a level of $25$, that is the answer, whichever hour it occurs. Reporting the time is the mistake to avoid here.",
      "图上的最大值就是曲线最高点的高度。从这个点水平读到竖轴，并使用竖轴的单位。若曲线的最高水平是 $25$，答案就是它，不论发生在第几小时。这里要避免回答成时间。",
    ),
  },
  "sat-exam-average-rate-of-change-from-data-plots": {
    tip: t(
      "The average rate of change between two points is the change in output divided by the change in input, the slope of the segment joining them. Between $(2, 5)$ and $(6, 17)$: $\\frac{12}{4} = 3$. Dividing by the input alone, or inverting the fraction, are the typical mistakes.",
      "两点之间的平均变化率等于输出变化除以输入变化，也就是连接它们的线段的斜率。在 $(2, 5)$ 和 $(6, 17)$ 之间：$\\frac{12}{4} = 3$。只除以输入值，或者把分数颠倒，都是典型错误。",
    ),
    hardTip: t(
      "Working backward, the total change equals the rate times the input gap, and this is added to the starting output. If $f(2) = 5$ and the rate is $3$ from $x = 2$ to $x = 6$: the change is $12$, so $f(6) = 17$. Multiply by the gap, not by the final input.",
      "反过来，总变化等于变化率乘输入差，再加到起始输出上。若 $f(2) = 5$，从 $x = 2$ 到 $x = 6$ 的变化率是 $3$：变化量为 $12$，所以 $f(6) = 17$。要乘输入差，而不是最后的输入。",
    ),
  },
  "sat-exam-linear-vs-exponential-models": {
    tip: t(
      "Check equally spaced outputs. A constant difference means a linear model, and a constant ratio means an exponential one. The values $5, 9, 13, 17$ add $4$ each time, so they are linear; $5, 10, 20, 40$ double each time, so they are exponential. Compute both when unsure.",
      "检查等间隔的输出。差固定是线性模型，比固定是指数模型。$5, 9, 13, 17$ 每次加 $4$，是线性的；$5, 10, 20, 40$ 每次翻倍，是指数的。不确定时两者都算一下。",
    ),
    hardTip: t(
      "For exponential growth, the ratio of consecutive outputs is the factor. Then the value at $x$ is the start times the factor to the power $x$. Starting at $5$ and reaching $15$ at $x = 1$ gives a factor of $3$, so at $x = 4$ the value is $5(3)^4 = 405$. Adding a constant difference is the linear error.",
      "指数增长中，相邻输出之比就是倍数。于是 $x$ 处的值等于初始值乘倍数的 $x$ 次幂。从 $5$ 开始，$x = 1$ 时为 $15$，倍数是 $3$，所以 $x = 4$ 时的值是 $5(3)^4 = 405$。加固定差值是线性思路的错误。",
    ),
  },
  "sat-exam-finding-parts-of-numbers-from-percentages": {
    tip: t(
      'To find a percent of a number, write the percent as a fraction of $100$ or as a decimal and multiply. So $15\\%$ of $80$ is $0.15 \\cdot 80 = 12$. The word "of" means multiply. Dividing the number by the percent, or moving the decimal the wrong way, gives wrong options.',
      "求一个数的百分之几，把百分比写成以 $100$ 为分母的分数或小数，再相乘。所以 $80$ 的 $15\\%$ 是 $0.15 \\cdot 80 = 12$。“的”表示相乘。把这个数除以百分比，或者小数点移错方向，都会得到错误选项。",
    ),
    hardTip: t(
      "If the question asks about the rest, find the part and subtract from the whole, or use the complementary percent directly. With $80$ people and $15\\%$ cycling, $12$ cycle and $68$ do not, which also equals $85\\%$ of $80$. Stopping at the stated percent's part answers the opposite question.",
      "如果问的是其余部分，就先求这部分再从总数中减去，或者直接用互补的百分比。$80$ 人中有 $15\\%$ 骑车，则 $12$ 人骑车，$68$ 人不骑车，也等于 $80$ 的 $85\\%$。只求到给定百分比的那部分，回答的就是相反的问题。",
    ),
  },
  "sat-exam-expressing-ratios-of-numbers-as-percentages": {
    tip: t(
      'To express a part as a percent of a whole, divide the part by the whole and multiply by $100$. The number after "of" is the whole. So $9$ is $\\frac{9}{45} \\cdot 100 = 20$ percent of $45$. Dividing the whole by the part gives a number greater than $100$ for a part below the whole.',
      "要把部分表示成整体的百分比，用部分除以整体再乘 $100$。“的”字前面的数（英文中 of 后面的数）是整体。所以 $9$ 是 $45$ 的 $\\frac{9}{45} \\cdot 100 = 20$ 个百分点。用整体除以部分，会得到大于 $100$ 的结果。",
    ),
    hardTip: t(
      "If the question concerns the other group, find its count by subtraction first, then divide by the whole. A team that won $9$ of $45$ games lost $36$, which is $\\frac{36}{45}$, or $80\\%$. Subtracting the winning percent from $100$ gives the same result, a useful check.",
      "如果问的是另一组，先用减法求出它的数量，再除以总数。一支球队 $45$ 场赢了 $9$ 场，就输了 $36$ 场，即 $\\frac{36}{45}$，也就是 $80\\%$。用 $100$ 减去胜率也得到同样的结果，可以用来检验。",
    ),
  },
  "sat-exam-finding-totals-from-percentages": {
    tip: t(
      "If a part and its percent are known, divide the part by the percent written as a decimal; the result is the whole. So if $18$ is $45\\%$ of a number, that number is $\\frac{18}{0.45} = 40$. Multiplying instead gives a value smaller than the part, which cannot be a whole.",
      "已知部分和它的百分比时，用部分除以写成小数的百分比，结果就是整体。所以若 $18$ 是某数的 $45\\%$，这个数就是 $\\frac{18}{0.45} = 40$。如果做乘法，结果比部分还小，不可能是整体。",
    ),
    hardTip: t(
      "To count the remainder, recover the total by dividing the part by its percent, then subtract the part. If $18$ people, or $45\\%$ of a group, agreed, the total is $40$, so $22$ did not. A wrong route is subtracting the percent from the part directly, which mixes units.",
      "要数其余的部分，先用部分除以它的百分比还原总数，再减去这部分。若 $18$ 人（占群体 $45\\%$）同意，总数是 $40$，所以 $22$ 人不同意。直接用部分减百分比是错的，那样混用了单位。",
    ),
  },
  "sat-exam-applying-percentages-in-succession": {
    tip: t(
      "A percent of a percent means multiply in turn: work from the right. To find $20\\%$ of $50\\%$ of $900$, take $50\\%$ of $900$ for $450$, and then $20\\%$ of that for $90$. Adding the percents to get $70\\%$ is the classic wrong approach.",
      "百分比的百分比就是依次相乘，从右往左算。求 $900$ 的 $50\\%$ 的 $20\\%$，先算 $900$ 的 $50\\%$ 得 $450$，再算它的 $20\\%$ 得 $90$。把百分比相加得 $70\\%$ 是典型的错误做法。",
    ),
    hardTip: t(
      '"Pass the first but not the second" means the remainder of the first group. Find the first group, then take the complement of the second percent of it. Of $900$ people, $50\\%$ pass round one and $20\\%$ of those pass round two, so $450$ pass one and $80\\%$ of them, $360$, stop there.',
      "“通过第一关但没通过第二关”指的是第一组中剩下的人。先求第一组，再取第二个百分比的互补比例。$900$ 人中 $50\\%$ 通过第一轮，其中 $20\\%$ 通过第二轮，则 $450$ 人通过第一轮，其中 $80\\%$（即 $360$ 人）止步于此。",
    ),
  },
  "sat-exam-expressing-percentage-change-using-decimals": {
    tip: t(
      "An increase of $r$ percent keeps the original and adds a share, so the multiplier is $1 + \\frac{r}{100}$. A $25\\%$ rise of $x$ is $1.25x$. The tempting expression $0.25x$ gives only the increase, and $x + 0.25$ adds a fixed number rather than a percent of $x$.",
      "增加 $r$ 个百分点，就是保留原值再加上一部分，所以乘数是 $1 + \\frac{r}{100}$。$x$ 增加 $25\\%$ 就是 $1.25x$。诱人的 $0.25x$ 只是增加量，而 $x + 0.25$ 加的是固定的数，不是 $x$ 的百分比。",
    ),
    hardTip: t(
      "A decrease of $r$ percent leaves $100 - r$ percent, so the multiplier is $1 - \\frac{r}{100}$. A $25\\%$ drop of $x$ is $0.75x$. The expression $0.25x$ is the amount lost, not what remains. Think of what share is left, then write it as a decimal.",
      "减少 $r$ 个百分点后剩下 $100 - r$ 个百分点，所以乘数是 $1 - \\frac{r}{100}$。$x$ 减少 $25\\%$ 就是 $0.75x$。$0.25x$ 是减少的量，不是剩下的量。想一想还剩多少比例，再写成小数。",
    ),
  },
  "sat-exam-calculating-percentage-change": {
    tip: t(
      "Percent increase is the change divided by the original value, times $100$. The original is the earlier number. A price going from $40$ to $50$ changes by $10$, so the increase is $\\frac{10}{40} \\cdot 100 = 25$ percent. Dividing by the new value is the frequent trap.",
      "百分比增长等于变化量除以原值再乘 $100$。原值是较早的那个数。价格从 $40$ 涨到 $50$，变化 $10$，增长就是 $\\frac{10}{40} \\cdot 100 = 25$ 个百分点。除以新值是常见的陷阱。",
    ),
    hardTip: t(
      "For a decrease, the original is now the larger number, so the same change gives a smaller percent. From $50$ to $40$: $\\frac{10}{50} \\cdot 100 = 20$ percent. An increase and a decrease between the same two numbers are therefore not equal. Exact answers may come out as fractions.",
      "下降时，原值是较大的数，所以同样的变化量对应的百分比更小。从 $50$ 降到 $40$：$\\frac{10}{50} \\cdot 100 = 20$ 个百分点。因此同样两个数之间的增长率和下降率并不相等。精确答案可能是分数。",
    ),
  },
  "sat-exam-applying-percentage-change": {
    tip: t(
      "A discount leaves a share of the price, so multiply by that share instead of finding the discount and stopping. At $25\\%$ off a price of $120$, the buyer pays $75\\%$, so the sale price is $0.75 \\cdot 120 = 90$. The discount amount itself, $30$, is the wrong option to avoid.",
      "折扣后剩下价格的一部分，所以要乘这个比例，而不是只算出折扣额就停下。价格 $120$ 打折 $25\\%$，买家支付 $75\\%$，售价是 $0.75 \\cdot 120 = 90$。折扣额 $30$ 本身是要避开的错误选项。",
    ),
    hardTip: t(
      "Two increases in a row multiply; each applies to the new amount. A price of $200$ marked up $20\\%$, then taxed $5\\%$, is $200(1.2)(1.05) = 252$. Adding the percents to $25\\%$ gives $250$, which ignores tax on the markup. An exact answer may involve cents, so do not round early.",
      "连续两次增长要相乘，每次都作用于新的数额。价格 $200$ 加价 $20\\%$，再加 $5\\%$ 的税，是 $200(1.2)(1.05) = 252$。把百分比相加成 $25\\%$ 得 $250$，忽略了加价部分的税。精确答案可能带小数，不要过早取整。",
    ),
  },
  "sat-exam-finding-original-values-from-percentage-change": {
    tip: t(
      "A new value after an increase is the original times $1 + r$, so divide to recover the original. If a value is $130$ after a $30\\%$ rise, the original is $\\frac{130}{1.3} = 100$. Taking $30\\%$ off the new value, which gives $91$, is the classic mistake, since the percent applied to the original.",
      "增长后的新值等于原值乘 $1 + r$，所以用除法还原原值。若增长 $30\\%$ 后为 $130$，原值就是 $\\frac{130}{1.3} = 100$。从新值中减去 $30\\%$ 得 $91$ 是典型错误，因为百分比是相对原值的。",
    ),
    hardTip: t(
      "A sale price is the remaining share of the original, so divide the price by that share. After $40\\%$ off, the price paid is $60\\%$ of the original: a sale price of $90$ means an original of $\\frac{90}{0.6} = 150$. Adding $40\\%$ back onto the sale price, $126$, is the error to avoid.",
      "售价是原价的剩余比例，所以用售价除以这个比例。打折 $40\\%$ 后，支付的是原价的 $60\\%$：售价 $90$ 意味着原价为 $\\frac{90}{0.6} = 150$。在售价上加回 $40\\%$ 得 $126$，是要避免的错误。",
    ),
  },
  "sat-exam-applying-successive-percentage-changes": {
    tip: t(
      "Each percentage change applies to the most recent value, so multiply the corresponding factors in order. A value of $500$ raised $20\\%$ and then cut $25\\%$ becomes $500(1.2)(0.75) = 450$. Adding the changes to a net $-5\\%$ gives $475$, which is wrong because the bases differ.",
      "每次百分比变化都作用于最新的值，所以按顺序乘对应的因数。$500$ 先升 $20\\%$ 再降 $25\\%$，变成 $500(1.2)(0.75) = 450$。把变化相加成净变化 $-5\\%$ 得 $475$ 是错的，因为基数不同。",
    ),
    hardTip: t(
      "An equal rise and fall do not cancel, since the fall applies to the larger amount. The product of factors is $(1 + r)(1 - r) = 1 - r^2$, always below $1$. A price of $500$ raised $20\\%$ and then cut $20\\%$ ends at $480$, not at the original.",
      "等幅的上升和下降不会抵消，因为下降作用于更大的数。因数之积是 $(1 + r)(1 - r) = 1 - r^2$，总小于 $1$。价格 $500$ 先升 $20\\%$ 再降 $20\\%$，最后是 $480$，回不到原价。",
    ),
  },
  "sat-exam-multistep-percentage-problems": {
    tip: t(
      "Track what is left at each stage: the second percent refers to the remaining items, not the original. If a shop has $400$ books and sells $25\\%$ in June and $50\\%$ of the remainder in July, then $300$ remain after June and $150$ after July. Adding the percents is wrong.",
      "跟踪每个阶段剩下多少：第二个百分比针对的是剩余量，而不是原来的量。书店有 $400$ 本书，六月卖出 $25\\%$，七月卖出剩余的 $50\\%$，那么六月后剩 $300$ 本，七月后剩 $150$ 本。把百分比相加是错的。",
    ),
    hardTip: t(
      "A money story works the same way: remove the first share from the total, then work with what remains. Answer in the requested units, here thousands. With $900$ thousand dollars, costs of $20\\%$ leave $720$; paying $25\\%$ of that leaves $540$ thousand. Report the leftover, not the sum paid out.",
      "金额情境也是同样的道理：先从总额中去掉第一部分，再处理剩下的。按题目要求的单位作答，这里是千美元。$900$ 千美元，成本占 $20\\%$ 后剩 $720$；再付其中的 $25\\%$ 后剩 $540$ 千美元。回答剩余的数额，而不是付出的金额。",
    ),
  },
  "sat-exam-unit-conversions-to-smaller-units-of-length": {
    tip: t(
      "Going to a smaller unit needs more of them, so multiply by the conversion number. Since $1$ foot is $12$ inches, $9$ feet is $108$ inches. If your answer is smaller than the original number, you divided by mistake, which is exactly what the wrong option does.",
      "换算成更小的单位，数量会变多，所以要乘换算数。因为 $1$ 英尺是 $12$ 英寸，$9$ 英尺就是 $108$ 英寸。如果结果比原来的数还小，那就是误做了除法，错误选项正是这样来的。",
    ),
    hardTip: t(
      "A length in two units needs one extra step: convert the larger part by multiplying, then add the smaller part, which is already in the target unit. So $5$ meters and $35$ centimeters is $5(100) + 35 = 535$ centimeters. Reading it as $5.35$ or writing $5035$ both misplace the digits.",
      "用两种单位表示的长度要多一步：把较大单位的部分相乘换算，再加上已是目标单位的较小部分。所以 $5$ 米 $35$ 厘米就是 $5(100) + 35 = 535$ 厘米。写成 $5.35$ 或 $5035$ 都把数位弄错了。",
    ),
  },
  "sat-exam-unit-conversions-to-larger-units-of-length": {
    tip: t(
      "Larger units are fewer, so divide by the conversion number. Since $100$ centimeters make $1$ meter, $700$ centimeters is $7$ meters. Multiply only when going down to a smaller unit; a result larger than where you began means the operation was reversed.",
      "换算成更大的单位，数量会变少，所以要除以换算数。因为 $100$ 厘米是 $1$ 米，$700$ 厘米就是 $7$ 米。只有换算成更小的单位时才相乘；结果比原来更大，说明运算做反了。",
    ),
    hardTip: t(
      "The same division can leave a non-integer, which the answer may show as a decimal or a fraction. For $5500$ meters, divide by $1{,}000$ to get $5.5$ kilometers, the same as $\\frac{11}{2}$. Move the decimal three places left, and check that you moved it the proper way.",
      "同样的除法可能得到非整数，答案可能写成小数或分数。$5500$ 米除以 $1{,}000$ 得 $5.5$ 千米，也就是 $\\frac{11}{2}$。小数点向左移三位，并确认方向正确。",
    ),
  },
  "sat-exam-unit-conversions-between-units-of-mass-and-volume": {
    tip: t(
      "Going from kilograms to grams means a smaller unit, so multiply by $1{,}000$; to go back, divide. Thus $6$ kilograms is $6{,}000$ grams. Use the same reasoning for liters and milliliters. Check the size of the result: grams must come out as a much bigger number.",
      "从千克换算成克是换成更小的单位，所以乘 $1{,}000$；反过来就除。因此 $6$ 千克是 $6{,}000$ 克。升和毫升也是同样的道理。检查结果的大小：克数必须大得多。",
    ),
    hardTip: t(
      "To count portions, first express the whole and the portion in the same unit, then divide. A tank of $3$ liters holds $3{,}000$ milliliters, so servings of $250$ milliliters number $12$. Dividing without converting, $\\frac{3}{250}$, gives an absurdly small count, which is the sign of a unit mismatch.",
      "要数份数，先把总量和每份用同一单位表示，再相除。$3$ 升的容器装 $3{,}000$ 毫升，每份 $250$ 毫升就有 $12$ 份。不换算就除，得 $\\frac{3}{250}$，结果小得离谱，这正是单位不一致的信号。",
    ),
  },
  "sat-exam-two-step-unit-conversions": {
    tip: t(
      "A conversion through a middle unit chains two factors. Hours to seconds goes hours to minutes and minutes to seconds, so multiply by $60$ twice. Thus $3$ hours is $3(60)(60) = 10{,}800$ seconds. Stopping after one factor gives the minutes, which is a listed wrong choice.",
      "经过中间单位的换算要连乘两个因数。小时到秒要经过小时到分钟、分钟到秒，所以乘两次 $60$。因此 $3$ 小时是 $3(60)(60) = 10{,}800$ 秒。只乘一个因数得到的是分钟数，这是预设的错误选项。",
    ),
    hardTip: t(
      "A rate question also involves two steps: multiply the rate by the time to get the amount, then change its unit. A pump giving $3$ gallons per minute for $5$ minutes gives $15$ gallons, or $60$ quarts at $4$ quarts per gallon. The minutes cancel, leaving the required unit.",
      "变化率问题也有两步：用变化率乘时间得到数量，再换算单位。水泵每分钟 $3$ 加仑，运行 $5$ 分钟得 $15$ 加仑，按每加仑 $4$ 夸脱就是 $60$ 夸脱。分钟相互抵消，只留下需要的单位。",
    ),
  },
  "sat-exam-unit-conversions-between-mixed-units": {
    tip: t(
      "A measurement in two units converts to the smaller one in two steps: multiply the larger part by the conversion number and add the smaller part. So $6$ feet $5$ inches is $6(12) + 5 = 77$ inches. Writing $65$ by placing digits together ignores that a foot is $12$ inches.",
      "用两种单位表示的量换算成较小单位要两步：较大单位的部分乘换算数，再加上较小单位的部分。所以 $6$ 英尺 $5$ 英寸是 $6(12) + 5 = 77$ 英寸。把数字拼成 $65$ 忽略了 $1$ 英尺是 $12$ 英寸。",
    ),
    hardTip: t(
      "Durations work the same way, with $60$ as the conversion number. So $4$ hours $15$ minutes is $4(60) + 15 = 255$ minutes. Treating it as a decimal, $4.15$ hours, is wrong: $15$ minutes is a quarter of an hour, not $0.15$ of one.",
      "时长也是同样的道理，换算数是 $60$。所以 $4$ 小时 $15$ 分钟是 $4(60) + 15 = 255$ 分钟。把它当成小数 $4.15$ 小时是错的：$15$ 分钟是四分之一小时，而不是 $0.15$ 小时。",
    ),
  },
  "sat-exam-converting-between-mixed-units-containing-squares": {
    tip: t(
      "A square foot is a square of side $12$ inches, so it holds $12^2 = 144$ square inches, not $12$. Multiply the area by the square of the length conversion number. So $3$ square feet is $432$ square inches. Using the plain length factor gives the wrong option.",
      "一平方英尺是边长 $12$ 英寸的正方形，所以含 $12^2 = 144$ 平方英寸，而不是 $12$。用面积乘长度换算数的平方。所以 $3$ 平方英尺是 $432$ 平方英寸。只用长度换算数就会得到错误选项。",
    ),
    hardTip: t(
      "Apply the same rule to any pair of units: square the length conversion number. With $1$ yard equal to $3$ feet, one square yard is $9$ square feet, so a rug of $7$ square yards covers $63$ square feet. For volume the number would be cubed instead.",
      "任何一对单位都适用同样的规则：把长度换算数平方。$1$ 码等于 $3$ 英尺，一平方码就是 $9$ 平方英尺，所以 $7$ 平方码的地毯覆盖 $63$ 平方英尺。如果是体积，则要取立方。",
    ),
  },
  "sat-exam-ratios": {
    tip: t(
      "A ratio of a part to the whole needs the whole, which is the sum of the parts. With $18$ cats and $6$ dogs, the ratio of cats to all pets is $\\frac{18}{24} = \\frac{3}{4}$. Comparing cats with dogs instead gives a part-to-part ratio, a distinct question that the options exploit.",
      "部分与整体之比需要整体，也就是各部分之和。有 $18$ 只猫和 $6$ 只狗时，猫与所有宠物之比是 $\\frac{18}{24} = \\frac{3}{4}$。拿猫与狗比，得到的是部分与部分之比，这是另一个问题，选项正利用了这一点。",
    ),
    hardTip: t(
      "From a ratio and one actual value, find the scale factor by dividing the value by its part in the ratio, then multiply the other part by it. With a ratio $3:5$ and the first value $21$, the scale is $7$, so the second value is $35$. Adding a fixed difference does not preserve a ratio.",
      "已知比例和一个实际值时，用这个值除以它在比例中的份数，求出比例系数，再乘另一份。比例为 $3:5$、第一个值为 $21$ 时，系数是 $7$，第二个值就是 $35$。加固定的差值不能保持比例。",
    ),
  },
  "sat-exam-applying-ratios": {
    tip: t(
      "A ratio $a:b$ splits a total into $a + b$ equal parts. Divide the total by the number of parts, then multiply by the share you want. Flour and sugar in the ratio $5:3$, with $40$ cups in all: one part is $5$ cups, so flour is $25$ cups. Dividing the total by one ratio number alone is wrong.",
      "比例 $a:b$ 把总量分成 $a + b$ 等份。用总量除以份数，再乘所要的份数。面粉与糖之比为 $5:3$，共 $40$ 杯：一份是 $5$ 杯，面粉就是 $25$ 杯。只用其中一个比例数去除总量是错的。",
    ),
    hardTip: t(
      "Starting from one ingredient, reverse the steps: divide its amount by its ratio number to get one part, then multiply by the total parts. With flour to sugar $5:3$ and $25$ cups of flour, one part is $5$, so the mixture totals $8(5) = 40$ cups. Report the total, not just the other ingredient.",
      "从一种成分出发时，把步骤反过来：用它的量除以它的比例数，得到一份，再乘总份数。面粉与糖之比为 $5:3$，面粉 $25$ 杯，一份是 $5$，总量就是 $8(5) = 40$ 杯。要回答总量，而不只是另一种成分。",
    ),
  },
  "sat-exam-working-with-ratios-in-various-settings": {
    tip: t(
      "A map scale is a constant rate. Find the value of one unit by dividing, then multiply by the number of units required. If $4$ centimeters represent $100$ kilometers, one centimeter is $25$ kilometers, and $3$ centimeters represent $75$ kilometers. Setting up the proportion also works if the units line up.",
      "地图比例尺是固定的比率。用除法求出一个单位代表多少，再乘所需的单位数。若 $4$ 厘米代表 $100$ 千米，一厘米就是 $25$ 千米，$3$ 厘米代表 $75$ 千米。单位对齐时，列比例式也可以。",
    ),
    hardTip: t(
      "With two linked ratios, work through the shared variable step by step. If $a:b = 5:3$ and $b:c = 2:7$ and $c = 21$: since $21$ is $3$ times $7$, $b = 6$, and then $a = \\frac{5}{3}(6) = 10$. The two ratio numbers for $b$ differ, so do not simply line them up side by side.",
      "两个比例相连时，通过共同的变量一步步推。若 $a:b = 5:3$、$b:c = 2:7$ 且 $c = 21$：因为 $21$ 是 $7$ 的 $3$ 倍，所以 $b = 6$，于是 $a = \\frac{5}{3}(6) = 10$。两个比例中 $b$ 对应的数不同，不能直接并排对应。",
    ),
  },
  "sat-exam-rate-problems": {
    tip: t(
      "A total is the rate multiplied by the time, and the units confirm it: pages per minute times minutes leaves pages. A machine making $7$ parts per minute makes $35$ parts in $5$ minutes. Dividing instead gives a meaningless number of minutes per part, which the options may include.",
      "总量等于变化率乘时间，单位也能印证：每分钟的页数乘分钟，剩下的就是页数。每分钟生产 $7$ 个零件的机器，$5$ 分钟生产 $35$ 个。做除法得到的是每个零件用时之类的无关数字，选项中可能有它。",
    ),
    hardTip: t(
      "If the rate is hidden, first find the unit rate by dividing the given amount by the given time, then multiply by the new time. Someone paid $60$ dollars for $5$ hours earns $12$ per hour, so $3$ hours pay $36$. Scaling by adding hours rather than by multiplying breaks the proportion.",
      "如果变化率没有直接给出，先用已知的量除以已知的时间，求出单位变化率，再乘新的时间。$5$ 小时挣 $60$ 美元，每小时就是 $12$ 美元，$3$ 小时挣 $36$ 美元。按加减小时数来估算会破坏比例关系。",
    ),
  },
  "sat-exam-multistep-rate-problems": {
    tip: t(
      "Chain the rates so that units cancel. First find the count produced, then the value per item, and finally multiply. A press makes $30$ labels per hour, and packs of $5$ labels sell for $10$ dollars, so each label is worth $2$ dollars; in $3$ hours it makes $90$ labels, worth $180$ dollars.",
      "把几个变化率连起来，让单位相互抵消。先求产量，再求每件的价值，最后相乘。印刷机每小时印 $30$ 张标签，每包 $5$ 张卖 $10$ 美元，所以每张值 $2$ 美元；$3$ 小时印 $90$ 张，价值 $180$ 美元。",
    ),
    hardTip: t(
      "When two machines work together, their rates add. Then time is the amount divided by the combined rate. Pumps of $15$ and $25$ liters per minute together deliver $40$ per minute, so $120$ liters take $3$ minutes. Averaging the separate times, or adding them, does not model joint work.",
      "两台机器一起工作时，变化率相加。时间等于总量除以合计变化率。每分钟 $15$ 升和 $25$ 升的水泵合起来每分钟 $40$ 升，所以 $120$ 升要 $3$ 分钟。把各自的时间平均或相加，都不能表示合作。",
    ),
  },
  "sat-exam-speed-problems": {
    tip: t(
      "Distance equals speed times time, as long as the time is in the unit used by the speed. At $55$ miles per hour for $4$ hours, the distance is $220$ miles. If a duration comes in minutes, convert it to hours first. Dividing here would give hours per mile.",
      "距离等于速度乘时间，前提是时间的单位与速度一致。以每小时 $55$ 英里行驶 $4$ 小时，距离是 $220$ 英里。如果时长以分钟给出，要先换算成小时。这里做除法得到的是每英里的用时。",
    ),
    hardTip: t(
      "Average speed is total distance over total time, not the average of the speeds. Find each leg's distance, add them, and divide by the total hours. Driving $30$ miles per hour for $1$ hour and $60$ for $2$ hours covers $150$ miles in $3$ hours, an average of $50$, not $45$.",
      "平均速度等于总路程除以总时间，而不是速度的平均。求出每段路程，相加，再除以总小时数。以每小时 $30$ 英里行驶 $1$ 小时，再以 $60$ 英里行驶 $2$ 小时，$3$ 小时共 $150$ 英里，平均速度是 $50$，不是 $45$。",
    ),
  },
  "sat-exam-solving-equations-describing-proportional-relationships": {
    tip: t(
      "Direct proportion means $y = kx$, so the ratio $\\frac{y}{x}$ stays fixed. Use the known pair to find $k$, then multiply by the new input. If $y = 12$ when $x = 3$, then $k = 4$, and for $x = 10$ we get $y = 40$. Adding the difference in inputs is not proportional reasoning.",
      "正比例意味着 $y = kx$，所以比值 $\\frac{y}{x}$ 不变。用已知的一组数求 $k$，再乘新的输入。若 $x = 3$ 时 $y = 12$，则 $k = 4$，$x = 10$ 时 $y = 40$。把输入的差直接加上去并不是比例思维。",
    ),
    hardTip: t(
      "To solve a proportion with the variable on top, simplify the known fraction, then multiply both sides by the unknown's denominator. For $\\frac{x}{3} = \\frac{40}{10}$: the right side is $4$, so $x = 12$. Cross-multiplying gives $10x = 120$, the same result, and a useful check.",
      "解变量在分子上的比例式时，先化简已知的分数，再两边同乘未知数的分母。对 $\\frac{x}{3} = \\frac{40}{10}$：右边是 $4$，所以 $x = 12$。交叉相乘得 $10x = 120$，结果相同，可以用来检验。",
    ),
  },
  "sat-exam-calculating-density": {
    tip: t(
      "Density is mass per unit of volume, so divide mass by volume: $\\rho = \\frac{m}{V}$. A block of $48$ grams and $6$ cubic centimeters has density $8$ grams per cubic centimeter. The units in the question tell you the order: grams on top, volume below.",
      "密度是单位体积的质量，所以用质量除以体积：$\\rho = \\frac{m}{V}$。$48$ 克、$6$ 立方厘米的物块，密度是每立方厘米 $8$ 克。题目中的单位告诉你顺序：克在上，体积在下。",
    ),
    hardTip: t(
      "To find mass, compute the volume first from the shape, then multiply by density: $m = \\rho V$. A cube of side $3$ centimeters has volume $27$, so at density $5$ its mass is $135$ grams. Forgetting to cube the side, or squaring it, is the error to watch for.",
      "要求质量，先根据形状算出体积，再乘密度：$m = \\rho V$。边长 $3$ 厘米的正方体体积是 $27$，密度为 $5$ 时质量是 $135$ 克。忘了把边长立方，或者只平方，都是要留意的错误。",
    ),
  },
  "sat-exam-descriptions-of-physical-phenomena": {
    tip: t(
      "To see how a formula responds to a change, follow the variable's power. If a quantity is squared, multiplying it by $n$ multiplies the output by $n^2$; the constant in front does not matter. For $F = 3s^2$, multiplying $s$ by $4$ multiplies $F$ by $16$. A factor of just $4$ forgets the square.",
      "要看公式如何随变化而变，就盯住变量的幂次。若某个量被平方，把它乘 $n$，输出就乘 $n^2$；前面的常数无关紧要。对 $F = 3s^2$，把 $s$ 乘 $4$，$F$ 就乘 $16$。只乘 $4$ 就忘了平方。",
    ),
    hardTip: t(
      "When a formula has the variable in a denominator, the output falls as the variable grows. Substitute the new value directly and compute. For $I = \\frac{60}{R}$, changing $R$ from $5$ to $20$ gives $I = 3$. The earlier value of the variable is extra information, and need not enter the calculation.",
      "公式中变量在分母时，变量增大，输出就减小。直接代入新的值计算。对 $I = \\frac{60}{R}$，$R$ 从 $5$ 变到 $20$ 时，$I = 3$。变量原来的值是多余信息，不必参与计算。",
    ),
  },
  "sat-exam-corresponding-angles": {
    tip: t(
      "When a transversal crosses parallel lines, corresponding angles sit in matching positions at each crossing, and they are equal. So if one marked angle is given, the matching one has the same measure, and no arithmetic is needed. Do not subtract from $180$; that is for angles on the same side between the lines.",
      "截线穿过平行线时，同位角位于每个交点的对应位置，而且相等。所以已知一个标出的角，对应的角度数相同，不需要计算。不要用 $180$ 去减，那是用于两线之间同旁的角。",
    ),
    hardTip: t(
      "If the corresponding angles are given as expressions, set them equal and solve. For $3x + 5$ and $5x - 15$: $3x + 5 = 5x - 15$, so $x = 10$. The answer here is the variable, not the angle measure. Adding the expressions to $180$ applies the wrong rule.",
      "同位角用表达式给出时，令它们相等再求解。对 $3x + 5$ 和 $5x - 15$：$3x + 5 = 5x - 15$，所以 $x = 10$。这里的答案是变量，不是角的度数。让它们加起来等于 $180$ 就用错了规则。",
    ),
  },
  "sat-exam-consecutive-angles": {
    tip: t(
      "Consecutive interior angles lie between the parallel lines on the same side of the transversal, and they add to $180^\\circ$. So subtract the known angle from $180$: if one is $115^\\circ$, the other is $65^\\circ$. Setting them equal is the error, which treats them as corresponding angles.",
      "同旁内角位于平行线之间、截线同一侧，它们的和是 $180^\\circ$。所以用 $180$ 减去已知角：若一个是 $115^\\circ$，另一个就是 $65^\\circ$。令它们相等就错了，那是把它们当成了同位角。",
    ),
    hardTip: t(
      "With expressions for the angles, add them, set the sum to $180$, and solve. For $5x + 20$ and $3x + 40$: $8x + 60 = 180$, so $x = 15$. Combine like terms before subtracting. The value of $x$ is not itself an angle; substitute if a measure is wanted.",
      "角用表达式表示时，把它们相加，令和为 $180$，再求解。对 $5x + 20$ 和 $3x + 40$：$8x + 60 = 180$，所以 $x = 15$。减之前先合并同类项。$x$ 的值本身不是角度，要求度数时还得代入。",
    ),
  },
  "sat-exam-vertical-angles": {
    tip: t(
      "Where two lines cross, the opposite angles are vertical angles and are equal. So the angle across from a marked $40^\\circ$ angle is also $40^\\circ$. An angle next to it, in contrast, is supplementary, making $140^\\circ$. Check which pair the figure marks, opposite or adjacent.",
      "两条直线相交时，相对的角是对顶角，它们相等。所以 $40^\\circ$ 角对面的角也是 $40^\\circ$。相邻的角则互补，是 $140^\\circ$。看清图中标的是哪一对：相对的还是相邻的。",
    ),
    hardTip: t(
      "If the two vertical angles are expressions, make an equation by setting them equal. Then collect $x$ on one side and numbers on the other. For $4x + 3$ and $5x - 9$: $x = 12$. You can check by substituting: both become $51$. Using $180$ here would apply the rule for adjacent angles.",
      "两个对顶角是表达式时，令它们相等列方程，再把 $x$ 集中到一边、常数移到另一边。对 $4x + 3$ 和 $5x - 9$：$x = 12$。代入检验，两者都是 $51$。这里用 $180$ 就错用了邻角的规则。",
    ),
  },
  "sat-exam-problem-solving-with-corresponding-angles": {
    tip: t(
      "Move a known angle to where it is useful: the corresponding angle on the other parallel line has the same measure, and it may be inside a triangle. Then apply the angle sum. If the moved angle is $70^\\circ$ and another triangle angle is $45^\\circ$, the third is $65^\\circ$. Use both facts, in order.",
      "把已知角移到有用的地方：另一条平行线上的同位角度数相同，而它可能就在三角形内。再用内角和。若移过来的角是 $70^\\circ$，三角形另一个角是 $45^\\circ$，第三个角就是 $65^\\circ$。两个事实要依次用上。",
    ),
    hardTip: t(
      "Sometimes the link needs a supplementary step. Subtract the given angle from $180$ to find the corresponding angle, then set the expression equal to it. If $5x$ corresponds to an angle supplementary to $130^\\circ$, then $5x = 50$ and $x = 10$. Setting the expression equal to the given angle skips that step.",
      "有时这个联系需要多一步互补。用 $180$ 减去已知角，求出同位角，再令表达式等于它。若 $5x$ 的同位角与 $130^\\circ$ 互补，则 $5x = 50$，$x = 10$。直接令表达式等于已知角就跳过了这一步。",
    ),
  },
  "sat-exam-interior-angles-of-triangles": {
    tip: t(
      "The three angles of any triangle add to $180^\\circ$. To find the unknown, subtract the two known angles from $180$. With $62^\\circ$ and $75^\\circ$, the third is $43^\\circ$. Read the figure carefully, as a marked angle outside the triangle would not belong in this sum.",
      "任何三角形的三个内角之和都是 $180^\\circ$。要求未知角，用 $180$ 减去两个已知角。已知 $62^\\circ$ 和 $75^\\circ$，第三个角是 $43^\\circ$。看图要仔细，标在三角形外面的角不能算进这个和。",
    ),
    hardTip: t(
      "With expressions for some angles, add all three, set the sum equal to $180$, and solve. For $x^\\circ$, $3x^\\circ$ and $80^\\circ$: $4x + 80 = 180$, so $x = 25$. Remember the plain $x$ counts as $1x$ when combining. Then check that the angles add up.",
      "部分角用表达式表示时，把三个角相加，令和等于 $180$，再求解。对 $x^\\circ$、$3x^\\circ$ 和 $80^\\circ$：$4x + 80 = 180$，所以 $x = 25$。合并时单独的 $x$ 要算作 $1x$。最后检验三个角的和。",
    ),
  },
  "sat-exam-interior-angles-of-special-triangles": {
    tip: t(
      "In an isosceles triangle, the angles opposite the equal sides are equal. Given the vertex angle, subtract it from $180$ and split the rest evenly. With a vertex angle of $40^\\circ$, each base angle is $\\frac{140}{2} = 70^\\circ$. Forgetting to halve is the trap.",
      "等腰三角形中，等边所对的角相等。已知顶角时，用 $180$ 减去它，再把余下的平分。顶角为 $40^\\circ$ 时，每个底角是 $\\frac{140}{2} = 70^\\circ$。这里的陷阱是忘了除以 $2$。",
    ),
    hardTip: t(
      "Given one base angle, the other base angle matches it, so subtract twice the base angle from $180$ to find the vertex. With a base angle of $35^\\circ$, the vertex is $180 - 70 = 110^\\circ$. Subtracting the base angle once gives the wrong value, since two angles are at the base.",
      "已知一个底角时，另一个底角与它相等，所以用 $180$ 减去底角的两倍，就得到顶角。底角为 $35^\\circ$ 时，顶角是 $180 - 70 = 110^\\circ$。只减一次底角是错的，因为底边上有两个角。",
    ),
  },
  "sat-exam-exterior-angles-of-triangles": {
    tip: t(
      "An exterior angle of a triangle equals the sum of the two interior angles not next to it. So with remote angles of $50^\\circ$ and $65^\\circ$, the exterior angle at the third vertex is $115^\\circ$. You need not find the third interior angle, which is the supplement and a tempting wrong answer.",
      "三角形的外角等于与它不相邻的两个内角之和。所以两个不相邻的内角为 $50^\\circ$ 和 $65^\\circ$ 时，第三个顶点处的外角是 $115^\\circ$。不必求第三个内角，它与外角互补，是个诱人的错误答案。",
    ),
    hardTip: t(
      "With expressions for the remote angles, set their sum equal to the exterior angle and solve. For $x^\\circ$ and $(3x + 20)^\\circ$ with an exterior angle of $120^\\circ$: $4x + 20 = 120$, so $x = 25$. The equation is against the exterior angle, not $180$, which is the rule for interior angles.",
      "不相邻的内角用表达式表示时，令它们的和等于外角再求解。对 $x^\\circ$、$(3x + 20)^\\circ$ 和外角 $120^\\circ$：$4x + 20 = 120$，所以 $x = 25$。方程右边是外角而不是 $180$，后者是内角和的规则。",
    ),
  },
  "sat-exam-solving-problems-with-multiple-triangles": {
    tip: t(
      "When two triangles meet at a point, the vertical angles at that crossing are equal and connect them. Find the shared angle from the first triangle by the angle sum, then use it in the second. If one triangle has angles $50^\\circ$ and $60^\\circ$, the crossing angle is $70^\\circ$, and with $45^\\circ$ the last angle is $65^\\circ$.",
      "两个三角形交于一点时，交点处的对顶角相等，把它们联系起来。先用内角和从第一个三角形求出这个角，再用到第二个三角形。若一个三角形有 $50^\\circ$ 和 $60^\\circ$，交点处的角是 $70^\\circ$，再加上 $45^\\circ$，最后一个角就是 $65^\\circ$。",
    ),
    hardTip: t(
      "Two triangles have $360^\\circ$ in total, so you may treat all their angles together. Subtract the four known angles from $360$ to get the sum of the remaining two, with no need to find each. With known angles $30^\\circ$, $50^\\circ$, $40^\\circ$ and $60^\\circ$, the remaining sum is $180^\\circ$.",
      "两个三角形的内角合计 $360^\\circ$，所以可以把所有角放在一起考虑。用 $360$ 减去四个已知角，就得到其余两个角的和，不必分别求。已知角为 $30^\\circ$、$50^\\circ$、$40^\\circ$ 和 $60^\\circ$ 时，其余两角之和是 $180^\\circ$。",
    ),
  },
  "sat-exam-interior-and-exterior-angles-in-connected-triangles": {
    tip: t(
      "If a point lies on a side of a triangle, a segment from it creates a smaller triangle. The angle on the far side of that segment is an exterior angle of the smaller triangle, and equals the sum of its two remote angles. With remote angles of $35^\\circ$ and $25^\\circ$, it is $60^\\circ$.",
      "若一点在三角形的一条边上，从它引出的线段形成一个较小的三角形。线段另一侧的角是这个小三角形的外角，等于它的两个不相邻内角之和。不相邻的内角为 $35^\\circ$ 和 $25^\\circ$ 时，这个角就是 $60^\\circ$。",
    ),
    hardTip: t(
      "Step back to the large triangle: its angle at the split vertex is the sum of the two pieces. Then use the angle sum for the whole. If the pieces are $20^\\circ$ and $30^\\circ$, and another angle is $40^\\circ$, the last is $180 - 50 - 40 = 90^\\circ$. Forgetting a piece gives a wrong result.",
      "退一步看大三角形：被分开的顶点处的角等于两部分之和。再对整个三角形用内角和。若两部分是 $20^\\circ$ 和 $30^\\circ$，另一个角是 $40^\\circ$，最后一个角就是 $180 - 50 - 40 = 90^\\circ$。漏掉一部分就会算错。",
    ),
  },
  "sat-exam-areas-of-rectangles-and-squares": {
    tip: t(
      "The area of a rectangle is its length times its width, in square units. A $9$ by $5$ rectangle has area $45$. Adding the sides instead gives half of the perimeter, a typical wrong option, so check whether the question wants the space inside or the distance around.",
      "矩形的面积等于长乘宽，单位是平方单位。$9$ 乘 $5$ 的矩形面积是 $45$。把边相加得到的是周长的一半，这是典型的错误选项，所以要看清问的是内部的面积还是周围的长度。",
    ),
    hardTip: t(
      "Link two shapes through the shared measure. From a square's area, take the square root for its side, then its perimeter is four sides. A rectangle with that perimeter has length plus width equal to half of it. Square area $100$ gives perimeter $40$; width $8$ gives length $12$ and area $96$.",
      "通过共同的量把两个图形联系起来。由正方形的面积开方得到边长，周长是四条边。周长相同的矩形，长加宽等于周长的一半。正方形面积 $100$，周长为 $40$；宽为 $8$ 时长为 $12$，面积为 $96$。",
    ),
  },
  "sat-exam-perimeters-of-squares-rectangles-and-triangles": {
    tip: t(
      "A perimeter is the distance around, so add all the sides. A rectangle has two pairs of equal sides, giving $2(\\ell + w)$. A $9$ by $5$ rectangle has perimeter $28$. Adding only two sides gives half the answer, and multiplying gives the area; both appear as distractors.",
      "周长是周围一圈的长度，所以把所有边相加。矩形有两组相等的边，周长是 $2(\\ell + w)$。$9$ 乘 $5$ 的矩形周长是 $28$。只加两条边得到一半，相乘得到面积，两者都是干扰项。",
    ),
    hardTip: t(
      "If one side is a multiple of the other, call the width $x$, express the length in terms of $x$, and write the perimeter. Then solve and report the side asked for. With a length $4$ times the width and perimeter $30$: $10x = 30$, so the width is $3$ and the length is $12$.",
      "如果一边是另一边的倍数，设宽为 $x$，用 $x$ 表示长，再写出周长。解出后回答所问的边。长是宽的 $4$ 倍、周长为 $30$ 时：$10x = 30$，所以宽为 $3$，长为 $12$。",
    ),
  },
  "sat-exam-calculating-areas-in-the-coordinate-plane": {
    tip: t(
      "For a rectangle with sides parallel to the axes, each side length is the difference of the coordinates that change: subtract the $x$-values for one side and the $y$-values for the other. Vertices at $(-2, 1)$, $(4, 1)$ and $(4, 6)$ give sides $6$ and $5$, so the area is $30$. Subtract negatives carefully.",
      "边与坐标轴平行的矩形，每条边的长度等于变化的那个坐标之差：用 $x$ 值相减得一条边，用 $y$ 值相减得另一条。顶点 $(-2, 1)$、$(4, 1)$ 和 $(4, 6)$ 给出边长 $6$ 和 $5$，面积是 $30$。减负数时要小心。",
    ),
    hardTip: t(
      "For a triangle, choose a horizontal side as the base. Its length comes from the $x$-values, and the height is the vertical distance from the third vertex to the base's line. The third vertex's $x$ does not matter. For $(0, 2)$, $(10, 2)$ and $(3, 8)$: base $10$, height $6$, area $30$.",
      "对三角形，选一条水平边作底。底长由 $x$ 值得出，高是第三个顶点到底边所在直线的竖直距离。第三个顶点的 $x$ 值无关紧要。对 $(0, 2)$、$(10, 2)$ 和 $(3, 8)$：底为 $10$，高为 $6$，面积为 $30$。",
    ),
  },
  "sat-exam-constructing-functions-representing-area-and-perimeter": {
    tip: t(
      "Write each side in terms of the variable, then multiply for area. If the width is $x$ and the length is $9$ more, then $A(x) = x(x + 9)$. A function for area must have two factors with $x$, so forms such as $2x + 9$, which is linear, cannot describe the space inside.",
      "用变量表示每条边，再相乘得到面积。若宽为 $x$，长比宽多 $9$，则 $A(x) = x(x + 9)$。面积函数必须有两个含 $x$ 的因式，所以 $2x + 9$ 这种线性形式不可能表示内部的面积。",
    ),
    hardTip: t(
      "Given the perimeter, length plus width is half of it, so the length is that half minus $x$. Then multiply by the width. For perimeter $30$ and width $x$: length $15 - x$, so $A(x) = x(15 - x)$. Using the full perimeter in the subtraction, $30 - x$, is the trap.",
      "已知周长时，长加宽等于周长的一半，所以长等于这一半减 $x$。再乘宽。周长 $30$、宽 $x$ 时：长为 $15 - x$，所以 $A(x) = x(15 - x)$。用整个周长去减，写成 $30 - x$，就落入陷阱了。",
    ),
  },
  "sat-exam-areas-of-right-triangles": {
    tip: t(
      "The legs of a right triangle are perpendicular, so one is the base and the other the height: the area is half of their product. Legs of $10$ and $7$ give an area of $35$. Omitting the half gives the area of a whole rectangle, which is the usual wrong choice.",
      "直角三角形的两条直角边互相垂直，一条作底、一条作高，面积是它们乘积的一半。直角边为 $10$ 和 $7$ 时，面积是 $35$。漏掉一半得到的是整个矩形的面积，这是常见的错误选择。",
    ),
    hardTip: t(
      "The area requires both legs, not the hypotenuse. If one leg is missing, recover it with the Pythagorean theorem: $b = \\sqrt{c^2 - a^2}$. For leg $9$ and hypotenuse $41$: $b = \\sqrt{1681 - 81} = 40$, so the area is $180$. Multiplying the leg by the hypotenuse is wrong, as they are not perpendicular.",
      "面积需要两条直角边，而不是斜边。缺一条直角边时，用勾股定理求出：$b = \\sqrt{c^2 - a^2}$。直角边 $9$、斜边 $41$：$b = \\sqrt{1681 - 81} = 40$，面积是 $180$。把直角边与斜边相乘是错的，因为它们不垂直。",
    ),
  },
  "sat-exam-the-pythagorean-theorem": {
    tip: t(
      "In a right triangle, the squares of the legs add up to the square of the hypotenuse: $a^2 + b^2 = c^2$. For legs $8$ and $15$: $64 + 225 = 289$, so $c = 17$. Adding the legs directly gives $23$, which exceeds any possible hypotenuse here; remember to take the root.",
      "在直角三角形中，两条直角边的平方和等于斜边的平方：$a^2 + b^2 = c^2$。直角边为 $8$ 和 $15$ 时：$64 + 225 = 289$，所以 $c = 17$。直接把直角边相加得 $23$，这不可能是斜边；记得开方。",
    ),
    hardTip: t(
      "When the hypotenuse is known and a leg is missing, subtract instead: $b^2 = c^2 - a^2$. The hypotenuse is always the longest side. For hypotenuse $17$ and leg $15$: $289 - 225 = 64$, so the leg is $8$. Adding the squares here would give a leg longer than the hypotenuse, which is impossible.",
      "已知斜边、缺一条直角边时，要做减法：$b^2 = c^2 - a^2$。斜边总是最长的边。斜边 $17$、直角边 $15$：$289 - 225 = 64$，所以直角边是 $8$。在这里把平方相加，直角边就比斜边还长，这不可能。",
    ),
  },
  "sat-exam-modeling-situations-using-the-pythagorean-theorem": {
    tip: t(
      "Movements at right angles, such as north then east, form the legs of a right triangle, and the straight-line distance back is the hypotenuse. A walk of $6$ blocks north and $8$ east ends $10$ blocks away. Adding the two lengths gives the distance walked, not the distance from the start.",
      "互相垂直的移动，比如先向北再向东，构成直角三角形的两条直角边，回到起点的直线距离就是斜边。向北走 $6$ 个街区、向东走 $8$ 个街区，离起点 $10$ 个街区。两段相加得到的是走过的路程，不是离起点的距离。",
    ),
    hardTip: t(
      "With a ladder against a wall, the ladder is the hypotenuse, and the wall and the ground are the legs. Subtract squares to find the height: for a $10$-foot ladder with its base $6$ feet out, $\\sqrt{100 - 36} = 8$ feet. Treating the ladder as a leg is the trap.",
      "梯子靠在墙上时，梯子是斜边，墙和地面是直角边。用平方相减求高度：$10$ 英尺的梯子，底部离墙 $6$ 英尺，则 $\\sqrt{100 - 36} = 8$ 英尺。把梯子当作直角边就落入了陷阱。",
    ),
  },
  "sat-exam-problem-solving-with-isosceles-right-triangles": {
    tip: t(
      "In a $45$-$45$-$90$ triangle, the two legs are equal and the hypotenuse is a leg times $\\sqrt{2}$. With legs of $7$, the hypotenuse is $7\\sqrt{2}$. This follows from $7^2 + 7^2 = 2 \\cdot 7^2$. Doubling the leg, which gives $14$, is the common wrong option.",
      "在 $45$-$45$-$90$ 三角形中，两条直角边相等，斜边等于直角边乘 $\\sqrt{2}$。直角边为 $7$ 时，斜边是 $7\\sqrt{2}$。这来自 $7^2 + 7^2 = 2 \\cdot 7^2$。把直角边加倍得 $14$ 是常见的错误选项。",
    ),
    hardTip: t(
      "From the hypotenuse, divide by $\\sqrt{2}$ to get the leg, then use the area formula. Notice that $\\text{leg}^2 = \\frac{c^2}{2}$, so the area is $\\frac{c^2}{4}$. For a hypotenuse of $10$, the area is $25$. Using the hypotenuse as a base without a matching height is the trap.",
      "由斜边除以 $\\sqrt{2}$ 得直角边，再用面积公式。注意 $\\text{leg}^2 = \\frac{c^2}{2}$（leg 为直角边），所以面积是 $\\frac{c^2}{4}$。斜边为 $10$ 时，面积是 $25$。把斜边当底却没有对应的高，就落入了陷阱。",
    ),
  },
  "sat-exam-problem-solving-with-special-triangles": {
    tip: t(
      "A $30$-$60$-$90$ triangle has sides in the ratio $1 : \\sqrt{3} : 2$. The shortest side, opposite $30^\\circ$, is half the hypotenuse. So a short side of $6$ gives a hypotenuse of $12$. Do not mix in $\\sqrt{3}$ here; it belongs to the middle side only.",
      "$30$-$60$-$90$ 三角形的三边之比是 $1 : \\sqrt{3} : 2$。$30^\\circ$ 所对的最短边是斜边的一半。所以短边为 $6$ 时，斜边是 $12$。这里不要掺入 $\\sqrt{3}$，它只属于中间那条边。",
    ),
    hardTip: t(
      "To go from the hypotenuse to the side opposite $60^\\circ$, halve first to get the short side, then multiply by $\\sqrt{3}$. For a hypotenuse of $18$: short side $9$, middle side $9\\sqrt{3}$. Multiplying the hypotenuse directly by $\\sqrt{3}$ skips the halving and is wrong.",
      "从斜边求 $60^\\circ$ 所对的边，要先减半得到短边，再乘 $\\sqrt{3}$。斜边为 $18$ 时：短边为 $9$，中间的边为 $9\\sqrt{3}$。直接把斜边乘 $\\sqrt{3}$ 跳过了减半这一步，是错的。",
    ),
  },
  "sat-exam-further-problem-solving-with-special-triangles": {
    tip: t(
      "An altitude of an equilateral triangle splits it into two $30$-$60$-$90$ triangles, whose short side is half the side length. The height is that half times $\\sqrt{3}$, so $h = \\frac{s\\sqrt{3}}{2}$. For side $8$: $h = 4\\sqrt{3}$. Using the full side as the short leg doubles the answer.",
      "等边三角形的高把它分成两个 $30$-$60$-$90$ 三角形，短边是边长的一半。高等于这一半乘 $\\sqrt{3}$，所以 $h = \\frac{s\\sqrt{3}}{2}$。边长为 $8$ 时：$h = 4\\sqrt{3}$。把整条边当作短直角边，答案就翻倍了。",
    ),
    hardTip: t(
      "The area is half of base times height, using the height from the split: $A = \\frac{s^2\\sqrt{3}}{4}$. For side $8$: $\\frac{1}{2}(8)(4\\sqrt{3}) = 16\\sqrt{3}$. When the answer is written as $k\\sqrt{3}$, report the number in front, not the whole area.",
      "面积等于底乘高的一半，用分割得到的高：$A = \\frac{s^2\\sqrt{3}}{4}$。边长为 $8$ 时：$\\frac{1}{2}(8)(4\\sqrt{3}) = 16\\sqrt{3}$。答案写成 $k\\sqrt{3}$ 时，回答前面的数，而不是整个面积。",
    ),
  },
  "sat-exam-solving-right-triangle-problems-by-manipulating-radicals": {
    tip: t(
      "Squaring a product with a radical squares both factors: $(a\\sqrt{b})^2 = a^2 b$. Apply it to each leg, then add. For legs $3\\sqrt{5}$ and $\\sqrt{5}$: $45 + 5 = 50$. Forgetting to square the outside number, or keeping the radical, gives the wrong sum.",
      "含根式的乘积平方时，两个因数都要平方：$(a\\sqrt{b})^2 = a^2 b$。对每条直角边都这样算，再相加。直角边为 $3\\sqrt{5}$ 和 $\\sqrt{5}$：$45 + 5 = 50$。忘了把外面的数平方，或者保留根号，和就错了。",
    ),
    hardTip: t(
      "When both legs share a radical, factor it out and spot a familiar triple. Legs $6\\sqrt{3}$ and $8\\sqrt{3}$ are $2\\sqrt{3}$ times $3$ and $4$, so the hypotenuse is $2\\sqrt{3} \\cdot 5 = 10\\sqrt{3}$. Direct squaring gives $108 + 192 = 300$, which simplifies to the same value. Do not add the legs.",
      "两条直角边有相同的根式时，提出来并看出熟悉的勾股数。直角边 $6\\sqrt{3}$ 和 $8\\sqrt{3}$ 是 $2\\sqrt{3}$ 乘 $3$ 和 $4$，所以斜边是 $2\\sqrt{3} \\cdot 5 = 10\\sqrt{3}$。直接平方得 $108 + 192 = 300$，化简结果相同。不要把直角边相加。",
    ),
  },
  "sat-exam-radians": {
    tip: t(
      "Since $180^\\circ$ equals $\\pi$ radians, convert degrees to radians by multiplying by $\\frac{\\pi}{180}$, then simplify the fraction. So $45^\\circ$ is $\\frac{\\pi}{4}$ radians, and $150^\\circ$ is $\\frac{5\\pi}{6}$. Using the reciprocal fraction leaves a $\\pi$ in the wrong place, which marks an incorrect option.",
      "因为 $180^\\circ$ 等于 $\\pi$ 弧度，所以把度化为弧度要乘 $\\frac{\\pi}{180}$，再约分。所以 $45^\\circ$ 是 $\\frac{\\pi}{4}$ 弧度，$150^\\circ$ 是 $\\frac{5\\pi}{6}$。用了倒数，$\\pi$ 就会出现在错误的位置，这正是错误选项的特征。",
    ),
    hardTip: t(
      "To go back to degrees, multiply radians by $\\frac{180}{\\pi}$, so that $\\pi$ cancels. So $\\frac{3\\pi}{4}$ radians is $\\frac{3}{4} \\cdot 180 = 135^\\circ$. A quick way is to replace $\\pi$ by $180$ and simplify. If a $\\pi$ survives in your answer, the conversion went the wrong way.",
      "要换回度，把弧度乘 $\\frac{180}{\\pi}$，使 $\\pi$ 约去。所以 $\\frac{3\\pi}{4}$ 弧度是 $\\frac{3}{4} \\cdot 180 = 135^\\circ$。快捷做法是把 $\\pi$ 换成 $180$ 再化简。如果答案里还留着 $\\pi$，说明换算方向错了。",
    ),
  },
  "sat-exam-arc-lengths-of-sectors": {
    tip: t(
      "An arc is the same fraction of the circumference as its central angle is of the full circle: $\\text{arc} = \\frac{\\theta}{360} \\cdot 2\\pi r$. For radius $12$ and angle $60^\\circ$: $\\frac{1}{6}(24\\pi) = 4\\pi$. Using the area formula, $\\pi r^2$, instead of the circumference is the classic mistake.",
      "弧长占周长的比例，等于圆心角占整圆的比例：$\\text{arc} = \\frac{\\theta}{360} \\cdot 2\\pi r$（arc 为弧长）。半径 $12$、圆心角 $60^\\circ$：$\\frac{1}{6}(24\\pi) = 4\\pi$。用面积公式 $\\pi r^2$ 而不是周长，是典型错误。",
    ),
    hardTip: t(
      "When the angle is in radians, the formula is simply $s = r\\theta$, with no $360$. Rearranging gives the radius: $r = \\frac{s}{\\theta}$. An arc of $18$ with an angle of $3$ radians means a radius of $6$. Multiplying instead of dividing, or converting to degrees needlessly, leads you astray.",
      "角用弧度表示时，公式就是 $s = r\\theta$，没有 $360$。变形得半径：$r = \\frac{s}{\\theta}$。弧长 $18$、圆心角 $3$ 弧度时，半径是 $6$。把除法做成乘法，或者多余地换算成度，都会出错。",
    ),
  },
  "sat-exam-areas-and-circumferences-of-circles": {
    tip: t(
      "A circle's area is $\\pi r^2$: square the radius first, then attach $\\pi$. For radius $9$ the area is $81\\pi$. Doubling the radius instead of squaring gives $18\\pi$, which is the circumference, the distractor to avoid. If a diameter is given, halve it first.",
      "圆的面积是 $\\pi r^2$：先把半径平方，再带上 $\\pi$。半径为 $9$ 时，面积是 $81\\pi$。把半径加倍而不是平方，得到的 $18\\pi$ 是周长，是要避开的干扰项。如果给的是直径，先减半。",
    ),
    hardTip: t(
      "From a circumference, recover the radius by $r = \\frac{C}{2\\pi}$, then square it for the area. A circumference of $18\\pi$ means $r = 9$ and area $81\\pi$, so the value of $k$ in $k\\pi$ is $81$. Squaring the circumference, or forgetting to halve, gives a value far too large.",
      "由周长还原半径：$r = \\frac{C}{2\\pi}$，再平方得面积。周长 $18\\pi$ 意味着 $r = 9$，面积为 $81\\pi$，所以 $k\\pi$ 中的 $k$ 是 $81$。把周长平方，或者忘了减半，结果都会大得多。",
    ),
  },
  "sat-exam-isosceles-triangles-formed-within-circles": {
    tip: t(
      "Two radii and the chord between their ends form an isosceles triangle, since the radii are equal. So the angles at the chord are equal: subtract the central angle from $180$ and halve. A central angle of $80^\\circ$ gives base angles of $50^\\circ$. Radii are the key fact here.",
      "两条半径和连接它们端点的弦构成等腰三角形，因为半径相等。所以弦上的两个角相等：用 $180$ 减去圆心角，再除以 $2$。圆心角为 $80^\\circ$ 时，底角是 $50^\\circ$。这里的关键事实是半径相等。",
    ),
    hardTip: t(
      "In reverse, one base angle at the chord gives the other, because the two radii are equal; then the central angle is $180$ minus twice it. If the angle between chord and radius is $25^\\circ$, the central angle is $130^\\circ$. Subtracting only one base angle ignores the second one.",
      "反过来，弦上的一个底角就给出了另一个，因为两条半径相等；圆心角等于 $180$ 减去它的两倍。若弦与半径的夹角是 $25^\\circ$，圆心角就是 $130^\\circ$。只减一个底角就忽略了另一个。",
    ),
  },
  "sat-exam-tangent-lines-to-circles": {
    tip: t(
      "A radius drawn to the point of tangency is perpendicular to the tangent. So the radius, the tangent segment and the line to the centre form a right triangle, with that line as the hypotenuse. With radius $8$ and tangent $15$, the distance to the centre is $17$. Look for this right angle first.",
      "连接切点的半径与切线垂直。所以半径、切线段和到圆心的连线构成直角三角形，这条连线是斜边。半径 $8$、切线 $15$ 时，到圆心的距离是 $17$。先找到这个直角。",
    ),
    hardTip: t(
      "The same right triangle can give the radius. The distance from the external point to the centre is the hypotenuse, so subtract squares: $r = \\sqrt{d^2 - t^2}$. For $d = 17$ and $t = 15$, the radius is $8$. Adding squares here would give a radius longer than the hypotenuse.",
      "同一个直角三角形也可以用来求半径。外点到圆心的距离是斜边，所以用平方相减：$r = \\sqrt{d^2 - t^2}$。$d = 17$、$t = 15$ 时，半径是 $8$。这里把平方相加，半径就比斜边还长了。",
    ),
  },
  "sat-exam-bisectors-of-chords": {
    tip: t(
      "A perpendicular from the centre to a chord bisects it, forming a right triangle with half the chord and the radius as hypotenuse. So half the chord is $\\sqrt{r^2 - d^2}$; then double it. With radius $10$ and distance $6$, half is $8$, so the chord is $16$. Forgetting to double is the trap.",
      "从圆心到弦的垂线平分这条弦，与半弦和半径（斜边）构成直角三角形。所以半弦是 $\\sqrt{r^2 - d^2}$，再加倍。半径 $10$、距离 $6$ 时，半弦是 $8$，弦长是 $16$。忘了加倍是常见的陷阱。",
    ),
    hardTip: t(
      "Reversing, halve the chord first, then use the distance as the other leg to find the radius as hypotenuse: $r = \\sqrt{(\\frac{c}{2})^2 + d^2}$. A chord of $16$ at distance $6$ gives $\\sqrt{64 + 36} = 10$. Using the entire chord as a leg makes the radius too large.",
      "反过来，先把弦减半，再以距离为另一条直角边，求斜边即半径：$r = \\sqrt{(\\frac{c}{2})^2 + d^2}$。弦长 $16$、距离 $6$ 时，得 $\\sqrt{64 + 36} = 10$。把整条弦当作直角边，半径就太大了。",
    ),
  },
  "sat-exam-the-canonical-equation-of-a-circle": {
    tip: t(
      "A circle with centre $(h, k)$ and radius $r$ has equation $(x - h)^2 + (y - k)^2 = r^2$. A centre coordinate that is negative makes a plus sign, and the radius is squared on the right. Centre $(2, -5)$ and radius $6$ give $(x - 2)^2 + (y + 5)^2 = 36$.",
      "圆心为 $(h, k)$、半径为 $r$ 的圆，方程是 $(x - h)^2 + (y - k)^2 = r^2$。圆心坐标为负时，括号内是加号；右边是半径的平方。圆心 $(2, -5)$、半径 $6$ 就是 $(x - 2)^2 + (y + 5)^2 = 36$。",
    ),
    hardTip: t(
      "The right side of the circle equation is $r^2$, so the radius is its square root. In $(x - 1)^2 + (y + 4)^2 = 49$, the radius is $7$. Reporting the right side itself, or reading it from the numbers in parentheses, which give the centre, are the traps here.",
      "圆方程的右边是 $r^2$，所以半径是它的平方根。在 $(x - 1)^2 + (y + 4)^2 = 49$ 中，半径是 $7$。直接回答右边的数，或者从括号内的数去读（那是圆心），都是这里的陷阱。",
    ),
  },
  "sat-exam-canonical-equations-of-transformed-circles": {
    tip: t(
      "First read the centre from the equation, flipping the signs inside the parentheses. Then apply the shift to the coordinates: right adds to $x$ and up adds to $y$. The circle $(x - 1)^2 + (y + 3)^2 = 9$ has centre $(1, -3)$; moving it left $2$ and up $4$ gives $(-1, 1)$. The radius is unaffected.",
      "先从方程读出圆心，括号内的符号要反过来。再把平移作用到坐标上：向右加到 $x$，向上加到 $y$。圆 $(x - 1)^2 + (y + 3)^2 = 9$ 的圆心是 $(1, -3)$；向左移 $2$、向上移 $4$ 后是 $(-1, 1)$。半径不受影响。",
    ),
    hardTip: t(
      "Scaling the radius leaves the centre alone but changes the right side, which is $r^2$. Take the square root to find the old radius, scale it, and square again. So multiplying the radius by $k$ multiplies the right side by $k^2$. A right side of $25$ with a factor of $2$ becomes $100$, not $50$.",
      "放大半径时圆心不变，但右边的 $r^2$ 会变。先开方得到原半径，放大后再平方。所以半径乘 $k$，右边就乘 $k^2$。右边为 $25$、倍数为 $2$ 时，新值是 $100$，而不是 $50$。",
    ),
  },
  "sat-exam-general-equations-of-circles-in-the-coordinate-plane": {
    tip: t(
      "To find the centre, group the $x$ terms and the $y$ terms and complete each square: half of each linear coefficient goes inside the parentheses. In $x^2 + 4x + y^2 - 10y - 7 = 0$, these make $(x + 2)^2$ and $(y - 5)^2$, so the centre is $(-2, 5)$. Keep the opposite sign in mind.",
      "要求圆心，把 $x$ 项和 $y$ 项分别分组并配方：一次项系数的一半写进括号。在 $x^2 + 4x + y^2 - 10y - 7 = 0$ 中，得到 $(x + 2)^2$ 和 $(y - 5)^2$，所以圆心是 $(-2, 5)$。记住符号要反过来。",
    ),
    hardTip: t(
      "Completing the square adds numbers to the left, so add them to the right as well; then move the constant across. In $x^2 + 4x + y^2 - 10y - 7 = 0$: $(x + 2)^2 + (y - 5)^2 = 7 + 4 + 25 = 36$, so $r = 6$. Reading the constant alone as $r^2$ is the trap.",
      "配方时给左边加了数，右边也要加；再把常数移过去。在 $x^2 + 4x + y^2 - 10y - 7 = 0$ 中：$(x + 2)^2 + (y - 5)^2 = 7 + 4 + 25 = 36$，所以 $r = 6$。把常数单独当作 $r^2$ 是个陷阱。",
    ),
  },
  "sat-exam-solving-problems-involving-the-canonical-equation-of-a-circle": {
    tip: t(
      "The radius is the distance from the centre to any point on the circle, so $r^2$ comes straight from the distance formula, with no root needed. With centre $(1, 2)$ and a point $(4, 6)$: $r^2 = 3^2 + 4^2 = 25$, giving $(x - 1)^2 + (y - 2)^2 = 25$. Put $r^2$ on the right, not $r$.",
      "半径是圆心到圆上任一点的距离，所以 $r^2$ 可以直接由距离公式得到，不必开方。圆心 $(1, 2)$、点 $(4, 6)$：$r^2 = 3^2 + 4^2 = 25$，得 $(x - 1)^2 + (y - 2)^2 = 25$。右边要写 $r^2$，不是 $r$。",
    ),
    hardTip: t(
      "With endpoints of a diameter, the centre is their midpoint and the radius is half the distance between them. Equivalently, $r^2$ is a quarter of the squared diameter. For endpoints $(0, 0)$ and $(6, 8)$: the diameter is $10$, so $r^2 = 25$. Using the whole diameter gives a value four times too large.",
      "已知直径的两个端点时，圆心是中点，半径是两点距离的一半。也就是说，$r^2$ 是直径平方的四分之一。端点 $(0, 0)$ 和 $(6, 8)$：直径是 $10$，所以 $r^2 = 25$。用整条直径算，结果就大了四倍。",
    ),
  },
  "sat-exam-solving-problems-involving-inscribed-squares": {
    tip: t(
      "When a square is inscribed in a circle, its diagonal is a diameter. The diagonal of a square with side $s$ is $s\\sqrt{2}$, so the radius is $\\frac{s\\sqrt{2}}{2}$. For side $6$: $r = 3\\sqrt{2}$. Taking half of the side instead gives the radius of the circle inscribed in the square.",
      "正方形内接于圆时，对角线就是直径。边长为 $s$ 的正方形对角线是 $s\\sqrt{2}$，所以半径是 $\\frac{s\\sqrt{2}}{2}$。边长为 $6$ 时：$r = 3\\sqrt{2}$。取边长的一半得到的是正方形内切圆的半径。",
    ),
    hardTip: t(
      "From the radius, the diagonal is $2r$. A square's area equals half its diagonal squared, so $A = \\frac{(2r)^2}{2} = 2r^2$. For radius $5$: the area is $50$. Treating the diameter as a side gives $(2r)^2$, double the correct area, which is the trap.",
      "由半径得对角线为 $2r$。正方形的面积等于对角线平方的一半，所以 $A = \\frac{(2r)^2}{2} = 2r^2$。半径为 $5$ 时，面积是 $50$。把直径当作边长，得到 $(2r)^2$，是正确面积的两倍，这就是陷阱。",
    ),
  },
  "sat-exam-solving-problems-involving-inscribed-circles": {
    tip: t(
      "A circle inscribed in a square touches all four sides, so the square's side equals the circle's diameter. Double the radius, then square it. For a radius of $7$, the side is $14$ and the area is $196$. Squaring the radius alone gives a quarter of the correct area.",
      "内切于正方形的圆与四条边都相切，所以正方形的边长等于圆的直径。把半径加倍，再平方。半径为 $7$ 时，边长为 $14$，面积为 $196$。只把半径平方，得到的是正确面积的四分之一。",
    ),
    hardTip: t(
      "The region between the shapes is the square's area minus the circle's area. Halve the side for the radius, then subtract: side $10$ gives radius $5$, so $100 - 25\\pi$. Using the side as the radius, or adding instead of subtracting, leads to the wrong expression. Leave $\\pi$ in the answer.",
      "两个图形之间的区域，面积等于正方形面积减圆面积。把边长减半得半径，再相减：边长 $10$ 时半径为 $5$，结果是 $100 - 25\\pi$。把边长当半径，或者加而不减，都会写错。答案中保留 $\\pi$。",
    ),
  },
  "sat-exam-solving-problems-involving-circles-inscribed-in-equilateral-triangles": {
    tip: t(
      "In an equilateral triangle, the circle's centre is also the point where the altitudes meet, and it divides each in the ratio $2:1$. The inscribed radius is the shorter part, one third of the height. So the height is $3r$: for radius $4$, it is $12$. Doubling the radius gets only a part.",
      "在等边三角形中，内切圆的圆心也是各条高的交点，它把每条高分成 $2:1$。内切圆半径是较短的部分，即高的三分之一。所以高是 $3r$：半径为 $4$ 时，高为 $12$。把半径加倍只得到其中一部分。",
    ),
    hardTip: t(
      "Get the height from $h = 3r$, then use $h = \\frac{s\\sqrt{3}}{2}$ and solve for the side: $s = \\frac{2h}{\\sqrt{3}}$, which simplifies to $2r\\sqrt{3}$. For radius $4$: $h = 12$ and $s = 8\\sqrt{3}$. Rationalize the denominator to match the options.",
      "先由 $h = 3r$ 得到高，再用 $h = \\frac{s\\sqrt{3}}{2}$ 解出边长：$s = \\frac{2h}{\\sqrt{3}}$，化简为 $2r\\sqrt{3}$。半径为 $4$ 时：$h = 12$，$s = 8\\sqrt{3}$。分母有理化后才好与选项对照。",
    ),
  },
  "sat-exam-solving-problems-involving-equilateral-triangles-inscribed-in-circles": {
    tip: t(
      "When an equilateral triangle sits inside a circle, the radius reaches a vertex, which is the longer part of an altitude, two thirds of the height. So the height is $\\frac{3}{2}r$. For radius $8$, it is $12$. Using $3r$ confuses this with the circle inscribed in the triangle.",
      "等边三角形内接于圆时，半径连到顶点，是高中较长的部分，即高的三分之二。所以高是 $\\frac{3}{2}r$。半径为 $8$ 时，高为 $12$。用 $3r$ 就和三角形内切圆的情形弄混了。",
    ),
    hardTip: t(
      "To find the side of the inscribed triangle, go through the height: $h = \\frac{3}{2}r$, then $s = \\frac{2h}{\\sqrt{3}}$, which simplifies to $s = r\\sqrt{3}$. For radius $8$: $h = 12$ and $s = 8\\sqrt{3}$. Remember that the side is longer than the radius but shorter than the diameter.",
      "要求内接三角形的边长，要经过高：$h = \\frac{3}{2}r$，再由 $s = \\frac{2h}{\\sqrt{3}}$ 化简得 $s = r\\sqrt{3}$。半径为 $8$ 时：$h = 12$，$s = 8\\sqrt{3}$。记住边长比半径长，但比直径短。",
    ),
  },
  "sat-exam-volumes-of-right-rectangular-prisms": {
    tip: t(
      "The volume of a rectangular box is length times width times height, which you may multiply in any order: a $4$ by $5$ by $3$ box holds $60$ cubic units. Adding the dimensions or finding the outside faces' total are the wrong operations that the options reflect.",
      "长方体的体积等于长乘宽乘高，可以按任意顺序相乘：$4$ 乘 $5$ 乘 $3$ 的箱子容积是 $60$ 立方单位。把边长相加，或者求外表面的总和，都是选项所反映的错误运算。",
    ),
    hardTip: t(
      "A missing dimension comes from dividing. Multiply the two known dimensions to get the base area, then divide the volume by it. If $V = 72$, with length $4$ and width $3$, the height is $6$. Subtracting the dimensions from the volume has no geometric meaning.",
      "缺一个边长时要用除法。先把两个已知边长相乘得底面积，再用体积除以它。若 $V = 72$，长 $4$，宽 $3$，高就是 $6$。用体积减去边长没有几何意义。",
    ),
  },
  "sat-exam-surface-areas-of-right-rectangular-prisms": {
    tip: t(
      "A box has three pairs of matching faces, so its surface area is $2(\\ell w + \\ell h + wh)$. For a $3$ by $4$ by $5$ box: $2(12 + 15 + 20) = 94$. Forgetting the factor of $2$ counts only half the faces, and multiplying all three dimensions gives the volume instead.",
      "长方体有三组相同的面，所以表面积是 $2(\\ell w + \\ell h + wh)$。$3$ 乘 $4$ 乘 $5$ 的长方体：$2(12 + 15 + 20) = 94$。忘了乘 $2$ 只算了一半的面，三个边长相乘得到的则是体积。",
    ),
    hardTip: t(
      "With a missing height, split the surface area into top and bottom, $2\\ell w$, and sides, which is the base's perimeter times the height. Subtract, then divide. For a $3$ by $4$ base and surface area $94$: $24 + 14h = 94$, so $h = 5$. Do not divide by the base area here.",
      "缺高时，把表面积分成上下两面 $2\\ell w$ 和侧面，侧面积等于底面周长乘高。先减后除。底面 $3$ 乘 $4$、表面积 $94$：$24 + 14h = 94$，所以 $h = 5$。这里不要除以底面积。",
    ),
  },
  "sat-exam-volumes-and-surface-areas-of-cubes": {
    tip: t(
      "A cube has six identical square faces, so its surface area is $6s^2$. For edge $5$: $6(25) = 150$. Finding $s^3$ gives the volume instead, and $6s$ forgets to square. Square the edge first and then multiply by the six faces.",
      "正方体有六个相同的正方形面，所以表面积是 $6s^2$。棱长为 $5$ 时：$6(25) = 150$。算 $s^3$ 得到的是体积，$6s$ 则是忘了平方。先把棱长平方，再乘六个面。",
    ),
    hardTip: t(
      "To go from surface area to volume, work through the edge: divide by $6$ for one face, take the square root for the edge, then cube it. A surface area of $150$ means a face of $25$, an edge of $5$ and a volume of $125$. Stopping at the edge is an unfinished answer.",
      "从表面积求体积，要经过棱长：除以 $6$ 得一个面的面积，开方得棱长，再立方。表面积 $150$ 意味着每个面 $25$，棱长 $5$，体积 $125$。停在棱长上就没做完。",
    ),
  },
  "sat-exam-volumes-of-cylinders": {
    tip: t(
      "A cylinder's volume is its circular base area times its height: $V = \\pi r^2 h$. For radius $3$ and height $7$: $V = 63\\pi$. Square only the radius, not the height, and do not use $2\\pi r$, which is the circumference of the base.",
      "圆柱的体积等于圆形底面积乘高：$V = \\pi r^2 h$。半径 $3$、高 $7$ 时：$V = 63\\pi$。只把半径平方，不是高，也不要用底面周长 $2\\pi r$。",
    ),
    hardTip: t(
      "To find the radius, divide the volume by $\\pi$ and by the height to isolate $r^2$, then take the square root. For $V = 63\\pi$ and height $7$: $r^2 = 9$, so $r = 3$. Forgetting the final root reports $r^2$ as the radius, a wrong option here.",
      "要求半径，把体积除以 $\\pi$ 和高，孤立出 $r^2$，再开方。对 $V = 63\\pi$、高 $7$：$r^2 = 9$，所以 $r = 3$。忘了最后开方，就把 $r^2$ 当成半径了，这是一个错误选项。",
    ),
  },
  "sat-exam-volumes-of-cylinders-word-problems": {
    tip: t(
      "A word problem often gives a diameter, so halve it first; then apply $V = \\pi r^2 h$. A jar with diameter $10$ inches and height $6$ inches has radius $5$ and volume $150\\pi$ cubic inches. Using the diameter directly makes the result four times too large.",
      "应用题常常给出直径，所以先减半，再用 $V = \\pi r^2 h$。直径 $10$ 英寸、高 $6$ 英寸的罐子，半径是 $5$，体积是 $150\\pi$ 立方英寸。直接用直径，结果就大了四倍。",
    ),
    hardTip: t(
      "Water in a cylinder rises in proportion to the volume added: the rise is the volume over the base area. In a tank of radius $3$ with depth $2$, adding $45\\pi$ raises the level by $\\frac{45\\pi}{9\\pi} = 5$, for a depth of $7$. Give the final depth by adding the original depth to the rise.",
      "圆柱中水位的上升与加入的体积成正比：上升高度等于体积除以底面积。半径 $3$、水深 $2$ 的水箱，加入 $45\\pi$ 后水位升高 $\\frac{45\\pi}{9\\pi} = 5$，水深变为 $7$。最后的深度要把原来的水深加上升高量。",
    ),
  },
  "sat-exam-volumes-of-spheres": {
    tip: t(
      "A sphere's volume is $V = \\frac{4}{3}\\pi r^3$. Cube the radius first, then multiply by $\\frac{4}{3}$, keeping $\\pi$ in the answer. For radius $3$: $\\frac{4}{3}(27)\\pi = 36\\pi$. Squaring instead of cubing gives the wrong power; $4\\pi r^2$ is the surface area, not the volume.",
      "球的体积是 $V = \\frac{4}{3}\\pi r^3$。先把半径立方，再乘 $\\frac{4}{3}$，答案保留 $\\pi$。半径为 $3$ 时：$\\frac{4}{3}(27)\\pi = 36\\pi$。把立方算成平方就错了；$4\\pi r^2$ 是表面积，不是体积。",
    ),
    hardTip: t(
      "To recover the radius, divide out $\\pi$, multiply by $\\frac{3}{4}$, and take the cube root. For $V = 36\\pi$: $r^3 = 36 \\cdot \\frac{3}{4} = 27$, so $r = 3$. Taking a square root at the end is the slip, since the radius is cubed in this formula.",
      "要还原半径，先约去 $\\pi$，再乘 $\\frac{3}{4}$，最后开立方。对 $V = 36\\pi$：$r^3 = 36 \\cdot \\frac{3}{4} = 27$，所以 $r = 3$。最后开平方是疏漏，因为这个公式中半径是立方的。",
    ),
  },
  "sat-exam-volumes-of-cones": {
    tip: t(
      "A cone holds one third of a cylinder with the same base and height: $V = \\frac{1}{3}\\pi r^2 h$. For radius $3$ and height $5$: $V = 15\\pi$. Omitting the $\\frac{1}{3}$ gives the cylinder's volume, which is the usual distractor.",
      "圆锥的体积是同底等高圆柱的三分之一：$V = \\frac{1}{3}\\pi r^2 h$。半径 $3$、高 $5$ 时：$V = 15\\pi$。漏掉 $\\frac{1}{3}$ 得到的是圆柱的体积，这是常见的干扰项。",
    ),
    hardTip: t(
      "To find the height, divide the volume by $\\pi$, multiply by $3$, and divide by $r^2$. For $V = 12\\pi$ and radius $2$: $\\frac{1}{3}(4)h = 12$, so $h = 9$. Forgetting to undo the $\\frac{1}{3}$ yields a height three times too small.",
      "要求高，把体积除以 $\\pi$，乘 $3$，再除以 $r^2$。对 $V = 12\\pi$、半径 $2$：$\\frac{1}{3}(4)h = 12$，所以 $h = 9$。忘了消去 $\\frac{1}{3}$，高就小了三倍。",
    ),
  },
  "sat-exam-volumes-of-composite-solids": {
    tip: t(
      "Split a joined solid into pieces, find each volume with its own formula, and add. A cylinder of radius $3$ and height $4$ topped by a cone of the same radius and height $5$ has $36\\pi + 15\\pi = 51\\pi$. Be sure each piece uses its own height; only the cone has the $\\frac{1}{3}$.",
      "把组合体分成几部分，用各自的公式求体积，再相加。半径 $3$、高 $4$ 的圆柱，上面是同半径、高 $5$ 的圆锥，体积为 $36\\pi + 15\\pi = 51\\pi$。每部分要用自己的高；只有圆锥才有 $\\frac{1}{3}$。",
    ),
    hardTip: t(
      "When part of a solid is removed, subtract the removed volume from the whole. A cube of edge $5$ with a cube of edge $2$ cut from a corner has $125 - 8 = 117$ cubic units. Subtract cubes, not edges: $(5 - 2)^3$ is the classic mistake here.",
      "从立体中去掉一部分时，用整体体积减去去掉的体积。棱长 $5$ 的正方体，从一角切去棱长 $2$ 的小正方体，剩下 $125 - 8 = 117$ 立方单位。要减立方，而不是减棱长：$(5 - 2)^3$ 是这里的典型错误。",
    ),
  },
  "sat-exam-constructing-functions-representing-surface-area-and-volume": {
    tip: t(
      "Write each dimension in terms of the variable, then insert them into the volume formula. A cylinder with radius $x$ and height $5$ less than twice its radius has $V(x) = \\pi x^2(2x - 5)$. Only the radius is squared, and the height must appear as a whole expression in parentheses.",
      "用变量表示每个尺寸，再代入体积公式。半径为 $x$、高比半径的两倍少 $5$ 的圆柱，$V(x) = \\pi x^2(2x - 5)$。只有半径平方，高要作为一个带括号的整体出现。",
    ),
    hardTip: t(
      "For a surface area function, list the faces that exist and add their areas. An open box has one base and four sides. With a square base of side $x$ and height $3$: $S(x) = x^2 + 4(3x) = x^2 + 12x$. Counting a lid would add a second $x^2$, which the description excludes.",
      "写表面积函数时，列出实际存在的面，再把面积相加。无盖盒子有一个底面和四个侧面。底面边长为 $x$、高为 $3$ 时：$S(x) = x^2 + 4(3x) = x^2 + 12x$。如果算上盖子就多了一个 $x^2$，而题目排除了这一点。",
    ),
  },
  "sat-exam-surface-areas-of-combined-rectangular-prisms": {
    tip: t(
      "Gluing solids face to face hides one face on each, so two faces disappear from the total. Two cubes of edge $3$ have $12$ faces, and $10$ remain visible: $10(9) = 90$. Doubling a single cube's surface area counts the hidden faces.",
      "把两个立体面对面粘合，各隐藏一个面，所以总共少了两个面。两个棱长为 $3$ 的正方体有 $12$ 个面，露在外面的还有 $10$ 个：$10(9) = 90$。把单个正方体的表面积加倍，就把隐藏的面也算进去了。",
    ),
    hardTip: t(
      "For a row of cubes, count faces directly: each cube shows $4$ side faces, and the row has $2$ end faces. So $n$ cubes in a row show $4n + 2$ faces. For $3$ cubes of edge $2$: $14$ faces of area $4$ give $56$. Each glued joint removes two faces from $6n$.",
      "一排正方体可以直接数面：每个正方体露出 $4$ 个侧面，整排还有 $2$ 个端面。所以 $n$ 个一排露出 $4n + 2$ 个面。$3$ 个棱长为 $2$ 的正方体：$14$ 个面积为 $4$ 的面，共 $56$。每个粘合处都从 $6n$ 中减去两个面。",
    ),
  },
  "sat-exam-congruent-triangles": {
    tip: t(
      "In a congruence, the vertex order tells which parts match: in $ABC \\cong DEF$, $A$ matches $D$ and $B$ matches $E$. Use the matching to get two angles in the same triangle, then the angle sum. If $A$ is $50^\\circ$ and $E$ is $60^\\circ$, then $F$ is $70^\\circ$. Mismatched vertices cause the error.",
      "全等式中，顶点顺序说明哪些部分对应：在 $ABC \\cong DEF$ 中，$A$ 对应 $D$，$B$ 对应 $E$。用对应关系把两个角放到同一个三角形里，再用内角和。若 $A$ 是 $50^\\circ$，$E$ 是 $60^\\circ$，则 $F$ 是 $70^\\circ$。顶点对错就会出错。",
    ),
    hardTip: t(
      "Corresponding sides of congruent triangles are equal, so match the letters in order, set the expressions equal and solve. If $PQ = 3x - 2$ matches $RS = 16$, then $3x = 18$ and $x = 6$. Pairing a side with a non-corresponding one gives a wrong equation.",
      "全等三角形的对应边相等，所以按字母顺序对应，令表达式相等再求解。若 $PQ = 3x - 2$ 对应 $RS = 16$，则 $3x = 18$，$x = 6$。与非对应边配对，方程就错了。",
    ),
  },
  "sat-exam-finding-corresponding-angles-in-similar-shapes": {
    tip: t(
      "Similar figures have equal corresponding angles. Use the vertex correspondence to transfer an angle from one triangle to the other, then apply the sum of $180^\\circ$. With $P$ matching $S$ and $Q$ matching $T$, if $P$ is $30^\\circ$ and $T$ is $80^\\circ$, the third angle of the first triangle is $70^\\circ$.",
      "相似图形的对应角相等。用顶点对应关系把一个角转到另一个三角形上，再用 $180^\\circ$ 的内角和。$P$ 对应 $S$，$Q$ 对应 $T$，若 $P$ 是 $30^\\circ$，$T$ 是 $80^\\circ$，第一个三角形的第三个角就是 $70^\\circ$。",
    ),
    hardTip: t(
      "A scale factor stretches sides but leaves every angle unchanged, since similarity preserves shape. So a triangle's corresponding angle stays the same however large the factor is. Multiplying $50^\\circ$ by a factor of $3$ is the wrong idea: the matching angle remains $50^\\circ$.",
      "比例系数拉伸边长，但不改变任何角，因为相似保持形状。所以无论系数多大，对应角都不变。把 $50^\\circ$ 乘系数 $3$ 的想法是错的：对应角仍然是 $50^\\circ$。",
    ),
  },
  "sat-exam-finding-corresponding-lengths-in-similar-shapes": {
    tip: t(
      "The scale factor between similar figures is the ratio of a pair of matching sides. Multiply any other side by it. If a $4$ by $3$ rectangle corresponds to one with a side of $20$ matching the $4$, the factor is $5$ and the other side is $15$. Adding the difference of $16$ does not preserve the shape.",
      "相似图形之间的比例系数，是一对对应边的比。把任何其他边乘这个系数。$4$ 乘 $3$ 的矩形，对应矩形中与 $4$ 对应的边是 $20$，系数就是 $5$，另一边是 $15$。加上差值 $16$ 不能保持形状。",
    ),
    hardTip: t(
      "A perimeter is a sum of lengths, so it scales by the same factor as the sides. Find the factor from a matching pair, then multiply the perimeter. With sides $4$ and $20$ and a perimeter of $12$, the larger perimeter is $60$. Do not square the factor; that is for areas.",
      "周长是长度之和，所以它按与边相同的系数放大。由一对对应边求出系数，再乘周长。边为 $4$ 和 $20$、周长为 $12$ 时，大图形的周长是 $60$。不要把系数平方，那是用于面积的。",
    ),
  },
  "sat-exam-solving-problems-with-similar-triangles": {
    tip: t(
      "A segment parallel to a triangle's side cuts off a smaller, similar triangle. Find the scale factor from matching sides that share the vertex, then scale the base. With $AD = 3$, $AB = 12$ and $DE = 4$, the factor is $4$ and the full base is $16$. Compare whole sides, from the vertex.",
      "与三角形一边平行的线段截出一个较小的相似三角形。由共顶点的对应边求比例系数，再放大底边。$AD = 3$、$AB = 12$、$DE = 4$ 时，系数是 $4$，整条底边是 $16$。比较的是从顶点出发的整条边。",
    ),
    hardTip: t(
      "If the side is given in two pieces, add them to get the entire side before forming the ratio. With $AD = 3$ and $DB = 9$, we have $AB = 12$ and a factor of $4$; so if the base is $16$, the parallel segment is $4$. Using $\\frac{AD}{DB}$ as the factor is the classic error.",
      "如果边是分成两段给出的，要先相加得到整条边，再求比。$AD = 3$、$DB = 9$ 时，$AB = 12$，系数是 $4$；若底边为 $16$，平行线段就是 $4$。把 $\\frac{AD}{DB}$ 当作系数是典型错误。",
    ),
  },
  "sat-exam-further-problem-solving-with-embedded-right-triangles": {
    tip: t(
      "The altitude to a right triangle's hypotenuse creates similar triangles, which gives the geometric mean rule: the altitude squared equals the product of the two hypotenuse segments. With segments $4$ and $9$: $h^2 = 36$, so $h = 6$. Averaging the segments gives the wrong value.",
      "直角三角形斜边上的高形成相似三角形，由此得到射影定理：高的平方等于斜边两段的乘积。两段为 $4$ 和 $9$ 时：$h^2 = 36$，所以 $h = 6$。把两段平均是错的。",
    ),
    hardTip: t(
      "To get the whole triangle's area, find the altitude using the segments, add the segments for the hypotenuse, and take half of the product. With segments $4$ and $9$: $h = 6$ and the hypotenuse is $13$, so the area is $39$. Using a segment instead of the hypotenuse gives only a piece of the area.",
      "要求整个三角形的面积，用两段求高，把两段相加得斜边，再取乘积的一半。两段为 $4$ 和 $9$ 时：$h = 6$，斜边为 $13$，面积为 $39$。用其中一段代替斜边，只得到一部分面积。",
    ),
  },
  "sat-exam-identifying-information-needed-to-determine-similarity": {
    tip: t(
      "Two triangles are similar when two pairs of corresponding angles match, the AA criterion. One matching pair is known, so seek a fact about a second pair. Facts about one side, or about two angles of the same triangle, do not help. Equal angles at $B$ and $E$, for instance, are enough.",
      "两组对应角相等时，两个三角形相似，这就是 AA 判定。已知一组，所以要找关于第二组的条件。关于一条边的条件，或者同一个三角形内两个角的条件，都没有用。例如 $B$ 与 $E$ 处的角相等就足够了。",
    ),
    hardTip: t(
      "With two pairs of proportional sides, the SAS criterion needs the angle between them to match: here, the angles at the shared vertices of those sides. Angles elsewhere in the triangles do not suffice. Find the vertex common to the two sides in each triangle, and require equality there.",
      "有两组成比例的边时，SAS 判定要求它们的夹角相等，也就是这两条边公共顶点处的角。三角形其他位置的角不够。在每个三角形中找到这两条边的公共顶点，要求那里的角相等。",
    ),
  },
  "sat-exam-relating-length-and-area-in-similar-shapes": {
    tip: t(
      "Area involves two lengths, so when lengths scale by $k$, areas scale by $k^2$. With sides in the ratio $1$ to $3$ and a small area of $7$, the large area is $9(7) = 63$. Multiplying the area by $3$ uses the length factor, which is the standard wrong answer.",
      "面积涉及两个长度，所以长度放大 $k$ 倍时，面积放大 $k^2$ 倍。边之比为 $1$ 比 $3$、小图形面积为 $7$ 时，大图形面积是 $9(7) = 63$。把面积乘 $3$ 用的是长度系数，这是标准的错误答案。",
    ),
    hardTip: t(
      "Going from areas to lengths, take the square root of the area ratio, then multiply the side by it. If areas are $5$ and $45$, the ratio is $9$ and the length factor is $3$, so a side of $4$ becomes $12$. Using $9$ as the length factor is the trap.",
      "从面积到长度，要对面积比开方，再乘边长。面积为 $5$ 和 $45$ 时，比是 $9$，长度系数是 $3$，所以边 $4$ 变成 $12$。把 $9$ 当作长度系数就是陷阱。",
    ),
  },
  "sat-exam-length-surface-area-and-volume-in-similar-solids": {
    tip: t(
      "Volume involves three lengths, so a length factor of $k$ makes a volume factor of $k^3$. With edges in the ratio $1$ to $3$ and a small volume of $4$, the larger is $27(4) = 108$. Using $3$ or $9$ applies the factor for lengths or areas instead.",
      "体积涉及三个长度，所以长度系数为 $k$ 时，体积系数是 $k^3$。棱之比为 $1$ 比 $3$、小立体体积为 $4$ 时，大立体体积是 $27(4) = 108$。用 $3$ 或 $9$ 就是误用了长度或面积的系数。",
    ),
    hardTip: t(
      "To pass from volume to surface area, go through the length factor: take the cube root of the volume ratio, then square it. If volumes are $5$ and $135$, the ratio is $27$, $k = 3$, and surface area scales by $9$. A surface area of $6$ then becomes $54$. Do not apply the volume ratio directly.",
      "从体积到表面积，要经过长度系数：先对体积比开立方，再平方。体积为 $5$ 和 $135$ 时，比是 $27$，$k = 3$，表面积按 $9$ 倍放大。表面积 $6$ 变成 $54$。不要直接用体积比。",
    ),
  },
  "sat-exam-trigonometric-ratios-in-right-triangles": {
    tip: t(
      "Sine is the opposite side over the hypotenuse, as in SOH-CAH-TOA. Stand at the named angle, find the side across from it, and divide by the longest side. For a $3$-$4$-$5$ triangle with $3$ opposite the angle, the sine is $\\frac{3}{5}$. Then simplify if possible.",
      "正弦等于对边除以斜边（SOH-CAH-TOA）。站在指定的角上，找到它对面的边，再除以最长的边。在 $3$-$4$-$5$ 三角形中，若 $3$ 是该角的对边，正弦就是 $\\frac{3}{5}$。能约分就约分。",
    ),
    hardTip: t(
      "Tangent is opposite over adjacent, without the hypotenuse. If the named angle is the other acute angle, the two legs swap roles. In the $3$-$4$-$5$ triangle, the angle opposite the side of $4$ has tangent $\\frac{4}{3}$. Reading from the wrong vertex gives the reciprocal, the usual wrong option.",
      "正切等于对边除以邻边，不用斜边。如果指定的是另一个锐角，两条直角边的角色就互换。在 $3$-$4$-$5$ 三角形中，边 $4$ 所对的角，正切是 $\\frac{4}{3}$。从错误的顶点读，就会得到它的倒数，这是常见的错误选项。",
    ),
  },
  "sat-exam-calculating-lengths-and-areas-using-trigonometry": {
    tip: t(
      "Rearranging the definition of sine, the opposite side equals the hypotenuse times $\\sin A$. If the hypotenuse is $20$ and $\\sin A = \\frac{3}{5}$, the opposite side is $12$. Be careful: the given denominator need not be the actual hypotenuse, so multiply rather than reading a number off the fraction.",
      "把正弦的定义变形，对边等于斜边乘 $\\sin A$。斜边为 $20$、$\\sin A = \\frac{3}{5}$ 时，对边是 $12$。注意：分母不一定就是实际的斜边，所以要做乘法，而不是直接从分数上读数。",
    ),
    hardTip: t(
      "For area, you need both legs. Multiply the known adjacent leg by $\\tan A$ to get the opposite leg, then take half of the product. If the adjacent leg is $8$ and $\\tan A = \\frac{3}{4}$, the opposite is $6$ and the area is $24$. Omitting the half is the typical slip.",
      "求面积需要两条直角边。用已知的邻边乘 $\\tan A$ 得到对边，再取乘积的一半。邻边为 $8$、$\\tan A = \\frac{3}{4}$ 时，对边为 $6$，面积为 $24$。漏掉一半是典型的疏漏。",
    ),
  },
  "sat-exam-calculating-trigonometric-ratios-using-the-pythagorean-theorem": {
    tip: t(
      "With both legs given, first find the hypotenuse by the Pythagorean theorem, then form the ratio and simplify. In a right triangle with legs $8$ and $6$, the hypotenuse is $10$. The cosine of the angle next to the leg of $8$ is $\\frac{8}{10} = \\frac{4}{5}$. Note which leg is adjacent.",
      "已知两条直角边时，先用勾股定理求斜边，再写比值并约分。直角边为 $8$ 和 $6$ 的三角形，斜边是 $10$。与边 $8$ 相邻的角，余弦是 $\\frac{8}{10} = \\frac{4}{5}$。注意哪条直角边是邻边。",
    ),
    hardTip: t(
      "From one ratio to another, picture a triangle: reduce the given fraction, use its parts as sides, and find the missing side. If $\\sin A = \\frac{6}{10}$, reduce to $\\frac{3}{5}$; the sides are $3$, $5$ and $4$, so $\\cos A = \\frac{4}{5}$. Do not assume that the sine and cosine share the same numerator.",
      "从一个比值推另一个，可以想象一个三角形：约分给定的分数，用它的数作边，再求缺的边。若 $\\sin A = \\frac{6}{10}$，约分为 $\\frac{3}{5}$；三边为 $3$、$5$、$4$，所以 $\\cos A = \\frac{4}{5}$。不要以为正弦和余弦的分子相同。",
    ),
  },
  "sat-exam-cofunction-relationships-and-identities": {
    tip: t(
      "The two acute angles of a right triangle are complementary, and the side opposite one is adjacent to the other. So $\\sin\\theta = \\cos(90^\\circ - \\theta)$. For example, $\\sin 20^\\circ = \\cos 70^\\circ$. The tempting wrong choices keep the same angle, or subtract from $180^\\circ$.",
      "直角三角形的两个锐角互余，一个角的对边是另一个角的邻边。所以 $\\sin\\theta = \\cos(90^\\circ - \\theta)$。例如 $\\sin 20^\\circ = \\cos 70^\\circ$。诱人的错误选项是保持同一个角，或者用 $180^\\circ$ 去减。",
    ),
    hardTip: t(
      "An equation setting a sine equal to a cosine of acute angles means the two angles add to $90^\\circ$. Add the expressions, set them equal to $90$, and solve. For $\\sin(3x + 30)^\\circ = \\cos(x)^\\circ$: $4x + 30 = 90$, so $x = 15$. Setting them equal to each other is the trap.",
      "正弦与余弦相等、角又都是锐角时，两个角的和是 $90^\\circ$。把表达式相加，令和为 $90$，再求解。对 $\\sin(3x + 30)^\\circ = \\cos(x)^\\circ$：$4x + 30 = 90$，所以 $x = 15$。令两个角相等就是陷阱。",
    ),
  },
  "sat-exam-relations-between-trigonometric-ratios-in-similar-right-triangles": {
    tip: t(
      "A trigonometric ratio depends only on the angle, not on the triangle's size. Scaling all sides multiplies both parts of the fraction by the same number, which cancels. So if $\\cos P = \\frac{3}{5}$ and a similar triangle is $4$ times larger, the matching angle's cosine is still $\\frac{3}{5}$.",
      "三角比只取决于角，与三角形的大小无关。所有边放大时，分数的分子分母乘同一个数，抵消了。所以若 $\\cos P = \\frac{3}{5}$，相似三角形大 $4$ 倍，对应角的余弦仍然是 $\\frac{3}{5}$。",
    ),
    hardTip: t(
      "Move the ratio to the matching angle in the other triangle, then write it using that triangle's sides and solve for the unknown. If $\\tan P = \\frac{3}{4}$, and in the similar triangle the side opposite the matching angle is $9$, then $\\frac{9}{\\text{adjacent}} = \\frac{3}{4}$, so the adjacent side is $12$.",
      "把比值移到另一个三角形的对应角上，用那个三角形的边写出来，再求未知边。若 $\\tan P = \\frac{3}{4}$，相似三角形中对应角的对边是 $9$，则 $\\frac{9}{\\text{adjacent}} = \\frac{3}{4}$（adjacent 为邻边），所以邻边是 $12$。",
    ),
  },
  "sat-exam-problem-solving-using-trigonometric-ratios-in-similar-right-triangles": {
    tip: t(
      "In a pole and shadow problem, the pole is opposite the angle of the sun, and the shadow is adjacent. So height equals shadow times the tangent. A shadow of $16$ meters with $\\tan A = \\frac{3}{4}$ gives a height of $12$ meters. Multiplying by the reciprocal is the error to avoid.",
      "杆与影子的问题中，杆是太阳仰角的对边，影子是邻边。所以高等于影长乘正切。影长 $16$ 米、$\\tan A = \\frac{3}{4}$ 时，高是 $12$ 米。要避免乘了倒数。",
    ),
    hardTip: t(
      "Equal angles make two right triangles similar, so a ratio from one holds in the other. Use it with the known side to find a second side, then the Pythagorean theorem for the third. If $\\cos A = \\frac{4}{5}$ and the hypotenuse of the other is $15$, the adjacent side is $12$ and the opposite side is $9$.",
      "角相等使两个直角三角形相似，所以一个三角形的比值在另一个中也成立。用它和已知边求第二条边，再用勾股定理求第三条。若 $\\cos A = \\frac{4}{5}$，另一个三角形的斜边是 $15$，邻边就是 $12$，对边是 $9$。",
    ),
  },
  "sat-exam-trigonometric-ratios-of-large-special-angles": {
    tip: t(
      "For an angle past $90^\\circ$, find its reference angle, the acute angle to the $x$-axis, and its quadrant. Sine is the $y$-coordinate on the unit circle, so it is positive in the second quadrant. Thus $\\sin 135^\\circ = \\sin 45^\\circ = \\frac{\\sqrt{2}}{2}$. The sign comes from the quadrant, the size from the reference angle.",
      "角大于 $90^\\circ$ 时，先找参考角（与 $x$ 轴所成的锐角）和所在象限。正弦是单位圆上的 $y$ 坐标，在第二象限为正。因此 $\\sin 135^\\circ = \\sin 45^\\circ = \\frac{\\sqrt{2}}{2}$。符号由象限决定，大小由参考角决定。",
    ),
    hardTip: t(
      "Cosine is the $x$-coordinate on the unit circle, so it is negative in the second quadrant. Use the same reference angle, then attach the sign: $\\cos 135^\\circ = -\\cos 45^\\circ = -\\frac{\\sqrt{2}}{2}$. A common error is dropping this negative, or using the sine's value for the reference angle.",
      "余弦是单位圆上的 $x$ 坐标，所以在第二象限为负。用同样的参考角，再加上符号：$\\cos 135^\\circ = -\\cos 45^\\circ = -\\frac{\\sqrt{2}}{2}$。常见错误是漏掉负号，或者用了参考角的正弦值。",
    ),
  },
};
