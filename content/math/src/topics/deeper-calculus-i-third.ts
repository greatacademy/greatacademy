// Third knowledge points for thin topics of Calculus I, from hyperbolic graphs to
// related rates: the reverse question, a harder case or a common trap. See
// `deeperCalculusIThirdPoints`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import { linear, paren, poly, Q, union } from "@ga/subject-math";

import { functionProblem, intervalProblem, solutionsProblem, verdictChoice } from "../problems.ts";
import { ask, choose, type Pair, point } from "../university-kit.ts";

/** nz picks a nonzero integer from -r to r. */
const nz = (rng: Rng, r: number) => rng.pick([...Array(2 * r + 1).keys()].map((i) => i - r).filter((i) => i !== 0));
/** minus writes x - a with the sign tidied: "x + 3" for a = -3 and "x" for a = 0. */
const minus = (a: number) => linear(1, -a);
/** tail writes a constant term after other terms: " + 3", " - 3", or nothing for 0. */
const tail = (m: number) => (m === 0 ? "" : m < 0 ? ` - ${-m}` : ` + ${m}`);
/** same2 writes one formula as a pair for both languages. */
const same2 = (latex: string): Pair => [`$${latex}$`, `$${latex}$`];

/** hyperbolicCount counts the solutions of base(x) = v for cosh, sinh and tanh with integer v. */
const hyperbolicCount = (kind: "cosh" | "sinh" | "tanh", v: number) =>
  kind === "cosh" ? (v > 1 ? 2 : v === 1 ? 1 : 0) : kind === "sinh" ? 1 : Math.abs(v) < 1 ? 1 : 0;

/** reciprocalCount counts the solutions of base(x) = v for sech, csch and coth with integer v. */
const reciprocalCount = (kind: "sech" | "csch" | "coth", v: number) =>
  kind === "sech" ? (v === 1 ? 1 : 0) : kind === "csch" ? (v === 0 ? 0 : 1) : Math.abs(v) > 1 ? 1 : 0;

/** rootsCount tallies which roots of a factored rational function give vertical asymptotes. */
const rootsCount = (top: readonly number[], bottom: readonly number[]) => bottom.filter((m, i) => m > top[i]!).length;

/** factors writes a product of powers of (x - r), or 1 when every power is zero. */
const factors = (roots: readonly number[], powers: readonly number[]) => {
  const out = roots.map((r, i) => (powers[i] === 0 ? "" : `(${minus(r)})${powers[i] === 1 ? "" : `^{${powers[i]}}`}`)).join("");
  return out === "" ? "1" : out;
};

const levelLineOfHyperbolicGraph = point(
  "how-many-times-a-level-line-meets-a-hyperbolic-graph",
  ["How many times a level line meets the graph", "水平直线与图像的交点个数"],
  [
    "The shape of the graph decides how many solutions an equation has. $\\cosh$ has a minimum value of $1$, so a level above it is met twice; $\\sinh$ takes every value exactly once; $\\tanh$ stays strictly between $-1$ and $1$. Undo the stretch and shift first, then compare with the range.",
    "图像的形状决定方程有几个解。$\\cosh$ 的最小值是 $1$，所以高于它的水平线与图像交于两点；$\\sinh$ 每个值恰好取一次；$\\tanh$ 严格介于 $-1$ 和 $1$ 之间。先还原伸缩和平移，再与值域比较。",
  ],
  (rng) => {
    const kind = rng.pick(["cosh", "cosh", "sinh", "tanh", "tanh"] as const);
    const a = nz(rng, 4);
    const h = rng.int(-4, 4);
    const k = rng.int(-6, 6);
    const v = rng.int(-2, 3);
    const m = k + a * v;
    const answer = hyperbolicCount(kind, v);
    const y = poly([a, `\\${kind}(${minus(h)})`], [k, ""]);
    const why: Pair =
      kind === "cosh"
        ? [
            "$\\cosh$ takes values above $1$ twice, the value $1$ once and nothing below $1$",
            "$\\cosh$ 大于 $1$ 的值取两次，$1$ 取一次，小于 $1$ 的值取不到",
          ]
        : kind === "sinh"
          ? ["$\\sinh$ is increasing and takes every real value exactly once", "$\\sinh$ 递增，每个实数值恰好取一次"]
          : [
              "$\\tanh$ takes each value strictly between $-1$ and $1$ exactly once and no other value",
              "$\\tanh$ 严格介于 $-1$ 与 $1$ 之间的值各取一次，其他值取不到",
            ];
    return ask(
      [
        `How many points do the graph of $y = ${y}$ and the line $y = ${m}$ have in common?`,
        `$y = ${y}$ 的图像与直线 $y = ${m}$ 有多少个公共点？`,
      ],
      answer,
      [0, 1, 2],
      [
        `Solving for the function gives $\\${kind}(${minus(h)}) = ${v}$. ${why[0]}, so the number of common points is $${answer}$.`,
        `解出函数值得 $\\${kind}(${minus(h)}) = ${v}$。${why[1]}，所以公共点的个数是 $${answer}$。`,
      ],
    );
  },
);

const levelLineOfReciprocalGraph = point(
  "how-many-times-a-level-line-meets-a-reciprocal-hyperbolic-graph",
  ["How many times a level line meets a reciprocal graph", "水平直线与倒数双曲图像的交点个数"],
  [
    "The ranges tell the number of solutions. $\\operatorname{sech}$ takes values in $(0, 1]$, with the value $1$ only at its peak; $\\operatorname{csch}$ takes every value except $0$, each once; $\\coth$ takes each value with absolute value above $1$ once, and nothing between $-1$ and $1$.",
    "值域决定解的个数。$\\operatorname{sech}$ 的值域是 $(0, 1]$，$1$ 只在峰顶取到；$\\operatorname{csch}$ 取除 $0$ 以外的所有值，各取一次；$\\coth$ 绝对值大于 $1$ 的值各取一次，$-1$ 与 $1$ 之间的值取不到。",
  ],
  (rng) => {
    const kind = rng.pick(["sech", "csch", "coth"] as const);
    const a = nz(rng, 4);
    const h = rng.int(-4, 4);
    const k = rng.int(-6, 6);
    const v = rng.int(-2, 2);
    const m = k + a * v;
    const answer = reciprocalCount(kind, v);
    const fn = kind === "coth" ? "\\coth" : `\\operatorname{${kind}}`;
    const y = poly([a, `${fn}(${minus(h)})`], [k, ""]);
    const why: Pair =
      kind === "sech"
        ? [
            "$\\operatorname{sech}$ takes values only in $(0, 1]$, and it reaches $1$ only at its peak",
            "$\\operatorname{sech}$ 的值只在 $(0, 1]$ 中，并且只在峰顶取到 $1$",
          ]
        : kind === "csch"
          ? [
              "$\\operatorname{csch}$ takes each nonzero value once and never takes $0$",
              "$\\operatorname{csch}$ 每个非零值取一次，取不到 $0$",
            ]
          : [
              "$\\coth$ takes each value with $|y| > 1$ once and misses the band $-1 \\le y \\le 1$",
              "$\\coth$ 满足 $|y| > 1$ 的值各取一次，取不到 $-1 \\le y \\le 1$ 这一带",
            ];
    return ask(
      [
        `How many points do the graph of $y = ${y}$ and the line $y = ${m}$ have in common?`,
        `$y = ${y}$ 的图像与直线 $y = ${m}$ 有多少个公共点？`,
      ],
      answer,
      [0, 1, 2],
      [
        `Solving for the function gives $${fn}(${minus(h)}) = ${v}$. ${why[0]}, so the number of common points is $${answer}$.`,
        `解出函数值得 $${fn}(${minus(h)}) = ${v}$。${why[1]}，所以公共点的个数是 $${answer}$。`,
      ],
    );
  },
);

const oneSidedAbsoluteValue = point(
  "one-sided-limits-of-an-absolute-value-quotient",
  ["One-sided limits of an absolute value quotient", "绝对值商的单侧极限"],
  [
    "The quotient $\\frac{|x - a|}{x - a}$ is $1$ to the right of $a$ and $-1$ to the left, however close $x$ comes to $a$. So each one-sided limit is found by replacing the quotient with its constant value on that side.",
    "商 $\\frac{|x - a|}{x - a}$ 在 $a$ 的右侧等于 $1$，在左侧等于 $-1$，无论 $x$ 多么接近 $a$。所以每个单侧极限都可以把这个商换成它在那一侧的常数值来求。",
  ],
  (rng) => {
    const a = rng.int(-6, 6);
    const b = nz(rng, 9);
    const c = nz(rng, 9);
    const right = rng.bool();
    const answer = c + (right ? b : -b);
    const q = `\\frac{|${minus(a)}|}{${minus(a)}}`;
    return ask(
      [
        `Find $\\lim_{x \\to ${a}^{${right ? "+" : "-"}}} \\left(${poly([c, ""], [b, q])}\\right)$.`,
        `求 $\\lim_{x \\to ${a}^{${right ? "+" : "-"}}} \\left(${poly([c, ""], [b, q])}\\right)$。`,
      ],
      answer,
      [c + (right ? -b : b), b, c],
      [
        `${right ? `To the right of $${a}$, $${minus(a)} > 0$, so the quotient is $1$` : `To the left of $${a}$, $${minus(a)} < 0$, so the quotient is $-1$`}. The expression is the constant $${poly([c, ""], [right ? b : -b, ""])}$ there, which is $${answer}$.`,
        `${right ? `在 $${a}$ 的右侧 $${minus(a)} > 0$，所以这个商是 $1$` : `在 $${a}$ 的左侧 $${minus(a)} < 0$，所以这个商是 $-1$`}。此时表达式就是常数 $${poly([c, ""], [right ? b : -b, ""])}$，等于 $${answer}$。`,
      ],
    );
  },
);

const limitAcrossTwoFormulas = point(
  "a-limit-across-two-formulas-and-a-stray-value",
  ["A limit across two formulas and a stray value", "跨两个表达式且有孤立函数值的极限"],
  [
    "Two different formulas on the two sides do not stop a limit from existing, and a separate value at the point does not matter either. Only the one-sided limits count: the limit exists exactly when they agree.",
    "两侧用不同的表达式并不妨碍极限存在，该点处单独规定的函数值也没有影响。只有单侧极限才起作用：两者相等时极限存在，否则不存在。",
  ],
  (rng) => {
    const a = rng.int(-4, 4);
    const p = nz(rng, 5);
    const q = rng.int(-6, 6);
    const r = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].filter((x) => x !== p));
    const L = p * a + q;
    const holds = rng.bool();
    const R = holds ? L : L + nz(rng, 4);
    const s = R - r * a;
    const v = L + rng.pick([-3, -2, 2, 3]);
    const f = `\\begin{cases} ${linear(p, q)} & x < ${a} \\\\ ${v} & x = ${a} \\\\ ${linear(r, s)} & x > ${a} \\end{cases}`;
    return verdictChoice(rng, {
      prompt: t(`Let $f(x) = ${f}$. Does $\\lim_{x \\to ${a}} f(x)$ exist?`, `设 $f(x) = ${f}$。$\\lim_{x \\to ${a}} f(x)$ 存在吗？`),
      holds,
      yes: t(`the left and right limits are both $${L}$`, `左极限和右极限都是 $${L}$`),
      no: t(`the left limit is $${L}$ and the right limit is $${R}$`, `左极限是 $${L}$，右极限是 $${R}$`),
      yesWrong: t(`$f(${a})$ is defined and equals $${v}$`, `$f(${a})$ 有定义，等于 $${v}$`),
      noWrong: t(`$f$ is given by different formulas on the two sides`, `$f$ 在两侧由不同的表达式给出`),
      solution: t(
        `Substituting gives a left limit of $${L}$ and a right limit of $${R}$. ${holds ? `They agree, so the limit is $${L}$, whatever $f(${a}) = ${v}$ says.` : "They differ, so the limit does not exist."}`,
        `代入得左极限 $${L}$，右极限 $${R}$。${holds ? `两者相等，所以极限是 $${L}$，与 $f(${a}) = ${v}$ 无关。` : "两者不相等，所以极限不存在。"}`,
      ),
    });
  },
);

const crossingAnAsymptote = point(
  "a-graph-may-cross-its-horizontal-asymptote",
  ["A graph may cross its horizontal asymptote", "图像可以穿过水平渐近线"],
  [
    "A horizontal asymptote only describes what happens far out: the values must get close to the line and stay close. The graph may cross the line, even infinitely often, as long as the swings around it shrink to zero.",
    "水平渐近线只描述远处的情况：函数值必须接近这条直线并保持接近。图像可以穿过这条直线，甚至穿过无穷多次，只要围绕它的摆动趋于零。",
  ],
  (rng) => {
    const L = rng.int(-9, 9);
    const c = nz(rng, 7);
    const f = poly([L, ""], [c, "\\frac{\\sin x}{x}"]);
    return choose(
      rng,
      [
        `The graph of $f(x) = ${f}$ crosses the line $y = ${L}$ at every multiple of $\\pi$. What is $\\lim_{x \\to \\infty} f(x)$?`,
        `$f(x) = ${f}$ 的图像在 $\\pi$ 的每个倍数处都穿过直线 $y = ${L}$。$\\lim_{x \\to \\infty} f(x)$ 是多少？`,
      ],
      [`$${L}$, because the swings around $y = ${L}$ shrink to zero`, `$${L}$，因为围绕 $y = ${L}$ 的摆动趋于零`],
      [
        [`It does not exist, because the graph keeps crossing $y = ${L}$`, `不存在，因为图像不断穿过 $y = ${L}$`],
        [`$${L + c}$, because $\\frac{\\sin x}{x}$ tends to $1$`, `$${L + c}$，因为 $\\frac{\\sin x}{x}$ 趋于 $1$`],
        [`It does not exist, because $\\sin x$ has no limit`, `不存在，因为 $\\sin x$ 没有极限`],
      ],
      [
        `Since $|\\sin x| \\le 1$, the term $${poly([c, "\\frac{\\sin x}{x}"])}$ has size at most $\\frac{${Math.abs(c)}}{|x|}$, which tends to $0$. So the limit is $${L}$, and $y = ${L}$ is a horizontal asymptote even though the graph crosses it.`,
        `因为 $|\\sin x| \\le 1$，项 $${poly([c, "\\frac{\\sin x}{x}"])}$ 的绝对值不超过 $\\frac{${Math.abs(c)}}{|x|}$，它趋于 $0$。所以极限是 $${L}$，尽管图像穿过 $y = ${L}$，它仍是水平渐近线。`,
      ],
    );
  },
);

const formulaFromInfiniteLimits = point(
  "the-formula-from-the-behavior-at-an-asymptote",
  ["The formula from the behavior at an asymptote", "由渐近线处的行为确定表达式"],
  [
    "Near $x = a$, an odd power of $x - a$ in the denominator changes sign across $a$, so the two sides go to opposite infinities; an even power keeps its sign, so both sides go the same way. The sign of the numerator then decides which way.",
    "在 $x = a$ 附近，分母中 $x - a$ 的奇次幂在 $a$ 两侧变号，所以两侧趋于相反的无穷；偶次幂不变号，所以两侧趋于同一方向。分子的符号再决定具体方向。",
  ],
  (rng) => {
    const a = nz(rng, 6);
    const c = rng.int(1, 9);
    const even = rng.bool();
    const sign = rng.pick([1, -1]);
    const form = (s: number, e: boolean) => `\\frac{${s * c}}{${e ? `(${minus(a)})^{2}` : minus(a)}}`;
    const left = even ? sign : -sign;
    const inf = (s: number) => (s > 0 ? "\\infty" : "-\\infty");
    return choose(
      rng,
      [
        `Which function has $\\lim_{x \\to ${a}^{-}} f(x) = ${inf(left)}$ and $\\lim_{x \\to ${a}^{+}} f(x) = ${inf(sign)}$?`,
        `哪个函数满足 $\\lim_{x \\to ${a}^{-}} f(x) = ${inf(left)}$ 且 $\\lim_{x \\to ${a}^{+}} f(x) = ${inf(sign)}$？`,
      ],
      same2(`f(x) = ${form(sign, even)}`),
      [same2(`f(x) = ${form(-sign, even)}`), same2(`f(x) = ${form(sign, !even)}`), same2(`f(x) = ${form(-sign, !even)}`)],
      [
        `The two sides go ${even ? "the same way, so the power is even" : "opposite ways, so the power is odd"}. To the right of $${a}$ the denominator is positive, so the numerator has the sign of the right limit, and $f(x) = ${form(sign, even)}$.`,
        `两侧趋于${even ? "同一方向，所以是偶次幂" : "相反方向，所以是奇次幂"}。在 $${a}$ 的右侧分母为正，所以分子的符号与右极限相同，$f(x) = ${form(sign, even)}$。`,
      ],
    );
  },
);

const coefficientFromPowerLimit = point(
  "the-coefficient-from-the-value-of-a-limit",
  ["The coefficient from the value of a limit", "由极限值求系数"],
  [
    "A limit of a power function is found by substitution, so a known limit gives an equation for an unknown coefficient: if $\\lim_{x \\to a} cx^{n} = L$, then $ca^{n} = L$ and $c = \\frac{L}{a^{n}}$.",
    "幂函数的极限可以代入求得，所以已知极限就得到未知系数的方程：若 $\\lim_{x \\to a} cx^{n} = L$，则 $ca^{n} = L$，$c = \\frac{L}{a^{n}}$。",
  ],
  (rng) => {
    const a = rng.pick([-3, -2, 2, 3]);
    const n = rng.int(2, 4);
    const c = Q.of(nz(rng, 9), rng.pick([1, 1, 2]));
    const L = c.mul(Q.of(a ** n));
    return ask(
      [
        `The constant $c$ satisfies $\\lim_{x \\to ${a}} cx^{${n}} = ${L.toLatex()}$. Find $c$.`,
        `常数 $c$ 满足 $\\lim_{x \\to ${a}} cx^{${n}} = ${L.toLatex()}$。求 $c$。`,
      ],
      c,
      [L.mul(Q.of(a ** n)), L.div(Q.of(a)), L.div(Q.of(Math.abs(a) ** n))],
      [
        `Substituting gives $c \\cdot ${paren(a)}^{${n}} = ${a ** n}c$, so $c = \\frac{${L.toLatex()}}{${a ** n}} = ${c.toLatex()}$.`,
        `代入得 $c \\cdot ${paren(a)}^{${n}} = ${a ** n}c$，所以 $c = \\frac{${L.toLatex()}}{${a ** n}} = ${c.toLatex()}$。`,
      ],
    );
  },
);

const twoSidedReciprocal = point(
  "two-sided-limits-at-an-asymptote",
  ["Two-sided limits at an asymptote", "渐近线处的双侧极限"],
  [
    "A two-sided infinite limit needs both sides to go the same way. With an even power of $x - a$ in the denominator they do; with an odd power the sides go to opposite infinities, and the two-sided limit does not exist even as an infinite limit.",
    "双侧无穷极限要求两侧趋于同一方向。分母中 $x - a$ 是偶次幂时确实如此；是奇次幂时两侧趋于相反的无穷，即使作为无穷极限，双侧极限也不存在。",
  ],
  (rng) => {
    const a = rng.int(-6, 6);
    const c = nz(rng, 7);
    const n = rng.int(1, 4);
    const b = rng.int(-4, 4);
    const f = poly([1, `\\frac{${c}}{${n === 1 ? minus(a) : `(${minus(a)})^{${n}}`}}`], [b, ""]);
    const pos: Pair = ["$\\infty$", "$\\infty$"];
    const neg: Pair = ["$-\\infty$", "$-\\infty$"];
    const none: Pair = ["It does not exist, as the sides go to opposite infinities", "不存在，因为两侧趋于相反的无穷"];
    const finite: Pair = [`$${b}$`, `$${b}$`];
    const even = n % 2 === 0;
    return choose(
      rng,
      [`Find $\\lim_{x \\to ${a}} \\left(${f}\\right)$.`, `求 $\\lim_{x \\to ${a}} \\left(${f}\\right)$。`],
      even ? (c > 0 ? pos : neg) : none,
      even ? [c > 0 ? neg : pos, none, finite] : [pos, neg, finite],
      [
        even
          ? `The power $${n}$ is even, so the denominator is positive on both sides and the fraction has the sign of $${c}$ on both sides. The limit is $${c > 0 ? "\\infty" : "-\\infty"}$.`
          : `The power $${n}$ is odd, so the denominator changes sign across $${a}$ and the fraction goes to opposite infinities. The limit does not exist.`,
        even
          ? `指数 $${n}$ 是偶数，所以分母在两侧都为正，分式在两侧都与 $${c}$ 同号。极限是 $${c > 0 ? "\\infty" : "-\\infty"}$。`
          : `指数 $${n}$ 是奇数，所以分母在 $${a}$ 两侧变号，分式趋于相反的无穷。极限不存在。`,
      ],
    );
  },
);

const trigAtMultiplesOfPi = point(
  "trigonometric-limits-at-any-multiple-of-pi",
  ["Trigonometric limits at any multiple of pi", "在 $\\pi$ 的任意整数倍处的三角极限"],
  [
    "Sine and cosine are continuous, so a limit is a value, and periodicity gives the value at any multiple of $\\pi$: $\\sin k\\pi = 0$ and $\\cos k\\pi = (-1)^{k}$. An odd multiple gives $-1$ and an even one gives $1$, also for negative $k$.",
    "正弦和余弦连续，所以极限就是函数值，周期性给出 $\\pi$ 任意整数倍处的值：$\\sin k\\pi = 0$，$\\cos k\\pi = (-1)^{k}$。奇数倍得 $-1$，偶数倍得 $1$，$k$ 为负时也一样。",
  ],
  (rng) => {
    const k = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5, 6, 7]);
    const a = nz(rng, 9);
    const b = nz(rng, 9);
    const c = rng.int(-6, 6);
    const f = poly([a, "\\sin x"], [b, "\\cos x"], [c, ""]);
    const cos = k % 2 === 0 ? 1 : -1;
    const answer = b * cos + c;
    return ask(
      [`Find $\\lim_{x \\to ${k}\\pi} \\left(${f}\\right)$.`, `求 $\\lim_{x \\to ${k}\\pi} \\left(${f}\\right)$。`],
      answer,
      [-b * cos + c, a + c, a * cos + c, a + b + c],
      [
        `$\\sin(${k}\\pi) = 0$ and, since $${k}$ is ${cos > 0 ? "even" : "odd"}, $\\cos(${k}\\pi) = ${cos}$. Substituting gives $${paren(b)} \\cdot ${paren(cos)} + ${paren(c)} = ${answer}$.`,
        `$\\sin(${k}\\pi) = 0$；$${k}$ 是${cos > 0 ? "偶数" : "奇数"}，所以 $\\cos(${k}\\pi) = ${cos}$。代入得 $${paren(b)} \\cdot ${paren(cos)} + ${paren(c)} = ${answer}$。`,
      ],
    );
  },
);

const reciprocalTrigFarOut = point(
  "reciprocal-trigonometric-limits-away-from-the-first-period",
  ["Reciprocal limits away from the first period", "第一个周期以外的倒数三角极限"],
  [
    "Away from its asymptotes a reciprocal trigonometric function is continuous, so its limit is its value, which comes from the sine or cosine it is built on: $\\sec k\\pi = (-1)^{k}$, $\\csc\\left(\\frac{\\pi}{2} + k\\pi\\right) = (-1)^{k}$, and $\\cot\\left(\\frac{\\pi}{2} + k\\pi\\right) = 0$.",
    "在渐近线以外，倒数三角函数连续，所以极限就是函数值，它由相应的正弦或余弦决定：$\\sec k\\pi = (-1)^{k}$，$\\csc\\left(\\frac{\\pi}{2} + k\\pi\\right) = (-1)^{k}$，$\\cot\\left(\\frac{\\pi}{2} + k\\pi\\right) = 0$。",
  ],
  (rng) => {
    const k = rng.pick([1, 2, 3, 4, 5, -1, -2, -3]);
    const a = nz(rng, 9);
    const c = rng.int(-6, 6);
    const kind = rng.pick(["sec", "csc", "cot"] as const);
    const sign = k % 2 === 0 ? 1 : -1;
    const piText = k === 1 ? "\\pi" : k === -1 ? "-\\pi" : `${k}\\pi`;
    const half = Math.abs(2 * k + 1);
    const at = kind === "sec" ? piText : `${k < 0 ? "-" : ""}\\frac{${half}\\pi}{2}`;
    const value = kind === "cot" ? 0 : sign;
    const answer = a * value + c;
    const where = kind === "sec" ? `\\cos\\left(${at}\\right)` : `\\sin\\left(${at}\\right)`;
    const also = kind === "cot" ? `\\cos\\left(${at}\\right) = 0$ and $` : "";
    const alsoZh = kind === "cot" ? `\\cos\\left(${at}\\right) = 0$，$` : "";
    const f = poly([a, `\\${kind} x`], [c, ""]);
    return ask(
      [`Find $\\lim_{x \\to ${at}} \\left(${f}\\right)$.`, `求 $\\lim_{x \\to ${at}} \\left(${f}\\right)$。`],
      answer,
      [a + c, -a + c, c - a * value, a * sign * -1 + c, c],
      [
        `Here $${also}${where} = ${sign}$, so $\\${kind}\\left(${at}\\right) = ${value}$. The function is continuous there, and the limit is $${paren(a)} \\cdot ${paren(value)} + ${paren(c)} = ${answer}$.`,
        `这里 $${alsoZh}${where} = ${sign}$，所以 $\\${kind}\\left(${at}\\right) = ${value}$。函数在该点连续，极限是 $${paren(a)} \\cdot ${paren(value)} + ${paren(c)} = ${answer}$。`,
      ],
    );
  },
);

const sameBaseExponentials = point(
  "dominant-exponentials-with-the-same-base",
  ["Dominant exponentials with the same base", "底相同的主导指数项"],
  [
    "In a quotient at infinity, only the fastest-growing term of the numerator and of the denominator matter. An exponential with the largest base beats every power and every smaller base. When both sides share that base, it cancels and the limit is the ratio of the coefficients.",
    "在无穷远处的商中，只有分子和分母里增长最快的项起作用。底最大的指数项胜过任何幂函数和任何底更小的指数项。如果分子分母都以这个底为主导，它就约去了，极限等于系数之比。",
  ],
  (rng) => {
    const b = rng.int(3, 7);
    const e = rng.int(2, b - 1);
    const c = nz(rng, 9);
    const d = rng.int(2, 9);
    const n = rng.int(3, 9);
    const m = rng.int(2, 9);
    const answer = Q.of(c, d);
    const top = poly([c, `\\cdot ${b}^{x}`], [m, `x^{${n}}`]).replace(/^(-?)\\cdot /, "$1");
    const bottom = `${d} \\cdot ${b}^{x} + ${e}^{x}`;
    return ask(
      [`Find $\\lim_{x \\to \\infty} \\frac{${top}}{${bottom}}$.`, `求 $\\lim_{x \\to \\infty} \\frac{${top}}{${bottom}}$。`],
      answer,
      [0, Q.of(m, d), Q.of(c, d + 1), Q.of(d, c)],
      [
        `$${b}^{x}$ beats $x^{${n}}$ and $${e}^{x}$. Dividing the top and bottom by $${b}^{x}$, the other terms tend to $0$, which leaves $\\frac{${c}}{${d}} = ${answer.toLatex()}$.`,
        `$${b}^{x}$ 胜过 $x^{${n}}$ 和 $${e}^{x}$。分子分母同除以 $${b}^{x}$，其余各项趋于 $0$，剩下 $\\frac{${c}}{${d}} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const whichConditionFails = point(
  "which-condition-of-continuity-fails",
  ["Which condition of continuity fails", "连续性的哪一条不满足"],
  [
    "Continuity at $a$ asks three things in order: $f(a)$ is defined, $\\lim_{x \\to a} f(x)$ exists, and the two are equal. Naming the first condition that fails also tells the kind of discontinuity: a missing value or a moved point can be repaired, a jump cannot.",
    "在 $a$ 处连续依次要求三件事：$f(a)$ 有定义，$\\lim_{x \\to a} f(x)$ 存在，二者相等。说出第一条不满足的条件，也就知道了间断的类型：缺失的值或移动的点可以修补，跳跃则不能。",
  ],
  (rng) => {
    const a = rng.int(-5, 5);
    const L = rng.int(-8, 8);
    const kind = rng.int(0, 3);
    const R = kind === 1 ? L + nz(rng, 5) : L;
    const v = kind === 2 ? L + nz(rng, 5) : L;
    const given = kind === 0 ? [`$f(${a})$ is not defined`, `$f(${a})$ 没有定义`] : [`$f(${a}) = ${v}$`, `$f(${a}) = ${v}$`];
    const options: Pair[] = [
      [`$f(${a})$ is not defined`, `$f(${a})$ 没有定义`],
      [`The limit at $${a}$ does not exist`, `在 $${a}$ 处的极限不存在`],
      [`The limit exists but differs from $f(${a})$`, `极限存在，但不等于 $f(${a})$`],
      [`None fails: $f$ is continuous at $${a}$`, `没有不满足的：$f$ 在 $${a}$ 处连续`],
    ];
    const answer = kind;
    const whyEn = [
      "There is no value to compare with the limit, so the first condition fails.",
      "The one-sided limits differ, so the limit does not exist.",
      `The limit is $${L}$ but the value is $${v}$.`,
      `The limit is $${L}$ and it equals the value, so all three conditions hold.`,
    ][answer]!;
    const whyZh = [
      "没有函数值可与极限比较，所以第一条不满足。",
      "两个单侧极限不相等，所以极限不存在。",
      `极限是 $${L}$，函数值却是 $${v}$。`,
      `极限是 $${L}$，等于函数值，所以三条都满足。`,
    ][answer]!;
    return choose(
      rng,
      [
        `A function has $\\lim_{x \\to ${a}^{-}} f(x) = ${L}$ and $\\lim_{x \\to ${a}^{+}} f(x) = ${R}$, and ${given[0]}. What can be said about continuity at $x = ${a}$?`,
        `函数满足 $\\lim_{x \\to ${a}^{-}} f(x) = ${L}$，$\\lim_{x \\to ${a}^{+}} f(x) = ${R}$，并且 ${given[1]}。关于它在 $x = ${a}$ 处的连续性可以说什么？`,
      ],
      options[answer]!,
      options.filter((_, i) => i !== answer),
      [whyEn, whyZh],
    );
  },
);

const valueForOneSidedContinuity = point(
  "the-value-that-gives-one-sided-continuity",
  ["The value that gives one-sided continuity", "使函数单侧连续的取值"],
  [
    "At a jump the function cannot be continuous from both sides, but the value $f(a)$ can be chosen to match one side. Continuity from the left needs $f(a)$ to equal the left limit, and continuity from the right needs it to equal the right limit.",
    "在跳跃处，函数不可能在两侧都连续，但可以选择 $f(a)$ 与某一侧相符。左连续要求 $f(a)$ 等于左极限，右连续要求 $f(a)$ 等于右极限。",
  ],
  (rng) => {
    const a = rng.int(-4, 4);
    const p = nz(rng, 5);
    const q = rng.int(-6, 6);
    const r = nz(rng, 5);
    const L = p * a + q;
    const R = L + nz(rng, 6);
    const s = R - r * a;
    const fromLeft = rng.bool();
    const f = `\\begin{cases} ${linear(p, q)} & x < ${a} \\\\ k & x = ${a} \\\\ ${linear(r, s)} & x > ${a} \\end{cases}`;
    const answer = fromLeft ? L : R;
    return ask(
      [
        `Let $f(x) = ${f}$. Find the value of $k$ that makes $f$ continuous from the ${fromLeft ? "left" : "right"} at $x = ${a}$.`,
        `设 $f(x) = ${f}$。求使 $f$ 在 $x = ${a}$ 处${fromLeft ? "左" : "右"}连续的 $k$ 值。`,
      ],
      answer,
      [fromLeft ? R : L, Q.of(L + R, 2)],
      [
        `Continuity from the ${fromLeft ? "left" : "right"} needs $f(${a})$ to equal the ${fromLeft ? "left" : "right"} limit, found by substituting $x = ${a}$ into $${fromLeft ? linear(p, q) : linear(r, s)}$. That gives $k = ${answer}$.`,
        `${fromLeft ? "左" : "右"}连续要求 $f(${a})$ 等于${fromLeft ? "左" : "右"}极限，把 $x = ${a}$ 代入 $${fromLeft ? linear(p, q) : linear(r, s)}$ 就得到它。所以 $k = ${answer}$。`,
      ],
    );
  },
);

const twoValuesOfK = point(
  "two-values-of-a-constant-that-make-a-function-continuous",
  ["Two values of a constant that make a function continuous", "使函数连续的常数有两个取值"],
  [
    "When the constant appears squared, matching the two pieces at the break gives a quadratic equation in the constant. Both roots make the pieces meet, so both must be reported and each can be checked by substituting back.",
    "当常数以平方形式出现时，令两段在分段点处相等，会得到关于这个常数的二次方程。两个根都能使两段相接，所以都要写出，并且可以分别代回检验。",
  ],
  (rng) => {
    const c = rng.pick([1, 2, 3, -1, -2]);
    const r1 = nz(rng, 6);
    const r2 = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].filter((x) => x !== r1 && x !== -r1));
    const s = r1 + r2;
    const right = rng.int(-6, 6);
    const p = c * r1 * r2 + right;
    const f = `\\begin{cases} ${poly([1, "k^{2}x"], [p, ""])} & x < ${c} \\\\ ${poly([s, "kx"], [right, ""])} & x \\ge ${c} \\end{cases}`;
    const eq = `${poly([c, "k^{2}"], [-c * s, "k"], [c * r1 * r2, ""])} = 0`;
    return solutionsProblem({
      prompt: t(
        `Let $f(x) = ${f}$. Find every value of $k$ that makes $f$ continuous everywhere.`,
        `设 $f(x) = ${f}$。求使 $f$ 处处连续的所有 $k$ 值。`,
      ),
      variable: "k",
      values: [String(r1), String(r2)],
      wrong: [[String(r1)], [String(r2)], [String(-r1), String(-r2)]],
      solution: t(
        `Both pieces are continuous, so only $x = ${c}$ matters. Setting the pieces equal there gives $${eq}$, so $k = ${r1}$ or $k = ${r2}$.`,
        `两段各自连续，所以只需考虑 $x = ${c}$。令两段在此相等，得 $${eq}$，所以 $k = ${r1}$ 或 $k = ${r2}$。`,
      ),
    });
  },
);

const constantFromHole = point(
  "the-constant-from-the-location-of-a-hole",
  ["The constant from the location of a hole", "由洞的位置求常数"],
  [
    "A hole at $x = a$ means that $x - a$ is a factor of the numerator and cancels. If the quotient simplifies to $x + e$, the height of the hole is $a + e$, and multiplying $(x - a)(x + e)$ back out recovers the numerator.",
    "在 $x = a$ 处有洞，说明 $x - a$ 是分子的因式并被约去。如果商化简为 $x + e$，洞的高度就是 $a + e$，把 $(x - a)(x + e)$ 展开就得到分子。",
  ],
  (rng) => {
    const a = nz(rng, 6);
    const h = rng.int(-8, 8);
    const e = h - a;
    const k = e - a;
    const m = -a * e;
    const askK = rng.bool();
    return ask(
      askK
        ? [
            `The graph of $f(x) = \\frac{x^{2} + kx${tail(m)}}{${minus(a)}}$ has a hole at $(${a}, ${h})$. Find $k$.`,
            `$f(x) = \\frac{x^{2} + kx${tail(m)}}{${minus(a)}}$ 的图像在 $(${a}, ${h})$ 处有洞。求 $k$。`,
          ]
        : [
            `The graph of $f(x) = \\frac{${poly([1, "x^{2}"], [k, "x"])} + m}{${minus(a)}}$ has a hole at $(${a}, ${h})$. Find $m$.`,
            `$f(x) = \\frac{${poly([1, "x^{2}"], [k, "x"])} + m}{${minus(a)}}$ 的图像在 $(${a}, ${h})$ 处有洞。求 $m$。`,
          ],
      askK ? k : m,
      askK ? [h, h + 2 * a, -k] : [-m, h, a * h],
      [
        `The numerator must be $(${minus(a)})(x + e)$, and after cancelling, the height is $${a} + e = ${h}$, so $e = ${e}$. Expanding gives $${poly([1, "x^{2}"], [k, "x"], [m, ""])}$, so ${askK ? `$k = ${k}$` : `$m = ${m}$`}.`,
        `分子必为 $(${minus(a)})(x + e)$，约分后高度是 $${a} + e = ${h}$，所以 $e = ${e}$。展开得 $${poly([1, "x^{2}"], [k, "x"], [m, ""])}$，所以${askK ? `$k = ${k}$` : `$m = ${m}$`}。`,
      ],
    );
  },
);

const countingAsymptotes = point(
  "counting-vertical-asymptotes-after-cancelling",
  ["Counting vertical asymptotes after cancelling", "约分后数垂直渐近线"],
  [
    "A zero of the denominator gives a vertical asymptote only if a factor of it survives cancelling. Compare the power of each factor on top and bottom: more on the bottom gives an asymptote, otherwise the point is a hole.",
    "分母的零点只有在对应因式约分后仍然留在分母时，才给出垂直渐近线。比较每个因式在分子和分母中的次数：分母次数更高就是渐近线，否则那一点是洞。",
  ],
  (rng) => {
    const roots = rng.sample([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6], 3);
    const bottom = roots.map(() => rng.int(1, 2));
    const top = roots.map(() => rng.int(0, 2));
    const answer = rootsCount(top, bottom);
    const f = `\\frac{${factors(roots, top)}}{${factors(roots, bottom)}}`;
    const lines = roots.map((r, i) => `$x = ${r}$: ${top[i]} / ${bottom[i]}`).join("; ");
    const linesZh = roots.map((r, i) => `$x = ${r}$：${top[i]} / ${bottom[i]}`).join("；");
    return ask(
      [`How many vertical asymptotes does the graph of $f(x) = ${f}$ have?`, `$f(x) = ${f}$ 的图像有多少条垂直渐近线？`],
      answer,
      [3, 0, 1, 2],
      [
        `Compare the powers, top over bottom: ${lines}. An asymptote occurs where the bottom power is larger, which happens $${answer}$ times.`,
        `比较次数（分子次数 / 分母次数）：${linesZh}。分母次数更大的地方才有渐近线，这样的点有 $${answer}$ 个。`,
      ],
    );
  },
);

const continuityOfLogOverLinear = point(
  "continuity-of-a-quotient-with-a-logarithm-or-root",
  ["Continuity of a quotient with a logarithm or root", "含对数或根式的商的连续性"],
  [
    "An elementary function is continuous wherever it is defined, so combine the conditions: the argument of a logarithm is positive, the inside of a square root is nonnegative, and the denominator is not zero. A zero of the denominator outside the other condition removes nothing.",
    "初等函数在其定义的地方都连续，所以把各条件合起来：对数的真数为正，平方根下非负，分母不为零。如果分母的零点不满足其他条件，那它并不会再去掉什么。",
  ],
  (rng) => {
    const a = rng.int(-5, 5);
    const b = rng.pick([-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].filter((x) => x !== a));
    const log = rng.bool();
    const top = log ? `\\ln(${minus(a)})` : `\\sqrt{${minus(a)}}`;
    const f = `\\frac{${top}}{${minus(b)}}`;
    const start = (closed: boolean) => ({ lo: Q.of(a), loClosed: closed, hiClosed: false });
    const closed = !log;
    const inside = b > a;
    const set = inside
      ? union({ lo: Q.of(a), hi: Q.of(b), loClosed: closed, hiClosed: false }, { lo: Q.of(b), loClosed: false, hiClosed: false })
      : union(start(closed));
    return intervalProblem({
      prompt: t(`On what set is $f(x) = ${f}$ continuous? Answer in interval notation.`, `$f(x) = ${f}$ 在什么集合上连续？用区间表示。`),
      form: "interval",
      set,
      wrong: [
        union(start(!closed)),
        union(start(closed)),
        union({ hi: Q.of(b), loClosed: false, hiClosed: false }, { lo: Q.of(b), loClosed: false, hiClosed: false }),
      ],
      solution: t(
        `The numerator needs $x ${log ? ">" : "\\ge"} ${a}$ and the denominator needs $x \\ne ${b}$. ${inside ? `The point $${b}$ lies in that range, so it is removed.` : `The point $${b}$ lies outside that range, so it removes nothing.`}`,
        `分子要求 $x ${log ? ">" : "\\ge"} ${a}$，分母要求 $x \\ne ${b}$。${inside ? `$${b}$ 在这个范围内，所以要去掉。` : `$${b}$ 不在这个范围内，所以不用再去掉什么。`}`,
      ),
    });
  },
);

const notEveryGapRemovable = point(
  "not-every-gap-can-be-removed",
  ["Not every gap can be removed", "并非每个缺口都可去"],
  [
    "A quotient undefined at $a$ can be repaired by a value of $f(a)$ only if its limit at $a$ exists. Check the numerator first: if it is zero at $a$, factor and cancel to find the limit; if it is not zero, the graph has a vertical asymptote and no value helps.",
    "在 $a$ 处无定义的商，只有在 $a$ 处极限存在时才能通过规定 $f(a)$ 来修补。先检查分子：若分子在 $a$ 处为零，就因式分解并约分求极限；若不为零，图像有垂直渐近线，取什么值都没有用。",
  ],
  (rng) => {
    const a = nz(rng, 6);
    const e = rng.int(-6, 6);
    const holds = rng.bool();
    const b = e - a;
    const c = holds ? -a * e : -a * e + nz(rng, 5);
    const limit = a + e;
    const f = `\\frac{${poly([1, "x^{2}"], [b, "x"], [c, ""])}}{${minus(a)}}`;
    const at = a * a + b * a + c;
    const no: Pair = [
      `No value works, because the graph has a vertical asymptote at $x = ${a}$`,
      `没有这样的值，因为图像在 $x = ${a}$ 处有垂直渐近线`,
    ];
    const set = (v: number): Pair => [`$f(${a}) = ${v}$`, `$f(${a}) = ${v}$`];
    return choose(
      rng,
      [
        `Let $f(x) = ${f}$ for $x \\ne ${a}$. What value of $f(${a})$ makes $f$ continuous at $x = ${a}$?`,
        `对 $x \\ne ${a}$，设 $f(x) = ${f}$。$f(${a})$ 取什么值时 $f$ 在 $x = ${a}$ 处连续？`,
      ],
      holds ? set(limit) : no,
      holds ? [no, set(e), set(0)] : [set(limit), set(e), set(0)],
      [
        holds
          ? `The numerator is zero at $${a}$ and factors as $(${minus(a)})(${linear(1, e)})$. After cancelling, the limit is $${a} + ${paren(e)} = ${limit}$.`
          : `At $x = ${a}$ the numerator is $${at}$, not zero, while the denominator tends to $0$. The quotient is unbounded near $${a}$, so no value repairs it.`,
        holds
          ? `分子在 $${a}$ 处为零，可分解为 $(${minus(a)})(${linear(1, e)})$。约分后极限是 $${a} + ${paren(e)} = ${limit}$。`
          : `在 $x = ${a}$ 处分子是 $${at}$，不为零，而分母趋于 $0$。商在 $${a}$ 附近无界，所以取什么值都修补不了。`,
      ],
    );
  },
);

const jumpSize = point(
  "the-shift-that-closes-a-jump",
  ["The shift that closes a jump", "消除跳跃所需的平移"],
  [
    "Changing the single value $f(a)$ cannot remove a jump, since the two one-sided limits stay different. To close it, one whole piece must move: adding a constant to the right-hand formula shifts its limit at $a$, and the needed constant is the left limit minus the right limit.",
    "只改变 $f(a)$ 这一个值无法消除跳跃，因为两个单侧极限仍然不同。要消除它，必须移动整段：给右边的表达式加一个常数会平移它在 $a$ 处的极限，所需的常数等于左极限减右极限。",
  ],
  (rng) => {
    const a = rng.int(-4, 4);
    const p = rng.int(1, 3);
    const q = rng.int(-6, 6);
    const r = nz(rng, 5);
    const L = a * a * p + q;
    const R = L + nz(rng, 9);
    const s = R - r * a;
    const answer = L - R;
    const f = `\\begin{cases} ${poly([p, "x^{2}"], [q, ""])} & x < ${a} \\\\ ${linear(r, s)} & x \\ge ${a} \\end{cases}`;
    return ask(
      [
        `Let $f(x) = ${f}$. What constant must be added to the formula for $x \\ge ${a}$ so that $f$ becomes continuous?`,
        `设 $f(x) = ${f}$。给 $x \\ge ${a}$ 时的表达式加上什么常数，才能使 $f$ 连续？`,
      ],
      answer,
      [-answer, L, R],
      [
        `The left limit is $${L}$ and the right limit is $${R}$. The right piece must shift by $${L} - ${paren(R)} = ${answer}$ to meet the left one.`,
        `左极限是 $${L}$，右极限是 $${R}$。右段要变化 $${L} - ${paren(R)} = ${answer}$ 才能与左段相接。`,
      ],
    );
  },
);

const coefficientMakingHole = point(
  "the-coefficient-that-makes-a-discontinuity-removable",
  ["The coefficient that makes a discontinuity removable", "使间断点可去的系数"],
  [
    "A zero of the denominator is removable only when the numerator vanishes there too, since otherwise the quotient blows up. So substitute the point into the numerator, set the result to zero, and solve for the unknown coefficient.",
    "分母的零点只有在分子也为零时才可去，否则商会趋于无穷。所以把该点代入分子，令结果为零，再解出未知系数。",
  ],
  (rng) => {
    const a = nz(rng, 5);
    const b = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].filter((x) => x !== a));
    const m = nz(rng, 12);
    const answer = Q.of(-(a * a + m), a);
    return ask(
      [
        `For which $k$ is the discontinuity of $f(x) = \\frac{x^{2} + kx${tail(m)}}{(${minus(a)})(${minus(b)})}$ at $x = ${a}$ removable?`,
        `$k$ 取何值时，$f(x) = \\frac{x^{2} + kx${tail(m)}}{(${minus(a)})(${minus(b)})}$ 在 $x = ${a}$ 处的间断点可去？`,
      ],
      answer,
      [Q.of(a * a + m, a), Q.of(-m, a), Q.of(-(b * b + m), b), Q.of(-(a * a - m), a)],
      [
        `The numerator must vanish at $x = ${a}$: $${poly([a * a, ""], [a, "k"], [m, ""])} = 0$, so $k = ${answer.toLatex()}$.`,
        `分子必须在 $x = ${a}$ 处为零：$${poly([a * a, ""], [a, "k"], [m, ""])} = 0$，所以 $k = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const hyperbolicSlopeAtZero = point(
  "the-slope-of-a-hyperbolic-combination-at-zero",
  ["The slope of a hyperbolic combination at zero", "双曲函数组合在零处的斜率"],
  [
    "At $x = 0$, $\\sinh 0 = 0$, $\\cosh 0 = \\operatorname{sech} 0 = 1$ and $\\tanh 0 = 0$. So the derivatives there are $\\cosh 0 = 1$ for $\\sinh$, $\\operatorname{sech}^{2} 0 = 1$ for $\\tanh$, and $0$ for both $\\cosh$ and $\\operatorname{sech}$, whose graphs have a horizontal tangent at $0$.",
    "在 $x = 0$ 处，$\\sinh 0 = 0$，$\\cosh 0 = \\operatorname{sech} 0 = 1$，$\\tanh 0 = 0$。所以此处 $\\sinh$ 的导数是 $\\cosh 0 = 1$，$\\tanh$ 的导数是 $\\operatorname{sech}^{2} 0 = 1$，而 $\\cosh$ 和 $\\operatorname{sech}$ 的导数都是 $0$，它们的图像在 $0$ 处有水平切线。",
  ],
  (rng) => {
    const a = nz(rng, 9);
    const b = nz(rng, 9);
    const c = nz(rng, 9);
    const d = nz(rng, 9);
    const f = poly([a, "\\operatorname{sech} x"], [b, "\\tanh x"], [c, "\\sinh x"], [d, "\\cosh x"]);
    const answer = b + c;
    return ask(
      [`Let $f(x) = ${f}$. Find $f'(0)$.`, `设 $f(x) = ${f}$。求 $f'(0)$。`],
      answer,
      [a + d, a + b + c + d, b + c - a, b - c],
      [
        `$f'(x) = ${poly([-a, "\\operatorname{sech} x\\tanh x"], [b, "\\operatorname{sech}^{2}x"], [c, "\\cosh x"], [d, "\\sinh x"])}$. At $0$, the first and last terms vanish, which leaves $${paren(b)} + ${paren(c)} = ${answer}$.`,
        `$f'(x) = ${poly([-a, "\\operatorname{sech} x\\tanh x"], [b, "\\operatorname{sech}^{2}x"], [c, "\\cosh x"], [d, "\\sinh x"])}$。在 $0$ 处第一项和最后一项为零，剩下 $${paren(b)} + ${paren(c)} = ${answer}$。`,
      ],
    );
  },
);

const quotientFromSegment = point(
  "derivatives-of-quotients-from-a-segment",
  ["Derivatives of quotients from a segment", "由线段求商的导数"],
  [
    "On a line segment the slope gives $f'$, and the point on the segment gives $f$. Those two values go into the quotient rule, $\\left(\\frac{f}{g}\\right)' = \\frac{f'g - fg'}{g^{2}}$, where the order in the numerator matters.",
    "在线段上，斜率给出 $f'$，线段上的点给出 $f$。把这两个值代入商法则 $\\left(\\frac{f}{g}\\right)' = \\frac{f'g - fg'}{g^{2}}$，分子的顺序不能颠倒。",
  ],
  (rng) => {
    const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
    const m = nz(rng, 4);
    const v = rng.int(-6, 6);
    const answer = Q.of(m * a - v, a * a);
    return ask(
      [
        `Near $x = ${a}$, the graph of $f$ is the line segment from $(${a - 1}, ${v - m})$ to $(${a + 1}, ${v + m})$. Let $h(x) = \\frac{f(x)}{x}$. Find $h'(${a})$.`,
        `在 $x = ${a}$ 附近，$f$ 的图像是从 $(${a - 1}, ${v - m})$ 到 $(${a + 1}, ${v + m})$ 的线段。设 $h(x) = \\frac{f(x)}{x}$。求 $h'(${a})$。`,
      ],
      answer,
      [Q.of(v - m * a, a * a), Q.of(m, 1), Q.of(m * a + v, a * a)],
      [
        `The slope gives $f'(${a}) = ${m}$ and the midpoint gives $f(${a}) = ${v}$. Then $h'(${a}) = \\frac{${paren(m)} \\cdot ${paren(a)} - ${paren(v)} \\cdot 1}{${paren(a)}^{2}} = ${answer.toLatex()}$.`,
        `斜率给出 $f'(${a}) = ${m}$，中点给出 $f(${a}) = ${v}$。于是 $h'(${a}) = \\frac{${paren(m)} \\cdot ${paren(a)} - ${paren(v)} \\cdot 1}{${paren(a)}^{2}} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const composeFromTable = point(
  "a-composition-of-two-functions-from-a-table",
  ["A composition of two functions from a table", "由表格求两个函数的复合"],
  [
    "For $h(x) = f(g(x))$, $h'(a) = f'(g(a)) \\cdot g'(a)$. The trap is reading $f'$ at $a$: the outer derivative is read at the inner value $g(a)$, which is usually in a different row of the table.",
    "对 $h(x) = f(g(x))$，有 $h'(a) = f'(g(a)) \\cdot g'(a)$。常见的陷阱是读取 $a$ 处的 $f'$：外层导数要在内层的值 $g(a)$ 处读取，它通常在表格的另一行。",
  ],
  (rng) => {
    const a = rng.int(0, 3);
    const inner = rng.pick([0, 1, 2, 3, 4, 5].filter((x) => x !== a));
    const fpa = nz(rng, 6);
    const fpi = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].filter((x) => x !== fpa));
    const gpa = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
    const gi = rng.int(-5, 5);
    const gpi = nz(rng, 5);
    const fa = rng.int(-5, 5);
    const fi = rng.int(-5, 5);
    const answer = fpi * gpa;
    const swap = rng.bool();
    const rows = swap ? [inner, a] : [a, inner];
    const rowOf = (x: number) =>
      x === a ? `| $${x}$ | $${fa}$ | $${fpa}$ | $${inner}$ | $${gpa}$ |` : `| $${x}$ | $${fi}$ | $${fpi}$ | $${gi}$ | $${gpi}$ |`;
    const table = `| $x$ | $f(x)$ | $f'(x)$ | $g(x)$ | $g'(x)$ |\n| :---: | :---: | :---: | :---: | :---: |\n${rows.map(rowOf).join("\n")}`;
    return ask(
      [
        `The table gives values of $f$, $g$ and their derivatives.\n\n${table}\n\nLet $h(x) = f(g(x))$. Find $h'(${a})$.`,
        `表中给出 $f$、$g$ 及其导数的值。\n\n${table}\n\n设 $h(x) = f(g(x))$。求 $h'(${a})$。`,
      ],
      answer,
      [fpa * gpa, fpi, fpi * gi, fi * gpa],
      [
        `$g(${a}) = ${inner}$, so the outer derivative is read at $${inner}$: $h'(${a}) = f'(${inner}) \\cdot g'(${a}) = ${paren(fpi)} \\cdot ${paren(gpa)} = ${answer}$.`,
        `$g(${a}) = ${inner}$，所以外层导数在 $${inner}$ 处读取：$h'(${a}) = f'(${inner}) \\cdot g'(${a}) = ${paren(fpi)} \\cdot ${paren(gpa)} = ${answer}$。`,
      ],
    );
  },
);

const inverseReciprocalTrigInner = point(
  "inverse-reciprocal-trigonometric-functions-of-a-multiple-of-x",
  ["Inverse reciprocal functions of a multiple of $x$", "$x$ 的倍数的反倒数三角函数"],
  [
    "With the chain rule, the inner $k$ multiplies the outer derivative. For $\\operatorname{arcsec}(kx)$ with $x > 0$ it cancels against the $k$ in front of the root: $\\frac{k}{kx\\sqrt{k^{2}x^{2} - 1}} = \\frac{1}{x\\sqrt{k^{2}x^{2} - 1}}$. For $\\operatorname{arccot}(kx)$ it stays: $-\\frac{k}{1 + k^{2}x^{2}}$.",
    "用链式法则时，内层的 $k$ 要乘到外层导数上。对 $x > 0$ 时的 $\\operatorname{arcsec}(kx)$，它与根号前的 $k$ 约去：$\\frac{k}{kx\\sqrt{k^{2}x^{2} - 1}} = \\frac{1}{x\\sqrt{k^{2}x^{2} - 1}}$。对 $\\operatorname{arccot}(kx)$，它留在分子：$-\\frac{k}{1 + k^{2}x^{2}}$。",
  ],
  (rng) => {
    const k = rng.int(2, 4);
    const c = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9, -1, -2, -3]);
    const kind = rng.pick(["arcsec", "arccsc", "arccot"] as const);
    const sign = kind === "arcsec" ? c : -c;
    const root = `\\sqrt{${k * k}x^{2} - 1}`;
    const answer = kind === "arccot" ? `\\frac{${-c * k}}{1 + ${k * k}x^{2}}` : `\\frac{${sign}}{x${root}}`;
    const f = poly([c, `\\operatorname{${kind}}(${k}x)`]);
    const wrong =
      kind === "arccot"
        ? [`\\frac{${-c}}{1 + ${k * k}x^{2}}`, `\\frac{${c * k}}{1 + ${k * k}x^{2}}`, `\\frac{${-c * k}}{1 + ${k}x^{2}}`]
        : [`\\frac{${sign * k}}{x${root}}`, `\\frac{${-sign}}{x${root}}`, `\\frac{${sign}}{x\\sqrt{${k}x^{2} - 1}}`];
    return functionProblem({
      prompt: t(
        `Find $f'(x)$ for $f(x) = ${f}$, with $x > ${Q.of(1, k).toLatex()}$.`,
        `设 $f(x) = ${f}$，其中 $x > ${Q.of(1, k).toLatex()}$。求 $f'(x)$。`,
      ),
      answer,
      positive: true,
      prefix: "f'(x) =",
      wrong,
      solution: t(
        kind === "arccot"
          ? `The chain rule gives $${c} \\cdot \\frac{-1}{1 + (${k}x)^{2}} \\cdot ${k} = ${answer}$.`
          : `The chain rule gives $${c} \\cdot \\frac{${kind === "arcsec" ? 1 : -1}}{${k}x\\sqrt{(${k}x)^{2} - 1}} \\cdot ${k}$. The factor $${k}$ cancels, which leaves $${answer}$.`,
        kind === "arccot"
          ? `由链式法则得 $${c} \\cdot \\frac{-1}{1 + (${k}x)^{2}} \\cdot ${k} = ${answer}$。`
          : `由链式法则得 $${c} \\cdot \\frac{${kind === "arcsec" ? 1 : -1}}{${k}x\\sqrt{(${k}x)^{2} - 1}} \\cdot ${k}$。因子 $${k}$ 约去，剩下 $${answer}$。`,
      ),
    });
  },
);

const inverseHyperbolicValues = point(
  "exact-values-of-inverse-hyperbolic-derivatives",
  ["Exact values of inverse hyperbolic derivatives", "反双曲函数导数的精确值"],
  [
    "The three formulas look alike, so the signs inside must be kept apart: $\\operatorname{arsinh}'(x) = \\frac{1}{\\sqrt{x^{2} + 1}}$, $\\operatorname{arcosh}'(x) = \\frac{1}{\\sqrt{x^{2} - 1}}$ for $x > 1$, and $\\operatorname{artanh}'(x) = \\frac{1}{1 - x^{2}}$ for $|x| < 1$. Fractions from Pythagorean triples give exact values.",
    "三个公式很相似，要分清其中的符号：$\\operatorname{arsinh}'(x) = \\frac{1}{\\sqrt{x^{2} + 1}}$；$x > 1$ 时 $\\operatorname{arcosh}'(x) = \\frac{1}{\\sqrt{x^{2} - 1}}$；$|x| < 1$ 时 $\\operatorname{artanh}'(x) = \\frac{1}{1 - x^{2}}$。由勾股数构成的分数能给出精确值。",
  ],
  (rng) => {
    const [p, q, h] = rng.pick([
      [3, 4, 5],
      [4, 3, 5],
      [5, 12, 13],
      [12, 5, 13],
      [8, 15, 17],
      [15, 8, 17],
      [7, 24, 25],
    ] as const);
    const c = nz(rng, 6);
    const kind = rng.pick(["arsinh", "arcosh", "artanh"] as const);
    const x = kind === "arsinh" ? Q.of(p, q) : kind === "arcosh" ? Q.of(h, q) : Q.of(p, h);
    const x2 = x.mul(x);
    const root = kind === "arsinh" ? Q.of(h, q) : kind === "arcosh" ? Q.of(p, q) : undefined;
    const value = root ? Q.one.div(root) : Q.one.div(Q.one.sub(x2));
    const answer = value.mul(Q.of(c));
    const other = kind === "arsinh" ? Q.one.div(Q.one.add(x2)) : kind === "arcosh" ? Q.one.div(x2.sub(Q.one)) : Q.one.div(Q.one.add(x2));
    const v = x.toLatex();
    const formula =
      kind === "arsinh"
        ? `\\frac{1}{\\sqrt{${v}^{2} + 1}}`
        : kind === "arcosh"
          ? `\\frac{1}{\\sqrt{${v}^{2} - 1}}`
          : `\\frac{1}{1 - ${v}^{2}}`;
    const display = formula.replace(`${v}^{2}`, `\\left(${v}\\right)^{2}`);
    return ask(
      [
        `Let $f(x) = ${poly([c, `\\operatorname{${kind}} x`])}$. Find $f'\\left(${v}\\right)$.`,
        `设 $f(x) = ${poly([c, `\\operatorname{${kind}} x`])}$。求 $f'\\left(${v}\\right)$。`,
      ],
      answer,
      [other.mul(Q.of(c)), value, answer.neg(), Q.one.div(x).mul(Q.of(c))],
      [
        `$\\operatorname{${kind}}'\\left(${v}\\right) = ${display} = ${value.toLatex()}$, and multiplying by $${c}$ gives $${answer.toLatex()}$.`,
        `$\\operatorname{${kind}}'\\left(${v}\\right) = ${display} = ${value.toLatex()}$，乘以 $${c}$ 得 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const reciprocalHyperbolicInner = point(
  "inverse-reciprocal-hyperbolic-functions-of-a-scaled-variable",
  ["Inverse reciprocal hyperbolic functions of a scaled variable", "缩放变量的反倒数双曲函数"],
  [
    "With the chain rule, a scale inside changes the result. For $x > 0$: $\\frac{d}{dx}\\operatorname{arcsch}(kx) = -\\frac{1}{x\\sqrt{1 + k^{2}x^{2}}}$, since the $k$ cancels, while $\\frac{d}{dx}\\operatorname{arcoth}(kx) = \\frac{k}{1 - k^{2}x^{2}}$ keeps it. Similarly $\\frac{d}{dx}\\operatorname{arsech}\\frac{x}{k} = -\\frac{k}{x\\sqrt{k^{2} - x^{2}}}$.",
    "用链式法则时，内部的缩放会改变结果。对 $x > 0$：$\\frac{d}{dx}\\operatorname{arcsch}(kx) = -\\frac{1}{x\\sqrt{1 + k^{2}x^{2}}}$，因为 $k$ 约去了；而 $\\frac{d}{dx}\\operatorname{arcoth}(kx) = \\frac{k}{1 - k^{2}x^{2}}$ 保留 $k$。类似地，$\\frac{d}{dx}\\operatorname{arsech}\\frac{x}{k} = -\\frac{k}{x\\sqrt{k^{2} - x^{2}}}$。",
  ],
  (rng) => {
    const kind = rng.pick(["arsech", "arcsch", "arcoth"] as const);
    const c = rng.pick([1, 2, 3, 4, 5, 6, 7, -1, -2, -3, -4]);
    const k = kind === "arsech" ? rng.int(4, 7) : rng.int(2, 6);
    const inner = kind === "arsech" ? `\\frac{x}{${k}}` : `${k}x`;
    const f = poly([c, `\\operatorname{${kind}}\\left(${inner}\\right)`]);
    const answer =
      kind === "arsech"
        ? `\\frac{${-c * k}}{x\\sqrt{${k * k} - x^{2}}}`
        : kind === "arcsch"
          ? `\\frac{${-c}}{x\\sqrt{1 + ${k * k}x^{2}}}`
          : `\\frac{${c * k}}{1 - ${k * k}x^{2}}`;
    const wrong =
      kind === "arsech"
        ? [`\\frac{${c * k}}{x\\sqrt{${k * k} - x^{2}}}`, `\\frac{${-c}}{x\\sqrt{${k * k} - x^{2}}}`]
        : kind === "arcsch"
          ? [`\\frac{${c}}{x\\sqrt{1 + ${k * k}x^{2}}}`, `\\frac{${-c * k}}{x\\sqrt{1 + ${k * k}x^{2}}}`]
          : [`\\frac{${c}}{1 - ${k * k}x^{2}}`, `\\frac{${c * k}}{${k * k}x^{2} + 1}`];
    const range = kind === "arsech" ? `0 < x < ${k}` : kind === "arcsch" ? "x > 0" : `x > ${Q.of(1, k).toLatex()}`;
    return functionProblem({
      prompt: t(`Find $f'(x)$ for $f(x) = ${f}$, with $${range}$.`, `设 $f(x) = ${f}$，其中 $${range}$。求 $f'(x)$。`),
      answer,
      positive: true,
      prefix: "f'(x) =",
      wrong,
      solution: t(
        `Apply the formula for $\\operatorname{${kind}}$ at $u = ${inner}$ and multiply by $u' = ${kind === "arsech" ? `\\frac{1}{${k}}` : k}$. Simplifying gives $${answer}$.`,
        `把 $\\operatorname{${kind}}$ 的公式用于 $u = ${inner}$，再乘以 $u' = ${kind === "arsech" ? `\\frac{1}{${k}}` : k}$。化简得 $${answer}$。`,
      ),
    });
  },
);

/** rateContexts are quantities with units, for estimating from a derivative. */
const rateContexts: readonly { en: string; zh: string; unit: string; unitZh: string; time: string; timeZh: string; falls: boolean }[] = [
  {
    en: "$V(t)$ is the volume of water in a tank",
    zh: "$V(t)$ 是水箱中水的体积",
    unit: "liters",
    unitZh: "升",
    time: "minutes",
    timeZh: "分钟",
    falls: true,
  },
  {
    en: "$P(t)$ is the population of a town",
    zh: "$P(t)$ 是一个城镇的人口",
    unit: "people",
    unitZh: "人",
    time: "years",
    timeZh: "年",
    falls: true,
  },
  {
    en: "$D(t)$ is the distance a train has traveled",
    zh: "$D(t)$ 是火车行驶的路程",
    unit: "kilometers",
    unitZh: "千米",
    time: "hours",
    timeZh: "小时",
    falls: false,
  },
  {
    en: "$S(t)$ is the number of songs a service has sold",
    zh: "$S(t)$ 是一个平台售出的歌曲数",
    unit: "songs",
    unitZh: "首",
    time: "days",
    timeZh: "天",
    falls: false,
  },
];

const estimateFromDerivative = point(
  "estimating-a-later-value-from-the-derivative",
  ["Estimating a later value from the derivative", "用导数估计之后的值"],
  [
    "A derivative value is a rate, so over a short time it predicts the change: the change in $f$ is about $f'(a) \\cdot h$. To estimate the value at $a + h$, add that change to $f(a)$. The result is an estimate, because the rate may not stay constant.",
    "导数值是变化率，所以在短时间内可以预测变化量：$f$ 的变化约为 $f'(a) \\cdot h$。要估计 $a + h$ 处的值，把这个变化量加到 $f(a)$ 上。结果只是估计值，因为变化率不一定保持不变。",
  ],
  (rng) => {
    const c = rng.pick(rateContexts);
    const a = rng.int(2, 12);
    const v = rng.int(20, 90) * 10;
    const r = c.falls ? nz(rng, 25) : rng.int(2, 25);
    const h = rng.int(2, 5);
    const name = c.en.charAt(1);
    const answer = v + r * h;
    return ask(
      [
        `${c.en}, in ${c.unit}, $t$ ${c.time} after a measurement starts. If $${name}(${a}) = ${v}$ and $${name}'(${a}) = ${r}$, estimate $${name}(${a + h})$.`,
        `${c.zh}（单位：${c.unitZh}），$t$ 是测量开始后的${c.timeZh}数。已知 $${name}(${a}) = ${v}$，$${name}'(${a}) = ${r}$。估计 $${name}(${a + h})$。`,
      ],
      answer,
      [v + r, v - r * h, r * h, v + r * a],
      [
        `The change over $${h}$ ${c.time} is about $${paren(r)} \\cdot ${h} = ${r * h}$, so the value is about $${v} + ${paren(r * h)} = ${answer}$.`,
        `$${h}$ ${c.timeZh}内的变化约为 $${paren(r)} \\cdot ${h} = ${r * h}$，所以函数值约为 $${v} + ${paren(r * h)} = ${answer}$。`,
      ],
    );
  },
);

const whenRateReachesValue = point(
  "when-a-rate-reaches-a-given-value",
  ["When a rate reaches a given value", "变化率何时达到给定值"],
  [
    "The reverse question gives the rate and asks for the time or quantity. Differentiate the model, set the derivative equal to the given rate, and solve. The value of the model itself is not used, and the constant term plays no part.",
    "反过来的问题是给出变化率，求时间或数量。对模型求导，令导数等于给定的变化率，然后求解。这里用不到模型本身的值，常数项也不起作用。",
  ],
  (rng) => {
    if (rng.bool()) {
      const v = rng.int(20, 60);
      const c = rng.int(1, 40);
      const w = rng.pick([-1, 1]) * rng.int(1, 3) * 5;
      const answer = Q.of(v - w, 10);
      return ask(
        [
          `A ball's height after $t$ seconds is $h(t) = ${poly([-5, "t^{2}"], [v, "t"], [c, ""])}$ meters. At what time is its velocity $${w}$ m/s?`,
          `一个球 $t$ 秒后的高度是 $h(t) = ${poly([-5, "t^{2}"], [v, "t"], [c, ""])}$ 米。什么时候它的速度是 $${w}$ 米/秒？`,
        ],
        answer,
        [Q.of(v + w, 10), Q.of(v - w, 5), Q.of(v, 10)],
        [
          `$h'(t) = ${poly([-10, "t"], [v, ""])}$. Setting this equal to $${w}$ gives $t = \\frac{${v} - ${paren(w)}}{10} = ${answer.toLatex()}$.`,
          `$h'(t) = ${poly([-10, "t"], [v, ""])}$。令它等于 $${w}$，得 $t = \\frac{${v} - ${paren(w)}}{10} = ${answer.toLatex()}$。`,
        ],
      );
    }
    const a = rng.int(1, 5);
    const b = rng.int(2, 30);
    const c = rng.int(50, 900);
    const q = rng.int(5, 40);
    const m = 2 * a * q + b;
    return ask(
      [
        `The cost of producing $q$ items is $C(q) = ${poly([a, "q^{2}"], [b, "q"], [c, ""])}$ dollars. At what output is the marginal cost $${m}$ dollars per item?`,
        `生产 $q$ 件产品的成本是 $C(q) = ${poly([a, "q^{2}"], [b, "q"], [c, ""])}$ 美元。产量为多少时边际成本是每件 $${m}$ 美元？`,
      ],
      q,
      [Q.of(m, 2 * a), Q.of(m - b, a), Q.of(m + b, 2 * a)],
      [
        `$C'(q) = ${poly([2 * a, "q"], [b, ""])}$. Setting this equal to $${m}$ gives $${2 * a}q = ${m - b}$, so $q = ${q}$.`,
        `$C'(q) = ${poly([2 * a, "q"], [b, ""])}$。令它等于 $${m}$，得 $${2 * a}q = ${m - b}$，所以 $q = ${q}$。`,
      ],
    );
  },
);

const forwardError = point(
  "the-exact-error-of-a-forward-difference",
  ["The exact error of a forward difference", "前向差商的精确误差"],
  [
    "For a quadratic $f(x) = Ax^{2} + Bx + C$, the forward difference quotient is exactly $f'(a) + Ah$. So its error is $Ah$: it does not depend on $a$, it shrinks in proportion to $h$, and its sign shows that a concave-up function is overestimated.",
    "对二次函数 $f(x) = Ax^{2} + Bx + C$，前向差商恰好等于 $f'(a) + Ah$。所以误差是 $Ah$：它与 $a$ 无关，与 $h$ 成比例地缩小，它的符号说明上凹函数的导数被高估。",
  ],
  (rng) => {
    const A = nz(rng, 6);
    const B = rng.int(-6, 6);
    const C = rng.int(-6, 6);
    const a = rng.int(-4, 4);
    const h = rng.pick([Q.of(1, 2), Q.of(1, 4), Q.of(1, 5), Q.of(1, 10)]);
    const answer = h.mul(Q.of(A));
    return ask(
      [
        `Let $f(x) = ${poly([A, "x^{2}"], [B, "x"], [C, ""])}$. By how much does the forward difference quotient at $a = ${a}$ with $h = ${h.toLatex()}$ exceed the true value of $f'(${a})$? (The answer is negative if the estimate is too low.)`,
        `设 $f(x) = ${poly([A, "x^{2}"], [B, "x"], [C, ""])}$。在 $a = ${a}$ 处取 $h = ${h.toLatex()}$ 的前向差商比 $f'(${a})$ 的真实值大多少？（估计值偏低时答案为负。）`,
      ],
      answer,
      [answer.neg(), answer.mul(Q.of(2)), h, Q.of(2 * A * a + B)],
      [
        `$\\frac{f(a + h) - f(a)}{h} = 2Aa + B + Ah$, while $f'(a) = 2Aa + B$. The difference is $Ah = ${paren(A)} \\cdot ${h.toLatex()} = ${answer.toLatex()}$.`,
        `$\\frac{f(a + h) - f(a)}{h} = 2Aa + B + Ah$，而 $f'(a) = 2Aa + B$。二者之差是 $Ah = ${paren(A)} \\cdot ${h.toLatex()} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const centralFromBoth = point(
  "averaging-backward-and-forward-estimates",
  ["Averaging backward and forward estimates", "对后向和前向估计取平均"],
  [
    "The average of the backward and forward quotients at $a$ is the central difference quotient, $\\frac{f(a + h) - f(a - h)}{2h}$, in which the value $f(a)$ cancels. It is usually a much better estimate than either one alone. Note the $2h$ in the denominator.",
    "$a$ 处后向差商和前向差商的平均就是中心差商 $\\frac{f(a + h) - f(a - h)}{2h}$，其中 $f(a)$ 被抵消了。它通常比两者中任何一个都准确得多。注意分母是 $2h$。",
  ],
  (rng) => {
    const h = rng.pick([1, 2]);
    const a = rng.int(2, 6) * h;
    const vm = rng.int(-20, 20);
    const v0 = vm + rng.int(-9, 9);
    const vp = v0 + rng.int(-9, 12);
    const xs = [a - h, a, a + h];
    const table = `| $x$ | ${xs.map((x) => `$${x}$`).join(" | ")} |\n| :---: | :---: | :---: | :---: |\n| $f(x)$ | $${vm}$ | $${v0}$ | $${vp}$ |`;
    const answer = Q.of(vp - vm, 2 * h);
    return ask(
      [
        `The table gives values of a differentiable function $f$.\n\n${table}\n\nFind the average of the backward and forward difference estimates of $f'(${a})$, using $h = ${h}$.`,
        `表中给出可导函数 $f$ 的值。\n\n${table}\n\n取 $h = ${h}$，求 $f'(${a})$ 的后向差商估计与前向差商估计的平均值。`,
      ],
      answer,
      [Q.of(vp - vm, h), Q.of(v0 - vm, h), Q.of(vp - v0, h), Q.of(vp + vm, 2 * h)],
      [
        `Backward: $\\frac{${paren(v0)} - ${paren(vm)}}{${h}}$; forward: $\\frac{${paren(vp)} - ${paren(v0)}}{${h}}$. Their average is $\\frac{${paren(vp)} - ${paren(vm)}}{${2 * h}} = ${answer.toLatex()}$, where the middle value cancels.`,
        `后向：$\\frac{${paren(v0)} - ${paren(vm)}}{${h}}$；前向：$\\frac{${paren(vp)} - ${paren(v0)}}{${h}}$。它们的平均值是 $\\frac{${paren(vp)} - ${paren(vm)}}{${2 * h}} = ${answer.toLatex()}$，中间的值被抵消了。`,
      ],
    );
  },
);

const whereRatesCompare = point(
  "where-one-rate-is-a-multiple-of-the-other",
  ["Where one rate is a multiple of the other", "一个变化率是另一个的倍数之处"],
  [
    "The chain rule says $\\frac{dy}{dt} = f'(x)\\frac{dx}{dt}$, so the ratio of the two rates is $f'(x)$. To find where $y$ changes $k$ times as fast as $x$, solve $f'(x) = k$. The actual speed of $x$ does not matter.",
    "链式法则给出 $\\frac{dy}{dt} = f'(x)\\frac{dx}{dt}$，所以两个变化率之比就是 $f'(x)$。要找 $y$ 的变化率是 $x$ 的 $k$ 倍的位置，只需解 $f'(x) = k$。$x$ 的实际变化速度无关紧要。",
  ],
  (rng) => {
    const a = nz(rng, 5);
    const b = rng.int(-9, 9);
    const c = rng.int(-9, 9);
    const k = rng.pick([-12, -8, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 8, 12]);
    const answer = Q.of(k - b, 2 * a);
    return ask(
      [
        `$x$ and $y$ are functions of $t$ with $y = ${poly([a, "x^{2}"], [b, "x"], [c, ""])}$, and $\\frac{dx}{dt} \\ne 0$. For which $x$ is $\\frac{dy}{dt} = ${k}\\frac{dx}{dt}$?`,
        `$x$ 和 $y$ 都是 $t$ 的函数，$y = ${poly([a, "x^{2}"], [b, "x"], [c, ""])}$，且 $\\frac{dx}{dt} \\ne 0$。$x$ 为何值时 $\\frac{dy}{dt} = ${k}\\frac{dx}{dt}$？`,
      ],
      answer,
      [Q.of(k + b, 2 * a), Q.of(k - b, a), Q.of(k, 2 * a), Q.of(b - k, 2 * a)],
      [
        `$\\frac{dy}{dt} = (${linear(2 * a, b)})\\frac{dx}{dt}$. Cancelling $\\frac{dx}{dt}$ gives $${linear(2 * a, b)} = ${k}$, so $x = ${answer.toLatex()}$.`,
        `$\\frac{dy}{dt} = (${linear(2 * a, b)})\\frac{dx}{dt}$。约去 $\\frac{dx}{dt}$，得 $${linear(2 * a, b)} = ${k}$，所以 $x = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const distanceRate = point(
  "the-rate-of-change-of-the-distance-from-the-origin",
  ["The rate of change of the distance from the origin", "到原点距离的变化率"],
  [
    "If $D$ is the distance from the origin to a moving point, then $D^{2} = x^{2} + y^{2}$. Differentiating implicitly gives $D\\frac{dD}{dt} = x\\frac{dx}{dt} + y\\frac{dy}{dt}$, so the rate depends on the position as well as on the two velocities.",
    "设 $D$ 是从原点到动点的距离，则 $D^{2} = x^{2} + y^{2}$。隐函数求导得 $D\\frac{dD}{dt} = x\\frac{dx}{dt} + y\\frac{dy}{dt}$，所以这个变化率既取决于两个速度，也取决于位置。",
  ],
  (rng) => {
    const [p, q, d] = rng.pick([
      [3, 4, 5],
      [4, 3, 5],
      [5, 12, 13],
      [12, 5, 13],
      [6, 8, 10],
      [8, 6, 10],
      [8, 15, 17],
    ] as const);
    const x = rng.pick([1, -1]) * p;
    const y = rng.pick([1, -1]) * q;
    const u = nz(rng, 9);
    const v = nz(rng, 9);
    const answer = Q.of(x * u + y * v, d);
    return ask(
      [
        `A point moves in the plane. When it is at $(${x}, ${y})$, $\\frac{dx}{dt} = ${u}$ and $\\frac{dy}{dt} = ${v}$. Find the rate of change of its distance $D$ from the origin at that moment.`,
        `一个点在平面上运动。当它位于 $(${x}, ${y})$ 时，$\\frac{dx}{dt} = ${u}$，$\\frac{dy}{dt} = ${v}$。求此刻它到原点的距离 $D$ 的变化率。`,
      ],
      answer,
      [Q.of(x * u + y * v), Q.of(u + v), Q.of(2 * (x * u + y * v), d), Q.of(x * v + y * u, d)],
      [
        `Here $D = ${d}$, and $${d}\\frac{dD}{dt} = ${paren(x)} \\cdot ${paren(u)} + ${paren(y)} \\cdot ${paren(v)} = ${x * u + y * v}$. So $\\frac{dD}{dt} = ${answer.toLatex()}$.`,
        `此时 $D = ${d}$，且 $${d}\\frac{dD}{dt} = ${paren(x)} \\cdot ${paren(u)} + ${paren(y)} \\cdot ${paren(v)} = ${x * u + y * v}$。所以 $\\frac{dD}{dt} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

/** deeperCalculusIThirdPoints maps topics of Calculus I, up to related rates, to a third knowledge point. */
export const deeperCalculusIThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "graphs-of-the-hyperbolic-functions": [levelLineOfHyperbolicGraph],
  "graphs-of-the-reciprocal-hyperbolic-functions": [levelLineOfReciprocalGraph],
  "the-left-and-right-sided-limits-of-a-function": [oneSidedAbsoluteValue],
  "finding-the-existence-of-a-limit-using-one-sided-limits": [limitAcrossTwoFormulas],
  "limits-at-infinity-from-graphs": [crossingAnAsymptote],
  "infinite-limits-from-graphs": [formulaFromInfiniteLimits],
  "limits-of-power-functions-and-the-constant-rule-for-limits": [coefficientFromPowerLimit],
  "limits-of-reciprocal-functions": [twoSidedReciprocal],
  "limits-of-trigonometric-functions": [trigAtMultiplesOfPi],
  "limits-of-reciprocal-trigonometric-functions": [reciprocalTrigFarOut],
  "evaluating-limits-at-infinity-by-comparing-relative-magnitudes-of-functions": [sameBaseExponentials],
  "determining-continuity-from-graphs": [whichConditionFails],
  "left-and-right-continuity": [valueForOneSidedContinuity],
  "further-continuity-of-piecewise-functions": [twoValuesOfK],
  "point-discontinuities": [constantFromHole],
  "discontinuities-due-to-vertical-asymptotes": [countingAsymptotes],
  "continuity-of-functions": [continuityOfLogOverLinear],
  "removing-point-discontinuities": [notEveryGapRemovable],
  "removing-jump-discontinuities": [jumpSize],
  "removing-discontinuities-from-rational-functions": [coefficientMakingHole],
  "differentiating-reciprocal-hyperbolic-functions": [hyperbolicSlopeAtZero],
  "calculating-derivatives-from-graphs": [quotientFromSegment],
  "calculating-derivatives-from-graphs-using-the-chain-rule": [composeFromTable],
  "differentiating-inverse-reciprocal-trigonometric-functions": [inverseReciprocalTrigInner],
  "differentiating-inverse-hyperbolic-functions": [inverseHyperbolicValues],
  "differentiating-inverse-reciprocal-hyperbolic-functions": [reciprocalHyperbolicInner],
  "interpreting-the-meaning-of-the-derivative-in-context": [estimateFromDerivative],
  "rates-of-change-in-applied-contexts": [whenRateReachesValue],
  "estimating-derivatives-using-a-forward-difference-quotient": [forwardError],
  "estimating-derivatives-using-a-backward-difference-quotient": [centralFromBoth],
  "introduction-to-related-rates": [whereRatesCompare],
  "related-rates-with-implicit-functions": [distanceRate],
};
