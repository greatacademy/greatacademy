import { t } from "@ga/content";

import type { ExamLesson } from "../exam.ts";

/** actExamLessons are the lessons of the ACT exam topics, by topic id. */
export const actExamLessons: Readonly<Record<string, ExamLesson>> = {
  "act-exam-expanding-powers-of-binomials": {
    tip: t(
      "A squared binomial follows $(a + b)^2 = a^2 + 2ab + b^2$. Square the first term, double the product of the two terms, then square the last term. So $(n - 3)^2 = n^2 - 6n + 9$. Answers that lack the middle term, like $n^2 + 9$, are the trap, because the exponent does not distribute.",
      "二项式的平方遵循 $(a + b)^2 = a^2 + 2ab + b^2$。先把第一项平方，再取两项乘积的两倍，最后把末项平方。所以 $(n - 3)^2 = n^2 - 6n + 9$。缺少中间项的答案，如 $n^2 + 9$，就是陷阱，因为指数不能分配到和的每一项。",
    ),
    hardTip: t(
      "With coefficients and two variables, treat each whole term as one unit: the square of the coefficient and of the variable both appear. For $(2p - 5q)^2$: $4p^2 - 20pq + 25q^2$. The added difficulty is in the arithmetic, so square the coefficients as well, and carry the negative sign into the middle term.",
      "有系数和两个变量时，把每一项当作一个整体：系数和变量都要平方。对 $(2p - 5q)^2$：$4p^2 - 20pq + 25q^2$。多出来的难度在于运算，所以系数也要平方，并把负号带进中间项。",
    ),
  },
  "act-exam-rewriting-expressions-using-relations": {
    tip: t(
      "Substitution means replacing the variable with its whole equal expression, in parentheses. Then distribute and combine constants. If $m = n + 3$, then $5m - 1 = 5(n + 3) - 1 = 5n + 14$. The usual slip is multiplying only the first term inside the parentheses.",
      "代入就是用相等的整个表达式替换变量，并加上括号。然后展开并合并常数。若 $m = n + 3$，则 $5m - 1 = 5(n + 3) - 1 = 5n + 14$。常见的疏漏是只乘了括号里的第一项。",
    ),
    hardTip: t(
      "With a chain of two relations, express everything in the final variable before combining. If $p = 3q$ and $q = 2r$, then $p = 6r$, and $p + q = 6r + 2r = 8r$. Stopping after one substitution leaves two different variables, so like terms still cannot be collected.",
      "有两个连环关系时，要先把一切都化成最终的变量，再合并。若 $p = 3q$，$q = 2r$，则 $p = 6r$，而 $p + q = 6r + 2r = 8r$。只代入一次会留下两个不同的变量，同类项仍然无法合并。",
    ),
  },
  "act-exam-working-backward-to-find-an-unknown": {
    tip: t(
      "To undo a chain of operations, start from the result and reverse each step, in reverse order. For a number tripled and then increased by $5$ to give $26$: subtract $5$ to get $21$, then divide by $3$ to get $7$. Dividing first breaks the chain and gives a wrong number.",
      "要还原一连串运算，从结果出发，按相反的顺序做相反的运算。一个数乘 $3$ 再加 $5$ 得 $26$：先减 $5$ 得 $21$，再除以 $3$ 得 $7$。先做除法就打乱了顺序，结果会出错。",
    ),
    hardTip: t(
      "With three stages, the same reversal applies; just keep a careful list. A number increased by $4$, doubled, and then reduced by $6$ gives $20$: add $6$ for $26$, halve for $13$, subtract $4$ for $9$. Check by running the original steps forward. Each operation must be inverted, including the last.",
      "有三步时，同样要倒着做，只需仔细列出每一步。一个数加 $4$，乘 $2$，再减 $6$ 得 $20$：加 $6$ 得 $26$，减半得 $13$，减 $4$ 得 $9$。再按原步骤正向验算。每个运算都要取逆，包括最后一步。",
    ),
  },
  "act-exam-evaluating-expressions-after-solving": {
    tip: t(
      "These questions ask for a new expression, not the variable. Solve for $x$ in the usual two steps, then substitute into what is asked. If $3x + 2 = 14$, then $x = 4$, so $5x - 1 = 19$. The trap is stopping at $x$, since that value also appears among the options.",
      "这类题问的是一个新的表达式，而不是变量本身。按通常的两步解出 $x$，再代入所求的式子。若 $3x + 2 = 14$，则 $x = 4$，所以 $5x - 1 = 19$。陷阱是停在 $x$ 上，因为这个值也出现在选项中。",
    ),
    hardTip: t(
      "Compare the target with the given equation before solving: if the left side is a multiple of the target, divide both sides by that factor. From $6x + 9 = 33$, dividing by $3$ gives $2x + 3 = 11$ at once. This shortcut skips fractions and avoids finding $x$ altogether.",
      "求解之前先比较目标式与已知方程：如果左边是目标式的倍数，两边同除以这个倍数。由 $6x + 9 = 33$，除以 $3$ 立刻得到 $2x + 3 = 11$。这个捷径避开了分数，完全不必求 $x$。",
    ),
  },
  "act-exam-applying-linear-formulas": {
    tip: t(
      "When a formula gives the output directly, substitute the input value and follow the order of operations: multiply first, then add. With $y = \\frac{3}{2}x + 7$ and $x = 10$, we get $15 + 7 = 22$. Simplify the fraction times the number before doing the addition.",
      "公式直接给出输出时，把输入值代入，按运算顺序计算：先乘后加。对 $y = \\frac{3}{2}x + 7$，$x = 10$，得 $15 + 7 = 22$。先算分数与数的乘积，再做加法。",
    ),
    hardTip: t(
      "When the unknown is not alone in the formula, substitute all known values and solve the resulting equation. If $T = 3a + 4b$, with $T = 40$ and $a = 8$: $4b = 40 - 24 = 16$, so $b = 4$. A common slip is stopping at $16$, which still has the coefficient to divide out.",
      "未知量不是单独一边时，把所有已知值代入，再解得到的方程。若 $T = 3a + 4b$，$T = 40$，$a = 8$：$4b = 40 - 24 = 16$，所以 $b = 4$。常见的疏漏是停在 $16$，其实还要除以系数。",
    ),
  },
  "act-exam-solving-linear-inequalities": {
    tip: t(
      "Solve an inequality like an equation: undo the constant, then divide by the coefficient. Dividing by a positive number keeps the direction. For $3x - 5 > 10$: $3x > 15$, so $x > 5$. Check that the answer keeps the original symbol, and do not flip it just because a number is negative.",
      "解不等式和解方程一样：先消去常数，再除以系数。除以正数时方向不变。对 $3x - 5 > 10$：$3x > 15$，所以 $x > 5$。检查答案是否保持原来的符号，不要因为某个数是负数就反转。",
    ),
    hardTip: t(
      "When the coefficient of the variable is negative, dividing by it reverses the inequality sign. For $10 - 2x \\le 16$: $-2x \\le 6$, so $x \\ge -3$. An option with the original direction is the standard trap. Only multiplying or dividing by a negative flips the sign, not subtracting.",
      "变量系数为负时，除以它要反转不等号。对 $10 - 2x \\le 16$：$-2x \\le 6$，所以 $x \\ge -3$。保持原方向的选项就是标准陷阱。只有乘或除以负数才要反转，减法不用。",
    ),
  },
  "act-exam-identifying-consequences-of-inequalities": {
    tip: t(
      "What must be true is what you can derive by the same operation on both sides. Adding or subtracting any number keeps the direction. If $n + 3 < 9$, then $n < 6$. Statements such as $n > 6$ or $n = 6$ can fail, so test any option with a value that fits the original.",
      "必然成立的，就是两边做相同运算能推出的结论。加减任何数都不改变方向。若 $n + 3 < 9$，则 $n < 6$。像 $n > 6$ 或 $n = 6$ 这样的说法可能不成立，可用一个满足原式的值来检验选项。",
    ),
    hardTip: t(
      "Multiplying an inequality by a negative number reverses it. If $a < b < 0$ and $c$ is negative, then $ca > cb$. Also, two negatives multiply to a positive and add to a negative. Test with numbers: $a = -3$, $b = -1$ and $c = -2$ give $6 > 2$. Options that keep the direction fail.",
      "不等式乘负数要反向。若 $a < b < 0$ 且 $c$ 为负，则 $ca > cb$。另外，两个负数的积为正，和为负。用数字检验：$a = -3$，$b = -1$，$c = -2$，得 $6 > 2$。保持原方向的选项不成立。",
    ),
  },
  "act-exam-solving-three-variable-systems": {
    tip: t(
      "When each equation adds two of the three variables, add all the equations: each variable appears twice, so the sum is $2(x + y + z)$. Then halve. If the pair sums are $3$, $5$ and $6$, they total $14$, so $x + y + z = 7$. Forgetting to halve gives the most tempting wrong answer.",
      "每个方程都是三个变量中两个的和时，把所有方程相加：每个变量出现两次，所以和是 $2(x + y + z)$。然后减半。若两两之和为 $3$、$5$、$6$，总和为 $14$，所以 $x + y + z = 7$。忘了减半是最诱人的错误答案。",
    ),
    hardTip: t(
      "Subtract a simple equation from the others to isolate a variable. If $a + b + c = 10$ and $2a + b + c = 13$, subtracting gives $a = 3$. Do the same with the third equation for a second variable, then substitute both into the first to obtain the last. Subtract in a consistent order to keep signs right.",
      "用其他方程减去一个简单的方程，孤立出变量。若 $a + b + c = 10$，$2a + b + c = 13$，相减得 $a = 3$。对第三个方程同样处理，得到第二个变量，再把两者代入第一个方程求最后一个。减的顺序要一致，才不会弄错符号。",
    ),
  },
  "act-exam-expanding-binomial-powers": {
    tip: t(
      "For a cubed binomial, $(x + a)^3 = x^3 + 3ax^2 + 3a^2x + a^3$. Identify the term with the requested power, then compute the coefficient. In $(x + 2)^3$, the $x$ term has coefficient $3(2)^2 = 12$. The usual error is using $a$ instead of $a^2$ in this term, or mixing it with the $x^2$ term.",
      "三次方的二项式：$(x + a)^3 = x^3 + 3ax^2 + 3a^2x + a^3$。找到所求次数的项，再计算系数。在 $(x + 2)^3$ 中，$x$ 项的系数是 $3(2)^2 = 12$。常见错误是这一项用了 $a$ 而不是 $a^2$，或者与 $x^2$ 项弄混。",
    ),
    hardTip: t(
      "For the fourth power, the coefficients are $1, 4, 6, 4, 1$ from Pascal's triangle. The $x^2$ term of $(x + a)^4$ is $6a^2x^2$; a factor outside multiplies it. For $3(x + 2)^4$: $3 \\cdot 6 \\cdot 4 = 72$. The binomial coefficient, the power of $a$, and the outside factor must all appear.",
      "四次方的系数来自杨辉三角：$1, 4, 6, 4, 1$。$(x + a)^4$ 的 $x^2$ 项是 $6a^2x^2$；外面的因数还要再乘上去。对 $3(x + 2)^4$：$3 \\cdot 6 \\cdot 4 = 72$。二项式系数、$a$ 的幂和外面的因数，三者缺一不可。",
    ),
  },
  "act-exam-solving-higher-degree-equations": {
    tip: t(
      "A product equals zero when any factor is zero, so set each factor equal to zero. Then read the question: it may want the largest root. For $x(x + 3)(x - 5) = 0$, the roots are $0$, $-3$ and $5$. The lone factor of $x$ counts too, and watch the sign in each parenthesis.",
      "乘积为零时，至少有一个因式为零，所以令每个因式等于零。再看题目要什么：可能是最大的根。对 $x(x + 3)(x - 5) = 0$，根是 $0$、$-3$ 和 $5$。单独的因式 $x$ 也要算，并留意每个括号里的符号。",
    ),
    hardTip: t(
      "A cubic with four terms can be factored by grouping: pull a common factor from the first two terms and from the last two. So $x^3 + 3x^2 - 4x - 12 = x^2(x + 3) - 4(x + 3) = (x + 3)(x - 2)(x + 2)$. Then factor the difference of squares too, and count different roots only.",
      "四项的三次式可以分组分解：从前两项和后两项分别提公因式。所以 $x^3 + 3x^2 - 4x - 12 = x^2(x + 3) - 4(x + 3) = (x + 3)(x - 2)(x + 2)$。接着把平方差也分解，只统计不同的根。",
    ),
  },
  "act-exam-identifying-characteristics-of-rational-expressions": {
    tip: t(
      "A fraction is undefined exactly where its denominator is zero. Set the denominator equal to zero and solve; the numerator plays no part. For $\\frac{5}{x + 9}$, the excluded value is $x = -9$. Mind the sign: giving $9$ instead is the wrong option to avoid.",
      "分式恰好在分母为零时无定义。令分母等于零并求解；分子不起作用。对 $\\frac{5}{x + 9}$，要排除的值是 $x = -9$。注意符号：答成 $9$ 就落入了错误选项。",
    ),
    hardTip: t(
      "Take each factor of the original denominator before any cancelling, since cancelling cannot create a value where the expression exists. In $\\frac{x - 3}{(x - 3)(x + 1)}$, both $x = 3$ and $x = -1$ are excluded. The trap is cancelling the shared factor and listing only one value.",
      "要看约分之前分母的每个因式，因为约分不能让原本无定义的值变得有定义。在 $\\frac{x - 3}{(x - 3)(x + 1)}$ 中，$x = 3$ 和 $x = -1$ 都要排除。陷阱是约掉公因式后只列出一个值。",
    ),
  },
  "act-exam-solving-proportions": {
    tip: t(
      "In a proportion, compare the two denominators to find the multiplier, and apply it to the numerator, or cross-multiply. For $\\frac{3}{5} = \\frac{x}{20}$, the denominator is multiplied by $4$, so $x = 12$. Adding the difference of $15$ to the numerator does not preserve the ratio.",
      "比例式中，比较两个分母得出倍数，再把它用到分子上，或者交叉相乘。对 $\\frac{3}{5} = \\frac{x}{20}$，分母乘了 $4$，所以 $x = 12$。给分子加上差值 $15$ 并不能保持比值。",
    ),
    hardTip: t(
      "When the numerator is an expression, first simplify the known fraction, then multiply by the denominator to free the expression, and solve. For $\\frac{x - 2}{3} = \\frac{10}{2}$: the right side is $5$, so $x - 2 = 15$ and $x = 17$. Do not stop at the value of the whole expression.",
      "分子是表达式时，先化简已知的分数，再乘分母把表达式解放出来，然后求解。对 $\\frac{x - 2}{3} = \\frac{10}{2}$：右边是 $5$，所以 $x - 2 = 15$，$x = 17$。不要停在整个表达式的值上。",
    ),
  },
  "act-exam-isolating-variables-from-powers": {
    tip: t(
      "Peel away the coefficient first, then undo the power. For $3x^3 = 24$: divide by $3$ for $x^3 = 8$, and take the cube root to get $x = 2$. A cube root keeps the sign and gives just one real answer. Dividing by $3$ again instead of taking a root is the error.",
      "先去掉系数，再消去幂。对 $3x^3 = 24$：除以 $3$ 得 $x^3 = 8$，开立方得 $x = 2$。立方根保留符号，只有一个实数解。再除以 $3$ 而不是开方是错误的。",
    ),
    hardTip: t(
      "A squared variable can have two real solutions. Move the constant, divide by the coefficient, and write both roots. For $3x^2 - 7 = 41$: $3x^2 = 48$, $x^2 = 16$ and $x = \\pm 4$. Listing only the positive root is the trap; the right side must be nonnegative for any real solution to exist.",
      "平方的变量可能有两个实数解。移常数，除以系数，写出两个根。对 $3x^2 - 7 = 41$：$3x^2 = 48$，$x^2 = 16$，$x = \\pm 4$。只写正根就是陷阱；右边必须非负才有实数解。",
    ),
  },
  "act-exam-identifying-characteristics-of-radical-expressions": {
    tip: t(
      "A square root is real only when the quantity under it is at least $0$. Write that inequality and solve. For $\\sqrt{x - 6}$: $x \\ge 6$, so the least value is $6$. Writing $x > 6$ wrongly excludes the endpoint, since the square root of $0$ is a real number.",
      "平方根只有在根号下的量至少为 $0$ 时才是实数。写出这个不等式并求解。对 $\\sqrt{x - 6}$：$x \\ge 6$，所以最小值是 $6$。写成 $x > 6$ 就错误地排除了端点，因为 $0$ 的平方根是实数。",
    ),
    hardTip: t(
      "If the variable has a negative coefficient under the root, dividing by it reverses the sign, so the domain has a greatest value instead. For $\\sqrt{12 - 3x}$: $-3x \\ge -12$, so $x \\le 4$. Forgetting to reverse the sign would turn this maximum into an incorrect minimum.",
      "根号下变量系数为负时，除以它要反转不等号，所以定义域有最大值。对 $\\sqrt{12 - 3x}$：$-3x \\ge -12$，所以 $x \\le 4$。忘了反转，就会把这个最大值错当成最小值。",
    ),
  },
  "act-exam-identifying-characteristics-of-absolute-values": {
    tip: t(
      "Compute inside the bars first, take the absolute value, and then do the operations outside. For $|3 - 8| + 4$: inside is $-5$, its absolute value is $5$, and the total is $9$. Changing only the signs of the numbers before subtracting, such as $|3| - |8|$, is not allowed.",
      "先算绝对值符号内的部分，取绝对值，再做外面的运算。对 $|3 - 8| + 4$：里面是 $-5$，绝对值为 $5$，总和为 $9$。先分别改符号再相减，如 $|3| - |8|$，是不允许的。",
    ),
    hardTip: t(
      "An absolute value is never below $0$, and it reaches $0$ when the inside vanishes. So the minimum of $|x - a| + c$ is $c$, at $x = a$. For $|x + 3| + 6$, the minimum is $6$, reached at $x = -3$. Give the minimum value of the expression, not the input where it occurs.",
      "绝对值绝不会小于 $0$，里面为零时恰好取到 $0$。所以 $|x - a| + c$ 的最小值是 $c$，在 $x = a$ 处取得。对 $|x + 3| + 6$，最小值是 $6$，在 $x = -3$ 处取得。要给出表达式的最小值，而不是取得它的输入值。",
    ),
  },
  "act-exam-determining-absolute-value-solution-sets": {
    tip: t(
      "Think of $|x - a| = d$ as the points at distance $d$ from $a$, which gives $a + d$ and $a - d$. For $|x + 5| = 3$, the centre is $-5$, so the solutions are $-8$ and $-2$. Remember that a plus sign inside means the centre is negative.",
      "把 $|x - a| = d$ 看作到 $a$ 的距离为 $d$ 的点，得到 $a + d$ 和 $a - d$。对 $|x + 5| = 3$，中心是 $-5$，所以解是 $-8$ 和 $-2$。记住括号内的加号意味着中心是负数。",
    ),
    hardTip: t(
      "Isolate the absolute value first by moving the constant and dividing by the coefficient. Then look at the sign: a positive value gives two solutions, zero gives one, and a negative value gives none. For $3|x - 1| + 5 = -4$: $|x - 1| = -3$, which is impossible. Do not split this into two cases.",
      "先移常数并除以系数，把绝对值孤立出来。然后看符号：正值有两个解，零有一个解，负值无解。对 $3|x - 1| + 5 = -4$：$|x - 1| = -3$，这不可能。不要把它拆成两种情况。",
    ),
  },
  "act-exam-solving-absolute-value-inequalities": {
    tip: t(
      'The inequality $|x - a| < d$ describes points closer than $d$ to $a$, so it is one interval: $a - d < x < a + d$. For $|x - 5| < 3$: $2 < x < 8$. Writing this with "or" gives a different set, one that is outside the interval instead of inside it.',
      "不等式 $|x - a| < d$ 描述的是到 $a$ 的距离小于 $d$ 的点，所以是一个区间：$a - d < x < a + d$。对 $|x - 5| < 3$：$2 < x < 8$。用“或”来写，得到的是另一个集合，在区间之外而不是之内。",
    ),
    hardTip: t(
      'The inequality $|x - a| \\ge d$ describes points at least $d$ from $a$, so the solution splits into two rays joined by "or": $x \\le a - d$ or $x \\ge a + d$. For $|x - 5| \\ge 3$: $x \\le 2$ or $x \\ge 8$. A single interval is the opposite condition, and the endpoints are included here.',
      "不等式 $|x - a| \\ge d$ 描述的是到 $a$ 的距离至少为 $d$ 的点，所以解分成两条射线，用“或”连接：$x \\le a - d$ 或 $x \\ge a + d$。对 $|x - 5| \\ge 3$：$x \\le 2$ 或 $x \\ge 8$。一个区间表示的是相反的条件，这里还包含端点。",
    ),
  },
  "act-exam-writing-structural-linear-models": {
    tip: t(
      "A linear model has a fixed starting amount plus a rate times the variable. Decide which number happens once and which repeats. A tank holding $50$ liters that gains $4$ liters per minute has $50 + 4m$ after $m$ minutes. Attaching the variable to the starting value reverses the roles.",
      "线性模型是固定的初始量加上变化率乘变量。判断哪个数只出现一次，哪个数不断重复。装有 $50$ 升、每分钟增加 $4$ 升的水箱，$m$ 分钟后有 $50 + 4m$ 升。把变量放到初始值上就颠倒了角色。",
    ),
    hardTip: t(
      "When a quantity is built from a geometric description, translate each side into the variable, then apply the formula and simplify. A rectangle of width $w$ and length $2w + 5$ has perimeter $2(w + 2w + 5) = 6w + 10$. Doubling only the $w$ part, not the constant, is the classic slip.",
      "由几何描述构造表达式时，先把每条边用变量表示，再代入公式并化简。宽为 $w$、长为 $2w + 5$ 的矩形，周长是 $2(w + 2w + 5) = 6w + 10$。只把含 $w$ 的部分加倍、不加倍常数，是典型的疏漏。",
    ),
  },
  "act-exam-writing-quantity-and-spending-models": {
    tip: t(
      "A total cost equation adds each item's price times its count: price of the first times its count, plus price of the second times its count, equals the total. Apples at $2$ dollars and melons at $5$ dollars with a total of $30$ dollars give $2a + 5m = 30$. Crossing counts and prices is the trap.",
      "总价方程把每种商品的单价乘数量相加：第一种的单价乘数量，加上第二种的单价乘数量，等于总价。苹果 $2$ 美元、甜瓜 $5$ 美元，总价 $30$ 美元，得到 $2a + 5m = 30$。把数量和单价弄混就是陷阱。",
    ),
    hardTip: t(
      "When one count is a multiple of the other, replace it with that expression so a single variable remains, then combine. Hats at $6$ dollars and scarves at $9$ dollars, with twice as many hats as scarves, cost $6(2s) + 9s = 21s$. Apply the multiple to the count, not to both prices.",
      "一种数量是另一种的倍数时，用这个表达式替换它，只留下一个变量，再合并。帽子 $6$ 美元、围巾 $9$ 美元，帽子数量是围巾的两倍，总价为 $6(2s) + 9s = 21s$。倍数要作用在数量上，而不是两个单价上。",
    ),
  },
  "act-exam-modeling-mixture-problems": {
    tip: t(
      "The amount of pure substance in a solution equals its volume times its percentage written as a decimal. Find it for each solution and add. For $20$ liters at $15\\%$ and $50$ liters at $40\\%$: $3 + 20 = 23$ liters of acid. Adding the percentages themselves gives no meaningful amount.",
      "溶液中纯物质的量等于体积乘百分比（写成小数）。对每种溶液分别算，再相加。$20$ 升浓度 $15\\%$ 和 $50$ 升浓度 $40\\%$：$3 + 20 = 23$ 升酸。把百分比直接相加没有意义。",
    ),
    hardTip: t(
      "The concentration of the mixture is the total pure substance over the total volume, as a percentage. With $23$ liters of acid in $70$ liters: $\\frac{23}{70}$ of the whole, or $\\frac{230}{7}$ percent. Simply averaging the two original percentages ignores their different volumes, so this is the tempting wrong answer.",
      "混合液的浓度等于纯物质总量除以总体积，再写成百分比。$70$ 升中有 $23$ 升酸：占整体的 $\\frac{23}{70}$，即百分之 $\\frac{230}{7}$。直接平均两个原浓度，忽略了体积的不同，是诱人的错误答案。",
    ),
  },
  "act-exam-equating-linear-models": {
    tip: t(
      "Each option is a fee plus a monthly rate times the months. Set the two expressions equal, collect the months on one side and solve. With fees $30$ and $12$ and rates $2$ and $5$ dollars: $30 + 2m = 12 + 5m$ gives $18 = 3m$, so $m = 6$. Do this for any plan, gym or rental story.",
      "每种方案都是固定费用加月费乘月数。令两个表达式相等，把月数移到一边再求解。固定费用 $30$ 和 $12$、月费 $2$ 和 $5$ 美元：$30 + 2m = 12 + 5m$，得 $18 = 3m$，所以 $m = 6$。手机套餐、健身房或租赁的情境都这样做。",
    ),
    hardTip: t(
      "The question asks for a cost, so first find the month when the plans match, then put it back into either expression. With $30 + 2m = 12 + 5m$: $m = 6$, and the cost is $30 + 2(6) = 42$ dollars. Check with the other plan, which also gives $42$. Stopping at the month count is the trap.",
      "题目问的是费用，所以先求出两种方案相等的月份，再代回任一表达式。由 $30 + 2m = 12 + 5m$：$m = 6$，费用是 $30 + 2(6) = 42$ 美元。用另一个方案验算，也是 $42$。停在月数上就是陷阱。",
    ),
  },
  "act-exam-modeling-with-nonlinear-equations": {
    tip: t(
      "Name the unknown, express the other dimension using it, and apply the area formula. A rectangle whose width is $w$ and whose length is $2$ more than $w$, with area $35$, gives $w(w + 2) = 35$. The product of the sides, not their sum, is the area. Options with addition describe a half perimeter.",
      "给未知量命名，用它表示另一个尺寸，再套面积公式。宽为 $w$、长比 $w$ 多 $2$、面积为 $35$ 的矩形，得 $w(w + 2) = 35$。面积是两边之积，不是和。用加法的选项描述的是半周长。",
    ),
    hardTip: t(
      "After setting up the quadratic, solve it, keep the positive root, and use it for the requested quantity. For $w(w + 2) = 35$: the factors give $w = 5$, so the sides are $5$ and $7$ and the perimeter is $24$. Reject a negative length. Giving the width alone would stop too soon.",
      "列出二次方程后求解，保留正根，再用它求所问的量。对 $w(w + 2) = 35$：因式分解得 $w = 5$，边是 $5$ 和 $7$，周长是 $24$。负的长度要舍去。只给出宽度就停得太早了。",
    ),
  },
  "act-exam-evaluating-absolute-value-expressions": {
    tip: t(
      "Absolute value is distance from zero, so it is never negative. Subtract inside the bars first, then drop the negative sign if there is one. For $|5 - 12|$: the inside is $-7$, so the result is $7$. Adding the numbers, or keeping the negative result, gives the options to avoid.",
      "绝对值是到零的距离，所以绝不会是负数。先算绝对值符号内的减法，如果有负号就去掉。例如 $|5 - 12|$：里面是 $-7$，结果是 $7$。把数相加，或者保留负的结果，都是要避开的选项。",
    ),
    hardTip: t(
      "Treat the bars like parentheses in the order of operations: evaluate each one first, then multiply, then subtract. For $3|5 - 12| - |-4|$: $3(7) - 4 = 17$. The minus in front of the second bars stays, even though $|-4|$ on its own is positive. Multiply only the first bars.",
      "在运算顺序中，把绝对值符号看作括号：先分别算出每个，再乘，再减。对 $3|5 - 12| - |-4|$：$3(7) - 4 = 17$。第二个绝对值前面的减号保留，尽管 $|-4|$ 本身是正数。只有第一个绝对值要乘系数。",
    ),
  },
  "act-exam-evaluating-numeric-expressions": {
    tip: t(
      "Multiplication comes before addition, whatever order they are written in. For $5 + 3 \\times 4$: first $3 \\times 4 = 12$, then $5 + 12 = 17$. Working from left to right gives $32$, the wrong value exam options often include. Only parentheses may change this precedence.",
      "乘法优先于加法，不管书写顺序如何。对 $5 + 3 \\times 4$：先算 $3 \\times 4 = 12$，再算 $5 + 12 = 17$。从左到右算得 $32$，这是选项中常见的错误值。只有括号才能改变这个优先级。",
    ),
    hardTip: t(
      "Follow the order: parentheses, then exponent, then multiplication, then the outer subtraction. For $7 - 3(4 - 6)^2$: inside is $-2$, squared is $4$, times $3$ is $12$, and $7 - 12 = -5$. Subtracting $7 - 3$ first breaks the order, and a negative base squared is positive.",
      "按顺序来：括号，指数，乘法，最后是外面的减法。对 $7 - 3(4 - 6)^2$：括号内是 $-2$，平方是 $4$，乘 $3$ 是 $12$，$7 - 12 = -5$。先算 $7 - 3$ 就打乱了顺序；负数的平方是正数。",
    ),
  },
  "act-exam-evaluating-factorials-and-quotients": {
    tip: t(
      "The factorial $n!$ multiplies every whole number from $n$ down to $1$. So $3! = 3 \\cdot 2 \\cdot 1 = 6$ and $5! = 120$. Find the factorial first, then do the addition, because the symbol binds tighter than the plus. Multiplying the base by $2$ is a mistaken shortcut.",
      "阶乘 $n!$ 把从 $n$ 到 $1$ 的所有整数相乘。所以 $3! = 3 \\cdot 2 \\cdot 1 = 6$，$5! = 120$。先算阶乘，再做加法，因为这个符号比加号优先。把底数乘 $2$ 是错误的捷径。",
    ),
    hardTip: t(
      "Factorials in a fraction nearly cancel, so never multiply them out. Write the larger as a product down to the smaller: $\\frac{9!}{8!} = \\frac{9 \\cdot 8!}{8!} = 9$. Similarly, $\\frac{7!}{5!} = 7 \\cdot 6 = 42$. A difference of $1$ in the base does not make the quotient $1$.",
      "分数中的阶乘几乎可以全部约去，所以绝不要展开计算。把较大的写成乘积，一直写到较小的阶乘：$\\frac{9!}{8!} = \\frac{9 \\cdot 8!}{8!} = 9$。同样，$\\frac{7!}{5!} = 7 \\cdot 6 = 42$。底数差 $1$ 并不意味着商是 $1$。",
    ),
  },
  "act-exam-comparing-signed-number-changes": {
    tip: t(
      "A change is the final value minus the initial value. When the start is negative, subtracting it adds its size. From $-6^\\circ$ to $9^\\circ$: $9 - (-6) = 15$ degrees. Giving $3$ is the classic error of combining the numbers without respecting the sign. A number line confirms the distance.",
      "变化量等于终值减初值。起点为负时，减去它等于加上它的大小。从 $-6^\\circ$ 到 $9^\\circ$：$9 - (-6) = 15$ 度。答 $3$ 是不顾符号合并数字的典型错误。数轴可以验证这个距离。",
    ),
    hardTip: t(
      "Compute the size of each change separately, then subtract the two sizes. From $-6^\\circ$ to $9^\\circ$ is $15$, and from $-2^\\circ$ to $10^\\circ$ is $12$, so the difference is $3$. Do not mix numbers from the two cities, and the result is a positive size, whichever is larger.",
      "先分别算出每个变化量的大小，再把两个大小相减。从 $-6^\\circ$ 到 $9^\\circ$ 是 $15$，从 $-2^\\circ$ 到 $10^\\circ$ 是 $12$，差为 $3$。不要混用两个城市的数字；结果是一个正的大小，不论哪个更大。",
    ),
  },
  "act-exam-computing-integer-amounts-in-context": {
    tip: t(
      "Multiply the number of equal transactions by the amount, then subtract the product from the balance. Starting with $200$ dollars and taking out $3$ payments of $15$ dollars leaves $200 - 45 = 155$ dollars. Subtracting only one payment, or adding, gives the options to avoid.",
      "把相同交易的次数乘金额，再从余额中减去这个积。从 $200$ 美元开始，取出 $3$ 笔各 $15$ 美元的款，剩下 $200 - 45 = 155$ 美元。只减一笔，或者做加法，都是要避开的选项。",
    ),
    hardTip: t(
      "With several kinds of transaction, combine the cost per event first. If each of $3$ withdrawals of $15$ dollars has a fee of $5$ dollars, each costs $20$ dollars, for $60$ in all. From $200$, subtract $60$ and then add a deposit of $10$ to get $150$. Charging the fee just once is the trap.",
      "有多种交易时，先合并每次的费用。$3$ 次各取 $15$ 美元、每次手续费 $5$ 美元，则每次花 $20$ 美元，共 $60$ 美元。从 $200$ 减 $60$，再加存款 $10$，得 $150$。手续费只算一次就是陷阱。",
    ),
  },
  "act-exam-identifying-place-value-and-properties": {
    tip: t(
      "Name the places from the right: ones, tens, hundreds, thousands. In $4{,}527$, the ones digit is $7$, the tens digit is $2$ and the hundreds digit is $5$. Identify each requested digit, then combine them as asked. A place holding $0$ still counts, and the comma separates only the thousands.",
      "从右往左给数位命名：个位、十位、百位、千位。在 $4{,}527$ 中，个位是 $7$，十位是 $2$，百位是 $5$。找出所求的每个数字，再按要求组合。数字 $0$ 所在的数位同样算数，逗号只是隔开千位。",
    ),
    hardTip: t(
      "Name a property by what the statement does. The distributive property spreads a factor across a sum: $a(b + c) = ab + ac$. Commutative properties swap the order, and associative properties shift the grouping, while identity properties involve $0$ or $1$. A statement with a factor outside parentheses is usually distributive.",
      "要根据式子的作用来命名性质。分配律把因数分配到和的各项：$a(b + c) = ab + ac$。交换律交换顺序，结合律改变分组，单位元性质涉及 $0$ 或 $1$。括号外有因数的式子通常是分配律。",
    ),
  },
  "act-exam-adding-fractions": {
    tip: t(
      "To add fractions, get a common denominator, add the numerators, keep that denominator and simplify. For $\\frac{1}{3} + \\frac{5}{6}$: rewrite as $\\frac{2}{6} + \\frac{5}{6} = \\frac{7}{6}$. Adding the denominators as well gives a value that is too small, which is a tempting wrong choice.",
      "分数相加要通分，把分子相加，分母不变，再约分。对 $\\frac{1}{3} + \\frac{5}{6}$：改写为 $\\frac{2}{6} + \\frac{5}{6} = \\frac{7}{6}$。把分母也相加，结果就太小了，这是诱人的错误选项。",
    ),
    hardTip: t(
      "A mixed number is a whole part plus a fraction. Add the fractional parts and then the whole part, or change it to an improper fraction first. For $2\\frac{1}{5} + \\frac{3}{5}$: $2 + \\frac{4}{5} = \\frac{14}{5}$. Do not multiply the whole number with the fraction or drop it.",
      "带分数是整数部分加分数部分。可以先加分数部分再加整数部分，也可以先化成假分数。对 $2\\frac{1}{5} + \\frac{3}{5}$：$2 + \\frac{4}{5} = \\frac{14}{5}$。不要把整数和分数相乘，也不要漏掉它。",
    ),
  },
  "act-exam-subtracting-fractions": {
    tip: t(
      "Subtracting uses a common denominator too: rewrite both fractions, subtract the numerators and simplify. For $\\frac{5}{3} - \\frac{1}{6}$: $\\frac{10}{6} - \\frac{1}{6} = \\frac{9}{6} = \\frac{3}{2}$. Subtracting tops and bottoms straight across is the error, and it can even give a zero denominator.",
      "减法同样要通分：改写两个分数，分子相减，再约分。对 $\\frac{5}{3} - \\frac{1}{6}$：$\\frac{10}{6} - \\frac{1}{6} = \\frac{9}{6} = \\frac{3}{2}$。分子分母分别直接相减是错的，甚至可能得到零分母。",
    ),
    hardTip: t(
      "When a mixed length is cut, write it as an improper fraction, reduce the cut piece if possible, then subtract. A board of $3\\frac{1}{4}$ feet with $\\frac{2}{8}$ of a foot removed is $\\frac{13}{4} - \\frac{1}{4} = 3$ feet. To convert: multiply the whole part by the denominator and add the numerator.",
      "带分数的长度被截去时，先写成假分数，能约分的截去部分先约分，再相减。$3\\frac{1}{4}$ 英尺的木板截去 $\\frac{2}{8}$ 英尺，得 $\\frac{13}{4} - \\frac{1}{4} = 3$ 英尺。换算方法：整数部分乘分母，再加分子。",
    ),
  },
  "act-exam-multiplying-fractions": {
    tip: t(
      "To multiply fractions, multiply the numerators together and the denominators together; no common denominator is needed. So $\\frac{2}{3} \\times \\frac{5}{7} = \\frac{10}{21}$. Finding a common denominator and keeping it is a habit from addition that gives a wrong result here.",
      "分数相乘，分子乘分子，分母乘分母，不需要通分。所以 $\\frac{2}{3} \\times \\frac{5}{7} = \\frac{10}{21}$。通分后保留公分母是加法的习惯，用在这里会出错。",
    ),
    hardTip: t(
      "With a whole number as a third factor, cancel it against a denominator before multiplying, which keeps the numbers small. For $\\frac{5}{3} \\times \\frac{2}{5} \\times 6$: $\\frac{5 \\cdot 2 \\cdot 6}{3 \\cdot 5} = 4$. The whole number multiplies only the numerator, not the denominator as well.",
      "第三个因数是整数时，先与分母约分再乘，数字就不会变大。对 $\\frac{5}{3} \\times \\frac{2}{5} \\times 6$：$\\frac{5 \\cdot 2 \\cdot 6}{3 \\cdot 5} = 4$。整数只乘分子，不会同时乘分母。",
    ),
  },
  "act-exam-dividing-with-fractions": {
    tip: t(
      "Dividing by a fraction is multiplying by its reciprocal: keep the first fraction, flip the second one, and multiply. For $\\frac{2}{5} \\div \\frac{3}{10}$: $\\frac{2}{5} \\cdot \\frac{10}{3} = \\frac{4}{3}$. Flipping the first fraction instead gives the reciprocal of the answer, a likely wrong option.",
      "除以一个分数等于乘它的倒数：第一个分数不变，把第二个颠倒，再相乘。对 $\\frac{2}{5} \\div \\frac{3}{10}$：$\\frac{2}{5} \\cdot \\frac{10}{3} = \\frac{4}{3}$。颠倒第一个分数得到的是答案的倒数，很可能是错误选项。",
    ),
    hardTip: t(
      "Questions asking how many pieces of a given size fit into a length call for division: total length divided by piece size. A $9$-foot board cut into pieces of $\\frac{3}{5}$ of a foot gives $9 \\cdot \\frac{5}{3} = 15$ pieces. Multiplying the length by the fraction gives a smaller number, which cannot be right.",
      "问一定长度能分成多少段，要用除法：总长度除以每段的长度。$9$ 英尺的木板，每段 $\\frac{3}{5}$ 英尺，得 $9 \\cdot \\frac{5}{3} = 15$ 段。用长度乘这个分数，得到的数反而变小，显然不对。",
    ),
  },
  "act-exam-finding-a-midpoint-between-fractions": {
    tip: t(
      "The number halfway between two values is their average. With equal denominators, average the numerators and keep the denominator. Halfway between $\\frac{5}{7}$ and $\\frac{9}{7}$ is $\\frac{7}{7} = 1$. Simply adding the two fractions overshoots the midpoint, so remember to divide by $2$.",
      "两个值的正中间是它们的平均数。分母相同时，把分子取平均，分母不变。$\\frac{5}{7}$ 和 $\\frac{9}{7}$ 的正中间是 $\\frac{7}{7} = 1$。只把两个分数相加就超过了中点，记得除以 $2$。",
    ),
    hardTip: t(
      "With unlike denominators, rewrite with a common one, add, and then divide by $2$, which doubles the denominator. Halfway between $\\frac{1}{2}$ and $\\frac{3}{4}$: $\\frac{2}{4} + \\frac{3}{4} = \\frac{5}{4}$, and half of it is $\\frac{5}{8}$. Averaging numerators and denominators separately is not valid.",
      "分母不同时，先通分，相加，再除以 $2$，也就是把分母加倍。$\\frac{1}{2}$ 和 $\\frac{3}{4}$ 的正中间：$\\frac{2}{4} + \\frac{3}{4} = \\frac{5}{4}$，它的一半是 $\\frac{5}{8}$。分别平均分子和分母是不成立的。",
    ),
  },
  "act-exam-locating-numbers-on-a-number-line": {
    tip: t(
      "On a number line, moving left subtracts and moving right adds. Starting from a negative number and moving left makes it more negative: $4$ units left of $-1$ is $-5$. Moving right instead, to $3$, is the tempting wrong answer. A quick sketch confirms the direction.",
      "在数轴上，向左是减，向右是加。从负数出发向左走，数会更小：$-1$ 左边 $4$ 个单位是 $-5$。向右走到 $3$ 是诱人的错误答案。画个草图就能确认方向。",
    ),
    hardTip: t(
      "To divide a segment, find its length by subtracting the endpoints, divide by the number of parts, and add that many part lengths to the start. From $-2$ to $10$ in $6$ parts, each has length $2$; moving $3$ parts right gives $4$. Whether one part or several, start at the left endpoint rather than at zero.",
      "要等分线段，先用两端点相减求长度，再除以份数，然后从起点加上相应份数的长度。从 $-2$ 到 $10$ 分成 $6$ 份，每份长 $2$；向右走 $3$ 份得 $4$。不论是一份还是几份，都从左端点出发，而不是从零出发。",
    ),
  },
  "act-exam-ordering-rational-numbers": {
    tip: t(
      "To find the greatest, compare within sign groups: positives beat zero and negatives. Convert fractions and decimals to one form so the sizes compare. Among $-5$, $\\frac{1}{4}$, $3$ and $3.2$, the greatest is $3.2$, since $3.2 > 3$. A decimal can exceed a nearby whole number.",
      "要找最大的数，先按符号分组比较：正数大于零和负数。把分数和小数化成同一形式才好比大小。在 $-5$、$\\frac{1}{4}$、$3$ 和 $3.2$ 中，最大的是 $3.2$，因为 $3.2 > 3$。小数可能比相邻的整数大。",
    ),
    hardTip: t(
      "To order a list, split it at $0$. Among negatives, the larger size is the smaller number, so $-4 < -\\frac{1}{3}$. Then compare the positives using decimals. For $-\\frac{1}{3}$, $0.2$, $-4$ and $\\frac{5}{4}$: the order is $-4, -\\frac{1}{3}, 0.2, \\frac{5}{4}$. Ordering by size alone misplaces the negatives.",
      "给一列数排序时，以 $0$ 为界分开。负数中绝对值越大的数越小，所以 $-4 < -\\frac{1}{3}$。正数再用小数比较。对 $-\\frac{1}{3}$、$0.2$、$-4$ 和 $\\frac{5}{4}$：顺序是 $-4, -\\frac{1}{3}, 0.2, \\frac{5}{4}$。只按大小排，会把负数放错位置。",
    ),
  },
  "act-exam-estimating-square-roots": {
    tip: t(
      "Find the perfect squares on either side of the number; their roots are the two whole numbers. For $\\sqrt{30}$: since $5^2 = 25$ and $6^2 = 36$, it lies between $5$ and $6$. Dividing the number by $2$ is not a square root, and that shortcut produces far too large a pair.",
      "找出这个数两侧的完全平方数，它们的平方根就是那两个整数。对 $\\sqrt{30}$：因为 $5^2 = 25$，$6^2 = 36$，所以它在 $5$ 和 $6$ 之间。把这个数除以 $2$ 并不是开平方，这种捷径得到的两个数太大了。",
    ),
    hardTip: t(
      "To round, go one step further than bracketing: compare the distance from the number to each neighbouring square. For $\\sqrt{30}$: $30$ is $5$ above $25$ and $6$ below $36$, so it rounds to $5$. Always compare the numbers under the root, and name the root as the answer, not the square.",
      "要四舍五入，比夹逼多走一步：比较这个数到两侧平方数的距离。对 $\\sqrt{30}$：$30$ 比 $25$ 大 $5$，比 $36$ 小 $6$，所以约为 $5$。始终比较根号下的数，答案要写平方根，而不是平方数。",
    ),
  },
  "act-exam-finding-a-whole-from-a-ratio": {
    tip: t(
      "Treat a ratio as equal parts. Divide the known group's count by its parts to get one part, then multiply by the total parts. With boys to girls at $3 : 5$ and $12$ boys, one part is $4$, and $8$ parts make $32$. Reporting only the second group misses the phrase in all.",
      "把比看作若干等份。用已知组的数量除以它的份数，得到一份，再乘总份数。男女生之比为 $3 : 5$、男生 $12$ 人时，一份是 $4$，$8$ 份共 $32$ 人。只报第二组的人数就漏了“一共”这个要求。",
    ),
    hardTip: t(
      "With three groups, add all the parts and divide the total by that sum to get one part. A comparison between groups then uses the difference in parts. For $5 : 2 : 1$ and $40$ items, one part is $5$, and the first group has $4$ more parts than the last, so $20$ more.",
      "有三组时，把所有份数相加，用总量除以这个和，得到一份。组间比较就用份数之差。比为 $5 : 2 : 1$、共 $40$ 个时，一份是 $5$，第一组比最后一组多 $4$ 份，所以多 $20$ 个。",
    ),
  },
  "act-exam-comparing-ratios": {
    tip: t(
      "Two ratios are equal when one pair of terms comes from the other by multiplying both terms by the same number. Reduce both to lowest terms and compare. So $6 : 15$ and $2 : 5$ match, since dividing by $3$ turns one into the other. Larger amounts do not mean a stronger mix.",
      "两个比相等，是指一组数由另一组数同乘一个数得到。把两个比都化成最简再比较。所以 $6 : 15$ 和 $2 : 5$ 相等，因为同除以 $3$ 就能互相转化。量更大并不代表混合物更浓。",
    ),
    hardTip: t(
      "To see which of two fractions is larger, compare the cross products, or decimals. For $\\frac{3}{8}$ and $\\frac{5}{12}$: $3(12) = 36$ and $5(8) = 40$, so the second is larger. The larger cross product belongs to the fraction whose numerator was used. More wins alone does not mean a better record.",
      "要判断两个分数哪个大，可以比较交叉乘积或小数。对 $\\frac{3}{8}$ 和 $\\frac{5}{12}$：$3(12) = 36$，$5(8) = 40$，所以第二个更大。较大的交叉乘积属于用了其分子的那个分数。赢的场数多，不等于胜率高。",
    ),
  },
  "act-exam-solving-fuel-mileage-problems": {
    tip: t(
      "Mileage is miles per gallon, so gallons equal the distance divided by the mileage. A car getting $30$ miles per gallon uses $4$ gallons on a $120$-mile trip. Let the units guide you: multiplying miles by miles per gallon gives nonsense, and that product is the wrong option offered.",
      "油耗是每加仑行驶的英里数，所以加仑数等于路程除以油耗。每加仑 $30$ 英里的车，跑 $120$ 英里用 $4$ 加仑。让单位来引导你：英里乘每加仑英里毫无意义，这个积就是选项中的错误答案。",
    ),
    hardTip: t(
      "A cost needs two steps: find the gallons from the distance and mileage, then multiply by the price per gallon. At $30$ miles per gallon and $5$ dollars a gallon, a trip of $120$ miles uses $4$ gallons and costs $20$ dollars. Stopping at gallons is the usual unfinished answer.",
      "求费用要两步：先由路程和油耗求加仑数，再乘每加仑的价格。每加仑 $30$ 英里、每加仑 $5$ 美元时，$120$ 英里用 $4$ 加仑，花 $20$ 美元。停在加仑数上是常见的半成品答案。",
    ),
  },
  "act-exam-working-with-a-rate-of-change": {
    tip: t(
      "A constant rate means the amount equals the start plus the rate times the time. A pool with $50$ gallons gaining $6$ gallons each hour holds $50 + 6(4) = 74$ gallons after $4$ hours. Do multiplication first; adding the start and the rate before multiplying gives an answer that is far too large.",
      "变化率恒定时，总量等于初始量加变化率乘时间。水池有 $50$ 加仑、每小时增加 $6$ 加仑，$4$ 小时后有 $50 + 6(4) = 74$ 加仑。先做乘法；先把初始量和变化率相加再乘，结果就大得多。",
    ),
    hardTip: t(
      "When the rate is not stated, find it from two readings: change in amount over change in time. Then apply it from the start. If a level goes from $20$ to $35$ over $5$ hours, the rate is $3$ per hour, and after $9$ hours it is $47$. Count time from the start, not from the second reading.",
      "变化率没有给出时，用两次读数求：量的变化除以时间的变化。再从起点开始计算。水位在 $5$ 小时内从 $20$ 升到 $35$，变化率是每小时 $3$，$9$ 小时后是 $47$。时间从起点算，而不是从第二次读数算。",
    ),
  },
  "act-exam-finding-position-or-travel-time": {
    tip: t(
      "Distance, rate and time are linked by $d = rt$, so time equals distance over rate. A cyclist at $12$ miles per hour takes $3$ hours for $36$ miles. Multiplying distance by speed gives a large number with no meaning. Check that the rate times your answer returns the distance.",
      "距离、速度和时间的关系是 $d = rt$，所以时间等于距离除以速度。每小时 $12$ 英里的骑手走 $36$ 英里要 $3$ 小时。距离乘速度得到一个毫无意义的大数。检查速度乘答案能否回到距离。",
    ),
    hardTip: t(
      "To add a duration to a clock time, add hours to hours and minutes to minutes, then carry if minutes reach $60$. Leaving at $9{:}40$ with a trip of $1$ hour and $35$ minutes gives $10{:}75$, which is $11{:}15$. Treating a clock like a decimal number is the main trap.",
      "把时长加到钟点上，小时加小时，分钟加分钟，分钟满 $60$ 就进位。$9{:}40$ 出发，行程 $1$ 小时 $35$ 分，得 $10{:}75$，即 $11{:}15$。把钟点当作小数来算是主要陷阱。",
    ),
  },
  "act-exam-finding-an-average-speed": {
    tip: t(
      "Average speed is the distance divided by the time: $s = \\frac{d}{t}$. A runner covering $18$ miles in $3$ hours averages $6$ miles per hour. Mind the order, because dividing time by distance gives hours per mile, a small value that is not a speed.",
      "平均速度等于路程除以时间：$s = \\frac{d}{t}$。$3$ 小时跑 $18$ 英里，平均每小时 $6$ 英里。注意顺序，用时间除以路程得到的是每英里所需小时数，是一个很小的值，并不是速度。",
    ),
    hardTip: t(
      "With two legs, average speed is total distance over total time, not the mean of the two speeds. Going $30$ miles per hour for $1$ hour and $60$ miles per hour for $2$ hours covers $150$ miles in $3$ hours, so $50$. The simple mean of $45$ works only with equal times.",
      "有两段路程时，平均速度是总路程除以总时间，而不是两个速度的平均。以每小时 $30$ 英里走 $1$ 小时，再以每小时 $60$ 英里走 $2$ 小时，$3$ 小时共 $150$ 英里，所以是 $50$。简单平均 $45$ 只在时间相等时才成立。",
    ),
  },
  "act-exam-solving-multi-leg-speed-problems": {
    tip: t(
      "Each leg has its own distance, rate times time. Compute them separately and add. For $30$ miles per hour over $2$ hours, then $50$ miles per hour over $3$ hours: $60 + 150 = 210$ miles. Adding the speeds and times first and then multiplying produces a wrong total.",
      "每一段都有自己的路程，等于速度乘时间。分别计算再相加。以每小时 $30$ 英里走 $2$ 小时，再以每小时 $50$ 英里走 $3$ 小时：$60 + 150 = 210$ 英里。先把速度和时间分别相加再相乘，总数就错了。",
    ),
    hardTip: t(
      "When a total distance is given, subtract the first leg's distance to find what remains, and divide by the second speed. A trip of $200$ miles with a first leg of $2$ hours at $30$ miles per hour leaves $140$ miles; at $70$ miles per hour, it takes $2$ hours. Dividing the full total by the second speed is the trap.",
      "已知总路程时，减去第一段的路程得到剩余，再除以第二段的速度。$200$ 英里的行程，第一段以每小时 $30$ 英里走 $2$ 小时，还剩 $140$ 英里；以每小时 $70$ 英里要 $2$ 小时。用总路程除以第二段的速度就是陷阱。",
    ),
  },
  "act-exam-combining-rates": {
    tip: t(
      "When workers run together, their rates add. Combine the rates, then multiply by the time. Printers at $6$ and $4$ pages per minute make $10$ pages per minute together, or $150$ pages in $15$ minutes. Do not average the rates, since both work the whole time.",
      "同时工作时，速率相加。先合并速率，再乘时间。每分钟 $6$ 页和 $4$ 页的打印机，合起来每分钟 $10$ 页，$15$ 分钟共 $150$ 页。不要取平均，因为两台都工作了全部时间。",
    ),
    hardTip: t(
      "When given the times for one job, convert each to a rate, as one job per that time, then add the fractions. Pipes taking $3$ and $6$ hours have $\\frac{1}{3} + \\frac{1}{6} = \\frac{1}{2}$ tank per hour, so $2$ hours per tank. For several tanks, multiply. Adding the times gives a much longer, wrong result.",
      "已知完成一项工作的时间时，把每个时间化为速率，即每单位时间完成几分之一，再把分数相加。需要 $3$ 小时和 $6$ 小时的水管，每小时共完成 $\\frac{1}{3} + \\frac{1}{6} = \\frac{1}{2}$ 箱，即每箱 $2$ 小时。多个水箱就再相乘。把时间相加得到的时间长得多，是错的。",
    ),
  },
  "act-exam-finding-a-percent-in-a-mixture": {
    tip: t(
      "A percent is the part divided by the whole, times $100$. Identify the whole as the entire mixture, not the other ingredient. A $50$-ounce drink with $10$ ounces of syrup is $20\\%$ syrup. Dividing $10$ by the other $40$ ounces gives the ratio to the remainder, which is a different number.",
      "百分比等于部分除以整体，再乘 $100$。整体是整个混合物，不是另一种成分。$50$ 盎司的饮料含 $10$ 盎司糖浆，糖浆占 $20\\%$。用 $10$ 除以其余的 $40$ 盎司，得到的是与其余部分的比，是另一个数。",
    ),
    hardTip: t(
      "When equal volumes of two solutions are mixed, the resulting percent is the plain mean of the two percents, since each contributes the same weight. Equal amounts at $20\\%$ and $30\\%$ make $25\\%$; the volume itself does not matter. Adding the percents gives a mixture stronger than either, which is impossible.",
      "两种溶液体积相等时，混合后的百分比就是两个百分比的平均数，因为它们权重相同。等量的 $20\\%$ 和 $30\\%$ 混合得 $25\\%$；具体体积并不重要。把百分比相加得到的浓度比任何一种都高，这是不可能的。",
    ),
  },
  "act-exam-converting-a-rate": {
    tip: t(
      "A seconds figure is smaller than the same rate per minute, since a second is shorter. So divide by $60$. A fan moving $480$ feet each minute moves $8$ feet each second. Multiplying by $60$ instead is the wrong direction, which you can spot by the unreasonably large answer.",
      "以秒计的量比以分钟计的同一速率小，因为一秒更短。所以要除以 $60$。风扇每分钟移动 $480$ 英尺，每秒移动 $8$ 英尺。乘 $60$ 则方向错了，从答案大得离谱就能看出来。",
    ),
    hardTip: t(
      "To find a total over hours from a rate per minute, first convert the hours to minutes by multiplying by $60$, then multiply by the rate. A press printing $20$ sheets per minute for $3$ hours makes $20(180) = 3{,}600$ sheets. Forgetting to convert leaves a value $60$ times too small.",
      "由每分钟的速率求若干小时的总量，先把小时乘 $60$ 化成分钟，再乘速率。每分钟印 $20$ 张、印 $3$ 小时的印刷机，共印 $20(180) = 3{,}600$ 张。忘了换算，结果就小了 $60$ 倍。",
    ),
  },
  "act-exam-computing-a-total-from-unit-prices": {
    tip: t(
      "A total cost is the sum over items of quantity times price. Pair each count with its own price, multiply, then add. So $3$ hats at $7$ dollars and $5$ gloves at $2$ dollars cost $21 + 10 = 31$ dollars. Swapping prices and counts is the likely error.",
      "总价是各商品数量乘单价之和。每个数量配上自己的单价，相乘，再相加。所以 $3$ 顶 $7$ 美元的帽子和 $5$ 副 $2$ 美元的手套，共 $21 + 10 = 31$ 美元。把单价和数量配错是很可能的错误。",
    ),
    hardTip: t(
      "A third item adds one more product to the sum, and the method is unchanged: multiply each pair, then add all three. For $3$ at $7$ dollars, $5$ at $2$ dollars and $4$ at $6$ dollars: $21 + 10 + 24 = 55$ dollars. Leaving out the new item is the wrong total to avoid.",
      "第三种商品只是多加一个乘积，方法不变：每对分别相乘，再把三个积相加。$3$ 件 $7$ 美元、$5$ 件 $2$ 美元、$4$ 件 $6$ 美元：$21 + 10 + 24 = 55$ 美元。漏掉新增的商品就是要避开的错误总数。",
    ),
  },
  "act-exam-finding-a-total-from-repeated-amounts": {
    tip: t(
      "Find how many days there are first, then multiply by the daily amount. A shop open $5$ days a week for $3$ weeks is open $15$ days, so at $8$ items a day it sells $120$ items. Multiplying the daily amount by the weeks alone misses the days per week.",
      "先求出天数，再乘每天的量。每周营业 $5$ 天、持续 $3$ 周的商店，共营业 $15$ 天，每天卖 $8$ 件就是 $120$ 件。只把每天的量乘周数，就漏了每周的天数。",
    ),
    hardTip: t(
      "Build a one-week total first: the daily amount times the days, plus any weekly extra. Then multiply by the weeks. With $6$ pages on $5$ days and $9$ extra each week, a week has $39$ pages, so $3$ weeks have $117$. Counting the weekly extra only once is the trap.",
      "先算出一周的总量：每天的量乘天数，再加上每周额外的量。然后乘周数。每周 $5$ 天、每天 $6$ 页，每周另加 $9$ 页，一周共 $39$ 页，$3$ 周共 $117$ 页。额外的量只算一次就是陷阱。",
    ),
  },
  "act-exam-computing-a-cost-from-a-unit-rate": {
    tip: t(
      "Find the unit price by dividing the total cost by the number of units, then multiply by the new amount. If $5$ kilograms cost $40$ dollars, one kilogram costs $8$ dollars, and $3$ kilograms cost $24$ dollars. Comparing units directly with a ratio gives the same answer.",
      "用总价除以单位数，得到单价，再乘新的数量。若 $5$ 千克花 $40$ 美元，每千克就是 $8$ 美元，$3$ 千克花 $24$ 美元。直接用比例比较数量，结果也一样。",
    ),
    hardTip: t(
      "A flat fee is charged once and does not scale. Subtract it, divide by the hours for the rate, then rebuild the new cost with the fee. With a $20$-dollar fee and $3$ hours totalling $110$ dollars, the rate is $30$, so $5$ hours cost $170$ dollars. Scaling the whole total counts the fee too often.",
      "固定费用只收一次，不按比例变化。先减去它，除以小时数得到每小时费率，再把新费用连同固定费用一起算出来。固定费 $20$ 美元、$3$ 小时共 $110$ 美元，费率是 $30$，所以 $5$ 小时花 $170$ 美元。按比例放大总价，就把固定费算多了。",
    ),
  },
  "act-exam-finding-a-remaining-amount": {
    tip: t(
      "Money left equals the starting amount minus the spending, and spending is the count times the price. Starting from $100$ dollars with $6$ books at $5$ dollars each, the spending is $30$ dollars and $70$ dollars remain. Reporting the spending instead of the remainder is the trap.",
      "剩余的钱等于起始金额减去花费，花费等于数量乘单价。从 $100$ 美元开始，买 $6$ 本每本 $5$ 美元的书，花 $30$ 美元，剩 $70$ 美元。把花费当作剩余就是陷阱。",
    ),
    hardTip: t(
      "With two kinds of purchase, find both costs, add them, then subtract once from the start. Starting from $100$ dollars, $6$ items at $5$ dollars and $3$ items at $7$ dollars cost $51$ dollars, leaving $49$ dollars. Deducting just one kind of item is an incomplete answer.",
      "有两种购买时，求出两种花费，相加，再从起始金额中减一次。从 $100$ 美元开始，$6$ 件 $5$ 美元和 $3$ 件 $7$ 美元共花 $51$ 美元，剩 $49$ 美元。只减一种商品的花费，答案就不完整。",
    ),
  },
  "act-exam-comparing-two-totals": {
    tip: t(
      "When both plans last the same time, the total difference is the difference in the rate times the period. For $5$ and $12$ dollars a month over $6$ months, the gap is $7(6) = 42$ dollars. You may also compute both totals and subtract. Giving a single total leaves the comparison undone.",
      "两个方案时间相同时，总差额等于费率之差乘时长。每月 $5$ 和 $12$ 美元，$6$ 个月的差额是 $7(6) = 42$ 美元。也可以求出两个总额再相减。只给出一个总额，比较就没完成。",
    ),
    hardTip: t(
      "With start fees, compute each total as fee plus monthly cost times months, then subtract the smaller from the larger. Plans with fees $30$ and $6$ and rates $5$ and $10$ dollars over $6$ months total $60$ and $66$, a gap of $6$ dollars. Ignoring the fees gives only the monthly gap.",
      "有起始费用时，每个总额等于起始费加月费乘月数，再用较大的减去较小的。起始费 $30$ 和 $6$、月费 $5$ 和 $10$ 美元，$6$ 个月的总额是 $60$ 和 $66$，差 $6$ 美元。忽略起始费只能得到月费部分的差。",
    ),
  },
  "act-exam-finding-a-net-cost-or-profit": {
    tip: t(
      "Profit is revenue minus cost. When each item has the same prices, multiply the profit per item by the number sold. Buying at $3$ dollars and selling at $8$ dollars earns $5$ dollars per item, so $20$ items earn $100$ dollars. Using only the sale price ignores what was paid.",
      "利润等于收入减成本。每件价格相同时，用每件利润乘卖出的数量。$3$ 美元买入、$8$ 美元卖出，每件赚 $5$ 美元，$20$ 件赚 $100$ 美元。只用售价就忽略了进货的花费。",
    ),
    hardTip: t(
      "Find the sale price after the discount, multiply it by the quantity for revenue, then subtract both the item cost and any fixed fee. At a list price of $50$ dollars less $20\\%$, each sells for $40$ dollars; $10$ items that cost $5$ dollars each with a $30$-dollar fee earn $400 - 50 - 30 = 320$ dollars.",
      "先求折后售价，乘数量得收入，再减去商品成本和固定费用。标价 $50$ 美元打八折（减 $20\\%$），每件卖 $40$ 美元；$10$ 件、每件成本 $5$ 美元、固定费 $30$ 美元，利润为 $400 - 50 - 30 = 320$ 美元。",
    ),
  },
  "act-exam-computing-overtime-pay": {
    tip: t(
      "Split the hours into regular and extra. Time-and-a-half means $1.5$ times the base wage, for the extra hours only. At $10$ dollars an hour with a $35$-hour threshold, $38$ hours pay $350 + 3(15) = 395$ dollars. Paying all hours at the higher rate is the classic error.",
      "把工时分成正常工时和加班工时。一倍半工资指基本工资的 $1.5$ 倍，只适用于加班工时。每小时 $10$ 美元、门槛 $35$ 小时，$38$ 小时的工资是 $350 + 3(15) = 395$ 美元。所有工时都按高费率算是典型错误。",
    ),
    hardTip: t(
      "To find the hours from the pay, reverse the process: subtract regular pay for the threshold hours, divide the rest by the overtime rate, and add the threshold back. At $10$ dollars for $35$ hours, then double: total pay $430$ leaves $80$, which is $4$ overtime hours, so $39$ hours in all.",
      "由工资求工时，要把过程倒过来：减去门槛工时的正常工资，余额除以加班费率，再把门槛工时加回去。前 $35$ 小时每小时 $10$ 美元，之后加倍：总工资 $430$，余 $80$，即加班 $4$ 小时，共 $39$ 小时。",
    ),
  },
  "act-exam-finding-a-unit-amount": {
    tip: t(
      "Dividing a total by the number of identical items gives the amount for one. If $6$ matching pens cost $18$ dollars together, one pen costs $3$ dollars. Multiplying instead gives a larger total, which cannot be the price of a single item, and this check quickly rejects that option.",
      "用总量除以相同物品的数量，就得到一件的量。$6$ 支相同的笔共 $18$ 美元，一支就是 $3$ 美元。做乘法会得到更大的总数，不可能是单件的价格，用这一点可以快速排除这个选项。",
    ),
    hardTip: t(
      "A one-time fee sits outside the unit price, so remove it before dividing, then scale to the new quantity. If $5$ tickets plus a $4$-dollar fee cost $29$ dollars, one ticket is $5$ dollars and $10$ tickets cost $50$ dollars. The fee is not doubled, and it is not part of the requested tickets.",
      "一次性费用不包含在单价中，所以要先去掉再除，然后按新的数量放大。$5$ 张票加 $4$ 美元手续费共 $29$ 美元，一张票是 $5$ 美元，$10$ 张票是 $50$ 美元。手续费不会加倍，也不属于所求的票价。",
    ),
  },
  "act-exam-finding-a-fractional-part-of-a-whole": {
    tip: t(
      "Taking a fraction of a number means multiplying: divide by the denominator, then multiply by the numerator. For $\\frac{5}{4}$ of $20$: one fourth is $5$, so the result is $25$. With the numerator above the denominator, the result exceeds the original number, which is a useful check.",
      "求一个数的几分之几就是做乘法：除以分母，再乘分子。$20$ 的 $\\frac{5}{4}$：四分之一是 $5$，结果是 $25$。分子大于分母时，结果比原数大，这是个有用的检查。",
    ),
    hardTip: t(
      "If a fraction of an unknown number is given, divide by the fraction, equivalently multiply by its reciprocal. If $\\frac{5}{4}$ of a number is $30$: one share is $6$, and four shares make $24$. Multiplying by $\\frac{5}{4}$ again goes the wrong way and yields a number that is too large.",
      "已知一个未知数的几分之几时，要除以这个分数，也就是乘它的倒数。若某数的 $\\frac{5}{4}$ 是 $30$：一份是 $6$，四份是 $24$。再乘 $\\frac{5}{4}$ 是方向错了，得到的数太大。",
    ),
  },
  "act-exam-applying-successive-fractions": {
    tip: t(
      "A fraction of a fraction of a group means multiplying them all. If $\\frac{1}{3}$ of $120$ members swim, and $\\frac{1}{4}$ of those swimmers race, then $\\frac{1}{4} \\cdot \\frac{1}{3} \\cdot 120 = 10$ members race. Taking the second fraction of the entire group ignores the phrase of those.",
      "一组的几分之几的几分之几，就是把它们全部相乘。$120$ 名成员的 $\\frac{1}{3}$ 游泳，这些人的 $\\frac{1}{4}$ 参加比赛，则有 $\\frac{1}{4} \\cdot \\frac{1}{3} \\cdot 120 = 10$ 人。把第二个分数用到全体，就忽略了“这些人中”的说法。",
    ),
    hardTip: t(
      "When spending happens in stages, compute what remains after each stage, and take the next fraction from that. From $120$ dollars, spending $\\frac{1}{3}$ leaves $80$; spending $\\frac{1}{4}$ of the remainder leaves $60$ dollars. Taking both fractions of the original gives a different and incorrect balance.",
      "分阶段花钱时，算出每一阶段后的剩余，下一个分数都用这个剩余来算。从 $120$ 美元开始，花掉 $\\frac{1}{3}$ 剩 $80$；再花掉剩余的 $\\frac{1}{4}$，剩 $60$ 美元。两个分数都用原金额计算，得到的余额不同，是错的。",
    ),
  },
  "act-exam-packing-into-whole-groups": {
    tip: t(
      "To carry everyone, divide and round up, because a partly full group still needs a vehicle. With $5$ seats per car and $22$ people: $22 = 5(4) + 2$, so $5$ cars are needed. Ignoring the remainder leaves people behind, and this common rounding down is the trap.",
      "要把所有人都运走，就除后向上取整，因为没坐满也需要一辆车。每辆车 $5$ 个座位、$22$ 人：$22 = 5(4) + 2$，所以需要 $5$ 辆车。忽略余数就会有人被落下，这种向下取整是常见的陷阱。",
    ),
    hardTip: t(
      "Full groups use the quotient, rounded down, and the leftovers are the remainder. Write the number as divisor times quotient plus remainder. For $38$ eggs in cartons of $6$: $38 = 6(6) + 2$, so $6$ cartons and $2$ eggs left. The remainder is a count of items, not a decimal part.",
      "满的组数是商（向下取整），剩下的是余数。把这个数写成除数乘商加余数。$38$ 个鸡蛋、每盒 $6$ 个：$38 = 6(6) + 2$，所以是 $6$ 盒，剩 $2$ 个。余数是物品的个数，不是小数部分。",
    ),
  },
  "act-exam-finding-counts-from-waste-and-limits": {
    tip: t(
      "Find how many pieces one unit gives by dividing, then multiply by the number of units. A $12$-foot pipe gives $4$ pieces of $3$ feet, so $5$ pipes give $20$ pieces. Dividing by the pipe count instead, or stopping after a single pipe, gives the wrong numbers.",
      "用除法求出一个单位能截成几段，再乘单位数。$12$ 英尺的管子能截成 $4$ 段 $3$ 英尺的管段，所以 $5$ 根管子共 $20$ 段。改为除以管子数，或者只算一根就停下，都得到错误的数。",
    ),
    hardTip: t(
      "Remove the waste first: a rejected percent means keeping the rest. Then divide the good items by the group size and drop any remainder, since only full groups count. With $500$ items, $20\\%$ rejected and crates of $3$, there are $400$ good items and $133$ full crates. Taking the rejected share itself is the trap.",
      "先去掉废品：被拒的百分比意味着保留其余部分。再用合格品数除以每组的数量，舍去余数，因为只算满组。$500$ 件、$20\\%$ 被拒、每箱 $3$ 件：合格品 $400$ 件，满箱 $133$ 箱。把被拒的那部分当作合格品就是陷阱。",
    ),
  },
  "act-exam-combining-segments-of-a-trip": {
    tip: t(
      "A total route is just the sum of its parts. Add the legs in any convenient order, pairing numbers that make round tens. For legs of $25$, $15$ and $42$ miles: $25 + 15 = 40$, then $82$ miles. Every leg must be included; leaving one out produces a smaller wrong total.",
      "总路程就是各部分之和。按方便的顺序相加，把能凑成整十的数配对。路段 $25$、$15$ 和 $42$ 英里：$25 + 15 = 40$，再得 $82$ 英里。每一段都要算上；漏掉一段就得到较小的错误总数。",
    ),
    hardTip: t(
      "To get time, add the legs, then divide by the rate. Note the rate's unit: miles per minute gives minutes, not hours. For legs totalling $120$ miles at $2$ miles per minute, the route takes $60$ minutes. Dividing just one leg, or multiplying by the rate, gives an incorrect time.",
      "要求时间，把各段相加，再除以速度。注意速度的单位：每分钟英里数得到的是分钟，不是小时。总长 $120$ 英里、每分钟 $2$ 英里，路线要 $60$ 分钟。只除一段，或者乘了速度，时间就错了。",
    ),
  },
  "act-exam-identifying-a-necessary-conclusion": {
    tip: t(
      "A statement about every member applies to each individual in that group, and to nobody else. If every singer in a choir reads music and Kim is a singer, then Kim reads music. It does not follow that everyone who reads music sings, nor anything about those outside the group. Pick the direct conclusion.",
      "关于每个成员的陈述，适用于该组中的每个人，但不涉及别人。若合唱团每位歌手都识谱，Kim 是歌手，则 Kim 识谱。但不能推出识谱的人都唱歌，也不能推出关于组外的人的任何结论。选择直接得出的结论。",
    ),
    hardTip: t(
      "A must-be-true statement holds for every possible number, so test each option with several examples. Divisibility passes to factors: a multiple of $6$ is also a multiple of $2$ and $3$. It need not be a multiple of $12$, as $18$ shows. One counterexample is enough to eliminate an option.",
      "必然成立的结论对每个可能的数都成立，所以用几个例子检验各选项。整除性会传给因数：$6$ 的倍数也是 $2$ 和 $3$ 的倍数。但不一定是 $12$ 的倍数，$18$ 就是反例。一个反例就足以排除一个选项。",
    ),
  },
  "act-exam-finding-a-value-from-a-mean": {
    tip: t(
      "The mean times the number of values gives the total the values must reach. Subtract the known ones for the missing value. If $3$ scores of $80$, $70$ and $90$ and a fourth have mean $85$, the total is $340$, so the fourth is $100$. Averaging the mean with the known scores is the wrong move.",
      "平均数乘个数，得到这些值必须达到的总和。减去已知值，就得到缺失的值。$80$、$70$、$90$ 和第四个分数的平均数为 $85$ 时，总和是 $340$，所以第四个是 $100$。把平均数与已知分数再平均是错的。",
    ),
    hardTip: t(
      "When a value is removed, compare two totals: the old mean times the old count, and the new mean times the new count. Their difference is the removed value. With $4$ numbers averaging $10$, and $3$ left averaging $8$: $40 - 24 = 16$. Subtracting the means alone gives only their change.",
      "去掉一个值时，比较两个总和：原平均数乘原个数，新平均数乘新个数。它们的差就是去掉的值。$4$ 个数平均 $10$，剩下 $3$ 个平均 $8$：$40 - 24 = 16$。只把平均数相减，得到的只是平均数的变化。",
    ),
  },
  "act-exam-finding-a-difference-of-center-measures": {
    tip: t(
      "The median is the middle value after sorting. Put the numbers in order, then pick the centre. For $8, 2, 6, 3, 10$: sorted, they are $2, 3, 6, 8, 10$, so the median is $6$. Taking the middle number of the unsorted list is the mistake exam options reward.",
      "中位数是排序后位于中间的值。把数排好序，再取中间的。对 $8, 2, 6, 3, 10$：排序后是 $2, 3, 6, 8, 10$，中位数是 $6$。在未排序的列表中取中间的数，是选项所利用的错误。",
    ),
    hardTip: t(
      "Raising the largest value lifts the total by that amount, so the mean grows by the amount over the count. The median stays, as the order in the middle does not change. Increasing the top of $5$ values by $10$ raises the mean by $2$. Reporting the full increase forgets to share it out.",
      "提高最大值使总和增加相同的量，所以平均数增加的是这个量除以个数。中位数不变，因为中间的顺序没有变。$5$ 个值中最大的增加 $10$，平均数增加 $2$。报告全部增量就忘了要平摊。",
    ),
  },
  "act-exam-finding-the-area-of-a-square": {
    tip: t(
      "A square's area is its side times itself: $A = s^2$. For side $9$: $A = 81$. Doubling the side confuses squaring with multiplying by $2$, and $4s$ is the perimeter, not the area. Area is reported in square units.",
      "正方形的面积是边长乘自身：$A = s^2$。边长为 $9$ 时：$A = 81$。把边长加倍是把平方和乘 $2$ 弄混了，$4s$ 是周长，不是面积。面积用平方单位表示。",
    ),
    hardTip: t(
      "From a perimeter, divide by $4$ for the side, since all four sides are equal, then square it. A perimeter of $36$ means a side of $9$ and an area of $81$. Squaring the perimeter directly, or giving the side as the final answer, misses a step.",
      "由周长求面积，先除以 $4$ 得边长，因为四条边相等，再平方。周长 $36$ 意味着边长 $9$，面积 $81$。直接把周长平方，或者把边长作为最终答案，都少了一步或错了一步。",
    ),
  },
  "act-exam-finding-the-area-of-a-triangle": {
    tip: t(
      "A triangle's area is half of base times height: $A = \\frac{1}{2}bh$. For base $8$ and height $5$: $A = 20$. Without the half, you get the area of the rectangle around the triangle, which is the typical wrong option. The height is perpendicular to the base.",
      "三角形面积是底乘高的一半：$A = \\frac{1}{2}bh$。底 $8$、高 $5$ 时：$A = 20$。不取一半，得到的是外围矩形的面积，这是典型的错误选项。高与底垂直。",
    ),
    hardTip: t(
      "In a right triangle, the two legs are perpendicular, so one is the base and the other the height. No separate height is needed. With legs $6$ and $14$: $A = \\frac{1}{2}(6)(14) = 42$. Avoid using the hypotenuse, which is not perpendicular to either leg.",
      "直角三角形的两条直角边互相垂直，所以一条是底，另一条是高，不需要另外的高。直角边为 $6$ 和 $14$ 时：$A = \\frac{1}{2}(6)(14) = 42$。不要用斜边，它与任何一条直角边都不垂直。",
    ),
  },
  "act-exam-finding-a-side-from-equal-areas": {
    tip: t(
      "Equal areas let you compute one area and use it for the other shape. Multiply the rectangle's sides, then take the square root for the square's side. A $4$ by $25$ rectangle has area $100$, so the square's side is $10$. Averaging the rectangle's sides is the wrong shortcut.",
      "面积相等时，可以算出一个面积，用到另一个图形上。把矩形的两边相乘，再开方得正方形的边长。$4$ 乘 $25$ 的矩形面积是 $100$，所以正方形边长是 $10$。把矩形两边取平均是错误的捷径。",
    ),
    hardTip: t(
      "Compute the known shape's area with the right formula, including the half for a triangle, then divide by the rectangle's known side. A triangle with base $10$ and height $6$ has area $30$, so a rectangle of width $5$ has length $6$. Forgetting the half doubles the answer.",
      "用正确的公式求已知图形的面积，三角形别忘了一半，再除以矩形的已知边。底 $10$、高 $6$ 的三角形面积是 $30$，所以宽 $5$ 的矩形长为 $6$。忘了一半，答案就翻倍了。",
    ),
  },
  "act-exam-combining-rectangle-areas": {
    tip: t(
      "Find each room's area separately, as length times width, then add. A $4$ by $7$ room and a $5$ by $3$ room together cover $28 + 15 = 43$ square units. Adding all four numbers gives a kind of perimeter. Multiplying them all together has no meaning for a floor.",
      "分别求每个房间的面积（长乘宽），再相加。$4$ 乘 $7$ 和 $5$ 乘 $3$ 的房间，共 $28 + 15 = 43$ 平方单位。把四个数相加得到的类似周长。把它们全部相乘，对地面来说没有意义。",
    ),
    hardTip: t(
      "An excluded part inside a room is subtracted, once, after adding the rooms. With rooms of $28$ and $15$ square units and a closet of $3$ by $2$ inside the first, the carpeted area is $43 - 6 = 37$. Adding the closet instead treats it as an extra room.",
      "房间内被排除的部分，在把房间相加之后减去一次。房间面积为 $28$ 和 $15$ 平方单位，第一个房间内有 $3$ 乘 $2$ 的壁橱，铺地毯的面积是 $43 - 6 = 37$。加上壁橱就把它当成了额外的房间。",
    ),
  },
  "act-exam-finding-a-shaded-fractional-area": {
    tip: t(
      "A fraction of equal parts is a count over the total. Subtract shaded parts from the total to get the rest, and simplify. If $4$ of $10$ equal parts are shaded, then $\\frac{6}{10} = \\frac{3}{5}$ is unshaded. Read the question closely: giving the shaded fraction answers the opposite question.",
      "等份的分数是份数除以总份数。用总数减去阴影部分得到其余部分，再约分。$10$ 个等份中有 $4$ 份是阴影，则 $\\frac{6}{10} = \\frac{3}{5}$ 无阴影。仔细看问题：给出阴影部分的分数就答反了。",
    ),
    hardTip: t(
      "For a square inside a square, the area fraction is the square of the side ratio. With sides $3$ and $12$, the side ratio is $\\frac{1}{4}$, and the area fraction is $\\frac{9}{144} = \\frac{1}{16}$ of the larger. Quoting the side ratio itself is the trap: lengths and areas scale differently.",
      "正方形内有小正方形时，面积比等于边长比的平方。边长为 $3$ 和 $12$ 时，边长比是 $\\frac{1}{4}$，面积比是大正方形的 $\\frac{9}{144} = \\frac{1}{16}$。直接用边长比就是陷阱：长度和面积的放大方式不同。",
    ),
  },
  "act-exam-finding-the-perimeter-of-a-rectangle": {
    tip: t(
      "A rectangle's perimeter adds all four sides: $P = 2(\\ell + w)$. For $7$ by $4$: $P = 22$. Multiplying the sides gives the area instead, and adding just two sides counts only half of the way around. Add the length and width first, then double the sum.",
      "矩形的周长把四条边相加：$P = 2(\\ell + w)$。$7$ 乘 $4$ 时：$P = 22$。两边相乘得到的是面积，只加两条边只走了一半。先把长和宽相加，再把和加倍。",
    ),
    hardTip: t(
      "From an area and a width, divide to get the missing length, then find the perimeter. If the area is $24$ and the width is $4$, the length is $6$ and the perimeter is $20$. Giving the length as the final answer leaves the question unfinished; the area alone does not determine the perimeter.",
      "由面积和宽求周长，先做除法得到缺的长，再求周长。面积 $24$、宽 $4$ 时，长是 $6$，周长是 $20$。把长作为最终答案就没做完；只有面积并不能确定周长。",
    ),
  },
  "act-exam-finding-the-perimeter-of-a-square": {
    tip: t(
      "All four sides of a square are equal, so the perimeter is $4s$. A square of side $13$ has perimeter $52$. Squaring the side gives the area rather than the distance around, and that value appears as a distractor. Multiply by $4$, not by the side itself.",
      "正方形四条边相等，所以周长是 $4s$。边长 $13$ 的正方形，周长是 $52$。把边长平方得到的是面积，而不是绕一圈的距离，这个值常作为干扰项。要乘 $4$，而不是乘边长自身。",
    ),
    hardTip: t(
      "From an area, take the square root to get the side, then multiply by $4$. An area of $169$ means a side of $13$ and a perimeter of $52$. Dividing the area by $4$ is not the same process, and it produces a value that has no relation to the square's side.",
      "由面积求周长，先开方得边长，再乘 $4$。面积 $169$ 意味着边长 $13$，周长 $52$。用面积除以 $4$ 不是这个过程，得到的值与正方形的边长毫无关系。",
    ),
  },
  "act-exam-scaling-a-rectangular-prism-volume": {
    tip: t(
      "Volume is a product of three dimensions, so multiplying one dimension by a factor multiplies the whole volume by that same factor. A box of $2$ by $3$ by $4$ has volume $24$; tripling its height makes it $72$. Applying the factor to all three is a different question.",
      "体积是三个尺寸的乘积，所以把一个尺寸乘某个倍数，整个体积也乘这个倍数。$2$ 乘 $3$ 乘 $4$ 的盒子，体积是 $24$；把高变为三倍，体积就是 $72$。把倍数用到三个尺寸上是另一个问题。",
    ),
    hardTip: t(
      "When all three dimensions scale by $k$, the volume scales by $k^3$, because $k$ enters once per dimension. Tripling every edge of a $2$ by $3$ by $4$ box multiplies its volume by $27$, from $24$ to $648$. Using just $3$ is correct only if one dimension changes.",
      "三个尺寸都放大 $k$ 倍时，体积放大 $k^3$ 倍，因为每个尺寸都带一个 $k$。把 $2$ 乘 $3$ 乘 $4$ 的盒子每条棱都变为三倍，体积乘 $27$，从 $24$ 变成 $648$。只用 $3$ 仅在一个尺寸改变时才对。",
    ),
  },
  "act-exam-counting-packed-rectangular-units": {
    tip: t(
      "Unit cubes fill a box exactly when the count equals the box's volume, so multiply the three edge lengths. A $3$ by $5$ by $2$ box holds $30$ one-inch cubes. Adding the edges counts only one row along each direction, and counting the surface faces would miss the cubes inside.",
      "单位小方块恰好填满箱子时，数量等于箱子的体积，所以把三条棱长相乘。$3$ 乘 $5$ 乘 $2$ 的箱子能装 $30$ 个边长为 $1$ 英寸的小方块。把棱长相加只数了每个方向的一排，数表面的面又会漏掉里面的方块。",
    ),
    hardTip: t(
      "For larger blocks, divide each box edge by the matching block edge, then multiply those counts. Blocks of $2$ by $3$ by $1$ in an $8$ by $9$ by $5$ box fit $4$, $3$ and $5$ along the edges, which gives $60$. Pair the edges in the order given, and check by comparing volumes.",
      "方块较大时，用箱子的每条棱除以对应的方块棱，再把这些数量相乘。$2$ 乘 $3$ 乘 $1$ 的方块放入 $8$ 乘 $9$ 乘 $5$ 的箱子，沿三条棱分别放 $4$、$3$、$5$ 个，共 $60$ 个。按给出的顺序配对棱，再用体积比验算。",
    ),
  },
  "act-exam-evaluating-a-function-in-context": {
    tip: t(
      "The number in parentheses replaces the variable everywhere in the rule. Multiply first, then add the fixed part. For a fee given by $C(t) = 10 + 3t$: $C(5) = 10 + 15 = 25$. Here the $10$ is the starting charge and the $3$ the charge per unit, so do not combine them before multiplying.",
      "括号里的数替换规则中所有的变量。先乘，再加固定部分。费用为 $C(t) = 10 + 3t$ 时：$C(5) = 10 + 15 = 25$。这里 $10$ 是起始费用，$3$ 是每单位的费用，所以不要在相乘之前把它们合并。",
    ),
    hardTip: t(
      "To find an increase, subtract two outputs, or note that the fixed part cancels and only the rate matters: rate times change in input. With $C(t) = 10 + 3t$, moving from $5$ to $9$ raises the cost by $3(4) = 12$. Reporting the later cost alone answers a different question.",
      "求增加量时，把两个输出相减，或者注意到固定部分抵消了，只有变化率起作用：变化率乘输入的变化。对 $C(t) = 10 + 3t$，从 $5$ 变到 $9$，费用增加 $3(4) = 12$。只报告后面的费用就答了另一个问题。",
    ),
  },
  "act-exam-evaluating-a-multivariable-function": {
    tip: t(
      "The order of the inputs tells you which variable gets each number: the first goes to $x$, the second to $y$. Keep negatives in parentheses. For $f(x, y) = 3x - 2y$: $f(2, -5) = 6 + 10 = 16$. Swapping the inputs changes the value, and this mix-up is a likely wrong option.",
      "输入的顺序决定每个数给哪个变量：第一个给 $x$，第二个给 $y$。负数要加括号。对 $f(x, y) = 3x - 2y$：$f(2, -5) = 6 + 10 = 16$。交换输入会改变结果，这种混淆很可能就是错误选项。",
    ),
    hardTip: t(
      "With squares and a product, substitute with parentheses and evaluate each term by itself before combining. For $f(x, y) = x^2 + 3xy - y^2$ at $(2, -1)$: $4 - 6 - 1 = -3$. A negative input squared is positive, but the subtraction in front of the term still stands, so watch both signs.",
      "有平方和乘积时，用括号代入，每一项单独算完再合并。$f(x, y) = x^2 + 3xy - y^2$ 在 $(2, -1)$ 处：$4 - 6 - 1 = -3$。负数的平方是正数，但这一项前面的减号依然存在，所以两处符号都要留意。",
    ),
  },
  "act-exam-performing-operations-on-functions": {
    tip: t(
      "The notation $(f + g)(x)$ means $f(x) + g(x)$. Add the two rules and combine like terms: $x$ terms together and constants together. With $f(x) = 2x + 1$ and $g(x) = 5x - 4$, the sum is $7x - 3$. Carry each constant's own sign into the addition.",
      "记号 $(f + g)(x)$ 表示 $f(x) + g(x)$。把两个规则相加并合并同类项：$x$ 项合在一起，常数合在一起。$f(x) = 2x + 1$，$g(x) = 5x - 4$ 时，和为 $7x - 3$。每个常数都要带着自己的符号相加。",
    ),
    hardTip: t(
      "The notation $(fg)(a)$ means $f(a)$ times $g(a)$, so evaluate each function at the number and multiply the results. With $f(x) = 3x + 1$ and $g(x) = x + 2$: $(fg)(2) = 7(4) = 28$. This is a product, not a composition, so do not put one function inside the other.",
      "记号 $(fg)(a)$ 表示 $f(a)$ 乘 $g(a)$，所以分别求出每个函数在这个数处的值，再相乘。$f(x) = 3x + 1$，$g(x) = x + 2$ 时：$(fg)(2) = 7(4) = 28$。这是乘积，不是复合，所以不要把一个函数代入另一个。",
    ),
  },
  "act-exam-composing-functions-algebraically": {
    tip: t(
      "In $f(g(x))$, the inner rule goes in wherever $f$ has an $x$. If $f(x) = x^2$ and $g(x) = 2x + 3$, then $f(g(x)) = (2x + 3)^2$. Writing $2x^2 + 3$ is the composition in the opposite order, so check which function is on the outside.",
      "在 $f(g(x))$ 中，内层规则要放到 $f$ 中每个 $x$ 的位置上。若 $f(x) = x^2$，$g(x) = 2x + 3$，则 $f(g(x)) = (2x + 3)^2$。写成 $2x^2 + 3$ 是相反顺序的复合，所以要看清哪个函数在外层。",
    ),
    hardTip: t(
      "After substituting the inner expression, distribute and combine constants. With $f(x) = 3x + 1$ and $g(x) = x^2 + 2$: $f(g(x)) = 3(x^2 + 2) + 1 = 3x^2 + 7$. The outer multiplier applies to both terms of the inner expression; forgetting that gives a constant that is wrong.",
      "代入内层表达式后，要展开并合并常数。$f(x) = 3x + 1$，$g(x) = x^2 + 2$ 时：$f(g(x)) = 3(x^2 + 2) + 1 = 3x^2 + 7$。外层的系数要乘内层的两项；忘了这一点，常数就错了。",
    ),
  },
  "act-exam-finding-an-inverse-function": {
    tip: t(
      "The value $f^{-1}(b)$ is the input that makes $f$ output $b$. So set $f(x) = b$ and solve, without first finding the inverse's formula. For $f(x) = 3x + 2$: $3x + 2 = 14$ gives $x = 4$, so $f^{-1}(14) = 4$. Evaluating $f(14)$ goes the wrong way.",
      "$f^{-1}(b)$ 的值是使 $f$ 输出 $b$ 的输入。所以令 $f(x) = b$ 并求解，不必先求反函数的表达式。对 $f(x) = 3x + 2$：$3x + 2 = 14$ 得 $x = 4$，所以 $f^{-1}(14) = 4$。计算 $f(14)$ 就走反了方向。",
    ),
    hardTip: t(
      "To get the formula, write $y = f(x)$, solve for $x$, and then rename the variables. From $y = 3x + 2$: $x = \\frac{y - 2}{3}$, so $f^{-1}(x) = \\frac{x - 2}{3}$. Undo the operations in reverse. The reciprocal $\\frac{1}{f(x)}$ is not an inverse function, despite the notation.",
      "要求表达式，写 $y = f(x)$，解出 $x$，再交换变量名。由 $y = 3x + 2$：$x = \\frac{y - 2}{3}$，所以 $f^{-1}(x) = \\frac{x - 2}{3}$。按相反的顺序还原运算。倒数 $\\frac{1}{f(x)}$ 并不是反函数，尽管记号相似。",
    ),
  },
  "act-exam-identifying-characteristics-of-functions": {
    tip: t(
      "A function assigns exactly one output to each input. In a set of pairs, look for a repeated first coordinate with different second coordinates. The set $\\{(1, 2), (1, 5)\\}$ fails, but $\\{(1, 2), (5, 2)\\}$ is fine, since sharing an output is allowed. Only repeated inputs cause trouble.",
      "函数给每个输入指定恰好一个输出。在一组有序对中，找第一个坐标相同、第二个坐标不同的情况。集合 $\\{(1, 2), (1, 5)\\}$ 不是函数，而 $\\{(1, 2), (5, 2)\\}$ 可以，因为允许输出相同。只有重复的输入才有问题。",
    ),
    hardTip: t(
      "To compare a quadratic with a line, think about their extremes. Since $x^2 \\ge 0$, the function $2x^2 + 1$ has a least value of $1$ at $x = 0$. The line $2x + 1$ with nonzero slope keeps falling to the left, so it has no least value. Sharing a $y$-intercept does not make them behave alike.",
      "比较二次函数和直线时，要考虑它们的极值。因为 $x^2 \\ge 0$，函数 $2x^2 + 1$ 在 $x = 0$ 处有最小值 $1$。斜率不为零的直线 $2x + 1$ 向左一直下降，所以没有最小值。$y$ 轴截距相同并不代表两者行为相似。",
    ),
  },
  "act-exam-determining-function-outputs": {
    tip: t(
      "For a linear function, the value at $0$ is the intercept, and the change from $0$ to $1$ is the slope. Write the rule and substitute. If $f(0) = 3$ and $f(1) = 5$, then $f(x) = 2x + 3$ and $f(6) = 15$. Multiplying $f(1)$ by the input ignores the intercept.",
      "线性函数在 $0$ 处的值是截距，从 $0$ 到 $1$ 的变化是斜率。写出规则再代入。若 $f(0) = 3$，$f(1) = 5$，则 $f(x) = 2x + 3$，$f(6) = 15$。用 $f(1)$ 乘输入就忽略了截距。",
    ),
    hardTip: t(
      "A linear function changes by equal amounts over equal steps in the input, so you need no formula. Find the output change over the given step and repeat it. If $f(2) = 7$ and $f(5) = 16$, a step of $3$ adds $9$, so $f(8) = 25$. Doubling an output would ignore the intercept.",
      "线性函数的输入每变化相同步长，输出变化也相同，所以不需要公式。求出这段步长上输出的变化，再重复一次。若 $f(2) = 7$，$f(5) = 16$，步长 $3$ 增加 $9$，所以 $f(8) = 25$。把某个输出加倍就忽略了截距。",
    ),
  },
  "act-exam-finding-inputs-of-exponential-functions": {
    tip: t(
      "Peel off the outside in reverse: subtract the constant, divide by the coefficient, then express the result as a power of the base. For $3 \\cdot 2^x + 5 = 29$: $3 \\cdot 2^x = 24$, $2^x = 8$ and $x = 3$. Multiplying the coefficient into the base, as $6^x$, is the invalid step to avoid.",
      "由外向内逆向剥离：减去常数，除以系数，再把结果写成底数的幂。对 $3 \\cdot 2^x + 5 = 29$：$3 \\cdot 2^x = 24$，$2^x = 8$，$x = 3$。把系数乘进底数，写成 $6^x$，是必须避免的错误步骤。",
    ),
    hardTip: t(
      "When graphs meet, their values are equal. Rewrite both sides with a common base, then equate the exponents, using the power rule on any rewritten base. For $2^{4x - 2} = 4^{x + 1}$: $4^{x + 1} = 2^{2x + 2}$, so $4x - 2 = 2x + 2$ and $x = 2$. Double the whole exponent when you convert.",
      "图象相交时，函数值相等。把两边改写成相同的底数，再令指数相等，改写底数时要用幂的乘方法则。对 $2^{4x - 2} = 4^{x + 1}$：$4^{x + 1} = 2^{2x + 2}$，所以 $4x - 2 = 2x + 2$，$x = 2$。转换时要把整个指数加倍。",
    ),
  },
  "act-exam-evaluating-logarithms": {
    tip: t(
      "The logarithm $\\log_b a$ is the exponent that turns $b$ into $a$. Ask to what power the base must be raised. Since $2^3 = 8$, we have $\\log_2 8 = 3$, and $\\log_2 8 + 5 = 8$. Dividing the two numbers, or adding the argument, is not what a logarithm does.",
      "对数 $\\log_b a$ 是把 $b$ 变成 $a$ 的那个指数。要问底数需要多少次方。因为 $2^3 = 8$，所以 $\\log_2 8 = 3$，$\\log_2 8 + 5 = 8$。把两个数相除或加上真数，都不是对数的含义。",
    ),
    hardTip: t(
      "A reciprocal argument means a negative exponent, since $b^{-n} = \\frac{1}{b^n}$. So $\\log_2 \\frac{1}{8} = -3$. Evaluate each logarithm by itself using its own base, then add: $\\log_2 \\frac{1}{8} + \\log_5 25 = -3 + 2 = -1$. Different bases cannot be combined by the product rule.",
      "真数是倒数时，指数为负，因为 $b^{-n} = \\frac{1}{b^n}$。所以 $\\log_2 \\frac{1}{8} = -3$。每个对数用各自的底数单独计算，再相加：$\\log_2 \\frac{1}{8} + \\log_5 25 = -3 + 2 = -1$。底数不同时不能用乘积法则合并。",
    ),
  },
  "act-exam-applying-logarithm-properties": {
    tip: t(
      "With the same base, a difference of logarithms is the logarithm of the quotient: $\\log_b m - \\log_b n = \\log_b \\frac{m}{n}$. So $\\log_2 20 - \\log_2 5 = \\log_2 4 = 2$. Subtracting the arguments to get $\\log_2 15$ is the invalid move, since logarithms do not distribute that way.",
      "底数相同时，对数之差等于商的对数：$\\log_b m - \\log_b n = \\log_b \\frac{m}{n}$。所以 $\\log_2 20 - \\log_2 5 = \\log_2 4 = 2$。把真数相减得到 $\\log_2 15$ 是错误的，对数不能这样分配。",
    ),
    hardTip: t(
      "A product inside splits into a sum, and an exponent comes down as a multiplier: $\\log_b(x^2 y) = 2\\log_b x + \\log_b y$. If $\\log_b x = 2$ and $\\log_b y = 5$, the value is $4 + 5 = 9$. The exponent belongs only to its own factor, so do not multiply the second logarithm too.",
      "真数中的乘积可以拆成和，指数可以提到前面作为系数：$\\log_b(x^2 y) = 2\\log_b x + \\log_b y$。若 $\\log_b x = 2$，$\\log_b y = 5$，结果是 $4 + 5 = 9$。指数只属于自己的因式，所以不要把第二个对数也乘上。",
    ),
  },
  "act-exam-relating-exponential-and-logarithmic-forms": {
    tip: t(
      "An exponential statement converts to a logarithm through $b^x = a \\iff x = \\log_b a$. The base stays the base, and the exponent stands alone. So $2^x = 11$ becomes $x = \\log_2 11$. Writing $\\log_{11} 2$ swaps the base and the argument, the classic wrong choice.",
      "指数式可以通过 $b^x = a \\iff x = \\log_b a$ 化成对数式。底数仍是底数，指数单独放在一边。所以 $2^x = 11$ 变成 $x = \\log_2 11$。写成 $\\log_{11} 2$ 是把底数和真数对调了，这是典型的错误选项。",
    ),
    hardTip: t(
      "Going the other way, the value of a logarithm becomes the exponent on the base. So $\\log_4 x = 3$ means $x = 4^3$. The base stays at the bottom of the power. Multiplying as $x = 4 \\cdot 3$, or writing $3^4$, misreads what the logarithm states.",
      "反过来，对数的值就成为底数上的指数。所以 $\\log_4 x = 3$ 表示 $x = 4^3$。底数仍在幂的下方。写成相乘的 $x = 4 \\cdot 3$，或者写成 $3^4$，都误解了这个对数的含义。",
    ),
  },
  "act-exam-solving-logarithmic-equations": {
    tip: t(
      "Convert the logarithm to exponential form, which removes it. Then solve the linear equation inside. For $\\log_2(x + 1) = 3$: $x + 1 = 2^3 = 8$, so $x = 7$. Make sure to raise the base to the given value; multiplying them instead gives a different and wrong number.",
      "把对数化成指数形式，就去掉了对数。再解里面的线性方程。对 $\\log_2(x + 1) = 3$：$x + 1 = 2^3 = 8$，所以 $x = 7$。一定要把底数升到给定的次方；改成相乘会得到另一个错误的数。",
    ),
    hardTip: t(
      "Two logarithms with the same base must first merge into one, because a sum becomes the logarithm of a product. For $\\log_2 x + \\log_2 5 = 4$: $\\log_2 (5x) = 4$, so $5x = 16$ and $x = \\frac{16}{5}$. Treating $\\log_2 5$ as just the number $5$ is the mistake to avoid.",
      "两个同底的对数必须先合并成一个，因为和等于乘积的对数。对 $\\log_2 x + \\log_2 5 = 4$：$\\log_2 (5x) = 4$，所以 $5x = 16$，$x = \\frac{16}{5}$。把 $\\log_2 5$ 当作数字 $5$ 是要避免的错误。",
    ),
  },
  "act-exam-identifying-features-of-logarithmic-functions": {
    tip: t(
      "A logarithm accepts only positive inputs, so set the expression inside greater than $0$ and solve. For $\\log_2(x + 5)$: $x + 5 > 0$ gives $x > -5$. Using $\\ge$ wrongly includes the endpoint, since the logarithm of $0$ is undefined. The base has no effect on this domain.",
      "对数只接受正的输入，所以令里面的表达式大于 $0$ 并求解。对 $\\log_2(x + 5)$：$x + 5 > 0$ 得 $x > -5$。用 $\\ge$ 就错误地包含了端点，因为 $0$ 的对数无定义。底数不影响这个定义域。",
    ),
    hardTip: t(
      "The vertical asymptote of a logarithm is where its input equals $0$. Solve that equation and ignore constants outside the logarithm, which only shift the graph up or down. For $y = \\log_3(x - 2) + 4$, the asymptote is $x = 2$. A value such as $y = 4$ is a horizontal line, not an asymptote here.",
      "对数的竖直渐近线在输入等于 $0$ 的地方。解这个方程，并忽略对数外的常数，它只让图象上下移动。对 $y = \\log_3(x - 2) + 4$，渐近线是 $x = 2$。像 $y = 4$ 这样的是水平线，在这里不是渐近线。",
    ),
  },
  "act-exam-determining-domain-from-an-equation": {
    tip: t(
      "The domain of a fraction excludes any input that makes the denominator zero. Set the denominator to zero, solve, and exclude that value. For $f(x) = \\frac{3}{x + 5}$, the domain is $x \\ne -5$. The numerator's value never matters, even if it happens to be large.",
      "分式的定义域要排除使分母为零的输入。令分母为零，求解，再排除这个值。对 $f(x) = \\frac{3}{x + 5}$，定义域是 $x \\ne -5$。分子的值从不起作用，哪怕它很大。",
    ),
    hardTip: t(
      "A square root requires what is under it to be at least $0$. Solve the inequality by adding, then dividing. For $f(x) = \\sqrt{2x - 8}$: $2x \\ge 8$, so $x \\ge 4$. Unlike a denominator, the boundary value is allowed here, because the root of $0$ exists.",
      "平方根要求根号下的量至少为 $0$。先加后除解这个不等式。对 $f(x) = \\sqrt{2x - 8}$：$2x \\ge 8$，所以 $x \\ge 4$。与分母不同，这里边界值是允许的，因为 $0$ 的平方根存在。",
    ),
  },
  "act-exam-reading-domain-from-a-graph": {
    tip: t(
      "The domain is what the graph covers horizontally. Look down to the $x$-axis from the leftmost and rightmost points of the segment. A segment from $(1, -2)$ to $(5, 3)$ has domain $1 \\le x \\le 5$. Solid endpoints use $\\le$, and reading the $y$-values gives the range, which is the wrong set.",
      "定义域是图象在水平方向覆盖的范围。从线段最左和最右的点向 $x$ 轴看。从 $(1, -2)$ 到 $(5, 3)$ 的线段，定义域是 $1 \\le x \\le 5$。包含端点时用 $\\le$；读 $y$ 值得到的是值域，是错误的集合。",
    ),
    hardTip: t(
      "The range is what the graph covers vertically, so read the lowest and highest points on the $y$-axis. A segment from $(1, -2)$ to $(5, 3)$ has range $-2 \\le y \\le 3$. Use the $y$-coordinates of the endpoints, not their $x$-coordinates, and write the smaller number first.",
      "值域是图象在竖直方向覆盖的范围，所以要在 $y$ 轴上读最低点和最高点。从 $(1, -2)$ 到 $(5, 3)$ 的线段，值域是 $-2 \\le y \\le 3$。要用端点的 $y$ 坐标，不是 $x$ 坐标，并把较小的数写在前面。",
    ),
  },
  "act-exam-finding-asymptotes-of-a-rational-function": {
    tip: t(
      "A vertical asymptote occurs where the denominator is zero and the numerator is not. Solve for the input and write the answer as a vertical line. For $y = \\frac{3}{x + 2}$, the asymptote is $x = -2$. Watch the sign, and do not answer with an equation for $y$.",
      "竖直渐近线出现在分母为零而分子不为零的地方。求出这个输入，答案写成一条竖直线。对 $y = \\frac{3}{x + 2}$，渐近线是 $x = -2$。注意符号，也不要写成 $y$ 的方程。",
    ),
    hardTip: t(
      "A horizontal asymptote shows the value for very large $x$. With equal degrees on top and bottom, the fraction approaches the ratio of leading coefficients; a constant outside then shifts this. For $y = \\frac{2x}{x + 3} - 1$, the fraction approaches $2$, so the line is $y = 1$. Do not forget the shift.",
      "水平渐近线表示 $x$ 很大时的值。分子分母次数相同时，分数趋向于首项系数之比；外面的常数再把它平移。对 $y = \\frac{2x}{x + 3} - 1$，分数趋向于 $2$，所以这条线是 $y = 1$。不要忘了平移。",
    ),
  },
  "act-exam-describing-behavior-of-a-function-graph": {
    tip: t(
      "For large $x$, the highest power dominates. A positive input to any power stays positive, so the coefficient's sign decides the direction. For $f(x) = -3x^5$, the values fall without bound as $x$ grows. Thinking only about the odd power, without the coefficient, leads to the opposite answer.",
      "$x$ 很大时，最高次项起决定作用。正的输入的任何次方仍是正数，所以方向由系数的符号决定。对 $f(x) = -3x^5$，随着 $x$ 增大，值无限下降。只考虑奇次幂而不看系数，就会得出相反的答案。",
    ),
    hardTip: t(
      "End behavior comes from the leading term alone. With even degree, both ends go the same way: up for a positive coefficient, down for a negative one. So $2x^4 + 5x$ rises on both sides. With odd degree, the ends go opposite ways. Lower terms, like the $5x$, do not matter at the extremes.",
      "端点行为只由首项决定。次数为偶数时，两端方向相同：系数为正都向上，系数为负都向下。所以 $2x^4 + 5x$ 两端都上升。次数为奇数时，两端方向相反。低次项，如这里的 $5x$，在极端处不起作用。",
    ),
  },
  "act-exam-determining-the-range-of-a-function": {
    tip: t(
      "A square is never negative, so a quadratic like $a x^2 + c$ with positive $a$ is smallest at $x = 0$. There the value is $c$, and the range is everything at or above it. For $f(x) = 3x^2 + 5$, the range is $y \\ge 5$. Stating a domain restriction on $x$ answers the wrong question.",
      "平方绝不为负，所以 $a$ 为正的二次函数 $a x^2 + c$ 在 $x = 0$ 处最小。此时的值是 $c$，值域是所有不小于它的数。对 $f(x) = 3x^2 + 5$，值域是 $y \\ge 5$。写出 $x$ 的定义域限制就答错了问题。",
    ),
    hardTip: t(
      "A negated absolute value is at most $0$, so it caps the function. The outside constant then gives the maximum, and the range lies at or below it. For $f(x) = -|x - 2| + 6$, the range is $y \\le 6$. The minus sign flips the direction, and the number inside the bars has no effect.",
      "取负的绝对值至多为 $0$，所以它给函数设了上限。外面的常数就是最大值，值域在它以下（含它本身）。对 $f(x) = -|x - 2| + 6$，值域是 $y \\le 6$。负号翻转了方向，绝对值里的数不起作用。",
    ),
  },
  "act-exam-translating-function-graphs-vertically": {
    tip: t(
      "Shifting up by $k$ adds $k$ to the output, so add it to the whole right side, then combine with any constant there. For $y = 2x + 1$ shifted up $5$: $y = 2x + 6$. The slope stays the same. Adding to the $x$ inside instead would be a horizontal move.",
      "向上平移 $k$ 就是给输出加 $k$，所以加到整个右边，再与那里的常数合并。$y = 2x + 1$ 向上移 $5$：$y = 2x + 6$。斜率不变。如果加到里面的 $x$ 上，就成了水平移动。",
    ),
    hardTip: t(
      "After shifting down, subtract from the output, then find the intercepts by setting $y = 0$ and solving. For $y = (x - 3)^2$ moved down $9$: $(x - 3)^2 = 9$, so $x - 3 = \\pm 3$, giving $0$ and $6$. Take both roots, and add the $3$ back to each.",
      "向下平移后，从输出减去，再令 $y = 0$ 求截距。$y = (x - 3)^2$ 向下移 $9$：$(x - 3)^2 = 9$，所以 $x - 3 = \\pm 3$，得 $0$ 和 $6$。两个根都要取，并给每个根加回 $3$。",
    ),
  },
  "act-exam-translating-horizontally-and-reflecting-graphs": {
    tip: t(
      "A horizontal shift changes the input, against what your intuition may say: moving right by $h$ replaces $x$ with $x - h$. So $y = 2x^2$ moved right $3$ is $y = 2(x - 3)^2$. Writing $x + 3$ moves it left, and placing the $3$ outside the square moves it vertically.",
      "水平平移改变的是输入，这与直觉相反：向右移 $h$ 是把 $x$ 换成 $x - h$。所以 $y = 2x^2$ 向右移 $3$ 是 $y = 2(x - 3)^2$。写成 $x + 3$ 是向左移，把 $3$ 放在平方外面则是竖直移动。",
    ),
    hardTip: t(
      "First read the vertex from the form $y = (x - h)^2 + k$, which is $(h, k)$. A reflection across the $x$-axis negates only the $y$-coordinate. So $y = (x - 2)^2 - 5$ has vertex $(2, -5)$, which moves to $(2, 5)$. Negating both coordinates is a reflection through the origin instead.",
      "先从 $y = (x - h)^2 + k$ 读出顶点 $(h, k)$。关于 $x$ 轴的翻折只把 $y$ 坐标变号。所以 $y = (x - 2)^2 - 5$ 的顶点 $(2, -5)$ 变为 $(2, 5)$。两个坐标都变号，是关于原点的对称。",
    ),
  },
  "act-exam-matching-a-graph-to-an-equation": {
    tip: t(
      "Use the graph's $x$-intercepts to write the factors: each crossing at $r$ gives a factor $(x - r)$, with the sign reversed. A parabola opening up that crosses at $3$ and $-1$ fits $y = (x - 3)(x + 1)$. A positive leading coefficient confirms the upward shape. Same-sign factors are the common error.",
      "用图象的 $x$ 轴截距写因式：在 $r$ 处穿过，对应因式 $(x - r)$，符号相反。开口向上、在 $3$ 和 $-1$ 处穿过的抛物线符合 $y = (x - 3)(x + 1)$。首项系数为正，证实了开口向上。因式符号写错是常见错误。",
    ),
    hardTip: t(
      "Read the vertex and the direction, and then use vertex form $y = a(x - h)^2 + k$. A parabola opening down with vertex $(2, 5)$ fits $y = -(x - 2)^2 + 5$. Check two things: the negative sign in front, for the direction, and the sign of $h$, which is opposite inside the parentheses.",
      "读出顶点和开口方向，再用顶点式 $y = a(x - h)^2 + k$。开口向下、顶点为 $(2, 5)$ 的抛物线符合 $y = -(x - 2)^2 + 5$。检查两点：前面的负号决定方向，括号内 $h$ 的符号相反。",
    ),
  },
  "act-exam-interpreting-piecewise-graphs": {
    tip: t(
      "To read a value from a graph, find the input on the $x$-axis, move vertically until you hit the piece covering that input, then read the height. A piecewise graph may have several parts, so select the part above that input. Reporting the input itself or a nearby endpoint's height is the common slip.",
      "要从图象读值，在 $x$ 轴上找到输入，竖直移动到覆盖这个输入的那一段，再读高度。分段图象可能有几个部分，所以要选这个输入上方的那部分。报告输入本身或相邻端点的高度是常见的疏漏。",
    ),
    hardTip: t(
      "A function is constant where its graph is horizontal. Locate the flat piece and state the $x$-interval it spans, using the point where it begins or ends. Note that the answer is a set of $x$-values, not the constant height. A slanted piece that has a gentle slope is not constant.",
      "函数在图象水平的地方是常数。找到平的那一段，用它开始或结束的点写出它覆盖的 $x$ 区间。注意答案是一组 $x$ 值，而不是那个常数高度。坡度平缓的斜线段也不是常数。",
    ),
  },
  "act-exam-working-with-arithmetic-sequences": {
    tip: t(
      "An arithmetic sequence adds the same difference each step. Subtract neighbouring terms to find it, then add it to the last term shown. In $3, 7, 11, \\ldots$ the difference is $4$, so the next term is $15$. Check at least two gaps, because a sequence that multiplies has unequal gaps.",
      "等差数列每一步加相同的公差。用相邻两项相减求公差，再加到最后一项上。在 $3, 7, 11, \\ldots$ 中公差是 $4$，所以下一项是 $15$。至少检查两个间隔，因为按倍数增长的数列间隔不相等。",
    ),
    hardTip: t(
      "For terms that are not neighbours, the common difference is the change in value over the number of steps between them. If the $4$th term is $10$ and the $9$th is $25$: the change is $15$ over $5$ steps, so the difference is $3$. Dividing by the term number itself is the trap.",
      "两项不相邻时，公差等于值的变化除以它们之间的步数。若第 $4$ 项是 $10$，第 $9$ 项是 $25$：变化 $15$，共 $5$ 步，公差是 $3$。除以项的序号本身就是陷阱。",
    ),
  },
  "act-exam-finding-a-term-of-a-geometric-sequence": {
    tip: t(
      "A geometric sequence multiplies by the same ratio each step. Divide a term by the previous one to get the ratio, then multiply the last term shown. In $2, 6, 18, \\ldots$ the ratio is $3$, so the next term is $54$. Adding the gap treats it as arithmetic, which is the wrong pattern.",
      "等比数列每一步乘相同的公比。用一项除以前一项得公比，再乘最后一项。在 $2, 6, 18, \\ldots$ 中公比是 $3$，所以下一项是 $54$。加上差值是把它当作等差数列，模式错了。",
    ),
    hardTip: t(
      "The $n$th term of a geometric sequence is $a_n = a_1 r^{n - 1}$. The first term has no factor of $r$, so the exponent is one less than the term number. With first term $2$ and ratio $3$, the $5$th term is $2(3)^4 = 162$. Multiplying first and then raising to a power is the order error.",
      "等比数列的第 $n$ 项是 $a_n = a_1 r^{n - 1}$。第一项没有 $r$ 因子，所以指数比项数小 $1$。首项 $2$、公比 $3$ 时，第 $5$ 项是 $2(3)^4 = 162$。先相乘再乘方就是顺序错误。",
    ),
  },
  "act-exam-writing-an-explicit-formula-for-a-sequence": {
    tip: t(
      "An arithmetic formula takes the first term and adds the difference $n - 1$ times: $a_n = a_1 + d(n - 1)$. For $4, 7, 10, \\ldots$: $a_n = 4 + 3(n - 1)$. Test the formula with $n = 1$; it must return the first term. Using $dn$ alone would make it overshoot by one step.",
      "等差数列的公式取首项，再加 $n - 1$ 次公差：$a_n = a_1 + d(n - 1)$。对 $4, 7, 10, \\ldots$：$a_n = 4 + 3(n - 1)$。用 $n = 1$ 检验公式，必须得到首项。只用 $dn$ 就会多走一步。",
    ),
    hardTip: t(
      "If the terms multiply by a fixed ratio, the formula uses a power: $a_n = a_1 r^{n - 1}$. For $2, 6, 18, \\ldots$: $a_n = 2(3)^{n - 1}$. Check $n = 2$, which should give $6$. A formula with the difference added would fit only the first two terms, and it would fail at the third.",
      "各项按固定公比相乘时，公式要用幂：$a_n = a_1 r^{n - 1}$。对 $2, 6, 18, \\ldots$：$a_n = 2(3)^{n - 1}$。用 $n = 2$ 检验，应得 $6$。加公差的公式只符合前两项，到第三项就不成立了。",
    ),
  },
  "act-exam-computing-terms-of-a-recursive-sequence": {
    tip: t(
      "A recursive rule builds each term from the one before, so work one step at a time. With $a_1 = 2$ and $a_{n+1} = 3a_n - 1$: $a_2 = 5$ and $a_3 = 14$. You cannot jump straight to a later term. Stopping one step short gives a wrong option.",
      "递推规则由前一项得到后一项，所以要一步一步来。$a_1 = 2$，$a_{n+1} = 3a_n - 1$ 时：$a_2 = 5$，$a_3 = 14$。不能直接跳到后面的项。少算一步就得到错误选项。",
    ),
    hardTip: t(
      "When a rule uses two previous terms, both starting values are given, and each new term adds the latest two. From $a_1 = 1$ and $a_2 = 4$: the next terms are $5$, $9$ and $14$. Keep a running list, since mistakes arise from adding a term to itself or skipping an index.",
      "规则用到前两项时，两个初始值都已给出，每个新项都是最近两项之和。由 $a_1 = 1$，$a_2 = 4$：接下来是 $5$、$9$、$14$。要边算边列出来，因为错误常来自把一项加到自身或跳过了下标。",
    ),
  },
  "act-exam-summing-an-arithmetic-series": {
    tip: t(
      "The sum of an arithmetic series is the number of terms times the average of the first and last: $S_n = \\frac{n(a_1 + a_n)}{2}$. For $10$ terms from $3$ to $21$: $S = \\frac{10(24)}{2} = 120$. Forgetting to divide by $2$ doubles the result.",
      "等差数列的和等于项数乘首末项的平均数：$S_n = \\frac{n(a_1 + a_n)}{2}$。从 $3$ 到 $21$ 共 $10$ 项：$S = \\frac{10(24)}{2} = 120$。忘了除以 $2$，结果就翻倍了。",
    ),
    hardTip: t(
      "When the last term is missing, get it first with $a_n = a_1 + (n - 1)d$, then use the sum formula. For $2, 5, 8, \\ldots$ over $10$ terms: the last is $2 + 9(3) = 29$, so the sum is $\\frac{10(31)}{2} = 155$. Multiplying by $n$ rather than $n - 1$ overshoots the last term.",
      "缺少末项时，先用 $a_n = a_1 + (n - 1)d$ 求出，再用求和公式。$2, 5, 8, \\ldots$ 共 $10$ 项：末项是 $2 + 9(3) = 29$，和是 $\\frac{10(31)}{2} = 155$。乘 $n$ 而不是 $n - 1$，末项就算多了。",
    ),
  },
  "act-exam-summing-geometric-and-other-series": {
    tip: t(
      "A short geometric sum may be added by hand, or use $S_n = \\frac{a_1(r^n - 1)}{r - 1}$. With first term $2$, ratio $3$ and $4$ terms: $2 + 6 + 18 + 54 = 80$, and the formula agrees. The exponent is $n$ here, not $n - 1$ as in the term formula, which is the trap.",
      "项数不多的等比数列可以手工相加，也可以用 $S_n = \\frac{a_1(r^n - 1)}{r - 1}$。首项 $2$、公比 $3$、$4$ 项：$2 + 6 + 18 + 54 = 80$，公式结果一致。这里指数是 $n$，不是通项公式中的 $n - 1$，这就是陷阱。",
    ),
    hardTip: t(
      "Sigma notation means substitute each index value and add. Either list the terms, or split it: $\\sum k$ gives the triangular number $\\frac{n(n + 1)}{2}$, and a constant is added $n$ times. For $\\sum_{k=1}^{4} (3k + 1)$: $3(10) + 4 = 34$. Adding the constant only once is the usual mistake.",
      "求和符号表示代入每个下标值再相加。可以列出各项，也可以拆开：$\\sum k$ 是三角形数 $\\frac{n(n + 1)}{2}$，常数要加 $n$ 次。对 $\\sum_{k=1}^{4} (3k + 1)$：$3(10) + 4 = 34$。常数只加一次是常见错误。",
    ),
  },
  "act-exam-converting-angle-measures": {
    tip: t(
      "To convert degrees to radians, multiply by $\\frac{\\pi}{180}$ and simplify. If the angle exceeds $360^\\circ$, subtract full turns first to get an equivalent angle. For $150^\\circ$: $\\frac{5\\pi}{6}$. For $400^\\circ$: use $40^\\circ$, which is $\\frac{2\\pi}{9}$. Multiplying by $\\frac{180}{\\pi}$ is the opposite conversion.",
      "度化弧度，乘 $\\frac{\\pi}{180}$ 并约分。如果角超过 $360^\\circ$，先减去整圈得到等价角。$150^\\circ$ 是 $\\frac{5\\pi}{6}$。$400^\\circ$ 要用 $40^\\circ$，即 $\\frac{2\\pi}{9}$。乘 $\\frac{180}{\\pi}$ 是相反的换算。",
    ),
    hardTip: t(
      "To mix units, put everything in degrees before adding: replace $\\pi$ with $180^\\circ$. So $\\frac{3\\pi}{4}$ radians is $135^\\circ$, and adding one full turn gives $495^\\circ$. Adding $360$ to a radian number directly mixes two units, and this is the error that the options expose.",
      "单位混用时，相加之前要全部化成度：把 $\\pi$ 换成 $180^\\circ$。所以 $\\frac{3\\pi}{4}$ 弧度是 $135^\\circ$，加上一整圈得 $495^\\circ$。把 $360$ 直接加到弧度数上是混用单位，选项正是在考这个错误。",
    ),
  },
  "act-exam-finding-points-in-standard-position": {
    tip: t(
      "For a point on the terminal side, find its distance from the origin, $r = \\sqrt{x^2 + y^2}$, which is always positive. Then $\\cos\\theta = \\frac{x}{r}$ and keeps the sign of $x$. For $(-3, 4)$: $r = 5$, so $\\cos\\theta = -\\frac{3}{5}$. Dropping the sign, or using $y$ instead, is the trap.",
      "对于终边上的点，求它到原点的距离 $r = \\sqrt{x^2 + y^2}$，它总是正数。则 $\\cos\\theta = \\frac{x}{r}$，保留 $x$ 的符号。对 $(-3, 4)$：$r = 5$，所以 $\\cos\\theta = -\\frac{3}{5}$。丢掉符号，或者用了 $y$，都是陷阱。",
    ),
    hardTip: t(
      "Tangent needs only the coordinates, with no use of $r$: $\\tan\\theta = \\frac{y}{x}$. For $(-3, 4)$: $\\tan\\theta = -\\frac{4}{3}$. The signs come from the coordinates, so in the second quadrant the ratio is negative. Inverting the ratio to $\\frac{x}{y}$ is the likely wrong option.",
      "正切只需要坐标，不用 $r$：$\\tan\\theta = \\frac{y}{x}$。对 $(-3, 4)$：$\\tan\\theta = -\\frac{4}{3}$。符号来自坐标，所以在第二象限这个比值为负。把比值颠倒成 $\\frac{x}{y}$ 很可能是错误选项。",
    ),
  },
  "act-exam-using-the-pythagorean-identity": {
    tip: t(
      "The identity $\\sin^2\\theta + \\cos^2\\theta = 1$ holds for every angle. When both squares have the same coefficient, factor it out so the identity applies. So $3\\sin^2\\theta + 3\\cos^2\\theta - 1 = 3(1) - 1 = 2$. No specific angle is needed. Counting the two squares as $2$ is a mistake.",
      "恒等式 $\\sin^2\\theta + \\cos^2\\theta = 1$ 对每个角都成立。两个平方项系数相同时，把系数提出来就能用这个恒等式。所以 $3\\sin^2\\theta + 3\\cos^2\\theta - 1 = 3(1) - 1 = 2$。不需要知道具体的角。把两个平方算作 $2$ 是错的。",
    ),
    hardTip: t(
      "Given one square, subtract it from $1$ to get the other, then apply any multiplier. If $\\sin^2\\theta = \\frac{9}{25}$ and $x = 3\\cos^2\\theta$: $\\cos^2\\theta = \\frac{16}{25}$, so $x = \\frac{48}{25}$. Do not take a root here, because the expression uses the square itself.",
      "已知一个平方时，用 $1$ 减去它得到另一个，再乘上系数。若 $\\sin^2\\theta = \\frac{9}{25}$，$x = 3\\cos^2\\theta$：$\\cos^2\\theta = \\frac{16}{25}$，所以 $x = \\frac{48}{25}$。这里不要开方，因为表达式用的就是平方本身。",
    ),
  },
  "act-exam-finding-cosine-from-sine": {
    tip: t(
      "Draw a right triangle from the given ratio: sine is opposite over hypotenuse. Find the missing leg, and take adjacent over hypotenuse. If $\\sin\\theta = \\frac{3}{5}$ with a first-quadrant angle, the sides are $3$, $4$ and $5$, so $\\cos\\theta = \\frac{4}{5}$. Inverting the sine gives a value above $1$, which a cosine can't have.",
      "由给定的比画一个直角三角形：正弦是对边比斜边。求出缺的直角边，再取邻边比斜边。若 $\\sin\\theta = \\frac{3}{5}$，角在第一象限，三边为 $3$、$4$、$5$，所以 $\\cos\\theta = \\frac{4}{5}$。把正弦颠倒得到的值大于 $1$，余弦不可能取到。",
    ),
    hardTip: t(
      "The triangle gives only the size, and the quadrant gives the sign. Between $\\frac{\\pi}{2}$ and $\\pi$ cosine is negative, because $x$ is negative there, while sine stays positive. So $\\sin\\theta = \\frac{3}{5}$ in this interval gives $\\cos\\theta = -\\frac{4}{5}$. Ignoring the stated interval leaves the sign wrong.",
      "三角形只给出大小，象限决定符号。在 $\\frac{\\pi}{2}$ 到 $\\pi$ 之间余弦为负，因为那里 $x$ 是负的，而正弦仍为正。所以在这个区间内 $\\sin\\theta = \\frac{3}{5}$ 时，$\\cos\\theta = -\\frac{4}{5}$。忽略给定的区间，符号就错了。",
    ),
  },
  "act-exam-applying-quotient-and-angle-identities": {
    tip: t(
      "Tangent is the quotient of sine over cosine: $\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$. When both have the same denominator, it cancels. With $\\sin\\theta = \\frac{3}{5}$ and $\\cos\\theta = \\frac{4}{5}$: $\\tan\\theta = \\frac{3}{4}$. Then apply any constant factor. Inverting the quotient gives the cotangent, not the tangent.",
      "正切是正弦与余弦的商：$\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$。两者分母相同时可以约去。$\\sin\\theta = \\frac{3}{5}$，$\\cos\\theta = \\frac{4}{5}$ 时：$\\tan\\theta = \\frac{3}{4}$。再乘上给定的常数。把商颠倒得到的是余切，不是正切。",
    ),
    hardTip: t(
      "The double-angle identity is $\\sin(2\\theta) = 2\\sin\\theta\\cos\\theta$. Multiply the two given values, then double. With $\\sin\\theta = \\frac{3}{5}$ and $\\cos\\theta = \\frac{4}{5}$: $\\frac{24}{25}$. Doubling the sine alone is wrong, since $\\sin(2\\theta)$ is not $2\\sin\\theta$, as it could otherwise exceed $1$.",
      "二倍角公式是 $\\sin(2\\theta) = 2\\sin\\theta\\cos\\theta$。把两个已知值相乘，再加倍。$\\sin\\theta = \\frac{3}{5}$，$\\cos\\theta = \\frac{4}{5}$ 时：$\\frac{24}{25}$。只把正弦加倍是错的，$\\sin(2\\theta)$ 并不等于 $2\\sin\\theta$，否则值可能超过 $1$。",
    ),
  },
  "act-exam-identifying-equivalent-trig-representations": {
    tip: t(
      "Complementary angles add to $90^\\circ$, and the sine of one equals the cosine of the other. So $\\sin 20^\\circ = \\cos 70^\\circ$. Subtract the given angle from $90^\\circ$ and switch the function. Using $180^\\circ$ gives the supplement, for which the sine keeps its value, but the cofunction rule does not hold.",
      "互余的角和为 $90^\\circ$，一个角的正弦等于另一个角的余弦。所以 $\\sin 20^\\circ = \\cos 70^\\circ$。用 $90^\\circ$ 减去给定的角，再换函数。用 $180^\\circ$ 得到的是补角，对补角而言正弦不变，但余函数规则不成立。",
    ),
    hardTip: t(
      "Sine and cosine repeat every full turn, so adding $360^\\circ$ changes nothing: $\\cos(40^\\circ + 360^\\circ) = \\cos 40^\\circ$. Remove any whole multiples of $360^\\circ$ to simplify. Switching to sine, or changing the sign, would need a different angle. The cofunction rule does not apply when you only add turns.",
      "正弦和余弦每转一整圈就重复，所以加 $360^\\circ$ 不改变结果：$\\cos(40^\\circ + 360^\\circ) = \\cos 40^\\circ$。去掉 $360^\\circ$ 的整数倍就能化简。换成正弦或改变符号，都需要不同的角。只加整圈时，余函数规则不适用。",
    ),
  },
  "act-exam-finding-amplitude-period-and-range": {
    tip: t(
      "In $y = A\\sin(Bx) + D$, the period depends only on $B$: it equals $\\frac{2\\pi}{B}$. For $y = 3\\sin(4x) - 1$, the period is $\\frac{\\pi}{2}$. The coefficient in front sets the height, and the constant shifts the graph, so neither belongs in this calculation. Using $\\frac{2\\pi}{A}$ is the trap.",
      "在 $y = A\\sin(Bx) + D$ 中，周期只取决于 $B$：等于 $\\frac{2\\pi}{B}$。对 $y = 3\\sin(4x) - 1$，周期是 $\\frac{\\pi}{2}$。前面的系数决定高度，常数使图象平移，两者都不参与这个计算。用 $\\frac{2\\pi}{A}$ 就是陷阱。",
    ),
    hardTip: t(
      "The range is centred at $D$ and reaches the amplitude above and below, so it runs from $D - |A|$ to $D + |A|$. For $y = 5\\cos(3x) + 2$: $-3 \\le y \\le 7$. The coefficient on $x$ has no influence here, since it squeezes the graph only sideways.",
      "值域以 $D$ 为中心，上下各延伸一个振幅，所以从 $D - |A|$ 到 $D + |A|$。对 $y = 5\\cos(3x) + 2$：$-3 \\le y \\le 7$。$x$ 的系数在这里不起作用，因为它只让图象在水平方向压缩。",
    ),
  },
  "act-exam-matching-and-transforming-trig-graphs": {
    tip: t(
      "The amplitude is half the vertical distance from a trough to a peak, equal to the distance from the centre line to a peak. A graph peaking at $1$ with troughs at $-5$ has amplitude $3$. The full height of $6$ is the tempting wrong value, and so is the peak's height itself.",
      "振幅是波谷到波峰竖直距离的一半，也等于中线到波峰的距离。波峰为 $1$、波谷为 $-5$ 的图象，振幅是 $3$。整个高度 $6$ 是诱人的错误值，波峰本身的高度也是。",
    ),
    hardTip: t(
      "Read three things to build $y = A\\sin(Bx) + D$: the centre line gives $D$, the distance to a peak gives $A$, and the number of full cycles in $2\\pi$ gives $B$. A centre of $1$, peaks at $4$ and two cycles in $2\\pi$ give $y = 3\\sin(2x) + 1$. Do not use the period as $B$.",
      "要写出 $y = A\\sin(Bx) + D$，读三样东西：中线给出 $D$，到波峰的距离给出 $A$，$2\\pi$ 内的完整周期数给出 $B$。中线为 $1$、波峰为 $4$、$2\\pi$ 内两个周期，得 $y = 3\\sin(2x) + 1$。不要把周期当作 $B$。",
    ),
  },
  "act-exam-finding-triangle-area-using-sine": {
    tip: t(
      "With two sides and the angle between them, the area is $\\frac{1}{2}ab\\sin C$. The angle must be the included one. For sides $10$ and $6$ with a $30^\\circ$ angle between them: $\\frac{1}{2}(10)(6)\\left(\\frac{1}{2}\\right) = 15$. Omitting the sine treats the triangle as if it were right-angled.",
      "已知两边及其夹角时，面积是 $\\frac{1}{2}ab\\sin C$。这个角必须是夹角。边 $10$ 和 $6$、夹角 $30^\\circ$：$\\frac{1}{2}(10)(6)\\left(\\frac{1}{2}\\right) = 15$。漏掉正弦就相当于把三角形当成了直角三角形。",
    ),
    hardTip: t(
      "When only the sine's value is given, no angle is needed: insert the value directly into $\\frac{1}{2}ab\\sin C$ and reduce the fraction. For sides $10$ and $6$ with sine $\\frac{3}{5}$: $\\frac{1}{2}(60)\\left(\\frac{3}{5}\\right) = 18$. Using the value as an angle measure, or dropping the half, gives wrong options.",
      "只给出正弦值时，不需要角度：把这个值直接代入 $\\frac{1}{2}ab\\sin C$ 并约分。边 $10$ 和 $6$、正弦为 $\\frac{3}{5}$：$\\frac{1}{2}(60)\\left(\\frac{3}{5}\\right) = 18$。把这个值当作角度，或漏掉一半，都是错误选项。",
    ),
  },
  "act-exam-using-the-law-of-sines": {
    tip: t(
      "The law of sines pairs each side with its opposite angle: $\\frac{a}{\\sin A} = \\frac{c}{\\sin C}$. Solve for the unknown by multiplying: $c = \\frac{a\\sin C}{\\sin A}$. With $a = 8$, $A = 40^\\circ$ and $C = 75^\\circ$: $\\frac{8\\sin 75^\\circ}{\\sin 40^\\circ}$. Swapping the sines is the wrong expression to avoid.",
      "正弦定理把每条边与它的对角配对：$\\frac{a}{\\sin A} = \\frac{c}{\\sin C}$。乘过去解出未知量：$c = \\frac{a\\sin C}{\\sin A}$。$a = 8$，$A = 40^\\circ$，$C = 75^\\circ$ 时：$\\frac{8\\sin 75^\\circ}{\\sin 40^\\circ}$。把两个正弦对调就是要避开的错误表达式。",
    ),
    hardTip: t(
      "When sine values are given as fractions, use $b = a \\cdot \\frac{\\sin B}{\\sin A}$. Dividing the fractions cancels a shared denominator. With $\\sin A = \\frac{1}{4}$, $\\sin B = \\frac{3}{8}$ and $a = 12$: the ratio is $\\frac{3}{2}$, so $b = 18$. The side opposite the larger sine must be longer, which is a good check.",
      "正弦值以分数给出时，用 $b = a \\cdot \\frac{\\sin B}{\\sin A}$。分数相除时公分母可以约去。$\\sin A = \\frac{1}{4}$，$\\sin B = \\frac{3}{8}$，$a = 12$：比值是 $\\frac{3}{2}$，所以 $b = 18$。正弦较大的角所对的边一定更长，这是一个好的检查。",
    ),
  },
  "act-exam-using-the-law-of-cosines": {
    tip: t(
      "With two sides and their included angle, the third side satisfies $c^2 = a^2 + b^2 - 2ab\\cos C$. For sides $5$ and $3$ with angle $120^\\circ$: $25 + 9 - 30\\cos 120^\\circ$. Keep the minus sign, keep the cosine as written, and do not forget the factor of $2$ in the last term.",
      "已知两边及其夹角时，第三边满足 $c^2 = a^2 + b^2 - 2ab\\cos C$。边 $5$ 和 $3$、夹角 $120^\\circ$：$25 + 9 - 30\\cos 120^\\circ$。保留减号，余弦按原样写出，也不要忘了最后一项的因数 $2$。",
    ),
    hardTip: t(
      "If the cosine's value is known, substitute and compute a number; the result is the third side squared, so no root is needed if that is asked. For sides $6$ and $5$ with cosine $\\frac{1}{5}$: $36 + 25 - 2(6)(5)\\left(\\frac{1}{5}\\right) = 49$. Omitting the $2$ gives a value that is too large.",
      "余弦值已知时，代入算出一个数；结果就是第三边的平方，若问的是平方，就不必开方。边 $6$ 和 $5$、余弦为 $\\frac{1}{5}$：$36 + 25 - 2(6)(5)\\left(\\frac{1}{5}\\right) = 49$。漏掉 $2$，值就太大了。",
    ),
  },
  "act-exam-solving-trig-equations-and-inequalities": {
    tip: t(
      "Treat $\\sin t$ as the unknown: undo the constant and the coefficient to isolate it, then recall which angle gives that value. For $2\\sin t - \\sqrt{3} = 0$ in the first quadrant: $\\sin t = \\frac{\\sqrt{3}}{2}$, so $t = 60^\\circ$. Know the sines of $30^\\circ$, $45^\\circ$ and $60^\\circ$ by heart.",
      "把 $\\sin t$ 当作未知量：消去常数和系数把它孤立出来，再回想哪个角有这个值。第一象限内 $2\\sin t - \\sqrt{3} = 0$：$\\sin t = \\frac{\\sqrt{3}}{2}$，所以 $t = 60^\\circ$。$30^\\circ$、$45^\\circ$、$60^\\circ$ 的正弦值要熟记。",
    ),
    hardTip: t(
      "Over a full turn, a positive sine value less than $1$ occurs twice: at the reference angle $t$ and at $180^\\circ - t$. So $\\sin t = \\frac{\\sqrt{3}}{2}$ holds at $60^\\circ$ and $120^\\circ$. Counting only the acute solution is the trap. The values $1$ and $-1$ occur only once.",
      "在一整圈内，小于 $1$ 的正的正弦值出现两次：在参考角 $t$ 和 $180^\\circ - t$ 处。所以 $\\sin t = \\frac{\\sqrt{3}}{2}$ 在 $60^\\circ$ 和 $120^\\circ$ 处成立。只数锐角解就是陷阱。值 $1$ 和 $-1$ 只出现一次。",
    ),
  },
  "act-exam-finding-lengths-on-a-line": {
    tip: t(
      "For points in order on a line, the parts add to the whole: $AB + BC = AC$. Find an unknown part by subtracting. With $PR = 20$ and $PQ = 8$, we get $QR = 12$. Adding the two given lengths is the wrong operation when one of them is already the whole segment.",
      "直线上按顺序排列的点，部分之和等于整体：$AB + BC = AC$。求未知部分时做减法。$PR = 20$，$PQ = 8$ 时，$QR = 12$。如果其中一个已是整条线段，把两个给定的长度相加就错了。",
    ),
    hardTip: t(
      "If one part is a multiple of the other, write both with one variable and add them to the whole. Let $PQ = x$ and $QR = 3x$; with $PR = 24$, $4x = 24$, so $x = 6$ and $QR = 18$. Notice which part is requested, since solving for $x$ gives only the smaller one.",
      "一部分是另一部分的倍数时，用一个变量表示两者，再加起来等于整体。设 $PQ = x$，$QR = 3x$；$PR = 24$ 时，$4x = 24$，所以 $x = 6$，$QR = 18$。注意问的是哪一部分，因为解出 $x$ 只得到较小的那段。",
    ),
  },
  "act-exam-finding-reflex-and-divided-angles": {
    tip: t(
      "A full turn is $360^\\circ$, and a reflex angle is the larger part that completes it, between $180^\\circ$ and $360^\\circ$. So an angle of $40^\\circ$ pairs with a reflex angle of $320^\\circ$. Subtracting from $180^\\circ$ gives a supplement instead, which is not reflex.",
      "一整圈是 $360^\\circ$，优角是把它补满的较大部分，在 $180^\\circ$ 和 $360^\\circ$ 之间。所以 $40^\\circ$ 的角对应 $320^\\circ$ 的优角。用 $180^\\circ$ 去减得到的是补角，不是优角。",
    ),
    hardTip: t(
      "A ratio splits an angle into equal parts: add the ratio's terms, then divide the angle by that sum. An angle of $60^\\circ$ in the ratio $1 : 5$ has $6$ parts of $10^\\circ$, so the smaller is $10^\\circ$. Dividing by just one term of the ratio, such as $5$, gives the wrong part size.",
      "比把角分成若干等份：把比的各项相加，再用角除以这个和。$60^\\circ$ 的角按 $1 : 5$ 分，有 $6$ 份，每份 $10^\\circ$，所以较小的是 $10^\\circ$。只除以比的一项，比如 $5$，得到的每份大小就错了。",
    ),
  },
  "act-exam-problem-solving-with-intersecting-lines": {
    tip: t(
      "Two crossing lines form two pairs of equal vertical angles, and neighbouring angles add to $180^\\circ$. If one angle is $50^\\circ$, the others are $50^\\circ$, $130^\\circ$ and $130^\\circ$. All four must total $360^\\circ$, which is a quick check. Giving a complement, from $90^\\circ$, is the trap.",
      "两条相交直线形成两对相等的对顶角，相邻的角和为 $180^\\circ$。若一个角是 $50^\\circ$，其余是 $50^\\circ$、$130^\\circ$、$130^\\circ$。四个角之和必须是 $360^\\circ$，这是个快速检查。用 $90^\\circ$ 求余角就是陷阱。",
    ),
    hardTip: t(
      "Vertical angles are equal, so set their expressions equal and solve. For $(3x + 10)^\\circ$ and $(5x - 20)^\\circ$: $2x = 30$, so $x = 15$, and both angles are $55^\\circ$. Setting them to add to $180^\\circ$ applies to adjacent angles, not to vertical pairs.",
      "对顶角相等，所以令表达式相等再求解。对 $(3x + 10)^\\circ$ 和 $(5x - 20)^\\circ$：$2x = 30$，所以 $x = 15$，两个角都是 $55^\\circ$。令其和为 $180^\\circ$ 只适用于邻角，不适用于对顶角。",
    ),
  },
  "act-exam-solving-angle-bisector-problems": {
    tip: t(
      "A bisector cuts an angle into two equal parts, so each part is half of the whole. If the whole angle is $80^\\circ$, each part is $40^\\circ$. Doubling instead goes the wrong way, and that value appears when the question is misread. Name the requested part from the letters.",
      "角平分线把角分成相等的两部分，所以每部分是整体的一半。整个角是 $80^\\circ$ 时，每部分是 $40^\\circ$。加倍是方向错了，看错题时就会得到这个值。根据字母确认所求的是哪部分。",
    ),
    hardTip: t(
      "With expressions for both parts, set them equal, solve for $x$, substitute to get one part, and double for the whole angle. If $(2x + 5)^\\circ$ equals $(3x - 5)^\\circ$: $x = 10$, each part is $25^\\circ$ and the whole is $50^\\circ$. Stopping at $x$ or at one part is the trap.",
      "两部分都用表达式给出时，令其相等，解出 $x$，代入得一部分，再加倍得到整个角。若 $(2x + 5)^\\circ$ 等于 $(3x - 5)^\\circ$：$x = 10$，每部分 $25^\\circ$，整个角 $50^\\circ$。停在 $x$ 或一部分上就是陷阱。",
    ),
  },
  "act-exam-relating-sides-to-opposite-angles": {
    tip: t(
      "In a triangle, the longest side lies opposite the largest angle. Find the missing angle from the sum of $180^\\circ$, then compare all three. With angles $50^\\circ$ and $60^\\circ$, the third is $70^\\circ$, so it faces the longest side. Picking the largest given angle without finding the third is the trap.",
      "三角形中，最长边对着最大角。用 $180^\\circ$ 的内角和求出缺的角，再比较三个角。两角为 $50^\\circ$ 和 $60^\\circ$ 时，第三个角是 $70^\\circ$，它对着最长边。不求第三个角，就在给定的角中选最大的，是陷阱。",
    ),
    hardTip: t(
      "To order the angles, order the sides, then name the vertex that is not on each side. In triangle $ABC$ with $AB = 5$, $BC = 7$ and $AC = 8$: the angles from smallest are $\\angle C$, $\\angle A$, $\\angle B$. The angle opposite a side uses the one letter missing from that side's name.",
      "要给角排序，先给边排序，再找出不在每条边上的顶点。在三角形 $ABC$ 中，$AB = 5$，$BC = 7$，$AC = 8$：角从小到大是 $\\angle C$、$\\angle A$、$\\angle B$。一条边的对角，就是这条边的名字中缺少的那个字母。",
    ),
  },
  "act-exam-applying-the-triangle-inequality": {
    tip: t(
      "Each side must be shorter than the sum of the other two, so the third side lies strictly between the difference and the sum of the known ones. For sides $3$ and $8$: between $5$ and $11$. The endpoints fail, since they produce a flat figure rather than a triangle.",
      "每条边都必须小于其他两边之和，所以第三边严格介于已知两边的差与和之间。边 $3$ 和 $8$：在 $5$ 和 $11$ 之间。端点不行，因为它们形成的是一条线段而不是三角形。",
    ),
    hardTip: t(
      "To count whole-number lengths, list the integers strictly between the difference and the sum. For sides $3$ and $8$: $6$ through $10$, which makes $5$ values. Subtracting the bounds and forgetting to exclude endpoints leads to an off-by-one answer. The number is the sum minus the difference, minus $1$.",
      "要数整数长度，列出严格介于差与和之间的整数。边 $3$ 和 $8$：$6$ 到 $10$，共 $5$ 个值。把上下界相减、忘了排除端点，就会差一。个数等于和减差，再减 $1$。",
    ),
  },
  "act-exam-classifying-triangles": {
    tip: t(
      "Find the third angle from the sum of $180^\\circ$, then classify by the largest angle: over $90^\\circ$ is obtuse, exactly $90^\\circ$ is right, and otherwise acute. Angles of $50^\\circ$ and $30^\\circ$ leave $100^\\circ$, so the triangle is obtuse. Judging from the two given angles alone is the trap.",
      "用 $180^\\circ$ 的内角和求出第三个角，再按最大角分类：大于 $90^\\circ$ 是钝角，恰好 $90^\\circ$ 是直角，否则是锐角。$50^\\circ$ 和 $30^\\circ$ 的角剩下 $100^\\circ$，所以是钝角三角形。只看给定的两个角就是陷阱。",
    ),
    hardTip: t(
      "From side lengths, compare the longest side squared with the sum of the other squares. Greater means obtuse, equal means right and less means acute. For $4$, $5$ and $7$: $49 > 41$, so it is obtuse. Comparing the sides without squaring only tests whether a triangle exists.",
      "由边长判断时，比较最长边的平方与另外两边的平方和。大于是钝角，等于是直角，小于是锐角。边 $4$、$5$、$7$：$49 > 41$，所以是钝角。不平方直接比较边长，只能判断三角形是否存在。",
    ),
  },
  "act-exam-identifying-angle-and-shape-properties": {
    tip: t(
      "Choose the most specific name that fits. Four right angles make a rectangle; it is a square only if all sides are equal. A rhombus needs four equal sides, and a trapezoid has parallel sides but lacks these conditions. A figure with sides of $6$, $4$, $6$ and $4$ and right angles is a rectangle.",
      "选择最具体且符合的名称。四个直角是矩形；只有所有边相等才是正方形。菱形需要四条边相等，梯形有平行边但不具备这些条件。边为 $6$、$4$、$6$、$4$ 且都是直角的图形是矩形。",
    ),
    hardTip: t(
      "In a parallelogram, opposite angles are equal, opposite sides are equal, and consecutive angles add to $180^\\circ$. Vertex order matters: in $PQRS$, $\\angle P$ is opposite $\\angle R$ and $PQ$ is opposite $RS$. An option claiming that adjacent sides or angles are equal need not hold.",
      "平行四边形中，对角相等，对边相等，邻角和为 $180^\\circ$。顶点顺序很重要：在 $PQRS$ 中，$\\angle P$ 与 $\\angle R$ 相对，$PQ$ 与 $RS$ 相对。声称邻边或邻角相等的选项不一定成立。",
    ),
  },
  "act-exam-finding-interior-angles-of-polygons": {
    tip: t(
      "A polygon with $n$ sides divides into $n - 2$ triangles from one vertex, so its interior angles add to $(n - 2)180^\\circ$. For a decagon: $8(180^\\circ) = 1440^\\circ$. Multiplying $n$ by $180^\\circ$ overcounts by two triangles, and that number is usually offered among the options.",
      "$n$ 边形从一个顶点出发可分成 $n - 2$ 个三角形，所以内角和是 $(n - 2)180^\\circ$。十边形：$8(180^\\circ) = 1440^\\circ$。用 $n$ 乘 $180^\\circ$ 多算了两个三角形，这个数通常就在选项中。",
    ),
    hardTip: t(
      "To find a missing angle, compute the total from $(n - 2)180^\\circ$ with $n$ being the count of sides, and subtract the known angles. A pentagon has $n = 5$; with angles of $90^\\circ$, $100^\\circ$, $110^\\circ$ and $120^\\circ$, the fifth is $120^\\circ$. Using $360^\\circ$ as the total is true only of quadrilaterals.",
      "求缺的角时，用 $(n - 2)180^\\circ$ 算出总和，$n$ 是边数，再减去已知的角。五边形 $n = 5$；角为 $90^\\circ$、$100^\\circ$、$110^\\circ$、$120^\\circ$ 时，第五个角是 $120^\\circ$。把总和当作 $360^\\circ$ 只对四边形成立。",
    ),
  },
  "act-exam-finding-angles-in-parallelograms": {
    tip: t(
      "Consecutive angles of a parallelogram are supplementary, since the parallel sides make co-interior angles. So $\\angle A$ and $\\angle B$ add to $180^\\circ$. If $\\angle A$ is $60^\\circ$, then $\\angle B$ is $120^\\circ$. Answering with the same angle treats them as opposite, which they are not.",
      "平行四边形的邻角互补，因为平行边形成同旁内角。所以 $\\angle A$ 和 $\\angle B$ 之和为 $180^\\circ$。若 $\\angle A$ 是 $60^\\circ$，则 $\\angle B$ 是 $120^\\circ$。答成相同的角，就把它们当成了对角，其实不是。",
    ),
    hardTip: t(
      "Opposite angles are equal, so set the two expressions equal to find $x$, compute one of them, and take the supplement for a neighbouring vertex. For $(3x + 10)^\\circ$ and $(4x - 10)^\\circ$: $x = 20$, the angle is $70^\\circ$ and its neighbour is $110^\\circ$. Stopping at $70^\\circ$ answers for the wrong vertex.",
      "对角相等，所以令两个表达式相等求 $x$，算出其中一个角，再取补角得到相邻顶点的角。对 $(3x + 10)^\\circ$ 和 $(4x - 10)^\\circ$：$x = 20$，这个角是 $70^\\circ$，邻角是 $110^\\circ$。停在 $70^\\circ$ 就答错了顶点。",
    ),
  },
  "act-exam-finding-lengths-with-parallel-sides": {
    tip: t(
      "A parallelogram's perimeter is twice the sum of two adjacent sides, since opposite sides match. So halve the perimeter, then subtract the known side. A perimeter of $40$ with one side $8$ leaves an adjacent side of $12$. Subtracting the side from the whole perimeter skips the halving and overshoots.",
      "平行四边形的周长是两条邻边之和的两倍，因为对边相等。所以先把周长减半，再减去已知边。周长 $40$、一边 $8$，邻边就是 $12$。直接从整个周长中减去这条边，没有减半，结果偏大。",
    ),
    hardTip: t(
      "A trapezoid's midsegment joins the midpoints of the legs. It is parallel to the bases, and its length is their average. With bases $6$ and $14$, it has length $10$. Adding the bases without halving is the common slip, while the difference of the bases has no role here.",
      "梯形的中位线连接两腰的中点。它与底边平行，长度是两底的平均数。底为 $6$ 和 $14$ 时，长度是 $10$。把两底相加而不减半是常见的疏漏，两底之差在这里没有作用。",
    ),
  },
  "act-exam-finding-lengths-in-regular-polygons": {
    tip: t(
      "A regular polygon has equal sides, so one side is the perimeter divided by the number of sides. A regular pentagon with a perimeter of $35$ has sides of $7$. Multiplying instead gives a larger number than the perimeter, an impossible value for one side of the shape.",
      "正多边形的边都相等，所以一条边等于周长除以边数。周长 $35$ 的正五边形，边长是 $7$。做乘法得到的数比周长还大，对图形的一条边来说是不可能的。",
    ),
    hardTip: t(
      "A regular hexagon splits into $6$ equilateral triangles whose sides equal the hexagon's side. Divide one triangle's perimeter by $3$ for the side, then multiply by $6$. A triangle with perimeter $30$ gives side $10$ and a hexagon perimeter of $60$. Only the outer edges count; multiplying the whole triangle's perimeter by $6$ overcounts.",
      "正六边形可分成 $6$ 个等边三角形，三角形的边等于六边形的边。用三角形的周长除以 $3$ 得边长，再乘 $6$。周长 $30$ 的三角形，边长 $10$，六边形周长 $60$。只算外围的边；用整个三角形的周长乘 $6$ 就多算了。",
    ),
  },
  "act-exam-translating-and-reflecting-a-point": {
    tip: t(
      "A reflection across the $x$-axis keeps $x$ and negates $y$, and a reflection across the $y$-axis does the reverse. So $(2, -5)$ across the $x$-axis becomes $(2, 5)$. Mixing up the axes changes the wrong coordinate; the axis named is the one whose coordinate stays put.",
      "关于 $x$ 轴的对称保持 $x$ 不变，把 $y$ 变号；关于 $y$ 轴的对称正好相反。所以 $(2, -5)$ 关于 $x$ 轴的对称点是 $(2, 5)$。把轴弄混就改错了坐标；所指定的轴，其对应坐标不变。",
    ),
    hardTip: t(
      "Do the steps in the stated order. A translation adds to $x$ for right and subtracts from $y$ for down; then the reflection negates a coordinate of the new point. From $(1, -2)$, going right $3$ and down $4$ gives $(4, -6)$, and reflecting across the $y$-axis gives $(-4, -6)$. Reversing the steps gives a different point.",
      "按给定的顺序操作。平移时向右加到 $x$，向下从 $y$ 中减；然后对新点的坐标变号。从 $(1, -2)$ 向右 $3$、向下 $4$ 得 $(4, -6)$，关于 $y$ 轴对称得 $(-4, -6)$。步骤颠倒，得到的就是另一个点。",
    ),
  },
  "act-exam-applying-a-rigid-motion": {
    tip: t(
      "Rotations, translations and reflections are rigid motions: they move a figure without changing lengths or angle measures. So after any sequence, a segment of length $9$ still has length $9$. The stated angle of the rotation is irrelevant to the length, so do not use it in a calculation.",
      "旋转、平移和对称都是刚体运动：它们移动图形，但不改变长度和角度。所以经过任何一连串这样的变换，长度为 $9$ 的线段仍是 $9$。给出的角度与长度无关，所以不要用它来计算。",
    ),
    hardTip: t(
      "A $90^\\circ$ counterclockwise rotation about the origin sends $(x, y)$ to $(-y, x)$: swap the coordinates, then negate the new first one. So $(2, 5)$ goes to $(-5, 2)$. When $y$ is negative, the new first coordinate is positive. The clockwise rule $(y, -x)$ gives the other wrong option.",
      "绕原点逆时针旋转 $90^\\circ$，把 $(x, y)$ 变为 $(-y, x)$：交换坐标，再把新的第一个坐标变号。所以 $(2, 5)$ 变为 $(-5, 2)$。$y$ 为负时，新的第一个坐标为正。顺时针的规则 $(y, -x)$ 给出的是另一个错误选项。",
    ),
  },
  "act-exam-dilating-a-figure": {
    tip: t(
      "A dilation centred at the origin with scale factor $k$ multiplies both coordinates by $k$, keeping their signs. So $(2, -3)$ with $k = 4$ goes to $(8, -12)$. Adding $k$ to the coordinates describes a translation, which is the error that these options exploit.",
      "以原点为中心、比例系数为 $k$ 的位似，把两个坐标都乘 $k$，符号不变。所以 $(2, -3)$ 在 $k = 4$ 时变为 $(8, -12)$。给坐标加 $k$ 描述的是平移，这些选项正是利用了这个错误。",
    ),
    hardTip: t(
      "Under a dilation, lengths scale by $k$ and areas by $k^2$, because both dimensions grow. A $2$ by $5$ rectangle with factor $3$ has area $10$ originally and $90$ afterward; multiplying the new sides, $6$ and $15$, confirms it. Multiplying the area by $k$ alone is the trap.",
      "位似变换下，长度按 $k$ 放大，面积按 $k^2$ 放大，因为两个方向都变大了。$2$ 乘 $5$ 的矩形、系数 $3$，面积从 $10$ 变成 $90$；把新的边 $6$ 和 $15$ 相乘可以验证。只把面积乘 $k$ 就是陷阱。",
    ),
  },
  "act-exam-finding-lengths-using-parallel-lines": {
    tip: t(
      "A line parallel to one side of a triangle cuts the other two sides in the same ratio: $\\frac{AD}{DB} = \\frac{AE}{EC}$. With $AD = 6$, $DB = 3$ and $AE = 8$, we get $EC = 4$. Match the pieces in the same order on both sides. Flipping one fraction is the trap.",
      "与三角形一边平行的直线，把另外两边分成相同的比：$\\frac{AD}{DB} = \\frac{AE}{EC}$。$AD = 6$，$DB = 3$，$AE = 8$ 时，$EC = 4$。两边的线段要按相同顺序对应。颠倒一个分数就是陷阱。",
    ),
    hardTip: t(
      "The parallel segment itself is related to the base by the ratio of whole sides, because the small and large triangles are similar: $\\frac{DE}{BC} = \\frac{AD}{AB}$. With $AD = 6$, $DB = 3$ and $BC = 15$: the ratio is $\\frac{2}{3}$ and $DE = 10$. Using $\\frac{AD}{DB}$ here gives a value above the base.",
      "平行线段本身与底边的关系，要用整条边的比，因为大小两个三角形相似：$\\frac{DE}{BC} = \\frac{AD}{AB}$。$AD = 6$，$DB = 3$，$BC = 15$：比是 $\\frac{2}{3}$，$DE = 10$。这里用 $\\frac{AD}{DB}$，得到的值比底边还大。",
    ),
  },
  "act-exam-finding-diagonals-and-perimeters-with-the-pythagorean-theorem": {
    tip: t(
      "A rectangle's diagonal is the hypotenuse of a right triangle whose legs are the sides: $d = \\sqrt{\\ell^2 + w^2}$. For $6$ by $8$: $d = 10$. Adding the sides, to $14$, is the shortcut that fails; a straight diagonal is shorter than going along two sides.",
      "矩形的对角线是直角三角形的斜边，两条直角边是矩形的边：$d = \\sqrt{\\ell^2 + w^2}$。$6$ 乘 $8$ 时：$d = 10$。把边相加得 $14$，这个捷径行不通；直的对角线比沿两边走要短。",
    ),
    hardTip: t(
      "From a diagonal and one side, subtract squares to find the other side, then compute the perimeter. With a diagonal of $17$ and a side of $8$: the other side is $\\sqrt{289 - 64} = 15$, so the perimeter is $46$. Adding the squares here, or stopping at the side, gives wrong answers.",
      "由对角线和一条边求周长，先用平方差求出另一条边，再算周长。对角线 $17$、一边 $8$：另一边是 $\\sqrt{289 - 64} = 15$，周长是 $46$。这里把平方相加，或者停在这条边上，都会得到错误答案。",
    ),
  },
  "act-exam-finding-lengths-in-figures-with-the-pythagorean-theorem": {
    tip: t(
      "Locate the right angle and label the slanted length as the hypotenuse. To find a leg, subtract: $\\text{leg} = \\sqrt{c^2 - a^2}$. A $10$-foot ladder whose foot is $6$ feet from a wall reaches $8$ feet up. Adding the squares would make the leg longer than the ladder, which is impossible.",
      "找到直角，把斜着的长度标为斜边。求直角边时做减法：$\\text{leg} = \\sqrt{c^2 - a^2}$（leg 为直角边）。$10$ 英尺的梯子，底端离墙 $6$ 英尺，能够到 $8$ 英尺高。把平方相加，直角边就比梯子还长，这是不可能的。",
    ),
    hardTip: t(
      "A trip with a turn between compass directions forms a right triangle, and the straight-line distance is its hypotenuse. Walking $6$ miles west and $8$ miles south ends $10$ miles from the start. Adding the two walks gives the path travelled, not the direct distance, which is the wrong value.",
      "在互相垂直的方向之间转弯的行程构成直角三角形，直线距离就是斜边。向西走 $6$ 英里，再向南走 $8$ 英里，离起点 $10$ 英里。把两段相加得到的是所走的路程，不是直线距离，这是错误的值。",
    ),
  },
  "act-exam-finding-altitudes-and-areas-with-the-pythagorean-theorem": {
    tip: t(
      "In an isosceles triangle, the altitude to the base cuts the base in half, forming two right triangles. The leg of the isosceles triangle is the hypotenuse. With equal sides of $10$ and base $12$: half the base is $6$, so the altitude is $8$. Using the entire base is the common slip.",
      "等腰三角形中，底边上的高把底边平分，形成两个直角三角形。等腰三角形的腰是斜边。腰为 $10$、底为 $12$ 时：底的一半是 $6$，所以高是 $8$。用整条底边是常见的疏漏。",
    ),
    hardTip: t(
      "The area needs the altitude first, so find it as above, then use $\\frac{1}{2}bh$ with the whole base. With equal sides of $10$ and base $12$: the altitude is $8$, and the area is $48$. The half-base is for the theorem only; using it for the area gives half the right value.",
      "求面积要先求高，按上面的方法求出，再用整条底边代入 $\\frac{1}{2}bh$。腰为 $10$、底为 $12$ 时：高是 $8$，面积是 $48$。底的一半只用于勾股定理；用它算面积，结果只有正确值的一半。",
    ),
  },
  "act-exam-checking-and-applying-pythagorean-relationships": {
    tip: t(
      "If the two shorter sides' squares add to the longest side's square, the triangle is right, and the right angle lies opposite the longest side. For $8$, $15$ and $17$: $64 + 225 = 289$. An option that places the right angle elsewhere fails: the longest side faces the largest angle.",
      "如果两条较短边的平方和等于最长边的平方，这个三角形是直角三角形，直角对着最长边。对 $8$、$15$、$17$：$64 + 225 = 289$。把直角放在别处的选项不成立：最长边对着最大的角。",
    ),
    hardTip: t(
      "To force a right angle opposite the longest side, set $x^2$ equal to the sum of the other two squares and take the root. For sides $8$, $15$ and $x$: $x^2 = 289$, so $x = 17$. Adding the two sides directly gives $23$, which is too long to form any triangle.",
      "要让最长边的对角为直角，令 $x^2$ 等于另外两边的平方和，再开方。边为 $8$、$15$、$x$ 时：$x^2 = 289$，所以 $x = 17$。把两边直接相加得 $23$，太长了，根本构不成三角形。",
    ),
  },
  "act-exam-finding-a-length-from-an-angle-measure": {
    tip: t(
      "Label the sides from the given angle, then choose the ratio linking the known side and the unknown one. With the hypotenuse known and the opposite side wanted, use sine: opposite equals hypotenuse times $\\sin\\theta$. For hypotenuse $9$ at $50^\\circ$: $9\\sin 50^\\circ$. Cosine would give the adjacent side.",
      "从给定的角出发标出各边，再选择连接已知边和未知边的比。已知斜边、求对边，用正弦：对边等于斜边乘 $\\sin\\theta$。斜边 $9$、角 $50^\\circ$：$9\\sin 50^\\circ$。余弦给出的是邻边。",
    ),
    hardTip: t(
      "A shadow on level ground and a vertical pole form a right angle, with the height opposite the angle of elevation and the shadow adjacent to it. So tangent is the ratio: height equals shadow times $\\tan\\theta$. A $25$-foot shadow at $50^\\circ$ gives $25\\tan 50^\\circ$. Dividing by the tangent reverses the relationship.",
      "水平地面上的影子和竖直的杆构成直角，高是仰角的对边，影子是邻边。所以要用正切：高等于影长乘 $\\tan\\theta$。$25$ 英尺的影子、仰角 $50^\\circ$，得 $25\\tan 50^\\circ$。除以正切就把关系弄反了。",
    ),
  },
  "act-exam-writing-an-inverse-trigonometric-expression": {
    tip: t(
      "An inverse function recovers an angle from a ratio. Identify which sides you know relative to the angle, form the ratio, then apply the matching inverse. With opposite $3$ and hypotenuse $8$: $\\theta = \\sin^{-1}\\left(\\frac{3}{8}\\right)$. Using $\\cos^{-1}$ needs the adjacent side, and the fraction must not be flipped.",
      "反函数由比值还原角度。确定已知的边相对于这个角是哪两条，写出比值，再用对应的反函数。对边 $3$、斜边 $8$：$\\theta = \\sin^{-1}\\left(\\frac{3}{8}\\right)$。用 $\\cos^{-1}$ 需要邻边，分数也不能颠倒。",
    ),
    hardTip: t(
      "In a ramp, the rise is opposite the angle and the horizontal distance is adjacent, so the ratio is a tangent and the angle uses $\\tan^{-1}$. A rise of $2$ over a run of $15$ gives $\\tan^{-1}\\left(\\frac{2}{15}\\right)$. Using sine would treat the run as the slanted length of the ramp.",
      "斜坡中，升高量是角的对边，水平距离是邻边，所以比值是正切，求角要用 $\\tan^{-1}$。升高 $2$、水平距离 $15$，得 $\\tan^{-1}\\left(\\frac{2}{15}\\right)$。用正弦就把水平距离当成了斜坡的斜长。",
    ),
  },
  "act-exam-finding-areas-of-composite-rectilinear-figures": {
    tip: t(
      "Split a figure with right-angle corners into rectangles with a line, working out any unlabelled lengths by subtraction. Then add the areas. An L shape made from a $6$ by $2$ rectangle above a $3$ by $5$ rectangle has area $12 + 15 = 27$. Using the outer box alone counts the missing corner.",
      "用一条线把直角拐角的图形分成矩形，没有标注的长度用减法求出。再把面积相加。由上方 $6$ 乘 $2$ 和下方 $3$ 乘 $5$ 的矩形组成的 L 形，面积是 $12 + 15 = 27$。只用外框就把缺的角也算进去了。",
    ),
    hardTip: t(
      "For a staircase or L shape whose corner has been cut out, the perimeter matches that of the surrounding rectangle: the inward edges just move, without changing the total. A $6$ by $7$ surrounding box gives a perimeter of $26$. This shortcut fails for a notch cut into the middle of a side.",
      "对于切掉一角的阶梯形或 L 形，周长等于外接矩形的周长：向内的边只是移动了位置，总长不变。$6$ 乘 $7$ 的外框，周长是 $26$。若缺口开在一条边的中间，这个捷径就不成立了。",
    ),
  },
  "act-exam-finding-areas-of-divided-rectangles": {
    tip: t(
      "A vertical cut gives two rectangles of equal height, so the whole width is the sum of the two widths. Multiply it by the height. With height $6$ and widths $3$ and $4$: $6(7) = 42$. Multiplying only one width, or multiplying the three numbers together, gives wrong options.",
      "竖直切割得到两个高度相同的矩形，所以总宽度是两个宽度之和。再乘高。高 $6$、宽 $3$ 和 $4$：$6(7) = 42$。只乘一个宽度，或者把三个数全部相乘，都是错误选项。",
    ),
    hardTip: t(
      "Areas of adjacent pieces add, so the given areas can be used as they are. Find the area of the new piece and add it to the others. Pieces of area $18$ and $24$, plus a new piece of width $2$ and the same height $6$, make $18 + 24 + 12 = 54$. Do not work back to the widths unnecessarily.",
      "相邻部分的面积可以相加，所以给定的面积可以直接用。求出新部分的面积，再加上其他部分。面积 $18$ 和 $24$，加上宽 $2$、同样高 $6$ 的新部分，共 $18 + 24 + 12 = 54$。不必多此一举地去倒推宽度。",
    ),
  },
  "act-exam-using-a-given-perimeter": {
    tip: t(
      "Halve the perimeter to get length plus width, then subtract the known dimension. A perimeter of $30$ and a width of $6$ give $\\ell + 6 = 15$, so $\\ell = 9$. Subtracting the width from the perimeter directly ignores the second pair of sides, which is the usual error.",
      "把周长减半，得到长加宽，再减去已知的尺寸。周长 $30$、宽 $6$：$\\ell + 6 = 15$，所以 $\\ell = 9$。直接从周长中减去宽，就忽略了另一组边，这是常见错误。",
    ),
    hardTip: t(
      "If the length is a multiple of the width, write the perimeter in one variable, solve, and then multiply the two dimensions for the area. With length $3w$ and perimeter $48$: $8w = 48$, so $w = 6$ and the sides are $6$ and $18$, for an area of $108$. Stopping at the width leaves it unfinished.",
      "长是宽的倍数时，用一个变量写出周长，求解，再把两个尺寸相乘得面积。长为 $3w$、周长为 $48$：$8w = 48$，所以 $w = 6$，两边是 $6$ 和 $18$，面积是 $108$。停在宽上就没做完。",
    ),
  },
  "act-exam-finding-areas-of-quadrilaterals": {
    tip: t(
      "A parallelogram's area is base times height, where the height is perpendicular to the base. For base $9$ and height $4$: $A = 36$. There is no half here, unlike a triangle. A slanted side given in a figure must not be used as the height.",
      "平行四边形的面积是底乘高，高与底垂直。底 $9$、高 $4$ 时：$A = 36$。这里不像三角形那样取一半。图中给出的斜边不能当作高。",
    ),
    hardTip: t(
      "A trapezoid's area averages the two parallel bases, then multiplies by the height: $A = \\frac{1}{2}(b_1 + b_2)h$. For bases $5$ and $11$ and height $4$: $A = 32$. Forgetting the half doubles the result, and using only one base gives the area of a parallelogram instead.",
      "梯形面积是两条平行底的平均数乘高：$A = \\frac{1}{2}(b_1 + b_2)h$。底为 $5$ 和 $11$、高为 $4$ 时：$A = 32$。忘了一半，结果就翻倍；只用一条底得到的是平行四边形的面积。",
    ),
  },
  "act-exam-finding-areas-of-triangles": {
    tip: t(
      "Take half of the product of base and height: $A = \\frac{1}{2}bh$. For base $6$ and height $7$: $A = 21$. The answer without the half is the area of the rectangle that surrounds the triangle, and so it is the favourite wrong option.",
      "取底与高乘积的一半：$A = \\frac{1}{2}bh$。底 $6$、高 $7$ 时：$A = 21$。不取一半的答案是外围矩形的面积，所以它是最常见的错误选项。",
    ),
    hardTip: t(
      "With the base fixed, area is directly proportional to height, so multiply the area by the height's factor without finding the height. An area of $12$ with height tripled becomes $36$. Squaring the factor applies only if both base and height scale, so read which dimension changes.",
      "底不变时，面积与高成正比，所以把面积乘高的倍数即可，不必求出高。面积 $12$、高变为三倍，面积就是 $36$。只有底和高都放大时才把倍数平方，所以要看清哪个尺寸变了。",
    ),
  },
  "act-exam-finding-shaded-areas-with-circles": {
    tip: t(
      "The region between a square and its inscribed circle is the square's area minus the circle's. The side equals the diameter, or twice the radius. For radius $5$: the side is $10$, so the shaded area is $100 - 25\\pi$. Squaring the radius for the square gives only a quarter of it.",
      "正方形与其内切圆之间的区域，面积等于正方形面积减圆面积。边长等于直径，即半径的两倍。半径为 $5$ 时：边长为 $10$，阴影面积是 $100 - 25\\pi$。把半径平方作为正方形面积，只得到四分之一。",
    ),
    hardTip: t(
      "A ring's area is the larger circle's area minus the smaller circle's: $\\pi(R^2 - r^2)$. For radii $3$ and $7$: $\\pi(49 - 9) = 40\\pi$. The common trap squares the difference, giving $\\pi(7 - 3)^2 = 16\\pi$, but squares do not subtract in that way.",
      "圆环面积是大圆面积减小圆面积：$\\pi(R^2 - r^2)$。半径为 $3$ 和 $7$ 时：$\\pi(49 - 9) = 40\\pi$。常见陷阱是把差平方，得到 $\\pi(7 - 3)^2 = 16\\pi$，但平方不能这样相减。",
    ),
  },
  "act-exam-comparing-areas-of-figures": {
    tip: t(
      "For two squares, the area ratio equals the side ratio squared. Sides of $3$ and $9$ have a side ratio of $3$, so the larger area is $9$ times the smaller. Check with $81$ and $9$. Answering with the side ratio itself is the standard mistake on these questions.",
      "两个正方形的面积比等于边长比的平方。边长 $3$ 和 $9$ 的边长比是 $3$，所以大的面积是小的 $9$ 倍。用 $81$ 和 $9$ 验算。直接答边长比是这类题的标准错误。",
    ),
    hardTip: t(
      "A rectangle and a triangle sharing a base and height differ by exactly half of the rectangle, as the triangle's area is half of the product. For base $8$ and height $6$: the areas are $48$ and $24$, so the excess is $24$. Giving the rectangle's whole area answers a different question.",
      "同底等高的矩形和三角形，面积恰好相差矩形的一半，因为三角形的面积是乘积的一半。底 $8$、高 $6$：面积是 $48$ 和 $24$，多出 $24$。给出矩形的全部面积就答了另一个问题。",
    ),
  },
  "act-exam-finding-areas-of-nested-regions": {
    tip: t(
      "The area of the region around an inner shape is the outer area minus the inner area. A $12$ by $8$ lot with a $2$ by $2$ shed has $96 - 4 = 92$ square units free. Subtracting lengths before multiplying, as in $10$ by $6$, removes a strip rather than the shed.",
      "内部图形周围的区域，面积等于外部面积减内部面积。$12$ 乘 $8$ 的地块里有 $2$ 乘 $2$ 的小屋，空地有 $96 - 4 = 92$ 平方单位。先减长度再相乘，如 $10$ 乘 $6$，去掉的是一条带子，而不是小屋。",
    ),
    hardTip: t(
      "A uniform frame adds its width on both ends of each dimension, so add twice the width to the length and to the width. A $6$ by $4$ picture with a border of $2$ has outer size $10$ by $8$, so the frame is $80 - 24 = 56$. Adding the width just once is the main trap.",
      "宽度均匀的边框在每个尺寸的两端都增加宽度，所以长和宽都要加两倍的边框宽。$6$ 乘 $4$ 的画、边框宽 $2$，外框是 $10$ 乘 $8$，边框面积是 $80 - 24 = 56$。只加一次宽度是主要陷阱。",
    ),
  },
  "act-exam-finding-a-length-from-area": {
    tip: t(
      "A square's area is its side squared, so reverse it with a square root. An area of $81$ means a side of $9$. Dividing by $2$ or by $4$ confuses the square root with other operations. Check your answer by squaring: the result should return the original area.",
      "正方形的面积是边长的平方，所以用开平方来还原。面积 $81$ 意味着边长 $9$。除以 $2$ 或 $4$ 是把开平方和其他运算弄混了。用平方来验算：结果应回到原来的面积。",
    ),
    hardTip: t(
      "A triangle's height comes from undoing $A = \\frac{1}{2}bh$: double the area, then divide by the base. An area of $30$ and base $12$ give $h = 5$. Dividing the area by the base alone gives half of this, so remember the half in the formula.",
      "三角形的高要由 $A = \\frac{1}{2}bh$ 还原：把面积加倍，再除以底。面积 $30$、底 $12$，得 $h = 5$。只用面积除以底，结果只有一半，所以别忘了公式中的那个一半。",
    ),
  },
  "act-exam-finding-the-circumference-of-a-circle": {
    tip: t(
      "Circumference is $\\pi$ times the diameter, or $2\\pi r$. With a diameter given, multiply by $\\pi$ directly: a diameter of $10$ gives $10\\pi$. Doubling the diameter treats it as a radius, and $\\pi r^2$ gives the area instead, so check which measure you have.",
      "周长等于 $\\pi$ 乘直径，或 $2\\pi r$。已知直径时直接乘 $\\pi$：直径 $10$ 得 $10\\pi$。把直径加倍是把它当成了半径，$\\pi r^2$ 得到的则是面积，所以要看清已知的是哪个量。",
    ),
    hardTip: t(
      "From an area, divide by $\\pi$ and take the root for the radius, scale the radius as stated, then use $2\\pi r$. An area of $49\\pi$ gives radius $7$; tripling makes $21$, so the circumference is $42\\pi$. Scaling the area directly, before finding the radius, breaks the chain.",
      "由面积求周长，先除以 $\\pi$ 再开方得半径，按要求放大半径，再用 $2\\pi r$。面积 $49\\pi$ 得半径 $7$；变为三倍是 $21$，周长是 $42\\pi$。在求半径之前直接放大面积，这个链条就断了。",
    ),
  },
  "act-exam-finding-distance-along-a-circle": {
    tip: t(
      "One full rotation of a rolling wheel moves it forward by one circumference, $2\\pi r$. Multiply by the number of turns. A wheel of radius $5$ rolling $4$ turns travels $4(10\\pi) = 40\\pi$. Using $\\pi r$ alone or the area formula gives the wrong distance.",
      "车轮滚动一整圈，向前移动一个周长 $2\\pi r$。再乘圈数。半径 $5$ 的车轮滚 $4$ 圈，移动 $4(10\\pi) = 40\\pi$。只用 $\\pi r$ 或者用面积公式，距离都不对。",
    ),
    hardTip: t(
      "An arc is the fraction of the circle given by its central angle: $\\frac{\\theta}{360}$ of the circumference. For $120^\\circ$ on a circle of radius $6$: $\\frac{1}{3}(12\\pi) = 4\\pi$. Reduce the fraction first to simplify the arithmetic, and do not use the angle measure itself as the length.",
      "弧是圆的一部分，所占比例由圆心角决定：周长的 $\\frac{\\theta}{360}$。半径 $6$ 的圆上 $120^\\circ$ 的弧：$\\frac{1}{3}(12\\pi) = 4\\pi$。先约分能简化运算，也不要把角度本身当作长度。",
    ),
  },
  "act-exam-comparing-areas-of-circles": {
    tip: t(
      "A circle's area depends on the square of its radius, so a radius factor of $k$ makes an area factor of $k^2$. Radii of $3$ and $9$ differ by a factor of $3$, so the areas differ by a factor of $9$. Quoting $3$ uses the radius ratio, which is the expected wrong answer.",
      "圆的面积取决于半径的平方，所以半径倍数为 $k$ 时，面积倍数是 $k^2$。半径 $3$ 和 $9$ 相差 $3$ 倍，面积相差 $9$ 倍。答 $3$ 用的是半径比，这是意料之中的错误答案。",
    ),
    hardTip: t(
      "First convert each circumference to a radius by dividing by $2\\pi$; then subtract the areas. Circumferences of $6\\pi$ and $10\\pi$ give radii $3$ and $5$, so the difference is $25\\pi - 9\\pi = 16\\pi$. Subtracting the radii before squaring gives only $4\\pi$, which is wrong.",
      "先把每个周长除以 $2\\pi$ 化成半径，再把面积相减。周长 $6\\pi$ 和 $10\\pi$ 得半径 $3$ 和 $5$，差是 $25\\pi - 9\\pi = 16\\pi$。在平方之前先减半径，只得到 $4\\pi$，这是错的。",
    ),
  },
  "act-exam-finding-arc-measure": {
    tip: t(
      "An arc's measure in degrees equals its central angle, and the whole circle measures $360^\\circ$. The major arc is the longer way around, $360^\\circ$ minus the minor arc. A central angle of $50^\\circ$ has a major arc of $310^\\circ$. Using $180^\\circ$ confuses a circle with a line.",
      "弧的度数等于它的圆心角，整个圆是 $360^\\circ$。优弧是较长的那一段，等于 $360^\\circ$ 减去劣弧。$50^\\circ$ 的圆心角对应的优弧是 $310^\\circ$。用 $180^\\circ$ 是把圆和直线弄混了。",
    ),
    hardTip: t(
      "Central angles that fill a circle add to $360^\\circ$, so subtract the known ones to get the missing angle; its arc has the same measure. With $100^\\circ$ and $60^\\circ$, the third is $200^\\circ$. A central angle can exceed $180^\\circ$, so an answer over that is not necessarily an error.",
      "填满圆的圆心角之和为 $360^\\circ$，所以减去已知的角得到缺的角；它的弧度数相同。$100^\\circ$ 和 $60^\\circ$ 时，第三个是 $200^\\circ$。圆心角可以超过 $180^\\circ$，所以答案超过它不一定是错的。",
    ),
  },
  "act-exam-finding-angles-in-circles": {
    tip: t(
      "An inscribed angle has its vertex on the circle, and it measures half of the central angle cutting the same arc. A central angle of $80^\\circ$ pairs with an inscribed angle of $40^\\circ$. Doubling instead is the mistake when going in this direction, so note which of the two angles is given.",
      "圆周角的顶点在圆上，它等于同弧所对圆心角的一半。$80^\\circ$ 的圆心角对应 $40^\\circ$ 的圆周角。朝这个方向却做了加倍，就错了，所以要注意给出的是这两个角中的哪一个。",
    ),
    hardTip: t(
      "A triangle inscribed in a circle with one side as a diameter has a right angle opposite that side, at the third vertex. So the other two angles are complementary. With a diameter $PQ$ and $\\angle P = 25^\\circ$, $\\angle Q = 65^\\circ$. Forgetting this leaves too few facts to finish.",
      "内接于圆、一边为直径的三角形，在第三个顶点处有一个直角，与这条边相对。所以另外两个角互余。直径为 $PQ$、$\\angle P = 25^\\circ$ 时，$\\angle Q = 65^\\circ$。忘了这一点，条件就不够了。",
    ),
  },
  "act-exam-problem-solving-with-circle-lengths": {
    tip: t(
      "Move from area to radius by dividing by $\\pi$ and taking the root, then double the radius for the diameter. An area of $64\\pi$ means $r = 8$ and $d = 16$. Dividing the area by $2$ does not work. Stopping at the radius is the most common wrong answer.",
      "由面积求半径，先除以 $\\pi$ 再开方，然后把半径加倍得到直径。面积 $64\\pi$ 意味着 $r = 8$，$d = 16$。用面积除以 $2$ 行不通。停在半径上是最常见的错误答案。",
    ),
    hardTip: t(
      "A square inside a circle has the diameter as its diagonal. Since the area of a square is half its diagonal squared, no need to find the side. With radius $3$: the diagonal is $6$, and the area is $\\frac{36}{2} = 18$. Treating the diameter as a side gives twice the correct area.",
      "圆内接正方形的对角线就是直径。正方形的面积是对角线平方的一半，所以不必求边长。半径 $3$ 时：对角线是 $6$，面积是 $\\frac{36}{2} = 18$。把直径当作边长，面积就大了一倍。",
    ),
  },
  "act-exam-finding-the-midpoint-of-a-segment": {
    tip: t(
      "The midpoint averages the two $x$-coordinates and, separately, the two $y$-coordinates. For $(1, 2)$ and $(5, -6)$: $(3, -2)$. Keep the signs when adding. Subtracting instead of adding gives half the difference, which belongs to a distance calculation, not to a location.",
      "中点分别取两个 $x$ 坐标的平均数和两个 $y$ 坐标的平均数。$(1, 2)$ 和 $(5, -6)$：$(3, -2)$。相加时保留符号。把加改成减得到的是差的一半，属于距离计算，不是位置。",
    ),
    hardTip: t(
      "The midpoint is halfway, so the other endpoint lies the same step beyond it: other endpoint $= 2M - A$ in each coordinate. With midpoint $(4, 1)$ and endpoint $(2, 5)$: the other is $(6, -3)$. Averaging the given points finds a new midpoint, which is the trap here.",
      "中点在正中间，所以另一端点在中点之外相同的步长处：每个坐标都是另一端点 $= 2M - A$。中点 $(4, 1)$、端点 $(2, 5)$：另一端点是 $(6, -3)$。把给定的两点平均，得到的是一个新的中点，这就是陷阱。",
    ),
  },
  "act-exam-finding-a-point-dividing-a-segment": {
    tip: t(
      "To go a fraction of the way from $A$ to $B$, take that fraction of each coordinate difference and add it to $A$. A quarter of the way from $(1, 2)$ to $(9, 14)$: the differences are $8$ and $12$, so the point is $(3, 5)$. Start from $A$, not from the origin.",
      "要从 $A$ 走向 $B$ 的几分之几，取每个坐标差的这个分数，再加到 $A$ 上。从 $(1, 2)$ 到 $(9, 14)$ 的四分之一处：差为 $8$ 和 $12$，所以这点是 $(3, 5)$。要从 $A$ 出发，不是从原点。",
    ),
    hardTip: t(
      "A ratio $m : n$ means the fraction of the way is $\\frac{m}{m + n}$, with the denominator being the sum of the terms. For $AP : PB = 2 : 3$ the fraction is $\\frac{2}{5}$. From $A(1, 2)$ to $B(11, 7)$, the $x$-coordinate is $1 + 4 = 5$. Using $\\frac{m}{n}$ as the fraction is the trap.",
      "比 $m : n$ 表示走过的分数是 $\\frac{m}{m + n}$，分母是各项之和。$AP : PB = 2 : 3$ 时，分数是 $\\frac{2}{5}$。从 $A(1, 2)$ 到 $B(11, 7)$，$x$ 坐标是 $1 + 4 = 5$。用 $\\frac{m}{n}$ 作分数就是陷阱。",
    ),
  },
  "act-exam-finding-the-distance-between-points": {
    tip: t(
      "The distance formula is the Pythagorean theorem on the coordinate differences: $d = \\sqrt{\\Delta x^2 + \\Delta y^2}$. For $(1, 2)$ and $(4, 6)$, the differences are $3$ and $4$, so $d = 5$. Adding the differences, to $7$, gives the path along grid lines, which is too long.",
      "距离公式就是把勾股定理用在坐标差上：$d = \\sqrt{\\Delta x^2 + \\Delta y^2}$。$(1, 2)$ 和 $(4, 6)$ 的差是 $3$ 和 $4$，所以 $d = 5$。把差相加得 $7$，是沿网格线的路径，太长了。",
    ),
    hardTip: t(
      "With a coordinate unknown, find the known difference, get the other from the distance, then apply the stated condition. For $(4, t)$ at distance $5$ from $(1, 2)$, with $t > 2$: the horizontal gap is $3$, so the vertical is $4$, and $t = 6$. The other root, $t = -2$, fails the condition.",
      "有未知坐标时，先求已知的坐标差，再由距离得到另一个差，最后用给定的条件。$(4, t)$ 到 $(1, 2)$ 的距离为 $5$，$t > 2$：水平差是 $3$，竖直差是 $4$，$t = 6$。另一个根 $t = -2$ 不满足条件。",
    ),
  },
  "act-exam-finding-slope-from-two-points": {
    tip: t(
      "Slope is the change in $y$ over the change in $x$, subtracting in the same order on top and bottom: $m = \\frac{y_2 - y_1}{x_2 - x_1}$. Through $(1, 2)$ and $(3, -4)$: $m = -3$. Inverting the fraction, or mixing the order, gives a wrong size or sign.",
      "斜率是 $y$ 的变化除以 $x$ 的变化，分子分母按相同的顺序相减：$m = \\frac{y_2 - y_1}{x_2 - x_1}$。过 $(1, 2)$ 和 $(3, -4)$：$m = -3$。把分数颠倒，或者顺序混乱，大小或符号就错了。",
    ),
    hardTip: t(
      "If the slope is known and a coordinate is missing, the rise equals slope times run. Then add it to the starting $y$. Through $(1, 2)$ and $(4, c)$ with slope $-2$: $c - 2 = -2(3)$, so $c = -4$. Reporting the rise as the coordinate forgets the starting height.",
      "斜率已知、缺一个坐标时，升高量等于斜率乘水平变化量。再加到起点的 $y$ 上。过 $(1, 2)$ 和 $(4, c)$、斜率 $-2$：$c - 2 = -2(3)$，所以 $c = -4$。把升高量当作坐标，就忘了起点的高度。",
    ),
  },
  "act-exam-finding-slope-from-an-equation": {
    tip: t(
      "In the form $y = mx + b$, the coefficient of $x$ is the slope and the constant is the $y$-intercept. For $y = -3x + 5$, the slope is $-3$. Keep the sign that is attached to the coefficient. Answering with the constant confuses the two parts of the equation.",
      "在 $y = mx + b$ 中，$x$ 的系数是斜率，常数是 $y$ 轴截距。对 $y = -3x + 5$，斜率是 $-3$。要保留系数的符号。答成常数就把方程的两部分弄混了。",
    ),
    hardTip: t(
      "A line written with $x$ and $y$ on the same side must be solved for $y$ first. From $6x + 3y = 9$: $y = -2x + 3$, so the slope is $-2$. The shortcut is $-\\frac{A}{B}$ for $Ax + By = C$. Reading the coefficient of $x$ directly misses both the sign and the division.",
      "$x$ 和 $y$ 在同一边的方程要先解出 $y$。由 $6x + 3y = 9$：$y = -2x + 3$，所以斜率是 $-2$。对 $Ax + By = C$ 的捷径是 $-\\frac{A}{B}$。直接读 $x$ 的系数，符号和除法都漏掉了。",
    ),
  },
  "act-exam-comparing-and-reading-slopes": {
    tip: t(
      "Steepness is about the absolute value of the slope, regardless of direction. So $y = -5x$ is steeper than $y = 2x + 7$, since $5 > 2$. The constant term moves a line without changing its steepness. Picking the greatest signed slope overlooks a steep downhill line, which is the trap.",
      "陡峭程度看斜率的绝对值，与方向无关。所以 $y = -5x$ 比 $y = 2x + 7$ 更陡，因为 $5 > 2$。常数项只移动直线，不改变陡峭程度。只选带符号的最大斜率，会忽略陡峭的下降直线，这就是陷阱。",
    ),
    hardTip: t(
      "Parallel lines have equal slopes, while perpendicular slopes are negative reciprocals, multiplying to $-1$. For $y = 2x + 1$: the parallel slope is $2$, and the perpendicular slope is $-\\frac{1}{2}$. Their sum is $\\frac{3}{2}$. Taking only the negative, or only the reciprocal, gives the wrong perpendicular slope.",
      "平行线斜率相等，垂直线的斜率是负倒数，乘积为 $-1$。对 $y = 2x + 1$：平行线斜率是 $2$，垂直线斜率是 $-\\frac{1}{2}$。两者之和是 $\\frac{3}{2}$。只取负号或只取倒数，垂直线的斜率都不对。",
    ),
  },
  "act-exam-finding-a-point-on-a-line": {
    tip: t(
      "A point lies on a line exactly when its coordinates satisfy the equation. Test each option: substitute the $x$-value and compare the result with the $y$-value. On $y = 3x + 1$, the point $(2, 7)$ works, because $3(2) + 1 = 7$. Do not swap the coordinates when you substitute.",
      "点在直线上，当且仅当它的坐标满足方程。逐个检验选项：代入 $x$ 值，把结果与 $y$ 值比较。在 $y = 3x + 1$ 上，点 $(2, 7)$ 成立，因为 $3(2) + 1 = 7$。代入时不要把坐标对调。",
    ),
    hardTip: t(
      "From a point and slope, walk along the line: multiply the slope by the change in $x$ and add it to the known $y$. Through $(3, 10)$ with slope $2$, moving right $2$ raises $y$ by $4$, so $(5, 14)$ is on the line. Moving left lowers $y$ when the slope is positive.",
      "由一点和斜率出发，沿直线移动：用斜率乘 $x$ 的变化量，再加到已知的 $y$ 上。过 $(3, 10)$、斜率 $2$，向右移 $2$ 使 $y$ 升高 $4$，所以 $(5, 14)$ 在直线上。斜率为正时，向左移会使 $y$ 降低。",
    ),
  },
  "act-exam-placing-figures-in-the-coordinate-plane": {
    tip: t(
      "A rectangle with horizontal and vertical sides uses just two $x$-values and two $y$-values, each appearing twice. So the missing corner takes whichever value appears only once in each list. From $(1, 2)$, $(6, 2)$ and $(6, 5)$, the fourth vertex is $(1, 5)$. Sketch it to avoid swapping.",
      "边平行于坐标轴的矩形，只用到两个 $x$ 值和两个 $y$ 值，各出现两次。所以缺的顶点取每个列表中只出现一次的值。由 $(1, 2)$、$(6, 2)$、$(6, 5)$，第四个顶点是 $(1, 5)$。画个草图可避免对调。",
    ),
    hardTip: t(
      "Side lengths in the plane come from subtracting coordinates along each side; distance is always positive. Then multiply. For vertices at $x = -1$ and $4$, and $y = 2$ and $5$: the sides are $5$ and $3$, so the area is $15$. Using coordinates directly as lengths fails with negative values.",
      "平面上的边长由沿边的坐标相减得到；距离总是正的。然后相乘。顶点在 $x = -1$ 和 $4$、$y = 2$ 和 $5$ 处：边长为 $5$ 和 $3$，面积是 $15$。直接把坐标当作长度，遇到负数就不行了。",
    ),
  },
  "act-exam-locating-points-in-the-coordinate-plane": {
    tip: t(
      "Quadrants are numbered counterclockwise from the upper right: I has $(+, +)$, II has $(-, +)$, III has $(-, -)$ and IV has $(+, -)$. So $(-2, 3)$ lies in Quadrant II. Check each coordinate's sign. Numbering them clockwise is the error that swaps II and IV.",
      "象限从右上方开始按逆时针编号：第一象限 $(+, +)$，第二象限 $(-, +)$，第三象限 $(-, -)$，第四象限 $(+, -)$。所以 $(-2, 3)$ 在第二象限。检查每个坐标的符号。按顺时针编号的错误会把第二、第四象限对调。",
    ),
    hardTip: t(
      "A horizontal move changes only $x$: right adds and left subtracts. A vertical move changes only $y$: up adds and down subtracts. From $(2, -1)$, going $5$ left and $4$ up reaches $(-3, 3)$. Applying a left move to $y$ is the slip, and values may cross zero.",
      "水平移动只改变 $x$：向右加，向左减。竖直移动只改变 $y$：向上加，向下减。从 $(2, -1)$ 向左 $5$、向上 $4$，到达 $(-3, 3)$。把向左的移动用到 $y$ 上是疏漏，数值也可能越过零。",
    ),
  },
  "act-exam-finding-a-dimension-from-volume": {
    tip: t(
      "Since volume is length times width times height, divide the volume by the product of the known dimensions. A volume of $72$ with length $6$ and width $3$ gives a height of $4$. Dividing by just one of the two, or subtracting them, leaves a wrong value.",
      "体积等于长乘宽乘高，所以用体积除以已知尺寸的乘积。体积 $72$、长 $6$、宽 $3$，高是 $4$。只除以其中一个，或者把它们减去，都得到错误的值。",
    ),
    hardTip: t(
      "A cylinder's volume is $\\pi r^2 h$, so divide by $\\pi r^2$ to get the height. With volume $45\\pi$ and radius $3$: $h = \\frac{45\\pi}{9\\pi} = 5$. Remember to square the radius, since dividing by $3\\pi$ gives a value three times too large. The factors of $\\pi$ cancel.",
      "圆柱的体积是 $\\pi r^2 h$，所以除以 $\\pi r^2$ 得到高。体积 $45\\pi$、半径 $3$：$h = \\frac{45\\pi}{9\\pi} = 5$。记得把半径平方，除以 $3\\pi$ 得到的值大了三倍。$\\pi$ 可以约去。",
    ),
  },
  "act-exam-converting-volume-in-context": {
    tip: t(
      "A cubic yard is $3 \\cdot 3 \\cdot 3 = 27$ cubic feet, because each dimension converts. So find the volume in cubic feet and divide by $27$. A $6$ by $3$ by $9$ foot space is $162$ cubic feet, or $6$ cubic yards. Dividing by $3$ is the trap; it handles only one dimension.",
      "$1$ 立方码等于 $3 \\cdot 3 \\cdot 3 = 27$ 立方英尺，因为每个方向都要换算。所以先求立方英尺数，再除以 $27$。$6$ 乘 $3$ 乘 $9$ 英尺的空间是 $162$ 立方英尺，即 $6$ 立方码。除以 $3$ 是陷阱，它只换算了一个方向。",
    ),
    hardTip: t(
      "Convert to the unit in the price, then multiply. A trench of $6$ cubic yards contains $6(27) = 162$ cubic feet, so at $5$ dollars a cubic foot it costs $810$ dollars. Going from a larger unit to a smaller one multiplies. Pricing cubic yards directly misses the factor of $27$.",
      "先换算成价格所用的单位，再相乘。$6$ 立方码的沟渠有 $6(27) = 162$ 立方英尺，每立方英尺 $5$ 美元，共 $810$ 美元。从大单位换到小单位要做乘法。直接按立方码计价就漏了因数 $27$。",
    ),
  },
  "act-exam-packing-congruent-solids": {
    tip: t(
      "Divide each box edge by the cube's edge to find how many fit in each direction, and multiply the three counts. Cubes of edge $3$ in a $9$ by $6$ by $12$ box fit $3$, $2$ and $4$ along the edges, so $24$ in all. Forgetting a direction leaves the count too small.",
      "用箱子的每条棱除以小方块的棱，求出每个方向能放几个，再把三个数相乘。棱长 $3$ 的方块放入 $9$ 乘 $6$ 乘 $12$ 的箱子，沿棱分别放 $3$、$2$、$4$ 个，共 $24$ 个。漏掉一个方向，数量就太少了。",
    ),
    hardTip: t(
      "If an edge does not divide exactly, round down in that direction, because a partial cube cannot be packed. Cubes of edge $3$ in a $10$ by $7$ by $12$ box fit $3$, $2$ and $4$, so $24$. Dividing the volumes gives about $31$, which is too high because the extra space is wasted.",
      "如果棱不能整除，该方向要向下取整，因为不能放半个方块。棱长 $3$ 的方块放入 $10$ 乘 $7$ 乘 $12$ 的箱子，放 $3$、$2$、$4$ 个，共 $24$ 个。用体积相除约得 $31$，这太多了，因为多余的空间被浪费了。",
    ),
  },
  "act-exam-identifying-features-of-a-solid": {
    tip: t(
      "For a prism whose bases have $n$ sides, count parts by the structure: faces are $n + 2$, edges are $3n$ and vertices are $2n$. A pentagonal prism has $7$ faces, $15$ edges and $10$ vertices. Counting only one base's edges is the usual slip, since each base and the joins all contribute.",
      "底面为 $n$ 边形的棱柱，按结构来数：面有 $n + 2$ 个，棱有 $3n$ 条，顶点有 $2n$ 个。五棱柱有 $7$ 个面、$15$ 条棱、$10$ 个顶点。只数一个底面的棱是常见的疏漏，因为两个底面和连接它们的棱都要算。",
    ),
    hardTip: t(
      "A pyramid has one base and meets at one apex. With an $n$-sided base it has $n + 1$ faces (the base and $n$ triangles), $2n$ edges ($n$ around the base and $n$ up to the apex) and $n + 1$ vertices. A square pyramid has $5$ faces, $8$ edges and $5$ vertices. Using the prism counts is the usual error.",
      "棱锥只有一个底面，并汇聚于一个顶点。底面是 $n$ 边形时，它有 $n + 1$ 个面（底面和 $n$ 个三角形）、$2n$ 条棱（底面一圈 $n$ 条，通向顶点 $n$ 条）和 $n + 1$ 个顶点。四棱锥有 $5$ 个面、$8$ 条棱和 $5$ 个顶点。常见错误是套用棱柱的数目。",
    ),
  },
  "act-exam-writing-ellipse-equations": {
    tip: t(
      "An ellipse centred at $(h, k)$ is $\\frac{(x - h)^2}{a^2} + \\frac{(y - k)^2}{b^2} = 1$, where $a$ and $b$ are the horizontal and vertical reaches. For centre $(2, -1)$ with reaches $5$ and $3$: $\\frac{(x - 2)^2}{25} + \\frac{(y + 1)^2}{9} = 1$. Square the reaches, and flip the signs of the centre.",
      "圆心在 $(h, k)$ 的椭圆是 $\\frac{(x - h)^2}{a^2} + \\frac{(y - k)^2}{b^2} = 1$，$a$ 和 $b$ 是水平和竖直方向的延伸长度。中心 $(2, -1)$、延伸 $5$ 和 $3$：$\\frac{(x - 2)^2}{25} + \\frac{(y + 1)^2}{9} = 1$。延伸长度要平方，中心的符号要反过来。",
    ),
    hardTip: t(
      "The centre is the midpoint of the vertices. The distance from it to a vertex is $a$, and to a co-vertex is $b$. For vertices $(-4, 1)$ and $(6, 1)$ with co-vertex $(1, 4)$: the centre is $(1, 1)$, $a = 5$ and $b = 3$. Using the whole distance between vertices as $a$ is the trap.",
      "中心是两顶点的中点。它到顶点的距离是 $a$，到短轴端点的距离是 $b$。顶点 $(-4, 1)$ 和 $(6, 1)$、短轴端点 $(1, 4)$：中心 $(1, 1)$，$a = 5$，$b = 3$。把两顶点之间的整段距离当作 $a$ 就是陷阱。",
    ),
  },
  "act-exam-finding-features-of-an-ellipse": {
    tip: t(
      "The centre comes from the numbers subtracted in the squares, so reverse the signs in the parentheses. For $\\frac{(x - 3)^2}{25} + \\frac{(y + 2)^2}{9} = 1$, the centre is $(3, -2)$. The denominators give the size, not the position, so they do not belong in this answer.",
      "中心来自平方中减去的数，所以把括号里的符号反过来。对 $\\frac{(x - 3)^2}{25} + \\frac{(y + 2)^2}{9} = 1$，中心是 $(3, -2)$。分母决定大小，不决定位置，所以不属于这个答案。",
    ),
    hardTip: t(
      "For an ellipse, the distance from centre to focus satisfies $c^2 = a^2 - b^2$, the larger denominator minus the smaller. For denominators $25$ and $9$: $c = 4$, so the foci are $8$ apart. Remember to double $c$. Adding the denominators applies to a hyperbola.",
      "椭圆中心到焦点的距离满足 $c^2 = a^2 - b^2$，即较大的分母减较小的分母。分母为 $25$ 和 $9$ 时：$c = 4$，所以两焦点相距 $8$。记得把 $c$ 加倍。把分母相加适用于双曲线。",
    ),
  },
  "act-exam-working-with-hyperbolas": {
    tip: t(
      "A hyperbola's vertices lie along the axis of the positive term, at a distance of the root of that term's denominator. For $\\frac{y^2}{9} - \\frac{x^2}{16} = 1$, the positive term is in $y$, so the vertices are $(0, \\pm 3)$. Assuming that the larger denominator decides, as in an ellipse, is wrong here.",
      "双曲线的顶点在正项所对应的轴上，距离是这一项分母的平方根。对 $\\frac{y^2}{9} - \\frac{x^2}{16} = 1$，正项含 $y$，所以顶点是 $(0, \\pm 3)$。像椭圆那样以为较大的分母起决定作用，在这里是错的。",
    ),
    hardTip: t(
      "For $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$, the asymptotes are $y = \\pm\\frac{b}{a}x$: the square root of the $y$ denominator over that of the $x$ denominator. For $\\frac{x^2}{9} - \\frac{y^2}{16} = 1$, the slopes are $\\pm\\frac{4}{3}$. Forgetting the roots gives $\\frac{16}{9}$, and inverting gives $\\frac{3}{4}$.",
      "对 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$，渐近线是 $y = \\pm\\frac{b}{a}x$：$y$ 项分母的平方根除以 $x$ 项分母的平方根。对 $\\frac{x^2}{9} - \\frac{y^2}{16} = 1$，斜率是 $\\pm\\frac{4}{3}$。忘了开方得 $\\frac{16}{9}$，颠倒则得 $\\frac{3}{4}$。",
    ),
  },
  "act-exam-analyzing-intersections-of-conics": {
    tip: t(
      "A circle $x^2 + y^2 = r^2$ reaches only as high as $y = r$. Compare a horizontal line with that height: above means no common point, equal means one and below means two. For $x^2 + y^2 = 25$, the line $y = 7$ misses, while $y = 5$ touches once. Take the root of the right side first.",
      "圆 $x^2 + y^2 = r^2$ 最高只到 $y = r$。把水平线与这个高度比较：高于它没有公共点，相等有一个，低于它有两个。对 $x^2 + y^2 = 25$，直线 $y = 7$ 不相交，而 $y = 5$ 相切一次。先对右边开方。",
    ),
    hardTip: t(
      "Substitute the line's value into the circle to find the $x$-values, which come as a positive and negative pair. The distance between them is twice the positive root. For $x^2 + y^2 = 100$ and $y = 6$: $x^2 = 64$, so $x = \\pm 8$ and the distance is $16$. Giving just the root stops halfway.",
      "把直线的值代入圆，求出 $x$ 值，它们是一正一负的一对。两者之间的距离是正根的两倍。对 $x^2 + y^2 = 100$ 和 $y = 6$：$x^2 = 64$，所以 $x = \\pm 8$，距离是 $16$。只给出这个根就只走了一半。",
    ),
  },
  "act-exam-simplifying-integer-powers": {
    tip: t(
      "When multiplying powers of the same base, keep the base and add the exponents: $a^3 \\cdot a^4 = a^7$. Multiplying the exponents, as $a^{12}$, is the classic error. Writing each power out as repeated factors shows why adding is right.",
      "同底数幂相乘，底数不变，指数相加：$a^3 \\cdot a^4 = a^7$。把指数相乘得 $a^{12}$ 是典型错误。把每个幂写成重复的因数，就能看出为什么要相加。",
    ),
    hardTip: t(
      "A power of a product applies to every factor, and a power of a power multiplies exponents. So $(3a^4)^2 = 9a^8$. The coefficient is raised too, not merely doubled. Leaving the coefficient alone gives $3a^8$, and adding exponents gives $a^6$; both are wrong options.",
      "积的乘方作用于每个因数，幂的乘方把指数相乘。所以 $(3a^4)^2 = 9a^8$。系数也要乘方，不只是加倍。系数不变得 $3a^8$，指数相加得 $a^6$，都是错误选项。",
    ),
  },
  "act-exam-simplifying-negative-exponents": {
    tip: t(
      "A negative exponent means a reciprocal, not a negative number: $b^{-1} = \\frac{1}{b}$. So $5^{-1} \\cdot 3 = \\frac{3}{5}$. Treating the base as $-5$ gives a negative answer, which is the most frequent error, since the reciprocal of a positive number stays positive.",
      "负指数表示倒数，不是负数：$b^{-1} = \\frac{1}{b}$。所以 $5^{-1} \\cdot 3 = \\frac{3}{5}$。把底数当作 $-5$ 会得到负的答案，这是最常见的错误，因为正数的倒数仍然是正数。",
    ),
    hardTip: t(
      "When dividing powers, subtract the bottom exponent from the top one. If the result is negative, move the power to the denominator. For $\\frac{x^2}{x^7}$: $x^{-5} = \\frac{1}{x^5}$. Subtracting the other way gives $x^5$, which has the power on the wrong side of the fraction.",
      "同底数幂相除，用上面的指数减下面的指数。结果为负时，把这个幂移到分母。对 $\\frac{x^2}{x^7}$：$x^{-5} = \\frac{1}{x^5}$。反过来减得 $x^5$，这个幂就放错了位置。",
    ),
  },
  "act-exam-applying-scientific-notation": {
    tip: t(
      "To multiply numbers in scientific notation, multiply the leading parts and add the powers of ten. So $(3 \\times 10^5)(2 \\times 10^6) = 6 \\times 10^{11}$. Multiplying the exponents gives $10^{30}$, a hugely wrong size. Adjust if the leading part reaches $10$.",
      "科学记数法相乘，把前面的数相乘，$10$ 的指数相加。所以 $(3 \\times 10^5)(2 \\times 10^6) = 6 \\times 10^{11}$。把指数相乘得 $10^{30}$，大得离谱。前面的数达到 $10$ 时要调整。",
    ),
    hardTip: t(
      "How many times one amount is another calls for division: divide the leading parts and subtract the exponents. So $\\frac{8 \\times 10^9}{4 \\times 10^3} = 2 \\times 10^6$. Subtract in the order of the question, top minus bottom. Dividing the exponents gives a very wrong power.",
      "问一个量是另一个量的多少倍，要用除法：前面的数相除，指数相减。所以 $\\frac{8 \\times 10^9}{4 \\times 10^3} = 2 \\times 10^6$。按题目的顺序相减，上减下。把指数相除得到的幂错得很远。",
    ),
  },
  "act-exam-simplifying-rational-exponents": {
    tip: t(
      "A fractional exponent has a root in its denominator and a power in its numerator: $x^{\\frac{a}{b}} = \\sqrt[b]{x^a}$. So $x^{\\frac{2}{3}} = \\sqrt[3]{x^2}$. Placing the numerator as the root's index reverses them, and that swap is the error to avoid.",
      "分数指数的分母表示开方，分子表示乘方：$x^{\\frac{a}{b}} = \\sqrt[b]{x^a}$。所以 $x^{\\frac{2}{3}} = \\sqrt[3]{x^2}$。把分子当作根指数就颠倒了，这种对调是要避免的错误。",
    ),
    hardTip: t(
      "To evaluate, take the root first, which keeps numbers small, then the power. Thus $25^{\\frac{3}{2}} = (\\sqrt{25})^3 = 5^3 = 125$. Multiplying the base by the fraction is not valid, and it gives a value that is far too small. Write the base as a perfect power if needed.",
      "计算时先开方，数字不会变大，再乘方。因此 $25^{\\frac{3}{2}} = (\\sqrt{25})^3 = 5^3 = 125$。用底数乘这个分数是错的，得到的值小得多。需要时可把底数写成完全幂。",
    ),
  },
  "act-exam-evaluating-powers": {
    tip: t(
      "Evaluate each power by itself, then add. So $3^2 + 5^2 = 9 + 25 = 34$. A power means repeated multiplication, so $3^2$ is not $6$. Adding the bases first and then squaring, $(3 + 5)^2$, gives $64$, which is the standard wrong answer.",
      "分别算出每个幂，再相加。所以 $3^2 + 5^2 = 9 + 25 = 34$。幂表示重复相乘，所以 $3^2$ 不是 $6$。先把底数相加再平方，$(3 + 5)^2$ 得 $64$，这是标准的错误答案。",
    ),
    hardTip: t(
      "Reducing a fraction before squaring keeps the numbers small: $\\left(\\frac{6}{15}\\right)^2 = \\left(\\frac{2}{5}\\right)^2 = \\frac{4}{25}$. The square applies to both numerator and denominator. Squaring only the top leaves a value that is too large, and doubling the fraction is not squaring.",
      "平方之前先约分，数字就不会变大：$\\left(\\frac{6}{15}\\right)^2 = \\left(\\frac{2}{5}\\right)^2 = \\frac{4}{25}$。平方同时作用于分子和分母。只把分子平方，值就太大了；把分数加倍也不是平方。",
    ),
  },
  "act-exam-reducing-radical-expressions": {
    tip: t(
      "To simplify a square root, split out the largest perfect square factor, and take its root: $\\sqrt{72} = \\sqrt{36 \\cdot 2} = 6\\sqrt{2}$. Using a smaller square, like $4$, leaves more to simplify. Note that the factor remaining inside must be square free in the final form.",
      "化简平方根时，分离出最大的完全平方因数，再开方：$\\sqrt{72} = \\sqrt{36 \\cdot 2} = 6\\sqrt{2}$。用较小的平方数，如 $4$，还要继续化简。注意最后根号内的因数不能再含平方因数。",
    ),
    hardTip: t(
      "With a variable and a coefficient, take the root of the square factors, including $x^2$ when $x > 0$, then multiply by what stands in front. For $3\\sqrt{18x^2}$: $\\sqrt{18x^2} = 3x\\sqrt{2}$, so the whole is $9x\\sqrt{2}$. Forgetting the outside multiplier gives an answer that is too small.",
      "有变量和系数时，对平方因数开方，$x > 0$ 时包括 $x^2$，再乘前面的数。对 $3\\sqrt{18x^2}$：$\\sqrt{18x^2} = 3x\\sqrt{2}$，所以整体是 $9x\\sqrt{2}$。忘了外面的系数，答案就太小了。",
    ),
  },
  "act-exam-rewriting-radical-sums-and-binomials": {
    tip: t(
      "Roots combine only when the number inside matches, so simplify each first, then add the coefficients. So $\\sqrt{12} + \\sqrt{27} = 2\\sqrt{3} + 3\\sqrt{3} = 5\\sqrt{3}$. Adding the numbers under the root to get $\\sqrt{39}$ is not valid, and it is the option to avoid.",
      "只有根号内的数相同时才能合并，所以先分别化简，再把系数相加。所以 $\\sqrt{12} + \\sqrt{27} = 2\\sqrt{3} + 3\\sqrt{3} = 5\\sqrt{3}$。把根号内的数相加得 $\\sqrt{39}$ 是错的，这是要避开的选项。",
    ),
    hardTip: t(
      "Squaring a sum with a root uses $(a + b)^2 = a^2 + 2ab + b^2$, where the square of $\\sqrt{c}$ is $c$. So $(3 + \\sqrt{5})^2 = 9 + 6\\sqrt{5} + 5 = 14 + 6\\sqrt{5}$. Combine the two whole numbers. Dropping the middle term, as $9 + 5$, is the trap.",
      "含根号的和的平方用 $(a + b)^2 = a^2 + 2ab + b^2$，其中 $\\sqrt{c}$ 的平方是 $c$。所以 $(3 + \\sqrt{5})^2 = 9 + 6\\sqrt{5} + 5 = 14 + 6\\sqrt{5}$。两个整数要合并。漏掉中间项，只写 $9 + 5$，就是陷阱。",
    ),
  },
  "act-exam-estimating-roots": {
    tip: t(
      "To bracket a square root, recall consecutive perfect squares and find the pair around the number. Since $16 < 20 < 25$, the value $\\sqrt{20}$ lies between $4$ and $5$. Keep a list of squares in mind through $15^2$, as these estimates come up without a calculator.",
      "要夹逼平方根，想想连续的完全平方数，找出这个数两侧的一对。因为 $16 < 20 < 25$，所以 $\\sqrt{20}$ 在 $4$ 和 $5$ 之间。要记住到 $15^2$ 的平方数，这类估算不用计算器也常会遇到。",
    ),
    hardTip: t(
      "A cube root is bracketed the same way, but with cubes. Since $4^3 = 64$ and $5^3 = 125$, the value $\\sqrt[3]{100}$ lies between $4$ and $5$. Using squares here, which leads to $\\sqrt{100} = 10$, ignores the index on the root. Cubes grow fast, so try small numbers first.",
      "立方根也用同样的方法夹逼，只是换成立方数。因为 $4^3 = 64$，$5^3 = 125$，所以 $\\sqrt[3]{100}$ 在 $4$ 和 $5$ 之间。这里用平方数得到 $\\sqrt{100} = 10$，就忽略了根指数。立方数增长很快，所以先试小的数。",
    ),
  },
  "act-exam-identifying-characteristics-of-powers": {
    tip: t(
      "For a negative base, an even power is positive and an odd power is negative; a negative coefficient flips the sign again. If $x < 0$: $3x^4$ is positive, $3x^5$ is negative and $-3x^4$ is negative. Check sign rules on an example like $x = -1$ to eliminate options fast.",
      "底数为负时，偶次幂为正，奇次幂为负；负系数再把符号翻转一次。若 $x < 0$：$3x^4$ 为正，$3x^5$ 为负，$-3x^4$ 为负。用 $x = -1$ 这样的例子检验符号规则，可以快速排除选项。",
    ),
    hardTip: t(
      "An exponent sum separates: $a^{x + k} = a^x \\cdot a^k$. So there's no need to solve for $x$; substitute the known power. If $3^x = 5$: $3^{x + 2} = 5 \\cdot 9 = 45$. Adding $2$ to the known value treats the power like a linear expression, which is the trap.",
      "指数的和可以拆开：$a^{x + k} = a^x \\cdot a^k$。所以不必求 $x$，直接代入已知的幂。若 $3^x = 5$：$3^{x + 2} = 5 \\cdot 9 = 45$。把已知值加 $2$，是把幂当成了线性式，这就是陷阱。",
    ),
  },
  "act-exam-solving-exponential-equations": {
    tip: t(
      "If two powers of the same base are equal, their exponents are equal, so drop the base and solve the linear equation. For $3^{4x - 2} = 3^{10}$: $4x - 2 = 10$, so $x = 3$. Do not divide by the base, since it is only the exponents that remain to compare.",
      "同底数的两个幂相等，指数就相等，所以去掉底数解线性方程。对 $3^{4x - 2} = 3^{10}$：$4x - 2 = 10$，所以 $x = 3$。不要除以底数，因为只需比较指数。",
    ),
    hardTip: t(
      "First reduce both sides to one base, combining products by adding exponents. Negative exponents count with their sign. For $9^x = 3^8 \\cdot 3^{-2}$: the left is $3^{2x}$ and the right is $3^6$, so $2x = 6$ and $x = 3$. Not rewriting $9$ as a power of $3$ makes it easy to go wrong.",
      "先把两边化成同一个底数，乘积通过指数相加合并。负指数要带着符号算。对 $9^x = 3^8 \\cdot 3^{-2}$：左边是 $3^{2x}$，右边是 $3^6$，所以 $2x = 6$，$x = 3$。不把 $9$ 改写成 $3$ 的幂就容易出错。",
    ),
  },
  "act-exam-finding-a-greatest-common-factor": {
    tip: t(
      "Factor both numbers into primes, then multiply the primes they share, each to its smaller power. Since $20 = 2^2 \\cdot 5$ and $70 = 2 \\cdot 5 \\cdot 7$, the greatest common factor is $2 \\cdot 5 = 10$. Stopping at a smaller shared factor, or taking a multiple of the two, gives wrong options.",
      "把两个数分解成质因数，再把共有的质因数相乘，每个取较小的次数。因为 $20 = 2^2 \\cdot 5$，$70 = 2 \\cdot 5 \\cdot 7$，最大公因数是 $2 \\cdot 5 = 10$。停在较小的公因数上，或者取两数的倍数，都是错误选项。",
    ),
    hardTip: t(
      "Splitting items into identical groups with nothing left means the group count divides each amount, so the greatest count is the greatest common factor. With $24$ cards and $36$ stickers, $12$ kits work, each with $2$ cards and $3$ stickers. A least common multiple, by contrast, is too large here.",
      "把物品分成相同的若干组且没有剩余，说明组数能整除每个数量，所以最多的组数就是最大公因数。$24$ 张卡片和 $36$ 张贴纸，可分成 $12$ 份，每份 $2$ 张卡片和 $3$ 张贴纸。相比之下，最小公倍数在这里太大了。",
    ),
  },
  "act-exam-applying-divisibility-conditions": {
    tip: t(
      "A number is divisible by $3$ exactly when the sum of its digits is. For $87$: $8 + 7 = 15$, a multiple of $3$, so $87 = 3(29)$. Rules also exist for others: even for $2$, and ending in $0$ or $5$ for $5$. Looking only at the last digit does not work for $3$.",
      "一个数能被 $3$ 整除，当且仅当它的数字和能被 $3$ 整除。对 $87$：$8 + 7 = 15$，是 $3$ 的倍数，所以 $87 = 3(29)$。其他数也有规则：偶数能被 $2$ 整除，末位是 $0$ 或 $5$ 能被 $5$ 整除。只看末位对 $3$ 不适用。",
    ),
    hardTip: t(
      "For a missing digit, add the known digits and find the smallest digit that brings the total to a multiple of $3$. For the number $41d$: $4 + 1 = 5$, and $d = 1$ makes $6$. Any digit from $0$ to $9$ counts as an option, so start checking at $0$.",
      "数字缺失时，把已知数字相加，找出使总和成为 $3$ 的倍数的最小数字。对 $41d$：$4 + 1 = 5$，$d = 1$ 时为 $6$。$0$ 到 $9$ 的任何数字都可以，所以从 $0$ 开始检查。",
    ),
  },
  "act-exam-finding-a-least-common-multiple": {
    tip: t(
      "The least common multiple is the smallest number both divide. List multiples of the larger until the smaller divides, or use product over greatest common factor. For $6$ and $15$: $\\frac{90}{3} = 30$. The full product is a common multiple but not always the least, so it is a tempting wrong choice.",
      "最小公倍数是两个数都能整除的最小的数。列出较大数的倍数，直到较小数能整除，或者用乘积除以最大公因数。$6$ 和 $15$：$\\frac{90}{3} = 30$。两数之积是公倍数，但不一定最小，所以是诱人的错误选项。",
    ),
    hardTip: t(
      "Events that repeat at fixed intervals coincide at common multiples, and the next meeting is the least of these. Buses every $12$ and $18$ minutes next leave together after $36$ minutes. Adding the intervals, or using the common factor, describes nothing useful. Check that both intervals divide the answer.",
      "按固定间隔重复的事件在公倍数处重合，下一次重合就是其中最小的。每 $12$ 分钟和每 $18$ 分钟一班的公交车，$36$ 分钟后再次同时发车。把间隔相加或用公因数都没有意义。检查两个间隔都能整除答案。",
    ),
  },
  "act-exam-using-remainders": {
    tip: t(
      "Find the largest multiple of the divisor that fits, then subtract. The remainder must be less than the divisor. For $29$ divided by $4$: $29 = 4(7) + 1$, so the remainder is $1$. The quotient $7$, or the digits after a decimal point, are not the remainder.",
      "找出不超过这个数的除数的最大倍数，再相减。余数必须小于除数。$29$ 除以 $4$：$29 = 4(7) + 1$，所以余数是 $1$。商 $7$ 或者小数点后的数字，都不是余数。",
    ),
    hardTip: t(
      "Adding a multiple of the divisor leaves the remainder unchanged, so only the part of the addition not divisible matters. If $n$ leaves $3$ on division by $5$, then $n + 15$ also leaves $3$. But $n + 7$ leaves $0$, since $3 + 7 = 10$. Try a sample number such as $n = 8$ to confirm.",
      "加上除数的倍数不改变余数，所以只有加数中不能被整除的部分才起作用。若 $n$ 除以 $5$ 余 $3$，则 $n + 15$ 也余 $3$。但 $n + 7$ 余 $0$，因为 $3 + 7 = 10$。可以用 $n = 8$ 这样的数来验证。",
    ),
  },
  "act-exam-finding-a-digit-in-a-repeating-decimal": {
    tip: t(
      "The digits repeat in a cycle, so divide the place number by the cycle length and use the remainder. In $0.\\overline{247}$, the $20$th place has remainder $2$, which gives the second digit, $4$. A remainder of $0$ means the last digit of the cycle, so the $30$th place holds $7$.",
      "数字按循环节重复，所以用位数除以循环节长度，再看余数。在 $0.\\overline{247}$ 中，第 $20$ 位余 $2$，对应第二个数字 $4$。余数为 $0$ 表示循环节的最后一个数字，所以第 $30$ 位是 $7$。",
    ),
    hardTip: t(
      "A longer cycle changes only the divisor: count the repeating digits and divide by that number. In $0.\\overline{2935}$, the cycle has length $4$; since $22 = 4(5) + 2$, the $22$nd place is the second digit, $9$. Reading the quotient, or the digit under it, instead of the remainder, is the slip.",
      "循环节更长时，只是除数变了：数出循环的数字个数，再除以它。在 $0.\\overline{2935}$ 中，循环节长度是 $4$；因为 $22 = 4(5) + 2$，第 $22$ 位是第二个数字 $9$。用商或商所对应的数字，而不是余数，就错了。",
    ),
  },
  "act-exam-comparing-repeating-decimals": {
    tip: t(
      "A single repeating digit $d$ equals $\\frac{d}{9}$, so split off the whole part and add it. So $2.\\overline{7} = 2 + \\frac{7}{9} = \\frac{25}{9}$. Writing the digit over $10$ describes a terminating decimal, which is a value slightly too small. Convert to one fraction and reduce.",
      "单个循环数字 $d$ 等于 $\\frac{d}{9}$，所以把整数部分分开，再加上去。所以 $2.\\overline{7} = 2 + \\frac{7}{9} = \\frac{25}{9}$。把这个数字写在 $10$ 上表示的是有限小数，值略小。化成一个分数并约分。",
    ),
    hardTip: t(
      "To compare repeating decimals with others, write out enough digits and compare place by place. $0.\\overline{45} = 0.4545\\ldots$ is greater than $0.45$ and than $0.451$, because they already differ at the third or fourth digit. The bar means the digits never stop, so $0.\\overline{45}$ is not the same as $0.45$.",
      "比较循环小数和其他数时，多写几位数字，再逐位比较。$0.\\overline{45} = 0.4545\\ldots$ 大于 $0.45$，也大于 $0.451$，因为它们在第三或第四位就分出了大小。横线表示数字永不停止，所以 $0.\\overline{45}$ 和 $0.45$ 不是同一个数。",
    ),
  },
  "act-exam-using-prime-factorizations": {
    tip: t(
      "Divide by the smallest primes repeatedly until only $1$ remains, then collect repeated primes as powers. For $360$: dividing by $2$ three times, by $3$ twice and by $5$ once gives $2^3 \\cdot 3^2 \\cdot 5$. Multiply the result back to check it. Non-prime factors like $4$ or $9$ cannot be left in the answer.",
      "反复除以最小的质数，直到只剩 $1$，再把重复的质数写成幂。对 $360$：除以 $2$ 三次，除以 $3$ 两次，除以 $5$ 一次，得 $2^3 \\cdot 3^2 \\cdot 5$。把结果乘回去验算。答案中不能留下 $4$ 或 $9$ 这样的合数因数。",
    ),
    hardTip: t(
      "From a factorization, the number of positive factors is the product of each exponent plus one, because each prime's power can range from $0$ up to its exponent. For $2^2 \\cdot 3^2 \\cdot 7$: $(3)(3)(2) = 18$. Adding the exponents, or skipping the plus one, undercounts the factors.",
      "由质因数分解求正因数的个数，等于每个指数加一后的乘积，因为每个质数的次数可以从 $0$ 取到它的指数。对 $2^2 \\cdot 3^2 \\cdot 7$：$(3)(3)(2) = 18$。把指数相加，或者不加一，都会数少。",
    ),
  },
  "act-exam-identifying-prime-numbers": {
    tip: t(
      "A prime has exactly two factors, $1$ and itself. Test each option by $2$, $3$, $5$ and $7$. Odd numbers can look prime without being so: $51 = 3(17)$ and $57 = 3(19)$. Use the digit sum to catch the multiples of $3$, and remember that $1$ itself is not prime.",
      "质数恰好有两个因数：$1$ 和它本身。用 $2$、$3$、$5$、$7$ 检验每个选项。奇数可能看起来像质数但其实不是：$51 = 3(17)$，$57 = 3(19)$。用数字和发现 $3$ 的倍数；另外记住 $1$ 不是质数。",
    ),
    hardTip: t(
      "To count primes in a range, cross out evens and multiples of $3$, $5$ and $7$, testing only primes up to the square root of the number. From $20$ through $30$, only $23$ and $29$ survive, for a count of $2$. Include both endpoints when the range says through, and do not count odd composite numbers.",
      "要数一个范围内的质数，划掉偶数和 $3$、$5$、$7$ 的倍数，只需用不超过平方根的质数检验。从 $20$ 到 $30$，只有 $23$ 和 $29$ 留下，共 $2$ 个。范围包含端点时两端都要算，也不要把奇合数算进去。",
    ),
  },
  "act-exam-determining-parity": {
    tip: t(
      "Know the rules: odd plus odd is even, odd plus even is odd, and any product involving an even is even. With $n$ odd, $3n$ is odd, so $3n + 1$ is even and $3n + 2$ is odd. Substitute $n = 1$ to test, though a rule argument shows the answer holds for every odd $n$.",
      "要记住规则：奇数加奇数是偶数，奇数加偶数是奇数，只要有偶数因数，积就是偶数。$n$ 为奇数时，$3n$ 是奇数，所以 $3n + 1$ 是偶数，$3n + 2$ 是奇数。可以代入 $n = 1$ 检验，但用规则推理才能说明答案对每个奇数 $n$ 都成立。",
    ),
    hardTip: t(
      "With an even $m$ and an odd $n$, handle each term by the rules, then combine. A square keeps the parity of its base, so $n^2$ is odd. Thus $m + 3n^2$ is even plus odd, which is odd, while $mn$ and $5m$ are even. Test with $m = 2$ and $n = 1$ to confirm.",
      "$m$ 为偶数、$n$ 为奇数时，按规则逐项处理，再合并。平方不改变底数的奇偶性，所以 $n^2$ 是奇数。因此 $m + 3n^2$ 是偶数加奇数，为奇数，而 $mn$ 和 $5m$ 是偶数。用 $m = 2$，$n = 1$ 验证。",
    ),
  },
  "act-exam-identifying-irrational-numbers": {
    tip: t(
      "A root is rational when the number inside is a perfect square, or a perfect cube for a cube root. Otherwise it is irrational. So $\\sqrt{16}$ and $\\sqrt[3]{8}$ are whole numbers, $\\frac{3}{4}$ is rational, and $\\sqrt{12}$ is irrational. A fraction is always rational, however unusual it looks.",
      "根号内是完全平方数时，平方根是有理数；立方根则要是完全立方数。否则是无理数。所以 $\\sqrt{16}$ 和 $\\sqrt[3]{8}$ 是整数，$\\frac{3}{4}$ 是有理数，而 $\\sqrt{12}$ 是无理数。分数总是有理数，不管看起来多么特别。",
    ),
    hardTip: t(
      "A product of two irrational roots can be rational when their product under one root is a perfect square. So $\\sqrt{3} \\cdot \\sqrt{12} = \\sqrt{36} = 6$. But $\\sqrt{3} + \\sqrt{12} = 3\\sqrt{3}$ stays irrational, as does a rational number added to or multiplying a root. Simplify each option to check.",
      "两个无理根的积，当合并到一个根号下是完全平方数时，可以是有理数。所以 $\\sqrt{3} \\cdot \\sqrt{12} = \\sqrt{36} = 6$。但 $\\sqrt{3} + \\sqrt{12} = 3\\sqrt{3}$ 仍是无理数；有理数与根式相加或相乘也一样。化简每个选项来检验。",
    ),
  },
  "act-exam-using-properties-of-consecutive-integers": {
    tip: t(
      "Three consecutive integers average to the middle one, so divide the sum by $3$, then read off what is asked. A sum of $45$ gives a middle of $15$ and a greatest of $16$. Answering with the middle is the usual error. You may also use $x + (x + 1) + (x + 2)$.",
      "三个连续整数的平均数就是中间那个，所以用和除以 $3$，再读出所问的数。和为 $45$ 时，中间是 $15$，最大是 $16$。答成中间数是常见错误。也可以用 $x + (x + 1) + (x + 2)$。",
    ),
    hardTip: t(
      "Consecutive even integers step by $2$, so name them $x$, $x + 2$, $x + 4$ and $x + 6$. Their sum is $4x + 12$. If the sum is $52$, then $4x = 40$ and the least is $10$. Stepping by $1$, or naming the middle as an integer, misleads here, since four terms have no middle one.",
      "连续偶数每次增加 $2$，所以设为 $x$、$x + 2$、$x + 4$、$x + 6$。它们的和是 $4x + 12$。和为 $52$ 时，$4x = 40$，最小的是 $10$。每次增加 $1$，或者把中间当作一个整数，在这里都会出错，因为四项没有中间项。",
    ),
  },
  "act-exam-identifying-true-statements-about-integers": {
    tip: t(
      "When two different positive numbers have a fixed sum, the larger exceeds half the sum, and the smaller is below it. So if $x > y$ and $x + y = 41$, then $x > 20$. Statements about exact values may fail, so test each option with a pair like $x = 40$ and $y = 1$.",
      "两个不同的正数和固定时，较大的数超过和的一半，较小的数低于它。所以若 $x > y$，$x + y = 41$，则 $x > 20$。关于确切值的说法可能不成立，所以用 $x = 40$，$y = 1$ 这样的一对来检验每个选项。",
    ),
    hardTip: t(
      "A number divisible by two others is a multiple of their least common multiple, and it must be divisible by that. If $n$ is divisible by $4$ and $6$, it is a multiple of $12$. It need not be $12$ itself, and it need not be divisible by $24$, as $n = 12$ shows. The plain product is too strong.",
      "能被两个数整除的数，是它们最小公倍数的倍数，所以一定能被它整除。若 $n$ 能被 $4$ 和 $6$ 整除，它就是 $12$ 的倍数。它不一定就是 $12$，也不一定能被 $24$ 整除，$n = 12$ 就是例子。两数之积这个条件太强了。",
    ),
  },
  "act-exam-simplifying-expressions-with-the-imaginary-unit": {
    tip: t(
      "The powers of $i$ cycle through $i$, $-1$, $-i$ and $1$, so only the remainder on division by $4$ matters. For $i^{23}$: the remainder is $3$, so $i^{23} = -i$. A remainder of $0$ gives $1$. Dividing the exponent to get a smaller power, or multiplying it, is not valid.",
      "$i$ 的幂按 $i$、$-1$、$-i$、$1$ 循环，所以只有除以 $4$ 的余数起作用。对 $i^{23}$：余数是 $3$，所以 $i^{23} = -i$。余数为 $0$ 时得 $1$。把指数除一下得到更小的幂，或者把它相乘，都是错的。",
    ),
    hardTip: t(
      "Replace each power of $i$ with its real or imaginary value, then combine like a normal number. With $i^2 = -1$ and $i^4 = 1$: $3i^2 + 5i^4 = -3 + 5 = 2$. Treating them as like terms in a variable, such as adding the coefficients to $8$, ignores what these powers equal.",
      "把 $i$ 的每个幂换成它的实数或虚数值，再像普通数一样合并。由 $i^2 = -1$，$i^4 = 1$：$3i^2 + 5i^4 = -3 + 5 = 2$。把它们当作变量的同类项，把系数加成 $8$，就忽略了这些幂的值。",
    ),
  },
  "act-exam-computing-with-complex-numbers": {
    tip: t(
      "A complex number has a real part and an imaginary part, and these combine separately, like terms in a polynomial. So $(2 + 5i) + (4 - i) = 6 + 4i$. A real number and an imaginary number do not merge into a single term, so $6 + 4i$ cannot become $10i$.",
      "复数有实部和虚部，它们分别合并，就像多项式中的同类项。所以 $(2 + 5i) + (4 - i) = 6 + 4i$。实数和虚数不能合并成一项，所以 $6 + 4i$ 不能变成 $10i$。",
    ),
    hardTip: t(
      "Distribute any factor first, then subtract the whole second number, which flips both its signs. So $3(1 + 2i) - (4 - i) = 3 + 6i - 4 + i = -1 + 7i$. Subtracting only the real part is the common trap, and it gives the imaginary term the wrong sign.",
      "先分配系数，再减去整个第二个数，它的两个符号都要变。所以 $3(1 + 2i) - (4 - i) = 3 + 6i - 4 + i = -1 + 7i$。只减实部是常见的陷阱，虚部的符号就错了。",
    ),
  },
  "act-exam-multiplying-complex-numbers": {
    tip: t(
      "Distribute the imaginary factor over both terms, then replace $i^2$ with $-1$, and write the real part first. So $2i(5 + 4i) = 10i + 8i^2 = -8 + 10i$. Keeping $8i^2$ as if it were positive gives a wrong sign. The final form should contain no power of $i$ above one.",
      "把含 $i$ 的因数分配到两项，再把 $i^2$ 换成 $-1$，实部写在前面。所以 $2i(5 + 4i) = 10i + 8i^2 = -8 + 10i$。把 $8i^2$ 当作正数，符号就错了。最终形式不应含 $i$ 的高次幂。",
    ),
    hardTip: t(
      "Two complex numbers multiply like binomials, with four products. The term with $i^2$ turns real and joins the first product. So $(2 + i)(3 + 2i) = 6 + 4i + 3i + 2i^2 = 4 + 7i$. Multiplying only the real parts together and the imaginary parts together misses the middle terms.",
      "两个复数像二项式一样相乘，有四个乘积。含 $i^2$ 的项变成实数，与第一个乘积合并。所以 $(2 + i)(3 + 2i) = 6 + 4i + 3i + 2i^2 = 4 + 7i$。只把实部相乘、虚部相乘，就漏掉了中间项。",
    ),
  },
  "act-exam-using-complex-conjugates": {
    tip: t(
      "The conjugate of $a + bi$ is $a - bi$: the real part stays and the imaginary part changes sign. So the conjugate of $3 - 2i$ is $3 + 2i$. Changing the real part's sign, or both signs, gives the negative of the number or a different number, not the conjugate.",
      "$a + bi$ 的共轭是 $a - bi$：实部不变，虚部变号。所以 $3 - 2i$ 的共轭是 $3 + 2i$。改变实部的符号，或者两个符号都变，得到的是这个数的相反数或另一个数，不是共轭。",
    ),
    hardTip: t(
      "A number times its conjugate is a real number: $(a + bi)(a - bi) = a^2 + b^2$. The middle terms cancel, and $-b^2i^2$ becomes $+b^2$. So $(3 + 2i)(3 - 2i) = 9 + 4 = 13$. Getting $a^2 - b^2$ is the trap, carried over from the real difference of squares.",
      "一个数乘它的共轭是实数：$(a + bi)(a - bi) = a^2 + b^2$。中间项抵消，$-b^2i^2$ 变成 $+b^2$。所以 $(3 + 2i)(3 - 2i) = 9 + 4 = 13$。得到 $a^2 - b^2$ 就是陷阱，这是从实数的平方差公式带来的。",
    ),
  },
  "act-exam-dividing-complex-numbers": {
    tip: t(
      "Dividing by a real number divides each part separately, since it distributes over the sum. So $\\frac{12 + 9i}{3} = 4 + 3i$. Dividing only the real part leaves the imaginary part too large. No conjugate is needed when the denominator has no imaginary part.",
      "除以实数时，每部分分别相除，因为除法对和有分配律。所以 $\\frac{12 + 9i}{3} = 4 + 3i$。只除实部，虚部就太大了。分母没有虚部时不需要共轭。",
    ),
    hardTip: t(
      "To divide by a complex number, multiply the top and bottom by the denominator's conjugate, which makes the bottom real. So $\\frac{10 + 5i}{1 + 2i}$ becomes $\\frac{20 - 15i}{5} = 4 - 3i$. Simply dividing real by real and imaginary by imaginary is not valid.",
      "除以复数时，分子分母同乘分母的共轭，使分母变成实数。所以 $\\frac{10 + 5i}{1 + 2i}$ 变成 $\\frac{20 - 15i}{5} = 4 - 3i$。把实部除以实部、虚部除以虚部是错的。",
    ),
  },
  "act-exam-combining-matrices": {
    tip: t(
      "Matrices of the same size add entry by entry in matching positions. So $\\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix} + \\begin{bmatrix} 5 & 0 \\\\ -1 & 2 \\end{bmatrix} = \\begin{bmatrix} 6 & 2 \\\\ 2 & 6 \\end{bmatrix}$. Matrix multiplication rules do not apply here, and neither position should mix rows with columns.",
      "大小相同的矩阵，把对应位置的元素相加。所以 $\\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix} + \\begin{bmatrix} 5 & 0 \\\\ -1 & 2 \\end{bmatrix} = \\begin{bmatrix} 6 & 2 \\\\ 2 & 6 \\end{bmatrix}$。这里不用矩阵乘法规则，也不能把行和列混起来。",
    ),
    hardTip: t(
      "Subtraction also goes position by position, first matrix minus second, and the order matters. So $\\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix} - \\begin{bmatrix} 5 & 0 \\\\ -1 & 2 \\end{bmatrix} = \\begin{bmatrix} -4 & 2 \\\\ 4 & 2 \\end{bmatrix}$. Watch entries that turn negative, and subtracting a negative entry adds its size.",
      "减法也是逐个位置进行，第一个矩阵减第二个，顺序很重要。所以 $\\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix} - \\begin{bmatrix} 5 & 0 \\\\ -1 & 2 \\end{bmatrix} = \\begin{bmatrix} -4 & 2 \\\\ 4 & 2 \\end{bmatrix}$。注意变成负数的元素；减去负元素等于加上它的大小。",
    ),
  },
  "act-exam-multiplying-a-matrix-by-a-scalar": {
    tip: t(
      "A scalar multiplies every entry of the matrix: $3\\begin{bmatrix} 1 & -2 \\\\ 0 & 4 \\end{bmatrix} = \\begin{bmatrix} 3 & -6 \\\\ 0 & 12 \\end{bmatrix}$. Multiplying only the first row or the diagonal is the error these options contain. Every position must change, except for those holding $0$.",
      "数乘矩阵时，每个元素都要乘：$3\\begin{bmatrix} 1 & -2 \\\\ 0 & 4 \\end{bmatrix} = \\begin{bmatrix} 3 & -6 \\\\ 0 & 12 \\end{bmatrix}$。只乘第一行或对角线，是这些选项中的错误。除了 $0$ 所在的位置，每个位置都要变。",
    ),
    hardTip: t(
      "To undo a scalar, divide each entry by it, then read the requested position, with rows first and columns second. If $3X$ has $21$ in row $2$, column $1$, then $X$ has $7$ there. Swapping row and column picks the wrong entry, and forgetting to divide reports the entry of $3X$ instead.",
      "要消去数乘，把每个元素除以这个数，再读出所求位置的元素：先行后列。若 $3X$ 的第 $2$ 行第 $1$ 列是 $21$，则 $X$ 的这个位置是 $7$。行列对调就选错了元素，忘了除则报告的是 $3X$ 的元素。",
    ),
  },
  "act-exam-multiplying-matrices": {
    tip: t(
      "An entry of a product combines a row of the first matrix with a column of the second: multiply matching pairs and add. In $\\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}\\begin{bmatrix} 5 & 6 \\\\ 7 & 8 \\end{bmatrix}$, row $1$ with column $1$ gives $1(5) + 2(7) = 19$. Multiplying matching entries directly gives only $5$.",
      "乘积中的元素由第一个矩阵的行与第二个矩阵的列组合而成：对应项相乘再相加。在 $\\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}\\begin{bmatrix} 5 & 6 \\\\ 7 & 8 \\end{bmatrix}$ 中，第 $1$ 行与第 $1$ 列得 $1(5) + 2(7) = 19$。直接把对应元素相乘只得到 $5$。",
    ),
    hardTip: t(
      "For the whole product, repeat row-times-column for each position: entry $(r, c)$ uses row $r$ and column $c$. So $\\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}\\begin{bmatrix} 5 & 6 \\\\ 7 & 8 \\end{bmatrix} = \\begin{bmatrix} 19 & 22 \\\\ 43 & 50 \\end{bmatrix}$. The order of the matrices matters, because swapping them changes the answer.",
      "求整个乘积时，对每个位置重复行乘列：位置 $(r, c)$ 用第 $r$ 行和第 $c$ 列。所以 $\\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}\\begin{bmatrix} 5 & 6 \\\\ 7 & 8 \\end{bmatrix} = \\begin{bmatrix} 19 & 22 \\\\ 43 & 50 \\end{bmatrix}$。矩阵的顺序很重要，交换后答案会变。",
    ),
  },
  "act-exam-finding-determinants": {
    tip: t(
      "The determinant of $\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$ is $ad - bc$: main diagonal product minus the other diagonal product. For $\\begin{bmatrix} 4 & 2 \\\\ 3 & 5 \\end{bmatrix}$: $20 - 6 = 14$. Adding the two products, or subtracting in the other order, gives the expected wrong options.",
      "$\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$ 的行列式是 $ad - bc$：主对角线之积减另一条对角线之积。对 $\\begin{bmatrix} 4 & 2 \\\\ 3 & 5 \\end{bmatrix}$：$20 - 6 = 14$。把两个积相加，或者按相反的顺序减，都是预料中的错误选项。",
    ),
    hardTip: t(
      "With an unknown entry, write $ad - bc$ with the variable in place, set it equal to the given value and solve. For $\\begin{bmatrix} 2 & 3 \\\\ 1 & x \\end{bmatrix}$ with determinant $7$: $2x - 3 = 7$, so $x = 5$. Keep the minus sign in front of the off-diagonal product.",
      "有未知元素时，把变量放进 $ad - bc$，令其等于给定的值，再求解。$\\begin{bmatrix} 2 & 3 \\\\ 1 & x \\end{bmatrix}$ 的行列式为 $7$：$2x - 3 = 7$，所以 $x = 5$。副对角线之积前面的减号要保留。",
    ),
  },
  "act-exam-finding-components-of-a-vector": {
    tip: t(
      "A vector's components are the end point minus the start point, for each coordinate. From $(1, 2)$ to $(4, -2)$: $\\langle 3, -4 \\rangle$. Subtracting in the opposite order reverses the direction, and adding the coordinates gives a midpoint-like value that has no meaning here.",
      "向量的分量是每个坐标的终点减起点。从 $(1, 2)$ 到 $(4, -2)$：$\\langle 3, -4 \\rangle$。反过来减，方向就反了；把坐标相加得到的是类似中点的值，在这里没有意义。",
    ),
    hardTip: t(
      "A vector's magnitude is its length, found by the Pythagorean theorem on the components. First subtract to get them, then take the root of the sum of the squares. From $(1, 2)$ to $(7, 10)$: $\\langle 6, 8 \\rangle$, with magnitude $10$. Adding components without squaring gives a wrong length.",
      "向量的模是它的长度，对分量用勾股定理求得。先相减得到分量，再求平方和的平方根。从 $(1, 2)$ 到 $(7, 10)$：$\\langle 6, 8 \\rangle$，模是 $10$。不平方直接把分量相加，长度就错了。",
    ),
  },
  "act-exam-combining-vectors": {
    tip: t(
      "Vectors add component by component: first with first, second with second. So $\\langle 2, -3 \\rangle + \\langle 5, 1 \\rangle = \\langle 7, -2 \\rangle$. Combining all the numbers into one total loses the direction, and mixing the components is the other error. Carry each sign along.",
      "向量按分量相加：第一个与第一个，第二个与第二个。所以 $\\langle 2, -3 \\rangle + \\langle 5, 1 \\rangle = \\langle 7, -2 \\rangle$。把所有数合成一个总数就失去了方向，把分量混起来是另一个错误。每个符号都要带上。",
    ),
    hardTip: t(
      "A scalar multiplies both components of its vector; then subtract component by component. For $3\\mathbf{u} - \\mathbf{v}$ with $\\mathbf{u} = \\langle 2, -3 \\rangle$ and $\\mathbf{v} = \\langle 5, 1 \\rangle$: $\\langle 6, -9 \\rangle - \\langle 5, 1 \\rangle = \\langle 1, -10 \\rangle$. Scaling only one component, or both vectors, is the trap.",
      "数乘作用于向量的两个分量；然后按分量相减。对 $3\\mathbf{u} - \\mathbf{v}$，$\\mathbf{u} = \\langle 2, -3 \\rangle$，$\\mathbf{v} = \\langle 5, 1 \\rangle$：$\\langle 6, -9 \\rangle - \\langle 5, 1 \\rangle = \\langle 1, -10 \\rangle$。只乘一个分量，或者两个向量都乘，就是陷阱。",
    ),
  },
  "act-exam-combining-like-terms": {
    tip: t(
      "Subtracting a group changes the sign of every term in it. Then combine terms with the same power. So $(5x^2 + 3x) - (2x^2 - x) = 3x^2 + 4x$. Applying the minus only to the first term gives $2x$ at the end. Unlike powers, such as $x^2$ and $x$, never merge.",
      "减去一组时，其中每一项都要变号。再合并次数相同的项。所以 $(5x^2 + 3x) - (2x^2 - x) = 3x^2 + 4x$。减号只作用于第一项，末尾就成了 $2x$。不同次的项，如 $x^2$ 和 $x$，绝不能合并。",
    ),
    hardTip: t(
      "For a perimeter, add all the side expressions: collect the $x$ coefficients and the constants separately. With sides $3x + 1$, $2x - 5$ and $x + 6$: the perimeter is $6x + 2$. Keep the sign of each constant, since a negative constant reduces the total.",
      "求周长时，把所有边的表达式相加：分别合并 $x$ 的系数和常数。边为 $3x + 1$、$2x - 5$、$x + 6$：周长是 $6x + 2$。要保留每个常数的符号，因为负的常数会减少总和。",
    ),
  },
  "act-exam-distributing-over-binomials": {
    tip: t(
      "Multiply each outside factor through its parentheses, carrying the minus sign to both terms of a subtracted group. So $3(x - 4) - 2(x + 5) = 3x - 12 - 2x - 10 = x - 22$. Writing $+10$ instead of $-10$ is the common sign slip. Then combine like terms.",
      "把外面的每个因数乘进括号，减号要带到被减组的两项。所以 $3(x - 4) - 2(x + 5) = 3x - 12 - 2x - 10 = x - 22$。把 $-10$ 写成 $+10$ 是常见的符号错误。然后合并同类项。",
    ),
    hardTip: t(
      "The constant term comes only from multiplying each factor by its group's constant. You need not expand the $x$ terms at all. For $2(x - 3) + 5(x + 4)$: $-6 + 20 = 14$. Adding the numbers without multiplying, or dropping a sign, gives the wrong constant.",
      "常数项只来自每个因数乘它那一组的常数。根本不必展开 $x$ 项。对 $2(x - 3) + 5(x + 4)$：$-6 + 20 = 14$。不做乘法直接相加，或者丢了符号，常数就错了。",
    ),
  },
  "act-exam-expanding-products-of-binomials": {
    tip: t(
      "Each term of the first binomial multiplies each term of the second, giving four products. Then combine the middle two. So $(x + 3)(x - 7) = x^2 - 7x + 3x - 21 = x^2 - 4x - 21$. Multiplying only firsts and lasts drops the middle term, which is the trap.",
      "第一个二项式的每一项乘第二个的每一项，得四个乘积。再合并中间两项。所以 $(x + 3)(x - 7) = x^2 - 7x + 3x - 21 = x^2 - 4x - 21$。只乘首项和末项就漏了中间项，这就是陷阱。",
    ),
    hardTip: t(
      "For just the coefficient of $x$, add the outer and inner products. In $(2x + 3)(4x - 5)$: outer $-10x$ and inner $12x$ add to $2x$, so the coefficient is $2$. There is no need for the $x^2$ or constant terms. Mixing in the product of the outer numbers misleads.",
      "只求 $x$ 的系数时，把外积和内积相加。在 $(2x + 3)(4x - 5)$ 中：外积 $-10x$ 和内积 $12x$ 相加得 $2x$，所以系数是 $2$。不需要 $x^2$ 项和常数项。把首项相乘的结果混进来会出错。",
    ),
  },
  "act-exam-factoring-algebraic-expressions": {
    tip: t(
      "Take out the greatest factor shared by all terms: the number and the variable. For $6x^2 - 21x$: the common factor is $3x$, which leaves $3x(2x - 7)$. Distribute back to check. A smaller factor leaves a common factor inside, so it is not fully factored.",
      "提出所有项共有的最大因式：数和变量都要。对 $6x^2 - 21x$：公因式是 $3x$，得 $3x(2x - 7)$。乘回去验算。用较小的因式，括号内还有公因式，就没有分解完全。",
    ),
    hardTip: t(
      "With two variables, divide every term by the given factor, reducing the numbers and the variable powers. If $6x^2y + 15xy^2 = 3xy \\cdot Q$, then $Q = 2x + 5y$. Each variable loses one power. Dividing only the first term, or keeping an extra variable, leaves an expression that does not multiply back.",
      "有两个变量时，用给定的因式去除每一项，数和变量的次数都要约简。若 $6x^2y + 15xy^2 = 3xy \\cdot Q$，则 $Q = 2x + 5y$。每个变量都减少一次。只除第一项，或者多留一个变量，都不能乘回原式。",
    ),
  },
  "act-exam-simplifying-by-canceling-factors": {
    tip: t(
      "You can cancel only whole factors, so factor the numerator first, then remove the matching factor. Here a common number comes out, then a difference of squares. So $\\frac{2x^2 - 18}{x - 3} = \\frac{2(x - 3)(x + 3)}{x - 3} = 2x + 6$. Cancelling individual terms is the invalid move.",
      "只能约去完整的因式，所以先分解分子，再去掉相同的因式。这里先提公因数，再用平方差。所以 $\\frac{2x^2 - 18}{x - 3} = \\frac{2(x - 3)(x + 3)}{x - 3} = 2x + 6$。约去单独的项是错误的做法。",
    ),
    hardTip: t(
      "Simplify before substituting, because it reduces the arithmetic to almost nothing. Since $x^2 + 5x + 6 = (x + 2)(x + 3)$, the quotient $\\frac{x^2 + 5x + 6}{x + 2}$ equals $x + 3$, which is $10$ at $x = 7$. Direct substitution also works, but it means larger numbers.",
      "代入之前先化简，这样运算几乎就没了。因为 $x^2 + 5x + 6 = (x + 2)(x + 3)$，商 $\\frac{x^2 + 5x + 6}{x + 2}$ 等于 $x + 3$，在 $x = 7$ 处是 $10$。直接代入也行，但数字更大。",
    ),
  },
  "act-exam-evaluating-algebraic-expressions": {
    tip: t(
      "Substitute with parentheses, then do powers before multiplication. A squared negative is positive. For $2x^2 - 4y$ with $x = -5$ and $y = 1$: $2(25) - 4 = 46$. Without parentheses, the common error reads $-5^2$ as $-25$, which makes the first term negative.",
      "用括号代入，再先算幂后算乘。负数的平方是正数。对 $2x^2 - 4y$，$x = -5$，$y = 1$：$2(25) - 4 = 46$。不加括号时，常见的错误把 $-5^2$ 读成 $-25$，第一项就成了负数。",
    ),
    hardTip: t(
      "With three variables, work inside parentheses first, then the power, then the product, and finally the addition. For $a(b - c)^2 + bc$ with $a = -2$, $b = 5$ and $c = 3$: $-2(4) + 15 = 7$. Multiplying $a$ into the group before squaring breaks the order.",
      "有三个变量时，先算括号内，再算幂，再算乘，最后算加。对 $a(b - c)^2 + bc$，$a = -2$，$b = 5$，$c = 3$：$-2(4) + 15 = 7$。在平方之前把 $a$ 乘进括号，就打乱了顺序。",
    ),
  },
  "act-exam-solving-linear-equations": {
    tip: t(
      "Gather the variable terms on one side and the numbers on the other, changing signs as they cross. Then divide by the coefficient. For $5x + 1 = 2x + 13$: $3x = 12$, so $x = 4$. Adding terms across instead of subtracting is the usual error. Substitute back to verify.",
      "把变量项移到一边，数字移到另一边，过等号要变号。再除以系数。对 $5x + 1 = 2x + 13$：$3x = 12$，所以 $x = 4$。移项时加而不是减是常见错误。代回去验算。",
    ),
    hardTip: t(
      "Solving for a multiple of $x$ can be enough. Isolate $2x$ from the equation, then double it to reach the new expression. If $2x - 5 = 9$: $2x = 14$, so $4x + 3 = 31$. Reporting $x$ or $2x$ stops short of what the question asks, and those values appear among the options.",
      "只解出 $x$ 的倍数可能就够了。从方程中孤立出 $2x$，再加倍得到新的表达式。若 $2x - 5 = 9$：$2x = 14$，所以 $4x + 3 = 31$。报告 $x$ 或 $2x$ 都没答到题目所问，这些值也出现在选项中。",
    ),
  },
  "act-exam-solving-linear-equations-with-parentheses": {
    tip: t(
      "Distribute first on each side, and then collect terms. So $4(x - 2) = 2(x + 3)$ becomes $4x - 8 = 2x + 6$, which leads to $2x = 14$ and $x = 7$. Multiplying just the $x$ inside parentheses leaves the constant unscaled, which is the classic mistake.",
      "先在两边分别展开，再合并各项。所以 $4(x - 2) = 2(x + 3)$ 变为 $4x - 8 = 2x + 6$，得 $2x = 14$，$x = 7$。只乘括号里的 $x$，常数没有放大，这是典型错误。",
    ),
    hardTip: t(
      "A minus sign in front of parentheses acts as a factor of $-1$ on every term inside. For $3(x - 1) - (x + 2) = 5$: $3x - 3 - x - 2 = 5$, so $2x = 10$ and $x = 5$. Writing $+2$ after the minus is the sign error the wrong options reward.",
      "括号前的减号相当于把里面每一项都乘 $-1$。对 $3(x - 1) - (x + 2) = 5$：$3x - 3 - x - 2 = 5$，所以 $2x = 10$，$x = 5$。减号之后写成 $+2$，就是错误选项所利用的符号错误。",
    ),
  },
  "act-exam-solving-literal-equations": {
    tip: t(
      "Treat the other letter as a number and isolate the target variable. For $3x - 5y = 10$: subtract $3x$ to get $-5y = 10 - 3x$, then divide by $-5$, which flips the signs: $y = \\frac{3x - 10}{5}$. Dividing just one term by the coefficient is the most common slip.",
      "把另一个字母当作数，孤立目标变量。对 $3x - 5y = 10$：减去 $3x$ 得 $-5y = 10 - 3x$，再除以 $-5$，符号翻转：$y = \\frac{3x - 10}{5}$。只把一项除以系数是最常见的疏漏。",
    ),
    hardTip: t(
      "In a formula, undo the addition before the multiplication, keeping the whole difference over the coefficient. For $T = 25 + 6n$: $T - 25 = 6n$, so $n = \\frac{T - 25}{6}$. Writing $\\frac{T}{6} - 25$ divides only part of the difference, which gives a wrong formula.",
      "在公式中，先消去加法，再消去乘法，整个差都要在系数之上。对 $T = 25 + 6n$：$T - 25 = 6n$，所以 $n = \\frac{T - 25}{6}$。写成 $\\frac{T}{6} - 25$ 只除了差的一部分，公式就错了。",
    ),
  },
  "act-exam-identifying-characteristics-of-linear-equations": {
    tip: t(
      "Simplify both sides and compare. Identical sides mean infinitely many solutions; the same $x$ coefficient with different constants means none; different $x$ coefficients mean exactly one. So $3(x + 1) = 3x + 3$ holds for every $x$, while $2x + 1 = 2x + 5$ never does.",
      "化简两边再比较。两边完全相同有无穷多解；$x$ 系数相同而常数不同则无解；$x$ 系数不同恰有一解。所以 $3(x + 1) = 3x + 3$ 对每个 $x$ 都成立，而 $2x + 1 = 2x + 5$ 永不成立。",
    ),
    hardTip: t(
      "For no solution, the $x$ terms must cancel while the constants differ, so set the coefficients equal. For $kx + 5 = 3x + 9$, the value $k = 3$ leaves $5 = 9$, which is false. Solving for $x$ first is unnecessary, and setting the constants equal does nothing to remove $x$.",
      "要无解，$x$ 项必须抵消而常数不同，所以令系数相等。对 $kx + 5 = 3x + 9$，$k = 3$ 时剩下 $5 = 9$，这是假的。不必先求 $x$；令常数相等也消不掉 $x$。",
    ),
  },
  "act-exam-writing-linear-inequalities": {
    tip: t(
      "Write the amount as a starting value plus a rate times the variable, then pick the symbol from the wording: at least means $\\ge$. Starting with $50$ dollars and adding $5$ dollars each week, reaching at least $300$ dollars gives $50 + 5w \\ge 300$. Using $\\le$ reverses the condition.",
      "把数量写成初始值加变化率乘变量，再根据措辞选符号：“至少”表示 $\\ge$。从 $50$ 美元开始、每周加 $5$ 美元，要至少达到 $300$ 美元，得 $50 + 5w \\ge 300$。用 $\\le$ 就把条件弄反了。",
    ),
    hardTip: t(
      "A limit like at most means $\\le$, and the total load includes every fixed amount. A lift with a $200$-pound rider and $15$-pound crates, with a limit of $1{,}000$ pounds, gives $200 + 15n \\le 1{,}000$. Leaving out the rider, or multiplying the rider by $n$, misstates the load.",
      "“至多”这样的限制表示 $\\le$，总负载包括每个固定的量。$200$ 磅的乘客和 $15$ 磅的箱子，上限 $1{,}000$ 磅，得 $200 + 15n \\le 1{,}000$。漏掉乘客，或者把乘客乘 $n$，都写错了负载。",
    ),
  },
  "act-exam-finding-a-threshold-from-a-linear-inequality": {
    tip: t(
      "For a greatest count, solve the inequality with $\\le$ and round down when the result is not whole, since going over breaks the limit. With a $20$-dollar fee and $3$ dollars per use on a $70$-dollar budget: $3v \\le 50$, so $v \\le 16.\\overline{6}$, and the most is $16$.",
      "求最大数量时，解 $\\le$ 的不等式，结果不是整数就向下取整，因为超过就破坏了限制。固定费 $20$ 美元、每次 $3$ 美元、预算 $70$ 美元：$3v \\le 50$，所以 $v \\le 16.\\overline{6}$，最多 $16$ 次。",
    ),
    hardTip: t(
      "For a least count that reaches a goal, solve with $\\ge$ and round up when the result is not whole, since falling short misses the goal. With $20$ dollars saved and $3$ dollars per sale aiming for $70$ dollars: $c \\ge 16.\\overline{6}$, so at least $17$ sales. Rounding down leaves it just short.",
      "求达到目标的最小数量时，解 $\\ge$ 的不等式，结果不是整数就向上取整，因为不足就达不到目标。已有 $20$ 美元、每笔 $3$ 美元、目标 $70$ 美元：$c \\ge 16.\\overline{6}$，所以至少 $17$ 笔。向下取整就差一点点。",
    ),
  },
  "act-exam-graphing-linear-inequalities": {
    tip: t(
      "First read the boundary: the $y$-intercept and slope give the line. A dashed line means a strict sign, and a solid line includes equality. Shading above means $y >$, and shading below means $y <$. A dashed line crossing at $1$ with slope $3$, shaded below, is $y < 3x + 1$.",
      "先读边界：$y$ 轴截距和斜率确定直线。虚线表示严格不等号，实线包含等号。阴影在上方是 $y >$，在下方是 $y <$。虚线在 $1$ 处穿过 $y$ 轴、斜率为 $3$、阴影在下方，就是 $y < 3x + 1$。",
    ),
    hardTip: t(
      "To test a point, put its $x$ into the line's formula and compare its $y$ with the result. For $y > 3x + 1$ at $x = 1$, the line is at $4$. So $(1, 5)$ is a solution, while $(1, 4)$ is on the dashed line and $(1, 2)$ is below it, so neither qualifies.",
      "要检验一个点，把它的 $x$ 代入直线的式子，再把它的 $y$ 与结果比较。对 $y > 3x + 1$，$x = 1$ 时直线在 $4$。所以 $(1, 5)$ 是解，而 $(1, 4)$ 在虚线上，$(1, 2)$ 在线下方，都不符合。",
    ),
  },
  "act-exam-using-systems-of-linear-inequalities": {
    tip: t(
      "A solution of a system must satisfy every inequality at once. Substitute each candidate into both. For $y > 2x - 1$ and $y < -x + 8$, the point $(2, 4)$ works, since $4 > 3$ and $4 < 6$. A point satisfying only one inequality is the trap in the options.",
      "方程组的解必须同时满足每个不等式。把每个候选点代入两个不等式。对 $y > 2x - 1$ 和 $y < -x + 8$，点 $(2, 4)$ 成立，因为 $4 > 3$，$4 < 6$。只满足其中一个不等式的点就是选项中的陷阱。",
    ),
    hardTip: t(
      "To maximize a quantity, decide which variable it depends on and push that variable to its limit. If $x + y \\le 20$ and $y \\ge 15$, then $x$ is largest when $y$ is smallest: $y = 15$ leaves $x = 5$. At $5$ dollars per unit of $x$, the most is $25$ dollars.",
      "要使某个量最大，先判断它取决于哪个变量，再把这个变量推到极限。若 $x + y \\le 20$，$y \\ge 15$，则 $y$ 最小时 $x$ 最大：$y = 15$ 时 $x = 5$。$x$ 每单位 $5$ 美元，最多 $25$ 美元。",
    ),
  },
  "act-exam-solving-linear-systems": {
    tip: t(
      "When one variable has opposite signs in two equations, adding them cancels it. For $x + y = 7$ and $x - y = 3$: $2x = 10$, so $x = 5$. Note that the question asks for one variable; solving for the other and reporting it is the usual slip. Divide the sum by the remaining coefficient.",
      "一个变量在两个方程中符号相反时，相加就能消去它。对 $x + y = 7$ 和 $x - y = 3$：$2x = 10$，所以 $x = 5$。注意题目问的是一个变量；解出另一个并报告它是常见的疏漏。要用和除以剩下的系数。",
    ),
    hardTip: t(
      "When one equation already gives $y$, replace $y$ in the other equation with that whole expression, solve for $x$, and substitute back. For $y = 2x + 1$ and $x + y = 10$: $3x + 1 = 10$, so $x = 3$ and $y = 7$. Stopping at $x$ misses a request for $y$.",
      "一个方程已经给出 $y$ 时，把另一个方程中的 $y$ 换成这个完整的表达式，解出 $x$，再代回去。对 $y = 2x + 1$ 和 $x + y = 10$：$3x + 1 = 10$，所以 $x = 3$，$y = 7$。停在 $x$ 上就没答到所问的 $y$。",
    ),
  },
  "act-exam-solving-systems-by-elimination": {
    tip: t(
      "If a variable has the same coefficient in both equations, subtracting cancels it. Mind the sign when subtracting a negative term. For $3x + 2y = 12$ and $3x - y = 3$: $2y - (-y) = 3y$ and $3y = 9$, so $y = 3$. Writing $2y - y$ loses a term and gives the wrong value.",
      "一个变量在两个方程中系数相同时，相减就能消去它。减去负项时要注意符号。对 $3x + 2y = 12$ 和 $3x - y = 3$：$2y - (-y) = 3y$，$3y = 9$，所以 $y = 3$。写成 $2y - y$ 就少了一项，值也错了。",
    ),
    hardTip: t(
      "Cancel one variable, find the other, substitute back, and finish with whatever combination is requested. For $2x + 3y = 13$ and $5x - 3y = 1$: adding gives $7x = 14$, so $x = 2$, then $y = 3$ and $x + y = 5$. Answering with a single variable leaves the job incomplete.",
      "消去一个变量，求出另一个，代回去，最后算出所要求的组合。对 $2x + 3y = 13$ 和 $5x - 3y = 1$：相加得 $7x = 14$，所以 $x = 2$，然后 $y = 3$，$x + y = 5$。只答一个变量就没做完。",
    ),
  },
  "act-exam-determining-how-many-solutions-a-system-has": {
    tip: t(
      "Compare the equations by scaling one to match the other. If everything matches, they are the same line with infinitely many solutions. If only the variable side matches, the lines are parallel with none. For $2x + y = 5$: the partner $4x + 2y = 10$ gives infinitely many, and $4x + 2y = 7$ gives none.",
      "把一个方程放大来与另一个比较。如果全部相同，就是同一条直线，有无穷多解。如果只有变量部分相同，就是平行线，无解。对 $2x + y = 5$：配上 $4x + 2y = 10$ 有无穷多解，配上 $4x + 2y = 7$ 无解。",
    ),
    hardTip: t(
      "No solution means parallel lines: equal slopes and different intercepts. Put both in $y = mx + b$ form, then match the slopes. For $y = 4x + 1$ and $2y = mx + 9$: the second has slope $\\frac{m}{2}$, so $m = 8$, and the intercepts differ. Forgetting to divide by $2$ gives the trap value.",
      "无解意味着平行线：斜率相等，截距不同。把两者都写成 $y = mx + b$ 的形式，再令斜率相等。对 $y = 4x + 1$ 和 $2y = mx + 9$：第二条的斜率是 $\\frac{m}{2}$，所以 $m = 8$，截距确实不同。忘了除以 $2$ 就落入陷阱。",
    ),
  },
  "act-exam-modeling-word-problems-with-systems": {
    tip: t(
      "Two totals give two facts: one counts items, and one counts value. Use the first to write one count as total minus the other, then insert it in the value equation. With $50$ tickets at $10$ and $4$ dollars totalling $350$ dollars: $10a + 4(50 - a) = 350$, so $a = 25$.",
      "两个总数给出两个事实：一个数物品，一个算价值。用第一个把一种数量写成总数减另一种，再代入价值方程。$50$ 张票，单价 $10$ 和 $4$ 美元，共 $350$ 美元：$10a + 4(50 - a) = 350$，所以 $a = 25$。",
    ),
    hardTip: t(
      "Look for a shortcut before solving. When two equations swap their coefficients, adding them gives equal coefficients, and dividing yields the sum directly. From $3p + 2q = 18$ and $2p + 3q = 17$: $5p + 5q = 35$, so one of each costs $7$. Finding each price also works, but it takes longer.",
      "求解之前先找捷径。两个方程的系数对调时，相加后系数相等，再除一下就直接得到和。由 $3p + 2q = 18$ 和 $2p + 3q = 17$：$5p + 5q = 35$，所以各一件共 $7$。分别求出单价也行，但更费时间。",
    ),
  },
  "act-exam-using-a-system-solution": {
    tip: t(
      "Recognize the structure first: a difference of squares factors as $x^2 - y^2 = (x + y)(x - y)$, so multiply the two given values. If $x + y = 7$ and $x - y = 3$, then $x^2 - y^2 = 21$. Squaring the given numbers separately is a trap, and you need not find $x$ or $y$.",
      "先识别结构：平方差可分解为 $x^2 - y^2 = (x + y)(x - y)$，所以把两个给定的值相乘。若 $x + y = 7$，$x - y = 3$，则 $x^2 - y^2 = 21$。把给定的数分别平方是陷阱，也不必求出 $x$ 或 $y$。",
    ),
    hardTip: t(
      "When the requested combination has equal coefficients, add the equations to get them, then divide. From $3x + y = 14$ and $x + 3y = 10$: adding gives $4x + 4y = 24$, so $x + y = 6$. Forgetting to divide by the common coefficient leaves the sum of the two right sides.",
      "所求组合的系数相等时，把方程相加得到相等的系数，再相除。由 $3x + y = 14$ 和 $x + 3y = 10$：相加得 $4x + 4y = 24$，所以 $x + y = 6$。忘了除以公共系数，就停在两个右边之和上了。",
    ),
  },
  "act-exam-factoring-quadratic-expressions": {
    tip: t(
      "For $x^2 + bx + c$, find two numbers whose product is $c$ and whose sum is $b$. For $x^2 + 2x - 15$: $5$ and $-3$ work, so it factors as $(x + 5)(x - 3)$. A negative product means the numbers have opposite signs. Check the sum to choose the signs correctly.",
      "对 $x^2 + bx + c$，找两个数，积为 $c$，和为 $b$。对 $x^2 + 2x - 15$：$5$ 和 $-3$ 符合，所以分解为 $(x + 5)(x - 3)$。积为负时两个数异号。用和来确定符号。",
    ),
    hardTip: t(
      "With a leading coefficient above $1$, expand the pattern and match terms: $(2x + m)(x + n)$ has an $x$ coefficient of $2n + m$ and a constant of $mn$. For $2x^2 + 7x + 3$: $m = 1$ and $n = 3$ fit, since $6 + 1 = 7$. Multiply the outer term by the leading coefficient.",
      "首项系数大于 $1$ 时，展开模式再对应各项：$(2x + m)(x + n)$ 的 $x$ 系数是 $2n + m$，常数是 $mn$。对 $2x^2 + 7x + 3$：$m = 1$，$n = 3$ 符合，因为 $6 + 1 = 7$。外侧的项要乘上首项系数。",
    ),
  },
  "act-exam-using-factors-of-a-quadratic": {
    tip: t(
      "A product is $0$ only when a factor is $0$, so set each factor to $0$ and solve. In $(x + 4)(x - 2) = 0$: $x = -4$ or $x = 2$. Copying the numbers inside without reversing their signs gives the wrong pair, which is a frequent option.",
      "乘积为 $0$ 只在某个因式为 $0$ 时成立，所以令每个因式为 $0$ 并求解。在 $(x + 4)(x - 2) = 0$ 中：$x = -4$ 或 $x = 2$。照抄括号内的数而不反转符号，得到的一对就错了，这是常见选项。",
    ),
    hardTip: t(
      "If one factor is known, find the other from the constant: the two constants multiply to it. For $x - 2$ a factor of $x^2 + kx - 10$: the other factor is $x + 5$, and the middle coefficient is $k = 5 - 2 = 3$. Alternatively, substitute $x = 2$, which must make the expression $0$.",
      "已知一个因式时，由常数求另一个：两个常数之积等于它。$x - 2$ 是 $x^2 + kx - 10$ 的因式：另一个因式是 $x + 5$，中间系数 $k = 5 - 2 = 3$。也可以代入 $x = 2$，它必须使这个表达式为 $0$。",
    ),
  },
  "act-exam-solving-perfect-square-equations": {
    tip: t(
      "Taking the square root of both sides gives two cases, plus and minus. For $(x + 1)^2 = 9$: $x + 1 = \\pm 3$, so $x$ is $2$ or $-4$. Then pick what the question wants, such as the greater. Taking only the positive root may miss a solution.",
      "两边开平方得到正负两种情况。对 $(x + 1)^2 = 9$：$x + 1 = \\pm 3$，所以 $x$ 是 $2$ 或 $-4$。再按题目要求选择，比如较大的那个。只取正根可能会漏解。",
    ),
    hardTip: t(
      "First recognize a perfect square trinomial on the left, and rewrite it as a square. So $x^2 - 4x + 4 = 9$ becomes $(x - 2)^2 = 9$, with $x = 2 \\pm 3$. The two roots sum to $2(2) = 4$, since the plus and minus cancel. Moving the $9$ across also works, but it takes longer.",
      "先识别左边的完全平方三项式，把它改写成平方。所以 $x^2 - 4x + 4 = 9$ 变为 $(x - 2)^2 = 9$，$x = 2 \\pm 3$。两根之和是 $2(2) = 4$，因为正负抵消了。把 $9$ 移过去也行，但更费时间。",
    ),
  },
  "act-exam-solving-quadratic-equations-by-factoring": {
    tip: t(
      "A quadratic must equal $0$ before you factor, so move every term to one side first. For $x^2 + 3x = 28$: $x^2 + 3x - 28 = 0$, which is $(x + 7)(x - 4) = 0$. The positive root is $4$. Factoring $x(x + 3) = 28$ and setting pieces to $28$ is the invalid move.",
      "二次方程要先等于 $0$ 才能分解，所以先把所有项移到一边。对 $x^2 + 3x = 28$：$x^2 + 3x - 28 = 0$，即 $(x + 7)(x - 4) = 0$。正根是 $4$。分解成 $x(x + 3) = 28$ 再令各部分等于 $28$ 是错误的做法。",
    ),
    hardTip: t(
      "Turn the description into a quadratic: width times length equals area, then move the area across and factor. With length $3$ more than width and area $40$: $w(w + 3) = 40$, so $(w - 5)(w + 8) = 0$. Reject the negative root, because a length must be positive. Thus $w = 5$.",
      "把描述变成二次方程：宽乘长等于面积，再把面积移过去并分解。长比宽多 $3$、面积 $40$：$w(w + 3) = 40$，所以 $(w - 5)(w + 8) = 0$。负根舍去，因为长度必须为正。因此 $w = 5$。",
    ),
  },
  "act-exam-applying-the-quadratic-formula": {
    tip: t(
      "Write the equation in standard form, read $a$, $b$ and $c$ with their signs, and insert them into $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$. For $x^2 + 3x - 4 = 0$: the radicand is $9 + 16 = 25$, so $x = \\frac{-3 \\pm 5}{2}$, which is $1$ or $-4$. Dividing only the root by $2a$ is the trap.",
      "把方程写成标准形式，连同符号读出 $a$、$b$、$c$，代入 $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$。对 $x^2 + 3x - 4 = 0$：根号内是 $9 + 16 = 25$，所以 $x = \\frac{-3 \\pm 5}{2}$，即 $1$ 或 $-4$。只把根式除以 $2a$ 就是陷阱。",
    ),
    hardTip: t(
      "When the root is not a whole number, simplify and split the fraction to match the requested form. For $x^2 - 6x + 7 = 0$: the discriminant is $8$, so $x = \\frac{6 \\pm \\sqrt{8}}{2} = 3 \\pm \\sqrt{2}$, since $\\frac{\\sqrt{8}}{2} = \\sqrt{2}$. Reporting the discriminant itself skips the division.",
      "根不是整数时，要化简并拆开分数，以符合要求的形式。对 $x^2 - 6x + 7 = 0$：判别式是 $8$，所以 $x = \\frac{6 \\pm \\sqrt{8}}{2} = 3 \\pm \\sqrt{2}$，因为 $\\frac{\\sqrt{8}}{2} = \\sqrt{2}$。直接报告判别式就跳过了除法。",
    ),
  },
  "act-exam-using-the-discriminant": {
    tip: t(
      "The discriminant $b^2 - 4ac$ counts the real solutions: positive gives two, zero gives one and negative gives none. For $x^2 + 6x + 9 = 0$: $36 - 36 = 0$, so one, while $x^2 + x + 1 = 0$ gives $-3$, so none. There is no need to solve the equation.",
      "判别式 $b^2 - 4ac$ 决定实数解的个数：正数有两个，零有一个，负数没有。对 $x^2 + 6x + 9 = 0$：$36 - 36 = 0$，有一个；而 $x^2 + x + 1 = 0$ 得 $-3$，没有。不必解方程。",
    ),
    hardTip: t(
      "Exactly one solution means the discriminant is $0$, so set it up with the unknown coefficient and solve. For $2x^2 + 8x + c = 0$: $64 - 8c = 0$, so $c = 8$. Forgetting the factor of $4$ in $4ac$ gives a value that is too large.",
      "恰有一个解意味着判别式为 $0$，所以把未知系数放进去再求解。对 $2x^2 + 8x + c = 0$：$64 - 8c = 0$，所以 $c = 8$。忘了 $4ac$ 中的因数 $4$，值就太大了。",
    ),
  },
  "act-exam-applying-vieta-s-formulas": {
    tip: t(
      "For $ax^2 + bx + c = 0$, the solutions have product $\\frac{c}{a}$ and sum $-\\frac{b}{a}$, with no need to solve. For $2x^2 + 6x - 20 = 0$: the product is $-10$. Using $c$ alone ignores the leading coefficient, and the sign of $c$ must be kept.",
      "对 $ax^2 + bx + c = 0$，解的积是 $\\frac{c}{a}$，和是 $-\\frac{b}{a}$，不必求解。对 $2x^2 + 6x - 20 = 0$：积是 $-10$。只用 $c$ 就忽略了首项系数，$c$ 的符号也要保留。",
    ),
    hardTip: t(
      "A sum of squares comes from the identity $r^2 + s^2 = (r + s)^2 - 2rs$. Get the sum and product from the coefficients, then substitute. For $x^2 + 3x - 10 = 0$: the sum is $-3$ and the product is $-10$, so $9 + 20 = 29$. Squaring only the sum is the trap.",
      "平方和来自恒等式 $r^2 + s^2 = (r + s)^2 - 2rs$。由系数得到和与积，再代入。对 $x^2 + 3x - 10 = 0$：和是 $-3$，积是 $-10$，所以 $9 + 20 = 29$。只把和平方就是陷阱。",
    ),
  },
  "act-exam-modeling-with-quadratic-equations": {
    tip: t(
      "Let the smaller quantity be the variable, express the other in terms of it, and set their product equal to the given value. For a product of $63$ with one number $2$ greater: $n(n + 2) = 63$, so $(n - 7)(n + 9) = 0$ and $n = 7$. A negative root is rejected for positive whole numbers.",
      "设较小的量为变量，用它表示另一个量，令其积等于给定的值。积为 $63$、一个数比另一个大 $2$：$n(n + 2) = 63$，所以 $(n - 7)(n + 9) = 0$，$n = 7$。题目要求正整数，负根要舍去。",
    ),
    hardTip: t(
      "A height model opening downward peaks at its vertex, which occurs at $t = -\\frac{b}{2a}$. For $h = -16t^2 + 48t + 5$: $t = \\frac{48}{32} = \\frac{3}{2}$ seconds. The question asks when, so stop here; substituting would give the height instead. Setting $h = 0$ finds when the ball lands.",
      "开口向下的高度模型在顶点处最高，顶点在 $t = -\\frac{b}{2a}$。对 $h = -16t^2 + 48t + 5$：$t = \\frac{48}{32} = \\frac{3}{2}$ 秒。题目问的是何时，所以到此为止；代入得到的是高度。令 $h = 0$ 求的是落地时间。",
    ),
  },
  "act-exam-factoring-polynomials": {
    tip: t(
      "Four terms suggest grouping: factor the first two and the last two so that a shared binomial appears. So $x^3 + 2x^2 - 9x - 18 = x^2(x + 2) - 9(x + 2) = (x + 2)(x^2 - 9)$. Then split the difference of squares: $(x + 2)(x - 3)(x + 3)$. Stopping early leaves it unfinished.",
      "四项式适合分组：分别从前两项和后两项提公因式，使共同的二项式出现。所以 $x^3 + 2x^2 - 9x - 18 = x^2(x + 2) - 9(x + 2) = (x + 2)(x^2 - 9)$。再把平方差拆开：$(x + 2)(x - 3)(x + 3)$。提前停下就没分解完。",
    ),
    hardTip: t(
      "Factor out the greatest common power first, then any difference of squares; finally count each different root once. So $2x^4 - 8x^3 = 2x^3(x - 4)$ has just the zeros $0$ and $4$, a count of $2$. A repeated factor gives one zero, so the exponent should not be added to the count.",
      "先提出最大的公共幂，再分解平方差；最后每个不同的根只数一次。所以 $2x^4 - 8x^3 = 2x^3(x - 4)$ 的零点只有 $0$ 和 $4$，共 $2$ 个。重复的因式只给出一个零点，所以指数不应计入个数。",
    ),
  },
  "act-exam-simplifying-rational-expressions": {
    tip: t(
      "Factor both the top and bottom, then cancel matching whole factors. So $\\frac{x^2 + 7x + 10}{x^2 + 5x + 6} = \\frac{(x + 2)(x + 5)}{(x + 2)(x + 3)} = \\frac{x + 5}{x + 3}$. Crossing out the $x^2$ terms, or the $x$ terms, is not valid, because only factors cancel, never terms.",
      "分子分母都分解，再约去相同的完整因式。所以 $\\frac{x^2 + 7x + 10}{x^2 + 5x + 6} = \\frac{(x + 2)(x + 5)}{(x + 2)(x + 3)} = \\frac{x + 5}{x + 3}$。划掉 $x^2$ 项或 $x$ 项是错的，因为只能约因式，不能约项。",
    ),
    hardTip: t(
      "Spot the common factor on top and a difference of squares on the bottom. So $\\frac{4x - 8}{x^2 - 4} = \\frac{4(x - 2)}{(x - 2)(x + 2)} = \\frac{4}{x + 2}$. Leaving a factor of $x + 2$ on top by mistake is a common slip, and the given condition guarantees that the cancelled factor is not zero.",
      "在分子上找公因数，在分母上找平方差。所以 $\\frac{4x - 8}{x^2 - 4} = \\frac{4(x - 2)}{(x - 2)(x + 2)} = \\frac{4}{x + 2}$。错把 $x + 2$ 留在分子上是常见的疏漏；给定的条件保证了约去的因式不为零。",
    ),
  },
  "act-exam-combining-rational-expressions": {
    tip: t(
      "Fractions need a common denominator before adding. If one denominator is a multiple of the other, scale only the simpler fraction. For $\\frac{5}{x} + \\frac{1}{2x}$: rewrite as $\\frac{10}{2x} + \\frac{1}{2x} = \\frac{11}{2x}$. Adding numerators and denominators straight across is not valid.",
      "分式相加前要通分。一个分母是另一个的倍数时，只需放大较简单的分式。对 $\\frac{5}{x} + \\frac{1}{2x}$：改写为 $\\frac{10}{2x} + \\frac{1}{2x} = \\frac{11}{2x}$。分子分母直接分别相加是错的。",
    ),
    hardTip: t(
      "With unrelated binomial denominators, the common denominator is their product, and each numerator gets multiplied by the other denominator. For $\\frac{4}{x - 1} - \\frac{2}{x + 1}$: the numerator is $4(x + 1) - 2(x - 1) = 2x + 6$, over $x^2 - 1$. The subtraction changes the sign of both terms in the second product.",
      "分母是不相关的二项式时，公分母是它们的积，每个分子都要乘另一个分母。对 $\\frac{4}{x - 1} - \\frac{2}{x + 1}$：分子是 $4(x + 1) - 2(x - 1) = 2x + 6$，分母是 $x^2 - 1$。减法会改变第二个乘积中两项的符号。",
    ),
  },
  "act-exam-solving-rational-equations": {
    tip: t(
      "With one fraction on each side, cross-multiply and treat the denominator as a whole group. For $\\frac{x}{x + 6} = \\frac{2}{5}$: $5x = 2(x + 6)$, so $3x = 12$ and $x = 4$. Multiplying only the $x$ in the group loses a term. Check that no denominator becomes $0$.",
      "两边各有一个分式时，交叉相乘，并把分母作为整体。对 $\\frac{x}{x + 6} = \\frac{2}{5}$：$5x = 2(x + 6)$，所以 $3x = 12$，$x = 4$。只乘这组中的 $x$ 就少了一项。检查分母不为 $0$。",
    ),
    hardTip: t(
      "Multiply both sides by the denominator to clear the fraction; then divide and subtract. For $\\frac{20}{x + 3} = 4$: $20 = 4(x + 3)$, so $x + 3 = 5$ and $x = 2$. Stopping at the value of the whole denominator is the slip. A solution making the denominator $0$ must be rejected.",
      "两边同乘分母以消去分式；再做除法和减法。对 $\\frac{20}{x + 3} = 4$：$20 = 4(x + 3)$，所以 $x + 3 = 5$，$x = 2$。停在整个分母的值上是疏漏。使分母为 $0$ 的解必须舍去。",
    ),
  },
  "act-exam-solving-square-root-equations": {
    tip: t(
      "To undo a square root, square both sides, then solve the linear equation. For $\\sqrt{x + 2} = 4$: $x + 2 = 16$, so $x = 14$. Substitute back to confirm. Doubling the right side instead of squaring it gives a wrong value, and so does forgetting the constant inside.",
      "要消去平方根，两边平方，再解线性方程。对 $\\sqrt{x + 2} = 4$：$x + 2 = 16$，所以 $x = 14$。代回去确认。把右边加倍而不是平方会得到错误的值，忘了根号内的常数也一样。",
    ),
    hardTip: t(
      "Isolate the root before squaring, because squaring a sum does not remove it. For $\\sqrt{x - 1} + 3 = 7$: $\\sqrt{x - 1} = 4$, so $x - 1 = 16$ and $x = 17$. Squaring term by term, without first moving the $3$, is the invalid step. Then check the result in the original.",
      "平方之前先孤立根式，因为对和平方并不能消去根号。对 $\\sqrt{x - 1} + 3 = 7$：$\\sqrt{x - 1} = 4$，所以 $x - 1 = 16$，$x = 17$。不先移走 $3$ 就逐项平方是错误步骤。然后代回原式检验。",
    ),
  },
  "act-exam-solving-absolute-value-equations": {
    tip: t(
      "An equation $|x - a| = d$ says that $x$ is $d$ away from $a$, on either side. So $|x - 5| = 2$ has the solutions $3$ and $7$. Equivalently, split it into $x - 5 = 2$ and $x - 5 = -2$. Giving just one solution is the trap, as the bars allow both directions.",
      "方程 $|x - a| = d$ 表示 $x$ 到 $a$ 的距离为 $d$，两侧都可以。所以 $|x - 5| = 2$ 的解是 $3$ 和 $7$。等价地，拆成 $x - 5 = 2$ 和 $x - 5 = -2$。只给一个解就是陷阱，因为绝对值允许两个方向。",
    ),
    hardTip: t(
      "Isolate the bars by undoing the outside constant and coefficient, then split in two. For $2|x + 1| - 3 = 7$: $|x + 1| = 5$, so $x$ is $4$ or $-6$. Their sum is twice the centre: $2(-1) = -2$. Distributing the coefficient into the bars before isolating is the slip.",
      "消去外面的常数和系数，孤立绝对值，再拆成两种情况。对 $2|x + 1| - 3 = 7$：$|x + 1| = 5$，所以 $x$ 是 $4$ 或 $-6$。它们的和是中心的两倍：$2(-1) = -2$。孤立之前就把系数分配进绝对值是疏漏。",
    ),
  },
  "act-exam-writing-rate-and-earnings-models": {
    tip: t(
      "Flat amounts appear once, and rates multiply the variable. A worker paid a flat $20$ dollars plus $12$ dollars per hour earns $20 + 12h$. Attaching the hours to the flat fee, or to both amounts, as $(20 + 12)h$, charges the fee repeatedly, which is the wrong model.",
      "固定金额只出现一次，费率要乘变量。固定报酬 $20$ 美元、每小时 $12$ 美元的工人，收入是 $20 + 12h$。把小时数放到固定费用上，或者放到两个金额上，写成 $(20 + 12)h$，就重复收了固定费用，模型错了。",
    ),
    hardTip: t(
      "When a supply shrinks, subtract rate times time from the starting amount. A roll with $200$ sheets using $5$ each minute leaves $S = 200 - 5m$. Reversing it, as $5m - 200$, starts from a negative amount. Check at $m = 0$: the formula should give the full supply.",
      "存量减少时，从初始量中减去速率乘时间。$200$ 张的纸卷每分钟用 $5$ 张，剩下 $S = 200 - 5m$。反过来写成 $5m - 200$，一开始就是负数。用 $m = 0$ 检查：公式应给出全部存量。",
    ),
  },
  "act-exam-expressing-related-quantities": {
    tip: t(
      "Build from the known variable outward, one relation at a time. If Ben is $3$ years younger than Cal, whose age is $y$, then Ben is $y - 3$. If Ana is twice as old as Ben, Ana is $2(y - 3)$. Doubling only the $y$ forgets that the whole expression is multiplied.",
      "从已知变量出发，一次处理一个关系。Ben 比 Cal 小 $3$ 岁，Cal 的年龄是 $y$，则 Ben 是 $y - 3$。Ana 的年龄是 Ben 的两倍，则 Ana 是 $2(y - 3)$。只把 $y$ 加倍，就忘了要乘的是整个表达式。",
    ),
    hardTip: t(
      "Translate more than times as multiply first, then add: $5$ more than $2$ times $n$ is $2n + 5$. A total adds the original quantity as well. So the two groups together hold $n + 2n + 5 = 3n + 5$. Leaving out the first group, or writing $2(n + 5)$, misreads the phrase.",
      "“比几倍多”的翻译是先乘后加：比 $n$ 的 $2$ 倍多 $5$ 是 $2n + 5$。总数还要加上原来的量。所以两组共有 $n + 2n + 5 = 3n + 5$。漏掉第一组，或者写成 $2(n + 5)$，都是误读了这个说法。",
    ),
  },
  "act-exam-using-a-given-algebraic-model": {
    tip: t(
      "Substitute the value given for the input variable, multiply, and then add the fixed part. With $C = 20 + 4h$ and $6$ hours: $C = 20 + 24 = 44$. Adding the $20$ and $4$ before multiplying charges the fee every hour, and this produces the expected wrong value.",
      "把给定的值代入输入变量，先乘，再加固定部分。$C = 20 + 4h$，$6$ 小时：$C = 20 + 24 = 44$。先把 $20$ 和 $4$ 相加再乘，就每小时都收了固定费用，这会得到预料中的错误值。",
    ),
    hardTip: t(
      "When the output is given, set the model equal to it and solve for the input. With $H = 90 - 5t$ and $H = 50$: $5t = 40$, so $t = 8$. Substituting the output in place of $t$ is the error. Check by computing the model at your answer.",
      "输出已给出时，令模型等于它，解出输入。$H = 90 - 5t$，$H = 50$：$5t = 40$，所以 $t = 8$。把输出代入 $t$ 的位置就错了。用你的答案代入模型来验算。",
    ),
  },
  "act-exam-modeling-perimeter-problems": {
    tip: t(
      "Write the length in terms of the width, then use $P = 2(\\ell + w)$. With length $3$ more than width and perimeter $30$: $2(2w + 3) = 30$, so $2w + 3 = 15$ and $w = 6$. Forgetting that there are two widths and two lengths gives an equation that is off by a factor of two.",
      "用宽表示长，再用 $P = 2(\\ell + w)$。长比宽多 $3$、周长 $30$：$2(2w + 3) = 30$，所以 $2w + 3 = 15$，$w = 6$。忘了有两条宽和两条长，方程就差了两倍。",
    ),
    hardTip: t(
      "An isosceles triangle has three sides to add: two equal sides, plus the base in terms of them. If the base is $4$ longer than each equal side and the perimeter is $25$: $s + s + (s + 4) = 25$, so $s = 7$. Dividing the whole perimeter by $3$ ignores the extra length.",
      "等腰三角形有三条边要相加：两条相等的边，再加用它们表示的底。底比每条腰长 $4$、周长 $25$：$s + s + (s + 4) = 25$，所以 $s = 7$。直接用周长除以 $3$，就忽略了多出来的长度。",
    ),
  },
  "act-exam-modeling-cost-problems": {
    tip: t(
      "Each price multiplies its own quantity, and the two costs add. With pencils at $3$ dollars and rulers at $8$ dollars, the total for $p$ pencils and $r$ rulers is $3p + 8r$. Multiplying the two costs together, or crossing the prices, gives a formula that does not reflect the purchase.",
      "每个单价乘自己的数量，两部分费用相加。铅笔 $3$ 美元、尺子 $8$ 美元，$p$ 支铅笔和 $r$ 把尺子总价是 $3p + 8r$。把两部分费用相乘，或者把单价弄混，得到的公式都不符合这次购买。",
    ),
    hardTip: t(
      "If one count is known, subtract its cost from the total, then divide what is left by the other price. A $50$-dollar bill with $4$ rulers at $8$ dollars leaves $18$ dollars, which buys $6$ pencils at $3$ dollars. Dividing the total by the price without first subtracting overcounts the items.",
      "一种数量已知时，从总价中减去它的费用，再用余额除以另一种单价。账单 $50$ 美元，$4$ 把 $8$ 美元的尺子，剩 $18$ 美元，可买 $6$ 支 $3$ 美元的铅笔。不先减就用总价除以单价，就数多了。",
    ),
  },
  "act-exam-modeling-related-quantity-problems": {
    tip: t(
      "Let the variable be the group that everything else is measured from. Express the other group, then add them to the total. With $40$ items and one group $4$ more than twice the other: $n + 2n + 4 = 40$, so $3n = 36$ and $n = 12$. Using only $2n + 4$ ignores the base group.",
      "把其他量都以之为基准的那一组设为变量。表示出另一组，再相加等于总数。共 $40$ 件、一组比另一组的两倍多 $4$：$n + 2n + 4 = 40$，所以 $3n = 36$，$n = 12$。只用 $2n + 4$ 就忽略了基准组。",
    ),
    hardTip: t(
      "Consecutive even integers increase by $2$, so three of them are $e$, $e + 2$ and $e + 4$. A sum of $48$ gives $3e + 6 = 48$, so $e = 14$, and the greatest is $18$. Reading the question matters: it may want the largest, while $e$ is the smallest.",
      "连续偶数每次增加 $2$，所以三个数是 $e$、$e + 2$、$e + 4$。和为 $48$ 时，$3e + 6 = 48$，所以 $e = 14$，最大的是 $18$。看清题目很重要：它可能问最大的，而 $e$ 是最小的。",
    ),
  },
  "act-exam-writing-linear-models-from-data": {
    tip: t(
      "The slope is the change in $y$ per step in $x$. The intercept then comes from any pair. In a table with $(1, 5)$, $(2, 8)$ and $(3, 11)$: the slope is $3$, and $5 = 3(1) + b$ gives $b = 2$. Test the equation on another row. Reading the first $y$ as the intercept fails unless $x$ starts at $0$.",
      "斜率是 $x$ 每变化一步时 $y$ 的变化。截距再由任意一对数得到。表中有 $(1, 5)$、$(2, 8)$、$(3, 11)$：斜率是 $3$，由 $5 = 3(1) + b$ 得 $b = 2$。用另一行检验方程。除非 $x$ 从 $0$ 开始，否则把第一个 $y$ 当作截距是不对的。",
    ),
    hardTip: t(
      "From two points, compute the slope and walk from a known point to the new input. Through $(2, 9)$ and $(5, 18)$, the slope is $3$; going to $x = 10$ moves $8$ units, so the prediction is $9 + 3(8) = 33$. Multiplying the slope by $10$ alone ignores the starting value.",
      "由两点求斜率，再从已知点走到新的输入。过 $(2, 9)$ 和 $(5, 18)$，斜率是 $3$；走到 $x = 10$ 移动了 $8$ 个单位，预测值是 $9 + 3(8) = 33$。只用斜率乘 $10$ 就忽略了起始值。",
    ),
  },
  "act-exam-evaluating-a-function": {
    tip: t(
      "Replace every $x$ with the input, in parentheses, so that signs stay correct. For $f(x) = 2x^2 - x + 1$ at $-3$: $2(9) - (-3) + 1 = 22$. Without parentheses, the square loses its sign or the middle term goes wrong, and both produce the likely wrong options.",
      "把每个 $x$ 都换成输入，并加上括号，这样符号才对。$f(x) = 2x^2 - x + 1$ 在 $-3$ 处：$2(9) - (-3) + 1 = 22$。不加括号，平方就会丢了符号，或者中间项出错，这两种情况都会得到很可能的错误选项。",
    ),
    hardTip: t(
      "When the output is given, set the rule equal to it, and solve for the input; do not substitute the output for $x$. For $g(x) = 2x + 5$ with $g(k) = 17$: $2k = 12$, so $k = 6$. Evaluating $g(17)$ answers the opposite question.",
      "输出已给出时，令规则等于它，再解出输入；不要把输出代入 $x$。$g(x) = 2x + 5$，$g(k) = 17$：$2k = 12$，所以 $k = 6$。计算 $g(17)$ 就答了相反的问题。",
    ),
  },
  "act-exam-evaluating-function-compositions": {
    tip: t(
      "Evaluate from the inside out: compute the inner function at the number, then feed the result to the outer one. With $f(x) = x^2 + 1$ and $g(x) = 2x - 1$: $g(3) = 5$, and $f(5) = 26$. Reversing the order, or multiplying the two values, gives wrong options.",
      "由内向外计算：先求内层函数在这个数处的值，再把结果代入外层函数。$f(x) = x^2 + 1$，$g(x) = 2x - 1$：$g(3) = 5$，$f(5) = 26$。顺序颠倒，或者把两个值相乘，都是错误选项。",
    ),
    hardTip: t(
      "For a formula, put the entire inner expression in place of $x$, in parentheses, then distribute and collect. With $f(x) = 2x + 3$ and $g(x) = 4x - 1$: $g(f(x)) = 4(2x + 3) - 1 = 8x + 11$. The letter on the outside is applied last, so the order matters here.",
      "求表达式时，把整个内层表达式放到 $x$ 的位置，加上括号，再展开合并。$f(x) = 2x + 3$，$g(x) = 4x - 1$：$g(f(x)) = 4(2x + 3) - 1 = 8x + 11$。外层的字母最后作用，所以顺序很重要。",
    ),
  },
  "act-exam-writing-function-rules-from-data": {
    tip: t(
      "Read the value at $x = 0$ as the constant, and the steady change between rows as the slope. For $y$ values $6$, $4$, $2$ at $x = 0$, $1$, $2$: the constant is $6$ and the slope is $-2$, so $y = -2x + 6$. A falling table needs a negative slope. Check every row.",
      "把 $x = 0$ 处的值当作常数，把行与行之间的固定变化当作斜率。$x = 0$、$1$、$2$ 时 $y$ 为 $6$、$4$、$2$：常数是 $6$，斜率是 $-2$，所以 $y = -2x + 6$。下降的表格需要负斜率。每一行都要检查。",
    ),
    hardTip: t(
      "If the first differences are not constant, check the differences of those differences; a constant value means a quadratic. The coefficient of $x^2$ is half of it. For $y$ values $3$, $5$, $11$, $21$: the first differences are $2$, $6$, $10$, the second difference is $4$, and the rule is $y = 2x^2 + 3$.",
      "一阶差不恒定时，检查差的差；恒定就说明是二次函数。$x^2$ 的系数是它的一半。$y$ 值为 $3$、$5$、$11$、$21$ 时：一阶差是 $2$、$6$、$10$，二阶差是 $4$，规则是 $y = 2x^2 + 3$。",
    ),
  },
  "act-exam-matching-functions-to-representations": {
    tip: t(
      "Match a line by its $y$-intercept and slope. The intercept is where the line crosses the vertical axis, and the slope is rise over run between grid points. A line falling $2$ per $1$ to the right and crossing at $3$ is $y = -2x + 3$. A falling line needs a negative slope.",
      "用 $y$ 轴截距和斜率来匹配直线。截距是直线穿过竖直轴的位置，斜率是网格点之间的升高除以水平距离。向右每 $1$ 下降 $2$、在 $3$ 处穿过的直线是 $y = -2x + 3$。下降的直线需要负斜率。",
    ),
    hardTip: t(
      "To find $f(a)$ from a graph, go to $x = a$ on the horizontal axis and read the line's height. If the point falls beyond the grid, write the equation and substitute. For $y = -2x + 3$: $f(4) = -5$. Finding where $y$ equals the input is the opposite question.",
      "要从图象求 $f(a)$，在水平轴上找到 $x = a$，读出直线的高度。如果该点超出网格，就写出方程再代入。对 $y = -2x + 3$：$f(4) = -5$。求 $y$ 等于输入的位置是相反的问题。",
    ),
  },
  "act-exam-determining-rates-of-change": {
    tip: t(
      "Average rate is change in value over change in time: subtract both, then divide. A tree that is $12$ feet tall in year $1$ and $32$ feet tall in year $5$ grows $\\frac{20}{4} = 5$ feet per year. Dividing by the final year rather than the elapsed time is the trap.",
      "平均变化率是值的变化除以时间的变化：两者都相减，再相除。第 $1$ 年高 $12$ 英尺、第 $5$ 年高 $32$ 英尺的树，每年长 $\\frac{20}{4} = 5$ 英尺。除以最后的年份而不是经过的时间，就是陷阱。",
    ),
    hardTip: t(
      "For a function, compute the outputs at both ends, then use the same difference quotient. With $f(x) = x^2 + 2x$ from $1$ to $4$: $f(1) = 3$ and $f(4) = 24$, so the rate is $\\frac{21}{3} = 7$. A curve's rate depends on the interval, so reading a coefficient gives the wrong result.",
      "对函数来说，算出两端的输出，再用同样的差商。$f(x) = x^2 + 2x$ 从 $1$ 到 $4$：$f(1) = 3$，$f(4) = 24$，所以变化率是 $\\frac{21}{3} = 7$。曲线的变化率取决于区间，所以直接读系数会得到错误结果。",
    ),
  },
  "act-exam-finding-extreme-values-of-quadratics": {
    tip: t(
      "In vertex form $a(x - h)^2 + k$ with $a > 0$, the square is at least $0$, so the minimum value is $k$, reached at $x = h$. For $3(x + 2)^2 - 7$, the minimum is $-7$. The input $-2$ is where it occurs, and quoting that instead is the trap.",
      "顶点式 $a(x - h)^2 + k$ 中，$a > 0$ 时平方至少为 $0$，所以最小值是 $k$，在 $x = h$ 处取得。对 $3(x + 2)^2 - 7$，最小值是 $-7$。输入 $-2$ 是取得它的位置，答成这个就是陷阱。",
    ),
    hardTip: t(
      "In standard form, the vertex lies at $x = -\\frac{b}{2a}$, and a negative leading coefficient makes it a maximum. For $y = -x^2 + 8x - 3$: $x = -\\frac{8}{2(-1)} = 4$. Ignore the constant term, which shifts only the height. Keep the negative in the denominator.",
      "标准形式中，顶点在 $x = -\\frac{b}{2a}$，首项系数为负时是最大值。对 $y = -x^2 + 8x - 3$：$x = -\\frac{8}{2(-1)} = 4$。忽略常数项，它只改变高度。分母中的负号要保留。",
    ),
  },
  "act-exam-locating-points-on-a-parabola": {
    tip: t(
      "A parabola is symmetric about its axis, so a point has a mirror image at the same height, the same distance on the other side. With axis $x = 2$ and a point $(5, 1)$: the point is $3$ to the right, so $(-1, 1)$ is on it too. Reflecting the $y$-coordinate is the slip.",
      "抛物线关于对称轴对称，所以一个点在另一侧相同距离处有一个高度相同的镜像点。对称轴 $x = 2$、点 $(5, 1)$：这点在右边 $3$ 处，所以 $(-1, 1)$ 也在抛物线上。把 $y$ 坐标对称过去是疏漏。",
    ),
    hardTip: t(
      "The axis lies halfway between the $x$-intercepts, and the vertex is on the axis. So the function's value at that midpoint is the vertex's $y$-coordinate. With intercepts $1$ and $5$ and a vertex height of $-8$: the axis is $x = 3$, so $f(3) = -8$. No equation is needed.",
      "对称轴在两个 $x$ 轴截距的正中间，顶点在对称轴上。所以函数在这个中点的值就是顶点的 $y$ 坐标。截距 $1$ 和 $5$、顶点高度 $-8$：对称轴是 $x = 3$，所以 $f(3) = -8$。不需要方程。",
    ),
  },
  "act-exam-transforming-quadratic-functions": {
    tip: t(
      "A horizontal shift goes inside the square with the opposite sign, and a vertical shift goes outside with the natural sign. Moving $y = x^2$ by $2$ right and $5$ up gives $y = (x - 2)^2 + 5$. Writing $x - 2$ for a move left is the classic trap, since left means adding inside.",
      "水平平移写在平方里面，符号相反；竖直平移写在外面，符号不变。把 $y = x^2$ 向右移 $2$、向上移 $5$，得到 $y = (x - 2)^2 + 5$。向左移却写成 $x - 2$ 是典型陷阱，因为向左是在里面做加法。",
    ),
    hardTip: t(
      "This form names the vertex: $y = (x - h)^2 + k$ has vertex $(h, k)$. Read it, flipping the sign inside. Then right and up add to the coordinates, while left and down subtract. From $(x - 1)^2 + 6$, moving $5$ right and $2$ up reaches $(6, 8)$. Do not reuse the printed sign of $h$.",
      "这种形式直接给出顶点：$y = (x - h)^2 + k$ 的顶点是 $(h, k)$。读取时要把括号内的符号反过来。然后向右、向上就加到坐标上，向左、向下就减。从 $(x - 1)^2 + 6$ 向右移 $5$、向上移 $2$，到达 $(6, 8)$。不要照搬括号中 $h$ 的符号。",
    ),
  },
  "act-exam-evaluating-exponential-functions": {
    tip: t(
      "The exponent applies only to the base right below it, so compute the power first, then multiply by the coefficient. For $f(x) = 5 \\cdot 3^x$ at $2$: $3^2 = 9$, so $f(2) = 45$. Multiplying $5 \\cdot 3$ first and then squaring gives $225$, which is the trap.",
      "指数只作用在紧邻它下方的底数上，所以先算幂，再乘系数。$f(x) = 5 \\cdot 3^x$ 在 $2$ 处：$3^2 = 9$，所以 $f(2) = 45$。先算 $5 \\cdot 3$ 再平方得到 $225$，这就是陷阱。",
    ),
    hardTip: t(
      "With repeated doubling, first count the doublings: elapsed time divided by the doubling period. Then multiply the start by $2$ to that power. A count of $50$ doubling every $3$ hours for $15$ hours doubles $5$ times, reaching $50 \\cdot 32 = 1{,}600$. Using the hours as the exponent, or multiplying by $2$ times the count, is wrong.",
      "反复翻倍时，先数翻倍次数：经过的时间除以翻倍周期。再用初始量乘 $2$ 的这个次方。初始 $50$、每 $3$ 小时翻倍、经过 $15$ 小时，翻倍 $5$ 次，达到 $50 \\cdot 32 = 1{,}600$。把小时数当作指数，或者乘上 $2$ 与次数的积，都是错的。",
    ),
  },
  "act-exam-constructing-exponential-models": {
    tip: t(
      "Steady percent growth multiplies by the same factor each period, so the model is start times $(1 + r)^t$, with $r$ as a decimal. A club of $2{,}000$ members growing $3\\%$ yearly has $2{,}000(1.03)^t$. Using $0.03$ as the base, or adding $0.03t$, describes a different pattern.",
      "固定百分比增长是每期乘同一个因子，所以模型是初始量乘 $(1 + r)^t$，$r$ 用小数表示。$2{,}000$ 名成员的俱乐部每年增长 $3\\%$，即 $2{,}000(1.03)^t$。用 $0.03$ 作底数，或者加上 $0.03t$，描述的都是别的规律。",
    ),
    hardTip: t(
      "A percent loss works the same way, but the factor keeps what remains: $1 - r$. A machine worth $8{,}000$ dollars and losing $10\\%$ each year is worth $8{,}000(0.90)^n$ dollars. The usual errors use the lost part, $0.10$, as the base, or $1.10$, which would make the value grow.",
      "百分比减少的做法相同，但因子是剩下的部分：$1 - r$。价值 $8{,}000$ 美元、每年损失 $10\\%$ 的机器，价值为 $8{,}000(0.90)^n$ 美元。常见错误是用损失的部分 $0.10$ 作底数，或者用 $1.10$，那样价值反而会增长。",
    ),
  },
  "act-exam-identifying-features-of-exponential-functions": {
    tip: t(
      "The $y$-intercept comes from setting $x = 0$. Any nonzero base to the power $0$ is $1$, so $y = a \\cdot b^x + k$ crosses at $a + k$. For $y = 4 \\cdot 3^x + 2$, that is $6$. Reporting only the constant forgets the coefficient, which is what the wrong options count on.",
      "令 $x = 0$ 得到 $y$ 轴截距。任何非零底数的 $0$ 次方都是 $1$，所以 $y = a \\cdot b^x + k$ 在 $a + k$ 处穿过 $y$ 轴。$y = 4 \\cdot 3^x + 2$ 的截距是 $6$。只报常数就忘了系数，错误选项正是利用这一点。",
    ),
    hardTip: t(
      "A horizontal asymptote is the level the graph approaches but never reaches. With base above $1$ and $x$ decreasing, the term $a \\cdot b^x$ shrinks toward $0$, leaving only the added constant. So $y = 3 \\cdot 2^x + 4$ approaches $y = 4$. Keep the constant's sign, and do not confuse this with the intercept.",
      "水平渐近线是图象趋近但达不到的高度。底数大于 $1$、$x$ 减小时，$a \\cdot b^x$ 趋向 $0$，只剩下所加的常数。所以 $y = 3 \\cdot 2^x + 4$ 趋近 $y = 4$。要保留常数的符号，也不要把它与截距混淆。",
    ),
  },
  "act-exam-finding-points-and-zeros-of-a-function": {
    tip: t(
      "An $x$-intercept is where the graph meets the horizontal axis, so set $y = 0$ and solve. For $y = 3x - 12$: $3x = 12$, so $x = 4$. The constant $-12$ is the $y$-intercept, a different point, and it is the option most often chosen by mistake.",
      "$x$ 轴截距是图象与水平轴的交点，所以令 $y = 0$ 再求解。对 $y = 3x - 12$：$3x = 12$，所以 $x = 4$。常数 $-12$ 是 $y$ 轴截距，是另一个点，也是最常被误选的选项。",
    ),
    hardTip: t(
      "Every point on the $y$-axis has $x = 0$, so evaluate the function there and write the pair. For $g(x) = (x + 2)(x - 6)$: $g(0) = -12$, which gives $(0, -12)$. Setting each factor to $0$ finds the $x$-axis crossings instead, and these are the tempting wrong points.",
      "$y$ 轴上每个点都有 $x = 0$，所以在此处求函数值，再写成数对。对 $g(x) = (x + 2)(x - 6)$：$g(0) = -12$，得到 $(0, -12)$。令各因式为 $0$ 求的是与 $x$ 轴的交点，它们正是诱人的错误选项。",
    ),
  },
  "act-exam-finding-angles-formed-by-intersecting-lines": {
    tip: t(
      "When two lines cross, angles next to each other lie on a straight line and add to $180^\\circ$, while opposite angles are equal. Given $70^\\circ$, the neighbor is $110^\\circ$ and the opposite one is $70^\\circ$. First look at where the marked angle sits, since that decides which rule applies.",
      "两条直线相交时，相邻的角在一条直线上，和为 $180^\\circ$；相对的角相等。已知 $70^\\circ$，相邻的角是 $110^\\circ$，相对的角是 $70^\\circ$。先看标记的角在什么位置，这决定用哪条规则。",
    ),
    hardTip: t(
      "Vertical angles match, so an angle written with a variable has the same size as its numeric partner, and you need not solve for $x$. If $(3x + 5)^\\circ$ is opposite $50^\\circ$, a neighbor is $130^\\circ$. Answering with $x$, or with the vertical angle itself, misses the request.",
      "对顶角相等，所以用变量表示的角与它相对的数值角一样大，不必解出 $x$。若 $(3x + 5)^\\circ$ 与 $50^\\circ$ 相对，相邻的角是 $130^\\circ$。答成 $x$ 或对顶角本身，都没答到所问的内容。",
    ),
  },
  "act-exam-finding-angles-with-parallel-lines": {
    tip: t(
      "A line crossing two parallel lines repeats the same picture at both crossings. Angles in the same position are corresponding and equal, and alternate interior angles are also equal. So a $65^\\circ$ angle reappears as $65^\\circ$. Its supplement, $115^\\circ$, belongs to the neighboring position, so compare positions before answering.",
      "一条直线穿过两条平行线时，两个交点处的图形完全相同。位置相同的角是同位角，相等；内错角也相等。所以 $65^\\circ$ 的角会再次以 $65^\\circ$ 出现。它的补角 $115^\\circ$ 属于相邻的位置，所以回答前要比较位置。",
    ),
    hardTip: t(
      "When a corresponding angle is written with a variable, set the two expressions equal, since those angles match, and solve. From $(3x + 10)^\\circ$ and $55^\\circ$: $3x = 45$, so $x = 15$. The question wants $x$, not the angle. Do not add the two to $180$ unless they are supplementary.",
      "同位角用变量表示时，令两个表达式相等，因为这两个角相等，然后求解。由 $(3x + 10)^\\circ$ 和 $55^\\circ$：$3x = 45$，所以 $x = 15$。题目要的是 $x$，不是角度。除非两角互补，否则不要令它们的和为 $180$。",
    ),
  },
  "act-exam-problem-solving-with-parallel-lines": {
    tip: t(
      "A segment parallel to a triangle's side creates a smaller triangle with the same angles. In triangle $ABC$ with $\\overline{DE} \\parallel \\overline{BC}$, angle $ADE$ matches angle $B$ and angle $AED$ matches angle $C$. Match by position along the side: an angle at $E$ sits on $\\overline{AC}$, so it pairs with the angle at $C$. Swapping the pair is the trap.",
      "与三角形一边平行的线段形成一个角相同的小三角形。在三角形 $ABC$ 中，$\\overline{DE} \\parallel \\overline{BC}$，角 $ADE$ 对应角 $B$，角 $AED$ 对应角 $C$。按所在的边来对应：$E$ 处的角在 $\\overline{AC}$ 上，所以与 $C$ 处的角配对。配反了就是陷阱。",
    ),
    hardTip: t(
      "Two parallel lines and a transversal make eight angles of only two sizes: four equal $a$, and four equal $180^\\circ - a$. With $a = 50^\\circ$, the others are $130^\\circ$ each and total $520^\\circ$. The answer multiplies the supplement by $4$. All eight together always total $720^\\circ$, which gives a check.",
      "两条平行线和一条截线形成八个角，只有两种大小：四个等于 $a$，四个等于 $180^\\circ - a$。$a = 50^\\circ$ 时，其余每个 $130^\\circ$，总和 $520^\\circ$。答案是补角乘 $4$。八个角的总和永远是 $720^\\circ$，可以用来检验。",
    ),
  },
  "act-exam-finding-interior-angles-of-triangles": {
    tip: t(
      "The three interior angles of any triangle total $180^\\circ$, so subtract the two known angles from it. Given $50^\\circ$ and $60^\\circ$, the third is $70^\\circ$. Adding the two and stopping gives their sum, not the missing angle, and this is the first thing to avoid.",
      "任何三角形的三个内角和都是 $180^\\circ$，所以从中减去两个已知角。已知 $50^\\circ$ 和 $60^\\circ$，第三个角是 $70^\\circ$。两角相加后就停下，得到的是它们的和，而不是所缺的角，这是首先要避免的。",
    ),
    hardTip: t(
      "When angles are given as expressions, add them, set the total to $180$, solve, and then substitute to get each angle. For $x^\\circ$, $2x^\\circ$ and $(3x + 30)^\\circ$: $6x + 30 = 180$, so $x = 25$, and the angles are $25^\\circ$, $50^\\circ$ and $105^\\circ$. Compare all three before naming one.",
      "角用表达式给出时，把它们相加，令总和为 $180$，求解，再代入得到每个角。$x^\\circ$、$2x^\\circ$、$(3x + 30)^\\circ$：$6x + 30 = 180$，所以 $x = 25$，三个角是 $25^\\circ$、$50^\\circ$、$105^\\circ$。比较这三个角之后再作答。",
    ),
  },
  "act-exam-finding-exterior-angles-of-triangles": {
    tip: t(
      "An exterior angle equals the sum of the two interior angles that do not touch it. With remote angles of $35^\\circ$ and $60^\\circ$, the exterior angle is $95^\\circ$. Subtracting their sum from $180^\\circ$ gives the interior angle next to it, which is the wrong one.",
      "外角等于与它不相邻的两个内角之和。不相邻的内角是 $35^\\circ$ 和 $60^\\circ$ 时，外角是 $95^\\circ$。用 $180^\\circ$ 减去它们的和，得到的是相邻的内角，那就答错了。",
    ),
    hardTip: t(
      "The interior angle beside an exterior angle forms a straight line with it, so subtract from $180^\\circ$. An exterior angle of $120^\\circ$ has a neighbor of $60^\\circ$. If a remote angle of $50^\\circ$ is also given, it is a distractor: subtracting it from $120^\\circ$ finds the other remote angle, not the neighbor.",
      "外角旁边的内角与它组成一条直线，所以从 $180^\\circ$ 中减去。$120^\\circ$ 的外角，相邻内角是 $60^\\circ$。如果还给了一个不相邻的内角 $50^\\circ$，它只是干扰：用 $120^\\circ$ 减去它，得到的是另一个不相邻的内角，而不是相邻内角。",
    ),
  },
  "act-exam-finding-angles-in-isosceles-triangles": {
    tip: t(
      "Congruent sides face equal angles, so the two base angles match. Double the known base angle and subtract from $180^\\circ$ to get the top. A base angle of $55^\\circ$ gives a top angle of $70^\\circ$. Subtracting just one base angle forgets its twin, and this produces the tempting $125^\\circ$.",
      "相等的边对着相等的角，所以两个底角相等。把已知底角加倍，再从 $180^\\circ$ 中减去，得到顶角。底角 $55^\\circ$ 时顶角是 $70^\\circ$。只减一个底角就忘了另一个，会得到诱人的 $125^\\circ$。",
    ),
    hardTip: t(
      "An extended base adds one step: the outside angle and the base angle next to it are supplementary, so find the base angle first. Then proceed as usual. An outside angle of $130^\\circ$ gives base angles of $50^\\circ$ and a top angle of $80^\\circ$. Treating the outside angle as a base angle is impossible, since two of them exceed $180^\\circ$.",
      "底边延长多了一步：外面的角与相邻底角互补，所以先求底角。然后照常计算。外面的角 $130^\\circ$，底角是 $50^\\circ$，顶角是 $80^\\circ$。把外面的角当作底角是不可能的，因为两个这样的角就超过了 $180^\\circ$。",
    ),
  },
  "act-exam-problem-solving-with-isosceles-triangles": {
    tip: t(
      "Equal segments reveal a hidden isosceles triangle, whose two angles opposite those segments match. Then use the exterior angle rule. If $AD = BD$ and angle $B$ is $40^\\circ$, angle $BAD$ is $40^\\circ$ too, so the exterior angle $ADC$ is $80^\\circ$. Reading angle $ADC$ as the supplement of only one angle is the slip.",
      "相等的线段揭示出隐藏的等腰三角形，这两条线段所对的两个角相等。然后用外角规则。若 $AD = BD$，角 $B$ 是 $40^\\circ$，则角 $BAD$ 也是 $40^\\circ$，所以外角 $ADC$ 是 $80^\\circ$。把角 $ADC$ 当作只与一个角互补是疏漏。",
    ),
    hardTip: t(
      "Perimeter is two equal sides plus the base, so subtract the base and halve the rest: $s = \\frac{P - b}{2}$. With perimeter $30$ and base $8$: $s = 11$. Stopping before halving gives both sides together, and dividing the perimeter by $3$ wrongly treats the triangle as equilateral.",
      "周长是两条相等的边加底，所以减去底，再把余下的减半：$s = \\frac{P - b}{2}$。周长 $30$、底 $8$：$s = 11$。不减半就是两条边的总和，用周长除以 $3$ 则错把它当作等边三角形。",
    ),
  },
  "act-exam-identifying-corresponding-parts-under-congruence": {
    tip: t(
      "A congruence statement lists matching vertices in order, so the first letter pairs with the first, and so on. In $\\triangle ABC \\cong \\triangle DEF$, side $\\overline{AC}$ matches $\\overline{DF}$ because $A$ pairs with $D$ and $C$ with $F$. Use the letters, not how the figures look, since the drawing may be rotated.",
      "全等式按顺序列出对应的顶点，第一个字母配第一个，依此类推。在 $\\triangle ABC \\cong \\triangle DEF$ 中，边 $\\overline{AC}$ 对应 $\\overline{DF}$，因为 $A$ 配 $D$，$C$ 配 $F$。要依据字母，而不是图形的样子，因为图可能被旋转过。",
    ),
    hardTip: t(
      "Find which vertex in the first triangle pairs with the requested angle, then compute that angle from the triangle sum. In $\\triangle ABC \\cong \\triangle DEF$ with angle $A$ at $50^\\circ$ and angle $C$ at $65^\\circ$: angle $E$ pairs with $B$, the third angle, so it measures $65^\\circ$. Copying a given angle skips the pairing.",
      "先找出第一个三角形中与所求角配对的顶点，再用内角和算出这个角。$\\triangle ABC \\cong \\triangle DEF$，角 $A$ 为 $50^\\circ$，角 $C$ 为 $65^\\circ$：角 $E$ 与第三个角 $B$ 配对，所以是 $65^\\circ$。直接照抄已知角就跳过了配对。",
    ),
  },
  "act-exam-using-corresponding-parts-under-similarity": {
    tip: t(
      "Similar triangles have equal matching angles, read from the order of the letters. Transfer the known angle to one triangle, then use the $180^\\circ$ sum. If $\\triangle ABC \\sim \\triangle DEF$, with angle $A$ at $50^\\circ$ and angle $E$ at $60^\\circ$, then angle $B$ is $60^\\circ$ and angle $C$ is $70^\\circ$. Sides change, but angles do not.",
      "相似三角形的对应角相等，按字母顺序读出。把已知角转到同一个三角形中，再用 $180^\\circ$ 的和。若 $\\triangle ABC \\sim \\triangle DEF$，角 $A$ 为 $50^\\circ$，角 $E$ 为 $60^\\circ$，则角 $B$ 是 $60^\\circ$，角 $C$ 是 $70^\\circ$。边会变，角不会变。",
    ),
    hardTip: t(
      "Matching sides have a constant ratio, so get the scale from a pair with both lengths known, then apply it in the right direction. With $AB = 4$, $DE = 12$ and $EF = 15$, the second triangle is $3$ times larger, so $BC = 5$. Multiplying where you should divide gives an answer that is too big.",
      "对应边的比值不变，所以先由两边都已知的一对求出比例，再按正确方向使用。$AB = 4$，$DE = 12$，$EF = 15$，第二个三角形大 $3$ 倍，所以 $BC = 5$。该除时做了乘法，得到的结果就太大了。",
    ),
  },
  "act-exam-finding-corresponding-lengths-in-similar-figures": {
    tip: t(
      "A similar enlargement multiplies every length by one factor. Divide the new width by the old one, then multiply the old length by that. A $4$ by $6$ picture widened to $12$ has factor $3$, so its length is $18$. Adding the $8$ to the length keeps a wrong shape and is the trap.",
      "相似放大把每个长度都乘同一个因子。用新宽除以旧宽，再用这个因子乘旧长。$4$ 乘 $6$ 的图片宽度放大到 $12$，因子是 $3$，长度是 $18$。把长度也加上 $8$ 会使形状不对，这就是陷阱。",
    ),
    hardTip: t(
      "Shadows at the same moment form similar right triangles, so height over shadow is the same for both objects. A $3$-foot stick casting $2$ feet, with a pole casting $12$ feet, gives a pole height of $18$ feet: the shadow is $6$ times longer. Pairing a height with the wrong shadow flips the ratio.",
      "同一时刻的影子形成相似直角三角形，所以两个物体的高与影长之比相同。$3$ 英尺的木棍影长 $2$ 英尺，杆子影长 $12$ 英尺，杆高是 $18$ 英尺：影子长了 $6$ 倍。把高和错误的影子配对，比例就反了。",
    ),
  },
  "act-exam-using-scale-factors-in-similar-figures": {
    tip: t(
      "A scale factor multiplies every side, so the perimeter scales by that same factor. Add the sides and multiply, or scale each side first. Sides $3$, $4$ and $5$ with factor $2$ give a perimeter of $24$. Squaring the factor applies to area, not to perimeter.",
      "比例因子乘每条边，所以周长也按同样的因子变化。把各边相加再乘，或者先把每条边放大。边长 $3$、$4$、$5$，因子 $2$，周长是 $24$。把因子平方适用于面积，不适用于周长。",
    ),
    hardTip: t(
      "A map scale is a rate: distance on the ground per inch on paper. To go from real distance to map distance, divide by that rate. At $20$ miles per inch, $100$ miles is $5$ inches. Multiplying instead goes the wrong way and gives an impossibly large map distance.",
      "地图比例尺是一个比率：纸上每英寸代表的实际距离。从实际距离换算到地图距离，要除以这个比率。每英寸 $20$ 英里时，$100$ 英里是 $5$ 英寸。改做乘法就走反了方向，会得到大得离谱的地图距离。",
    ),
  },
  "act-exam-finding-areas-of-similar-figures": {
    tip: t(
      "Area involves two lengths, so when lengths scale by $k$, area scales by $k^2$. A shape of area $5$ with sides $3$ times longer has area $5 \\cdot 9 = 45$. Multiplying just by $3$ is the trap, because it treats area like a length.",
      "面积涉及两个长度，所以长度按 $k$ 变化时，面积按 $k^2$ 变化。面积 $5$ 的图形，边长变为 $3$ 倍后，面积是 $5 \\cdot 9 = 45$。只乘 $3$ 就是陷阱，因为它把面积当成了长度。",
    ),
    hardTip: t(
      "This reverses the rule: divide the areas, take the square root, and use that as the length factor. With areas $4$ and $100$, the ratio is $25$, so lengths scale by $5$, and a side of $3$ becomes $15$. Multiplying the side by the area ratio without the root is the error.",
      "这是规则的逆用：把面积相除，开平方，作为长度因子。面积 $4$ 和 $100$，比值是 $25$，所以长度按 $5$ 变化，边长 $3$ 变为 $15$。不开方就用面积比乘边长，就错了。",
    ),
  },
  "act-exam-applying-the-pythagorean-theorem": {
    tip: t(
      "The hypotenuse is opposite the right angle, and $a^2 + b^2 = c^2$. To find a leg, subtract: $b = \\sqrt{c^2 - a^2}$. With hypotenuse $10$ and leg $6$: $\\sqrt{100 - 36} = 8$. Adding the squares when the missing side is a leg gives a length longer than the hypotenuse, which cannot be right.",
      "斜边在直角的对面，$a^2 + b^2 = c^2$。求直角边要做减法：$b = \\sqrt{c^2 - a^2}$。斜边 $10$、直角边 $6$：$\\sqrt{100 - 36} = 8$。所求为直角边时却把平方相加，得到的长度比斜边还长，这不可能。",
    ),
    hardTip: t(
      "Distance between two points is a hypotenuse: the differences in $x$ and in $y$ are the legs. From $(1, 2)$ to $(4, 6)$, the legs are $3$ and $4$, so the distance is $\\sqrt{9 + 16} = 5$. Adding the two differences, or forgetting the final square root, is the usual mistake.",
      "两点间的距离是一条斜边：$x$ 的差和 $y$ 的差是两条直角边。从 $(1, 2)$ 到 $(4, 6)$，直角边是 $3$ 和 $4$，所以距离是 $\\sqrt{9 + 16} = 5$。把两个差直接相加，或者忘了最后开方，是常见错误。",
    ),
  },
  "act-exam-modeling-situations-using-the-pythagorean-theorem": {
    tip: t(
      "Perpendicular directions such as east and north form a right angle, so the straight route between the ends is the hypotenuse. A walk of $6$ blocks east and $8$ north has a direct distance of $\\sqrt{36 + 64} = 10$. The sum, $14$, is the walked route and not the shortcut.",
      "东和北这样互相垂直的方向构成直角，所以两端之间的直线路线是斜边。向东走 $6$ 个街区再向北走 $8$ 个，直线距离是 $\\sqrt{36 + 64} = 10$。和 $14$ 是走过的路程，不是捷径。",
    ),
    hardTip: t(
      "A wire, pole and ground form a right triangle in which the wire is the hypotenuse. Subtract squares for the height, then answer what is asked, which may be a difference. A $10$-foot wire staked $6$ feet from the base gives a pole of $8$ feet, so the pole is $2$ feet shorter.",
      "绳索、杆子和地面构成直角三角形，绳索是斜边。把平方相减求高度，再回答所问的内容，可能是一个差。$10$ 英尺的绳索固定在离杆底 $6$ 英尺处，杆高 $8$ 英尺，所以杆子短 $2$ 英尺。",
    ),
  },
  "act-exam-problem-solving-with-special-triangles": {
    tip: t(
      "A square's diagonal creates two $45$-$45$-$90$ triangles, whose sides are in the ratio $1 : 1 : \\sqrt{2}$. So the diagonal is $s\\sqrt{2}$, and a square of side $7$ has diagonal $7\\sqrt{2}$. Doubling the side, or using $\\sqrt{3}$ from the other special triangle, gives the wrong options.",
      "正方形的对角线形成两个 $45$-$45$-$90$ 三角形，边长之比为 $1 : 1 : \\sqrt{2}$。所以对角线是 $s\\sqrt{2}$，边长 $7$ 的正方形对角线是 $7\\sqrt{2}$。把边长加倍，或者用另一种特殊三角形的 $\\sqrt{3}$，都是错误选项。",
    ),
    hardTip: t(
      "A $30$-$60$-$90$ triangle has sides in the ratio $1 : \\sqrt{3} : 2$, so the side opposite $30^\\circ$ is half the hypotenuse. A slide $14$ feet long at $30^\\circ$ rises $7$ feet. Multiplying by $\\sqrt{3}$ gives the horizontal run, which is the side opposite $60^\\circ$, and not the height.",
      "$30$-$60$-$90$ 三角形的边长之比为 $1 : \\sqrt{3} : 2$，所以 $30^\\circ$ 所对的边是斜边的一半。长 $14$ 英尺、倾角 $30^\\circ$ 的滑梯升高 $7$ 英尺。乘 $\\sqrt{3}$ 得到的是水平距离，即 $60^\\circ$ 所对的边，而不是高度。",
    ),
  },
  "act-exam-finding-trigonometric-ratios": {
    tip: t(
      "Label the sides from the named angle: sine is opposite over hypotenuse, cosine is adjacent over hypotenuse, tangent is opposite over adjacent. In a $3$-$4$-$5$ triangle with the side $3$ opposite $A$, $\\cos A = \\frac{4}{5}$. Mixing the opposite and adjacent sides gives the sine instead.",
      "从所给的角来标记各边：正弦是对边比斜边，余弦是邻边比斜边，正切是对边比邻边。在 $3$-$4$-$5$ 三角形中，边 $3$ 与 $A$ 相对，$\\cos A = \\frac{4}{5}$。把对边和邻边弄混，得到的就是正弦了。",
    ),
    hardTip: t(
      "With no figure, sketch the triangle from its letters, placing the right angle first. If angle $B$ is right, $AB = 3$ and $BC = 4$, then from $C$ the opposite side is $\\overline{AB}$ and the adjacent side is $\\overline{BC}$, so $\\tan C = \\frac{3}{4}$. The reciprocal is the tangent of the other acute angle.",
      "没有图时，按字母画出三角形，先定直角。若角 $B$ 是直角，$AB = 3$，$BC = 4$，则从 $C$ 看，对边是 $\\overline{AB}$，邻边是 $\\overline{BC}$，所以 $\\tan C = \\frac{3}{4}$。它的倒数是另一个锐角的正切。",
    ),
  },
  "act-exam-finding-a-trigonometric-ratio-from-other-ratios": {
    tip: t(
      "Turn the given ratio into a right triangle, find the third side with the Pythagorean theorem, then read off the requested ratio. For $\\cos \\theta = \\frac{8}{17}$: adjacent $8$, hypotenuse $17$, opposite $15$. So $\\tan \\theta = \\frac{15}{8}$. Inverting the fraction gives the tangent of the complementary angle.",
      "把给定的比值变成直角三角形，用勾股定理求第三边，再读出所求的比值。对 $\\cos \\theta = \\frac{8}{17}$：邻边 $8$，斜边 $17$，对边 $15$。所以 $\\tan \\theta = \\frac{15}{8}$。把分数颠倒，得到的是余角的正切。",
    ),
    hardTip: t(
      "Outside the first quadrant, the triangle gives the size and the quadrant gives the sign. In the third quadrant, sine and cosine are negative and tangent is positive. With $\\tan \\theta = \\frac{3}{4}$ there, the triangle is $3$-$4$-$5$, so $\\cos \\theta = -\\frac{4}{5}$. Leaving off the sign is the trap.",
      "不在第一象限时，三角形决定大小，象限决定符号。第三象限中正弦和余弦为负，正切为正。在那里 $\\tan \\theta = \\frac{3}{4}$ 时，三角形是 $3$-$4$-$5$，所以 $\\cos \\theta = -\\frac{4}{5}$。漏掉符号就是陷阱。",
    ),
  },
  "act-exam-using-cofunction-relationships": {
    tip: t(
      "The sine of an angle equals the cosine of its complement: $\\sin \\theta = \\cos(90^\\circ - \\theta)$. So $\\sin 35^\\circ = \\cos 55^\\circ$. The change must happen in both the function and the angle: $\\cos 35^\\circ$ or $\\sin 55^\\circ$ alone is a different value.",
      "一个角的正弦等于它余角的余弦：$\\sin \\theta = \\cos(90^\\circ - \\theta)$。所以 $\\sin 35^\\circ = \\cos 55^\\circ$。函数和角度都要变：只有 $\\cos 35^\\circ$ 或 $\\sin 55^\\circ$ 都是另一个值。",
    ),
    hardTip: t(
      "In a right triangle, the acute angles are complementary, and the side opposite one is adjacent to the other. Therefore $\\sin B = \\cos A$, with no calculation. If $\\cos A = \\frac{3}{5}$, then $\\sin B = \\frac{3}{5}$. Computing $\\sin A = \\frac{4}{5}$ answers about the wrong angle.",
      "直角三角形中，两个锐角互余，一个角的对边是另一个角的邻边。因此 $\\sin B = \\cos A$，无需计算。若 $\\cos A = \\frac{3}{5}$，则 $\\sin B = \\frac{3}{5}$。算出 $\\sin A = \\frac{4}{5}$ 就答成了另一个角。",
    ),
  },
  "act-exam-finding-a-side-from-a-trigonometric-ratio": {
    tip: t(
      "A ratio tells a proportion, not the actual lengths. Identify which side the ratio compares with the known side, then multiply. If $\\sin A = \\frac{3}{5}$ and the hypotenuse is $20$, the opposite side is $\\frac{3}{5}(20) = 12$. Reading off the numerator as the length ignores the true size.",
      "比值表示的是比例，而不是实际长度。判断这个比值把哪条边与已知边相比，再相乘。若 $\\sin A = \\frac{3}{5}$，斜边是 $20$，对边是 $\\frac{3}{5}(20) = 12$。直接把分子读作长度就忽略了实际大小。",
    ),
    hardTip: t(
      "In a real scene, the distance along level ground is the side adjacent to the angle of elevation, and the height is the opposite side. So height equals distance times $\\tan \\theta$. Standing $40$ meters away with $\\tan \\theta = \\frac{3}{4}$ gives $30$ meters. Dividing by the ratio reverses the relation.",
      "实际情境中，水平距离是仰角的邻边，高度是对边。所以高度等于距离乘 $\\tan \\theta$。站在 $40$ 米外，$\\tan \\theta = \\frac{3}{4}$，高度是 $30$ 米。除以这个比值就把关系弄反了。",
    ),
  },
  "act-exam-finding-perimeters-of-figures": {
    tip: t(
      "Perimeter is the distance around, so a rectangle uses $2\\ell + 2w$. A pen $9$ by $4$ needs $26$ units of fencing. The tempting wrong values are the area, $36$, and the sum of just one length and one width, $13$, which covers only half the way around.",
      "周长是绕一圈的距离，所以长方形用 $2\\ell + 2w$。$9$ 乘 $4$ 的围栏需要 $26$ 个单位。诱人的错误值是面积 $36$，以及只加一条长和一条宽的 $13$，那只走了半圈。",
    ),
    hardTip: t(
      "Move between regular shapes through the common side. Divide the known perimeter by its number of sides, then multiply by the other shape's count: pentagons have $5$, hexagons $6$ and octagons $8$. A square of perimeter $40$ shares side $10$ with a hexagon of perimeter $60$. Equal sides do not mean equal perimeters.",
      "通过共同的边长在正多边形之间转换。用已知周长除以它的边数，再乘另一个图形的边数：五边形 $5$ 条，六边形 $6$ 条，八边形 $8$ 条。周长 $40$ 的正方形与周长 $60$ 的六边形边长同为 $10$。边长相等并不等于周长相等。",
    ),
  },
  "act-exam-finding-areas-involving-circles": {
    tip: t(
      "Area is $\\pi r^2$, using the radius. Check the figure: if a diameter is marked, halve it first. A radius of $5$ gives $25\\pi$. The value $10\\pi$ is the circumference, a common wrong option, and squaring a diameter without halving makes the area four times too large.",
      "面积是 $\\pi r^2$，用的是半径。看清图：如果标的是直径，先减半。半径 $5$ 时面积是 $25\\pi$。$10\\pi$ 是周长，这是常见的错误选项；不减半就把直径平方，面积会大到四倍。",
    ),
    hardTip: t(
      "Circumference gives the radius, and the radius gives the area. Solve $2\\pi r = C$ first, then square. From $C = 14\\pi$: $r = 7$, so the area is $49\\pi$. The number in front of $\\pi$ is the diameter, so squaring it directly gives an area four times too big.",
      "周长给出半径，半径给出面积。先解 $2\\pi r = C$，再平方。由 $C = 14\\pi$：$r = 7$，所以面积是 $49\\pi$。$\\pi$ 前面的数是直径，直接平方得到的面积会大到四倍。",
    ),
  },
  "act-exam-finding-arc-length": {
    tip: t(
      "An arc is a fraction of the circumference: $\\frac{\\theta}{360} \\cdot 2\\pi r$. Reduce the fraction, then multiply. A $60^\\circ$ sector with radius $12$ has arc $\\frac{1}{6}(24\\pi) = 4\\pi$. Using $\\pi r^2$ gives the sector's area instead of the length around its edge.",
      "弧是周长的一部分：$\\frac{\\theta}{360} \\cdot 2\\pi r$。先约分，再相乘。圆心角 $60^\\circ$、半径 $12$ 的扇形，弧长是 $\\frac{1}{6}(24\\pi) = 4\\pi$。用 $\\pi r^2$ 得到的是扇形面积，而不是边缘的长度。",
    ),
    hardTip: t(
      "Each full turn travels one circumference, and any leftover angle adds an arc. With radius $10$, two turns and a further $90^\\circ$: $2(20\\pi) + \\frac{1}{4}(20\\pi) = 45\\pi$. Leaving out either the full turns or the leftover is the trap, so compute them separately and add.",
      "每转一整圈走过一个周长，剩下的角再加一段弧。半径 $10$，转两圈再加 $90^\\circ$：$2(20\\pi) + \\frac{1}{4}(20\\pi) = 45\\pi$。漏掉整圈或剩余部分就是陷阱，所以分开计算再相加。",
    ),
  },
  "act-exam-writing-the-equation-of-a-circle": {
    tip: t(
      "A circle with center $(h, k)$ and radius $r$ has the equation $(x - h)^2 + (y - k)^2 = r^2$. For center $(2, -5)$ and radius $4$: $(x - 2)^2 + (y + 5)^2 = 16$. Two traps appear: keeping the center's printed signs, and writing $r$ rather than $r^2$ on the right.",
      "圆心 $(h, k)$、半径 $r$ 的圆，方程是 $(x - h)^2 + (y - k)^2 = r^2$。圆心 $(2, -5)$、半径 $4$：$(x - 2)^2 + (y + 5)^2 = 16$。有两个陷阱：沿用圆心坐标原有的符号，以及右边写 $r$ 而不是 $r^2$。",
    ),
    hardTip: t(
      "If a point on the circle replaces the radius, find $r^2$ directly: square the changes in $x$ and $y$ from the center, and add. With center $(1, 1)$ through $(6, 13)$: $r^2 = 25 + 144 = 169$, so $(x - 1)^2 + (y - 1)^2 = 169$. No root is needed, and $13$ alone on the right is wrong.",
      "如果给的是圆上一点而不是半径，就直接求 $r^2$：把 $x$ 和 $y$ 相对圆心的变化量平方再相加。圆心 $(1, 1)$，过 $(6, 13)$：$r^2 = 25 + 144 = 169$，所以 $(x - 1)^2 + (y - 1)^2 = 169$。不需要开方，右边只写 $13$ 就错了。",
    ),
  },
  "act-exam-problem-solving-with-circles": {
    tip: t(
      "In standard form, the right side is already $r^2$. Since area is $\\pi r^2$, the area is simply that number times $\\pi$. For $(x - 1)^2 + (y + 2)^2 = 49$, the area is $49\\pi$. Squaring the $49$ again is the trap, and $14\\pi$ is the circumference.",
      "标准形式中，右边已经是 $r^2$。面积是 $\\pi r^2$，所以就是这个数乘 $\\pi$。$(x - 1)^2 + (y + 2)^2 = 49$ 的面积是 $49\\pi$。把 $49$ 再平方就是陷阱，$14\\pi$ 是周长。",
    ),
    hardTip: t(
      "A vertical tangent touches the circle at its extreme left or right point, one radius from the center horizontally. So a line to the right is $x = h + r$, and one to the left is $x = h - r$. For $(x - 2)^2 + (y + 1)^2 = 16$, the right tangent is $x = 6$. Use $r$, not $r^2$.",
      "竖直切线在圆的最左或最右点与圆相切，距圆心水平方向一个半径。所以右侧的线是 $x = h + r$，左侧的线是 $x = h - r$。对 $(x - 2)^2 + (y + 1)^2 = 16$，右侧切线是 $x = 6$。要用 $r$，不是 $r^2$。",
    ),
  },
  "act-exam-further-problem-solving-with-circles": {
    tip: t(
      "Group each variable and complete the square: halve each linear coefficient. The center's coordinates are those halves with reversed signs. For $x^2 + y^2 - 4x + 10y + c = 0$: halves are $-2$ and $5$, so the center is $(2, -5)$. Keeping the halves' signs produces the mirror-image point, which is a likely wrong option.",
      "把每个变量分组并配方：把一次项系数减半。圆心坐标就是这两个一半，符号相反。对 $x^2 + y^2 - 4x + 10y + c = 0$：一半是 $-2$ 和 $5$，所以圆心是 $(2, -5)$。保留一半的符号会得到对称的点，这是很可能的错误选项。",
    ),
    hardTip: t(
      "Beyond the center, track what gets added: the square of each half goes to the right side, as does the constant after moving. For $x^2 + y^2 - 4x + 10y - 7 = 0$: $r^2 = 7 + 4 + 25 = 36$, so $r = 6$. Forgetting the added squares, or stopping at $r^2$, is wrong.",
      "除了圆心，还要记下所加的量：每个一半的平方都加到右边，移项后的常数也在右边。对 $x^2 + y^2 - 4x + 10y - 7 = 0$：$r^2 = 7 + 4 + 25 = 36$，所以 $r = 6$。忘了所加的平方，或者停在 $r^2$ 上，都是错的。",
    ),
  },
  "act-exam-using-slopes-of-parallel-lines": {
    tip: t(
      "Parallel lines share a slope, so rewrite the equation as $y = mx + b$ and read $m$. From $3x + 4y = 8$: $y = -\\frac{3}{4}x + 2$, so the slope is $-\\frac{3}{4}$. The common slips are reading the coefficient of $x$ directly, and dropping the sign when moving the term across.",
      "平行线斜率相同，所以把方程改写为 $y = mx + b$，读出 $m$。由 $3x + 4y = 8$：$y = -\\frac{3}{4}x + 2$，所以斜率是 $-\\frac{3}{4}$。常见疏漏是直接读 $x$ 的系数，以及移项时丢了符号。",
    ),
    hardTip: t(
      "Keep the slope and replace the intercept: substitute the given point in $y = mx + b$ to find the new $b$. A line through $(2, 3)$ parallel to $y = 2x + 9$ has $3 = 4 + b$, so $b = -1$. Keeping the old intercept describes the original line itself.",
      "保留斜率，更换截距：把给定的点代入 $y = mx + b$，求出新的 $b$。过 $(2, 3)$ 且平行于 $y = 2x + 9$ 的直线：$3 = 4 + b$，所以 $b = -1$。沿用旧的截距，描述的就是原来那条直线。",
    ),
  },
  "act-exam-using-slopes-of-perpendicular-lines": {
    tip: t(
      "Perpendicular slopes are negative reciprocals: flip the fraction and change the sign, so their product is $-1$. A slope of $\\frac{4}{5}$ pairs with $-\\frac{5}{4}$. Each option wrong in one way appears: $\\frac{5}{4}$ only flips, and $-\\frac{4}{5}$ only changes the sign. Both operations are required.",
      "垂直直线的斜率互为负倒数：颠倒分数并改变符号，所以它们的积是 $-1$。斜率 $\\frac{4}{5}$ 对应 $-\\frac{5}{4}$。每种只错一处的选项都会出现：$\\frac{5}{4}$ 只颠倒了，$-\\frac{4}{5}$ 只变了号。两步都要做。",
    ),
    hardTip: t(
      "Use the negative reciprocal to build the second line with its own intercept, then evaluate at the requested $x$. Perpendicular to $y = 2x + 1$ with intercept $3$: $y = -\\frac{1}{2}x + 3$, and at $x = 4$, $y = 1$. Using the original line's intercept is the distractor.",
      "用负倒数和它自己的截距建立第二条直线，再在所求的 $x$ 处求值。垂直于 $y = 2x + 1$、截距为 $3$：$y = -\\frac{1}{2}x + 3$，$x = 4$ 时 $y = 1$。用原直线的截距是干扰项。",
    ),
  },
  "act-exam-writing-the-equation-of-a-line": {
    tip: t(
      "With a slope and a point, write $y = mx + b$, substitute the point's coordinates, and solve for $b$. For slope $3$ through $(2, 1)$: $1 = 6 + b$, so $b = -5$ and $y = 3x - 5$. Using the point's $y$-coordinate as the intercept works only when $x = 0$.",
      "有斜率和一点时，写出 $y = mx + b$，代入点的坐标，解出 $b$。斜率 $3$、过 $(2, 1)$：$1 = 6 + b$，所以 $b = -5$，$y = 3x - 5$。把点的 $y$ 坐标当作截距，只在 $x = 0$ 时才成立。",
    ),
    hardTip: t(
      "With two points, get the slope first: rise over run, subtracting in the same order on top and bottom. Then proceed from either point. Through $(1, 2)$ and $(3, 8)$, the slope is $3$, and $2 = 3 + b$ gives $y = 3x - 1$. Inverting the fraction is the frequent mistake.",
      "有两点时，先求斜率：升高除以水平距离，分子分母按相同的顺序相减。然后从任一点继续。过 $(1, 2)$ 和 $(3, 8)$，斜率是 $3$，由 $2 = 3 + b$ 得 $y = 3x - 1$。把分数颠倒是常见错误。",
    ),
  },
  "act-exam-interpreting-slope-and-its-changes": {
    tip: t(
      "In a linear model, the coefficient of the variable is the change per one unit of it, and the constant is the value when the variable is $0$. In $C = 12n + 30$, each extra item adds $12$, while $30$ is the fixed starting cost. Swapping those two meanings is the trap.",
      "线性模型中，变量的系数是变量每增加一个单位的变化，常数是变量为 $0$ 时的值。在 $C = 12n + 30$ 中，每多一件增加 $12$，而 $30$ 是固定的起始费用。把这两个含义调换就是陷阱。",
    ),
    hardTip: t(
      "A change in the output is the slope times the change in the input, and the constant cancels out. With $C = 5 + 3d$, a trip $4$ miles longer costs $12$ dollars more. Substituting $d = 4$ gives $17$, which is the total price of a $4$-mile trip, not the increase.",
      "输出的变化等于斜率乘输入的变化，常数被抵消了。对 $C = 5 + 3d$，行程多 $4$ 英里，就多花 $12$ 美元。代入 $d = 4$ 得到 $17$，那是 $4$ 英里行程的总价，不是增加的部分。",
    ),
  },
  "act-exam-finding-area-in-the-coordinate-plane": {
    tip: t(
      "A rectangle with sides parallel to the axes has side lengths equal to the coordinate differences between opposite vertices. From $(1, 2)$ to $(6, 5)$, the sides are $5$ and $3$, so the area is $15$. Treating the diagonal as a side, or adding instead of multiplying, misses it. Differences with negatives need care.",
      "边与坐标轴平行的长方形，边长等于相对顶点的坐标差。从 $(1, 2)$ 到 $(6, 5)$，边长是 $5$ 和 $3$，所以面积是 $15$。把对角线当作边，或者做加法而不是乘法，都错了。涉及负数的差要小心。",
    ),
    hardTip: t(
      "Find the two vertices sharing a coordinate: they give a horizontal or vertical base. The height is the third vertex's perpendicular distance from that side, so only one coordinate matters. For $(1, 1)$, $(7, 1)$ and $(3, 5)$: base $6$, height $4$, area $12$. Forgetting the $\\frac{1}{2}$ doubles the answer.",
      "找出坐标相同的两个顶点：它们给出水平或竖直的底。高是第三个顶点到这条边的垂直距离，所以只有一个坐标起作用。$(1, 1)$、$(7, 1)$、$(3, 5)$：底 $6$，高 $4$，面积 $12$。忘了 $\\frac{1}{2}$，答案就翻倍了。",
    ),
  },
  "act-exam-finding-volumes-of-prisms-and-cylinders": {
    tip: t(
      "Any straight solid has volume equal to base area times height. For a cylinder that is $\\pi r^2 h$. Radius $2$ and height $5$ give $20\\pi$. The expression $2\\pi r h$ is the side surface, not volume, and if a diameter is given, halve it before squaring.",
      "任何直柱体的体积都等于底面积乘高。圆柱就是 $\\pi r^2 h$。半径 $2$、高 $5$，体积是 $20\\pi$。$2\\pi r h$ 是侧面积，不是体积；如果给的是直径，平方前要先减半。",
    ),
    hardTip: t(
      "The same rule holds for other bases, so compute the base's own area first. A right triangle's area is half the product of its legs. With legs $6$ and $4$ and a prism height of $5$: base $12$, volume $60$. Multiplying all three numbers without the $\\frac{1}{2}$ treats it as a box.",
      "同样的规则适用于其他底面，所以先算底面自身的面积。直角三角形的面积是两条直角边之积的一半。直角边 $6$ 和 $4$、棱柱高 $5$：底面积 $12$，体积 $60$。不带 $\\frac{1}{2}$ 就把三个数相乘，是把它当成了长方体。",
    ),
  },
  "act-exam-finding-volumes-of-pyramids-cones-and-spheres": {
    tip: t(
      "A cone holds one third of the cylinder with the same base and height: $V = \\frac{1}{3}\\pi r^2 h$. With radius $3$ and height $4$: $\\frac{1}{3}\\pi(9)(4) = 12\\pi$. Forgetting the $\\frac{1}{3}$ gives the cylinder's volume, and squaring the height instead of the radius is another trap.",
      "圆锥的体积是同底等高圆柱的三分之一：$V = \\frac{1}{3}\\pi r^2 h$。半径 $3$、高 $4$：$\\frac{1}{3}\\pi(9)(4) = 12\\pi$。忘了 $\\frac{1}{3}$ 得到的是圆柱的体积，把高而不是半径平方也是陷阱。",
    ),
    hardTip: t(
      "A pyramid uses the same one third, with its own base area: $V = \\frac{1}{3}Bh$. For a square base, $B = s^2$. With side $6$ and height $5$: $\\frac{1}{3}(36)(5) = 60$. Multiplying the side by the height without squaring the side is the error. A sphere has its own formula, $V = \\frac{4}{3}\\pi r^3$: with radius $3$, $V = 36\\pi$.",
      "棱锥用同样的三分之一，配上自己的底面积：$V = \\frac{1}{3}Bh$。正方形底面 $B = s^2$。边长 $6$、高 $5$：$\\frac{1}{3}(36)(5) = 60$。边长不平方就乘高是错误的。球有自己的公式 $V = \\frac{4}{3}\\pi r^3$：半径为 $3$ 时，$V = 36\\pi$。",
    ),
  },
  "act-exam-finding-the-surface-area-of-a-solid": {
    tip: t(
      "A box has three pairs of matching faces, so its surface area is $2(\\ell w + \\ell h + w h)$. A $3$ by $4$ by $5$ box has area $2(12 + 15 + 20) = 94$. The volume, $60$, is a likely wrong option, and so is leaving off the factor of $2$.",
      "长方体有三对相同的面，所以表面积是 $2(\\ell w + \\ell h + w h)$。$3$ 乘 $4$ 乘 $5$ 的盒子面积是 $2(12 + 15 + 20) = 94$。体积 $60$ 是很可能的错误选项，漏掉因数 $2$ 也是。",
    ),
    hardTip: t(
      "For a cube, go through the edge: its volume is $e^3$, so take a cube root. Then the surface is $6e^2$. A volume of $64$ gives edge $4$ and surface area $96$. Dividing the volume by $3$ is not a cube root, and multiplying the volume by $6$ skips the edge.",
      "立方体要经过棱长：体积是 $e^3$，所以先开立方。表面积就是 $6e^2$。体积 $64$ 时棱长 $4$，表面积 $96$。把体积除以 $3$ 并不是开立方，用体积乘 $6$ 就跳过了棱长。",
    ),
  },
  "act-exam-applying-volume-scale-factors": {
    tip: t(
      "Volume uses three lengths, so lengths scaled by $k$ make the volume scale by $k^3$. Anything proportional to volume, such as weight or material, scales the same way. A solid holding $5$ units that is made $3$ times as tall holds $5 \\cdot 27 = 135$. Multiplying by $3$ or $9$ is the trap.",
      "体积涉及三个长度，所以长度按 $k$ 变化时，体积按 $k^3$ 变化。与体积成正比的量，比如重量或材料，也一样。容纳 $5$ 个单位的立体，高变为 $3$ 倍后容纳 $5 \\cdot 27 = 135$。乘 $3$ 或 $9$ 就是陷阱。",
    ),
    hardTip: t(
      "Move between volume and surface through the length factor: take the cube root of the volume ratio, then square it. A volume ratio of $27$ means $k = 3$, so surface area scales by $9$, and an area of $10$ becomes $90$. Using the volume ratio directly on area is the error.",
      "通过长度因子在体积和表面积之间转换：对体积比开立方，再平方。体积比 $27$ 表示 $k = 3$，所以表面积按 $9$ 变化，面积 $10$ 变为 $90$。把体积比直接用在面积上是错误的。",
    ),
  },
  "act-exam-comparing-measures-of-center": {
    tip: t(
      "The median is the middle value of the sorted list, and the mean is the sum over the count. Compute both, then subtract as asked. For $2, 4, 6, 8, 20$: the median is $6$ and the mean is $8$, a gap of $2$. Choosing the middle position without sorting is the common slip.",
      "中位数是排序后的中间值，平均数是总和除以个数。两个都算出来，再按要求相减。对 $2, 4, 6, 8, 20$：中位数是 $6$，平均数是 $8$，相差 $2$。不排序就取中间位置是常见疏漏。",
    ),
    hardTip: t(
      "No arithmetic is needed if one value sits far from the rest. An extreme value pulls the mean toward itself and barely moves the median. So a high outlier, as in $1, 2, 3, 4, 40$, places the mean above the median, and a low outlier places it below. Check which side the outlier is on.",
      "如果一个值远离其他值，就不需要计算。极端值把平均数拉向自己，而几乎不影响中位数。所以高的异常值，比如 $1, 2, 3, 4, 40$，使平均数高于中位数；低的异常值使它低于中位数。要看异常值在哪一侧。",
    ),
  },
  "act-exam-determining-effects-of-changing-data": {
    tip: t(
      "Raising only the largest value changes the sum and the maximum, so the mean and range change. The middle position keeps its value, so the median stays. For $1, 3, 5, 7, 9$, raising the $9$ leaves the median at $5$. The same reasoning fails if the change alters which value is in the middle.",
      "只提高最大值，会改变总和和最大值，所以平均数和极差会变。中间位置的值不变，所以中位数不变。对 $1, 3, 5, 7, 9$，提高 $9$ 后中位数仍是 $5$。如果改变影响了中间位置的值，这个推理就不成立了。",
    ),
    hardTip: t(
      "Adding the same number to every value shifts the whole list. So the mean, median, smallest and largest all rise by that number. Gaps between values stay fixed, so the range and standard deviation do not change. Multiplying each value is different, because that stretches the gaps as well.",
      "给每个值加上同一个数，整个列表都平移了。所以平均数、中位数、最小值和最大值都增加这个数。值之间的间隔不变，所以极差和标准差不变。给每个值乘一个数则不同，因为这也会拉大间隔。",
    ),
  },
  "act-exam-finding-how-a-data-change-affects-a-mean": {
    tip: t(
      "Correcting one value shifts the total by the error, so the mean shifts by that amount over the count. With $5$ scores of mean $80$, changing a $60$ to a $75$ adds $15$, so the mean rises by $3$ to $83$. Adding the full $15$ to the mean ignores the sharing.",
      "修正一个值使总和变化了误差那么多，所以平均数变化误差除以个数。$5$ 个分数平均 $80$，把 $60$ 改为 $75$ 多了 $15$，所以平均数提高 $3$，到 $83$。把 $15$ 全部加到平均数上，就忽略了分摊。",
    ),
    hardTip: t(
      "Adding a new value also raises the count. Rebuild the total as mean times count, add the new value, and divide by the larger count. For $4$ numbers of mean $10$ with a new $20$: $\\frac{40 + 20}{5} = 12$. Averaging $10$ and $20$ gives one value the weight of four.",
      "加入新值也会增加个数。用平均数乘个数还原总和，加上新值，再除以更大的个数。$4$ 个数平均 $10$，新加 $20$：$\\frac{40 + 20}{5} = 12$。把 $10$ 和 $20$ 平均，就让一个值有了四个值的权重。",
    ),
  },
  "act-exam-using-means-and-sums": {
    tip: t(
      "A mean is the total divided by the count, so the total is the mean times the count. Four trips with a mean of $25$ miles cover $100$ miles altogether. Dividing the mean by the count goes in the wrong direction, and it is easy to spot because a total cannot be smaller than its mean here.",
      "平均数是总和除以个数，所以总和是平均数乘个数。四次行程平均 $25$ 英里，一共 $100$ 英里。用平均数除以个数方向就反了，这很容易发现，因为这里总和不可能比平均数小。",
    ),
    hardTip: t(
      "Two groups of different sizes combine by weighting: get each group's total, add them, and divide by everyone. Groups of $4$ with mean $80$ and $6$ with mean $90$ give $\\frac{320 + 540}{10} = 86$. The simple average of the two means, $85$, is right only for equal groups.",
      "两组大小不同时，要加权合并：算出每组的总和，相加，再除以总人数。$4$ 人平均 $80$ 和 $6$ 人平均 $90$，得 $\\frac{320 + 540}{10} = 86$。两个平均数的简单平均 $85$ 只在两组人数相等时才对。",
    ),
  },
  "act-exam-finding-unknown-values-from-center-measures": {
    tip: t(
      "Work backward: the required total is target mean times the full count, and the missing value is that total minus the known ones. Three scores of $80$, $90$ and $85$ with a target of $86$ over four tests need $344 - 255 = 89$. Averaging only the known ones with the target is the trap.",
      "倒着算：所需总和是目标平均数乘总个数，所缺的值是总和减去已知值。三次成绩 $80$、$90$、$85$，四次平均目标 $86$，需要 $344 - 255 = 89$。只把已知值与目标平均是陷阱。",
    ),
    hardTip: t(
      "With an even count, the median is the mean of the two middle values, so it can differ from every listed value. Set up that mean and solve. For $2, 6, x, 14$ with median $8$: $\\frac{6 + x}{2} = 8$, so $x = 10$. Setting $x$ equal to the median misses this.",
      "个数为偶数时，中位数是中间两个值的平均数，所以它可以不同于列出的任何值。列出这个平均式再求解。对 $2, 6, x, 14$，中位数 $8$：$\\frac{6 + x}{2} = 8$，所以 $x = 10$。令 $x$ 等于中位数就错了。",
    ),
  },
  "act-exam-comparing-measures-of-spread": {
    tip: t(
      "Range is the largest minus the smallest. Find it for each set separately, then compare. Sets $2, 5, 9$ and $1, 4, 16$ have ranges $7$ and $15$, so the gap is $8$. Comparing only the largest values, or subtracting one set from the other term by term, is not the same.",
      "极差是最大值减最小值。分别求出每组的极差，再比较。$2, 5, 9$ 和 $1, 4, 16$ 的极差是 $7$ 和 $15$，所以相差 $8$。只比较最大值，或者逐项相减，都不是同一回事。",
    ),
    hardTip: t(
      "Standard deviation measures how far values lie from their mean, and comparing does not need a formula. Sets $9, 10, 11$ and $2, 10, 18$ share a mean of $10$, yet the second has values much farther away, so its standard deviation is greater. An equal mean does not imply equal spread.",
      "标准差衡量值离平均数有多远，比较时不需要公式。$9, 10, 11$ 和 $2, 10, 18$ 的平均数都是 $10$，但第二组的值离得远得多，所以标准差更大。平均数相等并不意味着离散程度相等。",
    ),
  },
  "act-exam-finding-a-median-from-frequencies": {
    tip: t(
      "A frequency table is a compressed list. Add the frequencies to get $n$. For an odd count, the median sits in position $\\frac{n + 1}{2}$. Count through running totals until you reach it. With $4$, $5$ and $2$ copies of $1$, $2$ and $3$: position $6$ falls among the $2$s. The middle column may mislead.",
      "频数表是压缩的列表。把频数相加得到 $n$。个数为奇数时，中位数在第 $\\frac{n + 1}{2}$ 位。累计频数直到到达这一位。$1$、$2$、$3$ 分别有 $4$、$5$、$2$ 个：第 $6$ 位落在 $2$ 中。中间那一列可能会误导。",
    ),
    hardTip: t(
      "With an even count, the median averages positions $\\frac{n}{2}$ and $\\frac{n}{2} + 1$. Find both using running totals. With $3$, $4$ and $5$ copies of $1$, $2$ and $3$: positions $6$ and $7$ are both $2$, so the median is $2$. If they straddle two values, average them. Do not take the median of the frequencies.",
      "个数为偶数时，中位数是第 $\\frac{n}{2}$ 位和第 $\\frac{n}{2} + 1$ 位的平均。用累计频数找出这两位。$1$、$2$、$3$ 分别有 $3$、$4$、$5$ 个：第 $6$、$7$ 位都是 $2$，所以中位数是 $2$。如果跨两个值，就取平均。不要求频数的中位数。",
    ),
  },
  "act-exam-reading-frequency-distributions": {
    tip: t(
      "The top row gives the values and the bottom row gives how many people had each. At least a value includes that value and all above it, so add those frequencies. With counts $5$, $4$, $3$, $2$ for $0$ to $3$, at least $2$ means $3 + 2 = 5$. Adding the values themselves is the mistake.",
      "上面一行是值，下面一行是每个值对应的人数。“至少”包括这个值和它以上的值，所以把这些频数相加。$0$ 到 $3$ 的人数是 $5$、$4$、$3$、$2$ 时，至少 $2$ 就是 $3 + 2 = 5$。把值本身相加就错了。",
    ),
    hardTip: t(
      "A fraction needs the part over everyone, so add the entire bottom row for the denominator. Fewer than excludes that value itself, and the complement is often quicker. With counts $5$, $4$, $3$, $2$, fewer than $3$ gives $\\frac{12}{14} = \\frac{6}{7}$. Reduce to match the options, and do not use the top row as the whole.",
      "分数是部分除以全体，所以把整个下面一行相加作为分母。“少于”不包括这个值本身，用补集往往更快。人数 $5$、$4$、$3$、$2$ 时，少于 $3$ 得 $\\frac{12}{14} = \\frac{6}{7}$。要约分以符合选项，也不要把上面一行当作全体。",
    ),
  },
  "act-exam-reading-category-tables": {
    tip: t(
      "Locate the rows or columns named in the question, then add every cell inside them. Asking for both kinds on two days means two whole rows: rows with $10$, $5$ and $4$, $6$ total $25$. Reading only one column, or including the row left out, gives the wrong options.",
      "找到题目所说的行或列，再把其中每个单元格相加。问两天的两种票，就是两整行：$10$、$5$ 和 $4$、$6$ 这两行共 $25$。只读一列，或者把没问的那一行算进去，都是错误选项。",
    ),
    hardTip: t(
      "A fraction of a group uses that group's total as the denominator. If the question asks for a fraction of all child tickets, add the child column, then divide the one cell by it. With a column of $3$, $5$, $12$, the middle share is $\\frac{5}{20} = \\frac{1}{4}$. A row total or a grand total is wrong.",
      "占某一组的分数，要用这一组的总数作分母。如果问占全部儿童票的分数，就把儿童票这一列相加，再用那个单元格除以它。列为 $3$、$5$、$12$ 时，中间的份额是 $\\frac{5}{20} = \\frac{1}{4}$。用行总数或总计都是错的。",
    ),
  },
  "act-exam-reading-trend-graphs": {
    tip: t(
      "Find the two heights on the graph at the named times, then subtract, later minus earlier. A rise from $12$ to $18$ is a change of $6$, and a fall from $18$ to $12$ is $-6$. A falling graph needs a negative sign, so reversing the subtraction produces the trap value.",
      "在图上找到指定时间的两个高度，再用后面的减前面的。从 $12$ 升到 $18$，变化是 $6$；从 $18$ 降到 $12$，变化是 $-6$。下降的图需要负号，所以减反了就得到陷阱值。",
    ),
    hardTip: t(
      "Average rate divides that change by the elapsed horizontal distance, giving units per unit of time. From $50$ down to $20$ over $6$ years: $\\frac{-30}{6} = -5$ per year. Keep the negative sign for a decline. Using only the final year as the divisor fails whenever the interval does not start at $0$.",
      "平均变化率用这个变化除以经过的水平距离，得到每单位时间的量。$6$ 年从 $50$ 降到 $20$：$\\frac{-30}{6} = -5$，即每年 $-5$。下降要保留负号。只用最后的年份作除数，在区间不从 $0$ 开始时就会错。",
    ),
  },
  "act-exam-reasoning-about-data-displays": {
    tip: t(
      "A box plot marks five numbers. The box runs from the first quartile to the third, and the line inside is the median. The interquartile range is the box's width: for a box from $10$ to $25$, it is $15$. The full range uses the whisker ends, and that is the wrong option.",
      "箱线图标出五个数。箱子从第一四分位数到第三四分位数，里面的线是中位数。四分位距就是箱子的宽度：箱子从 $10$ 到 $25$ 时是 $15$。极差用的是须的两端，那是错误选项。",
    ),
    hardTip: t(
      "The quartiles cut the data into four roughly equal groups, so positions convert to shares. Below the first quartile lies about a quarter, above the median half, above the third quartile a quarter. With $80$ values, about $60$ are at or above the first quartile. A plot shows these shares, not exact counts.",
      "四分位数把数据分成大致相等的四组，所以位置可以换算成比例。第一四分位数以下约占四分之一，中位数以上占一半，第三四分位数以上占四分之一。$80$ 个值中，约 $60$ 个不低于第一四分位数。图显示的是比例，不是精确计数。",
    ),
  },
  "act-exam-finding-a-simple-probability": {
    tip: t(
      "Probability is favorable outcomes over all outcomes. Add every category for the denominator. For not a color, either add the others or subtract from the total. With $4$ red, $5$ blue and $11$ green, not green is $\\frac{9}{20}$. Comparing the other colors with the excluded color gives odds rather than a probability.",
      "概率是有利结果数除以全部结果数。把所有类别相加作分母。对“不是某种颜色”，要么加上其他颜色，要么从总数中减去。$4$ 红、$5$ 蓝、$11$ 绿，不是绿色的概率是 $\\frac{9}{20}$。用其他颜色比被排除的颜色，得到的是赔率而不是概率。",
    ),
    hardTip: t(
      "When outcomes are numbers, count those that qualify, and do not list them all. The multiples of $k$ up to $N$ number $N$ divided by $k$, rounded down. From $1$ to $40$, there are $10$ multiples of $4$, so the probability is $\\frac{1}{4}$. Then reduce the fraction to match the options.",
      "结果是数字时，数出符合条件的个数，不必全部列出。不超过 $N$ 的 $k$ 的倍数有 $N$ 除以 $k$ 向下取整个。从 $1$ 到 $40$，$4$ 的倍数有 $10$ 个，所以概率是 $\\frac{1}{4}$。再约分以符合选项。",
    ),
  },
  "act-exam-finding-a-probability-from-a-two-way-table": {
    tip: t(
      "An outcome with two required features is one cell, and with no condition, the denominator is the whole table. So add all four cells first. A cell of $12$ in a table of $60$ gives $\\frac{1}{5}$. Dividing by that cell's row or column total answers a different, conditional question.",
      "同时具备两个特征的结果就是一个单元格，没有条件时，分母是整张表。所以先把四个单元格相加。$60$ 人的表中单元格为 $12$，概率是 $\\frac{1}{5}$。除以所在行或列的总数，回答的是另一个条件概率问题。",
    ),
    hardTip: t(
      "With or, count each person once. Add the row and the column, then subtract their shared cell. In a $2$ by $2$ table, it is quicker to remove the one cell that meets neither condition. In a table of $60$ with $15$ meeting neither, the probability is $\\frac{45}{60} = \\frac{3}{4}$. Forgetting the overlap overcounts.",
      "“或”要让每个人只算一次。把行和列相加，再减去共同的单元格。在 $2$ 乘 $2$ 的表中，去掉两个条件都不满足的那个单元格更快。$60$ 人的表中有 $15$ 人都不满足，概率是 $\\frac{45}{60} = \\frac{3}{4}$。忘了重叠就数多了。",
    ),
  },
  "act-exam-finding-a-conditional-probability-from-a-table": {
    tip: t(
      "A phrase such as if chosen from a group shrinks the possibilities to that group. So the denominator is that row's total, not the table's. If a row has $30$ people and $12$ of them qualify, the probability is $\\frac{2}{5}$. Dividing by the whole table is the expected mistake.",
      "“从某一组中选取”这样的说法把可能性缩小到这一组。所以分母是这一行的总数，而不是整张表的。一行有 $30$ 人，其中 $12$ 人符合，概率是 $\\frac{2}{5}$。除以整张表的总数是预料中的错误。",
    ),
    hardTip: t(
      "The given condition may name a column rather than a row, so use that column's total. If a column holds $6$ and $10$, the chance of the second group is $\\frac{10}{16} = \\frac{5}{8}$. Reversing the condition changes the answer: the chance of failing given a time differs from the chance of a time given failing.",
      "给定的条件可能指向一列而不是一行，所以要用这一列的总数。一列有 $6$ 和 $10$，属于第二组的概率是 $\\frac{10}{16} = \\frac{5}{8}$。条件反过来答案就变了：已知时间时不及格的概率，不同于已知不及格时是该时间的概率。",
    ),
  },
  "act-exam-finding-a-conditional-probability": {
    tip: t(
      "Given a condition, the group described by it becomes the new whole. The largest number in the story is often irrelevant. Among $40$ swimmers in a larger club, if $10$ also row, a chosen swimmer rows with probability $\\frac{1}{4}$. Dividing by the entire club's size is the trap, and the club total is a distractor.",
      "有条件时，条件所描述的这一组就成了新的全体。题中最大的数往往无关。一个较大的俱乐部中有 $40$ 名游泳者，其中 $10$ 人也划船，选一名游泳者，划船的概率是 $\\frac{1}{4}$。除以整个俱乐部的人数是陷阱，俱乐部总数只是干扰。",
    ),
    hardTip: t(
      "Without replacement, the first draw changes the second: one fewer item overall, and one fewer of its kind. With $5$ green and $4$ white, after a green draw there remain $4$ green among $8$, so the probability is $\\frac{1}{2}$. Keeping the original $\\frac{5}{9}$ would describe replacing the item.",
      "不放回时，第一次抽取会改变第二次：总数少一个，同类也少一个。$5$ 绿 $4$ 白，抽出一个绿色后，$8$ 个中还剩 $4$ 个绿色，所以概率是 $\\frac{1}{2}$。保持原来的 $\\frac{5}{9}$ 描述的是放回的情况。",
    ),
  },
  "act-exam-estimating-a-population-from-a-sample-proportion": {
    tip: t(
      "A random sample's share is the estimate for the whole group, so multiply the population by that share. If $4$ of $50$ sampled items are flawed, then of $5{,}000$ items about $400$ are flawed. Scaling up is the same: the batch is $100$ times the sample. Reporting the sample's count or its percent misses the request.",
      "随机样本的比例就是对整体的估计，所以用总体乘这个比例。抽样 $50$ 件有 $4$ 件有缺陷，$5{,}000$ 件中约有 $400$ 件有缺陷。按倍数放大也一样：这批是样本的 $100$ 倍。只报样本的个数或百分比，就没答到所问的内容。",
    ),
    hardTip: t(
      "In mark and recapture, the unknown is the population, and the marked share should match in both places: tagged in catch over catch equals tagged over total. With $50$ tagged and a catch of $30$ including $5$ tagged: $\\frac{5}{30} = \\frac{50}{N}$, so $N = 300$. Flipping one fraction gives a value too small to be possible.",
      "在标记重捕法中，未知的是总量，标记比例在两处应当一致：捕获中带标记的数除以捕获数，等于标记总数除以总量。标记 $50$，捕获 $30$，其中 $5$ 条带标记：$\\frac{5}{30} = \\frac{50}{N}$，所以 $N = 300$。把一个分数颠倒，得到的值小得不可能。",
    ),
  },
  "act-exam-judging-evidence-from-a-sample": {
    tip: t(
      "A random sample supports an approximate claim about the group it was drawn from, and nothing more. So choose the conclusion that says about that percent of that group. Options that claim exactness, that extend to other groups such as all students in a country, or that assert a cause go too far.",
      "随机样本只支持对其抽样群体的近似结论，仅此而已。所以选择“这个群体中大约这个百分比”的结论。声称精确、推广到其他群体（比如全国所有学生）或者断言因果的选项，都说过头了。",
    ),
    hardTip: t(
      "A sample is biased when the place or method of selection relates to the very thing being measured. People at a stadium surely differ from their town in how often they watch sports. Making the sample larger does not fix this, so reject options blaming size. Choose the one naming the unrepresentative group.",
      "如果选取的地点或方法与所测量的内容本身有关，样本就有偏差。体育场里的人看比赛的频率肯定与全镇不同。扩大样本并不能解决这个问题，所以排除归咎于样本大小的选项。选择指出群体没有代表性的那个。",
    ),
  },
  "act-exam-identifying-a-model-type": {
    tip: t(
      "Test a table with equally spaced inputs in order. Constant differences mean linear. Constant differences of the differences mean quadratic. A constant ratio means exponential. For $1, 2, 5, 10$, the differences are $1, 3, 5$, which rise steadily, so it is quadratic. Unequal first differences alone do not prove exponential growth.",
      "对输入等距的表格依次检验。差恒定是线性。差的差恒定是二次。比恒定是指数。$1, 2, 5, 10$ 的差是 $1, 3, 5$，稳定增加，所以是二次。仅仅一阶差不相等并不能证明是指数增长。",
    ),
    hardTip: t(
      "In a description, look at how the change is stated. The same amount per period is a constant rate, which is linear. The same percent per period is a constant multiplier, which is exponential, whether growing or decaying. Saving $50$ dollars monthly is linear; losing $10\\%$ yearly is exponential, not linear with a negative slope.",
      "在文字描述中，要看变化是怎么表述的。每期变化相同的数量是恒定变化率，是线性。每期变化相同的百分比是恒定倍数，是指数，无论增长还是衰减。每月存 $50$ 美元是线性；每年损失 $10\\%$ 是指数，不是斜率为负的线性。",
    ),
  },
  "act-exam-fitting-a-linear-model-to-data": {
    tip: t(
      "Describe the drawn line, not the dots. Read where it crosses the $y$-axis and another point it clearly passes through, then compute the slope. A line crossing at $5$ and reaching $25$ at $x = 10$ has slope $2$, so $y = 2x + 5$. Using a stray data point as an anchor skews the slope.",
      "描述的是画出的直线，不是那些点。读出它穿过 $y$ 轴的位置和它明显经过的另一点，再求斜率。在 $5$ 处穿过、$x = 10$ 时到达 $25$ 的直线，斜率是 $2$，所以 $y = 2x + 5$。用偏离的数据点作基准会使斜率出错。",
    ),
    hardTip: t(
      "A prediction uses the line, so write its equation and substitute the requested input, especially when it lies beyond the plotted region. For $y = 2x + 5$ at $x = 30$, the prediction is $65$. Reading the nearest dot, or stopping at the graph's edge, gives the tempting wrong values.",
      "预测要用这条直线，所以写出它的方程，代入所求的输入，尤其当它超出图示范围时。$y = 2x + 5$ 在 $x = 30$ 处，预测值是 $65$。读最近的点，或者停在图的边缘，都会得到诱人的错误值。",
    ),
  },
  "act-exam-using-a-linear-model": {
    tip: t(
      "To evaluate a model, substitute the input, multiply, then add the fixed part. With $C = 20h + 15$ for $6$ hours: $120 + 15 = 135$. The fixed $15$ is charged once. Adding it to the rate first, and then multiplying by the hours, charges it every hour and overstates the bill.",
      "要计算模型的值，代入输入，先乘，再加固定部分。$C = 20h + 15$，$6$ 小时：$120 + 15 = 135$。固定的 $15$ 只收一次。先把它加到费率上再乘小时数，就每小时都收了，账单被高估。",
    ),
    hardTip: t(
      "Going from an output back to an input reverses the steps: subtract the fixed part, then divide by the rate. If $C = 20h + 15$ and the bill is $95$ dollars: $20h = 80$, so $h = 4$. Dividing the bill by the rate without subtracting first gives a value that is too large.",
      "从输出回到输入要把步骤倒过来：先减固定部分，再除以费率。若 $C = 20h + 15$，账单 $95$ 美元：$20h = 80$，所以 $h = 4$。不先减就用账单除以费率，得到的值太大。",
    ),
  },
  "act-exam-partitioning-a-total-in-a-given-ratio": {
    tip: t(
      "Add the ratio's numbers to get the total parts, divide the amount by that sum to get one part, and multiply by the share's number. Splitting $400$ in the ratio $3:5$ gives $8$ parts of $50$, so the larger share is $250$. Treating $\\frac{3}{5}$ as a fraction of the whole is the trap.",
      "把比中的数相加得到总份数，用总量除以这个和得到一份，再乘这部分的份数。按 $3:5$ 分 $400$，共 $8$ 份，每份 $50$，所以较大的一份是 $250$。把 $\\frac{3}{5}$ 当作占整体的分数就是陷阱。",
    ),
    hardTip: t(
      "With three shares, the method is the same, and a difference between shares is a difference of parts. For $64$ in the ratio $1:3:4$: $8$ parts of $8$. The largest minus the smallest is $3$ parts, or $24$. Reporting a single piece, or using all parts in the difference, misses the request.",
      "分成三份时方法相同，份额之差就是份数之差。按 $1:3:4$ 分 $64$：$8$ 份，每份 $8$。最大减最小是 $3$ 份，即 $24$。只报一部分，或者用全部份数求差，都没答到所问的内容。",
    ),
  },
  "act-exam-composing-chained-ratios": {
    tip: t(
      "When the middle term has the same number in both ratios, it acts as a shared link, so the outer terms compare directly. If $a:b$ is $2:7$ and $b:c$ is $7:9$, then $a:c$ is $2:9$. Keep the order requested, because the reverse, $9:2$, is typically among the options.",
      "中间项在两个比中数值相同时，它就是共同的纽带，所以两端可以直接比较。若 $a:b$ 是 $2:7$，$b:c$ 是 $7:9$，则 $a:c$ 是 $2:9$。要保持所要求的顺序，因为反过来的 $9:2$ 通常也在选项中。",
    ),
    hardTip: t(
      "If the middle numbers differ, multiply the fractions so that the middle cancels: $\\frac{a}{c} = \\frac{a}{b} \\cdot \\frac{b}{c}$. With $a:b = 2:5$ and $b:c = 3:4$: $a:c = 6:20 = 3:10$. Then use the known amount: $c = 40$ gives $a = 12$. Reading the outer numbers directly here is the trap.",
      "中间的数不同时，把分数相乘，让中间项约掉：$\\frac{a}{c} = \\frac{a}{b} \\cdot \\frac{b}{c}$。$a:b = 2:5$，$b:c = 3:4$：$a:c = 6:20 = 3:10$。再用已知量：$c = 40$ 时 $a = 12$。在这里直接读两端的数就是陷阱。",
    ),
  },
  "act-exam-applying-proportions": {
    tip: t(
      "With a constant price, cost is proportional to quantity, so find the cost of one and scale it. If $5$ pens cost $20$ dollars, one costs $4$ dollars, and $12$ cost $48$ dollars. Adding the difference in quantity to the cost, instead of multiplying, is the additive trap.",
      "单价不变时，费用与数量成正比，所以求出一件的费用再放大。$5$ 支笔 $20$ 美元，一支 $4$ 美元，$12$ 支 $48$ 美元。把数量的差直接加到费用上，而不是相乘，就是加法陷阱。",
    ),
    hardTip: t(
      "More workers finish sooner, so this relation is inverse: workers times days stays constant. Find that total, then divide by the new number. A job taking $6$ workers $10$ days is $60$ worker-days, so $15$ workers need $4$ days. Setting up a direct proportion gives more days and is the trap.",
      "人越多完成得越快，所以这是反比关系：人数乘天数不变。求出这个总量，再除以新的人数。$6$ 人 $10$ 天的工作是 $60$ 人天，所以 $15$ 人需要 $4$ 天。列成正比会得到更多天数，这就是陷阱。",
    ),
  },
  "act-exam-finding-a-unit-rate": {
    tip: t(
      "A rate per unit divides the first named quantity by the second. For miles per hour, it is miles over hours: $90$ miles in $5$ hours is $18$ miles per hour. Inverting gives hours per mile. Read the word after per, since that unit goes in the denominator.",
      "每单位的比率是用前面说的量除以后面说的量。每小时英里数就是英里除以小时：$5$ 小时 $90$ 英里，即每小时 $18$ 英里。颠倒过来就成了每英里的小时数。看“每”后面的词，这个单位放在分母。",
    ),
    hardTip: t(
      "To compare two rates, compute each unit rate first, then subtract. For $60$ items in $5$ minutes against $126$ items in $7$ minutes: $12$ and $18$ per minute, a difference of $6$. Subtracting totals is wrong, since the times differ, and dividing the difference in items by the difference in time gives nothing meaningful.",
      "比较两个比率，先分别算出单位比率，再相减。$5$ 分钟 $60$ 件与 $7$ 分钟 $126$ 件：每分钟 $12$ 和 $18$ 件，相差 $6$。直接减总数是错的，因为时间不同；用件数差除以时间差也没有意义。",
    ),
  },
  "act-exam-finding-distance-at-constant-speed": {
    tip: t(
      "Distance is speed times time, with the time in the same unit as the speed. So convert minutes to a fraction of an hour first. For $2$ hours and $15$ minutes at $40$ miles per hour: $2.25$ hours, so $90$ miles. Reading $2$ hours $15$ minutes as $2.15$ is the trap.",
      "距离是速度乘时间，时间的单位要与速度一致。所以先把分钟换算成小时的几分之几。$2$ 小时 $15$ 分钟，时速 $40$ 英里：$2.25$ 小时，所以 $90$ 英里。把 $2$ 小时 $15$ 分钟读成 $2.15$ 就是陷阱。",
    ),
    hardTip: t(
      "Average speed is total distance over total time, so find the time for each leg and add. For $60$ miles at $30$ and back at $60$ miles per hour: $2 + 1 = 3$ hours for $120$ miles, so $40$. The mean of the speeds, $45$, ignores the longer time at the slower pace.",
      "平均速度是总路程除以总时间，所以求出每段的时间再相加。$60$ 英里时速 $30$，返回时速 $60$：$2 + 1 = 3$ 小时走 $120$ 英里，所以是 $40$。两个速度的平均数 $45$ 忽略了慢速时用的时间更长。",
    ),
  },
  "act-exam-finding-a-percent-of-a-number": {
    tip: t(
      "A percent is a number out of $100$, so change it to a decimal or fraction and multiply. For $15\\%$ of $60$: $0.15(60) = 9$. Dividing by the percent, or forgetting to shift the decimal point, gives wrong values. A rough check also helps: $10\\%$ of $60$ is $6$, so the answer should be somewhat larger.",
      "百分比是以 $100$ 为分母的数，所以把它变成小数或分数再相乘。$60$ 的 $15\\%$：$0.15(60) = 9$。除以百分比，或者忘了移动小数点，都会错。粗略检验也有帮助：$60$ 的 $10\\%$ 是 $6$，所以答案应该略大一些。",
    ),
    hardTip: t(
      "When one percent of a number is known and another is requested, find the whole first by dividing, then apply the new percent. If $20\\%$ of a number is $8$, the number is $40$, and $70\\%$ of it is $28$. Taking the second percent of the given part is the trap.",
      "已知一个数的某个百分比而要求另一个百分比时，先做除法求出整体，再用新的百分比。若某数的 $20\\%$ 是 $8$，这个数是 $40$，它的 $70\\%$ 是 $28$。直接取已知部分的第二个百分比就是陷阱。",
    ),
  },
  "act-exam-expressing-a-ratio-as-a-percent": {
    tip: t(
      "To express a part as a percent, divide the part by the whole and multiply by $100$. For $15$ out of $60$: $\\frac{15}{60} \\cdot 100 = 25$. Inverting the fraction gives a value above $100$, which is impossible here because the part cannot exceed the whole.",
      "把部分表示为百分比，用部分除以整体再乘 $100$。$60$ 中的 $15$：$\\frac{15}{60} \\cdot 100 = 25$。把分数颠倒会得到大于 $100$ 的值，这里不可能，因为部分不能超过整体。",
    ),
    hardTip: t(
      "In the phrase A is what percent of B, the quantity after of is the whole, even if it is smaller. So $90$ is $150\\%$ of $60$. The answer can exceed $100$. The tempting wrong values are the percent more, $50$, and the reversed comparison, which swaps the fraction.",
      "在“A 是 B 的百分之几”的说法中，“的”前面的 B 是整体，即使它更小。所以 $90$ 是 $60$ 的 $150\\%$。答案可以超过 $100$。诱人的错误值是多出的百分比 $50$，以及把分数颠倒的反向比较。",
    ),
  },
  "act-exam-finding-a-total-from-a-percent": {
    tip: t(
      "When the part is known and the whole is not, divide the part by the percent as a decimal. If $12$ is $30\\%$ of a group: $12 \\div 0.30 = 40$. Taking $30\\%$ of $12$ gives something smaller than the part, which cannot be the whole, so check the size of your answer.",
      "部分已知而整体未知时，用部分除以百分比的小数形式。若 $12$ 是一个群体的 $30\\%$：$12 \\div 0.30 = 40$。取 $12$ 的 $30\\%$ 得到的比部分还小，不可能是整体，所以要检查答案的大小。",
    ),
    hardTip: t(
      "After a discount, the sale price is the percent that remains, so subtract the discount from $100\\%$, and divide. A price of $60$ dollars after $20\\%$ off is $80\\%$ of the original: $60 \\div 0.80 = 75$. Adding $20\\%$ of $60$ uses the wrong base, because the discount was taken on the original price.",
      "打折后，售价是剩下的百分比，所以用 $100\\%$ 减去折扣，再相除。打掉 $20\\%$ 后 $60$ 美元，是原价的 $80\\%$：$60 \\div 0.80 = 75$。加上 $60$ 的 $20\\%$ 就用错了基数，因为折扣是按原价算的。",
    ),
  },
  "act-exam-applying-a-percent-change": {
    tip: t(
      "To find a new amount, compute the increase and add it, or multiply by one factor. A $50$-dollar meal with a $10\\%$ fee costs $50(1.10) = 55$ dollars. Stopping at $5$ gives the added part alone, and the question asks for the total, so read to the end.",
      "求新的量时，算出增加的部分再相加，或者乘一个因子。$50$ 美元的餐费加 $10\\%$ 服务费，是 $50(1.10) = 55$ 美元。停在 $5$ 上只是增加的部分，而题目问的是总额，所以要读到最后。",
    ),
    hardTip: t(
      "This reverses the calculation: percent change is the change over the starting value, times $100$. From $400$ to $300$: $\\frac{100}{400} \\cdot 100 = 25$, a decrease. Dividing by the ending value gives a different and wrong percent, so always use the earlier number as the base, for rises and falls alike.",
      "这是反向计算：百分比变化是变化量除以起始值再乘 $100$。从 $400$ 到 $300$：$\\frac{100}{400} \\cdot 100 = 25$，是减少。除以结束值会得到不同的错误百分比，所以无论增减，都要用较早的数作基数。",
    ),
  },
  "act-exam-taking-successive-percents": {
    tip: t(
      "The word of means multiply, so a percent of a percent multiplies the decimals. Work from the right: $20\\%$ of $300$ is $60$, and $50\\%$ of that is $30$. Adding the percents to get $70\\%$ of the number is the trap, and the order of the two percents does not matter.",
      "“的”表示相乘，所以百分比的百分比就是小数相乘。从右往左算：$300$ 的 $20\\%$ 是 $60$，它的 $50\\%$ 是 $30$。把百分比相加成 $70\\%$ 就是陷阱；两个百分比的顺序无所谓。",
    ),
    hardTip: t(
      "In a story, each percent applies to the group just found, and the question may want those who do not fit. So use the complement in the last step. If $25\\%$ of $400$ own bikes and $40\\%$ of the owners ride daily, then $60\\%$ of $100$, or $60$, do not. Stopping at the riders is the trap.",
      "在情境中，每个百分比都作用于刚求出的那一组，问题也可能问不符合的人。所以最后一步用补集。$400$ 人的 $25\\%$ 有自行车，车主的 $40\\%$ 每天骑，那么 $100$ 人的 $60\\%$，即 $60$ 人不每天骑。停在骑车的人上就是陷阱。",
    ),
  },
  "act-exam-applying-successive-percent-changes": {
    tip: t(
      "Each change applies to the latest value, so multiply by one factor per change. A value of $200$ rising $10\\%$ and then falling $20\\%$ ends at $200(1.1)(0.8) = 176$. Combining the percents into a net fall of $10\\%$ gives $180$, which wrongly uses the original as both bases.",
      "每次变化都作用于最新的值，所以每次变化乘一个因子。$200$ 先升 $10\\%$ 再降 $20\\%$，最后是 $200(1.1)(0.8) = 176$。把百分比合并成净降 $10\\%$ 得到 $180$，这错把原值当作两次的基数。",
    ),
    hardTip: t(
      "No starting value is required, since the factors alone give the overall effect. Rising $20\\%$ and then falling $25\\%$ multiplies by $(1.2)(0.75) = 0.9$, so the final is $90\\%$ of the original. Note the form requested: the final as a percent differs from the overall drop of $10\\%$. Adding the percents fails too.",
      "不需要起始值，因为因子本身就给出了总体效果。先升 $20\\%$ 再降 $25\\%$，相当于乘 $(1.2)(0.75) = 0.9$，所以最后是原来的 $90\\%$。注意所要求的形式：最后占原来的百分比不同于总体下降的 $10\\%$。把百分比相加也不对。",
    ),
  },
  "act-exam-computing-with-mixed-units": {
    tip: t(
      "Convert each mixed length to one unit before adding: feet times $12$, plus the inches. For $3$ feet $5$ inches and $2$ feet $7$ inches: $41 + 31 = 72$ inches. Adding feet and inches as if they were tenths, or leaving out the extra inches, produces the wrong options.",
      "相加之前，先把每个混合长度换成一种单位：英尺乘 $12$，再加英寸。$3$ 英尺 $5$ 英寸和 $2$ 英尺 $7$ 英寸：$41 + 31 = 72$ 英寸。把英尺和英寸当作小数相加，或者漏掉多出的英寸，都是错误选项。",
    ),
    hardTip: t(
      "Time uses $60$, not $100$, so one period is hours times $60$ plus minutes. Then multiply by how many periods there are. A task of $2$ hours $15$ minutes done $4$ times is $135(4) = 540$ minutes. Reading it as $2.15$ hours, or multiplying only the hours, misses the conversion.",
      "时间用 $60$ 进位，不是 $100$，所以一段时间是小时乘 $60$ 加分钟。再乘以段数。$2$ 小时 $15$ 分钟的任务做 $4$ 次，是 $135(4) = 540$ 分钟。把它读成 $2.15$ 小时，或者只乘小时数，都没有做好换算。",
    ),
  },
  "act-exam-converting-a-measurement": {
    tip: t(
      "Going from a larger unit to a smaller one, you need more of them, so multiply by the given relationship. So $5$ yards is $15$ feet, $8$ feet is $96$ inches, and $4$ minutes is $240$ seconds. Dividing here gives a number smaller than the original, which should raise suspicion.",
      "从较大的单位换到较小的单位，数量会变多，所以乘以给定的关系。所以 $5$ 码是 $15$ 英尺，$8$ 英尺是 $96$ 英寸，$4$ 分钟是 $240$ 秒。在这里做除法，得到的数比原来还小，这就值得怀疑。",
    ),
    hardTip: t(
      "Going the other way, from a smaller unit to a larger one, you need fewer, so divide. So $21$ feet is $7$ yards, $60$ inches is $5$ feet, and $300$ seconds is $5$ minutes. Multiplying inflates the count, so ask whether the answer should be a larger or smaller number.",
      "反过来，从较小的单位换到较大的单位，数量会变少，所以做除法。所以 $21$ 英尺是 $7$ 码，$60$ 英寸是 $5$ 英尺，$300$ 秒是 $5$ 分钟。做乘法会把数量放大，所以要问答案应该变大还是变小。",
    ),
  },
  "act-exam-applying-conversion-factors": {
    tip: t(
      "With two steps, convert the currency first, then share. A rate of pesos per dollar means dollars are pesos divided by the rate. At $20$ pesos per dollar, $600$ pesos is $30$ dollars, and $5$ people pay $6$ dollars each. Multiplying by the rate goes the wrong direction.",
      "有两步时，先换算货币，再分摊。每美元兑多少比索，意味着美元数是比索数除以汇率。每美元 $20$ 比索时，$600$ 比索是 $30$ 美元，$5$ 人每人付 $6$ 美元。乘以汇率就走反了方向。",
    ),
    hardTip: t(
      "To convert a rate, multiply by fractions arranged so that unwanted units cancel. An hour is $3{,}600$ seconds, so a speed in miles per hour becomes feet per second by multiplying by $5{,}280$ and dividing by $3{,}600$. At $60$ miles per hour, that gives $88$ feet per second. Using $60$ seconds per hour is the trap.",
      "换算比率时，乘以排列好的分数，使不需要的单位约掉。一小时是 $3{,}600$ 秒，所以英里每小时换成英尺每秒，要乘 $5{,}280$ 再除以 $3{,}600$。每小时 $60$ 英里相当于每秒 $88$ 英尺。用每小时 $60$ 秒就是陷阱。",
    ),
  },
  "act-exam-finding-a-mean": {
    tip: t(
      "The mean is the sum of all the values divided by how many there are, and no sorting is needed. For $2, 8, 5, 9$: the sum is $24$ and the count is $4$, so the mean is $6$. Picking the middle of the list gives something else, and dividing by the wrong count is a common slip.",
      "平均数是所有值的和除以个数，不需要排序。对 $2, 8, 5, 9$：和是 $24$，个数是 $4$，所以平均数是 $6$。取列表的中间值得到的是别的量，除错个数也是常见疏漏。",
    ),
    hardTip: t(
      "Algebraic values follow the same rule. Add them by collecting like terms, then divide every term by the count. For $x + 2$, $3x + 4$ and $5x + 9$: the sum is $9x + 15$, so the mean is $3x + 5$. Dividing only the $x$ term leaves the constant too large.",
      "代数式同样遵循这个规则。合并同类项求和，再把每一项都除以个数。对 $x + 2$、$3x + 4$、$5x + 9$：和是 $9x + 15$，所以平均数是 $3x + 5$。只除 $x$ 项，常数就太大了。",
    ),
  },
  "act-exam-finding-a-median": {
    tip: t(
      "Sort the list before anything else, then take the middle value. For $9, 2, 7, 4, 5$, the sorted list is $2, 4, 5, 7, 9$, and the median is $5$. Taking the middle of the original list gives $7$, which is the trap. With an odd count, the median is a listed value.",
      "首先把列表排序，然后取中间的值。对 $9, 2, 7, 4, 5$，排序后是 $2, 4, 5, 7, 9$，中位数是 $5$。取原列表的中间得到 $7$，这就是陷阱。个数为奇数时，中位数是列表中的一个值。",
    ),
    hardTip: t(
      "With an even count there is no single middle value, so average the two central values after sorting. For $3, 8, 1, 6$: sorted, the central pair is $3$ and $6$, so the median is $\\frac{9}{2}$. It need not be in the list or a whole number, so do not round.",
      "个数为偶数时，没有唯一的中间值，所以排序后取中间两个值的平均。对 $3, 8, 1, 6$：排序后中间一对是 $3$ 和 $6$，所以中位数是 $\\frac{9}{2}$。它不一定在列表中，也不一定是整数，所以不要四舍五入。",
    ),
  },
  "act-exam-finding-the-area-of-a-rectangle": {
    tip: t(
      "Area counts square units, so multiply length by width. A $9$ by $3$ deck has area $27$ square feet. The sum, $12$, is half the perimeter, and $24$ is the entire perimeter. Both appear among the options, so match the units in the question to the operation.",
      "面积是数平方单位，所以长乘宽。$9$ 乘 $3$ 的平台面积是 $27$ 平方英尺。和 $12$ 是周长的一半，$24$ 是整个周长。两者都会出现在选项中，所以要让题目的单位与运算相符。",
    ),
    hardTip: t(
      "Given perimeter and one side, halve the perimeter first, because it equals one length plus one width. Subtract the known side, then multiply. With perimeter $20$ and width $3$: length $7$, area $21$. Subtracting the width from the entire perimeter leaves a length that is much too long.",
      "已知周长和一条边时，先把周长减半，因为这等于一条长加一条宽。减去已知边，再相乘。周长 $20$、宽 $3$：长 $7$，面积 $21$。用整个周长减去宽，得到的长就太长了。",
    ),
  },
  "act-exam-finding-the-volume-of-a-rectangular-prism": {
    tip: t(
      "A rectangular solid's volume is length times width times height, in cubic units. A tank that is $3$ by $4$ by $6$ feet holds $72$ cubic feet. Adding the three numbers, or computing the surface area, gives the wrong options, so look for the word cubic.",
      "长方体的体积是长乘宽乘高，单位是立方单位。$3$ 乘 $4$ 乘 $6$ 英尺的水箱容积是 $72$ 立方英尺。把三个数相加，或者计算表面积，都是错误选项，所以要留意“立方”这个词。",
    ),
    hardTip: t(
      "For small cubes filling a box, find how many fit along each edge by dividing each edge by the cube's side, then multiply. An $8$ by $4$ by $12$ box holds $4 \\cdot 2 \\cdot 6 = 48$ cubes with $2$-inch edges. Dividing the box's volume by $2$, not by the cube's volume of $8$, is the error.",
      "小立方体填满盒子时，用每条棱除以立方体的边长，求出沿各棱能放几个，再相乘。$8$ 乘 $4$ 乘 $12$ 的盒子可放 $4 \\cdot 2 \\cdot 6 = 48$ 个棱长 $2$ 英寸的立方体。用盒子体积除以 $2$，而不是除以立方体的体积 $8$，就错了。",
    ),
  },
  "act-exam-finding-a-weighted-mean": {
    tip: t(
      "Repeated scores need weighting: multiply each by how often it occurs, add, then divide by the total count. Three scores of $70$ and one of $90$ give $\\frac{210 + 90}{4} = 75$. The simple average of the two values, $80$, treats the groups as equal in size, which is the trap.",
      "重复的分数需要加权：每个分数乘它出现的次数，相加，再除以总次数。三次 $70$ 和一次 $90$，得 $\\frac{210 + 90}{4} = 75$。两个值的简单平均 $80$ 把两组当成一样大，这就是陷阱。",
    ),
    hardTip: t(
      "Course weights work like counts, so multiply each score by its parts, and divide by the sum of the parts. With $2$ parts at $60$ and $3$ parts at $80$: $\\frac{120 + 240}{5} = 72$. Dividing by $2$ because there are two scores ignores the weights. The result may be a fraction.",
      "课程权重的作用与次数相同，所以每个分数乘它的份数，再除以份数之和。$2$ 份 $60$ 和 $3$ 份 $80$：$\\frac{120 + 240}{5} = 72$。因为有两个分数就除以 $2$，就忽略了权重。结果可以是分数。",
    ),
  },
  "act-exam-reading-two-way-tables": {
    tip: t(
      "A two-way table sorts each person by two features, so a group described by both sits where its row meets its column. Find the row, move across to the column, and read that one cell. If a row reads $7$, $12$ and $19$, the last is the row's total and not a category.",
      "双向表按两个特征给每个人分类，所以同时具备两个特征的一组，位于它的行与列的交叉处。找到这一行，横向移到这一列，读出这个单元格。如果一行是 $7$、$12$、$19$，最后一个是这一行的总数，不是一个类别。",
    ),
    hardTip: t(
      "The phrase of the students in a group names the denominator: use that group's total from the margin, and the requested cell as the numerator. A cell of $4$ in a column totalling $20$ gives $\\frac{1}{5}$. Using the table's total, or the row's total, answers a different question.",
      "“某组学生中的”这个说法指明了分母：用边缘上这一组的总数，所求单元格作分子。总数 $20$ 的一列中单元格为 $4$，得 $\\frac{1}{5}$。用整张表的总数或这一行的总数，回答的是另一个问题。",
    ),
  },
  "act-exam-reading-bar-graphs": {
    tip: t(
      "Read each bar by running across from its top to the vertical axis, and check the axis's step size first. Then combine only the bars named. Bars at $40$ and $25$ total $65$. Grid lines may skip numbers, so assuming each line is $1$ gives wrong values, and including other bars overshoots.",
      "从每根柱子的顶端横向对到竖轴来读数，并且先看清轴的刻度间隔。然后只合并题目点名的柱子。$40$ 和 $25$ 的柱子共 $65$。网格线可能跳过数字，所以假定每条线代表 $1$ 就会读错，算上其他柱子也会超出。",
    ),
    hardTip: t(
      "A mean across a graph needs every bar: add all the heights, then divide by the number of bars. Bars at $20$, $30$, $40$ and $50$ have mean $35$. Reading a central bar's height is not the mean unless the data happen to balance, and the axis's top value plays no part.",
      "图上的平均数要用到每根柱子：把所有高度相加，再除以柱子的根数。$20$、$30$、$40$、$50$ 的平均数是 $35$。读中间一根柱子的高度并不是平均数，除非数据恰好平衡；轴的最大值也不起作用。",
    ),
  },
  "act-exam-working-with-circle-graphs": {
    tip: t(
      "Each sector's label is its percent of the whole amount, so multiply the total by that percent as a decimal. A $25\\%$ slice of a $200$-dollar budget is $50$ dollars. The label is not the amount itself, and the percents across the whole graph add to $100\\%$.",
      "每个扇形的标签是它占总量的百分比，所以用总量乘这个百分比的小数形式。$200$ 美元预算中 $25\\%$ 的部分是 $50$ 美元。标签不是金额本身，整个图的百分比之和是 $100\\%$。",
    ),
    hardTip: t(
      "A central angle is that same percent, taken of the full $360^\\circ$ circle. A $40\\%$ sector has an angle of $144^\\circ$. The number of responses does not matter, so take care if the total is also given. Reporting the percent as degrees is the trap to avoid.",
      "圆心角就是这个百分比乘整圆的 $360^\\circ$。$40\\%$ 的扇形，圆心角是 $144^\\circ$。回答的人数无关紧要，所以如果还给了总数，要小心。把百分比直接当作度数是要避免的陷阱。",
    ),
  },
  "act-exam-solving-for-a-count-given-a-probability": {
    tip: t(
      "A probability is favorable over total, so write that fraction with the total as an unknown and solve. With $5$ favorable and a probability of $\\frac{1}{3}$: $\\frac{5}{n} = \\frac{1}{3}$, so $n = 15$. Adding the numerator and denominator, or treating the favorable count as the total, is the trap.",
      "概率是有利数除以总数，所以把总数设为未知数，写出这个分数再求解。有利数 $5$，概率 $\\frac{1}{3}$：$\\frac{5}{n} = \\frac{1}{3}$，所以 $n = 15$。把分子分母相加，或者把有利数当成总数，都是陷阱。",
    ),
    hardTip: t(
      "Removing items of the other type changes the total, not the favorable count. Find the required total, then compare it with the present one. With $4$ red and $20$ blue and a target of $\\frac{1}{3}$: the total must be $12$, so $8$ blue stay and $12$ go. Reporting those left, rather than removed, is the slip.",
      "移走另一类物品会改变总数，而不改变有利数。求出所需的总数，再与现在的总数比较。$4$ 红 $20$ 蓝，目标 $\\frac{1}{3}$：总数必须是 $12$，所以留下 $8$ 个蓝的，移走 $12$ 个。答成留下的而不是移走的，就是疏漏。",
    ),
  },
  "act-exam-working-with-event-relationships": {
    tip: t(
      "An event and its opposite cover everything, so their probabilities add to $100\\%$. If the chance of snow is $35\\%$, the chance of no snow is $65\\%$. Subtract from $100\\%$ rather than from $1$ when working in percents, since mixing the two forms gives a nonsense value.",
      "一个事件与它的对立事件涵盖全部情况，所以概率之和是 $100\\%$。下雪的概率是 $35\\%$，不下雪的概率就是 $65\\%$。用百分比时要从 $100\\%$ 中减，而不是从 $1$ 中减，混用两种形式会得到荒谬的值。",
    ),
    hardTip: t(
      "Events that cannot both happen have no overlap, so the chance of one or the other is the sum. Neither is what remains. With $20\\%$ and $25\\%$: either is $45\\%$, so neither is $55\\%$. Multiplying treats them as independent, which is wrong, and stopping at the sum answers the opposite question.",
      "不能同时发生的事件没有重叠，所以其中之一发生的概率就是和。“都不发生”是剩下的部分。$20\\%$ 和 $25\\%$：其中之一是 $45\\%$，所以都不发生是 $55\\%$。相乘是把它们当作独立事件，这是错的；停在和上回答的是相反的问题。",
    ),
  },
  "act-exam-finding-a-union-with-overlap": {
    tip: t(
      "Adding two groups counts people in both twice, so subtract the overlap once: at least one equals first plus second minus both. With $10$, $7$ and $3$ in both: $14$. The sum alone is too big, and subtracting the overlap twice gives those in exactly one group.",
      "把两组相加时，同时属于两组的人被数了两次，所以减去一次重叠：至少属于一组等于第一组加第二组减两者都有。$10$、$7$，两者都有 $3$：共 $14$。只相加就太大了，减两次重叠得到的是恰好属于一组的人。",
    ),
    hardTip: t(
      "A probability of neither takes one more step: find the union, subtract it from everyone, and then divide by everyone. Of $50$ surveyed with $14$ in at least one group, $36$ remain, so the probability is $\\frac{18}{25}$. Leaving out the overlap correction, or giving $\\frac{14}{50}$, answers wrongly.",
      "“都没有”的概率多一步：求出并集，从总人数中减去，再除以总人数。$50$ 人中有 $14$ 人至少属于一组，剩下 $36$ 人，所以概率是 $\\frac{18}{25}$。漏掉重叠的修正，或者答 $\\frac{14}{50}$，都错了。",
    ),
  },
  "act-exam-applying-a-conditional-probability": {
    tip: t(
      "The stated condition restricts the possibilities to one group, so that group's size becomes the denominator. If $3$ of $20$ juniors cycle, a chosen junior cycles with probability $\\frac{3}{20}$. Dividing by a whole school's count is the trap. Reduce the fraction if it can be simplified.",
      "所述的条件把可能性限制在一组内，所以这一组的人数成为分母。$20$ 名三年级学生中有 $3$ 人骑车，选一名三年级学生，骑车的概率是 $\\frac{3}{20}$。除以全校人数是陷阱。分数能约分就约分。",
    ),
    hardTip: t(
      "The chance of both events is the first event's chance times the second's given the first: $P(A \\text{ and } B) = P(A)P(B \\mid A)$. With $\\frac{3}{4}$ and $\\frac{2}{5}$: $\\frac{3}{10}$. Adding them gives a value that may exceed $1$, and dividing them is the rule rearranged for a different quantity.",
      "两个事件同时发生的概率是第一个的概率乘已知第一个时第二个的概率：$P(A \\text{ and } B) = P(A)P(B \\mid A)$。$\\frac{3}{4}$ 和 $\\frac{2}{5}$：$\\frac{3}{10}$。相加可能得到大于 $1$ 的值，相除则是把规则变形后求另一个量。",
    ),
  },
  "act-exam-multiplying-independent-probabilities": {
    tip: t(
      "Independent means one outcome has no effect on the other, so the chance that both occur is the product. For $\\frac{1}{4}$ and $\\frac{2}{3}$: $\\frac{1}{6}$. Adding gives a larger number, but requiring two things should make the probability smaller. Reduce the given fractions first to make it simple.",
      "独立表示一个结果不影响另一个，所以两者同时发生的概率是积。$\\frac{1}{4}$ 和 $\\frac{2}{3}$：$\\frac{1}{6}$。相加得到更大的数，但要求两件事都发生，概率应该更小。先把给定的分数约分，计算更简单。",
    ),
    hardTip: t(
      "A repeated event contributes a power: $n$ fair flips all landing heads has probability $\\left(\\frac{1}{2}\\right)^n$. Multiply by any other independent chance. With $3$ flips and an event of $\\frac{2}{5}$: $\\frac{1}{8} \\cdot \\frac{2}{5} = \\frac{1}{20}$. Multiplying $\\frac{1}{2}$ by the number of flips is the error.",
      "重复的事件贡献一个幂：$n$ 次公平抛掷全部正面的概率是 $\\left(\\frac{1}{2}\\right)^n$。再乘其他独立事件的概率。$3$ 次抛掷和概率 $\\frac{2}{5}$ 的事件：$\\frac{1}{8} \\cdot \\frac{2}{5} = \\frac{1}{20}$。用 $\\frac{1}{2}$ 乘抛掷次数就错了。",
    ),
  },
  "act-exam-finding-a-without-replacement-probability": {
    tip: t(
      "Multiply along the draws, adjusting after each one. For two of the same kind, both the top and the bottom drop by $1$. With $5$ green and $3$ white: $\\frac{5}{8} \\cdot \\frac{4}{7} = \\frac{5}{14}$. Using $\\frac{5}{8}$ twice describes putting the card back, which the problem rules out.",
      "沿着抽取的顺序相乘，每次抽取后都要调整。两次抽同一种时，分子分母都减 $1$。$5$ 绿 $3$ 白：$\\frac{5}{8} \\cdot \\frac{4}{7} = \\frac{5}{14}$。两次都用 $\\frac{5}{8}$ 描述的是把卡片放回，而题目排除了这一点。",
    ),
    hardTip: t(
      "When the second draw wants the other kind, that kind's count stays the same, and only the total drops. With $5$ red and $3$ blue, red then blue is $\\frac{5}{8} \\cdot \\frac{3}{7} = \\frac{15}{56}$. Lowering the blue count is wrong, and the stated order means there is no second path to add.",
      "第二次要抽另一种时，这一种的数量不变，只有总数减少。$5$ 红 $3$ 蓝，先红后蓝是 $\\frac{5}{8} \\cdot \\frac{3}{7} = \\frac{15}{56}$。减少蓝色的数量是错的；题目规定了顺序，所以没有第二条路径要加。",
    ),
  },
  "act-exam-problem-solving-with-dependent-selections": {
    tip: t(
      "Once the first pick is known, only the second is uncertain, so update the group and write a single fraction. From $5$ seniors and $4$ juniors, after a senior is chosen, the chance of another is $\\frac{4}{8} = \\frac{1}{2}$. Multiplying by the first pick's chance answers a different question.",
      "第一次的结果已知后，只有第二次不确定，所以更新这一组，写出一个分数。$5$ 名高年级和 $4$ 名低年级学生，选出一名高年级后，再选到高年级的概率是 $\\frac{4}{8} = \\frac{1}{2}$。再乘第一次的概率，回答的是另一个问题。",
    ),
    hardTip: t(
      "Different kinds can arise in either order, so add both paths. From $5$ and $4$: $\\frac{5}{9} \\cdot \\frac{4}{8} + \\frac{4}{9} \\cdot \\frac{5}{8} = \\frac{5}{9}$. Counting one path gives half the answer. Check with the complement: the chance of two alike is $\\frac{4}{9}$, and the two chances total $1$.",
      "不同类别可以按任一顺序出现，所以把两条路径相加。$5$ 和 $4$：$\\frac{5}{9} \\cdot \\frac{4}{8} + \\frac{4}{9} \\cdot \\frac{5}{8} = \\frac{5}{9}$。只算一条路径，答案就只有一半。用补集检验：两个相同的概率是 $\\frac{4}{9}$，两个概率之和是 $1$。",
    ),
  },
  "act-exam-finding-a-probability-of-an-arrangement": {
    tip: t(
      "In a random lineup, a given person is equally likely to occupy each spot, so the probability of one specific spot is $1$ over the number of people. With $8$ people, it is $\\frac{1}{8}$. No factorials are needed, and counting all arrangements gives the same result the long way.",
      "随机排队时，某个人占据每个位置的可能性相同，所以在某个特定位置的概率是 $1$ 除以人数。$8$ 个人时是 $\\frac{1}{8}$。不需要阶乘，数出所有排列也会得到同样的结果，只是绕了远路。",
    ),
    hardTip: t(
      "Glue the pair into one block, which leaves $n - 1$ things to arrange. If either order is allowed, double it, so $\\frac{2(n - 1)!}{n!} = \\frac{2}{n}$. If one must be immediately left of the other, there is one order, so the answer is $\\frac{1}{n}$. With $5$ items, those are $\\frac{2}{5}$ and $\\frac{1}{5}$. Read which is requested.",
      "把这一对粘成一块，就剩 $n - 1$ 个东西要排列。如果两种顺序都可以，就加倍，所以 $\\frac{2(n - 1)!}{n!} = \\frac{2}{n}$。如果一个必须紧挨在另一个左边，只有一种顺序，答案是 $\\frac{1}{n}$。$5$ 件物品时分别是 $\\frac{2}{5}$ 和 $\\frac{1}{5}$。要看清问的是哪一种。",
    ),
  },
  "act-exam-finding-a-probability-from-a-sample-space": {
    tip: t(
      "List the favorable outcomes and count them, watching whether the boundary counts. On a spinner from $1$ to $8$, greater than $5$ means $6$, $7$ and $8$, so the probability is $\\frac{3}{8}$. Including the $5$ itself gives one too many, as the word greater excludes it.",
      "列出有利结果并数一数，注意边界算不算。在 $1$ 到 $8$ 的转盘上，大于 $5$ 意味着 $6$、$7$、$8$，所以概率是 $\\frac{3}{8}$。把 $5$ 也算进去就多了一个，因为“大于”排除了它。",
    ),
    hardTip: t(
      "With two dice, the sample space has one die's faces times the other's outcomes, and each ordered pair is equally likely. List pairs reaching the target. Dice of $6$ and $8$ faces have $48$ pairs, and a sum of $13$ comes from $(5, 8)$ and $(6, 7)$, so the probability is $\\frac{1}{24}$. Treat each die's limit carefully.",
      "两个骰子的样本空间是一个骰子的面数乘另一个的结果数，每个有序对可能性相同。列出达到目标的数对。$6$ 面和 $8$ 面的骰子有 $48$ 对，和为 $13$ 来自 $(5, 8)$ 和 $(6, 7)$，所以概率是 $\\frac{1}{24}$。要留意每个骰子的上限。",
    ),
  },
  "act-exam-finding-a-geometric-probability": {
    tip: t(
      "A random point in a region lands in a part with probability equal to the area of the part over the whole. Compare areas, so square the sides: a square of side $4$ inside one of side $10$ gives $\\frac{16}{100} = \\frac{4}{25}$. The ratio of sides, $\\frac{2}{5}$, is the trap.",
      "随机点落在某部分的概率，等于这部分的面积除以整体的面积。比较的是面积，所以要把边长平方：边长 $10$ 的正方形中有边长 $4$ 的正方形，概率是 $\\frac{16}{100} = \\frac{4}{25}$。边长之比 $\\frac{2}{5}$ 就是陷阱。",
    ),
    hardTip: t(
      "On a segment, the ratio uses lengths. Being within $d$ of the midpoint allows $d$ on each side, a stretch of $2d$. On a segment of $60$, with $d = 3$, the probability is $\\frac{6}{60} = \\frac{1}{10}$. Using $d$ alone misses half the favorable stretch, and the midpoint itself plays no other role.",
      "在线段上，比值用的是长度。距中点不超过 $d$，两侧各有 $d$，共长 $2d$。长 $60$ 的线段，$d = 3$，概率是 $\\frac{6}{60} = \\frac{1}{10}$。只用 $d$ 就漏了一半有利长度；中点本身没有其他作用。",
    ),
  },
  "act-exam-computing-an-expected-value": {
    tip: t(
      "Expected value is the sum of each outcome times its probability. If a game pays $10$ dollars at $30\\%$ and $1$ dollar otherwise, the other chance is $70\\%$: $3 + 0.7 = 3.7$ dollars. The plain average of the two payouts ignores how likely each is, so it is wrong here.",
      "期望值是每个结果乘它的概率之和。游戏以 $30\\%$ 的概率付 $10$ 美元，否则付 $1$ 美元，另一个概率是 $70\\%$：$3 + 0.7 = 3.7$ 美元。两个赔付的简单平均忽略了各自的可能性，所以这里是错的。",
    ),
    hardTip: t(
      "With three outcomes, the method is the same, and the probabilities should total $100\\%$. For values $5$, $10$ and $20$ at $50\\%$, $30\\%$ and $20\\%$: $2.5 + 3 + 4 = 9.5$. Pairing a value with the wrong probability is the usual slip, so match them in the order given.",
      "有三个结果时方法相同，概率之和应为 $100\\%$。值 $5$、$10$、$20$，概率 $50\\%$、$30\\%$、$20\\%$：$2.5 + 3 + 4 = 9.5$。把值与错误的概率配对是常见疏漏，所以要按给定的顺序对应。",
    ),
  },
  "act-exam-problem-solving-with-expected-value": {
    tip: t(
      "A ticket's expected winnings are the prize times the chance of winning. With one prize among $N$ tickets, that is the prize over $N$. A $20$-dollar prize among $50$ tickets gives $\\frac{2}{5}$ of a dollar. The cost is excluded here, because the question asks for winnings before it.",
      "一张票的期望奖金是奖金乘中奖概率。$N$ 张票中有一个奖时，就是奖金除以 $N$。$50$ 张票中 $20$ 美元的奖，期望是 $\\frac{2}{5}$ 美元。这里不算成本，因为题目问的是扣除成本前的奖金。",
    ),
    hardTip: t(
      "Net gain is expected payout minus cost, since the cost is paid on every play, win or lose. A game costing $5$ dollars and paying $20$ dollars with probability $\\frac{1}{10}$ has a net gain of $2 - 5 = -3$ dollars. Keep the negative sign. Subtracting the cost only from the prize understates the loss.",
      "净收益是期望赔付减成本，因为无论输赢，每次都要付成本。花 $5$ 美元玩、以 $\\frac{1}{10}$ 的概率付 $20$ 美元的游戏，净收益是 $2 - 5 = -3$ 美元。要保留负号。只从奖金中减成本，就低估了损失。",
    ),
  },
  "act-exam-counting-independent-choices": {
    tip: t(
      "When a choice from each category is made independently, multiply the numbers of options. With $3$ hats, $5$ shirts and $2$ belts, there are $30$ outfits. Adding them gives $10$, which counts single items and not full combinations. A tree diagram confirms that each branch splits again.",
      "每一类各选一项且相互独立时，把选项数相乘。$3$ 顶帽子、$5$ 件衬衫、$2$ 条腰带，有 $30$ 种搭配。相加得 $10$，数的是单件而不是完整搭配。树状图可以确认每个分支都会再分。",
    ),
    hardTip: t(
      "If some options are unavailable, reduce that category first, then multiply. With $7$ shirts, $5$ pants and $2$ hats, and with $3$ shirts out, there are $4 \\cdot 5 \\cdot 2 = 40$ outfits. Subtracting $3$ from the full product is the trap, as each missing shirt removes many outfits.",
      "如果有些选项没有了，先减少这一类，再相乘。$7$ 件衬衫、$5$ 条裤子、$2$ 顶帽子，缺 $3$ 件衬衫，有 $4 \\cdot 5 \\cdot 2 = 40$ 种搭配。从全部的积中减 $3$ 就是陷阱，因为每缺一件衬衫都会少很多种搭配。",
    ),
  },
  "act-exam-counting-character-codes": {
    tip: t(
      "Each position is a separate choice, so multiply one factor per character. With repetition allowed, the count of options stays fixed, giving powers. With $3$ letters from $5$ and $2$ digits from $10$: $5^3 \\cdot 10^2 = 12{,}500$. Multiplying the number of positions by the options, as in $3 \\cdot 5$, is wrong.",
      "每个位置都是单独的选择，所以每个字符乘一个因子。允许重复时，选项数不变，就得到幂。从 $5$ 个字母选 $3$ 个、从 $10$ 个数字选 $2$ 个：$5^3 \\cdot 10^2 = 12{,}500$。用位置数乘选项数，比如 $3 \\cdot 5$，就错了。",
    ),
    hardTip: t(
      "When characters of a type must differ, the options fall by $1$ with each pick, while repeating types still use powers. With $2$ repeatable letters from $5$ and $2$ different digits from $10$: $5^2 \\cdot 10 \\cdot 9 = 2{,}250$. Using $10^2$ allows a repeated digit, which is what the condition forbids.",
      "同一类字符必须不同时，每选一个选项就减 $1$，而可重复的类别仍用幂。从 $5$ 个字母选 $2$ 个可重复，从 $10$ 个数字选 $2$ 个不同：$5^2 \\cdot 10 \\cdot 9 = 2{,}250$。用 $10^2$ 就允许数字重复，而这正是条件所禁止的。",
    ),
  },
  "act-exam-counting-permutations": {
    tip: t(
      "Filling ordered places, each one uses a person who cannot appear again, so the options fall by $1$. For the top $3$ of $8$ runners: $8 \\cdot 7 \\cdot 6 = 336$. Dividing by a factorial treats order as irrelevant, which is the wrong model, since first and second differ.",
      "填充有顺序的名次时，每个名次用掉一个人，这个人不能再出现，所以选项减 $1$。$8$ 名选手的前 $3$ 名：$8 \\cdot 7 \\cdot 6 = 336$。除以阶乘就是认为顺序无关，模型错了，因为第一名和第二名不同。",
    ),
    hardTip: t(
      "If each kind must stay together in a fixed section, arrange each section on its own, then multiply. With $3$ mugs before $5$ bowls: $3! \\cdot 5! = 720$. Using $8!$ ignores the restriction, and adding the factorials misses that each mug order goes with each bowl order. The sections cannot swap here.",
      "如果每一类必须集中在固定的区段，就分别排列每个区段，再相乘。$3$ 个杯子在 $5$ 个碗之前：$3! \\cdot 5! = 720$。用 $8!$ 就忽略了限制；把阶乘相加，则没考虑到每种杯子的顺序都能配每种碗的顺序。这里两个区段不能对调。",
    ),
  },
  "act-exam-counting-combinations": {
    tip: t(
      "When order does not matter, count ordered selections and divide by the repeats. For pairs, each is counted twice, so $\\binom{n}{2} = \\frac{n(n - 1)}{2}$. From $12$ people, that is $66$ pairs. Forgetting to divide gives $132$, which counts each pair in both orders.",
      "顺序无关时，数出有序选择，再除以重复次数。对于两人组，每组被数了两次，所以 $\\binom{n}{2} = \\frac{n(n - 1)}{2}$。$12$ 个人有 $66$ 组。忘了除，得到 $132$，这是把每组按两种顺序都数了一遍。",
    ),
    hardTip: t(
      "When a selection draws from two separate groups, compute each combination and multiply, since any choice from one pairs with any from the other. Two of $6$ and two of $5$: $15 \\cdot 10 = 150$. Adding them, or using $\\binom{11}{4}$, ignores the required split between the groups.",
      "从两个独立的组中选取时，分别算组合数再相乘，因为一组的任何选法都能配另一组的任何选法。$6$ 选 $2$ 和 $5$ 选 $2$：$15 \\cdot 10 = 150$。相加，或者用 $\\binom{11}{4}$，都忽略了两组之间规定的分配。",
    ),
  },
  "act-exam-counting-overlapping-sets": {
    tip: t(
      "Elements in only one set are those remaining after shared ones are removed: $|A| - |A \\cap B|$. If $A$ has $20$ and $7$ are shared, then $13$ are in $A$ only. The size of $B$ is not needed, and it is a distractor. Adding the sets finds the union instead.",
      "只属于一个集合的元素，是去掉共有元素后剩下的：$|A| - |A \\cap B|$。$A$ 有 $20$ 个，共有 $7$ 个，则只属于 $A$ 的有 $13$ 个。不需要 $B$ 的大小，它只是干扰。把集合相加求的是并集。",
    ),
    hardTip: t(
      "If the overlap is the unknown, subtract those in neither from the total to get the union, then use: both equals first plus second minus union. Of $40$ with $25$, $20$ and $10$ in neither: the union is $30$, so both is $15$. Omitting the neither group gives an overlap that is too small.",
      "重叠未知时，从总数中减去两者都不属于的人，得到并集，再用：两者都有等于第一组加第二组减并集。$40$ 人，$25$、$20$，都不属于 $10$：并集是 $30$，所以两者都有的是 $15$。漏掉都不属于的这一组，重叠就太小了。",
    ),
  },
  "act-exam-identifying-possible-set-sizes": {
    tip: t(
      "A shared element must belong to each set, so the overlap cannot exceed the smaller set. The most it can hold is when the smaller set lies entirely inside the larger. For sizes $12$ and $20$, the greatest overlap is $12$. Choosing the larger size or the sum breaks that limit.",
      "共有元素必须同时属于两个集合，所以重叠不能超过较小的集合。当较小的集合完全包含在较大的集合内时，重叠最多。大小 $12$ 和 $20$ 时，最大重叠是 $12$。选较大的值或和，都超过了这个限度。",
    ),
    hardTip: t(
      "The union must hold every element of the larger set, so its least size is the larger size, reached when the smaller set lies inside it. For $12$ and $20$: at least $20$. The sum, $32$, is the greatest possible, for disjoint sets. Check whether the question asks for least or greatest.",
      "并集必须包含较大集合的每个元素，所以它的最小值就是较大集合的大小，在较小集合包含于其中时达到。$12$ 和 $20$：至少 $20$。和 $32$ 是最大可能值，此时两集合不相交。要看清问的是最小还是最大。",
    ),
  },
  "act-exam-estimating-a-population-mean": {
    tip: t(
      "A random sample's mean estimates the mean of the whole population, so multiply it by the population's size for a total. With a mean of $2.5$ across $1{,}000$ homes, the estimate is $2{,}500$. The sample's size only affects how reliable this is, so using it in the calculation is the trap.",
      "随机样本的平均数估计了总体的平均数，所以乘总体的大小得到总量。$1{,}000$ 户平均 $2.5$，估计值是 $2{,}500$。样本大小只影响可靠程度，所以把它代入计算就是陷阱。",
    ),
    hardTip: t(
      "A margin of error describes a plausible range around the estimate: subtract and add it to the sample's mean. A mean of $50$ with a margin of $3$ gives $47$ to $53$. Going in just one direction, or doubling the margin on each side, is wrong. The true mean is not guaranteed to fall inside.",
      "误差范围描述估计值周围的合理区间：用样本平均数分别减去和加上它。平均数 $50$、误差范围 $3$，得 $47$ 到 $53$。只朝一个方向，或者每侧都加倍，都是错的。真实平均数不一定保证落在区间内。",
    ),
  },
  "act-exam-applying-the-empirical-rule": {
    tip: t(
      "In a normal distribution, about $68\\%$ of values lie within one standard deviation of the mean, $95\\%$ within two and $99.7\\%$ within three. First find how many deviations the bounds are from the mean. With mean $100$ and deviation $10$, the range from $80$ to $120$ holds $95\\%$.",
      "在正态分布中，约 $68\\%$ 的值在平均数的一个标准差之内，$95\\%$ 在两个之内，$99.7\\%$ 在三个之内。先求出边界离平均数有几个标准差。平均数 $100$、标准差 $10$ 时，$80$ 到 $120$ 之间占 $95\\%$。",
    ),
    hardTip: t(
      "A tail is half of what lies outside the band, because the curve is symmetric. Beyond two deviations on both sides lies $5\\%$, so $2.5\\%$ lies above. With $2{,}000$ students and a cutoff two deviations up, about $50$ students are above. Using $5\\%$ counts both tails, and that doubles the answer.",
      "尾部是带外部分的一半，因为曲线是对称的。两侧超出两个标准差的部分共占 $5\\%$，所以上方占 $2.5\\%$。$2{,}000$ 名学生，临界值高出两个标准差，约有 $50$ 人在其上。用 $5\\%$ 就算了两侧尾部，答案翻倍。",
    ),
  },
};
