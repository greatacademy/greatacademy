// Knowledge points of Linear Algebra that ask the learner to read a drawing: transformed unit squares,
// eigen directions, null spaces and projections. See `deeperFiguresLinearAlgebraPoints`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import type { PlaneMark, Point } from "@ga/subject-math";
import { Q } from "@ga/subject-math";

import { ask, choose, type Pair, point, same } from "../university-kit.ts";
import { drawn } from "./figure-reading-more.ts";

type Compass = "ne" | "nw" | "se" | "sw";

/** view is the plane from -r to r on both axes. */
const view = (r: number) => ({ xMin: -r, xMax: r, yMin: -r, yMax: r });

/** fig wraps marks in a figure over the plane from -r to r, with its description in both languages. */
const fig = (r: number, marks: readonly PlaneMark[], [en, zh]: Pair) => drawn(view(r), marks, t(en, zh));

/** mat writes a two by two matrix by rows. */
const mat = (a: number, b: number, c: number, d: number) => `\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}`;

/** col writes a column vector. */
const col = (x: number, y: number) => `\\begin{pmatrix} ${x} \\\\ ${y} \\end{pmatrix}`;

/** away gives the compass direction that points away from the origin past a point. */
const away = ([x, y]: Point): Compass => (y >= 0 ? (x >= 0 ? "ne" : "nw") : x >= 0 ? "se" : "sw");

/** vector draws an arrow from the origin with a label at its tip. */
const vector = (to: Point, text: string, accent = true): PlaneMark[] => [
  { kind: "arrow", from: [0, 0], to, accent },
  { kind: "label", at: to, text, dir: away(to) },
];

/** nonzero lists the nonzero grid vectors with coordinates up to r in size. */
function nonzero(r: number): Point[] {
  const out: Point[] = [];
  for (let x = -r; x <= r; x++) for (let y = -r; y <= r; y++) if (x !== 0 || y !== 0) out.push([x, y]);
  return out;
}

const cross = (u: Point, v: Point) => u[0] * v[1] - u[1] * v[0];
const dot = (u: Point, v: Point) => u[0] * v[0] + u[1] * v[1];

/** primitive lists directions of lines through the origin, one for each line. */
const primitive: readonly Point[] = [
  [1, 0],
  [0, 1],
  [1, 1],
  [1, -1],
  [1, 2],
  [2, 1],
  [1, -2],
  [2, -1],
  [1, 3],
  [3, 1],
  [1, -3],
  [3, -1],
];

/** independentPair picks two grid vectors that are not parallel. */
function independentPair(rng: Rng, r: number): [Point, Point] {
  const u = rng.pick(nonzero(r));
  return [u, rng.pick(nonzero(r).filter((v) => cross(u, v) !== 0))];
}

/** unitSquare draws the dashed unit square of the plane before a map acts. */
const unitSquare: PlaneMark[] = [
  { kind: "segment", a: [1, 0], b: [1, 1], dashed: true },
  { kind: "segment", a: [0, 1], b: [1, 1], dashed: true },
  { kind: "segment", a: [0, 0], b: [1, 0], dashed: true },
  { kind: "segment", a: [0, 0], b: [0, 1], dashed: true },
];

/** imageOfSquare draws the images of the basis vectors over the dashed unit square. */
const imageOfSquare = (u: Point, v: Point): PlaneMark[] => [...unitSquare, ...vector(u, "T(e1)"), ...vector(v, "T(e2)")];

/** parallelogram shades the image of the unit square. */
const parallelogram = (u: Point, v: Point): PlaneMark => ({ kind: "polygon", points: [[0, 0], u, [u[0] + v[0], u[1] + v[1]], v] });

const altOfImage = (u: Point, v: Point): Pair => [
  `The dashed unit square and the arrows T(e1) to (${u[0]}, ${u[1]}) and T(e2) to (${v[0]}, ${v[1]}).`,
  `虚线单位正方形，以及指向 (${u[0]}, ${u[1]}) 的箭头 T(e1) 和指向 (${v[0]}, ${v[1]}) 的箭头 T(e2)。`,
];

const matrixFromSquare = point(
  "the-matrix-from-a-transformed-square",
  ["The matrix from a transformed square", "由变换后的正方形读矩阵"],
  [
    "The columns of the standard matrix are the images of the basis vectors. So a drawing of where the unit square lands gives the matrix directly: the image of the first basis vector is the first column, and the image of the second basis vector is the second column. Writing the images as rows gives the transpose by mistake.",
    "标准矩阵的列是基向量的像。所以单位正方形落在哪里的图直接给出矩阵：第一个基向量的像是第一列，第二个基向量的像是第二列。把像写成行，就误得到转置矩阵。",
  ],
  (rng) => {
    const [u, v] = independentPair(rng, 3);
    const [a, c, b, d] = [u[0], u[1], v[0], v[1]];
    return choose(
      rng,
      [
        "A linear map $T$ sends the dashed unit square to the shaded region. What is its standard matrix?",
        "线性映射 $T$ 把虚线单位正方形映成阴影区域。它的标准矩阵是什么？",
      ],
      same(mat(a, b, c, d)),
      [
        same(mat(a, c, b, d)),
        same(mat(b, a, d, c)),
        same(mat(-a, -b, -c, -d)),
        same(mat(c, d, a, b)),
        same(mat(a, -b, c, -d)),
        same(mat(-a, b, -c, d)),
      ],
      [
        `The arrows give $T(e_1) = (${a}, ${c})$ and $T(e_2) = (${b}, ${d})$. These are the columns of the matrix, in that order, which gives $${mat(a, b, c, d)}$.`,
        `箭头给出 $T(e_1) = (${a}, ${c})$，$T(e_2) = (${b}, ${d})$。它们依次是矩阵的列，所以矩阵是 $${mat(a, b, c, d)}$。`,
      ],
      fig(6, [parallelogram(u, v), ...imageOfSquare(u, v)], altOfImage(u, v)),
    );
  },
);

const determinantFromSquare = point(
  "the-determinant-from-a-transformed-square",
  ["The determinant from a transformed square", "由变换后的正方形读行列式"],
  [
    "The size of a two by two determinant is the area of the image of the unit square. Its sign tells the orientation: it is positive when the turn from the image of the first basis vector to the image of the second is counterclockwise, and negative when that turn is clockwise.",
    "二阶行列式的大小是单位正方形的像的面积。它的符号表示定向：从第一个基向量的像到第二个基向量的像的转向是逆时针时为正，是顺时针时为负。",
  ],
  (rng) => {
    const [u, v] = independentPair(rng, 3);
    const det = cross(u, v);
    return ask(
      [
        "A linear map $T$ sends the dashed unit square to the shaded region. What is the determinant of $T$?",
        "线性映射 $T$ 把虚线单位正方形映成阴影区域。$T$ 的行列式是多少？",
      ],
      det,
      [-det, u[0] * v[1] + u[1] * v[0], u[0] + v[1], dot(u, v)],
      [
        `The columns are $(${u[0]}, ${u[1]})$ and $(${v[0]}, ${v[1]})$, so the determinant is $(${u[0]})(${v[1]}) - (${v[0]})(${u[1]}) = ${det}$. The turn from $T(e_1)$ to $T(e_2)$ is ${det > 0 ? "counterclockwise, which matches the positive sign" : "clockwise, which matches the negative sign"}.`,
        `两列是 $(${u[0]}, ${u[1]})$ 和 $(${v[0]}, ${v[1]})$，所以行列式是 $(${u[0]})(${v[1]}) - (${v[0]})(${u[1]}) = ${det}$。从 $T(e_1)$ 到 $T(e_2)$ 的转向是${det > 0 ? "逆时针，与正号一致" : "顺时针，与负号一致"}。`,
      ],
      fig(6, [parallelogram(u, v), ...imageOfSquare(u, v)], altOfImage(u, v)),
    );
  },
);

const rankFromImage = point(
  "the-rank-from-the-image-of-the-basis",
  ["The rank from the image of the basis", "由基的像读秩"],
  [
    "The image of a linear map is spanned by the images of the basis vectors, and the rank is the dimension of that span. Two arrows that are not parallel span the whole plane, so the rank is two. Two parallel arrows span only a line through the origin, so the rank is one, however long the arrows are.",
    "线性映射的像由基向量的像张成，秩是这个张成空间的维数。两个不平行的箭头张成整个平面，所以秩是二。两个平行的箭头只张成过原点的一条直线，所以不论箭头多长，秩都是一。",
  ],
  (rng) => {
    const full = rng.bool(0.4);
    let u: Point;
    let v: Point;
    if (full) [u, v] = independentPair(rng, 3);
    else {
      const w = rng.pick(primitive.filter((p) => Math.abs(p[0]) <= 2 && Math.abs(p[1]) <= 2));
      const [p, q] = rng.sample([-3, -2, -1, 1, 2, 3], 2) as [number, number];
      u = [p * w[0], p * w[1]];
      v = [q * w[0], q * w[1]];
    }
    const answer = full ? 2 : 1;
    return ask(
      [
        "The arrows show the images under a linear map $T$ of the two standard basis vectors. What is the rank of $T$?",
        "箭头表示线性映射 $T$ 下两个标准基向量的像。$T$ 的秩是多少？",
      ],
      answer,
      [3 - answer, 0, 3],
      [
        full
          ? "The two arrows are not parallel, so they span the whole plane and the rank is $2$."
          : "The two arrows lie on one line through the origin, so their span is that line and the rank is $1$.",
        full ? "两个箭头不平行，所以张成整个平面，秩是 $2$。" : "两个箭头在过原点的同一条直线上，所以张成的就是这条直线，秩是 $1$。",
      ],
      fig(6, imageOfSquare(u, v), altOfImage(u, v)),
    );
  },
);

const kernelFromImage = point(
  "the-kernel-from-collapsed-arrows",
  ["The kernel from collapsed arrows", "由共线的箭头读核"],
  [
    "When the images of the basis vectors lie on one line, some combination of the basis vectors is sent to zero, and that combination spans the kernel. If the images are $p$ and $q$ times the same vector, then $q$ times the first basis vector minus $p$ times the second goes to zero.",
    "当基向量的像在同一条直线上时，基向量的某个组合被映到零，这个组合张成核。如果两个像分别是同一向量的 $p$ 倍和 $q$ 倍，那么 $q$ 倍第一个基向量减 $p$ 倍第二个基向量就映到零。",
  ],
  (rng) => {
    const w = rng.pick<Point>([
      [1, 0],
      [0, 1],
      [1, 1],
      [1, -1],
      [1, 2],
      [2, 1],
      [2, -1],
    ]);
    const [p, q] = rng.pick([
      [1, 2],
      [2, 1],
      [1, 3],
      [3, 1],
      [2, 3],
      [3, 2],
      [1, -2],
      [-2, 1],
      [-1, 3],
      [3, -1],
      [2, -3],
      [-3, 2],
    ] as const);
    const u: Point = [p * w[0], p * w[1]];
    const v: Point = [q * w[0], q * w[1]];
    const answer: Point = [q, -p];
    const wrong = ([[p, q], [q, p], [p, -q], w] as Point[]).filter((c) => cross(c, answer) !== 0);
    return choose(
      rng,
      [
        "The arrows show the images under a linear map $T$ of the two standard basis vectors. Which vector spans the kernel of $T$?",
        "箭头表示线性映射 $T$ 下两个标准基向量的像。哪个向量张成 $T$ 的核？",
      ],
      same(col(answer[0], answer[1])),
      wrong.map((c) => same(col(c[0], c[1]))),
      [
        `The drawing shows $T(e_1) = (${u[0]}, ${u[1]})$ and $T(e_2) = (${v[0]}, ${v[1]})$, which are $${p}$ and $${q}$ times $(${w[0]}, ${w[1]})$. So $(${q})T(e_1) - (${p})T(e_2) = 0$, and the kernel is spanned by $(${answer[0]}, ${answer[1]})$.`,
        `由图得 $T(e_1) = (${u[0]}, ${u[1]})$，$T(e_2) = (${v[0]}, ${v[1]})$，它们分别是 $(${w[0]}, ${w[1]})$ 的 $${p}$ 倍和 $${q}$ 倍。所以 $(${q})T(e_1) - (${p})T(e_2) = 0$，核由 $(${answer[0]}, ${answer[1]})$ 张成。`,
      ],
      fig(7, imageOfSquare(u, v), altOfImage(u, v)),
    );
  },
);

const eigenvalueFromPair = point(
  "the-eigenvalue-from-a-vector-and-its-image",
  ["The eigenvalue from a vector and its image", "由向量及其像读特征值"],
  [
    "A vector is an eigenvector when its image lies on the same line through the origin. The eigenvalue is the factor between the two arrows: its size is the ratio of their lengths, and it is negative when the image points the opposite way. A shrinking arrow means an eigenvalue smaller than one in size.",
    "当向量的像在过原点的同一条直线上时，它就是特征向量。特征值是两个箭头之间的倍数：大小是长度之比，当像指向相反方向时为负。箭头缩短说明特征值的绝对值小于一。",
  ],
  (rng) => {
    const w = rng.pick(primitive.filter((p) => Math.abs(p[0]) <= 2 && Math.abs(p[1]) <= 2));
    const sign = rng.sign();
    const half = rng.bool(0.3);
    const k = half ? Q.of(sign, 2) : Q.of(sign > 0 ? rng.int(2, 3) : -rng.int(1, 3));
    const size = half ? 2 : 1;
    const v: Point = [size * w[0], size * w[1]];
    const image: Point = [k.toNumber() * v[0], k.toNumber() * v[1]];
    return ask(
      [
        "The arrows show a vector $v$ and its image $Av$. What eigenvalue does $v$ have?",
        "箭头表示向量 $v$ 及其像 $Av$。$v$ 的特征值是多少？",
      ],
      k,
      [k.neg(), Q.one.div(k), k.abs().add(Q.one)],
      [
        `The drawing shows $v = (${v[0]}, ${v[1]})$ and $Av = (${image[0]}, ${image[1]})$. Dividing matching coordinates gives the factor $${k.toLatex()}$, so that is the eigenvalue.`,
        `由图得 $v = (${v[0]}, ${v[1]})$，$Av = (${image[0]}, ${image[1]})$。对应坐标相除得到倍数 $${k.toLatex()}$，这就是特征值。`,
      ],
      fig(
        6,
        [...vector(image, "Av"), { kind: "arrow", from: [0, 0], to: v }, { kind: "label", at: v, text: "v", dir: rng.bool() ? "n" : "s" }],
        [
          `An arrow v to (${v[0]}, ${v[1]}) and an arrow Av to (${image[0]}, ${image[1]}).`,
          `指向 (${v[0]}, ${v[1]}) 的箭头 v 和指向 (${image[0]}, ${image[1]}) 的箭头 Av。`,
        ],
      ),
    );
  },
);

const splitAlongEigen = point(
  "applying-a-matrix-through-eigen-directions",
  ["Applying a matrix through eigen directions", "沿特征方向作用矩阵"],
  [
    "If a point is a combination of two eigenvectors, the matrix acts on each part separately by scaling it with its own eigenvalue. So write the point as a combination of the two arrows by reading the drawing, scale each part, and add. Scaling the coordinates of the point directly works only when the eigenvectors are the axes.",
    "如果一个点是两个特征向量的组合，矩阵就分别作用于每一部分，按各自的特征值缩放。所以先从图中把点写成两个箭头的组合，再缩放各部分并相加。直接缩放点的坐标，只有在特征向量就是坐标轴时才成立。",
  ],
  (rng) => {
    const [u, w] = rng.pick<readonly [Point, Point]>([
      [
        [1, 1],
        [1, -1],
      ],
      [
        [1, 1],
        [0, 1],
      ],
      [
        [1, 0],
        [1, 1],
      ],
      [
        [1, 2],
        [2, -1],
      ],
      [
        [2, 1],
        [-1, 1],
      ],
    ]);
    const [a, b] = [rng.pick([-2, -1, 1, 2]), rng.pick([-2, -1, 1, 2])];
    const P: Point = [a * u[0] + b * w[0], a * u[1] + b * w[1]];
    const [l1, l2] = rng.sample([-1, 2, 3, 4], 2) as [number, number];
    const image = (x: number, y: number): Point => [x * a * u[0] + y * b * w[0], x * a * u[1] + y * b * w[1]];
    const answer = image(l1, l2);
    const times = (l: number) => (l === -1 ? "-" : `${l}`);
    const parts = [image(l2, l1), [l1 * P[0], l2 * P[1]] as Point, [l1 * P[0], l1 * P[1]] as Point, [l2 * P[0], l2 * P[1]] as Point];
    return choose(
      rng,
      [
        `The arrows are eigenvectors of $A$: $Au = ${times(l1)}u$ and $Aw = ${times(l2)}w$. What is $AP$ for the point $P$ drawn?`,
        `箭头是 $A$ 的特征向量：$Au = ${times(l1)}u$，$Aw = ${times(l2)}w$。对图中的点 $P$，$AP$ 是什么？`,
      ],
      same(col(answer[0], answer[1])),
      parts.map((c) => same(col(c[0], c[1]))),
      [
        `Reading the drawing gives $P = (${a})u + (${b})w$. Scaling each part gives $AP = (${a})(${l1})u + (${b})(${l2})w = (${answer[0]}, ${answer[1]})$.`,
        `由图得 $P = (${a})u + (${b})w$。缩放各部分得 $AP = (${a})(${l1})u + (${b})(${l2})w = (${answer[0]}, ${answer[1]})$。`,
      ],
      fig(
        6,
        [...vector(u, "u"), ...vector(w, "w"), { kind: "point", at: P, label: "P", dir: "n" }],
        [
          `Arrows u to (${u[0]}, ${u[1]}) and w to (${w[0]}, ${w[1]}), and the point P at (${P[0]}, ${P[1]}).`,
          `指向 (${u[0]}, ${u[1]}) 的箭头 u，指向 (${w[0]}, ${w[1]}) 的箭头 w，以及位于 (${P[0]}, ${P[1]}) 的点 P。`,
        ],
      ),
    );
  },
);

const eigenFromShear = point(
  "the-eigen-direction-of-a-drawn-shear",
  ["The eigen direction of a drawn shear", "图中剪切的特征方向"],
  [
    "An eigenvector of a map is a vector whose image stays on its own line through the origin. In a drawing of a shear combined with uniform scaling, one edge of the square stays on its line while the other tips over. That edge gives the only eigen direction, and every other direction turns.",
    "映射的特征向量是像仍在自身所在的过原点直线上的向量。在剪切与均匀缩放结合的图中，正方形的一条边留在自己的直线上，另一条边倾斜。这条边给出唯一的特征方向，其他方向都会转动。",
  ],
  (rng) => {
    const s = rng.int(1, 3);
    const k = rng.nonZero(-3, 3);
    const upper = rng.bool();
    const u: Point = upper ? [s, 0] : [s, k];
    const v: Point = upper ? [k, s] : [0, s];
    const answer = upper ? col(1, 0) : col(0, 1);
    return choose(
      rng,
      [
        "The arrows show the images under $T$ of the standard basis vectors. Which vector is an eigenvector of $T$?",
        "箭头表示 $T$ 下标准基向量的像。哪个向量是 $T$ 的特征向量？",
      ],
      same(answer),
      [same(upper ? col(0, 1) : col(1, 0)), same(col(1, 1)), same(col(1, -1))],
      [
        `The image of $e_${upper ? 1 : 2}$ stays on its own axis, with factor $${s}$, so that basis vector is an eigenvector. The other basis vector tips off its axis, and the eigenvalue $${s}$ is repeated with this one direction only.`,
        `$e_${upper ? 1 : 2}$ 的像留在自己的坐标轴上，倍数是 $${s}$，所以这个基向量是特征向量。另一个基向量偏离了自己的坐标轴，重特征值 $${s}$ 只有这一个方向。`,
      ],
      fig(5, imageOfSquare(u, v), altOfImage(u, v)),
    );
  },
);

const coordsInBasis = point(
  "reading-a-combination-of-two-arrows",
  ["Reading a combination of two arrows", "读两个箭头的组合"],
  [
    "Two arrows that are not parallel span the plane, so every point is exactly one combination of them. To read the coefficients, solve the two coordinate equations given by the drawing. The coefficients are not the coordinates of the point, unless the two arrows happen to be the standard basis vectors.",
    "两个不平行的箭头张成平面，所以每个点都恰好是它们的一个组合。要读出系数，就解图给出的两个坐标方程。除非两个箭头恰好是标准基向量，否则系数不是点的坐标。",
  ],
  (rng) => {
    const [u, w] = independentPair(rng, 2);
    const options: [number, number][] = [];
    for (const s of [-2, -1, 1, 2, 3])
      for (const c of [-2, -1, 1, 2, 3]) {
        const P: Point = [s * u[0] + c * w[0], s * u[1] + c * w[1]];
        if (Math.abs(P[0]) <= 7 && Math.abs(P[1]) <= 7) options.push([s, c]);
      }
    const [s, c] = rng.pick(options.length > 0 ? options : [[1, 1] as [number, number]]);
    const P: Point = [s * u[0] + c * w[0], s * u[1] + c * w[1]];
    const asksFirst = rng.bool();
    return ask(
      asksFirst
        ? [
            "Write the point $P$ as $P = su + tw$ using the arrows drawn. What is $s$?",
            "用图中的箭头把点 $P$ 写成 $P = su + tw$。$s$ 是多少？",
          ]
        : [
            "Write the point $P$ as $P = su + tw$ using the arrows drawn. What is $t$?",
            "用图中的箭头把点 $P$ 写成 $P = su + tw$。$t$ 是多少？",
          ],
      asksFirst ? s : c,
      [asksFirst ? c : s, -(asksFirst ? s : c), P[0], P[1]],
      [
        `The drawing gives $u = (${u[0]}, ${u[1]})$, $w = (${w[0]}, ${w[1]})$ and $P = (${P[0]}, ${P[1]})$. Solving the two coordinate equations gives $s = ${s}$ and $t = ${c}$.`,
        `由图得 $u = (${u[0]}, ${u[1]})$，$w = (${w[0]}, ${w[1]})$，$P = (${P[0]}, ${P[1]})$。解两个坐标方程得 $s = ${s}$，$t = ${c}$。`,
      ],
      fig(
        8,
        [...vector(u, "u"), ...vector(w, "w"), { kind: "point", at: P, label: "P", dir: "n" }],
        [
          `Arrows u to (${u[0]}, ${u[1]}) and w to (${w[0]}, ${w[1]}), and the point P at (${P[0]}, ${P[1]}).`,
          `指向 (${u[0]}, ${u[1]}) 的箭头 u，指向 (${w[0]}, ${w[1]}) 的箭头 w，以及位于 (${P[0]}, ${P[1]}) 的点 P。`,
        ],
      ),
    );
  },
);

const nullSpaceLine = point(
  "the-matrix-from-a-drawn-null-space",
  ["The matrix from a drawn null space", "由图中零空间读矩阵"],
  [
    "A vector lies in the null space when every row of the matrix is perpendicular to it. So a matrix whose null space is a given line through the origin must have rows perpendicular to that line. Rows that point along the line are a common mistake: they give the perpendicular line as the null space instead.",
    "向量在零空间中，当且仅当矩阵的每一行都与它垂直。所以零空间是过原点某条直线的矩阵，它的行必须垂直于这条直线。行沿直线方向是常见错误：那样得到的零空间是垂直的那条直线。",
  ],
  (rng) => {
    const [p, q] = rng.pick(primitive);
    const m = rng.int(1, 3);
    const row = (a: number, b: number) => mat(a, b, m * a, m * b);
    const candidates = (
      [
        [p, q],
        [q, p],
        [p, -q],
      ] as Point[]
    ).filter((c) => dot(c, [p, q]) !== 0);
    return choose(
      rng,
      ["The line drawn is the null space of a matrix. Which matrix is it?", "图中的直线是某个矩阵的零空间。是哪个矩阵？"],
      same(row(q, -p)),
      [...candidates.map((c) => same(row(c[0], c[1]))), same(row(q + p, q - p)), same(row(p + 2 * q, q - 2 * p))],
      [
        `The line passes through $(${p}, ${q})$, so each row must be perpendicular to that vector. The row $(${q}, ${-p})$ is, since $(${q})(${p}) + (${-p})(${q}) = 0$, and the second row is a multiple of it.`,
        `直线过点 $(${p}, ${q})$，所以每一行都必须垂直于这个向量。行 $(${q}, ${-p})$ 满足这一点，因为 $(${q})(${p}) + (${-p})(${q}) = 0$，第二行是它的倍数。`,
      ],
      fig(
        5,
        [{ kind: "line", a: [0, 0], b: [p, q], accent: true }],
        [`A line through the origin and (${p}, ${q}).`, `过原点和 (${p}, ${q}) 的直线。`],
      ),
    );
  },
);

const projectionFromDrawing = point(
  "the-projection-onto-a-drawn-line",
  ["The projection onto a drawn line", "向图中直线投影"],
  [
    "The projection of a vector onto a line through the origin is the point of the line closest to its tip. With a direction $u$ read from the line, it equals $\\frac{v \\cdot u}{u \\cdot u}u$. The difference between the vector and its projection is perpendicular to the line, which gives a way to check the result.",
    "向量在过原点直线上的投影是直线上离其终点最近的点。从直线上读出方向 $u$ 后，投影等于 $\\frac{v \\cdot u}{u \\cdot u}u$。向量与投影之差垂直于直线，可以用来检验结果。",
  ],
  (rng) => {
    const u = rng.pick(primitive.filter((p) => Math.abs(p[0]) <= 2 && Math.abs(p[1]) <= 2));
    const n: Point = [-u[1], u[0]];
    const choices: [number, number][] = [];
    for (const a of [-2, -1, 1, 2, 3])
      for (const b of [-2, -1, 1, 2]) {
        if (Math.abs(a * u[0] + b * n[0]) <= 5 && Math.abs(a * u[1] + b * n[1]) <= 5) choices.push([a, b]);
      }
    const [a, b] = rng.pick(choices);
    const v: Point = [a * u[0] + b * n[0], a * u[1] + b * n[1]];
    const proj: Point = [a * u[0], a * u[1]];
    const rest: Point = [b * n[0], b * n[1]];
    return choose(
      rng,
      [
        "The arrow $v$ and a line through the origin are drawn. What is the projection of $v$ onto the line?",
        "图中画出了箭头 $v$ 和一条过原点的直线。$v$ 在这条直线上的投影是什么？",
      ],
      same(col(proj[0], proj[1])),
      ([rest, u, v, [-proj[0], -proj[1]], [dot(v, u) * u[0], dot(v, u) * u[1]]] as Point[]).map((c) => same(col(c[0], c[1]))),
      [
        `Take $u = (${u[0]}, ${u[1]})$ on the line. Then $v \\cdot u = ${dot(v, u)}$ and $u \\cdot u = ${dot(u, u)}$, so the factor is $${a}$ and the projection is $(${proj[0]}, ${proj[1]})$.`,
        `在直线上取 $u = (${u[0]}, ${u[1]})$。则 $v \\cdot u = ${dot(v, u)}$，$u \\cdot u = ${dot(u, u)}$，所以倍数是 $${a}$，投影是 $(${proj[0]}, ${proj[1]})$。`,
      ],
      fig(
        6,
        [{ kind: "line", a: [0, 0], b: u }, ...vector(v, "v")],
        [
          `A line through the origin and (${u[0]}, ${u[1]}), and an arrow v to (${v[0]}, ${v[1]}).`,
          `过原点和 (${u[0]}, ${u[1]}) 的直线，以及指向 (${v[0]}, ${v[1]}) 的箭头 v。`,
        ],
      ),
    );
  },
);

const orthogonalPair = point(
  "spotting-the-perpendicular-pair",
  ["Spotting the perpendicular pair", "找出垂直的一对"],
  [
    "Two vectors are orthogonal exactly when their dot product is zero. Reading coordinates from a drawing and testing the dot product is more reliable than judging angles by eye, particularly when the arrows have different lengths or do not lie along the grid lines of the drawing.",
    "两个向量正交，当且仅当它们的点积为零。从图中读出坐标并计算点积，比用眼睛判断角度更可靠，尤其是箭头长度不同或不沿网格线的时候。",
  ],
  (rng) => {
    const x = rng.pick(nonzero(3).filter((p) => p[0] !== 0 && p[1] !== 0));
    const k = rng.pick([1, -1]);
    const y: Point = [-k * x[1], k * x[0]];
    const c = rng.pick(nonzero(3).filter((p) => dot(p, x) !== 0 && dot(p, y) !== 0));
    const d = rng.pick(nonzero(3).filter((p) => dot(p, x) !== 0 && dot(p, y) !== 0 && dot(p, c) !== 0 && cross(p, c) !== 0));
    const names = rng.shuffle(["a", "b", "c", "d"]) as [string, string, string, string];
    const pair = (i: number, j: number): Pair => {
      const [m, n] = [names[i] as string, names[j] as string].sort();
      return [`$${m}$ and $${n}$`, `$${m}$ 和 $${n}$`];
    };
    const vs = [x, y, c, d];
    return choose(
      rng,
      ["Which two of the arrows drawn are perpendicular?", "图中哪两个箭头互相垂直？"],
      pair(0, 1),
      [pair(0, 2), pair(1, 3), pair(2, 3), pair(0, 3), pair(1, 2)],
      [
        `Reading coordinates gives $(${x[0]}, ${x[1]})$ and $(${y[0]}, ${y[1]})$ for these two arrows, whose dot product is $(${x[0]})(${y[0]}) + (${x[1]})(${y[1]}) = 0$. No other pair has dot product zero.`,
        `读出这两个箭头的坐标为 $(${x[0]}, ${x[1]})$ 和 $(${y[0]}, ${y[1]})$，点积是 $(${x[0]})(${y[0]}) + (${x[1]})(${y[1]}) = 0$。其他各对的点积都不为零。`,
      ],
      fig(
        4,
        vs.flatMap((v, i) => vector(v, names[i] as string)),
        [
          `Four arrows from the origin: ${vs.map((v, i) => `${names[i]} to (${v[0]}, ${v[1]})`).join(", ")}.`,
          `从原点出发的四个箭头：${vs.map((v, i) => `${names[i]} 指向 (${v[0]}, ${v[1]})`).join("，")}。`,
        ],
      ),
    );
  },
);

const orthogonalTransform = point(
  "applying-a-drawn-orthogonal-map",
  ["Applying a drawn orthogonal map", "作用图中的正交映射"],
  [
    "An orthogonal map sends the standard basis to perpendicular unit vectors, and a drawing of these two arrows fixes the whole map. A point $(x, y)$ goes to $x$ times the first arrow plus $y$ times the second. Using the transpose instead applies the inverse map, which sends the point somewhere else unless the map is its own inverse.",
    "正交映射把标准基映成互相垂直的单位向量，这两个箭头的图就确定了整个映射。点 $(x, y)$ 映到 $x$ 倍第一个箭头加 $y$ 倍第二个箭头。用转置矩阵则是作用逆映射，除非映射是自身的逆，否则点会被送到别处。",
  ],
  (rng) => {
    const u = rng.pick<Point>([
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
    ]);
    const sign = rng.sign();
    const v: Point = [-sign * u[1], sign * u[0]];
    const P: Point = [rng.nonZero(-4, 4), rng.nonZero(-4, 4)];
    const image: Point = [P[0] * u[0] + P[1] * v[0], P[0] * u[1] + P[1] * v[1]];
    const inverse: Point = [P[0] * u[0] + P[1] * u[1], P[0] * v[0] + P[1] * v[1]];
    return choose(
      rng,
      [
        "The arrows show the images of the standard basis under an orthogonal map $T$. What is $T(P)$ for the point $P$ drawn?",
        "箭头表示正交映射 $T$ 下标准基的像。对图中的点 $P$，$T(P)$ 是什么？",
      ],
      same(col(image[0], image[1])),
      ([inverse, [-image[0], -image[1]], P, [image[1], image[0]], [image[0], -image[1]], [-image[0], image[1]]] as Point[]).map((c) =>
        same(col(c[0], c[1])),
      ),
      [
        `The drawing gives $P = (${P[0]}, ${P[1]})$, $T(e_1) = (${u[0]}, ${u[1]})$ and $T(e_2) = (${v[0]}, ${v[1]})$. So $T(P) = (${P[0]})T(e_1) + (${P[1]})T(e_2) = (${image[0]}, ${image[1]})$.`,
        `由图得 $P = (${P[0]}, ${P[1]})$，$T(e_1) = (${u[0]}, ${u[1]})$，$T(e_2) = (${v[0]}, ${v[1]})$。所以 $T(P) = (${P[0]})T(e_1) + (${P[1]})T(e_2) = (${image[0]}, ${image[1]})$。`,
      ],
      fig(
        5,
        [...imageOfSquare(u, v), { kind: "point", at: P, label: "P", dir: "n" }],
        [
          `Arrows T(e1) to (${u[0]}, ${u[1]}) and T(e2) to (${v[0]}, ${v[1]}), and the point P at (${P[0]}, ${P[1]}).`,
          `指向 (${u[0]}, ${u[1]}) 的箭头 T(e1)，指向 (${v[0]}, ${v[1]}) 的箭头 T(e2)，以及位于 (${P[0]}, ${P[1]}) 的点 P。`,
        ],
      ),
    );
  },
);

const vectorEquationOfLine = point(
  "the-vector-equation-of-a-drawn-line",
  ["The vector equation of a drawn line", "图中直线的向量方程"],
  [
    "A vector equation of a line is a point on the line plus a parameter times a direction along it. Any point on the line and any nonzero multiple of the direction will do. Exchanging the point and the direction gives a different line, and a direction read with its coordinates swapped gives a line with the wrong slope.",
    "直线的向量方程是直线上一点加参数乘以沿直线的方向。可以取直线上任一点和方向的任一非零倍数。交换点和方向会得到另一条直线，读方向时交换坐标则得到斜率错误的直线。",
  ],
  (rng) => {
    const d = rng.pick(primitive.filter((p) => Math.abs(p[0]) !== Math.abs(p[1]) && Math.abs(p[0]) <= 2 && Math.abs(p[1]) <= 2));
    const A = rng.pick(nonzero(3).filter((p) => cross(p, d) !== 0));
    const B: Point = [A[0] + d[0], A[1] + d[1]];
    const eq = (p: Point, q: Point) => `\\mathbf{r} = ${col(p[0], p[1])} + t${col(q[0], q[1])}`;
    return choose(
      rng,
      ["Which equation describes the line drawn through $A$ and $B$?", "哪个方程描述了图中过 $A$ 和 $B$ 的直线？"],
      same(eq(A, d)),
      [same(eq(d, A)), same(eq(A, [d[1], d[0]])), same(eq(A, [-d[1], d[0]])), same(eq([-A[0], -A[1]], d))],
      [
        `The drawing gives $A = (${A[0]}, ${A[1]})$ and $B = (${B[0]}, ${B[1]})$, so the direction is $B - A = (${d[0]}, ${d[1]})$. Starting at $A$ and moving along that direction gives the equation.`,
        `由图得 $A = (${A[0]}, ${A[1]})$，$B = (${B[0]}, ${B[1]})$，所以方向是 $B - A = (${d[0]}, ${d[1]})$。从 $A$ 出发沿这个方向移动就得到方程。`,
      ],
      fig(
        6,
        [
          { kind: "line", a: A, b: B, accent: true },
          { kind: "point", at: A, label: "A", dir: "n" },
          { kind: "point", at: B, label: "B", dir: "s" },
        ],
        [
          `A line through A at (${A[0]}, ${A[1]}) and B at (${B[0]}, ${B[1]}).`,
          `过位于 (${A[0]}, ${A[1]}) 的 A 和位于 (${B[0]}, ${B[1]}) 的 B 的直线。`,
        ],
      ),
    );
  },
);

/** deeperFiguresLinearAlgebraPoints adds knowledge points of Linear Algebra that are answered by reading a drawing. */
export const deeperFiguresLinearAlgebraPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "standard-matrix-of-a-linear-transformation-in-terms-of-the-standard-basis": [matrixFromSquare],
  "basic-properties-of-determinants": [determinantFromSquare],
  "image-and-rank-of-a-linear-transformation": [rankFromImage],
  "kernel-of-a-linear-transformation": [kernelFromImage],
  "eigenvalues-and-eigenvectors-of-a-2x2-matrix": [eigenvalueFromPair, splitAlongEigen],
  "calculating-the-eigenvectors-of-a-2x2-matrix": [eigenFromShear],
  "linear-span-of-vectors-in-n-dimensional-euclidean-space": [coordsInBasis],
  "the-null-space-of-a-matrix": [nullSpaceLine],
  "projecting-vectors-onto-one-dimensional-subspaces": [projectionFromDrawing],
  "orthogonal-vectors-in-euclidean-spaces": [orthogonalPair],
  "orthogonal-linear-transformations": [orthogonalTransform],
  "the-vector-equation-of-a-line": [vectorEquationOfLine],
};
