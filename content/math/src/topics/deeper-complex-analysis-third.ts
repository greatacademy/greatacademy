// Third knowledge points for thin topics of Complex Analysis: the reverse question or a harder
// case. See `deeperComplexAnalysisThirdPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { poly, Q } from "@ga/subject-math";
import { complexDrawings1 } from "../explanation-drawings-complex-analysis-1.ts";

import { point } from "../university-kit.ts";
import { type Miss, until, worked } from "./number-theory-course.ts";

/** par wraps a negative number in parentheses, for use after an operator. */
const par = (q: Q | number) => {
  const v = typeof q === "number" ? Q.of(q) : q;
  return v.sign() < 0 ? `(${v.toLatex()})` : v.toLatex();
};

const twoPoles = point(
  "an-integral-around-one-or-two-poles",
  ["An integral around one or two poles", "绕一个或两个极点的积分"],
  [
    "For $\\frac{c}{(z - a)(z - b)}$, only the poles inside the contour contribute, each with residue found by partial fractions. The residues at the two poles are opposites, so a contour enclosing both gives zero, while a contour enclosing just one does not. For $\\frac{3}{(z - 1)(z - 4)}$ around $|z| = 2$, only 1 is inside, with residue $\\frac{3}{1 - 4} = -1$, so the integral is $-2\\pi i$; around $|z| = 5$ it is 0.\n\nCheck: the residue at 4 is $\\frac{3}{4 - 1} = 1$, the opposite of $-1$, so enclosing both gives $2\\pi i (-1 + 1) = 0$.\n\n> **Watch out.** Compare each pole's modulus with the radius before adding residues; a pole outside the circle contributes nothing.",
    "对 $\\frac{c}{(z - a)(z - b)}$，只有围道内部的极点才有贡献，每个极点的留数由部分分式求得。两个极点处的留数互为相反数，所以包围两者的围道积分为零，而只包围一个的则不为零。对沿 $|z| = 2$ 的 $\\frac{3}{(z - 1)(z - 4)}$，只有 1 在圆内，留数是 $\\frac{3}{1 - 4} = -1$，所以积分是 $-2\\pi i$；沿 $|z| = 5$ 则为 0。\n\n检验：4 处的留数是 $\\frac{3}{4 - 1} = 1$，是 $-1$ 的相反数，所以同时包围两者得 $2\\pi i (-1 + 1) = 0$。\n\n> **注意。** 把留数相加之前，先比较每个极点的模与半径；圆外的极点没有贡献。",
  ],
  (rng) =>
    until(() => {
      const a = rng.pick([-3, -2, -1, 1, 2, 3]);
      const b = rng.pick([-1, 1]) * (Math.abs(a) + rng.int(2, 4));
      const c = rng.int(1, 9);
      const both = rng.int(1, 3) === 1;
      const R = both ? Math.abs(b) + 1 : Math.abs(a) + 1;
      const one = Q.of(2 * c, a - b);
      const answer = both ? Q.of(0) : one;
      const ra = Q.of(c, a - b);
      const denominator = `(${poly([1, "z"], [-a, ""])})(${poly([1, "z"], [-b, ""])})`;
      const misses: Miss[] = both
        ? [
            [one, `That counts only the pole at ${a}; the pole at ${b} is inside too.`, `那只算了 ${a} 处的极点；${b} 处的极点也在圆内。`],
            [
              one.neg(),
              `That counts only the pole at ${b}; the pole at ${a} is inside too.`,
              `那只算了 ${b} 处的极点；${a} 处的极点也在圆内。`,
            ],
          ]
        : [
            [one.neg(), `That uses the residue at ${b}, which lies outside the circle.`, `那用了 ${b} 处的留数，而它在圆外。`],
            [ra, "That forgets the factor 2 in $2\\pi i$.", "那忘了 $2\\pi i$ 中的因子 2。"],
            [Q.of(0), `That treats both poles as inside, but $|${b}| > ${R}$.`, `那把两个极点都当成在圆内，但 $|${b}| > ${R}$。`],
          ];
      return worked(
        [
          `The integral of $\\frac{${c}}{${denominator}}$ once counterclockwise around $|z| = ${R}$ is $k\\pi i$. What is $k$?`,
          `$\\frac{${c}}{${denominator}}$ 沿 $|z| = ${R}$ 逆时针一周的积分是 $k\\pi i$。$k$ 是多少？`,
        ],
        answer,
        misses,
        [
          [
            ["Locate the poles", "确定极点位置"],
            [
              both
                ? `$|${a}|$ and $|${b}|$ are both less than ${R}, so both poles are inside.`
                : `$|${a}| < ${R} < |${b}|$, so only the pole at ${a} is inside.`,
              both
                ? `$|${a}|$ 和 $|${b}|$ 都小于 ${R}，所以两个极点都在圆内。`
                : `$|${a}| < ${R} < |${b}|$，所以只有 ${a} 处的极点在圆内。`,
            ],
          ],
          [
            ["Find the residues", "求留数"],
            [
              both
                ? `At ${a}: $\\frac{${c}}{${a} - ${par(b)}} = ${ra.toLatex()}$; at ${b}: $${ra.neg().toLatex()}$.`
                : `At ${a}: $\\frac{${c}}{${a} - ${par(b)}} = ${ra.toLatex()}$.`,
              both
                ? `在 ${a} 处：$\\frac{${c}}{${a} - ${par(b)}} = ${ra.toLatex()}$；在 ${b} 处：$${ra.neg().toLatex()}$。`
                : `在 ${a} 处：$\\frac{${c}}{${a} - ${par(b)}} = ${ra.toLatex()}$。`,
            ],
          ],
          [
            ["Multiply by 2πi", "乘以 2πi"],
            [
              both
                ? "The residues cancel, so the integral is 0 and $k = 0$."
                : `$2\\pi i \\cdot ${par(ra)} = ${one.toLatex()} \\pi i$, so $k = ${one.toLatex()}$.`,
              both
                ? "留数相互抵消，所以积分为 0，$k = 0$。"
                : `$2\\pi i \\cdot ${par(ra)} = ${one.toLatex()} \\pi i$，所以 $k = ${one.toLatex()}$。`,
            ],
          ],
        ],
        both
          ? [
              "The integrand falls off like $\\frac{1}{|z|^2}$, so by the $ML$ inequality its integral around any larger circle tends to 0; every circle enclosing both poles gives the same value, so it is 0.",
              "被积函数像 $\\frac{1}{|z|^2}$ 那样衰减，由 $ML$ 不等式，沿更大圆的积分趋于 0；每个包围两个极点的圆给出同一个值，所以它是 0。",
            ]
          : [
              `Write the integrand as $\\frac{g(z)}{${poly([1, "z"], [-a, ""])}}$ with $g(z) = \\frac{${c}}{${poly([1, "z"], [-b, ""])}}$ analytic inside; Cauchy's formula gives $2\\pi i \\, g(${a}) = 2\\pi i \\cdot ${par(ra)}$, so $k = ${one.toLatex()}$.`,
              `把被积函数写成 $\\frac{g(z)}{${poly([1, "z"], [-a, ""])}}$，其中 $g(z) = \\frac{${c}}{${poly([1, "z"], [-b, ""])}}$ 在圆内解析；柯西公式给出 $2\\pi i \\, g(${a}) = 2\\pi i \\cdot ${par(ra)}$，所以 $k = ${one.toLatex()}$。`,
            ],
      );
    }),
);

const annulusCoefficient = {
  ...point(
    "a-coefficient-in-an-annulus-between-two-poles",
    ["A coefficient in an annulus between two poles", "两极点之间圆环上的系数"],
    [
      "In an annulus between two poles, split the function by partial fractions and expand each piece differently. The pole inside the annulus's inner circle gives negative powers of $z$, and the pole outside the outer circle gives nonnegative powers, so both kinds appear in one series. In the drawing, $\\frac{1}{(z - 1)(z - 2)} = \\frac{1}{z - 2} - \\frac{1}{z - 1}$ on $1 < |z| < 2$. Here $-\\frac{1}{z - 1} = -\\sum_{n \\ge 0} \\frac{1}{z^{n + 1}}$, so the coefficient of $\\frac{1}{z}$ is $-1$; and $\\frac{1}{z - 2} = -\\sum_{n \\ge 0} \\frac{z^n}{2^{n + 1}}$, so the constant term is $-\\frac{1}{2}$.\n\nCheck: the coefficient of $\\frac{1}{z}$ is the residue inside the inner circle, and at 1 that residue is $\\frac{1}{1 - 2} = -1$.\n\n> **Watch out.** Expand each piece where it converges: $\\frac{1}{z - a}$ in powers of $\\frac{a}{z}$ since $|z| > a$, and the outer piece in powers of $\\frac{z}{b}$ since $|z| < b$. Keep the factor from the partial fractions and every minus sign.",
      "在两极点之间的圆环上，用部分分式拆开函数，并对每一部分作不同的展开。在圆环内圆之内的极点给出 $z$ 的负幂，在外圆之外的极点给出非负幂，所以一个级数中同时出现这两类幂。图中在 $1 < |z| < 2$ 上，$\\frac{1}{(z - 1)(z - 2)} = \\frac{1}{z - 2} - \\frac{1}{z - 1}$。这里 $-\\frac{1}{z - 1} = -\\sum_{n \\ge 0} \\frac{1}{z^{n + 1}}$，所以 $\\frac{1}{z}$ 的系数是 $-1$；$\\frac{1}{z - 2} = -\\sum_{n \\ge 0} \\frac{z^n}{2^{n + 1}}$，所以常数项是 $-\\frac{1}{2}$。\n\n检验：$\\frac{1}{z}$ 的系数等于内圆之内的留数，而 1 处的留数是 $\\frac{1}{1 - 2} = -1$。\n\n> **注意。** 每一部分都在它收敛的地方展开：因为 $|z| > a$，$\\frac{1}{z - a}$ 按 $\\frac{a}{z}$ 的幂展开；因为 $|z| < b$，外侧部分按 $\\frac{z}{b}$ 的幂展开。保留部分分式的系数和每个负号。",
    ],
    (rng) =>
      until(() => {
        const a = rng.int(1, 4);
        const b = a + rng.int(1, 5);
        const negative = rng.bool();
        const k = rng.int(1, 3);
        const m = rng.int(0, 2);
        const sign = m % 2 === 0 ? -1 : 1;
        const answer = negative ? Q.of(a ** (k - 1), a + b) : Q.of(sign, b ** (m + 1) * (a + b));
        const term = negative ? (k === 1 ? "\\frac{1}{z}" : `\\frac{1}{z^{${k}}}`) : m === 0 ? "z^{0}" : m === 1 ? "z" : `z^{${m}}`;
        const split = `\\frac{1}{${a + b}}\\left(\\frac{1}{z - ${a}} - \\frac{1}{z + ${b}}\\right)`;
        const misses: Miss[] = negative
          ? [
              [
                answer.neg(),
                `That puts a minus sign on the piece $\\frac{1}{z - ${a}}$; it enters with a plus sign.`,
                `那给 $\\frac{1}{z - ${a}}$ 这一部分加了负号；它带正号。`,
              ],
              [
                Q.of(a ** k, a + b),
                `That takes ${a} to the power ${k}; the coefficient of $z^{-${k}}$ has $${a}^{${k} - 1}$.`,
                `那取了 ${a} 的 ${k} 次幂；$z^{-${k}}$ 的系数含 $${a}^{${k} - 1}$。`,
              ],
              [
                Q.of(a ** (k - 1)),
                `That leaves out the factor $\\frac{1}{${a + b}}$ from the partial fractions.`,
                `那漏掉了部分分式中的因子 $\\frac{1}{${a + b}}$。`,
              ],
            ]
          : [
              [
                answer.neg(),
                `That loses a minus sign: the piece $-\\frac{1}{z + ${b}}$ brings $(-1)^{n + 1}$ with $n = ${m}$.`,
                `那丢了一个负号：$-\\frac{1}{z + ${b}}$ 这一部分带来 $(-1)^{n + 1}$，其中 $n = ${m}$。`,
              ],
              [
                Q.of(-1, a ** (m + 1) * (a + b)),
                `That expands $\\frac{1}{z - ${a}}$ in powers of $z$, which converges only for $|z| < ${a}$.`,
                `那把 $\\frac{1}{z - ${a}}$ 按 $z$ 的幂展开，而这只在 $|z| < ${a}$ 时收敛。`,
              ],
              [
                Q.of(sign, b ** (m + 1)),
                `That leaves out the factor $\\frac{1}{${a + b}}$ from the partial fractions.`,
                `那漏掉了部分分式中的因子 $\\frac{1}{${a + b}}$。`,
              ],
            ];
        return worked(
          [
            `In the Laurent series of $\\frac{1}{(z - ${a})(z + ${b})}$ valid for $${a} < |z| < ${b}$, what is the coefficient of $${term}$?`,
            `在 $\\frac{1}{(z - ${a})(z + ${b})}$ 于 $${a} < |z| < ${b}$ 上的洛朗级数中，$${term}$ 的系数是多少？`,
          ],
          answer,
          misses,
          [
            [
              ["Split", "拆分"],
              [`Partial fractions give $${split}$.`, `部分分式给出 $${split}$。`],
            ],
            negative
              ? [
                  ["Expand the inner pole", "展开内侧极点"],
                  [
                    `Since $|z| > ${a}$, $\\frac{1}{z - ${a}} = \\sum_{n \\ge 0} \\frac{${a}^{n}}{z^{n + 1}}$; the term with $z^{-${k}}$ has $n = ${k - 1}$ and coefficient $${a ** (k - 1)}$.`,
                    `因为 $|z| > ${a}$，$\\frac{1}{z - ${a}} = \\sum_{n \\ge 0} \\frac{${a}^{n}}{z^{n + 1}}$；含 $z^{-${k}}$ 的项对应 $n = ${k - 1}$，系数为 $${a ** (k - 1)}$。`,
                  ],
                ]
              : [
                  ["Expand the outer pole", "展开外侧极点"],
                  [
                    `Since $|z| < ${b}$, $-\\frac{1}{z + ${b}} = \\sum_{n \\ge 0} \\frac{(-1)^{n + 1} z^{n}}{${b}^{n + 1}}$; for $n = ${m}$ the coefficient is $${Q.of(sign, b ** (m + 1)).toLatex()}$.`,
                    `因为 $|z| < ${b}$，$-\\frac{1}{z + ${b}} = \\sum_{n \\ge 0} \\frac{(-1)^{n + 1} z^{n}}{${b}^{n + 1}}$；$n = ${m}$ 时系数为 $${Q.of(sign, b ** (m + 1)).toLatex()}$。`,
                  ],
                ],
            [
              ["Include the factor", "乘上系数"],
              [
                `Multiplying by $\\frac{1}{${a + b}}$ gives $${answer.toLatex()}$.`,
                `乘以 $\\frac{1}{${a + b}}$ 得 $${answer.toLatex()}$。`,
              ],
            ],
          ],
          negative
            ? [
                `The coefficient of $z^{-${k}}$ is $\\frac{1}{2\\pi i} \\oint ${k === 1 ? "" : k === 2 ? "z " : `z^{${k - 1}} `}f(z) \\, dz$ on a circle in the annulus; the only pole inside is ${a}, with residue $\\frac{${a ** (k - 1)}}{${a} + ${b}} = ${answer.toLatex()}$.`,
                `$z^{-${k}}$ 的系数是在圆环内一个圆上的 $\\frac{1}{2\\pi i} \\oint ${k === 1 ? "" : k === 2 ? "z " : `z^{${k - 1}} `}f(z) \\, dz$；圆内唯一的极点是 ${a}，留数为 $\\frac{${a ** (k - 1)}}{${a} + ${b}} = ${answer.toLatex()}$。`,
              ]
            : [
                `The piece $\\frac{1}{z - ${a}}$ has only negative powers on the annulus, so the coefficient of $${term}$ comes from $-\\frac{1}{${a + b}} \\cdot \\frac{1}{${b}} \\cdot \\frac{1}{1 + z/${b}}$; the geometric series of the last factor has coefficient $${Q.of(-sign, b ** m).toLatex()}$ there, and $-\\frac{1}{${a + b} \\cdot ${b}} \\cdot ${par(Q.of(-sign, b ** m))} = ${answer.toLatex()}$.`,
                `$\\frac{1}{z - ${a}}$ 在圆环上只有负幂，所以 $${term}$ 的系数来自 $-\\frac{1}{${a + b}} \\cdot \\frac{1}{${b}} \\cdot \\frac{1}{1 + z/${b}}$；最后一个因子的几何级数在那里的系数是 $${Q.of(-sign, b ** m).toLatex()}$，而 $-\\frac{1}{${a + b} \\cdot ${b}} \\cdot ${par(Q.of(-sign, b ** m))} = ${answer.toLatex()}$。`,
              ],
        );
      }),
  ),
  figure: complexDrawings1["laurent-series-on-annuli#a-coefficient-in-an-annulus-between-two-poles"],
};

const roucheAnnulus = {
  ...point(
    "counting-zeros-in-an-annulus",
    ["Counting zeros in an annulus", "计算圆环内的零点"],
    [
      "Rouché's theorem counts zeros inside one circle at a time, with a term that dominates on this circle. To count zeros in an annulus, apply it on the outer circle and on the inner circle, usually with different dominating terms, and subtract the two counts. In the drawing, $z^5 + 5z + 1$: on $|z| = 2$, $|z^5| = 32 > 2 \\cdot 5 + 1 = 11$, so 5 zeros lie inside; on $|z| = 1$, $|5z| = 5 > 1 + 1 = 2$, so 1 zero lies inside. The annulus holds $5 - 1 = 4$.\n\nCheck: the inner zero is real and near $-\\frac{1}{5}$, since $5z + 1 = 0$ there and $z^5$ is tiny; the other 4 then lie between the circles.\n\n> **Watch out.** Subtract the inner count from the outer count. The outer count alone includes the zeros in the inner disk, and the inner count alone misses the annulus.",
      "鲁歇定理一次只计算一个圆内的零点，需要有一项在这个圆上占优。要计算圆环内的零点，就在外圆和内圆上分别应用定理，通常占优的项不同，再把两个个数相减。图中 $z^5 + 5z + 1$：在 $|z| = 2$ 上，$|z^5| = 32 > 2 \\cdot 5 + 1 = 11$，所以圆内有 5 个零点；在 $|z| = 1$ 上，$|5z| = 5 > 1 + 1 = 2$，所以圆内有 1 个零点。圆环内有 $5 - 1 = 4$ 个。\n\n检验：内圆中的零点是实数，靠近 $-\\frac{1}{5}$，因为那里 $5z + 1 = 0$ 而 $z^5$ 很小；其余 4 个就在两圆之间。\n\n> **注意。** 用外圆内的个数减去内圆内的个数。只看外圆会把内圆盘中的零点也算进去，只看内圆则漏掉圆环。",
    ],
    (rng) =>
      until(() => {
        const n = rng.int(5, 8);
        const m = rng.int(1, n - 2);
        // Both circles must have a strictly dominating term, so a large constant needs room.
        const B = rng.int(1, 2);
        const top = Math.floor((2 ** n - B - 1) / 2 ** m);
        if (top < B + 2) return undefined;
        const A = rng.int(B + 2, top);
        const zm = m === 1 ? "z" : `z^{${m}}`;
        const f = poly([1, `z^{${n}}`], [A, zm], [B, ""]);
        const answer = n - m;
        const outer = A * 2 ** m + B;
        return worked(
          [
            `How many zeros of $${f}$, counted with multiplicity, lie in the annulus $1 < |z| < 2$?`,
            `$${f}$ 在圆环 $1 < |z| < 2$ 内有多少个零点（计重数）？`,
          ],
          answer,
          [
            [
              n,
              `That counts every zero inside $|z| = 2$, including the ${m} inside $|z| = 1$.`,
              `那算了 $|z| = 2$ 内的全部零点，包括 $|z| = 1$ 内的 ${m} 个。`,
            ],
            [m, "That is the count inside the inner circle, not in the annulus.", "那是内圆内的个数，不是圆环内的。"],
            [n + m, "That adds the two counts; the inner disk must be removed.", "那把两个个数相加了；应去掉内圆盘。"],
          ],
          [
            [
              ["Outer circle", "外圆"],
              [
                `On $|z| = 2$: $|z^{${n}}| = ${2 ** n}$, while the rest is at most $${A} \\cdot ${2 ** m} + ${B} = ${outer}$. So $z^{${n}}$ dominates and ${n} zeros lie inside.`,
                `在 $|z| = 2$ 上：$|z^{${n}}| = ${2 ** n}$，其余项至多 $${A} \\cdot ${2 ** m} + ${B} = ${outer}$。所以 $z^{${n}}$ 占优，圆内有 ${n} 个零点。`,
              ],
            ],
            [
              ["Inner circle", "内圆"],
              [
                `On $|z| = 1$: $|${A}${zm}| = ${A}$, while the rest is at most $1 + ${B} = ${B + 1}$. So $${A}${zm}$ dominates and ${m} ${m === 1 ? "zero lies" : "zeros lie"} inside.`,
                `在 $|z| = 1$ 上：$|${A}${zm}| = ${A}$，其余项至多 $1 + ${B} = ${B + 1}$。所以 $${A}${zm}$ 占优，圆内有 ${m} 个零点。`,
              ],
            ],
            [
              ["Subtract", "相减"],
              [`The annulus holds $${n} - ${m} = ${answer}$.`, `圆环内有 $${n} - ${m} = ${answer}$ 个。`],
            ],
          ],
          [
            `The strict inequalities mean no zero lies on either circle, so the ${n} zeros split into ${m} in the inner disk and ${answer} in the annulus, and $${m} + ${answer} = ${n}$, the degree.`,
            `严格不等式说明两个圆上都没有零点，所以 ${n} 个零点分为内圆盘中的 ${m} 个和圆环中的 ${answer} 个，而 $${m} + ${answer} = ${n}$，正是次数。`,
          ],
        );
      }),
  ),
  figure: complexDrawings1["the-argument-principle-and-rouches-theorem#counting-zeros-in-an-annulus"],
};

const crossRatioReverse = point(
  "the-point-with-a-given-cross-ratio",
  ["The point with a given cross ratio", "具有给定交比的点"],
  [
    "With $(z_1, z_2; z_3, z_4) = \\frac{(z_1 - z_3)(z_2 - z_4)}{(z_1 - z_4)(z_2 - z_3)}$, three of the points and the value of the cross ratio determine the fourth point. After clearing denominators the equation is linear in the unknown, and this fact is what lets a Mobius map be found from three points. For $(0, 1; 2, x) = \\frac{4}{3}$: the known factor is $\\frac{0 - 2}{1 - 2} = 2$, so $2 \\cdot \\frac{1 - x}{0 - x} = \\frac{4}{3}$, that is $6 - 6x = -4x$, and $x = 3$.\n\nCheck: $\\frac{(0 - 2)(1 - 3)}{(0 - 3)(1 - 2)} = \\frac{4}{3}$.\n\n> **Watch out.** Keep the order of the points: $z_3$ pairs with $z_1$ on top and $z_4$ pairs with $z_1$ below. Swapping them replaces the cross ratio by its reciprocal.",
    "由 $(z_1, z_2; z_3, z_4) = \\frac{(z_1 - z_3)(z_2 - z_4)}{(z_1 - z_4)(z_2 - z_3)}$，三个点和交比的值确定第四个点。去分母后，方程关于未知数是线性的，正因如此才能由三个点确定默比乌斯变换。对 $(0, 1; 2, x) = \\frac{4}{3}$：已知因子是 $\\frac{0 - 2}{1 - 2} = 2$，所以 $2 \\cdot \\frac{1 - x}{0 - x} = \\frac{4}{3}$，即 $6 - 6x = -4x$，$x = 3$。\n\n检验：$\\frac{(0 - 2)(1 - 3)}{(0 - 3)(1 - 2)} = \\frac{4}{3}$。\n\n> **注意。** 保持点的顺序：分子中 $z_3$ 与 $z_1$ 配对，分母中 $z_4$ 与 $z_1$ 配对。交换它们会把交比变成倒数。",
  ],
  (rng) =>
    until(() => {
      const [a, b, c, x] = rng.sample([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7], 4) as [number, number, number, number];
      const k = Q.of((a - c) * (b - x), (a - x) * (b - c));
      const P = Q.of(a - c, b - c);
      const solve = (factor: Q, value: Q): Q | undefined => {
        const bottom = factor.sub(value);
        return bottom.isZero()
          ? undefined
          : factor
              .mul(Q.of(b))
              .sub(value.mul(Q.of(a)))
              .div(bottom);
      };
      const raw: [Q | undefined, string, string][] = [
        [
          solve(P, Q.of(1).div(k)),
          "That solves with the reciprocal of the cross ratio, as if $z_3$ and $z_4$ were swapped.",
          "那用了交比的倒数，好像交换了 $z_3$ 和 $z_4$。",
        ],
        [
          solve(Q.of(1), k),
          `That leaves out the known factor $\\frac{${a} - ${par(c)}}{${b} - ${par(c)}} = ${P.toLatex()}$.`,
          `那漏掉了已知因子 $\\frac{${a} - ${par(c)}}{${b} - ${par(c)}} = ${P.toLatex()}$。`,
        ],
        [solve(P, k.neg()), "That flips the sign of the cross ratio.", "那把交比的符号弄反了。"],
      ];
      const misses = raw.flatMap(([v, en, zh]): Miss[] => (v === undefined ? [] : [[v, en, zh]]));
      const left = P.sub(k);
      const right = P.mul(Q.of(b)).sub(k.mul(Q.of(a)));
      return worked(
        [
          `The cross ratio $(${a}, ${b}; ${c}, x)$ equals $${k.toLatex()}$. What is $x$?`,
          `交比 $(${a}, ${b}; ${c}, x)$ 等于 $${k.toLatex()}$。$x$ 是多少？`,
        ],
        x,
        misses,
        [
          [
            ["Compute the known factor", "计算已知因子"],
            [
              `$\\frac{${a} - ${par(c)}}{${b} - ${par(c)}} = ${P.toLatex()}$, so $${P.toLatex()} \\cdot \\frac{${b} - x}{${a} - x} = ${k.toLatex()}$.`,
              `$\\frac{${a} - ${par(c)}}{${b} - ${par(c)}} = ${P.toLatex()}$，所以 $${P.toLatex()} \\cdot \\frac{${b} - x}{${a} - x} = ${k.toLatex()}$。`,
            ],
          ],
          [
            ["Clear the denominator", "去分母"],
            [
              `$P(${b} - x) = k(${a} - x)$ gives $(P - k) x = P \\cdot ${par(b)} - k \\cdot ${par(a)}$, where $P - k = ${left.toLatex()}$ and the right side is $${right.toLatex()}$.`,
              `$P(${b} - x) = k(${a} - x)$ 给出 $(P - k) x = P \\cdot ${par(b)} - k \\cdot ${par(a)}$，其中 $P - k = ${left.toLatex()}$，右边是 $${right.toLatex()}$。`,
            ],
          ],
          [
            ["Divide", "相除"],
            [`$x = ${x}$.`, `$x = ${x}$。`],
          ],
        ],
        [
          `Substitute back: $\\frac{(${a} - ${par(c)})(${b} - ${par(x)})}{(${a} - ${par(x)})(${b} - ${par(c)})} = \\frac{${a - c} \\cdot ${par(b - x)}}{${a - x} \\cdot ${par(b - c)}} = ${k.toLatex()}$.`,
          `代回：$\\frac{(${a} - ${par(c)})(${b} - ${par(x)})}{(${a} - ${par(x)})(${b} - ${par(c)})} = \\frac{${a - c} \\cdot ${par(b - x)}}{${a - x} \\cdot ${par(b - c)}} = ${k.toLatex()}$。`,
        ],
      );
    }),
);

/** deeperComplexAnalysisThirdPoints maps topics of Complex Analysis to a third knowledge point. */
export const deeperComplexAnalysisThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "cauchys-integral-theorem": [twoPoles],
  "laurent-series-on-annuli": [annulusCoefficient],
  "the-argument-principle-and-rouches-theorem": [roucheAnnulus],
  "the-cross-ratio": [crossRatioReverse],
};
