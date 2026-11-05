// Further knowledge points for topics of Complex Analysis, each a skill the topic's own points
// leave out. See `deeperComplexAnalysisPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { Q } from "@ga/subject-math";

import { ask, point } from "../university-kit.ts";

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

const addingArguments = point(
  "arguments-of-products-and-quotients",
  ["Arguments of products and quotients", "积与商的辐角"],
  [
    "Multiplying complex numbers multiplies their moduli and adds their arguments, and dividing subtracts the arguments. So the polar form makes multiplication a rotation combined with a scaling. Reduce the resulting angle to the range from 0 up to a full turn, because arguments repeat every full turn.",
    "复数相乘时模相乘、辐角相加，相除时辐角相减。所以极坐标形式把乘法变成旋转加伸缩。要把得到的角化到从 0 到一整圈的范围内，因为辐角每一整圈重复一次。",
  ],
  (rng) => {
    const [a, b] = [15 * rng.int(1, 23), 15 * rng.int(1, 23)];
    const [r, s] = [rng.int(2, 9), rng.int(2, 9)];
    const product = rng.bool();
    const answer = ((product ? a + b : a - b) + 720) % 360;
    const [word, wordZh] = product ? ["zw", "zw"] : ["\\frac{z}{w}", "\\frac{z}{w}"];
    return ask(
      [
        `$|z| = ${r}$ with argument $${a}^\\circ$, and $|w| = ${s}$ with argument $${b}^\\circ$. What is the argument of $${word}$ in degrees, from 0 up to 360?`,
        `$|z| = ${r}$，辐角 $${a}^\\circ$；$|w| = ${s}$，辐角 $${b}^\\circ$。$${wordZh}$ 的辐角是多少度（从 0 到 360）？`,
      ],
      answer,
      [(a + b + 180) % 360, ((a - b + 720) % 360) + (product ? 0 : 15), (a * b) % 360, (answer + 90) % 360],
      [
        `Arguments ${product ? "add" : "subtract"}, and $${a} ${product ? "+" : "-"} ${b}$ reduces to ${answer} degrees.`,
        `辐角${product ? "相加" : "相减"}，$${a} ${product ? "+" : "-"} ${b}$ 化简后是 ${answer} 度。`,
      ],
    );
  },
);

const imageOfACircle = point(
  "the-image-of-a-circle-under-a-power",
  ["The image of a circle under a power", "圆在幂函数下的像"],
  [
    "A function of a complex variable moves points of one plane to another, so it helps to follow simple curves. Under $f(z) = c z^k$, every point with $|z| = r$ goes to a point with modulus $c r^k$. So the circle around the origin maps onto a circle around the origin, traversed $k$ times.",
    "复变函数把一个平面上的点移到另一个平面，所以跟踪简单曲线很有帮助。在 $f(z) = c z^k$ 下，每个满足 $|z| = r$ 的点都变为模为 $c r^k$ 的点。所以以原点为心的圆映到以原点为心的圆上，并绕行 $k$ 次。",
  ],
  (rng) => {
    const [c, k, r] = [rng.int(1, 3), rng.int(2, 4), rng.int(2, 6)];
    const answer = c * r ** k;
    return ask(
      [
        `The circle $|z| = ${r}$ maps onto a circle under $f(z) = ${coef(c, `z^{${k}}`)}$. What is its radius?`,
        `圆 $|z| = ${r}$ 在 $f(z) = ${coef(c, `z^{${k}}`)}$ 下映到一个圆上。这个圆的半径是多少？`,
      ],
      answer,
      [c * r * k, r ** k + c, (c * r) ** k, answer + r].filter((v) => v !== answer),
      [
        `The modulus of $f(z)$ is $${c === 1 ? "" : `${c} \\cdot `}${r}^{${k}} = ${answer}$.`,
        `$f(z)$ 的模是 $${c === 1 ? "" : `${c} \\cdot `}${r}^{${k}} = ${answer}$。`,
      ],
    );
  },
);

const limitByCancelling = point(
  "a-limit-by-cancelling-a-factor",
  ["A limit by cancelling a factor", "约去因子求极限"],
  [
    "When both numerator and denominator vanish at the point, factor and cancel, exactly as for real limits. The algebra of complex numbers has the same factorization $z^2 - a^2 = (z - a)(z + a)$. After cancelling, the remaining expression is continuous, so the limit is its value at the point.",
    "当分子和分母在该点都为零时，像实函数极限那样分解并约分。复数代数有同样的分解 $z^2 - a^2 = (z - a)(z + a)$。约分之后剩下的表达式是连续的，所以极限就是它在该点的值。",
  ],
  (rng) => {
    const [p, q, c] = [rng.int(1, 5), rng.int(1, 5), rng.int(1, 3)];
    const square = cx(p * p - q * q, 2 * p * q);
    const answer = 2 * c * q;
    return ask(
      [
        `The limit of $\\frac{${coef(c, `(z^2 - (${square}))`)}}{z - (${cx(p, q)})}$ as $z \\to ${cx(p, q)}$ is a complex number. What is its imaginary part?`,
        `当 $z \\to ${cx(p, q)}$ 时，$\\frac{${coef(c, `(z^2 - (${square}))`)}}{z - (${cx(p, q)})}$ 的极限是一个复数。它的虚部是多少？`,
      ],
      answer,
      [2 * c * p, c * q, 2 * q + c, answer + 2].filter((v) => v !== answer),
      [
        `The numerator is $${coef(c, `(z - a)(z + a)`)}$ with $a = ${cx(p, q)}$, so the limit is $${c === 1 ? "" : `${c} \\cdot `}2a = ${cx(2 * c * p, 2 * c * q)}$.`,
        `分子是 $${coef(c, `(z - a)(z + a)`)}$，其中 $a = ${cx(p, q)}$，所以极限是 $${c === 1 ? "" : `${c} \\cdot `}2a = ${cx(2 * c * p, 2 * c * q)}$。`,
      ],
    );
  },
);

const chainRule = point(
  "the-chain-rule-for-a-complex-derivative",
  ["The chain rule for a complex derivative", "复导数的链式法则"],
  [
    "The rules of differentiation carry over to complex functions, because their proofs use only the algebra of limits. So the derivative of $(a z + b)^n$ is $n a (a z + b)^{n-1}$, just as for real functions. A polynomial is differentiable at every point of the complex plane.",
    "求导法则可以推广到复函数，因为它们的证明只用到极限的代数性质。所以 $(a z + b)^n$ 的导数是 $n a (a z + b)^{n-1}$，与实函数相同。多项式在复平面的每一点都可导。",
  ],
  (rng) => {
    const [a, b, n] = [rng.int(1, 4), rng.int(1, 4), rng.int(2, 5)];
    const answer = n * a * b ** (n - 1);
    return ask(
      [`If $f(z) = (${coef(a, "z")} + ${b})^{${n}}$, what is $f'(0)$?`, `若 $f(z) = (${coef(a, "z")} + ${b})^{${n}}$，$f'(0)$ 是多少？`],
      answer,
      [n * b ** (n - 1), n * a * b ** n, a * b ** (n - 1), answer + a].filter((v) => v !== answer),
      [
        `$f'(z) = ${n} \\cdot ${a} ${pow(`(${coef(a, "z")} + ${b})`, n - 1)}$, which is ${answer} at $z = 0$.`,
        `$f'(z) = ${n} \\cdot ${a} ${pow(`(${coef(a, "z")} + ${b})`, n - 1)}$，在 $z = 0$ 处等于 ${answer}。`,
      ],
    );
  },
);

const whereEquationsHold = point(
  "where-the-equations-hold",
  ["Where the equations hold", "方程在何处成立"],
  [
    "The Cauchy-Riemann equations can hold on a small set only. Then the function has a derivative at those points but is analytic nowhere, since being analytic needs a derivative on a whole open neighborhood. For $u = a x^2$ and $v = b y^2$, the equation $u_x = v_y$ selects a line through the origin.",
    "柯西-黎曼方程可能只在一个很小的集合上成立。这时函数在这些点可导，但处处不解析，因为解析要求在整个开邻域上可导。对 $u = a x^2$ 和 $v = b y^2$，方程 $u_x = v_y$ 选出一条过原点的直线。",
  ],
  (rng) => {
    let [a, b] = [rng.int(1, 9), rng.int(1, 9)];
    while (gcd(a, b) !== 1 || a === b) [a, b] = [rng.int(1, 9), rng.int(1, 9)];
    const answer = frac(a, b);
    return ask(
      [
        `The function $f(x + iy) = ${coef(a, "x^2")} + ${coef(b, "y^2")} i$ satisfies the Cauchy-Riemann equations on a line $y = m x$. What is $m$?`,
        `函数 $f(x + iy) = ${coef(a, "x^2")} + ${coef(b, "y^2")} i$ 在直线 $y = m x$ 上满足柯西-黎曼方程。$m$ 是多少？`,
      ],
      answer,
      [frac(b, a), frac(-a, b), frac(a + 1, b), frac(2 * a, b)],
      [
        `$u_y = v_x = 0$ always, and $u_x = v_y$ says $${2 * a} x = ${2 * b} y$, so $m = ${answer.toLatex()}$.`,
        `$u_y = v_x = 0$ 恒成立，$u_x = v_y$ 即 $${2 * a} x = ${2 * b} y$，所以 $m = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const laplacianValue = point(
  "the-laplacian-at-a-point",
  ["The laplacian at a point", "某点处的拉普拉斯算子"],
  [
    "A function is harmonic when $u_{xx} + u_{yy} = 0$ everywhere. To test a candidate, compute both second derivatives and add them. A single nonzero value at any point shows at once that the function cannot be the real part of an analytic function on a region containing that point.",
    "函数调和是指处处有 $u_{xx} + u_{yy} = 0$。要检验一个候选函数，就算出两个二阶导数并相加。只要某一点的值不为零，就立刻说明它不可能是包含该点的区域上解析函数的实部。",
  ],
  (rng) => {
    const a = rng.int(1, 4);
    const b = rng.pick([-4, -2, -1, 1, 2, 4, 5]);
    const [p, q] = [rng.int(1, 5), rng.int(1, 5)];
    const answer = p * (6 * a + 2 * b);
    return ask(
      [
        `For $u = ${coef(a, "x^3")} ${b < 0 ? "-" : "+"} ${coef(Math.abs(b), "x y^2")}$, what is $u_{xx} + u_{yy}$ at $(${p}, ${q})$?`,
        `对 $u = ${coef(a, "x^3")} ${b < 0 ? "-" : "+"} ${coef(Math.abs(b), "x y^2")}$，$u_{xx} + u_{yy}$ 在 $(${p}, ${q})$ 处是多少？`,
      ],
      answer,
      [6 * a * p, 2 * b * p, p * (3 * a + b), q * (6 * a + 2 * b)].filter((v) => v !== answer),
      [
        `$u_{xx} = ${6 * a} x$ and $u_{yy} = ${2 * b} x$, so the sum is $${6 * a + 2 * b} x = ${answer}$ at $x = ${p}$.`,
        `$u_{xx} = ${6 * a} x$，$u_{yy} = ${2 * b} x$，所以和是 $${6 * a + 2 * b} x$，在 $x = ${p}$ 处等于 ${answer}。`,
      ],
    );
  },
);

const exponentialModulus = point(
  "the-modulus-of-the-exponential",
  ["The modulus of the exponential", "指数函数的模"],
  [
    "Since $e^{x + iy} = e^x (\\cos y + i \\sin y)$, the modulus is $e^x$ and the imaginary part of the exponent only rotates. So the logarithm of the modulus simply recovers the real part $x$. In particular, the exponential function is never zero.",
    "因为 $e^{x + iy} = e^x (\\cos y + i \\sin y)$，模是 $e^x$，指数的虚部只产生旋转。所以模的对数恰好还原实部 $x$。特别地，指数函数从不为零。",
  ],
  (rng) => {
    const a = rng.pick([-9, -7, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 7, 9]);
    const b = rng.int(1, 9);
    return ask(
      [`What is $\\ln | e^{${cx(a, b)}} |$?`, `$\\ln | e^{${cx(a, b)}} |$ 是多少？`],
      a,
      [b, a + b, a * a + b * b, -a],
      [
        `The modulus is $e^{${a}}$, because the imaginary part only rotates. Its logarithm is ${a}.`,
        `模是 $e^{${a}}$，因为虚部只产生旋转。它的对数是 ${a}。`,
      ],
    );
  },
);

const logOfProduct = point(
  "the-principal-argument-of-a-product",
  ["The principal argument of a product", "积的主辐角"],
  [
    "The principal logarithm does not always turn products into sums. Arguments add, but the sum may fall outside the range from $-\\pi$ to $\\pi$, and then a full turn must be removed. So $\\operatorname{Log}(zw)$ can differ from $\\operatorname{Log} z + \\operatorname{Log} w$ by $2 \\pi i$.",
    "主对数并不总把积变成和。辐角相加，但和可能落在 $-\\pi$ 到 $\\pi$ 的范围之外，这时要减去一整圈。所以 $\\operatorname{Log}(zw)$ 与 $\\operatorname{Log} z + \\operatorname{Log} w$ 可能相差 $2 \\pi i$。",
  ],
  (rng) => {
    const d = rng.pick([4, 6]);
    const options = Array.from({ length: 2 * d }, (_, i) => i - d + 1).filter((v) => v !== 0);
    const pairs = options.flatMap((x) => options.map((y): [number, number] => [x, y])).filter(([x, y]) => x + y > d || x + y <= -d);
    const [a, b] = rng.pick(pairs);
    let s = a + b;
    if (s > d) s -= 2 * d;
    if (s <= -d) s += 2 * d;
    const answer = frac(s, d);
    const show = (x: number) => timesPi(frac(x, d));
    return ask(
      [
        `$\\operatorname{Arg} z = ${show(a)}$ and $\\operatorname{Arg} w = ${show(b)}$. What is $\\operatorname{Arg}(zw)$ as a multiple of $\\pi$?`,
        `$\\operatorname{Arg} z = ${show(a)}$，$\\operatorname{Arg} w = ${show(b)}$。$\\operatorname{Arg}(zw)$ 是 $\\pi$ 的多少倍？`,
      ],
      answer,
      [frac(s + 2 * d, d), frac(s - 2 * d, d), frac(a - b, d), frac(-s, d)],
      [
        `The sum of the arguments is $${show(a + b)}$${s === a + b ? ", already in the principal range" : `, and removing a full turn gives $${show(s)}$`}.`,
        `辐角之和是 $${show(a + b)}$${s === a + b ? "，已在主值范围内" : `，调整一整圈后得 $${show(s)}$`}。`,
      ],
    );
  },
);

const iToAComplexPower = point(
  "the-size-of-a-power-of-i",
  ["The size of a power of i", "i 的幂的大小"],
  [
    "The principal value of $i^w$ is $e^{w \\operatorname{Log} i}$, and $\\operatorname{Log} i = \\frac{i \\pi}{2}$. Writing $w = c + d i$, the exponent has real part $-\\frac{d \\pi}{2}$. So $i^i$ is a real number, and in general only the imaginary part of the power affects the size.",
    "$i^w$ 的主值是 $e^{w \\operatorname{Log} i}$，而 $\\operatorname{Log} i = \\frac{i \\pi}{2}$。写 $w = c + d i$，指数的实部是 $-\\frac{d \\pi}{2}$。所以 $i^i$ 是实数，一般地只有幂的虚部影响大小。",
  ],
  (rng) => {
    const c = rng.int(0, 5);
    const d = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
    const answer = frac(-d, 2);
    return ask(
      [
        `For the principal value of $i^{${cx(c, d)}}$, what is the logarithm of the modulus as a multiple of $\\pi$?`,
        `对 $i^{${cx(c, d)}}$ 的主值，模的对数是 $\\pi$ 的多少倍？`,
      ],
      answer,
      [frac(d, 2), frac(-d, 1), frac(c, 2), frac(-c, 2)],
      [
        `The exponent is $(${cx(c, d)}) \\cdot \\frac{i \\pi}{2}$, and its real part is $${timesPi(answer)}$.`,
        `指数是 $(${cx(c, d)}) \\cdot \\frac{i \\pi}{2}$，它的实部是 $${timesPi(answer)}$。`,
      ],
    );
  },
);

const closedPower = point(
  "integrating-powers-around-a-circle",
  ["Integrating powers around a circle", "沿圆周积分幂函数"],
  [
    "Around a circle centered at the origin, $\\oint z^n \\, dz$ is 0 for every integer $n$ other than $-1$, because those powers have antiderivatives. The single exception gives $\\oint \\frac{dz}{z} = 2 \\pi i$. So only the term in $\\frac{1}{z}$ of a sum survives the integration.",
    "沿以原点为心的圆，对除 $-1$ 以外的每个整数 $n$，$\\oint z^n \\, dz$ 都是 0，因为这些幂函数有原函数。唯一的例外给出 $\\oint \\frac{dz}{z} = 2 \\pi i$。所以和式中只有 $\\frac{1}{z}$ 项在积分后留下来。",
  ],
  (rng) => {
    const [a, b, n, r] = [rng.int(1, 9), rng.int(2, 9), rng.int(2, 6), rng.int(1, 5)];
    const answer = 2 * a;
    return ask(
      [
        `Around $|z| = ${r}$ counterclockwise, $\\oint \\left( \\frac{${a}}{z} + ${b} z^{${n}} \\right) dz = k \\pi i$. What is $k$?`,
        `沿 $|z| = ${r}$ 逆时针，$\\oint \\left( \\frac{${a}}{z} + ${b} z^{${n}} \\right) dz = k \\pi i$。$k$ 是多少？`,
      ],
      answer,
      [a, 2 * b, 2 * (a + b), 0],
      [
        `The power $z^{${n}}$ has an antiderivative and contributes 0, while the first term gives $${a} \\cdot 2 \\pi i$.`,
        `幂 $z^{${n}}$ 有原函数，贡献为 0，第一项给出 $${a} \\cdot 2 \\pi i$。`,
      ],
    );
  },
);

const mlShrinking = point(
  "a-bound-on-a-large-arc",
  ["A bound on a large arc", "大圆弧上的估计"],
  [
    "On $|z| = R$ with $R > 1$, the triangle inequality gives $|z^2 + 1| \\ge R^2 - 1$. Together with the length $\\pi R$ of a semicircle, this bounds the integral by a quantity that shrinks like $\\frac{1}{R}$. That shrinking is why the large arc disappears when real integrals are computed by residues.",
    "在 $|z| = R$（$R > 1$）上，三角不等式给出 $|z^2 + 1| \\ge R^2 - 1$。再结合半圆的长度 $\\pi R$，积分的界就像 $\\frac{1}{R}$ 那样缩小。正因如此，用留数计算实积分时大圆弧的贡献才会消失。",
  ],
  (rng) => {
    const [c, R] = [rng.int(1, 6), rng.int(2, 8)];
    const answer = frac(c * R, R * R - 1);
    return ask(
      [
        `Apply the $ML$ inequality to $\\frac{${c}}{z^2 + 1}$ on the semicircle of radius ${R}, using $|z^2 + 1| \\ge ${R * R - 1}$. The bound is what multiple of $\\pi$?`,
        `对半径为 ${R} 的半圆上的 $\\frac{${c}}{z^2 + 1}$ 应用 $ML$ 不等式，利用 $|z^2 + 1| \\ge ${R * R - 1}$。这个界是 $\\pi$ 的多少倍？`,
      ],
      answer,
      [frac(c, R * R - 1), frac(2 * c * R, R * R - 1), frac(c * R, R * R + 1), frac(R, R * R - 1)],
      [
        `$M = \\frac{${c}}{${R * R - 1}}$ and $L = ${R} \\pi$, so the bound is $${answer.toLatex()} \\pi$.`,
        `$M = \\frac{${c}}{${R * R - 1}}$，$L = ${R} \\pi$，所以界是 $${answer.toLatex()} \\pi$。`,
      ],
    );
  },
);

const windingRepeated = point(
  "the-winding-number-of-a-repeated-circle",
  ["The winding number of a repeated circle", "重复绕行圆的环绕数"],
  [
    "The path $z(t) = c + r e^{i k t}$ for $t$ from 0 to $2 \\pi$ goes around the same circle $|k|$ times, clockwise when $k$ is negative. A point inside the circle has winding number $k$. A point outside has winding number 0, because the path never encircles it.",
    "路径 $z(t) = c + r e^{i k t}$（$t$ 从 0 到 $2 \\pi$）沿同一个圆绕行 $|k|$ 次，$k$ 为负时顺时针。圆内的点环绕数是 $k$。圆外的点环绕数是 0，因为路径没有围住它。",
  ],
  (rng) => {
    const k = rng.pick([-4, -3, -2, -1, 2, 3, 4, 5]);
    const [c, r] = [rng.int(1, 6), rng.int(3, 6)];
    const inside = rng.bool();
    const w = inside ? c + rng.int(1 - r, r - 1) : c + r + rng.int(1, 4);
    const answer = inside ? k : 0;
    return ask(
      [
        `For $t$ from 0 to $2 \\pi$, what is the winding number of $z(t) = ${c} + ${r} e^{${coef(k, "i")} t}$ around the point ${w}?`,
        `$t$ 从 0 到 $2 \\pi$，$z(t) = ${c} + ${r} e^{${coef(k, "i")} t}$ 绕点 ${w} 的环绕数是多少？`,
      ],
      answer,
      [-k, Math.abs(k), 1, 0].filter((v) => v !== answer),
      [
        `The distance from ${w} to the center ${c} is ${Math.abs(w - c)}, which is ${inside ? "less" : "more"} than the radius ${r}, so the point is ${inside ? `inside and the winding number is ${k}` : "outside and the winding number is 0"}.`,
        `${w} 到圆心 ${c} 的距离是 ${Math.abs(w - c)}，${inside ? "小于" : "大于"}半径 ${r}，所以这个点在圆${inside ? `内，环绕数是 ${k}` : "外，环绕数是 0"}。`,
      ],
    );
  },
);

const twoPoles = point(
  "a-contour-around-one-or-both-poles",
  ["A contour around one or both poles", "围住一个或两个极点的围道"],
  [
    "Partial fractions write $\\frac{1}{(z - a)(z - b)}$ as $\\frac{1}{a - b} \\left( \\frac{1}{z - a} - \\frac{1}{z - b} \\right)$, and Cauchy's formula handles each piece. A contour around only $a$ gives $\\frac{2 \\pi i}{a - b}$. A contour around both gives 0, because the two pieces cancel.",
    "部分分式把 $\\frac{1}{(z - a)(z - b)}$ 写成 $\\frac{1}{a - b} \\left( \\frac{1}{z - a} - \\frac{1}{z - b} \\right)$，柯西公式处理每一部分。只围住 $a$ 的围道给出 $\\frac{2 \\pi i}{a - b}$。围住两者的围道给出 0，因为两部分相互抵消。",
  ],
  (rng) => {
    const r = 4;
    const a = rng.pick([-3, -2, -1, 1, 2, 3]);
    const both = rng.bool();
    const b = both ? rng.pick([-3, -2, -1, 1, 2, 3].filter((v) => v !== a)) : rng.pick([-7, -6, -5, 5, 6, 7]);
    const answer = both ? Q.of(0, 1) : frac(2, a - b);
    return ask(
      [
        `Around $|z| = ${r}$ counterclockwise, $\\oint \\frac{dz}{(${shift(a)})(${shift(b)})} = k \\pi i$. What is $k$?`,
        `沿 $|z| = ${r}$ 逆时针，$\\oint \\frac{dz}{(${shift(a)})(${shift(b)})} = k \\pi i$。$k$ 是多少？`,
      ],
      answer,
      [frac(2, a - b), frac(2, b - a), frac(1, a - b), frac(4, a - b), Q.of(2, 1)].filter((v) => !v.eq(answer)),
      [
        both
          ? `Both poles lie inside the circle, and their residues cancel, so the integral is 0.`
          : `Only the pole at ${a} lies inside, with residue $\\frac{1}{${a} ${b < 0 ? `+ ${-b}` : `- ${b}`}}$, so $k = ${answer.toLatex()}$.`,
        both
          ? "两个极点都在圆内，它们的留数相互抵消，所以积分是 0。"
          : `只有 ${a} 处的极点在圆内，留数是 $\\frac{1}{${a} ${b < 0 ? `+ ${-b}` : `- ${b}`}}$，所以 $k = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const generalLiouville = point(
  "growth-limits-the-degree",
  ["Growth limits the degree", "增长限制次数"],
  [
    "Cauchy's estimates extend Liouville's theorem. If an entire function satisfies $|f(z)| \\le c |z|^{s} + d$, then its coefficients of degree above $s$ must vanish, because they are bounded by quantities tending to 0. So the function is a polynomial of degree at most the whole part of $s$.",
    "柯西估计推广了刘维尔定理。如果整函数满足 $|f(z)| \\le c |z|^{s} + d$，那么次数高于 $s$ 的系数都必须为零，因为它们的界趋于 0。所以这个函数是次数不超过 $s$ 的整数部分的多项式。",
  ],
  (rng) => {
    let [p, q] = [rng.int(1, 11), rng.int(2, 4)];
    while (gcd(p, q) !== 1) [p, q] = [rng.int(1, 11), rng.int(2, 4)];
    const [c, d] = [rng.int(2, 9), rng.int(1, 9)];
    const answer = Math.floor(p / q);
    return ask(
      [
        `An entire function satisfies $|f(z)| \\le ${c} |z|^{${p}/${q}} + ${d}$ for all $z$. What is the largest degree it can have?`,
        `整函数对所有 $z$ 满足 $|f(z)| \\le ${c} |z|^{${p}/${q}} + ${d}$。它的次数最大是多少？`,
      ],
      answer,
      [answer + 1, p, c, answer + 2].filter((v) => v !== answer),
      [
        `Coefficients of degree above $\\frac{${p}}{${q}}$ vanish by Cauchy's estimates, so the degree is at most ${answer}.`,
        `由柯西估计，次数高于 $\\frac{${p}}{${q}}$ 的系数都为零，所以次数不超过 ${answer}。`,
      ],
    );
  },
);

const expCoefficient = point(
  "a-coefficient-of-a-scaled-exponential",
  ["A coefficient of a scaled exponential", "伸缩指数函数的系数"],
  [
    "Replacing $z$ by $a z$ in the series of $e^z$ gives $e^{a z} = \\sum \\frac{a^n z^n}{n!}$, which converges everywhere. Substitution like this finds coefficients with no differentiation at all. The same idea handles a power of $z$ in the exponent, as the Taylor series of an analytic function is unique.",
    "在 $e^z$ 的级数中用 $a z$ 代替 $z$，得 $e^{a z} = \\sum \\frac{a^n z^n}{n!}$，它处处收敛。这样的代入不用求导就能得到系数。同样的思路也能处理指数中的 $z$ 的幂，因为解析函数的泰勒级数是唯一的。",
  ],
  (rng) => {
    const [a, n] = [rng.int(2, 7), rng.int(2, 6)];
    let factorial = 1;
    for (let i = 2; i <= n; i++) factorial *= i;
    const answer = frac(a ** n, factorial);
    return ask(
      [
        `What is the coefficient of $z^{${n}}$ in the Taylor series of $e^{${a} z}$ at 0?`,
        `$e^{${a} z}$ 在 0 处的泰勒级数中，$z^{${n}}$ 的系数是多少？`,
      ],
      answer,
      [frac(a ** n, n), frac(a, factorial), frac(a * n, factorial), Q.of(a ** n, 1)],
      [
        `The coefficient is $\\frac{${a}^{${n}}}{${n}!} = ${answer.toLatex()}$.`,
        `系数是 $\\frac{${a}^{${n}}}{${n}!} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const radiusByRoot = point(
  "the-radius-by-the-root-test",
  ["The radius by the root test", "用根值判别法求半径"],
  [
    "The radius of convergence of $\\sum c_n z^n$ is the reciprocal of the limit of $|c_n|^{1/n}$, when that limit exists. For $c_n = \\frac{b^n}{a^n}$, the root is just $\\frac{b}{a}$. The series is then geometric with ratio $\\frac{b z}{a}$, which agrees with this radius.",
    "当 $|c_n|^{1/n}$ 的极限存在时，$\\sum c_n z^n$ 的收敛半径是这个极限的倒数。对 $c_n = \\frac{b^n}{a^n}$，根就是 $\\frac{b}{a}$。这时级数是公比为 $\\frac{b z}{a}$ 的几何级数，与这个半径一致。",
  ],
  (rng) => {
    let [a, b] = [rng.int(2, 9), rng.int(1, 9)];
    while (gcd(a, b) !== 1) [a, b] = [rng.int(2, 9), rng.int(1, 9)];
    const answer = frac(a, b);
    const top = b === 1 ? "1" : `${b}^n`;
    return ask(
      [
        `What is the radius of convergence of $\\sum_{n \\ge 0} \\frac{${top}}{${a}^n} z^n$?`,
        `$\\sum_{n \\ge 0} \\frac{${top}}{${a}^n} z^n$ 的收敛半径是多少？`,
      ],
      answer,
      [frac(b, a), Q.of(a, 1), Q.of(1, 1), frac(a + b, b)].filter((v) => !v.eq(answer)),
      [
        `The $n$th root of the coefficient tends to $\\frac{${b}}{${a}}$, and the radius is its reciprocal, $${answer.toLatex()}$.`,
        `系数的 $n$ 次根趋于 $\\frac{${b}}{${a}}$，半径是它的倒数 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const orderFromProduct = point(
  "the-order-of-a-zero-of-a-product",
  ["The order of a zero of a product", "积的零点阶数"],
  [
    "Orders of zeros add when functions are multiplied, because each factor contributes its own power of $z - a$. At the origin, $\\sin z$ has order 1, since its series starts with $z$. And $1 - \\cos z$ has order 2, since its series starts with $\\frac{z^2}{2}$.",
    "函数相乘时零点的阶数相加，因为每个因子都贡献自己的 $z - a$ 的幂。在原点，$\\sin z$ 的阶是 1，因为它的级数从 $z$ 开始。$1 - \\cos z$ 的阶是 2，因为它的级数从 $\\frac{z^2}{2}$ 开始。",
  ],
  (rng) => {
    const [a, b, c] = [rng.int(1, 4), rng.int(1, 4), rng.int(1, 4)];
    const answer = a + b + 2 * c;
    const f = `${pow("z", a)} ${b === 1 ? "\\sin z" : `\\sin^{${b}} z`} ${pow("(1 - \\cos z)", c)}`;
    return ask(
      [`What is the order of the zero of $${f}$ at the origin?`, `$${f}$ 在原点的零点阶数是多少？`],
      answer,
      [a + b + c, a * b * c + 1, a + 2 * b + c, answer + 2].filter((v) => v !== answer),
      [`The orders add: $${a} + ${b} + 2 \\cdot ${c} = ${answer}$.`, `阶数相加：$${a} + ${b} + 2 \\cdot ${c} = ${answer}$。`],
    );
  },
);

const principalPart = point(
  "the-principal-part-of-an-essential-singularity",
  ["The principal part of an essential singularity", "本性奇点的主要部分"],
  [
    "Substituting $\\frac{c}{z}$ into the exponential series gives $e^{c / z} = \\sum \\frac{c^n}{n! z^n}$. Its Laurent series has infinitely many negative powers, which is the mark of an essential singularity at 0. So each coefficient can be read directly from the series.",
    "把 $\\frac{c}{z}$ 代入指数级数得 $e^{c / z} = \\sum \\frac{c^n}{n! z^n}$。它的洛朗级数有无穷多个负幂项，这正是 0 为本性奇点的标志。所以每个系数都可以直接从级数读出。",
  ],
  (rng) => {
    const [c, n] = [rng.int(1, 6), rng.int(2, 6)];
    let factorial = 1;
    for (let i = 2; i <= n; i++) factorial *= i;
    const answer = frac(c ** n, factorial);
    return ask(
      [
        `What is the coefficient of $z^{-${n}}$ in the Laurent series of $e^{${c} / z}$ at 0?`,
        `$e^{${c} / z}$ 在 0 处的洛朗级数中，$z^{-${n}}$ 的系数是多少？`,
      ],
      answer,
      [frac(c ** n, n), frac(c, factorial), frac(c ** n, factorial * n), Q.of(c ** n + 1, 1)],
      [
        `The coefficient is $\\frac{${c}^{${n}}}{${n}!} = ${answer.toLatex()}$.`,
        `系数是 $\\frac{${c}^{${n}}}{${n}!} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const removableValue = point(
  "the-value-at-a-removable-singularity",
  ["The value at a removable singularity", "可去奇点处的值"],
  [
    "A singularity is removable when the function has a finite limit there, and defining the function by this limit makes it analytic. For $\\frac{\\sin (a z)}{b z}$, the series of the sine begins with $a z$. So the quotient tends to $\\frac{a}{b}$ as $z$ tends to 0.",
    "如果函数在奇点处有有限极限，这个奇点就是可去的，用这个极限来定义函数值就使它解析。对 $\\frac{\\sin (a z)}{b z}$，正弦的级数从 $a z$ 开始。所以当 $z$ 趋于 0 时，商趋于 $\\frac{a}{b}$。",
  ],
  (rng) => {
    const [a, b] = [rng.int(2, 9), rng.int(2, 9)];
    const answer = frac(a, b);
    return ask(
      [
        `What value at 0 removes the singularity of $\\frac{\\sin(${a} z)}{${b} z}$?`,
        `在 0 处取什么值能去掉 $\\frac{\\sin(${a} z)}{${b} z}$ 的奇点？`,
      ],
      answer,
      [frac(b, a), Q.of(0, 1), Q.of(1, 1), Q.of(a, 1)].filter((v) => !v.eq(answer)),
      [
        `The series gives $\\frac{${a} z + \\cdots}{${b} z}$, which tends to $${answer.toLatex()}$.`,
        `由级数得 $\\frac{${a} z + \\cdots}{${b} z}$，它趋于 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const residueFromLaurent = point(
  "a-residue-from-a-laurent-series",
  ["A residue from a Laurent series", "由洛朗级数求留数"],
  [
    "The residue is by definition the coefficient of $\\frac{1}{z}$ in the Laurent series, and this works even at an essential singularity, where formulas for poles fail. Multiply out the series and collect every product that yields the power $-1$. Terms from different factors can both contribute.",
    "留数按定义是洛朗级数中 $\\frac{1}{z}$ 的系数，这在本性奇点处也适用，而极点的公式在那里失效。把级数乘开，收集所有产生 $-1$ 次幂的乘积。不同因子的项都可能有贡献。",
  ],
  (rng) => {
    const [a, b, c] = [rng.int(1, 5), rng.int(1, 5), rng.int(1, 5)];
    const answer = frac(a * c * c + 2 * b * c, 2);
    return ask(
      [
        `What is the residue of $(${coef(a, "z")} + ${b}) e^{${c} / z}$ at 0?`,
        `$(${coef(a, "z")} + ${b}) e^{${c} / z}$ 在 0 处的留数是多少？`,
      ],
      answer,
      [frac(a * c * c, 2), Q.of(b * c, 1), frac(a * c + b * c, 1), frac(a * c * c + b * c, 2)],
      [
        `The series is $1 + \\frac{${c}}{z} + \\frac{${c * c}}{2 z^2} + \\cdots$. The term $${coef(a, "z")}$ picks $\\frac{${c * c}}{2 z^2}$, and ${b} picks $\\frac{${c}}{z}$, for a total of $${answer.toLatex()}$.`,
        `级数是 $1 + \\frac{${c}}{z} + \\frac{${c * c}}{2 z^2} + \\cdots$。项 $${coef(a, "z")}$ 配 $\\frac{${c * c}}{2 z^2}$，${b} 配 $\\frac{${c}}{z}$，合计 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const residuesSum = point(
  "residues-of-a-rational-function-sum-to-zero",
  ["Residues of a rational function sum to zero", "有理函数的留数和为零"],
  [
    "If the degree of the denominator exceeds that of the numerator by at least 2, a large circle encloses every pole and the integral around it tends to 0 by the $ML$ inequality. The residue theorem then says that all the residues add up to 0. So one residue follows from the others.",
    "如果分母的次数比分子至少高 2，大圆围住所有极点，由 $ML$ 不等式，沿它的积分趋于 0。留数定理于是说明所有留数之和为 0。所以一个留数可以由其他留数得出。",
  ],
  (rng) => {
    const [x, y] = [rng.pick([-7, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]), rng.pick([-6, -4, -3, -2, -1, 1, 2, 3, 5, 7, 8])];
    const answer = -x - y;
    return ask(
      [
        `A rational function has exactly three poles, and its denominator has degree at least 2 more than its numerator. Two residues are ${x} and ${y}. What is the third?`,
        `一个有理函数恰有三个极点，分母次数比分子至少高 2。两个留数是 ${x} 和 ${y}。第三个是多少？`,
      ],
      answer,
      [x + y, x - y, y - x, answer + 1].filter((v) => v !== answer),
      [
        `All three add up to 0, so the third is $-(${x} ${y < 0 ? `- ${-y}` : `+ ${y}`}) = ${answer}$.`,
        `三个留数之和为 0，所以第三个是 $-(${x} ${y < 0 ? `- ${-y}` : `+ ${y}`}) = ${answer}$。`,
      ],
    );
  },
);

const squaredCosine = point(
  "the-integral-of-a-squared-trigonometric-sum",
  ["The integral of a squared trigonometric sum", "三角和平方的积分"],
  [
    "With $z = e^{i \\theta}$ on the unit circle, $\\cos \\theta = \\frac{z + z^{-1}}{2}$, so a power of the cosine becomes a Laurent polynomial. Only its constant term survives the integral over a full period. In particular, $\\int_0^{2 \\pi} \\cos^2 \\theta \\, d\\theta = \\pi$, and the mixed term integrates to 0.",
    "在单位圆上取 $z = e^{i \\theta}$，有 $\\cos \\theta = \\frac{z + z^{-1}}{2}$，所以余弦的幂变成洛朗多项式。在整个周期上积分时只有常数项留下。特别地，$\\int_0^{2 \\pi} \\cos^2 \\theta \\, d\\theta = \\pi$，交叉项的积分是 0。",
  ],
  (rng) => {
    const [a, b] = [rng.int(1, 9), rng.int(1, 9)];
    const answer = 2 * a * a + b * b;
    return ask(
      [
        `$\\int_0^{2 \\pi} (${a} + ${coef(b, "\\cos \\theta")})^2 \\, d\\theta = k \\pi$. What is $k$?`,
        `$\\int_0^{2 \\pi} (${a} + ${coef(b, "\\cos \\theta")})^2 \\, d\\theta = k \\pi$。$k$ 是多少？`,
      ],
      answer,
      [a * a + b * b, 2 * a * a + 2 * b * b, 2 * (a + b) * (a + b), answer + 2 * a * b].filter((v) => v !== answer),
      [
        `Expanding gives $${a * a} + ${2 * a * b} \\cos \\theta + ${b * b} \\cos^2 \\theta$, which integrates to $${2 * a * a} \\pi + ${b * b} \\pi$.`,
        `展开得 $${a * a} + ${2 * a * b} \\cos \\theta + ${b * b} \\cos^2 \\theta$，积分得 $${2 * a * a} \\pi + ${b * b} \\pi$。`,
      ],
    );
  },
);

const twoSquares = point(
  "an-integral-with-two-pairs-of-poles",
  ["An integral with two pairs of poles", "有两对极点的积分"],
  [
    "For $\\frac{1}{(x^2 + a^2)(x^2 + b^2)}$, the poles in the upper half-plane are $a i$ and $b i$. Their residues are $\\frac{1}{2 a i (b^2 - a^2)}$ and $\\frac{1}{2 b i (a^2 - b^2)}$. Adding them and multiplying by $2 \\pi i$ gives the integral $\\frac{\\pi}{a b (a + b)}$.",
    "对 $\\frac{1}{(x^2 + a^2)(x^2 + b^2)}$，上半平面的极点是 $a i$ 和 $b i$。它们的留数是 $\\frac{1}{2 a i (b^2 - a^2)}$ 和 $\\frac{1}{2 b i (a^2 - b^2)}$。相加再乘 $2 \\pi i$，得积分 $\\frac{\\pi}{a b (a + b)}$。",
  ],
  (rng) => {
    const a = rng.int(1, 8);
    const b = a + rng.int(1, 5);
    const m = a * b * (a + b);
    const answer = Q.of(1, m);
    return ask(
      [
        `$\\int_{-\\infty}^{\\infty} \\frac{dx}{(x^2 + ${a * a})(x^2 + ${b * b})} = k \\pi$. What is $k$?`,
        `$\\int_{-\\infty}^{\\infty} \\frac{dx}{(x^2 + ${a * a})(x^2 + ${b * b})} = k \\pi$。$k$ 是多少？`,
      ],
      answer,
      [Q.of(1, a * b), Q.of(1, a + b), Q.of(2, m), Q.of(1, a * a * b * b)],
      [
        `Here $a = ${a}$ and $b = ${b}$, so the value is $\\frac{\\pi}{${a} \\cdot ${b} \\cdot ${a + b}}$.`,
        `这里 $a = ${a}$，$b = ${b}$，所以值是 $\\frac{\\pi}{${a} \\cdot ${b} \\cdot ${a + b}}$。`,
      ],
    );
  },
);

const mobiusInverse = point(
  "inverting-a-mobius-map",
  ["Inverting a Möbius map", "求默比乌斯变换的逆"],
  [
    "Solving $w = \\frac{a z + b}{c z + d}$ for $z$ gives $z = \\frac{d w - b}{a - c w}$, which is again a Möbius transformation. So these maps form a group under composition, and each one is a bijection of the extended plane. A single preimage comes from substituting the value of $w$.",
    "由 $w = \\frac{a z + b}{c z + d}$ 解出 $z$，得 $z = \\frac{d w - b}{a - c w}$，它还是默比乌斯变换。所以这些映射在复合下构成群，每一个都是扩充平面上的双射。代入 $w$ 的值就能得到一个原像。",
  ],
  (rng) => {
    let [a, b, c, d] = [rng.int(1, 6), rng.int(1, 6), rng.int(1, 6), rng.int(1, 6)];
    while (a * d === b * c) d = rng.int(1, 6);
    let w = rng.int(1, 9);
    if (a === c * w) w += 1;
    const answer = frac(d * w - b, a - c * w);
    return ask(
      [
        `For $f(z) = \\frac{${coef(a, "z")} + ${b}}{${coef(c, "z")} + ${d}}$, which $z$ satisfies $f(z) = ${w}$?`,
        `对 $f(z) = \\frac{${coef(a, "z")} + ${b}}{${coef(c, "z")} + ${d}}$，哪个 $z$ 满足 $f(z) = ${w}$？`,
      ],
      answer,
      [frac(a * w + b, c * w + d), frac(d * w + b, a - c * w), frac(d * w - b, a + c * w), frac(b - d * w, c * w)],
      [
        `Clearing the denominator gives $${coef(a, "z")} + ${b} = ${w} (${coef(c, "z")} + ${d})$, so $z = \\frac{${d} \\cdot ${w} - ${b}}{${a} - ${c} \\cdot ${w}} = ${answer.toLatex()}$.`,
        `去分母得 $${coef(a, "z")} + ${b} = ${w} (${coef(c, "z")} + ${d})$，所以 $z = \\frac{${d} \\cdot ${w} - ${b}}{${a} - ${c} \\cdot ${w}} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const rotationAngle = point(
  "the-local-rotation-angle",
  ["The local rotation angle", "局部旋转角"],
  [
    "An analytic map with nonzero derivative rotates small shapes by the argument of $f'(z)$ and scales them by its modulus. This is why angles between curves are preserved. For $f(z) = z^n$, the derivative is $n z^{n-1}$, so the rotation at a point with argument $\\theta$ is $(n - 1) \\theta$.",
    "导数不为零的解析映射把小图形旋转 $f'(z)$ 的辐角，并按它的模伸缩。这就是曲线间夹角保持不变的原因。对 $f(z) = z^n$，导数是 $n z^{n-1}$，所以在辐角为 $\\theta$ 的点，旋转角是 $(n - 1) \\theta$。",
  ],
  (rng) => {
    const n = rng.int(2, 5);
    const theta = 15 * rng.int(1, 11);
    const r = rng.int(1, 4);
    const answer = ((n - 1) * theta) % 360;
    return ask(
      [
        `By how many degrees, from 0 up to 360, does $f(z) = z^{${n}}$ rotate small shapes at the point with modulus ${r} and argument $${theta}^\\circ$?`,
        `$f(z) = z^{${n}}$ 在模为 ${r}、辐角为 $${theta}^\\circ$ 的点，把小图形旋转多少度（从 0 到 360）？`,
      ],
      answer,
      [(n * theta) % 360, theta, (answer + 180) % 360, (answer + 90) % 360].filter((v) => v !== answer),
      [
        `The argument of $${n} z^{${n - 1}}$ is $${n - 1} \\cdot ${theta}$ degrees, which reduces to ${answer}.`,
        `$${n} z^{${n - 1}}$ 的辐角是 $${n - 1} \\cdot ${theta}$ 度，化简后是 ${answer}。`,
      ],
    );
  },
);

const cayley = point(
  "the-cayley-map",
  ["The Cayley map", "凯莱变换"],
  [
    "The Cayley map $f(z) = \\frac{z - i}{z + i}$ sends the upper half-plane onto the unit disc, since points above the real axis are closer to $i$ than to $-i$. So it carries $i$ to the center, and the positive imaginary axis onto a diameter of the disc.",
    "凯莱变换 $f(z) = \\frac{z - i}{z + i}$ 把上半平面映到单位圆盘上，因为实轴上方的点离 $i$ 比离 $-i$ 近。所以它把 $i$ 送到圆心，把正虚轴送到圆盘的一条直径上。",
  ],
  (rng) => {
    const t = rng.int(2, 31);
    const answer = frac(t - 1, t + 1);
    return ask(
      [
        `What is the image of the point $${t} i$ under $f(z) = \\frac{z - i}{z + i}$?`,
        `点 $${t} i$ 在 $f(z) = \\frac{z - i}{z + i}$ 下的像是什么？`,
      ],
      answer,
      [frac(t + 1, t - 1), frac(t, t + 1), frac(t - 1, t), frac(1 - t, t + 1)],
      [
        `The factor $i$ cancels: $\\frac{${t} i - i}{${t} i + i} = \\frac{${t - 1}}{${t + 1}}$, which lies in the unit disc.`,
        `因子 $i$ 约去：$\\frac{${t} i - i}{${t} i + i} = \\frac{${t - 1}}{${t + 1}}$，它在单位圆盘内。`,
      ],
    );
  },
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
