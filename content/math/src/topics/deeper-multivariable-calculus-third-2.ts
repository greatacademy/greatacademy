// Third knowledge points for thin topics of Multivariable Calculus, from changes of variables to
// line and surface integrals: the reverse question, a harder case or a common trap.
// See `deeperMultivariableCalculusThird2Points`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { poly, Q } from "@ga/subject-math";

import { ask, choose, type Pair, point } from "../university-kit.ts";

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

const separatingProjection = point(
  "a-projection-that-separates-the-variables",
  ["A projection that separates the variables", "使变量分离的投影"],
  [
    "A triple integral can be set up over any of the three coordinate planes. If the solid is a triangular prism along the $y$-axis, projecting to the $xz$-plane makes the limits for $y$ constant, so an integrand in $y$ alone splits off as a single factor.",
    "三重积分可以投影到三个坐标平面中的任何一个。如果立体是沿 $y$ 轴的三棱柱，投影到 $xz$ 平面后 $y$ 的积分限是常数，所以只含 $y$ 的被积函数可以单独分离成一个因子。",
  ],
  (rng) => {
    const a = rng.int(1, 6);
    const b = rng.int(1, 6);
    const k = rng.int(1, 6);
    const answer = Q.of(k * a * a * b * b, 4);
    return ask(
      [
        `$E$ is the solid bounded by $x = 0$, $z = 0$, $x + z = ${a}$, $y = 0$ and $y = ${b}$. Evaluate $\\iiint_{E} ${poly([k, "y"])}\\,dV$.`,
        `$E$ 是由 $x = 0$，$z = 0$，$x + z = ${a}$，$y = 0$ 和 $y = ${b}$ 围成的立体。求 $\\iiint_{E} ${poly([k, "y"])}\\,dV$。`,
      ],
      answer,
      [Q.of(k * a * a * b * b, 2), Q.of(k * a * b * b, 2), Q.of(k * a * a * b, 2)],
      [
        `Over the $xz$-plane the solid projects to a triangle of area $${Q.of(a * a, 2).toLatex()}$, and $\\int_{0}^{${b}} ${poly([k, "y"])} \\, dy = ${Q.of(k * b * b, 2).toLatex()}$. The product is $${answer.toLatex()}$.`,
        `立体在 $xz$ 平面上的投影是面积为 $${Q.of(a * a, 2).toLatex()}$ 的三角形，且 $\\int_{0}^{${b}} ${poly([k, "y"])} \\, dy = ${Q.of(k * b * b, 2).toLatex()}$。两者之积是 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const easierOrder = point(
  "changing-the-order-to-do-the-easy-integrals-first",
  ["Changing the order to do the easy integrals first", "改变次序先做容易的积分"],
  [
    "The limits $0 \\le z \\le y \\le x \\le a$ describe one region, whatever the order of integration. When the integrand depends only on $x$, it pays to integrate $z$ and $y$ first: together they give the factor $\\frac{x^{2}}{2}$, the area of a triangle.",
    "限制 $0 \\le z \\le y \\le x \\le a$ 描述同一个区域，与积分次序无关。当被积函数只依赖 $x$ 时，先对 $z$ 和 $y$ 积分更好：二者合起来给出因子 $\\frac{x^{2}}{2}$，即一个三角形的面积。",
  ],
  (rng) => {
    const a = rng.int(1, 6);
    const k = rng.int(1, 9);
    const answer = Q.of(k * a ** 4, 8);
    return ask(
      [
        `Evaluate $\\int_{0}^{${a}} \\int_{z}^{${a}} \\int_{y}^{${a}} ${poly([k, "x"])}\\,dx\\,dy\\,dz$ by changing the order of integration.`,
        `通过改变积分次序，求 $\\int_{0}^{${a}} \\int_{z}^{${a}} \\int_{y}^{${a}} ${poly([k, "x"])}\\,dx\\,dy\\,dz$。`,
      ],
      answer,
      [Q.of(k * a ** 4, 4), Q.of(k * a ** 4, 24), Q.of(k * a ** 3, 6)],
      [
        `The region is $0 \\le z \\le y \\le x \\le ${a}$. For fixed $x$, the $z$ and $y$ integrals give $\\frac{x^{2}}{2}$, so the integral is $\\int_{0}^{${a}} ${Q.of(k, 2).toLatex()}x^{3} \\, dx = ${answer.toLatex()}$.`,
        `区域是 $0 \\le z \\le y \\le x \\le ${a}$。固定 $x$，对 $z$ 和 $y$ 积分得 $\\frac{x^{2}}{2}$，所以积分是 $\\int_{0}^{${a}} ${Q.of(k, 2).toLatex()}x^{3} \\, dx = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const ellipticAnnulus = point(
  "the-area-between-two-similar-ellipses",
  ["The area between two similar ellipses", "两个相似椭圆之间的面积"],
  [
    "The substitution $x = pu$, $y = qv$ turns an elliptical ring into a circular ring, and every area is multiplied by the constant Jacobian $pq$. So the area of the ring is $pq$ times the difference of the two circular areas, using the squared radii.",
    "代换 $x = pu$，$y = qv$ 把椭圆环变成圆环，所有面积都乘以常数雅可比行列式 $pq$。所以环的面积是 $pq$ 乘以两个圆面积之差，用的是半径的平方。",
  ],
  (rng) => {
    const p = rng.int(2, 6);
    const q = rng.int(2, 6);
    const R = rng.int(2, 5);
    const answer = p * q * (R * R - 1);
    return ask(
      [
        `Find $\\frac{A}{\\pi}$, where $A$ is the area of the region $1 \\le \\frac{x^{2}}{${p * p}} + \\frac{y^{2}}{${q * q}} \\le ${R * R}$.`,
        `求 $\\frac{A}{\\pi}$，其中 $A$ 是区域 $1 \\le \\frac{x^{2}}{${p * p}} + \\frac{y^{2}}{${q * q}} \\le ${R * R}$ 的面积。`,
      ],
      answer,
      [p * q * R * R, (p + q) * (R * R - 1), p * q * (R - 1)],
      [
        `With $x = ${p}u$ and $y = ${q}v$, the region becomes $1 \\le u^{2} + v^{2} \\le ${R * R}$, of area $${R * R - 1}\\pi$. Multiplying by the Jacobian $${p * q}$ gives $\\frac{A}{\\pi} = ${answer}$.`,
        `令 $x = ${p}u$，$y = ${q}v$，区域变为 $1 \\le u^{2} + v^{2} \\le ${R * R}$，面积是 $${R * R - 1}\\pi$。乘以雅可比行列式 $${p * q}$，得 $\\frac{A}{\\pi} = ${answer}$。`,
      ],
    );
  },
);

const differenceOfSquares = point(
  "a-difference-of-squares-under-a-rotated-rectangle",
  ["A difference of squares under a rotated rectangle", "旋转矩形上的平方差"],
  [
    "With $u = x + y$ and $v = x - y$, a rotated rectangle becomes an ordinary one and $x^{2} - y^{2}$ becomes $uv$. The trap is the area element: the Jacobian of $(x, y)$ in terms of $(u, v)$ has absolute value $\\frac{1}{2}$, not $2$.",
    "用 $u = x + y$，$v = x - y$，旋转的矩形变成普通矩形，$x^{2} - y^{2}$ 变成 $uv$。陷阱在面积元：$(x, y)$ 关于 $(u, v)$ 的雅可比行列式的绝对值是 $\\frac{1}{2}$，而不是 $2$。",
  ],
  (rng) => {
    const a = rng.int(1, 6);
    const b = rng.int(1, 6);
    const k = rng.int(1, 12);
    const answer = Q.of(k * a * a * b * b, 8);
    return ask(
      [
        `Evaluate $\\iint_{R} ${k}(x^{2} - y^{2})\\,dA$, where $R = \\{(x, y) : 0 \\le x + y \\le ${a},\\ 0 \\le x - y \\le ${b}\\}$.`,
        `求 $\\iint_{R} ${k}(x^{2} - y^{2})\\,dA$，其中 $R = \\{(x, y) : 0 \\le x + y \\le ${a},\\ 0 \\le x - y \\le ${b}\\}$。`,
      ],
      answer,
      [Q.of(k * a * a * b * b, 4), Q.of(k * a * a * b * b, 2), Q.of(k * a * b, 2)],
      [
        `The integral becomes $\\int_{0}^{${a}} \\int_{0}^{${b}} ${k}uv \\cdot \\frac{1}{2} \\, dv \\, du$. The $u$ integral gives $${Q.of(a * a, 2).toLatex()}$ and the $v$ integral gives $${Q.of(b * b, 2).toLatex()}$, so the result is $${answer.toLatex()}$.`,
        `积分变为 $\\int_{0}^{${a}} \\int_{0}^{${b}} ${k}uv \\cdot \\frac{1}{2} \\, dv \\, du$。对 $u$ 积分得 $${Q.of(a * a, 2).toLatex()}$，对 $v$ 积分得 $${Q.of(b * b, 2).toLatex()}$，所以结果是 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const oppositeDistance = point(
  "the-distance-across-the-axis",
  ["The distance across the axis", "穿过轴的距离"],
  [
    "Two points with the same $r$ and angles differing by $\\pi$ lie on opposite sides of the $z$-axis, so their horizontal separation is $2r$. Adding the difference in height through the Pythagorean theorem gives the distance, without converting to Cartesian coordinates.",
    "$r$ 相同、角度相差 $\\pi$ 的两点位于 $z$ 轴的两侧，所以水平距离是 $2r$。再用勾股定理计入高度差就得到距离，不必转换成直角坐标。",
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
    return ask(
      [
        `Find the distance between the points with cylindrical coordinates $(${r}, ${t1}, ${z1})$ and $(${r}, ${t2}, ${z2})$.`,
        `求柱坐标为 $(${r}, ${t1}, ${z1})$ 和 $(${r}, ${t2}, ${z2})$ 的两点之间的距离。`,
      ],
      answer,
      [b * k, (a + b) * k, (r + b * k) * 2],
      [
        `The angles differ by $\\pi$, so the horizontal separation is $2 \\cdot ${r} = ${a * k}$. The heights differ by $${b * k}$, and the distance is $\\sqrt{${(a * k) ** 2} + ${(b * k) ** 2}} = ${answer}$.`,
        `两个角相差 $\\pi$，所以水平距离是 $2 \\cdot ${r} = ${a * k}$。高度差是 $${b * k}$，距离是 $\\sqrt{${(a * k) ** 2} + ${(b * k) ** 2}} = ${answer}$。`,
      ],
    );
  },
);

const offAxisCylinder = point(
  "a-cylinder-whose-axis-is-not-the-z-axis",
  ["A cylinder whose axis is not the z-axis", "轴不是 z 轴的圆柱"],
  [
    "The equation $r = p\\cos\\theta + q\\sin\\theta$ looks unlike a cylinder, but multiplying by $r$ gives $x^{2} + y^{2} = px + qy$. Completing the square shows a circular cylinder through the $z$-axis, with radius $\\frac{1}{2}\\sqrt{p^{2} + q^{2}}$.",
    "方程 $r = p\\cos\\theta + q\\sin\\theta$ 看起来不像圆柱，但两边乘以 $r$ 得 $x^{2} + y^{2} = px + qy$。配方后可知，这是过 $z$ 轴的圆柱，半径为 $\\frac{1}{2}\\sqrt{p^{2} + q^{2}}$。",
  ],
  (rng) => {
    const [a, b, c] = rng.pick(triples);
    const u = rng.int(1, 3);
    const p = 2 * a * u * rng.pick([-1, 1]);
    const q = 2 * b * u * rng.pick([-1, 1]);
    const answer = c * u;
    const eq = poly([p, "\\cos\\theta"], [q, "\\sin\\theta"]);
    return ask(
      [
        `The surface with cylindrical equation $r = ${eq}$ is a circular cylinder. Find its radius.`,
        `柱坐标方程 $r = ${eq}$ 表示的曲面是圆柱。求它的半径。`,
      ],
      answer,
      [2 * c * u, (a + b) * u, c * c * u * u],
      [
        `Multiplying by $r$ gives $x^{2} + y^{2} = ${poly([p, "x"], [q, "y"])}$. Completing the square, the radius squared is $${a * u}^{2} + ${b * u}^{2}$, so the radius is $${answer}$.`,
        `两边乘以 $r$，得 $x^{2} + y^{2} = ${poly([p, "x"], [q, "y"])}$。配方后，半径的平方是 $${a * u}^{2} + ${b * u}^{2}$，所以半径是 $${answer}$。`,
      ],
    );
  },
);

const sphericalKinds = point(
  "recognizing-planes-and-cylinders-in-spherical-form",
  ["Recognizing planes and cylinders in spherical form", "识别球坐标形式的平面和圆柱"],
  [
    "Since $z = \\rho\\cos\\varphi$ and $r = \\rho\\sin\\varphi$, the equation $\\rho = a\\sec\\varphi$ is a plane and $\\rho = a\\csc\\varphi$ is a cylinder. And $\\rho = 2a\\cos\\varphi$ becomes $x^{2} + y^{2} + z^{2} = 2az$ after multiplying by $\\rho$, a sphere not centered at the origin.",
    "由于 $z = \\rho\\cos\\varphi$，$r = \\rho\\sin\\varphi$，方程 $\\rho = a\\sec\\varphi$ 是平面，$\\rho = a\\csc\\varphi$ 是圆柱。而 $\\rho = 2a\\cos\\varphi$ 两边乘以 $\\rho$ 后变成 $x^{2} + y^{2} + z^{2} = 2az$，是球心不在原点的球面。",
  ],
  (rng) => {
    const a = rng.int(1, 9);
    const kind = rng.int(0, 3);
    const eq = [`${a}\\sec\\varphi`, `${a}\\csc\\varphi`, `${2 * a}\\cos\\varphi`, `${a}`][kind] as string;
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
    const why = whys[kind] as Pair;
    return choose(
      rng,
      [`Which surface has the spherical equation $\\rho = ${eq}$?`, `球坐标方程 $\\rho = ${eq}$ 表示哪个曲面？`],
      correct,
      options.filter((o) => o !== correct),
      why,
    );
  },
);

const zSquaredEllipsoid = point(
  "a-nonconstant-integrand-over-an-ellipsoid",
  ["A nonconstant integrand over an ellipsoid", "椭球上的非常数被积函数"],
  [
    "Scaling an ellipsoid to the unit ball multiplies volume by $pqr$, and the integrand must be rewritten too: $z^{2}$ becomes $r^{2}w^{2}$. Over the unit ball, symmetry gives $\\iiint w^{2}\\,dV = \\frac{1}{3}\\iiint \\rho^{2}\\,dV = \\frac{4\\pi}{15}$.",
    "把椭球缩放成单位球，体积乘以 $pqr$，被积函数也必须改写：$z^{2}$ 变成 $r^{2}w^{2}$。在单位球上，由对称性得 $\\iiint w^{2}\\,dV = \\frac{1}{3}\\iiint \\rho^{2}\\,dV = \\frac{4\\pi}{15}$。",
  ],
  (rng) => {
    const p = rng.int(1, 5);
    const q = rng.int(1, 5);
    const r = rng.int(2, 5);
    const answer = Q.of(4 * p * q * r ** 3, 15);
    return ask(
      [
        `Find $\\frac{1}{\\pi}\\iiint_{E} z^{2}\\,dV$, where $E$ is the solid ellipsoid $\\frac{x^{2}}{${p * p}} + \\frac{y^{2}}{${q * q}} + \\frac{z^{2}}{${r * r}} \\le 1$.`,
        `求 $\\frac{1}{\\pi}\\iiint_{E} z^{2}\\,dV$，其中 $E$ 是实心椭球 $\\frac{x^{2}}{${p * p}} + \\frac{y^{2}}{${q * q}} + \\frac{z^{2}}{${r * r}} \\le 1$。`,
      ],
      answer,
      [Q.of(4 * p * q * r, 15), Q.of(4 * p * q * r * r, 15), Q.of(4 * p * q * r ** 3, 3)],
      [
        `With $x = ${p}u$, $y = ${q}v$, $z = ${r}w$, the Jacobian is $${p * q * r}$ and $z^{2} = ${r * r}w^{2}$. Over the unit ball the integral of $w^{2}$ is $\\frac{4\\pi}{15}$, so the value is $${answer.toLatex()}$.`,
        `令 $x = ${p}u$，$y = ${q}v$，$z = ${r}w$，雅可比行列式是 $${p * q * r}$，且 $z^{2} = ${r * r}w^{2}$。在单位球上，$w^{2}$ 的积分是 $\\frac{4\\pi}{15}$，所以结果是 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const selfCrossing = point(
  "finding-where-a-curve-crosses-itself",
  ["Finding where a curve crosses itself", "求曲线自交的位置"],
  [
    "A curve is not simple if two different parameter values give the same point. When $x(t)$ is even and $y(t)$ is odd, the values $t$ and $-t$ automatically share $x$, so they give one point exactly when $y(t) = 0$. The root $t = 0$ does not count, since $t$ and $-t$ agree there.",
    "如果两个不同的参数值给出同一点，曲线就不是简单曲线。当 $x(t)$ 是偶函数、$y(t)$ 是奇函数时，$t$ 和 $-t$ 的 $x$ 自动相同，所以当且仅当 $y(t) = 0$ 时它们给出同一点。根 $t = 0$ 不算，因为此时 $t$ 和 $-t$ 相同。",
  ],
  (rng) => {
    const a = rng.int(1, 9);
    const c = nz(rng, 5);
    const x = poly([1, "t^{2}"], [-a * a, ""]);
    const y = poly([c, "t^{3}"], [-c * a * a, "t"]);
    return ask(
      [
        `The curve $\\mathbf{r}(t) = (${x}, ${y})$ crosses itself where $\\mathbf{r}(t) = \\mathbf{r}(-t)$ for some $t > 0$. Find this $t$.`,
        `曲线 $\\mathbf{r}(t) = (${x}, ${y})$ 在某个 $t > 0$ 处满足 $\\mathbf{r}(t) = \\mathbf{r}(-t)$，这是它的自交点。求这个 $t$。`,
      ],
      a,
      [a * a, 2 * a, 0],
      [
        `The first coordinate is even in $t$, and the second is odd, so we need $${y} = 0$. The positive root is $t = ${a}$, and both parameter values give the origin.`,
        `第一个坐标是 $t$ 的偶函数，第二个是奇函数，所以需要 $${y} = 0$。正根是 $t = ${a}$，两个参数值都对应原点。`,
      ],
    );
  },
);

const segmentIn3d = point(
  "a-scalar-line-integral-along-a-segment-in-space",
  ["A scalar line integral along a segment in space", "空间线段上的标量线积分"],
  [
    "In space, the length element of a segment comes from all three coordinate differences. Parametrizing by $t$ from $0$ to $1$ makes $ds$ equal to the full length times $dt$, even when the integrand depends on only one of the coordinates.",
    "在空间中，线段的长度元由三个坐标差共同决定。用 $t$ 从 $0$ 到 $1$ 参数化，$ds$ 等于全长乘以 $dt$，即使被积函数只依赖一个坐标也是这样。",
  ],
  (rng) => {
    const [a, b, c, h] = rng.pick(quads);
    const u = rng.int(1, 3);
    const k = rng.int(1, 9);
    const answer = Q.of(k * c * h * u * u, 2);
    return ask(
      [
        `Evaluate $\\int_{C} ${poly([k, "z"])}\\,ds$ along the segment from the origin to $(${a * u}, ${b * u}, ${c * u})$.`,
        `求 $\\int_{C} ${poly([k, "z"])}\\,ds$，其中 $C$ 是从原点到 $(${a * u}, ${b * u}, ${c * u})$ 的线段。`,
      ],
      answer,
      [Q.of(k * c * u * u, 2), k * c * h * u * u, Q.of(k * (a + b + c) * h * u * u, 2)],
      [
        `The length is $\\sqrt{${(a * u) ** 2} + ${(b * u) ** 2} + ${(c * u) ** 2}} = ${h * u}$, and $z = ${c * u}t$. So the integral is $\\int_{0}^{1} ${k} \\cdot ${c * u}t \\cdot ${h * u} \\, dt = ${answer.toLatex()}$.`,
        `线段长度是 $\\sqrt{${(a * u) ** 2} + ${(b * u) ** 2} + ${(c * u) ** 2}} = ${h * u}$，且 $z = ${c * u}t$。所以积分是 $\\int_{0}^{1} ${k} \\cdot ${c * u}t \\cdot ${h * u} \\, dt = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const averageOnCurve = point(
  "the-average-value-along-a-curve",
  ["The average value along a curve", "沿曲线的平均值"],
  [
    "The average of $f$ along a curve of length $L$ is $\\frac{1}{L}\\int_{C} f\\,ds$. It is the constant that gives the same line integral as $f$, so subtracting it from $f$ gives a function whose line integral over $C$ is zero.",
    "$f$ 沿长度为 $L$ 的曲线的平均值是 $\\frac{1}{L}\\int_{C} f\\,ds$。它是与 $f$ 有相同线积分的常数，所以从 $f$ 中减去它，得到的函数在 $C$ 上的线积分为零。",
  ],
  (rng) => {
    const L = rng.int(2, 12);
    const I = nz(rng, 40);
    const answer = Q.of(I, L);
    return ask(
      [
        `A curve $C$ has length $${L}$, and $\\int_{C} f\\,ds = ${I}$. Find the constant $k$ such that $\\int_{C} (f - k)\\,ds = 0$.`,
        `曲线 $C$ 的长度是 $${L}$，且 $\\int_{C} f\\,ds = ${I}$。求常数 $k$，使 $\\int_{C} (f - k)\\,ds = 0$。`,
      ],
      answer,
      [I, I * L, Q.of(L, I)],
      [
        `$\\int_{C} (f - k)\\,ds = ${I} - ${L}k$, since a constant integrates to itself times the length. Setting this to zero gives $k = ${answer.toLatex()}$.`,
        `$\\int_{C} (f - k)\\,ds = ${I} - ${L}k$，因为常数的积分等于它乘以长度。令它为零，得 $k = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const alongParabola = point(
  "a-line-integral-along-a-parabola",
  ["A line integral along a parabola", "沿抛物线的线积分"],
  [
    "On a curved graph $y = g(x)$, the factor $\\sqrt{1 + g'(x)^{2}}$ changes along the path, so it stays inside the integral. On $y = \\frac{x^{2}}{2}$ it is $\\sqrt{1 + x^{2}}$, and an integrand with a factor of $x$ makes the substitution work.",
    "在曲线 $y = g(x)$ 上，因子 $\\sqrt{1 + g'(x)^{2}}$ 沿路径变化，所以要留在积分号内。在 $y = \\frac{x^{2}}{2}$ 上它是 $\\sqrt{1 + x^{2}}$，被积函数含因子 $x$ 时可以用换元法。",
  ],
  (rng) => {
    const [a, b, c] = rng.pick(triples);
    const k = rng.int(1, 12);
    const X = Q.of(a, b);
    const answer = Q.of(k * (c ** 3 - b ** 3), 3 * b ** 3);
    return ask(
      [
        `Evaluate $\\int_{C} ${poly([k, "x"])}\\,ds$ along $y = \\frac{x^{2}}{2}$ from $x = 0$ to $x = ${X.toLatex()}$.`,
        `求 $\\int_{C} ${poly([k, "x"])}\\,ds$，其中 $C$ 是 $y = \\frac{x^{2}}{2}$ 上从 $x = 0$ 到 $x = ${X.toLatex()}$ 的一段。`,
      ],
      answer,
      [Q.of(k * c ** 3, 3 * b ** 3), Q.of(k * a * a, 2 * b * b), Q.of(k * (c ** 3 - b ** 3), b ** 3)],
      [
        `$ds = \\sqrt{1 + x^{2}}\\,dx$, and the integral is $${k} \\cdot \\frac{1}{3}\\left[(1 + x^{2})^{3/2}\\right]$ from $0$. At the upper limit $1 + x^{2} = ${Q.of(c * c, b * b).toLatex()}$, whose root is $${Q.of(c, b).toLatex()}$, so the value is $${answer.toLatex()}$.`,
        `$ds = \\sqrt{1 + x^{2}}\\,dx$，积分是 $${k} \\cdot \\frac{1}{3}\\left[(1 + x^{2})^{3/2}\\right]$，下限为 $0$。在上限处 $1 + x^{2} = ${Q.of(c * c, b * b).toLatex()}$，其平方根是 $${Q.of(c, b).toLatex()}$，所以结果是 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const powerCurveInY = point(
  "a-curve-in-y-with-a-simple-length-element",
  ["A curve in y with a simple length element", "长度元简单的 y 的函数曲线"],
  [
    "For $x = h(y)$ the length element is $\\sqrt{1 + h'(y)^{2}}\\,dy$, with the derivative taken in $y$. The curve $x = \\frac{2}{3}y^{3/2}$ is a standard case, as $h'(y)^{2} = y$ and the element becomes $\\sqrt{1 + y}\\,dy$, which integrates directly.",
    "对 $x = h(y)$，长度元是 $\\sqrt{1 + h'(y)^{2}}\\,dy$，导数对 $y$ 求。曲线 $x = \\frac{2}{3}y^{3/2}$ 是标准情形，因为 $h'(y)^{2} = y$，长度元变为 $\\sqrt{1 + y}\\,dy$，可以直接积分。",
  ],
  (rng) => {
    const n = rng.int(2, 6);
    const k = rng.int(1, 9);
    const answer = Q.of(2 * k * (n ** 3 - 1), 3);
    return ask(
      [
        `Evaluate $\\int_{C} ${k}\\,ds$ along $x = \\frac{2}{3}y^{3/2}$ from $y = 0$ to $y = ${n * n - 1}$.`,
        `求 $\\int_{C} ${k}\\,ds$，其中 $C$ 是 $x = \\frac{2}{3}y^{3/2}$ 上从 $y = 0$ 到 $y = ${n * n - 1}$ 的一段。`,
      ],
      answer,
      [k * (n * n - 1), Q.of(2 * k * n ** 3, 3), Q.of(k * (n ** 3 - 1), 3)],
      [
        `$\\frac{dx}{dy} = y^{1/2}$, so $ds = \\sqrt{1 + y}\\,dy$. Then $\\int_{0}^{${n * n - 1}} ${k}\\sqrt{1 + y} \\, dy = ${k} \\cdot \\frac{2}{3}(${n}^{3} - 1) = ${answer.toLatex()}$.`,
        `$\\frac{dx}{dy} = y^{1/2}$，所以 $ds = \\sqrt{1 + y}\\,dy$。于是 $\\int_{0}^{${n * n - 1}} ${k}\\sqrt{1 + y} \\, dy = ${k} \\cdot \\frac{2}{3}(${n}^{3} - 1) = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const offCenterCircle = point(
  "a-circle-that-is-not-centered-at-the-origin",
  ["A circle that is not centered at the origin", "圆心不在原点的圆"],
  [
    "On a circle with center $(a, b)$, writing $x = a + r\\cos t$ makes the cosine term integrate to zero over a full turn. So the integral of $x$ is $a$ times the length of the circle. Treating the center as the origin would lose this term.",
    "在圆心为 $(a, b)$ 的圆上，写 $x = a + r\\cos t$，余弦项在一整圈上的积分为零。所以 $x$ 的积分等于 $a$ 乘以圆的周长。如果把圆心当成原点，就会丢失这一项。",
  ],
  (rng) => {
    const a = nz(rng, 6);
    const b = nz(rng, 6);
    const r = rng.int(1, 6);
    const k = nz(rng, 5);
    const m = nz(rng, 9);
    const answer = 2 * r * (k * a + m);
    const f = poly([k, "x"], [m, ""]);
    const circle = `(${poly([1, "x"], [-a, ""])})^{2} + (${poly([1, "y"], [-b, ""])})^{2} = ${r * r}`;
    return ask(
      [
        `$C$ is the circle $${circle}$. Find $\\frac{1}{\\pi}\\oint_{C} (${f})\\,ds$.`,
        `$C$ 是圆 $${circle}$。求 $\\frac{1}{\\pi}\\oint_{C} (${f})\\,ds$。`,
      ],
      answer,
      [2 * r * m, r * (k * a + m), 2 * r * r * (k * a + m)],
      [
        `The cosine term vanishes over a full turn, so the integrand averages $${poly([k * a + m, ""])}$, its value at the center. The length is $${2 * r}\\pi$, so the result is $${answer}$.`,
        `余弦项在一整圈上为零，所以被积函数的平均值是 $${poly([k * a + m, ""])}$，即它在圆心处的值。周长是 $${2 * r}\\pi$，所以结果是 $${answer}$。`,
      ],
    );
  },
);

const quarterEllipse = point(
  "a-quarter-of-an-ellipse-by-substitution",
  ["A quarter of an ellipse by substitution", "用换元法求四分之一椭圆"],
  [
    "Arc length on an ellipse has no elementary form, but with $x = a\\cos t$ and $y = b\\sin t$ an integrand $xy$ supplies the derivative of $u = a^{2}\\sin^{2}t + b^{2}\\cos^{2}t$. So the substitution in $u$ removes the root, and the integral is elementary.",
    "椭圆的弧长没有初等形式，但用 $x = a\\cos t$，$y = b\\sin t$ 时，被积函数 $xy$ 正好提供 $u = a^{2}\\sin^{2}t + b^{2}\\cos^{2}t$ 的导数。所以对 $u$ 换元后根号消失，积分是初等的。",
  ],
  (rng) => {
    const [a, b] = rng.sample([1, 2, 3, 4, 5, 6], 2) as [number, number];
    const k = rng.int(1, 6);
    const answer = Q.of(k * a * b * (a * a + a * b + b * b), 3 * (a + b));
    return ask(
      [
        `Evaluate $\\int_{C} ${poly([k, "xy"])}\\,ds$, where $C$ is the first-quadrant arc of $\\frac{x^{2}}{${a * a}} + \\frac{y^{2}}{${b * b}} = 1$.`,
        `求 $\\int_{C} ${poly([k, "xy"])}\\,ds$，其中 $C$ 是 $\\frac{x^{2}}{${a * a}} + \\frac{y^{2}}{${b * b}} = 1$ 在第一象限的弧。`,
      ],
      answer,
      [Q.of(k * a * b, 2), Q.of(k * a * b * (a + b), 3), Q.of(k * a * b * (a * a + b * b), 3 * (a + b))],
      [
        `With $u = ${a * a}\\sin^{2}t + ${b * b}\\cos^{2}t$, the integral becomes a multiple of $\\int \\sqrt{u}\\,du$ from $${b * b}$ to $${a * a}$. It equals $\\frac{${k * a * b}(${a}^{3} - ${b}^{3})}{3(${a}^{2} - ${b}^{2})} = ${answer.toLatex()}$.`,
        `令 $u = ${a * a}\\sin^{2}t + ${b * b}\\cos^{2}t$，积分变成 $\\int \\sqrt{u}\\,du$ 从 $${b * b}$ 到 $${a * a}$ 的倍数。结果是 $\\frac{${k * a * b}(${a}^{3} - ${b}^{3})}{3(${a}^{2} - ${b}^{2})} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const weightedAverage = point(
  "the-average-over-two-pieces-of-different-length",
  ["The average over two pieces of different length", "两段不等长曲线上的平均值"],
  [
    "Line integrals add over pieces, but averages do not. The average over a union is a weighted mean, with the lengths as weights, so a long piece counts for more. Adding the two averages and dividing by two is correct only for equal lengths.",
    "线积分可以按段相加，平均值却不行。并集上的平均值是以长度为权的加权平均，所以长的一段影响更大。把两个平均值相加再除以二，只在长度相等时才正确。",
  ],
  (rng) => {
    const L1 = rng.int(1, 9);
    const L2 = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== L1));
    const m1 = rng.int(-9, 9);
    const m2 = rng.pick([-8, -5, -3, -1, 2, 4, 7, 10].filter((v) => v !== m1));
    const total = L1 * m1 + L2 * m2;
    const answer = Q.of(total, L1 + L2);
    return ask(
      [
        `A wire consists of a piece of length $${L1}$ with average density $${m1}$ and a piece of length $${L2}$ with average density $${m2}$. Find the average density of the whole wire.`,
        `一根导线由两段组成：长度 $${L1}$、平均密度 $${m1}$ 的一段，和长度 $${L2}$、平均密度 $${m2}$ 的一段。求整根导线的平均密度。`,
      ],
      answer,
      [Q.of(m1 + m2, 2), total, Q.of(m1 + m2, L1 + L2)],
      [
        `The integrals over the pieces add to $${L1} \\cdot ${m1 < 0 ? `(${m1})` : m1} + ${L2} \\cdot ${m2 < 0 ? `(${m2})` : m2} = ${total}$, and the total length is $${L1 + L2}$. The average is $${answer.toLatex()}$.`,
        `两段上的积分之和是 $${L1} \\cdot ${m1 < 0 ? `(${m1})` : m1} + ${L2} \\cdot ${m2 < 0 ? `(${m2})` : m2} = ${total}$，总长度是 $${L1 + L2}$。平均值是 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const polarCircle = point(
  "a-circle-through-the-pole",
  ["A circle through the pole", "过极点的圆"],
  [
    "In polar form $ds = \\sqrt{r^{2} + (r')^{2}}\\,d\\theta$. On $r = 2a\\cos\\theta$, the two squares add to $4a^{2}$, so $ds = 2a\\,d\\theta$ is constant, and writing $ds = r\\,d\\theta$ would be wrong. A single turn takes $\\theta$ from $-\\frac{\\pi}{2}$ to $\\frac{\\pi}{2}$.",
    "在极坐标中 $ds = \\sqrt{r^{2} + (r')^{2}}\\,d\\theta$。在 $r = 2a\\cos\\theta$ 上，两个平方之和是 $4a^{2}$，所以 $ds = 2a\\,d\\theta$ 是常数，写成 $ds = r\\,d\\theta$ 是错的。走一圈时 $\\theta$ 从 $-\\frac{\\pi}{2}$ 变到 $\\frac{\\pi}{2}$。",
  ],
  (rng) => {
    const a = rng.int(1, 9);
    const k = rng.int(1, 12);
    const answer = 2 * k * a * a;
    return ask(
      [
        `$C$ is the circle $r = ${2 * a}\\cos\\theta$, $-\\frac{\\pi}{2} \\le \\theta \\le \\frac{\\pi}{2}$. Find $\\frac{1}{\\pi}\\oint_{C} ${poly([k, "x"])}\\,ds$.`,
        `$C$ 是圆 $r = ${2 * a}\\cos\\theta$，$-\\frac{\\pi}{2} \\le \\theta \\le \\frac{\\pi}{2}$。求 $\\frac{1}{\\pi}\\oint_{C} ${poly([k, "x"])}\\,ds$。`,
      ],
      answer,
      [k * a * a, 4 * k * a * a, 2 * k * a],
      [
        `Here $ds = ${2 * a}\\,d\\theta$ and $x = r\\cos\\theta = ${2 * a}\\cos^{2}\\theta$. Since $\\int \\cos^{2}\\theta\\,d\\theta = \\frac{\\pi}{2}$ on this interval, the value divided by $\\pi$ is $${answer}$.`,
        `这里 $ds = ${2 * a}\\,d\\theta$，$x = r\\cos\\theta = ${2 * a}\\cos^{2}\\theta$。由于在这个区间上 $\\int \\cos^{2}\\theta\\,d\\theta = \\frac{\\pi}{2}$，所以除以 $\\pi$ 后的值是 $${answer}$。`,
      ],
    );
  },
);

const areaFromYdx = point(
  "the-sign-of-a-closed-y-dx-integral",
  ["The sign of a closed y dx integral", "闭合 y dx 积分的符号"],
  [
    "Around a counterclockwise closed curve, $\\oint y\\,dx$ equals minus the enclosed area, while $\\oint x\\,dy$ equals plus the area. Along the top the curve moves left, so $dx$ is negative where $y$ is largest, and this explains the minus sign.",
    "沿逆时针闭曲线，$\\oint y\\,dx$ 等于所围面积的相反数，而 $\\oint x\\,dy$ 等于面积。在顶部曲线向左走，所以在 $y$ 最大的地方 $dx$ 为负，这解释了负号。",
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
    return ask(
      [
        `$C$ is the counterclockwise boundary of ${shape[0]}. Evaluate $\\oint_{C} ${poly([k, "y"])}\\,dx$.`,
        `$C$ 是${shape[1]}的逆时针边界。求 $\\oint_{C} ${poly([k, "y"])}\\,dx$。`,
      ],
      answer,
      [answer.neg(), answer.mul(Q.of(2)), 0],
      [
        `$\\oint_{C} y\\,dx$ is minus the area, and the area is $${area.toLatex()}$. Multiplying by $${k}$ gives $${answer.toLatex()}$.`,
        `$\\oint_{C} y\\,dx$ 等于面积的相反数，面积是 $${area.toLatex()}$。乘以 $${k}$，得 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const verticalPiece = point(
  "a-vertical-piece-contributes-nothing-to-dx",
  ["A vertical piece contributes nothing to dx", "竖直段对 dx 积分没有贡献"],
  [
    "On a vertical segment $x$ is constant, so $dx = 0$ and the piece contributes nothing to a $dx$ integral, whatever the integrand is. On a horizontal piece $y$ is constant, and that value is the one that goes into the integrand.",
    "在竖直线段上 $x$ 是常数，所以 $dx = 0$，无论被积函数是什么，这一段对 $dx$ 积分都没有贡献。在水平段上 $y$ 是常数，被积函数中要代入的就是这个值。",
  ],
  (rng) => {
    const a = rng.int(-6, 6);
    const b = rng.int(-6, 6);
    const d = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].filter((v) => v !== b));
    const e = rng.pick([-7, -5, -3, -1, 1, 2, 4, 6, 8].filter((v) => v !== a));
    const k = nz(rng, 5);
    const answer = k * d * (e - a);
    return ask(
      [
        `$C$ runs along segments from $(${a}, ${b})$ to $(${a}, ${d})$ and then to $(${e}, ${d})$. Evaluate $\\int_{C} ${poly([k, "y"])}\\,dx$.`,
        `$C$ 沿线段从 $(${a}, ${b})$ 到 $(${a}, ${d})$，再到 $(${e}, ${d})$。求 $\\int_{C} ${poly([k, "y"])}\\,dx$。`,
      ],
      answer,
      [k * b * (e - a), -answer, 0],
      [
        `On the vertical piece $dx = 0$. On the horizontal piece $y = ${d}$, and $x$ changes by $${e - a}$, so the integral is $${k} \\cdot ${d < 0 ? `(${d})` : d} \\cdot ${e - a < 0 ? `(${e - a})` : e - a} = ${answer}$.`,
        `在竖直段 $dx = 0$。在水平段 $y = ${d}$，$x$ 的变化量是 $${e - a}$，所以积分是 $${k} \\cdot ${d < 0 ? `(${d})` : d} \\cdot ${e - a < 0 ? `(${e - a})` : e - a} = ${answer}$。`,
      ],
    );
  },
);

const quarterCircleSum = point(
  "p-dx-plus-q-dy-on-a-quarter-circle",
  ["P dx plus Q dy on a quarter circle", "四分之一圆上的 P dx + Q dy"],
  [
    "On a circle, $dx$ and $dy$ both come from the parametrization, and $dx = -r\\sin t\\,dt$ carries a minus sign that is easily lost. Then $y\\,dx$ gives $-r^{2}\\sin^{2}t\\,dt$, and $x\\,dy$ gives $r^{2}\\cos^{2}t\\,dt$, and each square averages one half over a quarter turn.",
    "在圆上，$dx$ 和 $dy$ 都来自参数化，$dx = -r\\sin t\\,dt$ 带有容易丢失的负号。于是 $y\\,dx$ 给出 $-r^{2}\\sin^{2}t\\,dt$，$x\\,dy$ 给出 $r^{2}\\cos^{2}t\\,dt$，每个平方在四分之一圈上的平均值都是二分之一。",
  ],
  (rng) => {
    const r = rng.int(1, 6);
    const a = nz(rng, 9);
    const b = rng.pick([-8, -5, -2, 1, 3, 6, 9].filter((v) => v !== a));
    const answer = Q.of(r * r * (b - a), 4);
    const form = poly([a, "y\\,dx"], [b, "x\\,dy"]);
    return ask(
      [
        `$C$ is $x = ${r}\\cos t$, $y = ${r}\\sin t$, $0 \\le t \\le \\frac{\\pi}{2}$. Find $\\frac{1}{\\pi}\\int_{C} ${form}$.`,
        `$C$ 是 $x = ${r}\\cos t$，$y = ${r}\\sin t$，$0 \\le t \\le \\frac{\\pi}{2}$。求 $\\frac{1}{\\pi}\\int_{C} ${form}$。`,
      ],
      answer,
      [answer.neg(), Q.of(r * r * (a + b), 4), Q.of(r * r * (b - a), 2)],
      [
        `The integrand becomes $${r * r}(${poly([b, "\\cos^{2}t"], [-a, "\\sin^{2}t"])})\\,dt$. Each square integrates to $\\frac{\\pi}{4}$ over the quarter turn, so the value divided by $\\pi$ is $${answer.toLatex()}$.`,
        `被积式变为 $${r * r}(${poly([b, "\\cos^{2}t"], [-a, "\\sin^{2}t"])})\\,dt$。每个平方在四分之一圈上的积分是 $\\frac{\\pi}{4}$，所以除以 $\\pi$ 后的值是 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const generalSegment = point(
  "p-dx-plus-q-dy-on-a-slanted-segment",
  ["P dx plus Q dy on a slanted segment", "斜线段上的 P dx + Q dy"],
  [
    "On a slanted segment both $x$ and $y$ change. Since a linear function on a segment averages to the mean of its end values, $\\int y\\,dx$ is the change in $x$ times the mean of the values of $y$. Using only the starting value of $y$ is a common error.",
    "在斜线段上，$x$ 和 $y$ 都变化。由于线性函数在线段上的平均值等于两端值的平均数，所以 $\\int y\\,dx$ 等于 $x$ 的变化量乘以 $y$ 两端值的平均数。只用 $y$ 的起始值是常见错误。",
  ],
  (rng) => {
    const x1 = rng.int(-5, 5);
    const y1 = rng.int(-5, 5);
    const dx = nz(rng, 6);
    const dy = nz(rng, 6);
    const x2 = x1 + dx;
    const y2 = y1 + dy;
    const k = nz(rng, 5);
    const m = nz(rng, 5);
    const part1 = Q.of(k * dx * (y1 + y2), 2);
    const part2 = Q.of(m * dy * (x1 + x2), 2);
    const answer = part1.add(part2);
    return ask(
      [
        `Evaluate $\\int_{C} ${poly([k, "y\\,dx"], [m, "x\\,dy"])}$ along the segment from $(${x1}, ${y1})$ to $(${x2}, ${y2})$.`,
        `求 $\\int_{C} ${poly([k, "y\\,dx"], [m, "x\\,dy"])}$，其中 $C$ 是从 $(${x1}, ${y1})$ 到 $(${x2}, ${y2})$ 的线段。`,
      ],
      answer,
      [Q.of(k * dx * y1 + m * dy * x1), Q.of(k * dy * (x1 + x2), 2).add(Q.of(m * dx * (y1 + y2), 2)), answer.neg()],
      [
        `$y$ averages $${Q.of(y1 + y2, 2).toLatex()}$ while $x$ changes by $${dx}$, and $x$ averages $${Q.of(x1 + x2, 2).toLatex()}$ while $y$ changes by $${dy}$. The two terms are $${part1.toLatex()}$ and $${part2.toLatex()}$, with sum $${answer.toLatex()}$.`,
        `$x$ 变化 $${dx}$ 时，$y$ 的平均值是 $${Q.of(y1 + y2, 2).toLatex()}$；$y$ 变化 $${dy}$ 时，$x$ 的平均值是 $${Q.of(x1 + x2, 2).toLatex()}$。两项是 $${part1.toLatex()}$ 和 $${part2.toLatex()}$，和为 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const twistedCubic = point(
  "a-vector-line-integral-along-a-space-curve",
  ["A vector line integral along a space curve", "沿空间曲线的向量线积分"],
  [
    "Along a space curve the dot product has three terms, and each component of $\\mathbf{F}$ pairs with the derivative of the matching coordinate. On $(t, t^{2}, t^{3})$ the derivatives are $1$, $2t$ and $3t^{2}$, and forgetting them is the usual error.",
    "沿空间曲线，点积有三项，$\\mathbf{F}$ 的每个分量与相应坐标的导数相乘。在 $(t, t^{2}, t^{3})$ 上，导数是 $1$、$2t$ 和 $3t^{2}$，漏掉它们是常见错误。",
  ],
  (rng) => {
    const a = nz(rng, 9);
    const b = nz(rng, 9);
    const c = nz(rng, 9);
    const answer = Q.of(a, 3)
      .add(Q.of(2 * b, 5))
      .add(Q.of(3 * c, 4));
    const noDerivative = Q.of(a, 3).add(Q.of(b, 4)).add(Q.of(c, 2));
    const F = br(poly([a, "y"]), poly([b, "z"]), poly([c, "x"]));
    return ask(
      [
        `Evaluate $\\int_{C} \\mathbf{F} \\cdot d\\mathbf{r}$ for $\\mathbf{F} = ${F}$ along $\\mathbf{r}(t) = \\langle t, t^{2}, t^{3} \\rangle$, $0 \\le t \\le 1$.`,
        `求 $\\int_{C} \\mathbf{F} \\cdot d\\mathbf{r}$，其中 $\\mathbf{F} = ${F}$，路径是 $\\mathbf{r}(t) = \\langle t, t^{2}, t^{3} \\rangle$，$0 \\le t \\le 1$。`,
      ],
      answer,
      [noDerivative, answer.neg(), a + b + c],
      [
        `The integrand is $${poly([a, "t^{2}"], [2 * b, "t^{4}"], [3 * c, "t^{3}"])}$. Integrating from $0$ to $1$ gives $${Q.of(a, 3).toLatex()}$, $${Q.of(2 * b, 5).toLatex()}$ and $${Q.of(3 * c, 4).toLatex()}$, with sum $${answer.toLatex()}$.`,
        `被积函数是 $${poly([a, "t^{2}"], [2 * b, "t^{4}"], [3 * c, "t^{3}"])}$。从 $0$ 到 $1$ 积分得 $${Q.of(a, 3).toLatex()}$、$${Q.of(2 * b, 5).toLatex()}$ 和 $${Q.of(3 * c, 4).toLatex()}$，和为 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const graphInY = point(
  "a-vector-line-integral-along-a-graph-x-in-terms-of-y",
  ["A vector line integral along a graph of x in terms of y", "沿 x 关于 y 的图像的向量线积分"],
  [
    "If a curve is a graph $x = g(y)$, then $y$ is the natural parameter, and $dx = g'(y)\\,dy$. Everything must be written in $y$ before integrating, including the term in $dx$, whose factor from the derivative is easily left out.",
    "如果曲线是图像 $x = g(y)$，$y$ 就是自然的参数，且 $dx = g'(y)\\,dy$。积分前一切都要写成 $y$ 的式子，包括 $dx$ 的项，其中来自导数的因子容易漏掉。",
  ],
  (rng) => {
    const p = nz(rng, 6);
    const q = nz(rng, 6);
    const Y = rng.int(1, 6);
    const answer = Q.of((2 * p + q) * Y ** 3, 3);
    return ask(
      [
        `Evaluate $\\int_{C} \\mathbf{F} \\cdot d\\mathbf{r}$ for $\\mathbf{F} = ${br(poly([p, "y"]), poly([q, "x"]))}$ along $x = y^{2}$ from $(0, 0)$ to $(${Y * Y}, ${Y})$.`,
        `求 $\\int_{C} \\mathbf{F} \\cdot d\\mathbf{r}$，其中 $\\mathbf{F} = ${br(poly([p, "y"]), poly([q, "x"]))}$，路径是 $x = y^{2}$ 上从 $(0, 0)$ 到 $(${Y * Y}, ${Y})$ 的一段。`,
      ],
      answer,
      [Q.of((p + q) * Y ** 3, 3), Q.of((2 * q + p) * Y ** 3, 3), Q.of((2 * p + q) * Y ** 2, 2)],
      [
        `With $dx = 2y\\,dy$, the first term gives $${poly([2 * p, "y^{2}"])}\\,dy$ and the second gives $${poly([q, "y^{2}"])}\\,dy$. Integrating $${poly([2 * p + q, "y^{2}"])}$ from $0$ to $${Y}$ gives $${answer.toLatex()}$.`,
        `由 $dx = 2y\\,dy$，第一项给出 $${poly([2 * p, "y^{2}"])}\\,dy$，第二项给出 $${poly([q, "y^{2}"])}\\,dy$。把 $${poly([2 * p + q, "y^{2}"])}$ 从 $0$ 积到 $${Y}$，得 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const tangentialComponent = point(
  "work-from-the-tangential-component",
  ["Work from the tangential component", "由切向分量求功"],
  [
    "Since $d\\mathbf{r} = \\mathbf{T}\\,ds$, a line integral of a vector field is the scalar integral of the tangential component. Reversing the curve reverses $\\mathbf{T}$, so the tangential component changes sign, and this is why the vector integral changes sign but a scalar one does not.",
    "由于 $d\\mathbf{r} = \\mathbf{T}\\,ds$，向量场的线积分是切向分量的标量积分。曲线反向时 $\\mathbf{T}$ 反向，切向分量变号，这就是向量线积分变号而标量线积分不变号的原因。",
  ],
  (rng) => {
    const c = nz(rng, 9);
    const L = rng.int(2, 12);
    const answer = -c * L;
    return ask(
      [
        `Along a curve $C$ of length $${L}$, the tangential component $\\mathbf{F} \\cdot \\mathbf{T}$ equals $${c}$ at every point. Find $\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r}$.`,
        `沿长度为 $${L}$ 的曲线 $C$，切向分量 $\\mathbf{F} \\cdot \\mathbf{T}$ 处处等于 $${c}$。求 $\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r}$。`,
      ],
      answer,
      [c * L, c, -c],
      [
        `On $C$ the integral is $${c} \\cdot ${L}$, the tangential component times the length. Reversing the direction changes its sign, which gives $${answer}$.`,
        `在 $C$ 上，积分是 $${c} \\cdot ${L}$，即切向分量乘以长度。方向相反时符号改变，所以结果是 $${answer}$。`,
      ],
    );
  },
);

const potentialChain = point(
  "chaining-values-of-a-potential",
  ["Chaining values of a potential", "把势函数的值串联起来"],
  [
    "The fundamental theorem says that a gradient integral from $A$ to $B$ is $f(B) - f(A)$. So integrals act as differences, and several of them can be chained to find a value of $f$ at a new point, as long as the direction of each path is respected.",
    "基本定理指出，从 $A$ 到 $B$ 的梯度积分是 $f(B) - f(A)$。所以积分相当于差值，可以把几个积分串联起来求 $f$ 在新点的值，只要注意每条路径的方向。",
  ],
  (rng) => {
    const v = rng.int(-20, 20);
    const i1 = nz(rng, 20);
    const i2 = nz(rng, 20);
    const answer = v + i1 - i2;
    return ask(
      [
        `$f(A) = ${v}$, $\\int_{C_{1}} \\nabla f \\cdot d\\mathbf{r} = ${i1}$ for a path $C_{1}$ from $A$ to $B$, and $\\int_{C_{2}} \\nabla f \\cdot d\\mathbf{r} = ${i2}$ for a path $C_{2}$ from $D$ to $B$. Find $f(D)$.`,
        `$f(A) = ${v}$，对从 $A$ 到 $B$ 的路径 $C_{1}$，$\\int_{C_{1}} \\nabla f \\cdot d\\mathbf{r} = ${i1}$；对从 $D$ 到 $B$ 的路径 $C_{2}$，$\\int_{C_{2}} \\nabla f \\cdot d\\mathbf{r} = ${i2}$。求 $f(D)$。`,
      ],
      answer,
      [v + i1 + i2, i1 - i2, v - i1 + i2],
      [
        `$f(B) = ${v} + ${i1 < 0 ? `(${i1})` : i1} = ${v + i1}$. Since $f(B) - f(D) = ${i2}$, we get $f(D) = ${v + i1} - ${i2 < 0 ? `(${i2})` : i2} = ${answer}$.`,
        `$f(B) = ${v} + ${i1 < 0 ? `(${i1})` : i1} = ${v + i1}$。由 $f(B) - f(D) = ${i2}$，得 $f(D) = ${v + i1} - ${i2 < 0 ? `(${i2})` : i2} = ${answer}$。`,
      ],
    );
  },
);

const twoPaths = point(
  "two-paths-make-a-closed-loop",
  ["Two paths make a closed loop", "两条路径组成闭合回路"],
  [
    "Going along $C_{1}$ and returning along $C_{2}$ backwards makes a closed loop, whose integral is the difference of the two path integrals. For a conservative field this difference must be zero, so unequal values on two paths with the same endpoints prove the field is not conservative.",
    "沿 $C_{1}$ 前进，再沿 $C_{2}$ 反向返回，构成闭合回路，其积分等于两个路径积分之差。对保守场，这个差必须为零，所以起点和终点相同的两条路径给出不同的值，就证明这个场不是保守场。",
  ],
  (rng) => {
    const p = rng.int(-20, 20);
    const q = rng.pick([-17, -11, -6, -2, 3, 7, 13, 19].filter((v) => v !== p));
    const answer = p - q;
    return ask(
      [
        `$C_{1}$ and $C_{2}$ both go from $A$ to $B$, with $\\int_{C_{1}} \\mathbf{F} \\cdot d\\mathbf{r} = ${p}$ and $\\int_{C_{2}} \\mathbf{F} \\cdot d\\mathbf{r} = ${q}$. Find the integral around the loop that follows $C_{1}$ and then $C_{2}$ backwards.`,
        `$C_{1}$ 和 $C_{2}$ 都从 $A$ 到 $B$，且 $\\int_{C_{1}} \\mathbf{F} \\cdot d\\mathbf{r} = ${p}$，$\\int_{C_{2}} \\mathbf{F} \\cdot d\\mathbf{r} = ${q}$。求先沿 $C_{1}$、再沿 $C_{2}$ 反向所成回路上的积分。`,
      ],
      answer,
      [p + q, q - p, 0],
      [
        `Reversing $C_{2}$ changes the sign of its integral, so the loop gives $${p} - ${q < 0 ? `(${q})` : q} = ${answer}$. This is not zero, so $\\mathbf{F}$ is not conservative.`,
        `$C_{2}$ 反向使积分变号，所以回路上的积分是 $${p} - ${q < 0 ? `(${q})` : q} = ${answer}$。它不为零，所以 $\\mathbf{F}$ 不是保守场。`,
      ],
    );
  },
);

const findKThenIntegrate = point(
  "making-a-field-conservative-and-then-integrating",
  ["Making a field conservative and then integrating", "先使场成为保守场再积分"],
  [
    "An unknown coefficient in a field is fixed by the condition $P_{y} = Q_{x}$. Only then does a potential exist, and the line integral follows from its values at the ends. The term $2axy$ in $P$ and the term $ax^{2}$ in $Q$ come from the same $ax^{2}y$ in $f$.",
    "场中的未知系数由条件 $P_{y} = Q_{x}$ 确定。只有这时势函数才存在，线积分由它在两端的值得到。$P$ 中的 $2axy$ 和 $Q$ 中的 $ax^{2}$ 来自 $f$ 中同一项 $ax^{2}y$。",
  ],
  (rng) => {
    const a = nz(rng, 4);
    const p = nz(rng, 6);
    const q = nz(rng, 6);
    const X = nz(rng, 3);
    const Y = nz(rng, 4);
    const answer = a * X * X * Y + p * X + q * Y;
    const F = br(poly([2 * a, "xy"], [p, ""]), poly([1, "kx^{2}"], [q, ""]));
    return ask(
      [
        `$\\mathbf{F} = ${F}$ is conservative for exactly one value of $k$. For that $k$, find $\\int_{C} \\mathbf{F} \\cdot d\\mathbf{r}$ along any path from $(0, 0)$ to $(${X}, ${Y})$.`,
        `$\\mathbf{F} = ${F}$ 只在 $k$ 取某一个值时是保守场。对这个 $k$，沿任一条从 $(0, 0)$ 到 $(${X}, ${Y})$ 的路径，求 $\\int_{C} \\mathbf{F} \\cdot d\\mathbf{r}$。`,
      ],
      answer,
      [p * X + q * Y, 2 * a * X * X * Y + p * X + q * Y, a * X * X * Y + p * X],
      [
        `$P_{y} = ${2 * a}x$ and $Q_{x} = 2kx$, so $k = ${a}$. A potential is $f = ${poly([a, "x^{2}y"], [p, "x"], [q, "y"])}$, and its value at the end point, minus $0$ at the start, is $${answer}$.`,
        `$P_{y} = ${2 * a}x$，$Q_{x} = 2kx$，所以 $k = ${a}$。势函数是 $f = ${poly([a, "x^{2}y"], [p, "x"], [q, "y"])}$，它在终点的值减去起点的 $0$，等于 $${answer}$。`,
      ],
    );
  },
);

const endpointsFromParametrization = point(
  "endpoints-given-by-a-parametrization",
  ["Endpoints given by a parametrization", "由参数式给出的端点"],
  [
    "With a potential, the integral along a parametrized space curve needs only the two endpoints, so the path itself never has to be differentiated. Substituting the parameter values gives those endpoints, including a start that need not be the origin.",
    "有势函数时，沿参数化空间曲线的积分只需要两个端点，所以根本不必对路径求导。代入参数值就得到这两个端点，起点不一定是原点。",
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
    return ask(
      [
        `Evaluate $\\int_{C} \\mathbf{F} \\cdot d\\mathbf{r}$ for $\\mathbf{F} = ${F}$ along $\\mathbf{r}(t) = \\langle t^{2}, 1 - t, t^{3} \\rangle$, $0 \\le t \\le ${T}$.`,
        `求 $\\int_{C} \\mathbf{F} \\cdot d\\mathbf{r}$，其中 $\\mathbf{F} = ${F}$，路径是 $\\mathbf{r}(t) = \\langle t^{2}, 1 - t, t^{3} \\rangle$，$0 \\le t \\le ${T}$。`,
      ],
      answer,
      [c * Z === answer ? a * X * Z + c * Z : c * Z, a * X * Z + c * Z, -answer],
      [
        `A potential is $f = ${poly([a, "xyz"], [c, "z"])}$. The path runs from $(0, 1, 0)$, where $f = 0$, to $(${X}, ${Y}, ${Z})$, where $f = ${answer}$. So the integral is $${answer}$.`,
        `势函数是 $f = ${poly([a, "xyz"], [c, "z"])}$。路径从 $(0, 1, 0)$ 到 $(${X}, ${Y}, ${Z})$，在起点 $f = 0$，在终点 $f = ${answer}$。所以积分是 $${answer}$。`,
      ],
    );
  },
);

const turningPoint = point(
  "the-turning-point-of-a-spring",
  ["The turning point of a spring", "弹簧的折返点"],
  [
    "At a turning point the speed is zero, so all the mechanical energy is potential. For $U = \\frac{1}{2}kx^{2}$ and a start at the origin with speed $v$, equating $\\frac{1}{2}mv^{2}$ with $\\frac{1}{2}kA^{2}$ gives the amplitude $A$, without knowing the motion in time.",
    "在折返点速度为零，所以全部机械能都是势能。对 $U = \\frac{1}{2}kx^{2}$，从原点以速度 $v$ 出发，令 $\\frac{1}{2}mv^{2}$ 等于 $\\frac{1}{2}kA^{2}$，就得到振幅 $A$，不必知道运动随时间的变化。",
  ],
  (rng) => {
    const m = rng.int(1, 6);
    const n = rng.int(2, 5);
    const A = rng.int(1, 6);
    const v = n * A;
    const k = m * n * n;
    return ask(
      [
        `A particle of mass $${m}$ moves under $U(x) = ${poly([Q.of(k, 2), "x^{2}"])}$ alone, and has speed $${v}$ at the origin. Find the largest value of $x$ it reaches.`,
        `质量为 $${m}$ 的质点只受势能 $U(x) = ${poly([Q.of(k, 2), "x^{2}"])}$ 的作用，在原点的速度是 $${v}$。求它能达到的最大 $x$。`,
      ],
      A,
      [v, v * v, Q.of(v * v, k)],
      [
        `The energy at the origin is $\\frac{1}{2} \\cdot ${m} \\cdot ${v}^{2}$, all kinetic. At the turning point it is $${poly([Q.of(k, 2), "A^{2}"])}$, all potential. So $A^{2} = ${A * A}$ and $A = ${A}$.`,
        `在原点的能量是 $\\frac{1}{2} \\cdot ${m} \\cdot ${v}^{2}$，全部是动能。在折返点它是 $${poly([Q.of(k, 2), "A^{2}"])}$，全部是势能。所以 $A^{2} = ${A * A}$，$A = ${A}$。`,
      ],
    );
  },
);

const ellipseNormal = point(
  "the-outward-normal-on-an-ellipse",
  ["The outward normal on an ellipse", "椭圆上的外法向量"],
  [
    "The outward normal on $x^{2} + qy^{2} = c$ is along the gradient $\\langle 2x, 2qy \\rangle$, not along the position vector. These agree only on a circle, so an ellipse has outward normals that do not point straight away from the center, except at its vertices.",
    "$x^{2} + qy^{2} = c$ 的外法向量沿梯度 $\\langle 2x, 2qy \\rangle$，而不是沿位置向量。两者只在圆上才一致，所以椭圆的外法向量并不背离中心，顶点处除外。",
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
    return ask(
      [
        `Find the ${name[0]} component of the outward unit normal to $x^{2} + ${q}y^{2} = ${c}$ at $(${x0}, ${y0})$.`,
        `求 $x^{2} + ${q}y^{2} = ${c}$ 在 $(${x0}, ${y0})$ 处的外单位法向量的${name[1]}个分量。`,
      ],
      answer,
      [answer.neg(), first ? Q.of(s2 * b, h) : Q.of(s1 * a, h), first ? Q.of(s1 * a, b) : Q.of(s2 * b, a)],
      [
        `The gradient is $${br(2 * x0, 2 * q * y0)}$, a multiple of $${br(s1 * a, s2 * b)}$, which has length $${h}$. So the unit normal is $${br(Q.of(s1 * a, h).toLatex(), Q.of(s2 * b, h).toLatex())}$, and the component is $${answer.toLatex()}$.`,
        `梯度是 $${br(2 * x0, 2 * q * y0)}$，是 $${br(s1 * a, s2 * b)}$ 的倍数，这个向量的长度是 $${h}$。所以单位法向量是 $${br(Q.of(s1 * a, h).toLatex(), Q.of(s2 * b, h).toLatex())}$，该分量是 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const constantFluxArc = point(
  "the-flux-of-a-constant-field-across-an-arc",
  ["The flux of a constant field across an arc", "常向量场穿过弧的通量"],
  [
    "The flux across a curve is $\\int_{C} P\\,dy - Q\\,dx$. For a constant field this depends only on the changes in $x$ and $y$, so any arc between the same endpoints gives the same flux. The shape of the curve does not need to be used at all.",
    "穿过曲线的通量是 $\\int_{C} P\\,dy - Q\\,dx$。对常向量场，它只依赖 $x$ 和 $y$ 的变化量，所以端点相同的任何弧都给出相同的通量。根本用不到曲线的形状。",
  ],
  (rng) => {
    const p = nz(rng, 6);
    const q = nz(rng, 6);
    const X = nz(rng, 4);
    const answer = p * X * X - q * X;
    return ask(
      [
        `Find the flux $\\int_{C} P\\,dy - Q\\,dx$ of $\\mathbf{F} = ${br(p, q)}$ across the arc of $y = x^{2}$ from $(0, 0)$ to $(${X}, ${X * X})$.`,
        `求 $\\mathbf{F} = ${br(p, q)}$ 穿过 $y = x^{2}$ 上从 $(0, 0)$ 到 $(${X}, ${X * X})$ 的弧的通量 $\\int_{C} P\\,dy - Q\\,dx$。`,
      ],
      answer,
      [p * X - q * X * X, p * X * X + q * X, -answer],
      [
        `$P$ and $Q$ are constant, so the integral is $P$ times the change in $y$, minus $Q$ times the change in $x$. This is $${p} \\cdot ${X * X} - ${q < 0 ? `(${q})` : q} \\cdot ${X < 0 ? `(${X})` : X} = ${answer}$.`,
        `$P$ 和 $Q$ 是常数，所以积分等于 $P$ 乘以 $y$ 的变化量，减去 $Q$ 乘以 $x$ 的变化量。即 $${p} \\cdot ${X * X} - ${q < 0 ? `(${q})` : q} \\cdot ${X < 0 ? `(${X})` : X} = ${answer}$。`,
      ],
    );
  },
);

const oneEdge = point(
  "the-flux-through-one-edge",
  ["The flux through one edge", "穿过一条边的通量"],
  [
    "Green's theorem gives the flux across a whole closed curve, so a single edge has to be done directly. On the top edge of a rectangle the outward normal is $\\langle 0, 1 \\rangle$, so only $Q$ enters, evaluated with $y$ fixed at the height of that edge.",
    "格林定理给出的是穿过整条闭曲线的通量，所以单独一条边必须直接计算。在矩形的上边，外法向量是 $\\langle 0, 1 \\rangle$，所以只有 $Q$ 起作用，并且 $y$ 固定为这条边的高度。",
  ],
  (rng) => {
    const p = nz(rng, 6);
    const q = nz(rng, 6);
    const r = nz(rng, 6);
    const W = rng.int(1, 6);
    const H = rng.int(1, 6);
    const answer = Q.of(q * H * W).add(Q.of(r * W * W, 2));
    const F = br(poly([p, "x"]), poly([r, "x"], [q, "y"]));
    return ask(
      [
        `Find the outward flux of $\\mathbf{F} = ${F}$ through the top edge of the rectangle $[0, ${W}] \\times [0, ${H}]$ only.`,
        `只求 $\\mathbf{F} = ${F}$ 穿过矩形 $[0, ${W}] \\times [0, ${H}]$ 上边的外通量。`,
      ],
      answer,
      [answer.neg(), q * H * W, Q.of((p + q) * W * H)],
      [
        `On the top edge $y = ${H}$ and $\\mathbf{n} = \\langle 0, 1 \\rangle$, so $\\mathbf{F} \\cdot \\mathbf{n} = ${poly([r, "x"], [q * H, ""])}$. Integrating from $x = 0$ to $x = ${W}$ gives $${answer.toLatex()}$.`,
        `在上边 $y = ${H}$，$\\mathbf{n} = \\langle 0, 1 \\rangle$，所以 $\\mathbf{F} \\cdot \\mathbf{n} = ${poly([r, "x"], [q * H, ""])}$。从 $x = 0$ 积到 $x = ${W}$，得 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const circulationEqualsFlux = point(
  "when-circulation-equals-flux",
  ["When circulation equals flux", "环量等于通量的情形"],
  [
    "For a linear field, the circulation around a simple closed curve is $Q_{x} - P_{y}$ times the area, and the outward flux is $P_{x} + Q_{y}$ times the area. They measure different things, and they use different entries of the coefficients, so a field can have one without the other.",
    "对线性场，沿简单闭曲线的环量是 $Q_{x} - P_{y}$ 乘以面积，外通量是 $P_{x} + Q_{y}$ 乘以面积。它们度量不同的量，用到的系数也不同，所以场可以有其中一个而没有另一个。",
  ],
  (rng) => {
    const a = nz(rng, 9);
    const b = nz(rng, 9);
    const d = nz(rng, 9);
    const answer = a + d + b;
    const F = br(poly([a, "x"], [b, "y"]), poly([1, "kx"], [d, "y"]));
    return ask(
      [
        `For $\\mathbf{F} = ${F}$, the counterclockwise circulation equals the outward flux around every simple closed curve. Find $k$.`,
        `对 $\\mathbf{F} = ${F}$，沿每条简单闭曲线的逆时针环量都等于外通量。求 $k$。`,
      ],
      answer,
      [a + d - b, b - a - d, a + d],
      [
        `The circulation density is $k - ${b < 0 ? `(${b})` : b}$ and the flux density is $${a} + ${d < 0 ? `(${d})` : d} = ${a + d}$. They must be equal, so $k = ${answer}$.`,
        `环量密度是 $k - ${b < 0 ? `(${b})` : b}$，通量密度是 $${a} + ${d < 0 ? `(${d})` : d} = ${a + d}$。二者必须相等，所以 $k = ${answer}$。`,
      ],
    );
  },
);

const sectorGreen = point(
  "a-sector-with-a-curl-that-depends-on-r",
  ["A sector with a curl that depends on r", "旋度依赖 r 的扇形"],
  [
    "When the curl depends on the distance from the origin, Green's theorem gives a polar double integral. The area element is $r\\,dr\\,d\\theta$, so a curl of $kr$ produces $kr^{2}$ in the integrand, and the angular width of the sector supplies a simple factor.",
    "当旋度依赖到原点的距离时，格林定理给出极坐标下的二重积分。面积元是 $r\\,dr\\,d\\theta$，所以旋度 $kr$ 在被积函数中产生 $kr^{2}$，扇形的角宽度提供一个简单的因子。",
  ],
  (rng) => {
    const k = rng.int(1, 9);
    const R = rng.int(1, 6);
    const m = rng.int(1, 4);
    const top = m === 1 ? "\\pi" : `\\frac{\\pi}{${m}}`;
    const answer = Q.of(k * R ** 3, 3 * m);
    return ask(
      [
        `$C$ is the positively oriented boundary of the sector $0 \\le r \\le ${R}$, $0 \\le \\theta \\le ${top}$, and $\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = ${k}\\sqrt{x^{2} + y^{2}}$. Find $\\frac{1}{\\pi}\\oint_{C} P\\,dx + Q\\,dy$.`,
        `$C$ 是扇形 $0 \\le r \\le ${R}$，$0 \\le \\theta \\le ${top}$ 的正向边界，且 $\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = ${k}\\sqrt{x^{2} + y^{2}}$。求 $\\frac{1}{\\pi}\\oint_{C} P\\,dx + Q\\,dy$。`,
      ],
      answer,
      [Q.of(k * R * R, 2 * m), Q.of(k * R ** 3, m), Q.of(k * R ** 3, 2 * m)],
      [
        `By Green's theorem the integral is $\\int_{0}^{${top}} \\int_{0}^{${R}} ${k}r \\cdot r \\, dr \\, d\\theta$. The radial part gives $${Q.of(k * R ** 3, 3).toLatex()}$, and the angle gives $${top}$, so dividing by $\\pi$ leaves $${answer.toLatex()}$.`,
        `由格林定理，积分是 $\\int_{0}^{${top}} \\int_{0}^{${R}} ${k}r \\cdot r \\, dr \\, d\\theta$。径向部分给出 $${Q.of(k * R ** 3, 3).toLatex()}$，角度给出 $${top}$，除以 $\\pi$ 后得 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const areaFromFlux = point(
  "an-area-from-a-measured-flux",
  ["An area from a measured flux", "由通量求面积"],
  [
    "A field with constant divergence turns the flux form of Green's theorem into a way to measure area. For $\\langle ax, by \\rangle$, the flux across any simple closed curve is $a + b$ times the enclosed area, whatever the shape of the curve is.",
    "散度为常数的场，把格林定理的通量形式变成测量面积的方法。对 $\\langle ax, by \\rangle$，穿过任何简单闭曲线的通量都是 $a + b$ 乘以所围面积，与曲线的形状无关。",
  ],
  (rng) => {
    const a = rng.int(1, 6);
    const b = rng.int(1, 6);
    const A = rng.int(1, 12);
    const V = (a + b) * A;
    return ask(
      [
        `The outward flux of $\\mathbf{F} = ${br(poly([a, "x"]), poly([b, "y"]))}$ across a simple closed curve is $${V}$. Find the area it encloses.`,
        `$\\mathbf{F} = ${br(poly([a, "x"]), poly([b, "y"]))}$ 穿过一条简单闭曲线的外通量是 $${V}$。求它所围的面积。`,
      ],
      A,
      [V, Q.of(V, 2), Q.of(V, a * b)],
      [
        `The divergence is $${a} + ${b} = ${a + b}$, a constant, so the flux is $${a + b}$ times the area. Therefore the area is $\\frac{${V}}{${a + b}} = ${A}$.`,
        `散度是 $${a} + ${b} = ${a + b}$，为常数，所以通量等于 $${a + b}$ 乘以面积。因此面积是 $\\frac{${V}}{${a + b}} = ${A}$。`,
      ],
    );
  },
);

const twoHoles = point(
  "a-region-with-two-holes",
  ["A region with two holes", "有两个洞的区域"],
  [
    "With holes, the outer circulation equals the sum of the circulations around the holes plus the double integral of the curl over the region between them. Each hole adds a term, and the area in the double integral is the outer area minus the areas of all the holes.",
    "有洞时，外边界的环量等于绕各洞的环量之和，加上洞之间区域上旋度的二重积分。每个洞都增加一项，二重积分中的面积是外部面积减去所有洞的面积。",
  ],
  (rng) => {
    const A1 = rng.int(1, 4);
    const A2 = rng.int(1, 4);
    const A0 = A1 + A2 + rng.int(1, 12);
    const k = nz(rng, 5);
    const i1 = nz(rng, 12);
    const i2 = nz(rng, 12);
    const answer = i1 + i2 + k * (A0 - A1 - A2);
    return ask(
      [
        `A region has outer boundary $C$ enclosing area $${A0}$, and two holes with boundaries $C_{1}$, $C_{2}$ of areas $${A1}$, $${A2}$. On the region, $Q_{x} - P_{y} = ${k}$. All three curves run counterclockwise, with $\\oint_{C_{1}} \\mathbf{F} \\cdot d\\mathbf{r} = ${i1}$ and $\\oint_{C_{2}} \\mathbf{F} \\cdot d\\mathbf{r} = ${i2}$. Find $\\oint_{C} \\mathbf{F} \\cdot d\\mathbf{r}$.`,
        `一个区域的外边界 $C$ 所围面积是 $${A0}$，有两个洞，边界是 $C_{1}$、$C_{2}$，面积是 $${A1}$、$${A2}$。在该区域上 $Q_{x} - P_{y} = ${k}$。三条曲线都沿逆时针方向，且 $\\oint_{C_{1}} \\mathbf{F} \\cdot d\\mathbf{r} = ${i1}$，$\\oint_{C_{2}} \\mathbf{F} \\cdot d\\mathbf{r} = ${i2}$。求 $\\oint_{C} \\mathbf{F} \\cdot d\\mathbf{r}$。`,
      ],
      answer,
      [i1 + i2 + k * A0, k * (A0 - A1 - A2), i1 - i2 + k * (A0 - A1 - A2)],
      [
        `The region has area $${A0 - A1 - A2}$, so the curl term is $${k * (A0 - A1 - A2)}$. Adding the circulations around the two holes gives $${answer}$.`,
        `区域的面积是 $${A0 - A1 - A2}$，所以旋度项是 $${k * (A0 - A1 - A2)}$。加上绕两个洞的环量，得 $${answer}$。`,
      ],
    );
  },
);

const singularPoint = point(
  "where-the-normal-vector-disappears",
  ["Where the normal vector disappears", "法向量消失的位置"],
  [
    "The tangent plane formula uses $\\mathbf{r}_{u} \\times \\mathbf{r}_{v}$ as the normal. Where this cross product is zero, the parametrization is not regular and the formula gives no plane at all. To find such a point, set all three components of the cross product to zero.",
    "切平面公式用 $\\mathbf{r}_{u} \\times \\mathbf{r}_{v}$ 作法向量。在这个叉积为零的地方，参数化不正则，公式给不出任何平面。要找这样的点，就令叉积的三个分量都为零。",
  ],
  (rng) => {
    const a = nz(rng, 6);
    const b = nz(rng, 6);
    const askU = rng.bool();
    const answer = askU ? a : b;
    const name = askU ? "u" : "v";
    const uTerm = poly([1, "u"], [-a, ""]);
    const vTerm = poly([1, "v"], [-b, ""]);
    return ask(
      [
        `For $\\mathbf{r}(u, v) = \\langle u, (${vTerm})^{2}, (${uTerm})(${vTerm}) \\rangle$, $\\mathbf{r}_{u} \\times \\mathbf{r}_{v}$ is zero at exactly one point. Find its value of $${name}$.`,
        `对 $\\mathbf{r}(u, v) = \\langle u, (${vTerm})^{2}, (${uTerm})(${vTerm}) \\rangle$，$\\mathbf{r}_{u} \\times \\mathbf{r}_{v}$ 恰在一点为零。求该点的 $${name}$ 值。`,
      ],
      answer,
      [-answer, askU ? b : a, a * b],
      [
        `$\\mathbf{r}_{u} \\times \\mathbf{r}_{v} = \\langle -2(${vTerm})^{2}, -(${uTerm}), 2(${vTerm}) \\rangle$. All three components vanish only at $u = ${a}$ and $v = ${b}$, so $${name} = ${answer}$.`,
        `$\\mathbf{r}_{u} \\times \\mathbf{r}_{v} = \\langle -2(${vTerm})^{2}, -(${uTerm}), 2(${vTerm}) \\rangle$。三个分量只在 $u = ${a}$，$v = ${b}$ 时都为零，所以 $${name} = ${answer}$。`,
      ],
    );
  },
);

const ellipticCone = point(
  "the-parameter-of-a-point-on-an-elliptic-cone",
  ["The parameter of a point on an elliptic cone", "椭圆锥上一点的参数"],
  [
    "An elliptic cone is parametrized by $\\langle au\\cos v, bu\\sin v, u \\rangle$, where dividing the first two coordinates by $a$ and $b$ removes the scaling. Then $\\cos^{2}v + \\sin^{2}v = 1$ gives $u$, and this is also the height of the point above the vertex.",
    "椭圆锥的参数式是 $\\langle au\\cos v, bu\\sin v, u \\rangle$，把前两个坐标分别除以 $a$ 和 $b$ 可以去掉缩放。再由 $\\cos^{2}v + \\sin^{2}v = 1$ 得 $u$，它也是该点在顶点上方的高度。",
  ],
  (rng) => {
    const [A, B, C] = rng.pick(triples);
    const a = rng.int(2, 5);
    const b = rng.int(2, 5);
    const k = rng.int(1, 3);
    const x = a * A * k * rng.pick([-1, 1]);
    const y = b * B * k * rng.pick([-1, 1]);
    const answer = C * k;
    return ask(
      [
        `The cone $\\mathbf{r}(u, v) = \\langle ${a}u\\cos v, ${b}u\\sin v, u \\rangle$, $u \\ge 0$, contains a point with $x = ${x}$ and $y = ${y}$. Find $u$ at this point.`,
        `锥面 $\\mathbf{r}(u, v) = \\langle ${a}u\\cos v, ${b}u\\sin v, u \\rangle$，$u \\ge 0$，上有一点满足 $x = ${x}$，$y = ${y}$。求该点的 $u$。`,
      ],
      answer,
      [(A + B) * k, a * C * k, answer * answer],
      [
        `$u\\cos v = ${Q.of(x, a).toLatex()}$ and $u\\sin v = ${Q.of(y, b).toLatex()}$. Squaring and adding gives $u^{2} = ${answer * answer}$, and with $u \\ge 0$ we get $u = ${answer}$.`,
        `$u\\cos v = ${Q.of(x, a).toLatex()}$，$u\\sin v = ${Q.of(y, b).toLatex()}$。平方后相加，得 $u^{2} = ${answer * answer}$，由 $u \\ge 0$ 得 $u = ${answer}$。`,
      ],
    );
  },
);

const twoSheets = point(
  "the-gap-between-the-sheets-of-a-hyperboloid",
  ["The gap between the sheets of a hyperboloid", "双叶双曲面两叶之间的间隙"],
  [
    "A hyperboloid of two sheets has $\\cosh u$ in its parametrization for $z$, and since $\\cosh u \\ge 1$, the value $z = c\\cosh u$ is never smaller than $c$. So one parametrization covers only the upper sheet, and there is a gap of $2c$ between the sheets.",
    "双叶双曲面的 $z$ 参数式含 $\\cosh u$，由于 $\\cosh u \\ge 1$，$z = c\\cosh u$ 不会小于 $c$。所以一个参数式只覆盖上叶，两叶之间有 $2c$ 的间隙。",
  ],
  (rng) => {
    const a = rng.int(2, 9);
    const c = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== a));
    const answer = 2 * c;
    return ask(
      [
        `Find the distance between the two sheets of the hyperboloid $\\frac{x^{2} + y^{2}}{${a * a}} - \\frac{z^{2}}{${c * c}} = -1$, measured along the $z$-axis.`,
        `求双曲面 $\\frac{x^{2} + y^{2}}{${a * a}} - \\frac{z^{2}}{${c * c}} = -1$ 的两叶之间沿 $z$ 轴的距离。`,
      ],
      answer,
      [c, 2 * a, 2 * c * c],
      [
        `On the $z$-axis, $x = y = 0$, which gives $z^{2} = ${c * c}$. So the sheets cross the axis at $z = ${c}$ and $z = ${-c}$, and the distance between them is $${answer}$.`,
        `在 $z$ 轴上 $x = y = 0$，得 $z^{2} = ${c * c}$。所以两叶与轴交于 $z = ${c}$ 和 $z = ${-c}$，它们之间的距离是 $${answer}$。`,
      ],
    );
  },
);

const torusArea = point(
  "the-surface-area-of-a-torus",
  ["The surface area of a torus", "环面的面积"],
  [
    "Revolving a curve about an axis gives an area equal to the length of the curve times the distance traveled by its centroid. For a circle of radius $r$ whose center is at distance $R$ from the axis, this gives $2\\pi r \\cdot 2\\pi R$, which is why $\\pi^{2}$ appears.",
    "曲线绕轴旋转所得的面积，等于曲线的长度乘以其形心走过的距离。对半径为 $r$、圆心到轴的距离为 $R$ 的圆，结果是 $2\\pi r \\cdot 2\\pi R$，这就是出现 $\\pi^{2}$ 的原因。",
  ],
  (rng) => {
    const r = rng.int(1, 6);
    const R = r + rng.int(1, 6);
    const answer = 4 * R * r;
    return ask(
      [
        `The circle $x^{2} + (y - ${R})^{2} = ${r * r}$ is revolved about the $x$-axis. Find the area of the resulting torus divided by $\\pi^{2}$.`,
        `圆 $x^{2} + (y - ${R})^{2} = ${r * r}$ 绕 $x$ 轴旋转。求所得环面的面积除以 $\\pi^{2}$ 的值。`,
      ],
      answer,
      [2 * R * r, 4 * r * r, 4 * R * R],
      [
        `The circle has length $${2 * r}\\pi$, and its center travels $${2 * R}\\pi$ around the axis. The area is the product, so dividing by $\\pi^{2}$ gives $${answer}$.`,
        `圆的周长是 $${2 * r}\\pi$，圆心绕轴走过 $${2 * R}\\pi$。面积是两者之积，除以 $\\pi^{2}$ 得 $${answer}$。`,
      ],
    );
  },
);

const paraboloidSurface = point(
  "a-surface-integral-over-a-paraboloid",
  ["A surface integral over a paraboloid", "抛物面上的曲面积分"],
  [
    "On a curved graph, the area factor $\\sqrt{1 + g_{x}^{2} + g_{y}^{2}}$ varies from point to point. On $z = \\frac{x^{2} + y^{2}}{2}$ it equals $\\sqrt{1 + r^{2}}$, and polar coordinates supply the factor $r$ that makes the integral elementary.",
    "在曲面图像上，面积因子 $\\sqrt{1 + g_{x}^{2} + g_{y}^{2}}$ 随点变化。在 $z = \\frac{x^{2} + y^{2}}{2}$ 上，它等于 $\\sqrt{1 + r^{2}}$，极坐标提供的因子 $r$ 使积分成为初等的。",
  ],
  (rng) => {
    const n = rng.int(2, 6);
    const k = rng.int(1, 9);
    const answer = Q.of(2 * k * (n ** 3 - 1), 3);
    return ask(
      [
        `$S$ is the part of $z = \\frac{x^{2} + y^{2}}{2}$ above the disk $x^{2} + y^{2} \\le ${n * n - 1}$. Find $\\frac{1}{\\pi}\\iint_{S} ${k}\\,dS$.`,
        `$S$ 是 $z = \\frac{x^{2} + y^{2}}{2}$ 在圆盘 $x^{2} + y^{2} \\le ${n * n - 1}$ 上方的部分。求 $\\frac{1}{\\pi}\\iint_{S} ${k}\\,dS$。`,
      ],
      answer,
      [k * (n * n - 1), Q.of(2 * k * n ** 3, 3), Q.of(k * (n ** 3 - 1), 3)],
      [
        `$dS = \\sqrt{1 + r^{2}}\\,r\\,dr\\,d\\theta$. The radial integral is $\\frac{1}{3}(${n}^{3} - 1)$, as $1 + r^{2}$ reaches $${n * n}$. The angle gives $2\\pi$, so the value is $${answer.toLatex()}$.`,
        `$dS = \\sqrt{1 + r^{2}}\\,r\\,dr\\,d\\theta$。径向积分是 $\\frac{1}{3}(${n}^{3} - 1)$，因为 $1 + r^{2}$ 的上限是 $${n * n}$。角度给出 $2\\pi$，所以结果是 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const hemisphereFlux = point(
  "the-flux-through-a-hemisphere",
  ["The flux through a hemisphere", "穿过半球面的通量"],
  [
    "On a sphere of radius $R$ centered at the origin, a radial field $k\\langle x, y, z \\rangle$ is normal to the surface. So its normal component is the constant $kR$, and the flux is this constant times the surface area, without evaluating any cross product.",
    "在圆心位于原点、半径为 $R$ 的球面上，径向场 $k\\langle x, y, z \\rangle$ 垂直于曲面。所以它的法向分量是常数 $kR$，通量等于这个常数乘以曲面面积，不必计算任何叉积。",
  ],
  (rng) => {
    const R = rng.int(1, 6);
    const k = nz(rng, 9);
    const answer = 2 * k * R ** 3;
    return ask(
      [
        `Find $\\frac{1}{\\pi}\\iint_{S} \\mathbf{F} \\cdot d\\mathbf{S}$ for $\\mathbf{F} = ${br(poly([k, "x"]), poly([k, "y"]), poly([k, "z"]))}$, where $S$ is the upper hemisphere of $x^{2} + y^{2} + z^{2} = ${R * R}$, with the outward normal.`,
        `求 $\\frac{1}{\\pi}\\iint_{S} \\mathbf{F} \\cdot d\\mathbf{S}$，其中 $\\mathbf{F} = ${br(poly([k, "x"]), poly([k, "y"]), poly([k, "z"]))}$，$S$ 是 $x^{2} + y^{2} + z^{2} = ${R * R}$ 的上半球面，取外法向。`,
      ],
      answer,
      [4 * k * R ** 3, 2 * k * R * R, k * R ** 3],
      [
        `$\\mathbf{F} \\cdot \\mathbf{n} = ${k * R}$ everywhere, and the hemisphere has area $${2 * R * R}\\pi$. The product divided by $\\pi$ is $${answer}$.`,
        `处处有 $\\mathbf{F} \\cdot \\mathbf{n} = ${k * R}$，半球面的面积是 $${2 * R * R}\\pi$。两者之积除以 $\\pi$ 等于 $${answer}$。`,
      ],
    );
  },
);

const downwardFlux = point(
  "downward-flux-through-a-tilted-plane",
  ["Downward flux through a tilted plane", "穿过斜平面的向下通量"],
  [
    "For a graph $z = g(x, y)$, the upward normal element is $\\langle -g_{x}, -g_{y}, 1 \\rangle\\,dA$. The downward one is its negative. Both the minus signs and the slopes matter: using only the third component of the field would treat the plane as horizontal.",
    "对图像 $z = g(x, y)$，向上的法向面元是 $\\langle -g_{x}, -g_{y}, 1 \\rangle\\,dA$，向下的是它的相反数。负号和斜率都很重要：只用场的第三个分量，等于把平面当作水平面。",
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
    return ask(
      [
        `Find the downward flux of $\\mathbf{F} = ${br(p, q, r)}$ through the part of the plane $z = ${poly([a, "x"], [b, "y"], [c, ""])}$ above $[0, ${W}] \\times [0, ${H}]$.`,
        `求 $\\mathbf{F} = ${br(p, q, r)}$ 向下穿过平面 $z = ${poly([a, "x"], [b, "y"], [c, ""])}$ 在 $[0, ${W}] \\times [0, ${H}]$ 上方部分的通量。`,
      ],
      answer,
      [-answer, -r * W * H, (p * a + q * b + r) * W * H],
      [
        `The downward element is $${br(a, b, -1)}\\,dA$, and its dot product with $\\mathbf{F}$ is $${dot}$. The rectangle has area $${W * H}$, so the flux is $${answer}$.`,
        `向下的面元是 $${br(a, b, -1)}\\,dA$，它与 $\\mathbf{F}$ 的点积是 $${dot}$。矩形面积是 $${W * H}$，所以通量是 $${answer}$。`,
      ],
    );
  },
);

const closedCylinder = point(
  "the-flux-out-of-a-closed-cylinder",
  ["The flux out of a closed cylinder", "穿出闭合圆柱的通量"],
  [
    "A closed cylinder has three faces, and each is handled separately. On the side the normal is radial, on the top it is $\\mathbf{k}$, and on the bottom it is $-\\mathbf{k}$. A face where $z = 0$ gives no flux from a field whose third component is a multiple of $z$.",
    "闭合圆柱有三个面，要分别处理。侧面的法向量沿径向，顶面是 $\\mathbf{k}$，底面是 $-\\mathbf{k}$。对第三个分量是 $z$ 的倍数的场，$z = 0$ 的面没有通量。",
  ],
  (rng) => {
    const R = rng.int(1, 6);
    const h = rng.int(1, 6);
    const k = rng.int(1, 9);
    const answer = R * R * h * (2 + k);
    const F = br("x", "y", poly([k, "z"]));
    return ask(
      [
        `Find $\\frac{1}{\\pi}$ times the outward flux of $\\mathbf{F} = ${F}$ through the closed cylinder $x^{2} + y^{2} \\le ${R * R}$, $0 \\le z \\le ${h}$, using all of its faces.`,
        `用圆柱的所有面，求 $\\mathbf{F} = ${F}$ 穿出闭合圆柱 $x^{2} + y^{2} \\le ${R * R}$，$0 \\le z \\le ${h}$ 的外通量乘以 $\\frac{1}{\\pi}$ 的值。`,
      ],
      answer,
      [k * R * R * h, 2 * R * R * h, 2 * R * R * h * (1 + k)],
      [
        `On the side $\\mathbf{F} \\cdot \\mathbf{n} = ${R}$ over area $${2 * R * h}\\pi$, which gives $${2 * R * R * h}\\pi$. The top gives $${k * h} \\cdot ${R * R}\\pi$ and the bottom gives $0$. Dividing the sum by $\\pi$ gives $${answer}$.`,
        `在侧面 $\\mathbf{F} \\cdot \\mathbf{n} = ${R}$，面积是 $${2 * R * h}\\pi$，得 $${2 * R * R * h}\\pi$。顶面给出 $${k * h} \\cdot ${R * R}\\pi$，底面给出 $0$。总和除以 $\\pi$ 得 $${answer}$。`,
      ],
    );
  },
);

const stoppingDistance = point(
  "a-stopping-distance-from-work-and-energy",
  ["A stopping distance from work and energy", "由功和能求制动距离"],
  [
    "A constant force opposing the motion does negative work equal to the force times the distance. Stopping means that this work removes all the kinetic energy, so the distance is proportional to the square of the speed: twice the speed needs four times the distance.",
    "与运动方向相反的恒力做负功，大小等于力乘以距离。停下来意味着这个功消耗了全部动能，所以距离与速度的平方成正比：速度加倍，需要四倍的距离。",
  ],
  (rng) => {
    const m = rng.int(1, 9);
    const v = rng.int(2, 20);
    const F = rng.int(1, 12);
    const answer = Q.of(m * v * v, 2 * F);
    return ask(
      [
        `An object of mass $${m}$ kg moving at $${v}$ m/s is brought to rest by a constant opposing force of $${F}$ N. Find the distance it travels, in meters.`,
        `质量为 $${m}$ kg、速度为 $${v}$ m/s 的物体，在 $${F}$ N 的恒定阻力作用下停止。求它经过的距离（单位：米）。`,
      ],
      answer,
      [Q.of(m * v, F), Q.of(m * v * v, F), Q.of(v * v, 2 * F)],
      [
        `The kinetic energy is $\\frac{1}{2} \\cdot ${m} \\cdot ${v}^{2} = ${Q.of(m * v * v, 2).toLatex()}$ J, and the force removes $${F}d$ J. Setting them equal gives $d = ${answer.toLatex()}$.`,
        `动能是 $\\frac{1}{2} \\cdot ${m} \\cdot ${v}^{2} = ${Q.of(m * v * v, 2).toLatex()}$ J，阻力消耗 $${F}d$ J。令二者相等，得 $d = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const maxSpeedOnCircle = point(
  "the-greatest-speed-a-force-can-hold-on-a-circle",
  ["The greatest speed a force can hold on a circle", "力能维持圆周运动的最大速度"],
  [
    "Uniform circular motion needs an inward force $mR\\omega^{2}$, equivalently $\\frac{mv^{2}}{R}$. If the inward force has a limit, such as the strength of a string, this limit sets the greatest angular speed, and then the speed follows from $v = R\\omega$.",
    "匀速圆周运动需要向内的力 $mR\\omega^{2}$，也就是 $\\frac{mv^{2}}{R}$。如果向内的力有上限，例如绳子的强度，这个上限就决定最大角速度，再由 $v = R\\omega$ 得到速度。",
  ],
  (rng) => {
    const m = rng.int(1, 5);
    const R = rng.int(1, 6);
    const w = rng.int(2, 9);
    const F = m * R * w * w;
    const answer = w * R;
    return ask(
      [
        `A string that breaks at a tension of $${F}$ N holds a particle of mass $${m}$ kg on a circle of radius $${R}$ m. Find the greatest speed it can have, in m/s.`,
        `一根在张力 $${F}$ N 时会断的绳子，把质量为 $${m}$ kg 的质点维持在半径 $${R}$ m 的圆周上。求它能达到的最大速度（单位：m/s）。`,
      ],
      answer,
      [w, Q.of(F, m), F],
      [
        `$\\frac{${m}v^{2}}{${R}} = ${F}$ gives $v^{2} = ${answer * answer}$, so $v = ${answer}$. The corresponding angular speed is $${w}$ rad/s.`,
        `由 $\\frac{${m}v^{2}}{${R}} = ${F}$ 得 $v^{2} = ${answer * answer}$，所以 $v = ${answer}$。相应的角速度是 $${w}$ rad/s。`,
      ],
    );
  },
);

const massFromTwoAxes = point(
  "the-mass-from-two-parallel-axes",
  ["The mass from two parallel axes", "由两条平行轴求质量"],
  [
    "Applying the parallel axis theorem to two axes and subtracting removes the unknown moment about the center of mass. What remains is $I_{2} - I_{1} = M(d_{2}^{2} - d_{1}^{2})$, which gives the mass. It is the squares of the distances that are subtracted.",
    "对两条轴应用平行轴定理再相减，就消去了关于质心的未知转动惯量。剩下 $I_{2} - I_{1} = M(d_{2}^{2} - d_{1}^{2})$，由此得到质量。相减的是距离的平方。",
  ],
  (rng) => {
    const M = rng.int(1, 9);
    const Ic = rng.int(1, 30);
    const d1 = rng.int(1, 4);
    const d2 = d1 + rng.int(1, 4);
    const I1 = Ic + M * d1 * d1;
    const I2 = Ic + M * d2 * d2;
    const diff = I2 - I1;
    return ask(
      [
        `A body has moment of inertia $${I1}$ about an axis at distance $${d1}$ from its center of mass, and $${I2}$ about a parallel axis at distance $${d2}$. Find its mass.`,
        `一个物体关于到质心距离为 $${d1}$ 的轴的转动惯量是 $${I1}$，关于到质心距离为 $${d2}$ 的平行轴的转动惯量是 $${I2}$。求它的质量。`,
      ],
      M,
      [Q.of(diff, d2 - d1), Q.of(diff, d2 * d2), Q.of(I2, d2 * d2)],
      [
        `Subtracting the two equations of the theorem removes the moment about the center: $${I2} - ${I1} = M(${d2 * d2} - ${d1 * d1})$. So $M = \\frac{${diff}}{${d2 * d2 - d1 * d1}} = ${M}$.`,
        `把定理的两个等式相减，消去关于质心的转动惯量：$${I2} - ${I1} = M(${d2 * d2} - ${d1 * d1})$。所以 $M = \\frac{${diff}}{${d2 * d2 - d1 * d1}} = ${M}$。`,
      ],
    );
  },
);

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
