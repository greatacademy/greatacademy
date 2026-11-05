// Third knowledge points for thin topics of Multivariable Calculus, from vector-valued
// functions to triple integrals: the reverse question, a harder case or a common trap.
// See `deeperMultivariableCalculusThirdPoints`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { paren, poly, Q } from "@ga/subject-math";

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
/** br writes a vector with angle brackets. */
const br = (...entries: readonly (string | number)[]) => `\\langle ${entries.join(", ")} \\rangle`;

const domainCount = point(
  "counting-integers-in-a-domain",
  ["Counting integers in a domain", "数定义域中的整数"],
  [
    "The domain of a vector function is the intersection of the domains of its components. Each component removes something, and a single excluded point inside the interval must be taken away as well, so check the endpoints and the hole separately.",
    "向量函数的定义域是各分量定义域的交集。每个分量都会去掉一部分，区间内被排除的单个点也要去掉，所以要分别检查端点和空洞。",
  ],
  (rng) => {
    const a = rng.int(-9, 0);
    const c = a + rng.int(1, 5);
    const b = c + rng.int(1, 6);
    const answer = b - a - 1;
    const r = br(`\\sqrt{${poly([1, "t"], [-a, ""])}}`, `\\ln(${poly([b, ""], [-1, "t"])})`, `\\frac{1}{${poly([1, "t"], [-c, ""])}}`);
    return ask(
      [`How many integers lie in the domain of $\\mathbf{r}(t) = ${r}$?`, `$\\mathbf{r}(t) = ${r}$ 的定义域中有多少个整数？`],
      answer,
      [b - a, b - a + 1, b - a - 2],
      [
        `The components need $t \\ge ${a}$, $t < ${b}$ and $t \\ne ${c}$. From $${a}$ to $${b - 1}$ there are $${b - a}$ integers, and removing $${c}$ leaves $${answer}$.`,
        `各分量要求 $t \\ge ${a}$，$t < ${b}$，$t \\ne ${c}$。从 $${a}$ 到 $${b - 1}$ 有 $${b - a}$ 个整数，去掉 $${c}$ 后剩下 $${answer}$ 个。`,
      ],
    );
  },
);

const smoothJoin = point(
  "the-slope-that-makes-a-join-differentiable",
  ["The slope that makes a join differentiable", "使连接处可导的斜率"],
  [
    "A vector function is differentiable exactly when each component is. For a component made of two pieces, the values must agree at the join and the derivatives must agree too, and the second condition fixes the slope of a linear piece.",
    "向量函数可导，当且仅当每个分量都可导。对于由两段组成的分量，连接处的值必须相等，导数也必须相等，后一个条件确定线性段的斜率。",
  ],
  (rng) => {
    const a = nz(rng, 6);
    const c = nz(rng, 5);
    const m = 2 * c * a;
    const g = `\\begin{cases} ${poly([c, "t^{2}"])}, & t < ${a} \\\\ mt + n, & t \\ge ${a} \\end{cases}`;
    return ask(
      [
        `The second component of $\\mathbf{r}(t) = ${br("t", "g(t)")}$ is $g(t) = ${g}$. For which $m$ can $n$ be chosen so that $\\mathbf{r}$ is differentiable at $t = ${a}$?`,
        `$\\mathbf{r}(t) = ${br("t", "g(t)")}$ 的第二个分量是 $g(t) = ${g}$。当 $m$ 为何值时，可以选择 $n$ 使 $\\mathbf{r}$ 在 $t = ${a}$ 处可导？`,
      ],
      m,
      [c * a * a, 2 * c, c * a],
      [
        `The derivative from the left is $${poly([2 * c, "t"])}$, which equals $${m}$ at $t = ${a}$. The right piece has derivative $m$, so $m = ${m}$, and then $n$ makes the values agree.`,
        `左侧的导数是 $${poly([2 * c, "t"])}$，在 $t = ${a}$ 处等于 $${m}$。右段的导数是 $m$，所以 $m = ${m}$，再由 $n$ 使函数值相等。`,
      ],
    );
  },
);

const fromAcceleration = point(
  "position-from-acceleration-and-two-initial-vectors",
  ["Position from acceleration and two initial vectors", "由加速度和两个初始向量求位置"],
  [
    "Integrating an acceleration twice brings in two constant vectors, which are the initial velocity and the initial position. Each integration has its own constant, and the velocity constant gets multiplied by $t$ in the second integration.",
    "把加速度积分两次，会引入两个常向量，即初速度和初始位置。每次积分都有自己的常数，而速度常数在第二次积分时要乘以 $t$。",
  ],
  (rng) => {
    const q = nz(rng, 5);
    const v = nz(rng, 9);
    const y0 = rng.int(-9, 9);
    const T = rng.int(1, 4);
    const answer = y0 + v * T + q * T ** 3;
    return ask(
      [
        `$\\mathbf{r}''(t) = ${br(2, poly([6 * q, "t"]))}$, $\\mathbf{r}'(0) = ${br(1, v)}$ and $\\mathbf{r}(0) = ${br(0, y0)}$. Find the second component of $\\mathbf{r}(${T})$.`,
        `$\\mathbf{r}''(t) = ${br(2, poly([6 * q, "t"]))}$，$\\mathbf{r}'(0) = ${br(1, v)}$，$\\mathbf{r}(0) = ${br(0, y0)}$。求 $\\mathbf{r}(${T})$ 的第二个分量。`,
      ],
      answer,
      [y0 + v + q * T ** 3, y0 + q * T ** 3, v * T + q * T ** 3],
      [
        `The second component has velocity $${poly([3 * q, "t^{2}"], [v, ""])}$ and position $${poly([q, "t^{3}"], [v, "t"], [y0, ""])}$. At $t = ${T}$ this is $${answer}$.`,
        `第二个分量的速度是 $${poly([3 * q, "t^{2}"], [v, ""])}$，位置是 $${poly([q, "t^{3}"], [v, "t"], [y0, ""])}$。在 $t = ${T}$ 处等于 $${answer}$。`,
      ],
    );
  },
);

const tangentOnStraightPath = point(
  "the-unit-tangent-on-a-straight-path-with-changing-speed",
  ["The unit tangent on a straight path with changing speed", "速度变化的直线路径上的单位切向量"],
  [
    "The unit tangent records only the direction of motion, so a path along a line at changing speed has a constant $\\mathbf{T}$ until the motion reverses. When the velocity has a factor of $t$, the sign of $t$ decides which way $\\mathbf{T}$ points.",
    "单位切向量只记录运动方向，所以沿直线以变化的速度运动时，$\\mathbf{T}$ 保持不变，直到运动反向。当速度含有因子 $t$ 时，$t$ 的符号决定 $\\mathbf{T}$ 的指向。",
  ],
  (rng) => {
    const [a, b, c] = rng.pick(triples);
    const s1 = rng.pick([-1, 1]);
    const s2 = rng.pick([-1, 1]);
    const t0 = nz(rng, 5);
    const answer = Q.of(Math.sign(t0) * s1 * a, c);
    const r = br(poly([s1 * a, "t^{2}"]), poly([s2 * b, "t^{2}"]));
    return ask(
      [
        `Find the first component of the unit tangent vector $\\mathbf{T}(${t0})$ of $\\mathbf{r}(t) = ${r}$.`,
        `求 $\\mathbf{r}(t) = ${r}$ 的单位切向量 $\\mathbf{T}(${t0})$ 的第一个分量。`,
      ],
      answer,
      [answer.neg(), Q.of(Math.sign(t0) * s2 * b, c), s1 * a],
      [
        `$\\mathbf{r}'(t) = 2t${br(s1 * a, s2 * b)}$, and the vector has length $${c}$ apart from the factor $2t$. At $t = ${t0}$ that factor is ${t0 > 0 ? "positive" : "negative"}, so the component is $${answer.toLatex()}$.`,
        `$\\mathbf{r}'(t) = 2t${br(s1 * a, s2 * b)}$，除因子 $2t$ 外，向量的长度是 $${c}$。在 $t = ${t0}$ 处，这个因子${t0 > 0 ? "为正" : "为负"}，所以分量是 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const normalOfParabola = point(
  "the-normal-points-to-the-concave-side",
  ["The normal points to the concave side", "法向量指向凹的一侧"],
  [
    "The principal normal is perpendicular to the tangent, and of the two perpendicular unit vectors it is the one toward which the curve bends. So for a parabola opening downward, $\\mathbf{N}$ has a negative second component.",
    "主法向量垂直于切向量，在两个垂直的单位向量中，它是曲线弯向的那一个。所以对开口向下的抛物线，$\\mathbf{N}$ 的第二个分量为负。",
  ],
  (rng) => {
    const [p, q, h] = rng.pick(triples);
    const b = nz(rng, 4);
    const t0 = Q.of(p, 2 * b * q);
    const answer = Q.of(Math.sign(b) * q, h);
    const r = br("t", poly([b, "t^{2}"]));
    return ask(
      [
        `Find the second component of the principal unit normal of $\\mathbf{r}(t) = ${r}$ at $t = ${t0.toLatex()}$.`,
        `求 $\\mathbf{r}(t) = ${r}$ 在 $t = ${t0.toLatex()}$ 处的主单位法向量的第二个分量。`,
      ],
      answer,
      [answer.neg(), Q.of(p, h), Q.of(-Math.sign(b) * p, h)],
      [
        `The slope there is $\\frac{${p}}{${q}}$, so $\\mathbf{T} = ${br(`\\frac{${q}}{${h}}`, `\\frac{${p}}{${h}}`)}$. The perpendicular direction toward the bend has second component $${answer.toLatex()}$, as the parabola opens ${b > 0 ? "upward" : "downward"}.`,
        `该处斜率是 $\\frac{${p}}{${q}}$，所以 $\\mathbf{T} = ${br(`\\frac{${q}}{${h}}`, `\\frac{${p}}{${h}}`)}$。抛物线开口${b > 0 ? "向上" : "向下"}，弯曲方向上的垂直单位向量的第二个分量是 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const helixBinormal = point(
  "the-binormal-of-a-helix",
  ["The binormal of a helix", "螺旋线的副法向量"],
  [
    "The binormal $\\mathbf{B} = \\mathbf{T} \\times \\mathbf{N}$ is the unit normal of the osculating plane. On a helix it makes a constant angle with the axis, and the order of the cross product fixes its sign, so $\\mathbf{N} \\times \\mathbf{T}$ would give the opposite vector.",
    "副法向量 $\\mathbf{B} = \\mathbf{T} \\times \\mathbf{N}$ 是密切平面的单位法向量。在螺旋线上，它与轴的夹角不变，叉积的顺序决定其符号，所以 $\\mathbf{N} \\times \\mathbf{T}$ 会得到相反的向量。",
  ],
  (rng) => {
    const [a, b, c] = rng.pick(triples);
    const u = rng.int(1, 3);
    const third = rng.bool();
    const answer = third ? Q.of(a, c) : Q.of(-b, c);
    const r = br(`${a * u}\\cos t`, `${a * u}\\sin t`, `${b * u}t`);
    const name: Pair = third ? ["third", "第三"] : ["second", "第二"];
    return ask(
      [
        `Find the ${name[0]} component of the unit binormal $\\mathbf{B}(0)$ of $\\mathbf{r}(t) = ${r}$.`,
        `求 $\\mathbf{r}(t) = ${r}$ 的单位副法向量 $\\mathbf{B}(0)$ 的${name[1]}个分量。`,
      ],
      answer,
      [answer.neg(), third ? Q.of(b, c) : Q.of(a, c), Q.of(a, b)],
      [
        `At $t = 0$, $\\mathbf{T} = ${br(0, `\\frac{${a}}{${c}}`, `\\frac{${b}}{${c}}`)}$ and $\\mathbf{N} = ${br(-1, 0, 0)}$. Their cross product is $${br(0, `-\\frac{${b}}{${c}}`, `\\frac{${a}}{${c}}`)}$, so the component is $${answer.toLatex()}$.`,
        `在 $t = 0$ 处，$\\mathbf{T} = ${br(0, `\\frac{${a}}{${c}}`, `\\frac{${b}}{${c}}`)}$，$\\mathbf{N} = ${br(-1, 0, 0)}$。叉积是 $${br(0, `-\\frac{${b}}{${c}}`, `\\frac{${a}}{${c}}`)}$，所以该分量是 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const inverseSquare = point(
  "the-size-of-an-inverse-square-field",
  ["The size of an inverse square field", "平方反比场的大小"],
  [
    "An inverse square field is written $\\mathbf{F} = \\frac{k\\mathbf{r}}{|\\mathbf{r}|^{3}}$, with a third power below because the numerator also has a length. So its magnitude is $\\frac{k}{|\\mathbf{r}|^{2}}$, and doubling the distance divides the size by four.",
    "平方反比场写作 $\\mathbf{F} = \\frac{k\\mathbf{r}}{|\\mathbf{r}|^{3}}$，分母是三次方，因为分子也含有长度。所以它的大小是 $\\frac{k}{|\\mathbf{r}|^{2}}$，距离加倍时，大小变为四分之一。",
  ],
  (rng) => {
    const [a, b, c] = rng.pick(triples);
    const k = rng.int(1, 60);
    const x = a * rng.pick([-1, 1]);
    const y = b * rng.pick([-1, 1]);
    const answer = Q.of(k, c * c);
    return ask(
      [
        `Find $|\\mathbf{F}(${x}, ${y})|$ for $\\mathbf{F}(x, y) = \\frac{${k}${br("x", "y")}}{(x^{2} + y^{2})^{3/2}}$.`,
        `对 $\\mathbf{F}(x, y) = \\frac{${k}${br("x", "y")}}{(x^{2} + y^{2})^{3/2}}$，求 $|\\mathbf{F}(${x}, ${y})|$。`,
      ],
      answer,
      [Q.of(k, c), Q.of(k, c * c * c), k],
      [
        `The distance from the origin is $${c}$. The numerator has length $${k} \\cdot ${c}$ and the denominator is $${c}^{3}$, so the magnitude is $${answer.toLatex()}$.`,
        `到原点的距离是 $${c}$。分子的长度是 $${k} \\cdot ${c}$，分母是 $${c}^{3}$，所以大小是 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const crossPartials = point(
  "the-cross-partial-test-for-a-gradient-field",
  ["The cross-partial test for a gradient field", "梯度场的交叉偏导检验"],
  [
    "If $\\langle P, Q \\rangle$ is a gradient field with continuous partial derivatives, then $\\frac{\\partial P}{\\partial y} = \\frac{\\partial Q}{\\partial x}$, because mixed partials of the potential agree. So the coefficient of $y$ in $P$ must match the coefficient of $x$ in $Q$.",
    "如果 $\\langle P, Q \\rangle$ 是偏导连续的梯度场，则 $\\frac{\\partial P}{\\partial y} = \\frac{\\partial Q}{\\partial x}$，因为势函数的混合偏导相等。所以 $P$ 中 $y$ 的系数必须等于 $Q$ 中 $x$ 的系数。",
  ],
  (rng) => {
    const a = nz(rng, 9);
    const c = nz(rng, 12);
    const d = nz(rng, 9);
    const F = br(`${poly([a, "x"])} + ky`, poly([c, "x"], [d, "y"]));
    return ask(
      [`For which $k$ is $\\mathbf{F} = ${F}$ a gradient field?`, `当 $k$ 为何值时，$\\mathbf{F} = ${F}$ 是梯度场？`],
      c,
      [-c, a, d],
      [
        `$\\frac{\\partial P}{\\partial y} = k$ and $\\frac{\\partial Q}{\\partial x} = ${c}$. These must be equal, so $k = ${c}$.`,
        `$\\frac{\\partial P}{\\partial y} = k$，$\\frac{\\partial Q}{\\partial x} = ${c}$。二者必须相等，所以 $k = ${c}$。`,
      ],
    );
  },
);

const potentialConstant = point(
  "fixing-the-constant-of-a-potential",
  ["Fixing the constant of a potential", "确定势函数的常数"],
  [
    "A potential is determined only up to a constant, since the gradient of a constant is zero. One known value fixes it. So after integrating, substitute the given point into the whole expression, including the constant, instead of assuming that the constant is zero.",
    "势函数只确定到相差一个常数，因为常数的梯度为零。一个已知值就能确定它。所以积分后要把给定点代入包括常数在内的整个表达式，而不是假设常数为零。",
  ],
  (rng) => {
    const p = nz(rng, 4);
    const q = nz(rng, 5);
    const r = nz(rng, 4);
    const x0 = nz(rng, 3);
    const y0 = nz(rng, 3);
    const v = rng.int(-20, 20);
    const part = p * x0 * x0 + q * x0 * y0 + r * y0 * y0;
    const answer = v - part;
    const F = br(poly([2 * p, "x"], [q, "y"]), poly([q, "x"], [2 * r, "y"]));
    return ask(
      [`$\\nabla f = ${F}$ and $f(${x0}, ${y0}) = ${v}$. Find $f(0, 0)$.`, `$\\nabla f = ${F}$，$f(${x0}, ${y0}) = ${v}$。求 $f(0, 0)$。`],
      answer,
      [v, part, v + part],
      [
        `Integrating gives $f = ${poly([p, "x^{2}"], [q, "xy"], [r, "y^{2}"])} + C$. At the point this is $${part} + C = ${v}$, so $f(0, 0) = C = ${answer}$.`,
        `积分得 $f = ${poly([p, "x^{2}"], [q, "xy"], [r, "y^{2}"])} + C$。在该点，$${part} + C = ${v}$，所以 $f(0, 0) = C = ${answer}$。`,
      ],
    );
  },
);

const componentCount = point(
  "counting-connected-pieces",
  ["Counting connected pieces", "数连通的块数"],
  [
    "Removing lines or curves from the plane can split it into pieces, and a removed single point does not. A line separates the plane, a circle separates inside from outside, and two crossing lines make four pieces while two parallel lines make three.",
    "从平面上去掉直线或曲线可能把它分成几块，而去掉单个点不会。一条直线把平面分开，圆把内外分开；两条相交直线分成四块，两条平行直线分成三块。",
  ],
  (rng) => {
    const a = nz(rng, 9);
    const b = rng.pick([-8, -6, -4, -2, 2, 4, 6, 8].filter((v) => v !== a));
    const r = rng.int(1, 9);
    const kind = rng.int(0, 3);
    const answer = [4, 3, 2, 1][kind] as number;
    const set = [
      `(${poly([1, "x"], [-a, ""])})(${poly([1, "y"], [-b, ""])}) \\ne 0`,
      `(${poly([1, "x"], [-a, ""])})(${poly([1, "x"], [-b, ""])}) \\ne 0`,
      `x^{2} + y^{2} \\ne ${r * r}`,
      `(${poly([1, "x"], [-a, ""])})^{2} + (${poly([1, "y"], [-b, ""])})^{2} \\ne 0`,
    ][kind];
    const whys: Pair[] = [
      ["The removed set is two crossing lines, which leave four pieces.", "去掉的是两条相交直线，留下四块。"],
      ["The removed set is two parallel lines, which leave three pieces.", "去掉的是两条平行直线，留下三块。"],
      ["The removed set is a circle, which leaves the inside and the outside.", "去掉的是一个圆，留下内部和外部。"],
      ["Only one point is removed, and the rest of the plane stays connected.", "只去掉一个点，平面的其余部分仍然连通。"],
    ];
    const why = whys[kind] as Pair;
    return ask(
      [`How many connected pieces does $\\{(x, y) : ${set}\\}$ have?`, `$\\{(x, y) : ${set}\\}$ 有多少个连通的块？`],
      answer,
      [1, 2, 3, 4],
      [why[0], why[1]],
    );
  },
);

const roomInside = point(
  "how-much-room-an-interior-point-has",
  ["How much room an interior point has", "内点周围有多少空间"],
  [
    "A point is interior when a small disk around it stays inside the set. For an open disk centered at the origin, the largest such radius is the distance from the point to the boundary, which is the radius of the set minus the distance to the center.",
    "如果点周围有一个小圆盘完全在集合内，这个点就是内点。对圆心在原点的开圆盘，这样的最大半径就是点到边界的距离，等于集合的半径减去点到圆心的距离。",
  ],
  (rng) => {
    const [a, b, c] = rng.pick(triples);
    const s1 = rng.pick([-1, 1]);
    const s2 = rng.pick([-1, 1]);
    const extra = rng.int(1, 9);
    const R = c + extra;
    return ask(
      [
        `Find the largest $\\delta$ such that the open disk of radius $\\delta$ around $(${s1 * a}, ${s2 * b})$ lies inside $\\{(x, y) : x^{2} + y^{2} < ${R * R}\\}$.`,
        `求最大的 $\\delta$，使以 $(${s1 * a}, ${s2 * b})$ 为圆心、半径为 $\\delta$ 的开圆盘位于 $\\{(x, y) : x^{2} + y^{2} < ${R * R}\\}$ 内。`,
      ],
      extra,
      [R, c, R * R - c * c],
      [
        `The set has radius $${R}$, and the point is at distance $${c}$ from the origin. The nearest boundary point is along the same ray, so $\\delta = ${R} - ${c} = ${extra}$.`,
        `集合的半径是 $${R}$，点到原点的距离是 $${c}$。最近的边界点在同一条射线上，所以 $\\delta = ${R} - ${c} = ${extra}$。`,
      ],
    );
  },
);

const annulusBoundary = point(
  "both-circles-belong-to-the-boundary",
  ["Both circles belong to the boundary", "两个圆都属于边界"],
  [
    "The boundary of an annulus has two parts, an inner and an outer circle. Whether each circle belongs to the set does not change this: every point of each circle has points of the set and points outside the set arbitrarily close by.",
    "圆环的边界有两部分，即内圆和外圆。各圆是否属于集合并不改变这一点：每个圆上的每一点附近都有集合内的点，也有集合外的点。",
  ],
  (rng) => {
    const r1 = rng.int(1, 8);
    const r2 = r1 + rng.int(1, 8);
    const answer = 2 * (r1 + r2);
    return ask(
      [
        `Find $\\frac{L}{\\pi}$, where $L$ is the total length of the boundary of $\\{(x, y) : ${r1 * r1} < x^{2} + y^{2} \\le ${r2 * r2}\\}$.`,
        `求 $\\frac{L}{\\pi}$，其中 $L$ 是 $\\{(x, y) : ${r1 * r1} < x^{2} + y^{2} \\le ${r2 * r2}\\}$ 的边界总长度。`,
      ],
      answer,
      [2 * r2, 2 * (r2 - r1), r1 + r2],
      [
        `The boundary consists of the circles of radius $${r1}$ and $${r2}$. Their lengths are $${2 * r1}\\pi$ and $${2 * r2}\\pi$, and the sum divided by $\\pi$ is $${answer}$.`,
        `边界由半径为 $${r1}$ 和 $${r2}$ 的两个圆组成。长度分别是 $${2 * r1}\\pi$ 和 $${2 * r2}\\pi$，和除以 $\\pi$ 等于 $${answer}$。`,
      ],
    );
  },
);

const complementKind = point(
  "the-complement-of-an-open-or-closed-set",
  ["The complement of an open or closed set", "开集或闭集的补集"],
  [
    "A set is closed exactly when its complement is open. So classifying a complement reverses the answer for open and closed sets. A set that is neither stays neither, since it contains some but not all of its boundary, and so does its complement.",
    "集合是闭集，当且仅当它的补集是开集。所以对开集和闭集，补集的分类正好相反。两者都不是的集合，其补集也两者都不是，因为它含有部分而非全部边界，补集也是这样。",
  ],
  (rng) => {
    const k = rng.int(0, 2);
    const a = rng.int(1, 9);
    const b = a + rng.int(1, 9);
    const set = [`x^{2} + y^{2} \\le ${a * a}`, `y > ${poly([a, "x"], [-b, ""])}`, `${a} \\le x < ${b}`][k];
    const open: Pair = ["Open", "开集"];
    const closed: Pair = ["Closed", "闭集"];
    const neither: Pair = ["Neither open nor closed", "既不是开集也不是闭集"];
    const both: Pair = ["Both open and closed", "既是开集又是闭集"];
    const correct = [open, closed, neither][k] as Pair;
    const whys: Pair[] = [
      ["The set is closed, so its complement is open.", "这个集合是闭集，所以补集是开集。"],
      ["The set is open, so its complement is closed.", "这个集合是开集，所以补集是闭集。"],
      [
        "The set contains one boundary line and misses the other, and so does its complement, so it is neither.",
        "这个集合含有一条边界线而不含另一条，补集也是这样，所以两者都不是。",
      ],
    ];
    const why = whys[k] as Pair;
    return choose(
      rng,
      [`Classify the complement of $\\{(x, y) : ${set}\\}$.`, `判断 $\\{(x, y) : ${set}\\}$ 的补集属于哪一类。`],
      correct,
      [open, closed, neither, both].filter((o) => o !== correct),
      why,
    );
  },
);

const levelToAxis = point(
  "where-a-level-surface-meets-an-axis",
  ["Where a level surface meets an axis", "等值面与坐标轴的交点"],
  [
    "The level surface through a point is found by evaluating $F$ there, since that value is the constant of the surface. Then any other point of the surface must give the same value, which is how to find where it crosses an axis.",
    "过一点的等值面，只要在该点计算 $F$ 就能确定，因为这个值就是曲面的常数。曲面上的其他点必须给出相同的值，由此可求它与坐标轴的交点。",
  ],
  (rng) => {
    const p = nz(rng, 5);
    const q = nz(rng, 5);
    const r = nz(rng, 6);
    const a = nz(rng, 4);
    const b = nz(rng, 4);
    const c = nz(rng, 6);
    const V = p * a * a + q * b * b + r * c;
    const answer = Q.of(V, r);
    return ask(
      [
        `The level surface of $F(x, y, z) = ${poly([p, "x^{2}"], [q, "y^{2}"], [r, "z"])}$ through $(${a}, ${b}, ${c})$ meets the $z$-axis at $z = k$. Find $k$.`,
        `$F(x, y, z) = ${poly([p, "x^{2}"], [q, "y^{2}"], [r, "z"])}$ 过 $(${a}, ${b}, ${c})$ 的等值面与 $z$ 轴交于 $z = k$。求 $k$。`,
      ],
      answer,
      [V, c, answer.neg()],
      [
        `At the point $F = ${V}$. On the $z$-axis $x = y = 0$, so $${poly([r, "k"])} = ${V}$ and $k = ${answer.toLatex()}$.`,
        `在该点 $F = ${V}$。在 $z$ 轴上 $x = y = 0$，所以 $${poly([r, "k"])} = ${V}$，$k = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const cylinderSlice = point(
  "an-oblique-slice-of-a-cylinder",
  ["An oblique slice of a cylinder", "圆柱的斜截面"],
  [
    "A plane that cuts a circular cylinder at an angle gives an ellipse, not a circle. One semi-axis stays equal to the radius, while the other is longer by the factor $\\sqrt{1 + m^{2}}$, where $m$ is the slope of the plane.",
    "斜着切割圆柱的平面得到的是椭圆，不是圆。一个半轴仍等于半径，另一个半轴长出因子 $\\sqrt{1 + m^{2}}$，其中 $m$ 是平面的斜率。",
  ],
  (rng) => {
    const [p, q, h] = rng.pick(triples);
    const k = rng.int(1, 5);
    const R = q * k;
    const m = Q.of(p, q);
    const answer = h * k;
    return ask(
      [
        `The plane $z = ${m.toLatex()}x$ cuts the cylinder $x^{2} + y^{2} = ${R * R}$ in an ellipse. Find the length of its semi-major axis.`,
        `平面 $z = ${m.toLatex()}x$ 截圆柱 $x^{2} + y^{2} = ${R * R}$ 得到一个椭圆。求它的半长轴长度。`,
      ],
      answer,
      [R, p * k, (p + q) * k],
      [
        `The point of the cut farthest from the center has $x = ${R}$ and $z = ${p * k}$. Its distance from the center is $\\sqrt{${R * R} + ${(p * k) ** 2}} = ${answer}$.`,
        `截线上离中心最远的点满足 $x = ${R}$，$z = ${p * k}$。它到中心的距离是 $\\sqrt{${R * R} + ${(p * k) ** 2}} = ${answer}$。`,
      ],
    );
  },
);

const planeMeetsParaboloid = point(
  "a-plane-meets-a-paraboloid-over-a-circle",
  ["A plane meets a paraboloid over a circle", "平面与抛物面的交线投影是圆"],
  [
    "Eliminating $z$ between a plane and the paraboloid $z = x^{2} + y^{2}$ leaves an equation in $x$ and $y$. Completing the square shows that the intersection lies over a circle in the $xy$-plane, whose center and radius come from the coefficients of the plane.",
    "在平面和抛物面 $z = x^{2} + y^{2}$ 之间消去 $z$，得到关于 $x$ 和 $y$ 的方程。配方后可知，交线在 $xy$ 平面上的投影是一个圆，其圆心和半径由平面的系数决定。",
  ],
  (rng) => {
    const a = nz(rng, 6);
    const b = nz(rng, 6);
    const c = rng.int(1, 20);
    const answer = a * a + b * b + c;
    const plane = poly([2 * a, "x"], [2 * b, "y"], [c, ""]);
    return ask(
      [
        `The plane $z = ${plane}$ meets $z = x^{2} + y^{2}$ in a curve whose projection to the $xy$-plane is a circle of radius $r$. Find $r^{2}$.`,
        `平面 $z = ${plane}$ 与 $z = x^{2} + y^{2}$ 相交，交线在 $xy$ 平面上的投影是半径为 $r$ 的圆。求 $r^{2}$。`,
      ],
      answer,
      [c, a * a + b * b - c, a + b + c],
      [
        `Equating gives $x^{2} + y^{2} = ${plane}$, which becomes $(${poly([1, "x"], [-a, ""])})^{2} + (${poly([1, "y"], [-b, ""])})^{2} = ${c} + ${a * a} + ${b * b}$. So $r^{2} = ${answer}$.`,
        `令二者相等，得 $x^{2} + y^{2} = ${plane}$，即 $(${poly([1, "x"], [-a, ""])})^{2} + (${poly([1, "y"], [-b, ""])})^{2} = ${c} + ${a * a} + ${b * b}$。所以 $r^{2} = ${answer}$。`,
      ],
    );
  },
);

const coefficientFromPartial = point(
  "a-coefficient-from-a-partial-derivative",
  ["A coefficient from a partial derivative", "由偏导数求系数"],
  [
    "A partial derivative can be used in reverse to find an unknown coefficient. When differentiating with respect to $x$, every term without $x$ disappears, so those terms give no information, and $y$ stays as a constant multiplier in the rest.",
    "偏导数可以反过来求未知系数。对 $x$ 求导时，所有不含 $x$ 的项都消失，所以这些项不提供信息，而其余项中的 $y$ 保留为常数因子。",
  ],
  (rng) => {
    const c = nz(rng, 6);
    const e = nz(rng, 5);
    const g = nz(rng, 9);
    const x0 = nz(rng, 3);
    const y0 = nz(rng, 3);
    const v = 2 * c * x0 * y0;
    const f = poly([1, "cx^{2}y"], [e, "y^{3}"], [g, "y"]);
    return ask(
      [`$f(x, y) = ${f}$ has $f_{x}(${x0}, ${y0}) = ${v}$. Find $c$.`, `$f(x, y) = ${f}$ 满足 $f_{x}(${x0}, ${y0}) = ${v}$。求 $c$。`],
      c,
      [-c, v, Q.of(v, 2)],
      [
        `$f_{x} = 2cxy$, as the other terms have no $x$. At the point this is $${2 * x0 * y0}c = ${v}$, so $c = ${c}$.`,
        `$f_{x} = 2cxy$，因为其他项不含 $x$。在该点，$${2 * x0 * y0}c = ${v}$，所以 $c = ${c}$。`,
      ],
    );
  },
);

const innerFactor = point(
  "the-inner-factor-of-a-partial-derivative",
  ["The inner factor of a partial derivative", "偏导数中的内层因子"],
  [
    "The chain rule applies to partial derivatives as usual. For $(ax + by)^{n}$, the derivative with respect to $y$ has the inner factor $b$, which belongs to $y$. Forgetting this factor, or using $a$ in its place, is the common error.",
    "链式法则同样适用于偏导数。对 $(ax + by)^{n}$，关于 $y$ 的导数有内层因子 $b$，它属于 $y$。漏掉这个因子或误用 $a$ 是常见错误。",
  ],
  (rng) => {
    const a = nz(rng, 4);
    const b = nz(rng, 4);
    const n = rng.int(2, 3);
    const x0 = nz(rng, 2);
    const y1 = nz(rng, 2);
    const y0 = a * x0 + b * y1 === 0 ? y1 + 1 : y1;
    const s = a * x0 + b * y0;
    const p = s ** (n - 1);
    const outer = n === 2 ? `(${poly([a, "x"], [b, "y"])})` : `(${poly([a, "x"], [b, "y"])})^{2}`;
    const answer = n * b * p;
    const inner = poly([a, "x"], [b, "y"]);
    return ask(
      [`Find $f_{y}(${x0}, ${y0})$ for $f(x, y) = (${inner})^{${n}}$.`, `对 $f(x, y) = (${inner})^{${n}}$，求 $f_{y}(${x0}, ${y0})$。`],
      answer,
      [n * p, n * a * p, b * p],
      [
        `$f_{y} = ${n}${outer} \\cdot ${paren(b)}$. At the point the inner sum is $${s}$, which gives $${answer}$.`,
        `$f_{y} = ${n}${outer} \\cdot ${paren(b)}$。在该点内层的和是 $${s}$，所以结果是 $${answer}$。`,
      ],
    );
  },
);

const tangentLineHeight = point(
  "following-the-tangent-line-of-a-cross-section",
  ["Following the tangent line of a cross section", "沿截线的切线前进"],
  [
    "The partial derivative $f_{x}$ is the slope of the tangent line in the plane $y = y_{0}$. That line starts at the height of the surface at the point, so moving one unit in $x$ along it changes the height by exactly $f_{x}$.",
    "偏导数 $f_{x}$ 是平面 $y = y_{0}$ 内切线的斜率。这条直线从曲面在该点的高度出发，所以沿它在 $x$ 方向移动一个单位，高度恰好改变 $f_{x}$。",
  ],
  (rng) => {
    const a = nz(rng, 4);
    const b = nz(rng, 4);
    const c = nz(rng, 4);
    const x0 = nz(rng, 3);
    const y0 = nz(rng, 3);
    const z0 = a * x0 * x0 + b * x0 * y0 + c * y0 * y0;
    const fx = 2 * a * x0 + b * y0;
    const answer = z0 + fx;
    return ask(
      [
        `The plane $y = ${y0}$ cuts $z = ${poly([a, "x^{2}"], [b, "xy"], [c, "y^{2}"])}$ in a curve. Find the height of its tangent line at $x = ${x0}$ when $x = ${x0 + 1}$.`,
        `平面 $y = ${y0}$ 截 $z = ${poly([a, "x^{2}"], [b, "xy"], [c, "y^{2}"])}$ 得到一条曲线。求它在 $x = ${x0}$ 处的切线在 $x = ${x0 + 1}$ 时的高度。`,
      ],
      answer,
      [z0, fx, z0 - fx],
      [
        `At the point $z = ${z0}$ and $f_{x} = ${fx}$. One unit along the tangent line gives the height $${z0} + ${paren(fx)} = ${answer}$.`,
        `在该点 $z = ${z0}$，$f_{x} = ${fx}$。沿切线走一个单位，高度是 $${z0} + ${paren(fx)} = ${answer}$。`,
      ],
    );
  },
);

const pathLimit = point(
  "partial-derivatives-without-continuity",
  ["Partial derivatives without continuity", "有偏导数却不连续"],
  [
    "The function $\\frac{kxy}{x^{2} + y^{2}}$, set to zero at the origin, has both partial derivatives equal to zero there. Yet along the line $y = mx$ it is constant with a value depending on $m$, so it is not continuous and not differentiable at the origin.",
    "函数 $\\frac{kxy}{x^{2} + y^{2}}$ 在原点取零时，两个偏导数在原点都为零。但沿直线 $y = mx$，它是取决于 $m$ 的常数，所以在原点不连续，也不可微。",
  ],
  (rng) => {
    const k = nz(rng, 12);
    const p = nz(rng, 5);
    const q = rng.int(1, 5);
    const m = Q.of(p, q);
    const answer = Q.of(k * p * q, p * p + q * q);
    return ask(
      [
        `Let $f(x, y) = \\frac{${poly([k, "xy"])}}{x^{2} + y^{2}}$ away from the origin. Find the limit of $f$ at the origin along the line $y = ${poly([m, "x"])}$.`,
        `在原点以外，设 $f(x, y) = \\frac{${poly([k, "xy"])}}{x^{2} + y^{2}}$。求 $f$ 沿直线 $y = ${poly([m, "x"])}$ 在原点的极限。`,
      ],
      answer,
      [0, m.mul(Q.of(k)), k],
      [
        `Substituting $y = ${poly([m, "x"])}$, the factor $x^{2}$ cancels and $f$ is the constant $${answer.toLatex()}$ along the line. Other lines give other values, so there is no limit overall.`,
        `代入 $y = ${poly([m, "x"])}$，因子 $x^{2}$ 约去，$f$ 沿这条直线是常数 $${answer.toLatex()}$。其他直线给出其他值，所以总的极限不存在。`,
      ],
    );
  },
);

const steepestDescent = point(
  "the-most-negative-rate-of-change",
  ["The most negative rate of change", "最小的变化率"],
  [
    "The directional derivative along a unit vector is $|\\nabla f|\\cos\\theta$, which ranges from $-|\\nabla f|$ to $|\\nabla f|$. So the most negative rate of change occurs opposite to the gradient and equals the negative of its length, and it is zero in perpendicular directions.",
    "沿单位向量的方向导数是 $|\\nabla f|\\cos\\theta$，范围从 $-|\\nabla f|$ 到 $|\\nabla f|$。所以最小的变化率出现在梯度的反方向，等于其长度的相反数；在垂直方向上它为零。",
  ],
  (rng) => {
    const [a, b, c] = rng.pick(triples);
    const k = rng.int(1, 3);
    const gx = a * k * rng.pick([-1, 1]);
    const gy = b * k * rng.pick([-1, 1]);
    const x0 = nz(rng, 4);
    const y0 = nz(rng, 4);
    const p = gx - y0;
    const q = gy - x0;
    const answer = -c * k;
    return ask(
      [
        `Find the smallest directional derivative of $f(x, y) = ${poly([p, "x"], [q, "y"], [1, "xy"])}$ at $(${x0}, ${y0})$ over all unit vectors.`,
        `求 $f(x, y) = ${poly([p, "x"], [q, "y"], [1, "xy"])}$ 在 $(${x0}, ${y0})$ 处，所有单位向量方向上最小的方向导数。`,
      ],
      answer,
      [c * k, 0, -(a + b) * k],
      [
        `$\\nabla f = ${br(gx, gy)}$ at the point, with length $${c * k}$. The smallest rate is opposite to the gradient, so it is $${answer}$.`,
        `在该点 $\\nabla f = ${br(gx, gy)}$，长度是 $${c * k}$。最小的变化率在梯度的反方向，所以是 $${answer}$。`,
      ],
    );
  },
);

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

const parallelTangentPlane = point(
  "a-tangent-plane-parallel-to-a-given-plane",
  ["A tangent plane parallel to a given plane", "与已知平面平行的切平面"],
  [
    "A tangent plane to a level surface has the gradient as its normal. So a tangent plane parallel to $ax + by + cz = d$ occurs where the gradient is a multiple of $\\langle a, b, c \\rangle$. On a sphere there are two such points, opposite each other.",
    "等值面的切平面以梯度为法向量。所以与 $ax + by + cz = d$ 平行的切平面，出现在梯度是 $\\langle a, b, c \\rangle$ 的倍数的地方。球面上有两个这样的点，彼此相对。",
  ],
  (rng) => {
    const [a, b, c, h] = rng.pick(quads);
    const k = rng.int(1, 4);
    const R = h * k;
    const answer = R * h;
    return ask(
      [
        `Two planes $${poly([a, "x"], [b, "y"], [c, "z"])} = d$ are tangent to the sphere $x^{2} + y^{2} + z^{2} = ${R * R}$. Find the larger value of $d$.`,
        `两个平面 $${poly([a, "x"], [b, "y"], [c, "z"])} = d$ 与球面 $x^{2} + y^{2} + z^{2} = ${R * R}$ 相切。求较大的 $d$。`,
      ],
      answer,
      [R, R * (a + b + c), R * R],
      [
        `The tangent point is a multiple of $${br(a, b, c)}$, whose length is $${h}$, so it is $(${a * k}, ${b * k}, ${c * k})$. Substituting gives $d = ${answer}$.`,
        `切点是 $${br(a, b, c)}$ 的倍数，这个向量的长度是 $${h}$，所以切点是 $(${a * k}, ${b * k}, ${c * k})$。代入得 $d = ${answer}$。`,
      ],
    );
  },
);

const mvtBound = point(
  "a-bound-from-the-mean-value-theorem",
  ["A bound from the mean value theorem", "由中值定理得到的上界"],
  [
    "The mean value theorem gives $f(Q) - f(P) = \\nabla f(C) \\cdot (Q - P)$. If $|\\nabla f|$ is at most $M$ along the segment, then the Cauchy-Schwarz inequality gives $|f(Q) - f(P)| \\le M|Q - P|$, which bounds a change without knowing $C$.",
    "中值定理给出 $f(Q) - f(P) = \\nabla f(C) \\cdot (Q - P)$。如果沿线段 $|\\nabla f|$ 不超过 $M$，柯西-施瓦茨不等式给出 $|f(Q) - f(P)| \\le M|Q - P|$，这样不必知道 $C$ 就能限制变化量。",
  ],
  (rng) => {
    const [a, b, c] = rng.pick(triples);
    const u = rng.int(1, 3);
    const M = rng.int(2, 12);
    const x = rng.int(-6, 6);
    const y = rng.int(-6, 6);
    const answer = M * c * u;
    return ask(
      [
        `$|\\nabla f| \\le ${M}$ everywhere. Find the best bound on $|f(${x + a * u}, ${y + b * u}) - f(${x}, ${y})|$ that follows from the mean value theorem.`,
        `$|\\nabla f| \\le ${M}$ 处处成立。由中值定理，求 $|f(${x + a * u}, ${y + b * u}) - f(${x}, ${y})|$ 能得到的最好上界。`,
      ],
      answer,
      [M, M * (a + b) * u, c * u],
      [
        `The two points are at distance $${c * u}$, as the differences are $${a * u}$ and $${b * u}$. So the bound is $${M} \\cdot ${c * u} = ${answer}$.`,
        `两点的距离是 $${c * u}$，因为坐标差是 $${a * u}$ 和 $${b * u}$。所以上界是 $${M} \\cdot ${c * u} = ${answer}$。`,
      ],
    );
  },
);

const cartesianFromPolar = point(
  "a-cartesian-partial-from-polar-ones",
  ["A Cartesian partial from polar ones", "由极坐标偏导求直角坐标偏导"],
  [
    "Inverting the polar chain rule gives $z_{x} = z_{r}\\cos\\theta - \\frac{z_{\\theta}\\sin\\theta}{r}$. The factor $\\frac{1}{r}$ is needed because a change of $\\theta$ moves a point by a distance proportional to $r$. At $\\theta = \\frac{\\pi}{2}$, $x$ changes only through $\\theta$.",
    "把极坐标链式法则反过来，得 $z_{x} = z_{r}\\cos\\theta - \\frac{z_{\\theta}\\sin\\theta}{r}$。需要因子 $\\frac{1}{r}$，是因为 $\\theta$ 的变化使点移动的距离与 $r$ 成正比。在 $\\theta = \\frac{\\pi}{2}$ 处，$x$ 只通过 $\\theta$ 变化。",
  ],
  (rng) => {
    const p = nz(rng, 12);
    const q = nz(rng, 12);
    const r0 = rng.int(1, 6);
    const k = rng.int(0, 2);
    const theta = ["0", "\\frac{\\pi}{2}", "\\pi"][k] as string;
    const answer = k === 0 ? Q.of(p) : k === 1 ? Q.of(-q, r0) : Q.of(-p);
    return ask(
      [
        `At the point with $r = ${r0}$ and $\\theta = ${theta}$, we have $z_{r} = ${p}$ and $z_{\\theta} = ${q}$. Find $z_{x}$.`,
        `在 $r = ${r0}$，$\\theta = ${theta}$ 的点，$z_{r} = ${p}$，$z_{\\theta} = ${q}$。求 $z_{x}$。`,
      ],
      answer,
      [answer.neg(), Q.of(q), Q.of(p + q, r0)],
      [
        `$z_{x} = z_{r}\\cos\\theta - \\frac{z_{\\theta}\\sin\\theta}{r}$. At $\\theta = ${theta}$ the cosine is $${[1, 0, -1][k]}$ and the sine is $${[0, 1, 0][k]}$, so $z_{x} = ${answer.toLatex()}$.`,
        `$z_{x} = z_{r}\\cos\\theta - \\frac{z_{\\theta}\\sin\\theta}{r}$。在 $\\theta = ${theta}$ 处，余弦是 $${[1, 0, -1][k]}$，正弦是 $${[0, 1, 0][k]}$，所以 $z_{x} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const movingAlongLevel = point(
  "a-velocity-that-keeps-a-function-constant",
  ["A velocity that keeps a function constant", "使函数保持不变的速度"],
  [
    "By the chain rule, $\\frac{df}{dt} = \\nabla f \\cdot \\mathbf{r}'(t)$. The function stays constant to first order exactly when this dot product is zero, that is, when the velocity is perpendicular to the gradient, or in other words tangent to the level curve.",
    "由链式法则，$\\frac{df}{dt} = \\nabla f \\cdot \\mathbf{r}'(t)$。当这个点积为零时，函数在一阶上保持不变，也就是速度垂直于梯度，或者说与等值线相切。",
  ],
  (rng) => {
    const p = nz(rng, 9);
    const q = nz(rng, 9);
    const a = nz(rng, 9);
    const answer = Q.of(-a * p, q);
    return ask(
      [
        `At an instant, a particle has $\\nabla f = ${br(p, q)}$ and $\\mathbf{r}'(t) = ${br(a, "k")}$. Find $k$ so that $\\frac{df}{dt} = 0$ at that instant.`,
        `在某一时刻，质点处 $\\nabla f = ${br(p, q)}$，$\\mathbf{r}'(t) = ${br(a, "k")}$。求 $k$，使该时刻 $\\frac{df}{dt} = 0$。`,
      ],
      answer,
      [answer.neg(), Q.of(a * q, p), a],
      [
        `$\\frac{df}{dt} = ${paren(p)} \\cdot ${paren(a)} + ${paren(q)}k$. Setting this to zero gives $k = ${answer.toLatex()}$.`,
        `$\\frac{df}{dt} = ${paren(p)} \\cdot ${paren(a)} + ${paren(q)}k$。令它为零，得 $k = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const worstError = point(
  "the-worst-case-error-of-a-product",
  ["The worst case error of a product", "乘积的最坏误差"],
  [
    "The differential gives $dV = yz\\,dx + xz\\,dy + xy\\,dz$. When each measurement has error up to $\\varepsilon$, the worst case takes every error with the sign that adds, so the bound is the sum of the three products times $\\varepsilon$.",
    "微分给出 $dV = yz\\,dx + xz\\,dy + xy\\,dz$。当每次测量的误差最多为 $\\varepsilon$ 时，最坏情况是所有误差都取相加的符号，所以上界是三个乘积的和乘以 $\\varepsilon$。",
  ],
  (rng) => {
    const x = rng.int(2, 9);
    const y = rng.int(2, 9);
    const z = rng.int(2, 9);
    const e = rng.pick([Q.of(1, 10), Q.of(1, 20), Q.of(1, 100)]);
    const sum = y * z + x * z + x * y;
    const answer = e.mul(Q.of(sum));
    return ask(
      [
        `A box measures $${x}$ by $${y}$ by $${z}$, and each length has error at most $${e.toLatex()}$. Use differentials to find the largest error in its volume.`,
        `一个长方体的尺寸是 $${x}$、$${y}$、$${z}$，每个长度的误差最多为 $${e.toLatex()}$。用微分求体积的最大误差。`,
      ],
      answer,
      [e.mul(Q.of(x * y * z)), e.mul(Q.of(x + y + z)), e.mul(Q.of(3 * x * y * z))],
      [
        `$|dV| \\le (${y * z} + ${x * z} + ${x * y})${e.toLatex()}$, taking all three errors with the same effect. This is $${answer.toLatex()}$.`,
        `所有误差都取同样的效果时，$|dV| \\le (${y * z} + ${x * z} + ${x * y})${e.toLatex()}$，即 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const affinePreimage = point(
  "the-point-that-an-affine-map-sends-to-a-target",
  ["The point that an affine map sends to a target", "仿射变换映到目标点的原像"],
  [
    "An affine map with nonzero determinant is invertible, so each target has exactly one preimage. Subtract the translation first, and then solve the linear system. Doing this in the wrong order, or leaving out the translation, gives a different point.",
    "行列式不为零的仿射变换可逆，所以每个目标点恰有一个原像。先减去平移部分，再解线性方程组。顺序错误或漏掉平移，都会得到不同的点。",
  ],
  (rng) => {
    const a = nz(rng, 4);
    const b = nz(rng, 4);
    const c = nz(rng, 4);
    const d0 = nz(rng, 4);
    const d = a * d0 === b * c ? -d0 : d0;
    const x = nz(rng, 6);
    const y = nz(rng, 6);
    const e = nz(rng, 9);
    const f = nz(rng, 9);
    const u = a * x + b * y + e;
    const v = c * x + d * y + f;
    const map = `(${poly([a, "x"], [b, "y"], [e, ""])}, ${poly([c, "x"], [d, "y"], [f, ""])})`;
    return ask(
      [
        `$T(x, y) = ${map}$ sends a point $(x, y)$ to $(${u}, ${v})$. Find $x$.`,
        `$T(x, y) = ${map}$ 把点 $(x, y)$ 映到 $(${u}, ${v})$。求 $x$。`,
      ],
      x,
      [y, u, -x],
      [
        `Subtracting the translation gives $${poly([a, "x"], [b, "y"])} = ${u - e}$ and $${poly([c, "x"], [d, "y"])} = ${v - f}$. The determinant is $${a * d - b * c}$, and solving gives $x = ${x}$ and $y = ${y}$.`,
        `减去平移部分，得 $${poly([a, "x"], [b, "y"])} = ${u - e}$，$${poly([c, "x"], [d, "y"])} = ${v - f}$。行列式是 $${a * d - b * c}$，解得 $x = ${x}$，$y = ${y}$。`,
      ],
    );
  },
);

const squarePreimage = point(
  "undoing-the-squaring-map",
  ["Undoing the squaring map", "还原平方映射"],
  [
    "The map $u = x^{2} - y^{2}$, $v = 2xy$ sends $(x, y)$ and $(-x, -y)$ to the same point, so it needs a restriction like $x > 0$ to be inverted. Then $u^{2} + v^{2} = (x^{2} + y^{2})^{2}$ gives $x^{2} + y^{2}$, and adding $u$ gives $2x^{2}$.",
    "映射 $u = x^{2} - y^{2}$，$v = 2xy$ 把 $(x, y)$ 和 $(-x, -y)$ 映到同一点，所以需要 $x > 0$ 这样的限制才能求逆。由 $u^{2} + v^{2} = (x^{2} + y^{2})^{2}$ 得 $x^{2} + y^{2}$，再加上 $u$ 得 $2x^{2}$。",
  ],
  (rng) => {
    const a = rng.int(1, 8);
    const b = nz(rng, 8);
    const u = a * a - b * b;
    const v = 2 * a * b;
    const useX = rng.bool();
    const answer = useX ? a : b;
    const name = useX ? "x" : "y";
    return ask(
      [
        `With $x > 0$, the map $u = x^{2} - y^{2}$, $v = 2xy$ sends $(x, y)$ to $(${u}, ${v})$. Find $${name}$.`,
        `在 $x > 0$ 时，映射 $u = x^{2} - y^{2}$，$v = 2xy$ 把 $(x, y)$ 映到 $(${u}, ${v})$。求 $${name}$。`,
      ],
      answer,
      [useX ? b : a, -answer, a * a + b * b],
      [
        `$x^{2} + y^{2} = \\sqrt{${u * u} + ${v * v}} = ${a * a + b * b}$. Adding and subtracting $u$ gives $x^{2} = ${a * a}$ and $y^{2} = ${b * b}$. With $x > 0$, $x = ${a}$, and $v$ then gives $y = ${b}$.`,
        `$x^{2} + y^{2} = \\sqrt{${u * u} + ${v * v}} = ${a * a + b * b}$。加减 $u$ 得 $x^{2} = ${a * a}$，$y^{2} = ${b * b}$。由 $x > 0$，$x = ${a}$，再由 $v$ 得 $y = ${b}$。`,
      ],
    );
  },
);

const areaBetweenHyperbolas = point(
  "the-area-between-hyperbolas-and-rays",
  ["The area between hyperbolas and rays", "双曲线和射线之间的面积"],
  [
    "With $u = xy$ and $v = \\frac{y}{x}$ a region between hyperbolas and rays becomes a rectangle. The area element is $\\frac{1}{2v}\\,du\\,dv$, the reciprocal of the Jacobian $\\frac{\\partial(u, v)}{\\partial(x, y)} = 2v$, and this is what makes a logarithm appear.",
    "用 $u = xy$，$v = \\frac{y}{x}$，双曲线和射线之间的区域变成矩形。面积元是 $\\frac{1}{2v}\\,du\\,dv$，它是雅可比行列式 $\\frac{\\partial(u, v)}{\\partial(x, y)} = 2v$ 的倒数，对数正是由此出现的。",
  ],
  (rng) => {
    const p = rng.int(2, 20);
    const q = rng.int(2, 9);
    const answer = Q.of(p - 1, 2);
    return ask(
      [
        `In the first quadrant, the region $1 \\le xy \\le ${p}$, $1 \\le \\frac{y}{x} \\le ${q}$ has area $k\\ln ${q}$. Find $k$.`,
        `在第一象限，区域 $1 \\le xy \\le ${p}$，$1 \\le \\frac{y}{x} \\le ${q}$ 的面积是 $k\\ln ${q}$。求 $k$。`,
      ],
      answer,
      [p - 1, 2 * (p - 1), Q.of(p - 1, 2 * q)],
      [
        `The area is $\\int_{1}^{${q}} \\int_{1}^{${p}} \\frac{1}{2v} \\, du \\, dv$. The inner integral gives $${p - 1}$, and the outer gives $\\frac{1}{2}\\ln ${q}$, so $k = ${answer.toLatex()}$.`,
        `面积是 $\\int_{1}^{${q}} \\int_{1}^{${p}} \\frac{1}{2v} \\, du \\, dv$。内层积分给出 $${p - 1}$，外层给出 $\\frac{1}{2}\\ln ${q}$，所以 $k = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const singularJacobian = point(
  "where-a-jacobian-vanishes",
  ["Where a Jacobian vanishes", "雅可比行列式为零的位置"],
  [
    "A map collapses area where its Jacobian determinant is zero, and it may fail to be invertible there. For a nonlinear map the Jacobian depends on the point, so these places form a curve or a line in the $uv$-plane instead of every point or none.",
    "映射在雅可比行列式为零的地方压缩面积，并可能在那里不可逆。对非线性映射，雅可比行列式依赖于点，所以这些位置构成 $uv$ 平面上的曲线或直线，而不是全部或没有。",
  ],
  (rng) => {
    const k = nz(rng, 9);
    const c = nz(rng, 5);
    const answer = Q.of(k * c, 2);
    return ask(
      [
        `For $x = ${poly([1, "u^{2}"], [k, "v"])}$, $y = ${poly([c, "u"], [1, "v"])}$, the Jacobian $\\frac{\\partial(x, y)}{\\partial(u, v)}$ is zero along a line $u = u_{0}$. Find $u_{0}$.`,
        `对 $x = ${poly([1, "u^{2}"], [k, "v"])}$，$y = ${poly([c, "u"], [1, "v"])}$，雅可比行列式 $\\frac{\\partial(x, y)}{\\partial(u, v)}$ 沿直线 $u = u_{0}$ 为零。求 $u_{0}$。`,
      ],
      answer,
      [k * c, answer.neg(), Q.of(k, 2)],
      [
        `The determinant is $2u \\cdot 1 - ${paren(k)} \\cdot ${paren(c)} = ${poly([2, "u"], [-k * c, ""])}$, which is zero at $u = ${answer.toLatex()}$.`,
        `行列式是 $2u \\cdot 1 - ${paren(k)} \\cdot ${paren(c)} = ${poly([2, "u"], [-k * c, ""])}$，在 $u = ${answer.toLatex()}$ 时为零。`,
      ],
    );
  },
);

const inverseAtImage = point(
  "the-inverse-jacobian-is-evaluated-at-the-preimage",
  ["The inverse Jacobian is evaluated at the preimage", "逆映射的雅可比行列式在原像处计算"],
  [
    "The inverse function theorem says that the Jacobian of $T^{-1}$ at $T(P)$ is the reciprocal of the Jacobian of $T$ at $P$. So given a point in the image, first find the point it came from, and only then evaluate the Jacobian of $T$.",
    "反函数定理指出，$T^{-1}$ 在 $T(P)$ 处的雅可比行列式，是 $T$ 在 $P$ 处雅可比行列式的倒数。所以给定像中的点，要先求它来自哪一点，然后才计算 $T$ 的雅可比行列式。",
  ],
  (rng) => {
    const a = nz(rng, 4);
    const b0 = nz(rng, 5);
    const b = 2 * a * a === b0 ? b0 + 1 : b0;
    const u0 = a * a + b;
    const v0 = a * b;
    const J = 2 * a * a - b;
    const answer = Q.of(1, J);
    const atImage = 2 * u0 * u0 - v0;
    return ask(
      [
        `$T(x, y) = (x^{2} + y, xy)$ has $T(${a}, ${b}) = (${u0}, ${v0})$. Find the Jacobian determinant of the local inverse of $T$ at $(${u0}, ${v0})$.`,
        `$T(x, y) = (x^{2} + y, xy)$ 满足 $T(${a}, ${b}) = (${u0}, ${v0})$。求 $T$ 的局部逆映射在 $(${u0}, ${v0})$ 处的雅可比行列式。`,
      ],
      answer,
      [J, answer.neg(), atImage === 0 ? a : Q.of(1, atImage)],
      [
        `The Jacobian of $T$ is $2x^{2} - y$, to be evaluated at the preimage $(${a}, ${b})$, where it is $${J}$. The inverse has the reciprocal, $${answer.toLatex()}$.`,
        `$T$ 的雅可比行列式是 $2x^{2} - y$，要在原像 $(${a}, ${b})$ 处计算，得 $${J}$。逆映射的值是它的倒数 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const triangularJacobian3 = point(
  "a-triangular-three-dimensional-jacobian",
  ["A triangular three-dimensional Jacobian", "三角形的三维雅可比行列式"],
  [
    "If each new variable involves the old ones in a staged way, the Jacobian matrix is triangular after ordering, and its determinant is the product of the diagonal entries. The off-diagonal terms have no effect, which saves expanding a three by three determinant.",
    "如果每个新变量分阶段地依赖旧变量，雅可比矩阵排序后是三角矩阵，行列式等于对角元素之积。非对角项不起作用，这省去了展开三阶行列式的工作。",
  ],
  (rng) => {
    const a = nz(rng, 5);
    const b = nz(rng, 5);
    const c = nz(rng, 5);
    const v0 = nz(rng, 4);
    const answer = 2 * a * c * v0;
    const M = `\\begin{pmatrix} ${a} & 0 & 0 \\\\ ${b} & ${2 * v0} & 0 \\\\ 1 & 0 & ${c} \\end{pmatrix}`;
    return ask(
      [
        `For $x = ${poly([a, "u"])}$, $y = ${poly([b, "u"], [1, "v^{2}"])}$, $z = ${poly([1, "u"], [c, "w"])}$, find $\\frac{\\partial(x, y, z)}{\\partial(u, v, w)}$ at $v = ${v0}$.`,
        `对 $x = ${poly([a, "u"])}$，$y = ${poly([b, "u"], [1, "v^{2}"])}$，$z = ${poly([1, "u"], [c, "w"])}$，求 $v = ${v0}$ 时的 $\\frac{\\partial(x, y, z)}{\\partial(u, v, w)}$。`,
      ],
      answer,
      [a * c, -answer, 2 * a * b * c * v0],
      [
        `The matrix is $${M}$, which is lower triangular. The determinant is the product of the diagonal entries, $${answer}$.`,
        `矩阵是 $${M}$，它是下三角矩阵。行列式是对角元素之积，等于 $${answer}$。`,
      ],
    );
  },
);

const secondMultiplier = point(
  "finding-the-second-multiplier",
  ["Finding the second multiplier", "求第二个乘数"],
  [
    "With two constraints the condition is $\\nabla f = \\lambda\\nabla g + \\mu\\nabla h$, a vector equation. After finding the point from the constraints and symmetry, the components give the multipliers. Each multiplier measures how fast the optimal value changes as its constraint moves.",
    "有两个约束时，条件是向量方程 $\\nabla f = \\lambda\\nabla g + \\mu\\nabla h$。由约束和对称性求出点后，各分量给出乘数。每个乘数度量最优值随相应约束变化的速度。",
  ],
  (rng) => {
    const B = nz(rng, 9);
    const s = nz(rng, 6);
    const A = B + 2 * s;
    const answer = 3 * B - A;
    return ask(
      [
        `Minimize $x^{2} + y^{2} + z^{2}$ subject to $x + y + z = ${A}$ and $z = ${B}$. With $g = x + y + z$ and $h = z$, the condition is $\\nabla f = \\lambda\\nabla g + \\mu\\nabla h$. Find $\\mu$.`,
        `在 $x + y + z = ${A}$，$z = ${B}$ 的条件下，求 $x^{2} + y^{2} + z^{2}$ 的最小值。取 $g = x + y + z$，$h = z$，条件是 $\\nabla f = \\lambda\\nabla g + \\mu\\nabla h$。求 $\\mu$。`,
      ],
      answer,
      [2 * s, 2 * B, A - B],
      [
        `By symmetry $x = y = ${s}$, with $z = ${B}$. The first component gives $\\lambda = ${2 * s}$, and the third gives $${2 * B} = ${paren(2 * s)} + \\mu$, so $\\mu = ${answer}$.`,
        `由对称性 $x = y = ${s}$，且 $z = ${B}$。第一个分量给出 $\\lambda = ${2 * s}$，第三个分量给出 $${2 * B} = ${paren(2 * s)} + \\mu$，所以 $\\mu = ${answer}$。`,
      ],
    );
  },
);

const newtonDeterminant = point(
  "the-determinant-that-decides-if-a-newton-step-exists",
  ["The determinant that decides if a Newton step exists", "决定牛顿步是否存在的行列式"],
  [
    "A Newton step for a system solves a linear system with the Jacobian as its matrix. If the determinant at the starting point is zero, the step does not exist, however good the guess looks. So this is the first thing to check at a symmetric starting point.",
    "方程组的牛顿步要解一个以雅可比矩阵为系数的线性方程组。如果起点处的行列式为零，无论猜测看起来多好，这一步都不存在。所以在对称的起点，首先要检查这一点。",
  ],
  (rng) => {
    const R = rng.int(2, 9);
    const k = nz(rng, 12);
    const x0 = nz(rng, 6);
    const y0 = nz(rng, 6);
    const answer = 2 * x0 * x0 - 2 * y0 * y0;
    return ask(
      [
        `For Newton's method on $x^{2} + y^{2} = ${R * R}$, $${poly([1, "xy"])} = ${k}$, find the determinant of the Jacobian at the starting point $(${x0}, ${y0})$.`,
        `对 $x^{2} + y^{2} = ${R * R}$，$${poly([1, "xy"])} = ${k}$ 用牛顿法，求起点 $(${x0}, ${y0})$ 处雅可比矩阵的行列式。`,
      ],
      answer,
      [2 * x0 * x0 + 2 * y0 * y0, -answer, 4 * x0 * y0],
      [
        `The Jacobian is $\\begin{pmatrix} 2x & 2y \\\\ y & x \\end{pmatrix}$, with determinant $2x^{2} - 2y^{2}$. At the point this is $${answer}$${answer === 0 ? ", so no step exists from here" : ""}.`,
        `雅可比矩阵是 $\\begin{pmatrix} 2x & 2y \\\\ y & x \\end{pmatrix}$，行列式是 $2x^{2} - 2y^{2}$。在该点等于 $${answer}$${answer === 0 ? "，所以从这里无法迈出一步" : ""}。`,
      ],
    );
  },
);

const newtonQuadratic = point(
  "one-newton-step-solves-a-quadratic",
  ["One Newton step solves a quadratic", "一次牛顿步解决二次函数"],
  [
    "Newton's method for optimization replaces $f$ by its second-order Taylor model and goes to the critical point of the model. If $f$ is itself quadratic, the model equals $f$, so one step from any start lands exactly on the critical point.",
    "优化的牛顿法用二阶泰勒模型代替 $f$，并走到模型的临界点。如果 $f$ 本身是二次函数，模型就等于 $f$，所以从任何起点出发，一步就恰好到达临界点。",
  ],
  (rng) => {
    const p = rng.int(1, 4);
    const r = rng.int(1, 4);
    const q = rng.pick([-1, 0, 1]);
    const xs = nz(rng, 6);
    const ys = nz(rng, 6);
    const a = -2 * p * xs - q * ys;
    const b = -q * xs - 2 * r * ys;
    const x0 = rng.int(-9, 9);
    const y0 = rng.int(-9, 9);
    const useX = rng.bool();
    const answer = useX ? xs : ys;
    const f = poly([p, "x^{2}"], [q, "xy"], [r, "y^{2}"], [a, "x"], [b, "y"]);
    const name = useX ? "x_{1}" : "y_{1}";
    return ask(
      [
        `One step of Newton's method for optimization is applied to $f(x, y) = ${f}$ from $(${x0}, ${y0})$, reaching $(x_{1}, y_{1})$. Find $${name}$.`,
        `从 $(${x0}, ${y0})$ 出发，对 $f(x, y) = ${f}$ 做一次优化的牛顿步，到达 $(x_{1}, y_{1})$。求 $${name}$。`,
      ],
      answer,
      [useX ? x0 : y0, useX ? ys : xs, -answer],
      [
        `$f$ is quadratic with a nonsingular Hessian, so one step reaches its critical point from any start. Solving $${poly([2 * p, "x"], [q, "y"], [a, ""])} = 0$ and $${poly([q, "x"], [2 * r, "y"], [b, ""])} = 0$ gives $(${xs}, ${ys})$.`,
        `$f$ 是二次函数，黑塞矩阵非奇异，所以从任何起点出发，一步就到达临界点。解 $${poly([2 * p, "x"], [q, "y"], [a, ""])} = 0$ 和 $${poly([q, "x"], [2 * r, "y"], [b, ""])} = 0$，得 $(${xs}, ${ys})$。`,
      ],
    );
  },
);

/** gridSum adds a linear function over the chosen corners of a grid and multiplies by the cell areas. */
function gridSum(
  xs: readonly number[],
  ys: readonly number[],
  f: (x: number, y: number) => number,
  pickX: "low" | "high",
  pickY: "low" | "high",
): number {
  let total = 0;
  for (let i = 0; i + 1 < xs.length; i++) {
    for (let j = 0; j + 1 < ys.length; j++) {
      const x0 = xs[i] as number;
      const x1 = xs[i + 1] as number;
      const y0 = ys[j] as number;
      const y1 = ys[j + 1] as number;
      total += f(pickX === "low" ? x0 : x1, pickY === "low" ? y0 : y1) * (x1 - x0) * (y1 - y0);
    }
  }
  return total;
}

/** evenGrid builds the division points of an equal partition. */
const evenGrid = (n: number, step: number) => [...Array(n + 1).keys()].map((i) => i * step);

const lowerDecreasing = point(
  "a-lower-sum-for-a-decreasing-function",
  ["A lower sum for a decreasing function", "递减函数的下和"],
  [
    "A lower sum uses the smallest value on each cell. For a function decreasing in both variables, that value is at the corner with the largest coordinates, the opposite of an increasing function. So check the direction of change before choosing corners.",
    "下和用每个小格上的最小值。对两个变量都递减的函数，这个值在坐标最大的角上，与递增函数相反。所以选角之前要先判断变化方向。",
  ],
  (rng) => {
    const a = rng.int(1, 4);
    const b = rng.int(1, 4);
    const m = rng.int(2, 3);
    const n = rng.int(2, 3);
    const dx = rng.int(1, 2);
    const dy = rng.int(1, 2);
    const W = m * dx;
    const H = n * dy;
    const c = a * W + b * H + rng.int(1, 12);
    const f = (x: number, y: number) => c - a * x - b * y;
    const xs = evenGrid(m, dx);
    const ys = evenGrid(n, dy);
    const answer = gridSum(xs, ys, f, "high", "high");
    return ask(
      [
        `Find the lower Riemann sum of $f(x, y) = ${poly([c, ""], [-a, "x"], [-b, "y"])}$ on $[0, ${W}] \\times [0, ${H}]$, using $${m}$ equal parts in $x$ and $${n}$ equal parts in $y$.`,
        `求 $f(x, y) = ${poly([c, ""], [-a, "x"], [-b, "y"])}$ 在 $[0, ${W}] \\times [0, ${H}]$ 上的黎曼下和，$x$ 方向等分为 $${m}$ 份，$y$ 方向等分为 $${n}$ 份。`,
      ],
      answer,
      [gridSum(xs, ys, f, "low", "low"), gridSum(xs, ys, f, "high", "low"), gridSum(xs, ys, f, "low", "high")],
      [
        `$f$ decreases in both variables, so its minimum on each cell is at the upper right corner. Each cell has area $${dx * dy}$, and adding these corner values times the area gives $${answer}$.`,
        `$f$ 对两个变量都递减，所以每格的最小值在右上角。每格面积是 $${dx * dy}$，把这些角上的值乘以面积相加，得 $${answer}$。`,
      ],
    );
  },
);

const upperDecreasing = point(
  "an-upper-sum-for-a-decreasing-function",
  ["An upper sum for a decreasing function", "递减函数的上和"],
  [
    "An upper sum uses the largest value on each cell. For a function decreasing in both variables, that value is at the corner with the smallest coordinates. A sum that uses upper right corners here would give a lower sum instead of an upper one.",
    "上和用每个小格上的最大值。对两个变量都递减的函数，这个值在坐标最小的角上。这里如果用右上角，得到的就是下和，而不是上和。",
  ],
  (rng) => {
    const a = rng.int(1, 4);
    const b = rng.int(1, 4);
    const m = rng.int(2, 3);
    const n = rng.int(2, 3);
    const dx = rng.int(1, 2);
    const dy = rng.int(1, 2);
    const W = m * dx;
    const H = n * dy;
    const c = a * W + b * H + rng.int(1, 12);
    const f = (x: number, y: number) => c - a * x - b * y;
    const xs = evenGrid(m, dx);
    const ys = evenGrid(n, dy);
    const answer = gridSum(xs, ys, f, "low", "low");
    return ask(
      [
        `Find the upper Riemann sum of $f(x, y) = ${poly([c, ""], [-a, "x"], [-b, "y"])}$ on $[0, ${W}] \\times [0, ${H}]$, using $${m}$ equal parts in $x$ and $${n}$ equal parts in $y$.`,
        `求 $f(x, y) = ${poly([c, ""], [-a, "x"], [-b, "y"])}$ 在 $[0, ${W}] \\times [0, ${H}]$ 上的黎曼上和，$x$ 方向等分为 $${m}$ 份，$y$ 方向等分为 $${n}$ 份。`,
      ],
      answer,
      [gridSum(xs, ys, f, "high", "high"), gridSum(xs, ys, f, "high", "low"), gridSum(xs, ys, f, "low", "high")],
      [
        `$f$ decreases in both variables, so its maximum on each cell is at the lower left corner. Each cell has area $${dx * dy}$, and adding these corner values times the area gives $${answer}$.`,
        `$f$ 对两个变量都递减，所以每格的最大值在左下角。每格面积是 $${dx * dy}$，把这些角上的值乘以面积相加，得 $${answer}$。`,
      ],
    );
  },
);

/** cuts picks an unequal partition with the given number of parts, starting from zero. */
function cuts(rng: Rng, parts: number): number[] {
  const out = [0];
  for (let i = 0; i < parts; i++) out.push((out[i] as number) + rng.int(1, 3));
  return out;
}

/** list writes division points for a partition. */
const list = (points: readonly number[]) => points.join(", ");

const lowerMixed = point(
  "a-lower-sum-when-the-variables-pull-in-opposite-ways",
  ["A lower sum when the variables pull in opposite ways", "变量作用相反时的下和"],
  [
    "When $f$ increases in $x$ and decreases in $y$, the minimum on a cell is at the left side and the top, which is the upper left corner. With unequal partitions, each cell also has its own area, so the widths must be tracked term by term.",
    "当 $f$ 关于 $x$ 递增、关于 $y$ 递减时，每格的最小值在左侧和顶部，即左上角。在不等分的分割下，每格的面积也不同，所以要逐项记录宽度。",
  ],
  (rng) => {
    const a = rng.int(1, 4);
    const b = rng.int(1, 4);
    const xs = cuts(rng, 2);
    const ys = cuts(rng, 2);
    const f = (x: number, y: number) => a * x - b * y;
    const answer = gridSum(xs, ys, f, "low", "high");
    const W = xs[2] as number;
    const H = ys[2] as number;
    return ask(
      [
        `Find the lower Riemann sum of $f(x, y) = ${poly([a, "x"], [-b, "y"])}$ on $[0, ${W}] \\times [0, ${H}]$, with $x$ divided at $${list(xs)}$ and $y$ divided at $${list(ys)}$.`,
        `求 $f(x, y) = ${poly([a, "x"], [-b, "y"])}$ 在 $[0, ${W}] \\times [0, ${H}]$ 上的黎曼下和，$x$ 的分点是 $${list(xs)}$，$y$ 的分点是 $${list(ys)}$。`,
      ],
      answer,
      [gridSum(xs, ys, f, "high", "low"), gridSum(xs, ys, f, "low", "low"), gridSum(xs, ys, f, "high", "high")],
      [
        `$f$ is smallest at the left end in $x$ and the top end in $y$, so each cell uses its upper left corner. Multiplying each value by the area of its cell and adding gives $${answer}$.`,
        `$f$ 在 $x$ 的左端和 $y$ 的上端最小，所以每格用左上角。把每个值乘以所在小格的面积再相加，得 $${answer}$。`,
      ],
    );
  },
);

const upperMixed = point(
  "an-upper-sum-when-the-variables-pull-in-opposite-ways",
  ["An upper sum when the variables pull in opposite ways", "变量作用相反时的上和"],
  [
    "When $f$ increases in $x$ and decreases in $y$, the maximum on a cell is at the right side and the bottom, which is the lower right corner. Neither the upper right nor the lower left corner gives an upper sum for such a function.",
    "当 $f$ 关于 $x$ 递增、关于 $y$ 递减时，每格的最大值在右侧和底部，即右下角。对这样的函数，右上角和左下角都不能给出上和。",
  ],
  (rng) => {
    const a = rng.int(1, 4);
    const b = rng.int(1, 4);
    const xs = cuts(rng, 2);
    const ys = cuts(rng, 2);
    const f = (x: number, y: number) => a * x - b * y;
    const answer = gridSum(xs, ys, f, "high", "low");
    const W = xs[2] as number;
    const H = ys[2] as number;
    return ask(
      [
        `Find the upper Riemann sum of $f(x, y) = ${poly([a, "x"], [-b, "y"])}$ on $[0, ${W}] \\times [0, ${H}]$, with $x$ divided at $${list(xs)}$ and $y$ divided at $${list(ys)}$.`,
        `求 $f(x, y) = ${poly([a, "x"], [-b, "y"])}$ 在 $[0, ${W}] \\times [0, ${H}]$ 上的黎曼上和，$x$ 的分点是 $${list(xs)}$，$y$ 的分点是 $${list(ys)}$。`,
      ],
      answer,
      [gridSum(xs, ys, f, "low", "high"), gridSum(xs, ys, f, "high", "high"), gridSum(xs, ys, f, "low", "low")],
      [
        `$f$ is largest at the right end in $x$ and the bottom end in $y$, so each cell uses its lower right corner. Multiplying each value by the area of its cell and adding gives $${answer}$.`,
        `$f$ 在 $x$ 的右端和 $y$ 的下端最大，所以每格用右下角。把每个值乘以所在小格的面积再相加，得 $${answer}$。`,
      ],
    );
  },
);

const howFine = point(
  "how-fine-a-partition-must-be",
  ["How fine a partition must be", "分割要多细"],
  [
    "The definition of the double integral asks that the gap between upper and lower sums can be made as small as desired. For a linear increasing function with $n$ parts each way, the gap is a constant divided by $n$, so a required tolerance gives the size of $n$.",
    "二重积分的定义要求上和与下和之差可以任意小。对线性递增函数，每个方向分为 $n$ 份时，差是一个常数除以 $n$，所以给定容差就能确定 $n$ 的大小。",
  ],
  (rng) => {
    const a = rng.int(1, 5);
    const b = rng.int(1, 5);
    const W = rng.int(1, 6);
    const H = rng.int(1, 6);
    const E = rng.pick([1, 2, 3, 5]);
    const G = (a * W + b * H) * W * H;
    const answer = Math.floor(G / E) + 1;
    return ask(
      [
        `For $f(x, y) = ${poly([a, "x"], [b, "y"])}$ on $[0, ${W}] \\times [0, ${H}]$, with $n$ equal parts in each direction, find the smallest $n$ such that $U(f, P) - L(f, P) < ${E}$.`,
        `对 $[0, ${W}] \\times [0, ${H}]$ 上的 $f(x, y) = ${poly([a, "x"], [b, "y"])}$，每个方向等分为 $n$ 份，求使 $U(f, P) - L(f, P) < ${E}$ 的最小 $n$。`,
      ],
      answer,
      [Math.max(answer - 1, 1) === answer ? answer + 1 : answer - 1, G, W * H],
      [
        `Each cell contributes its area times the increase across it, and the areas add to $${W * H}$, so the gap is $\\frac{${G}}{n}$. We need $n > ${Q.of(G, E).toLatex()}$, so the smallest integer is $${answer}$.`,
        `每格贡献面积乘以格内的增量，面积之和是 $${W * H}$，所以差是 $\\frac{${G}}{n}$。需要 $n > ${Q.of(G, E).toLatex()}$，所以最小的整数是 $${answer}$。`,
      ],
    );
  },
);

const moment = point(
  "a-nonconstant-integrand-between-a-line-and-a-parabola",
  ["A nonconstant integrand between a line and a parabola", "直线与抛物线之间的非常数被积函数"],
  [
    "Over the region between $y = x^{2}$ and $y = mx$, the $y$ integral gives the height $mx - x^{2}$, and the integrand $x$ then multiplies it. The limits for $x$ come from where the curves meet, which is $x = 0$ and $x = m$ here.",
    "在 $y = x^{2}$ 和 $y = mx$ 之间的区域上，对 $y$ 积分得到高度 $mx - x^{2}$，再乘以被积函数 $x$。$x$ 的积分限来自两曲线的交点，这里是 $x = 0$ 和 $x = m$。",
  ],
  (rng) => {
    const m = rng.int(1, 6);
    const c = rng.int(1, 12);
    const answer = Q.of(c * m ** 4, 12);
    return ask(
      [
        `Evaluate $\\iint_{D} ${poly([c, "x"])}\\,dA$, where $D$ is the region between $y = x^{2}$ and $y = ${poly([m, "x"])}$.`,
        `求 $\\iint_{D} ${poly([c, "x"])}\\,dA$，其中 $D$ 是 $y = x^{2}$ 和 $y = ${poly([m, "x"])}$ 之间的区域。`,
      ],
      answer,
      [Q.of(c * m ** 3, 6), Q.of(c * m ** 4, 4), Q.of(c * m ** 4, 3)],
      [
        `The curves meet at $x = 0$ and $x = ${m}$. The integral is $\\int_{0}^{${m}} ${poly([c, "x"])}(${poly([m, "x"], [-1, "x^{2}"])}) \\, dx$, which equals $${answer.toLatex()}$.`,
        `两曲线交于 $x = 0$ 和 $x = ${m}$。积分是 $\\int_{0}^{${m}} ${poly([c, "x"])}(${poly([m, "x"], [-1, "x^{2}"])}) \\, dx$，等于 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const typeTwoY = point(
  "integrating-y-over-a-region-with-horizontal-strips",
  ["Integrating y over a region with horizontal strips", "用水平条带对 y 积分"],
  [
    "A region bounded by $x = y^{2}$ on the left and a vertical line on the right is best described by horizontal strips. The $x$ integral gives the width of a strip, $a^{2} - y^{2}$, and the integrand $y$ multiplies it in the outer integral.",
    "左边界是 $x = y^{2}$、右边界是竖直线的区域，最好用水平条带描述。对 $x$ 积分得到条带的宽度 $a^{2} - y^{2}$，在外层积分中再乘以被积函数 $y$。",
  ],
  (rng) => {
    const a = rng.int(1, 6);
    const c = rng.int(1, 12);
    const answer = Q.of(c * a ** 4, 4);
    return ask(
      [
        `Evaluate $\\iint_{D} ${poly([c, "y"])}\\,dA$, where $D = \\{(x, y) : 0 \\le y \\le ${a},\\ y^{2} \\le x \\le ${a * a}\\}$.`,
        `求 $\\iint_{D} ${poly([c, "y"])}\\,dA$，其中 $D = \\{(x, y) : 0 \\le y \\le ${a},\\ y^{2} \\le x \\le ${a * a}\\}$。`,
      ],
      answer,
      [Q.of(c * a ** 4, 2), Q.of(c * a ** 3, 3), Q.of(c * a ** 4, 12)],
      [
        `The strip at height $y$ has width $${poly([a * a, ""], [-1, "y^{2}"])}$. So the integral is $\\int_{0}^{${a}} ${poly([c, "y"])}(${poly([a * a, ""], [-1, "y^{2}"])}) \\, dy = ${answer.toLatex()}$.`,
        `高度为 $y$ 的条带宽度是 $${poly([a * a, ""], [-1, "y^{2}"])}$。所以积分是 $\\int_{0}^{${a}} ${poly([c, "y"])}(${poly([a * a, ""], [-1, "y^{2}"])}) \\, dy = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const withHole = point(
  "a-region-with-a-rectangular-hole",
  ["A region with a rectangular hole", "带矩形空洞的区域"],
  [
    "Additivity also works by subtraction. An integral over a rectangle with a hole equals the integral over the whole rectangle minus the integral over the hole, which is usually faster than dividing the remaining region into four rectangles.",
    "可加性也可以用减法。带空洞的矩形上的积分，等于整个矩形上的积分减去空洞上的积分，这通常比把剩余区域分成四个矩形更快。",
  ],
  (rng) => {
    const a = rng.int(1, 3);
    const b = a + rng.int(1, 3);
    const W = b + rng.int(1, 3);
    const c = rng.int(1, 3);
    const d = c + rng.int(1, 3);
    const H = d + rng.int(1, 3);
    const whole = Q.of(W * W * H, 2);
    const hole = Q.of((b * b - a * a) * (d - c), 2);
    const answer = whole.sub(hole);
    return ask(
      [
        `Evaluate $\\iint_{R} x\\,dA$, where $R$ is $[0, ${W}] \\times [0, ${H}]$ with the open rectangle $(${a}, ${b}) \\times (${c}, ${d})$ removed.`,
        `求 $\\iint_{R} x\\,dA$，其中 $R$ 是 $[0, ${W}] \\times [0, ${H}]$ 去掉开矩形 $(${a}, ${b}) \\times (${c}, ${d})$。`,
      ],
      answer,
      [whole, hole, whole.add(hole)],
      [
        `Over the whole rectangle the integral is $${whole.toLatex()}$, and over the hole it is $${hole.toLatex()}$. Subtracting gives $${answer.toLatex()}$.`,
        `整个矩形上的积分是 $${whole.toLatex()}$，空洞上的积分是 $${hole.toLatex()}$。相减得 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const sumLimit = point(
  "an-inner-limit-that-is-a-sum",
  ["An inner limit that is a sum", "内层积分限是和式"],
  [
    "In a repeated integral each limit may depend on the variables of the outer integrals. So integrating with an upper limit such as $x + y$ leaves a function of $x$ and $y$, and the integrals have to be worked from the inside out in that order.",
    "在累次积分中，每个积分限都可以依赖外层积分的变量。所以上限如 $x + y$ 的积分留下 $x$ 和 $y$ 的函数，必须按这个顺序由内向外计算。",
  ],
  (rng) => {
    const a = rng.int(1, 5);
    const k = rng.int(1, 12);
    const answer = Q.of(k * a ** 3, 2);
    return ask(
      [
        `Evaluate $\\int_{0}^{${a}} \\int_{0}^{x} \\int_{0}^{x + y} ${k}\\,dz\\,dy\\,dx$.`,
        `求 $\\int_{0}^{${a}} \\int_{0}^{x} \\int_{0}^{x + y} ${k}\\,dz\\,dy\\,dx$。`,
      ],
      answer,
      [Q.of(k * a ** 3, 3), Q.of(k * a ** 3, 6), k * a ** 3],
      [
        `The inner integral gives $${k}(x + y)$. Integrating over $y$ from $0$ to $x$ gives $${k} \\cdot \\frac{3x^{2}}{2}$, and integrating over $x$ gives $${answer.toLatex()}$.`,
        `内层积分给出 $${k}(x + y)$。对 $y$ 从 $0$ 积到 $x$，得 $${k} \\cdot \\frac{3x^{2}}{2}$；再对 $x$ 积分，得 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const tetraVolume = point(
  "the-volume-of-a-tetrahedron-from-its-plane",
  ["The volume of a tetrahedron from its plane", "由平面求四面体的体积"],
  [
    "The tetrahedron cut from the first octant by a plane has intercepts $a$, $b$, $c$ and volume $\\frac{abc}{6}$. It can be seen as a region of any of the three types, and whichever projection is used, the triple integral gives the same result.",
    "平面从第一卦限切出的四面体，截距为 $a$、$b$、$c$，体积是 $\\frac{abc}{6}$。它可以看作三种类型中的任何一种，无论用哪种投影，三重积分都给出相同的结果。",
  ],
  (rng) => {
    const p = rng.int(1, 4);
    const q = rng.int(1, 4);
    const r = rng.int(1, 4);
    const s = rng.pick([12, 24, 6, 18, 36]);
    const answer = Q.of(s ** 3, 6 * p * q * r);
    return ask(
      [
        `$E$ is the tetrahedron bounded by the coordinate planes and $${poly([p, "x"], [q, "y"], [r, "z"])} = ${s}$. Find its volume.`,
        `$E$ 是由坐标平面和 $${poly([p, "x"], [q, "y"], [r, "z"])} = ${s}$ 围成的四面体。求它的体积。`,
      ],
      answer,
      [Q.of(s ** 3, p * q * r), Q.of(s ** 3, 3 * p * q * r), Q.of(s ** 3, 2 * p * q * r)],
      [
        `The intercepts are $${Q.of(s, p).toLatex()}$, $${Q.of(s, q).toLatex()}$ and $${Q.of(s, r).toLatex()}$. The volume is their product divided by $6$, which is $${answer.toLatex()}$.`,
        `截距是 $${Q.of(s, p).toLatex()}$、$${Q.of(s, q).toLatex()}$ 和 $${Q.of(s, r).toLatex()}$。体积是它们的积除以 $6$，等于 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const yBetweenSurfaces = point(
  "two-curved-surfaces-as-limits",
  ["Two curved surfaces as limits", "以两个曲面为积分限"],
  [
    "For a region of type II, the $y$ limits can both be curved. Only their difference matters when finding the volume, so in the integral of $(x^{2} + kz) - x^{2}$ the curved part disappears, and only the term $kz$ remains to be integrated.",
    "对二型区域，$y$ 的上下限都可以是曲面。求体积时只有它们的差起作用，所以在 $(x^{2} + kz) - x^{2}$ 的积分中，曲面部分消失，只剩 $kz$ 项需要积分。",
  ],
  (rng) => {
    const a = rng.int(1, 6);
    const b = rng.int(1, 6);
    const k = rng.int(1, 6);
    const answer = Q.of(a * k * b * b, 2);
    return ask(
      [
        `Find the volume of $E = \\{(x, y, z) : 0 \\le x \\le ${a},\\ 0 \\le z \\le ${b},\\ x^{2} \\le y \\le ${poly([1, "x^{2}"], [k, "z"])}\\}$.`,
        `求 $E = \\{(x, y, z) : 0 \\le x \\le ${a},\\ 0 \\le z \\le ${b},\\ x^{2} \\le y \\le ${poly([1, "x^{2}"], [k, "z"])}\\}$ 的体积。`,
      ],
      answer,
      [a * k * b, a * k * b * b, Q.of(a ** 3, 3).add(answer)],
      [
        `The length in the $y$ direction is $${poly([k, "z"])}$. So the volume is $\\int_{0}^{${a}} \\int_{0}^{${b}} ${poly([k, "z"])} \\, dz \\, dx = ${answer.toLatex()}$.`,
        `$y$ 方向的长度是 $${poly([k, "z"])}$。所以体积是 $\\int_{0}^{${a}} \\int_{0}^{${b}} ${poly([k, "z"])} \\, dz \\, dx = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const xOverTypeThree = point(
  "integrating-x-with-a-limit-depending-on-two-variables",
  ["Integrating x with a limit depending on two variables", "积分限依赖两个变量时对 x 积分"],
  [
    "For a region of type III, the inner integral in $x$ can have a limit such as $y + z$. Integrating the function $x$ gives half of the square of this limit, and expanding the square is needed before the other two integrations.",
    "对三型区域，$x$ 的内层积分可以有 $y + z$ 这样的积分限。对函数 $x$ 积分，得到这个积分限平方的一半，在另外两次积分之前要先展开平方。",
  ],
  (rng) => {
    const a = rng.int(1, 6);
    const b = rng.int(1, 6);
    const answer = Q.of(a ** 3 * b, 6)
      .add(Q.of(a * a * b * b, 4))
      .add(Q.of(a * b ** 3, 6));
    const once = Q.of(a * a * b, 2).add(Q.of(a * b * b, 2));
    return ask(
      [
        `Evaluate $\\iiint_{E} x\\,dV$, where $E = \\{(x, y, z) : 0 \\le y \\le ${a},\\ 0 \\le z \\le ${b},\\ 0 \\le x \\le y + z\\}$.`,
        `求 $\\iiint_{E} x\\,dV$，其中 $E = \\{(x, y, z) : 0 \\le y \\le ${a},\\ 0 \\le z \\le ${b},\\ 0 \\le x \\le y + z\\}$。`,
      ],
      answer,
      [once, answer.mul(Q.of(2)), answer.mul(Q.of(1, 2))],
      [
        `The inner integral gives $\\frac{(y + z)^{2}}{2}$. Expanding and integrating over the rectangle gives $${Q.of(a ** 3 * b, 6).toLatex()} + ${Q.of(a * a * b * b, 4).toLatex()} + ${Q.of(a * b ** 3, 6).toLatex()} = ${answer.toLatex()}$.`,
        `内层积分给出 $\\frac{(y + z)^{2}}{2}$。展开后在矩形上积分，得 $${Q.of(a ** 3 * b, 6).toLatex()} + ${Q.of(a * a * b * b, 4).toLatex()} + ${Q.of(a * b ** 3, 6).toLatex()} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

/** deeperMultivariableCalculusThirdPoints maps topics of Multivariable Calculus, from vector-valued functions to triple integrals, to a third knowledge point. */
export const deeperMultivariableCalculusThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "the-domain-of-a-vector-valued-function": [domainCount],
  "continuity-and-differentiability-of-vector-valued-functions": [smoothJoin],
  "integration-rules-for-vector-valued-functions": [fromAcceleration],
  "unit-tangent-vectors": [tangentOnStraightPath],
  "principal-normal-vectors": [normalOfParabola],
  "the-osculating-plane": [helixBinormal],
  "vector-fields": [inverseSquare],
  "gradient-vector-fields": [crossPartials],
  "calculating-potential-functions": [potentialConstant],
  "connected-and-simply-connected-regions": [componentCount],
  "interior-and-boundary-points": [roomInside],
  "interiors-and-boundaries-of-sets": [annulusBoundary],
  "open-and-closed-sets": [complementKind],
  "level-surfaces": [levelToAxis],
  cylinders: [cylinderSlice],
  "intersections-of-lines-and-planes-with-surfaces": [planeMeetsParaboloid],
  "introduction-to-partial-derivatives": [coefficientFromPartial],
  "computing-partial-derivatives-using-the-rules-of-differentiation": [innerFactor],
  "geometric-interpretations-of-partial-derivatives": [tangentLineHeight],
  "partial-differentiability-of-multivariable-functions": [pathLimit],
  "the-gradient-vector": [steepestDescent],
  "tangent-planes-to-level-surfaces": [parallelTangentPlane],
  "the-multivariable-mean-value-theorem": [mvtBound],
  "the-multivariable-chain-rule-with-polar-coordinates": [cartesianFromPolar],
  "the-multivariable-chain-rule-in-vector-form": [movingAlongLevel],
  differentials: [worstError],
  "the-image-of-an-affine-transformation": [affinePreimage],
  "nonlinear-transformations-of-plane-regions": [squarePreimage],
  "transformations-of-regions-between-curves": [areaBetweenHyperbolas],
  "the-jacobian": [singularJacobian],
  "the-inverse-function-theorem": [inverseAtImage],
  "the-jacobian-of-a-three-dimensional-transformation": [triangularJacobian3],
  "lagrange-multipliers-with-multiple-constraints": [secondMultiplier],
  "newtons-method-for-multivariable-functions": [newtonDeterminant],
  "newtons-method-for-optimizing-multivariable-functions": [newtonQuadratic],
  "approximating-volumes-using-lower-riemann-sums": [lowerDecreasing],
  "approximating-volumes-using-upper-riemann-sums": [upperDecreasing],
  "lower-riemann-sums-over-general-rectangular-partitions": [lowerMixed],
  "upper-riemann-sums-over-general-rectangular-partitions": [upperMixed],
  "defining-double-integrals-using-lower-and-upper-riemann-sums": [howFine],
  "double-integrals-over-non-rectangular-domains": [moment],
  "double-integrals-over-type-ii-regions": [typeTwoY],
  "double-integrals-over-partitioned-regions": [withHole],
  "repeated-integrals-in-three-dimensions": [sumLimit],
  "type-i-ii-and-iii-regions-in-three-dimensional-space": [tetraVolume],
  "triple-integrals-over-type-ii-regions": [yBetweenSurfaces],
  "triple-integrals-over-type-iii-regions": [xOverTypeThree],
};
