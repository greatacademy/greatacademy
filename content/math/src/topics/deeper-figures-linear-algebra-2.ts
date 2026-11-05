// More knowledge points of Linear Algebra that ask the learner to read a drawing: lines of a system, subspaces,
// bases, eigen directions, orthogonality, level curves of quadratic forms and least squares. See
// `deeperFiguresLinearAlgebra2Points`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import type { PlaneMark, Point } from "@ga/subject-math";
import { Q, svgDocument } from "@ga/subject-math";

import { ask, choose, type Pair, point, same } from "../university-kit.ts";
import { arrowLine, drawn, label } from "./figure-reading-more.ts";

/** fig wraps marks in a figure over the plane from -r to r, with its description in both languages. */
const fig = (r: number, marks: readonly PlaneMark[], [en, zh]: Pair) => drawn({ xMin: -r, xMax: r, yMin: -r, yMax: r }, marks, t(en, zh));

const mat = (a: number | string, b: number | string, c: number | string, d: number | string) =>
  `\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}`;
const col = (x: number, y: number) => `\\begin{pmatrix} ${x} \\\\ ${y} \\end{pmatrix}`;
const at = (p: Point) => `(${p[0]}, ${p[1]})`;
const cross = (u: Point, v: Point) => u[0] * v[1] - u[1] * v[0];
const dot = (u: Point, v: Point) => u[0] * v[0] + u[1] * v[1];
const away = ([x, y]: Point) => (y >= 0 ? (x >= 0 ? "ne" : "nw") : x >= 0 ? "se" : "sw") as "ne" | "nw" | "se" | "sw";

/** arrow draws a vector from the origin with a label at its tip. */
const arrow = (to: Point, text: string, accent = true): PlaneMark[] => [
  { kind: "arrow", from: [0, 0], to, accent },
  { kind: "label", at: to, text, dir: away(to) },
];

/** slanted lists directions of lines through the origin that are neither horizontal nor vertical. */
const slanted: readonly Point[] = [
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

/** directions lists the directions of slanted lines together with the two axes. */
const directions: readonly Point[] = [[1, 0], [0, 1], ...slanted];

/** grid lists the nonzero grid vectors with coordinates up to r in size. */
function grid(r: number): Point[] {
  const out: Point[] = [];
  for (let x = -r; x <= r; x++) for (let y = -r; y <= r; y++) if (x !== 0 || y !== 0) out.push([x, y]);
  return out;
}

/** independent picks two grid vectors that are not parallel. */
function independent(rng: Rng, r: number): [Point, Point] {
  const u = rng.pick(grid(r));
  return [u, rng.pick(grid(r).filter((v) => cross(u, v) !== 0))];
}

/** linear writes a·x + b·y = c. */
function linear(a: number, b: number, c: number): string {
  const first = a === 1 ? "x" : a === -1 ? "-x" : `${a}x`;
  const second = Math.abs(b) === 1 ? "y" : `${Math.abs(b)}y`;
  return `${first} ${b < 0 ? "-" : "+"} ${second} = ${c}`;
}

const lineEquation = point(
  "the-equation-of-a-drawn-line-from-two-points",
  ["The equation of a drawn line from two points", "由两点写出所画直线的方程"],
  [
    "Read two grid points of the line. Their difference $(d_1, d_2)$ is a direction, so $(d_2, -d_1)$ is a normal, which gives the coefficients of $x$ and $y$. Substituting one of the points gives the constant.",
    "读出直线上的两个格点。它们的差 $(d_1, d_2)$ 是方向，所以 $(d_2, -d_1)$ 是法向量，给出 $x$ 和 $y$ 的系数。代入其中一点得到常数。",
  ],
  (rng) => {
    const d = rng.pick(slanted);
    const a = d[1];
    const b = -d[0];
    const candidates = grid(3).filter(([x, y]) => a * x + b * y !== 0);
    const A = rng.pick(candidates);
    const B: Point = [A[0] + d[0], A[1] + d[1]];
    const c = a * A[0] + b * A[1];
    return choose(
      rng,
      ["Which equation describes the drawn line?", "哪个方程描述所画的直线？"],
      same(linear(a, b, c)),
      [same(linear(a, -b, c)), same(linear(b, a, c)), same(linear(a, b, c + (c === -1 ? 2 : 1))), same(linear(a, b, -c))],
      [
        `The line passes through $${at(A)}$ and $${at(B)}$, so a direction is $${at(d)}$ and a normal is $(${a}, ${b})$. Substituting $${at(A)}$ gives the constant $${c}$.`,
        `直线过 $${at(A)}$ 和 $${at(B)}$，所以方向为 $${at(d)}$，法向量为 $(${a}, ${b})$。代入 $${at(A)}$ 得常数 $${c}$。`,
      ],
      fig(
        7,
        [
          { kind: "line", a: A, b: B, accent: true },
          { kind: "point", at: A },
          { kind: "point", at: B },
        ],
        [`A line with marked points at ${at(A)} and ${at(B)}.`, `一条直线，标出的点位于 ${at(A)} 和 ${at(B)}。`],
      ),
    );
  },
);

const cramerFromDrawing = point(
  "a-cramer-determinant-from-the-crossing-of-two-lines",
  ["A Cramer determinant from the crossing of two lines", "由两直线的交点求克莱姆行列式"],
  [
    "The crossing of the two lines of a system is its solution. Cramer's rule says $x = \\frac{D_x}{D}$ and $y = \\frac{D_y}{D}$, so the coordinates of the crossing and $D$ together give $D_x$ and $D_y$.",
    "方程组两条直线的交点就是它的解。克莱姆法则给出 $x = \\frac{D_x}{D}$，$y = \\frac{D_y}{D}$，所以交点坐标和 $D$ 一起给出 $D_x$ 和 $D_y$。",
  ],
  (rng) => {
    const x0 = rng.int(-4, 4);
    const y0 = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4].filter((v) => v !== x0));
    const [d1, d2] = rng.sample([...slanted], 2) as [Point, Point];
    const [u, v] = cross(d1, d2) === 0 ? [d1, [d2[1], d2[0]] as Point] : [d1, d2];
    const D = rng.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7]);
    const askX = rng.bool();
    const value = askX ? x0 : y0;
    const name = askX ? "D_x" : "D_y";
    const other = askX ? y0 : x0;
    const here: Point = [x0, y0];
    return ask(
      [
        `The drawn lines are the two equations of a $2 \\times 2$ system whose coefficient determinant is $D = ${D}$. Using Cramer's rule, find $${name}$.`,
        `所画的直线是一个 $2 \\times 2$ 方程组的两个方程，其系数行列式 $D = ${D}$。用克莱姆法则求 $${name}$。`,
      ],
      value * D,
      [other * D, -value * D, value + D, value - D],
      [
        `The lines cross at $${at(here)}$, so $${askX ? "x" : "y"} = ${value}$. Since $${askX ? "x" : "y"} = \\frac{${name}}{D}$, we get $${name} = ${value}(${D}) = ${value * D}$.`,
        `两直线交于 $${at(here)}$，所以 $${askX ? "x" : "y"} = ${value}$。由 $${askX ? "x" : "y"} = \\frac{${name}}{D}$ 得 $${name} = ${value}(${D}) = ${value * D}$。`,
      ],
      fig(
        6,
        [
          { kind: "line", a: here, b: [x0 + u[0], y0 + u[1]], accent: true },
          { kind: "line", a: here, b: [x0 + v[0], y0 + v[1]] },
        ],
        [`Two lines crossing at ${at(here)}.`, `两条直线相交于 ${at(here)}。`],
      ),
    );
  },
);

const singularFromLines = point(
  "ranks-of-a-system-from-its-drawn-lines",
  ["Ranks of a system from its drawn lines", "由所画直线判断方程组的秩"],
  [
    "Crossing lines have independent rows, so both ranks are $2$. Parallel lines have dependent coefficient rows but an inconsistent augmented matrix, so the ranks are $1$ and $2$. One line drawn twice has both ranks equal to $1$.",
    "相交的直线行向量无关，两个秩都是 $2$。平行线的系数行相关而增广矩阵不相容，秩分别为 $1$ 和 $2$。同一条直线重合时两个秩都是 $1$。",
  ],
  (rng) => {
    const kind = rng.pick(["cross", "parallel", "same"] as const);
    const d = rng.pick(directions);
    const p: Point = [rng.int(-3, 3), rng.int(-3, 3)];
    const shift = rng.int(1, 3) * (rng.bool() ? 1 : -1);
    const q: Point = d[0] === 0 ? [p[0] + shift, p[1]] : [p[0], p[1] + shift];
    const e = rng.pick(directions.filter((v) => cross(v, d) !== 0));
    const marks: PlaneMark[] = [{ kind: "line", a: p, b: [p[0] + d[0], p[1] + d[1]], accent: true }];
    if (kind === "cross") marks.push({ kind: "line", a: p, b: [p[0] + e[0], p[1] + e[1]] });
    if (kind === "parallel") marks.push({ kind: "line", a: q, b: [q[0] + d[0], q[1] + d[1]] });
    const options: Record<typeof kind, Pair> = {
      cross: [
        "$\\operatorname{rank} A = 2$ and $\\operatorname{rank} [A \\mid b] = 2$: one solution",
        "$\\operatorname{rank} A = 2$，$\\operatorname{rank} [A \\mid b] = 2$：唯一解",
      ],
      parallel: [
        "$\\operatorname{rank} A = 1$ and $\\operatorname{rank} [A \\mid b] = 2$: no solution",
        "$\\operatorname{rank} A = 1$，$\\operatorname{rank} [A \\mid b] = 2$：无解",
      ],
      same: [
        "$\\operatorname{rank} A = 1$ and $\\operatorname{rank} [A \\mid b] = 1$: infinitely many solutions",
        "$\\operatorname{rank} A = 1$，$\\operatorname{rank} [A \\mid b] = 1$：无穷多解",
      ],
    };
    const why: Record<typeof kind, Pair> = {
      cross: ["The lines cross at one point, so the coefficient rows are independent.", "两直线交于一点，所以系数行线性无关。"],
      parallel: [
        "The lines are parallel and distinct, so the coefficient rows are dependent while the equations contradict each other.",
        "两直线平行且不重合，所以系数行相关，而两个方程互相矛盾。",
      ],
      same: [
        "Both equations describe the same line, so each row of the augmented matrix is a multiple of the other.",
        "两个方程描述同一条直线，所以增广矩阵的每一行都是另一行的倍数。",
      ],
    };
    return choose(
      rng,
      [
        "The drawing shows the lines of the two equations of a system $Ax = b$; a single line means the two coincide. Which statement is true?",
        "图中是方程组 $Ax = b$ 两个方程的直线；只有一条直线表示两者重合。哪个说法正确？",
      ],
      options[kind],
      [
        ...(["cross", "parallel", "same"] as const).filter((k) => k !== kind).map((k) => options[k]),
        [
          "$\\operatorname{rank} A = 2$ and $\\operatorname{rank} [A \\mid b] = 1$: no solution",
          "$\\operatorname{rank} A = 2$，$\\operatorname{rank} [A \\mid b] = 1$：无解",
        ],
      ],
      why[kind],
      fig(
        7,
        marks,
        kind === "cross"
          ? ["Two lines that cross.", "两条相交的直线。"]
          : kind === "parallel"
            ? ["Two distinct parallel lines.", "两条不重合的平行线。"]
            : ["A single line.", "一条直线。"],
      ),
    );
  },
);

const elementaryShape = point(
  "the-row-operation-of-a-drawn-elementary-matrix",
  ["The row operation of a drawn elementary matrix", "由图读初等矩阵的行变换"],
  [
    "An elementary matrix is the identity after one row operation. Its columns are the images of the basis vectors, so read those arrows, write the matrix and compare it with the identity.",
    "初等矩阵是单位矩阵经过一次行变换的结果。它的列是基向量的像，所以读出这两个箭头，写出矩阵，再与单位矩阵比较。",
  ],
  (rng) => {
    const shears = [-4, -3, -2, -1, 1, 2, 3, 4];
    const scales = [-4, -3, -2, -1, 2, 3, 4];
    type Case = { readonly m: [number, number, number, number]; readonly op: string };
    const cases: Case[] = [
      { m: [0, 1, 1, 0], op: "R_1 \\leftrightarrow R_2" },
      ...shears.map((k): Case => ({ m: [1, k, 0, 1], op: `R_1 \\to R_1 ${k < 0 ? "-" : "+"} ${Math.abs(k) === 1 ? "" : Math.abs(k)}R_2` })),
      ...shears.map((k): Case => ({ m: [1, 0, k, 1], op: `R_2 \\to R_2 ${k < 0 ? "-" : "+"} ${Math.abs(k) === 1 ? "" : Math.abs(k)}R_1` })),
      ...scales.map((k): Case => ({ m: [k, 0, 0, 1], op: `R_1 \\to ${k === -1 ? "-" : k}R_1` })),
      ...scales.map((k): Case => ({ m: [1, 0, 0, k], op: `R_2 \\to ${k === -1 ? "-" : k}R_2` })),
    ];
    const chosen = rng.pick(cases);
    const [a, b, c, d] = chosen.m;
    const u: Point = [a, c];
    const v: Point = [b, d];
    const others = rng.sample(
      cases.filter((x) => x !== chosen),
      3,
    );
    return choose(
      rng,
      [
        "The arrows show the columns of an elementary matrix $E$, the images of $e_1$ and $e_2$. Which row operation on the identity gives $E$?",
        "箭头表示初等矩阵 $E$ 的列，即 $e_1$ 和 $e_2$ 的像。对单位矩阵做哪个行变换得到 $E$？",
      ],
      same(chosen.op),
      others.map((x) => same(x.op)),
      [
        `The arrows give $E = ${mat(a, b, c, d)}$, which differs from the identity exactly by $${chosen.op}$.`,
        `由箭头得 $E = ${mat(a, b, c, d)}$，它与单位矩阵的差别正是 $${chosen.op}$。`,
      ],
      fig(
        5,
        [...arrow(u, "T(e1)"), ...arrow(v, "T(e2)")],
        [
          `Arrows from the origin: T(e1) to ${at(u)} and T(e2) to ${at(v)}.`,
          `从原点出发的箭头：T(e1) 指向 ${at(u)}，T(e2) 指向 ${at(v)}。`,
        ],
      ),
    );
  },
);

const furtherDeterminant = point(
  "determinant-rules-from-a-drawn-pair-of-columns",
  ["Determinant rules from a drawn pair of columns", "由所画的两列用行列式性质计算"],
  [
    "The two arrows are the columns of the matrix, so their coordinates give every entry. Read the columns and compute $\\det A = a_{11}a_{22} - a_{12}a_{21}$. Then use $\\det(A^2) = (\\det A)^2$, $\\det(kA) = k^2 \\det A$ for a $2 \\times 2$ matrix, and $\\det(A^{\\mathsf{T}}) = \\det A$.",
    "两个箭头是矩阵的列，所以它们的坐标给出每个元素。读出两列并计算 $\\det A = a_{11}a_{22} - a_{12}a_{21}$。再用 $\\det(A^2) = (\\det A)^2$，$2 \\times 2$ 矩阵的 $\\det(kA) = k^2 \\det A$，以及 $\\det(A^{\\mathsf{T}}) = \\det A$。",
  ],
  (rng) => {
    const [u, v] = independent(rng, 3);
    const d = cross(u, v);
    const k = rng.int(2, 4);
    const kind = rng.pick(["square", "scale", "transpose", "minus"] as const);
    const name = kind === "square" ? "A^2" : kind === "scale" ? `${k}A` : kind === "transpose" ? "A^{\\mathsf{T}}" : "-A";
    const answer = kind === "square" ? d * d : kind === "scale" ? k * k * d : d;
    const rule =
      kind === "square"
        ? `\\det(A^2) = (${d})^2`
        : kind === "scale"
          ? `\\det(${k}A) = ${k}^2 (${d})`
          : kind === "transpose"
            ? `\\det(A^{\\mathsf{T}}) = \\det A`
            : `\\det(-A) = (-1)^2 (${d})`;
    return ask(
      [
        `The arrows show the columns of a $2 \\times 2$ matrix $A$, first column $c_1$ and second column $c_2$. Find $\\det(${name})$.`,
        `箭头表示 $2 \\times 2$ 矩阵 $A$ 的列，第一列 $c_1$，第二列 $c_2$。求 $\\det(${name})$。`,
      ],
      answer,
      [-answer, 2 * d, k * d, d + 1],
      [
        `The columns are $${at(u)}$ and $${at(v)}$, so $\\det A = ${d}$. Then $${rule} = ${answer}$.`,
        `两列为 $${at(u)}$ 和 $${at(v)}$，所以 $\\det A = ${d}$。于是 $${rule} = ${answer}$。`,
      ],
      fig(
        4,
        [...arrow(u, "c1"), ...arrow(v, "c2")],
        [`Arrows from the origin: c1 to ${at(u)} and c2 to ${at(v)}.`, `从原点出发的箭头：c1 指向 ${at(u)}，c2 指向 ${at(v)}。`],
      ),
    );
  },
);

const zeroDeterminant = point(
  "the-entry-that-makes-a-determinant-zero-from-a-drawing",
  ["The entry that makes a determinant zero, from a drawing", "由图求使行列式为零的元素"],
  [
    "A $2 \\times 2$ determinant is zero exactly when the columns lie on one line through the origin. Read the drawn column, and require the other to be a multiple of it.",
    "$2 \\times 2$ 行列式为零当且仅当两列在过原点的同一条直线上。读出所画的列，并要求另一列是它的倍数。",
  ],
  (rng) => {
    const w = rng.pick(slanted);
    const s = rng.pick([1, 2, -1, -2]);
    const u: Point = [s * w[0], s * w[1]];
    const m = rng.pick([-3, -2, -1, 2, 3, 4]);
    const c = m * w[0];
    const answer = m * w[1];
    const flip = rng.bool();
    const entries = flip
      ? `\\begin{pmatrix} ${u[0]} & ${c} \\\\ ${u[1]} & x \\end{pmatrix}`
      : `\\begin{pmatrix} ${c} & ${u[0]} \\\\ x & ${u[1]} \\end{pmatrix}`;
    return ask(
      [
        `The arrow shows the column $c$ of a matrix, and the other column is $(${c}, x)$. Find $x$ so that the determinant of the matrix is zero.`,
        `箭头表示矩阵的列 $c$，另一列为 $(${c}, x)$。求 $x$，使矩阵的行列式为零。`,
      ],
      answer,
      [-answer, c, answer + 1, u[1]],
      [
        `The arrow is $${at(u)}$, so the matrix is $${entries}$. The other column must lie on the same line, which has direction $${at(w)}$. Since $${c} = ${m}(${w[0]})$, we need $x = ${m}(${w[1]}) = ${answer}$.`,
        `箭头为 $${at(u)}$，所以矩阵为 $${entries}$。另一列必须在同一直线上，该直线方向为 $${at(w)}$。由 $${c} = ${m}(${w[0]})$ 得 $x = ${m}(${w[1]}) = ${answer}$。`,
      ],
      fig(7, arrow(u, "c"), [`An arrow from the origin to ${at(u)}.`, `从原点指向 ${at(u)} 的箭头。`]),
    );
  },
);

const dependentPair = point(
  "the-dependent-pair-among-four-arrows",
  ["The dependent pair among four arrows", "四个箭头中线性相关的一对"],
  [
    "Two vectors are linearly dependent exactly when they lie on one line through the origin, in the same direction or in opposite ones.",
    "两个向量线性相关当且仅当它们在过原点的同一条直线上，方向可以相同也可以相反。",
  ],
  (rng) => {
    const w = rng.pick(directions);
    const [p, q] = rng.sample([-3, -2, -1, 1, 2, 3], 2) as [number, number];
    const a: Point = [p * w[0], p * w[1]];
    const b: Point = [q * w[0], q * w[1]];
    const rest = rng.shuffle(grid(3).filter((v) => cross(v, w) !== 0));
    const c = rest[0] as Point;
    const d = rest.find((v) => cross(v, c) !== 0) as Point;
    const names = rng.shuffle(["A", "B", "C", "D"]);
    const [na, nb, nc, nd] = names as [string, string, string, string];
    const pair = (x: string, y: string): Pair => {
      const [s, e] = [x, y].sort() as [string, string];
      return [`$${s}$ and $${e}$`, `$${s}$ 和 $${e}$`];
    };
    return choose(
      rng,
      ["Which two of the drawn vectors form a linearly dependent set?", "所画向量中哪两个构成线性相关的集合？"],
      pair(na, nb),
      [pair(na, nc), pair(nb, nd), pair(nc, nd), pair(na, nd)],
      [
        `$${na} = ${at(a)}$ and $${nb} = ${at(b)}$ are both multiples of $${at(w)}$, while no other pair lies on one line through the origin.`,
        `$${na} = ${at(a)}$ 和 $${nb} = ${at(b)}$ 都是 $${at(w)}$ 的倍数，其他任何一对都不在过原点的同一条直线上。`,
      ],
      fig(
        7,
        [...arrow(a, na), ...arrow(b, nb), ...arrow(c, nc, false), ...arrow(d, nd, false)],
        [
          `Four arrows from the origin: ${na} to ${at(a)}, ${nb} to ${at(b)}, ${nc} to ${at(c)} and ${nd} to ${at(d)}.`,
          `从原点出发的四个箭头：${na} 指向 ${at(a)}，${nb} 指向 ${at(b)}，${nc} 指向 ${at(c)}，${nd} 指向 ${at(d)}。`,
        ],
      ),
    );
  },
);

const subspaceTest = point(
  "is-the-drawn-set-a-subspace",
  ["Is the drawn set a subspace?", "所画的集合是子空间吗？"],
  [
    "A subset of the plane is a subspace when it contains the origin and is closed under addition and under scalar multiples. The only subspaces of the plane are the origin alone, lines through the origin, and the whole plane.",
    "平面的子集是子空间，当它包含原点，并对加法和数乘封闭。平面的子空间只有原点本身、过原点的直线和整个平面。",
  ],
  (rng) => {
    const kind = rng.pick(["line", "offset", "cross", "half"] as const);
    const d = rng.pick(directions);
    const e = rng.pick(directions.filter((v) => cross(v, d) !== 0));
    const yes: Pair = ["Yes, it is a subspace", "是，它是子空间"];
    const zero: Pair = ["No, it does not contain the zero vector", "不是，它不含零向量"];
    const add: Pair = ["No, it is not closed under addition", "不是，它对加法不封闭"];
    const scale: Pair = ["No, it is not closed under scalar multiples", "不是，它对数乘不封闭"];
    const correct = { line: yes, offset: zero, cross: add, half: scale }[kind];
    if (kind === "line")
      return choose(
        rng,
        ["Is the drawn set, the whole line, a subspace of $\\mathbb{R}^2$?", "所画的集合（整条直线）是 $\\mathbb{R}^2$ 的子空间吗？"],
        correct,
        [zero, add, scale],
        [
          "The line passes through the origin, and sums and multiples of vectors along it stay on it.",
          "直线过原点，沿它的向量的和与倍数仍在直线上。",
        ],
        fig(
          6,
          [{ kind: "line", a: [0, 0], b: d, accent: true }],
          [`A line through the origin with direction ${at(d)}.`, `过原点、方向为 ${at(d)} 的直线。`],
        ),
      );
    if (kind === "offset") {
      const p = rng.pick(grid(3).filter((v) => cross(v, d) !== 0));
      return choose(
        rng,
        ["Is the drawn set, the whole line, a subspace of $\\mathbb{R}^2$?", "所画的集合（整条直线）是 $\\mathbb{R}^2$ 的子空间吗？"],
        correct,
        [yes, add, scale],
        ["The line misses the origin, and every subspace contains the zero vector.", "直线不过原点，而每个子空间都含零向量。"],
        fig(
          6,
          [{ kind: "line", a: p, b: [p[0] + d[0], p[1] + d[1]], accent: true }],
          [`A line through ${at(p)} with direction ${at(d)} that misses the origin.`, `过 ${at(p)}、方向为 ${at(d)} 且不过原点的直线。`],
        ),
      );
    }
    if (kind === "cross")
      return choose(
        rng,
        [
          "Is the drawn set, the union of both lines, a subspace of $\\mathbb{R}^2$?",
          "所画的集合（两条直线的并集）是 $\\mathbb{R}^2$ 的子空间吗？",
        ],
        correct,
        [yes, zero, scale],
        [
          `$${at(d)}$ and $${at(e)}$ are in the set, but their sum $(${d[0] + e[0]}, ${d[1] + e[1]})$ lies on neither line.`,
          `$${at(d)}$ 和 $${at(e)}$ 在集合中，但它们的和 $(${d[0] + e[0]}, ${d[1] + e[1]})$ 不在任何一条直线上。`,
        ],
        fig(
          6,
          [
            { kind: "line", a: [0, 0], b: d, accent: true },
            { kind: "line", a: [0, 0], b: e, accent: true },
          ],
          [`Two lines through the origin, with directions ${at(d)} and ${at(e)}.`, `两条过原点的直线，方向为 ${at(d)} 和 ${at(e)}。`],
        ),
      );
    return choose(
      rng,
      [
        "Is the drawn set, the shaded side including its edge, a subspace of $\\mathbb{R}^2$?",
        "所画的集合（含边界的阴影一侧）是 $\\mathbb{R}^2$ 的子空间吗？",
      ],
      correct,
      [yes, zero, add],
      [
        `The shaded side contains the origin and is closed under addition, but $(${d[1]}, ${-d[0]})$ is in it while its negative is not.`,
        `阴影一侧含原点且对加法封闭，但 $(${d[1]}, ${-d[0]})$ 在其中，它的相反向量却不在。`,
      ],
      fig(
        6,
        [
          { kind: "region", halfPlanes: [[d[1], -d[0], 0]] },
          { kind: "line", a: [0, 0], b: d, accent: true },
        ],
        [
          `The shaded side of the line through the origin with direction ${at(d)} that contains ${at([d[1], -d[0]])}.`,
          `过原点、方向为 ${at(d)} 的直线的一侧为阴影，这一侧含 ${at([d[1], -d[0]])}。`,
        ],
      ),
    );
  },
);

const changeMatrix = point(
  "the-change-of-coordinates-matrix-from-a-drawn-basis",
  ["The change of coordinates matrix from a drawn basis", "由所画的基写坐标变换矩阵"],
  [
    "The matrix that turns coordinates relative to $\\mathcal{B}$ into standard coordinates has the basis vectors as its columns, in order.",
    "把相对于 $\\mathcal{B}$ 的坐标变成标准坐标的矩阵，以基向量为列，按顺序排列。",
  ],
  (rng) => {
    const [u, v] = independent(rng, 4);
    return choose(
      rng,
      [
        "The arrows show a basis $\\mathcal{B} = (b_1, b_2)$. Which matrix turns coordinates relative to $\\mathcal{B}$ into standard coordinates?",
        "箭头表示基 $\\mathcal{B} = (b_1, b_2)$。哪个矩阵把相对于 $\\mathcal{B}$ 的坐标变成标准坐标？",
      ],
      same(mat(u[0], v[0], u[1], v[1])),
      [
        same(mat(u[0], u[1], v[0], v[1])),
        same(mat(v[0], u[0], v[1], u[1])),
        same(mat(u[0], -v[0], u[1], -v[1])),
        same(mat(-u[0], v[0], -u[1], v[1])),
      ],
      [
        `The columns are the basis vectors in order, $b_1 = ${at(u)}$ and $b_2 = ${at(v)}$.`,
        `各列依次是基向量 $b_1 = ${at(u)}$ 和 $b_2 = ${at(v)}$。`,
      ],
      fig(
        5,
        [...arrow(u, "b1"), ...arrow(v, "b2")],
        [`Arrows from the origin: b1 to ${at(u)} and b2 to ${at(v)}.`, `从原点出发的箭头：b1 指向 ${at(u)}，b2 指向 ${at(v)}。`],
      ),
    );
  },
);

const changeBasis = point(
  "standard-coordinates-from-a-drawn-basis",
  ["Standard coordinates from a drawn basis", "由所画的基求标准坐标"],
  [
    "Coordinates relative to a basis say how much of each basis vector to use. If $[x]_{\\mathcal{B}} = (a, b)$ then $x = a b_1 + b b_2$, so read the basis vectors from the drawing and combine them.",
    "相对于一组基的坐标说明每个基向量用多少。若 $[x]_{\\mathcal{B}} = (a, b)$，则 $x = a b_1 + b b_2$，所以从图中读出基向量并组合。",
  ],
  (rng) => {
    const [u, v] = independent(rng, 3);
    const a = rng.pick([-3, -2, -1, 2, 3, 4]);
    const b = rng.pick([-3, -2, -1, 2, 3, 4]);
    const x: Point = [a * u[0] + b * v[0], a * u[1] + b * v[1]];
    const first = rng.bool();
    const i = first ? 0 : 1;
    const name: Pair = first ? ["first", "第一"] : ["second", "第二"];
    return ask(
      [
        `The arrows show a basis $\\mathcal{B} = (b_1, b_2)$, and $[x]_{\\mathcal{B}} = (${a}, ${b})$. Find the ${name[0]} standard coordinate of $x$.`,
        `箭头表示基 $\\mathcal{B} = (b_1, b_2)$，且 $[x]_{\\mathcal{B}} = (${a}, ${b})$。求 $x$ 的${name[1]}个标准坐标。`,
      ],
      x[i] as number,
      [x[1 - i] as number, a * (v[i] as number) + b * (u[i] as number), a + b, (x[i] as number) + 1],
      [
        `$x = ${a} ${at(u)} + ${b < 0 ? `(${b})` : b} ${at(v)} = ${at(x)}$.`,
        `$x = ${a} ${at(u)} + ${b < 0 ? `(${b})` : b} ${at(v)} = ${at(x)}$。`,
      ],
      fig(
        4,
        [...arrow(u, "b1"), ...arrow(v, "b2")],
        [`Arrows from the origin: b1 to ${at(u)} and b2 to ${at(v)}.`, `从原点出发的箭头：b1 指向 ${at(u)}，b2 指向 ${at(v)}。`],
      ),
    );
  },
);

const rankNullity = point(
  "nullity-from-a-drawn-image",
  ["Nullity from a drawn image", "由所画的像求零化度"],
  [
    "The rank of $T : \\mathbb{R}^n \\to \\mathbb{R}^2$ is the dimension of its image: $0$ for the origin alone, $1$ for a line through the origin, $2$ for the whole plane. Then rank plus nullity equals $n$.",
    "$T : \\mathbb{R}^n \\to \\mathbb{R}^2$ 的秩是像的维数：只有原点时为 $0$，过原点的直线时为 $1$，整个平面时为 $2$。秩加零化度等于 $n$。",
  ],
  (rng) => {
    const n = rng.int(3, 9);
    const rank = rng.pick([0, 1, 1, 1, 2]);
    const d = rng.pick(directions);
    const marks: PlaneMark[] =
      rank === 0
        ? [{ kind: "point", at: [0, 0], accent: true }]
        : rank === 1
          ? [{ kind: "line", a: [0, 0], b: d, accent: true }]
          : [{ kind: "region", halfPlanes: [[0, 0, 1]] }];
    return ask(
      [
        `The accented part of the drawing is the image of a linear map $T : \\mathbb{R}^{${n}} \\to \\mathbb{R}^2$. What is the nullity of $T$?`,
        `图中突出显示的部分是线性映射 $T : \\mathbb{R}^{${n}} \\to \\mathbb{R}^2$ 的像。$T$ 的零化度是多少？`,
      ],
      n - rank,
      [rank, n, n - rank - 1, n - rank + 1],
      [
        `The image has dimension $${rank}$, so the rank is $${rank}$ and the nullity is $${n} - ${rank} = ${n - rank}$.`,
        `像的维数为 $${rank}$，所以秩为 $${rank}$，零化度为 $${n} - ${rank} = ${n - rank}$。`,
      ],
      fig(
        5,
        marks,
        rank === 0
          ? ["Only the origin is marked.", "只标出原点。"]
          : rank === 1
            ? [`A line through the origin with direction ${at(d)}.`, `过原点、方向为 ${at(d)} 的直线。`]
            : ["The whole plane is shaded.", "整个平面为阴影。"],
      ),
    );
  },
);

const relativeMatrix = point(
  "a-column-of-a-matrix-relative-to-a-drawn-basis",
  ["A column of a matrix relative to a drawn basis", "相对于所画的基的矩阵的一列"],
  [
    "The first column of $[T]_{\\mathcal{B}}$ holds the coordinates of $T(b_1)$ relative to $\\mathcal{B}$, not its standard coordinates. Write $T(b_1)$ as a combination of $b_1$ and $b_2$.",
    "$[T]_{\\mathcal{B}}$ 的第一列是 $T(b_1)$ 相对于 $\\mathcal{B}$ 的坐标，不是标准坐标。把 $T(b_1)$ 写成 $b_1$ 和 $b_2$ 的组合。",
  ],
  (rng) => {
    const pairs: [Point, Point][] = [
      [
        [1, 0],
        [0, 1],
      ],
      [
        [1, 1],
        [1, -1],
      ],
      [
        [1, 0],
        [1, 1],
      ],
      [
        [1, 1],
        [0, 1],
      ],
      [
        [2, 1],
        [-1, 1],
      ],
      [
        [1, 2],
        [1, -1],
      ],
      [
        [2, 0],
        [0, 1],
      ],
      [
        [1, -1],
        [0, 2],
      ],
    ];
    const [u, v] = rng.pick(pairs);
    const a = rng.pick([-2, -1, 1, 2]);
    const b = rng.pick([-2, -1, 1, 2].filter((x) => x !== a));
    const image: Point = [a * u[0] + b * v[0], a * u[1] + b * v[1]];
    return choose(
      rng,
      [
        "The drawing shows a basis $\\mathcal{B} = (b_1, b_2)$ and the image $T(b_1)$ under a linear map $T$. What is the first column of $[T]_{\\mathcal{B}}$?",
        "图中是基 $\\mathcal{B} = (b_1, b_2)$ 以及线性映射 $T$ 下的像 $T(b_1)$。$[T]_{\\mathcal{B}}$ 的第一列是什么？",
      ],
      same(col(a, b)),
      [same(col(b, a)), same(col(image[0], image[1])), same(col(-a, b)), same(col(a, -b))],
      [
        `$T(b_1) = ${at(image)} = ${a} ${at(u)} + ${b < 0 ? `(${b})` : b} ${at(v)}$, so the coordinates relative to $\\mathcal{B}$ are $(${a}, ${b})$.`,
        `$T(b_1) = ${at(image)} = ${a} ${at(u)} + ${b < 0 ? `(${b})` : b} ${at(v)}$，所以相对于 $\\mathcal{B}$ 的坐标为 $(${a}, ${b})$。`,
      ],
      fig(
        7,
        [...arrow(u, "b1", false), ...arrow(v, "b2", false), ...arrow(image, "T(b1)")],
        [
          `Arrows from the origin: b1 to ${at(u)}, b2 to ${at(v)} and T(b1) to ${at(image)}.`,
          `从原点出发的箭头：b1 指向 ${at(u)}，b2 指向 ${at(v)}，T(b1) 指向 ${at(image)}。`,
        ],
      ),
    );
  },
);

/** eigenPicture chooses two eigenvectors with their eigenvalues and draws them with their images. */
function eigenPicture(rng: Rng) {
  const small: readonly Point[] = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
    [1, 2],
    [2, 1],
  ];
  const v1 = rng.pick(small);
  const v2 = rng.pick(small.filter((v) => cross(v, v1) !== 0));
  const [l1, l2] = rng.sample([-2, -1, 2, 3], 2) as [number, number];
  const i1: Point = [l1 * v1[0], l1 * v1[1]];
  const i2: Point = [l2 * v2[0], l2 * v2[1]];
  const figure = fig(
    7,
    [...arrow(i1, "Av", false), ...arrow(i2, "Aw", false), ...arrow(v1, "v"), ...arrow(v2, "w")],
    [
      `Arrows from the origin: v to ${at(v1)}, Av to ${at(i1)}, w to ${at(v2)} and Aw to ${at(i2)}.`,
      `从原点出发的箭头：v 指向 ${at(v1)}，Av 指向 ${at(i1)}，w 指向 ${at(v2)}，Aw 指向 ${at(i2)}。`,
    ],
  );
  return { v1, v2, l1, l2, figure };
}

/** characteristic writes the characteristic equation with the given trace and determinant. */
function characteristic(trace: number, det: number): string {
  const middle = trace === 0 ? "" : ` ${trace > 0 ? "-" : "+"} ${Math.abs(trace) === 1 ? "" : Math.abs(trace)}\\lambda`;
  return `\\lambda^2${middle} ${det < 0 ? "-" : "+"} ${Math.abs(det)} = 0`;
}

const characteristicFromPicture = point(
  "the-characteristic-equation-from-drawn-eigenvectors",
  ["The characteristic equation from drawn eigenvectors", "由所画的特征向量写特征方程"],
  [
    "Each eigenvalue is the factor between a vector and its image. The characteristic equation of a $2 \\times 2$ matrix is $(\\lambda - \\lambda_1)(\\lambda - \\lambda_2) = 0$, whose coefficients are the trace and the determinant.",
    "每个特征值是向量与其像之间的倍数。$2 \\times 2$ 矩阵的特征方程是 $(\\lambda - \\lambda_1)(\\lambda - \\lambda_2) = 0$，其系数是迹和行列式。",
  ],
  (rng) => {
    const { l1, l2, figure } = eigenPicture(rng);
    const tr = l1 + l2;
    const det = l1 * l2;
    return choose(
      rng,
      [
        "The drawing shows eigenvectors $v$ and $w$ of a $2 \\times 2$ matrix $A$ with their images. What is the characteristic equation of $A$?",
        "图中是 $2 \\times 2$ 矩阵 $A$ 的特征向量 $v$ 和 $w$ 及其像。$A$ 的特征方程是什么？",
      ],
      same(characteristic(tr, det)),
      [same(characteristic(-tr, det)), same(characteristic(tr, -det)), same(characteristic(det, tr)), same(characteristic(-tr, -det))],
      [
        `$Av$ is $${l1}$ times $v$ and $Aw$ is $${l2}$ times $w$, so the eigenvalues are $${l1}$ and $${l2}$, with sum $${tr}$ and product $${det}$.`,
        `$Av$ 是 $v$ 的 $${l1}$ 倍，$Aw$ 是 $w$ 的 $${l2}$ 倍，所以特征值为 $${l1}$ 和 $${l2}$，和为 $${tr}$，积为 $${det}$。`,
      ],
      figure,
    );
  },
);

const powersOnEigen = point(
  "a-power-of-a-matrix-through-drawn-eigenvectors",
  ["A power of a matrix through drawn eigenvectors", "通过所画的特征向量求矩阵的幂"],
  [
    "On an eigenvector, $A^k$ multiplies by $\\lambda^k$. Split a vector into eigenvectors and apply $A^k$ to each piece. This is what diagonalization does.",
    "在特征向量上，$A^k$ 乘以 $\\lambda^k$。把向量分解成特征向量，再分别作用 $A^k$。这正是对角化所做的。",
  ],
  (rng) => {
    const { v1, v2, l1, l2, figure } = eigenPicture(rng);
    const k = rng.int(2, 3);
    const a = rng.pick([1, -1, 2]);
    const b = rng.pick([1, -1, 2]);
    const i = rng.int(0, 1);
    const name: Pair = i === 0 ? ["first", "第一"] : ["second", "第二"];
    const coordinate = (p1: number, p2: number) => a * p1 * (v1[i] as number) + b * p2 * (v2[i] as number);
    const answer = coordinate(l1 ** k, l2 ** k);
    const combo = `${a === 1 ? "" : a === -1 ? "-" : a}v ${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}w`;
    return ask(
      [
        `The drawing shows eigenvectors $v$ and $w$ of a matrix $A$ with their images. Find the ${name[0]} coordinate of $A^{${k}}(${combo})$.`,
        `图中是矩阵 $A$ 的特征向量 $v$ 和 $w$ 及其像。求 $A^{${k}}(${combo})$ 的${name[1]}个坐标。`,
      ],
      answer,
      [coordinate(l1, l2), coordinate(l1 * k, l2 * k), coordinate(l2 ** k, l1 ** k), answer + 1],
      [
        `The eigenvalues are $${l1}$ and $${l2}$, so $A^{${k}}(${combo}) = ${a}(${l1})^{${k}} ${at(v1)} + ${b < 0 ? `(${b})` : b}(${l2})^{${k}} ${at(v2)}$, whose ${name[0]} coordinate is $${answer}$.`,
        `特征值为 $${l1}$ 和 $${l2}$，所以 $A^{${k}}(${combo}) = ${a}(${l1})^{${k}} ${at(v1)} + ${b < 0 ? `(${b})` : b}(${l2})^{${k}} ${at(v2)}$，其${name[1]}个坐标为 $${answer}$。`,
      ],
      figure,
    );
  },
);

/** spin picks the image (a, b) of e1 under a rotation-scaling matrix. */
function spin(rng: Rng): Point {
  const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
  const b = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4].filter((v) => Math.abs(v) !== Math.abs(a)));
  return [a, b];
}

const complexEigen = point(
  "complex-eigenvalues-from-a-drawn-rotation-scaling",
  ["Complex eigenvalues from a drawn rotation-scaling", "由所画的旋转伸缩读复特征值"],
  [
    "A matrix $\\begin{pmatrix} a & -b \\\\ b & a \\end{pmatrix}$ sends $e_1$ to $(a, b)$ and $e_2$ to $(-b, a)$, which rotates and scales the plane, so it has no real eigenvector. Its eigenvalues are $a \\pm bi$.",
    "矩阵 $\\begin{pmatrix} a & -b \\\\ b & a \\end{pmatrix}$ 把 $e_1$ 映到 $(a, b)$，把 $e_2$ 映到 $(-b, a)$，这是对平面的旋转加缩放，所以没有实特征向量。它的特征值是 $a \\pm bi$。",
  ],
  (rng) => {
    const [a, b] = spin(rng);
    const size = (v: number) => (Math.abs(v) === 1 ? "" : Math.abs(v));
    const answer = (x: number, y: number) => `${x} \\pm ${size(y)}i`;
    return choose(
      rng,
      [
        "The arrows show the images of $e_1$ and $e_2$ under a real matrix $A$ that rotates and scales the plane. What are the eigenvalues of $A$?",
        "箭头表示 $e_1$ 和 $e_2$ 在实矩阵 $A$ 下的像，$A$ 对平面做旋转和伸缩。$A$ 的特征值是什么？",
      ],
      same(answer(a, b)),
      [same(answer(b, a)), same(answer(-a, b)), same(answer(-b, a)), same(answer(a * a + b * b, 1))],
      [
        `The arrows give $A = ${mat(a, -b, b, a)}$, so $\\lambda^2 ${2 * a < 0 ? "+" : "-"} ${Math.abs(2 * a)}\\lambda + ${a * a + b * b} = 0$, whose roots are $${answer(a, b)}$.`,
        `由箭头得 $A = ${mat(a, -b, b, a)}$，所以 $\\lambda^2 ${2 * a < 0 ? "+" : "-"} ${Math.abs(2 * a)}\\lambda + ${a * a + b * b} = 0$，根为 $${answer(a, b)}$。`,
      ],
      fig(
        5,
        [...arrow([a, b], "T(e1)"), ...arrow([-b, a], "T(e2)")],
        [
          `Arrows from the origin: T(e1) to ${at([a, b])} and T(e2) to ${at([-b, a])}.`,
          `从原点出发的箭头：T(e1) 指向 ${at([a, b])}，T(e2) 指向 ${at([-b, a])}。`,
        ],
      ),
    );
  },
);

const rotationScale = point(
  "the-rotation-scaling-form-from-a-drawn-image",
  ["The rotation-scaling form from a drawn image", "由所画的像写旋转伸缩形式"],
  [
    "A rotation-scaling matrix is determined by the image of $e_1$: if that image is $(a, b)$, the first column is $(a, b)$ and the second is the same vector turned by a quarter turn counterclockwise, $(-b, a)$.",
    "旋转伸缩矩阵由 $e_1$ 的像决定：如果这个像是 $(a, b)$，第一列就是 $(a, b)$，第二列是同一向量逆时针转四分之一圈，即 $(-b, a)$。",
  ],
  (rng) => {
    const [a, b] = spin(rng);
    return choose(
      rng,
      [
        "A linear map rotates and scales the plane, without reflecting it, and the arrow shows the image of $e_1$. Which matrix is it?",
        "一个线性映射对平面做旋转和伸缩，没有反射，箭头表示 $e_1$ 的像。它是哪个矩阵？",
      ],
      same(mat(a, -b, b, a)),
      [same(mat(a, b, -b, a)), same(mat(a, b, b, a)), same(mat(a, b, b, -a)), same(mat(b, -a, a, b))],
      [
        `The first column is the arrow, $${at([a, b])}$. Turning it a quarter turn counterclockwise gives the second column, $(${-b}, ${a})$.`,
        `第一列就是箭头 $${at([a, b])}$。把它逆时针转四分之一圈得第二列 $(${-b}, ${a})$。`,
      ],
      fig(5, arrow([a, b], "T(e1)"), [`An arrow from the origin to ${at([a, b])}.`, `从原点指向 ${at([a, b])} 的箭头。`]),
    );
  },
);

const dotFromArrows = point(
  "the-dot-product-of-two-drawn-arrows",
  ["The dot product of two drawn arrows", "两个所画箭头的点积"],
  [
    "Read the coordinates of each arrow, multiply matching coordinates and add. The sign agrees with the angle: positive when it is acute, negative when it is obtuse, zero when it is right.",
    "读出每个箭头的坐标，对应坐标相乘再相加。符号与夹角一致：锐角为正，钝角为负，直角为零。",
  ],
  (rng) => {
    const [u, v] = independent(rng, 5);
    const answer = dot(u, v);
    return ask(
      ["Find $u \\cdot v$ for the drawn vectors.", "求所画向量的点积 $u \\cdot v$。"],
      answer,
      [-answer, cross(u, v), u[0] * v[1] + u[1] * v[0], answer + 1],
      [
        `$u = ${at(u)}$ and $v = ${at(v)}$, so $u \\cdot v = (${u[0]})(${v[0]}) + (${u[1]})(${v[1]}) = ${answer}$.`,
        `$u = ${at(u)}$，$v = ${at(v)}$，所以 $u \\cdot v = (${u[0]})(${v[0]}) + (${u[1]})(${v[1]}) = ${answer}$。`,
      ],
      fig(
        6,
        [...arrow(u, "u"), ...arrow(v, "v")],
        [`Arrows from the origin: u to ${at(u)} and v to ${at(v)}.`, `从原点出发的箭头：u 指向 ${at(u)}，v 指向 ${at(v)}。`],
      ),
    );
  },
);

const normOfDifference = point(
  "the-distance-between-the-tips-of-two-arrows",
  ["The distance between the tips of two arrows", "两箭头尖端之间的距离"],
  [
    "The distance between the tips of $u$ and $v$ is the norm $\\lVert u - v \\rVert$, not the difference of the two norms.",
    "$u$ 和 $v$ 的尖端之间的距离是范数 $\\lVert u - v \\rVert$，不是两个范数之差。",
  ],
  (rng) => {
    const triples: readonly [number, number, number][] = [
      [3, 4, 5],
      [4, 3, 5],
      [6, 8, 10],
      [8, 6, 10],
      [5, 0, 5],
      [0, 5, 5],
      [8, 0, 8],
      [0, 6, 6],
    ];
    const [p, q, r] = rng.pick(triples);
    const sx = rng.bool() ? 1 : -1;
    const sy = rng.bool() ? 1 : -1;
    const [dx, dy] = [sx * p, sy * q];
    const inRange = (c: number) => (c === 0 ? rng.int(-9, 9) : rng.int(Math.max(-9, -9 - c), Math.min(9, 9 - c)));
    let [bx, by] = [inRange(dx), inRange(dy)];
    while ((bx === 0 && by === 0) || (bx + dx === 0 && by + dy === 0)) [bx, by] = [inRange(dx), inRange(dy)];
    const b: Point = [bx, by];
    const a: Point = [bx + dx, by + dy];
    return ask(
      ["Find $\\lVert u - v \\rVert$ for the drawn vectors.", "求所画向量的 $\\lVert u - v \\rVert$。"],
      r,
      [r * r, p + q, r + 1, Math.abs(p - q)],
      [
        `$u - v = ${at(a)} - ${at(b)} = (${dx}, ${dy})$, so the norm is $\\sqrt{${dx * dx} + ${dy * dy}} = ${r}$.`,
        `$u - v = ${at(a)} - ${at(b)} = (${dx}, ${dy})$，所以范数为 $\\sqrt{${dx * dx} + ${dy * dy}} = ${r}$。`,
      ],
      drawn(
        { xMin: -10, xMax: 10, yMin: -10, yMax: 10, labelEvery: 2 },
        [...arrow(a, "u"), ...arrow(b, "v")],
        t(`Arrows from the origin: u to ${at(a)} and v to ${at(b)}.`, `从原点出发的箭头：u 指向 ${at(a)}，v 指向 ${at(b)}。`),
      ),
    );
  },
);

const complementVector = point(
  "a-vector-of-the-orthogonal-complement-of-a-drawn-line",
  ["A vector of the orthogonal complement of a drawn line", "所画直线的正交补中的向量"],
  [
    "The orthogonal complement of a line through the origin holds every vector whose dot product with a direction of the line is zero.",
    "过原点直线的正交补包含所有与直线方向点积为零的向量。",
  ],
  (rng) => {
    const d = rng.pick(slanted);
    const k = rng.pick([-3, -2, -1, 1, 2, 3]);
    const answer: Point = [-k * d[1], k * d[0]];
    const tries: Point[] = [
      [k * d[0], k * d[1]],
      [k * d[1], k * d[0]],
      [k * d[0], -k * d[1]],
      [k * (d[0] + d[1]), k * d[1]],
      [k * d[1] + 1, k * d[0]],
    ];
    const tip: Point = [2 * d[0], 2 * d[1]];
    return choose(
      rng,
      [
        "$L$ is the drawn line through the origin. Which vector lies in $L^{\\perp}$?",
        "$L$ 是所画的过原点的直线。哪个向量在 $L^{\\perp}$ 中？",
      ],
      same(col(answer[0], answer[1])),
      tries.filter((v) => dot(v, d) !== 0).map((v) => same(col(v[0], v[1]))),
      [
        `The direction of $L$ is $${at(d)}$, and $${at(answer)} \\cdot ${at(d)} = 0$.`,
        `$L$ 的方向为 $${at(d)}$，而 $${at(answer)} \\cdot ${at(d)} = 0$。`,
      ],
      fig(
        7,
        [
          { kind: "line", a: [0, 0], b: d, accent: true },
          { kind: "point", at: d },
          { kind: "point", at: tip },
        ],
        [
          `A line through the origin, with marked points at ${at(d)} and ${at(tip)}.`,
          `一条过原点的直线，标出的点位于 ${at(d)} 和 ${at(tip)}。`,
        ],
      ),
    );
  },
);

const componentsOrthogonal = point(
  "a-coordinate-relative-to-a-drawn-orthogonal-basis",
  ["A coordinate relative to a drawn orthogonal basis", "相对于所画正交基的坐标"],
  [
    "When the basis vectors are perpendicular, the coordinate along $b_i$ is $\\frac{w \\cdot b_i}{b_i \\cdot b_i}$, and no system has to be solved.",
    "当基向量互相垂直时，沿 $b_i$ 的坐标是 $\\frac{w \\cdot b_i}{b_i \\cdot b_i}$，无需解方程组。",
  ],
  (rng) => {
    const b1 = rng.pick<Point>([...slanted, [2, 0], [0, 2], [1, 0], [0, 1]]);
    const k = rng.pick([1, 2, -1]);
    const b2: Point = [-k * b1[1], k * b1[0]];
    const w = rng.pick(grid(4).filter((v) => cross(v, b1) !== 0 && cross(v, b2) !== 0));
    const first = rng.bool();
    const b = first ? b1 : b2;
    const top = dot(w, b);
    const bottom = dot(b, b);
    const other = first ? b2 : b1;
    return ask(
      [
        `The arrows show an orthogonal basis $(b_1, b_2)$ and a vector $w = c_1 b_1 + c_2 b_2$. Find $c_${first ? 1 : 2}$.`,
        `箭头表示正交基 $(b_1, b_2)$ 和向量 $w = c_1 b_1 + c_2 b_2$。求 $c_${first ? 1 : 2}$。`,
      ],
      Q.of(top, bottom),
      [top, Q.of(dot(w, other), dot(other, other)), Q.of(bottom, top === 0 ? 1 : top), Q.of(top, bottom + 1)],
      [
        `$w = ${at(w)}$ and $b_${first ? 1 : 2} = ${at(b)}$, so the coordinate is $\\frac{${top}}{${bottom}} = ${Q.of(top, bottom).toLatex()}$.`,
        `$w = ${at(w)}$，$b_${first ? 1 : 2} = ${at(b)}$，所以坐标为 $\\frac{${top}}{${bottom}} = ${Q.of(top, bottom).toLatex()}$。`,
      ],
      fig(
        7,
        [...arrow(b1, "b1", false), ...arrow(b2, "b2", false), ...arrow(w, "w")],
        [
          `Arrows from the origin: b1 to ${at(b1)}, b2 to ${at(b2)} and w to ${at(w)}.`,
          `从原点出发的箭头：b1 指向 ${at(b1)}，b2 指向 ${at(b2)}，w 指向 ${at(w)}。`,
        ],
      ),
    );
  },
);

const gramSchmidt = point(
  "a-gram-schmidt-step-on-two-drawn-arrows",
  ["A Gram-Schmidt step on two drawn arrows", "对两个所画箭头做格拉姆-施密特一步"],
  [
    "Gram-Schmidt keeps $u$ and replaces $v$ by $v - \\frac{v \\cdot u}{u \\cdot u} u$, which removes the part of $v$ along $u$. What remains is perpendicular to $u$, and that gives an orthogonal pair spanning the same plane.",
    "格拉姆-施密特保留 $u$，把 $v$ 换成 $v - \\frac{v \\cdot u}{u \\cdot u} u$，也就是去掉 $v$ 沿 $u$ 的部分。剩下的部分垂直于 $u$，于是得到张成同一平面的一对正交向量。",
  ],
  (rng) => {
    const u = rng.pick<Point>([...slanted, [2, 1], [1, 0], [0, 1], [2, 0]]);
    const v = rng.pick(grid(4).filter((x) => cross(x, u) !== 0 && dot(x, u) !== 0));
    const uu = dot(u, u);
    const vu = dot(v, u);
    const i = rng.int(0, 1);
    const ui = u[i] as number;
    const vi = v[i] as number;
    const name: Pair = i === 0 ? ["first", "第一"] : ["second", "第二"];
    const answer = Q.of(vi * uu - vu * ui, uu);
    return ask(
      [
        `Apply one step of Gram-Schmidt to the drawn vectors, keeping $u$, and let $w = v - \\frac{v \\cdot u}{u \\cdot u} u$. Find the ${name[0]} coordinate of $w$.`,
        `对所画向量做一步格拉姆-施密特，保留 $u$，令 $w = v - \\frac{v \\cdot u}{u \\cdot u} u$。求 $w$ 的${name[1]}个坐标。`,
      ],
      answer,
      [Q.of(vu * ui, uu), vi - vu * ui, Q.of(vi * uu + vu * ui, uu), Q.of(vi * uu - vu * ui, vu)],
      [
        `$v \\cdot u = ${vu}$ and $u \\cdot u = ${uu}$, so that coordinate is $${vi} - \\frac{${vu}}{${uu}}(${ui}) = ${answer.toLatex()}$.`,
        `$v \\cdot u = ${vu}$，$u \\cdot u = ${uu}$，所以该坐标为 $${vi} - \\frac{${vu}}{${uu}}(${ui}) = ${answer.toLatex()}$。`,
      ],
      fig(
        6,
        [...arrow(u, "u"), ...arrow(v, "v", false)],
        [`Arrows from the origin: u to ${at(u)} and v to ${at(v)}.`, `从原点出发的箭头：u 指向 ${at(u)}，v 指向 ${at(v)}。`],
      ),
    );
  },
);

const projectionEntry = point(
  "an-entry-of-the-projection-matrix-onto-a-drawn-line",
  ["An entry of the projection matrix onto a drawn line", "到所画直线的投影矩阵的元素"],
  [
    "If $d$ is a direction of a line through the origin, the matrix of the orthogonal projection onto it is $\\frac{d d^{\\mathsf{T}}}{d \\cdot d}$, so the entry in row $i$ and column $j$ is $\\frac{d_i d_j}{d \\cdot d}$.",
    "若 $d$ 是过原点直线的方向，到它的正交投影矩阵为 $\\frac{d d^{\\mathsf{T}}}{d \\cdot d}$，所以第 $i$ 行第 $j$ 列的元素是 $\\frac{d_i d_j}{d \\cdot d}$。",
  ],
  (rng) => {
    const d = rng.pick(slanted);
    const [i, j] = rng.pick<[number, number]>([
      [0, 0],
      [0, 1],
      [1, 1],
    ]);
    const top = (d[i] as number) * (d[j] as number);
    const dd = dot(d, d);
    const tip: Point = [2 * d[0], 2 * d[1]];
    return ask(
      [
        `$P$ is the matrix of the orthogonal projection onto the drawn line through the origin. Find the entry of $P$ in row $${i + 1}$ and column $${j + 1}$.`,
        `$P$ 是到所画过原点直线的正交投影矩阵。求 $P$ 第 $${i + 1}$ 行第 $${j + 1}$ 列的元素。`,
      ],
      Q.of(top, dd),
      [top, Q.of(dd - top, dd), Q.of(1, dd), Q.of(top, dd + 1)],
      [
        `A direction is $d = ${at(d)}$, so $d \\cdot d = ${dd}$, and the entry is $\\frac{(${d[i]})(${d[j]})}{${dd}} = ${Q.of(top, dd).toLatex()}$.`,
        `方向为 $d = ${at(d)}$，所以 $d \\cdot d = ${dd}$，该元素为 $\\frac{(${d[i]})(${d[j]})}{${dd}} = ${Q.of(top, dd).toLatex()}$。`,
      ],
      fig(
        7,
        [
          { kind: "line", a: [0, 0], b: d, accent: true },
          { kind: "point", at: d },
          { kind: "point", at: tip },
        ],
        [
          `A line through the origin, with marked points at ${at(d)} and ${at(tip)}.`,
          `一条过原点的直线，标出的点位于 ${at(d)} 和 ${at(tip)}。`,
        ],
      ),
    );
  },
);

const columnSpaceMatrix = point(
  "the-matrix-whose-column-space-is-a-drawn-line",
  ["The matrix whose column space is a drawn line", "列空间是所画直线的矩阵"],
  [
    "The column space is spanned by the columns, so a rank one matrix with column space a given line has every column a multiple of its direction. The rows of such a matrix need not lie on the line: that describes the row space.",
    "列空间由列张成，所以以给定直线为列空间的秩一矩阵，每一列都是直线方向的倍数。这样的矩阵的行不必在直线上：那描述的是行空间。",
  ],
  (rng) => {
    const d = rng.pick(slanted);
    const a = rng.pick([-3, -2, -1, 1, 2, 3]);
    const b = rng.pick([-3, -2, -1, 1, 2, 3].filter((x) => x !== a));
    const tip: Point = [2 * d[0], 2 * d[1]];
    return choose(
      rng,
      ["Which matrix has the drawn line through the origin as its column space?", "哪个矩阵以所画的过原点直线为列空间？"],
      same(mat(a * d[0], b * d[0], a * d[1], b * d[1])),
      [
        same(mat(a * d[0], a * d[1], b * d[0], b * d[1])),
        same(mat(a * d[1], b * d[1], a * d[0], b * d[0])),
        same(mat(a * d[0], b * d[1], a * d[1], b * d[0])),
        same(mat(-a * d[1], -b * d[1], a * d[0], b * d[0])),
      ],
      [
        `A direction of the line is $${at(d)}$, and both columns of this matrix, $${at([a * d[0], a * d[1]])}$ and $${at([b * d[0], b * d[1]])}$, are multiples of it.`,
        `直线方向为 $${at(d)}$，这个矩阵的两列 $${at([a * d[0], a * d[1]])}$ 和 $${at([b * d[0], b * d[1]])}$ 都是它的倍数。`,
      ],
      fig(
        7,
        [
          { kind: "line", a: [0, 0], b: d, accent: true },
          { kind: "point", at: d },
          { kind: "point", at: tip },
        ],
        [
          `A line through the origin, with marked points at ${at(d)} and ${at(tip)}.`,
          `一条过原点的直线，标出的点位于 ${at(d)} 和 ${at(tip)}。`,
        ],
      ),
    );
  },
);

/** tilted returns the coordinates along axes turned by the angle whose cosine and sine are given. */
const tilted = (c: number, s: number) => (x: number, y: number) => [c * x + s * y, -s * x + c * y] as const;

const formClass = point(
  "the-type-of-a-quadratic-form-from-a-level-curve",
  ["The type of a quadratic form from a level curve", "由等值线判断二次型的类型"],
  [
    "In principal axes $Q = \\lambda_1 s^2 + \\lambda_2 t^2$. An ellipse at a positive level means both eigenvalues are positive, and at a negative level both are negative. A hyperbola means opposite signs. Two parallel lines mean one eigenvalue is zero.",
    "在主轴下 $Q = \\lambda_1 s^2 + \\lambda_2 t^2$。正水平的椭圆表示两个特征值都为正，负水平的椭圆表示都为负。双曲线表示符号相反。两条平行线表示有一个特征值为零。",
  ],
  (rng) => {
    const shape = rng.pick(["ellipse", "hyperbola", "lines"] as const);
    const level = rng.bool() ? 1 : -1;
    const p = rng.int(2, 5);
    const q = rng.pick([2, 3, 4, 5].filter((v) => v !== p));
    const root = Math.SQRT1_2;
    const [c, s] = rng.pick<[number, number]>([
      [1, 0],
      [root, root],
      [root, -root],
    ]);
    const turn = tilted(c, s);
    const f = (x: number, y: number) => {
      const [u, v] = turn(x, y);
      if (shape === "ellipse") return (u * u) / (p * p) + (v * v) / (q * q);
      if (shape === "hyperbola") return (u * u) / (p * p) - (v * v) / (q * q);
      return (u * u) / (p * p);
    };
    const names: Record<"pos" | "neg" | "ind" | "psd" | "nsd", Pair> = {
      pos: ["Positive definite", "正定"],
      neg: ["Negative definite", "负定"],
      ind: ["Indefinite", "不定"],
      psd: ["Positive semidefinite, not definite", "半正定但非正定"],
      nsd: ["Negative semidefinite, not definite", "半负定但非负定"],
    };
    const name = (kind: keyof typeof names): Pair => names[kind];
    const kind = shape === "hyperbola" ? "ind" : shape === "ellipse" ? (level > 0 ? "pos" : "neg") : level > 0 ? "psd" : "nsd";
    const all = ["pos", "neg", "ind", "psd", "nsd"] as const;
    const curve: Pair =
      shape === "ellipse"
        ? ["An ellipse", "一个椭圆"]
        : shape === "hyperbola"
          ? ["A hyperbola", "一条双曲线"]
          : ["Two parallel lines", "两条平行线"];
    const why: Pair =
      shape === "hyperbola"
        ? [
            "A hyperbola has axes along which the form takes opposite signs, whichever level is drawn.",
            "双曲线有两个主轴，二次型在其上符号相反，与所画的水平无关。",
          ]
        : shape === "ellipse"
          ? [
              `An ellipse is bounded, so $Q$ keeps one sign away from the origin, and the level $${level}$ gives that sign.`,
              `椭圆有界，所以 $Q$ 在原点外保持一个符号，水平 $${level}$ 给出这个符号。`,
            ]
          : [
              `Parallel lines run along a direction on which $Q$ is zero, and the level $${level}$ gives the sign elsewhere.`,
              `平行线所沿的方向上 $Q$ 为零，水平 $${level}$ 给出其他方向的符号。`,
            ];
    return choose(
      rng,
      [
        `The drawn curve is the level set $Q(x, y) = ${level}$ of a quadratic form $Q$. What type of form is $Q$?`,
        `所画的曲线是二次型 $Q$ 的等值线 $Q(x, y) = ${level}$。$Q$ 是什么类型？`,
      ],
      name(kind),
      all.filter((k) => k !== kind).map(name),
      why,
      fig(7, [{ kind: "contour", f, level: 1, accent: true }], [`${curve[0]} centered at the origin.`, `${curve[1]}，中心在原点。`]),
    );
  },
);

const constrainedMax = point(
  "an-extreme-value-on-the-unit-circle-from-a-level-curve",
  ["An extreme value on the unit circle from a level curve", "由等值线求单位圆上的极值"],
  [
    "For $Q = \\frac{x^2}{p^2} + \\frac{y^2}{q^2}$, the level curve $Q = 1$ is an ellipse with semi-axes $p$ and $q$. The eigenvalues are $\\frac{1}{p^2}$ and $\\frac{1}{q^2}$, and they are the extreme values of $Q$ on the unit circle.",
    "对 $Q = \\frac{x^2}{p^2} + \\frac{y^2}{q^2}$，等值线 $Q = 1$ 是半轴为 $p$ 和 $q$ 的椭圆。特征值是 $\\frac{1}{p^2}$ 和 $\\frac{1}{q^2}$，它们就是 $Q$ 在单位圆上的极值。",
  ],
  (rng) => {
    const p = rng.int(1, 6);
    const q = rng.pick([1, 2, 3, 4, 5, 6].filter((v) => v !== p));
    const f = (x: number, y: number) => (x * x) / (p * p) + (y * y) / (q * q);
    const askMax = rng.bool();
    const semi = askMax ? Math.min(p, q) : Math.max(p, q);
    const answer = Q.of(1, semi * semi);
    return ask(
      [
        `The drawn ellipse is the level curve $Q(x, y) = 1$ of a quadratic form $Q$ whose principal axes are the coordinate axes. Find the ${askMax ? "maximum" : "minimum"} of $Q$ on the unit circle $x^2 + y^2 = 1$.`,
        `所画的椭圆是二次型 $Q$ 的等值线 $Q(x, y) = 1$，$Q$ 的主轴是坐标轴。求 $Q$ 在单位圆 $x^2 + y^2 = 1$ 上的${askMax ? "最大值" : "最小值"}。`,
      ],
      answer,
      [Q.of(1, semi), Q.of(semi * semi, 1), Q.of(1, (p + q - semi) * (p + q - semi)), Q.of(1, 2 * semi)],
      [
        `The semi-axes are $${p}$ and $${q}$, so the eigenvalues are $${Q.of(1, p * p).toLatex()}$ and $${Q.of(1, q * q).toLatex()}$. The ${askMax ? "larger" : "smaller"} one is $${answer.toLatex()}$, from the ${askMax ? "shorter" : "longer"} axis.`,
        `半轴为 $${p}$ 和 $${q}$，所以特征值为 $${Q.of(1, p * p).toLatex()}$ 和 $${Q.of(1, q * q).toLatex()}$。${askMax ? "较大" : "较小"}的是 $${answer.toLatex()}$，来自${askMax ? "较短" : "较长"}的轴。`,
      ],
      fig(
        7,
        [{ kind: "contour", f, level: 1, accent: true }],
        [
          `An ellipse centered at the origin that meets the x-axis at ±${p} and the y-axis at ±${q}.`,
          `中心在原点的椭圆，与 x 轴交于 ±${p}，与 y 轴交于 ±${q}。`,
        ],
      ),
    );
  },
);

const singularFromEllipse = point(
  "singular-values-from-the-image-of-the-unit-circle",
  ["Singular values from the image of the unit circle", "由单位圆的像读奇异值"],
  [
    "A $2 \\times 2$ invertible matrix sends the unit circle to an ellipse whose semi-axes are its singular values. Their product is $\\lvert \\det A \\rvert$, and their ratio is the condition number.",
    "$2 \\times 2$ 可逆矩阵把单位圆映成椭圆，椭圆的半轴就是奇异值。它们的积是 $\\lvert \\det A \\rvert$，比值是条件数。",
  ],
  (rng) => {
    const p = rng.int(1, 6);
    const q = rng.pick([1, 2, 3, 4, 5, 6].filter((v) => v !== p));
    const [big, small] = [Math.max(p, q), Math.min(p, q)];
    const f = (x: number, y: number) => (x * x) / (p * p) + (y * y) / (q * q);
    const kind = rng.pick(["largest", "smallest", "det", "ratio"] as const);
    const answer =
      kind === "largest" ? Q.of(big, 1) : kind === "smallest" ? Q.of(small, 1) : kind === "det" ? Q.of(big * small, 1) : Q.of(big, small);
    const asked: Pair =
      kind === "largest"
        ? ["the largest singular value of $A$", "$A$ 的最大奇异值"]
        : kind === "smallest"
          ? ["the smallest singular value of $A$", "$A$ 的最小奇异值"]
          : kind === "det"
            ? ["$\\lvert \\det A \\rvert$", "$\\lvert \\det A \\rvert$"]
            : ["the condition number $\\frac{\\sigma_1}{\\sigma_2}$ of $A$", "$A$ 的条件数 $\\frac{\\sigma_1}{\\sigma_2}$"];
    return ask(
      [
        `A matrix $A$ sends the dashed unit circle to the solid ellipse. Find ${asked[0]}.`,
        `矩阵 $A$ 把虚线单位圆映成实线椭圆。求${asked[1]}。`,
      ],
      answer,
      [Q.of(small, big), Q.of(big + small, 1), Q.of(big * big, 1), Q.of(small * small, 1), Q.of(2 * big, 1)],
      [
        `The semi-axes of the ellipse are the singular values, $\\sigma_1 = ${big}$ and $\\sigma_2 = ${small}$, which gives $${answer.toLatex()}$.`,
        `椭圆的半轴就是奇异值，$\\sigma_1 = ${big}$，$\\sigma_2 = ${small}$，于是得 $${answer.toLatex()}$。`,
      ],
      fig(
        7,
        [
          { kind: "circle", center: [0, 0], r: 1, dashed: true },
          { kind: "contour", f, level: 1, accent: true },
        ],
        [
          `A dashed unit circle and a solid ellipse centered at the origin that meets the x-axis at ±${p} and the y-axis at ±${q}.`,
          `虚线单位圆，以及中心在原点的实线椭圆，与 x 轴交于 ±${p}，与 y 轴交于 ±${q}。`,
        ],
      ),
    );
  },
);

const leastSquaresLine = point(
  "the-least-squares-line-of-three-drawn-points",
  ["The least squares line of three drawn points", "三个所画点的最小二乘直线"],
  [
    "For a line $y = mx + k$ through points at $x = -1, 0, 1$, the normal equations $A^{\\mathsf{T}}A \\hat{\\beta} = A^{\\mathsf{T}}y$ are diagonal, since the $x$ values add to zero: $3k = \\sum y_i$ and $2m = \\sum x_i y_i$.",
    "对 $x = -1, 0, 1$ 处的点拟合直线 $y = mx + k$，由于 $x$ 值之和为零，正规方程 $A^{\\mathsf{T}}A \\hat{\\beta} = A^{\\mathsf{T}}y$ 是对角的：$3k = \\sum y_i$，$2m = \\sum x_i y_i$。",
  ],
  (rng) => {
    const a = rng.int(-4, 4);
    const c = rng.int(-4, 4);
    const b = rng.pick([-4, -3, -2, -1, 0, 1, 2, 3, 4].filter((v) => a + c !== 2 * v));
    const askSlope = rng.bool();
    const sum = a + b + c;
    const m = Q.of(c - a, 2);
    const k = Q.of(sum, 3);
    return ask(
      [
        `Find the ${askSlope ? "slope $m$" : "intercept $k$"} of the least squares line $y = mx + k$ through the three drawn points.`,
        `求过三个所画点的最小二乘直线 $y = mx + k$ 的${askSlope ? "斜率 $m$" : "截距 $k$"}。`,
      ],
      askSlope ? m : k,
      askSlope ? [Q.of(c - a, 3), Q.of(c - b, 1), Q.of(c - a, 1), k] : [Q.of(sum, 2), Q.of(b, 1), Q.of(sum, 1), m],
      [
        `The points are $(-1, ${a})$, $(0, ${b})$ and $(1, ${c})$. ${askSlope ? `Then $2m = -(${a}) + ${c < 0 ? `(${c})` : c} = ${c - a}$, so $m = ${m.toLatex()}$.` : `Then $3k = ${a} + ${b < 0 ? `(${b})` : b} + ${c < 0 ? `(${c})` : c} = ${sum}$, so $k = ${k.toLatex()}$.`}`,
        `三点为 $(-1, ${a})$、$(0, ${b})$ 和 $(1, ${c})$。${askSlope ? `于是 $2m = -(${a}) + ${c < 0 ? `(${c})` : c} = ${c - a}$，所以 $m = ${m.toLatex()}$。` : `于是 $3k = ${a} + ${b < 0 ? `(${b})` : b} + ${c < 0 ? `(${c})` : c} = ${sum}$，所以 $k = ${k.toLatex()}$。`}`,
      ],
      fig(
        5,
        [
          { kind: "point", at: [-1, a], accent: true },
          { kind: "point", at: [0, b], accent: true },
          { kind: "point", at: [1, c], accent: true },
        ],
        [`Three points: (-1, ${a}), (0, ${b}) and (1, ${c}).`, `三个点：(-1, ${a})、(0, ${b}) 和 (1, ${c})。`],
      ),
    );
  },
);

/** stateDiagram draws a chain of two states with its probabilities of switching. */
const stateDiagram = (p: string, q: string) =>
  svgDocument(
    130,
    `<circle cx="60" cy="65" r="22" fill="none"/><circle cx="260" cy="65" r="22" fill="none"/>${label(60, 70, "A", 'font-size="14"')}${label(260, 70, "B", 'font-size="14"')}${arrowLine([60, 50], [260, 50], 24)}${arrowLine([260, 80], [60, 80], 24)}${label(160, 42, p)}${label(160, 102, q)}`,
  );

const markovTwo = point(
  "the-steady-state-of-a-drawn-two-state-chain",
  ["The steady state of a drawn two-state chain", "所画两状态链的稳态"],
  [
    "In the steady state, the flow from $A$ to $B$ equals the flow from $B$ to $A$. If $p$ and $q$ are the probabilities of switching out of $A$ and $B$, then $\\pi_A p = \\pi_B q$ and $\\pi_A + \\pi_B = 1$.",
    "在稳态中，从 $A$ 到 $B$ 的流量等于从 $B$ 到 $A$ 的流量。若 $p$ 和 $q$ 是离开 $A$ 和 $B$ 的概率，则 $\\pi_A p = \\pi_B q$，$\\pi_A + \\pi_B = 1$。",
  ],
  (rng) => {
    const p = rng.int(1, 9);
    const q = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== p));
    const inA = rng.bool();
    const answer = Q.of(inA ? q : p, p + q);
    const svg = stateDiagram(String(p / 10), String(q / 10));
    return ask(
      [
        `The diagram shows a Markov chain on states $A$ and $B$: the arrows give the probabilities of switching at each step, and otherwise the chain stays where it is. Find the steady-state probability of $${inA ? "A" : "B"}$.`,
        `图中是状态 $A$ 和 $B$ 上的马尔可夫链：箭头给出每一步切换的概率，否则停留在原状态。求 $${inA ? "A" : "B"}$ 的稳态概率。`,
      ],
      answer,
      [Q.of(inA ? p : q, p + q), Q.of(inA ? q : p, 10), Q.of(1, 2), Q.of(inA ? p : q, 10)],
      [
        `The balance $\\pi_A (${p / 10}) = \\pi_B (${q / 10})$ with $\\pi_A + \\pi_B = 1$ gives $\\pi_${inA ? "A" : "B"} = \\frac{${inA ? q : p}}{${p + q}}$, which is $${answer.toLatex()}$.`,
        `由平衡式 $\\pi_A (${p / 10}) = \\pi_B (${q / 10})$ 和 $\\pi_A + \\pi_B = 1$ 得 $\\pi_${inA ? "A" : "B"} = \\frac{${inA ? q : p}}{${p + q}}$，即 $${answer.toLatex()}$。`,
      ],
      {
        svg,
        alt: t(
          `Two states: an arrow from A to B labeled ${p / 10} and an arrow from B to A labeled ${q / 10}.`,
          `两个状态：从 A 到 B 的箭头标 ${p / 10}，从 B 到 A 的箭头标 ${q / 10}。`,
        ),
      },
    );
  },
);

/** deeperFiguresLinearAlgebra2Points adds more knowledge points of Linear Algebra that are answered by reading a drawing. */
export const deeperFiguresLinearAlgebra2Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "the-cartesian-equation-of-a-line": [lineEquation],
  "cramers-rule-for-2x2-systems-of-linear-equations": [cramerFromDrawing],
  "solving-2x2-singular-systems-of-equations-using-gaussian-elimination": [singularFromLines],
  "elementary-2x2-matrices": [elementaryShape],
  "further-properties-of-determinants": [furtherDeterminant],
  "conditions-when-a-determinant-equals-zero": [zeroDeterminant],
  "linear-dependence-and-independence": [dependentPair],
  "subspaces-of-n-dimensional-space-geometric-interpretation": [subspaceTest],
  "the-change-of-coordinates-matrix": [changeMatrix],
  "changing-a-basis-using-the-change-of-coordinates-matrix": [changeBasis],
  "the-rank-nullity-theorem": [rankNullity],
  "matrix-of-a-linear-transformation-relative-to-a-basis": [relativeMatrix],
  "characteristic-equation-of-a-matrix": [characteristicFromPicture],
  "properties-of-diagonalization": [powersOnEigen],
  "finding-complex-eigenvalues-of-real-2x2-matrices": [complexEigen],
  "reducing-real-2x2-matrices-to-rotation-scaling-form": [rotationScale],
  "dot-product-in-n-dimensional-euclidean-space": [dotFromArrows],
  "norm-of-a-vector-in-n-dimensional-euclidean-space": [normOfDifference],
  "orthogonal-complements": [complementVector],
  "components-of-a-vector-with-respect-to-an-orthogonal-or-orthonormal-basis": [componentsOrthogonal],
  "gram-schmidt-process-for-two-vectors": [gramSchmidt],
  "projection-matrices-linear-transformations-and-their-properties": [projectionEntry],
  "four-fundamental-subspaces-of-a-matrix": [columnSpaceMatrix],
  "positive-definite-and-negative-definite-quadratic-forms": [formClass],
  "constrained-optimization-of-quadratic-forms": [constrainedMax],
  "singular-values-of-a-matrix": [singularFromEllipse],
  "least-squares-solution-of-a-linear-system-without-collinearity": [leastSquaresLine],
  "steady-state-vectors": [markovTwo],
};
