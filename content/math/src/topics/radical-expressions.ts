import type { Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { gcd, linear, num, poly, Q, simplifyRadical, surd, surdLatex } from "@ga/subject-math";

import { choiceProblem, expressionProblem, numberProblem, radicalProblem, solutionsProblem, steps } from "../problems.ts";

/** squareFree are the square-free radicands used in generated problems. */
const squareFree = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15];

/** pw writes a power of a variable: "", "x" or "x^{3}". */
const pw = (v: string, e: number) => (e === 0 ? "" : e === 1 ? v : `${v}^{${e}}`);

/** vp writes the variable part xᵃyᵇ of a monomial. */
const vp = (x: number, y = 0) => `${pw("x", x)}${pw("y", y)}`;

/** mono writes the monomial c·xᵃ·yᵇ: "3x^{2}y", "-x", "7". */
const mono = (c: number, x = 0, y = 0) => poly([c, vp(x, y)]);

/** front writes a factor in front of a root: "", "-", "3" or "2x^{2}". */
const front = (c: number, x = 0, y = 0) => (x === 0 && y === 0 ? (c === 1 ? "" : c === -1 ? "-" : String(c)) : mono(c, x, y));

/** radTerm writes c·xᵃyᵇ·√(m·xⁱyʲ), or the monomial alone when nothing is left under the root. */
function radTerm(c: number, ox: number, oy: number, m: number, ix: number, iy: number): string {
  if (m === 1 && ix === 0 && iy === 0) return mono(c, ox, oy);
  return `${front(c, ox, oy)}\\sqrt{${mono(m, ix, iy)}}`;
}

/** Extracted is √(n·xᵉ·yᶠ) written k·xᵃyᵇ·√(m·xⁱyʲ) with m square-free and i, j < 2. */
interface Extracted {
  readonly k: number;
  readonly ox: number;
  readonly oy: number;
  readonly m: number;
  readonly ix: number;
  readonly iy: number;
}

/** extract takes the perfect-square factors out of √(n·xᵉ·yᶠ). */
function extract(n: number, ex: number, ey = 0): Extracted {
  const [k, m] = simplifyRadical(n);
  return { k, ox: Math.floor(ex / 2), oy: Math.floor(ey / 2), m, ix: ex % 2, iy: ey % 2 };
}

/** written writes an extracted root, times c. */
const written = (r: Extracted, c = 1) => radTerm(c * r.k, r.ox, r.oy, r.m, r.ix, r.iy);

/** splitWork writes √(n·xᵉ·yᶠ) as the root of its largest perfect-square factor times the root of the rest. */
function splitWork(n: number, ex: number, ey = 0): string {
  const r = extract(n, ex, ey);
  const square = mono(r.k * r.k, 2 * r.ox, 2 * r.oy);
  const rest = mono(r.m, r.ix, r.iy);
  if (square === "1" || rest === "1") return written(r);
  return `\\sqrt{${square}} \\cdot \\sqrt{${rest}} = ${written(r)}`;
}

/** joinTerms writes terms as a sum, turning "+ -" into "-". */
const joinTerms = (...ts: readonly string[]) =>
  ts.map((s, i) => (i === 0 ? s : s.startsWith("-") ? ` - ${s.slice(1)}` : ` + ${s}`)).join("");

/** quotient writes (a·rest)/(b·bottom) with the coefficients reduced: "\frac{2x\sqrt{3x}}{5y}", "-\frac{x}{3}", "4\sqrt{x}". */
function quotient(a: number, rest: string, b: number, bottom: string): string {
  const g = gcd(Math.abs(a), b);
  const [p, q] = [Math.abs(a) / g, b / g];
  const sign = a < 0 ? "-" : "";
  const top = rest === "" ? String(p) : `${p === 1 ? "" : p}${rest}`;
  const den = `${q === 1 ? "" : q}${bottom}`;
  return den === "" ? `${sign}${top}` : `${sign}\\frac{${top}}{${den}}`;
}

/** sq writes a square root. */
const sq = (inside: string) => `\\sqrt{${inside}}`;

/** cb writes a cube root. */
const cb = (inside: string) => `\\sqrt[3]{${inside}}`;

/** simplifyPositive asks to simplify an expression whose variables are positive. */
const simplifyPositive = (expr: string) =>
  t(`Simplify $${expr}$. Assume all variables are positive.`, `化简 $${expr}$。假设所有变量都是正数。`);

/** coprime draws two integers in the given ranges without a common factor. */
function coprime(rng: { int(a: number, b: number): number }, a: [number, number], b: [number, number]): [number, number] {
  for (;;) {
    const p = rng.int(a[0], a[1]);
    const q = rng.int(b[0], b[1]);
    if (gcd(p, q) === 1) return [p, q];
  }
}

export const squareRootsOfAlgebraicPerfectSquares: TopicDef = {
  id: "square-roots-of-algebraic-perfect-squares",
  title: t("The Square Root of a Perfect Square With Algebraic Expressions", "代数式中完全平方的平方根"),
  summary: t(
    "Take square roots of monomials that are perfect squares, such as $\\sqrt{49x^{6}y^{2}} = 7x^{3}y$, for positive variables.",
    "对正变量，求完全平方单项式的平方根，例如 $\\sqrt{49x^{6}y^{2}} = 7x^{3}y$。",
  ),
  prerequisites: ["square-roots-and-cube-roots", "power-rules"],
  encompasses: [
    { topic: "square-roots-and-cube-roots", weight: 0.3 },
    { topic: "power-rules", weight: 0.3 },
  ],
  xp: 10,
  standards: ["CCSS.HSN.RN.A.2"],
  knowledgePoints: [
    {
      id: "square-roots-of-monomials",
      title: t("Square roots of monomials", "单项式的平方根"),
      explanation: t(
        "Since $(x^{3})^{2} = x^{6}$, the square root of $x^{6}$ is $x^{3}$: halve the exponent. For a positive $x$, $\\sqrt{x^{2n}} = x^{n}$.\n\nTake the root of the coefficient and of the variable part separately:\n\n$$\\sqrt{49x^{6}} = \\sqrt{49} \\cdot \\sqrt{x^{6}} = 7x^{3}$$\n\nCheck by squaring: $(7x^{3})^{2} = 49x^{6}$.",
        "因为 $(x^{3})^{2} = x^{6}$，所以 $x^{6}$ 的平方根是 $x^{3}$：把指数减半。当 $x$ 为正数时，$\\sqrt{x^{2n}} = x^{n}$。\n\n系数和变量部分分别开方：\n\n$$\\sqrt{49x^{6}} = \\sqrt{49} \\cdot \\sqrt{x^{6}} = 7x^{3}$$\n\n平方检验：$(7x^{3})^{2} = 49x^{6}$。",
      ),
      generate(rng) {
        const k = rng.int(1, 12);
        const a = rng.int(1, 5);
        const v = rng.pick(["x", "x", "y"] as const);
        const term = (c: number, e: number) => poly([c, pw(v, e)]);
        const inside = term(k * k, 2 * a);
        const answer = term(k, a);
        return expressionProblem({
          prompt: simplifyPositive(sq(inside)),
          answer,
          radical: true,
          positive: true,
          wrong: [term(k, 2 * a), term(k * k, a), ...(a > 1 ? [term(k, a * a)] : [])],
          solution: t(
            `Take the root of the coefficient and halve the exponent:${steps(`${sq(inside)} = ${k === 1 ? "" : `\\sqrt{${k * k}} \\cdot `}\\sqrt{${pw(v, 2 * a)}} = ${answer}`)}`,
            `系数开方，指数减半：${steps(`${sq(inside)} = ${k === 1 ? "" : `\\sqrt{${k * k}} \\cdot `}\\sqrt{${pw(v, 2 * a)}} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "square-roots-with-several-variables",
      title: t("Several variables", "多个变量"),
      explanation: t(
        "A product of squares is a square, so take the root of each factor:\n\n$$\\sqrt{36x^{4}y^{10}} = \\sqrt{36} \\cdot \\sqrt{x^{4}} \\cdot \\sqrt{y^{10}} = 6x^{2}y^{5}$$\n\nA monomial is a perfect square exactly when its coefficient is a perfect square and every exponent is even.",
        "平方的乘积还是平方，所以对每个因式分别开方：\n\n$$\\sqrt{36x^{4}y^{10}} = \\sqrt{36} \\cdot \\sqrt{x^{4}} \\cdot \\sqrt{y^{10}} = 6x^{2}y^{5}$$\n\n当且仅当系数是完全平方数并且每个指数都是偶数时，单项式是完全平方式。",
      ),
      generate(rng) {
        const k = rng.int(1, 10);
        const a = rng.int(1, 4);
        const b = rng.int(1, 4);
        const inside = mono(k * k, 2 * a, 2 * b);
        const answer = mono(k, a, b);
        return expressionProblem({
          prompt: simplifyPositive(sq(inside)),
          answer,
          radical: true,
          positive: true,
          wrong: [mono(k, 2 * a, 2 * b), mono(k * k, a, b), mono(k, a, 2 * b), mono(k, 2 * a, b)],
          solution: t(
            `Take the root of each factor:${steps(`${sq(inside)} = ${k === 1 ? "" : `\\sqrt{${k * k}} \\cdot `}\\sqrt{${pw("x", 2 * a)}} \\cdot \\sqrt{${pw("y", 2 * b)}} = ${answer}`)}`,
            `对每个因式分别开方：${steps(`${sq(inside)} = ${k === 1 ? "" : `\\sqrt{${k * k}} \\cdot `}\\sqrt{${pw("x", 2 * a)}} \\cdot \\sqrt{${pw("y", 2 * b)}} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "square-roots-of-fractions-with-variables",
      title: t("Fractions", "分式"),
      explanation: t(
        "The root of a fraction is the root of the numerator over the root of the denominator:\n\n$$\\sqrt{\\frac{25x^{4}}{9y^{2}}} = \\frac{\\sqrt{25x^{4}}}{\\sqrt{9y^{2}}} = \\frac{5x^{2}}{3y}$$\n\nTake the root of the whole denominator, its number included.",
        "分式的平方根等于分子的平方根除以分母的平方根：\n\n$$\\sqrt{\\frac{25x^{4}}{9y^{2}}} = \\frac{\\sqrt{25x^{4}}}{\\sqrt{9y^{2}}} = \\frac{5x^{2}}{3y}$$\n\n分母要整体开方，包括其中的数。",
      ),
      generate(rng) {
        const [k, m] = coprime(rng, [1, 9], [2, 9]);
        const a = rng.int(1, 4);
        const b = rng.int(0, 3);
        const inside = `\\frac{${mono(k * k, 2 * a)}}{${mono(m * m, 0, 2 * b)}}`;
        const answer = quotient(k, vp(a), m, vp(0, b));
        return expressionProblem({
          prompt: simplifyPositive(sq(inside)),
          answer,
          radical: true,
          positive: true,
          wrong: [quotient(k, vp(a), m * m, vp(0, b)), quotient(k, vp(a), m, vp(0, 2 * b)), quotient(k * k, vp(a), m * m, vp(0, b))],
          solution: t(
            `Take the root of the numerator and of the denominator:${steps(`${sq(inside)} = \\frac{${sq(mono(k * k, 2 * a))}}{${sq(mono(m * m, 0, 2 * b))}} = ${answer}`)}`,
            `分子、分母分别开方：${steps(`${sq(inside)} = \\frac{${sq(mono(k * k, 2 * a))}}{${sq(mono(m * m, 0, 2 * b))}} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
};

/** anyReal asks to simplify an expression whose variables can be any real numbers. */
const anyReal = (expr: string) =>
  t(`Simplify $${expr}$, where the variables can be any real numbers.`, `化简 $${expr}$，其中变量可以取任意实数。`);

/** absPower writes √(v^{2h}) for any real v: |v| for h = 1, v^{h} for even h. */
const absPower = (v: string, h: number) => (h === 0 ? "" : h % 2 === 1 ? `|${pw(v, h)}|` : pw(v, h));

export const squareRootsWithDomainRestrictions: TopicDef = {
  id: "square-roots-with-domain-restrictions",
  title: t("The Square Root of a Perfect Square With Domain Restrictions", "带取值范围的完全平方的平方根"),
  summary: t(
    "Use $\\sqrt{a^{2}} = |a|$ when the variables can be negative, and remove the absolute value when the domain allows it.",
    "当变量可以为负时使用 $\\sqrt{a^{2}} = |a|$，并在取值范围允许时去掉绝对值。",
  ),
  prerequisites: ["square-roots-of-algebraic-perfect-squares", "squaring-binomials"],
  encompasses: [
    { topic: "square-roots-of-algebraic-perfect-squares", weight: 0.6 },
    { topic: "absolute-value", weight: 0.3 },
    { topic: "squaring-binomials", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSN.RN.A.2"],
  knowledgePoints: [
    {
      id: "square-root-of-x-squared",
      title: t("$\\sqrt{x^{2}} = |x|$", "$\\sqrt{x^{2}} = |x|$"),
      explanation: t(
        "A square root is never negative, but $x$ can be. For $x = -5$, $\\sqrt{x^{2}} = \\sqrt{25} = 5$, which is not $x$. In general\n\n$$\\sqrt{x^{2}} = |x|$$\n\nAn even power is never negative, so it needs no absolute value: $\\sqrt{x^{4}} = x^{2}$. So $\\sqrt{9x^{2}y^{4}} = 3|x|y^{2}$.",
        "平方根永远不是负数，但 $x$ 可以是负数。当 $x = -5$ 时，$\\sqrt{x^{2}} = \\sqrt{25} = 5$，并不等于 $x$。一般地\n\n$$\\sqrt{x^{2}} = |x|$$\n\n偶次幂永远不是负数，所以不需要绝对值：$\\sqrt{x^{4}} = x^{2}$。所以 $\\sqrt{9x^{2}y^{4}} = 3|x|y^{2}$。",
      ),
      generate(rng) {
        const k = rng.int(1, 12);
        const [hx, hy] = rng.pick([
          [1, 0],
          [1, 0],
          [2, 0],
          [1, 1],
          [1, 2],
          [2, 1],
          [2, 2],
        ] as const);
        const inside = mono(k * k, 2 * hx, 2 * hy);
        const parts = `${absPower("x", hx)}${absPower("y", hy)}`;
        const answer = `${front(k)}${parts}`;
        const plain = mono(k, hx, hy);
        return expressionProblem({
          prompt: anyReal(sq(inside)),
          answer,
          radical: true,
          wrong: [plain, `${front(k * k)}${parts}`, ...(hx === 1 ? [`-${plain}`] : [])],
          solution: t(
            `${steps(`${sq(inside)} = ${answer}`)}An odd power such as $x$ can be negative, so its root needs an absolute value; an even power such as $x^{2}$ cannot.`,
            `${steps(`${sq(inside)} = ${answer}`)}像 $x$ 这样的奇次幂可能是负数，开方后要加绝对值；像 $x^{2}$ 这样的偶次幂不会是负数，不需要。`,
          ),
        });
      },
    },
    {
      id: "square-roots-of-squared-binomials",
      title: t("Squared binomials", "二项式的平方"),
      explanation: t(
        "The same holds for any expression: $\\sqrt{a^{2}} = |a|$. So\n\n$$\\sqrt{(2x - 3)^{2}} = |2x - 3| \\qquad \\sqrt{9(x + 1)^{2}} = 3|x + 1|$$\n\nThe absolute value stays around the whole binomial: $|x + 1|$ is not $|x| + 1$.",
        "对任何式子都成立：$\\sqrt{a^{2}} = |a|$。所以\n\n$$\\sqrt{(2x - 3)^{2}} = |2x - 3| \\qquad \\sqrt{9(x + 1)^{2}} = 3|x + 1|$$\n\n绝对值要包住整个二项式：$|x + 1|$ 不等于 $|x| + 1$。",
      ),
      generate(rng) {
        const scaled = rng.bool(0.4);
        const a = scaled ? 1 : rng.int(1, 4);
        let b: number;
        do b = rng.nonZero(-9, 9);
        while (gcd(a, Math.abs(b)) !== 1);
        const k = scaled ? rng.int(2, 6) : 1;
        const lin = linear(a, b);
        const inside = scaled ? `${k * k}(${lin})^{2}` : `(${lin})^{2}`;
        const answer = `${front(k)}|${lin}|`;
        return expressionProblem({
          prompt: anyReal(sq(inside)),
          answer,
          radical: true,
          wrong: [
            linear(k * a, k * b),
            `${front(k)}|${pw("x", 1)}| ${b < 0 ? "-" : "+"} ${Math.abs(k * b)}`,
            ...(scaled ? [`${k * k}|${lin}|`] : []),
          ],
          solution: t(
            `Use $\\sqrt{a^{2}} = |a|$${scaled ? ` and $\\sqrt{${k * k}} = ${k}$` : ""}:${steps(`${sq(inside)} = ${answer}`)}The binomial is negative for some $x$, so the absolute value is needed.`,
            `运用 $\\sqrt{a^{2}} = |a|$${scaled ? `和 $\\sqrt{${k * k}} = ${k}$` : ""}：${steps(`${sq(inside)} = ${answer}`)}这个二项式对某些 $x$ 是负数，所以需要绝对值。`,
          ),
        });
      },
    },
    {
      id: "using-a-domain-restriction",
      title: t("Using a domain restriction", "利用取值范围"),
      explanation: t(
        "A perfect-square trinomial is the square of a binomial: $x^{2} - 6x + 9 = (x - 3)^{2}$, so $\\sqrt{x^{2} - 6x + 9} = |x - 3|$.\n\nWhen the values of $x$ are restricted, the absolute value can be removed:\n\n- for $x \\ge 3$, $x - 3 \\ge 0$, so $|x - 3| = x - 3$;\n- for $x < 3$, $x - 3 < 0$, so $|x - 3| = -(x - 3) = 3 - x$.",
        "完全平方三项式是二项式的平方：$x^{2} - 6x + 9 = (x - 3)^{2}$，所以 $\\sqrt{x^{2} - 6x + 9} = |x - 3|$。\n\n当 $x$ 的取值受到限制时，可以去掉绝对值：\n\n- 当 $x \\ge 3$ 时，$x - 3 \\ge 0$，所以 $|x - 3| = x - 3$；\n- 当 $x < 3$ 时，$x - 3 < 0$，所以 $|x - 3| = -(x - 3) = 3 - x$。",
      ),
      keyPrerequisites: ["squaring-binomials"],
      generate(rng) {
        const b = rng.nonZero(-9, 9);
        const k = rng.pick([1, 1, 1, 2, 3]);
        const above = rng.bool();
        const inside = poly([k * k, "x^{2}"], [2 * k * k * b, "x"], [k * k * b * b, ""]);
        const bound = -b;
        const restriction = above ? `x \\ge ${bound}` : `x < ${bound}`;
        const s = above ? 1 : -1;
        const answer = linear(s * k, s * k * b);
        const square = `${k === 1 ? "" : `${k * k}`}(${linear(1, b)})^{2}`;
        const abs = `${front(k)}|${linear(1, b)}|`;
        return expressionProblem({
          prompt: t(`Simplify $${sq(inside)}$ for $${restriction}$.`, `当 $${restriction}$ 时，化简 $${sq(inside)}$。`),
          answer,
          wrong: [linear(-s * k, -s * k * b), abs, linear(k, -k * b)],
          solution: t(
            `${steps(`${sq(inside)} = ${sq(square)} = ${abs}`)}For $${restriction}$, $${linear(1, b)}$ is ${above ? "not negative" : "negative"}, so $${abs} = ${answer}$.`,
            `${steps(`${sq(inside)} = ${sq(square)} = ${abs}`)}当 $${restriction}$ 时，$${linear(1, b)}$ ${above ? "不是负数" : "是负数"}，所以 $${abs} = ${answer}$。`,
          ),
        });
      },
    },
  ],
};

export const cubeRootsOfAlgebraicPerfectCubes: TopicDef = {
  id: "cube-roots-of-algebraic-perfect-cubes",
  title: t("The Cube Root of a Perfect Cube With Algebraic Expressions", "代数式中完全立方的立方根"),
  summary: t(
    "Take cube roots of monomials that are perfect cubes, such as $\\sqrt[3]{-8x^{6}y^{3}} = -2x^{2}y$.",
    "求完全立方单项式的立方根，例如 $\\sqrt[3]{-8x^{6}y^{3}} = -2x^{2}y$。",
  ),
  prerequisites: ["square-roots-of-algebraic-perfect-squares"],
  encompasses: [
    { topic: "square-roots-of-algebraic-perfect-squares", weight: 0.3 },
    { topic: "square-roots-and-cube-roots", weight: 0.3 },
  ],
  xp: 10,
  standards: ["CCSS.HSN.RN.A.2"],
  knowledgePoints: [
    {
      id: "cube-roots-of-monomials",
      title: t("Cube roots of monomials", "单项式的立方根"),
      explanation: t(
        "Since $(x^{4})^{3} = x^{12}$, the cube root of $x^{12}$ is $x^{4}$: divide the exponent by $3$. Take the cube root of the coefficient and of the variable part separately:\n\n$$\\sqrt[3]{-27x^{12}} = \\sqrt[3]{-27} \\cdot \\sqrt[3]{x^{12}} = -3x^{4}$$\n\nCube roots of negative numbers exist, and no absolute value is needed: $\\sqrt[3]{x^{3}} = x$ for every $x$.",
        "因为 $(x^{4})^{3} = x^{12}$，所以 $x^{12}$ 的立方根是 $x^{4}$：把指数除以 $3$。系数和变量部分分别开立方：\n\n$$\\sqrt[3]{-27x^{12}} = \\sqrt[3]{-27} \\cdot \\sqrt[3]{x^{12}} = -3x^{4}$$\n\n负数有立方根，而且不需要绝对值：对所有 $x$，$\\sqrt[3]{x^{3}} = x$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-6, 6);
        const a = rng.int(1, 4);
        const inside = mono(k ** 3, 3 * a);
        const answer = mono(k, a);
        return expressionProblem({
          prompt: t(`Simplify $${cb(inside)}$.`, `化简 $${cb(inside)}$。`),
          answer,
          radical: true,
          wrong: [mono(k, 3 * a), mono(k ** 3, a), mono(-k, a)],
          solution: t(
            `Take the cube root of the coefficient and divide the exponent by $3$:${steps(`${cb(inside)} = ${cb(String(k ** 3))} \\cdot ${cb(pw("x", 3 * a))} = ${answer}`)}`,
            `系数开立方，指数除以 $3$：${steps(`${cb(inside)} = ${cb(String(k ** 3))} \\cdot ${cb(pw("x", 3 * a))} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "cube-roots-with-several-variables",
      title: t("Several variables", "多个变量"),
      explanation: t(
        "Take the cube root of each factor; a monomial is a perfect cube when its coefficient is a perfect cube and every exponent is a multiple of $3$:\n\n$$\\sqrt[3]{64x^{3}y^{9}} = 4xy^{3}$$",
        "对每个因式分别开立方；当系数是完全立方数并且每个指数都是 $3$ 的倍数时，单项式是完全立方式：\n\n$$\\sqrt[3]{64x^{3}y^{9}} = 4xy^{3}$$",
      ),
      generate(rng) {
        const k = rng.nonZero(-5, 5);
        const a = rng.int(1, 3);
        const b = rng.int(1, 3);
        const inside = mono(k ** 3, 3 * a, 3 * b);
        const answer = mono(k, a, b);
        return expressionProblem({
          prompt: t(`Simplify $${cb(inside)}$.`, `化简 $${cb(inside)}$。`),
          answer,
          radical: true,
          wrong: [mono(k, 3 * a, 3 * b), mono(k ** 3, a, b), mono(-k, a, b), mono(k, a, 3 * b)],
          solution: t(
            `Take the cube root of each factor:${steps(`${cb(inside)} = ${cb(String(k ** 3))} \\cdot ${cb(pw("x", 3 * a))} \\cdot ${cb(pw("y", 3 * b))} = ${answer}`)}`,
            `对每个因式分别开立方：${steps(`${cb(inside)} = ${cb(String(k ** 3))} \\cdot ${cb(pw("x", 3 * a))} \\cdot ${cb(pw("y", 3 * b))} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "cube-roots-of-fractions-with-variables",
      title: t("Fractions", "分式"),
      explanation: t(
        "The cube root of a fraction is the cube root of the numerator over the cube root of the denominator:\n\n$$\\sqrt[3]{\\frac{8x^{6}}{27y^{3}}} = \\frac{\\sqrt[3]{8x^{6}}}{\\sqrt[3]{27y^{3}}} = \\frac{2x^{2}}{3y}$$",
        "分式的立方根等于分子的立方根除以分母的立方根：\n\n$$\\sqrt[3]{\\frac{8x^{6}}{27y^{3}}} = \\frac{\\sqrt[3]{8x^{6}}}{\\sqrt[3]{27y^{3}}} = \\frac{2x^{2}}{3y}$$",
      ),
      generate(rng) {
        const [p, m] = coprime(rng, [1, 5], [2, 6]);
        const k = rng.sign() * p;
        const a = rng.int(1, 3);
        const b = rng.int(0, 2);
        const inside = quotient(k ** 3, vp(3 * a), m ** 3, vp(0, 3 * b));
        const answer = quotient(k, vp(a), m, vp(0, b));
        return expressionProblem({
          prompt: t(`Simplify $${cb(inside)}$.`, `化简 $${cb(inside)}$。`),
          answer,
          radical: true,
          wrong: [quotient(k, vp(a), m ** 3, vp(0, b)), quotient(-k, vp(a), m, vp(0, b)), quotient(k, vp(a), m, vp(0, 3 * b))],
          solution: t(
            `Take the cube root of the numerator and of the denominator:${steps(`${cb(inside)} = ${answer}`)}since $\\left(${answer}\\right)^{3} = ${inside}$.`,
            `分子、分母分别开立方：${steps(`${cb(inside)} = ${answer}`)}因为 $\\left(${answer}\\right)^{3} = ${inside}$。`,
          ),
        });
      },
    },
  ],
};

export const simplifyingSquareRootsWithVariables: TopicDef = {
  id: "simplifying-square-roots-with-variables",
  title: t("Simplifying Square Root Expressions Using the Product Rule", "用乘法法则化简平方根式"),
  summary: t(
    "Take the largest perfect-square factor out of a square root with variables: $\\sqrt{12x^{3}} = 2x\\sqrt{3x}$.",
    "把含变量的平方根中最大的完全平方因式移到根号外：$\\sqrt{12x^{3}} = 2x\\sqrt{3x}$。",
  ),
  prerequisites: ["square-roots-of-algebraic-perfect-squares", "simplifying-square-roots"],
  encompasses: [
    { topic: "square-roots-of-algebraic-perfect-squares", weight: 0.5 },
    { topic: "simplifying-square-roots", weight: 0.5 },
  ],
  xp: 14,
  standards: ["CCSS.HSN.RN.A.2"],
  knowledgePoints: [
    {
      id: "numbers-and-even-powers",
      title: t("Square factors of the coefficient", "系数中的平方因数"),
      explanation: t(
        "The product rule $\\sqrt{ab} = \\sqrt{a} \\cdot \\sqrt{b}$ lets perfect-square factors leave the root. An even power of a variable is a perfect square:\n\n$$\\sqrt{18x^{4}} = \\sqrt{9x^{4}} \\cdot \\sqrt{2} = 3x^{2}\\sqrt{2}$$\n\nIn simplest form nothing under the root is a perfect square other than $1$.",
        "乘法法则 $\\sqrt{ab} = \\sqrt{a} \\cdot \\sqrt{b}$ 让完全平方因式可以移出根号。变量的偶次幂是完全平方：\n\n$$\\sqrt{18x^{4}} = \\sqrt{9x^{4}} \\cdot \\sqrt{2} = 3x^{2}\\sqrt{2}$$\n\n最简形式中，根号内除 $1$ 外不含完全平方因式。",
      ),
      generate(rng) {
        let k: number;
        let m: number;
        do {
          k = rng.int(2, 6);
          m = rng.pick(squareFree);
        } while (k * k * m > 300);
        const a = rng.int(1, 4);
        const n = k * k * m;
        const answer = radTerm(k, a, 0, m, 0, 0);
        return expressionProblem({
          prompt: simplifyPositive(sq(mono(n, 2 * a))),
          answer,
          radical: true,
          positive: true,
          wrong: [radTerm(k, 2 * a, 0, m, 0, 0), radTerm(k * k, a, 0, m, 0, 0), radTerm(m, a, 0, k, 0, 0)],
          solution: t(
            `The largest perfect-square factor is $${mono(k * k, 2 * a)}$:${steps(`${sq(mono(n, 2 * a))} = ${splitWork(n, 2 * a)}`)}`,
            `最大的完全平方因式是 $${mono(k * k, 2 * a)}$：${steps(`${sq(mono(n, 2 * a))} = ${splitWork(n, 2 * a)}`)}`,
          ),
        });
      },
    },
    {
      id: "odd-powers",
      title: t("Odd powers", "奇次幂"),
      explanation: t(
        "An odd power splits into an even power times one more factor: $x^{7} = x^{6} \\cdot x$. The even power leaves the root and one factor stays:\n\n$$\\sqrt{12x^{7}} = \\sqrt{4x^{6}} \\cdot \\sqrt{3x} = 2x^{3}\\sqrt{3x}$$",
        "奇次幂可以拆成偶次幂乘以一个因式：$x^{7} = x^{6} \\cdot x$。偶次幂移出根号，剩下一个因式留在根号内：\n\n$$\\sqrt{12x^{7}} = \\sqrt{4x^{6}} \\cdot \\sqrt{3x} = 2x^{3}\\sqrt{3x}$$",
      ),
      generate(rng) {
        const k = rng.int(1, 5);
        const m = rng.pick([1, 1, 2, 3, 5, 6, 7]);
        const a = rng.int(1, 4);
        const n = k * k * m;
        const e = 2 * a + 1;
        const r = extract(n, e);
        return expressionProblem({
          prompt: simplifyPositive(sq(mono(n, e))),
          answer: written(r),
          radical: true,
          positive: true,
          wrong: [radTerm(k, a + 1, 0, m, 1, 0), radTerm(k, a, 0, m, 0, 0), radTerm(k, 2 * a, 0, m, 1, 0)],
          solution: t(
            `Write $${pw("x", e)} = ${pw("x", 2 * a)} \\cdot x$ and take the perfect squares out:${steps(`${sq(mono(n, e))} = ${splitWork(n, e)}`)}`,
            `把 $${pw("x", e)}$ 写成 $${pw("x", 2 * a)} \\cdot x$，再把完全平方移出根号：${steps(`${sq(mono(n, e))} = ${splitWork(n, e)}`)}`,
          ),
        });
      },
    },
    {
      id: "square-roots-of-monomials-with-several-variables",
      title: t("Several variables", "多个变量"),
      explanation: t(
        "Treat the coefficient and each variable on its own, then collect what comes out and what stays in:\n\n$$\\sqrt{50x^{3}y^{4}} = \\sqrt{25x^{2}y^{4}} \\cdot \\sqrt{2x} = 5xy^{2}\\sqrt{2x}$$",
        "系数和每个变量分别处理，再把移出的部分和留下的部分分别合在一起：\n\n$$\\sqrt{50x^{3}y^{4}} = \\sqrt{25x^{2}y^{4}} \\cdot \\sqrt{2x} = 5xy^{2}\\sqrt{2x}$$",
      ),
      generate(rng) {
        const k = rng.int(1, 5);
        const m = rng.pick([1, 2, 3, 5, 6, 7, 10]);
        const a = rng.int(0, 3);
        const b = rng.int(a === 0 ? 1 : 0, 3);
        const rx = rng.int(0, 1);
        const ry = m === 1 && rx === 0 ? 1 : rng.int(0, 1);
        const n = k * k * m;
        const [ex, ey] = [2 * a + rx, 2 * b + ry];
        const r = extract(n, ex, ey);
        return expressionProblem({
          prompt: simplifyPositive(sq(mono(n, ex, ey))),
          answer: written(r),
          radical: true,
          positive: true,
          wrong: [radTerm(k, a + rx, b + ry, m, rx, ry), radTerm(k, ex, ey, m, rx, ry), radTerm(k, a, b, m, 0, 0)],
          solution: t(
            `Take every perfect-square factor out of the root:${steps(`${sq(mono(n, ex, ey))} = ${splitWork(n, ex, ey)}`)}`,
            `把所有完全平方因式移出根号：${steps(`${sq(mono(n, ex, ey))} = ${splitWork(n, ex, ey)}`)}`,
          ),
        });
      },
    },
  ],
};

export const multiplyingRadicalExpressions: TopicDef = {
  id: "multiplying-radical-expressions",
  title: t("Combining Radical Expressions Using the Product Rule", "用乘法法则合并根式"),
  summary: t(
    "Multiply square roots and cube roots with variables, then simplify: $\\sqrt{6x} \\cdot \\sqrt{10x^{3}} = 2x^{2}\\sqrt{15}$.",
    "进行含变量的平方根和立方根的乘法，然后化简：$\\sqrt{6x} \\cdot \\sqrt{10x^{3}} = 2x^{2}\\sqrt{15}$。",
  ),
  prerequisites: ["simplifying-square-roots-with-variables", "cube-roots-of-algebraic-perfect-cubes"],
  encompasses: [
    { topic: "simplifying-square-roots-with-variables", weight: 0.6 },
    { topic: "cube-roots-of-algebraic-perfect-cubes", weight: 0.2 },
  ],
  xp: 16,
  standards: ["CCSS.HSN.RN.A.2"],
  knowledgePoints: [
    {
      id: "products-of-square-roots",
      title: t("Products of square roots", "平方根的乘积"),
      explanation: t(
        "Read the product rule backwards: $\\sqrt{a} \\cdot \\sqrt{b} = \\sqrt{ab}$. Multiply under one root, then simplify:\n\n$$\\sqrt{6x} \\cdot \\sqrt{10x^{3}} = \\sqrt{60x^{4}} = \\sqrt{4x^{4}} \\cdot \\sqrt{15} = 2x^{2}\\sqrt{15}$$\n\nExponents of the same variable are added, not multiplied.",
        "把乘法法则反过来用：$\\sqrt{a} \\cdot \\sqrt{b} = \\sqrt{ab}$。先乘到一个根号下，再化简：\n\n$$\\sqrt{6x} \\cdot \\sqrt{10x^{3}} = \\sqrt{60x^{4}} = \\sqrt{4x^{4}} \\cdot \\sqrt{15} = 2x^{2}\\sqrt{15}$$\n\n同一变量的指数相加，而不是相乘。",
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5, 6, 7, 10, 14, 15]);
        const q = rng.pick([2, 3, 5, 6, 7, 10, 14, 15]);
        const a = rng.int(1, 3);
        const b = rng.int(1, 3);
        const [n, e] = [p * q, a + b];
        const expr = `${sq(mono(p, a))} \\cdot ${sq(mono(q, b))}`;
        return expressionProblem({
          prompt: simplifyPositive(expr),
          answer: written(extract(n, e)),
          radical: true,
          positive: true,
          wrong: [written(extract(n, a * b)), written(extract(p + q, e)), sq(mono(n, e))],
          solution: t(
            `Multiply under one root, then simplify:${steps(`${expr} = ${sq(mono(n, e))} = ${splitWork(n, e)}`)}`,
            `先乘到一个根号下，再化简：${steps(`${expr} = ${sq(mono(n, e))} = ${splitWork(n, e)}`)}`,
          ),
        });
      },
    },
    {
      id: "coefficients-outside-the-roots",
      title: t("Coefficients outside the roots", "根号外的系数"),
      explanation: t(
        "Multiply the coefficients outside the roots and the radicands inside, then simplify and multiply what comes out by the coefficient:\n\n$$3\\sqrt{2xy} \\cdot 4\\sqrt{6x^{2}y} = 12\\sqrt{12x^{3}y^{2}} = 12 \\cdot 2xy\\sqrt{3x} = 24xy\\sqrt{3x}$$",
        "根号外的系数相乘，根号内的被开方式相乘，再化简，并把移出的部分与系数相乘：\n\n$$3\\sqrt{2xy} \\cdot 4\\sqrt{6x^{2}y} = 12\\sqrt{12x^{3}y^{2}} = 12 \\cdot 2xy\\sqrt{3x} = 24xy\\sqrt{3x}$$",
      ),
      generate(rng) {
        const [c1, c2] = [rng.int(2, 5), rng.int(2, 5)];
        const p = rng.pick([1, 2, 3, 5, 6]);
        const q = rng.pick([2, 3, 5, 6, 10]);
        const [a, b] = [rng.int(1, 3), rng.int(0, 2)];
        const [c, d] = [rng.int(0, 2), rng.int(1, 3)];
        const [n, ex, ey] = [p * q, a + c, b + d];
        const r = extract(n, ex, ey);
        const expr = `${c1}${sq(mono(p, a, b))} \\cdot ${c2}${sq(mono(q, c, d))}`;
        const product = `${c1 * c2}${sq(mono(n, ex, ey))}`;
        return expressionProblem({
          prompt: simplifyPositive(expr),
          answer: written(r, c1 * c2),
          radical: true,
          positive: true,
          wrong: [written(r, c1 + c2), written(r), written(extract(c1 * c2 * n, ex, ey))],
          solution: t(
            `Multiply the coefficients and the radicands, then simplify:${steps(`${expr} = ${product} = ${c1 * c2} \\cdot ${written(r)} = ${written(r, c1 * c2)}`)}`,
            `系数相乘，被开方式相乘，再化简：${steps(`${expr} = ${product} = ${c1 * c2} \\cdot ${written(r)} = ${written(r, c1 * c2)}`)}`,
          ),
        });
      },
    },
    {
      id: "products-of-cube-roots",
      title: t("Products of cube roots", "立方根的乘积"),
      explanation: t(
        "The product rule holds for cube roots too: $\\sqrt[3]{a} \\cdot \\sqrt[3]{b} = \\sqrt[3]{ab}$. Two cube roots that are not perfect cubes can multiply to one:\n\n$$\\sqrt[3]{4x^{2}} \\cdot \\sqrt[3]{2x^{4}} = \\sqrt[3]{8x^{6}} = 2x^{2}$$",
        "乘法法则对立方根同样成立：$\\sqrt[3]{a} \\cdot \\sqrt[3]{b} = \\sqrt[3]{ab}$。两个本身不是完全立方的立方根，乘积可能是完全立方：\n\n$$\\sqrt[3]{4x^{2}} \\cdot \\sqrt[3]{2x^{4}} = \\sqrt[3]{8x^{6}} = 2x^{2}$$",
      ),
      generate(rng) {
        const s = rng.pick([2, 3, 5]);
        const j = rng.int(1, 2);
        const u = rng.int(1, 2);
        const p = s ** j;
        const q = s ** (3 - j) * u ** 3;
        const k = s * u;
        const h = rng.int(1, 2);
        const a = rng.int(1, 3 * h - 1);
        const b = 3 * h - a;
        const expr = `${cb(mono(p, a))} \\cdot ${cb(mono(q, b))}`;
        const answer = mono(k, h);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer,
          radical: true,
          wrong: [mono(k ** 3, h), mono(k, 3 * h), mono(k, a * b), cb(mono(p * q, 3 * h))],
          solution: t(
            `Multiply under one cube root:${steps(`${expr} = ${cb(mono(p * q, 3 * h))} = ${answer}`)}since $(${answer})^{3} = ${mono(p * q, 3 * h)}$.`,
            `乘到一个立方根号下：${steps(`${expr} = ${cb(mono(p * q, 3 * h))} = ${answer}`)}因为 $(${answer})^{3} = ${mono(p * q, 3 * h)}$。`,
          ),
        });
      },
    },
    {
      id: "distributing-a-square-root",
      title: t("Distributing a square root", "用分配律乘根式"),
      explanation: t(
        "Distribute a root over a sum like any factor, then simplify each product:\n\n$$\\sqrt{2x}\\left(\\sqrt{6x} - 5\\right) = \\sqrt{12x^{2}} - 5\\sqrt{2x} = 2x\\sqrt{3} - 5\\sqrt{2x}$$\n\nThe two terms have different radicals, so they cannot be combined.",
        "像其他因式一样，用分配律把根式乘进和式，再化简每个乘积：\n\n$$\\sqrt{2x}\\left(\\sqrt{6x} - 5\\right) = \\sqrt{12x^{2}} - 5\\sqrt{2x} = 2x\\sqrt{3} - 5\\sqrt{2x}$$\n\n两项的根式不同，不能合并。",
      ),
      generate(rng) {
        const p = rng.pick([1, 2, 3, 5, 6, 7]);
        const q = rng.pick([1, 2, 3, 5, 6, 7, 10]);
        const c = rng.nonZero(-9, 9);
        const r = extract(p * q, 2);
        const first = written(r);
        const second = radTerm(c, 0, 0, p, 1, 0);
        const answer = joinTerms(first, second);
        const expr = `${sq(mono(p, 1))}\\left(${sq(mono(q, 1))} ${c < 0 ? "-" : "+"} ${Math.abs(c)}\\right)`;
        return expressionProblem({
          prompt: simplifyPositive(expr),
          answer,
          radical: true,
          positive: true,
          wrong: [
            joinTerms(first, String(c)),
            joinTerms(first, radTerm(c, 0, 0, q, 1, 0)),
            joinTerms(radTerm(1, 0, 0, p * q, 1, 0), second),
          ],
          solution: t(
            `Distribute, then simplify each product:${steps(`${expr} = ${joinTerms(sq(mono(p * q, 2)), second)} = ${answer}`)}`,
            `用分配律展开，再化简每个乘积：${steps(`${expr} = ${joinTerms(sq(mono(p * q, 2)), second)} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
};

export const quotientRuleForSquareRoots: TopicDef = {
  id: "quotient-rule-for-square-roots",
  title: t("Simplifying Square Root Expressions Using the Quotient Rule", "用除法法则化简平方根式"),
  summary: t(
    "Use $\\sqrt{\\frac{a}{b}} = \\frac{\\sqrt{a}}{\\sqrt{b}}$ to divide square roots and simplify roots of fractions with variables.",
    "利用 $\\sqrt{\\frac{a}{b}} = \\frac{\\sqrt{a}}{\\sqrt{b}}$ 进行平方根的除法，并化简含变量分式的平方根。",
  ),
  prerequisites: ["simplifying-square-roots-with-variables"],
  encompasses: [
    { topic: "simplifying-square-roots-with-variables", weight: 0.6 },
    { topic: "square-roots-of-algebraic-perfect-squares", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSN.RN.A.2"],
  knowledgePoints: [
    {
      id: "dividing-square-roots",
      title: t("Dividing square roots", "平方根的除法"),
      explanation: t(
        "The quotient rule $\\frac{\\sqrt{a}}{\\sqrt{b}} = \\sqrt{\\frac{a}{b}}$ puts a quotient of roots under one root. Divide there, subtracting exponents, then simplify:\n\n$$\\frac{\\sqrt{54x^{5}}}{\\sqrt{2x}} = \\sqrt{27x^{4}} = \\sqrt{9x^{4}} \\cdot \\sqrt{3} = 3x^{2}\\sqrt{3}$$",
        "除法法则 $\\frac{\\sqrt{a}}{\\sqrt{b}} = \\sqrt{\\frac{a}{b}}$ 把两个根式的商放到一个根号下。在根号下相除（指数相减），再化简：\n\n$$\\frac{\\sqrt{54x^{5}}}{\\sqrt{2x}} = \\sqrt{27x^{4}} = \\sqrt{9x^{4}} \\cdot \\sqrt{3} = 3x^{2}\\sqrt{3}$$",
      ),
      generate(rng) {
        const n2 = rng.pick([2, 3, 5, 6, 7]);
        const a2 = rng.int(1, 3);
        const k = rng.int(1, 5);
        const m = rng.pick([1, 2, 3, 5]);
        const e = rng.int(1, 5);
        const q = k * k * m;
        const [n1, a1] = [q * n2, a2 + e];
        const expr = `\\frac{${sq(mono(n1, a1))}}{${sq(mono(n2, a2))}}`;
        return expressionProblem({
          prompt: simplifyPositive(expr),
          answer: written(extract(q, e)),
          radical: true,
          positive: true,
          wrong: [...(n1 > n2 ? [written(extract(n1 - n2, e))] : []), written(extract(q, a1 + a2)), sq(mono(q, e))],
          solution: t(
            `Divide under one root, then simplify:${steps(`${expr} = ${sq(mono(q, e))}${q === 1 && e === 2 ? "" : ` = ${splitWork(q, e)}`}`)}`,
            `在一个根号下相除，再化简：${steps(`${expr} = ${sq(mono(q, e))}${q === 1 && e === 2 ? "" : ` = ${splitWork(q, e)}`}`)}`,
          ),
        });
      },
    },
    {
      id: "square-roots-of-fractions",
      title: t("Square roots of fractions", "分式的平方根"),
      explanation: t(
        "Read the rule the other way: $\\sqrt{\\frac{a}{b}} = \\frac{\\sqrt{a}}{\\sqrt{b}}$. Simplify the root of the numerator and the root of the denominator:\n\n$$\\sqrt{\\frac{7x^{5}}{16y^{2}}} = \\frac{\\sqrt{7x^{5}}}{\\sqrt{16y^{2}}} = \\frac{x^{2}\\sqrt{7x}}{4y}$$",
        "把法则反过来用：$\\sqrt{\\frac{a}{b}} = \\frac{\\sqrt{a}}{\\sqrt{b}}$。分别化简分子和分母的平方根：\n\n$$\\sqrt{\\frac{7x^{5}}{16y^{2}}} = \\frac{\\sqrt{7x^{5}}}{\\sqrt{16y^{2}}} = \\frac{x^{2}\\sqrt{7x}}{4y}$$",
      ),
      generate(rng) {
        let k: number;
        let m: number;
        let d: number;
        let b: number;
        let r: number;
        do {
          k = rng.int(1, 4);
          m = rng.pick([1, 2, 3, 5, 6, 7]);
          d = rng.int(1, 7);
          b = rng.int(0, 2);
          r = rng.int(0, 1);
        } while (gcd(k * m, d) !== 1 || (d === 1 && b === 0) || (m === 1 && r === 0));
        const h = rng.int(0, 2);
        const n = k * k * m;
        const e = 2 * h + r;
        const top = written(extract(n, e));
        const rest = radTerm(1, h, 0, m, r, 0);
        const inside = `\\frac{${mono(n, e)}}{${mono(d * d, 0, 2 * b)}}`;
        const answer = quotient(k, rest, d, vp(0, b));
        return expressionProblem({
          prompt: simplifyPositive(sq(inside)),
          answer,
          radical: true,
          positive: true,
          wrong: [
            quotient(k, rest, d * d, vp(0, 2 * b)),
            quotient(k, rest, d, vp(0, 2 * b)),
            quotient(k, radTerm(1, e, 0, m, 0, 0), d, vp(0, b)),
          ],
          solution: t(
            `Take the roots of the numerator and the denominator:${steps(`${sq(inside)} = \\frac{${sq(mono(n, e))}}{${sq(mono(d * d, 0, 2 * b))}} = \\frac{${top}}{${mono(d, 0, b)}}${answer === `\\frac{${top}}{${mono(d, 0, b)}}` ? "" : ` = ${answer}`}`)}`,
            `分子、分母分别开方：${steps(`${sq(inside)} = \\frac{${sq(mono(n, e))}}{${sq(mono(d * d, 0, 2 * b))}} = \\frac{${top}}{${mono(d, 0, b)}}${answer === `\\frac{${top}}{${mono(d, 0, b)}}` ? "" : ` = ${answer}`}`)}`,
          ),
        });
      },
    },
    {
      id: "reducing-under-the-root",
      title: t("Reducing under the root first", "先在根号下约分"),
      explanation: t(
        "When the fraction under the root can be reduced, reduce it first; then the numerator and denominator are easier to take roots of:\n\n$$\\sqrt{\\frac{12x^{5}}{27x}} = \\sqrt{\\frac{4x^{4}}{9}} = \\frac{2x^{2}}{3}$$",
        "当根号下的分式能约分时，先约分，这样分子和分母更容易开方：\n\n$$\\sqrt{\\frac{12x^{5}}{27x}} = \\sqrt{\\frac{4x^{4}}{9}} = \\frac{2x^{2}}{3}$$",
      ),
      keyPrerequisites: ["equivalent-fractions"],
      generate(rng) {
        let k: number;
        let m: number;
        let d: number;
        do {
          k = rng.int(1, 5);
          m = rng.pick([1, 1, 2, 3, 5, 7]);
          d = rng.int(2, 7);
        } while (gcd(k * m, d) !== 1);
        const g = rng.int(2, 5);
        const h = rng.int(0, 2);
        const r = h === 0 ? 1 : rng.int(0, 1);
        const q = rng.int(1, 3);
        const [n, e] = [k * k * m, 2 * h + r];
        const rest = radTerm(1, h, 0, m, r, 0);
        const inside = `\\frac{${mono(g * n, q + e)}}{${mono(g * d * d, q)}}`;
        const reduced = `\\frac{${mono(n, e)}}{${d * d}}`;
        const answer = quotient(k, rest, d, "");
        return expressionProblem({
          prompt: simplifyPositive(sq(inside)),
          answer,
          radical: true,
          positive: true,
          wrong: [
            quotient(k, rest, d * d, ""),
            quotient(k, radTerm(1, e, 0, m, r, 0), d, ""),
            quotient(k, radTerm(1, h + q, 0, m, r, 0), d, ""),
          ],
          solution: t(
            `Reduce the fraction, then take the roots:${steps(`${sq(inside)} = ${sq(reduced)} = ${answer}`)}`,
            `先约分，再开方：${steps(`${sq(inside)} = ${sq(reduced)} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
};

/** substituted writes ax + b with x replaced by v: "3(-2) + 7". */
const substituted = (a: number, v: number, b: number) =>
  `${a === 1 ? "" : a === -1 ? "-" : a}(${v})${b === 0 ? "" : ` ${b < 0 ? "-" : "+"} ${Math.abs(b)}`}`;

/** triples are Pythagorean triples. */
const triples = [
  [3, 4, 5],
  [5, 12, 13],
  [6, 8, 10],
  [8, 15, 17],
  [9, 12, 15],
  [7, 24, 25],
  [12, 16, 20],
  [20, 21, 29],
] as const;

/** when writes "when x = 3 and y = -4" in both locales. */
const when = (vals: readonly (readonly [string, number])[]): Text =>
  t(
    vals
      .map(([v, n]) => `$${v} = ${n}$`)
      .join(", ")
      .replace(/, ([^,]*)$/, vals.length > 2 ? ", and $1" : " and $1"),
    vals.map(([v, n]) => `$${v} = ${n}$`).join("，"),
  );

/** evaluate asks for the value of an expression at given values. */
const evaluate = (expr: string, vals: readonly (readonly [string, number])[]) => {
  const w = when(vals);
  return t(`Evaluate $${expr}$ when ${w.en}.`, `当 ${w["zh-CN"]} 时，求 $${expr}$ 的值。`);
};

export const evaluatingRadicalExpressions: TopicDef = {
  id: "evaluating-radical-expressions",
  title: t("Evaluating Algebraic Radical Expressions", "代数根式求值"),
  summary: t(
    "Substitute values into expressions with square roots and cube roots, and simplify the result.",
    "把数值代入含平方根和立方根的式子，并化简结果。",
  ),
  prerequisites: ["simplifying-square-roots", "evaluating-expressions"],
  encompasses: [
    { topic: "simplifying-square-roots", weight: 0.3 },
    { topic: "evaluating-expressions", weight: 0.4 },
    { topic: "square-roots-and-cube-roots", weight: 0.4 },
  ],
  xp: 10,
  standards: ["CCSS.HSN.RN.A.2"],
  knowledgePoints: [
    {
      id: "evaluating-to-a-whole-number",
      title: t("Evaluating square roots", "平方根式求值"),
      explanation: t(
        "A root sign groups like parentheses: evaluate everything under it first, then take the root.\n\n$$\\sqrt{x^{2} + y^{2}} \\text{ at } x = 6,\\ y = -8: \\quad \\sqrt{36 + 64} = \\sqrt{100} = 10$$\n\nThe root of a sum is not the sum of the roots: $\\sqrt{36 + 64} \\ne 6 + 8$.",
        "根号像括号一样起分组作用：先算出根号下的全部，再开方。\n\n$$\\sqrt{x^{2} + y^{2}} \\text{ 在 } x = 6,\\ y = -8 \\text{ 时}: \\quad \\sqrt{36 + 64} = \\sqrt{100} = 10$$\n\n和的平方根不等于平方根的和：$\\sqrt{36 + 64} \\ne 6 + 8$。",
      ),
      keyPrerequisites: ["evaluating-expressions"],
      generate(rng) {
        const kind = rng.pick(["pythagoras", "discriminant", "linear"] as const);
        if (kind === "pythagoras") {
          const [a, b, c] = rng.pick(triples);
          const [x, y] = rng.bool() ? [a, b] : [b, a];
          const [sx, sy] = [rng.sign() * x, rng.sign() * y];
          return numberProblem({
            prompt: evaluate("\\sqrt{x^{2} + y^{2}}", [
              ["x", sx],
              ["y", sy],
            ]),
            answer: c,
            wrong: [sx + sy, x + y, c * c, -c],
            solution: t(
              `${steps(`\\sqrt{(${sx})^{2} + (${sy})^{2}} = \\sqrt{${x * x} + ${y * y}} = \\sqrt{${c * c}} = ${c}`)}`,
              `${steps(`\\sqrt{(${sx})^{2} + (${sy})^{2}} = \\sqrt{${x * x} + ${y * y}} = \\sqrt{${c * c}} = ${c}`)}`,
            ),
          });
        }
        if (kind === "discriminant") {
          const a = rng.int(1, 3);
          let p: number;
          let q: number;
          do {
            [p, q] = [rng.int(-6, 6), rng.int(-6, 6)];
          } while (p === q);
          const [b, c] = [-a * (p + q), a * p * q];
          const disc = b * b - 4 * a * c;
          const answer = a * Math.abs(p - q);
          return numberProblem({
            prompt: evaluate("\\sqrt{b^{2} - 4ac}", [
              ["a", a],
              ["b", b],
              ["c", c],
            ]),
            answer,
            wrong: [disc, -answer, Math.abs(b)],
            solution: t(
              `${steps(`\\sqrt{(${b})^{2} - 4(${a})(${c})} = \\sqrt{${b * b} ${4 * a * c < 0 ? "+" : "-"} ${Math.abs(4 * a * c)}} = \\sqrt{${disc}} = ${answer}`)}`,
              `${steps(`\\sqrt{(${b})^{2} - 4(${a})(${c})} = \\sqrt{${b * b} ${4 * a * c < 0 ? "+" : "-"} ${Math.abs(4 * a * c)}} = \\sqrt{${disc}} = ${answer}`)}`,
            ),
          });
        }
        const r = rng.int(1, 12);
        const v = rng.nonZero(-9, 9);
        const a = rng.int(2, 9);
        const b = r * r - a * v;
        return numberProblem({
          prompt: evaluate(sq(linear(a, b)), [["x", v]]),
          answer: r,
          wrong: [r * r, -r],
          solution: t(
            `${steps(`${sq(substituted(a, v, b))} = \\sqrt{${r * r}} = ${r}`)}`,
            `${steps(`${sq(substituted(a, v, b))} = \\sqrt{${r * r}} = ${r}`)}`,
          ),
        });
      },
    },
    {
      id: "evaluating-to-simplest-radical-form",
      title: t("Results in simplest radical form", "结果写成最简根式"),
      explanation: t(
        "When the number under the root is not a perfect square, simplify the root of the result:\n\n$$\\sqrt{x^{2} + y^{2}} \\text{ at } x = 4,\\ y = 4: \\quad \\sqrt{16 + 16} = \\sqrt{32} = 4\\sqrt{2}$$",
        "当根号下的数不是完全平方数时，把结果的平方根化简：\n\n$$\\sqrt{x^{2} + y^{2}} \\text{ 在 } x = 4,\\ y = 4 \\text{ 时}: \\quad \\sqrt{16 + 16} = \\sqrt{32} = 4\\sqrt{2}$$",
      ),
      generate(rng) {
        if (rng.bool()) {
          let x: number;
          let y: number;
          let n: number;
          do {
            [x, y] = [rng.int(1, 9), rng.int(1, 9)];
            n = x * x + y * y;
          } while (simplifyRadical(n)[1] === 1);
          const [k, m] = simplifyRadical(n);
          const [sx, sy] = [rng.sign() * x, rng.sign() * y];
          return radicalProblem({
            prompt: evaluate("\\sqrt{x^{2} + y^{2}}", [
              ["x", sx],
              ["y", sy],
            ]),
            answer: [k, m],
            wrong: [String(x + y), ...(k > 1 ? [sq(String(n)), `${front(m)}\\sqrt{${k}}`] : [])],
            solution: t(
              `${steps(`\\sqrt{(${sx})^{2} + (${sy})^{2}} = \\sqrt{${x * x} + ${y * y}} = \\sqrt{${n}}${k > 1 ? ` = ${splitWork(n, 0)}` : ""}`)}`,
              `${steps(`\\sqrt{(${sx})^{2} + (${sy})^{2}} = \\sqrt{${x * x} + ${y * y}} = \\sqrt{${n}}${k > 1 ? ` = ${splitWork(n, 0)}` : ""}`)}`,
            ),
          });
        }
        const k = rng.int(2, 5);
        const m = rng.pick([2, 3, 5, 6, 7]);
        const n = k * k * m;
        const v = rng.nonZero(-9, 9);
        const a = rng.int(2, 9);
        const b = n - a * v;
        const c = rng.pick([1, 1, 2, 3]);
        const expr = `${c === 1 ? "" : c}${sq(linear(a, b))}`;
        return radicalProblem({
          prompt: evaluate(expr, [["x", v]]),
          answer: [c * k, m],
          wrong: [`${c === 1 ? "" : c}\\sqrt{${n}}`, `${front(c * m)}\\sqrt{${k}}`, String(c * n)],
          solution: t(
            `${steps(`${c === 1 ? "" : c}${sq(substituted(a, v, b))} = ${c === 1 ? "" : c}\\sqrt{${n}} = ${c === 1 ? "" : `${c} \\cdot `}${radTerm(k, 0, 0, m, 0, 0)}${c === 1 ? "" : ` = ${radTerm(c * k, 0, 0, m, 0, 0)}`}`)}`,
            `${steps(`${c === 1 ? "" : c}${sq(substituted(a, v, b))} = ${c === 1 ? "" : c}\\sqrt{${n}} = ${c === 1 ? "" : `${c} \\cdot `}${radTerm(k, 0, 0, m, 0, 0)}${c === 1 ? "" : ` = ${radTerm(c * k, 0, 0, m, 0, 0)}`}`)}`,
          ),
        });
      },
    },
    {
      id: "evaluating-cube-roots",
      title: t("Evaluating cube roots", "立方根式求值"),
      explanation: t(
        "Evaluate under the cube root first. The result may be negative, and so may the cube root:\n\n$$\\sqrt[3]{2x - 9} \\text{ at } x = -9: \\quad \\sqrt[3]{-18 - 9} = \\sqrt[3]{-27} = -3$$",
        "先算出立方根号下的值。结果可以是负数，立方根也可以是负数：\n\n$$\\sqrt[3]{2x - 9} \\text{ 在 } x = -9 \\text{ 时}: \\quad \\sqrt[3]{-18 - 9} = \\sqrt[3]{-27} = -3$$",
      ),
      generate(rng) {
        const r = rng.nonZero(-6, 6);
        if (rng.bool()) {
          const v = rng.nonZero(-9, 9);
          const a = rng.nonZero(-6, 9);
          const b = r ** 3 - a * v;
          return numberProblem({
            prompt: evaluate(cb(linear(a, b)), [["x", v]]),
            answer: r,
            wrong: [-r, r ** 3],
            solution: t(
              `${steps(`${cb(substituted(a, v, b))} = ${cb(String(r ** 3))} = ${r}`)}`,
              `${steps(`${cb(substituted(a, v, b))} = ${cb(String(r ** 3))} = ${r}`)}`,
            ),
          });
        }
        const x = rng.nonZero(-6, 6);
        const y = r ** 3 - x * x;
        const expr = "\\sqrt[3]{x^{2} + y}";
        return numberProblem({
          prompt: evaluate(expr, [
            ["x", x],
            ["y", y],
          ]),
          answer: r,
          wrong: [-r, r ** 3],
          solution: t(
            `${steps(`${cb(`(${x})^{2} + (${y})`)} = ${cb(String(r ** 3))} = ${r}`)}`,
            `${steps(`${cb(`(${x})^{2} + (${y})`)} = ${cb(String(r ** 3))} = ${r}`)}`,
          ),
        });
      },
    },
  ],
};

/** op writes the operator for a sign: "+" or "-". */
const op = (s: number) => (s < 0 ? "-" : "+");

export const addingAndSubtractingRadicalExpressions: TopicDef = {
  id: "adding-and-subtracting-radical-expressions",
  title: t("Adding and Subtracting Radical Expressions", "根式的加减"),
  summary: t(
    "Combine like radicals with variables, simplifying each root first: $\\sqrt{8x} + \\sqrt{18x} = 5\\sqrt{2x}$.",
    "合并含变量的同类根式，先化简每个根式：$\\sqrt{8x} + \\sqrt{18x} = 5\\sqrt{2x}$。",
  ),
  prerequisites: ["simplifying-square-roots-with-variables", "adding-and-subtracting-radicals"],
  encompasses: [
    { topic: "simplifying-square-roots-with-variables", weight: 0.5 },
    { topic: "adding-and-subtracting-radicals", weight: 0.6 },
  ],
  xp: 14,
  standards: ["CCSS.HSN.RN.A.2"],
  knowledgePoints: [
    {
      id: "combining-like-radical-terms",
      title: t("Like radical terms", "同类根式项"),
      explanation: t(
        "Terms with the same root and the same factors outside it are like terms. Add or subtract their coefficients and keep the rest:\n\n$$7x\\sqrt{3x} - 2x\\sqrt{3x} = 5x\\sqrt{3x}$$\n\nThe radicands are not added, and the outside factors are not multiplied: $\\sqrt{2x} + \\sqrt{2x} = 2\\sqrt{2x}$, not $\\sqrt{4x}$.",
        "根式相同、根号外的因式也相同的项是同类项。把系数相加减，其余部分不变：\n\n$$7x\\sqrt{3x} - 2x\\sqrt{3x} = 5x\\sqrt{3x}$$\n\n被开方式不相加，根号外的因式也不相乘：$\\sqrt{2x} + \\sqrt{2x} = 2\\sqrt{2x}$，而不是 $\\sqrt{4x}$。",
      ),
      keyPrerequisites: ["adding-and-subtracting-radicals"],
      generate(rng) {
        const p = rng.pick([1, 2, 3, 5, 6, 7]);
        const ox = rng.int(0, 2);
        let a: number;
        let b: number;
        let s: 1 | -1;
        do {
          [a, b, s] = [rng.int(1, 12), rng.int(1, 12), rng.sign()];
        } while (a + s * b === 0);
        const c = a + s * b;
        const term = (k: number, e = ox) => radTerm(k, e, 0, p, 1, 0);
        const expr = `${term(a)} ${op(s)} ${term(b)}`;
        return expressionProblem({
          prompt: simplifyPositive(expr),
          answer: term(c),
          radical: true,
          positive: true,
          wrong: [
            radTerm(c, ox, 0, 2 * p, 1, 0),
            term(a * b),
            ...(ox > 0 ? [term(c, 2 * ox)] : []),
            term(a - s * b === 0 ? c + 1 : a - s * b),
          ],
          solution: t(
            `The terms are alike; combine the coefficients:${steps(`${expr} = (${a} ${op(s)} ${b})${front(1, ox)}${sq(mono(p, 1))} = ${term(c)}`)}`,
            `这两项是同类项，合并系数：${steps(`${expr} = (${a} ${op(s)} ${b})${front(1, ox)}${sq(mono(p, 1))} = ${term(c)}`)}`,
          ),
        });
      },
    },
    {
      id: "simplifying-before-combining-with-variables",
      title: t("Simplifying before combining", "先化简再合并"),
      explanation: t(
        "Terms that look different may be alike once each root is simplified:\n\n$$\\sqrt{12x^{3}} + x\\sqrt{27x} = 2x\\sqrt{3x} + 3x\\sqrt{3x} = 5x\\sqrt{3x}$$",
        "看起来不同的项，化简每个根式后可能是同类项：\n\n$$\\sqrt{12x^{3}} + x\\sqrt{27x} = 2x\\sqrt{3x} + 3x\\sqrt{3x} = 5x\\sqrt{3x}$$",
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5, 6, 7]);
        const u = rng.int(0, 2);
        const w = rng.int(0, u);
        let j: number;
        let k: number;
        let l: number;
        let s: 1 | -1;
        do {
          [j, k, l, s] = [rng.int(1, 5), rng.int(1, 5), rng.pick([1, 1, 2, 3]), rng.sign()];
        } while (j + s * l * k === 0 || (j === 1 && k === 1 && u === 0));
        const c = j + s * l * k;
        const first = sq(mono(j * j * p, 2 * u + 1));
        const second = `${front(l, w)}${sq(mono(k * k * p, 2 * (u - w) + 1))}`;
        const expr = `${first} ${op(s)} ${second}`;
        const term = (q: number) => radTerm(q, u, 0, p, 1, 0);
        return expressionProblem({
          prompt: simplifyPositive(expr),
          answer: term(c),
          radical: true,
          positive: true,
          wrong: [
            term(j + s * k),
            joinTerms(term(j), radTerm(s * l * k, u - w, 0, p, 1, 0)),
            ...(s > 0 && w === 0 && l === 1 ? [sq(mono((j * j + k * k) * p, 2 * u + 1))] : []),
          ],
          solution: t(
            `Simplify each root, then combine:${steps(`${expr} = ${term(j)} ${op(s)} ${term(l * k)} = ${term(c)}`)}`,
            `先化简每个根式，再合并：${steps(`${expr} = ${term(j)} ${op(s)} ${term(l * k)} = ${term(c)}`)}`,
          ),
        });
      },
    },
    {
      id: "unlike-radicals-remain",
      title: t("Unlike radicals remain", "不同类的根式保留"),
      explanation: t(
        "After simplifying, combine only the like terms; terms with different radicands stay separate:\n\n$$\\sqrt{8x} + \\sqrt{27x} + 3\\sqrt{2x} = 2\\sqrt{2x} + 3\\sqrt{3x} + 3\\sqrt{2x} = 5\\sqrt{2x} + 3\\sqrt{3x}$$",
        "化简后只合并同类项；被开方式不同的项保持分开：\n\n$$\\sqrt{8x} + \\sqrt{27x} + 3\\sqrt{2x} = 2\\sqrt{2x} + 3\\sqrt{3x} + 3\\sqrt{2x} = 5\\sqrt{2x} + 3\\sqrt{3x}$$",
      ),
      generate(rng) {
        const [p, q] = rng.sample([2, 3, 5, 6, 7], 2) as [number, number];
        let j: number;
        let l: number;
        let s2: 1 | -1;
        do {
          [j, l, s2] = [rng.int(1, 5), rng.int(1, 5), rng.sign()];
        } while (j + s2 * l === 0);
        const k = rng.int(1, 5);
        const s1 = rng.sign();
        const expr = `${sq(mono(j * j * p, 1))} ${op(s1)} ${sq(mono(k * k * q, 1))} ${op(s2)} ${front(l)}${sq(mono(p, 1))}`;
        const termP = (c: number) => radTerm(c, 0, 0, p, 1, 0);
        const termQ = (c: number) => radTerm(c, 0, 0, q, 1, 0);
        const answer = joinTerms(termP(j + s2 * l), termQ(s1 * k));
        return expressionProblem({
          prompt: simplifyPositive(expr),
          answer,
          radical: true,
          positive: true,
          wrong: [
            termP(j + s2 * l + s1 * k),
            joinTerms(termP(j + s2 * l), termQ(s1 * k * k)),
            joinTerms(termP(j * j + s2 * l), termQ(s1 * k)),
          ],
          solution: t(
            `Simplify each root, then combine the like terms:${steps(`${expr} = ${termP(j)} ${op(s1)} ${termQ(k)} ${op(s2)} ${termP(l)} = ${answer}`)}`,
            `先化简每个根式，再合并同类项：${steps(`${expr} = ${termP(j)} ${op(s1)} ${termQ(k)} ${op(s2)} ${termP(l)} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
};

export const rationalizingAlgebraicDenominators: TopicDef = {
  id: "rationalizing-algebraic-denominators",
  title: t("Rationalizing Denominators of Algebraic Expressions", "代数式的分母有理化"),
  summary: t(
    "Remove a square root with variables from a denominator: $\\frac{6}{\\sqrt{3x}} = \\frac{2\\sqrt{3x}}{x}$.",
    "去掉分母中含变量的平方根：$\\frac{6}{\\sqrt{3x}} = \\frac{2\\sqrt{3x}}{x}$。",
  ),
  prerequisites: ["quotient-rule-for-square-roots", "rationalizing-denominators"],
  encompasses: [
    { topic: "rationalizing-denominators", weight: 0.6 },
    { topic: "quotient-rule-for-square-roots", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSN.RN.A.2"],
  knowledgePoints: [
    {
      id: "monomial-radical-denominators",
      title: t("A root in the denominator", "分母中的根式"),
      explanation: t(
        "Multiply the numerator and the denominator by the root in the denominator; since $\\sqrt{3x} \\cdot \\sqrt{3x} = 3x$, the root disappears. Then reduce:\n\n$$\\frac{6}{\\sqrt{3x}} = \\frac{6\\sqrt{3x}}{\\sqrt{3x} \\cdot \\sqrt{3x}} = \\frac{6\\sqrt{3x}}{3x} = \\frac{2\\sqrt{3x}}{x}$$",
        "把分子和分母同乘以分母中的根式；因为 $\\sqrt{3x} \\cdot \\sqrt{3x} = 3x$，根式就消失了。然后约分：\n\n$$\\frac{6}{\\sqrt{3x}} = \\frac{6\\sqrt{3x}}{\\sqrt{3x} \\cdot \\sqrt{3x}} = \\frac{6\\sqrt{3x}}{3x} = \\frac{2\\sqrt{3x}}{x}$$",
      ),
      keyPrerequisites: ["rationalizing-denominators"],
      generate(rng) {
        const p = rng.pick([1, 2, 3, 5, 6, 7, 10]);
        const a = rng.bool(0.5) && p > 1 ? p * rng.int(1, 4) : rng.int(1, 12);
        const root = sq(mono(p, 1));
        const answer = quotient(a, root, p, "x");
        return expressionProblem({
          prompt: t(
            `Rationalize the denominator and simplify: $\\frac{${a}}{${root}}$. Assume $x > 0$.`,
            `将分母有理化并化简：$\\frac{${a}}{${root}}$。假设 $x > 0$。`,
          ),
          answer,
          radical: true,
          positive: true,
          wrong: [quotient(a, root, 1, ""), quotient(a, root, p * p, "x^{2}"), quotient(a, "", p, "x"), quotient(a, root, 1, "x")],
          solution: t(
            `Multiply the numerator and the denominator by $${root}$:${steps(`\\frac{${a}}{${root}} = \\frac{${a}${root}}{${mono(p, 1)}}${quotient(a, root, p, "x") === `\\frac{${a}${root}}{${mono(p, 1)}}` ? "" : ` = ${answer}`}`)}`,
            `分子、分母同乘以 $${root}$：${steps(`\\frac{${a}}{${root}} = \\frac{${a}${root}}{${mono(p, 1)}}${quotient(a, root, p, "x") === `\\frac{${a}${root}}{${mono(p, 1)}}` ? "" : ` = ${answer}`}`)}`,
          ),
        });
      },
    },
    {
      id: "roots-of-quotients",
      title: t("Roots of fractions", "分式的平方根"),
      explanation: t(
        "To simplify the root of a fraction whose denominator is not a perfect square, split it with the quotient rule and rationalize:\n\n$$\\sqrt{\\frac{3x}{5y}} = \\frac{\\sqrt{3x}}{\\sqrt{5y}} = \\frac{\\sqrt{3x} \\cdot \\sqrt{5y}}{5y} = \\frac{\\sqrt{15xy}}{5y}$$",
        "化简分母不是完全平方式的分式的平方根时，先用除法法则拆开，再有理化：\n\n$$\\sqrt{\\frac{3x}{5y}} = \\frac{\\sqrt{3x}}{\\sqrt{5y}} = \\frac{\\sqrt{3x} \\cdot \\sqrt{5y}}{5y} = \\frac{\\sqrt{15xy}}{5y}$$",
      ),
      generate(rng) {
        let a: number;
        let b: number;
        do {
          [a, b] = [rng.pick([1, 2, 3, 5, 6, 7]), rng.pick([1, 2, 3, 5, 7])];
        } while (gcd(a, b) !== 1);
        const withX = rng.bool();
        const c = rng.pick([1, 1, 2, 3]);
        const inside = withX ? `\\frac{${mono(a, 1)}}{${mono(b, 0, 1)}}` : `\\frac{${a}}{${mono(b, 1)}}`;
        const [num_, den] = withX ? [mono(a * b, 1, 1), mono(b, 0, 1)] : [mono(a * b, 1), mono(b, 1)];
        const [dc, dv] = withX ? [b, "y"] : [b, "x"];
        const answer = quotient(c, sq(num_), dc, dv);
        const expr = `${c === 1 ? "" : c}${sq(inside)}`;
        return expressionProblem({
          prompt: t(`Simplify $${expr}$. Assume all variables are positive.`, `化简 $${expr}$。假设所有变量都是正数。`),
          answer,
          radical: true,
          positive: true,
          wrong: [
            quotient(c, sq(num_), 1, ""),
            quotient(c, sq(withX ? mono(a, 1) : String(a)), dc, dv),
            quotient(c, sq(num_), dc * dc, `${dv}^{2}`),
          ],
          solution: t(
            `Split the root and multiply the numerator and the denominator by $${sq(den)}$:${steps(`${expr} = \\frac{${c === 1 ? "" : c}${sq(withX ? mono(a, 1) : String(a))}}{${sq(den)}} = \\frac{${c === 1 ? "" : c}${sq(num_)}}{${den}}${quotient(c, sq(num_), dc, dv) === `\\frac{${c === 1 ? "" : c}${sq(num_)}}{${den}}` ? "" : ` = ${answer}`}`)}`,
            `把根式拆开，分子、分母同乘以 $${sq(den)}$：${steps(`${expr} = \\frac{${c === 1 ? "" : c}${sq(withX ? mono(a, 1) : String(a))}}{${sq(den)}} = \\frac{${c === 1 ? "" : c}${sq(num_)}}{${den}}${quotient(c, sq(num_), dc, dv) === `\\frac{${c === 1 ? "" : c}${sq(num_)}}{${den}}` ? "" : ` = ${answer}`}`)}`,
          ),
        });
      },
    },
    {
      id: "higher-powers-in-the-denominator",
      title: t("Higher powers in the denominator", "分母中的高次幂"),
      explanation: t(
        "Simplify the root in the denominator first, then multiply by the root that is left:\n\n$$\\frac{4}{\\sqrt{2x^{3}}} = \\frac{4}{x\\sqrt{2x}} = \\frac{4\\sqrt{2x}}{x \\cdot 2x} = \\frac{2\\sqrt{2x}}{x^{2}}$$",
        "先化简分母中的根式，再乘以剩下的根式：\n\n$$\\frac{4}{\\sqrt{2x^{3}}} = \\frac{4}{x\\sqrt{2x}} = \\frac{4\\sqrt{2x}}{x \\cdot 2x} = \\frac{2\\sqrt{2x}}{x^{2}}$$",
      ),
      generate(rng) {
        const p = rng.pick([1, 2, 3, 5, 6, 7]);
        const h = rng.int(1, 2);
        const a = rng.int(1, 12);
        const root = sq(mono(p, 1));
        const den = sq(mono(p, 2 * h + 1));
        const answer = quotient(a, root, p, pw("x", h + 1));
        return expressionProblem({
          prompt: t(
            `Rationalize the denominator and simplify: $\\frac{${a}}{${den}}$. Assume $x > 0$.`,
            `将分母有理化并化简：$\\frac{${a}}{${den}}$。假设 $x > 0$。`,
          ),
          answer,
          radical: true,
          positive: true,
          wrong: [quotient(a, root, p, pw("x", h)), quotient(a, root, p, pw("x", 2 * h + 1)), quotient(a, root, p, pw("x", 2 * h))],
          solution: t(
            `Simplify the root, then multiply by $${root}$:${steps(`\\frac{${a}}{${den}} = \\frac{${a}}{${radTerm(1, h, 0, p, 1, 0)}} = \\frac{${a}${root}}{${pw("x", h)} \\cdot ${mono(p, 1)}} = ${answer}`)}`,
            `先化简根式，再同乘以 $${root}$：${steps(`\\frac{${a}}{${den}} = \\frac{${a}}{${radTerm(1, h, 0, p, 1, 0)}} = \\frac{${a}${root}}{${pw("x", h)} \\cdot ${mono(p, 1)}} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
};

/** surdOf writes a + b√m in simplest form. */
const surdOf = (a: number, b: number, m: number) => surdLatex(surd(Q.of(a), Q.of(b), BigInt(m)));

/** rootSum writes c√p + d√q. */
const rootSum = (c: number, p: number, d: number, q: number) => joinTerms(radTerm(c, 0, 0, p, 0, 0), radTerm(d, 0, 0, q, 0, 0));

export const rationalizingTwoTermDenominators: TopicDef = {
  id: "rationalizing-two-term-denominators",
  title: t("Rationalizing Denominators With Two Terms", "两项分母的有理化"),
  summary: t(
    "Multiply by the conjugate to rationalize denominators such as $3 - \\sqrt{5}$ or $\\sqrt{7} + \\sqrt{3}$.",
    "乘以共轭式，把 $3 - \\sqrt{5}$、$\\sqrt{7} + \\sqrt{3}$ 这样的分母有理化。",
  ),
  prerequisites: ["rationalizing-denominators", "difference-of-squares-formula"],
  encompasses: [
    { topic: "rationalizing-denominators", weight: 0.4 },
    { topic: "difference-of-squares-formula", weight: 0.4 },
  ],
  xp: 16,
  standards: ["CCSS.HSN.RN.A.2"],
  knowledgePoints: [
    {
      id: "conjugate-products",
      title: t("Conjugates", "共轭式"),
      explanation: t(
        "$a + \\sqrt{b}$ and $a - \\sqrt{b}$ are **conjugates**: the same terms with the opposite sign between them. By the difference of squares, their product has no root:\n\n$$(3 + \\sqrt{5})(3 - \\sqrt{5}) = 3^{2} - (\\sqrt{5})^{2} = 9 - 5 = 4$$\n\nLikewise $(\\sqrt{7} + \\sqrt{3})(\\sqrt{7} - \\sqrt{3}) = 7 - 3 = 4$.",
        "$a + \\sqrt{b}$ 和 $a - \\sqrt{b}$ 互为**共轭式**：两项相同，中间的符号相反。由平方差公式，它们的乘积不含根式：\n\n$$(3 + \\sqrt{5})(3 - \\sqrt{5}) = 3^{2} - (\\sqrt{5})^{2} = 9 - 5 = 4$$\n\n同样，$(\\sqrt{7} + \\sqrt{3})(\\sqrt{7} - \\sqrt{3}) = 7 - 3 = 4$。",
      ),
      keyPrerequisites: ["difference-of-squares-formula"],
      generate(rng) {
        const kind = rng.pick(["number", "roots", "coefficient"] as const);
        let first: string;
        let second: string;
        let u: number;
        let v: number;
        let wrong: number[];
        if (kind === "number") {
          const a = rng.int(1, 9);
          const m = rng.pick(squareFree);
          [first, second, u, v] = [`${a}`, sq(String(m)), a * a, m];
          wrong = [a * a + m, a * a - m * m, 2 * a - m];
        } else if (kind === "roots") {
          const [p, q] = rng.sample(squareFree, 2) as [number, number];
          [first, second, u, v] = [sq(String(p)), sq(String(q)), p, q];
          wrong = [p + q, p * p - q * q];
        } else {
          const c = rng.int(2, 5);
          const m = rng.pick([2, 3, 5, 6, 7]);
          const a = rng.int(1, 9);
          [first, second, u, v] = [`${c}${sq(String(m))}`, `${a}`, c * c * m, a * a];
          wrong = [c * m - a * a, c * c * m + a * a, c * m * m - a * a];
        }
        const expr = rng.bool() ? `(${first} + ${second})(${first} - ${second})` : `(${first} - ${second})(${first} + ${second})`;
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
          answer: u - v,
          form: "integer",
          wrong,
          solution: t(
            `Use $(a + b)(a - b) = a^{2} - b^{2}$:${steps(`${expr} = (${first})^{2} - (${second})^{2} = ${u} - ${v} = ${u - v}`)}`,
            `运用 $(a + b)(a - b) = a^{2} - b^{2}$：${steps(`${expr} = (${first})^{2} - (${second})^{2} = ${u} - ${v} = ${u - v}`)}`,
          ),
        });
      },
    },
    {
      id: "number-and-root-denominators",
      title: t("Denominators such as $a + \\sqrt{b}$", "形如 $a + \\sqrt{b}$ 的分母"),
      explanation: t(
        "Multiply the numerator and the denominator by the conjugate of the denominator. The denominator becomes a whole number; then divide each term of the numerator by it:\n\n$$\\frac{8}{3 - \\sqrt{5}} = \\frac{8(3 + \\sqrt{5})}{(3 - \\sqrt{5})(3 + \\sqrt{5})} = \\frac{8(3 + \\sqrt{5})}{4} = 6 + 2\\sqrt{5}$$\n\nBoth the numerator and the denominator must be multiplied, and the sign in the conjugate is the opposite one.",
        "把分子和分母同乘以分母的共轭式。分母变成整数，再用它去除分子的每一项：\n\n$$\\frac{8}{3 - \\sqrt{5}} = \\frac{8(3 + \\sqrt{5})}{(3 - \\sqrt{5})(3 + \\sqrt{5})} = \\frac{8(3 + \\sqrt{5})}{4} = 6 + 2\\sqrt{5}$$\n\n分子和分母都要乘，共轭式中的符号要相反。",
      ),
      generate(rng) {
        let a: number;
        let m: number;
        do {
          [a, m] = [rng.int(1, 6), rng.pick(squareFree)];
        } while (a * a === m || Math.abs(a * a - m) > 12);
        const d = a * a - m;
        const s = rng.sign();
        const tt = rng.nonZero(-3, 3);
        const c = tt * d;
        const den = `${a} ${op(s)} ${sq(String(m))}`;
        const conj = `${a} ${op(-s)} ${sq(String(m))}`;
        const answer = surdOf(tt * a, -s * tt, m);
        const fraction = `${c < 0 ? "-" : ""}\\frac{${Math.abs(c)}}{${den}}`;
        return expressionProblem({
          prompt: t(`Rationalize the denominator and simplify: $${fraction}$.`, `将分母有理化并化简：$${fraction}$。`),
          answer,
          radical: true,
          wrong: [surdOf(tt * a, s * tt, m), surdOf(c * a, -s * c, m), String(tt), surdOf(-tt * a, s * tt, m)],
          solution: t(
            `Multiply by the conjugate $${conj}$:${steps(`${fraction} = \\frac{${c}(${conj})}{(${den})(${conj})} = \\frac{${c}(${conj})}{${d}} = ${answer}`)}`,
            `同乘以共轭式 $${conj}$：${steps(`${fraction} = \\frac{${c}(${conj})}{(${den})(${conj})} = \\frac{${c}(${conj})}{${d}} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "two-root-denominators",
      title: t("Denominators such as $\\sqrt{a} + \\sqrt{b}$", "形如 $\\sqrt{a} + \\sqrt{b}$ 的分母"),
      explanation: t(
        "The conjugate of $\\sqrt{a} + \\sqrt{b}$ is $\\sqrt{a} - \\sqrt{b}$, and their product is $a - b$:\n\n$$\\frac{6}{\\sqrt{5} + \\sqrt{2}} = \\frac{6(\\sqrt{5} - \\sqrt{2})}{5 - 2} = 2\\sqrt{5} - 2\\sqrt{2}$$",
        "$\\sqrt{a} + \\sqrt{b}$ 的共轭式是 $\\sqrt{a} - \\sqrt{b}$，它们的乘积是 $a - b$：\n\n$$\\frac{6}{\\sqrt{5} + \\sqrt{2}} = \\frac{6(\\sqrt{5} - \\sqrt{2})}{5 - 2} = 2\\sqrt{5} - 2\\sqrt{2}$$",
      ),
      generate(rng) {
        let p: number;
        let q: number;
        do {
          [p, q] = rng.sample([2, 3, 5, 6, 7, 10, 11, 13], 2) as [number, number];
        } while (Math.abs(p - q) > 8 || simplifyRadical(p * q)[0] !== 1);
        const s = rng.sign();
        const tt = rng.int(1, 3) * rng.sign();
        const d = p - q;
        const c = tt * d;
        const den = `${sq(String(p))} ${op(s)} ${sq(String(q))}`;
        const conj = `${sq(String(p))} ${op(-s)} ${sq(String(q))}`;
        const answer = rootSum(tt, p, -s * tt, q);
        const fraction = `${c < 0 ? "-" : ""}\\frac{${Math.abs(c)}}{${den}}`;
        return expressionProblem({
          prompt: t(`Rationalize the denominator and simplify: $${fraction}$.`, `将分母有理化并化简：$${fraction}$。`),
          answer,
          radical: true,
          wrong: [rootSum(tt, p, s * tt, q), rootSum(c, p, -s * c, q), rootSum(-tt, p, s * tt, q), String(tt)],
          solution: t(
            `Multiply by the conjugate $${conj}$:${steps(`${fraction} = \\frac{${c}(${conj})}{${p} - ${q}} = \\frac{${c}(${conj})}{${d}} = ${answer}`)}`,
            `同乘以共轭式 $${conj}$：${steps(`${fraction} = \\frac{${c}(${conj})}{${p} - ${q}} = \\frac{${c}(${conj})}{${d}} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
};

/** cubeOption writes c·∛(inside)/(d·bottom) with the coefficients reduced. */
const cubeOption = (c: number, inside: string, d: number, bottom: string) => same(`$${quotient(c, cb(inside), d, bottom)}$`);

export const furtherRationalizingDenominators: TopicDef = {
  id: "further-rationalizing-denominators",
  title: t("Further Rationalizing Denominators of Algebraic Expressions", "代数式分母有理化进阶"),
  summary: t(
    "Rationalize denominators such as $\\sqrt{x} - 3$, $\\sqrt{x + 2} + \\sqrt{x}$ and $\\sqrt[3]{2x}$.",
    "把 $\\sqrt{x} - 3$、$\\sqrt{x + 2} + \\sqrt{x}$、$\\sqrt[3]{2x}$ 这样的分母有理化。",
  ),
  prerequisites: ["rationalizing-algebraic-denominators", "rationalizing-two-term-denominators"],
  encompasses: [
    { topic: "rationalizing-algebraic-denominators", weight: 0.4 },
    { topic: "rationalizing-two-term-denominators", weight: 0.6 },
  ],
  xp: 16,
  standards: ["CCSS.HSN.RN.A.2"],
  knowledgePoints: [
    {
      id: "conjugates-with-variables",
      title: t("Conjugates with variables", "含变量的共轭式"),
      explanation: t(
        "For $x > 0$, $(\\sqrt{x} - 3)(\\sqrt{x} + 3) = x - 9$. So multiplying by the conjugate can make a numerator and denominator cancel:\n\n$$\\frac{x - 9}{\\sqrt{x} - 3} = \\frac{(x - 9)(\\sqrt{x} + 3)}{x - 9} = \\sqrt{x} + 3$$\n\nThe same holds with a coefficient: $\\frac{4x - 25}{2\\sqrt{x} + 5} = 2\\sqrt{x} - 5$.",
        "当 $x > 0$ 时，$(\\sqrt{x} - 3)(\\sqrt{x} + 3) = x - 9$。所以乘以共轭式可以让分子和分母约去：\n\n$$\\frac{x - 9}{\\sqrt{x} - 3} = \\frac{(x - 9)(\\sqrt{x} + 3)}{x - 9} = \\sqrt{x} + 3$$\n\n带系数时也一样：$\\frac{4x - 25}{2\\sqrt{x} + 5} = 2\\sqrt{x} - 5$。",
      ),
      generate(rng) {
        const p = rng.pick([1, 1, 2, 3]);
        const a = rng.int(1, 9);
        const s = rng.sign();
        const top = poly([p * p, "x"], [-a * a, ""]);
        const den = `${front(p)}\\sqrt{x} ${op(s)} ${a}`;
        const conj = `${front(p)}\\sqrt{x} ${op(-s)} ${a}`;
        const answer = joinTerms(`${front(p)}\\sqrt{x}`, String(-s * a));
        return expressionProblem({
          prompt: t(
            `Simplify $\\frac{${top}}{${den}}$ by rationalizing the denominator. Assume $x > 0$ and that the denominator is not $0$.`,
            `通过分母有理化化简 $\\frac{${top}}{${den}}$。假设 $x > 0$ 且分母不为 $0$。`,
          ),
          answer,
          radical: true,
          positive: true,
          wrong: [
            joinTerms(`${front(p)}\\sqrt{x}`, String(s * a)),
            joinTerms(mono(p, 1), String(-s * a)),
            joinTerms(`${front(p)}\\sqrt{x}`, String(-s * a * a)),
          ],
          solution: t(
            `Multiply by the conjugate $${conj}$; the denominator becomes $(${front(p)}\\sqrt{x})^{2} - ${a}^{2} = ${top}$:${steps(`\\frac{${top}}{${den}} = \\frac{(${top})(${conj})}{${top}} = ${answer}`)}`,
            `同乘以共轭式 $${conj}$；分母变为 $(${front(p)}\\sqrt{x})^{2} - ${a}^{2} = ${top}$：${steps(`\\frac{${top}}{${den}} = \\frac{(${top})(${conj})}{${top}} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "differences-of-roots-with-variables",
      title: t("Two roots with variables", "两个含变量的根式"),
      explanation: t(
        "The conjugate of $\\sqrt{x + 3} - \\sqrt{x}$ is $\\sqrt{x + 3} + \\sqrt{x}$, and their product is $(x + 3) - x = 3$:\n\n$$\\frac{6}{\\sqrt{x + 3} - \\sqrt{x}} = \\frac{6(\\sqrt{x + 3} + \\sqrt{x})}{3} = 2\\sqrt{x + 3} + 2\\sqrt{x}$$",
        "$\\sqrt{x + 3} - \\sqrt{x}$ 的共轭式是 $\\sqrt{x + 3} + \\sqrt{x}$，它们的乘积是 $(x + 3) - x = 3$：\n\n$$\\frac{6}{\\sqrt{x + 3} - \\sqrt{x}} = \\frac{6(\\sqrt{x + 3} + \\sqrt{x})}{3} = 2\\sqrt{x + 3} + 2\\sqrt{x}$$",
      ),
      generate(rng) {
        const b = rng.pick([0, 0, 1, 2, 3]);
        const a = b + rng.int(1, 8);
        const s = rng.sign();
        const tt = rng.int(1, 4);
        const c = tt * (a - b);
        const [u, v] = [linear(1, a), linear(1, b)];
        const den = `${sq(u)} ${op(s)} ${sq(v)}`;
        const conj = `${sq(u)} ${op(-s)} ${sq(v)}`;
        const term = (k: number, inside: string) => `${front(k)}${sq(inside)}`;
        const answer = joinTerms(term(tt, u), term(-s * tt, v));
        return expressionProblem({
          prompt: t(
            `Rationalize the denominator and simplify: $\\frac{${c}}{${den}}$. Assume $x > 0$.`,
            `将分母有理化并化简：$\\frac{${c}}{${den}}$。假设 $x > 0$。`,
          ),
          answer,
          radical: true,
          positive: true,
          wrong: [joinTerms(term(tt, u), term(s * tt, v)), joinTerms(term(c, u), term(-s * c, v)), term(tt, linear(2, a + b))],
          solution: t(
            `Multiply by the conjugate $${conj}$; the denominator becomes $(${u}) - (${v}) = ${a - b}$:${steps(`\\frac{${c}}{${den}} = \\frac{${c}(${conj})}{${a - b}} = ${answer}`)}`,
            `同乘以共轭式 $${conj}$；分母变为 $(${u}) - (${v}) = ${a - b}$：${steps(`\\frac{${c}}{${den}} = \\frac{${c}(${conj})}{${a - b}} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "cube-root-denominators",
      title: t("Cube roots in the denominator", "分母中的立方根"),
      explanation: t(
        "Multiplying $\\sqrt[3]{2x}$ by itself gives $\\sqrt[3]{4x^{2}}$, still not a cube. To make a perfect cube under the root, multiply by $\\sqrt[3]{4x^{2}}$, which supplies the missing factors: $\\sqrt[3]{2x} \\cdot \\sqrt[3]{4x^{2}} = \\sqrt[3]{8x^{3}} = 2x$.\n\n$$\\frac{6}{\\sqrt[3]{2x}} = \\frac{6\\sqrt[3]{4x^{2}}}{2x} = \\frac{3\\sqrt[3]{4x^{2}}}{x}$$",
        "$\\sqrt[3]{2x}$ 乘以它自己得到 $\\sqrt[3]{4x^{2}}$，仍不是立方。要让根号下成为完全立方，应乘以补足缺少因式的 $\\sqrt[3]{4x^{2}}$：$\\sqrt[3]{2x} \\cdot \\sqrt[3]{4x^{2}} = \\sqrt[3]{8x^{3}} = 2x$。\n\n$$\\frac{6}{\\sqrt[3]{2x}} = \\frac{6\\sqrt[3]{4x^{2}}}{2x} = \\frac{3\\sqrt[3]{4x^{2}}}{x}$$",
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5]);
        const e = rng.int(1, 2);
        const c = rng.int(1, 12);
        const den = cb(mono(p, e));
        const correct = cubeOption(c, mono(p * p, 3 - e), p, "x");
        const options = [
          correct,
          cubeOption(c, mono(p, e), p, pw("x", e)),
          cubeOption(c, mono(p, 3 - e), p, "x"),
          cubeOption(c, mono(p * p, 3 - e), p * p, pw("x", 3 - e)),
        ];
        const shuffled = rng.shuffle(options);
        return choiceProblem({
          prompt: t(
            `Which expression equals $\\frac{${c}}{${den}}$ with a rationalized denominator? Assume $x \\ne 0$.`,
            `哪个式子等于 $\\frac{${c}}{${den}}$ 并且分母已有理化？假设 $x \\ne 0$。`,
          ),
          options: shuffled,
          correct: shuffled.indexOf(correct),
          solution: t(
            `Multiply by $${cb(mono(p * p, 3 - e))}$ to make a perfect cube:${steps(`\\frac{${c}}{${den}} = \\frac{${c}${cb(mono(p * p, 3 - e))}}{${cb(mono(p ** 3, 3))}} = \\frac{${c}${cb(mono(p * p, 3 - e))}}{${mono(p, 1)}}${c % p === 0 ? ` = ${quotient(c, cb(mono(p * p, 3 - e)), p, "x")}` : ""}`)}`,
            `同乘以 $${cb(mono(p * p, 3 - e))}$，凑成完全立方：${steps(`\\frac{${c}}{${den}} = \\frac{${c}${cb(mono(p * p, 3 - e))}}{${cb(mono(p ** 3, 3))}} = \\frac{${c}${cb(mono(p * p, 3 - e))}}{${mono(p, 1)}}${c % p === 0 ? ` = ${quotient(c, cb(mono(p * p, 3 - e)), p, "x")}` : ""}`)}`,
          ),
        });
      },
    },
  ],
};

/** listSolutions tells the learner how to enter a solution set. */
const listSolutions = t(
  "Enter all real solutions separated by commas, or $\\varnothing$ if there are none.",
  "请用逗号分隔写出所有实数解；如果没有实数解，请输入 $\\varnothing$。",
);

/** solve asks to solve an equation. */
const solve = (eq: string) => t(`Solve $${eq}$. ${listSolutions.en}`, `解方程 $${eq}$。${listSolutions["zh-CN"]}`);

/** check writes the check of a candidate solution in both locales. */
const checkText = (x: number | Q, valid: boolean, work: string): Text =>
  valid
    ? t(`Check: ${work}, so $x = ${num(x)}$ is the solution.`, `检验：${work}，所以 $x = ${num(x)}$ 是方程的解。`)
    : t(
        `Check: ${work}, so $x = ${num(x)}$ is extraneous and the equation has no solution.`,
        `检验：${work}，所以 $x = ${num(x)}$ 是增根，方程无解。`,
      );

export const solvingRadicalEquations: TopicDef = {
  id: "solving-radical-equations",
  title: t("Solving Radical Equations", "解根式方程"),
  summary: t(
    "Solve equations with square roots by isolating the root and squaring both sides, and reject extraneous solutions.",
    "分离根式后两边平方来解含平方根的方程，并舍去增根。",
  ),
  prerequisites: ["solving-equations-with-square-roots", "squaring-binomials", "equations-with-variables-on-both-sides"],
  encompasses: [
    { topic: "equations-with-variables-on-both-sides", weight: 0.4 },
    { topic: "two-step-equations", weight: 0.4 },
    { topic: "squaring-binomials", weight: 0.2 },
    { topic: "solving-equations-with-square-roots", weight: 0.2 },
  ],
  xp: 20,
  standards: ["CCSS.HSA.REI.A.2"],
  knowledgePoints: [
    {
      id: "squaring-both-sides",
      title: t("Squaring both sides", "两边平方"),
      explanation: t(
        "To undo a square root, square both sides, then solve:\n\n$$\\sqrt{2x + 3} = 5 ;\\Rightarrow; 2x + 3 = 25 ;\\Rightarrow; x = 11$$\n\nA square root is never negative, so an equation such as $\\sqrt{2x + 3} = -5$ has **no solution**. Squaring would give $x = 11$ anyway, but $\\sqrt{25} = 5 \\ne -5$: squaring can create **extraneous** solutions, so always check the answer in the original equation.",
        "要消去平方根，就把两边平方，再求解：\n\n$$\\sqrt{2x + 3} = 5 ;\\Rightarrow; 2x + 3 = 25 ;\\Rightarrow; x = 11$$\n\n平方根永远不是负数，所以 $\\sqrt{2x + 3} = -5$ 这样的方程**无解**。平方后仍会得到 $x = 11$，但 $\\sqrt{25} = 5 \\ne -5$：平方可能产生**增根**，所以一定要把答案代回原方程检验。",
      ),
      generate(rng) {
        const x0 = rng.nonZero(-12, 12);
        const a = rng.pick([1, 2, 3, 4, 5, -1, -2, -3]);
        const c = rng.int(1, 8);
        const b = c * c - a * x0;
        const negative = rng.bool(0.25);
        const rhs = negative ? -c : c;
        const eq = `${sq(linear(a, b))} = ${rhs}`;
        const work = `\\sqrt{${substituted(a, x0, b)}} = \\sqrt{${c * c}} = ${c}`;
        return solutionsProblem({
          prompt: solve(eq),
          values: negative ? [] : [num(x0)],
          wrong: negative ? [[num(x0)]] : [[num(Q.of(rhs - b, a))], []],
          solution: t(
            `Square both sides and solve:${steps(`${linear(a, b)} = ${c * c}`, `x = ${x0}`)}${checkText(x0, !negative, `$${work}${negative ? ` \\ne ${rhs}` : ""}$`).en}`,
            `两边平方并求解：${steps(`${linear(a, b)} = ${c * c}`, `x = ${x0}`)}${checkText(x0, !negative, `$${work}${negative ? ` \\ne ${rhs}` : ""}$`)["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "isolating-the-root",
      title: t("Isolating the root first", "先分离根式"),
      explanation: t(
        "Isolate the square root before squaring; squaring $3\\sqrt{x} + 1$ as it stands would not remove the root.\n\n$$3\\sqrt{x - 2} + 1 = 13 ;\\Rightarrow; \\sqrt{x - 2} = 4 ;\\Rightarrow; x - 2 = 16 ;\\Rightarrow; x = 18$$\n\nIf the isolated root equals a negative number, there is no solution.",
        "先分离出平方根再平方；直接平方 $3\\sqrt{x} + 1$ 并不能消去根号。\n\n$$3\\sqrt{x - 2} + 1 = 13 ;\\Rightarrow; \\sqrt{x - 2} = 4 ;\\Rightarrow; x - 2 = 16 ;\\Rightarrow; x = 18$$\n\n如果分离出的根式等于负数，方程无解。",
      ),
      keyPrerequisites: ["two-step-equations"],
      generate(rng) {
        const k = rng.pick([1, 2, 3, 4]);
        const d = rng.nonZero(-10, 10);
        const a = rng.pick([1, 1, 2, 3, -1]);
        const x0 = rng.nonZero(-10, 10);
        const c = rng.int(1, 6);
        const b = c * c - a * x0;
        const negative = rng.bool(0.25);
        const r = negative ? -c : c;
        const e = k * r + d;
        const eq = `${front(k)}${sq(linear(a, b))} ${op(d)} ${Math.abs(d)} = ${e}`;
        const isolated = `${sq(linear(a, b))} = ${r}`;
        const skipDivide = Q.of((e - d) ** 2 - b, a);
        return solutionsProblem({
          prompt: solve(eq),
          values: negative ? [] : [num(x0)],
          wrong: negative ? [[num(x0)]] : [...(k > 1 ? [[num(skipDivide)]] : []), [num(Q.of(r - b, a))]],
          solution: negative
            ? t(
                `Isolate the root:${steps(isolated)}A square root is never negative, so there is no solution.`,
                `分离根式：${steps(isolated)}平方根不可能是负数，所以方程无解。`,
              )
            : t(
                `Isolate the root, square both sides and solve:${steps(isolated, `${linear(a, b)} = ${c * c}`, `x = ${x0}`)}`,
                `分离根式，两边平方并求解：${steps(isolated, `${linear(a, b)} = ${c * c}`, `x = ${x0}`)}`,
              ),
        });
      },
    },
    {
      id: "roots-on-both-sides",
      title: t("Roots on both sides", "两边都有根式"),
      explanation: t(
        "When each side is a square root, squaring removes both:\n\n$$\\sqrt{3x - 1} = \\sqrt{x + 7} ;\\Rightarrow; 3x - 1 = x + 7 ;\\Rightarrow; x = 4$$\n\nCheck that the radicands are not negative at the solution: if they are, the roots are undefined there and the solution is extraneous.",
        "当两边都是平方根时，平方后两个根号都消去：\n\n$$\\sqrt{3x - 1} = \\sqrt{x + 7} ;\\Rightarrow; 3x - 1 = x + 7 ;\\Rightarrow; x = 4$$\n\n检验解处的被开方式不是负数：如果是负数，根式在那里没有意义，这个解就是增根。",
      ),
      keyPrerequisites: ["equations-with-variables-on-both-sides"],
      generate(rng) {
        let a: number;
        let c: number;
        do {
          [a, c] = [rng.nonZero(-4, 6), rng.nonZero(-4, 6)];
        } while (a === c);
        const x0 = rng.nonZero(-9, 9);
        const v = rng.bool(0.3) ? -rng.int(1, 12) : rng.int(0, 20);
        const [b, d] = [v - a * x0, v - c * x0];
        const eq = `${sq(linear(a, b))} = ${sq(linear(c, d))}`;
        const valid = v >= 0;
        return solutionsProblem({
          prompt: solve(eq),
          values: valid ? [num(x0)] : [],
          wrong: valid ? [[], [num(Q.of(b + d, c - a))]] : [[num(x0)]],
          solution: t(
            `Square both sides and solve:${steps(`${linear(a, b)} = ${linear(c, d)}`, `x = ${x0}`)}${checkText(x0, valid, `at $x = ${x0}$ both radicands equal $${v}$${valid ? "" : ", and the square root of a negative number is not a real number"}`).en}`,
            `两边平方并求解：${steps(`${linear(a, b)} = ${linear(c, d)}`, `x = ${x0}`)}${checkText(x0, valid, `当 $x = ${x0}$ 时两个被开方式都等于 $${v}$${valid ? "" : "，而负数的平方根不是实数"}`)["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "extraneous-solutions",
      title: t("Extraneous solutions", "增根"),
      explanation: t(
        "When the other side contains $x$, squaring can produce a solution that makes it negative. Such a solution is extraneous:\n\n$$\\sqrt{x^{2} + 7} = x + 1 ;\\Rightarrow; x^{2} + 7 = x^{2} + 2x + 1 ;\\Rightarrow; x = 3$$\n\nCheck: $\\sqrt{16} = 4 = 3 + 1$, so $x = 3$ is a solution. For $x = \\sqrt{2x^{2} - 9}$, squaring gives $x^{2} = 9$, but $x = -3$ makes the left side negative while the root is positive, so only $x = 3$ is a solution.",
        "当另一边含有 $x$ 时，平方可能得到使这一边为负的解，这样的解就是增根：\n\n$$\\sqrt{x^{2} + 7} = x + 1 ;\\Rightarrow; x^{2} + 7 = x^{2} + 2x + 1 ;\\Rightarrow; x = 3$$\n\n检验：$\\sqrt{16} = 4 = 3 + 1$，所以 $x = 3$ 是解。对于 $x = \\sqrt{2x^{2} - 9}$，平方得到 $x^{2} = 9$，但 $x = -3$ 使左边为负而根式为正，所以只有 $x = 3$ 是解。",
      ),
      keyPrerequisites: ["squaring-binomials"],
      generate(rng) {
        if (rng.bool(0.6)) {
          const c = rng.nonZero(-6, 6);
          const x0 = rng.nonZero(-8, 8);
          const b = 2 * c * x0 + c * c;
          const valid = x0 + c >= 0;
          const eq = `${sq(poly([1, "x^{2}"], [b, ""]))} = ${linear(1, c)}`;
          return solutionsProblem({
            prompt: solve(eq),
            values: valid ? [num(x0)] : [],
            wrong: valid ? [[]] : [[num(x0)]],
            solution: t(
              `Square both sides; the $x^{2}$ terms cancel:${steps(`${poly([1, "x^{2}"], [b, ""])} = ${poly([1, "x^{2}"], [2 * c, "x"], [c * c, ""])}`, `${2 * c}x = ${b - c * c}`, `x = ${x0}`)}${checkText(x0, valid, `the right side is $${x0} ${op(c)} ${Math.abs(c)} = ${x0 + c}$${valid ? `, which equals $\\sqrt{${(x0 + c) ** 2}}$` : ", but a square root is never negative"}`).en}`,
              `两边平方，$x^{2}$ 项相互抵消：${steps(`${poly([1, "x^{2}"], [b, ""])} = ${poly([1, "x^{2}"], [2 * c, "x"], [c * c, ""])}`, `${2 * c}x = ${b - c * c}`, `x = ${x0}`)}${checkText(x0, valid, `右边为 $${x0} ${op(c)} ${Math.abs(c)} = ${x0 + c}$${valid ? `，等于 $\\sqrt{${(x0 + c) ** 2}}$` : "，但平方根不可能是负数"}`)["zh-CN"]}`,
            ),
          });
        }
        const r = rng.int(1, 9);
        const a = rng.int(2, 4);
        const s = rng.sign();
        const b = -(a - 1) * r * r;
        const inside = poly([a, "x^{2}"], [b, ""]);
        const eq = `${s < 0 ? "-" : ""}x = ${sq(inside)}`;
        const x0 = s * r;
        return solutionsProblem({
          prompt: solve(eq),
          values: [num(x0)],
          wrong: [[num(r), num(-r)], [num(-x0)]],
          solution: t(
            `Square both sides:${steps(`x^{2} = ${inside}`, `${a - 1 === 1 ? "" : a - 1}x^{2} = ${-b}`, `x = \\pm ${r}`)}The root is not negative, so $${s < 0 ? "-" : ""}x \\ge 0$; only $x = ${x0}$ is a solution, and $x = ${-x0}$ is extraneous.`,
            `两边平方：${steps(`x^{2} = ${inside}`, `${a - 1 === 1 ? "" : a - 1}x^{2} = ${-b}`, `x = \\pm ${r}`)}根式不是负数，所以 $${s < 0 ? "-" : ""}x \\ge 0$；只有 $x = ${x0}$ 是解，$x = ${-x0}$ 是增根。`,
          ),
        });
      },
    },
  ],
};

/** radicalExpressionTopics are Algebra I's radical expression topics, in teaching order. */
export const radicalExpressionTopics: readonly TopicDef[] = [
  squareRootsOfAlgebraicPerfectSquares,
  squareRootsWithDomainRestrictions,
  cubeRootsOfAlgebraicPerfectCubes,
  simplifyingSquareRootsWithVariables,
  multiplyingRadicalExpressions,
  quotientRuleForSquareRoots,
  evaluatingRadicalExpressions,
  addingAndSubtractingRadicalExpressions,
  rationalizingAlgebraicDenominators,
  rationalizingTwoTermDenominators,
  furtherRationalizingDenominators,
  solvingRadicalEquations,
];
