import type { Figure, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { gcd, linear, num, paren, poly, Q, simplifyRadical, surd, surdLatex } from "@ga/subject-math";

import { graphFigure } from "../graph-figures.ts";
import { choiceProblem, expressionProblem, numberProblem, radicalProblem, solutionsProblem, steps, why } from "../problems.ts";
import { front, mono, pw, solvePrompt, squareFree } from "../solution-kit.ts";

/** vp writes the variable part xᵃyᵇ of a monomial. */
const vp = (x: number, y = 0) => `${pw("x", x)}${pw("y", y)}`;

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
  encompasses: [{ topic: "square-roots-and-cube-roots", weight: 0.3 }],
  xp: 10,
  standards: ["CCSS.HSN.RN.A.2"],
  intro: t(
    `For numbers, $\\sqrt{49} = 7$ because $7^{2} = 49$: the square root of a number is the number that, squared, gives it back (the one that is not negative). The same question can be asked of an expression. What squared gives $x^{6}$?

By the power rule, $(x^{3})^{2} = x^{3 \\cdot 2} = x^{6}$, so

$$\\sqrt{x^{6}} = x^{3}.$$

Squaring doubles an exponent, so taking a square root **halves** it. That is why only even powers are perfect squares. A coefficient is handled as before: $\\sqrt{49x^{6}} = 7x^{3}$, since $(7x^{3})^{2} = 49x^{6}$.

In this lesson every variable is positive, so the root $x^{3}$ is positive as a square root must be. (When a variable can be negative, an absolute value is needed; that is the next lesson.) We take square roots of monomials in one variable, then in several variables, then of fractions.`,
    `对数来说，$\\sqrt{49} = 7$，因为 $7^{2} = 49$：一个数的平方根就是平方后能得回它的那个数（取不是负数的那一个）。对代数式也可以问同样的问题：什么式子平方后得到 $x^{6}$？

由幂的乘方法则，$(x^{3})^{2} = x^{3 \\cdot 2} = x^{6}$，所以

$$\\sqrt{x^{6}} = x^{3}.$$

平方使指数加倍，所以开平方使指数**减半**。正因为如此，只有偶次幂才是完全平方。系数照以前的方法处理：$\\sqrt{49x^{6}} = 7x^{3}$，因为 $(7x^{3})^{2} = 49x^{6}$。

这节课中所有变量都是正数，所以 $x^{3}$ 是正数，符合平方根不为负的要求。（变量可以为负时需要加绝对值，那是下一节的内容。）我们先求单个变量的单项式的平方根，再求多个变量的，最后求分式的。`,
  ),
  knowledgePoints: [
    {
      id: "square-roots-of-monomials",
      title: t("Square roots of monomials", "单项式的平方根"),
      explanation: t(
        `A product of two squares is a square: $a^{2}b^{2} = (ab)^{2}$. So the square root of a monomial splits into the root of its coefficient times the root of its variable part,

$$\\sqrt{ab} = \\sqrt{a} \\cdot \\sqrt{b},$$

and each part is found on its own. For $\\sqrt{49x^{6}}$: the coefficient gives $\\sqrt{49} = 7$, and the power gives $\\sqrt{x^{6}} = x^{3}$, since squaring $x^{3}$ doubles its exponent back to $6$:

$$\\sqrt{49x^{6}} = \\sqrt{49} \\cdot \\sqrt{x^{6}} = 7x^{3}.$$

Squaring the result is a quick test: $(7x^{3})^{2} = 49x^{6}$.

> **Watch out.** Take the square root of **both** parts. Writing $7x^{6}$ forgets to halve the exponent, and writing $49x^{3}$ forgets to take the root of the coefficient. The exponent is halved, not square-rooted: $\\sqrt{x^{8}}$ is $x^{4}$, not $x^{2}$.`,
        `两个平方的乘积还是平方：$a^{2}b^{2} = (ab)^{2}$。所以单项式的平方根可以拆成系数的平方根乘以变量部分的平方根，

$$\\sqrt{ab} = \\sqrt{a} \\cdot \\sqrt{b},$$

两部分分别求。对 $\\sqrt{49x^{6}}$：系数给出 $\\sqrt{49} = 7$，幂给出 $\\sqrt{x^{6}} = x^{3}$，因为把 $x^{3}$ 平方，指数又加倍回到 $6$：

$$\\sqrt{49x^{6}} = \\sqrt{49} \\cdot \\sqrt{x^{6}} = 7x^{3}.$$

把结果平方就能快速检验：$(7x^{3})^{2} = 49x^{6}$。

> **注意。** **两部分**都要开方。写成 $7x^{6}$ 是忘了把指数减半，写成 $49x^{3}$ 是忘了给系数开方。指数是减半，不是开方：$\\sqrt{x^{8}}$ 是 $x^{4}$，不是 $x^{2}$。`,
      ),
      generate(rng) {
        const k = rng.int(1, 12);
        const a = rng.int(1, 5);
        const v = rng.pick(["x", "x", "y"] as const);
        const term = (c: number, e: number) => poly([c, pw(v, e)]);
        const inside = term(k * k, 2 * a);
        const answer = term(k, a);
        const coef =
          k === 1
            ? t("The coefficient is $1$, so only the power needs a root.", "系数是 $1$，所以只需给幂开方。")
            : t(
                `**Step 1: the coefficient.** $${k}^{2} = ${k * k}$, so $\\sqrt{${k * k}} = ${k}$.`,
                `**第一步：系数。** $${k}^{2} = ${k * k}$，所以 $\\sqrt{${k * k}} = ${k}$。`,
              );
        const power = t(
          `${k === 1 ? "" : "**Step 2: the power.** "}Squaring $${pw(v, a)}$ doubles its exponent, $(${pw(v, a)})^{2} = ${pw(v, 2 * a)}$, so halve $${2 * a}$: $\\sqrt{${pw(v, 2 * a)}} = ${pw(v, a)}$.`,
          `${k === 1 ? "" : "**第二步：幂。** "}把 $${pw(v, a)}$ 平方，指数加倍：$(${pw(v, a)})^{2} = ${pw(v, 2 * a)}$，所以把 $${2 * a}$ 减半：$\\sqrt{${pw(v, 2 * a)}} = ${pw(v, a)}$。`,
        );
        const work = steps(`${sq(inside)} = ${k === 1 ? "" : `\\sqrt{${k * k}} \\cdot `}\\sqrt{${pw(v, 2 * a)}} = ${answer}`);
        return expressionProblem({
          prompt: simplifyPositive(sq(inside)),
          answer,
          radical: true,
          positive: true,
          wrong: [term(k, 2 * a), term(k * k, a), ...(a > 1 ? [term(k, a * a)] : [])],
          solution: t(
            `${coef.en}\n\n${power.en}${work}**Check.** Squaring the answer must give back the expression under the root: $(${answer})^{2} = ${k === 1 ? "" : `${k}^{2} \\cdot (${pw(v, a)})^{2} = `}${inside}$.`,
            `${coef["zh-CN"]}\n\n${power["zh-CN"]}${work}**检验。** 把答案平方，应当得回根号下的式子：$(${answer})^{2} = ${k === 1 ? "" : `${k}^{2} \\cdot (${pw(v, a)})^{2} = `}${inside}$。`,
          ),
        });
      },
    },
    {
      id: "square-roots-with-several-variables",
      title: t("Several variables", "多个变量"),
      explanation: t(
        `With several variables the product rule splits the root into one root per factor, and each is taken separately: the root of the coefficient, and half of each exponent.

$$\\sqrt{36x^{4}y^{10}} = \\sqrt{36} \\cdot \\sqrt{x^{4}} \\cdot \\sqrt{y^{10}} = 6x^{2}y^{5}$$

Squaring checks it: $(6x^{2}y^{5})^{2} = 36x^{4}y^{10}$. This also shows when a monomial is a perfect square at all: its coefficient must be a perfect square and **every** exponent must be even, since each exponent is twice something.

> **Watch out.** Every exponent is halved, not only the first one: $\\sqrt{x^{4}y^{10}}$ is $x^{2}y^{5}$, not $x^{2}y^{10}$. And the coefficient needs its own root: $36$ becomes $6$, not $36$.`,
        `有多个变量时，乘法法则把根式拆成每个因式各自的根式，分别求：系数开方，每个指数减半。

$$\\sqrt{36x^{4}y^{10}} = \\sqrt{36} \\cdot \\sqrt{x^{4}} \\cdot \\sqrt{y^{10}} = 6x^{2}y^{5}$$

平方检验：$(6x^{2}y^{5})^{2} = 36x^{4}y^{10}$。这也说明了单项式什么时候是完全平方式：系数必须是完全平方数，并且**每个**指数都必须是偶数，因为每个指数都是某个数的两倍。

> **注意。** 每个指数都要减半，不只是第一个：$\\sqrt{x^{4}y^{10}}$ 是 $x^{2}y^{5}$，不是 $x^{2}y^{10}$。系数也要开方：$36$ 变成 $6$，而不是保持 $36$。`,
      ),
      generate(rng) {
        const k = rng.int(1, 10);
        const a = rng.int(1, 4);
        const b = rng.int(1, 4);
        const inside = mono(k * k, 2 * a, 2 * b);
        const answer = mono(k, a, b);
        const work = steps(
          `${sq(inside)} = ${k === 1 ? "" : `\\sqrt{${k * k}} \\cdot `}\\sqrt{${pw("x", 2 * a)}} \\cdot \\sqrt{${pw("y", 2 * b)}} = ${answer}`,
        );
        return expressionProblem({
          prompt: simplifyPositive(sq(inside)),
          answer,
          radical: true,
          positive: true,
          wrong: [mono(k, 2 * a, 2 * b), mono(k * k, a, b), mono(k, a, 2 * b), mono(k, 2 * a, b)],
          solution: t(
            `Split the root into one root per factor. ${k === 1 ? "The coefficient is $1$." : `The coefficient gives $\\sqrt{${k * k}} = ${k}$.`} Each exponent is halved: $${2 * a}$ becomes $${a}$ and $${2 * b}$ becomes $${b}$.${work}**Check.** $(${answer})^{2} = ${mono(k * k, 2 * a, 2 * b)}$: squaring doubles each exponent back and squares the coefficient, giving the expression under the root.`,
            `把根式拆成每个因式各自的根式。${k === 1 ? "系数是 $1$。" : `系数给出 $\\sqrt{${k * k}} = ${k}$。`}每个指数减半：$${2 * a}$ 变成 $${a}$，$${2 * b}$ 变成 $${b}$。${work}**检验。** $(${answer})^{2} = ${mono(k * k, 2 * a, 2 * b)}$：平方使每个指数加倍回去、系数平方，得到的正是根号下的式子。`,
          ),
        });
      },
    },
    {
      id: "square-roots-of-fractions-with-variables",
      title: t("Fractions", "分式"),
      explanation: t(
        `Squaring a fraction squares its numerator and its denominator: $\\left(\\frac{a}{b}\\right)^{2} = \\frac{a^{2}}{b^{2}}$. Read backwards, the root of a fraction is the root of the numerator over the root of the denominator:

$$\\sqrt{\\frac{25x^{4}}{9y^{2}}} = \\frac{\\sqrt{25x^{4}}}{\\sqrt{9y^{2}}} = \\frac{5x^{2}}{3y}.$$

Each of the two roots is a monomial root, done as before: the coefficient's root and half of each exponent. Squaring the answer gives $\\frac{25x^{4}}{9y^{2}}$ back.

> **Watch out.** The denominator needs a root too, number and all: $\\sqrt{9y^{2}}$ is $3y$, so leaving $9$ or $y^{2}$ in the denominator is wrong. Halve the exponents on both sides of the fraction bar.`,
        `把分式平方，就是把分子和分母都平方：$\\left(\\frac{a}{b}\\right)^{2} = \\frac{a^{2}}{b^{2}}$。反过来读，分式的平方根等于分子的平方根除以分母的平方根：

$$\\sqrt{\\frac{25x^{4}}{9y^{2}}} = \\frac{\\sqrt{25x^{4}}}{\\sqrt{9y^{2}}} = \\frac{5x^{2}}{3y}.$$

两个根式都是单项式的平方根，照以前的方法求：系数开方，每个指数减半。把答案平方，就得回 $\\frac{25x^{4}}{9y^{2}}$。

> **注意。** 分母也要开方，包括其中的数：$\\sqrt{9y^{2}}$ 是 $3y$，所以分母里留下 $9$ 或 $y^{2}$ 都是错的。分数线上下的指数都要减半。`,
      ),
      generate(rng) {
        const [k, m] = coprime(rng, [1, 9], [2, 9]);
        const a = rng.int(1, 4);
        const b = rng.int(0, 3);
        const inside = `\\frac{${mono(k * k, 2 * a)}}{${mono(m * m, 0, 2 * b)}}`;
        const answer = quotient(k, vp(a), m, vp(0, b));
        const work = steps(`${sq(inside)} = \\frac{${sq(mono(k * k, 2 * a))}}{${sq(mono(m * m, 0, 2 * b))}} = ${answer}`);
        return expressionProblem({
          prompt: simplifyPositive(sq(inside)),
          answer,
          radical: true,
          positive: true,
          wrong: [quotient(k, vp(a), m * m, vp(0, b)), quotient(k, vp(a), m, vp(0, 2 * b)), quotient(k * k, vp(a), m * m, vp(0, b))],
          solution: t(
            `The root of a fraction is the root of the numerator over the root of the denominator:${work}On top, ${k === 1 ? "" : `$\\sqrt{${k * k}} = ${k}$ and `}$\\sqrt{${pw("x", 2 * a)}} = ${pw("x", a)}$; below, $\\sqrt{${m * m}} = ${m}$${b === 0 ? "" : ` and $\\sqrt{${pw("y", 2 * b)}} = ${pw("y", b)}$`}.

**Check.** $\\left(${answer}\\right)^{2} = \\frac{(${mono(k, a)})^{2}}{(${mono(m, 0, b)})^{2}} = ${inside}$.`,
            `分式的平方根等于分子的平方根除以分母的平方根：${work}分子上，${k === 1 ? "" : `$\\sqrt{${k * k}} = ${k}$，`}$\\sqrt{${pw("x", 2 * a)}} = ${pw("x", a)}$；分母上，$\\sqrt{${m * m}} = ${m}$${b === 0 ? "" : `，$\\sqrt{${pw("y", 2 * b)}} = ${pw("y", b)}$`}。

**检验。** $\\left(${answer}\\right)^{2} = \\frac{(${mono(k, a)})^{2}}{(${mono(m, 0, b)})^{2}} = ${inside}$。`,
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

/** absoluteRootIntro draws y = √(x²), which is y = |x|, beside the line y = x that it leaves for negative x. */
const absoluteRootIntro: Figure = graphFigure(
  { xMin: -5, xMax: 5, yMin: -5, yMax: 5 },
  [
    { kind: "line", a: [0, 0], b: [1, 1], dashed: true },
    { kind: "curve", f: (x) => Math.abs(x), accent: true },
    { kind: "point", at: [-3, 3], label: "(-3, 3)", dir: "w", tone: "result" },
    { kind: "point", at: [-3, -3], label: "(-3, -3)", dir: "e", open: true },
    { kind: "label", at: [3.2, 4.6], text: "y = √(x²)", dir: "w" },
  ],
  "The graph of y = √(x²), a V with its corner at the origin, and the dashed line y = x. For x ≥ 0 they agree; for negative x the root stays above the axis: at x = −3 it is 3, not −3.",
  "y = √(x²) 的图象是顶点在原点的 V 形，虚线是 y = x。x ≥ 0 时两者重合；x 为负时根式仍在 x 轴上方：x = −3 时它等于 3，而不是 −3。",
);

/** oddTest gives test values −1 or 1 for x and y that make exactly one odd power negative, so that a missing absolute value shows. */
function oddTest(hx: number, hy: number): readonly [number, number] {
  if (hx % 2 === 1) return [-1, 1];
  return [1, hy % 2 === 1 ? -1 : 1];
}

export const squareRootsWithDomainRestrictions: TopicDef = {
  id: "square-roots-with-domain-restrictions",
  title: t("The Square Root of a Perfect Square With Domain Restrictions", "带取值范围的完全平方的平方根"),
  summary: t(
    "Use $\\sqrt{a^{2}} = |a|$ when the variables can be negative, and remove the absolute value when the domain allows it.",
    "当变量可以为负时使用 $\\sqrt{a^{2}} = |a|$，并在取值范围允许时去掉绝对值。",
  ),
  prerequisites: ["square-roots-of-algebraic-perfect-squares", "squaring-binomials"],
  encompasses: [{ topic: "square-roots-of-algebraic-perfect-squares", weight: 0.6 }],
  xp: 14,
  standards: ["CCSS.HSN.RN.A.2"],
  intro: t(
    `So far the variables were positive, and $\\sqrt{x^{2}} = x$. Now let $x$ be any real number. Try $x = -3$:

$$\\sqrt{(-3)^{2}} = \\sqrt{9} = 3.$$

The answer is $3$, not $-3$. Squaring erases the sign, and the square root, which is never negative, cannot bring it back. So for negative $x$ the root is $-x$, and for positive $x$ it is $x$: in both cases it is the **absolute value**,

$$\\sqrt{x^{2}} = |x|.$$

The graph of $y = \\sqrt{x^{2}}$ shows it. It follows the line $y = x$ to the right of the origin and turns up on the left:

{{figure 0}}

In this lesson we simplify square roots of squares when the variables can be negative, first for powers, then for squared binomials, and finally remove the absolute value when the values of $x$ are restricted to one side.`,
    `前面变量都是正数，所以 $\\sqrt{x^{2}} = x$。现在让 $x$ 取任意实数。试一试 $x = -3$：

$$\\sqrt{(-3)^{2}} = \\sqrt{9} = 3.$$

结果是 $3$，而不是 $-3$。平方把符号抹去了，而平方根永远不是负数，没法把符号找回来。所以 $x$ 为负时根式等于 $-x$，$x$ 为正时等于 $x$：两种情况合起来就是**绝对值**，

$$\\sqrt{x^{2}} = |x|.$$

$y = \\sqrt{x^{2}}$ 的图象说明了这一点：在原点右边它与直线 $y = x$ 重合，在左边则向上折起：

{{figure 0}}

这节课先化简变量可以为负时幂的平方根，再化简二项式平方的平方根，最后在 $x$ 的取值限定在一侧时去掉绝对值。`,
  ),
  introFigures: [absoluteRootIntro],
  knowledgePoints: [
    {
      id: "square-root-of-x-squared",
      title: t("$\\sqrt{x^{2}} = |x|$", "$\\sqrt{x^{2}} = |x|$"),
      explanation: t(
        `Halving the exponent still finds a number whose square is the radicand, but that number must also be **not negative** to be the square root. So look at each power that comes out:

- an **odd** power such as $x$ or $x^{3}$ is negative when $x$ is, so it needs absolute value bars: $\\sqrt{x^{2}} = |x|$, $\\sqrt{x^{6}} = |x^{3}|$;
- an **even** power such as $x^{2}$ is never negative, so it needs none: $\\sqrt{x^{4}} = x^{2}$.

For example, $\\sqrt{9x^{2}y^{4}} = 3|x|y^{2}$. At $x = -1$, $y = 1$ the root is $\\sqrt{9} = 3$, and $3|x|y^{2} = 3$ as well.

> **Watch out.** Without the bars the answer can come out negative: $3xy^{2}$ gives $-3$ at $x = -1$, but a square root is never negative. Do not put a minus sign in front either; $-3|x|y^{2}$ is always negative. And take the root of the coefficient: $9$ becomes $3$.`,
        `把指数减半，仍能得到一个平方后等于被开方式的数，但要作为平方根，这个数还必须**不是负数**。所以要看移出的每个幂：

- **奇次**幂，例如 $x$ 或 $x^{3}$，在 $x$ 为负时是负数，所以要加绝对值：$\\sqrt{x^{2}} = |x|$，$\\sqrt{x^{6}} = |x^{3}|$；
- **偶次**幂，例如 $x^{2}$，永远不是负数，所以不必加：$\\sqrt{x^{4}} = x^{2}$。

例如 $\\sqrt{9x^{2}y^{4}} = 3|x|y^{2}$。取 $x = -1$，$y = 1$，根式是 $\\sqrt{9} = 3$，而 $3|x|y^{2}$ 也等于 $3$。

> **注意。** 不加绝对值，结果可能是负数：$3xy^{2}$ 在 $x = -1$ 时等于 $-3$，但平方根永远不是负数。也不要在前面加负号，$-3|x|y^{2}$ 总是负的。系数也要开方：$9$ 变成 $3$。`,
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
        const powers = [["x", hx] as const, ...(hy > 0 ? [["y", hy] as const] : [])];
        const each = (en: boolean) =>
          powers
            .map(([v, h]) =>
              h % 2 === 1
                ? en
                  ? `$\\sqrt{${pw(v, 2 * h)}} = ${absPower(v, h)}$, since $${pw(v, h)}$ is an odd power and can be negative`
                  : `$\\sqrt{${pw(v, 2 * h)}} = ${absPower(v, h)}$，因为 $${pw(v, h)}$ 是奇次幂，可能是负数`
                : en
                  ? `$\\sqrt{${pw(v, 2 * h)}} = ${pw(v, h)}$, since $${pw(v, h)}$ is an even power and is never negative`
                  : `$\\sqrt{${pw(v, 2 * h)}} = ${pw(v, h)}$，因为 $${pw(v, h)}$ 是偶次幂，不会是负数`,
            )
            .join(en ? "; " : "；");
        const odd = hx % 2 === 1 || hy % 2 === 1;
        const [tx, ty] = oddTest(hx, hy);
        const at = hy > 0 ? `x = ${tx}$ and $y = ${ty}` : `x = ${tx}`;
        const atZh = hy > 0 ? `x = ${tx}$，$y = ${ty}` : `x = ${tx}`;
        const check = odd
          ? t(
              `**Check.** Try $${at}$, where the sign matters. The expression is $\\sqrt{${k * k}} = ${k}$, and the answer also gives $${k}$; without the absolute value, $${plain}$ would give $${-k}$.`,
              `**检验。** 取 $${atZh}$，这时符号起作用。原式等于 $\\sqrt{${k * k}} = ${k}$，答案也给出 $${k}$；如果不加绝对值，$${plain}$ 会给出 $${-k}$。`,
            )
          : t(
              `**Check.** $(${answer})^{2} = ${inside}$, and $${answer}$ is never negative, so it is the square root.`,
              `**检验。** $(${answer})^{2} = ${inside}$，并且 $${answer}$ 永远不是负数，所以它就是平方根。`,
            );
        return expressionProblem({
          prompt: anyReal(sq(inside)),
          answer,
          radical: true,
          wrong: [plain, `${front(k * k)}${parts}`, ...(hx === 1 ? [`-${plain}`] : [])],
          solution: t(
            `Take the root of each factor. ${k === 1 ? "The coefficient is $1$." : `The coefficient gives $\\sqrt{${k * k}} = ${k}$.`} For the powers, halve each exponent, then make sure the result cannot be negative: ${each(true)}.${steps(`${sq(inside)} = ${answer}`)}${check.en}`,
            `对每个因式分别开方。${k === 1 ? "系数是 $1$。" : `系数给出 $\\sqrt{${k * k}} = ${k}$。`}对于幂，把每个指数减半，再确认结果不可能为负：${each(false)}。${steps(`${sq(inside)} = ${answer}`)}${check["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "square-roots-of-squared-binomials",
      title: t("Squared binomials", "二项式的平方"),
      explanation: t(
        `The rule $\\sqrt{a^{2}} = |a|$ holds whatever $a$ stands for, a whole binomial included. A binomial such as $2x - 3$ is negative for some values of $x$ (all $x < \\frac{3}{2}$), so its root keeps the bars:

$$\\sqrt{(2x - 3)^{2}} = |2x - 3| \\qquad \\sqrt{9(x + 1)^{2}} = \\sqrt{9} \\cdot \\sqrt{(x + 1)^{2}} = 3|x + 1|$$

At $x = -4$, for instance, $\\sqrt{9(-3)^{2}} = \\sqrt{81} = 9$, and $3|-4 + 1| = 9$.

> **Watch out.** The bars go around the **whole** binomial: $|x + 1|$ is not $|x| + 1$ (at $x = -4$ one is $3$, the other $5$). Dropping the bars, $3x + 3$ gives $-9$ at $x = -4$, which a square root can never be. And the number in front comes out as its root: $\\sqrt{9} = 3$, not $9$.`,
        `$\\sqrt{a^{2}} = |a|$ 对任何 $a$ 都成立，包括整个二项式。像 $2x - 3$ 这样的二项式对某些 $x$（所有 $x < \\frac{3}{2}$）是负数，所以开方后要保留绝对值：

$$\\sqrt{(2x - 3)^{2}} = |2x - 3| \\qquad \\sqrt{9(x + 1)^{2}} = \\sqrt{9} \\cdot \\sqrt{(x + 1)^{2}} = 3|x + 1|$$

例如 $x = -4$ 时，$\\sqrt{9(-3)^{2}} = \\sqrt{81} = 9$，而 $3|-4 + 1| = 9$。

> **注意。** 绝对值要包住**整个**二项式：$|x + 1|$ 不等于 $|x| + 1$（$x = -4$ 时一个是 $3$，一个是 $5$）。去掉绝对值，$3x + 3$ 在 $x = -4$ 时等于 $-9$，而平方根不可能是负数。前面的数也要开方：$\\sqrt{9} = 3$，不是 $9$。`,
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
        const x0 = Math.floor(-b / a) - 1;
        const v = a * x0 + b;
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
            `${scaled ? `**Step 1: the number.** $\\sqrt{${k * k}} = ${k}$, by the product rule.\n\n**Step 2: the square.** ` : ""}The root of a square is the absolute value of what was squared, $\\sqrt{a^{2}} = |a|$, with $a = ${lin}$:${steps(`${sq(inside)} = ${answer}`)}The bars are needed: $${lin}$ is negative for some $x$, for example at $x = ${x0}$ it is $${v}$.

**Check.** At $x = ${x0}$ the expression is $\\sqrt{${scaled ? `${k * k}(${v})^{2}` : `(${v})^{2}`}} = \\sqrt{${k * k * v * v}} = ${k * Math.abs(v)}$, and the answer gives $${front(k)}|${v}| = ${k * Math.abs(v)}$. Without the bars, $${linear(k * a, k * b)}$ would give $${k * v}$.`,
            `${scaled ? `**第一步：数。** 由乘法法则，$\\sqrt{${k * k}} = ${k}$。\n\n**第二步：平方。** ` : ""}平方的平方根是被平方的式子的绝对值，$\\sqrt{a^{2}} = |a|$，这里 $a = ${lin}$：${steps(`${sq(inside)} = ${answer}`)}绝对值不能省：$${lin}$ 对某些 $x$ 是负数，例如 $x = ${x0}$ 时它等于 $${v}$。

**检验。** $x = ${x0}$ 时原式等于 $\\sqrt{${scaled ? `${k * k}(${v})^{2}` : `(${v})^{2}`}} = \\sqrt{${k * k * v * v}} = ${k * Math.abs(v)}$，答案给出 $${front(k)}|${v}| = ${k * Math.abs(v)}$。不加绝对值的话，$${linear(k * a, k * b)}$ 会给出 $${k * v}$。`,
          ),
        });
      },
    },
    {
      id: "using-a-domain-restriction",
      title: t("Using a domain restriction", "利用取值范围"),
      explanation: t(
        `A perfect-square trinomial is the square of a binomial, $x^{2} - 6x + 9 = (x - 3)^{2}$, so its root is $\\sqrt{x^{2} - 6x + 9} = |x - 3|$. The bars stay as long as $x - 3$ could have either sign. When the values of $x$ are restricted to one side of $3$, the sign is known and the bars can go:

- for $x \\ge 3$, $x - 3 \\ge 0$, so $|x - 3| = x - 3$;
- for $x < 3$, $x - 3 < 0$, so $|x - 3| = -(x - 3) = 3 - x$.

For example, at $x = 1$ (which is $< 3$): $\\sqrt{1 - 6 + 9} = \\sqrt{4} = 2$, and $3 - x = 2$.

> **Watch out.** When the binomial is negative, the absolute value is its **opposite**: for $x < 3$ the answer is $3 - x$, not $x - 3$, which would be negative there. Also do not stop at $|x - 3|$; the restriction is given so that the bars can be removed.`,
        `完全平方三项式是二项式的平方：$x^{2} - 6x + 9 = (x - 3)^{2}$，所以 $\\sqrt{x^{2} - 6x + 9} = |x - 3|$。只要 $x - 3$ 可正可负，绝对值就得保留。当 $x$ 的取值限定在 $3$ 的一侧时，符号就确定了，可以去掉绝对值：

- 当 $x \\ge 3$ 时，$x - 3 \\ge 0$，所以 $|x - 3| = x - 3$；
- 当 $x < 3$ 时，$x - 3 < 0$，所以 $|x - 3| = -(x - 3) = 3 - x$。

例如 $x = 1$（满足 $< 3$）时：$\\sqrt{1 - 6 + 9} = \\sqrt{4} = 2$，而 $3 - x = 2$。

> **注意。** 二项式为负时，它的绝对值是它的**相反数**：$x < 3$ 时答案是 $3 - x$，而不是 $x - 3$，后者在那里是负数。也不要停在 $|x - 3|$；题目给出取值范围，就是为了去掉绝对值。`,
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
        const B = linear(1, b);
        const x0 = bound + 2 * s;
        const factorStep =
          k === 1
            ? t(
                `**Step 1: factor.** $${inside} = (${B})^{2}$, since the middle term $${2 * b}x$ is twice $x \\cdot ${paren(b)}$ and the last term is $${paren(b)}^{2} = ${b * b}$.`,
                `**第一步：分解。** $${inside} = (${B})^{2}$，因为中间项 $${2 * b}x$ 是 $x \\cdot ${paren(b)}$ 的两倍，末项是 $${paren(b)}^{2} = ${b * b}$。`,
              )
            : t(
                `**Step 1: factor.** Take out $${k * k}$: $${inside} = ${k * k}(${poly([1, "x^{2}"], [2 * b, "x"], [b * b, ""])}) = ${square}$.`,
                `**第一步：分解。** 提出 $${k * k}$：$${inside} = ${k * k}(${poly([1, "x^{2}"], [2 * b, "x"], [b * b, ""])}) = ${square}$。`,
              );
        return expressionProblem({
          prompt: t(`Simplify $${sq(inside)}$ for $${restriction}$.`, `当 $${restriction}$ 时，化简 $${sq(inside)}$。`),
          answer,
          wrong: [linear(-s * k, -s * k * b), abs, linear(k, -k * b)],
          solution: t(
            `${factorStep.en}

**Step 2: take the root.** $\\sqrt{a^{2}} = |a|$:${steps(`${sq(inside)} = ${sq(square)} = ${abs}`)}**Step 3: remove the bars.** For $${restriction}$, $${B}$ is ${above ? "not negative, so the bars change nothing" : `negative, so its absolute value is its opposite, $-(${B})$`}:${steps(`${abs} = ${answer}`)}**Check.** Take $x = ${x0}$, which satisfies $${restriction}$. The expression is $\\sqrt{${k === 1 ? "" : k * k}(${x0 + b})^{2}} = \\sqrt{${4 * k * k}} = ${2 * k}$, and $${answer}$ gives $${substituted(s * k, x0, s * k * b)} = ${2 * k}$.`,
            `${factorStep["zh-CN"]}

**第二步：开方。** $\\sqrt{a^{2}} = |a|$：${steps(`${sq(inside)} = ${sq(square)} = ${abs}`)}**第三步：去掉绝对值。** 当 $${restriction}$ 时，$${B}$ ${above ? "不是负数，所以绝对值不改变它" : `是负数，所以它的绝对值是它的相反数 $-(${B})$`}：${steps(`${abs} = ${answer}`)}**检验。** 取满足 $${restriction}$ 的 $x = ${x0}$。原式等于 $\\sqrt{${k === 1 ? "" : k * k}(${x0 + b})^{2}} = \\sqrt{${4 * k * k}} = ${2 * k}$，而 $${answer}$ 给出 $${substituted(s * k, x0, s * k * b)} = ${2 * k}$。`,
          ),
        });
      },
    },
  ],
};

/** cubeCoefficient explains the cube root of the coefficient k³, in both locales. */
function cubeCoefficient(k: number): Text {
  if (k === 1) return t("The coefficient is $1$, and $\\sqrt[3]{1} = 1$.", "系数是 $1$，$\\sqrt[3]{1} = 1$。");
  return t(
    `$${paren(k)}^{3} = ${k ** 3}$, so $\\sqrt[3]{${k ** 3}} = ${k}$${k < 0 ? "; a negative number has a negative cube root" : ""}.`,
    `$${paren(k)}^{3} = ${k ** 3}$，所以 $\\sqrt[3]{${k ** 3}} = ${k}$${k < 0 ? "；负数的立方根是负数" : ""}。`,
  );
}

export const cubeRootsOfAlgebraicPerfectCubes: TopicDef = {
  id: "cube-roots-of-algebraic-perfect-cubes",
  title: t("The Cube Root of a Perfect Cube With Algebraic Expressions", "代数式中完全立方的立方根"),
  summary: t(
    "Take cube roots of monomials that are perfect cubes, such as $\\sqrt[3]{-8x^{6}y^{3}} = -2x^{2}y$.",
    "求完全立方单项式的立方根，例如 $\\sqrt[3]{-8x^{6}y^{3}} = -2x^{2}y$。",
  ),
  prerequisites: ["square-roots-of-algebraic-perfect-squares"],
  encompasses: [{ topic: "square-roots-and-cube-roots", weight: 0.3 }],
  xp: 10,
  standards: ["CCSS.HSN.RN.A.2"],
  intro: t(
    `The cube root undoes cubing: $\\sqrt[3]{8} = 2$ because $2^{3} = 8$. Square roots of monomials were found by halving exponents, since squaring doubles them. Cubing **triples** exponents, $(x^{4})^{3} = x^{4 \\cdot 3} = x^{12}$, so the cube root divides them by $3$:

$$\\sqrt[3]{x^{12}} = x^{4}.$$

Only powers whose exponent is a multiple of $3$ are perfect cubes. There is one pleasant difference from square roots: a negative number has a cube root, $\\sqrt[3]{-8} = -2$ because $(-2)^{3} = -8$, and cubing keeps the sign. So no absolute values are ever needed, and the variables may be any real numbers.

In this lesson we take cube roots of monomials in one variable, then in several, then of fractions.`,
    `开立方是立方的逆运算：$\\sqrt[3]{8} = 2$，因为 $2^{3} = 8$。求单项式的平方根时我们把指数减半，因为平方使指数加倍。立方使指数**变为三倍**，$(x^{4})^{3} = x^{4 \\cdot 3} = x^{12}$，所以开立方就把指数除以 $3$：

$$\\sqrt[3]{x^{12}} = x^{4}.$$

只有指数是 $3$ 的倍数的幂才是完全立方。与平方根相比有一点不同：负数也有立方根，$\\sqrt[3]{-8} = -2$，因为 $(-2)^{3} = -8$，立方保留符号。所以永远不需要绝对值，变量可以取任意实数。

这节课先求单个变量的单项式的立方根，再求多个变量的，最后求分式的。`,
  ),
  knowledgePoints: [
    {
      id: "cube-roots-of-monomials",
      title: t("Cube roots of monomials", "单项式的立方根"),
      explanation: t(
        `The product rule works for cube roots as for square roots, $\\sqrt[3]{ab} = \\sqrt[3]{a} \\cdot \\sqrt[3]{b}$, because $(ab)^{3} = a^{3}b^{3}$. So take the cube root of the coefficient and of the power separately. For $\\sqrt[3]{-27x^{12}}$: $(-3)^{3} = -27$, so the coefficient gives $-3$; and $(x^{4})^{3} = x^{12}$, so the power gives $x^{4}$:

$$\\sqrt[3]{-27x^{12}} = \\sqrt[3]{-27} \\cdot \\sqrt[3]{x^{12}} = -3x^{4}.$$

Cubing the result checks it: $(-3x^{4})^{3} = -27x^{12}$.

> **Watch out.** Divide the exponent by $3$; do not leave it as it is ($-3x^{12}$) or halve it. Take the cube root of the coefficient too, not just copy it ($-27x^{4}$). And keep the sign: the cube root of a negative number is negative, so $3x^{4}$ is wrong.`,
        `乘法法则对立方根和对平方根一样成立：$\\sqrt[3]{ab} = \\sqrt[3]{a} \\cdot \\sqrt[3]{b}$，因为 $(ab)^{3} = a^{3}b^{3}$。所以系数和幂分别开立方。对 $\\sqrt[3]{-27x^{12}}$：$(-3)^{3} = -27$，所以系数给出 $-3$；$(x^{4})^{3} = x^{12}$，所以幂给出 $x^{4}$：

$$\\sqrt[3]{-27x^{12}} = \\sqrt[3]{-27} \\cdot \\sqrt[3]{x^{12}} = -3x^{4}.$$

把结果立方就能检验：$(-3x^{4})^{3} = -27x^{12}$。

> **注意。** 指数要除以 $3$，不能保持不变（$-3x^{12}$），也不能减半。系数也要开立方，不能照抄（$-27x^{4}$）。还要保留符号：负数的立方根是负数，所以 $3x^{4}$ 是错的。`,
      ),
      generate(rng) {
        const k = rng.nonZero(-6, 6);
        const a = rng.int(1, 4);
        const inside = mono(k ** 3, 3 * a);
        const answer = mono(k, a);
        const work = steps(`${cb(inside)} = ${cb(String(k ** 3))} \\cdot ${cb(pw("x", 3 * a))} = ${answer}`);
        const coef = cubeCoefficient(k);
        return expressionProblem({
          prompt: t(`Simplify $${cb(inside)}$.`, `化简 $${cb(inside)}$。`),
          answer,
          radical: true,
          wrong: [mono(k, 3 * a), mono(k ** 3, a), mono(-k, a)],
          solution: t(
            `**Step 1: the coefficient.** ${coef.en}

**Step 2: the power.** Cubing $${pw("x", a)}$ triples its exponent, so divide $${3 * a}$ by $3$: $\\sqrt[3]{${pw("x", 3 * a)}} = ${pw("x", a)}$.${work}**Check.** Cubing the answer must give back the expression under the root: $(${answer})^{3} = ${paren(k)}^{3} \\cdot (${pw("x", a)})^{3} = ${inside}$.`,
            `**第一步：系数。** ${coef["zh-CN"]}

**第二步：幂。** 把 $${pw("x", a)}$ 立方，指数变为三倍，所以把 $${3 * a}$ 除以 $3$：$\\sqrt[3]{${pw("x", 3 * a)}} = ${pw("x", a)}$。${work}**检验。** 把答案立方，应当得回根号下的式子：$(${answer})^{3} = ${paren(k)}^{3} \\cdot (${pw("x", a)})^{3} = ${inside}$。`,
          ),
        });
      },
    },
    {
      id: "cube-roots-with-several-variables",
      title: t("Several variables", "多个变量"),
      explanation: t(
        `With several variables, split the cube root into one cube root per factor and take each: the cube root of the coefficient, and each exponent divided by $3$.

$$\\sqrt[3]{64x^{3}y^{9}} = \\sqrt[3]{64} \\cdot \\sqrt[3]{x^{3}} \\cdot \\sqrt[3]{y^{9}} = 4xy^{3}$$

Cubing gives it back, $(4xy^{3})^{3} = 64x^{3}y^{9}$. So a monomial is a perfect cube exactly when its coefficient is a perfect cube and **every** exponent is a multiple of $3$.

> **Watch out.** Every exponent is divided by $3$, the last one included: $\\sqrt[3]{x^{3}y^{9}}$ is $xy^{3}$, not $xy^{9}$. The coefficient's cube root keeps its sign, so $\\sqrt[3]{-64x^{3}}$ is $-4x$.`,
        `有多个变量时，把立方根拆成每个因式各自的立方根，分别求：系数开立方，每个指数除以 $3$。

$$\\sqrt[3]{64x^{3}y^{9}} = \\sqrt[3]{64} \\cdot \\sqrt[3]{x^{3}} \\cdot \\sqrt[3]{y^{9}} = 4xy^{3}$$

立方后得回原式：$(4xy^{3})^{3} = 64x^{3}y^{9}$。所以当且仅当系数是完全立方数并且**每个**指数都是 $3$ 的倍数时，单项式是完全立方式。

> **注意。** 每个指数都要除以 $3$，包括最后一个：$\\sqrt[3]{x^{3}y^{9}}$ 是 $xy^{3}$，不是 $xy^{9}$。系数的立方根保留符号，所以 $\\sqrt[3]{-64x^{3}}$ 是 $-4x$。`,
      ),
      generate(rng) {
        const k = rng.nonZero(-5, 5);
        const a = rng.int(1, 3);
        const b = rng.int(1, 3);
        const inside = mono(k ** 3, 3 * a, 3 * b);
        const answer = mono(k, a, b);
        const work = steps(`${cb(inside)} = ${cb(String(k ** 3))} \\cdot ${cb(pw("x", 3 * a))} \\cdot ${cb(pw("y", 3 * b))} = ${answer}`);
        const coef = cubeCoefficient(k);
        return expressionProblem({
          prompt: t(`Simplify $${cb(inside)}$.`, `化简 $${cb(inside)}$。`),
          answer,
          radical: true,
          wrong: [mono(k, 3 * a, 3 * b), mono(k ** 3, a, b), mono(-k, a, b), mono(k, a, 3 * b)],
          solution: t(
            `Take the cube root of each factor. ${coef.en} Each exponent is divided by $3$: $${3 * a}$ becomes $${a}$ and $${3 * b}$ becomes $${b}$.${work}**Check.** Cubing triples each exponent back and cubes the coefficient: $(${answer})^{3} = ${inside}$.`,
            `对每个因式分别开立方。${coef["zh-CN"]}每个指数除以 $3$：$${3 * a}$ 变成 $${a}$，$${3 * b}$ 变成 $${b}$。${work}**检验。** 立方使每个指数变回三倍、系数立方：$(${answer})^{3} = ${inside}$。`,
          ),
        });
      },
    },
    {
      id: "cube-roots-of-fractions-with-variables",
      title: t("Fractions", "分式"),
      explanation: t(
        `Cubing a fraction cubes its numerator and its denominator, $\\left(\\frac{a}{b}\\right)^{3} = \\frac{a^{3}}{b^{3}}$, so the cube root of a fraction is the cube root of the numerator over the cube root of the denominator:

$$\\sqrt[3]{\\frac{8x^{6}}{27y^{3}}} = \\frac{\\sqrt[3]{8x^{6}}}{\\sqrt[3]{27y^{3}}} = \\frac{2x^{2}}{3y}.$$

A minus sign anywhere in the fraction comes out in front, since $\\sqrt[3]{-8} = -2$: $\\sqrt[3]{-\\frac{8}{27}} = -\\frac{2}{3}$.

> **Watch out.** Take the cube root of the denominator as well: $\\sqrt[3]{27y^{3}}$ is $3y$, so neither $27$ nor $y^{3}$ may stay below the bar. Keep the sign of a negative fraction.`,
        `把分式立方，就是把分子和分母都立方：$\\left(\\frac{a}{b}\\right)^{3} = \\frac{a^{3}}{b^{3}}$。所以分式的立方根等于分子的立方根除以分母的立方根：

$$\\sqrt[3]{\\frac{8x^{6}}{27y^{3}}} = \\frac{\\sqrt[3]{8x^{6}}}{\\sqrt[3]{27y^{3}}} = \\frac{2x^{2}}{3y}.$$

分式中的负号会移到前面，因为 $\\sqrt[3]{-8} = -2$：$\\sqrt[3]{-\\frac{8}{27}} = -\\frac{2}{3}$。

> **注意。** 分母也要开立方：$\\sqrt[3]{27y^{3}}$ 是 $3y$，所以分母里既不能留下 $27$，也不能留下 $y^{3}$。负分式要保留符号。`,
      ),
      generate(rng) {
        const [p, m] = coprime(rng, [1, 5], [2, 6]);
        const k = rng.sign() * p;
        const a = rng.int(1, 3);
        const b = rng.int(0, 2);
        const inside = quotient(k ** 3, vp(3 * a), m ** 3, vp(0, 3 * b));
        const answer = quotient(k, vp(a), m, vp(0, b));
        const top = mono(p ** 3, 3 * a);
        const bottom = mono(m ** 3, 0, 3 * b);
        const work = steps(`${cb(inside)} = ${k < 0 ? "-" : ""}\\frac{${cb(top)}}{${cb(bottom)}} = ${answer}`);
        return expressionProblem({
          prompt: t(`Simplify $${cb(inside)}$.`, `化简 $${cb(inside)}$。`),
          answer,
          radical: true,
          wrong: [quotient(k, vp(a), m ** 3, vp(0, b)), quotient(-k, vp(a), m, vp(0, b)), quotient(k, vp(a), m, vp(0, 3 * b))],
          solution: t(
            `Take the cube root of the numerator and of the denominator${k < 0 ? "; the minus sign comes out in front, since a negative number has a negative cube root" : ""}:${work}On top, $\\sqrt[3]{${top}} = ${mono(p, a)}$; below, $\\sqrt[3]{${bottom}} = ${mono(m, 0, b)}$, dividing each exponent by $3$.

**Check.** $\\left(${answer}\\right)^{3} = ${k < 0 ? "-" : ""}\\frac{(${mono(p, a)})^{3}}{(${mono(m, 0, b)})^{3}} = ${inside}$.`,
            `分子、分母分别开立方${k < 0 ? "；负号移到前面，因为负数的立方根是负数" : ""}：${work}分子上 $\\sqrt[3]{${top}} = ${mono(p, a)}$；分母上 $\\sqrt[3]{${bottom}} = ${mono(m, 0, b)}$，每个指数都除以 $3$。

**检验。** $\\left(${answer}\\right)^{3} = ${k < 0 ? "-" : ""}\\frac{(${mono(p, a)})^{3}}{(${mono(m, 0, b)})^{3}} = ${inside}$。`,
          ),
        });
      },
    },
  ],
};

/** squareFactorWords says how the coefficient n = k²·m splits into a perfect square and a square-free rest. */
function squareFactorWords(n: number, k: number, m: number): Text {
  if (k === 1)
    return t(
      `$${n}$ has no perfect-square factor other than $1$, so it stays under the root.`,
      `$${n}$ 除 $1$ 外没有完全平方因数，所以留在根号内。`,
    );
  if (m === 1) return t(`$${n} = ${k}^{2}$ is a perfect square.`, `$${n} = ${k}^{2}$ 是完全平方数。`);
  return t(
    `The largest perfect square dividing $${n}$ is $${k * k}$: $${n} = ${k * k} \\cdot ${m}$, and $${m}$ has no square factor left.`,
    `整除 $${n}$ 的最大完全平方数是 $${k * k}$：$${n} = ${k * k} \\cdot ${m}$，而 $${m}$ 中不再有平方因数。`,
  );
}

/** powerSplitWords says how vᵉ splits into an even power that leaves the root and what stays. */
function powerSplitWords(v: string, e: number): Text {
  if (e === 0) return t("", "");
  if (e === 1) return t(`$${v}$ is not a square, so it stays under the root.`, `$${v}$ 不是平方，留在根号内。`);
  const square = (h: number) => (h === 1 ? pw(v, 2) : `${pw(v, 2 * h)} = (${pw(v, h)})^{2}`);
  if (e % 2 === 0) return t(`$${square(e / 2)}$ is a perfect square.`, `$${square(e / 2)}$ 是完全平方。`);
  return t(
    `$${pw(v, e)} = ${pw(v, e - 1)} \\cdot ${v}$, and $${square((e - 1) / 2)}$ is a perfect square.`,
    `$${pw(v, e)} = ${pw(v, e - 1)} \\cdot ${v}$，其中 $${square((e - 1) / 2)}$ 是完全平方。`,
  );
}

/** squareCheck squares an answer outside·√inside back to the radicand. */
function squareCheck(outside: string, inside: string, radicand: string): Text {
  return t(
    `**Check.** Squaring the answer squares the factor in front and removes the root, and must give back the radicand: $(${outside})^{2} \\cdot ${inside} = ${radicand}$.`,
    `**检验。** 把答案平方，根号前的因式平方、根号去掉，应当得回被开方式：$(${outside})^{2} \\cdot ${inside} = ${radicand}$。`,
  );
}

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
  intro: t(
    `A number such as $12$ is not a perfect square, but it has one as a factor: $12 = 4 \\cdot 3$. The product rule $\\sqrt{ab} = \\sqrt{a} \\cdot \\sqrt{b}$ then lets that factor leave the root, $\\sqrt{12} = \\sqrt{4} \\cdot \\sqrt{3} = 2\\sqrt{3}$. The same works with variables, because even powers are perfect squares and an odd power is an even power times one more factor.

Take $\\sqrt{12x^{3}}$, with $x$ positive. Split the radicand into the largest perfect square it contains and the rest:

$$12x^{3} = 4x^{2} \\cdot 3x, \\qquad\\text{so}\\qquad \\sqrt{12x^{3}} = \\sqrt{4x^{2}} \\cdot \\sqrt{3x} = 2x\\sqrt{3x}.$$

Nothing under the root is a perfect square any more (other than $1$): this is the **simplest form**. In this lesson we simplify roots with even powers, then with odd powers, then with several variables. All variables are positive.`,
    `像 $12$ 这样的数不是完全平方数，但它含有完全平方因数：$12 = 4 \\cdot 3$。由乘法法则 $\\sqrt{ab} = \\sqrt{a} \\cdot \\sqrt{b}$，这个因数可以移出根号：$\\sqrt{12} = \\sqrt{4} \\cdot \\sqrt{3} = 2\\sqrt{3}$。含变量时也一样，因为偶次幂是完全平方，而奇次幂是偶次幂再乘一个因式。

看 $\\sqrt{12x^{3}}$，$x$ 为正。把被开方式拆成其中最大的完全平方和剩下的部分：

$$12x^{3} = 4x^{2} \\cdot 3x, \\qquad\\text{所以}\\qquad \\sqrt{12x^{3}} = \\sqrt{4x^{2}} \\cdot \\sqrt{3x} = 2x\\sqrt{3x}.$$

根号内除 $1$ 外不再有完全平方因式：这就是**最简形式**。这节课先化简含偶次幂的根式，再化简含奇次幂的，最后化简含多个变量的。所有变量都是正数。`,
  ),
  knowledgePoints: [
    {
      id: "numbers-and-even-powers",
      title: t("Square factors of the coefficient", "系数中的平方因数"),
      explanation: t(
        `The product rule $\\sqrt{ab} = \\sqrt{a} \\cdot \\sqrt{b}$ lets a perfect-square factor leave the root. An even power of a variable is a perfect square, $x^{4} = (x^{2})^{2}$, so it leaves entirely. For the coefficient, find its **largest** perfect-square factor. For $\\sqrt{18x^{4}}$: $18 = 9 \\cdot 2$, so

$$\\sqrt{18x^{4}} = \\sqrt{9x^{4}} \\cdot \\sqrt{2} = 3x^{2}\\sqrt{2}.$$

In simplest form nothing under the root is a perfect square other than $1$: here only $2$ is left.

> **Watch out.** What leaves the root is the root of the square factor: $\\sqrt{9} = 3$, not $9$, and $\\sqrt{x^{4}} = x^{2}$, not $x^{4}$. Keep the two numbers in their places: $3\\sqrt{2}$ is not $2\\sqrt{3}$.`,
        `乘法法则 $\\sqrt{ab} = \\sqrt{a} \\cdot \\sqrt{b}$ 让完全平方因式可以移出根号。变量的偶次幂是完全平方，$x^{4} = (x^{2})^{2}$，所以它整个移出。对于系数，要找它**最大的**完全平方因数。对 $\\sqrt{18x^{4}}$：$18 = 9 \\cdot 2$，所以

$$\\sqrt{18x^{4}} = \\sqrt{9x^{4}} \\cdot \\sqrt{2} = 3x^{2}\\sqrt{2}.$$

最简形式中，根号内除 $1$ 外没有完全平方因式：这里只剩下 $2$。

> **注意。** 移出根号的是平方因式的平方根：$\\sqrt{9} = 3$，不是 $9$；$\\sqrt{x^{4}} = x^{2}$，不是 $x^{4}$。两个数也不要放错位置：$3\\sqrt{2}$ 不是 $2\\sqrt{3}$。`,
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
        const coef = squareFactorWords(n, k, m);
        const power = powerSplitWords("x", 2 * a);
        return expressionProblem({
          prompt: simplifyPositive(sq(mono(n, 2 * a))),
          answer,
          radical: true,
          positive: true,
          wrong: [radTerm(k, 2 * a, 0, m, 0, 0), radTerm(k * k, a, 0, m, 0, 0), radTerm(m, a, 0, k, 0, 0)],
          solution: t(
            `**Step 1: find the perfect squares.** ${coef.en} ${power.en}

**Step 2: take them out.** By the product rule, the root of $${mono(k * k, 2 * a)}$ leaves as $${mono(k, a)}$ and $${m}$ stays inside:${steps(`${sq(mono(n, 2 * a))} = ${splitWork(n, 2 * a)}`)}${squareCheck(mono(k, a), String(m), mono(n, 2 * a)).en}`,
            `**第一步：找出完全平方。** ${coef["zh-CN"]}${power["zh-CN"]}

**第二步：移出根号。** 由乘法法则，$${mono(k * k, 2 * a)}$ 开方后以 $${mono(k, a)}$ 移出，$${m}$ 留在根号内：${steps(`${sq(mono(n, 2 * a))} = ${splitWork(n, 2 * a)}`)}${squareCheck(mono(k, a), String(m), mono(n, 2 * a))["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "odd-powers",
      title: t("Odd powers", "奇次幂"),
      explanation: t(
        `An odd power is not a perfect square, but it is one factor away from one: $x^{7} = x^{6} \\cdot x$. The even part $x^{6} = (x^{3})^{2}$ leaves the root as $x^{3}$, and the single $x$ stays inside. Together with the coefficient, $12 = 4 \\cdot 3$:

$$\\sqrt{12x^{7}} = \\sqrt{4x^{6}} \\cdot \\sqrt{3x} = 2x^{3}\\sqrt{3x}.$$

> **Watch out.** Exactly **one** $x$ stays under the root, and the exponent outside is half of the even part: $\\sqrt{x^{7}}$ gives $x^{3}\\sqrt{x}$, not $x^{4}\\sqrt{x}$ or $x^{6}\\sqrt{x}$. Do not drop the leftover $x$ either: $2x^{3}\\sqrt{3}$ squares to $12x^{6}$, not $12x^{7}$.`,
        `奇次幂不是完全平方，但只差一个因式：$x^{7} = x^{6} \\cdot x$。偶次部分 $x^{6} = (x^{3})^{2}$ 以 $x^{3}$ 移出根号，剩下的一个 $x$ 留在根号内。再加上系数 $12 = 4 \\cdot 3$：

$$\\sqrt{12x^{7}} = \\sqrt{4x^{6}} \\cdot \\sqrt{3x} = 2x^{3}\\sqrt{3x}.$$

> **注意。** 根号内恰好留下**一个** $x$，根号外的指数是偶次部分的一半：$\\sqrt{x^{7}}$ 得 $x^{3}\\sqrt{x}$，不是 $x^{4}\\sqrt{x}$ 或 $x^{6}\\sqrt{x}$。也不要丢掉剩下的 $x$：$2x^{3}\\sqrt{3}$ 平方后是 $12x^{6}$，不是 $12x^{7}$。`,
      ),
      generate(rng) {
        const k = rng.int(1, 5);
        const m = rng.pick([1, 1, 2, 3, 5, 6, 7]);
        const a = rng.int(1, 4);
        const n = k * k * m;
        const e = 2 * a + 1;
        const r = extract(n, e);
        const coef = n === 1 ? t("The coefficient is $1$.", "系数是 $1$。") : squareFactorWords(n, k, m);
        const power = powerSplitWords("x", e);
        return expressionProblem({
          prompt: simplifyPositive(sq(mono(n, e))),
          answer: written(r),
          radical: true,
          positive: true,
          wrong: [radTerm(k, a + 1, 0, m, 1, 0), radTerm(k, a, 0, m, 0, 0), radTerm(k, 2 * a, 0, m, 1, 0)],
          solution: t(
            `**Step 1: split the odd power.** ${power.en}

**Step 2: the coefficient.** ${coef.en}

**Step 3: take the perfect squares out.** The square part $${mono(k * k, 2 * a)}$ leaves as $${mono(k, a)}$; $${mono(m, 1)}$ stays inside:${steps(`${sq(mono(n, e))} = ${splitWork(n, e)}`)}${squareCheck(mono(k, a), mono(m, 1), mono(n, e)).en}`,
            `**第一步：拆开奇次幂。** ${power["zh-CN"]}

**第二步：系数。** ${coef["zh-CN"]}

**第三步：把完全平方移出。** 平方部分 $${mono(k * k, 2 * a)}$ 以 $${mono(k, a)}$ 移出；$${mono(m, 1)}$ 留在根号内：${steps(`${sq(mono(n, e))} = ${splitWork(n, e)}`)}${squareCheck(mono(k, a), mono(m, 1), mono(n, e))["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "square-roots-of-monomials-with-several-variables",
      title: t("Several variables", "多个变量"),
      explanation: t(
        `With several variables, handle the coefficient and each variable on its own, sorting each into a perfect-square part, which leaves the root, and a rest, which stays:

- $50 = 25 \\cdot 2$: $5$ comes out, $2$ stays;
- $x^{3} = x^{2} \\cdot x$: $x$ comes out, $x$ stays;
- $y^{4} = (y^{2})^{2}$: $y^{2}$ comes out, nothing stays.

Then collect what came out in front and what stayed under one root:

$$\\sqrt{50x^{3}y^{4}} = \\sqrt{25x^{2}y^{4}} \\cdot \\sqrt{2x} = 5xy^{2}\\sqrt{2x}.$$

> **Watch out.** A variable with an even exponent leaves the root completely; one with an odd exponent leaves one factor behind. Do not copy an exponent unchanged to the front ($5x^{3}y^{4}\\sqrt{2x}$), and do not forget what stays inside ($5xy^{2}$ alone squares to $25x^{2}y^{4}$, not $50x^{3}y^{4}$).`,
        `有多个变量时，系数和每个变量分别处理，各自分成移出根号的完全平方部分和留下的部分：

- $50 = 25 \\cdot 2$：移出 $5$，留下 $2$；
- $x^{3} = x^{2} \\cdot x$：移出 $x$，留下 $x$；
- $y^{4} = (y^{2})^{2}$：移出 $y^{2}$，什么也不留。

再把移出的部分合在根号前，留下的部分合在一个根号内：

$$\\sqrt{50x^{3}y^{4}} = \\sqrt{25x^{2}y^{4}} \\cdot \\sqrt{2x} = 5xy^{2}\\sqrt{2x}.$$

> **注意。** 指数为偶数的变量全部移出根号；指数为奇数的变量留下一个因式。不要把指数原样抄到前面（$5x^{3}y^{4}\\sqrt{2x}$），也不要忘了根号内留下的部分（只写 $5xy^{2}$，平方后是 $25x^{2}y^{4}$，而不是 $50x^{3}y^{4}$）。`,
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
        const coef = n === 1 ? t("The coefficient is $1$.", "系数是 $1$。") : squareFactorWords(n, k, m);
        const px = powerSplitWords("x", ex);
        const py = powerSplitWords("y", ey);
        const outside = mono(k, a, b);
        const inside = mono(m, rx, ry);
        return expressionProblem({
          prompt: simplifyPositive(sq(mono(n, ex, ey))),
          answer: written(r),
          radical: true,
          positive: true,
          wrong: [radTerm(k, a + rx, b + ry, m, rx, ry), radTerm(k, ex, ey, m, rx, ry), radTerm(k, a, b, m, 0, 0)],
          solution: t(
            `**Step 1: sort each factor.** ${coef.en} ${px.en} ${py.en}

**Step 2: take the perfect squares out.** In front go $${outside}$; under the root stays $${inside}$:${steps(`${sq(mono(n, ex, ey))} = ${splitWork(n, ex, ey)}`)}${squareCheck(outside, inside, mono(n, ex, ey)).en}`,
            `**第一步：逐个因式分类。** ${coef["zh-CN"]}${px["zh-CN"]}${py["zh-CN"]}

**第二步：把完全平方移出。** 根号前是 $${outside}$，根号内留下 $${inside}$：${steps(`${sq(mono(n, ex, ey))} = ${splitWork(n, ex, ey)}`)}${squareCheck(outside, inside, mono(n, ex, ey))["zh-CN"]}`,
          ),
        });
      },
    },
  ],
};

/** extractCheck squares a simplified root k·xᵃyᵇ·√(rest) back to its radicand. */
function extractCheck(r: Extracted, radicand: string): Text {
  const outside = mono(r.k, r.ox, r.oy);
  const inside = mono(r.m, r.ix, r.iy);
  if (inside === "1") {
    return t(
      `**Check.** $(${outside})^{2} = ${radicand}$, so $${outside}$ is the square root of $${radicand}$.`,
      `**检验。** $(${outside})^{2} = ${radicand}$，所以 $${outside}$ 就是 $${radicand}$ 的平方根。`,
    );
  }
  return squareCheck(outside, inside, radicand);
}

/** simplifyWords explains how √(n·xᵉ·yᶠ) is simplified, coefficient and powers. */
function simplifyWords(n: number, ex: number, ey = 0): Text {
  const [k, m] = simplifyRadical(n);
  const parts = [n === 1 ? t("", "") : squareFactorWords(n, k, m), powerSplitWords("x", ex), powerSplitWords("y", ey)];
  return t(
    parts
      .map((p) => p.en)
      .filter((s) => s !== "")
      .join(" "),
    parts.map((p) => p["zh-CN"]).join(""),
  );
}

export const multiplyingRadicalExpressions: TopicDef = {
  id: "multiplying-radical-expressions",
  title: t("Combining Radical Expressions Using the Product Rule", "用乘法法则合并根式"),
  summary: t(
    "Multiply square roots and cube roots with variables, then simplify: $\\sqrt{6x} \\cdot \\sqrt{10x^{3}} = 2x^{2}\\sqrt{15}$.",
    "进行含变量的平方根和立方根的乘法，然后化简：$\\sqrt{6x} \\cdot \\sqrt{10x^{3}} = 2x^{2}\\sqrt{15}$。",
  ),
  prerequisites: ["simplifying-square-roots-with-variables", "cube-roots-of-algebraic-perfect-cubes"],
  encompasses: [{ topic: "simplifying-square-roots-with-variables", weight: 0.6 }],
  xp: 16,
  standards: ["CCSS.HSN.RN.A.2"],
  intro: t(
    `The product rule $\\sqrt{ab} = \\sqrt{a} \\cdot \\sqrt{b}$ was used to split a root apart. Read from right to left, it joins two roots into one:

$$\\sqrt{a} \\cdot \\sqrt{b} = \\sqrt{ab}.$$

It holds because both sides are the non-negative number whose square is $ab$: $(\\sqrt{a} \\cdot \\sqrt{b})^{2} = (\\sqrt{a})^{2} (\\sqrt{b})^{2} = ab$. So two roots that are not simple on their own can be multiplied under one root, and the product may simplify. For instance, with $x$ positive,

$$\\sqrt{6x} \\cdot \\sqrt{10x^{3}} = \\sqrt{60x^{4}} = \\sqrt{4x^{4}} \\cdot \\sqrt{15} = 2x^{2}\\sqrt{15}.$$

In this lesson we multiply square roots, roots with coefficients in front, cube roots, and finally distribute a root over a sum. All variables under square roots are positive.`,
    `乘法法则 $\\sqrt{ab} = \\sqrt{a} \\cdot \\sqrt{b}$ 以前用来把根式拆开。从右往左读，它把两个根式合成一个：

$$\\sqrt{a} \\cdot \\sqrt{b} = \\sqrt{ab}.$$

它成立，是因为两边都是平方等于 $ab$ 的那个非负数：$(\\sqrt{a} \\cdot \\sqrt{b})^{2} = (\\sqrt{a})^{2} (\\sqrt{b})^{2} = ab$。所以两个本身不能化简的根式，可以乘到一个根号下，乘积也许就能化简。例如 $x$ 为正时，

$$\\sqrt{6x} \\cdot \\sqrt{10x^{3}} = \\sqrt{60x^{4}} = \\sqrt{4x^{4}} \\cdot \\sqrt{15} = 2x^{2}\\sqrt{15}.$$

这节课计算平方根的乘法、带系数的根式的乘法、立方根的乘法，最后用分配律把根式乘进和式。平方根号下的变量都是正数。`,
  ),
  knowledgePoints: [
    {
      id: "products-of-square-roots",
      title: t("Products of square roots", "平方根的乘积"),
      explanation: t(
        `To multiply two square roots, multiply the radicands under one root, then simplify as usual. Multiplying the radicands means multiplying the coefficients and **adding** the exponents of $x$, since $x^{m} \\cdot x^{n} = x^{m + n}$:

$$\\sqrt{6x} \\cdot \\sqrt{10x^{3}} = \\sqrt{60x^{4}}.$$

Now take out the largest perfect square, $60x^{4} = 4x^{4} \\cdot 15$:

$$\\sqrt{60x^{4}} = \\sqrt{4x^{4}} \\cdot \\sqrt{15} = 2x^{2}\\sqrt{15}.$$

> **Watch out.** Exponents of the same variable are added, not multiplied: $x \\cdot x^{3} = x^{4}$, not $x^{3}$. The coefficients are multiplied, not added: $6 \\cdot 10 = 60$. And finish by simplifying; $\\sqrt{60x^{4}}$ still has perfect squares inside.`,
        `两个平方根相乘，把被开方式乘到一个根号下，再照常化简。被开方式相乘，就是系数相乘、$x$ 的指数**相加**，因为 $x^{m} \\cdot x^{n} = x^{m + n}$：

$$\\sqrt{6x} \\cdot \\sqrt{10x^{3}} = \\sqrt{60x^{4}}.$$

再移出最大的完全平方，$60x^{4} = 4x^{4} \\cdot 15$：

$$\\sqrt{60x^{4}} = \\sqrt{4x^{4}} \\cdot \\sqrt{15} = 2x^{2}\\sqrt{15}.$$

> **注意。** 同一变量的指数相加，不是相乘：$x \\cdot x^{3} = x^{4}$，不是 $x^{3}$。系数相乘，不是相加：$6 \\cdot 10 = 60$。最后还要化简：$\\sqrt{60x^{4}}$ 里仍有完全平方。`,
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5, 6, 7, 10, 14, 15]);
        const q = rng.pick([2, 3, 5, 6, 7, 10, 14, 15]);
        const a = rng.int(1, 3);
        const b = rng.int(1, 3);
        const [n, e] = [p * q, a + b];
        const expr = `${sq(mono(p, a))} \\cdot ${sq(mono(q, b))}`;
        const r = extract(n, e);
        const words = simplifyWords(n, e);
        return expressionProblem({
          prompt: simplifyPositive(expr),
          answer: written(r),
          radical: true,
          positive: true,
          wrong: [written(extract(n, a * b)), written(extract(p + q, e)), sq(mono(n, e))],
          solution: t(
            `**Step 1: multiply under one root.** The coefficients multiply, $${p} \\cdot ${q} = ${n}$, and the exponents add, $${pw("x", a)} \\cdot ${pw("x", b)} = ${pw("x", e)}$:${steps(`${expr} = ${sq(mono(n, e))}`)}**Step 2: simplify.** ${words.en}${steps(`${sq(mono(n, e))} = ${splitWork(n, e)}`)}${extractCheck(r, mono(n, e)).en}`,
            `**第一步：乘到一个根号下。** 系数相乘，$${p} \\cdot ${q} = ${n}$；指数相加，$${pw("x", a)} \\cdot ${pw("x", b)} = ${pw("x", e)}$：${steps(`${expr} = ${sq(mono(n, e))}`)}**第二步：化简。** ${words["zh-CN"]}${steps(`${sq(mono(n, e))} = ${splitWork(n, e)}`)}${extractCheck(r, mono(n, e))["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "coefficients-outside-the-roots",
      title: t("Coefficients outside the roots", "根号外的系数"),
      explanation: t(
        `A product can be regrouped in any order, so the numbers in front of the roots multiply together and the roots multiply together:

$$3\\sqrt{2xy} \\cdot 4\\sqrt{6x^{2}y} = (3 \\cdot 4)\\sqrt{2xy \\cdot 6x^{2}y} = 12\\sqrt{12x^{3}y^{2}}.$$

Then simplify the root, $\\sqrt{12x^{3}y^{2}} = 2xy\\sqrt{3x}$, and multiply what comes out by the $12$ already in front:

$$12 \\cdot 2xy\\sqrt{3x} = 24xy\\sqrt{3x}.$$

> **Watch out.** The numbers in front are multiplied, $3 \\cdot 4 = 12$, not added. They stay **outside** the root; putting them under it changes the value, since $12\\sqrt{3} = \\sqrt{432}$, not $\\sqrt{36}$. And whatever leaves the root when simplifying multiplies the number in front: the answer is $24xy\\sqrt{3x}$, not $2xy\\sqrt{3x}$.`,
        `乘积可以按任意顺序重新组合，所以根号前的数相乘，根式与根式相乘：

$$3\\sqrt{2xy} \\cdot 4\\sqrt{6x^{2}y} = (3 \\cdot 4)\\sqrt{2xy \\cdot 6x^{2}y} = 12\\sqrt{12x^{3}y^{2}}.$$

再化简根式，$\\sqrt{12x^{3}y^{2}} = 2xy\\sqrt{3x}$，把移出的部分与前面的 $12$ 相乘：

$$12 \\cdot 2xy\\sqrt{3x} = 24xy\\sqrt{3x}.$$

> **注意。** 根号前的数相乘，$3 \\cdot 4 = 12$，不是相加。它们留在根号**外**；放进根号里会改变值，因为 $12\\sqrt{3} = \\sqrt{432}$，而不是 $\\sqrt{36}$。化简时移出根号的部分要与前面的数相乘：答案是 $24xy\\sqrt{3x}$，不是 $2xy\\sqrt{3x}$。`,
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
        const C = c1 * c2;
        const words = simplifyWords(n, ex, ey);
        const radicand = mono(n, ex, ey);
        const squared = mono(C * C * n, ex, ey);
        return expressionProblem({
          prompt: simplifyPositive(expr),
          answer: written(r, C),
          radical: true,
          positive: true,
          wrong: [written(r, c1 + c2), written(r), written(extract(c1 * c2 * n, ex, ey))],
          solution: t(
            `**Step 1: multiply.** The numbers in front give $${c1} \\cdot ${c2} = ${C}$; the radicands give $(${mono(p, a, b)})(${mono(q, c, d)}) = ${radicand}$, adding the exponents of each variable:${steps(`${expr} = ${product}`)}**Step 2: simplify the root.** ${words.en} So $${sq(radicand)} = ${written(r)}$.

**Step 3: multiply by the number in front.**${steps(`${product} = ${C} \\cdot ${written(r)} = ${written(r, C)}`)}**Check.** Square both. The original product squares to $${c1}^{2} \\cdot ${c2}^{2} \\cdot ${radicand} = ${squared}$, and the answer squares to $(${mono(C * r.k, r.ox, r.oy)})^{2}${mono(r.m, r.ix, r.iy) === "1" ? "" : ` \\cdot ${mono(r.m, r.ix, r.iy)}`} = ${squared}$ as well.`,
            `**第一步：相乘。** 根号前的数相乘得 $${c1} \\cdot ${c2} = ${C}$；被开方式相乘得 $(${mono(p, a, b)})(${mono(q, c, d)}) = ${radicand}$，每个变量的指数相加：${steps(`${expr} = ${product}`)}**第二步：化简根式。** ${words["zh-CN"]}所以 $${sq(radicand)} = ${written(r)}$。

**第三步：乘以根号前的数。**${steps(`${product} = ${C} \\cdot ${written(r)} = ${written(r, C)}`)}**检验。** 两边都平方。原来的乘积平方后是 $${c1}^{2} \\cdot ${c2}^{2} \\cdot ${radicand} = ${squared}$，答案平方后是 $(${mono(C * r.k, r.ox, r.oy)})^{2}${mono(r.m, r.ix, r.iy) === "1" ? "" : ` \\cdot ${mono(r.m, r.ix, r.iy)}`} = ${squared}$，二者相同。`,
          ),
        });
      },
    },
    {
      id: "products-of-cube-roots",
      title: t("Products of cube roots", "立方根的乘积"),
      explanation: t(
        `The product rule holds for cube roots too, $\\sqrt[3]{a} \\cdot \\sqrt[3]{b} = \\sqrt[3]{ab}$, since $(\\sqrt[3]{a} \\cdot \\sqrt[3]{b})^{3} = ab$. Two cube roots that are not perfect cubes on their own can multiply to one. In $\\sqrt[3]{4x^{2}} \\cdot \\sqrt[3]{2x^{4}}$, multiply the coefficients and add the exponents:

$$\\sqrt[3]{4x^{2}} \\cdot \\sqrt[3]{2x^{4}} = \\sqrt[3]{8x^{6}} = 2x^{2},$$

because $2^{3} = 8$ and $(x^{2})^{3} = x^{6}$.

> **Watch out.** Inside the root the exponents add ($2 + 4 = 6$), and the cube root then **divides by 3**: $x^{2}$, not $x^{6}$ and not $x^{3}$. The coefficient's cube root is $2$, not $8$. Do not stop at $\\sqrt[3]{8x^{6}}$: it is a perfect cube.`,
        `乘法法则对立方根也成立，$\\sqrt[3]{a} \\cdot \\sqrt[3]{b} = \\sqrt[3]{ab}$，因为 $(\\sqrt[3]{a} \\cdot \\sqrt[3]{b})^{3} = ab$。两个本身不是完全立方的立方根，乘积可能是完全立方。在 $\\sqrt[3]{4x^{2}} \\cdot \\sqrt[3]{2x^{4}}$ 中，系数相乘、指数相加：

$$\\sqrt[3]{4x^{2}} \\cdot \\sqrt[3]{2x^{4}} = \\sqrt[3]{8x^{6}} = 2x^{2},$$

因为 $2^{3} = 8$，$(x^{2})^{3} = x^{6}$。

> **注意。** 根号内指数相加（$2 + 4 = 6$），开立方时再**除以 3**：得 $x^{2}$，不是 $x^{6}$，也不是 $x^{3}$。系数的立方根是 $2$，不是 $8$。不要停在 $\\sqrt[3]{8x^{6}}$：它是完全立方。`,
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
        const inside = mono(p * q, 3 * h);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer,
          radical: true,
          wrong: [mono(k ** 3, h), mono(k, 3 * h), mono(k, a * b), cb(mono(p * q, 3 * h))],
          solution: t(
            `**Step 1: multiply under one cube root.** The coefficients give $${p} \\cdot ${q} = ${p * q}$, and the exponents add, $${a} + ${b} = ${3 * h}$:${steps(`${expr} = ${cb(inside)}`)}**Step 2: take the cube root.** $${k}^{3} = ${p * q}$, and dividing the exponent $${3 * h}$ by $3$ gives $${h}$:${steps(`${cb(inside)} = ${answer}`)}**Check.** $(${answer})^{3} = ${k}^{3}${h === 1 ? "x^{3}" : "x^{6}"} = ${inside}$, the product of the two radicands.`,
            `**第一步：乘到一个立方根号下。** 系数相乘得 $${p} \\cdot ${q} = ${p * q}$，指数相加得 $${a} + ${b} = ${3 * h}$：${steps(`${expr} = ${cb(inside)}`)}**第二步：开立方。** $${k}^{3} = ${p * q}$，指数 $${3 * h}$ 除以 $3$ 得 $${h}$：${steps(`${cb(inside)} = ${answer}`)}**检验。** $(${answer})^{3} = ${k}^{3}${h === 1 ? "x^{3}" : "x^{6}"} = ${inside}$，正是两个被开方式的乘积。`,
          ),
        });
      },
    },
    {
      id: "distributing-a-square-root",
      title: t("Distributing a square root", "用分配律乘根式"),
      explanation: t(
        `A root in front of parentheses multiplies **each** term inside, by the distributive law, $a(b + c) = ab + ac$. Then each product is simplified on its own:

$$\\sqrt{2x}\\left(\\sqrt{6x} - 5\\right) = \\sqrt{2x} \\cdot \\sqrt{6x} - 5\\sqrt{2x} = \\sqrt{12x^{2}} - 5\\sqrt{2x} = 2x\\sqrt{3} - 5\\sqrt{2x}.$$

The two terms have different roots, $\\sqrt{3}$ and $\\sqrt{2x}$, so they are not like terms and the answer has two terms.

> **Watch out.** The number term is multiplied by the root too: $\\sqrt{2x} \\cdot (-5) = -5\\sqrt{2x}$, not just $-5$. Use the root of the factor in front, not of the other term. And simplify $\\sqrt{12x^{2}}$; leaving it as is is not simplest form.`,
        `由分配律 $a(b + c) = ab + ac$，括号前的根式要乘以括号里的**每一项**。再把每个乘积分别化简：

$$\\sqrt{2x}\\left(\\sqrt{6x} - 5\\right) = \\sqrt{2x} \\cdot \\sqrt{6x} - 5\\sqrt{2x} = \\sqrt{12x^{2}} - 5\\sqrt{2x} = 2x\\sqrt{3} - 5\\sqrt{2x}.$$

两项的根式不同，分别是 $\\sqrt{3}$ 和 $\\sqrt{2x}$，所以不是同类项，答案有两项。

> **注意。** 数的那一项也要乘以根式：$\\sqrt{2x} \\cdot (-5) = -5\\sqrt{2x}$，不能只写 $-5$。乘上去的是括号前的根式，不是另一项的根式。还要化简 $\\sqrt{12x^{2}}$；不化简就不是最简形式。`,
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
        const words = simplifyWords(p * q, 2);
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
            `**Step 1: distribute.** $${sq(mono(p, 1))}$ multiplies both terms. Times $${sq(mono(q, 1))}$ it gives $${sq(mono(p * q, 2))}$, and times $${c}$ it gives $${second}$:${steps(`${expr} = ${joinTerms(sq(mono(p * q, 2)), second)}`)}**Step 2: simplify each product.** ${words.en}${steps(`${joinTerms(sq(mono(p * q, 2)), second)} = ${answer}`)}The roots of the two terms differ, so they cannot be combined.

**Check.** The first term squared is $(${mono(r.k, 1)})^{2}${r.m === 1 ? "" : ` \\cdot ${r.m}`} = ${mono(p * q, 2)} = (${mono(p, 1)})(${mono(q, 1)})$, the product of the two radicands, and the second term is $${c}$ times the root in front.`,
            `**第一步：用分配律展开。** $${sq(mono(p, 1))}$ 乘以两项：乘 $${sq(mono(q, 1))}$ 得 $${sq(mono(p * q, 2))}$，乘 $${c}$ 得 $${second}$：${steps(`${expr} = ${joinTerms(sq(mono(p * q, 2)), second)}`)}**第二步：分别化简每个乘积。** ${words["zh-CN"]}${steps(`${joinTerms(sq(mono(p * q, 2)), second)} = ${answer}`)}两项的根式不同，不能合并。

**检验。** 第一项平方是 $(${mono(r.k, 1)})^{2}${r.m === 1 ? "" : ` \\cdot ${r.m}`} = ${mono(p * q, 2)} = (${mono(p, 1)})(${mono(q, 1)})$，正是两个被开方式的乘积；第二项是 $${c}$ 乘以括号前的根式。`,
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
  intro: t(
    `The product rule joined and split roots of products. Roots of quotients behave the same way: for $a \\ge 0$ and $b > 0$,

$$\\sqrt{\\frac{a}{b}} = \\frac{\\sqrt{a}}{\\sqrt{b}},$$

because the right side is not negative and its square is $\\frac{(\\sqrt{a})^{2}}{(\\sqrt{b})^{2}} = \\frac{a}{b}$. This **quotient rule** works in both directions. Read from right to left, it puts a quotient of two roots under one root, where the division can be done:

$$\\frac{\\sqrt{54x^{5}}}{\\sqrt{2x}} = \\sqrt{\\frac{54x^{5}}{2x}} = \\sqrt{27x^{4}} = 3x^{2}\\sqrt{3}.$$

Read from left to right, it splits the root of a fraction into a root on top and a root below, each simplified on its own. In this lesson we divide roots, take roots of fractions, and reduce a fraction under the root before taking its root. All variables are positive.`,
    `乘法法则用来合并和拆开乘积的根式。商的根式也一样：当 $a \\ge 0$，$b > 0$ 时，

$$\\sqrt{\\frac{a}{b}} = \\frac{\\sqrt{a}}{\\sqrt{b}},$$

因为右边不是负数，并且它的平方是 $\\frac{(\\sqrt{a})^{2}}{(\\sqrt{b})^{2}} = \\frac{a}{b}$。这条**除法法则**两个方向都能用。从右往左读，它把两个根式的商放到一个根号下，在那里做除法：

$$\\frac{\\sqrt{54x^{5}}}{\\sqrt{2x}} = \\sqrt{\\frac{54x^{5}}{2x}} = \\sqrt{27x^{4}} = 3x^{2}\\sqrt{3}.$$

从左往右读，它把分式的根式拆成分子的根式和分母的根式，分别化简。这节课先做根式的除法，再求分式的平方根，最后先在根号下约分再开方。所有变量都是正数。`,
  ),
  knowledgePoints: [
    {
      id: "dividing-square-roots",
      title: t("Dividing square roots", "平方根的除法"),
      explanation: t(
        `To divide two square roots, put the quotient under one root, $\\frac{\\sqrt{a}}{\\sqrt{b}} = \\sqrt{\\frac{a}{b}}$, and divide there: the coefficients are divided and the exponents of $x$ are **subtracted**, since $\\frac{x^{m}}{x^{n}} = x^{m - n}$. Then simplify what is left.

$$\\frac{\\sqrt{54x^{5}}}{\\sqrt{2x}} = \\sqrt{\\frac{54x^{5}}{2x}} = \\sqrt{27x^{4}}$$

Now $27 = 9 \\cdot 3$ and $x^{4} = (x^{2})^{2}$, so $\\sqrt{27x^{4}} = 3x^{2}\\sqrt{3}$.

> **Watch out.** Divide the coefficients, do not subtract them: $54 \\div 2 = 27$, not $52$. Subtract the exponents, do not add them: $x^{5} \\div x = x^{4}$. And finish by taking out the perfect squares.`,
        `两个平方根相除，把商放到一个根号下，$\\frac{\\sqrt{a}}{\\sqrt{b}} = \\sqrt{\\frac{a}{b}}$，在根号下做除法：系数相除，$x$ 的指数**相减**，因为 $\\frac{x^{m}}{x^{n}} = x^{m - n}$。再化简剩下的部分。

$$\\frac{\\sqrt{54x^{5}}}{\\sqrt{2x}} = \\sqrt{\\frac{54x^{5}}{2x}} = \\sqrt{27x^{4}}$$

而 $27 = 9 \\cdot 3$，$x^{4} = (x^{2})^{2}$，所以 $\\sqrt{27x^{4}} = 3x^{2}\\sqrt{3}$。

> **注意。** 系数相除，不是相减：$54 \\div 2 = 27$，不是 $52$。指数相减，不是相加：$x^{5} \\div x = x^{4}$。最后还要把完全平方移出根号。`,
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
        const answer = written(extract(q, e));
        const words = simplifyWords(q, e);
        const done = answer === sq(mono(q, e));
        return expressionProblem({
          prompt: simplifyPositive(expr),
          answer,
          radical: true,
          positive: true,
          wrong: [...(n1 > n2 ? [written(extract(n1 - n2, e))] : []), written(extract(q, a1 + a2)), sq(mono(q, e))],
          solution: t(
            `**Step 1: divide under one root.** The coefficients divide, $${n1} \\div ${n2} = ${q}$, and the exponents subtract, $${a1} - ${a2} = ${e}$:${steps(`${expr} = \\sqrt{\\frac{${mono(n1, a1)}}{${mono(n2, a2)}}} = ${sq(mono(q, e))}`)}**Step 2: simplify.** ${words.en}${done ? ` Nothing more comes out of the root, so the answer is $${answer}$.\n\n` : steps(`${sq(mono(q, e))} = ${splitWork(q, e)}`)}**Check.** The answer times the denominator must give the numerator, so the square of the answer, $${mono(q, e)}$, times the radicand below must give the radicand on top: $${mono(q, e)} \\cdot ${mono(n2, a2)} = ${mono(n1, a1)}$.`,
            `**第一步：在一个根号下相除。** 系数相除，$${n1} \\div ${n2} = ${q}$；指数相减，$${a1} - ${a2} = ${e}$：${steps(`${expr} = \\sqrt{\\frac{${mono(n1, a1)}}{${mono(n2, a2)}}} = ${sq(mono(q, e))}`)}**第二步：化简。** ${words["zh-CN"]}${done ? `根号内不能再移出因式，所以答案是 $${answer}$。\n\n` : steps(`${sq(mono(q, e))} = ${splitWork(q, e)}`)}**检验。** 答案乘以分母应当等于分子，所以答案的平方 $${mono(q, e)}$ 乘以分母的被开方式，应当等于分子的被开方式：$${mono(q, e)} \\cdot ${mono(n2, a2)} = ${mono(n1, a1)}$。`,
          ),
        });
      },
    },
    {
      id: "square-roots-of-fractions",
      title: t("Square roots of fractions", "分式的平方根"),
      explanation: t(
        `Read the quotient rule the other way, $\\sqrt{\\frac{a}{b}} = \\frac{\\sqrt{a}}{\\sqrt{b}}$, to split the root of a fraction into a root on top and a root below. Each is then a root of a monomial, simplified as before:

$$\\sqrt{\\frac{7x^{5}}{16y^{2}}} = \\frac{\\sqrt{7x^{5}}}{\\sqrt{16y^{2}}} = \\frac{x^{2}\\sqrt{7x}}{4y}.$$

On top, $x^{5} = x^{4} \\cdot x$ gives $x^{2}\\sqrt{7x}$; below, $16y^{2}$ is a perfect square, so its root is $4y$ and no root is left in the denominator.

> **Watch out.** The denominator's root must be taken: $\\sqrt{16y^{2}} = 4y$, so writing $16$ or $y^{2}$ below the bar is wrong. On top, only the even part of an odd power comes out: $\\sqrt{x^{5}}$ is $x^{2}\\sqrt{x}$, not $x^{5}$ outside the root.`,
        `把除法法则反过来用，$\\sqrt{\\frac{a}{b}} = \\frac{\\sqrt{a}}{\\sqrt{b}}$，把分式的平方根拆成分子的根式和分母的根式。它们都是单项式的平方根，照以前的方法化简：

$$\\sqrt{\\frac{7x^{5}}{16y^{2}}} = \\frac{\\sqrt{7x^{5}}}{\\sqrt{16y^{2}}} = \\frac{x^{2}\\sqrt{7x}}{4y}.$$

分子上，$x^{5} = x^{4} \\cdot x$，得 $x^{2}\\sqrt{7x}$；分母上，$16y^{2}$ 是完全平方，开方得 $4y$，分母中不再有根式。

> **注意。** 分母一定要开方：$\\sqrt{16y^{2}} = 4y$，所以分母写 $16$ 或 $y^{2}$ 都是错的。分子上，奇次幂只有偶次部分移出：$\\sqrt{x^{5}}$ 是 $x^{2}\\sqrt{x}$，不能把 $x^{5}$ 整个移到根号外。`,
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
        const raw = `\\frac{${top}}{${mono(d, 0, b)}}`;
        const words = simplifyWords(n, e);
        const below = mono(d * d, 0, 2 * b);
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
            `**Step 1: split the root.** By the quotient rule, $${sq(inside)} = \\frac{${sq(mono(n, e))}}{${sq(below)}}$.

**Step 2: the numerator.** ${words.en} So $${sq(mono(n, e))} = ${top}$.

**Step 3: the denominator.** $${below}$ is a perfect square, so $${sq(below)} = ${mono(d, 0, b)}$.${steps(`${sq(inside)} = ${raw}${answer === raw ? "" : ` = ${answer}`}`)}**Check.** Squaring the answer squares the top and the bottom, and must give back the fraction under the root: $\\left(${answer}\\right)^{2} = ${inside}$.`,
            `**第一步：拆开根式。** 由除法法则，$${sq(inside)} = \\frac{${sq(mono(n, e))}}{${sq(below)}}$。

**第二步：分子。** ${words["zh-CN"]}所以 $${sq(mono(n, e))} = ${top}$。

**第三步：分母。** $${below}$ 是完全平方，所以 $${sq(below)} = ${mono(d, 0, b)}$。${steps(`${sq(inside)} = ${raw}${answer === raw ? "" : ` = ${answer}`}`)}**检验。** 把答案平方，就是把分子和分母都平方，应当得回根号下的分式：$\\left(${answer}\\right)^{2} = ${inside}$。`,
          ),
        });
      },
    },
    {
      id: "reducing-under-the-root",
      title: t("Reducing under the root first", "先在根号下约分"),
      explanation: t(
        `A fraction under a root is still a fraction, so it can be reduced first. Reducing does not change its value, and the smaller numbers are easier to take roots of. In $\\sqrt{\\frac{12x^{5}}{27x}}$, cancel the common factor $3$ of $12$ and $27$, and $x$ from the powers:

$$\\sqrt{\\frac{12x^{5}}{27x}} = \\sqrt{\\frac{4x^{4}}{9}} = \\frac{2x^{2}}{3}.$$

Neither $12$ nor $27$ is a perfect square, but after reducing, $4$ and $9$ both are.

> **Watch out.** After reducing, take the root of the denominator as well: $\\sqrt{9} = 3$, not $9$. Reduce the exponents by subtracting ($x^{5} \\div x = x^{4}$), and then halve them for the root ($\\sqrt{x^{4}} = x^{2}$); halving before reducing, or skipping the reduction, gives the wrong power.`,
        `根号下的分式仍然是分式，可以先约分。约分不改变它的值，而较小的数更容易开方。在 $\\sqrt{\\frac{12x^{5}}{27x}}$ 中，约去 $12$ 和 $27$ 的公因数 $3$，以及幂中的 $x$：

$$\\sqrt{\\frac{12x^{5}}{27x}} = \\sqrt{\\frac{4x^{4}}{9}} = \\frac{2x^{2}}{3}.$$

$12$ 和 $27$ 都不是完全平方数，但约分后 $4$ 和 $9$ 都是。

> **注意。** 约分后分母也要开方：$\\sqrt{9} = 3$，不是 $9$。指数先相减来约分（$x^{5} \\div x = x^{4}$），再为开方减半（$\\sqrt{x^{4}} = x^{2}$）；不约分或者先减半，幂就会出错。`,
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
        const words = simplifyWords(n, e);
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
            `**Step 1: reduce the fraction.** The coefficients $${g * n}$ and $${g * d * d}$ share the factor $${g}$, and $${pw("x", q)}$ cancels from the powers, leaving $${pw("x", q + e)} \\div ${pw("x", q)} = ${pw("x", e)}$:${steps(`${sq(inside)} = ${sq(reduced)}`)}**Step 2: take the roots.** On top, ${words.en.charAt(0).toLowerCase()}${words.en.slice(1)} Below, $\\sqrt{${d * d}} = ${d}$.${steps(`${sq(reduced)} = ${answer}`)}**Check.** Multiplying the top and bottom of $${reduced}$ by $${mono(g, q)}$ gives back the fraction in the question, and squaring the answer gives that reduced fraction: $\\left(${answer}\\right)^{2} = ${reduced}$.`,
            `**第一步：约分。** 系数 $${g * n}$ 和 $${g * d * d}$ 有公因数 $${g}$，幂中约去 $${pw("x", q)}$，剩下 $${pw("x", q + e)} \\div ${pw("x", q)} = ${pw("x", e)}$：${steps(`${sq(inside)} = ${sq(reduced)}`)}**第二步：开方。** 分子上，${words["zh-CN"]}分母上，$\\sqrt{${d * d}} = ${d}$。${steps(`${sq(reduced)} = ${answer}`)}**检验。** 把 $${reduced}$ 的分子分母都乘以 $${mono(g, q)}$，就得回题中的分式；而把答案平方正好得到这个约分后的分式：$\\left(${answer}\\right)^{2} = ${reduced}$。`,
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

/** sumUnder writes the value of a·v + b as it is worked out: "-12 + 21". */
const sumUnder = (a: number, v: number, b: number) => (b === 0 ? String(a * v) : joinTerms(String(a * v), String(b)));

/** squaresWork walks √(x² + y²) at x = sx, y = sy to the number under the root. */
function squaresWork(sx: number, sy: number): Text {
  const [x2, y2] = [sx * sx, sy * sy];
  const work = steps(`\\sqrt{(${sx})^{2} + (${sy})^{2}} = \\sqrt{${x2} + ${y2}} = \\sqrt{${x2 + y2}}`);
  return t(
    `**Step 1: substitute and work under the root.** Put each value in parentheses, so that its sign is squared too. A square is never negative: $(${sx})^{2} = ${x2}$ and $(${sy})^{2} = ${y2}$.${work}`,
    `**第一步：代入，并算出根号下的值。** 每个值都加上括号，这样它的符号也一起平方。平方不会是负数：$(${sx})^{2} = ${x2}$，$(${sy})^{2} = ${y2}$。${work}`,
  );
}

/** cubeWords says that n = r³, so ∛n = r, and warns about the sign when r is negative. */
function cubeWords(r: number): Text {
  return r < 0
    ? t(
        `$${paren(r)}^{3} = ${r ** 3}$, so the cube root is $${r}$. A negative number has a negative cube root.`,
        `$${paren(r)}^{3} = ${r ** 3}$，所以立方根是 $${r}$。负数的立方根是负数。`,
      )
    : t(`$${r}^{3} = ${r ** 3}$, so the cube root is $${r}$.`, `$${r}^{3} = ${r ** 3}$，所以立方根是 $${r}$。`);
}

/** cubeCheck cubes the value r back to the number under the root. */
const cubeCheck = (r: number) =>
  t(
    `**Check.** Cubing the value must give back the number under the root: $${paren(r)}^{3} = ${r ** 3}$.`,
    `**检验。** 把所得的值立方，应当得回根号下的数：$${paren(r)}^{3} = ${r ** 3}$。`,
  );

export const evaluatingRadicalExpressions: TopicDef = {
  id: "evaluating-radical-expressions",
  title: t("Evaluating Algebraic Radical Expressions", "代数根式求值"),
  summary: t(
    "Substitute values into expressions with square roots and cube roots, and simplify the result.",
    "把数值代入含平方根和立方根的式子，并化简结果。",
  ),
  prerequisites: ["simplifying-square-roots", "evaluating-expressions"],
  encompasses: [
    { topic: "evaluating-expressions", weight: 0.4 },
    { topic: "square-roots-and-cube-roots", weight: 0.4 },
  ],
  xp: 10,
  standards: ["CCSS.HSN.RN.A.2"],
  intro: t(
    `To evaluate an expression we substitute the values and follow the order of operations. Expressions such as $\\sqrt{x^{2} + y^{2}}$, the distance from the origin to the point $(x, y)$, or $\\sqrt{b^{2} - 4ac}$, which appears in the quadratic formula, also contain roots. A root sign groups like a pair of parentheses: everything under it is worked out first, and only then is the root taken. For $\\sqrt{2x + 1}$ at $x = 4$:

$$\\sqrt{2(4) + 1} = \\sqrt{8 + 1} = \\sqrt{9} = 3.$$

The square root is the non-negative number whose square is under the root, so the value is $3$, not $-3$. In this lesson the value under the root is sometimes a perfect square, sometimes not, in which case the answer is written in simplest radical form, and sometimes it sits under a cube root, where it may be negative.`,
    `求式子的值，就是代入数值，再按运算顺序计算。像 $\\sqrt{x^{2} + y^{2}}$（原点到点 $(x, y)$ 的距离）或二次方程求根公式里的 $\\sqrt{b^{2} - 4ac}$ 这样的式子还含有根号。根号像一对括号一样起分组作用：先把根号下的全部算出来，再开方。对 $\\sqrt{2x + 1}$，当 $x = 4$ 时：

$$\\sqrt{2(4) + 1} = \\sqrt{8 + 1} = \\sqrt{9} = 3.$$

平方根是平方等于根号下的数的那个非负数，所以值是 $3$，不是 $-3$。这节课中，根号下的值有时是完全平方数；有时不是，这时答案要写成最简根式；有时它在立方根号下，可以是负数。`,
  ),
  knowledgePoints: [
    {
      id: "evaluating-to-a-whole-number",
      title: t("Evaluating square roots", "平方根式求值"),
      explanation: t(
        `A root sign groups like parentheses: substitute, work out everything under it, and then take the root. Put a negative value in parentheses, so that its sign is squared too. For $\\sqrt{x^{2} + y^{2}}$ at $x = 6$ and $y = -8$:

$$\\sqrt{(6)^{2} + (-8)^{2}} = \\sqrt{36 + 64} = \\sqrt{100} = 10.$$

The answer is $10$ because $10^{2} = 100$ and $10$ is not negative.

> **Watch out.** The root of a sum is not the sum of the roots: $\\sqrt{36 + 64} = 10$, but $\\sqrt{36} + \\sqrt{64} = 14$, and adding $x + y$ directly is just as wrong. Do not stop at the number under the root, and do not square it: take its root. The square root is never negative.`,
        `根号像括号一样起分组作用：先代入，算出根号下的全部，再开方。负数要加括号，这样它的符号也一起平方。对 $\\sqrt{x^{2} + y^{2}}$，当 $x = 6$，$y = -8$ 时：

$$\\sqrt{(6)^{2} + (-8)^{2}} = \\sqrt{36 + 64} = \\sqrt{100} = 10.$$

答案是 $10$，因为 $10^{2} = 100$，并且 $10$ 不是负数。

> **注意。** 和的平方根不等于平方根的和：$\\sqrt{36 + 64} = 10$，而 $\\sqrt{36} + \\sqrt{64} = 14$；直接把 $x + y$ 相加也同样是错的。不要停在根号下的数，也不要把它平方，而要开方。平方根不会是负数。`,
      ),
      keyPrerequisites: ["evaluating-expressions"],
      generate(rng) {
        const kind = rng.pick(["pythagoras", "discriminant", "linear"] as const);
        if (kind === "pythagoras") {
          const [a, b, c] = rng.pick(triples);
          const [x, y] = rng.bool() ? [a, b] : [b, a];
          const [sx, sy] = [rng.sign() * x, rng.sign() * y];
          const work = squaresWork(sx, sy);
          return numberProblem({
            prompt: evaluate("\\sqrt{x^{2} + y^{2}}", [
              ["x", sx],
              ["y", sy],
            ]),
            answer: c,
            wrong: [-c],
            mistakes: [
              why(
                sx + sy,
                "You added $x$ and $y$ as if the root undid each square separately. Add the squares under the radical first, since $\\sqrt{a + b}$ is not $\\sqrt{a} + \\sqrt{b}$.",
                "你把 $x$ 和 $y$ 直接相加了，好像根号能分别抵消每个平方。应先算出根号下平方的和，因为 $\\sqrt{a + b}$ 不等于 $\\sqrt{a} + \\sqrt{b}$。",
              ),
              why(
                x + y,
                "You took the root of each square separately. Add under the radical first, since $\\sqrt{a + b}$ is not $\\sqrt{a} + \\sqrt{b}$.",
                "你对每个平方分别开方了。应先算出根号下的和，因为 $\\sqrt{a + b}$ 不等于 $\\sqrt{a} + \\sqrt{b}$。",
              ),
              why(c * c, "That is the number under the radical. Now take its square root.", "这是根号下的数，还要开平方。"),
            ],
            solution: t(
              `${work.en}**Step 2: take the root.** $${c * c} = ${c}^{2}$, and the square root is the non-negative number, so the value is $${c}$.

**Check.** Squaring the value must give back the number under the root: $${c}^{2} = ${c * c} = ${x * x} + ${y * y}$.`,
              `${work["zh-CN"]}**第二步：开方。** $${c * c} = ${c}^{2}$，而平方根取非负的那个数，所以值是 $${c}$。

**检验。** 把所得的值平方，应当得回根号下的数：$${c}^{2} = ${c * c} = ${x * x} + ${y * y}$。`,
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
          const f = 4 * a * c;
          const middle = c === 0 ? "" : ` = \\sqrt{${b * b} ${f < 0 ? "+" : "-"} ${Math.abs(f)}}`;
          const work = steps(`\\sqrt{(${b})^{2} - 4(${a})(${c})}${middle} = \\sqrt{${disc}}`);
          const product =
            c === 0
              ? t(`$4(${a})(0) = 0$, so nothing is subtracted.`, `$4(${a})(0) = 0$，所以什么也不减。`)
              : f < 0
                ? t(
                    `$4(${a})(${c}) = ${f}$; subtracting a negative number adds its opposite.`,
                    `$4(${a})(${c}) = ${f}$，减去一个负数等于加上它的相反数。`,
                  )
                : t(`$4(${a})(${c}) = ${f}$.`, `$4(${a})(${c}) = ${f}$。`);
          return numberProblem({
            prompt: evaluate("\\sqrt{b^{2} - 4ac}", [
              ["a", a],
              ["b", b],
              ["c", c],
            ]),
            answer,
            wrong: [disc, -answer, Math.abs(b)],
            solution: t(
              `**Step 1: substitute and work under the root.** Put each value in parentheses. The square is $(${b})^{2} = ${b * b}$, and ${product.en}${work}**Step 2: take the root.** $${disc} = ${answer}^{2}$, so the value is $${answer}$.

**Check.** Squaring the value must give back the number under the root: $${answer}^{2} = ${disc}$.`,
              `**第一步：代入，并算出根号下的值。** 每个值都加上括号。平方是 $(${b})^{2} = ${b * b}$，而 ${product["zh-CN"]}${work}**第二步：开方。** $${disc} = ${answer}^{2}$，所以值是 $${answer}$。

**检验。** 把所得的值平方，应当得回根号下的数：$${answer}^{2} = ${disc}$。`,
            ),
          });
        }
        const r = rng.int(1, 12);
        const v = rng.nonZero(-9, 9);
        const a = rng.int(2, 9);
        const b = r * r - a * v;
        const work = steps(`${sq(substituted(a, v, b))}${b === 0 ? "" : ` = ${sq(sumUnder(a, v, b))}`} = \\sqrt{${r * r}}`);
        return numberProblem({
          prompt: evaluate(sq(linear(a, b)), [["x", v]]),
          answer: r,
          wrong: [-r],
          mistakes: [why(r * r, "You squared instead of taking the root.", "你做了平方，而不是开方。")],
          solution: t(
            `**Step 1: substitute and work under the root.** Multiply first, $${a}(${v}) = ${a * v}$${b === 0 ? "" : ", then add"}:${work}**Step 2: take the root.** $${r * r} = ${r}^{2}$, and the square root is the non-negative number, so the value is $${r}$.

**Check.** Squaring the value must give back the number under the root: $${r}^{2} = ${r * r}$.`,
            `**第一步：代入，并算出根号下的值。** 先乘，$${a}(${v}) = ${a * v}$${b === 0 ? "" : "，再加"}：${work}**第二步：开方。** $${r * r} = ${r}^{2}$，而平方根取非负的那个数，所以值是 $${r}$。

**检验。** 把所得的值平方，应当得回根号下的数：$${r}^{2} = ${r * r}$。`,
          ),
        });
      },
    },
    {
      id: "evaluating-to-simplest-radical-form",
      title: t("Results in simplest radical form", "结果写成最简根式"),
      explanation: t(
        `Often the number under the root is not a perfect square. Then the value is irrational, and we write it exactly in simplest radical form: take the largest perfect-square factor out of the root. For $\\sqrt{x^{2} + y^{2}}$ at $x = 4$ and $y = 4$:

$$\\sqrt{16 + 16} = \\sqrt{32} = \\sqrt{16} \\cdot \\sqrt{2} = 4\\sqrt{2}.$$

$16$ is the largest perfect square dividing $32$, so nothing more comes out of $\\sqrt{2}$.

> **Watch out.** Do not stop at $\\sqrt{32}$: it is not in simplest form. Do not swap the parts: $\\sqrt{16} \\cdot \\sqrt{2}$ is $4\\sqrt{2}$, not $2\\sqrt{4}$. And do not add $x + y$ or drop the root, since $\\sqrt{32}$ is neither $8$ nor $32$.`,
        `根号下的数常常不是完全平方数。这时值是无理数，我们用最简根式把它准确地写出来：把最大的完全平方因数移出根号。对 $\\sqrt{x^{2} + y^{2}}$，当 $x = 4$，$y = 4$ 时：

$$\\sqrt{16 + 16} = \\sqrt{32} = \\sqrt{16} \\cdot \\sqrt{2} = 4\\sqrt{2}.$$

$16$ 是整除 $32$ 的最大完全平方数，所以 $\\sqrt{2}$ 中不能再移出因数。

> **注意。** 不要停在 $\\sqrt{32}$：它还不是最简形式。不要把两部分对调：$\\sqrt{16} \\cdot \\sqrt{2}$ 是 $4\\sqrt{2}$，不是 $2\\sqrt{4}$。也不要直接算 $x + y$ 或者去掉根号，$\\sqrt{32}$ 既不是 $8$，也不是 $32$。`,
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
          const work = squaresWork(sx, sy);
          const words = squareFactorWords(n, k, m);
          const answer = radTerm(k, 0, 0, m, 0, 0);
          const simplify = k > 1 ? steps(`\\sqrt{${n}} = ${splitWork(n, 0)}`) : "\n\n";
          const check = k > 1 ? `${answer}\\right)^{2} = ${k * k} \\cdot ${m}` : `${answer}\\right)^{2}`;
          return radicalProblem({
            prompt: evaluate("\\sqrt{x^{2} + y^{2}}", [
              ["x", sx],
              ["y", sy],
            ]),
            answer: [k, m],
            wrong: [String(x + y), ...(k > 1 ? [sq(String(n)), `${front(m)}\\sqrt{${k}}`] : [])],
            solution: t(
              `${work.en}**Step 2: simplify the root.** ${words.en}${k > 1 ? "" : ` The value is $\\sqrt{${n}}$.`}${simplify}**Check.** Squaring the value must give back the number under the root: $\\left(${check} = ${n} = ${x * x} + ${y * y}$.`,
              `${work["zh-CN"]}**第二步：化简根式。** ${words["zh-CN"]}${k > 1 ? "" : `值是 $\\sqrt{${n}}$。`}${simplify}**检验。** 把所得的值平方，应当得回根号下的数：$\\left(${check} = ${n} = ${x * x} + ${y * y}$。`,
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
        const C = c === 1 ? "" : c;
        const expr = `${C}${sq(linear(a, b))}`;
        const answer = radTerm(c * k, 0, 0, m, 0, 0);
        const words = squareFactorWords(n, k, m);
        const work = steps(`${C}${sq(substituted(a, v, b))}${b === 0 ? "" : ` = ${C}${sq(sumUnder(a, v, b))}`} = ${C}\\sqrt{${n}}`);
        const simplify = steps(
          `${C}\\sqrt{${n}} = ${c === 1 ? "" : `${c} \\cdot `}${radTerm(k, 0, 0, m, 0, 0)}${c === 1 ? "" : ` = ${answer}`}`,
        );
        const check =
          c === 1
            ? t(
                `**Check.** Squaring the value must give back the number under the root: $\\left(${answer}\\right)^{2} = ${k * k} \\cdot ${m} = ${n}$.`,
                `**检验。** 把所得的值平方，应当得回根号下的数：$\\left(${answer}\\right)^{2} = ${k * k} \\cdot ${m} = ${n}$。`,
              )
            : t(
                `**Check.** Squaring the value must give $${c}^{2}$ times the number under the root: $\\left(${answer}\\right)^{2} = ${c * c * k * k} \\cdot ${m} = ${c * c * n} = ${c * c} \\cdot ${n}$.`,
                `**检验。** 把所得的值平方，应当得到根号下的数的 $${c}^{2}$ 倍：$\\left(${answer}\\right)^{2} = ${c * c * k * k} \\cdot ${m} = ${c * c * n} = ${c * c} \\cdot ${n}$。`,
              );
        return radicalProblem({
          prompt: evaluate(expr, [["x", v]]),
          answer: [c * k, m],
          wrong: [`${C}\\sqrt{${n}}`, `${front(c * m)}\\sqrt{${k}}`, String(c * n)],
          solution: t(
            `**Step 1: substitute and work under the root.** Multiply first, $${a}(${v}) = ${a * v}$${b === 0 ? "" : ", then add"}:${work}**Step 2: simplify the root.** ${words.en}${c === 1 ? "" : ` Then multiply by the $${c}$ in front.`}${simplify}${check.en}`,
            `**第一步：代入，并算出根号下的值。** 先乘，$${a}(${v}) = ${a * v}$${b === 0 ? "" : "，再加"}：${work}**第二步：化简根式。** ${words["zh-CN"]}${c === 1 ? "" : `再乘以前面的 $${c}$。`}${simplify}${check["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "evaluating-cube-roots",
      title: t("Evaluating cube roots", "立方根式求值"),
      explanation: t(
        `A cube root groups like a square root: work out the number under it first. Unlike a square root, a cube root may be taken of a negative number, because a negative number cubed is negative: $(-3)^{3} = -27$. For $\\sqrt[3]{2x - 9}$ at $x = -9$:

$$\\sqrt[3]{2(-9) - 9} = \\sqrt[3]{-18 - 9} = \\sqrt[3]{-27} = -3.$$

> **Watch out.** The cube root has the same sign as the number under it: $\\sqrt[3]{-27} = -3$, not $3$. Take the cube root, do not cube: $\\sqrt[3]{-27}$ is $-3$, not $-27$ cubed or $(-3)^{3}$.`,
        `立方根号和平方根号一样起分组作用：先算出根号下的数。和平方根不同，负数也可以开立方，因为负数的立方是负数：$(-3)^{3} = -27$。对 $\\sqrt[3]{2x - 9}$，当 $x = -9$ 时：

$$\\sqrt[3]{2(-9) - 9} = \\sqrt[3]{-18 - 9} = \\sqrt[3]{-27} = -3.$$

> **注意。** 立方根与根号下的数同号：$\\sqrt[3]{-27} = -3$，不是 $3$。要开立方，不要做立方：$\\sqrt[3]{-27}$ 是 $-3$，不是 $-27$ 的立方，也不是 $(-3)^{3}$。`,
      ),
      generate(rng) {
        const r = rng.nonZero(-6, 6);
        if (rng.bool()) {
          const v = rng.nonZero(-9, 9);
          const a = rng.nonZero(-6, 9);
          const b = r ** 3 - a * v;
          const work = steps(`${cb(substituted(a, v, b))}${b === 0 ? "" : ` = ${cb(sumUnder(a, v, b))}`} = ${cb(String(r ** 3))}`);
          const words = cubeWords(r);
          const times = a === 1 ? `(${v}) = ${v}` : a === -1 ? `-(${v}) = ${-v}` : `${a}(${v}) = ${a * v}`;
          return numberProblem({
            prompt: evaluate(cb(linear(a, b)), [["x", v]]),
            answer: r,
            mistakes: [
              why(
                -r,
                "The sign is wrong. The cube root keeps the sign of the number inside, since a negative cubed is negative.",
                "符号错了。立方根与根号内的数同号，因为负数的立方仍为负。",
              ),
              why(r ** 3, "You cubed instead of taking the cube root.", "你做了立方，而不是开立方。"),
            ],
            solution: t(
              `**Step 1: substitute and work under the root.** Multiply first, $${times}$${b === 0 ? "" : ", then add"}:${work}**Step 2: take the cube root.** ${words.en}

${cubeCheck(r).en}`,
              `**第一步：代入，并算出根号下的值。** 先乘，$${times}$${b === 0 ? "" : "，再加"}：${work}**第二步：开立方。** ${words["zh-CN"]}

${cubeCheck(r)["zh-CN"]}`,
            ),
          });
        }
        const x = rng.nonZero(-6, 6);
        const y = r ** 3 - x * x;
        const expr = "\\sqrt[3]{x^{2} + y}";
        const work = steps(`${cb(`(${x})^{2} + (${y})`)} = ${cb(joinTerms(String(x * x), String(y)))} = ${cb(String(r ** 3))}`);
        const words = cubeWords(r);
        return numberProblem({
          prompt: evaluate(expr, [
            ["x", x],
            ["y", y],
          ]),
          answer: r,
          mistakes: [
            why(
              -r,
              "The sign is wrong. The cube root keeps the sign of the number inside, since a negative cubed is negative.",
              "符号错了。立方根与根号内的数同号，因为负数的立方仍为负。",
            ),
            why(r ** 3, "You cubed instead of taking the cube root.", "你做了立方，而不是开立方。"),
          ],
          solution: t(
            `**Step 1: substitute and work under the root.** Square first, $(${x})^{2} = ${x * x}$${y === 0 ? "" : `, then add $${y}$`}:${work}**Step 2: take the cube root.** ${words.en}

${cubeCheck(r).en}`,
            `**第一步：代入，并算出根号下的值。** 先平方，$(${x})^{2} = ${x * x}$${y === 0 ? "" : `，再加 $${y}$`}：${work}**第二步：开立方。** ${words["zh-CN"]}

${cubeCheck(r)["zh-CN"]}`,
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
  intro: t(
    `We already add numerical radicals such as $2\\sqrt{3} + 5\\sqrt{3} = 7\\sqrt{3}$, just as $2a + 5a = 7a$: the common root is a factor, and the distributive law collects its coefficients. The same works when the roots contain variables. Here $\\sqrt{2x}$ is the common factor:

$$3\\sqrt{2x} + 4\\sqrt{2x} = (3 + 4)\\sqrt{2x} = 7\\sqrt{2x}.$$

So terms combine exactly when the parts after the coefficient agree. Roots that look different may agree once simplified, as $\\sqrt{8x} = 2\\sqrt{2x}$ and $\\sqrt{18x} = 3\\sqrt{2x}$ do, which is why we simplify every root first. In this lesson we combine like terms, simplify before combining, and leave unlike roots apart. All variables are positive.`,
    `我们已经会加数字根式，例如 $2\\sqrt{3} + 5\\sqrt{3} = 7\\sqrt{3}$，就像 $2a + 5a = 7a$：相同的根式是一个公因式，用分配律把它的系数合在一起。根号里含变量时也一样。这里 $\\sqrt{2x}$ 是公因式：

$$3\\sqrt{2x} + 4\\sqrt{2x} = (3 + 4)\\sqrt{2x} = 7\\sqrt{2x}.$$

所以，只有系数后面的部分完全相同的项才能合并。看起来不同的根式化简后可能相同，例如 $\\sqrt{8x} = 2\\sqrt{2x}$，$\\sqrt{18x} = 3\\sqrt{2x}$，所以要先把每个根式化简。这节课先合并同类项，再先化简后合并，最后把不同类的根式分开保留。所有变量都是正数。`,
  ),
  knowledgePoints: [
    {
      id: "combining-like-radical-terms",
      title: t("Like radical terms", "同类根式项"),
      explanation: t(
        `Terms with the same root and the same factors outside it, apart from the number in front, are like terms. The shared part is a common factor, so by the distributive law the coefficients are added or subtracted and the shared part is kept:

$$7x\\sqrt{3x} - 2x\\sqrt{3x} = (7 - 2)x\\sqrt{3x} = 5x\\sqrt{3x}.$$

> **Watch out.** The radicands are not added: $\\sqrt{2x} + \\sqrt{2x} = 2\\sqrt{2x}$, not $\\sqrt{4x}$. The coefficients are not multiplied, and the outside factor $x$ is not squared: it stays $x$. Keep the sign of the operation: $7 - 2$, not $7 + 2$.`,
        `根式相同、根号外除数字系数外的因式也相同的项是同类项。相同的部分是公因式，所以由分配律，把系数相加减，相同的部分保持不变：

$$7x\\sqrt{3x} - 2x\\sqrt{3x} = (7 - 2)x\\sqrt{3x} = 5x\\sqrt{3x}.$$

> **注意。** 被开方式不相加：$\\sqrt{2x} + \\sqrt{2x} = 2\\sqrt{2x}$，不是 $\\sqrt{4x}$。系数不相乘，根号外的 $x$ 也不平方，仍是 $x$。还要保留运算的符号：是 $7 - 2$，不是 $7 + 2$。`,
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
        const shared = term(1);
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
            `**Step 1: find the shared part.** Both terms are a number times $${shared}$, so they are like terms.

**Step 2: combine the coefficients.** Factor out $${shared}$ and work out $${a} ${op(s)} ${b} = ${c}$:${steps(`${expr} = (${a} ${op(s)} ${b})${shared} = ${term(c)}`)}**Check.** Undoing the ${s > 0 ? "addition" : "subtraction"} must give back the first term: $${term(c)} ${s > 0 ? "-" : "+"} ${term(b)} = ${term(a)}$.`,
            `**第一步：找出相同的部分。** 两项都是一个数乘以 $${shared}$，所以是同类项。

**第二步：合并系数。** 提出 $${shared}$，算出 $${a} ${op(s)} ${b} = ${c}$：${steps(`${expr} = (${a} ${op(s)} ${b})${shared} = ${term(c)}`)}**检验。** 把${s > 0 ? "加上" : "减去"}的那一项${s > 0 ? "减" : "加"}回来，应当得回第一项：$${term(c)} ${s > 0 ? "-" : "+"} ${term(b)} = ${term(a)}$。`,
          ),
        });
      },
    },
    {
      id: "simplifying-before-combining-with-variables",
      title: t("Simplifying before combining", "先化简再合并"),
      explanation: t(
        `Only like radicals, with the same index and the same radicand, can be combined. Terms that look different may be alike once each root is simplified, so simplify every root first: take out the largest perfect square from the number and the even part of each power.

$$\\sqrt{12x^{3}} + x\\sqrt{27x} = 2x\\sqrt{3x} + x \\cdot 3\\sqrt{3x} = 2x\\sqrt{3x} + 3x\\sqrt{3x} = 5x\\sqrt{3x}.$$

> **Watch out.** Multiply what comes out of a root by the factor already in front: $x \\cdot 3\\sqrt{3x} = 3x\\sqrt{3x}$, so dropping the $x$ or the $3$ gives the wrong coefficient. Do not add the radicands, since $\\sqrt{12x^{3}} + \\sqrt{27x^{3}}$ is not $\\sqrt{39x^{3}}$. And combine the terms once they are alike, rather than leaving two like terms side by side.`,
        `只有根指数相同、被开方式也相同的同类根式才能合并。看起来不同的项，化简每个根式后可能是同类项，所以先把每个根式化简：从数字中移出最大的完全平方数，从每个幂中移出偶次部分。

$$\\sqrt{12x^{3}} + x\\sqrt{27x} = 2x\\sqrt{3x} + x \\cdot 3\\sqrt{3x} = 2x\\sqrt{3x} + 3x\\sqrt{3x} = 5x\\sqrt{3x}.$$

> **注意。** 从根号里移出的因式要乘以根号前原有的因式：$x \\cdot 3\\sqrt{3x} = 3x\\sqrt{3x}$，漏掉 $x$ 或 $3$ 系数就错了。被开方式不能相加，$\\sqrt{12x^{3}} + \\sqrt{27x^{3}}$ 不等于 $\\sqrt{39x^{3}}$。化成同类项之后还要合并，不要把两个同类项并排留着。`,
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
        const shared = term(1);
        const inner = written(extract(k * k * p, 2 * (u - w) + 1));
        const lines: string[] = [];
        if (!(j === 1 && u === 0)) lines.push(`${first} = ${splitWork(j * j * p, 2 * u + 1)}`);
        if (!(k === 1 && u === w)) {
          lines.push(
            front(l, w) === ""
              ? `${second} = ${splitWork(k * k * p, 2 * (u - w) + 1)}`
              : `${second} = ${front(l, w)} \\cdot ${inner} = ${term(l * k)}`,
          );
        }
        const ones = `${sq(String(j * j * p))} ${op(s)} ${front(l)}${sq(String(k * k * p))}`;
        const onesDone = `${radTerm(j, 0, 0, p, 0, 0)} ${op(s)} ${radTerm(l * k, 0, 0, p, 0, 0)}`;
        const atOne = radTerm(c, 0, 0, p, 0, 0);
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
            `**Step 1: simplify each root.** Take out the perfect squares, and multiply what comes out by any factor already in front:${steps(...lines)}Both terms are now a number times $${shared}$.

**Step 2: combine.** Combine the coefficients, $${j} ${op(s)} ${l * k} = ${c}$:${steps(`${term(j)} ${op(s)} ${term(l * k)} = (${j} ${op(s)} ${l * k})${shared} = ${term(c)}`)}**Check.** At $x = 1$ the question and the answer must agree. The answer gives $${atOne}$, and so does the question: $${ones} = ${onesDone} = ${atOne}$.`,
            `**第一步：化简每个根式。** 移出完全平方，并把移出的因式乘以根号前原有的因式：${steps(...lines)}现在两项都是一个数乘以 $${shared}$。

**第二步：合并。** 系数相加减，$${j} ${op(s)} ${l * k} = ${c}$：${steps(`${term(j)} ${op(s)} ${term(l * k)} = (${j} ${op(s)} ${l * k})${shared} = ${term(c)}`)}**检验。** 当 $x = 1$ 时，题目和答案的值应当相同。答案的值是 $${atOne}$，题目的值也是：$${ones} = ${onesDone} = ${atOne}$。`,
          ),
        });
      },
    },
    {
      id: "unlike-radicals-remain",
      title: t("Unlike radicals remain", "不同类的根式保留"),
      explanation: t(
        `Radicals with different radicands behave like different variables: $2a + 3b$ cannot be written as one term, and neither can $2\\sqrt{2x} + 3\\sqrt{3x}$. So after simplifying, combine only the like terms and leave the others as they are:

$$\\sqrt{8x} + \\sqrt{27x} + 3\\sqrt{2x} = 2\\sqrt{2x} + 3\\sqrt{3x} + 3\\sqrt{2x} = 5\\sqrt{2x} + 3\\sqrt{3x}.$$

> **Watch out.** Do not add the coefficients of unlike roots: $5\\sqrt{2x} + 3\\sqrt{3x}$ is not $8\\sqrt{2x}$. Take the root of the perfect square, so that $\\sqrt{27x}$ becomes $3\\sqrt{3x}$, not $9\\sqrt{3x}$. And use the root of the coefficient, not the coefficient itself: $\\sqrt{8x}$ gives $2$, not $4$.`,
        `被开方式不同的根式就像不同的字母：$2a + 3b$ 不能写成一项，$2\\sqrt{2x} + 3\\sqrt{3x}$ 也不能。所以化简之后只合并同类项，其余的项保持原样：

$$\\sqrt{8x} + \\sqrt{27x} + 3\\sqrt{2x} = 2\\sqrt{2x} + 3\\sqrt{3x} + 3\\sqrt{2x} = 5\\sqrt{2x} + 3\\sqrt{3x}.$$

> **注意。** 不同类根式的系数不能相加：$5\\sqrt{2x} + 3\\sqrt{3x}$ 不等于 $8\\sqrt{2x}$。完全平方要开方，$\\sqrt{27x}$ 化成 $3\\sqrt{3x}$，不是 $9\\sqrt{3x}$。移出的是平方因数的平方根：$\\sqrt{8x}$ 移出 $2$，不是 $4$。`,
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
        const simplified = `${termP(j)} ${op(s1)} ${termQ(k)} ${op(s2)} ${termP(l)}`;
        const roots = [
          ...(j > 1 ? [`$${sq(mono(j * j * p, 1))} = ${sq(String(j * j))} \\cdot ${sq(mono(p, 1))} = ${termP(j)}$`] : []),
          ...(k > 1 ? [`$${sq(mono(k * k * q, 1))} = ${sq(String(k * k))} \\cdot ${sq(mono(q, 1))} = ${termQ(k)}$`] : []),
        ];
        const step1 =
          roots.length === 0
            ? t(
                `**Step 1: simplify each root.** Each root is already simplified, since $${p}$ and $${q}$ have no perfect-square factor.\n\n`,
                `**第一步：化简每个根式。** 每个根式都已是最简形式，因为 $${p}$ 和 $${q}$ 都没有完全平方因数。\n\n`,
              )
            : t(
                `**Step 1: simplify each root.** ${roots.join(" and ")}.${steps(`${expr} = ${simplified}`)}`,
                `**第一步：化简每个根式。** ${roots.join("，")}。${steps(`${expr} = ${simplified}`)}`,
              );
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
            `${step1.en}**Step 2: combine the like terms.** The two terms with $${sq(mono(p, 1))}$ combine, $${j} ${op(s2)} ${l} = ${j + s2 * l}$. The term with $${sq(mono(q, 1))}$ has a different radicand, so it stays as it is:${steps(`${simplified} = ${answer}`)}**Check.** Taking the combined term apart must give back the two $${sq(mono(p, 1))}$ terms: $${termP(j + s2 * l)} ${s2 > 0 ? "-" : "+"} ${termP(l)} = ${termP(j)}$, and the $${sq(mono(q, 1))}$ term is unchanged.`,
            `${step1["zh-CN"]}**第二步：合并同类项。** 含 $${sq(mono(p, 1))}$ 的两项合并，$${j} ${op(s2)} ${l} = ${j + s2 * l}$。含 $${sq(mono(q, 1))}$ 的项被开方式不同，保持原样：${steps(`${simplified} = ${answer}`)}**检验。** 把合并后的项拆开，应当得回两个含 $${sq(mono(p, 1))}$ 的项：$${termP(j + s2 * l)} ${s2 > 0 ? "-" : "+"} ${termP(l)} = ${termP(j)}$，而含 $${sq(mono(q, 1))}$ 的项没有变。`,
          ),
        });
      },
    },
  ],
};

/** lead writes a coefficient in front of a root: "" for 1, "-" for -1. */
const lead = (c: number) => (c === 1 ? "" : c === -1 ? "-" : String(c));

/** backCheck multiplies a rationalized fraction by the old denominator to get the numerator back. */
const backCheck = (work: string) =>
  t(
    `**Check.** The answer times the old denominator must give back the numerator: $${work}$.`,
    `**检验。** 答案乘以原来的分母，应当得回分子：$${work}$。`,
  );

export const rationalizingAlgebraicDenominators: TopicDef = {
  id: "rationalizing-algebraic-denominators",
  title: t("Rationalizing Denominators of Algebraic Expressions", "代数式的分母有理化"),
  summary: t(
    "Remove a square root with variables from a denominator: $\\frac{6}{\\sqrt{3x}} = \\frac{2\\sqrt{3x}}{x}$.",
    "去掉分母中含变量的平方根：$\\frac{6}{\\sqrt{3x}} = \\frac{2\\sqrt{3x}}{x}$。",
  ),
  prerequisites: ["quotient-rule-for-square-roots", "rationalizing-denominators"],
  encompasses: [{ topic: "rationalizing-denominators", weight: 0.6 }],
  xp: 14,
  standards: ["CCSS.HSN.RN.A.2"],
  intro: t(
    `A simplified radical expression has no root in its denominator. With numbers we removed one by multiplying the top and the bottom by the root, as in $\\frac{1}{\\sqrt{2}} = \\frac{\\sqrt{2}}{2}$; this multiplies by $1$, so the value does not change, and $\\sqrt{2} \\cdot \\sqrt{2} = 2$ has no root. The same works when the root contains variables, because $\\sqrt{u} \\cdot \\sqrt{u} = u$ for every $u > 0$:

$$\\frac{6}{\\sqrt{3x}} = \\frac{6 \\cdot \\sqrt{3x}}{\\sqrt{3x} \\cdot \\sqrt{3x}} = \\frac{6\\sqrt{3x}}{3x} = \\frac{2\\sqrt{3x}}{x}.$$

In this lesson we rationalize a single root in the denominator, roots of fractions, and denominators with higher powers, which are simplified first. All variables are positive.`,
    `化简后的根式，分母中不含根式。对数字，我们把分子和分母同乘以这个根式来去掉它，例如 $\\frac{1}{\\sqrt{2}} = \\frac{\\sqrt{2}}{2}$；这相当于乘以 $1$，值不变，而 $\\sqrt{2} \\cdot \\sqrt{2} = 2$ 不含根式。根号里含变量时也一样，因为对每个 $u > 0$ 都有 $\\sqrt{u} \\cdot \\sqrt{u} = u$：

$$\\frac{6}{\\sqrt{3x}} = \\frac{6 \\cdot \\sqrt{3x}}{\\sqrt{3x} \\cdot \\sqrt{3x}} = \\frac{6\\sqrt{3x}}{3x} = \\frac{2\\sqrt{3x}}{x}.$$

这节课先把分母中的单个根式有理化，再处理分式的平方根，最后处理分母中含高次幂、需要先化简的情形。所有变量都是正数。`,
  ),
  knowledgePoints: [
    {
      id: "monomial-radical-denominators",
      title: t("A root in the denominator", "分母中的根式"),
      explanation: t(
        `Multiply the numerator and the denominator by the root in the denominator. Multiplying by $\\frac{\\sqrt{3x}}{\\sqrt{3x}} = 1$ keeps the value, and $\\sqrt{3x} \\cdot \\sqrt{3x} = 3x$ has no root. Then reduce the coefficients:

$$\\frac{6}{\\sqrt{3x}} = \\frac{6\\sqrt{3x}}{\\sqrt{3x} \\cdot \\sqrt{3x}} = \\frac{6\\sqrt{3x}}{3x} = \\frac{2\\sqrt{3x}}{x}.$$

> **Watch out.** Multiply the numerator too, or the value changes: $\\frac{6}{3x}$ is not the same number. The denominator becomes $3x$, not $(3x)^{2}$ or $9x^{2}$, since the root times itself gives the radicand. Keep the $x$ in the denominator, and keep the root in the numerator.`,
        `把分子和分母同乘以分母中的根式。乘以 $\\frac{\\sqrt{3x}}{\\sqrt{3x}} = 1$ 不改变值，而 $\\sqrt{3x} \\cdot \\sqrt{3x} = 3x$ 不含根式。然后约去系数：

$$\\frac{6}{\\sqrt{3x}} = \\frac{6\\sqrt{3x}}{\\sqrt{3x} \\cdot \\sqrt{3x}} = \\frac{6\\sqrt{3x}}{3x} = \\frac{2\\sqrt{3x}}{x}.$$

> **注意。** 分子也要乘，否则值就变了：$\\frac{6}{3x}$ 不是原来的数。分母变成 $3x$，不是 $(3x)^{2}$ 或 $9x^{2}$，因为根式乘以自身得到被开方式。分母中的 $x$ 要保留，分子中的根式也要保留。`,
      ),
      keyPrerequisites: ["rationalizing-denominators"],
      generate(rng) {
        const p = rng.pick([1, 2, 3, 5, 6, 7, 10]);
        const a = rng.bool(0.5) && p > 1 ? p * rng.int(1, 4) : rng.int(1, 12);
        const root = sq(mono(p, 1));
        const answer = quotient(a, root, p, "x");
        const raw = `\\frac{${lead(a)}${root}}{${mono(p, 1)}}`;
        const reduced = answer !== raw;
        const g = gcd(a, p);
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
            `**Step 1: multiply by the root.** Multiply the numerator and the denominator by $${root}$. In the denominator, $${root} \\cdot ${root} = ${mono(p, 1)}$:${steps(`\\frac{${a}}{${root}} = \\frac{${lead(a)}${root}}{${root} \\cdot ${root}} = ${raw}`)}**Step 2: reduce.** ${reduced ? `The coefficients $${a}$ and $${p}$ share the factor $${g}$:${steps(`${raw} = ${answer}`)}` : `The coefficients $${a}$ and $${p}$ have no common factor, so $${answer}$ is already simplified.\n\n`}${backCheck(`${raw} \\cdot ${root} = \\frac{${a} \\cdot ${mono(p, 1)}}{${mono(p, 1)}} = ${a}`).en}`,
            `**第一步：同乘以根式。** 分子和分母同乘以 $${root}$。分母中，$${root} \\cdot ${root} = ${mono(p, 1)}$：${steps(`\\frac{${a}}{${root}} = \\frac{${lead(a)}${root}}{${root} \\cdot ${root}} = ${raw}`)}**第二步：约分。** ${reduced ? `系数 $${a}$ 和 $${p}$ 有公因数 $${g}$：${steps(`${raw} = ${answer}`)}` : `系数 $${a}$ 和 $${p}$ 没有公因数，所以 $${answer}$ 已是最简形式。\n\n`}${backCheck(`${raw} \\cdot ${root} = \\frac{${a} \\cdot ${mono(p, 1)}}{${mono(p, 1)}} = ${a}`)["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "roots-of-quotients",
      title: t("Roots of fractions", "分式的平方根"),
      explanation: t(
        `When the denominator under a root is not a perfect square, splitting the root with the quotient rule leaves a root below the bar. Rationalize it as before, then join the two roots on top with the product rule:

$$\\sqrt{\\frac{3x}{5y}} = \\frac{\\sqrt{3x}}{\\sqrt{5y}} = \\frac{\\sqrt{3x} \\cdot \\sqrt{5y}}{\\sqrt{5y} \\cdot \\sqrt{5y}} = \\frac{\\sqrt{15xy}}{5y}.$$

> **Watch out.** Splitting alone does not finish the job: $\\frac{\\sqrt{3x}}{\\sqrt{5y}}$ still has a root below. Multiply the numerator's root by the same root, so that $\\sqrt{3x}$ becomes $\\sqrt{15xy}$, not $\\sqrt{3x}$. The denominator is $5y$, not $25y^{2}$.`,
        `当根号下的分母不是完全平方时，用除法法则拆开后，分母中还留着根式。照前面的方法把它有理化，再用乘法法则把分子上的两个根式合起来：

$$\\sqrt{\\frac{3x}{5y}} = \\frac{\\sqrt{3x}}{\\sqrt{5y}} = \\frac{\\sqrt{3x} \\cdot \\sqrt{5y}}{\\sqrt{5y} \\cdot \\sqrt{5y}} = \\frac{\\sqrt{15xy}}{5y}.$$

> **注意。** 只拆开还没有完成：$\\frac{\\sqrt{3x}}{\\sqrt{5y}}$ 的分母中仍有根式。分子的根式也要乘以同一个根式，$\\sqrt{3x}$ 变成 $\\sqrt{15xy}$，而不是保持 $\\sqrt{3x}$。分母是 $5y$，不是 $25y^{2}$。`,
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
        const C = c === 1 ? "" : String(c);
        const topRoot = withX || a > 1 ? `${C}${sq(withX ? mono(a, 1) : String(a))}` : String(c);
        const split = `\\frac{${topRoot}}{${sq(den)}}`;
        const raw = `\\frac{${C}${sq(num_)}}{${den}}`;
        const timesRoot = withX || a > 1 ? `${topRoot} \\cdot ${sq(den)}` : `${C}${sq(den)}`;
        const middle = withX || a > 1 ? `\\frac{${timesRoot}}{${den}} = ` : "";
        const squaredTop = withX ? mono(c * c * a * b, 1, 1) : mono(c * c * a * b, 1);
        const squaredBottom = withX ? mono(b * b, 0, 2) : mono(b * b, 2);
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
            `**Step 1: split the root.** By the quotient rule:${steps(`${expr} = ${split}`)}**Step 2: rationalize.** Multiply the numerator and the denominator by $${sq(den)}$. Below, $${sq(den)} \\cdot ${sq(den)} = ${den}$; on top, the product rule joins the roots:${steps(`${split} = ${middle}${raw}${answer === raw ? "" : ` = ${answer}`}`)}**Check.** Squaring the answer must give $${c === 1 ? "" : `${c * c}$ times $`}${inside}$, the square of the question: $\\left(${answer}\\right)^{2} = \\frac{${squaredTop}}{${squaredBottom}} = ${c === 1 ? "" : `${c * c} \\cdot `}${inside}$.`,
            `**第一步：拆开根式。** 由除法法则：${steps(`${expr} = ${split}`)}**第二步：有理化。** 分子和分母同乘以 $${sq(den)}$。分母中，$${sq(den)} \\cdot ${sq(den)} = ${den}$；分子上，用乘法法则把根式合起来：${steps(`${split} = ${middle}${raw}${answer === raw ? "" : ` = ${answer}`}`)}**检验。** 答案的平方应当等于题目的平方 ${c === 1 ? "" : `$${c * c}$ 乘以 `}$${inside}$：$\\left(${answer}\\right)^{2} = \\frac{${squaredTop}}{${squaredBottom}} = ${c === 1 ? "" : `${c * c} \\cdot `}${inside}$。`,
          ),
        });
      },
    },
    {
      id: "higher-powers-in-the-denominator",
      title: t("Higher powers in the denominator", "分母中的高次幂"),
      explanation: t(
        `When the root in the denominator holds a higher power, simplify it first. Then only a small root is left to remove, and the result needs less reducing:

$$\\frac{4}{\\sqrt{2x^{3}}} = \\frac{4}{x\\sqrt{2x}} = \\frac{4\\sqrt{2x}}{x \\cdot 2x} = \\frac{4\\sqrt{2x}}{2x^{2}} = \\frac{2\\sqrt{2x}}{x^{2}}.$$

Here $x^{3} = x^{2} \\cdot x$, so $\\sqrt{2x^{3}} = x\\sqrt{2x}$, and multiplying by $\\sqrt{2x}$ turns the denominator into $x \\cdot 2x = 2x^{2}$.

> **Watch out.** The $x$ that came out of the root stays in the denominator and multiplies the new $2x$: the power below is $x^{2}$, not $x$. It is not $x^{3}$ or $x^{4}$ either, since only the remaining root, not the whole radicand, is used to rationalize.`,
        `分母的根式中含高次幂时，先把它化简。这样只剩一个小根式要去掉，结果也更容易约分：

$$\\frac{4}{\\sqrt{2x^{3}}} = \\frac{4}{x\\sqrt{2x}} = \\frac{4\\sqrt{2x}}{x \\cdot 2x} = \\frac{4\\sqrt{2x}}{2x^{2}} = \\frac{2\\sqrt{2x}}{x^{2}}.$$

这里 $x^{3} = x^{2} \\cdot x$，所以 $\\sqrt{2x^{3}} = x\\sqrt{2x}$；再乘以 $\\sqrt{2x}$，分母变成 $x \\cdot 2x = 2x^{2}$。

> **注意。** 从根号中移出的 $x$ 仍在分母中，要和新得到的 $2x$ 相乘：分母的幂是 $x^{2}$，不是 $x$。也不是 $x^{3}$ 或 $x^{4}$，因为有理化时只乘剩下的根式，不乘整个被开方式。`,
      ),
      generate(rng) {
        const p = rng.pick([1, 2, 3, 5, 6, 7]);
        const h = rng.int(1, 2);
        const a = rng.int(1, 12);
        const root = sq(mono(p, 1));
        const den = sq(mono(p, 2 * h + 1));
        const answer = quotient(a, root, p, pw("x", h + 1));
        const outside = radTerm(1, h, 0, p, 1, 0);
        const raw = `\\frac{${lead(a)}${root}}{${mono(p, h + 1)}}`;
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
            `**Step 1: simplify the root below.** $${pw("x", 2 * h + 1)} = ${pw("x", 2 * h)} \\cdot x$, so $${den} = ${outside}$.

**Step 2: rationalize.** Multiply the numerator and the denominator by $${root}$, which turns the denominator into $${pw("x", h)} \\cdot ${mono(p, 1)} = ${mono(p, h + 1)}$:${steps(`\\frac{${a}}{${den}} = \\frac{${a}}{${outside}} = \\frac{${lead(a)}${root}}{${pw("x", h)} \\cdot ${mono(p, 1)}} = ${raw}${answer === raw ? "" : ` = ${answer}`}`)}${backCheck(`${raw} \\cdot ${outside} = \\frac{${a} \\cdot ${mono(p, h + 1)}}{${mono(p, h + 1)}} = ${a}`).en}`,
            `**第一步：化简分母中的根式。** $${pw("x", 2 * h + 1)} = ${pw("x", 2 * h)} \\cdot x$，所以 $${den} = ${outside}$。

**第二步：有理化。** 分子和分母同乘以 $${root}$，分母变成 $${pw("x", h)} \\cdot ${mono(p, 1)} = ${mono(p, h + 1)}$：${steps(`\\frac{${a}}{${den}} = \\frac{${a}}{${outside}} = \\frac{${lead(a)}${root}}{${pw("x", h)} \\cdot ${mono(p, 1)}} = ${raw}${answer === raw ? "" : ` = ${answer}`}`)}${backCheck(`${raw} \\cdot ${outside} = \\frac{${a} \\cdot ${mono(p, h + 1)}}{${mono(p, h + 1)}} = ${a}`)["zh-CN"]}`,
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

/** conjugateSolution walks c/(den) times the conjugate to tt·(conj), with den·conj = sq1 - sq2 = d. */
function conjugateSolution(
  fraction: string,
  c: number,
  den: string,
  conj: string,
  sqs: readonly [string, string],
  vals: readonly [number, number],
  tt: number,
  answer: string,
): Text {
  const d = vals[0] - vals[1];
  const product = steps(`(${den})(${conj}) = ${sqs[0]} - ${sqs[1]} = ${vals[0]} - ${vals[1]} = ${d}`);
  const divide = steps(`${fraction} = \\frac{${c}(${conj})}{${d}} = ${tt === 1 ? "" : `${lead(tt)}(${conj}) = `}${answer}`);
  const back =
    tt === 1
      ? `(${answer})(${den}) = ${d}`
      : `(${answer})(${den}) = ${lead(tt)}(${conj})(${den}) = ${tt === -1 ? `-(${d})` : `${tt}(${d})`} = ${c}`;
  return t(
    `**Step 1: choose the conjugate.** The conjugate of $${den}$ is $${conj}$, with the opposite sign between the same terms. Multiply the numerator and the denominator by it.

**Step 2: the denominator.** By the difference of squares, the roots disappear:${product}**Step 3: divide.** $${c} \\div ${paren(d)} = ${tt}$, so ${tt === 1 ? "the answer is the conjugate itself" : `every term of the conjugate is multiplied by $${tt}$`}:${divide}**Check.** The answer times the old denominator must give back the numerator: $${back}$.`,
    `**第一步：找出共轭式。** $${den}$ 的共轭式是 $${conj}$，两项相同，中间的符号相反。把分子和分母同乘以它。

**第二步：分母。** 由平方差公式，根式消失了：${product}**第三步：相除。** $${c} \\div ${paren(d)} = ${tt}$，所以${tt === 1 ? "答案就是共轭式本身" : `共轭式的每一项都乘以 $${tt}$`}：${divide}**检验。** 答案乘以原来的分母，应当得回分子：$${back}$。`,
  );
}

export const rationalizingTwoTermDenominators: TopicDef = {
  id: "rationalizing-two-term-denominators",
  title: t("Rationalizing Denominators With Two Terms", "两项分母的有理化"),
  summary: t(
    "Multiply by the conjugate to rationalize denominators such as $3 - \\sqrt{5}$ or $\\sqrt{7} + \\sqrt{3}$.",
    "乘以共轭式，把 $3 - \\sqrt{5}$、$\\sqrt{7} + \\sqrt{3}$ 这样的分母有理化。",
  ),
  prerequisites: ["rationalizing-denominators", "difference-of-squares-formula"],
  encompasses: [{ topic: "difference-of-squares-formula", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSN.RN.A.2"],
  intro: t(
    `A single root in a denominator is removed by multiplying by the same root. That fails for two terms: $(3 - \\sqrt{5})(3 - \\sqrt{5}) = 14 - 6\\sqrt{5}$ still has a root. The difference of squares, $(a + b)(a - b) = a^{2} - b^{2}$, gives a better factor. Changing the sign between the two terms and multiplying squares each term, so the roots go away:

$$(3 - \\sqrt{5})(3 + \\sqrt{5}) = 3^{2} - (\\sqrt{5})^{2} = 9 - 5 = 4.$$

So $\\frac{8}{3 - \\sqrt{5}} = \\frac{8(3 + \\sqrt{5})}{4} = 6 + 2\\sqrt{5}$. In this lesson we multiply such pairs, called conjugates, and use them to rationalize denominators of the forms $a + \\sqrt{b}$ and $\\sqrt{a} + \\sqrt{b}$.`,
    `分母中只有一个根式时，乘以同一个根式就能去掉它。分母是两项时这样做不行：$(3 - \\sqrt{5})(3 - \\sqrt{5}) = 14 - 6\\sqrt{5}$ 仍含根式。平方差公式 $(a + b)(a - b) = a^{2} - b^{2}$ 给出了更好的乘数。把两项之间的符号改变后相乘，每一项都被平方，根式就消失了：

$$(3 - \\sqrt{5})(3 + \\sqrt{5}) = 3^{2} - (\\sqrt{5})^{2} = 9 - 5 = 4.$$

所以 $\\frac{8}{3 - \\sqrt{5}} = \\frac{8(3 + \\sqrt{5})}{4} = 6 + 2\\sqrt{5}$。这节课先计算这样成对的式子，即共轭式的乘积，再用它们把形如 $a + \\sqrt{b}$ 和 $\\sqrt{a} + \\sqrt{b}$ 的分母有理化。`,
  ),
  knowledgePoints: [
    {
      id: "conjugate-products",
      title: t("Conjugates", "共轭式"),
      explanation: t(
        `$a + \\sqrt{b}$ and $a - \\sqrt{b}$ are **conjugates**: the same two terms with the opposite sign between them. Their product is a difference of squares, $(a + \\sqrt{b})(a - \\sqrt{b}) = a^{2} - b$, because the two middle products, $-a\\sqrt{b}$ and $+a\\sqrt{b}$, cancel:

$$(3 + \\sqrt{5})(3 - \\sqrt{5}) = 3^{2} - (\\sqrt{5})^{2} = 9 - 5 = 4.$$

Likewise $(\\sqrt{7} + \\sqrt{3})(\\sqrt{7} - \\sqrt{3}) = 7 - 3 = 4$, and $(2\\sqrt{3})^{2} = 4 \\cdot 3 = 12$ when a term has a coefficient.

> **Watch out.** The result is a difference, not a sum: $9 - 5$, not $9 + 5$. Square a root to get its radicand, $(\\sqrt{5})^{2} = 5$, not $25$. Square the whole term $2\\sqrt{3}$, coefficient included: $12$, not $6$. And do not double instead of squaring.`,
        `$a + \\sqrt{b}$ 和 $a - \\sqrt{b}$ 互为**共轭式**：两项相同，中间的符号相反。它们的乘积是平方差，$(a + \\sqrt{b})(a - \\sqrt{b}) = a^{2} - b$，因为中间的两个乘积 $-a\\sqrt{b}$ 和 $+a\\sqrt{b}$ 互相抵消：

$$(3 + \\sqrt{5})(3 - \\sqrt{5}) = 3^{2} - (\\sqrt{5})^{2} = 9 - 5 = 4.$$

同样，$(\\sqrt{7} + \\sqrt{3})(\\sqrt{7} - \\sqrt{3}) = 7 - 3 = 4$；某一项带系数时，$(2\\sqrt{3})^{2} = 4 \\cdot 3 = 12$。

> **注意。** 结果是差，不是和：是 $9 - 5$，不是 $9 + 5$。根式的平方是被开方数，$(\\sqrt{5})^{2} = 5$，不是 $25$。$2\\sqrt{3}$ 要整项平方，连系数一起：得 $12$，不是 $6$。也不要把平方算成乘以 $2$。`,
      ),
      keyPrerequisites: ["difference-of-squares-formula"],
      generate(rng) {
        const kind = rng.pick(["number", "roots", "coefficient"] as const);
        let first: string;
        let second: string;
        let u: number;
        let v: number;
        let wrong: number[];
        let squares: Text;
        if (kind === "number") {
          const a = rng.int(1, 9);
          const m = rng.pick(squareFree);
          [first, second, u, v] = [`${a}`, sq(String(m)), a * a, m];
          wrong = [a * a + m, a * a - m * m, 2 * a - m];
          squares = t(
            `$${a}^{2} = ${a * a}$, and squaring a root gives its radicand: $(${second})^{2} = ${m}$.`,
            `$${a}^{2} = ${a * a}$，根式的平方是被开方数：$(${second})^{2} = ${m}$。`,
          );
        } else if (kind === "roots") {
          const [p, q] = rng.sample(squareFree, 2) as [number, number];
          [first, second, u, v] = [sq(String(p)), sq(String(q)), p, q];
          wrong = [p + q, p * p - q * q];
          squares = t(
            `Squaring a root gives its radicand: $(${first})^{2} = ${p}$ and $(${second})^{2} = ${q}$.`,
            `根式的平方是被开方数：$(${first})^{2} = ${p}$，$(${second})^{2} = ${q}$。`,
          );
        } else {
          const c = rng.int(2, 5);
          const m = rng.pick([2, 3, 5, 6, 7]);
          const a = rng.int(1, 9);
          [first, second, u, v] = [`${c}${sq(String(m))}`, `${a}`, c * c * m, a * a];
          wrong = [c * m - a * a, c * c * m + a * a, c * m * m - a * a];
          squares = t(
            `The whole first term is squared, coefficient included: $(${first})^{2} = ${c}^{2} \\cdot ${m} = ${c * c * m}$, and $${a}^{2} = ${a * a}$.`,
            `第一项要整项平方，连系数一起：$(${first})^{2} = ${c}^{2} \\cdot ${m} = ${c * c * m}$，而 $${a}^{2} = ${a * a}$。`,
          );
        }
        const expr = rng.bool() ? `(${first} + ${second})(${first} - ${second})` : `(${first} - ${second})(${first} + ${second})`;
        const middle = `${first} \\cdot ${second}`;
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
          answer: u - v,
          form: "integer",
          wrong,
          solution: t(
            `**Step 1: spot the pattern.** The two factors are conjugates, so $(a + b)(a - b) = a^{2} - b^{2}$ applies with $a = ${first}$ and $b = ${second}$.

**Step 2: square each term.** ${squares.en}${steps(`${expr} = (${first})^{2} - (${second})^{2} = ${u} - ${v} = ${u - v}`)}**Check.** Multiplying term by term gives $(${first})^{2} - ${middle} + ${middle} - (${second})^{2}$. The middle products cancel, which leaves $${u} - ${v} = ${u - v}$.`,
            `**第一步：看出模式。** 两个因式互为共轭式，所以可以用 $(a + b)(a - b) = a^{2} - b^{2}$，其中 $a = ${first}$，$b = ${second}$。

**第二步：每项平方。** ${squares["zh-CN"]}${steps(`${expr} = (${first})^{2} - (${second})^{2} = ${u} - ${v} = ${u - v}`)}**检验。** 逐项相乘得 $(${first})^{2} - ${middle} + ${middle} - (${second})^{2}$。中间的两个乘积抵消，剩下 $${u} - ${v} = ${u - v}$。`,
          ),
        });
      },
    },
    {
      id: "number-and-root-denominators",
      title: t("Denominators such as $a + \\sqrt{b}$", "形如 $a + \\sqrt{b}$ 的分母"),
      explanation: t(
        `Multiply the numerator and the denominator by the conjugate of the denominator. This multiplies by $1$, so the value stays, and the denominator becomes a whole number by the difference of squares. Then divide each term of the numerator by it:

$$\\frac{8}{3 - \\sqrt{5}} = \\frac{8(3 + \\sqrt{5})}{(3 - \\sqrt{5})(3 + \\sqrt{5})} = \\frac{8(3 + \\sqrt{5})}{4} = 2(3 + \\sqrt{5}) = 6 + 2\\sqrt{5}.$$

> **Watch out.** The conjugate has the opposite sign: for $3 - \\sqrt{5}$ use $3 + \\sqrt{5}$, not $3 - \\sqrt{5}$ again. Multiply the numerator too, and divide both of its terms by the denominator: $\\frac{8(3 + \\sqrt{5})}{4}$ is $6 + 2\\sqrt{5}$, not $24 + 8\\sqrt{5}$. When the denominator $a^{2} - b$ is negative, the signs of both terms flip.`,
        `把分子和分母同乘以分母的共轭式。这相当于乘以 $1$，值不变；而由平方差公式，分母变成整数。再用它去除分子的每一项：

$$\\frac{8}{3 - \\sqrt{5}} = \\frac{8(3 + \\sqrt{5})}{(3 - \\sqrt{5})(3 + \\sqrt{5})} = \\frac{8(3 + \\sqrt{5})}{4} = 2(3 + \\sqrt{5}) = 6 + 2\\sqrt{5}.$$

> **注意。** 共轭式的符号相反：$3 - \\sqrt{5}$ 要乘 $3 + \\sqrt{5}$，不是再乘 $3 - \\sqrt{5}$。分子也要乘，并且分子的两项都要除以分母：$\\frac{8(3 + \\sqrt{5})}{4}$ 是 $6 + 2\\sqrt{5}$，不是 $24 + 8\\sqrt{5}$。分母 $a^{2} - b$ 是负数时，两项的符号都要改变。`,
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
          solution: conjugateSolution(fraction, c, den, conj, [`${a}^{2}`, `(${sq(String(m))})^{2}`], [a * a, m], tt, answer),
        });
      },
    },
    {
      id: "two-root-denominators",
      title: t("Denominators such as $\\sqrt{a} + \\sqrt{b}$", "形如 $\\sqrt{a} + \\sqrt{b}$ 的分母"),
      explanation: t(
        `When both terms of the denominator are roots, the conjugate works the same way. The conjugate of $\\sqrt{a} + \\sqrt{b}$ is $\\sqrt{a} - \\sqrt{b}$, and their product is $(\\sqrt{a})^{2} - (\\sqrt{b})^{2} = a - b$, a whole number:

$$\\frac{6}{\\sqrt{5} + \\sqrt{2}} = \\frac{6(\\sqrt{5} - \\sqrt{2})}{5 - 2} = \\frac{6(\\sqrt{5} - \\sqrt{2})}{3} = 2\\sqrt{5} - 2\\sqrt{2}.$$

> **Watch out.** The denominator becomes $a - b$, a difference in the original order, even when the sign between the roots was minus. Keep the opposite sign in the conjugate, so that the answer is $2\\sqrt{5} - 2\\sqrt{2}$, not $2\\sqrt{5} + 2\\sqrt{2}$. Divide by $a - b$ after multiplying, or the coefficients stay too large.`,
        `分母的两项都是根式时，共轭式的用法相同。$\\sqrt{a} + \\sqrt{b}$ 的共轭式是 $\\sqrt{a} - \\sqrt{b}$，它们的乘积是 $(\\sqrt{a})^{2} - (\\sqrt{b})^{2} = a - b$，是一个整数：

$$\\frac{6}{\\sqrt{5} + \\sqrt{2}} = \\frac{6(\\sqrt{5} - \\sqrt{2})}{5 - 2} = \\frac{6(\\sqrt{5} - \\sqrt{2})}{3} = 2\\sqrt{5} - 2\\sqrt{2}.$$

> **注意。** 分母变成 $a - b$，按原来的顺序相减，即使两个根式之间是减号也一样。共轭式中的符号要相反，所以答案是 $2\\sqrt{5} - 2\\sqrt{2}$，不是 $2\\sqrt{5} + 2\\sqrt{2}$。乘完之后还要除以 $a - b$，否则系数会偏大。`,
      ),
      generate(rng) {
        let p: number;
        let q: number;
        do {
          [p, q] = rng.sample([2, 3, 5, 6, 7, 10, 11, 13], 2) as [number, number];
        } while (Math.abs(p - q) > 8 || simplifyRadical(p * q)[0] !== 1);
        const s = rng.sign();
        const tt = rng.int(1, 3) * rng.sign();
        const c = tt * (p - q);
        const den = `${sq(String(p))} ${op(s)} ${sq(String(q))}`;
        const conj = `${sq(String(p))} ${op(-s)} ${sq(String(q))}`;
        const answer = rootSum(tt, p, -s * tt, q);
        const fraction = `${c < 0 ? "-" : ""}\\frac{${Math.abs(c)}}{${den}}`;
        return expressionProblem({
          prompt: t(`Rationalize the denominator and simplify: $${fraction}$.`, `将分母有理化并化简：$${fraction}$。`),
          answer,
          radical: true,
          wrong: [rootSum(tt, p, s * tt, q), rootSum(c, p, -s * c, q), rootSum(-tt, p, s * tt, q), String(tt)],
          solution: conjugateSolution(fraction, c, den, conj, [`(${sq(String(p))})^{2}`, `(${sq(String(q))})^{2}`], [p, q], tt, answer),
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
  encompasses: [{ topic: "rationalizing-two-term-denominators", weight: 0.6 }],
  xp: 16,
  standards: ["CCSS.HSN.RN.A.2"],
  intro: t(
    `Conjugates removed roots from denominators like $3 - \\sqrt{5}$, because $(a - b)(a + b) = a^{2} - b^{2}$ squares each term. Nothing in that argument needs the terms to be numbers, so it also works when the roots contain variables. For $x > 0$:

$$(\\sqrt{x} - 3)(\\sqrt{x} + 3) = (\\sqrt{x})^{2} - 3^{2} = x - 9.$$

Cube roots need a different factor. Since $\\sqrt[3]{u} \\cdot \\sqrt[3]{u} = \\sqrt[3]{u^{2}}$ is usually not a cube, we multiply instead by whatever completes a perfect cube under the root: $\\sqrt[3]{2x} \\cdot \\sqrt[3]{4x^{2}} = \\sqrt[3]{8x^{3}} = 2x$. In this lesson we use conjugates with variables, conjugates of two roots with variables, and the cube-completing factor.`,
    `共轭式能去掉 $3 - \\sqrt{5}$ 这样的分母中的根式，因为 $(a - b)(a + b) = a^{2} - b^{2}$ 把每一项都平方了。这个道理并不要求这两项是数，所以根号里含变量时同样成立。当 $x > 0$ 时：

$$(\\sqrt{x} - 3)(\\sqrt{x} + 3) = (\\sqrt{x})^{2} - 3^{2} = x - 9.$$

立方根需要另一种乘数。由于 $\\sqrt[3]{u} \\cdot \\sqrt[3]{u} = \\sqrt[3]{u^{2}}$ 一般不是立方，我们改乘能把根号下补成完全立方的因式：$\\sqrt[3]{2x} \\cdot \\sqrt[3]{4x^{2}} = \\sqrt[3]{8x^{3}} = 2x$。这节课依次处理含变量的共轭式、两个含变量根式的共轭式，以及补成立方的乘数。`,
  ),
  knowledgePoints: [
    {
      id: "conjugates-with-variables",
      title: t("Conjugates with variables", "含变量的共轭式"),
      explanation: t(
        `For $x > 0$, $(\\sqrt{x})^{2} = x$, so the conjugate of $\\sqrt{x} - 3$ gives $(\\sqrt{x} - 3)(\\sqrt{x} + 3) = x - 9$. When the numerator is that same difference, it cancels with the new denominator:

$$\\frac{x - 9}{\\sqrt{x} - 3} = \\frac{(x - 9)(\\sqrt{x} + 3)}{(\\sqrt{x} - 3)(\\sqrt{x} + 3)} = \\frac{(x - 9)(\\sqrt{x} + 3)}{x - 9} = \\sqrt{x} + 3.$$

With a coefficient, $(2\\sqrt{x})^{2} = 4x$, so $\\frac{4x - 25}{2\\sqrt{x} + 5} = 2\\sqrt{x} - 5$.

> **Watch out.** The answer is the conjugate, with the opposite sign: $\\sqrt{x} + 3$, not $\\sqrt{x} - 3$. The root stays in the answer, so $x + 3$ is wrong. And the constant is $3$, not $3^{2} = 9$: only the denominator was squared.`,
        `当 $x > 0$ 时，$(\\sqrt{x})^{2} = x$，所以乘以 $\\sqrt{x} - 3$ 的共轭式得 $(\\sqrt{x} - 3)(\\sqrt{x} + 3) = x - 9$。当分子正好是这个差时，它就和新的分母约去：

$$\\frac{x - 9}{\\sqrt{x} - 3} = \\frac{(x - 9)(\\sqrt{x} + 3)}{(\\sqrt{x} - 3)(\\sqrt{x} + 3)} = \\frac{(x - 9)(\\sqrt{x} + 3)}{x - 9} = \\sqrt{x} + 3.$$

带系数时，$(2\\sqrt{x})^{2} = 4x$，所以 $\\frac{4x - 25}{2\\sqrt{x} + 5} = 2\\sqrt{x} - 5$。

> **注意。** 答案是共轭式，符号相反：是 $\\sqrt{x} + 3$，不是 $\\sqrt{x} - 3$。答案中仍保留根式，所以 $x + 3$ 是错的。常数是 $3$，不是 $3^{2} = 9$：只有分母被平方了。`,
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
            `**Step 1: choose the conjugate.** The conjugate of $${den}$ is $${conj}$. Multiply the numerator and the denominator by it.

**Step 2: the denominator.** By the difference of squares, $(${front(p)}\\sqrt{x})^{2} - ${a}^{2} = ${top}$, which is the numerator.

**Step 3: cancel.** The common factor $${top}$ cancels, since the denominator is not $0$:${steps(`\\frac{${top}}{${den}} = \\frac{(${top})(${conj})}{${top}} = ${answer}`)}**Check.** The answer times the old denominator must give back the numerator: $(${answer})(${den}) = (${front(p)}\\sqrt{x})^{2} - ${a}^{2} = ${top}$.`,
            `**第一步：找出共轭式。** $${den}$ 的共轭式是 $${conj}$。把分子和分母同乘以它。

**第二步：分母。** 由平方差公式，$(${front(p)}\\sqrt{x})^{2} - ${a}^{2} = ${top}$，正是分子。

**第三步：约分。** 因为分母不为 $0$，可以约去公因式 $${top}$：${steps(`\\frac{${top}}{${den}} = \\frac{(${top})(${conj})}{${top}} = ${answer}`)}**检验。** 答案乘以原来的分母，应当得回分子：$(${answer})(${den}) = (${front(p)}\\sqrt{x})^{2} - ${a}^{2} = ${top}$。`,
          ),
        });
      },
    },
    {
      id: "differences-of-roots-with-variables",
      title: t("Two roots with variables", "两个含变量的根式"),
      explanation: t(
        `The conjugate of $\\sqrt{x + 3} - \\sqrt{x}$ is $\\sqrt{x + 3} + \\sqrt{x}$. Their product squares each root, so it is the difference of the radicands, and the $x$ terms cancel:

$$(\\sqrt{x + 3} - \\sqrt{x})(\\sqrt{x + 3} + \\sqrt{x}) = (x + 3) - x = 3.$$

So the denominator becomes a number, and each term of the numerator is divided by it:

$$\\frac{6}{\\sqrt{x + 3} - \\sqrt{x}} = \\frac{6(\\sqrt{x + 3} + \\sqrt{x})}{3} = 2\\sqrt{x + 3} + 2\\sqrt{x}.$$

> **Watch out.** Keep the opposite sign of the conjugate in the answer. Divide by the new denominator, or the coefficients stay too large. And do not add the radicands: $\\sqrt{x + 3} + \\sqrt{x}$ is not $\\sqrt{2x + 3}$.`,
        `$\\sqrt{x + 3} - \\sqrt{x}$ 的共轭式是 $\\sqrt{x + 3} + \\sqrt{x}$。它们的乘积把每个根式都平方了，所以等于两个被开方式之差，其中的 $x$ 项抵消：

$$(\\sqrt{x + 3} - \\sqrt{x})(\\sqrt{x + 3} + \\sqrt{x}) = (x + 3) - x = 3.$$

于是分母变成一个数，再用它去除分子的每一项：

$$\\frac{6}{\\sqrt{x + 3} - \\sqrt{x}} = \\frac{6(\\sqrt{x + 3} + \\sqrt{x})}{3} = 2\\sqrt{x + 3} + 2\\sqrt{x}.$$

> **注意。** 答案中要保留共轭式的相反符号。要除以新的分母，否则系数会偏大。被开方式不能相加：$\\sqrt{x + 3} + \\sqrt{x}$ 不等于 $\\sqrt{2x + 3}$。`,
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
        const product = steps(`(${den})(${conj}) = (${u}) - (${v}) = ${a - b}`);
        const divide = steps(`\\frac{${c}}{${den}} = \\frac{${c}(${conj})}{${a - b}} = ${tt === 1 ? "" : `${tt}(${conj}) = `}${answer}`);
        const back = tt === 1 ? `(${answer})(${den}) = ${a - b}` : `(${answer})(${den}) = ${tt}(${conj})(${den}) = ${tt}(${a - b}) = ${c}`;
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
            `**Step 1: choose the conjugate.** The conjugate of $${den}$ is $${conj}$. Multiply the numerator and the denominator by it.

**Step 2: the denominator.** Squaring each root leaves the difference of the radicands, and the $x$ terms cancel:${product}**Step 3: divide.** $${c} \\div ${a - b} = ${tt}$, so ${tt === 1 ? "the answer is the conjugate itself" : `each term of the conjugate is multiplied by $${tt}$`}:${divide}**Check.** The answer times the old denominator must give back the numerator: $${back}$.`,
            `**第一步：找出共轭式。** $${den}$ 的共轭式是 $${conj}$。把分子和分母同乘以它。

**第二步：分母。** 每个根式平方后只剩被开方式之差，其中的 $x$ 项抵消：${product}**第三步：相除。** $${c} \\div ${a - b} = ${tt}$，所以${tt === 1 ? "答案就是共轭式本身" : `共轭式的每一项都乘以 $${tt}$`}：${divide}**检验。** 答案乘以原来的分母，应当得回分子：$${back}$。`,
          ),
        });
      },
    },
    {
      id: "cube-root-denominators",
      title: t("Cube roots in the denominator", "分母中的立方根"),
      explanation: t(
        `A cube root disappears when the expression under it is a perfect cube, since $\\sqrt[3]{u^{3}} = u$. Multiplying $\\sqrt[3]{2x}$ by itself gives $\\sqrt[3]{4x^{2}}$, which is still not a cube. Instead, ask what is missing: $2x$ needs two more factors of $2$ and two more of $x$ to become $8x^{3} = (2x)^{3}$. So multiply the numerator and the denominator by $\\sqrt[3]{4x^{2}}$:

$$\\frac{6}{\\sqrt[3]{2x}} = \\frac{6\\sqrt[3]{4x^{2}}}{\\sqrt[3]{8x^{3}}} = \\frac{6\\sqrt[3]{4x^{2}}}{2x} = \\frac{3\\sqrt[3]{4x^{2}}}{x}.$$

> **Watch out.** Multiplying by the same cube root does not finish the job, as it gives $\\sqrt[3]{4x^{2}}$ below. Supply the missing factor of the number as well, $4 = 2^{2}$, not only of $x$. And take the cube root of the new denominator: $\\sqrt[3]{8x^{3}} = 2x$, not $4x^{2}$.`,
        `当立方根号下是完全立方时，立方根就消失了，因为 $\\sqrt[3]{u^{3}} = u$。$\\sqrt[3]{2x}$ 乘以它自己得 $\\sqrt[3]{4x^{2}}$，仍不是立方。应当问缺什么：$2x$ 还需要两个因数 $2$ 和两个因式 $x$，才能成为 $8x^{3} = (2x)^{3}$。所以分子和分母同乘以 $\\sqrt[3]{4x^{2}}$：

$$\\frac{6}{\\sqrt[3]{2x}} = \\frac{6\\sqrt[3]{4x^{2}}}{\\sqrt[3]{8x^{3}}} = \\frac{6\\sqrt[3]{4x^{2}}}{2x} = \\frac{3\\sqrt[3]{4x^{2}}}{x}.$$

> **注意。** 乘以同一个立方根还不够，分母会变成 $\\sqrt[3]{4x^{2}}$。数字缺的因数也要补上，即 $4 = 2^{2}$，不能只补 $x$。新分母还要开立方：$\\sqrt[3]{8x^{3}} = 2x$，不是 $4x^{2}$。`,
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
        const factor = cb(mono(p * p, 3 - e));
        const raw = `\\frac{${lead(c)}${factor}}{${mono(p, 1)}}`;
        const answer = quotient(c, factor, p, "x");
        return choiceProblem({
          prompt: t(
            `Which expression equals $\\frac{${c}}{${den}}$ with a rationalized denominator? Assume $x \\ne 0$.`,
            `哪个式子等于 $\\frac{${c}}{${den}}$ 并且分母已有理化？假设 $x \\ne 0$。`,
          ),
          options: shuffled,
          correct: shuffled.indexOf(correct),
          solution: t(
            `**Step 1: find the missing factor.** To become the perfect cube $${mono(p ** 3, 3)} = (${mono(p, 1)})^{3}$, the radicand $${mono(p, e)}$ must be multiplied by $${mono(p * p, 3 - e)}$.

**Step 2: multiply.** Multiply the numerator and the denominator by $${factor}$:${steps(`\\frac{${c}}{${den}} = \\frac{${lead(c)}${factor}}{${cb(mono(p ** 3, 3))}} = ${raw}${answer === raw ? "" : ` = ${answer}`}`)}So the matching choice is $${answer}$.

**Check.** The answer times the old denominator must give back the numerator: $${raw} \\cdot ${den} = \\frac{${lead(c)}${cb(mono(p ** 3, 3))}}{${mono(p, 1)}} = \\frac{${c} \\cdot ${mono(p, 1)}}{${mono(p, 1)}} = ${c}$.`,
            `**第一步：找出缺少的因式。** 要成为完全立方 $${mono(p ** 3, 3)} = (${mono(p, 1)})^{3}$，被开方式 $${mono(p, e)}$ 还要乘以 $${mono(p * p, 3 - e)}$。

**第二步：相乘。** 分子和分母同乘以 $${factor}$：${steps(`\\frac{${c}}{${den}} = \\frac{${lead(c)}${factor}}{${cb(mono(p ** 3, 3))}} = ${raw}${answer === raw ? "" : ` = ${answer}`}`)}所以对应的选项是 $${answer}$。

**检验。** 答案乘以原来的分母，应当得回分子：$${raw} \\cdot ${den} = \\frac{${lead(c)}${cb(mono(p ** 3, 3))}}{${mono(p, 1)}} = \\frac{${c} \\cdot ${mono(p, 1)}}{${mono(p, 1)}} = ${c}$。`,
          ),
        });
      },
    },
  ],
};

/** rootCheck writes the Check of a candidate x: the substitution, then whether the two sides agree. */
function rootCheck(x: number | Q, valid: boolean, work: Text): Text {
  return valid
    ? t(
        `**Check.** Put $x = ${num(x)}$ into the original equation: ${work.en} Both sides agree, so the solution is $x = ${num(x)}$.`,
        `**检验。** 把 $x = ${num(x)}$ 代入原方程：${work["zh-CN"]}两边相等，所以方程的解是 $x = ${num(x)}$。`,
      )
    : t(
        `**Check.** Put $x = ${num(x)}$ into the original equation: ${work.en} The original equation is not true there, so $x = ${num(x)}$ is extraneous and the equation has no solution.`,
        `**检验。** 把 $x = ${num(x)}$ 代入原方程：${work["zh-CN"]}原方程在这里不成立，所以 $x = ${num(x)}$ 是增根，方程无解。`,
      );
}

/** solveLinear writes the lines that solve a·x = n (and a·x + b = n first, when b is not 0) down to x = x0. */
function solveLinear(a: number, b: number, n: number, x0: number): string[] {
  const lines = b === 0 ? [] : [`${linear(a, 0)} = ${n - b}`];
  if (a !== 1) lines.push(`x = ${x0}`);
  return lines;
}

/** radicalEquationIntro is the graph of y = √(x + 2) and y = x: one crossing, while y = −√(x + 2), dashed, carries the extraneous root. */
const radicalEquationIntro: Figure = graphFigure(
  { xMin: -3, xMax: 4, yMin: -3, yMax: 4 },
  [
    { kind: "curve", f: (x) => Math.sqrt(x + 2), from: -2, accent: true },
    { kind: "curve", f: (x) => -Math.sqrt(x + 2), from: -2, dashed: true },
    { kind: "line", a: [0, 0], b: [1, 1] },
    { kind: "point", at: [2, 2], label: "(2, 2)", dir: "se", tone: "result" },
    { kind: "point", at: [-1, -1], label: "(-1, -1)", dir: "w", open: true },
    { kind: "label", at: [3.9, 2.6], text: "y = √(x + 2)", dir: "w" },
    { kind: "label", at: [3.9, -2.3], text: "y = −√(x + 2)", dir: "w" },
  ],
  "The curve y = √(x + 2) starts at (−2, 0) and rises; it meets the line y = x only at (2, 2). Squaring both sides also brings in the dashed lower half y = −√(x + 2), which meets the line at (−1, −1), the extraneous root.",
  "曲线 y = √(x + 2) 从 (−2, 0) 开始上升，它与直线 y = x 只交于 (2, 2)。两边平方还会带进虚线所示的下半支 y = −√(x + 2)，它与直线交于 (−1, −1)，这就是增根。",
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
    { topic: "two-step-equations", weight: 0.3 },
    { topic: "squaring-binomials", weight: 0.2 },
  ],
  xp: 20,
  standards: ["CCSS.HSA.REI.A.2"],
  intro: t(
    `We solve an equation by undoing what was done to $x$. A square root is undone by squaring, since $(\\sqrt{u})^{2} = u$: from $\\sqrt{x + 2} = 3$, squaring gives $x + 2 = 9$, so $x = 7$. But squaring is not reversible. Both $3$ and $-3$ square to $9$, so the squared equation $u = v^{2}$ also holds when $\\sqrt{u} = -v$. Solving $\\sqrt{x + 2} = x$ shows what this does:

$$x + 2 = x^{2} \\;\\Rightarrow\\; x^{2} - x - 2 = 0 \\;\\Rightarrow\\; (x - 2)(x + 1) = 0.$$

Of the two candidates, $x = 2$ works, since $\\sqrt{4} = 2$; but $x = -1$ gives $\\sqrt{1} = 1$, not $-1$. It is an **extraneous** solution, created by the squaring.

{{figure 0}}

So every candidate must be put back into the original equation. In this lesson we square both sides, isolate the root first, handle roots on both sides, and reject extraneous solutions.`,
    `解方程就是把作用在 $x$ 上的运算逐一撤销。平方根用平方撤销，因为 $(\\sqrt{u})^{2} = u$：由 $\\sqrt{x + 2} = 3$，两边平方得 $x + 2 = 9$，所以 $x = 7$。但平方不可逆。$3$ 和 $-3$ 的平方都是 $9$，所以当 $\\sqrt{u} = -v$ 时，平方后的方程 $u = v^{2}$ 也成立。解 $\\sqrt{x + 2} = x$ 就能看出它的影响：

$$x + 2 = x^{2} \\;\\Rightarrow\\; x^{2} - x - 2 = 0 \\;\\Rightarrow\\; (x - 2)(x + 1) = 0.$$

两个候选值中，$x = 2$ 成立，因为 $\\sqrt{4} = 2$；但 $x = -1$ 给出 $\\sqrt{1} = 1$，而不是 $-1$。它是平方产生的**增根**。

{{figure 0}}

所以每个候选值都必须代回原方程检验。这节课先两边平方，再先分离根式，然后处理两边都有根式的方程，最后舍去增根。`,
  ),
  introFigures: [radicalEquationIntro],
  knowledgePoints: [
    {
      id: "squaring-both-sides",
      title: t("Squaring both sides", "两边平方"),
      explanation: t(
        `When the root stands alone on one side, square both sides. This removes the root, because $(\\sqrt{u})^{2} = u$, and leaves a linear equation:

$$\\sqrt{2x + 3} = 5 \\;\\Rightarrow\\; 2x + 3 = 25 \\;\\Rightarrow\\; x = 11.$$

Check: $\\sqrt{2(11) + 3} = \\sqrt{25} = 5$. A square root is never negative, so $\\sqrt{2x + 3} = -5$ has **no solution**. Squaring it would still give $x = 11$, but $\\sqrt{25} = 5 \\ne -5$, so that candidate is extraneous.

> **Watch out.** Square the right side too: $2x + 3 = 25$, not $2x + 3 = 5$. Always check in the original equation, since squaring turns $\\sqrt{2x + 3} = -5$ into the same equation as $\\sqrt{2x + 3} = 5$; when the right side is negative, the answer is no solution.`,
        `当根式单独在一边时，把两边平方。因为 $(\\sqrt{u})^{2} = u$，根号消去了，剩下一个一次方程：

$$\\sqrt{2x + 3} = 5 \\;\\Rightarrow\\; 2x + 3 = 25 \\;\\Rightarrow\\; x = 11.$$

检验：$\\sqrt{2(11) + 3} = \\sqrt{25} = 5$。平方根永远不是负数，所以 $\\sqrt{2x + 3} = -5$ **无解**。把它平方仍会得到 $x = 11$，但 $\\sqrt{25} = 5 \\ne -5$，所以这个候选值是增根。

> **注意。** 右边也要平方：是 $2x + 3 = 25$，不是 $2x + 3 = 5$。一定要代回原方程检验，因为平方后 $\\sqrt{2x + 3} = -5$ 和 $\\sqrt{2x + 3} = 5$ 变成同一个方程；右边是负数时，答案是无解。`,
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
        const lines = steps(`${linear(a, b)} = ${c * c}`, ...solveLinear(a, b, c * c, x0));
        const sides = negative
          ? t(`the left side is $${work}$, but the right side is $${rhs}$.`, `左边是 $${work}$，而右边是 $${rhs}$。`)
          : t(`the left side is $${work}$, the same as the right side.`, `左边是 $${work}$，和右边相同。`);
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values: negative ? [] : [num(x0)],
          wrong: negative ? [[num(x0)]] : [[num(Q.of(rhs - b, a))], []],
          solution: t(
            `${negative ? `A square root is never negative, so this equation cannot hold. Squaring shows how an extraneous candidate appears.\n\n` : ""}**Step 1: square both sides.** $(${sq(linear(a, b))})^{2} = ${linear(a, b)}$ and $(${rhs})^{2} = ${c * c}$.

**Step 2: solve.**${lines}${rootCheck(x0, !negative, sides).en}`,
            `${negative ? `平方根永远不是负数，所以这个方程不可能成立。下面的平方过程说明增根是怎样出现的。\n\n` : ""}**第一步：两边平方。** $(${sq(linear(a, b))})^{2} = ${linear(a, b)}$，$(${rhs})^{2} = ${c * c}$。

**第二步：求解。**${lines}${rootCheck(x0, !negative, sides)["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "isolating-the-root",
      title: t("Isolating the root first", "先分离根式"),
      explanation: t(
        `Squaring removes a root only when the root stands alone. Squaring $3\\sqrt{x - 2} + 1$ as it stands gives $9(x - 2) + 6\\sqrt{x - 2} + 1$, which still has a root. So first undo the addition and the multiplication, then square:

$$3\\sqrt{x - 2} + 1 = 13 \\;\\Rightarrow\\; 3\\sqrt{x - 2} = 12 \\;\\Rightarrow\\; \\sqrt{x - 2} = 4 \\;\\Rightarrow\\; x - 2 = 16 \\;\\Rightarrow\\; x = 18.$$

If the isolated root equals a negative number, the equation has no solution.

> **Watch out.** Divide by the coefficient before squaring: squaring $3\\sqrt{x - 2} = 12$ as if it were $\\sqrt{x - 2} = 12$ gives $x = 146$. Do not forget to square: $\\sqrt{x - 2} = 4$ means $x - 2 = 16$, not $x - 2 = 4$. And an isolated root equal to a negative number means no solution, even though squaring produces a candidate.`,
        `只有当根式单独在一边时，平方才能消去根号。直接把 $3\\sqrt{x - 2} + 1$ 平方，得到 $9(x - 2) + 6\\sqrt{x - 2} + 1$，仍含根式。所以先撤销加法和乘法，再平方：

$$3\\sqrt{x - 2} + 1 = 13 \\;\\Rightarrow\\; 3\\sqrt{x - 2} = 12 \\;\\Rightarrow\\; \\sqrt{x - 2} = 4 \\;\\Rightarrow\\; x - 2 = 16 \\;\\Rightarrow\\; x = 18.$$

如果分离出的根式等于负数，方程无解。

> **注意。** 平方前先除以系数：把 $3\\sqrt{x - 2} = 12$ 当作 $\\sqrt{x - 2} = 12$ 来平方，会得到 $x = 146$。别忘了平方：$\\sqrt{x - 2} = 4$ 意味着 $x - 2 = 16$，不是 $x - 2 = 4$。分离出的根式等于负数时方程无解，即使平方后能得到一个候选值。`,
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
        const isolate = k === 1 ? [isolated] : [`${front(k)}${sq(linear(a, b))} = ${e - d}`, isolated];
        const undo =
          k === 1
            ? t(`${d > 0 ? "Subtract" : "Add"} $${Math.abs(d)}$ on both sides:`, `两边${d > 0 ? "减去" : "加上"} $${Math.abs(d)}$：`)
            : t(
                `${d > 0 ? "Subtract" : "Add"} $${Math.abs(d)}$ on both sides, then divide by $${k}$:`,
                `两边${d > 0 ? "减去" : "加上"} $${Math.abs(d)}$，再除以 $${k}$：`,
              );
        const lines = steps(`${linear(a, b)} = ${c * c}`, ...solveLinear(a, b, c * c, x0));
        const value = k * c + d;
        const work = `${front(k)}\\sqrt{${substituted(a, x0, b)}} ${op(d)} ${Math.abs(d)} = ${k === 1 ? "" : `${k} \\cdot `}${c} ${op(d)} ${Math.abs(d)} = ${value}`;
        const sides = negative
          ? t(`the left side is $${work}$, but the right side is $${e}$.`, `左边是 $${work}$，而右边是 $${e}$。`)
          : t(`the left side is $${work}$, the same as the right side.`, `左边是 $${work}$，和右边相同。`);
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values: negative ? [] : [num(x0)],
          wrong: negative ? [[num(x0)]] : [...(k > 1 ? [[num(skipDivide)]] : []), [num(Q.of(r - b, a))]],
          solution: t(
            `**Step 1: isolate the root.** ${undo.en}${steps(...isolate)}${negative ? "A square root is never negative, so the equation has no solution. Squaring anyway produces an extraneous candidate.\n\n" : ""}**Step 2: square both sides and solve.** $(${r})^{2} = ${c * c}$:${lines}${rootCheck(x0, !negative, sides).en}`,
            `**第一步：分离根式。** ${undo["zh-CN"]}${steps(...isolate)}${negative ? "平方根不可能是负数，所以方程无解。如果照样平方，会得到一个增根。\n\n" : ""}**第二步：两边平方并求解。** $(${r})^{2} = ${c * c}$：${lines}${rootCheck(x0, !negative, sides)["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "roots-on-both-sides",
      title: t("Roots on both sides", "两边都有根式"),
      explanation: t(
        `When each side is a square root, squaring removes both roots at once, and the radicands are set equal:

$$\\sqrt{3x - 1} = \\sqrt{x + 7} \\;\\Rightarrow\\; 3x - 1 = x + 7 \\;\\Rightarrow\\; 2x = 8 \\;\\Rightarrow\\; x = 4.$$

At $x = 4$ both radicands are $11$, so both sides are $\\sqrt{11}$. Equal radicands always give equal roots, but only when they are not negative: if the common value is negative, neither root is a real number, and the candidate is extraneous.

> **Watch out.** Move the terms with the correct signs: from $3x - 1 = x + 7$, subtract $x$ and add $1$ to get $2x = 8$. And check the value of the radicands; a candidate that makes them negative is not a solution.`,
        `当两边都是平方根时，平方后两个根号同时消去，两个被开方式相等：

$$\\sqrt{3x - 1} = \\sqrt{x + 7} \\;\\Rightarrow\\; 3x - 1 = x + 7 \\;\\Rightarrow\\; 2x = 8 \\;\\Rightarrow\\; x = 4.$$

当 $x = 4$ 时两个被开方式都是 $11$，所以两边都等于 $\\sqrt{11}$。被开方式相等，平方根就相等，但前提是它们不是负数：如果共同的值是负数，两个根式都不是实数，这个候选值就是增根。

> **注意。** 移项时符号要正确：由 $3x - 1 = x + 7$，两边减去 $x$、加上 $1$，得 $2x = 8$。还要检验被开方式的值；使它们为负的候选值不是解。`,
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
        const lines = [`${linear(a, b)} = ${linear(c, d)}`, `${linear(a - c, 0)} = ${d - b}`, ...(a - c === 1 ? [] : [`x = ${x0}`])];
        const work = valid
          ? t(
              `the radicands are $${substituted(a, x0, b)} = ${v}$ and $${substituted(c, x0, d)} = ${v}$, so both sides are $\\sqrt{${v}}$${v === 0 || Math.sqrt(v) % 1 === 0 ? ` = ${Math.sqrt(v)}` : ""}.`,
              `两个被开方式是 $${substituted(a, x0, b)} = ${v}$ 和 $${substituted(c, x0, d)} = ${v}$，所以两边都等于 $\\sqrt{${v}}$${v === 0 || Math.sqrt(v) % 1 === 0 ? ` = ${Math.sqrt(v)}` : ""}。`,
            )
          : t(
              `the radicands are $${substituted(a, x0, b)} = ${v}$ and $${substituted(c, x0, d)} = ${v}$. The square root of a negative number is not a real number, so neither side is defined.`,
              `两个被开方式是 $${substituted(a, x0, b)} = ${v}$ 和 $${substituted(c, x0, d)} = ${v}$。负数的平方根不是实数，所以两边都没有意义。`,
            );
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values: valid ? [num(x0)] : [],
          wrong: valid ? [[], [num(Q.of(b + d, c - a))]] : [[num(x0)]],
          solution: t(
            `**Step 1: square both sides.** Each root is removed, so the radicands are equal.

**Step 2: solve the linear equation.** Collect the $x$ terms on the left and the numbers on the right:${steps(...lines)}${rootCheck(x0, valid, work).en}`,
            `**第一步：两边平方。** 两个根号都消去，所以两个被开方式相等。

**第二步：解一次方程。** 把含 $x$ 的项移到左边，数移到右边：${steps(...lines)}${rootCheck(x0, valid, work)["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "extraneous-solutions",
      title: t("Extraneous solutions", "增根"),
      explanation: t(
        `When the side without the root contains $x$, squaring can produce a candidate that makes that side negative. The root is never negative, so such a candidate is extraneous. Square the binomial carefully, $(x + 1)^{2} = x^{2} + 2x + 1$:

$$\\sqrt{x^{2} + 7} = x + 1 \\;\\Rightarrow\\; x^{2} + 7 = x^{2} + 2x + 1 \\;\\Rightarrow\\; 2x = 6 \\;\\Rightarrow\\; x = 3.$$

Check: $\\sqrt{16} = 4 = 3 + 1$, so $x = 3$ is a solution. For $x = \\sqrt{2x^{2} - 9}$, squaring gives $x^{2} = 9$, so $x = 3$ or $x = -3$; but $x = -3$ makes the left side $-3$ while the root is $3$, so only $x = 3$ is a solution.

> **Watch out.** Check every candidate in the original equation, not in the squared one, where every candidate works. A candidate that makes the side without the root negative is extraneous. But do not reject a candidate that passes: when it checks out, the equation has a solution.`,
        `当不含根式的一边含有 $x$ 时，平方可能得到使这一边为负的候选值。平方根永远不是负数，所以这样的候选值是增根。二项式要正确平方，$(x + 1)^{2} = x^{2} + 2x + 1$：

$$\\sqrt{x^{2} + 7} = x + 1 \\;\\Rightarrow\\; x^{2} + 7 = x^{2} + 2x + 1 \\;\\Rightarrow\\; 2x = 6 \\;\\Rightarrow\\; x = 3.$$

检验：$\\sqrt{16} = 4 = 3 + 1$，所以 $x = 3$ 是解。对于 $x = \\sqrt{2x^{2} - 9}$，平方得 $x^{2} = 9$，所以 $x = 3$ 或 $x = -3$；但 $x = -3$ 使左边等于 $-3$，而根式等于 $3$，所以只有 $x = 3$ 是解。

> **注意。** 每个候选值都要代回原方程检验，而不是代入平方后的方程，在那里每个候选值都成立。使不含根式的一边为负的候选值是增根。但通过检验的候选值不能舍去：检验成立时，方程是有解的。`,
      ),
      keyPrerequisites: ["squaring-binomials"],
      generate(rng) {
        if (rng.bool(0.6)) {
          const c = rng.nonZero(-6, 6);
          const x0 = rng.nonZero(-8, 8);
          const b = 2 * c * x0 + c * c;
          const valid = x0 + c >= 0;
          const radicand = poly([1, "x^{2}"], [b, ""]);
          const eq = `${sq(radicand)} = ${linear(1, c)}`;
          const square = poly([1, "x^{2}"], [2 * c, "x"], [c * c, ""]);
          const lines = [`${radicand} = ${square}`, `${linear(2 * c, 0)} = ${b - c * c}`, `x = ${x0}`];
          const left = `\\sqrt{${paren(x0)}^{2}${b === 0 ? "" : ` ${op(b)} ${Math.abs(b)}`}} = \\sqrt{${(x0 + c) ** 2}} = ${Math.abs(x0 + c)}`;
          const right = `${x0} ${op(c)} ${Math.abs(c)} = ${x0 + c}`;
          const work = valid
            ? t(`the left side is $${left}$ and the right side is $${right}$.`, `左边是 $${left}$，右边是 $${right}$。`)
            : t(
                `the left side is $${left}$, but the right side is $${right}$, and a square root is never negative.`,
                `左边是 $${left}$，而右边是 $${right}$，平方根不可能是负数。`,
              );
          return solutionsProblem({
            prompt: solvePrompt(eq),
            values: valid ? [num(x0)] : [],
            wrong: valid ? [[]] : [[num(x0)]],
            solution: t(
              `**Step 1: square both sides.** The right side is a binomial: $(${linear(1, c)})^{2} = ${square}$.

**Step 2: solve.** The $x^{2}$ terms cancel, leaving a linear equation:${steps(...lines)}${rootCheck(x0, valid, work).en}`,
              `**第一步：两边平方。** 右边是二项式：$(${linear(1, c)})^{2} = ${square}$。

**第二步：求解。** $x^{2}$ 项相互抵消，剩下一个一次方程：${steps(...lines)}${rootCheck(x0, valid, work)["zh-CN"]}`,
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
        const lines = [
          `x^{2} = ${inside}`,
          `${a - 1 === 1 ? "" : a - 1}x^{2} = ${-b}`,
          ...(a - 1 === 1 ? [] : [`x^{2} = ${r * r}`]),
          `x = \\pm ${r}`,
        ];
        const leftAt = (x: number) => (s < 0 ? `-(${x}) = ${-x}` : `${x}`);
        const rightAt = (x: number) => `\\sqrt{${a}(${x})^{2} - ${-b}} = \\sqrt{${r * r}} = ${r}`;
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values: [num(x0)],
          wrong: [[num(r), num(-r)], [num(-x0)]],
          solution: t(
            `**Step 1: square both sides.** The left side squares to $x^{2}$, so the candidates come from a quadratic equation:${steps(...lines)}**Step 2: test both candidates.** The right side is a square root, so it is never negative.

**Check.** At $x = ${x0}$, the left side is $${leftAt(x0)}$ and the right side is $${rightAt(x0)}$: they agree. At $x = ${-x0}$, the left side is $${leftAt(-x0)}$, but the right side is again $${r}$, so $x = ${-x0}$ is extraneous. The only solution is $x = ${x0}$.`,
            `**第一步：两边平方。** 左边平方后是 $x^{2}$，所以候选值来自一个二次方程：${steps(...lines)}**第二步：检验两个候选值。** 右边是平方根，永远不是负数。

**检验。** 当 $x = ${x0}$ 时，左边是 $${leftAt(x0)}$，右边是 $${rightAt(x0)}$，两边相等。当 $x = ${-x0}$ 时，左边是 $${leftAt(-x0)}$，而右边仍是 $${r}$，所以 $x = ${-x0}$ 是增根。方程唯一的解是 $x = ${x0}$。`,
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
