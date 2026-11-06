// Complex Analysis: analytic functions, contour integrals, Cauchy's theorems, series,
// residues and conformal maps, building on complex numbers and multivariable calculus.

import type { Rng, TopicDef } from "@ga/content";
import { Q } from "@ga/subject-math";
import { complexDrawings1 } from "../explanation-drawings-complex-analysis-1.ts";

import { ask, choose, type Pair, point, same, topic } from "../university-kit.ts";

/** complex writes a Gaussian integer in LaTeX. */
function complex(a: number, b: number): string {
  if (b === 0) return `${a}`;
  const unit = Math.abs(b) === 1 ? "i" : `${Math.abs(b)}i`;
  if (a === 0) return b < 0 ? `-${unit}` : unit;
  return `${a} ${b < 0 ? "-" : "+"} ${unit}`;
}

/** minus writes a variable minus a number, adjusting the sign. */
const minus = (v: string, a: number) => (a === 0 ? v : a < 0 ? `${v} + ${-a}` : `${v} - ${a}`);

/** factor writes a power of z minus a number, as it stands in a product. */
const factor = (a: number, n = 1) => {
  const base = a === 0 ? "z" : `(${minus("z", a)})`;
  return n === 1 ? base : `${base}^{${n}}`;
};

/** bracket wraps a negative number in parentheses. */
const bracket = (v: number) => (v < 0 ? `(${v})` : `${v}`);

/** coefficient writes a coefficient before a term, leaving out a coefficient of one. */
const coefficient = (c: number, term: string) => (c === 1 ? term : c === -1 ? `-${term}` : `${c}${term}`);

/** triples are Pythagorean triples, so that moduli come out whole. */
const triples: readonly (readonly [number, number, number])[] = [
  [3, 4, 5],
  [4, 3, 5],
  [5, 12, 13],
  [12, 5, 13],
  [8, 15, 17],
  [15, 8, 17],
  [6, 8, 10],
  [8, 6, 10],
];

/** signedTriple draws a Gaussian integer with a whole modulus. */
const signedTriple = (rng: Rng) => {
  const [a, b, r] = rng.pick(triples) as readonly [number, number, number];
  return { a: rng.bool() ? a : -a, b: rng.bool() ? b : -b, r };
};

const complexFunctions = topic(
  "functions-of-a-complex-variable",
  ["Functions of a Complex Variable", "复变函数"],
  ["Evaluate functions of a complex variable, and split them into real and imaginary parts.", "计算复变函数的值，并把它们分成实部和虚部。"],
  ["multiplying-complex-numbers", "dividing-complex-numbers"],
  [["multiplying-complex-numbers", 0.3]],
  [
    point(
      "the-real-and-imaginary-parts-of-a-square",
      ["Parts of a quadratic function", "二次函数的实部和虚部"],
      [
        "A complex function sends each complex number to another, so it can be written as $u + iv$, with $u$ and $v$ real functions of $x$ and $y$. For $z^2$, expanding gives $u$ as $x^2 - y^2$ and $v$ as $2xy$. Thinking of a complex function as two linked real functions is the first step towards the Cauchy–Riemann equations.",
        "复变函数把每个复数送到另一个复数，所以可以写成 $u + iv$，其中 $u$ 和 $v$ 是 $x$ 和 $y$ 的实函数。对 $z^2$，展开后得 $u$ 为 $x^2 - y^2$，$v$ 为 $2xy$。把复变函数看成两个相互联系的实函数，是通向柯西–黎曼方程的第一步。",
      ],
      (rng) => {
        const a = rng.int(-6, 6);
        const b = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const c = rng.int(-9, 9);
        const asksReal = rng.bool();
        const [u, v] = [a * a - b * b + c, 2 * a * b];
        const addend = c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`;
        return ask(
          [
            `Let $f(z) = z^2${addend}$. What is the ${asksReal ? "real" : "imaginary"} part of $f(${complex(a, b)})$?`,
            `设 $f(z) = z^2${addend}$。$f(${complex(a, b)})$ 的${asksReal ? "实部" : "虚部"}是多少？`,
          ],
          asksReal ? u : v,
          asksReal
            ? [a * a + b * b + c, v, a + c, u - 2 * c === u ? u + 1 : u - 2 * c]
            : [u, a * b, 2 * a * b + c === v ? v + 1 : 2 * a * b + c, -v],
          [
            `$u = x^2 - y^2${addend}$ and $v = 2xy$, so $f(${complex(a, b)}) = ${complex(u, v)}$.`,
            `$u = x^2 - y^2${addend}$，$v = 2xy$，所以 $f(${complex(a, b)}) = ${complex(u, v)}$。`,
          ],
        );
      },
    ),
    point(
      "the-reciprocal-function",
      ["The reciprocal function", "倒数函数"],
      [
        "The reciprocal of a complex number comes from multiplying above and below by its conjugate, which makes the denominator the real number $x^2 + y^2$. So $\\frac{1}{z} = \\frac{x}{x^2 + y^2} - \\frac{y}{x^2 + y^2} i$. The sign of the imaginary part flips, which is a common place to slip when working quickly.",
        "复数的倒数可以通过分子分母同乘共轭得到，这样分母变成实数 $x^2 + y^2$。所以 $\\frac{1}{z} = \\frac{x}{x^2 + y^2} - \\frac{y}{x^2 + y^2} i$。虚部的符号相反，快速计算时这里常常出错。",
      ],
      (rng) => {
        const { a, b, r } = signedTriple(rng);
        const asksReal = rng.bool();
        const answer = asksReal ? Q.of(a, r * r) : Q.of(-b, r * r);
        return ask(
          [
            `What is the ${asksReal ? "real" : "imaginary"} part of $\\frac{1}{${complex(a, b)}}$?`,
            `$\\frac{1}{${complex(a, b)}}$ 的${asksReal ? "实部" : "虚部"}是多少？`,
          ],
          answer,
          [
            asksReal ? Q.of(b, r * r) : Q.of(b, r * r),
            Q.of(asksReal ? a : -b, r),
            Q.of(asksReal ? -a : a, r * r),
            Q.of(1, asksReal ? a : b),
          ],
          [
            `Multiplying by the conjugate gives $\\frac{${complex(a, -b)}}{${r * r}}$, so the part asked for is $${answer.toLatex()}$.`,
            `乘以共轭得 $\\frac{${complex(a, -b)}}{${r * r}}$，所以所求的部分是 $${answer.toLatex()}$。`,
          ],
        );
      },
    ),
  ],
);

const complexLimits = topic(
  "limits-of-complex-functions",
  ["Limits of Complex Functions", "复变函数的极限"],
  ["Evaluate limits, and detect failure by approaching along different lines.", "求极限，并通过沿不同直线趋近来发现极限不存在。"],
  ["functions-of-a-complex-variable"],
  [],
  [
    point(
      "a-limit-along-a-line",
      ["A limit along a line", "沿直线的极限"],
      [
        "In the plane, $z$ can approach a point along infinitely many paths, and a limit must give the same value on all of them. The quotient $\\frac{\\bar{z}}{z}$ depends only on direction: along the line $y = mx$, it is constant. So different lines give different values, which proves the limit at zero does not exist.",
        "在平面上，$z$ 可以沿无穷多条路径趋近一点，极限必须在所有路径上给出相同的值。商 $\\frac{\\bar{z}}{z}$只取决于方向：沿直线 $y = mx$，它是常数。所以不同的直线给出不同的值，这就证明了在零处极限不存在。",
      ],
      (rng) => {
        const m = rng.int(2, 20);
        const asksReal = rng.bool();
        const answer = asksReal ? Q.of(1 - m * m, 1 + m * m) : Q.of(-2 * m, 1 + m * m);
        const other = asksReal ? Q.of(-2 * m, 1 + m * m) : Q.of(1 - m * m, 1 + m * m);
        return ask(
          [
            `Along the line $y = ${m}x$, the quotient $\\frac{\\bar{z}}{z}$ is constant. What is its ${asksReal ? "real" : "imaginary"} part?`,
            `沿直线 $y = ${m}x$，商 $\\frac{\\bar{z}}{z}$ 是常数。它的${asksReal ? "实部" : "虚部"}是多少？`,
          ],
          answer,
          [other, Q.of(1), Q.of(-1), answer.mul(Q.of(-1))],
          [
            `With $z = x(1 + ${m}i)$, the quotient is $\\frac{1 - ${m}i}{1 + ${m}i} = \\frac{(1 - ${m}i)^2}{${1 + m * m}}$, whose ${asksReal ? "real" : "imaginary"} part is $${answer.toLatex()}$.`,
            `取 $z = x(1 + ${m}i)$，商是 $\\frac{1 - ${m}i}{1 + ${m}i} = \\frac{(1 - ${m}i)^2}{${1 + m * m}}$，其${asksReal ? "实部" : "虚部"}是 $${answer.toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "a-limit-of-a-polynomial",
      ["A limit of a quotient", "商的极限"],
      [
        "Polynomials are continuous on the whole plane, so their limits come from substitution, just as for real functions. A quotient that is zero over zero at a point usually has a common factor to cancel. After cancelling $z^2 - a^2$ with $z - a$, the limit at $a$ is $2a$, in any direction of approach, and this quotient is exactly the derivative of the square function.",
        "多项式在整个平面上连续，所以它们的极限可以直接代入，就像实函数一样。在一点处为零比零的商通常有可约去的公因式。把 $z^2 - a^2$ 与 $z - a$ 约分后，在 $a$ 处的极限是 $2a$，不论从哪个方向趋近，而这个商正是平方函数的导数。",
      ],
      (rng) => {
        const a = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
        const b = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
        const asksReal = rng.bool();
        const z0 = complex(a, b);
        const inner = `z - (${z0})`;
        const answer = asksReal ? 2 * a : 2 * b;
        return ask(
          [
            `What is the ${asksReal ? "real" : "imaginary"} part of $\\lim_{z \\to ${z0}} \\frac{z^2 - (${z0})^2}{${inner}}$?`,
            `$\\lim_{z \\to ${z0}} \\frac{z^2 - (${z0})^2}{${inner}}$ 的${asksReal ? "实部" : "虚部"}是多少？`,
          ],
          answer,
          [asksReal ? a : b, asksReal ? 2 * b : 2 * a, -answer, answer + 2],
          [
            `Cancelling the factor leaves $z + (${z0})$, which tends to $${complex(2 * a, 2 * b)}$.`,
            `约去公因式后剩下 $z + (${z0})$，它趋向 $${complex(2 * a, 2 * b)}$。`,
          ],
        );
      },
    ),
  ],
);

const complexDerivative = topic(
  "the-complex-derivative",
  ["The Complex Derivative", "复导数"],
  ["Differentiate by the familiar rules, and see why the conjugate has no derivative.", "用熟悉的法则求导，并了解共轭为什么没有导数。"],
  ["limits-of-complex-functions"],
  [["limits-of-complex-functions", 0.5]],
  [
    point(
      "differentiating-a-power",
      ["Differentiating a polynomial", "多项式求导"],
      [
        "The complex derivative is defined by the same quotient as the real one, but with $h$ complex and approaching zero from every direction. Where it exists, the familiar rules hold: the power, sum, product and chain rules all carry over. So the derivative of a polynomial is computed as usual and then evaluated, with the complex arithmetic kept until the very end.",
        "复导数由与实导数相同的商定义，只是 $h$ 是复数，从各个方向趋于零。导数存在时，熟悉的法则都成立：幂、和、积、链式法则都适用。所以多项式的导数可以照常计算再代入求值，复数运算留到最后进行。",
      ],
      (rng) => {
        const a = rng.int(-4, 5);
        const b = rng.pick([-3, -2, -1, 1, 2, 3, 4]);
        const c = rng.int(2, 7);
        const asksReal = rng.bool();
        const [u, v] = [3 * (a * a - b * b) + c, 6 * a * b];
        return ask(
          [
            `Let $f(z) = z^3 + ${c}z$. What is the ${asksReal ? "real" : "imaginary"} part of $f'(${complex(a, b)})$?`,
            `设 $f(z) = z^3 + ${c}z$。$f'(${complex(a, b)})$ 的${asksReal ? "实部" : "虚部"}是多少？`,
          ],
          asksReal ? u : v,
          asksReal ? [3 * (a * a + b * b) + c, u - c, v, u + 1] : [u, 3 * a * b, 2 * a * b, v + 1],
          [
            `$f'(z) = 3z^2 + ${c}$, and $(${complex(a, b)})^2 = ${complex(a * a - b * b, 2 * a * b)}$, so $f' = ${complex(u, v)}$.`,
            `$f'(z) = 3z^2 + ${c}$，而 $(${complex(a, b)})^2 = ${complex(a * a - b * b, 2 * a * b)}$，所以 $f' = ${complex(u, v)}$。`,
          ],
        );
      },
    ),
    {
      ...point(
        "the-conjugate-has-no-derivative",
        ["The conjugate has no derivative", "共轭没有导数"],
        [
          "The conjugate function looks simple, and it is continuous everywhere, yet it has no derivative at any point. Along a real $h$ the difference quotient $\\frac{\\overline{h}}{h}$ is $1$, and along an imaginary $h$ it is $-1$. These differ, so the limit fails. Complex differentiability is thus far stronger than its real counterpart: the smooth real map that reflects the plane is not complex differentiable.",
          "共轭函数看起来很简单，处处连续，却在任何一点都没有导数。沿实的 $h$，差商 $\\frac{\\overline{h}}{h}$ 是 $1$；沿虚的 $h$，差商是 $-1$。两者不同，所以极限不存在。因此复可导比实可导强得多：把平面反射的光滑实映射并不是复可导的。",
        ],
        (rng) => {
          const c = rng.int(2, 19);
          const real = rng.bool();
          const answer = real ? c : -c;
          const h = real ? "t" : "it";
          return ask(
            [
              `Let $f(z) = ${c}\\bar{z}$. For real $t \\ne 0$, what is the difference quotient $\\frac{f(z + ${h}) - f(z)}{${h}}$?`,
              `设 $f(z) = ${c}\\bar{z}$。对实数 $t \\ne 0$，差商 $\\frac{f(z + ${h}) - f(z)}{${h}}$ 是多少？`,
            ],
            answer,
            [-answer, 0, 1, c + 1],
            [
              real
                ? `The conjugate of $t$ is $t$, so the quotient is $\\frac{${c}t}{t} = ${c}$.`
                : `The conjugate of $it$ is $-it$, so the quotient is $\\frac{-${c}it}{it} = -${c}$.`,
              real
                ? `$t$ 的共轭是 $t$，所以商是 $\\frac{${c}t}{t} = ${c}$。`
                : `$it$ 的共轭是 $-it$，所以商是 $\\frac{-${c}it}{it} = -${c}$。`,
            ],
          );
        },
      ),
      figure: complexDrawings1["the-complex-derivative#the-conjugate-has-no-derivative"],
    },
  ],
);

const cauchyRiemann = topic(
  "the-cauchy-riemann-equations",
  ["The Cauchy–Riemann Equations", "柯西–黎曼方程"],
  ["Test analyticity through partial derivatives, and compute derivatives from them.", "用偏导数检验解析性，并由它们计算导数。"],
  ["the-complex-derivative", "computing-partial-derivatives-using-the-rules-of-differentiation"],
  [["the-complex-derivative", 0.4]],
  [
    point(
      "choosing-a-constant-for-the-equations",
      ["Choosing a constant", "选择常数"],
      [
        "Approaching along the real and imaginary directions and comparing gives the Cauchy–Riemann equations: $u_x = v_y$ and $u_y = -v_x$. Together with continuity of the partial derivatives, these are exactly the conditions for the function to be complex differentiable. They link $u$ and $v$ tightly, so that one nearly determines the other.",
        "沿实方向和虚方向趋近并比较，就得到柯西–黎曼方程：$u_x = v_y$，$u_y = -v_x$。加上偏导数连续，这些正是函数复可导的条件。它们把 $u$ 和 $v$ 紧密联系在一起，一个几乎决定了另一个。",
      ],
      (rng) => {
        const p = rng.int(2, 20);
        const q = rng.int(1, 9);
        return ask(
          [`For which $k$ is $f = ${p}(x^2 - y^2) + ${q} + ikxy$ analytic?`, `当 $k$ 为何值时，$f = ${p}(x^2 - y^2) + ${q} + ikxy$ 解析？`],
          2 * p,
          [p, -2 * p, 4 * p, 2],
          [
            `$u_x = ${2 * p}x$ and $v_y = kx$ must be equal, so $k = ${2 * p}$. Then $u_y = -${2 * p}y$ and $-v_x = -${2 * p}y$ also agree.`,
            `$u_x = ${2 * p}x$ 与 $v_y = kx$ 必须相等，所以 $k = ${2 * p}$。此时 $u_y = -${2 * p}y$ 与 $-v_x = -${2 * p}y$ 也一致。`,
          ],
        );
      },
    ),
    point(
      "a-derivative-from-partials",
      ["A derivative from partial derivatives", "由偏导数求导数"],
      [
        "When a function is analytic, its derivative can be read from the partial derivatives: it equals $u_x + iv_x$. So differentiation in the complex sense can be carried out with real partial derivatives alone. Using the $y$ derivatives instead gives the same value, because of the equations, and comparing both ways makes a good check.",
        "函数解析时，它的导数可以从偏导数读出：它等于 $u_x + iv_x$。所以复意义下的求导只用实的偏导数就能完成。根据方程，改用对 $y$ 的偏导会得到相同的值，比较两种算法是很好的检验。",
      ],
      (rng) => {
        const p = rng.int(1, 6);
        const a = rng.int(-6, 6);
        const b = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const asksReal = rng.bool();
        const u = p === 1 ? "x^2 - y^2" : `${p}(x^2 - y^2)`;
        const v = `${2 * p}xy`;
        return ask(
          [
            `Let $u = ${u}$ and $v = ${v}$. What is the ${asksReal ? "real" : "imaginary"} part of $f'$ at $${complex(a, b)}$?`,
            `设 $u = ${u}$，$v = ${v}$。$f'$ 在 $${complex(a, b)}$ 处的${asksReal ? "实部" : "虚部"}是多少？`,
          ],
          asksReal ? 2 * p * a : 2 * p * b,
          [asksReal ? 2 * p * b : 2 * p * a, asksReal ? a : b, asksReal ? p * a : p * b, asksReal ? -2 * p * b : -2 * p * a],
          [
            `$f' = u_x + iv_x = ${2 * p}x + i(${2 * p}y)$, and at this point that is $${complex(2 * p * a, 2 * p * b)}$.`,
            `$f' = u_x + iv_x = ${2 * p}x + i(${2 * p}y)$，在这一点它等于 $${complex(2 * p * a, 2 * p * b)}$。`,
          ],
        );
      },
    ),
  ],
);

const harmonic = topic(
  "harmonic-functions-and-conjugates",
  ["Harmonic Functions and Conjugates", "调和函数和共轭调和函数"],
  ["Recognize harmonic functions, and recover the imaginary part from the real part.", "识别调和函数，并由实部求虚部。"],
  ["the-cauchy-riemann-equations", "higher-order-partial-derivatives"],
  [["the-cauchy-riemann-equations", 0.4]],
  [
    point(
      "making-a-function-harmonic",
      ["Making a function harmonic", "使函数调和"],
      [
        "A function $u$ is harmonic when $u_{xx} + u_{yy} = 0$. The real and imaginary parts of an analytic function are always harmonic, which follows by differentiating the Cauchy–Riemann equations once more and using the equality of mixed partial derivatives. So a function that is not harmonic cannot be the real part of an analytic function, and this gives a quick test.",
        "如果 $u_{xx} + u_{yy} = 0$，函数 $u$ 就是调和的。解析函数的实部和虚部总是调和的，把柯西–黎曼方程再求一次导，并用混合偏导相等，就能得到这一点。所以不调和的函数不可能是解析函数的实部，这是一个快速的检验。",
      ],
      (rng) => {
        const p = rng.int(1, 9);
        const q = rng.int(1, 9);
        const r = rng.int(-9, 9);
        const px = coefficient(p, "x^2");
        const middle = r === 0 ? "" : r > 0 ? ` + ${coefficient(r, "xy")}` : ` - ${coefficient(-r, "xy")}`;
        const answer = -p;
        const linear = coefficient(q, "x");
        return ask(
          [
            `For which $k$ is $u = ${px} + ky^2${middle} + ${linear}$ harmonic?`,
            `当 $k$ 为何值时，$u = ${px} + ky^2${middle} + ${linear}$ 是调和函数？`,
          ],
          answer,
          [p, -2 * p, r === answer ? answer - 1 : r, q],
          [
            `$u_{xx} = ${2 * p}$ and $u_{yy} = 2k$, and they must add to 0, so $k = ${answer}$. The other terms have no second derivatives that matter here.`,
            `$u_{xx} = ${2 * p}$，$u_{yy} = 2k$，它们的和必须为 0，所以 $k = ${answer}$。其他项对这里的二阶偏导没有影响。`,
          ],
        );
      },
    ),
    point(
      "finding-a-harmonic-conjugate",
      ["Finding a harmonic conjugate", "求共轭调和函数"],
      [
        "A harmonic conjugate of $u$ is a function $v$ that makes $u + iv$ analytic. It is found by integrating the Cauchy–Riemann equations, and it is unique up to an added constant. For a linear function $ax + by$, the conjugate is $ay - bx$, corresponding to multiplying $z$ by the constant $a - bi$. A value at one point then fixes the constant.",
        "$u$ 的共轭调和函数是使 $u + iv$ 解析的函数 $v$。它通过积分柯西–黎曼方程得到，并且除了相差一个常数外是唯一的。对线性函数 $ax + by$，共轭函数是 $ay - bx$，对应于用常数 $a - bi$ 乘 $z$。再给定一点的值，就能确定这个常数。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const x0 = rng.int(-4, 5);
        const y0 = rng.int(-4, 5);
        const answer = a * y0 - b * x0;
        return ask(
          [
            `Let $u = ${a}x + ${b}y$, with harmonic conjugate $v$ and $v(0, 0) = 0$. What is $v(${x0}, ${y0})$?`,
            `设 $u = ${a}x + ${b}y$，它的共轭调和函数 $v$ 满足 $v(0, 0) = 0$。$v(${x0}, ${y0})$ 是多少？`,
          ],
          answer,
          [a * x0 + b * y0, b * x0 - a * y0, a * y0 + b * x0, answer + 1],
          [
            `$v_y = u_x = ${a}$ and $v_x = -u_y = -${b}$, so $v = ${a}y - ${b}x$, which gives $${answer}$ at this point.`,
            `$v_y = u_x = ${a}$，$v_x = -u_y = -${b}$，所以 $v = ${a}y - ${b}x$，在这一点的值是 $${answer}$。`,
          ],
        );
      },
    ),
  ],
);

const complexExponential = topic(
  "the-complex-exponential-function",
  ["The Complex Exponential Function", "复指数函数"],
  ["Evaluate the exponential at complex points, and use its period.", "在复数点计算指数函数，并利用它的周期。"],
  ["eulers-formula", "the-complex-derivative"],
  [["eulers-formula", 0.5]],
  [
    {
      ...point(
        "evaluating-the-exponential",
        ["Evaluating the exponential", "计算指数函数"],
        [
          "The exponential of $x + iy$ is $e^x(\\cos y + i\\sin y)$. Its modulus is $e^x$, set by the real part, and its argument is $y$, set by the imaginary part. So the exponential turns horizontal lines into rays and vertical lines into circles, and it is never zero, because its modulus is always positive.",
          "$x + iy$ 的指数函数是 $e^x(\\cos y + i\\sin y)$。它的模是 $e^x$，由实部决定；它的辐角是 $y$，由虚部决定。所以指数函数把水平线变成射线，把竖直线变成圆，而且它从不为零，因为模总是正的。",
        ],
        (rng) => {
          const r = rng.int(2, 15);
          const half = rng.bool();
          const multiple = half ? rng.pick([-5, -3, -1, 1, 3, 5]) : rng.pick([-6, -4, -2, 2, 4, 6]);
          const size = Math.abs(multiple) === 1 ? "" : `${Math.abs(multiple)}`;
          const exponent = `\\ln ${r} ${multiple < 0 ? "-" : "+"} ${size}\\pi i`;
          const answer = half ? -r : r;
          return ask(
            [`What is the value of $e^{${exponent}}$?`, `$e^{${exponent}}$ 的值是多少？`],
            answer,
            [-answer, 1, r + 1, half ? r - 1 : -r - 1],
            [
              `The modulus is $e^{\\ln ${r}} = ${r}$, and the angle is an ${half ? "odd" : "even"} multiple of $\\pi$, so the value is $${answer}$.`,
              `模是 $e^{\\ln ${r}} = ${r}$，角是 $\\pi$ 的${half ? "奇数" : "偶数"}倍，所以值是 $${answer}$。`,
            ],
          );
        },
      ),
      figure: complexDrawings1["the-complex-exponential-function#evaluating-the-exponential"],
    },
    point(
      "the-period-of-the-exponential",
      ["The period of the exponential", "指数函数的周期"],
      [
        "Unlike its real counterpart, the complex exponential is periodic, with period $2\\pi i$. Adding this to $z$ leaves the value unchanged, so the equation asking for a given value has infinitely many solutions, spaced along a vertical line. This failure of injectivity is the source of all the difficulty with complex logarithms, and of the need to choose a branch for them.",
        "与实指数函数不同，复指数函数是周期函数，周期是 $2\\pi i$。把它加到 $z$ 上，值不变，所以求给定值的方程有无穷多个解，沿一条竖直线排列。这种不是单射的性质，正是复对数所有困难的来源，也是需要选择分支的原因。",
      ],
      (rng) => {
        const a = rng.int(1, 9);
        const b = rng.int(2, 9);
        const k = rng.pick([2, 3, 4, 5, 6]);
        const correct = same(`${a} + ${b}i + ${2 * k}\\pi i`);
        return choose(
          rng,
          [`Which of these has the same exponential as $${a} + ${b}i$?`, `下列哪个数的指数函数值与 $${a} + ${b}i$ 相同？`],
          correct,
          [same(`${a} + ${b}i + ${2 * k - 1}\\pi i`), same(`${a + 2 * k}\\pi + ${b}i`), same(`${a} + ${b}i + ${k}\\pi`)],
          [
            `$${2 * k}\\pi i$ is a whole multiple of the period $2\\pi i$, so adding it leaves the exponential unchanged. The other changes alter the angle or the modulus.`,
            `$${2 * k}\\pi i$ 是周期 $2\\pi i$ 的整数倍，所以加上它不改变指数函数值。其他改动会改变角或模。`,
          ],
        );
      },
    ),
  ],
);

const complexLog = topic(
  "the-complex-logarithm",
  ["The Complex Logarithm", "复对数"],
  ["Find the principal logarithm, and see why it needs a branch.", "求主值对数，并了解为什么需要分支。"],
  ["the-complex-exponential-function"],
  [],
  [
    point(
      "the-principal-argument-in-a-logarithm",
      ["The imaginary part of the logarithm", "对数的虚部"],
      [
        "The logarithm of $z$ is the natural logarithm of its modulus plus $i$ times its argument: $\\log z = \\ln|z| + i\\arg z$. Because the argument has many values, a single choice must be made, and the principal logarithm takes the argument above $-\\pi$ up to $\\pi$. This makes the function discontinuous across the negative real axis, called the branch cut, where the argument jumps from $\\pi$ to values near $-\\pi$.",
        "$z$ 的对数是它的模的自然对数加 $i$ 乘它的辐角：$\\log z = \\ln|z| + i\\arg z$。由于辐角有多个值，必须作出选择，主值对数取大于 $-\\pi$ 且不超过 $\\pi$ 的辐角。这使函数在负实轴上不连续，负实轴称为分支割线，辐角在那里从 $\\pi$ 跳到接近 $-\\pi$ 的值。",
      ],
      (rng) => {
        const a = rng.int(1, 30);
        const [sx, sy] = rng.pick([
          [1, 1],
          [-1, 1],
          [1, -1],
          [-1, -1],
          [0, 1],
          [0, -1],
          [-1, 0],
        ]) as [number, number];
        const answer = Q.of(sx === 1 ? (sy === 1 ? 1 : -1) : sx === -1 ? (sy === 1 ? 3 : sy === -1 ? -3 : 4) : sy === 1 ? 2 : -2, 4);
        const value = complex(sx * a, sy * a);
        return ask(
          [
            `The imaginary part of the principal logarithm of $${value}$ is $k\\pi$. What is $k$?`,
            `$${value}$ 的主值对数的虚部是 $k\\pi$。$k$ 是多少？`,
          ],
          answer,
          [answer.add(Q.of(2)), answer.mul(Q.of(-1)), answer.add(Q.of(1, 2)), Q.of(a)],
          [
            `The point lies at angle $${answer.toLatex()}\\pi$ measured within the principal range, and its distance from the origin does not affect the angle.`,
            `这个点的角在主值范围内是 $${answer.toLatex()}\\pi$，它到原点的距离不影响这个角。`,
          ],
        );
      },
    ),
    point(
      "the-real-part-of-the-logarithm",
      ["The real part of the logarithm", "对数的实部"],
      [
        "The real part of $\\log z$ is $\\ln |z|$, and it is the same for every branch. Branches differ only by multiples of $2\\pi i$. So the real part of the logarithm is a function on the punctured plane with no ambiguity, and it is harmonic, as the real part of an analytic function always is, wherever a branch exists.",
        "$\\log z$ 的实部是 $\\ln |z|$，对每个分支都相同。不同分支只相差 $2\\pi i$ 的倍数。所以对数的实部是去掉原点的平面上没有歧义的函数；并且和解析函数的实部一样，凡是存在分支的地方，它都是调和的。",
      ],
      (rng) => {
        const s = rng.int(1, 4);
        const { a, b, r } = signedTriple(rng);
        const answer = s * r;
        return ask(
          [
            `The real part of the logarithm of $${complex(s * a, s * b)}$ equals $\\ln m$. What is $m$?`,
            `$${complex(s * a, s * b)}$ 的对数的实部等于 $\\ln m$。$m$ 是多少？`,
          ],
          answer,
          [s * (Math.abs(a) + Math.abs(b)), answer * answer, s * Math.abs(a), answer + 1],
          [
            `The modulus is $\\sqrt{${s * a * (s * a)} + ${s * b * (s * b)}} = ${answer}$, so the real part is $\\ln ${answer}$.`,
            `模是 $\\sqrt{${s * a * (s * a)} + ${s * b * (s * b)}} = ${answer}$，所以实部是 $\\ln ${answer}$。`,
          ],
        );
      },
    ),
  ],
);

const contourIntegrals = topic(
  "contour-integrals",
  ["Contour Integrals", "围道积分"],
  ["Integrate along a path by parametrizing it.", "把路径参数化后沿路径积分。"],
  ["the-complex-derivative", "line-integrals-of-scalar-functions"],
  [],
  [
    {
      ...point(
        "the-conjugate-around-a-circle",
        ["The conjugate around a circle", "共轭沿圆周积分"],
        [
          "A contour integral is computed by parametrizing the path, so that $z$ and $dz$ are written in terms of a real variable, and then integrating over its range. Around a circle of radius $r$ centred at zero, $z = re^{it}$. For the conjugate $\\bar{z}$, the two exponentials cancel, leaving a constant integrand, and the result grows with the square of the radius.",
          "围道积分通过把路径参数化来计算，把 $z$ 和 $dz$ 都用实变量表示，再在其范围内积分。沿以零为中心、半径为 $r$ 的圆周，$z = re^{it}$。对共轭 $\\bar{z}$，两个指数相消，被积函数成了常数，结果随半径的平方增长。",
        ],
        (rng) => {
          const r = rng.int(2, 13);
          const c = rng.int(2, 10);
          const answer = 2 * c * r * r;
          const integrand = c === 1 ? "\\bar{z}" : `${c}\\bar{z}`;
          return ask(
            [
              `The integral of $${integrand}$ once counterclockwise around $|z| = ${r}$ is $k\\pi i$. What is $k$?`,
              `$${integrand}$ 沿 $|z| = ${r}$ 逆时针积分一周的结果是 $k\\pi i$。$k$ 是多少？`,
            ],
            answer,
            [2 * c * r, c * r * r, 0, answer + 2],
            [
              `With $z = ${r}e^{it}$ we get $\\bar{z}\\,dz = ${r * r}i\\,dt$. Integrating over a full turn and multiplying by ${c} gives $${answer}\\pi i$.`,
              `取 $z = ${r}e^{it}$，得 $\\bar{z}\\,dz = ${r * r}i\\,dt$。在一整圈上积分并乘以 ${c}，得 $${answer}\\pi i$。`,
            ],
          );
        },
      ),
      figure: complexDrawings1["contour-integrals#the-conjugate-around-a-circle"],
    },
    point(
      "integrating-along-a-segment",
      ["Integrating along a segment", "沿线段积分"],
      [
        "For a segment from one point to another, a parametrization is the starting point plus $t$ times the difference, with $t$ from zero to one. The integral of $z$ along a segment comes to half the difference of the squares of the end points. That the answer depends only on the ends is a first sign of the theorem to come, as $z$ has an antiderivative.",
        "对从一点到另一点的线段，参数化为起点加 $t$ 乘差，$t$ 从 0 到 1。$z$ 沿线段的积分是端点平方之差的一半。答案只取决于端点，这是后面定理的第一个迹象，因为 $z$ 有原函数。",
      ],
      (rng) => {
        const a = rng.nonZero(-6, 6);
        const b = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4].filter((v) => Math.abs(v) !== Math.abs(a)));
        const asksReal = rng.bool();
        const u = a * a - b * b;
        const v = 2 * a * b;
        const answer = asksReal ? Q.of(u, 2) : Q.of(v, 2);
        return ask(
          [
            `What is the ${asksReal ? "real" : "imaginary"} part of the integral of $z$ along the segment from 0 to $${complex(a, b)}$?`,
            `$z$ 沿从 0 到 $${complex(a, b)}$ 的线段积分，结果的${asksReal ? "实部" : "虚部"}是多少？`,
          ],
          answer,
          [Q.of(asksReal ? u : v), Q.of(asksReal ? a * a + b * b : -v, 2), Q.of(asksReal ? v : u, 2), answer.add(Q.of(1))],
          [
            `An antiderivative is $\\frac{z^2}{2}$, and $(${complex(a, b)})^2 = ${complex(u, v)}$, so the part asked for is $${answer.toLatex()}$.`,
            `原函数是 $\\frac{z^2}{2}$，而 $(${complex(a, b)})^2 = ${complex(u, v)}$，所以所求的部分是 $${answer.toLatex()}$。`,
          ],
        );
      },
    ),
  ],
);

const cauchyTheorem = topic(
  "cauchys-integral-theorem",
  ["Cauchy's Integral Theorem", "柯西积分定理"],
  ["Decide whether a closed contour integral vanishes, and use antiderivatives.", "判断闭围道积分是否为零，并使用原函数。"],
  ["contour-integrals"],
  [["contour-integrals", 0.3]],
  [
    {
      ...point(
        "whether-a-pole-is-enclosed",
        ["Whether a pole is enclosed", "极点是否被包围"],
        [
          "Cauchy's theorem says that the integral of an analytic function around a closed path vanishes when the function is analytic on and inside the path. For $\\frac{c}{z - a}$ around a circle, everything depends on where $a$ lies. If $a$ is outside, the function is analytic inside and the integral is zero. If $a$ is inside, the integral is $2\\pi i c$.",
          "柯西定理说，如果函数在闭路径上及其内部解析，那么它沿这条路径的积分为零。对 $\\frac{c}{z - a}$ 沿圆周的积分，一切取决于 $a$ 的位置。如果 $a$ 在外面，函数在内部解析，积分为零。如果 $a$ 在里面，积分是 $2\\pi i c$。",
        ],
        (rng) => {
          const c = rng.int(1, 12);
          const r = rng.int(2, 9);
          const inside = rng.bool();
          const a = inside ? rng.int(-(r - 1), r - 1) : rng.pick([r + rng.int(1, 5), -r - rng.int(1, 5)]);
          const answer = inside ? 2 * c : 0;
          return ask(
            [
              `The integral of $\\frac{${c}}{${minus("z", a)}}$ once counterclockwise around $|z| = ${r}$ is $k\\pi i$. What is $k$?`,
              `$\\frac{${c}}{${minus("z", a)}}$ 沿 $|z| = ${r}$ 逆时针积分一周的结果是 $k\\pi i$。$k$ 是多少？`,
            ],
            answer,
            [inside ? 0 : 2 * c, c === 0 ? 1 : c, 2 * r, 2 * c + 2],
            [
              inside
                ? `$${a}$ is inside the circle, so the pole is enclosed and the integral is $2\\pi i \\times ${c}$.`
                : `$${a}$ is outside the circle, so the function is analytic on and inside the path, and the integral is 0.`,
              inside
                ? `$${a}$ 在圆内，极点被包围，所以积分是 $2\\pi i \\times ${c}$。`
                : `$${a}$ 在圆外，函数在路径上及其内部解析，所以积分是 0。`,
            ],
          );
        },
      ),
      figure: complexDrawings1["cauchys-integral-theorem#whether-a-pole-is-enclosed"],
    },
    point(
      "using-an-antiderivative",
      ["Using an antiderivative", "使用原函数"],
      [
        "When an analytic function has an antiderivative on a simply connected region, the integral along any path depends only on the end points, and it equals the difference of the antiderivative there. This is the complex fundamental theorem of calculus. It gives results at once for polynomials and exponentials, with no parametrization, and it fails for $\\frac{1}{z}$ around the origin, since no single-valued antiderivative exists there.",
        "解析函数在单连通区域上有原函数时，沿任何路径的积分只取决于端点，等于原函数在端点的差。这就是复的微积分基本定理。它使多项式和指数函数的结果立刻可得，不需要参数化；对原点周围的 $\\frac{1}{z}$ 它就不成立了，因为那里没有单值的原函数。",
      ],
      (rng) => {
        const p = rng.int(1, 5);
        const c = rng.int(1, 9);
        const a = rng.int(-5, 4);
        const b = a + rng.int(1, 6);
        const answer = p * (b * b - a * a) + c * (b - a);
        const f = `${2 * p === 1 ? "" : 2 * p}z + ${c}`;
        return ask(
          [
            `The integral of $${f}$ along any path from $${a}$ to $${b}$ has what value?`,
            `$${f}$ 沿从 $${a}$ 到 $${b}$ 的任何路径积分，结果是多少？`,
          ],
          answer,
          [2 * p * (b - a) + c, answer + c, p * (b * b + a * a) + c * (b - a), 0],
          [
            `An antiderivative is $F(z) = ${p === 1 ? "" : p}z^2 + ${coefficient(c, "z")}$, and $F(${b}) - F(${a}) = ${answer}$.`,
            `原函数是 $F(z) = ${p === 1 ? "" : p}z^2 + ${coefficient(c, "z")}$，而 $F(${b}) - F(${a}) = ${answer}$。`,
          ],
        );
      },
    ),
  ],
);

const cauchyFormula = topic(
  "cauchys-integral-formula",
  ["Cauchy's Integral Formula", "柯西积分公式"],
  ["Recover values and derivatives of an analytic function from a contour integral.", "由围道积分求解析函数的值和导数。"],
  ["cauchys-integral-theorem"],
  [["cauchys-integral-theorem", 0.6]],
  [
    point(
      "the-value-from-the-formula",
      ["The value from the formula", "由公式得到函数值"],
      [
        "Cauchy's integral formula says that the integral of $\\frac{f(z)}{z - a}$, around a contour enclosing $a$, is $2\\pi i f(a)$. So the values of an analytic function inside a contour are fixed by its values on the contour. No real function behaves like this, and the formula is the source of almost every strong property of analytic functions.",
        "柯西积分公式说，$\\frac{f(z)}{z - a}$ 沿包围 $a$ 的围道积分，等于 $2\\pi i f(a)$。所以解析函数在围道内部的值由它在围道上的值决定。实函数没有这样的性质，这个公式几乎是解析函数所有强性质的来源。",
      ],
      (rng) => {
        const a = rng.pick([-3, -2, -1, 1, 2, 3]);
        const p = rng.int(1, 5);
        const q = rng.int(-6, 6);
        const value = p * a * a + q;
        const f = `${coefficient(p, "z^2")}${q === 0 ? "" : q > 0 ? ` + ${q}` : ` - ${-q}`}`;
        return ask(
          [
            `The integral of $\\frac{${f}}{${minus("z", a)}}$ once counterclockwise around $|z| = 5$ is $k\\pi i$. What is $k$?`,
            `$\\frac{${f}}{${minus("z", a)}}$ 沿 $|z| = 5$ 逆时针积分一周的结果是 $k\\pi i$。$k$ 是多少？`,
          ],
          2 * value,
          [value, 2 * value + 2, 2 * a, value - q],
          [
            `The formula gives $2\\pi i f(${a})$, with $f(${a}) = ${value}$, so $k = ${2 * value}$.`,
            `公式给出 $2\\pi i f(${a})$，其中 $f(${a}) = ${value}$，所以 $k = ${2 * value}$。`,
          ],
        );
      },
    ),
    point(
      "a-derivative-from-the-formula",
      ["A derivative from the formula", "由公式得到导数"],
      [
        "Differentiating under the integral sign extends the formula to derivatives: the integral of $\\frac{f(z)}{(z - a)^2}$ is $2\\pi i$ times the derivative $f'(a)$, and higher powers bring higher derivatives with a factorial. Thus an analytic function has derivatives of all orders. A function differentiable once in the complex sense is differentiable infinitely often, unlike any real result.",
        "在积分号下求导，把公式推广到导数：$\\frac{f(z)}{(z - a)^2}$ 的积分，等于 $2\\pi i$ 乘导数 $f'(a)$；更高的幂给出更高阶导数，并带有阶乘。因此解析函数有任意阶导数。复意义下可导一次的函数可以无限次求导，这与任何实的结果都不同。",
      ],
      (rng) => {
        const a = rng.pick([-3, -2, -1, 1, 2, 3]);
        const p = rng.int(1, 4);
        const q = rng.int(1, 9);
        const derivative = 3 * p * a * a + q;
        return ask(
          [
            `The integral of $\\frac{${coefficient(p, "z^3")} + ${q}z}{(${minus("z", a)})^2}$ once counterclockwise around $|z| = 5$ is $k\\pi i$. What is $k$?`,
            `$\\frac{${coefficient(p, "z^3")} + ${q}z}{(${minus("z", a)})^2}$ 沿 $|z| = 5$ 逆时针积分一周的结果是 $k\\pi i$。$k$ 是多少？`,
          ],
          2 * derivative,
          [derivative, 2 * (p * a * a * a + q * a), 2 * derivative + 2, 4 * derivative],
          [
            `The value is $2\\pi i f'(${a})$. Here $f'(z) = ${3 * p}z^2 + ${q}$, so $f'(${a}) = ${derivative}$ and $k = ${2 * derivative}$.`,
            `结果是 $2\\pi i f'(${a})$。这里 $f'(z) = ${3 * p}z^2 + ${q}$，所以 $f'(${a}) = ${derivative}$，$k = ${2 * derivative}$。`,
          ],
        );
      },
    ),
  ],
);

const estimates = topic(
  "cauchys-estimates-and-liouvilles-theorem",
  ["Cauchy's Estimates and Liouville's Theorem", "柯西估计和刘维尔定理"],
  ["Bound derivatives from a bound on a circle, and find a maximum modulus.", "由圆周上的界估计导数，并求最大模。"],
  ["cauchys-integral-formula"],
  [],
  [
    {
      ...point(
        "a-cauchy-estimate",
        ["A Cauchy estimate", "柯西估计"],
        [
          "If an analytic function is bounded by $M$ on a circle of radius $r$ about a point, the $n$th derivative at that point is at most $\\frac{n!\\,M}{r^n}$. For an entire bounded function, $r$ may be taken as large as we like, so the first derivative vanishes everywhere and the function is constant. This is Liouville's theorem, and it quickly yields the fundamental theorem of algebra.",
          "如果解析函数在以某点为中心、半径为 $r$ 的圆周上不超过 $M$，那么在这一点的 $n$ 阶导数至多是 $\\frac{n!\\,M}{r^n}$。对有界整函数，$r$ 可以任意大，所以一阶导数处处为零，函数是常数。这就是刘维尔定理，由它很快能得到代数基本定理。",
        ],
        (rng) => {
          const M = rng.int(2, 30);
          const r = rng.int(2, 6);
          const n = rng.int(1, 3);
          const fact = [1, 1, 2, 6][n] as number;
          const power = n === 1 ? `${r}` : `${r}^{${n}}`;
          const answer = Q.of(fact * M, r ** n);
          return ask(
            [
              `Suppose $|f(z)| \\le ${M}$ on the circle of radius ${r} about $a$, with $f$ analytic on and inside it. What bound does Cauchy's estimate give for $|f${"'".repeat(n)}(a)|$?`,
              `设在以 $a$ 为中心、半径为 ${r} 的圆周上 $|f(z)| \\le ${M}$，且 $f$ 在圆周上及其内部解析。柯西估计给出的 $|f${"'".repeat(n)}(a)|$ 的界是多少？`,
            ],
            answer,
            [Q.of(M, r ** n), Q.of(fact * M, r), Q.of(fact * M * r), answer.add(Q.of(1))],
            [
              `The estimate is $\\frac{${n}! \\times ${M}}{${power}} = ${answer.toLatex()}$.`,
              `估计式是 $\\frac{${n}! \\times ${M}}{${power}} = ${answer.toLatex()}$。`,
            ],
          );
        },
      ),
      figure: complexDrawings1["cauchys-estimates-and-liouvilles-theorem#a-cauchy-estimate"],
    },
    {
      ...point(
        "the-maximum-modulus",
        ["The maximum modulus", "最大模"],
        [
          "The maximum modulus principle says that a nonconstant analytic function on a bounded region reaches its largest modulus only on the boundary. So finding the maximum means looking at the boundary circle. For $z^2$ plus a positive constant on a disc, the triangle inequality gives an upper bound, and a positive real point on the circle attains it, so this bound is exact.",
          "最大模原理说，有界区域上非常数的解析函数只在边界上达到最大模。所以求最大值就是看边界圆周。对圆盘上的 $z^2$ 加正常数，三角不等式给出上界，而圆周上的正实数点可以达到它，所以这个界是准确的。",
        ],
        (rng) => {
          const r = rng.int(2, 12);
          const c = rng.int(1, 30);
          const answer = r * r + c;
          return ask(
            [
              `What is the maximum of $|z^2 + ${c}|$ on the disc $|z| \\le ${r}$?`,
              `$|z^2 + ${c}|$ 在圆盘 $|z| \\le ${r}$ 上的最大值是多少？`,
            ],
            answer,
            [r + c, r * r, Math.abs(r * r - c) === answer ? answer + 1 : Math.abs(r * r - c), answer + r],
            [
              `On the boundary, $|z^2 + ${c}| \\le ${r * r} + ${c}$, and $z = ${r}$ attains this, so the maximum is ${answer}.`,
              `在边界上，$|z^2 + ${c}| \\le ${r * r} + ${c}$，$z = ${r}$ 能达到它，所以最大值是 ${answer}。`,
            ],
          );
        },
      ),
      figure: complexDrawings1["cauchys-estimates-and-liouvilles-theorem#the-maximum-modulus"],
    },
  ],
);

const taylorComplex = topic(
  "taylor-series-of-analytic-functions",
  ["Taylor Series of Analytic Functions", "解析函数的泰勒级数"],
  ["Find the radius of convergence from the nearest singularity, and read off coefficients.", "由最近的奇点求收敛半径，并读出系数。"],
  ["cauchys-integral-formula", "taylor-series"],
  [["taylor-series", 0.3]],
  [
    point(
      "the-radius-from-the-nearest-singularity",
      ["The radius from the nearest singularity", "由最近奇点得半径"],
      [
        "An analytic function equals its Taylor series on the largest disc around the centre that avoids its singularities. So the radius of convergence is the distance from the centre to the nearest singularity, with no test needed. This explains a puzzle from real calculus: $\\frac{1}{1 + x^2}$ is smooth on the real line, yet its series has radius one, because of singularities at $i$ and $-i$.",
        "解析函数在以中心为圆心、不包含奇点的最大圆盘上等于它的泰勒级数。所以收敛半径就是中心到最近奇点的距离，不需要任何判别法。这解释了实微积分中的一个谜题：$\\frac{1}{1 + x^2}$ 在实数线上是光滑的，但它的级数半径是 1，因为 $i$ 和 $-i$ 处有奇点。",
      ],
      (rng) => {
        const { a, b, r } = signedTriple(rng);
        const x = rng.int(-6, 6);
        const y = rng.int(-6, 6);
        const pole = complex(x + a, y + b);
        const below = y + b === 0 ? minus("z", x + a) : `z - (${pole})`;
        return ask(
          [
            `What is the radius of convergence of the Taylor series of $\\frac{1}{${below}}$ about $${complex(x, y)}$?`,
            `$\\frac{1}{${below}}$ 在 $${complex(x, y)}$ 处的泰勒级数的收敛半径是多少？`,
          ],
          r,
          [Math.abs(a) + Math.abs(b), r * r, Math.abs(a), r + 1],
          [
            `The only singularity is at $${pole}$, at distance $\\sqrt{${a * a} + ${b * b}} = ${r}$ from the centre.`,
            `唯一的奇点在 $${pole}$，它到中心的距离是 $\\sqrt{${a * a} + ${b * b}} = ${r}$。`,
          ],
        );
      },
    ),
    point(
      "a-coefficient-from-a-geometric-series",
      ["A coefficient from a geometric series", "由几何级数得系数"],
      [
        "Many Taylor series come from the geometric series, without computing derivatives at all. $\\frac{1}{a - z}$ equals $\\frac{1}{a}$ times the sum of powers of $\\frac{z}{a}$, for $|z| < |a|$. Since a power series is unique, any way of obtaining the expansion gives the same coefficients, and manipulating known series is usually the shortest route.",
        "很多泰勒级数来自几何级数，根本不用计算导数。当 $|z| < |a|$ 时，$\\frac{1}{a - z}$ 等于 $\\frac{1}{a}$ 乘 $\\frac{z}{a}$ 的各次幂之和。因为幂级数是唯一的，任何得到展开式的方法给出的系数都相同，操作已知级数通常是最短的途径。",
      ],
      (rng) => {
        const a = rng.int(2, 7);
        const n = rng.int(2, 4);
        const c = rng.int(1, 9);
        const answer = Q.of(c, a ** (n + 1));
        return ask(
          [
            `What is the coefficient of $z^{${n}}$ in the Taylor series of $\\frac{${c}}{${a} - z}$ about 0?`,
            `$\\frac{${c}}{${a} - z}$ 在 0 处的泰勒级数中，$z^{${n}}$ 的系数是多少？`,
          ],
          answer,
          [Q.of(c, a ** n), Q.of(1, a ** (n + 1)), Q.of(c * a ** n), Q.of(c, a * (n + 1))],
          [
            `$\\frac{${c}}{${a} - z} = \\frac{${c}}{${a}} \\sum_k \\left(\\frac{z}{${a}}\\right)^k$, so the coefficient is $\\frac{${c}}{${a}^{${n + 1}}} = ${answer.toLatex()}$.`,
            `$\\frac{${c}}{${a} - z} = \\frac{${c}}{${a}} \\sum_k \\left(\\frac{z}{${a}}\\right)^k$，所以系数是 $\\frac{${c}}{${a}^{${n + 1}}} = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
  ],
);

const laurent = topic(
  "laurent-series",
  ["Laurent Series", "洛朗级数"],
  ["Expand around a singularity, and read the coefficient of the reciprocal term.", "在奇点处展开，并读出倒数项的系数。"],
  ["taylor-series-of-analytic-functions"],
  [["taylor-series-of-analytic-functions", 0.4]],
  [
    point(
      "a-coefficient-of-an-exponential-quotient",
      ["The exponential over a power", "指数除以幂"],
      [
        "A Laurent series extends a Taylor series by allowing negative powers, and it represents a function analytic on an annulus around a singularity. The easiest way to find one is to divide a known series. For $\\frac{e^{kz}}{z^n}$, shifting the powers of the exponential series down by $n$ gives the expansion, and the term in $\\frac{1}{z}$ comes from the power $n - 1$.",
        "洛朗级数通过允许负幂来推广泰勒级数，它表示在奇点周围的圆环上解析的函数。求它最简单的方法是用已知级数相除。对 $\\frac{e^{kz}}{z^n}$，把指数级数的幂下移 $n$，就得到展开式，$\\frac{1}{z}$ 项来自 $n - 1$ 次幂。",
      ],
      (rng) => {
        const k = rng.int(2, 6);
        const n = rng.int(3, 6);
        const fact = [1, 1, 2, 6, 24, 120][n - 1] as number;
        const c = rng.int(2, 7);
        const answer = Q.of(c * k ** (n - 1), fact);
        return ask(
          [
            `What is the coefficient of $\\frac{1}{z}$ in the Laurent series of $\\frac{${c}e^{${k}z}}{z^{${n}}}$ about 0?`,
            `$\\frac{${c}e^{${k}z}}{z^{${n}}}$ 在 0 处的洛朗级数中，$\\frac{1}{z}$ 的系数是多少？`,
          ],
          answer,
          [Q.of(c * k ** n, fact * n), Q.of(c * k ** (n - 1)), Q.of(k ** (n - 1), fact), answer.add(Q.of(1))],
          [
            `The term we need comes from $\\frac{(${k}z)^{${n - 1}}}{${n - 1}!}$ in the exponential series, so the coefficient is $${c} \\times \\frac{${k}^{${n - 1}}}{${n - 1}!} = ${answer.toLatex()}$.`,
            `所需的项来自指数级数中的 $\\frac{(${k}z)^{${n - 1}}}{${n - 1}!}$，所以系数是 $${c} \\times \\frac{${k}^{${n - 1}}}{${n - 1}!} = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "a-coefficient-of-a-rational-function",
      ["A rational function near a pole", "极点附近的有理函数"],
      [
        "The same function has different Laurent series on different annuli, so the region must be stated. For $\\frac{c}{z(z - a)}$ on the punctured disc $0 < |z| < |a|$, the factor $\\frac{1}{z - a}$ is analytic and has a geometric series. Multiplying through by $\\frac{c}{z}$ gives a single negative power, whose coefficient is the value of the other factor at zero.",
        "同一个函数在不同的圆环上有不同的洛朗级数，所以必须说明区域。对 $\\frac{c}{z(z - a)}$，在去心圆盘 $0 < |z| < |a|$ 上，因子 $\\frac{1}{z - a}$ 解析，有几何级数。乘上 $\\frac{c}{z}$，就只有一个负幂项，它的系数是另一个因子在零处的值。",
      ],
      (rng) => {
        const a = rng.pick([-9, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
        const c = rng.int(1, 12);
        const answer = Q.of(-c, a);
        return ask(
          [
            `For $0 < |z| < ${Math.abs(a)}$, what is the coefficient of $\\frac{1}{z}$ in the Laurent series of $\\frac{${c}}{z(${minus("z", a)})}$?`,
            `当 $0 < |z| < ${Math.abs(a)}$ 时，$\\frac{${c}}{z(${minus("z", a)})}$ 的洛朗级数中 $\\frac{1}{z}$ 的系数是多少？`,
          ],
          answer,
          [Q.of(c, a), Q.of(c), Q.of(-a, c), Q.of(1, a)],
          [
            `At $z = 0$ the factor $\\frac{${c}}{${minus("z", a)}}$ equals $${answer.toLatex()}$, and this is the coefficient.`,
            `在 $z = 0$ 处，因子 $\\frac{${c}}{${minus("z", a)}}$ 等于 $${answer.toLatex()}$，这就是系数。`,
          ],
        );
      },
    ),
  ],
);

const singularities = topic(
  "classifying-isolated-singularities",
  ["Classifying Isolated Singularities", "孤立奇点的分类"],
  ["Tell removable singularities, poles and essential singularities apart, and find orders.", "区分可去奇点、极点和本性奇点，并求阶数。"],
  ["laurent-series"],
  [["laurent-series", 0.3]],
  [
    point(
      "the-order-of-a-pole",
      ["The order of a pole", "极点的阶"],
      [
        "A pole of order $n$ at $a$ means that the function behaves like a nonzero constant over $(z - a)^n$. To read the order from a quotient, count how many times the factor vanishes in the denominator, and subtract any cancellation by the numerator. Other factors of the denominator do not count, since they do not vanish at that point.",
        "在 $a$ 处的 $n$ 阶极点，意味着函数的行为像一个非零常数除以 $(z - a)^n$。要从商中读出阶数，就数这个因子在分母中出现几次，再减去分子约掉的次数。分母的其他因子不算，因为它们在这一点不为零。",
      ],
      (rng) => {
        const a = rng.int(-5, 5);
        const b = a + rng.pick([-4, -3, -2, 2, 3, 4]);
        const n = rng.int(2, 7);
        const m = rng.int(1, 7);
        const k = rng.int(0, n - 1);
        const numerator = k === 0 ? "1" : k === 1 ? minus("z", a) : factor(a, k);
        const answer = n - k;
        return ask(
          [
            `What is the order of the pole of $\\frac{${numerator}}{${factor(a, n)}${factor(b, m)}}$ at $z = ${a}$?`,
            `$\\frac{${numerator}}{${factor(a, n)}${factor(b, m)}}$ 在 $z = ${a}$ 处极点的阶是多少？`,
          ],
          answer,
          [n, m === answer ? answer + 1 : m, n + m, n + k],
          [
            `The factor has power ${n} below and power ${k} above, which leaves order ${answer}. The other factor is not zero at $${a}$.`,
            `这个因子在分母中为零 ${n} 次，在分子中为零 ${k} 次，剩下的阶是 ${answer}。另一个因子在 $${a}$ 处不为零。`,
          ],
        );
      },
    ),
    point(
      "classifying-a-singularity",
      ["Classifying a singularity", "判断奇点类型"],
      [
        "An isolated singularity falls into one of three types, seen in the Laurent series. It is removable when there are no negative powers, and then the function extends analytically, as $\\frac{\\sin z}{z}$ does. It is a pole when there are finitely many negative powers, and essential when there are infinitely many, as with $e^{1/z}$, where the Casorati–Weierstrass theorem describes wild behaviour nearby.",
        "孤立奇点分为三种，可以从洛朗级数看出。没有负幂时是可去奇点，这时函数可以解析延拓，比如 $\\frac{\\sin z}{z}$。负幂有有限多个时是极点，有无穷多个时是本性奇点，比如 $e^{1/z}$，卡索拉蒂–魏尔斯特拉斯定理描述了它附近的剧烈行为。",
      ],
      (rng) => {
        const k = rng.int(2, 19);
        const words: Record<string, Pair> = {
          removable: ["A removable singularity", "可去奇点"],
          pole: ["A pole", "极点"],
          essential: ["An essential singularity", "本性奇点"],
        };
        const cases: { tex: string; kind: string; why: Pair }[] = [
          {
            tex: `\\frac{\\sin(${k}z)}{z}`,
            kind: "removable",
            why: [
              `The series of $\\sin(${k}z)$ begins with $${k}z$, so dividing by $z$ leaves no negative powers.`,
              `$\\sin(${k}z)$ 的级数以 $${k}z$ 开始，除以 $z$ 后没有负幂。`,
            ],
          },
          {
            tex: `\\frac{${k}}{z^{3}}`,
            kind: "pole",
            why: [
              "There is one negative power, so finitely many, and this is a pole of order 3.",
              "只有一个负幂，也就是有限多个，所以是 3 阶极点。",
            ],
          },
          {
            tex: `e^{${k}/z}`,
            kind: "essential",
            why: [
              "The exponential series in the reciprocal of $z$ has infinitely many negative powers.",
              "$z$ 的倒数的指数级数有无穷多个负幂。",
            ],
          },
        ];
        const chosen = rng.pick(cases);
        return choose(
          rng,
          [`What does $${chosen.tex}$ have at $z = 0$?`, `$${chosen.tex}$ 在 $z = 0$ 处是什么奇点？`],
          words[chosen.kind] as Pair,
          [
            ...Object.entries(words)
              .filter(([w]) => w !== chosen.kind)
              .map(([, w]) => w),
            ["No singularity of any kind", "不是奇点"],
          ],
          chosen.why,
        );
      },
    ),
  ],
);

const residues = topic(
  "computing-residues",
  ["Computing Residues", "计算留数"],
  ["Find residues at simple and double poles without a full series.", "不写出完整级数，求单极点和二阶极点的留数。"],
  ["classifying-isolated-singularities"],
  [["laurent-series", 0.4]],
  [
    point(
      "the-residue-at-a-simple-pole",
      ["The residue at a simple pole", "单极点的留数"],
      [
        "The residue at a point is the coefficient of $\\frac{1}{z - a}$ in the Laurent series there. At a simple pole there is a quick rule: multiply by $z - a$ and take the limit, which amounts to covering up that factor and substituting $a$ in what is left. The method needs the pole to be simple, and a higher pole needs the derivative version instead.",
        "在一点的留数是那里洛朗级数中 $\\frac{1}{z - a}$ 的系数。在单极点有一个快捷法则：乘以 $z - a$ 再取极限，也就是盖住这个因子，把 $a$ 代入剩下的部分。这个方法要求极点是单极点，高阶极点要改用求导的方法。",
      ],
      (rng) => {
        const a = rng.int(-6, 6);
        const b = a + rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
        const c = rng.int(1, 12);
        const answer = Q.of(c, a - b);
        return ask(
          [
            `What is the residue of $\\frac{${c}}{${factor(a)}${factor(b)}}$ at $z = ${a}$?`,
            `$\\frac{${c}}{${factor(a)}${factor(b)}}$ 在 $z = ${a}$ 处的留数是多少？`,
          ],
          answer,
          [Q.of(c, b - a), Q.of(c), Q.of(a - b, c), Q.of(c, a - b).add(Q.of(1))],
          [
            `Covering the factor $${minus("z", a)}$ and substituting $z = ${a}$ gives $\\frac{${c}}{${bracket(a)} - ${bracket(b)}} = ${answer.toLatex()}$.`,
            `盖住因子 $${minus("z", a)}$，代入 $z = ${a}$，得 $\\frac{${c}}{${bracket(a)} - ${bracket(b)}} = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "the-residue-at-a-double-pole",
      ["The residue at a double pole", "二阶极点的留数"],
      [
        "At a double pole, the residue of $\\frac{g(z)}{(z - a)^2}$ is the derivative $g'(a)$, because expanding $g$ gives a term in $z - a$ whose coefficient is that derivative. Substituting $a$ into $g$ gives the coefficient of the wrong power, which is the usual mistake. The general rule for order $n$ takes the derivative of order $n - 1$ and divides by a factorial.",
        "在二阶极点，$\\frac{g(z)}{(z - a)^2}$ 的留数是导数 $g'(a)$，因为展开 $g$ 时，$z - a$ 那一项的系数就是这个导数。把 $a$ 代入 $g$ 得到的是另一个幂的系数，这是常见的错误。$n$ 阶的一般法则是求 $n - 1$ 阶导数再除以阶乘。",
      ],
      (rng) => {
        const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const p = rng.int(1, 5);
        const q = rng.int(1, 9);
        const answer = 2 * p * a + q;
        return ask(
          [
            `What is the residue of $\\frac{${coefficient(p, "z^2")} + ${coefficient(q, "z")}}{(${minus("z", a)})^2}$ at $z = ${a}$?`,
            `$\\frac{${coefficient(p, "z^2")} + ${coefficient(q, "z")}}{(${minus("z", a)})^2}$ 在 $z = ${a}$ 处的留数是多少？`,
          ],
          answer,
          [p * a * a + q * a, 2 * p, answer + q, q],
          [
            `The residue is the derivative of the numerator at $${a}$: $${2 * p}(${a}) + ${q} = ${answer}$.`,
            `留数是分子在 $${a}$ 处的导数：$${2 * p}(${a}) + ${q} = ${answer}$。`,
          ],
        );
      },
    ),
  ],
);

const residueTheorem = topic(
  "the-residue-theorem",
  ["The Residue Theorem", "留数定理"],
  ["Compute contour integrals and real integrals from residues.", "由留数计算围道积分和实积分。"],
  ["computing-residues"],
  [["computing-residues", 0.6]],
  [
    point(
      "adding-the-enclosed-residues",
      ["Adding the enclosed residues", "把被包围的留数相加"],
      [
        "The residue theorem says that a closed contour integral equals $2\\pi i$ times the sum of the residues of the poles it encloses. So poles outside the contour do not count, which is the point to check first. With two simple poles inside a contour, the residues of $\\frac{c}{(z - a)(z - b)}$ cancel exactly, and the integral vanishes.",
        "留数定理说，闭围道积分等于 $2\\pi i$ 乘它所包围的极点的留数之和。所以围道外的极点不算，这是首先要检查的。围道内有两个单极点时，$\\frac{c}{(z - a)(z - b)}$ 的留数恰好相消，积分为零。",
      ],
      (rng) => {
        const r = rng.int(2, 7);
        const a = rng.int(-(r - 1), r - 1);
        const b = r + rng.int(1, 6);
        const c = (a - b) * rng.int(1, 6);
        const value = c / (a - b);
        const answer = 2 * value;
        return ask(
          [
            `The integral of $\\frac{${c}}{${factor(a)}${factor(b)}}$ once counterclockwise around $|z| = ${r}$ is $k\\pi i$. What is $k$?`,
            `$\\frac{${c}}{${factor(a)}${factor(b)}}$ 沿 $|z| = ${r}$ 逆时针积分一周的结果是 $k\\pi i$。$k$ 是多少？`,
          ],
          answer,
          [value, 0, -answer, answer + 2],
          [
            `Only the pole at $${a}$ is inside, since $${b}$ is outside. Its residue is $\\frac{${c}}{${bracket(a)} - ${bracket(b)}} = ${value}$, so $k = ${answer}$.`,
            `只有 $${a}$ 处的极点在圆内，$${b}$ 在圆外。它的留数是 $\\frac{${c}}{${bracket(a)} - ${bracket(b)}} = ${value}$，所以 $k = ${answer}$。`,
          ],
        );
      },
    ),
    {
      ...point(
        "a-real-integral-from-residues",
        ["A real integral from residues", "由留数求实积分"],
        [
          "Real integrals over the whole line can often be found by closing the interval with a large semicircle in the upper half plane. The contribution of the arc vanishes when the integrand falls quickly enough, so the real integral equals $2\\pi i$ times the residues in the upper half plane. This produces in a few lines integrals that have no elementary antiderivative, or a very awkward one.",
          "整条实轴上的积分，常常可以用上半平面的大半圆把区间封闭起来求得。被积函数下降得足够快时，圆弧的贡献趋于零，所以实积分等于 $2\\pi i$ 乘上半平面内的留数。这样几行就能算出没有初等原函数或原函数很麻烦的积分。",
        ],
        (rng) => {
          const a = rng.int(1, 9);
          const b = rng.pick(Array.from({ length: 9 }, (_, i) => i + 1).filter((v) => v !== a));
          const answer = Q.of(1, a * b * (a + b));
          return ask(
            [
              `The integral $\\int_{-\\infty}^{\\infty} \\frac{dx}{(x^2 + ${a * a})(x^2 + ${b * b})}$ equals $k\\pi$. What is $k$?`,
              `积分 $\\int_{-\\infty}^{\\infty} \\frac{dx}{(x^2 + ${a * a})(x^2 + ${b * b})}$ 等于 $k\\pi$。$k$ 是多少？`,
            ],
            answer,
            [Q.of(1, a * b), Q.of(1, a + b), Q.of(2, a * b * (a + b)), Q.of(1, a * a + b * b)],
            [
              `The poles in the upper half plane are ${a === 1 ? "" : a}i and ${b === 1 ? "" : b}i. Adding their residues and multiplying by $2\\pi i$ gives $\\frac{\\pi}{${a} \\cdot ${b} \\cdot (${a} + ${b})}$, which is $${answer.toLatex()}\\pi$.`,
              `上半平面的极点是 ${a === 1 ? "" : a}i 和 ${b === 1 ? "" : b}i。把它们的留数相加再乘以 $2\\pi i$，得 $\\frac{\\pi}{${a} \\cdot ${b} \\cdot (${a} + ${b})}$，即 $${answer.toLatex()}\\pi$。`,
            ],
          );
        },
      ),
      figure: complexDrawings1["the-residue-theorem#a-real-integral-from-residues"],
    },
  ],
);

const mobiusMaps = topic(
  "mobius-transformations",
  ["Möbius Transformations", "默比乌斯变换"],
  ["Evaluate fractional linear maps, and find their poles and images of infinity.", "计算分式线性映射，并求它们的极点和无穷远点的像。"],
  ["the-complex-derivative"],
  [],
  [
    point(
      "the-image-of-infinity-and-the-pole",
      ["The image of infinity and the pole", "无穷远点的像和极点"],
      [
        "A Möbius transformation is $\\frac{az + b}{cz + d}$, a quotient of two linear functions of $z$, with $ad - bc \\ne 0$. It is best treated as a map of the extended plane with one point at infinity added. The point where the denominator vanishes goes to infinity, and infinity goes to the ratio of the leading coefficients. With these conventions, every such map is a bijection and has an inverse of the same form.",
        "默比乌斯变换是 $\\frac{az + b}{cz + d}$，即 $z$ 的两个线性函数之商，且 $ad - bc \\ne 0$。最好把它看成添加了一个无穷远点的扩充平面上的映射。分母为零的点被送到无穷远，无穷远被送到首项系数之比。按这样的约定，每个这样的映射都是双射，并有同样形式的逆。",
      ],
      (rng) => {
        const a = rng.int(1, 9);
        const b = rng.int(1, 9);
        const c = rng.int(2, 9);
        const d = rng.int(1, 9);
        const safeA = a * d === b * c ? a + 1 : a;
        const asksPole = rng.bool();
        const answer = asksPole ? Q.of(-d, c) : Q.of(safeA, c);
        return ask(
          [
            `Let $f(z) = \\frac{${coefficient(safeA, "z")} + ${b}}{${c}z + ${d}}$. ${asksPole ? "Which point does $f$ send to infinity?" : "What is the image of infinity under $f$?"}`,
            `设 $f(z) = \\frac{${coefficient(safeA, "z")} + ${b}}{${c}z + ${d}}$。${asksPole ? "$f$ 把哪个点送到无穷远？" : "无穷远点在 $f$ 下的像是什么？"}`,
          ],
          answer,
          [
            asksPole ? Q.of(d, c) : Q.of(c, safeA),
            asksPole ? Q.of(-b, safeA) : Q.of(b, d),
            asksPole ? Q.of(-c, d) : Q.of(safeA, d),
            answer.add(Q.of(1)),
          ],
          [
            asksPole
              ? `The denominator vanishes at $z = ${answer.toLatex()}$.`
              : `For large $z$, the quotient tends to the ratio of the leading coefficients, $${answer.toLatex()}$.`,
            asksPole ? `分母在 $z = ${answer.toLatex()}$ 处为零。` : `当 $z$ 很大时，商趋向首项系数之比 $${answer.toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "fixed-points-of-a-transformation",
      ["Fixed points of a transformation", "变换的不动点"],
      [
        "A fixed point of a Möbius transformation solves $z = f(z)$, and clearing the denominator gives a quadratic. So a map other than the identity has at most two fixed points in the extended plane. A map fixing three points must therefore be the identity, and this is the reason why three points and their images determine a Möbius transformation exactly.",
        "默比乌斯变换的不动点满足 $z = f(z)$，去分母后得到二次方程。所以恒等映射以外的映射在扩充平面上至多有两个不动点。固定三个点的映射必然是恒等映射，这就是三个点及其像恰好决定一个默比乌斯变换的原因。",
      ],
      (rng) => {
        const p = rng.int(-6, 6);
        const q = p + rng.int(1, 9);
        // z = (az + b) / (z + d) has z² + (d - a)z - b = 0, with roots p and q.
        const d = rng.pick([1, 2, 3, 4, 5, 6, 7, 8].filter((v) => v !== -p && v !== -q));
        const a = d + p + q;
        const b = -p * q;
        const top = `${a === 0 ? "" : coefficient(a, "z")}${b === 0 ? (a === 0 ? "0" : "") : `${b > 0 && a !== 0 ? " + " : b < 0 ? " - " : ""}${Math.abs(b)}`}`;
        return ask(
          [
            `What is the larger fixed point of $f(z) = \\frac{${top}}{z + ${d}}$?`,
            `$f(z) = \\frac{${top}}{z + ${d}}$ 较大的不动点是多少？`,
          ],
          q,
          [p, p + q, a, q + 1],
          [
            `Setting $z(z + ${d}) = ${top}$ gives $${factor(p)}${factor(q)} = 0$, so the fixed points are $${p}$ and $${q}$.`,
            `令 $z(z + ${d}) = ${top}$，得 $${factor(p)}${factor(q)} = 0$，所以不动点是 $${p}$ 和 $${q}$。`,
          ],
        );
      },
    ),
  ],
);

const conformal = topic(
  "conformal-maps",
  ["Conformal Maps", "共形映射"],
  ["Find how much a map stretches near a point, and where conformality fails.", "求映射在一点附近的伸缩倍数，以及共形性在哪里失效。"],
  ["mobius-transformations"],
  [],
  [
    {
      ...point(
        "the-local-scale-factor",
        ["The local scale factor", "局部伸缩倍数"],
        [
          "Near a point where the derivative is not zero, an analytic map acts like multiplication by that derivative: a rotation by its argument together with a scaling by its modulus. All directions turn and stretch by the same amounts, so angles are preserved, which is what conformal means. The local scale factor is thus the modulus of the derivative at that point.",
          "在导数不为零的点附近，解析映射的作用就像乘以这个导数：旋转它的辐角并按它的模伸缩。所有方向都旋转和伸缩相同的量，所以角度保持不变，这就是共形的含义。因此局部伸缩倍数就是这一点的导数的模。",
        ],
        (rng) => {
          const k = rng.int(1, 4);
          const { a, b, r } = signedTriple(rng);
          const answer = 2 * k * r;
          const f = k === 1 ? "z^2" : `${k}z^2`;
          return ask(
            [
              `By what factor does $f(z) = ${f}$ scale small lengths near $z = ${complex(a, b)}$?`,
              `$f(z) = ${f}$ 在 $z = ${complex(a, b)}$ 附近把小长度放大多少倍？`,
            ],
            answer,
            [k * r * r, r, 2 * k * (Math.abs(a) + Math.abs(b)), answer + 1],
            [
              `$|f'(z)| = ${2 * k}|z|$, and $|${complex(a, b)}| = ${r}$, so the factor is ${answer}.`,
              `$|f'(z)| = ${2 * k}|z|$，而 $|${complex(a, b)}| = ${r}$，所以倍数是 ${answer}。`,
            ],
          );
        },
      ),
      figure: complexDrawings1["conformal-maps#the-local-scale-factor"],
    },
    {
      ...point(
        "where-conformality-fails",
        ["Where conformality fails", "共形性在哪里失效"],
        [
          "A map fails to be conformal at a critical point, where the derivative vanishes. There, the map behaves like a higher power and multiplies angles rather than keeping them: $z^2$ doubles angles at zero. For a quadratic, there is one critical point, found by setting the derivative to zero, and at any other point of the plane the map preserves angles.",
          "在导数为零的临界点，映射不再共形。在那里，映射的行为像更高次的幂，把角度成倍放大而不是保持不变：$z^2$ 在零处把角度加倍。对二次函数，只有一个临界点，令导数为零即可求出，在平面上其他任何点，映射都保持角度。",
        ],
        (rng) => {
          const a = rng.int(1, 5);
          const b = rng.pick([-18, -14, -12, -10, -8, -6, -4, -2, 2, 4, 6, 8, 10, 12, 14, 18]);
          const c = rng.int(-9, 9);
          const answer = Q.of(-b, 2 * a);
          const addend = c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`;
          const f = `${coefficient(a, "z^2")} ${b > 0 ? "+" : "-"} ${Math.abs(b)}z${addend}`;
          return ask(
            [`At which point is $f(z) = ${f}$ not conformal?`, `$f(z) = ${f}$ 在哪一点不共形？`],
            answer,
            [Q.of(b, 2 * a), Q.of(-b, a), Q.of(-c === 0 ? 1 : -c, a), answer.add(Q.of(1))],
            [
              `$f'(z) = ${2 * a}z ${b > 0 ? "+" : "-"} ${Math.abs(b)}$ vanishes at $z = ${answer.toLatex()}$.`,
              `$f'(z) = ${2 * a}z ${b > 0 ? "+" : "-"} ${Math.abs(b)}$ 在 $z = ${answer.toLatex()}$ 处为零。`,
            ],
          );
        },
      ),
      figure: complexDrawings1["conformal-maps#where-conformality-fails"],
    },
  ],
);

/** complexAnalysisTopics holds the topics written for the Complex Analysis course. */
export const complexAnalysisTopics: readonly TopicDef[] = [
  complexFunctions,
  complexLimits,
  complexDerivative,
  cauchyRiemann,
  harmonic,
  complexExponential,
  complexLog,
  contourIntegrals,
  cauchyTheorem,
  cauchyFormula,
  estimates,
  taylorComplex,
  laurent,
  singularities,
  residues,
  residueTheorem,
  mobiusMaps,
  conformal,
];
