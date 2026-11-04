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

/** timesX writes a multiple of x, without a coefficient of one. */
const timesX = (a: number) => (a === 1 ? "x" : a === -1 ? "-x" : `${a}x`);

const sinhAndCoshTogether: KnowledgePointDef = {
  id: "an-equation-with-both-sinh-and-cosh",
  title: t("An equation with both sinh and cosh", "同时含 sinh 和 cosh 的方程"),
  explanation: t(
    "When sinh and cosh appear together, no single inverse function undoes them. Writing both in terms of the exponential turns the equation into one in $u = e^{x}$. Multiplying by $u$ gives a quadratic, and since an exponential is always positive, only a positive root of that quadratic can correspond to a real $x$.",
    "当 sinh 和 cosh 同时出现时，没有一个反函数能直接消去它们。把两者都写成指数形式，方程就变成关于 $u = e^{x}$ 的方程。两边乘以 $u$ 得到二次方程；由于指数函数恒为正，只有正根才对应实数 $x$。",
  ),
  generate(rng) {
    const k = rng.int(2, 6);
    const j = rng.int(1, 4);
    const n = k * j;
    const m = different(rng, 1, 7, n);
    const c = m * k - j;
    const equation = `${poly([m + n, "\\sinh x"], [m - n, "\\cosh x"])} = ${c}`;
    const inU = `${poly([m, "u"])} - \\frac{${n}}{u} = ${c}`;
    const quadratic = poly([m, "u^2"], [-c, "u"], [-n, ""]);
    const other = Q.of(-j, m).toLatex();
    return numberProblem({
      prompt: t(
        `The equation $${equation}$ has exactly one real solution $x$. Find $e^{x}$.`,
        `方程 $${equation}$ 恰有一个实数解 $x$。求 $e^{x}$。`,
      ),
      answer: k,
      form: "integer",
      wrong: [m, j, k + 1, 2 * k, k + 2, 3 * k],
      solution: t(
        `With $u = e^{x}$, the definitions turn the equation into $${inU}$, that is $${quadratic} = 0$. Its roots are $${k}$ and $${other}$, and $e^{x}$ must be positive, so $e^{x} = ${k}$.`,
        `令 $u = e^{x}$，由定义得方程 $${inU}$，即 $${quadratic} = 0$。它的根是 $${k}$ 和 $${other}$，而 $e^{x}$ 必须为正，所以 $e^{x} = ${k}$。`,
      ),
    });
  },
};

const hyperbolicOfInverse: KnowledgePointDef = {
  id: "a-hyperbolic-function-of-an-inverse-hyperbolic-value",
  title: t("A hyperbolic function of an inverse hyperbolic value", "反双曲函数值的双曲函数"),
  explanation: t(
    "To evaluate a hyperbolic function of an inverse hyperbolic value, name the inner value $y$, so one of $\\sinh y$ and $\\cosh y$ is known at once. The identity $\\cosh^{2} y - \\sinh^{2} y = 1$ gives the other, and the sign follows from the facts that cosh is positive and the principal value of arcosh is not negative.",
    "要计算反双曲函数值的双曲函数，把里面的值记作 $y$，这样 $\\sinh y$ 和 $\\cosh y$ 中就有一个立刻已知。恒等式 $\\cosh^{2} y - \\sinh^{2} y = 1$ 给出另一个，而符号由两个事实确定：cosh 恒为正，arcosh 的主值不为负。",
  ),
  generate(rng) {
    const [a, b, c] = rng.pick([
      [3, 4, 5],
      [4, 3, 5],
      [5, 12, 13],
      [12, 5, 13],
      [8, 15, 17],
      [15, 8, 17],
      [7, 24, 25],
      [24, 7, 25],
    ] as const);
    const fromSinh = rng.pick([true, false]);
    const s = fromSinh ? rng.pick([1, -1]) : 1;
    const outerIsTanh = rng.pick([true, false]);
    const sinhY = Q.of(s * b, a);
    const coshY = Q.of(c, a);
    const tanhY = Q.of(s * b, c);
    const inner = fromSinh
      ? `\\operatorname{arsinh}\\left(${sinhY.toLatex()}\\right)`
      : `\\operatorname{arcosh}\\left(${coshY.toLatex()}\\right)`;
    const outer = outerIsTanh ? "\\tanh" : fromSinh ? "\\cosh" : "\\sinh";
    const answer = outerIsTanh ? tanhY : fromSinh ? coshY : sinhY;
    const known = fromSinh ? `\\sinh y = ${sinhY.toLatex()}` : `\\cosh y = ${coshY.toLatex()}`;
    const found = fromSinh ? `\\cosh y = ${coshY.toLatex()}` : `\\sinh y = ${sinhY.toLatex()}`;
    const last = outerIsTanh ? `$\\tanh y = \\frac{\\sinh y}{\\cosh y} = ${answer.toLatex()}$` : `this is the value asked for`;
    const lastZh = outerIsTanh ? `$\\tanh y = \\frac{\\sinh y}{\\cosh y} = ${answer.toLatex()}$` : `这就是所求的值`;
    return numberProblem({
      prompt: t(`Find $${outer}\\left(${inner}\\right)$.`, `求 $${outer}\\left(${inner}\\right)$。`),
      answer,
      wrong: [Q.of(c, s * a), Q.of(s * b, a), Q.of(s * b, c), Q.of(s * a, c), Q.of(s * a, b)],
      solution: t(
        `Let $y = ${inner}$, so $${known}$. The identity $\\cosh^{2} y - \\sinh^{2} y = 1$ then gives $${found}$, taking the sign that applies, and ${last}.`,
        `令 $y = ${inner}$，则 $${known}$。由恒等式 $\\cosh^{2} y - \\sinh^{2} y = 1$，并取相应的符号，得 $${found}$，而 ${lastZh}。`,
      ),
    });
  },
};

const quotientLimitNewDenominator: KnowledgePointDef = {
  id: "a-known-quotient-limit-over-a-new-denominator",
  title: t("A known quotient limit over a new denominator", "已知商的极限，换一个分母"),
  explanation: t(
    "The formula for $f$ is not needed when the limit of a related quotient is known. Factor the new denominator so that the known denominator appears, then write the new quotient as a product of the known quotient and a remaining fraction. The product rule for limits combines the two, because each factor has a limit.",
    "已知相关商的极限时，不需要 $f$ 的表达式。把新分母因式分解，让已知的分母出现，再把新商写成已知商与剩余分式的乘积。由于每个因子都有极限，极限的乘积法则就能把两者合起来。",
  ),
  generate(rng) {
    const c = nonzero(rng, 6);
    const l = nonzero(rng, 9);
    const isDifference = rng.pick([true, false]);
    const factor = isDifference ? poly([1, "x"], [c, ""]) : "x";
    const denominator = isDifference ? poly([1, "x^2"], [-c * c, ""]) : poly([1, "x^2"], [-c, "x"]);
    const at = isDifference ? 2 * c : c;
    const known = poly([1, "x"], [-c, ""]);
    const answer = Q.of(l, at);
    return numberProblem({
      prompt: t(
        `A function $f$ satisfies $\\lim_{x \\to ${c}} \\frac{f(x)}{${known}} = ${l}$. Find $\\lim_{x \\to ${c}} \\frac{f(x)}{${denominator}}$.`,
        `函数 $f$ 满足 $\\lim_{x \\to ${c}} \\frac{f(x)}{${known}} = ${l}$。求 $\\lim_{x \\to ${c}} \\frac{f(x)}{${denominator}}$。`,
      ),
      answer,
      wrong: [Q.of(l), Q.of(l * at), Q.of(-l, at), Q.of(l + at), Q.of(2 * l), Q.of(3 * l)],
      solution: t(
        `The new quotient is $\\frac{f(x)}{${known}} \\cdot \\frac{1}{${factor}}$. The first factor tends to $${l}$ and the second to $${Q.of(1, at).toLatex()}$, so the limit is $${answer.toLatex()}$.`,
        `新的商是 $\\frac{f(x)}{${known}} \\cdot \\frac{1}{${factor}}$。第一个因子趋于 $${l}$，第二个趋于 $${Q.of(1, at).toLatex()}$，所以极限是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const ratioOfExponentials: KnowledgePointDef = {
  id: "a-ratio-of-exponentials-at-either-infinity",
  title: t("A ratio of exponentials at either infinity", "指数函数之比在两个方向的极限"),
  explanation: t(
    "An exponential with base above one behaves very differently in the two directions. As $x \\to \\infty$ it dominates the constants, so dividing above and below by it leaves its coefficients. As $x \\to -\\infty$ it vanishes, so only the constants remain. The same quotient therefore usually has two different limits at the two ends.",
    "底数大于一的指数函数在两个方向上表现截然不同。当 $x \\to \\infty$ 时它压倒常数，所以分子分母同除以它，就只剩它的系数。当 $x \\to -\\infty$ 时它趋于零，只剩常数。因此同一个商在两端通常有两个不同的极限。",
  ),
  generate(rng) {
    const base = rng.pick(["2^{x}", "3^{x}", "4^{x}", "5^{x}", "e^{x}"]);
    const a = nonzero(rng, 9);
    const c = rng.int(1, 6);
    const q = rng.int(1, 9);
    const p = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x * c !== a * q));
    const atPositive = rng.pick([true, false]);
    const answer = atPositive ? Q.of(a, c) : Q.of(p, q);
    const other = atPositive ? Q.of(p, q) : Q.of(a, c);
    const target = atPositive ? "\\infty" : "-\\infty";
    const term = (n: number) => (Math.abs(n) === 1 || base === "e^{x}" ? base : `\\cdot ${base}`);
    const f = `\\frac{${poly([a, term(a)], [p, ""])}}{${poly([c, term(c)], [q, ""])}}`;
    return numberProblem({
      prompt: t(`Find $\\lim_{x \\to ${target}} ${f}$.`, `求 $\\lim_{x \\to ${target}} ${f}$。`),
      answer,
      wrong: [other, Q.of(a, q), Q.of(p, c), Q.of(a + p, c + q), answer.neg(), Q.of(a + p), answer.mul(Q.of(2))],
      solution: t(
        atPositive
          ? `As $x \\to \\infty$, $${base}$ grows without bound, so dividing the top and the bottom by it leaves the ratio of its coefficients, $${answer.toLatex()}$.`
          : `As $x \\to -\\infty$, $${base} \\to 0$, so only the constant terms remain and the limit is $${answer.toLatex()}$.`,
        atPositive
          ? `当 $x \\to \\infty$ 时，$${base}$ 无限增大，所以分子分母同除以它，只剩系数之比 $${answer.toLatex()}$。`
          : `当 $x \\to -\\infty$ 时，$${base} \\to 0$，所以只剩常数项，极限是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const differenceOfLogarithms: KnowledgePointDef = {
  id: "a-difference-of-logarithms-at-infinity",
  title: t("A difference of logarithms at infinity", "对数之差在无穷远处的极限"),
  explanation: t(
    "Each logarithm alone grows without bound, so the difference looks like infinity minus infinity, which says nothing yet. Combining them into the logarithm of a quotient resolves it: the quotient has a finite limit, found from its leading coefficients, and the logarithm is continuous there, so the limit can be moved inside.",
    "每个对数单独都无限增大，所以差看起来是无穷减无穷，这还说明不了什么。把它们合并成商的对数就能解决：这个商有有限的极限，由最高次项系数求出，而对数函数在那里连续，所以极限可以移到对数里面。",
  ),
  generate(rng) {
    const b = rng.pick([2, 3, 5, 10]);
    const k = rng.int(1, b === 2 ? 4 : b === 3 ? 3 : 2);
    const c = rng.int(1, 5);
    const p = rng.int(1, 9);
    const q = rng.int(1, 9);
    const s = rng.pick([1, -1]);
    const large = c * b ** k;
    const log = b === 10 ? "\\log" : `\\log_{${b}}`;
    const big = `${log}\\left(${poly([large, "x"], [p, ""])}\\right)`;
    const small = `${log}\\left(${poly([c, "x"], [q, ""])}\\right)`;
    const f = s > 0 ? `${big} - ${small}` : `${small} - ${big}`;
    const answer = s * k;
    return numberProblem({
      prompt: t(`Find $\\lim_{x \\to \\infty} \\left(${f}\\right)$.`, `求 $\\lim_{x \\to \\infty} \\left(${f}\\right)$。`),
      answer,
      form: "integer",
      wrong: [s * b ** k, s * (k + 1), -s * k, 0],
      solution: t(
        `The difference of logarithms is the logarithm of a quotient whose limit is $${s > 0 ? b ** k : Q.of(1, b ** k).toLatex()}$, by its leading coefficients. So the limit is $${log} ${s > 0 ? b ** k : Q.of(1, b ** k).toLatex()} = ${answer}$.`,
        `对数之差是一个商的对数，由最高次项系数知这个商的极限是 $${s > 0 ? b ** k : Q.of(1, b ** k).toLatex()}$。所以极限是 $${log} ${s > 0 ? b ** k : Q.of(1, b ** k).toLatex()} = ${answer}$。`,
      ),
    });
  },
};

const tangentMinusSine: KnowledgePointDef = {
  id: "tangent-minus-sine-over-a-cube",
  title: t("Tangent minus sine over a cube", "正切减正弦除以立方"),
  explanation: t(
    "Tangent and sine agree to first order near zero, so their difference shrinks faster than the angle, and splitting the quotient into two limits at once would fail. Factor the sine out of the numerator using $\\tan u = \\frac{\\sin u}{\\cos u}$. This exposes one minus cosine, which supplies two powers of the angle, while the sine supplies the third.",
    "正切和正弦在零附近的一阶行为相同，所以它们的差比角本身更快地趋于零，直接把商拆成两个极限是行不通的。利用 $\\tan u = \\frac{\\sin u}{\\cos u}$ 把分子里的正弦提出来。这样就出现一减余弦，它提供角的两次方，而正弦提供第三次方。",
  ),
  generate(rng) {
    const a = rng.int(1, 6);
    const c = rng.int(1, 6);
    const answer = Q.of(a ** 3, 2 * c);
    const u = timesX(a);
    const product = Q.of(a ** 3, 2).toLatex();
    const scale = c === 1 ? "" : `, and dividing by $${c}$ gives $${answer.toLatex()}$`;
    const scaleZh = c === 1 ? "" : `，再除以 $${c}$ 得 $${answer.toLatex()}$`;
    return numberProblem({
      prompt: t(
        `Find $\\lim_{x \\to 0} \\frac{\\tan ${u} - \\sin ${u}}{${poly([c, "x^3"])}}$.`,
        `求 $\\lim_{x \\to 0} \\frac{\\tan ${u} - \\sin ${u}}{${poly([c, "x^3"])}}$。`,
      ),
      answer,
      wrong: [Q.of(a * a, 2 * c), Q.of(a ** 3, c), Q.of(a, 2 * c), Q.of(0), Q.of(a ** 3, 3 * c)],
      solution: t(
        `The numerator is $\\frac{\\sin ${u}}{\\cos ${u}}(1 - \\cos ${u})$. As $x \\to 0$, $\\frac{\\sin ${u}}{x} \\to ${a}$, $\\cos ${u} \\to 1$ and $\\frac{1 - \\cos ${u}}{x^2} \\to ${Q.of(a * a, 2).toLatex()}$. Multiplying these gives $${product}$${scale}.`,
        `分子等于 $\\frac{\\sin ${u}}{\\cos ${u}}(1 - \\cos ${u})$。当 $x \\to 0$ 时，$\\frac{\\sin ${u}}{x} \\to ${a}$，$\\cos ${u} \\to 1$，$\\frac{1 - \\cos ${u}}{x^2} \\to ${Q.of(a * a, 2).toLatex()}$。三者相乘得 $${product}$${scaleZh}。`,
      ),
    });
  },
};

const differenceOfTwoRoots: KnowledgePointDef = {
  id: "a-difference-of-two-roots-at-infinity",
  title: t("A difference of two roots at infinity", "两个根式之差在无穷远处的极限"),
  explanation: t(
    "Two square roots with the same leading term both grow without bound, yet their difference can settle at a finite value. Multiplying by the conjugate cancels the squared terms and leaves a linear numerator over a sum of roots. Each root behaves like $k|x|$, and when $x$ is negative that absolute value contributes a change of sign.",
    "两个最高次项相同的平方根都无限增大，但它们的差可以趋于有限值。乘以共轭式消去平方项，剩下一次式的分子和根式之和的分母。每个根式的行为都像 $k|x|$，当 $x$ 为负时，这个绝对值会带来一次变号。",
  ),
  generate(rng) {
    const k = rng.int(1, 3);
    const a = nonzero(rng, 8);
    const c = different(rng, -8, 8, a);
    const b = rng.int(1, 9);
    const d = rng.int(1, 9);
    const positive = rng.pick([true, false]);
    const s = positive ? 1 : -1;
    const answer = Q.of(s * (a - c), 2 * k);
    const first = `\\sqrt{${poly([k * k, "x^2"], [a, "x"], [b, ""])}}`;
    const second = `\\sqrt{${poly([k * k, "x^2"], [c, "x"], [d, ""])}}`;
    const target = positive ? "\\infty" : "-\\infty";
    const top = poly([a - c, "x"], [b - d, ""]);
    return numberProblem({
      prompt: t(
        `Find $\\lim_{x \\to ${target}} \\left(${first} - ${second}\\right)$.`,
        `求 $\\lim_{x \\to ${target}} \\left(${first} - ${second}\\right)$。`,
      ),
      answer,
      wrong: [Q.of(-s * (a - c), 2 * k), Q.of(s * (a - c), k), Q.of(s * (a - c)), Q.of(a + c, 2 * k), Q.of(s * (a - c), 4 * k)],
      solution: t(
        `Multiplying by the conjugate makes the numerator $${top}$, over the sum of the roots, which behaves like $${2 * k}|x|$. ${positive ? "Here $|x| = x$" : "Here $|x| = -x$"}, so the limit is $${answer.toLatex()}$.`,
        `乘以共轭式后，分子是 $${top}$，分母是两个根式之和，其行为像 $${2 * k}|x|$。${positive ? "这里 $|x| = x$" : "这里 $|x| = -x$"}，所以极限是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const boundedTermInRatio: KnowledgePointDef = {
  id: "a-bounded-term-inside-a-ratio-at-infinity",
  title: t("A bounded term inside a ratio at infinity", "无穷远处比值中的有界项"),
  explanation: t(
    "Sine and cosine never settle down as $x$ grows, so this limit cannot be found by substituting or by splitting into separate limits of the oscillating part. Dividing above and below by $x$ fixes it: the oscillating term becomes a bounded quantity over $x$, and the squeeze theorem sends that term to zero whatever its oscillation does.",
    "当 $x$ 增大时，正弦和余弦不会稳定下来，所以不能靠代入或单独求振荡部分的极限来解决。分子分母同除以 $x$ 就行了：振荡项变成有界量除以 $x$，无论它怎样振荡，夹逼定理都使这一项趋于零。",
  ),
  generate(rng) {
    const a = nonzero(rng, 6);
    const b = nonzero(rng, 9);
    const c = rng.int(1, 6);
    const d = nonzero(rng, 9);
    const wave = rng.pick(["\\sin x", "\\cos x"]);
    const answer = Q.of(a, c);
    const f = `\\frac{${poly([a, "x"], [b, wave])}}{${poly([c, "x"], [d, ""])}}`;
    const reduced = `\\frac{${poly([b, wave])}}{x}`;
    return numberProblem({
      prompt: t(`Find $\\lim_{x \\to \\infty} ${f}$.`, `求 $\\lim_{x \\to \\infty} ${f}$。`),
      answer,
      wrong: [Q.of(b, d), Q.of(a + b, c), Q.of(0), Q.of(a, d), answer.neg(), Q.of(b, c), answer.mul(Q.of(2))],
      solution: t(
        `Divide the top and the bottom by $x$. Since $\\left|${reduced}\\right| \\le \\frac{${Math.abs(b)}}{x}$, the squeeze theorem sends this term to $0$, and $\\frac{${d}}{x} \\to 0$ as well. What remains is $${answer.toLatex()}$.`,
        `分子分母同除以 $x$。因为 $\\left|${reduced}\\right| \\le \\frac{${Math.abs(b)}}{x}$，由夹逼定理这一项趋于 $0$，$\\frac{${d}}{x}$ 也趋于 $0$。剩下的就是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const differenceOfCosines: KnowledgePointDef = {
  id: "a-difference-of-cosines-over-x-squared",
  title: t("A difference of cosines over x squared", "余弦之差除以 x 的平方"),
  explanation: t(
    "The standard limit involves one minus a cosine, and a difference of two cosines has none in sight. Adding and subtracting one rewrites the numerator as a difference of two such expressions. Each then has its own limit over $x^{2}$, half the square of its coefficient, so the two can be taken separately and subtracted.",
    "标准极限涉及一减余弦，而两个余弦之差里看不出这种形式。加一再减一，就把分子改写成两个这样的式子之差。每个式子除以 $x^{2}$ 都有自己的极限，即系数平方的一半，所以可以分别求出再相减。",
  ),
  generate(rng) {
    const a = rng.int(1, 7);
    const b = different(rng, 1, 7, a);
    const c = rng.int(1, 4);
    const answer = Q.of(b * b - a * a, 2 * c);
    const ua = timesX(a);
    const ub = timesX(b);
    const difference = Q.of(b * b - a * a, 2).toLatex();
    const scale = c === 1 ? "" : `, and dividing by $${c}$ gives $${answer.toLatex()}$`;
    const scaleZh = c === 1 ? "" : `，再除以 $${c}$ 得 $${answer.toLatex()}$`;
    return numberProblem({
      prompt: t(
        `Find $\\lim_{x \\to 0} \\frac{\\cos ${ua} - \\cos ${ub}}{${poly([c, "x^2"])}}$.`,
        `求 $\\lim_{x \\to 0} \\frac{\\cos ${ua} - \\cos ${ub}}{${poly([c, "x^2"])}}$。`,
      ),
      answer,
      wrong: [Q.of(a * a - b * b, 2 * c), Q.of(b * b - a * a, c), Q.of(b - a, 2 * c), Q.of((b - a) ** 2, 2 * c)],
      solution: t(
        `The numerator equals $(1 - \\cos ${ub}) - (1 - \\cos ${ua})$. Over $x^2$ these tend to $${Q.of(b * b, 2).toLatex()}$ and $${Q.of(a * a, 2).toLatex()}$, whose difference is $${difference}$${scale}.`,
        `分子等于 $(1 - \\cos ${ub}) - (1 - \\cos ${ua})$。除以 $x^2$ 后，它们分别趋于 $${Q.of(b * b, 2).toLatex()}$ 和 $${Q.of(a * a, 2).toLatex()}$，二者之差是 $${difference}$${scaleZh}。`,
      ),
    });
  },
};

const ratioOfExponentialDifferences: KnowledgePointDef = {
  id: "a-ratio-of-two-exponential-differences",
  title: t("A ratio of two exponential differences", "两个指数差之比"),
  explanation: t(
    "Both the numerator and the denominator tend to zero, and neither has the form $e^{u} - 1$ on its own. Subtracting and adding one splits each into two familiar pieces. Dividing above and below by $x$ then turns each piece into a standard limit equal to its exponent's coefficient, so only those coefficients decide the value.",
    "分子和分母都趋于零，而且都不是 $e^{u} - 1$ 的形式。减一再加一，把每一个拆成两个熟悉的部分。分子分母同除以 $x$ 后，每一部分都变成标准极限，其值等于指数的系数，所以结果只取决于这些系数。",
  ),
  generate(rng) {
    const a = nonzero(rng, 5);
    const b = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].filter((x) => x !== a));
    const c = nonzero(rng, 5);
    const d = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].filter((x) => x !== c && !(c === a && x === b)));
    const answer = Q.of(a - b, c - d);
    const e = (m: number) => `e^{${timesX(m)}}`;
    const f = `\\frac{${e(a)} - ${e(b)}}{${e(c)} - ${e(d)}}`;
    return numberProblem({
      prompt: t(`Find $\\lim_{x \\to 0} ${f}$.`, `求 $\\lim_{x \\to 0} ${f}$。`),
      answer,
      wrong: [
        Q.of(c - d, a - b),
        Q.of(a, c),
        Q.of(b - a, c - d),
        Q.of(a - b),
        Q.of(b, d),
        Q.of(2 * (a - b), c - d),
        Q.of(a * d, b * c),
        Q.of(3 * (a - b), c - d),
      ],
      solution: t(
        `Since $\\frac{e^{mx} - 1}{x} \\to m$, the top over $x$ tends to $${poly([a, ""], [-b, ""])} = ${a - b}$ and the bottom over $x$ to $${poly([c, ""], [-d, ""])} = ${c - d}$. The limit is their ratio, $${answer.toLatex()}$.`,
        `由于 $\\frac{e^{mx} - 1}{x} \\to m$，分子除以 $x$ 趋于 $${poly([a, ""], [-b, ""])} = ${a - b}$，分母除以 $x$ 趋于 $${poly([c, ""], [-d, ""])} = ${c - d}$。极限是二者之比 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const differentiableJoin: KnowledgePointDef = {
  id: "constants-that-make-a-join-differentiable",
  title: t("Constants that make a join differentiable", "使连接处可导的常数"),
  explanation: t(
    "Two pieces join smoothly only if two things hold at the break point. The values must agree, because a differentiable function is continuous, and the one-sided slopes must agree, so that there is no corner. With a line as one piece, the slope condition fixes its slope, and the value condition then fixes its intercept.",
    "两段要光滑连接，分段点处必须同时满足两件事。函数值必须相等，因为可导函数一定连续；单侧斜率也必须相等，这样才没有尖角。当其中一段是直线时，斜率条件确定它的斜率，然后函数值条件确定它的截距。",
  ),
  generate(rng) {
    const c = nonzero(rng, 4);
    const a = nonzero(rng, 3);
    const p = nonzero(rng, 9);
    const q = nonzero(rng, 9);
    const m = 2 * a * c + p;
    const value = a * c * c + p * c + q;
    const answer = value - m * c;
    const f = `\\begin{cases} ${poly([a, "x^2"], [p, "x"], [q, ""])} & x \\le ${c} \\\\ mx + n & x > ${c} \\end{cases}`;
    return numberProblem({
      prompt: t(
        `Let $f(x) = ${f}$. The constants $m$ and $n$ are chosen so that $f$ is differentiable at $x = ${c}$. Find $n$.`,
        `设 $f(x) = ${f}$。选取常数 $m$ 和 $n$，使 $f$ 在 $x = ${c}$ 处可导。求 $n$。`,
      ),
      answer,
      form: "integer",
      wrong: [value, m, value + m * c, q, answer + c, answer + 2 * c, answer - 2 * c],
      solution: t(
        `The slopes must agree, so $m$ equals the derivative of the first piece at $x = ${c}$, which is $${m}$. The values must agree, so $${m} \\cdot ${inParens(c)} + n = ${value}$, which gives $n = ${answer}$.`,
        `斜率必须相等，所以 $m$ 等于第一段在 $x = ${c}$ 处的导数，即 $${m}$。函数值必须相等，所以 $${m} \\cdot ${inParens(c)} + n = ${value}$，得 $n = ${answer}$。`,
      ),
    });
  },
};

const leastSlopeOnCubic: KnowledgePointDef = {
  id: "the-extreme-slope-on-a-cubic",
  title: t("The extreme slope on a cubic", "三次曲线上斜率的最值"),
  explanation: t(
    "The slope of a cubic at each point is given by its derivative, which is a quadratic in $x$. So the slope itself has an extreme value, at the vertex of that parabola: a least slope when the cubic's leading coefficient is positive and a greatest slope when it is negative. No tangent line on the curve can go beyond it.",
    "三次曲线在每一点的斜率由它的导数给出，而导数是 $x$ 的二次式。所以斜率本身有最值，出现在这条抛物线的顶点处：三次项系数为正时是最小斜率，为负时是最大斜率。曲线上任何切线的斜率都不会超过这个界限。",
  ),
  generate(rng) {
    const a = nonzero(rng, 3);
    const k = nonzero(rng, 4);
    const c = nonzero(rng, 9);
    const d = nonzero(rng, 9);
    const answer = c - 3 * a * k * k;
    const y = poly([a, "x^3"], [3 * a * k, "x^2"], [c, "x"], [d, ""]);
    const slope = poly([3 * a, "x^2"], [6 * a * k, "x"], [c, ""]);
    const least = a > 0;
    return numberProblem({
      prompt: t(
        `Find the ${least ? "least" : "greatest"} possible slope of a tangent line to $y = ${y}$.`,
        `求 $y = ${y}$ 的切线斜率的${least ? "最小" : "最大"}值。`,
      ),
      answer,
      form: "integer",
      wrong: [-k, c, c + 3 * a * k * k, c - 6 * a * k * k],
      solution: t(
        `The slope is $y' = ${slope}$, a parabola with its vertex at $x = ${-k}$. There the slope is $${answer}$.`,
        `斜率是 $y' = ${slope}$，这条抛物线的顶点在 $x = ${-k}$。此处的斜率是 $${answer}$。`,
      ),
    });
  },
};

const arctanOfPowerAtPoint: KnowledgePointDef = {
  id: "an-arctangent-of-a-power-at-a-point",
  title: t("An arctangent of a power at a point", "幂函数的反正切在一点的导数"),
  explanation: t(
    "The derivative of arctangent is one over one plus the square of its argument, and the chain rule multiplies that by the derivative of the argument. When the argument is a power of $x$, the two factors pull in different directions, since the numerator grows like one power and the denominator like a much higher one, so both must be computed at the point.",
    "反正切的导数是一除以一加自变量的平方，链式法则再乘以内层函数的导数。当内层是 $x$ 的幂时，两个因子的作用方向不同，分子按较低的幂增长，分母按高得多的幂增长，所以两者都要在该点算出来。",
  ),
  generate(rng) {
    const big = rng.int(1, 6);
    const b = rng.int(1, 3);
    const n = rng.pick([2, 3]);
    const c = rng.pick([-2, -1, 1, 2]);
    const inner = b * c ** n;
    const slope = b * n * c ** (n - 1);
    const top = big * slope;
    const bottom = 1 + inner * inner;
    const answer = Q.of(top, bottom);
    const f = poly([big, `\\arctan\\left(${poly([b, `x^{${n}}`])}\\right)`]);
    return numberProblem({
      prompt: t(`Let $f(x) = ${f}$. Find $f'(${c})$.`, `设 $f(x) = ${f}$。求 $f'(${c})$。`),
      answer,
      wrong: [Q.of(big, bottom), Q.of(top), Q.of(top, 1 + Math.abs(inner)), Q.of(-top, bottom)],
      solution: t(
        `By the chain rule, $f'(x)$ is $${big}$ times the derivative of the inside, over $1$ plus the inside squared. At $x = ${c}$ the inside is $${inner}$ and its derivative is $${slope}$, so $f'(${c}) = \\frac{${big} \\cdot ${inParens(slope)}}{1 + ${inner * inner}} = ${answer.toLatex()}$.`,
        `由链式法则，$f'(x)$ 等于 $${big}$ 乘以内层的导数，再除以 $1$ 加内层的平方。在 $x = ${c}$ 处，内层是 $${inner}$，它的导数是 $${slope}$，所以 $f'(${c}) = \\frac{${big} \\cdot ${inParens(slope)}}{1 + ${inner * inner}} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const logOfTrig: KnowledgePointDef = {
  id: "a-logarithm-of-a-trigonometric-function-at-a-point",
  title: t("A logarithm of a trigonometric function at a point", "三角函数的对数在一点的导数"),
  explanation: t(
    "The rule for a logarithm divides the derivative of the inside by the inside, and a trigonometric inside then simplifies. The derivative of $\\ln(\\sin u)$ with respect to $u$ becomes a cotangent, and that of $\\ln(\\cos u)$ becomes a negative tangent. The chain rule still multiplies by the derivative of the angle, a step that is easy to forget.",
    "对数的求导法则是内层的导数除以内层，而内层是三角函数时还能进一步化简。$\\ln(\\sin u)$ 对 $u$ 的导数化为余切，$\\ln(\\cos u)$ 对 $u$ 的导数化为负的正切。链式法则还要再乘以角的导数，这一步很容易漏掉。",
  ),
  generate(rng) {
    const big = nonzero(rng, 6);
    const b = rng.int(1, 6);
    const [name, factor] = rng.pick([
      ["\\sin", 1],
      ["\\cos", -1],
      ["\\tan", 2],
    ] as const);
    const answer = big * b * factor;
    const u = timesX(b);
    const f = poly([big, `\\ln\\left(${name} ${u}\\right)`]);
    const at = `\\frac{\\pi}{${4 * b}}`;
    const rate = factor === 1 ? `\\cot ${u}` : factor === -1 ? `\\left(-\\tan ${u}\\right)` : `\\frac{\\sec^{2} ${u}}{\\tan ${u}}`;
    return numberProblem({
      prompt: t(`Let $f(x) = ${f}$. Find $f'\\left(${at}\\right)$.`, `设 $f(x) = ${f}$。求 $f'\\left(${at}\\right)$。`),
      answer,
      form: "integer",
      wrong: [-answer, 2 * answer, big * factor, 3 * answer],
      solution: t(
        `$f'(x) = ${big * b} \\cdot ${rate}$. At $x = ${at}$ the angle $${u}$ is $\\frac{\\pi}{4}$, where this last factor equals $${factor}$, so the derivative is $${answer}$.`,
        `$f'(x) = ${big * b} \\cdot ${rate}$。在 $x = ${at}$ 处，角 $${u}$ 等于 $\\frac{\\pi}{4}$，此时最后这个因子等于 $${factor}$，所以导数是 $${answer}$。`,
      ),
    });
  },
};

const powerOfTrigOfMultiple: KnowledgePointDef = {
  id: "a-power-of-a-trigonometric-function-of-a-multiple",
  title: t("A power of a trigonometric function of a multiple", "倍角三角函数的幂"),
  explanation: t(
    "A function such as $\\tan^{2}(bx)$ has three layers: the square, the tangent and the multiple of $x$. The chain rule produces one factor for each layer, working from the outside in. Evaluating at a point where the angle is $\\frac{\\pi}{4}$ keeps the values simple and shows clearly whether a factor from any layer was dropped.",
    "$\\tan^{2}(bx)$ 这样的函数有三层：平方、正切和 $x$ 的倍数。链式法则由外向内为每一层产生一个因子。在角等于 $\\frac{\\pi}{4}$ 的点求值，数值简单，也能清楚地看出是否漏掉了某一层的因子。",
  ),
  generate(rng) {
    const big = nonzero(rng, 6);
    const b = rng.int(1, 6);
    const [outer, factor, steps] = rng.pick([
      ["\\tan^{2}", 4, "2\\tan u \\sec^{2} u = 2 \\cdot 1 \\cdot 2"],
      ["\\sec^{2}", 4, "2\\sec^{2} u \\tan u = 2 \\cdot 2 \\cdot 1"],
      ["\\sin^{2}", 1, "2\\sin u \\cos u = \\sin 2u = 1"],
      ["\\cos^{2}", -1, "-2\\cos u \\sin u = -\\sin 2u = -1"],
      ["\\tan^{3}", 6, "3\\tan^{2} u \\sec^{2} u = 3 \\cdot 1 \\cdot 2"],
    ] as const);
    const answer = big * b * factor;
    const u = timesX(b);
    const f = poly([big, `${outer}(${u})`]);
    const at = `\\frac{\\pi}{${4 * b}}`;
    return numberProblem({
      prompt: t(`Let $f(x) = ${f}$. Find $f'\\left(${at}\\right)$.`, `设 $f(x) = ${f}$。求 $f'\\left(${at}\\right)$。`),
      answer,
      form: "integer",
      wrong: [big * factor, 2 * answer, -answer, big * b, 3 * answer],
      solution: t(
        `Let $u = ${u}$, so $u = \\frac{\\pi}{4}$ at this point. The derivative of the function of $u$ is $${steps}$ there, without the constant. Multiplying by $${big}$ and by $\\frac{du}{dx} = ${b}$ gives $${answer}$.`,
        `令 $u = ${u}$，此时 $u = \\frac{\\pi}{4}$。不计常数时，关于 $u$ 的导数在此处是 $${steps}$。再乘以 $${big}$ 和 $\\frac{du}{dx} = ${b}$，得 $${answer}$。`,
      ),
    });
  },
};

const secondDerivativeFromDxDy: KnowledgePointDef = {
  id: "the-second-derivative-when-x-is-a-function-of-y",
  title: t("The second derivative when x is a function of y", "x 是 y 的函数时的二阶导数"),
  explanation: t(
    "When $x$ is given in terms of $y$, the first derivative is the reciprocal $\\frac{dy}{dx} = \\frac{1}{x'(y)}$. Differentiating again with respect to $x$ needs care, because this expression is a function of $y$: the chain rule contributes one more factor of $\\frac{dy}{dx}$. It is not the reciprocal of the second derivative of $x$.",
    "当 $x$ 用 $y$ 表示时，一阶导数是倒数 $\\frac{dy}{dx} = \\frac{1}{x'(y)}$。再对 $x$ 求导时要小心，因为这个式子是 $y$ 的函数：链式法则还要多乘一个因子 $\\frac{dy}{dx}$。它并不是 $x$ 的二阶导数的倒数。",
  ),
  generate(rng) {
    const a = rng.int(1, 2);
    const p = rng.int(1, 5);
    const c = rng.pick([-2, -1, 1, 2]);
    const q = nonzero(rng, 5);
    const first = 3 * a * c * c + p;
    const second = 6 * a * c;
    const x0 = a * c ** 3 + p * c + q;
    const answer = Q.of(-second, first ** 3);
    const curve = poly([a, "y^3"], [p, "y"], [q, ""]);
    return numberProblem({
      prompt: t(
        `The point $(${x0}, ${c})$ lies on the curve $x = ${curve}$. Find $\\frac{d^{2}y}{dx^{2}}$ at this point.`,
        `点 $(${x0}, ${c})$ 在曲线 $x = ${curve}$ 上。求此点处的 $\\frac{d^{2}y}{dx^{2}}$。`,
      ),
      answer,
      wrong: [Q.of(second, first ** 3), Q.of(-second, first * first), Q.of(1, second), Q.of(1, first)],
      solution: t(
        `$\\frac{dy}{dx} = \\frac{1}{x'(y)}$. Differentiating with respect to $x$ gives $\\frac{d^{2}y}{dx^{2}} = -\\frac{x''(y)}{x'(y)^{2}} \\cdot \\frac{dy}{dx} = -\\frac{x''(y)}{x'(y)^{3}}$. At $y = ${c}$, $x' = ${first}$ and $x'' = ${second}$, so the value is $${answer.toLatex()}$.`,
        `$\\frac{dy}{dx} = \\frac{1}{x'(y)}$。对 $x$ 求导得 $\\frac{d^{2}y}{dx^{2}} = -\\frac{x''(y)}{x'(y)^{2}} \\cdot \\frac{dy}{dx} = -\\frac{x''(y)}{x'(y)^{3}}$。在 $y = ${c}$ 处，$x' = ${first}$，$x'' = ${second}$，所以值是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const squareFromDiagonal: KnowledgePointDef = {
  id: "the-area-of-a-square-from-its-diagonal",
  title: t("The area of a square from its diagonal", "由对角线求正方形的面积"),
  explanation: t(
    "A related-rates problem is easiest when the quantities are linked directly. The side of a square is the diagonal divided by the square root of two, and squaring removes that root, so the area is half the square of the diagonal. Differentiating this relation with respect to time links the two rates without ever computing the side.",
    "相关变化率问题中，把两个量直接联系起来最省事。正方形的边长等于对角线除以根号二，平方后根号消失，所以面积等于对角线平方的一半。对这个关系关于时间求导，就把两个变化率联系起来，完全不必算出边长。",
  ),
  generate(rng) {
    const d = rng.int(2, 20);
    const rate = rng.int(1, 9);
    const findArea = rng.pick([true, false]);
    if (findArea) {
      const answer = d * rate;
      return numberProblem({
        prompt: t(
          `The diagonal of a square grows at $${rate}$ cm/s. Find the rate of change of its area, in cm²/s, when the diagonal is $${d}$ cm.`,
          `正方形的对角线以 $${rate}$ cm/s 的速度增长。求对角线为 $${d}$ cm 时其面积的变化率，单位为 cm²/s。`,
        ),
        answer,
        wrong: [2 * answer, Q.of(answer, 2), 4 * answer],
        solution: t(
          `The area is $A = \\frac{1}{2}D^{2}$, so $\\frac{dA}{dt} = D\\frac{dD}{dt} = ${d} \\cdot ${rate} = ${answer}$.`,
          `面积是 $A = \\frac{1}{2}D^{2}$，所以 $\\frac{dA}{dt} = D\\frac{dD}{dt} = ${d} \\cdot ${rate} = ${answer}$。`,
        ),
      });
    }
    const answer = Q.of(rate, d);
    return numberProblem({
      prompt: t(
        `The area of a square grows at $${rate}$ cm²/s. How fast is its diagonal growing, in cm/s, when the diagonal is $${d}$ cm?`,
        `正方形的面积以 $${rate}$ cm²/s 的速度增长。对角线为 $${d}$ cm 时，它增长的速度是多少 cm/s？`,
      ),
      answer,
      wrong: [Q.of(2 * rate, d), Q.of(rate, 2 * d), Q.of(rate * d), Q.of(rate, d * d)],
      solution: t(
        `The area is $A = \\frac{1}{2}D^{2}$, so $\\frac{dA}{dt} = D\\frac{dD}{dt}$, that is $${rate} = ${d}\\frac{dD}{dt}$, and $\\frac{dD}{dt} = ${answer.toLatex()}$.`,
        `面积是 $A = \\frac{1}{2}D^{2}$，所以 $\\frac{dA}{dt} = D\\frac{dD}{dt}$，即 $${rate} = ${d}\\frac{dD}{dt}$，得 $\\frac{dD}{dt} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const triangleWithGrowingAngle: KnowledgePointDef = {
  id: "the-area-of-a-triangle-with-a-growing-angle",
  title: t("The area of a triangle with a growing angle", "夹角增大时三角形的面积"),
  explanation: t(
    "With two sides fixed, the area of a triangle depends only on the angle between them, through one half the product of the sides times the sine of the angle. Differentiating brings in the cosine and the angle's rate. Past a right angle the cosine is negative, so the area shrinks even though the angle keeps growing.",
    "两边固定时，三角形的面积只取决于它们的夹角：面积等于两边之积的一半乘以夹角的正弦。求导时出现余弦和夹角的变化率。夹角超过直角后余弦为负，所以尽管夹角继续增大，面积却在减小。",
  ),
  generate(rng) {
    const p = rng.int(2, 12);
    const q = rng.int(2, 12);
    const n = rng.int(2, 10);
    const acute = rng.pick([true, false]);
    const s = acute ? 1 : -1;
    const angle = acute ? "\\frac{\\pi}{3}" : "\\frac{2\\pi}{3}";
    const cosine = acute ? "\\frac{1}{2}" : "-\\frac{1}{2}";
    const omega = Q.of(1, n);
    const answer = Q.of(s * p * q, 4 * n);
    return numberProblem({
      prompt: t(
        `Two sides of a triangle stay fixed at $${p}$ cm and $${q}$ cm, while the angle between them grows at $${omega.toLatex()}$ radians per second. Find the rate of change of the area, in cm²/s, when the angle is $${angle}$. Give a negative value if the area is shrinking.`,
        `三角形的两边固定为 $${p}$ cm 和 $${q}$ cm，它们的夹角以每秒 $${omega.toLatex()}$ 弧度的速度增大。求夹角为 $${angle}$ 时面积的变化率，单位为 cm²/s。若面积在减小，请给出负值。`,
      ),
      answer,
      wrong: [Q.of(-s * p * q, 4 * n), Q.of(s * p * q, 2 * n), Q.of(s * p * q, n), Q.of(p * q, 4)],
      solution: t(
        `The area is $A = \\frac{1}{2}(${p})(${q})\\sin\\theta$, so $\\frac{dA}{dt} = \\frac{1}{2}(${p})(${q})\\cos\\theta\\,\\frac{d\\theta}{dt}$. With $\\cos\\theta = ${cosine}$ this is $${answer.toLatex()}$.`,
        `面积是 $A = \\frac{1}{2}(${p})(${q})\\sin\\theta$，所以 $\\frac{dA}{dt} = \\frac{1}{2}(${p})(${q})\\cos\\theta\\,\\frac{d\\theta}{dt}$。由 $\\cos\\theta = ${cosine}$，结果是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const cornerAsCandidate: KnowledgePointDef = {
  id: "a-corner-as-a-candidate-for-the-minimum",
  title: t("A corner as a candidate for the minimum", "尖角点作为最小值的候选点"),
  explanation: t(
    "The candidates for a global extreme are not only the points where the derivative is zero and the endpoints: a point where the derivative fails to exist counts too. An absolute value creates such a corner. Treat each side of the corner as its own function, keep only stationary points that lie on their own side, and compare.",
    "全局最值的候选点不只是导数为零的点和端点：导数不存在的点同样算数。绝对值会造成这样的尖角。把尖角两侧分别看作各自的函数，只保留落在自己一侧的驻点，然后比较。",
  ),
  generate(rng) {
    const m = rng.int(2, 6);
    const c = rng.pick([-8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8]);
    const l = Math.min(c, -m) - rng.int(1, 3);
    const r = Math.max(c, m) + rng.int(1, 3);
    const f = (x: number) => x * x + 2 * m * Math.abs(x - c);
    const name = `x^2 + ${2 * m}|${poly([1, "x"], [-c, ""])}|`;
    const cornerWins = Math.abs(c) <= m;
    const at = cornerWins ? c : c > 0 ? m : -m;
    const answer = f(at);
    const en = cornerWins
      ? `To the left of $x = ${c}$, $f'(x) = 2x - ${2 * m}$, which is negative because $x < ${m}$. To the right, $f'(x) = 2x + ${2 * m}$, which is positive because $x > ${-m}$. So $f$ falls until the corner and then rises, and the minimum is at the corner, $f(${c}) = ${answer}$.`
      : c > 0
        ? `To the left of $x = ${c}$, $f'(x) = 2x - ${2 * m}$, which is zero at $x = ${m}$. To the right, $f'(x) = 2x + ${2 * m}$ is positive. So the minimum is at $x = ${m}$, before the corner, and $f(${m}) = ${answer}$.`
        : `To the right of $x = ${c}$, $f'(x) = 2x + ${2 * m}$, which is zero at $x = ${-m}$. To the left, $f'(x) = 2x - ${2 * m}$ is negative. So the minimum is at $x = ${-m}$, after the corner, and $f(${-m}) = ${answer}$.`;
    const zh = cornerWins
      ? `在 $x = ${c}$ 左侧，$f'(x) = 2x - ${2 * m}$，因为 $x < ${m}$，所以为负。在右侧，$f'(x) = 2x + ${2 * m}$，因为 $x > ${-m}$，所以为正。于是 $f$ 先降到尖角再上升，最小值在尖角处，$f(${c}) = ${answer}$。`
      : c > 0
        ? `在 $x = ${c}$ 左侧，$f'(x) = 2x - ${2 * m}$，它在 $x = ${m}$ 处为零。在右侧，$f'(x) = 2x + ${2 * m}$ 为正。所以最小值在尖角之前的 $x = ${m}$ 处，$f(${m}) = ${answer}$。`
        : `在 $x = ${c}$ 右侧，$f'(x) = 2x + ${2 * m}$，它在 $x = ${-m}$ 处为零。在左侧，$f'(x) = 2x - ${2 * m}$ 为负。所以最小值在尖角之后的 $x = ${-m}$ 处，$f(${-m}) = ${answer}$。`;
    return numberProblem({
      prompt: t(
        `Find the global minimum value of $f(x) = ${name}$ on $[${l}, ${r}]$.`,
        `求 $f(x) = ${name}$ 在 $[${l}, ${r}]$ 上的全局最小值。`,
      ),
      answer,
      form: "integer",
      wrong: [c * c, f(m), f(-m), f(l), f(r)],
      solution: t(en, zh),
    });
  },
};

const criticalPointWhereDerivativeFails: KnowledgePointDef = {
  id: "a-critical-point-where-the-derivative-does-not-exist",
  title: t("A critical point where the derivative does not exist", "导数不存在的临界点"),
  explanation: t(
    "A critical point is a point of the domain where the derivative is zero or does not exist, and the second kind is easily missed. For a fractional power, put the derivative over a common denominator. Its numerator gives the zeros, while its denominator vanishes at the origin, where the function is defined but the derivative is not.",
    "临界点是定义域内导数为零或导数不存在的点，第二类很容易被漏掉。对分数次幂，把导数通分。分子给出导数的零点，而分母在原点处为零，那里函数有定义，导数却不存在。",
  ),
  generate(rng) {
    const a = nonzero(rng, 12);
    const p = rng.pick([1, 2]);
    const answer = Q.of(p * a, p + 3);
    const power = `x^{\\frac{${p}}{3}}`;
    const factor = poly([1, "x"], [-a, ""]);
    const top = poly([p + 3, "x"], [-p * a, ""]);
    const below = p === 1 ? "3x^{\\frac{2}{3}}" : "3x^{\\frac{1}{3}}";
    return numberProblem({
      prompt: t(
        `The function $f(x) = ${power}(${factor})$ has two critical points. Find the nonzero one.`,
        `函数 $f(x) = ${power}(${factor})$ 有两个临界点。求不为零的那一个。`,
      ),
      answer,
      wrong: [Q.of(a), Q.of(p * a, 3), Q.of(a, p + 3), Q.of(-p * a, p + 3)],
      solution: t(
        `Over a common denominator, $f'(x) = \\frac{${top}}{${below}}$. The numerator is zero at $x = ${answer.toLatex()}$, and the derivative does not exist at $x = 0$, which is the other critical point.`,
        `通分后 $f'(x) = \\frac{${top}}{${below}}$。分子在 $x = ${answer.toLatex()}$ 处为零，而导数在 $x = 0$ 处不存在，那就是另一个临界点。`,
      ),
    });
  },
};

const increasingEverywhere: KnowledgePointDef = {
  id: "the-least-coefficient-that-makes-a-cubic-increasing",
  title: t("The least coefficient that makes a cubic increasing", "使三次函数递增的最小系数"),
  explanation: t(
    "A cubic with positive leading coefficient rises on the whole real line exactly when its derivative is never negative. That derivative is an upward parabola, so the condition is that its discriminant is not positive. A single point where the derivative touches zero is allowed, because the function still increases through it, so the boundary value counts.",
    "首项系数为正的三次函数在整个实数轴上递增，当且仅当它的导数从不为负。这个导数是开口向上的抛物线，所以条件是判别式不为正。导数在单独一点碰到零是允许的，因为函数经过那里时仍然递增，所以边界值也算。",
  ),
  generate(rng) {
    const a = rng.int(1, 4);
    const b = nonzero(rng, 9);
    const d = nonzero(rng, 9);
    const answer = Q.of(b * b, 3 * a);
    const f = poly([a, "x^3"], [b, "x^2"], [1, "kx"], [d, ""]);
    const derivative = poly([3 * a, "x^2"], [2 * b, "x"], [1, "k"]);
    return numberProblem({
      prompt: t(
        `Find the least value of $k$ for which $f(x) = ${f}$ is increasing on the whole real line.`,
        `求使 $f(x) = ${f}$ 在整个实数轴上递增的 $k$ 的最小值。`,
      ),
      answer,
      wrong: [Q.of(b * b, a), Q.of(b * b, 6 * a), Q.of(-b * b, 3 * a), Q.of(Math.abs(b), 3 * a)],
      solution: t(
        `$f'(x) = ${derivative}$ must never be negative, so its discriminant $${4 * b * b} - ${12 * a}k$ must not be positive. This gives $k \\ge ${answer.toLatex()}$.`,
        `$f'(x) = ${derivative}$ 必须从不为负，所以它的判别式 $${4 * b * b} - ${12 * a}k$ 不能为正。由此得 $k \\ge ${answer.toLatex()}$。`,
      ),
    });
  },
};

const cylinderInCone: KnowledgePointDef = {
  id: "the-largest-cylinder-in-a-cone",
  title: t("The largest cylinder in a cone", "圆锥内最大的圆柱"),
  explanation: t(
    "An inscribed cylinder has a radius and a height, but they are not independent: similar triangles in a vertical slice of the cone tie them together along a straight line. Writing the height in terms of the radius leaves a cubic volume function of one variable, and setting its derivative to zero locates the best radius.",
    "内接圆柱有半径和高，但二者并不独立：圆锥竖直截面中的相似三角形把它们联系在一条直线上。把高用半径表示后，体积就成为一个单变量的三次函数，令其导数为零即可确定最佳半径。",
  ),
  generate(rng) {
    const k = rng.int(1, 5);
    const j = rng.int(1, 8);
    const R = 3 * k;
    const H = 3 * j;
    const answer = 4 * k * k * j;
    return numberProblem({
      prompt: t(
        `A cylinder stands inside a cone of base radius $${R}$ and height $${H}$, with its base on the base of the cone. Its largest possible volume is $V\\pi$. Find $V$.`,
        `一个圆柱立在底面半径为 $${R}$、高为 $${H}$ 的圆锥内，底面落在圆锥的底面上。它的最大体积是 $V\\pi$。求 $V$。`,
      ),
      answer,
      form: "integer",
      wrong: [9 * k * k * j, 12 * k * k * j, 2 * k * k * j, 3 * k * k * j],
      solution: t(
        `Similar triangles give $h = ${H}\\left(1 - \\frac{r}{${R}}\\right)$, so $V(r) = \\pi r^{2} h$. Setting $V'(r) = 0$ gives $r = ${2 * k}$, two thirds of the cone's radius, and then $h = ${j}$. The volume is $\\pi (${2 * k})^{2}(${j}) = ${answer}\\pi$.`,
        `由相似三角形得 $h = ${H}\\left(1 - \\frac{r}{${R}}\\right)$，所以 $V(r) = \\pi r^{2} h$。令 $V'(r) = 0$ 得 $r = ${2 * k}$，即圆锥半径的三分之二，此时 $h = ${j}$。体积是 $\\pi (${2 * k})^{2}(${j}) = ${answer}\\pi$。`,
      ),
    });
  },
};

const canWithCostlyEnds: KnowledgePointDef = {
  id: "a-can-whose-ends-cost-more-than-its-side",
  title: t("A can whose ends cost more than its side", "两端比侧面更贵的罐子"),
  explanation: t(
    "When the materials differ in price, the quantity to minimize is the cost and not the surface area. Each area is weighted by its price before differentiating. The fixed volume still removes the height, leaving a function of the radius alone. Dearer ends push the best can to be taller and narrower than the can of least material.",
    "材料价格不同时，要最小化的是成本而不是表面积。求导之前，每部分面积都要乘以各自的单价。固定的体积仍然可以消去高，只留下半径的函数。两端越贵，最佳的罐子就比用料最少的罐子越高越细。",
  ),
  generate(rng) {
    const r = rng.int(1, 6);
    const [ends, side] = rng.pick([
      [2, 1],
      [3, 1],
      [3, 2],
      [4, 1],
      [5, 2],
      [5, 4],
      [4, 3],
    ] as const);
    const volume = Q.of(2 * ends * r ** 3, side);
    const answer = Q.of(2 * ends * r, side);
    const held = `${volume.toLatex()}\\pi`;
    const cost = `${2 * ends}\\pi r^{2} + \\frac{${volume.mul(Q.of(2 * side)).toLatex()}\\pi}{r}`;
    return numberProblem({
      prompt: t(
        `A closed cylindrical can must hold $${held}$ cm³. Its top and bottom cost $${ends}$ cents per cm², and its side costs $${side}$ ${side === 1 ? "cent" : "cents"} per cm². Find the height, in cm, of the cheapest can.`,
        `一个有盖的圆柱形罐子必须容纳 $${held}$ cm³。顶和底的成本是每 cm² $${ends}$ 分，侧面的成本是每 cm² $${side}$ 分。求最便宜的罐子的高，单位为 cm。`,
      ),
      answer,
      wrong: [Q.of(2 * r), Q.of(r), Q.of(2 * side * r, ends), Q.of(ends * r, side), Q.of(4 * ends * r, side)],
      solution: t(
        `Removing the height with the volume, the cost is $C(r) = ${cost}$ in cents. Setting $C'(r) = 0$ gives $r = ${r}$, and the volume then gives $h = ${answer.toLatex()}$.`,
        `用体积消去高，成本（单位：分）是 $C(r) = ${cost}$。令 $C'(r) = 0$ 得 $r = ${r}$，再由体积得 $h = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const cableAcrossRiver: KnowledgePointDef = {
  id: "the-cheapest-cable-across-a-river",
  title: t("The cheapest cable across a river", "过河电缆的最低成本路线"),
  explanation: t(
    "A cable that crosses water at a high price and then runs along the bank at a low price should not take the shortest path, nor should it cross straight over. Its cost is a root plus a linear term in the landing point. At the best landing point the two rates balance, and that point does not depend on how far the destination is.",
    "电缆在水下成本高、沿岸成本低时，既不该走最短路线，也不该笔直过河。总成本是着陆点的一个根式加一个一次项。在最佳着陆点，两种变化率相互平衡，而这个点与目的地有多远无关。",
  ),
  generate(rng) {
    const [water, land, across, along] = rng.pick([
      [5, 3, 4, 3],
      [5, 4, 3, 4],
      [13, 5, 12, 5],
      [13, 12, 5, 12],
      [17, 8, 15, 8],
      [17, 15, 8, 15],
    ] as const);
    const k = rng.int(1, 5);
    const width = across * k;
    const answer = along * k;
    const total = answer + rng.int(1, 20);
    return numberProblem({
      prompt: t(
        `A cable must run from a point on one bank of a straight river $${width}$ m wide to a point on the other bank, $${total}$ m downstream of the point directly opposite. Cable costs $${water}$ dollars per metre under water and $${land}$ dollars per metre along the far bank. How far downstream of the point directly opposite, in metres, should the cable land to cost the least?`,
        `一条电缆要从笔直河流一岸的某点铺到对岸一点，河宽 $${width}$ m，终点在正对岸点的下游 $${total}$ m 处。电缆水下每米 $${water}$ 美元，沿对岸每米 $${land}$ 美元。为使成本最低，电缆应在正对岸点下游多少米处上岸？`,
      ),
      answer,
      wrong: [Q.of(width), Q.of(total), Q.of(width * across, along), Q.of(width * land, water)],
      solution: t(
        `Landing $x$ m downstream costs $C(x) = ${water}\\sqrt{${width * width} + x^{2}} + ${land}(${total} - x)$. Setting $C'(x) = 0$ gives $${water}x = ${land}\\sqrt{${width * width} + x^{2}}$. Squaring and solving for positive $x$ gives $x = ${answer}$, which is within the $${total}$ m available.`,
        `在下游 $x$ m 处上岸的成本是 $C(x) = ${water}\\sqrt{${width * width} + x^{2}} + ${land}(${total} - x)$。令 $C'(x) = 0$ 得 $${water}x = ${land}\\sqrt{${width * width} + x^{2}}$。两边平方并取正解，得 $x = ${answer}$，它在 $${total}$ m 的范围之内。`,
      ),
    });
  },
};

const greatestSpeed: KnowledgePointDef = {
  id: "the-greatest-speed-over-a-time-interval",
  title: t("The greatest speed over a time interval", "一段时间内的最大速率"),
  explanation: t(
    "Speed is the absolute value of velocity, so its greatest value need not be where velocity is greatest. The candidates are the endpoints and the moment when acceleration is zero, where velocity reaches an extreme. A velocity that dips far below zero can produce the highest speed of all, so compare absolute values and not signed ones.",
    "速率是速度的绝对值，所以它的最大值不一定出现在速度最大的时刻。候选点是两个端点，以及加速度为零的时刻，那时速度达到极值。速度如果向下深入零以下，可能产生全程最高的速率，所以要比较绝对值，而不是带符号的值。",
  ),
  generate(rng) {
    const t0 = rng.int(1, 4);
    const end = t0 + rng.int(1, 4);
    const q = rng.int(1, 20);
    const r = rng.int(1, 9);
    const v = (x: number) => 3 * x * x - 6 * t0 * x + q;
    const answer = Math.max(Math.abs(v(0)), Math.abs(v(t0)), Math.abs(v(end)));
    const s = poly([1, "t^3"], [-3 * t0, "t^2"], [q, "t"], [r, ""]);
    return numberProblem({
      prompt: t(
        `A particle moves along a line with position $s(t) = ${s}$ metres after $t$ seconds. Find its greatest speed, in m/s, for $0 \\le t \\le ${end}$.`,
        `一个质点沿直线运动，$t$ 秒后的位置是 $s(t) = ${s}$ 米。求 $0 \\le t \\le ${end}$ 时它的最大速率，单位为 m/s。`,
      ),
      answer,
      form: "integer",
      wrong: [v(0), v(t0), v(end), q + 3 * t0 * t0, 6 * (end - t0), answer + 6 * t0, 2 * answer, 3 * answer],
      solution: t(
        `$v(t) = ${poly([3, "t^2"], [-6 * t0, "t"], [q, ""])}$, and $v'(t) = 0$ at $t = ${t0}$. Then $v(0) = ${v(0)}$, $v(${t0}) = ${v(t0)}$ and $v(${end}) = ${v(end)}$. The greatest absolute value is $${answer}$.`,
        `$v(t) = ${poly([3, "t^2"], [-6 * t0, "t"], [q, ""])}$，且 $v'(t) = 0$ 在 $t = ${t0}$ 处。于是 $v(0) = ${v(0)}$，$v(${t0}) = ${v(t0)}$，$v(${end}) = ${v(end)}$。绝对值最大的是 $${answer}$。`,
      ),
    });
  },
};

const overlappingIntervals: KnowledgePointDef = {
  id: "integrals-on-overlapping-intervals",
  title: t("Integrals on overlapping intervals", "重叠区间上的积分"),
  explanation: t(
    "Additivity lets integrals on adjacent intervals be added. When two given intervals overlap, adding them counts the shared part twice. So the integral over the whole span is the sum of the two integrals minus the integral over the overlap. A number line sketch with the four endpoints in order makes the bookkeeping clear.",
    "积分的可加性允许把相邻区间上的积分相加。当两个已知区间有重叠时，直接相加会把公共部分算两次。所以整个范围上的积分等于两个积分之和减去重叠部分上的积分。在数轴上按顺序标出四个端点，就能把这笔账算清楚。",
  ),
  generate(rng) {
    const a = rng.int(-6, 0);
    const b = a + rng.int(1, 3);
    const c = b + rng.int(1, 3);
    const d = c + rng.int(1, 3);
    const p = nonzero(rng, 12);
    const q = nonzero(rng, 12);
    const r = nonzero(rng, 12);
    const answer = p + q - r;
    const int = (lo: number, hi: number) => `\\int_{${lo}}^{${hi}} f(x) \\, dx`;
    const given = `${int(a, c)} = ${p}$, $${int(b, d)} = ${q}$ and $${int(b, c)} = ${r}`;
    const givenZh = `${int(a, c)} = ${p}$，$${int(b, d)} = ${q}$，$${int(b, c)} = ${r}`;
    return numberProblem({
      prompt: t(`Given $${given}$, find $${int(a, d)}$.`, `已知 $${givenZh}$，求 $${int(a, d)}$。`),
      answer,
      form: "integer",
      wrong: [p + q, p + q + r, p - r, q - r, p + q - 2 * r],
      solution: t(
        `The intervals $[${a}, ${c}]$ and $[${b}, ${d}]$ together cover $[${a}, ${d}]$, and both contain $[${b}, ${c}]$. So the value is $${poly([p, ""], [q, ""], [-r, ""])} = ${answer}$.`,
        `区间 $[${a}, ${c}]$ 和 $[${b}, ${d}]$ 合起来覆盖 $[${a}, ${d}]$，而且都包含 $[${b}, ${c}]$。所以值是 $${poly([p, ""], [q, ""], [-r, ""])} = ${answer}$。`,
      ),
    });
  },
};

const absoluteValueOfQuadratic: KnowledgePointDef = {
  id: "the-integral-of-the-absolute-value-of-a-quadratic",
  title: t("The integral of the absolute value of a quadratic", "二次函数绝对值的积分"),
  explanation: t(
    "An absolute value is a piecewise function in disguise, with its breaks where the inside changes sign. For a quadratic those are its roots. Split the interval at any root inside it, flip the sign on the part where the quadratic is negative, and integrate each piece separately. Integrating without splitting would let the negative part cancel some of the area.",
    "绝对值其实是分段函数，分段点就在内部变号的地方。对二次函数来说，这些点就是它的根。在区间内的根处把区间分开，在二次函数为负的部分改变符号，再分别积分。不分段直接积分，负的部分就会抵消一部分面积。",
  ),
  generate(rng) {
    const a = rng.int(1, 6);
    const b = a + rng.int(1, 5);
    const c = rng.int(1, 3);
    const first = Q.of(2 * a ** 3, 3);
    const second = Q.of(b ** 3 - a ** 3, 3).sub(Q.of(a * a * (b - a)));
    const answer = first.add(second).mul(Q.of(c));
    const f = poly([c, `\\left|${poly([1, "x^2"], [-a * a, ""])}\\right|`]);
    const scale = c === 1 ? "" : ` Multiplying by $${c}$ gives $${answer.toLatex()}$.`;
    const scaleZh = c === 1 ? "" : `乘以 $${c}$ 得 $${answer.toLatex()}$。`;
    const sum = first.add(second).toLatex();
    return numberProblem({
      prompt: t(`Evaluate $\\int_{0}^{${b}} ${f} \\, dx$.`, `计算 $\\int_{0}^{${b}} ${f} \\, dx$。`),
      answer,
      wrong: [
        Q.of(b ** 3, 3)
          .sub(Q.of(a * a * b))
          .mul(Q.of(c)),
        second.mul(Q.of(c)),
        first.mul(Q.of(c)),
        first.sub(second).mul(Q.of(c)),
      ],
      solution: t(
        `$x^2 - ${a * a}$ is negative on $[0, ${a}]$ and positive on $[${a}, ${b}]$. So $\\int_{0}^{${b}} |x^2 - ${a * a}| \\, dx = \\int_{0}^{${a}} (${a * a} - x^2) \\, dx + \\int_{${a}}^{${b}} (x^2 - ${a * a}) \\, dx = ${first.toLatex()} + ${second.toLatex()} = ${sum}$.${scale}`,
        `$x^2 - ${a * a}$ 在 $[0, ${a}]$ 上为负，在 $[${a}, ${b}]$ 上为正。所以 $\\int_{0}^{${b}} |x^2 - ${a * a}| \\, dx = \\int_{0}^{${a}} (${a * a} - x^2) \\, dx + \\int_{${a}}^{${b}} (x^2 - ${a * a}) \\, dx = ${first.toLatex()} + ${second.toLatex()} = ${sum}$。${scaleZh}`,
      ),
    });
  },
};

const dropBetweenExtremes: KnowledgePointDef = {
  id: "the-drop-between-extremes-of-an-accumulation-function",
  title: t("The drop between extremes of an accumulation function", "累积函数两个极值之间的落差"),
  explanation: t(
    "An accumulation function has its integrand as its derivative, so its local extrema lie at the integrand's sign changes. The change between two such points is simply the integral of the integrand between them. The lower limit of the accumulation function shifts every value by the same amount and therefore plays no part in that difference.",
    "累积函数的导数就是被积函数，所以它的局部极值出现在被积函数变号的地方。这两点之间的变化量，就是被积函数在两点之间的积分。累积函数的积分下限使所有函数值平移相同的量，因此对这个差没有影响。",
  ),
  generate(rng) {
    const p = rng.int(-6, 5);
    const q = p + rng.int(1, 6);
    const c = rng.int(1, 3);
    const k = rng.int(-3, 3);
    const gap = q - p;
    const answer = Q.of(c * gap ** 3, 6);
    const integrand = poly([c, "t^2"], [-c * (p + q), "t"], [c * p * q, ""]);
    return numberProblem({
      prompt: t(
        `Let $g(x) = \\int_{${k}}^{x} (${integrand}) \\, dt$. Find the local maximum value of $g$ minus its local minimum value.`,
        `设 $g(x) = \\int_{${k}}^{x} (${integrand}) \\, dt$。求 $g$ 的极大值减去极小值的差。`,
      ),
      answer,
      wrong: [answer.neg(), Q.of(c * gap ** 3, 3), Q.of(c * gap * gap, 2), Q.of(gap ** 3, 6), Q.of(c * gap ** 3)],
      solution: t(
        `$g'(x)$ is the integrand, which is positive, then negative, then positive, with zeros at $x = ${p}$ and $x = ${q}$. So $g(${p})$ is the local maximum and $g(${q})$ the local minimum. Their difference is minus the integral of the integrand from $${p}$ to $${q}$, which is $${answer.toLatex()}$.`,
        `$g'(x)$ 就是被积函数，它先正、后负、再正，零点是 $x = ${p}$ 和 $x = ${q}$。所以 $g(${p})$ 是极大值，$g(${q})$ 是极小值。二者之差等于被积函数从 $${p}$ 到 $${q}$ 的积分的相反数，即 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const limitOfSumValue: KnowledgePointDef = {
  id: "the-value-of-a-limit-of-a-sum",
  title: t("The value of a limit of a sum", "和式极限的值"),
  explanation: t(
    "A limit of right Riemann sums can be computed without any summation formula, by recognizing the integral it defines. The factor multiplying the bracket is the width of a subinterval, whose numerator gives the length of the interval. The constant in the bracket is its left endpoint, and the bracket itself is the variable of integration.",
    "右黎曼和的极限不用求和公式也能算出，只要认出它定义的积分。括号外的因子是子区间的宽度，其分子给出区间的长度。括号里的常数是区间的左端点，整个括号就是积分变量。",
  ),
  generate(rng) {
    const a = rng.int(1, 5);
    const b = rng.int(1, 6);
    const k = rng.pick([2, 3]);
    const top = a + b;
    const value = Q.of(top ** (k + 1) - a ** (k + 1), k + 1);
    const step = b === 1 ? "\\frac{i}{n}" : `\\frac{${b}i}{n}`;
    const sum = `\\lim_{n \\to \\infty} \\sum_{i = 1}^{n} \\left(${a} + ${step}\\right)^{${k}} \\cdot \\frac{${b}}{n}`;
    const integral = `\\int_{${a}}^{${top}} x^{${k}} \\, dx`;
    return numberProblem({
      prompt: t(`Find $${sum}$.`, `求 $${sum}$。`),
      answer: value,
      wrong: [Q.of(b ** (k + 1), k + 1), value.div(Q.of(b)), Q.of(top ** (k + 1) - a ** (k + 1)), Q.of(top ** k - a ** k, k)],
      solution: t(
        `The sum is a right Riemann sum for $x^{${k}}$ on an interval of length $${b}$ starting at $${a}$, so the limit is $${integral} = ${value.toLatex()}$.`,
        `这个和是 $x^{${k}}$ 在从 $${a}$ 开始、长度为 $${b}$ 的区间上的右黎曼和，所以极限是 $${integral} = ${value.toLatex()}$。`,
      ),
    });
  },
};

const enclosedByYAxis: KnowledgePointDef = {
  id: "a-region-enclosed-by-a-curve-and-the-y-axis",
  title: t("A region enclosed by a curve and the y-axis", "曲线与 y 轴围成的区域"),
  explanation: t(
    "When no bounding lines are given, the limits of integration must come from the curve itself: they are the values of $y$ where the curve meets the $y$-axis, the roots of $x(y) = 0$. Between those roots the curve stays on one side of the axis, so the area is the integral of the absolute value of $x$ with respect to $y$.",
    "没有给出边界直线时，积分限必须来自曲线本身：它们是曲线与 $y$ 轴相交处的 $y$ 值，即 $x(y) = 0$ 的根。在这两个根之间，曲线保持在 $y$ 轴的一侧，所以面积就是 $x$ 的绝对值对 $y$ 的积分。",
  ),
  generate(rng) {
    const p = rng.int(-5, 4);
    const gap = rng.int(1, 6);
    const q = p + gap;
    const c = rng.int(1, 3);
    const opensLeft = rng.pick([true, false]);
    const s = opensLeft ? -1 : 1;
    const answer = Q.of(c * gap ** 3, 6);
    const curve = poly([s * c, "y^2"], [-s * c * (p + q), "y"], [s * c * p * q, ""]);
    const side = opensLeft ? "right" : "left";
    const sideZh = opensLeft ? "右" : "左";
    return numberProblem({
      prompt: t(
        `Find the area of the region enclosed by the curve $x = ${curve}$ and the $y$-axis.`,
        `求曲线 $x = ${curve}$ 与 $y$ 轴围成的区域的面积。`,
      ),
      answer,
      wrong: [answer.neg(), Q.of(c * gap ** 3, 3), Q.of(c * gap * gap, 2), Q.of(gap ** 3, 6), Q.of(c * gap ** 3)],
      solution: t(
        `The curve meets the $y$-axis at $y = ${p}$ and $y = ${q}$, and between them it lies to the ${side} of the axis. Integrating $|x|$ from $${p}$ to $${q}$ gives $${answer.toLatex()}$.`,
        `曲线与 $y$ 轴相交于 $y = ${p}$ 和 $y = ${q}$，在这两点之间它位于 $y$ 轴${sideZh}侧。对 $|x|$ 从 $${p}$ 到 $${q}$ 积分，得 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const centralDifferenceError: KnowledgePointDef = {
  id: "the-error-of-a-central-difference-on-a-cubic",
  title: t("The error of a central difference on a cubic", "三次函数的中心差商误差"),
  explanation: t(
    "A central difference balances the two sides of a point, so its even-powered terms in the step cancel. For a cubic the error is therefore exactly its leading coefficient times the square of the step, and it does not depend on the point at all. Halving the step divides the error by four, which is why central differences are preferred.",
    "中心差商平衡了一点的两侧，所以步长的偶次项相互抵消。因此对三次函数，误差恰好等于最高次项系数乘以步长的平方，完全与所取的点无关。步长减半，误差就变为四分之一，这正是人们偏爱中心差商的原因。",
  ),
  generate(rng) {
    const a = nonzero(rng, 5);
    const b = nonzero(rng, 9);
    const e = nonzero(rng, 9);
    const c = nonzero(rng, 4);
    const h = rng.pick([Q.of(1, 2), Q.one, Q.of(2), Q.of(1, 4)]);
    const answer = h.mul(h).mul(Q.of(a));
    const f = poly([a, "x^3"], [b, "x"], [e, ""]);
    const forward = Q.of(3 * a * c)
      .mul(h)
      .add(answer);
    return numberProblem({
      prompt: t(
        `Let $f(x) = ${f}$. Estimate $f'(${c})$ with a central difference quotient $\\frac{f(a + h) - f(a - h)}{2h}$, using $h = ${h.toLatex()}$. Find the estimate minus the true value of $f'(${c})$.`,
        `设 $f(x) = ${f}$。用中心差商 $\\frac{f(a + h) - f(a - h)}{2h}$ 估计 $f'(${c})$，取 $h = ${h.toLatex()}$。求估计值减去 $f'(${c})$ 的真实值。`,
      ),
      answer,
      wrong: [forward, h.mul(Q.of(a)), answer.mul(Q.of(2)), Q.of(0), answer.neg()],
      solution: t(
        `Expanding, $\\frac{(a + h)^{3} - (a - h)^{3}}{2h} = 3a^{2} + h^{2}$, while the linear and constant terms are estimated exactly. So the error is $${inParens(a)} \\cdot \\left(${h.toLatex()}\\right)^{2} = ${answer.toLatex()}$.`,
        `展开得 $\\frac{(a + h)^{3} - (a - h)^{3}}{2h} = 3a^{2} + h^{2}$，而一次项和常数项的估计完全准确。所以误差是 $${inParens(a)} \\cdot \\left(${h.toLatex()}\\right)^{2} = ${answer.toLatex()}$。`,
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
  "solving-equations-containing-hyperbolic-functions": [sinhAndCoshTogether],
  "the-inverse-hyperbolic-functions": [hyperbolicOfInverse],
  "the-product-and-quotient-rules-for-limits": [quotientLimitNewDenominator],
  "limits-of-exponential-functions": [ratioOfExponentials],
  "limits-of-logarithmic-functions": [differenceOfLogarithms],
  "calculating-limits-using-trigonometric-identities": [tangentMinusSine],
  "evaluating-limits-at-infinity-of-radical-functions": [differenceOfTwoRoots],
  "the-squeeze-theorem": [boundedTermInRatio],
  "special-limits-involving-cosine": [differenceOfCosines],
  "further-limits-involving-the-exponential-function": [ratioOfExponentialDifferences],
  "continuity-and-differentiability-of-functions": [differentiableJoin],
  "calculating-the-slope-of-a-tangent-line-using-differentiation": [leastSlopeOnCubic],
  "differentiating-inverse-trigonometric-functions": [arctanOfPowerAtPoint],
  "the-chain-rule-with-logarithmic-functions": [logOfTrig],
  "the-chain-rule-with-trigonometric-functions": [powerOfTrigOfMultiple],
  "calculating-dy-dx-using-dx-dy": [secondDerivativeFromDxDy],
  "calculating-related-rates-with-squares": [squareFromDiagonal],
  "calculating-related-rates-using-trigonometry": [triangleWithGrowingAngle],
  "the-candidates-test": [cornerAsCandidate],
  "using-differentiation-to-calculate-critical-points": [criticalPointWhereDerivativeFails],
  "determining-intervals-on-which-a-function-is-increasing-or-decreasing": [increasingEverywhere],
  "optimization-problems-with-inscribed-shapes": [cylinderInCone],
  "optimization-problems-involving-cylinders": [canWithCostlyEnds],
  "optimizing-distances": [cableAcrossRiver],
  "determining-characteristics-of-moving-objects-using-differentiation": [greatestSpeed],
  "properties-of-definite-integrals-involving-the-limits-of-integration": [overlappingIntervals],
  "definite-integrals-of-piecewise-functions": [absoluteValueOfQuadratic],
  "the-integral-as-an-accumulation-function": [dropBetweenExtremes],
  "defining-definite-integrals-using-left-and-right-riemann-sums": [limitOfSumValue],
  "the-area-bounded-by-a-curve-and-the-y-axis": [enclosedByYAxis],
  "estimating-derivatives-using-a-central-difference-quotient": [centralDifferenceError],
};
