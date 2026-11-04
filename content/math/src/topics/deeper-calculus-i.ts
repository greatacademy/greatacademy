// Further knowledge points for topics of Calculus I, each a skill the topic's own
// points leave out. See `deeperCalculusIPoints`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";

import { numberProblem } from "../problems.ts";

/** nonzero picks a nonzero integer from -r to r. */
const nonzero = (rng: Rng, r: number) => rng.pick([...Array(2 * r + 1).keys()].map((i) => i - r).filter((i) => i !== 0));
/** inParens puts a negative number in parentheses, for use inside a sum. */
const inParens = (n: number) => (n < 0 ? `(${n})` : `${n}`);
/** different picks an integer from lo to hi other than the one given. */
const different = (rng: Rng, lo: number, hi: number, other: number) =>
  rng.pick([...Array(hi - lo + 1).keys()].map((i) => i + lo).filter((i) => i !== other));

const coefficientForPiecewiseLimit: KnowledgePointDef = {
  id: "a-coefficient-that-makes-a-piecewise-limit-exist",
  title: t("A coefficient that makes a piecewise limit exist", "使分段函数极限存在的系数"),
  explanation: t(
    "A two-sided limit exists at a break point only if the one-sided limits agree. Each piece gives its one-sided limit by substitution, so setting the two equal produces an equation for the unknown coefficient. The value of the function at the break point plays no part.",
    "只有两个单侧极限相等时，分段点处的双侧极限才存在。每一段代入后给出自己的单侧极限，令二者相等就得到未知系数的方程。函数在分段点的取值与此无关。",
  ),
  generate(rng) {
    const c = rng.int(1, 5);
    const b = nonzero(rng, 9);
    const d = nonzero(rng, 9);
    const right = c * c + d;
    const answer = Q.of(right - b, c);
    const f = `\\begin{cases} ${poly([1, "ax"], [b, ""])} & x < ${c} \\\\ ${poly([1, "x^2"], [d, ""])} & x > ${c} \\end{cases}`;
    return numberProblem({
      prompt: t(
        `Let $f(x) = ${f}$. For which value of $a$ does $\\lim_{x \\to ${c}} f(x)$ exist?`,
        `设 $f(x) = ${f}$。$a$ 取何值时 $\\lim_{x \\to ${c}} f(x)$ 存在？`,
      ),
      answer,
      wrong: [Q.of(right + b, c), Q.of(right - b), Q.of(right - b, 2 * c)],
      solution: t(
        `The left limit is $${c}a + ${inParens(b)}$ and the right limit is $${c * c} + ${inParens(d)} = ${right}$. Setting them equal and solving gives $a = ${answer.toLatex()}$.`,
        `左极限是 $${c}a + ${inParens(b)}$，右极限是 $${c * c} + ${inParens(d)} = ${right}$。令二者相等并求解，得 $a = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const limitThatMustExist: KnowledgePointDef = {
  id: "a-limit-that-forces-a-factor",
  title: t("A limit that forces a factor", "迫使出现因式的极限"),
  explanation: t(
    "If the denominator of a quotient tends to zero and the limit is finite, the numerator must tend to zero too. So the point is a root of the numerator, which then has the matching linear factor. Cancelling that factor gives the limit by substitution.",
    "如果分母趋于零而极限有限，分子也必须趋于零。所以这一点是分子的根，分子含有相应的一次因式。约去这个因式后，代入就得到极限。",
  ),
  generate(rng) {
    const a = nonzero(rng, 6);
    const r = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].filter((x) => x !== a));
    const m = a * r;
    const answer = a - r;
    const k = -(a + r);
    return numberProblem({
      prompt: t(
        `The limit $\\lim_{x \\to ${a}} \\frac{${poly([1, "x^2"], [1, "kx"], [m, ""])}}{${poly([1, "x"], [-a, ""])}}$ exists for exactly one value of $k$. Find the limit.`,
        `极限 $\\lim_{x \\to ${a}} \\frac{${poly([1, "x^2"], [1, "kx"], [m, ""])}}{${poly([1, "x"], [-a, ""])}}$ 只在 $k$ 取一个值时存在。求这个极限。`,
      ),
      answer,
      form: "integer",
      wrong: [k, a + r, r - a],
      solution: t(
        `The numerator must vanish at $x = ${a}$. Its roots multiply to $${m}$, so the other root is $${r}$, and it equals $(${poly([1, "x"], [-a, ""])})(${poly([1, "x"], [-r, ""])})$. After cancelling, the limit is $${a} - ${inParens(r)} = ${answer}$.`,
        `分子在 $x = ${a}$ 处必须为零。两根之积是 $${m}$，所以另一根是 $${r}$，分子等于 $(${poly([1, "x"], [-a, ""])})(${poly([1, "x"], [-r, ""])})$。约去后，极限是 $${a} - ${inParens(r)} = ${answer}$。`,
      ),
    });
  },
};

const conjugatesTopAndBottom: KnowledgePointDef = {
  id: "conjugates-in-the-numerator-and-the-denominator",
  title: t("Conjugates in the numerator and the denominator", "分子和分母同时用共轭"),
  explanation: t(
    "When a root difference appears both above and below the line, multiply by both conjugates. Each difference of squares then produces the same factor that vanishes at the limit point, and what remains is a ratio of the two conjugates, which can be found by substitution.",
    "当分子和分母都含根式之差时，同时乘以两个共轭式。每个平方差都产生同一个在极限点为零的因式，约去后剩下两个共轭式之比，代入即可求值。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const u = rng.int(1, 6);
    const v = different(rng, 1, 6, u);
    const p = u * u - a;
    const q = v * v - a;
    const answer = Q.of(v, u);
    const expression = `\\frac{\\sqrt{${poly([1, "x"], [p, ""])}} - ${u}}{\\sqrt{${poly([1, "x"], [q, ""])}} - ${v}}`;
    return numberProblem({
      prompt: t(`Find $\\lim_{x \\to ${a}} ${expression}$.`, `求 $\\lim_{x \\to ${a}} ${expression}$。`),
      answer,
      wrong: [Q.of(u, v), Q.of(1), Q.of(v, 2 * u)],
      solution: t(
        `Multiplying by both conjugates turns the top and the bottom each into $x - ${a}$ times a conjugate, and those factors cancel. This leaves $\\frac{\\sqrt{${poly([1, "x"], [q, ""])}} + ${v}}{\\sqrt{${poly([1, "x"], [p, ""])}} + ${u}}$, which at $x = ${a}$ is $\\frac{${2 * v}}{${2 * u}} = ${answer.toLatex()}$.`,
        `同时乘以两个共轭式后，分子和分母都变成 $x - ${a}$ 乘一个共轭式，这个因式约去。剩下 $\\frac{\\sqrt{${poly([1, "x"], [q, ""])}} + ${v}}{\\sqrt{${poly([1, "x"], [p, ""])}} + ${u}}$，在 $x = ${a}$ 处等于 $\\frac{${2 * v}}{${2 * u}} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const crossingTheAsymptote: KnowledgePointDef = {
  id: "where-a-graph-crosses-its-horizontal-asymptote",
  title: t("Where a graph crosses its horizontal asymptote", "图象与水平渐近线的交点"),
  explanation: t(
    "A horizontal asymptote describes the behaviour of a function far from the origin, so the graph may cross it elsewhere. To find where, set the function equal to the asymptote's value and clear the denominator. The highest powers cancel, which leaves a lower-degree equation.",
    "水平渐近线描述的是函数远离原点时的行为，所以图象可以在别处穿过它。要找交点，令函数等于渐近线的值并去分母。最高次项相消，剩下次数更低的方程。",
  ),
  generate(rng) {
    const a = rng.int(1, 5);
    const b = nonzero(rng, 6);
    const c = nonzero(rng, 9);
    const d = rng.int(1, 9);
    const answer = Q.of(a * d - c, b);
    const f = `\\frac{${poly([a, "x^2"], [b, "x"], [c, ""])}}{${poly([1, "x^2"], [d, ""])}}`;
    return numberProblem({
      prompt: t(
        `At which value of $x$ does the graph of $f(x) = ${f}$ cross its horizontal asymptote?`,
        `$f(x) = ${f}$ 的图象在 $x$ 取何值时穿过它的水平渐近线？`,
      ),
      answer,
      wrong: [Q.of(c - a * d, b), Q.of(-c, b), Q.of(a)],
      solution: t(
        `The asymptote is $y = ${a}$. Setting $f(x) = ${a}$ and clearing the denominator cancels the $x^2$ terms and leaves $${b}x + ${inParens(c)} = ${a * d}$, so $x = ${answer.toLatex()}$.`,
        `渐近线是 $y = ${a}$。令 $f(x) = ${a}$ 并去分母，$x^2$ 项相消，剩下 $${b}x + ${inParens(c)} = ${a * d}$，所以 $x = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const quadraticInsideSine: KnowledgePointDef = {
  id: "a-quadratic-inside-the-sine",
  title: t("A quadratic inside the sine", "正弦内的二次式"),
  explanation: t(
    "To use $\\lim_{u \\to 0} \\frac{\\sin u}{u} = 1$, the denominator must match the argument of the sine. If the argument is a quadratic and the denominator only a linear factor of it, multiply and divide by the other factor. The other factor stays behind as a value found by substitution.",
    "要使用 $\\lim_{u \\to 0} \\frac{\\sin u}{u} = 1$，分母必须与正弦的自变量一致。如果自变量是二次式，而分母只是它的一个一次因式，就乘除另一个因式。另一个因式留下来，代入求值。",
  ),
  generate(rng) {
    const a = nonzero(rng, 6);
    const k = rng.int(1, 6);
    const answer = 2 * a * k;
    return numberProblem({
      prompt: t(
        `Find $\\lim_{x \\to ${a}} \\frac{\\sin(${poly([k, "x^2"], [-k * a * a, ""])})}{${poly([1, "x"], [-a, ""])}}$.`,
        `求 $\\lim_{x \\to ${a}} \\frac{\\sin(${poly([k, "x^2"], [-k * a * a, ""])})}{${poly([1, "x"], [-a, ""])}}$。`,
      ),
      answer,
      form: "integer",
      wrong: [a * k, k, 2 * a],
      solution: t(
        `Write the argument as $u = ${k}(${poly([1, "x"], [-a, ""])})(${poly([1, "x"], [a, ""])})$. Multiplying and dividing by $${k}(${poly([1, "x"], [a, ""])})$ gives $\\frac{\\sin u}{u} \\cdot ${k}(${poly([1, "x"], [a, ""])})$, which tends to $1 \\cdot ${k} \\cdot ${inParens(2 * a)} = ${answer}$.`,
        `把自变量写成 $u = ${k}(${poly([1, "x"], [-a, ""])})(${poly([1, "x"], [a, ""])})$。乘除 $${k}(${poly([1, "x"], [a, ""])})$ 得 $\\frac{\\sin u}{u} \\cdot ${k}(${poly([1, "x"], [a, ""])})$，它趋于 $1 \\cdot ${k} \\cdot ${inParens(2 * a)} = ${answer}$。`,
      ),
    });
  },
};

const ratioToAPower: KnowledgePointDef = {
  id: "a-ratio-of-linear-terms-to-a-growing-power",
  title: t("A ratio of linear terms to a growing power", "一次式之比的增长次幂"),
  explanation: t(
    "A quotient that tends to $1$, raised to a growing power, is an indeterminate form. Rewrite the quotient as one plus a small term: $\\frac{x+a}{x+b} = 1 + \\frac{a-b}{x+b}$. Then the standard limit gives $e$ raised to the product of the small term's numerator and the coefficient of the power.",
    "趋于 $1$ 的商的增长次幂是不定式。把商写成一加一个小量：$\\frac{x+a}{x+b} = 1 + \\frac{a-b}{x+b}$。再用标准极限，结果是 $e$ 的幂，指数是小量的分子与幂的系数之积。",
  ),
  generate(rng) {
    const a = nonzero(rng, 9);
    const b = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== a));
    const c = rng.int(1, 5);
    const answer = (a - b) * c;
    const expression = `\\left(\\frac{${poly([1, "x"], [a, ""])}}{${poly([1, "x"], [b, ""])}}\\right)^{${poly([c, "x"])}}`;
    return numberProblem({
      prompt: t(
        `The limit $\\lim_{x \\to \\infty} ${expression}$ equals $e^k$. Find $k$.`,
        `极限 $\\lim_{x \\to \\infty} ${expression}$ 等于 $e^k$。求 $k$。`,
      ),
      answer,
      solveFor: "k",
      wrong: [a * c, (a + b) * c, a - b],
      solution: t(
        `The quotient is $1 + \\frac{${a - b}}{${poly([1, "x"], [b, ""])}}$, and the exponent is $${poly([c, "x"])}$. So the limit is $e$ to the power $(${a - b})(${c}) = ${answer}$.`,
        `商等于 $1 + \\frac{${a - b}}{${poly([1, "x"], [b, ""])}}$，指数是 $${poly([c, "x"])}$。所以极限是 $e$ 的 $(${a - b})(${c}) = ${answer}$ 次幂。`,
      ),
    });
  },
};

const tangentThroughOutsidePoint: KnowledgePointDef = {
  id: "tangent-lines-through-a-point-off-the-curve",
  title: t("Tangent lines through a point off the curve", "过曲线外一点的切线"),
  explanation: t(
    "If the given point is not on the curve, the point of tangency is unknown. Call it $(a, a^2)$ on $y = x^2$. The tangent there is $y - a^2 = 2a(x - a)$, and requiring it to pass through the given point gives a quadratic in $a$. Each root gives one tangent line.",
    "如果给定的点不在曲线上，切点就是未知的。设 $y = x^2$ 上的切点为 $(a, a^2)$，切线是 $y - a^2 = 2a(x - a)$。要求它过给定的点，就得到关于 $a$ 的二次方程，每个根对应一条切线。",
  ),
  generate(rng) {
    const p = rng.int(-6, 6);
    const s = rng.int(1, 6);
    const q = p * p - s * s;
    const answer = 2 * (p + s);
    return numberProblem({
      prompt: t(
        `Two tangent lines to $y = x^2$ pass through the point $(${p}, ${q})$. Find the larger of their slopes.`,
        `$y = x^2$ 有两条切线过点 $(${p}, ${q})$。求它们中较大的斜率。`,
      ),
      answer,
      form: "integer",
      wrong: [2 * p, 2 * (p - s), p + s],
      solution: t(
        `A tangent at $(a, a^2)$ has slope $2a$. Passing through the point requires $${inParens(q)} - a^2 = 2a(${p} - a)$, that is, $${poly([1, "a^2"], [-2 * p, "a"], [q, ""])} = 0$. The roots are $a = ${p - s}$ and $a = ${p + s}$, so the larger slope is $${answer}$.`,
        `$(a, a^2)$ 处的切线斜率是 $2a$。过这一点要求 $${inParens(q)} - a^2 = 2a(${p} - a)$，即 $${poly([1, "a^2"], [-2 * p, "a"], [q, ""])} = 0$。两根是 $a = ${p - s}$ 和 $a = ${p + s}$，所以较大的斜率是 $${answer}$。`,
      ),
    });
  },
};

const normalMeetsAgain: KnowledgePointDef = {
  id: "where-a-normal-line-meets-the-curve-again",
  title: t("Where a normal line meets the curve again", "法线与曲线的另一交点"),
  explanation: t(
    "A normal line to a parabola usually crosses the parabola a second time. For $y = cx^2$, the line through points with $x$-values $a$ and $b$ has slope $c(a + b)$. Setting this equal to the normal's slope gives the second point directly, without solving a quadratic.",
    "抛物线的法线通常还会再次与它相交。对 $y = cx^2$，过横坐标为 $a$ 和 $b$ 的两点的直线斜率是 $c(a + b)$。令它等于法线的斜率，就能直接得到第二个交点，不必解二次方程。",
  ),
  generate(rng) {
    const a = nonzero(rng, 6);
    const c = rng.int(1, 4);
    const answer = Q.of(-a).sub(Q.of(1, 2 * c * c * a));
    const normal = Q.of(-1, 2 * c * a);
    return numberProblem({
      prompt: t(
        `The normal line to $y = ${poly([c, "x^2"])}$ at the point where $x = ${a}$ meets the curve at a second point. Find the $x$-coordinate of that point.`,
        `$y = ${poly([c, "x^2"])}$ 在 $x = ${a}$ 处的法线与曲线还有另一个交点。求该点的横坐标。`,
      ),
      answer,
      wrong: [Q.of(-a), normal, Q.of(a).add(Q.of(1, 2 * c * c * a))],
      solution: t(
        `The normal's slope is $${normal.toLatex()}$. The line through the two points has slope $${c}(${a} + b)$, so $${a} + b = ${normal.div(Q.of(c)).toLatex()}$ and $b = ${answer.toLatex()}$.`,
        `法线的斜率是 $${normal.toLatex()}$。过两点的直线斜率是 $${c}(${a} + b)$，所以 $${a} + b = ${normal.div(Q.of(c)).toLatex()}$，$b = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const productOfThree: KnowledgePointDef = {
  id: "the-product-rule-for-three-functions",
  title: t("The product rule for three functions", "三个函数的乘积法则"),
  explanation: t(
    "Grouping $fgh$ as $(fg)h$ and applying the product rule twice gives $(fgh)' = f'gh + fg'h + fgh'$. There is one term for each factor, with only that factor differentiated. The pattern extends to any number of factors.",
    "把 $fgh$ 看成 $(fg)h$，用两次乘积法则，得 $(fgh)' = f'gh + fg'h + fgh'$。每个因子对应一项，这一项中只有这个因子被求导。这个规律可以推广到任意多个因子。",
  ),
  generate(rng) {
    const c = rng.int(1, 5);
    const f = nonzero(rng, 4);
    const g = nonzero(rng, 4);
    const h = nonzero(rng, 4);
    const df = nonzero(rng, 4);
    const dg = nonzero(rng, 4);
    const dh = nonzero(rng, 4);
    const answer = df * g * h + f * dg * h + f * g * dh;
    return numberProblem({
      prompt: t(
        `At $x = ${c}$: $f = ${f}$, $g = ${g}$, $h = ${h}$, $f' = ${df}$, $g' = ${dg}$ and $h' = ${dh}$. Find the derivative of $fgh$ at $x = ${c}$.`,
        `在 $x = ${c}$ 处：$f = ${f}$，$g = ${g}$，$h = ${h}$，$f' = ${df}$，$g' = ${dg}$，$h' = ${dh}$。求 $fgh$ 在 $x = ${c}$ 处的导数。`,
      ),
      answer,
      form: "integer",
      wrong: [df * dg * dh, df * g * h, df * g * h + f * dg * h],
      solution: t(
        `$f'gh + fg'h + fgh' = ${inParens(df * g * h)} + ${inParens(f * dg * h)} + ${inParens(f * g * dh)} = ${answer}$.`,
        `$f'gh + fg'h + fgh' = ${inParens(df * g * h)} + ${inParens(f * dg * h)} + ${inParens(f * g * dh)} = ${answer}$。`,
      ),
    });
  },
};

const largestValueOfAQuotient: KnowledgePointDef = {
  id: "the-largest-value-of-a-quotient",
  title: t("The largest value of a quotient", "商的最大值"),
  explanation: t(
    "A derivative from the quotient rule is zero exactly when its numerator is zero, because the denominator of $f'$ is a square. So only the numerator needs to be solved. For a function that tends to zero at both ends, the positive critical point gives the largest value.",
    "由商法则得到的导数，分母是平方，所以导数为零当且仅当分子为零，只需解分子。对两端都趋于零的函数，正的临界点给出最大值。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const k = rng.int(1, 12);
    const answer = Q.of(a, 2 * k);
    const f = `\\frac{${poly([a, "x"])}}{${poly([1, "x^2"], [k * k, ""])}}`;
    return numberProblem({
      prompt: t(`Find the largest value of $f(x) = ${f}$.`, `求 $f(x) = ${f}$ 的最大值。`),
      answer,
      wrong: [Q.of(a, k), Q.of(k), Q.of(a, k * k)],
      solution: t(
        `The numerator of $f'(x)$ is $${a}(${poly([k * k, ""], [-1, "x^2"])})$, which vanishes at $x = \\pm ${k}$. The positive value gives $f(${k}) = \\frac{${a * k}}{${2 * k * k}} = ${answer.toLatex()}$.`,
        `$f'(x)$ 的分子是 $${a}(${poly([k * k, ""], [-1, "x^2"])})$，在 $x = \\pm ${k}$ 处为零。取正值得 $f(${k}) = \\frac{${a * k}}{${2 * k * k}} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const highDerivativeOfAProduct: KnowledgePointDef = {
  id: "a-high-derivative-of-x-times-an-exponential",
  title: t("A high derivative of $x$ times an exponential", "$x$ 与指数函数之积的高阶导数"),
  explanation: t(
    "Differentiating $xe^{ax}$ repeatedly shows a pattern: $f^{(n)}(x) = (a^n x + na^{n-1})e^{ax}$. Each new derivative multiplies by $a$ and adds another copy of the term coming from the factor $x$. At $x = 0$ only $na^{n-1}$ is left.",
    "对 $xe^{ax}$ 反复求导会出现规律：$f^{(n)}(x) = (a^n x + na^{n-1})e^{ax}$。每求一次导都乘以 $a$，再多加一份来自因子 $x$ 的项。在 $x = 0$ 处只剩 $na^{n-1}$。",
  ),
  generate(rng) {
    const a = nonzero(rng, 3);
    const n = rng.int(3, 7);
    const answer = n * a ** (n - 1);
    return numberProblem({
      prompt: t(`Let $f(x) = xe^{${poly([a, "x"])}}$. Find $f^{(${n})}(0)$.`, `设 $f(x) = xe^{${poly([a, "x"])}}$。求 $f^{(${n})}(0)$。`),
      answer,
      form: "integer",
      wrong: [a ** n, n * a ** n, a ** (n - 1)],
      solution: t(
        `By the pattern, $f^{(${n})}(x) = (${inParens(a ** n)}x + ${inParens(answer)})e^{${poly([a, "x"])}}$. At $x = 0$ this is $${n} \\cdot ${inParens(a)}^{${n - 1}} = ${answer}$.`,
        `由规律，$f^{(${n})}(x) = (${inParens(a ** n)}x + ${inParens(answer)})e^{${poly([a, "x"])}}$。在 $x = 0$ 处等于 $${n} \\cdot ${inParens(a)}^{${n - 1}} = ${answer}$。`,
      ),
    });
  },
};

const rateThatSolvesAnEquation: KnowledgePointDef = {
  id: "an-exponential-that-satisfies-an-equation-in-its-derivatives",
  title: t("An exponential that satisfies an equation in its derivatives", "满足导数方程的指数函数"),
  explanation: t(
    "By the chain rule, $y = e^{kx}$ has $y' = ky$ and $y'' = k^2y$. Substituting into an equation in $y$ and its derivatives gives a common factor $e^{kx}$, which is never zero. So the condition reduces to a quadratic equation in $k$.",
    "由链式法则，$y = e^{kx}$ 满足 $y' = ky$，$y'' = k^2y$。代入关于 $y$ 及其导数的方程，会出现公因子 $e^{kx}$，它永不为零。所以条件化为关于 $k$ 的二次方程。",
  ),
  generate(rng) {
    const r = rng.int(-6, 5);
    const s = r + rng.int(1, 7);
    const b = -(r + s);
    const c = r * s;
    const equation = poly([1, "y''"], [b, "y'"], [c, "y"]);
    return numberProblem({
      prompt: t(
        `For two values of $k$, the function $y = e^{kx}$ satisfies $${equation} = 0$. Find the larger value.`,
        `$k$ 取两个值时，函数 $y = e^{kx}$ 满足 $${equation} = 0$。求较大的值。`,
      ),
      answer: s,
      solveFor: "k",
      wrong: [r, -s, b],
      solution: t(
        `Substituting and dividing by $e^{kx}$ gives $${poly([1, "k^2"], [b, "k"], [c, ""])} = 0$, whose roots are $k = ${r}$ and $k = ${s}$. The larger is $${s}$.`,
        `代入并除以 $e^{kx}$ 得 $${poly([1, "k^2"], [b, "k"], [c, ""])} = 0$，两根是 $k = ${r}$ 和 $k = ${s}$。较大的是 $${s}$。`,
      ),
    });
  },
};

const inverseInsideAChain: KnowledgePointDef = {
  id: "an-inverse-function-inside-the-chain-rule",
  title: t("An inverse function inside the chain rule", "链式法则中的反函数"),
  explanation: t(
    "To differentiate $f^{-1}(u(x))$, apply the chain rule and the inverse rule together. The derivative of the outer function at $u$ is $\\frac{1}{f'(f^{-1}(u))}$, and this is multiplied by $u'(x)$. The value given for $f$ must be read backwards to find the point where $f'$ is needed.",
    "要求 $f^{-1}(u(x))$ 的导数，要同时用链式法则和反函数法则。外层函数在 $u$ 处的导数是 $\\frac{1}{f'(f^{-1}(u))}$，再乘以 $u'(x)$。要反过来读 $f$ 的取值，才能知道需要 $f'$ 在哪一点的值。",
  ),
  generate(rng) {
    const a = rng.int(2, 6);
    const b = rng.int(1, 9);
    const c = rng.int(1, 5);
    const d = rng.int(1, 6);
    const m = nonzero(rng, 9);
    const v = a * c + b;
    const answer = Q.of(a, m);
    return numberProblem({
      prompt: t(
        `$f$ is differentiable and one-to-one, with $f(${d}) = ${v}$ and $f'(${d}) = ${m}$. Let $h(x) = f^{-1}(${poly([a, "x"], [b, ""])})$. Find $h'(${c})$.`,
        `$f$ 可导且是一一对应，$f(${d}) = ${v}$，$f'(${d}) = ${m}$。设 $h(x) = f^{-1}(${poly([a, "x"], [b, ""])})$。求 $h'(${c})$。`,
      ),
      answer,
      wrong: [Q.of(1, m), Q.of(m, a), Q.of(a * m)],
      solution: t(
        `At $x = ${c}$ the inner value is $${v}$, and $f^{-1}(${v}) = ${d}$. The inverse rule gives a slope of $\\frac{1}{${m}}$ there, and the chain rule multiplies it by $${a}$, so $h'(${c}) = ${answer.toLatex()}$.`,
        `在 $x = ${c}$ 处，内层的值是 $${v}$，而 $f^{-1}(${v}) = ${d}$。反函数法则给出那里的斜率 $\\frac{1}{${m}}$，链式法则再乘以 $${a}$，所以 $h'(${c}) = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const troughDepth: KnowledgePointDef = {
  id: "the-rising-depth-in-a-triangular-trough",
  title: t("The rising depth in a triangular trough", "三角形水槽中上升的水深"),
  explanation: t(
    "Similar triangles relate the width of the water surface to its depth in a trough, so the volume can be written using the depth alone. Differentiating that formula with respect to time relates the inflow to the rate at which the depth rises. Substitute the current depth only after differentiating.",
    "由相似三角形可以把水面宽度用水深表示，于是体积只含水深一个变量。对时间求导，就得到流入量与水深上升速率的关系。求导之后才代入当前的水深。",
  ),
  generate(rng) {
    const L = rng.int(2, 10);
    const w = rng.int(1, 4);
    const h = rng.int(2, 6);
    const y = rng.int(1, h - 1);
    const R = rng.int(1, 12);
    const answer = Q.of(R * h, L * w * y);
    return numberProblem({
      prompt: t(
        `A trough is ${L} m long, and its cross section is an isosceles triangle, vertex down, ${w} m wide at the top and ${h} m deep. Water flows in at ${R} m³/min. How fast is the depth rising, in m/min, when the depth is ${y} m?`,
        `水槽长 ${L} m，横截面是顶点朝下的等腰三角形，顶部宽 ${w} m，深 ${h} m。水以 ${R} m³/min 的速率流入。当水深为 ${y} m 时，水深上升的速率是多少 m/min？`,
      ),
      answer,
      wrong: [Q.of(R * h, 2 * L * w * y), Q.of(R, L * w), Q.of(R * h, L * w)],
      solution: t(
        `At depth $y$ the surface is $\\frac{${w}}{${h}}y$ wide, so $V = \\frac{1}{2} \\cdot \\frac{${w}}{${h}}y \\cdot y \\cdot ${L} = \\frac{${L * w}}{${2 * h}}y^2$. Differentiating gives $\\frac{dV}{dt} = \\frac{${L * w}}{${h}}y\\frac{dy}{dt}$. With $y = ${y}$ and $\\frac{dV}{dt} = ${R}$, $\\frac{dy}{dt} = ${answer.toLatex()}$.`,
        `水深为 $y$ 时水面宽 $\\frac{${w}}{${h}}y$，所以 $V = \\frac{1}{2} \\cdot \\frac{${w}}{${h}}y \\cdot y \\cdot ${L} = \\frac{${L * w}}{${2 * h}}y^2$。求导得 $\\frac{dV}{dt} = \\frac{${L * w}}{${h}}y\\frac{dy}{dt}$。代入 $y = ${y}$ 和 $\\frac{dV}{dt} = ${R}$，得 $\\frac{dy}{dt} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const coneWithALeak: KnowledgePointDef = {
  id: "a-conical-tank-with-a-leak",
  title: t("A conical tank with a leak", "有渗漏的圆锥形水箱"),
  explanation: t(
    "When water flows in and out at once, $\\frac{dV}{dt}$ is the inflow minus the outflow. The geometry of the cone gives $\\frac{dV}{dt}$ from the depth and its rate, because the surface radius is a fixed fraction of the depth. So the inflow is this net rate plus the leak.",
    "水同时流入和流出时，$\\frac{dV}{dt}$ 等于流入量减流出量。由于水面半径是水深的固定比例，圆锥的几何关系可以由水深及其变化率给出 $\\frac{dV}{dt}$。所以流入量等于这个净速率加上渗漏量。",
  ),
  generate(rng) {
    const R = rng.int(1, 5);
    const H = rng.int(3, 10);
    const y = rng.int(1, H - 1);
    const leak = rng.int(1, 9);
    const rate = Q.of(1, rng.pick([2, 3, 4, 5]));
    const net = Q.of(R * R * y * y, H * H).mul(rate);
    const answer = net.add(Q.of(leak));
    return numberProblem({
      prompt: t(
        `A conical tank, vertex down, has top radius ${R} m and height ${H} m. Water leaks out at $${leak}\\pi$ m³/min while being pumped in. At depth ${y} m, the depth is rising at $${rate.toLatex()}$ m/min. The inflow is $c\\pi$ m³/min. Find $c$.`,
        `圆锥形水箱顶点朝下，顶部半径 ${R} m，高 ${H} m。水以 $${leak}\\pi$ m³/min 的速率渗漏，同时被泵入。水深 ${y} m 时，水深正以 $${rate.toLatex()}$ m/min 的速率上升。流入量是 $c\\pi$ m³/min。求 $c$。`,
      ),
      answer,
      wrong: [net, net.sub(Q.of(leak)), Q.of(leak).sub(net)],
      solution: t(
        `The surface radius at depth $y$ is $\\frac{${R}}{${H}}y$, so $\\frac{dV}{dt} = \\pi\\left(\\frac{${R}}{${H}}\\right)^2y^2\\frac{dy}{dt} = ${net.toLatex()}\\pi$. The inflow is this plus the leak, so $c = ${net.toLatex()} + ${leak} = ${answer.toLatex()}$.`,
        `水深为 $y$ 时水面半径是 $\\frac{${R}}{${H}}y$，所以 $\\frac{dV}{dt} = \\pi\\left(\\frac{${R}}{${H}}\\right)^2y^2\\frac{dy}{dt} = ${net.toLatex()}\\pi$。流入量等于它加上渗漏量，所以 $c = ${net.toLatex()} + ${leak} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const boxDiagonal: KnowledgePointDef = {
  id: "the-rate-of-the-diagonal-of-a-box",
  title: t("The rate of the diagonal of a box", "长方体对角线的变化率"),
  explanation: t(
    "The diagonal of a box satisfies $\\ell^2 = a^2 + b^2 + c^2$. Differentiating with respect to time and cancelling the factor of two gives $\\ell\\frac{d\\ell}{dt} = a\\frac{da}{dt} + b\\frac{db}{dt} + c\\frac{dc}{dt}$. So the current length of the diagonal divides a weighted sum of the edge rates.",
    "长方体的对角线满足 $\\ell^2 = a^2 + b^2 + c^2$。对时间求导并约去因子二，得 $\\ell\\frac{d\\ell}{dt} = a\\frac{da}{dt} + b\\frac{db}{dt} + c\\frac{dc}{dt}$。所以对角线的当前长度要除棱长变化率的加权和。",
  ),
  generate(rng) {
    const [a, b, c, d] = rng.pick([
      [1, 2, 2, 3],
      [2, 3, 6, 7],
      [1, 4, 8, 9],
      [2, 6, 9, 11],
      [4, 4, 7, 9],
    ] as const);
    const ra = nonzero(rng, 5);
    const rb = nonzero(rng, 5);
    const rc = nonzero(rng, 5);
    const sum = a * ra + b * rb + c * rc;
    const answer = Q.of(sum, d);
    return numberProblem({
      prompt: t(
        `At one moment the edges of a box are $${a}$, $${b}$ and $${c}$ cm, and they are changing at $${ra}$, $${rb}$ and $${rc}$ cm/s respectively. How fast is the diagonal changing, in cm/s?`,
        `某一时刻长方体的棱长是 $${a}$、$${b}$、$${c}$ cm，变化率依次是 $${ra}$、$${rb}$、$${rc}$ cm/s。对角线的变化率是多少 cm/s？`,
      ),
      answer,
      wrong: [Q.of(ra + rb + rc), Q.of(sum, a + b + c), Q.of(sum, 2 * d)],
      solution: t(
        `The diagonal is $\\sqrt{${a * a} + ${b * b} + ${c * c}} = ${d}$. So $${d}\\frac{d\\ell}{dt} = ${a}(${ra}) + ${b}(${rb}) + ${c}(${rc}) = ${sum}$, and the rate is $${answer.toLatex()}$.`,
        `对角线是 $\\sqrt{${a * a} + ${b * b} + ${c * c}} = ${d}$。所以 $${d}\\frac{d\\ell}{dt} = ${a}(${ra}) + ${b}(${rb}) + ${c}(${rc}) = ${sum}$，变化率是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const zeroTimesInfinity: KnowledgePointDef = {
  id: "lhopitals-rule-for-zero-times-infinity",
  title: t("L'Hopital's rule for zero times infinity", "零乘无穷型的洛必达法则"),
  explanation: t(
    "L'Hopital's rule applies only to quotients, so a product of the form $0 \\cdot \\infty$ must be rewritten first. Moving the growing factor into a denominator gives a $\\frac{0}{0}$ form: $x \\cdot g\\left(\\frac{1}{x}\\right) = \\frac{g(1/x)}{1/x}$. Then the rule applies as usual.",
    "洛必达法则只适用于商，所以 $0 \\cdot \\infty$ 型的乘积要先改写。把增长的因子移到分母，就得到 $\\frac{0}{0}$ 型：$x \\cdot g\\left(\\frac{1}{x}\\right) = \\frac{g(1/x)}{1/x}$。然后照常使用法则。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const b = rng.int(1, 5);
    const piece = rng.pick([
      `\\sin\\left(\\frac{${a}}{x}\\right)`,
      `\\left(e^{${a}/x} - 1\\right)`,
      `\\ln\\left(1 + \\frac{${a}}{x}\\right)`,
    ]);
    const answer = a * b;
    const front = poly([b, "x"]);
    return numberProblem({
      prompt: t(`Find $\\lim_{x \\to \\infty} ${front}${piece}$.`, `求 $\\lim_{x \\to \\infty} ${front}${piece}$。`),
      answer,
      form: "integer",
      wrong: [0, a, a + b],
      solution: t(
        `Write the product as a quotient with denominator $\\frac{1}{${front}}$, which is a $\\frac{0}{0}$ form. Differentiating top and bottom cancels the factor $-\\frac{1}{x^2}$, and what is left tends to $${a} \\cdot ${b} = ${answer}$.`,
        `把乘积写成分母为 $\\frac{1}{${front}}$ 的商，这是 $\\frac{0}{0}$ 型。分子分母分别求导，因子 $-\\frac{1}{x^2}$ 约去，剩下的部分趋于 $${a} \\cdot ${b} = ${answer}$。`,
      ),
    });
  },
};

const boundFromMeanValue: KnowledgePointDef = {
  id: "a-bound-on-a-function-from-the-mean-value-theorem",
  title: t("A bound on a function from the mean value theorem", "由中值定理得到函数的界"),
  explanation: t(
    "The mean value theorem says $f(b) - f(a) = f'(c)(b - a)$ for some $c$ in the interval. So a bound on the derivative becomes a bound on the change of the function: if $f'$ never exceeds $M$, then $f(b)$ is at most $f(a) + M(b - a)$. A lower bound on $f'$ works the same way.",
    "中值定理说，区间内存在 $c$ 使 $f(b) - f(a) = f'(c)(b - a)$。所以导数的界就变成函数变化量的界：如果 $f'$ 不超过 $M$，则 $f(b)$ 至多是 $f(a) + M(b - a)$。导数的下界同理。",
  ),
  generate(rng) {
    const a = rng.int(0, 5);
    const w = rng.int(2, 7);
    const b = a + w;
    const v = rng.int(-9, 9);
    const M = nonzero(rng, 6);
    const upper = rng.int(0, 1) === 0;
    const answer = v + M * w;
    return numberProblem({
      prompt: t(
        `$f$ is differentiable on $[${a}, ${b}]$, with $f(${a}) = ${v}$ and $f'(x) ${upper ? "\\le" : "\\ge"} ${M}$ throughout. What is the ${upper ? "largest" : "smallest"} possible value of $f(${b})$?`,
        `$f$ 在 $[${a}, ${b}]$ 上可导，$f(${a}) = ${v}$，且处处有 $f'(x) ${upper ? "\\le" : "\\ge"} ${M}$。$f(${b})$ 的${upper ? "最大" : "最小"}可能值是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [v + M, M * w, v + M * b],
      solution: t(
        `By the mean value theorem, $f(${b}) - f(${a}) = f'(c) \\cdot ${w}$, which is ${upper ? "at most" : "at least"} $${M} \\cdot ${w}$. So the ${upper ? "largest" : "smallest"} value is $${v} + ${inParens(M * w)} = ${answer}$.`,
        `由中值定理，$f(${b}) - f(${a}) = f'(c) \\cdot ${w}$，它${upper ? "至多" : "至少"}是 $${M} \\cdot ${w}$。所以${upper ? "最大" : "最小"}值是 $${v} + ${inParens(M * w)} = ${answer}$。`,
      ),
    });
  },
};

const cubicFromExtrema: KnowledgePointDef = {
  id: "coefficients-of-a-cubic-from-its-extrema",
  title: t("Coefficients of a cubic from its extrema", "由极值点求三次函数的系数"),
  explanation: t(
    "The critical points of a cubic are the roots of its derivative. If $f(x) = x^3 + ax^2 + bx + c$ has them at $p$ and $q$, then $f'(x) = 3(x - p)(x - q)$. Expanding and matching with $3x^2 + 2ax + b$ gives the coefficients. The constant $c$ does not affect where the extrema are.",
    "三次函数的临界点是导数的根。如果 $f(x) = x^3 + ax^2 + bx + c$ 的临界点是 $p$ 和 $q$，则 $f'(x) = 3(x - p)(x - q)$。展开后与 $3x^2 + 2ax + b$ 比较，就得到系数。常数 $c$ 不影响极值点的位置。",
  ),
  generate(rng) {
    const p = rng.int(-6, 5);
    const q = p + rng.int(1, 6);
    const askA = rng.int(0, 1) === 0;
    const a = Q.of(-3 * (p + q), 2);
    const b = 3 * p * q;
    const answer = askA ? a : Q.of(b);
    return numberProblem({
      prompt: t(
        `$f(x) = x^3 + ax^2 + bx + 1$ has a local maximum at $x = ${p}$ and a local minimum at $x = ${q}$. Find $${askA ? "a" : "b"}$.`,
        `$f(x) = x^3 + ax^2 + bx + 1$ 在 $x = ${p}$ 处有极大值，在 $x = ${q}$ 处有极小值。求 $${askA ? "a" : "b"}$。`,
      ),
      answer,
      wrong: askA ? [a.neg(), Q.of(-(p + q)), Q.of(b)] : [Q.of(p * q), Q.of(-b), a],
      solution: t(
        `$f'(x) = 3(${poly([1, "x"], [-p, ""])})(${poly([1, "x"], [-q, ""])}) = ${poly([3, "x^2"], [-3 * (p + q), "x"], [b, ""])}$. Matching with $3x^2 + 2ax + b$ gives $${askA ? "a" : "b"} = ${answer.toLatex()}$.`,
        `$f'(x) = 3(${poly([1, "x"], [-p, ""])})(${poly([1, "x"], [-q, ""])}) = ${poly([3, "x^2"], [-3 * (p + q), "x"], [b, ""])}$。与 $3x^2 + 2ax + b$ 比较，得 $${askA ? "a" : "b"} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const quarticFromInflections: KnowledgePointDef = {
  id: "coefficients-of-a-quartic-from-its-inflection-points",
  title: t("Coefficients of a quartic from its inflection points", "由拐点求四次函数的系数"),
  explanation: t(
    "A point of inflection of a quartic is a place where its second derivative changes sign, so its $x$-coordinate is a simple root of $f''$. If $f(x) = x^4 + ax^3 + bx^2$ has them at $p$ and $q$, then $f''(x) = 12(x - p)(x - q)$. Matching this with $12x^2 + 6ax + 2b$ gives the coefficients.",
    "四次函数的拐点是二阶导数变号的地方，所以它的横坐标是 $f''$ 的单根。如果 $f(x) = x^4 + ax^3 + bx^2$ 的拐点在 $p$ 和 $q$，则 $f''(x) = 12(x - p)(x - q)$。与 $12x^2 + 6ax + 2b$ 比较，就得到系数。",
  ),
  generate(rng) {
    const p = rng.int(-6, 5);
    const q = p + rng.int(1, 6);
    const askA = rng.int(0, 1) === 0;
    const a = -2 * (p + q);
    const b = 6 * p * q;
    const answer = askA ? a : b;
    return numberProblem({
      prompt: t(
        `$f(x) = x^4 + ax^3 + bx^2$ has points of inflection at $x = ${p}$ and $x = ${q}$. Find $${askA ? "a" : "b"}$.`,
        `$f(x) = x^4 + ax^3 + bx^2$ 的拐点在 $x = ${p}$ 和 $x = ${q}$ 处。求 $${askA ? "a" : "b"}$。`,
      ),
      answer,
      form: "integer",
      wrong: askA ? [-a, -(p + q), b] : [p * q, 12 * p * q, a],
      solution: t(
        `$f''(x) = 12(${poly([1, "x"], [-p, ""])})(${poly([1, "x"], [-q, ""])})$, so $6a = ${-12 * (p + q)}$ and $2b = ${12 * p * q}$. That gives $${askA ? "a" : "b"} = ${answer}$.`,
        `$f''(x) = 12(${poly([1, "x"], [-p, ""])})(${poly([1, "x"], [-q, ""])})$，所以 $6a = ${-12 * (p + q)}$，$2b = ${12 * p * q}$。于是 $${askA ? "a" : "b"} = ${answer}$。`,
      ),
    });
  },
};

const linearizationError: KnowledgePointDef = {
  id: "bounding-the-error-of-a-linearization",
  title: t("Bounding the error of a linearization", "线性近似的误差界"),
  explanation: t(
    "A tangent line departs from a curve because of curvature, so the error depends on the second derivative. If $|f''| \\le M$ between $a$ and $x$, then $|f(x) - L(x)| \\le \\frac{M}{2}(x - a)^2$. Because of the square, moving ten times closer makes the error bound a hundred times smaller.",
    "切线偏离曲线是因为曲线弯曲，所以误差取决于二阶导数。如果在 $a$ 与 $x$ 之间 $|f''| \\le M$，则 $|f(x) - L(x)| \\le \\frac{M}{2}(x - a)^2$。由于有平方，距离缩小到十分之一时，误差界缩小到百分之一。",
  ),
  generate(rng) {
    const a = rng.int(1, 5);
    const d = rng.int(1, 9);
    const M = rng.int(1, 12);
    const answer = Q.of(M * d * d, 200);
    return numberProblem({
      prompt: t(
        `$L$ is the linearization of $f$ at $x = ${a}$, and $|f''(x)| \\le ${M}$ between $${a}$ and $${a}.${d}$. What upper bound does the error formula give for $|f(${a}.${d}) - L(${a}.${d})|$?`,
        `$L$ 是 $f$ 在 $x = ${a}$ 处的线性近似，在 $${a}$ 与 $${a}.${d}$ 之间 $|f''(x)| \\le ${M}$。误差公式给出的 $|f(${a}.${d}) - L(${a}.${d})|$ 的上界是多少？`,
      ),
      answer,
      wrong: [Q.of(M * d, 10), Q.of(M * d * d, 100), Q.of(M * d, 20)],
      solution: t(
        `The distance from the center is $0.${d}$, so the bound is $\\frac{${M}}{2}(0.${d})^2 = ${answer.toLatex()}$.`,
        `到中心的距离是 $0.${d}$，所以误差界是 $\\frac{${M}}{2}(0.${d})^2 = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const priceForMostRevenue: KnowledgePointDef = {
  id: "the-price-that-maximizes-revenue",
  title: t("The price that maximizes revenue", "使收入最大的价格"),
  explanation: t(
    "Raising a price brings in more per sale but loses sales. If a rise of $x$ takes the price to $p + x$ and the sales to $n - mx$, then the revenue is their product, a downward parabola in $x$. Its maximum lies halfway between its two roots.",
    "涨价使每笔收入增加，但销量减少。如果涨价 $x$ 后价格变成 $p + x$，销量变成 $n - mx$，收入就是二者之积，是关于 $x$ 的开口向下的抛物线。最大值在两根的正中间。",
  ),
  generate(rng) {
    const p = rng.int(5, 20);
    const m = rng.int(1, 10);
    const k = rng.int(1, 20);
    const n = m * p + 2 * m * k;
    const answer = p + k;
    return numberProblem({
      prompt: t(
        `A shop sells ${n} items a week at $${p}$ dollars each. Every dollar added to the price loses ${m} sales a week. Which price gives the greatest weekly revenue, in dollars?`,
        `商店以每件 $${p}$ 美元的价格每周售出 ${n} 件。价格每提高一美元，每周少售出 ${m} 件。什么价格（美元）使每周收入最大？`,
      ),
      answer,
      form: "integer",
      wrong: [p + 2 * k, k, p],
      solution: t(
        `The revenue after a rise of $x$ is $(${p} + x)(${n} - ${m}x)$. Its derivative is $${n} - ${m * p} - ${2 * m}x$, which vanishes at $x = ${k}$. So the best price is $${p} + ${k} = ${answer}$.`,
        `涨价 $x$ 后的收入是 $(${p} + x)(${n} - ${m}x)$。它的导数是 $${n} - ${m * p} - ${2 * m}x$，在 $x = ${k}$ 处为零。所以最佳价格是 $${p} + ${k} = ${answer}$。`,
      ),
    });
  },
};

const newtonFails: KnowledgePointDef = {
  id: "a-starting-point-where-newtons-method-fails",
  title: t("A starting point where Newton's method fails", "牛顿法失效的起点"),
  explanation: t(
    "Newton's method divides by $f'(x_n)$, so it breaks down at a point where the derivative is zero. Geometrically, the tangent line there is horizontal and never meets the $x$-axis. Such a starting point has to be avoided, and starting near one sends the next estimate far away.",
    "牛顿法要除以 $f'(x_n)$，所以在导数为零的点会失效。从几何上看，那里的切线是水平的，与 $x$ 轴不相交。必须避开这样的起点，而在它附近出发，下一个估计值会跑得很远。",
  ),
  generate(rng) {
    const k = rng.int(1, 9);
    const m = nonzero(rng, 9);
    const f = poly([1, "x^3"], [-3 * k * k, "x"], [m, ""]);
    return numberProblem({
      prompt: t(
        `Newton's method is applied to $f(x) = ${f}$. For which positive starting value $x_0$ can $x_1$ not be computed?`,
        `对 $f(x) = ${f}$ 使用牛顿法。正的初始值 $x_0$ 取何值时无法算出 $x_1$？`,
      ),
      answer: k,
      solveFor: "x_0",
      wrong: [k * k, 3 * k * k, 2 * k],
      solution: t(
        `Computing $x_1$ requires dividing by $f'(x_0) = 3x_0^2 - ${3 * k * k}$. This is zero at $x_0 = \\pm ${k}$, and the positive value is $${k}$.`,
        `计算 $x_1$ 要除以 $f'(x_0) = 3x_0^2 - ${3 * k * k}$。它在 $x_0 = \\pm ${k}$ 处为零，正值是 $${k}$。`,
      ),
    });
  },
};

const twoInitialConditions: KnowledgePointDef = {
  id: "a-function-from-its-second-derivative",
  title: t("A function from its second derivative", "由二阶导数求函数"),
  explanation: t(
    "Integrating a second derivative twice introduces two constants, so two conditions are needed. Use the value of $f'$ to fix the constant in the first integration, and the value of $f$ to fix the constant in the second. Keep the two steps in this order.",
    "把二阶导数积分两次会引入两个常数，所以需要两个条件。用 $f'$ 的值确定第一次积分的常数，用 $f$ 的值确定第二次积分的常数。这两步的顺序不能颠倒。",
  ),
  generate(rng) {
    const A = nonzero(rng, 3);
    const B = nonzero(rng, 4);
    const c = nonzero(rng, 6);
    const d = nonzero(rng, 9);
    const x = rng.int(1, 3);
    const answer = A * x ** 3 + B * x ** 2 + c * x + d;
    const second = poly([6 * A, "x"], [2 * B, ""]);
    return numberProblem({
      prompt: t(
        `$f''(x) = ${second}$, $f'(0) = ${c}$ and $f(0) = ${d}$. Find $f(${x})$.`,
        `$f''(x) = ${second}$，$f'(0) = ${c}$，$f(0) = ${d}$。求 $f(${x})$。`,
      ),
      answer,
      form: "integer",
      wrong: [A * x ** 3 + B * x ** 2 + d, A * x ** 3 + B * x ** 2 + c * x, 6 * A * x + 2 * B],
      solution: t(
        `Integrating once and using $f'(0)$ gives $f'(x) = ${poly([3 * A, "x^2"], [2 * B, "x"], [c, ""])}$. Integrating again and using $f(0)$ gives $f(x) = ${poly([A, "x^3"], [B, "x^2"], [c, "x"], [d, ""])}$, so $f(${x}) = ${answer}$.`,
        `积分一次并用 $f'(0)$，得 $f'(x) = ${poly([3 * A, "x^2"], [2 * B, "x"], [c, ""])}$。再积分并用 $f(0)$，得 $f(x) = ${poly([A, "x^3"], [B, "x^2"], [c, "x"], [d, ""])}$，所以 $f(${x}) = ${answer}$。`,
      ),
    });
  },
};

const unknownUpperLimit: KnowledgePointDef = {
  id: "an-unknown-limit-of-integration",
  title: t("An unknown limit of integration", "未知的积分上限"),
  explanation: t(
    "The fundamental theorem works in reverse as well. If the value of an integral is known and a limit is not, evaluating the antiderivative at that limit gives an equation in the unknown. For a linear integrand, that equation is a quadratic, and a condition such as positivity selects the root.",
    "微积分基本定理也可以反过来用。如果已知积分的值而不知道积分限，把原函数代入这个积分限，就得到关于未知数的方程。被积函数是一次式时，这是一个二次方程，再由正数之类的条件选出合适的根。",
  ),
  generate(rng) {
    const c = rng.int(1, 3);
    const a = rng.int(1, 9);
    const k = rng.int(1, 9);
    const v = c * k * k + a * k;
    return numberProblem({
      prompt: t(
        `Find the positive number $k$ for which $\\int_0^k (${poly([2 * c, "x"], [a, ""])})\\,dx = ${v}$.`,
        `求正数 $k$，使 $\\int_0^k (${poly([2 * c, "x"], [a, ""])})\\,dx = ${v}$。`,
      ),
      answer: k,
      solveFor: "k",
      wrong: [k + a, 2 * k, k + 1],
      solution: t(
        `The integral equals $${poly([c, "k^2"], [a, "k"])}$. Setting this equal to $${v}$ gives a quadratic whose roots have a negative product, so exactly one root is positive: $k = ${k}$.`,
        `积分等于 $${poly([c, "k^2"], [a, "k"])}$。令它等于 $${v}$，得到两根之积为负的二次方程，所以恰有一个正根：$k = ${k}$。`,
      ),
    });
  },
};

const symmetryAboutAnotherCenter: KnowledgePointDef = {
  id: "symmetry-about-a-point-other-than-the-origin",
  title: t("Symmetry about a point other than the origin", "关于原点以外的点的对称"),
  explanation: t(
    "Symmetry does not need the origin. If an interval is centered at $c$, then an odd power of $x - c$ has equal and opposite areas on the two sides, and its integral is zero. Only the even part remains, and a constant term contributes its value times the width of the interval.",
    "对称不一定要关于原点。如果区间以 $c$ 为中心，$x - c$ 的奇次幂在两侧的面积大小相等、符号相反，积分为零。只剩下偶数部分，常数项贡献它的值乘以区间宽度。",
  ),
  generate(rng) {
    const c = nonzero(rng, 6);
    const a = rng.int(1, 6);
    const m = nonzero(rng, 5);
    const k = nonzero(rng, 9);
    const answer = 2 * a * k;
    const inner = poly([1, "x"], [-c, ""]);
    return numberProblem({
      prompt: t(
        `Find $\\int_{${c - a}}^{${c + a}} \\left(${poly([m, `(${inner})^3`], [k, ""])}\\right)dx$.`,
        `求 $\\int_{${c - a}}^{${c + a}} \\left(${poly([m, `(${inner})^3`], [k, ""])}\\right)dx$。`,
      ),
      answer,
      form: "integer",
      wrong: [0, a * k, 2 * a * m + 2 * a * k],
      solution: t(
        `The interval is centered at $${c}$, so the cubed term is odd about the center and integrates to zero. The constant contributes $${inParens(k)} \\cdot ${2 * a} = ${answer}$.`,
        `区间以 $${c}$ 为中心，所以立方项关于中心是奇函数，积分为零。常数项贡献 $${inParens(k)} \\cdot ${2 * a} = ${answer}$。`,
      ),
    });
  },
};

const constantInAnAccumulation: KnowledgePointDef = {
  id: "a-constant-in-an-accumulation-function",
  title: t("A constant in an accumulation function", "累积函数中的常数"),
  explanation: t(
    "An accumulation function $\\int_a^x f(t)\\,dt$ is zero at $x = a$, because the interval has no width. So if the integral is given by a formula with an unknown constant, setting $x = a$ determines the constant. There is no need to find $f$ itself.",
    "累积函数 $\\int_a^x f(t)\\,dt$ 在 $x = a$ 处为零，因为区间没有宽度。所以如果积分由一个含未知常数的公式给出，令 $x = a$ 就能确定这个常数，不必求出 $f$ 本身。",
  ),
  generate(rng) {
    const a = nonzero(rng, 6);
    const b = nonzero(rng, 9);
    const answer = -(a * a + a * b);
    return numberProblem({
      prompt: t(
        `For all $x$, $\\int_{${a}}^{x} f(t)\\,dt = ${poly([1, "x^2"], [b, "x"])} + k$. Find $k$.`,
        `对所有 $x$，$\\int_{${a}}^{x} f(t)\\,dt = ${poly([1, "x^2"], [b, "x"])} + k$。求 $k$。`,
      ),
      answer,
      solveFor: "k",
      wrong: [a * a + a * b, -(a * a), a * a - a * b],
      solution: t(
        `At $x = ${a}$ the integral is zero, so $${inParens(a)}^2 + ${inParens(b)}(${a}) + k = 0$. That gives $k = ${answer}$.`,
        `在 $x = ${a}$ 处积分为零，所以 $${inParens(a)}^2 + ${inParens(b)}(${a}) + k = 0$，得 $k = ${answer}$。`,
      ),
    });
  },
};

const rightMinusLeft: KnowledgePointDef = {
  id: "the-difference-between-right-and-left-sums",
  title: t("The difference between right and left sums", "右和与左和之差"),
  explanation: t(
    "Right and left Riemann sums share every height except one at each end, so most terms cancel: $R_n - L_n = \\Delta x\\,(f(b) - f(a))$. For a monotonic function the true area lies between them, so this gives a bound on the error without any integration.",
    "右黎曼和与左黎曼和除了两端各有一个高度不同，其余都相同，所以大多数项相消：$R_n - L_n = \\Delta x\\,(f(b) - f(a))$。对单调函数，真实面积在二者之间，所以不用积分就能得到误差的界。",
  ),
  generate(rng) {
    const a = rng.int(0, 4);
    const b = a + rng.int(1, 6);
    const n = rng.pick([4, 5, 8, 10, 20, 50, 100]);
    const c = rng.int(1, 6);
    const f = (x: number) => x * x + c * x;
    const answer = Q.of((b - a) * (f(b) - f(a)), n);
    return numberProblem({
      prompt: t(
        `For $f(x) = ${poly([1, "x^2"], [c, "x"])}$ on $[${a}, ${b}]$ with ${n} equal subintervals, find $R_{${n}} - L_{${n}}$, the right sum minus the left sum.`,
        `对 $[${a}, ${b}]$ 上的 $f(x) = ${poly([1, "x^2"], [c, "x"])}$，取 ${n} 个等宽子区间，求右和减左和 $R_{${n}} - L_{${n}}$。`,
      ),
      answer,
      wrong: [Q.of(f(b) - f(a)), Q.of((b - a) * f(b), n), answer.div(Q.of(2))],
      solution: t(
        `Only the end heights differ, and $f(${b}) - f(${a}) = ${f(b) - f(a)}$. With $\\Delta x = ${Q.of(b - a, n).toLatex()}$, the difference is $${answer.toLatex()}$.`,
        `只有两端的高度不同，$f(${b}) - f(${a}) = ${f(b) - f(a)}$。由 $\\Delta x = ${Q.of(b - a, n).toLatex()}$，差是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

/** deeperCalculusIPoints gives, by topic id, the knowledge points added after a Calculus I topic's own. */
export const deeperCalculusIPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "limits-of-piecewise-functions": [coefficientForPiecewiseLimit],
  "calculating-limits-of-rational-functions-by-factoring": [limitThatMustExist],
  "calculating-limits-of-radical-functions-using-conjugate-multiplication": [conjugatesTopAndBottom],
  "limits-at-infinity-and-horizontal-asymptotes-of-rational-functions": [crossingTheAsymptote],
  "evaluating-special-limits-involving-sine-using-a-substitution": [quadraticInsideSine],
  "limits-involving-the-exponential-function": [ratioToAPower],
  "calculating-the-equation-of-a-tangent-line-using-differentiation": [tangentThroughOutsidePoint],
  "calculating-the-equation-of-a-normal-line-using-differentiation": [normalMeetsAgain],
  "the-product-rule-for-differentiation": [productOfThree],
  "the-quotient-rule-for-differentiation": [largestValueOfAQuotient],
  "second-and-higher-order-derivatives": [highDerivativeOfAProduct],
  "the-chain-rule-with-exponential-functions": [rateThatSolvesAnEquation],
  "differentiating-inverse-functions": [inverseInsideAChain],
  "calculating-related-rates-using-similar-triangles": [troughDepth],
  "calculating-related-rates-with-cones": [coneWithALeak],
  "calculating-related-rates-with-rectangular-solids": [boxDiagonal],
  "lhopitals-rule": [zeroTimesInfinity],
  "the-mean-value-theorem": [boundFromMeanValue],
  "using-the-first-derivative-test-to-classify-local-extrema": [cubicFromExtrema],
  "points-of-inflection": [quarticFromInflections],
  "approximating-functions-using-local-linearity-and-linearization": [linearizationError],
  "optimization-problems-in-economics": [priceForMostRevenue],
  "newtons-method": [newtonFails],
  "the-antiderivative": [twoInitialConditions],
  "the-fundamental-theorem-of-calculus": [unknownUpperLimit],
  "evaluating-definite-integrals-using-symmetry": [symmetryAboutAnotherCenter],
  "the-second-fundamental-theorem-of-calculus": [constantInAnAccumulation],
  "approximating-areas-with-the-right-riemann-sum": [rightMinusLeft],
};
