// A third knowledge point for the Precalculus topics on vectors, matrices and linear transformations.

import type { KnowledgePointDef } from "@ga/content";
import { Q } from "@ga/subject-math";

import { choose, type Pair, whole } from "./early-grades-more-kit.ts";
import { chooseFilled, frac, fraction, integer, skill } from "./third-kit.ts";

/** vec writes a vector in angle brackets. */
const vec = (...xs: readonly number[]) => `\\langle ${xs.join(", ")} \\rangle`;

/** mat writes a matrix from its rows. */
const mat = (...rows: readonly (readonly (number | string)[])[]) =>
  `\\begin{pmatrix} ${rows.map((r) => r.join(" & ")).join(" \\\\ ")} \\end{pmatrix}`;

/** nz picks a nonzero integer of size at most n. */
const nz = (rng: { int: (a: number, b: number) => number; bool: () => boolean }, n: number) => rng.int(1, n) * (rng.bool() ? 1 : -1);

/** paren writes a negative number in parentheses. */
const paren = (n: number) => (n < 0 ? `(${n})` : `${n}`);

/** triples lists Pythagorean triples for lengths that come out whole. */
const triples: readonly (readonly [number, number, number])[] = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [9, 12, 15],
  [8, 15, 17],
  [12, 16, 20],
  [7, 24, 25],
  [15, 20, 25],
  [10, 24, 26],
  [20, 21, 29],
];

/** deeperPrecalculusThird2Points holds these third knowledge points, by topic. */
export const deeperPrecalculusThird2Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "introduction-to-vectors": [
    skill(
      "equal-vectors-in-a-parallelogram",
      ["Equal vectors in a parallelogram", "平行四边形中的相等向量"],
      [
        "Two vectors are equal when they have the same length and direction, wherever they start. Opposite sides of a parallelogram, read in the same direction, are therefore equal vectors.",
        "两个向量长度和方向都相同就相等，不管起点在哪里。所以平行四边形的对边，按相同方向读，是相等的向量。",
      ],
      (rng) => {
        const [A, B, C, D] = rng.sample(["A", "B", "C", "D", "P", "Q", "R", "S", "K", "L", "M", "N"], 4) as [
          string,
          string,
          string,
          string,
        ];
        return chooseFilled(
          rng,
          [
            `$${A}${B}${C}${D}$ is a parallelogram, with vertices in that order. Which vector equals $\\vec{${A}${B}}$?`,
            `$${A}${B}${C}${D}$ 是平行四边形，顶点按此顺序。哪个向量等于 $\\vec{${A}${B}}$？`,
          ],
          `\\vec{${D}${C}}`,
          [`\\vec{${C}${D}}`, `\\vec{${A}${D}}`, `\\vec{${B}${C}}`],
          [
            `$\\vec{${D}${C}}$ runs along the opposite side in the same direction as $\\vec{${A}${B}}$.`,
            `$\\vec{${D}${C}}$ 沿对边，方向与 $\\vec{${A}${B}}$ 相同。`,
          ],
        );
      },
    ),
  ],
  "the-triangle-law-for-the-addition-of-two-vectors": [
    skill(
      "the-longest-and-shortest-sum",
      ["The longest and shortest sum", "和的最大值和最小值"],
      [
        "The sum of two vectors is longest when they point the same way and shortest when they point in opposite ways. Every other direction gives a length between these two extremes.",
        "两个向量方向相同时和最长，方向相反时和最短。其他方向的和，长度都在这两个极值之间。",
      ],
      (rng) => {
        const a = rng.int(3, 30);
        const b = rng.int(3, 30);
        const most = rng.bool();
        return whole(
          [
            `Two vectors have magnitudes ${a} and ${b}. What is the ${most ? "greatest" : "least"} possible magnitude of their sum?`,
            `两个向量的模是 ${a} 和 ${b}。它们的和的模${most ? "最大" : "最小"}可能是多少？`,
          ],
          most ? a + b : Math.abs(a - b),
          most ? [Math.abs(a - b), Math.max(a, b), a * b] : [a + b, Math.min(a, b), Math.abs(a - b) + 1],
          [
            most ? `Pointing the same way gives $${a} + ${b}$.` : `Pointing in opposite ways gives $|${a} - ${b}|$.`,
            most ? `方向相同时是 $${a} + ${b}$。` : `方向相反时是 $|${a} - ${b}|$。`,
          ],
        );
      },
    ),
  ],
  "the-magnitude-of-a-vector": [
    skill(
      "perpendicular-vectors-and-their-sum",
      ["Perpendicular vectors and their sum", "垂直向量及其和"],
      [
        "When two vectors are perpendicular, the triangle law gives a right triangle. So the magnitude of the sum comes from the Pythagorean theorem and not from adding the magnitudes.",
        "两个向量垂直时，三角形法则得到直角三角形。所以和的模由勾股定理求，而不是把模相加。",
      ],
      (rng) => {
        const [p, q, r] = rng.pick(triples);
        const k = rng.int(1, 4);
        const [a, b, c] = [k * p, k * q, k * r];
        return whole(
          [
            `Vectors $\\mathbf{u}$ and $\\mathbf{v}$ are perpendicular, with $\\|\\mathbf{u}\\| = ${a}$ and $\\|\\mathbf{v}\\| = ${b}$. Find $\\|\\mathbf{u} + \\mathbf{v}\\|$.`,
            `向量 $\\mathbf{u}$ 和 $\\mathbf{v}$ 垂直，$\\|\\mathbf{u}\\| = ${a}$，$\\|\\mathbf{v}\\| = ${b}$。求 $\\|\\mathbf{u} + \\mathbf{v}\\|$。`,
          ],
          c,
          [a + b, b - a, a * b],
          [`$\\sqrt{${a}^{2} + ${b}^{2}} = ${c}$.`, `$\\sqrt{${a}^{2} + ${b}^{2}} = ${c}$。`],
        );
      },
    ),
  ],
  "problem-solving-using-vector-diagrams": [
    skill(
      "a-point-dividing-a-side",
      ["A point dividing a side", "分一条边的点"],
      [
        "A point that cuts a side in a given ratio gives a fraction of that side's vector. To reach it, walk to the start of the side and then along that fraction of the side.",
        "按给定比分一条边的点，对应这条边向量的若干分之几。要到达它，先走到这条边的起点，再沿这条边走这个分数。",
      ],
      (rng) => {
        const [p, q] = rng.pick<[number, number]>([
          [1, 2],
          [2, 1],
          [1, 3],
          [3, 1],
          [2, 3],
          [3, 2],
          [1, 4],
          [4, 1],
          [3, 4],
          [4, 3],
          [1, 5],
          [5, 1],
          [2, 5],
          [5, 2],
          [3, 5],
          [5, 3],
          [4, 5],
          [5, 4],
          [1, 6],
          [6, 1],
          [5, 6],
          [6, 5],
          [2, 7],
          [7, 2],
          [3, 7],
          [7, 3],
        ]);
        const t = p + q;
        const first = Q.of(q, t).toLatex();
        const second = Q.of(p, t).toLatex();
        return chooseFilled(
          rng,
          [
            `In $\\triangle OAB$, $\\vec{OA} = \\mathbf{a}$ and $\\vec{OB} = \\mathbf{b}$. Point $P$ on $AB$ has $AP : PB = ${p} : ${q}$. Find $\\vec{OP}$.`,
            `在 $\\triangle OAB$ 中，$\\vec{OA} = \\mathbf{a}$，$\\vec{OB} = \\mathbf{b}$。$AB$ 上的点 $P$ 满足 $AP : PB = ${p} : ${q}$。求 $\\vec{OP}$。`,
          ],
          `${first}\\mathbf{a} + ${second}\\mathbf{b}`,
          [`${second}\\mathbf{a} + ${first}\\mathbf{b}`, `${first}\\mathbf{a} - ${second}\\mathbf{b}`, `${p}\\mathbf{a} + ${q}\\mathbf{b}`],
          [
            `$\\vec{OP} = \\mathbf{a} + ${second}(\\mathbf{b} - \\mathbf{a})$, which collects to the result.`,
            `$\\vec{OP} = \\mathbf{a} + ${second}(\\mathbf{b} - \\mathbf{a})$，合并后得到结果。`,
          ],
        );
      },
    ),
  ],
  "unit-vectors": [
    skill(
      "a-vector-of-a-given-length",
      ["A vector of a given length", "给定长度的向量"],
      [
        "A unit vector carries only a direction, so scaling it by a number gives a vector of that length in that direction. This is how a direction and a length combine into components.",
        "单位向量只含方向，所以乘一个数就得到这个方向上这个长度的向量。方向和长度就是这样合成分量的。",
      ],
      (rng) => {
        const [a, b, c] = rng.pick(triples);
        const len = c * rng.int(2, 6);
        const k = len / c;
        return chooseFilled(
          rng,
          [
            `Find the vector of magnitude ${len} in the same direction as $${vec(a, b)}$.`,
            `求与 $${vec(a, b)}$ 同方向、模为 ${len} 的向量。`,
          ],
          vec(a * k, b * k),
          [vec(a * len, b * len), vec(b * k, a * k), vec(a + len, b + len)],
          [
            `$${vec(a, b)}$ has magnitude ${c}, so multiply it by $${len} \\div ${c} = ${k}$.`,
            `$${vec(a, b)}$ 的模是 ${c}，所以乘 $${len} \\div ${c} = ${k}$。`,
          ],
        );
      },
    ),
  ],
  "two-dimensional-vectors-expressed-in-component-form": [
    skill(
      "the-end-point-from-the-vector",
      ["The end point from the vector", "由向量求终点"],
      [
        "A vector gives the change from its start to its end. So the end point is the start point plus the components, which reverses the subtraction used to find the vector.",
        "向量给出从起点到终点的变化。所以终点是起点加分量，这正好反过来求向量时的减法。",
      ],
      (rng) => {
        const x = rng.int(-9, 9);
        const y = rng.int(-9, 9);
        const u = nz(rng, 12);
        const v = nz(rng, 12);
        return chooseFilled(
          rng,
          [`$\\vec{AB} = ${vec(u, v)}$ and $A = (${x}, ${y})$. Find $B$.`, `$\\vec{AB} = ${vec(u, v)}$，$A = (${x}, ${y})$。求 $B$。`],
          `(${x + u}, ${y + v})`,
          [`(${x - u}, ${y - v})`, `(${u - x}, ${v - y})`, `(${x + v}, ${y + u})`],
          [`Add the components to $A$: $(${x} + (${u}), ${y} + (${v}))$.`, `把分量加到 $A$ 上：$(${x} + (${u}), ${y} + (${v}))$。`],
        );
      },
    ),
  ],
  "calculating-the-magnitude-of-cartesian-vectors-in-2d": [
    skill(
      "the-distance-between-two-points-as-a-magnitude",
      ["The distance between points as a magnitude", "两点间距离就是模"],
      [
        "The distance between two points is the magnitude of the vector joining them. So subtract the coordinates first, and then take the square root of the sum of the squares.",
        "两点间的距离就是连接它们的向量的模。所以先把坐标相减，再求平方和的平方根。",
      ],
      (rng) => {
        const [a, b, c] = rng.pick(triples);
        const x = rng.int(-9, 9);
        const y = rng.int(-9, 9);
        const sx = rng.bool() ? 1 : -1;
        const sy = rng.bool() ? 1 : -1;
        return whole(
          [
            `Find the magnitude of $\\vec{PQ}$ for $P(${x}, ${y})$ and $Q(${x + sx * a}, ${y + sy * b})$.`,
            `求 $P(${x}, ${y})$、$Q(${x + sx * a}, ${y + sy * b})$ 时 $\\vec{PQ}$ 的模。`,
          ],
          c,
          [a + b, c * c, Math.abs(x + sx * a) + Math.abs(y + sy * b) === c ? c + 1 : Math.abs(x + sx * a) + Math.abs(y + sy * b)],
          [`$\\vec{PQ} = ${vec(sx * a, sy * b)}$, whose magnitude is ${c}.`, `$\\vec{PQ} = ${vec(sx * a, sy * b)}$，模是 ${c}。`],
        );
      },
    ),
  ],
  "calculating-the-direction-of-cartesian-vectors-in-2d": [
    skill(
      "bearings-from-the-direction-angle",
      ["Bearings from the direction angle", "由方向角求方位角"],
      [
        "A bearing is measured clockwise from north, while a direction angle is measured counterclockwise from east. So the bearing is 90 degrees minus the direction angle, adjusted by a full turn if negative.",
        "方位角从正北顺时针量，方向角从正东逆时针量。所以方位角是 90 度减方向角，若为负再加一整圈。",
      ],
      (rng) => {
        const angle = rng.int(1, 71) * 5;
        const bearing = (90 - angle + 360) % 360;
        return whole(
          [
            `A vector has direction angle $${angle}^{\\circ}$. What is its bearing, measured clockwise from north, in degrees from 0 up to 360?`,
            `一个向量的方向角是 $${angle}^{\\circ}$。它的方位角（从正北顺时针量，0 到 360 度）是多少度？`,
          ],
          bearing,
          [angle, (angle + 90) % 360, (bearing + 180) % 360],
          [
            `$90 - ${angle} = ${90 - angle}$${90 - angle < 0 ? `, and adding 360 gives ${bearing}` : ""}.`,
            `$90 - ${angle} = ${90 - angle}$${90 - angle < 0 ? `，加 360 得 ${bearing}` : ""}。`,
          ],
        );
      },
    ),
  ],
  "calculating-the-components-of-cartesian-vectors-in-2d": [
    skill(
      "components-across-the-quadrants",
      ["Components across the quadrants", "各象限的分量"],
      [
        "The formulas $x = r\\cos\\theta$ and $y = r\\sin\\theta$ give the signs by themselves, as cosine and sine carry them. A second quadrant angle therefore gives a negative $x$ and a positive $y$.",
        "公式 $x = r\\cos\\theta$ 和 $y = r\\sin\\theta$ 本身就给出符号，因为余弦和正弦带符号。所以第二象限的角使 $x$ 为负、$y$ 为正。",
      ],
      (rng) => {
        const r = 2 * rng.int(1, 15);
        const row = rng.pick<[number, number, number]>([
          [120, -1, 3],
          [240, -1, -3],
          [300, 1, -3],
          [60, 1, 3],
        ]);
        const half = r / 2;
        const xText = row[1] < 0 ? -half : half;
        const yText = `${row[2] < 0 ? "-" : ""}${half === 1 ? "" : half}\\sqrt{3}`;
        const flip = `${row[2] < 0 ? "" : "-"}${half === 1 ? "" : half}\\sqrt{3}`;
        return chooseFilled(
          rng,
          [
            `A vector has magnitude ${r} and direction angle $${row[0]}^{\\circ}$. Find its components.`,
            `一个向量的模是 ${r}，方向角是 $${row[0]}^{\\circ}$。求它的分量。`,
          ],
          `\\langle ${xText}, ${yText} \\rangle`,
          [`\\langle ${-xText}, ${yText} \\rangle`, `\\langle ${xText}, ${flip} \\rangle`, `\\langle ${yText}, ${xText} \\rangle`],
          [
            `$x = ${r}\\cos ${row[0]}^{\\circ} = ${xText}$, and $y = ${r}\\sin ${row[0]}^{\\circ} = ${yText}$.`,
            `$x = ${r}\\cos ${row[0]}^{\\circ} = ${xText}$，$y = ${r}\\sin ${row[0]}^{\\circ} = ${yText}$。`,
          ],
        );
      },
    ),
  ],
  "velocity-and-acceleration-for-plane-motion": [
    skill(
      "velocity-after-steady-acceleration",
      ["Velocity after steady acceleration", "匀加速后的速度"],
      [
        "Constant acceleration adds the same vector to the velocity every second. So the new velocity is the old one plus time times the acceleration, worked out one component at a time.",
        "恒定的加速度每秒给速度加上同一个向量。所以新速度是原速度加时间乘加速度，逐个分量计算。",
      ],
      (rng) => {
        const u = rng.int(-9, 9);
        const v = rng.int(-9, 9);
        const a = nz(rng, 5);
        const b = nz(rng, 5);
        const t = rng.int(2, 9);
        return chooseFilled(
          rng,
          [
            `An object has velocity $${vec(u, v)}$ m/s and constant acceleration $${vec(a, b)}$ m/s$^2$. What is its velocity after ${t} s?`,
            `物体的速度是 $${vec(u, v)}$ 米/秒，恒定加速度是 $${vec(a, b)}$ 米/秒$^2$。${t} 秒后速度是多少？`,
          ],
          vec(u + t * a, v + t * b),
          [vec(u + a, v + b), vec(t * u + a, t * v + b), vec(u - t * a, v - t * b)],
          [
            `$${vec(u, v)} + ${t}${vec(a, b)} = ${vec(u + t * a, v + t * b)}$.`,
            `$${vec(u, v)} + ${t}${vec(a, b)} = ${vec(u + t * a, v + t * b)}$。`,
          ],
        );
      },
    ),
  ],
  "calculating-displacement-for-plane-motion": [
    skill(
      "the-velocity-that-covers-a-displacement",
      ["The velocity that covers a displacement", "完成一段位移的速度"],
      [
        "Displacement is velocity times time, so dividing the displacement by the time gives the constant velocity needed. The displacement itself is the end point minus the start point.",
        "位移是速度乘时间，所以位移除以时间得到需要的恒定速度。位移本身是终点减起点。",
      ],
      (rng) => {
        const t = rng.int(2, 10);
        const u = nz(rng, 9);
        const v = nz(rng, 9);
        const x = rng.int(-9, 9);
        const y = rng.int(-9, 9);
        return chooseFilled(
          rng,
          [
            `A drone flies in a straight line at constant velocity from $(${x}, ${y})$ to $(${x + t * u}, ${y + t * v})$ in ${t} seconds. What is its velocity?`,
            `无人机以恒定速度沿直线飞行，从 $(${x}, ${y})$ 到 $(${x + t * u}, ${y + t * v})$ 用了 ${t} 秒。它的速度是多少？`,
          ],
          vec(u, v),
          [vec(t * u, t * v), vec(-u, -v), vec(v, u) === vec(u, v) ? vec(u + 1, v) : vec(v, u)],
          [
            `The displacement is $${vec(t * u, t * v)}$, and dividing by ${t} gives $${vec(u, v)}$.`,
            `位移是 $${vec(t * u, t * v)}$，除以 ${t} 得 $${vec(u, v)}$。`,
          ],
        );
      },
    ),
  ],
  "three-dimensional-vectors-in-component-form": [
    skill(
      "the-magnitude-in-three-dimensions",
      ["The magnitude in three dimensions", "三维向量的模"],
      [
        "The Pythagorean theorem applies twice in three dimensions, so the magnitude is the square root of the sum of all three squares. A zero component simply adds nothing.",
        "三维中勾股定理用两次，所以模是三个平方之和的平方根。分量为零时就是不增加什么。",
      ],
      (rng) => {
        const [a, b, c, d] = rng.pick<[number, number, number, number]>([
          [1, 2, 2, 3],
          [2, 3, 6, 7],
          [1, 4, 8, 9],
          [4, 4, 7, 9],
          [2, 6, 9, 11],
          [6, 6, 7, 11],
          [3, 4, 12, 13],
          [2, 5, 14, 15],
          [2, 10, 11, 15],
          [1, 12, 12, 17],
          [8, 9, 12, 17],
        ]);
        const order = rng.shuffle([a * (rng.bool() ? 1 : -1), b * (rng.bool() ? 1 : -1), c * (rng.bool() ? 1 : -1)]);
        return whole(
          [`Find the magnitude of $${vec(...order)}$.`, `求 $${vec(...order)}$ 的模。`],
          d,
          [a + b + c, d * d, d + 1],
          [
            `$\\sqrt{${a * a} + ${b * b} + ${c * c}} = \\sqrt{${d * d}} = ${d}$.`,
            `$\\sqrt{${a * a} + ${b * b} + ${c * c}} = \\sqrt{${d * d}} = ${d}$。`,
          ],
        );
      },
    ),
  ],
  "addition-and-scalar-multiplication-of-cartesian-vectors-in-3d": [
    skill(
      "solving-for-a-scalar-and-a-component",
      ["Solving for a scalar and a component", "解标量和分量"],
      [
        "Vectors are equal only when every component matches, so one vector equation gives three ordinary equations. Find the scalar from a complete component, and use it in the others.",
        "每个分量都相同时向量才相等，所以一个向量方程给出三个普通方程。由完整的分量求出标量，再用到其他分量。",
      ],
      (rng) => {
        const k = rng.int(2, 7) * (rng.bool() ? 1 : -1);
        const a = nz(rng, 9);
        const b = nz(rng, 9);
        const z = nz(rng, 9);
        return integer(
          [
            `If $${vec(k * a, k * b, k * z)} = k${vec(a, b, 0).replace(", 0 ", ", z ")}$, what is $z$?`,
            `若 $${vec(k * a, k * b, k * z)} = k${vec(a, b, 0).replace(", 0 ", ", z ")}$，$z$ 是多少？`,
          ],
          z,
          [k * z, k, -z],
          [
            `The first component gives $k = ${k}$, and then $${k}z = ${k * z}$ gives $z = ${z}$.`,
            `第一个分量给出 $k = ${k}$，再由 $${k}z = ${k * z}$ 得 $z = ${z}$。`,
          ],
        );
      },
    ),
  ],
  "calculating-the-dot-product-using-angle-and-magnitude": [
    skill(
      "the-angle-from-the-dot-product",
      ["The angle from the dot product", "由点积求角"],
      [
        "Dividing the dot product by the two magnitudes leaves the cosine of the angle between the vectors. A special value of cosine then names the angle exactly.",
        "点积除以两个模，剩下两向量夹角的余弦。特殊的余弦值就准确地给出这个角。",
      ],
      (rng) => {
        const a = 2 * rng.int(1, 9);
        const b = 2 * rng.int(1, 9);
        const row = rng.pick<[number, number]>([
          [60, 1],
          [120, -1],
          [90, 0],
          [0, 2],
          [180, -2],
        ]);
        return whole(
          [
            `$\\|\\mathbf{u}\\| = ${a}$, $\\|\\mathbf{v}\\| = ${b}$ and $\\mathbf{u} \\cdot \\mathbf{v} = ${(a * b * row[1]) / 2}$. What is the angle between the vectors, in degrees?`,
            `$\\|\\mathbf{u}\\| = ${a}$，$\\|\\mathbf{v}\\| = ${b}$，$\\mathbf{u} \\cdot \\mathbf{v} = ${(a * b * row[1]) / 2}$。两向量的夹角是多少度？`,
          ],
          row[0],
          [(row[0] + 60) % 180, (row[0] + 30) % 180, 45],
          [
            `$\\cos\\theta = ${(a * b * row[1]) / 2} \\div ${a * b} = ${Q.of(row[1], 2).toLatex()}$, so $\\theta = ${row[0]}^{\\circ}$.`,
            `$\\cos\\theta = ${(a * b * row[1]) / 2} \\div ${a * b} = ${Q.of(row[1], 2).toLatex()}$，所以 $\\theta = ${row[0]}^{\\circ}$。`,
          ],
        );
      },
    ),
  ],
  "calculating-a-scalar-projection": [
    skill(
      "the-vector-projection",
      ["The vector projection", "向量投影"],
      [
        "The scalar projection gives a signed length along a direction. Multiplying it by the unit vector of that direction gives the vector projection, written $\\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\mathbf{v} \\cdot \\mathbf{v}}\\mathbf{v}$.",
        "标量投影给出沿某方向带符号的长度。乘这个方向的单位向量，得到向量投影，写作 $\\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\mathbf{v} \\cdot \\mathbf{v}}\\mathbf{v}$。",
      ],
      (rng) => {
        const [p, q] = rng.pick<[number, number]>([
          [1, 0],
          [0, 1],
          [1, 1],
          [1, 2],
          [2, 1],
          [1, 3],
          [3, 1],
          [3, 4],
          [1, -1],
          [1, -2],
        ]);
        const k = nz(rng, 5);
        const vv = p * p + q * q;
        const w = rng.int(1, 6);
        const u = [k * p - w * q, k * q + w * p] as const;
        return chooseFilled(
          rng,
          [
            `Find the vector projection of $\\mathbf{u} = ${vec(...u)}$ onto $\\mathbf{v} = ${vec(p, q)}$.`,
            `求 $\\mathbf{u} = ${vec(...u)}$ 在 $\\mathbf{v} = ${vec(p, q)}$ 上的向量投影。`,
          ],
          vec(k * p, k * q),
          [vec(...u), vec(k * vv * p, k * vv * q), vec(-k * p, -k * q)],
          [
            `$\\mathbf{u} \\cdot \\mathbf{v} = ${k * vv}$ and $\\mathbf{v} \\cdot \\mathbf{v} = ${vv}$, so multiply $\\mathbf{v}$ by ${k}.`,
            `$\\mathbf{u} \\cdot \\mathbf{v} = ${k * vv}$，$\\mathbf{v} \\cdot \\mathbf{v} = ${vv}$，所以 $\\mathbf{v}$ 乘 ${k}。`,
          ],
        );
      },
    ),
  ],
  "the-cross-product-of-two-vectors": [
    skill(
      "swapping-the-order",
      ["Swapping the order", "交换次序"],
      [
        "The cross product is not commutative: swapping the factors reverses the direction. So $\\mathbf{v} \\times \\mathbf{u} = -(\\mathbf{u} \\times \\mathbf{v})$, and the magnitude stays the same.",
        "叉积不满足交换律：交换因子方向相反。所以 $\\mathbf{v} \\times \\mathbf{u} = -(\\mathbf{u} \\times \\mathbf{v})$，模不变。",
      ],
      (rng) => {
        const x = [nz(rng, 9), nz(rng, 9), nz(rng, 9)] as const;
        const k = rng.int(2, 6);
        return chooseFilled(
          rng,
          [
            `If $\\mathbf{u} \\times \\mathbf{v} = ${vec(...x)}$, find $(${k}\\mathbf{v}) \\times \\mathbf{u}$.`,
            `若 $\\mathbf{u} \\times \\mathbf{v} = ${vec(...x)}$，求 $(${k}\\mathbf{v}) \\times \\mathbf{u}$。`,
          ],
          vec(-k * x[0], -k * x[1], -k * x[2]),
          [vec(k * x[0], k * x[1], k * x[2]), vec(-x[0], -x[1], -x[2]), vec(x[0], x[1], x[2])],
          [`Swapping changes the sign, and the scalar ${k} comes out.`, `交换改变符号，标量 ${k} 可以提出来。`],
        );
      },
    ),
  ],
  "calculating-the-cross-product-using-determinants": [
    skill(
      "parallel-vectors-have-zero-cross-product",
      ["Parallel vectors have zero cross product", "平行向量的叉积为零"],
      [
        "The cross product measures an area, which vanishes when the vectors are parallel. So setting the cross product to zero is a test for one vector being a multiple of the other.",
        "叉积度量面积，向量平行时面积为零。所以令叉积为零，可以检验一个向量是否是另一个的倍数。",
      ],
      (rng) => {
        const a = nz(rng, 6);
        const b = nz(rng, 6);
        const c = nz(rng, 6);
        const k = rng.int(2, 6) * (rng.bool() ? 1 : -1);
        return integer(
          [
            `For what value of $t$ is $${vec(a, b, c)} \\times ${vec(k * a, k * b, 0).replace(", 0 ", ", t ")} = \\mathbf{0}$?`,
            `$t$ 为何值时，$${vec(a, b, c)} \\times ${vec(k * a, k * b, 0).replace(", 0 ", ", t ")} = \\mathbf{0}$？`,
          ],
          k * c,
          [-k * c, c, k],
          [
            `The second vector must be ${k} times the first, so $t = ${k} \\times (${c}) = ${k * c}$.`,
            `第二个向量必须是第一个的 ${k} 倍，所以 $t = ${k} \\times (${c}) = ${k * c}$。`,
          ],
        );
      },
    ),
  ],
  "finding-areas-using-the-cross-product": [
    skill(
      "the-area-of-a-triangle-in-the-plane",
      ["The area of a triangle in the plane", "平面上三角形的面积"],
      [
        "Two plane vectors can be given a third component of 0, so their cross product points straight up. Half the absolute value of $ad - bc$ is then the area of the triangle they span.",
        "平面向量可以加上第三个分量 0，它们的叉积就竖直向上。所以 $ad - bc$ 绝对值的一半，就是它们张成的三角形面积。",
      ],
      (rng) => {
        const a = rng.int(1, 9) * 2;
        const b = rng.int(1, 9);
        const c = rng.int(1, 9);
        const d = rng.int(1, 9) * 2;
        const x = a * d - b * c === 0 ? 2 : Math.abs(a * d - b * c);
        const dd = a * d - b * c === 0 ? d + 2 : d;
        const det = Math.abs(a * dd - b * c);
        const even = det % 2 === 0 ? det : 2 * det;
        const aa = det % 2 === 0 ? a : 2 * a;
        const bb = det % 2 === 0 ? b : 2 * b;
        return whole(
          [
            `Find the area of the triangle with vertices $(0, 0)$, $(${aa}, ${bb})$ and $(${c}, ${dd})$.`,
            `求顶点为 $(0, 0)$、$(${aa}, ${bb})$ 和 $(${c}, ${dd})$ 的三角形面积。`,
          ],
          even / 2,
          [even, even / 2 + 1, x + 1],
          [
            `$\\frac{1}{2}|${aa} \\cdot ${dd} - ${bb} \\cdot ${c}| = ${even / 2}$.`,
            `$\\frac{1}{2}|${aa} \\cdot ${dd} - ${bb} \\cdot ${c}| = ${even / 2}$。`,
          ],
        );
      },
    ),
  ],
  "finding-volumes-of-tetrahedrons-and-pyramids-using-vector-products": [
    skill(
      "the-volume-of-a-parallelepiped",
      ["The volume of a parallelepiped", "平行六面体的体积"],
      [
        "The absolute value of the triple product gives the volume of the box that three vectors span. A value of zero means that the three vectors lie in one plane.",
        "三重积的绝对值给出三个向量张成的平行六面体的体积。值为零表示三个向量在同一平面内。",
      ],
      (rng) => {
        const a = rng.int(1, 9);
        const b = rng.int(1, 9);
        const c = rng.int(1, 9);
        const p = rng.int(1, 5);
        const q = rng.int(1, 5);
        return whole(
          [
            `Find the volume of the parallelepiped spanned by $${vec(a, p, q)}$, $${vec(0, b, q)}$ and $${vec(0, 0, c)}$.`,
            `求 $${vec(a, p, q)}$、$${vec(0, b, q)}$ 和 $${vec(0, 0, c)}$ 张成的平行六面体的体积。`,
          ],
          a * b * c,
          [(a * b * c) / 6 === Math.floor((a * b * c) / 6) ? (a * b * c) / 6 : a * b * c + 1, a + b + c, a * b * c + p * q],
          [
            `The matrix of the three vectors is triangular, so the determinant is $${a} \\cdot ${b} \\cdot ${c} = ${a * b * c}$.`,
            `三个向量组成的矩阵是三角矩阵，所以行列式是 $${a} \\cdot ${b} \\cdot ${c} = ${a * b * c}$。`,
          ],
        );
      },
    ),
  ],
  "introduction-to-matrices": [
    skill(
      "the-possible-shapes-for-a-count",
      ["The possible shapes for a count", "个数对应的形状"],
      [
        "A matrix with $m$ rows and $n$ columns has $mn$ entries. So a number of entries can be arranged in as many shapes as it has ordered factor pairs.",
        "$m$ 行 $n$ 列的矩阵有 $mn$ 个元素。所以一个元素个数有多少组有序因数对，就能排成多少种形状。",
      ],
      (rng) => {
        const n = rng.pick([
          4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 26, 27, 28, 30, 32, 33, 34, 35, 36, 38, 39, 40, 42, 44, 45, 48, 49, 50,
          60,
        ]);
        let count = 0;
        for (let i = 1; i <= n; i++) if (n % i === 0) count++;
        return whole(
          [
            `A matrix has exactly ${n} entries. How many different shapes $m \\times n$ could it have, counting $2 \\times 3$ and $3 \\times 2$ as different?`,
            `一个矩阵恰有 ${n} 个元素。它可能有多少种形状 $m \\times n$（$2 \\times 3$ 和 $3 \\times 2$ 算不同）？`,
          ],
          count,
          [Math.ceil(count / 2) === count ? count + 1 : Math.ceil(count / 2), count + 1, count - 1],
          [
            `Each factor of ${n} can be the number of rows, and it has ${count} factors.`,
            `${n} 的每个因数都可以是行数，它有 ${count} 个因数。`,
          ],
        );
      },
    ),
  ],
  "index-notation-for-matrices": [
    skill(
      "the-trace-from-the-index",
      ["Summing the diagonal from a rule", "由规则求对角线之和"],
      [
        "The diagonal holds the entries where the row and column numbers match. So a rule for $a_{ij}$ gives each diagonal entry by setting $i = j$, and their sum is called the trace.",
        "对角线上是行号和列号相同的元素。所以由 $a_{ij}$ 的规则，令 $i = j$ 得到每个对角元素，它们的和叫做迹。",
      ],
      (rng) => {
        const n = rng.int(2, 6);
        const p = rng.int(1, 6);
        const q = rng.int(1, 6);
        const c = rng.int(-6, 6);
        let trace = 0;
        for (let i = 1; i <= n; i++) trace += p * i + q * i + c;
        return integer(
          [
            `An $${n} \\times ${n}$ matrix has entries $a_{ij} = ${p}i + ${q}j${c < 0 ? ` - ${-c}` : ` + ${c}`}$. Find the sum of its diagonal entries.`,
            `$${n} \\times ${n}$ 矩阵的元素为 $a_{ij} = ${p}i + ${q}j${c < 0 ? ` - ${-c}` : ` + ${c}`}$。求对角元素之和。`,
          ],
          trace,
          [trace - n * c, (p + q + c) * n, trace + p + q],
          [
            `Each diagonal entry is $${p + q}i${c < 0 ? ` - ${-c}` : ` + ${c}`}$, and adding for $i = 1$ to ${n} gives ${trace}.`,
            `每个对角元素是 $${p + q}i${c < 0 ? ` - ${-c}` : ` + ${c}`}$，$i$ 从 1 到 ${n} 相加得 ${trace}。`,
          ],
        );
      },
    ),
  ],
  "adding-and-subtracting-matrices": [
    skill(
      "solving-a-matrix-equation-entry-by-entry",
      ["Solving a matrix equation entry by entry", "逐元素解矩阵方程"],
      [
        "Matrices are equal only when each entry matches, so an unknown inside a sum is found from the one entry that contains it. The other entries are a check on the equation.",
        "每个元素都相同时矩阵才相等，所以和中的未知数由含它的那个元素求出。其他元素用来检验方程。",
      ],
      (rng) => {
        const a = nz(rng, 9);
        const b = nz(rng, 9);
        const c = nz(rng, 9);
        const d = nz(rng, 9);
        const p = nz(rng, 9);
        const q = nz(rng, 9);
        const x = nz(rng, 9);
        const m = rng.int(2, 5);
        return integer(
          [
            `Find $x$ if $${mat([a, b], [c, d])} + ${mat([`${m}x`, p], [q, 1])} = ${mat([a + m * x, b + p], [c + q, d + 1])}$.`,
            `求 $x$：$${mat([a, b], [c, d])} + ${mat([`${m}x`, p], [q, 1])} = ${mat([a + m * x, b + p], [c + q, d + 1])}$。`,
          ],
          x,
          [m * x, a + m * x, -x],
          [
            `The top left entries give $${a} + ${m}x = ${a + m * x}$, so $x = ${x}$.`,
            `左上元素给出 $${a} + ${m}x = ${a + m * x}$，所以 $x = ${x}$。`,
          ],
        );
      },
    ),
  ],
  "properties-of-matrix-addition": [
    skill(
      "the-matrix-that-completes-an-equation",
      ["The matrix that completes an equation", "使等式成立的矩阵"],
      [
        "Additive inverses let matrix equations be solved like ordinary ones. Subtracting $A$ from both sides of $A + X = B$ leaves $X = B - A$, and the order of this subtraction matters.",
        "有了加法逆元，矩阵方程可以像普通方程一样解。$A + X = B$ 两边减 $A$，得 $X = B - A$，减法的次序很重要。",
      ],
      (rng) => {
        const [a, b, c, d] = [nz(rng, 9), nz(rng, 9), nz(rng, 9), nz(rng, 9)];
        const [e, f, g, h] = [nz(rng, 9), nz(rng, 9), nz(rng, 9), nz(rng, 9)];
        return chooseFilled(
          rng,
          [
            `Find $X$ if $${mat([a, b], [c, d])} + X = ${mat([e, f], [g, h])}$.`,
            `求 $X$：$${mat([a, b], [c, d])} + X = ${mat([e, f], [g, h])}$。`,
          ],
          mat([e - a, f - b], [g - c, h - d]),
          [mat([a - e, b - f], [c - g, d - h]), mat([e + a, f + b], [g + c, h + d]), mat([e - a, g - c], [f - b, h - d])],
          [`$X$ is the right side minus the given matrix, entry by entry.`, `$X$ 是右边减去给定矩阵，逐元素计算。`],
        );
      },
    ),
  ],
  "scalar-multiplication-of-matrices": [
    skill(
      "the-scalar-from-the-entries",
      ["The scalar from the entries", "由元素求标量"],
      [
        "If one matrix is a scalar multiple of another, every entry changes by the same factor. So any nonzero entry gives the scalar, and the others must agree with it.",
        "如果一个矩阵是另一个的标量倍，每个元素都变化相同的倍数。所以任一非零元素给出标量，其他元素必须与之一致。",
      ],
      (rng) => {
        const k = rng.int(2, 9) * (rng.bool() ? 1 : -1);
        const [a, b, c, d] = [nz(rng, 9), nz(rng, 9), nz(rng, 9), nz(rng, 9)];
        return integer(
          [
            `Find $k$ if $k${mat([a, b], [c, d])} = ${mat([k * a, k * b], [k * c, k * d])}$.`,
            `求 $k$：$k${mat([a, b], [c, d])} = ${mat([k * a, k * b], [k * c, k * d])}$。`,
          ],
          k,
          [-k, k * a, k + 1],
          [`$${k * a} \\div (${a}) = ${k}$, and every other entry agrees.`, `$${k * a} \\div (${a}) = ${k}$，其他元素都一致。`],
        );
      },
    ),
  ],
  "zero-square-diagonal-and-identity-matrices": [
    skill(
      "powers-of-a-diagonal-matrix",
      ["Powers of a diagonal matrix", "对角矩阵的幂"],
      [
        "Multiplying diagonal matrices only multiplies their diagonal entries. So a power of a diagonal matrix raises each diagonal entry to that power, with no other work needed.",
        "对角矩阵相乘时，只有对角元素相乘。所以对角矩阵的幂就是每个对角元素取这个幂，不需要其他计算。",
      ],
      (rng) => {
        const a = rng.int(2, 5) * (rng.bool() ? 1 : -1);
        const b = rng.int(2, 5) * (rng.bool() ? 1 : -1);
        const n = rng.int(2, 4);
        return chooseFilled(
          rng,
          [`Find $${mat([a, 0], [0, b])}^{${n}}$.`, `求 $${mat([a, 0], [0, b])}^{${n}}$。`],
          mat([a ** n, 0], [0, b ** n]),
          [mat([n * a, 0], [0, n * b]), mat([a ** n, b ** n], [b ** n, a ** n]), mat([a ** n + 1, 0], [0, b ** n])],
          [
            `Raise each diagonal entry to the power ${n}: $(${a})^{${n}} = ${a ** n}$ and $(${b})^{${n}} = ${b ** n}$.`,
            `每个对角元素取 ${n} 次幂：$(${a})^{${n}} = ${a ** n}$，$(${b})^{${n}} = ${b ** n}$。`,
          ],
        );
      },
    ),
  ],
  "the-transpose-of-a-matrix": [
    skill(
      "the-transpose-of-a-product",
      ["The transpose of a product", "积的转置"],
      [
        "Transposing a product reverses its order: $(AB)^{T} = B^{T}A^{T}$. The reversal is needed for the shapes to fit, and it is similar to taking off socks and shoes in reverse order.",
        "积的转置要反转次序：$(AB)^{T} = B^{T}A^{T}$。反转才能使形状相符，就像脱鞋袜的次序与穿时相反。",
      ],
      (rng) => {
        const m = rng.int(2, 9);
        const n = rng.int(2, 9);
        const p = n === m ? n + 1 : rng.int(2, 9);
        const [A, B] = rng.sample(["A", "B", "C", "D", "M", "N", "P", "Q"], 2) as [string, string];
        return chooseFilled(
          rng,
          [
            `$${A}$ is $${m} \\times ${n}$ and $${B}$ is $${n} \\times ${p}$. Which expression equals $(${A}${B})^{T}$?`,
            `$${A}$ 是 $${m} \\times ${n}$ 矩阵，$${B}$ 是 $${n} \\times ${p}$ 矩阵。哪个式子等于 $(${A}${B})^{T}$？`,
          ],
          `${B}^{T}${A}^{T}`,
          [`${A}^{T}${B}^{T}`, `${B}${A}`, `${A}${B}`],
          [
            `A transpose of a product reverses the order, and the shapes $${p} \\times ${n}$ and $${n} \\times ${m}$ fit.`,
            `积的转置反转次序，形状 $${p} \\times ${n}$ 和 $${n} \\times ${m}$ 正好相符。`,
          ],
        );
      },
    ),
  ],
  "multiplying-a-matrix-by-a-column-vector": [
    skill(
      "the-columns-from-standard-vectors",
      ["The columns from standard vectors", "由标准向量得到列"],
      [
        "Multiplying a matrix by a standard basis vector picks out one column. Knowing what a matrix does to these vectors therefore reveals every entry of the matrix.",
        "矩阵乘标准基向量，就取出一列。所以知道矩阵对这些向量的作用，就知道矩阵的每个元素。",
      ],
      (rng) => {
        const [a, b, c, d] = [nz(rng, 9), nz(rng, 9), nz(rng, 9), nz(rng, 9)];
        return chooseFilled(
          rng,
          [
            `$A${mat([1], [0])} = ${mat([a], [c])}$ and $A${mat([0], [1])} = ${mat([b], [d])}$. Find $A$.`,
            `$A${mat([1], [0])} = ${mat([a], [c])}$，$A${mat([0], [1])} = ${mat([b], [d])}$。求 $A$。`,
          ],
          mat([a, b], [c, d]),
          [mat([a, c], [b, d]), mat([b, a], [d, c]), mat([c, d], [a, b])],
          [`The two results are the first and second columns of $A$.`, `这两个结果分别是 $A$ 的第一列和第二列。`],
        );
      },
    ),
  ],
  "multiplying-square-matrices": [
    skill(
      "the-square-of-a-matrix",
      ["The square of a matrix", "矩阵的平方"],
      [
        "Squaring a matrix means multiplying it by itself, not squaring each entry. So every entry of the result combines a row with a column, and the two methods usually differ.",
        "矩阵的平方是矩阵乘自身，而不是每个元素平方。所以结果的每个元素都由一行和一列组合而成，两种做法通常不同。",
      ],
      (rng) => {
        const [a, b, c, d] = [nz(rng, 6), nz(rng, 6), nz(rng, 6), nz(rng, 6)];
        return chooseFilled(
          rng,
          [`Find $${mat([a, b], [c, d])}^{2}$.`, `求 $${mat([a, b], [c, d])}^{2}$。`],
          mat([a * a + b * c, a * b + b * d], [c * a + d * c, c * b + d * d]),
          [
            mat([a * a, b * b], [c * c, d * d]),
            mat([a * a + b * c, a * b - b * d], [c * a - d * c, c * b + d * d]),
            mat([2 * a, 2 * b], [2 * c, 2 * d]),
          ],
          [
            `Top left is $${paren(a)} \\cdot ${paren(a)} + ${paren(b)} \\cdot ${paren(c)}$, and the other entries follow the same row by column rule.`,
            `左上是 $${paren(a)} \\cdot ${paren(a)} + ${paren(b)} \\cdot ${paren(c)}$，其他元素按同样的行乘列规则计算。`,
          ],
        );
      },
    ),
  ],
  "conformability-for-matrix-multiplication": [
    skill(
      "a-chain-of-products",
      ["A chain of products", "连乘"],
      [
        "In a chain of products, each pair of neighbors must fit, and the inner sizes vanish. So the result has the rows of the first matrix and the columns of the last.",
        "连乘时每对相邻矩阵的形状都要相符，中间的尺寸消失。所以结果的行数是第一个矩阵的，列数是最后一个的。",
      ],
      (rng) => {
        const [m, n, p, q] = [rng.int(2, 9), rng.int(2, 9), rng.int(2, 9), rng.int(2, 9)];
        const r = m === q ? q + 1 : q;
        return chooseFilled(
          rng,
          [
            `$A$ is $${m} \\times ${n}$, $B$ is $${n} \\times ${p}$ and $C$ is $${p} \\times ${r}$. What is the size of $ABC$?`,
            `$A$ 是 $${m} \\times ${n}$，$B$ 是 $${n} \\times ${p}$，$C$ 是 $${p} \\times ${r}$。$ABC$ 的尺寸是多少？`,
          ],
          `${m} \\times ${r}`,
          [`${r} \\times ${m}`, `${m} \\times ${n + p + r}`, `${m + n} \\times ${p + r}`],
          [
            `The inner sizes ${n} and ${p} vanish, leaving ${m} rows and ${r} columns.`,
            `中间的尺寸 ${n} 和 ${p} 消失，剩下 ${m} 行 ${r} 列。`,
          ],
        );
      },
    ),
  ],
  "multiplying-matrices": [
    skill(
      "counting-the-multiplications",
      ["Counting the multiplications", "数乘法次数"],
      [
        "Each entry of a product takes one multiplication for every column of the first matrix. So a product of sizes $m \\times n$ and $n \\times p$ takes $mnp$ multiplications of numbers.",
        "积的每个元素，第一个矩阵有几列就要做几次乘法。所以 $m \\times n$ 和 $n \\times p$ 相乘要做 $mnp$ 次数的乘法。",
      ],
      (rng) => {
        const [m, n, p] = [rng.int(2, 9), rng.int(2, 9), rng.int(2, 9)];
        return whole(
          [
            `How many multiplications of numbers does the usual method take to multiply a $${m} \\times ${n}$ matrix by a $${n} \\times ${p}$ matrix?`,
            `用通常的方法，$${m} \\times ${n}$ 矩阵乘 $${n} \\times ${p}$ 矩阵要做多少次数的乘法？`,
          ],
          m * n * p,
          [m * p, m * n * n * p, m + n + p],
          [
            `There are $${m} \\times ${p}$ entries, each taking ${n} multiplications, for ${m * n * p} in all.`,
            `有 $${m} \\times ${p}$ 个元素，每个做 ${n} 次乘法，共 ${m * n * p} 次。`,
          ],
        );
      },
    ),
  ],
  "multiplying-a-matrix-by-the-identity-matrix": [
    skill(
      "the-size-of-the-identity-on-each-side",
      ["The size of the identity on each side", "两边单位矩阵的尺寸"],
      [
        "A non-square matrix needs identities of different sizes on its two sides. On the left the size matches its rows, and on the right it matches its columns.",
        "非方阵两边的单位矩阵尺寸不同。左边的尺寸等于行数，右边的尺寸等于列数。",
      ],
      (rng) => {
        const m = rng.int(2, 9);
        let n = rng.int(2, 9);
        if (n === m) n += 1;
        const left = rng.bool();
        return whole(
          [
            `$A$ is $${m} \\times ${n}$. What size must the identity $I$ be for $${left ? "IA" : "AI"} = A$ to make sense, as the number of rows of $I$?`,
            `$A$ 是 $${m} \\times ${n}$。要使 $${left ? "IA" : "AI"} = A$ 有意义，$I$ 应有多少行？`,
          ],
          left ? m : n,
          left ? [n, m * n, m + n] : [m, m * n, m + n],
          [
            `$${left ? "IA" : "AI"}$ needs $I$ to fit the ${left ? "rows" : "columns"} of $A$.`,
            `$${left ? "IA" : "AI"}$ 要求 $I$ 与 $A$ 的${left ? "行" : "列"}相符。`,
          ],
        );
      },
    ),
  ],
  "properties-of-matrix-multiplication": [
    skill(
      "the-square-of-a-sum",
      ["The square of a sum", "和的平方"],
      [
        "Since matrices need not commute, $(A + B)^{2}$ has two different middle terms, $AB$ and $BA$. The usual formula with $2AB$ only holds when $A$ and $B$ commute.",
        "矩阵不一定可交换，所以 $(A + B)^{2}$ 有两个不同的中间项 $AB$ 和 $BA$。通常含 $2AB$ 的公式只在 $A$、$B$ 可交换时成立。",
      ],
      (rng) => {
        const [A, B] = rng.sample(["A", "B", "C", "D", "M", "N", "P", "Q", "R", "S"], 2) as [string, string];
        const minus = rng.bool();
        const op = minus ? "-" : "+";
        return chooseFilled(
          rng,
          [
            `For square matrices of the same size, which expression equals $(${A} ${op} ${B})^{2}$?`,
            `对同样大小的方阵，哪个式子等于 $(${A} ${op} ${B})^{2}$？`,
          ],
          `${A}^{2} ${op} ${A}${B} ${op} ${B}${A} + ${B}^{2}`,
          [
            `${A}^{2} ${op} 2${A}${B} + ${B}^{2}`,
            `${A}^{2} + ${B}^{2}`,
            `${A}^{2} ${minus ? "+" : "-"} ${A}${B} ${minus ? "+" : "-"} ${B}${A} + ${B}^{2}`,
          ],
          [
            `Expanding keeps the order of each product, so $${A}${B}$ and $${B}${A}$ stay separate.`,
            `展开时保留每个积的次序，所以 $${A}${B}$ 和 $${B}${A}$ 不能合并。`,
          ],
        );
      },
    ),
  ],
  "representing-2x2-systems-of-equations-using-a-matrix-product": [
    skill(
      "checking-a-solution-with-the-product",
      ["Checking a solution with the product", "用乘积检验解"],
      [
        "A vector solves a matrix equation when the product equals the right side. So a missing entry of the right side comes from multiplying the matrix by the solution.",
        "向量是矩阵方程的解，当且仅当乘积等于右边。所以右边缺失的元素，可由矩阵乘解得到。",
      ],
      (rng) => {
        const [a, b, c, d] = [nz(rng, 9), nz(rng, 9), nz(rng, 9), nz(rng, 9)];
        const x = nz(rng, 6);
        const y = nz(rng, 6);
        return integer(
          [
            `$${mat(["x"], ["y"])} = ${mat([x], [y])}$ solves $${mat([a, b], [c, d])}${mat(["x"], ["y"])} = ${mat([a * x + b * y], ["k"])}$. What is $k$?`,
            `$${mat(["x"], ["y"])} = ${mat([x], [y])}$ 是 $${mat([a, b], [c, d])}${mat(["x"], ["y"])} = ${mat([a * x + b * y], ["k"])}$ 的解。$k$ 是多少？`,
          ],
          c * x + d * y,
          [a * x + b * y, c * x - d * y, c * y + d * x],
          [
            `The second row gives $k = ${paren(c)} \\cdot ${paren(x)} + ${paren(d)} \\cdot ${paren(y)} = ${c * x + d * y}$.`,
            `第二行给出 $k = ${paren(c)} \\cdot ${paren(x)} + ${paren(d)} \\cdot ${paren(y)} = ${c * x + d * y}$。`,
          ],
        );
      },
    ),
  ],
  "representing-3x3-systems-of-equations-using-a-matrix-product": [
    skill(
      "a-missing-variable-means-a-zero",
      ["A missing variable means a zero", "缺少变量就是 0"],
      [
        "An equation that omits a variable still has a coefficient for it: zero. The coefficient matrix must show that zero, or the columns would no longer line up with the variables.",
        "方程缺少某个变量时，它的系数是 0。系数矩阵必须写出这个 0，否则列就不再与变量对齐。",
      ],
      (rng) => {
        const [a, b] = [rng.int(2, 9), rng.int(2, 9)];
        const e = rng.int(1, 20);
        return chooseFilled(
          rng,
          [
            `What is the row of the coefficient matrix for the equation $${a}x + ${b}z = ${e}$, with the variables in the order $x, y, z$?`,
            `方程 $${a}x + ${b}z = ${e}$ 在系数矩阵中的那一行是什么（变量次序为 $x, y, z$）？`,
          ],
          mat([a, 0, b]),
          [mat([a, b, 0]), mat([a, b, e]), mat([0, a, b])],
          [
            `$y$ is missing, so its coefficient in the middle is 0. The constant ${e} stays on the right side.`,
            `缺少 $y$，所以中间的系数是 0。常数 ${e} 留在右边。`,
          ],
        );
      },
    ),
  ],
  "the-determinant-of-a-2x2-matrix": [
    skill(
      "the-determinant-of-a-multiple",
      ["The determinant of a multiple", "倍数的行列式"],
      [
        "Multiplying a $2 \\times 2$ matrix by $k$ multiplies both rows by $k$, so the determinant is multiplied by $k^{2}$, not by $k$. Each row contributes one factor.",
        "$2 \\times 2$ 矩阵乘 $k$，两行都乘 $k$，所以行列式乘 $k^{2}$，而不是 $k$。每一行贡献一个因数。",
      ],
      (rng) => {
        const det = nz(rng, 12);
        const k = rng.int(2, 6);
        return integer(
          [
            `$A$ is a $2 \\times 2$ matrix with $\\det A = ${det}$. Find $\\det(${k}A)$.`,
            `$A$ 是 $2 \\times 2$ 矩阵，$\\det A = ${det}$。求 $\\det(${k}A)$。`,
          ],
          k * k * det,
          [k * det, 2 * k * det === k * k * det ? k * det + 1 : 2 * k * det, det],
          [`$\\det(${k}A) = ${k}^{2} \\cdot (${det}) = ${k * k * det}$.`, `$\\det(${k}A) = ${k}^{2} \\cdot (${det}) = ${k * k * det}$。`],
        );
      },
    ),
  ],
  "the-minors-of-a-3x3-matrix": [
    skill(
      "the-sign-pattern-of-cofactors",
      ["The sign pattern of cofactors", "代数余子式的符号规律"],
      [
        "A cofactor is a minor with a sign of $(-1)^{i + j}$, which forms a checkerboard starting with plus at the top left. So entries with an even sum of indices keep the sign of the minor.",
        "代数余子式是余子式乘符号 $(-1)^{i + j}$，形成从左上角的正号开始的棋盘。所以下标之和为偶数的元素保留余子式的符号。",
      ],
      (rng) => {
        const i = rng.int(1, 3);
        const j = rng.int(1, 3);
        const m = nz(rng, 40);
        const sign = (i + j) % 2 === 0 ? 1 : -1;
        return integer(
          [
            `In a $3 \\times 3$ matrix, the minor $M_{${i}${j}}$ is ${m}. What is the cofactor $C_{${i}${j}}$?`,
            `$3 \\times 3$ 矩阵中，余子式 $M_{${i}${j}}$ 是 ${m}。代数余子式 $C_{${i}${j}}$ 是多少？`,
          ],
          sign * m,
          [-sign * m, Math.abs(m) + 1, i * j * m],
          [
            `$(-1)^{${i} + ${j}} = ${sign}$, so the cofactor is ${sign * m}.`,
            `$(-1)^{${i} + ${j}} = ${sign}$，所以代数余子式是 ${sign * m}。`,
          ],
        );
      },
    ),
  ],
  "the-determinant-of-a-3x3-matrix": [
    skill(
      "the-determinant-of-a-triangular-matrix",
      ["The determinant of a triangular matrix", "三角矩阵的行列式"],
      [
        "Expanding along a column with mostly zeros leaves one term at each stage. So the determinant of a triangular matrix is just the product of its diagonal entries.",
        "沿大部分是零的列展开，每一步只剩一项。所以三角矩阵的行列式就是对角元素的积。",
      ],
      (rng) => {
        const [a, b, c] = [nz(rng, 7), nz(rng, 7), nz(rng, 7)];
        const [p, q, r] = [nz(rng, 9), nz(rng, 9), nz(rng, 9)];
        const upper = rng.bool();
        const m = upper ? mat([a, p, q], [0, b, r], [0, 0, c]) : mat([a, 0, 0], [p, b, 0], [q, r, c]);
        return integer(
          [`Evaluate $\\det ${m}$.`, `计算 $\\det ${m}$。`],
          a * b * c,
          [a + b + c, a * b * c + p * q * r, -a * b * c],
          [
            `The matrix is triangular, so the determinant is $(${a})(${b})(${c}) = ${a * b * c}$.`,
            `这是三角矩阵，所以行列式是 $(${a})(${b})(${c}) = ${a * b * c}$。`,
          ],
        );
      },
    ),
  ],
  "introduction-to-the-inverse-of-a-matrix": [
    skill(
      "the-inverse-of-a-product",
      ["The inverse of a product", "积的逆"],
      [
        "To undo a product, undo the last factor first, so $(AB)^{-1} = B^{-1}A^{-1}$. Keeping the original order would not cancel the matrices next to each other.",
        "要还原一个积，先还原最后一个因子，所以 $(AB)^{-1} = B^{-1}A^{-1}$。保持原来的次序，相邻的矩阵就不能抵消。",
      ],
      (rng) => {
        const [A, B, C] = rng.sample(["A", "B", "C", "D", "M", "N", "P", "Q"], 3) as [string, string, string];
        const three = rng.bool();
        return chooseFilled(
          rng,
          [
            `The matrices are invertible. Which expression equals $(${three ? `${A}${B}${C}` : `${A}${B}`})^{-1}$?`,
            `这些矩阵都可逆。哪个式子等于 $(${three ? `${A}${B}${C}` : `${A}${B}`})^{-1}$？`,
          ],
          three ? `${C}^{-1}${B}^{-1}${A}^{-1}` : `${B}^{-1}${A}^{-1}`,
          three
            ? [`${A}^{-1}${B}^{-1}${C}^{-1}`, `${A}^{-1}${C}^{-1}${B}^{-1}`, `${C}^{-1}${A}^{-1}${B}^{-1}`]
            : [`${A}^{-1}${B}^{-1}`, `${B}${A}`, `-${A}${B}`],
          [
            `The inverses appear in reverse order, so the neighbors cancel one pair at a time.`,
            `逆矩阵按相反次序出现，这样相邻的一对对抵消。`,
          ],
        );
      },
    ),
  ],
  "calculating-the-inverse-of-a-3x3-matrix-using-the-cofactor-method": [
    skill(
      "the-inverse-of-a-diagonal-matrix",
      ["The inverse of a diagonal matrix", "对角矩阵的逆"],
      [
        "A diagonal matrix is undone by inverting each diagonal entry, as the cofactor method confirms. A zero on the diagonal would make the determinant zero, and no inverse would exist.",
        "对角矩阵的逆就是把每个对角元素取倒数，余子式法也证实了这一点。对角线上有零时行列式为零，逆不存在。",
      ],
      (rng) => {
        const [a, b, c] = [rng.int(2, 9), rng.int(2, 9), rng.int(2, 9)];
        const pos = rng.int(0, 2);
        const value = [a, b, c][pos]!;
        return fraction(
          [
            `Find the entry in row ${pos + 1}, column ${pos + 1} of the inverse of $${mat([a, 0, 0], [0, b, 0], [0, 0, c])}$.`,
            `求 $${mat([a, 0, 0], [0, b, 0], [0, 0, c])}$ 的逆矩阵第 ${pos + 1} 行第 ${pos + 1} 列的元素。`,
          ],
          Q.of(1, value),
          [Q.of(value), Q.of(-1, value), Q.of(1, a * b * c)],
          [`Each diagonal entry is inverted, so it is $${frac(1, value)}$.`, `每个对角元素取倒数，所以是 $${frac(1, value)}$。`],
        );
      },
    ),
  ],
  "solving-systems-of-equations-using-inverse-matrices": [
    skill(
      "solving-with-a-computed-inverse",
      ["Solving with a computed inverse", "用求出的逆矩阵解"],
      [
        "Multiplying both sides by the inverse on the left gives $\\mathbf{x} = A^{-1}\\mathbf{b}$. For a $2 \\times 2$ system, the inverse comes from swapping the diagonal, negating the rest and dividing by the determinant.",
        "两边左乘逆矩阵，得 $\\mathbf{x} = A^{-1}\\mathbf{b}$。对 $2 \\times 2$ 方程组，逆矩阵由交换对角元素、其余取负、再除以行列式得到。",
      ],
      (rng) => {
        const row = rng.pick<[number, number, number, number]>([
          [2, 1, 1, 1],
          [3, 2, 1, 1],
          [3, 1, 2, 1],
          [5, 2, 2, 1],
          [4, 3, 1, 1],
          [5, 3, 3, 2],
          [2, 3, 1, 2],
          [3, 5, 1, 2],
          [4, 1, 3, 1],
          [7, 4, 2, 1],
        ]);
        const [a, b, c, d] = row;
        const x = nz(rng, 9);
        const y = nz(rng, 9);
        const askX = rng.bool();
        return integer(
          [
            `Using the inverse of the coefficient matrix, which has determinant 1, solve $${mat([a, b], [c, d])}${mat(["x"], ["y"])} = ${mat([a * x + b * y], [c * x + d * y])}$. What is $${askX ? "x" : "y"}$?`,
            `用系数矩阵（行列式为 1）的逆解 $${mat([a, b], [c, d])}${mat(["x"], ["y"])} = ${mat([a * x + b * y], [c * x + d * y])}$。$${askX ? "x" : "y"}$ 是多少？`,
          ],
          askX ? x : y,
          [askX ? y : x, a * x + b * y, c * x + d * y],
          [
            `The inverse is $${mat([d, -b], [-c, a])}$, and multiplying gives $x = ${x}$ and $y = ${y}$.`,
            `逆矩阵是 $${mat([d, -b], [-c, a])}$，相乘得 $x = ${x}$，$y = ${y}$。`,
          ],
        );
      },
    ),
  ],
  "introduction-to-linear-transformations": [
    skill(
      "the-image-of-a-combination",
      ["The image of a combination", "线性组合的像"],
      [
        "Linearity means a transformation respects sums and multiples. So knowing the images of two vectors gives the image of any combination of them, with no need for a formula.",
        "线性表示变换保持和与倍数。所以知道两个向量的像，就能得到它们任意线性组合的像，不需要公式。",
      ],
      (rng) => {
        const [a, b, c, d] = [nz(rng, 7), nz(rng, 7), nz(rng, 7), nz(rng, 7)];
        const p = rng.int(2, 5);
        const q = rng.int(2, 5);
        return chooseFilled(
          rng,
          [
            `$T$ is linear, with $T(\\mathbf{u}) = ${vec(a, b)}$ and $T(\\mathbf{v}) = ${vec(c, d)}$. Find $T(${p}\\mathbf{u} - ${q}\\mathbf{v})$.`,
            `$T$ 是线性变换，$T(\\mathbf{u}) = ${vec(a, b)}$，$T(\\mathbf{v}) = ${vec(c, d)}$。求 $T(${p}\\mathbf{u} - ${q}\\mathbf{v})$。`,
          ],
          vec(p * a - q * c, p * b - q * d),
          [vec(p * a + q * c, p * b + q * d), vec(a - c, b - d), vec(p * c - q * a, p * d - q * b)],
          [`Linearity gives $${p}${vec(a, b)} - ${q}${vec(c, d)}$.`, `由线性性得 $${p}${vec(a, b)} - ${q}${vec(c, d)}$。`],
        );
      },
    ),
  ],
  "linear-transformations-of-points-and-lines-in-the-plane": [
    skill(
      "the-origin-stays-fixed",
      ["The origin stays fixed", "原点不动"],
      [
        "Any matrix sends the zero vector to the zero vector, so a linear transformation keeps the origin where it is. A map that moves the origin, such as a translation, cannot be linear.",
        "任何矩阵都把零向量变成零向量，所以线性变换保持原点不动。移动原点的映射（比如平移）不可能是线性的。",
      ],
      (rng) => {
        const [a, b, c, d] = [rng.int(2, 9), rng.int(2, 9), rng.int(2, 9), rng.int(2, 9)];
        const e = nz(rng, 9);
        const linear: Pair = [`$T(x, y) = (${a}x + ${b}y, ${c}x + ${d}y)$`, `$T(x, y) = (${a}x + ${b}y, ${c}x + ${d}y)$`];
        const others: Pair[] = [
          [`$T(x, y) = (x + ${Math.abs(e)}, y)$`, `$T(x, y) = (x + ${Math.abs(e)}, y)$`],
          [`$T(x, y) = (${a}x, y + ${Math.abs(d)})$`, `$T(x, y) = (${a}x, y + ${Math.abs(d)})$`],
          [`$T(x, y) = (${b}x + ${Math.abs(c)}, ${d}y)$`, `$T(x, y) = (${b}x + ${Math.abs(c)}, ${d}y)$`],
        ];
        return choose(rng, ["Which of these maps can be linear?", "下面哪个映射可能是线性的？"], linear, others, [
          "Each of the others sends the origin to a point that is not the origin.",
          "其他映射都把原点变到了不是原点的点。",
        ]);
      },
    ),
  ],
  "linear-transformations-of-objects-in-the-plane": [
    skill(
      "the-area-after-a-transformation",
      ["The area after a transformation", "变换后的面积"],
      [
        "A linear transformation multiplies every area by the same factor, the absolute value of its determinant. So the new area needs only the old area and that one number.",
        "线性变换把所有面积都乘同一个因数，即行列式的绝对值。所以新的面积只需要原面积和这一个数。",
      ],
      (rng) => {
        const [a, b, c, d] = [rng.int(1, 6), rng.int(0, 5), rng.int(0, 5), rng.int(1, 6)];
        const det = a * d - b * c === 0 ? 1 : a * d - b * c;
        const dd = a * d - b * c === 0 ? d + 1 : d;
        const real = a * dd - b * c;
        const area = rng.int(2, 20);
        return whole(
          [
            `A shape of area ${area} is transformed by $${mat([a, b], [c, dd])}$. What is the area of the image?`,
            `面积为 ${area} 的图形经 $${mat([a, b], [c, dd])}$ 变换。像的面积是多少？`,
          ],
          Math.abs(real) * area,
          [area, (a + dd) * area, Math.abs(det) * area === Math.abs(real) * area ? Math.abs(real) * area + area : Math.abs(det) * area],
          [
            `$|\\det| = ${Math.abs(real)}$, and $${Math.abs(real)} \\times ${area} = ${Math.abs(real) * area}$.`,
            `$|\\det| = ${Math.abs(real)}$，$${Math.abs(real)} \\times ${area} = ${Math.abs(real) * area}$。`,
          ],
        );
      },
    ),
  ],
  "dilations-and-reflections-as-linear-transformations": [
    skill(
      "reflecting-twice",
      ["Reflecting twice", "两次反射"],
      [
        "Reflecting in the same line twice returns every point, so the matrix of a reflection squared is the identity. Reflecting in both axes in turn is the same as turning by a half turn.",
        "在同一条直线上反射两次，每个点都回到原处，所以反射矩阵的平方是单位矩阵。依次在两条轴上反射，等于旋转半圈。",
      ],
      (rng) => {
        const x = nz(rng, 12);
        const y = nz(rng, 12);
        const both = rng.bool();
        return chooseFilled(
          rng,
          [
            both
              ? `The point $(${x}, ${y})$ is reflected in the $x$-axis and then in the $y$-axis. Where does it end?`
              : `The point $(${x}, ${y})$ is reflected in the line $y = x$ twice. Where does it end?`,
            both
              ? `点 $(${x}, ${y})$ 先在 $x$ 轴上反射，再在 $y$ 轴上反射。它最后在哪里？`
              : `点 $(${x}, ${y})$ 在直线 $y = x$ 上反射两次。它最后在哪里？`,
          ],
          both ? `(${-x}, ${-y})` : `(${x}, ${y})`,
          both ? [`(${x}, ${y})`, `(${y}, ${x})`, `(${x}, ${-y})`] : [`(${y}, ${x})`, `(${-x}, ${-y})`, `(${-y}, ${-x})`],
          [
            both
              ? "Each reflection changes the sign of one coordinate, which together form a half turn."
              : "Two reflections in one line undo each other.",
            both ? "每次反射改变一个坐标的符号，合起来是旋转半圈。" : "在同一条直线上的两次反射互相抵消。",
          ],
        );
      },
    ),
  ],
  "shear-and-stretch-as-linear-transformations": [
    skill(
      "shears-keep-area",
      ["Shears keep area", "切变保持面积"],
      [
        "A shear has a determinant of 1, so it slides points without changing area. A stretch by factor $k$ along one axis has a determinant of $k$, and it multiplies areas by $k$.",
        "切变的行列式是 1，所以只滑动点而不改变面积。沿一条轴拉伸 $k$ 倍的行列式是 $k$，面积也乘 $k$。",
      ],
      (rng) => {
        const area = rng.int(2, 30);
        const k = rng.int(2, 9);
        const shear = rng.bool();
        return whole(
          shear
            ? [
                `A shape of area ${area} goes through the horizontal shear with factor ${k}. What is the area of the image?`,
                `面积为 ${area} 的图形经过系数为 ${k} 的水平切变。像的面积是多少？`,
              ]
            : [
                `A shape of area ${area} is stretched by factor ${k} parallel to the $x$-axis. What is the area of the image?`,
                `面积为 ${area} 的图形沿 $x$ 轴方向拉伸 ${k} 倍。像的面积是多少？`,
              ],
          shear ? area : k * area,
          shear ? [k * area, area + k, k * k * area] : [area, k * k * area, area + k],
          [
            shear
              ? `The determinant of a shear is 1, so the area stays ${area}.`
              : `The determinant is ${k}, so the area becomes ${k * area}.`,
            shear ? `切变的行列式是 1，所以面积仍是 ${area}。` : `行列式是 ${k}，所以面积变成 ${k * area}。`,
          ],
        );
      },
    ),
  ],
  "right-angle-rotations-as-linear-transformations": [
    skill(
      "many-quarter-turns",
      ["Many quarter turns", "多次四分之一圈"],
      [
        "Four quarter turns bring every point back, so only the remainder after dividing by 4 matters. This reduces a large number of rotations to at most three.",
        "四个四分之一圈使每个点回到原处，所以只有除以 4 的余数有关。这把很多次旋转化成最多三次。",
      ],
      (rng) => {
        const x = nz(rng, 12);
        const y = nz(rng, 12);
        const n = rng.int(5, 60);
        const r = n % 4;
        const images: readonly string[] = [`(${x}, ${y})`, `(${-y}, ${x})`, `(${-x}, ${-y})`, `(${y}, ${-x})`];
        return chooseFilled(
          rng,
          [
            `The point $(${x}, ${y})$ is rotated counterclockwise by $90^{\\circ}$, ${n} times in a row. Where does it end?`,
            `点 $(${x}, ${y})$ 逆时针旋转 $90^{\\circ}$，连续 ${n} 次。它最后在哪里？`,
          ],
          images[r]!,
          images.filter((_, i) => i !== r),
          [
            `$${n} = 4 \\times ${Math.floor(n / 4)} + ${r}$, so only ${r} quarter ${r === 1 ? "turn counts" : "turns count"}.`,
            `$${n} = 4 \\times ${Math.floor(n / 4)} + ${r}$，所以只有 ${r} 个四分之一圈有效。`,
          ],
        );
      },
    ),
  ],
  "rotations-as-linear-transformations": [
    skill(
      "powers-of-a-rotation",
      ["Powers of a rotation", "旋转的幂"],
      [
        "Applying a rotation matrix again turns by the same angle again, so the matrix to the power $n$ rotates by $n$ times the angle. Whole turns can then be removed, as they change nothing.",
        "再次应用旋转矩阵，就再转同样的角，所以矩阵的 $n$ 次幂旋转 $n$ 倍的角。然后可以去掉整圈，因为它们不改变什么。",
      ],
      (rng) => {
        const angle = rng.int(1, 11) * 15;
        const n = rng.int(3, 9);
        const total = (angle * n) % 360;
        return whole(
          [
            `$R$ rotates the plane counterclockwise by $${angle}^{\\circ}$. By what angle does $R^{${n}}$ rotate it, in degrees from 0 up to 360?`,
            `$R$ 把平面逆时针旋转 $${angle}^{\\circ}$。$R^{${n}}$ 旋转多少度（0 到 360 度）？`,
          ],
          total,
          [angle, (total + 90) % 360, (angle + n) % 360],
          [
            `$${n} \\times ${angle} = ${angle * n}$, which leaves ${total} after removing full turns.`,
            `$${n} \\times ${angle} = ${angle * n}$，去掉整圈后是 ${total}。`,
          ],
        );
      },
    ),
  ],
  "combining-linear-transformations-using-2x2-matrices": [
    skill(
      "the-determinant-of-a-composite",
      ["The determinant of a composite", "复合变换的行列式"],
      [
        "Doing one transformation after another multiplies their area factors. So the determinant of the composite is the product of the determinants, whichever order they are done in.",
        "依次做两个变换，面积因数相乘。所以复合变换的行列式是行列式的积，不管次序如何。",
      ],
      (rng) => {
        const p = nz(rng, 9);
        const q = nz(rng, 9);
        const r = rng.int(2, 3);
        return integer(
          [
            `$\\det A = ${p}$ and $\\det B = ${q}$, both $2 \\times 2$. Find $\\det(A^{${r}}B)$.`,
            `$\\det A = ${p}$，$\\det B = ${q}$，都是 $2 \\times 2$ 矩阵。求 $\\det(A^{${r}}B)$。`,
          ],
          p ** r * q,
          [p * q, r * p * q, p ** r + q],
          [`$(${p})^{${r}} \\cdot (${q}) = ${p ** r * q}$.`, `$(${p})^{${r}} \\cdot (${q}) = ${p ** r * q}$。`],
        );
      },
    ),
  ],
  "inverting-linear-transformations": [
    skill(
      "when-no-inverse-exists",
      ["When no inverse exists", "何时没有逆"],
      [
        "A transformation with determinant zero squashes the plane onto a line or a point. Many points then share one image, so it cannot be undone and there is no inverse.",
        "行列式为零的变换把平面压到一条线或一个点上。于是很多点有同一个像，所以无法还原，没有逆变换。",
      ],
      (rng) => {
        const k = rng.int(2, 9);
        const a = nz(rng, 9);
        const b = nz(rng, 9);
        const c = rng.int(2, 6);
        return integer(
          [
            `For what value of $t$ does the transformation with matrix $${mat([a, b], [c * a, "t"])}$ have no inverse?`,
            `$t$ 为何值时，矩阵为 $${mat([a, b], [c * a, "t"])}$ 的变换没有逆变换？`,
          ],
          c * b,
          [b, -c * b, c * b + k],
          [
            `$\\det = ${a}t - ${paren(b)} \\cdot ${paren(c * a)} = 0$ gives $t = ${c * b}$, making the second row ${c} times the first.`,
            `$\\det = ${a}t - ${paren(b)} \\cdot ${paren(c * a)} = 0$，得 $t = ${c * b}$，第二行是第一行的 ${c} 倍。`,
          ],
        );
      },
    ),
  ],
};
