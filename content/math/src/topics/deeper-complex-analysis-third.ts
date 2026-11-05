// Third knowledge points for thin topics of Complex Analysis: the reverse question or a harder
// case. See `deeperComplexAnalysisThirdPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { poly, Q } from "@ga/subject-math";

import { ask, point } from "../university-kit.ts";

const twoPoles = point(
  "an-integral-around-one-or-two-poles",
  ["An integral around one or two poles", "绕一个或两个极点的积分"],
  [
    "For $\\frac{c}{(z - a)(z - b)}$, only the poles inside the contour contribute, each with residue found by partial fractions. The residues at the two poles are opposites, so a contour enclosing both gives zero, while a contour enclosing just one does not.",
    "对 $\\frac{c}{(z - a)(z - b)}$，只有围道内部的极点才有贡献，每个极点的留数由部分分式求得。两个极点处的留数互为相反数，所以包围两者的围道积分为零，而只包围一个的则不为零。",
  ],
  (rng) => {
    const a = rng.pick([-3, -2, -1, 1, 2, 3]);
    const b = rng.pick([-1, 1]) * (Math.abs(a) + rng.int(2, 4));
    const c = rng.int(1, 9);
    const both = rng.int(1, 3) === 1;
    const R = both ? Math.abs(b) + 1 : Math.abs(a) + 1;
    const one = Q.of(2 * c, a - b);
    const answer = both ? Q.of(0) : one;
    const denominator = `(${poly([1, "z"], [-a, ""])})(${poly([1, "z"], [-b, ""])})`;
    return ask(
      [
        `The integral of $\\frac{${c}}{${denominator}}$ once counterclockwise around $|z| = ${R}$ is $k\\pi i$. What is $k$?`,
        `$\\frac{${c}}{${denominator}}$ 沿 $|z| = ${R}$ 逆时针一周的积分是 $k\\pi i$。$k$ 是多少？`,
      ],
      answer,
      both ? [one, Q.of(2 * c), Q.of(c)] : [one.neg(), Q.of(2 * c), Q.of(c, a - b)],
      both
        ? [
            `Both poles lie inside the circle, and their residues are $${Q.of(c, a - b).toLatex()}$ and $${Q.of(c, b - a).toLatex()}$. These cancel, so $k = 0$.`,
            `两个极点都在圆内，留数分别是 $${Q.of(c, a - b).toLatex()}$ 和 $${Q.of(c, b - a).toLatex()}$。它们相互抵消，所以 $k = 0$。`,
          ]
        : [
            `Only the pole at $z = ${a}$ lies inside the circle, with residue $${Q.of(c, a - b).toLatex()}$. Multiplying by $2$ for $2\\pi i$ gives $k = ${one.toLatex()}$.`,
            `只有 $z = ${a}$ 处的极点在圆内，留数是 $${Q.of(c, a - b).toLatex()}$。由 $2\\pi i$ 再乘以 $2$，得 $k = ${one.toLatex()}$。`,
          ],
    );
  },
);

const annulusCoefficient = point(
  "a-coefficient-in-an-annulus-between-two-poles",
  ["A coefficient in an annulus between two poles", "两极点之间圆环上的系数"],
  [
    "In an annulus between two poles, split the function by partial fractions and expand each piece differently. The pole inside the annulus's inner circle gives negative powers of $z$, and the pole outside the outer circle gives nonnegative powers, so both kinds appear in one series.",
    "在两极点之间的圆环上，用部分分式拆开函数，并对每一部分作不同的展开。在圆环内圆之内的极点给出 $z$ 的负幂，在外圆之外的极点给出非负幂，所以一个级数中同时出现这两类幂。",
  ],
  (rng) => {
    const a = rng.int(1, 4);
    const b = a + rng.int(1, 5);
    const negative = rng.bool();
    const k = rng.int(1, 3);
    const m = rng.int(0, 2);
    const answer = negative ? Q.of(a ** (k - 1), a + b) : Q.of(m % 2 === 0 ? -1 : 1, b ** (m + 1) * (a + b));
    const term = negative ? (k === 1 ? "\\frac{1}{z}" : `\\frac{1}{z^{${k}}}`) : m === 0 ? "z^{0}" : m === 1 ? "z" : `z^{${m}}`;
    return ask(
      [
        `In the Laurent series of $\\frac{1}{(z - ${a})(z + ${b})}$ valid for $${a} < |z| < ${b}$, what is the coefficient of $${term}$?`,
        `在 $\\frac{1}{(z - ${a})(z + ${b})}$ 于 $${a} < |z| < ${b}$ 上的洛朗级数中，$${term}$ 的系数是多少？`,
      ],
      answer,
      [answer.neg(), Q.of(1, a + b).eq(answer) ? Q.of(1, 2 * (a + b)) : Q.of(1, a + b), Q.of(1, a * b)],
      negative
        ? [
            `Partial fractions give $\\frac{1}{${a + b}}\\left(\\frac{1}{z - ${a}} - \\frac{1}{z + ${b}}\\right)$. Negative powers come from $\\frac{1}{z - ${a}} = \\sum_{n \\ge 0} \\frac{${a}^{n}}{z^{n + 1}}$, so the coefficient is $${answer.toLatex()}$.`,
            `部分分式给出 $\\frac{1}{${a + b}}\\left(\\frac{1}{z - ${a}} - \\frac{1}{z + ${b}}\\right)$。负幂来自 $\\frac{1}{z - ${a}} = \\sum_{n \\ge 0} \\frac{${a}^{n}}{z^{n + 1}}$，所以系数是 $${answer.toLatex()}$。`,
          ]
        : [
            `Partial fractions give $\\frac{1}{${a + b}}\\left(\\frac{1}{z - ${a}} - \\frac{1}{z + ${b}}\\right)$. Nonnegative powers come from $\\frac{1}{z + ${b}} = \\sum_{n \\ge 0} \\frac{(-1)^{n} z^{n}}{${b}^{n + 1}}$ with its minus sign, so the coefficient is $${answer.toLatex()}$.`,
            `部分分式给出 $\\frac{1}{${a + b}}\\left(\\frac{1}{z - ${a}} - \\frac{1}{z + ${b}}\\right)$。非负幂来自带负号的 $\\frac{1}{z + ${b}} = \\sum_{n \\ge 0} \\frac{(-1)^{n} z^{n}}{${b}^{n + 1}}$，所以系数是 $${answer.toLatex()}$。`,
          ],
    );
  },
);

const roucheAnnulus = point(
  "counting-zeros-in-an-annulus",
  ["Counting zeros in an annulus", "计算圆环内的零点"],
  [
    "Rouché's theorem counts zeros inside one circle at a time, with a term that dominates on this circle. To count zeros in an annulus, apply it on the outer circle and on the inner circle, usually with different dominating terms, and subtract the two counts.",
    "鲁歇定理一次只计算一个圆内的零点，需要有一项在这个圆上占优。要计算圆环内的零点，就在外圆和内圆上分别应用定理，通常占优的项不同，再把两个个数相减。",
  ],
  (rng) => {
    const n = rng.int(5, 8);
    const m = rng.int(1, n - 2);
    // Both circles must have a strictly dominating term, so a large constant needs room.
    let B = rng.int(1, 2);
    if (Math.floor((2 ** n - B - 1) / 2 ** m) < B + 2) B = 1;
    const A = rng.int(B + 2, Math.floor((2 ** n - B - 1) / 2 ** m));
    const f = poly([1, `z^{${n}}`], [A, m === 1 ? "z" : `z^{${m}}`], [B, ""]);
    const answer = n - m;
    const outer = A * 2 ** m + B;
    return ask(
      [
        `How many zeros of $${f}$, counted with multiplicity, lie in the annulus $1 < |z| < 2$?`,
        `$${f}$ 在圆环 $1 < |z| < 2$ 内有多少个零点（计重数）？`,
      ],
      answer,
      [n, m, 0],
      [
        `On $|z| = 2$ the leading term has size $${2 ** n}$, more than $${outer}$ from the rest, so $${n}$ zeros lie inside. On $|z| = 1$ the middle term has size $${A}$, more than $${B + 1}$, so $${m}$ zeros lie inside. The difference is $${answer}$.`,
        `在 $|z| = 2$ 上，首项的大小是 $${2 ** n}$，大于其余项的 $${outer}$，所以圆内有 $${n}$ 个零点。在 $|z| = 1$ 上，中间项的大小是 $${A}$，大于 $${B + 1}$，所以圆内有 $${m}$ 个零点。差是 $${answer}$。`,
      ],
    );
  },
);

const crossRatioReverse = point(
  "the-point-with-a-given-cross-ratio",
  ["The point with a given cross ratio", "具有给定交比的点"],
  [
    "With $(z_1, z_2; z_3, z_4) = \\frac{(z_1 - z_3)(z_2 - z_4)}{(z_1 - z_4)(z_2 - z_3)}$, three of the points and the value of the cross ratio determine the fourth point. After clearing denominators the equation is linear in the unknown, and this fact is what lets a Mobius map be found from three points.",
    "由 $(z_1, z_2; z_3, z_4) = \\frac{(z_1 - z_3)(z_2 - z_4)}{(z_1 - z_4)(z_2 - z_3)}$，三个点和交比的值确定第四个点。去分母后，方程关于未知数是线性的，正因如此才能由三个点确定默比乌斯变换。",
  ],
  (rng) => {
    const [a, b, c, x] = rng.sample([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7], 4) as [number, number, number, number];
    const k = Q.of((a - c) * (b - x), (a - x) * (b - c));
    const P = Q.of(a - c, b - c);
    const solve = (value: Q) => {
      const bottom = P.sub(value);
      return bottom.isZero()
        ? Q.of(x + 1)
        : P.mul(Q.of(b))
            .sub(value.mul(Q.of(a)))
            .div(bottom);
    };
    return ask(
      [
        `The cross ratio $(${a}, ${b}; ${c}, x)$ equals $${k.toLatex()}$. What is $x$?`,
        `交比 $(${a}, ${b}; ${c}, x)$ 等于 $${k.toLatex()}$。$x$ 是多少？`,
      ],
      x,
      [solve(k.neg()), solve(Q.one.div(k)), Q.of(x + 1)],
      [
        `The definition gives $${P.toLatex()} \\cdot \\frac{${b} - x}{${a} - x} = ${k.toLatex()}$. Clearing the denominator leaves a linear equation in $x$, whose solution is $x = ${x}$.`,
        `由定义得 $${P.toLatex()} \\cdot \\frac{${b} - x}{${a} - x} = ${k.toLatex()}$。去分母后得到关于 $x$ 的线性方程，它的解是 $x = ${x}$。`,
      ],
    );
  },
);

/** deeperComplexAnalysisThirdPoints maps topics of Complex Analysis to a third knowledge point. */
export const deeperComplexAnalysisThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "cauchys-integral-theorem": [twoPoles],
  "laurent-series-on-annuli": [annulusCoefficient],
  "the-argument-principle-and-rouches-theorem": [roucheAnnulus],
  "the-cross-ratio": [crossRatioReverse],
};
