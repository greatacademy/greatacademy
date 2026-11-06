// Drawings in the explanations of Linear Algebra about blocks, dot products, orthogonal maps, projections, quadratic forms, singular values and least squares.

import type { Figure } from "@ga/content";
import type { Mark, PlaneMark, Point } from "@ga/subject-math";
import { head, joined, pane } from "./explanation-drawings-calculus-kit.ts";
import { chain, curveOf, tag, toward } from "./explanation-drawings-charts.ts";
import { bare, conic, wide } from "./explanation-drawings-curves.ts";
import { pt, shape } from "./explanation-drawings-geometry-2.ts";
import { drawing, graphed, note, ring, seg } from "./explanation-drawings-kit.ts";
import { cross, flat, type P3, plus3, scene, swing } from "./explanation-drawings-multivariable-kit.ts";

const { sqrt, cos, sin, cosh, sinh, PI: pi } = Math;

const from0 = (to: Point, tone?: "action" | "result"): PlaneMark => toward([0, 0], to, tone);

const corner = (o: Point, a: Point, b: Point, d = 0.25): PlaneMark => {
  const unit = (p: Point): Point => {
    const l = Math.hypot(p[0] - o[0], p[1] - o[1]);
    return [(d * (p[0] - o[0])) / l, (d * (p[1] - o[1])) / l];
  };
  const [u, v] = [unit(a), unit(b)];
  return joined([
    [o[0] + u[0], o[1] + u[1]],
    [o[0] + u[0] + v[0], o[1] + u[1] + v[1]],
    [o[0] + v[0], o[1] + v[1]],
  ]);
};

// A matrix as a grid of cells at (dx, 0) with the listed blocks of cells shaded.
const grid = (
  rows: readonly (readonly string[])[],
  blocks: readonly (readonly [row: number, col: number, size: number])[],
  dx = 0,
): Mark[] => {
  const n = rows.length;
  const cell = (r: number, c: number): Point => [dx + c + 0.5, n - r - 0.5];
  return [
    ...blocks.flatMap(([r, c, k]) =>
      flat([
        [dx + c, n - r],
        [dx + c + k, n - r],
        [dx + c + k, n - r - k],
        [dx + c, n - r - k],
      ]),
    ),
    ...rows.flatMap((row, r) => row.map((text, c) => note([cell(r, c)[0], cell(r, c)[1] - 0.25], text, "n"))),
    ...chain([
      [dx + 0.12, n],
      [dx, n],
      [dx, 0],
      [dx + 0.12, 0],
    ]),
    ...chain([
      [dx + n - 0.12, n],
      [dx + n, n],
      [dx + n, 0],
      [dx + n - 0.12, 0],
    ]),
  ];
};

// The points of the curve with principal coordinates p along (1, 1)/√2 and q along (1, −1)/√2.
const tilted = (p: number, q: number): Point => [(p + q) / sqrt(2), (p - q) / sqrt(2)];
const round = (f: (t: number) => Point): Point[] => swing(f, 0, 2 * pi, 96);

/** linearAlgebraDrawings2 holds the drawings of the second half of the Linear Algebra explanations, by "topic#point". */
export const linearAlgebraDrawings2: Readonly<Record<string, Figure>> = {
  "block-diagonalization-of-nxn-matrices#real-canonical-block-structure": drawing(
    grid(
      [
        ["3", "0", "0", "0"],
        ["0", "−1", "0", "0"],
        ["0", "0", "1", "−2"],
        ["0", "0", "2", "1"],
      ],
      [
        [0, 0, 1],
        [1, 1, 1],
        [2, 2, 2],
      ],
    ),
    "For example, the eigenvalues 3, −1 and 1 ± 2i. Each real eigenvalue gives a shaded 1 × 1 block on the diagonal, and the complex pair gives one shaded 2 × 2 rotation-scaling block with rows (1, −2) and (2, 1).",
    "例如，特征值 3、−1 和 1 ± 2i。每个实特征值给出对角线上一个涂色的 1 × 1 块，这对复特征值给出一个涂色的 2 × 2 旋转缩放块，其行为 (1, −2) 和 (2, 1)。",
  ),
  "block-diagonalization-of-nxn-matrices#the-determinant-from-a-real-and-a-complex-pair-of-eigenvalues": drawing(
    [
      ...grid(
        [
          ["2", "0", "0"],
          ["0", "1", "−3"],
          ["0", "3", "1"],
        ],
        [
          [0, 0, 1],
          [1, 1, 2],
        ],
      ),
      note([1.5, -0.2], "det = 2 · (1² + 3²) = 20", "s"),
    ],
    "For example, the eigenvalues 2 and 1 ± 3i give a 1 × 1 block and a rotation-scaling block. The blocks have determinants 2 and 1² + 3² = 10, so the determinant is 2 · 10 = 20, the product of the eigenvalues.",
    "例如，特征值 2 和 1 ± 3i 给出一个 1 × 1 块和一个旋转缩放块。两块的行列式为 2 和 1² + 3² = 10，所以行列式为 2 · 10 = 20，即特征值之积。",
  ),
  "dot-product-in-n-dimensional-euclidean-space#the-cosine-of-an-angle-from-norms-and-a-dot-product": graphed(
    wide(-1, 8, -1, 5),
    [
      from0([4, 0], "action"),
      from0([3, 4], "result"),
      { kind: "turn", center: [0, 0], from: [1, 0], degrees: 53.13 },
      tag([4, 0], "u", "n"),
      tag([3, 4], "v", "e"),
      tag([0.9, 0.35], "θ", "e"),
      tag([2.2, 3.3], "‖v‖ = 5", "w"),
      tag([2.3, 0], "‖u‖ = 4", "n"),
      tag([3, 2], "cos θ = 12/(4 · 5) = 3/5", "e"),
    ],
    "For example, u = (4, 0) and v = (3, 4) have u · v = 12, ‖u‖ = 4 and ‖v‖ = 5. So cos θ = 12/20 = 3/5. The same division gives the cosine in any dimension.",
    "例如，u = (4, 0)，v = (3, 4)，u · v = 12，‖u‖ = 4，‖v‖ = 5。所以 cos θ = 12/20 = 3/5。同样的除法在任何维数中都给出余弦。",
  ),
  "dot-product-in-n-dimensional-euclidean-space#the-dot-product-of-two-drawn-arrows": graphed(
    wide(-1, 5, -1, 3),
    [
      from0([3, 1], "action"),
      from0([1, 2], "result"),
      tag([3, 1], "u = (3, 1)", "e"),
      tag([1, 2], "v = (1, 2)", "n"),
      tag([1.4, -0.6], "u · v = 3 · 1 + 1 · 2 = 5", "e"),
    ],
    "For example, u = (3, 1) and v = (1, 2). Multiply matching coordinates and add: 3 · 1 + 1 · 2 = 5. The value is positive, and the angle between the arrows is acute.",
    "例如，u = (3, 1)，v = (1, 2)。对应坐标相乘再相加：3 · 1 + 1 · 2 = 5。结果为正，两箭头的夹角是锐角。",
  ),
  "norm-of-a-vector-in-n-dimensional-euclidean-space#an-entry-of-a-unit-vector": (() => {
    const s = scene(1.9);
    const v: P3 = [1, 2, 2];
    const f: P3 = [1, 2, 0];
    return drawing(
      [
        ...s.axes(2.2, 3, 3),
        ...s.line([0, 0, 0], f, undefined, true),
        ...s.line(f, v, undefined, true),
        ...s.line([1, 0, 0], f, undefined, true),
        ...s.line([0, 2, 0], f, undefined, true),
        ...s.arrow([0, 0, 0], v, "action"),
        ...s.arrow([0, 0, 0], [1 / 3, 2 / 3, 2 / 3], "result"),
        ...s.say(v, "v = (1, 2, 2),  ‖v‖ = 3", "ne"),
        ...s.say([1 / 3, 2 / 3, 2 / 3], "(1/3, 2/3, 2/3)", "e"),
        note(s.p([2.2, 0, -0.5]), "1/9 + 4/9 + 4/9 = 1", "s"),
      ],
      "For example, v = (1, 2, 2) has norm 3, so the unit vector is (1/3, 2/3, 2/3), shown as the shorter arrow along v. The ratios between entries do not change, and the squares of the entries add to 1. These entries are the direction cosines.",
      "例如，v = (1, 2, 2) 的范数为 3，所以单位向量为 (1/3, 2/3, 2/3)，即沿 v 的较短箭头。各分量之比不变，分量的平方和为 1。这些分量就是方向余弦。",
    );
  })(),
  "orthogonal-vectors-in-euclidean-spaces#spotting-the-perpendicular-pair": graphed(
    wide(-2, 4, -1, 4),
    [
      from0([2, 1], "result"),
      from0([-1, 2], "result"),
      from0([1, 3], "action"),
      corner([0, 0], [2, 1], [-1, 2]),
      tag([2, 1], "a = (2, 1)", "e"),
      tag([-1, 2], "b = (−1, 2)", "n"),
      tag([1, 3], "c = (1, 3)", "e"),
      tag([2.4, -0.5], "a · b = 0", "e"),
    ],
    "For example, a = (2, 1), b = (−1, 2) and c = (1, 3). Then a · b = −2 + 2 = 0, so a and b are perpendicular, while a · c = 5 and b · c = 5 are not zero.",
    "例如，a = (2, 1)，b = (−1, 2)，c = (1, 3)。于是 a · b = −2 + 2 = 0，所以 a 与 b 垂直，而 a · c = 5，b · c = 5 都不为零。",
  ),
  "cauchy-schwarz-inequality-and-angle-between-two-vectors#angle-cosine-cauchy-schwarz": graphed(
    wide(-1, 5, -1, 4),
    [
      from0([3, 1], "action"),
      from0([1, 3], "result"),
      tag([3, 1], "u = (3, 1)", "e"),
      tag([1, 3], "v = (1, 3)", "e"),
      tag([0.75, 0.75], "θ", "e"),
      tag([2.2, 2.6], "cos θ = 6/10 = 3/5", "e"),
      tag([2.2, 2], "|u · v| = 6 ≤ 10", "e"),
    ],
    "For example, u = (3, 1) and v = (1, 3) have u · v = 6 and ‖u‖‖v‖ = √10 · √10 = 10. Cauchy-Schwarz holds, 6 ≤ 10, and cos θ = 6/10 = 3/5.",
    "例如，u = (3, 1)，v = (1, 3)，u · v = 6，‖u‖‖v‖ = √10 · √10 = 10。柯西–施瓦茨不等式成立，6 ≤ 10，且 cos θ = 6/10 = 3/5。",
  ),
  "cauchy-schwarz-inequality-and-angle-between-two-vectors#maximizing-a-linear-expression-on-a-sphere": (() => {
    const s = scene(2.2);
    const v: P3 = [2 / 3, 4 / 3, 4 / 3];
    return drawing(
      [
        ...s.sphere(2),
        ...s.line(plus3([0, 0, 0], v, -1), v, undefined, true),
        ...s.dot(v, "x + 2y + 2z = 6", "ne", "result"),
        ...s.dot(plus3([0, 0, 0], v, -1), "x + 2y + 2z = −6", "sw", "action"),
        { kind: "dot", at: s.p([0, 0, 0]) },
        note(s.p([0, 0, -2]), "R‖u‖ = 2 · 3 = 6", "s"),
      ],
      "For example, u = (1, 2, 2) and the sphere of radius R = 2. The maximum of x + 2y + 2z is R‖u‖ = 2 · 3 = 6, at (2/3, 4/3, 4/3), which points the same way as u. The minimum −6 is at the opposite point.",
      "例如，u = (1, 2, 2)，球面半径 R = 2。x + 2y + 2z 的最大值为 R‖u‖ = 2 · 3 = 6，在与 u 同向的点 (2/3, 4/3, 4/3) 处取得。最小值 −6 在对径点取得。",
    );
  })(),
  "cauchy-schwarz-inequality-and-angle-between-two-vectors#the-sign-of-a-dot-product-from-a-drawing": graphed(
    wide(-3, 4, -1, 3),
    [
      from0([3, 0]),
      from0([2, 2], "result"),
      from0([0, 2], "action"),
      from0([-2, 1], "result"),
      corner([0, 0], [1, 0], [0, 1]),
      tag([3, 0], "u", "n"),
      tag([2, 2], "u · v₁ = 6 > 0", "n"),
      tag([-0.1, 2.5], "u · v₂ = 0", "w"),
      tag([-2, 1], "u · v₃ = −6 < 0", "n"),
    ],
    "For example, u = (3, 0). The arrow v₁ = (2, 2) makes an acute angle with u and u · v₁ = 6; v₂ = (0, 2) makes a right angle and u · v₂ = 0; v₃ = (−2, 1) makes an obtuse angle and u · v₃ = −6.",
    "例如，u = (3, 0)。箭头 v₁ = (2, 2) 与 u 成锐角，u · v₁ = 6；v₂ = (0, 2) 成直角，u · v₂ = 0；v₃ = (−2, 1) 成钝角，u · v₃ = −6。",
  ),
  "pythagorean-theorem-and-triangle-inequality-in-inner-product-spaces#the-parallelogram-law": graphed(
    wide(-1, 6, -1, 4),
    [
      shape([
        [0, 0],
        [4, 0],
        [5, 2],
        [1, 2],
      ]),
      from0([4, 0], "action"),
      from0([1, 2], "action"),
      from0([5, 2], "result"),
      toward([1, 2], [4, 0], "result"),
      tag([2.5, 0.05], "u", "n"),
      tag([0.5, 1], "v", "w"),
      tag([3.8, 1.5], "‖u + v‖² = 29", "se"),
      tag([2, 1.3], "‖u − v‖² = 13", "ne"),
      tag([3, 3], "29 + 13 = 2 · 16 + 2 · 5", "n"),
    ],
    "For example, u = (4, 0) and v = (1, 2), so ‖u‖² = 16 and ‖v‖² = 5. The diagonals have squared lengths ‖u + v‖² = 25 + 4 = 29 and ‖u − v‖² = 9 + 4 = 13, and 29 + 13 = 42 = 2 · 16 + 2 · 5.",
    "例如，u = (4, 0)，v = (1, 2)，所以 ‖u‖² = 16，‖v‖² = 5。两条对角线的长度平方为 ‖u + v‖² = 25 + 4 = 29，‖u − v‖² = 9 + 4 = 13，且 29 + 13 = 42 = 2 · 16 + 2 · 5。",
  ),
  "pythagorean-theorem-and-triangle-inequality-in-inner-product-spaces#the-range-of-a-norm-from-the-triangle-inequality": drawing(
    [
      ...head([0, 7], [5, 7], "action"),
      ...head([5, 7], [8, 7], "action"),
      ...head([0, 6.5], [8, 6.5], "result"),
      note([8.2, 6.7], "‖u + v‖ = 8", "e"),
      ...head([0, 4.5], [5, 4.5], "action"),
      ...head([5, 4.1], [2, 4.1], "action"),
      ...head([0, 3.7], [2, 3.7], "result"),
      note([5.4, 4.2], "‖u + v‖ = 2", "e"),
      ...head([0, 0], [5, 0], "action"),
      ...head([5, 0], [5, 3], "action"),
      ...head([0, 0], [5, 3], "result"),
      note([5.2, 1.5], "v", "e"),
      note([2.5, 0], "u", "s"),
      note([2.2, 1.4], "‖u + v‖ = √34", "nw"),
      note([2.5, 7], "u", "n"),
      note([6.5, 7], "v", "n"),
      note([2.5, 4.5], "u", "n"),
      note([3.5, 4.1], "v", "n"),
    ],
    "For example, ‖u‖ = 5 and ‖v‖ = 3. Pointing the same way gives 5 + 3 = 8, the upper bound; pointing opposite ways gives 5 − 3 = 2, the lower bound; orthogonal vectors give √(25 + 9) = √34, strictly in between.",
    "例如，‖u‖ = 5，‖v‖ = 3。同向时为 5 + 3 = 8，是上界；反向时为 5 − 3 = 2，是下界；正交时为 √(25 + 9) = √34，严格介于两者之间。",
  ),
  "orthogonal-matrices#solving-with-an-orthogonal-matrix": graphed(
    wide(-1, 6, -5, 2),
    [
      from0([5, 0], "result"),
      from0([3, -4], "action"),
      tag([5, 0], "b = (5, 0)", "n"),
      tag([3, -4], "x = Qᵀb = (3, −4)", "e"),
      tag([3.2, -1], "Qx = b", "e"),
    ],
    "For example, Q has rows (3/5, −4/5) and (4/5, 3/5), and b = (5, 0). No elimination is needed: x = Qᵀb = (1/5)(3 · 5 + 4 · 0, −4 · 5 + 3 · 0) = (3, −4). Q turns x onto b, and both have length 5.",
    "例如，Q 的行为 (3/5, −4/5) 和 (4/5, 3/5)，b = (5, 0)。无需消元：x = Qᵀb = (1/5)(3 · 5 + 4 · 0, −4 · 5 + 3 · 0) = (3, −4)。Q 把 x 转到 b 上，两者长度都是 5。",
  ),
  "orthogonal-matrices#completing-an-orthogonal-matrix": graphed(
    wide(-2, 2, -2, 2),
    [
      { kind: "circle", center: [0, 0], r: 1, dashed: true },
      from0([0.6, 0.8], "result"),
      from0([-0.8, 0.6], "action"),
      from0([0.8, -0.6], "action"),
      tag([0.6, 0.8], "(3/5, 4/5)", "ne"),
      tag([-1.05, 1.15], "(−4/5, 3/5), det = 1", "n"),
      tag([1.05, -1.15], "(4/5, −3/5), det = −1", "s"),
    ],
    "For example, the first column (3/5, 4/5). The second column is one of two perpendicular unit vectors: (−4/5, 3/5) gives determinant +1, a rotation, and (4/5, −3/5) gives determinant −1, a reflection.",
    "例如，第一列为 (3/5, 4/5)。第二列是两个垂直单位向量之一：(−4/5, 3/5) 给出行列式 +1，是旋转；(4/5, −3/5) 给出行列式 −1，是反射。",
  ),
  "orthogonal-linear-transformations#orthogonal-transformation-preserves-geometry": graphed(
    wide(-3, 3, -1, 3),
    [
      from0([2, 1], "action"),
      from0([1, 2], "action"),
      from0([-1, 2], "result"),
      from0([-2, 1], "result"),
      tag([2, 1], "u", "e"),
      tag([1, 2], "v", "e"),
      tag([-1, 2], "Tu", "n"),
      tag([-2, 1], "Tv", "w"),
      tag([0.2, -0.6], "Tu · Tv = u · v = 4", "e"),
    ],
    "For example, T is the rotation by a quarter turn, u = (2, 1) and v = (1, 2). Then Tu = (−1, 2) and Tv = (−2, 1), and Tu · Tv = 2 + 2 = 4 = u · v. Lengths and the angle between the arrows stay the same.",
    "例如，T 是旋转四分之一圈，u = (2, 1)，v = (1, 2)。于是 Tu = (−1, 2)，Tv = (−2, 1)，Tu · Tv = 2 + 2 = 4 = u · v。长度和两箭头的夹角都不变。",
  ),
  "orthogonal-linear-transformations#distances-under-an-orthogonal-transformation": (() => {
    const v: Point = [1 / 3, sqrt(35) / 3];
    const w: Point = [-v[0], -v[1]];
    return graphed(
      wide(-4, 4, -3, 3),
      [
        from0([3, 0], "action"),
        from0(v, "action"),
        joined([[3, 0], v], "result", true),
        from0([-3, 0], "action"),
        from0(w, "action"),
        joined([[-3, 0], w], "result", true),
        tag([3, 0], "u", "n"),
        tag(v, "v", "n"),
        tag([-3, 0], "Tu", "n"),
        tag(w, "Tv", "w"),
        tag([1.8, 1], "‖u − v‖² = 11", "e"),
        tag([-3.9, -2.4], "‖Tu − Tv‖² = 11", "e"),
      ],
      "For example, ‖u‖ = 3, ‖v‖ = 2 and ⟨u, v⟩ = 1, with T the half turn. The dashed sides are equal: ‖Tu − Tv‖² = ‖u − v‖² = 9 − 2 · 1 + 4 = 11.",
      "例如，‖u‖ = 3，‖v‖ = 2，⟨u, v⟩ = 1，T 是旋转半圈。两条虚线边相等：‖Tu − Tv‖² = ‖u − v‖² = 9 − 2 · 1 + 4 = 11。",
    );
  })(),
  "orthogonal-linear-transformations#the-inverse-of-an-orthogonal-matrix-is-its-transpose": drawing(
    [
      ...grid(
        [
          ["3/5", "−4/5"],
          ["4/5", "3/5"],
        ],
        [],
      ),
      ...flat([
        [1, 2],
        [2, 2],
        [2, 1],
        [1, 1],
      ]),
      note([1, 2], "Q", "n"),
      ...grid(
        [
          ["3/5", "4/5"],
          ["−4/5", "3/5"],
        ],
        [],
        4,
      ),
      ...flat([
        [4, 1],
        [5, 1],
        [5, 0],
        [4, 0],
      ]),
      note([5, 2], "Q⁻¹ = Qᵀ", "n"),
    ],
    "For example, Q has rows (3/5, −4/5) and (4/5, 3/5). Its inverse is the transpose, so the entry −4/5 in the first row and second column of Q appears in the second row and first column of Q⁻¹, the shaded cells. It is not the reciprocal of the entry.",
    "例如，Q 的行为 (3/5, −4/5) 和 (4/5, 3/5)。它的逆是转置，所以 Q 第一行第二列的元素 −4/5 出现在 Q⁻¹ 第二行第一列（涂色的格子）。它不是该元素的倒数。",
  ),
  "orthogonal-linear-transformations#applying-a-drawn-orthogonal-map": graphed(
    wide(-2, 4, -2, 3),
    [
      from0([0.6, 0.8], "action"),
      from0([-0.8, 0.6], "action"),
      joined(
        [
          [0, 0],
          [1.2, 1.6],
        ],
        undefined,
        true,
      ),
      joined(
        [
          [1.2, 1.6],
          [0.4, 2.2],
        ],
        undefined,
        true,
      ),
      tag([0.6, 0.8], "T(e₁)", "e"),
      tag([-0.8, 0.6], "T(e₂)", "w"),
      pt([2, 1], "(2, 1)", "e"),
      pt([0.4, 2.2], "T(2, 1) = (2/5, 11/5)", "e", "result"),
      pt([2, -1], "Tᵀ(2, 1) = (2, −1)", "e", "action"),
    ],
    "For example, T(e₁) = (3/5, 4/5) and T(e₂) = (−4/5, 3/5). The point (2, 1) goes to 2T(e₁) + T(e₂) = (2/5, 11/5), along the dashed path. The transpose would instead send it to (2, −1), the inverse map.",
    "例如，T(e₁) = (3/5, 4/5)，T(e₂) = (−4/5, 3/5)。点 (2, 1) 变为 2T(e₁) + T(e₂) = (2/5, 11/5)，如虚线路径所示。转置则把它送到 (2, −1)，即逆映射。",
  ),
  "projecting-vectors-onto-one-dimensional-subspaces#a-projection-from-a-drawing": graphed(
    wide(-1, 6, -1, 5),
    [
      { kind: "line", a: [0, 0], b: [2, 1] },
      from0([3, 4], "action"),
      from0([4, 2], "result"),
      from0([2, 1], "action"),
      joined(
        [
          [4, 2],
          [3, 4],
        ],
        undefined,
        true,
      ),
      corner([4, 2], [0, 0], [3, 4]),
      tag([3, 4], "v = (3, 4)", "e"),
      tag([2, 1], "u = (2, 1)", "se"),
      tag([4, 2], "p = 2u = (4, 2)", "se"),
      tag([3.5, 3], "v − p", "e"),
    ],
    "For example, u = (2, 1) and v = (3, 4). The multiple is (v · u)/(u · u) = 10/5 = 2, so the projection is p = 2u = (4, 2). What remains, v − p = (−1, 2), is perpendicular to u.",
    "例如，u = (2, 1)，v = (3, 4)。倍数为 (v · u)/(u · u) = 10/5 = 2，所以投影为 p = 2u = (4, 2)。剩余部分 v − p = (−1, 2) 与 u 垂直。",
  ),
  "projecting-vectors-onto-one-dimensional-subspaces#the-projection-onto-a-drawn-line": graphed(
    wide(-1, 7, -1, 5),
    [
      { kind: "line", a: [0, 0], b: [1, 2] },
      from0([6, 2], "action"),
      from0([2, 4], "result"),
      joined(
        [
          [2, 4],
          [6, 2],
        ],
        undefined,
        true,
      ),
      corner([2, 4], [0, 0], [6, 2]),
      tag([5.6, 1.4], "v = (6, 2)", "s"),
      tag([2, 4], "p = (2, 4)", "e"),
      tag([1.2, 2.4], "y = 2x", "w"),
      tag([4.3, 3.4], "v − p = (4, −2)", "e"),
    ],
    "For example, the line y = 2x with direction u = (1, 2), and v = (6, 2). Then (v · u)/(u · u) = 10/5 = 2 and p = (2, 4), the point of the line closest to the tip of v. The difference (4, −2) is perpendicular to u, since 4 − 4 = 0.",
    "例如，直线 y = 2x，方向 u = (1, 2)，v = (6, 2)。于是 (v · u)/(u · u) = 10/5 = 2，p = (2, 4)，是直线上离 v 的终点最近的点。差 (4, −2) 与 u 垂直，因为 4 − 4 = 0。",
  ),
  "components-of-a-vector-with-respect-to-an-orthogonal-or-orthonormal-basis#a-coordinate-relative-to-a-drawn-orthogonal-basis": graphed(
    wide(-2, 5, -1, 5),
    [
      from0([2, 1], "action"),
      from0([-1, 2], "action"),
      from0([3, 4], "result"),
      joined(
        [
          [2, 1],
          [4, 2],
        ],
        undefined,
        true,
      ),
      joined(
        [
          [4, 2],
          [3, 4],
        ],
        undefined,
        true,
      ),
      corner([0, 0], [2, 1], [-1, 2]),
      tag([2, 1], "b₁", "s"),
      tag([-1, 2], "b₂", "n"),
      tag([3, 4], "w = 2b₁ + b₂", "n"),
      tag([2.4, 0.45], "10/5 = 2,  5/5 = 1", "e"),
    ],
    "For example, b₁ = (2, 1), b₂ = (−1, 2) and w = (3, 4). The coordinates are (w · b₁)/(b₁ · b₁) = 10/5 = 2 and (w · b₂)/(b₂ · b₂) = 5/5 = 1, so w = 2b₁ + b₂, along the dashed path.",
    "例如，b₁ = (2, 1)，b₂ = (−1, 2)，w = (3, 4)。坐标为 (w · b₁)/(b₁ · b₁) = 10/5 = 2 和 (w · b₂)/(b₂ · b₂) = 5/5 = 1，所以 w = 2b₁ + b₂，如虚线路径所示。",
  ),
  "projecting-vectors-onto-subspaces-in-euclidean-spaces-orthogonal-bases#the-trace-of-a-reflection-through-a-subspace": (() => {
    const s = scene(1.5);
    const [X, F, R]: [P3, P3, P3] = [
      [0, 3, 2],
      [0, 3, 0],
      [0, 3, -2],
    ];
    return drawing(
      [
        ...s.patch([
          [-2, -1, 0],
          [3, -1, 0],
          [3, 4, 0],
          [-2, 4, 0],
        ]),
        ...s.arrow([0, 0, 0], X, "action"),
        ...s.arrow([0, 0, 0], R, "result"),
        ...s.line(X, R, undefined, true),
        ...s.say(X, "x", "n"),
        ...s.say(R, "Rx", "s"),
        ...s.dot(F, "Px", "e"),
        note(s.p([3, -1, 0]), "λ = 1, 1", "w"),
        note(s.p([0, 3, 1.2]), "λ = −1", "e"),
        note(s.p([0, 0, -3]), "tr R = 1 + 1 − 1 = 1", "s"),
      ],
      "For example, the reflection in R³ through the shaded plane z = 0. Directions in the plane are kept, with eigenvalues 1 and 1, and the perpendicular direction is reversed, with eigenvalue −1. So tr R = 1 + 1 − 1 = 1. The point x = (0, 3, 2) goes to Rx = 2Px − x = (0, 3, −2).",
      "例如，R³ 中关于涂色平面 z = 0 的反射。平面内的方向不变，特征值为 1 和 1；垂直方向反向，特征值为 −1。所以 tr R = 1 + 1 − 1 = 1。点 x = (0, 3, 2) 变为 Rx = 2Px − x = (0, 3, −2)。",
    );
  })(),
  "projection-matrices-linear-transformations-and-their-properties#the-reflection-matrix-from-a-projection": graphed(
    wide(-1, 5, -2, 4),
    [
      { kind: "line", a: [0, 0], b: [2, 1] },
      from0([1, 3], "action"),
      from0([3, -1], "result"),
      joined(
        [
          [1, 3],
          [3, -1],
        ],
        undefined,
        true,
      ),
      corner([2, 1], [0, 0], [1, 3]),
      pt([2, 1], "Px = (2, 1)", "e"),
      tag([1, 3], "x = (1, 3)", "e"),
      tag([3, -1], "Rx = 2Px − x = (3, −1)", "s"),
    ],
    "For example, the line along u = (2, 1) and x = (1, 3). The projection is Px = (5/5)u = (2, 1). Going the same distance again gives Rx = 2Px − x = (3, −1).",
    "例如，沿 u = (2, 1) 的直线，x = (1, 3)。投影为 Px = (5/5)u = (2, 1)。再走相同距离得 Rx = 2Px − x = (3, −1)。",
  ),
  "gram-schmidt-process-for-two-vectors#a-gram-schmidt-step-on-two-drawn-arrows": graphed(
    wide(-4, 5, -1, 5),
    [
      from0([3, 1], "action"),
      from0([2, 4], "action"),
      from0([-1, 3], "result"),
      joined(
        [
          [3, 1],
          [2, 4],
        ],
        undefined,
        true,
      ),
      corner([0, 0], [3, 1], [-1, 3]),
      tag([3, 1], "u = (3, 1)", "e"),
      tag([2, 4], "v = (2, 4)", "e"),
      tag([-1.1, 3], "v − u = (−1, 3)", "w"),
    ],
    "For example, u = (3, 1) and v = (2, 4). Here (v · u)/(u · u) = 10/10 = 1, so the part along u is u itself, and v − u = (−1, 3) remains. It is perpendicular to u, since −3 + 3 = 0, and the dashed side shows the same step from the tip of u.",
    "例如，u = (3, 1)，v = (2, 4)。此处 (v · u)/(u · u) = 10/10 = 1，所以沿 u 的部分就是 u，剩下 v − u = (−1, 3)。它与 u 垂直，因为 −3 + 3 = 0，虚线边表示从 u 的终点走同样一步。",
  ),
  "symmetric-matrices#the-second-eigenvector-of-a-symmetric-matrix": graphed(
    wide(-3, 5, -3, 3),
    [
      { kind: "line", a: [0, 0], b: [1, 1] },
      { kind: "line", a: [0, 0], b: [1, -1] },
      from0([1.5, 1.5], "result"),
      from0([1.5, -1.5], "action"),
      corner([0, 0], [1, 1], [1, -1]),
      tag([1.6, 1.4], "v₁ = (1, 1),  λ₁ = 3", "e"),
      tag([1.6, -1.4], "v₂ = (1, −1),  λ₂ = 1", "e"),
    ],
    "For example, a symmetric matrix with eigenvalues 3 and 1, and the eigenvector (1, 1) for 3. The other eigenvector must be perpendicular, along (1, −1). The arrows show directions, drawn longer than the vectors.",
    "例如，对称矩阵的特征值为 3 和 1，属于 3 的特征向量为 (1, 1)。另一个特征向量必须与它垂直，沿 (1, −1)。箭头表示方向，画得比向量本身长。",
  ),
  "positive-definite-and-negative-definite-quadratic-forms#the-type-of-a-quadratic-form-from-a-level-curve": drawing(
    [
      ...pane(0, [-3, 3, 3], [-3, 3, 3], 6, 6, "s", "t")
        .path(
          round((v) => [2 * cos(v), sin(v)]),
          "result",
        )
        .say(0, -3.6, "s² + 4t² = 4", "s")
        .say(0, -5, "λ₁, λ₂ > 0", "s")
        .marks(),
      ...pane(8, [-3, 3, 3], [-3, 3, 3], 6, 6, "s", "t")
        .path(
          swing((v) => [cosh(v), sinh(v)], -1.75, 1.75),
          "result",
        )
        .path(
          swing((v) => [-cosh(v), sinh(v)], -1.75, 1.75),
          "result",
        )
        .say(0, -3.6, "s² − t² = 1", "s")
        .say(0, -5, "λ₁λ₂ < 0", "s")
        .marks(),
      ...pane(16, [-3, 3, 3], [-3, 3, 3], 6, 6, "s", "t")
        .path(
          [
            [1, -3],
            [1, 3],
          ],
          "result",
        )
        .path(
          [
            [-1, -3],
            [-1, 3],
          ],
          "result",
        )
        .say(0, -3.6, "s² = 1", "s")
        .say(0, -5, "λ₂ = 0", "s")
        .marks(),
    ],
    "For example, from left to right. The ellipse s² + 4t² = 4 at a positive level has both eigenvalues positive, 1 and 4. The hyperbola s² − t² = 1 has eigenvalues of opposite signs. The two parallel lines s² = 1 have one eigenvalue zero.",
    "例如，从左到右。椭圆 s² + 4t² = 4 在正的水平上，两个特征值 1 和 4 都为正。双曲线 s² − t² = 1 的特征值异号。两条平行线 s² = 1 有一个特征值为零。",
  ),
  "reducing-a-quadratic-curve-to-its-principal-axes#principal-axes-reduction": graphed(
    wide(-3, 3, -3, 3),
    [
      conic((x, y) => 5 * x * x + 4 * x * y + 2 * y * y - 6),
      { kind: "line", a: [0, 0], b: [2, 1], tone: "action", dashed: true },
      { kind: "line", a: [0, 0], b: [1, -2], tone: "action", dashed: true },
      tag([2.5, 1.25], "y₁", "n"),
      tag([1.3, -2.6], "y₂", "e"),
      tag([0.2, 2.6], "5x² + 4xy + 2y² = 6", "e"),
      tag([-2.9, -2.6], "6y₁² + y₂² = 6", "e"),
    ],
    "For example, 5x² + 4xy + 2y² = 6 has the matrix with rows (5, 2), (2, 2) and eigenvalues 6 and 1. Rotating to the dashed principal axes, along (2, 1) and (1, −2), removes the cross term and gives 6y₁² + y₂² = 6.",
    "例如，5x² + 4xy + 2y² = 6 的矩阵的行为 (5, 2)、(2, 2)，特征值为 6 和 1。旋转到沿 (2, 1) 和 (1, −2) 的虚线主轴，消去交叉项，得 6y₁² + y₂² = 6。",
  ),
  "reducing-a-quadratic-curve-to-its-principal-axes#semi-axes-of-an-ellipse-from-its-principal-axes": graphed(
    wide(-3, 3, -3, 3),
    [
      conic((x, y) => 3 * x * x + 2 * x * y + 3 * y * y - 8),
      joined([[0, 0], tilted(sqrt(2), 0)], "result"),
      joined([[0, 0], tilted(0, 2)], "action"),
      tag(tilted(sqrt(2), 0), "√(8/4) = √2", "ne"),
      tag(tilted(0, 2), "√(8/2) = 2", "se"),
      tag([-2.9, 2.6], "3x² + 2xy + 3y² = 8", "e"),
      tag([-2.9, -2.6], "λ₁ = 4,  λ₂ = 2", "e"),
    ],
    "For example, 3x² + 2xy + 3y² = 8 has the eigenvalues 4 and 2, so the semi-axes are √(8/4) = √2 along (1, 1) and √(8/2) = 2 along (1, −1).",
    "例如，3x² + 2xy + 3y² = 8 的特征值为 4 和 2，所以半轴为沿 (1, 1) 的 √(8/4) = √2 和沿 (1, −1) 的 √(8/2) = 2。",
  ),
  "reducing-a-quadratic-curve-to-its-principal-axes#the-area-of-an-ellipse-from-its-quadratic-form": graphed(
    wide(-3, 3, -3, 3),
    [
      shape(
        round((v) => tilted(cos(v), 3 * sin(v))),
        "result",
      ),
      joined([[0, 0], tilted(1, 0)], "action"),
      joined([[0, 0], tilted(0, 3)], "action"),
      tag(tilted(1, 0), "1", "ne"),
      tag(tilted(0, 1.8), "3", "ne"),
      tag([-2.9, 2.6], "5x² + 8xy + 5y² = 9", "e"),
      tag([-2.9, -2.6], "A = 9π/√9 = 3π", "e"),
    ],
    "For example, 5x² + 8xy + 5y² = 9 has the eigenvalues 9 and 1, whose product is the determinant 25 − 16 = 9. The semi-axes are 1 and 3, and the area is π · 1 · 3 = 9π/√9 = 3π.",
    "例如，5x² + 8xy + 5y² = 9 的特征值为 9 和 1，其积等于行列式 25 − 16 = 9。半轴为 1 和 3，面积为 π · 1 · 3 = 9π/√9 = 3π。",
  ),
  "classifying-quadratic-curves#quadratic-curve-classification": drawing(
    [
      ...pane(0, [-3, 3, 3], [-3, 3, 3], 6, 6)
        .path(
          round((v) => [sqrt(2) * cos(v), 2 * sin(v)]),
          "result",
        )
        .say(0, -3.6, "2x² + y² = 4", "s")
        .say(0, -5, "det A = 2 > 0", "s")
        .marks(),
      ...pane(8, [-3, 3, 3], [-3, 3, 3], 6, 6)
        .path(
          swing((v) => [cosh(v), sinh(v)], -1.75, 1.75),
          "result",
        )
        .path(
          swing((v) => [-cosh(v), sinh(v)], -1.75, 1.75),
          "result",
        )
        .say(0, -3.6, "x² − y² = 1", "s")
        .say(0, -5, "det A = −1 < 0", "s")
        .marks(),
      ...pane(16, [-3, 3, 3], [-3, 3, 3], 6, 6)
        .f((x) => x * x, -1.7, 1.7, "result")
        .say(0, -3.6, "x² − y = 0", "s")
        .say(0, -5, "det A = 0", "s")
        .marks(),
    ],
    "For example, from left to right. 2x² + y² = 4 has det A = 2 > 0, an ellipse. x² − y² = 1 has det A = −1 < 0, a hyperbola. x² − y = 0 has det A = 0, a parabola.",
    "例如，从左到右。2x² + y² = 4 的 det A = 2 > 0，是椭圆。x² − y² = 1 的 det A = −1 < 0，是双曲线。x² − y = 0 的 det A = 0，是抛物线。",
  ),
  "classifying-quadratic-curves#classifying-a-conic-by-its-discriminant": drawing(
    [
      ...pane(0, [-3, 3, 3], [-3, 3, 3], 6, 6)
        .path(
          round((v) => tilted(sqrt(2) * cos(v), sqrt(6) * sin(v))),
          "result",
        )
        .say(0, -3.6, "x² + xy + y² = 3", "s")
        .say(0, -5, "b² − 4ac = −3", "s")
        .marks(),
      ...pane(9, [-3, 3, 3], [-3, 3, 3], 6, 6)
        .path(
          swing((v) => tilted(sqrt(0.4) * cosh(v), sqrt(2) * sinh(v)), -1.2, 1.2),
          "result",
        )
        .path(
          swing((v) => tilted(-sqrt(0.4) * cosh(v), sqrt(2) * sinh(v)), -1.2, 1.2),
          "result",
        )
        .say(0, -3.6, "x² + 3xy + y² = 1", "s")
        .say(0, -5, "b² − 4ac = 5", "s")
        .marks(),
      ...pane(18, [-3, 3, 3], [-3, 3, 3], 6, 6)
        .path(
          swing((p) => tilted(p, -sqrt(2) * p * p), -1.4, 1.4),
          "result",
        )
        .say(0, -3.6, "x² + 2xy + y²", "s")
        .say(0, -5, "+ x − y = 0", "s")
        .say(0, -6.4, "b² − 4ac = 0", "s")
        .marks(),
    ],
    "For example, from left to right. x² + xy + y² = 3 has b² − 4ac = 1 − 4 = −3 < 0, an ellipse. x² + 3xy + y² = 1 has 9 − 4 = 5 > 0, a hyperbola. x² + 2xy + y² + x − y = 0 has 4 − 4 = 0, a parabola.",
    "例如，从左到右。x² + xy + y² = 3 的 b² − 4ac = 1 − 4 = −3 < 0，是椭圆。x² + 3xy + y² = 1 的为 9 − 4 = 5 > 0，是双曲线。x² + 2xy + y² + x − y = 0 的为 4 − 4 = 0，是抛物线。",
  ),
  "classifying-quadratic-curves#the-semi-major-axis-of-a-rotated-ellipse": graphed(
    wide(-3, 3, -3, 3),
    [
      conic((x, y) => 5 * x * x + 6 * x * y + 5 * y * y - 8),
      joined([[0, 0], tilted(1, 0)], "action"),
      joined([[0, 0], tilted(0, 2)], "result"),
      tag(tilted(1, 0), "λ₁ = 8,  √(8/8) = 1", "ne"),
      tag([0.2, -2.2], "λ₂ = 2,  √(8/2) = 2", "e"),
      tag([-2.9, 2.6], "5x² + 6xy + 5y² = 8", "e"),
    ],
    "For example, 5x² + 6xy + 5y² = 8 has the eigenvalues 8 and 2. The squared semi-axes are 8/8 = 1 and 8/2 = 4, so the longer semi-axis 2 belongs to the smaller eigenvalue 2.",
    "例如，5x² + 6xy + 5y² = 8 的特征值为 8 和 2。半轴的平方为 8/8 = 1 和 8/2 = 4，所以较长的半轴 2 属于较小的特征值 2。",
  ),
  "constrained-optimization-of-quadratic-forms#constrained-extrema-unit-sphere": graphed(
    wide(-2, 2, -2, 2),
    [
      { kind: "circle", center: [0, 0], r: 1, tone: "result" },
      { kind: "path", points: round((v) => [cos(v), sqrt(3) * sin(v)]), dashed: true },
      { kind: "path", points: round((v) => [cos(v) / sqrt(3), sin(v)]), dashed: true },
      pt([1, 0], "Q = 3", "ne", "result"),
      pt([-1, 0], "Q = 3", "nw", "result"),
      pt([0, 1], "Q = 1", "ne", "action"),
      pt([0, -1], "Q = 1", "se", "action"),
    ],
    "For example, Q = 3x² + y² on the unit circle has the largest eigenvalue 3 and the smallest 1. The dashed level curves Q = 3 and Q = 1 touch the circle exactly at these extremes, at (±1, 0) and (0, ±1).",
    "例如，Q = 3x² + y² 在单位圆上，最大特征值为 3，最小特征值为 1。虚线等值线 Q = 3 和 Q = 1 恰好在这些极值处与圆相切，切点为 (±1, 0) 和 (0, ±1)。",
  ),
  "constrained-optimization-of-quadratic-forms#extrema-of-a-quadratic-form-on-a-circle-of-radius-r": graphed(
    wide(-4, 4, -4, 4),
    [
      { kind: "circle", center: [0, 0], r: 2, tone: "result" },
      { kind: "path", points: round((v) => [2 * cos(v), sqrt(12) * sin(v)]), dashed: true },
      { kind: "path", points: round((v) => [(2 / sqrt(3)) * cos(v), 2 * sin(v)]), dashed: true },
      pt([2, 0], "Q = 12", "ne", "result"),
      pt([0, 2], "Q = 4", "ne", "action"),
      tag([-3.9, 3.5], "r² = 4,  λ = 3, 1", "e"),
    ],
    "For example, Q = 3x² + y² on the circle of radius r = 2. With the eigenvalues 3 and 1, the extremes are 4 · 3 = 12 and 4 · 1 = 4, where the dashed level curves touch the circle.",
    "例如，Q = 3x² + y² 在半径 r = 2 的圆上。特征值为 3 和 1，极值为 4 · 3 = 12 和 4 · 1 = 4，虚线等值线在此与圆相切。",
  ),
  "constrained-optimization-of-quadratic-forms#an-extreme-value-on-the-unit-circle-from-a-level-curve": graphed(
    wide(-3, 3, -2, 2),
    [
      { kind: "circle", center: [0, 0], r: 1, tone: "result" },
      conic((x, y) => (x * x) / 4 + y * y - 1),
      pt([0, 1], "Q = 1", "ne", "action"),
      pt([1, 0], "Q = 1/4", "ne", "result"),
      tag([2, 0], "p = 2", "ne"),
      tag([-2.9, 1.6], "x²/4 + y² = 1", "e"),
    ],
    "For example, p = 2 and q = 1: the level curve Q = x²/4 + y² = 1 is an ellipse with semi-axes 2 and 1. The eigenvalues are 1/4 and 1, the extreme values on the unit circle, at (±1, 0) and (0, ±1).",
    "例如，p = 2，q = 1：等值线 Q = x²/4 + y² = 1 是半轴为 2 和 1 的椭圆。特征值为 1/4 和 1，就是单位圆上的极值，分别在 (±1, 0) 和 (0, ±1) 处取得。",
  ),
  "constrained-optimization-of-quadratic-forms-determining-where-extrema-are-attained#where-extrema-are-attained": graphed(
    wide(-2, 2, -2, 2),
    [
      { kind: "circle", center: [0, 0], r: 1, tone: "result" },
      { kind: "path", points: round((v) => tilted(cos(v), sqrt(3) * sin(v))), dashed: true },
      { kind: "path", points: round((v) => tilted(cos(v) / sqrt(3), sin(v))), dashed: true },
      pt(tilted(1, 0), "Q = 3", "ne", "result"),
      pt(tilted(-1, 0), "Q = 3", "sw", "result"),
      pt(tilted(0, 1), "Q = 1", "se", "action"),
      pt(tilted(0, -1), "Q = 1", "nw", "action"),
    ],
    "For example, Q = 2x² + 2xy + 2y² has the eigenvalues 3, with the eigenvector (1, 1), and 1, with (1, −1). On the unit circle the maximum 3 is at ±(1, 1)/√2 and the minimum 1 is at ±(1, −1)/√2, where the dashed level curves touch the circle.",
    "例如，Q = 2x² + 2xy + 2y² 的特征值为 3（特征向量 (1, 1)）和 1（特征向量 (1, −1)）。在单位圆上，最大值 3 在 ±(1, 1)/√2 处取得，最小值 1 在 ±(1, −1)/√2 处取得，虚线等值线在此与圆相切。",
  ),
  "constrained-optimization-of-quadratic-forms-determining-where-extrema-are-attained#where-a-diagonal-form-in-three-variables-is-extreme":
    (() => {
      const s = scene(3);
      return drawing(
        [
          ...s.sphere(1),
          ...s.line([-1, 0, 0], [1, 0, 0], undefined, true),
          ...s.line([0, 0, -1], [0, 0, 1], undefined, true),
          ...s.dot([1, 0, 0], "Q = 5", "sw", "result"),
          ...s.dot([-1, 0, 0], "Q = 5", "se", "result"),
          ...s.dot([0, 0, 1], undefined, undefined, "action"),
          ...s.dot([0, 0, -1], undefined, undefined, "action"),
          note(s.p([0, 0, 1.3]), "Q = −1", "n"),
          note(s.p([0, 0, -1.3]), "Q = −1", "s"),
          note(s.p([0, 1, 1]), "Q = 5x² + 2y² − z²", "e"),
        ],
        "For example, Q = 5x² + 2y² − z² on the unit sphere. All the weight on the largest coefficient gives the maximum 5 at ±e₁, and all the weight on the smallest gives the minimum −1 at ±e₃.",
        "例如，Q = 5x² + 2y² − z² 在单位球面上。全部权重放在最大系数上，得最大值 5，在 ±e₁ 处；全部权重放在最小系数上，得最小值 −1，在 ±e₃ 处。",
      );
    })(),
  "constrained-optimization-of-quadratic-forms-determining-where-extrema-are-attained#how-many-unit-vectors-attain-an-extreme-value":
    (() => {
      const s = scene(3);
      return drawing(
        [
          ...s.sphere(1),
          ...s.circle([0, 0, 0], [1, 0, 0], [0, 1, 0], 1, "result", true),
          ...s.dot([0, 0, 1], undefined, undefined, "action"),
          ...s.dot([0, 0, -1], undefined, undefined, "action"),
          note(s.p([0, 0, 1.3]), "Q = 1", "n"),
          note(s.p([0, 0, -1.3]), "Q = 1", "s"),
          note(s.p([0, 1.25, 0]), "Q = 2", "e"),
          note(s.p([0, 1, 1]), "Q = 2x² + 2y² + z²", "e"),
        ],
        "For example, Q = 2x² + 2y² + z² on the unit sphere. The eigenvalue 2 has a two-dimensional eigenspace, so the maximum is attained on the whole circle x² + y² = 1. The eigenvalue 1 has a one-dimensional eigenspace, so the minimum is attained at only two unit vectors, ±e₃.",
        "例如，Q = 2x² + 2y² + z² 在单位球面上。特征值 2 的特征空间是二维的，所以最大值在整个圆 x² + y² = 1 上取得。特征值 1 的特征空间是一维的，所以最小值只在两个单位向量 ±e₃ 处取得。",
      );
    })(),
  "singular-values-of-a-matrix#singular-values-from-the-image-of-the-unit-circle": graphed(
    wide(-3, 3, -3, 3),
    [
      { kind: "circle", center: [0, 0], r: 1, dashed: true },
      { kind: "path", points: round((v) => [2 * cos(v) + sin(v), cos(v) + 2 * sin(v)]), tone: "result" },
      joined([[0, 0], tilted(3, 0)], "action"),
      joined([[0, 0], tilted(0, 1)], "action"),
      tag(tilted(1.8, 0), "σ₁ = 3", "nw"),
      tag(tilted(0, 1), "σ₂ = 1", "se"),
      tag([-2.9, -2.6], "σ₁σ₂ = |det A| = 3", "e"),
    ],
    "For example, A has rows (2, 1) and (1, 2). It sends the dashed unit circle to the ellipse with semi-axes 3 and 1, the singular values. Their product 3 is |det A| = |4 − 1|, and their ratio 3 is the condition number.",
    "例如，A 的行为 (2, 1) 和 (1, 2)。它把虚线单位圆变为半轴为 3 和 1 的椭圆，这两个数就是奇异值。它们的积 3 等于 |det A| = |4 − 1|，比值 3 是条件数。",
  ),
  "computing-the-singular-values-of-a-matrix#singular-values-of-a-scaled-rotation-and-a-rank-one-matrix": drawing(
    [
      ...cross([0, 0], 3.6),
      ring(0.6),
      ring(3, [0, 0], "result"),
      note([0, -3.7], "σ₁ = σ₂ = 5", "s"),
      ...cross([9, 0], 3.6),
      ring(0.6, [9, 0]),
      seg([6, 0], [12, 0], "result"),
      { kind: "dot", at: [6, 0] },
      { kind: "dot", at: [12, 0] },
      note([12, 0], "5", "s"),
      note([6, 0], "−5", "s"),
      note([9, -3.7], "σ₁ = 5,  σ₂ = 0", "s"),
    ],
    "For example, on the left A has rows (3, −4) and (4, 3), so AᵀA = 25I and the small unit circle goes to a circle of radius 5: both singular values are 5. On the right A has rows (3, 4) and (0, 0), so the singular values are ‖(3, 4)‖ = 5 and 0, and the circle goes to a segment from −5 to 5.",
    "例如，左图 A 的行为 (3, −4) 和 (4, 3)，所以 AᵀA = 25I，小的单位圆变为半径 5 的圆：两个奇异值都是 5。右图 A 的行为 (3, 4) 和 (0, 0)，所以奇异值为 ‖(3, 4)‖ = 5 和 0，圆变为从 −5 到 5 的线段。",
  ),
  "least-squares-solution-of-a-linear-system-without-collinearity#the-smallest-squared-error-of-a-least-squares-fit": (() => {
    const s = scene(1.8);
    const [b, f]: [P3, P3] = [
      [0, 3, 2],
      [0, 3, 0],
    ];
    return drawing(
      [
        ...s.patch([
          [-2, -1, 0],
          [2.5, -1, 0],
          [2.5, 4, 0],
          [-2, 4, 0],
        ]),
        ...s.arrow([0, 0, 0], b, "action"),
        ...s.arrow([0, 0, 0], f, "result"),
        ...s.arrow(f, b, "action"),
        ...s.say([0, 1.5, 1], "‖b‖² = 13", "nw"),
        ...s.say([0, 1.5, 0], "‖Ax̂‖² = 9", "s"),
        ...s.say([0, 3, 1], "‖b − Ax̂‖² = 4", "e"),
        note(s.p([2.5, 1, 0]), "13 − 9 = 4", "sw"),
      ],
      "For example, b = (0, 3, 2) and a column space that is the shaded plane z = 0. The closest point is Ax̂ = (0, 3, 0), the residual (0, 0, 2) is perpendicular to the plane, and by Pythagoras ‖b − Ax̂‖² = 13 − 9 = 4.",
      "例如，b = (0, 3, 2)，列空间是涂色平面 z = 0。最近点为 Ax̂ = (0, 3, 0)，残差 (0, 0, 2) 垂直于平面，由勾股定理得 ‖b − Ax̂‖² = 13 − 9 = 4。",
    );
  })(),
  "linear-regression-with-matrices#a-residual-from-a-scatter-plot": graphed(
    wide(-1, 5, -1, 6),
    [
      { kind: "line", a: [0, 0.5], b: [4, 4.5], tone: "result" },
      joined(
        [
          [1, 1],
          [1, 1.5],
        ],
        "action",
        true,
      ),
      joined(
        [
          [2, 4],
          [2, 2.5],
        ],
        "action",
        true,
      ),
      joined(
        [
          [3, 2],
          [3, 3.5],
        ],
        "action",
        true,
      ),
      joined(
        [
          [4, 5],
          [4, 4.5],
        ],
        "action",
        true,
      ),
      bare([1, 1]),
      bare([4, 5]),
      pt([2, 4], "(2, 4)", "n"),
      pt([3, 2], "(3, 2)", "s"),
      tag([2, 3.2], "e = 1.5", "w"),
      tag([3, 2.8], "e = −1.5", "e"),
      tag([4, 4.3], "y = x + 0.5", "se"),
    ],
    "For example, the points (1, 1), (2, 4), (3, 2) and (4, 5) have the least-squares line y = x + 0.5. The dashed vertical distances are the residuals: at x = 2 it is 4 − 2.5 = 1.5, above the line, and at x = 3 it is 2 − 3.5 = −1.5, below it.",
    "例如，点 (1, 1)、(2, 4)、(3, 2)、(4, 5) 的最小二乘直线为 y = x + 0.5。虚线竖直距离就是残差：x = 2 处为 4 − 2.5 = 1.5，在直线上方；x = 3 处为 2 − 3.5 = −1.5，在直线下方。",
  ),
  "polynomial-regression-with-matrices#a-quadratic-fit-through-three-points-interpolates": graphed(
    wide(-3, 3, -1, 5),
    [
      curveOf((x) => 1 - x / 2 + 1.5 * x * x, "result", -1.4, 1.6),
      pt([-1, 3], "(−1, 3)", "w"),
      pt([0, 1], "(0, 1)", "se"),
      pt([1, 2], "(1, 2)", "e"),
      tag([0.3, 4.5], "y = 1 − x/2 + 3x²/2", "e"),
    ],
    "For example, h = 1 with the points (−1, 3), (0, 1) and (1, 2). Then β₀ = 1, β₁ = (2 − 3)/2 = −1/2 and β₂ = (2 + 3 − 2)/2 = 3/2, and the parabola y = 1 − x/2 + 3x²/2 passes through all three points.",
    "例如，h = 1，三点为 (−1, 3)、(0, 1)、(1, 2)。于是 β₀ = 1，β₁ = (2 − 3)/2 = −1/2，β₂ = (2 + 3 − 2)/2 = 3/2，抛物线 y = 1 − x/2 + 3x²/2 过这三点。",
  ),
};
