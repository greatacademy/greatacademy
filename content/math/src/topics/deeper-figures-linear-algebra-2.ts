// More knowledge points of Linear Algebra that ask the learner to read a drawing: lines of a system, subspaces,
// bases, eigen directions, orthogonality, level curves of quadratic forms and least squares. See
// `deeperFiguresLinearAlgebra2Points`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import type { PlaneMark, Point } from "@ga/subject-math";
import { Q, svgDocument } from "@ga/subject-math";
import { linearAlgebraDrawings1 } from "../explanation-drawings-linear-algebra-1.ts";
import { linearAlgebraDrawings2 } from "../explanation-drawings-linear-algebra-2.ts";

import { numberProblem, why } from "../problems.ts";
import { ask, choose, type Pair, point, same } from "../university-kit.ts";
import { reasoned } from "../wrong-reasons.ts";
import { walked } from "./calculus-i-differentiation.ts";
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
    "Read two grid points of the line. Their difference $(d_1, d_2)$ is a direction, so $(d_2, -d_1)$ is a normal, which gives the coefficients of $x$ and $y$. Substituting one of the points gives the constant. Through $(0, 1)$ and $(1, 3)$: the direction is $(1, 2)$, the normal $(2, -1)$, and $(0, 1)$ gives $2x - y = -1$.\n\n> **Watch out.** The normal is $(d_2, -d_1)$: swap the entries of the direction and change the sign of one. The constant must come from substituting a marked point, with its sign.",
    "读出直线上的两个格点。它们的差 $(d_1, d_2)$ 是方向，所以 $(d_2, -d_1)$ 是法向量，给出 $x$ 和 $y$ 的系数。代入其中一点得到常数。过 $(0, 1)$ 和 $(1, 3)$：方向是 $(1, 2)$，法向量是 $(2, -1)$，代入 $(0, 1)$ 得 $2x - y = -1$。\n\n> **注意。** 法向量是 $(d_2, -d_1)$：交换方向的两个分量，再改变其中一个的符号。常数必须由代入标出的点得到，并带着它的符号。",
  ],
  (rng) => {
    const d = rng.pick(slanted);
    const a = d[1];
    const b = -d[0];
    const candidates = grid(3).filter(([x, y]) => a * x + b * y !== 0);
    const A = rng.pick(candidates);
    const B: Point = [A[0] + d[0], A[1] + d[1]];
    const c = a * A[0] + b * A[1];
    const choice = choose(
      rng,
      ["Which equation describes the drawn line?", "哪个方程描述所画的直线？"],
      same(linear(a, b, c)),
      [same(linear(a, -b, c)), same(linear(b, a, c)), same(linear(a, b, c + (c === -1 ? 2 : 1))), same(linear(a, b, -c))],
      [
        `**Step 1: Read a direction and a normal.** The line passes through $${at(A)}$ and $${at(B)}$, so a direction is $${at(d)}$ and a normal is $(${a}, ${b})$.\n\n**Step 2: Find the constant.** Substituting $${at(A)}$ gives $${a}(${A[0]}) + (${b})(${A[1]}) = ${c}$.\n\n**Check.** The other point $${at(B)}$ gives $${a}(${B[0]}) + (${b})(${B[1]}) = ${a * B[0] + b * B[1]}$ as well.`,
        `**第一步：读出方向和法向量。** 直线过 $${at(A)}$ 和 $${at(B)}$，所以方向为 $${at(d)}$，法向量为 $(${a}, ${b})$。\n\n**第二步：求常数。** 代入 $${at(A)}$ 得 $${a}(${A[0]}) + (${b})(${A[1]}) = ${c}$。\n\n**检验。** 另一点 $${at(B)}$ 也给出 $${a}(${B[0]}) + (${b})(${B[1]}) = ${a * B[0] + b * B[1]}$。`,
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
    return reasoned(choice, [
      [
        same(linear(a, -b, c))[0],
        "The coefficient of $y$ has the wrong sign: the normal is $(d_2, -d_1)$.",
        "$y$ 的系数符号错了：法向量是 $(d_2, -d_1)$。",
      ],
      [
        same(linear(b, a, c))[0],
        "The coefficients of $x$ and $y$ are exchanged; this line has a different slope.",
        "$x$ 和 $y$ 的系数交换了；这条直线的斜率不同。",
      ],
      [
        same(linear(a, b, c + (c === -1 ? 2 : 1)))[0],
        "The constant is off: substitute a marked point to find it.",
        "常数不对：要代入一个标出的点来求。",
      ],
      [
        same(linear(a, b, -c))[0],
        "The constant has the wrong sign: substituting a marked point gives its value with its sign.",
        "常数符号错了：代入标出的点得到的值带着它自己的符号。",
      ],
    ]);
  },
);

const cramerFromDrawing = point(
  "a-cramer-determinant-from-the-crossing-of-two-lines",
  ["A Cramer determinant from the crossing of two lines", "由两直线的交点求克莱姆行列式"],
  [
    "The crossing of the two lines of a system is its solution. Cramer's rule says $x = \\frac{D_x}{D}$ and $y = \\frac{D_y}{D}$, so the coordinates of the crossing and $D$ together give $D_x$ and $D_y$. If the lines cross at $(2, -1)$ and $D = 5$: $D_x = 10$ and $D_y = -5$.\n\n> **Watch out.** $D_x$ goes with the $x$-coordinate and $D_y$ with the $y$-coordinate, and each is a product with $D$, not a sum.",
    "方程组两条直线的交点就是它的解。克莱姆法则给出 $x = \\frac{D_x}{D}$，$y = \\frac{D_y}{D}$，所以交点坐标和 $D$ 一起给出 $D_x$ 和 $D_y$。若两直线交于 $(2, -1)$ 且 $D = 5$：$D_x = 10$，$D_y = -5$。\n\n> **注意。** $D_x$ 对应 $x$ 坐标，$D_y$ 对应 $y$ 坐标，而且都是与 $D$ 的积，不是和。",
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
    const answer = value * D;
    const coord = askX ? "x" : "y";
    return {
      ...numberProblem({
        prompt: t(
          `The drawn lines are the two equations of a $2 \\times 2$ system whose coefficient determinant is $D = ${D}$. Using Cramer's rule, find $${name}$.`,
          `所画的直线是一个 $2 \\times 2$ 方程组的两个方程，其系数行列式 $D = ${D}$。用克莱姆法则求 $${name}$。`,
        ),
        answer,
        mistakes: [
          why(
            other * D,
            `That uses the other coordinate; $${name}$ goes with $${coord}$.`,
            `这用了另一个坐标；$${name}$ 对应 $${coord}$。`,
          ),
          why(
            -answer,
            "The sign is flipped: multiply the coordinate and $D$ with both of their signs.",
            "符号反了：坐标与 $D$ 连同符号相乘。",
          ),
          why(
            value + D,
            `Cramer's rule gives $${coord} = \\frac{${name}}{D}$, so $${name}$ is a product, not a sum.`,
            `克莱姆法则给出 $${coord} = \\frac{${name}}{D}$，所以 $${name}$ 是积而不是和。`,
          ),
          why(value - D, `$${name}$ is the coordinate times $D$, not their difference.`, `$${name}$ 是坐标乘以 $D$，不是两者之差。`),
        ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
        solution: walked(
          [
            [
              ["Read the crossing", "读出交点"],
              t(`The lines cross at $${at(here)}$, so $${coord} = ${value}$.`, `两直线交于 $${at(here)}$，所以 $${coord} = ${value}$。`),
            ],
            [
              ["Use Cramer's rule", "用克莱姆法则"],
              t("", ""),
              [`${coord} = \\frac{${name}}{D} \\implies ${name} = ${value} \\cdot ${D < 0 ? `(${D})` : D} = ${answer}`],
            ],
          ],
          t(
            `$\\frac{${answer}}{${D}} = ${value}$, the ${coord}-coordinate of the crossing.`,
            `$\\frac{${answer}}{${D}} = ${value}$，正是交点的 ${coord} 坐标。`,
          ),
        ),
      }),
      figure: fig(
        6,
        [
          { kind: "line", a: here, b: [x0 + u[0], y0 + u[1]], accent: true },
          { kind: "line", a: here, b: [x0 + v[0], y0 + v[1]] },
        ],
        [`Two lines crossing at ${at(here)}.`, `两条直线相交于 ${at(here)}。`],
      ),
    };
  },
);

const singularFromLines = {
  ...point(
    "ranks-of-a-system-from-its-drawn-lines",
    ["Ranks of a system from its drawn lines", "由所画直线判断方程组的秩"],
    [
      "Crossing lines have independent rows, so both ranks are $2$. Parallel lines have dependent coefficient rows but an inconsistent augmented matrix, so the ranks are $1$ and $2$. One line drawn twice has both ranks equal to $1$. So $x + y = 1$ and $x + y = 3$, two parallel lines, give ranks $1$ and $2$ and no solution.\n\n> **Watch out.** The augmented matrix contains $A$, so its rank is never smaller than $\\operatorname{rank} A$. Parallel lines that are distinct and one line drawn twice both have $\\operatorname{rank} A = 1$; only the right-hand side tells them apart.",
      "相交的直线行向量无关，两个秩都是 $2$。平行线的系数行相关而增广矩阵不相容，秩分别为 $1$ 和 $2$。同一条直线重合时两个秩都是 $1$。所以 $x + y = 1$ 与 $x + y = 3$ 这两条平行线给出秩 $1$ 和 $2$，方程组无解。\n\n> **注意。** 增广矩阵包含 $A$，所以它的秩从不小于 $\\operatorname{rank} A$。不重合的平行线与重合的一条直线都有 $\\operatorname{rank} A = 1$；只有右端能把它们区分开。",
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
      const seen: Record<typeof kind, Pair> = {
        cross: ["The drawing shows two lines that cross at one point.", "图中两条直线交于一点。"],
        parallel: ["The drawing shows two distinct lines with the same direction.", "图中是方向相同、互不重合的两条直线。"],
        same: ["The drawing shows a single line, so the two equations coincide.", "图中只有一条直线，所以两个方程重合。"],
      };
      const ranks: Record<typeof kind, Pair> = {
        cross: [
          "Lines with different directions have independent coefficient rows, so $\\operatorname{rank} A = 2$, and then $\\operatorname{rank} [A \\mid b] = 2$ as well.",
          "方向不同的直线，系数行线性无关，所以 $\\operatorname{rank} A = 2$，于是 $\\operatorname{rank} [A \\mid b] = 2$。",
        ],
        parallel: [
          "Parallel lines have proportional coefficient rows, so $\\operatorname{rank} A = 1$; the right-hand sides break the proportion, so $\\operatorname{rank} [A \\mid b] = 2$.",
          "平行线的系数行成比例，所以 $\\operatorname{rank} A = 1$；右端破坏了这个比例，所以 $\\operatorname{rank} [A \\mid b] = 2$。",
        ],
        same: [
          "Each whole row of the augmented matrix is a multiple of the other, so both ranks are $1$.",
          "增广矩阵的每一整行都是另一行的倍数，所以两个秩都是 $1$。",
        ],
      };
      const checks: Record<typeof kind, Pair> = {
        cross: [
          "The crossing point is the one solution, matching ranks equal to the $2$ unknowns.",
          "交点就是唯一解，与两个秩都等于未知数个数 $2$ 相符。",
        ],
        parallel: [
          "No point lies on both lines, matching $\\operatorname{rank} A < \\operatorname{rank} [A \\mid b]$.",
          "没有点同时在两条直线上，与 $\\operatorname{rank} A < \\operatorname{rank} [A \\mid b]$ 相符。",
        ],
        same: [
          "Every point of the line solves both equations: rank $1$ with $2$ unknowns leaves one free variable.",
          "直线上每一点都满足两个方程：秩 $1$、未知数 $2$ 个，留下一个自由变量。",
        ],
      };
      const reasons: Record<typeof kind, Pair> = {
        cross: [
          "Rank $2$ for $A$ needs two lines that meet in exactly one point, which the drawing does not show.",
          "$A$ 的秩为 $2$ 需要两条恰交于一点的直线，图中不是这样。",
        ],
        parallel: [
          "Ranks $1$ and $2$ mean two distinct parallel lines, which the drawing does not show.",
          "秩为 $1$ 和 $2$ 表示两条不重合的平行线，图中不是这样。",
        ],
        same: [
          "Both ranks $1$ mean one line drawn twice, which the drawing does not show.",
          "两个秩都为 $1$ 表示同一条直线画了两次，图中不是这样。",
        ],
      };
      const impossible: Pair = [
        "$\\operatorname{rank} A = 2$ and $\\operatorname{rank} [A \\mid b] = 1$: no solution",
        "$\\operatorname{rank} A = 2$，$\\operatorname{rank} [A \\mid b] = 1$：无解",
      ];
      const choice = choose(
        rng,
        [
          "The drawing shows the lines of the two equations of a system $Ax = b$; a single line means the two coincide. Which statement is true?",
          "图中是方程组 $Ax = b$ 两个方程的直线；只有一条直线表示两者重合。哪个说法正确？",
        ],
        options[kind],
        [...(["cross", "parallel", "same"] as const).filter((k) => k !== kind).map((k) => options[k]), impossible],
        [
          `**Step 1: Read the drawing.** ${seen[kind][0]}\n\n**Step 2: Turn it into ranks.** ${ranks[kind][0]}\n\n**Check.** ${checks[kind][0]}`,
          `**第一步：读图。** ${seen[kind][1]}\n\n**第二步：化为秩。** ${ranks[kind][1]}\n\n**检验。** ${checks[kind][1]}`,
        ],
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
      return reasoned(choice, [
        ...(["cross", "parallel", "same"] as const).map((k) => [options[k][0], ...reasons[k]] as const),
        [
          impossible[0],
          "The augmented matrix contains $A$, so its rank is never smaller than $\\operatorname{rank} A$.",
          "增广矩阵包含 $A$，所以它的秩从不小于 $\\operatorname{rank} A$。",
        ],
      ]);
    },
  ),
  figure:
    linearAlgebraDrawings1["solving-2x2-singular-systems-of-equations-using-gaussian-elimination#ranks-of-a-system-from-its-drawn-lines"],
};

const elementaryShape = point(
  "the-row-operation-of-a-drawn-elementary-matrix",
  ["The row operation of a drawn elementary matrix", "由图读初等矩阵的行变换"],
  [
    "An elementary matrix is the identity after one row operation. Its columns are the images of the basis vectors, so read those arrows, write the matrix and compare it with the identity. Arrows to $(1, 0)$ and $(2, 1)$ give $\\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix}$, the identity after $R_1 \\to R_1 + 2R_2$.\n\n> **Watch out.** The arrows are columns, not rows: the second coordinate of $T(e_1)$ is the $(2, 1)$ entry, so a shear of row $2$ moves the first arrow.",
    "初等矩阵是单位矩阵经过一次行变换的结果。它的列是基向量的像，所以读出这两个箭头，写出矩阵，再与单位矩阵比较。指向 $(1, 0)$ 与 $(2, 1)$ 的箭头给出 $\\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix}$，即单位矩阵做 $R_1 \\to R_1 + 2R_2$ 的结果。\n\n> **注意。** 箭头是列而不是行：$T(e_1)$ 的第二个坐标是 $(2, 1)$ 元素，所以对第 $2$ 行的倍加移动的是第一个箭头。",
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
    const E = mat(a, b, c, d);
    const which: Pair =
      a === 0
        ? [
            "Both diagonal entries are $0$ and both off-diagonal entries are $1$: the rows of the identity are swapped.",
            "两个对角元素为 $0$，两个非对角元素为 $1$：单位矩阵的两行交换了。",
          ]
        : b !== 0
          ? [
              `Only the $(1, 2)$ entry differs, now $${b}$: row $1$ gained $${b}$ times row $2$.`,
              `只有 $(1, 2)$ 元素不同，变为 $${b}$：第 $1$ 行加上了第 $2$ 行的 $${b}$ 倍。`,
            ]
          : c !== 0
            ? [
                `Only the $(2, 1)$ entry differs, now $${c}$: row $2$ gained $${c}$ times row $1$.`,
                `只有 $(2, 1)$ 元素不同，变为 $${c}$：第 $2$ 行加上了第 $1$ 行的 $${c}$ 倍。`,
              ]
            : a !== 1
              ? [
                  `Only the $(1, 1)$ entry differs, now $${a}$: row $1$ was multiplied by $${a}$.`,
                  `只有 $(1, 1)$ 元素不同，变为 $${a}$：第 $1$ 行乘以了 $${a}$。`,
                ]
              : [
                  `Only the $(2, 2)$ entry differs, now $${d}$: row $2$ was multiplied by $${d}$.`,
                  `只有 $(2, 2)$ 元素不同，变为 $${d}$：第 $2$ 行乘以了 $${d}$。`,
                ];
    const choice = choose(
      rng,
      [
        "The arrows show the columns of an elementary matrix $E$, the images of $e_1$ and $e_2$. Which row operation on the identity gives $E$?",
        "箭头表示初等矩阵 $E$ 的列，即 $e_1$ 和 $e_2$ 的像。对单位矩阵做哪个行变换得到 $E$？",
      ],
      same(chosen.op),
      others.map((x) => same(x.op)),
      [
        `**Step 1: Read the arrows as columns.** $T(e_1) = ${at(u)}$ is column $1$ and $T(e_2) = ${at(v)}$ is column $2$, so $E = ${E}$.\n\n**Step 2: Compare with the identity.** ${which[0]} That is $${chosen.op}$.\n\n**Check.** Doing $${chosen.op}$ on $\\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$ gives $${E}$, whose columns are the two drawn arrows.`,
        `**第一步：把箭头读作列。** $T(e_1) = ${at(u)}$ 是第 $1$ 列，$T(e_2) = ${at(v)}$ 是第 $2$ 列，所以 $E = ${E}$。\n\n**第二步：与单位矩阵比较。** ${which[1]}即 $${chosen.op}$。\n\n**检验。** 对 $\\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$ 做 $${chosen.op}$ 得 $${E}$，它的两列正是所画的两个箭头。`,
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
    return reasoned(
      choice,
      others.map((x) => {
        const [p, q, r, s] = x.m;
        return [
          same(x.op)[0],
          `On the identity this gives $${mat(p, q, r, s)}$, whose columns would point to $(${p}, ${r})$ and $(${q}, ${s})$, not to the drawn arrows.`,
          `对单位矩阵做这一变换得 $${mat(p, q, r, s)}$，它的两列应指向 $(${p}, ${r})$ 与 $(${q}, ${s})$，与所画箭头不符。`,
        ] as const;
      }),
    );
  },
);

const furtherDeterminant = point(
  "determinant-rules-from-a-drawn-pair-of-columns",
  ["Determinant rules from a drawn pair of columns", "由所画的两列用行列式性质计算"],
  [
    "The two arrows are the columns of the matrix, so their coordinates give every entry. Read the columns and compute $\\det A = a_{11}a_{22} - a_{12}a_{21}$. Then use $\\det(A^2) = (\\det A)^2$, $\\det(kA) = k^2 \\det A$ for a $2 \\times 2$ matrix, and $\\det(A^{\\mathsf{T}}) = \\det A$. With columns $(1, 1)$ and $(0, 3)$: $\\det A = 3$ and $\\det(2A) = 12$.\n\n> **Watch out.** A scalar comes out once per row, so $\\det(kA) = k^2 \\det A$ and $\\det(-A) = \\det A$ for $2 \\times 2$ matrices. A transpose does not change the determinant.",
    "两个箭头是矩阵的列，所以它们的坐标给出每个元素。读出两列并计算 $\\det A = a_{11}a_{22} - a_{12}a_{21}$。再用 $\\det(A^2) = (\\det A)^2$，$2 \\times 2$ 矩阵的 $\\det(kA) = k^2 \\det A$，以及 $\\det(A^{\\mathsf{T}}) = \\det A$。两列为 $(1, 1)$ 与 $(0, 3)$ 时：$\\det A = 3$，$\\det(2A) = 12$。\n\n> **注意。** 数乘因子每行提出一次，所以对 $2 \\times 2$ 矩阵 $\\det(kA) = k^2 \\det A$，$\\det(-A) = \\det A$。转置不改变行列式。",
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
    const signWhy: Pair =
      kind === "minus"
        ? [
            "Negating a $2 \\times 2$ matrix multiplies the determinant by $(-1)^2 = 1$, so the sign stays.",
            "把 $2 \\times 2$ 矩阵取负，行列式乘以 $(-1)^2 = 1$，符号不变。",
          ]
        : kind === "transpose"
          ? ["A transpose keeps the determinant, sign included.", "转置不改变行列式，符号也不变。"]
          : [
              "The sign is wrong: read the columns in order, $c_1$ first, and keep the sign of $\\det A$.",
              "符号错了：按顺序读列，先 $c_1$，并保留 $\\det A$ 的符号。",
            ];
    return {
      ...numberProblem({
        prompt: t(
          `The arrows show the columns of a $2 \\times 2$ matrix $A$, first column $c_1$ and second column $c_2$. Find $\\det(${name})$.`,
          `箭头表示 $2 \\times 2$ 矩阵 $A$ 的列，第一列 $c_1$，第二列 $c_2$。求 $\\det(${name})$。`,
        ),
        answer,
        mistakes: [
          why(-answer, signWhy[0], signWhy[1]),
          why(
            2 * d,
            kind === "square"
              ? "Squaring the matrix squares the determinant; it does not double it."
              : "No rule here doubles the determinant.",
            kind === "square" ? "矩阵平方使行列式平方，而不是加倍。" : "这里没有哪条规则使行列式加倍。",
          ),
          why(
            k * d,
            `The scalar comes out once for each of the two rows: $${k}^2$, not $${k}$.`,
            `数乘因子对两行各提出一次：是 $${k}^2$，不是 $${k}$。`,
          ),
        ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
        solution: walked(
          [
            [
              ["Read the columns", "读出两列"],
              t(
                `$c_1 = ${at(u)}$ and $c_2 = ${at(v)}$, so $\\det A = ${d}$.`,
                `$c_1 = ${at(u)}$，$c_2 = ${at(v)}$，所以 $\\det A = ${d}$。`,
              ),
            ],
            [["Apply the rule", "应用规则"], t("", ""), [`${rule} = ${answer}`]],
          ],
          t(
            `$\\det A = (${u[0]})(${v[1]}) - (${v[0]})(${u[1]}) = ${d}$, and the rule turns it into $${answer}$.`,
            `$\\det A = (${u[0]})(${v[1]}) - (${v[0]})(${u[1]}) = ${d}$，按规则变为 $${answer}$。`,
          ),
        ),
      }),
      figure: fig(
        4,
        [...arrow(u, "c1"), ...arrow(v, "c2")],
        [`Arrows from the origin: c1 to ${at(u)} and c2 to ${at(v)}.`, `从原点出发的箭头：c1 指向 ${at(u)}，c2 指向 ${at(v)}。`],
      ),
    };
  },
);

const zeroDeterminant = point(
  "the-entry-that-makes-a-determinant-zero-from-a-drawing",
  ["The entry that makes a determinant zero, from a drawing", "由图求使行列式为零的元素"],
  [
    "A $2 \\times 2$ determinant is zero exactly when the columns lie on one line through the origin. Read the drawn column, and require the other to be a multiple of it. If the arrow is $(2, 1)$ and the other column is $(6, x)$, it is $3$ times the arrow, so $x = 3$.\n\n> **Watch out.** The other column must be the same multiple of the arrow in both entries. Find the multiple from the known first entry, then apply it to the second.",
    "$2 \\times 2$ 行列式为零当且仅当两列在过原点的同一条直线上。读出所画的列，并要求另一列是它的倍数。若箭头是 $(2, 1)$，另一列为 $(6, x)$，它是箭头的 $3$ 倍，所以 $x = 3$。\n\n> **注意。** 另一列的两个元素必须是箭头的同一个倍数。先由已知的第一个元素求出倍数，再作用到第二个元素上。",
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
    return {
      ...numberProblem({
        prompt: t(
          `The arrow shows the column $c$ of a matrix, and the other column is $(${c}, x)$. Find $x$ so that the determinant of the matrix is zero.`,
          `箭头表示矩阵的列 $c$，另一列为 $(${c}, x)$。求 $x$，使矩阵的行列式为零。`,
        ),
        answer,
        solveFor: "x",
        mistakes: [
          why(
            -answer,
            "The sign is flipped: both entries of the other column use the same multiple of the arrow.",
            "符号反了：另一列的两个元素用的是箭头的同一个倍数。",
          ),
          why(
            c,
            "That copies the first entry; the second entry must be the same multiple of the arrow's second coordinate.",
            "这照抄了第一个元素；第二个元素必须是箭头第二个坐标的同一倍数。",
          ),
          why(
            u[1],
            "That copies the arrow's second coordinate; the other column is a multiple of the arrow, not equal to it.",
            "这照抄了箭头的第二个坐标；另一列是箭头的倍数，不一定等于它。",
          ),
        ].filter((x, i, all) => x.value !== answer && all.findIndex((o) => o.value === x.value) === i),
        solution: walked(
          [
            [
              ["Read the arrow", "读出箭头"],
              t(`The arrow is $${at(u)}$, so the matrix is $${entries}$.`, `箭头为 $${at(u)}$，所以矩阵为 $${entries}$。`),
            ],
            [
              ["Make the columns parallel", "使两列平行"],
              t(
                `The line has direction $${at(w)}$, and $${c} = ${m}(${w[0]})$, so $x = ${m}(${w[1]}) = ${answer}$.`,
                `该直线方向为 $${at(w)}$，且 $${c} = ${m}(${w[0]})$，所以 $x = ${m}(${w[1]}) = ${answer}$。`,
              ),
            ],
          ],
          t(
            `$(${u[0]})(${answer}) - (${c})(${u[1]}) = ${u[0] * answer} - ${c * u[1] < 0 ? `(${c * u[1]})` : c * u[1]} = 0$.`,
            `$(${u[0]})(${answer}) - (${c})(${u[1]}) = ${u[0] * answer} - ${c * u[1] < 0 ? `(${c * u[1]})` : c * u[1]} = 0$。`,
          ),
        ),
      }),
      figure: fig(7, arrow(u, "c"), [`An arrow from the origin to ${at(u)}.`, `从原点指向 ${at(u)} 的箭头。`]),
    };
  },
);

const dependentPair = point(
  "the-dependent-pair-among-four-arrows",
  ["The dependent pair among four arrows", "四个箭头中线性相关的一对"],
  [
    "Two vectors are linearly dependent exactly when they lie on one line through the origin, in the same direction or in opposite ones. In coordinates, $(a, b)$ and $(c, d)$ are dependent exactly when $ad - bc = 0$. For example, $(2, -1)$ and $(-4, 2)$ are dependent, since $2 \\cdot 2 - (-1)(-4) = 0$, while $(2, -1)$ and $(1, 2)$ are not, since $2 \\cdot 2 - (-1) \\cdot 1 = 5$.\n\n> **Watch out.** Arrows pointing in opposite directions still lie on one line, so they are dependent; two arrows that merely look close in direction are not.",
    "两个向量线性相关当且仅当它们在过原点的同一条直线上，方向可以相同也可以相反。用坐标说，$(a, b)$ 与 $(c, d)$ 线性相关当且仅当 $ad - bc = 0$。例如 $(2, -1)$ 与 $(-4, 2)$ 线性相关，因为 $2 \\cdot 2 - (-1)(-4) = 0$；而 $(2, -1)$ 与 $(1, 2)$ 不相关，因为 $2 \\cdot 2 - (-1) \\cdot 1 = 5$。\n\n> **注意。** 方向相反的箭头仍在同一条直线上，所以线性相关；只是方向看起来接近的两个箭头并不相关。",
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
    const n = (x: number) => (x < 0 ? `(${x})` : `${x}`);
    const det = (x: Point, y: Point) => `${n(x[0])} \\cdot ${n(y[1])} - ${n(x[1])} \\cdot ${n(y[0])} = ${cross(x, y)}`;
    const wrongPairs: [string, Point, string, Point][] = [
      [na, a, nc, c],
      [nb, b, nd, d],
      [nc, c, nd, d],
      [na, a, nd, d],
    ];
    const choice = choose(
      rng,
      ["Which two of the drawn vectors form a linearly dependent set?", "所画向量中哪两个构成线性相关的集合？"],
      pair(na, nb),
      wrongPairs.map(([x, , y]) => pair(x, y)),
      [
        `**Step 1: Read the arrows.** $${na} = ${at(a)}$, $${nb} = ${at(b)}$, $${nc} = ${at(c)}$ and $${nd} = ${at(d)}$.\n\n**Step 2: Find the pair on one line.** $${na} = ${p} ${at(w)}$ and $${nb} = ${n(q)} ${at(w)}$ are both multiples of $${at(w)}$, so they lie on one line through the origin.\n\n**Check.** $${det(a, b)}$, while every other pair has a nonzero determinant.`,
        `**第一步：读出箭头。** $${na} = ${at(a)}$，$${nb} = ${at(b)}$，$${nc} = ${at(c)}$，$${nd} = ${at(d)}$。\n\n**第二步：找出共线的一对。** $${na} = ${p} ${at(w)}$，$${nb} = ${n(q)} ${at(w)}$ 都是 $${at(w)}$ 的倍数，所以它们在过原点的同一条直线上。\n\n**检验。** $${det(a, b)}$，而其他每一对的行列式都不为零。`,
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
    return reasoned(
      choice,
      wrongPairs.map(([x, xv, y, yv]): [string, string, string] => [
        pair(x, y)[0],
        `$${x} = ${at(xv)}$ and $${y} = ${at(yv)}$ have determinant $${det(xv, yv)}$, not $0$, so they point along different lines.`,
        `$${x} = ${at(xv)}$ 与 $${y} = ${at(yv)}$ 的行列式为 $${det(xv, yv)}$，不是 $0$，所以它们在不同的直线上。`,
      ]),
    );
  },
);

const subspaceTest = point(
  "is-the-drawn-set-a-subspace",
  ["Is the drawn set a subspace?", "所画的集合是子空间吗？"],
  [
    "A subset of the plane is a subspace when it contains the origin and is closed under addition and under scalar multiples. The only subspaces of the plane are the origin alone, lines through the origin, and the whole plane. For example, the two axes together contain $(1, 0)$ and $(0, 1)$ but not their sum $(1, 1)$, so their union is not a subspace.\n\n> **Watch out.** Test the zero vector first: a line that misses the origin already fails. A set that contains the origin can still fail closure, so then test a sum and a negative multiple.",
    "平面的子集是子空间，当它包含原点，并对加法和数乘封闭。平面的子空间只有原点本身、过原点的直线和整个平面。例如两条坐标轴的并集含 $(1, 0)$ 和 $(0, 1)$，却不含它们的和 $(1, 1)$，所以不是子空间。\n\n> **注意。** 先检验零向量：不过原点的直线已经不是子空间。含原点的集合仍可能不封闭，这时再检验一个和与一个负倍数。",
  ],
  (rng) => {
    const kind = rng.pick(["line", "offset", "cross", "half"] as const);
    const d = rng.pick(directions);
    const e = rng.pick(directions.filter((v) => cross(v, d) !== 0));
    const yes: Pair = ["Yes, it is a subspace", "是，它是子空间"];
    const zero: Pair = ["No, it does not contain the zero vector", "不是，它不含零向量"];
    const add: Pair = ["No: it contains the zero vector but is not closed under addition", "不是：它含零向量，但对加法不封闭"];
    const scale: Pair = ["No: it contains the zero vector but is not closed under scalar multiples", "不是：它含零向量，但对数乘不封闭"];
    const correct = { line: yes, offset: zero, cross: add, half: scale }[kind];
    const h: Point = [d[1], -d[0]];
    const sum: Point = [d[0] + e[0], d[1] + e[1]];
    const noZero: [string, string] = [
      "The set does not contain the zero vector, so the first claim of this option is false.",
      "这个集合不含零向量，所以这个选项的前半句不成立。",
    ];
    const reasons = {
      line: [
        [zero[0], "The line passes through the origin, so the set does contain the zero vector.", "直线过原点，所以集合含零向量。"],
        [add[0], "Sums of vectors along a line through the origin stay on that line.", "沿过原点直线的向量之和仍在这条直线上。"],
        [scale[0], "Multiples of a vector along a line through the origin stay on that line.", "沿过原点直线的向量的倍数仍在这条直线上。"],
      ],
      offset: [
        [yes[0], "Every subspace contains the zero vector, and this line misses the origin.", "每个子空间都含零向量，而这条直线不过原点。"],
        [add[0], ...noZero],
        [scale[0], ...noZero],
      ],
      cross: [
        [
          yes[0],
          `$${at(d)}$ and $${at(e)}$ are in the set, but their sum $${at(sum)}$ is not.`,
          `$${at(d)}$ 和 $${at(e)}$ 在集合中，但它们的和 $${at(sum)}$ 不在。`,
        ],
        [zero[0], "Both lines pass through the origin, so the set does contain the zero vector.", "两条直线都过原点，所以集合含零向量。"],
        [
          scale[0],
          "A multiple of a vector stays on its own line, so the union is closed under scalar multiples; addition is what fails.",
          "向量的倍数仍在它自己的直线上，所以并集对数乘封闭；不封闭的是加法。",
        ],
      ],
      half: [
        [yes[0], `$${at(h)}$ is in the set, but $-1$ times it is not.`, `$${at(h)}$ 在集合中，但它的 $-1$ 倍不在。`],
        [
          zero[0],
          "The origin lies on the edge, and the edge is included, so the set contains the zero vector.",
          "原点在边界上，而边界包含在内，所以集合含零向量。",
        ],
        [
          add[0],
          "Two vectors on the shaded side add to a vector on that side, so addition is closed; negative multiples are what fail.",
          "阴影一侧的两个向量相加仍在这一侧，所以对加法封闭；不封闭的是负倍数。",
        ],
      ],
    }[kind] as [string, string, string][];
    const finish = (problem: Parameters<typeof reasoned>[0]) => reasoned(problem, reasons);
    if (kind === "line")
      return finish(
        choose(
          rng,
          ["Is the drawn set, the whole line, a subspace of $\\mathbb{R}^2$?", "所画的集合（整条直线）是 $\\mathbb{R}^2$ 的子空间吗？"],
          correct,
          [zero, add, scale],
          [
            `**Step 1: Test the zero vector.** The line passes through the origin, so it contains $(0, 0)$.\n\n**Step 2: Test closure.** Every vector on it is $s${at(d)}$; a sum $s${at(d)} + r${at(d)} = (s + r)${at(d)}$ and a multiple $c \\cdot s${at(d)}$ are again of that form.\n\n**Check.** A line through the origin is one of the three kinds of subspace of the plane, so the answer is yes.`,
            `**第一步：检验零向量。** 直线过原点，所以含 $(0, 0)$。\n\n**第二步：检验封闭性。** 直线上每个向量都是 $s${at(d)}$；和 $s${at(d)} + r${at(d)} = (s + r)${at(d)}$ 与倍数 $c \\cdot s${at(d)}$ 仍是这种形式。\n\n**检验。** 过原点的直线是平面三类子空间之一，所以答案是“是”。`,
          ],
          fig(
            6,
            [{ kind: "line", a: [0, 0], b: d, accent: true }],
            [`A line through the origin with direction ${at(d)}.`, `过原点、方向为 ${at(d)} 的直线。`],
          ),
        ),
      );
    if (kind === "offset") {
      const p = rng.pick(grid(3).filter((v) => cross(v, d) !== 0));
      return finish(
        choose(
          rng,
          ["Is the drawn set, the whole line, a subspace of $\\mathbb{R}^2$?", "所画的集合（整条直线）是 $\\mathbb{R}^2$ 的子空间吗？"],
          correct,
          [yes, add, scale],
          [
            `**Step 1: Read the line.** It passes through $${at(p)}$ with direction $${at(d)}$.\n\n**Step 2: Test the zero vector.** $(0, 0) = ${at(p)} + s${at(d)}$ has no solution, since $${at(p)}$ is not a multiple of $${at(d)}$, so the line misses the origin.\n\n**Check.** Every subspace contains the zero vector, so the line is not a subspace.`,
            `**第一步：读出直线。** 它过 $${at(p)}$，方向为 $${at(d)}$。\n\n**第二步：检验零向量。** $(0, 0) = ${at(p)} + s${at(d)}$ 无解，因为 $${at(p)}$ 不是 $${at(d)}$ 的倍数，所以直线不过原点。\n\n**检验。** 每个子空间都含零向量，所以这条直线不是子空间。`,
          ],
          fig(
            6,
            [{ kind: "line", a: p, b: [p[0] + d[0], p[1] + d[1]], accent: true }],
            [`A line through ${at(p)} with direction ${at(d)} that misses the origin.`, `过 ${at(p)}、方向为 ${at(d)} 且不过原点的直线。`],
          ),
        ),
      );
    }
    if (kind === "cross")
      return finish(
        choose(
          rng,
          [
            "Is the drawn set, the union of both lines, a subspace of $\\mathbb{R}^2$?",
            "所画的集合（两条直线的并集）是 $\\mathbb{R}^2$ 的子空间吗？",
          ],
          correct,
          [yes, zero, scale],
          [
            `**Step 1: Test the zero vector.** Both lines pass through the origin, so the set contains $(0, 0)$.\n\n**Step 2: Test a sum.** $${at(d)}$ and $${at(e)}$ are in the set, but their sum $${at(sum)}$ lies on neither line.\n\n**Check.** Multiples of a vector stay on its own line, so only addition fails.`,
            `**第一步：检验零向量。** 两条直线都过原点，所以集合含 $(0, 0)$。\n\n**第二步：检验一个和。** $${at(d)}$ 和 $${at(e)}$ 在集合中，但它们的和 $${at(sum)}$ 不在任何一条直线上。\n\n**检验。** 向量的倍数仍在它自己的直线上，所以只有加法不封闭。`,
          ],
          fig(
            6,
            [
              { kind: "line", a: [0, 0], b: d, accent: true },
              { kind: "line", a: [0, 0], b: e, accent: true },
            ],
            [`Two lines through the origin, with directions ${at(d)} and ${at(e)}.`, `两条过原点的直线，方向为 ${at(d)} 和 ${at(e)}。`],
          ),
        ),
      );
    return finish(
      choose(
        rng,
        [
          "Is the drawn set, the shaded side including its edge, a subspace of $\\mathbb{R}^2$?",
          "所画的集合（含边界的阴影一侧）是 $\\mathbb{R}^2$ 的子空间吗？",
        ],
        correct,
        [yes, zero, add],
        [
          `**Step 1: Test the zero vector and sums.** The origin is on the included edge, and two vectors on the shaded side add to a vector on that side.\n\n**Step 2: Test a negative multiple.** $${at(h)}$ is on the shaded side, but $-1 \\cdot ${at(h)} = ${at([-h[0], -h[1]])}$ is on the other side.\n\n**Check.** The set fails only closure under scalar multiples.`,
          `**第一步：检验零向量与和。** 原点在包含的边界上，阴影一侧的两个向量相加仍在这一侧。\n\n**第二步：检验负倍数。** $${at(h)}$ 在阴影一侧，但 $-1 \\cdot ${at(h)} = ${at([-h[0], -h[1]])}$ 在另一侧。\n\n**检验。** 这个集合只是对数乘不封闭。`,
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
      ),
    );
  },
);

const changeMatrix = point(
  "the-change-of-coordinates-matrix-from-a-drawn-basis",
  ["The change of coordinates matrix from a drawn basis", "由所画的基写坐标变换矩阵"],
  [
    "The matrix that turns coordinates relative to $\\mathcal{B}$ into standard coordinates has the basis vectors as its columns, in order. For example, with $b_1 = (2, 1)$ and $b_2 = (-1, 3)$ the matrix is $\\begin{pmatrix} 2 & -1 \\\\ 1 & 3 \\end{pmatrix}$, and it sends $(1, 0)$ to $b_1$ and $(0, 1)$ to $b_2$.\n\n> **Watch out.** The basis vectors go in as columns, not rows, and $b_1$ comes first. Read the signs of each arrow's coordinates from the grid.",
    "把相对于 $\\mathcal{B}$ 的坐标变成标准坐标的矩阵，以基向量为列，按顺序排列。例如 $b_1 = (2, 1)$，$b_2 = (-1, 3)$ 时，矩阵为 $\\begin{pmatrix} 2 & -1 \\\\ 1 & 3 \\end{pmatrix}$，它把 $(1, 0)$ 变成 $b_1$，把 $(0, 1)$ 变成 $b_2$。\n\n> **注意。** 基向量作为列而不是行放入，且 $b_1$ 在前。要从网格读准每个箭头坐标的符号。",
  ],
  (rng) => {
    const [u, v] = independent(rng, 4);
    const right = mat(u[0], v[0], u[1], v[1]);
    const choice = choose(
      rng,
      [
        "The arrows show a basis $\\mathcal{B} = (b_1, b_2)$. Which matrix turns coordinates relative to $\\mathcal{B}$ into standard coordinates?",
        "箭头表示基 $\\mathcal{B} = (b_1, b_2)$。哪个矩阵把相对于 $\\mathcal{B}$ 的坐标变成标准坐标？",
      ],
      same(right),
      [
        same(mat(u[0], u[1], v[0], v[1])),
        same(mat(v[0], u[0], v[1], u[1])),
        same(mat(u[0], -v[0], u[1], -v[1])),
        same(mat(-u[0], v[0], -u[1], v[1])),
      ],
      [
        `**Step 1: Read the arrows.** $b_1 = ${at(u)}$ and $b_2 = ${at(v)}$.\n\n**Step 2: Place them as columns.** $b_1$ is the first column and $b_2$ the second, so the matrix is $${right}$.\n\n**Check.** The matrix times $(1, 0)$ is its first column $${at(u)} = b_1$, as it must be, since $[b_1]_{\\mathcal{B}} = (1, 0)$.`,
        `**第一步：读出箭头。** $b_1 = ${at(u)}$，$b_2 = ${at(v)}$。\n\n**第二步：按列放入。** $b_1$ 是第一列，$b_2$ 是第二列，所以矩阵为 $${right}$。\n\n**检验。** 矩阵乘 $(1, 0)$ 得第一列 $${at(u)} = b_1$，正应如此，因为 $[b_1]_{\\mathcal{B}} = (1, 0)$。`,
      ],
      fig(
        5,
        [...arrow(u, "b1"), ...arrow(v, "b2")],
        [`Arrows from the origin: b1 to ${at(u)} and b2 to ${at(v)}.`, `从原点出发的箭头：b1 指向 ${at(u)}，b2 指向 ${at(v)}。`],
      ),
    );
    return reasoned(choice, [
      [
        same(mat(u[0], u[1], v[0], v[1]))[0],
        "The basis vectors were placed as rows; they must be the columns.",
        "基向量被放成了行；它们必须作为列。",
      ],
      [same(mat(v[0], u[0], v[1], u[1]))[0], "The columns are in the wrong order: $b_1$ comes first.", "列的顺序反了：$b_1$ 在前。"],
      [
        same(mat(u[0], -v[0], u[1], -v[1]))[0],
        `The second column is $-b_2$; read $b_2 = ${at(v)}$ with its signs from the grid.`,
        `第二列是 $-b_2$；要从网格按符号读出 $b_2 = ${at(v)}$。`,
      ],
      [
        same(mat(-u[0], v[0], -u[1], v[1]))[0],
        `The first column is $-b_1$; read $b_1 = ${at(u)}$ with its signs from the grid.`,
        `第一列是 $-b_1$；要从网格按符号读出 $b_1 = ${at(u)}$。`,
      ],
    ]);
  },
);

const changeBasis = point(
  "standard-coordinates-from-a-drawn-basis",
  ["Standard coordinates from a drawn basis", "由所画的基求标准坐标"],
  [
    "Coordinates relative to a basis say how much of each basis vector to use. If $[x]_{\\mathcal{B}} = (a, b)$ then $x = a b_1 + b b_2$, so read the basis vectors from the drawing and combine them. For example, with $b_1 = (1, 2)$, $b_2 = (3, -1)$ and $[x]_{\\mathcal{B}} = (2, 1)$, $x = 2(1, 2) + 1(3, -1) = (5, 3)$.\n\n> **Watch out.** The first coordinate weights $b_1$ and the second weights $b_2$; swapping the weights gives a different vector.",
    "相对于一组基的坐标说明每个基向量用多少。若 $[x]_{\\mathcal{B}} = (a, b)$，则 $x = a b_1 + b b_2$，所以从图中读出基向量并组合。例如 $b_1 = (1, 2)$，$b_2 = (3, -1)$，$[x]_{\\mathcal{B}} = (2, 1)$ 时，$x = 2(1, 2) + 1(3, -1) = (5, 3)$。\n\n> **注意。** 第一个坐标是 $b_1$ 的权重，第二个坐标是 $b_2$ 的权重；交换权重会得到另一个向量。",
  ],
  (rng) => {
    const [u, v] = independent(rng, 3);
    const a = rng.pick([-3, -2, -1, 2, 3, 4]);
    const b = rng.pick([-3, -2, -1, 2, 3, 4]);
    const x: Point = [a * u[0] + b * v[0], a * u[1] + b * v[1]];
    const first = rng.bool();
    const i = first ? 0 : 1;
    const name: Pair = first ? ["first", "第一"] : ["second", "第二"];
    const answer = x[i] as number;
    const n = (k: number) => (k < 0 ? `(${k})` : `${k}`);
    const ui = u[i] as number;
    const vi = v[i] as number;
    return {
      ...numberProblem({
        prompt: t(
          `The arrows show a basis $\\mathcal{B} = (b_1, b_2)$, and $[x]_{\\mathcal{B}} = (${a}, ${b})$. Find the ${name[0]} standard coordinate of $x$.`,
          `箭头表示基 $\\mathcal{B} = (b_1, b_2)$，且 $[x]_{\\mathcal{B}} = (${a}, ${b})$。求 $x$ 的${name[1]}个标准坐标。`,
        ),
        answer,
        mistakes: [
          why(
            x[1 - i] as number,
            `That is the ${first ? "second" : "first"} standard coordinate of $x$.`,
            `这是 $x$ 的${first ? "第二" : "第一"}个标准坐标。`,
          ),
          why(
            a * vi + b * ui,
            "The weights are swapped: $a$ goes with $b_1$ and $b$ with $b_2$.",
            "权重交换了：$a$ 对应 $b_1$，$b$ 对应 $b_2$。",
          ),
          why(
            a + b,
            "That adds the weights; each weight must multiply the coordinate of its basis vector.",
            "这是把权重相加；每个权重要乘它所对应基向量的坐标。",
          ),
        ].filter((m, k, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === k),
        solution: walked(
          [
            [["Read the arrows", "读出箭头"], t(`$b_1 = ${at(u)}$ and $b_2 = ${at(v)}$.`, `$b_1 = ${at(u)}$，$b_2 = ${at(v)}$。`)],
            [
              ["Combine", "组合"],
              t(
                `$x = ${a} b_1 + ${n(b)} b_2$, so its ${name[0]} coordinate is:`,
                `$x = ${a} b_1 + ${n(b)} b_2$，所以它的${name[1]}个坐标为：`,
              ),
              [`${a} \\cdot ${n(ui)} + ${n(b)} \\cdot ${n(vi)} = ${answer}`],
            ],
          ],
          t(
            `$x = ${a}${at(u)} + ${n(b)}${at(v)} = ${at(x)}$, whose ${name[0]} coordinate is $${answer}$.`,
            `$x = ${a}${at(u)} + ${n(b)}${at(v)} = ${at(x)}$，它的${name[1]}个坐标是 $${answer}$。`,
          ),
        ),
      }),
      figure: fig(
        4,
        [...arrow(u, "b1"), ...arrow(v, "b2")],
        [`Arrows from the origin: b1 to ${at(u)} and b2 to ${at(v)}.`, `从原点出发的箭头：b1 指向 ${at(u)}，b2 指向 ${at(v)}。`],
      ),
    };
  },
);

const rankNullity = point(
  "nullity-from-a-drawn-image",
  ["Nullity from a drawn image", "由所画的像求零化度"],
  [
    "The rank of $T : \\mathbb{R}^n \\to \\mathbb{R}^2$ is the dimension of its image: $0$ for the origin alone, $1$ for a line through the origin, $2$ for the whole plane. Then rank plus nullity equals $n$. For example, if $T : \\mathbb{R}^5 \\to \\mathbb{R}^2$ has a line as its image, the rank is $1$ and the nullity is $5 - 1 = 4$.\n\n> **Watch out.** Subtract the rank, read from the drawing, from the dimension $n$ of the domain, not from the $2$ of the plane the picture shows.",
    "$T : \\mathbb{R}^n \\to \\mathbb{R}^2$ 的秩是像的维数：只有原点时为 $0$，过原点的直线时为 $1$，整个平面时为 $2$。秩加零化度等于 $n$。例如若 $T : \\mathbb{R}^5 \\to \\mathbb{R}^2$ 的像是一条直线，则秩为 $1$，零化度为 $5 - 1 = 4$。\n\n> **注意。** 要用定义域的维数 $n$ 减去从图中读出的秩，而不是用图中平面的维数 $2$ 去减。",
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
    const answer = n - rank;
    const seen: Pair =
      rank === 0
        ? [
            "Only the origin is marked, so the image is $\\{\\mathbf{0}\\}$, of dimension $0$.",
            "只标出原点，所以像是 $\\{\\mathbf{0}\\}$，维数为 $0$。",
          ]
        : rank === 1
          ? [
              `The image is the line through the origin in direction ${at(d)}, of dimension $1$.`,
              `像是过原点、方向为 ${at(d)} 的直线，维数为 $1$。`,
            ]
          : [
              "The whole plane is shaded, so the image is $\\mathbb{R}^2$, of dimension $2$.",
              "整个平面为阴影，所以像是 $\\mathbb{R}^2$，维数为 $2$。",
            ];
    return {
      ...numberProblem({
        prompt: t(
          `The accented part of the drawing is the image of a linear map $T : \\mathbb{R}^{${n}} \\to \\mathbb{R}^2$. What is the nullity of $T$?`,
          `图中突出显示的部分是线性映射 $T : \\mathbb{R}^{${n}} \\to \\mathbb{R}^2$ 的像。$T$ 的零化度是多少？`,
        ),
        answer,
        form: "integer",
        mistakes: [
          why(
            rank,
            "That is the rank, the dimension of the image; the nullity is what is left of the domain.",
            "这是秩，即像的维数；零化度是定义域剩下的部分。",
          ),
          why(
            n,
            "That is the dimension of the whole domain; subtract the rank shown in the drawing.",
            "这是整个定义域的维数；还要减去图中显示的秩。",
          ),
          why(
            2 - rank,
            "That subtracts from the $2$ of the plane; rank-nullity counts the domain $\\mathbb{R}^n$.",
            "这是用平面的 $2$ 去减；秩-零化度定理数的是定义域 $\\mathbb{R}^n$。",
          ),
          why(n - 2, "The rank is the dimension of the drawn image, not always $2$.", "秩是所画像的维数，不一定是 $2$。"),
        ].filter((m, k, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === k),
        solution: walked(
          [
            [["Read the rank", "读出秩"], t(seen[0], seen[1])],
            [["Apply rank-nullity", "用秩-零化度定理"], t("", ""), [`\\operatorname{null} T = ${n} - ${rank} = ${answer}`]],
          ],
          t(
            `Rank plus nullity is $${rank} + ${answer} = ${n}$, the dimension of the domain.`,
            `秩加零化度为 $${rank} + ${answer} = ${n}$，正是定义域的维数。`,
          ),
        ),
      }),
      figure: fig(
        5,
        marks,
        rank === 0
          ? ["Only the origin is marked.", "只标出原点。"]
          : rank === 1
            ? [`A line through the origin with direction ${at(d)}.`, `过原点、方向为 ${at(d)} 的直线。`]
            : ["The whole plane is shaded.", "整个平面为阴影。"],
      ),
    };
  },
);

const relativeMatrix = point(
  "a-column-of-a-matrix-relative-to-a-drawn-basis",
  ["A column of a matrix relative to a drawn basis", "相对于所画的基的矩阵的一列"],
  [
    "The first column of $[T]_{\\mathcal{B}}$ holds the coordinates of $T(b_1)$ relative to $\\mathcal{B}$, not its standard coordinates. Write $T(b_1)$ as a combination of $b_1$ and $b_2$. For example, with $b_1 = (1, 1)$, $b_2 = (1, -1)$ and $T(b_1) = (3, 1)$, the equations $x + y = 3$ and $x - y = 1$ give $T(b_1) = 2b_1 + b_2$, so the first column is $(2, 1)$.\n\n> **Watch out.** The grid coordinates of the arrow $T(b_1)$ are its standard coordinates. Unless the basis is the standard one, the column is the pair of weights on $b_1$ and $b_2$, in that order.",
    "$[T]_{\\mathcal{B}}$ 的第一列是 $T(b_1)$ 相对于 $\\mathcal{B}$ 的坐标，不是标准坐标。把 $T(b_1)$ 写成 $b_1$ 和 $b_2$ 的组合。例如 $b_1 = (1, 1)$，$b_2 = (1, -1)$，$T(b_1) = (3, 1)$ 时，方程 $x + y = 3$ 与 $x - y = 1$ 给出 $T(b_1) = 2b_1 + b_2$，所以第一列是 $(2, 1)$。\n\n> **注意。** 箭头 $T(b_1)$ 在网格上的坐标是它的标准坐标。除非基是标准基，这一列应是 $b_1$ 与 $b_2$ 上的权重，并按这个顺序排列。",
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
    const n = (x: number) => (x < 0 ? `(${x})` : `${x}`);
    const combine = (x: number, y: number): Point => [x * u[0] + y * v[0], x * u[1] + y * v[1]];
    const wrong: [Point, string, string][] = [
      [[b, a], "The weights are swapped: the first entry is the weight on $b_1$.", "权重对调了：第一个元素是 $b_1$ 上的权重。"],
      [
        image,
        "These are the standard coordinates of $T(b_1)$ read from the grid, not its coordinates relative to $\\mathcal{B}$.",
        "这是从网格读出的 $T(b_1)$ 的标准坐标，而不是它相对于 $\\mathcal{B}$ 的坐标。",
      ],
      [[-a, b], "The weight on $b_1$ has the wrong sign.", "$b_1$ 上的权重符号错了。"],
      [[a, -b], "The weight on $b_2$ has the wrong sign.", "$b_2$ 上的权重符号错了。"],
    ];
    const choice = choose(
      rng,
      [
        "The drawing shows a basis $\\mathcal{B} = (b_1, b_2)$ and the image $T(b_1)$ under a linear map $T$. What is the first column of $[T]_{\\mathcal{B}}$?",
        "图中是基 $\\mathcal{B} = (b_1, b_2)$ 以及线性映射 $T$ 下的像 $T(b_1)$。$[T]_{\\mathcal{B}}$ 的第一列是什么？",
      ],
      same(col(a, b)),
      wrong.map(([c]) => same(col(c[0], c[1]))),
      [
        `**Step 1: Read the arrows.** $b_1 = ${at(u)}$, $b_2 = ${at(v)}$ and $T(b_1) = ${at(image)}$.\n\n**Step 2: Write $T(b_1)$ in the basis.** Solving $x b_1 + y b_2 = ${at(image)}$ gives $x = ${a}$ and $y = ${b}$, so the coordinates relative to $\\mathcal{B}$ are $(${a}, ${b})$.\n\n**Check.** $${a} ${at(u)} + ${n(b)} ${at(v)} = ${at(image)}$, the drawn image.`,
        `**第一步：读出箭头。** $b_1 = ${at(u)}$，$b_2 = ${at(v)}$，$T(b_1) = ${at(image)}$。\n\n**第二步：用基表示 $T(b_1)$。** 解 $x b_1 + y b_2 = ${at(image)}$ 得 $x = ${a}$，$y = ${b}$，所以相对于 $\\mathcal{B}$ 的坐标为 $(${a}, ${b})$。\n\n**检验。** $${a} ${at(u)} + ${n(b)} ${at(v)} = ${at(image)}$，正是图中的像。`,
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
    return reasoned(
      choice,
      wrong.map(([c, en, zh]): [string, string, string] => {
        const o = combine(c[0], c[1]);
        return [
          same(col(c[0], c[1]))[0],
          `${en} These weights give $${n(c[0])} b_1 + ${n(c[1])} b_2 = ${at(o)}$, not $${at(image)}$.`,
          `${zh}这组权重给出 $${n(c[0])} b_1 + ${n(c[1])} b_2 = ${at(o)}$，而不是 $${at(image)}$。`,
        ];
      }),
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
    "Each eigenvalue is the factor between a vector and its image. The characteristic equation of a $2 \\times 2$ matrix is $(\\lambda - \\lambda_1)(\\lambda - \\lambda_2) = 0$, whose coefficients are the trace and the determinant. For example, if the drawing shows $Av = 2v$ and $Aw = -w$, the equation is $(\\lambda - 2)(\\lambda + 1) = \\lambda^2 - \\lambda - 2 = 0$.\n\n> **Watch out.** The middle coefficient is minus the trace, and the constant term is plus the determinant. Check by putting each eigenvalue into the equation.",
    "每个特征值是向量与其像之间的倍数。$2 \\times 2$ 矩阵的特征方程是 $(\\lambda - \\lambda_1)(\\lambda - \\lambda_2) = 0$，其系数是迹和行列式。例如图中 $Av = 2v$，$Aw = -w$ 时，特征方程是 $(\\lambda - 2)(\\lambda + 1) = \\lambda^2 - \\lambda - 2 = 0$。\n\n> **注意。** 一次项系数是迹的相反数，常数项是行列式本身。把每个特征值代入方程来检验。",
  ],
  (rng) => {
    const { l1, l2, figure } = eigenPicture(rng);
    const tr = l1 + l2;
    const det = l1 * l2;
    const n = (x: number) => (x < 0 ? `(${x})` : `${x}`);
    const wrong: [string, string, string][] = [
      [
        characteristic(-tr, det),
        "The middle coefficient has the wrong sign: it is minus the trace.",
        "一次项系数的符号错了：它是迹的相反数。",
      ],
      [
        characteristic(tr, -det),
        "The constant term has the wrong sign: it is the determinant itself.",
        "常数项的符号错了：它就是行列式本身。",
      ],
      [characteristic(det, tr), "The trace and the determinant are swapped.", "迹与行列式对调了。"],
      [
        characteristic(-tr, -det),
        "Both signs are wrong: the equation is $\\lambda^2 - (\\text{trace})\\lambda + \\det = 0$.",
        "两个符号都错了：方程是 $\\lambda^2 - (\\text{迹})\\lambda + \\det = 0$。",
      ],
    ];
    const choice = choose(
      rng,
      [
        "The drawing shows eigenvectors $v$ and $w$ of a $2 \\times 2$ matrix $A$ with their images. What is the characteristic equation of $A$?",
        "图中是 $2 \\times 2$ 矩阵 $A$ 的特征向量 $v$ 和 $w$ 及其像。$A$ 的特征方程是什么？",
      ],
      same(characteristic(tr, det)),
      wrong.map(([e]) => same(e)),
      [
        `**Step 1: Read the eigenvalues.** $Av$ is $${l1}$ times $v$ and $Aw$ is $${l2}$ times $w$, so the eigenvalues are $${l1}$ and $${l2}$.\n\n**Step 2: Use the trace and the determinant.** Their sum is $${tr}$ and their product is $${det}$, so the equation is $${characteristic(tr, det)}$.\n\n**Check.** $${n(l1)}^2 - ${n(tr)} \\cdot ${n(l1)} + ${n(det)} = 0$ and $${n(l2)}^2 - ${n(tr)} \\cdot ${n(l2)} + ${n(det)} = 0$.`,
        `**第一步：读出特征值。** $Av$ 是 $v$ 的 $${l1}$ 倍，$Aw$ 是 $w$ 的 $${l2}$ 倍，所以特征值为 $${l1}$ 和 $${l2}$。\n\n**第二步：用迹和行列式。** 它们的和为 $${tr}$，积为 $${det}$，所以特征方程是 $${characteristic(tr, det)}$。\n\n**检验。** $${n(l1)}^2 - ${n(tr)} \\cdot ${n(l1)} + ${n(det)} = 0$，$${n(l2)}^2 - ${n(tr)} \\cdot ${n(l2)} + ${n(det)} = 0$。`,
      ],
      figure,
    );
    return reasoned(
      choice,
      wrong.map(([e, en, zh]): [string, string, string] => [same(e)[0], en, zh]),
    );
  },
);

const powersOnEigen = point(
  "a-power-of-a-matrix-through-drawn-eigenvectors",
  ["A power of a matrix through drawn eigenvectors", "通过所画的特征向量求矩阵的幂"],
  [
    "On an eigenvector, $A^k$ multiplies by $\\lambda^k$. Split a vector into eigenvectors and apply $A^k$ to each piece. This is what diagonalization does. For example, if $Av = 2v$ and $Aw = -w$, then $A^2(v + w) = 4v + w$.\n\n> **Watch out.** Raise each eigenvalue to the power $k$; do not multiply it by $k$. Read each eigenvalue from its own arrow: the image of $v$ is $\\lambda v$, so compare lengths and directions.",
    "在特征向量上，$A^k$ 乘以 $\\lambda^k$。把向量分解成特征向量，再分别作用 $A^k$。这正是对角化所做的。例如若 $Av = 2v$，$Aw = -w$，则 $A^2(v + w) = 4v + w$。\n\n> **注意。** 要把每个特征值取 $k$ 次方，而不是乘以 $k$。每个特征值从它自己的箭头读出：$v$ 的像是 $\\lambda v$，比较长度和方向即可。",
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
    const ca = a * l1 ** k;
    const cb = b * l2 ** k;
    const p = (x: number) => (x < 0 ? `(${x})` : `${x}`);
    const chain = (c: number, l: number) => Array.from({ length: k + 1 }, (_, j) => c * l ** j).join(" \\to ");
    return {
      ...numberProblem({
        prompt: t(
          `The drawing shows eigenvectors $v$ and $w$ of a matrix $A$ with their images. Find the ${name[0]} coordinate of $A^{${k}}(${combo})$.`,
          `图中是矩阵 $A$ 的特征向量 $v$ 和 $w$ 及其像。求 $A^{${k}}(${combo})$ 的${name[1]}个坐标。`,
        ),
        answer,
        form: "integer",
        mistakes: [
          why(
            coordinate(l1, l2),
            `That applies $A$ once; $A^{${k}}$ multiplies by $\\lambda^{${k}}$.`,
            `这只作用了一次 $A$；$A^{${k}}$ 乘以 $\\lambda^{${k}}$。`,
          ),
          why(
            coordinate(l1 * k, l2 * k),
            `Raise each eigenvalue to the power ${k}; do not multiply it by ${k}.`,
            `要把每个特征值取 ${k} 次方，而不是乘以 ${k}。`,
          ),
          why(
            coordinate(l2 ** k, l1 ** k),
            "The eigenvalues are swapped: read each one from its own arrow.",
            "特征值交换了：每个特征值要从它自己的箭头读出。",
          ),
          why(
            l1 ** k * (v1[i] as number) + l2 ** k * (v2[i] as number),
            `The weights ${a} on $v$ and ${b} on $w$ are left out.`,
            `漏掉了 $v$ 上的权重 ${a} 和 $w$ 上的权重 ${b}。`,
          ),
          why(
            coordinate(1, 1),
            `That is the coordinate of $${combo}$ itself, before $A^{${k}}$ acts.`,
            `这是 $${combo}$ 本身的坐标，还没有作用 $A^{${k}}$。`,
          ),
        ].filter((m, j, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === j),
        solution: walked(
          [
            [
              ["Read the eigenvalues", "读出特征值"],
              t(
                `$Av$ is $${l1}$ times $v = ${at(v1)}$ and $Aw$ is $${l2}$ times $w = ${at(v2)}$, so the eigenvalues are $${l1}$ and $${l2}$.`,
                `$Av$ 是 $v = ${at(v1)}$ 的 $${l1}$ 倍，$Aw$ 是 $w = ${at(v2)}$ 的 $${l2}$ 倍，所以特征值为 $${l1}$ 和 $${l2}$。`,
              ),
            ],
            [
              ["Apply the power to each piece", "对每一部分作用幂"],
              t("", ""),
              [
                `A^{${k}}(${combo}) = ${a} \\cdot ${p(l1)}^{${k}}v + ${p(b)} \\cdot ${p(l2)}^{${k}}w = ${ca}v ${cb < 0 ? "-" : "+"} ${Math.abs(cb)}w`,
              ],
            ],
            [
              ["Take the coordinate", "取坐标"],
              t(
                `The ${name[0]} coordinates of $v$ and $w$ are $${v1[i]}$ and $${v2[i]}$:`,
                `$v$ 和 $w$ 的${name[1]}个坐标是 $${v1[i]}$ 和 $${v2[i]}$：`,
              ),
              [`${p(ca)} \\cdot ${p(v1[i] as number)} + ${p(cb)} \\cdot ${p(v2[i] as number)} = ${answer}`],
            ],
          ],
          t(
            `Applying $A$ one step at a time multiplies the weight on $v$ by $${l1}$ and the weight on $w$ by $${l2}$: $${chain(a, l1)}$ and $${chain(b, l2)}$.`,
            `逐次作用 $A$，$v$ 上的权重每次乘以 $${l1}$，$w$ 上的权重每次乘以 $${l2}$：$${chain(a, l1)}$ 与 $${chain(b, l2)}$。`,
          ),
        ),
      }),
      figure,
    };
  },
);

/** spin picks the image (a, b) of e1 under a rotation-scaling matrix. */
function spin(rng: Rng): Point {
  const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
  const b = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4].filter((v) => Math.abs(v) !== Math.abs(a)));
  return [a, b];
}

const complexEigen = {
  ...point(
    "complex-eigenvalues-from-a-drawn-rotation-scaling",
    ["Complex eigenvalues from a drawn rotation-scaling", "由所画的旋转伸缩读复特征值"],
    [
      "A matrix $\\begin{pmatrix} a & -b \\\\ b & a \\end{pmatrix}$ sends $e_1$ to $(a, b)$ and $e_2$ to $(-b, a)$, which rotates and scales the plane, so it has no real eigenvector. Its eigenvalues are $a \\pm bi$. For example, if $e_1$ goes to $(2, 3)$ and $e_2$ to $(-3, 2)$, the eigenvalues are $2 \\pm 3i$.\n\n> **Watch out.** Read $a$ and $b$ from the image of $e_1$, not of $e_2$. The real part is the first coordinate $a$, and the imaginary part is the second coordinate $b$, not $a^2 + b^2$.",
      "矩阵 $\\begin{pmatrix} a & -b \\\\ b & a \\end{pmatrix}$ 把 $e_1$ 映到 $(a, b)$，把 $e_2$ 映到 $(-b, a)$，这是对平面的旋转加缩放，所以没有实特征向量。它的特征值是 $a \\pm bi$。例如 $e_1$ 映到 $(2, 3)$，$e_2$ 映到 $(-3, 2)$ 时，特征值为 $2 \\pm 3i$。\n\n> **注意。** $a$ 和 $b$ 要从 $e_1$ 的像读出，而不是 $e_2$ 的像。实部是第一个坐标 $a$，虚部是第二个坐标 $b$，而不是 $a^2 + b^2$。",
    ],
    (rng) => {
      const [a, b] = spin(rng);
      const size = (v: number) => (Math.abs(v) === 1 ? "" : Math.abs(v));
      const answer = (x: number, y: number) => `${x} \\pm ${size(y)}i`;
      return reasoned(
        choose(
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
        ),
        [
          [
            same(answer(b, a))[0],
            "The two parts are swapped: the real part is the first coordinate of $T(e_1)$.",
            "两部分交换了：实部是 $T(e_1)$ 的第一个坐标。",
          ],
          [
            same(answer(-a, b))[0],
            "The real part has the wrong sign: it is the first coordinate of $T(e_1)$ as drawn.",
            "实部的符号错了：它就是图中 $T(e_1)$ 的第一个坐标。",
          ],
          [
            same(answer(-b, a))[0],
            "That reads the image of $e_2$; $a$ and $b$ come from the image of $e_1$.",
            "这读的是 $e_2$ 的像；$a$ 和 $b$ 来自 $e_1$ 的像。",
          ],
          [
            same(answer(a * a + b * b, 1))[0],
            `$${a * a + b * b}$ is the determinant $a^2 + b^2$, the product of the eigenvalues, not their real part.`,
            `$${a * a + b * b}$ 是行列式 $a^2 + b^2$，即特征值之积，而不是实部。`,
          ],
        ],
      );
    },
  ),
  figure: linearAlgebraDrawings1["finding-complex-eigenvalues-of-real-2x2-matrices#complex-eigenvalues-from-a-drawn-rotation-scaling"],
};

const rotationScale = {
  ...point(
    "the-rotation-scaling-form-from-a-drawn-image",
    ["The rotation-scaling form from a drawn image", "由所画的像写旋转伸缩形式"],
    [
      "A rotation-scaling matrix is determined by the image of $e_1$: if that image is $(a, b)$, the first column is $(a, b)$ and the second is the same vector turned by a quarter turn counterclockwise, $(-b, a)$. For example, if $e_1$ goes to $(3, 1)$, then $e_2$ goes to $(-1, 3)$ and the matrix has rows $(3, -1)$ and $(1, 3)$.\n\n> **Watch out.** Turn counterclockwise: $(a, b)$ becomes $(-b, a)$. The clockwise turn $(b, -a)$ gives a reflection, and writing the arrow as the first row instead of the first column gives the opposite rotation.",
      "旋转伸缩矩阵由 $e_1$ 的像决定：如果这个像是 $(a, b)$，第一列就是 $(a, b)$，第二列是同一向量逆时针转四分之一圈，即 $(-b, a)$。例如 $e_1$ 映到 $(3, 1)$ 时，$e_2$ 映到 $(-1, 3)$，矩阵的行为 $(3, -1)$ 和 $(1, 3)$。\n\n> **注意。** 要逆时针转：$(a, b)$ 变为 $(-b, a)$。顺时针转得到的 $(b, -a)$ 会给出反射；把箭头写成第一行而不是第一列，会得到反方向的旋转。",
    ],
    (rng) => {
      const [a, b] = spin(rng);
      return reasoned(
        choose(
          rng,
          [
            "A linear map rotates and scales the plane, without reflecting it, and the arrow shows the image of $e_1$. Which matrix is it?",
            "一个线性映射对平面做旋转和伸缩，没有反射，箭头表示 $e_1$ 的像。它是哪个矩阵？",
          ],
          same(mat(a, -b, b, a)),
          [same(mat(a, b, -b, a)), same(mat(a, b, b, a)), same(mat(a, b, b, -a)), same(mat(b, -a, a, b))],
          [
            `**Step 1: Write the first column.** The first column is the arrow, $${at([a, b])}$.\n\n**Step 2: Turn it a quarter turn.** Turning $(a, b)$ a quarter turn counterclockwise gives $(-b, a) = (${-b}, ${a})$, the second column, so the matrix is $${mat(a, -b, b, a)}$.\n\n**Check.** Both columns have squared length $${a * a + b * b}$, and their dot product is $${a} \\cdot ${-b < 0 ? `(${-b})` : -b} + ${b < 0 ? `(${b})` : b} \\cdot ${a < 0 ? `(${a})` : a} = 0$; the determinant $${a * a + b * b}$ is positive, so there is no reflection.`,
            `**第一步：写出第一列。** 第一列就是箭头 $${at([a, b])}$。\n\n**第二步：转四分之一圈。** 把 $(a, b)$ 逆时针转四分之一圈得 $(-b, a) = (${-b}, ${a})$，即第二列，所以矩阵是 $${mat(a, -b, b, a)}$。\n\n**检验。** 两列长度的平方都是 $${a * a + b * b}$，点积为 $${a} \\cdot ${-b < 0 ? `(${-b})` : -b} + ${b < 0 ? `(${b})` : b} \\cdot ${a < 0 ? `(${a})` : a} = 0$；行列式 $${a * a + b * b}$ 为正，所以没有反射。`,
          ],
          fig(5, arrow([a, b], "T(e1)"), [`An arrow from the origin to ${at([a, b])}.`, `从原点指向 ${at([a, b])} 的箭头。`]),
        ),
        [
          [
            same(mat(a, b, -b, a))[0],
            "The arrow is written as the first row; it belongs in the first column, which turns the rotation the wrong way.",
            "箭头被写成了第一行；它应当是第一列，写成行会使旋转方向相反。",
          ],
          [
            same(mat(a, b, b, a))[0],
            "The second column $(b, a)$ is not a quarter turn of $(a, b)$; this matrix does not rotate the plane.",
            "第二列 $(b, a)$ 不是 $(a, b)$ 转四分之一圈的结果；这个矩阵不旋转平面。",
          ],
          [
            same(mat(a, b, b, -a))[0],
            "The second column $(b, -a)$ is the clockwise turn; the determinant is negative, so this map reflects the plane.",
            "第二列 $(b, -a)$ 是顺时针转的结果；行列式为负，所以这个映射反射平面。",
          ],
          [
            same(mat(b, -a, a, b))[0],
            "The coordinates of the arrow are swapped: its first coordinate is the top entry of the first column.",
            "箭头的坐标交换了：它的第一个坐标是第一列的上方元素。",
          ],
        ],
      );
    },
  ),
  figure: linearAlgebraDrawings1["reducing-real-2x2-matrices-to-rotation-scaling-form#the-rotation-scaling-form-from-a-drawn-image"],
};

const dotFromArrows = {
  ...point(
    "the-dot-product-of-two-drawn-arrows",
    ["The dot product of two drawn arrows", "两个所画箭头的点积"],
    [
      "Read the coordinates of each arrow, multiply matching coordinates and add. The sign agrees with the angle: positive when it is acute, negative when it is obtuse, zero when it is right. For example, arrows to $(3, 1)$ and $(-1, 2)$ give $(3)(-1) + (1)(2) = -1$, a slightly obtuse angle.\n\n> **Watch out.** Multiply first coordinate with first coordinate and second with second; pairing them crosswise gives a different number. Read the signs of the coordinates from the side of the axis each tip lies on.",
      "读出每个箭头的坐标，对应坐标相乘再相加。符号与夹角一致：锐角为正，钝角为负，直角为零。例如指向 $(3, 1)$ 与 $(-1, 2)$ 的箭头给出 $(3)(-1) + (1)(2) = -1$，夹角略大于直角。\n\n> **注意。** 第一个坐标乘第一个坐标，第二个乘第二个；交叉配对会得到另一个数。坐标的符号要根据箭头尖端在坐标轴哪一侧来读。",
    ],
    (rng) => {
      const [u, v] = independent(rng, 5);
      const answer = dot(u, v);
      const p = (x: number) => (x < 0 ? `(${x})` : `${x}`);
      const angle: Pair = answer > 0 ? ["acute", "锐角"] : answer < 0 ? ["obtuse", "钝角"] : ["right", "直角"];
      return {
        ...numberProblem({
          prompt: t("Find $u \\cdot v$ for the drawn vectors.", "求所画向量的点积 $u \\cdot v$。"),
          answer,
          mistakes: [
            why(-answer, "The sign is flipped; check the signs of the coordinates you read.", "符号反了；检查读出的坐标的符号。"),
            why(
              cross(u, v),
              "That is $u_1v_2 - u_2v_1$, the determinant, not the dot product.",
              "这是 $u_1v_2 - u_2v_1$，即行列式，不是点积。",
            ),
            why(
              u[0] * v[1] + u[1] * v[0],
              "The coordinates are paired crosswise; multiply first with first and second with second.",
              "坐标交叉配对了；应当第一个乘第一个，第二个乘第二个。",
            ),
          ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
          solution: walked(
            [
              [["Read the arrows", "读出箭头"], t(`$u = ${at(u)}$ and $v = ${at(v)}$.`, `$u = ${at(u)}$，$v = ${at(v)}$。`)],
              [
                ["Multiply and add", "相乘再相加"],
                t("", ""),
                [`u \\cdot v = ${p(u[0])} \\cdot ${p(v[0])} + ${p(u[1])} \\cdot ${p(v[1])} = ${answer}`],
              ],
            ],
            t(
              `The sign agrees with the picture: the angle between the arrows is ${angle[0]}, and the dot product is ${answer > 0 ? "positive" : answer < 0 ? "negative" : "zero"}.`,
              `符号与图一致：两个箭头的夹角是${angle[1]}，点积${answer > 0 ? "为正" : answer < 0 ? "为负" : "为零"}。`,
            ),
          ),
        }),
        figure: fig(
          6,
          [...arrow(u, "u"), ...arrow(v, "v")],
          [`Arrows from the origin: u to ${at(u)} and v to ${at(v)}.`, `从原点出发的箭头：u 指向 ${at(u)}，v 指向 ${at(v)}。`],
        ),
      };
    },
  ),
  figure: linearAlgebraDrawings2["dot-product-in-n-dimensional-euclidean-space#the-dot-product-of-two-drawn-arrows"],
};

const normOfDifference = point(
  "the-distance-between-the-tips-of-two-arrows",
  ["The distance between the tips of two arrows", "两箭头尖端之间的距离"],
  [
    "The distance between the tips of $u$ and $v$ is the norm $\\lVert u - v \\rVert$, not the difference of the two norms. For example, tips at $(4, 1)$ and $(1, -3)$ give $u - v = (3, 4)$ and $\\lVert u - v \\rVert = \\sqrt{9 + 16} = 5$.\n\n> **Watch out.** Subtract the vectors first and take the norm last. The answer is a length, so take the square root of the sum of squares.",
    "$u$ 和 $v$ 的尖端之间的距离是范数 $\\lVert u - v \\rVert$，不是两个范数之差。例如尖端在 $(4, 1)$ 与 $(1, -3)$ 时，$u - v = (3, 4)$，$\\lVert u - v \\rVert = \\sqrt{9 + 16} = 5$。\n\n> **注意。** 先把向量相减，最后再取范数。答案是长度，所以要对平方和开平方。",
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
    return {
      ...numberProblem({
        prompt: t("Find $\\lVert u - v \\rVert$ for the drawn vectors.", "求所画向量的 $\\lVert u - v \\rVert$。"),
        answer: r,
        mistakes: [
          why(r * r, "That is $\\lVert u - v \\rVert^2$; take the square root.", "这是 $\\lVert u - v \\rVert^2$；还要开平方。"),
          why(
            p + q,
            "That adds the sizes of the coordinate differences; square them, add and take the root.",
            "这是把坐标差的绝对值相加；要平方、相加再开方。",
          ),
          why(
            Math.abs(p - q),
            "That subtracts the sizes of the coordinate differences; square them, add and take the root.",
            "这是把坐标差的绝对值相减；要平方、相加再开方。",
          ),
        ].filter((w, i, all) => w.value !== r && all.findIndex((o) => o.value === w.value) === i),
        solution: walked(
          [
            [["Read the arrows", "读出箭头"], t(`$u = ${at(a)}$ and $v = ${at(b)}$.`, `$u = ${at(a)}$，$v = ${at(b)}$。`)],
            [["Subtract", "相减"], t("", ""), [`u - v = ${at(a)} - ${at(b)} = (${dx}, ${dy})`]],
            [
              ["Take the norm", "取范数"],
              t("", ""),
              [`\\lVert u - v \\rVert = \\sqrt{${dx < 0 ? `(${dx})` : dx}^2 + ${dy < 0 ? `(${dy})` : dy}^2} = \\sqrt{${r * r}} = ${r}`],
            ],
          ],
          t(
            `Going from the tip of $v$ by $${dx}$ across and $${dy}$ up lands on the tip of $u$: $(${bx} + ${dx < 0 ? `(${dx})` : dx}, ${by} + ${dy < 0 ? `(${dy})` : dy}) = ${at(a)}$.`,
            `从 $v$ 的尖端横向走 $${dx}$、纵向走 $${dy}$ 就到达 $u$ 的尖端：$(${bx} + ${dx < 0 ? `(${dx})` : dx}, ${by} + ${dy < 0 ? `(${dy})` : dy}) = ${at(a)}$。`,
          ),
        ),
      }),
      figure: drawn(
        { xMin: -10, xMax: 10, yMin: -10, yMax: 10, labelEvery: 2 },
        [...arrow(a, "u"), ...arrow(b, "v")],
        t(`Arrows from the origin: u to ${at(a)} and v to ${at(b)}.`, `从原点出发的箭头：u 指向 ${at(a)}，v 指向 ${at(b)}。`),
      ),
    };
  },
);

const complementVector = point(
  "a-vector-of-the-orthogonal-complement-of-a-drawn-line",
  ["A vector of the orthogonal complement of a drawn line", "所画直线的正交补中的向量"],
  [
    "The orthogonal complement of a line through the origin holds every vector whose dot product with a direction of the line is zero. For example, if the line passes through $(2, 1)$, then $(-1, 2)$ is in $L^{\\perp}$, since $(2)(-1) + (1)(2) = 0$, and so is every multiple of it.\n\n> **Watch out.** Swapping the two coordinates is not enough; one of them must also change sign. A vector along the line itself is never in $L^{\\perp}$.",
    "过原点直线的正交补包含所有与直线方向点积为零的向量。例如直线经过 $(2, 1)$ 时，$(-1, 2)$ 在 $L^{\\perp}$ 中，因为 $(2)(-1) + (1)(2) = 0$，它的每个倍数也在。\n\n> **注意。** 只交换两个坐标还不够；其中一个还必须变号。沿直线本身的向量永远不在 $L^{\\perp}$ 中。",
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
    const p = (x: number) => (x < 0 ? `(${x})` : `${x}`);
    const reasons = tries
      .map((v, i): [string, string, string] => [
        same(col(v[0], v[1]))[0],
        i === 0
          ? `This vector lies along $L$ itself; its dot product with $${at(d)}$ is $${dot(v, d)}$.`
          : i === 1
            ? `The coordinates are swapped but no sign is changed, so the dot product with $${at(d)}$ is $${dot(v, d)}$, not $0$.`
            : `Its dot product with the direction $${at(d)}$ is $${dot(v, d)}$, not $0$.`,
        i === 0
          ? `这个向量就在 $L$ 上；它与 $${at(d)}$ 的点积为 $${dot(v, d)}$。`
          : i === 1
            ? `坐标交换了但没有变号，所以它与 $${at(d)}$ 的点积为 $${dot(v, d)}$，不是 $0$。`
            : `它与方向 $${at(d)}$ 的点积为 $${dot(v, d)}$，不是 $0$。`,
      ])
      .filter((_, i) => dot(tries[i] as Point, d) !== 0);
    return reasoned(
      choose(
        rng,
        [
          "$L$ is the drawn line through the origin. Which vector lies in $L^{\\perp}$?",
          "$L$ 是所画的过原点的直线。哪个向量在 $L^{\\perp}$ 中？",
        ],
        same(col(answer[0], answer[1])),
        tries.filter((v) => dot(v, d) !== 0).map((v) => same(col(v[0], v[1]))),
        [
          `**Step 1: Read a direction of the line.** The line passes through the marked point $${at(d)}$, so $${at(d)}$ is a direction of $L$.\n\n**Step 2: Test the dot product.** $${at(answer)} \\cdot ${at(d)} = ${p(answer[0])} \\cdot ${p(d[0])} + ${p(answer[1])} \\cdot ${p(d[1])} = 0$, so $${at(answer)}$ is in $L^{\\perp}$.\n\n**Check.** The second marked point $${at(tip)}$ gives $${at(answer)} \\cdot ${at(tip)} = 0$ as well, as it must for every point of $L$.`,
          `**第一步：读出直线的方向。** 直线经过标出的点 $${at(d)}$，所以 $${at(d)}$ 是 $L$ 的方向。\n\n**第二步：检验点积。** $${at(answer)} \\cdot ${at(d)} = ${p(answer[0])} \\cdot ${p(d[0])} + ${p(answer[1])} \\cdot ${p(d[1])} = 0$，所以 $${at(answer)}$ 在 $L^{\\perp}$ 中。\n\n**检验。** 第二个标出的点 $${at(tip)}$ 同样给出 $${at(answer)} \\cdot ${at(tip)} = 0$，$L$ 上每个点都应如此。`,
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
      ),
      reasons,
    );
  },
);

const componentsOrthogonal = {
  ...point(
    "a-coordinate-relative-to-a-drawn-orthogonal-basis",
    ["A coordinate relative to a drawn orthogonal basis", "相对于所画正交基的坐标"],
    [
      "When the basis vectors are perpendicular, the coordinate along $b_i$ is $\\frac{w \\cdot b_i}{b_i \\cdot b_i}$, and no system has to be solved. For example, with $b_1 = (1, 1)$, $b_2 = (-1, 1)$ and $w = (3, 1)$, $c_1 = \\frac{4}{2} = 2$ and $c_2 = \\frac{-2}{2} = -1$, and indeed $2(1, 1) - (-1, 1) = (3, 1)$.\n\n> **Watch out.** Divide by $b_i \\cdot b_i$, the squared length of the basis vector, not by $w \\cdot w$; and dot $w$ with the basis vector whose coordinate is asked for.",
      "当基向量互相垂直时，沿 $b_i$ 的坐标是 $\\frac{w \\cdot b_i}{b_i \\cdot b_i}$，无需解方程组。例如 $b_1 = (1, 1)$，$b_2 = (-1, 1)$，$w = (3, 1)$ 时，$c_1 = \\frac{4}{2} = 2$，$c_2 = \\frac{-2}{2} = -1$，确实 $2(1, 1) - (-1, 1) = (3, 1)$。\n\n> **注意。** 要除以基向量长度的平方 $b_i \\cdot b_i$，而不是 $w \\cdot w$；并且要用所求坐标对应的那个基向量与 $w$ 作点积。",
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
      const answer = Q.of(top, bottom);
      const rest = Q.of(dot(w, other), dot(other, other));
      const [me, them] = first ? [1, 2] : [2, 1];
      const paren = (x: Q) => (x.sign() < 0 ? `\\left(${x.toLatex()}\\right)` : x.toLatex());
      return {
        ...numberProblem({
          prompt: t(
            `The arrows show an orthogonal basis $(b_1, b_2)$ and a vector $w = c_1 b_1 + c_2 b_2$. Find $c_${me}$.`,
            `箭头表示正交基 $(b_1, b_2)$ 和向量 $w = c_1 b_1 + c_2 b_2$。求 $c_${me}$。`,
          ),
          answer,
          mistakes: [
            why(
              top,
              `That is $w \\cdot b_${me}$ itself; it still has to be divided by $b_${me} \\cdot b_${me} = ${bottom}$.`,
              `这是 $w \\cdot b_${me}$ 本身；还要除以 $b_${me} \\cdot b_${me} = ${bottom}$。`,
            ),
            why(
              rest,
              `That is the coordinate $c_${them}$ along the other basis vector $b_${them}$.`,
              `这是沿另一个基向量 $b_${them}$ 的坐标 $c_${them}$。`,
            ),
            ...(top === 0
              ? []
              : [why(Q.of(bottom, top), "The fraction is upside down: the dot product goes on top.", "分数上下颠倒了：点积应在分子上。")]),
            why(
              Q.of(top, dot(w, w)),
              `That divides by $w \\cdot w = ${dot(w, w)}$; the divisor is the squared length of $b_${me}$.`,
              `这是除以了 $w \\cdot w = ${dot(w, w)}$；除数应是 $b_${me}$ 长度的平方。`,
            ),
          ].filter((m, i, all) => String(m.value) !== String(answer) && all.findIndex((o) => String(o.value) === String(m.value)) === i),
          solution: walked(
            [
              [
                ["Read the arrows", "读出箭头"],
                t(
                  `$w = ${at(w)}$ and $b_${me} = ${at(b)}$; the basis is orthogonal, so dotting with $b_${me}$ removes the $b_${them}$ term.`,
                  `$w = ${at(w)}$，$b_${me} = ${at(b)}$；基是正交的，所以与 $b_${me}$ 作点积会消去 $b_${them}$ 项。`,
                ),
              ],
              [
                ["Divide by the squared length", "除以长度的平方"],
                t("", ""),
                [
                  `w \\cdot b_${me} = ${top}, \\quad b_${me} \\cdot b_${me} = ${bottom}`,
                  `c_${me} = \\frac{${top}}{${bottom}} = ${answer.toLatex()}`,
                ],
              ],
            ],
            t(
              `With $c_${them} = ${rest.toLatex()}$ along $b_${them} = ${at(other)}$, $${answer.toLatex()}\\,${at(b)} + ${paren(rest)}\\,${at(other)} = ${at(w)}$.`,
              `沿 $b_${them} = ${at(other)}$ 的坐标 $c_${them} = ${rest.toLatex()}$，于是 $${answer.toLatex()}\\,${at(b)} + ${paren(rest)}\\,${at(other)} = ${at(w)}$。`,
            ),
          ),
        }),
        figure: fig(
          7,
          [...arrow(b1, "b1", false), ...arrow(b2, "b2", false), ...arrow(w, "w")],
          [
            `Arrows from the origin: b1 to ${at(b1)}, b2 to ${at(b2)} and w to ${at(w)}.`,
            `从原点出发的箭头：b1 指向 ${at(b1)}，b2 指向 ${at(b2)}，w 指向 ${at(w)}。`,
          ],
        ),
      };
    },
  ),
  figure:
    linearAlgebraDrawings2[
      "components-of-a-vector-with-respect-to-an-orthogonal-or-orthonormal-basis#a-coordinate-relative-to-a-drawn-orthogonal-basis"
    ],
};

const gramSchmidt = {
  ...point(
    "a-gram-schmidt-step-on-two-drawn-arrows",
    ["A Gram-Schmidt step on two drawn arrows", "对两个所画箭头做格拉姆-施密特一步"],
    [
      "Gram-Schmidt keeps $u$ and replaces $v$ by $v - \\frac{v \\cdot u}{u \\cdot u} u$, which removes the part of $v$ along $u$. What remains is perpendicular to $u$, and that gives an orthogonal pair spanning the same plane. For example, $u = (2, 1)$ and $v = (1, 3)$ give $\\frac{5}{5} = 1$ and $w = (1, 3) - (2, 1) = (-1, 2)$, and $w \\cdot u = -2 + 2 = 0$.\n\n> **Watch out.** The answer is what is left after subtracting, not the part along $u$ that is subtracted. Divide $v \\cdot u$ by $u \\cdot u$ before scaling $u$.",
      "格拉姆-施密特保留 $u$，把 $v$ 换成 $v - \\frac{v \\cdot u}{u \\cdot u} u$，也就是去掉 $v$ 沿 $u$ 的部分。剩下的部分垂直于 $u$，于是得到张成同一平面的一对正交向量。例如 $u = (2, 1)$，$v = (1, 3)$ 时倍数为 $\\frac{5}{5} = 1$，$w = (1, 3) - (2, 1) = (-1, 2)$，而 $w \\cdot u = -2 + 2 = 0$。\n\n> **注意。** 答案是减去之后剩下的部分，而不是被减去的沿 $u$ 的部分。要先用 $v \\cdot u$ 除以 $u \\cdot u$，再去乘 $u$。",
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
      const w0 = Q.of(v[0] * uu - vu * u[0], uu);
      const w1 = Q.of(v[1] * uu - vu * u[1], uu);
      const factor = Q.of(vu, uu);
      return {
        ...numberProblem({
          prompt: t(
            `Apply one step of Gram-Schmidt to the drawn vectors, keeping $u$, and let $w = v - \\frac{v \\cdot u}{u \\cdot u} u$. Find the ${name[0]} coordinate of $w$.`,
            `对所画向量做一步格拉姆-施密特，保留 $u$，令 $w = v - \\frac{v \\cdot u}{u \\cdot u} u$。求 $w$ 的${name[1]}个坐标。`,
          ),
          answer,
          mistakes: [
            why(
              Q.of(vu * ui, uu),
              "That is the coordinate of the part along $u$, which is subtracted; $w$ is what is left.",
              "这是沿 $u$ 的那部分的坐标，它是被减去的；$w$ 是剩下的部分。",
            ),
            why(
              vi - vu * ui,
              `That subtracts $v \\cdot u$ times $u$ without dividing by $u \\cdot u = ${uu}$.`,
              `这是减去了 $v \\cdot u$ 倍的 $u$，没有除以 $u \\cdot u = ${uu}$。`,
            ),
            why(Q.of(vi * uu + vu * ui, uu), "The part along $u$ was added instead of subtracted.", "把沿 $u$ 的部分加上了，应当减去。"),
            why(
              Q.of(vi * vu - uu * ui, vu),
              `That uses the factor $\\frac{u \\cdot u}{v \\cdot u}$, upside down: it is $\\frac{v \\cdot u}{u \\cdot u}$, with $u \\cdot u = ${uu}$ below.`,
              `倍数上下颠倒了：应为 $\\frac{v \\cdot u}{u \\cdot u}$，$u \\cdot u = ${uu}$ 在分母上。`,
            ),
          ].filter((m, k, all) => String(m.value) !== String(answer) && all.findIndex((o) => String(o.value) === String(m.value)) === k),
          solution: walked(
            [
              [
                ["Read the arrows and the factor", "读出箭头并求倍数"],
                t(`$u = ${at(u)}$ and $v = ${at(v)}$.`, `$u = ${at(u)}$，$v = ${at(v)}$。`),
                [`v \\cdot u = ${vu}, \\quad u \\cdot u = ${uu}, \\quad \\frac{v \\cdot u}{u \\cdot u} = ${factor.toLatex()}`],
              ],
              [
                ["Subtract the part along u", "减去沿 u 的部分"],
                t(`Take the ${name[0]} coordinates of $v$ and $u$:`, `取 $v$ 和 $u$ 的${name[1]}个坐标：`),
                [`${vi} - ${factor.sign() < 0 ? `\\left(${factor.toLatex()}\\right)` : factor.toLatex()}(${ui}) = ${answer.toLatex()}`],
              ],
            ],
            t(
              `The whole vector is $w = (${w0.toLatex()}, ${w1.toLatex()})$, and $w \\cdot u = (${w0.toLatex()})(${u[0]}) + (${w1.toLatex()})(${u[1]}) = 0$, so it is perpendicular to $u$.`,
              `整个向量是 $w = (${w0.toLatex()}, ${w1.toLatex()})$，而 $w \\cdot u = (${w0.toLatex()})(${u[0]}) + (${w1.toLatex()})(${u[1]}) = 0$，所以它垂直于 $u$。`,
            ),
          ),
        }),
        figure: fig(
          6,
          [...arrow(u, "u"), ...arrow(v, "v", false)],
          [`Arrows from the origin: u to ${at(u)} and v to ${at(v)}.`, `从原点出发的箭头：u 指向 ${at(u)}，v 指向 ${at(v)}。`],
        ),
      };
    },
  ),
  figure: linearAlgebraDrawings2["gram-schmidt-process-for-two-vectors#a-gram-schmidt-step-on-two-drawn-arrows"],
};

const projectionEntry = point(
  "an-entry-of-the-projection-matrix-onto-a-drawn-line",
  ["An entry of the projection matrix onto a drawn line", "到所画直线的投影矩阵的元素"],
  [
    "If $d$ is a direction of a line through the origin, the matrix of the orthogonal projection onto it is $\\frac{d d^{\\mathsf{T}}}{d \\cdot d}$, so the entry in row $i$ and column $j$ is $\\frac{d_i d_j}{d \\cdot d}$. For example, $d = (1, 2)$ gives $d \\cdot d = 5$ and $P = \\frac{1}{5}\\begin{pmatrix} 1 & 2 \\\\ 2 & 4 \\end{pmatrix}$, so the entry in row $1$ and column $2$ is $\\frac{2}{5}$.\n\n> **Watch out.** Use one direction throughout: any point on the line works, but the same $d$ must appear in $d d^{\\mathsf{T}}$ and in $d \\cdot d$. Also keep $P$ apart from $I - P$, which projects onto the perpendicular line.",
    "若 $d$ 是过原点直线的方向，到它的正交投影矩阵为 $\\frac{d d^{\\mathsf{T}}}{d \\cdot d}$，所以第 $i$ 行第 $j$ 列的元素是 $\\frac{d_i d_j}{d \\cdot d}$。例如 $d = (1, 2)$ 时 $d \\cdot d = 5$，$P = \\frac{1}{5}\\begin{pmatrix} 1 & 2 \\\\ 2 & 4 \\end{pmatrix}$，所以第 $1$ 行第 $2$ 列的元素是 $\\frac{2}{5}$。\n\n> **注意。** 自始至终用同一个方向：直线上任一点都可以，但 $d d^{\\mathsf{T}}$ 和 $d \\cdot d$ 中必须是同一个 $d$。还要分清 $P$ 和 $I - P$，后者投影到垂直的直线上。",
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
    const answer = Q.of(top, dd);
    const di = d[i] as number;
    const second = Q.of(di * d[1], dd);
    return {
      ...numberProblem({
        prompt: t(
          `$P$ is the matrix of the orthogonal projection onto the drawn line through the origin. Find the entry of $P$ in row $${i + 1}$ and column $${j + 1}$.`,
          `$P$ 是到所画过原点直线的正交投影矩阵。求 $P$ 第 $${i + 1}$ 行第 $${j + 1}$ 列的元素。`,
        ),
        answer,
        mistakes: [
          why(
            top,
            `That is the entry of $d d^{\\mathsf{T}}$; it still has to be divided by $d \\cdot d = ${dd}$.`,
            `这是 $d d^{\\mathsf{T}}$ 的元素；还要除以 $d \\cdot d = ${dd}$。`,
          ),
          why(
            i === j ? Q.of(dd - top, dd) : Q.of(-top, dd),
            "That is the entry of $I - P$, the projection onto the perpendicular line.",
            "这是 $I - P$ 的元素，即到垂直直线的投影。",
          ),
          why(
            Q.of(4 * top, dd),
            `That takes the far point $${at(tip)}$ in $d d^{\\mathsf{T}}$ but $${at(d)}$ in $d \\cdot d$; the same direction must be used in both.`,
            `这是在 $d d^{\\mathsf{T}}$ 中用了远处的点 $${at(tip)}$，在 $d \\cdot d$ 中却用了 $${at(d)}$；两处必须用同一个方向。`,
          ),
        ].filter((m, k, all) => String(m.value) !== String(answer) && all.findIndex((o) => String(o.value) === String(m.value)) === k),
        solution: walked(
          [
            [
              ["Read a direction", "读出方向"],
              t(`The marked point gives $d = ${at(d)}$.`, `标出的点给出 $d = ${at(d)}$。`),
              [`d \\cdot d = (${d[0]})^{2} + (${d[1]})^{2} = ${dd}`],
            ],
            [
              ["Take the entry of the outer product", "取外积的元素"],
              t("", ""),
              [
                `P_{${i + 1}${j + 1}} = \\frac{d_{${i + 1}} d_{${j + 1}}}{d \\cdot d} = \\frac{(${d[i]})(${d[j]})}{${dd}} = ${answer.toLatex()}`,
              ],
            ],
          ],
          t(
            `$P$ keeps $d$ fixed: row $${i + 1}$ of $P$ times $d$ is $${Q.of(di * d[0], dd).toLatex()}(${d[0]}) + ${second.sign() < 0 ? `\\left(${second.toLatex()}\\right)` : second.toLatex()}(${d[1]}) = ${di}$, the matching entry of $d$.`,
            `$P$ 保持 $d$ 不变：$P$ 的第 $${i + 1}$ 行乘以 $d$ 得 $${Q.of(di * d[0], dd).toLatex()}(${d[0]}) + ${second.sign() < 0 ? `\\left(${second.toLatex()}\\right)` : second.toLatex()}(${d[1]}) = ${di}$，正是 $d$ 的对应分量。`,
          ),
        ),
      }),
      figure: fig(
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
    };
  },
);

const columnSpaceMatrix = point(
  "the-matrix-whose-column-space-is-a-drawn-line",
  ["The matrix whose column space is a drawn line", "列空间是所画直线的矩阵"],
  [
    "The column space is spanned by the columns, so a rank one matrix with column space a given line has every column a multiple of its direction. The rows of such a matrix need not lie on the line: that describes the row space. For example, for the line through $(1, 2)$, the matrix $\\begin{pmatrix} 1 & 3 \\\\ 2 & 6 \\end{pmatrix}$ has columns $(1, 2)$ and $3(1, 2)$.\n\n> **Watch out.** Check the columns, read top to bottom, not the rows. A column with the coordinates of the direction swapped, or a perpendicular direction, lies on a different line.",
    "列空间由列张成，所以以给定直线为列空间的秩一矩阵，每一列都是直线方向的倍数。这样的矩阵的行不必在直线上：那描述的是行空间。例如对过 $(1, 2)$ 的直线，矩阵 $\\begin{pmatrix} 1 & 3 \\\\ 2 & 6 \\end{pmatrix}$ 的两列是 $(1, 2)$ 和 $3(1, 2)$。\n\n> **注意。** 要检查从上往下读的列，而不是行。坐标交换了的方向或垂直的方向，所在的是另一条直线。",
  ],
  (rng) => {
    const d = rng.pick(slanted);
    const a = rng.pick([-3, -2, -1, 1, 2, 3]);
    const b = rng.pick([-3, -2, -1, 1, 2, 3].filter((x) => x !== a));
    const tip: Point = [2 * d[0], 2 * d[1]];
    const wrong = [
      same(mat(a * d[0], a * d[1], b * d[0], b * d[1])),
      same(mat(a * d[1], b * d[1], a * d[0], b * d[0])),
      same(mat(a * d[0], b * d[1], a * d[1], b * d[0])),
      same(mat(-a * d[1], -b * d[1], a * d[0], b * d[0])),
    ];
    const slips: Pair[] = [
      [
        "Its rows are multiples of the direction, so the line is its row space; its columns lie on another line.",
        "它的行是方向的倍数，所以这条直线是它的行空间；它的列在另一条直线上。",
      ],
      [
        `Its columns are multiples of $${at([d[1], d[0]])}$, the direction with its coordinates swapped.`,
        `它的列是 $${at([d[1], d[0]])}$ 的倍数，即坐标交换了的方向。`,
      ],
      [
        `Only the first column lies on the line; the second is a multiple of $${at([d[1], d[0]])}$, with the coordinates swapped.`,
        `只有第一列在直线上；第二列是 $${at([d[1], d[0]])}$ 的倍数，坐标交换了。`,
      ],
      [
        `Its columns are multiples of $${at([-d[1], d[0]])}$, which is perpendicular to the line.`,
        `它的列是 $${at([-d[1], d[0]])}$ 的倍数，与直线垂直。`,
      ],
    ];
    return reasoned(
      choose(
        rng,
        ["Which matrix has the drawn line through the origin as its column space?", "哪个矩阵以所画的过原点直线为列空间？"],
        same(mat(a * d[0], b * d[0], a * d[1], b * d[1])),
        wrong,
        [
          `**Step 1: Read a direction.** The marked point gives the direction $${at(d)}$ of the line.\n\n**Step 2: Test the columns.** The columns of this matrix are $${at([a * d[0], a * d[1]])} = ${a}${at(d)}$ and $${at([b * d[0], b * d[1]])} = ${b}${at(d)}$, both multiples of the direction, so they span the line.\n\n**Check.** Its determinant is $(${a * d[0]})(${b * d[1]}) - (${b * d[0]})(${a * d[1]}) = 0$, so the rank is one and the column space is no bigger than the line.`,
          `**第一步：读出方向。** 标出的点给出直线的方向 $${at(d)}$。\n\n**第二步：检查各列。** 这个矩阵的两列是 $${at([a * d[0], a * d[1]])} = ${a}${at(d)}$ 和 $${at([b * d[0], b * d[1]])} = ${b}${at(d)}$，都是方向的倍数，所以它们张成这条直线。\n\n**检验。** 它的行列式为 $(${a * d[0]})(${b * d[1]}) - (${b * d[0]})(${a * d[1]}) = 0$，所以秩为一，列空间不比这条直线大。`,
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
      ),
      wrong.map((w, i): [string, string, string] => [w[0], ...(slips[i] as Pair)]),
    );
  },
);

/** tilted returns the coordinates along axes turned by the angle whose cosine and sine are given. */
const tilted = (c: number, s: number) => (x: number, y: number) => [c * x + s * y, -s * x + c * y] as const;

const formClass = {
  ...point(
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
  ),
  figure: linearAlgebraDrawings2["positive-definite-and-negative-definite-quadratic-forms#the-type-of-a-quadratic-form-from-a-level-curve"],
};

const constrainedMax = {
  ...point(
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
  ),
  figure: linearAlgebraDrawings2["constrained-optimization-of-quadratic-forms#an-extreme-value-on-the-unit-circle-from-a-level-curve"],
};

const singularFromEllipse = {
  ...point(
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
  ),
  figure: linearAlgebraDrawings2["singular-values-of-a-matrix#singular-values-from-the-image-of-the-unit-circle"],
};

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
