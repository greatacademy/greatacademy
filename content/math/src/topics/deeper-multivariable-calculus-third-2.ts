// Third knowledge points for thin topics of Multivariable Calculus, from changes of variables to
// line and surface integrals: the reverse question, a harder case or a common trap.
// See `deeperMultivariableCalculusThird2Points`.

import type { KnowledgePointDef, Rng, Text } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";
import { multivariableDrawings4 } from "../explanation-drawings-multivariable-4.ts";
import { multivariableDrawings5 } from "../explanation-drawings-multivariable-5.ts";
import { multivariableDrawings6 } from "../explanation-drawings-multivariable-6.ts";
import { multivariableDrawings7 } from "../explanation-drawings-multivariable-7.ts";
import { multivariableDrawings8 } from "../explanation-drawings-multivariable-8.ts";

import { explainedChoice, numberProblem, why } from "../problems.ts";
import { type Pair, point } from "../university-kit.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** apart drops the mistakes whose value is the answer or repeats an earlier one. */
const apart = (answer: number | Q, mistakes: readonly { readonly value: number | Q; readonly why: Text }[]) => {
  const key = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v).toLatex();
  return mistakes.filter((m, i, all) => key(m.value) !== key(answer) && all.findIndex((x) => key(x.value) === key(m.value)) === i);
};

/** nz picks a nonzero integer from -r to r. */
const nz = (rng: Rng, r: number) => rng.pick([...Array(2 * r + 1).keys()].map((i) => i - r).filter((i) => i !== 0));
/** triples are Pythagorean triples that keep lengths exact. */
const triples = [
  [3, 4, 5],
  [4, 3, 5],
  [5, 12, 13],
  [12, 5, 13],
  [8, 15, 17],
  [15, 8, 17],
] as const;
/** quads are integer direction vectors with integer length, as the first three entries and the last. */
const quads = [
  [1, 2, 2, 3],
  [2, 1, 2, 3],
  [2, 2, 1, 3],
  [2, 3, 6, 7],
  [3, 6, 2, 7],
  [1, 4, 8, 9],
  [4, 4, 7, 9],
] as const;
/** br writes a vector with angle brackets. */
const br = (...entries: readonly (string | number)[]) => `\\langle ${entries.join(", ")} \\rangle`;

const separatingProjection = {
  ...point(
    "a-projection-that-separates-the-variables",
    ["A projection that separates the variables", "使变量分离的投影"],
    [
      "A triple integral can be set up over any of the three coordinate planes. If the solid is a triangular prism along the $y$-axis, projecting to the $xz$-plane makes the limits for $y$ constant, so an integrand in $y$ alone splits off as a single factor. For $x + z = 4$, $0 \\le y \\le 1$ and the integrand $10y$, the triangle has area $8$ and $\\int_0^1 10y\\,dy = 5$, so the integral is $40$.\n\n> **Watch out.** The projection is a triangle of area $\\frac{a^2}{2}$, not the square $a^2$ or the length $a$; and the $y$ factor is $\\int_0^b ky\\,dy = \\frac{kb^2}{2}$, not $kb$.",
      "三重积分可以投影到三个坐标平面中的任何一个。如果立体是沿 $y$ 轴的三棱柱，投影到 $xz$ 平面后 $y$ 的积分限是常数，所以只含 $y$ 的被积函数可以单独分离成一个因子。对 $x + z = 4$，$0 \\le y \\le 1$ 与被积函数 $10y$，三角形面积为 $8$，$\\int_0^1 10y\\,dy = 5$，所以积分为 $40$。\n\n> **注意。** 投影是面积为 $\\frac{a^2}{2}$ 的三角形，不是正方形 $a^2$，也不是长度 $a$；$y$ 的因子是 $\\int_0^b ky\\,dy = \\frac{kb^2}{2}$，不是 $kb$。",
    ],
    (rng) => {
      const a = rng.int(1, 6);
      const b = rng.int(1, 6);
      const k = rng.int(1, 6);
      const answer = Q.of(k * a * a * b * b, 4);
      const area = Q.of(a * a, 2);
      const factor = Q.of(k * b * b, 2);
      const ky = poly([k, "y"]);
      return numberProblem({
        prompt: t(
          `$E$ is the solid bounded by $x = 0$, $z = 0$, $x + z = ${a}$, $y = 0$ and $y = ${b}$. Evaluate $\\iiint_{E} ${ky}\\,dV$.`,
          `$E$ 是由 $x = 0$，$z = 0$，$x + z = ${a}$，$y = 0$ 和 $y = ${b}$ 围成的立体。求 $\\iiint_{E} ${ky}\\,dV$。`,
        ),
        answer,
        mistakes: apart(answer, [
          why(
            Q.of(k * a * a * b * b, 2),
            `That uses the square of area $${a * a}$; the projection is a triangle of area $${area.toLatex()}$.`,
            `那是用面积为 $${a * a}$ 的正方形；投影是面积为 $${area.toLatex()}$ 的三角形。`,
          ),
          why(
            Q.of(k * a * b * b, 2),
            `That uses the length $${a}$ in place of the area $${area.toLatex()}$ of the triangle.`,
            `那是用长度 $${a}$ 代替三角形的面积 $${area.toLatex()}$。`,
          ),
          why(
            Q.of(k * a * a * b, 2),
            `That uses $${k * b}$ for the $y$ factor; $\\int_0^{${b}} ${ky}\\,dy = ${factor.toLatex()}$.`,
            `那是把 $y$ 的因子当成 $${k * b}$；$\\int_0^{${b}} ${ky}\\,dy = ${factor.toLatex()}$。`,
          ),
        ]),
        solution: walked(
          [
            [
              ["Project onto the xz-plane", "向 xz 平面投影"],
              t(
                `The projection is the triangle $x, z \\ge 0$, $x + z \\le ${a}$ of area $${area.toLatex()}$, and over it $0 \\le y \\le ${b}$.`,
                `投影是三角形 $x, z \\ge 0$，$x + z \\le ${a}$，面积为 $${area.toLatex()}$，其上 $0 \\le y \\le ${b}$。`,
              ),
            ],
            [
              ["Separate the y integral", "分离 y 的积分"],
              t(
                `$\\int_0^{${b}} ${ky}\\,dy = ${factor.toLatex()}$, the same over the whole triangle, so the integral is $${area.toLatex()} \\cdot ${factor.toLatex()} = ${answer.toLatex()}$.`,
                `$\\int_0^{${b}} ${ky}\\,dy = ${factor.toLatex()}$，在整个三角形上相同，所以积分为 $${area.toLatex()} \\cdot ${factor.toLatex()} = ${answer.toLatex()}$。`,
              ),
            ],
          ],
          t(
            `The volume of $E$ is $${area.toLatex()} \\cdot ${b} = ${Q.of(a * a * b, 2).toLatex()}$, and the average of $${ky}$ over $0 \\le y \\le ${b}$ is $${Q.of(k * b, 2).toLatex()}$; their product is $${answer.toLatex()}$.`,
            `$E$ 的体积为 $${area.toLatex()} \\cdot ${b} = ${Q.of(a * a * b, 2).toLatex()}$，$${ky}$ 在 $0 \\le y \\le ${b}$ 上的平均值为 $${Q.of(k * b, 2).toLatex()}$；两者之积为 $${answer.toLatex()}$。`,
          ),
        ),
      });
    },
  ),
  figure:
    multivariableDrawings4[
      "changing-the-order-of-integration-in-triple-integrals-changing-projection#a-projection-that-separates-the-variables"
    ],
};

const easierOrder = {
  ...point(
    "changing-the-order-to-do-the-easy-integrals-first",
    ["Changing the order to do the easy integrals first", "改变次序先做容易的积分"],
    [
      "The limits $0 \\le z \\le y \\le x \\le a$ describe one region, whatever the order of integration. When the integrand depends only on $x$, it pays to integrate $z$ and $y$ first: together they give the factor $\\frac{x^{2}}{2}$, the area of a triangle. For $\\int_0^1 \\int_z^1 \\int_y^1 x^2\\,dx\\,dy\\,dz$ this gives $\\int_0^1 x^2 \\cdot \\frac{x^2}{2}\\,dx = \\frac{1}{10}$.\n\n> **Watch out.** For fixed $x$ the pairs $0 \\le z \\le y \\le x$ fill a triangle of area $\\frac{x^2}{2}$; it is not $x^2$, and not the volume $\\frac{x^3}{6}$ of a tetrahedron.",
      "限制 $0 \\le z \\le y \\le x \\le a$ 描述同一个区域，与积分次序无关。当被积函数只依赖 $x$ 时，先对 $z$ 和 $y$ 积分更好：二者合起来给出因子 $\\frac{x^{2}}{2}$，即一个三角形的面积。对 $\\int_0^1 \\int_z^1 \\int_y^1 x^2\\,dx\\,dy\\,dz$，得 $\\int_0^1 x^2 \\cdot \\frac{x^2}{2}\\,dx = \\frac{1}{10}$。\n\n> **注意。** 固定 $x$ 时，满足 $0 \\le z \\le y \\le x$ 的点对构成面积为 $\\frac{x^2}{2}$ 的三角形；不是 $x^2$，也不是四面体的体积 $\\frac{x^3}{6}$。",
    ],
    (rng) => {
      const a = rng.int(1, 6);
      const k = rng.int(1, 9);
      const answer = Q.of(k * a ** 4, 8);
      const kx = poly([k, "x"]);
      const half = k === 2 ? "" : Q.of(k, 2).toLatex();
      return numberProblem({
        prompt: t(
          `Evaluate $\\int_{0}^{${a}} \\int_{z}^{${a}} \\int_{y}^{${a}} ${kx}\\,dx\\,dy\\,dz$ by changing the order of integration.`,
          `通过改变积分次序，求 $\\int_{0}^{${a}} \\int_{z}^{${a}} \\int_{y}^{${a}} ${kx}\\,dx\\,dy\\,dz$。`,
        ),
        answer,
        mistakes: apart(answer, [
          why(
            Q.of(k * a ** 4, 4),
            "The $z$ and $y$ integrals give the triangle area $\\frac{x^{2}}{2}$, not $x^{2}$.",
            "对 $z$ 和 $y$ 的积分给出三角形面积 $\\frac{x^{2}}{2}$，不是 $x^{2}$。",
          ),
          why(
            Q.of(k * a ** 4, 24),
            "That uses $\\frac{x^{3}}{6}$, a volume, for the inner factor; two integrals give the area $\\frac{x^{2}}{2}$.",
            "那是把内层因子当成体积 $\\frac{x^{3}}{6}$；两次积分给出的是面积 $\\frac{x^{2}}{2}$。",
          ),
          why(
            Q.of(k * a ** 3, 6),
            `That is $${k}$ times the volume of the region; the integrand is $${kx}$, not $${k}$.`,
            `那是 $${k}$ 乘以区域的体积；被积函数是 $${kx}$，不是 $${k}$。`,
          ),
        ]),
        solution: walked(
          [
            [
              ["Rewrite the region", "改写区域"],
              t(
                `The limits say $0 \\le z \\le y \\le x \\le ${a}$, so in the order $dz\\,dy\\,dx$ the integral is $\\int_0^{${a}} \\int_0^x \\int_0^y ${kx}\\,dz\\,dy\\,dx$.`,
                `积分限表示 $0 \\le z \\le y \\le x \\le ${a}$，所以按 $dz\\,dy\\,dx$ 次序积分为 $\\int_0^{${a}} \\int_0^x \\int_0^y ${kx}\\,dz\\,dy\\,dx$。`,
              ),
            ],
            [
              ["Integrate in z and y", "对 z 和 y 积分"],
              t(
                `$\\int_0^x \\int_0^y dz\\,dy = \\frac{x^{2}}{2}$, so the integrand becomes $${half}x^{3}$.`,
                `$\\int_0^x \\int_0^y dz\\,dy = \\frac{x^{2}}{2}$，所以被积函数变为 $${half}x^{3}$。`,
              ),
            ],
            [
              ["Integrate in x", "对 x 积分"],
              t(`$\\int_0^{${a}} ${half}x^{3}\\,dx = ${answer.toLatex()}$.`, `$\\int_0^{${a}} ${half}x^{3}\\,dx = ${answer.toLatex()}$。`),
            ],
          ],
          t(
            `The region is a tetrahedron with vertices whose $x$-coordinates are $0, ${a}, ${a}, ${a}$, so the average of $x$ is $${Q.of(3 * a, 4).toLatex()}$; times its volume $${Q.of(a ** 3, 6).toLatex()}$ and $${k}$ this is $${answer.toLatex()}$.`,
            `区域是四面体，顶点的 $x$ 坐标为 $0, ${a}, ${a}, ${a}$，所以 $x$ 的平均值为 $${Q.of(3 * a, 4).toLatex()}$；乘以体积 $${Q.of(a ** 3, 6).toLatex()}$ 和 $${k}$ 得 $${answer.toLatex()}$。`,
          ),
        ),
      });
    },
  ),
  figure:
    multivariableDrawings4[
      "changing-the-order-of-integration-in-triple-integrals-changing-region#changing-the-order-to-do-the-easy-integrals-first"
    ],
};

const ellipticAnnulus = point(
  "the-area-between-two-similar-ellipses",
  ["The area between two similar ellipses", "两个相似椭圆之间的面积"],
  [
    "The substitution $x = pu$, $y = qv$ turns an elliptical ring into a circular ring, and every area is multiplied by the constant Jacobian $pq$. So the area of the ring is $pq$ times the difference of the two circular areas, using the squared radii. For $1 \\le \\frac{x^2}{49} + y^2 \\le 4$ the circular ring $1 \\le u^2 + v^2 \\le 4$ has area $3\\pi$, and the elliptical ring has area $7 \\cdot 3\\pi = 21\\pi$.\n\n> **Watch out.** The inner ellipse is a hole: subtract its area. The right side $R^2$ is the square of the radius, so the circular ring has area $(R^2 - 1)\\pi$, not $(R - 1)\\pi$.",
    "代换 $x = pu$，$y = qv$ 把椭圆环变成圆环，所有面积都乘以常数雅可比行列式 $pq$。所以环的面积是 $pq$ 乘以两个圆面积之差，用的是半径的平方。对 $1 \\le \\frac{x^2}{49} + y^2 \\le 4$，圆环 $1 \\le u^2 + v^2 \\le 4$ 面积为 $3\\pi$，椭圆环面积为 $7 \\cdot 3\\pi = 21\\pi$。\n\n> **注意。** 内椭圆是空洞，要减去它的面积。右边的 $R^2$ 是半径的平方，所以圆环面积是 $(R^2 - 1)\\pi$，不是 $(R - 1)\\pi$。",
  ],
  (rng) => {
    const p = rng.int(2, 6);
    const q = rng.int(2, 6);
    const R = rng.int(2, 5);
    const answer = p * q * (R * R - 1);
    return numberProblem({
      prompt: t(
        `Find $\\frac{A}{\\pi}$, where $A$ is the area of the region $1 \\le \\frac{x^{2}}{${p * p}} + \\frac{y^{2}}{${q * q}} \\le ${R * R}$.`,
        `求 $\\frac{A}{\\pi}$，其中 $A$ 是区域 $1 \\le \\frac{x^{2}}{${p * p}} + \\frac{y^{2}}{${q * q}} \\le ${R * R}$ 的面积。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          p * q * R * R,
          "That is the area of the outer ellipse; the inner ellipse is a hole to subtract.",
          "那是外椭圆的面积；内椭圆是要减去的空洞。",
        ),
        why(
          (p + q) * (R * R - 1),
          `That adds the stretch factors; the Jacobian is their product $${p} \\cdot ${q}$.`,
          `那是把拉伸比例相加；雅可比行列式是它们的乘积 $${p} \\cdot ${q}$。`,
        ),
        why(
          p * q * (R - 1),
          `That treats $${R * R}$ as a radius; it is the square of the radius $${R}$.`,
          `那是把 $${R * R}$ 当作半径；它是半径 $${R}$ 的平方。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Substitute", "代换"],
            t(
              `With $x = ${p}u$ and $y = ${q}v$, the region becomes $1 \\le u^{2} + v^{2} \\le ${R * R}$, of area $${R * R - 1}\\pi$.`,
              `令 $x = ${p}u$，$y = ${q}v$，区域变为 $1 \\le u^{2} + v^{2} \\le ${R * R}$，面积是 $${R * R - 1}\\pi$。`,
            ),
          ],
          [
            ["Multiply by the Jacobian", "乘以雅可比行列式"],
            t(
              `The Jacobian is $${p * q}$, so $\\frac{A}{\\pi} = ${p * q} \\cdot ${R * R - 1} = ${answer}$.`,
              `雅可比行列式为 $${p * q}$，所以 $\\frac{A}{\\pi} = ${p * q} \\cdot ${R * R - 1} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `The outer ellipse has semi-axes $${p * R}$ and $${q * R}$, area $${p * q * R * R}\\pi$; the inner one has semi-axes $${p}$ and $${q}$, area $${p * q}\\pi$; and $${p * q * R * R} - ${p * q} = ${answer}$.`,
          `外椭圆半轴为 $${p * R}$ 和 $${q * R}$，面积 $${p * q * R * R}\\pi$；内椭圆半轴为 $${p}$ 和 $${q}$，面积 $${p * q}\\pi$；而 $${p * q * R * R} - ${p * q} = ${answer}$。`,
        ),
      ),
    });
  },
);

const differenceOfSquares = {
  ...point(
    "a-difference-of-squares-under-a-rotated-rectangle",
    ["A difference of squares under a rotated rectangle", "旋转矩形上的平方差"],
    [
      "With $u = x + y$ and $v = x - y$, a rotated rectangle becomes an ordinary one and $x^{2} - y^{2}$ becomes $uv$. For $0 \\le x + y \\le 8$, $0 \\le x - y \\le 2$ the integral of $x^2 - y^2$ is $\\frac{1}{2} \\cdot \\frac{64}{2} \\cdot \\frac{4}{2} = 32$.\n\n> **Watch out.** The trap is the area element: the Jacobian of $(x, y)$ in terms of $(u, v)$ has absolute value $\\frac{1}{2}$, not $2$, and it must not be left out.",
      "用 $u = x + y$，$v = x - y$，旋转的矩形变成普通矩形，$x^{2} - y^{2}$ 变成 $uv$。对 $0 \\le x + y \\le 8$，$0 \\le x - y \\le 2$，$x^2 - y^2$ 的积分为 $\\frac{1}{2} \\cdot \\frac{64}{2} \\cdot \\frac{4}{2} = 32$。\n\n> **注意。** 陷阱在面积元：$(x, y)$ 关于 $(u, v)$ 的雅可比行列式的绝对值是 $\\frac{1}{2}$，而不是 $2$，也不能省略。",
    ],
    (rng) => {
      const a = rng.int(1, 6);
      const b = rng.int(1, 6);
      const k = rng.int(1, 12);
      const answer = Q.of(k * a * a * b * b, 8);
      const kk = k === 1 ? "" : `${k}`;
      return numberProblem({
        prompt: t(
          `Evaluate $\\iint_{R} ${kk}(x^{2} - y^{2})\\,dA$, where $R = \\{(x, y) : 0 \\le x + y \\le ${a},\\ 0 \\le x - y \\le ${b}\\}$.`,
          `求 $\\iint_{R} ${kk}(x^{2} - y^{2})\\,dA$，其中 $R = \\{(x, y) : 0 \\le x + y \\le ${a},\\ 0 \\le x - y \\le ${b}\\}$。`,
        ),
        answer,
        mistakes: apart(answer, [
          why(
            Q.of(k * a * a * b * b, 4),
            "The area element $\\frac{1}{2}\\,du\\,dv$ is missing its factor $\\frac{1}{2}$.",
            "面积元 $\\frac{1}{2}\\,du\\,dv$ 漏了因子 $\\frac{1}{2}$。",
          ),
          why(
            Q.of(k * a * a * b * b, 2),
            "That multiplies by $2$; the area element is $\\frac{1}{2}\\,du\\,dv$, the reciprocal of $2$.",
            "那是乘以 $2$；面积元是 $\\frac{1}{2}\\,du\\,dv$，是 $2$ 的倒数。",
          ),
          why(
            Q.of(k * a * b, 2),
            "That treats the integrand as constant; $x^2 - y^2 = uv$ must be integrated too.",
            "那是把被积函数当作常数；$x^2 - y^2 = uv$ 也要积分。",
          ),
        ]),
        solution: walked(
          [
            [
              ["Change variables", "变量代换"],
              t(
                `$x^2 - y^2 = (x + y)(x - y) = uv$, the region becomes $[0, ${a}] \\times [0, ${b}]$, and $dA = \\frac{1}{2}\\,du\\,dv$.`,
                `$x^2 - y^2 = (x + y)(x - y) = uv$，区域变为 $[0, ${a}] \\times [0, ${b}]$，$dA = \\frac{1}{2}\\,du\\,dv$。`,
              ),
            ],
            [
              ["Integrate", "积分"],
              t(
                `$\\int_{0}^{${a}} \\int_{0}^{${b}} ${kk}uv \\cdot \\frac{1}{2} \\, dv \\, du$: the $u$ integral gives $${Q.of(a * a, 2).toLatex()}$ and the $v$ integral gives $${Q.of(b * b, 2).toLatex()}$, so the result is $${answer.toLatex()}$.`,
                `$\\int_{0}^{${a}} \\int_{0}^{${b}} ${kk}uv \\cdot \\frac{1}{2} \\, dv \\, du$：对 $u$ 积分得 $${Q.of(a * a, 2).toLatex()}$，对 $v$ 积分得 $${Q.of(b * b, 2).toLatex()}$，所以结果是 $${answer.toLatex()}$。`,
              ),
            ],
          ],
          t(
            `$R$ has area $\\frac{${a * b}}{2}$ and $uv$ averages $\\frac{${a}}{2} \\cdot \\frac{${b}}{2}$ over it, so the integral is $${k} \\cdot \\frac{${a * b}}{2} \\cdot \\frac{${a * b}}{4} = ${answer.toLatex()}$.`,
            `$R$ 的面积为 $\\frac{${a * b}}{2}$，$uv$ 在其上的平均值为 $\\frac{${a}}{2} \\cdot \\frac{${b}}{2}$，所以积分为 $${k} \\cdot \\frac{${a * b}}{2} \\cdot \\frac{${a * b}}{4} = ${answer.toLatex()}$。`,
          ),
        ),
      });
    },
  ),
  figure:
    multivariableDrawings4["computing-double-integrals-using-a-change-of-variables#a-difference-of-squares-under-a-rotated-rectangle"],
};

const oppositeDistance = {
  ...point(
    "the-distance-across-the-axis",
    ["The distance across the axis", "穿过轴的距离"],
    [
      "Two points with the same $r$ and angles differing by $\\pi$ lie on opposite sides of the $z$-axis, so their horizontal separation is $2r$. Adding the difference in height through the Pythagorean theorem gives the distance, without converting to Cartesian coordinates. For $\\left(10, \\frac{\\pi}{8}, 0\\right)$ and $\\left(10, \\frac{9\\pi}{8}, 21\\right)$ the distance is $\\sqrt{20^2 + 21^2} = 29$.\n\n> **Watch out.** The horizontal separation is $2r$, not $r$, and the two separations combine by the Pythagorean theorem, not by adding them.",
      "$r$ 相同、角度相差 $\\pi$ 的两点位于 $z$ 轴的两侧，所以水平距离是 $2r$。再用勾股定理计入高度差就得到距离，不必转换成直角坐标。对 $\\left(10, \\frac{\\pi}{8}, 0\\right)$ 与 $\\left(10, \\frac{9\\pi}{8}, 21\\right)$，距离为 $\\sqrt{20^2 + 21^2} = 29$。\n\n> **注意。** 水平距离是 $2r$ 而不是 $r$；两个方向的距离用勾股定理合成，而不是相加。",
    ],
    (rng) => {
      const [a, b, c] = rng.pick([
        [4, 3, 5],
        [12, 5, 13],
        [8, 15, 17],
      ] as const);
      const k = rng.int(1, 3);
      const [t1, t2] = rng.pick([
        ["\\frac{\\pi}{6}", "\\frac{7\\pi}{6}"],
        ["\\frac{\\pi}{4}", "\\frac{5\\pi}{4}"],
        ["\\frac{\\pi}{3}", "\\frac{4\\pi}{3}"],
        ["\\frac{\\pi}{2}", "\\frac{3\\pi}{2}"],
      ] as const);
      const r = (a * k) / 2;
      const z1 = rng.int(-6, 6);
      const z2 = z1 + rng.pick([-1, 1]) * b * k;
      const answer = c * k;
      return numberProblem({
        prompt: t(
          `Find the distance between the points with cylindrical coordinates $(${r}, ${t1}, ${z1})$ and $(${r}, ${t2}, ${z2})$.`,
          `求柱坐标为 $(${r}, ${t1}, ${z1})$ 和 $(${r}, ${t2}, ${z2})$ 的两点之间的距离。`,
        ),
        answer,
        mistakes: apart(answer, [
          why(
            b * k,
            `That is only the difference in height; the points are also $${a * k}$ apart horizontally.`,
            `那只是高度差；两点在水平方向上还相距 $${a * k}$。`,
          ),
          why(
            (a + b) * k,
            `That adds $${a * k}$ and $${b * k}$; perpendicular separations combine by the Pythagorean theorem.`,
            `那是把 $${a * k}$ 与 $${b * k}$ 相加；互相垂直的距离用勾股定理合成。`,
          ),
          why(
            a * k,
            `That is only the horizontal separation $2r$; the heights also differ by $${b * k}$.`,
            `那只是水平距离 $2r$；高度还相差 $${b * k}$。`,
          ),
        ]),
        solution: walked(
          [
            [
              ["Find the horizontal separation", "求水平距离"],
              t(
                `The angles differ by $\\pi$, so the points are on opposite sides of the axis: $2 \\cdot ${r} = ${a * k}$.`,
                `两个角相差 $\\pi$，两点在轴的两侧：$2 \\cdot ${r} = ${a * k}$。`,
              ),
            ],
            [
              ["Combine with the height", "与高度差合成"],
              t(
                `The heights differ by $${b * k}$, and the distance is $\\sqrt{${(a * k) ** 2} + ${(b * k) ** 2}} = ${answer}$.`,
                `高度差是 $${b * k}$，距离是 $\\sqrt{${(a * k) ** 2} + ${(b * k) ** 2}} = ${answer}$。`,
              ),
            ],
          ],
          t(
            `$${answer}$ is more than each of $${a * k}$ and $${b * k}$ and less than their sum $${(a + b) * k}$, as the hypotenuse of a right triangle must be.`,
            `$${answer}$ 大于 $${a * k}$ 和 $${b * k}$，又小于它们的和 $${(a + b) * k}$，正如直角三角形的斜边应有的那样。`,
          ),
        ),
      });
    },
  ),
  figure: multivariableDrawings5["cylindrical-polar-coordinates#the-distance-across-the-axis"],
};

const offAxisCylinder = {
  ...point(
    "a-cylinder-whose-axis-is-not-the-z-axis",
    ["A cylinder whose axis is not the z-axis", "轴不是 z 轴的圆柱"],
    [
      "The equation $r = p\\cos\\theta + q\\sin\\theta$ looks unlike a cylinder, but multiplying by $r$ gives $x^{2} + y^{2} = px + qy$. Completing the square shows a circular cylinder through the $z$-axis, with radius $\\frac{1}{2}\\sqrt{p^{2} + q^{2}}$. For $r = 7\\cos\\theta + 24\\sin\\theta$ the center is $\\left(\\frac{7}{2}, 12\\right)$ and the radius is $\\frac{1}{2}\\sqrt{49 + 576} = \\frac{25}{2}$.\n\n> **Watch out.** $\\sqrt{p^2 + q^2}$ is the diameter, the largest value of $r$; the radius is half of it. And the coordinates of the center combine by the Pythagorean theorem, not by adding.",
      "方程 $r = p\\cos\\theta + q\\sin\\theta$ 看起来不像圆柱，但两边乘以 $r$ 得 $x^{2} + y^{2} = px + qy$。配方后可知，这是过 $z$ 轴的圆柱，半径为 $\\frac{1}{2}\\sqrt{p^{2} + q^{2}}$。对 $r = 7\\cos\\theta + 24\\sin\\theta$，圆心为 $\\left(\\frac{7}{2}, 12\\right)$，半径为 $\\frac{1}{2}\\sqrt{49 + 576} = \\frac{25}{2}$。\n\n> **注意。** $\\sqrt{p^2 + q^2}$ 是直径，即 $r$ 的最大值；半径是它的一半。圆心坐标要用勾股定理合成，而不是相加。",
    ],
    (rng) => {
      const [a, b, c] = rng.pick(triples);
      const u = rng.int(1, 3);
      const p = 2 * a * u * rng.pick([-1, 1]);
      const q = 2 * b * u * rng.pick([-1, 1]);
      const answer = c * u;
      const eq = poly([p, "\\cos\\theta"], [q, "\\sin\\theta"]);
      return numberProblem({
        prompt: t(
          `The surface with cylindrical equation $r = ${eq}$ is a circular cylinder. Find its radius.`,
          `柱坐标方程 $r = ${eq}$ 表示的曲面是圆柱。求它的半径。`,
        ),
        answer,
        mistakes: apart(answer, [
          why(
            2 * c * u,
            `$${2 * c * u}$ is the diameter, the largest value of $r$; the radius is half of it.`,
            `$${2 * c * u}$ 是直径，即 $r$ 的最大值；半径是它的一半。`,
          ),
          why(
            (a + b) * u,
            `That adds $${a * u}$ and $${b * u}$; the center is at distance $\\sqrt{${a * u}^2 + ${b * u}^2}$ from the axis.`,
            `那是把 $${a * u}$ 与 $${b * u}$ 相加；圆心到轴的距离是 $\\sqrt{${a * u}^2 + ${b * u}^2}$。`,
          ),
          why(
            c * c * u * u,
            `$${c * c * u * u}$ is the square of the radius; take its square root.`,
            `$${c * c * u * u}$ 是半径的平方；还要开平方。`,
          ),
        ]),
        solution: walked(
          [
            [
              ["Multiply by r", "乘以 r"],
              t(
                `$r^2 = ${poly([p, "r\\cos\\theta"], [q, "r\\sin\\theta"])}$ is $x^{2} + y^{2} = ${poly([p, "x"], [q, "y"])}$.`,
                `$r^2 = ${poly([p, "r\\cos\\theta"], [q, "r\\sin\\theta"])}$ 即 $x^{2} + y^{2} = ${poly([p, "x"], [q, "y"])}$。`,
              ),
            ],
            [
              ["Complete the square", "配方"],
              t(
                `The center is $(${p / 2}, ${q / 2})$ and the radius squared is $${a * u}^{2} + ${b * u}^{2} = ${answer * answer}$, so the radius is $${answer}$.`,
                `圆心为 $(${p / 2}, ${q / 2})$，半径的平方是 $${a * u}^{2} + ${b * u}^{2} = ${answer * answer}$，所以半径是 $${answer}$。`,
              ),
            ],
          ],
          t(
            `The circle passes through the origin, since $x = y = 0$ satisfies the equation, so its radius is the distance from the center $(${p / 2}, ${q / 2})$ to the origin: $${answer}$.`,
            `圆经过原点，因为 $x = y = 0$ 满足方程，所以半径就是圆心 $(${p / 2}, ${q / 2})$ 到原点的距离：$${answer}$。`,
          ),
        ),
      });
    },
  ),
  figure: multivariableDrawings5["surfaces-in-cylindrical-polar-coordinates#a-cylinder-whose-axis-is-not-the-z-axis"],
};

const sphericalKinds = {
  ...point(
    "recognizing-planes-and-cylinders-in-spherical-form",
    ["Recognizing planes and cylinders in spherical form", "识别球坐标形式的平面和圆柱"],
    [
      "Since $z = \\rho\\cos\\varphi$ and $r = \\rho\\sin\\varphi$, the equation $\\rho = a\\sec\\varphi$ is a plane and $\\rho = a\\csc\\varphi$ is a cylinder. And $\\rho = 2a\\cos\\varphi$ becomes $x^{2} + y^{2} + z^{2} = 2az$ after multiplying by $\\rho$, a sphere not centered at the origin. So $\\rho = 12\\sec\\varphi$ is the plane $z = 12$.\n\n> **Watch out.** $\\sec\\varphi$ goes with $z = \\rho\\cos\\varphi$, a horizontal plane, and $\\csc\\varphi$ with $r = \\rho\\sin\\varphi$, a cylinder; do not swap them. The sphere $\\rho = 2a\\cos\\varphi$ has radius $a$, not $2a$, and passes through the origin.",
      "由于 $z = \\rho\\cos\\varphi$，$r = \\rho\\sin\\varphi$，方程 $\\rho = a\\sec\\varphi$ 是平面，$\\rho = a\\csc\\varphi$ 是圆柱。而 $\\rho = 2a\\cos\\varphi$ 两边乘以 $\\rho$ 后变成 $x^{2} + y^{2} + z^{2} = 2az$，是球心不在原点的球面。所以 $\\rho = 12\\sec\\varphi$ 是平面 $z = 12$。\n\n> **注意。** $\\sec\\varphi$ 对应 $z = \\rho\\cos\\varphi$，是水平面；$\\csc\\varphi$ 对应 $r = \\rho\\sin\\varphi$，是圆柱；不要弄反。球面 $\\rho = 2a\\cos\\varphi$ 的半径是 $a$ 而不是 $2a$，并且经过原点。",
    ],
    (rng) => {
      const a = rng.int(1, 9);
      const kind = rng.int(0, 3);
      const lead = a === 1 ? "" : `${a}`;
      const eq = [`${lead}\\sec\\varphi`, `${lead}\\csc\\varphi`, `${2 * a}\\cos\\varphi`, `${a}`][kind] as string;
      const options: Pair[] = [
        [`The plane $z = ${a}$`, `平面 $z = ${a}$`],
        [`The cylinder $x^{2} + y^{2} = ${a * a}$`, `圆柱 $x^{2} + y^{2} = ${a * a}$`],
        [`The sphere of radius $${a}$ centered at $(0, 0, ${a})$`, `半径为 $${a}$、球心在 $(0, 0, ${a})$ 的球面`],
        [`The sphere of radius $${a}$ centered at the origin`, `半径为 $${a}$、球心在原点的球面`],
      ];
      const correct = options[kind] as Pair;
      const whys: Pair[] = [
        [
          `Multiplying by $\\cos\\varphi$ gives $\\rho\\cos\\varphi = ${a}$, that is $z = ${a}$.`,
          `两边乘以 $\\cos\\varphi$，得 $\\rho\\cos\\varphi = ${a}$，即 $z = ${a}$。`,
        ],
        [
          `Multiplying by $\\sin\\varphi$ gives $\\rho\\sin\\varphi = ${a}$, that is $r = ${a}$, a cylinder.`,
          `两边乘以 $\\sin\\varphi$，得 $\\rho\\sin\\varphi = ${a}$，即 $r = ${a}$，是圆柱。`,
        ],
        [
          `Multiplying by $\\rho$ gives $x^{2} + y^{2} + z^{2} = ${2 * a}z$, and completing the square gives the center $(0, 0, ${a})$.`,
          `两边乘以 $\\rho$，得 $x^{2} + y^{2} + z^{2} = ${2 * a}z$，配方后球心是 $(0, 0, ${a})$。`,
        ],
        [
          `A constant $\\rho$ means a constant distance from the origin, so this is a sphere around the origin.`,
          `$\\rho$ 为常数表示到原点的距离不变，所以这是以原点为球心的球面。`,
        ],
      ];
      const reading = whys[kind] as Pair;
      const forms: Pair[] = [
        [
          `The plane $z = ${a}$ is $\\rho\\cos\\varphi = ${a}$, that is $\\rho = ${lead}\\sec\\varphi$`,
          `平面 $z = ${a}$ 是 $\\rho\\cos\\varphi = ${a}$，即 $\\rho = ${lead}\\sec\\varphi$`,
        ],
        [
          `The cylinder $r = ${a}$ is $\\rho\\sin\\varphi = ${a}$, that is $\\rho = ${lead}\\csc\\varphi$`,
          `圆柱 $r = ${a}$ 是 $\\rho\\sin\\varphi = ${a}$，即 $\\rho = ${lead}\\csc\\varphi$`,
        ],
        [
          `That sphere is $x^{2} + y^{2} + z^{2} = ${2 * a}z$, that is $\\rho = ${2 * a}\\cos\\varphi$`,
          `那个球面是 $x^{2} + y^{2} + z^{2} = ${2 * a}z$，即 $\\rho = ${2 * a}\\cos\\varphi$`,
        ],
        [`That sphere has the constant $\\rho = ${a}$`, `那个球面是常数 $\\rho = ${a}$`],
      ];
      const checks: Pair[] = [
        [
          `At $\\varphi = 0$, $\\rho = ${a}$ gives $(0, 0, ${a})$, and at $\\varphi = \\frac{\\pi}{3}$, $\\rho = ${2 * a}$ gives height $${2 * a} \\cdot \\frac{1}{2} = ${a}$ again.`,
          `$\\varphi = 0$ 时 $\\rho = ${a}$，得 $(0, 0, ${a})$；$\\varphi = \\frac{\\pi}{3}$ 时 $\\rho = ${2 * a}$，高度为 $${2 * a} \\cdot \\frac{1}{2} = ${a}$，仍相同。`,
        ],
        [
          `At $\\varphi = \\frac{\\pi}{2}$, $\\rho = ${a}$ gives $(${a}, 0, 0)$, and at $\\varphi = \\frac{\\pi}{6}$, $\\rho = ${2 * a}$ gives distance $${2 * a} \\cdot \\frac{1}{2} = ${a}$ from the axis again.`,
          `$\\varphi = \\frac{\\pi}{2}$ 时 $\\rho = ${a}$，得 $(${a}, 0, 0)$；$\\varphi = \\frac{\\pi}{6}$ 时 $\\rho = ${2 * a}$，到轴的距离为 $${2 * a} \\cdot \\frac{1}{2} = ${a}$，仍相同。`,
        ],
        [
          `At $\\varphi = 0$, $\\rho = ${2 * a}$ gives $(0, 0, ${2 * a})$, and at $\\varphi = \\frac{\\pi}{2}$, $\\rho = 0$ gives the origin; both are at distance $${a}$ from $(0, 0, ${a})$.`,
          `$\\varphi = 0$ 时 $\\rho = ${2 * a}$，得 $(0, 0, ${2 * a})$；$\\varphi = \\frac{\\pi}{2}$ 时 $\\rho = 0$，得原点；两者到 $(0, 0, ${a})$ 的距离都是 $${a}$。`,
        ],
        [
          `The points $(${a}, 0, 0)$ and $(0, 0, ${a})$ both have $\\rho = ${a}$, and both are at distance $${a}$ from the origin.`,
          `点 $(${a}, 0, 0)$ 与 $(0, 0, ${a})$ 的 $\\rho$ 都是 $${a}$，到原点的距离都是 $${a}$。`,
        ],
      ];
      const text = ([en, zh]: Pair) => t(en, zh);
      return explainedChoice(rng, {
        prompt: t(`Which surface has the spherical equation $\\rho = ${eq}$?`, `球坐标方程 $\\rho = ${eq}$ 表示哪个曲面？`),
        correct: text(correct),
        wrong: [0, 1, 2, 3].filter((i) => i !== kind).map((i) => ({ option: text(options[i] as Pair), why: text(forms[i] as Pair) })),
        solution: walked([[["Convert to Cartesian form", "化为直角坐标"], text(reading)]], text(checks[kind] as Pair)),
      });
    },
  ),
  figure: multivariableDrawings5["surfaces-in-spherical-polar-coordinates#recognizing-planes-and-cylinders-in-spherical-form"],
};

const zSquaredEllipsoid = point(
  "a-nonconstant-integrand-over-an-ellipsoid",
  ["A nonconstant integrand over an ellipsoid", "椭球上的非常数被积函数"],
  [
    "Scaling an ellipsoid to the unit ball multiplies volume by $pqr$, and the integrand must be rewritten too: $z^{2}$ becomes $r^{2}w^{2}$. Over the unit ball, symmetry gives $\\iiint w^{2}\\,dV = \\frac{1}{3}\\iiint \\rho^{2}\\,dV = \\frac{4\\pi}{15}$. For $x^2 + y^2 + \\frac{z^2}{36} \\le 1$ the integral of $z^2$ is $6 \\cdot 36 \\cdot \\frac{4\\pi}{15} = \\frac{288}{5}\\pi$.\n\n> **Watch out.** The factor $r$ appears three times: once in the Jacobian $pqr$ and twice in $z^2 = r^2w^2$. And $\\iiint w^2\\,dV = \\frac{4\\pi}{15}$ over the unit ball, not its volume $\\frac{4\\pi}{3}$.",
    "把椭球缩放成单位球，体积乘以 $pqr$，被积函数也必须改写：$z^{2}$ 变成 $r^{2}w^{2}$。在单位球上，由对称性得 $\\iiint w^{2}\\,dV = \\frac{1}{3}\\iiint \\rho^{2}\\,dV = \\frac{4\\pi}{15}$。对 $x^2 + y^2 + \\frac{z^2}{36} \\le 1$，$z^2$ 的积分为 $6 \\cdot 36 \\cdot \\frac{4\\pi}{15} = \\frac{288}{5}\\pi$。\n\n> **注意。** 因子 $r$ 出现三次：雅可比行列式 $pqr$ 中一次，$z^2 = r^2w^2$ 中两次。单位球上 $\\iiint w^2\\,dV = \\frac{4\\pi}{15}$，不是它的体积 $\\frac{4\\pi}{3}$。",
  ],
  (rng) => {
    const p = rng.int(1, 5);
    const q = rng.int(1, 5);
    const r = rng.int(2, 5);
    const answer = Q.of(4 * p * q * r ** 3, 15);
    return numberProblem({
      prompt: t(
        `Find $\\frac{1}{\\pi}\\iiint_{E} z^{2}\\,dV$, where $E$ is the solid ellipsoid $\\frac{x^{2}}{${p * p}} + \\frac{y^{2}}{${q * q}} + \\frac{z^{2}}{${r * r}} \\le 1$.`,
        `求 $\\frac{1}{\\pi}\\iiint_{E} z^{2}\\,dV$，其中 $E$ 是实心椭球 $\\frac{x^{2}}{${p * p}} + \\frac{y^{2}}{${q * q}} + \\frac{z^{2}}{${r * r}} \\le 1$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          Q.of(4 * p * q * r, 15),
          `That keeps $w^2$ in place of $z^2$; the integrand becomes $z^2 = ${r * r}w^2$.`,
          `那是用 $w^2$ 代替了 $z^2$；被积函数变为 $z^2 = ${r * r}w^2$。`,
        ),
        why(
          Q.of(4 * p * q * r * r, 15),
          `That has one factor $${r}$ too few: $z^2 = ${r}^2w^2$, on top of the $${r}$ in the Jacobian.`,
          `那是少了一个因子 $${r}$：$z^2 = ${r}^2w^2$，此外雅可比行列式中还有一个 $${r}$。`,
        ),
        why(
          Q.of(4 * p * q * r ** 3, 3),
          "That uses the volume $\\frac{4\\pi}{3}$ of the unit ball; the integral of $w^2$ over it is $\\frac{4\\pi}{15}$.",
          "那是用了单位球的体积 $\\frac{4\\pi}{3}$；$w^2$ 在其上的积分是 $\\frac{4\\pi}{15}$。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Scale to the unit ball", "缩放为单位球"],
            t(
              `With $x = ${p}u$, $y = ${q}v$, $z = ${r}w$, the Jacobian is $${p * q * r}$ and $z^{2} = ${r * r}w^{2}$.`,
              `令 $x = ${p}u$，$y = ${q}v$，$z = ${r}w$，雅可比行列式是 $${p * q * r}$，且 $z^{2} = ${r * r}w^{2}$。`,
            ),
          ],
          [
            ["Integrate over the ball", "在单位球上积分"],
            t(
              `The integral of $w^{2}$ over the unit ball is $\\frac{4\\pi}{15}$, so the value is $${p * q * r} \\cdot ${r * r} \\cdot \\frac{4}{15} = ${answer.toLatex()}$.`,
              `$w^{2}$ 在单位球上的积分是 $\\frac{4\\pi}{15}$，所以结果是 $${p * q * r} \\cdot ${r * r} \\cdot \\frac{4}{15} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `$w^2$ averages $\\frac{1}{5}$ over the unit ball, so $z^2$ averages $\\frac{${r * r}}{5}$ over $E$, whose volume is $${Q.of(4 * p * q * r, 3).toLatex()}\\pi$; the product is $${answer.toLatex()}\\pi$.`,
          `$w^2$ 在单位球上的平均值为 $\\frac{1}{5}$，所以 $z^2$ 在 $E$ 上的平均值为 $\\frac{${r * r}}{5}$，而 $E$ 的体积为 $${Q.of(4 * p * q * r, 3).toLatex()}\\pi$；乘积为 $${answer.toLatex()}\\pi$。`,
        ),
      ),
    });
  },
);

const selfCrossing = point(
  "finding-where-a-curve-crosses-itself",
  ["Finding where a curve crosses itself", "求曲线自交的位置"],
  [
    "A curve is not simple if two different parameter values give the same point. When $x(t)$ is even and $y(t)$ is odd, the values $t$ and $-t$ automatically share $x$, so they give one point exactly when $y(t) = 0$. The root $t = 0$ does not count, since $t$ and $-t$ agree there. For $\\mathbf{r}(t) = (t^2 - 2, t^3 - 2t)$, $y = t(t^2 - 2) = 0$ gives $t = \\sqrt{2}$, and $t = \\pm\\sqrt{2}$ both give the origin.\n\n> **Watch out.** Solve $t^2 = a^2$ for $t$: the answer is $t = a$, not $a^2$. And $t = 0$ is not a crossing, as it is one parameter value.",
    "如果两个不同的参数值给出同一点，曲线就不是简单曲线。当 $x(t)$ 是偶函数、$y(t)$ 是奇函数时，$t$ 和 $-t$ 的 $x$ 自动相同，所以当且仅当 $y(t) = 0$ 时它们给出同一点。根 $t = 0$ 不算，因为此时 $t$ 和 $-t$ 相同。对 $\\mathbf{r}(t) = (t^2 - 2, t^3 - 2t)$，$y = t(t^2 - 2) = 0$ 给出 $t = \\sqrt{2}$，$t = \\pm\\sqrt{2}$ 都对应原点。\n\n> **注意。** 由 $t^2 = a^2$ 解出的是 $t = a$，不是 $a^2$。$t = 0$ 不是自交点，因为它只是一个参数值。",
  ],
  (rng) => {
    const a = rng.int(1, 9);
    const c = nz(rng, 5);
    const x = poly([1, "t^{2}"], [-a * a, ""]);
    const y = poly([c, "t^{3}"], [-c * a * a, "t"]);
    return numberProblem({
      prompt: t(
        `The curve $\\mathbf{r}(t) = (${x}, ${y})$ crosses itself where $\\mathbf{r}(t) = \\mathbf{r}(-t)$ for some $t > 0$. Find this $t$.`,
        `曲线 $\\mathbf{r}(t) = (${x}, ${y})$ 在某个 $t > 0$ 处满足 $\\mathbf{r}(t) = \\mathbf{r}(-t)$，这是它的自交点。求这个 $t$。`,
      ),
      answer: a,
      mistakes: apart(a, [
        why(
          a * a,
          `That is $t^2$; from $t^2 = ${a * a}$ the parameter is $t = ${a}$.`,
          `那是 $t^2$；由 $t^2 = ${a * a}$ 得参数 $t = ${a}$。`,
        ),
        why(
          2 * a,
          `That is the distance between $t = -${a}$ and $t = ${a}$, not the parameter value.`,
          `那是 $t = -${a}$ 与 $t = ${a}$ 之间的距离，不是参数值。`,
        ),
        why(
          0,
          "At $t = 0$ the values $t$ and $-t$ are the same parameter, so it is not a crossing.",
          "$t = 0$ 时 $t$ 与 $-t$ 是同一个参数值，所以不是自交。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Use the symmetry", "利用对称性"],
            t(
              `$x(t) = ${x}$ is even, so $x(t) = x(-t)$ always; $y(t)$ is odd, so $y(-t) = -y(t)$, and the points agree exactly when $y(t) = 0$.`,
              `$x(t) = ${x}$ 是偶函数，所以总有 $x(t) = x(-t)$；$y(t)$ 是奇函数，$y(-t) = -y(t)$，所以两点重合当且仅当 $y(t) = 0$。`,
            ),
          ],
          [
            ["Solve", "求解"],
            t(
              `$${y} = ${poly([c, "t"])}(t^2 - ${a * a}) = 0$ gives $t = 0$ or $t = \\pm ${a}$, and the positive one is $t = ${a}$.`,
              `$${y} = ${poly([c, "t"])}(t^2 - ${a * a}) = 0$ 给出 $t = 0$ 或 $t = \\pm ${a}$，正的是 $t = ${a}$。`,
            ),
          ],
        ],
        t(
          `$x(${a}) = ${a}^2 - ${a * a} = 0$, and $y(t)$ has the factor $t^2 - ${a * a}$, which vanishes at $t = \\pm ${a}$, so $\\mathbf{r}(${a}) = \\mathbf{r}(-${a}) = (0, 0)$.`,
          `$x(${a}) = ${a}^2 - ${a * a} = 0$，而 $y(t)$ 含因子 $t^2 - ${a * a}$，它在 $t = \\pm ${a}$ 处为零，所以 $\\mathbf{r}(${a}) = \\mathbf{r}(-${a}) = (0, 0)$。`,
        ),
      ),
    });
  },
);

const segmentIn3d = point(
  "a-scalar-line-integral-along-a-segment-in-space",
  ["A scalar line integral along a segment in space", "空间线段上的标量线积分"],
  [
    "In space, the length element of a segment comes from all three coordinate differences. Parametrizing by $t$ from $0$ to $1$ makes $ds$ equal to the full length times $dt$, even when the integrand depends on only one of the coordinates. From the origin to $(2, 6, 3)$ the length is $\\sqrt{4 + 36 + 9} = 7$ and $z = 3t$, so $\\int_C z\\,ds = \\int_0^1 3t \\cdot 7\\,dt = \\frac{21}{2}$.\n\n> **Watch out.** $ds$ uses all three coordinates, $\\sqrt{x_1^2 + y_1^2 + z_1^2}\\,dt$, even when $f$ depends on $z$ alone. And $z = z_1t$ still has to be integrated, which brings a $\\frac{1}{2}$.",
    "在空间中，线段的长度元由三个坐标差共同决定。用 $t$ 从 $0$ 到 $1$ 参数化，$ds$ 等于全长乘以 $dt$，即使被积函数只依赖一个坐标也是这样。从原点到 $(2, 6, 3)$，长度为 $\\sqrt{4 + 36 + 9} = 7$，$z = 3t$，所以 $\\int_C z\\,ds = \\int_0^1 3t \\cdot 7\\,dt = \\frac{21}{2}$。\n\n> **注意。** 即使 $f$ 只依赖 $z$，$ds$ 也要用全部三个坐标：$\\sqrt{x_1^2 + y_1^2 + z_1^2}\\,dt$。而 $z = z_1t$ 仍要积分，带来一个 $\\frac{1}{2}$。",
  ],
  (rng) => {
    const [a, b, c, h] = rng.pick(quads);
    const u = rng.int(1, 3);
    const k = rng.int(1, 9);
    const answer = Q.of(k * c * h * u * u, 2);
    return numberProblem({
      prompt: t(
        `Evaluate $\\int_{C} ${poly([k, "z"])}\\,ds$ along the segment from the origin to $(${a * u}, ${b * u}, ${c * u})$.`,
        `求 $\\int_{C} ${poly([k, "z"])}\\,ds$，其中 $C$ 是从原点到 $(${a * u}, ${b * u}, ${c * u})$ 的线段。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          Q.of(k * c * u * u, 2),
          `That uses $dt$ for $ds$; here $ds = ${h * u}\\,dt$.`,
          `那是把 $ds$ 当作 $dt$；这里 $ds = ${h * u}\\,dt$。`,
        ),
        why(
          k * c * h * u * u,
          "That forgets the $\\frac{1}{2}$ from $\\int_0^1 t\\,dt$.",
          "那是漏了 $\\int_0^1 t\\,dt$ 中的 $\\frac{1}{2}$。",
        ),
        why(
          Q.of(k * (a + b + c) * h * u * u, 2),
          "That integrates $x + y + z$; the integrand depends on $z$ only.",
          "那是积分了 $x + y + z$；被积函数只依赖 $z$。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Find $ds$", "求 $ds$"],
            t(
              `With $\\mathbf{r}(t) = (${a * u}t, ${b * u}t, ${c * u}t)$, $ds = \\sqrt{${(a * u) ** 2} + ${(b * u) ** 2} + ${(c * u) ** 2}}\\,dt = ${h * u}\\,dt$.`,
              `取 $\\mathbf{r}(t) = (${a * u}t, ${b * u}t, ${c * u}t)$，$ds = \\sqrt{${(a * u) ** 2} + ${(b * u) ** 2} + ${(c * u) ** 2}}\\,dt = ${h * u}\\,dt$。`,
            ),
          ],
          [
            ["Integrate", "积分"],
            t(
              `$z = ${c * u}t$, so $\\int_{0}^{1} ${k} \\cdot ${c * u}t \\cdot ${h * u}\\,dt = ${answer.toLatex()}$.`,
              `$z = ${c * u}t$，所以 $\\int_{0}^{1} ${k} \\cdot ${c * u}t \\cdot ${h * u}\\,dt = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `$${poly([k, "z"])}$ grows evenly along the segment, so its average is its midpoint value $${Q.of(k * c * u, 2).toLatex()}$, and times the length $${h * u}$ that is $${answer.toLatex()}$.`,
          `$${poly([k, "z"])}$ 沿线段均匀增长，平均值是中点处的值 $${Q.of(k * c * u, 2).toLatex()}$，乘以长度 $${h * u}$ 得 $${answer.toLatex()}$。`,
        ),
      ),
    });
  },
);

const averageOnCurve = point(
  "the-average-value-along-a-curve",
  ["The average value along a curve", "沿曲线的平均值"],
  [
    "The average of $f$ along a curve of length $L$ is $\\frac{1}{L}\\int_{C} f\\,ds$. It is the constant that gives the same line integral as $f$, so subtracting it from $f$ gives a function whose line integral over $C$ is zero. On the unit circle, of length $2\\pi$, $\\int_C f\\,ds = 6\\pi$ gives the average $k = 3$.\n\n> **Watch out.** A constant $k$ integrates to $kL$, not to $k$, so the integral has to be divided by the length. Dividing the length by the integral turns the average upside down.",
    "$f$ 沿长度为 $L$ 的曲线的平均值是 $\\frac{1}{L}\\int_{C} f\\,ds$。它是与 $f$ 有相同线积分的常数，所以从 $f$ 中减去它，得到的函数在 $C$ 上的线积分为零。在长度为 $2\\pi$ 的单位圆上，$\\int_C f\\,ds = 6\\pi$ 给出平均值 $k = 3$。\n\n> **注意。** 常数 $k$ 的积分是 $kL$，不是 $k$，所以要用积分除以长度。用长度除以积分，平均值就颠倒了。",
  ],
  (rng) => {
    const L = rng.int(2, 12);
    const I = nz(rng, 40);
    const answer = Q.of(I, L);
    return numberProblem({
      prompt: t(
        `A curve $C$ has length $${L}$, and $\\int_{C} f\\,ds = ${I}$. Find the constant $k$ such that $\\int_{C} (f - k)\\,ds = 0$.`,
        `曲线 $C$ 的长度是 $${L}$，且 $\\int_{C} f\\,ds = ${I}$。求常数 $k$，使 $\\int_{C} (f - k)\\,ds = 0$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(I, `That integrates the constant $k$ to $k$; it gives $${L}k$.`, `那是把常数 $k$ 积成 $k$；它应给出 $${L}k$。`),
        why(I * L, `That multiplies by the length $${L}$; it divides.`, `那是乘以长度 $${L}$；应当除以它。`),
        why(
          Q.of(L, I),
          "That divides the length by the integral; the average is the integral divided by the length.",
          "那是用长度除以积分；平均值是积分除以长度。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Integrate the constant", "积分常数"],
            t(
              `$\\int_{C} (f - k)\\,ds = ${I} - ${L}k$, since a constant integrates to itself times the length.`,
              `$\\int_{C} (f - k)\\,ds = ${I} - ${L}k$，因为常数的积分等于它乘以长度。`,
            ),
          ],
          [
            ["Solve", "求解"],
            t(`$${I} - ${L}k = 0$ gives $k = ${answer.toLatex()}$.`, `$${I} - ${L}k = 0$ 给出 $k = ${answer.toLatex()}$。`),
          ],
        ],
        t(
          `$\\int_C ${answer.toLatex()}\\,ds = ${answer.toLatex()} \\cdot ${L} = ${I}$, the same as $\\int_C f\\,ds$, so the difference integrates to zero.`,
          `$\\int_C ${answer.toLatex()}\\,ds = ${answer.toLatex()} \\cdot ${L} = ${I}$，与 $\\int_C f\\,ds$ 相同，所以差的积分为零。`,
        ),
      ),
    });
  },
);

const alongParabola = {
  ...point(
    "a-line-integral-along-a-parabola",
    ["A line integral along a parabola", "沿抛物线的线积分"],
    [
      "On a curved graph $y = g(x)$, the factor $\\sqrt{1 + g'(x)^{2}}$ changes along the path, so it stays inside the integral. On $y = \\frac{x^{2}}{2}$ it is $\\sqrt{1 + x^{2}}$, and an integrand with a factor of $x$ makes the substitution work. Up to $x = \\sqrt{3}$, $\\int_C x\\,ds = \\int_0^{\\sqrt{3}} x\\sqrt{1 + x^2}\\,dx = \\frac{1}{3}\\left(4^{3/2} - 1\\right) = \\frac{7}{3}$.\n\n> **Watch out.** The lower limit $x = 0$ gives $(1 + 0)^{3/2} = 1$, not $0$, so it must be subtracted. And the antiderivative of $x\\sqrt{1 + x^2}$ is $\\frac{1}{3}(1 + x^2)^{3/2}$, with $\\frac{1}{3}$.",
      "在曲线 $y = g(x)$ 上，因子 $\\sqrt{1 + g'(x)^{2}}$ 沿路径变化，所以要留在积分号内。在 $y = \\frac{x^{2}}{2}$ 上它是 $\\sqrt{1 + x^{2}}$，被积函数含因子 $x$ 时可以用换元法。积到 $x = \\sqrt{3}$，$\\int_C x\\,ds = \\int_0^{\\sqrt{3}} x\\sqrt{1 + x^2}\\,dx = \\frac{1}{3}\\left(4^{3/2} - 1\\right) = \\frac{7}{3}$。\n\n> **注意。** 下限 $x = 0$ 给出 $(1 + 0)^{3/2} = 1$，不是 $0$，必须减去。$x\\sqrt{1 + x^2}$ 的原函数是 $\\frac{1}{3}(1 + x^2)^{3/2}$，系数是 $\\frac{1}{3}$。",
    ],
    (rng) => {
      const [a, b, c] = rng.pick(triples);
      const k = rng.int(1, 12);
      const X = Q.of(a, b);
      const answer = Q.of(k * (c ** 3 - b ** 3), 3 * b ** 3);
      const top = Q.of(c ** 3, b ** 3);
      const lead = k === 3 ? "" : Q.of(k, 3).toLatex();
      return numberProblem({
        prompt: t(
          `Evaluate $\\int_{C} ${poly([k, "x"])}\\,ds$ along $y = \\frac{x^{2}}{2}$ from $x = 0$ to $x = ${X.toLatex()}$.`,
          `求 $\\int_{C} ${poly([k, "x"])}\\,ds$，其中 $C$ 是 $y = \\frac{x^{2}}{2}$ 上从 $x = 0$ 到 $x = ${X.toLatex()}$ 的一段。`,
        ),
        answer,
        mistakes: apart(answer, [
          why(
            Q.of(k * c ** 3, 3 * b ** 3),
            "That leaves out the lower limit, where $(1 + x^2)^{3/2} = 1$.",
            "那是漏了下限，那里 $(1 + x^2)^{3/2} = 1$。",
          ),
          why(
            Q.of(k * a * a, 2 * b * b),
            "That uses $dx$ for $ds$; on the parabola $ds = \\sqrt{1 + x^2}\\,dx$.",
            "那是把 $ds$ 当作 $dx$；在抛物线上 $ds = \\sqrt{1 + x^2}\\,dx$。",
          ),
          why(
            Q.of(k * (c ** 3 - b ** 3), b ** 3),
            "That drops the $\\frac{1}{3}$: with $u = 1 + x^2$, $\\frac{1}{2}\\int \\sqrt{u}\\,du = \\frac{1}{3}u^{3/2}$.",
            "那是漏了 $\\frac{1}{3}$：令 $u = 1 + x^2$，$\\frac{1}{2}\\int \\sqrt{u}\\,du = \\frac{1}{3}u^{3/2}$。",
          ),
        ]),
        solution: walked(
          [
            [["Find $ds$", "求 $ds$"], t("$y' = x$, so $ds = \\sqrt{1 + x^{2}}\\,dx$.", "$y' = x$，所以 $ds = \\sqrt{1 + x^{2}}\\,dx$。")],
            [
              ["Substitute", "换元"],
              t(
                `With $u = 1 + x^2$, $\\int ${poly([k, "x"])}\\sqrt{1 + x^2}\\,dx = ${lead}(1 + x^2)^{3/2}$.`,
                `令 $u = 1 + x^2$，$\\int ${poly([k, "x"])}\\sqrt{1 + x^2}\\,dx = ${lead}(1 + x^2)^{3/2}$。`,
              ),
            ],
            [
              ["Evaluate", "代入上下限"],
              t(
                `At $x = ${X.toLatex()}$, $1 + x^2 = ${Q.of(c * c, b * b).toLatex()}$ and $(1 + x^2)^{3/2} = ${top.toLatex()}$; at $x = 0$ it is $1$. So the value is $${lead}\\left(${top.toLatex()} - 1\\right) = ${answer.toLatex()}$.`,
                `在 $x = ${X.toLatex()}$ 处，$1 + x^2 = ${Q.of(c * c, b * b).toLatex()}$，$(1 + x^2)^{3/2} = ${top.toLatex()}$；在 $x = 0$ 处它是 $1$。所以结果是 $${lead}\\left(${top.toLatex()} - 1\\right) = ${answer.toLatex()}$。`,
              ),
            ],
          ],
          t(
            `By the chain rule $\\frac{d}{dx}(1 + x^2)^{3/2} = 3x\\sqrt{1 + x^2}$, so the derivative of $${lead}(1 + x^2)^{3/2}$ is $${poly([k, "x"])}\\sqrt{1 + x^2}$, the integrand.`,
            `由链式法则 $\\frac{d}{dx}(1 + x^2)^{3/2} = 3x\\sqrt{1 + x^2}$，所以 $${lead}(1 + x^2)^{3/2}$ 的导数是 $${poly([k, "x"])}\\sqrt{1 + x^2}$，正是被积函数。`,
          ),
        ),
      });
    },
  ),
  figure:
    multivariableDrawings5["line-integrals-of-scalar-functions-over-paths-expressed-as-functions-of-x#a-line-integral-along-a-parabola"],
};

const powerCurveInY = point(
  "a-curve-in-y-with-a-simple-length-element",
  ["A curve in y with a simple length element", "长度元简单的 y 的函数曲线"],
  [
    "For $x = h(y)$ the length element is $\\sqrt{1 + h'(y)^{2}}\\,dy$, with the derivative taken in $y$. The curve $x = \\frac{2}{3}y^{3/2}$ is a standard case, as $h'(y)^{2} = y$ and the element becomes $\\sqrt{1 + y}\\,dy$, which integrates directly. From $y = 3$ to $y = 8$ the length of this curve is $\\frac{2}{3}\\left(9^{3/2} - 4^{3/2}\\right) = \\frac{2}{3}(27 - 8) = \\frac{38}{3}$.\n\n> **Watch out.** At the lower limit $y = 0$, $(1 + y)^{3/2} = 1$, not $0$. And the antiderivative of $\\sqrt{1 + y}$ is $\\frac{2}{3}(1 + y)^{3/2}$, with $\\frac{2}{3}$.",
    "对 $x = h(y)$，长度元是 $\\sqrt{1 + h'(y)^{2}}\\,dy$，导数对 $y$ 求。曲线 $x = \\frac{2}{3}y^{3/2}$ 是标准情形，因为 $h'(y)^{2} = y$，长度元变为 $\\sqrt{1 + y}\\,dy$，可以直接积分。从 $y = 3$ 到 $y = 8$，这条曲线的长度是 $\\frac{2}{3}\\left(9^{3/2} - 4^{3/2}\\right) = \\frac{2}{3}(27 - 8) = \\frac{38}{3}$。\n\n> **注意。** 在下限 $y = 0$ 处 $(1 + y)^{3/2} = 1$，不是 $0$。$\\sqrt{1 + y}$ 的原函数是 $\\frac{2}{3}(1 + y)^{3/2}$，系数是 $\\frac{2}{3}$。",
  ],
  (rng) => {
    const n = rng.int(2, 6);
    const k = rng.int(1, 9);
    const answer = Q.of(2 * k * (n ** 3 - 1), 3);
    return numberProblem({
      prompt: t(
        `Evaluate $\\int_{C} ${k}\\,ds$ along $x = \\frac{2}{3}y^{3/2}$ from $y = 0$ to $y = ${n * n - 1}$.`,
        `求 $\\int_{C} ${k}\\,ds$，其中 $C$ 是 $x = \\frac{2}{3}y^{3/2}$ 上从 $y = 0$ 到 $y = ${n * n - 1}$ 的一段。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          k * (n * n - 1),
          "That uses $dy$ for $ds$; here $ds = \\sqrt{1 + y}\\,dy$.",
          "那是把 $ds$ 当作 $dy$；这里 $ds = \\sqrt{1 + y}\\,dy$。",
        ),
        why(
          Q.of(2 * k * n ** 3, 3),
          "That leaves out the lower limit, where $(1 + y)^{3/2} = 1$.",
          "那是漏了下限，那里 $(1 + y)^{3/2} = 1$。",
        ),
        why(
          Q.of(k * (n ** 3 - 1), 3),
          "The antiderivative of $\\sqrt{1 + y}$ is $\\frac{2}{3}(1 + y)^{3/2}$, not $\\frac{1}{3}(1 + y)^{3/2}$.",
          "$\\sqrt{1 + y}$ 的原函数是 $\\frac{2}{3}(1 + y)^{3/2}$，不是 $\\frac{1}{3}(1 + y)^{3/2}$。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Find $ds$", "求 $ds$"],
            t("$\\frac{dx}{dy} = y^{1/2}$, so $ds = \\sqrt{1 + y}\\,dy$.", "$\\frac{dx}{dy} = y^{1/2}$，所以 $ds = \\sqrt{1 + y}\\,dy$。"),
          ],
          [
            ["Integrate", "积分"],
            t(
              `$\\int_{0}^{${n * n - 1}} ${k}\\sqrt{1 + y}\\,dy = ${k} \\cdot \\frac{2}{3}\\left[(1 + y)^{3/2}\\right]_0^{${n * n - 1}} = ${k} \\cdot \\frac{2}{3}(${n}^{3} - 1) = ${answer.toLatex()}$.`,
              `$\\int_{0}^{${n * n - 1}} ${k}\\sqrt{1 + y}\\,dy = ${k} \\cdot \\frac{2}{3}\\left[(1 + y)^{3/2}\\right]_0^{${n * n - 1}} = ${k} \\cdot \\frac{2}{3}(${n}^{3} - 1) = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `The integral of the constant $${k}$ is $${k}$ times the length, and the length $${Q.of(2 * (n ** 3 - 1), 3).toLatex()}$ is more than the rise $${n * n - 1}$ in $y$, as a curved path must be.`,
          `常数 $${k}$ 的积分等于 $${k}$ 乘以长度，长度 $${Q.of(2 * (n ** 3 - 1), 3).toLatex()}$ 大于 $y$ 方向的升高 $${n * n - 1}$，弯曲的路径理应如此。`,
        ),
      ),
    });
  },
);

const offCenterCircle = {
  ...point(
    "a-circle-that-is-not-centered-at-the-origin",
    ["A circle that is not centered at the origin", "圆心不在原点的圆"],
    [
      "On a circle with center $(a, b)$, writing $x = a + r\\cos t$ makes the cosine term integrate to zero over a full turn. So the integral of $x$ is $a$ times the length of the circle. Treating the center as the origin would lose this term. On $(x - 2)^2 + y^2 = 9$, $\\oint_C x\\,ds = 2 \\cdot 6\\pi = 12\\pi$.\n\n> **Watch out.** The radius is the square root of the right-hand side, and the length is $2\\pi r$. The value that multiplies it is the integrand at the center $(a, b)$, not at the origin.",
      "在圆心为 $(a, b)$ 的圆上，写 $x = a + r\\cos t$，余弦项在一整圈上的积分为零。所以 $x$ 的积分等于 $a$ 乘以圆的周长。如果把圆心当成原点，就会丢失这一项。在 $(x - 2)^2 + y^2 = 9$ 上，$\\oint_C x\\,ds = 2 \\cdot 6\\pi = 12\\pi$。\n\n> **注意。** 半径是右边的平方根，周长是 $2\\pi r$。与它相乘的是被积函数在圆心 $(a, b)$ 处的值，不是在原点处的值。",
    ],
    (rng) => {
      const a = nz(rng, 6);
      const b = nz(rng, 6);
      const r = rng.int(1, 6);
      const k = nz(rng, 5);
      let m = nz(rng, 9);
      while (k * a + m === 0) m = nz(rng, 9);
      const answer = 2 * r * (k * a + m);
      const f = poly([k, "x"], [m, ""]);
      const circle = `(${poly([1, "x"], [-a, ""])})^{2} + (${poly([1, "y"], [-b, ""])})^{2} = ${r * r}`;
      const atCenter = k * a + m;
      const shifted = poly([k * a + m, ""], [k * r, "\\cos t"]);
      return numberProblem({
        prompt: t(
          `$C$ is the circle $${circle}$. Find $\\frac{1}{\\pi}\\oint_{C} (${f})\\,ds$.`,
          `$C$ 是圆 $${circle}$。求 $\\frac{1}{\\pi}\\oint_{C} (${f})\\,ds$。`,
        ),
        answer,
        mistakes: apart(answer, [
          why(
            2 * r * m,
            `That treats the center as the origin; at the center $(${a}, ${b})$ the integrand is $${atCenter}$, not $${m}$.`,
            `那是把圆心当成原点；在圆心 $(${a}, ${b})$ 处被积函数是 $${atCenter}$，不是 $${m}$。`,
          ),
          why(
            r * atCenter,
            `That uses $\\pi r$ for the length; it is $2\\pi \\cdot ${r}$.`,
            `那是把周长当作 $\\pi r$；它是 $2\\pi \\cdot ${r}$。`,
          ),
          why(
            2 * r * r * atCenter,
            `That uses $r^2 = ${r * r}$ in place of $r = ${r}$; $ds = ${r}\\,dt$.`,
            `那是用 $r^2 = ${r * r}$ 代替了 $r = ${r}$；$ds = ${r}\\,dt$。`,
          ),
        ]),
        solution: walked(
          [
            [
              ["Read the circle", "读出圆"],
              t(
                `The center is $(${a}, ${b})$ and the radius is $\\sqrt{${r * r}} = ${r}$, so the length is $${2 * r}\\pi$.`,
                `圆心为 $(${a}, ${b})$，半径为 $\\sqrt{${r * r}} = ${r}$，所以周长为 $${2 * r}\\pi$。`,
              ),
            ],
            [
              ["Evaluate at the center", "求圆心处的值"],
              t(
                `At $x = ${a}$ the integrand is $${atCenter}$, and that is its average over the circle.`,
                `在 $x = ${a}$ 处被积函数为 $${atCenter}$，这就是它在圆上的平均值。`,
              ),
            ],
            [
              ["Multiply", "相乘"],
              t(
                `$\\oint_C (${f})\\,ds = ${atCenter} \\cdot ${2 * r}\\pi = ${answer}\\pi$, so the result is $${answer}$.`,
                `$\\oint_C (${f})\\,ds = ${atCenter} \\cdot ${2 * r}\\pi = ${answer}\\pi$，所以结果是 $${answer}$。`,
              ),
            ],
          ],
          t(
            `With $x = ${poly([a, ""], [r, "\\cos t"])}$ and $ds = ${r}\\,dt$, $\\int_0^{2\\pi} (${shifted}) \\cdot ${r}\\,dt = ${answer}\\pi$, because $\\cos t$ integrates to $0$ over a full turn.`,
            `取 $x = ${poly([a, ""], [r, "\\cos t"])}$，$ds = ${r}\\,dt$，$\\int_0^{2\\pi} (${shifted}) \\cdot ${r}\\,dt = ${answer}\\pi$，因为 $\\cos t$ 在一整圈上积分为 $0$。`,
          ),
        ),
      });
    },
  ),
  figure: multivariableDrawings5["line-integrals-of-scalar-functions-over-circles#a-circle-that-is-not-centered-at-the-origin"],
};

const quarterEllipse = {
  ...point(
    "a-quarter-of-an-ellipse-by-substitution",
    ["A quarter of an ellipse by substitution", "用换元法求四分之一椭圆"],
    [
      "Arc length on an ellipse has no elementary form, but with $x = a\\cos t$ and $y = b\\sin t$ an integrand $xy$ supplies the derivative of $u = a^{2}\\sin^{2}t + b^{2}\\cos^{2}t$. So the substitution in $u$ removes the root, and the integral is elementary. On the first-quadrant arc of $\\frac{x^2}{64} + \\frac{y^2}{4} = 1$, $u = 64\\sin^2 t + 4\\cos^2 t$ and $du = 120\\sin t\\cos t\\,dt$, so $\\int_C xy\\,ds = \\frac{16}{120}\\int_4^{64} \\sqrt{u}\\,du = \\frac{224}{5}$.\n\n> **Watch out.** $du = 2(a^2 - b^2)\\sin t\\cos t\\,dt$ carries a factor $2$, and $u$ runs from $b^2$ at $t = 0$ to $a^2$ at $t = \\frac{\\pi}{2}$. When simplifying, $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$, not $(a - b)(a^2 + b^2)$.",
      "椭圆的弧长没有初等形式，但用 $x = a\\cos t$，$y = b\\sin t$ 时，被积函数 $xy$ 正好提供 $u = a^{2}\\sin^{2}t + b^{2}\\cos^{2}t$ 的导数。所以对 $u$ 换元后根号消失，积分是初等的。在 $\\frac{x^2}{64} + \\frac{y^2}{4} = 1$ 位于第一象限的弧上，$u = 64\\sin^2 t + 4\\cos^2 t$，$du = 120\\sin t\\cos t\\,dt$，所以 $\\int_C xy\\,ds = \\frac{16}{120}\\int_4^{64} \\sqrt{u}\\,du = \\frac{224}{5}$。\n\n> **注意。** $du = 2(a^2 - b^2)\\sin t\\cos t\\,dt$ 带有因子 $2$，且 $u$ 从 $t = 0$ 时的 $b^2$ 变到 $t = \\frac{\\pi}{2}$ 时的 $a^2$。化简时 $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$，不是 $(a - b)(a^2 + b^2)$。",
    ],
    (rng) => {
      const [a, b] = rng.sample([1, 2, 3, 4, 5, 6], 2) as [number, number];
      const k = rng.int(1, 6);
      const answer = Q.of(k * a * b * (a * a + a * b + b * b), 3 * (a + b));
      const curve = `${a === 1 ? "x^{2}" : `\\frac{x^{2}}{${a * a}}`} + ${b === 1 ? "y^{2}" : `\\frac{y^{2}}{${b * b}}`} = 1`;
      const lead = Q.of(k * a * b, 2 * (a * a - b * b));
      return numberProblem({
        prompt: t(
          `Evaluate $\\int_{C} ${poly([k, "xy"])}\\,ds$, where $C$ is the first-quadrant arc of $${curve}$.`,
          `求 $\\int_{C} ${poly([k, "xy"])}\\,ds$，其中 $C$ 是 $${curve}$ 在第一象限的弧。`,
        ),
        answer,
        mistakes: apart(answer, [
          why(
            Q.of(k * a * b, 2),
            "That uses $dt$ for $ds$; the speed $\\sqrt{u}$ multiplies the integrand.",
            "那是把 $ds$ 当作 $dt$；速率 $\\sqrt{u}$ 要乘进被积函数。",
          ),
          why(
            answer.mul(Q.of(2)),
            "That loses the factor $2$ in $du = 2(a^2 - b^2)\\sin t\\cos t\\,dt$.",
            "那是丢了 $du = 2(a^2 - b^2)\\sin t\\cos t\\,dt$ 中的因子 $2$。",
          ),
          why(
            Q.of(k * a * b * (a * a + b * b), 3 * (a + b)),
            "That factors $a^3 - b^3$ as $(a - b)(a^2 + b^2)$; it is $(a - b)(a^2 + ab + b^2)$.",
            "那是把 $a^3 - b^3$ 分解为 $(a - b)(a^2 + b^2)$；它是 $(a - b)(a^2 + ab + b^2)$。",
          ),
        ]),
        solution: walked(
          [
            [
              ["Parametrize", "参数化"],
              t(
                `$x = ${poly([a, "\\cos t"])}$, $y = ${poly([b, "\\sin t"])}$ for $0 \\le t \\le \\frac{\\pi}{2}$, so $ds = \\sqrt{u}\\,dt$ with $u = ${a * a}\\sin^{2}t + ${b * b}\\cos^{2}t$.`,
                `$x = ${poly([a, "\\cos t"])}$，$y = ${poly([b, "\\sin t"])}$，$0 \\le t \\le \\frac{\\pi}{2}$，所以 $ds = \\sqrt{u}\\,dt$，$u = ${a * a}\\sin^{2}t + ${b * b}\\cos^{2}t$。`,
              ),
            ],
            [
              ["Substitute", "换元"],
              t(
                `$du = ${2 * (a * a - b * b)}\\sin t\\cos t\\,dt$ and $${poly([k, "xy"])} = ${k * a * b}\\sin t\\cos t$, so the integral is $${lead.toLatex()}\\int_{${b * b}}^{${a * a}} \\sqrt{u}\\,du$.`,
                `$du = ${2 * (a * a - b * b)}\\sin t\\cos t\\,dt$，$${poly([k, "xy"])} = ${k * a * b}\\sin t\\cos t$，所以积分为 $${lead.toLatex()}\\int_{${b * b}}^{${a * a}} \\sqrt{u}\\,du$。`,
              ),
            ],
            [
              ["Integrate", "积分"],
              t(
                `$\\int_{${b * b}}^{${a * a}} \\sqrt{u}\\,du = \\frac{2}{3}(${a ** 3} - ${b ** 3})$, so the result is $${lead.toLatex()} \\cdot \\frac{2}{3}(${a ** 3 - b ** 3}) = ${answer.toLatex()}$.`,
                `$\\int_{${b * b}}^{${a * a}} \\sqrt{u}\\,du = \\frac{2}{3}(${a ** 3} - ${b ** 3})$，所以结果为 $${lead.toLatex()} \\cdot \\frac{2}{3}(${a ** 3 - b ** 3}) = ${answer.toLatex()}$。`,
              ),
            ],
          ],
          t(
            `Swapping $a$ and $b$ reflects the arc in $y = x$, which keeps $xy$ and $ds$, so the value must be symmetric in $${a}$ and $${b}$. It is: $\\frac{${k * a * b}(${a * a} + ${a * b} + ${b * b})}{3 \\cdot ${a + b}} = ${answer.toLatex()}$.`,
            `交换 $a$ 与 $b$ 相当于把弧关于 $y = x$ 反射，$xy$ 和 $ds$ 都不变，所以结果关于 $${a}$ 与 $${b}$ 必须对称。确实如此：$\\frac{${k * a * b}(${a * a} + ${a * b} + ${b * b})}{3 \\cdot ${a + b}} = ${answer.toLatex()}$。`,
          ),
        ),
      });
    },
  ),
  figure: multivariableDrawings5["line-integrals-of-scalar-functions-over-ellipses#a-quarter-of-an-ellipse-by-substitution"],
};

const weightedAverage = point(
  "the-average-over-two-pieces-of-different-length",
  ["The average over two pieces of different length", "两段不等长曲线上的平均值"],
  [
    "Line integrals add over pieces, but averages do not. The average over a union is a weighted mean, with the lengths as weights, so a long piece counts for more. Adding the two averages and dividing by two is correct only for equal lengths. A piece of length $12$ with average $1$ and a piece of length $4$ with average $5$ carry integrals $12$ and $20$, so the average over the whole is $\\frac{32}{16} = 2$, not $3$.\n\n> **Watch out.** First turn each average into an integral by multiplying by its length, add those, and divide by the total length. Dividing the total by $2$, or the sum of the averages by the total length, mixes up the two steps.",
    "线积分可以按段相加，平均值却不行。并集上的平均值是以长度为权的加权平均，所以长的一段影响更大。把两个平均值相加再除以二，只在长度相等时才正确。长度 $12$、平均值 $1$ 的一段与长度 $4$、平均值 $5$ 的一段，积分分别为 $12$ 和 $20$，所以整体的平均值是 $\\frac{32}{16} = 2$，不是 $3$。\n\n> **注意。** 先把每段的平均值乘以长度化成积分，相加，再除以总长度。把总积分除以 $2$，或把平均值之和除以总长度，都是把两步弄混了。",
  ],
  (rng) => {
    const L1 = rng.int(1, 9);
    const L2 = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== L1));
    const m1 = rng.int(-9, 9);
    const m2 = rng.pick([-8, -5, -3, -1, 2, 4, 7, 10].filter((v) => v !== m1));
    const total = L1 * m1 + L2 * m2;
    const answer = Q.of(total, L1 + L2);
    const p = (v: number) => (v < 0 ? `(${v})` : `${v}`);
    const [low, high] = m1 < m2 ? [m1, m2] : [m2, m1];
    const nearer = L1 > L2 ? m1 : m2;
    return numberProblem({
      prompt: t(
        `A wire consists of a piece of length $${L1}$ with average density $${m1}$ and a piece of length $${L2}$ with average density $${m2}$. Find the average density of the whole wire.`,
        `一根导线由两段组成：长度 $${L1}$、平均密度 $${m1}$ 的一段，和长度 $${L2}$、平均密度 $${m2}$ 的一段。求整根导线的平均密度。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          Q.of(m1 + m2, 2),
          "That averages the two averages; the longer piece counts for more.",
          "那是对两个平均值取平均；较长的一段影响更大。",
        ),
        why(
          total,
          `That is the integral over the whole wire; divide it by the length $${L1 + L2}$.`,
          `那是整根导线上的积分；还要除以长度 $${L1 + L2}$。`,
        ),
        why(
          Q.of(m1 + m2, L1 + L2),
          "That divides the sum of the averages by the length; the averages must first be multiplied by their lengths.",
          "那是把平均值之和除以长度；平均值要先乘以各自的长度。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Turn averages into integrals", "把平均值化为积分"],
            t(
              `The pieces carry $${L1} \\cdot ${p(m1)} = ${L1 * m1}$ and $${L2} \\cdot ${p(m2)} = ${L2 * m2}$, a total of $${total}$.`,
              `两段的积分分别为 $${L1} \\cdot ${p(m1)} = ${L1 * m1}$ 和 $${L2} \\cdot ${p(m2)} = ${L2 * m2}$，合计 $${total}$。`,
            ),
          ],
          [
            ["Divide by the total length", "除以总长度"],
            t(
              `The total length is $${L1 + L2}$, so the average is $\\frac{${total}}{${L1 + L2}} = ${answer.toLatex()}$.`,
              `总长度为 $${L1 + L2}$，所以平均值为 $\\frac{${total}}{${L1 + L2}} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `$${answer.toLatex()}$ lies between $${low}$ and $${high}$, nearer to $${nearer}$, the density of the longer piece.`,
          `$${answer.toLatex()}$ 介于 $${low}$ 与 $${high}$ 之间，且更接近较长一段的密度 $${nearer}$。`,
        ),
      ),
    });
  },
);

const polarCircle = {
  ...point(
    "a-circle-through-the-pole",
    ["A circle through the pole", "过极点的圆"],
    [
      "In polar form $ds = \\sqrt{r^{2} + (r')^{2}}\\,d\\theta$. On $r = 2a\\cos\\theta$, the two squares add to $4a^{2}$, so $ds = 2a\\,d\\theta$ is constant, and writing $ds = r\\,d\\theta$ would be wrong. A single turn takes $\\theta$ from $-\\frac{\\pi}{2}$ to $\\frac{\\pi}{2}$. On $r = 3\\cos\\theta$, $ds = 3\\,d\\theta$ and $x = 3\\cos^2\\theta$, so $\\oint_C x\\,ds = 9 \\cdot \\frac{\\pi}{2} = \\frac{9\\pi}{2}$.\n\n> **Watch out.** $\\theta$ runs over an interval of length $\\pi$, not $2\\pi$, so $\\int \\cos^2\\theta\\,d\\theta = \\frac{\\pi}{2}$ there. And $x = r\\cos\\theta$ has to be written on the curve; it is not $r$.",
      "在极坐标中 $ds = \\sqrt{r^{2} + (r')^{2}}\\,d\\theta$。在 $r = 2a\\cos\\theta$ 上，两个平方之和是 $4a^{2}$，所以 $ds = 2a\\,d\\theta$ 是常数，写成 $ds = r\\,d\\theta$ 是错的。走一圈时 $\\theta$ 从 $-\\frac{\\pi}{2}$ 变到 $\\frac{\\pi}{2}$。在 $r = 3\\cos\\theta$ 上，$ds = 3\\,d\\theta$，$x = 3\\cos^2\\theta$，所以 $\\oint_C x\\,ds = 9 \\cdot \\frac{\\pi}{2} = \\frac{9\\pi}{2}$。\n\n> **注意。** $\\theta$ 走过的区间长为 $\\pi$，不是 $2\\pi$，所以在那里 $\\int \\cos^2\\theta\\,d\\theta = \\frac{\\pi}{2}$。$x = r\\cos\\theta$ 要写在曲线上，它不等于 $r$。",
    ],
    (rng) => {
      const a = rng.int(1, 9);
      const k = rng.int(1, 12);
      const answer = 2 * k * a * a;
      return numberProblem({
        prompt: t(
          `$C$ is the circle $r = ${2 * a}\\cos\\theta$, $-\\frac{\\pi}{2} \\le \\theta \\le \\frac{\\pi}{2}$. Find $\\frac{1}{\\pi}\\oint_{C} ${poly([k, "x"])}\\,ds$.`,
          `$C$ 是圆 $r = ${2 * a}\\cos\\theta$，$-\\frac{\\pi}{2} \\le \\theta \\le \\frac{\\pi}{2}$。求 $\\frac{1}{\\pi}\\oint_{C} ${poly([k, "x"])}\\,ds$。`,
        ),
        answer,
        mistakes: apart(answer, [
          why(
            k * a * a,
            "That uses $\\frac{\\pi}{4}$ for $\\int \\cos^2\\theta\\,d\\theta$ over this interval; it is $\\frac{\\pi}{2}$.",
            "那是把这个区间上的 $\\int \\cos^2\\theta\\,d\\theta$ 当作 $\\frac{\\pi}{4}$；它是 $\\frac{\\pi}{2}$。",
          ),
          why(
            4 * k * a * a,
            "That uses $\\pi$ for $\\int \\cos^2\\theta\\,d\\theta$, as over a full $2\\pi$; here $\\theta$ spans only $\\pi$.",
            "那是把 $\\int \\cos^2\\theta\\,d\\theta$ 当作 $\\pi$，如同在整个 $2\\pi$ 上；这里 $\\theta$ 只走过 $\\pi$。",
          ),
          why(
            2 * k * a,
            `That integrates $${k}$ alone, giving $${k}$ times the length; the integrand $x$ has to be kept.`,
            `那是只积分了 $${k}$，得到 $${k}$ 乘以长度；被积函数中的 $x$ 要保留。`,
          ),
        ]),
        solution: walked(
          [
            [
              ["Find $ds$", "求 $ds$"],
              t(
                `$r^2 + r'^2 = ${4 * a * a}\\cos^2\\theta + ${4 * a * a}\\sin^2\\theta = ${4 * a * a}$, so $ds = ${2 * a}\\,d\\theta$.`,
                `$r^2 + r'^2 = ${4 * a * a}\\cos^2\\theta + ${4 * a * a}\\sin^2\\theta = ${4 * a * a}$，所以 $ds = ${2 * a}\\,d\\theta$。`,
              ),
            ],
            [
              ["Write $x$ on the curve", "在曲线上写出 $x$"],
              t(`$x = r\\cos\\theta = ${2 * a}\\cos^{2}\\theta$.`, `$x = r\\cos\\theta = ${2 * a}\\cos^{2}\\theta$。`),
            ],
            [
              ["Integrate", "积分"],
              t(
                `$\\int_{-\\pi/2}^{\\pi/2} ${k} \\cdot ${2 * a}\\cos^{2}\\theta \\cdot ${2 * a}\\,d\\theta = ${4 * k * a * a} \\cdot \\frac{\\pi}{2} = ${answer}\\pi$, so the value divided by $\\pi$ is $${answer}$.`,
                `$\\int_{-\\pi/2}^{\\pi/2} ${k} \\cdot ${2 * a}\\cos^{2}\\theta \\cdot ${2 * a}\\,d\\theta = ${4 * k * a * a} \\cdot \\frac{\\pi}{2} = ${answer}\\pi$，所以除以 $\\pi$ 后的值是 $${answer}$。`,
              ),
            ],
          ],
          t(
            `$r = ${2 * a}\\cos\\theta$ is the circle of radius $${a}$ centered at $(${a}, 0)$. Its length is $${2 * a}\\pi$ and $x$ averages $${a}$ on it, so $\\oint_C ${poly([k, "x"])}\\,ds = ${k} \\cdot ${a} \\cdot ${2 * a}\\pi = ${answer}\\pi$.`,
            `$r = ${2 * a}\\cos\\theta$ 是以 $(${a}, 0)$ 为圆心、半径 $${a}$ 的圆。它的长度为 $${2 * a}\\pi$，$x$ 在其上的平均值为 $${a}$，所以 $\\oint_C ${poly([k, "x"])}\\,ds = ${k} \\cdot ${a} \\cdot ${2 * a}\\pi = ${answer}\\pi$。`,
          ),
        ),
      });
    },
  ),
  figure: multivariableDrawings5["line-integrals-of-scalar-functions-over-polar-curves#a-circle-through-the-pole"],
};

const areaFromYdx = point(
  "the-sign-of-a-closed-y-dx-integral",
  ["The sign of a closed y dx integral", "闭合 y dx 积分的符号"],
  [
    "Around a counterclockwise closed curve, $\\oint y\\,dx$ equals minus the enclosed area, while $\\oint x\\,dy$ equals plus the area. Along the top the curve moves left, so $dx$ is negative where $y$ is largest, and this explains the minus sign. Around the triangle $(0, 0)$, $(4, 0)$, $(4, 3)$, the bottom has $y = 0$, the right side has $dx = 0$, and the slanted side from $(4, 3)$ back to $(0, 0)$ gives $\\int_4^0 \\frac{3x}{4}\\,dx = -6$, minus the area $6$.\n\n> **Watch out.** The sign is minus for $\\oint y\\,dx$; plus the area belongs to $\\oint x\\,dy$. The contributions do not cancel: $y$ is larger on the leftward part of the boundary.",
    "沿逆时针闭曲线，$\\oint y\\,dx$ 等于所围面积的相反数，而 $\\oint x\\,dy$ 等于面积。在顶部曲线向左走，所以在 $y$ 最大的地方 $dx$ 为负，这解释了负号。沿三角形 $(0, 0)$、$(4, 0)$、$(4, 3)$ 的边界，底边上 $y = 0$，右边上 $dx = 0$，从 $(4, 3)$ 回到 $(0, 0)$ 的斜边给出 $\\int_4^0 \\frac{3x}{4}\\,dx = -6$，即面积 $6$ 的相反数。\n\n> **注意。** $\\oint y\\,dx$ 的符号是负的；等于正面积的是 $\\oint x\\,dy$。各部分的贡献不会相消：边界向左走的部分 $y$ 更大。",
  ],
  (rng) => {
    const W = rng.int(1, 9);
    const H = rng.int(1, 9);
    const k = nz(rng, 6);
    const tri = rng.bool();
    const area = tri ? Q.of(W * H, 2) : Q.of(W * H);
    const answer = area.mul(Q.of(-k));
    const shape: Pair = tri
      ? [`the triangle with vertices $(0, 0)$, $(${W}, 0)$ and $(0, ${H})$`, `顶点为 $(0, 0)$、$(${W}, 0)$、$(0, ${H})$ 的三角形`]
      : [`the rectangle $[0, ${W}] \\times [0, ${H}]$`, `矩形 $[0, ${W}] \\times [0, ${H}]$`];
    const ky = poly([k, "y"]);
    const scaled = k === 1 ? `-(${area.toLatex()})` : k === -1 ? `-(-${area.toLatex()})` : `${k} \\cdot (-${area.toLatex()})`;
    return numberProblem({
      prompt: t(
        `$C$ is the counterclockwise boundary of ${shape[0]}. Evaluate $\\oint_{C} ${ky}\\,dx$.`,
        `$C$ 是${shape[1]}的逆时针边界。求 $\\oint_{C} ${ky}\\,dx$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          answer.neg(),
          "That uses plus the area, which is the rule for $\\oint x\\,dy$; $\\oint y\\,dx$ is minus the area.",
          "那是用了正面积，那是 $\\oint x\\,dy$ 的规则；$\\oint y\\,dx$ 等于面积的相反数。",
        ),
        why(
          0,
          "That assumes the pieces cancel; $y$ is larger where the boundary moves left, so they do not.",
          "那是以为各段相消；边界向左走的地方 $y$ 更大，所以不会相消。",
        ),
        ...(tri
          ? [
              why(
                Q.of(-k * W * H),
                `That uses $${W} \\cdot ${H}$ for the area; the triangle has half of it.`,
                `那是把面积当作 $${W} \\cdot ${H}$；三角形只有它的一半。`,
              ),
            ]
          : []),
      ]),
      solution: walked(
        [
          [
            ["Use the rule", "使用规则"],
            t(
              `Counterclockwise, $\\oint_{C} y\\,dx = -(\\text{area})$, and the area is $${area.toLatex()}$.`,
              `逆时针时 $\\oint_{C} y\\,dx = -(\\text{面积})$，面积为 $${area.toLatex()}$。`,
            ),
          ],
          [
            ["Multiply", "相乘"],
            t(`$\\oint_{C} ${ky}\\,dx = ${scaled} = ${answer.toLatex()}$.`, `$\\oint_{C} ${ky}\\,dx = ${scaled} = ${answer.toLatex()}$。`),
          ],
        ],
        tri
          ? t(
              `Side by side: the bottom has $y = 0$ and the left side has $dx = 0$. The slanted side from $(${W}, 0)$ to $(0, ${H})$ is $x = ${poly([W, ""], [-W, "t"])}$, $y = ${poly([H, "t"])}$, and $\\int_0^1 ${poly([H, "t"])} \\cdot (-${W})\\,dt = -${area.toLatex()}$.`,
              `逐边计算：底边 $y = 0$，左边 $dx = 0$。从 $(${W}, 0)$ 到 $(0, ${H})$ 的斜边为 $x = ${poly([W, ""], [-W, "t"])}$，$y = ${poly([H, "t"])}$，$\\int_0^1 ${poly([H, "t"])} \\cdot (-${W})\\,dt = -${area.toLatex()}$。`,
            )
          : t(
              `Side by side: the bottom has $y = 0$ and the two sides have $dx = 0$. The top runs left from $x = ${W}$ to $0$ at $y = ${H}$, giving $\\int_{${W}}^{0} ${H}\\,dx = -${area.toLatex()}$.`,
              `逐边计算：底边 $y = 0$，两条竖边 $dx = 0$。顶边在 $y = ${H}$ 上从 $x = ${W}$ 向左走到 $0$，给出 $\\int_{${W}}^{0} ${H}\\,dx = -${area.toLatex()}$。`,
            ),
      ),
    });
  },
);

const verticalPiece = point(
  "a-vertical-piece-contributes-nothing-to-dx",
  ["A vertical piece contributes nothing to dx", "竖直段对 dx 积分没有贡献"],
  [
    "On a vertical segment $x$ is constant, so $dx = 0$ and the piece contributes nothing to a $dx$ integral, whatever the integrand is. On a horizontal piece $y$ is constant, and that value is the one that goes into the integrand. From $(3, 1)$ up to $(3, 7)$ and then to $(-4, 7)$, $\\int_C 2y\\,dx = 0 + 2 \\cdot 7 \\cdot (-7) = -98$.\n\n> **Watch out.** On the horizontal piece use the height of that piece, not the $y$ of the starting point. And the change in $x$ is end minus start, so moving left makes it negative.",
    "在竖直线段上 $x$ 是常数，所以 $dx = 0$，无论被积函数是什么，这一段对 $dx$ 积分都没有贡献。在水平段上 $y$ 是常数，被积函数中要代入的就是这个值。从 $(3, 1)$ 向上到 $(3, 7)$，再到 $(-4, 7)$，$\\int_C 2y\\,dx = 0 + 2 \\cdot 7 \\cdot (-7) = -98$。\n\n> **注意。** 在水平段上要用该段的高度，不是起点的 $y$。$x$ 的变化量是终点减起点，向左走时为负。",
  ],
  (rng) => {
    const a = rng.int(-6, 6);
    const b = rng.int(-6, 6);
    const d = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].filter((v) => v !== b));
    const e = rng.pick([-7, -5, -3, -1, 1, 2, 4, 6, 8].filter((v) => v !== a));
    const k = nz(rng, 5);
    const answer = k * d * (e - a);
    const p = (v: number) => (v < 0 ? `(${v})` : `${v}`);
    return numberProblem({
      prompt: t(
        `$C$ runs along segments from $(${a}, ${b})$ to $(${a}, ${d})$ and then to $(${e}, ${d})$. Evaluate $\\int_{C} ${poly([k, "y"])}\\,dx$.`,
        `$C$ 沿线段从 $(${a}, ${b})$ 到 $(${a}, ${d})$，再到 $(${e}, ${d})$。求 $\\int_{C} ${poly([k, "y"])}\\,dx$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          k * b * (e - a),
          `That uses $y = ${b}$, the starting height; the horizontal piece is at $y = ${d}$.`,
          `那是用了起点的高度 $y = ${b}$；水平段在 $y = ${d}$ 上。`,
        ),
        why(
          -answer,
          `That takes the change in $x$ to be $${a} - ${p(e)}$; it is end minus start, $${e} - ${p(a)} = ${e - a}$.`,
          `那是把 $x$ 的变化量当作 $${a} - ${p(e)}$；它是终点减起点 $${e} - ${p(a)} = ${e - a}$。`,
        ),
        why(
          0,
          "That gives the horizontal piece nothing as well; only the vertical piece has $dx = 0$.",
          "那是让水平段也没有贡献；只有竖直段 $dx = 0$。",
        ),
      ]),
      solution: walked(
        [
          [
            ["The vertical piece", "竖直段"],
            t(`$x = ${a}$ is constant, so $dx = 0$ and it contributes $0$.`, `$x = ${a}$ 为常数，所以 $dx = 0$，贡献 $0$。`),
          ],
          [
            ["The horizontal piece", "水平段"],
            t(
              `$y = ${d}$ and $x$ changes by $${e - a}$, so it contributes $${k} \\cdot ${p(d)} \\cdot ${p(e - a)} = ${answer}$.`,
              `$y = ${d}$，$x$ 的变化量是 $${e - a}$，所以贡献 $${k} \\cdot ${p(d)} \\cdot ${p(e - a)} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `With $x = ${poly([a, ""], [e - a, "t"])}$, $y = ${d}$ on the horizontal piece, $dx = ${e - a}\\,dt$ and $\\int_0^1 ${k * d} \\cdot ${p(e - a)}\\,dt = ${answer}$.`,
          `水平段取 $x = ${poly([a, ""], [e - a, "t"])}$，$y = ${d}$，$dx = ${e - a}\\,dt$，$\\int_0^1 ${k * d} \\cdot ${p(e - a)}\\,dt = ${answer}$。`,
        ),
      ),
    });
  },
);

const quarterCircleSum = {
  ...point(
    "p-dx-plus-q-dy-on-a-quarter-circle",
    ["P dx plus Q dy on a quarter circle", "四分之一圆上的 P dx + Q dy"],
    [
      "On a circle, $dx$ and $dy$ both come from the parametrization, and $dx = -r\\sin t\\,dt$ carries a minus sign that is easily lost. Then $y\\,dx$ gives $-r^{2}\\sin^{2}t\\,dt$, and $x\\,dy$ gives $r^{2}\\cos^{2}t\\,dt$, and each square averages one half over a quarter turn. On $x = 2\\cos t$, $y = 2\\sin t$, $0 \\le t \\le \\frac{\\pi}{2}$, $\\int_C 3x\\,dy = 12\\int_0^{\\pi/2} \\cos^2 t\\,dt = 3\\pi$.\n\n> **Watch out.** Keep the minus sign in $dx = -r\\sin t\\,dt$. Over a quarter turn $\\int \\cos^2 t\\,dt = \\int \\sin^2 t\\,dt = \\frac{\\pi}{4}$, not $\\frac{\\pi}{2}$.",
      "在圆上，$dx$ 和 $dy$ 都来自参数化，$dx = -r\\sin t\\,dt$ 带有容易丢失的负号。于是 $y\\,dx$ 给出 $-r^{2}\\sin^{2}t\\,dt$，$x\\,dy$ 给出 $r^{2}\\cos^{2}t\\,dt$，每个平方在四分之一圈上的平均值都是二分之一。在 $x = 2\\cos t$，$y = 2\\sin t$，$0 \\le t \\le \\frac{\\pi}{2}$ 上，$\\int_C 3x\\,dy = 12\\int_0^{\\pi/2} \\cos^2 t\\,dt = 3\\pi$。\n\n> **注意。** 保留 $dx = -r\\sin t\\,dt$ 中的负号。在四分之一圈上 $\\int \\cos^2 t\\,dt = \\int \\sin^2 t\\,dt = \\frac{\\pi}{4}$，不是 $\\frac{\\pi}{2}$。",
    ],
    (rng) => {
      const r = rng.int(1, 6);
      const a = nz(rng, 9);
      const b = rng.pick([-8, -5, -2, 1, 3, 6, 9].filter((v) => v !== a));
      const answer = Q.of(r * r * (b - a), 4);
      const form = poly([a, "y\\,dx"], [b, "x\\,dy"]);
      const quarter = Q.of(r * r, 4).toLatex();
      const quarterPi = r === 2 ? "\\pi" : `${quarter}\\pi`;
      return numberProblem({
        prompt: t(
          `$C$ is $x = ${r}\\cos t$, $y = ${r}\\sin t$, $0 \\le t \\le \\frac{\\pi}{2}$. Find $\\frac{1}{\\pi}\\int_{C} ${form}$.`,
          `$C$ 是 $x = ${r}\\cos t$，$y = ${r}\\sin t$，$0 \\le t \\le \\frac{\\pi}{2}$。求 $\\frac{1}{\\pi}\\int_{C} ${form}$。`,
        ),
        answer,
        mistakes: apart(answer, [
          why(Q.of(r * r * (a + b), 4), "That loses the minus sign in $dx = -r\\sin t\\,dt$.", "那是丢了 $dx = -r\\sin t\\,dt$ 中的负号。"),
          why(
            answer.neg(),
            "That traces the arc clockwise; $t$ increases from $0$ to $\\frac{\\pi}{2}$, which is counterclockwise.",
            "那是顺时针描画了这段弧；$t$ 从 $0$ 增加到 $\\frac{\\pi}{2}$，是逆时针。",
          ),
          why(
            Q.of(r * r * (b - a), 2),
            "That uses $\\frac{\\pi}{2}$ for each square; over a quarter turn $\\int \\cos^2 t\\,dt = \\frac{\\pi}{4}$.",
            "那是把每个平方的积分当作 $\\frac{\\pi}{2}$；在四分之一圈上 $\\int \\cos^2 t\\,dt = \\frac{\\pi}{4}$。",
          ),
        ]),
        solution: walked(
          [
            [
              ["Find the differentials", "求微分"],
              t(
                `$dx = -${r === 1 ? "" : r}\\sin t\\,dt$ and $dy = ${r === 1 ? "" : r}\\cos t\\,dt$.`,
                `$dx = -${r === 1 ? "" : r}\\sin t\\,dt$，$dy = ${r === 1 ? "" : r}\\cos t\\,dt$。`,
              ),
            ],
            [
              ["Substitute", "代入"],
              t(
                `The integrand becomes $${r * r === 1 ? "" : r * r}(${poly([b, "\\cos^{2}t"], [-a, "\\sin^{2}t"])})\\,dt$.`,
                `被积式变为 $${r * r === 1 ? "" : r * r}(${poly([b, "\\cos^{2}t"], [-a, "\\sin^{2}t"])})\\,dt$。`,
              ),
            ],
            [
              ["Integrate", "积分"],
              t(
                `Each square integrates to $\\frac{\\pi}{4}$, so the integral is $${r * r} \\cdot ${b - a < 0 ? `(${b - a})` : b - a} \\cdot \\frac{\\pi}{4}$, and divided by $\\pi$ it is $${answer.toLatex()}$.`,
                `每个平方积分为 $\\frac{\\pi}{4}$，所以积分为 $${r * r} \\cdot ${b - a < 0 ? `(${b - a})` : b - a} \\cdot \\frac{\\pi}{4}$，除以 $\\pi$ 得 $${answer.toLatex()}$。`,
              ),
            ],
          ],
          t(
            `Close the arc with the two axes; there $y = 0$ or $dx = 0$, and $x = 0$ or $dy = 0$. So $\\int_C x\\,dy$ is the quarter-disk area $${quarterPi}$ and $\\int_C y\\,dx$ is $-${quarterPi}$, and $${b} \\cdot ${quarter} - ${a < 0 ? `(${a})` : a} \\cdot ${quarter} = ${answer.toLatex()}$.`,
            `用两条坐标轴把弧封闭；轴上 $y = 0$ 或 $dx = 0$，$x = 0$ 或 $dy = 0$。所以 $\\int_C x\\,dy$ 是四分之一圆盘面积 $${quarterPi}$，$\\int_C y\\,dx$ 是 $-${quarterPi}$，$${b} \\cdot ${quarter} - ${a < 0 ? `(${a})` : a} \\cdot ${quarter} = ${answer.toLatex()}$。`,
          ),
        ),
      });
    },
  ),
  figure:
    multivariableDrawings5["sums-of-line-integrals-with-respect-to-x-and-y-over-parametric-curves#p-dx-plus-q-dy-on-a-quarter-circle"],
};

const generalSegment = point(
  "p-dx-plus-q-dy-on-a-slanted-segment",
  ["P dx plus Q dy on a slanted segment", "斜线段上的 P dx + Q dy"],
  [
    "On a slanted segment both $x$ and $y$ change. Since a linear function on a segment averages to the mean of its end values, $\\int y\\,dx$ is the change in $x$ times the mean of the values of $y$. Using only the starting value of $y$ is a common error. From $(1, 2)$ to $(4, 10)$, $x$ changes by $3$ while $y$ averages $6$, so $\\int_C y\\,dx = 18$.\n\n> **Watch out.** Pair each differential with the right average: $y\\,dx$ takes the mean of $y$ times the change in $x$, and $x\\,dy$ takes the mean of $x$ times the change in $y$.",
    "在斜线段上，$x$ 和 $y$ 都变化。由于线性函数在线段上的平均值等于两端值的平均数，所以 $\\int y\\,dx$ 等于 $x$ 的变化量乘以 $y$ 两端值的平均数。只用 $y$ 的起始值是常见错误。从 $(1, 2)$ 到 $(4, 10)$，$x$ 变化 $3$，$y$ 的平均值为 $6$，所以 $\\int_C y\\,dx = 18$。\n\n> **注意。** 每个微分要配对正确的平均值：$y\\,dx$ 用 $y$ 的平均值乘以 $x$ 的变化量，$x\\,dy$ 用 $x$ 的平均值乘以 $y$ 的变化量。",
  ],
  (rng) => {
    const x1 = rng.int(-5, 5);
    const y1 = rng.int(-5, 5);
    let dx = nz(rng, 6);
    const dy = nz(rng, 6);
    while (2 * x1 + dx === 0 && 2 * y1 + dy === 0) dx = nz(rng, 6);
    const x2 = x1 + dx;
    const y2 = y1 + dy;
    const k = nz(rng, 5);
    const m = nz(rng, 5);
    const part1 = Q.of(k * dx * (y1 + y2), 2);
    const part2 = Q.of(m * dy * (x1 + x2), 2);
    const answer = part1.add(part2);
    const form = poly([k, "y\\,dx"], [m, "x\\,dy"]);
    const yMean = Q.of(y1 + y2, 2);
    const xMean = Q.of(x1 + x2, 2);
    const pq = (v: Q) => (v.sign() < 0 ? `\\left(${v.toLatex()}\\right)` : v.toLatex());
    const lead = (c: number) => (c === 1 ? "" : c === -1 ? "-" : `${c}`);
    return numberProblem({
      prompt: t(
        `Evaluate $\\int_{C} ${form}$ along the segment from $(${x1}, ${y1})$ to $(${x2}, ${y2})$.`,
        `求 $\\int_{C} ${form}$，其中 $C$ 是从 $(${x1}, ${y1})$ 到 $(${x2}, ${y2})$ 的线段。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          Q.of(k * dx * y1 + m * dy * x1),
          "That uses the starting values of $y$ and $x$; each varies along the segment, so use its mean.",
          "那是用了 $y$ 和 $x$ 的起始值；它们沿线段变化，要用平均值。",
        ),
        why(
          Q.of(k * dy * (x1 + x2), 2).add(Q.of(m * dx * (y1 + y2), 2)),
          "That pairs $dx$ with the mean of $x$ and $dy$ with the mean of $y$; $y\\,dx$ needs the mean of $y$.",
          "那是把 $dx$ 配给了 $x$ 的平均值，把 $dy$ 配给了 $y$ 的平均值；$y\\,dx$ 需要 $y$ 的平均值。",
        ),
        why(
          part1,
          "That keeps only the $y\\,dx$ term; the $x\\,dy$ term contributes too.",
          "那是只保留了 $y\\,dx$ 项；$x\\,dy$ 项也有贡献。",
        ),
        why(
          part2,
          "That keeps only the $x\\,dy$ term; the $y\\,dx$ term contributes too.",
          "那是只保留了 $x\\,dy$ 项；$y\\,dx$ 项也有贡献。",
        ),
      ]),
      solution: walked(
        [
          [
            ["The $y\\,dx$ term", "$y\\,dx$ 项"],
            t(
              `$y$ averages $${yMean.toLatex()}$ while $x$ changes by $${dx}$: $${k} \\cdot ${pq(yMean)} \\cdot ${dx < 0 ? `(${dx})` : dx} = ${part1.toLatex()}$.`,
              `$x$ 变化 $${dx}$ 时 $y$ 的平均值为 $${yMean.toLatex()}$：$${k} \\cdot ${pq(yMean)} \\cdot ${dx < 0 ? `(${dx})` : dx} = ${part1.toLatex()}$。`,
            ),
          ],
          [
            ["The $x\\,dy$ term", "$x\\,dy$ 项"],
            t(
              `$x$ averages $${xMean.toLatex()}$ while $y$ changes by $${dy}$: $${m} \\cdot ${pq(xMean)} \\cdot ${dy < 0 ? `(${dy})` : dy} = ${part2.toLatex()}$.`,
              `$y$ 变化 $${dy}$ 时 $x$ 的平均值为 $${xMean.toLatex()}$：$${m} \\cdot ${pq(xMean)} \\cdot ${dy < 0 ? `(${dy})` : dy} = ${part2.toLatex()}$。`,
            ),
          ],
          [
            ["Add", "相加"],
            t(`$${part1.toLatex()} + ${pq(part2)} = ${answer.toLatex()}$.`, `$${part1.toLatex()} + ${pq(part2)} = ${answer.toLatex()}$。`),
          ],
        ],
        t(
          `With $x = ${poly([x1, ""], [dx, "t"])}$, $y = ${poly([y1, ""], [dy, "t"])}$, $0 \\le t \\le 1$, $\\int_0^1 ${lead(k)}(${poly([y1, ""], [dy, "t"])}) \\cdot ${dx < 0 ? `(${dx})` : dx}\\,dt = ${part1.toLatex()}$ and $\\int_0^1 ${lead(m)}(${poly([x1, ""], [dx, "t"])}) \\cdot ${dy < 0 ? `(${dy})` : dy}\\,dt = ${part2.toLatex()}$, as found.`,
          `取 $x = ${poly([x1, ""], [dx, "t"])}$，$y = ${poly([y1, ""], [dy, "t"])}$，$0 \\le t \\le 1$，$\\int_0^1 ${lead(k)}(${poly([y1, ""], [dy, "t"])}) \\cdot ${dx < 0 ? `(${dx})` : dx}\\,dt = ${part1.toLatex()}$，$\\int_0^1 ${lead(m)}(${poly([x1, ""], [dx, "t"])}) \\cdot ${dy < 0 ? `(${dy})` : dy}\\,dt = ${part2.toLatex()}$，与上面一致。`,
        ),
      ),
    });
  },
);

const twistedCubic = point(
  "a-vector-line-integral-along-a-space-curve",
  ["A vector line integral along a space curve", "沿空间曲线的向量线积分"],
  [
    "Along a space curve the dot product has three terms, and each component of $\\mathbf{F}$ pairs with the derivative of the matching coordinate. On $(t, t^{2}, t^{3})$ the derivatives are $1$, $2t$ and $3t^{2}$. For $\\mathbf{F} = \\langle z, x, y \\rangle$ on this curve from $t = 0$ to $t = 1$, the integrand is $t^{3} \\cdot 1 + t \\cdot 2t + t^{2} \\cdot 3t^{2} = t^{3} + 2t^{2} + 3t^{4}$, and the integral is $\\frac{1}{4} + \\frac{2}{3} + \\frac{3}{5} = \\frac{91}{60}$.\n\n> **Watch out.** Substituting the curve into $\\mathbf{F}$ is only half the work: each component must then be multiplied by the derivative of its own coordinate, $x'$, $y'$ or $z'$. Leaving out the factors $2t$ and $3t^{2}$ is the usual error.",
    "沿空间曲线，点积有三项，$\\mathbf{F}$ 的每个分量与相应坐标的导数相乘。在 $(t, t^{2}, t^{3})$ 上，导数是 $1$、$2t$ 和 $3t^{2}$。对 $\\mathbf{F} = \\langle z, x, y \\rangle$，沿这条曲线从 $t = 0$ 到 $t = 1$，被积函数是 $t^{3} \\cdot 1 + t \\cdot 2t + t^{2} \\cdot 3t^{2} = t^{3} + 2t^{2} + 3t^{4}$，积分为 $\\frac{1}{4} + \\frac{2}{3} + \\frac{3}{5} = \\frac{91}{60}$。\n\n> **注意。** 把曲线代入 $\\mathbf{F}$ 只完成了一半：每个分量还要乘以它对应坐标的导数 $x'$、$y'$ 或 $z'$。漏掉因子 $2t$ 和 $3t^{2}$ 是常见错误。",
  ],
  (rng) => {
    const a = nz(rng, 9);
    const b = nz(rng, 9);
    const c = nz(rng, 9);
    const answer = Q.of(a, 3)
      .add(Q.of(2 * b, 5))
      .add(Q.of(3 * c, 4));
    const noDerivative = Q.of(a, 3).add(Q.of(b, 4)).add(Q.of(c, 2));
    const noThree = Q.of(a, 3)
      .add(Q.of(2 * b, 5))
      .add(Q.of(c, 4));
    const F = br(poly([a, "y"]), poly([b, "z"]), poly([c, "x"]));
    const integrand = poly([a, "t^{2}"], [3 * c, "t^{3}"], [2 * b, "t^{4}"]);
    const pq = (v: Q) => (v.sign() < 0 ? `\\left(${v.toLatex()}\\right)` : v.toLatex());
    const pn = (n: number) => (n < 0 ? `(${n})` : `${n}`);
    return numberProblem({
      prompt: t(
        `Evaluate $\\int_{C} \\mathbf{F} \\cdot d\\mathbf{r}$ for $\\mathbf{F} = ${F}$ along $\\mathbf{r}(t) = \\langle t, t^{2}, t^{3} \\rangle$, $0 \\le t \\le 1$.`,
        `求 $\\int_{C} \\mathbf{F} \\cdot d\\mathbf{r}$，其中 $\\mathbf{F} = ${F}$，路径是 $\\mathbf{r}(t) = \\langle t, t^{2}, t^{3} \\rangle$，$0 \\le t \\le 1$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          noDerivative,
          "That substitutes the curve into $\\mathbf{F}$ but leaves out the derivatives $2t$ and $3t^{2}$ of the coordinates.",
          "那是把曲线代入了 $\\mathbf{F}$，却漏掉了坐标的导数 $2t$ 和 $3t^{2}$。",
        ),
        why(noThree, "That drops the factor $3$ from $z' = 3t^{2}$.", "那是漏掉了 $z' = 3t^{2}$ 中的因子 $3$。"),
        why(
          Q.of(a + b + c),
          "That adds the coefficients, as if every term of the integrand were $1$.",
          "那是把系数相加，好像被积函数的每一项都是 $1$。",
        ),
        why(
          answer.neg(),
          "That has the sign reversed; the curve runs from $t = 0$ to $t = 1$.",
          "那是符号反了；曲线从 $t = 0$ 走到 $t = 1$。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Differentiate the path", "对路径求导"],
            t("$\\mathbf{r}'(t) = \\langle 1, 2t, 3t^{2} \\rangle$.", "$\\mathbf{r}'(t) = \\langle 1, 2t, 3t^{2} \\rangle$。"),
          ],
          [
            ["Substitute into the field", "代入力场"],
            t(
              `With $x = t$, $y = t^{2}$, $z = t^{3}$: $\\mathbf{F}(\\mathbf{r}(t)) = ${br(poly([a, "t^{2}"]), poly([b, "t^{3}"]), poly([c, "t"]))}$.`,
              `由 $x = t$，$y = t^{2}$，$z = t^{3}$：$\\mathbf{F}(\\mathbf{r}(t)) = ${br(poly([a, "t^{2}"]), poly([b, "t^{3}"]), poly([c, "t"]))}$。`,
            ),
          ],
          [
            ["Take the dot product", "求点积"],
            t(`$\\mathbf{F} \\cdot \\mathbf{r}' = ${integrand}$.`, `$\\mathbf{F} \\cdot \\mathbf{r}' = ${integrand}$。`),
          ],
          [
            ["Integrate from 0 to 1", "从 0 积到 1"],
            t(
              `$${Q.of(a, 3).toLatex()} + ${pq(Q.of(3 * c, 4))} + ${pq(Q.of(2 * b, 5))} = ${answer.toLatex()}$.`,
              `$${Q.of(a, 3).toLatex()} + ${pq(Q.of(3 * c, 4))} + ${pq(Q.of(2 * b, 5))} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `Over the common denominator $60$ the sum is $\\frac{20 \\cdot ${pn(a)} + 45 \\cdot ${pn(c)} + 24 \\cdot ${pn(b)}}{60} = \\frac{${20 * a + 45 * c + 24 * b}}{60}$, which is $${answer.toLatex()}$.`,
          `通分到分母 $60$，和为 $\\frac{20 \\cdot ${pn(a)} + 45 \\cdot ${pn(c)} + 24 \\cdot ${pn(b)}}{60} = \\frac{${20 * a + 45 * c + 24 * b}}{60}$，即 $${answer.toLatex()}$。`,
        ),
      ),
    });
  },
);

const graphInY = {
  ...point(
    "a-vector-line-integral-along-a-graph-x-in-terms-of-y",
    ["A vector line integral along a graph of x in terms of y", "沿 x 关于 y 的图像的向量线积分"],
    [
      "If a curve is a graph $x = g(y)$, then $y$ is the natural parameter, and $dx = g'(y)\\,dy$. Everything must be written in $y$ before integrating, including the term in $dx$. For $\\mathbf{F} = \\langle y, x \\rangle$ along $x = y^{3}$ from $(0, 0)$ to $(8, 2)$, $dx = 3y^{2}\\,dy$, so the integrand is $y \\cdot 3y^{2} + y^{3} = 4y^{3}$ and the integral is $\\int_0^2 4y^{3}\\,dy = 16$.\n\n> **Watch out.** The term in $dx$ picks up the factor $g'(y)$, which is easily left out, while the term in $dy$ does not. And the limits are values of $y$, not of $x$.",
      "如果曲线是图像 $x = g(y)$，$y$ 就是自然的参数，且 $dx = g'(y)\\,dy$。积分前一切都要写成 $y$ 的式子，包括 $dx$ 的项。对 $\\mathbf{F} = \\langle y, x \\rangle$，沿 $x = y^{3}$ 从 $(0, 0)$ 到 $(8, 2)$，$dx = 3y^{2}\\,dy$，所以被积函数是 $y \\cdot 3y^{2} + y^{3} = 4y^{3}$，积分为 $\\int_0^2 4y^{3}\\,dy = 16$。\n\n> **注意。** $dx$ 的项要乘上因子 $g'(y)$，这个因子容易漏掉，而 $dy$ 的项不需要。积分限是 $y$ 的值，不是 $x$ 的值。",
    ],
    (rng) => {
      const p = nz(rng, 6);
      const q = nz(rng, 6);
      const Y = rng.int(1, 6);
      const answer = Q.of((2 * p + q) * Y ** 3, 3);
      const first = Q.of(2 * p * Y ** 3, 3);
      const second = Q.of(q * Y ** 3, 3);
      const pq = (v: Q) => (v.sign() < 0 ? `\\left(${v.toLatex()}\\right)` : v.toLatex());
      return numberProblem({
        prompt: t(
          `Evaluate $\\int_{C} \\mathbf{F} \\cdot d\\mathbf{r}$ for $\\mathbf{F} = ${br(poly([p, "y"]), poly([q, "x"]))}$ along $x = y^{2}$ from $(0, 0)$ to $(${Y * Y}, ${Y})$.`,
          `求 $\\int_{C} \\mathbf{F} \\cdot d\\mathbf{r}$，其中 $\\mathbf{F} = ${br(poly([p, "y"]), poly([q, "x"]))}$，路径是 $x = y^{2}$ 上从 $(0, 0)$ 到 $(${Y * Y}, ${Y})$ 的一段。`,
        ),
        answer,
        mistakes: apart(answer, [
          why(
            Q.of((p + q) * Y ** 3, 3),
            "That writes $dx$ as $y\\,dy$, dropping the factor $2$ of $dx = 2y\\,dy$.",
            "那是把 $dx$ 写成了 $y\\,dy$，漏掉了 $dx = 2y\\,dy$ 中的因子 $2$。",
          ),
          why(
            Q.of((2 * q + p) * Y ** 3, 3),
            "That puts the factor $2$ on the $dy$ term; only the $dx$ term picks up $g'(y) = 2y$.",
            "那是把因子 $2$ 放到了 $dy$ 项上；只有 $dx$ 项才乘 $g'(y) = 2y$。",
          ),
          why(
            Q.of((2 * p + q) * Y ** 2, 2),
            "That integrates $y^{2}$ as if it were $y$; the antiderivative of $y^{2}$ is $\\frac{y^{3}}{3}$.",
            "那是把 $y^{2}$ 当成 $y$ 来积分；$y^{2}$ 的原函数是 $\\frac{y^{3}}{3}$。",
          ),
          why(
            Q.of((2 * p + q) * Y ** 6, 3),
            `That integrates up to $x = ${Y * Y}$; the parameter is $y$, which runs to $${Y}$.`,
            `那是积到了 $x = ${Y * Y}$；参数是 $y$，它只到 $${Y}$。`,
          ),
        ]),
        solution: walked(
          [
            [["Use y as the parameter", "以 y 为参数"], t("On $x = y^{2}$, $dx = 2y\\,dy$.", "在 $x = y^{2}$ 上，$dx = 2y\\,dy$。")],
            [
              ["Write everything in y", "全部写成 y 的式子"],
              t(
                `$${poly([p, "y"])}\\,dx = ${poly([2 * p, "y^{2}"])}\\,dy$ and $${poly([q, "x"])}\\,dy = ${poly([q, "y^{2}"])}\\,dy$, so the integrand is $${poly([2 * p + q, "y^{2}"])}\\,dy$.`,
                `$${poly([p, "y"])}\\,dx = ${poly([2 * p, "y^{2}"])}\\,dy$，$${poly([q, "x"])}\\,dy = ${poly([q, "y^{2}"])}\\,dy$，所以被积式是 $${poly([2 * p + q, "y^{2}"])}\\,dy$。`,
              ),
            ],
            [
              [`Integrate from 0 to ${Y}`, `从 0 积到 ${Y}`],
              t(
                `$\\int_0^{${Y}} ${poly([2 * p + q, "y^{2}"])}\\,dy = ${answer.toLatex()}$.`,
                `$\\int_0^{${Y}} ${poly([2 * p + q, "y^{2}"])}\\,dy = ${answer.toLatex()}$。`,
              ),
            ],
          ],
          t(
            `Split the two terms: $\\int ${poly([p, "y"])}\\,dx = ${p === 1 ? "" : p === -1 ? "-" : `${p}`}\\int_0^{${Y * Y}} \\sqrt{x}\\,dx = ${first.toLatex()}$ and $\\int ${poly([q, "x"])}\\,dy = ${q === 1 ? "" : q === -1 ? "-" : `${q}`}\\int_0^{${Y}} y^{2}\\,dy = ${second.toLatex()}$, which add to $${first.toLatex()} + ${pq(second)} = ${answer.toLatex()}$.`,
            `把两项分开：$\\int ${poly([p, "y"])}\\,dx = ${p === 1 ? "" : p === -1 ? "-" : `${p}`}\\int_0^{${Y * Y}} \\sqrt{x}\\,dx = ${first.toLatex()}$，$\\int ${poly([q, "x"])}\\,dy = ${q === 1 ? "" : q === -1 ? "-" : `${q}`}\\int_0^{${Y}} y^{2}\\,dy = ${second.toLatex()}$，两者相加得 $${first.toLatex()} + ${pq(second)} = ${answer.toLatex()}$。`,
          ),
        ),
      });
    },
  ),
  figure:
    multivariableDrawings6[
      "line-integrals-of-vector-valued-functions-over-general-curves#a-vector-line-integral-along-a-graph-x-in-terms-of-y"
    ],
};

const tangentialComponent = point(
  "work-from-the-tangential-component",
  ["Work from the tangential component", "由切向分量求功"],
  [
    "Since $d\\mathbf{r} = \\mathbf{T}\\,ds$, a line integral of a vector field is the scalar integral of the tangential component. Reversing the curve reverses $\\mathbf{T}$, so the tangential component changes sign, and this is why the vector integral changes sign but a scalar one does not. If $\\mathbf{F} \\cdot \\mathbf{T} = -3$ all along a curve $C$ of length $15$, then $\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = -45$ and $\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r} = 45$.\n\n> **Watch out.** The length is the same in both directions, but the tangential component is not: on $-C$ it is the negative of its value on $C$. Multiply by the length as well; the tangential component alone is not the integral.",
    "由于 $d\\mathbf{r} = \\mathbf{T}\\,ds$，向量场的线积分是切向分量的标量积分。曲线反向时 $\\mathbf{T}$ 反向，切向分量变号，这就是向量线积分变号而标量线积分不变号的原因。如果沿长度为 $15$ 的曲线 $C$ 处处有 $\\mathbf{F} \\cdot \\mathbf{T} = -3$，那么 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = -45$，$\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r} = 45$。\n\n> **注意。** 两个方向上的长度相同，但切向分量不同：在 $-C$ 上它是在 $C$ 上的值的相反数。还要乘以长度；单独的切向分量不是积分。",
  ],
  (rng) => {
    const c = nz(rng, 9);
    const L = rng.int(2, 12);
    const answer = -c * L;
    return numberProblem({
      prompt: t(
        `Along a curve $C$ of length $${L}$, the tangential component $\\mathbf{F} \\cdot \\mathbf{T}$ equals $${c}$ at every point. Find $\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r}$.`,
        `沿长度为 $${L}$ 的曲线 $C$，切向分量 $\\mathbf{F} \\cdot \\mathbf{T}$ 处处等于 $${c}$。求 $\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r}$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          c * L,
          "That is the integral over $C$; reversing the curve reverses $\\mathbf{T}$ and changes the sign.",
          "那是沿 $C$ 的积分；曲线反向时 $\\mathbf{T}$ 反向，符号改变。",
        ),
        why(
          -c,
          "That is the tangential component on $-C$ alone; it must be multiplied by the length.",
          "那只是 $-C$ 上的切向分量；还要乘以长度。",
        ),
        why(
          c,
          "That is the tangential component on $C$, neither multiplied by the length nor reversed.",
          "那是 $C$ 上的切向分量，既没有乘以长度也没有变号。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Integrate over C", "沿 C 积分"],
            t(
              `$\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_C \\mathbf{F} \\cdot \\mathbf{T}\\,ds = ${c} \\cdot ${L} = ${c * L}$.`,
              `$\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_C \\mathbf{F} \\cdot \\mathbf{T}\\,ds = ${c} \\cdot ${L} = ${c * L}$。`,
            ),
          ],
          [
            ["Reverse the direction", "反转方向"],
            t(
              `On $-C$ the unit tangent is $-\\mathbf{T}$, so the integral changes sign: $${answer}$.`,
              `在 $-C$ 上单位切向量是 $-\\mathbf{T}$，所以积分变号：$${answer}$。`,
            ),
          ],
        ],
        t(
          `Directly on $-C$: the tangential component is $${-c}$ at every point and the length is still $${L}$, so the integral is $${-c} \\cdot ${L} = ${answer}$.`,
          `直接在 $-C$ 上算：切向分量处处为 $${-c}$，长度仍是 $${L}$，所以积分为 $${-c} \\cdot ${L} = ${answer}$。`,
        ),
      ),
    });
  },
);

const potentialChain = point(
  "chaining-values-of-a-potential",
  ["Chaining values of a potential", "把势函数的值串联起来"],
  [
    "The fundamental theorem says that a gradient integral from $A$ to $B$ is $f(B) - f(A)$. So integrals act as differences, and several of them can be chained to find a value of $f$ at a new point, as long as the direction of each path is respected. If $f(A) = 30$, the integral from $A$ to $B$ is $5$ and the integral from $D$ to $B$ is $-4$, then $f(B) = 35$ and $f(D) = f(B) - (-4) = 39$.\n\n> **Watch out.** A path that ends at the point you want gives $f$ there minus $f$ at its start, so its integral is subtracted when you go back along it. Adding it instead treats the path as if it ran the other way.",
    "基本定理指出，从 $A$ 到 $B$ 的梯度积分是 $f(B) - f(A)$。所以积分相当于差值，可以把几个积分串联起来求 $f$ 在新点的值，只要注意每条路径的方向。若 $f(A) = 30$，从 $A$ 到 $B$ 的积分是 $5$，从 $D$ 到 $B$ 的积分是 $-4$，则 $f(B) = 35$，$f(D) = f(B) - (-4) = 39$。\n\n> **注意。** 积分等于终点处的 $f$ 减起点处的 $f$，所以逆着路径往回推时要减去它的积分。把它加上，就等于把路径方向弄反了。",
  ],
  (rng) => {
    const drawn = rng.int(-20, 20);
    const i1 = nz(rng, 20);
    const i2 = nz(rng, 20);
    const v = drawn + i1 - i2 === 0 ? drawn + 1 : drawn;
    const answer = v + i1 - i2;
    const pn = (n: number) => (n < 0 ? `(${n})` : `${n}`);
    return numberProblem({
      prompt: t(
        `$f(A) = ${v}$, $\\int_{C_{1}} \\nabla f \\cdot d\\mathbf{r} = ${i1}$ for a path $C_{1}$ from $A$ to $B$, and $\\int_{C_{2}} \\nabla f \\cdot d\\mathbf{r} = ${i2}$ for a path $C_{2}$ from $D$ to $B$. Find $f(D)$.`,
        `$f(A) = ${v}$，对从 $A$ 到 $B$ 的路径 $C_{1}$，$\\int_{C_{1}} \\nabla f \\cdot d\\mathbf{r} = ${i1}$；对从 $D$ 到 $B$ 的路径 $C_{2}$，$\\int_{C_{2}} \\nabla f \\cdot d\\mathbf{r} = ${i2}$。求 $f(D)$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          v + i1 + i2,
          "That adds the integral along $C_{2}$; it runs from $D$ to $B$, so it equals $f(B) - f(D)$ and must be subtracted.",
          "那是加上了沿 $C_{2}$ 的积分；$C_{2}$ 从 $D$ 到 $B$，它等于 $f(B) - f(D)$，应当减去。",
        ),
        why(i1 - i2, "That leaves out $f(A)$; the integrals give only differences of $f$.", "那是漏掉了 $f(A)$；积分只给出 $f$ 的差值。"),
        why(
          v - i1 + i2,
          "That reverses both paths; $C_{1}$ starts at $A$, so $f(B) = f(A)$ plus its integral.",
          "那是把两条路径都弄反了；$C_{1}$ 从 $A$ 出发，所以 $f(B)$ 等于 $f(A)$ 加上它的积分。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Go from A to B", "从 A 到 B"],
            t(
              `$f(B) - f(A) = ${i1}$, so $f(B) = ${v} + ${pn(i1)} = ${v + i1}$.`,
              `$f(B) - f(A) = ${i1}$，所以 $f(B) = ${v} + ${pn(i1)} = ${v + i1}$。`,
            ),
          ],
          [
            ["Go back from B to D", "从 B 回到 D"],
            t(
              `$f(B) - f(D) = ${i2}$, so $f(D) = ${v + i1} - ${pn(i2)} = ${answer}$.`,
              `$f(B) - f(D) = ${i2}$，所以 $f(D) = ${v + i1} - ${pn(i2)} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `The route from $A$ along $C_{1}$ and back along $C_{2}$ ends at $D$, so $f(D) - f(A) = ${i1} - ${pn(i2)} = ${i1 - i2}$, and $${v} + ${pn(i1 - i2)} = ${answer}$.`,
          `从 $A$ 沿 $C_{1}$ 走、再沿 $C_{2}$ 反向走，终点是 $D$，所以 $f(D) - f(A) = ${i1} - ${pn(i2)} = ${i1 - i2}$，而 $${v} + ${pn(i1 - i2)} = ${answer}$。`,
        ),
      ),
    });
  },
);

const twoPaths = point(
  "two-paths-make-a-closed-loop",
  ["Two paths make a closed loop", "两条路径组成闭合回路"],
  [
    "Going along $C_{1}$ and returning along $C_{2}$ backwards makes a closed loop, whose integral is the difference of the two path integrals. For a conservative field this difference must be zero, so unequal values on two paths with the same endpoints prove the field is not conservative. If the two paths give $25$ and $9$, the loop gives $25 - 9 = 16$, and the field has no potential.\n\n> **Watch out.** Running $C_{2}$ backwards changes the sign of its integral, so the loop is the difference $\\int_{C_{1}} - \\int_{C_{2}}$, not the sum.",
    "沿 $C_{1}$ 前进，再沿 $C_{2}$ 反向返回，构成闭合回路，其积分等于两个路径积分之差。对保守场，这个差必须为零，所以起点和终点相同的两条路径给出不同的值，就证明这个场不是保守场。若两条路径分别给出 $25$ 和 $9$，回路给出 $25 - 9 = 16$，这个场没有势函数。\n\n> **注意。** 反向走 $C_{2}$ 会使它的积分变号，所以回路积分是差 $\\int_{C_{1}} - \\int_{C_{2}}$，而不是和。",
  ],
  (rng) => {
    const p = nz(rng, 20);
    const q = rng.pick([-17, -11, -6, -2, 3, 7, 13, 19].filter((v) => v !== p));
    const answer = p - q;
    const pn = (n: number) => (n < 0 ? `(${n})` : `${n}`);
    return numberProblem({
      prompt: t(
        `$C_{1}$ and $C_{2}$ both go from $A$ to $B$, with $\\int_{C_{1}} \\mathbf{F} \\cdot d\\mathbf{r} = ${p}$ and $\\int_{C_{2}} \\mathbf{F} \\cdot d\\mathbf{r} = ${q}$. Find the integral around the loop that follows $C_{1}$ and then $C_{2}$ backwards.`,
        `$C_{1}$ 和 $C_{2}$ 都从 $A$ 到 $B$，且 $\\int_{C_{1}} \\mathbf{F} \\cdot d\\mathbf{r} = ${p}$，$\\int_{C_{2}} \\mathbf{F} \\cdot d\\mathbf{r} = ${q}$。求先沿 $C_{1}$、再沿 $C_{2}$ 反向所成回路上的积分。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          p + q,
          "That adds the two integrals; running $C_{2}$ backwards changes the sign of its integral.",
          "那是把两个积分相加；反向走 $C_{2}$ 会使它的积分变号。",
        ),
        why(
          q - p,
          "That reverses $C_{1}$ instead of $C_{2}$; the loop follows $C_{1}$ forwards.",
          "那是把 $C_{1}$ 反向了，而不是 $C_{2}$；回路沿 $C_{1}$ 正向走。",
        ),
        why(
          0,
          "That assumes $\\mathbf{F}$ is conservative; the two paths give different values, so it is not.",
          "那是假设 $\\mathbf{F}$ 是保守场；两条路径给出不同的值，所以它不是。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Follow C1", "沿 C1 走"],
            t(`From $A$ to $B$ along $C_{1}$ the integral is $${p}$.`, `沿 $C_{1}$ 从 $A$ 到 $B$，积分为 $${p}$。`),
          ],
          [
            ["Return along C2 backwards", "沿 C2 反向返回"],
            t(`Reversing $C_{2}$ changes the sign, giving $-${pn(q)}$.`, `把 $C_{2}$ 反向会变号，得 $-${pn(q)}$。`),
          ],
          [
            ["Add the two legs", "两段相加"],
            t(
              `$${p} - ${pn(q)} = ${answer}$, which is not zero, so $\\mathbf{F}$ is not conservative.`,
              `$${p} - ${pn(q)} = ${answer}$，不为零，所以 $\\mathbf{F}$ 不是保守场。`,
            ),
          ],
        ],
        t(
          `Going around the loop the other way, along $C_{2}$ and back along $C_{1}$, gives $${q} - ${pn(p)} = ${q - p}$, the negative of $${answer}$, as reversing a loop must.`,
          `反方向绕回路，即沿 $C_{2}$ 走再沿 $C_{1}$ 返回，得 $${q} - ${pn(p)} = ${q - p}$，正是 $${answer}$ 的相反数，与回路反向应有的结果一致。`,
        ),
      ),
    });
  },
);

const findKThenIntegrate = point(
  "making-a-field-conservative-and-then-integrating",
  ["Making a field conservative and then integrating", "先使场成为保守场再积分"],
  [
    "An unknown coefficient in a field is fixed by the condition $P_{y} = Q_{x}$. Only then does a potential exist, and the line integral follows from its values at the ends. The term $2axy$ in $P$ and the term $ax^{2}$ in $Q$ come from the same $ax^{2}y$ in $f$. For $\\langle 10xy + 7, kx^{2} + 3 \\rangle$, $P_{y} = 10x$ and $Q_{x} = 2kx$ give $k = 5$; then $f = 5x^{2}y + 7x + 3y$, and from $(0, 0)$ to $(1, 2)$ the integral is $10 + 7 + 6 = 23$.\n\n> **Watch out.** The term $ax^{2}y$ appears once in $f$, though it shows up in both components. The constants in $P$ and $Q$ integrate to $px$ and $qy$, and both belong in $f$.",
    "场中的未知系数由条件 $P_{y} = Q_{x}$ 确定。只有这时势函数才存在，线积分由它在两端的值得到。$P$ 中的 $2axy$ 和 $Q$ 中的 $ax^{2}$ 来自 $f$ 中同一项 $ax^{2}y$。对 $\\langle 10xy + 7, kx^{2} + 3 \\rangle$，由 $P_{y} = 10x$ 与 $Q_{x} = 2kx$ 得 $k = 5$；于是 $f = 5x^{2}y + 7x + 3y$，从 $(0, 0)$ 到 $(1, 2)$ 的积分为 $10 + 7 + 6 = 23$。\n\n> **注意。** 项 $ax^{2}y$ 虽然出现在两个分量里，在 $f$ 中只出现一次。$P$ 与 $Q$ 中的常数分别积分为 $px$ 与 $qy$，两者都属于 $f$。",
  ],
  (rng) => {
    const a = nz(rng, 4);
    const p = nz(rng, 6);
    const q = nz(rng, 6);
    const X = nz(rng, 3);
    const Y = nz(rng, 4);
    const answer = a * X * X * Y + p * X + q * Y;
    const F = br(poly([2 * a, "xy"], [p, ""]), poly([1, "kx^{2}"], [q, ""]));
    const pn = (n: number) => (n < 0 ? `(${n})` : `${n}`);
    const leg1 = p * X;
    const leg2 = (a * X * X + q) * Y;
    return numberProblem({
      prompt: t(
        `$\\mathbf{F} = ${F}$ is conservative for exactly one value of $k$. For that $k$, find $\\int_{C} \\mathbf{F} \\cdot d\\mathbf{r}$ along any path from $(0, 0)$ to $(${X}, ${Y})$.`,
        `$\\mathbf{F} = ${F}$ 只在 $k$ 取某一个值时是保守场。对这个 $k$，沿任一条从 $(0, 0)$ 到 $(${X}, ${Y})$ 的路径，求 $\\int_{C} \\mathbf{F} \\cdot d\\mathbf{r}$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          p * X + q * Y,
          `That leaves out the term $${poly([a, "x^{2}y"])}$ of $f$, as if $k$ were $0$.`,
          `那是漏掉了 $f$ 中的项 $${poly([a, "x^{2}y"])}$，好像 $k$ 是 $0$。`,
        ),
        why(
          2 * a * X * X * Y + p * X + q * Y,
          `That gives $f$ the term $${poly([2 * a, "x^{2}y"])}$; integrating $${poly([2 * a, "xy"])}$ in $x$ gives $${poly([a, "x^{2}y"])}$.`,
          `那是让 $f$ 含项 $${poly([2 * a, "x^{2}y"])}$；$${poly([2 * a, "xy"])}$ 对 $x$ 积分得 $${poly([a, "x^{2}y"])}$。`,
        ),
        why(
          a * X * X * Y + p * X,
          `That leaves out $${poly([q, "y"])}$, which comes from the constant $${q}$ in $Q$.`,
          `那是漏掉了 $${poly([q, "y"])}$，它来自 $Q$ 中的常数 $${q}$。`,
        ),
        why(
          a * X * X * Y + q * Y,
          `That leaves out $${poly([p, "x"])}$, which comes from the constant $${p}$ in $P$.`,
          `那是漏掉了 $${poly([p, "x"])}$，它来自 $P$ 中的常数 $${p}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Find k", "求 k"],
            t(
              `$P_{y} = ${poly([2 * a, "x"])}$ and $Q_{x} = 2kx$, so $k = ${a}$.`,
              `$P_{y} = ${poly([2 * a, "x"])}$，$Q_{x} = 2kx$，所以 $k = ${a}$。`,
            ),
          ],
          [
            ["Find a potential", "求势函数"],
            t(
              `Integrating $P$ in $x$ gives $${poly([a, "x^{2}y"], [p, "x"])} + g(y)$, and matching $Q$ gives $g(y) = ${poly([q, "y"])}$, so $f = ${poly([a, "x^{2}y"], [p, "x"], [q, "y"])}$.`,
              `把 $P$ 对 $x$ 积分得 $${poly([a, "x^{2}y"], [p, "x"])} + g(y)$，与 $Q$ 比较得 $g(y) = ${poly([q, "y"])}$，所以 $f = ${poly([a, "x^{2}y"], [p, "x"], [q, "y"])}$。`,
            ),
          ],
          [
            ["Evaluate at the ends", "代入两端"],
            t(`$f(${X}, ${Y}) - f(0, 0) = ${answer} - 0 = ${answer}$.`, `$f(${X}, ${Y}) - f(0, 0) = ${answer} - 0 = ${answer}$。`),
          ],
        ],
        t(
          `Along the $x$-axis to $(${X}, 0)$ the integrand is the constant $${p}$, giving $${leg1}$; then up the line $x = ${X}$ it is $${a * X * X + q}$, giving $${leg2}$; and $${leg1} + ${pn(leg2)} = ${answer}$.`,
          `沿 $x$ 轴到 $(${X}, 0)$，被积函数是常数 $${p}$，得 $${leg1}$；再沿直线 $x = ${X}$ 向上，被积函数是 $${a * X * X + q}$，得 $${leg2}$；而 $${leg1} + ${pn(leg2)} = ${answer}$。`,
        ),
      ),
    });
  },
);

const endpointsFromParametrization = point(
  "endpoints-given-by-a-parametrization",
  ["Endpoints given by a parametrization", "由参数式给出的端点"],
  [
    "With a potential, the integral along a parametrized space curve needs only the two endpoints, so the path itself never has to be differentiated. Substituting the parameter values gives those endpoints, including a start that need not be the origin. For $\\langle 4yz, 4xz, 4xy + 3 \\rangle = \\nabla(4xyz + 3z)$ along $\\mathbf{r}(t) = \\langle t, 2t, 1 + t \\rangle$, $0 \\le t \\le 1$, the ends are $(0, 0, 1)$, where $f = 3$, and $(1, 2, 2)$, where $f = 22$, so the integral is $19$.\n\n> **Watch out.** Find both ends by putting the two parameter values into every coordinate; $t = 0$ need not give the origin, and each coordinate must take its own value at the end.",
    "有势函数时，沿参数化空间曲线的积分只需要两个端点，所以根本不必对路径求导。代入参数值就得到这两个端点，起点不一定是原点。对 $\\langle 4yz, 4xz, 4xy + 3 \\rangle = \\nabla(4xyz + 3z)$，沿 $\\mathbf{r}(t) = \\langle t, 2t, 1 + t \\rangle$，$0 \\le t \\le 1$，两端是 $(0, 0, 1)$（$f = 3$）和 $(1, 2, 2)$（$f = 22$），所以积分为 $19$。\n\n> **注意。** 把两个参数值分别代入每个坐标来求两端；$t = 0$ 不一定给出原点，终点的每个坐标都要取各自的值。",
  ],
  (rng) => {
    const a = nz(rng, 3);
    const c = nz(rng, 5);
    const T = rng.int(1, 3);
    const X = T * T;
    const Y = 1 - T;
    const Z = T ** 3;
    const answer = a * X * Y * Z + c * Z;
    const F = br(poly([a, "yz"]), poly([a, "xz"]), poly([a, "xy"], [c, ""]));
    const pn = (n: number) => (n < 0 ? `(${n})` : `${n}`);
    return numberProblem({
      prompt: t(
        `Evaluate $\\int_{C} \\mathbf{F} \\cdot d\\mathbf{r}$ for $\\mathbf{F} = ${F}$ along $\\mathbf{r}(t) = \\langle t^{2}, 1 - t, t^{3} \\rangle$, $0 \\le t \\le ${T}$.`,
        `求 $\\int_{C} \\mathbf{F} \\cdot d\\mathbf{r}$，其中 $\\mathbf{F} = ${F}$，路径是 $\\mathbf{r}(t) = \\langle t^{2}, 1 - t, t^{3} \\rangle$，$0 \\le t \\le ${T}$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(c * Z, `That leaves out the term $${poly([a, "xyz"])}$ of the potential.`, `那是漏掉了势函数中的项 $${poly([a, "xyz"])}$。`),
        why(
          a * X * Z + c * Z,
          `That keeps $y = 1$ from the start; at the end $y = 1 - ${T} = ${Y}$.`,
          `那是沿用了起点的 $y = 1$；在终点 $y = 1 - ${T} = ${Y}$。`,
        ),
        why(
          a * X * Y * Z,
          `That leaves out the term $${poly([c, "z"])}$, which gives the constant $${c}$ in the last component.`,
          `那是漏掉了项 $${poly([c, "z"])}$，最后一个分量中的常数 $${c}$ 正来自它。`,
        ),
        why(
          -answer,
          "That is the start value minus the end value; the integral is $f$ at the end minus $f$ at the start.",
          "那是起点的值减终点的值；积分是终点处的 $f$ 减起点处的 $f$。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Find a potential", "求势函数"],
            t(
              `$\\mathbf{F} = \\nabla f$ with $f = ${poly([a, "xyz"], [c, "z"])}$.`,
              `$\\mathbf{F} = \\nabla f$，$f = ${poly([a, "xyz"], [c, "z"])}$。`,
            ),
          ],
          [
            ["Find the ends", "求两端"],
            t(
              `$\\mathbf{r}(0) = (0, 1, 0)$ and $\\mathbf{r}(${T}) = (${X}, ${Y}, ${Z})$.`,
              `$\\mathbf{r}(0) = (0, 1, 0)$，$\\mathbf{r}(${T}) = (${X}, ${Y}, ${Z})$。`,
            ),
          ],
          [
            ["Subtract", "相减"],
            t(
              `$f(${X}, ${Y}, ${Z}) - f(0, 1, 0) = ${answer} - 0 = ${answer}$.`,
              `$f(${X}, ${Y}, ${Z}) - f(0, 1, 0) = ${answer} - 0 = ${answer}$。`,
            ),
          ],
        ],
        t(
          `Directly, $\\mathbf{F}(\\mathbf{r}(t)) \\cdot \\mathbf{r}'(t)$ simplifies to $${poly([5 * a, "t^{4}"], [-6 * a, "t^{5}"], [3 * c, "t^{2}"])}$, whose integral from $0$ to $${T}$ is $${a} \\cdot (${T ** 5} - ${T ** 6}) + ${pn(c)} \\cdot ${T ** 3} = ${answer}$.`,
          `直接计算，$\\mathbf{F}(\\mathbf{r}(t)) \\cdot \\mathbf{r}'(t)$ 化简为 $${poly([5 * a, "t^{4}"], [-6 * a, "t^{5}"], [3 * c, "t^{2}"])}$，它从 $0$ 到 $${T}$ 的积分是 $${a} \\cdot (${T ** 5} - ${T ** 6}) + ${pn(c)} \\cdot ${T ** 3} = ${answer}$。`,
        ),
      ),
    });
  },
);

const turningPoint = point(
  "the-turning-point-of-a-spring",
  ["The turning point of a spring", "弹簧的折返点"],
  [
    "At a turning point the speed is zero, so all the mechanical energy is potential. For $U = \\frac{1}{2}kx^{2}$ and a start at the origin with speed $v$, equating $\\frac{1}{2}mv^{2}$ with $\\frac{1}{2}kA^{2}$ gives the amplitude $A$, without knowing the motion in time. For mass $7$, $U = 14x^{2}$ and speed $6$ at the origin, the energy is $\\frac{1}{2} \\cdot 7 \\cdot 36 = 126$, so $14A^{2} = 126$, $A^{2} = 9$ and $A = 3$.\n\n> **Watch out.** Solving gives $A^{2}$ first; take its square root. The mass stays in the kinetic energy, so $A^{2} = \\frac{mv^{2}}{k}$, not $\\frac{v^{2}}{k}$.",
    "在折返点速度为零，所以全部机械能都是势能。对 $U = \\frac{1}{2}kx^{2}$，从原点以速度 $v$ 出发，令 $\\frac{1}{2}mv^{2}$ 等于 $\\frac{1}{2}kA^{2}$，就得到振幅 $A$，不必知道运动随时间的变化。对质量 $7$、$U = 14x^{2}$、在原点速度为 $6$ 的情形，能量为 $\\frac{1}{2} \\cdot 7 \\cdot 36 = 126$，所以 $14A^{2} = 126$，$A^{2} = 9$，$A = 3$。\n\n> **注意。** 解方程先得到 $A^{2}$，还要开平方。动能中保留着质量，所以 $A^{2} = \\frac{mv^{2}}{k}$，而不是 $\\frac{v^{2}}{k}$。",
  ],
  (rng) => {
    const m = rng.int(1, 6);
    const n = rng.int(2, 5);
    const A = rng.int(1, 6);
    const v = n * A;
    const k = m * n * n;
    const energy = Q.of(m * v * v, 2);
    return numberProblem({
      prompt: t(
        `A particle of mass $${m}$ moves under $U(x) = ${poly([Q.of(k, 2), "x^{2}"])}$ alone, and has speed $${v}$ at the origin. Find the largest value of $x$ it reaches.`,
        `质量为 $${m}$ 的质点只受势能 $U(x) = ${poly([Q.of(k, 2), "x^{2}"])}$ 的作用，在原点的速度是 $${v}$。求它能达到的最大 $x$。`,
      ),
      answer: A,
      mistakes: apart(A, [
        why(
          v,
          "That takes the speed at the origin as the distance reached; the two are linked through the energy.",
          "那是把原点处的速率当成了到达的距离；二者要通过能量联系起来。",
        ),
        why(A * A, "That is $A^{2}$; the largest $x$ is its square root.", "那是 $A^{2}$；最大的 $x$ 是它的平方根。"),
        why(
          Q.of(v * v, k),
          "That leaves out the mass and the square root; $A^{2} = \\frac{mv^{2}}{k}$.",
          "那是漏掉了质量和开平方；$A^{2} = \\frac{mv^{2}}{k}$。",
        ),
        why(
          v * v,
          "That sets $A$ equal to $v^{2}$, leaving out both the mass and the spring constant.",
          "那是令 $A$ 等于 $v^{2}$，漏掉了质量和弹簧常数。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Energy at the origin", "原点处的能量"],
            t(
              `$U(0) = 0$, so the energy is all kinetic: $\\frac{1}{2} \\cdot ${m} \\cdot ${v}^{2} = ${energy.toLatex()}$.`,
              `$U(0) = 0$，所以能量全部是动能：$\\frac{1}{2} \\cdot ${m} \\cdot ${v}^{2} = ${energy.toLatex()}$。`,
            ),
          ],
          [
            ["Energy at the turning point", "折返点处的能量"],
            t(
              `The speed is $0$, so the energy is all potential: $${poly([Q.of(k, 2), "A^{2}"])} = ${energy.toLatex()}$.`,
              `速率为 $0$，所以能量全部是势能：$${poly([Q.of(k, 2), "A^{2}"])} = ${energy.toLatex()}$。`,
            ),
          ],
          [["Solve for A", "解出 A"], t(`$A^{2} = ${A * A}$, so $A = ${A}$.`, `$A^{2} = ${A * A}$，所以 $A = ${A}$。`)],
        ],
        t(
          `At $x = ${A}$, $U = ${Q.of(k, 2).toLatex()} \\cdot ${A * A} = ${Q.of(k * A * A, 2).toLatex()}$, which equals the starting energy $${energy.toLatex()}$.`,
          `在 $x = ${A}$ 处，$U = ${Q.of(k, 2).toLatex()} \\cdot ${A * A} = ${Q.of(k * A * A, 2).toLatex()}$，等于初始能量 $${energy.toLatex()}$。`,
        ),
      ),
    });
  },
);

const ellipseNormal = {
  ...point(
    "the-outward-normal-on-an-ellipse",
    ["The outward normal on an ellipse", "椭圆上的外法向量"],
    [
      "The outward normal on $x^{2} + qy^{2} = c$ is along the gradient $\\langle 2x, 2qy \\rangle$, not along the position vector. These agree only on a circle, so an ellipse has outward normals that do not point straight away from the center, except at its vertices. On $x^{2} + 9y^{2} = 18$ at $(3, 1)$ the gradient is $\\langle 6, 18 \\rangle$, along $\\langle 1, 3 \\rangle$, so the outward unit normal is $\\left\\langle \\frac{1}{\\sqrt{10}}, \\frac{3}{\\sqrt{10}} \\right\\rangle$, not the direction of $\\langle 3, 1 \\rangle$.\n\n> **Watch out.** Normalize the gradient, not the position vector. And divide by the length of the whole vector, $\\sqrt{a^{2} + b^{2}}$, not by one of its components.",
      "$x^{2} + qy^{2} = c$ 的外法向量沿梯度 $\\langle 2x, 2qy \\rangle$，而不是沿位置向量。两者只在圆上才一致，所以椭圆的外法向量并不背离中心，顶点处除外。在 $x^{2} + 9y^{2} = 18$ 上的点 $(3, 1)$ 处，梯度为 $\\langle 6, 18 \\rangle$，沿 $\\langle 1, 3 \\rangle$ 方向，所以外单位法向量是 $\\left\\langle \\frac{1}{\\sqrt{10}}, \\frac{3}{\\sqrt{10}} \\right\\rangle$，而不是 $\\langle 3, 1 \\rangle$ 的方向。\n\n> **注意。** 要单位化梯度，而不是位置向量。并且要除以整个向量的长度 $\\sqrt{a^{2} + b^{2}}$，而不是它的某个分量。",
    ],
    (rng) => {
      const [a, b, h] = rng.pick(triples);
      const q = rng.int(2, 4);
      const s1 = rng.pick([-1, 1]);
      const s2 = rng.pick([-1, 1]);
      const x0 = s1 * q * a;
      const y0 = s2 * b;
      const c = x0 * x0 + q * y0 * y0;
      const first = rng.bool();
      const answer = first ? Q.of(s1 * a, h) : Q.of(s2 * b, h);
      const name: Pair = first ? ["first", "第一"] : ["second", "第二"];
      const pn = (n: number) => (n < 0 ? `(${n})` : `${n}`);
      const unit = br(Q.of(s1 * a, h).toLatex(), Q.of(s2 * b, h).toLatex());
      return numberProblem({
        prompt: t(
          `Find the ${name[0]} component of the outward unit normal to $x^{2} + ${q}y^{2} = ${c}$ at $(${x0}, ${y0})$.`,
          `求 $x^{2} + ${q}y^{2} = ${c}$ 在 $(${x0}, ${y0})$ 处的外单位法向量的${name[1]}个分量。`,
        ),
        answer,
        mistakes: apart(answer, [
          why(
            answer.neg(),
            "That is a component of the inward normal; the outward normal points along the gradient.",
            "那是内法向量的分量；外法向量沿梯度方向。",
          ),
          why(
            first ? Q.of(s2 * b, h) : Q.of(s1 * a, h),
            `That is the other component of the unit normal; the question asks for the ${name[0]} one.`,
            `那是单位法向量的另一个分量；题目问的是第${name[1]}个。`,
          ),
          why(
            first ? Q.of(s1 * a, b) : Q.of(s2 * b, a),
            `That divides by the other component instead of the length $${h}$ of the vector.`,
            `那是除以了另一个分量，而不是向量的长度 $${h}$。`,
          ),
        ]),
        solution: walked(
          [
            [
              ["Take the gradient", "求梯度"],
              t(
                `$\\nabla(x^{2} + ${q}y^{2}) = ${br(2 * x0, 2 * q * y0)}$ at $(${x0}, ${y0})$.`,
                `在 $(${x0}, ${y0})$ 处 $\\nabla(x^{2} + ${q}y^{2}) = ${br(2 * x0, 2 * q * y0)}$。`,
              ),
            ],
            [
              ["Simplify the direction", "化简方向"],
              t(
                `It is a positive multiple of $${br(s1 * a, s2 * b)}$, of length $\\sqrt{${a * a} + ${b * b}} = ${h}$.`,
                `它是 $${br(s1 * a, s2 * b)}$ 的正倍数，长度为 $\\sqrt{${a * a} + ${b * b}} = ${h}$。`,
              ),
            ],
            [
              ["Normalize", "单位化"],
              t(
                `The unit normal is $${unit}$, and its ${name[0]} component is $${answer.toLatex()}$.`,
                `单位法向量是 $${unit}$，它的第${name[1]}个分量是 $${answer.toLatex()}$。`,
              ),
            ],
          ],
          t(
            `The tangent direction $${br(-q * y0, x0)}$ gives $${pn(s1 * a)} \\cdot ${pn(-q * y0)} + ${pn(s2 * b)} \\cdot ${pn(x0)} = 0$, so the vector is normal; and its dot product with $(${x0}, ${y0})$ is $${q * a * a + b * b} > 0$, so it points outward.`,
            `切线方向 $${br(-q * y0, x0)}$ 给出 $${pn(s1 * a)} \\cdot ${pn(-q * y0)} + ${pn(s2 * b)} \\cdot ${pn(x0)} = 0$，所以该向量是法向量；它与 $(${x0}, ${y0})$ 的点积为 $${q * a * a + b * b} > 0$，所以指向外侧。`,
          ),
        ),
      });
    },
  ),
  figure: multivariableDrawings6["outward-pointing-unit-normal-vectors-in-2d#the-outward-normal-on-an-ellipse"],
};

const constantFluxArc = {
  ...point(
    "the-flux-of-a-constant-field-across-an-arc",
    ["The flux of a constant field across an arc", "常向量场穿过弧的通量"],
    [
      "The flux across a curve is $\\int_{C} P\\,dy - Q\\,dx$. For a constant field this depends only on the changes in $x$ and $y$, so any arc between the same endpoints gives the same flux. The shape of the curve does not need to be used at all. For $\\langle 7, 2 \\rangle$ across the arc of $y = x^{3}$ from $(0, 0)$ to $(2, 8)$, the flux is $7 \\cdot 8 - 2 \\cdot 2 = 52$.\n\n> **Watch out.** $P$ goes with the change in $y$ and $Q$ with the change in $x$, the reverse of a work integral, and the $Q$ term is subtracted.",
      "穿过曲线的通量是 $\\int_{C} P\\,dy - Q\\,dx$。对常向量场，它只依赖 $x$ 和 $y$ 的变化量，所以端点相同的任何弧都给出相同的通量。根本用不到曲线的形状。对 $\\langle 7, 2 \\rangle$ 穿过 $y = x^{3}$ 上从 $(0, 0)$ 到 $(2, 8)$ 的弧，通量为 $7 \\cdot 8 - 2 \\cdot 2 = 52$。\n\n> **注意。** $P$ 乘的是 $y$ 的变化量，$Q$ 乘的是 $x$ 的变化量，与功的积分正好相反，而且 $Q$ 项要减去。",
    ],
    (rng) => {
      const p = nz(rng, 6);
      const q = nz(rng, 6);
      const X = nz(rng, 4);
      const answer = p * X * X - q * X;
      const pn = (n: number) => (n < 0 ? `(${n})` : `${n}`);
      return numberProblem({
        prompt: t(
          `Find the flux $\\int_{C} P\\,dy - Q\\,dx$ of $\\mathbf{F} = ${br(p, q)}$ across the arc of $y = x^{2}$ from $(0, 0)$ to $(${X}, ${X * X})$.`,
          `求 $\\mathbf{F} = ${br(p, q)}$ 穿过 $y = x^{2}$ 上从 $(0, 0)$ 到 $(${X}, ${X * X})$ 的弧的通量 $\\int_{C} P\\,dy - Q\\,dx$。`,
        ),
        answer,
        mistakes: apart(answer, [
          why(
            p * X - q * X * X,
            "That pairs $P$ with the change in $x$ and $Q$ with the change in $y$; in a flux integral $P$ goes with $dy$.",
            "那是让 $P$ 乘 $x$ 的变化量、$Q$ 乘 $y$ 的变化量；通量积分中 $P$ 配 $dy$。",
          ),
          why(p * X * X + q * X, "That adds the $Q$ term; the flux is $P\\,dy - Q\\,dx$.", "那是加上了 $Q$ 项；通量是 $P\\,dy - Q\\,dx$。"),
          why(
            -answer,
            "That has the sign reversed, as if the normal pointed to the other side of the arc.",
            "那是符号反了，好像法向量指向弧的另一侧。",
          ),
        ]),
        solution: walked(
          [
            [
              ["Find the changes", "求变化量"],
              t(
                `From $(0, 0)$ to $(${X}, ${X * X})$, $x$ changes by $${X}$ and $y$ by $${X * X}$.`,
                `从 $(0, 0)$ 到 $(${X}, ${X * X})$，$x$ 改变 $${X}$，$y$ 改变 $${X * X}$。`,
              ),
            ],
            [
              ["Integrate the constants", "对常数积分"],
              t(
                `$\\int_{C} ${p}\\,dy - ${pn(q)}\\,dx = ${p} \\cdot ${X * X} - ${pn(q)} \\cdot ${pn(X)} = ${answer}$.`,
                `$\\int_{C} ${p}\\,dy - ${pn(q)}\\,dx = ${p} \\cdot ${X * X} - ${pn(q)} \\cdot ${pn(X)} = ${answer}$。`,
              ),
            ],
          ],
          t(
            `With $x = t$, $y = t^{2}$ and $t$ running from $0$ to $${X}$, the integrand is $${poly([2 * p, "t"], [-q, ""])}$, and $\\int_0^{${X}} (${poly([2 * p, "t"], [-q, ""])})\\,dt = ${p * X * X} - ${pn(q * X)} = ${answer}$.`,
            `取 $x = t$，$y = t^{2}$，$t$ 从 $0$ 到 $${X}$，被积函数是 $${poly([2 * p, "t"], [-q, ""])}$，而 $\\int_0^{${X}} (${poly([2 * p, "t"], [-q, ""])})\\,dt = ${p * X * X} - ${pn(q * X)} = ${answer}$。`,
          ),
        ),
      });
    },
  ),
  figure: multivariableDrawings6["flux-in-two-dimensional-vector-fields#the-flux-of-a-constant-field-across-an-arc"],
};

const oneEdge = {
  ...point(
    "the-flux-through-one-edge",
    ["The flux through one edge", "穿过一条边的通量"],
    [
      "Green's theorem gives the flux across a whole closed curve, so a single edge has to be done directly. On the top edge of a rectangle the outward normal is $\\langle 0, 1 \\rangle$, so only $Q$ enters, evaluated with $y$ fixed at the height of that edge. For $\\langle x, 7x + 2y \\rangle$ on $[0, 2] \\times [0, 3]$, the top edge has $Q = 7x + 6$, and $\\int_0^2 (7x + 6)\\,dx = 14 + 12 = 26$.\n\n> **Watch out.** On the top edge $y$ is fixed but $x$ still varies, so a term in $x$ has to be integrated, giving $\\frac{rW^{2}}{2}$. The flux across the whole boundary, from the divergence, is a different quantity.",
      "格林定理给出的是穿过整条闭曲线的通量，所以单独一条边必须直接计算。在矩形的上边，外法向量是 $\\langle 0, 1 \\rangle$，所以只有 $Q$ 起作用，并且 $y$ 固定为这条边的高度。对 $\\langle x, 7x + 2y \\rangle$ 在 $[0, 2] \\times [0, 3]$ 上，上边处 $Q = 7x + 6$，而 $\\int_0^2 (7x + 6)\\,dx = 14 + 12 = 26$。\n\n> **注意。** 在上边 $y$ 固定，但 $x$ 仍在变化，所以 $x$ 的项要积分，得 $\\frac{rW^{2}}{2}$。由散度得到的整条边界上的通量是另一个量。",
    ],
    (rng) => {
      const p = nz(rng, 6);
      const q = nz(rng, 6);
      const r = nz(rng, 6);
      const W = rng.int(1, 6);
      const H = rng.int(1, 6);
      const answer = Q.of(q * H * W).add(Q.of(r * W * W, 2));
      const F = br(poly([p, "x"]), poly([r, "x"], [q, "y"]));
      const top = poly([r, "x"], [q * H, ""]);
      const middle = Q.of(r * W, 2).add(Q.of(q * H));
      const paren = (n: number) => (n < 0 ? `(${n})` : `${n}`);
      return numberProblem({
        prompt: t(
          `Find the outward flux of $\\mathbf{F} = ${F}$ through the top edge of the rectangle $[0, ${W}] \\times [0, ${H}]$ only.`,
          `只求 $\\mathbf{F} = ${F}$ 穿过矩形 $[0, ${W}] \\times [0, ${H}]$ 上边的外通量。`,
        ),
        answer,
        mistakes: apart(answer, [
          why(
            answer.neg(),
            "That uses the normal $\\langle 0, -1 \\rangle$; on the top edge the outward normal points up.",
            "那是用了法向量 $\\langle 0, -1 \\rangle$；在上边外法向量指向上方。",
          ),
          why(
            Q.of(q * H * W),
            `That leaves out the term $${poly([r, "x"])}$, which varies along the edge and has to be integrated.`,
            `那是漏掉了项 $${poly([r, "x"])}$，它沿这条边变化，必须积分。`,
          ),
          why(
            Q.of((p + q) * W * H),
            "That is the flux across the whole boundary, the divergence times the area; the question asks for the top edge only.",
            "那是穿过整条边界的通量，即散度乘以面积；题目只问上边。",
          ),
          why(
            Q.of(q * H * W + r * W * W),
            `That integrates $${poly([r, "x"])}$ to $${poly([r, "x^{2}"])}$; its antiderivative is $${poly([Q.of(r, 2), "x^{2}"])}$.`,
            `那是把 $${poly([r, "x"])}$ 积分成 $${poly([r, "x^{2}"])}$；它的原函数是 $${poly([Q.of(r, 2), "x^{2}"])}$。`,
          ),
        ]),
        solution: walked(
          [
            [
              ["Use the outward normal", "用外法向量"],
              t(
                `On the top edge $y = ${H}$ and $\\mathbf{n} = \\langle 0, 1 \\rangle$, so only $Q$ counts.`,
                `在上边 $y = ${H}$，$\\mathbf{n} = \\langle 0, 1 \\rangle$，所以只有 $Q$ 起作用。`,
              ),
            ],
            [
              ["Substitute the height", "代入高度"],
              t(`$\\mathbf{F} \\cdot \\mathbf{n} = ${top}$.`, `$\\mathbf{F} \\cdot \\mathbf{n} = ${top}$。`),
            ],
            [
              ["Integrate along the edge", "沿边积分"],
              t(
                `$\\int_0^{${W}} (${top})\\,dx = ${Q.of(r * W * W, 2).toLatex()} + ${paren(q * H * W)} = ${answer.toLatex()}$.`,
                `$\\int_0^{${W}} (${top})\\,dx = ${Q.of(r * W * W, 2).toLatex()} + ${paren(q * H * W)} = ${answer.toLatex()}$。`,
              ),
            ],
          ],
          t(
            `$\\mathbf{F} \\cdot \\mathbf{n}$ is linear in $x$, so its average along the edge is its value $${middle.toLatex()}$ at the midpoint $x = ${Q.of(W, 2).toLatex()}$; times the length $${W}$ this is $${answer.toLatex()}$.`,
            `$\\mathbf{F} \\cdot \\mathbf{n}$ 关于 $x$ 是线性的，所以它沿边的平均值就是中点 $x = ${Q.of(W, 2).toLatex()}$ 处的值 $${middle.toLatex()}$；乘以长度 $${W}$ 得 $${answer.toLatex()}$。`,
          ),
        ),
      });
    },
  ),
  figure: multivariableDrawings6["calculating-flux-in-two-dimensional-vector-fields#the-flux-through-one-edge"],
};

const circulationEqualsFlux = point(
  "when-circulation-equals-flux",
  ["When circulation equals flux", "环量等于通量的情形"],
  [
    "For a linear field, the circulation around a simple closed curve is $Q_{x} - P_{y}$ times the area, and the outward flux is $P_{x} + Q_{y}$ times the area. They measure different things, and they use different entries of the coefficients, so a field can have one without the other. For $\\langle 10x + y, kx - 3y \\rangle$ the two densities are $k - 1$ and $10 - 3 = 7$, so they agree for $k = 8$.\n\n> **Watch out.** The circulation density subtracts $P_{y}$, so the coefficient of $y$ in $P$ is added to $k$; and the circulation is $Q_{x} - P_{y}$, not $P_{y} - Q_{x}$.",
    "对线性场，沿简单闭曲线的环量是 $Q_{x} - P_{y}$ 乘以面积，外通量是 $P_{x} + Q_{y}$ 乘以面积。它们度量不同的量，用到的系数也不同，所以场可以有其中一个而没有另一个。对 $\\langle 10x + y, kx - 3y \\rangle$，两个密度分别是 $k - 1$ 和 $10 - 3 = 7$，所以 $k = 8$ 时二者相等。\n\n> **注意。** 环量密度要减去 $P_{y}$，所以 $P$ 中 $y$ 的系数要加到 $k$ 上；环量是 $Q_{x} - P_{y}$，不是 $P_{y} - Q_{x}$。",
  ],
  (rng) => {
    const a = nz(rng, 9);
    const b = nz(rng, 9);
    const d = nz(rng, 9);
    const answer = a + d + b;
    const F = br(poly([a, "x"], [b, "y"]), poly([1, "kx"], [d, "y"]));
    const pn = (n: number) => (n < 0 ? `(${n})` : `${n}`);
    return numberProblem({
      prompt: t(
        `For $\\mathbf{F} = ${F}$, the counterclockwise circulation equals the outward flux around every simple closed curve. Find $k$.`,
        `对 $\\mathbf{F} = ${F}$，沿每条简单闭曲线的逆时针环量都等于外通量。求 $k$。`,
      ),
      answer,
      solveFor: "k",
      mistakes: apart(answer, [
        why(
          a + d - b,
          `That adds $P_{y} = ${b}$ to $k$ in the circulation density; the density is $k - ${pn(b)}$.`,
          `那是在环量密度中把 $P_{y} = ${b}$ 加到 $k$ 上；环量密度是 $k - ${pn(b)}$。`,
        ),
        why(
          b - a - d,
          "That takes the circulation density as $P_{y} - Q_{x}$; it is $Q_{x} - P_{y}$.",
          "那是把环量密度当成 $P_{y} - Q_{x}$；它是 $Q_{x} - P_{y}$。",
        ),
        why(a + d, `That leaves out $P_{y} = ${b}$ from the circulation density.`, `那是在环量密度中漏掉了 $P_{y} = ${b}$。`),
      ]),
      solution: walked(
        [
          [["Circulation density", "环量密度"], t(`$Q_{x} - P_{y} = k - ${pn(b)}$.`, `$Q_{x} - P_{y} = k - ${pn(b)}$。`)],
          [
            ["Flux density", "通量密度"],
            t(`$P_{x} + Q_{y} = ${a} + ${pn(d)} = ${a + d}$.`, `$P_{x} + Q_{y} = ${a} + ${pn(d)} = ${a + d}$。`),
          ],
          [
            ["Set them equal", "令二者相等"],
            t(`$k - ${pn(b)} = ${a + d}$, so $k = ${answer}$.`, `$k - ${pn(b)} = ${a + d}$，所以 $k = ${answer}$。`),
          ],
        ],
        t(
          `With $k = ${answer}$, around the unit square the circulation is $${answer} - ${pn(b)} = ${a + d}$ and the outward flux is $${a} + ${pn(d)} = ${a + d}$.`,
          `取 $k = ${answer}$，绕单位正方形的环量为 $${answer} - ${pn(b)} = ${a + d}$，外通量为 $${a} + ${pn(d)} = ${a + d}$。`,
        ),
      ),
    });
  },
);

const sectorGreen = {
  ...point(
    "a-sector-with-a-curl-that-depends-on-r",
    ["A sector with a curl that depends on r", "旋度依赖 r 的扇形"],
    [
      "When the curl depends on the distance from the origin, Green's theorem gives a polar double integral. The area element is $r\\,dr\\,d\\theta$, so a curl of $kr$ produces $kr^{2}$ in the integrand, and the angular width of the sector supplies a simple factor. For a curl of $2r$ on the sector $0 \\le r \\le 3$, $0 \\le \\theta \\le \\frac{\\pi}{6}$, the circulation is $\\frac{\\pi}{6} \\cdot \\frac{2 \\cdot 27}{3} = 3\\pi$.\n\n> **Watch out.** Keep the $r$ of the area element: the integrand is $kr^{2}$, which integrates to $\\frac{kR^{3}}{3}$, not $kr$ with $\\frac{kR^{2}}{2}$.",
      "当旋度依赖到原点的距离时，格林定理给出极坐标下的二重积分。面积元是 $r\\,dr\\,d\\theta$，所以旋度 $kr$ 在被积函数中产生 $kr^{2}$，扇形的角宽度提供一个简单的因子。对扇形 $0 \\le r \\le 3$，$0 \\le \\theta \\le \\frac{\\pi}{6}$ 上的旋度 $2r$，环量为 $\\frac{\\pi}{6} \\cdot \\frac{2 \\cdot 27}{3} = 3\\pi$。\n\n> **注意。** 要保留面积元中的 $r$：被积函数是 $kr^{2}$，积分得 $\\frac{kR^{3}}{3}$，而不是 $kr$ 积出的 $\\frac{kR^{2}}{2}$。",
    ],
    (rng) => {
      const k = rng.int(1, 9);
      const R = rng.int(1, 6);
      const m = rng.int(1, 4);
      const top = m === 1 ? "\\pi" : `\\frac{\\pi}{${m}}`;
      const answer = Q.of(k * R ** 3, 3 * m);
      const radial = Q.of(k * R ** 3, 3).toLatex();
      const piOf = (q: Q) => (q.toLatex() === "1" ? "\\pi" : `${q.toLatex()}\\pi`);
      const area = piOf(Q.of(R * R, 2 * m));
      return numberProblem({
        prompt: t(
          `$C$ is the positively oriented boundary of the sector $0 \\le r \\le ${R}$, $0 \\le \\theta \\le ${top}$, and $\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = ${k === 1 ? "" : k}\\sqrt{x^{2} + y^{2}}$. Find $\\frac{1}{\\pi}\\oint_{C} P\\,dx + Q\\,dy$.`,
          `$C$ 是扇形 $0 \\le r \\le ${R}$，$0 \\le \\theta \\le ${top}$ 的正向边界，且 $\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = ${k === 1 ? "" : k}\\sqrt{x^{2} + y^{2}}$。求 $\\frac{1}{\\pi}\\oint_{C} P\\,dx + Q\\,dy$。`,
        ),
        answer,
        mistakes: apart(answer, [
          why(
            Q.of(k * R * R, 2 * m),
            "That leaves out the factor $r$ of the area element, integrating $kr$ instead of $kr^{2}$.",
            "那是漏掉了面积元中的因子 $r$，积的是 $kr$ 而不是 $kr^{2}$。",
          ),
          why(
            Q.of(k * R ** 3, m),
            "That drops the $\\frac{1}{3}$ from $\\int_{0}^{R} r^{2}\\,dr = \\frac{R^{3}}{3}$.",
            "那是漏掉了 $\\int_{0}^{R} r^{2}\\,dr = \\frac{R^{3}}{3}$ 中的 $\\frac{1}{3}$。",
          ),
          why(
            Q.of(k * R ** 3, 2 * m),
            "That integrates $r^{2}$ to $\\frac{r^{3}}{2}$; the antiderivative is $\\frac{r^{3}}{3}$.",
            "那是把 $r^{2}$ 积成了 $\\frac{r^{3}}{2}$；原函数是 $\\frac{r^{3}}{3}$。",
          ),
        ]),
        solution: walked(
          [
            [
              ["Apply Green's theorem", "应用格林定理"],
              t(
                `The circulation is $\\int_{0}^{${top}} \\int_{0}^{${R}} ${k === 1 ? "" : k}r \\cdot r \\, dr \\, d\\theta$.`,
                `环量为 $\\int_{0}^{${top}} \\int_{0}^{${R}} ${k === 1 ? "" : k}r \\cdot r \\, dr \\, d\\theta$。`,
              ),
            ],
            [
              ["Integrate in r", "对 r 积分"],
              t(
                `$\\int_{0}^{${R}} ${k === 1 ? "" : k}r^{2}\\,dr = ${radial}$.`,
                `$\\int_{0}^{${R}} ${k === 1 ? "" : k}r^{2}\\,dr = ${radial}$。`,
              ),
            ],
            [
              ["Integrate in θ and divide by π", "对 θ 积分再除以 π"],
              t(
                `Multiplying by the width $${top}$ and dividing by $\\pi$ gives $${answer.toLatex()}$.`,
                `乘以角宽度 $${top}$ 再除以 $\\pi$，得 $${answer.toLatex()}$。`,
              ),
            ],
          ],
          t(
            `The sector has area $${area}$ and the average of $r$ over it is $\\frac{2}{3} \\cdot ${R} = ${Q.of(2 * R, 3).toLatex()}$, so the circulation is $${k} \\cdot ${Q.of(2 * R, 3).toLatex()} \\cdot ${area} = ${piOf(answer)}$.`,
            `扇形面积为 $${area}$，其上 $r$ 的平均值是 $\\frac{2}{3} \\cdot ${R} = ${Q.of(2 * R, 3).toLatex()}$，所以环量为 $${k} \\cdot ${Q.of(2 * R, 3).toLatex()} \\cdot ${area} = ${piOf(answer)}$。`,
          ),
        ),
      });
    },
  ),
  figure: multivariableDrawings6["greens-theorem-in-polar-coordinates#a-sector-with-a-curl-that-depends-on-r"],
};

const areaFromFlux = point(
  "an-area-from-a-measured-flux",
  ["An area from a measured flux", "由通量求面积"],
  [
    "A field with constant divergence turns the flux form of Green's theorem into a way to measure area. For $\\langle ax, by \\rangle$, the flux across any simple closed curve is $a + b$ times the enclosed area, whatever the shape of the curve is. For $\\langle 7x, 2y \\rangle$, a flux of $45$ means an area of $\\frac{45}{9} = 5$.\n\n> **Watch out.** Divide by the divergence $a + b$, the sum of the two coefficients; not by their product, and not by $2$ as for $\\langle x, y \\rangle$.",
    "散度为常数的场，把格林定理的通量形式变成测量面积的方法。对 $\\langle ax, by \\rangle$，穿过任何简单闭曲线的通量都是 $a + b$ 乘以所围面积，与曲线的形状无关。对 $\\langle 7x, 2y \\rangle$，通量为 $45$ 意味着面积为 $\\frac{45}{9} = 5$。\n\n> **注意。** 要除以散度 $a + b$，即两个系数之和；不是除以它们的乘积，也不是像 $\\langle x, y \\rangle$ 那样除以 $2$。",
  ],
  (rng) => {
    const a = rng.int(1, 6);
    const b = rng.int(1, 6);
    const A = rng.int(1, 12);
    const V = (a + b) * A;
    return numberProblem({
      prompt: t(
        `The outward flux of $\\mathbf{F} = ${br(poly([a, "x"]), poly([b, "y"]))}$ across a simple closed curve is $${V}$. Find the area it encloses.`,
        `$\\mathbf{F} = ${br(poly([a, "x"]), poly([b, "y"]))}$ 穿过一条简单闭曲线的外通量是 $${V}$。求它所围的面积。`,
      ),
      answer: A,
      mistakes: apart(A, [
        why(V, `That is the flux itself; it has to be divided by the divergence $${a + b}$.`, `那是通量本身；还要除以散度 $${a + b}$。`),
        why(
          Q.of(V, 2),
          "That divides by $2$, the divergence of $\\langle x, y \\rangle$; this field has divergence $a + b$.",
          "那是除以 $2$，即 $\\langle x, y \\rangle$ 的散度；这个场的散度是 $a + b$。",
        ),
        why(
          Q.of(V, a * b),
          "That divides by the product of the coefficients; the divergence is their sum.",
          "那是除以两个系数的乘积；散度是它们的和。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Compute the divergence", "计算散度"],
            t(`$P_{x} + Q_{y} = ${a} + ${b} = ${a + b}$, a constant.`, `$P_{x} + Q_{y} = ${a} + ${b} = ${a + b}$，为常数。`),
          ],
          [
            ["Apply the flux form", "应用通量形式"],
            t(
              `The flux is $${a + b}$ times the enclosed area: $${a + b}A = ${V}$.`,
              `通量是 $${a + b}$ 乘以所围面积：$${a + b}A = ${V}$。`,
            ),
          ],
          [["Solve", "求解"], t(`$A = \\frac{${V}}{${a + b}} = ${A}$.`, `$A = \\frac{${V}}{${a + b}} = ${A}$。`)],
        ],
        t(
          `An area of $${A}$ with divergence $${a + b}$ gives the flux $${a + b} \\cdot ${A} = ${V}$.`,
          `面积 $${A}$、散度 $${a + b}$ 给出通量 $${a + b} \\cdot ${A} = ${V}$。`,
        ),
      ),
    });
  },
);

const twoHoles = point(
  "a-region-with-two-holes",
  ["A region with two holes", "有两个洞的区域"],
  [
    "With holes, the outer circulation equals the sum of the circulations around the holes plus the double integral of the curl over the region between them. Each hole adds a term, and the area in the double integral is the outer area minus the areas of all the holes. With outer area $30$, holes of areas $2$ and $3$ with circulations $5$ and $-1$, and curl $2$, the outer circulation is $5 - 1 + 2 \\cdot 25 = 54$.\n\n> **Watch out.** Both hole circulations are added, each with its own sign, and the curl is integrated only over the region, not over the holes.",
    "有洞时，外边界的环量等于绕各洞的环量之和，加上洞之间区域上旋度的二重积分。每个洞都增加一项，二重积分中的面积是外部面积减去所有洞的面积。外部面积为 $30$，两个洞面积为 $2$ 和 $3$、环量为 $5$ 和 $-1$，旋度为 $2$，则外环量为 $5 - 1 + 2 \\cdot 25 = 54$。\n\n> **注意。** 两个洞的环量都要按各自的符号加上，旋度只在区域上积分，不包括洞。",
  ],
  (rng) => {
    const A1 = rng.int(1, 4);
    const A2 = rng.int(1, 4);
    const A0 = A1 + A2 + rng.int(1, 12);
    const k = nz(rng, 5);
    const i1 = nz(rng, 12);
    const i2 = nz(rng, 12);
    const answer = i1 + i2 + k * (A0 - A1 - A2);
    const pn = (n: number) => (n < 0 ? `(${n})` : `${n}`);
    const region = A0 - A1 - A2;
    return numberProblem({
      prompt: t(
        `A region has outer boundary $C$ enclosing area $${A0}$, and two holes with boundaries $C_{1}$, $C_{2}$ of areas $${A1}$, $${A2}$. On the region, $Q_{x} - P_{y} = ${k}$. All three curves run counterclockwise, with $\\oint_{C_{1}} \\mathbf{F} \\cdot d\\mathbf{r} = ${i1}$ and $\\oint_{C_{2}} \\mathbf{F} \\cdot d\\mathbf{r} = ${i2}$. Find $\\oint_{C} \\mathbf{F} \\cdot d\\mathbf{r}$.`,
        `一个区域的外边界 $C$ 所围面积是 $${A0}$，有两个洞，边界是 $C_{1}$、$C_{2}$，面积是 $${A1}$、$${A2}$。在该区域上 $Q_{x} - P_{y} = ${k}$。三条曲线都沿逆时针方向，且 $\\oint_{C_{1}} \\mathbf{F} \\cdot d\\mathbf{r} = ${i1}$，$\\oint_{C_{2}} \\mathbf{F} \\cdot d\\mathbf{r} = ${i2}$。求 $\\oint_{C} \\mathbf{F} \\cdot d\\mathbf{r}$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          i1 + i2 + k * A0,
          "That integrates the curl over the holes too; the region has the outer area minus the two hole areas.",
          "那是把洞也算进了旋度积分；区域面积是外部面积减去两个洞的面积。",
        ),
        why(k * region, "That leaves out the circulations around the two holes.", "那是漏掉了绕两个洞的环量。"),
        why(
          i1 - i2 + k * region,
          "That subtracts the circulation around $C_{2}$; both hole circulations are added.",
          "那是减去了绕 $C_{2}$ 的环量；两个洞的环量都要加上。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the area of the region", "求区域面积"],
            t(`$${A0} - ${A1} - ${A2} = ${region}$.`, `$${A0} - ${A1} - ${A2} = ${region}$。`),
          ],
          [
            ["Integrate the curl", "对旋度积分"],
            t(`$${k} \\cdot ${region} = ${k * region}$.`, `$${k} \\cdot ${region} = ${k * region}$。`),
          ],
          [
            ["Add the holes", "加上各洞"],
            t(
              `$\\oint_{C} \\mathbf{F} \\cdot d\\mathbf{r} = ${i1} + ${pn(i2)} + ${pn(k * region)} = ${answer}$.`,
              `$\\oint_{C} \\mathbf{F} \\cdot d\\mathbf{r} = ${i1} + ${pn(i2)} + ${pn(k * region)} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `The outer circulation minus the two hole circulations is $${answer} - ${pn(i1)} - ${pn(i2)} = ${k * region}$, which is the curl $${k}$ times the area $${region}$.`,
          `外环量减去两个洞的环量为 $${answer} - ${pn(i1)} - ${pn(i2)} = ${k * region}$，正是旋度 $${k}$ 乘以面积 $${region}$。`,
        ),
      ),
    });
  },
);

const singularPoint = point(
  "where-the-normal-vector-disappears",
  ["Where the normal vector disappears", "法向量消失的位置"],
  [
    "The tangent plane formula uses $\\mathbf{r}_{u} \\times \\mathbf{r}_{v}$ as the normal. Where this cross product is zero, the parametrization is not regular and the formula gives no plane at all. To find such a point, set all three components of the cross product to zero. For the cone $\\langle u\\cos v, u\\sin v, u \\rangle$, $\\mathbf{r}_{u} \\times \\mathbf{r}_{v} = \\langle -u\\cos v, -u\\sin v, u \\rangle$, which is zero only at $u = 0$, the vertex.\n\n> **Watch out.** A factor $u - a$ vanishes at $u = a$, not at $u = -a$; and every component must vanish at once, so solve them together.",
    "切平面公式用 $\\mathbf{r}_{u} \\times \\mathbf{r}_{v}$ 作法向量。在这个叉积为零的地方，参数化不正则，公式给不出任何平面。要找这样的点，就令叉积的三个分量都为零。对锥面 $\\langle u\\cos v, u\\sin v, u \\rangle$，$\\mathbf{r}_{u} \\times \\mathbf{r}_{v} = \\langle -u\\cos v, -u\\sin v, u \\rangle$，只在 $u = 0$（即顶点）处为零。\n\n> **注意。** 因子 $u - a$ 在 $u = a$ 处为零，而不是在 $u = -a$ 处；而且所有分量必须同时为零，所以要联立求解。",
  ],
  (rng) => {
    const a = nz(rng, 6);
    const b = nz(rng, 6);
    const askU = rng.bool();
    const answer = askU ? a : b;
    const name = askU ? "u" : "v";
    const other = askU ? "v" : "u";
    const uTerm = poly([1, "u"], [-a, ""]);
    const vTerm = poly([1, "v"], [-b, ""]);
    return numberProblem({
      prompt: t(
        `For $\\mathbf{r}(u, v) = \\langle u, (${vTerm})^{2}, (${uTerm})(${vTerm}) \\rangle$, $\\mathbf{r}_{u} \\times \\mathbf{r}_{v}$ is zero at exactly one point. Find its value of $${name}$.`,
        `对 $\\mathbf{r}(u, v) = \\langle u, (${vTerm})^{2}, (${uTerm})(${vTerm}) \\rangle$，$\\mathbf{r}_{u} \\times \\mathbf{r}_{v}$ 恰在一点为零。求该点的 $${name}$ 值。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          -answer,
          `That has the wrong sign; the factor $${askU ? uTerm : vTerm}$ is zero at $${name} = ${answer}$.`,
          `那是符号错了；因子 $${askU ? uTerm : vTerm}$ 在 $${name} = ${answer}$ 处为零。`,
        ),
        why(
          askU ? b : a,
          `That is the value of $${other}$ at the point, not of $${name}$.`,
          `那是该点的 $${other}$ 值，而不是 $${name}$ 值。`,
        ),
        why(
          a * b,
          `That multiplies the two coordinates of the point; the question asks for $${name}$ alone.`,
          `那是把该点的两个坐标相乘；题目只问 $${name}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the tangent vectors", "求切向量"],
            t(
              `$\\mathbf{r}_{u} = \\langle 1, 0, ${vTerm} \\rangle$ and $\\mathbf{r}_{v} = \\langle 0, 2(${vTerm}), ${uTerm} \\rangle$.`,
              `$\\mathbf{r}_{u} = \\langle 1, 0, ${vTerm} \\rangle$，$\\mathbf{r}_{v} = \\langle 0, 2(${vTerm}), ${uTerm} \\rangle$。`,
            ),
          ],
          [
            ["Take the cross product", "求叉积"],
            t(
              `$\\mathbf{r}_{u} \\times \\mathbf{r}_{v} = \\langle -2(${vTerm})^{2}, -(${uTerm}), 2(${vTerm}) \\rangle$.`,
              `$\\mathbf{r}_{u} \\times \\mathbf{r}_{v} = \\langle -2(${vTerm})^{2}, -(${uTerm}), 2(${vTerm}) \\rangle$。`,
            ),
          ],
          [
            ["Set every component to zero", "令各分量为零"],
            t(
              `The second component gives $u = ${a}$ and the third gives $v = ${b}$, so $${name} = ${answer}$.`,
              `第二个分量给出 $u = ${a}$，第三个分量给出 $v = ${b}$，所以 $${name} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `At $(u, v) = (${a}, ${b})$, $\\mathbf{r}_{v} = \\langle 0, 0, 0 \\rangle$, so its cross product with $\\mathbf{r}_{u} = \\langle 1, 0, 0 \\rangle$ is zero.`,
          `在 $(u, v) = (${a}, ${b})$ 处，$\\mathbf{r}_{v} = \\langle 0, 0, 0 \\rangle$，所以它与 $\\mathbf{r}_{u} = \\langle 1, 0, 0 \\rangle$ 的叉积为零。`,
        ),
      ),
    });
  },
);

const ellipticCone = {
  ...point(
    "the-parameter-of-a-point-on-an-elliptic-cone",
    ["The parameter of a point on an elliptic cone", "椭圆锥上一点的参数"],
    [
      "An elliptic cone is parametrized by $\\langle au\\cos v, bu\\sin v, u \\rangle$, where dividing the first two coordinates by $a$ and $b$ removes the scaling. Then $\\cos^{2}v + \\sin^{2}v = 1$ gives $u$, and this is also the height of the point above the vertex. For $\\langle 6u\\cos v, 7u\\sin v, u \\rangle$ through $x = 18$, $y = 28$, $u\\cos v = 3$ and $u\\sin v = 4$, so $u = 5$.\n\n> **Watch out.** Divide by $a$ and $b$ before squaring, and take the square root at the end: $u$ is $\\sqrt{(x/a)^{2} + (y/b)^{2}}$, not the sum $|x/a| + |y/b|$.",
      "椭圆锥的参数式是 $\\langle au\\cos v, bu\\sin v, u \\rangle$，把前两个坐标分别除以 $a$ 和 $b$ 可以去掉缩放。再由 $\\cos^{2}v + \\sin^{2}v = 1$ 得 $u$，它也是该点在顶点上方的高度。对 $\\langle 6u\\cos v, 7u\\sin v, u \\rangle$ 经过 $x = 18$，$y = 28$ 的点，$u\\cos v = 3$，$u\\sin v = 4$，所以 $u = 5$。\n\n> **注意。** 先除以 $a$ 和 $b$ 再平方，最后开平方：$u$ 是 $\\sqrt{(x/a)^{2} + (y/b)^{2}}$，而不是和 $|x/a| + |y/b|$。",
    ],
    (rng) => {
      const [A, B, C] = rng.pick(triples);
      const a = rng.int(2, 5);
      const b = rng.int(2, 5);
      const k = rng.int(1, 3);
      const x = a * A * k * rng.pick([-1, 1]);
      const y = b * B * k * rng.pick([-1, 1]);
      const answer = C * k;
      const p = Q.of(x, a);
      const q = Q.of(y, b);
      return numberProblem({
        prompt: t(
          `The cone $\\mathbf{r}(u, v) = \\langle ${a}u\\cos v, ${b}u\\sin v, u \\rangle$, $u \\ge 0$, contains a point with $x = ${x}$ and $y = ${y}$. Find $u$ at this point.`,
          `锥面 $\\mathbf{r}(u, v) = \\langle ${a}u\\cos v, ${b}u\\sin v, u \\rangle$，$u \\ge 0$，上有一点满足 $x = ${x}$，$y = ${y}$。求该点的 $u$。`,
        ),
        answer,
        mistakes: apart(answer, [
          why(
            (A + B) * k,
            "That adds $|u\\cos v|$ and $|u\\sin v|$; square them, add, and take the root.",
            "那是把 $|u\\cos v|$ 与 $|u\\sin v|$ 相加；应平方相加再开平方。",
          ),
          why(
            a * C * k,
            `That keeps the factor $${a}$; divide $x$ by $${a}$ and $y$ by $${b}$ first.`,
            `那是保留了因子 $${a}$；要先把 $x$ 除以 $${a}$，$y$ 除以 $${b}$。`,
          ),
          why(answer * answer, "That is $u^{2}$; take the square root.", "那是 $u^{2}$；还要开平方。"),
        ]),
        solution: walked(
          [
            [
              ["Remove the scaling", "去掉缩放"],
              t(
                `$u\\cos v = \\frac{${x}}{${a}} = ${p.toLatex()}$ and $u\\sin v = \\frac{${y}}{${b}} = ${q.toLatex()}$.`,
                `$u\\cos v = \\frac{${x}}{${a}} = ${p.toLatex()}$，$u\\sin v = \\frac{${y}}{${b}} = ${q.toLatex()}$。`,
              ),
            ],
            [
              ["Square and add", "平方相加"],
              t(
                `$u^{2} = ${p.mul(p).toLatex()} + ${q.mul(q).toLatex()} = ${answer * answer}$, and $u \\ge 0$ gives $u = ${answer}$.`,
                `$u^{2} = ${p.mul(p).toLatex()} + ${q.mul(q).toLatex()} = ${answer * answer}$，由 $u \\ge 0$ 得 $u = ${answer}$。`,
              ),
            ],
          ],
          t(
            `With $u = ${answer}$, $\\cos v = ${p.div(Q.of(answer)).toLatex()}$ and $\\sin v = ${q.div(Q.of(answer)).toLatex()}$, and $\\cos^{2}v + \\sin^{2}v = ${p
              .div(Q.of(answer))
              .mul(p.div(Q.of(answer)))
              .toLatex()} + ${q
              .div(Q.of(answer))
              .mul(q.div(Q.of(answer)))
              .toLatex()} = 1$.`,
            `取 $u = ${answer}$，$\\cos v = ${p.div(Q.of(answer)).toLatex()}$，$\\sin v = ${q.div(Q.of(answer)).toLatex()}$，而 $\\cos^{2}v + \\sin^{2}v = ${p
              .div(Q.of(answer))
              .mul(p.div(Q.of(answer)))
              .toLatex()} + ${q
              .div(Q.of(answer))
              .mul(q.div(Q.of(answer)))
              .toLatex()} = 1$。`,
          ),
        ),
      });
    },
  ),
  figure: multivariableDrawings7["parametrizations-of-ellipsoids-and-cones#the-parameter-of-a-point-on-an-elliptic-cone"],
};

const twoSheets = point(
  "the-gap-between-the-sheets-of-a-hyperboloid",
  ["The gap between the sheets of a hyperboloid", "双叶双曲面两叶之间的间隙"],
  [
    "A hyperboloid of two sheets has $\\cosh u$ in its parametrization for $z$, and since $\\cosh u \\ge 1$, the value $z = c\\cosh u$ is never smaller than $c$. So one parametrization covers only the upper sheet, and there is a gap of $2c$ between the sheets. For $\\frac{x^{2} + y^{2}}{16} - z^{2} = -1$, $c = 1$, the sheets cross the $z$-axis at $z = \\pm 1$, and the gap is $2$.\n\n> **Watch out.** The number under $z^{2}$ is $c^{2}$, so take its square root before doubling; the number under $x^{2} + y^{2}$ plays no part, since the sheets come closest on the $z$-axis.",
    "双叶双曲面的 $z$ 参数式含 $\\cosh u$，由于 $\\cosh u \\ge 1$，$z = c\\cosh u$ 不会小于 $c$。所以一个参数式只覆盖上叶，两叶之间有 $2c$ 的间隙。对 $\\frac{x^{2} + y^{2}}{16} - z^{2} = -1$，$c = 1$，两叶与 $z$ 轴交于 $z = \\pm 1$，间隙为 $2$。\n\n> **注意。** $z^{2}$ 下的数是 $c^{2}$，要先开平方再加倍；$x^{2} + y^{2}$ 下的数不起作用，因为两叶在 $z$ 轴上最接近。",
  ],
  (rng) => {
    const a = rng.int(2, 9);
    const c = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== a));
    const answer = 2 * c;
    return numberProblem({
      prompt: t(
        `Find the distance between the two sheets of the hyperboloid $\\frac{x^{2} + y^{2}}{${a * a}} - \\frac{z^{2}}{${c * c}} = -1$, measured along the $z$-axis.`,
        `求双曲面 $\\frac{x^{2} + y^{2}}{${a * a}} - \\frac{z^{2}}{${c * c}} = -1$ 的两叶之间沿 $z$ 轴的距离。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          c,
          `That is the distance from one vertex to the origin; the other sheet is $${c}$ away on the other side.`,
          `那是一个顶点到原点的距离；另一叶在另一侧也相距 $${c}$。`,
        ),
        why(
          2 * a,
          "That uses the number under $x^{2} + y^{2}$; the sheets come closest on the $z$-axis, where it plays no part.",
          "那是用了 $x^{2} + y^{2}$ 下的数；两叶在 $z$ 轴上最接近，那里它不起作用。",
        ),
        why(2 * c * c, `That doubles $${c * c}$ without taking its square root.`, `那是没有对 $${c * c}$ 开平方就加倍了。`),
      ]),
      solution: walked(
        [
          [
            ["Go to the z-axis", "取 z 轴上的点"],
            t(
              `$x = y = 0$ gives $\\frac{z^{2}}{${c * c}} = 1$, so $z^{2} = ${c * c}$.`,
              `$x = y = 0$ 给出 $\\frac{z^{2}}{${c * c}} = 1$，所以 $z^{2} = ${c * c}$。`,
            ),
          ],
          [
            ["Find the vertices", "求顶点"],
            t(
              `$z = ${c}$ and $z = ${-c}$, so the distance is $${c} - (${-c}) = ${answer}$.`,
              `$z = ${c}$ 与 $z = ${-c}$，所以距离为 $${c} - (${-c}) = ${answer}$。`,
            ),
          ],
        ],
        t(
          `At $(0, 0, ${c})$, $\\frac{0}{${a * a}} - \\frac{${c * c}}{${c * c}} = -1$; and for $|z| < ${c}$ the left side is larger than $-1$, so no point lies between the vertices.`,
          `在 $(0, 0, ${c})$ 处，$\\frac{0}{${a * a}} - \\frac{${c * c}}{${c * c}} = -1$；而当 $|z| < ${c}$ 时左边大于 $-1$，所以两个顶点之间没有点。`,
        ),
      ),
    });
  },
);

const torusArea = {
  ...point(
    "the-surface-area-of-a-torus",
    ["The surface area of a torus", "环面的面积"],
    [
      "Revolving a curve about an axis gives an area equal to the length of the curve times the distance traveled by its centroid. For a circle of radius $r$ whose center is at distance $R$ from the axis, this gives $2\\pi r \\cdot 2\\pi R$, which is why $\\pi^{2}$ appears. For $x^{2} + (y - 10)^{2} = 64$, $r = 8$ and $R = 10$, so the area is $16\\pi \\cdot 20\\pi = 320\\pi^{2}$.\n\n> **Watch out.** Both factors are circumferences, each with its own $2\\pi$: the curve's length $2\\pi r$ uses the small radius, and the path $2\\pi R$ of the center uses the distance from the axis to the center.",
      "曲线绕轴旋转所得的面积，等于曲线的长度乘以其形心走过的距离。对半径为 $r$、圆心到轴的距离为 $R$ 的圆，结果是 $2\\pi r \\cdot 2\\pi R$，这就是出现 $\\pi^{2}$ 的原因。对 $x^{2} + (y - 10)^{2} = 64$，$r = 8$，$R = 10$，所以面积为 $16\\pi \\cdot 20\\pi = 320\\pi^{2}$。\n\n> **注意。** 两个因子都是周长，各带一个 $2\\pi$：曲线的长度 $2\\pi r$ 用小半径，圆心走过的路程 $2\\pi R$ 用轴到圆心的距离。",
    ],
    (rng) => {
      const r = rng.int(1, 6);
      const R = r + rng.int(1, 6);
      const answer = 4 * R * r;
      return numberProblem({
        prompt: t(
          `The circle $x^{2} + (y - ${R})^{2} = ${r * r}$ is revolved about the $x$-axis. Find the area of the resulting torus divided by $\\pi^{2}$.`,
          `圆 $x^{2} + (y - ${R})^{2} = ${r * r}$ 绕 $x$ 轴旋转。求所得环面的面积除以 $\\pi^{2}$ 的值。`,
        ),
        answer,
        mistakes: apart(answer, [
          why(
            2 * R * r,
            "That keeps only one factor $2$; each of the two circumferences has its own $2\\pi$.",
            "那是只保留了一个因子 $2$；两个周长各有自己的 $2\\pi$。",
          ),
          why(
            4 * r * r,
            `That uses the small radius $${r}$ for the path of the center; the center is $${R}$ from the axis.`,
            `那是用小半径 $${r}$ 计算圆心的路程；圆心到轴的距离是 $${R}$。`,
          ),
          why(
            4 * R * R,
            `That uses $${R}$ for the length of the circle; the circle has radius $${r}$.`,
            `那是用 $${R}$ 计算圆的长度；圆的半径是 $${r}$。`,
          ),
        ]),
        solution: walked(
          [
            [
              ["Read the circle", "读出圆的数据"],
              t(
                `The circle has radius $r = ${r}$ and center $(0, ${R})$, at distance $R = ${R}$ from the axis.`,
                `圆的半径为 $r = ${r}$，圆心 $(0, ${R})$ 到轴的距离为 $R = ${R}$。`,
              ),
            ],
            [
              ["Find the two lengths", "求两个长度"],
              t(
                `The circle has length $${2 * r}\\pi$, and its center travels $${2 * R}\\pi$.`,
                `圆的周长为 $${2 * r}\\pi$，圆心走过 $${2 * R}\\pi$。`,
              ),
            ],
            [
              ["Multiply", "相乘"],
              t(
                `$${2 * r}\\pi \\cdot ${2 * R}\\pi = ${answer}\\pi^{2}$, so the answer is $${answer}$.`,
                `$${2 * r}\\pi \\cdot ${2 * R}\\pi = ${answer}\\pi^{2}$，所以答案为 $${answer}$。`,
              ),
            ],
          ],
          t(
            `As a parametric surface the area element is $${r === 1 ? "" : r}(${R} + ${r === 1 ? "" : r}\\cos v)\\,du\\,dv$; the cosine integrates to zero over a full turn, leaving $(2\\pi)^{2} \\cdot ${r * R} = ${answer}\\pi^{2}$.`,
            `作为参数曲面，面积元为 $${r === 1 ? "" : r}(${R} + ${r === 1 ? "" : r}\\cos v)\\,du\\,dv$；余弦项在一整圈上积分为零，剩下 $(2\\pi)^{2} \\cdot ${r * R} = ${answer}\\pi^{2}$。`,
          ),
        ),
      });
    },
  ),
  figure: multivariableDrawings7["surfaces-of-revolution#the-surface-area-of-a-torus"],
};

const paraboloidSurface = {
  ...point(
    "a-surface-integral-over-a-paraboloid",
    ["A surface integral over a paraboloid", "抛物面上的曲面积分"],
    [
      "On a curved graph, the area factor $\\sqrt{1 + g_{x}^{2} + g_{y}^{2}}$ varies from point to point. On $z = \\frac{x^{2} + y^{2}}{2}$ it equals $\\sqrt{1 + r^{2}}$, and polar coordinates supply the factor $r$ that makes the integral elementary. Above the disk $x^{2} + y^{2} \\le 48$, $1 + r^{2}$ runs from $1$ to $49$, so $\\frac{1}{\\pi}\\iint_{S} dS = 2 \\cdot \\frac{1}{3}(7^{3} - 1) = 228$.\n\n> **Watch out.** The lower limit $r = 0$ gives $1 + r^{2} = 1$, not $0$, so subtract $1$ from the cube; and the angle contributes $2\\pi$, which leaves a factor $2$ after dividing by $\\pi$.",
      "在曲面图像上，面积因子 $\\sqrt{1 + g_{x}^{2} + g_{y}^{2}}$ 随点变化。在 $z = \\frac{x^{2} + y^{2}}{2}$ 上，它等于 $\\sqrt{1 + r^{2}}$，极坐标提供的因子 $r$ 使积分成为初等的。在圆盘 $x^{2} + y^{2} \\le 48$ 上方，$1 + r^{2}$ 从 $1$ 变到 $49$，所以 $\\frac{1}{\\pi}\\iint_{S} dS = 2 \\cdot \\frac{1}{3}(7^{3} - 1) = 228$。\n\n> **注意。** 下限 $r = 0$ 给出 $1 + r^{2} = 1$ 而不是 $0$，所以立方之后要减 $1$；角度贡献 $2\\pi$，除以 $\\pi$ 后还剩因子 $2$。",
    ],
    (rng) => {
      const n = rng.int(2, 6);
      const k = rng.int(1, 9);
      const answer = Q.of(2 * k * (n ** 3 - 1), 3);
      const kk = k === 1 ? "" : `${k}`;
      const integrand = k === 1 ? "dS" : `${k}\\,dS`;
      return numberProblem({
        prompt: t(
          `$S$ is the part of $z = \\frac{x^{2} + y^{2}}{2}$ above the disk $x^{2} + y^{2} \\le ${n * n - 1}$. Find $\\frac{1}{\\pi}\\iint_{S} ${integrand}$.`,
          `$S$ 是 $z = \\frac{x^{2} + y^{2}}{2}$ 在圆盘 $x^{2} + y^{2} \\le ${n * n - 1}$ 上方的部分。求 $\\frac{1}{\\pi}\\iint_{S} ${integrand}$。`,
        ),
        answer,
        mistakes: apart(answer, [
          why(
            k * (n * n - 1),
            "That integrates over the flat disk; the paraboloid is tilted, so each piece of it carries the area factor $\\sqrt{1 + r^{2}}$.",
            "那是在平面圆盘上积分；抛物面是倾斜的，每一小块都要带面积因子 $\\sqrt{1 + r^{2}}$。",
          ),
          why(
            Q.of(2 * k * n ** 3, 3),
            "That drops the lower limit; at $r = 0$, $1 + r^{2} = 1$, so $1$ must be subtracted from the cube.",
            "那是漏了下限；在 $r = 0$ 处 $1 + r^{2} = 1$，所以立方之后要减去 $1$。",
          ),
          why(
            Q.of(k * (n ** 3 - 1), 3),
            "That forgets the angle; $\\theta$ runs over $2\\pi$, which leaves a factor $2$ after dividing by $\\pi$.",
            "那是漏了角度；$\\theta$ 走过 $2\\pi$，除以 $\\pi$ 后还剩因子 $2$。",
          ),
        ]),
        solution: walked(
          [
            [
              ["Find the area factor", "求面积因子"],
              t(
                "$g_{x} = x$ and $g_{y} = y$, so $dS = \\sqrt{1 + r^{2}}\\,r\\,dr\\,d\\theta$.",
                "$g_{x} = x$，$g_{y} = y$，所以 $dS = \\sqrt{1 + r^{2}}\\,r\\,dr\\,d\\theta$。",
              ),
            ],
            [
              ["Integrate in r", "对 r 积分"],
              t(
                `$\\int_{0}^{\\sqrt{${n * n - 1}}} ${kk}\\sqrt{1 + r^{2}}\\,r\\,dr = ${kk === "" ? "" : `${k} \\cdot `}\\frac{1}{3}(${n}^{3} - 1)$, as $1 + r^{2}$ runs from $1$ to $${n * n}$.`,
                `$\\int_{0}^{\\sqrt{${n * n - 1}}} ${kk}\\sqrt{1 + r^{2}}\\,r\\,dr = ${kk === "" ? "" : `${k} \\cdot `}\\frac{1}{3}(${n}^{3} - 1)$，因为 $1 + r^{2}$ 从 $1$ 变到 $${n * n}$。`,
              ),
            ],
            [
              ["Integrate in θ and divide by π", "对 θ 积分并除以 π"],
              t(
                `$\\frac{2\\pi}{\\pi} \\cdot ${Q.of(k * (n ** 3 - 1), 3).toLatex()} = ${answer.toLatex()}$.`,
                `$\\frac{2\\pi}{\\pi} \\cdot ${Q.of(k * (n ** 3 - 1), 3).toLatex()} = ${answer.toLatex()}$。`,
              ),
            ],
          ],
          t(
            "Differentiating $\\frac{1}{3}(1 + r^{2})^{3/2}$ gives $\\frac{1}{3} \\cdot \\frac{3}{2}(1 + r^{2})^{1/2} \\cdot 2r = r\\sqrt{1 + r^{2}}$, the radial integrand.",
            "对 $\\frac{1}{3}(1 + r^{2})^{3/2}$ 求导得 $\\frac{1}{3} \\cdot \\frac{3}{2}(1 + r^{2})^{1/2} \\cdot 2r = r\\sqrt{1 + r^{2}}$，正是径向被积函数。",
          ),
        ),
      });
    },
  ),
  figure: multivariableDrawings7["surface-integrals-over-cartesian-surfaces#a-surface-integral-over-a-paraboloid"],
};

const hemisphereFlux = {
  ...point(
    "the-flux-through-a-hemisphere",
    ["The flux through a hemisphere", "穿过半球面的通量"],
    [
      "On a sphere of radius $R$ centered at the origin, a radial field $k\\langle x, y, z \\rangle$ is normal to the surface. So its normal component is the constant $kR$, and the flux is this constant times the surface area, without evaluating any cross product. For $10\\langle x, y, z \\rangle$ through the upper half of the unit sphere, the normal component is $10$ and the area is $2\\pi$, so the flux is $20\\pi$.\n\n> **Watch out.** The normal component is $kR$, not $k$, since $\\langle x, y, z \\rangle$ has length $R$ on the sphere; and a hemisphere has area $2\\pi R^{2}$, half of the sphere's $4\\pi R^{2}$.",
      "在圆心位于原点、半径为 $R$ 的球面上，径向场 $k\\langle x, y, z \\rangle$ 垂直于曲面。所以它的法向分量是常数 $kR$，通量等于这个常数乘以曲面面积，不必计算任何叉积。对 $10\\langle x, y, z \\rangle$ 穿过单位球面的上半部分，法向分量为 $10$，面积为 $2\\pi$，所以通量为 $20\\pi$。\n\n> **注意。** 法向分量是 $kR$ 而不是 $k$，因为 $\\langle x, y, z \\rangle$ 在球面上的长度是 $R$；半球面的面积是 $2\\pi R^{2}$，是整个球面 $4\\pi R^{2}$ 的一半。",
    ],
    (rng) => {
      const R = rng.int(1, 6);
      const k = nz(rng, 9);
      const answer = 2 * k * R ** 3;
      return numberProblem({
        prompt: t(
          `Find $\\frac{1}{\\pi}\\iint_{S} \\mathbf{F} \\cdot d\\mathbf{S}$ for $\\mathbf{F} = ${br(poly([k, "x"]), poly([k, "y"]), poly([k, "z"]))}$, where $S$ is the upper hemisphere of $x^{2} + y^{2} + z^{2} = ${R * R}$, with the outward normal.`,
          `求 $\\frac{1}{\\pi}\\iint_{S} \\mathbf{F} \\cdot d\\mathbf{S}$，其中 $\\mathbf{F} = ${br(poly([k, "x"]), poly([k, "y"]), poly([k, "z"]))}$，$S$ 是 $x^{2} + y^{2} + z^{2} = ${R * R}$ 的上半球面，取外法向。`,
        ),
        answer,
        mistakes: apart(answer, [
          why(
            4 * k * R ** 3,
            "That uses the whole sphere; the upper hemisphere has half its area, $2\\pi R^{2}$.",
            "那是用了整个球面；上半球面只有一半的面积 $2\\pi R^{2}$。",
          ),
          why(
            2 * k * R * R,
            `That takes the normal component to be $${k}$; on the sphere it is $kR = ${k * R}$.`,
            `那是把法向分量当成了 $${k}$；在球面上它是 $kR = ${k * R}$。`,
          ),
          why(
            k * R ** 3,
            "That uses the area $\\pi R^{2}$ of the flat disk under the hemisphere; the hemisphere itself has area $2\\pi R^{2}$.",
            "那是用了半球面下方平面圆盘的面积 $\\pi R^{2}$；半球面本身的面积是 $2\\pi R^{2}$。",
          ),
        ]),
        solution: walked(
          [
            [
              ["Find the normal component", "求法向分量"],
              t(
                `$\\mathbf{n} = \\frac{\\langle x, y, z \\rangle}{${R}}$, so $\\mathbf{F} \\cdot \\mathbf{n} = \\frac{${k === 1 ? "" : k === -1 ? "-" : k}(x^{2} + y^{2} + z^{2})}{${R}} = ${k * R}$ everywhere on $S$.`,
                `$\\mathbf{n} = \\frac{\\langle x, y, z \\rangle}{${R}}$，所以在 $S$ 上处处有 $\\mathbf{F} \\cdot \\mathbf{n} = \\frac{${k === 1 ? "" : k === -1 ? "-" : k}(x^{2} + y^{2} + z^{2})}{${R}} = ${k * R}$。`,
              ),
            ],
            [
              ["Multiply by the area", "乘以面积"],
              t(
                `The hemisphere has area $${2 * R * R}\\pi$, so the flux is $${answer}\\pi$ and the value is $${answer}$.`,
                `半球面的面积为 $${2 * R * R}\\pi$，所以通量为 $${answer}\\pi$，所求值为 $${answer}$。`,
              ),
            ],
          ],
          t(
            `Close $S$ with the disk $z = 0$, where $\\mathbf{F} \\cdot (-\\mathbf{k}) = 0$. Then the divergence $${3 * k}$ times the volume $${Q.of(2 * R ** 3, 3).toLatex()}\\pi$ of the half ball gives $${answer}\\pi$, the same.`,
            `用圆盘 $z = 0$ 封闭 $S$，在那里 $\\mathbf{F} \\cdot (-\\mathbf{k}) = 0$。于是散度 $${3 * k}$ 乘以半球体的体积 $${Q.of(2 * R ** 3, 3).toLatex()}\\pi$ 得 $${answer}\\pi$，结果相同。`,
          ),
        ),
      });
    },
  ),
  figure: multivariableDrawings7["calculating-flux-through-parametric-surfaces#the-flux-through-a-hemisphere"],
};

const downwardFlux = {
  ...point(
    "downward-flux-through-a-tilted-plane",
    ["Downward flux through a tilted plane", "穿过斜平面的向下通量"],
    [
      "For a graph $z = g(x, y)$, the upward normal element is $\\langle -g_{x}, -g_{y}, 1 \\rangle\\,dA$. The downward one is its negative. Both the minus signs and the slopes matter: using only the third component of the field would treat the plane as horizontal. For $z = 5x + y$ and $\\mathbf{F} = \\langle 1, 1, 1 \\rangle$, the downward element is $\\langle 5, 1, -1 \\rangle\\,dA$, the dot product is $5$, and above $[0, 1] \\times [0, 1]$ the downward flux is $5$.\n\n> **Watch out.** Downward means the third component of the element is $-1$, so the slopes enter with plus signs; and the constant term of the plane does not change the normal at all.",
      "对图像 $z = g(x, y)$，向上的法向面元是 $\\langle -g_{x}, -g_{y}, 1 \\rangle\\,dA$，向下的是它的相反数。负号和斜率都很重要：只用场的第三个分量，等于把平面当作水平面。对 $z = 5x + y$ 与 $\\mathbf{F} = \\langle 1, 1, 1 \\rangle$，向下的面元是 $\\langle 5, 1, -1 \\rangle\\,dA$，点积为 $5$，在 $[0, 1] \\times [0, 1]$ 上方向下的通量为 $5$。\n\n> **注意。** 向下意味着面元的第三个分量是 $-1$，所以斜率带正号进入；平面的常数项完全不影响法向量。",
    ],
    (rng) => {
      const a = nz(rng, 4);
      const b = nz(rng, 4);
      const c = rng.int(-6, 6);
      const p = nz(rng, 6);
      const q = nz(rng, 6);
      const r = nz(rng, 6);
      const W = rng.int(1, 5);
      const H = rng.int(1, 5);
      const dot = p * a + q * b - r;
      const answer = dot * W * H;
      const pn = (n: number) => (n < 0 ? `(${n})` : `${n}`);
      return numberProblem({
        prompt: t(
          `Find the downward flux of $\\mathbf{F} = ${br(p, q, r)}$ through the part of the plane $z = ${poly([a, "x"], [b, "y"], [c, ""])}$ above $[0, ${W}] \\times [0, ${H}]$.`,
          `求 $\\mathbf{F} = ${br(p, q, r)}$ 向下穿过平面 $z = ${poly([a, "x"], [b, "y"], [c, ""])}$ 在 $[0, ${W}] \\times [0, ${H}]$ 上方部分的通量。`,
        ),
        answer,
        mistakes: apart(answer, [
          why(
            -answer,
            "That is the upward flux; the downward element is the negative of $\\langle -g_{x}, -g_{y}, 1 \\rangle\\,dA$.",
            "那是向上的通量；向下的面元是 $\\langle -g_{x}, -g_{y}, 1 \\rangle\\,dA$ 的相反数。",
          ),
          why(
            -r * W * H,
            "That keeps only the third component, as if the plane were horizontal; its slopes tilt the normal.",
            "那是只保留了第三个分量，好像平面是水平的；它的斜率使法向量倾斜。",
          ),
          why(
            (p * a + q * b + r) * W * H,
            "That flips the slopes but not the third component; downward, the element ends in $-1$.",
            "那是只把斜率变了号，第三个分量没有变；向下时面元的最后一个分量是 $-1$。",
          ),
        ]),
        solution: walked(
          [
            [
              ["Find the downward element", "求向下的面元"],
              t(
                `$g_{x} = ${a}$ and $g_{y} = ${b}$, so the downward element is $${br(a, b, -1)}\\,dA$.`,
                `$g_{x} = ${a}$，$g_{y} = ${b}$，所以向下的面元是 $${br(a, b, -1)}\\,dA$。`,
              ),
            ],
            [
              ["Dot with F", "与 F 作点积"],
              t(`$${p * a} + ${pn(q * b)} + ${pn(-r)} = ${dot}$.`, `$${p * a} + ${pn(q * b)} + ${pn(-r)} = ${dot}$。`),
            ],
            [
              ["Multiply by the area", "乘以面积"],
              t(
                `The rectangle has area $${W * H}$, so the flux is $${dot} \\cdot ${W * H} = ${answer}$.`,
                `矩形面积为 $${W * H}$，所以通量为 $${dot} \\cdot ${W * H} = ${answer}$。`,
              ),
            ],
          ],
          t(
            `The element $${br(a, b, -1)}$ is perpendicular to the direction $${br(1, 0, a)}$ in the plane, since $${a} - ${pn(a)} = 0$, and its third component is negative, so it points down.`,
            `面元 $${br(a, b, -1)}$ 与平面内的方向 $${br(1, 0, a)}$ 垂直，因为 $${a} - ${pn(a)} = 0$；它的第三个分量为负，所以指向下方。`,
          ),
        ),
      });
    },
  ),
  figure: multivariableDrawings7["calculating-flux-through-cartesian-surfaces#downward-flux-through-a-tilted-plane"],
};

const closedCylinder = {
  ...point(
    "the-flux-out-of-a-closed-cylinder",
    ["The flux out of a closed cylinder", "穿出闭合圆柱的通量"],
    [
      "A closed cylinder has three faces, and each is handled separately. On the side the normal is radial, on the top it is $\\mathbf{k}$, and on the bottom it is $-\\mathbf{k}$. A face where $z = 0$ gives no flux from a field whose third component is a multiple of $z$. For $\\langle x, y, 10z \\rangle$ out of $x^{2} + y^{2} \\le 1$, $0 \\le z \\le 1$, the side gives $2\\pi$, the top $10\\pi$ and the bottom $0$, for $12\\pi$ in all.\n\n> **Watch out.** All three faces must be counted: the side carries the $x$ and $y$ parts, the top carries the $z$ part, and only the bottom, at $z = 0$, gives nothing.",
      "闭合圆柱有三个面，要分别处理。侧面的法向量沿径向，顶面是 $\\mathbf{k}$，底面是 $-\\mathbf{k}$。对第三个分量是 $z$ 的倍数的场，$z = 0$ 的面没有通量。对 $\\langle x, y, 10z \\rangle$ 穿出 $x^{2} + y^{2} \\le 1$，$0 \\le z \\le 1$，侧面得 $2\\pi$，顶面得 $10\\pi$，底面得 $0$，共 $12\\pi$。\n\n> **注意。** 三个面都要算：侧面承载 $x$ 与 $y$ 部分，顶面承载 $z$ 部分，只有在 $z = 0$ 的底面没有贡献。",
    ],
    (rng) => {
      const R = rng.int(1, 6);
      const h = rng.int(1, 6);
      const k = rng.int(1, 9);
      const answer = R * R * h * (2 + k);
      const F = br("x", "y", poly([k, "z"]));
      return numberProblem({
        prompt: t(
          `Find $\\frac{1}{\\pi}$ times the outward flux of $\\mathbf{F} = ${F}$ through the closed cylinder $x^{2} + y^{2} \\le ${R * R}$, $0 \\le z \\le ${h}$, using all of its faces.`,
          `用圆柱的所有面，求 $\\mathbf{F} = ${F}$ 穿出闭合圆柱 $x^{2} + y^{2} \\le ${R * R}$，$0 \\le z \\le ${h}$ 的外通量乘以 $\\frac{1}{\\pi}$ 的值。`,
        ),
        answer,
        mistakes: apart(answer, [
          why(
            k * R * R * h,
            "That counts only the top; the side also has flux, from the $x$ and $y$ parts of the field.",
            "那是只算了顶面；侧面也有通量，来自场的 $x$ 与 $y$ 部分。",
          ),
          why(
            2 * R * R * h,
            "That counts only the side; the top, where $z$ is at its largest, has flux as well.",
            "那是只算了侧面；顶面上 $z$ 最大，也有通量。",
          ),
          why(
            2 * R * R * h * (1 + k),
            "That counts the top twice; the bottom lies at $z = 0$ and gives nothing.",
            "那是把顶面算了两次；底面在 $z = 0$ 处，没有贡献。",
          ),
        ]),
        solution: walked(
          [
            [
              ["The side", "侧面"],
              t(
                `$\\mathbf{n} = \\frac{\\langle x, y, 0 \\rangle}{${R}}$, so $\\mathbf{F} \\cdot \\mathbf{n} = ${R}$ over area $${2 * R * h}\\pi$, giving $${2 * R * R * h}\\pi$.`,
                `$\\mathbf{n} = \\frac{\\langle x, y, 0 \\rangle}{${R}}$，所以 $\\mathbf{F} \\cdot \\mathbf{n} = ${R}$，面积为 $${2 * R * h}\\pi$，得 $${2 * R * R * h}\\pi$。`,
              ),
            ],
            [
              ["The top and bottom", "顶面与底面"],
              t(
                `On the top $\\mathbf{F} \\cdot \\mathbf{k} = ${k * h}$ over area $${R * R}\\pi$, giving $${k * h * R * R}\\pi$; on the bottom $z = 0$, so it gives $0$.`,
                `在顶面 $\\mathbf{F} \\cdot \\mathbf{k} = ${k * h}$，面积为 $${R * R}\\pi$，得 $${k * h * R * R}\\pi$；底面 $z = 0$，得 $0$。`,
              ),
            ],
            [
              ["Add", "相加"],
              t(
                `$${2 * R * R * h}\\pi + ${k * h * R * R}\\pi = ${answer}\\pi$, so the value is $${answer}$.`,
                `$${2 * R * R * h}\\pi + ${k * h * R * R}\\pi = ${answer}\\pi$，所以所求值为 $${answer}$。`,
              ),
            ],
          ],
          t(
            `$\\operatorname{div} \\mathbf{F} = ${2 + k}$ and the solid has volume $${R * R * h}\\pi$; their product is $${answer}\\pi$, as the divergence theorem requires.`,
            `$\\operatorname{div} \\mathbf{F} = ${2 + k}$，立体体积为 $${R * R * h}\\pi$；两者之积为 $${answer}\\pi$，与散度定理一致。`,
          ),
        ),
      });
    },
  ),
  figure: multivariableDrawings7["calculating-flux-through-closed-surfaces#the-flux-out-of-a-closed-cylinder"],
};

const stoppingDistance = point(
  "a-stopping-distance-from-work-and-energy",
  ["A stopping distance from work and energy", "由功和能求制动距离"],
  [
    "A constant force opposing the motion does negative work equal to the force times the distance. Stopping means that this work removes all the kinetic energy, so the distance is proportional to the square of the speed: twice the speed needs four times the distance. A $10$ kg object at $30$ m/s has $4500$ J of kinetic energy, so a $15$ N force stops it in $\\frac{4500}{15} = 300$ m.\n\n> **Watch out.** The force must remove the kinetic energy $\\frac{1}{2}mv^{2}$, with the speed squared and the factor $\\frac{1}{2}$; dividing the momentum $mv$ by the force gives a time, not a distance.",
    "与运动方向相反的恒力做负功，大小等于力乘以距离。停下来意味着这个功消耗了全部动能，所以距离与速度的平方成正比：速度加倍，需要四倍的距离。一个 $10$ kg、速度为 $30$ m/s 的物体有 $4500$ J 的动能，所以 $15$ N 的力在 $\\frac{4500}{15} = 300$ m 内使它停下。\n\n> **注意。** 力要消耗的是动能 $\\frac{1}{2}mv^{2}$，速度要平方，还有因子 $\\frac{1}{2}$；用动量 $mv$ 除以力得到的是时间，不是距离。",
  ],
  (rng) => {
    const m = rng.int(1, 9);
    const v = rng.int(2, 20);
    const F = rng.int(1, 12);
    const answer = Q.of(m * v * v, 2 * F);
    const K = Q.of(m * v * v, 2);
    return numberProblem({
      prompt: t(
        `An object of mass $${m}$ kg moving at $${v}$ m/s is brought to rest by a constant opposing force of $${F}$ N. Find the distance it travels, in meters.`,
        `质量为 $${m}$ kg、速度为 $${v}$ m/s 的物体，在 $${F}$ N 的恒定阻力作用下停止。求它经过的距离（单位：米）。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          Q.of(m * v, F),
          "That divides the momentum $mv$ by the force, which gives the stopping time; the distance comes from the kinetic energy.",
          "那是用动量 $mv$ 除以力，得到的是停止所用的时间；距离要由动能求出。",
        ),
        why(
          Q.of(m * v * v, F),
          "That leaves out the $\\frac{1}{2}$ in the kinetic energy $\\frac{1}{2}mv^{2}$.",
          "那是漏了动能 $\\frac{1}{2}mv^{2}$ 中的 $\\frac{1}{2}$。",
        ),
        why(
          Q.of(v * v, 2 * F),
          "That leaves out the mass; the kinetic energy is $\\frac{1}{2}mv^{2}$.",
          "那是漏了质量；动能是 $\\frac{1}{2}mv^{2}$。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the kinetic energy", "求动能"],
            t(`$\\frac{1}{2}mv^{2} = ${K.toLatex()}$ J.`, `$\\frac{1}{2}mv^{2} = ${K.toLatex()}$ J。`),
          ],
          [
            ["Match the work", "令功相等"],
            t(
              `The force removes $${F}d$ J, so $${F}d = ${K.toLatex()}$ and $d = ${answer.toLatex()}$ m.`,
              `阻力消耗 $${F}d$ J，所以 $${F}d = ${K.toLatex()}$，$d = ${answer.toLatex()}$ m。`,
            ),
          ],
        ],
        t(
          `The deceleration is $\\frac{F}{m} = ${Q.of(F, m).toLatex()}$ m/s², and $v^{2} = 2 \\cdot \\frac{F}{m} \\cdot d$ gives $d = \\frac{${m * v * v}}{${2 * F}} = ${answer.toLatex()}$, the same.`,
          `减速度为 $\\frac{F}{m} = ${Q.of(F, m).toLatex()}$ m/s²，由 $v^{2} = 2 \\cdot \\frac{F}{m} \\cdot d$ 得 $d = \\frac{${m * v * v}}{${2 * F}} = ${answer.toLatex()}$，结果相同。`,
        ),
      ),
    });
  },
);

const maxSpeedOnCircle = {
  ...point(
    "the-greatest-speed-a-force-can-hold-on-a-circle",
    ["The greatest speed a force can hold on a circle", "力能维持圆周运动的最大速度"],
    [
      "Uniform circular motion needs an inward force $mR\\omega^{2}$, equivalently $\\frac{mv^{2}}{R}$. If the inward force has a limit, such as the strength of a string, this limit sets the greatest angular speed, and then the speed follows from $v = R\\omega$. A string that holds $500$ N keeps a $10$ kg mass on a circle of radius $2$ m at up to $v^{2} = \\frac{500 \\cdot 2}{10} = 100$, so $v = 10$ m/s.\n\n> **Watch out.** Solve $\\frac{mv^{2}}{R} = F$ for $v^{2}$, which multiplies by $R$ and divides by $m$, then take the root; $\\frac{F}{m}$ alone is the acceleration, and $\\omega$ is not the speed.",
      "匀速圆周运动需要向内的力 $mR\\omega^{2}$，也就是 $\\frac{mv^{2}}{R}$。如果向内的力有上限，例如绳子的强度，这个上限就决定最大角速度，再由 $v = R\\omega$ 得到速度。能承受 $500$ N 的绳子把 $10$ kg 的质量维持在半径 $2$ m 的圆周上，最多有 $v^{2} = \\frac{500 \\cdot 2}{10} = 100$，所以 $v = 10$ m/s。\n\n> **注意。** 由 $\\frac{mv^{2}}{R} = F$ 解出 $v^{2}$，要乘以 $R$ 再除以 $m$，然后开平方；单独的 $\\frac{F}{m}$ 是加速度，$\\omega$ 也不是速度。",
    ],
    (rng) => {
      const m = rng.int(1, 5);
      const R = rng.int(1, 6);
      const w = rng.int(2, 9);
      const F = m * R * w * w;
      const answer = w * R;
      return numberProblem({
        prompt: t(
          `A string that breaks at a tension of $${F}$ N holds a particle of mass $${m}$ kg on a circle of radius $${R}$ m. Find the greatest speed it can have, in m/s.`,
          `一根在张力 $${F}$ N 时会断的绳子，把质量为 $${m}$ kg 的质点维持在半径 $${R}$ m 的圆周上。求它能达到的最大速度（单位：m/s）。`,
        ),
        answer,
        mistakes: apart(answer, [
          why(
            w,
            `That is the angular speed $\\omega$; the speed is $v = R\\omega = ${R}\\omega$.`,
            `那是角速度 $\\omega$；速度是 $v = R\\omega = ${R}\\omega$。`,
          ),
          why(
            Q.of(F, m),
            "That is $\\frac{F}{m}$, the greatest acceleration; the speed comes from $v^{2} = \\frac{FR}{m}$.",
            "那是 $\\frac{F}{m}$，即最大加速度；速度由 $v^{2} = \\frac{FR}{m}$ 求出。",
          ),
          why(answer * answer, "That is $v^{2}$; take its square root.", "那是 $v^{2}$；还要开平方。"),
        ]),
        solution: walked(
          [
            [
              ["Set the force", "令力相等"],
              t(
                `$\\frac{mv^{2}}{R} = ${F}$ gives $v^{2} = \\frac{FR}{m} = ${answer * answer}$.`,
                `由 $\\frac{mv^{2}}{R} = ${F}$ 得 $v^{2} = \\frac{FR}{m} = ${answer * answer}$。`,
              ),
            ],
            [["Take the root", "开平方"], t(`$v = ${answer}$ m/s.`, `$v = ${answer}$ m/s。`)],
          ],
          t(
            `Then $\\omega = \\frac{v}{R} = ${w}$ rad/s, and with $m = ${m}$ and $R = ${R}$, $mR\\omega^{2} = ${F}$ N, the breaking tension.`,
            `于是 $\\omega = \\frac{v}{R} = ${w}$ rad/s，取 $m = ${m}$、$R = ${R}$，$mR\\omega^{2} = ${F}$ N，正是绳子断裂的张力。`,
          ),
        ),
      });
    },
  ),
  figure: multivariableDrawings8["circular-motion-about-the-origin#the-greatest-speed-a-force-can-hold-on-a-circle"],
};

const massFromTwoAxes = {
  ...point(
    "the-mass-from-two-parallel-axes",
    ["The mass from two parallel axes", "由两条平行轴求质量"],
    [
      "Applying the parallel axis theorem to two axes and subtracting removes the unknown moment about the center of mass. What remains is $I_{2} - I_{1} = M(d_{2}^{2} - d_{1}^{2})$, which gives the mass. It is the squares of the distances that are subtracted. With $I_{1} = 60$ at $d_{1} = 5$ and $I_{2} = 82$ at $d_{2} = 6$, $22 = M(36 - 25)$, so $M = 2$, and then $I_c = 60 - 50 = 10$.\n\n> **Watch out.** Square each distance before subtracting: $d_{2}^{2} - d_{1}^{2}$, not $(d_{2} - d_{1})^{2}$ or $d_{2} - d_{1}$. Dividing one moment by $d^{2}$ alone ignores the moment about the center.",
      "对两条轴应用平行轴定理再相减，就消去了关于质心的未知转动惯量。剩下 $I_{2} - I_{1} = M(d_{2}^{2} - d_{1}^{2})$，由此得到质量。相减的是距离的平方。若 $d_{1} = 5$ 时 $I_{1} = 60$，$d_{2} = 6$ 时 $I_{2} = 82$，则 $22 = M(36 - 25)$，所以 $M = 2$，进而 $I_c = 60 - 50 = 10$。\n\n> **注意。** 要先把每个距离平方再相减：是 $d_{2}^{2} - d_{1}^{2}$，不是 $(d_{2} - d_{1})^{2}$ 或 $d_{2} - d_{1}$。只用一个转动惯量除以 $d^{2}$ 会忽略关于质心的转动惯量。",
    ],
    (rng) => {
      const M = rng.int(1, 9);
      const Ic = rng.int(1, 30);
      const d1 = rng.int(1, 4);
      const d2 = d1 + rng.int(1, 4);
      const I1 = Ic + M * d1 * d1;
      const I2 = Ic + M * d2 * d2;
      const diff = I2 - I1;
      return numberProblem({
        prompt: t(
          `A body has moment of inertia $${I1}$ about an axis at distance $${d1}$ from its center of mass, and $${I2}$ about a parallel axis at distance $${d2}$. Find its mass.`,
          `一个物体关于到质心距离为 $${d1}$ 的轴的转动惯量是 $${I1}$，关于到质心距离为 $${d2}$ 的平行轴的转动惯量是 $${I2}$。求它的质量。`,
        ),
        answer: M,
        mistakes: apart(M, [
          why(
            Q.of(diff, d2 - d1),
            "That uses the difference of the distances without squaring them; the theorem gives $d_{2}^{2} - d_{1}^{2}$.",
            "那是直接用距离之差，没有平方；定理给出的是 $d_{2}^{2} - d_{1}^{2}$。",
          ),
          why(
            Q.of(diff, d2 * d2),
            "That divides by $d_{2}^{2}$ alone; the first axis contributes $-Md_{1}^{2}$.",
            "那是只除以 $d_{2}^{2}$；第一条轴贡献了 $-Md_{1}^{2}$。",
          ),
          why(
            Q.of(I2, d2 * d2),
            "That ignores the moment about the center of mass, as if $I_{2}$ were all $Md_{2}^{2}$.",
            "那是忽略了关于质心的转动惯量，好像 $I_{2}$ 全是 $Md_{2}^{2}$。",
          ),
        ]),
        solution: walked(
          [
            [
              ["Subtract the two equations", "两式相减"],
              t(
                `$I_{2} - I_{1} = M(d_{2}^{2} - d_{1}^{2})$ gives $${I2} - ${I1} = M(${d2 * d2} - ${d1 * d1})$, that is, $${diff} = ${d2 * d2 - d1 * d1}M$.`,
                `$I_{2} - I_{1} = M(d_{2}^{2} - d_{1}^{2})$ 给出 $${I2} - ${I1} = M(${d2 * d2} - ${d1 * d1})$，即 $${diff} = ${d2 * d2 - d1 * d1}M$。`,
              ),
            ],
            [
              ["Divide", "相除"],
              t(`$M = \\frac{${diff}}{${d2 * d2 - d1 * d1}} = ${M}$.`, `$M = \\frac{${diff}}{${d2 * d2 - d1 * d1}} = ${M}$。`),
            ],
          ],
          t(
            `Then $I_c = ${I1} - ${M * d1 * d1} = ${Ic}$, and $${Ic} + ${M * d2 * d2} = ${I2}$ matches the second axis.`,
            `于是 $I_c = ${I1} - ${M * d1 * d1} = ${Ic}$，而 $${Ic} + ${M * d2 * d2} = ${I2}$ 与第二条轴相符。`,
          ),
        ),
      });
    },
  ),
  figure: multivariableDrawings8["the-parallel-axis-theorem#the-mass-from-two-parallel-axes"],
};

/** deeperMultivariableCalculusThird2Points maps topics of Multivariable Calculus, from changes of variables to line and surface integrals, to a third knowledge point. */
export const deeperMultivariableCalculusThird2Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "changing-the-order-of-integration-in-triple-integrals-changing-projection": [separatingProjection],
  "changing-the-order-of-integration-in-triple-integrals-changing-region": [easierOrder],
  "computing-areas-using-a-change-of-variables": [ellipticAnnulus],
  "computing-double-integrals-using-a-change-of-variables": [differenceOfSquares],
  "cylindrical-polar-coordinates": [oppositeDistance],
  "surfaces-in-cylindrical-polar-coordinates": [offAxisCylinder],
  "surfaces-in-spherical-polar-coordinates": [sphericalKinds],
  "computing-triple-integrals-using-a-change-of-variables": [zSquaredEllipsoid],
  "simple-closed-and-oriented-curves": [selfCrossing],
  "line-integrals-of-scalar-functions": [segmentIn3d],
  "properties-of-line-integrals-of-scalar-functions": [averageOnCurve],
  "line-integrals-of-scalar-functions-over-paths-expressed-as-functions-of-x": [alongParabola],
  "line-integrals-of-scalar-functions-over-paths-expressed-as-functions-of-y": [powerCurveInY],
  "line-integrals-of-scalar-functions-over-circles": [offCenterCircle],
  "line-integrals-of-scalar-functions-over-ellipses": [quarterEllipse],
  "further-properties-of-line-integrals-of-scalar-functions": [weightedAverage],
  "line-integrals-of-scalar-functions-over-polar-curves": [polarCircle],
  "line-integrals-with-respect-to-x-and-y": [areaFromYdx],
  "properties-of-line-integrals-with-respect-to-x-and-y": [verticalPiece],
  "sums-of-line-integrals-with-respect-to-x-and-y-over-parametric-curves": [quarterCircleSum],
  "sums-of-line-integrals-with-respect-to-x-and-y": [generalSegment],
  "line-integrals-of-vector-valued-functions-over-parametric-curves": [twistedCubic],
  "line-integrals-of-vector-valued-functions-over-general-curves": [graphInY],
  "properties-of-line-integrals-of-vector-valued-functions": [tangentialComponent],
  "the-fundamental-theorem-of-line-integrals": [potentialChain],
  "conservative-vector-fields-and-closed-paths": [twoPaths],
  "calculating-potential-functions-for-line-integrals": [findKThenIntegrate],
  "line-integrals-of-conservative-vector-fields-in-three-dimensions": [endpointsFromParametrization],
  "conservation-of-mechanical-energy": [turningPoint],
  "outward-pointing-unit-normal-vectors-in-2d": [ellipseNormal],
  "flux-in-two-dimensional-vector-fields": [constantFluxArc],
  "calculating-flux-in-two-dimensional-vector-fields": [oneEdge],
  "circulation-and-flux-across-simple-closed-plane-curves": [circulationEqualsFlux],
  "greens-theorem-in-polar-coordinates": [sectorGreen],
  "greens-theorem-in-flux-divergence-form": [areaFromFlux],
  "greens-theorem-on-regions-with-holes": [twoHoles],
  "tangent-planes-to-parametric-surfaces": [singularPoint],
  "parametrizations-of-ellipsoids-and-cones": [ellipticCone],
  "parametrizations-of-paraboloids-and-hyperboloids": [twoSheets],
  "surfaces-of-revolution": [torusArea],
  "surface-integrals-over-cartesian-surfaces": [paraboloidSurface],
  "calculating-flux-through-parametric-surfaces": [hemisphereFlux],
  "calculating-flux-through-cartesian-surfaces": [downwardFlux],
  "calculating-flux-through-closed-surfaces": [closedCylinder],
  "the-work-energy-principle": [stoppingDistance],
  "circular-motion-about-the-origin": [maxSpeedOnCircle],
  "the-parallel-axis-theorem": [massFromTwoAxes],
};
