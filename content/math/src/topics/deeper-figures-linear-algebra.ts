// Knowledge points of Linear Algebra that ask the learner to read a drawing: transformed unit squares,
// eigen directions, null spaces and projections. See `deeperFiguresLinearAlgebraPoints`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import type { PlaneMark, Point } from "@ga/subject-math";
import { Q } from "@ga/subject-math";
import { linearAlgebraDrawings1 } from "../explanation-drawings-linear-algebra-1.ts";
import { linearAlgebraDrawings2 } from "../explanation-drawings-linear-algebra-2.ts";

import { numberProblem, why } from "../problems.ts";
import { choose, type Pair, point, same } from "../university-kit.ts";
import { reasoned } from "../wrong-reasons.ts";
import { walked } from "./calculus-i-differentiation.ts";
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
    "The columns of the standard matrix are the images of the basis vectors. So a drawing of where the unit square lands gives the matrix directly: the image of the first basis vector is the first column, and the image of the second basis vector is the second column. For example, if the arrows end at $T(e_1) = (2, 1)$ and $T(e_2) = (-1, 3)$, the matrix is $\\begin{pmatrix} 2 & -1 \\\\ 1 & 3 \\end{pmatrix}$, and multiplying it by $(1, 0)$ gives back $(2, 1)$.\n\n> **Watch out.** Write each image as a column, not a row: writing the images as rows gives the transpose. Keep the order too, since $T(e_1)$ is the first column.",
    "标准矩阵的列是基向量的像。所以单位正方形落在哪里的图直接给出矩阵：第一个基向量的像是第一列，第二个基向量的像是第二列。例如箭头终点为 $T(e_1) = (2, 1)$，$T(e_2) = (-1, 3)$ 时，矩阵是 $\\begin{pmatrix} 2 & -1 \\\\ 1 & 3 \\end{pmatrix}$，用它乘 $(1, 0)$ 又得到 $(2, 1)$。\n\n> **注意。** 把每个像写成列，而不是行：写成行得到的是转置矩阵。还要保持顺序，$T(e_1)$ 是第一列。",
  ],
  (rng) => {
    const [u, v] = independentPair(rng, 3);
    const [a, c, b, d] = [u[0], u[1], v[0], v[1]];
    const wrong: [string, string, string][] = [
      [mat(a, c, b, d), "This writes the images as rows, which gives the transpose.", "这把像写成了行，得到的是转置矩阵。"],
      [mat(b, a, d, c), "The columns are swapped: $T(e_1)$ must be the first column.", "两列交换了：$T(e_1)$ 必须是第一列。"],
      [mat(-a, -b, -c, -d), "Every sign is flipped; the arrows are read with their own signs.", "所有符号都反了；箭头的坐标要按原符号读。"],
      [
        mat(c, d, a, b),
        "The rows are swapped, so each column lists its coordinates in the wrong order.",
        "两行交换了，所以每一列的坐标顺序都错了。",
      ],
      [
        mat(a, -b, c, -d),
        "The second column has the wrong sign; it must equal $T(e_2)$ exactly.",
        "第二列的符号错了；它必须恰好等于 $T(e_2)$。",
      ],
      [
        mat(-a, b, -c, d),
        "The first column has the wrong sign; it must equal $T(e_1)$ exactly.",
        "第一列的符号错了；它必须恰好等于 $T(e_1)$。",
      ],
    ];
    const choice = choose(
      rng,
      [
        "A linear map $T$ sends the dashed unit square to the shaded region. What is its standard matrix?",
        "线性映射 $T$ 把虚线单位正方形映成阴影区域。它的标准矩阵是什么？",
      ],
      same(mat(a, b, c, d)),
      wrong.map(([m]) => same(m)),
      [
        `**Step 1: Read the arrows.** The drawing shows $T(e_1) = (${a}, ${c})$ and $T(e_2) = (${b}, ${d})$.\n\n**Step 2: Write them as columns.** In that order they are the columns, which gives $${mat(a, b, c, d)}$.\n\n**Check.** $${mat(a, b, c, d)}${col(1, 0)} = ${col(a, c)}$ and $${mat(a, b, c, d)}${col(0, 1)} = ${col(b, d)}$, the two drawn arrows.`,
        `**第一步：读出箭头。** 由图得 $T(e_1) = (${a}, ${c})$，$T(e_2) = (${b}, ${d})$。\n\n**第二步：写成列。** 按这个顺序它们就是矩阵的列，得 $${mat(a, b, c, d)}$。\n\n**检验。** $${mat(a, b, c, d)}${col(1, 0)} = ${col(a, c)}$，$${mat(a, b, c, d)}${col(0, 1)} = ${col(b, d)}$，正是图中的两个箭头。`,
      ],
      fig(6, [parallelogram(u, v), ...imageOfSquare(u, v)], altOfImage(u, v)),
    );
    return reasoned(
      choice,
      wrong.map(([m, en, zh]): [string, string, string] => [same(m)[0], en, zh]),
    );
  },
);

const determinantFromSquare = point(
  "the-determinant-from-a-transformed-square",
  ["The determinant from a transformed square", "由变换后的正方形读行列式"],
  [
    "The size of a two by two determinant is the area of the image of the unit square. Its sign tells the orientation: it is positive when the turn from the image of the first basis vector to the image of the second is counterclockwise, and negative when that turn is clockwise. If $T(e_1) = (2, 0)$ and $T(e_2) = (1, 3)$, the image has area $6$ and the turn is counterclockwise, so $\\det T = 6$.\n\n> **Watch out.** The columns are the images of $e_1$ and $e_2$, and the determinant subtracts the cross products: $a_{11}a_{22} - a_{12}a_{21}$. A clockwise turn makes it negative even though the area is positive.",
    "二阶行列式的大小是单位正方形的像的面积。它的符号表示定向：从第一个基向量的像到第二个基向量的像的转向是逆时针时为正，是顺时针时为负。若 $T(e_1) = (2, 0)$，$T(e_2) = (1, 3)$，像的面积是 $6$，转向是逆时针，所以 $\\det T = 6$。\n\n> **注意。** 两列分别是 $e_1$ 和 $e_2$ 的像，行列式是交叉乘积之差：$a_{11}a_{22} - a_{12}a_{21}$。顺时针转向使它为负，尽管面积是正的。",
  ],
  (rng) => {
    const [u, v] = independentPair(rng, 3);
    const det = cross(u, v);
    const sum = u[0] * v[1] + u[1] * v[0];
    return {
      ...numberProblem({
        prompt: t(
          "A linear map $T$ sends the dashed unit square to the shaded region. What is the determinant of $T$?",
          "线性映射 $T$ 把虚线单位正方形映成阴影区域。$T$ 的行列式是多少？",
        ),
        answer: det,
        mistakes: [
          why(
            -det,
            `The sign is wrong: the turn from $T(e_1)$ to $T(e_2)$ is ${det > 0 ? "counterclockwise" : "clockwise"}.`,
            `符号错了：从 $T(e_1)$ 到 $T(e_2)$ 的转向是${det > 0 ? "逆时针" : "顺时针"}。`,
          ),
          why(sum, "The two cross products are added; the determinant subtracts them.", "这把两个交叉乘积相加了；行列式是相减。"),
          why(
            u[0] + v[1],
            "That adds the diagonal entries, which gives the trace, not the determinant.",
            "这是对角元之和，即迹，而不是行列式。",
          ),
          why(
            dot(u, v),
            "That is the dot product of the columns; the determinant measures the area they span.",
            "这是两列的点积；行列式度量的是它们张成的面积。",
          ),
        ].filter((w, i, all) => w.value !== det && all.findIndex((o) => o.value === w.value) === i),
        solution: walked(
          [
            [
              ["Read the columns", "读出两列"],
              t(
                `$T(e_1) = (${u[0]}, ${u[1]})$ and $T(e_2) = (${v[0]}, ${v[1]})$.`,
                `$T(e_1) = (${u[0]}, ${u[1]})$，$T(e_2) = (${v[0]}, ${v[1]})$。`,
              ),
            ],
            [["Compute the determinant", "计算行列式"], t("", ""), [`(${u[0]})(${v[1]}) - (${v[0]})(${u[1]}) = ${det}`]],
          ],
          t(
            `The turn from $T(e_1)$ to $T(e_2)$ is ${det > 0 ? "counterclockwise, which matches the positive sign" : "clockwise, which matches the negative sign"}, and the shaded area is $${Math.abs(det)}$.`,
            `从 $T(e_1)$ 到 $T(e_2)$ 的转向是${det > 0 ? "逆时针，与正号一致" : "顺时针，与负号一致"}，阴影面积为 $${Math.abs(det)}$。`,
          ),
        ),
      }),
      figure: fig(6, [parallelogram(u, v), ...imageOfSquare(u, v)], altOfImage(u, v)),
    };
  },
);

const rankFromImage = {
  ...point(
    "the-rank-from-the-image-of-the-basis",
    ["The rank from the image of the basis", "由基的像读秩"],
    [
      "The image of a linear map is spanned by the images of the basis vectors, and the rank is the dimension of that span. Two arrows that are not parallel span the whole plane, so the rank is two. Two parallel arrows span only a line through the origin, so the rank is one, however long the arrows are. For example, arrows to $(2, 1)$ and $(-4, -2)$ lie on one line, since $2 \\cdot (-2) - 1 \\cdot (-4) = 0$, so the rank is $1$.\n\n> **Watch out.** Arrows pointing in opposite directions are still parallel. The rank counts independent directions, not arrows, so two arrows can give rank $1$.",
      "线性映射的像由基向量的像张成，秩是这个张成空间的维数。两个不平行的箭头张成整个平面，所以秩是二。两个平行的箭头只张成过原点的一条直线，所以不论箭头多长，秩都是一。例如指向 $(2, 1)$ 和 $(-4, -2)$ 的箭头在同一条直线上，因为 $2 \\cdot (-2) - 1 \\cdot (-4) = 0$，所以秩是 $1$。\n\n> **注意。** 方向相反的箭头仍然平行。秩数的是独立的方向，而不是箭头的个数，所以两个箭头也可能只给出秩 $1$。",
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
      const det = cross(u, v);
      const n = (x: number) => (x < 0 ? `(${x})` : `${x}`);
      return {
        ...numberProblem({
          prompt: t(
            "The arrows show the images under a linear map $T$ of the two standard basis vectors. What is the rank of $T$?",
            "箭头表示线性映射 $T$ 下两个标准基向量的像。$T$ 的秩是多少？",
          ),
          answer,
          mistakes: [
            full
              ? why(1, "The arrows are not parallel, so they span more than one line.", "两个箭头不平行，所以张成的不止一条直线。")
              : why(
                  2,
                  "The arrows lie on one line through the origin, so they give only one direction.",
                  "两个箭头在过原点的同一条直线上，只给出一个方向。",
                ),
            why(0, "The arrows are not zero, so the image contains more than the origin.", "箭头不是零向量，所以像不只含原点。"),
            why(3, "The image lies in the plane, so its dimension is at most $2$.", "像在平面内，所以维数至多是 $2$。"),
          ],
          solution: walked(
            [
              [
                ["Read the arrows", "读出箭头"],
                t(
                  `$T(e_1) = (${u[0]}, ${u[1]})$ and $T(e_2) = (${v[0]}, ${v[1]})$.`,
                  `$T(e_1) = (${u[0]}, ${u[1]})$，$T(e_2) = (${v[0]}, ${v[1]})$。`,
                ),
              ],
              [
                ["Test whether they are parallel", "检验是否平行"],
                t(
                  full
                    ? `$${n(u[0])} \\cdot ${n(v[1])} - ${n(u[1])} \\cdot ${n(v[0])} = ${det} \\ne 0$, so the arrows are not parallel and span the whole plane: the rank is $2$.`
                    : `$${n(u[0])} \\cdot ${n(v[1])} - ${n(u[1])} \\cdot ${n(v[0])} = 0$, so the arrows lie on one line through the origin and span only that line: the rank is $1$.`,
                  full
                    ? `$${n(u[0])} \\cdot ${n(v[1])} - ${n(u[1])} \\cdot ${n(v[0])} = ${det} \\ne 0$，所以两个箭头不平行，张成整个平面：秩是 $2$。`
                    : `$${n(u[0])} \\cdot ${n(v[1])} - ${n(u[1])} \\cdot ${n(v[0])} = 0$，所以两个箭头在过原点的同一条直线上，只张成这条直线：秩是 $1$。`,
                ),
              ],
            ],
            t(
              full
                ? `Rank $2$ means the image is the whole plane, which matches the parallelogram on the two arrows having nonzero area $${Math.abs(det)}$.`
                : "Rank $1$ means the unit square is flattened onto a line, so the image has zero area, which matches the zero determinant.",
              full
                ? `秩为 $2$ 表示像是整个平面，与两个箭头张成的平行四边形面积 $${Math.abs(det)}$ 不为零一致。`
                : "秩为 $1$ 表示单位正方形被压到一条直线上，像的面积为零，与行列式为零一致。",
            ),
          ),
        }),
        figure: fig(6, imageOfSquare(u, v), altOfImage(u, v)),
      };
    },
  ),
  figure: linearAlgebraDrawings1["image-and-rank-of-a-linear-transformation#the-rank-from-the-image-of-the-basis"],
};

const kernelFromImage = point(
  "the-kernel-from-collapsed-arrows",
  ["The kernel from collapsed arrows", "由共线的箭头读核"],
  [
    "When the images of the basis vectors lie on one line, some combination of the basis vectors is sent to zero, and that combination spans the kernel. If the images are $p$ and $q$ times the same vector, then $q$ times the first basis vector minus $p$ times the second goes to zero. For example, if $T(e_1) = (1, 2)$ and $T(e_2) = (3, 6)$, the images are $1$ and $3$ times $(1, 2)$, so $T(3, -1) = 3(1, 2) - (3, 6) = (0, 0)$ and $(3, -1)$ spans the kernel.\n\n> **Watch out.** The kernel lives among the inputs, not the outputs: the common direction of the arrows spans the image, not the kernel. Always test a candidate by applying $T$ to it.",
    "当基向量的像在同一条直线上时，基向量的某个组合被映到零，这个组合张成核。如果两个像分别是同一向量的 $p$ 倍和 $q$ 倍，那么 $q$ 倍第一个基向量减 $p$ 倍第二个基向量就映到零。例如 $T(e_1) = (1, 2)$，$T(e_2) = (3, 6)$ 时，两个像分别是 $(1, 2)$ 的 $1$ 倍和 $3$ 倍，所以 $T(3, -1) = 3(1, 2) - (3, 6) = (0, 0)$，$(3, -1)$ 张成核。\n\n> **注意。** 核在输入之中，而不在输出之中：箭头的公共方向张成的是像，不是核。总要把候选向量代入 $T$ 检验。",
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
    const image = (c: Point): Point => [c[0] * u[0] + c[1] * v[0], c[0] * u[1] + c[1] * v[1]];
    const candidates: [Point, string, string][] = [
      [
        [p, q],
        "This uses the multiples in the same order; the weights must cross over and one must change sign.",
        "这按原顺序用了倍数；权重要交叉，并且其中一个要变号。",
      ],
      [
        [q, p],
        "The weights cross over, but one of them must change sign so that the images cancel.",
        "权重交叉了，但其中一个必须变号，像才能抵消。",
      ],
      [
        [p, -q],
        "The sign change is right, but the weights must cross over: $q$ goes with $e_1$.",
        "变号是对的，但权重要交叉：$q$ 对应 $e_1$。",
      ],
      [
        w,
        "This is the common direction of the arrows, which spans the image, not the kernel.",
        "这是箭头的公共方向，它张成的是像，不是核。",
      ],
    ];
    const wrong = candidates.filter(([c]) => cross(c, answer) !== 0);
    const out = image(answer);
    const choice = choose(
      rng,
      [
        "The arrows show the images under a linear map $T$ of the two standard basis vectors. Which vector spans the kernel of $T$?",
        "箭头表示线性映射 $T$ 下两个标准基向量的像。哪个向量张成 $T$ 的核？",
      ],
      same(col(answer[0], answer[1])),
      wrong.map(([c]) => same(col(c[0], c[1]))),
      [
        `**Step 1: Read the arrows.** The drawing shows $T(e_1) = (${u[0]}, ${u[1]})$ and $T(e_2) = (${v[0]}, ${v[1]})$, which are $${p}$ and $${q}$ times $(${w[0]}, ${w[1]})$.\n\n**Step 2: Combine them to zero.** $(${q})T(e_1) - (${p})T(e_2) = 0$, so the kernel is spanned by $(${answer[0]}, ${answer[1]})$.\n\n**Check.** $T(${answer[0]}, ${answer[1]}) = (${q})(${u[0]}, ${u[1]}) + (${-p})(${v[0]}, ${v[1]}) = (${out[0]}, ${out[1]})$.`,
        `**第一步：读出箭头。** 由图得 $T(e_1) = (${u[0]}, ${u[1]})$，$T(e_2) = (${v[0]}, ${v[1]})$，它们分别是 $(${w[0]}, ${w[1]})$ 的 $${p}$ 倍和 $${q}$ 倍。\n\n**第二步：组合成零。** $(${q})T(e_1) - (${p})T(e_2) = 0$，所以核由 $(${answer[0]}, ${answer[1]})$ 张成。\n\n**检验。** $T(${answer[0]}, ${answer[1]}) = (${q})(${u[0]}, ${u[1]}) + (${-p})(${v[0]}, ${v[1]}) = (${out[0]}, ${out[1]})$。`,
      ],
      fig(7, imageOfSquare(u, v), altOfImage(u, v)),
    );
    return reasoned(
      choice,
      wrong.map(([c, en, zh]): [string, string, string] => {
        const o = image(c);
        return [
          same(col(c[0], c[1]))[0],
          `${en} Here $T(${c[0]}, ${c[1]}) = (${o[0]}, ${o[1]})$, not zero.`,
          `${zh}这里 $T(${c[0]}, ${c[1]}) = (${o[0]}, ${o[1]})$，不是零。`,
        ];
      }),
    );
  },
);

const eigenvalueFromPair = point(
  "the-eigenvalue-from-a-vector-and-its-image",
  ["The eigenvalue from a vector and its image", "由向量及其像读特征值"],
  [
    "A vector is an eigenvector when its image lies on the same line through the origin. The eigenvalue is the factor between the two arrows: its size is the ratio of their lengths, and it is negative when the image points the opposite way. A shrinking arrow means an eigenvalue smaller than one in size. For example, if $v = (2, -2)$ and $Av = (-1, 1)$, each coordinate of $Av$ is $-\\tfrac{1}{2}$ times that of $v$, so the eigenvalue is $-\\tfrac{1}{2}$.\n\n> **Watch out.** Divide the image by the vector, not the vector by the image, and keep the sign: an image pointing the opposite way gives a negative eigenvalue.",
    "当向量的像在过原点的同一条直线上时，它就是特征向量。特征值是两个箭头之间的倍数：大小是长度之比，当像指向相反方向时为负。箭头缩短说明特征值的绝对值小于一。例如 $v = (2, -2)$，$Av = (-1, 1)$ 时，$Av$ 的每个坐标都是 $v$ 的 $-\\tfrac{1}{2}$ 倍，所以特征值是 $-\\tfrac{1}{2}$。\n\n> **注意。** 用像除以向量，而不是用向量除以像，并保留符号：像指向相反方向时特征值为负。",
  ],
  (rng) => {
    const w = rng.pick(primitive.filter((p) => Math.abs(p[0]) <= 2 && Math.abs(p[1]) <= 2));
    const sign = rng.sign();
    const half = rng.bool(0.3);
    const k = half ? Q.of(sign, 2) : Q.of(sign > 0 ? rng.int(2, 3) : -rng.int(1, 3));
    const size = half ? 2 : 1;
    const v: Point = [size * w[0], size * w[1]];
    const image: Point = [k.toNumber() * v[0], k.toNumber() * v[1]];
    const i = v[0] !== 0 ? 0 : 1;
    const lam = k.toLatex();
    return {
      ...numberProblem({
        prompt: t(
          "The arrows show a vector $v$ and its image $Av$. What eigenvalue does $v$ have?",
          "箭头表示向量 $v$ 及其像 $Av$。$v$ 的特征值是多少？",
        ),
        answer: k,
        mistakes: (
          [
            [
              k.neg(),
              "The sign is wrong: compare whether $Av$ points the same way as $v$ or the opposite way.",
              "符号错了：要看 $Av$ 与 $v$ 方向相同还是相反。",
            ],
            [
              Q.one.div(k),
              "That divides $v$ by $Av$; the eigenvalue is $Av$ divided by $v$.",
              "这是用 $v$ 除以 $Av$；特征值是 $Av$ 除以 $v$。",
            ],
            [
              k.abs().add(Q.one),
              "The eigenvalue is the factor between the arrows, not one more than its size.",
              "特征值是两个箭头之间的倍数，而不是其大小加一。",
            ],
          ] as const
        )
          .filter(([w], j, all) => !w.eq(k) && all.findIndex(([o]) => o.eq(w)) === j)
          .map(([w, en, zh]) => why(w, en, zh)),
        solution: walked(
          [
            [
              ["Read the arrows", "读出箭头"],
              t(
                `$v = (${v[0]}, ${v[1]})$ and $Av = (${image[0]}, ${image[1]})$, which lie on one line through the origin.`,
                `$v = (${v[0]}, ${v[1]})$，$Av = (${image[0]}, ${image[1]})$，它们在过原点的同一条直线上。`,
              ),
            ],
            [
              ["Divide matching coordinates", "对应坐标相除"],
              t(`$\\lambda = \\dfrac{${image[i]}}{${v[i]}} = ${lam}$.`, `$\\lambda = \\dfrac{${image[i]}}{${v[i]}} = ${lam}$。`),
            ],
          ],
          t(
            `$${lam} \\cdot (${v[0]}, ${v[1]}) = (${image[0]}, ${image[1]})$, and $Av$ points ${k.sign() > 0 ? "the same way as" : "opposite to"} $v$, which matches the sign.`,
            `$${lam} \\cdot (${v[0]}, ${v[1]}) = (${image[0]}, ${image[1]})$，且 $Av$ 与 $v$ 方向${k.sign() > 0 ? "相同" : "相反"}，与符号一致。`,
          ),
        ),
      }),
      figure: fig(
        6,
        [...vector(image, "Av"), { kind: "arrow", from: [0, 0], to: v }, { kind: "label", at: v, text: "v", dir: rng.bool() ? "n" : "s" }],
        [
          `An arrow v to (${v[0]}, ${v[1]}) and an arrow Av to (${image[0]}, ${image[1]}).`,
          `指向 (${v[0]}, ${v[1]}) 的箭头 v 和指向 (${image[0]}, ${image[1]}) 的箭头 Av。`,
        ],
      ),
    };
  },
);

const splitAlongEigen = point(
  "applying-a-matrix-through-eigen-directions",
  ["Applying a matrix through eigen directions", "沿特征方向作用矩阵"],
  [
    "If a point is a combination of two eigenvectors, the matrix acts on each part separately by scaling it with its own eigenvalue. So write the point as a combination of the two arrows by reading the drawing, scale each part, and add. For example, with $u = (1, 1)$, $w = (1, -1)$, $Au = 2u$, $Aw = 3w$ and $P = (3, 1) = 2u + w$, we get $AP = 4u + 3w = (7, 1)$.\n\n> **Watch out.** Scaling the coordinates of the point directly works only when the eigenvectors are the axes. Each eigenvalue scales only its own part, so keep each with its own arrow.",
    "如果一个点是两个特征向量的组合，矩阵就分别作用于每一部分，按各自的特征值缩放。所以先从图中把点写成两个箭头的组合，再缩放各部分并相加。例如 $u = (1, 1)$，$w = (1, -1)$，$Au = 2u$，$Aw = 3w$，$P = (3, 1) = 2u + w$ 时，$AP = 4u + 3w = (7, 1)$。\n\n> **注意。** 直接缩放点的坐标，只有在特征向量就是坐标轴时才成立。每个特征值只缩放它自己的那一部分，要与各自的箭头对应。",
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
    const parts: [Point, string, string][] = [
      [
        image(l2, l1),
        "The eigenvalues are swapped: $u$ is scaled by its own eigenvalue, and $w$ by its own.",
        "特征值对调了：$u$ 按自己的特征值缩放，$w$ 也按自己的。",
      ],
      [
        [l1 * P[0], l2 * P[1]],
        "This scales the coordinates of $P$, which works only when the eigenvectors are the axes.",
        "这缩放的是 $P$ 的坐标，只有特征向量就是坐标轴时才成立。",
      ],
      [
        [l1 * P[0], l1 * P[1]],
        `This scales all of $P$ by $${l1}$, but the part along $w$ is scaled by $${l2}$.`,
        `这把整个 $P$ 都乘以 $${l1}$，但沿 $w$ 的部分应乘以 $${l2}$。`,
      ],
      [
        [l2 * P[0], l2 * P[1]],
        `This scales all of $P$ by $${l2}$, but the part along $u$ is scaled by $${l1}$.`,
        `这把整个 $P$ 都乘以 $${l2}$，但沿 $u$ 的部分应乘以 $${l1}$。`,
      ],
    ];
    const pt = (q: Point) => `(${q[0]}, ${q[1]})`;
    const choice = choose(
      rng,
      [
        `The arrows are eigenvectors of $A$: $Au = ${times(l1)}u$ and $Aw = ${times(l2)}w$. What is $AP$ for the point $P$ drawn?`,
        `箭头是 $A$ 的特征向量：$Au = ${times(l1)}u$，$Aw = ${times(l2)}w$。对图中的点 $P$，$AP$ 是什么？`,
      ],
      same(col(answer[0], answer[1])),
      parts.map(([c]) => same(col(c[0], c[1]))),
      [
        `**Step 1: Split the point along the arrows.** Reading the drawing gives $u = ${pt(u)}$, $w = ${pt(w)}$ and $P = ${pt(P)} = (${a})u + (${b})w$.\n\n**Step 2: Scale each part.** $AP = (${a})(${l1})u + (${b})(${l2})w = (${a * l1})${pt(u)} + (${b * l2})${pt(w)} = (${answer[0]}, ${answer[1]})$.\n\n**Check.** $(${a})${pt(u)} + (${b})${pt(w)} = ${pt(P)}$, so the split is right.`,
        `**第一步：沿箭头分解点。** 由图得 $u = ${pt(u)}$，$w = ${pt(w)}$，$P = ${pt(P)} = (${a})u + (${b})w$。\n\n**第二步：缩放各部分。** $AP = (${a})(${l1})u + (${b})(${l2})w = (${a * l1})${pt(u)} + (${b * l2})${pt(w)} = (${answer[0]}, ${answer[1]})$。\n\n**检验。** $(${a})${pt(u)} + (${b})${pt(w)} = ${pt(P)}$，所以分解正确。`,
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
    return reasoned(
      choice,
      parts.map(([c, en, zh]): [string, string, string] => [same(col(c[0], c[1]))[0], en, zh]),
    );
  },
);

const eigenFromShear = point(
  "the-eigen-direction-of-a-drawn-shear",
  ["The eigen direction of a drawn shear", "图中剪切的特征方向"],
  [
    "An eigenvector of a map is a vector whose image stays on its own line through the origin. In a drawing of a shear combined with uniform scaling, one edge of the square stays on its line while the other tips over. That edge gives the only eigen direction, and every other direction turns. For example, if $T(e_1) = (2, 0)$ and $T(e_2) = (1, 2)$, then $e_1$ stays on the $x$-axis with factor $2$, while $T(1, 1) = (3, 2)$ is not a multiple of $(1, 1)$.\n\n> **Watch out.** A diagonal direction such as $(1, 1)$ is not automatically an eigenvector. Test each candidate by computing its image and checking that it is a multiple of the candidate.",
    "映射的特征向量是像仍在自身所在的过原点直线上的向量。在剪切与均匀缩放结合的图中，正方形的一条边留在自己的直线上，另一条边倾斜。这条边给出唯一的特征方向，其他方向都会转动。例如 $T(e_1) = (2, 0)$，$T(e_2) = (1, 2)$ 时，$e_1$ 留在 $x$ 轴上，倍数为 $2$；而 $T(1, 1) = (3, 2)$ 不是 $(1, 1)$ 的倍数。\n\n> **注意。** 像 $(1, 1)$ 这样的对角方向不一定是特征向量。对每个候选向量都要算出它的像，检验像是否是它的倍数。",
  ],
  (rng) => {
    const s = rng.int(1, 3);
    const k = rng.nonZero(-3, 3);
    const upper = rng.bool();
    const u: Point = upper ? [s, 0] : [s, k];
    const v: Point = upper ? [k, s] : [0, s];
    const answer = upper ? col(1, 0) : col(0, 1);
    const apply = (x: number, y: number): Point => [x * u[0] + y * v[0], x * u[1] + y * v[1]];
    const kept = upper ? u : v;
    const candidates: Point[] = [upper ? [0, 1] : [1, 0], [1, 1], [1, -1]];
    const choice = choose(
      rng,
      [
        "The arrows show the images under $T$ of the standard basis vectors. Which vector is an eigenvector of $T$?",
        "箭头表示 $T$ 下标准基向量的像。哪个向量是 $T$ 的特征向量？",
      ],
      same(answer),
      candidates.map(([x, y]) => same(col(x, y))),
      [
        `**Step 1: Read the arrows.** $T(e_1) = (${u[0]}, ${u[1]})$ and $T(e_2) = (${v[0]}, ${v[1]})$.\n\n**Step 2: Find the arrow that stays on its axis.** $T(e_{${upper ? 1 : 2}}) = (${kept[0]}, ${kept[1]}) = ${s === 1 ? "" : s}e_{${upper ? 1 : 2}}$, so that basis vector is an eigenvector with eigenvalue $${s}$. The other basis vector tips off its axis, and the eigenvalue $${s}$ is repeated with this one direction only.\n\n**Check.** The matrix is $A = ${mat(u[0], v[0], u[1], v[1])}$, whose characteristic polynomial is $(\\lambda - ${s})^2$, so $${s}$ is the only eigenvalue, and $A - ${s}I = ${mat(u[0] - s, v[0], u[1], v[1] - s)}$ has rank $1$, leaving one eigen direction.`,
        `**第一步：读出箭头。** $T(e_1) = (${u[0]}, ${u[1]})$，$T(e_2) = (${v[0]}, ${v[1]})$。\n\n**第二步：找出留在坐标轴上的箭头。** $T(e_{${upper ? 1 : 2}}) = (${kept[0]}, ${kept[1]}) = ${s === 1 ? "" : s}e_{${upper ? 1 : 2}}$，所以这个基向量是特征向量，特征值为 $${s}$。另一个基向量偏离了自己的坐标轴，重特征值 $${s}$ 只有这一个方向。\n\n**检验。** 矩阵为 $A = ${mat(u[0], v[0], u[1], v[1])}$，特征多项式是 $(\\lambda - ${s})^2$，所以 $${s}$ 是唯一的特征值，而 $A - ${s}I = ${mat(u[0] - s, v[0], u[1], v[1] - s)}$ 的秩为 $1$，只留下一个特征方向。`,
      ],
      fig(5, imageOfSquare(u, v), altOfImage(u, v)),
    );
    return reasoned(
      choice,
      candidates.map(([x, y]): [string, string, string] => {
        const o = apply(x, y);
        return [
          same(col(x, y))[0],
          `$T(${x}, ${y}) = (${o[0]}, ${o[1]})$, which is not a multiple of $(${x}, ${y})$, so this direction turns.`,
          `$T(${x}, ${y}) = (${o[0]}, ${o[1]})$，不是 $(${x}, ${y})$ 的倍数，所以这个方向会转动。`,
        ];
      }),
    );
  },
);

const coordsInBasis = {
  ...point(
    "reading-a-combination-of-two-arrows",
    ["Reading a combination of two arrows", "读两个箭头的组合"],
    [
      "Two arrows that are not parallel span the plane, so every point is exactly one combination of them. To read the coefficients, solve the two coordinate equations given by the drawing. The coefficients are not the coordinates of the point, unless the two arrows happen to be the standard basis vectors. For example, with $u = (1, 1)$, $w = (1, -1)$ and $P = (3, 1)$, the equations $s + t = 3$ and $s - t = 1$ give $s = 2$ and $t = 1$.\n\n> **Watch out.** Read the arrows and the point from the grid first; the answer is a weight, not a coordinate of $P$.",
      "两个不平行的箭头张成平面，所以每个点都恰好是它们的一个组合。要读出系数，就解图给出的两个坐标方程。除非两个箭头恰好是标准基向量，否则系数不是点的坐标。例如 $u = (1, 1)$，$w = (1, -1)$，$P = (3, 1)$ 时，方程 $s + t = 3$ 与 $s - t = 1$ 给出 $s = 2$，$t = 1$。\n\n> **注意。** 先从网格读出箭头和点；答案是权重，而不是 $P$ 的坐标。",
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
      const answer = asksFirst ? s : c;
      const p = (n: number) => (n < 0 ? `(${n})` : `${n}`);
      const D = cross(u, w);
      return {
        ...numberProblem({
          prompt: asksFirst
            ? t(
                "Write the point $P$ as $P = su + tw$ using the arrows drawn. What is $s$?",
                "用图中的箭头把点 $P$ 写成 $P = su + tw$。$s$ 是多少？",
              )
            : t(
                "Write the point $P$ as $P = su + tw$ using the arrows drawn. What is $t$?",
                "用图中的箭头把点 $P$ 写成 $P = su + tw$。$t$ 是多少？",
              ),
          answer,
          mistakes: [
            why(
              asksFirst ? c : s,
              `That is the other weight; the question asks for $${asksFirst ? "s" : "t"}$, the weight on $${asksFirst ? "u" : "w"}$.`,
              `这是另一个权重；题目求的是 $${asksFirst ? "u" : "w"}$ 的权重 $${asksFirst ? "s" : "t"}$。`,
            ),
            why(-answer, "The sign is flipped; recheck the direction of each arrow.", "符号反了；请重新检查每个箭头的方向。"),
            why(
              P[0],
              "That is the $x$-coordinate of $P$; the weight comes from solving the two equations.",
              "这是 $P$ 的 $x$ 坐标；权重要解两个方程才能得到。",
            ),
            why(
              P[1],
              "That is the $y$-coordinate of $P$; the weight comes from solving the two equations.",
              "这是 $P$ 的 $y$ 坐标；权重要解两个方程才能得到。",
            ),
          ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
          solution: walked(
            [
              [
                ["Read the drawing", "读图"],
                t(
                  `$u = (${u[0]}, ${u[1]})$, $w = (${w[0]}, ${w[1]})$ and $P = (${P[0]}, ${P[1]})$, so:`,
                  `$u = (${u[0]}, ${u[1]})$，$w = (${w[0]}, ${w[1]})$，$P = (${P[0]}, ${P[1]})$，所以：`,
                ),
                [`${p(u[0])}s + ${p(w[0])}t = ${P[0]}`, `${p(u[1])}s + ${p(w[1])}t = ${P[1]}`],
              ],
              [
                ["Solve", "求解"],
                t(
                  `The determinant is $${p(u[0])} \\cdot ${p(w[1])} - ${p(w[0])} \\cdot ${p(u[1])} = ${D}$, and Cramer's rule gives:`,
                  `行列式为 $${p(u[0])} \\cdot ${p(w[1])} - ${p(w[0])} \\cdot ${p(u[1])} = ${D}$，由克拉默法则得：`,
                ),
                [
                  `s = \\frac{${p(P[0])} \\cdot ${p(w[1])} - ${p(w[0])} \\cdot ${p(P[1])}}{${D}} = ${s}`,
                  `t = \\frac{${p(u[0])} \\cdot ${p(P[1])} - ${p(P[0])} \\cdot ${p(u[1])}}{${D}} = ${c}`,
                ],
              ],
            ],
            t(
              `$${s}(${u[0]}, ${u[1]}) + ${p(c)}(${w[0]}, ${w[1]}) = (${P[0]}, ${P[1]})$, which is $P$.`,
              `$${s}(${u[0]}, ${u[1]}) + ${p(c)}(${w[0]}, ${w[1]}) = (${P[0]}, ${P[1]})$，正是 $P$。`,
            ),
          ),
        }),
        figure: fig(
          8,
          [...vector(u, "u"), ...vector(w, "w"), { kind: "point", at: P, label: "P", dir: "n" }],
          [
            `Arrows u to (${u[0]}, ${u[1]}) and w to (${w[0]}, ${w[1]}), and the point P at (${P[0]}, ${P[1]}).`,
            `指向 (${u[0]}, ${u[1]}) 的箭头 u，指向 (${w[0]}, ${w[1]}) 的箭头 w，以及位于 (${P[0]}, ${P[1]}) 的点 P。`,
          ],
        ),
      };
    },
  ),
  figure: linearAlgebraDrawings1["linear-span-of-vectors-in-n-dimensional-euclidean-space#reading-a-combination-of-two-arrows"],
};

const nullSpaceLine = {
  ...point(
    "the-matrix-from-a-drawn-null-space",
    ["The matrix from a drawn null space", "由图中零空间读矩阵"],
    [
      "A vector lies in the null space when every row of the matrix is perpendicular to it. So a matrix whose null space is a given line through the origin must have rows perpendicular to that line. Rows that point along the line are a common mistake: they give the perpendicular line as the null space instead. For example, if the line passes through $(1, 2)$, the row $(2, -1)$ works because $2 \\cdot 1 + (-1) \\cdot 2 = 0$, so $\\begin{pmatrix} 2 & -1 \\\\ 4 & -2 \\end{pmatrix}$ has that line as its null space.\n\n> **Watch out.** Test each row against a point of the line: the dot product must be $0$. A row along the line has a nonzero dot product with it.",
      "向量在零空间中，当且仅当矩阵的每一行都与它垂直。所以零空间是过原点某条直线的矩阵，它的行必须垂直于这条直线。行沿直线方向是常见错误：那样得到的零空间是垂直的那条直线。例如直线过 $(1, 2)$ 时，行 $(2, -1)$ 满足要求，因为 $2 \\cdot 1 + (-1) \\cdot 2 = 0$，所以 $\\begin{pmatrix} 2 & -1 \\\\ 4 & -2 \\end{pmatrix}$ 的零空间就是这条直线。\n\n> **注意。** 用直线上的一点检验每一行：点积必须为 $0$。沿直线方向的行与它的点积不为零。",
    ],
    (rng) => {
      const [p, q] = rng.pick(primitive);
      const m = rng.int(1, 3);
      const row = (a: number, b: number) => mat(a, b, m * a, m * b);
      const n = (x: number) => (x < 0 ? `(${x})` : `${x}`);
      const candidates = (
        [
          [p, q],
          [q, p],
          [p, -q],
        ] as Point[]
      ).filter((c) => dot(c, [p, q]) !== 0);
      const others: Point[] = [
        [q + p, q - p],
        [p + 2 * q, q - 2 * p],
      ];
      const right = row(q, -p);
      const choice = choose(
        rng,
        ["The line drawn is the null space of a matrix. Which matrix is it?", "图中的直线是某个矩阵的零空间。是哪个矩阵？"],
        same(right),
        [...candidates, ...others].map((c) => same(row(c[0], c[1]))),
        [
          `**Step 1: Read the line.** The line passes through the origin and $(${p}, ${q})$, so the null space is spanned by $(${p}, ${q})$.\n\n**Step 2: Find a perpendicular row.** The row $(${q}, ${n(-p)})$ has $${n(q)} \\cdot ${n(p)} + ${n(-p)} \\cdot ${n(q)} = 0$, and the second row is $${m}$ times it, so the matrix is $${right}$.\n\n**Check.** Both rows are multiples of one nonzero row, so the null space is a line, and $(${p}, ${q})$ lies on it.`,
          `**第一步：读出直线。** 直线过原点和 $(${p}, ${q})$，所以零空间由 $(${p}, ${q})$ 张成。\n\n**第二步：找垂直的行。** 行 $(${q}, ${n(-p)})$ 满足 $${n(q)} \\cdot ${n(p)} + ${n(-p)} \\cdot ${n(q)} = 0$，第二行是它的 $${m}$ 倍，所以矩阵是 $${right}$。\n\n**检验。** 两行都是同一非零行的倍数，所以零空间是一条直线，且 $(${p}, ${q})$ 在其上。`,
        ],
        fig(
          5,
          [{ kind: "line", a: [0, 0], b: [p, q], accent: true }],
          [`A line through the origin and (${p}, ${q}).`, `过原点和 (${p}, ${q}) 的直线。`],
        ),
      );
      const reason = (c: Point): [string, string, string] => {
        const d = c[0] * p + c[1] * q;
        const along = c[0] === p && c[1] === q;
        return [
          same(row(c[0], c[1]))[0],
          along
            ? `The rows point along the line: $(${p}, ${q})$ times the first row gives $${d}$, not $0$, so the null space is the perpendicular line instead.`
            : `The first row times $(${p}, ${q})$ is $${n(c[0])} \\cdot ${n(p)} + ${n(c[1])} \\cdot ${n(q)} = ${d}$, not $0$, so the drawn line is not the null space.`,
          along
            ? `行沿直线方向：$(${p}, ${q})$ 与第一行的点积是 $${d}$，不是 $0$，所以零空间是垂直的那条直线。`
            : `第一行与 $(${p}, ${q})$ 的点积是 $${n(c[0])} \\cdot ${n(p)} + ${n(c[1])} \\cdot ${n(q)} = ${d}$，不是 $0$，所以图中的直线不是零空间。`,
        ];
      };
      return reasoned(choice, [...candidates, ...others].map(reason));
    },
  ),
  figure: linearAlgebraDrawings1["the-null-space-of-a-matrix#the-matrix-from-a-drawn-null-space"],
};

const projectionFromDrawing = {
  ...point(
    "the-projection-onto-a-drawn-line",
    ["The projection onto a drawn line", "向图中直线投影"],
    [
      "The projection of a vector onto a line through the origin is the point of the line closest to its tip. With a direction $u$ read from the line, it equals $\\frac{v \\cdot u}{u \\cdot u}u$. The difference between the vector and its projection is perpendicular to the line, which gives a way to check the result. For example, $v = (3, 1)$ and the line through $(1, 1)$ give $\\frac{4}{2}(1, 1) = (2, 2)$, and $(3, 1) - (2, 2) = (1, -1)$ is perpendicular to $(1, 1)$.\n\n> **Watch out.** A direction read from a drawing is rarely a unit vector, so divide $v \\cdot u$ by $u \\cdot u$ before scaling $u$.",
      "向量在过原点直线上的投影是直线上离其终点最近的点。从直线上读出方向 $u$ 后，投影等于 $\\frac{v \\cdot u}{u \\cdot u}u$。向量与投影之差垂直于直线，可以用来检验结果。例如 $v = (3, 1)$，直线过 $(1, 1)$ 时投影是 $\\frac{4}{2}(1, 1) = (2, 2)$，而 $(3, 1) - (2, 2) = (1, -1)$ 与 $(1, 1)$ 垂直。\n\n> **注意。** 从图中读出的方向很少是单位向量，所以要先用 $v \\cdot u$ 除以 $u \\cdot u$，再去乘 $u$。",
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
      const au = a === 1 ? "" : a === -1 ? "-" : `${a}`;
      const wrong = [rest, u, v, [-proj[0], -proj[1]], [dot(v, u) * u[0], dot(v, u) * u[1]]] as Point[];
      const slips: [string, string][] = [
        ["That is the part of $v$ perpendicular to the line, $v$ minus its projection.", "这是 $v$ 垂直于直线的部分，即 $v$ 减去投影。"],
        [
          `That is the direction $u$ read from the line, not yet scaled by the factor $${a}$.`,
          `这是从直线上读出的方向 $u$，还没有乘以倍数 $${a}$。`,
        ],
        ["That is $v$ itself, but $v$ does not lie on the line.", "这是 $v$ 本身，但 $v$ 不在这条直线上。"],
        [
          `The sign of the factor is flipped; $v \\cdot u = ${dot(v, u)}$ gives the factor $${a}$.`,
          `倍数的符号反了；$v \\cdot u = ${dot(v, u)}$ 给出倍数 $${a}$。`,
        ],
        [
          `That scales $u$ by $v \\cdot u$ without dividing by $u \\cdot u = ${dot(u, u)}$.`,
          `这是用 $v \\cdot u$ 去乘 $u$，没有除以 $u \\cdot u = ${dot(u, u)}$。`,
        ],
      ];
      return reasoned(
        choose(
          rng,
          [
            "The arrow $v$ and a line through the origin are drawn. What is the projection of $v$ onto the line?",
            "图中画出了箭头 $v$ 和一条过原点的直线。$v$ 在这条直线上的投影是什么？",
          ],
          same(col(proj[0], proj[1])),
          wrong.map((c) => same(col(c[0], c[1]))),
          [
            `**Step 1: Read a direction.** Take $u = (${u[0]}, ${u[1]})$ on the line; the arrow is $v = (${v[0]}, ${v[1]})$.\n\n**Step 2: Find the factor.** $v \\cdot u = ${dot(v, u)}$ and $u \\cdot u = ${dot(u, u)}$, so the factor is $\\frac{${dot(v, u)}}{${dot(u, u)}} = ${a}$.\n\n**Step 3: Scale the direction.** The projection is $${au}u = (${proj[0]}, ${proj[1]})$.\n\n**Check.** $v$ minus the projection is $(${rest[0]}, ${rest[1]})$, and $(${rest[0]})(${u[0]}) + (${rest[1]})(${u[1]}) = 0$, so it is perpendicular to the line.`,
            `**第一步：读出方向。** 在直线上取 $u = (${u[0]}, ${u[1]})$；箭头是 $v = (${v[0]}, ${v[1]})$。\n\n**第二步：求倍数。** $v \\cdot u = ${dot(v, u)}$，$u \\cdot u = ${dot(u, u)}$，所以倍数是 $\\frac{${dot(v, u)}}{${dot(u, u)}} = ${a}$。\n\n**第三步：伸缩方向。** 投影是 $${au}u = (${proj[0]}, ${proj[1]})$。\n\n**检验。** $v$ 减去投影得 $(${rest[0]}, ${rest[1]})$，而 $(${rest[0]})(${u[0]}) + (${rest[1]})(${u[1]}) = 0$，所以它垂直于直线。`,
          ],
          fig(
            6,
            [{ kind: "line", a: [0, 0], b: u }, ...vector(v, "v")],
            [
              `A line through the origin and (${u[0]}, ${u[1]}), and an arrow v to (${v[0]}, ${v[1]}).`,
              `过原点和 (${u[0]}, ${u[1]}) 的直线，以及指向 (${v[0]}, ${v[1]}) 的箭头 v。`,
            ],
          ),
        ),
        wrong.map((c, i): [string, string, string] => [same(col(c[0], c[1]))[0], ...(slips[i] as [string, string])]),
      );
    },
  ),
  figure: linearAlgebraDrawings2["projecting-vectors-onto-one-dimensional-subspaces#the-projection-onto-a-drawn-line"],
};

const orthogonalPair = {
  ...point(
    "spotting-the-perpendicular-pair",
    ["Spotting the perpendicular pair", "找出垂直的一对"],
    [
      "Two vectors are orthogonal exactly when their dot product is zero. Reading coordinates from a drawing and testing the dot product is more reliable than judging angles by eye, particularly when the arrows have different lengths or do not lie along the grid lines of the drawing. For example, arrows to $(2, 1)$ and $(-1, 3)$ look almost perpendicular, but $(2)(-1) + (1)(3) = 1 \\ne 0$; the arrow to $(-1, 2)$ is the perpendicular one.\n\n> **Watch out.** Test each candidate pair with the dot product instead of trusting the eye. An angle that looks right may be a few degrees off.",
      "两个向量正交，当且仅当它们的点积为零。从图中读出坐标并计算点积，比用眼睛判断角度更可靠，尤其是箭头长度不同或不沿网格线的时候。例如指向 $(2, 1)$ 与 $(-1, 3)$ 的箭头看起来几乎垂直，但 $(2)(-1) + (1)(3) = 1 \\ne 0$；指向 $(-1, 2)$ 的箭头才与 $(2, 1)$ 垂直。\n\n> **注意。** 每一对候选都用点积检验，不要相信眼睛。看起来是直角的角可能差几度。",
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
      const wrongPairs: [number, number][] = [
        [0, 2],
        [1, 3],
        [2, 3],
        [0, 3],
        [1, 2],
      ];
      const reading = vs.map((v, i) => `${names[i]} = (${v[0]}, ${v[1]})`).join(", ");
      return reasoned(
        choose(
          rng,
          ["Which two of the arrows drawn are perpendicular?", "图中哪两个箭头互相垂直？"],
          pair(0, 1),
          wrongPairs.map(([i, j]) => pair(i, j)),
          [
            `**Step 1: Read the arrows.** $${reading}$.\n\n**Step 2: Find the zero dot product.** $(${x[0]}, ${x[1]})$ and $(${y[0]}, ${y[1]})$ give $(${x[0]})(${y[0]}) + (${x[1]})(${y[1]}) = 0$, so ${pair(0, 1)[0]} are perpendicular.\n\n**Check.** The other pairs give dot products ${wrongPairs.map(([i, j]) => `$${dot(vs[i] as Point, vs[j] as Point)}$`).join(", ")}, none of them zero.`,
            `**第一步：读出箭头。** $${reading}$。\n\n**第二步：找出点积为零的一对。** $(${x[0]}, ${x[1]})$ 与 $(${y[0]}, ${y[1]})$ 给出 $(${x[0]})(${y[0]}) + (${x[1]})(${y[1]}) = 0$，所以 ${pair(0, 1)[1]} 互相垂直。\n\n**检验。** 其他各对的点积为 ${wrongPairs.map(([i, j]) => `$${dot(vs[i] as Point, vs[j] as Point)}$`).join("，")}，都不为零。`,
          ],
          fig(
            4,
            vs.flatMap((v, i) => vector(v, names[i] as string)),
            [
              `Four arrows from the origin: ${vs.map((v, i) => `${names[i]} to (${v[0]}, ${v[1]})`).join(", ")}.`,
              `从原点出发的四个箭头：${vs.map((v, i) => `${names[i]} 指向 (${v[0]}, ${v[1]})`).join("，")}。`,
            ],
          ),
        ),
        wrongPairs.map(([i, j]): [string, string, string] => [
          pair(i, j)[0],
          `Their dot product is $${dot(vs[i] as Point, vs[j] as Point)}$, not $0$, so the angle only looks right.`,
          `它们的点积为 $${dot(vs[i] as Point, vs[j] as Point)}$，不为 $0$，夹角只是看起来像直角。`,
        ]),
      );
    },
  ),
  figure: linearAlgebraDrawings2["orthogonal-vectors-in-euclidean-spaces#spotting-the-perpendicular-pair"],
};

const orthogonalTransform = {
  ...point(
    "applying-a-drawn-orthogonal-map",
    ["Applying a drawn orthogonal map", "作用图中的正交映射"],
    [
      "An orthogonal map sends the standard basis to perpendicular unit vectors, and a drawing of these two arrows fixes the whole map. A point $(x, y)$ goes to $x$ times the first arrow plus $y$ times the second. Using the transpose instead applies the inverse map, which sends the point somewhere else unless the map is its own inverse. For example, if $T(e_1) = (0, 1)$ and $T(e_2) = (-1, 0)$, then $T(2, 3) = 2(0, 1) + 3(-1, 0) = (-3, 2)$.\n\n> **Watch out.** The drawn arrows are the columns of the matrix of $T$. Combine them with the coordinates of the point; reading them as rows applies the inverse map instead.",
      "正交映射把标准基映成互相垂直的单位向量，这两个箭头的图就确定了整个映射。点 $(x, y)$ 映到 $x$ 倍第一个箭头加 $y$ 倍第二个箭头。用转置矩阵则是作用逆映射，除非映射是自身的逆，否则点会被送到别处。例如 $T(e_1) = (0, 1)$，$T(e_2) = (-1, 0)$ 时，$T(2, 3) = 2(0, 1) + 3(-1, 0) = (-3, 2)$。\n\n> **注意。** 图中的箭头是 $T$ 的矩阵的列。要用点的坐标去组合这两列；把它们当作行来用，作用的就是逆映射。",
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
      const wrong = [inverse, [-image[0], -image[1]], P, [image[1], image[0]], [image[0], -image[1]], [-image[0], image[1]]] as Point[];
      const slips: [string, string][] = [
        ["That uses the arrows as rows, which applies the inverse map $T^{T}$.", "这是把箭头当作行来用，作用的是逆映射 $T^{T}$。"],
        ["Both signs are flipped, as if each arrow pointed the other way.", "两个符号都反了，好像每个箭头都指向相反方向。"],
        ["That is $P$ itself; the map was not applied.", "这是 $P$ 本身；没有作用映射。"],
        ["The two coordinates of $T(P)$ are swapped.", "$T(P)$ 的两个坐标交换了。"],
        [
          "Only the second coordinate has its sign flipped; recheck the direction of each arrow.",
          "只有第二个坐标的符号反了；重新看每个箭头的方向。",
        ],
        [
          "Only the first coordinate has its sign flipped; recheck the direction of each arrow.",
          "只有第一个坐标的符号反了；重新看每个箭头的方向。",
        ],
      ];
      return reasoned(
        choose(
          rng,
          [
            "The arrows show the images of the standard basis under an orthogonal map $T$. What is $T(P)$ for the point $P$ drawn?",
            "箭头表示正交映射 $T$ 下标准基的像。对图中的点 $P$，$T(P)$ 是什么？",
          ],
          same(col(image[0], image[1])),
          wrong.map((c) => same(col(c[0], c[1]))),
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
        ),
        wrong.map((c, i): [string, string, string] => [same(col(c[0], c[1]))[0], ...(slips[i] as [string, string])]),
      );
    },
  ),
  figure: linearAlgebraDrawings2["orthogonal-linear-transformations#applying-a-drawn-orthogonal-map"],
};

const vectorEquationOfLine = point(
  "the-vector-equation-of-a-drawn-line",
  ["The vector equation of a drawn line", "图中直线的向量方程"],
  [
    "A vector equation of a line is a point on the line plus a parameter times a direction along it. Any point on the line and any nonzero multiple of the direction will do. Exchanging the point and the direction gives a different line, and a direction read with its coordinates swapped gives a line with the wrong slope. Through $A(1, 1)$ and $B(3, 2)$: $B - A = (2, 1)$, so $\\mathbf{r} = (1, 1) + t(2, 1)$.\n\n> **Watch out.** Read the direction as $B - A$ with $x$ first and $y$ second. A direction with its entries swapped, or a point with its signs flipped, describes a different line.",
    "直线的向量方程是直线上一点加参数乘以沿直线的方向。可以取直线上任一点和方向的任一非零倍数。交换点和方向会得到另一条直线，读方向时交换坐标则得到斜率错误的直线。过 $A(1, 1)$ 和 $B(3, 2)$：$B - A = (2, 1)$，所以 $\\mathbf{r} = (1, 1) + t(2, 1)$。\n\n> **注意。** 方向按 $B - A$ 读，先 $x$ 后 $y$。分量交换的方向，或符号反了的点，描述的是另一条直线。",
  ],
  (rng) => {
    const d = rng.pick(primitive.filter((p) => Math.abs(p[0]) !== Math.abs(p[1]) && Math.abs(p[0]) <= 2 && Math.abs(p[1]) <= 2));
    const A = rng.pick(nonzero(3).filter((p) => cross(p, d) !== 0));
    const B: Point = [A[0] + d[0], A[1] + d[1]];
    const eq = (p: Point, q: Point) => `\\mathbf{r} = ${col(p[0], p[1])} + t${col(q[0], q[1])}`;
    const choice = choose(
      rng,
      ["Which equation describes the line drawn through $A$ and $B$?", "哪个方程描述了图中过 $A$ 和 $B$ 的直线？"],
      same(eq(A, d)),
      [same(eq(d, A)), same(eq(A, [d[1], d[0]])), same(eq(A, [-d[1], d[0]])), same(eq([-A[0], -A[1]], d))],
      [
        `**Step 1: Read the points.** The drawing gives $A = (${A[0]}, ${A[1]})$ and $B = (${B[0]}, ${B[1]})$.\n\n**Step 2: Form the equation.** The direction is $B - A = (${d[0]}, ${d[1]})$; starting at $A$ and moving along it gives $${eq(A, d)}$.\n\n**Check.** $t = 1$ gives $(${A[0]} + ${d[0] < 0 ? `(${d[0]})` : d[0]}, ${A[1]} + ${d[1] < 0 ? `(${d[1]})` : d[1]}) = (${B[0]}, ${B[1]})$, which is $B$.`,
        `**第一步：读出两点。** 由图得 $A = (${A[0]}, ${A[1]})$，$B = (${B[0]}, ${B[1]})$。\n\n**第二步：写出方程。** 方向是 $B - A = (${d[0]}, ${d[1]})$；从 $A$ 出发沿它移动得 $${eq(A, d)}$。\n\n**检验。** $t = 1$ 得 $(${A[0]} + ${d[0] < 0 ? `(${d[0]})` : d[0]}, ${A[1]} + ${d[1] < 0 ? `(${d[1]})` : d[1]}) = (${B[0]}, ${B[1]})$，正是 $B$。`,
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
    return reasoned(choice, [
      [
        same(eq(d, A))[0],
        "The point and the direction are swapped: the vector standing alone must be a point of the line, here $A$.",
        "点和方向交换了：单独写的向量必须是直线上的点，这里是 $A$。",
      ],
      [
        same(eq(A, [d[1], d[0]]))[0],
        "The entries of the direction are swapped: read $B - A$ with $x$ first, then $y$.",
        "方向的分量交换了：$B - A$ 要先读 $x$，再读 $y$。",
      ],
      [
        same(eq(A, [-d[1], d[0]]))[0],
        "That direction is perpendicular to the line: its dot product with $B - A$ is $0$.",
        "这个方向与直线垂直：它与 $B - A$ 的点积是 $0$。",
      ],
      [
        same(eq([-A[0], -A[1]], d))[0],
        "The signs of the point are flipped, so this line passes through $-A$, not $A$.",
        "点的符号反了，所以这条直线经过 $-A$，而不是 $A$。",
      ],
    ]);
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
