// Further knowledge points for topics of Precalculus, each a skill the topic's
// own points leave out: working backwards from a condition, a parameter that
// changes the answer, or a fact used in a new setting. See `deeperPrecalculusPoints`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import { dec, poly, Q } from "@ga/subject-math";

import { numberProblem } from "../problems.ts";

/** frac writes a rational number. */
const frac = (n: number, d = 1) => Q.of(n, d).toLatex();
/** nonzero picks a nonzero integer from -r to r. */
const nonzero = (rng: Rng, r: number) => rng.nonZero(-r, r);
/** signedIn picks an integer whose size is from lo to hi, with either sign. */
const signedIn = (rng: Rng, lo: number, hi: number) => rng.sign() * rng.int(lo, hi);
/** inParens puts a negative number in parentheses, for use inside a sum or a product. */
const inParens = (n: number) => (n < 0 ? `(${n})` : `${n}`);
/** ratioInParens writes a rational number, in parentheses when it is negative. */
const ratioInParens = (n: number, d: number) => (n * d < 0 ? `\\left(${frac(n, d)}\\right)` : frac(n, d));
/** minus writes the factor or denominator x - k without a doubled sign. */
const minus = (k: number, variable = "x") => poly([1, variable], [-k, ""]);
/** mat writes a matrix by rows. */
const mat = (rows: readonly (readonly number[])[]) => `\\begin{pmatrix} ${rows.map((r) => r.join(" & ")).join(" \\\\ ")} \\end{pmatrix}`;
/** vec writes a vector in angle brackets. */
const vec = (...v: readonly number[]) => `\\langle ${v.join(", ")} \\rangle`;
/** gcd finds the greatest common divisor of two integers. */
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
/** triples lists Pythagorean triples with the hypotenuse last. */
const triples = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [20, 21, 29],
  [12, 35, 37],
  [9, 40, 41],
] as const;
/** legsAndHypotenuse picks a Pythagorean triple, in either order of its legs and scaled by up to the given factor. */
const legsAndHypotenuse = (rng: Rng, maxScale: number) => {
  const [x, y, h] = rng.pick(triples);
  const scale = rng.int(1, maxScale);
  return rng.bool() ? [x * scale, y * scale, h * scale] : [y * scale, x * scale, h * scale];
};
/** properFractions lists the pairs p, q with 1 <= p < q <= maxDenominator and no common factor. */
const properFractions = (maxDenominator: number) => {
  const pairs: (readonly [number, number])[] = [];
  for (let q = 2; q <= maxDenominator; q++) {
    for (let p = 1; p < q; p++) if (gcd(p, q) === 1) pairs.push([p, q]);
  }
  return pairs;
};
/** complex writes a + bi without a unit coefficient or a doubled sign. */
const complex = (a: number, b: number) => poly([a, ""], [b, "i"]);

// ---------------------------------------------------------------------------
// Inequalities and parameters
// ---------------------------------------------------------------------------

const constantForHole: KnowledgePointDef = {
  id: "the-constant-that-makes-a-hole-instead-of-an-asymptote",
  title: t("The constant that makes a hole instead of an asymptote", "使图像出现空心点而非渐近线的常数"),
  explanation: t(
    "A zero of the denominator gives a vertical asymptote unless the same factor cancels with the numerator, and then the graph has only a hole. So asking for a hole is really a condition on the numerator: it must equal zero at that value of $x$. Substituting the value turns the condition into an equation for an unknown coefficient, and this can be solved without factoring anything first.",
    "分母的零点会产生竖直渐近线，除非同一个因式能与分子约去，这时图像只有一个空心点。所以要求出现空心点，实际上是对分子提出条件：分子在这个 $x$ 值处必须等于零。代入这个值，条件就变成关于未知系数的方程，不必先分解因式就能解出。",
  ),
  generate(rng) {
    const a = nonzero(rng, 7);
    const r = rng.pick([-8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8].filter((v) => Math.abs(v) !== Math.abs(a)));
    const b = -(a + r);
    const answer = a * r;
    const top = `${poly([1, "x^{2}"], [b, "x"])} + c`;
    return numberProblem({
      prompt: t(
        `The function $f(x) = \\frac{${top}}{${minus(a)}}$ has a hole at $x = ${a}$, not a vertical asymptote. Find $c$.`,
        `函数 $f(x) = \\frac{${top}}{${minus(a)}}$ 在 $x = ${a}$ 处是空心点，而不是竖直渐近线。求 $c$。`,
      ),
      answer,
      form: "integer",
      wrong: [-answer, a * a, -a * a, a * b, r],
      solution: t(
        `For the factor $${minus(a)}$ to cancel, the numerator must be zero at $x = ${a}$. So $${inParens(a)}^{2} + ${inParens(b)} \\cdot ${inParens(a)} + c = 0$, which is $${a * a + a * b} + c = 0$. Hence $c = ${answer}$.`,
        `要约去因式 $${minus(a)}$，分子在 $x = ${a}$ 处必须为零。所以 $${inParens(a)}^{2} + ${inParens(b)} \\cdot ${inParens(a)} + c = 0$，即 $${a * a + a * b} + c = 0$。因此 $c = ${answer}$。`,
      ),
    });
  },
};

const leadingParameter: KnowledgePointDef = {
  id: "a-parameter-in-the-leading-coefficient-for-one-solution",
  title: t("A parameter in the leading coefficient for one solution", "首项系数中的参数与唯一解"),
  explanation: t(
    "The discriminant does not care which coefficient holds the parameter. When a quadratic equation has exactly one real solution, its discriminant is zero, and this gives one equation that can be solved for the unknown. If the parameter stands in front of the square, the discriminant is linear in it, so there is a single answer rather than a pair of values. The requirement that the equation stays quadratic keeps the parameter from being zero.",
    "判别式并不在意参数出现在哪个系数上。一元二次方程恰有一个实数解时，判别式为零，这就给出一个可以解出未知数的方程。如果参数在平方项前面，判别式关于它是一次的，所以只有一个答案，而不是一对值。方程必须仍是二次方程，这一要求保证参数不为零。",
  ),
  generate(rng) {
    const c = signedIn(rng, 2, 6);
    const m = signedIn(rng, 2, 5);
    const b = 2 * c * m;
    const answer = c * m * m;
    const equation = poly([1, "kx^{2}"], [b, "x"], [c, ""]);
    return numberProblem({
      prompt: t(
        `The quadratic equation $${equation} = 0$, where $k \\ne 0$, has exactly one real solution. Find $k$.`,
        `二次方程 $${equation} = 0$（其中 $k \\ne 0$）恰有一个实数解。求 $k$。`,
      ),
      answer,
      form: "integer",
      wrong: [-answer, 4 * answer, 2 * answer, m],
      solution: t(
        `Exactly one solution means the discriminant is zero: $${inParens(b)}^{2} - 4k \\cdot ${inParens(c)} = 0$. This gives $${b * b} = ${4 * c}k$, so $k = ${answer}$.`,
        `恰有一个解说明判别式为零：$${inParens(b)}^{2} - 4k \\cdot ${inParens(c)} = 0$。于是 $${b * b} = ${4 * c}k$，所以 $k = ${answer}$。`,
      ),
    });
  },
};

const integersInFourFactors: KnowledgePointDef = {
  id: "counting-the-integers-in-a-four-factor-sign-table",
  title: t("Counting the integers in a four-factor sign table", "数出四因式符号表中的整数解"),
  explanation: t(
    "With an even number of factors, the product is positive far to the right and far to the left, so a strict inequality below zero has a solution set made of bounded intervals, and only finitely many integers lie in it. To count them, build the sign table, keep the intervals with the right sign, and remember that a strict inequality leaves out every endpoint. Each interval then contributes the integers strictly between its two ends.",
    "因式个数为偶数时，乘积在最右边和最左边都是正的，所以严格小于零的不等式的解集由有界区间组成，其中只有有限个整数。要数出它们，先列符号表，保留符号正确的区间，并记住严格不等式不含任何端点。于是每个区间贡献严格位于两端之间的整数。",
  ),
  generate(rng) {
    const a = rng.int(-9, -2);
    const [g1, g2, g3] = [rng.int(2, 6), rng.int(2, 6), rng.int(2, 6)];
    const [b, c, d] = [a + g1, a + g1 + g2, a + g1 + g2 + g3];
    const answer = g1 - 1 + (g3 - 1);
    const product = [a, b, c, d].map((v) => `(${minus(v)})`).join("");
    return numberProblem({
      prompt: t(`How many integers $x$ satisfy $${product} < 0$?`, `有多少个整数 $x$ 满足 $${product} < 0$？`),
      answer,
      form: "integer",
      wrong: [answer + 4, answer + 2, g2 - 1, d - a - 1, answer + 1],
      solution: t(
        `The product is positive to the right of $${d}$, and its sign changes at each zero. So it is negative on $(${c}, ${d})$ and on $(${a}, ${b})$. The endpoints are excluded, so the intervals hold ${g3 - 1 === 1 ? "one integer" : `${g3 - 1} integers`} and ${g1 - 1 === 1 ? "one integer" : `${g1 - 1} integers`}, which is ${answer} in all.`,
        `乘积在 $${d}$ 的右边为正，每经过一个零点就变号。所以它在 $(${c}, ${d})$ 和 $(${a}, ${b})$ 上为负。端点不包括在内，两个区间分别含 ${g3 - 1} 个和 ${g1 - 1} 个整数，共 ${answer} 个。`,
      ),
    });
  },
};

const radicalBothSides: KnowledgePointDef = {
  id: "a-radical-inequality-with-the-unknown-on-both-sides",
  title: t("A radical inequality with the unknown on both sides", "两边都含未知数的根式不等式"),
  explanation: t(
    "When a square root is less than an expression in the unknown, that expression must be positive, because a square root is never negative. Only on that condition may both sides be squared. Squaring gives a quadratic inequality whose two roots look equally good, but one of them makes the right side negative and belongs to the squared inequality alone. The positivity condition removes that root and everything beyond it.",
    "平方根小于一个含未知数的式子时，这个式子必须为正，因为平方根不会是负数。只有在这个条件下才能两边平方。平方后得到一个二次不等式，它的两个根看起来同样合理，但其中一个使右边为负，只属于平方后的不等式。正数条件排除了这个根以及它之外的部分。",
  ),
  generate(rng) {
    const u = rng.int(2, 7);
    const r = rng.pick([-8, -7, -6, -5, -4, -3, -2, -1, 1]);
    const a = u * u - r;
    const b = u - r;
    const s = r + 1 - 2 * u;
    const left = `\\sqrt{${poly([1, "x"], [a, ""])}}`;
    const right = poly([1, "x"], [b, ""]);
    return numberProblem({
      prompt: t(
        `The solution set of $${left} < ${right}$ has the form $x > c$. Find $c$.`,
        `不等式 $${left} < ${right}$ 的解集形如 $x > c$。求 $c$。`,
      ),
      answer: r,
      form: "integer",
      wrong: [s, -b, -a, r + 1],
      solution: t(
        `The right side must be positive, so $x > ${-b}$. Squaring then gives $(${minus(r)})(${minus(s)}) > 0$. The root $x = ${s}$ makes the right side negative, so it lies outside the allowed values, and only $x > ${r}$ remains. So $c = ${r}$.`,
        `右边必须为正，所以 $x > ${-b}$。平方后得 $(${minus(r)})(${minus(s)}) > 0$。根 $x = ${s}$ 使右边为负，不在允许范围内，只剩下 $x > ${r}$。所以 $c = ${r}$。`,
      ),
    });
  },
};

const sumOfLogs: KnowledgePointDef = {
  id: "a-sum-of-two-logarithms-in-an-inequality",
  title: t("A sum of two logarithms in an inequality", "不等式中两个对数的和"),
  explanation: t(
    "A sum of logarithms with one base combines into the logarithm of a product, and with a base above one the inequality then passes straight to the arguments. But combining hides a condition: each original argument must be positive on its own, while the product can also be positive when both are negative. So the quadratic that results has a root that must be thrown away, and the domain has to be read from the original logarithms.",
    "同底对数的和可以合并成积的对数，底数大于一时，不等式就直接转到真数上。但合并会隐藏一个条件：原来的每个真数都必须各自为正，而两个真数同时为负时积也是正的。所以得到的二次式有一个根必须舍去，定义域要从原来的对数读出。",
  ),
  generate(rng) {
    const base = rng.pick([2, 3]);
    const i = rng.int(1, base === 2 ? 6 : 4);
    const j = rng.int(0, i - 1);
    const shift = rng.int(1, 9);
    const big = base ** i;
    const small = base ** j;
    const gap = big - small;
    const answer = shift + big;
    const logs = `\\log_{${base}}(${minus(shift)}) + \\log_{${base}}(${minus(shift + gap)})`;
    return numberProblem({
      prompt: t(`Find the largest solution of $${logs} \\le ${i + j}$.`, `求 $${logs} \\le ${i + j}$ 的最大解。`),
      answer,
      form: "integer",
      wrong: [shift - small, big, i + j, shift + gap, shift + big * small],
      solution: t(
        `Write $u = ${minus(shift)}$. Combining the logarithms gives $u(${minus(gap, "u")}) \\le ${big * small}$, which factors as $(${minus(big, "u")})(${minus(-small, "u")}) \\le 0$. The original logarithms need $u > ${gap}$, so the negative root is thrown away and $u \\le ${big}$. The largest solution is $x = ${shift} + ${big} = ${answer}$.`,
        `设 $u = ${minus(shift)}$。合并对数得 $u(${minus(gap, "u")}) \\le ${big * small}$，分解为 $(${minus(big, "u")})(${minus(-small, "u")}) \\le 0$。原来的对数要求 $u > ${gap}$，所以舍去负根，得 $u \\le ${big}$。最大解是 $x = ${shift} + ${big} = ${answer}$。`,
      ),
    });
  },
};

const closeToLimit: KnowledgePointDef = {
  id: "how-many-terms-bring-a-series-close-to-its-limit",
  title: t("How many terms bring a series close to its limit", "多少项能使级数接近它的极限"),
  explanation: t(
    "When the common ratio is between zero and one, the partial sums climb toward the infinite sum, and the gap left over has a formula of its own. It equals the infinite sum multiplied by the ratio raised to the number of terms taken. So asking how many terms are needed to come within a given tolerance is an inequality in a power. Note that this gap is larger than the next term, so judging by the size of a term alone gives too few terms.",
    "公比在零和一之间时，部分和逐渐上升，趋向无穷级数的和，剩下的差距有自己的公式：它等于无穷级数的和乘以公比的项数次幂。所以问需要多少项才能进入给定的误差范围，就是一个关于幂的不等式。注意这个差距比下一项大，所以只凭某一项的大小来判断，得到的项数会偏少。",
  ),
  generate(rng) {
    const q = rng.int(2, 5);
    const m = rng.int(1, 9);
    const denominator = rng.pick([10, 100, 1000]);
    const first = m * (q - 1);
    const target = m * denominator;
    let answer = 1;
    while (q ** (answer - 1) <= target) answer++;
    let byTerm = 1;
    while (first * denominator >= q ** (byTerm - 1)) byTerm++;
    return numberProblem({
      prompt: t(
        `A geometric series has first term $${first}$ and common ratio $\\frac{1}{${q}}$. Find the smallest positive integer $n$ such that the sum of the first $n$ terms differs from the infinite sum by less than $\\frac{1}{${denominator}}$.`,
        `一个等比级数的首项是 $${first}$，公比是 $\\frac{1}{${q}}$。求最小的正整数 $n$，使前 $n$ 项的和与无穷级数的和相差小于 $\\frac{1}{${denominator}}$。`,
      ),
      answer,
      form: "integer",
      wrong: [byTerm, answer - 1, answer + 1, answer + 2],
      solution: t(
        `The infinite sum is $${m * q}$, and the gap after $n$ terms is the infinite sum times the ratio to the power $n$, which is $${m * q} \\cdot \\frac{1}{${q}^{n}}$. Requiring this to be below the tolerance gives $${q}^{n - 1} > ${target}$. Trying powers, $${q}^{${answer - 1}} = ${q ** (answer - 1)}$ is the first to pass ${target}, so $n = ${answer}$.`,
        `无穷级数的和是 $${m * q}$，前 $n$ 项之后的差距等于这个和乘以公比的 $n$ 次幂，即 $${m * q} \\cdot \\frac{1}{${q}^{n}}$。要求它小于误差范围，得 $${q}^{n - 1} > ${target}$。逐个试幂，$${q}^{${answer - 1}} = ${q ** (answer - 1)}$ 最先超过 ${target}，所以 $n = ${answer}$。`,
      ),
    });
  },
};

const denominatorFromCount: KnowledgePointDef = {
  id: "a-denominator-from-a-count-of-integer-solutions",
  title: t("A denominator from a count of integer solutions", "由整数解个数求分母"),
  explanation: t(
    "In a rational inequality with a weak sign, the zero of the numerator belongs to the solution set and the zero of the denominator never does, since the quotient does not exist there. This difference matters when a count of solutions is given. The interval is closed at one end and open at the other, so the number of integers in it equals the distance between the ends, and an unknown end can be read off from the count.",
    "在带等号的分式不等式中，分子的零点属于解集，分母的零点却绝不属于解集，因为分式在那里没有意义。给出解的个数时，这个区别就很重要。区间一端闭、一端开，所以其中的整数个数恰好等于两端之间的距离，由个数就能读出未知的端点。",
  ),
  generate(rng) {
    const a = rng.int(-9, 9);
    const count = rng.int(2, 9);
    const answer = a + count;
    const fraction = `\\frac{${minus(a)}}{x - b}`;
    return numberProblem({
      prompt: t(
        `The inequality $${fraction} \\le 0$, where $b > ${a}$, has exactly ${count} integer solutions. Find $b$.`,
        `不等式 $${fraction} \\le 0$（其中 $b > ${a}$）恰有 ${count} 个整数解。求 $b$。`,
      ),
      answer,
      form: "integer",
      wrong: [answer + 1, answer - 1, a - count, count],
      solution: t(
        `The quotient is negative between $${a}$ and $b$, is zero at $x = ${a}$, and does not exist at $x = b$. So the solution set is $[${a}, b)$, whose integers run from $${a}$ up to the one just below $b$. Their number is the distance from $${a}$ to $b$, so $b = ${answer}$.`,
        `商在 $${a}$ 与 $b$ 之间为负，在 $x = ${a}$ 处为零，在 $x = b$ 处没有意义。所以解集是 $[${a}, b)$，其中的整数从 $${a}$ 一直到比 $b$ 小 1 的数，个数等于 $${a}$ 到 $b$ 的距离，所以 $b = ${answer}$。`,
      ),
    });
  },
};

const constantFromInterval: KnowledgePointDef = {
  id: "the-constant-from-the-solution-set-of-a-rational-inequality",
  title: t("The constant from the solution set of a rational inequality", "由分式不等式的解集求常数"),
  explanation: t(
    "The ends of a solution set are not arbitrary. One end of a rational inequality comes from a zero of the denominator, and the other comes from a point where the two sides are equal. So if the solution set is known, the end that is not a zero of the denominator can be substituted to give an equation, and any unknown constant in the inequality can be found with no need to solve the inequality at all.",
    "解集的端点不是随意的。分式不等式的一个端点来自分母的零点，另一个来自两边相等的点。所以如果已知解集，就可以把不是分母零点的那个端点代入，得到一个方程，从而求出不等式中的未知常数，根本不必解这个不等式。",
  ),
  generate(rng) {
    const b = rng.int(-8, 8);
    const g = rng.int(1, 6);
    const k = rng.int(2, 7);
    const a = b - g * (k - 1);
    const end = b + g;
    const fraction = `\\frac{${minus(a)}}{${minus(b)}}`;
    return numberProblem({
      prompt: t(
        `For a constant $k > 1$, the solution set of $${fraction} > k$ is the interval $(${b}, ${end})$. Find $k$.`,
        `对于常数 $k > 1$，不等式 $${fraction} > k$ 的解集是区间 $(${b}, ${end})$。求 $k$。`,
      ),
      answer: k,
      form: "integer",
      wrong: [k - 1, k + 1, -k, g + k],
      solution: t(
        `The end $x = ${b}$ is the zero of the denominator, so the two sides must be equal at the other end, $x = ${end}$. There the numerator is $${g * k}$ and the denominator is $${g}$, so $k = ${k}$.`,
        `端点 $x = ${b}$ 是分母的零点，所以两边必须在另一个端点 $x = ${end}$ 处相等。这时分子是 $${g * k}$，分母是 $${g}$，所以 $k = ${k}$。`,
      ),
    });
  },
};

const gridPoints: KnowledgePointDef = {
  id: "counting-the-grid-points-in-a-region-between-two-boundaries",
  title: t("Counting the grid points in a region between two boundaries", "数出两条边界之间区域内的格点"),
  explanation: t(
    "A system of inequalities in two variables describes a region, and sometimes the useful question is how many points with whole-number coordinates it contains. The region can be cut into vertical columns, one for each whole value of $x$. In each column, the lower boundary and the upper boundary give the first and last allowed $y$, and a weak inequality includes both of them. The symmetry of the curve means that matching columns on either side hold the same count.",
    "二元不等式组描述一个区域，有时有用的问题是其中含有多少个坐标为整数的点。可以把区域切成竖列，每个整数 $x$ 对应一列。在每一列中，下边界和上边界给出最小和最大的 $y$，带等号的不等式把这两个值都包括在内。曲线的对称性说明，左右相对的两列含有相同个数的点。",
  ),
  generate(rng) {
    const c = rng.int(-5, 5);
    const m = rng.int(3, 20);
    const top = c + m;
    const widest = Math.floor(Math.sqrt(m));
    const columns = Array.from({ length: widest + 1 }, (_, x) => m - x * x + 1);
    const rest = columns.slice(1);
    const answer = columns[0]! + 2 * rest.reduce((sum, v) => sum + v, 0);
    const strict = columns.reduce((sum, v, x) => sum + (v >= 2 ? (x === 0 ? v - 2 : 2 * (v - 2)) : 0), 0);
    const half = columns.reduce((sum, v) => sum + v, 0);
    const curve = poly([1, "x^{2}"], [c, ""]);
    return numberProblem({
      prompt: t(
        `How many points with integer coordinates satisfy both $y \\ge ${curve}$ and $y \\le ${top}$?`,
        `有多少个坐标都是整数的点同时满足 $y \\ge ${curve}$ 和 $y \\le ${top}$？`,
      ),
      answer,
      form: "integer",
      wrong: [strict, half, m + 1, answer + 1],
      solution: t(
        `The boundaries meet where $x^{2} = ${m}$, so the columns run from $x = ${-widest}$ to $x = ${widest}$. A column with a given $x$ holds the integers from $${curve}$ up to $${top}$, both included. The column at $x = 0$ holds ${columns[0]} points, and columns come in matching pairs, so the total is $${columns[0]} + 2(${rest.join(" + ")}) = ${answer}$.`,
        `两条边界在 $x^{2} = ${m}$ 处相交，所以各列从 $x = ${-widest}$ 到 $x = ${widest}$。给定 $x$ 的一列含有从 $${curve}$ 到 $${top}$ 的整数，两端都包括。$x = 0$ 这一列有 ${columns[0]} 个点，其他列左右成对，所以总数是 $${columns[0]} + 2(${rest.join(" + ")}) = ${answer}$。`,
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Trigonometry
// ---------------------------------------------------------------------------

const arctanSum: KnowledgePointDef = {
  id: "the-tangent-of-a-sum-of-two-inverse-tangents",
  title: t("The tangent of a sum of two inverse tangents", "两个反正切之和的正切"),
  explanation: t(
    "An inverse tangent is an angle whose tangent is known, even when the angle itself has no pleasant value. So a sum of two inverse tangents can be treated like a sum of any two angles. Applying the tangent sum formula removes the inverse functions, because the tangent of each angle is simply the number inside. No calculator and no reference triangle are needed, and the answer comes out as an exact fraction.",
    "反正切是正切已知的角，即使这个角本身没有简单的值。所以两个反正切的和可以像任意两个角的和一样处理。应用正切的和角公式就能消去反函数，因为每个角的正切就是括号里的那个数。不需要计算器，也不需要参考三角形，结果是一个精确的分数。",
  ),
  generate(rng) {
    const a = rng.int(2, 7);
    const b = rng.sign() * rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== a));
    const answer = Q.of(a + b, 1 - a * b);
    return numberProblem({
      prompt: t(
        `Find the exact value of $\\tan(\\arctan ${a} + \\arctan ${inParens(b)})$.`,
        `求 $\\tan(\\arctan ${a} + \\arctan ${inParens(b)})$ 的精确值。`,
      ),
      answer,
      wrong: [a + b, Q.of(a + b, 1 + a * b), a * b, Q.of(a - b, 1 + a * b)],
      solution: t(
        `Let the two angles be $A$ and $B$, so $\\tan A = ${a}$ and $\\tan B = ${b}$. The sum formula gives $\\frac{${a} + ${inParens(b)}}{1 - ${a} \\cdot ${inParens(b)}} = ${answer.toLatex()}$.`,
        `设这两个角为 $A$、$B$，则 $\\tan A = ${a}$，$\\tan B = ${b}$。和角公式给出 $\\frac{${a} + ${inParens(b)}}{1 - ${a} \\cdot ${inParens(b)}} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const productFromSum: KnowledgePointDef = {
  id: "the-product-of-sine-and-cosine-from-their-sum",
  title: t("The product of sine and cosine from their sum", "由正弦与余弦的和求它们的积"),
  explanation: t(
    "The Pythagorean identity can recover information that seems to be missing. Squaring a sum of sine and cosine produces their two squares and twice their product. The two squares add up to one, whatever the angle is, so the square of the sum tells us the product at once. The angle itself is never found and never needed, which is why this works even when the angle has no simple value.",
    "毕达哥拉斯恒等式能找回看似缺失的信息。把正弦与余弦的和平方，得到它们的两个平方以及积的两倍。不管角是多少，两个平方之和都等于一，所以和的平方立刻给出积。始终不必求出这个角，这就是角没有简单的值时这个方法仍然有效的原因。",
  ),
  generate(rng) {
    const [p0, q] = rng.pick(
      properFractions(9)
        .concat(properFractions(7).map(([p, d]) => [d + p, d] as const))
        .filter(([p, d]) => p * p < 2 * d * d),
    );
    const p = rng.sign() * p0;
    const answer = Q.of(p * p - q * q, 2 * q * q);
    const square = frac(p * p, q * q);
    return numberProblem({
      prompt: t(
        `If $\\sin x + \\cos x = ${frac(p, q)}$, find $\\sin x \\cos x$.`,
        `如果 $\\sin x + \\cos x = ${frac(p, q)}$，求 $\\sin x \\cos x$。`,
      ),
      answer,
      wrong: [Q.of(p * p + q * q, 2 * q * q), Q.of(p * p - q * q, q * q), Q.of(p * p, 2 * q * q), Q.of(p, 2 * q)],
      solution: t(
        `Square both sides: $\\sin^{2} x + 2\\sin x \\cos x + \\cos^{2} x = ${square}$. The two squares add up to one, so $1 + 2\\sin x \\cos x = ${square}$. Solving gives $\\sin x \\cos x = ${answer.toLatex()}$.`,
        `两边平方：$\\sin^{2} x + 2\\sin x \\cos x + \\cos^{2} x = ${square}$。两个平方之和是一，所以 $1 + 2\\sin x \\cos x = ${square}$。解得 $\\sin x \\cos x = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const tangentOfOtherAngle: KnowledgePointDef = {
  id: "the-tangent-of-an-angle-from-the-tangent-of-a-sum",
  title: t("The tangent of an angle from the tangent of a sum", "由和角的正切求一个角的正切"),
  explanation: t(
    "A sum formula can be used in reverse by writing the wanted angle as a difference. If the tangent of a sum and the tangent of one of the angles are known, the other angle is the sum minus the known angle, and the difference formula applies. It is tempting to subtract the two tangents directly, but tangent does not distribute over addition, so the denominator of the formula always has to be included.",
    "和角公式可以反过来用，方法是把要求的角写成差。如果已知和角的正切和其中一个角的正切，另一个角就是和角减去已知角，于是可以用差角公式。人们容易想把两个正切直接相减，但正切对加法不满足分配律，所以公式的分母一定要算上。",
  ),
  generate(rng) {
    const a = rng.int(2, 6);
    const b = rng.sign() * rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== a));
    const n = a + b;
    const d = 1 - a * b;
    const total = frac(n, d);
    return numberProblem({
      prompt: t(
        `Given that $\\tan A = ${a}$ and $\\tan(A + B) = ${total}$, find $\\tan B$.`,
        `已知 $\\tan A = ${a}$，$\\tan(A + B) = ${total}$，求 $\\tan B$。`,
      ),
      answer: b,
      form: "integer",
      wrong: [Q.of(n - a * d, d), Q.of(n - a * d, d - a * n), Q.of(n, a * d), -b],
      solution: t(
        `Write $B = (A + B) - A$ and use the difference formula: $\\tan B = \\frac{${total} - ${a}}{1 + ${a} \\cdot ${ratioInParens(n, d)}} = ${b}$.`,
        `写成 $B = (A + B) - A$，用差角公式：$\\tan B = \\frac{${total} - ${a}}{1 + ${a} \\cdot ${ratioInParens(n, d)}} = ${b}$。`,
      ),
    });
  },
};

const tanSquaredFromCos2x: KnowledgePointDef = {
  id: "the-square-of-a-tangent-from-a-cosine-of-a-double-angle",
  title: t("The square of a tangent from a cosine of a double angle", "由二倍角的余弦求正切的平方"),
  explanation: t(
    "The forms of the double angle formula for cosine can be read backwards, so each one expresses a square of a single angle through the double angle. One form gives the square of the sine and another gives the square of the cosine. Dividing these two results gives the square of the tangent. Note that the unknown quadrant does not matter, since squares do not depend on signs, which is why the double angle alone is enough.",
    "余弦二倍角公式的几种形式可以反过来读，每一种都用二倍角表示单角的平方。一种形式给出正弦的平方，另一种给出余弦的平方。把这两个结果相除就得到正切的平方。注意象限未知并不影响结果，因为平方与符号无关，这就是只知道二倍角就够了的原因。",
  ),
  generate(rng) {
    const [p, q] = rng.pick(properFractions(11));
    const a = rng.sign() * p;
    const answer = Q.of(q - a, q + a);
    const c = frac(a, q);
    return numberProblem({
      prompt: t(`If $\\cos(2x) = ${c}$, find $\\tan^{2} x$.`, `如果 $\\cos(2x) = ${c}$，求 $\\tan^{2} x$。`),
      answer,
      wrong: [Q.of(q + a, q - a), Q.of(q - a, 2 * q), Q.of(q + a, 2 * q), Q.of(a * a, q * q)],
      solution: t(
        `From $\\cos(2x) = 1 - 2\\sin^{2} x$, we get $\\sin^{2} x = ${frac(q - a, 2 * q)}$. From $\\cos(2x) = 2\\cos^{2} x - 1$, we get $\\cos^{2} x = ${frac(q + a, 2 * q)}$. Dividing gives $\\tan^{2} x = ${answer.toLatex()}$.`,
        `由 $\\cos(2x) = 1 - 2\\sin^{2} x$ 得 $\\sin^{2} x = ${frac(q - a, 2 * q)}$。由 $\\cos(2x) = 2\\cos^{2} x - 1$ 得 $\\cos^{2} x = ${frac(q + a, 2 * q)}$。相除得 $\\tan^{2} x = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const tanFromTanDouble: KnowledgePointDef = {
  id: "the-tangent-of-an-angle-from-the-tangent-of-its-double",
  title: t("The tangent of an angle from the tangent of its double", "由二倍角的正切求角的正切"),
  explanation: t(
    "Halving the tangent of a double angle does not give the tangent of the angle, because the double angle formula is not linear. Instead, the formula becomes a quadratic equation when the unknown tangent is cleared from the denominator. The quadratic has two roots with a product of negative one, one positive and one negative, and these belong to two perpendicular angles. The stated range of the angle then decides which root is the right one.",
    "把二倍角的正切减半并不能得到角的正切，因为二倍角公式不是一次的。正确的做法是清去分母中的未知正切，公式就变成一个二次方程。这个方程的两个根之积是负一，一正一负，分别属于两个互相垂直的角。题目给出的角的范围决定哪个根是正确的。",
  ),
  generate(rng) {
    const [p, q] = rng.pick(properFractions(11));
    const n = 2 * p * q;
    const d = q * q - p * p;
    const value = frac(n, d);
    return numberProblem({
      prompt: t(
        `The angle $t$ is between $0^{\\circ}$ and $45^{\\circ}$, and $\\tan(2t) = ${value}$. Find $\\tan t$.`,
        `角 $t$ 在 $0^{\\circ}$ 与 $45^{\\circ}$ 之间，且 $\\tan(2t) = ${value}$。求 $\\tan t$。`,
      ),
      answer: Q.of(p, q),
      wrong: [Q.of(-q, p), Q.of(p * q, d), Q.of(q, p), Q.of(2 * n, d)],
      solution: t(
        `Let $u = \\tan t$. The formula $\\frac{2u}{1 - u^{2}} = ${value}$ clears to a quadratic in $u$ whose roots are $${frac(p, q)}$ and $${frac(-q, p)}$. In the stated range the tangent is positive, so $\\tan t = ${frac(p, q)}$.`,
        `设 $u = \\tan t$。把 $\\frac{2u}{1 - u^{2}} = ${value}$ 去分母，得到关于 $u$ 的二次方程，它的根是 $${frac(p, q)}$ 和 $${frac(-q, p)}$。在给定范围内正切为正，所以 $\\tan t = ${frac(p, q)}$。`,
      ),
    });
  },
};

const missingCoefficient: KnowledgePointDef = {
  id: "a-missing-coefficient-from-the-amplitude",
  title: t("A missing coefficient from the amplitude", "由振幅求缺失的系数"),
  explanation: t(
    "The largest value of a sum of a sine and a cosine with the same angle is the square root of the sum of the squares of the two coefficients. Since this is an equation connecting three numbers, knowing the largest value and one coefficient determines the other, up to its sign. The formula has the shape of the Pythagorean theorem, with the amplitude as the hypotenuse, so the amplitude is not simply the sum of the coefficients.",
    "同角的正弦与余弦之和，其最大值是两个系数平方和的平方根。这是连接三个数的等式，所以知道最大值和一个系数，就能确定另一个系数（符号除外）。这个公式与勾股定理形状相同，振幅相当于斜边，所以振幅并不等于两个系数简单相加。",
  ),
  generate(rng) {
    const [x, b, R] = legsAndHypotenuse(rng, 4) as [number, number, number];
    const a = rng.sign() * x;
    const left = `${a}\\sin u + b\\cos u`;
    return numberProblem({
      prompt: t(
        `The function $f(u) = ${left}$, where $b > 0$, has largest value $${R}$. Find $b$.`,
        `函数 $f(u) = ${left}$（其中 $b > 0$）的最大值是 $${R}$。求 $b$。`,
      ),
      answer: b,
      form: "integer",
      wrong: [R - x, R + x, b * b, x],
      solution: t(
        `The largest value is $\\sqrt{${inParens(a)}^{2} + b^{2}}$, so $${x * x} + b^{2} = ${R * R}$. Then $b^{2} = ${b * b}$, and since $b$ is positive, $b = ${b}$.`,
        `最大值是 $\\sqrt{${inParens(a)}^{2} + b^{2}}$，所以 $${x * x} + b^{2} = ${R * R}$。于是 $b^{2} = ${b * b}$，而 $b$ 为正，所以 $b = ${b}$。`,
      ),
    });
  },
};

const fromKnownAngle: KnowledgePointDef = {
  id: "solutions-of-a-sine-equation-from-one-known-angle",
  title: t("Solutions of a sine equation from one known angle", "由一个已知角求正弦方程的解"),
  explanation: t(
    "Sine equations do not need a special value to be solved exactly. Once one acute angle with the right sine is known, its reflections give all the others in a full turn. The same sine appears again in the second quadrant, at the straight angle minus the known angle. The opposite sine appears in the third and fourth quadrants, at the known angle past a straight angle and at the known angle short of a full turn.",
    "解正弦方程不一定需要特殊值。只要知道一个正弦合适的锐角，由它的对称位置就能得到一周内所有其他的角。相同的正弦值在第二象限再次出现，位置是平角减去已知角。相反的正弦值出现在第三、第四象限，位置分别是平角加上已知角、周角减去已知角。",
  ),
  generate(rng) {
    const a = rng.int(1, 89);
    const kind = rng.int(0, 2);
    const answer = kind === 0 ? 180 - a : kind === 1 ? 180 + a : 360 - a;
    const given = `\\sin(${a}^{\\circ}) = c`;
    const promptEn =
      kind === 0
        ? `Given that $${given}$, the equation $\\sin(x^{\\circ}) = c$ has the solution $x = ${a}$ and one other solution in $[0, 360)$. Find it.`
        : `Given that $${given}$, the equation $\\sin(x^{\\circ}) = -c$ has two solutions in $[0, 360)$. Find the ${kind === 1 ? "smaller" : "larger"} one.`;
    const promptZh =
      kind === 0
        ? `已知 $${given}$，方程 $\\sin(x^{\\circ}) = c$ 在 $[0, 360)$ 内有解 $x = ${a}$，另外还有一个解。求这个解。`
        : `已知 $${given}$，方程 $\\sin(x^{\\circ}) = -c$ 在 $[0, 360)$ 内有两个解。求其中${kind === 1 ? "较小" : "较大"}的一个。`;
    return numberProblem({
      prompt: t(promptEn, promptZh),
      answer,
      form: "integer",
      wrong: [a, 180 - a, 180 + a, 360 - a, 90 + a],
      solution: t(
        kind === 0
          ? `Since $${a}^{\\circ}$ is acute, $c$ is positive, and sine is positive also in the second quadrant. The reflection there is $180 - ${a} = ${answer}$.`
          : `Since $${a}^{\\circ}$ is acute, $c$ is positive, so $-c$ is negative, and sine is negative in the third and fourth quadrants. The solutions are $180 + ${a} = ${180 + a}$ and $360 - ${a} = ${360 - a}$, so the answer is $${answer}$.`,
        kind === 0
          ? `$${a}^{\\circ}$ 是锐角，所以 $c$ 为正，而正弦在第二象限也为正。那里的对称角是 $180 - ${a} = ${answer}$。`
          : `$${a}^{\\circ}$ 是锐角，所以 $c$ 为正，$-c$ 为负，而正弦在第三、第四象限为负。解是 $180 + ${a} = ${180 + a}$ 和 $360 - ${a} = ${360 - a}$，所以答案是 $${answer}$。`,
      ),
    });
  },
};

const countMultipleAngle: KnowledgePointDef = {
  id: "counting-the-solutions-of-a-multiple-angle-equation",
  title: t("Counting the solutions of a multiple-angle equation", "数出倍角方程的解的个数"),
  explanation: t(
    "To count solutions of a trigonometric equation with a multiple angle, it is not necessary to list them. As the unknown runs over its interval, the multiple angle runs over a longer one, so the number of full cycles grows by that multiple. Each full cycle holds the same number of solutions: two for a value strictly between the extremes, or for zero, and one when the value is the greatest or the least the function can take.",
    "要数出倍角三角方程的解，不必把它们列出来。未知数走过它的区间时，倍角走过的区间更长，所以完整周期数按这个倍数增加。每个完整周期含有相同个数的解：当值严格位于最大值与最小值之间（包括零）时有两个，当值恰好是函数的最大值或最小值时只有一个。",
  ),
  generate(rng) {
    const fn = rng.pick(["\\sin", "\\cos"]);
    const n = rng.int(2, 9);
    const m = rng.int(1, 3);
    const [value, per] = rng.pick([
      ["\\frac{1}{2}", 2],
      ["-\\frac{1}{2}", 2],
      ["\\frac{\\sqrt{2}}{2}", 2],
      ["\\frac{\\sqrt{3}}{2}", 2],
      ["0", 2],
      ["1", 1],
      ["-1", 1],
    ] as const);
    const answer = per * n * m;
    return numberProblem({
      prompt: t(
        `How many solutions does $${fn}(${n}x^{\\circ}) = ${value}$ have for $0 \\le x < ${360 * m}$?`,
        `方程 $${fn}(${n}x^{\\circ}) = ${value}$ 在 $0 \\le x < ${360 * m}$ 内有多少个解？`,
      ),
      answer,
      form: "integer",
      wrong: [per * m, answer + 1, 2 * answer, per === 2 ? n * m : 2 * n * m],
      solution: t(
        `As $x$ runs over the interval, the angle $${n}x^{\\circ}$ runs over ${n * m} full cycles. Each cycle holds ${per === 1 ? "one solution" : "two solutions"}, so the total is ${answer}.`,
        `$x$ 走过这个区间时，角 $${n}x^{\\circ}$ 走过 ${n * m} 个完整周期。每个周期有 ${per} 个解，所以共有 ${answer} 个。`,
      ),
    });
  },
};

const rejectedRoot: KnowledgePointDef = {
  id: "a-quadratic-in-sine-or-cosine-with-a-root-that-cannot-occur",
  title: t("A quadratic in sine or cosine with a root that cannot occur", "正弦或余弦的二次方程中不可能出现的根"),
  explanation: t(
    "A quadratic in sine or cosine factors like any other quadratic, but its roots then have to pass a second test. Sine and cosine never leave the interval from negative one to one, so a root outside that interval gives no angle at all and has to be dropped without further work. Only the remaining factor produces solutions. Treating the rejected root as a mistake in the algebra would be wrong, since the equation really does factor that way.",
    "正弦或余弦的二次方程可以像其他二次方程一样分解，但它的根还要通过第二道检验。正弦和余弦永远不会离开从负一到一的区间，所以这个区间之外的根根本不对应任何角，直接舍去即可。只有剩下的因式才产生解。不要把被舍去的根当作代数上的错误，方程确实是这样分解的。",
  ),
  generate(rng) {
    const fn = rng.pick(["\\sin", "\\cos"]);
    const v = rng.sign();
    const r = signedIn(rng, 2, 8);
    const angle = `${fn}(x^{\\circ})`;
    const equation = poly([2, `${fn}^{2}(x^{\\circ})`], [-(v + 2 * r), angle], [v * r, ""]);
    const pairs: Record<string, readonly [number, number]> = {
      "\\sin,1": [30, 150],
      "\\sin,-1": [210, 330],
      "\\cos,1": [60, 300],
      "\\cos,-1": [120, 240],
    };
    const [lo, hi] = pairs[`${fn},${v}`]!;
    const [oppositeLo, oppositeHi] = pairs[`${fn},${-v}`]!;
    const larger = rng.bool();
    const answer = larger ? hi : lo;
    return numberProblem({
      prompt: t(
        `Solve $${equation} = 0$ for $x \\in [0, 360)$, and give the ${larger ? "larger" : "smaller"} solution.`,
        `在 $x \\in [0, 360)$ 内解 $${equation} = 0$，写出其中${larger ? "较大" : "较小"}的解。`,
      ),
      answer,
      form: "integer",
      wrong: [larger ? lo : hi, oppositeLo, oppositeHi, 360 - answer, answer + 180],
      solution: t(
        `The equation factors as $(2${angle} ${v > 0 ? "-" : "+"} 1)(${angle} ${r > 0 ? "-" : "+"} ${Math.abs(r)}) = 0$. The second factor would need the value $${r}$, which is out of range, so it gives no angle. The first gives the value $${frac(v, 2)}$, with solutions $${lo}$ and $${hi}$, so the answer is $${answer}$.`,
        `方程分解为 $(2${angle} ${v > 0 ? "-" : "+"} 1)(${angle} ${r > 0 ? "-" : "+"} ${Math.abs(r)}) = 0$。第二个因式要求函数值为 $${r}$，超出了范围，不对应任何角。第一个因式给出函数值 $${frac(v, 2)}$，解是 $${lo}$ 和 $${hi}$，所以答案是 $${answer}$。`,
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Vectors
// ---------------------------------------------------------------------------

const parallelPair: KnowledgePointDef = {
  id: "a-parameter-in-both-vectors-of-a-parallel-pair",
  title: t("A parameter in both vectors of a parallel pair", "一对平行向量中都含有的参数"),
  explanation: t(
    "Two vectors in the plane are parallel when one is a multiple of the other, which is the same as saying that their cross-multiplied components are equal. If the same unknown appears in both vectors, the condition becomes a quadratic with a positive and a negative root. The two roots are not interchangeable: one makes the vectors point the same way, and the other makes them point in opposite directions, so the direction decides between them.",
    "平面上两个向量平行，是指一个是另一个的倍数，也就是它们的分量交叉相乘相等。如果同一个未知数出现在两个向量中，这个条件就变成二次方程，有一正一负两个根。这两个根不能互换：一个使向量同向，另一个使向量反向，所以由方向决定取哪个。",
  ),
  generate(rng) {
    const g = rng.int(1, 5);
    const [p, q] = rng.pick([
      [1, 2],
      [1, 3],
      [2, 1],
      [3, 1],
      [2, 3],
      [3, 2],
      [1, 4],
      [4, 1],
      [3, 4],
      [4, 3],
    ] as const);
    const s = rng.sign();
    const same = rng.bool();
    const a = s * g * p * p;
    const b = s * g * q * q;
    const answer = (same ? 1 : -1) * s * g * p * q;
    return numberProblem({
      prompt: t(
        `The vectors $\\mathbf{u} = \\langle k, ${a} \\rangle$ and $\\mathbf{v} = \\langle ${b}, k \\rangle$ point in ${same ? "the same direction" : "opposite directions"}. Find $k$.`,
        `向量 $\\mathbf{u} = \\langle k, ${a} \\rangle$ 与 $\\mathbf{v} = \\langle ${b}, k \\rangle$ ${same ? "方向相同" : "方向相反"}。求 $k$。`,
      ),
      answer,
      form: "integer",
      wrong: [-answer, a * b, a + b, 2 * answer],
      solution: t(
        `Parallel vectors have proportional components, so the cross products are equal: $k \\cdot k = ${inParens(a)} \\cdot ${inParens(b)}$. This gives $k^{2} = ${a * b}$ and $k = \\pm ${Math.abs(answer)}$. Since $\\mathbf{u}$ is a multiple of $\\mathbf{v}$, they ${same ? "point the same way when that multiple is positive, so $k$ has the same sign as" : "point opposite ways when that multiple is negative, so $k$ has the opposite sign to"} $${b}$. So $k = ${answer}$.`,
        `平行向量的分量成比例，所以交叉相乘相等：$k \\cdot k = ${inParens(a)} \\cdot ${inParens(b)}$。于是 $k^{2} = ${a * b}$，$k = \\pm ${Math.abs(answer)}$。$\\mathbf{u}$ 是 $\\mathbf{v}$ 的倍数，${same ? "倍数为正时两者同向，所以 $k$ 与" : "倍数为负时两者反向，所以 $k$ 与"} $${b}$ ${same ? "同号" : "异号"}。所以 $k = ${answer}$。`,
      ),
    });
  },
};

const coefficientsOfVector: KnowledgePointDef = {
  id: "the-coefficient-of-a-vector-written-in-terms-of-two-others",
  title: t("The coefficient of a vector written in terms of two others", "用两个向量表示另一个向量时的系数"),
  explanation: t(
    "Any vector in the plane can be written as a combination of two non-parallel vectors, in exactly one way. To find the coefficients, compare components: the first components give one linear equation, and the second components give another. This turns a question about vectors into a system of two equations in two unknowns. Eliminating one coefficient finds the other, and the requirement that the vectors are not parallel is what makes the system solvable.",
    "平面上任何向量都可以唯一地写成两个不平行向量的组合。要求系数，就比较分量：第一分量给出一个一次方程，第二分量给出另一个。这样向量问题就变成了含两个未知数的方程组。消去一个系数就能求出另一个，而两个向量不平行这一要求正是方程组有解的保证。",
  ),
  generate(rng) {
    const [u1, u2, v1] = [nonzero(rng, 4), nonzero(rng, 4), nonzero(rng, 4)];
    let v2 = nonzero(rng, 4);
    while (u1 * v2 - u2 * v1 === 0) v2 = nonzero(rng, 4);
    const determinant = u1 * v2 - u2 * v1;
    const a = nonzero(rng, 5);
    const b = rng.sign() * rng.pick([1, 2, 3, 4, 5, 6].filter((v) => v !== Math.abs(a)));
    const [w1, w2] = [a * u1 + b * v1, a * u2 + b * v2];
    return numberProblem({
      prompt: t(
        `Let $\\mathbf{u} = ${vec(u1, u2)}$, $\\mathbf{v} = ${vec(v1, v2)}$ and $\\mathbf{w} = ${vec(w1, w2)}$. If $\\mathbf{w} = a\\mathbf{u} + b\\mathbf{v}$, find $a$.`,
        `设 $\\mathbf{u} = ${vec(u1, u2)}$，$\\mathbf{v} = ${vec(v1, v2)}$，$\\mathbf{w} = ${vec(w1, w2)}$。如果 $\\mathbf{w} = a\\mathbf{u} + b\\mathbf{v}$，求 $a$。`,
      ),
      answer: a,
      form: "integer",
      wrong: [b, -a, a + b, a - b],
      solution: t(
        `Comparing components gives $${poly([u1, "a"], [v1, "b"])} = ${w1}$ and $${poly([u2, "a"], [v2, "b"])} = ${w2}$. Multiply these by $${v2}$ and $${v1}$ and subtract, which removes $b$: $${poly([determinant, "a"])} = ${determinant * a}$. So $a = ${a}$.`,
        `比较分量得 $${poly([u1, "a"], [v1, "b"])} = ${w1}$ 和 $${poly([u2, "a"], [v2, "b"])} = ${w2}$。分别乘以 $${v2}$ 和 $${v1}$ 后相减，消去 $b$：$${poly([determinant, "a"])} = ${determinant * a}$。所以 $a = ${a}$。`,
      ),
    });
  },
};

const endpointFromSection: KnowledgePointDef = {
  id: "an-endpoint-from-a-point-dividing-a-segment",
  title: t("An endpoint from a point dividing a segment", "由分点求线段的端点"),
  explanation: t(
    "A ratio along a segment can be used to reach a point that is not given. Splitting the segment into equal parts according to the ratio, the vector from one known point to the other covers a known number of parts, so dividing shows the vector for one part. The missing endpoint then lies the remaining number of parts further along. This is the section formula read backwards, and no formula needs to be rearranged.",
    "线段上的比可以用来求出未给出的点。按比把线段分成相等的份，从一个已知点到另一个已知点的向量占了已知的份数，相除就得到一份对应的向量。缺失的端点就在沿同一方向再走剩余份数的地方。这是把定比分点公式反过来读，不需要变形任何公式。",
  ),
  generate(rng) {
    const [p, q] = rng.pick([
      [1, 2],
      [2, 1],
      [1, 3],
      [3, 1],
      [2, 3],
      [3, 2],
      [1, 4],
      [4, 1],
      [3, 4],
      [4, 3],
      [2, 5],
      [5, 2],
    ] as const);
    const [m1, m2] = [rng.int(-6, 6), rng.int(-6, 6)];
    const [d1, d2] = [nonzero(rng, 4), nonzero(rng, 4)];
    const [w1, w2] = [m1 + p * d1, m2 + p * d2];
    const first = rng.bool();
    const [mi, di, wi] = first ? [m1, d1, w1] : [m2, d2, w2];
    const answer = wi + q * di;
    return numberProblem({
      prompt: t(
        `Point $W$ lies on segment $MN$ with $MW : WN = ${p} : ${q}$. If $\\vec{OM} = ${vec(m1, m2)}$ and $\\vec{OW} = ${vec(w1, w2)}$, find the ${first ? "first" : "second"} component of $\\vec{ON}$.`,
        `点 $W$ 在线段 $MN$ 上，$MW : WN = ${p} : ${q}$。如果 $\\vec{OM} = ${vec(m1, m2)}$，$\\vec{OW} = ${vec(w1, w2)}$，求 $\\vec{ON}$ 的第${first ? "一" : "二"}个分量。`,
      ),
      answer,
      form: "integer",
      wrong: [2 * wi - mi, wi + di, mi + q * di, wi - q * di, wi],
      solution: t(
        `The vector $\\vec{MW} = ${vec(p * d1, p * d2)}$ covers ${p === 1 ? "one part" : `${p} parts`}, so one part is $${vec(d1, d2)}$. The point $N$ lies ${q === 1 ? "one more part" : `${q} more parts`} beyond $W$, so the component is $${wi} + ${q} \\cdot ${inParens(di)} = ${answer}$.`,
        `向量 $\\vec{MW} = ${vec(p * d1, p * d2)}$ 占 ${p} 份，所以一份是 $${vec(d1, d2)}$。点 $N$ 在 $W$ 之后再走 ${q} 份，所以这个分量是 $${wi} + ${q} \\cdot ${inParens(di)} = ${answer}$。`,
      ),
    });
  },
};

const equidistantOnAxis: KnowledgePointDef = {
  id: "the-point-on-an-axis-equidistant-from-two-points",
  title: t("The point on an axis equidistant from two points", "坐标轴上到两点距离相等的点"),
  explanation: t(
    "Asking for a point at equal distances from two others leads to an equation between two magnitudes. Square roots are unpleasant, so both sides are squared first, which is safe because distances are never negative. Although each squared distance is quadratic in the unknown, the square of the unknown appears once on each side and cancels, so the equation that remains is only linear. The midpoint of the segment is usually not the answer unless the points are placed symmetrically.",
    "要求到另外两点距离相等的点，就得到两个模相等的方程。平方根不好处理，所以先把两边平方，这是安全的，因为距离不会是负数。虽然每个距离的平方都是关于未知数的二次式，但未知数的平方在两边各出现一次，相互抵消，所以剩下的方程只是一次的。除非两点的位置对称，线段的中点通常不是答案。",
  ),
  generate(rng) {
    const [x1, y1] = [nonzero(rng, 4), nonzero(rng, 4)];
    const z1 = rng.int(-5, 5);
    const z2 = rng.pick([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].filter((v) => v !== z1));
    const s1 = x1 * x1 + y1 * y1 + z1 * z1;
    let [x2, y2] = [nonzero(rng, 4), nonzero(rng, 4)];
    while (x2 * x2 + y2 * y2 + z2 * z2 === s1) [x2, y2] = [nonzero(rng, 4), nonzero(rng, 4)];
    const s2 = x2 * x2 + y2 * y2 + z2 * z2;
    const n = s1 - s2;
    const answer = Q.of(n, 2 * (z1 - z2));
    return numberProblem({
      prompt: t(
        `The point $P(0, 0, z)$ on the $z$-axis is equidistant from $A(${x1}, ${y1}, ${z1})$ and $B(${x2}, ${y2}, ${z2})$. Find $z$.`,
        `$z$ 轴上的点 $P(0, 0, z)$ 到 $A(${x1}, ${y1}, ${z1})$ 和 $B(${x2}, ${y2}, ${z2})$ 的距离相等。求 $z$。`,
      ),
      answer,
      wrong: [Q.of(z1 + z2, 2), answer.mul(Q.of(-1)), n, answer.mul(Q.of(2)), Q.of(s1 + s2, 2 * (z1 - z2))],
      solution: t(
        `Set the squared distances equal: $${x1 * x1 + y1 * y1} + (${minus(z1, "z")})^{2} = ${x2 * x2 + y2 * y2} + (${minus(z2, "z")})^{2}$. Expanding, the $z^{2}$ terms cancel, leaving $${poly([-2 * z1, "z"], [s1, ""])} = ${poly([-2 * z2, "z"], [s2, ""])}$. Solving this linear equation gives $z = ${answer.toLatex()}$.`,
        `令距离的平方相等：$${x1 * x1 + y1 * y1} + (${minus(z1, "z")})^{2} = ${x2 * x2 + y2 * y2} + (${minus(z2, "z")})^{2}$。展开后 $z^{2}$ 项抵消，剩下 $${poly([-2 * z1, "z"], [s1, ""])} = ${poly([-2 * z2, "z"], [s2, ""])}$。解这个一次方程得 $z = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const orthogonalCombination: KnowledgePointDef = {
  id: "the-multiple-that-makes-a-combination-orthogonal",
  title: t("The multiple that makes a combination orthogonal", "使组合向量正交的倍数"),
  explanation: t(
    "The dot product distributes over addition and scalar multiples come out, so a dot product involving an unknown multiple is a linear expression in that multiple. To make a combination of two vectors orthogonal to one of them, take the dot product with that vector and set it equal to zero. One equation appears, and it involves only two numbers: the dot product of the two vectors and the dot product of the chosen vector with itself.",
    "点积对加法满足分配律，数乘也可以提出来，所以含未知倍数的点积关于这个倍数是一次的。要使两个向量的组合与其中一个向量正交，就把组合与该向量作点积并令其为零。这样得到一个方程，其中只涉及两个数：两个向量的点积，以及所选向量与自身的点积。",
  ),
  generate(rng) {
    const [u1, u2, v1, v2] = [nonzero(rng, 6), nonzero(rng, 6), nonzero(rng, 5), nonzero(rng, 5)];
    const uv0 = u1 * v1 + u2 * v2;
    const [a1, a2] = uv0 === 0 ? [u1 + (u1 > 0 ? 1 : -1), u2] : [u1, u2];
    const uv = a1 * v1 + a2 * v2;
    const vv = v1 * v1 + v2 * v2;
    const answer = Q.of(-uv, vv);
    return numberProblem({
      prompt: t(
        `Let $\\mathbf{u} = ${vec(a1, a2)}$ and $\\mathbf{v} = ${vec(v1, v2)}$. Find the number $k$ for which $\\mathbf{u} + k\\mathbf{v}$ is orthogonal to $\\mathbf{v}$.`,
        `设 $\\mathbf{u} = ${vec(a1, a2)}$，$\\mathbf{v} = ${vec(v1, v2)}$。求数 $k$，使 $\\mathbf{u} + k\\mathbf{v}$ 与 $\\mathbf{v}$ 正交。`,
      ),
      answer,
      wrong: [Q.of(uv, vv), Q.of(-vv, uv), Q.of(-uv, a1 * a1 + a2 * a2), uv, Q.of(-uv, 2 * vv), Q.of(-2 * uv, vv)],
      solution: t(
        `Orthogonality means $(\\mathbf{u} + k\\mathbf{v}) \\cdot \\mathbf{v} = 0$, which distributes to $\\mathbf{u} \\cdot \\mathbf{v} + k\\,\\mathbf{v} \\cdot \\mathbf{v} = 0$. Here $\\mathbf{u} \\cdot \\mathbf{v} = ${uv}$ and $\\mathbf{v} \\cdot \\mathbf{v} = ${vv}$, so $k = ${answer.toLatex()}$.`,
        `正交意味着 $(\\mathbf{u} + k\\mathbf{v}) \\cdot \\mathbf{v} = 0$，展开得 $\\mathbf{u} \\cdot \\mathbf{v} + k\\,\\mathbf{v} \\cdot \\mathbf{v} = 0$。这里 $\\mathbf{u} \\cdot \\mathbf{v} = ${uv}$，$\\mathbf{v} \\cdot \\mathbf{v} = ${vv}$，所以 $k = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const distanceToLine: KnowledgePointDef = {
  id: "the-distance-from-a-point-to-a-line-through-the-origin",
  title: t("The distance from a point to a line through the origin", "点到过原点的直线的距离"),
  explanation: t(
    "Projection gives a way to measure a distance without any equation of a line. The position vector of the point splits into a part along the direction of the line and a part orthogonal to it. The orthogonal part runs from the line straight to the point, so its length is the shortest distance. Since the two parts are perpendicular, the Pythagorean theorem finds that length from the magnitude of the vector and the scalar projection.",
    "投影提供了一种不用直线方程就能量出距离的方法。点的位置向量可以分解为沿直线方向的部分和与直线正交的部分。正交的部分从直线垂直地通向这个点，所以它的长度就是最短距离。由于两部分互相垂直，可以用勾股定理，由向量的模和数量投影求出这个长度。",
  ),
  generate(rng) {
    const [p0, q0, L] = legsAndHypotenuse(rng, 1) as [number, number, number];
    const [p, q] = [rng.sign() * p0, rng.sign() * q0];
    const x = nonzero(rng, 9);
    const yChoices = [-9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((y) => x * q - y * p !== 0);
    const y = rng.pick(yChoices);
    const cross = Math.abs(x * q - y * p);
    const dotValue = x * p + y * q;
    const answer = Q.of(cross, L);
    return numberProblem({
      prompt: t(
        `Find the distance from the point $P(${x}, ${y})$ to the line through the origin with direction $\\mathbf{v} = ${vec(p, q)}$.`,
        `求点 $P(${x}, ${y})$ 到过原点、方向为 $\\mathbf{v} = ${vec(p, q)}$ 的直线的距离。`,
      ),
      answer,
      wrong: [Q.of(Math.abs(dotValue), L), cross, Q.of(cross, L * L), Q.of(x * x + y * y, L)],
      solution: t(
        `The distance is the length of the part of $\\vec{OP}$ orthogonal to $\\mathbf{v}$. Here $\\|\\vec{OP}\\|^{2} = ${x * x + y * y}$, and the scalar projection onto $\\mathbf{v}$ is $${frac(dotValue, L)}$. By the Pythagorean theorem, the square of the distance is $${x * x + y * y} - \\left(${frac(dotValue, L)}\\right)^{2} = ${frac(cross * cross, L * L)}$, so the distance is $${answer.toLatex()}$.`,
        `距离就是 $\\vec{OP}$ 中与 $\\mathbf{v}$ 正交的部分的长度。这里 $\\|\\vec{OP}\\|^{2} = ${x * x + y * y}$，在 $\\mathbf{v}$ 上的数量投影是 $${frac(dotValue, L)}$。由勾股定理，距离的平方是 $${x * x + y * y} - \\left(${frac(dotValue, L)}\\right)^{2} = ${frac(cross * cross, L * L)}$，所以距离是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const crossFromDot: KnowledgePointDef = {
  id: "the-magnitude-of-a-cross-product-from-a-dot-product",
  title: t("The magnitude of a cross product from a dot product", "由点积求叉积的模"),
  explanation: t(
    "The cross product and the dot product of two vectors are tied together by the angle between them: one involves the sine and the other involves the cosine. Squaring and adding removes the angle, because the squares of sine and cosine add up to one. The result says that the square of the cross product's magnitude and the square of the dot product add up to the product of the squared magnitudes, so no components are needed.",
    "两个向量的叉积和点积通过它们的夹角联系在一起：一个含正弦，另一个含余弦。平方后相加可以消去角，因为正弦与余弦的平方和是一。结果说明，叉积的模的平方加上点积的平方，等于两个向量模的平方之积，所以不需要任何分量。",
  ),
  generate(rng) {
    const a = rng.int(2, 9);
    const b = rng.int(2, 9);
    const d = rng.sign() * rng.int(1, a * b - 1);
    const answer = a * a * b * b - d * d;
    return numberProblem({
      prompt: t(
        `Vectors have $\\|\\mathbf{u}\\| = ${a}$, $\\|\\mathbf{v}\\| = ${b}$ and $\\mathbf{u} \\cdot \\mathbf{v} = ${d}$. Find $\\|\\mathbf{u} \\times \\mathbf{v}\\|^{2}$.`,
        `向量满足 $\\|\\mathbf{u}\\| = ${a}$，$\\|\\mathbf{v}\\| = ${b}$，$\\mathbf{u} \\cdot \\mathbf{v} = ${d}$。求 $\\|\\mathbf{u} \\times \\mathbf{v}\\|^{2}$。`,
      ),
      answer,
      form: "integer",
      wrong: [a * a * b * b + d * d, a * b - Math.abs(d), a * a * b * b - Math.abs(d), (a * b - Math.abs(d)) ** 2],
      solution: t(
        `Since $\\|\\mathbf{u} \\times \\mathbf{v}\\| = \\|\\mathbf{u}\\|\\|\\mathbf{v}\\|\\sin\\theta$ and $\\mathbf{u} \\cdot \\mathbf{v} = \\|\\mathbf{u}\\|\\|\\mathbf{v}\\|\\cos\\theta$, their squares add up to $\\|\\mathbf{u}\\|^{2}\\|\\mathbf{v}\\|^{2}$. So the answer is $${a * a} \\cdot ${b * b} - ${d * d} = ${answer}$.`,
        `因为 $\\|\\mathbf{u} \\times \\mathbf{v}\\| = \\|\\mathbf{u}\\|\\|\\mathbf{v}\\|\\sin\\theta$，$\\mathbf{u} \\cdot \\mathbf{v} = \\|\\mathbf{u}\\|\\|\\mathbf{v}\\|\\cos\\theta$，它们的平方和是 $\\|\\mathbf{u}\\|^{2}\\|\\mathbf{v}\\|^{2}$。所以答案是 $${a * a} \\cdot ${b * b} - ${d * d} = ${answer}$。`,
      ),
    });
  },
};

const coplanarParameter: KnowledgePointDef = {
  id: "the-parameter-that-makes-three-vectors-coplanar",
  title: t("The parameter that makes three vectors coplanar", "使三个向量共面的参数"),
  explanation: t(
    "Three vectors lie in one plane when one of them is a combination of the other two, which is the same as their scalar triple product being zero. If two of the vectors span a plane, the third can be tested by writing it as a combination of them. The components without the parameter fix the two coefficients, and then the component with the parameter is forced. This often takes less work than expanding a determinant in full.",
    "三个向量在同一平面内，是指其中一个是另外两个的组合，也就是它们的混合积为零。如果两个向量张成一个平面，就可以把第三个向量写成它们的组合来检验。不含参数的分量确定两个系数，于是含参数的分量也被确定了。这往往比完整展开行列式省事。",
  ),
  generate(rng) {
    const [u1, u2, v1] = [nonzero(rng, 4), nonzero(rng, 4), nonzero(rng, 4)];
    let v2 = nonzero(rng, 4);
    while (u1 * v2 - u2 * v1 === 0) v2 = nonzero(rng, 4);
    const [u3, v3] = [rng.int(-4, 4), rng.int(-4, 4)];
    const [alpha, beta] = [nonzero(rng, 3), nonzero(rng, 3)];
    const [w1, w2] = [alpha * u1 + beta * v1, alpha * u2 + beta * v2];
    const answer = alpha * u3 + beta * v3;
    return numberProblem({
      prompt: t(
        `The vectors $\\mathbf{u} = ${vec(u1, u2, u3)}$, $\\mathbf{v} = ${vec(v1, v2, v3)}$ and $\\mathbf{w} = \\langle ${w1}, ${w2}, k \\rangle$ are coplanar. Find $k$.`,
        `向量 $\\mathbf{u} = ${vec(u1, u2, u3)}$，$\\mathbf{v} = ${vec(v1, v2, v3)}$，$\\mathbf{w} = \\langle ${w1}, ${w2}, k \\rangle$ 共面。求 $k$。`,
      ),
      answer,
      form: "integer",
      wrong: [-answer, w1 + w2, alpha + beta, u3 + v3, answer + 1, answer - 1, answer + 2],
      solution: t(
        `The first two components of $\\mathbf{u}$ and $\\mathbf{v}$ are not proportional, so these vectors span a plane, and coplanarity means $\\mathbf{w} = \\alpha\\mathbf{u} + \\beta\\mathbf{v}$. The first two components give $\\alpha = ${alpha}$ and $\\beta = ${beta}$. The third then gives $k = ${alpha} \\cdot ${inParens(u3)} + ${inParens(beta)} \\cdot ${inParens(v3)} = ${answer}$.`,
        `$\\mathbf{u}$、$\\mathbf{v}$ 的前两个分量不成比例，所以它们张成一个平面，共面意味着 $\\mathbf{w} = \\alpha\\mathbf{u} + \\beta\\mathbf{v}$。前两个分量给出 $\\alpha = ${alpha}$，$\\beta = ${beta}$。于是第三个分量给出 $k = ${alpha} \\cdot ${inParens(u3)} + ${inParens(beta)} \\cdot ${inParens(v3)} = ${answer}$。`,
      ),
    });
  },
};

const volumeOfCombinations: KnowledgePointDef = {
  id: "the-volume-after-replacing-the-edges-by-combinations",
  title: t("The volume after replacing the edges by combinations", "把棱换成组合向量后的体积"),
  explanation: t(
    "A scalar triple product can be expanded term by term, and this shows how a volume changes when its edges are replaced by combinations of the old ones. Any term in which a vector appears twice vanishes, because the cross product of a vector with itself is zero. What remains is a single multiple of the original triple product. Its size is given by a small determinant of the coefficients, multiplied by any scaling of the third edge.",
    "混合积可以逐项展开，这说明了把棱换成旧棱的组合时体积如何变化。凡是一个向量出现两次的项都等于零，因为向量与自身的叉积为零。剩下的是原混合积的一个倍数。这个倍数的大小由系数组成的小行列式给出，再乘以第三条棱的数乘系数。",
  ),
  generate(rng) {
    const volume = rng.int(2, 20);
    const [a, d] = [rng.int(1, 4), rng.int(1, 4)];
    const b = nonzero(rng, 3);
    const cChoices = [-3, -2, -1, 1, 2, 3].filter((v) => a * d - b * v !== 0);
    const c = rng.pick(cChoices);
    const e = rng.int(2, 4);
    const delta = Math.abs(a * d - b * c);
    const answer = delta * e * volume;
    const [u, v, w] = ["\\mathbf{u}", "\\mathbf{v}", "\\mathbf{w}"];
    return numberProblem({
      prompt: t(
        `The parallelepiped with edges $${u}$, $${v}$ and $${w}$ has volume $${volume}$. Find the volume of the parallelepiped with edges $${poly([a, u], [b, v])}$, $${poly([c, u], [d, v])}$ and $${e}${w}$.`,
        `以 $${u}$、$${v}$、$${w}$ 为棱的平行六面体体积是 $${volume}$。求以 $${poly([a, u], [b, v])}$、$${poly([c, u], [d, v])}$、$${e}${w}$ 为棱的平行六面体的体积。`,
      ),
      answer,
      form: "integer",
      wrong: [
        a * d * e * volume,
        (a * d + Math.abs(b * c)) * e * volume,
        delta * volume,
        volume,
        a * d * Math.abs(b * c) * e * volume,
        e * volume,
        2 * answer,
      ],
      solution: t(
        `Expanding the cross product of the first two edges, the terms with $${u} \\times ${u}$ and $${v} \\times ${v}$ vanish, which leaves $${inParens(a)} \\cdot ${inParens(d)} - ${inParens(b)} \\cdot ${inParens(c)}$ times $${u} \\times ${v}$. So the volume is $${delta} \\cdot ${e} \\cdot ${volume} = ${answer}$.`,
        `展开前两条棱的叉积，含 $${u} \\times ${u}$ 和 $${v} \\times ${v}$ 的项都为零，剩下 $${u} \\times ${v}$ 的 $${inParens(a)} \\cdot ${inParens(d)} - ${inParens(b)} \\cdot ${inParens(c)}$ 倍。所以体积是 $${delta} \\cdot ${e} \\cdot ${volume} = ${answer}$。`,
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Matrices
// ---------------------------------------------------------------------------

const squareFromTrace: KnowledgePointDef = {
  id: "the-square-of-a-2x2-matrix-from-its-trace-and-determinant",
  title: t("The square of a 2×2 matrix from its trace and determinant", "用迹和行列式表示 2×2 矩阵的平方"),
  explanation: t(
    "Every 2×2 matrix satisfies a quadratic equation of its own. Its square equals the trace times the matrix, minus the determinant times the identity, as multiplying out the entries will confirm. This means a square, and then any higher power, can be reduced to a combination of the matrix and the identity. The trace is the sum of the diagonal entries, and the signs in the relation are the part people most easily get wrong.",
    "每个 2×2 矩阵都满足一个属于自己的二次方程。它的平方等于迹乘以矩阵，减去行列式乘以单位矩阵，把元素乘开就可以验证。这意味着平方以及更高次幂都能化为矩阵与单位矩阵的组合。迹是对角元素之和，而这个关系式中的符号最容易弄错。",
  ),
  generate(rng) {
    let [a, b, c, d] = [rng.int(-5, 5), nonzero(rng, 5), nonzero(rng, 5), rng.int(-5, 5)];
    while (a * d - b * c === 0) [a, b, c, d] = [rng.int(-5, 5), nonzero(rng, 5), nonzero(rng, 5), rng.int(-5, 5)];
    const trace = a + d;
    const determinant = a * d - b * c;
    const askP = rng.bool();
    const answer = askP ? trace : -determinant;
    return numberProblem({
      prompt: t(
        `For $A = ${mat([
          [a, b],
          [c, d],
        ])}$, there are numbers $p$ and $q$ with $A^{2} = pA + qI$. Find $${askP ? "p" : "q"}$.`,
        `对于 $A = ${mat([
          [a, b],
          [c, d],
        ])}$，存在数 $p$、$q$ 使 $A^{2} = pA + qI$。求 $${askP ? "p" : "q"}$。`,
      ),
      answer,
      form: "integer",
      wrong: askP
        ? [-trace, determinant, -determinant, trace + 1, trace - 1, trace + 2]
        : [determinant, trace, -trace, answer + 1, answer - 1],
      solution: t(
        `Every $2 \\times 2$ matrix satisfies $A^{2} = (\\operatorname{tr} A)A - (\\det A)I$. Here $\\operatorname{tr} A = ${trace}$ and $\\det A = ${determinant}$, so $p = ${trace}$ and $q = ${-determinant}$.`,
        `每个 $2 \\times 2$ 矩阵都满足 $A^{2} = (\\operatorname{tr} A)A - (\\det A)I$。这里 $\\operatorname{tr} A = ${trace}$，$\\det A = ${determinant}$，所以 $p = ${trace}$，$q = ${-determinant}$。`,
      ),
    });
  },
};

const triangleArea: KnowledgePointDef = {
  id: "the-area-of-a-triangle-from-its-vertices",
  title: t("The area of a triangle from its vertices", "由顶点坐标求三角形的面积"),
  explanation: t(
    "A 2×2 determinant measures the area of a parallelogram, and a triangle is half of one. To use this for a triangle placed anywhere in the plane, first form two vectors along its sides from a shared vertex, by subtracting coordinates. The determinant of these two side vectors gives the parallelogram on them, and half of its absolute value is the triangle's area. Skipping the subtraction measures a triangle with a vertex at the origin instead.",
    "2×2 行列式度量平行四边形的面积，而三角形是平行四边形的一半。要把它用于平面上任意位置的三角形，先从一个公共顶点出发，用坐标相减得到沿两条边的向量。这两个边向量的行列式给出以它们为边的平行四边形，其绝对值的一半就是三角形的面积。如果省略相减，量出的就是以原点为顶点的三角形。",
  ),
  generate(rng) {
    const [ax, ay] = [rng.int(-6, 6), rng.int(-6, 6)];
    const [u1, u2, v1] = [nonzero(rng, 6), nonzero(rng, 6), nonzero(rng, 6)];
    const v2 = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].filter((v) => u1 * v - u2 * v1 !== 0));
    const [bx, by, cx, cy] = [ax + u1, ay + u2, ax + v1, ay + v2];
    const determinant = u1 * v2 - u2 * v1;
    const area = Math.abs(determinant);
    return numberProblem({
      prompt: t(
        `Find the area of the triangle with vertices $A(${ax}, ${ay})$, $B(${bx}, ${by})$ and $C(${cx}, ${cy})$.`,
        `求顶点为 $A(${ax}, ${ay})$、$B(${bx}, ${by})$、$C(${cx}, ${cy})$ 的三角形的面积。`,
      ),
      answer: Q.of(area, 2),
      wrong: [area, Q.of(area, 4), Q.of(Math.abs(bx * cy - by * cx), 2), 2 * area],
      solution: t(
        `The side vectors from $A$ are $\\vec{AB} = ${vec(u1, u2)}$ and $\\vec{AC} = ${vec(v1, v2)}$. Their determinant is $${inParens(u1)} \\cdot ${inParens(v2)} - ${inParens(u2)} \\cdot ${inParens(v1)} = ${determinant}$. The triangle is half of the parallelogram, so its area is $${frac(area, 2)}$.`,
        `从 $A$ 出发的边向量是 $\\vec{AB} = ${vec(u1, u2)}$ 和 $\\vec{AC} = ${vec(v1, v2)}$。它们的行列式是 $${inParens(u1)} \\cdot ${inParens(v2)} - ${inParens(u2)} \\cdot ${inParens(v1)} = ${determinant}$。三角形是平行四边形的一半，所以面积是 $${frac(area, 2)}$。`,
      ),
    });
  },
};

const recoverFromInverse: KnowledgePointDef = {
  id: "recovering-a-matrix-from-its-inverse",
  title: t("Recovering a matrix from its inverse", "由逆矩阵还原矩阵"),
  explanation: t(
    "Inverting twice brings back the original matrix, so a matrix can be recovered from its inverse by the usual formula for a 2×2 inverse. Swap the diagonal entries, change the signs of the other two entries, and divide by the determinant of the matrix being inverted. The determinant here is that of the given inverse, not of the unknown matrix, and forgetting this division, or its sign, is the mistake to watch for.",
    "求两次逆就回到原矩阵，所以用通常的 2×2 求逆公式，就能由逆矩阵还原矩阵。交换对角元素，改变另外两个元素的符号，再除以被求逆矩阵的行列式。这里的行列式是已知的逆矩阵的行列式，不是未知矩阵的，要留意不要漏掉这一步除法或它的符号。",
  ),
  generate(rng) {
    const m = signedIn(rng, 2, 5);
    const n = signedIn(rng, 2, 5);
    const swap = rng.bool();
    const given = swap
      ? [
          [n, 1],
          [1 + m * n, m],
        ]
      : [
          [1 + m * n, m],
          [n, 1],
        ];
    const [p, q, r, s] = [given[0]![0]!, given[0]![1]!, given[1]![0]!, given[1]![1]!];
    const determinant = p * s - q * r;
    const inverse = [
      [s * determinant, -q * determinant],
      [-r * determinant, p * determinant],
    ];
    const positions = [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ].filter(([i, j]) => Math.abs(inverse[i!]![j!]!) >= 2);
    const [i, j] = rng.pick(positions) as [number, number];
    const answer = inverse[i]![j]!;
    return numberProblem({
      prompt: t(
        `A matrix $A$ has inverse $A^{-1} = ${mat(given)}$. Find the entry of $A$ in row ${i + 1}, column ${j + 1}.`,
        `矩阵 $A$ 的逆矩阵是 $A^{-1} = ${mat(given)}$。求 $A$ 中第 ${i + 1} 行第 ${j + 1} 列的元素。`,
      ),
      answer,
      form: "integer",
      wrong: [given[i]![j]!, -answer, inverse[j]![i]!, answer + 1, answer - 1],
      solution: t(
        `The inverse of $A^{-1}$ is $A$. The determinant of $A^{-1}$ is $${determinant}$. Swapping the diagonal entries, negating the others and dividing by the determinant gives $A = ${mat(inverse)}$, so the entry is $${answer}$.`,
        `$A^{-1}$ 的逆矩阵就是 $A$。$A^{-1}$ 的行列式是 $${determinant}$。交换对角元素，其余元素变号，再除以行列式，得 $A = ${mat(inverse)}$，所以这个元素是 $${answer}$。`,
      ),
    });
  },
};

const combinationOfRightSides: KnowledgePointDef = {
  id: "the-solution-for-a-combination-of-right-sides",
  title: t("The solution for a combination of right sides", "右端为组合时方程组的解"),
  explanation: t(
    "Once a system has been solved through an inverse matrix, the inverse does not depend on the right side, and it acts linearly. So if the solutions for two right sides are known, the solution for any combination of those right sides is the same combination of the two known solutions. This works without seeing the matrix or computing its inverse, and it explains why solving for several right sides at once takes so little extra effort.",
    "用逆矩阵解方程组时，逆矩阵与右端无关，并且作用是线性的。所以如果已知两个右端对应的解，这两个右端的任何组合对应的解，就是两个已知解的相同组合。这样做不必看到矩阵，也不必求它的逆，这也说明了为什么同时解多个右端几乎不需要额外的工作。",
  ),
  generate(rng) {
    const [x1, x2, y1, y2] = [rng.int(-6, 6), rng.int(-6, 6), rng.int(-6, 6), rng.int(-6, 6)];
    const a = signedIn(rng, 1, 5);
    const b = signedIn(rng, 1, 5);
    const first = rng.bool();
    const [xi, yi, xj, yj] = first ? [x1, y1, x2, y2] : [x2, y2, x1, y1];
    const answer = a * xi + b * yi;
    const combination = poly([a, "\\mathbf{p}"], [b, "\\mathbf{q}"]);
    return numberProblem({
      prompt: t(
        `For an invertible matrix $A$, the system $A\\mathbf{x} = \\mathbf{p}$ has the solution $${vec(x1, x2)}$, and $A\\mathbf{x} = \\mathbf{q}$ has the solution $${vec(y1, y2)}$. Find the ${first ? "first" : "second"} component of the solution of $A\\mathbf{x} = ${combination}$.`,
        `对于可逆矩阵 $A$，方程组 $A\\mathbf{x} = \\mathbf{p}$ 的解是 $${vec(x1, x2)}$，$A\\mathbf{x} = \\mathbf{q}$ 的解是 $${vec(y1, y2)}$。求 $A\\mathbf{x} = ${combination}$ 的解的第${first ? "一" : "二"}个分量。`,
      ),
      answer,
      form: "integer",
      wrong: [a * xi, xi + yi, a * yi + b * xi, a * xj + b * yj, answer + 1, answer - 1, answer + 2],
      solution: t(
        `The solution is $A^{-1}(${combination})$, and the inverse distributes, so it is the same combination of the two known solutions. Taking the wanted component gives $${inParens(a)} \\cdot ${inParens(xi)} + ${inParens(b)} \\cdot ${inParens(yi)} = ${answer}$.`,
        `解是 $A^{-1}(${combination})$，逆矩阵可以分配，所以它是两个已知解的相同组合。取所求的分量得 $${inParens(a)} \\cdot ${inParens(xi)} + ${inParens(b)} \\cdot ${inParens(yi)} = ${answer}$。`,
      ),
    });
  },
};

const entryFromAreaScale: KnowledgePointDef = {
  id: "a-matrix-entry-from-an-area-scale-factor",
  title: t("A matrix entry from an area scale factor", "由面积比例求矩阵的元素"),
  explanation: t(
    "The area scale factor of a transformation is the absolute value of its determinant, so comparing an image with its original gives the determinant up to its sign. Knowing whether orientation is kept settles the sign: the determinant is positive when orientation is preserved and negative when it is reversed. The result is an equation that is linear in any single unknown entry, and an entry of the matrix can be recovered from these facts about a shape.",
    "变换的面积比例是其行列式的绝对值，所以比较像与原图，就能得到行列式（符号除外）。知道方向是否保持，符号也就确定了：方向保持时行列式为正，方向反转时为负。结果是关于任一未知元素的一次方程，于是可以由图形的这些事实还原矩阵的一个元素。",
  ),
  generate(rng) {
    const [a, b] = [nonzero(rng, 4), nonzero(rng, 4)];
    const c = rng.int(2, 5);
    const k = Math.ceil((a * b + 2) / c) + rng.int(0, 3);
    const factor = k * c - a * b;
    const area = rng.int(2, 9);
    const entries = `\\begin{pmatrix} k & ${a} \\\\ ${b} & ${c} \\end{pmatrix}`;
    return numberProblem({
      prompt: t(
        `The transformation with matrix $${entries}$ maps a region of area $${area}$ to a region of area $${area * factor}$ and preserves orientation. Find $k$.`,
        `矩阵为 $${entries}$ 的变换把面积为 $${area}$ 的区域变成面积为 $${area * factor}$ 的区域，并且保持方向。求 $k$。`,
      ),
      answer: k,
      form: "integer",
      wrong: [Q.of(a * b - factor, c), Q.of(factor, c), factor + a * b, -k, k + 1, k - 1],
      solution: t(
        `The area scale factor is $${factor}$, and preserving orientation makes the determinant positive, so the determinant is $${factor}$. This gives $${poly([c, "k"], [-a * b, ""])} = ${factor}$, so $k = ${k}$.`,
        `面积比例是 $${factor}$，保持方向说明行列式为正，所以行列式是 $${factor}$。于是 $${poly([c, "k"], [-a * b, ""])} = ${factor}$，所以 $k = ${k}$。`,
      ),
    });
  },
};

const slopeOfImageLine: KnowledgePointDef = {
  id: "the-slope-of-the-image-line-of-a-singular-transformation",
  title: t("The slope of the image line of a singular transformation", "奇异变换的像所在直线的斜率"),
  explanation: t(
    "A singular transformation squeezes the whole plane onto a line through the origin, and the matrix shows which line. Every image is a combination of the two columns, and in a singular matrix these columns are parallel, so each of them points along the image line. The slope can be read as the second entry over the first entry of a nonzero column. This line should not be confused with the line of vectors sent to the origin.",
    "奇异变换把整个平面压缩到一条过原点的直线上，矩阵能显示是哪条直线。每个像都是两列的组合，而奇异矩阵的两列互相平行，所以每一列都沿着像所在的直线。斜率就是非零列的第二个元素除以第一个元素。不要把这条直线与被映射到原点的向量所在的直线混淆。",
  ),
  generate(rng) {
    const [p, q] = [nonzero(rng, 5), nonzero(rng, 5)];
    const n = signedIn(rng, 2, 5);
    const steep = rng.bool();
    const rows = steep
      ? [
          [p, q],
          [n * p, n * q],
        ]
      : [
          [n * p, n * q],
          [p, q],
        ];
    const answer = steep ? Q.of(n) : Q.of(1, n);
    return numberProblem({
      prompt: t(
        `The singular matrix $${mat(rows)}$ maps the plane onto a line through the origin. Find the slope of that line.`,
        `奇异矩阵 $${mat(rows)}$ 把平面映射到一条过原点的直线上。求这条直线的斜率。`,
      ),
      answer,
      wrong: [steep ? Q.of(1, n) : n, answer.mul(Q.of(-1)), Q.of(-p, q), Q.of(q, p), Q.of(rows[0]![1]!, rows[1]![1]!).mul(Q.of(-1))],
      solution: t(
        `Every image is a combination of the columns, and these are parallel, so the first column gives the direction of the line. Its second entry over its first entry is $${answer.toLatex()}$.`,
        `每个像都是两列的组合，而两列互相平行，所以第一列给出直线的方向。它的第二个元素除以第一个元素是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Conics and curves
// ---------------------------------------------------------------------------

const tangentCondition: KnowledgePointDef = {
  id: "the-condition-for-a-line-to-touch-an-ellipse",
  title: t("The condition for a line to touch an ellipse", "直线与椭圆相切的条件"),
  explanation: t(
    "A slanted line meets an ellipse where a quadratic has its solutions, so the number of intersection points is decided by the discriminant. Substituting the line into the equation of the ellipse and clearing denominators gives that quadratic. If the line just touches the ellipse, the discriminant is zero, and after simplification this leaves a short relation between the intercept of the line, its slope and the two semi-axes of the ellipse.",
    "斜线与椭圆的交点对应一个二次方程的解，所以交点个数由判别式决定。把直线代入椭圆方程并去分母，就得到这个二次方程。如果直线恰好与椭圆相切，判别式为零，化简后得到直线截距、斜率与椭圆两条半轴之间的一个简短关系。",
  ),
  generate(rng) {
    const a = rng.int(2, 9);
    const b = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== a));
    const m = signedIn(rng, 2, 5);
    const answer = a * a * m * m + b * b;
    return numberProblem({
      prompt: t(
        `The line $y = ${m}x + c$ is tangent to the ellipse $\\frac{x^{2}}{${a * a}} + \\frac{y^{2}}{${b * b}} = 1$. Find $c^{2}$.`,
        `直线 $y = ${m}x + c$ 与椭圆 $\\frac{x^{2}}{${a * a}} + \\frac{y^{2}}{${b * b}} = 1$ 相切。求 $c^{2}$。`,
      ),
      answer,
      form: "integer",
      wrong: [a * a * Math.abs(m) + b * b, a * a * m * m - b * b, b * b * m * m + a * a, (a * Math.abs(m) + b) ** 2],
      solution: t(
        `Substituting the line and clearing denominators gives a quadratic in $x$. Setting its discriminant to zero simplifies to $c^{2} = a^{2}m^{2} + b^{2}$, where $a^{2} = ${a * a}$, $b^{2} = ${b * b}$ and $m = ${m}$. So $c^{2} = ${a * a} \\cdot ${m * m} + ${b * b} = ${answer}$.`,
        `代入直线并去分母，得到关于 $x$ 的二次方程。令判别式为零，化简得 $c^{2} = a^{2}m^{2} + b^{2}$，其中 $a^{2} = ${a * a}$，$b^{2} = ${b * b}$，$m = ${m}$。所以 $c^{2} = ${a * a} \\cdot ${m * m} + ${b * b} = ${answer}$。`,
      ),
    });
  },
};

const focalTriangle: KnowledgePointDef = {
  id: "the-perimeter-of-a-triangle-with-the-two-foci",
  title: t("The perimeter of a triangle with the two foci", "含两个焦点的三角形的周长"),
  explanation: t(
    "An ellipse is the set of points whose distances to the two foci have a fixed sum, equal to the length of the major axis. This definition can answer questions without coordinates. For a triangle made from the two foci and any point on the ellipse, two of its sides add up to that fixed sum, and the third side is the distance between the foci. So its perimeter is the same wherever the point sits on the ellipse.",
    "椭圆是到两个焦点距离之和为定值的点的集合，这个定值等于长轴的长。这个定义不用坐标就能回答问题。对于由两个焦点和椭圆上任意一点构成的三角形，它的两条边之和就是这个定值，第三条边是两焦点之间的距离。所以不管这个点在椭圆上的什么位置，周长都不变。",
  ),
  generate(rng) {
    const [b, c, a] = legsAndHypotenuse(rng, 3) as [number, number, number];
    const horizontal = rng.bool();
    const [under, over] = horizontal ? [a * a, b * b] : [b * b, a * a];
    const answer = 2 * a + 2 * c;
    const equation = `\\frac{x^{2}}{${under}} + \\frac{y^{2}}{${over}} = 1`;
    return numberProblem({
      prompt: t(
        `Let $F_1$ and $F_2$ be the foci of the ellipse $${equation}$, and let $P$ be a point on the ellipse that is not on the line through the foci. Find the perimeter of triangle $PF_1F_2$.`,
        `设 $F_1$、$F_2$ 是椭圆 $${equation}$ 的焦点，$P$ 是椭圆上不在焦点连线上的一点。求三角形 $PF_1F_2$ 的周长。`,
      ),
      answer,
      form: "integer",
      wrong: [2 * a, 2 * c, a + c, 4 * a, 2 * a + c],
      solution: t(
        `Here $a = ${a}$, $b = ${b}$, and $c = \\sqrt{a^{2} - b^{2}} = ${c}$. By the definition of an ellipse, $PF_1 + PF_2 = 2a = ${2 * a}$, and the foci are $2c = ${2 * c}$ apart. The perimeter is $${2 * a} + ${2 * c} = ${answer}$.`,
        `这里 $a = ${a}$，$b = ${b}$，$c = \\sqrt{a^{2} - b^{2}} = ${c}$。由椭圆的定义，$PF_1 + PF_2 = 2a = ${2 * a}$，两焦点相距 $2c = ${2 * c}$。周长是 $${2 * a} + ${2 * c} = ${answer}$。`,
      ),
    });
  },
};

const semiMinorFromEccentricity: KnowledgePointDef = {
  id: "the-semi-minor-axis-from-the-eccentricity-and-the-foci",
  title: t("The semi-minor axis from the eccentricity and the foci", "由离心率和焦点求短半轴"),
  explanation: t(
    "Eccentricity and the distance between the foci together fix the whole shape of an ellipse. Half the distance between the foci is the focal distance from the center, and dividing that by the eccentricity gives the semi-major axis. The semi-minor axis then comes from the relation between the three lengths, in which the semi-major axis acts as the hypotenuse. It is a common slip to use the full distance between the foci instead of half of it.",
    "离心率和两焦点间的距离一起确定了椭圆的整个形状。两焦点距离的一半是焦点到中心的距离，再除以离心率就得到长半轴。然后由三个长度之间的关系得到短半轴，其中长半轴相当于斜边。常见的错误是用两焦点间的全部距离，而不是它的一半。",
  ),
  generate(rng) {
    const [p, q] = rng.pick(properFractions(7));
    const m = rng.int(1, 4);
    const [a, c] = [q * m, p * m];
    const answer = a * a - c * c;
    return numberProblem({
      prompt: t(
        `The foci of an ellipse are $${2 * c}$ apart, and its eccentricity is $${frac(p, q)}$. Find the square of the length of its semi-minor axis.`,
        `一个椭圆的两个焦点相距 $${2 * c}$，离心率是 $${frac(p, q)}$。求短半轴长度的平方。`,
      ),
      answer,
      form: "integer",
      wrong: [a * a + c * c, (a - c) ** 2, 4 * a * a - 4 * c * c, a * a],
      solution: t(
        `Half the distance between the foci gives $c = ${c}$. From $e = \\frac{c}{a}$, we get $a = ${a}$. Then $b^{2} = a^{2} - c^{2} = ${a * a} - ${c * c} = ${answer}$.`,
        `两焦点距离的一半给出 $c = ${c}$。由 $e = \\frac{c}{a}$ 得 $a = ${a}$。于是 $b^{2} = a^{2} - c^{2} = ${a * a} - ${c * c} = ${answer}$。`,
      ),
    });
  },
};

const focusToDirectrix: KnowledgePointDef = {
  id: "the-distance-from-a-focus-of-an-ellipse-to-its-directrix",
  title: t("The distance from a focus of an ellipse to its directrix", "椭圆焦点到准线的距离"),
  explanation: t(
    "A focus and its directrix lie on the same side of the center along the major axis, the focus inside the ellipse and the directrix outside it. Their distances from the center are the focal distance and the square of the semi-major axis divided by the focal distance. Subtracting gives the distance between them, and this simplifies neatly to the square of the semi-minor axis divided by the focal distance. The direction of the major axis does not change it.",
    "焦点和它对应的准线沿长轴在中心的同一侧，焦点在椭圆内，准线在椭圆外。它们到中心的距离分别是焦距和长半轴的平方除以焦距。相减得到它们之间的距离，化简后恰好是短半轴的平方除以焦距。长轴的方向不影响这个结果。",
  ),
  generate(rng) {
    const [b, c, a] = legsAndHypotenuse(rng, 3) as [number, number, number];
    const horizontal = rng.bool();
    const [under, over] = horizontal ? [a * a, b * b] : [b * b, a * a];
    const answer = Q.of(b * b, c);
    const equation = `\\frac{x^{2}}{${under}} + \\frac{y^{2}}{${over}} = 1`;
    return numberProblem({
      prompt: t(
        `For the ellipse $${equation}$, find the distance from a focus to the directrix on the same side of the center.`,
        `对于椭圆 $${equation}$，求一个焦点到中心同侧准线的距离。`,
      ),
      answer,
      wrong: [Q.of(a * a, c), Q.of(a * a + c * c, c), a - c, b],
      solution: t(
        `Here $a = ${a}$ and $c = ${c}$. The focus is $${c}$ from the center and the directrix is $\\frac{a^{2}}{c} = ${frac(a * a, c)}$ from the center. The difference is $${frac(a * a, c)} - ${c} = ${answer.toLatex()}$.`,
        `这里 $a = ${a}$，$c = ${c}$。焦点到中心的距离是 $${c}$，准线到中心的距离是 $\\frac{a^{2}}{c} = ${frac(a * a, c)}$。两者之差是 $${frac(a * a, c)} - ${c} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const areaNonstandard: KnowledgePointDef = {
  id: "the-area-of-an-ellipse-from-an-equation-not-in-standard-form",
  title: t("The area of an ellipse from an equation not in standard form", "由非标准方程求椭圆的面积"),
  explanation: t(
    "The area formula uses the two semi-axes, which can be read only from the standard form, where the right side is one. An equation with coefficients on the squares and another constant on the right must therefore be divided by that constant first. Each semi-axis is then the square root of a quotient, and although those roots may look awkward, they combine in the product. So the area is often simpler than either semi-axis on its own.",
    "面积公式用到两条半轴，而半轴只能从右边等于一的标准形式读出。平方项带系数、右边是其他常数的方程，必须先除以这个常数。这时每条半轴都是一个商的平方根，虽然这些根看起来不好处理，但在乘积中会合并。所以面积往往比任何一条半轴都简单。",
  ),
  generate(rng) {
    const p = rng.int(2, 6);
    const q = rng.pick([2, 3, 4, 5, 6].filter((v) => v !== p));
    const m = rng.int(2, 36);
    const answer = Q.of(m, p * q);
    return numberProblem({
      prompt: t(
        `The area enclosed by the ellipse $${p * p}x^{2} + ${q * q}y^{2} = ${m}$ is $N\\pi$. Find $N$.`,
        `椭圆 $${p * p}x^{2} + ${q * q}y^{2} = ${m}$ 围成的面积是 $N\\pi$。求 $N$。`,
      ),
      answer,
      wrong: [m, Q.of(m, p * p * q * q), Q.of(2 * m, p * q), Q.of(m, p + q)],
      solution: t(
        `Dividing by $${m}$ gives the standard form, with $a^{2} = ${frac(m, p * p)}$ and $b^{2} = ${frac(m, q * q)}$. So $a = \\frac{\\sqrt{${m}}}{${p}}$ and $b = \\frac{\\sqrt{${m}}}{${q}}$, and the product is $ab = \\frac{${m}}{${p} \\cdot ${q}}$. So $N = ${answer.toLatex()}$.`,
        `除以 $${m}$ 得到标准形式，其中 $a^{2} = ${frac(m, p * p)}$，$b^{2} = ${frac(m, q * q)}$。所以 $a = \\frac{\\sqrt{${m}}}{${p}}$，$b = \\frac{\\sqrt{${m}}}{${q}}$，乘积 $ab = \\frac{${m}}{${p} \\cdot ${q}}$。所以 $N = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const centerFromAsymptotes: KnowledgePointDef = {
  id: "the-center-of-a-hyperbola-from-its-asymptotes",
  title: t("The center of a hyperbola from its asymptotes", "由渐近线求双曲线的中心"),
  explanation: t(
    "The two asymptotes of a hyperbola cross at its center, and this gives a way to locate the center from their equations alone. Setting the two right sides equal finds the first coordinate of the crossing point, and substituting back gives the second. Since the asymptotes have opposite slopes, adding the two equations removes the term with $x$ at once, which makes the second coordinate the average of the two intercepts.",
    "双曲线的两条渐近线相交于它的中心，这样只用它们的方程就能确定中心。令两个右边相等，求出交点的第一个坐标，再代回去得到第二个坐标。由于两条渐近线的斜率相反，把两个方程相加可以立刻消去含 $x$ 的项，所以第二个坐标是两个截距的平均值。",
  ),
  generate(rng) {
    const [h, k] = [nonzero(rng, 7), nonzero(rng, 7)];
    const m = rng.int(2, 6);
    const c1 = k - m * h;
    const c2 = k + m * h;
    const askH = rng.bool();
    const lines = `y = ${poly([m, "x"], [c1, ""])}$ and $y = ${poly([-m, "x"], [c2, ""])}`;
    const linesZh = `y = ${poly([m, "x"], [c1, ""])}$ 和 $y = ${poly([-m, "x"], [c2, ""])}`;
    return numberProblem({
      prompt: t(
        `The asymptotes of a hyperbola are $${lines}$. Find the ${askH ? "first" : "second"} coordinate of its center.`,
        `一条双曲线的渐近线是 $${linesZh}$。求它的中心的第${askH ? "一" : "二"}个坐标。`,
      ),
      answer: askH ? h : k,
      form: "integer",
      wrong: askH ? [k, -h, c2 - c1, 2 * h] : [h, -k, c1 + c2, c2 - c1],
      solution: t(
        `The center is where the asymptotes cross. Setting the right sides equal gives $${2 * m}x = ${c2 - c1}$, so $x = ${h}$. Substituting gives $y = ${k}$. So the center is $(${h}, ${k})$, and the coordinate asked for is $${askH ? h : k}$.`,
        `中心是渐近线的交点。令右边相等得 $${2 * m}x = ${c2 - c1}$，所以 $x = ${h}$。代入得 $y = ${k}$。所以中心是 $(${h}, ${k})$，所求的坐标是 $${askH ? h : k}$。`,
      ),
    });
  },
};

const secondFocalDistance: KnowledgePointDef = {
  id: "the-distance-to-the-farther-focus-of-a-hyperbola",
  title: t("The distance to the farther focus of a hyperbola", "到双曲线较远焦点的距离"),
  explanation: t(
    "A hyperbola is the set of points whose distances to the two foci differ by a fixed amount, equal to the length of the transverse axis. So a known distance to one focus gives the distance to the other, as long as we know which one is nearer. The difference is taken between the two, not added as in an ellipse. The farther distance is the nearer distance plus the transverse axis, and the point's exact position is not needed.",
    "双曲线是到两个焦点距离之差为定值的点的集合，这个定值等于实轴的长。所以只要知道哪个焦点较近，由到一个焦点的距离就能得到到另一个焦点的距离。这里取的是两者的差，而不是像椭圆那样取和。较远的距离等于较近的距离加上实轴长，不需要知道点的确切位置。",
  ),
  generate(rng) {
    const [a, b, c] = legsAndHypotenuse(rng, 3) as [number, number, number];
    const horizontal = rng.bool();
    const d = rng.int(c, c + 12);
    const answer = d + 2 * a;
    const equation = horizontal
      ? `\\frac{x^{2}}{${a * a}} - \\frac{y^{2}}{${b * b}} = 1`
      : `\\frac{y^{2}}{${a * a}} - \\frac{x^{2}}{${b * b}} = 1`;
    return numberProblem({
      prompt: t(
        `A point $P$ on the hyperbola $${equation}$ is at distance $${d}$ from its nearer focus. Find its distance from the farther focus.`,
        `双曲线 $${equation}$ 上的点 $P$ 到较近焦点的距离是 $${d}$。求它到较远焦点的距离。`,
      ),
      answer,
      form: "integer",
      wrong: [Math.abs(d - 2 * a), d + a, d + 2 * c, d + 2 * b, 2 * a],
      solution: t(
        `The distances to the foci differ by $2a$, and here $a = ${a}$, so they differ by $${2 * a}$. The farther distance is the larger one, $${d} + ${2 * a} = ${answer}$.`,
        `到两个焦点的距离相差 $2a$，这里 $a = ${a}$，所以相差 $${2 * a}$。较远的距离是较大的那个，即 $${d} + ${2 * a} = ${answer}$。`,
      ),
    });
  },
};

const eccentricityFromAsymptotes: KnowledgePointDef = {
  id: "the-eccentricity-of-a-hyperbola-from-its-asymptotes",
  title: t("The eccentricity of a hyperbola from its asymptotes", "由渐近线求双曲线的离心率"),
  explanation: t(
    "The asymptotes describe the ratio of the two semi-axes, and this ratio alone decides the eccentricity, whatever the actual size of the hyperbola. But which ratio the slope gives depends on the direction of the transverse axis. When the axis is horizontal, the slope is the conjugate over the transverse semi-axis, and when it is vertical, the slope is the transverse over the conjugate. So the same asymptotes can belong to two hyperbolas with different eccentricities.",
    "渐近线描述两条半轴的比，而只凭这个比就能决定离心率，与双曲线的实际大小无关。但斜率给出的是哪个比，取决于实轴的方向。实轴水平时，斜率是虚半轴比实半轴；实轴竖直时，斜率是实半轴比虚半轴。所以同样的渐近线可以属于离心率不同的两条双曲线。",
  ),
  generate(rng) {
    const [p0, q0] = rng.pick(properFractions(7));
    const swap = rng.bool();
    const [p, q] = swap ? [q0, p0] : [p0, q0];
    const horizontal = rng.bool();
    const sum = p * p + q * q;
    const answer = horizontal ? Q.of(sum, q * q) : Q.of(sum, p * p);
    const other = horizontal ? Q.of(sum, p * p) : Q.of(sum, q * q);
    const slope = frac(p, q);
    return numberProblem({
      prompt: t(
        `A hyperbola centered at the origin has a ${horizontal ? "horizontal" : "vertical"} transverse axis and asymptotes $y = \\pm ${slope}x$. Find the square of its eccentricity.`,
        `一条中心在原点的双曲线，实轴${horizontal ? "水平" : "竖直"}，渐近线是 $y = \\pm ${slope}x$。求离心率的平方。`,
      ),
      answer,
      wrong: [other, Q.of(q * q - p * p, q * q), Q.of(p * p, q * q), Q.of(p + q, q)],
      solution: t(
        `For a ${horizontal ? "horizontal" : "vertical"} transverse axis, the slope equals $${horizontal ? "\\frac{b}{a}" : "\\frac{a}{b}"}$, so $\\frac{b^{2}}{a^{2}} = ${horizontal ? frac(p * p, q * q) : frac(q * q, p * p)}$. Since $e^{2} = 1 + \\frac{b^{2}}{a^{2}}$, the answer is $${answer.toLatex()}$.`,
        `实轴${horizontal ? "水平" : "竖直"}时，斜率等于 $${horizontal ? "\\frac{b}{a}" : "\\frac{a}{b}"}$，所以 $\\frac{b^{2}}{a^{2}} = ${horizontal ? frac(p * p, q * q) : frac(q * q, p * p)}$。因为 $e^{2} = 1 + \\frac{b^{2}}{a^{2}}$，答案是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const hyperbolaFromDirectrix: KnowledgePointDef = {
  id: "a-hyperbola-from-a-focus-and-its-directrix",
  title: t("A hyperbola from a focus and its directrix", "由焦点和准线确定双曲线"),
  explanation: t(
    "The focus and the directrix of a hyperbola centered at the origin together determine its equation. The directrix lies at the square of the transverse semi-axis divided by the focal distance, so multiplying the two given distances from the center gives the square of the transverse semi-axis. For a hyperbola, the focal distance is the largest of the three lengths, so subtracting that square from the square of the focal distance gives the last value.",
    "中心在原点的双曲线，其焦点和准线一起确定了它的方程。准线到中心的距离是实半轴的平方除以焦距，所以把这两个到中心的已知距离相乘，就得到实半轴的平方。对于双曲线，焦距是三个长度中最大的，所以从焦距的平方中减去这个平方，就得到最后一个值。",
  ),
  generate(rng) {
    const c = rng.int(3, 14);
    const d = rng.int(1, c - 1);
    const horizontal = rng.bool();
    const aSquared = c * d;
    const answer = c * c - aSquared;
    const focus = horizontal ? `(${c}, 0)` : `(0, ${c})`;
    const line = horizontal ? `x = ${d}` : `y = ${d}`;
    const equation = horizontal ? "\\frac{x^{2}}{a^{2}} - \\frac{y^{2}}{b^{2}} = 1" : "\\frac{y^{2}}{a^{2}} - \\frac{x^{2}}{b^{2}} = 1";
    return numberProblem({
      prompt: t(
        `The hyperbola $${equation}$ has a focus at $${focus}$, and the directrix on that side is $${line}$. Find $b^{2}$.`,
        `双曲线 $${equation}$ 有一个焦点 $${focus}$，这一侧的准线是 $${line}$。求 $b^{2}$。`,
      ),
      answer,
      form: "integer",
      wrong: [aSquared, c * c + aSquared, (c - d) ** 2, c * c - d * d],
      solution: t(
        `The directrix is at distance $\\frac{a^{2}}{c}$ from the center, so $a^{2} = ${c} \\cdot ${d} = ${aSquared}$. For a hyperbola, $b^{2} = c^{2} - a^{2} = ${c * c} - ${aSquared} = ${answer}$.`,
        `准线到中心的距离是 $\\frac{a^{2}}{c}$，所以 $a^{2} = ${c} \\cdot ${d} = ${aSquared}$。对于双曲线，$b^{2} = c^{2} - a^{2} = ${c * c} - ${aSquared} = ${answer}$。`,
      ),
    });
  },
};

const tangentToParametric: KnowledgePointDef = {
  id: "the-line-that-touches-a-parametric-parabola-once",
  title: t("The line that touches a parametric parabola once", "与参数抛物线只有一个公共点的直线"),
  explanation: t(
    "Substituting the parametric equations into a line gives an equation in the parameter, and each root of that equation is one point of intersection. A quadratic equation with a single root therefore means that the line touches the curve exactly once. Setting the discriminant to zero turns this into a condition on an unknown intercept. The parameter never has to be eliminated, which saves the work of finding a Cartesian equation first.",
    "把参数方程代入直线，得到关于参数的方程，它的每个根对应一个交点。所以二次方程只有一个根，就意味着直线与曲线恰好接触一次。令判别式为零，这就成为关于未知截距的条件。始终不必消去参数，省去了先求直角坐标方程的工作。",
  ),
  generate(rng) {
    const m = rng.sign() * rng.pick([2, 4, 6, 8]);
    const c = rng.int(-6, 6);
    const h = nonzero(rng, 5);
    const answer = c - m * h - (m * m) / 4;
    const constant = c - m * h;
    return numberProblem({
      prompt: t(
        `The line $y = ${m}x + k$ meets the curve $x = ${poly([1, "t"], [h, ""])}$, $y = ${poly([1, "t^{2}"], [c, ""])}$ at exactly one point. Find $k$.`,
        `直线 $y = ${m}x + k$ 与曲线 $x = ${poly([1, "t"], [h, ""])}$，$y = ${poly([1, "t^{2}"], [c, ""])}$ 恰有一个公共点。求 $k$。`,
      ),
      answer,
      form: "integer",
      wrong: [constant + (m * m) / 4, constant - m * m, c + m * h - (m * m) / 4, c - (m * m) / 4],
      solution: t(
        `Substituting gives $${poly([1, "t^{2}"], [-m, "t"], [constant, ""])} - k = 0$. One point means the discriminant is zero: $${m * m} - 4(${poly([constant, ""], [-1, "k"])}) = 0$. So $${poly([constant, ""], [-1, "k"])} = ${(m * m) / 4}$, and $k = ${answer}$.`,
        `代入得 $${poly([1, "t^{2}"], [-m, "t"], [constant, ""])} - k = 0$。只有一个公共点说明判别式为零：$${m * m} - 4(${poly([constant, ""], [-1, "k"])}) = 0$。所以 $${poly([constant, ""], [-1, "k"])} = ${(m * m) / 4}$，$k = ${answer}$。`,
      ),
    });
  },
};

const parametricFocus: KnowledgePointDef = {
  id: "the-focus-of-a-parabola-given-parametrically",
  title: t("The focus of a parabola given parametrically", "参数方程给出的抛物线的焦点"),
  explanation: t(
    "A parabola given by parametric equations has a focus just as any other parabola does, but it cannot be read at once from the coefficients. First eliminate the parameter by squaring the equation that is linear in it, which gives the standard form in which the square of one variable is a multiple of the other. That multiple equals four times the focal distance. A negative multiple means that the parabola opens the other way, and the focus lies on the negative side.",
    "参数方程给出的抛物线同样有焦点，但不能直接从系数读出。先把关于参数为一次的方程平方，消去参数，得到一个变量的平方等于另一个变量的倍数的标准形式。这个倍数等于焦距的四倍。倍数为负时，抛物线开口朝相反方向，焦点在负的一侧。",
  ),
  generate(rng) {
    const p = nonzero(rng, 6);
    const q = rng.int(2, 9);
    const answer = Q.of(q * q, 4 * p);
    return numberProblem({
      prompt: t(
        `The parabola $x = ${poly([p, "t^{2}"])}$, $y = ${q}t$ has its focus on the $x$-axis. Find the $x$-coordinate of the focus.`,
        `抛物线 $x = ${poly([p, "t^{2}"])}$，$y = ${q}t$ 的焦点在 $x$ 轴上。求焦点的横坐标。`,
      ),
      answer,
      wrong: [Q.of(q * q, p), Q.of(q * q, 2 * p), p, Q.of(q, 4 * p)],
      solution: t(
        `Since $t = \\frac{y}{${q}}$, we get $y^{2} = ${poly([Q.of(q * q, p), "x"])}$. In the form $y^{2} = 4fx$, the focus is at $(f, 0)$, so $f = ${answer.toLatex()}$.`,
        `因为 $t = \\frac{y}{${q}}$，所以 $y^{2} = ${poly([Q.of(q * q, p), "x"])}$。在形式 $y^{2} = 4fx$ 中，焦点在 $(f, 0)$，所以 $f = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const polarThroughPoint: KnowledgePointDef = {
  id: "a-polar-circle-through-a-given-point",
  title: t("A polar circle through a given point", "经过给定点的极坐标圆"),
  explanation: t(
    "A polar equation with a sine or a cosine on the right describes a circle through the pole, and the coefficient is its diameter. To test a point given in Cartesian coordinates, multiply the equation by the radial coordinate, so that the polar terms become the square of the distance from the pole and a single Cartesian coordinate. The equation then holds for that point only if the coefficient has one particular value, which can be found by division.",
    "右边含正弦或余弦的极坐标方程表示一个经过极点的圆，系数就是它的直径。要检验用直角坐标给出的点，就把方程乘以极径，这样极坐标的各项就变成到极点距离的平方和一个直角坐标。于是对这个点来说，方程只有在系数取某个特定值时才成立，用除法就能求出。",
  ),
  generate(rng) {
    const [x, y] = [nonzero(rng, 7), nonzero(rng, 7)];
    const useSine = rng.bool();
    const s = x * x + y * y;
    const [main, other, fn, letter] = useSine ? [y, x, "\\sin", "y"] : [x, y, "\\cos", "x"];
    const answer = Q.of(s, main);
    return numberProblem({
      prompt: t(
        `The circle $r = k${fn}\\theta$ passes through the point with Cartesian coordinates $(${x}, ${y})$. Find $k$.`,
        `圆 $r = k${fn}\\theta$ 经过直角坐标为 $(${x}, ${y})$ 的点。求 $k$。`,
      ),
      answer,
      wrong: [s, Q.of(s, other), Q.of(s, 2 * main), main, answer.mul(Q.of(-1)), Q.of(main, s)],
      solution: t(
        `Multiplying by $r$ gives $r^{2} = kr${fn}\\theta$, which is $x^{2} + y^{2} = k${letter}$ in Cartesian form. Substituting the point gives $${s} = ${poly([main, "k"])}$, so $k = ${answer.toLatex()}$.`,
        `乘以 $r$ 得 $r^{2} = kr${fn}\\theta$，用直角坐标写成 $x^{2} + y^{2} = k${letter}$。代入这个点得 $${s} = ${poly([main, "k"])}$，所以 $k = ${answer.toLatex()}$。`,
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Complex numbers
// ---------------------------------------------------------------------------

/** complexOnCircle picks a complex number with integer parts and an integer modulus, as real part, imaginary part and modulus. */
const complexOnCircle = (rng: Rng) => {
  const [a, b, L] = legsAndHypotenuse(rng, 1) as [number, number, number];
  return [rng.sign() * a, rng.sign() * b, L] as const;
};

const modulusOfQuotient: KnowledgePointDef = {
  id: "the-modulus-of-a-product-and-quotient-without-multiplying",
  title: t("The modulus of a product and quotient without multiplying", "不必相乘就能求积与商的模"),
  explanation: t(
    "The modulus respects multiplication and division: the modulus of a product is the product of the moduli, and the modulus of a quotient is the quotient of the moduli. So a long expression in complex numbers does not have to be simplified before its size is measured. Find each modulus separately, then combine them as ordinary numbers. Note that this rule does not hold for sums, where the moduli cannot simply be added.",
    "模与乘除运算相容：积的模等于模的积，商的模等于模的商。所以不必先化简复数的长表达式，就能量出它的大小。分别求出每个模，再把它们当作普通的数来运算。注意这个规则对和不成立，和的模不能简单地把模相加。",
  ),
  generate(rng) {
    const [a1, b1, L1] = complexOnCircle(rng);
    const [a2, b2, L2] = complexOnCircle(rng);
    const [a3, b3, L3] = complexOnCircle(rng);
    const answer = Q.of(L1 * L2, L3);
    return numberProblem({
      prompt: t(
        `Let $z_1 = ${complex(a1, b1)}$, $z_2 = ${complex(a2, b2)}$ and $z_3 = ${complex(a3, b3)}$. Find $\\left|\\frac{z_1 z_2}{z_3}\\right|$.`,
        `设 $z_1 = ${complex(a1, b1)}$，$z_2 = ${complex(a2, b2)}$，$z_3 = ${complex(a3, b3)}$。求 $\\left|\\frac{z_1 z_2}{z_3}\\right|$。`,
      ),
      answer,
      wrong: [L1 + L2 - L3, L1 * L2 * L3, Q.of(L1, L2 * L3), L1 * L2],
      solution: t(
        `The moduli are $|z_1| = ${L1}$, $|z_2| = ${L2}$ and $|z_3| = ${L3}$. The modulus of a product and of a quotient can be taken factor by factor, so the answer is $\\frac{${L1} \\cdot ${L2}}{${L3}} = ${answer.toLatex()}$.`,
        `各模分别是 $|z_1| = ${L1}$，$|z_2| = ${L2}$，$|z_3| = ${L3}$。积与商的模可以逐个因子求，所以答案是 $\\frac{${L1} \\cdot ${L2}}{${L3}} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const farthestOnCircle: KnowledgePointDef = {
  id: "the-largest-and-smallest-modulus-on-a-circle",
  title: t("The largest and smallest modulus on a circle", "圆上模的最大值与最小值"),
  explanation: t(
    "The modulus of a complex number is its distance from the origin, so asking for the largest or smallest modulus on a circle is a question about geometry. The extreme points lie on the line through the origin and the center of the circle. The largest modulus is the distance to the center plus the radius. The smallest is the difference between these two lengths, taken in the positive order, which also covers an origin inside the circle.",
    "复数的模是它到原点的距离，所以问圆上模的最大值或最小值，其实是几何问题。取到极值的点在经过原点和圆心的直线上。最大的模是到圆心的距离加上半径。最小的模是这两个长度之差（取正值），这也包括了原点在圆内的情形。",
  ),
  generate(rng) {
    const [p, q, L] = complexOnCircle(rng);
    const r = rng.pick(Array.from({ length: 30 }, (_, i) => i + 1).filter((v) => v !== L));
    const largest = rng.bool();
    const answer = largest ? L + r : Math.abs(L - r);
    return numberProblem({
      prompt: t(
        `The complex number $z$ lies on the circle $|z - w| = ${r}$, where $w = ${complex(p, q)}$. Find the ${largest ? "largest" : "smallest"} possible value of $|z|$.`,
        `复数 $z$ 在圆 $|z - w| = ${r}$ 上，其中 $w = ${complex(p, q)}$。求 $|z|$ 的${largest ? "最大" : "最小"}可能值。`,
      ),
      answer,
      form: "integer",
      wrong: [largest ? Math.abs(L - r) : L + r, L, r, L * L + r, L + 2 * r],
      solution: t(
        `The center is $${L}$ from the origin, and the radius is $${r}$. The extreme points lie on the line through the origin and the center, so the ${largest ? "largest" : "smallest"} modulus is ${largest ? `$${L} + ${r} = ${answer}$` : `the difference of these lengths, $${answer}$`}.`,
        `圆心到原点的距离是 $${L}$，半径是 $${r}$。取到极值的点在经过原点和圆心的直线上，所以${largest ? "最大" : "最小"}的模是${largest ? `$${L} + ${r} = ${answer}$` : `这两个长度之差 $${answer}$`}。`,
      ),
    });
  },
};

const cubicWithComplexRoot: KnowledgePointDef = {
  id: "the-coefficients-of-a-cubic-with-a-complex-root",
  title: t("The coefficients of a cubic with a complex root", "含复数根的三次方程的系数"),
  explanation: t(
    "The conjugate root theorem works for polynomials of every degree with real coefficients, not only for quadratics. If a cubic with real coefficients has one non-real root, its conjugate is a root as well, and this leaves exactly one more root, which must be real. The two conjugate roots multiply out to a real quadratic factor. Multiplying that factor by the linear factor of the real root then gives every coefficient of the cubic.",
    "共轭根定理对任何次数的实系数多项式都成立，不只是二次的。如果实系数三次方程有一个非实根，它的共轭也是根，这样只剩下一个根，它必须是实数。两个共轭根相乘得到一个实系数二次因式。再把它乘以实根对应的一次因式，就得到三次式的所有系数。",
  ),
  generate(rng) {
    const p = nonzero(rng, 5);
    const q = rng.int(2, 6);
    const r = nonzero(rng, 6);
    const modulusSquared = p * p + q * q;
    const askConstant = rng.bool();
    const answer = askConstant ? -r * modulusSquared : -(2 * p + r);
    return numberProblem({
      prompt: t(
        `The cubic $x^{3} + Ax^{2} + Bx + C$ has real coefficients, and two of its roots are $${complex(p, q)}$ and $${r}$. Find ${askConstant ? "$C$" : "$A$"}.`,
        `实系数三次式 $x^{3} + Ax^{2} + Bx + C$ 的两个根是 $${complex(p, q)}$ 和 $${r}$。求 ${askConstant ? "$C$" : "$A$"}。`,
      ),
      answer,
      form: "integer",
      wrong: askConstant
        ? [r * modulusSquared, -modulusSquared, -r * (p * p - q * q), -2 * r * p]
        : [2 * p + r, -(p + r), -2 * p, r - 2 * p, answer + 1],
      solution: t(
        `The coefficients are real, so $${complex(p, -q)}$ is also a root. Together, these two roots give the factor $${poly([1, "x^{2}"], [-2 * p, "x"], [modulusSquared, ""])}$. The cubic is this factor times $(${minus(r)})$, so $A = ${-(2 * p + r)}$ and $C = ${-r * modulusSquared}$.`,
        `系数是实数，所以 $${complex(p, -q)}$ 也是根。这两个根合起来给出因式 $${poly([1, "x^{2}"], [-2 * p, "x"], [modulusSquared, ""])}$。三次式就是这个因式乘以 $(${minus(r)})$，所以 $A = ${-(2 * p + r)}$，$C = ${-r * modulusSquared}$。`,
      ),
    });
  },
};

const squareRootOfComplex: KnowledgePointDef = {
  id: "a-square-root-of-a-complex-number-by-equating-parts",
  title: t("A square root of a complex number by equating parts", "用比较实部虚部的方法求复数的平方根"),
  explanation: t(
    "Equating real and imaginary parts also works when the unknown is squared. Writing the unknown number with two real parts and expanding its square gives two equations: the difference of the squares is the real part, and twice the product is the imaginary part. These are not linear, but the modulus supplies a third fact, because the sum of the squares equals the modulus of the given number. Adding and subtracting then gives each square at once.",
    "比较实部和虚部的方法在未知数被平方时同样适用。把未知复数写成两个实数部分并展开平方，得到两个方程：平方差等于实部，积的两倍等于虚部。它们不是一次的，但模提供了第三个事实，因为平方和等于已知复数的模。两式相加、相减，就立刻得到每个平方。",
  ),
  generate(rng) {
    const x = rng.int(2, 9);
    const y = rng.sign() * rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== x));
    const a = x * x - y * y;
    const b = 2 * x * y;
    const askX = rng.bool();
    const answer = askX ? x : y;
    const sum = x * x + y * y;
    return numberProblem({
      prompt: t(
        `The complex number $z = x + yi$, with $x$ and $y$ real and $x > 0$, satisfies $z^{2} = ${complex(a, b)}$. Find $${askX ? "x" : "y"}$.`,
        `复数 $z = x + yi$（$x$、$y$ 为实数，$x > 0$）满足 $z^{2} = ${complex(a, b)}$。求 $${askX ? "x" : "y"}$。`,
      ),
      answer,
      form: "integer",
      wrong: askX ? [Math.abs(y), x * Math.abs(y), a, x + 1, 2 * x] : [-y, x, x * y, a, 2 * y],
      solution: t(
        `Equating parts gives $x^{2} - y^{2} = ${a}$ and $2xy = ${b}$. Also $x^{2} + y^{2} = |z^{2}| = ${sum}$. Adding and subtracting gives $x^{2} = ${x * x}$ and $y^{2} = ${y * y}$. Since $x > 0$, we have $x = ${x}$, and $2xy = ${b}$ then gives $y = ${y}$.`,
        `比较实部和虚部得 $x^{2} - y^{2} = ${a}$，$2xy = ${b}$。又 $x^{2} + y^{2} = |z^{2}| = ${sum}$。两式相加、相减得 $x^{2} = ${x * x}$，$y^{2} = ${y * y}$。因为 $x > 0$，所以 $x = ${x}$，再由 $2xy = ${b}$ 得 $y = ${y}$。`,
      ),
    });
  },
};

const smallestRealPower: KnowledgePointDef = {
  id: "the-smallest-power-of-a-complex-number-that-is-real",
  title: t("The smallest power of a complex number that is real", "使复数的幂成为实数的最小指数"),
  explanation: t(
    "By De Moivre's theorem, raising a number in polar form to a power multiplies its argument by that power and leaves the size as a separate factor. A complex number is real exactly when its argument is a whole multiple of a straight angle, whether positive or negative. So the smallest power that is real is the smallest multiplier that turns the argument into such a multiple. The modulus plays no part in this at all.",
    "由棣莫弗定理，极坐标形式的数乘方时，幅角乘以指数，大小则是单独的因子。复数是实数，当且仅当它的幅角是平角的整数倍，不管结果是正还是负。所以使幂为实数的最小指数，就是把幅角变成这种倍数的最小乘数。模在这里完全不起作用。",
  ),
  generate(rng) {
    const theta = 5 * rng.pick(Array.from({ length: 35 }, (_, i) => i + 1).filter((v) => v !== 18));
    const r = rng.int(2, 5);
    const answer = 180 / gcd(theta, 180);
    return numberProblem({
      prompt: t(
        `Let $z = ${r}(\\cos ${theta}^{\\circ} + i\\sin ${theta}^{\\circ})$. Find the smallest positive integer $n$ for which $z^{n}$ is a real number.`,
        `设 $z = ${r}(\\cos ${theta}^{\\circ} + i\\sin ${theta}^{\\circ})$。求使 $z^{n}$ 为实数的最小正整数 $n$。`,
      ),
      answer,
      form: "integer",
      wrong: [2 * answer, answer + 1, answer - 1, answer + 2],
      solution: t(
        `By De Moivre's theorem, $z^{n}$ has argument $${theta}n$ degrees, and it is real exactly when this is a multiple of $180$. The greatest common divisor of ${theta} and 180 is ${gcd(theta, 180)}, so the smallest such $n$ is $${answer}$.`,
        `由棣莫弗定理，$z^{n}$ 的幅角是 $${theta}n$ 度，当且仅当它是 $180$ 的倍数时 $z^{n}$ 为实数。${theta} 与 180 的最大公因数是 ${gcd(theta, 180)}，所以最小的 $n$ 是 $${answer}$。`,
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Probability
// ---------------------------------------------------------------------------

const itemsFromProbability: KnowledgePointDef = {
  id: "the-number-of-items-from-a-probability-without-replacement",
  title: t("The number of items from a probability without replacement", "由不放回的概率求物品个数"),
  explanation: t(
    "A tree diagram can also be read from the far end back to the start. When two items are drawn without replacement, the probability that both have a certain colour is a product of two fractions, whose numerators are consecutive integers. If that probability and the total are known, multiplying out shows the product of those two consecutive integers. Since such a product increases steadily with the count, there is only one value that fits.",
    "树状图也可以从末端读回开头。不放回地取两件物品时，两件都是某种颜色的概率是两个分数的积，它们的分子是相邻的整数。如果已知这个概率和总数，乘开就能得到这两个相邻整数的积。这样的积随个数稳定增大，所以只有一个值符合。",
  ),
  generate(rng) {
    const n = rng.int(6, 20);
    const red = rng.int(2, n - 1);
    const product = red * (red - 1);
    const probability = Q.of(product, n * (n - 1));
    return numberProblem({
      prompt: t(
        `A bag holds ${n} marbles, some of them red. Two marbles are taken out at random, one after the other, without replacement. The probability that both are red is $${probability.toLatex()}$. How many marbles are red?`,
        `袋子里有 ${n} 颗弹珠，其中一些是红色的。随机先后取出两颗，不放回。两颗都是红色的概率是 $${probability.toLatex()}$。有多少颗红色弹珠？`,
      ),
      answer: red,
      form: "integer",
      wrong: [red - 1, red + 1, n - red, 2 * red],
      solution: t(
        `If $r$ marbles are red, the probability is $\\frac{r}{${n}} \\cdot \\frac{r - 1}{${n - 1}}$. Multiplying by $${n} \\cdot ${n - 1}$ gives $r(r - 1) = ${product}$, and the consecutive integers with this product are ${red} and ${red - 1}. So $r = ${red}$.`,
        `如果有 $r$ 颗红色弹珠，概率是 $\\frac{r}{${n}} \\cdot \\frac{r - 1}{${n - 1}}$。乘以 $${n} \\cdot ${n - 1}$ 得 $r(r - 1) = ${product}$，积为这个数的相邻整数是 ${red} 和 ${red - 1}。所以 $r = ${red}$。`,
      ),
    });
  },
};

const smallestOverlap: KnowledgePointDef = {
  id: "the-smallest-possible-overlap-of-two-events",
  title: t("The smallest possible overlap of two events", "两个事件最小可能的重叠"),
  explanation: t(
    "Two events with large probabilities cannot avoid each other. The addition law gives the intersection as the sum of the two probabilities minus the probability of the union, and the union can never go above one. So the intersection can never go below the sum of the probabilities minus one, when that value is positive. The events need not be independent, so simply multiplying the two probabilities gives a value that holds only in a special case.",
    "概率都很大的两个事件无法彼此避开。由加法公式，交的概率等于两个概率之和减去并的概率，而并的概率绝不会超过一。所以当两个概率之和减一为正时，交的概率不可能低于这个值。这两个事件不一定独立，所以把两个概率相乘得到的值只在特殊情况下才成立。",
  ),
  generate(rng) {
    const pa = 5 * rng.int(11, 19);
    const pb = 5 * rng.int(11, 19);
    const answer = Q.of(pa + pb - 100, 100);
    const [da, db] = [dec(Q.of(pa, 100)), dec(Q.of(pb, 100))];
    return numberProblem({
      prompt: t(
        `For events $A$ and $B$, $P(A) = ${da}$ and $P(B) = ${db}$. What is the smallest possible value of $P(A \\cap B)$?`,
        `对于事件 $A$、$B$，$P(A) = ${da}$，$P(B) = ${db}$。$P(A \\cap B)$ 最小可能的值是多少？`,
      ),
      answer,
      form: "decimal",
      wrong: [Q.of(Math.min(pa, pb), 100), Q.of(pa * pb, 10000), Q.of(pa + pb, 100), Q.of(100 - Math.max(pa, pb), 100)],
      solution: t(
        `The addition law gives $P(A \\cap B) = P(A) + P(B) - P(A \\cup B)$. The intersection is smallest when the union is as large as possible, which is $1$. So the smallest value is $${da} + ${db} - 1 = ${dec(answer)}$.`,
        `由加法公式，$P(A \\cap B) = P(A) + P(B) - P(A \\cup B)$。并的概率尽可能大时，交的概率最小，并的最大值是 $1$。所以最小值是 $${da} + ${db} - 1 = ${dec(answer)}$。`,
      ),
    });
  },
};

/** deeperPrecalculusPoints gives, by topic id, the knowledge points added after a Precalculus topic's own. */
export const deeperPrecalculusPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "identifying-a-rational-function-from-a-graph-containing-holes": [constantForHole],
  "determining-unknown-parameters-in-quadratic-equations-with-real-solutions": [leadingParameter],
  "solving-polynomial-inequalities-using-the-sign-table-method": [integersInFourFactors],
  "solving-radical-inequalities": [radicalBothSides],
  "solving-inequalities-involving-logarithmic-functions": [sumOfLogs],
  "solving-inequalities-involving-geometric-sequences": [closeToLimit],
  "solving-rational-inequalities": [denominatorFromCount],
  "further-solving-of-rational-inequalities": [constantFromInterval],
  "further-solving-of-two-variable-nonlinear-inequalities": [gridPoints],
  "further-evaluating-expressions-containing-inverse-trigonometric-functions": [arctanSum],
  "alternate-forms-of-the-pythagorean-identity": [productFromSum],
  "the-sum-and-difference-formulas-for-tangent": [tangentOfOtherAngle],
  "the-double-angle-formula-for-cosine": [tanSquaredFromCos2x],
  "simplifying-expressions-using-the-double-angle-formula-for-tangent": [tanFromTanDouble],
  "writing-sums-of-trigonometric-functions-in-amplitude-phase-form": [missingCoefficient],
  "elementary-trigonometric-equations-containing-sine": [fromKnownAngle],
  "general-solutions-of-trigonometric-equations-with-transformed-functions": [countMultipleAngle],
  "quadratic-trigonometric-equations-containing-sine-or-cosine": [rejectedRoot],
  "parallel-vectors": [parallelPair],
  "linear-combinations-of-vectors-and-their-properties": [coefficientsOfVector],
  "describing-the-position-vector-of-a-point-using-known-vectors": [endpointFromSection],
  "calculating-the-magnitude-of-cartesian-vectors-in-3d": [equidistantOnAxis],
  "calculating-the-dot-product-using-components": [orthogonalCombination],
  "calculating-a-vector-projection": [distanceToLine],
  "properties-of-the-cross-product": [crossFromDot],
  "the-scalar-triple-product": [coplanarParameter],
  "volumes-of-parallelepipeds": [volumeOfCombinations],
  "powers-of-matrices": [squareFromTrace],
  "the-geometric-interpretation-of-the-2x2-determinant": [triangleArea],
  "inverses-of-2x2-matrices": [recoverFromInverse],
  "solving-2x2-systems-of-equations-using-inverse-matrices": [combinationOfRightSides],
  "area-scale-factors-of-linear-transformations": [entryFromAreaScale],
  "singular-linear-transformations-in-the-plane": [slopeOfImageLine],
  "finding-intersections-of-ellipses-and-lines": [tangentCondition],
  "foci-of-ellipses": [focalTriangle],
  "vertices-and-eccentricity-of-ellipses": [semiMinorFromEccentricity],
  "directrices-of-ellipses": [focusToDirectrix],
  "the-area-of-an-ellipse": [areaNonstandard],
  "asymptotes-of-hyperbolas-centered-at-a-general-point": [centerFromAsymptotes],
  "foci-of-hyperbolas": [secondFocalDistance],
  "eccentricity-and-vertices-of-hyperbolas": [eccentricityFromAsymptotes],
  "directrices-of-hyperbolas": [hyperbolaFromDirectrix],
  "finding-intersections-of-parametric-curves-and-lines": [tangentToParametric],
  "parametric-equations-of-parabolas": [parametricFocus],
  "polar-equations-of-circles-centered-on-the-coordinate-axes": [polarThroughPoint],
  "the-magnitude-of-a-complex-number": [modulusOfQuotient],
  "geometry-in-the-complex-plane": [farthestOnCircle],
  "the-complex-conjugate-and-the-roots-of-a-quadratic-equation": [cubicWithComplexRoot],
  "solving-equations-by-equating-real-and-imaginary-parts": [squareRootOfComplex],
  "de-moivres-theorem": [smallestRealPower],
  "tree-diagrams-for-dependent-events-applications": [itemsFromProbability],
  "applying-the-addition-law-with-event-complements": [smallestOverlap],
};
