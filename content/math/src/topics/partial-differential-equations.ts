// Partial Differential Equations: classification, first-order equations and characteristics,
// separation of variables, the heat, wave and Laplace equations, and finite differences.

import type { TopicDef } from "@ga/content";
import { gcd, Q } from "@ga/subject-math";
import { pdeDrawings1 } from "../explanation-drawings-partial-differential-equations-1.ts";

import { type Pair, point, same, topic } from "../university-kit.ts";
import { chosen, lesson, type Miss, type Slip, until, worked } from "./number-theory-course.ts";

/** times writes a coefficient before a term, leaving out a coefficient of one. */
const times = (c: number, v: string) => (c === 1 ? v : c === -1 ? `-${v}` : `${c}${v}`);

/** shifted writes a variable plus a signed number. */
const shifted = (v: string, a: number) => (a === 0 ? v : a < 0 ? `${v} - ${-a}` : `${v} + ${a}`);

/** plus writes a signed number as a term that follows another, as in "+ 3" or "- 3". */
const plus = (n: number) => (n < 0 ? `- ${-n}` : `+ ${n}`);

/** mode writes the sine of a multiple of pi x over L, in lowest terms. */
const mode = (n: number, L: number, fn = "\\sin") => {
  const g = gcd(n, L);
  const [top, bottom] = [n / g, L / g];
  const inner = bottom === 1 ? `${times(top, "\\pi")} x` : `\\frac{${times(top, "\\pi")} x}{${bottom}}`;
  return `${fn}\\left(${inner}\\right)`;
};

/** freq writes the frequency n pi over L as a fraction, leaving out a coefficient of one. */
const freq = (n: number, L: number) => `\\frac{${times(n, "\\pi")}}{${L}}`;

const introduction = topic(
  "introduction-to-partial-differential-equations",
  ["Introduction to Partial Differential Equations", "偏微分方程简介"],
  ["Read the order of an equation, and check a proposed solution.", "读出方程的阶，并验证给定的解。"],
  ["higher-order-partial-derivatives"],
  [],
  [
    point(
      "the-order-of-an-equation",
      ["The order of an equation", "方程的阶"],
      [
        "A partial differential equation relates an unknown function of several variables to its partial derivatives. Its order is the order of the highest derivative that appears, counting all differentiations, whichever variables they are with respect to. So a mixed derivative $u_{xt}$ counts as second order. The order largely decides how many initial and boundary conditions a problem needs to determine a single solution. For example, $u_{tt} = 4u_{xx} + u_{x}$ contains derivatives of orders $2$, $2$ and $1$, so it is of second order.\n\nCheck: the longest subscript in the equation, $tt$ or $xx$, has two letters, one for each differentiation.\n\n> **Watch out.** Take the highest single derivative; do not add the orders of different terms, and count every letter of a mixed derivative such as $u_{xt}$.",
        "偏微分方程把多元未知函数和它的偏导数联系起来。它的阶是方程中最高阶导数的阶，不论对哪个变量求导，所有求导次数都要算上。所以混合导数 $u_{xt}$ 算二阶。阶在很大程度上决定了问题需要多少初始条件和边界条件才能确定唯一的解。例如，$u_{tt} = 4u_{xx} + u_{x}$ 含有 $2$ 阶、$2$ 阶和 $1$ 阶导数，所以它是二阶方程。\n\n检验：方程中最长的下标 $tt$ 或 $xx$ 有两个字母，每个字母对应一次求导。\n\n> **注意。** 要取最高的单个导数；不要把不同项的阶相加，混合导数（如 $u_{xt}$）的每个字母都要算上。",
      ],
      (rng) =>
        until(() => {
          const c = rng.int(2, 12);
          const d = rng.int(2, 12);
          const forms: readonly (readonly [string, number, string, Pair, Miss, Miss])[] = [
            [
              `u_t = ${c}u_{xx} + ${d}u`,
              2,
              "u_{xx}",
              ["$u_t$ (order 1) and $u_{xx}$ (order 2)", "$u_t$（1 阶）和 $u_{xx}$（2 阶）"],
              [1, "That is the order of $u_t$; $u_{xx}$ is differentiated twice.", "那是 $u_t$ 的阶；$u_{xx}$ 求导了两次。"],
              [
                3,
                "That adds the orders of $u_t$ and $u_{xx}$; the order is that of the highest single derivative.",
                "那把 $u_t$ 和 $u_{xx}$ 的阶相加了；阶是最高的单个导数的阶。",
              ],
            ],
            [
              `u_t + ${c}u_x = ${d}`,
              1,
              "u_t",
              ["$u_t$ (order 1) and $u_x$ (order 1)", "$u_t$（1 阶）和 $u_x$（1 阶）"],
              [
                2,
                "That counts the two terms $u_t$ and $u_x$; each is differentiated only once.",
                "那数的是 $u_t$ 和 $u_x$ 两项；每一项只求导一次。",
              ],
              [0, "$u_t$ and $u_x$ are derivatives, so the order is at least $1$.", "$u_t$ 和 $u_x$ 都是导数，所以阶至少是 $1$。"],
            ],
            [
              `u_{tt} = ${c}u_{xxxx} + ${d}u_x`,
              4,
              "u_{xxxx}",
              ["$u_{tt}$ (order 2), $u_{xxxx}$ (order 4) and $u_x$ (order 1)", "$u_{tt}$（2 阶）、$u_{xxxx}$（4 阶）和 $u_x$（1 阶）"],
              [2, "That is the order of $u_{tt}$; $u_{xxxx}$ is differentiated four times.", "那是 $u_{tt}$ 的阶；$u_{xxxx}$ 求导了四次。"],
              [1, "That is the order of $u_x$, the lowest derivative, not the highest.", "那是最低的导数 $u_x$ 的阶，不是最高的。"],
            ],
            [
              `u_{xxt} + ${c}u_x = ${d}u`,
              3,
              "u_{xxt}",
              ["$u_{xxt}$ (order 3) and $u_x$ (order 1)", "$u_{xxt}$（3 阶）和 $u_x$（1 阶）"],
              [
                2,
                "That counts only the two $x$ differentiations in $u_{xxt}$; the $t$ counts too.",
                "那只数了 $u_{xxt}$ 中对 $x$ 的两次求导；对 $t$ 的那次也要算。",
              ],
              [1, "That is the order of $u_x$, not of the highest derivative.", "那是 $u_x$ 的阶，不是最高阶导数的阶。"],
            ],
            [
              `u_{xt} = ${c}u + ${d}`,
              2,
              "u_{xt}",
              ["$u_{xt}$ (order 2) alone", "只有 $u_{xt}$（2 阶）"],
              [
                1,
                "A mixed derivative $u_{xt}$ is differentiated once in $x$ and once in $t$, so it is second order.",
                "混合导数 $u_{xt}$ 对 $x$ 和 $t$ 各求导一次，所以是二阶。",
              ],
              [0, "$u_{xt}$ is a derivative, so the order is not zero.", "$u_{xt}$ 是导数，所以阶不是零。"],
            ],
            [
              `u_t + ${c}u_{xxx} = ${d}u_x`,
              3,
              "u_{xxx}",
              ["$u_t$ (order 1), $u_{xxx}$ (order 3) and $u_x$ (order 1)", "$u_t$（1 阶）、$u_{xxx}$（3 阶）和 $u_x$（1 阶）"],
              [1, "That is the order of $u_t$ and $u_x$; $u_{xxx}$ is of third order.", "那是 $u_t$ 和 $u_x$ 的阶；$u_{xxx}$ 是三阶的。"],
              [
                4,
                "That adds the order of $u_t$ to that of $u_{xxx}$; the order is that of the highest single derivative.",
                "那把 $u_t$ 的阶加到了 $u_{xxx}$ 的阶上；阶是最高的单个导数的阶。",
              ],
            ],
          ];
          const [text, answer, top, list, m1, m2] = rng.pick(forms);
          return worked(
            [`What is the order of $${text}$?`, `$${text}$ 的阶是多少？`],
            answer,
            [m1, m2],
            [
              [
                ["List the derivatives", "列出导数"],
                [`The derivatives in the equation are ${list[0]}.`, `方程中的导数是${list[1]}。`],
              ],
              [
                ["Take the highest", "取最高的"],
                [`The highest is $${top}$, so the order is ${answer}.`, `最高的是 $${top}$，所以阶是 ${answer}。`],
              ],
            ],
            [
              `The subscript of $${top}$ has ${answer} ${answer === 1 ? "letter" : "letters"}, one for each differentiation, and no other derivative has more.`,
              `$${top}$ 的下标有 ${answer} 个字母，每个字母对应一次求导，没有别的导数比它多。`,
            ],
          );
        }),
    ),
    point(
      "checking-a-solution",
      ["Checking a solution", "验证解"],
      [
        "To check a proposed solution, compute the derivatives in the equation and substitute them. No solving is needed, and the check often determines an unknown constant. Partial differential equations have very many solutions, far more than ordinary ones, since an arbitrary function can take the place of an arbitrary constant. So a function that satisfies the equation need not meet the conditions of a particular problem as well. For example, for $u = x^{2} + kt$ to solve $u_t = 3u_{xx}$: $u_t = k$ and $u_{xx} = 2$, so $k = 3 \\cdot 2 = 6$.\n\nCheck: with $u = x^{2} + 6t$, the left side is $6$ and the right side is $3 \\cdot 2 = 6$.\n\n> **Watch out.** Differentiating $px^{2}$ twice gives $2p$, not $p$; a constant term in $u$ disappears from both sides.",
        "验证给定的解时，计算方程中的导数再代入即可。不需要求解，这种验证常常还能确定未知常数。偏微分方程的解非常多，比常微分方程多得多，因为任意函数可以取代任意常数。所以满足方程的函数不一定也满足具体问题的条件。例如，要使 $u = x^{2} + kt$ 满足 $u_t = 3u_{xx}$：$u_t = k$，$u_{xx} = 2$，所以 $k = 3 \\cdot 2 = 6$。\n\n检验：取 $u = x^{2} + 6t$，左边是 $6$，右边是 $3 \\cdot 2 = 6$。\n\n> **注意。** $px^{2}$ 求导两次得 $2p$，不是 $p$；$u$ 中的常数项在两边都会消失。",
      ],
      (rng) =>
        until(() => {
          const c = rng.int(2, 15);
          const p = rng.int(1, 9);
          const q = rng.int(-9, 9);
          const answer = 2 * c * p;
          const u = `${times(p, "x^2")} + kt${q === 0 ? "" : ` ${plus(q)}`}`;
          const misses: Miss[] = [
            [
              c * p,
              `That takes $u_{xx}$ to be $${p}$; differentiating $${times(p, "x^2")}$ twice gives $${2 * p}$.`,
              `那把 $u_{xx}$ 当成了 $${p}$；$${times(p, "x^2")}$ 求导两次得 $${2 * p}$。`,
            ],
            [2 * p, `That drops the factor $${c}$ on the right side.`, `那丢掉了右边的系数 $${c}$。`],
            [2 * c, `That drops the coefficient $${p}$ of $x^2$.`, `那丢掉了 $x^2$ 的系数 $${p}$。`],
          ];
          return worked(
            [`For which $k$ does $u = ${u}$ solve $u_t = ${c}u_{xx}$?`, `当 $k$ 为何值时，$u = ${u}$ 满足 $u_t = ${c}u_{xx}$？`],
            answer,
            misses,
            [
              [
                ["Differentiate", "求导"],
                [`$u_t = k$ and $u_{xx} = ${2 * p}$.`, `$u_t = k$，$u_{xx} = ${2 * p}$。`],
              ],
              [
                ["Substitute", "代入"],
                [`$k = ${c} \\cdot ${2 * p} = ${answer}$.`, `$k = ${c} \\cdot ${2 * p} = ${answer}$。`],
              ],
            ],
            [
              `With $k = ${answer}$ the left side is $${answer}$ and the right side is $${c} \\cdot ${2 * p} = ${answer}$; the constant term of $u$ plays no part.`,
              `取 $k = ${answer}$，左边是 $${answer}$，右边是 $${c} \\cdot ${2 * p} = ${answer}$；$u$ 的常数项不起作用。`,
            ],
          );
        }),
    ),
  ],
);

const classifying = topic(
  "classifying-second-order-equations",
  ["Classifying Second-Order Equations", "二阶方程的分类"],
  ["Use the discriminant to tell elliptic, parabolic and hyperbolic equations apart.", "用判别式区分椭圆型、抛物型和双曲型方程。"],
  ["introduction-to-partial-differential-equations"],
  [],
  [
    point(
      "the-discriminant",
      ["The discriminant", "判别式"],
      [
        "A second-order linear equation has the form $A u_{xx} + B u_{xy} + C u_{yy}$ plus lower terms. Its discriminant is $B^2 - 4AC$, as for a conic section. The name is no accident: these three coefficients control the equation in the way that they control the shape of a conic, and the lower terms have no effect on the type. For example, $u_{xx} + 4u_{xy} + 3u_{yy} + 5u_{x} = 0$ has $A = 1$, $B = 4$, $C = 3$ and discriminant $16 - 12 = 4$.\n\nCheck: $4AC = 4 \\cdot 1 \\cdot 3 = 12$, and $B^{2} - 12 = 4$; the term $5u_{x}$ never enters.\n\n> **Watch out.** $B$ is the whole coefficient of $u_{xy}$. Some books write the middle term as $2B u_{xy}$, and then the discriminant becomes $B^{2} - AC$.",
        "二阶线性方程的形式是 $A u_{xx} + B u_{xy} + C u_{yy}$ 再加低阶项。它的判别式是 $B^2 - 4AC$，和圆锥曲线一样。这不是巧合：这三个系数控制方程的方式，正如它们控制圆锥曲线的形状，而低阶项不影响类型。例如，$u_{xx} + 4u_{xy} + 3u_{yy} + 5u_{x} = 0$ 中 $A = 1$，$B = 4$，$C = 3$，判别式是 $16 - 12 = 4$。\n\n检验：$4AC = 4 \\cdot 1 \\cdot 3 = 12$，而 $B^{2} - 12 = 4$；$5u_{x}$ 项始终不参与。\n\n> **注意。** $B$ 是 $u_{xy}$ 的全部系数。有些书把中间项写成 $2B u_{xy}$，这时判别式变成 $B^{2} - AC$。",
      ],
      (rng) =>
        until(() => {
          const [A, B, C] = [rng.int(1, 6), rng.int(1, 9), rng.int(-5, 6)];
          const e = rng.int(2, 9);
          const answer = B * B - 4 * A * C;
          const third = C === 0 ? "" : C > 0 ? ` + ${times(C, "u_{yy}")}` : ` - ${times(-C, "u_{yy}")}`;
          const equation = `${times(A, "u_{xx}")} + ${times(B, "u_{xy}")}${third} + ${e}u_x = 0`;
          const misses: Miss[] = [
            [B * B + 4 * A * C, "That adds $4AC$; the discriminant subtracts it.", "那加上了 $4AC$；判别式是减去它。"],
            [B - 4 * A * C, `That forgets to square $B = ${B}$.`, `那忘了把 $B = ${B}$ 平方。`],
            [B * B - 2 * A * C, "That uses $2AC$ in place of $4AC$.", "那用 $2AC$ 代替了 $4AC$。"],
            [
              answer + e,
              `That lets the lower term $${e}u_x$ change the discriminant; only $A$, $B$ and $C$ enter.`,
              `那让低阶项 $${e}u_x$ 改变了判别式；只有 $A$、$B$、$C$ 参与。`,
            ],
          ];
          return worked(
            [`What is the discriminant of $${equation}$?`, `$${equation}$ 的判别式是多少？`],
            answer,
            misses,
            [
              [
                ["Read the coefficients", "读出系数"],
                [
                  `$A = ${A}$, $B = ${B}$ and $C = ${C}$; the term $${e}u_x$ is of lower order and is ignored.`,
                  `$A = ${A}$，$B = ${B}$，$C = ${C}$；$${e}u_x$ 是低阶项，不予考虑。`,
                ],
              ],
              [
                ["Compute", "计算"],
                [`$B^2 - 4AC = ${B * B} - 4(${A})(${C}) = ${answer}$.`, `$B^2 - 4AC = ${B * B} - 4(${A})(${C}) = ${answer}$。`],
              ],
            ],
            [
              `Adding back, $${answer} + 4 \\cdot ${A} \\cdot ${C < 0 ? `(${C})` : C} = ${B * B}$, which is $${B}^2$, the square of the middle coefficient.`,
              `反加回去，$${answer} + 4 \\cdot ${A} \\cdot ${C < 0 ? `(${C})` : C} = ${B * B}$，正是中间系数的平方 $${B}^2$。`,
            ],
          );
        }),
    ),
    point(
      "naming-the-type",
      ["Naming the type", "判断类型"],
      [
        "A negative discriminant makes an equation elliptic, a zero discriminant makes it parabolic, and a positive one makes it hyperbolic. Laplace's equation, the heat equation and the wave equation are the models of the three types, and solutions of each type behave in their own way: elliptic problems describe steady states, parabolic ones describe smoothing diffusion, and hyperbolic ones carry waves at a finite speed. For example, $u_{xx} + 2u_{xy} + u_{yy} = 0$ has discriminant $4 - 4 = 0$, so it is parabolic.\n\nCheck: the operator is a perfect square, $(\\partial_x + \\partial_y)^{2}$, so it differentiates twice in only one direction, as the heat equation does in $x$ alone.\n\n> **Watch out.** Elliptic means a negative discriminant: Laplace's equation $u_{xx} + u_{yy} = 0$ has $0 - 4 = -4$, though all its coefficients are positive.",
        "判别式为负时方程是椭圆型，为零时是抛物型，为正时是双曲型。拉普拉斯方程、热方程和波动方程分别是这三种类型的模型，每种类型的解都有自己的行为：椭圆型问题描述稳态，抛物型问题描述平滑的扩散，双曲型问题以有限速度传播波。例如，$u_{xx} + 2u_{xy} + u_{yy} = 0$ 的判别式是 $4 - 4 = 0$，所以它是抛物型。\n\n检验：这个算子是完全平方 $(\\partial_x + \\partial_y)^{2}$，所以它只在一个方向上求两次导，正如热方程只对 $x$ 求两次导。\n\n> **注意。** 椭圆型意味着判别式为负：拉普拉斯方程 $u_{xx} + u_{yy} = 0$ 的判别式是 $0 - 4 = -4$，尽管它的系数都是正的。",
      ],
      (rng) => {
        const p = rng.int(1, 6);
        const q = rng.int(1, 12);
        const kind = rng.pick(["elliptic", "parabolic", "hyperbolic"] as const);
        const words: Record<string, Pair> = {
          elliptic: ["Elliptic", "椭圆型"],
          parabolic: ["Parabolic", "抛物型"],
          hyperbolic: ["Hyperbolic", "双曲型"],
        };
        const needs: Record<string, Pair> = {
          elliptic: ["a negative discriminant", "负的判别式"],
          parabolic: ["a zero discriminant", "为零的判别式"],
          hyperbolic: ["a positive discriminant", "正的判别式"],
        };
        const models: Record<string, Pair> = {
          elliptic: [
            "Laplace's equation $u_{xx} + u_{yy} = 0$, whose discriminant $-4$ is negative too",
            "拉普拉斯方程 $u_{xx} + u_{yy} = 0$，它的判别式 $-4$ 也是负的",
          ],
          parabolic: [
            "the heat equation, written $u_{xx} - u_y = 0$, whose discriminant is $0$ too",
            "热方程，写成 $u_{xx} - u_y = 0$，它的判别式也是 $0$",
          ],
          hyperbolic: [
            "the wave equation $u_{xx} - u_{yy} = 0$, whose discriminant $4$ is positive too",
            "波动方程 $u_{xx} - u_{yy} = 0$，它的判别式 $4$ 也是正的",
          ],
        };
        const B = kind === "parabolic" ? 2 * p * q : rng.int(1, 3);
        const C = kind === "parabolic" ? p * q * q : kind === "elliptic" ? rng.int(B * B, B * B + 9) : -q;
        const third = C > 0 ? `+ ${times(C, "u_{yy}")}` : `- ${times(-C, "u_{yy}")}`;
        const A = kind === "parabolic" ? p : 1;
        const d = B * B - 4 * A * C;
        const slips: Slip[] = (["elliptic", "parabolic", "hyperbolic"] as const)
          .filter((w) => w !== kind)
          .map((w) => [
            words[w] as Pair,
            `That needs ${(needs[w] as Pair)[0]}, but here it is $${d}$.`,
            `那需要${(needs[w] as Pair)[1]}，而这里它是 $${d}$。`,
          ]);
        slips.push([
          ["Not of any type", "不属于任何类型"],
          "Every second-order linear equation with constant coefficients has one of the three types, decided by the sign of its discriminant.",
          "每个常系数二阶线性方程都属于三种类型之一，由判别式的符号决定。",
        ]);
        return chosen(
          rng,
          [
            `What type is $${times(A, "u_{xx}")} + ${times(B, "u_{xy}")} ${third} = 0$?`,
            `$${times(A, "u_{xx}")} + ${times(B, "u_{xy}")} ${third} = 0$ 是什么类型？`,
          ],
          words[kind] as Pair,
          slips,
          [
            [
              ["Compute the discriminant", "计算判别式"],
              [`$B^2 - 4AC = ${B * B} - 4(${A})(${C}) = ${d}$.`, `$B^2 - 4AC = ${B * B} - 4(${A})(${C}) = ${d}$。`],
            ],
            [
              ["Read the sign", "看符号"],
              [
                `Negative means elliptic, zero parabolic and positive hyperbolic, so this equation is ${(words[kind] as Pair)[0].toLowerCase()}.`,
                `负的是椭圆型，零是抛物型，正的是双曲型，所以这个方程是${(words[kind] as Pair)[1]}。`,
              ],
            ],
          ],
          [`It falls in the same class as ${(models[kind] as Pair)[0]}.`, `它与${(models[kind] as Pair)[1]}属于同一类。`],
        );
      },
    ),
  ],
);

const transport = topic(
  "the-transport-equation",
  ["The Transport Equation", "输运方程"],
  ["Solve the simplest first-order equation by following the moving profile.", "沿移动的波形求解最简单的一阶方程。"],
  ["introduction-to-partial-differential-equations"],
  [],
  [
    point(
      "a-value-of-the-moving-profile",
      ["A value of the moving profile", "移动波形的值"],
      [
        "The transport equation says that $u_t + cu_x = 0$. Its solution is the starting profile sliding to the right at speed $c$ without changing shape: $u(x, t) = f(x - ct)$. To find a value, trace back to the point where the profile came from. Substitution confirms that the chain rule makes the two terms cancel. For example, with $c = 2$ and $f(x) = x^{2}$, the value $u(5, 1)$ traces back to $5 - 2 = 3$, so it is $9$.\n\nCheck: $u = (x - 2t)^{2}$ has $u_t = -4(x - 2t)$ and $2u_x = 4(x - 2t)$, which cancel, and at $(5, 1)$ it gives $3^{2} = 9$.\n\n> **Watch out.** For positive $c$ the profile moves right, so trace back by subtracting $ct$ from $x$, not by adding it.",
        "输运方程说，$u_t + cu_x = 0$。它的解是初始波形以速度 $c$ 向右滑动，形状不变：$u(x, t) = f(x - ct)$。求值时，要追溯到波形出发的位置。代入后可以确认，链式法则使这两项相消。例如，$c = 2$，$f(x) = x^{2}$，值 $u(5, 1)$ 追溯到 $5 - 2 = 3$，所以它是 $9$。\n\n检验：$u = (x - 2t)^{2}$ 满足 $u_t = -4(x - 2t)$，$2u_x = 4(x - 2t)$，两者相消；在 $(5, 1)$ 处它等于 $3^{2} = 9$。\n\n> **注意。** $c$ 为正时波形向右移动，所以追溯时要从 $x$ 中减去 $ct$，而不是加上。",
      ],
      (rng) =>
        until(() => {
          const c = rng.int(2, 6);
          const t = rng.int(1, 5);
          const x = rng.int(-6, 14);
          const p = rng.int(1, 5);
          const foot = x - c * t;
          const answer = p * foot * foot;
          const misses: Miss[] = [
            [
              p * x * x,
              "That reads the initial profile at $x$ itself, as if it had not moved.",
              "那在 $x$ 本身读初始波形，好像它没有移动。",
            ],
            [
              p * (x + c * t) * (x + c * t),
              "That traces the wrong way: the profile moves right, so subtract $ct$.",
              "那追溯的方向错了：波形向右移动，所以要减去 $ct$。",
            ],
            [p * foot, "That forgets to square the foot.", "那忘了把起点平方。"],
          ];
          return worked(
            [
              `Let $u_t + ${c}u_x = 0$ with $u(x, 0) = ${times(p, "x^2")}$. What is $u(${x}, ${t})$?`,
              `设 $u_t + ${c}u_x = 0$，$u(x, 0) = ${times(p, "x^2")}$。$u(${x}, ${t})$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Trace back", "追溯"],
                [
                  `$u(x, t) = f(x - ${c}t)$, and the point traces back to $${x} - ${c * t} = ${foot}$.`,
                  `$u(x, t) = f(x - ${c}t)$，这一点追溯到 $${x} - ${c * t} = ${foot}$。`,
                ],
              ],
              [
                ["Read the initial value", "读初始值"],
                [`$f(${foot}) = ${times(p, `(${foot})^2`)} = ${answer}$.`, `$f(${foot}) = ${times(p, `(${foot})^2`)} = ${answer}$。`],
              ],
            ],
            [
              `$u = ${times(p, `(x - ${c}t)^2`)}$ has $u_t = ${-2 * p * c}(x - ${c}t)$ and $${c}u_x = ${2 * p * c}(x - ${c}t)$, which cancel, and at $(${x}, ${t})$ it gives $${answer}$.`,
              `$u = ${times(p, `(x - ${c}t)^2`)}$ 满足 $u_t = ${-2 * p * c}(x - ${c}t)$，$${c}u_x = ${2 * p * c}(x - ${c}t)$，两者相消；在 $(${x}, ${t})$ 处它等于 $${answer}$。`,
            ],
          );
        }),
    ),
    point(
      "the-foot-of-a-characteristic",
      ["The foot of a characteristic", "特征线的起点"],
      [
        "The lines along which the solution stays constant are called characteristics. For speed $c$, they are the straight lines $x - ct$ equal to a constant in the plane of $x$ and $t$. Each one starts from a point on the $x$ axis, called its foot, and carries that point's initial value forward. So the speed may be negative, in which case the characteristics lean to the left. For example, for $u_t + 3u_x = 0$ the characteristic through $(7, 2)$ has $x - 3t = 7 - 6 = 1$, so its foot is $x = 1$.\n\nCheck: starting at $1$ and moving at speed $3$ for time $2$ reaches $1 + 6 = 7$.\n\n> **Watch out.** For a negative speed, $x - ct = x + |c|t$, so the foot lies to the right of the point, not to the left.",
        "解保持不变的那些直线称为特征线。速度为 $c$ 时，它们是 $x - ct$ 等于常数的直线，位于 $x$-$t$ 平面中。每条特征线都从 $x$ 轴上的一点出发，这一点称为它的起点，并把该点的初始值向前传递。速度也可以是负的，这时特征线向左倾斜。例如，对于 $u_t + 3u_x = 0$，经过 $(7, 2)$ 的特征线满足 $x - 3t = 7 - 6 = 1$，所以起点是 $x = 1$。\n\n检验：从 $1$ 出发，以速度 $3$ 走时间 $2$，到达 $1 + 6 = 7$。\n\n> **注意。** 速度为负时，$x - ct = x + |c|t$，所以起点在该点的右边，而不是左边。",
      ],
      (rng) =>
        until(() => {
          const c = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
          const t = rng.int(1, 7);
          const x = rng.int(-9, 12);
          const answer = x - c * t;
          const term = c < 0 ? `- ${-c}u_x` : `+ ${c}u_x`;
          const misses: Miss[] = [
            [
              x + c * t,
              "That moves forward along the characteristic instead of back to $t = 0$.",
              "那是沿特征线向前走，而不是回到 $t = 0$。",
            ],
            [x, "That takes the characteristic to be vertical; it moves with speed $c$.", "那把特征线当成了竖直线；它以速度 $c$ 移动。"],
            [c * t, "That keeps only the distance $ct$ and forgets the starting point $x$.", "那只保留了距离 $ct$，忘了起点 $x$。"],
          ];
          return worked(
            [
              `For $u_t ${term} = 0$, where does the characteristic through $(x, t) = (${x}, ${t})$ meet the $x$ axis?`,
              `对于 $u_t ${term} = 0$，经过 $(x, t) = (${x}, ${t})$ 的特征线与 $x$ 轴交于何处？`,
            ],
            answer,
            misses,
            [
              [
                ["Write the characteristic", "写出特征线"],
                [
                  `Along it $x ${c < 0 ? `+ ${-c}` : `- ${c}`}t$ stays constant.`,
                  `沿特征线 $x ${c < 0 ? `+ ${-c}` : `- ${c}`}t$ 保持不变。`,
                ],
              ],
              [
                ["Set t to zero", "令 t 为零"],
                [
                  `The foot is at $${x} ${c < 0 ? `+ ${-c}` : `- ${c}`} \\cdot ${t} = ${answer}$.`,
                  `起点在 $${x} ${c < 0 ? `+ ${-c}` : `- ${c}`} \\cdot ${t} = ${answer}$。`,
                ],
              ],
            ],
            [
              `Starting at $${answer}$ and moving at speed $${c}$ for time $${t}$ reaches $${answer} ${plus(c * t)} = ${x}$.`,
              `从 $${answer}$ 出发，以速度 $${c}$ 走时间 $${t}$，到达 $${answer} ${plus(c * t)} = ${x}$。`,
            ],
          );
        }),
    ),
  ],
);

const characteristics = topic(
  "the-method-of-characteristics",
  ["The Method of Characteristics", "特征线法"],
  ["Reduce first-order equations to ordinary ones along special curves.", "沿特殊曲线把一阶方程化为常微分方程。"],
  ["the-transport-equation"],
  [["the-transport-equation", 0.5]],
  [
    point(
      "a-constant-source",
      ["A constant source", "常数源项"],
      [
        "The method of characteristics follows a curve along which a first-order equation becomes an ordinary one. With a constant source $s$ on the right side, the solution along a characteristic changes at the rate $s$, rather than remaining constant. So the value at time $t$ is the initial value at the foot, plus $st$. In this way the partial differential equation reduces to a one-line integration. For example, for $u_t + 2u_x = 3$ with $u(x, 0) = x$, the point $(5, 1)$ has foot $5 - 2 = 3$, so $u(5, 1) = 3 + 3 \\cdot 1 = 6$.\n\nCheck: the formula is $u = (x - 2t) + 3t = x + t$, which gives $6$ at $(5, 1)$, and $u_t + 2u_x = 1 + 2 = 3$.\n\n> **Watch out.** The source acts for the whole time $t$, so add $st$, not just $s$.",
        "特征线法沿一条曲线，使一阶方程变成常微分方程。右端有常数源项 $s$ 时，解沿特征线以速率 $s$ 变化，而不是保持不变。所以时刻 $t$ 的值等于起点的初始值加 $st$。这样偏微分方程就化成了一行积分。例如，对于 $u_t + 2u_x = 3$，$u(x, 0) = x$，点 $(5, 1)$ 的起点是 $5 - 2 = 3$，所以 $u(5, 1) = 3 + 3 \\cdot 1 = 6$。\n\n检验：公式是 $u = (x - 2t) + 3t = x + t$，它在 $(5, 1)$ 处等于 $6$，且 $u_t + 2u_x = 1 + 2 = 3$。\n\n> **注意。** 源项作用了整个时间 $t$，所以要加 $st$，而不只是 $s$。",
      ],
      (rng) =>
        until(() => {
          const c = rng.int(2, 5);
          const s = rng.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
          const t = rng.int(1, 6);
          const x = rng.int(0, 20);
          const m = rng.int(2, 7);
          const foot = x - c * t;
          const answer = m * foot + s * t;
          const misses: Miss[] = [
            [
              m * foot,
              "That forgets the source: along a characteristic $u$ changes at the rate $s$.",
              "那忘了源项：沿特征线 $u$ 以速率 $s$ 变化。",
            ],
            [
              m * x + s * t,
              "That reads the initial value at $x$ itself instead of at the foot.",
              "那在 $x$ 本身读初始值，而不是在起点读。",
            ],
            [m * foot - s * t, "That subtracts the source; it is added along the characteristic.", "那减去了源项；沿特征线应当加上它。"],
          ];
          return worked(
            [
              `Let $u_t + ${c}u_x = ${s}$ with $u(x, 0) = ${m}x$. What is $u(${x}, ${t})$?`,
              `设 $u_t + ${c}u_x = ${s}$，$u(x, 0) = ${m}x$。$u(${x}, ${t})$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Trace back", "追溯"],
                [
                  `The foot is $${x} - ${c * t} = ${foot}$, with initial value $${m}(${foot}) = ${m * foot}$.`,
                  `起点是 $${x} - ${c * t} = ${foot}$，初始值是 $${m}(${foot}) = ${m * foot}$。`,
                ],
              ],
              [
                ["Add the source", "加上源项"],
                [`$${m * foot} + (${s})(${t}) = ${answer}$.`, `$${m * foot} + (${s})(${t}) = ${answer}$。`],
              ],
            ],
            [
              `$u = ${m}(x - ${c}t) ${plus(s)}t$ has $u_t + ${c}u_x = ${-m * c} ${plus(s)} + ${m * c} = ${s}$, and at $(${x}, ${t})$ it gives $${answer}$.`,
              `$u = ${m}(x - ${c}t) ${plus(s)}t$ 满足 $u_t + ${c}u_x = ${-m * c} ${plus(s)} + ${m * c} = ${s}$，在 $(${x}, ${t})$ 处它等于 $${answer}$。`,
            ],
          );
        }),
    ),
    point(
      "a-variable-speed",
      ["A variable speed", "变化的速度"],
      [
        "Characteristics need not be straight. For $u_t + xu_x = 0$, the speed at each place is $x$, so a characteristic solves the ordinary equation $\\frac{dx}{dt} = x$, and it is an exponential curve. Following it back from a point at time $t$ lands at $xe^{-t}$. The solution there equals the initial value at that foot. For example, with $u(x, 0) = 2x + 1$, the point $(6, \\ln 3)$ traces back to $6e^{-\\ln 3} = 2$, so $u = 2 \\cdot 2 + 1 = 5$.\n\nCheck: moving forward from $2$ along $x = 2e^{t}$ reaches $2e^{\\ln 3} = 6$ at $t = \\ln 3$.\n\n> **Watch out.** $e^{-\\ln k} = \\frac{1}{k}$, so the foot is $x$ divided by $k$; do not subtract $\\ln k$ from $x$.",
        "特征线不一定是直线。对于方程 $u_t + xu_x = 0$，每处的速度是 $x$，所以特征线满足常微分方程 $\\frac{dx}{dt} = x$，它是指数曲线。从时刻 $t$ 的一点沿它回溯，到达 $xe^{-t}$。这一点的解等于这个起点的初始值。例如，$u(x, 0) = 2x + 1$，点 $(6, \\ln 3)$ 回溯到 $6e^{-\\ln 3} = 2$，所以 $u = 2 \\cdot 2 + 1 = 5$。\n\n检验：从 $2$ 出发沿 $x = 2e^{t}$ 向前，在 $t = \\ln 3$ 时到达 $2e^{\\ln 3} = 6$。\n\n> **注意。** $e^{-\\ln k} = \\frac{1}{k}$，所以起点是 $x$ 除以 $k$；不要从 $x$ 中减去 $\\ln k$。",
      ],
      (rng) =>
        until(() => {
          const k = rng.int(2, 5);
          const foot = rng.int(1, 6);
          const p = rng.int(2, 9);
          const x = k * foot;
          const q = rng.int(1, 9);
          const answer = p * foot + q;
          const misses: Miss[] = [
            [
              p * x + q,
              "That reads the initial value at $x$ itself; the characteristic curves back to a smaller foot.",
              "那在 $x$ 本身读初始值；特征线弯回到一个更小的起点。",
            ],
            [p * foot, `That drops the constant $${q}$ of the initial value.`, `那丢掉了初始值中的常数 $${q}$。`],
            [
              Q.of(p * x, k * k).add(Q.of(q)),
              `That divides by $${k}$ twice; $e^{-\\ln ${k}}$ divides only once.`,
              `那除了两次 $${k}$；$e^{-\\ln ${k}}$ 只除一次。`,
            ],
          ];
          return worked(
            [
              `Let $u_t + xu_x = 0$ with $u(x, 0) = ${p}x + ${q}$. What is $u(${x}, \\ln ${k})$?`,
              `设 $u_t + xu_x = 0$，$u(x, 0) = ${p}x + ${q}$。$u(${x}, \\ln ${k})$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Trace back", "回溯"],
                [
                  `Along $\\frac{dx}{dt} = x$ the foot is $${x}e^{-\\ln ${k}} = \\frac{${x}}{${k}} = ${foot}$.`,
                  `沿 $\\frac{dx}{dt} = x$，起点是 $${x}e^{-\\ln ${k}} = \\frac{${x}}{${k}} = ${foot}$。`,
                ],
              ],
              [
                ["Read the initial value", "读初始值"],
                [`$${p}(${foot}) + ${q} = ${answer}$.`, `$${p}(${foot}) + ${q} = ${answer}$。`],
              ],
            ],
            [
              `Forward from the foot, $x = ${foot}e^{t}$ reaches $${foot}e^{\\ln ${k}} = ${foot} \\cdot ${k} = ${x}$ at $t = \\ln ${k}$, the given point.`,
              `从起点向前，$x = ${foot}e^{t}$ 在 $t = \\ln ${k}$ 时到达 $${foot}e^{\\ln ${k}} = ${foot} \\cdot ${k} = ${x}$，正是给定的点。`,
            ],
          );
        }),
    ),
  ],
);

const separation = topic(
  "separation-of-variables-for-pdes",
  ["Separation of Variables for PDEs", "偏微分方程的分离变量法"],
  ["Split an equation into ordinary equations, and read off eigenvalues.", "把方程拆成常微分方程，并读出特征值。"],
  ["introduction-to-partial-differential-equations", "eigenvalues-and-eigenfunctions-of-homogeneous-bvps"],
  [],
  [
    point(
      "the-eigenvalues-for-fixed-ends",
      ["The eigenvalues for fixed ends", "固定端点的特征值"],
      [
        "Separation of variables looks for solutions that are a product of a function of $x$ and a function of $t$. Substituting and dividing gives one side depending only on $x$ and the other only on $t$, so both equal a constant. The $x$ equation with zero values at both ends then allows only special constants, called eigenvalues: $\\left(\\frac{n\\pi}{L}\\right)^2$, with sines as eigenfunctions. For example, with $L = 2$ the third eigenvalue is $\\left(\\frac{3\\pi}{2}\\right)^{2} = \\frac{9\\pi^{2}}{4}$, with eigenfunction $\\sin\\frac{3\\pi x}{2}$.\n\nCheck: $X = \\sin\\frac{3\\pi x}{2}$ has $X'' = -\\frac{9\\pi^{2}}{4}X$, and $X(2) = \\sin 3\\pi = 0$.\n\n> **Watch out.** The eigenvalue is the square of the frequency $\\frac{n\\pi}{L}$; both $n$ and $L$ are squared.",
        "分离变量法寻找 $x$ 的函数与 $t$ 的函数之积形式的解。代入并相除后，一边只依赖 $x$，另一边只依赖 $t$，所以两边都等于常数。$x$ 的方程在两端取零值时，只允许特殊的常数，称为特征值：$\\left(\\frac{n\\pi}{L}\\right)^2$，特征函数是正弦。例如，$L = 2$ 时第三个特征值是 $\\left(\\frac{3\\pi}{2}\\right)^{2} = \\frac{9\\pi^{2}}{4}$，特征函数是 $\\sin\\frac{3\\pi x}{2}$。\n\n检验：$X = \\sin\\frac{3\\pi x}{2}$ 满足 $X'' = -\\frac{9\\pi^{2}}{4}X$，且 $X(2) = \\sin 3\\pi = 0$。\n\n> **注意。** 特征值是频率 $\\frac{n\\pi}{L}$ 的平方；$n$ 和 $L$ 都要平方。",
      ],
      (rng) =>
        until(() => {
          const L = rng.int(2, 9);
          const n = rng.int(1, 7);
          const answer = Q.of(n * n, L * L);
          const misses: Miss[] = [
            [Q.of(n, L), "That forgets to square the frequency.", "那忘了把频率平方。"],
            [Q.of(n * n, L), `That squares $n$ but not the length $${L}$.`, `那把 $n$ 平方了，却没有把长度 $${L}$ 平方。`],
            [Q.of(L * L, n * n), "That turns the fraction upside down.", "那把分数颠倒了。"],
          ];
          return worked(
            [
              `For $X'' = -\\lambda X$ with $X(0) = X(${L}) = 0$, eigenvalue number ${n} equals $k\\pi^2$. What is $k$?`,
              `对于 $X'' = -\\lambda X$，$X(0) = X(${L}) = 0$，第 ${n} 个特征值等于 $k\\pi^2$。$k$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Fit the sine", "配正弦"],
                [
                  `$X = ${mode(n, L)}$ vanishes at $0$ and at $${L}$, with frequency $${freq(n, L)}$.`,
                  `$X = ${mode(n, L)}$ 在 $0$ 和 $${L}$ 处为零，频率是 $${freq(n, L)}$。`,
                ],
              ],
              [
                ["Square the frequency", "把频率平方"],
                [
                  `$\\lambda = \\left(${freq(n, L)}\\right)^2$, so $k = \\frac{${n * n}}{${L * L}}${Q.of(n * n, L * L).toLatex() === `\\frac{${n * n}}{${L * L}}` ? "" : ` = ${answer.toLatex()}`}$.`,
                  `$\\lambda = \\left(${freq(n, L)}\\right)^2$，所以 $k = \\frac{${n * n}}{${L * L}}${Q.of(n * n, L * L).toLatex() === `\\frac{${n * n}}{${L * L}}` ? "" : ` = ${answer.toLatex()}`}$。`,
                ],
              ],
            ],
            [
              `Differentiating twice, $X'' = -\\left(${freq(n, L)}\\right)^2 X$, and $X(${L}) = \\sin(${times(n, "\\pi")}) = 0$, so the boundary condition holds.`,
              `求导两次得 $X'' = -\\left(${freq(n, L)}\\right)^2 X$，且 $X(${L}) = \\sin(${times(n, "\\pi")}) = 0$，所以边界条件成立。`,
            ],
          );
        }),
    ),
    point(
      "the-time-equation",
      ["The time equation", "时间方程"],
      [
        "Once the eigenvalue is known, the equation for $T$ is an ordinary one that can be solved directly. For diffusion, the time factor satisfies $T' = -c\\lambda T$, whose solution is an exponential decay at the rate $c$ times the eigenvalue. Thus each mode has its own rate, fixed by the same constant that the $x$ equation supplied, and the two equations stay linked through it. For example, with $c = 3$, $\\lambda = 2$ and $T(0) = 5$, the time factor is $T = 5e^{-6t}$.\n\nCheck: $T' = -30e^{-6t} = -6T = -3 \\cdot 2 \\cdot T$, as the equation requires.\n\n> **Watch out.** The starting value $T(0)$ multiplies the exponential; it does not enter the rate.",
        "知道特征值后，$T$ 的方程就是可以直接求解的常微分方程。对扩散问题，时间因子满足 $T' = -c\\lambda T$，它的解是以 $c$ 乘特征值为速率的指数衰减。因此每个模态都有自己的速率，由 $x$ 的方程提供的同一个常数确定，两个方程通过它保持联系。例如，$c = 3$，$\\lambda = 2$，$T(0) = 5$ 时，时间因子是 $T = 5e^{-6t}$。\n\n检验：$T' = -30e^{-6t} = -6T = -3 \\cdot 2 \\cdot T$，正合方程要求。\n\n> **注意。** 初值 $T(0)$ 乘在指数函数前面；它不进入速率。",
      ],
      (rng) =>
        until(() => {
          const c = rng.int(2, 9);
          const T0 = rng.int(2, 15);
          const lambda = rng.int(2, 9);
          const t = rng.int(2, 5);
          const asksRate = rng.bool();
          const rate = c * lambda;
          const answer = rate * (asksRate ? 1 : t);
          const misses: Miss[] = [
            [lambda * (asksRate ? 1 : t), `That drops the factor $${c}$ from the rate.`, `那从速率中丢掉了因子 $${c}$。`],
            [c * (asksRate ? 1 : t), `That drops the eigenvalue $${lambda}$ from the rate.`, `那从速率中丢掉了特征值 $${lambda}$。`],
            [
              T0 * answer,
              `That lets $T(0) = ${T0}$ into the exponent; it only multiplies the exponential.`,
              `那让 $T(0) = ${T0}$ 进入了指数；它只乘在指数函数前面。`,
            ],
          ];
          if (!asksRate)
            misses.push([
              rate,
              `That is the rate; at time $${t}$ the exponent is the rate times $${t}$.`,
              `那是速率；在时刻 $${t}$，指数是速率乘以 $${t}$。`,
            ]);
          return worked(
            [
              `Separating $u_t = ${c}u_{xx}$ gives $T' = -${c}\\lambda T$. With $\\lambda = ${lambda}$ and $T(0) = ${T0}$, ${asksRate ? `$T(t) = ${T0}e^{-kt}$. What is $k$?` : `$T(${t}) = ${T0}e^{-k}$. What is $k$?`}`,
              `分离 $u_t = ${c}u_{xx}$ 得 $T' = -${c}\\lambda T$。若 $\\lambda = ${lambda}$，$T(0) = ${T0}$，${asksRate ? `$T(t) = ${T0}e^{-kt}$。$k$ 是多少？` : `$T(${t}) = ${T0}e^{-k}$。$k$ 是多少？`}`,
            ],
            answer,
            misses,
            [
              [
                ["Solve for T", "解出 T"],
                [`$T' = -${rate}T$ gives $T = ${T0}e^{-${rate}t}$.`, `$T' = -${rate}T$ 给出 $T = ${T0}e^{-${rate}t}$。`],
              ],
              [
                ["Read the exponent", "读出指数"],
                asksRate
                  ? [
                      `The rate is $${c} \\cdot ${lambda} = ${rate}$, so $k = ${answer}$.`,
                      `速率是 $${c} \\cdot ${lambda} = ${rate}$，所以 $k = ${answer}$。`,
                    ]
                  : [
                      `At $t = ${t}$ the exponent is $-${rate} \\cdot ${t} = -${answer}$, so $k = ${answer}$.`,
                      `在 $t = ${t}$ 时指数是 $-${rate} \\cdot ${t} = -${answer}$，所以 $k = ${answer}$。`,
                    ],
              ],
            ],
            [
              `Differentiating $${T0}e^{-${rate}t}$ gives $-${T0 * rate}e^{-${rate}t} = -${rate}T$, and $${c}\\lambda = ${c} \\cdot ${lambda} = ${rate}$, so the equation holds.`,
              `对 $${T0}e^{-${rate}t}$ 求导得 $-${T0 * rate}e^{-${rate}t} = -${rate}T$，而 $${c}\\lambda = ${c} \\cdot ${lambda} = ${rate}$，所以方程成立。`,
            ],
          );
        }),
    ),
  ],
);

const heatEquation = topic(
  "the-heat-equation",
  ["The Heat Equation", "热方程"],
  ["Check solutions of the heat equation, and find its steady state.", "验证热方程的解，并求它的稳态。"],
  ["separation-of-variables-for-pdes"],
  [],
  [
    point(
      "a-decaying-solution",
      ["A decaying solution", "衰减的解"],
      [
        "The heat equation $u_t = c u_{xx}$ says that the temperature rises at a rate proportional to $u_{xx}$. Where the profile curves upward, the point is cooler than its neighbours and warms; where it curves downward, it cools. The constant $c$, called the diffusivity, sets the speed. High-frequency wiggles have large curvature, and so they decay quickly, which explains why heat flow smooths everything out. For example, $u = e^{-kt}\\sin 2x$ solves $u_t = 3u_{xx}$ when $-k = 3 \\cdot (-4)$, that is $k = 12$.\n\nCheck: with $k = 12$, $u_t = -12u$ and $3u_{xx} = 3 \\cdot (-4u) = -12u$.\n\n> **Watch out.** Differentiating $\\sin nx$ twice brings down $-n^{2}$, not $-n$; the amplitude in front cancels from both sides.",
        "热方程 $u_t = c u_{xx}$ 说，温度上升的速率与 $u_{xx}$ 成正比。波形向上弯的地方，这一点比邻近的点冷，因而升温；向下弯的地方则降温。常数 $c$ 称为扩散系数，它决定速度。高频的起伏曲率大，所以衰减很快，这解释了为什么热流会把一切都抹平。例如，$u = e^{-kt}\\sin 2x$ 满足 $u_t = 3u_{xx}$ 当且仅当 $-k = 3 \\cdot (-4)$，即 $k = 12$。\n\n检验：取 $k = 12$，$u_t = -12u$，$3u_{xx} = 3 \\cdot (-4u) = -12u$。\n\n> **注意。** $\\sin nx$ 求导两次带下 $-n^{2}$，不是 $-n$；前面的振幅在两边相消。",
      ],
      (rng) =>
        until(() => {
          const c = rng.int(2, 12);
          const n = rng.int(2, 7);
          const a = rng.int(2, 9);
          const answer = c * n * n;
          const misses: Miss[] = [
            [
              c * n,
              `That takes $u_{xx}$ to be $-${n}u$; differentiating twice gives $-${n * n}u$.`,
              `那把 $u_{xx}$ 当成了 $-${n}u$；求导两次得 $-${n * n}u$。`,
            ],
            [n * n, `That drops the diffusivity $${c}$.`, `那丢掉了扩散系数 $${c}$。`],
            [
              a * answer,
              `That multiplies by the amplitude $${a}$, which cancels from both sides.`,
              `那乘上了振幅 $${a}$，而它在两边相消。`,
            ],
          ];
          return worked(
            [
              `For which $k$ does $u = ${a}e^{-kt}\\sin(${n}x)$ solve $u_t = ${c}u_{xx}$?`,
              `当 $k$ 为何值时，$u = ${a}e^{-kt}\\sin(${n}x)$ 满足 $u_t = ${c}u_{xx}$？`,
            ],
            answer,
            misses,
            [
              [
                ["Differentiate", "求导"],
                [`$u_t = -ku$ and $u_{xx} = -${n * n}u$.`, `$u_t = -ku$，$u_{xx} = -${n * n}u$。`],
              ],
              [
                ["Match the two sides", "比较两边"],
                [
                  `$-ku = ${c}(-${n * n}u)$, so $k = ${c} \\cdot ${n * n} = ${answer}$.`,
                  `$-ku = ${c}(-${n * n}u)$，所以 $k = ${c} \\cdot ${n * n} = ${answer}$。`,
                ],
              ],
            ],
            [
              `At $x = \\frac{\\pi}{${2 * n}}$ and $t = 0$ the sine is $1$: there $u_t = -${a * answer}$ and $${c}u_{xx} = ${c} \\cdot (-${a * n * n}) = -${a * answer}$.`,
              `在 $x = \\frac{\\pi}{${2 * n}}$，$t = 0$ 处正弦为 $1$：这时 $u_t = -${a * answer}$，$${c}u_{xx} = ${c} \\cdot (-${a * n * n}) = -${a * answer}$。`,
            ],
          );
        }),
    ),
    point(
      "the-steady-state",
      ["The steady state", "稳态"],
      [
        "With the ends of a rod held at fixed temperatures, the solution settles down as time passes. In the limit $u_t = 0$, so $u_{xx} = 0$ as well, and the temperature is a straight line joining the two end values. The initial temperature leaves no trace in the limit, since the boundary values alone determine this steady state. For example, with $u(0) = 10$ and $u(4) = 30$ the line has slope $5$, so at $x = 1$ the temperature approaches $10 + 5 = 15$.\n\nCheck: from the other end, $30 - 5 \\cdot 3 = 15$.\n\n> **Watch out.** The answer is the value of the line at that point, not the average of the two ends, unless the point is the midpoint.",
        "杆的两端保持固定温度时，解随时间趋于稳定。在极限情况下 $u_t = 0$，所以 $u_{xx}$ 也为零，温度是连接两端值的一条直线。初始温度在极限中不留痕迹，因为这个稳态完全由边界值决定。例如，$u(0) = 10$，$u(4) = 30$ 时直线的斜率是 $5$，所以 $x = 1$ 处的温度趋于 $10 + 5 = 15$。\n\n检验：从另一端算，$30 - 5 \\cdot 3 = 15$。\n\n> **注意。** 答案是直线在那一点的值，不是两端的平均值，除非那一点是中点。",
      ],
      (rng) =>
        until(() => {
          const L = rng.int(2, 10);
          const slope = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
          const A = rng.int(-10, 30);
          const B = A + slope * L;
          const x = rng.int(1, L - 1);
          const answer = A + slope * x;
          const misses: Miss[] = [
            [Q.of(A + B, 2), "That is the average of the two ends, the value only at the midpoint.", "那是两端的平均值，只是中点处的值。"],
            [A, "That is the value at the left end; the line changes along the rod.", "那是左端的值；直线沿杆变化。"],
            [B, "That is the value at the right end; the line changes along the rod.", "那是右端的值；直线沿杆变化。"],
          ];
          return worked(
            [
              `A rod on $[0, ${L}]$ obeys the heat equation with $u(0, t) = ${A}$ and $u(${L}, t) = ${B}$. What does the temperature at $x = ${x}$ approach as $t \\to \\infty$?`,
              `$[0, ${L}]$ 上的杆满足热方程，$u(0, t) = ${A}$，$u(${L}, t) = ${B}$。当 $t \\to \\infty$ 时，$x = ${x}$ 处的温度趋于多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Find the line", "求直线"],
                [
                  `The steady state has $u_{xx} = 0$, so it is the line through the end values, with slope $\\frac{${B} - ${A < 0 ? `(${A})` : A}}{${L}} = ${slope}$.`,
                  `稳态满足 $u_{xx} = 0$，所以它是过两端值的直线，斜率是 $\\frac{${B} - ${A < 0 ? `(${A})` : A}}{${L}} = ${slope}$。`,
                ],
              ],
              [
                ["Evaluate", "求值"],
                [
                  `At $x = ${x}$ it equals $${A} ${plus(slope * x)} = ${answer}$.`,
                  `在 $x = ${x}$ 处它等于 $${A} ${plus(slope * x)} = ${answer}$。`,
                ],
              ],
            ],
            [
              `From the other end: $${B} ${plus(-slope * (L - x))} = ${answer}$.`,
              `从另一端算：$${B} ${plus(-slope * (L - x))} = ${answer}$。`,
            ],
          );
        }),
    ),
  ],
);

const heatSeries = topic(
  "solving-the-heat-equation-on-an-interval",
  ["Solving the Heat Equation on an Interval", "解区间上的热方程"],
  ["Build solutions from sine modes, and compare their decay rates.", "由正弦模态构造解，并比较它们的衰减速率。"],
  ["the-heat-equation", "fourier-sine-series"],
  [["the-heat-equation", 0.4]],
  [
    point(
      "the-exponent-of-a-mode",
      ["The exponent of a mode", "模态的指数"],
      [
        "With both ends held at zero, an initial temperature equal to one sine mode stays in that shape and merely shrinks. Mode $n$ on an interval of length $L$ decays by the factor $e^{-c(n\\pi/L)^2 t}$. A general initial temperature is a Fourier sine series, and then each of its terms decays on its own, by this same formula. For example, for $u_t = 2u_{xx}$ on $[0, 3]$ with $u(x, 0) = \\sin\\frac{2\\pi x}{3}$, the exponent is $2\\left(\\frac{2\\pi}{3}\\right)^{2} t = \\frac{8\\pi^{2}}{9}t$.\n\nCheck: $u = e^{-\\frac{8\\pi^{2}}{9}t}\\sin\\frac{2\\pi x}{3}$ has $u_t = -\\frac{8\\pi^{2}}{9}u$ and $2u_{xx} = 2 \\cdot \\left(-\\frac{4\\pi^{2}}{9}\\right)u$, the same.\n\n> **Watch out.** The length enters squared: doubling the rod divides the decay rate by four.",
        "两端保持为零时，等于一个正弦模态的初始温度保持这个形状，只是不断缩小。长度为 $L$ 的区间上第 $n$ 个模态按因子 $e^{-c(n\\pi/L)^2 t}$ 衰减。一般的初始温度是傅里叶正弦级数，这时每一项都按同样的公式各自衰减。例如，$[0, 3]$ 上 $u_t = 2u_{xx}$，$u(x, 0) = \\sin\\frac{2\\pi x}{3}$，指数是 $2\\left(\\frac{2\\pi}{3}\\right)^{2} t = \\frac{8\\pi^{2}}{9}t$。\n\n检验：$u = e^{-\\frac{8\\pi^{2}}{9}t}\\sin\\frac{2\\pi x}{3}$ 满足 $u_t = -\\frac{8\\pi^{2}}{9}u$，$2u_{xx} = 2 \\cdot \\left(-\\frac{4\\pi^{2}}{9}\\right)u$，两者相同。\n\n> **注意。** 长度以平方进入：杆长加倍，衰减速率变为四分之一。",
      ],
      (rng) =>
        until(() => {
          const c = rng.int(1, 9);
          const L = rng.int(2, 6);
          const n = rng.int(1, 6);
          const a = rng.int(2, 15);
          const answer = Q.of(c * n * n, L * L);
          const misses: Miss[] = [
            [Q.of(c * n, L), "That forgets to square the frequency.", "那忘了把频率平方。"],
            [Q.of(c * n * n, L), `That squares $n$ but not the length $${L}$.`, `那把 $n$ 平方了，却没有把长度 $${L}$ 平方。`],
            [
              Q.of(n * n, L * L).add(Q.of(c)),
              "That adds the diffusivity instead of multiplying by it.",
              "那是加上扩散系数，而不是乘以它。",
            ],
          ];
          return worked(
            [
              `Let $u_t = ${times(c, "u_{xx}")}$ on $[0, ${L}]$ with zero ends and $u(x, 0) = ${a}${mode(n, L)}$. The factor in time is $e^{-k\\pi^2 t}$. What is $k$?`,
              `设 $[0, ${L}]$ 上 $u_t = ${times(c, "u_{xx}")}$，两端为零，$u(x, 0) = ${a}${mode(n, L)}$。时间因子是 $e^{-k\\pi^2 t}$。$k$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Find the eigenvalue", "求特征值"],
                [
                  `The mode has frequency $${freq(n, L)}$, so $\\lambda = \\left(${freq(n, L)}\\right)^2 = \\frac{${n * n}\\pi^2}{${L * L}}$.`,
                  `这个模态的频率是 $${freq(n, L)}$，所以 $\\lambda = \\left(${freq(n, L)}\\right)^2 = \\frac{${n * n}\\pi^2}{${L * L}}$。`,
                ],
              ],
              [
                ["Multiply by the diffusivity", "乘以扩散系数"],
                [
                  `The exponent is $${c === 1 ? "" : `${c} \\cdot `}\\frac{${n * n}\\pi^2}{${L * L}} t$, so $k = ${answer.toLatex()}$.`,
                  `指数是 $${c === 1 ? "" : `${c} \\cdot `}\\frac{${n * n}\\pi^2}{${L * L}} t$，所以 $k = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `Substitute: $u_t = -${answer.toLatex()}\\pi^2 u$ and $${times(c, "u_{xx}")} = ${c === 1 ? "" : `${c} \\cdot `}\\left(-\\frac{${n * n}\\pi^2}{${L * L}}\\right)u$, which agree.`,
              `代入：$u_t = -${answer.toLatex()}\\pi^2 u$，$${times(c, "u_{xx}")} = ${c === 1 ? "" : `${c} \\cdot `}\\left(-\\frac{${n * n}\\pi^2}{${L * L}}\\right)u$，两者一致。`,
            ],
          );
        }),
    ),
    point(
      "comparing-two-modes",
      ["Comparing two modes", "比较两个模态"],
      [
        "Decay rates grow with the square of the mode number, so higher modes vanish far sooner than lower ones. Mode three decays nine times as fast as mode one. For this reason, after a short time the solution looks like its lowest surviving mode, and a single term of the series often gives an accurate approximation. The high modes make the solution smooth for every positive time. For example, mode $4$ against mode $2$ decays $\\frac{16}{4} = 4$ times as fast.\n\nCheck: the rates are $16c\\left(\\frac{\\pi}{L}\\right)^{2}$ and $4c\\left(\\frac{\\pi}{L}\\right)^{2}$, and $4 \\cdot 4 = 16$.\n\n> **Watch out.** The ratio is of the squares: mode $2$ decays four times as fast as mode $1$, not twice.",
        "衰减速率随模态序号的平方增长，所以高阶模态比低阶模态消失得快得多。第三个模态的衰减速度是第一个的九倍。因此经过很短时间后，解看起来就像它最低的留存模态，级数的一项往往就是准确的近似。高阶模态的快速消失使解在任何正时刻都是光滑的。例如，第 $4$ 个模态与第 $2$ 个相比，衰减快 $\\frac{16}{4} = 4$ 倍。\n\n检验：两者的速率是 $16c\\left(\\frac{\\pi}{L}\\right)^{2}$ 和 $4c\\left(\\frac{\\pi}{L}\\right)^{2}$，而 $4 \\cdot 4 = 16$。\n\n> **注意。** 比的是平方：第 $2$ 个模态的衰减速度是第 $1$ 个的四倍，不是两倍。",
      ],
      (rng) =>
        until(() => {
          const m = rng.int(1, 5);
          const n = m + rng.int(1, 6);
          const answer = Q.of(n * n, m * m);
          const misses: Miss[] = [
            [
              Q.of(n, m),
              "That compares the mode numbers; the rates go with their squares.",
              "那比较的是模态序号；速率与序号的平方成正比。",
            ],
            [Q.of(n * n - m * m), "That subtracts the squares; the question asks for a ratio.", "那把平方相减了；问的是比值。"],
            [
              Q.of(m * m, n * n),
              "That is the ratio the other way round; the higher mode is the faster.",
              "那是反过来的比值；高阶模态衰减得更快。",
            ],
          ];
          return worked(
            [
              `On an interval with zero ends, how many times as fast as mode ${m} does mode ${n} of the heat equation decay?`,
              `在两端为零的区间上，热方程的第 ${n} 个模态的衰减速度是第 ${m} 个模态的多少倍？`,
            ],
            answer,
            misses,
            [
              [
                ["Write the rates", "写出速率"],
                [
                  `Mode $j$ decays at the rate $c\\left(\\frac{j\\pi}{L}\\right)^2 = j^2 \\cdot c\\left(\\frac{\\pi}{L}\\right)^2$.`,
                  `第 $j$ 个模态的衰减速率是 $c\\left(\\frac{j\\pi}{L}\\right)^2 = j^2 \\cdot c\\left(\\frac{\\pi}{L}\\right)^2$。`,
                ],
              ],
              [
                ["Divide", "相除"],
                [
                  `The common factor cancels: $\\frac{${n}^2}{${m}^2} = ${answer.toLatex()}$.`,
                  `公因子相消：$\\frac{${n}^2}{${m}^2} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `Multiplying back, $${m * m} \\cdot ${answer.toLatex()} = ${n * n}$, the square of ${n}.`,
              `反乘回去，$${m * m} \\cdot ${answer.toLatex()} = ${n * n}$，正是 ${n} 的平方。`,
            ],
          );
        }),
    ),
  ],
);

const insulated = topic(
  "the-heat-equation-with-insulated-ends",
  ["The Heat Equation with Insulated Ends", "两端绝热的热方程"],
  ["Use cosine modes, and find the temperature that remains in the long run.", "使用余弦模态，并求长时间后留下的温度。"],
  ["solving-the-heat-equation-on-an-interval", "fourier-cosine-series"],
  [],
  [
    point(
      "the-limit-from-a-cosine-series",
      ["The limit from a cosine series", "由余弦级数得极限"],
      [
        "An insulated end lets no heat through, which means that $u_x = 0$ there. The eigenfunctions are then cosines, and one eigenvalue is zero, with the constant as its eigenfunction. Every other mode decays, so the solution tends to that constant term of the series. With the ends sealed, no heat escapes, so the limit is simply the temperature that spreads the heat evenly. For example, on $[0, 2]$ with $u(x, 0) = 5 + 3\\cos\\frac{\\pi x}{2}$, the cosine term decays and $u$ tends to $5$.\n\nCheck: the cosine integrates to $0$ over $[0, 2]$, so the average of the initial temperature is $\\frac{10}{2} = 5$, which is the heat that stays.\n\n> **Watch out.** Insulated ends do not drive the temperature to zero; the heat stays in the rod.",
        "绝热的端点不让热量通过，这意味着那里 $u_x = 0$。这时特征函数是余弦，有一个特征值为零，对应的特征函数是常数。其他每个模态都衰减，所以解趋于级数的常数项。两端封闭时热量不会散失，所以极限就是热量均匀分布时的温度。例如，$[0, 2]$ 上 $u(x, 0) = 5 + 3\\cos\\frac{\\pi x}{2}$，余弦项衰减，$u$ 趋于 $5$。\n\n检验：余弦在 $[0, 2]$ 上的积分为 $0$，所以初始温度的平均值是 $\\frac{10}{2} = 5$，这就是留下来的热量。\n\n> **注意。** 绝热的端点不会把温度拉到零；热量留在杆里。",
      ],
      (rng) =>
        until(() => {
          const L = rng.int(1, 6);
          const a = rng.int(-9, 30);
          const b = rng.pick([-8, -7, -5, -4, -3, -2, 2, 3, 4, 5, 7, 8]);
          const n = rng.int(1, 5);
          const c = rng.int(1, 4);
          const misses: Miss[] = [
            [
              0,
              "That treats the ends as held at zero; insulated ends keep the heat in.",
              "那把端点当成了保持为零；绝热的端点把热量留在里面。",
            ],
            [b, "That keeps the cosine coefficient, but the cosine mode decays.", "那保留了余弦的系数，但余弦模态会衰减。"],
            [
              a + b,
              "That is the initial temperature at $x = 0$; the cosine part dies away.",
              "那是 $x = 0$ 处的初始温度；余弦部分会消失。",
            ],
            [a - b, "That subtracts the cosine coefficient; the cosine part dies away.", "那减去了余弦的系数；余弦部分会消失。"],
          ];
          return worked(
            [
              `Let $u_t = ${times(c, "u_{xx}")}$ on $[0, ${L}]$ with insulated ends and $u(x, 0) = ${shifted(`${b}${mode(n, L, "\\cos")}`, a)}$. What does $u$ approach as $t \\to \\infty$?`,
              `设 $[0, ${L}]$ 上 $u_t = ${times(c, "u_{xx}")}$，两端绝热，$u(x, 0) = ${shifted(`${b}${mode(n, L, "\\cos")}`, a)}$。当 $t \\to \\infty$ 时 $u$ 趋于多少？`,
            ],
            a,
            misses,
            [
              [
                ["Let the cosine decay", "让余弦衰减"],
                [
                  `The cosine mode has a positive eigenvalue, so it is multiplied by a decaying exponential and tends to $0$.`,
                  `余弦模态的特征值为正，所以它乘以衰减的指数函数，趋于 $0$。`,
                ],
              ],
              [
                ["Keep the constant", "保留常数"],
                [`The constant term has eigenvalue zero, so $${a}$ remains.`, `常数项的特征值为零，所以 $${a}$ 留下来。`],
              ],
            ],
            [
              `The cosine integrates to $0$ over $[0, ${L}]$, so the average initial temperature is $${a}$, and with no heat lost the limit must be that average.`,
              `余弦在 $[0, ${L}]$ 上的积分为 $0$，所以初始温度的平均值是 $${a}$；热量没有散失，极限必定是这个平均值。`,
            ],
          );
        }),
    ),
    point(
      "the-limit-is-the-average",
      ["The limit is the average", "极限是平均值"],
      [
        "The constant term of a cosine series is the average of the function over the interval, so with insulated ends the limit is the average of the initial temperature. This agrees with conservation of heat: the total heat never changes, as it cannot leave, and the integral of the temperature over the rod stays fixed. Dividing this integral by the length gives the final uniform temperature. For example, a rod on $[0, 4]$ with initial temperature $2x + 1$ holds $\\int_0^4 (2x + 1)\\,dx = 20$, so it approaches $\\frac{20}{4} = 5$.\n\nCheck: a linear function averages to its value at the midpoint, $2 \\cdot 2 + 1 = 5$.\n\n> **Watch out.** Divide the integral by the length of the rod; the integral itself is the total heat, not the temperature.",
        "余弦级数的常数项是函数在区间上的平均值，所以两端绝热时，极限是初始温度的平均值。这与热量守恒一致：总热量不变，因为它出不去，温度在杆上的积分保持不变。用这个积分除以长度，就得到最终的均匀温度。例如，$[0, 4]$ 上初始温度为 $2x + 1$ 的杆，$\\int_0^4 (2x + 1)\\,dx = 20$，所以它趋于 $\\frac{20}{4} = 5$。\n\n检验：线性函数的平均值等于它在中点的值，$2 \\cdot 2 + 1 = 5$。\n\n> **注意。** 要用积分除以杆长；积分本身是总热量，不是温度。",
      ],
      (rng) =>
        until(() => {
          const L = rng.int(2, 12);
          const m = rng.int(1, 9);
          const b = rng.int(-9, 9);
          const answer = Q.of(m * L, 2).add(Q.of(b));
          const total = Q.of(m * L * L, 2).add(Q.of(b * L));
          const initial = shifted(times(m, "x"), b);
          const misses: Miss[] = [
            [
              Q.of(m * L).add(Q.of(b)),
              `That is the initial temperature at the right end $x = ${L}$.`,
              `那是右端 $x = ${L}$ 处的初始温度。`,
            ],
            [Q.of(b), "That is the initial temperature at the left end $x = 0$.", "那是左端 $x = 0$ 处的初始温度。"],
            [total, "That is the total heat, the integral; divide it by the length.", "那是总热量，即积分；还要除以长度。"],
          ];
          return worked(
            [
              `A rod on $[0, ${L}]$ has insulated ends and initial temperature $${initial}$. What temperature does it approach?`,
              `$[0, ${L}]$ 上的杆两端绝热，初始温度是 $${initial}$。它趋于什么温度？`,
            ],
            answer,
            misses,
            [
              [
                ["Find the total heat", "求总热量"],
                [`$\\int_0^{${L}} (${initial})\\,dx = ${total.toLatex()}$.`, `$\\int_0^{${L}} (${initial})\\,dx = ${total.toLatex()}$。`],
              ],
              [
                ["Divide by the length", "除以长度"],
                [
                  `The final temperature is $\\frac{1}{${L}} \\cdot ${total.sign() < 0 ? `\\left(${total.toLatex()}\\right)` : total.toLatex()} = ${answer.toLatex()}$.`,
                  `最终温度是 $\\frac{1}{${L}} \\cdot ${total.sign() < 0 ? `\\left(${total.toLatex()}\\right)` : total.toLatex()} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `A linear function averages to its value at the midpoint $x = ${Q.of(L, 2).toLatex()}$, which is $${answer.toLatex()}$.`,
              `线性函数的平均值等于它在中点 $x = ${Q.of(L, 2).toLatex()}$ 处的值，也就是 $${answer.toLatex()}$。`,
            ],
          );
        }),
    ),
  ],
);

const nonhomogeneous = topic(
  "nonhomogeneous-heat-problems",
  ["Nonhomogeneous Heat Problems", "非齐次热问题"],
  ["Remove nonzero boundary values, and find steady states with a heat source.", "消去非零边界值，并求有热源时的稳态。"],
  ["solving-the-heat-equation-on-an-interval"],
  [],
  [
    point(
      "subtracting-the-steady-state",
      ["Subtracting the steady state", "减去稳态"],
      [
        "Series methods need zero boundary values, so nonzero ones are removed first. Write the solution as the steady state plus a remainder. The remainder then satisfies the same heat equation with zero ends, so sine modes apply. Its initial value is the given initial temperature minus the steady state, and this difference is what must be expanded in the Fourier sine series, not the original function. For example, on $[0, 4]$ with $u(0, t) = 10$, $u(4, t) = 30$ and initial temperature $50$, the steady state is $10 + 5x$, so $v(1, 0) = 50 - 15 = 35$.\n\nCheck: for $t > 0$, $v = u - (10 + 5x)$ is $10 - 10 = 0$ at $x = 0$ and $30 - 30 = 0$ at $x = 4$, and adding back, $15 + 35 = 50$ is the given initial temperature at $x = 1$.\n\n> **Watch out.** Subtract the steady state, not the end values alone; the remainder starts at the initial temperature minus the whole line.",
        "级数方法要求边界值为零，所以要先消去非零的边界值。把解写成稳态加上余项。余项满足同样的热方程，两端为零，所以可以用正弦模态。它的初始值是给定的初始温度减去稳态，要展开成傅里叶正弦级数的正是这个差，而不是原来的函数。例如，$[0, 4]$ 上 $u(0, t) = 10$，$u(4, t) = 30$，初始温度为 $50$，稳态是 $10 + 5x$，所以 $v(1, 0) = 50 - 15 = 35$。\n\n检验：$t > 0$ 时，$v = u - (10 + 5x)$ 在 $x = 0$ 处是 $10 - 10 = 0$，在 $x = 4$ 处是 $30 - 30 = 0$；加回去，$15 + 35 = 50$ 正是 $x = 1$ 处给定的初始温度。\n\n> **注意。** 要减去稳态，而不只是端点值；余项的初值是初始温度减去整条直线。",
      ],
      (rng) =>
        until(() => {
          const L = rng.int(2, 8);
          const slope = rng.int(1, 6);
          const A = rng.int(0, 20);
          const B = A + slope * L;
          const x = rng.int(1, L - 1);
          const start = rng.int(20, 90);
          const steady = A + slope * x;
          const answer = start - steady;
          const misses: Miss[] = [
            [start, "That forgets to subtract the steady state.", "那忘了减去稳态。"],
            [steady, `That is the steady state at $x = ${x}$ itself, not the remainder.`, `那是 $x = ${x}$ 处的稳态本身，不是余项。`],
            [
              start - A,
              `That subtracts only the left end value $${A}$; the steady state at $x = ${x}$ is $${steady}$.`,
              `那只减去了左端值 $${A}$；$x = ${x}$ 处的稳态是 $${steady}$。`,
            ],
          ];
          return worked(
            [
              `A rod on $[0, ${L}]$ has $u(0, t) = ${A}$, $u(${L}, t) = ${B}$ and initial temperature ${start} throughout. Write $u$ as the steady state plus $v$. What is $v(${x}, 0)$?`,
              `$[0, ${L}]$ 上的杆有 $u(0, t) = ${A}$，$u(${L}, t) = ${B}$，初始温度处处为 ${start}。把 $u$ 写成稳态加 $v$。$v(${x}, 0)$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Find the steady state", "求稳态"],
                [
                  `It is the line $${A} + ${times(slope, "x")}$, which at $x = ${x}$ equals $${steady}$.`,
                  `它是直线 $${A} + ${times(slope, "x")}$，在 $x = ${x}$ 处等于 $${steady}$。`,
                ],
              ],
              [
                ["Subtract", "相减"],
                [`$v(${x}, 0) = ${start} - ${steady} = ${answer}$.`, `$v(${x}, 0) = ${start} - ${steady} = ${answer}$。`],
              ],
            ],
            [
              `Adding back, $${steady} ${plus(answer)} = ${start}$, the given initial temperature, and $v$ has zero ends because the line takes the end values $${A}$ and $${B}$.`,
              `加回去，$${steady} ${plus(answer)} = ${start}$，正是给定的初始温度；而直线取到端点值 $${A}$ 和 $${B}$，所以 $v$ 的两端为零。`,
            ],
          );
        }),
    ),
    {
      ...point(
        "a-steady-state-with-a-source",
        ["A steady state with a source", "有热源的稳态"],
        [
          "A heat source adds a constant to the right side of the equation. In the steady state the time derivative is zero, so the second $x$ derivative equals minus the source divided by the diffusivity, and the temperature is a parabola rather than a line. With both ends at zero, it is $\\frac{qx(L - x)}{2c}$, and the rod is hottest in the middle. In the drawing, $q = 2$, $c = 1$ and $L = 2$, so the steady state is $\\frac{2x(2 - x)}{2} = x(2 - x)$, which reaches $1$ at the middle, $x = 1$.\n\nCheck: $u = x(2 - x) = 2x - x^{2}$ has $u'' = -2 = -\\frac{q}{c}$, and $u(0) = u(2) = 0$.\n\n> **Watch out.** Integrating $u'' = -\\frac{q}{c}$ twice brings a factor $\\frac{1}{2}$; forgetting it doubles every temperature.",
          "热源在方程右端加了一个常数。在稳态下时间导数为零，所以对 $x$ 的二阶导数等于负的热源除以扩散系数，温度是抛物线而不是直线。两端为零时，它等于 $\\frac{qx(L - x)}{2c}$，杆的中间最热。图中 $q = 2$，$c = 1$，$L = 2$，所以稳态是 $\\frac{2x(2 - x)}{2} = x(2 - x)$，在中点 $x = 1$ 处达到 $1$。\n\n检验：$u = x(2 - x) = 2x - x^{2}$ 满足 $u'' = -2 = -\\frac{q}{c}$，且 $u(0) = u(2) = 0$。\n\n> **注意。** 把 $u'' = -\\frac{q}{c}$ 积分两次会带来因子 $\\frac{1}{2}$；忘了它，每个温度都会加倍。",
        ],
        (rng) =>
          until(() => {
            const L = rng.int(2, 12);
            const x = rng.int(1, L - 1);
            const c = rng.int(1, 6);
            const q = rng.int(1, 12);
            const answer = Q.of(q * x * (L - x), 2 * c);
            const misses: Miss[] = [
              [
                Q.of(q * x * (L - x), c),
                "That forgets the factor $\\frac{1}{2}$ from integrating twice.",
                "那忘了积分两次带来的因子 $\\frac{1}{2}$。",
              ],
              [
                Q.of(q * x * x, 2 * c),
                "That drops the factor $L - x$ that makes the right end zero.",
                "那丢掉了使右端为零的因子 $L - x$。",
              ],
              [
                Q.of(q * L * L, 8 * c),
                "That is the peak value at the middle, not the value at this point.",
                "那是中点处的峰值，不是这一点的值。",
              ],
            ];
            return worked(
              [
                `Find the steady state of $u_t = ${times(c, "u_{xx}")} + ${q}$ on $[0, ${L}]$ with zero ends. What is its value at $x = ${x}$?`,
                `求 $[0, ${L}]$ 上 $u_t = ${times(c, "u_{xx}")} + ${q}$ 的稳态，两端为零。它在 $x = ${x}$ 处的值是多少？`,
              ],
              answer,
              misses,
              [
                [
                  ["Set the time derivative to zero", "令时间导数为零"],
                  [
                    `$${times(c, "u''")} + ${q} = 0$, so $u'' = -${Q.of(q, c).toLatex()}$, and with zero ends $u = \\frac{${times(q, "x")}(${L} - x)}{${2 * c}}$.`,
                    `$${times(c, "u''")} + ${q} = 0$，所以 $u'' = -${Q.of(q, c).toLatex()}$；两端为零时 $u = \\frac{${times(q, "x")}(${L} - x)}{${2 * c}}$。`,
                  ],
                ],
                [
                  ["Evaluate", "求值"],
                  [
                    `At $x = ${x}$: $\\frac{${q} \\cdot ${x} \\cdot ${L - x}}{${2 * c}} = ${answer.toLatex()}$.`,
                    `在 $x = ${x}$ 处：$\\frac{${q} \\cdot ${x} \\cdot ${L - x}}{${2 * c}} = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `Differentiate twice: $\\frac{${times(q, "x")}(${L} - x)}{${2 * c}}$ has second derivative $-\\frac{${2 * q}}{${2 * c}} = -${Q.of(q, c).toLatex()}$, and it vanishes at $0$ and $${L}$.`,
                `求导两次：$\\frac{${times(q, "x")}(${L} - x)}{${2 * c}}$ 的二阶导数是 $-\\frac{${2 * q}}{${2 * c}} = -${Q.of(q, c).toLatex()}$，并且它在 $0$ 和 $${L}$ 处为零。`,
              ],
            );
          }),
      ),
      figure: pdeDrawings1["nonhomogeneous-heat-problems#a-steady-state-with-a-source"],
    },
  ],
);

const waveEquation = topic(
  "the-wave-equation",
  ["The Wave Equation", "波动方程"],
  ["Check standing waves, and find the frequencies of a string.", "验证驻波，并求弦的频率。"],
  ["separation-of-variables-for-pdes"],
  [],
  [
    point(
      "a-standing-wave",
      ["A standing wave", "驻波"],
      [
        "The wave equation sets $u_{tt} = c^2 u_{xx}$, with $c$ the wave speed. Separating variables gives standing waves, a fixed shape in $x$ multiplied by an oscillation in $t$. Unlike a heat mode, a wave mode does not decay: energy is conserved, and it oscillates forever at its own frequency, which is proportional to its number in $x$. For example, $u = \\sin 3x \\cos kt$ solves $u_{tt} = 4u_{xx}$ when $k^{2} = 4 \\cdot 9 = 36$, so $k = 6$.\n\nCheck: $k = cn$ with $c = 2$ and $n = 3$ gives $6$ too.\n\n> **Watch out.** The equation shows $c^{2}$; take the square root, so $k = cn$, not $c^{2}n$.",
        "波动方程令 $u_{tt} = c^2 u_{xx}$，$c$ 是波速。分离变量得到驻波，也就是 $x$ 的固定形状乘以 $t$ 的振荡。与热模态不同，波的模态不衰减：能量守恒，它以自己的频率永远振荡，这个频率与它在 $x$ 方向的序号成正比。例如，$u = \\sin 3x \\cos kt$ 满足 $u_{tt} = 4u_{xx}$ 当且仅当 $k^{2} = 4 \\cdot 9 = 36$，所以 $k = 6$。\n\n检验：$k = cn$，其中 $c = 2$，$n = 3$，也得 $6$。\n\n> **注意。** 方程中出现的是 $c^{2}$；要开平方，所以 $k = cn$，不是 $c^{2}n$。",
      ],
      (rng) =>
        until(() => {
          const c = rng.int(2, 9);
          const n = rng.int(2, 9);
          const a = rng.int(2, 9);
          const answer = c * n;
          const misses: Miss[] = [
            [c * c * n, `That uses $${c * c}$ instead of its square root $${c}$.`, `那用了 $${c * c}$，而不是它的平方根 $${c}$。`],
            [
              c * n * n,
              `That squares $n$ but not $${c}$; both come out of the square root together.`,
              `那把 $n$ 平方了而没有把 $${c}$ 平方；两者要一起开平方。`,
            ],
            [c * c * n * n, "That is $k^2$; take its square root.", "那是 $k^2$；还要开平方。"],
            [n, `That drops the wave speed $${c}$.`, `那丢掉了波速 $${c}$。`],
          ];
          return worked(
            [
              `For which positive $k$ does $u = ${a}\\sin(${n}x)\\cos(kt)$ solve $u_{tt} = ${c * c}u_{xx}$?`,
              `当正数 $k$ 为何值时，$u = ${a}\\sin(${n}x)\\cos(kt)$ 满足 $u_{tt} = ${c * c}u_{xx}$？`,
            ],
            answer,
            misses,
            [
              [
                ["Differentiate", "求导"],
                [`$u_{tt} = -k^2u$ and $u_{xx} = -${n * n}u$.`, `$u_{tt} = -k^2u$，$u_{xx} = -${n * n}u$。`],
              ],
              [
                ["Match and take the root", "比较并开方"],
                [
                  `$k^2 = ${c * c} \\cdot ${n * n} = ${c * c * n * n}$, so $k = ${answer}$.`,
                  `$k^2 = ${c * c} \\cdot ${n * n} = ${c * c * n * n}$，所以 $k = ${answer}$。`,
                ],
              ],
            ],
            [
              `The speed is $c = ${c}$ and the mode number is $${n}$, and $cn = ${c} \\cdot ${n} = ${answer}$, the same frequency.`,
              `波速是 $c = ${c}$，模态序号是 $${n}$，而 $cn = ${c} \\cdot ${n} = ${answer}$，频率相同。`,
            ],
          );
        }),
    ),
    point(
      "the-period-of-a-string",
      ["The period of a string", "弦的周期"],
      [
        "A string fixed at both ends has modes numbered by $n$, with angular frequency $\\frac{n\\pi c}{L}$. So the period of mode $n$ is $\\frac{2L}{nc}$. The first mode is the fundamental, and the others are its harmonics, with frequencies at whole multiples of it. That is why a string sounds a musical note, while a drum, whose frequencies are not whole multiples, generally does not. For example, a string of length $3$ with speed $2$ has fundamental period $\\frac{2 \\cdot 3}{1 \\cdot 2} = 3$.\n\nCheck: the angular frequency is $\\frac{2\\pi}{3}$, and $2\\pi \\div \\frac{2\\pi}{3} = 3$.\n\n> **Watch out.** The period is $2\\pi$ divided by the angular frequency; the angular frequency itself grows with $n$ while the period shrinks.",
        "两端固定的弦有按 $n$ 编号的模态，角频率是 $\\frac{n\\pi c}{L}$。所以第 $n$ 个模态的周期是 $\\frac{2L}{nc}$。第一个模态是基频，其他的是它的谐波，频率是基频的整数倍。这就是弦能发出乐音的原因，而鼓的频率不是整数倍，通常就发不出乐音。例如，长度为 $3$、波速为 $2$ 的弦，基频周期是 $\\frac{2 \\cdot 3}{1 \\cdot 2} = 3$。\n\n检验：角频率是 $\\frac{2\\pi}{3}$，而 $2\\pi \\div \\frac{2\\pi}{3} = 3$。\n\n> **注意。** 周期是 $2\\pi$ 除以角频率；角频率随 $n$ 增大，而周期随之减小。",
      ],
      (rng) =>
        until(() => {
          const L = rng.int(2, 9);
          const c = rng.int(2, 8);
          const n = rng.int(1, 5);
          const answer = Q.of(2 * L, n * c);
          const misses: Miss[] = [
            [
              Q.of(L, n * c),
              "That is half the period; a full cycle takes $2\\pi$ of phase, not $\\pi$.",
              "那是半个周期；一个完整周期对应 $2\\pi$ 的相位，不是 $\\pi$。",
            ],
            [Q.of(2 * L * c, n), "That multiplies by the speed; a faster wave has a shorter period.", "那乘上了波速；波速越快，周期越短。"],
            [
              Q.of(n * c, 2 * L),
              "That is the frequency in cycles per unit time, the reciprocal of the period.",
              "那是每单位时间的周数，即周期的倒数。",
            ],
            [
              Q.of(2 * L, c),
              `That is the period of the fundamental; mode ${n} is ${n} times as fast.`,
              `那是基频的周期；第 ${n} 个模态快 ${n} 倍。`,
            ],
          ];
          return worked(
            [
              `A string of length ${L} has wave speed ${c} and is fixed at both ends. What is the period of mode ${n}?`,
              `长度为 ${L}、波速为 ${c} 的弦两端固定。第 ${n} 个模态的周期是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Find the angular frequency", "求角频率"],
                [
                  `$\\omega = \\frac{${times(n, "\\pi")} \\cdot ${c}}{${L}} = ${Q.of(n * c, L).eq(Q.of(1)) ? "" : Q.of(n * c, L).toLatex()}\\pi$.`,
                  `$\\omega = \\frac{${times(n, "\\pi")} \\cdot ${c}}{${L}} = ${Q.of(n * c, L).eq(Q.of(1)) ? "" : Q.of(n * c, L).toLatex()}\\pi$。`,
                ],
              ],
              [
                ["Divide into a full turn", "用整圈相除"],
                [`$T = \\frac{2\\pi}{\\omega} = ${answer.toLatex()}$.`, `$T = \\frac{2\\pi}{\\omega} = ${answer.toLatex()}$。`],
              ],
            ],
            [
              `In one period a wave travels $c \\cdot T = ${c} \\cdot ${answer.toLatex()} = ${Q.of(2 * L, n).toLatex()}$, the wavelength $\\frac{2L}{n}$ of mode ${n}.`,
              `一个周期内波传播 $c \\cdot T = ${c} \\cdot ${answer.toLatex()} = ${Q.of(2 * L, n).toLatex()}$，正是第 ${n} 个模态的波长 $\\frac{2L}{n}$。`,
            ],
          );
        }),
    ),
  ],
);

const dAlembert = topic(
  "dalemberts-formula",
  ["d'Alembert's Formula", "达朗贝尔公式"],
  ["Solve the wave equation on the whole line with travelling waves.", "用行波求解整条直线上的波动方程。"],
  ["the-wave-equation", "the-transport-equation"],
  [],
  [
    point(
      "an-initial-shape",
      ["An initial shape", "初始形状"],
      [
        "On the whole line, the wave equation factors into two transport equations, one moving right and one moving left. With initial shape $f$ and zero initial velocity, the solution is $\\frac{1}{2}f(x - ct) + \\frac{1}{2}f(x + ct)$. So an initial bump splits into two equal halves that travel in opposite directions at speed $c$, and each keeps the shape of the original. For example, with $c = 1$ and $f(x) = 2x^{2}$, the value $u(1, 2)$ averages $f(-1) = 2$ and $f(3) = 18$, giving $10$.\n\nCheck: for $f = 2x^{2}$ the formula simplifies to $u = 2(x^{2} + c^{2}t^{2})$, and $2(1 + 4) = 10$.\n\n> **Watch out.** Each half carries half the shape: average the two values of $f$, rather than adding them or reading $f$ at $x$.",
        "在整条直线上，波动方程可以分解为两个输运方程，一个向右移动，一个向左移动。初始形状为 $f$、初始速度为零时，解是 $\\frac{1}{2}f(x - ct) + \\frac{1}{2}f(x + ct)$。所以初始的凸起分成相等的两半，以速度 $c$ 向相反方向传播，每一半都保持原来的形状。例如，$c = 1$，$f(x) = 2x^{2}$，值 $u(1, 2)$ 是 $f(-1) = 2$ 与 $f(3) = 18$ 的平均，得 $10$。\n\n检验：对 $f = 2x^{2}$，公式化简为 $u = 2(x^{2} + c^{2}t^{2})$，而 $2(1 + 4) = 10$。\n\n> **注意。** 每一半只带走一半形状：要把 $f$ 的两个值取平均，而不是相加，也不是在 $x$ 处读 $f$。",
      ],
      (rng) =>
        until(() => {
          const c = rng.int(2, 5);
          const t = rng.int(1, 4);
          const x = rng.int(-6, 10);
          const p = rng.pick([2, 4, 6, 8]);
          const left = x - c * t;
          const right = x + c * t;
          const answer = (p * (left * left + right * right)) / 2;
          const misses: Miss[] = [
            [p * left * left, "That keeps only the right-moving half and forgets to halve it.", "那只保留了向右移动的一半，也忘了取一半。"],
            [
              p * right * right,
              "That keeps only the left-moving half and forgets to halve it.",
              "那只保留了向左移动的一半，也忘了取一半。",
            ],
            [p * x * x, "That reads the initial shape at $x$, as if nothing had moved.", "那在 $x$ 处读初始形状，好像什么都没移动。"],
            [answer * 2, "That adds the two values without halving them.", "那把两个值相加了，却没有取一半。"],
          ];
          return worked(
            [
              `Let $u_{tt} = ${c * c}u_{xx}$ on the line with $u(x, 0) = ${p}x^2$ and $u_t(x, 0) = 0$. What is $u(${x}, ${t})$?`,
              `设直线上 $u_{tt} = ${c * c}u_{xx}$，$u(x, 0) = ${p}x^2$，$u_t(x, 0) = 0$。$u(${x}, ${t})$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Find the two feet", "求两个起点"],
                [
                  `$x - ct = ${x} - ${c * t} = ${left}$ and $x + ct = ${x} + ${c * t} = ${right}$.`,
                  `$x - ct = ${x} - ${c * t} = ${left}$，$x + ct = ${x} + ${c * t} = ${right}$。`,
                ],
              ],
              [
                ["Average the shape", "对形状取平均"],
                [
                  `$\\frac{f(${left}) + f(${right})}{2} = \\frac{${p * left * left} + ${p * right * right}}{2} = ${answer}$.`,
                  `$\\frac{f(${left}) + f(${right})}{2} = \\frac{${p * left * left} + ${p * right * right}}{2} = ${answer}$。`,
                ],
              ],
            ],
            [
              `For $f = ${p}x^2$ the formula simplifies to $u = ${p}(x^2 + ${c * c}t^2)$, and $${p}(${x * x} + ${c * c * t * t}) = ${answer}$.`,
              `对 $f = ${p}x^2$，公式化简为 $u = ${p}(x^2 + ${c * c}t^2)$，而 $${p}(${x * x} + ${c * c * t * t}) = ${answer}$。`,
            ],
          );
        }),
    ),
    point(
      "an-initial-velocity",
      ["An initial velocity", "初始速度"],
      [
        "An initial velocity $g$ adds a second term to d'Alembert's formula: $\\frac{1}{2c}$ times the integral of $g$ from $x - ct$ to $x + ct$. So the value at a point depends only on initial data in that interval, called its domain of dependence. Information therefore travels no faster than the speed $c$, in sharp contrast with the heat equation, where any disturbance is felt everywhere at once. For example, with $c = 2$ and $g(x) = 3x$, the value $u(1, 2)$ is $\\frac{1}{4}\\int_{-3}^{5} 3s\\,ds = \\frac{1}{4} \\cdot 24 = 6$.\n\nCheck: $u = 3xt$ has $u_{tt} = 0 = 4u_{xx}$, $u(x, 0) = 0$ and $u_t(x, 0) = 3x$, and it gives $3 \\cdot 1 \\cdot 2 = 6$.\n\n> **Watch out.** Do not forget the factor $\\frac{1}{2c}$ in front of the integral.",
        "初始速度 $g$ 给达朗贝尔公式增加第二项：$\\frac{1}{2c}$ 乘 $g$ 从 $x - ct$ 到 $x + ct$ 的积分。所以一点的值只依赖这个区间上的初始数据，这个区间称为它的依赖域。因此信息的传播速度不超过 $c$，这与热方程形成鲜明对比，热方程的任何扰动都会立即在各处被感受到。例如，$c = 2$，$g(x) = 3x$，值 $u(1, 2)$ 是 $\\frac{1}{4}\\int_{-3}^{5} 3s\\,ds = \\frac{1}{4} \\cdot 24 = 6$。\n\n检验：$u = 3xt$ 满足 $u_{tt} = 0 = 4u_{xx}$，$u(x, 0) = 0$，$u_t(x, 0) = 3x$，它给出 $3 \\cdot 1 \\cdot 2 = 6$。\n\n> **注意。** 不要忘了积分前面的因子 $\\frac{1}{2c}$。",
      ],
      (rng) =>
        until(() => {
          const c = rng.int(2, 5);
          const t = rng.int(1, 6);
          const x = rng.int(-5, 10);
          if (x + c * t === 1) return undefined;
          const a = rng.int(2, 9);
          const answer = a * x * t;
          const integral = 2 * a * c * x * t;
          const misses: Miss[] = [
            [
              a * x,
              "That is the initial velocity at $x$; the effect builds up over the time $t$.",
              "那是 $x$ 处的初始速度；它的效果随时间 $t$ 累积。",
            ],
            [integral, `That is the integral alone; it must be divided by $2c = ${2 * c}$.`, `那只是积分；还要除以 $2c = ${2 * c}$。`],
            [a * x * c * t, "That divides by $2$ instead of by $2c$.", "那是除以 $2$，而不是除以 $2c$。"],
          ];
          return worked(
            [
              `Let $u_{tt} = ${c * c}u_{xx}$ on the line with $u(x, 0) = 0$ and $u_t(x, 0) = ${a}x$. What is $u(${x}, ${t})$?`,
              `设直线上 $u_{tt} = ${c * c}u_{xx}$，$u(x, 0) = 0$，$u_t(x, 0) = ${a}x$。$u(${x}, ${t})$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Integrate over the interval", "在区间上积分"],
                [
                  `$\\int_{${x - c * t}}^{${x + c * t}} ${a}s\\,ds = \\frac{${a}}{2}\\left(${x + c * t < 0 ? `(${x + c * t})` : x + c * t}^2 - ${x - c * t < 0 ? `(${x - c * t})` : x - c * t}^2\\right) = ${integral}$.`,
                  `$\\int_{${x - c * t}}^{${x + c * t}} ${a}s\\,ds = \\frac{${a}}{2}\\left(${x + c * t < 0 ? `(${x + c * t})` : x + c * t}^2 - ${x - c * t < 0 ? `(${x - c * t})` : x - c * t}^2\\right) = ${integral}$。`,
                ],
              ],
              [
                ["Divide by 2c", "除以 2c"],
                [`$\\frac{${integral}}{${2 * c}} = ${answer}$.`, `$\\frac{${integral}}{${2 * c}} = ${answer}$。`],
              ],
            ],
            [
              `$u = ${a}xt$ has $u_{tt} = 0 = ${c * c}u_{xx}$, $u(x, 0) = 0$ and $u_t(x, 0) = ${a}x$, and it gives $${a} \\cdot ${x < 0 ? `(${x})` : x} \\cdot ${t} = ${answer}$.`,
              `$u = ${a}xt$ 满足 $u_{tt} = 0 = ${c * c}u_{xx}$，$u(x, 0) = 0$，$u_t(x, 0) = ${a}x$，它给出 $${a} \\cdot ${x < 0 ? `(${x})` : x} \\cdot ${t} = ${answer}$。`,
            ],
          );
        }),
    ),
  ],
);

const waveSeries = topic(
  "the-wave-equation-on-a-finite-string",
  ["The Wave Equation on a Finite String", "有限长弦上的波动方程"],
  ["Evaluate string motions built from sine modes.", "计算由正弦模态构成的弦的运动。"],
  ["the-wave-equation", "fourier-sine-series"],
  [["the-wave-equation", 0.4]],
  [
    point(
      "a-plucked-mode-later",
      ["A plucked mode later on", "拨动的模态在之后的值"],
      [
        "If a string is released from rest in the shape of mode $n$, it keeps that shape and its size oscillates: $u$ equals a sine in $x$ times $\\cos\\frac{n\\pi c t}{L}$. After one half period, the cosine is $-1$, so the string is exactly upside down. After a full period, it is back where it began. A general shape is a sum of such modes. For example, with $L = 2$, $c = 1$ and $u(x, 0) = 5\\sin\\frac{\\pi x}{2}$, the motion is $5\\sin\\frac{\\pi x}{2}\\cos\\frac{\\pi t}{2}$, and at $x = 1$, $t = 2$ it equals $5 \\cdot 1 \\cdot \\cos \\pi = -5$.\n\nCheck: the period of mode $1$ is $\\frac{2L}{c} = 4$, so $t = 2$ is half a period, when the string is upside down.\n\n> **Watch out.** The string is flat after a quarter period, not after a half; after a half period it is inverted.",
        "如果弦从静止开始、形状为第 $n$ 个模态，它保持这个形状，大小不断振荡：$u$ 等于 $x$ 的正弦乘以 $\\cos\\frac{n\\pi c t}{L}$。经过半个周期，余弦是 $-1$，弦恰好上下颠倒。经过一个完整周期，它回到起始位置。一般的形状是这样的模态之和。例如，$L = 2$，$c = 1$，$u(x, 0) = 5\\sin\\frac{\\pi x}{2}$，运动是 $5\\sin\\frac{\\pi x}{2}\\cos\\frac{\\pi t}{2}$，在 $x = 1$，$t = 2$ 处等于 $5 \\cdot 1 \\cdot \\cos \\pi = -5$。\n\n检验：第 $1$ 个模态的周期是 $\\frac{2L}{c} = 4$，所以 $t = 2$ 是半个周期，这时弦上下颠倒。\n\n> **注意。** 经过四分之一周期弦是平的，而不是半个周期；半个周期时它是倒过来的。",
      ],
      (rng) =>
        until(() => {
          const L = rng.int(2, 8);
          const c = rng.int(1, 5);
          const n = rng.int(1, 4);
          const a = rng.int(2, 15);
          const half = rng.bool();
          const t = half ? Q.of(L, n * c) : Q.of(2 * L, n * c);
          const answer = half ? -a : a;
          const x = Q.of(L, 2 * n);
          const misses: Miss[] = [
            [
              -answer,
              half
                ? "That takes the cosine to be $1$; after half a period it is $-1$."
                : "That takes the cosine to be $-1$; after a full period it is back to $1$.",
              half ? "那把余弦当成了 $1$；半个周期后它是 $-1$。" : "那把余弦当成了 $-1$；一个完整周期后它回到 $1$。",
            ],
            [
              0,
              "That treats the string as flat, which happens only at a quarter period.",
              "那把弦当成了平的，而这只在四分之一周期时发生。",
            ],
          ];
          return worked(
            [
              `Let $u_{tt} = ${c * c === 1 ? "" : c * c}u_{xx}$ on $[0, ${L}]$ with fixed ends, $u(x, 0) = ${a}${mode(n, L)}$ and $u_t(x, 0) = 0$. What is $u$ at $x = ${x.toLatex()}$ and $t = ${t.toLatex()}$?`,
              `设 $[0, ${L}]$ 上 $u_{tt} = ${c * c === 1 ? "" : c * c}u_{xx}$，两端固定，$u(x, 0) = ${a}${mode(n, L)}$，$u_t(x, 0) = 0$。$u$ 在 $x = ${x.toLatex()}$，$t = ${t.toLatex()}$ 处是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Evaluate the space factor", "求空间因子"],
                [
                  `At $x = ${x.toLatex()}$ the sine is $\\sin\\frac{\\pi}{2} = 1$.`,
                  `在 $x = ${x.toLatex()}$ 处正弦是 $\\sin\\frac{\\pi}{2} = 1$。`,
                ],
              ],
              [
                ["Evaluate the time factor", "求时间因子"],
                [
                  `The time factor is $${mode(n * c, L, "\\cos").replace(" x", " t")}$, which at $t = ${t.toLatex()}$ is $\\cos ${half ? "\\pi = -1" : "2\\pi = 1"}$, so $u = ${a} \\cdot ${half ? "(-1)" : "1"} = ${answer}$.`,
                  `时间因子是 $${mode(n * c, L, "\\cos").replace(" x", " t")}$，在 $t = ${t.toLatex()}$ 处为 $\\cos ${half ? "\\pi = -1" : "2\\pi = 1"}$，所以 $u = ${a} \\cdot ${half ? "(-1)" : "1"} = ${answer}$。`,
                ],
              ],
            ],
            [
              `The period of mode ${n} is $\\frac{2L}{nc} = ${Q.of(2 * L, n * c).toLatex()}$, so $t = ${t.toLatex()}$ is ${half ? "half a period, when the string is upside down" : "a full period, when the string is back where it began"}.`,
              `第 ${n} 个模态的周期是 $\\frac{2L}{nc} = ${Q.of(2 * L, n * c).toLatex()}$，所以 $t = ${t.toLatex()}$ 是${half ? "半个周期，这时弦上下颠倒" : "一个完整周期，这时弦回到起始位置"}。`,
            ],
          );
        }),
    ),
    point(
      "the-coefficient-from-a-velocity",
      ["The coefficient from a velocity", "由速度得系数"],
      [
        "When a string starts flat with an initial velocity, the solution uses the sine in time rather than the cosine. Differentiating in $t$ brings down the frequency $\\frac{n\\pi c}{L}$, so the size of the mode is the initial velocity's coefficient divided by that frequency. So a higher mode responds with a smaller size to the same velocity, which is why a struck string has few high harmonics. For example, with $L = 2$, $c = 1$ and $u_t(x, 0) = 3\\sin\\frac{\\pi x}{2}$, the frequency is $\\frac{\\pi}{2}$ and the size is $3 \\div \\frac{\\pi}{2} = \\frac{6}{\\pi}$.\n\nCheck: $u = \\frac{6}{\\pi}\\sin\\frac{\\pi x}{2}\\sin\\frac{\\pi t}{2}$ has $u_t(x, 0) = \\frac{6}{\\pi} \\cdot \\frac{\\pi}{2}\\sin\\frac{\\pi x}{2} = 3\\sin\\frac{\\pi x}{2}$.\n\n> **Watch out.** Divide the velocity coefficient by the frequency; multiplying by it gives a size that grows with the mode number.",
        "弦从平直状态开始并有初始速度时，解用时间的正弦而不是余弦。对 $t$ 求导会带下频率 $\\frac{n\\pi c}{L}$，所以模态的大小等于初始速度的系数除以这个频率。因此同样的速度下，高阶模态的响应更小，这就是被敲击的弦高次谐波很少的原因。例如，$L = 2$，$c = 1$，$u_t(x, 0) = 3\\sin\\frac{\\pi x}{2}$，频率是 $\\frac{\\pi}{2}$，大小是 $3 \\div \\frac{\\pi}{2} = \\frac{6}{\\pi}$。\n\n检验：$u = \\frac{6}{\\pi}\\sin\\frac{\\pi x}{2}\\sin\\frac{\\pi t}{2}$ 满足 $u_t(x, 0) = \\frac{6}{\\pi} \\cdot \\frac{\\pi}{2}\\sin\\frac{\\pi x}{2} = 3\\sin\\frac{\\pi x}{2}$。\n\n> **注意。** 要用速度系数除以频率；乘以频率得到的大小会随模态序号增大。",
      ],
      (rng) =>
        until(() => {
          const L = rng.int(2, 8);
          const c = rng.int(1, 5);
          const n = rng.int(1, 5);
          const b = rng.int(2, 15);
          const answer = Q.of(b * L, n * c);
          const misses: Miss[] = [
            [Q.of(b * n * c, L), "That multiplies by the frequency instead of dividing by it.", "那是乘以频率，而不是除以它。"],
            [Q.of(b, n * c), `That drops the length $${L}$ from the frequency.`, `那从频率中丢掉了长度 $${L}$。`],
            [Q.of(L, n * c), `That drops the velocity coefficient $${b}$.`, `那丢掉了速度系数 $${b}$。`],
          ];
          return worked(
            [
              `Let $u_{tt} = ${c * c === 1 ? "" : c * c}u_{xx}$ on $[0, ${L}]$ with fixed ends, $u(x, 0) = 0$ and $u_t(x, 0) = ${b}${mode(n, L)}$. The solution is $\\frac{k}{\\pi}${mode(n, L)}\\sin(\\omega t)$. What is $k$?`,
              `设 $[0, ${L}]$ 上 $u_{tt} = ${c * c === 1 ? "" : c * c}u_{xx}$，两端固定，$u(x, 0) = 0$，$u_t(x, 0) = ${b}${mode(n, L)}$。解是 $\\frac{k}{\\pi}${mode(n, L)}\\sin(\\omega t)$。$k$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Find the frequency", "求频率"],
                [
                  `$\\omega = \\frac{${times(n, "\\pi")} \\cdot ${c}}{${L}} = ${Q.of(n * c, L).eq(Q.of(1)) ? "" : Q.of(n * c, L).toLatex()}\\pi$.`,
                  `$\\omega = \\frac{${times(n, "\\pi")} \\cdot ${c}}{${L}} = ${Q.of(n * c, L).eq(Q.of(1)) ? "" : Q.of(n * c, L).toLatex()}\\pi$。`,
                ],
              ],
              [
                ["Match the velocity", "匹配速度"],
                [
                  `At $t = 0$, $u_t = \\frac{k}{\\pi}\\omega$ times the mode, so $\\frac{k}{\\pi} = \\frac{${b}}{\\omega} = \\frac{${b} \\cdot ${L}}{${n * c}\\pi}$ and $k = ${answer.toLatex()}$.`,
                  `在 $t = 0$ 时，$u_t = \\frac{k}{\\pi}\\omega$ 乘以模态，所以 $\\frac{k}{\\pi} = \\frac{${b}}{\\omega} = \\frac{${b} \\cdot ${L}}{${n * c}\\pi}$，$k = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `Multiplying back, $\\frac{k}{\\pi} \\cdot \\omega = ${answer.toLatex()} \\cdot \\frac{${n * c}}{${L}} = ${b}$, the given coefficient of the velocity.`,
              `反乘回去，$\\frac{k}{\\pi} \\cdot \\omega = ${answer.toLatex()} \\cdot \\frac{${n * c}}{${L}} = ${b}$，正是给定的速度系数。`,
            ],
          );
        }),
    ),
  ],
);

const laplaceEquation = topic(
  "laplaces-equation",
  ["Laplace's Equation", "拉普拉斯方程"],
  ["Recognize harmonic functions, and use the mean value property.", "识别调和函数，并使用平均值性质。"],
  ["classifying-second-order-equations", "the-heat-equation"],
  [],
  [
    point(
      "completing-a-harmonic-function",
      ["Completing a harmonic function", "补全调和函数"],
      [
        "Laplace's equation says that the second derivatives in all directions add to zero. It describes steady temperatures, electrostatic potentials and many other equilibrium states, and its solutions are called harmonic functions. In three variables, three second derivatives must balance. A quadratic with squared terms is harmonic exactly when its coefficients add to zero, so one unknown coefficient is fixed by the other two. For example, $u = x^{2} + 2y^{2} + kz^{2} + 5xy$ has $u_{xx} + u_{yy} + u_{zz} = 2 + 4 + 2k$, which is zero when $k = -3$.\n\nCheck: the coefficients of the squares, $1 + 2 + (-3)$, add to $0$.\n\n> **Watch out.** A mixed term such as $5xy$ has $u_{xx} = u_{yy} = 0$, so it plays no part; and $k$ must be negative to balance positive coefficients.",
        "拉普拉斯方程说，各个方向的二阶导数之和为零。它描述稳态温度、静电势和许多其他平衡状态，它的解称为调和函数。三个变量时，三个二阶导数必须平衡。含平方项的二次函数调和，当且仅当这些系数之和为零，所以一个未知系数由另外两个确定。例如，$u = x^{2} + 2y^{2} + kz^{2} + 5xy$ 有 $u_{xx} + u_{yy} + u_{zz} = 2 + 4 + 2k$，当 $k = -3$ 时它为零。\n\n检验：平方项的系数 $1 + 2 + (-3)$ 之和为 $0$。\n\n> **注意。** 混合项（如 $5xy$）的 $u_{xx} = u_{yy} = 0$，所以它不起作用；而且 $k$ 必须是负的，才能平衡正的系数。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(1, 12);
          const b = rng.int(1, 12);
          const d = rng.int(2, 9);
          const answer = -(a + b);
          const misses: Miss[] = [
            [a + b, "That has the wrong sign: the three second derivatives must add to zero.", "那符号错了：三个二阶导数之和必须为零。"],
            [-a, `That balances only the $x^2$ term; the $y^2$ term needs balancing too.`, `那只平衡了 $x^2$ 项；$y^2$ 项也要平衡。`],
            [-b, `That balances only the $y^2$ term; the $x^2$ term needs balancing too.`, `那只平衡了 $y^2$ 项；$x^2$ 项也要平衡。`],
            [
              answer - d,
              `That counts the mixed term $${d}xy$, which has no $u_{xx}$, $u_{yy}$ or $u_{zz}$.`,
              `那把混合项 $${d}xy$ 算进去了，而它的 $u_{xx}$、$u_{yy}$、$u_{zz}$ 都是零。`,
            ],
          ];
          return worked(
            [
              `For which $k$ is $u = ${times(a, "x^2")} + ${times(b, "y^2")} + kz^2 + ${d}xy$ harmonic?`,
              `当 $k$ 为何值时，$u = ${times(a, "x^2")} + ${times(b, "y^2")} + kz^2 + ${d}xy$ 是调和函数？`,
            ],
            answer,
            misses,
            [
              [
                ["Take the second derivatives", "求二阶导数"],
                [
                  `$u_{xx} = ${2 * a}$, $u_{yy} = ${2 * b}$ and $u_{zz} = 2k$; the term in $xy$ gives none of these.`,
                  `$u_{xx} = ${2 * a}$，$u_{yy} = ${2 * b}$，$u_{zz} = 2k$；$xy$ 项对这些都没有贡献。`,
                ],
              ],
              [
                ["Set the sum to zero", "令和为零"],
                [`$${2 * a} + ${2 * b} + 2k = 0$ gives $k = ${answer}$.`, `$${2 * a} + ${2 * b} + 2k = 0$ 给出 $k = ${answer}$。`],
              ],
            ],
            [
              `The coefficients of the squares add to $${a} + ${b} + (${answer}) = 0$, as a harmonic quadratic requires.`,
              `平方项的系数之和是 $${a} + ${b} + (${answer}) = 0$，正符合调和二次函数的要求。`,
            ],
          );
        }),
    ),
    {
      ...point(
        "the-mean-value-property",
        ["The mean value property", "平均值性质"],
        [
          "A harmonic function has the mean value property: its value at the centre of any circle inside its domain equals the average of its values around that circle. So a steady temperature balances its surroundings, and one consequence is the maximum principle. To find such an average, there is no need to integrate at all, since evaluating the function at the centre gives it immediately. In the drawing, $u = x$ on the circle of radius $1.2$ about $(2, 1)$ takes the values $3.2$, $2$, $0.8$ and $2$ at four evenly spaced points, which average to $2$, the value at the centre.\n\nCheck: $\\frac{3.2 + 2 + 0.8 + 2}{4} = \\frac{8}{4} = 2 = u(2, 1)$.\n\n> **Watch out.** The property needs a harmonic function; for $u = x^{2} + y^{2}$, which is not harmonic, the average around a circle exceeds the value at its centre.",
          "调和函数有平均值性质：它在定义域内任何圆的圆心的值，等于它在圆周上的平均值。所以稳态温度与周围保持平衡，极大值原理是它的一个结论。求这样的平均值根本不需要积分，因为计算函数在圆心的值就能立刻得到。图中，$u = x$ 在以 $(2, 1)$ 为圆心、半径 $1.2$ 的圆上，四个等距点处的值是 $3.2$、$2$、$0.8$ 和 $2$，平均为 $2$，正是圆心处的值。\n\n检验：$\\frac{3.2 + 2 + 0.8 + 2}{4} = \\frac{8}{4} = 2 = u(2, 1)$。\n\n> **注意。** 这个性质要求函数调和；对不调和的 $u = x^{2} + y^{2}$，圆周上的平均值大于圆心处的值。",
        ],
        (rng) =>
          until(() => {
            const [p, q] = [rng.int(-5, 6), rng.int(-5, 6)];
            const r = rng.int(1, 9);
            const [a, b] = [rng.int(2, 7), rng.int(2, 7)];
            const answer = p * p - q * q + a * p + b * q;
            const misses: Miss[] = [
              [
                answer + r * r,
                "That adds $r^2$, as for $x^2 + y^2$; here the $r^2$ terms of $x^2$ and $-y^2$ cancel.",
                "那加上了 $r^2$，像 $x^2 + y^2$ 那样；这里 $x^2$ 与 $-y^2$ 的 $r^2$ 项相消。",
              ],
              [
                answer + r,
                "That adds the radius; the average does not depend on the radius at all.",
                "那加上了半径；平均值与半径完全无关。",
              ],
              [
                a * p + b * q,
                "That keeps only the linear terms and drops $x^2 - y^2$ at the centre.",
                "那只保留了一次项，丢掉了圆心处的 $x^2 - y^2$。",
              ],
              [p * p + q * q + a * p + b * q, "That adds $y^2$ instead of subtracting it.", "那是加上 $y^2$，而不是减去它。"],
            ];
            return worked(
              [
                `The function $u = x^2 - y^2 + ${a}x + ${b}y$ is harmonic. What is its average value around the circle of radius ${r} about $(${p}, ${q})$?`,
                `函数 $u = x^2 - y^2 + ${a}x + ${b}y$ 是调和函数。它在以 $(${p}, ${q})$ 为圆心、半径为 ${r} 的圆周上的平均值是多少？`,
              ],
              answer,
              misses,
              [
                [
                  ["Use the mean value property", "用平均值性质"],
                  ["The average around the circle equals the value at its centre.", "圆周上的平均值等于圆心处的值。"],
                ],
                [
                  ["Evaluate at the centre", "求圆心处的值"],
                  [
                    `$u(${p}, ${q}) = ${p * p} - ${q * q} + ${a}(${p}) + ${b}(${q}) = ${answer}$.`,
                    `$u(${p}, ${q}) = ${p * p} - ${q * q} + ${a}(${p}) + ${b}(${q}) = ${answer}$。`,
                  ],
                ],
              ],
              [
                `At the four points $(${p} \\pm ${r}, ${q})$ and $(${p}, ${q} \\pm ${r})$ the linear terms average to their centre values, and the $${r * r}$ from $x^2$ cancels the $-${r * r}$ from $-y^2$, so the four values also average to $${answer}$.`,
                `在四个点 $(${p} \\pm ${r}, ${q})$ 和 $(${p}, ${q} \\pm ${r})$ 处，一次项的平均等于圆心处的值，而 $x^2$ 带来的 $${r * r}$ 与 $-y^2$ 带来的 $-${r * r}$ 相消，所以这四个值的平均也是 $${answer}$。`,
              ],
            );
          }),
      ),
      figure: pdeDrawings1["laplaces-equation#the-mean-value-property"],
    },
  ],
);

const laplaceRegions = topic(
  "laplaces-equation-in-a-rectangle-and-a-disc",
  ["Laplace's Equation in a Rectangle and a Disc", "矩形和圆盘上的拉普拉斯方程"],
  ["Solve boundary value problems by separation, and apply the maximum principle.", "用分离变量解边值问题，并应用极大值原理。"],
  ["laplaces-equation"],
  [["laplaces-equation", 0.4]],
  [
    {
      ...point(
        "a-boundary-value-on-a-disc",
        ["A boundary value on a disc", "圆盘上的边界值"],
        [
          "In polar coordinates, separation on a disc gives the harmonic functions $r^n \\cos n\\theta$ or $r^n \\sin n\\theta$. Bounded solutions avoid negative powers of $r$, since these blow up at the centre. So if the boundary value on the circle of radius $R$ is $a\\cos n\\theta$, then the solution inside is $a\\left(\\frac{r}{R}\\right)^n$ times that cosine. In the drawing, the boundary value $3\\cos 2\\theta$ on $R = 2$ gives $3\\left(\\frac{r}{2}\\right)^{2}\\cos 2\\theta$ inside, which along $\\theta = 0$ is $3$ at the rim and $\\frac{3}{4}$ at $r = 1$.\n\nCheck: at $r = 2$ the formula returns $3\\cos 2\\theta$, the boundary value, and $r^{2}\\cos 2\\theta = x^{2} - y^{2}$ is harmonic.\n\n> **Watch out.** The factor is $\\left(\\frac{r}{R}\\right)^{n}$, raised to the power $n$; and a constant term on the boundary stays the same constant inside.",
          "在极坐标中，圆盘上的分离变量给出调和函数：$r^n \\cos n\\theta$ 或 $r^n \\sin n\\theta$。有界的解不含 $r$ 的负幂，因为它们在圆心处爆破。所以如果半径为 $R$ 的圆周上的边界值是 $a\\cos n\\theta$，那么内部的解是 $a\\left(\\frac{r}{R}\\right)^n$ 再乘这个余弦。图中，$R = 2$ 上的边界值 $3\\cos 2\\theta$ 给出内部的解 $3\\left(\\frac{r}{2}\\right)^{2}\\cos 2\\theta$，沿 $\\theta = 0$ 它在边界为 $3$，在 $r = 1$ 处为 $\\frac{3}{4}$。\n\n检验：在 $r = 2$ 处公式还原为边界值 $3\\cos 2\\theta$，而 $r^{2}\\cos 2\\theta = x^{2} - y^{2}$ 是调和的。\n\n> **注意。** 因子是 $\\left(\\frac{r}{R}\\right)^{n}$，要取 $n$ 次幂；边界上的常数项在内部仍是同一个常数。",
        ],
        (rng) =>
          until(() => {
            const R = rng.int(2, 6);
            const r = rng.int(1, R - 1);
            const n = rng.int(2, 4);
            const a = rng.int(2, 15);
            const b = rng.int(-5, 9);
            const scaled = Q.of(a * r ** n, R ** n);
            const answer = scaled.add(Q.of(b));
            const boundary = shifted(`${a}\\cos(${n}\\theta)`, b);
            const misses: Miss[] = [
              [
                Q.of(a + b),
                "That is the boundary value at $\\theta = 0$; inside, the cosine term shrinks.",
                "那是 $\\theta = 0$ 处的边界值；在内部，余弦项会缩小。",
              ],
              [
                Q.of(a * r, R).add(Q.of(b)),
                `That uses $\\frac{r}{R}$ without the power $${n}$.`,
                `那用了 $\\frac{r}{R}$，却没有取 $${n}$ 次幂。`,
              ],
              [scaled, `That drops the constant $${b}$, which stays the same inside.`, `那丢掉了常数 $${b}$，而它在内部保持不变。`],
              [Q.of(b), "That drops the cosine term entirely; it is only zero at the centre.", "那把余弦项完全丢掉了；它只在圆心处为零。"],
            ];
            return worked(
              [
                `A function is harmonic in the disc $r \\le ${R}$ and equals $${boundary}$ on its edge. What is its value at $r = ${r}$, $\\theta = 0$?`,
                `一个函数在圆盘 $r \\le ${R}$ 内调和，在边界上等于 $${boundary}$。它在 $r = ${r}$，$\\theta = 0$ 处的值是多少？`,
              ],
              answer,
              misses,
              [
                [
                  ["Write the solution inside", "写出内部的解"],
                  [
                    `$u = ${shifted(`${a}\\left(\\frac{r}{${R}}\\right)^{${n}}\\cos(${n}\\theta)`, b)}$.`,
                    `$u = ${shifted(`${a}\\left(\\frac{r}{${R}}\\right)^{${n}}\\cos(${n}\\theta)`, b)}$。`,
                  ],
                ],
                [
                  ["Evaluate", "求值"],
                  [
                    `At $r = ${r}$, $\\theta = 0$: $${a}\\left(\\frac{${r}}{${R}}\\right)^{${n}}${b === 0 ? "" : ` ${plus(b)}`} = ${answer.toLatex()}$.`,
                    `在 $r = ${r}$，$\\theta = 0$ 处：$${a}\\left(\\frac{${r}}{${R}}\\right)^{${n}}${b === 0 ? "" : ` ${plus(b)}`} = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `At $r = ${R}$ the formula gives $${a}\\cos(${n}\\theta)${b === 0 ? "" : ` ${plus(b)}`}$ back, the boundary value, and the value $${answer.toLatex()}$ lies between the boundary extremes $${-a + b}$ and $${a + b}$, as the maximum principle requires.`,
                `在 $r = ${R}$ 处公式还原为边界值 $${a}\\cos(${n}\\theta)${b === 0 ? "" : ` ${plus(b)}`}$，而值 $${answer.toLatex()}$ 介于边界的最小值 $${-a + b}$ 与最大值 $${a + b}$ 之间，正符合极大值原理。`,
              ],
            );
          }),
      ),
      figure: pdeDrawings1["laplaces-equation-in-a-rectangle-and-a-disc#a-boundary-value-on-a-disc"],
    },
    point(
      "the-maximum-principle",
      ["The maximum principle", "极大值原理"],
      [
        "The maximum principle says that a harmonic function on a bounded region reaches its largest and smallest values on the boundary, and never inside, unless it is constant. A steady temperature cannot have a hot spot in the interior, as heat would flow away from it. So boundary values bound the whole solution, and this also shows that two solutions with the same boundary values must be identical. For example, if a nonconstant harmonic function has boundary values from $0$ to $10$, its value at the centre may be $4$, but not $12$, $-1$ or even $10$.\n\nCheck: the mean value property agrees, since the value at the centre is an average of values that lie between $0$ and $10$ and are not all equal.\n\n> **Watch out.** For a nonconstant function the inequality is strict: an interior value cannot even equal the largest boundary value.",
        "极大值原理说，有界区域上的调和函数在边界上取得最大值和最小值，除非它是常数，否则决不在内部取得。稳态温度在内部不可能有热点，因为热量会从那里流走。所以边界值限制了整个解，这也说明边界值相同的两个解必定相同。例如，非常数调和函数的边界值从 $0$ 到 $10$，它在中心的值可以是 $4$，但不能是 $12$、$-1$，甚至不能是 $10$。\n\n检验：平均值性质也这样说，因为中心的值是一些介于 $0$ 和 $10$ 之间、又不全相等的值的平均。\n\n> **注意。** 对非常数函数不等式是严格的：内部的值甚至不能等于边界的最大值。",
      ],
      (rng) => {
        const low = rng.int(-9, 10);
        const high = low + rng.int(5, 20);
        const inside = rng.int(low + 1, high - 1);
        const above = high + rng.int(1, 9);
        const below = low - rng.int(1, 9);
        const slips: Slip[] = [
          [same(`${above}`), `$${above}$ is above the largest boundary value $${high}$.`, `$${above}$ 大于边界的最大值 $${high}$。`],
          [same(`${below}`), `$${below}$ is below the smallest boundary value $${low}$.`, `$${below}$ 小于边界的最小值 $${low}$。`],
          [
            same(`${high + 10}`),
            `$${high + 10}$ is above the largest boundary value $${high}$.`,
            `$${high + 10}$ 大于边界的最大值 $${high}$。`,
          ],
        ];
        return chosen(
          rng,
          [
            `A nonconstant harmonic function on a square has boundary values from $${low}$ to $${high}$. Which could be its value at the centre?`,
            `正方形上非常数的调和函数的边界值从 $${low}$ 到 $${high}$。下列哪个可能是它在中心的值？`,
          ],
          same(`${inside}`),
          slips,
          [
            [
              ["Apply the principle", "应用极大值原理"],
              [`Every interior value lies strictly between $${low}$ and $${high}$.`, `每个内部的值都严格介于 $${low}$ 和 $${high}$ 之间。`],
            ],
            [
              ["Test the options", "检查选项"],
              [`Only $${inside}$ lies in that range.`, `只有 $${inside}$ 在这个范围内。`],
            ],
          ],
          [
            `By the mean value property the centre value is an average of values between $${low}$ and $${high}$, so it cannot leave that range either.`,
            `由平均值性质，中心的值是介于 $${low}$ 和 $${high}$ 之间的值的平均，所以它也不可能超出这个范围。`,
          ],
        );
      },
    ),
  ],
);

const eigenfunctions = topic(
  "orthogonal-eigenfunctions-for-pdes",
  ["Orthogonal Eigenfunctions for PDEs", "偏微分方程的正交特征函数"],
  ["Find eigenvalues for mixed conditions, and use orthogonality.", "求混合条件的特征值，并利用正交性。"],
  ["separation-of-variables-for-pdes", "introduction-to-fourier-series"],
  [],
  [
    point(
      "eigenvalues-for-mixed-ends",
      ["Eigenvalues for mixed ends", "混合端点的特征值"],
      [
        "Boundary conditions choose the eigenfunctions. If one end is fixed at zero and the other insulated, a sine must start at zero and be flat at the far end, so it fits an odd number of quarter waves. The eigenvalues are thus $\\left(\\frac{(2n - 1)\\pi}{2L}\\right)^2$. Other conditions yield other sets, but the separated problem always has the same structure. For example, with $L = 1$ the second eigenvalue is $\\left(\\frac{3\\pi}{2}\\right)^{2} = \\frac{9\\pi^{2}}{4}$, with eigenfunction $\\sin\\frac{3\\pi x}{2}$, three quarter waves.\n\nCheck: $X = \\sin\\frac{3\\pi x}{2}$ has $X(0) = 0$ and $X'(1) = \\frac{3\\pi}{2}\\cos\\frac{3\\pi}{2} = 0$.\n\n> **Watch out.** The denominator is $2L$, not $L$, and the numbers are the odd ones $1, 3, 5, \\ldots$, not $1, 2, 3, \\ldots$.",
        "边界条件决定特征函数。如果一端固定为零，另一端绝热，正弦必须从零开始，并在另一端变平，所以它容纳奇数个四分之一波。因此特征值是 $\\left(\\frac{(2n - 1)\\pi}{2L}\\right)^2$。其他条件给出其他的集合，但分离后的问题结构总是相同的。例如，$L = 1$ 时第二个特征值是 $\\left(\\frac{3\\pi}{2}\\right)^{2} = \\frac{9\\pi^{2}}{4}$，特征函数是 $\\sin\\frac{3\\pi x}{2}$，即三个四分之一波。\n\n检验：$X = \\sin\\frac{3\\pi x}{2}$ 满足 $X(0) = 0$，$X'(1) = \\frac{3\\pi}{2}\\cos\\frac{3\\pi}{2} = 0$。\n\n> **注意。** 分母是 $2L$ 而不是 $L$，所用的数是奇数 $1, 3, 5, \\ldots$，不是 $1, 2, 3, \\ldots$。",
      ],
      (rng) =>
        until(() => {
          const L = rng.int(1, 6);
          const n = rng.int(1, 6);
          const odd = 2 * n - 1;
          const answer = Q.of(odd * odd, 4 * L * L);
          const misses: Miss[] = [
            [
              Q.of(n * n, L * L),
              "That is the eigenvalue for two fixed ends; an insulated end needs an odd number of quarter waves.",
              "那是两端固定时的特征值；绝热端需要奇数个四分之一波。",
            ],
            [
              Q.of(odd * odd, L * L),
              "That uses $L$ in the denominator; quarter waves need $2L$.",
              "那在分母中用了 $L$；四分之一波需要 $2L$。",
            ],
            [Q.of(odd, 2 * L), "That forgets to square the frequency.", "那忘了把频率平方。"],
          ];
          return worked(
            [
              `For $X'' = -\\lambda X$ with $X(0) = 0$ and $X'(${L}) = 0$, eigenvalue number ${n} equals $k\\pi^2$. What is $k$?`,
              `对于 $X'' = -\\lambda X$，$X(0) = 0$，$X'(${L}) = 0$，第 ${n} 个特征值等于 $k\\pi^2$。$k$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Fit the quarter waves", "配四分之一波"],
                [
                  `Mode ${n} fits ${odd} quarter ${odd === 1 ? "wave" : "waves"}: $X = \\sin\\frac{${times(odd, "\\pi")} x}{${2 * L}}$.`,
                  `第 ${n} 个模态容纳 ${odd} 个四分之一波：$X = \\sin\\frac{${times(odd, "\\pi")} x}{${2 * L}}$。`,
                ],
              ],
              [
                ["Square the frequency", "把频率平方"],
                [
                  `$\\lambda = \\left(\\frac{${times(odd, "\\pi")}}{${2 * L}}\\right)^2$, so $k = ${answer.toLatex()}$.`,
                  `$\\lambda = \\left(\\frac{${times(odd, "\\pi")}}{${2 * L}}\\right)^2$，所以 $k = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `$X(0) = 0$, and $X'(${L})$ is a multiple of $\\cos\\frac{${times(odd, "\\pi")}}{2} = 0$, so both conditions hold.`,
              `$X(0) = 0$，而 $X'(${L})$ 是 $\\cos\\frac{${times(odd, "\\pi")}}{2} = 0$ 的倍数，所以两个条件都成立。`,
            ],
          );
        }),
    ),
    point(
      "orthogonality-of-sine-modes",
      ["Orthogonality of sine modes", "正弦模态的正交性"],
      [
        "Eigenfunctions with different eigenvalues are orthogonal: the integral of their product over the interval is zero. For sines on an interval of length $L$, the integral of a mode with itself is $\\frac{L}{2}$. This is what makes series methods work, because multiplying an expansion by one mode and integrating kills all the other terms and isolates a single coefficient of the series. For example, on $[0, 2]$, $\\int_0^2 \\sin\\frac{\\pi x}{2}\\sin(\\pi x)\\,dx = 0$, while $\\int_0^2 \\sin^{2}\\frac{\\pi x}{2}\\,dx = 1$.\n\nCheck: $\\sin^{2}$ averages to $\\frac{1}{2}$ over whole half periods, and $\\frac{1}{2} \\cdot 2 = 1$.\n\n> **Watch out.** A mode with itself gives $\\frac{L}{2}$, not $L$: the square of a sine averages to one half.",
        "特征值不同的特征函数是正交的：它们的乘积在区间上的积分为零。对长度为 $L$ 的区间上的正弦，一个模态与自身的积分是 $\\frac{L}{2}$。这正是级数方法有效的原因，因为把展开式乘以一个模态再积分，就消去了其他所有项，只留下级数的一个系数。例如，在 $[0, 2]$ 上，$\\int_0^2 \\sin\\frac{\\pi x}{2}\\sin(\\pi x)\\,dx = 0$，而 $\\int_0^2 \\sin^{2}\\frac{\\pi x}{2}\\,dx = 1$。\n\n检验：$\\sin^{2}$ 在整数个半周期上的平均值是 $\\frac{1}{2}$，而 $\\frac{1}{2} \\cdot 2 = 1$。\n\n> **注意。** 模态与自身的积分是 $\\frac{L}{2}$，不是 $L$：正弦的平方平均为二分之一。",
      ],
      (rng) =>
        until(() => {
          const L = rng.int(2, 12);
          const n = rng.int(1, 7);
          const m = rng.bool() ? n : rng.pick([1, 2, 3, 4, 5, 6, 7].filter((v) => v !== n));
          const a = rng.int(2, 9);
          const answer = m === n ? Q.of(a * L, 2) : Q.of(0);
          const misses: Miss[] =
            m === n
              ? [
                  [
                    Q.of(0),
                    "That treats the two factors as different modes; they are the same mode.",
                    "那把两个因子当成了不同的模态；它们是同一个模态。",
                  ],
                  [
                    Q.of(a * L),
                    "That takes the square of the sine to average $1$; it averages $\\frac{1}{2}$.",
                    "那把正弦平方的平均值当成了 $1$；它是 $\\frac{1}{2}$。",
                  ],
                  [Q.of(L, 2), `That drops the factor $${a}$.`, `那丢掉了因子 $${a}$。`],
                ]
              : [
                  [
                    Q.of(a * L, 2),
                    "That is the integral of a mode with itself; these modes differ.",
                    "那是模态与自身的积分；这两个模态不同。",
                  ],
                  [
                    Q.of(a * L),
                    "Different modes are orthogonal, so their product integrates to zero.",
                    "不同的模态正交，所以它们的乘积积分为零。",
                  ],
                  [
                    Q.of(L, 2),
                    "That is the integral of a mode with itself, without the factor; these modes differ.",
                    "那是模态与自身的积分，而且没乘系数；这两个模态不同。",
                  ],
                ];
          return worked(
            [
              `What is $\\int_0^{${L}} ${a}${mode(n, L)}${mode(m, L)}\\,dx$?`,
              `$\\int_0^{${L}} ${a}${mode(n, L)}${mode(m, L)}\\,dx$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Compare the mode numbers", "比较模态序号"],
                m === n
                  ? [
                      `Writing each factor as $\\sin\\frac{n\\pi x}{${L}}$, both are mode ${n}, so the integrand is $${a}$ times a squared sine.`,
                      `把每个因子写成 $\\sin\\frac{n\\pi x}{${L}}$，两个都是第 ${n} 个模态，所以被积函数是 $${a}$ 乘正弦的平方。`,
                    ]
                  : [
                      `Writing each factor as $\\sin\\frac{n\\pi x}{${L}}$, the modes are ${n} and ${m}, which differ, so they are orthogonal.`,
                      `把每个因子写成 $\\sin\\frac{n\\pi x}{${L}}$，两个模态是第 ${n} 个和第 ${m} 个，它们不同，所以正交。`,
                    ],
              ],
              [
                ["Integrate", "积分"],
                m === n
                  ? [
                      `The squared sine averages $\\frac{1}{2}$ over $[0, ${L}]$, so the integral is $${a} \\cdot \\frac{${L}}{2} = ${answer.toLatex()}$.`,
                      `正弦的平方在 $[0, ${L}]$ 上平均为 $\\frac{1}{2}$，所以积分是 $${a} \\cdot \\frac{${L}}{2} = ${answer.toLatex()}$。`,
                    ]
                  : ["The integral of their product is $0$.", "它们乘积的积分是 $0$。"],
              ],
            ],
            m === n
              ? [
                  `$\\sin^2 = \\frac{1}{2}(1 - \\cos 2\\theta)$, and the cosine part integrates to $0$ over the interval, leaving $${a} \\cdot \\frac{1}{2} \\cdot ${L} = ${answer.toLatex()}$.`,
                  `$\\sin^2 = \\frac{1}{2}(1 - \\cos 2\\theta)$，余弦部分在区间上的积分为 $0$，剩下 $${a} \\cdot \\frac{1}{2} \\cdot ${L} = ${answer.toLatex()}$。`,
                ]
              : [
                  `The product equals $\\frac{1}{2}$ times a difference of cosines of mode numbers $${Math.abs(n - m)}$ and $${n + m}$, and each integrates to $0$ over $[0, ${L}]$.`,
                  `乘积等于 $\\frac{1}{2}$ 乘以模态序号为 $${Math.abs(n - m)}$ 和 $${n + m}$ 的两个余弦之差，每个余弦在 $[0, ${L}]$ 上的积分都是 $0$。`,
                ],
          );
        }),
    ),
  ],
);

const fourierData = topic(
  "matching-initial-data-with-fourier-series",
  ["Matching Initial Data with Fourier Series", "用傅里叶级数匹配初始数据"],
  ["Compute coefficients of initial data, and evaluate a sum of modes.", "计算初始数据的系数，并求模态之和的值。"],
  ["orthogonal-eigenfunctions-for-pdes", "solving-bvps-using-fourier-series"],
  [],
  [
    point(
      "the-coefficient-of-a-constant",
      ["The coefficient of a constant", "常数的系数"],
      [
        "To match an initial condition, expand it in the eigenfunctions. By orthogonality, the sine coefficient is $\\frac{2}{L}$ times the integral of the function times that mode. For a constant function $C$, the result is zero for even modes and $\\frac{4C}{n\\pi}$ for odd ones. The coefficients fall slowly, because a constant does not match the zero boundary values of the sine modes. For example, $f = 5$ on $[0, 2]$ has mode $3$ coefficient $\\frac{2}{2}\\int_0^2 5\\sin\\frac{3\\pi x}{2}\\,dx = \\frac{20}{3\\pi}$.\n\nCheck: $\\frac{4C}{n\\pi}$ with $C = 5$ and $n = 3$ gives $\\frac{20}{3\\pi}$ too, and the length $2$ has cancelled.\n\n> **Watch out.** The length cancels from the coefficient; and even modes give zero, because their sine is odd about the midpoint.",
        "要匹配初始条件，就把它按特征函数展开。根据正交性，正弦系数是 $\\frac{2}{L}$ 乘函数与这个模态之积的积分。对常数函数 $C$，偶数模态的结果是零，奇数模态的结果是 $\\frac{4C}{n\\pi}$。系数下降得很慢，因为常数与正弦模态的零边界值不相符。例如，$[0, 2]$ 上 $f = 5$ 的第 $3$ 个模态的系数是 $\\frac{2}{2}\\int_0^2 5\\sin\\frac{3\\pi x}{2}\\,dx = \\frac{20}{3\\pi}$。\n\n检验：$\\frac{4C}{n\\pi}$ 取 $C = 5$，$n = 3$，也得 $\\frac{20}{3\\pi}$，长度 $2$ 已经消掉了。\n\n> **注意。** 长度会从系数中消去；偶数模态给出零，因为它的正弦关于中点是奇的。",
      ],
      (rng) =>
        until(() => {
          const c = rng.int(2, 25);
          const L = rng.int(2, 9);
          const n = rng.int(1, 8);
          const odd = n % 2 === 1;
          const answer = odd ? Q.of(4 * c, n) : Q.of(0);
          const misses: Miss[] = odd
            ? [
                [
                  Q.of(2 * c, n),
                  "That drops a factor $2$: $1 - \\cos n\\pi$ is $2$ for odd $n$.",
                  "那丢掉了一个因子 $2$：$n$ 为奇数时 $1 - \\cos n\\pi = 2$。",
                ],
                [
                  Q.of(4 * c * L, n),
                  `That keeps the length $${L}$, which cancels against $\\frac{2}{L}$.`,
                  `那保留了长度 $${L}$，而它与 $\\frac{2}{L}$ 相消。`,
                ],
                [Q.of(c, n), "That drops the factor $4$.", "那丢掉了因子 $4$。"],
              ]
            : [
                [
                  Q.of(4 * c, n),
                  "That is the formula for odd modes; for even ones $1 - \\cos n\\pi = 0$.",
                  "那是奇数模态的公式；偶数模态时 $1 - \\cos n\\pi = 0$。",
                ],
                [
                  Q.of(2 * c, n),
                  "For even modes $1 - \\cos n\\pi = 0$, so nothing is left.",
                  "偶数模态时 $1 - \\cos n\\pi = 0$，所以什么也不剩。",
                ],
              ];
          return worked(
            [
              `The sine series of $f(x) = ${c}$ on $[0, ${L}]$ has mode ${n} coefficient $\\frac{k}{\\pi}$. What is $k$?`,
              `$[0, ${L}]$ 上 $f(x) = ${c}$ 的正弦级数中，第 ${n} 个模态的系数是 $\\frac{k}{\\pi}$。$k$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Integrate", "积分"],
                [
                  `$\\frac{2}{${L}}\\int_0^{${L}} ${c}${mode(n, L)}\\,dx = \\frac{${2 * c}}{${times(n, "\\pi")}}(1 - \\cos ${times(n, "\\pi")})$.`,
                  `$\\frac{2}{${L}}\\int_0^{${L}} ${c}${mode(n, L)}\\,dx = \\frac{${2 * c}}{${times(n, "\\pi")}}(1 - \\cos ${times(n, "\\pi")})$。`,
                ],
              ],
              [
                ["Use the cosine", "代入余弦值"],
                odd
                  ? [
                      `$\\cos ${times(n, "\\pi")} = -1$, so the coefficient is $\\frac{${4 * c}}{${times(n, "\\pi")}}$ and $k = ${answer.toLatex()}$.`,
                      `$\\cos ${times(n, "\\pi")} = -1$，所以系数是 $\\frac{${4 * c}}{${times(n, "\\pi")}}$，$k = ${answer.toLatex()}$。`,
                    ]
                  : [`$\\cos ${n}\\pi = 1$, so the coefficient is $0$.`, `$\\cos ${n}\\pi = 1$，所以系数是 $0$。`],
              ],
            ],
            odd
              ? [
                  `The length cancels: $\\frac{2}{${L}} \\cdot ${c} \\cdot \\frac{${2 * L}}{${times(n, "\\pi")}} = \\frac{${4 * c}}{${times(n, "\\pi")}}$, whatever the length of the interval.`,
                  `长度相消：$\\frac{2}{${L}} \\cdot ${c} \\cdot \\frac{${2 * L}}{${times(n, "\\pi")}} = \\frac{${4 * c}}{${times(n, "\\pi")}}$，与区间长度无关。`,
                ]
              : [
                  `For even $n$ the mode is odd about the midpoint $x = ${Q.of(L, 2).toLatex()}$, so its integral against a constant cancels in two halves.`,
                  `$n$ 为偶数时，这个模态关于中点 $x = ${Q.of(L, 2).toLatex()}$ 是奇的，所以它与常数的积分在两半中相消。`,
                ],
          );
        }),
    ),
    point(
      "evaluating-a-sum-of-modes",
      ["Evaluating a sum of modes", "求模态之和的值"],
      [
        "A solution from a few modes is evaluated term by term. Since each term is a product of a coefficient, a space factor and a time factor, it helps to check the space factor first. At the midpoint of the interval, $\\sin\\frac{n\\pi}{2}$ is $1$, $-1$, or $0$, depending on $n$. So even modes vanish there, and odd modes alternate in sign. For example, $6\\sin\\frac{\\pi x}{2} + 4\\sin(\\pi x) + 2\\sin\\frac{3\\pi x}{2}$ on $[0, 2]$ at the midpoint $x = 1$ equals $6 + 0 - 2 = 4$.\n\nCheck: mode $2$ is odd about the midpoint, so it must vanish there; modes $1$ and $3$ peak there with signs $+$ and $-$.\n\n> **Watch out.** $\\sin\\frac{3\\pi}{2} = -1$, so the third mode is subtracted at the midpoint, not added.",
        "由几个模态构成的解要逐项求值。因为每一项都是系数、空间因子和时间因子之积，先检查空间因子会有帮助。在区间中点，$\\sin\\frac{n\\pi}{2}$ 是 $1$、$-1$ 或 $0$，取决于 $n$。所以偶数模态在那里为零，奇数模态的符号交替变化。例如，$[0, 2]$ 上 $6\\sin\\frac{\\pi x}{2} + 4\\sin(\\pi x) + 2\\sin\\frac{3\\pi x}{2}$ 在中点 $x = 1$ 处等于 $6 + 0 - 2 = 4$。\n\n检验：第 $2$ 个模态关于中点是奇的，所以在那里必为零；第 $1$、$3$ 个模态在那里分别取正、负的峰值。\n\n> **注意。** $\\sin\\frac{3\\pi}{2} = -1$，所以第三个模态在中点是减去，而不是加上。",
      ],
      (rng) =>
        until(() => {
          const L = rng.int(2, 8);
          const [a, b, d] = [rng.int(2, 15), rng.int(2, 15), rng.int(2, 15)];
          const answer = a - b;
          const misses: Miss[] = [
            [a + b, "That adds the third mode; its sine is $-1$ at the midpoint.", "那加上了第三个模态；它的正弦在中点是 $-1$。"],
            [a + d + b, "That takes every sine to be $1$ at the midpoint.", "那把每个正弦在中点都当成了 $1$。"],
            [a + d - b, "That keeps the second mode, which vanishes at the midpoint.", "那保留了第二个模态，而它在中点为零。"],
            [b - a, "That has the signs of the first and third modes swapped.", "那把第一个和第三个模态的符号弄反了。"],
          ];
          return worked(
            [
              `Let $f(x) = ${a}${mode(1, L)} + ${d}${mode(2, L)} + ${b}${mode(3, L)}$ on $[0, ${L}]$. What is $f$ at the midpoint?`,
              `设 $[0, ${L}]$ 上 $f(x) = ${a}${mode(1, L)} + ${d}${mode(2, L)} + ${b}${mode(3, L)}$。$f$ 在中点的值是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Evaluate the sines", "求正弦值"],
                [
                  "At the midpoint the three sines are $\\sin\\frac{\\pi}{2} = 1$, $\\sin \\pi = 0$ and $\\sin\\frac{3\\pi}{2} = -1$.",
                  "在中点，三个正弦分别是 $\\sin\\frac{\\pi}{2} = 1$，$\\sin \\pi = 0$，$\\sin\\frac{3\\pi}{2} = -1$。",
                ],
              ],
              [
                ["Combine", "合并"],
                [
                  `$${a} \\cdot 1 + ${d} \\cdot 0 + ${b} \\cdot (-1) = ${answer}$.`,
                  `$${a} \\cdot 1 + ${d} \\cdot 0 + ${b} \\cdot (-1) = ${answer}$。`,
                ],
              ],
            ],
            [
              "Mode 2 is odd about the midpoint, so it vanishes there, while modes 1 and 3 reach their peaks there with opposite signs.",
              "第 2 个模态关于中点是奇的，所以在那里为零；第 1、3 个模态在那里以相反的符号达到峰值。",
            ],
          );
        }),
    ),
  ],
);

const finiteDifferences = topic(
  "finite-differences-for-the-heat-equation",
  ["Finite Differences for the Heat Equation", "热方程的有限差分"],
  ["Take a step of the explicit scheme, and choose a stable time step.", "进行显式格式的一步计算，并选择稳定的时间步长。"],
  ["the-heat-equation"],
  [],
  [
    point(
      "one-step-of-the-explicit-scheme",
      ["One step of the explicit scheme", "显式格式的一步"],
      [
        "A computer solves the heat equation on a grid. The explicit scheme replaces each derivative by a difference, which gives $u_i^{\\text{new}} = u_i + r(u_{i-1} - 2u_i + u_{i+1})$. Here $r = \\frac{c \\Delta t}{\\Delta x^{2}}$. Each new value thus depends only on three old values nearby. For example, with $r = \\frac{1}{4}$ and values $10$, $4$, $6$, the middle value becomes $4 + \\frac{1}{4}(10 - 8 + 6) = 4 + 2 = 6$.\n\nCheck: the update is also the weighted average $\\frac{1}{4} \\cdot 10 + \\frac{1}{2} \\cdot 4 + \\frac{1}{4} \\cdot 6 = 6$.\n\n> **Watch out.** The difference subtracts twice the middle value; leaving out $-2u_i$ makes the value jump.",
        "计算机在网格上求解热方程。显式格式用差分代替每个导数，得到 $u_i^{\\text{new}} = u_i + r(u_{i-1} - 2u_i + u_{i+1})$。这里 $r = \\frac{c \\Delta t}{\\Delta x^{2}}$。因此每个新值只依赖附近的三个旧值。例如，$r = \\frac{1}{4}$，三个值为 $10$、$4$、$6$，中间的值变为 $4 + \\frac{1}{4}(10 - 8 + 6) = 4 + 2 = 6$。\n\n检验：这次更新也是加权平均 $\\frac{1}{4} \\cdot 10 + \\frac{1}{2} \\cdot 4 + \\frac{1}{4} \\cdot 6 = 6$。\n\n> **注意。** 差分要减去中间值的两倍；漏掉 $-2u_i$ 会使值猛涨。",
      ],
      (rng) =>
        until(() => {
          const r = rng.pick([Q.of(1, 4), Q.of(1, 2), Q.of(1, 5), Q.of(2, 5), Q.of(1, 3)]);
          const [left, mid, right] = [rng.int(0, 30), rng.int(0, 30), rng.int(0, 30)];
          const change = left + right - 2 * mid;
          const answer = Q.of(mid).add(r.mul(Q.of(change)));
          const centre = Q.of(1).sub(r.mul(Q.of(2)));
          const misses: Miss[] = [
            [Q.of(mid + change), "That takes $r = 1$; the difference must be multiplied by $r$.", "那取了 $r = 1$；差分必须乘以 $r$。"],
            [Q.of(mid).add(r.mul(Q.of(left + right))), "That leaves out $-2u_i$ from the difference.", "那在差分中漏掉了 $-2u_i$。"],
            [Q.of(mid).sub(r.mul(Q.of(change))), "That subtracts the difference; it is added.", "那减去了差分；应当加上它。"],
          ];
          return worked(
            [
              `With $r = ${r.toLatex()}$, a grid point has value ${mid} and its neighbours have values ${left} and ${right}. What is its value after one explicit step?`,
              `设 $r = ${r.toLatex()}$，一个网格点的值是 ${mid}，它的邻点的值是 ${left} 和 ${right}。显式格式一步后它的值是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Form the second difference", "求二阶差分"],
                [`$${left} - 2(${mid}) + ${right} = ${change}$.`, `$${left} - 2(${mid}) + ${right} = ${change}$。`],
              ],
              [
                ["Update", "更新"],
                [
                  `$${mid} + ${r.toLatex()}(${change}) = ${answer.toLatex()}$.`,
                  `$${mid} + ${r.toLatex()}(${change}) = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `As a weighted average: $${r.toLatex()} \\cdot ${left} + ${centre.toLatex()} \\cdot ${mid} + ${r.toLatex()} \\cdot ${right} = ${answer.toLatex()}$.`,
              `写成加权平均：$${r.toLatex()} \\cdot ${left} + ${centre.toLatex()} \\cdot ${mid} + ${r.toLatex()} \\cdot ${right} = ${answer.toLatex()}$。`,
            ],
          );
        }),
    ),
    point(
      "a-stable-time-step",
      ["A stable time step", "稳定的时间步长"],
      [
        "The explicit scheme is stable only when $r \\le \\frac{1}{2}$. Beyond this, small errors grow at each step and soon swamp the solution. So the largest allowed time step is $\\Delta t = \\frac{\\Delta x^{2}}{2c}$, which is severe: halving the spacing forces four times as many steps. Implicit schemes avoid this limit, at the price of solving a linear system per step. For example, $u_t = u_{xx}$ with spacing $\\frac{1}{10}$ allows at most $\\Delta t = \\frac{1}{100} \\cdot \\frac{1}{2} = \\frac{1}{200}$.\n\nCheck: with $\\Delta t = \\frac{1}{200}$, $r = \\frac{1 \\cdot \\frac{1}{200}}{\\frac{1}{100}} = \\frac{1}{2}$, exactly at the limit.\n\n> **Watch out.** The spacing enters squared: halving $\\Delta x$ cuts the allowed step to a quarter, not a half.",
        "显式格式只有在 $r \\le \\frac{1}{2}$ 时才稳定。超过这个值，小误差会逐步增长，很快淹没解。所以允许的最大时间步长是 $\\Delta t = \\frac{\\Delta x^{2}}{2c}$，这个限制很严格：间距减半要求步数变为四倍。隐式格式避免了这个限制，代价是每一步都要解一个线性方程组。例如，$u_t = u_{xx}$，间距为 $\\frac{1}{10}$，至多允许 $\\Delta t = \\frac{1}{100} \\cdot \\frac{1}{2} = \\frac{1}{200}$。\n\n检验：取 $\\Delta t = \\frac{1}{200}$，$r = \\frac{1 \\cdot \\frac{1}{200}}{\\frac{1}{100}} = \\frac{1}{2}$，恰好在极限上。\n\n> **注意。** 间距以平方进入：$\\Delta x$ 减半，允许的步长变为四分之一，而不是一半。",
      ],
      (rng) =>
        until(() => {
          const denominator = rng.int(2, 12);
          const dx = Q.of(1, denominator);
          const c = rng.int(1, 9);
          const answer = Q.of(1, 2 * c * denominator * denominator);
          const misses: Miss[] = [
            [
              Q.of(1, c * denominator * denominator),
              "That allows $r = 1$; the limit is $r = \\frac{1}{2}$.",
              "那允许 $r = 1$；极限是 $r = \\frac{1}{2}$。",
            ],
            [Q.of(1, 2 * c * denominator), "That forgets to square the spacing.", "那忘了把间距平方。"],
            [
              Q.of(c, 2 * denominator * denominator),
              `That multiplies by $c = ${c}$ instead of dividing by it.`,
              `那是乘以 $c = ${c}$，而不是除以它。`,
            ],
          ];
          return worked(
            [
              `For $u_t = ${times(c, "u_{xx}")}$ with grid spacing $${dx.toLatex()}$, what is the largest time step that the explicit scheme allows?`,
              `对于 $u_t = ${times(c, "u_{xx}")}$，网格间距为 $${dx.toLatex()}$，显式格式允许的最大时间步长是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["State the condition", "写出条件"],
                [
                  `Stability needs $r = \\frac{c\\Delta t}{\\Delta x^2} \\le \\frac{1}{2}$, so $\\Delta t \\le \\frac{\\Delta x^2}{2c}$.`,
                  `稳定性要求 $r = \\frac{c\\Delta t}{\\Delta x^2} \\le \\frac{1}{2}$，所以 $\\Delta t \\le \\frac{\\Delta x^2}{2c}$。`,
                ],
              ],
              [
                ["Substitute", "代入"],
                [
                  `$\\Delta x^2 = \\frac{1}{${denominator * denominator}}$, so $\\Delta t \\le \\frac{1}{${denominator * denominator}} \\cdot \\frac{1}{${2 * c}} = ${answer.toLatex()}$.`,
                  `$\\Delta x^2 = \\frac{1}{${denominator * denominator}}$，所以 $\\Delta t \\le \\frac{1}{${denominator * denominator}} \\cdot \\frac{1}{${2 * c}} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `With $\\Delta t = ${answer.toLatex()}$, $r = ${c} \\cdot ${answer.toLatex()} \\cdot ${denominator * denominator} = \\frac{1}{2}$, exactly at the limit.`,
              `取 $\\Delta t = ${answer.toLatex()}$，$r = ${c} \\cdot ${answer.toLatex()} \\cdot ${denominator * denominator} = \\frac{1}{2}$，恰好在极限上。`,
            ],
          );
        }),
    ),
  ],
);

/** partialDifferentialEquationsTopics holds the topics written for the Partial Differential Equations course. */
export const partialDifferentialEquationsTopics: readonly TopicDef[] = [
  lesson(
    introduction,
    [
      "The heat equation $u_t = u_{xx}$ has order $2$, set by its highest derivative $u_{xx}$, and $u = e^{-t}\\sin x$ solves it, since $u_t = -e^{-t}\\sin x$ and $u_{xx} = -e^{-t}\\sin x$ agree.",
      "热方程 $u_t = u_{xx}$ 的阶是 $2$，由最高阶导数 $u_{xx}$ 决定；$u = e^{-t}\\sin x$ 是它的解，因为 $u_t = -e^{-t}\\sin x$ 与 $u_{xx} = -e^{-t}\\sin x$ 相等。",
    ],
    [
      "at $x = \\frac{\\pi}{2}$, $t = 0$ both sides equal $-1$, and the function $u = x^{2}$, with $u_t = 0$ and $u_{xx} = 2$, does not solve the equation.",
      "在 $x = \\frac{\\pi}{2}$，$t = 0$ 处两边都等于 $-1$；而函数 $u = x^{2}$ 的 $u_t = 0$，$u_{xx} = 2$，它不是解。",
    ],
    [
      "read the order of a partial differential equation and check a proposed solution by substituting it",
      "读出偏微分方程的阶，并通过代入来检验给出的解",
    ],
  ),
  lesson(
    classifying,
    [
      "For $u_{xx} + 4u_{xy} + 3u_{yy} = 0$ the discriminant is $4^{2} - 4 \\cdot 1 \\cdot 3 = 4 > 0$, so the equation is hyperbolic, like the wave equation.",
      "对 $u_{xx} + 4u_{xy} + 3u_{yy} = 0$，判别式是 $4^{2} - 4 \\cdot 1 \\cdot 3 = 4 > 0$，所以方程是双曲型的，像波动方程一样。",
    ],
    [
      "the wave equation $u_{tt} - u_{xx} = 0$ has $0 - 4 \\cdot 1 \\cdot (-1) = 4 > 0$ too, while Laplace's equation has $0 - 4 = -4 < 0$.",
      "波动方程 $u_{tt} - u_{xx} = 0$ 的判别式也是 $0 - 4 \\cdot 1 \\cdot (-1) = 4 > 0$，而拉普拉斯方程的是 $0 - 4 = -4 < 0$。",
    ],
    [
      "compute the discriminant of a second-order equation and name its type as elliptic, parabolic or hyperbolic",
      "计算二阶方程的判别式，并判断它是椭圆型、抛物型还是双曲型",
    ],
  ),
  lesson(
    transport,
    [
      "For $u_t + 2u_x = 0$ with $u(x, 0) = x^{2}$, the profile slides right at speed $2$, so $u(x, t) = (x - 2t)^{2}$ and $u(5, 1) = 9$.",
      "对 $u_t + 2u_x = 0$，$u(x, 0) = x^{2}$，剖面以速度 $2$ 向右平移，所以 $u(x, t) = (x - 2t)^{2}$，$u(5, 1) = 9$。",
    ],
    [
      "$u_t = -4(x - 2t)$ and $2u_x = 4(x - 2t)$ add to $0$, and the value $9$ is the initial value at the foot $x = 3$.",
      "$u_t = -4(x - 2t)$ 与 $2u_x = 4(x - 2t)$ 之和为 $0$，而值 $9$ 正是垂足 $x = 3$ 处的初始值。",
    ],
    [
      "solve the transport equation by sliding the initial profile and find the foot of a characteristic",
      "通过平移初始剖面求解输运方程，并求特征线的垂足",
    ],
  ),
  lesson(
    characteristics,
    [
      "For $u_t + 3u_x = 2$ with $u(x, 0) = x$, along each characteristic $x - 3t = \\text{const}$ the value grows at rate $2$, so $u(x, t) = x - 3t + 2t$ and $u(7, 1) = 6$.",
      "对 $u_t + 3u_x = 2$，$u(x, 0) = x$，沿每条特征线 $x - 3t = \\text{常数}$，值以速率 $2$ 增长，所以 $u(x, t) = x - 3t + 2t$，$u(7, 1) = 6$。",
    ],
    [
      "$u = x - t$ has $u_t + 3u_x = -1 + 3 = 2$ and $u(x, 0) = x$, as required.",
      "$u = x - t$ 满足 $u_t + 3u_x = -1 + 3 = 2$，且 $u(x, 0) = x$，符合要求。",
    ],
    [
      "follow characteristics through a source term and through a speed that varies with position",
      "沿特征线处理源项，以及随位置变化的速度",
    ],
  ),
  lesson(
    separation,
    [
      "Trying $u = X(x)T(t)$ in $u_t = u_{xx}$ on $[0, \\pi]$ with fixed ends gives $X'' = -\\lambda X$ with $X(0) = X(\\pi) = 0$, so $\\lambda = n^{2}$ and $T = e^{-n^{2}t}$.",
      "在 $[0, \\pi]$ 上、两端固定，把 $u = X(x)T(t)$ 代入 $u_t = u_{xx}$，得到 $X'' = -\\lambda X$，$X(0) = X(\\pi) = 0$，所以 $\\lambda = n^{2}$，$T = e^{-n^{2}t}$。",
    ],
    [
      "for $n = 2$, $u = e^{-4t}\\sin 2x$ has $u_t = -4u = u_{xx}$ and vanishes at $x = 0$ and $x = \\pi$.",
      "对 $n = 2$，$u = e^{-4t}\\sin 2x$ 满足 $u_t = -4u = u_{xx}$，并在 $x = 0$ 和 $x = \\pi$ 处为零。",
    ],
    [
      "separate the variables, find the eigenvalues for fixed ends and solve the time equation",
      "分离变量，求两端固定时的特征值，并解时间方程",
    ],
  ),
  lesson(
    heatEquation,
    [
      "On $[0, 1]$ the mode $u = 4e^{-\\pi^{2}t}\\sin \\pi x$ solves $u_t = u_{xx}$ and decays, while the ends held at $0$ and $6$ give the steady state $u = 6x$.",
      "在 $[0, 1]$ 上，模态 $u = 4e^{-\\pi^{2}t}\\sin \\pi x$ 满足 $u_t = u_{xx}$ 并衰减；两端保持为 $0$ 和 $6$ 时，稳态是 $u = 6x$。",
    ],
    [
      "the steady state has $u_{xx} = 0$ and the right end values, and the decaying mode has $u_t = -\\pi^{2}u = u_{xx}$.",
      "稳态满足 $u_{xx} = 0$，端点值也正确；衰减模态满足 $u_t = -\\pi^{2}u = u_{xx}$。",
    ],
    [
      "evaluate a decaying solution of the heat equation and find the steady state between two fixed end temperatures",
      "计算热方程的衰减解，并求两端温度固定时的稳态",
    ],
  ),
  lesson(
    heatSeries,
    [
      "On $[0, 2]$ with $u_t = u_{xx}$, mode $3$ decays like $e^{-9\\pi^{2}t/4}$ and mode $1$ like $e^{-\\pi^{2}t/4}$, so mode $3$ decays $9$ times as fast.",
      "在 $[0, 2]$ 上，$u_t = u_{xx}$，第 $3$ 个模态按 $e^{-9\\pi^{2}t/4}$ 衰减，第 $1$ 个按 $e^{-\\pi^{2}t/4}$ 衰减，所以第 $3$ 个模态衰减快 $9$ 倍。",
    ],
    [
      "the exponents are $c\\left(\\frac{n\\pi}{L}\\right)^{2}$, and their ratio $\\frac{3^{2}}{1^{2}} = 9$ does not depend on $c$ or $L$.",
      "指数是 $c\\left(\\frac{n\\pi}{L}\\right)^{2}$，它们的比 $\\frac{3^{2}}{1^{2}} = 9$ 与 $c$、$L$ 无关。",
    ],
    [
      "find the decay exponent of each mode in a heat series and compare how fast two modes die away",
      "求热级数中每个模态的衰减指数，并比较两个模态衰减的快慢",
    ],
  ),
  lesson(
    insulated,
    [
      "A rod on $[0, 4]$ with insulated ends and initial temperature $2x + 1$ holds total heat $\\int_0^4 (2x + 1)\\,dx = 20$, so it approaches $\\frac{20}{4} = 5$.",
      "$[0, 4]$ 上两端绝热、初始温度为 $2x + 1$ 的杆，总热量是 $\\int_0^4 (2x + 1)\\,dx = 20$，所以它趋于 $\\frac{20}{4} = 5$。",
    ],
    [
      "the temperature at the midpoint, $2 \\cdot 2 + 1 = 5$, is the average of a linear function, and no heat leaves through the ends.",
      "中点处的温度 $2 \\cdot 2 + 1 = 5$ 是线性函数的平均值，而且热量不会从端点流出。",
    ],
    [
      "use cosine modes for insulated ends and find the uniform temperature the rod approaches",
      "对绝热端使用余弦模态，并求杆最终趋于的均匀温度",
    ],
  ),
  lesson(
    nonhomogeneous,
    [
      "With ends held at $2$ and $8$ on $[0, 3]$, subtracting the steady state $2 + 2x$ leaves a problem with zero ends; with a source $u_{xx} = -2$ on $[0, 2]$ and zero ends, the steady state is $x(2 - x)$.",
      "在 $[0, 3]$ 上两端保持为 $2$ 和 $8$ 时，减去稳态 $2 + 2x$ 就得到端点为零的问题；在 $[0, 2]$ 上有源 $u_{xx} = -2$ 且端点为零时，稳态是 $x(2 - x)$。",
    ],
    [
      "$2 + 2x$ is $2$ at $0$ and $8$ at $3$, and $x(2 - x)$ has second derivative $-2$ and vanishes at both ends.",
      "$2 + 2x$ 在 $0$ 处为 $2$，在 $3$ 处为 $8$；$x(2 - x)$ 的二阶导数是 $-2$，并在两端为零。",
    ],
    [
      "remove nonzero boundary values by subtracting a steady state, and find the steady state with a heat source",
      "通过减去稳态来消去非零边界值，并求有热源时的稳态",
    ],
  ),
  lesson(
    waveEquation,
    [
      "On a string of length $2$ with $u_{tt} = 9u_{xx}$, mode $n$ has frequency $\\frac{3n\\pi}{2}$, so the fundamental $n = 1$ has period $\\frac{2\\pi}{3\\pi/2} = \\frac{4}{3}$.",
      "在长为 $2$ 的弦上，$u_{tt} = 9u_{xx}$，第 $n$ 个模态的频率是 $\\frac{3n\\pi}{2}$，所以基频 $n = 1$ 的周期是 $\\frac{2\\pi}{3\\pi/2} = \\frac{4}{3}$。",
    ],
    [
      "the period of the fundamental is $\\frac{2L}{c} = \\frac{2 \\cdot 2}{3} = \\frac{4}{3}$, the time for a wave to travel to the far end and back.",
      "基频的周期是 $\\frac{2L}{c} = \\frac{2 \\cdot 2}{3} = \\frac{4}{3}$，正是波传到另一端再返回所用的时间。",
    ],
    ["check standing waves and find the frequencies and periods of a vibrating string", "验证驻波，并求振动的弦的频率和周期"],
  ),
  lesson(
    dAlembert,
    [
      "For $u_{tt} = u_{xx}$ starting from rest with shape $f(x) = x^{2}$, d'Alembert's formula gives $u(3, 1) = \\frac{f(2) + f(4)}{2} = \\frac{4 + 16}{2} = 10$.",
      "对 $u_{tt} = u_{xx}$，从静止开始，初始形状为 $f(x) = x^{2}$，达朗贝尔公式给出 $u(3, 1) = \\frac{f(2) + f(4)}{2} = \\frac{4 + 16}{2} = 10$。",
    ],
    [
      "the formula simplifies to $u = x^{2} + t^{2}$, which gives $9 + 1 = 10$ and satisfies $u_{tt} = 2 = u_{xx}$.",
      "公式化简为 $u = x^{2} + t^{2}$，它给出 $9 + 1 = 10$，并满足 $u_{tt} = 2 = u_{xx}$。",
    ],
    [
      "use d'Alembert's formula for an initial shape and for an initial velocity on the whole line",
      "对整条直线上的初始形状和初始速度使用达朗贝尔公式",
    ],
  ),
  lesson(
    waveSeries,
    [
      "On $[0, 1]$ with $u_{tt} = u_{xx}$, the plucked mode $u = 5\\cos(\\pi t)\\sin(\\pi x)$ has the value $5\\cos\\pi \\cdot 1 = -5$ at $x = \\frac{1}{2}$, $t = 1$: the string has swung to the other side.",
      "在 $[0, 1]$ 上，$u_{tt} = u_{xx}$，拨动的模态 $u = 5\\cos(\\pi t)\\sin(\\pi x)$ 在 $x = \\frac{1}{2}$，$t = 1$ 处的值是 $5\\cos\\pi \\cdot 1 = -5$：弦摆到了另一侧。",
    ],
    [
      "after a full period $t = 2$ the value is $5\\cos 2\\pi = 5$ again, back where it started.",
      "经过一个完整周期 $t = 2$ 后，值又是 $5\\cos 2\\pi = 5$，回到了起点。",
    ],
    [
      "evaluate a plucked mode at a later time and find the coefficient of a mode started by an initial velocity",
      "计算拨动的模态在之后时刻的值，并求由初始速度激发的模态的系数",
    ],
  ),
  lesson(
    laplaceEquation,
    [
      "For $u = x^{2} + 2y^{2} + kz^{2}$ to be harmonic, $2 + 4 + 2k = 0$, so $k = -3$; and $u = x$ averages to $2$ on any circle about $(2, 1)$.",
      "要使 $u = x^{2} + 2y^{2} + kz^{2}$ 调和，需 $2 + 4 + 2k = 0$，所以 $k = -3$；而 $u = x$ 在以 $(2, 1)$ 为圆心的任何圆上的平均值都是 $2$。",
    ],
    [
      "the square coefficients $1 + 2 - 3$ add to $0$, and on the circle of radius $1.2$ the values $3.2$, $2$, $0.8$, $2$ average to $2$.",
      "平方项系数 $1 + 2 - 3$ 之和为 $0$；在半径为 $1.2$ 的圆上，值 $3.2$、$2$、$0.8$、$2$ 的平均是 $2$。",
    ],
    [
      "complete a harmonic function and use the mean value property to find averages without integrating",
      "补全调和函数，并用平均值性质不经积分求出平均值",
    ],
  ),
  lesson(
    laplaceRegions,
    [
      "On the disc of radius $2$ with boundary value $3\\cos 2\\theta$, the harmonic function inside is $3\\left(\\frac{r}{2}\\right)^{2}\\cos 2\\theta$, so at $r = 1$, $\\theta = 0$ it is $\\frac{3}{4}$.",
      "在半径为 $2$ 的圆盘上，边界值为 $3\\cos 2\\theta$，内部的调和函数是 $3\\left(\\frac{r}{2}\\right)^{2}\\cos 2\\theta$，所以在 $r = 1$，$\\theta = 0$ 处它是 $\\frac{3}{4}$。",
    ],
    [
      "$\\frac{3}{4}$ lies between the boundary extremes $-3$ and $3$, as the maximum principle requires.",
      "$\\frac{3}{4}$ 介于边界的最小值 $-3$ 和最大值 $3$ 之间，正符合极大值原理。",
    ],
    [
      "solve a boundary value problem on a disc by separation and bound the solution with the maximum principle",
      "用分离变量解圆盘上的边值问题，并用极大值原理估计解的范围",
    ],
  ),
  lesson(
    eigenfunctions,
    [
      "With $X(0) = 0$ and $X'(1) = 0$, the modes fit odd numbers of quarter waves, so the second eigenvalue is $\\left(\\frac{3\\pi}{2}\\right)^{2} = \\frac{9\\pi^{2}}{4}$.",
      "当 $X(0) = 0$，$X'(1) = 0$ 时，模态容纳奇数个四分之一波，所以第二个特征值是 $\\left(\\frac{3\\pi}{2}\\right)^{2} = \\frac{9\\pi^{2}}{4}$。",
    ],
    [
      "$X = \\sin\\frac{3\\pi x}{2}$ has $X(0) = 0$ and $X'(1) = \\frac{3\\pi}{2}\\cos\\frac{3\\pi}{2} = 0$.",
      "$X = \\sin\\frac{3\\pi x}{2}$ 满足 $X(0) = 0$，$X'(1) = \\frac{3\\pi}{2}\\cos\\frac{3\\pi}{2} = 0$。",
    ],
    [
      "find eigenvalues for a fixed end and an insulated end, and use the orthogonality of sine modes",
      "求一端固定、一端绝热时的特征值，并利用正弦模态的正交性",
    ],
  ),
  lesson(
    fourierData,
    [
      "The constant $5$ on $[0, 2]$ has mode $3$ sine coefficient $\\frac{4 \\cdot 5}{3\\pi} = \\frac{20}{3\\pi}$, and its mode $2$ coefficient is $0$.",
      "$[0, 2]$ 上的常数 $5$ 的第 $3$ 个正弦系数是 $\\frac{4 \\cdot 5}{3\\pi} = \\frac{20}{3\\pi}$，第 $2$ 个系数是 $0$。",
    ],
    [
      "$\\frac{2}{2}\\int_0^2 5\\sin\\frac{3\\pi x}{2}\\,dx = \\frac{10}{3\\pi}(1 - \\cos 3\\pi) = \\frac{20}{3\\pi}$, and mode $2$ is odd about the midpoint.",
      "$\\frac{2}{2}\\int_0^2 5\\sin\\frac{3\\pi x}{2}\\,dx = \\frac{10}{3\\pi}(1 - \\cos 3\\pi) = \\frac{20}{3\\pi}$，而第 $2$ 个模态关于中点是奇的。",
    ],
    [
      "compute the sine coefficients of initial data and evaluate a sum of modes at the midpoint",
      "计算初始数据的正弦系数，并求模态之和在中点的值",
    ],
  ),
  lesson(
    finiteDifferences,
    [
      "With $r = \\frac{1}{4}$ and grid values $10$, $4$, $6$, one explicit step changes the middle value to $4 + \\frac{1}{4}(10 - 8 + 6) = 6$.",
      "取 $r = \\frac{1}{4}$，网格值为 $10$、$4$、$6$，显式格式一步把中间的值变为 $4 + \\frac{1}{4}(10 - 8 + 6) = 6$。",
    ],
    [
      "the weighted average $\\frac{1}{4} \\cdot 10 + \\frac{1}{2} \\cdot 4 + \\frac{1}{4} \\cdot 6 = 6$ agrees, and $r = \\frac{1}{4}$ is within the stability limit $\\frac{1}{2}$.",
      "加权平均 $\\frac{1}{4} \\cdot 10 + \\frac{1}{2} \\cdot 4 + \\frac{1}{4} \\cdot 6 = 6$ 与之相符，而 $r = \\frac{1}{4}$ 在稳定性极限 $\\frac{1}{2}$ 之内。",
    ],
    [
      "take a step of the explicit scheme and choose the largest time step that keeps it stable",
      "进行显式格式的一步计算，并选择保持稳定的最大时间步长",
    ],
  ),
];
