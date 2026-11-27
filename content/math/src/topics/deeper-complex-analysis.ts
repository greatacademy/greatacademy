// Further knowledge points for topics of Complex Analysis, each a skill the topic's own points
// leave out. See `deeperComplexAnalysisPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { Q } from "@ga/subject-math";
import { complexDrawings1 } from "../explanation-drawings-complex-analysis-1.ts";
import { precalculusDrawings4 } from "../explanation-drawings-precalculus-4.ts";

import { ask, point } from "../university-kit.ts";
import { type Miss, until, worked } from "./number-theory-course.ts";

/** gcd returns the greatest common divisor of two nonnegative numbers. */
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** frac builds a rational number with a positive denominator. */
const frac = (n: number, d: number) => (d < 0 ? Q.of(-n, -d) : Q.of(n, d));

/** coef writes a coefficient before a symbol, leaving out 1. */
const coef = (c: number, symbol: string) => (c === 1 ? symbol : c === -1 ? `-${symbol}` : `${c}${symbol}`);

/** cx writes the complex number with the given real and imaginary parts. */
const cx = (re: number, im: number) => {
  if (im === 0) return `${re}`;
  if (re === 0) return coef(im, "i");
  return `${re} ${im < 0 ? "-" : "+"} ${coef(Math.abs(im), "i")}`;
};

/** shift writes z minus a number. */
const shift = (a: number) => (a < 0 ? `z + ${-a}` : `z - ${a}`);

/** pow writes a base to a power, leaving out the exponent 1. */
const pow = (base: string, e: number) => (e === 1 ? base : `${base}^{${e}}`);

/** timesPi writes a rational multiple of pi. */
const timesPi = (q: ReturnType<typeof frac>) =>
  q.eq(Q.of(0, 1)) ? "0" : q.eq(Q.of(1, 1)) ? "\\pi" : q.eq(Q.of(-1, 1)) ? "-\\pi" : `${q.toLatex()} \\pi`;

const addingArguments = {
  ...point(
    "arguments-of-products-and-quotients",
    ["Arguments of products and quotients", "积与商的辐角"],
    [
      "Multiplying complex numbers multiplies their moduli and adds their arguments, and dividing subtracts the arguments. So the polar form makes multiplication a rotation combined with a scaling. Reduce the resulting angle to the range from 0 up to a full turn, because arguments repeat every full turn.\n\nFor example, if $z$ has argument $300^\\circ$ and $w$ has argument $150^\\circ$, then $zw$ has argument $450^\\circ$, which is $90^\\circ$ after removing a full turn, and $\\frac{z}{w}$ has argument $150^\\circ$. Check: multiplying $\\frac{z}{w}$ by $w$ gives $150^\\circ + 150^\\circ = 300^\\circ$, the argument of $z$.\n\n> **Watch out.** The moduli do not affect the argument at all, and the arguments are added or subtracted, never multiplied.",
      "复数相乘时模相乘、辐角相加，相除时辐角相减。所以极坐标形式把乘法变成旋转加伸缩。要把得到的角化到从 0 到一整圈的范围内，因为辐角每一整圈重复一次。\n\n例如，若 $z$ 的辐角是 $300^\\circ$，$w$ 的辐角是 $150^\\circ$，则 $zw$ 的辐角是 $450^\\circ$，去掉一整圈后为 $90^\\circ$；$\\frac{z}{w}$ 的辐角是 $150^\\circ$。检验：$\\frac{z}{w}$ 乘以 $w$，辐角为 $150^\\circ + 150^\\circ = 300^\\circ$，正是 $z$ 的辐角。\n\n> **注意。** 模对辐角毫无影响；辐角只做加减，从不相乘。",
    ],
    (rng) => {
      const [a, b] = [15 * rng.int(1, 23), 15 * rng.int(1, 23)];
      const [r, s] = [rng.int(2, 9), rng.int(2, 9)];
      const product = rng.bool();
      const raw = product ? a + b : a - b;
      const answer = (raw + 720) % 360;
      const turns = (answer - raw) / 360;
      const [word, wordZh] = product ? ["zw", "zw"] : ["\\frac{z}{w}", "\\frac{z}{w}"];
      const reduce: [string, string] =
        turns === 0
          ? [
              `This is already from 0 up to 360, so the argument is $${answer}^\\circ$.`,
              `它已在 0 到 360 之间，所以辐角是 $${answer}^\\circ$。`,
            ]
          : [
              `${turns > 0 ? "Adding" : "Removing"} a full turn of $360^\\circ$ brings this into the range: $${raw} ${turns > 0 ? "+" : "-"} 360 = ${answer}$.`,
              `${turns > 0 ? "加上" : "减去"}一整圈 $360^\\circ$ 使它落入范围：$${raw} ${turns > 0 ? "+" : "-"} 360 = ${answer}$。`,
            ];
      const back = product ? (answer - b + 360) % 360 : (answer + b) % 360;
      return ask(
        [
          `$|z| = ${r}$ with argument $${a}^\\circ$, and $|w| = ${s}$ with argument $${b}^\\circ$. What is the argument of $${word}$ in degrees, from 0 up to 360?`,
          `$|z| = ${r}$，辐角 $${a}^\\circ$；$|w| = ${s}$，辐角 $${b}^\\circ$。$${wordZh}$ 的辐角是多少度（从 0 到 360）？`,
        ],
        answer,
        [(a + b + 180) % 360, (a - b + 720 + (product ? 0 : 15)) % 360, (a * b) % 360, (answer + 90) % 360],
        [
          `**Step 1: ${product ? "Add" : "Subtract"} the arguments.** Arguments ${product ? "add when numbers multiply" : "subtract when numbers divide"}, and the moduli $${r}$ and $${s}$ play no part: $${a} ${product ? "+" : "-"} ${b} = ${raw}$.\n\n**Step 2: Reduce to one turn.** ${reduce[0]}\n\n**Check.** ${product ? `Dividing $zw$ by $w$ must give back $z$: $${answer} - ${b}$` : `Multiplying $\\frac{z}{w}$ by $w$ must give back $z$: $${answer} + ${b}$`} reduces to $${back}^\\circ$, the argument of $z$.`,
          `**第一步：辐角${product ? "相加" : "相减"}。**${product ? "相乘时辐角相加" : "相除时辐角相减"}，模 $${r}$ 和 $${s}$ 不起作用：$${a} ${product ? "+" : "-"} ${b} = ${raw}$。\n\n**第二步：化到一圈之内。**${reduce[1]}\n\n**检验。**${product ? `用 $zw$ 除以 $w$ 应得回 $z$：$${answer} - ${b}$` : `用 $\\frac{z}{w}$ 乘以 $w$ 应得回 $z$：$${answer} + ${b}$`} 化简后为 $${back}^\\circ$，正是 $z$ 的辐角。`,
        ],
      );
    },
  ),
  figure: precalculusDrawings4["the-polar-form-of-a-complex-number#arguments-of-products-and-quotients"],
};

const imageOfACircle = {
  ...point(
    "the-image-of-a-circle-under-a-power",
    ["The image of a circle under a power", "圆在幂函数下的像"],
    [
      "A function of a complex variable moves points of one plane to another, so it helps to follow simple curves. Under $f(z) = c z^k$, every point with $|z| = r$ goes to a point with modulus $c r^k$. For $f(z) = 2z^2$, the circle $|z| = 1$ goes to the circle $|w| = 2 \\cdot 1^2 = 2$, and $|z| = 3$ goes to $|w| = 2 \\cdot 3^2 = 18$, each traversed twice.\n\nCheck: on $z = 3e^{it}$, $f(z) = 18e^{2it}$, whose modulus is 18 and whose angle $2t$ makes two full turns as $t$ makes one.\n\n> **Watch out.** Only $r$ is raised to the power $k$; the coefficient multiplies once. So the radius is $c r^k$, not $(c r)^k$ and not $c k r$.",
      "复变函数把一个平面上的点移到另一个平面，所以跟踪简单曲线很有帮助。在 $f(z) = c z^k$ 下，每个满足 $|z| = r$ 的点都变为模为 $c r^k$ 的点。对 $f(z) = 2z^2$，圆 $|z| = 1$ 映到圆 $|w| = 2 \\cdot 1^2 = 2$，$|z| = 3$ 映到 $|w| = 2 \\cdot 3^2 = 18$，每个都绕行两次。\n\n检验：在 $z = 3e^{it}$ 上，$f(z) = 18e^{2it}$，它的模是 18，而 $t$ 转一圈时角 $2t$ 转两整圈。\n\n> **注意。** 只有 $r$ 取 $k$ 次幂；系数只乘一次。所以半径是 $c r^k$，不是 $(c r)^k$，也不是 $c k r$。",
    ],
    (rng) =>
      until(() => {
        const [c, k, r] = [rng.int(1, 3), rng.int(2, 4), rng.int(2, 6)];
        const answer = c * r ** k;
        const f = coef(c, `z^{${k}}`);
        return worked(
          [
            `The circle $|z| = ${r}$ maps onto a circle under $f(z) = ${f}$. What is its radius?`,
            `圆 $|z| = ${r}$ 在 $f(z) = ${f}$ 下映到一个圆上。这个圆的半径是多少？`,
          ],
          answer,
          [
            [c * r * k, `That multiplies by ${k} instead of raising to the power ${k}.`, `那乘了 ${k}，而不是取 ${k} 次幂。`],
            [(c * r) ** k, "That raises the coefficient to the power too; it multiplies only once.", "那把系数也取了幂；它只乘一次。"],
            [r ** k + c, "That adds the coefficient instead of multiplying by it.", "那把系数加上了，而不是乘上。"],
          ],
          [
            [
              ["Write the circle", "写出圆周"],
              [`$z = ${r}e^{it}$ for $0 \\le t \\le 2\\pi$.`, `$z = ${r}e^{it}$，$0 \\le t \\le 2\\pi$。`],
            ],
            [
              ["Apply the map", "作用映射"],
              [
                `$f(z) = ${c === 1 ? "" : `${c} \\cdot `}${r}^{${k}} e^{${k}it} = ${answer}e^{${k}it}$.`,
                `$f(z) = ${c === 1 ? "" : `${c} \\cdot `}${r}^{${k}} e^{${k}it} = ${answer}e^{${k}it}$。`,
              ],
            ],
            [
              ["Read the radius", "读出半径"],
              [
                `Every image point has modulus ${answer}, so the image is the circle of radius ${answer}, traversed ${k} times.`,
                `每个像点的模都是 ${answer}，所以像是半径为 ${answer} 的圆，绕行 ${k} 次。`,
              ],
            ],
          ],
          [
            `The point $z = ${r}$ of the circle goes to $f(${r}) = ${answer}$ on the positive real axis, which lies on the circle $|w| = ${answer}$.`,
            `圆上的点 $z = ${r}$ 映到正实轴上的 $f(${r}) = ${answer}$，它在圆 $|w| = ${answer}$ 上。`,
          ],
        );
      }),
  ),
  figure: complexDrawings1["functions-of-a-complex-variable#the-image-of-a-circle-under-a-power"],
};

const limitByCancelling = point(
  "a-limit-by-cancelling-a-factor",
  ["A limit by cancelling a factor", "约去因子求极限"],
  [
    "When both numerator and denominator vanish at the point, factor and cancel, exactly as for real limits. The algebra of complex numbers has the same factorization $z^2 - a^2 = (z - a)(z + a)$. For $a = 1 + 2i$, $a^2 = -3 + 4i$, so $\\frac{z^2 - (-3 + 4i)}{z - (1 + 2i)} = z + 1 + 2i$ away from $a$, and the limit is $2a = 2 + 4i$.\n\nCheck: at $z = a + h$ with small $h$, the quotient is $2a + h$, which approaches $2 + 4i$ from every direction.\n\n> **Watch out.** After cancelling, the limit is $a + a = 2a$, not $a$; and its imaginary part is twice that of $a$, not its real part.",
    "当分子和分母在该点都为零时，像实函数极限那样分解并约分。复数代数有同样的分解 $z^2 - a^2 = (z - a)(z + a)$。对 $a = 1 + 2i$，$a^2 = -3 + 4i$，所以在 $a$ 以外 $\\frac{z^2 - (-3 + 4i)}{z - (1 + 2i)} = z + 1 + 2i$，极限是 $2a = 2 + 4i$。\n\n检验：在 $z = a + h$（$h$ 很小）处，商为 $2a + h$，从各个方向都趋于 $2 + 4i$。\n\n> **注意。** 约分后极限是 $a + a = 2a$，不是 $a$；它的虚部是 $a$ 的虚部的两倍，不是实部。",
  ],
  (rng) =>
    until(() => {
      const [p, q, c] = [rng.int(1, 5), rng.int(1, 5), rng.int(1, 3)];
      const square = cx(p * p - q * q, 2 * p * q);
      const answer = 2 * c * q;
      const a = cx(p, q);
      return worked(
        [
          `The limit of $\\frac{${coef(c, `(z^2 - (${square}))`)}}{z - (${a})}$ as $z \\to ${a}$ is a complex number. What is its imaginary part?`,
          `当 $z \\to ${a}$ 时，$\\frac{${coef(c, `(z^2 - (${square}))`)}}{z - (${a})}$ 的极限是一个复数。它的虚部是多少？`,
        ],
        answer,
        [
          [2 * c * p, "That is the real part of the limit, not the imaginary part.", "那是极限的实部，不是虚部。"],
          [c * q, "That takes the limit as $a$ instead of $a + a = 2a$.", "那把极限当成了 $a$，而不是 $a + a = 2a$。"],
          [2 * q, "That drops the constant factor in front.", "那漏掉了前面的常数因子。"],
        ],
        [
          [
            ["Spot the square", "认出平方"],
            [
              `$(${a})^2 = ${square}$, so the numerator is $${coef(c, "(z^2 - a^2)")}$ with $a = ${a}$.`,
              `$(${a})^2 = ${square}$，所以分子是 $${coef(c, "(z^2 - a^2)")}$，其中 $a = ${a}$。`,
            ],
          ],
          [
            ["Cancel", "约分"],
            [
              `For $z \\ne a$ the quotient is $${coef(c, "(z + a)")}$, which is continuous.`,
              `当 $z \\ne a$ 时商为 $${coef(c, "(z + a)")}$，它是连续的。`,
            ],
          ],
          [
            ["Substitute", "代入"],
            [
              `The limit is $${c === 1 ? "" : `${c} \\cdot `}2a = ${cx(2 * c * p, 2 * c * q)}$, whose imaginary part is ${answer}.`,
              `极限是 $${c === 1 ? "" : `${c} \\cdot `}2a = ${cx(2 * c * p, 2 * c * q)}$，虚部是 ${answer}。`,
            ],
          ],
        ],
        [
          `Multiplying back: $${coef(c, `(z + a)`)}$ times $z - a$ is $${coef(c, "(z^2 - a^2)")}$, the numerator, so the cancelled form is right; at $z = a$ its imaginary part is $${c === 1 ? "" : `${c} \\cdot `}2 \\cdot ${q} = ${answer}$.`,
          `乘回去：$${coef(c, `(z + a)`)}$ 乘 $z - a$ 得 $${coef(c, "(z^2 - a^2)")}$，正是分子，所以约分正确；在 $z = a$ 处虚部为 $${c === 1 ? "" : `${c} \\cdot `}2 \\cdot ${q} = ${answer}$。`,
        ],
      );
    }),
);

const chainRule = point(
  "the-chain-rule-for-a-complex-derivative",
  ["The chain rule for a complex derivative", "复导数的链式法则"],
  [
    "The rules of differentiation carry over to complex functions, because their proofs use only the algebra of limits. So the derivative of $(a z + b)^n$ is $n a (a z + b)^{n-1}$, just as for real functions. For $f(z) = (3z + 2)^4$, $f'(z) = 4 \\cdot 3 (3z + 2)^3$, so $f'(0) = 12 \\cdot 8 = 96$.\n\nCheck: expanding, $f(z) = 16 + 96z + \\dots$, and the coefficient of $z$ is $f'(0) = 96$.\n\n> **Watch out.** The inner derivative $a$ must multiply in, and the power drops by one: $n a b^{n-1}$, not $n b^{n-1}$ and not $n a b^n$.",
    "求导法则可以推广到复函数，因为它们的证明只用到极限的代数性质。所以 $(a z + b)^n$ 的导数是 $n a (a z + b)^{n-1}$，与实函数相同。对 $f(z) = (3z + 2)^4$，$f'(z) = 4 \\cdot 3 (3z + 2)^3$，所以 $f'(0) = 12 \\cdot 8 = 96$。\n\n检验：展开得 $f(z) = 16 + 96z + \\dots$，$z$ 的系数正是 $f'(0) = 96$。\n\n> **注意。** 内层导数 $a$ 必须乘进去，幂次降一：$n a b^{n-1}$，不是 $n b^{n-1}$，也不是 $n a b^n$。",
  ],
  (rng) =>
    until(() => {
      const [a, b, n] = [rng.int(2, 4), rng.int(1, 4), rng.int(2, 5)];
      const answer = n * a * b ** (n - 1);
      const f = `(${coef(a, "z")} + ${b})`;
      return worked(
        [`If $f(z) = ${f}^{${n}}$, what is $f'(0)$?`, `若 $f(z) = ${f}^{${n}}$，$f'(0)$ 是多少？`],
        answer,
        [
          [n * b ** (n - 1), `That forgets the inner derivative ${a}.`, `那忘了内层导数 ${a}。`],
          [n * a * b ** n, "That keeps the power at $n$ instead of lowering it by one.", "那把幂次保留为 $n$，没有降一。"],
          [a * b ** (n - 1), `That drops the factor ${n} brought down from the power.`, `那漏掉了从幂次降下来的因子 ${n}。`],
        ],
        [
          [
            ["Differentiate", "求导"],
            [`$f'(z) = ${n} \\cdot ${a} ${pow(f, n - 1)}$.`, `$f'(z) = ${n} \\cdot ${a} ${pow(f, n - 1)}$。`],
          ],
          [
            ["Evaluate at 0", "在 0 处取值"],
            [
              `$f'(0) = ${n * a} \\cdot ${pow(`${b}`, n - 1)} = ${answer}$.`,
              `$f'(0) = ${n * a} \\cdot ${pow(`${b}`, n - 1)} = ${answer}$。`,
            ],
          ],
        ],
        [
          `By the binomial theorem, the term of $${f}^{${n}}$ with $z$ to the first power is $${n} \\cdot ${pow(`${b}`, n - 1)} \\cdot ${a}z = ${answer}z$, and that coefficient is $f'(0)$.`,
          `由二项式定理，$${f}^{${n}}$ 中 $z$ 的一次项是 $${n} \\cdot ${pow(`${b}`, n - 1)} \\cdot ${a}z = ${answer}z$，这个系数就是 $f'(0)$。`,
        ],
      );
    }),
);

const whereEquationsHold = point(
  "where-the-equations-hold",
  ["Where the equations hold", "方程在何处成立"],
  [
    "The Cauchy-Riemann equations can hold on a small set only. Then the function has a derivative at those points but is analytic nowhere, since being analytic needs a derivative on a whole open neighborhood. For $u = 3x^2$ and $v = 2y^2$, $u_y = 0 = -v_x$ always, while $u_x = v_y$ says $6x = 4y$, the line $y = \\frac{3}{2} x$.\n\nCheck: at $(2, 3)$ on that line, $u_x = 12$ and $v_y = 12$; at $(1, 1)$ off it, $6 \\ne 4$.\n\n> **Watch out.** Solve $u_x = v_y$ for $y$: the slope is $\\frac{a}{b}$, the coefficient of $u$ over that of $v$, not the other way round.",
    "柯西-黎曼方程可能只在一个很小的集合上成立。这时函数在这些点可导，但处处不解析，因为解析要求在整个开邻域上可导。对 $u = 3x^2$ 和 $v = 2y^2$，$u_y = 0 = -v_x$ 恒成立，而 $u_x = v_y$ 即 $6x = 4y$，也就是直线 $y = \\frac{3}{2} x$。\n\n检验：在这条线上的 $(2, 3)$ 处，$u_x = 12$，$v_y = 12$；在线外的 $(1, 1)$ 处，$6 \\ne 4$。\n\n> **注意。** 从 $u_x = v_y$ 中解出 $y$：斜率是 $\\frac{a}{b}$，即 $u$ 的系数比 $v$ 的系数，不要颠倒。",
  ],
  (rng) =>
    until(() => {
      const [a, b] = [rng.int(1, 9), rng.int(1, 9)];
      if (gcd(a, b) !== 1 || a === b) return undefined;
      const answer = frac(a, b);
      return worked(
        [
          `The function $f(x + iy) = ${coef(a, "x^2")} + ${coef(b, "y^2")} i$ satisfies the Cauchy-Riemann equations on a line $y = m x$. What is $m$?`,
          `函数 $f(x + iy) = ${coef(a, "x^2")} + ${coef(b, "y^2")} i$ 在直线 $y = m x$ 上满足柯西-黎曼方程。$m$ 是多少？`,
        ],
        answer,
        [
          [frac(b, a), "That solves for $x$ in terms of $y$: the ratio is upside down.", "那是用 $y$ 表示 $x$：比值颠倒了。"],
          [
            frac(-a, b),
            "That uses $u_x = -v_y$; the sign belongs to the other equation, $u_y = -v_x$.",
            "那用了 $u_x = -v_y$；负号属于另一个方程 $u_y = -v_x$。",
          ],
          [frac(2 * a, b), "That differentiates only $u$ and not $v$.", "那只对 $u$ 求了导，没对 $v$ 求导。"],
        ],
        [
          [
            ["Take the partial derivatives", "求偏导"],
            [
              `$u_x = ${2 * a} x$, $u_y = 0$, $v_x = 0$, $v_y = ${2 * b} y$.`,
              `$u_x = ${2 * a} x$，$u_y = 0$，$v_x = 0$，$v_y = ${2 * b} y$。`,
            ],
          ],
          [
            ["Use the second equation", "用第二个方程"],
            ["$u_y = -v_x$ holds everywhere, since both sides are 0.", "$u_y = -v_x$ 处处成立，因为两边都是 0。"],
          ],
          [
            ["Solve the first", "解第一个方程"],
            [
              `$u_x = v_y$ says $${2 * a} x = ${2 * b} y$, so $y = ${answer.toLatex()} x$.`,
              `$u_x = v_y$ 即 $${2 * a} x = ${2 * b} y$，所以 $y = ${answer.toLatex()} x$。`,
            ],
          ],
        ],
        [
          `The point $(${b}, ${a})$ lies on that line, and there $u_x = ${2 * a * b}$ and $v_y = ${2 * a * b}$ agree.`,
          `点 $(${b}, ${a})$ 在这条线上，那里 $u_x = ${2 * a * b}$ 与 $v_y = ${2 * a * b}$ 相等。`,
        ],
      );
    }),
);

const laplacianValue = point(
  "the-laplacian-at-a-point",
  ["The laplacian at a point", "某点处的拉普拉斯算子"],
  [
    "A function is harmonic when $u_{xx} + u_{yy} = 0$ everywhere. To test a candidate, compute both second derivatives and add them. For $u = x^3 + 2xy^2$, $u_{xx} = 6x$ and $u_{yy} = 4x$, so the sum at $(1, 5)$ is $10 \\cdot 1 = 10$, and $u$ is not harmonic. A single nonzero value at any point shows that the function cannot be the real part of an analytic function on a region containing that point.\n\nCheck: $x^3 - 3xy^2$, the real part of $z^3$, gives $6x - 6x = 0$, as it must.\n\n> **Watch out.** Both second derivatives here are multiples of $x$, so evaluate at the given $x$; the value of $y$ plays no part.",
    "函数调和是指处处有 $u_{xx} + u_{yy} = 0$。要检验一个候选函数，就算出两个二阶导数并相加。对 $u = x^3 + 2xy^2$，$u_{xx} = 6x$，$u_{yy} = 4x$，所以在 $(1, 5)$ 处和为 $10 \\cdot 1 = 10$，$u$ 不调和。只要某一点的值不为零，就说明它不可能是包含该点的区域上解析函数的实部。\n\n检验：$z^3$ 的实部 $x^3 - 3xy^2$ 给出 $6x - 6x = 0$，理应如此。\n\n> **注意。** 这里两个二阶导数都是 $x$ 的倍数，所以在给定的 $x$ 处取值；$y$ 的值不起作用。",
  ],
  (rng) =>
    until(() => {
      const a = rng.int(1, 4);
      const b = rng.pick([-4, -2, -1, 1, 2, 4, 5]);
      const [p, q] = [rng.int(1, 5), rng.int(1, 5)];
      if (p === q) return undefined;
      const answer = p * (6 * a + 2 * b);
      const u = `${coef(a, "x^3")} ${b < 0 ? "-" : "+"} ${coef(Math.abs(b), "x y^2")}`;
      return worked(
        [`For $u = ${u}$, what is $u_{xx} + u_{yy}$ at $(${p}, ${q})$?`, `对 $u = ${u}$，$u_{xx} + u_{yy}$ 在 $(${p}, ${q})$ 处是多少？`],
        answer,
        [
          [6 * a * p, "That leaves out $u_{yy}$.", "那漏掉了 $u_{yy}$。"],
          [
            p * (3 * a + b),
            "That uses first-derivative factors: $x^3$ gives $6x$ and $y^2$ gives 2 on the second derivative.",
            "那用了一阶导数的系数：二阶导数中 $x^3$ 给出 $6x$，$y^2$ 给出 2。",
          ],
          [
            q * (6 * a + 2 * b),
            `That evaluates at $y = ${q}$; both terms are multiples of $x$.`,
            `那在 $y = ${q}$ 处取值；两项都是 $x$ 的倍数。`,
          ],
        ],
        [
          [
            ["Differentiate twice in x", "对 x 求两次导"],
            [`$u_{xx} = ${6 * a} x$.`, `$u_{xx} = ${6 * a} x$。`],
          ],
          [
            ["Differentiate twice in y", "对 y 求两次导"],
            [`$u_{yy} = ${2 * b} x$.`, `$u_{yy} = ${2 * b} x$。`],
          ],
          [
            ["Add and evaluate", "相加并取值"],
            [
              `The sum is $${6 * a + 2 * b} x$, which is ${answer} at $x = ${p}$.`,
              `和是 $${6 * a + 2 * b} x$，在 $x = ${p}$ 处等于 ${answer}。`,
            ],
          ],
        ],
        [
          `Term by term: $${coef(a, "x^3")}$ contributes $${6 * a} \\cdot ${p} = ${6 * a * p}$ and the $x y^2$ term contributes $${2 * b} \\cdot ${p} = ${2 * b * p}$, which add to ${answer}.`,
          `逐项计算：$${coef(a, "x^3")}$ 贡献 $${6 * a} \\cdot ${p} = ${6 * a * p}$，$x y^2$ 项贡献 $${2 * b} \\cdot ${p} = ${2 * b * p}$，相加得 ${answer}。`,
        ],
      );
    }),
);

const exponentialModulus = {
  ...point(
    "the-modulus-of-the-exponential",
    ["The modulus of the exponential", "指数函数的模"],
    [
      "Since $e^{x + iy} = e^x (\\cos y + i \\sin y)$, the modulus is $e^x$ and the imaginary part of the exponent only rotates. So the logarithm of the modulus simply recovers the real part $x$. For $z = 1 + \\frac{\\pi}{3} i$, as drawn, $w = e^z$ has modulus $e$ and angle $\\frac{\\pi}{3}$, so $\\ln |w| = 1$. In particular, the exponential function is never zero.\n\nCheck: $|\\cos y + i \\sin y|^2 = \\cos^2 y + \\sin^2 y = 1$, so the bracket never changes the modulus.\n\n> **Watch out.** The imaginary part of the exponent is an angle, not a length; it does not enter $\\ln |e^z|$ at all.",
      "因为 $e^{x + iy} = e^x (\\cos y + i \\sin y)$，模是 $e^x$，指数的虚部只产生旋转。所以模的对数恰好还原实部 $x$。对图中的 $z = 1 + \\frac{\\pi}{3} i$，$w = e^z$ 的模是 $e$，角是 $\\frac{\\pi}{3}$，所以 $\\ln |w| = 1$。特别地，指数函数从不为零。\n\n检验：$|\\cos y + i \\sin y|^2 = \\cos^2 y + \\sin^2 y = 1$，所以括号从不改变模。\n\n> **注意。** 指数的虚部是一个角，不是长度；它完全不进入 $\\ln |e^z|$。",
    ],
    (rng) =>
      until(() => {
        const a = rng.pick([-9, -7, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 7, 9]);
        const b = rng.int(1, 9);
        return worked(
          [`What is $\\ln | e^{${cx(a, b)}} |$?`, `$\\ln | e^{${cx(a, b)}} |$ 是多少？`],
          a,
          [
            [b, "That is the imaginary part of the exponent, which only rotates.", "那是指数的虚部，它只产生旋转。"],
            [a + b, "That adds the imaginary part, but it does not change the modulus.", "那加上了虚部，但虚部不改变模。"],
            [
              a * a + b * b,
              "That is the squared modulus of the exponent, not the logarithm of the modulus of the value.",
              "那是指数的模的平方，不是函数值的模的对数。",
            ],
          ],
          [
            [
              ["Split the exponent", "拆开指数"],
              [
                `$e^{${cx(a, b)}} = ${pow("e", a)} (\\cos ${b} + i \\sin ${b})$.`,
                `$e^{${cx(a, b)}} = ${pow("e", a)} (\\cos ${b} + i \\sin ${b})$。`,
              ],
            ],
            [
              ["Take the modulus", "取模"],
              [
                `The bracket has modulus 1, so $|e^{${cx(a, b)}}| = ${pow("e", a)}$.`,
                `括号的模为 1，所以 $|e^{${cx(a, b)}}| = ${pow("e", a)}$。`,
              ],
            ],
            [
              ["Take the logarithm", "取对数"],
              [`$\\ln ${pow("e", a)} = ${a}$.`, `$\\ln ${pow("e", a)} = ${a}$。`],
            ],
          ],
          [
            `$|e^z|^2 = e^z \\overline{e^z} = e^{z + \\bar z} = e^{${2 * a}}$, so $\\ln |e^z| = \\frac{${2 * a}}{2} = ${a}$.`,
            `$|e^z|^2 = e^z \\overline{e^z} = e^{z + \\bar z} = e^{${2 * a}}$，所以 $\\ln |e^z| = \\frac{${2 * a}}{2} = ${a}$。`,
          ],
        );
      }),
  ),
  figure: complexDrawings1["the-complex-exponential-function#the-modulus-of-the-exponential"],
};

const logOfProduct = point(
  "the-principal-argument-of-a-product",
  ["The principal argument of a product", "积的主辐角"],
  [
    "The principal logarithm does not always turn products into sums. Arguments add, but the sum may fall outside the range from $-\\pi$ to $\\pi$, and then a full turn must be removed. For $\\operatorname{Arg} z = \\frac{3}{4} \\pi$ and $\\operatorname{Arg} w = \\frac{1}{2} \\pi$, the sum $\\frac{5}{4} \\pi$ is too large, so $\\operatorname{Arg}(zw) = \\frac{5}{4} \\pi - 2\\pi = -\\frac{3}{4} \\pi$. So $\\operatorname{Log}(zw)$ can differ from $\\operatorname{Log} z + \\operatorname{Log} w$ by $2 \\pi i$.\n\nCheck: $-\\frac{3}{4} \\pi$ lies in $(-\\pi, \\pi]$ and differs from $\\frac{5}{4} \\pi$ by exactly one turn, so it names the same direction.\n\n> **Watch out.** Shift by $2\\pi$ toward the range: subtract when the sum exceeds $\\pi$, add when it is $-\\pi$ or less. The range includes $\\pi$ but not $-\\pi$.",
    "主对数并不总把积变成和。辐角相加，但和可能落在 $-\\pi$ 到 $\\pi$ 的范围之外，这时要减去一整圈。对 $\\operatorname{Arg} z = \\frac{3}{4} \\pi$ 和 $\\operatorname{Arg} w = \\frac{1}{2} \\pi$，和 $\\frac{5}{4} \\pi$ 太大，所以 $\\operatorname{Arg}(zw) = \\frac{5}{4} \\pi - 2\\pi = -\\frac{3}{4} \\pi$。所以 $\\operatorname{Log}(zw)$ 与 $\\operatorname{Log} z + \\operatorname{Log} w$ 可能相差 $2 \\pi i$。\n\n检验：$-\\frac{3}{4} \\pi$ 在 $(-\\pi, \\pi]$ 内，与 $\\frac{5}{4} \\pi$ 恰好相差一圈，所以表示同一方向。\n\n> **注意。** 朝范围方向移动 $2\\pi$：和大于 $\\pi$ 时减去，小于或等于 $-\\pi$ 时加上。范围包含 $\\pi$ 但不包含 $-\\pi$。",
  ],
  (rng) =>
    until(() => {
      const d = rng.pick([4, 6]);
      const options = Array.from({ length: 2 * d }, (_, i) => i - d + 1).filter((v) => v !== 0);
      const pairs = options.flatMap((x) => options.map((y): [number, number] => [x, y])).filter(([x, y]) => x + y > d || x + y <= -d);
      const [a, b] = rng.pick(pairs);
      const s = a + b > d ? a + b - 2 * d : a + b + 2 * d;
      const answer = frac(s, d);
      const show = (x: number) => timesPi(frac(x, d));
      const down = a + b > d;
      return worked(
        [
          `$\\operatorname{Arg} z = ${show(a)}$ and $\\operatorname{Arg} w = ${show(b)}$. What is $\\operatorname{Arg}(zw)$ as a multiple of $\\pi$?`,
          `$\\operatorname{Arg} z = ${show(a)}$，$\\operatorname{Arg} w = ${show(b)}$。$\\operatorname{Arg}(zw)$ 是 $\\pi$ 的多少倍？`,
        ],
        answer,
        [
          [frac(a + b, d), "That is the plain sum, which lies outside the principal range.", "那是直接相加的和，落在主值范围之外。"],
          [
            frac(down ? a + b + 2 * d : a + b - 2 * d, d),
            "That shifts the full turn the wrong way, moving further from the range.",
            "那把一整圈移错了方向，离范围更远了。",
          ],
          [frac(a - b, d), "That subtracts the arguments; for a product they add.", "那把辐角相减了；乘积的辐角是相加。"],
        ],
        [
          [
            ["Add the arguments", "辐角相加"],
            [
              `$${show(a)} ${b < 0 ? `- ${show(-b)}` : `+ ${show(b)}`} = ${show(a + b)}$.`,
              `$${show(a)} ${b < 0 ? `- ${show(-b)}` : `+ ${show(b)}`} = ${show(a + b)}$。`,
            ],
          ],
          [
            ["Bring it into range", "移入范围"],
            [
              `This is ${down ? "more than $\\pi$, so subtract" : "at most $-\\pi$, so add"} $2\\pi$: $${show(s)}$.`,
              `它${down ? "大于 $\\pi$，所以减去" : "小于或等于 $-\\pi$，所以加上"} $2\\pi$：$${show(s)}$。`,
            ],
          ],
        ],
        [
          `$${show(s)}$ lies in $(-\\pi, \\pi]$, and it differs from $${show(a + b)}$ by exactly $2\\pi$, so it is the same direction.`,
          `$${show(s)}$ 在 $(-\\pi, \\pi]$ 内，且与 $${show(a + b)}$ 恰好相差 $2\\pi$，所以是同一方向。`,
        ],
      );
    }),
);

const iToAComplexPower = point(
  "the-size-of-a-power-of-i",
  ["The size of a power of i", "i 的幂的大小"],
  [
    "The principal value of $i^w$ is $e^{w \\operatorname{Log} i}$, and $\\operatorname{Log} i = \\frac{i \\pi}{2}$. Writing $w = c + d i$, the exponent has real part $-\\frac{d \\pi}{2}$. For $w = 2 + 3i$, $(2 + 3i) \\cdot \\frac{i \\pi}{2} = -\\frac{3}{2} \\pi + \\pi i$, so $|i^{2 + 3i}| = e^{-3\\pi/2}$ and the logarithm of the modulus is $-\\frac{3}{2} \\pi$. So $i^i = e^{-\\pi/2}$ is a real number, and in general only the imaginary part of the power affects the size.\n\nCheck: $i^2 = -1$ has modulus 1, and $i^{3i} = (i^i)^3 = e^{-3\\pi/2}$, so the product has modulus $e^{-3\\pi/2}$.\n\n> **Watch out.** $i \\cdot i = -1$ flips the sign: the real part is $-\\frac{d \\pi}{2}$, not $+\\frac{d \\pi}{2}$, and the real part $c$ only rotates.",
    "$i^w$ 的主值是 $e^{w \\operatorname{Log} i}$，而 $\\operatorname{Log} i = \\frac{i \\pi}{2}$。写 $w = c + d i$，指数的实部是 $-\\frac{d \\pi}{2}$。对 $w = 2 + 3i$，$(2 + 3i) \\cdot \\frac{i \\pi}{2} = -\\frac{3}{2} \\pi + \\pi i$，所以 $|i^{2 + 3i}| = e^{-3\\pi/2}$，模的对数是 $-\\frac{3}{2} \\pi$。所以 $i^i = e^{-\\pi/2}$ 是实数，一般地只有幂的虚部影响大小。\n\n检验：$i^2 = -1$ 的模为 1，而 $i^{3i} = (i^i)^3 = e^{-3\\pi/2}$，所以乘积的模是 $e^{-3\\pi/2}$。\n\n> **注意。** $i \\cdot i = -1$ 改变符号：实部是 $-\\frac{d \\pi}{2}$，不是 $+\\frac{d \\pi}{2}$；实部 $c$ 只产生旋转。",
  ],
  (rng) =>
    until(() => {
      const c = rng.int(0, 5);
      const d = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
      const answer = frac(-d, 2);
      const w = cx(c, d);
      return worked(
        [
          `For the principal value of $i^{${w}}$, what is the logarithm of the modulus as a multiple of $\\pi$?`,
          `对 $i^{${w}}$ 的主值，模的对数是 $\\pi$ 的多少倍？`,
        ],
        answer,
        [
          [frac(d, 2), "That misses the sign from $i \\cdot i = -1$.", "那漏掉了 $i \\cdot i = -1$ 带来的负号。"],
          [
            frac(-d, 1),
            "That uses $\\operatorname{Log} i = i\\pi$; the angle of $i$ is $\\frac{\\pi}{2}$.",
            "那用了 $\\operatorname{Log} i = i\\pi$；$i$ 的角是 $\\frac{\\pi}{2}$。",
          ],
          [frac(c, 2), "That uses the real part of the power, which only rotates.", "那用了幂的实部，它只产生旋转。"],
        ],
        [
          [
            ["Write the principal value", "写出主值"],
            [
              `$i^{${w}} = e^{(${w}) \\operatorname{Log} i}$ with $\\operatorname{Log} i = \\frac{i \\pi}{2}$.`,
              `$i^{${w}} = e^{(${w}) \\operatorname{Log} i}$，其中 $\\operatorname{Log} i = \\frac{i \\pi}{2}$。`,
            ],
          ],
          [
            ["Find the real part of the exponent", "求指数的实部"],
            [
              `$${coef(d, "i")} \\cdot \\frac{i \\pi}{2} = ${timesPi(answer)}$ is real${c === 0 ? "" : `, while $${c} \\cdot \\frac{i \\pi}{2}$ is imaginary`}.`,
              `$${coef(d, "i")} \\cdot \\frac{i \\pi}{2} = ${timesPi(answer)}$ 是实数${c === 0 ? "" : `，而 $${c} \\cdot \\frac{i \\pi}{2}$ 是虚数`}。`,
            ],
          ],
          [
            ["Read the modulus", "读出模"],
            [
              `$|i^{${w}}| = e^{${timesPi(answer)}}$, whose logarithm is $${timesPi(answer)}$.`,
              `$|i^{${w}}| = e^{${timesPi(answer)}}$，其对数是 $${timesPi(answer)}$。`,
            ],
          ],
        ],
        [
          `Split the power: ${c === 0 ? "" : `$${pow("i", c)}$ has modulus 1, and `}$i^{${coef(d, "i")}} = ${pow("(i^i)", d)} = ${pow("(e^{-\\pi/2})", d)}$, whose logarithm is $${timesPi(answer)}$.`,
          `拆开幂：${c === 0 ? "" : `$${pow("i", c)}$ 的模为 1，而 `}$i^{${coef(d, "i")}} = ${pow("(i^i)", d)} = ${pow("(e^{-\\pi/2})", d)}$，其对数为 $${timesPi(answer)}$。`,
        ],
      );
    }),
);

const closedPower = {
  ...point(
    "integrating-powers-around-a-circle",
    ["Integrating powers around a circle", "沿圆周积分幂函数"],
    [
      "Around a circle centered at the origin, $\\oint z^n \\, dz$ is 0 for every integer $n$ other than $-1$, because those powers have antiderivatives. The single exception, as drawn, gives $\\oint \\frac{dz}{z} = 2 \\pi i$. So only the term in $\\frac{1}{z}$ of a sum survives: $\\oint \\left( \\frac{3}{z} + 5z^2 \\right) dz = 3 \\cdot 2\\pi i + 0 = 6 \\pi i$.\n\nCheck: on $z = e^{it}$, $\\frac{dz}{z} = i \\, dt$, which integrates to $2\\pi i$ over a turn, while $z^2 \\, dz = i e^{3it} dt$ integrates to 0.\n\n> **Watch out.** The radius does not matter, and $\\oint \\frac{dz}{z}$ is $2\\pi i$, not $\\pi i$; the other powers give exactly 0, not a contribution of their own.",
      "沿以原点为心的圆，对除 $-1$ 以外的每个整数 $n$，$\\oint z^n \\, dz$ 都是 0，因为这些幂函数有原函数。如图，唯一的例外给出 $\\oint \\frac{dz}{z} = 2 \\pi i$。所以和式中只有 $\\frac{1}{z}$ 项留下来：$\\oint \\left( \\frac{3}{z} + 5z^2 \\right) dz = 3 \\cdot 2\\pi i + 0 = 6 \\pi i$。\n\n检验：在 $z = e^{it}$ 上，$\\frac{dz}{z} = i \\, dt$，转一圈积分为 $2\\pi i$；而 $z^2 \\, dz = i e^{3it} dt$ 的积分为 0。\n\n> **注意。** 半径无关紧要，$\\oint \\frac{dz}{z}$ 是 $2\\pi i$，不是 $\\pi i$；其他幂恰好给出 0，没有自己的贡献。",
    ],
    (rng) =>
      until(() => {
        const [a, b, n, r] = [rng.int(1, 9), rng.int(2, 9), rng.int(2, 6), rng.int(1, 5)];
        const answer = 2 * a;
        return worked(
          [
            `Around $|z| = ${r}$ counterclockwise, $\\oint \\left( \\frac{${a}}{z} + ${b} z^{${n}} \\right) dz = k \\pi i$. What is $k$?`,
            `沿 $|z| = ${r}$ 逆时针，$\\oint \\left( \\frac{${a}}{z} + ${b} z^{${n}} \\right) dz = k \\pi i$。$k$ 是多少？`,
          ],
          answer,
          [
            [
              a,
              "That takes $\\oint \\frac{dz}{z}$ as $\\pi i$; a full turn gives $2\\pi i$.",
              "那把 $\\oint \\frac{dz}{z}$ 当成了 $\\pi i$；一整圈给出 $2\\pi i$。",
            ],
            [
              2 * (a + b),
              `That lets $z^{${n}}$ contribute as well, but it has an antiderivative.`,
              `那让 $z^{${n}}$ 也有贡献，但它有原函数。`,
            ],
            [
              0,
              "That sends every term to 0, but $\\frac{1}{z}$ has no antiderivative on the circle.",
              "那让每一项都为 0，但 $\\frac{1}{z}$ 在圆上没有原函数。",
            ],
          ],
          [
            [
              ["Integrate the power", "积分幂项"],
              [
                `$z^{${n}}$ has the antiderivative $\\frac{z^{${n + 1}}}{${n + 1}}$, so its integral around a closed path is 0.`,
                `$z^{${n}}$ 有原函数 $\\frac{z^{${n + 1}}}{${n + 1}}$，所以沿闭路径的积分为 0。`,
              ],
            ],
            [
              ["Integrate the reciprocal", "积分倒数项"],
              [
                `$\\oint \\frac{${a}}{z} \\, dz = ${a} \\cdot 2\\pi i = ${answer} \\pi i$.`,
                `$\\oint \\frac{${a}}{z} \\, dz = ${a} \\cdot 2\\pi i = ${answer} \\pi i$。`,
              ],
            ],
          ],
          [
            `Parametrize $z = ${r}e^{it}$: then $\\frac{dz}{z} = i \\, dt$, so the first term gives $${a} \\cdot i \\cdot 2\\pi = ${answer} \\pi i$, and $z^{${n}} dz$ is a multiple of $e^{${n + 1}it} dt$, which integrates to 0.`,
            `参数化 $z = ${r}e^{it}$：$\\frac{dz}{z} = i \\, dt$，所以第一项给出 $${a} \\cdot i \\cdot 2\\pi = ${answer} \\pi i$，而 $z^{${n}} dz$ 是 $e^{${n + 1}it} dt$ 的倍数，积分为 0。`,
          ],
        );
      }),
  ),
  figure: complexDrawings1["contour-integrals#integrating-powers-around-a-circle"],
};

const mlShrinking = {
  ...point(
    "a-bound-on-a-large-arc",
    ["A bound on a large arc", "大圆弧上的估计"],
    [
      "On $|z| = R$ with $R > 1$, the triangle inequality gives $|z^2 + 1| \\ge |z|^2 - 1 = R^2 - 1$. Together with the length $L = \\pi R$ of the drawn semicircle, this bounds the integral of $\\frac{1}{z^2 + 1}$ by $\\frac{\\pi R}{R^2 - 1}$. For $R = 3$, $M = \\frac{1}{8}$ and $L = 3\\pi$, so the bound is $\\frac{3}{8} \\pi$. It shrinks like $\\frac{1}{R}$, which is why the large arc disappears when real integrals are computed by residues.\n\nCheck: at $z = 3i$, $|z^2 + 1| = |-9 + 1| = 8$, so $M = \\frac{1}{8}$ is attained and cannot be lowered.\n\n> **Watch out.** A semicircle has length $\\pi R$, not $2\\pi R$, and the lower bound is $R^2 - 1$, not $R^2 + 1$; using $R^2 + 1$ would give a bound that is too small to be true.",
      "在 $|z| = R$（$R > 1$）上，三角不等式给出 $|z^2 + 1| \\ge |z|^2 - 1 = R^2 - 1$。再结合图中半圆的长度 $L = \\pi R$，$\\frac{1}{z^2 + 1}$ 的积分以 $\\frac{\\pi R}{R^2 - 1}$ 为界。对 $R = 3$，$M = \\frac{1}{8}$，$L = 3\\pi$，所以界是 $\\frac{3}{8} \\pi$。它像 $\\frac{1}{R}$ 那样缩小，正因如此，用留数计算实积分时大圆弧的贡献才会消失。\n\n检验：在 $z = 3i$ 处，$|z^2 + 1| = |-9 + 1| = 8$，所以 $M = \\frac{1}{8}$ 能取到，不能再小。\n\n> **注意。** 半圆的长度是 $\\pi R$，不是 $2\\pi R$；下界是 $R^2 - 1$，不是 $R^2 + 1$，用 $R^2 + 1$ 得到的界太小而不成立。",
    ],
    (rng) =>
      until(() => {
        const [c, R] = [rng.int(1, 6), rng.int(2, 8)];
        const answer = frac(c * R, R * R - 1);
        return worked(
          [
            `Apply the $ML$ inequality to $\\frac{${c}}{z^2 + 1}$ on the semicircle of radius ${R}, using $|z^2 + 1| \\ge ${R * R - 1}$. The bound is what multiple of $\\pi$?`,
            `对半径为 ${R} 的半圆上的 $\\frac{${c}}{z^2 + 1}$ 应用 $ML$ 不等式，利用 $|z^2 + 1| \\ge ${R * R - 1}$。这个界是 $\\pi$ 的多少倍？`,
          ],
          answer,
          [
            [frac(c, R * R - 1), `That leaves out the radius in $L = ${R}\\pi$.`, `那漏掉了 $L = ${R}\\pi$ 中的半径。`],
            [
              frac(2 * c * R, R * R - 1),
              "That uses the length of the whole circle; a semicircle has length $\\pi R$.",
              "那用了整个圆的长度；半圆的长度是 $\\pi R$。",
            ],
            [
              frac(c * R, R * R + 1),
              `That divides by $${R * R + 1}$, an upper bound for $|z^2 + 1|$, not a lower one.`,
              `那除以了 $${R * R + 1}$，它是 $|z^2 + 1|$ 的上界，不是下界。`,
            ],
          ],
          [
            [
              ["Bound the integrand", "估计被积函数"],
              [
                `$M = \\frac{${c}}{${R * R - 1}}$, since $|z^2 + 1| \\ge ${R * R - 1}$ on the arc.`,
                `$M = \\frac{${c}}{${R * R - 1}}$，因为在弧上 $|z^2 + 1| \\ge ${R * R - 1}$。`,
              ],
            ],
            [
              ["Measure the arc", "量出弧长"],
              [`$L = ${R} \\pi$, half the circumference $${2 * R} \\pi$.`, `$L = ${R} \\pi$，是周长 $${2 * R} \\pi$ 的一半。`],
            ],
            [
              ["Multiply", "相乘"],
              [
                `$ML = \\frac{${c} \\cdot ${R}}{${R * R - 1}} \\pi = ${answer.toLatex()} \\pi$.`,
                `$ML = \\frac{${c} \\cdot ${R}}{${R * R - 1}} \\pi = ${answer.toLatex()} \\pi$。`,
              ],
            ],
          ],
          [
            `At $z = ${R}i$ on the arc, $|z^2 + 1| = |-${R * R} + 1| = ${R * R - 1}$, so this $M$ is the true maximum of the integrand and the bound cannot be improved by a better $M$.`,
            `在弧上的 $z = ${R}i$ 处，$|z^2 + 1| = |-${R * R} + 1| = ${R * R - 1}$，所以这个 $M$ 正是被积函数的最大值，无法用更好的 $M$ 改进这个界。`,
          ],
        );
      }),
  ),
  figure: complexDrawings1["the-ml-inequality#a-bound-on-a-large-arc"],
};

const windingRepeated = {
  ...point(
    "the-winding-number-of-a-repeated-circle",
    ["The winding number of a repeated circle", "重复绕行圆的环绕数"],
    [
      "The path $z(t) = c + r e^{i k t}$ for $t$ from 0 to $2 \\pi$ goes around the same circle $|k|$ times, clockwise when $k$ is negative. A point inside the circle has winding number $k$. A point outside has winding number 0, because the path never encircles it. In the drawing, $k = -2$ and $r = 2$: the path circles twice clockwise, so the center has winding number $-2$, and a point at distance 3 from the center has 0.\n\nCheck: the argument of $z(t) - c = r e^{ikt}$ is $kt$, which changes by $2\\pi k$ as $t$ runs over $[0, 2\\pi]$; dividing by $2\\pi$ gives $k$.\n\n> **Watch out.** Keep the sign: a clockwise path gives a negative winding number. And compare the distance to the center with the radius before answering; outside points get 0, not $k$.",
      "路径 $z(t) = c + r e^{i k t}$（$t$ 从 0 到 $2 \\pi$）沿同一个圆绕行 $|k|$ 次，$k$ 为负时顺时针。圆内的点环绕数是 $k$。圆外的点环绕数是 0，因为路径没有围住它。图中 $k = -2$，$r = 2$：路径顺时针绕两圈，所以圆心的环绕数是 $-2$，离圆心距离为 3 的点环绕数是 0。\n\n检验：$z(t) - c = r e^{ikt}$ 的辐角是 $kt$，$t$ 跑遍 $[0, 2\\pi]$ 时它改变 $2\\pi k$；除以 $2\\pi$ 得 $k$。\n\n> **注意。** 保留符号：顺时针路径给出负的环绕数。回答之前先比较到圆心的距离与半径；圆外的点得 0，不是 $k$。",
    ],
    (rng) =>
      until(() => {
        const k = rng.pick([-4, -3, -2, -1, 2, 3, 4, 5]);
        const [c, r] = [rng.int(1, 6), rng.int(3, 6)];
        const inside = rng.bool();
        const w = inside ? c + rng.int(1 - r, r - 1) : c + r + rng.int(1, 4);
        const answer = inside ? k : 0;
        const misses: Miss[] = inside
          ? [
              [-k, "That reverses the direction of travel.", "那把行进方向弄反了。"],
              [Math.abs(k), "That drops the sign; a clockwise path counts negatively.", "那丢掉了符号；顺时针路径计为负数。"],
              [
                1,
                `That counts the circle once, but the path goes around it ${Math.abs(k)} times.`,
                `那只算了一圈，但路径绕了 ${Math.abs(k)} 圈。`,
              ],
            ]
          : [
              [k, "That treats the point as inside the circle.", "那把这个点当成在圆内。"],
              [-k, "That treats the point as inside and also reverses the direction.", "那把这个点当成在圆内，还把方向弄反了。"],
            ];
        return worked(
          [
            `For $t$ from 0 to $2 \\pi$, what is the winding number of $z(t) = ${c} + ${r} e^{${coef(k, "i")} t}$ around the point ${w}?`,
            `$t$ 从 0 到 $2 \\pi$，$z(t) = ${c} + ${r} e^{${coef(k, "i")} t}$ 绕点 ${w} 的环绕数是多少？`,
          ],
          answer,
          misses,
          [
            [
              ["Read the circle", "读出圆"],
              [
                `Center ${c}, radius ${r}, traversed ${Math.abs(k)} ${Math.abs(k) === 1 ? "time" : "times"} ${k < 0 ? "clockwise" : "counterclockwise"}.`,
                `圆心 ${c}，半径 ${r}，${k < 0 ? "顺时针" : "逆时针"}绕行 ${Math.abs(k)} 次。`,
              ],
            ],
            [
              ["Locate the point", "确定点的位置"],
              [
                `The distance from ${w} to ${c} is ${Math.abs(w - c)}, ${inside ? "less" : "more"} than ${r}, so the point is ${inside ? "inside" : "outside"}.`,
                `${w} 到 ${c} 的距离是 ${Math.abs(w - c)}，${inside ? "小于" : "大于"} ${r}，所以这个点在圆${inside ? "内" : "外"}。`,
              ],
            ],
            [
              ["Count", "计数"],
              [
                inside ? `Each pass winds once around it, with sign: ${k}.` : "The path never encircles it, so the count is 0.",
                inside ? `每一圈都绕它一次，带上符号：${k}。` : "路径从未围住它，所以计数为 0。",
              ],
            ],
          ],
          inside
            ? [
                `The angle of $z(t) ${w < 0 ? `+ ${-w}` : `- ${w}`}$ follows the angle $${coef(k, "t")}$ of $z(t) - ${c}$ in total, since ${w} sits inside; it changes by $${2 * k}\\pi$, and $\\frac{${2 * k}\\pi}{2\\pi} = ${k}$.`,
                `由于 ${w} 在圆内，$z(t) ${w < 0 ? `+ ${-w}` : `- ${w}`}$ 的角总体上跟随 $z(t) - ${c}$ 的角 $${coef(k, "t")}$；它改变 $${2 * k}\\pi$，而 $\\frac{${2 * k}\\pi}{2\\pi} = ${k}$。`,
              ]
            : [
                `Every point of the path has real part at most ${c + r}, less than ${w}, so $z(t) - ${w}$ stays in the left half plane and its angle cannot make a full turn.`,
                `路径上每个点的实部都不超过 ${c + r}，小于 ${w}，所以 $z(t) - ${w}$ 一直在左半平面，它的角不能转满一圈。`,
              ],
        );
      }),
  ),
  figure: complexDrawings1["winding-numbers#the-winding-number-of-a-repeated-circle"],
};

const twoPoles = point(
  "a-contour-around-one-or-both-poles",
  ["A contour around one or both poles", "围住一个或两个极点的围道"],
  [
    "Partial fractions write $\\frac{1}{(z - a)(z - b)}$ as $\\frac{1}{a - b} \\left( \\frac{1}{z - a} - \\frac{1}{z - b} \\right)$, and Cauchy's formula handles each piece. A contour around only $a$ gives $\\frac{2 \\pi i}{a - b}$. A contour around both gives 0, because the two pieces cancel. For $\\frac{1}{(z - 2)(z - 6)}$ around $|z| = 4$, only 2 is inside, so the integral is $\\frac{2\\pi i}{2 - 6} = -\\frac{1}{2} \\pi i$.\n\nCheck: the residue at 2 is $\\lim_{z \\to 2} \\frac{1}{z - 6} = -\\frac{1}{4}$, and $2\\pi i \\cdot (-\\frac{1}{4}) = -\\frac{1}{2} \\pi i$.\n\n> **Watch out.** First decide which poles lie inside the contour. A pole outside contributes nothing, and the inside pole's piece is $\\frac{1}{a - b}$, with $a$ the inside pole first.",
    "部分分式把 $\\frac{1}{(z - a)(z - b)}$ 写成 $\\frac{1}{a - b} \\left( \\frac{1}{z - a} - \\frac{1}{z - b} \\right)$，柯西公式处理每一部分。只围住 $a$ 的围道给出 $\\frac{2 \\pi i}{a - b}$。围住两者的围道给出 0，因为两部分相互抵消。对沿 $|z| = 4$ 的 $\\frac{1}{(z - 2)(z - 6)}$，只有 2 在圆内，所以积分是 $\\frac{2\\pi i}{2 - 6} = -\\frac{1}{2} \\pi i$。\n\n检验：2 处的留数是 $\\lim_{z \\to 2} \\frac{1}{z - 6} = -\\frac{1}{4}$，而 $2\\pi i \\cdot (-\\frac{1}{4}) = -\\frac{1}{2} \\pi i$。\n\n> **注意。** 先判断哪些极点在围道内。圆外的极点没有贡献，圆内极点那一部分是 $\\frac{1}{a - b}$，$a$ 是圆内的极点，写在前面。",
  ],
  (rng) =>
    until(() => {
      const r = 4;
      const a = rng.pick([-3, -2, -1, 1, 2, 3]);
      const both = rng.bool();
      const b = both ? rng.pick([-3, -2, -1, 1, 2, 3].filter((v) => v !== a)) : rng.pick([-7, -6, -5, 5, 6, 7]);
      const answer = both ? Q.of(0, 1) : frac(2, a - b);
      const misses: Miss[] = both
        ? [
            [frac(2, a - b), `That counts only the pole at ${a}; ${b} is inside too.`, `那只算了 ${a} 处的极点；${b} 也在圆内。`],
            [frac(2, b - a), `That counts only the pole at ${b}; ${a} is inside too.`, `那只算了 ${b} 处的极点；${a} 也在圆内。`],
          ]
        : [
            [frac(2, b - a), `That uses the piece of the pole at ${b}, which lies outside.`, `那用了 ${b} 处极点的那一部分，而它在圆外。`],
            [frac(1, a - b), "That leaves out the factor 2 in $2\\pi i$.", "那漏掉了 $2\\pi i$ 中的因子 2。"],
            [Q.of(0, 1), `That treats both poles as inside, but $|${b}| > ${r}$.`, `那把两个极点都当成在圆内，但 $|${b}| > ${r}$。`],
          ];
      const res = frac(1, a - b);
      return worked(
        [
          `Around $|z| = ${r}$ counterclockwise, $\\oint \\frac{dz}{(${shift(a)})(${shift(b)})} = k \\pi i$. What is $k$?`,
          `沿 $|z| = ${r}$ 逆时针，$\\oint \\frac{dz}{(${shift(a)})(${shift(b)})} = k \\pi i$。$k$ 是多少？`,
        ],
        answer,
        misses,
        [
          [
            ["Locate the poles", "确定极点位置"],
            [
              both
                ? `Both ${a} and ${b} have modulus less than ${r}, so both are inside.`
                : `$|${a}| < ${r}$ is inside and $|${b}| > ${r}$ is outside.`,
              both ? `${a} 和 ${b} 的模都小于 ${r}，所以都在圆内。` : `$|${a}| < ${r}$ 在圆内，$|${b}| > ${r}$ 在圆外。`,
            ],
          ],
          [
            ["Split into partial fractions", "拆成部分分式"],
            [
              `The integrand is $${res.toLatex()} \\left( \\frac{1}{${shift(a)}} - \\frac{1}{${shift(b)}} \\right)$.`,
              `被积函数是 $${res.toLatex()} \\left( \\frac{1}{${shift(a)}} - \\frac{1}{${shift(b)}} \\right)$。`,
            ],
          ],
          [
            ["Integrate each piece", "逐项积分"],
            [
              both
                ? "Each piece gives $2\\pi i$ times its coefficient, and the two coefficients are opposite, so the total is 0."
                : `Only the first piece encloses its pole: $${res.toLatex()} \\cdot 2\\pi i$, so $k = ${answer.toLatex()}$.`,
              both
                ? "每一部分给出 $2\\pi i$ 乘以系数，两个系数相反，所以总和为 0。"
                : `只有第一部分围住了它的极点：$${res.toLatex()} \\cdot 2\\pi i$，所以 $k = ${answer.toLatex()}$。`,
            ],
          ],
        ],
        both
          ? [
              `The residues are $\\lim_{z \\to ${a}} \\frac{1}{${shift(b)}} = ${res.toLatex()}$ and $\\lim_{z \\to ${b}} \\frac{1}{${shift(a)}} = ${frac(1, b - a).toLatex()}$, which sum to 0.`,
              `留数分别是 $\\lim_{z \\to ${a}} \\frac{1}{${shift(b)}} = ${res.toLatex()}$ 和 $\\lim_{z \\to ${b}} \\frac{1}{${shift(a)}} = ${frac(1, b - a).toLatex()}$，和为 0。`,
            ]
          : [
              `The residue at ${a} is $\\lim_{z \\to ${a}} \\frac{1}{${shift(b)}} = ${res.toLatex()}$, and $2 \\cdot ${res.sign() < 0 ? `(${res.toLatex()})` : res.toLatex()} = ${answer.toLatex()}$.`,
              `${a} 处的留数是 $\\lim_{z \\to ${a}} \\frac{1}{${shift(b)}} = ${res.toLatex()}$，而 $2 \\cdot ${res.sign() < 0 ? `(${res.toLatex()})` : res.toLatex()} = ${answer.toLatex()}$。`,
            ],
      );
    }),
);

const generalLiouville = point(
  "growth-limits-the-degree",
  ["Growth limits the degree", "增长限制次数"],
  [
    "Cauchy's estimates extend Liouville's theorem. If an entire function satisfies $|f(z)| \\le c |z|^{s} + d$, then its coefficients of degree above $s$ must vanish, because they are bounded by quantities tending to 0. So the function is a polynomial of degree at most the whole part of $s$. For $|f(z)| \\le 3|z|^{5/2} + 1$, the degree is at most 2, since $\\frac{5}{2}$ lies between 2 and 3.\n\nCheck: $f(z) = z^2$ meets the bound, because $|z|^2 \\le |z|^{5/2}$ when $|z| \\ge 1$ and $|z|^2 \\le 1$ when $|z| < 1$; but $z^3$ outgrows $3|z|^{5/2} + 1$ for large $|z|$.\n\n> **Watch out.** Round $s$ down, not up: a degree above $s$ is not allowed even if it is below the next whole number. The constants $c$ and $d$ do not affect the degree.",
    "柯西估计推广了刘维尔定理。如果整函数满足 $|f(z)| \\le c |z|^{s} + d$，那么次数高于 $s$ 的系数都必须为零，因为它们的界趋于 0。所以这个函数是次数不超过 $s$ 的整数部分的多项式。对 $|f(z)| \\le 3|z|^{5/2} + 1$，次数至多为 2，因为 $\\frac{5}{2}$ 在 2 和 3 之间。\n\n检验：$f(z) = z^2$ 满足这个界，因为 $|z| \\ge 1$ 时 $|z|^2 \\le |z|^{5/2}$，$|z| < 1$ 时 $|z|^2 \\le 1$；但对很大的 $|z|$，$z^3$ 超过 $3|z|^{5/2} + 1$。\n\n> **注意。** 把 $s$ 向下取整，不是向上：高于 $s$ 的次数不允许，即使它小于下一个整数。常数 $c$ 和 $d$ 不影响次数。",
  ],
  (rng) =>
    until(() => {
      const [p, q] = [rng.int(1, 11), rng.int(2, 4)];
      if (gcd(p, q) !== 1) return undefined;
      const [c, d] = [rng.int(2, 9), rng.int(1, 9)];
      const answer = Math.floor(p / q);
      return worked(
        [
          `An entire function satisfies $|f(z)| \\le ${c} |z|^{${p}/${q}} + ${d}$ for all $z$. What is the largest degree it can have?`,
          `整函数对所有 $z$ 满足 $|f(z)| \\le ${c} |z|^{${p}/${q}} + ${d}$。它的次数最大是多少？`,
        ],
        answer,
        [
          [
            answer + 1,
            `That rounds $\\frac{${p}}{${q}}$ up; degree ${answer + 1} exceeds it.`,
            `那把 $\\frac{${p}}{${q}}$ 向上取整了；次数 ${answer + 1} 超过了它。`,
          ],
          [p, "That reads the numerator of the exponent as the degree.", "那把指数的分子当成了次数。"],
          [c, "That reads the constant in front as the degree; it only scales the bound.", "那把前面的常数当成了次数；它只缩放这个界。"],
        ],
        [
          [
            ["Apply Cauchy's estimate", "应用柯西估计"],
            [
              `On $|z| = R$, the coefficient of $z^n$ is at most $\\frac{${c} R^{${p}/${q}} + ${d}}{R^n}$, which tends to 0 as $R \\to \\infty$ when $n > \\frac{${p}}{${q}}$.`,
              `在 $|z| = R$ 上，$z^n$ 的系数不超过 $\\frac{${c} R^{${p}/${q}} + ${d}}{R^n}$，当 $n > \\frac{${p}}{${q}}$ 时它随 $R \\to \\infty$ 趋于 0。`,
            ],
          ],
          [
            ["Find the largest allowed degree", "找出允许的最大次数"],
            [
              `$\\frac{${p}}{${q}}$ lies between ${answer} and ${answer + 1}, so the degree is at most ${answer}.`,
              `$\\frac{${p}}{${q}}$ 在 ${answer} 和 ${answer + 1} 之间，所以次数至多为 ${answer}。`,
            ],
          ],
        ],
        answer === 0
          ? [
              `The degree 0 is reached: the constant function 1 satisfies $1 \\le ${d}$, which is at most the right side.`,
              `次数 0 可以取到：常函数 1 满足 $1 \\le ${d}$，不超过右边。`,
            ]
          : [
              `The degree ${answer} is reached: $${pow("|z|", answer)} \\le |z|^{${p}/${q}}$ for $|z| \\ge 1$ and $${pow("|z|", answer)} \\le 1$ for $|z| < 1$, so $${pow("z", answer)}$ meets the bound.`,
              `次数 ${answer} 可以取到：$|z| \\ge 1$ 时 $${pow("|z|", answer)} \\le |z|^{${p}/${q}}$，$|z| < 1$ 时 $${pow("|z|", answer)} \\le 1$，所以 $${pow("z", answer)}$ 满足这个界。`,
            ],
      );
    }),
);

const expCoefficient = point(
  "a-coefficient-of-a-scaled-exponential",
  ["A coefficient of a scaled exponential", "伸缩指数函数的系数"],
  [
    "Replacing $z$ by $a z$ in the series of $e^z$ gives $e^{a z} = \\sum \\frac{a^n z^n}{n!}$, which converges everywhere. Substitution like this finds coefficients with no differentiation at all. For $e^{3z}$, the coefficient of $z^3$ is $\\frac{3^3}{3!} = \\frac{27}{6} = \\frac{9}{2}$. The same idea handles a power of $z$ in the exponent, as the Taylor series of an analytic function is unique.\n\nCheck: the third derivative of $e^{3z}$ is $27 e^{3z}$, which is 27 at 0, and $\\frac{27}{3!} = \\frac{9}{2}$.\n\n> **Watch out.** The whole product $a z$ is raised to the power, so the numerator is $a^n$, not $a$; and the denominator is $n!$, not $n$.",
    "在 $e^z$ 的级数中用 $a z$ 代替 $z$，得 $e^{a z} = \\sum \\frac{a^n z^n}{n!}$，它处处收敛。这样的代入不用求导就能得到系数。对 $e^{3z}$，$z^3$ 的系数是 $\\frac{3^3}{3!} = \\frac{27}{6} = \\frac{9}{2}$。同样的思路也能处理指数中的 $z$ 的幂，因为解析函数的泰勒级数是唯一的。\n\n检验：$e^{3z}$ 的三阶导数是 $27 e^{3z}$，在 0 处为 27，而 $\\frac{27}{3!} = \\frac{9}{2}$。\n\n> **注意。** 整个乘积 $a z$ 都要取幂，所以分子是 $a^n$，不是 $a$；分母是 $n!$，不是 $n$。",
  ],
  (rng) =>
    until(() => {
      const [a, n] = [rng.int(2, 7), rng.int(2, 6)];
      let factorial = 1;
      for (let i = 2; i <= n; i++) factorial *= i;
      const answer = frac(a ** n, factorial);
      return worked(
        [
          `What is the coefficient of $z^{${n}}$ in the Taylor series of $e^{${a} z}$ at 0?`,
          `$e^{${a} z}$ 在 0 处的泰勒级数中，$z^{${n}}$ 的系数是多少？`,
        ],
        answer,
        [
          [frac(a ** n, n), `That divides by ${n} instead of $${n}! = ${factorial}$.`, `那除以了 ${n}，而不是 $${n}! = ${factorial}$。`],
          [frac(a, factorial), `That forgets to raise ${a} to the power ${n}.`, `那忘了把 ${a} 取 ${n} 次幂。`],
          [Q.of(a ** n, 1), "That leaves out the factorial.", "那漏掉了阶乘。"],
        ],
        [
          [
            ["Substitute", "代入"],
            [
              `$e^{${a} z} = \\sum_n \\frac{(${a} z)^n}{n!} = \\sum_n \\frac{${a}^n}{n!} z^n$.`,
              `$e^{${a} z} = \\sum_n \\frac{(${a} z)^n}{n!} = \\sum_n \\frac{${a}^n}{n!} z^n$。`,
            ],
          ],
          [
            ["Read the coefficient", "读出系数"],
            [
              `For $n = ${n}$: $\\frac{${a}^{${n}}}{${n}!} = \\frac{${a ** n}}{${factorial}} = ${answer.toLatex()}$.`,
              `当 $n = ${n}$：$\\frac{${a}^{${n}}}{${n}!} = \\frac{${a ** n}}{${factorial}} = ${answer.toLatex()}$。`,
            ],
          ],
        ],
        [
          `By Taylor's formula the coefficient is $\\frac{f^{(${n})}(0)}{${n}!}$; each derivative of $e^{${a} z}$ brings a factor ${a}, so $f^{(${n})}(0) = ${a ** n}$, giving $${answer.toLatex()}$ again.`,
          `由泰勒公式，系数是 $\\frac{f^{(${n})}(0)}{${n}!}$；$e^{${a} z}$ 每求一次导多一个因子 ${a}，所以 $f^{(${n})}(0) = ${a ** n}$，同样得到 $${answer.toLatex()}$。`,
        ],
      );
    }),
);

const radiusByRoot = point(
  "the-radius-by-the-root-test",
  ["The radius by the root test", "用根值判别法求半径"],
  [
    "The radius of convergence of $\\sum c_n z^n$ is the reciprocal of the limit of $|c_n|^{1/n}$, when that limit exists. For $c_n = \\frac{b^n}{a^n}$, the root is just $\\frac{b}{a}$. For $\\sum \\frac{2^n}{5^n} z^n$, the root is $\\frac{2}{5}$ and the radius is $\\frac{5}{2}$. The series is then geometric with ratio $\\frac{b z}{a}$, which agrees with this radius.\n\nCheck: the geometric series $\\sum (\\frac{2z}{5})^n$ converges exactly when $|\\frac{2z}{5}| < 1$, that is $|z| < \\frac{5}{2}$.\n\n> **Watch out.** The radius is the reciprocal of the root limit, so $\\frac{a}{b}$, not $\\frac{b}{a}$; and the numerator $b^n$ matters as much as the denominator.",
    "当 $|c_n|^{1/n}$ 的极限存在时，$\\sum c_n z^n$ 的收敛半径是这个极限的倒数。对 $c_n = \\frac{b^n}{a^n}$，根就是 $\\frac{b}{a}$。对 $\\sum \\frac{2^n}{5^n} z^n$，根是 $\\frac{2}{5}$，半径是 $\\frac{5}{2}$。这时级数是公比为 $\\frac{b z}{a}$ 的几何级数，与这个半径一致。\n\n检验：几何级数 $\\sum (\\frac{2z}{5})^n$ 恰在 $|\\frac{2z}{5}| < 1$，即 $|z| < \\frac{5}{2}$ 时收敛。\n\n> **注意。** 半径是根值极限的倒数，所以是 $\\frac{a}{b}$，不是 $\\frac{b}{a}$；分子 $b^n$ 与分母同样重要。",
  ],
  (rng) =>
    until(() => {
      const [a, b] = [rng.int(2, 9), rng.int(1, 9)];
      if (gcd(a, b) !== 1) return undefined;
      const answer = frac(a, b);
      const top = b === 1 ? "1" : `${b}^n`;
      const root = frac(b, a);
      return worked(
        [
          `What is the radius of convergence of $\\sum_{n \\ge 0} \\frac{${top}}{${a}^n} z^n$?`,
          `$\\sum_{n \\ge 0} \\frac{${top}}{${a}^n} z^n$ 的收敛半径是多少？`,
        ],
        answer,
        [
          [root, "That is the root limit itself; the radius is its reciprocal.", "那是根值极限本身；半径是它的倒数。"],
          [Q.of(a, 1), `That ignores the numerator $${top}$.`, `那忽略了分子 $${top}$。`],
          [Q.of(1, 1), "That assumes every power series has radius 1.", "那以为每个幂级数的半径都是 1。"],
        ],
        [
          [
            ["Take the nth root", "取 n 次根"],
            [
              `$|c_n|^{1/n} = \\left( \\frac{${top}}{${a}^n} \\right)^{1/n} = ${root.toLatex()}$ for every $n$.`,
              `对每个 $n$，$|c_n|^{1/n} = \\left( \\frac{${top}}{${a}^n} \\right)^{1/n} = ${root.toLatex()}$。`,
            ],
          ],
          [
            ["Take the reciprocal", "取倒数"],
            [
              `The radius is $\\frac{1}{${root.toLatex()}} = ${answer.toLatex()}$.`,
              `半径是 $\\frac{1}{${root.toLatex()}} = ${answer.toLatex()}$。`,
            ],
          ],
        ],
        [
          `The ratio test agrees: $\\left| \\frac{c_{n+1}}{c_n} \\right| = ${root.toLatex()}$, so the series converges when $${root.toLatex()} |z| < 1$, that is $|z| < ${answer.toLatex()}$.`,
          `比值判别法也一致：$\\left| \\frac{c_{n+1}}{c_n} \\right| = ${root.toLatex()}$，所以当 $${root.toLatex()} |z| < 1$，即 $|z| < ${answer.toLatex()}$ 时级数收敛。`,
        ],
      );
    }),
);

const orderFromProduct = point(
  "the-order-of-a-zero-of-a-product",
  ["The order of a zero of a product", "积的零点阶数"],
  [
    "Orders of zeros add when functions are multiplied, because each factor contributes its own power of $z - a$. At the origin, $\\sin z$ has order 1, since its series starts with $z$. And $1 - \\cos z$ has order 2, since its series starts with $\\frac{z^2}{2}$. So $z^2 \\sin z \\, (1 - \\cos z)^3$ has a zero of order $2 + 1 + 3 \\cdot 2 = 9$.\n\nCheck: the lowest terms multiply to $z^2 \\cdot z \\cdot \\left( \\frac{z^2}{2} \\right)^3 = \\frac{z^9}{8}$, with a nonzero coefficient.\n\n> **Watch out.** $1 - \\cos z$ has order 2, not 1, because the constant terms cancel and so does the term in $z$; a power of a factor multiplies its order.",
    "函数相乘时零点的阶数相加，因为每个因子都贡献自己的 $z - a$ 的幂。在原点，$\\sin z$ 的阶是 1，因为它的级数从 $z$ 开始。$1 - \\cos z$ 的阶是 2，因为它的级数从 $\\frac{z^2}{2}$ 开始。所以 $z^2 \\sin z \\, (1 - \\cos z)^3$ 的零点阶数是 $2 + 1 + 3 \\cdot 2 = 9$。\n\n检验：最低次项相乘得 $z^2 \\cdot z \\cdot \\left( \\frac{z^2}{2} \\right)^3 = \\frac{z^9}{8}$，系数不为零。\n\n> **注意。** $1 - \\cos z$ 的阶是 2，不是 1，因为常数项相消，而且没有 $z$ 的一次项；因子的幂把它的阶数相乘。",
  ],
  (rng) =>
    until(() => {
      const [a, b, c] = [rng.int(1, 4), rng.int(1, 4), rng.int(1, 4)];
      const answer = a + b + 2 * c;
      const f = `${pow("z", a)} ${b === 1 ? "\\sin z" : `\\sin^{${b}} z`} ${pow("(1 - \\cos z)", c)}`;
      const lead = `${pow("z", a)} \\cdot ${pow("z", b)} \\cdot ${pow("\\left( \\frac{z^2}{2} \\right)", c)}`;
      return worked(
        [`What is the order of the zero of $${f}$ at the origin?`, `$${f}$ 在原点的零点阶数是多少？`],
        answer,
        [
          [
            a + b + c,
            "That gives $1 - \\cos z$ order 1; its series starts with $\\frac{z^2}{2}$.",
            "那把 $1 - \\cos z$ 的阶当成 1；它的级数从 $\\frac{z^2}{2}$ 开始。",
          ],
          [a + b, "That leaves out the factor with $1 - \\cos z$.", "那漏掉了含 $1 - \\cos z$ 的因子。"],
          [a + b + 2, `That counts $1 - \\cos z$ once, not ${c} times.`, `那只算了一次 $1 - \\cos z$，而不是 ${c} 次。`],
        ],
        [
          [
            ["Find each order", "求各因子的阶"],
            [
              `$${pow("z", a)}$ has order ${a}, $${b === 1 ? "\\sin z" : `\\sin^{${b}} z`}$ has order ${b}, and $${pow("(1 - \\cos z)", c)}$ has order $2 \\cdot ${c} = ${2 * c}$.`,
              `$${pow("z", a)}$ 的阶是 ${a}，$${b === 1 ? "\\sin z" : `\\sin^{${b}} z`}$ 的阶是 ${b}，$${pow("(1 - \\cos z)", c)}$ 的阶是 $2 \\cdot ${c} = ${2 * c}$。`,
            ],
          ],
          [
            ["Add the orders", "阶数相加"],
            [`$${a} + ${b} + ${2 * c} = ${answer}$.`, `$${a} + ${b} + ${2 * c} = ${answer}$。`],
          ],
        ],
        [
          `The lowest terms multiply to $${lead} = \\frac{${pow("z", answer)}}{${2 ** c}}$, whose coefficient is not 0, so the order is ${answer}.`,
          `最低次项相乘得 $${lead} = \\frac{${pow("z", answer)}}{${2 ** c}}$，系数不为 0，所以阶数是 ${answer}。`,
        ],
      );
    }),
);

const principalPart = point(
  "the-principal-part-of-an-essential-singularity",
  ["The principal part of an essential singularity", "本性奇点的主要部分"],
  [
    "Substituting $\\frac{c}{z}$ into the exponential series gives $e^{c / z} = \\sum \\frac{c^n}{n! z^n}$. Its Laurent series has infinitely many negative powers, which is the mark of an essential singularity at 0. So each coefficient can be read directly from the series: in $e^{2/z}$, the coefficient of $z^{-3}$ is $\\frac{2^3}{3!} = \\frac{8}{6} = \\frac{4}{3}$.\n\nCheck: the term $\\frac{1}{3!} \\left( \\frac{2}{z} \\right)^3 = \\frac{8}{6 z^3}$ is the only one with $z^{-3}$.\n\n> **Watch out.** Both $c$ and $\\frac{1}{z}$ are raised to the power $n$, and the denominator is $n!$, not $n$.",
    "把 $\\frac{c}{z}$ 代入指数级数得 $e^{c / z} = \\sum \\frac{c^n}{n! z^n}$。它的洛朗级数有无穷多个负幂项，这正是 0 为本性奇点的标志。所以每个系数都可以直接从级数读出：在 $e^{2/z}$ 中，$z^{-3}$ 的系数是 $\\frac{2^3}{3!} = \\frac{8}{6} = \\frac{4}{3}$。\n\n检验：项 $\\frac{1}{3!} \\left( \\frac{2}{z} \\right)^3 = \\frac{8}{6 z^3}$ 是唯一含 $z^{-3}$ 的项。\n\n> **注意。** $c$ 和 $\\frac{1}{z}$ 都要取 $n$ 次幂，分母是 $n!$，不是 $n$。",
  ],
  (rng) =>
    until(() => {
      const [c, n] = [rng.int(2, 6), rng.int(2, 6)];
      let factorial = 1;
      for (let i = 2; i <= n; i++) factorial *= i;
      const answer = frac(c ** n, factorial);
      return worked(
        [
          `What is the coefficient of $z^{-${n}}$ in the Laurent series of $e^{${c} / z}$ at 0?`,
          `$e^{${c} / z}$ 在 0 处的洛朗级数中，$z^{-${n}}$ 的系数是多少？`,
        ],
        answer,
        [
          [frac(c ** n, n), `That divides by ${n} instead of $${n}! = ${factorial}$.`, `那除以了 ${n}，而不是 $${n}! = ${factorial}$。`],
          [frac(c, factorial), `That forgets to raise ${c} to the power ${n}.`, `那忘了把 ${c} 取 ${n} 次幂。`],
          [Q.of(c ** n, 1), "That leaves out the factorial.", "那漏掉了阶乘。"],
        ],
        [
          [
            ["Substitute", "代入"],
            [
              `Put $w = \\frac{${c}}{z}$ in $e^w = \\sum \\frac{w^n}{n!}$: $e^{${c}/z} = \\sum_n \\frac{${c}^n}{n!} z^{-n}$.`,
              `在 $e^w = \\sum \\frac{w^n}{n!}$ 中令 $w = \\frac{${c}}{z}$：$e^{${c}/z} = \\sum_n \\frac{${c}^n}{n!} z^{-n}$。`,
            ],
          ],
          [
            ["Read the coefficient", "读出系数"],
            [
              `For $n = ${n}$: $\\frac{${c}^{${n}}}{${n}!} = \\frac{${c ** n}}{${factorial}} = ${answer.toLatex()}$.`,
              `当 $n = ${n}$：$\\frac{${c}^{${n}}}{${n}!} = \\frac{${c ** n}}{${factorial}} = ${answer.toLatex()}$。`,
            ],
          ],
        ],
        [
          `Only one term carries $z^{-${n}}$: $\\frac{1}{${n}!} \\left( \\frac{${c}}{z} \\right)^{${n}} = \\frac{${c ** n}}{${factorial} z^{${n}}}$, and $\\frac{${c ** n}}{${factorial}} = ${answer.toLatex()}$.`,
          `只有一项含 $z^{-${n}}$：$\\frac{1}{${n}!} \\left( \\frac{${c}}{z} \\right)^{${n}} = \\frac{${c ** n}}{${factorial} z^{${n}}}$，而 $\\frac{${c ** n}}{${factorial}} = ${answer.toLatex()}$。`,
        ],
      );
    }),
);

const removableValue = point(
  "the-value-at-a-removable-singularity",
  ["The value at a removable singularity", "可去奇点处的值"],
  [
    "A singularity is removable when the function has a finite limit there, and defining the function by this limit makes it analytic. For $\\frac{\\sin (a z)}{b z}$, the series of the sine begins with $a z$. So the quotient tends to $\\frac{a}{b}$ as $z$ tends to 0. For $\\frac{\\sin(6z)}{4z} = \\frac{6z - 36z^3 + \\cdots}{4z}$, the value is $\\frac{6}{4} = \\frac{3}{2}$.\n\nCheck: by L'Hôpital's rule, the limit is $\\frac{6 \\cos 0}{4} = \\frac{3}{2}$.\n\n> **Watch out.** $\\frac{\\sin w}{w} \\to 1$ only when the argument of the sine and the denominator match; here the ratio of their coefficients, $\\frac{a}{b}$, survives.",
    "如果函数在奇点处有有限极限，这个奇点就是可去的，用这个极限来定义函数值就使它解析。对 $\\frac{\\sin (a z)}{b z}$，正弦的级数从 $a z$ 开始。所以当 $z$ 趋于 0 时，商趋于 $\\frac{a}{b}$。对 $\\frac{\\sin(6z)}{4z} = \\frac{6z - 36z^3 + \\cdots}{4z}$，值是 $\\frac{6}{4} = \\frac{3}{2}$。\n\n检验：由洛必达法则，极限是 $\\frac{6 \\cos 0}{4} = \\frac{3}{2}$。\n\n> **注意。** 只有正弦的自变量与分母一致时才有 $\\frac{\\sin w}{w} \\to 1$；这里两者系数之比 $\\frac{a}{b}$ 留了下来。",
  ],
  (rng) =>
    until(() => {
      const [a, b] = [rng.int(2, 9), rng.int(2, 9)];
      const answer = frac(a, b);
      return worked(
        [
          `What value at 0 removes the singularity of $\\frac{\\sin(${a} z)}{${b} z}$?`,
          `在 0 处取什么值能去掉 $\\frac{\\sin(${a} z)}{${b} z}$ 的奇点？`,
        ],
        answer,
        [
          [frac(b, a), "That turns the ratio upside down.", "那把比值颠倒了。"],
          [
            Q.of(1, 1),
            "That uses $\\frac{\\sin w}{w} \\to 1$ without matching the coefficients.",
            "那用了 $\\frac{\\sin w}{w} \\to 1$，却没有对齐系数。",
          ],
          [Q.of(a, 1), `That ignores the ${b} in the denominator.`, `那忽略了分母中的 ${b}。`],
        ],
        [
          [
            ["Expand the sine", "展开正弦"],
            [
              `$\\sin(${a} z) = ${a} z - \\frac{${a ** 3} z^3}{6} + \\cdots$.`,
              `$\\sin(${a} z) = ${a} z - \\frac{${a ** 3} z^3}{6} + \\cdots$。`,
            ],
          ],
          [
            ["Divide", "相除"],
            [
              `$\\frac{\\sin(${a} z)}{${b} z} = \\frac{${a}}{${b}} - \\frac{${a ** 3} z^2}{${6 * b}} + \\cdots$, which tends to $${answer.toLatex()}$.`,
              `$\\frac{\\sin(${a} z)}{${b} z} = \\frac{${a}}{${b}} - \\frac{${a ** 3} z^2}{${6 * b}} + \\cdots$，它趋于 $${answer.toLatex()}$。`,
            ],
          ],
        ],
        [
          `By L'Hôpital's rule, the limit is $\\frac{${a} \\cos 0}{${b}} = ${answer.toLatex()}$.`,
          `由洛必达法则，极限是 $\\frac{${a} \\cos 0}{${b}} = ${answer.toLatex()}$。`,
        ],
      );
    }),
);

const residueFromLaurent = point(
  "a-residue-from-a-laurent-series",
  ["A residue from a Laurent series", "由洛朗级数求留数"],
  [
    "The residue is by definition the coefficient of $\\frac{1}{z}$ in the Laurent series, and this works even at an essential singularity, where formulas for poles fail. Multiply out the series and collect every product that yields the power $-1$. Terms from different factors can both contribute. For $(z + 3) e^{2/z} = (z + 3)\\left( 1 + \\frac{2}{z} + \\frac{4}{2z^2} + \\cdots \\right)$, $z$ meets $\\frac{2}{z^2}$ and 3 meets $\\frac{2}{z}$, so the residue is $2 + 6 = 8$.\n\nCheck: the residue of $z^m e^{c/z}$ is the coefficient of $z^{-(m+1)}$ in $e^{c/z}$, namely $\\frac{c^{m+1}}{(m+1)!}$; this gives $\\frac{4}{2} = 2$ for $m = 1$ and $3 \\cdot 2 = 6$ for $m = 0$.\n\n> **Watch out.** The term $z$ needs the $z^{-2}$ term of the series, $\\frac{c^2}{2z^2}$, not the $z^{-1}$ term; and the constant contributes too.",
    "留数按定义是洛朗级数中 $\\frac{1}{z}$ 的系数，这在本性奇点处也适用，而极点的公式在那里失效。把级数乘开，收集所有产生 $-1$ 次幂的乘积。不同因子的项都可能有贡献。对 $(z + 3) e^{2/z} = (z + 3)\\left( 1 + \\frac{2}{z} + \\frac{4}{2z^2} + \\cdots \\right)$，$z$ 配 $\\frac{2}{z^2}$，3 配 $\\frac{2}{z}$，所以留数是 $2 + 6 = 8$。\n\n检验：$z^m e^{c/z}$ 的留数是 $e^{c/z}$ 中 $z^{-(m+1)}$ 的系数，即 $\\frac{c^{m+1}}{(m+1)!}$；$m = 1$ 时给出 $\\frac{4}{2} = 2$，$m = 0$ 时给出 $3 \\cdot 2 = 6$。\n\n> **注意。** $z$ 这一项需要级数中的 $z^{-2}$ 项 $\\frac{c^2}{2z^2}$，而不是 $z^{-1}$ 项；常数项也有贡献。",
  ],
  (rng) =>
    until(() => {
      const [a, b, c] = [rng.int(1, 5), rng.int(1, 5), rng.int(1, 5)];
      const answer = frac(a * c * c + 2 * b * c, 2);
      const first = frac(a * c * c, 2);
      return worked(
        [
          `What is the residue of $(${coef(a, "z")} + ${b}) e^{${c} / z}$ at 0?`,
          `$(${coef(a, "z")} + ${b}) e^{${c} / z}$ 在 0 处的留数是多少？`,
        ],
        answer,
        [
          [
            first,
            `That leaves out the constant ${b}, which meets the $\\frac{1}{z}$ term.`,
            `那漏掉了常数 ${b}，它与 $\\frac{1}{z}$ 项相配。`,
          ],
          [
            Q.of(b * c, 1),
            `That leaves out the term $${coef(a, "z")}$, which meets the $z^{-2}$ term.`,
            `那漏掉了 $${coef(a, "z")}$ 这一项，它与 $z^{-2}$ 项相配。`,
          ],
          [
            Q.of(a * c + b * c, 1),
            "That pairs $z$ with the $\\frac{1}{z}$ term, which gives a constant, not a residue.",
            "那把 $z$ 与 $\\frac{1}{z}$ 项相配，得到的是常数，不是留数。",
          ],
        ],
        [
          [
            ["Expand the exponential", "展开指数"],
            [
              `$e^{${c}/z} = 1 + \\frac{${c}}{z} + \\frac{${c * c}}{2 z^2} + \\cdots$.`,
              `$e^{${c}/z} = 1 + \\frac{${c}}{z} + \\frac{${c * c}}{2 z^2} + \\cdots$。`,
            ],
          ],
          [
            ["Collect the power minus one", "收集 −1 次幂"],
            [
              `$${coef(a, "z")} \\cdot \\frac{${c * c}}{2 z^2}$ gives $${first.toLatex()}$, and $${b} \\cdot \\frac{${c}}{z}$ gives ${b * c}.`,
              `$${coef(a, "z")} \\cdot \\frac{${c * c}}{2 z^2}$ 给出 $${first.toLatex()}$，$${b} \\cdot \\frac{${c}}{z}$ 给出 ${b * c}。`,
            ],
          ],
          [
            ["Add", "相加"],
            [`$${first.toLatex()} + ${b * c} = ${answer.toLatex()}$.`, `$${first.toLatex()} + ${b * c} = ${answer.toLatex()}$。`],
          ],
        ],
        [
          `By the formula $\\frac{c^{m+1}}{(m+1)!}$ for the residue of $z^m e^{c/z}$: $${a} \\cdot \\frac{${c * c}}{2} + ${b} \\cdot ${c} = ${answer.toLatex()}$.`,
          `由 $z^m e^{c/z}$ 的留数公式 $\\frac{c^{m+1}}{(m+1)!}$：$${a} \\cdot \\frac{${c * c}}{2} + ${b} \\cdot ${c} = ${answer.toLatex()}$。`,
        ],
      );
    }),
);

const residuesSum = {
  ...point(
    "residues-of-a-rational-function-sum-to-zero",
    ["Residues of a rational function sum to zero", "有理函数的留数和为零"],
    [
      "If the degree of the denominator exceeds that of the numerator by at least 2, a large circle encloses every pole and the integral around it tends to 0 by the $ML$ inequality. The residue theorem then says that all the residues add up to 0. In the drawing, $\\frac{1}{(z - 1)(z + 1)}$ has residues $\\frac{1}{2}$ at 1 and $-\\frac{1}{2}$ at $-1$, which add to 0. So one residue follows from the others: if three residues are 2, $-5$ and an unknown $r$, then $r = 3$.\n\nCheck: $2 + (-5) + 3 = 0$, as the large circle requires.\n\n> **Watch out.** The missing residue is minus the sum of the others, not the sum itself; keep track of the signs.",
      "如果分母的次数比分子至少高 2，大圆围住所有极点，由 $ML$ 不等式，沿它的积分趋于 0。留数定理于是说明所有留数之和为 0。图中 $\\frac{1}{(z - 1)(z + 1)}$ 在 1 处的留数是 $\\frac{1}{2}$，在 $-1$ 处是 $-\\frac{1}{2}$，和为 0。所以一个留数可以由其他留数得出：若三个留数是 2、$-5$ 和未知的 $r$，则 $r = 3$。\n\n检验：$2 + (-5) + 3 = 0$，正如大圆所要求的。\n\n> **注意。** 缺少的留数是其他留数之和的相反数，不是和本身；注意符号。",
    ],
    (rng) =>
      until(() => {
        const [x, y] = [rng.pick([-7, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]), rng.pick([-6, -4, -3, -2, -1, 1, 2, 3, 5, 7, 8])];
        const answer = -x - y;
        const sum = `${x} ${y < 0 ? `- ${-y}` : `+ ${y}`}`;
        return worked(
          [
            `A rational function has exactly three poles, and its denominator has degree at least 2 more than its numerator. Two residues are ${x} and ${y}. What is the third?`,
            `一个有理函数恰有三个极点，分母次数比分子至少高 2。两个留数是 ${x} 和 ${y}。第三个是多少？`,
          ],
          answer,
          [
            [x + y, "That is the sum of the two, but the third must cancel it.", "那是两者之和，但第三个必须把它抵消。"],
            [x - y, "That subtracts the residues instead of adding them first.", "那把留数相减了，而不是先相加。"],
            [y - x, "That subtracts the residues instead of adding them first.", "那把留数相减了，而不是先相加。"],
          ],
          [
            [
              ["Use the large circle", "用大圆"],
              [
                "The integral around a large circle tends to 0, so the three residues add to 0.",
                "沿大圆的积分趋于 0，所以三个留数之和为 0。",
              ],
            ],
            [
              ["Solve", "求解"],
              [`The third is $-(${sum}) = ${answer}$.`, `第三个是 $-(${sum}) = ${answer}$。`],
            ],
          ],
          [
            `Adding all three: $${sum} ${answer < 0 ? `- ${-answer}` : `+ ${answer}`} = 0$.`,
            `三者相加：$${sum} ${answer < 0 ? `- ${-answer}` : `+ ${answer}`} = 0$。`,
          ],
        );
      }),
  ),
  figure: complexDrawings1["the-residue-theorem#residues-of-a-rational-function-sum-to-zero"],
};

const squaredCosine = {
  ...point(
    "the-integral-of-a-squared-trigonometric-sum",
    ["The integral of a squared trigonometric sum", "三角和平方的积分"],
    [
      "With $z = e^{i \\theta}$ on the unit circle, $\\cos \\theta = \\frac{z + z^{-1}}{2}$, so a power of the cosine becomes a Laurent polynomial. Only its constant term survives the integral over a full period. In particular, $\\cos^2 \\theta = \\frac{z^2 + 2 + z^{-2}}{4}$ has constant term $\\frac{1}{2}$, the dashed level in the drawing, so $\\int_0^{2 \\pi} \\cos^2 \\theta \\, d\\theta = 2\\pi \\cdot \\frac{1}{2} = \\pi$. For $(1 + 2\\cos \\theta)^2 = 1 + 4\\cos \\theta + 4\\cos^2 \\theta$, the integral is $2\\pi + 0 + 4\\pi = 6\\pi$.\n\nCheck: $\\cos^2 \\theta = \\frac{1 + \\cos 2\\theta}{2}$, and $\\cos 2\\theta$ integrates to 0 over a period, leaving $\\pi$.\n\n> **Watch out.** A constant integrates to $2\\pi$ times itself, while $\\cos^2 \\theta$ gives only $\\pi$; and the cross term $\\cos \\theta$ gives 0.",
      "在单位圆上取 $z = e^{i \\theta}$，有 $\\cos \\theta = \\frac{z + z^{-1}}{2}$，所以余弦的幂变成洛朗多项式。在整个周期上积分时只有常数项留下。特别地，$\\cos^2 \\theta = \\frac{z^2 + 2 + z^{-2}}{4}$ 的常数项是 $\\frac{1}{2}$，即图中的虚线高度，所以 $\\int_0^{2 \\pi} \\cos^2 \\theta \\, d\\theta = 2\\pi \\cdot \\frac{1}{2} = \\pi$。对 $(1 + 2\\cos \\theta)^2 = 1 + 4\\cos \\theta + 4\\cos^2 \\theta$，积分为 $2\\pi + 0 + 4\\pi = 6\\pi$。\n\n检验：$\\cos^2 \\theta = \\frac{1 + \\cos 2\\theta}{2}$，而 $\\cos 2\\theta$ 在一个周期上的积分为 0，剩下 $\\pi$。\n\n> **注意。** 常数积分后是它的 $2\\pi$ 倍，而 $\\cos^2 \\theta$ 只给出 $\\pi$；交叉项 $\\cos \\theta$ 给出 0。",
    ],
    (rng) =>
      until(() => {
        const [a, b] = [rng.int(1, 9), rng.int(1, 9)];
        const answer = 2 * a * a + b * b;
        return worked(
          [
            `$\\int_0^{2 \\pi} (${a} + ${coef(b, "\\cos \\theta")})^2 \\, d\\theta = k \\pi$. What is $k$?`,
            `$\\int_0^{2 \\pi} (${a} + ${coef(b, "\\cos \\theta")})^2 \\, d\\theta = k \\pi$。$k$ 是多少？`,
          ],
          answer,
          [
            [
              a * a + b * b,
              `That integrates the constant ${a * a} to $${a * a}\\pi$; a constant gives $2\\pi$ times itself.`,
              `那把常数 ${a * a} 积成了 $${a * a}\\pi$；常数积分后是它的 $2\\pi$ 倍。`,
            ],
            [
              2 * a * a + 2 * b * b,
              "That integrates $\\cos^2 \\theta$ to $2\\pi$; its average is $\\frac{1}{2}$, so it gives $\\pi$.",
              "那把 $\\cos^2 \\theta$ 积成了 $2\\pi$；它的平均值是 $\\frac{1}{2}$，所以给出 $\\pi$。",
            ],
            [
              2 * a * a + b * b + 4 * a * b,
              "That integrates the cross term as if $\\cos \\theta$ were 1; over a period it gives 0.",
              "那把交叉项当作 $\\cos \\theta = 1$ 来积分；在一个周期上它给出 0。",
            ],
          ],
          [
            [
              ["Expand", "展开"],
              [
                `$${a * a} + ${2 * a * b} \\cos \\theta + ${b * b} \\cos^2 \\theta$.`,
                `$${a * a} + ${2 * a * b} \\cos \\theta + ${b * b} \\cos^2 \\theta$。`,
              ],
            ],
            [
              ["Integrate each term", "逐项积分"],
              [
                `Over a full period: $${a * a} \\cdot 2\\pi$, then 0, then $${b * b} \\cdot \\pi$.`,
                `在一个完整周期上：$${a * a} \\cdot 2\\pi$，然后是 0，然后是 $${b * b} \\cdot \\pi$。`,
              ],
            ],
            [
              ["Add", "相加"],
              [`$${2 * a * a}\\pi + ${b * b}\\pi = ${answer}\\pi$.`, `$${2 * a * a}\\pi + ${b * b}\\pi = ${answer}\\pi$。`],
            ],
          ],
          [
            `With $z = e^{i\\theta}$, the constant term of $\\left( ${a} + ${b} \\cdot \\frac{z + z^{-1}}{2} \\right)^2$ is $${a * a} + \\frac{${b * b}}{2}$, and $2\\pi$ times it is $${answer}\\pi$.`,
            `取 $z = e^{i\\theta}$，$\\left( ${a} + ${b} \\cdot \\frac{z + z^{-1}}{2} \\right)^2$ 的常数项是 $${a * a} + \\frac{${b * b}}{2}$，乘以 $2\\pi$ 得 $${answer}\\pi$。`,
          ],
        );
      }),
  ),
  figure: complexDrawings1["trigonometric-integrals-by-residues#the-integral-of-a-squared-trigonometric-sum"],
};

const twoSquares = point(
  "an-integral-with-two-pairs-of-poles",
  ["An integral with two pairs of poles", "有两对极点的积分"],
  [
    "For $\\frac{1}{(x^2 + a^2)(x^2 + b^2)}$, the poles in the upper half-plane are $a i$ and $b i$. Their residues are $\\frac{1}{2 a i (b^2 - a^2)}$ and $\\frac{1}{2 b i (a^2 - b^2)}$. Adding them and multiplying by $2 \\pi i$ gives the integral $\\frac{\\pi}{a b (a + b)}$. For $\\frac{1}{(x^2 + 1)(x^2 + 4)}$, $a = 1$ and $b = 2$, so the integral is $\\frac{\\pi}{1 \\cdot 2 \\cdot 3} = \\frac{\\pi}{6}$.\n\nCheck: partial fractions give $\\frac{1}{3} \\left( \\frac{1}{x^2 + 1} - \\frac{1}{x^2 + 4} \\right)$, which integrates to $\\frac{1}{3} \\left( \\pi - \\frac{\\pi}{2} \\right) = \\frac{\\pi}{6}$.\n\n> **Watch out.** Read $a$ and $b$ as the square roots of the constants, and use only the two poles in the upper half-plane; the residues at all four poles add to 0.",
    "对 $\\frac{1}{(x^2 + a^2)(x^2 + b^2)}$，上半平面的极点是 $a i$ 和 $b i$。它们的留数是 $\\frac{1}{2 a i (b^2 - a^2)}$ 和 $\\frac{1}{2 b i (a^2 - b^2)}$。相加再乘 $2 \\pi i$，得积分 $\\frac{\\pi}{a b (a + b)}$。对 $\\frac{1}{(x^2 + 1)(x^2 + 4)}$，$a = 1$，$b = 2$，所以积分是 $\\frac{\\pi}{1 \\cdot 2 \\cdot 3} = \\frac{\\pi}{6}$。\n\n检验：部分分式给出 $\\frac{1}{3} \\left( \\frac{1}{x^2 + 1} - \\frac{1}{x^2 + 4} \\right)$，积分为 $\\frac{1}{3} \\left( \\pi - \\frac{\\pi}{2} \\right) = \\frac{\\pi}{6}$。\n\n> **注意。** $a$ 和 $b$ 是常数的平方根；只用上半平面的两个极点；四个极点的留数之和为 0。",
  ],
  (rng) =>
    until(() => {
      const a = rng.int(1, 8);
      const b = a + rng.int(1, 5);
      const m = a * b * (a + b);
      const answer = Q.of(1, m);
      const gap = b * b - a * a;
      const inv = a === 1 ? "1" : `\\frac{1}{${a}}`;
      const piA = a === 1 ? "\\pi" : `\\frac{\\pi}{${a}}`;
      return worked(
        [
          `$\\int_{-\\infty}^{\\infty} \\frac{dx}{(x^2 + ${a * a})(x^2 + ${b * b})} = k \\pi$. What is $k$?`,
          `$\\int_{-\\infty}^{\\infty} \\frac{dx}{(x^2 + ${a * a})(x^2 + ${b * b})} = k \\pi$。$k$ 是多少？`,
        ],
        answer,
        [
          [Q.of(1, a * b), `That leaves out the factor $a + b = ${a + b}$.`, `那漏掉了因子 $a + b = ${a + b}$。`],
          [Q.of(2, m), "That drops the 2 in the residue denominators $2ai$ and $2bi$.", "那漏掉了留数分母 $2ai$ 和 $2bi$ 中的 2。"],
          [
            Q.of(1, a * a * b * b),
            "That uses the constants themselves instead of their square roots.",
            "那直接用了常数，而不是它们的平方根。",
          ],
        ],
        [
          [
            ["Find the upper poles", "找出上半平面的极点"],
            [
              `$${coef(a, "i")}$ and $${b}i$, with $a = ${a}$ and $b = ${b}$.`,
              `$${coef(a, "i")}$ 和 $${b}i$，其中 $a = ${a}$，$b = ${b}$。`,
            ],
          ],
          [
            ["Compute the residues", "计算留数"],
            [
              `At $${coef(a, "i")}$: $\\frac{1}{2 \\cdot ${coef(a, "i")} \\cdot ${gap}}$; at $${b}i$: $-\\frac{1}{2 \\cdot ${b}i \\cdot ${gap}}$.`,
              `在 $${coef(a, "i")}$ 处：$\\frac{1}{2 \\cdot ${coef(a, "i")} \\cdot ${gap}}$；在 $${b}i$ 处：$-\\frac{1}{2 \\cdot ${b}i \\cdot ${gap}}$。`,
            ],
          ],
          [
            ["Multiply by 2πi", "乘以 2πi"],
            [
              `$2\\pi i$ times the sum is $\\frac{\\pi}{${gap}} \\left( ${inv} - \\frac{1}{${b}} \\right) = \\frac{\\pi}{${a} \\cdot ${b} \\cdot ${a + b}} = ${answer.toLatex()} \\pi$.`,
              `$2\\pi i$ 乘以留数和得 $\\frac{\\pi}{${gap}} \\left( ${inv} - \\frac{1}{${b}} \\right) = \\frac{\\pi}{${a} \\cdot ${b} \\cdot ${a + b}} = ${answer.toLatex()} \\pi$。`,
            ],
          ],
        ],
        [
          `Partial fractions: $\\frac{1}{${gap}} \\left( \\frac{1}{x^2 + ${a * a}} - \\frac{1}{x^2 + ${b * b}} \\right)$ integrates to $\\frac{1}{${gap}} \\left( ${piA} - \\frac{\\pi}{${b}} \\right) = ${answer.toLatex()} \\pi$.`,
          `部分分式：$\\frac{1}{${gap}} \\left( \\frac{1}{x^2 + ${a * a}} - \\frac{1}{x^2 + ${b * b}} \\right)$ 的积分是 $\\frac{1}{${gap}} \\left( ${piA} - \\frac{\\pi}{${b}} \\right) = ${answer.toLatex()} \\pi$。`,
        ],
      );
    }),
);

const mobiusInverse = point(
  "inverting-a-mobius-map",
  ["Inverting a Möbius map", "求默比乌斯变换的逆"],
  [
    "Solving $w = \\frac{a z + b}{c z + d}$ for $z$ gives $z = \\frac{d w - b}{a - c w}$, which is again a Möbius transformation. So these maps form a group under composition, and each one is a bijection of the extended plane. A single preimage comes from substituting the value of $w$. For $f(z) = \\frac{2z + 1}{z + 3}$ and $f(z) = 4$: $2z + 1 = 4z + 12$, so $-2z = 11$ and $z = -\\frac{11}{2}$.\n\nCheck: $f(-\\frac{11}{2}) = \\frac{-11 + 1}{-\\frac{11}{2} + 3} = \\frac{-10}{-\\frac{5}{2}} = 4$.\n\n> **Watch out.** Solving is not the same as evaluating: $f(4)$ is a different number. When moving terms across, watch the signs of $b$ and of $c w$.",
    "由 $w = \\frac{a z + b}{c z + d}$ 解出 $z$，得 $z = \\frac{d w - b}{a - c w}$，它还是默比乌斯变换。所以这些映射在复合下构成群，每一个都是扩充平面上的双射。代入 $w$ 的值就能得到一个原像。对 $f(z) = \\frac{2z + 1}{z + 3}$ 和 $f(z) = 4$：$2z + 1 = 4z + 12$，所以 $-2z = 11$，$z = -\\frac{11}{2}$。\n\n检验：$f(-\\frac{11}{2}) = \\frac{-11 + 1}{-\\frac{11}{2} + 3} = \\frac{-10}{-\\frac{5}{2}} = 4$。\n\n> **注意。** 求原像不同于求函数值：$f(4)$ 是另一个数。移项时注意 $b$ 和 $c w$ 的符号。",
  ],
  (rng) =>
    until(() => {
      const [a, b, c, d] = [rng.int(1, 6), rng.int(1, 6), rng.int(1, 6), rng.int(1, 6)];
      const w = rng.int(1, 9);
      if (a * d === b * c || a === c * w) return undefined;
      const answer = frac(d * w - b, a - c * w);
      const par = (q: ReturnType<typeof frac>) => (q.sign() < 0 ? `(${q.toLatex()})` : q.toLatex());
      const top = answer.mul(Q.of(a, 1)).add(Q.of(b, 1));
      const bottom = answer.mul(Q.of(c, 1)).add(Q.of(d, 1));
      return worked(
        [
          `For $f(z) = \\frac{${coef(a, "z")} + ${b}}{${coef(c, "z")} + ${d}}$, which $z$ satisfies $f(z) = ${w}$?`,
          `对 $f(z) = \\frac{${coef(a, "z")} + ${b}}{${coef(c, "z")} + ${d}}$，哪个 $z$ 满足 $f(z) = ${w}$？`,
        ],
        answer,
        [
          [
            frac(a * w + b, c * w + d),
            `That evaluates $f(${w})$ instead of solving $f(z) = ${w}$.`,
            `那计算了 $f(${w})$，而不是解 $f(z) = ${w}$。`,
          ],
          [frac(d * w + b, a - c * w), `That moves ${b} across without changing its sign.`, `那把 ${b} 移项时没有变号。`],
          [
            frac(d * w - b, a + c * w),
            `That moves $${coef(c * w, "z")}$ across without changing its sign.`,
            `那把 $${coef(c * w, "z")}$ 移项时没有变号。`,
          ],
        ],
        [
          [
            ["Clear the denominator", "去分母"],
            [
              `$${coef(a, "z")} + ${b} = ${w} (${coef(c, "z")} + ${d}) = ${coef(c * w, "z")} + ${d * w}$.`,
              `$${coef(a, "z")} + ${b} = ${w} (${coef(c, "z")} + ${d}) = ${coef(c * w, "z")} + ${d * w}$。`,
            ],
          ],
          [
            ["Collect the terms in z", "合并含 z 的项"],
            [`$${coef(a - c * w, "z")} = ${d * w - b}$.`, `$${coef(a - c * w, "z")} = ${d * w - b}$。`],
          ],
          [
            ["Divide", "相除"],
            [`$z = ${answer.toLatex()}$.`, `$z = ${answer.toLatex()}$。`],
          ],
        ],
        [
          `Substitute back: the numerator is $${a} \\cdot ${par(answer)} + ${b} = ${top.toLatex()}$ and the denominator is $${c} \\cdot ${par(answer)} + ${d} = ${bottom.toLatex()}$, and $${top.toLatex()} = ${w} \\cdot ${par(bottom)}$.`,
          `代回：分子是 $${a} \\cdot ${par(answer)} + ${b} = ${top.toLatex()}$，分母是 $${c} \\cdot ${par(answer)} + ${d} = ${bottom.toLatex()}$，而 $${top.toLatex()} = ${w} \\cdot ${par(bottom)}$。`,
        ],
      );
    }),
);

const rotationAngle = {
  ...point(
    "the-local-rotation-angle",
    ["The local rotation angle", "局部旋转角"],
    [
      "An analytic map with nonzero derivative rotates small shapes by the argument of $f'(z)$ and scales them by its modulus. This is why angles between curves are preserved. For $f(z) = z^n$, the derivative is $n z^{n-1}$, so the rotation at a point with argument $\\theta$ is $(n - 1) \\theta$. In the drawing, $f(z) = z^3$ at $\\theta = \\frac{\\pi}{6}$: $f'(z) = 3z^2$ has argument $2 \\cdot \\frac{\\pi}{6} = \\frac{\\pi}{3}$, so small shapes turn by $60^\\circ$.\n\nCheck: the ray at angle $30^\\circ$ goes to the ray at $90^\\circ$, and the circle through the point, crossing that ray at a right angle, goes to a circle that still crosses at a right angle; its tangent turns from $120^\\circ$ to $180^\\circ$, again by $60^\\circ$.\n\n> **Watch out.** The rotation is the argument of $f'(z)$, not of $f(z)$: use $(n - 1)\\theta$, not $n\\theta$. The modulus of the point affects only the scaling.",
      "导数不为零的解析映射把小图形旋转 $f'(z)$ 的辐角，并按它的模伸缩。这就是曲线间夹角保持不变的原因。对 $f(z) = z^n$，导数是 $n z^{n-1}$，所以在辐角为 $\\theta$ 的点，旋转角是 $(n - 1) \\theta$。图中 $f(z) = z^3$，$\\theta = \\frac{\\pi}{6}$：$f'(z) = 3z^2$ 的辐角是 $2 \\cdot \\frac{\\pi}{6} = \\frac{\\pi}{3}$，所以小图形转过 $60^\\circ$。\n\n检验：角为 $30^\\circ$ 的射线映到 $90^\\circ$ 的射线，而过该点且与射线垂直相交的圆映到仍与之垂直相交的圆；它的切线从 $120^\\circ$ 转到 $180^\\circ$，同样转过 $60^\\circ$。\n\n> **注意。** 旋转角是 $f'(z)$ 的辐角，不是 $f(z)$ 的：用 $(n - 1)\\theta$，不是 $n\\theta$。点的模只影响伸缩。",
    ],
    (rng) =>
      until(() => {
        const n = rng.int(2, 5);
        const theta = 15 * rng.int(1, 11);
        const r = rng.int(1, 4);
        const answer = ((n - 1) * theta) % 360;
        return worked(
          [
            `By how many degrees, from 0 up to 360, does $f(z) = z^{${n}}$ rotate small shapes at the point with modulus ${r} and argument $${theta}^\\circ$?`,
            `$f(z) = z^{${n}}$ 在模为 ${r}、辐角为 $${theta}^\\circ$ 的点，把小图形旋转多少度（从 0 到 360）？`,
          ],
          answer,
          [
            [
              (n * theta) % 360,
              "That is the argument of $f(z)$; the rotation is the argument of $f'(z)$.",
              "那是 $f(z)$ 的辐角；旋转角是 $f'(z)$ 的辐角。",
            ],
            [theta, "That is the argument of the point itself.", "那是这个点本身的辐角。"],
            [
              ((n + 1) * theta) % 360,
              `That raises the power when differentiating; $f'(z)$ has $${pow("z", n - 1)}$.`,
              `那求导时把幂次升高了；$f'(z)$ 含 $${pow("z", n - 1)}$。`,
            ],
          ],
          [
            [
              ["Differentiate", "求导"],
              [`$f'(z) = ${n} ${pow("z", n - 1)}$.`, `$f'(z) = ${n} ${pow("z", n - 1)}$。`],
            ],
            [
              ["Take the argument", "取辐角"],
              [
                `The factor ${n} is positive, so the argument is $${n - 1} \\cdot ${theta}^\\circ = ${(n - 1) * theta}^\\circ$${(n - 1) * theta >= 360 ? `, which reduces to $${answer}^\\circ$` : ""}.`,
                `因子 ${n} 为正，所以辐角是 $${n - 1} \\cdot ${theta}^\\circ = ${(n - 1) * theta}^\\circ$${(n - 1) * theta >= 360 ? `，化简为 $${answer}^\\circ$` : ""}。`,
              ],
            ],
          ],
          [
            `The ray at $${theta}^\\circ$ maps to the ray at $${n * theta}^\\circ$, a turn of $${(n - 1) * theta}^\\circ$, and conformality turns every direction at the point by the same amount, ${answer} degrees after reducing.`,
            `角为 $${theta}^\\circ$ 的射线映到 $${n * theta}^\\circ$ 的射线，转过 $${(n - 1) * theta}^\\circ$；保角性使该点的每个方向都转过同样的角度，化简后为 ${answer} 度。`,
          ],
        );
      }),
  ),
  figure: complexDrawings1["conformal-maps#the-local-rotation-angle"],
};

const cayley = point(
  "the-cayley-map",
  ["The Cayley map", "凯莱变换"],
  [
    "The Cayley map $f(z) = \\frac{z - i}{z + i}$ sends the upper half-plane onto the unit disc, since points above the real axis are closer to $i$ than to $-i$. So it carries $i$ to the center, and the positive imaginary axis onto a diameter of the disc. For $z = 3i$, $f(3i) = \\frac{3i - i}{3i + i} = \\frac{2i}{4i} = \\frac{1}{2}$.\n\nCheck: $f(z) = 1 - \\frac{2i}{z + i}$, so $f(3i) = 1 - \\frac{2i}{4i} = 1 - \\frac{1}{2} = \\frac{1}{2}$, inside the disc as it must be.\n\n> **Watch out.** The image has modulus less than 1, so a result like $\\frac{4}{2}$ means the fraction is upside down; and $z - i$ in the numerator makes the image positive for points above $i$.",
    "凯莱变换 $f(z) = \\frac{z - i}{z + i}$ 把上半平面映到单位圆盘上，因为实轴上方的点离 $i$ 比离 $-i$ 近。所以它把 $i$ 送到圆心，把正虚轴送到圆盘的一条直径上。对 $z = 3i$，$f(3i) = \\frac{3i - i}{3i + i} = \\frac{2i}{4i} = \\frac{1}{2}$。\n\n检验：$f(z) = 1 - \\frac{2i}{z + i}$，所以 $f(3i) = 1 - \\frac{2i}{4i} = 1 - \\frac{1}{2} = \\frac{1}{2}$，理应在圆盘内。\n\n> **注意。** 像的模小于 1，所以像 $\\frac{4}{2}$ 这样的结果说明分式颠倒了；分子是 $z - i$，所以 $i$ 上方的点的像为正。",
  ],
  (rng) =>
    until(() => {
      const t = rng.int(2, 31);
      const answer = frac(t - 1, t + 1);
      const rest = frac(2, t + 1);
      return worked(
        [
          `What is the image of the point $${t} i$ under $f(z) = \\frac{z - i}{z + i}$?`,
          `点 $${t} i$ 在 $f(z) = \\frac{z - i}{z + i}$ 下的像是什么？`,
        ],
        answer,
        [
          [
            frac(t + 1, t - 1),
            "That turns the fraction upside down; the image must lie inside the unit disc.",
            "那把分式颠倒了；像必须在单位圆盘内。",
          ],
          [frac(1 - t, t + 1), "That uses $i - z$ in the numerator; the sign is reversed.", "那在分子中用了 $i - z$；符号反了。"],
          [frac(t, t + 1), "That drops the $-i$ from the numerator.", "那漏掉了分子中的 $-i$。"],
        ],
        [
          [
            ["Substitute", "代入"],
            [
              `$f(${t}i) = \\frac{${t}i - i}{${t}i + i} = \\frac{${coef(t - 1, "i")}}{${t + 1}i}$.`,
              `$f(${t}i) = \\frac{${t}i - i}{${t}i + i} = \\frac{${coef(t - 1, "i")}}{${t + 1}i}$。`,
            ],
          ],
          [
            ["Cancel i", "约去 i"],
            [`$\\frac{${t - 1}}{${t + 1}} = ${answer.toLatex()}$.`, `$\\frac{${t - 1}}{${t + 1}} = ${answer.toLatex()}$。`],
          ],
        ],
        [
          `Write $f(z) = 1 - \\frac{2i}{z + i}$: then $f(${t}i) = 1 - \\frac{2i}{${t + 1}i} = 1 - ${rest.toLatex()} = ${answer.toLatex()}$, which lies in the unit disc.`,
          `写成 $f(z) = 1 - \\frac{2i}{z + i}$：则 $f(${t}i) = 1 - \\frac{2i}{${t + 1}i} = 1 - ${rest.toLatex()} = ${answer.toLatex()}$，它在单位圆盘内。`,
        ],
      );
    }),
);

/** deeperComplexAnalysisPoints maps topics of Complex Analysis to their further knowledge points. */
export const deeperComplexAnalysisPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "the-polar-form-of-a-complex-number": [addingArguments],
  "functions-of-a-complex-variable": [imageOfACircle],
  "limits-of-complex-functions": [limitByCancelling],
  "the-complex-derivative": [chainRule],
  "the-cauchy-riemann-equations": [whereEquationsHold],
  "harmonic-functions-and-conjugates": [laplacianValue],
  "the-complex-exponential-function": [exponentialModulus],
  "the-complex-logarithm": [logOfProduct],
  "complex-powers-and-branches": [iToAComplexPower],
  "contour-integrals": [closedPower],
  "the-ml-inequality": [mlShrinking],
  "winding-numbers": [windingRepeated],
  "cauchys-integral-formula": [twoPoles],
  "cauchys-estimates-and-liouvilles-theorem": [generalLiouville],
  "taylor-series-of-analytic-functions": [expCoefficient],
  "power-series-on-discs": [radiusByRoot],
  "zeros-of-analytic-functions": [orderFromProduct],
  "laurent-series": [principalPart],
  "classifying-isolated-singularities": [removableValue],
  "computing-residues": [residueFromLaurent],
  "the-residue-theorem": [residuesSum],
  "trigonometric-integrals-by-residues": [squaredCosine],
  "improper-integrals-by-residues": [twoSquares],
  "mobius-transformations": [mobiusInverse],
  "conformal-maps": [rotationAngle],
  "conformal-maps-of-regions": [cayley],
};
