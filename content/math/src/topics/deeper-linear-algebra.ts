// Further knowledge points for topics of Linear Algebra, each a skill the topic's
// own points leave out: working backwards from a condition, a parameter that
// changes the answer, or a fact used in a new setting. See `deeperLinearAlgebraPoints`.

import type { KnowledgePointDef, Rng, Text } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";
import { linearAlgebraDrawings1 } from "../explanation-drawings-linear-algebra-1.ts";
import { linearAlgebraDrawings2 } from "../explanation-drawings-linear-algebra-2.ts";

import { numberProblem, pointLatex, pointProblem, say, why, withMistakes } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";
import { walked } from "./calculus-i-differentiation.ts";
import { pickChoice } from "./grade-4-fractions.ts";

/** Grid is a matrix of numbers written by rows. */
type Grid = readonly (readonly number[])[];

/** mat writes a matrix by rows. */
const mat = (rows: readonly (readonly (number | string)[])[]) =>
  `\\begin{pmatrix} ${rows.map((r) => r.join(" & ")).join(" \\\\ ")} \\end{pmatrix}`;
/** col writes a column vector. */
const col = (...v: readonly (number | string)[]) => `\\begin{pmatrix} ${v.join(" \\\\ ")} \\end{pmatrix}`;
/** both writes the same formula as an option in both languages. */
const both = (latex: string): Text => t(`$${latex}$`, `$${latex}$`);
/** frac writes a rational number. */
const frac = (n: number, d = 1) => Q.of(n, d).toLatex();
/** nonzero picks a nonzero integer from -r to r. */
const nonzero = (rng: Rng, r: number) => rng.pick([...Array(2 * r + 1).keys()].map((i) => i - r).filter((i) => i !== 0));
/** dot multiplies two vectors entry by entry and adds. */
const dot = (a: readonly number[], b: readonly number[]) => a.reduce((s, x, i) => s + x * b[i]!, 0);
/** linear writes the left side of a linear equation in x, y and z. */
const linear = ([a, b, c]: readonly number[]) => poly([a!, "x"], [b!, "y"], [c!, "z"]);
/** inParens puts a negative number in parentheses, for use inside a sum. */
const inParens = (n: number) => (n < 0 ? `(${n})` : `${n}`);

/** det computes a determinant by expansion along the first row. */
function det(m: Grid): number {
  if (m.length === 1) return m[0]![0]!;
  return m[0]!.reduce((sum, x, j) => {
    const minor = m.slice(1).map((r) => r.filter((_, k) => k !== j));
    return sum + (j % 2 === 0 ? 1 : -1) * x * det(minor);
  }, 0);
}

/** times multiplies two matrices. */
function times(a: Grid, b: Grid): number[][] {
  return a.map((r) => b[0]!.map((_, j) => r.reduce((s, x, k) => s + x * b[k]![j]!, 0)));
}

/** unimodular gives a matrix with determinant 1, so that its inverse has integer entries. */
function unimodular(rng: Rng): number[][] {
  const p = nonzero(rng, 3);
  const q = nonzero(rng, 2);
  return [
    [1 + p * q, p],
    [q, 1],
  ];
}

/** inverse2 inverts a two-by-two matrix with determinant 1. */
const inverse2 = (m: Grid): number[][] => [
  [m[1]![1]!, -m[0]![1]!],
  [-m[1]![0]!, m[0]![0]!],
];

/** withEigenvalues builds a full integer two-by-two matrix with the given eigenvalues. */
function withEigenvalues(rng: Rng, l1: number, l2: number): number[][] {
  for (;;) {
    const a = rng.int(-4, 6);
    const d = l1 + l2 - a;
    const product = a * d - l1 * l2;
    if (product === 0) continue;
    const b = rng.pick([1, -1, 2, -2].filter((x) => product % x === 0));
    return [
      [a, b],
      [product / b, d],
    ];
  }
}

// ---------------------------------------------------------------------------
// Lines and planes
// ---------------------------------------------------------------------------

const perpendicularPlanes: KnowledgePointDef = {
  id: "the-parameter-that-makes-two-planes-perpendicular",
  figure: linearAlgebraDrawings1["the-intersection-of-two-planes#the-parameter-that-makes-two-planes-perpendicular"],
  title: t("The parameter that makes two planes perpendicular", "使两平面垂直的参数"),
  explanation: t(
    "The angle between two planes is the angle between their normal vectors. So two planes are perpendicular exactly when the dot product of their normals is zero, which gives one linear equation for an unknown coefficient. For $x + 2y - z = 3$ and $2x + y + kz = 1$: $2 + 2 - k = 0$, so $k = 4$.\n\n> **Watch out.** Perpendicular planes have perpendicular normals, so their dot product is $0$; it is parallel planes whose normals are multiples of each other. Keep the sign when $k$ moves across: $4 - k = 0$ gives $k = 4$, not $-4$.",
    "两平面的夹角就是它们法向量的夹角。所以两平面垂直，当且仅当法向量的数量积为零，这就给未知系数列出一个一次方程。对 $x + 2y - z = 3$ 和 $2x + y + kz = 1$：$2 + 2 - k = 0$，所以 $k = 4$。\n\n> **注意。** 互相垂直的平面，法向量互相垂直，数量积为 $0$；法向量成倍数关系的是平行平面。$k$ 移项时要保留符号：$4 - k = 0$ 得 $k = 4$，不是 $-4$。",
  ),
  generate(rng) {
    const n = [nonzero(rng, 4), nonzero(rng, 4), rng.pick([1, -1])];
    const p = nonzero(rng, 4);
    const q = nonzero(rng, 4);
    const known = dot(n, [p, q, 0]);
    const k = -known * n[2]!;
    const mistakes = [
      why(
        -k,
        `The sign was lost when solving: $${known} + ${inParens(n[2]!)}k = 0$ gives $k = ${k}$ only after moving $${known}$ across with its sign changed.`,
        `解方程时丢了符号：$${known} + ${inParens(n[2]!)}k = 0$，把 $${known}$ 变号移到另一边才能解出 $k$。`,
      ),
      why(
        known,
        "That is the dot product of the known entries alone; $k$ must make the whole dot product, its own term included, equal to $0$.",
        "这只是已知分量的数量积；$k$ 要使包括它自己那一项在内的整个数量积等于 $0$。",
      ),
      why(
        known + n[2]!,
        "That adds the third entry of the first normal instead of multiplying it by $k$.",
        "这是把第一个法向量的第三个分量加上去，而不是乘以 $k$。",
      ),
    ].filter((m, i, all) => m.value !== k && all.findIndex((x) => x.value === m.value) === i);
    return numberProblem({
      prompt: t(
        `The planes $${linear(n)} = 3$ and $${poly([p, "x"], [q, "y"], [1, "kz"])} = 1$ are perpendicular. Find $k$.`,
        `平面 $${linear(n)} = 3$ 与 $${poly([p, "x"], [q, "y"], [1, "kz"])} = 1$ 互相垂直。求 $k$。`,
      ),
      answer: k,
      solveFor: "k",
      solution: walked(
        [
          [
            ["Set the dot product of the normals to zero", "令法向量的数量积为零"],
            t(`The normals are $(${n.join(", ")})$ and $(${p}, ${q}, k)$:`, `法向量是 $(${n.join(", ")})$ 和 $(${p}, ${q}, k)$：`),
            [`${n[0]}(${p}) + ${inParens(n[1]!)}(${q}) + ${inParens(n[2]!)}k = 0`],
          ],
          [
            ["Solve for $k$", "解出 $k$"],
            t(`$${known} + ${inParens(n[2]!)}k = 0$, so $k = ${k}$.`, `$${known} + ${inParens(n[2]!)}k = 0$，所以 $k = ${k}$。`),
          ],
        ],
        t(
          `$${n[0]}(${p}) + ${inParens(n[1]!)}(${q}) + ${inParens(n[2]!)}(${k}) = ${known} + ${inParens(n[2]! * k)} = 0$, so the normals are perpendicular.`,
          `$${n[0]}(${p}) + ${inParens(n[1]!)}(${q}) + ${inParens(n[2]!)}(${k}) = ${known} + ${inParens(n[2]! * k)} = 0$，所以两个法向量垂直。`,
        ),
      ),
      mistakes,
    });
  },
};

const parallelPlaneThroughPoint: KnowledgePointDef = {
  id: "the-plane-through-a-point-parallel-to-a-plane",
  figure: linearAlgebraDrawings1["the-cartesian-equation-of-a-plane#the-plane-through-a-point-parallel-to-a-plane"],
  title: t("The plane through a point parallel to a plane", "过一点且与已知平面平行的平面"),
  explanation: t(
    "Parallel planes share a normal vector, so their equations differ only in the constant on the right. To find the plane through a given point, keep the left side and substitute the point to get the new constant. Parallel to $x - 2y + z = 5$ through $(1, 1, 3)$: $1 - 2 + 3 = 2$, so the plane is $x - 2y + z = 2$.\n\n> **Watch out.** The old constant belongs to the other plane and plays no part: the new constant comes from the point alone. Substitute every coordinate, each with its sign.",
    "平行平面有相同的法向量，所以它们的方程只有右边的常数不同。要求过某点的平行平面，保留左边不变，把点代入得到新的常数。与 $x - 2y + z = 5$ 平行且过 $(1, 1, 3)$：$1 - 2 + 3 = 2$，所以平面是 $x - 2y + z = 2$。\n\n> **注意。** 原来的常数属于另一个平面，不起作用：新的常数只由点决定。每个坐标都要连同符号代入。",
  ),
  generate(rng) {
    const n = [nonzero(rng, 5), nonzero(rng, 5), nonzero(rng, 5)];
    const P = [nonzero(rng, 4), nonzero(rng, 4), nonzero(rng, 4)];
    const old = dot(n, P) + rng.pick([-7, -3, 2, 5, 9]);
    const d = dot(n, P);
    const mistakes = [
      why(
        old,
        "That is the constant of the given plane, which does not pass through the point; the parallel plane needs its own constant.",
        "这是已知平面的常数，那个平面不经过该点；平行平面需要它自己的常数。",
      ),
      why(
        -d,
        "The sign is wrong: $d$ is the value of the left side at the point, not its opposite.",
        "符号错了：$d$ 是左边在该点处的值，不是它的相反数。",
      ),
      why(
        d + old,
        "The old constant was added on; it only places the other plane and plays no part here.",
        "把原来的常数也加上了；它只决定另一个平面的位置，这里不起作用。",
      ),
    ].filter((m, i, all) => m.value !== d && all.findIndex((x) => x.value === m.value) === i);
    return numberProblem({
      prompt: t(
        `The plane $${linear(n)} = d$ is parallel to $${linear(n)} = ${old}$ and passes through $(${P.join(", ")})$. Find $d$.`,
        `平面 $${linear(n)} = d$ 与 $${linear(n)} = ${old}$ 平行，且过点 $(${P.join(", ")})$。求 $d$。`,
      ),
      answer: d,
      solveFor: "d",
      solution: walked(
        [
          [
            ["Keep the left side", "保留左边"],
            t(
              `Parallel planes share the normal $(${n.join(", ")})$, so the left side stays $${linear(n)}$.`,
              `平行平面有相同的法向量 $(${n.join(", ")})$，所以左边仍是 $${linear(n)}$。`,
            ),
          ],
          [
            ["Substitute the point", "代入点"],
            t("", ""),
            [`d = ${n[0]}(${P[0]}) + ${inParens(n[1]!)}(${P[1]}) + ${inParens(n[2]!)}(${P[2]}) = ${d}`],
          ],
        ],
        t(
          `$${d} \\ne ${old}$, so the two planes are different, with the same normal, hence parallel, and the point satisfies $${linear(n)} = ${d}$.`,
          `$${d} \\ne ${old}$，所以两个平面不同，而法向量相同，因此平行；该点满足 $${linear(n)} = ${d}$。`,
        ),
      ),
      mistakes,
    });
  },
};

const footOfPerpendicular: KnowledgePointDef = {
  id: "the-foot-of-the-perpendicular-on-a-plane",
  figure: linearAlgebraDrawings1["the-shortest-distance-between-a-plane-and-a-point#the-foot-of-the-perpendicular-on-a-plane"],
  title: t("The foot of the perpendicular on a plane", "平面上的垂足"),
  explanation: t(
    "The nearest point of a plane to a point $P$ lies on the line through $P$ along the normal $\\mathbf{n}$. Substitute $P + s\\mathbf{n}$ into the plane's equation, solve for $s$, and the point at that $s$ is the foot of the perpendicular. From $(1, 2, 4)$ to $z = 0$: $4 + s = 0$ gives $s = -4$, and the foot is $(1, 2, 0)$.\n\n> **Watch out.** Step from $P$ by $s\\mathbf{n}$ exactly once, with the sign of $s$ found from the equation. Stepping twice as far reaches the mirror image of $P$ on the other side of the plane.",
    "平面上离点 $P$ 最近的点，在过 $P$ 且沿法向量 $\\mathbf{n}$ 的直线上。把 $P + s\\mathbf{n}$ 代入平面方程，解出 $s$，对应的点就是垂足。从 $(1, 2, 4)$ 到 $z = 0$：$4 + s = 0$ 得 $s = -4$，垂足是 $(1, 2, 0)$。\n\n> **注意。** 从 $P$ 出发只走一次 $s\\mathbf{n}$，$s$ 的符号由方程决定。走两倍远会到达 $P$ 关于平面的对称点。",
  ),
  generate(rng) {
    const n = rng.pick([
      [1, 2, 2],
      [2, 1, 2],
      [1, 1, 1],
      [1, -1, 2],
      [2, -2, 1],
    ]);
    const foot = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
    const s = nonzero(rng, 2);
    const P = foot.map((x, i) => x - s * n[i]!);
    const d = dot(n, foot);
    return withMistakes(
      pointProblem({
        prompt: t(
          `Find the point of the plane $${linear(n)} = ${d}$ nearest to $P = (${P.join(", ")})$. Answer as $(x, y, z)$.`,
          `求平面 $${linear(n)} = ${d}$ 上离点 $P = (${P.join(", ")})$ 最近的点，写成 $(x, y, z)$。`,
        ),
        answer: foot,
        vars: ["x", "y", "z"],
        solution: walked(
          [
            [
              ["Follow the normal from $P$", "从 $P$ 沿法向量走"],
              t(
                `The point $(${P.join(", ")}) + s(${n.join(", ")})$ is on the plane when`,
                `点 $(${P.join(", ")}) + s(${n.join(", ")})$ 在平面上，要求`,
              ),
              [`${dot(n, P)} + ${dot(n, n)}s = ${d}`],
            ],
            [
              ["Solve and step", "解出并移动"],
              t(`$s = ${s}$, so the nearest point is $(${foot.join(", ")})$.`, `$s = ${s}$，所以最近的点是 $(${foot.join(", ")})$。`),
            ],
          ],
          t(
            `$${linear(n)}$ at $(${foot.join(", ")})$ is $${d}$, so the point is on the plane, and $(${foot.join(", ")}) - P = (${foot.map((x, i) => x - P[i]!).join(", ")})$ is $${s}$ times the normal.`,
            `$${linear(n)}$ 在 $(${foot.join(", ")})$ 处等于 $${d}$，所以该点在平面上；而 $(${foot.join(", ")}) - P = (${foot.map((x, i) => x - P[i]!).join(", ")})$ 是法向量的 $${s}$ 倍。`,
          ),
        ),
      }),
      [
        say(
          pointLatex(P),
          "That is $P$ itself, which is not on the plane: step along the normal until the equation holds.",
          "这是 $P$ 本身，它不在平面上：要沿法向量移动，直到满足方程。",
        ),
        say(
          pointLatex(foot.map((x, i) => x + s * n[i]!)),
          "That steps twice as far and reaches the mirror image of $P$ on the other side of the plane.",
          "这走了两倍远，到达的是 $P$ 关于平面的对称点。",
        ),
        say(
          pointLatex(P.map((x, i) => x - s * n[i]!)),
          "That steps the wrong way along the normal: the sign of $s$ comes from solving the equation.",
          "这是沿法向量反方向走：$s$ 的符号要由解方程得出。",
        ),
      ].filter((m) => m.response !== pointLatex(foot)),
    );
  },
};

const lineParallelToPlane: KnowledgePointDef = {
  id: "the-parameter-that-makes-a-line-parallel-to-a-plane",
  figure: linearAlgebraDrawings1["the-intersection-between-a-line-and-a-plane#the-parameter-that-makes-a-line-parallel-to-a-plane"],
  title: t("The parameter that makes a line parallel to a plane", "使直线与平面平行的参数"),
  explanation: t(
    "A line is parallel to a plane, or lies in it, exactly when its direction is perpendicular to the plane's normal. Setting the dot product of the direction and the normal to zero gives an equation for an unknown component of the direction. For the direction $(2, k, 1)$ and the plane $x + y - z = 4$: $2 + k - 1 = 0$, so $k = -1$.\n\n> **Watch out.** A line parallel to a plane has its direction perpendicular to the normal, $\\mathbf{n} \\cdot \\mathbf{v} = 0$. The plane's constant and the line's point do not enter this condition; they only decide whether the line lies in the plane.",
    "直线与平面平行或在平面内，当且仅当直线的方向与平面的法向量垂直。令方向与法向量的数量积为零，就得到方向中未知分量的方程。对方向 $(2, k, 1)$ 和平面 $x + y - z = 4$：$2 + k - 1 = 0$，所以 $k = -1$。\n\n> **注意。** 与平面平行的直线，方向与法向量垂直，$\\mathbf{n} \\cdot \\mathbf{v} = 0$。平面的常数和直线上的点不进入这个条件；它们只决定直线是否在平面内。",
  ),
  generate(rng) {
    const n = [nonzero(rng, 3), rng.pick([1, -1]), nonzero(rng, 3)];
    const a = nonzero(rng, 4);
    const c = nonzero(rng, 4);
    const known = n[0]! * a + n[2]! * c;
    const k = -known * n[1]!;
    const d = dot(n, [1, 0, 2]) + rng.pick([3, 5, 8]);
    const mistakes = [
      why(
        -k,
        `The sign was lost when solving $${known} + ${inParens(n[1]!)}k = 0$.`,
        `解 $${known} + ${inParens(n[1]!)}k = 0$ 时丢了符号。`,
      ),
      why(
        d,
        "The plane's constant only says where the plane sits; the condition is on the direction: $\\mathbf{n} \\cdot \\mathbf{v} = 0$.",
        "平面的常数只表示平面的位置；条件是关于方向的：$\\mathbf{n} \\cdot \\mathbf{v} = 0$。",
      ),
      why(
        a + c,
        "That adds the known entries of the direction without multiplying them by the entries of the normal.",
        "这是把方向的已知分量相加，没有乘以法向量的对应分量。",
      ),
    ].filter((m, i, all) => m.value !== k && all.findIndex((x) => x.value === m.value) === i);
    return numberProblem({
      prompt: t(
        `The line $\\mathbf{r} = (1, 0, 2) + s(${a}, k, ${c})$ does not meet the plane $${linear(n)} = ${d}$. Find $k$.`,
        `直线 $\\mathbf{r} = (1, 0, 2) + s(${a}, k, ${c})$ 与平面 $${linear(n)} = ${d}$ 没有公共点。求 $k$。`,
      ),
      answer: k,
      solveFor: "k",
      solution: walked(
        [
          [
            ["Turn the condition into a dot product", "把条件写成数量积"],
            t(
              "A line that misses a plane is parallel to it, so its direction is perpendicular to the normal:",
              "与平面没有公共点的直线和平面平行，所以方向与法向量垂直：",
            ),
            [`${n[0]}(${a}) + ${inParens(n[1]!)}k + ${inParens(n[2]!)}(${c}) = 0`],
          ],
          [
            ["Solve for $k$", "解出 $k$"],
            t(`$${known} + ${inParens(n[1]!)}k = 0$, so $k = ${k}$.`, `$${known} + ${inParens(n[1]!)}k = 0$，所以 $k = ${k}$。`),
          ],
        ],
        t(
          `With $k = ${k}$ the dot product is $${known} + ${inParens(n[1]! * k)} = 0$. The point $(1, 0, 2)$ gives $${dot(n, [1, 0, 2])} \\ne ${d}$, so the line is off the plane and, being parallel, never meets it.`,
          `$k = ${k}$ 时数量积为 $${known} + ${inParens(n[1]! * k)} = 0$。点 $(1, 0, 2)$ 代入得 $${dot(n, [1, 0, 2])} \\ne ${d}$，所以直线不在平面上，又与平面平行，永不相交。`,
        ),
      ),
      mistakes,
    });
  },
};

// ---------------------------------------------------------------------------
// Determinants
// ---------------------------------------------------------------------------

/** factorial multiplies the integers from 1 to n. */
const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));

const countingLeibnizTerms: KnowledgePointDef = {
  id: "counting-the-terms-of-the-leibniz-formula",
  title: t("Counting the terms of the Leibniz formula", "数莱布尼茨公式的项"),
  explanation: t(
    "Each term of the Leibniz formula takes exactly one entry from every row and every column, so an $n \\times n$ determinant has $n!$ terms. Once some entries are fixed, the remaining rows and columns can still be matched in any order: fixing $r$ entries in different rows and columns leaves $(n-r)!$ terms. In a $4 \\times 4$ determinant, $a_{23}$ appears in $3! = 6$ of the $24$ terms.\n\n> **Watch out.** Fixing an entry removes a whole row and a whole column, so the count drops from $n!$ to $(n-1)!$, not to $n! - 1$ or $n - 1$.",
    "莱布尼茨公式的每一项都从每行每列各取一个元素，所以 $n$ 阶行列式有 $n!$ 项。固定一些元素后，其余的行和列仍可任意配对：固定不同行不同列的 $r$ 个元素，还剩 $(n-r)!$ 项。在四阶行列式中，$a_{23}$ 出现在 $24$ 项中的 $3! = 6$ 项里。\n\n> **注意。** 固定一个元素就去掉整整一行和一列，所以项数从 $n!$ 降到 $(n-1)!$，而不是 $n! - 1$ 或 $n - 1$。",
  ),
  generate(rng) {
    const n = rng.int(4, 7);
    const r = rng.int(1, 2);
    const i = rng.int(1, n);
    const j = rng.int(1, n);
    const k = i === n ? 1 : i + 1;
    const l = j === n ? 1 : j + 1;
    const entries = r === 1 ? `a_{${i}${j}}` : `a_{${i}${j}}$ and $a_{${k}${l}}`;
    const entriesZh = r === 1 ? `a_{${i}${j}}` : `a_{${i}${j}}$ 和 $a_{${k}${l}}`;
    const answer = factorial(n - r);
    return numberProblem({
      prompt: t(
        `In the Leibniz formula for a ${n}×${n} determinant, how many terms contain $${entries}$?`,
        `在 ${n} 阶行列式的莱布尼茨公式中，有多少项含有 $${entriesZh}$？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          factorial(n),
          `That is the number of all terms; only those using the fixed ${r === 1 ? "entry" : "entries"} count.`,
          `这是全部项数；只数用到固定元素的项。`,
        ),
        why(
          factorial(n - r + 1),
          `That fixes only one entry; fixing ${r} entries leaves $(${n} - ${r})!$ terms.`,
          `这只固定了一个元素；固定 ${r} 个元素后剩 $(${n} - ${r})!$ 项。`,
        ),
        why(
          n - r,
          `That counts the remaining rows; they can be matched with the remaining columns in $(${n - r})!$ ways.`,
          `这是剩下的行数；它们与剩下的列有 $(${n - r})!$ 种配法。`,
        ),
      ].filter((m, x, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === x),
      solution: walked(
        [
          [
            ["Remove the fixed rows and columns", "去掉固定的行和列"],
            t(
              `${r === 1 ? "Fixing one entry uses up one row and one column" : "Fixing two entries uses up two rows and two columns"}, leaving ${n - r} rows and ${n - r} columns.`,
              `固定 ${r} 个元素用去 ${r} 行和 ${r} 列，还剩 ${n - r} 行和 ${n - r} 列。`,
            ),
          ],
          [
            ["Match the rest", "配对其余部分"],
            t(
              `The other rows can be matched with the other columns in $${n - r}! = ${answer}$ ways.`,
              `其余各行与其余各列有 $${n - r}! = ${answer}$ 种配法。`,
            ),
          ],
        ],
        t(
          `Every one of the $${n}! = ${factorial(n)}$ terms uses one entry of row ${i}; split among its ${n} entries, each appears in $\\frac{${factorial(n)}}{${n}} = ${factorial(n - 1)}$ terms${r === 1 ? "" : `, and the second fixed entry divides that count by ${n - 1}, giving $${answer}$`}.`,
          `全部 $${n}! = ${factorial(n)}$ 项都各用第 ${i} 行的一个元素；分到它的 ${n} 个元素上，每个出现在 $\\frac{${factorial(n)}}{${n}} = ${factorial(n - 1)}$ 项中${r === 1 ? "" : `，第二个固定元素再把这个数除以 ${n - 1}，得 $${answer}$`}。`,
        ),
      ),
    });
  },
};

const expandingAlongASparseRow: KnowledgePointDef = {
  id: "expanding-a-4x4-determinant-along-a-sparse-row",
  title: t("Expanding a 4×4 determinant along a sparse row", "沿零多的行展开四阶行列式"),
  explanation: t(
    "Laplace expansion may use any row or column, and each zero removes a term. When a row has one nonzero entry, the determinant is that entry times its cofactor, a single $3 \\times 3$ determinant. Remember the sign $(-1)^{i+j}$ of the position. If row $2$ is $(0, 5, 0, 0)$, the determinant is $(-1)^{2+2} \\cdot 5 = 5$ times the minor of position $(2, 2)$.\n\n> **Watch out.** The cofactor is the minor with the sign $(-1)^{i+j}$, and the entry itself multiplies it. Leaving out either the sign or the entry gives the wrong value.",
    "拉普拉斯展开可以沿任何一行或一列，每个零都少一项。若某行只有一个非零元素，行列式就等于该元素乘它的代数余子式，也就是一个三阶行列式。别忘了位置的符号 $(-1)^{i+j}$。若第 $2$ 行是 $(0, 5, 0, 0)$，行列式就是 $(-1)^{2+2} \\cdot 5 = 5$ 乘以 $(2, 2)$ 位置的余子式。\n\n> **注意。** 代数余子式是带符号 $(-1)^{i+j}$ 的余子式，还要乘以该元素本身。漏掉符号或元素都会得到错误的值。",
  ),
  generate(rng) {
    const row = rng.int(0, 3);
    const column = rng.int(0, 3);
    const v = nonzero(rng, 3);
    const m = [0, 1, 2, 3].map((i) =>
      [0, 1, 2, 3].map((j) => {
        if (i !== row) return rng.int(-2, 3);
        return j === column ? v : 0;
      }),
    );
    const sub = m.filter((_, i) => i !== row).map((r) => r.filter((_, j) => j !== column));
    const minor = det(sub);
    const sign = (row + column) % 2 === 0 ? 1 : -1;
    const answer = sign * v * minor;
    return numberProblem({
      prompt: t(`Find $\\det ${mat(m)}$.`, `求 $\\det ${mat(m)}$。`),
      answer,
      form: "integer",
      mistakes: [
        why(
          -answer,
          `The sign of position $(${row + 1}, ${column + 1})$ is $(-1)^{${row + 1}+${column + 1}} = ${sign}$.`,
          `位置 $(${row + 1}, ${column + 1})$ 的符号是 $(-1)^{${row + 1}+${column + 1}} = ${sign}$。`,
        ),
        why(
          minor,
          `That is the minor alone; it must still be multiplied by the entry $${v}$ and the sign $${sign}$.`,
          `这只是余子式；还要乘以元素 $${v}$ 和符号 $${sign}$。`,
        ),
        why(
          v * minor,
          `The sign of the position is missing: $(-1)^{${row + 1}+${column + 1}} = ${sign}$.`,
          `漏了位置的符号：$(-1)^{${row + 1}+${column + 1}} = ${sign}$。`,
        ),
      ].filter((w, x, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === x),
      solution: walked(
        [
          [
            ["Expand along the sparse row", "沿零多的行展开"],
            t(
              `Row ${row + 1} has one nonzero entry, $${v}$, in column ${column + 1}, with sign $(-1)^{${row + 1}+${column + 1}} = ${sign}$.`,
              `第 ${row + 1} 行只有一个非零元素 $${v}$，在第 ${column + 1} 列，符号为 $(-1)^{${row + 1}+${column + 1}} = ${sign}$。`,
            ),
          ],
          [
            ["Find the minor", "求余子式"],
            t("Deleting its row and column leaves", "删去所在的行和列，剩下"),
            [`\\det ${mat(sub)} = ${minor}`],
          ],
          [
            ["Multiply", "相乘"],
            t(
              `$${sign} \\cdot ${inParens(v)} \\cdot ${inParens(minor)} = ${answer}$.`,
              `$${sign} \\cdot ${inParens(v)} \\cdot ${inParens(minor)} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `The other three entries of row ${row + 1} are $0$, so their terms vanish and $${answer}$ is the whole determinant.`,
          `第 ${row + 1} 行的其余三个元素都是 $0$，它们的项都消失，所以 $${answer}$ 就是整个行列式。`,
        ),
      ),
    });
  },
};

const whenCramerFails: KnowledgePointDef = {
  id: "the-parameter-where-cramers-rule-does-not-apply",
  title: t("The parameter where Cramer's rule does not apply", "克拉默法则失效时的参数"),
  explanation: t(
    "Cramer's rule divides by the determinant of the coefficient matrix, so it applies only when that determinant is not zero. For a system with a parameter, write the determinant in terms of the parameter and find where it vanishes. For $x + 2y = 1$, $3x + ky = 4$, the determinant is $k - 6$, so the rule fails at $k = 6$.\n\n> **Watch out.** Only the coefficients enter the determinant, never the right-hand sides. Solve $ak - bc = 0$ for $k$; do not stop at the product $bc$.",
    "克拉默法则要除以系数矩阵的行列式，所以只有行列式不为零时才适用。对含参数的方程组，把行列式写成参数的式子，找出它为零的位置。对 $x + 2y = 1$，$3x + ky = 4$，行列式是 $k - 6$，所以在 $k = 6$ 时法则失效。\n\n> **注意。** 只有系数进入行列式，右端常数从不进入。要从 $ak - bc = 0$ 解出 $k$，不能停在积 $bc$ 上。",
  ),
  generate(rng) {
    const a = rng.pick([1, 2, -1, -2]);
    const b = 2 * nonzero(rng, 3);
    const c = nonzero(rng, 5);
    const k = (b * c) / a;
    const [e, f] = [rng.int(1, 9), rng.int(1, 9)];
    return numberProblem({
      prompt: t(
        `For which value of $k$ can Cramer's rule not be used on the system $${poly([a, "x"], [b, "y"])} = ${e}$, $${poly([c, "x"], [1, "ky"])} = ${f}$?`,
        `$k$ 取何值时，方程组 $${poly([a, "x"], [b, "y"])} = ${e}$，$${poly([c, "x"], [1, "ky"])} = ${f}$ 不能用克拉默法则？`,
      ),
      answer: k,
      solveFor: "k",
      mistakes: [
        why(-k, "The sign is flipped: $ak - bc = 0$ gives $k = \\frac{bc}{a}$.", "符号反了：由 $ak - bc = 0$ 得 $k = \\frac{bc}{a}$。"),
        why(
          b * c,
          `That is the product $bc$; it still has to be divided by the coefficient $${a}$ of $k$.`,
          `这是积 $bc$；还要除以 $k$ 的系数 $${a}$。`,
        ),
        why(
          a * c,
          "That multiplies the two $x$-coefficients; the determinant pairs the diagonal entries and the off-diagonal entries.",
          "这把两个 $x$ 系数相乘了；行列式是对角元之积减去非对角元之积。",
        ),
      ].filter((w, i, all) => w.value !== k && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Write the determinant", "写出行列式"],
            t("", ""),
            [
              `\\det ${mat([
                [a, b],
                [c, "k"],
              ])} = ${a}k - ${inParens(b)}(${c})`,
            ],
          ],
          [["Set it to zero", "令它为零"], t(`$${a}k = ${b * c}$, so $k = ${k}$.`, `$${a}k = ${b * c}$，所以 $k = ${k}$。`)],
        ],
        t(
          `At $k = ${k}$ the determinant is $${a} \\cdot ${inParens(k)} - ${b * c < 0 ? `(${b * c})` : b * c} = 0$, and the rule would divide by zero.`,
          `$k = ${k}$ 时行列式为 $${a} \\cdot ${inParens(k)} - ${b * c < 0 ? `(${b * c})` : b * c} = 0$，这时法则要除以零。`,
        ),
      ),
    });
  },
};

const determinantOfACombination: KnowledgePointDef = {
  id: "the-determinant-of-a-product-of-a-scalar-a-transpose-and-an-inverse",
  title: t("The determinant of a scaled product with a transpose and an inverse", "含数乘、转置和逆的乘积的行列式"),
  explanation: t(
    "Determinants multiply, a transpose keeps the determinant, and an inverse takes its reciprocal. A scalar multiplies every row, so for an $n \\times n$ matrix $\\det(cA) = c^n \\det A$, with the power $n$ and not $1$. For $3 \\times 3$ matrices with $\\det A = 2$ and $\\det B = 4$: $\\det(2A^T B^{-1}) = 8 \\cdot 2 \\cdot \\frac{1}{4} = 4$.\n\n> **Watch out.** The inverse puts $\\det B$ in the denominator, not $\\det A$. The scalar enters as $c^n$, once for each row.",
    "行列式对乘积可乘，转置不改变行列式，取逆则变为倒数。数乘作用于每一行，所以 $n$ 阶矩阵满足 $\\det(cA) = c^n \\det A$，指数是 $n$ 而不是 $1$。对 $\\det A = 2$、$\\det B = 4$ 的三阶矩阵：$\\det(2A^T B^{-1}) = 8 \\cdot 2 \\cdot \\frac{1}{4} = 4$。\n\n> **注意。** 求逆使 $\\det B$ 进入分母，而不是 $\\det A$。数乘以 $c^n$ 的形式出现，每行一次。",
  ),
  generate(rng) {
    const n = rng.int(2, 4);
    const c = rng.pick([2, 3, -2, -1]);
    const a = nonzero(rng, 5);
    const b = rng.pick([1, -1, 2, -2, 4]);
    const answer = Q.of(c ** n * a, b);
    const asQ = (v: number | Q): Q => (typeof v === "number" ? Q.of(v) : v);
    return numberProblem({
      prompt: t(
        `$A$ and $B$ are ${n}×${n} matrices with $\\det A = ${a}$ and $\\det B = ${b}$. Find $\\det(${c}A^{T}B^{-1})$.`,
        `$A$、$B$ 是 ${n} 阶矩阵，$\\det A = ${a}$，$\\det B = ${b}$。求 $\\det(${c}A^{T}B^{-1})$。`,
      ),
      answer,
      mistakes: [
        why(
          Q.of(c * a, b),
          `The scalar multiplies all ${n} rows, so it contributes $(${c})^{${n}}$, not $${c}$.`,
          `数乘作用于全部 ${n} 行，所以贡献 $(${c})^{${n}}$，不是 $${c}$。`,
        ),
        why(
          c ** n * a * b,
          "The inverse takes the reciprocal: $\\det B^{-1} = \\frac{1}{\\det B}$.",
          "取逆是取倒数：$\\det B^{-1} = \\frac{1}{\\det B}$。",
        ),
        why(
          Q.of(c ** n * b, a),
          "The inverse is on $B$, so $\\det B$ goes in the denominator, not $\\det A$.",
          "求逆的是 $B$，所以 $\\det B$ 在分母，而不是 $\\det A$。",
        ),
      ].filter((w, x, all) => !asQ(w.value).eq(answer) && all.findIndex((o) => asQ(o.value).eq(asQ(w.value))) === x),
      solution: walked(
        [
          [["Split the product", "拆开乘积"], t("", ""), [`\\det(${c}A^{T}B^{-1}) = (${c})^{${n}} \\det(A^{T}) \\det(B^{-1})`]],
          [
            ["Use each rule", "逐项用规则"],
            t(
              `$(${c})^{${n}} = ${c ** n}$, $\\det A^T = ${a}$ and $\\det B^{-1} = \\frac{1}{${b}}$, so the product is $${answer.toLatex()}$.`,
              `$(${c})^{${n}} = ${c ** n}$，$\\det A^T = ${a}$，$\\det B^{-1} = \\frac{1}{${b}}$，所以乘积为 $${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `Multiplying back by $\\det B = ${b}$ gives $${answer.toLatex()} \\cdot ${inParens(b)} = ${c ** n * a} = ${c ** n} \\cdot ${inParens(a)}$, the determinant of $${c}A^{T}$.`,
          `再乘回 $\\det B = ${b}$，得 $${answer.toLatex()} \\cdot ${inParens(b)} = ${c ** n * a} = ${c ** n} \\cdot ${inParens(a)}$，正是 $${c}A^{T}$ 的行列式。`,
        ),
      ),
    });
  },
};

const multiplyingBlocks: KnowledgePointDef = {
  id: "multiplying-partitioned-matrices",
  title: t("Multiplying partitioned matrices", "分块矩阵的乘法"),
  explanation: t(
    "Blocks multiply like entries as long as the sizes match, keeping the order of each product. So the top right block of $\\begin{pmatrix} A & B \\\\ 0 & D \\end{pmatrix}\\begin{pmatrix} E & G \\\\ 0 & H \\end{pmatrix}$ is $AG + BH$: row of blocks $(A, B)$ times column of blocks $(G, H)$.\n\n> **Watch out.** Keep each block on the left where it stands: $AG$ and $BH$, never $GA$ or $HB$, since blocks seldom commute. And the block entry needs both products, not just one.",
    "只要尺寸相配，分块矩阵可以像数一样相乘，但每个乘积的顺序要保持。所以 $\\begin{pmatrix} A & B \\\\ 0 & D \\end{pmatrix}\\begin{pmatrix} E & G \\\\ 0 & H \\end{pmatrix}$ 的右上块是 $AG + BH$：块行 $(A, B)$ 乘以块列 $(G, H)$。\n\n> **注意。** 每个块保持原来左边的位置：是 $AG$ 与 $BH$，绝不是 $GA$ 或 $HB$，因为块很少可交换。而且这个块需要两个乘积之和，不是只取其一。",
  ),
  generate(rng) {
    const small = (): number[][] => [
      [rng.int(-2, 3), rng.int(-2, 3)],
      [rng.int(-2, 3), rng.int(-2, 3)],
    ];
    const [A, B, G, H] = [small(), small(), small(), small()];
    const AG = times(A, G);
    const BH = times(B, H);
    const i = rng.int(0, 1);
    const j = rng.int(0, 1);
    const answer = AG[i]![j]! + BH[i]![j]!;
    return numberProblem({
      prompt: t(
        `Let $M = \\begin{pmatrix} A & B \\\\ 0 & I \\end{pmatrix}$ and $N = \\begin{pmatrix} I & G \\\\ 0 & H \\end{pmatrix}$, with $A = ${mat(A)}$, $B = ${mat(B)}$, $G = ${mat(G)}$ and $H = ${mat(H)}$. Find the entry in row ${i + 1}, column ${j + 1} of the top right block of $MN$.`,
        `设 $M = \\begin{pmatrix} A & B \\\\ 0 & I \\end{pmatrix}$，$N = \\begin{pmatrix} I & G \\\\ 0 & H \\end{pmatrix}$，其中 $A = ${mat(A)}$，$B = ${mat(B)}$，$G = ${mat(G)}$，$H = ${mat(H)}$。求 $MN$ 右上块第 ${i + 1} 行第 ${j + 1} 列的元素。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          AG[i]![j]!,
          "That is the entry of $AG$ alone; the top right block is $AG + BH$, so $BH$ is missing.",
          "这只是 $AG$ 的元素；右上块是 $AG + BH$，漏了 $BH$。",
        ),
        why(
          BH[i]![j]!,
          "That is the entry of $BH$ alone; the top right block is $AG + BH$, so $AG$ is missing.",
          "这只是 $BH$ 的元素；右上块是 $AG + BH$，漏了 $AG$。",
        ),
        why(
          times(G, A)[i]![j]! + times(H, B)[i]![j]!,
          "The order of the products is reversed: the blocks of $M$ stay on the left, as in $AG$ and $BH$.",
          "乘积的顺序反了：$M$ 的块要留在左边，即 $AG$ 与 $BH$。",
        ),
      ].filter((w, x, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === x),
      solution: walked(
        [
          [
            ["Multiply the blocks", "按块相乘"],
            t(
              "Block row $1$ of $M$ is $(A, B)$ and block column $2$ of $N$ is $(G, H)$, so the top right block of $MN$ is $AG + BH$.",
              "$M$ 的第 $1$ 块行是 $(A, B)$，$N$ 的第 $2$ 块列是 $(G, H)$，所以 $MN$ 的右上块是 $AG + BH$。",
            ),
          ],
          [
            ["Find the two entries", "求两个元素"],
            t(
              `Row ${i + 1} of $A$ times column ${j + 1} of $G$ gives $${AG[i]![j]!}$, and row ${i + 1} of $B$ times column ${j + 1} of $H$ gives $${BH[i]![j]!}$.`,
              `$A$ 的第 ${i + 1} 行乘以 $G$ 的第 ${j + 1} 列得 $${AG[i]![j]!}$，$B$ 的第 ${i + 1} 行乘以 $H$ 的第 ${j + 1} 列得 $${BH[i]![j]!}$。`,
            ),
            [`${AG[i]![j]!} + ${inParens(BH[i]![j]!)} = ${answer}`],
          ],
        ],
        t(
          `Row ${i + 1} of $M$ is $(${[...A[i]!, ...B[i]!].join(", ")})$ and column ${j + 3} of $N$ is $(${[G[0]![j]!, G[1]![j]!, H[0]![j]!, H[1]![j]!].join(", ")})$; their dot product is $${dot([...A[i]!, ...B[i]!], [G[0]![j]!, G[1]![j]!, H[0]![j]!, H[1]![j]!])}$.`,
          `$M$ 的第 ${i + 1} 行是 $(${[...A[i]!, ...B[i]!].join(", ")})$，$N$ 的第 ${j + 3} 列是 $(${[G[0]![j]!, G[1]![j]!, H[0]![j]!, H[1]![j]!].join(", ")})$；二者的点积是 $${dot([...A[i]!, ...B[i]!], [G[0]![j]!, G[1]![j]!, H[0]![j]!, H[1]![j]!])}$。`,
        ),
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Elimination, inverses and LU
// ---------------------------------------------------------------------------

const consistent3x3: KnowledgePointDef = {
  id: "the-constant-that-makes-a-singular-3x3-system-consistent",
  title: t("The constant that makes a singular 3×3 system consistent", "使奇异三阶方程组相容的常数"),
  explanation: t(
    "When elimination turns a row of the coefficient matrix to zero, the same steps act on the right side, and the system has solutions only if that side also becomes zero. This condition fixes the missing constant. If row $3$ of the coefficients is $2R_1 + R_2$ and the right sides of rows $1$ and $2$ are $4$ and $1$, then $k = 2 \\cdot 4 + 1 = 9$.\n\n> **Watch out.** Find the combination from the coefficients first, then apply exactly the same multiples to the right-hand sides; adding the right sides without the multiples gives the wrong constant.",
    "消元把系数矩阵的某一行化为零时，同样的步骤也作用在右边，只有右边也变成零，方程组才有解。这个条件决定了缺少的常数。若系数的第 $3$ 行是 $2R_1 + R_2$，而第 $1$、$2$ 行右端为 $4$ 和 $1$，则 $k = 2 \\cdot 4 + 1 = 9$。\n\n> **注意。** 先由系数找出组合，再对右端用完全相同的倍数；不带倍数直接把右端相加，得到的常数是错的。",
  ),
  generate(rng) {
    const r1 = [1, nonzero(rng, 3), nonzero(rng, 3)];
    const r2 = [0, 1, nonzero(rng, 3)].map((x, i) => x + nonzero(rng, 2) * r1[i]!);
    const alpha = nonzero(rng, 2);
    const beta = nonzero(rng, 2);
    const r3 = r1.map((x, i) => alpha * x + beta * r2[i]!);
    const e1 = rng.int(-5, 6);
    const e2 = rng.int(-5, 6);
    const k = alpha * e1 + beta * e2;
    const system = `${linear(r1)} = ${e1},\\quad ${linear(r2)} = ${e2},\\quad ${linear(r3)} = k`;
    return numberProblem({
      prompt: t(`For which $k$ does the system $${system}$ have a solution?`, `$k$ 取何值时，方程组 $${system}$ 有解？`),
      answer: k,
      solveFor: "k",
      mistakes: [
        why(
          e1 + e2,
          "That adds the right sides without the multiples; row 3 is a combination with the multiples found from the coefficients.",
          "这是不带倍数直接把右端相加；第 3 行是带着由系数求出的倍数的组合。",
        ),
        why(alpha * e2 + beta * e1, "The two multiples are attached to the wrong rows.", "两个倍数配错了行。"),
        why(
          0,
          "The right side of the zero row must vanish, not $k$ itself: $k$ has to match the combination of the other right sides.",
          "必须为零的是零行的右端，而不是 $k$ 本身：$k$ 要与其他右端的组合相符。",
        ),
      ].filter((w, i, all) => w.value !== k && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Find the combination", "找出组合"],
            t(
              `In every column, row 3 of the coefficients equals $${alpha}$ times row 1 plus $${inParens(beta)}$ times row 2, so $${poly([1, "R_3"], [-alpha, "R_1"], [-beta, "R_2"])} \\to R_3$ turns it into zeros.`,
              `在每一列中，系数的第 3 行都等于第 1 行的 $${alpha}$ 倍加第 2 行的 $${inParens(beta)}$ 倍，所以 $${poly([1, "R_3"], [-alpha, "R_1"], [-beta, "R_2"])} \\to R_3$ 把它化为零。`,
            ),
          ],
          [
            ["Make the right side zero too", "使右端也为零"],
            t("The same step on the right side must give $0$:", "同一步作用在右端也必须得 $0$："),
            [`k - ${inParens(alpha)}(${e1}) - ${inParens(beta)}(${e2}) = 0 \\implies k = ${k}`],
          ],
        ],
        t(
          `With $k = ${k}$, the third equation is $${alpha}$ times the first plus $${inParens(beta)}$ times the second, coefficients and right side alike, so it adds no new condition and the first two equations, with independent rows, have solutions.`,
          `$k = ${k}$ 时，第三个方程恰是第一个的 $${alpha}$ 倍加第二个的 $${inParens(beta)}$ 倍，系数与右端都如此，所以它不增加新条件，而前两个方程的行线性无关，有解。`,
        ),
      ),
    });
  },
};

const clearingAbovePivot: KnowledgePointDef = {
  id: "clearing-above-a-pivot-to-reach-rref",
  title: t("Clearing above a pivot to reach reduced form", "清除主元上方的元素得到简化阶梯形"),
  explanation: t(
    "From echelon form, reduced form takes one more pass: starting at the last pivot, subtract multiples of its row from the rows above until each pivot is the only nonzero entry of its column. This also changes the entries in the free columns. In $\\begin{pmatrix} 1 & 2 & 7 \\\\ 0 & 1 & 3 \\end{pmatrix}$, $R_1 - 2R_2 \\to R_1$ makes the last entry of row 1 equal to $7 - 2 \\cdot 3 = 1$.\n\n> **Watch out.** The whole row is subtracted, so every entry to the right changes, not just the one above the pivot. The multiple is the entry above the pivot, with its sign.",
    "从阶梯形到简化阶梯形还要再做一轮：从最后一个主元开始，从上方各行减去该行的倍数，直到每个主元是所在列唯一的非零元素。这也会改变自由列中的元素。在 $\\begin{pmatrix} 1 & 2 & 7 \\\\ 0 & 1 & 3 \\end{pmatrix}$ 中，$R_1 - 2R_2 \\to R_1$ 使第 1 行最后一个元素变为 $7 - 2 \\cdot 3 = 1$。\n\n> **注意。** 减去的是整行，所以右边的每个元素都会改变，而不只是主元上方的那个。倍数就是主元上方的元素，连同它的符号。",
  ),
  generate(rng) {
    const a = nonzero(rng, 4);
    const b = rng.int(-5, 6);
    const c = nonzero(rng, 4);
    const answer = b - a * c;
    return numberProblem({
      prompt: t(
        `Reduce $${mat([
          [1, a, b],
          [0, 1, c],
        ])}$ to reduced row echelon form. What is the entry in row 1, column 3?`,
        `把 $${mat([
          [1, a, b],
          [0, 1, c],
        ])}$ 化为简化行阶梯形。第 1 行第 3 列的元素是多少？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          b,
          "The row operation changes the whole of row 1, so its last entry changes too.",
          "行运算改变整个第 1 行，所以它的最后一个元素也会变。",
        ),
        why(
          b + a * c,
          `Row 2 is subtracted $${a}$ times, so $${inParens(a)}(${c})$ is subtracted from the last entry, not added.`,
          `第 2 行被减去 $${a}$ 倍，所以最后一个元素要减去 $${inParens(a)}(${c})$，而不是加上。`,
        ),
        why(
          c,
          "That is the entry of row 2; the question asks for row 1 after the operation.",
          "这是第 2 行的元素；题目问的是变换后的第 1 行。",
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Choose the operation", "选择变换"],
            t(
              `The entry above the second pivot is $${a}$, so $${poly([1, "R_1"], [-a, "R_2"])} \\to R_1$ clears it.`,
              `第二个主元上方的元素是 $${a}$，所以 $${poly([1, "R_1"], [-a, "R_2"])} \\to R_1$ 把它消去。`,
            ),
          ],
          [["Update the last entry", "更新最后一个元素"], t("", ""), [`${b} - ${inParens(a)}(${c}) = ${answer}`]],
        ],
        t(
          `The result $${mat([
            [1, 0, answer],
            [0, 1, c],
          ])}$ is in reduced form, and adding $${inParens(a)}$ times row 2 back gives row 1 again: $${answer} + ${inParens(a)}(${c}) = ${b}$.`,
          `结果 $${mat([
            [1, 0, answer],
            [0, 1, c],
          ])}$ 是简化阶梯形，再把第 2 行的 $${inParens(a)}$ 倍加回去又得到原来的第 1 行：$${answer} + ${inParens(a)}(${c}) = ${b}$。`,
        ),
      ),
    });
  },
};

const solvingWithAnInverse: KnowledgePointDef = {
  id: "solving-a-system-from-a-given-inverse",
  title: t("Solving a system from a given inverse", "由已知的逆矩阵解方程组"),
  explanation: t(
    "If the inverse of $A$ is known, there is no need to eliminate: multiplying $A\\mathbf{x} = \\mathbf{b}$ on the left by $A^{-1}$ gives $\\mathbf{x} = A^{-1}\\mathbf{b}$. The answer comes from one matrix-vector product with the inverse, not with $A$. With $A^{-1} = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$ and $\\mathbf{b} = (1, 3)$, $\\mathbf{x} = (2 + 3, 1 + 3) = (5, 4)$.\n\n> **Watch out.** Multiply $\\mathbf{b}$ by $A^{-1}$, not by $A$: $A\\mathbf{b}$ answers a different question.",
    "已知 $A$ 的逆就不必消元：在 $A\\mathbf{x} = \\mathbf{b}$ 两边左乘 $A^{-1}$，得 $\\mathbf{x} = A^{-1}\\mathbf{b}$。答案来自逆矩阵与向量的一次乘法，而不是 $A$ 与向量的乘法。取 $A^{-1} = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$，$\\mathbf{b} = (1, 3)$，则 $\\mathbf{x} = (2 + 3, 1 + 3) = (5, 4)$。\n\n> **注意。** 要用 $A^{-1}$ 乘 $\\mathbf{b}$，而不是 $A$：$A\\mathbf{b}$ 回答的是另一个问题。",
  ),
  generate(rng) {
    const inverse = unimodular(rng);
    const b = [rng.int(-4, 5), rng.int(-4, 5)];
    if (b[0] === 0 && b[1] === 0) b[0] = 1;
    const x = [dot(inverse[0]!, b), dot(inverse[1]!, b)];
    const A = inverse2(inverse);
    const row = (r: readonly number[], v: readonly number[]) =>
      `${inParens(r[0]!)} \\cdot ${inParens(v[0]!)} + ${inParens(r[1]!)} \\cdot ${inParens(v[1]!)}`;
    return withMistakes(
      pointProblem({
        prompt: t(
          `The matrix $A$ has $A^{-1} = ${mat(inverse)}$. Solve $A\\mathbf{x} = ${col(b[0]!, b[1]!)}$. Answer as $(x_1, x_2)$.`,
          `矩阵 $A$ 满足 $A^{-1} = ${mat(inverse)}$。解 $A\\mathbf{x} = ${col(b[0]!, b[1]!)}$，写成 $(x_1, x_2)$。`,
        ),
        answer: x,
        vars: ["x_1", "x_2"],
        solution: walked(
          [
            [
              ["Multiply both sides by $A^{-1}$", "两边左乘 $A^{-1}$"],
              t(
                "$A^{-1}A\\mathbf{x} = \\mathbf{x}$, so $\\mathbf{x} = A^{-1}\\mathbf{b}$.",
                "$A^{-1}A\\mathbf{x} = \\mathbf{x}$，所以 $\\mathbf{x} = A^{-1}\\mathbf{b}$。",
              ),
            ],
            [
              ["Compute the product", "计算乘积"],
              t("Each row of $A^{-1}$ times $\\mathbf{b}$:", "$A^{-1}$ 的每一行乘 $\\mathbf{b}$："),
              [`x_1 = ${row(inverse[0]!, b)} = ${x[0]}`, `x_2 = ${row(inverse[1]!, b)} = ${x[1]}`],
            ],
          ],
          t(
            `$A = ${mat(A)}$, and $A\\mathbf{x}$ has entries $${row(A[0]!, x)} = ${b[0]}$ and $${row(A[1]!, x)} = ${b[1]}$, which is $\\mathbf{b}$.`,
            `$A = ${mat(A)}$，$A\\mathbf{x}$ 的分量为 $${row(A[0]!, x)} = ${b[0]}$ 与 $${row(A[1]!, x)} = ${b[1]}$，正是 $\\mathbf{b}$。`,
          ),
        ),
      }),
      [
        say(
          pointLatex([dot(A[0]!, b), dot(A[1]!, b)]),
          "That is $A\\mathbf{b}$: the vector was multiplied by $A$ instead of by its inverse.",
          "这是 $A\\mathbf{b}$：用 $A$ 而不是它的逆去乘向量。",
        ),
        say(
          pointLatex(b),
          "That is $\\mathbf{b}$ itself; it still has to be multiplied by $A^{-1}$.",
          "这是 $\\mathbf{b}$ 本身；还要用 $A^{-1}$ 去乘。",
        ),
        say(
          pointLatex([x[1]!, x[0]!]),
          "The two entries are swapped: row 1 of $A^{-1}$ gives $x_1$.",
          "两个分量颠倒了：$A^{-1}$ 的第 1 行给出 $x_1$。",
        ),
      ].filter((m, i, all) => m.response !== pointLatex(x) && all.findIndex((o) => o.response === m.response) === i),
    );
  },
};

const inverseOfAProduct: KnowledgePointDef = {
  id: "the-inverse-of-a-product-reverses-the-order",
  title: t("The inverse of a product reverses the order", "乘积的逆要交换顺序"),
  explanation: t(
    "Since $AB(B^{-1}A^{-1}) = I$, the inverse of a product is the product of the inverses in the opposite order. Matrices seldom commute, so $A^{-1}B^{-1}$ is usually a different matrix and gives wrong entries. For example, with $A^{-1} = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$ and $B^{-1} = \\begin{pmatrix} 1 & 0 \\\\ 1 & 1 \\end{pmatrix}$, the $(1, 1)$ entry of $(AB)^{-1} = B^{-1}A^{-1}$ is $1$, while $A^{-1}B^{-1}$ has $2$ there.\n\n> **Watch out.** Undo the last step first, as with socks and shoes: $(AB)^{-1} = B^{-1}A^{-1}$, never $A^{-1}B^{-1}$ in general.",
    "因为 $AB(B^{-1}A^{-1}) = I$，乘积的逆是各自的逆按相反顺序相乘。矩阵很少可交换，所以 $A^{-1}B^{-1}$ 通常是另一个矩阵，算出的元素是错的。例如 $A^{-1} = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$，$B^{-1} = \\begin{pmatrix} 1 & 0 \\\\ 1 & 1 \\end{pmatrix}$，$(AB)^{-1} = B^{-1}A^{-1}$ 的 $(1, 1)$ 元素为 $1$，而 $A^{-1}B^{-1}$ 在该处为 $2$。\n\n> **注意。** 像先穿袜子再穿鞋一样，要先撤销最后一步：$(AB)^{-1} = B^{-1}A^{-1}$，一般不等于 $A^{-1}B^{-1}$。",
  ),
  generate(rng) {
    let Ai: number[][];
    let Bi: number[][];
    let right: number[][];
    let wrongOrder: number[][];
    do {
      Ai = unimodular(rng);
      Bi = unimodular(rng);
      right = times(Bi, Ai);
      wrongOrder = times(Ai, Bi);
    } while (right[0]![1] === wrongOrder[0]![1]);
    return numberProblem({
      prompt: t(
        `$A^{-1} = ${mat(Ai)}$ and $B^{-1} = ${mat(Bi)}$. Find the entry in row 1, column 2 of $(AB)^{-1}$.`,
        `$A^{-1} = ${mat(Ai)}$，$B^{-1} = ${mat(Bi)}$。求 $(AB)^{-1}$ 第 1 行第 2 列的元素。`,
      ),
      answer: right[0]![1]!,
      form: "integer",
      mistakes: [
        why(
          wrongOrder[0]![1]!,
          "That is the entry of $A^{-1}B^{-1}$; the inverse of a product reverses the order.",
          "这是 $A^{-1}B^{-1}$ 的元素；乘积的逆要交换顺序。",
        ),
        why(
          right[1]![0]!,
          "That is the entry in row 2, column 1; the question asks for row 1, column 2.",
          "这是第 2 行第 1 列的元素；题目求的是第 1 行第 2 列。",
        ),
        why(
          Ai[0]![1]! * Bi[0]![1]!,
          "That multiplies the two entries in position $(1, 2)$; an entry of a product is a row times a column.",
          "这是把两个 $(1, 2)$ 位置的元素相乘；乘积的元素是行乘列。",
        ),
      ].filter((w, i, all) => w.value !== right[0]![1]! && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Reverse the order", "交换顺序"],
            t(
              "Since $(AB)(B^{-1}A^{-1}) = A(BB^{-1})A^{-1} = I$, the inverse is $(AB)^{-1} = B^{-1}A^{-1}$.",
              "由于 $(AB)(B^{-1}A^{-1}) = A(BB^{-1})A^{-1} = I$，逆为 $(AB)^{-1} = B^{-1}A^{-1}$。",
            ),
          ],
          [
            ["Row 1 times column 2", "第 1 行乘第 2 列"],
            t("Row 1 of $B^{-1}$ times column 2 of $A^{-1}$:", "$B^{-1}$ 的第 1 行乘 $A^{-1}$ 的第 2 列："),
            [
              `${inParens(Bi[0]![0]!)} \\cdot ${inParens(Ai[0]![1]!)} + ${inParens(Bi[0]![1]!)} \\cdot ${inParens(Ai[1]![1]!)} = ${right[0]![1]}`,
            ],
          ],
        ],
        t(
          `The whole product is $B^{-1}A^{-1} = ${mat(right)}$, while $A^{-1}B^{-1} = ${mat(wrongOrder)}$ has $${wrongOrder[0]![1]}$ in that place, so the order matters here.`,
          `整个乘积为 $B^{-1}A^{-1} = ${mat(right)}$，而 $A^{-1}B^{-1} = ${mat(wrongOrder)}$ 在该处为 $${wrongOrder[0]![1]}$，所以这里顺序有关系。`,
        ),
      ),
    });
  },
};

const whenLuFails: KnowledgePointDef = {
  id: "the-parameter-where-lu-needs-a-row-swap",
  title: t("The parameter where LU needs a row swap", "LU 分解需要换行时的参数"),
  explanation: t(
    "Elimination without row swaps divides by each pivot in turn. If the first entry is zero and the entry below it is not, no multiple of the first row can clear that entry, so no factorization $A = LU$ exists until the rows are swapped. For example, $\\begin{pmatrix} k - 2 & 1 \\\\ 3 & 4 \\end{pmatrix}$ needs a swap exactly at $k = 2$.\n\n> **Watch out.** A singular matrix can still have $A = LU$; what blocks it is a zero pivot, not a zero determinant.",
    "不换行的消元要依次除以各个主元。如果第一个元素为零而它下方的元素不为零，第一行的任何倍数都消不掉下方的元素，所以不换行就不存在 $A = LU$ 分解。例如 $\\begin{pmatrix} k - 2 & 1 \\\\ 3 & 4 \\end{pmatrix}$ 恰在 $k = 2$ 时需要换行。\n\n> **注意。** 奇异矩阵仍可能有 $A = LU$；阻碍分解的是零主元，而不是行列式为零。",
  ),
  generate(rng) {
    const q = nonzero(rng, 6);
    const b = nonzero(rng, 5);
    const c = nonzero(rng, 5);
    const d = nonzero(rng, 5);
    const entry = poly([1, "k"], [q, ""]);
    return numberProblem({
      prompt: t(
        `For which value of $k$ does $${mat([
          [entry, b],
          [c, d],
        ])}$ have no factorization $LU$ without a row swap?`,
        `$k$ 取何值时，$${mat([
          [entry, b],
          [c, d],
        ])}$ 不换行就没有 $LU$ 分解？`,
      ),
      answer: -q,
      solveFor: "k",
      mistakes: [
        why(q, `The sign is wrong: $${entry} = 0$ gives $k = ${-q}$.`, `符号错了：$${entry} = 0$ 给出 $k = ${-q}$。`),
        why(
          c,
          `That is the entry below the pivot; the pivot $${entry}$ itself must vanish.`,
          `这是主元下方的元素；需要为零的是主元 $${entry}$ 本身。`,
        ),
        why(
          Q.of(b * c, d).sub(Q.of(q)),
          "That value makes the determinant zero, but a singular matrix still has $LU$ while its first pivot is nonzero.",
          "这个值使行列式为零，但只要第一个主元不为零，奇异矩阵仍有 $LU$ 分解。",
        ),
      ].filter((w, i, all) => {
        const asQ = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v);
        return !asQ(w.value).eq(Q.of(-q)) && all.findIndex((o) => asQ(o.value).eq(asQ(w.value))) === i;
      }),
      solution: walked(
        [
          [
            ["Find the first pivot", "找出第一个主元"],
            t(
              `Elimination divides by the $(1, 1)$ entry $${entry}$ to clear the $${c}$ below it, with multiplier $\\frac{${c}}{${entry}}$.`,
              `消元要除以 $(1, 1)$ 元素 $${entry}$ 来消去其下方的 $${c}$，乘数为 $\\frac{${c}}{${entry}}$。`,
            ),
          ],
          [["Set it to zero", "令其为零"], t("", ""), [`${entry} = 0 \\implies k = ${-q}`]],
        ],
        t(
          `At $k = ${-q}$ the first column is $(0, ${c})$, and no multiple of a row starting with $0$ can clear $${c}$; any other $k$ leaves a nonzero pivot.`,
          `当 $k = ${-q}$ 时第一列为 $(0, ${c})$，首元为 $0$ 的行的任何倍数都消不掉 $${c}$；其他任何 $k$ 都留下非零主元。`,
        ),
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Vector spaces
// ---------------------------------------------------------------------------

const parameterInSpan: KnowledgePointDef = {
  id: "the-component-that-puts-a-vector-in-a-span",
  title: t("The component that puts a vector in a span", "使向量落在张成空间中的分量"),
  explanation: t(
    "To decide what a missing component must be, use the known components to find the coefficients of the combination, then let those coefficients fix the last component. A plane in space leaves exactly one value free of choice for each pair of other components. For example, for $(3, 4, k)$ in the span of $(1, 1, 2)$ and $(1, 2, 0)$, the first two entries give $c_1 + c_2 = 3$ and $c_1 + 2c_2 = 4$, so $c_2 = 1$, $c_1 = 2$ and $k = 2 \\cdot 2 + 1 \\cdot 0 = 4$.\n\n> **Watch out.** The missing entry uses the same weights as the known entries; adding the third entries without the weights gives the wrong value.",
    "要确定缺少的分量，先用已知分量求出线性组合的系数，再由这些系数决定最后一个分量。空间中的平面对其余两个分量的每一组取值，只留下一个可能的值。例如 $(3, 4, k)$ 在 $(1, 1, 2)$ 与 $(1, 2, 0)$ 的张成空间中时，前两个分量给出 $c_1 + c_2 = 3$ 与 $c_1 + 2c_2 = 4$，所以 $c_2 = 1$，$c_1 = 2$，$k = 2 \\cdot 2 + 1 \\cdot 0 = 4$。\n\n> **注意。** 缺少的分量要用与已知分量相同的权重；不带权重直接把第三个分量相加会得到错误的值。",
  ),
  generate(rng) {
    const u = [1, rng.int(1, 3), nonzero(rng, 4)];
    const v = [1, u[1]! + 1, nonzero(rng, 4)];
    const c1 = nonzero(rng, 3);
    const c2 = nonzero(rng, 3);
    const w = u.map((x, i) => c1 * x + c2 * v[i]!);
    return numberProblem({
      prompt: t(
        `The vector $${col(w[0]!, w[1]!, "k")}$ lies in the span of $${col(...u)}$ and $${col(...v)}$. Find $k$.`,
        `向量 $${col(w[0]!, w[1]!, "k")}$ 在 $${col(...u)}$ 和 $${col(...v)}$ 的张成空间中。求 $k$。`,
      ),
      answer: w[2]!,
      solveFor: "k",
      mistakes: [
        why(
          u[2]! + v[2]!,
          "This adds the third entries without the weights; find $c_1$ and $c_2$ first.",
          "这是不带权重直接把第三个分量相加；要先求出 $c_1$ 与 $c_2$。",
        ),
        why(c2 * u[2]! + c1 * v[2]!, "The weights are swapped: $c_1$ goes with the first vector.", "权重对调了：$c_1$ 乘第一个向量。"),
        why(
          w[0]! + w[1]!,
          "This adds the two known entries; the missing entry comes from the weights of the combination.",
          "这是把两个已知分量相加；缺少的分量要由组合的权重求出。",
        ),
      ].filter((m, i, all) => m.value !== w[2]! && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Equations from the known entries", "由已知分量列方程"],
            t("The first two entries give:", "前两个分量给出："),
            [`c_1 + c_2 = ${w[0]}`, `${poly([u[1]!, "c_1"], [v[1]!, "c_2"])} = ${w[1]}`],
          ],
          [
            ["Solve for the weights", "解出权重"],
            t(`Subtract $${u[1]}$ times the first equation from the second:`, `第二个方程减去第一个方程的 $${u[1]}$ 倍：`),
            [`c_2 = ${w[1]} - ${u[1]} \\cdot ${inParens(w[0]!)} = ${c2}`, `c_1 = ${w[0]} - ${inParens(c2)} = ${c1}`],
          ],
          [
            ["The third entry", "第三个分量"],
            t("", ""),
            [`k = ${c1} \\cdot ${inParens(u[2]!)} + ${inParens(c2)} \\cdot ${inParens(v[2]!)} = ${w[2]}`],
          ],
        ],
        t(
          `With these weights the second entry is $${u[1]} \\cdot ${inParens(c1)} + ${v[1]} \\cdot ${inParens(c2)} = ${w[1]}$, as given.`,
          `用这组权重，第二个分量为 $${u[1]} \\cdot ${inParens(c1)} + ${v[1]} \\cdot ${inParens(c2)} = ${w[1]}$，与已知相符。`,
        ),
      ),
    });
  },
};

const parameterForDependence: KnowledgePointDef = {
  id: "the-parameter-that-makes-two-vectors-dependent",
  title: t("The parameter that makes two vectors dependent", "使两个向量相关的参数"),
  explanation: t(
    "Two vectors in the plane are dependent exactly when the determinant of the matrix with those columns is zero. A parameter that appears twice makes this a quadratic equation, and so there can be two values. For example, $(k, 2)$ and $(8, k)$ give the determinant $k^2 - 16$, which is zero at $k = 4$ and $k = -4$.\n\n> **Watch out.** Solving $k^2 = 16$ gives two roots; keep the one with the sign the question asks for, and do not stop at $k^2$.",
    "平面上两个向量线性相关，当且仅当以它们为列的矩阵行列式为零。参数出现两次时，这就成了二次方程，所以可能有两个值。例如 $(k, 2)$ 与 $(8, k)$ 的行列式为 $k^2 - 16$，它在 $k = 4$ 与 $k = -4$ 时为零。\n\n> **注意。** 解 $k^2 = 16$ 得到两个根；要保留题目要求符号的那个，并且不要停在 $k^2$。",
  ),
  generate(rng) {
    const m = rng.int(2, 12);
    const a = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== m && (m * m) % x === 0));
    const positive = rng.int(0, 1) === 0;
    const answer = positive ? m : -m;
    const b = (m * m) / a;
    return numberProblem({
      prompt: t(
        `The vectors $${col("k", a)}$ and $${col(b, "k")}$ are linearly dependent, and $k$ is ${positive ? "positive" : "negative"}. Find $k$.`,
        `向量 $${col("k", a)}$ 和 $${col(b, "k")}$ 线性相关，且 $k$ 为${positive ? "正" : "负"}数。求 $k$。`,
      ),
      answer,
      solveFor: "k",
      mistakes: [
        why(m * m, `That is $k^2$; take the square root to find $k$.`, `这是 $k^2$；要开平方才得到 $k$。`),
        why(
          a + b,
          "Adding the two entries does not test dependence; set the determinant to zero.",
          "把两个元素相加并不能检验相关性；要令行列式为零。",
        ),
        why(
          -answer,
          `This root has the wrong sign; $k$ is ${positive ? "positive" : "negative"}.`,
          `这个根的符号不对；$k$ 是${positive ? "正" : "负"}数。`,
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Set the determinant to zero", "令行列式为零"],
            t("Put the two vectors in the columns:", "把两个向量作为列："),
            [
              `\\det ${mat([
                ["k", b],
                [a, "k"],
              ])} = k^2 - ${a} \\cdot ${b} = k^2 - ${a * b} = 0`,
            ],
          ],
          [["Solve", "求解"], t(`$k^2 = ${a * b}$ has two roots:`, `$k^2 = ${a * b}$ 有两个根：`), [`k = \\pm ${m}`]],
          [
            ["Choose the sign", "选取符号"],
            t(
              `$k$ is ${positive ? "positive" : "negative"}, so $k = ${answer}$.`,
              `$k$ 为${positive ? "正" : "负"}数，所以 $k = ${answer}$。`,
            ),
          ],
        ],
        t(
          `With $k = ${answer}$ the vectors are $(${answer}, ${a})$ and $(${b}, ${answer})$, and $(${b}, ${answer}) = ${frac(b, answer)}(${answer}, ${a})$, since $${frac(b, answer)} \\cdot ${a} = ${frac(b * a, answer)} = ${answer}$.`,
          `取 $k = ${answer}$，两个向量为 $(${answer}, ${a})$ 与 $(${b}, ${answer})$，而 $(${b}, ${answer}) = ${frac(b, answer)}(${answer}, ${a})$，因为 $${frac(b, answer)} \\cdot ${a} = ${frac(b * a, answer)} = ${answer}$。`,
        ),
      ),
    });
  },
};

const planeOfAColumnSpace: KnowledgePointDef = {
  id: "the-equation-of-a-column-space",
  figure: linearAlgebraDrawings1["the-column-space-of-a-matrix#the-equation-of-a-column-space"],
  title: t("The equation of a column space", "列空间的方程"),
  explanation: t(
    "The column space of a matrix with two independent columns in $\\mathbb{R}^3$ is a plane through the origin. Its normal is perpendicular to both columns, so the cross product of the columns gives the equation of the plane. For example, the columns $(1, 0, 1)$ and $(0, 1, 1)$ have cross product $(-1, -1, 1)$, so the column space is $-x - y + z = 0$.\n\n> **Watch out.** An equation that fits only one column is not the plane; put both columns into it and get $0$ each time.",
    "$\\mathbb{R}^3$ 中有两个独立列的矩阵，其列空间是过原点的平面。法向量与两列都垂直，所以两列的向量积给出平面方程。例如列 $(1, 0, 1)$ 与 $(0, 1, 1)$ 的向量积为 $(-1, -1, 1)$，所以列空间为 $-x - y + z = 0$。\n\n> **注意。** 只符合一列的方程不是这个平面；把两列都代入，每次都要得到 $0$。",
  ),
  generate(rng) {
    let u: number[];
    let v: number[];
    let n: number[];
    do {
      u = [rng.int(1, 3), rng.int(-2, 3), rng.int(-2, 3)];
      v = [rng.int(-2, 3), rng.int(1, 3), rng.int(-2, 3)];
      n = [u[1]! * v[2]! - u[2]! * v[1]!, u[2]! * v[0]! - u[0]! * v[2]!, u[0]! * v[1]! - u[1]! * v[0]!];
    } while (n.some((x) => x === 0) || new Set(n.map(Math.abs)).size < 3);
    const wrongNormals = [
      [n[1]!, n[0]!, n[2]!],
      [n[0]!, -n[1]!, n[2]!],
      [n[2]!, n[1]!, n[0]!],
    ];
    const at = (normal: readonly number[], p: readonly number[]) =>
      `${inParens(normal[0]!)} \\cdot ${inParens(p[0]!)} + ${inParens(normal[1]!)} \\cdot ${inParens(p[1]!)} + ${inParens(normal[2]!)} \\cdot ${inParens(p[2]!)}`;
    // reason names a column that the wrong plane misses; each wrong normal is not a multiple of n, so one column fails.
    const reason = (normal: readonly number[]): [string, string, string] => {
      const [name, p] = dot(normal, u) !== 0 ? ["first", u] : ["second", v];
      const zh = name === "first" ? "第一" : "第二";
      return [
        `$${linear(normal)} = 0$`,
        `The ${name} column does not satisfy it: $${at(normal, p)} = ${dot(normal, p)} \\neq 0$.`,
        `${zh}列不满足它：$${at(normal, p)} = ${dot(normal, p)} \\neq 0$。`,
      ];
    };
    return reasoned(
      pickChoice(
        rng,
        t(
          `Which equation describes the column space of $${mat([
            [u[0]!, v[0]!],
            [u[1]!, v[1]!],
            [u[2]!, v[2]!],
          ])}$?`,
          `哪个方程描述 $${mat([
            [u[0]!, v[0]!],
            [u[1]!, v[1]!],
            [u[2]!, v[2]!],
          ])}$ 的列空间？`,
        ),
        both(`${linear(n)} = 0`),
        wrongNormals.map((w) => both(`${linear(w)} = 0`)),
        walked(
          [
            [
              ["Cross the columns", "求两列的向量积"],
              t("The normal of the plane is perpendicular to both columns:", "平面的法向量与两列都垂直："),
              [
                `${inParens(u[1]!)} \\cdot ${inParens(v[2]!)} - ${inParens(u[2]!)} \\cdot ${inParens(v[1]!)} = ${n[0]}`,
                `${inParens(u[2]!)} \\cdot ${inParens(v[0]!)} - ${inParens(u[0]!)} \\cdot ${inParens(v[2]!)} = ${n[1]}`,
                `${inParens(u[0]!)} \\cdot ${inParens(v[1]!)} - ${inParens(u[1]!)} \\cdot ${inParens(v[0]!)} = ${n[2]}`,
              ],
            ],
            [
              ["Write the plane", "写出平面"],
              t("The plane through the origin with this normal is:", "过原点、以此为法向量的平面为："),
              [`${linear(n)} = 0`],
            ],
          ],
          t(`Both columns satisfy it: $${at(n, u)} = 0$ and $${at(n, v)} = 0$.`, `两列都满足它：$${at(n, u)} = 0$，$${at(n, v)} = 0$。`),
        ),
      ),
      wrongNormals.map(reason),
    );
  },
};

const parameterForRankOne: KnowledgePointDef = {
  id: "the-entry-that-makes-the-rank-one",
  title: t("The entry that makes the rank one", "使秩为 1 的元素"),
  explanation: t(
    "A nonzero matrix has rank one exactly when every row is a multiple of a single row. The known entries of a second row show which multiple it must be, and that multiple fixes the unknown entry. For example, if row 1 is $(1, 2, 5)$ and row 2 is $(3, 6, k)$, row 2 is $3$ times row 1, so $k = 3 \\cdot 5 = 15$.\n\n> **Watch out.** The multiple is the same in every column, so the unknown entry is the multiple times the entry above it, not that entry plus something.",
    "非零矩阵的秩为 1，当且仅当每一行都是同一行的倍数。第二行的已知元素说明了倍数是多少，这个倍数决定了未知元素。例如第 1 行为 $(1, 2, 5)$、第 2 行为 $(3, 6, k)$ 时，第 2 行是第 1 行的 $3$ 倍，所以 $k = 3 \\cdot 5 = 15$。\n\n> **注意。** 每一列的倍数都相同，所以未知元素等于倍数乘它上方的元素，而不是上方元素加上某个数。",
  ),
  generate(rng) {
    const a = nonzero(rng, 4);
    const b = nonzero(rng, 4);
    const c = nonzero(rng, 4);
    const k = c * b;
    return numberProblem({
      prompt: t(
        `The matrix $${mat([
          [1, a, b],
          [c, c * a, "k"],
        ])}$ has rank 1. Find $k$.`,
        `矩阵 $${mat([
          [1, a, b],
          [c, c * a, "k"],
        ])}$ 的秩为 1。求 $k$。`,
      ),
      answer: k,
      solveFor: "k",
      mistakes: [
        why(
          b,
          "That copies the entry above; row 2 is a multiple of row 1, so multiply it.",
          "这是照抄上方的元素；第 2 行是第 1 行的倍数，要乘上倍数。",
        ),
        why(
          c + b,
          "That adds the multiple; every entry of row 2 is the multiple times the entry above it.",
          "这是加上了倍数；第 2 行每个元素都是倍数乘上方的元素。",
        ),
        why(
          a * b,
          `The multiple comes from the first column, $${c} \\div 1 = ${c}$, not from the entry $${a}$.`,
          `倍数来自第一列，$${c} \\div 1 = ${c}$，而不是元素 $${a}$。`,
        ),
      ].filter((m, i, all) => m.value !== k && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Find the multiple", "求倍数"],
            t(
              `Row 1 starts with $1$ and row 2 with $${c}$, and the second column agrees: $${inParens(c)} \\cdot ${inParens(a)} = ${c * a}$. So row 2 is $${c}$ times row 1.`,
              `第 1 行以 $1$ 开头，第 2 行以 $${c}$ 开头，第二列也吻合：$${inParens(c)} \\cdot ${inParens(a)} = ${c * a}$。所以第 2 行是第 1 行的 $${c}$ 倍。`,
            ),
          ],
          [["Apply it to the last column", "用于最后一列"], t("", ""), [`k = ${inParens(c)} \\cdot ${inParens(b)} = ${k}`]],
        ],
        t(
          `With $k = ${k}$, row 2 is $(${c}, ${c * a}, ${k}) = ${c}(1, ${a}, ${b})$, so the two rows are dependent and the rank is $1$.`,
          `取 $k = ${k}$，第 2 行为 $(${c}, ${c * a}, ${k}) = ${c}(1, ${a}, ${b})$，两行线性相关，秩为 $1$。`,
        ),
      ),
    });
  },
};

const betweenTwoBases: KnowledgePointDef = {
  id: "coordinates-from-one-basis-to-another",
  title: t("Coordinates from one basis to another", "从一组基的坐标到另一组基的坐标"),
  explanation: t(
    "To pass from coordinates in a basis $\\mathcal{B}$ to coordinates in a basis $\\mathcal{C}$, go through the vector itself: multiply by the matrix $P_{\\mathcal{B}}$ to get the vector, then solve with $P_{\\mathcal{C}}$. So $[\\mathbf{x}]_{\\mathcal{C}} = P_{\\mathcal{C}}^{-1}P_{\\mathcal{B}}[\\mathbf{x}]_{\\mathcal{B}}$. For example, with $\\mathcal{B} = \\{(1, 1), (0, 1)\\}$, $\\mathcal{C} = \\{(1, 0), (1, 1)\\}$ and $[\\mathbf{x}]_{\\mathcal{B}} = (2, 1)$, the vector is $(2, 3)$, and $-1(1, 0) + 3(1, 1) = (2, 3)$ gives $[\\mathbf{x}]_{\\mathcal{C}} = (-1, 3)$.\n\n> **Watch out.** The vector itself is a stop on the way, not the answer; it still has to be written in $\\mathcal{C}$.",
    "要从基 $\\mathcal{B}$ 下的坐标得到基 $\\mathcal{C}$ 下的坐标，先经过向量本身：乘 $P_{\\mathcal{B}}$ 得到向量，再用 $P_{\\mathcal{C}}$ 求解。所以 $[\\mathbf{x}]_{\\mathcal{C}} = P_{\\mathcal{C}}^{-1}P_{\\mathcal{B}}[\\mathbf{x}]_{\\mathcal{B}}$。例如 $\\mathcal{B} = \\{(1, 1), (0, 1)\\}$，$\\mathcal{C} = \\{(1, 0), (1, 1)\\}$，$[\\mathbf{x}]_{\\mathcal{B}} = (2, 1)$ 时，向量为 $(2, 3)$，而 $-1(1, 0) + 3(1, 1) = (2, 3)$，所以 $[\\mathbf{x}]_{\\mathcal{C}} = (-1, 3)$。\n\n> **注意。** 向量本身只是中间一步，不是答案；还要把它用 $\\mathcal{C}$ 表示出来。",
  ),
  generate(rng) {
    const C = unimodular(rng);
    const Bm = [
      [rng.int(1, 3), nonzero(rng, 2)],
      [nonzero(rng, 2), rng.int(1, 4)],
    ];
    if (det(Bm) === 0) Bm[1]![1]! += 1;
    const coords = [nonzero(rng, 3), nonzero(rng, 3)];
    const x = [dot(Bm[0]!, coords), dot(Bm[1]!, coords)];
    const answer = times(inverse2(C), [[x[0]!], [x[1]!]]).map((r) => r[0]!);
    const column = (m: number[][], j: number) => col(m[0]![j]!, m[1]![j]!);
    const Ci = inverse2(C);
    const back = [C[0]![0]! * answer[0]! + C[0]![1]! * answer[1]!, C[1]![0]! * answer[0]! + C[1]![1]! * answer[1]!];
    return withMistakes(
      pointProblem({
        prompt: t(
          `A vector has coordinates $(${coords.join(", ")})$ in the basis $\\mathcal{B} = \\{${column(Bm, 0)}, ${column(Bm, 1)}\\}$. Find its coordinates in the basis $\\mathcal{C} = \\{${column(C, 0)}, ${column(C, 1)}\\}$.`,
          `一个向量在基 $\\mathcal{B} = \\{${column(Bm, 0)}, ${column(Bm, 1)}\\}$ 下的坐标是 $(${coords.join(", ")})$。求它在基 $\\mathcal{C} = \\{${column(C, 0)}, ${column(C, 1)}\\}$ 下的坐标。`,
        ),
        answer,
        solution: walked(
          [
            [
              ["Find the vector", "求出向量"],
              t("Multiply the matrix of $\\mathcal{B}$ by the coordinates:", "用 $\\mathcal{B}$ 的矩阵乘坐标："),
              [`\\mathbf{x} = ${mat(Bm)}${col(...coords)} = ${col(...x)}`],
            ],
            [
              ["Invert the matrix of C", "求 C 的矩阵的逆"],
              t(`$\\det P_{\\mathcal{C}} = ${det(C)}$, so:`, `$\\det P_{\\mathcal{C}} = ${det(C)}$，所以：`),
              [`P_{\\mathcal{C}}^{-1} = ${mat(Ci)}`],
            ],
            [["Convert", "转换"], t("", ""), [`[\\mathbf{x}]_{\\mathcal{C}} = ${mat(Ci)}${col(...x)} = ${col(...answer)}`]],
          ],
          t(
            `$${answer[0]}${column(C, 0)} + ${inParens(answer[1]!)}${column(C, 1)} = ${col(...back)} = \\mathbf{x}$.`,
            `$${answer[0]}${column(C, 0)} + ${inParens(answer[1]!)}${column(C, 1)} = ${col(...back)} = \\mathbf{x}$。`,
          ),
        ),
      }),
      [
        say(
          pointLatex(coords),
          "These are the $\\mathcal{B}$-coordinates unchanged; they describe the vector in the other basis.",
          "这是未经转换的 $\\mathcal{B}$ 坐标；它们描述的是另一组基下的向量。",
        ),
        say(
          pointLatex(x),
          "This is the vector in standard coordinates; it still has to be written in $\\mathcal{C}$.",
          "这是标准坐标下的向量；还要把它用 $\\mathcal{C}$ 表示。",
        ),
        say(
          pointLatex(times(C, [[x[0]!], [x[1]!]]).map((r) => r[0]!)),
          "This multiplies the vector by $P_{\\mathcal{C}}$; coordinates in $\\mathcal{C}$ need $P_{\\mathcal{C}}^{-1}$.",
          "这是用 $P_{\\mathcal{C}}$ 乘向量；求 $\\mathcal{C}$ 坐标要用 $P_{\\mathcal{C}}^{-1}$。",
        ),
      ].filter((m, i, all) => m.response !== pointLatex(answer) && all.findIndex((o) => o.response === m.response) === i),
    );
  },
};

const dimensionOfFamilies: KnowledgePointDef = {
  id: "the-dimension-of-a-family-of-matrices-or-polynomials",
  title: t("The dimension of a family of matrices or polynomials", "矩阵族或多项式族的维数"),
  explanation: t(
    "Count the free choices. A symmetric $n \\times n$ matrix is fixed by its entries on and above the diagonal, a skew-symmetric one by those strictly above it. Each independent linear condition, such as a zero trace or a prescribed root, removes one dimension. For example, the polynomials of degree at most $3$ with $p(2) = 0$ have $4$ coefficients and one condition, so they form a space of dimension $3$, with basis $t - 2$, $t(t - 2)$, $t^2(t - 2)$.\n\n> **Watch out.** Start from the right count before the conditions: $\\mathbb{P}_n$ has $n + 1$ coefficients, and a skew-symmetric matrix has a zero diagonal, so its diagonal entries are not free.",
    "数一数自由选择的个数。$n$ 阶对称矩阵由对角线及其上方的元素决定，反对称矩阵由严格上方的元素决定。每个独立的线性条件，比如迹为零或指定一个根，都减少一维。例如次数不超过 $3$ 且 $p(2) = 0$ 的多项式有 $4$ 个系数和一个条件，所以构成 $3$ 维空间，一组基为 $t - 2$、$t(t - 2)$、$t^2(t - 2)$。\n\n> **注意。** 加条件之前先数对总数：$\\mathbb{P}_n$ 有 $n + 1$ 个系数；反对称矩阵的对角线为零，对角元不是自由的。",
  ),
  generate(rng) {
    const n = rng.int(2, 5);
    const a = nonzero(rng, 3);
    const b = a + rng.int(1, 3);
    const families: readonly [Text, number, string, string][] = [
      [
        t(`symmetric ${n}×${n} matrices`, `${n} 阶对称矩阵`),
        (n * (n + 1)) / 2,
        `$${n}$ entries on the diagonal and $${(n * (n - 1)) / 2}$ above it are free.`,
        `对角线上 $${n}$ 个、上方 $${(n * (n - 1)) / 2}$ 个元素是自由的。`,
      ],
      [
        t(`skew-symmetric ${n}×${n} matrices`, `${n} 阶反对称矩阵`),
        (n * (n - 1)) / 2,
        `The diagonal must be zero, so only the $${(n * (n - 1)) / 2}$ entries above it are free.`,
        `对角线必须为零，所以只有上方的 $${(n * (n - 1)) / 2}$ 个元素是自由的。`,
      ],
      [
        t(`${n}×${n} matrices with trace zero`, `迹为零的 ${n} 阶矩阵`),
        n * n - 1,
        `All $${n * n}$ entries are subject to one linear condition.`,
        `$${n * n}$ 个元素满足一个线性条件。`,
      ],
      [
        t(`polynomials $p$ of degree at most ${n} with $p(${a}) = 0$`, `次数不超过 ${n} 且 $p(${a}) = 0$ 的多项式 $p$`),
        n,
        `The $${n + 1}$ coefficients are subject to one linear condition.`,
        `$${n + 1}$ 个系数满足一个线性条件。`,
      ],
      [
        t(`polynomials $p$ of degree at most ${n} with $p(${a}) = p(${b}) = 0$`, `次数不超过 ${n} 且 $p(${a}) = p(${b}) = 0$ 的多项式 $p$`),
        n - 1,
        `The $${n + 1}$ coefficients are subject to two independent linear conditions.`,
        `$${n + 1}$ 个系数满足两个独立的线性条件。`,
      ],
    ];
    const choice = rng.pick([0, 1, 2, 3, 4]);
    const [family, answer, count, countZh] = families[choice]!;
    const total = choice < 3 ? n * n : n + 1;
    const conditions = [
      `$A^T = A$ ties each entry below the diagonal to the one above it.`,
      `$A^T = -A$ ties each entry below the diagonal to the one above it and forces $a_{ii} = -a_{ii}$, so $a_{ii} = 0$.`,
      `$a_{11} + \\dots + a_{${n}${n}} = 0$ is one linear equation in the entries.`,
      `$p(${a}) = 0$ is one linear equation in the coefficients.`,
      `$p(${a}) = 0$ and $p(${b}) = 0$ are two linear equations, independent because $${a} \\ne ${b}$.`,
    ];
    const conditionsZh = [
      `$A^T = A$ 使对角线下方的每个元素等于上方对应的元素。`,
      `$A^T = -A$ 使对角线下方的每个元素由上方对应元素确定，并迫使 $a_{ii} = -a_{ii}$，即 $a_{ii} = 0$。`,
      `$a_{11} + \\dots + a_{${n}${n}} = 0$ 是关于元素的一个线性方程。`,
      `$p(${a}) = 0$ 是关于系数的一个线性方程。`,
      `$p(${a}) = 0$ 与 $p(${b}) = 0$ 是两个线性方程，因 $${a} \\ne ${b}$ 而相互独立。`,
    ];
    const mistakes =
      choice < 3
        ? [
            why(
              n * n,
              "That is the dimension of all $n \\times n$ matrices; the condition takes some freedom away.",
              "这是全部 $n \\times n$ 矩阵的维数；条件会减少自由度。",
            ),
            why(
              n,
              "That counts only the diagonal; entries off the diagonal can be free too.",
              "这只数了对角线；对角线以外的元素也可以是自由的。",
            ),
            ...(choice === 0
              ? [
                  why(
                    (n * (n - 1)) / 2,
                    "That leaves out the diagonal, which is free for a symmetric matrix.",
                    "这漏掉了对角线，而对称矩阵的对角元是自由的。",
                  ),
                ]
              : choice === 1
                ? [
                    why(
                      (n * (n + 1)) / 2,
                      "That counts the diagonal, but $A^T = -A$ forces the diagonal entries to be $0$.",
                      "这把对角线也算上了，但 $A^T = -A$ 迫使对角元为 $0$。",
                    ),
                  ]
                : [
                    why(
                      n * n - n,
                      "One equation on the trace removes one dimension, not one per diagonal entry.",
                      "关于迹的一个方程只减少一维，而不是每个对角元减一维。",
                    ),
                  ]),
          ]
        : [
            why(
              n + 1,
              `That is the dimension of all of $\\mathbb{P}_{${n}}$; each condition removes one dimension.`,
              `这是整个 $\\mathbb{P}_{${n}}$ 的维数；每个条件减少一维。`,
            ),
            why(
              answer - 1,
              `$\\mathbb{P}_{${n}}$ has $${n + 1}$ coefficients, counting the constant term, so start from $${n + 1}$.`,
              `$\\mathbb{P}_{${n}}$ 算上常数项有 $${n + 1}$ 个系数，所以从 $${n + 1}$ 开始数。`,
            ),
          ];
    return numberProblem({
      prompt: t(`What is the dimension of the space of ${family.en}?`, `由${family["zh-CN"]}组成的空间是多少维？`),
      answer,
      form: "integer",
      mistakes: mistakes.filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Count before the conditions", "先数条件前的个数"],
            t(
              choice < 3
                ? `Each $${n} \\times ${n}$ matrix has $${n * n}$ entries.`
                : `A polynomial of degree at most $${n}$ has $${n + 1}$ coefficients, $a_0$ to $a_{${n}}$.`,
              choice < 3
                ? `$${n} \\times ${n}$ 矩阵有 $${n * n}$ 个元素。`
                : `次数不超过 $${n}$ 的多项式有 $${n + 1}$ 个系数，从 $a_0$ 到 $a_{${n}}$。`,
            ),
          ],
          [["Apply the conditions", "应用条件"], t(conditions[choice]!, conditionsZh[choice]!)],
          [["Count the free choices", "数自由选择"], t(count, countZh)],
        ],
        t(
          `The dimension is $${answer}$, and $${total} - ${total - answer} = ${answer}$: the conditions remove $${total - answer}$ of the $${total}$ starting choices.`,
          `维数是 $${answer}$，且 $${total} - ${total - answer} = ${answer}$：条件去掉了起初 $${total}$ 个选择中的 $${total - answer}$ 个。`,
        ),
      ),
    });
  },
};

const coordinatesAroundAPoint: KnowledgePointDef = {
  id: "coordinates-in-powers-of-x-minus-a",
  title: t("Coordinates in powers of $x - a$", "以 $x - a$ 的幂为基的坐标"),
  explanation: t(
    "The polynomials $1$, $x-a$ and $(x-a)^2$ form a basis of the polynomials of degree at most two. Coordinates in this basis come from rewriting the polynomial: the coefficient of $x^2$ is the last coordinate, then subtract and continue downward. For example, $x^2 + 1 = 2 + 2(x - 1) + (x - 1)^2$, since the right side expands to $2 + 2x - 2 + x^2 - 2x + 1 = x^2 + 1$, so the coordinates are $(2, 2, 1)$.\n\n> **Watch out.** Only the top coordinate equals an ordinary coefficient; the other two change, because $(x - a)^2$ also contributes to the $x$ and constant terms.",
    "多项式 $1$、$x-a$、$(x-a)^2$ 构成次数不超过二的多项式空间的一组基。这组基下的坐标来自改写多项式：$x^2$ 的系数是最后一个坐标，然后减去这一项再继续往下。例如 $x^2 + 1 = 2 + 2(x - 1) + (x - 1)^2$，因为右边展开为 $2 + 2x - 2 + x^2 - 2x + 1 = x^2 + 1$，所以坐标为 $(2, 2, 1)$。\n\n> **注意。** 只有最高次的坐标等于原来的系数；另外两个会改变，因为 $(x - a)^2$ 也贡献了 $x$ 项和常数项。",
  ),
  generate(rng) {
    const a = nonzero(rng, 3);
    const c2 = nonzero(rng, 3);
    const c1 = nonzero(rng, 4);
    const c0 = nonzero(rng, 5);
    const p1 = c1 - 2 * a * c2;
    const p0 = c0 - a * c1 + a * a * c2;
    const base = a > 0 ? `x - ${a}` : `x + ${-a}`;
    const answer = [c0, c1, c2];
    const given = poly([c2, "x^2"], [p1, "x"], [p0, ""]);
    return withMistakes(
      pointProblem({
        prompt: t(
          `Write $${given}$ as $c_0 + c_1(${base}) + c_2(${base})^2$. Answer as $(c_0, c_1, c_2)$.`,
          `把 $${given}$ 写成 $c_0 + c_1(${base}) + c_2(${base})^2$，答案写成 $(c_0, c_1, c_2)$。`,
        ),
        answer,
        vars: ["c_0", "c_1", "c_2"],
        solution: walked(
          [
            [
              ["Match $x^2$", "比较 $x^2$"],
              t(`Only $c_2(${base})^2$ has an $x^2$ term, so $c_2 = ${c2}$.`, `只有 $c_2(${base})^2$ 含 $x^2$ 项，所以 $c_2 = ${c2}$。`),
            ],
            [
              ["Match $x$", "比较 $x$"],
              t(`$(${base})^2$ contributes $${-2 * a}x$, so the $x$ terms give:`, `$(${base})^2$ 贡献 $${-2 * a}x$，所以 $x$ 项给出：`),
              [`c_1 + ${inParens(c2)} \\cdot ${inParens(-2 * a)} = ${p1}`, `c_1 = ${c1}`],
            ],
            [
              [`Set $x = ${a}$`, `令 $x = ${a}$`],
              t(
                "Both other terms vanish there, so $c_0$ is the value of the polynomial at that point:",
                "在该点另外两项都为零，所以 $c_0$ 就是多项式在该点的值：",
              ),
              [`c_0 = ${inParens(c2)} \\cdot ${inParens(a * a)} + ${inParens(p1)} \\cdot ${inParens(a)} + ${inParens(p0)} = ${c0}`],
            ],
          ],
          t(
            `At $x = 0$: $${c0} + ${inParens(c1)} \\cdot ${inParens(-a)} + ${inParens(c2)} \\cdot ${inParens(a * a)} = ${p0}$, the constant term of the given polynomial.`,
            `在 $x = 0$ 处：$${c0} + ${inParens(c1)} \\cdot ${inParens(-a)} + ${inParens(c2)} \\cdot ${inParens(a * a)} = ${p0}$，正是所给多项式的常数项。`,
          ),
        ),
      }),
      [
        say(
          pointLatex([p0, p1, c2]),
          "These are the ordinary coefficients; in the shifted basis the lower two coordinates change.",
          "这是原来的系数；在平移后的基下，较低的两个坐标会改变。",
        ),
        say(pointLatex([c2, c1, c0]), "The order is reversed: $c_0$, the weight on $1$, comes first.", "顺序反了：$1$ 的权重 $c_0$ 在前。"),
        say(
          pointLatex([p0, c1, c2]),
          `$c_0$ is the value at $x = ${a}$, not the value at $x = 0$.`,
          `$c_0$ 是在 $x = ${a}$ 处的值，而不是在 $x = 0$ 处的值。`,
        ),
      ].filter((m, i, all) => m.response !== pointLatex(answer) && all.findIndex((o) => o.response === m.response) === i),
    );
  },
};

// ---------------------------------------------------------------------------
// Transformations and eigenvalues
// ---------------------------------------------------------------------------

/** moves are the transformations of the plane that a composition question draws on. */
const moves: readonly (readonly [Text, Grid])[] = [
  [
    t("a rotation by 90° counterclockwise", "逆时针旋转 90°"),
    [
      [0, -1],
      [1, 0],
    ],
  ],
  [
    t("a reflection in the $x$-axis", "关于 $x$ 轴的反射"),
    [
      [1, 0],
      [0, -1],
    ],
  ],
  [
    t("a reflection in the $y$-axis", "关于 $y$ 轴的反射"),
    [
      [-1, 0],
      [0, 1],
    ],
  ],
  [
    t("a reflection in the line $y = x$", "关于直线 $y = x$ 的反射"),
    [
      [0, 1],
      [1, 0],
    ],
  ],
  [
    t("a horizontal shear by $x \\mapsto x + 2y$", "水平剪切 $x \\mapsto x + 2y$"),
    [
      [1, 2],
      [0, 1],
    ],
  ],
  [
    t("a rotation by 90° clockwise", "顺时针旋转 90°"),
    [
      [0, 1],
      [-1, 0],
    ],
  ],
  [
    t("a reflection in the line $y = -x$", "关于直线 $y = -x$ 的反射"),
    [
      [0, -1],
      [-1, 0],
    ],
  ],
  [
    t("a vertical shear by $y \\mapsto y + 3x$", "竖直剪切 $y \\mapsto y + 3x$"),
    [
      [1, 0],
      [3, 1],
    ],
  ],
];

const composingTransformations: KnowledgePointDef = {
  id: "the-matrix-of-a-composition-of-two-transformations",
  title: t("The matrix of a composition of two transformations", "两个变换复合的矩阵"),
  explanation: t(
    "Applying $S$ first and then $T$ sends $\\mathbf{x}$ to $T(S\\mathbf{x})$, so the matrix of the composition is $TS$: the transformation applied first stands on the right. Reversing the factors usually gives a different transformation. For example, the reflection $F = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$ followed by the quarter turn $R = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$ has matrix $RF = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$.\n\n> **Watch out.** Write the matrices in the opposite order to the words: the one done first goes on the right.",
    "先作 $S$ 再作 $T$，把 $\\mathbf{x}$ 变成 $T(S\\mathbf{x})$，所以复合的矩阵是 $TS$：先作用的变换写在右边。交换因子通常得到另一个变换。例如先作反射 $F = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$，再作四分之一圈旋转 $R = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$，矩阵是 $RF = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$。\n\n> **注意。** 矩阵的书写顺序与叙述顺序相反：先作的那个写在右边。",
  ),
  generate(rng) {
    let first: (typeof moves)[number];
    let second: (typeof moves)[number];
    let right: number[][];
    let reversed: number[][];
    do {
      [first, second] = rng.shuffle(moves) as unknown as [(typeof moves)[number], (typeof moves)[number]];
      right = times(second[1], first[1]);
      reversed = times(first[1], second[1]);
    } while (JSON.stringify(right) === JSON.stringify(reversed));
    const options = [both(mat(reversed)), both(mat(first[1])), both(mat(second[1]))];
    return reasoned(
      pickChoice(
        rng,
        t(
          `A transformation of the plane is ${first[0].en}, followed by ${second[0].en}. What is its standard matrix?`,
          `平面上的一个变换是先作${first[0]["zh-CN"]}，再作${second[0]["zh-CN"]}。它的标准矩阵是什么？`,
        ),
        both(mat(right)),
        options,
        t(
          `The transformation applied first stands on the right, so the matrix is $${mat(second[1])}${mat(first[1])} = ${mat(right)}$.`,
          `先作用的变换写在右边，所以矩阵是 $${mat(second[1])}${mat(first[1])} = ${mat(right)}$。`,
        ),
      ),
      [
        [
          options[0]!.en,
          "The factors are in the wrong order: the transformation applied first stands on the right.",
          "因子顺序反了：先作用的变换写在右边。",
        ],
        [
          options[1]!.en,
          "That is only the first transformation; the second one is still to be applied.",
          "这只是第一个变换；还要再作第二个变换。",
        ],
        [
          options[2]!.en,
          "That is only the second transformation; the first one must be applied before it.",
          "这只是第二个变换；在它之前还要先作第一个变换。",
        ],
      ],
    );
  },
};

const otherEigenvalue: KnowledgePointDef = {
  id: "the-other-eigenvalue-from-the-trace",
  title: t("The other eigenvalue from the trace", "由迹求另一个特征值"),
  explanation: t(
    "The eigenvalues of a $2 \\times 2$ matrix add up to its trace and multiply to its determinant. So once one eigenvalue is known, the other follows from the trace, with no need to solve the characteristic equation. For example, $\\begin{pmatrix} 4 & 1 \\\\ 2 & 3 \\end{pmatrix}$ has trace $7$ and eigenvalue $2$, so the other eigenvalue is $7 - 2 = 5$.\n\n> **Watch out.** The trace is the sum of both eigenvalues; subtract the known one from it.",
    "二阶矩阵的特征值之和等于迹，之积等于行列式。所以知道一个特征值后，由迹就能得到另一个，不必再解特征方程。例如 $\\begin{pmatrix} 4 & 1 \\\\ 2 & 3 \\end{pmatrix}$ 的迹为 $7$，有特征值 $2$，所以另一个特征值是 $7 - 2 = 5$。\n\n> **注意。** 迹是两个特征值之和；要从中减去已知的那个。",
  ),
  generate(rng) {
    const l1 = nonzero(rng, 5);
    let l2 = nonzero(rng, 5);
    if (l2 === l1) l2 = l1 + 1 === 0 ? 2 : l1 + 1;
    const A = withEigenvalues(rng, l1, l2);
    const trace = l1 + l2;
    return numberProblem({
      prompt: t(`One eigenvalue of $${mat(A)}$ is $${l1}$. Find the other.`, `$${mat(A)}$ 的一个特征值是 $${l1}$。求另一个。`),
      answer: l2,
      form: "integer",
      mistakes: [
        why(
          l1 - trace,
          "The subtraction is the wrong way round: the other eigenvalue is the trace minus the known one.",
          "减法方向反了：另一个特征值是迹减去已知的特征值。",
        ),
        why(trace, "That is the trace, the sum of both eigenvalues.", "这是迹，即两个特征值之和。"),
        why(l1 * l2, "That is the determinant, the product of the eigenvalues.", "这是行列式，即两个特征值之积。"),
      ].filter((w, i, all) => w.value !== l2 && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [["Find the trace", "求迹"], t("", ""), [`\\operatorname{tr} A = ${A[0]![0]} + ${inParens(A[1]![1]!)} = ${trace}`]],
          [
            ["Subtract the known eigenvalue", "减去已知的特征值"],
            t("The eigenvalues add up to the trace:", "特征值之和等于迹："),
            [`\\lambda_2 = ${trace} - ${inParens(l1)} = ${l2}`],
          ],
        ],
        t(
          `The product $${inParens(l1)} \\cdot ${inParens(l2)} = ${l1 * l2}$ equals $\\det A = ${A[0]![0]!} \\cdot ${inParens(A[1]![1]!)} - ${inParens(A[0]![1]!)} \\cdot ${inParens(A[1]![0]!)}$, as it must.`,
          `乘积 $${inParens(l1)} \\cdot ${inParens(l2)} = ${l1 * l2}$ 等于 $\\det A = ${A[0]![0]!} \\cdot ${inParens(A[1]![1]!)} - ${inParens(A[0]![1]!)} \\cdot ${inParens(A[1]![0]!)}$，正应如此。`,
        ),
      ),
    });
  },
};

const eigenvalueOfAPolynomial: KnowledgePointDef = {
  id: "the-eigenvalue-of-a-polynomial-in-a-matrix",
  title: t("The eigenvalue of a polynomial in a matrix", "矩阵多项式的特征值"),
  explanation: t(
    "If $A\\mathbf{v} = \\lambda\\mathbf{v}$, then $A^2\\mathbf{v} = \\lambda^2\\mathbf{v}$ and $I\\mathbf{v} = \\mathbf{v}$, and if $A$ is invertible, $A^{-1}\\mathbf{v} = \\lambda^{-1}\\mathbf{v}$. So any such combination of $A$ has the same eigenvector, with the same combination of $\\lambda$ as its eigenvalue. For example, if $A\\mathbf{v} = 2\\mathbf{v}$, then $(A^2 - 3A + I)\\mathbf{v} = (4 - 6 + 1)\\mathbf{v} = -\\mathbf{v}$, so the eigenvalue is $-1$.\n\n> **Watch out.** The term $qI$ contributes $q$, not $0$, and $A^{-1}$ contributes $\\frac{1}{\\lambda}$, not $\\lambda$.",
    "若 $A\\mathbf{v} = \\lambda\\mathbf{v}$，则 $A^2\\mathbf{v} = \\lambda^2\\mathbf{v}$，$I\\mathbf{v} = \\mathbf{v}$；若 $A$ 可逆，还有 $A^{-1}\\mathbf{v} = \\lambda^{-1}\\mathbf{v}$。所以 $A$ 的这类组合有相同的特征向量，特征值是 $\\lambda$ 的同样组合。例如若 $A\\mathbf{v} = 2\\mathbf{v}$，则 $(A^2 - 3A + I)\\mathbf{v} = (4 - 6 + 1)\\mathbf{v} = -\\mathbf{v}$，特征值为 $-1$。\n\n> **注意。** $qI$ 项贡献 $q$，而不是 $0$；$A^{-1}$ 贡献 $\\frac{1}{\\lambda}$，而不是 $\\lambda$。",
  ),
  generate(rng) {
    const l = nonzero(rng, 4);
    const p = nonzero(rng, 4);
    const q = nonzero(rng, 6);
    if (rng.int(0, 1) === 0) {
      const matrix = poly([1, "A^2"], [p, "A"], [q, "I"]);
      const answer = l * l + p * l + q;
      return numberProblem({
        prompt: t(
          `$A\\mathbf{v} = ${l}\\mathbf{v}$ for a nonzero vector $\\mathbf{v}$. The vector is also an eigenvector of $${matrix}$. Find the eigenvalue.`,
          `对某个非零向量 $\\mathbf{v}$ 有 $A\\mathbf{v} = ${l}\\mathbf{v}$。它也是 $${matrix}$ 的特征向量。求对应的特征值。`,
        ),
        answer,
        form: "integer",
        mistakes: [
          why(
            l * l + p * l,
            `The term $${q}I$ sends $\\mathbf{v}$ to $${q}\\mathbf{v}$, so it adds $${q}$.`,
            `$${q}I$ 项把 $\\mathbf{v}$ 映为 $${q}\\mathbf{v}$，所以要加上 $${q}$。`,
          ),
          why(
            answer - 2 * p * l,
            `The middle term is $${inParens(p)} \\cdot ${inParens(l)} = ${p * l}$; its sign was flipped.`,
            `中间项是 $${inParens(p)} \\cdot ${inParens(l)} = ${p * l}$；符号弄反了。`,
          ),
          why(
            l + p + q,
            `$A^2$ multiplies $\\mathbf{v}$ by $\\lambda^2 = ${l * l}$, and $${p}A$ by $${p} \\cdot ${inParens(l)}$; the coefficients are not simply added to $\\lambda$.`,
            `$A^2$ 把 $\\mathbf{v}$ 乘以 $\\lambda^2 = ${l * l}$，$${p}A$ 乘以 $${p} \\cdot ${inParens(l)}$；不能把系数直接与 $\\lambda$ 相加。`,
          ),
        ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
        solution: walked(
          [
            [
              ["Apply each term to $\\mathbf{v}$", "把每一项作用于 $\\mathbf{v}$"],
              t("", ""),
              [`A^2\\mathbf{v} = ${l * l}\\mathbf{v}, \\quad A\\mathbf{v} = ${l}\\mathbf{v}, \\quad I\\mathbf{v} = \\mathbf{v}`],
            ],
            [["Combine", "组合"], t("", ""), [`(${l})^2 + ${inParens(p)}(${l}) + ${inParens(q)} = ${answer}`]],
          ],
          t(
            `So $(${matrix})\\mathbf{v} = ${answer}\\mathbf{v}$: the polynomial $\\lambda^2 + ${inParens(p)}\\lambda + ${inParens(q)}$ evaluated at $\\lambda = ${l}$.`,
            `所以 $(${matrix})\\mathbf{v} = ${answer}\\mathbf{v}$：即多项式 $\\lambda^2 + ${inParens(p)}\\lambda + ${inParens(q)}$ 在 $\\lambda = ${l}$ 处的值。`,
          ),
        ),
      });
    }
    const matrix = poly([p, "A^{-1}"], [q, "I"]);
    const answer = Q.of(p, l).add(Q.of(q));
    return numberProblem({
      prompt: t(
        `$A$ is invertible and $A\\mathbf{v} = ${l}\\mathbf{v}$ for a nonzero vector $\\mathbf{v}$. The vector is also an eigenvector of $${matrix}$. Find the eigenvalue.`,
        `$A$ 可逆，且对某个非零向量 $\\mathbf{v}$ 有 $A\\mathbf{v} = ${l}\\mathbf{v}$。它也是 $${matrix}$ 的特征向量。求对应的特征值。`,
      ),
      answer,
      mistakes: (
        [
          [
            Q.of(p * l + q),
            "$A^{-1}$ multiplies the eigenvector by $\\frac{1}{\\lambda}$, not by $\\lambda$.",
            "$A^{-1}$ 把特征向量乘以 $\\frac{1}{\\lambda}$，而不是 $\\lambda$。",
          ],
          [Q.of(p, l), `The term $${q}I$ adds $${q}$ to the eigenvalue.`, `$${q}I$ 项给特征值加上 $${q}$。`],
          [
            Q.of(-p, l).add(Q.of(q)),
            `$\\frac{1}{\\lambda}$ keeps the sign of $\\lambda = ${l}$.`,
            `$\\frac{1}{\\lambda}$ 与 $\\lambda = ${l}$ 同号。`,
          ],
        ] as const
      )
        .filter(([v], i, all) => !v.eq(answer) && all.findIndex(([o]) => o.eq(v)) === i)
        .map(([v, en, zh]) => why(v, en, zh)),
      solution: walked(
        [
          [
            ["Apply $A^{-1}$ to $\\mathbf{v}$", "把 $A^{-1}$ 作用于 $\\mathbf{v}$"],
            t(
              `Multiply $A\\mathbf{v} = ${l}\\mathbf{v}$ by $A^{-1}$ and divide by $${l}$:`,
              `用 $A^{-1}$ 乘 $A\\mathbf{v} = ${l}\\mathbf{v}$，再除以 $${l}$：`,
            ),
            [`A^{-1}\\mathbf{v} = \\frac{1}{${l}}\\mathbf{v}`],
          ],
          [["Combine", "组合"], t("", ""), [`${frac(p, l)} + ${inParens(q)} = ${answer.toLatex()}`]],
        ],
        t(
          `So $(${matrix})\\mathbf{v} = ${answer.toLatex()}\\,\\mathbf{v}$, with the same eigenvector $\\mathbf{v}$.`,
          `所以 $(${matrix})\\mathbf{v} = ${answer.toLatex()}\\,\\mathbf{v}$，特征向量仍是 $\\mathbf{v}$。`,
        ),
      ),
    });
  },
};

const inverseFromCayleyHamilton: KnowledgePointDef = {
  id: "the-inverse-from-cayley-hamilton",
  title: t("The inverse from Cayley–Hamilton", "由凯莱–哈密顿定理求逆"),
  explanation: t(
    "A $2 \\times 2$ matrix satisfies $A^2 - (\\operatorname{tr}A)A + (\\det A)I = 0$. When $\\det A \\ne 0$, multiply by $A^{-1}$ and rearrange: $A^{-1} = \\frac{1}{\\det A}\\left((\\operatorname{tr}A)I - A\\right)$. So the inverse of any invertible matrix of this size is a combination of the matrix itself and the identity, and no elimination is needed to find it. For example, $A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$ has trace $3$ and determinant $1$, so $A^{-1} = 3I - A = \\begin{pmatrix} 1 & -1 \\\\ -1 & 2 \\end{pmatrix}$.\n\n> **Watch out.** Both coefficients are divided by $\\det A$: $q = \\frac{\\operatorname{tr}A}{\\det A}$ and $p = -\\frac{1}{\\det A}$.",
    "二阶矩阵满足 $A^2 - (\\operatorname{tr}A)A + (\\det A)I = 0$。当 $\\det A \\ne 0$ 时，乘 $A^{-1}$ 再移项，得 $A^{-1} = \\frac{1}{\\det A}\\left((\\operatorname{tr}A)I - A\\right)$。所以这种大小的可逆矩阵，其逆都是矩阵本身与单位矩阵的组合，求逆时不需要消元。例如 $A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$ 的迹为 $3$、行列式为 $1$，所以 $A^{-1} = 3I - A = \\begin{pmatrix} 1 & -1 \\\\ -1 & 2 \\end{pmatrix}$。\n\n> **注意。** 两个系数都要除以 $\\det A$：$q = \\frac{\\operatorname{tr}A}{\\det A}$，$p = -\\frac{1}{\\det A}$。",
  ),
  generate(rng) {
    let A: number[][];
    let trace: number;
    let d: number;
    do {
      A = [
        [rng.int(-3, 5), nonzero(rng, 3)],
        [nonzero(rng, 3), rng.int(-3, 5)],
      ];
      trace = A[0]![0]! + A[1]![1]!;
      d = det(A);
    } while (d === 0 || trace === 0);
    const answer = Q.of(trace, d);
    return numberProblem({
      prompt: t(
        `Write the inverse of $A = ${mat(A)}$ as $A^{-1} = pA + qI$. Find $q$.`,
        `把 $A = ${mat(A)}$ 的逆写成 $A^{-1} = pA + qI$。求 $q$。`,
      ),
      answer,
      solveFor: "q",
      mistakes: (
        [
          [
            Q.of(-trace, d),
            "The sign is wrong: moving $-(\\operatorname{tr}A)A$ across gives $+(\\operatorname{tr}A)I$ after multiplying by $A^{-1}$.",
            "符号错了：移项并乘以 $A^{-1}$ 后得到 $+(\\operatorname{tr}A)I$。",
          ],
          [
            Q.of(d, trace),
            "The fraction is upside down: $q = \\frac{\\operatorname{tr}A}{\\det A}$.",
            "分数颠倒了：$q = \\frac{\\operatorname{tr}A}{\\det A}$。",
          ],
          [Q.of(trace), `The trace must still be divided by $\\det A = ${d}$.`, `迹还要除以 $\\det A = ${d}$。`],
        ] as const
      )
        .filter(([v], i, all) => !v.eq(answer) && all.findIndex(([o]) => o.eq(v)) === i)
        .map(([v, en, zh]) => why(v, en, zh)),
      solution: walked(
        [
          [
            ["Write Cayley–Hamilton", "写出凯莱–哈密顿关系"],
            t(`Here $\\operatorname{tr}A = ${trace}$ and $\\det A = ${d}$:`, `这里 $\\operatorname{tr}A = ${trace}$，$\\det A = ${d}$：`),
            [`A^2 - ${inParens(trace)}A + ${inParens(d)}I = 0`],
          ],
          [
            ["Multiply by $A^{-1}$", "乘以 $A^{-1}$"],
            t("", ""),
            [`A - ${inParens(trace)}I + ${inParens(d)}A^{-1} = 0`, `A^{-1} = ${frac(-1, d)}A + \\left(${answer.toLatex()}\\right)I`],
          ],
        ],
        t(
          `$\\frac{1}{${d}}\\left(${trace}I - A\\right) = \\frac{1}{${d}}${mat([
            [A[1]![1]!, -A[0]![1]!],
            [-A[1]![0]!, A[0]![0]!],
          ])}$, the usual formula for the inverse of a $2 \\times 2$ matrix.`,
          `$\\frac{1}{${d}}\\left(${trace}I - A\\right) = \\frac{1}{${d}}${mat([
            [A[1]![1]!, -A[0]![1]!],
            [-A[1]![0]!, A[0]![0]!],
          ])}$，正是二阶矩阵求逆的常用公式。`,
        ),
      ),
    });
  },
};

const traceOfAPower: KnowledgePointDef = {
  id: "the-trace-of-a-power-from-the-eigenvalues",
  title: t("The trace of a power from the eigenvalues", "由特征值求幂的迹"),
  explanation: t(
    "Diagonalizing $A$ gives $A^n = PD^nP^{-1}$, and similar matrices have the same trace. So the trace of $A^n$ is the sum of the $n$th powers of the eigenvalues, which is much less work than multiplying the matrix out. For example, eigenvalues $2$ and $-1$ give $\\operatorname{tr}(A^3) = 8 + (-1) = 7$.\n\n> **Watch out.** Raise each eigenvalue to the power before adding: $\\operatorname{tr}(A^n)$ is $\\lambda_1^n + \\lambda_2^n$, not $(\\lambda_1 + \\lambda_2)^n$, the power of the trace of $A$.",
    "对角化 $A$ 得 $A^n = PD^nP^{-1}$，而相似矩阵的迹相同。所以 $A^n$ 的迹是各特征值 $n$ 次幂之和，比把矩阵乘出来省事得多。例如特征值 $2$ 和 $-1$ 给出 $\\operatorname{tr}(A^3) = 8 + (-1) = 7$。\n\n> **注意。** 先把每个特征值取幂再相加：$\\operatorname{tr}(A^n)$ 是 $\\lambda_1^n + \\lambda_2^n$，而不是 $A$ 的迹的幂 $(\\lambda_1 + \\lambda_2)^n$。",
  ),
  generate(rng) {
    const l1 = rng.pick([-3, -2, -1, 1, 2, 3]);
    const l2 = rng.pick([-3, -2, -1, 1, 2, 3].filter((x) => x !== l1));
    const A = withEigenvalues(rng, l1, l2);
    const n = rng.int(3, 4);
    const answer = l1 ** n + l2 ** n;
    return numberProblem({
      prompt: t(
        `The matrix $A = ${mat(A)}$ has eigenvalues $${l1}$ and $${l2}$. Find the trace of $A^{${n}}$.`,
        `矩阵 $A = ${mat(A)}$ 的特征值是 $${l1}$ 和 $${l2}$。求 $A^{${n}}$ 的迹。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          (l1 + l2) ** n,
          "That raises the trace of $A$ to the power; raise each eigenvalue first, then add.",
          "这是把 $A$ 的迹取幂；应先把每个特征值取幂再相加。",
        ),
        why(
          n * (l1 + l2),
          "That multiplies the trace by the exponent; a power multiplies each eigenvalue by itself.",
          "这是把迹乘以指数；取幂是把每个特征值自乘。",
        ),
        why(
          (l1 * l2) ** n,
          "That is $\\det(A^n)$, the product of the powers; the trace is their sum.",
          "这是 $\\det(A^n)$，即各幂之积；迹是它们的和。",
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Diagonalize the power", "把幂对角化"],
            t(
              `$A^{${n}} = PD^{${n}}P^{-1}$ is similar to $\\operatorname{diag}(${inParens(l1)}^{${n}}, ${inParens(l2)}^{${n}}) = \\operatorname{diag}(${l1 ** n}, ${l2 ** n})$.`,
              `$A^{${n}} = PD^{${n}}P^{-1}$ 相似于 $\\operatorname{diag}(${inParens(l1)}^{${n}}, ${inParens(l2)}^{${n}}) = \\operatorname{diag}(${l1 ** n}, ${l2 ** n})$。`,
            ),
          ],
          [
            ["Add the diagonal", "把对角元相加"],
            t("Similar matrices have the same trace:", "相似矩阵的迹相同："),
            [`\\operatorname{tr}(A^{${n}}) = ${l1 ** n} + ${inParens(l2 ** n)} = ${answer}`],
          ],
        ],
        t(
          `For $n = 1$ the same rule gives $${l1} + ${inParens(l2)} = ${l1 + l2}$, which is the trace $${A[0]![0]!} + ${inParens(A[1]![1]!)}$ of $A$ itself.`,
          `对 $n = 1$，同样的规则给出 $${l1} + ${inParens(l2)} = ${l1 + l2}$，正是 $A$ 本身的迹 $${A[0]![0]!} + ${inParens(A[1]![1]!)}$。`,
        ),
      ),
    });
  },
};

const lengthUnderRotationScaling: KnowledgePointDef = {
  id: "the-length-of-a-vector-under-a-power-of-a-rotation-scaling",
  figure: linearAlgebraDrawings1["rotation-scaling-matrices#the-length-of-a-vector-under-a-power-of-a-rotation-scaling"],
  title: t("Lengths under powers of a rotation-scaling matrix", "旋转缩放矩阵的幂下的长度"),
  explanation: t(
    "The matrix $\\begin{pmatrix} a & -b \\\\ b & a \\end{pmatrix}$ rotates and multiplies every length by $r = \\sqrt{a^2+b^2}$. Rotation does not change length, so its $n$th power multiplies every length by $r^n$, whatever the direction of the vector. For example, $\\begin{pmatrix} 3 & -4 \\\\ 4 & 3 \\end{pmatrix}$ has $r = 5$, so its square sends a vector of length $2$ to one of length $2 \\cdot 25 = 50$.\n\n> **Watch out.** The factor is $r = \\sqrt{a^2 + b^2}$, not $a^2 + b^2$, and the power gives $r^n$, not $nr$.",
    "矩阵 $\\begin{pmatrix} a & -b \\\\ b & a \\end{pmatrix}$ 作旋转，并把所有长度乘以 $r = \\sqrt{a^2+b^2}$。旋转不改变长度，所以它的 $n$ 次幂把所有长度乘以 $r^n$，与向量的方向无关。例如 $\\begin{pmatrix} 3 & -4 \\\\ 4 & 3 \\end{pmatrix}$ 有 $r = 5$，所以它的平方把长度为 $2$ 的向量变为长度 $2 \\cdot 25 = 50$。\n\n> **注意。** 因子是 $r = \\sqrt{a^2 + b^2}$，不是 $a^2 + b^2$；取幂得到 $r^n$，不是 $nr$。",
  ),
  generate(rng) {
    const [p, q, r] = rng.pick([
      [3, 4, 5],
      [4, 3, 5],
      [6, 8, 10],
      [5, 12, 13],
      [0, 2, 2],
      [0, 3, 3],
    ] as const);
    const a = p * rng.pick([1, -1]);
    const b = q * rng.pick([1, -1]);
    const n = rng.int(2, 3);
    const length = rng.int(2, 7);
    const answer = length * r ** n;
    return numberProblem({
      prompt: t(
        `Let $A = ${mat([
          [a, -b],
          [b, a],
        ])}$. A vector $\\mathbf{v}$ has length $${length}$. What is the length of $A^{${n}}\\mathbf{v}$?`,
        `设 $A = ${mat([
          [a, -b],
          [b, a],
        ])}$。向量 $\\mathbf{v}$ 的长度为 $${length}$。$A^{${n}}\\mathbf{v}$ 的长度是多少？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          length * r * n,
          "That multiplies by $r$ times the exponent; each application multiplies the length by $r$ again.",
          "这是乘以 $r$ 与指数之积；每作用一次，长度都要再乘以 $r$。",
        ),
        why(
          length * r,
          `That applies $A$ only once; $A^{${n}}$ applies it $${n}$ times.`,
          `这只作用了一次 $A$；$A^{${n}}$ 要作用 $${n}$ 次。`,
        ),
        why(
          length * (p * p + q * q) ** n,
          "That uses $r^2 = a^2 + b^2$ in place of $r$; the length is multiplied by the square root.",
          "这把 $r^2 = a^2 + b^2$ 当成了 $r$；长度乘的是平方根。",
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [["Find the scale factor", "求缩放因子"], t("", ""), [`r = \\sqrt{${a * a} + ${b * b}} = ${r}`]],
          [
            ["Apply it once per power", "每次幂乘一次"],
            t(
              "Rotation keeps lengths, so each application multiplies the length by $r$:",
              "旋转不改变长度，所以每作用一次，长度乘以 $r$：",
            ),
            [`${length} \\cdot ${r}^{${n}} = ${answer}`],
          ],
        ],
        t(
          `$A$ sends $(1, 0)$ to $(${a}, ${b})$, of length $${r}$; so a vector of length $${length}$ goes to length $${length * r}$ after one step, and $${answer}$ after $${n}$.`,
          `$A$ 把 $(1, 0)$ 映为长度为 $${r}$ 的 $(${a}, ${b})$；所以长度为 $${length}$ 的向量一次后长度为 $${length * r}$，$${n}$ 次后为 $${answer}$。`,
        ),
      ),
    });
  },
};

const inverseOfIPlusNilpotent: KnowledgePointDef = {
  id: "the-inverse-of-the-identity-plus-a-nilpotent-matrix",
  title: t("The inverse of the identity plus a nilpotent matrix", "单位矩阵加幂零矩阵的逆"),
  explanation: t(
    "If $N^3 = 0$, then $(I+N)(I - N + N^2) = I + N^3 = I$, so $(I+N)^{-1} = I - N + N^2$. The series for $\\frac{1}{1+x}$ stops after finitely many terms because high powers of $N$ vanish. For example, the inverse of $\\begin{pmatrix} 1 & 2 & 3 \\\\ 0 & 1 & 4 \\\\ 0 & 0 & 1 \\end{pmatrix}$ has corner entry $-3 + 2 \\cdot 4 = 5$.\n\n> **Watch out.** The corner of the inverse is $pq - r$: $-N$ contributes $-r$ and $N^2$ contributes $pq$. Keeping only one of the two terms, or flipping both signs, gives a wrong entry.",
    "若 $N^3 = 0$，则 $(I+N)(I - N + N^2) = I + N^3 = I$，所以 $(I+N)^{-1} = I - N + N^2$。$\\frac{1}{1+x}$ 的级数在有限项后就停止，因为 $N$ 的高次幂为零。例如 $\\begin{pmatrix} 1 & 2 & 3 \\\\ 0 & 1 & 4 \\\\ 0 & 0 & 1 \\end{pmatrix}$ 的逆的角元素为 $-3 + 2 \\cdot 4 = 5$。\n\n> **注意。** 逆的角元素是 $pq - r$：$-N$ 贡献 $-r$，$N^2$ 贡献 $pq$。只保留其中一项，或把两项都变号，都会得到错误的元素。",
  ),
  generate(rng) {
    const p = nonzero(rng, 4);
    const q = nonzero(rng, 4);
    const r = nonzero(rng, 5);
    const answer = p * q - r;
    const N = mat([
      [0, p, r],
      [0, 0, q],
      [0, 0, 0],
    ]);
    const N2 = mat([
      [0, 0, p * q],
      [0, 0, 0],
      [0, 0, 0],
    ]);
    return numberProblem({
      prompt: t(
        `Find the entry in row 1, column 3 of the inverse of $${mat([
          [1, p, r],
          [0, 1, q],
          [0, 0, 1],
        ])}$.`,
        `求 $${mat([
          [1, p, r],
          [0, 1, q],
          [0, 0, 1],
        ])}$ 的逆第 1 行第 3 列的元素。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(-r, "That keeps only $-N$; the $N^2$ term adds $pq$ in the corner.", "这只保留了 $-N$；$N^2$ 项还在角上加上 $pq$。"),
        why(
          r - p * q,
          "The signs are flipped: the inverse is $I - N + N^2$, so the corner is $-r + pq$.",
          "符号反了：逆是 $I - N + N^2$，所以角元素为 $-r + pq$。",
        ),
        why(p * q, "That keeps only $N^2$; $-N$ contributes $-r$ as well.", "这只保留了 $N^2$；$-N$ 还贡献 $-r$。"),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Split off the identity", "分出单位矩阵"],
            t(
              "The matrix is $I + N$ with $N$ strictly upper triangular, so $N^3 = 0$:",
              "矩阵是 $I + N$，$N$ 严格上三角，所以 $N^3 = 0$：",
            ),
            [`N = ${N}`, `N^2 = ${N2}`],
          ],
          [
            ["Use the finite series", "利用有限级数"],
            t("$(I + N)^{-1} = I - N + N^2$, whose corner entry is", "$(I + N)^{-1} = I - N + N^2$，其角元素为"),
            [`${-r} + ${inParens(p * q)} = ${answer}`],
          ],
        ],
        t(
          `Column 3 of the inverse is $(${answer}, ${-q}, 1)$, and row 1 of the matrix times it gives $${answer} + ${inParens(p)} \\cdot ${inParens(-q)} + ${inParens(r)} = 0$, as the identity requires.`,
          `逆的第 3 列为 $(${answer}, ${-q}, 1)$，原矩阵第 1 行与它相乘得 $${answer} + ${inParens(p)} \\cdot ${inParens(-q)} + ${inParens(r)} = 0$，符合单位矩阵的要求。`,
        ),
      ),
    });
  },
};

const blocksFromNullities: KnowledgePointDef = {
  id: "counting-jordan-blocks-from-nullities",
  title: t("Counting Jordan blocks from nullities", "由零度数若尔当块"),
  explanation: t(
    "Let $N = A - \\lambda I$. The nullity of $N$ counts the Jordan blocks for $\\lambda$, because each block has one eigenvector. Each further power gains one dimension for every block that is long enough, so the nullity of $N^2$ minus the nullity of $N$ counts the blocks of size at least two. For example, blocks of sizes $3$ and $1$ give nullities $2$ for $N$ and $3$ for $N^2$: two blocks, of which $3 - 2 = 1$ has size at least two.\n\n> **Watch out.** The nullity of $N^2$ is not itself a count of blocks; it is the difference of the two nullities that counts the blocks of size at least two.",
    "设 $N = A - \\lambda I$。$N$ 的零度等于 $\\lambda$ 的若尔当块个数，因为每块有一个特征向量。再乘一次，每个足够长的块都多一维，所以 $N^2$ 的零度减 $N$ 的零度，就是大小至少为二的块数。例如大小为 $3$ 和 $1$ 的两个块使 $N$ 的零度为 $2$，$N^2$ 的零度为 $3$：共两个块，其中 $3 - 2 = 1$ 个大小至少为二。\n\n> **注意。** $N^2$ 的零度本身不是块数；两个零度之差才是大小至少为二的块数。",
  ),
  generate(rng) {
    const sizes = rng.pick([
      [3, 1],
      [2, 2],
      [2, 1, 1],
      [3, 2],
      [3, 1, 1],
      [2, 2, 1],
      [4, 2],
      [3, 2, 1],
      [2, 1, 1, 1],
      [2, 2, 2],
    ]);
    const nullity = (k: number) => sizes.reduce((s, x) => s + Math.min(x, k), 0);
    const [n1, n2] = [nullity(1), nullity(2)];
    const total = sizes.reduce((s, x) => s + x, 0);
    const l = nonzero(rng, 4);
    const singles = sizes.filter((x) => x === 1).length;
    const askSingles = rng.int(0, 1) === 0;
    const answer = askSingles ? singles : n2 - n1;
    const given = `$A$ is a ${total}×${total} matrix whose only eigenvalue is $${l}$. With $N = A - ${l < 0 ? `(${l})` : l}I$, the nullity of $N$ is $${n1}$ and the nullity of $N^2$ is $${n2}$.`;
    const givenZh = `$A$ 是 ${total} 阶矩阵，唯一的特征值是 $${l}$。设 $N = A - ${l < 0 ? `(${l})` : l}I$，$N$ 的零度是 $${n1}$，$N^2$ 的零度是 $${n2}$。`;
    return numberProblem({
      prompt: askSingles
        ? t(`${given} How many Jordan blocks have size exactly 1?`, `${givenZh}大小恰为 1 的若尔当块有多少个？`)
        : t(`${given} How many Jordan blocks have size at least 2?`, `${givenZh}大小至少为 2 的若尔当块有多少个？`),
      answer,
      form: "integer",
      mistakes: [
        why(n1, "That is the nullity of $N$, which counts all the blocks.", "这是 $N$ 的零度，它数的是全部块。"),
        why(
          n2,
          "The nullity of $N^2$ is not a count of blocks; take the difference of the nullities.",
          "$N^2$ 的零度不是块数；要取两个零度之差。",
        ),
        askSingles
          ? why(
              n2 - n1,
              "That counts the blocks of size at least 2; subtract it from the total.",
              "这是大小至少为 2 的块数；还要从总块数中减去它。",
            )
          : why(singles, "That counts the blocks of size exactly 1.", "这是大小恰为 1 的块数。"),
        why(answer + 1, "That is one too many; recount from the two nullities.", "多了一个；请由两个零度重新计算。"),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Count all the blocks", "数全部块"],
            t(`Each block has one eigenvector, so there are $${n1}$ blocks.`, `每个块有一个特征向量，所以共有 $${n1}$ 个块。`),
          ],
          [
            ["Count the longer blocks", "数较长的块"],
            t("Each block of size at least 2 adds one dimension from $N$ to $N^2$:", "每个大小至少为 2 的块从 $N$ 到 $N^2$ 多一维："),
            [`${n2} - ${n1} = ${n2 - n1}`],
          ],
          ...(askSingles
            ? [
                [
                  ["Subtract", "相减"] as const,
                  t("The rest have size 1:", "其余的块大小为 1："),
                  [`${n1} - ${n2 - n1} = ${singles}`],
                ] as const,
              ]
            : []),
        ],
        t(
          `Blocks of sizes $${sizes.join(", ")}$ fill a ${total}×${total} matrix and give these nullities: $${n1}$ for $N$ and $${n2}$ for $N^2$.`,
          `大小为 ${sizes.map((s) => `$${s}$`).join("、")} 的块组成 ${total} 阶矩阵，并给出这些零度：$N$ 为 $${n1}$，$N^2$ 为 $${n2}$。`,
        ),
      ),
    });
  },
};

const exponentialOfJordanBlock: KnowledgePointDef = {
  id: "the-exponential-of-a-2x2-jordan-block",
  title: t("The exponential of a 2×2 Jordan block", "二阶若尔当块的指数"),
  explanation: t(
    "Write $A = \\lambda I + N$ with $N^2 = 0$. Since $\\lambda I$ and $N$ commute, $e^{At} = e^{\\lambda t}e^{Nt} = e^{\\lambda t}(I + tN)$. The exponential series for $N$ stops after two terms, and so a factor of $t$ appears beside the exponential. For example, $A = \\begin{pmatrix} 3 & 2 \\\\ 0 & 3 \\end{pmatrix}$ gives $e^{At} = e^{3t}\\begin{pmatrix} 1 & 2t \\\\ 0 & 1 \\end{pmatrix}$.\n\n> **Watch out.** $e^{At}$ is not found by exponentiating each entry. The corner is $ct$, with the factor $t$, and it is multiplied by $e^{\\lambda t}$ like every other entry.",
    "把 $A$ 写成 $\\lambda I + N$，其中 $N^2 = 0$。因为 $\\lambda I$ 与 $N$ 可交换，$e^{At} = e^{\\lambda t}e^{Nt} = e^{\\lambda t}(I + tN)$。$N$ 的指数级数两项后就停止，所以指数旁边出现因子 $t$。例如 $A = \\begin{pmatrix} 3 & 2 \\\\ 0 & 3 \\end{pmatrix}$ 给出 $e^{At} = e^{3t}\\begin{pmatrix} 1 & 2t \\\\ 0 & 1 \\end{pmatrix}$。\n\n> **注意。** $e^{At}$ 不是把每个元素取指数。角上是带因子 $t$ 的 $ct$，并且它和其他元素一样乘以 $e^{\\lambda t}$。",
  ),
  generate(rng) {
    const l = nonzero(rng, 5);
    const c = nonzero(rng, 4);
    const off = c === 1 ? "t" : c === -1 ? "-t" : `${c}t`;
    const lt = l === 1 ? "t" : l === -1 ? "-t" : `${l}t`;
    const exp = `e^{${lt}}`;
    const wrong = [
      both(
        mat([
          [exp, `e^{${off}}`],
          [0, exp],
        ]),
      ),
      both(
        `${exp}${mat([
          [1, c],
          [0, 1],
        ])}`,
      ),
      both(
        mat([
          [exp, off],
          [0, exp],
        ]),
      ),
    ];
    const problem = pickChoice(
      rng,
      t(
        `What is $e^{At}$ for $A = ${mat([
          [l, c],
          [0, l],
        ])}$?`,
        `$A = ${mat([
          [l, c],
          [0, l],
        ])}$ 时，$e^{At}$ 是什么？`,
      ),
      both(
        `${exp}${mat([
          [1, off],
          [0, 1],
        ])}`,
      ),
      wrong,
      t(
        `Here $A = ${l}I + N$ with $N = ${mat([
          [0, c],
          [0, 0],
        ])}$ and $N^2 = 0$. So $e^{At} = ${exp}(I + tN)$, which has $${off}$ in the corner, multiplied by the exponential like every other entry.`,
        `这里 $A = ${l}I + N$，$N = ${mat([
          [0, c],
          [0, 0],
        ])}$，$N^2 = 0$。所以 $e^{At} = ${exp}(I + tN)$，角上是 $${off}$，它和其他元素一样乘以指数。`,
      ),
    );
    return reasoned(problem, [
      [
        wrong[0]!.en,
        "Exponentiating each entry works only for diagonal matrices; here $e^{At} = e^{\\lambda t}(I + tN)$.",
        "逐个元素取指数只对对角矩阵成立；这里 $e^{At} = e^{\\lambda t}(I + tN)$。",
      ],
      [wrong[1]!.en, "The corner needs the factor $t$, because $e^{Nt} = I + tN$.", "角上需要因子 $t$，因为 $e^{Nt} = I + tN$。"],
      [
        wrong[2]!.en,
        "The corner entry is multiplied by $e^{\\lambda t}$ too, like every other entry.",
        "角上的元素也要乘以 $e^{\\lambda t}$，和其他元素一样。",
      ],
    ]);
  },
};

// ---------------------------------------------------------------------------
// Orthogonality and projections
// ---------------------------------------------------------------------------

/** triples are Pythagorean triples, for orthogonal matrices with rational entries. */
const triples = [
  [3, 4, 5],
  [4, 3, 5],
  [5, 12, 13],
  [12, 5, 13],
  [8, 15, 17],
] as const;

const completingARotation: KnowledgePointDef = {
  id: "completing-an-orthogonal-matrix",
  figure: linearAlgebraDrawings2["orthogonal-matrices#completing-an-orthogonal-matrix"],
  title: t("Completing an orthogonal matrix", "补全正交矩阵"),
  explanation: t(
    "The columns of an orthogonal matrix are perpendicular unit vectors. In the plane, a unit vector $(a, b)$ leaves two perpendicular unit vectors, $(-b, a)$ and $(b, -a)$. The determinant decides between them: $+1$ gives a rotation and $-1$ a reflection. For example, the first column $\\left(\\frac{3}{5}, \\frac{4}{5}\\right)$ with determinant $1$ forces the second column $\\left(-\\frac{4}{5}, \\frac{3}{5}\\right)$, since $\\frac{3}{5} \\cdot \\frac{3}{5} - \\left(-\\frac{4}{5}\\right)\\frac{4}{5} = 1$.\n\n> **Watch out.** Swapping the entries is not enough; one of them must also change sign, or the columns are not perpendicular. Compute the determinant to choose the sign rather than guessing.",
    "正交矩阵的列是互相垂直的单位向量。在平面上，单位向量 $(a, b)$ 只有两个垂直的单位向量：$(-b, a)$ 和 $(b, -a)$。行列式决定选哪一个：$+1$ 是旋转，$-1$ 是反射。例如第一列为 $\\left(\\frac{3}{5}, \\frac{4}{5}\\right)$、行列式为 $1$ 时，第二列必须是 $\\left(-\\frac{4}{5}, \\frac{3}{5}\\right)$，因为 $\\frac{3}{5} \\cdot \\frac{3}{5} - \\left(-\\frac{4}{5}\\right)\\frac{4}{5} = 1$。\n\n> **注意。** 只交换两个分量还不够；其中一个还必须变号，否则两列不垂直。要计算行列式来确定符号，而不是猜。",
  ),
  generate(rng) {
    const [p, q, r] = rng.pick(triples);
    const sa = rng.pick([1, -1]);
    const sb = rng.pick([1, -1]);
    const a = Q.of(sa * p, r);
    const b = Q.of(sb * q, r);
    const rotation = rng.int(0, 1) === 0;
    const x = rotation ? b.mul(Q.of(-1)) : b;
    const y = rotation ? a : a.mul(Q.of(-1));
    const answer = x.add(y);
    const matrix = mat([
      [a.toLatex(), "x"],
      [b.toLatex(), "y"],
    ]);
    return numberProblem({
      prompt: t(
        `The matrix $${matrix}$ is orthogonal with determinant $${rotation ? 1 : -1}$. Find $x + y$.`,
        `矩阵 $${matrix}$ 是正交矩阵，行列式为 $${rotation ? 1 : -1}$。求 $x + y$。`,
      ),
      answer,
      mistakes: [
        why(
          answer.mul(Q.of(-1)),
          `That is the other perpendicular unit vector, which gives determinant $${rotation ? -1 : 1}$.`,
          `这是另一个垂直的单位向量，它给出的行列式是 $${rotation ? -1 : 1}$。`,
        ),
        why(
          a.add(b),
          "That copies the first column; the second column must be perpendicular to it.",
          "这是照抄第一列；第二列必须与它垂直。",
        ),
        why(x.sub(y), "That is $x - y$; the question asks for $x + y$.", "这是 $x - y$；题目要求 $x + y$。"),
      ].filter((w, i, all) => all.findIndex((o) => String(o.value) === String(w.value)) === i),
      solution: walked(
        [
          [
            ["List the perpendicular unit vectors", "列出垂直的单位向量"],
            t(
              "The second column is a unit vector perpendicular to the first, so it is one of two vectors:",
              "第二列是与第一列垂直的单位向量，所以只能是两个向量之一：",
            ),
            [`(x, y) = \\pm\\left(${b.mul(Q.of(-1)).toLatex()}, ${a.toLatex()}\\right)`],
          ],
          [
            ["Use the determinant", "利用行列式"],
            t(
              `The determinant $${rotation ? 1 : -1}$ picks $x = ${x.toLatex()}$ and $y = ${y.toLatex()}$:`,
              `行列式 $${rotation ? 1 : -1}$ 确定 $x = ${x.toLatex()}$，$y = ${y.toLatex()}$：`,
            ),
            [
              `\\det = \\left(${a.toLatex()}\\right)\\left(${y.toLatex()}\\right) - \\left(${x.toLatex()}\\right)\\left(${b.toLatex()}\\right) = ${rotation ? 1 : -1}`,
              `x + y = ${answer.toLatex()}`,
            ],
          ],
        ],
        t(
          `The second column has $x^2 + y^2 = ${x.mul(x).add(y.mul(y)).toLatex()}$, and its dot product with the first column is $${a.mul(x).add(b.mul(y)).toLatex()}$, as an orthogonal matrix requires.`,
          `第二列满足 $x^2 + y^2 = ${x.mul(x).add(y.mul(y)).toLatex()}$，与第一列的点积为 $${a.mul(x).add(b.mul(y)).toLatex()}$，符合正交矩阵的要求。`,
        ),
      ),
    });
  },
};

const reflectionFromProjection: KnowledgePointDef = {
  id: "the-reflection-matrix-from-a-projection",
  figure: linearAlgebraDrawings2["projection-matrices-linear-transformations-and-their-properties#the-reflection-matrix-from-a-projection"],
  title: t("The reflection matrix from a projection", "由投影矩阵得反射矩阵"),
  explanation: t(
    "To reflect $\\mathbf{x}$ in a line, move to its projection $P\\mathbf{x}$ and go the same distance again, which gives $2P\\mathbf{x} - \\mathbf{x}$. So the reflection matrix is $R = 2P - I$, where $P = \\frac{\\mathbf{u}\\mathbf{u}^T}{\\mathbf{u}^T\\mathbf{u}}$ is the projection onto the line along $\\mathbf{u}$. For example, along $(1, 2)$ the projection is $\\frac{1}{5}\\begin{pmatrix} 1 & 2 \\\\ 2 & 4 \\end{pmatrix}$, so $R = \\frac{1}{5}\\begin{pmatrix} -3 & 4 \\\\ 4 & 3 \\end{pmatrix}$.\n\n> **Watch out.** Subtract $I$ only on the diagonal, and keep the order $2P - I$: the matrix $I - 2P$ reflects in the perpendicular line instead.",
    "要把 $\\mathbf{x}$ 关于直线反射，先走到投影 $P\\mathbf{x}$，再走同样的距离，得到 $2P\\mathbf{x} - \\mathbf{x}$。所以反射矩阵是 $R = 2P - I$，其中 $P = \\frac{\\mathbf{u}\\mathbf{u}^T}{\\mathbf{u}^T\\mathbf{u}}$ 是到方向 $\\mathbf{u}$ 的直线上的投影。例如沿 $(1, 2)$ 的投影是 $\\frac{1}{5}\\begin{pmatrix} 1 & 2 \\\\ 2 & 4 \\end{pmatrix}$，所以 $R = \\frac{1}{5}\\begin{pmatrix} -3 & 4 \\\\ 4 & 3 \\end{pmatrix}$。\n\n> **注意。** $I$ 只在对角线上减去，并且顺序是 $2P - I$：矩阵 $I - 2P$ 是关于垂直直线的反射。",
  ),
  generate(rng) {
    const p = nonzero(rng, 5);
    const q = rng.pick([1, 2, 3, 4, 5].filter((x) => x !== Math.abs(p)));
    const uu = p * p + q * q;
    const corner = rng.int(0, 1) === 0;
    const answer = corner ? Q.of(p * p - q * q, uu) : Q.of(2 * p * q, uu);
    return numberProblem({
      prompt: t(
        `$R$ is the matrix of the reflection in the line through the origin along $${col(p, q)}$. Find the entry in row 1, column ${corner ? 1 : 2} of $R$.`,
        `$R$ 是关于过原点、方向为 $${col(p, q)}$ 的直线的反射矩阵。求 $R$ 第 1 行第 ${corner ? 1 : 2} 列的元素。`,
      ),
      answer,
      mistakes: (corner
        ? [
            why(
              Q.of(p * p, uu),
              "That is the entry of the projection $P$; the reflection is $2P - I$.",
              "这是投影 $P$ 的元素；反射是 $2P - I$。",
            ),
            why(Q.of(2 * p * p, uu), "That is $2P$ without subtracting $I$ on the diagonal.", "这是 $2P$，没有在对角线上减去 $I$。"),
            why(
              Q.of(q * q - p * p, uu),
              "That is the entry of $I - 2P$, the reflection in the perpendicular line.",
              "这是 $I - 2P$ 的元素，即关于垂直直线的反射。",
            ),
          ]
        : [
            why(
              Q.of(p * q, uu),
              "That is the entry of the projection $P$; the reflection is $2P - I$.",
              "这是投影 $P$ 的元素；反射是 $2P - I$。",
            ),
            why(
              Q.of(-2 * p * q, uu),
              "That is the entry of $I - 2P$, the reflection in the perpendicular line.",
              "这是 $I - 2P$ 的元素，即关于垂直直线的反射。",
            ),
            why(
              Q.of(2 * p * q),
              `That uses $2\\mathbf{u}\\mathbf{u}^T$ without dividing by $\\mathbf{u}^T\\mathbf{u} = ${uu}$.`,
              `这是用了 $2\\mathbf{u}\\mathbf{u}^T$，没有除以 $\\mathbf{u}^T\\mathbf{u} = ${uu}$。`,
            ),
          ]
      ).filter((w, i, all) => String(w.value) !== String(answer) && all.findIndex((o) => String(o.value) === String(w.value)) === i),
      solution: t(
        `$P$ has entry $${frac(corner ? p * p : p * q, uu)}$ in that place. Then $R = 2P - I$ gives $${corner ? `2\\left(${frac(p * p, uu)}\\right) - 1` : `2\\left(${frac(p * q, uu)}\\right)`} = ${answer.toLatex()}$.`,
        `$P$ 在该位置的元素是 $${frac(corner ? p * p : p * q, uu)}$。由 $R = 2P - I$ 得 $${corner ? `2\\left(${frac(p * p, uu)}\\right) - 1` : `2\\left(${frac(p * q, uu)}\\right)`} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const leastSquaresError: KnowledgePointDef = {
  id: "the-smallest-squared-error-of-a-least-squares-fit",
  figure:
    linearAlgebraDrawings2[
      "least-squares-solution-of-a-linear-system-without-collinearity#the-smallest-squared-error-of-a-least-squares-fit"
    ],
  title: t("The smallest squared error of a least-squares fit", "最小二乘拟合的最小平方误差"),
  explanation: t(
    "After finding the least-squares solution, the size of the fit is the length of the residual $\\mathbf{b} - A\\hat{\\mathbf{x}}$. The residual is perpendicular to the column space, so by Pythagoras $\\|\\mathbf{b} - A\\hat{\\mathbf{x}}\\|^2 = \\|\\mathbf{b}\\|^2 - \\|A\\hat{\\mathbf{x}}\\|^2$. For a single column, $\\|A\\hat{x}\\|^2 = \\frac{(A^T\\mathbf{b})^2}{A^TA}$. For example, $A = (1, 1, 1)$ and $\\mathbf{b} = (1, 2, 6)$ give $\\|A\\hat{x}\\|^2 = \\frac{9^2}{3} = 27$, so the smallest squared error is $41 - 27 = 14$.\n\n> **Watch out.** The answer is the error, $\\|\\mathbf{b}\\|^2$ minus the squared length of the fit, not the fit itself and not the best $x$. Square $A^T\\mathbf{b}$ before dividing by $A^TA$.",
    "求出最小二乘解后，拟合的好坏由残差 $\\mathbf{b} - A\\hat{\\mathbf{x}}$ 的长度衡量。残差与列空间垂直，所以由勾股定理，$\\|\\mathbf{b} - A\\hat{\\mathbf{x}}\\|^2 = \\|\\mathbf{b}\\|^2 - \\|A\\hat{\\mathbf{x}}\\|^2$。对单列矩阵，$\\|A\\hat{x}\\|^2 = \\frac{(A^T\\mathbf{b})^2}{A^TA}$。例如 $A = (1, 1, 1)$，$\\mathbf{b} = (1, 2, 6)$ 给出 $\\|A\\hat{x}\\|^2 = \\frac{9^2}{3} = 27$，所以最小平方误差为 $41 - 27 = 14$。\n\n> **注意。** 答案是误差，即 $\\|\\mathbf{b}\\|^2$ 减去拟合部分长度的平方，而不是拟合部分本身，也不是最佳的 $x$。$A^T\\mathbf{b}$ 要先平方再除以 $A^TA$。",
  ),
  generate(rng) {
    const a = [nonzero(rng, 3), nonzero(rng, 3), nonzero(rng, 3)];
    let b: number[];
    do b = [rng.int(-4, 5), rng.int(-4, 5), rng.int(-4, 5)];
    while (dot(a, b) === 0 || a[0]! * b[1]! === a[1]! * b[0]! || a[1]! * b[2]! === a[2]! * b[1]!);
    const [aa, ab, bb] = [dot(a, a), dot(a, b), dot(b, b)];
    const xhat = Q.of(ab, aa);
    const answer = Q.of(bb * aa - ab * ab, aa);
    const xhatTerm = xhat.toNumber() < 0 ? `(${xhat.toLatex()})` : xhat.toLatex();
    const residualEntry = (v: number, ai: number) => Q.of(v).sub(xhat.mul(Q.of(ai)));
    const residual = b.map((v, i) => residualEntry(v, a[i]!).toLatex()).join(", ");
    return numberProblem({
      prompt: t(
        `Find the smallest possible value of $\\|A x - \\mathbf{b}\\|^2$ over all numbers $x$, for $A = ${col(...a)}$ and $\\mathbf{b} = ${col(...b)}$.`,
        `$A = ${col(...a)}$，$\\mathbf{b} = ${col(...b)}$。对所有数 $x$，求 $\\|A x - \\mathbf{b}\\|^2$ 的最小值。`,
      ),
      answer,
      mistakes: [
        why(
          bb,
          `$${bb}$ is $\\|\\mathbf{b}\\|^2$, the error for $x = 0$; the best $x$ removes the fitted part.`,
          `$${bb}$ 是 $\\|\\mathbf{b}\\|^2$，即 $x = 0$ 时的误差；最佳的 $x$ 会去掉拟合部分。`,
        ),
        why(
          Q.of(ab * ab, aa),
          `$${Q.of(ab * ab, aa).toLatex()}$ is $\\|A\\hat{x}\\|^2$, the squared length of the fit; the error is what is left of $\\|\\mathbf{b}\\|^2 = ${bb}$.`,
          `$${Q.of(ab * ab, aa).toLatex()}$ 是 $\\|A\\hat{x}\\|^2$，拟合部分长度的平方；误差是 $\\|\\mathbf{b}\\|^2 = ${bb}$ 剩下的部分。`,
        ),
        why(
          xhat,
          `$${xhat.toLatex()}$ is the best $x$ itself; the question asks for the smallest value of $\\|Ax - \\mathbf{b}\\|^2$.`,
          `$${xhat.toLatex()}$ 是最佳的 $x$ 本身；题目问的是 $\\|Ax - \\mathbf{b}\\|^2$ 的最小值。`,
        ),
        why(
          bb - ab,
          `That subtracts $A^T\\mathbf{b} = ${ab}$ itself; the fit has squared length $\\frac{(A^T\\mathbf{b})^2}{A^TA} = ${Q.of(ab * ab, aa).toLatex()}$.`,
          `这是直接减去了 $A^T\\mathbf{b} = ${ab}$；拟合部分长度的平方是 $\\frac{(A^T\\mathbf{b})^2}{A^TA} = ${Q.of(ab * ab, aa).toLatex()}$。`,
        ),
      ].filter((w, i, all) => String(w.value) !== String(answer) && all.findIndex((o) => String(o.value) === String(w.value)) === i),
      solution: walked(
        [
          [
            ["Find the best $x$", "求最佳的 $x$"],
            t(
              `$A^TA = ${aa}$ and $A^T\\mathbf{b} = ${ab}$, so $\\hat{x} = \\frac{${ab}}{${aa}}${xhat.isInteger() || xhat.d !== BigInt(aa) ? ` = ${xhat.toLatex()}` : ""}$.`,
              `$A^TA = ${aa}$，$A^T\\mathbf{b} = ${ab}$，所以 $\\hat{x} = \\frac{${ab}}{${aa}}${xhat.isInteger() || xhat.d !== BigInt(aa) ? ` = ${xhat.toLatex()}` : ""}$。`,
            ),
          ],
          [
            ["Measure the fit", "度量拟合部分"],
            t("", ""),
            [`\\|A\\hat{x}\\|^2 = \\frac{(${ab})^2}{${aa}} = ${Q.of(ab * ab, aa).toLatex()}`],
          ],
          [
            ["Subtract from $\\|\\mathbf{b}\\|^2$", "从 $\\|\\mathbf{b}\\|^2$ 中减去"],
            t("By Pythagoras the rest is the error:", "由勾股定理，剩下的就是误差："),
            [`\\|\\mathbf{b} - A\\hat{x}\\|^2 = ${bb} - ${Q.of(ab * ab, aa).toLatex()} = ${answer.toLatex()}`],
          ],
        ],
        t(
          `The residual $\\mathbf{b} - ${xhatTerm}A = (${residual})$ has squared length $${answer.toLatex()}$ when computed directly.`,
          `直接计算残差 $\\mathbf{b} - ${xhatTerm}A = (${residual})$，其长度平方为 $${answer.toLatex()}$。`,
        ),
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Symmetric matrices, quadratic forms and the SVD
// ---------------------------------------------------------------------------

const perpendicularEigenvectors: KnowledgePointDef = {
  id: "the-second-eigenvector-of-a-symmetric-matrix",
  figure: linearAlgebraDrawings2["symmetric-matrices#the-second-eigenvector-of-a-symmetric-matrix"],
  title: t("The second eigenvector of a symmetric matrix", "对称矩阵的第二个特征向量"),
  explanation: t(
    "Eigenvectors of a symmetric matrix that belong to different eigenvalues are perpendicular. So knowing one eigenvector is enough to fix the direction of the other in the plane, with no need to know the matrix. For example, if $(2, 3)$ and $(k, 4)$ are eigenvectors for different eigenvalues, then $2k + 3 \\cdot 4 = 0$, so $k = -6$.\n\n> **Watch out.** Pair the components in order: the first with the first and the second with the second. Then move the known product across with its sign changed before dividing.",
    "对称矩阵属于不同特征值的特征向量互相垂直。所以在平面上，知道一个特征向量就确定了另一个的方向，甚至不需要知道矩阵本身。例如若 $(2, 3)$ 与 $(k, 4)$ 是不同特征值的特征向量，则 $2k + 3 \\cdot 4 = 0$，所以 $k = -6$。\n\n> **注意。** 分量要按顺序配对：第一个乘第一个，第二个乘第二个。然后把已知的乘积变号移到另一边，再做除法。",
  ),
  generate(rng) {
    const p = nonzero(rng, 4);
    // |q| differs from |p|, so pairing the components the wrong way gives a different number.
    const q = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4].filter((v) => Math.abs(v) !== Math.abs(p)));
    const w = nonzero(rng, 5);
    const l1 = nonzero(rng, 5);
    const l2 = l1 > 0 ? l1 + rng.int(1, 4) : l1 - rng.int(1, 4);
    const answer = Q.of(-w * q, p);
    const pk = p === 1 ? "k" : p === -1 ? "-k" : `${p}k`;
    const times = (s: number) => (s === 1 ? "" : s === -1 ? "-" : `${s}`);
    return numberProblem({
      prompt: t(
        `A symmetric matrix $A$ has $A${col(p, q)} = ${times(l1)}${col(p, q)}$ and $A${col("k", w)} = ${l2}${col("k", w)}$. Find $k$.`,
        `对称矩阵 $A$ 满足 $A${col(p, q)} = ${times(l1)}${col(p, q)}$，$A${col("k", w)} = ${l2}${col("k", w)}$。求 $k$。`,
      ),
      answer,
      solveFor: "k",
      wrong: [Q.of(w * q, p), Q.of(-w * p, q), Q.of(w * p, q)],
      mistakes: [
        why(
          Q.of(w * q, p),
          `The sign is lost: moving $${q * w}$ across gives $${pk} = ${-q * w}$.`,
          `符号丢了：把 $${q * w}$ 移到另一边得 $${pk} = ${-q * w}$。`,
        ),
        why(
          Q.of(-w * p, q),
          `The components are paired the wrong way: $k$ multiplies $${p}$, and $${w}$ multiplies $${q}$.`,
          `分量配对错了：$k$ 乘的是 $${p}$，$${w}$ 乘的是 $${q}$。`,
        ),
        why(
          Q.of(w * p, q),
          `That makes $${col("k", w)}$ parallel to $${col(p, q)}$; eigenvectors for different eigenvalues are perpendicular.`,
          `这使 $${col("k", w)}$ 与 $${col(p, q)}$ 平行；属于不同特征值的特征向量是垂直的。`,
        ),
      ].filter((m, i, all) => String(m.value) !== String(answer) && all.findIndex((o) => String(o.value) === String(m.value)) === i),
      solution: walked(
        [
          [
            ["Set the dot product to zero", "令点积为零"],
            t("The eigenvalues differ, so the eigenvectors are perpendicular:", "特征值不同，所以特征向量垂直："),
            [`${pk} + ${inParens(q)}(${w}) = 0`],
          ],
          [["Solve for k", "解出 k"], t("", ""), [`${pk} = ${-q * w}`, `k = ${answer.toLatex()}`]],
        ],
        t(
          `$${p} \\cdot ${answer.isInteger() ? inParens(answer.toNumber()) : `\\left(${answer.toLatex()}\\right)`} + ${inParens(q)}(${w}) = ${-q * w} + ${inParens(q * w)} = 0$.`,
          `$${p} \\cdot ${answer.isInteger() ? inParens(answer.toNumber()) : `\\left(${answer.toLatex()}\\right)`} + ${inParens(q)}(${w}) = ${-q * w} + ${inParens(q * w)} = 0$。`,
        ),
      ),
    });
  },
};

const evaluatingAQuadraticForm: KnowledgePointDef = {
  id: "evaluating-a-quadratic-form-from-its-matrix",
  title: t("Evaluating a quadratic form from its matrix", "由矩阵计算二次型的值"),
  explanation: t(
    "The value $\\mathbf{x}^TA\\mathbf{x}$ is a number. Compute $A\\mathbf{x}$ first and then take the dot product with $\\mathbf{x}$. Written out, each off-diagonal entry counts twice, because $a_{ij}x_ix_j$ and $a_{ji}x_jx_i$ are both present. For example, $A = \\begin{pmatrix} 1 & 2 \\\\ 2 & -1 \\end{pmatrix}$ and $\\mathbf{x} = (1, 1)$ give $A\\mathbf{x} = (3, 1)$ and $\\mathbf{x}^TA\\mathbf{x} = 3 + 1 = 4$, which is also $1 + 2 \\cdot 2 - 1$.\n\n> **Watch out.** Dot $A\\mathbf{x}$ with $\\mathbf{x}$, not with $(1, 1, 1)$. In the written-out sum the off-diagonal entries count twice, and leaving them out keeps only the diagonal part.",
    "$\\mathbf{x}^TA\\mathbf{x}$ 的值是一个数。先算 $A\\mathbf{x}$，再与 $\\mathbf{x}$ 作数量积。展开时，每个非对角元都算两次，因为 $a_{ij}x_ix_j$ 和 $a_{ji}x_jx_i$ 都出现。例如 $A = \\begin{pmatrix} 1 & 2 \\\\ 2 & -1 \\end{pmatrix}$，$\\mathbf{x} = (1, 1)$ 时 $A\\mathbf{x} = (3, 1)$，$\\mathbf{x}^TA\\mathbf{x} = 3 + 1 = 4$，也等于 $1 + 2 \\cdot 2 - 1$。\n\n> **注意。** 要把 $A\\mathbf{x}$ 与 $\\mathbf{x}$ 作数量积，而不是与 $(1, 1, 1)$。展开式中非对角元算两次，漏掉它们就只剩对角部分。",
  ),
  generate(rng) {
    const [a, b, c] = [rng.int(-3, 4), rng.int(-3, 4), rng.int(-3, 4)];
    const [d, e, f0] = [nonzero(rng, 3), nonzero(rng, 3), nonzero(rng, 3)];
    const x = [nonzero(rng, 2), nonzero(rng, 2), nonzero(rng, 2)];
    // The cross terms must not cancel, or the diagonal part alone would already be the answer.
    const f = d * x[0]! * x[1]! + e * x[0]! * x[2]! + f0 * x[1]! * x[2]! === 0 ? -f0 : f0;
    const A = [
      [a, d, e],
      [d, b, f],
      [e, f, c],
    ];
    const Ax = A.map((r) => dot(r, x));
    const answer = dot(x, Ax);
    const diagonal = a * x[0]! ** 2 + b * x[1]! ** 2 + c * x[2]! ** 2;
    return numberProblem({
      prompt: t(
        `Find $\\mathbf{x}^TA\\mathbf{x}$ for $A = ${mat(A)}$ and $\\mathbf{x} = ${col(...x)}$.`,
        `$A = ${mat(A)}$，$\\mathbf{x} = ${col(...x)}$。求 $\\mathbf{x}^TA\\mathbf{x}$。`,
      ),
      answer,
      form: "integer",
      wrong: [diagonal, (answer + diagonal) / 2, dot(Ax, [1, 1, 1])],
      mistakes: [
        why(
          diagonal,
          "That keeps only the diagonal terms; the off-diagonal entries contribute too.",
          "这只保留了对角项；非对角元也有贡献。",
        ),
        why(
          (answer + diagonal) / 2,
          "Each off-diagonal entry was counted once; $a_{ij}$ and $a_{ji}$ both contribute.",
          "每个非对角元只算了一次；$a_{ij}$ 和 $a_{ji}$ 都有贡献。",
        ),
        why(
          dot(Ax, [1, 1, 1]),
          "That adds the entries of $A\\mathbf{x}$; dot them with $\\mathbf{x}$ instead.",
          "这是把 $A\\mathbf{x}$ 的分量相加；应与 $\\mathbf{x}$ 作数量积。",
        ),
        why(
          answer - diagonal,
          "That keeps only the cross terms; each diagonal entry adds $a_{ii}x_i^2$ as well.",
          "这只保留了交叉项；每个对角元还要加上 $a_{ii}x_i^2$。",
        ),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [["Multiply A by x", "计算 Ax"], t("", ""), [`A\\mathbf{x} = ${col(...Ax)}`]],
          [
            ["Dot with x", "与 x 作数量积"],
            t("", ""),
            [
              `${x[0]} \\cdot ${inParens(Ax[0]!)} + ${inParens(x[1]!)} \\cdot ${inParens(Ax[1]!)} + ${inParens(x[2]!)} \\cdot ${inParens(Ax[2]!)} = ${answer}`,
            ],
          ],
        ],
        t(
          `Written out, the diagonal terms give $${diagonal}$ and the off-diagonal terms give $2(${d * x[0]! * x[1]!} ${signedTerm(e * x[0]! * x[2]!)} ${signedTerm(f * x[1]! * x[2]!)}) = ${answer - diagonal}$, and $${diagonal} + ${inParens(answer - diagonal)} = ${answer}$.`,
          `展开后，对角项给出 $${diagonal}$，非对角项给出 $2(${d * x[0]! * x[1]!} ${signedTerm(e * x[0]! * x[2]!)} ${signedTerm(f * x[1]! * x[2]!)}) = ${answer - diagonal}$，而 $${diagonal} + ${inParens(answer - diagonal)} = ${answer}$。`,
        ),
      ),
    });
  },
};

const definiteRange: KnowledgePointDef = {
  id: "the-largest-entry-that-keeps-a-form-positive-definite",
  title: t("The largest entry that keeps a form positive definite", "保持二次型正定的最大元素"),
  explanation: t(
    "A symmetric $\\begin{pmatrix} a & k \\\\ k & b \\end{pmatrix}$ is positive definite exactly when $a > 0$ and $ab - k^2 > 0$. The second inequality is strict, so when $ab$ is a perfect square the value $k = \\sqrt{ab}$ is not allowed: the matrix would be singular. For example, with $a = 2$ and $b = 8$ we need $k^2 < 16$; $k = 4$ makes the determinant $0$, so the largest integer is $k = 3$.\n\n> **Watch out.** The bound $ab$ is on $k^2$, not on $k$, and it is strict: take the largest integer whose square is below $ab$.",
    "对称矩阵 $\\begin{pmatrix} a & k \\\\ k & b \\end{pmatrix}$ 正定，当且仅当 $a > 0$ 且 $ab - k^2 > 0$。第二个不等式是严格的，所以 $ab$ 是完全平方数时不能取 $k = \\sqrt{ab}$：那时矩阵是奇异的。例如 $a = 2$，$b = 8$ 时需要 $k^2 < 16$；$k = 4$ 使行列式为 $0$，所以最大整数是 $k = 3$。\n\n> **注意。** 界 $ab$ 限制的是 $k^2$，不是 $k$，而且是严格的：取平方小于 $ab$ 的最大整数。",
  ),
  generate(rng) {
    const a = rng.int(1, 6);
    // ab is at least 6, so the bound on k^2 and the bound on k are different numbers.
    const b = rng.int(Math.max(2, Math.ceil(6 / a)), 9);
    const ab = a * b;
    let answer = Math.floor(Math.sqrt(ab));
    if (answer * answer === ab) answer -= 1;
    return numberProblem({
      prompt: t(
        `What is the largest integer $k$ for which $${mat([
          [a, "k"],
          ["k", b],
        ])}$ is positive definite?`,
        `使 $${mat([
          [a, "k"],
          ["k", b],
        ])}$ 正定的最大整数 $k$ 是多少？`,
      ),
      answer,
      solveFor: "k",
      wrong: [answer + 1, ab, ab - 1],
      mistakes: [
        why(
          answer + 1,
          (answer + 1) ** 2 === ab
            ? `At $k = ${answer + 1}$ the determinant is $${ab} - ${ab} = 0$, and positive definite needs it strictly positive.`
            : `$${answer + 1}^2 = ${(answer + 1) ** 2}$ is more than $${ab}$, so the determinant would be negative.`,
          (answer + 1) ** 2 === ab
            ? `$k = ${answer + 1}$ 时行列式为 $${ab} - ${ab} = 0$，而正定要求它严格为正。`
            : `$${answer + 1}^2 = ${(answer + 1) ** 2}$ 大于 $${ab}$，行列式会是负的。`,
        ),
        why(ab, `$${ab}$ bounds $k^2$, not $k$.`, `$${ab}$ 限制的是 $k^2$，不是 $k$。`),
        why(ab - 1, `$${ab - 1}$ is the largest allowed value of $k^2$, not of $k$.`, `$${ab - 1}$ 是 $k^2$ 允许的最大值，不是 $k$ 的。`),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Write the conditions", "写出条件"],
            t(`The leading entry $${a}$ is positive, so only the determinant matters:`, `首元素 $${a}$ 为正，所以只需看行列式：`),
            [`${a} \\cdot ${b} - k^2 > 0`, `k^2 < ${ab}`],
          ],
          [
            ["Find the largest integer", "找出最大整数"],
            t("", ""),
            [`${answer}^2 = ${answer * answer} < ${ab}`, `${answer + 1}^2 = ${(answer + 1) ** 2} \\ge ${ab}`],
          ],
        ],
        t(
          `At $k = ${answer}$ the determinant is $${ab} - ${answer * answer} = ${ab - answer * answer} > 0$, and at $k = ${answer + 1}$ it is $${ab - (answer + 1) ** 2}$, which is not positive.`,
          `$k = ${answer}$ 时行列式为 $${ab} - ${answer * answer} = ${ab - answer * answer} > 0$，$k = ${answer + 1}$ 时为 $${ab - (answer + 1) ** 2}$，不是正的。`,
        ),
      ),
    });
  },
};

const conditionNumber: KnowledgePointDef = {
  id: "the-condition-number-from-singular-values",
  title: t("The condition number from singular values", "由奇异值求条件数"),
  explanation: t(
    "The condition number of an invertible matrix is the largest singular value divided by the smallest. It measures how much the matrix can magnify relative errors. When the columns are orthogonal, the singular values are simply the lengths of the columns. For example, the orthogonal columns $(3, 4)$ and $(-12, 9)$ have lengths $5$ and $15$, so the condition number is $\\frac{15}{5} = 3$.\n\n> **Watch out.** Divide the largest singular value by the smallest, so the condition number is at least $1$. Use the singular values themselves: the eigenvalues of $A^TA$ are their squares, and their ratio is the square of the condition number.",
    "可逆矩阵的条件数是最大奇异值除以最小奇异值，它衡量矩阵会把相对误差放大多少。各列正交时，奇异值就是各列的长度。例如正交的列 $(3, 4)$ 与 $(-12, 9)$ 长度为 $5$ 和 $15$，所以条件数是 $\\frac{15}{5} = 3$。\n\n> **注意。** 要用最大奇异值除以最小奇异值，所以条件数至少是 $1$。要用奇异值本身：$A^TA$ 的特征值是它们的平方，特征值之比是条件数的平方。",
  ),
  generate(rng) {
    const [p, q, r] = rng.pick(triples);
    const s = rng.int(1, 4);
    let u = rng.int(1, 4);
    if (u === s) u += 1;
    const big = Math.max(s, u);
    const small = Math.min(s, u);
    const A = [
      [p * s, -q * u],
      [q * s, p * u],
    ];
    return numberProblem({
      prompt: t(
        `The columns of $${mat(A)}$ are orthogonal. Find the condition number of this matrix, the ratio of its largest singular value to its smallest.`,
        `$${mat(A)}$ 的各列正交。求它的条件数，即最大奇异值与最小奇异值之比。`,
      ),
      answer: Q.of(big, small),
      wrong: [Q.of(small, big), r * big, Q.of(big * big, small * small)],
      mistakes: [
        why(
          Q.of(small, big),
          "That is upside down: the largest singular value goes on top, so the condition number is at least $1$.",
          "上下颠倒了：最大奇异值在分子上，所以条件数至少是 $1$。",
        ),
        why(
          r * big,
          `$${r * big}$ is the largest singular value alone; it still has to be divided by the smallest, $${r * small}$.`,
          `$${r * big}$ 只是最大奇异值；还要除以最小奇异值 $${r * small}$。`,
        ),
        why(
          Q.of(big * big, small * small),
          `That is the ratio of the eigenvalues $${r * r * big * big}$ and $${r * r * small * small}$ of $A^TA$, the square of the condition number.`,
          `这是 $A^TA$ 的特征值 $${r * r * big * big}$ 与 $${r * r * small * small}$ 之比，即条件数的平方。`,
        ),
      ],
      solution: walked(
        [
          [
            ["Find the column lengths", "求各列长度"],
            t("For orthogonal columns these are the singular values:", "各列正交时，它们就是奇异值："),
            [`\\sqrt{${p * s}^2 + ${q * s}^2} = ${r * s}, \\quad \\sqrt{${inParens(-q * u)}^2 + ${p * u}^2} = ${r * u}`],
          ],
          [
            ["Divide the larger by the smaller", "较大者除以较小者"],
            t("", ""),
            [`\\frac{${r * big}}{${r * small}}${frac(big, small) === `\\frac{${r * big}}{${r * small}}` ? "" : ` = ${frac(big, small)}`}`],
          ],
        ],
        t(
          `$A^TA$ is diagonal with entries $${r * r * s * s}$ and $${r * r * u * u}$; the square root of their ratio is $\\sqrt{${frac(big * big, small * small)}} = ${frac(big, small)}$.`,
          `$A^TA$ 是对角矩阵，对角元为 $${r * r * s * s}$ 和 $${r * r * u * u}$；它们之比的平方根是 $\\sqrt{${frac(big * big, small * small)}} = ${frac(big, small)}$。`,
        ),
      ),
    });
  },
};

const pseudoinverseOfADiagonal: KnowledgePointDef = {
  id: "the-pseudoinverse-of-a-diagonal-matrix",
  title: t("The pseudoinverse of a diagonal matrix", "对角矩阵的伪逆"),
  explanation: t(
    "The pseudoinverse of a diagonal matrix inverts each nonzero entry and leaves each zero as zero. A singular matrix has no true inverse, but on the directions it does not kill, its pseudoinverse undoes it. For example, $\\operatorname{diag}(2, 0, -4)$ has pseudoinverse $\\operatorname{diag}(\\frac{1}{2}, 0, -\\frac{1}{4})$, whose trace is $\\frac{1}{4}$.\n\n> **Watch out.** Invert entry by entry and then add: the trace of the pseudoinverse is not the reciprocal of the trace. A zero entry stays $0$ and adds nothing.",
    "对角矩阵的伪逆把每个非零元素取倒数，零仍然是零。奇异矩阵没有真正的逆，但在它不压缩为零的方向上，伪逆能把它还原。例如 $\\operatorname{diag}(2, 0, -4)$ 的伪逆是 $\\operatorname{diag}(\\frac{1}{2}, 0, -\\frac{1}{4})$，迹为 $\\frac{1}{4}$。\n\n> **注意。** 先逐个元素取倒数再相加：伪逆的迹不是迹的倒数。零元素仍为 $0$，对和没有贡献。",
  ),
  generate(rng) {
    const a = nonzero(rng, 5);
    let b = nonzero(rng, 5);
    if (b === -a) b = a;
    const zeros = rng.int(0, 2);
    const diagonal = [a, b, 0];
    const entries = [diagonal[zeros % 3]!, diagonal[(zeros + 1) % 3]!, diagonal[(zeros + 2) % 3]!];
    const answer = Q.of(1, a).add(Q.of(1, b));
    return numberProblem({
      prompt: t(
        `Find the trace of the pseudoinverse of $${mat([
          [entries[0]!, 0, 0],
          [0, entries[1]!, 0],
          [0, 0, entries[2]!],
        ])}$.`,
        `求 $${mat([
          [entries[0]!, 0, 0],
          [0, entries[1]!, 0],
          [0, 0, entries[2]!],
        ])}$ 的伪逆的迹。`,
      ),
      answer,
      mistakes: [
        why(
          a + b,
          `$${a + b}$ is the trace of the matrix itself; invert the nonzero entries first.`,
          `$${a + b}$ 是原矩阵的迹；要先把非零元素取倒数。`,
        ),
        why(
          Q.of(1, a + b),
          `That inverts the trace, $${frac(1, a + b)}$; the trace of the pseudoinverse adds the reciprocals $${frac(1, a)}$ and $${frac(1, b)}$.`,
          `这是把迹取了倒数 $${frac(1, a + b)}$；伪逆的迹要把倒数 $${frac(1, a)}$ 和 $${frac(1, b)}$ 相加。`,
        ),
        why(
          Q.of(1, a * b),
          `That multiplies the reciprocals; the trace adds the diagonal entries $${frac(1, a)}$ and $${frac(1, b)}$.`,
          `这是把倒数相乘了；迹是对角元 $${frac(1, a)}$ 与 $${frac(1, b)}$ 之和。`,
        ),
        why(
          Q.of(1, Math.abs(a)).add(Q.of(1, Math.abs(b))),
          `That drops a sign: the reciprocal of a negative entry is negative, so add $${frac(1, a)}$ and $${frac(1, b)}$ with their signs.`,
          `这里丢了符号：负数的倒数仍是负数，要带符号把 $${frac(1, a)}$ 和 $${frac(1, b)}$ 相加。`,
        ),
      ].filter((m, i, all) => String(m.value) !== String(answer) && all.findIndex((o) => String(o.value) === String(m.value)) === i),
      solution: walked(
        [
          [
            ["Invert the nonzero entries", "非零元素取倒数"],
            t("Each nonzero diagonal entry is inverted and the zero stays $0$:", "每个非零对角元取倒数，零仍为 $0$："),
            [`${frac(1, a)}, \\quad ${frac(1, b)}, \\quad 0`],
          ],
          [
            ["Add the diagonal", "对角元相加"],
            t("", ""),
            [`${frac(1, a)} ${b < 0 ? "-" : "+"} ${frac(1, Math.abs(b))} + 0 = ${answer.toLatex()}`],
          ],
        ],
        t(
          "The matrix times its pseudoinverse is diagonal with entries $1$, $1$ and $0$: the pseudoinverse undoes the two directions that are not sent to $\\mathbf{0}$.",
          "矩阵乘它的伪逆是对角矩阵，对角元为 $1$、$1$ 和 $0$：伪逆还原了没有被送到 $\\mathbf{0}$ 的两个方向。",
        ),
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Applications
// ---------------------------------------------------------------------------

const rateOfConvergence: KnowledgePointDef = {
  id: "how-fast-a-two-state-chain-settles",
  title: t("How fast a two-state chain settles", "两状态马尔可夫链的收敛速度"),
  explanation: t(
    "A $2 \\times 2$ stochastic matrix has the eigenvalue $1$, and since the eigenvalues add up to the trace, its other eigenvalue is the trace minus one. Each step multiplies the distance from the steady state by this second eigenvalue, so a value near zero means the chain settles quickly. For example, $P = \\begin{pmatrix} 0.9 & 0.3 \\\\ 0.1 & 0.7 \\end{pmatrix}$ has trace $1.6$, so its second eigenvalue is $0.6$, and each step shrinks the distance to $60\\%$ of what it was.\n\n> **Watch out.** The factor is the second eigenvalue, not the eigenvalue $1$ of the steady state; it is the trace minus $1$, not the sum of the two leaving probabilities, and not the product of the diagonal entries.",
    "二阶随机矩阵有特征值 $1$，又因为特征值之和等于迹，另一个特征值是迹减一。每走一步，到稳态的距离就乘以这第二个特征值，所以它接近零时，链很快稳定。例如 $P = \\begin{pmatrix} 0.9 & 0.3 \\\\ 0.1 & 0.7 \\end{pmatrix}$ 的迹是 $1.6$，第二个特征值是 $0.6$，每走一步距离缩小为原来的 $60\\%$。\n\n> **注意。** 这个倍数是第二个特征值，不是稳态对应的特征值 $1$；它等于迹减 $1$，不是两个离开概率之和，也不是对角元素的乘积。",
  ),
  generate(rng) {
    const p = rng.int(1, 8);
    const q = rng.int(1, 9 - p);
    const stay1 = 10 - p;
    const stay2 = 10 - q;
    const answer = Q.of(10 - p - q, 10);
    const trace = Q.of(stay1 + stay2, 10);
    return numberProblem({
      prompt: t(
        `Each step of a Markov chain multiplies the state by $P = ${mat([
          [Q.of(stay1, 10).toLatex(), Q.of(q, 10).toLatex()],
          [Q.of(p, 10).toLatex(), Q.of(stay2, 10).toLatex()],
        ])}$. By what factor does each step multiply the distance from the steady state?`,
        `马尔可夫链每一步把状态乘以 $P = ${mat([
          [Q.of(stay1, 10).toLatex(), Q.of(q, 10).toLatex()],
          [Q.of(p, 10).toLatex(), Q.of(stay2, 10).toLatex()],
        ])}$。每一步把到稳态的距离乘以多少？`,
      ),
      answer,
      mistakes: [
        why(
          1,
          "$1$ is the eigenvalue of the steady state, which does not change; the distance from it shrinks by the other eigenvalue.",
          "$1$ 是稳态对应的特征值，稳态本身不变；到稳态的距离按另一个特征值缩小。",
        ),
        why(
          Q.of(p + q, 10),
          `$${Q.of(p + q, 10).toLatex()}$ is $1$ minus the factor, the sum of the two leaving probabilities; the factor is the trace minus $1$.`,
          `$${Q.of(p + q, 10).toLatex()}$ 是 $1$ 减去所求倍数，即两个离开概率之和；所求倍数是迹减 $1$。`,
        ),
        why(
          Q.of(stay1 * stay2, 100),
          "That multiplies the diagonal entries; the eigenvalues add up to the trace, so the second one is the trace minus $1$.",
          "这是把对角元素相乘；特征值之和等于迹，所以第二个特征值是迹减 $1$。",
        ),
        why(
          trace,
          `$${trace.toLatex()}$ is the trace, the sum of both eigenvalues; subtract the eigenvalue $1$.`,
          `$${trace.toLatex()}$ 是迹，即两个特征值之和；要减去特征值 $1$。`,
        ),
      ].filter((m, i, all) => String(m.value) !== String(answer) && all.findIndex((o) => String(o.value) === String(m.value)) === i),
      solution: walked(
        [
          [
            ["Use the trace", "利用迹"],
            t("The eigenvalues add up to the trace:", "特征值之和等于迹："),
            [`1 + \\lambda_2 = ${Q.of(stay1, 10).toLatex()} + ${Q.of(stay2, 10).toLatex()} = ${trace.toLatex()}`],
          ],
          [
            ["Solve for the second eigenvalue", "解出第二个特征值"],
            t("", ""),
            [`\\lambda_2 = ${trace.toLatex()} - 1 = ${answer.toLatex()}`],
          ],
        ],
        t(
          `The product of the eigenvalues is $\\det P = ${Q.of(stay1 * stay2 - p * q, 100).toLatex()} = 1 \\cdot ${answer.toLatex()}$.`,
          `两个特征值之积为 $\\det P = ${Q.of(stay1 * stay2 - p * q, 100).toLatex()} = 1 \\cdot ${answer.toLatex()}$。`,
        ),
      ),
    });
  },
};

const slopeFromNormalEquations: KnowledgePointDef = {
  id: "the-slope-from-the-normal-equations",
  title: t("The slope of a regression line from the normal equations", "由正规方程求回归直线的斜率"),
  explanation: t(
    "For the line $y = b_0 + b_1x$ the matrix $X$ has a column of ones and a column of $x$ values. Solving $X^TX\\mathbf{b} = X^T\\mathbf{y}$ for the slope gives $b_1 = \\frac{n\\sum xy - \\sum x\\sum y}{n\\sum x^2 - (\\sum x)^2}$, which counts the data points $n$ and uses each of the sums. For example, $(0, 1), (1, 1), (2, 4)$ have $n = 3$, $\\sum x = 3$, $\\sum y = 6$, $\\sum x^2 = 5$, $\\sum xy = 9$, so $b_1 = \\frac{27 - 18}{15 - 9} = \\frac{3}{2}$.\n\n> **Watch out.** $\\frac{\\sum xy}{\\sum x^2}$ is the slope of a line forced through the origin; with an intercept, both the numerator and the denominator need the correction terms with $\\sum x$, and the fraction must not be turned upside down.",
    "对直线 $y = b_0 + b_1x$，矩阵 $X$ 有一列 1 和一列 $x$ 值。由 $X^TX\\mathbf{b} = X^T\\mathbf{y}$ 解出斜率，得 $b_1 = \\frac{n\\sum xy - \\sum x\\sum y}{n\\sum x^2 - (\\sum x)^2}$，其中 $n$ 是数据点的个数，每个和都要用到。例如 $(0, 1), (1, 1), (2, 4)$ 有 $n = 3$，$\\sum x = 3$，$\\sum y = 6$，$\\sum x^2 = 5$，$\\sum xy = 9$，所以 $b_1 = \\frac{27 - 18}{15 - 9} = \\frac{3}{2}$。\n\n> **注意。** $\\frac{\\sum xy}{\\sum x^2}$ 是强制过原点的直线的斜率；有截距时，分子和分母都需要含 $\\sum x$ 的修正项，分式也不能颠倒。",
  ),
  generate(rng) {
    const n = 4;
    const start = rng.int(-2, 3);
    const xs = [start, start + 1, start + 2, start + 4];
    const ys = xs.map(() => rng.int(-3, 8));
    if (new Set(ys).size === 1) ys[0]! += 1;
    // A flat line would leave too few distinct wrong slopes; raising the last y changes n·Σxy − Σx·Σy by 9.
    if (n * dot(xs, ys) - xs.reduce((a, b) => a + b, 0) * ys.reduce((a, b) => a + b, 0) === 0) ys[3]! += 1;
    const [sx, sy, sxx, sxy] = [xs.reduce((a, b) => a + b, 0), ys.reduce((a, b) => a + b, 0), dot(xs, xs), dot(xs, ys)];
    const denominator = n * sxx - sx * sx;
    const numerator = n * sxy - sx * sy;
    const answer = Q.of(numerator, denominator);
    const leftOver = Q.of(sy).sub(answer.mul(Q.of(sx)));
    const intercept = leftOver.div(Q.of(n));
    const points = xs.map((x, i) => `(${x}, ${ys[i]})`).join(", ");
    return numberProblem({
      prompt: t(`Find the slope of the least-squares line through the points $${points}$.`, `求过点 $${points}$ 的最小二乘直线的斜率。`),
      answer,
      mistakes: distinctFrom(answer, [
        ...(sxx === 0
          ? []
          : [
              why(
                Q.of(sxy, sxx),
                "That is $\\frac{\\sum xy}{\\sum x^2}$, the slope of a line forced through the origin; the line here has an intercept.",
                "这是 $\\frac{\\sum xy}{\\sum x^2}$，即强制过原点的直线的斜率；这里的直线有截距。",
              ),
            ]),
        ...(sx === 0
          ? []
          : [
              why(
                Q.of(sy, sx),
                "That is $\\frac{\\sum y}{\\sum x}$, the ratio of the means, which is the slope only for a line through the origin and the mean point.",
                "这是 $\\frac{\\sum y}{\\sum x}$，即两个平均值之比，只有直线过原点和平均点时才是斜率。",
              ),
            ]),
        ...(numerator === 0
          ? []
          : [
              why(
                Q.of(denominator, numerator),
                "The fraction is upside down: the sums with $y$ go in the numerator.",
                "分式颠倒了：含 $y$ 的和在分子上。",
              ),
            ]),
        why(Q.of(n * sxy - sx * sy, n * sxx), "The denominator lost its correction $(\\sum x)^2$.", "分母漏掉了修正项 $(\\sum x)^2$。"),
      ]),
      solution: walked(
        [
          [
            ["Compute the sums", "计算各个和"],
            t("", ""),
            [`\\sum x = ${sx}, \\quad \\sum y = ${sy}, \\quad \\sum x^2 = ${sxx}, \\quad \\sum xy = ${sxy}`],
          ],
          [
            ["Put them into the slope", "代入斜率公式"],
            t("", ""),
            [
              `b_1 = \\frac{${n} \\cdot ${inParens(sxy)} - ${inParens(sx)} \\cdot ${inParens(sy)}}{${n} \\cdot ${sxx} - ${inParens(sx)}^2} = \\frac{${numerator}}{${denominator}} = ${answer.toLatex()}`,
            ],
          ],
        ],
        t(
          `The intercept is $b_0 = \\frac{\\sum y - b_1\\sum x}{n} = ${intercept.toLatex()}$, and the residuals then add to $0$: $\\sum y - ${n}b_0 - b_1\\sum x = 0$.`,
          `截距为 $b_0 = \\frac{\\sum y - b_1\\sum x}{n} = ${intercept.toLatex()}$，此时残差之和为 $0$：$\\sum y - ${n}b_0 - b_1\\sum x = 0$。`,
        ),
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Second pass
// ---------------------------------------------------------------------------

/** signedTerm writes an integer as a term to be added, with its sign and a space. */
const signedTerm = (n: number) => (n < 0 ? `- ${-n}` : `+ ${n}`);
/** det3 expands the determinant of a 3 by 3 matrix along its first row. */
const det3 = ([[a, b, c], [d, e, f], [g, h, i]]: [[number, number, number], [number, number, number], [number, number, number]]) =>
  a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
/** withCoefficient writes a positive coefficient before a symbol, leaving out 1. */
const withCoefficient = (n: number, symbol: string) => `${n === 1 ? "" : n}${symbol}`;
/** shiftTerm writes a multiple of the identity as a term to be added, leaving out a coefficient of 1. */
const shiftTerm = (n: number) => `${n < 0 ? "-" : "+"} ${withCoefficient(Math.abs(n), "I")}`;
/** binomial2 counts the ways to choose two things from n. */
const binomial2 = (n: number) => (n * (n - 1)) / 2;

/** asQ turns a coefficient into an exact rational. */
const asQ = (c: number | Q): Q => (typeof c === "number" ? Q.of(c) : c);
/** distinctFrom keeps the mistakes whose values differ from the answer and from each other. */
const distinctFrom = <M extends { value: number | Q }>(answer: number | Q, ms: readonly M[]): M[] =>
  ms.filter((m, i) => !asQ(m.value).eq(asQ(answer)) && ms.findIndex((x) => asQ(x.value).eq(asQ(m.value))) === i);

const lineMeetsHorizontalPlane: KnowledgePointDef = {
  id: "where-a-line-meets-a-plane-of-constant-height",
  title: t("Where a line meets a plane of constant height", "直线与等高平面的交点"),
  explanation: t(
    "A point lies on a parametric line for exactly one value of the parameter, so a condition on one coordinate decides the whole point. To find where a line meets the plane $z = k$, solve the $z$ equation for $t$, then put that value of $t$ into the other coordinates. All three coordinates must use the same value of the parameter. The line $x = 1 + 2t$, $z = 3 + t$ meets $z = 5$ where $3 + t = 5$, at $t = 2$, so $x = 1 + 4 = 5$.\n\n> **Watch out.** The value of $t$ is not the coordinate asked for: put it into the $x$ equation. And $t$ solves $c + rt = k$, so $t = \\frac{k - c}{r}$; dropping the starting height $c$ or the division by $r$ gives a different point.",
    "参数直线上的一个点恰好对应一个参数值，所以对一个坐标的条件就决定了整个点。要求直线与平面 $z = k$ 的交点，先从 $z$ 的方程解出 $t$，再把这个 $t$ 代入其他坐标。三个坐标必须使用同一个参数值。直线 $x = 1 + 2t$，$z = 3 + t$ 与 $z = 5$ 相交于 $3 + t = 5$，即 $t = 2$，所以 $x = 1 + 4 = 5$。\n\n> **注意。** $t$ 的值不是所求的坐标：要把它代入 $x$ 的方程。而且 $t$ 是 $c + rt = k$ 的解，$t = \\frac{k - c}{r}$；漏掉起始高度 $c$ 或漏除以 $r$，得到的是另一个点。",
  ),
  generate(rng) {
    const a = rng.int(-5, 5);
    const b = rng.int(-5, 5);
    const c = rng.int(-5, 5);
    const p = nonzero(rng, 4);
    const q = nonzero(rng, 4);
    const r = nonzero(rng, 4);
    const k = rng.pick([...Array(21).keys()].map((i) => i - 10).filter((v) => v !== c));
    const time = Q.of(k - c, r);
    const answer = Q.of(a).add(time.mul(Q.of(p)));
    const z = poly([c, ""], [r, "t"]);
    return numberProblem({
      prompt: t(
        `The line $x = ${poly([a, ""], [p, "t"])}$, $y = ${poly([b, ""], [q, "t"])}$, $z = ${z}$ meets the plane $z = ${k}$. Find the $x$-coordinate of that point.`,
        `直线 $x = ${poly([a, ""], [p, "t"])}$，$y = ${poly([b, ""], [q, "t"])}$，$z = ${z}$ 与平面 $z = ${k}$ 相交。求交点的 $x$ 坐标。`,
      ),
      answer,
      solution: walked(
        [
          [["Find $t$ from the height", "由高度求 $t$"], t("", ""), [`${z} = ${k} \\implies t = ${time.toLatex()}`]],
          [
            ["Put $t$ into $x$", "把 $t$ 代入 $x$"],
            t("", ""),
            [`x = ${a} + ${inParens(p)} \\cdot \\left(${time.toLatex()}\\right) = ${answer.toLatex()}`],
          ],
        ],
        t(
          `At $t = ${time.toLatex()}$, $z = ${c} + ${inParens(r)} \\cdot \\left(${time.toLatex()}\\right) = ${k}$, so the point is on the plane.`,
          `$t = ${time.toLatex()}$ 时，$z = ${c} + ${inParens(r)} \\cdot \\left(${time.toLatex()}\\right) = ${k}$，所以该点在平面上。`,
        ),
      ),
      mistakes: distinctFrom(answer, [
        why(
          time,
          "That is the value of the parameter $t$; put it into the equation for $x$.",
          "这是参数 $t$ 的值；还要把它代入 $x$ 的方程。",
        ),
        why(
          Q.of(a + p * (k - c)),
          `That uses $t = ${k - c}$: solving $${z} = ${k}$ also divides by $${r}$.`,
          `这用的是 $t = ${k - c}$：解 $${z} = ${k}$ 时还要除以 $${r}$。`,
        ),
        why(
          Q.of(a).add(Q.of(k, r).mul(Q.of(p))),
          `That uses $t = \\frac{${k}}{${r}}$, leaving out the starting height $${c}$.`,
          `这用的是 $t = \\frac{${k}}{${r}}$，漏掉了起始高度 $${c}$。`,
        ),
        why(
          Q.of(a).sub(time.mul(Q.of(p))),
          "The step $pt$ was subtracted instead of added: $x = a + pt$.",
          "把 $pt$ 减掉了，应当加上：$x = a + pt$。",
        ),
      ]),
    });
  },
};

const pointOnSymmetricLine: KnowledgePointDef = {
  id: "a-point-on-a-line-in-symmetric-form",
  title: t("A point on a line in symmetric form", "对称式直线上的点"),
  explanation: t(
    "In the symmetric form of a line, the three fractions share one value, and that shared value is the parameter $t$. So once one coordinate is known, its fraction gives $t$, and every other coordinate follows by solving its own fraction. There is no need to convert to parametric equations first, although the working is exactly the same. On $\\frac{x - 1}{2} = \\frac{y + 3}{4} = \\frac{z}{5}$ with $x = 7$: the common value is $\\frac{6}{2} = 3$, so $y = -3 + 4 \\cdot 3 = 9$.\n\n> **Watch out.** Multiply the common value by the denominator under $y$, not the one under $x$, and add back the starting value: $y + 3$ means the line starts at $y = -3$.",
    "在直线的对称式中，三个分式取同一个值，这个共同的值就是参数 $t$。所以一旦知道一个坐标，它的分式就给出 $t$，其他坐标都可以由各自的分式解出。不需要先化成参数方程，尽管计算实质上是一样的。在 $\\frac{x - 1}{2} = \\frac{y + 3}{4} = \\frac{z}{5}$ 上取 $x = 7$：共同值是 $\\frac{6}{2} = 3$，所以 $y = -3 + 4 \\cdot 3 = 9$。\n\n> **注意。** 共同值要乘以 $y$ 下面的分母，而不是 $x$ 下面的，然后加回起始值：$y + 3$ 表示直线从 $y = -3$ 出发。",
  ),
  generate(rng) {
    const a = nonzero(rng, 6);
    const b = nonzero(rng, 6);
    const c = nonzero(rng, 6);
    const p = rng.int(2, 6);
    const q = rng.int(2, 6);
    const r = rng.int(2, 6);
    const x = rng.pick([...Array(21).keys()].map((i) => i - 10).filter((v) => v !== a));
    const shift = Q.of(q * (x - a), p);
    const answer = Q.of(b).add(shift);
    const line = `\\frac{x ${signedTerm(-a)}}{${p}} = \\frac{y ${signedTerm(-b)}}{${q}} = \\frac{z ${signedTerm(-c)}}{${r}}`;
    const value = Q.of(x - a, p);
    return numberProblem({
      prompt: t(
        `A point on the line $${line}$ has $x = ${x}$. Find its $y$-coordinate.`,
        `直线 $${line}$ 上的一点满足 $x = ${x}$。求它的 $y$ 坐标。`,
      ),
      answer,
      solution: walked(
        [
          [["Find the common value", "求共同值"], t("", ""), [`\\frac{${x} ${signedTerm(-a)}}{${p}} = ${value.toLatex()}`]],
          [
            ["Solve the $y$ fraction", "解 $y$ 的分式"],
            t("", ""),
            [
              `\\frac{y ${signedTerm(-b)}}{${q}} = ${value.toLatex()} \\implies y = ${b} + ${q} \\cdot \\left(${value.toLatex()}\\right) = ${answer.toLatex()}`,
            ],
          ],
        ],
        t(
          `$\\frac{${answer.toLatex()} ${signedTerm(-b)}}{${q}} = ${value.toLatex()}$, the same value as the $x$ fraction, so the point is on the line.`,
          `$\\frac{${answer.toLatex()} ${signedTerm(-b)}}{${q}} = ${value.toLatex()}$，与 $x$ 的分式值相同，所以该点在直线上。`,
        ),
      ),
      mistakes: distinctFrom(answer, [
        why(shift, `That is the change in $y$ alone; add the starting value $${b}$.`, `这只是 $y$ 的变化量；还要加上起始值 $${b}$。`),
        why(Q.of(b).sub(shift), "The change in $y$ was subtracted: $y = b + q \\cdot t$.", "把 $y$ 的变化量减掉了：$y = b + q \\cdot t$。"),
        why(
          Q.of(b).add(Q.of(p * (x - a), q)),
          "The denominators are swapped: the $x$ fraction divides by its own denominator, and $y$ multiplies by its own.",
          "分母弄反了：$x$ 的分式除以它自己的分母，$y$ 乘以它自己的分母。",
        ),
        why(
          value,
          "That is the common value of the fractions; solve the $y$ fraction for $y$.",
          "这是分式的共同值；还要由 $y$ 的分式解出 $y$。",
        ),
      ]),
    });
  },
};

const planeIntercept: KnowledgePointDef = {
  id: "the-intercept-of-a-plane-on-an-axis",
  title: t("The intercept of a plane on an axis", "平面在坐标轴上的截距"),
  explanation: t(
    "Every point on the $x$-axis has the form $(x, 0, 0)$. Putting this into the equation $\\mathbf{n} \\cdot \\mathbf{r} = d$ leaves only the term with the first component of the normal, so $n_1 x = d$. The intercept therefore divides $d$ by that one component. The other two components of the normal affect the other two intercepts instead. The plane $\\langle 2, 5, -1 \\rangle \\cdot \\mathbf{r} = 6$ meets the $x$-axis where $2x = 6$, at $x = 3$.\n\n> **Watch out.** Divide $d$ by $n_1$, not $n_1$ by $d$, and keep both signs. The components of $y$ and $z$ drop out because those coordinates are $0$ on the $x$-axis.",
    "$x$ 轴上的每个点都形如 $(x, 0, 0)$。把它代入方程 $\\mathbf{n} \\cdot \\mathbf{r} = d$，只留下含法向量第一个分量的项，所以 $n_1 x = d$。因此截距就是 $d$ 除以这一个分量。法向量的另外两个分量影响的是另外两个截距。平面 $\\langle 2, 5, -1 \\rangle \\cdot \\mathbf{r} = 6$ 与 $x$ 轴相交于 $2x = 6$，即 $x = 3$。\n\n> **注意。** 是 $d$ 除以 $n_1$，不是 $n_1$ 除以 $d$，两者的符号都要保留。$y$ 和 $z$ 的分量消失，是因为在 $x$ 轴上这两个坐标为 $0$。",
  ),
  generate(rng) {
    const n1 = nonzero(rng, 9);
    const n2 = nonzero(rng, 9);
    const n3 = nonzero(rng, 9);
    const d = nonzero(rng, 20);
    const answer = Q.of(d, n1);
    return numberProblem({
      prompt: t(
        `A plane has equation $\\langle ${n1}, ${n2}, ${n3} \\rangle \\cdot \\mathbf{r} = ${d}$. Find the $x$-coordinate of the point where it meets the $x$-axis.`,
        `一个平面的方程是 $\\langle ${n1}, ${n2}, ${n3} \\rangle \\cdot \\mathbf{r} = ${d}$。求它与 $x$ 轴交点的 $x$ 坐标。`,
      ),
      answer,
      solution: walked(
        [
          [
            ["Put a point of the $x$-axis in", "代入 $x$ 轴上的点"],
            t("At $(x, 0, 0)$ the terms in $y$ and $z$ vanish:", "在 $(x, 0, 0)$ 处，含 $y$ 和 $z$ 的项为零："),
            [`${n1}x + ${inParens(n2)} \\cdot 0 + ${inParens(n3)} \\cdot 0 = ${d}`],
          ],
          [
            ["Solve for $x$", "解出 $x$"],
            t(`$x = \\frac{${d}}{${n1}} = ${answer.toLatex()}$.`, `$x = \\frac{${d}}{${n1}} = ${answer.toLatex()}$。`),
          ],
        ],
        t(
          `$\\langle ${n1}, ${n2}, ${n3} \\rangle \\cdot \\langle ${answer.toLatex()}, 0, 0 \\rangle = ${n1} \\cdot ${answer.toLatex()} = ${d}$, so the point is on the plane.`,
          `$\\langle ${n1}, ${n2}, ${n3} \\rangle \\cdot \\langle ${answer.toLatex()}, 0, 0 \\rangle = ${n1} \\cdot ${answer.toLatex()} = ${d}$，所以该点在平面上。`,
        ),
      ),
      mistakes: distinctFrom(answer, [
        why(
          Q.of(n1, d),
          "The fraction is upside down: $n_1 x = d$ gives $x = \\frac{d}{n_1}$.",
          "分数上下颠倒了：$n_1 x = d$ 得 $x = \\frac{d}{n_1}$。",
        ),
        why(
          Q.of(d, n2),
          "That divides by the $y$ component; on the $x$-axis $y = 0$, so only $n_1$ remains.",
          "这是除以 $y$ 的分量；在 $x$ 轴上 $y = 0$，只剩下 $n_1$。",
        ),
        why(
          answer.neg(),
          "The sign is wrong: divide $d$ by $n_1$, keeping both signs.",
          "符号错了：用 $d$ 除以 $n_1$，两者的符号都要保留。",
        ),
        why(Q.of(d), `That forgets to divide by $n_1 = ${n1}$.`, `漏除以 $n_1 = ${n1}$。`),
      ]),
    });
  },
};

const planeConstantFromSpan: KnowledgePointDef = {
  id: "the-scalar-equation-from-a-parametric-plane",
  figure: linearAlgebraDrawings1["the-parametric-equations-of-a-plane#the-scalar-equation-from-a-parametric-plane"],
  title: t("The scalar equation from a parametric plane", "由参数平面求标量方程"),
  explanation: t(
    "Both spanning vectors of a plane are perpendicular to its normal, so their cross product $\\mathbf{n} = \\mathbf{u} \\times \\mathbf{v}$ is a normal. The value $\\mathbf{n} \\cdot \\mathbf{r}$ is the same at every point of the plane, because moving along $\\mathbf{u}$ or $\\mathbf{v}$ does not change it. So the base point supplies the constant $d = \\mathbf{n} \\cdot \\mathbf{p}$. Through $(1, 0, 2)$ spanned by $\\langle 1, 0, 0 \\rangle$ and $\\langle 0, 1, 0 \\rangle$: $\\mathbf{n} = \\langle 0, 0, 1 \\rangle$ and $d = 2$, the plane $z = 2$.\n\n> **Watch out.** The constant comes from the base point, not from a spanning vector: $\\mathbf{n} \\cdot \\mathbf{u} = 0$ for each spanning vector. The order $\\mathbf{u} \\times \\mathbf{v}$ matters too, since $\\mathbf{v} \\times \\mathbf{u}$ flips the sign of $d$.",
    "平面的两个张成向量都垂直于法向量，所以它们的叉积 $\\mathbf{n} = \\mathbf{u} \\times \\mathbf{v}$ 就是法向量。$\\mathbf{n} \\cdot \\mathbf{r}$ 的值在平面上每一点都相同，因为沿 $\\mathbf{u}$ 或 $\\mathbf{v}$ 移动都不改变它。所以基点给出常数 $d = \\mathbf{n} \\cdot \\mathbf{p}$。过 $(1, 0, 2)$、由 $\\langle 1, 0, 0 \\rangle$ 和 $\\langle 0, 1, 0 \\rangle$ 张成的平面：$\\mathbf{n} = \\langle 0, 0, 1 \\rangle$，$d = 2$，即平面 $z = 2$。\n\n> **注意。** 常数来自基点，而不是张成向量：每个张成向量都有 $\\mathbf{n} \\cdot \\mathbf{u} = 0$。$\\mathbf{u} \\times \\mathbf{v}$ 的顺序也要紧，$\\mathbf{v} \\times \\mathbf{u}$ 会使 $d$ 变号。",
  ),
  generate(rng) {
    const point = [nonzero(rng, 5), nonzero(rng, 5), nonzero(rng, 5)];
    const u = [1, nonzero(rng, 3), nonzero(rng, 3)] as const;
    const v = [0, 1, nonzero(rng, 3)] as const;
    const normal = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const answer = dot(normal, point);
    const moved = point.map((x, i) => x + u[i]!);
    return numberProblem({
      prompt: t(
        `A plane has equation $\\mathbf{r}(s, t) = \\langle ${point.join(", ")} \\rangle + s\\langle ${u.join(", ")} \\rangle + t\\langle ${v.join(", ")} \\rangle$. With $\\mathbf{n}$ the cross product of the first spanning vector with the second, write the plane as $\\mathbf{n} \\cdot \\mathbf{r} = d$. Find $d$.`,
        `一个平面的方程是 $\\mathbf{r}(s, t) = \\langle ${point.join(", ")} \\rangle + s\\langle ${u.join(", ")} \\rangle + t\\langle ${v.join(", ")} \\rangle$。设 $\\mathbf{n}$ 是第一个张成向量与第二个张成向量的叉积，把平面写成 $\\mathbf{n} \\cdot \\mathbf{r} = d$。求 $d$。`,
      ),
      answer,
      form: "integer",
      solution: walked(
        [
          [
            ["Take the cross product", "求叉积"],
            t("", ""),
            [
              `\\mathbf{n} = \\langle ${u.join(", ")} \\rangle \\times \\langle ${v.join(", ")} \\rangle = \\langle ${normal.join(", ")} \\rangle`,
            ],
          ],
          [
            ["Dot it with the base point", "与基点作点积"],
            t("", ""),
            [`d = \\langle ${normal.join(", ")} \\rangle \\cdot \\langle ${point.join(", ")} \\rangle = ${answer}`],
          ],
        ],
        t(
          `$\\mathbf{n} \\cdot \\mathbf{u} = ${dot(normal, u)}$ and $\\mathbf{n} \\cdot \\mathbf{v} = ${dot(normal, v)}$, and the point $\\langle ${moved.join(", ")} \\rangle$ at $s = 1$, $t = 0$ also gives $\\mathbf{n} \\cdot \\mathbf{r} = ${dot(normal, moved)}$.`,
          `$\\mathbf{n} \\cdot \\mathbf{u} = ${dot(normal, u)}$，$\\mathbf{n} \\cdot \\mathbf{v} = ${dot(normal, v)}$；$s = 1$、$t = 0$ 时的点 $\\langle ${moved.join(", ")} \\rangle$ 同样给出 $\\mathbf{n} \\cdot \\mathbf{r} = ${dot(normal, moved)}$。`,
        ),
      ),
      mistakes: distinctFrom(answer, [
        why(
          -answer,
          "The sign is flipped, as with $\\mathbf{v} \\times \\mathbf{u}$: take the first spanning vector times the second.",
          "符号反了，就像用了 $\\mathbf{v} \\times \\mathbf{u}$：要用第一个张成向量乘第二个。",
        ),
        why(
          dot(u, point),
          "That dots the first spanning vector with the point; the normal is the cross product of the two spanning vectors.",
          "这是第一个张成向量与点的点积；法向量是两个张成向量的叉积。",
        ),
        why(
          dot(v, point),
          "That dots the second spanning vector with the point; the normal is the cross product of the two spanning vectors.",
          "这是第二个张成向量与点的点积；法向量是两个张成向量的叉积。",
        ),
      ]),
    });
  },
};

const vandermonde: KnowledgePointDef = {
  id: "the-determinant-of-a-vandermonde-matrix",
  title: t("The determinant of a Vandermonde matrix", "范德蒙德矩阵的行列式"),
  explanation: t(
    "A matrix with rows $(1, a, a^2)$, $(1, b, b^2)$ and $(1, c, c^2)$ has a determinant that factors completely. Subtracting the first row from the others clears the first column, and each new row then has a common factor, such as $b - a$. What remains gives $(b - a)(c - a)(c - b)$. It vanishes exactly when two of the numbers coincide. For $a = 1$, $b = 2$, $c = 4$: $(2 - 1)(4 - 1)(4 - 2) = 6$.\n\n> **Watch out.** Each factor is a later number minus an earlier one. Reversing one factor, say $a - b$ for $b - a$, flips the sign of the whole product.",
    "行为 $(1, a, a^2)$、$(1, b, b^2)$、$(1, c, c^2)$ 的矩阵，行列式可以完全分解。从其他行减去第一行，就清除了第一列，每个新行都有公因子，例如 $b - a$。剩下的部分给出 $(b - a)(c - a)(c - b)$。它为零，当且仅当有两个数相等。对 $a = 1$，$b = 2$，$c = 4$：$(2 - 1)(4 - 1)(4 - 2) = 6$。\n\n> **注意。** 每个因子都是后面的数减前面的数。把一个因子反过来，比如把 $b - a$ 写成 $a - b$，整个乘积就变号。",
  ),
  generate(rng) {
    const pool = [...Array(12).keys()].map((i) => i - 5);
    const a = rng.pick(pool);
    const b = rng.pick(pool.filter((v) => v !== a));
    const c = rng.pick(pool.filter((v) => v !== a && v !== b));
    const answer = (b - a) * (c - a) * (c - b);
    return numberProblem({
      prompt: t(
        `Find the determinant of $${mat([
          [1, a, a * a],
          [1, b, b * b],
          [1, c, c * c],
        ])}$.`,
        `求 $${mat([
          [1, a, a * a],
          [1, b, b * b],
          [1, c, c * c],
        ])}$ 的行列式。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          -answer,
          "The sign is flipped: one factor was taken as an earlier number minus a later one. Each factor is a later number minus an earlier one.",
          "符号反了：有一个因子写成了前面的数减后面的数。每个因子都应是后面的数减前面的数。",
        ),
        why(
          a * b * c,
          "That multiplies the numbers themselves; the determinant multiplies their differences.",
          "这是把这几个数本身相乘；行列式是它们的差相乘。",
        ),
        why(b - a + (c - a) + (c - b), "That adds the differences; the determinant is their product.", "这是把差相加；行列式是差的乘积。"),
        why(
          (b - a) * (c - a),
          "The factor $c - b$ is missing: there is one difference for each pair of the three numbers.",
          "漏了因子 $c - b$：三个数中每一对都有一个差。",
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Name $a$, $b$ and $c$", "认出 $a$、$b$、$c$"],
            t(
              `The second column holds $a = ${a}$, $b = ${b}$, $c = ${c}$ and the third their squares, so this is a Vandermonde matrix with determinant $(b - a)(c - a)(c - b)$.`,
              `第二列是 $a = ${a}$，$b = ${b}$，$c = ${c}$，第三列是它们的平方，所以这是范德蒙德矩阵，行列式为 $(b - a)(c - a)(c - b)$。`,
            ),
          ],
          [
            ["Multiply the differences", "差相乘"],
            t("", ""),
            [`${inParens(b - a)} \\cdot ${inParens(c - a)} \\cdot ${inParens(c - b)} = ${answer}`],
          ],
        ],
        t(
          `Subtracting row 1 from rows 2 and 3 leaves $\\begin{vmatrix} ${b - a} & ${b * b - a * a} \\\\ ${c - a} & ${c * c - a * a} \\end{vmatrix} = ${inParens(b - a)} \\cdot ${inParens(c * c - a * a)} - ${inParens(c - a)} \\cdot ${inParens(b * b - a * a)} = ${answer}$.`,
          `从第 2、3 行减去第 1 行，剩下 $\\begin{vmatrix} ${b - a} & ${b * b - a * a} \\\\ ${c - a} & ${c * c - a * a} \\end{vmatrix} = ${inParens(b - a)} \\cdot ${inParens(c * c - a * a)} - ${inParens(c - a)} \\cdot ${inParens(b * b - a * a)} = ${answer}$。`,
        ),
      ),
    });
  },
};

const powerOfElementary: KnowledgePointDef = {
  id: "a-power-of-an-elementary-matrix",
  title: t("A power of an elementary matrix", "初等矩阵的幂"),
  explanation: t(
    "Multiplying by the elementary matrix for $R_3 + kR_1 \\to R_3$ performs that row operation. Doing it $n$ times adds $k$ times the first row to the third row $n$ times, and the first row never changes. So the total effect is $R_3 + nkR_1 \\to R_3$. The entry grows by adding, not by multiplying, even though the matrix is being raised to a power. With $k = 2$, the $(3, 1)$ entry of $E^{5}$ is $5 \\cdot 2 = 10$.\n\n> **Watch out.** The entry is $nk$, not $k^{n}$: each factor adds another $k$ times the unchanged row $1$.",
    "乘以 $R_3 + kR_1 \\to R_3$ 的初等矩阵，就是执行这个行运算。做 $n$ 次，就是把第一行的 $k$ 倍加到第三行 $n$ 次，而第一行始终不变。所以总效果是 $R_3 + nkR_1 \\to R_3$。尽管矩阵在求幂，这个元素却是按加法增长，而不是按乘法。取 $k = 2$，$E^{5}$ 的 $(3, 1)$ 元素为 $5 \\cdot 2 = 10$。\n\n> **注意。** 该元素是 $nk$，而不是 $k^{n}$：每个因子都再加上一次不变的第 $1$ 行的 $k$ 倍。",
  ),
  generate(rng) {
    const k = nonzero(rng, 9);
    const n = rng.int(2, 9);
    const answer = n * k;
    return numberProblem({
      prompt: t(
        `Let $E = ${mat([
          [1, 0, 0],
          [0, 1, 0],
          [k, 0, 1],
        ])}$. Find the $(3, 1)$ entry of $E^{${n}}$.`,
        `设 $E = ${mat([
          [1, 0, 0],
          [0, 1, 0],
          [k, 0, 1],
        ])}$。求 $E^{${n}}$ 的 $(3, 1)$ 元素。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          k ** n,
          `That raises the multiplier to the power. Row 1 never changes, so each factor adds the same $${k}$ again.`,
          `这是把乘数求幂。第 1 行始终不变，所以每个因子都再加上同一个 $${k}$。`,
        ),
        why(
          k + n,
          `The ${n} factors count how many times $${k}$ is added, so multiply: $${n} \\cdot ${inParens(k)}$.`,
          `${n} 个因子表示 $${k}$ 被加了几次，所以要相乘：$${n} \\cdot ${inParens(k)}$。`,
        ),
        why(k, "That is the entry of $E$ itself, a single factor.", "这是 $E$ 本身的元素，只是一个因子。"),
        why(
          (n + 1) * k,
          `That counts one factor too many: $E^{${n}}$ has $${n}$ factors.`,
          `多算了一个因子：$E^{${n}}$ 有 $${n}$ 个因子。`,
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Read $E$ as a row operation", "把 $E$ 读作行运算"],
            t(
              `$E$ performs $${poly([1, "R_3"], [k, "R_1"])} \\to R_3$ and leaves row 1 as it is.`,
              `$E$ 执行 $${poly([1, "R_3"], [k, "R_1"])} \\to R_3$，第 1 行保持不变。`,
            ),
          ],
          [
            [`Repeat it ${n} times`, `重复 ${n} 次`],
            t(`Each factor adds another $${k}$ times the same row 1 to row 3:`, `每个因子都把同一个第 1 行的 $${k}$ 倍再加到第 3 行：`),
            [`${n} \\cdot ${inParens(k)} = ${answer}`],
          ],
        ],
        t(
          `For two factors, row 3 of $E$ times column 1 of $E$ is $${inParens(k)} \\cdot 1 + 0 \\cdot 0 + 1 \\cdot ${inParens(k)} = ${2 * k}$, so the entry of $E^{2}$ is $2 \\cdot ${inParens(k)}$, growing by $${k}$ per factor.`,
          `两个因子时，$E$ 的第 3 行乘 $E$ 的第 1 列为 $${inParens(k)} \\cdot 1 + 0 \\cdot 0 + 1 \\cdot ${inParens(k)} = ${2 * k}$，所以 $E^{2}$ 的该元素为 $2 \\cdot ${inParens(k)}$，每多一个因子增加 $${k}$。`,
        ),
      ),
    });
  },
};

const scalarForEntry: KnowledgePointDef = {
  id: "the-scalar-that-gives-a-combination-a-chosen-entry",
  title: t("The scalar that gives a combination a chosen entry", "使组合取得指定分量的标量"),
  explanation: t(
    "Vector operations in $\\mathbb{R}^n$ act on each entry separately, so a single entry of $\\mathbf{u} + c\\mathbf{v}$ depends on $c$ through one ordinary linear equation. Solving it fixes $c$, and that decides all the other entries too. Entries of $\\mathbf{v}$ that are zero would make the corresponding entry independent of $c$, which is why a nonzero entry must be used. For example, with $\\mathbf{u} = (1, 3, 0, 2)$ and $\\mathbf{v} = (2, -1, 4, 1)$, entry 2 of $\\mathbf{u} + c\\mathbf{v}$ is $3 - c$, and setting it to $5$ gives $c = -2$.\n\n> **Watch out.** Subtract the entry of $\\mathbf{u}$ before dividing by the entry of $\\mathbf{v}$.",
    "$\\mathbb{R}^n$ 中的向量运算分别作用于每个分量，所以 $\\mathbf{u} + c\\mathbf{v}$ 的一个分量通过一个普通的线性方程依赖于 $c$。解这个方程就确定了 $c$，也决定了其他所有分量。如果 $\\mathbf{v}$ 的某个分量为零，相应分量就与 $c$ 无关，所以必须用非零分量。例如 $\\mathbf{u} = (1, 3, 0, 2)$，$\\mathbf{v} = (2, -1, 4, 1)$ 时，$\\mathbf{u} + c\\mathbf{v}$ 的第 2 个分量为 $3 - c$，令它等于 $5$ 得 $c = -2$。\n\n> **注意。** 先减去 $\\mathbf{u}$ 的分量，再除以 $\\mathbf{v}$ 的分量。",
  ),
  generate(rng) {
    const u = [rng.int(-9, 9), rng.int(-9, 9), rng.int(-9, 9), rng.int(-9, 9)];
    const v = [nonzero(rng, 6), nonzero(rng, 6), nonzero(rng, 6), nonzero(rng, 6)];
    const c = nonzero(rng, 6);
    const position = rng.int(1, 4);
    const uEntry = u[position - 1] ?? 0;
    const vEntry = v[position - 1] ?? 1;
    const target = uEntry + c * vEntry;
    const asQ = (x: number | Q) => (typeof x === "number" ? Q.of(x) : x);
    return numberProblem({
      prompt: t(
        `Let $\\mathbf{u} = ${col(...u)}$ and $\\mathbf{v} = ${col(...v)}$ in $\\mathbb{R}^4$. Find $c$ so that entry ${position} of $\\mathbf{u} + c\\mathbf{v}$ equals $${target}$.`,
        `设 $\\mathbb{R}^4$ 中的 $\\mathbf{u} = ${col(...u)}$，$\\mathbf{v} = ${col(...v)}$。求 $c$，使 $\\mathbf{u} + c\\mathbf{v}$ 的第 ${position} 个分量等于 $${target}$。`,
      ),
      answer: c,
      mistakes: [
        why(
          -c,
          "The sign is flipped; recheck the division by the entry of $\\mathbf{v}$.",
          "符号反了；请重新检查除以 $\\mathbf{v}$ 的分量那一步。",
        ),
        why(
          Q.of(target, vEntry),
          "The entry of $\\mathbf{u}$ was left out; subtract it before dividing.",
          "漏掉了 $\\mathbf{u}$ 的分量；先减去它再除。",
        ),
        why(
          Q.of(target + uEntry, vEntry),
          "The entry of $\\mathbf{u}$ was added instead of subtracted when it moved across.",
          "$\\mathbf{u}$ 的分量移项时应减去，这里却加上了。",
        ),
      ].filter((w, i, all) => !asQ(w.value).eq(Q.of(c)) && all.findIndex((o) => asQ(o.value).eq(asQ(w.value))) === i),
      solution: walked(
        [
          [
            [`Write entry ${position}`, `写出第 ${position} 个分量`],
            t(
              `Entry ${position} of $\\mathbf{u} + c\\mathbf{v}$ is $${uEntry} + ${inParens(vEntry)}c$:`,
              `$\\mathbf{u} + c\\mathbf{v}$ 的第 ${position} 个分量为 $${uEntry} + ${inParens(vEntry)}c$：`,
            ),
            [`${poly([uEntry, ""], [vEntry, "c"])} = ${target}`],
          ],
          [
            ["Solve for $c$", "解出 $c$"],
            t("", ""),
            [`${poly([vEntry, "c"])} = ${target} - ${inParens(uEntry)} = ${target - uEntry}`, `c = ${c}`],
          ],
        ],
        t(
          `$${uEntry} + ${inParens(vEntry)} \\cdot ${inParens(c)} = ${target}$, as required.`,
          `$${uEntry} + ${inParens(vEntry)} \\cdot ${inParens(c)} = ${target}$，符合要求。`,
        ),
      ),
    });
  },
};

const entryInNullSpace: KnowledgePointDef = {
  id: "the-entry-that-puts-a-vector-in-a-null-space",
  title: t("The entry that puts a vector in a null space", "使向量属于零空间的分量"),
  explanation: t(
    "A vector lies in the null space of a matrix exactly when its dot product with every row is zero. So membership gives one equation for each row. If one entry of the vector is unknown, an equation containing it can be solved for that entry. The other rows must then also hold, and the choice of the vector here makes them hold. For example, for rows $(1, 2, 1)$ and $(0, 1, -1)$ and the vector $(k, 1, 1)$, row 2 gives $1 - 1 = 0$ and row 1 gives $k + 2 + 1 = 0$, so $k = -3$.\n\n> **Watch out.** Moving the known terms across the equals sign changes their sign: $k$ is minus their sum, not the sum itself.",
    "向量属于矩阵的零空间，当且仅当它与每一行的点积都为零。所以属于关系为每一行给出一个方程。如果向量有一个未知分量，就可以从含它的方程中解出这个分量。其他行也必须成立，这里向量的选取保证了这一点。例如行为 $(1, 2, 1)$ 与 $(0, 1, -1)$、向量为 $(k, 1, 1)$ 时，第 2 行给出 $1 - 1 = 0$，第 1 行给出 $k + 2 + 1 = 0$，所以 $k = -3$。\n\n> **注意。** 已知项移到等号另一边要变号：$k$ 是它们之和的相反数，而不是和本身。",
  ),
  generate(rng) {
    const a = nonzero(rng, 4);
    const b = nonzero(rng, 4);
    const c = nonzero(rng, 4);
    const z = nonzero(rng, 4);
    const y = -c * z;
    const answer = -(a * y + b * z);
    return numberProblem({
      prompt: t(
        `Let $A = ${mat([
          [1, a, b],
          [0, 1, c],
        ])}$. Find $k$ so that $${col("k", y, z)}$ lies in the null space of $A$.`,
        `设 $A = ${mat([
          [1, a, b],
          [0, 1, c],
        ])}$。求 $k$，使 $${col("k", y, z)}$ 属于 $A$ 的零空间。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          -answer,
          "The sign is flipped: the known terms change sign when they move across the equals sign.",
          "符号反了：已知项移到等号另一边要变号。",
        ),
        why(
          -(a * y),
          `The term $${inParens(b)} \\cdot ${inParens(z)}$ from the third entry was left out.`,
          `漏掉了来自第三个分量的项 $${inParens(b)} \\cdot ${inParens(z)}$。`,
        ),
        why(
          -(b * z),
          `The term $${inParens(a)} \\cdot ${inParens(y)}$ from the second entry was left out.`,
          `漏掉了来自第二个分量的项 $${inParens(a)} \\cdot ${inParens(y)}$。`,
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Row 1 times the vector", "第 1 行乘向量"],
            t("The product with row 1 must be zero:", "与第 1 行的乘积必须为零："),
            [`k + ${inParens(a)} \\cdot ${inParens(y)} + ${inParens(b)} \\cdot ${inParens(z)} = 0`, `k + ${inParens(a * y + b * z)} = 0`],
          ],
          [["Solve for $k$", "解出 $k$"], t("", ""), [`k = ${answer}`]],
        ],
        t(
          `Row 2 also gives zero, since $${inParens(y)} + ${inParens(c)} \\cdot ${inParens(z)} = 0$, so the vector is in the null space.`,
          `第 2 行也给出零，因为 $${inParens(y)} + ${inParens(c)} \\cdot ${inParens(z)} = 0$，所以该向量属于零空间。`,
        ),
      ),
    });
  },
};

const nullityOfTranspose: KnowledgePointDef = {
  id: "the-nullity-of-a-transpose",
  title: t("The nullity of a transpose", "转置矩阵的零化度"),
  explanation: t(
    "A matrix and its transpose have the same rank, because row rank equals column rank. Their nullities generally differ, since the transpose has as many columns as the original has rows. Rank-nullity applied to the transpose of an $m \\times n$ matrix of rank $r$ gives $m - r$, while the matrix itself has nullity $n - r$. The two agree only for square matrices. For example, a $5 \\times 3$ matrix of rank $2$ has nullity $3 - 2 = 1$, while its $3 \\times 5$ transpose has nullity $5 - 2 = 3$.\n\n> **Watch out.** Subtract the rank from the number of columns of $A^T$, which is the number of rows of $A$.",
    "矩阵和它的转置有相同的秩，因为行秩等于列秩。它们的零化度一般不同，因为转置的列数等于原矩阵的行数。对秩为 $r$ 的 $m \\times n$ 矩阵的转置用秩-零化度定理，得 $m - r$，而矩阵本身的零化度是 $n - r$。只有方阵的两者才相等。例如秩为 $2$ 的 $5 \\times 3$ 矩阵的零化度是 $3 - 2 = 1$，而它的 $3 \\times 5$ 转置的零化度是 $5 - 2 = 3$。\n\n> **注意。** 要用 $A^T$ 的列数减去秩，而 $A^T$ 的列数就是 $A$ 的行数。",
  ),
  generate(rng) {
    const m = rng.int(3, 12);
    const n = rng.int(3, 12);
    const r = rng.int(1, Math.min(m, n));
    const answer = m - r;
    return numberProblem({
      prompt: t(
        `A matrix $A$ has ${m} rows, ${n} columns and rank ${r}. Find the nullity of $A^T$.`,
        `矩阵 $A$ 有 ${m} 行、${n} 列，秩是 ${r}。求 $A^T$ 的零化度。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          n - r,
          "That is the nullity of $A$ itself; $A^T$ has as many columns as $A$ has rows.",
          "这是 $A$ 本身的零化度；$A^T$ 的列数等于 $A$ 的行数。",
        ),
        why(
          r,
          "That is the rank, which $A$ and $A^T$ share; the nullity is what the rank leaves of the columns.",
          "这是秩，$A$ 与 $A^T$ 的秩相同；零化度是列数减去秩后剩下的部分。",
        ),
        why(
          m + n - r,
          "Rank-nullity uses only the number of columns of $A^T$, not rows plus columns.",
          "秩-零化度定理只用 $A^T$ 的列数，而不是行数加列数。",
        ),
        why(m, "That is the number of columns of $A^T$; subtract the rank from it.", "这是 $A^T$ 的列数；还要减去秩。"),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Find the shape and rank of $A^T$", "求 $A^T$ 的尺寸和秩"],
            t(
              `$A^T$ is ${n} by ${m}, so it has ${m} columns, and its rank equals that of $A$, namely ${r}.`,
              `$A^T$ 是 ${n} 行 ${m} 列，所以有 ${m} 列；它的秩与 $A$ 相同，为 ${r}。`,
            ),
          ],
          [["Apply rank-nullity to $A^T$", "对 $A^T$ 用秩-零化度定理"], t("", ""), [`\\operatorname{null}(A^T) = ${m} - ${r} = ${answer}`]],
        ],
        t(
          `Rank plus nullity of $A^T$ is $${r} + ${answer} = ${m}$, its number of columns.`,
          `$A^T$ 的秩加零化度为 $${r} + ${answer} = ${m}$，正是它的列数。`,
        ),
      ),
    });
  },
};

const smallestNullity: KnowledgePointDef = {
  id: "the-smallest-possible-nullity-of-a-matrix",
  title: t("The smallest possible nullity of a matrix", "矩阵零化度的最小可能值"),
  explanation: t(
    "The rank of a matrix cannot exceed its number of rows or its number of columns. Rank-nullity then bounds the nullity from below: it is at least the number of columns minus the largest possible rank. So a matrix with more columns than rows always has a nontrivial null space, while with at least as many rows as columns the nullity can be zero. For example, a $3 \\times 7$ matrix has rank at most $3$, so its nullity is at least $7 - 3 = 4$, while a $7 \\times 3$ matrix can have rank $3$ and nullity $0$.\n\n> **Watch out.** Nullity counts free columns, so subtract from the number of columns, and it is never negative: with more rows than columns the smallest nullity is $0$.",
    "矩阵的秩不能超过行数，也不能超过列数。于是秩-零化度定理给出零化度的下界：它至少是列数减去最大可能的秩。所以列数多于行数的矩阵总有非平凡的零空间，而行数不少于列数时，零化度可以为零。例如 $3 \\times 7$ 矩阵的秩至多为 $3$，所以零化度至少为 $7 - 3 = 4$；而 $7 \\times 3$ 矩阵的秩可以是 $3$，零化度为 $0$。\n\n> **注意。** 零化度数的是自由列，所以要从列数中减，而且它不会是负数：行数多于列数时最小零化度是 $0$。",
  ),
  generate(rng) {
    const m = rng.int(2, 20);
    const n = rng.pick([...Array(19).keys()].map((i) => i + 2).filter((v) => v !== m));
    const answer = Math.max(n - m, 0);
    return numberProblem({
      prompt: t(
        `What is the smallest possible nullity of a matrix with ${m} rows and ${n} columns?`,
        `一个 ${m} 行 ${n} 列的矩阵，零化度最小可能是多少？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          Math.abs(n - m),
          "The nullity is the number of columns minus the rank, and the rank can reach the number of columns here, so nothing is forced.",
          "零化度是列数减去秩，而这里秩可以达到列数，所以没有被迫的自由列。",
        ),
        why(Math.min(m, n), "That is the largest possible rank, not the nullity it leaves.", "这是最大可能的秩，而不是它剩下的零化度。"),
        why(
          n,
          "That is the largest possible nullity, reached by the zero matrix; the question asks for the smallest.",
          "这是最大可能的零化度，由零矩阵达到；题目问的是最小值。",
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Bound the rank", "给秩定上界"],
            t(`The rank is at most the smaller of ${m} rows and ${n} columns:`, `秩不超过行数 ${m} 与列数 ${n} 中较小的一个：`),
            [`\\operatorname{rank} A \\le ${Math.min(m, n)}`],
          ],
          [
            ["Apply rank-nullity", "用秩-零化度定理"],
            t(
              `Nullity is ${n} minus the rank, so it is smallest when the rank is largest:`,
              `零化度等于 ${n} 减去秩，所以秩最大时零化度最小：`,
            ),
            [`\\operatorname{null} A \\ge ${n} - ${Math.min(m, n)} = ${answer}`],
          ],
        ],
        t(
          `A matrix whose top-left $${Math.min(m, n)} \\times ${Math.min(m, n)}$ block is the identity, with zeros elsewhere, has rank $${Math.min(m, n)}$ and nullity exactly $${answer}$.`,
          `左上角 $${Math.min(m, n)} \\times ${Math.min(m, n)}$ 块为单位矩阵、其余为零的矩阵，秩为 $${Math.min(m, n)}$，零化度恰为 $${answer}$。`,
        ),
      ),
    });
  },
};

const symmetrizationRank: KnowledgePointDef = {
  id: "the-rank-of-the-symmetrizing-map",
  title: t("The rank of the symmetrizing map", "对称化映射的秩"),
  explanation: t(
    "The map $T(A) = A + A^T$ on $n \\times n$ matrices sends everything to symmetric matrices, and its kernel is the set of matrices with $A^T = -A$, the skew-symmetric ones. Those have dimension $\\frac{n(n - 1)}{2}$. Rank-nullity then gives the rank as $n^2$ minus this number, which matches the dimension of the symmetric matrices, so the map is onto them. For example, for $n = 3$ the kernel has dimension $\\frac{3 \\cdot 2}{2} = 3$, so the rank is $9 - 3 = 6$.\n\n> **Watch out.** $\\frac{n(n - 1)}{2}$ is the dimension of the kernel; the rank is what is left of $n^2$.",
    "$n \\times n$ 矩阵上的映射 $T(A) = A + A^T$ 把一切都映到对称矩阵，它的核是满足 $A^T = -A$ 的矩阵，即反对称矩阵。它们的维数是 $\\frac{n(n - 1)}{2}$。于是秩-零化度定理给出秩等于 $n^2$ 减去这个数，这正是对称矩阵的维数，所以映射是到对称矩阵上的满射。例如 $n = 3$ 时核的维数为 $\\frac{3 \\cdot 2}{2} = 3$，所以秩为 $9 - 3 = 6$。\n\n> **注意。** $\\frac{n(n - 1)}{2}$ 是核的维数；秩是 $n^2$ 减去它剩下的部分。",
  ),
  generate(rng) {
    const n = rng.int(2, 30);
    const kernel = binomial2(n);
    const answer = n * n - kernel;
    return numberProblem({
      prompt: t(
        `Let $T: M_{${n} \\times ${n}} \\to M_{${n} \\times ${n}}$ be $T(A) = A + A^T$. Find the rank of $T$.`,
        `设 $T: M_{${n} \\times ${n}} \\to M_{${n} \\times ${n}}$ 为 $T(A) = A + A^T$。求 $T$ 的秩。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          kernel,
          "That is the nullity, the dimension of the skew-symmetric matrices; the rank is what remains.",
          "这是零化度，即反对称矩阵的维数；秩是剩下的部分。",
        ),
        why(
          n * n,
          "The skew-symmetric matrices are sent to $0$, so the rank is less than $n^2$.",
          "反对称矩阵被映为 $0$，所以秩小于 $n^2$。",
        ),
        why(n, "The image is all symmetric matrices, not just the diagonal ones.", "像是全部对称矩阵，而不只是对角矩阵。"),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Find the kernel", "求核"],
            t("$A + A^T = 0$ exactly when $A$ is skew-symmetric:", "$A + A^T = 0$ 当且仅当 $A$ 反对称："),
            [`\\dim\\ker T = \\frac{${n}(${n} - 1)}{2} = ${kernel}`],
          ],
          [["Apply rank-nullity", "用秩-零化度定理"], t("", ""), [`\\operatorname{rank} T = ${n * n} - ${kernel} = ${answer}`]],
        ],
        t(
          `The symmetric $${n} \\times ${n}$ matrices have dimension $\\frac{${n}(${n} + 1)}{2} = ${answer}$, so $T$ is onto them.`,
          `$${n} \\times ${n}$ 对称矩阵的维数是 $\\frac{${n}(${n} + 1)}{2} = ${answer}$，所以 $T$ 是到它们上的满射。`,
        ),
      ),
    });
  },
};

const inverseMapValue: KnowledgePointDef = {
  id: "a-value-of-the-inverse-of-a-linear-map",
  title: t("A value of the inverse of a linear map", "线性映射逆映射的值"),
  explanation: t(
    "An invertible linear map has an inverse that is itself linear, and its standard matrix is the inverse of the original matrix. So $T^{-1}(\\mathbf{b})$ is the unique solution of $A\\mathbf{x} = \\mathbf{b}$. When the determinant is 1, the two by two inverse swaps the diagonal and negates the other entries, and the arithmetic stays in whole numbers. For example, $A = \\begin{pmatrix} 1 & 2 \\\\ 1 & 3 \\end{pmatrix}$ has $A^{-1} = \\begin{pmatrix} 3 & -2 \\\\ -1 & 1 \\end{pmatrix}$, so $T^{-1}(1, 1) = (3 - 2, -1 + 1) = (1, 0)$.\n\n> **Watch out.** Multiply by $A^{-1}$, not by $A$: $T^{-1}(\\mathbf{b})$ is the input that $T$ sends to $\\mathbf{b}$.",
    "可逆线性映射的逆本身也是线性的，它的标准矩阵就是原矩阵的逆。所以 $T^{-1}(\\mathbf{b})$ 是 $A\\mathbf{x} = \\mathbf{b}$ 的唯一解。当行列式为 1 时，二阶逆矩阵就是交换对角元、把其他元素取负，计算一直停留在整数范围内。例如 $A = \\begin{pmatrix} 1 & 2 \\\\ 1 & 3 \\end{pmatrix}$ 有 $A^{-1} = \\begin{pmatrix} 3 & -2 \\\\ -1 & 1 \\end{pmatrix}$，所以 $T^{-1}(1, 1) = (3 - 2, -1 + 1) = (1, 0)$。\n\n> **注意。** 要乘 $A^{-1}$ 而不是 $A$：$T^{-1}(\\mathbf{b})$ 是被 $T$ 映为 $\\mathbf{b}$ 的那个输入。",
  ),
  generate(rng) {
    const p = nonzero(rng, 4);
    const q = nonzero(rng, 4);
    const x = nonzero(rng, 6);
    const y = nonzero(rng, 6);
    const d = 1 + p * q;
    const answer = d * x - p * y;
    const inverse = mat([
      [d, -p],
      [-q, 1],
    ]);
    return numberProblem({
      prompt: t(
        `Let $T(\\mathbf{x}) = A\\mathbf{x}$ with $A = ${mat([
          [1, p],
          [q, d],
        ])}$. Find the first entry of $T^{-1}\\left(${col(x, y)}\\right)$.`,
        `设 $T(\\mathbf{x}) = A\\mathbf{x}$，$A = ${mat([
          [1, p],
          [q, d],
        ])}$。求 $T^{-1}\\left(${col(x, y)}\\right)$ 的第一个分量。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          x + p * y,
          "That is the first entry of $A\\mathbf{b}$; the inverse map uses $A^{-1}$.",
          "这是 $A\\mathbf{b}$ 的第一个分量；逆映射要用 $A^{-1}$。",
        ),
        why(
          y - q * x,
          "That is the second entry of $T^{-1}(\\mathbf{b})$, not the first.",
          "这是 $T^{-1}(\\mathbf{b})$ 的第二个分量，而不是第一个。",
        ),
        why(
          -answer,
          "The sign is flipped; only the entries off the diagonal of $A^{-1}$ change sign.",
          "符号反了；$A^{-1}$ 只有非对角元变号。",
        ),
        why(
          d * x + p * y,
          "The entry above the diagonal of $A^{-1}$ is $-p$; its sign was not changed.",
          "$A^{-1}$ 对角线上方的元是 $-p$；这里没有变号。",
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: t(
        `Since $\\det A = 1$, the inverse matrix is $${inverse}$. The first entry of the image is $${inParens(d)} \\cdot ${inParens(x)} + ${inParens(-p)} \\cdot ${inParens(y)} = ${answer}$.`,
        `由于 $\\det A = 1$，逆矩阵是 $${inverse}$。像的第一个分量是 $${inParens(d)} \\cdot ${inParens(x)} + ${inParens(-p)} \\cdot ${inParens(y)} = ${answer}$。`,
      ),
    });
  },
};

const determinantInNewBasis: KnowledgePointDef = {
  id: "the-determinant-does-not-depend-on-the-basis",
  title: t("The determinant does not depend on the basis", "行列式不依赖于基"),
  explanation: t(
    "Matrices of one operator relative to different bases are similar: $[T]_C = P^{-1}[T]_BP$. Taking determinants, the factors $\\det P^{-1}$ and $\\det P$ cancel, because the determinant of a product is the product of the determinants. So the determinant belongs to the operator and not to the basis, and the change of basis matrix need not be used at all. For example, if $[T]_B = \\begin{pmatrix} 2 & 1 \\\\ 3 & 4 \\end{pmatrix}$, then $\\det [T]_C = 8 - 3 = 5$ for every basis $C$.\n\n> **Watch out.** The determinant is $ad - bc$, with a minus sign; computing $P^{-1}$ is unnecessary work.",
    "同一算子在不同基下的矩阵是相似的：$[T]_C = P^{-1}[T]_BP$。取行列式后，因子 $\\det P^{-1}$ 和 $\\det P$ 相消，因为乘积的行列式等于行列式的乘积。所以行列式属于算子，而不属于基，根本用不着基变换矩阵。例如若 $[T]_B = \\begin{pmatrix} 2 & 1 \\\\ 3 & 4 \\end{pmatrix}$，则对任意基 $C$ 都有 $\\det [T]_C = 8 - 3 = 5$。\n\n> **注意。** 行列式是 $ad - bc$，中间是减号；计算 $P^{-1}$ 是多余的。",
  ),
  generate(rng) {
    const a = rng.int(-6, 6);
    const b = rng.int(-6, 6);
    const c = rng.int(-6, 6);
    const d = rng.int(-6, 6);
    const p = nonzero(rng, 4);
    const q = nonzero(rng, 4);
    const answer = a * d - b * c;
    return numberProblem({
      prompt: t(
        `An operator has $[T]_B = ${mat([
          [a, b],
          [c, d],
        ])}$, and $[T]_C = P^{-1}[T]_BP$ with $P = ${mat([
          [1, p],
          [q, 1 + p * q],
        ])}$. Find $\\det [T]_C$.`,
        `一个算子的 $[T]_B = ${mat([
          [a, b],
          [c, d],
        ])}$，且 $[T]_C = P^{-1}[T]_BP$，其中 $P = ${mat([
          [1, p],
          [q, 1 + p * q],
        ])}$。求 $\\det [T]_C$。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(a + d, "That is the trace; the question asks for the determinant.", "这是迹；题目问的是行列式。"),
        why(
          -answer,
          "The determinant keeps its sign: $\\det P^{-1}$ and $\\det P$ multiply to $1$.",
          "行列式的符号不变：$\\det P^{-1}$ 与 $\\det P$ 之积为 $1$。",
        ),
        why(a * d + b * c, "The determinant is $ad - bc$; the product $bc$ is subtracted.", "行列式是 $ad - bc$；乘积 $bc$ 要减去。"),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Take determinants", "取行列式"],
            t("The determinant of a product is the product of the determinants:", "乘积的行列式等于行列式之积："),
            [`\\det [T]_C = \\det P^{-1} \\cdot \\det [T]_B \\cdot \\det P = \\det [T]_B`],
          ],
          [
            ["Compute it", "计算"],
            t("", ""),
            [`\\det [T]_B = ${inParens(a)} \\cdot ${inParens(d)} - ${inParens(b)} \\cdot ${inParens(c)} = ${answer}`],
          ],
        ],
        t(
          `Here $\\det P = 1 + ${inParens(p * q)} - ${inParens(p)} \\cdot ${inParens(q)} = 1$, so $\\det P^{-1} = 1$ as well, and the factors indeed cancel.`,
          `这里 $\\det P = 1 + ${inParens(p * q)} - ${inParens(p)} \\cdot ${inParens(q)} = 1$，所以 $\\det P^{-1} = 1$，两个因子确实相消。`,
        ),
      ),
    });
  },
};

const evaluationKernel: KnowledgePointDef = {
  id: "the-kernel-of-evaluation-at-two-points",
  title: t("The kernel of evaluation at two points", "两点求值映射的核"),
  explanation: t(
    "The map $p \\mapsto (p(a), p(b))$, with $a \\ne b$, goes from $P_n$ to $\\mathbb{R}^2$. It is onto when $n \\ge 1$, because a line can be drawn with any values at two different points. So its rank is 2, and rank-nullity gives a kernel of dimension $n + 1 - 2$. The kernel is the set of multiples of $(x - a)(x - b)$. For example, $p \\mapsto (p(0), p(1))$ on $P_3$ has a kernel of dimension $4 - 2 = 2$, spanned by $x(x - 1)$ and $x^2(x - 1)$.\n\n> **Watch out.** $P_n$ has dimension $n + 1$, because the constant term counts.",
    "映射 $p \\mapsto (p(a), p(b))$（$a \\ne b$）从 $P_n$ 到 $\\mathbb{R}^2$。当 $n \\ge 1$ 时它是满射，因为可以画一条直线在两个不同的点上取任意值。所以它的秩是 2，秩-零化度定理给出核的维数 $n + 1 - 2$。核就是 $(x - a)(x - b)$ 的倍式的集合。例如 $P_3$ 上的 $p \\mapsto (p(0), p(1))$ 的核维数为 $4 - 2 = 2$，由 $x(x - 1)$ 和 $x^2(x - 1)$ 张成。\n\n> **注意。** $P_n$ 的维数是 $n + 1$，因为常数项也算在内。",
  ),
  generate(rng) {
    const n = rng.int(2, 30);
    const a = rng.int(-5, 5);
    const b = rng.pick([...Array(11).keys()].map((i) => i - 5).filter((v) => v !== a));
    const answer = n - 1;
    const factor = (r: number) => (r === 0 ? "x" : r < 0 ? `x + ${-r}` : `x - ${r}`);
    return numberProblem({
      prompt: t(
        `Let $T: P_{${n}} \\to \\mathbb{R}^2$ be $T(p) = (p(${a}), p(${b}))$. Find the dimension of the kernel of $T$.`,
        `设 $T: P_{${n}} \\to \\mathbb{R}^2$ 为 $T(p) = (p(${a}), p(${b}))$。求 $T$ 的核的维数。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          n,
          "The map is onto $\\mathbb{R}^2$, so its rank is $2$; subtract $2$, not $1$.",
          "该映射是到 $\\mathbb{R}^2$ 上的满射，秩为 $2$；要减去 $2$，而不是 $1$。",
        ),
        why(
          n + 1,
          "That is the whole domain; the two values $p(a)$ and $p(b)$ take away two dimensions.",
          "这是整个定义域；$p(a)$ 与 $p(b)$ 两个值去掉了两个维数。",
        ),
        why(n - 2, `$P_{${n}}$ has dimension $${n + 1}$, counting the constant term.`, `算上常数项，$P_{${n}}$ 的维数是 $${n + 1}$。`),
        why(
          2,
          "That is the rank, the dimension of the image $\\mathbb{R}^2$, not of the kernel.",
          "这是秩，即像 $\\mathbb{R}^2$ 的维数，而不是核的维数。",
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [["Find the dimension of the domain", "求定义域的维数"], t("", ""), [`\\dim P_{${n}} = ${n + 1}`]],
          [
            ["Find the rank", "求秩"],
            t(
              "A polynomial of degree at most $1$ can take any two values at two different points, so $T$ is onto:",
              "次数不超过 $1$ 的多项式可在两个不同点上取任意两个值，所以 $T$ 是满射：",
            ),
            [`\\operatorname{rank} T = 2`],
          ],
          [["Apply rank-nullity", "用秩-零化度定理"], t("", ""), [`\\dim\\ker T = ${n + 1} - 2 = ${answer}`]],
        ],
        t(
          `The kernel is spanned by $(${factor(a)})(${factor(b)})x^j$ for $j = 0, \\dots, ${n - 2}$, which is $${answer}$ polynomials.`,
          `核由 $(${factor(a)})(${factor(b)})x^j$（$j = 0, \\dots, ${n - 2}$）张成，共 $${answer}$ 个多项式。`,
        ),
      ),
    });
  },
};

const characteristicConstant: KnowledgePointDef = {
  id: "the-constant-term-of-a-characteristic-polynomial",
  title: t("The constant term of a characteristic polynomial", "特征多项式的常数项"),
  explanation: t(
    "Setting $\\lambda = 0$ in $\\det(\\lambda I - A)$ leaves $\\det(-A)$, and this is the constant term of the characteristic polynomial. Pulling the sign out of each of the $n$ rows gives $(-1)^n\\det A$. So for a $3 \\times 3$ matrix, the constant term is $-\\det A$. There is no need to expand the whole polynomial to find it. For example, $A = \\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 2 & 0 \\\\ 0 & 0 & 3 \\end{pmatrix}$ has $\\det(\\lambda I - A) = (\\lambda - 1)(\\lambda - 2)(\\lambda - 3)$, whose constant term is $-6 = -\\det A$.\n\n> **Watch out.** For an odd size the sign flips: the constant term is $-\\det A$, not $\\det A$.",
    "在 $\\det(\\lambda I - A)$ 中令 $\\lambda = 0$，得到 $\\det(-A)$，这就是特征多项式的常数项。从 $n$ 行中各提出一个负号，得 $(-1)^n\\det A$。所以对 $3 \\times 3$ 矩阵，常数项是 $-\\det A$。不需要展开整个多项式就能求出它。例如 $A = \\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 2 & 0 \\\\ 0 & 0 & 3 \\end{pmatrix}$ 有 $\\det(\\lambda I - A) = (\\lambda - 1)(\\lambda - 2)(\\lambda - 3)$，常数项为 $-6 = -\\det A$。\n\n> **注意。** 阶数为奇数时符号改变：常数项是 $-\\det A$，而不是 $\\det A$。",
  ),
  generate(rng) {
    const grid: [[number, number, number], [number, number, number], [number, number, number]] = [
      [rng.int(-4, 4), rng.int(-4, 4), rng.int(-4, 4)],
      [rng.int(-4, 4), rng.int(-4, 4), rng.int(-4, 4)],
      [rng.int(-4, 4), rng.int(-4, 4), rng.int(-4, 4)],
    ];
    const det = det3(grid);
    const trace = grid[0][0] + grid[1][1] + grid[2][2];
    return numberProblem({
      prompt: t(
        `Find the constant term of $\\det(\\lambda I - A)$ for $A = ${mat(grid)}$.`,
        `对 $A = ${mat(grid)}$，求 $\\det(\\lambda I - A)$ 的常数项。`,
      ),
      answer: -det,
      form: "integer",
      mistakes: [
        why(
          det,
          "Pulling $-1$ out of each of the three rows gives $(-1)^3 = -1$, so the sign flips.",
          "从三行中各提出 $-1$ 得 $(-1)^3 = -1$，所以符号改变。",
        ),
        why(trace, "The trace belongs to the $\\lambda^2$ term, not the constant term.", "迹属于 $\\lambda^2$ 项，而不是常数项。"),
        why(
          -trace,
          "That is the coefficient of $\\lambda^2$; the constant term comes from $\\det A$.",
          "这是 $\\lambda^2$ 的系数；常数项来自 $\\det A$。",
        ),
      ].filter((w, i, all) => w.value !== -det && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [["Set $\\lambda = 0$", "令 $\\lambda = 0$"], t("", ""), [`\\det(0 \\cdot I - A) = \\det(-A) = (-1)^3 \\det A`]],
          [
            ["Expand $\\det A$ along the first row", "沿第一行展开 $\\det A$"],
            t("", ""),
            [
              `\\det A = ${inParens(grid[0][0])} \\cdot ${inParens(grid[1][1] * grid[2][2] - grid[1][2] * grid[2][1])} - ${inParens(grid[0][1])} \\cdot ${inParens(grid[1][0] * grid[2][2] - grid[1][2] * grid[2][0])} + ${inParens(grid[0][2])} \\cdot ${inParens(grid[1][0] * grid[2][1] - grid[1][1] * grid[2][0])} = ${det}`,
            ],
          ],
          [["Attach the sign", "加上符号"], t("", ""), [`-\\det A = ${-det}`]],
        ],
        t(
          `Expanding along the first column instead: $${inParens(grid[0][0])} \\cdot ${inParens(grid[1][1] * grid[2][2] - grid[1][2] * grid[2][1])} - ${inParens(grid[1][0])} \\cdot ${inParens(grid[0][1] * grid[2][2] - grid[0][2] * grid[2][1])} + ${inParens(grid[2][0])} \\cdot ${inParens(grid[0][1] * grid[1][2] - grid[0][2] * grid[1][1])} = ${det}$, the same determinant.`,
          `改沿第一列展开：$${inParens(grid[0][0])} \\cdot ${inParens(grid[1][1] * grid[2][2] - grid[1][2] * grid[2][1])} - ${inParens(grid[1][0])} \\cdot ${inParens(grid[0][1] * grid[2][2] - grid[0][2] * grid[2][1])} + ${inParens(grid[2][0])} \\cdot ${inParens(grid[0][1] * grid[1][2] - grid[0][2] * grid[1][1])} = ${det}$，行列式相同。`,
        ),
      ),
    });
  },
};

const inverseShiftEigenvalue: KnowledgePointDef = {
  id: "an-eigenvalue-of-a-shifted-inverse",
  title: t("An eigenvalue of a shifted inverse", "平移逆矩阵的特征值"),
  explanation: t(
    "If $A\\mathbf{v} = \\lambda\\mathbf{v}$ with $A$ invertible, then $A^{-1}\\mathbf{v} = \\frac{1}{\\lambda}\\mathbf{v}$, so the same eigenvector works for the inverse. Adding $cI$ just adds $c\\mathbf{v}$. So $A^{-1} + cI$ has eigenvalue $\\frac{1}{\\lambda} + c$. Order matters: inverting after the shift would give a different number, $\\frac{1}{\\lambda + c}$. For example, $\\lambda = 2$ and $c = 3$ give $A^{-1} + 3I$ the eigenvalue $\\frac{1}{2} + 3 = \\frac{7}{2}$.\n\n> **Watch out.** Invert first, then shift: the answer is $\\frac{1}{\\lambda} + c$, not $\\frac{1}{\\lambda + c}$ and not $\\lambda + c$.",
    "如果 $A\\mathbf{v} = \\lambda\\mathbf{v}$ 且 $A$ 可逆，那么 $A^{-1}\\mathbf{v} = \\frac{1}{\\lambda}\\mathbf{v}$，所以同一个特征向量对逆矩阵也适用。加上 $cI$ 只是加上 $c\\mathbf{v}$。所以 $A^{-1} + cI$ 有特征值 $\\frac{1}{\\lambda} + c$。顺序很重要：平移后再求逆，会得到另一个数 $\\frac{1}{\\lambda + c}$。例如 $\\lambda = 2$，$c = 3$ 时 $A^{-1} + 3I$ 的特征值为 $\\frac{1}{2} + 3 = \\frac{7}{2}$。\n\n> **注意。** 先求逆再平移：答案是 $\\frac{1}{\\lambda} + c$，不是 $\\frac{1}{\\lambda + c}$，也不是 $\\lambda + c$。",
  ),
  generate(rng) {
    const lambda = nonzero(rng, 9);
    const c = nonzero(rng, 5);
    const answer = Q.of(1, lambda).add(Q.of(c));
    return numberProblem({
      prompt: t(
        `An invertible matrix $A$ has eigenvalue $${lambda}$. Find the corresponding eigenvalue of $A^{-1} ${shiftTerm(c)}$.`,
        `可逆矩阵 $A$ 有特征值 $${lambda}$。求 $A^{-1} ${shiftTerm(c)}$ 相应的特征值。`,
      ),
      answer,
      mistakes: (
        [
          [
            Q.of(lambda + c),
            "The inverse is missing: $A^{-1}$ has eigenvalue $\\frac{1}{\\lambda}$.",
            "漏了求逆：$A^{-1}$ 的特征值是 $\\frac{1}{\\lambda}$。",
          ],
          [Q.of(1, lambda).sub(Q.of(c)), "The shift has the wrong sign.", "平移的符号错了。"],
          [
            lambda + c === 0 ? Q.of(c, lambda) : Q.of(1, lambda + c),
            "That shifts first and then inverts; here the inverse comes first.",
            "这是先平移再求逆；这里应先求逆。",
          ],
          [
            Q.of(c, lambda),
            "That multiplies by the shift; $cI$ adds $c$ to the eigenvalue.",
            "这是乘以了平移量；$cI$ 是把 $c$ 加到特征值上。",
          ],
        ] as const
      )
        .filter(([v], i, all) => !v.eq(answer) && all.findIndex(([o]) => o.eq(v)) === i)
        .map(([v, en, zh]) => why(v, en, zh)),
      solution: walked(
        [
          [
            ["Invert", "求逆"],
            t(
              `$A\\mathbf{v} = ${lambda}\\mathbf{v}$ gives $A^{-1}\\mathbf{v} = ${frac(1, lambda)}\\mathbf{v}$ for the same eigenvector.`,
              `$A\\mathbf{v} = ${lambda}\\mathbf{v}$ 给出同一个特征向量上的 $A^{-1}\\mathbf{v} = ${frac(1, lambda)}\\mathbf{v}$。`,
            ),
          ],
          [
            ["Shift", "平移"],
            t(`The term $${shiftTerm(c)}$ adds $${c}$:`, `$${shiftTerm(c)}$ 这一项加上 $${c}$：`),
            [`${frac(1, lambda)} + ${inParens(c)} = ${answer.toLatex()}`],
          ],
        ],
        t(
          `$(A^{-1} ${shiftTerm(c)})\\mathbf{v} = ${frac(1, lambda)}\\mathbf{v} + ${inParens(c)}\\mathbf{v} = ${answer.toLatex()}\\mathbf{v}$.`,
          `$(A^{-1} ${shiftTerm(c)})\\mathbf{v} = ${frac(1, lambda)}\\mathbf{v} + ${inParens(c)}\\mathbf{v} = ${answer.toLatex()}\\mathbf{v}$。`,
        ),
      ),
    });
  },
};

const powerOfDiagonalized: KnowledgePointDef = {
  id: "an-entry-of-a-power-from-a-diagonalization",
  title: t("An entry of a power from a diagonalization", "由对角化求幂的元素"),
  explanation: t(
    "Writing $A = PDP^{-1}$ makes powers simple, because the inner factors cancel: $A^k = PD^kP^{-1}$. Only the diagonal entries of $D$ need raising to the power. The work that remains is two matrix products, and the $P$ here has a simple inverse. Multiplying $A$ by itself repeatedly would be far slower when $k$ is large. For example, $P = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$ and $D = \\operatorname{diag}(1, 2)$ give $A^3$ the $(1, 2)$ entry $1 \\cdot (2^3 - 1^3) = 7$.\n\n> **Watch out.** Raise the eigenvalues to the power before subtracting: the entry uses $q^k - p^k$, not $(q - p)^k$, and $P^{-1}$ has $-a$ where $P$ has $a$.",
    "写成 $A = PDP^{-1}$ 后，求幂就很简单，因为中间的因子相消：$A^k = PD^kP^{-1}$。只需要对 $D$ 的对角元求幂。剩下的工作是两次矩阵乘法，而这里的 $P$ 的逆很简单。当 $k$ 很大时，反复用 $A$ 自乘要慢得多。例如 $P = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$，$D = \\operatorname{diag}(1, 2)$ 时，$A^3$ 的 $(1, 2)$ 元为 $1 \\cdot (2^3 - 1^3) = 7$。\n\n> **注意。** 先把特征值取幂再相减：这个元用的是 $q^k - p^k$，而不是 $(q - p)^k$；$P$ 中的 $a$ 在 $P^{-1}$ 中变为 $-a$。",
  ),
  generate(rng) {
    const a = nonzero(rng, 5);
    const pool = [-3, -2, -1, 1, 2, 3];
    const p = rng.pick(pool);
    const q = rng.pick(pool.filter((v) => v !== p));
    const k = rng.int(3, 5);
    const pk = p ** k;
    const qk = q ** k;
    const answer = a * (qk - pk);
    const factor = a === 1 ? "" : a === -1 ? "-" : `${a}`;
    return numberProblem({
      prompt: t(
        `Let $A = PDP^{-1}$ with $P = ${mat([
          [1, a],
          [0, 1],
        ])}$ and $D = ${mat([
          [p, 0],
          [0, q],
        ])}$. Find the $(1, 2)$ entry of $A^{${k}}$.`,
        `设 $A = PDP^{-1}$，其中 $P = ${mat([
          [1, a],
          [0, 1],
        ])}$，$D = ${mat([
          [p, 0],
          [0, q],
        ])}$。求 $A^{${k}}$ 的 $(1, 2)$ 元素。`,
      ),
      answer,
      form: "integer",
      wrong: [-answer, a * (q - p), qk - pk, a * (qk + pk), answer + a],
      solution: t(
        `Here $D^{${k}}$ has diagonal $${pk}$, $${qk}$, and $P^{-1} = ${mat([
          [1, -a],
          [0, 1],
        ])}$. Multiplying out, the entry is $${factor}\\left(${qk} - ${inParens(pk)}\\right) = ${answer}$.`,
        `这里 $D^{${k}}$ 的对角元是 $${pk}$、$${qk}$，$P^{-1} = ${mat([
          [1, -a],
          [0, 1],
        ])}$。乘开后，这个元素是 $${factor}\\left(${qk} - ${inParens(pk)}\\right) = ${answer}$。`,
      ),
    });
  },
};

const hermitianDeterminant: KnowledgePointDef = {
  id: "the-determinant-of-a-hermitian-matrix",
  title: t("The determinant of a Hermitian matrix", "埃尔米特矩阵的行列式"),
  explanation: t(
    "A Hermitian matrix equals its own conjugate transpose, so its diagonal is real and the entries across the diagonal are conjugates. The two by two determinant then subtracts a complex number times its conjugate, which is the real number $|z|^2$. So the determinant comes out real, in agreement with the fact that a Hermitian matrix has real eigenvalues. For example, $\\begin{pmatrix} 4 & 1 + 2i \\\\ 1 - 2i & 3 \\end{pmatrix}$ has determinant $12 - (1 + 4) = 7$.\n\n> **Watch out.** $(x + yi)(x - yi) = x^2 + y^2$, with a plus sign, and it is subtracted from the product of the diagonal entries.",
    "埃尔米特矩阵等于自身的共轭转置，所以对角元是实数，关于对角线对称的元素互为共轭。于是二阶行列式减去的是一个复数乘以它的共轭，也就是实数 $|z|^2$。所以行列式是实数，这与埃尔米特矩阵的特征值都是实数这一事实相符。例如 $\\begin{pmatrix} 4 & 1 + 2i \\\\ 1 - 2i & 3 \\end{pmatrix}$ 的行列式为 $12 - (1 + 4) = 7$。\n\n> **注意。** $(x + yi)(x - yi) = x^2 + y^2$，中间是加号，而且要从对角元之积中减去它。",
  ),
  generate(rng) {
    const a = nonzero(rng, 9);
    const d = nonzero(rng, 9);
    const re = rng.int(1, 6);
    const im = rng.int(1, 6);
    const tail = withCoefficient(im, "i");
    const answer = a * d - re * re - im * im;
    return numberProblem({
      prompt: t(
        `Find the determinant of the Hermitian matrix $${mat([
          [a, `${re} + ${tail}`],
          [`${re} - ${tail}`, d],
        ])}$.`,
        `求埃尔米特矩阵 $${mat([
          [a, `${re} + ${tail}`],
          [`${re} - ${tail}`, d],
        ])}$ 的行列式。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          a * d + re * re + im * im,
          "The product of the off-diagonal entries is subtracted, not added.",
          "非对角元之积要减去，而不是加上。",
        ),
        why(
          a * d - re * re + im * im,
          "The product of a number and its conjugate is $x^2 + y^2$; the $y^2$ term has a plus sign inside.",
          "一个数与其共轭之积是 $x^2 + y^2$；其中 $y^2$ 一项是加号。",
        ),
        why(a * d - (re + im) ** 2, "That squares $x + y$; the product is $x^2 + y^2$.", "这是把 $x + y$ 平方；乘积应是 $x^2 + y^2$。"),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [["Multiply the diagonal", "对角元相乘"], t("", ""), [`${inParens(a)} \\cdot ${inParens(d)} = ${a * d}`]],
          [
            ["Multiply the off-diagonal entries", "非对角元相乘"],
            t("They are conjugates, so the product is real:", "它们互为共轭，所以乘积是实数："),
            [`(${re} + ${tail})(${re} - ${tail}) = ${re}^2 + ${im}^2 = ${re * re + im * im}`],
          ],
          [["Subtract", "相减"], t("", ""), [`${a * d} - ${re * re + im * im} = ${answer}`]],
        ],
        t(
          `The determinant is real, as it must be for a Hermitian matrix, whose eigenvalues are real and multiply to $${answer}$.`,
          `行列式是实数，这正符合埃尔米特矩阵的性质：它的特征值都是实数，乘积为 $${answer}$。`,
        ),
      ),
    });
  },
};

const blockDeterminant: KnowledgePointDef = {
  id: "the-determinant-from-a-real-and-a-complex-pair-of-eigenvalues",
  figure: linearAlgebraDrawings2["block-diagonalization-of-nxn-matrices#the-determinant-from-a-real-and-a-complex-pair-of-eigenvalues"],
  title: t("The determinant from a real eigenvalue and a complex pair", "由实特征值与共轭复特征值求行列式"),
  explanation: t(
    "A real $3 \\times 3$ matrix with a real eigenvalue and a complex pair is similar to a block diagonal matrix, with a $1 \\times 1$ block and a rotation-scaling block. The determinant of a block diagonal matrix is the product of the block determinants, and the rotation-scaling block has determinant $a^2 + b^2$. This is the same as multiplying all three eigenvalues. For example, eigenvalues $2$ and $1 \\pm 3i$ give $\\det A = 2 \\cdot (1 + 9) = 20$.\n\n> **Watch out.** The pair multiplies to $a^2 + b^2$, with a plus sign, which is never negative. Adding the eigenvalues gives the trace, not the determinant.",
    "具有一个实特征值和一对复特征值的实 $3 \\times 3$ 矩阵，相似于一个分块对角矩阵，含一个 $1 \\times 1$ 块和一个旋转缩放块。分块对角矩阵的行列式是各块行列式之积，旋转缩放块的行列式是 $a^2 + b^2$。这与三个特征值相乘是一样的。例如特征值 $2$ 和 $1 \\pm 3i$ 给出 $\\det A = 2 \\cdot (1 + 9) = 20$。\n\n> **注意。** 这对复特征值之积是 $a^2 + b^2$，中间是加号，永远不为负。把特征值相加得到的是迹，不是行列式。",
  ),
  generate(rng) {
    const r = nonzero(rng, 6);
    const a = nonzero(rng, 6);
    const b = rng.int(1, 6);
    const answer = r * (a * a + b * b);
    return numberProblem({
      prompt: t(
        `A real $3 \\times 3$ matrix has eigenvalues $${r}$ and $${a} \\pm ${withCoefficient(b, "i")}$. Find its determinant.`,
        `一个实 $3 \\times 3$ 矩阵的特征值是 $${r}$ 和 $${a} \\pm ${withCoefficient(b, "i")}$。求它的行列式。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(r * (a * a - b * b), "The pair multiplies to $a^2 + b^2$, with a plus sign.", "这对复特征值之积是 $a^2 + b^2$，中间是加号。"),
        why(r + 2 * a, "That adds the eigenvalues, which gives the trace.", "这是把特征值相加，得到的是迹。"),
        why(r * a * b, "The pair multiplies to $a^2 + b^2$, not $ab$.", "这对复特征值之积是 $a^2 + b^2$，不是 $ab$。"),
        why(
          -answer,
          "Check the sign: $a^2 + b^2$ is positive, so the sign comes from the real eigenvalue alone.",
          "检查符号：$a^2 + b^2$ 为正，所以符号只由实特征值决定。",
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Multiply the pair", "复特征值对相乘"],
            t("", ""),
            [`(${a} + ${withCoefficient(b, "i")})(${a} - ${withCoefficient(b, "i")}) = ${inParens(a)}^2 + ${b}^2 = ${a * a + b * b}`],
          ],
          [
            ["Multiply by the real eigenvalue", "乘以实特征值"],
            t("", ""),
            [`\\det A = ${inParens(r)} \\cdot ${a * a + b * b} = ${answer}`],
          ],
        ],
        t(
          `The block form $${mat([
            [r, 0, 0],
            [0, a, -b],
            [0, b, a],
          ])}$ has determinant $${inParens(r)} \\cdot (${a * a} + ${b * b}) = ${answer}$, the product of the block determinants.`,
          `分块形式 $${mat([
            [r, 0, 0],
            [0, a, -b],
            [0, b, a],
          ])}$ 的行列式为 $${inParens(r)} \\cdot (${a * a} + ${b * b}) = ${answer}$，即各块行列式之积。`,
        ),
      ),
    });
  },
};

const rankOfNilpotentPower: KnowledgePointDef = {
  id: "the-rank-of-a-power-of-a-jordan-block-minus-its-eigenvalue",
  title: t("The rank of a power of a shifted Jordan block", "平移若尔当块的幂的秩"),
  explanation: t(
    "For a single Jordan block, $N = J - \\lambda I$ has ones just above the diagonal and shifts the basis vectors down a chain. Each power pushes the line of ones one place further from the diagonal and removes one of them. So the rank of $N^k$ is $n - k$ until it reaches zero, and this is what the ranks of generalized eigenvectors measure. For example, for a block of size $5$, $N^2$ has its ones two places above the diagonal, in $3$ rows, so its rank is $3$.\n\n> **Watch out.** The rank of $N^k$ is $n - k$, while $k$ is its nullity. The eigenvalue plays no part once it is subtracted.",
    "对单个若尔当块，$N = J - \\lambda I$ 在对角线正上方有一串 1，并把基向量沿一条链移动。每求一次幂，这串 1 就离对角线更远一格，并少掉一个。所以 $N^k$ 的秩是 $n - k$，直到变成零，这正是广义特征向量的秩所度量的。例如对大小为 $5$ 的块，$N^2$ 的 1 位于对角线上方第二条线上，共 $3$ 行，所以秩为 $3$。\n\n> **注意。** $N^k$ 的秩是 $n - k$，而 $k$ 是它的零度。减去特征值之后，特征值就不再起作用。",
  ),
  generate(rng) {
    const n = rng.int(3, 12);
    const k = rng.int(2, n - 1);
    const lambda = nonzero(rng, 6);
    const answer = n - k;
    return numberProblem({
      prompt: t(
        `Let $J$ be a single Jordan block of size ${n} with eigenvalue $${lambda}$. Find the rank of $(J ${shiftTerm(-lambda)})^{${k}}$.`,
        `设 $J$ 是大小为 ${n}、特征值为 $${lambda}$ 的单个若尔当块。求 $(J ${shiftTerm(-lambda)})^{${k}}$ 的秩。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          k,
          `That is the nullity of the power: it sends the first ${k} basis vectors to zero.`,
          `这是该幂的零度：它把前 ${k} 个基向量变为零。`,
        ),
        why(
          n - k + 1,
          "Each power removes one more of the ones, so $N^k$ keeps $n - k$, not $n - k + 1$.",
          "每求一次幂就少一个 1，所以 $N^k$ 剩 $n - k$ 个，不是 $n - k + 1$ 个。",
        ),
        why(
          n,
          "After subtracting the eigenvalue the block is singular, so the rank is less than its size.",
          "减去特征值后块是奇异的，所以秩小于其大小。",
        ),
        why(n - k - 1, "That removes one too many; the power keeps $n - k$ ones.", "多减了一个；这个幂保留 $n - k$ 个 1。"),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Subtract the eigenvalue", "减去特征值"],
            t(
              `$N = J ${shiftTerm(-lambda)}$ has $${n - 1}$ ones just above the diagonal and zeros elsewhere.`,
              `$N = J ${shiftTerm(-lambda)}$ 在对角线正上方有 $${n - 1}$ 个 1，其余为零。`,
            ),
          ],
          [
            ["Raise to the power", "求幂"],
            t(
              `$N^{${k}}$ has its ones ${k} places above the diagonal, one in each of the first $${n} - ${k}$ rows:`,
              `$N^{${k}}$ 的 1 位于对角线上方第 ${k} 条线上，前 $${n} - ${k}$ 行各一个：`,
            ),
            [`\\operatorname{rank} N^{${k}} = ${n} - ${k} = ${answer}`],
          ],
        ],
        t(
          `$N^{${k}}$ sends the first ${k} basis vectors to zero, so its nullity is $${k}$, and $${answer} + ${k} = ${n}$.`,
          `$N^{${k}}$ 把前 ${k} 个基向量变为零，所以零度为 $${k}$，且 $${answer} + ${k} = ${n}$。`,
        ),
      ),
    });
  },
};

const powerOfTwoBlock: KnowledgePointDef = {
  id: "an-entry-of-a-power-of-a-2x2-jordan-block",
  title: t("An entry of a power of a 2×2 Jordan block", "二阶若尔当块的幂的元素"),
  explanation: t(
    "Write the block as $J = \\lambda I + N$, where $N$ has a single 1 above the diagonal and $N^2 = 0$. Since $\\lambda I$ commutes with $N$, the binomial theorem applies and stops after two terms: $J^k = \\lambda^kI + k\\lambda^{k - 1}N$. So the top right entry grows like $k\\lambda^{k - 1}$, which is the derivative of $\\lambda^k$. For example, with $\\lambda = 2$ and $k = 4$ the top right entry of $J^4$ is $4 \\cdot 2^3 = 32$.\n\n> **Watch out.** The diagonal entries are $\\lambda^k$, but the top right entry is not: it carries the factor $k$ and the lower power $\\lambda^{k - 1}$.",
    "把块写成 $J = \\lambda I + N$，其中 $N$ 在对角线上方有一个 1，且 $N^2 = 0$。由于 $\\lambda I$ 与 $N$ 可交换，二项式定理适用，并且两项后就停止：$J^k = \\lambda^kI + k\\lambda^{k - 1}N$。所以右上角元素按 $k\\lambda^{k - 1}$ 增长，这正是 $\\lambda^k$ 的导数。例如 $\\lambda = 2$、$k = 4$ 时，$J^4$ 右上角的元素是 $4 \\cdot 2^3 = 32$。\n\n> **注意。** 对角线元素是 $\\lambda^k$，右上角元素却不是：它带有因子 $k$，幂次降为 $\\lambda^{k - 1}$。",
  ),
  generate(rng) {
    const lambda = nonzero(rng, 5);
    const k = rng.int(3, 7);
    const answer = k * lambda ** (k - 1);
    return numberProblem({
      prompt: t(
        `Let $J = ${mat([
          [lambda, 1],
          [0, lambda],
        ])}$. Find the top right entry of $J^{${k}}$.`,
        `设 $J = ${mat([
          [lambda, 1],
          [0, lambda],
        ])}$。求 $J^{${k}}$ 右上角的元素。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(lambda ** k, "That is a diagonal entry of the power, $\\lambda^k$.", "这是幂的对角线元素 $\\lambda^k$。"),
        why(
          k * lambda ** k,
          "The power of $\\lambda$ drops by one: the entry is $k\\lambda^{k - 1}$.",
          "$\\lambda$ 的幂次要降一：这个元素是 $k\\lambda^{k - 1}$。",
        ),
        why(
          lambda ** (k - 1),
          "The binomial term $k\\lambda^{k - 1}N$ carries the factor $k$.",
          "二项式项 $k\\lambda^{k - 1}N$ 带有因子 $k$。",
        ),
        why(k, "The factor $\\lambda^{k - 1}$ is missing.", "漏掉了因子 $\\lambda^{k - 1}$。"),
        why(
          answer + lambda,
          "Expand $J^k$ with the binomial theorem rather than adding terms by guess.",
          "用二项式定理展开 $J^k$，不要凭猜测加项。",
        ),
        why(
          answer - 1,
          "The single 1 of $N$ multiplies the whole coefficient; nothing is subtracted.",
          "$N$ 中的那个 1 乘以整个系数，不需要减去什么。",
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Split the block", "拆分若尔当块"],
            t(
              `$J = ${inParens(lambda)}I + N$ with $N^2 = 0$, so the binomial theorem stops after two terms:`,
              `$J = ${inParens(lambda)}I + N$，且 $N^2 = 0$，所以二项式定理两项后就停止：`,
            ),
            [`J^{${k}} = ${inParens(lambda)}^{${k}}I + ${k} \\cdot ${inParens(lambda)}^{${k - 1}}N`],
          ],
          [
            ["Read the top right entry", "读出右上角元素"],
            t("Only $N$ has an entry in the top right corner:", "只有 $N$ 在右上角有元素："),
            [`${k} \\cdot ${inParens(lambda)}^{${k - 1}} = ${k} \\cdot ${lambda ** (k - 1)} = ${answer}`],
          ],
        ],
        t(
          `For $k = 2$ the rule gives $2\\lambda$, which matches $J^2 = ${mat([
            [lambda * lambda, 2 * lambda],
            [0, lambda * lambda],
          ])}$.`,
          `$k = 2$ 时规则给出 $2\\lambda$，与 $J^2 = ${mat([
            [lambda * lambda, 2 * lambda],
            [0, lambda * lambda],
          ])}$ 一致。`,
        ),
      ),
    });
  },
};

const powerOfThreeBlock: KnowledgePointDef = {
  id: "the-corner-entry-of-a-power-of-a-3x3-jordan-block",
  title: t("The corner entry of a power of a 3×3 Jordan block", "三阶若尔当块的幂的角元素"),
  explanation: t(
    "For a block of size three, $J = \\lambda I + N$ with $N^3 = 0$, so the binomial theorem gives three terms: $J^k = \\lambda^kI + k\\lambda^{k - 1}N + \\binom{k}{2}\\lambda^{k - 2}N^2$. Only $N^2$ reaches the top right corner. That corner entry is therefore $\\binom{k}{2}\\lambda^{k - 2}$, and it is half of the second derivative of $\\lambda^k$. For example, with $\\lambda = 2$ and $k = 5$ the corner entry of $J^5$ is $\\binom{5}{2} \\cdot 2^3 = 10 \\cdot 8 = 80$.\n\n> **Watch out.** The coefficient is $\\binom{k}{2} = \\frac{k(k - 1)}{2}$, not $k(k - 1)$; the entries just above the diagonal are $k\\lambda^{k - 1}$, not the corner.",
    "对大小为三的块，$J = \\lambda I + N$，$N^3 = 0$，所以二项式定理给出三项：$J^k = \\lambda^kI + k\\lambda^{k - 1}N + \\binom{k}{2}\\lambda^{k - 2}N^2$。只有 $N^2$ 能到达右上角。所以这个角元素是 $\\binom{k}{2}\\lambda^{k - 2}$，它是 $\\lambda^k$ 二阶导数的一半。例如 $\\lambda = 2$、$k = 5$ 时，$J^5$ 的角元素是 $\\binom{5}{2} \\cdot 2^3 = 10 \\cdot 8 = 80$。\n\n> **注意。** 系数是 $\\binom{k}{2} = \\frac{k(k - 1)}{2}$，不是 $k(k - 1)$；对角线正上方的元素是 $k\\lambda^{k - 1}$，不是角元素。",
  ),
  generate(rng) {
    const lambda = nonzero(rng, 4);
    const k = rng.int(4, 8);
    const choose = binomial2(k);
    const answer = choose * lambda ** (k - 2);
    return numberProblem({
      prompt: t(
        `Let $J = ${mat([
          [lambda, 1, 0],
          [0, lambda, 1],
          [0, 0, lambda],
        ])}$. Find the top right entry of $J^{${k}}$.`,
        `设 $J = ${mat([
          [lambda, 1, 0],
          [0, lambda, 1],
          [0, 0, lambda],
        ])}$。求 $J^{${k}}$ 右上角的元素。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(k * lambda ** (k - 1), "That is an entry just above the diagonal, from the $N$ term.", "这是对角线正上方的元素，来自 $N$ 项。"),
        why(
          k * (k - 1) * lambda ** (k - 2),
          "The coefficient is $\\binom{k}{2} = \\frac{k(k - 1)}{2}$; the halving is missing.",
          "系数是 $\\binom{k}{2} = \\frac{k(k - 1)}{2}$；漏掉了除以 2。",
        ),
        why(lambda ** (k - 2), "The $N^2$ term carries the coefficient $\\binom{k}{2}$.", "$N^2$ 项带有系数 $\\binom{k}{2}$。"),
        why(choose, "The factor $\\lambda^{k - 2}$ is missing.", "漏掉了因子 $\\lambda^{k - 2}$。"),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Split the block", "拆分若尔当块"],
            t(
              `$J = ${inParens(lambda)}I + N$ with $N^3 = 0$, and only $N^2$ has an entry in the top right corner, equal to $1$.`,
              `$J = ${inParens(lambda)}I + N$，且 $N^3 = 0$；只有 $N^2$ 在右上角有元素，等于 $1$。`,
            ),
          ],
          [
            ["Take the N squared term", "取 N 平方项"],
            t(
              "The binomial theorem gives that term the coefficient $\\binom{k}{2}\\lambda^{k - 2}$:",
              "二项式定理给这一项的系数是 $\\binom{k}{2}\\lambda^{k - 2}$：",
            ),
            [`\\binom{${k}}{2} \\cdot ${inParens(lambda)}^{${k - 2}} = ${choose} \\cdot ${lambda ** (k - 2)} = ${answer}`],
          ],
        ],
        t(
          `For $k = 2$ the rule gives $\\binom{2}{2}\\lambda^0 = 1$, and indeed the corner of $J^2$ is $1 \\cdot 1 = 1$.`,
          `$k = 2$ 时规则给出 $\\binom{2}{2}\\lambda^0 = 1$，而 $J^2$ 的角元素确实是 $1 \\cdot 1 = 1$。`,
        ),
      ),
    });
  },
};

const cosineFromDot: KnowledgePointDef = {
  id: "the-cosine-of-an-angle-from-norms-and-a-dot-product",
  figure: linearAlgebraDrawings2["dot-product-in-n-dimensional-euclidean-space#the-cosine-of-an-angle-from-norms-and-a-dot-product"],
  title: t("The cosine of an angle from norms and a dot product", "由范数和点积求夹角余弦"),
  explanation: t(
    "In $\\mathbb{R}^n$, the angle between two nonzero vectors is defined through the formula $\\mathbf{u} \\cdot \\mathbf{v} = \\|\\mathbf{u}\\|\\|\\mathbf{v}\\|\\cos\\theta$. The Cauchy-Schwarz inequality guarantees that the resulting cosine lies between $-1$ and $1$. So a dot product divided by the two norms gives the cosine, even in dimensions where no picture of the angle can be drawn. For example, $\\|\\mathbf{u}\\| = 4$, $\\|\\mathbf{v}\\| = 5$ and $\\mathbf{u} \\cdot \\mathbf{v} = -6$ give $\\cos\\theta = \\frac{-6}{20} = -\\frac{3}{10}$, an obtuse angle.\n\n> **Watch out.** Divide by the product of the norms, not their sum, and keep the sign of the dot product: a negative dot product means an obtuse angle.",
    "在 $\\mathbb{R}^n$ 中，两个非零向量的夹角由公式 $\\mathbf{u} \\cdot \\mathbf{v} = \\|\\mathbf{u}\\|\\|\\mathbf{v}\\|\\cos\\theta$ 定义。柯西-施瓦茨不等式保证得到的余弦在 $-1$ 和 $1$ 之间。所以点积除以两个范数就得到余弦，即使在无法画出夹角的高维空间也是如此。例如 $\\|\\mathbf{u}\\| = 4$，$\\|\\mathbf{v}\\| = 5$，$\\mathbf{u} \\cdot \\mathbf{v} = -6$ 给出 $\\cos\\theta = \\frac{-6}{20} = -\\frac{3}{10}$，是钝角。\n\n> **注意。** 要除以范数之积，而不是范数之和；还要保留点积的符号：点积为负说明夹角是钝角。",
  ),
  generate(rng) {
    const a = rng.int(2, 9);
    const b = rng.int(2, 9);
    const size = rng.int(1, a * b - 1);
    const c = rng.pick([size, -size]);
    const answer = Q.of(c, a * b);
    return numberProblem({
      prompt: t(
        `In $\\mathbb{R}^n$, $\\|\\mathbf{u}\\| = ${a}$, $\\|\\mathbf{v}\\| = ${b}$ and $\\mathbf{u} \\cdot \\mathbf{v} = ${c}$. Find the cosine of the angle between them.`,
        `在 $\\mathbb{R}^n$ 中，$\\|\\mathbf{u}\\| = ${a}$，$\\|\\mathbf{v}\\| = ${b}$，$\\mathbf{u} \\cdot \\mathbf{v} = ${c}$。求它们夹角的余弦。`,
      ),
      answer,
      mistakes: [
        why(answer.neg(), "The sign is flipped; the cosine has the sign of the dot product.", "符号反了；余弦与点积同号。"),
        why(Q.of(c, a + b), "That divides by the sum of the norms; divide by their product.", "这是除以范数之和；要除以范数之积。"),
        why(Q.of(c, a * a * b * b), "That divides by the product of the squared norms.", "这是除以范数平方之积。"),
        why(Q.of(a * b, c), "The fraction is upside down; the dot product goes on top.", "分数颠倒了；点积在分子上。"),
      ].filter((w, i, all) => all.findIndex((o) => String(o.value) === String(w.value)) === i),
      solution: walked(
        [
          [["Multiply the norms", "范数相乘"], t("", ""), [`\\|\\mathbf{u}\\|\\|\\mathbf{v}\\| = ${a} \\cdot ${b} = ${a * b}`]],
          [
            ["Divide the dot product", "用点积相除"],
            t("", ""),
            [
              `\\cos\\theta = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\|\\|\\mathbf{v}\\|} = \\frac{${c}}{${a * b}} = ${answer.toLatex()}`,
            ],
          ],
        ],
        t(
          `$|${c}| < ${a * b}$, so the cosine lies strictly between $-1$ and $1$, as Cauchy–Schwarz requires.`,
          `$|${c}| < ${a * b}$，所以余弦严格介于 $-1$ 与 $1$ 之间，符合柯西–施瓦茨不等式。`,
        ),
      ),
    });
  },
};

const unitVectorEntry: KnowledgePointDef = {
  id: "an-entry-of-a-unit-vector",
  figure: linearAlgebraDrawings2["norm-of-a-vector-in-n-dimensional-euclidean-space#an-entry-of-a-unit-vector"],
  title: t("An entry of a unit vector", "单位向量的分量"),
  explanation: t(
    "Dividing a nonzero vector by its norm gives a vector of length one in the same direction. Each entry is divided by the same number, so the ratios between entries do not change. These entries are the direction cosines of the vector, the cosines of its angles with the coordinate axes, and their squares always add to one. For example, $\\mathbf{v} = (2, -3, 6)$ has norm $\\sqrt{4 + 9 + 36} = 7$, so its unit vector is $\\left(\\frac{2}{7}, -\\frac{3}{7}, \\frac{6}{7}\\right)$.\n\n> **Watch out.** Divide by the norm itself, not by its square, and keep the sign of each entry: normalizing changes the length, never the direction.",
    "把非零向量除以它的范数，就得到同方向的单位长度向量。每个分量都除以同一个数，所以分量之间的比不变。这些分量是向量的方向余弦，即它与各坐标轴夹角的余弦，它们的平方和总是 1。例如 $\\mathbf{v} = (2, -3, 6)$ 的范数为 $\\sqrt{4 + 9 + 36} = 7$，所以它的单位向量是 $\\left(\\frac{2}{7}, -\\frac{3}{7}, \\frac{6}{7}\\right)$。\n\n> **注意。** 要除以范数本身，而不是范数的平方；还要保留每个分量的符号：单位化只改变长度，不改变方向。",
  ),
  generate(rng) {
    const [x, y, z, norm] = rng.pick([
      [1, 2, 2, 3],
      [2, 3, 6, 7],
      [1, 4, 8, 9],
      [4, 4, 7, 9],
      [2, 6, 9, 11],
      [6, 6, 7, 11],
      [3, 4, 12, 13],
      [2, 5, 14, 15],
    ]) as [number, number, number, number];
    const scale = rng.int(1, 4);
    const sign = rng.pick([1, -1]);
    const position = rng.int(1, 3);
    const entries = [sign * x * scale, y * scale, z * scale];
    const entry = entries[position - 1] ?? 1;
    const answer = Q.of(entry, norm * scale);
    return numberProblem({
      prompt: t(
        `Let $\\mathbf{v} = ${col(...entries)}$. Find entry ${position} of the unit vector in the direction of $\\mathbf{v}$.`,
        `设 $\\mathbf{v} = ${col(...entries)}$。求 $\\mathbf{v}$ 方向的单位向量的第 ${position} 个分量。`,
      ),
      answer,
      mistakes: [
        why(
          Q.of(entry),
          "That is the entry of $\\mathbf{v}$ itself; divide it by the norm.",
          "这是 $\\mathbf{v}$ 本身的分量；还要除以范数。",
        ),
        why(
          Q.of(entry, norm * norm * scale * scale),
          `That divides by $\\|\\mathbf{v}\\|^2 = ${norm * norm * scale * scale}$; divide by $\\|\\mathbf{v}\\| = ${norm * scale}$.`,
          `这是除以 $\\|\\mathbf{v}\\|^2 = ${norm * norm * scale * scale}$；要除以 $\\|\\mathbf{v}\\| = ${norm * scale}$。`,
        ),
        why(
          answer.neg(),
          "The sign is flipped; the unit vector points the same way as $\\mathbf{v}$.",
          "符号反了；单位向量与 $\\mathbf{v}$ 同向。",
        ),
        why(Q.of(norm * scale, entry), "The fraction is upside down; the entry goes on top.", "分数颠倒了；分量在分子上。"),
      ].filter((w, i, all) => all.findIndex((o) => String(o.value) === String(w.value)) === i),
      solution: walked(
        [
          [
            ["Find the norm", "求范数"],
            t("", ""),
            [
              `\\|\\mathbf{v}\\| = \\sqrt{${entries.map((e) => `(${e})^2`).join(" + ")}} = \\sqrt{${norm * norm * scale * scale}} = ${norm * scale}`,
            ],
          ],
          [
            ["Divide the entry", "分量相除"],
            t(`Entry ${position} of $\\mathbf{v}$ is $${entry}$:`, `$\\mathbf{v}$ 的第 ${position} 个分量是 $${entry}$：`),
            [`\\frac{${entry}}{${norm * scale}} = ${answer.toLatex()}`],
          ],
        ],
        t(
          `The unit vector is $\\frac{1}{${norm}}(${[sign * x, y, z].join(", ")})$, and $\\frac{${[x, y, z].map((e) => `${e * e}`).join(" + ")}}{${norm * norm}} = 1$.`,
          `单位向量是 $\\frac{1}{${norm}}(${[sign * x, y, z].join(", ")})$，且 $\\frac{${[x, y, z].map((e) => `${e * e}`).join(" + ")}}{${norm * norm}} = 1$。`,
        ),
      ),
    });
  },
};

const monomialNorm: KnowledgePointDef = {
  id: "the-norm-of-a-power-function",
  title: t("The norm of a power function", "幂函数的范数"),
  explanation: t(
    "With the inner product $\\langle f, g \\rangle = \\int_0^1 f(t)g(t)\\,dt$, the squared norm of $f$ is the integral of $f^2$. For $f(t) = ct^n$ this squares both factors, giving $c^2t^{2n}$, which integrates to $\\frac{c^2}{2n + 1}$. For example, $f(t) = 2t^3$ has $\\|f\\|^2 = \\int_0^1 4t^6\\,dt = \\frac{4}{7}$.\n\n> **Watch out.** The exponent doubles before integrating, which is why the denominator is $2n + 1$ and not $n + 1$. The coefficient is squared too.",
    "用内积 $\\langle f, g \\rangle = \\int_0^1 f(t)g(t)\\,dt$，$f$ 的范数平方是 $f^2$ 的积分。对 $f(t) = ct^n$，两个因子都要平方，得 $c^2t^{2n}$，积分后是 $\\frac{c^2}{2n + 1}$。例如 $f(t) = 2t^3$ 有 $\\|f\\|^2 = \\int_0^1 4t^6\\,dt = \\frac{4}{7}$。\n\n> **注意。** 指数在积分前先翻倍，所以分母是 $2n + 1$，而不是 $n + 1$。系数也要平方。",
  ),
  generate(rng) {
    const c = rng.int(2, 12);
    const n = rng.int(2, 12);
    const answer = Q.of(c * c, 2 * n + 1);
    return numberProblem({
      prompt: t(
        `With $\\langle f, g \\rangle = \\int_0^1 f(t)g(t)\\,dt$, find $\\|f\\|^2$ for $f(t) = ${c}t^{${n}}$.`,
        `用 $\\langle f, g \\rangle = \\int_0^1 f(t)g(t)\\,dt$，对 $f(t) = ${c}t^{${n}}$ 求 $\\|f\\|^2$。`,
      ),
      answer,
      mistakes: [
        why(
          Q.of(c * c, n + 1),
          `That integrates $t^{${n}}$; the square of $f$ contains $t^{${2 * n}}$.`,
          `这是对 $t^{${n}}$ 积分；$f$ 的平方含有 $t^{${2 * n}}$。`,
        ),
        why(Q.of(c, 2 * n + 1), `The coefficient must be squared too: $${c}^2 = ${c * c}$.`, `系数也要平方：$${c}^2 = ${c * c}$。`),
        why(
          Q.of(c * c, 2 * n),
          `Integrating $t^{${2 * n}}$ raises the exponent to $${2 * n + 1}$, so divide by $${2 * n + 1}$.`,
          `对 $t^{${2 * n}}$ 积分，指数升为 $${2 * n + 1}$，所以要除以 $${2 * n + 1}$。`,
        ),
        why(
          Q.of(c, n + 1),
          "That is $\\int_0^1 f(t)\\,dt$, not $\\langle f, f \\rangle$; square $f$ first.",
          "这是 $\\int_0^1 f(t)\\,dt$，不是 $\\langle f, f \\rangle$；要先把 $f$ 平方。",
        ),
      ].filter((w, i, all) => all.findIndex((o) => String(o.value) === String(w.value)) === i),
      solution: walked(
        [
          [["Square the function", "把函数平方"], t("", ""), [`f(t)^2 = (${c}t^{${n}})^2 = ${c * c}t^{${2 * n}}`]],
          [
            ["Integrate", "积分"],
            t("", ""),
            [
              `\\|f\\|^2 = \\int_0^1 ${c * c}t^{${2 * n}}\\,dt = ${c * c}\\left[\\frac{t^{${2 * n + 1}}}{${2 * n + 1}}\\right]_0^1 = ${answer.toLatex()}`,
            ],
          ],
        ],
        t(
          `On $[0, 1]$, $${c * c}t^{${2 * n}} \\le ${c * c}$, so $\\|f\\|^2$ must be below $${c * c}$, and $${answer.toLatex()}$ is.`,
          `在 $[0, 1]$ 上 $${c * c}t^{${2 * n}} \\le ${c * c}$，所以 $\\|f\\|^2$ 必须小于 $${c * c}$，而 $${answer.toLatex()}$ 确实如此。`,
        ),
      ),
    });
  },
};

const triangleBounds: KnowledgePointDef = {
  id: "the-range-of-a-norm-from-the-triangle-inequality",
  figure:
    linearAlgebraDrawings2[
      "pythagorean-theorem-and-triangle-inequality-in-inner-product-spaces#the-range-of-a-norm-from-the-triangle-inequality"
    ],
  title: t("The range of a norm from the triangle inequality", "由三角不等式求范数的范围"),
  explanation: t(
    "The triangle inequality gives an upper bound, $\\|\\mathbf{u} + \\mathbf{v}\\| \\le \\|\\mathbf{u}\\| + \\|\\mathbf{v}\\|$, reached when the vectors point the same way. Applying it again to $\\mathbf{u} = (\\mathbf{u} + \\mathbf{v}) - \\mathbf{v}$ gives the lower bound $\\big|\\|\\mathbf{u}\\| - \\|\\mathbf{v}\\|\\big|$, reached when they point opposite ways. Orthogonal vectors give a value strictly in between. For example, with $\\|\\mathbf{u}\\| = 3$ and $\\|\\mathbf{v}\\| = 7$, the norm $\\|\\mathbf{u} + \\mathbf{v}\\|$ can be anything from $4$ to $10$, and orthogonal vectors give $\\sqrt{58}$.\n\n> **Watch out.** The smallest value is the absolute difference $\\big|\\|\\mathbf{u}\\| - \\|\\mathbf{v}\\|\\big|$, not $0$ and not the smaller norm: the two vectors can cancel only as much as the shorter one allows.",
    "三角不等式给出上界 $\\|\\mathbf{u} + \\mathbf{v}\\| \\le \\|\\mathbf{u}\\| + \\|\\mathbf{v}\\|$，当两个向量同向时达到。对 $\\mathbf{u} = (\\mathbf{u} + \\mathbf{v}) - \\mathbf{v}$ 再用一次，得到下界 $\\big|\\|\\mathbf{u}\\| - \\|\\mathbf{v}\\|\\big|$，当它们反向时达到。正交向量给出的值严格介于两者之间。例如 $\\|\\mathbf{u}\\| = 3$，$\\|\\mathbf{v}\\| = 7$ 时，$\\|\\mathbf{u} + \\mathbf{v}\\|$ 可以取 $4$ 到 $10$ 之间的任何值，正交时为 $\\sqrt{58}$。\n\n> **注意。** 最小值是差的绝对值 $\\big|\\|\\mathbf{u}\\| - \\|\\mathbf{v}\\|\\big|$，不是 $0$，也不是较小的范数：两个向量最多只能抵消较短那个的长度。",
  ),
  generate(rng) {
    const a = rng.int(1, 30);
    const b = rng.pick([...Array(30).keys()].map((i) => i + 1).filter((v) => v !== a));
    const largest = rng.pick([true, false]);
    const answer = largest ? a + b : Math.abs(a - b);
    const other = largest ? Math.abs(a - b) : a + b;
    return numberProblem({
      prompt: t(
        `In an inner product space, $\\|\\mathbf{u}\\| = ${a}$ and $\\|\\mathbf{v}\\| = ${b}$. What is the ${largest ? "largest" : "smallest"} possible value of $\\|\\mathbf{u} + \\mathbf{v}\\|$?`,
        `在内积空间中，$\\|\\mathbf{u}\\| = ${a}$，$\\|\\mathbf{v}\\| = ${b}$。$\\|\\mathbf{u} + \\mathbf{v}\\|$ ${largest ? "最大" : "最小"}可能是多少？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          other,
          largest
            ? "That is the smallest value, reached when the vectors point opposite ways."
            : "That is the largest value, reached when the vectors point the same way.",
          largest ? "这是最小值，在两个向量反向时达到。" : "这是最大值，在两个向量同向时达到。",
        ),
        why(a * b, "Norms of a sum are bounded by sums of norms, not products.", "和的范数由范数之和来界定，而不是乘积。"),
        why(
          a * a + b * b,
          "That is $\\|\\mathbf{u} + \\mathbf{v}\\|^2$ for orthogonal vectors, a squared norm and not an extreme.",
          "这是正交时的 $\\|\\mathbf{u} + \\mathbf{v}\\|^2$，是范数的平方，也不是最值。",
        ),
        why(
          Math.max(a, b),
          "Adding $\\mathbf{v}$ can make the sum longer or shorter than the longer vector.",
          "加上 $\\mathbf{v}$ 可以使和比较长的向量更长或更短。",
        ),
        why(
          Math.min(a, b),
          `The smaller norm is not a bound; the shortest sum is $|${a} - ${b}|$.`,
          `较小的范数不是界；最短的和是 $|${a} - ${b}|$。`,
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Write both bounds", "写出上下界"],
            t("By the triangle inequality and its reverse form:", "由三角不等式及其反向形式："),
            [
              `|${a} - ${b}| \\le \\|\\mathbf{u} + \\mathbf{v}\\| \\le ${a} + ${b}`,
              `${Math.abs(a - b)} \\le \\|\\mathbf{u} + \\mathbf{v}\\| \\le ${a + b}`,
            ],
          ],
          [
            [largest ? "Take the upper bound" : "Take the lower bound", largest ? "取上界" : "取下界"],
            t(
              `The value $${answer}$ is reached when $\\mathbf{v}$ points ${largest ? "the same way as" : "opposite to"} $\\mathbf{u}$.`,
              `当 $\\mathbf{v}$ 与 $\\mathbf{u}$ ${largest ? "同向" : "反向"}时达到 $${answer}$。`,
            ),
          ],
        ],
        t(
          `With $\\mathbf{v} = ${largest ? "" : "-"}${frac(b, a)}\\mathbf{u}$, $\\|\\mathbf{v}\\| = ${b}$ and $\\|\\mathbf{u} + \\mathbf{v}\\| = \\left|1 ${largest ? "+" : "-"} ${frac(b, a)}\\right| \\cdot ${a} = ${answer}$.`,
          `取 $\\mathbf{v} = ${largest ? "" : "-"}${frac(b, a)}\\mathbf{u}$，则 $\\|\\mathbf{v}\\| = ${b}$，且 $\\|\\mathbf{u} + \\mathbf{v}\\| = \\left|1 ${largest ? "+" : "-"} ${frac(b, a)}\\right| \\cdot ${a} = ${answer}$。`,
        ),
      ),
    });
  },
};

const trigonometricNorm: KnowledgePointDef = {
  id: "the-norm-of-a-sum-of-orthogonal-trigonometric-functions",
  title: t("The norm of a sum of orthogonal trigonometric functions", "正交三角函数之和的范数"),
  explanation: t(
    "On $[-\\pi, \\pi]$ with the integral inner product, $\\sin mt$ and $\\cos nt$ are orthogonal for all positive whole $m$ and $n$, since their product is an odd function. Each has squared norm $\\pi$. The Pythagorean theorem then applies to any combination of them, so the squared norm is found without squaring and integrating the whole expression. For example, $f(t) = 3\\sin 2t + 4\\cos 5t$ has $\\|f\\|^2 = 9\\pi + 16\\pi = 25\\pi$.\n\n> **Watch out.** Square each coefficient separately and add; do not square their sum. There is no cross term, because $\\langle \\sin mt, \\cos nt \\rangle = 0$.",
    "在 $[-\\pi, \\pi]$ 上用积分内积，对所有正整数 $m$、$n$，$\\sin mt$ 和 $\\cos nt$ 都正交，因为它们的积是奇函数。它们的范数平方都是 $\\pi$。于是勾股定理适用于它们的任何组合，所以不必把整个式子平方再积分，就能求出范数平方。例如 $f(t) = 3\\sin 2t + 4\\cos 5t$ 有 $\\|f\\|^2 = 9\\pi + 16\\pi = 25\\pi$。\n\n> **注意。** 各系数分别平方再相加；不要把它们的和平方。没有交叉项，因为 $\\langle \\sin mt, \\cos nt \\rangle = 0$。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const b = rng.int(1, 9);
    const m = rng.int(1, 9);
    const n = rng.int(1, 9);
    const answer = a * a + b * b;
    const first = withCoefficient(a, `\\sin ${withCoefficient(m, "t")}`);
    const second = withCoefficient(b, `\\cos ${withCoefficient(n, "t")}`);
    return numberProblem({
      prompt: t(
        `With $\\langle f, g \\rangle = \\int_{-\\pi}^{\\pi} f(t)g(t)\\,dt$, the function $f(t) = ${first} + ${second}$ has $\\|f\\|^2 = c\\pi$. Find $c$.`,
        `用 $\\langle f, g \\rangle = \\int_{-\\pi}^{\\pi} f(t)g(t)\\,dt$，函数 $f(t) = ${first} + ${second}$ 满足 $\\|f\\|^2 = c\\pi$。求 $c$。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          (a + b) ** 2,
          "That squares the sum of the coefficients, keeping a cross term that is zero.",
          "这是把系数之和平方，保留了一个为零的交叉项。",
        ),
        why(
          2 * answer,
          "Each of $\\sin mt$ and $\\cos nt$ has squared norm $\\pi$ on $[-\\pi, \\pi]$, not $2\\pi$.",
          "在 $[-\\pi, \\pi]$ 上 $\\sin mt$ 与 $\\cos nt$ 的范数平方都是 $\\pi$，不是 $2\\pi$。",
        ),
        why(a + b, "The coefficients must be squared: $\\|a f\\|^2 = a^2\\|f\\|^2$.", "系数要平方：$\\|a f\\|^2 = a^2\\|f\\|^2$。"),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Use orthogonality", "利用正交性"],
            t(
              "The product of a sine and a cosine is odd, so the cross term integrates to $0$:",
              "正弦与余弦之积是奇函数，所以交叉项的积分为 $0$：",
            ),
            [`\\|f\\|^2 = ${a}^2\\|\\sin ${withCoefficient(m, "t")}\\|^2 + ${b}^2\\|\\cos ${withCoefficient(n, "t")}\\|^2`],
          ],
          [
            ["Use the squared norms", "代入范数平方"],
            t("Each basic function has squared norm $\\pi$:", "每个基本函数的范数平方都是 $\\pi$："),
            [`\\|f\\|^2 = ${a * a}\\pi + ${b * b}\\pi = ${answer}\\pi`],
          ],
        ],
        t(
          `$\\int_{-\\pi}^{\\pi} \\sin^2 ${withCoefficient(m, "t")}\\,dt = \\int_{-\\pi}^{\\pi} \\frac{1 - \\cos ${withCoefficient(2 * m, "t")}}{2}\\,dt = \\pi$, which confirms the squared norm used, so $c = ${answer}$.`,
          `$\\int_{-\\pi}^{\\pi} \\sin^2 ${withCoefficient(m, "t")}\\,dt = \\int_{-\\pi}^{\\pi} \\frac{1 - \\cos ${withCoefficient(2 * m, "t")}}{2}\\,dt = \\pi$，证实了所用的范数平方，所以 $c = ${answer}$。`,
        ),
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Third pass
// ---------------------------------------------------------------------------

/** rootFactor writes the factor of a characteristic polynomial for one eigenvalue, with its multiplicity. */
const rootFactor = (value: number, multiplicity: number) =>
  `(${poly([1, "x"], [-value, ""])})${multiplicity === 1 ? "" : `^{${multiplicity}}`}`;
/** sumOfDiagonal adds the diagonal entries of a square matrix. */
const sumOfDiagonal = (m: Grid) => m.reduce((total, row, i) => total + (row[i] ?? 0), 0);
/** range1to9 lists the integers from 1 to 9. */
const range1to9 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
/** distinctNonzero picks several different nonzero integers of size at most r. */
const distinctNonzero = (rng: Rng, r: number, count: number) => {
  const chosen: number[] = [];
  while (chosen.length < count) {
    const value = nonzero(rng, r);
    if (!chosen.includes(value)) chosen.push(value);
  }
  return chosen;
};

const numeratorDeterminant: KnowledgePointDef = {
  id: "the-numerator-determinant-in-cramers-rule",
  title: t("The numerator determinant in Cramer's rule", "克拉默法则中分子的行列式"),
  explanation: t(
    "Cramer's rule says that an unknown of the system $A\\mathbf{x} = \\mathbf{b}$ equals $\\frac{\\det A_j}{\\det A}$, where $A_j$ is the matrix $A$ with its $j$th column replaced by $\\mathbf{b}$. The rule can be read backwards as well. If the value of an unknown and the determinant of $A$ are known, the determinant of $A_j$ is their product, and it can be found without seeing a single entry of either matrix. With $\\det A = 4$ and $x_2 = -3$: $\\det A_2 = -12$.\n\n> **Watch out.** $\\det A_j$ is the numerator, so it is the product $x_j \\det A$, not a sum or a quotient. Keep the signs of both factors.",
    "克拉默法则指出，方程组 $A\\mathbf{x} = \\mathbf{b}$ 的未知数等于 $\\frac{\\det A_j}{\\det A}$，其中 $A_j$ 是把 $A$ 的第 $j$ 列换成 $\\mathbf{b}$ 得到的矩阵。这个法则也可以反过来读。如果知道未知数的值和 $A$ 的行列式，$A_j$ 的行列式就是它们的积，不必看到两个矩阵的任何元素就能求出。$\\det A = 4$、$x_2 = -3$ 时：$\\det A_2 = -12$。\n\n> **注意。** $\\det A_j$ 是分子，所以它是积 $x_j \\det A$，不是和也不是商。两个因子的符号都要保留。",
  ),
  generate(rng) {
    // A factor of size one would make the answer one of the numbers given.
    const d = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) * rng.pick([1, -1]);
    const k = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) * rng.pick([1, -1]);
    const j = rng.int(1, 3);
    const answer = d * k;
    return numberProblem({
      prompt: t(
        `A system $A\\mathbf{x} = \\mathbf{b}$ of three equations has $\\det A = ${d}$, and its unique solution has $x_{${j}} = ${k}$. Let $A_{${j}}$ be $A$ with column ${j} replaced by $\\mathbf{b}$. Find $\\det A_{${j}}$.`,
        `三个方程的方程组 $A\\mathbf{x} = \\mathbf{b}$ 满足 $\\det A = ${d}$，它的唯一解满足 $x_{${j}} = ${k}$。设 $A_{${j}}$ 是把 $A$ 的第 ${j} 列换成 $\\mathbf{b}$ 得到的矩阵。求 $\\det A_{${j}}$。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          -answer,
          "The sign is flipped: multiply $x_j$ and $\\det A$ with both of their signs.",
          "符号反了：把 $x_j$ 与 $\\det A$ 连同符号相乘。",
        ),
        why(
          d + k,
          "That adds the two numbers; Cramer's rule makes $\\det A_j$ their product.",
          "这是两数相加；由克拉默法则，$\\det A_j$ 是它们的积。",
        ),
      ].filter((w, x, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === x),
      solution: walked(
        [
          [["Write Cramer's rule", "写出克拉默法则"], t("", ""), [`x_{${j}} = \\frac{\\det A_{${j}}}{\\det A}`]],
          [
            ["Multiply by $\\det A$", "乘以 $\\det A$"],
            t(
              `$\\det A_{${j}} = x_{${j}} \\det A = ${inParens(k)} \\cdot ${inParens(d)} = ${answer}$.`,
              `$\\det A_{${j}} = x_{${j}} \\det A = ${inParens(k)} \\cdot ${inParens(d)} = ${answer}$。`,
            ),
          ],
        ],
        t(`$\\frac{${answer}}{${d}} = ${k} = x_{${j}}$, as given.`, `$\\frac{${answer}}{${d}} = ${k} = x_{${j}}$，与已知相符。`),
      ),
    });
  },
};

const determinantAfterOperations: KnowledgePointDef = {
  id: "the-determinant-after-a-sequence-of-row-operations",
  title: t("The determinant after a sequence of row operations", "一系列行变换后的行列式"),
  explanation: t(
    "Each kind of row operation has its own effect on a determinant, and in a sequence the effects simply multiply. Swapping two rows changes the sign, and multiplying a row by $c$ multiplies the determinant by $c$. Adding a multiple of one row to another changes nothing at all, however large that multiple is. So in a long sequence, only the swaps and the scalings need to be tracked, and the order does not matter. From $\\det = 3$, two swaps and doubling a row give $6$.\n\n> **Watch out.** Two swaps cancel each other, and the multiple in a row addition never enters the answer. Count the swaps and multiply the scalings, nothing else.",
    "每种行变换对行列式都有各自的影响，在一系列变换中这些影响直接相乘。交换两行改变符号，把一行乘以 $c$ 使行列式乘以 $c$。把一行的倍数加到另一行则完全不改变行列式，不管这个倍数多大。所以在一长串变换中，只需跟踪交换和数乘，顺序无关紧要。由 $\\det = 3$ 出发，两次交换再把某行乘以 $2$，得 $6$。\n\n> **注意。** 两次交换相互抵消，行倍加中的倍数从不进入答案。只数交换次数、乘上数乘因子，别的都不用管。",
  ),
  generate(rng) {
    const d = nonzero(rng, 9);
    const c = rng.int(2, 6);
    const m = nonzero(rng, 7);
    const swaps = rng.int(1, 2);
    const sign = swaps === 1 ? -1 : 1;
    const answer = sign * c * d;
    const moves =
      swaps === 1
        ? ["swap rows 1 and 2", "交换第 1、2 行"]
        : ["swap rows 1 and 2, then swap rows 2 and 3", "交换第 1、2 行，再交换第 2、3 行"];
    return numberProblem({
      prompt: t(
        `A $3 \\times 3$ matrix has determinant $${d}$. In turn, ${moves[0]}, multiply row 3 by ${c}, and add $${m}$ times row 1 to row 2. Find the new determinant.`,
        `一个 $3 \\times 3$ 矩阵的行列式是 $${d}$。依次${moves[1]}，把第 3 行乘以 ${c}，再把第 1 行的 $${m}$ 倍加到第 2 行。求新的行列式。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          -answer,
          swaps === 1
            ? "The swap changes the sign; that factor $-1$ is missing."
            : "Two swaps cancel: the sign changes twice and comes back.",
          swaps === 1 ? "交换改变符号；漏了因子 $-1$。" : "两次交换相互抵消：符号变两次又变回来。",
        ),
        why(
          answer * m,
          `Adding $${m}$ times a row to another leaves the determinant unchanged; $${m}$ does not enter the answer.`,
          `把一行的 $${m}$ 倍加到另一行不改变行列式；$${m}$ 不进入答案。`,
        ),
        why(
          answer + m,
          `A row addition adds nothing to the determinant, $${m}$ or otherwise.`,
          `行倍加不会给行列式加上任何数，包括 $${m}$。`,
        ),
        why(d, `Multiplying row 3 by ${c} multiplies the determinant by ${c}.`, `第 3 行乘以 ${c}，行列式就乘以 ${c}。`),
        why(
          c + d,
          `Scaling a row multiplies the determinant by ${c}; it does not add ${c}.`,
          `数乘一行是使行列式乘以 ${c}，不是加上 ${c}。`,
        ),
      ].filter((w, x, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === x),
      solution: walked(
        [
          [
            ["Find each factor", "求每个因子"],
            t(
              `${swaps === 1 ? "The swap gives $-1$" : "The two swaps give $(-1)^2 = 1$"}, the scaling gives ${c}, and the row addition gives $1$.`,
              `${swaps === 1 ? "交换给出 $-1$" : "两次交换给出 $(-1)^2 = 1$"}，数乘给出 ${c}，行倍加给出 $1$。`,
            ),
          ],
          [
            ["Multiply them into the determinant", "乘到行列式上"],
            t("", ""),
            [`${sign} \\cdot ${c} \\cdot 1 \\cdot ${inParens(d)} = ${answer}`],
          ],
        ],
        t(
          `Undoing the operations, $${answer}$ divided by ${c} and multiplied by $${sign}$ gives back $${d}$.`,
          `撤销这些变换：$${answer}$ 除以 ${c} 再乘以 $${sign}$，又得到 $${d}$。`,
        ),
      ),
    });
  },
};

const equalOffDiagonalSingular: KnowledgePointDef = {
  id: "the-parameter-that-makes-an-equal-off-diagonal-matrix-singular",
  title: t("The parameter that makes an equal off-diagonal matrix singular", "使非对角元相等的矩阵奇异的参数"),
  explanation: t(
    "A determinant with a pattern can often be factored by row operations instead of being expanded. In a matrix with $x$ on the diagonal and one constant $a$ everywhere else, every row has the same sum $x + 2a$. Adding all the rows to the first makes this a common factor. Subtracting $a$ times that row of ones from the others then leaves a triangular matrix, and the determinant is $(x - a)^2(x + 2a)$. With $a = 3$ the matrix is singular at $x = 3$ and at $x = -6$.\n\n> **Watch out.** The second root comes from the row sum $x + 2a$, so it is $-2a$, not $-a$. There are two off-diagonal entries in each row.",
    "有规律的行列式常常可以用行变换分解因式，而不必展开。对角线上是 $x$、其他位置都是常数 $a$ 的矩阵，每一行的和都是 $x + 2a$。把所有行加到第一行，这就成为公因子。再从其他行减去这个全 1 行的 $a$ 倍，就得到三角矩阵，行列式是 $(x - a)^2(x + 2a)$。$a = 3$ 时，矩阵在 $x = 3$ 和 $x = -6$ 时奇异。\n\n> **注意。** 第二个根来自行和 $x + 2a$，所以是 $-2a$，不是 $-a$。每行有两个非对角元素。",
  ),
  generate(rng) {
    const a = nonzero(rng, 20);
    const answer = -2 * a;
    return numberProblem({
      prompt: t(
        `The matrix $${mat([
          ["x", a, a],
          [a, "x", a],
          [a, a, "x"],
        ])}$ is singular when $x = ${a}$ and for one other value of $x$. Find that other value.`,
        `矩阵 $${mat([
          ["x", a, a],
          [a, "x", a],
          [a, a, "x"],
        ])}$ 在 $x = ${a}$ 时奇异，另外还有一个 $x$ 值使它奇异。求这个值。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          -a,
          "Each row has two off-diagonal entries, so the row sum is $x + 2a$ and the root is $-2a$.",
          "每行有两个非对角元，所以行和是 $x + 2a$，根是 $-2a$。",
        ),
        why(2 * a, "The sign is flipped: $x + 2a = 0$ gives $x = -2a$.", "符号反了：由 $x + 2a = 0$ 得 $x = -2a$。"),
        why(3 * a, "The row sum is $x + 2a$; setting it to zero gives $-2a$.", "行和是 $x + 2a$；令它为零得 $-2a$。"),
        why(
          -3 * a,
          "The row sum has the diagonal $x$ plus two copies of $a$, so the root is $-2a$.",
          "行和是对角元 $x$ 加上两个 $a$，所以根是 $-2a$。",
        ),
      ].filter((w, x, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === x),
      solution: walked(
        [
          [
            ["Factor out the row sum", "提出行和"],
            t(
              `Each row has the sum $${poly([1, "x"], [2 * a, ""])}$; adding all rows to the first makes it a common factor.`,
              `每一行的和都是 $${poly([1, "x"], [2 * a, ""])}$；把所有行加到第一行，它就成为公因子。`,
            ),
          ],
          [
            ["Reduce to triangular form", "化为三角形"],
            t("Subtracting multiples of the row of ones leaves", "减去全 1 行的倍数后得"),
            [`\\det = (${poly([1, "x"], [-a, ""])})^2(${poly([1, "x"], [2 * a, ""])})`],
          ],
          [
            ["Find the other root", "求另一个根"],
            t(
              `The factor $${poly([1, "x"], [2 * a, ""])}$ vanishes at $x = ${answer}$.`,
              `因子 $${poly([1, "x"], [2 * a, ""])}$ 在 $x = ${answer}$ 时为零。`,
            ),
          ],
        ],
        t(
          `At $x = ${answer}$ each row sums to $${answer} + ${inParens(a)} + ${inParens(a)} = 0$, so the columns add up to the zero vector and the matrix is singular.`,
          `$x = ${answer}$ 时每行之和为 $${answer} + ${inParens(a)} + ${inParens(a)} = 0$，所以各列之和是零向量，矩阵奇异。`,
        ),
      ),
    });
  },
};

const firstUnknownOfBidiagonal: KnowledgePointDef = {
  id: "the-first-unknown-of-a-4x4-bidiagonal-system",
  title: t("The first unknown of a 4×4 bidiagonal system", "4×4 双对角方程组的第一个未知数"),
  explanation: t(
    "In a triangular system with only one extra term in each equation, back substitution becomes a short chain. The last equation gives the last unknown at once, and each equation above it uses only the value just found. So the work grows with the number of equations, not its square, and this is why banded systems are so cheap to solve. The first unknown is found last, and any slip along the chain will reach it. From $x_2 = 4$ and $x_1 + 3x_2 = 10$: $x_1 = 10 - 12 = -2$.\n\n> **Watch out.** Each step uses the value just found, not the right-hand side above it. The constant of the first equation is not $x_1$ until the $x_2$ term is moved across.",
    "在每个方程只多一项的三角方程组中，回代变成一条短链。最后一个方程直接给出最后一个未知数，它上面的每个方程只用刚求出的值。所以工作量随方程个数增长，而不是随其平方增长，这就是带状方程组容易求解的原因。第一个未知数最后求出，链上的任何差错都会影响它。由 $x_2 = 4$ 与 $x_1 + 3x_2 = 10$：$x_1 = 10 - 12 = -2$。\n\n> **注意。** 每一步用刚求出的值，而不是上面一个方程的右端。第一个方程的常数要先移走 $x_2$ 项才是 $x_1$。",
  ),
  generate(rng) {
    const [a, b, c] = [nonzero(rng, 4), nonzero(rng, 4), nonzero(rng, 4)];
    const x4 = rng.int(-5, 5);
    const x3 = rng.int(-5, 5);
    const x2 = rng.int(-5, 5);
    const answer = rng.int(-5, 5);
    const r3 = x3 + c * x4;
    const r2 = x2 + b * x3;
    const r1 = answer + a * x2;
    const system = `${poly([1, "x_1"], [a, "x_2"])} = ${r1}, \\quad ${poly([1, "x_2"], [b, "x_3"])} = ${r2}, \\quad ${poly([1, "x_3"], [c, "x_4"])} = ${r3}, \\quad x_4 = ${x4}`;
    return numberProblem({
      prompt: t(`Solve by back substitution: $${system}$. Find $x_1$.`, `用回代求解：$${system}$。求 $x_1$。`),
      answer,
      form: "integer",
      mistakes: [
        why(
          r1,
          "That is the constant of the first equation; the term with $x_2$ still has to be moved across.",
          "这是第一个方程的常数；还要把含 $x_2$ 的项移过去。",
        ),
        why(x2, "That is $x_2$; one more step up the chain gives $x_1$.", "这是 $x_2$；沿链再往上一步才得到 $x_1$。"),
        why(
          r1 - a * r2,
          "That uses the constant of the second equation in place of $x_2$; substitute the value of $x_2$ found from it.",
          "这用第二个方程的常数代替了 $x_2$；要代入由它求出的 $x_2$ 的值。",
        ),
        why(-answer, "The sign is flipped: move the $x_2$ term across with its sign.", "符号反了：把 $x_2$ 项连同符号移过去。"),
      ].filter((w, x, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === x),
      solution: walked(
        [
          [
            ["Find $x_3$", "求 $x_3$"],
            t(
              `$x_3 = ${r3} - ${inParens(c)} \\cdot ${inParens(x4)} = ${x3}$.`,
              `$x_3 = ${r3} - ${inParens(c)} \\cdot ${inParens(x4)} = ${x3}$。`,
            ),
          ],
          [
            ["Find $x_2$", "求 $x_2$"],
            t(
              `$x_2 = ${r2} - ${inParens(b)} \\cdot ${inParens(x3)} = ${x2}$.`,
              `$x_2 = ${r2} - ${inParens(b)} \\cdot ${inParens(x3)} = ${x2}$。`,
            ),
          ],
          [
            ["Find $x_1$", "求 $x_1$"],
            t(
              `$x_1 = ${r1} - ${inParens(a)} \\cdot ${inParens(x2)} = ${answer}$.`,
              `$x_1 = ${r1} - ${inParens(a)} \\cdot ${inParens(x2)} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `In the first equation, $${answer} + ${inParens(a)} \\cdot ${inParens(x2)} = ${r1}$.`,
          `代入第一个方程：$${answer} + ${inParens(a)} \\cdot ${inParens(x2)} = ${r1}$。`,
        ),
      ),
    });
  },
};

const dimensionOfIntersection: KnowledgePointDef = {
  id: "the-smallest-possible-intersection-of-two-subspaces",
  title: t("The smallest possible intersection of two subspaces", "两个子空间最小可能的交"),
  explanation: t(
    "Two subspaces cannot avoid each other if they are large enough. The sum $U + V$ lies inside the whole space, so its dimension is at most $n$, and the formula $\\dim(U \\cap V) = \\dim U + \\dim V - \\dim(U + V)$ then forces the intersection to have dimension at least $\\dim U + \\dim V - n$. This is why two planes through the origin in three dimensions always share a line, and it holds whatever the planes are. For example, in $\\mathbb{R}^5$ subspaces of dimensions $3$ and $4$ share at least $3 + 4 - 5 = 2$ dimensions.\n\n> **Watch out.** This is the smallest possible intersection, not the usual one; the largest is the smaller of the two dimensions, when one subspace contains the other.",
    "两个子空间足够大时就无法彼此避开。和 $U + V$ 位于整个空间内，所以它的维数至多是 $n$，于是公式 $\\dim(U \\cap V) = \\dim U + \\dim V - \\dim(U + V)$ 迫使交的维数至少是 $\\dim U + \\dim V - n$。这就是三维空间中过原点的两个平面总有一条公共直线的原因，不管是什么平面都成立。例如在 $\\mathbb{R}^5$ 中，维数为 $3$ 与 $4$ 的子空间至少共有 $3 + 4 - 5 = 2$ 维。\n\n> **注意。** 这是最小可能的交，而不是通常的交；最大的交等于两个维数中较小的那个，此时一个子空间包含另一个。",
  ),
  generate(rng) {
    const n = rng.int(3, 12);
    const a = rng.int(2, n - 1);
    const b = rng.int(n - a + 1, n - 1);
    const answer = a + b - n;
    return numberProblem({
      prompt: t(
        `In $\\mathbb{R}^{${n}}$, subspaces $U$ and $V$ have dimensions ${a} and ${b}. What is the smallest possible dimension of $U \\cap V$?`,
        `在 $\\mathbb{R}^{${n}}$ 中，子空间 $U$、$V$ 的维数分别是 ${a} 和 ${b}。$U \\cap V$ 最小可能的维数是多少？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          Math.min(a, b),
          "That is the largest possible intersection, when one subspace lies inside the other.",
          "这是最大可能的交，此时一个子空间在另一个之中。",
        ),
        why(
          a + b,
          `That is more than $${n}$, the dimension of the whole space; subtract $${n}$.`,
          `这比整个空间的维数 $${n}$ 还大；要减去 $${n}$。`,
        ),
        why(
          n - a,
          `That is the dimension left over by $U$; the two dimensions are added before subtracting $${n}$.`,
          `这是 $U$ 剩下的维数；要先把两个维数相加，再减去 $${n}$。`,
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Bound the sum", "估计和的维数"],
            t(
              `$U + V$ lies in $\\mathbb{R}^{${n}}$, so $\\dim(U + V) \\le ${n}$.`,
              `$U + V$ 在 $\\mathbb{R}^{${n}}$ 中，所以 $\\dim(U + V) \\le ${n}$。`,
            ),
          ],
          [
            ["Use the dimension formula", "用维数公式"],
            t("", ""),
            [`\\dim(U \\cap V) = ${a} + ${b} - \\dim(U + V) \\ge ${a} + ${b} - ${n} = ${answer}`],
          ],
        ],
        t(
          `The bound is reached: take $U$ spanned by the first ${a} standard vectors and $V$ by the last ${b}; they share exactly ${answer} of them, since ${a} + ${b} - ${n} = ${answer}.`,
          `这个下界可以取到：取 $U$ 由前 ${a} 个标准向量张成，$V$ 由后 ${b} 个张成；它们恰好共有 ${answer} 个，因为 ${a} + ${b} - ${n} = ${answer}。`,
        ),
      ),
    });
  },
};

const coefficientOfDependentVector: KnowledgePointDef = {
  id: "a-coefficient-in-a-relation-among-dependent-vectors",
  title: t("A coefficient in a relation among dependent vectors", "相关向量关系式中的系数"),
  explanation: t(
    "When a spanning set contains a dependent vector, removing it leaves a smaller set that spans the same space, and the relation shows exactly why. Writing $\\mathbf{v}_3 = a\\mathbf{v}_1 + b\\mathbf{v}_2$ gives one equation per coordinate, more than the two unknowns need. If $\\mathbf{v}_1$ and $\\mathbf{v}_2$ are in a staircase shape, the first coordinate gives $a$ at once, and the second coordinate then gives $b$ after allowing for $a$. For example, with $\\mathbf{v}_1 = (1, 2, 0)$, $\\mathbf{v}_2 = (0, 1, 1)$ and $\\mathbf{v}_3 = (3, 5, -1)$, the first coordinate gives $a = 3$ and the second gives $6 + b = 5$, so $b = -1$.\n\n> **Watch out.** The second coordinate of $\\mathbf{v}_3$ is not $b$ itself; first take away the part $a$ contributes.",
    "当张成集包含一个相关向量时，去掉它后剩下的较小集合张成同一空间，关系式说明了原因。写出 $\\mathbf{v}_3 = a\\mathbf{v}_1 + b\\mathbf{v}_2$，每个坐标给出一个方程，比两个未知数需要的多。如果 $\\mathbf{v}_1$、$\\mathbf{v}_2$ 呈阶梯形，第一个坐标直接给出 $a$，第二个坐标在考虑 $a$ 之后给出 $b$。例如 $\\mathbf{v}_1 = (1, 2, 0)$，$\\mathbf{v}_2 = (0, 1, 1)$，$\\mathbf{v}_3 = (3, 5, -1)$ 时，第一个坐标给出 $a = 3$，第二个坐标给出 $6 + b = 5$，所以 $b = -1$。\n\n> **注意。** $\\mathbf{v}_3$ 的第二个坐标并不就是 $b$；要先减去 $a$ 贡献的部分。",
  ),
  generate(rng) {
    const [p, q, r] = [nonzero(rng, 4), nonzero(rng, 4), nonzero(rng, 4)];
    const a = nonzero(rng, 5);
    const b = nonzero(rng, 5);
    const v3 = [a, a * p + b, a * q + b * r];
    const vectors = `\\mathbf{v}_1 = ${col(1, p, q)}, \\mathbf{v}_2 = ${col(0, 1, r)}, \\mathbf{v}_3 = ${col(...v3)}`;
    return numberProblem({
      prompt: t(
        `The vectors $${vectors}$ satisfy $\\mathbf{v}_3 = a\\mathbf{v}_1 + b\\mathbf{v}_2$. Find $b$.`,
        `向量 $${vectors}$ 满足 $\\mathbf{v}_3 = a\\mathbf{v}_1 + b\\mathbf{v}_2$。求 $b$。`,
      ),
      answer: b,
      form: "integer",
      mistakes: [
        why(
          a,
          "That is $a$, the weight on $\\mathbf{v}_1$; the question asks for $b$.",
          "这是 $\\mathbf{v}_1$ 的权重 $a$；题目求的是 $b$。",
        ),
        why(
          v3[1]!,
          "That is the second coordinate of $\\mathbf{v}_3$; take away the part $a\\mathbf{v}_1$ contributes first.",
          "这是 $\\mathbf{v}_3$ 的第二个坐标；要先减去 $a\\mathbf{v}_1$ 贡献的部分。",
        ),
        why(-b, "The sign is flipped; recheck the subtraction in the second coordinate.", "符号反了；请重新检查第二个坐标中的减法。"),
        why(
          v3[1]! + a * p,
          "The part from $a\\mathbf{v}_1$ was added instead of subtracted.",
          "$a\\mathbf{v}_1$ 的部分应减去，这里却加上了。",
        ),
      ].filter((w, i, all) => w.value !== b && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["First coordinate", "第一个坐标"],
            t("Only $\\mathbf{v}_1$ has a nonzero first coordinate:", "只有 $\\mathbf{v}_1$ 的第一个坐标不为零："),
            [`a \\cdot 1 + b \\cdot 0 = ${a}`, `a = ${a}`],
          ],
          [
            ["Second coordinate", "第二个坐标"],
            t("", ""),
            [`${inParens(a)} \\cdot ${inParens(p)} + b \\cdot 1 = ${v3[1]}`, `b = ${v3[1]} - ${inParens(a * p)} = ${b}`],
          ],
        ],
        t(
          `The third coordinate agrees: $${inParens(a)} \\cdot ${inParens(q)} + ${inParens(b)} \\cdot ${inParens(r)} = ${v3[2]}$.`,
          `第三个坐标也相符：$${inParens(a)} \\cdot ${inParens(q)} + ${inParens(b)} \\cdot ${inParens(r)} = ${v3[2]}$。`,
        ),
      ),
    });
  },
};

const determinantOfChangeOfBasis: KnowledgePointDef = {
  id: "the-determinant-of-a-change-of-coordinates-matrix",
  figure: linearAlgebraDrawings1["the-change-of-coordinates-matrix#the-determinant-of-a-change-of-coordinates-matrix"],
  title: t("The determinant of a change of coordinates matrix", "坐标变换矩阵的行列式"),
  explanation: t(
    "Let the matrices $B$ and $C$ have two bases as their columns. A vector with $B$-coordinates $\\mathbf{x}$ is $B\\mathbf{x}$, and its $C$-coordinates are therefore $C^{-1}B\\mathbf{x}$. So the matrix that changes coordinates from $B$ to $C$ is $C^{-1}B$, and its determinant is the ratio $\\frac{\\det B}{\\det C}$. The ratio measures how the area of the $B$ parallelogram compares with that of the $C$ parallelogram, and the reverse change has the reciprocal determinant. For example, if $\\det B = 6$ and $\\det C = -2$, the change from $\\mathcal{B}$ to $\\mathcal{C}$ has determinant $\\frac{6}{-2} = -3$.\n\n> **Watch out.** The basis being left goes on top: from $\\mathcal{B}$ to $\\mathcal{C}$ is $\\frac{\\det B}{\\det C}$, and the reverse is its reciprocal.",
    "设矩阵 $B$、$C$ 的列是两组基。$B$-坐标为 $\\mathbf{x}$ 的向量是 $B\\mathbf{x}$，所以它的 $C$-坐标是 $C^{-1}B\\mathbf{x}$。因此把坐标从 $B$ 变到 $C$ 的矩阵是 $C^{-1}B$，它的行列式是比值 $\\frac{\\det B}{\\det C}$。这个比值衡量 $B$ 平行四边形的面积与 $C$ 平行四边形面积的比较，反向变换的行列式是其倒数。例如 $\\det B = 6$，$\\det C = -2$ 时，从 $\\mathcal{B}$ 到 $\\mathcal{C}$ 的变换的行列式为 $\\frac{6}{-2} = -3$。\n\n> **注意。** 被离开的那组基放在分子上：从 $\\mathcal{B}$ 到 $\\mathcal{C}$ 是 $\\frac{\\det B}{\\det C}$，反向是它的倒数。",
  ),
  generate(rng) {
    const pickBasis = (): number[][] => {
      for (;;) {
        const m = [
          [rng.int(-5, 5), rng.int(-5, 5)],
          [rng.int(-5, 5), rng.int(-5, 5)],
        ];
        if (det(m) !== 0) return m;
      }
    };
    const b = pickBasis();
    const c = pickBasis();
    const db = det(b);
    const dc = det(c);
    const answer = Q.of(db, dc);
    const basis = (m: number[][]) => `${col(m[0]?.[0] ?? 0, m[1]?.[0] ?? 0)}, ${col(m[0]?.[1] ?? 0, m[1]?.[1] ?? 0)}`;
    return numberProblem({
      prompt: t(
        `Let $\\mathcal{B}$ be the basis $${basis(b)}$ and $\\mathcal{C}$ the basis $${basis(c)}$ of $\\mathbb{R}^2$. Find the determinant of the matrix that changes coordinates from $\\mathcal{B}$ to $\\mathcal{C}$.`,
        `设 $\\mathcal{B}$ 是 $\\mathbb{R}^2$ 的基 $${basis(b)}$，$\\mathcal{C}$ 是基 $${basis(c)}$。求把坐标从 $\\mathcal{B}$ 变到 $\\mathcal{C}$ 的矩阵的行列式。`,
      ),
      answer,
      mistakes: [
        why(
          Q.of(dc, db),
          "This is upside down: it is the determinant of the change from $\\mathcal{C}$ to $\\mathcal{B}$.",
          "分子分母颠倒了：这是从 $\\mathcal{C}$ 到 $\\mathcal{B}$ 的变换的行列式。",
        ),
        why(
          Q.of(db * dc),
          "The determinants are multiplied; $C^{-1}$ contributes $\\frac{1}{\\det C}$, so divide.",
          "这里把两个行列式相乘了；$C^{-1}$ 贡献的是 $\\frac{1}{\\det C}$，所以要相除。",
        ),
        why(answer.neg(), "The sign is flipped; recheck the signs of the two determinants.", "符号反了；请重新检查两个行列式的符号。"),
      ].filter((w, i, all) => {
        const asQ = (x: number | Q) => (typeof x === "number" ? Q.of(x) : x);
        return !asQ(w.value).eq(answer) && all.findIndex((o) => asQ(o.value).eq(asQ(w.value))) === i;
      }),
      solution: walked(
        [
          [
            ["The matrix", "矩阵"],
            t(
              "A vector with $\\mathcal{B}$-coordinates $\\mathbf{x}$ is $B\\mathbf{x}$, with $\\mathcal{C}$-coordinates $C^{-1}B\\mathbf{x}$, so:",
              "$\\mathcal{B}$-坐标为 $\\mathbf{x}$ 的向量是 $B\\mathbf{x}$，其 $\\mathcal{C}$-坐标为 $C^{-1}B\\mathbf{x}$，所以：",
            ),
            ["\\det(C^{-1}B) = \\frac{\\det B}{\\det C}"],
          ],
          [
            ["The two determinants", "两个行列式"],
            t("", ""),
            [
              `\\det B = ${inParens(b[0]![0]!)} \\cdot ${inParens(b[1]![1]!)} - ${inParens(b[0]![1]!)} \\cdot ${inParens(b[1]![0]!)} = ${db}`,
              `\\det C = ${inParens(c[0]![0]!)} \\cdot ${inParens(c[1]![1]!)} - ${inParens(c[0]![1]!)} \\cdot ${inParens(c[1]![0]!)} = ${dc}`,
            ],
          ],
          [["Divide", "相除"], t("", ""), [`\\frac{${db}}{${dc}} = ${answer.toLatex()}`]],
        ],
        t(
          `The reverse change has determinant $${Q.of(dc, db).toLatex()}$, and $${answer.toLatex()} \\cdot ${Q.of(dc, db).toLatex()} = 1$, as two inverse changes must give.`,
          `反向变换的行列式为 $${Q.of(dc, db).toLatex()}$，而 $${answer.toLatex()} \\cdot ${Q.of(dc, db).toLatex()} = 1$，互逆的两个变换理应如此。`,
        ),
      ),
    });
  },
};

const rankFromFormula: KnowledgePointDef = {
  id: "the-rank-of-a-matrix-given-by-a-formula",
  title: t("The rank of a matrix given by a formula", "由公式给出的矩阵的秩"),
  explanation: t(
    "A large matrix can have a small rank when a formula defines its entries. If the entries expand as a sum of terms, each a function of the row times a function of the column, then every column is a combination of the same few column vectors. So the dimension of the span of the columns is at most the number of such terms. For example, $a_{ij} = i + j$ has every column in the span of $(i)$ and $(1)$: column $j$ is $(i) + j(1)$, so the rank is $2$ however large the matrix is.\n\n> **Watch out.** The size of the matrix does not set the rank; count the separate row-times-column terms after expanding, as $(i + j)^2 = i^2 + 2ij + j^2$ has three.",
    '当公式定义矩阵的元素时，大矩阵可以有很小的秩。如果元素能展开为若干项之和，每项是行的函数乘以列的函数，那么每一列都是相同几个列向量的组合。所以各列张成空间的维数至多是这种项的个数。例如，$a_{ij} = i + j$ 的每一列都在 $(i)$ 和 $(1)$ 张成的空间中：第 $j$ 列是 $(i) + j(1)$，所以无论矩阵多大，秩都是 $2$。\n\n> **注意。** 矩阵的尺寸不决定秩；要展开后数出"行的函数乘列的函数"的项数，例如 $(i + j)^2 = i^2 + 2ij + j^2$ 有三项。',
  ),
  generate(rng) {
    const n = rng.int(3, 9);
    const p = nonzero(rng, 6);
    const q = nonzero(rng, 6);
    const kind = rng.int(0, 3);
    const formula = [poly([p, "i"], [q, "j"]), poly([p, "ij"]), "(i + j)^2", "(i - j)^2"][kind] ?? "";
    const answer = [2, 1, 3, 3][kind] ?? 1;
    const en =
      [
        "the vectors $(i)$ and $(1)$, so two vectors span the columns",
        "a multiple of the single vector $(i)$",
        "$i^2$, $i$ and $1$, each times a function of $j$, so three vectors span the columns",
        "$i^2$, $i$ and $1$, each times a function of $j$, so three vectors span the columns",
      ][kind] ?? "";
    const zh =
      [
        "向量 $(i)$ 和 $(1)$，所以两个向量张成各列",
        "单个向量 $(i)$ 的倍数",
        "$i^2$、$i$、$1$ 各乘以 $j$ 的函数，所以三个向量张成各列",
        "$i^2$、$i$、$1$ 各乘以 $j$ 的函数，所以三个向量张成各列",
      ][kind] ?? "";
    return numberProblem({
      prompt: t(
        `The $${n} \\times ${n}$ matrix $A$ has the entries $a_{ij} = ${formula}$. Find its rank.`,
        `一个 $${n} \\times ${n}$ 矩阵的元素是 $a_{ij} = ${formula}$。求它的秩。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          n,
          "The size of the matrix does not set its rank; the formula makes the columns combinations of a few vectors.",
          "矩阵的尺寸不决定秩；公式使各列都是少数几个向量的组合。",
        ),
        why(
          n - 1,
          "The columns are combinations of a fixed few vectors, so the rank does not grow with the size.",
          "各列都是固定几个向量的组合，所以秩不随尺寸增大。",
        ),
        ...(kind >= 2
          ? [
              why(
                2,
                "Expanding the square gives three row-times-column terms, $i^2$, $ij$ and $j^2$, not two.",
                '展开平方得到三个"行乘列"的项 $i^2$、$ij$、$j^2$，而不是两个。',
              ),
            ]
          : kind === 0
            ? [
                why(
                  1,
                  "Column $j$ mixes two different vectors, $(i)$ and $(1)$, with weights that change with $j$, so one vector is not enough.",
                  "第 $j$ 列由两个不同的向量 $(i)$ 与 $(1)$ 组合而成，权重随 $j$ 变化，所以一个向量不够。",
                ),
              ]
            : [
                why(
                  2,
                  "$ij$ is one product of a function of $i$ and a function of $j$, so every column is a multiple of $(i)$.",
                  "$ij$ 是 $i$ 的函数与 $j$ 的函数的一个乘积，所以每一列都是 $(i)$ 的倍数。",
                ),
              ]),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Expand the formula", "展开公式"],
            t(
              `Write $a_{ij} = ${formula}$ as a sum of terms, each a function of $i$ times a function of $j$. Then each column is built from ${en}.`,
              `把 $a_{ij} = ${formula}$ 写成若干项之和，每项是 $i$ 的函数乘 $j$ 的函数。于是每一列由以下部分构成：${zh}。`,
            ),
          ],
          [
            ["Check independence", "检验线性无关"],
            t(
              `The vectors ${answer === 1 ? "$(i)$ is nonzero" : answer === 2 ? "$(i)$ and $(1)$ are not multiples of each other" : "$(i^2)$, $(i)$ and $(1)$ are independent, since a nonzero quadratic in $i$ cannot vanish at the three values $i = 1, 2, 3$"}, and enough columns use each of them, so the rank is exactly the count.`,
              `向量${answer === 1 ? " $(i)$ 非零" : answer === 2 ? " $(i)$ 与 $(1)$ 不成倍数" : " $(i^2)$、$(i)$、$(1)$ 线性无关，因为非零的 $i$ 的二次式不可能在 $i = 1, 2, 3$ 三处都为零"}，且有足够多的列用到它们，所以秩正好等于这个个数。`,
            ),
          ],
        ],
        t(
          `So the rank is $${answer}$ for this $${n} \\times ${n}$ matrix, and it would stay $${answer}$ for any larger size.`,
          `所以这个 $${n} \\times ${n}$ 矩阵的秩是 $${answer}$，尺寸再大秩也仍是 $${answer}$。`,
        ),
      ),
    });
  },
};

const largestNullityOfComposition: KnowledgePointDef = {
  id: "the-largest-nullity-of-a-composition",
  title: t("The largest nullity of a composition", "复合映射最大的零度"),
  explanation: t(
    "A vector is killed by $S \\circ T$ when $T$ kills it, or when $T$ sends it into the kernel of $S$. So the kernel of the composition is made of the kernel of $T$ and those vectors that land in the kernel of $S$. Counting dimensions gives $\\operatorname{null}(S \\circ T) \\le \\operatorname{null}(T) + \\operatorname{null}(S)$. The bound is reached when the image of $T$ contains the whole kernel of $S$, which is possible if the two nullities fit in the space. For example, on a space of dimension $10$, nullities $3$ and $4$ allow $S \\circ T$ a nullity of up to $3 + 4 = 7$.\n\n> **Watch out.** The largest nullity is the sum of the two nullities, not the larger of them.",
    "向量被 $S \\circ T$ 消灭，是当 $T$ 消灭它，或者 $T$ 把它送入 $S$ 的核时。所以复合映射的核由 $T$ 的核和落入 $S$ 的核的那些向量组成。计算维数得 $\\operatorname{null}(S \\circ T) \\le \\operatorname{null}(T) + \\operatorname{null}(S)$。当 $T$ 的像包含 $S$ 的整个核时取到这个上界，只要两个零度之和不超过空间的维数，这就是可能的。例如在 $10$ 维空间上，零度 $3$ 与 $4$ 使 $S \\circ T$ 的零度最多可达 $3 + 4 = 7$。\n\n> **注意。** 最大的零度是两个零度之和，而不是其中较大的那个。",
  ),
  generate(rng) {
    const n = rng.int(5, 15);
    const a = rng.int(1, n - 2);
    const b = rng.int(1, n - a);
    const answer = a + b;
    return numberProblem({
      prompt: t(
        `Linear maps $T$ and $S$ act on a space of dimension ${n}, with $T$ of nullity ${a} and $S$ of nullity ${b}. What is the largest possible nullity of $S \\circ T$?`,
        `线性映射 $T$、$S$ 作用在 ${n} 维空间上，$T$ 的零度是 ${a}，$S$ 的零度是 ${b}。$S \\circ T$ 最大可能的零度是多少？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          Math.max(a, b),
          "That is the smallest possible nullity; vectors sent by $T$ into the kernel of $S$ add to it.",
          "这是最小可能的零度；被 $T$ 送入 $S$ 的核的向量还会增加它。",
        ),
        why(
          Math.min(a, b),
          "The kernel of $S \\circ T$ contains the whole kernel of $T$, so the nullity is at least the larger one.",
          "$S \\circ T$ 的核包含 $T$ 的整个核，所以零度至少是较大的那个。",
        ),
        why(a * b, "Nullities add, they do not multiply: the kernel is built from two pieces.", "零度相加而不是相乘：核由两部分组成。"),
        why(
          n,
          `$T$ has rank $${n - a}$ and only $${b}$ of those dimensions can fall into the kernel of $S$, so not all of the space is killed.`,
          `$T$ 的秩为 $${n - a}$，其中只有 $${b}$ 维能落入 $S$ 的核，所以不会消灭整个空间。`,
        ),
        why(
          n - answer,
          "That is the smallest possible rank of $S \\circ T$, not its largest nullity.",
          "这是 $S \\circ T$ 最小可能的秩，而不是最大的零度。",
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Bound the nullity", "给出零度的上界"],
            t(
              "A vector is killed by $S \\circ T$ when $T$ kills it or sends it into $\\ker S$:",
              "向量被 $S \\circ T$ 消灭，当且仅当 $T$ 消灭它或把它送入 $\\ker S$：",
            ),
            [`\\operatorname{null}(S \\circ T) \\le ${a} + ${b} = ${answer}`],
          ],
          [
            ["Check the bound is reached", "检查能否取到上界"],
            t(
              `$${answer} \\le ${n}$, so $T$ can be chosen with an image of dimension $${n - a}$ that contains the $${b}$-dimensional kernel of $S$.`,
              `$${answer} \\le ${n}$，所以可以选取 $T$，使其 $${n - a}$ 维的像包含 $S$ 的 $${b}$ 维核。`,
            ),
          ],
        ],
        t(
          `Then $S \\circ T$ has rank $${n} - ${answer} = ${n - answer}$, which is not negative, as a rank must be.`,
          `此时 $S \\circ T$ 的秩为 $${n} - ${answer} = ${n - answer}$，不是负数，符合秩的要求。`,
        ),
      ),
    });
  },
};

const rankOfRepeatedDerivative: KnowledgePointDef = {
  id: "the-rank-of-a-repeated-derivative",
  title: t("The rank of a repeated derivative", "重复求导的秩"),
  explanation: t(
    "Differentiation is a linear map on the polynomials of degree at most $n$, a space of dimension $n + 1$ with the powers of $x$ as a basis. Differentiating $k$ times sends $x^j$ to a nonzero multiple of $x^{j - k}$ when $j \\ge k$, and to zero otherwise. So the image is spanned by the powers up to $x^{n - k}$, while the kernel is made of the polynomials of degree below $k$. The dimensions add up to $n + 1$. For example, the second derivative on polynomials of degree at most $4$ kills $1$ and $x$, so its rank is $5 - 2 = 3$, with image spanned by $1, x, x^2$.\n\n> **Watch out.** The space has dimension $n + 1$, not $n$, because the constant term counts.",
    "求导是次数不超过 $n$ 的多项式空间上的线性映射，这个空间的维数是 $n + 1$，以 $x$ 的幂为基。求导 $k$ 次，当 $j \\ge k$ 时把 $x^j$ 映到 $x^{j - k}$ 的非零倍数，否则映到零。所以像由不超过 $x^{n - k}$ 的幂张成，而核由次数低于 $k$ 的多项式组成。两个维数之和是 $n + 1$。例如在次数不超过 $4$ 的多项式上求二阶导数，把 $1$ 和 $x$ 映为零，所以秩为 $5 - 2 = 3$，像由 $1, x, x^2$ 张成。\n\n> **注意。** 这个空间的维数是 $n + 1$ 而不是 $n$，因为常数项也算在内。",
  ),
  generate(rng) {
    const n = rng.int(3, 15);
    const k = rng.int(1, n);
    const answer = n + 1 - k;
    return numberProblem({
      prompt: t(
        `The map $T$ sends each polynomial $p$ of degree at most ${n} to its derivative of order ${k}. Find the rank of $T$.`,
        `映射 $T$ 把每个次数不超过 ${n} 的多项式 $p$ 映到它的 ${k} 阶导数。求 $T$ 的秩。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          n - k,
          `The space has dimension $${n + 1}$, counting the constant term, so start from $${n + 1}$.`,
          `算上常数项，空间的维数是 $${n + 1}$，所以要从 $${n + 1}$ 开始。`,
        ),
        why(n + 1, "That is the whole domain; the polynomials of low degree are sent to $0$.", "这是整个定义域；低次多项式被映为 $0$。"),
        why(n, `Differentiating ${k} times kills $${k}$ dimensions, not just one.`, `求导 ${k} 次消去 $${k}$ 个维数，而不只一个。`),
        why(k, "That is the dimension of the kernel, not the rank.", "这是核的维数，而不是秩。"),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Find the dimension of the domain", "求定义域的维数"],
            t(`The basis is $1, x, \\dots, x^{${n}}$:`, `基为 $1, x, \\dots, x^{${n}}$：`),
            [`\\dim = ${n + 1}`],
          ],
          [
            ["Find the kernel", "求核"],
            t(
              `The polynomials of degree below ${k} have derivative of order ${k} equal to $0$:`,
              `次数低于 ${k} 的多项式的 ${k} 阶导数为 $0$：`,
            ),
            [`\\dim\\ker T = ${k}`],
          ],
          [["Apply rank-nullity", "用秩-零化度定理"], t("", ""), [`\\operatorname{rank} T = ${n + 1} - ${k} = ${answer}`]],
        ],
        n === k
          ? t(
              `The image is the constants, spanned by the derivative of order ${k} of $x^{${n}}$, a nonzero constant: one dimension, matching the rank.`,
              `像是全体常数，由 $x^{${n}}$ 的 ${k} 阶导数（一个非零常数）张成：一维，与秩一致。`,
            )
          : t(
              `The image is spanned by $1, \\dots, x^{${n - k}}$, the derivatives of $x^{${k}}, \\dots, x^{${n}}$: $${n - k + 1}$ polynomials, matching the rank.`,
              `像由 $1, \\dots, x^{${n - k}}$ 张成，它们是 $x^{${k}}, \\dots, x^{${n}}$ 的导数：共 $${n - k + 1}$ 个多项式，与秩一致。`,
            ),
      ),
    });
  },
};

const countingDiagonalForms: KnowledgePointDef = {
  id: "counting-the-diagonal-forms-of-a-matrix",
  title: t("Counting the diagonal forms of a matrix", "计算矩阵的对角形式"),
  explanation: t(
    "A diagonalization $A = PDP^{-1}$ is not unique, because the columns of $P$ can be listed in any order. Reordering them reorders the entries of $D$. So the diagonal matrices similar to $A$ are exactly the arrangements of its eigenvalues along the diagonal, each repeated according to its multiplicity. Equal eigenvalues produce no new matrix when they trade places, so the count is a multinomial coefficient, not a plain factorial. For example, the eigenvalues $1, 1, 2$ give $\\frac{3!}{2! \\, 1!} = 3$ diagonal matrices: $\\operatorname{diag}(1, 1, 2)$, $\\operatorname{diag}(1, 2, 1)$ and $\\operatorname{diag}(2, 1, 1)$.\n\n> **Watch out.** Divide by the factorial of each multiplicity, since swapping equal eigenvalues gives the same matrix. Counting only the distinct eigenvalues, as $3!$, ignores the size of the matrix.",
    "对角化 $A = PDP^{-1}$ 不是唯一的，因为 $P$ 的各列可以按任意顺序排列。重排它们也就重排了 $D$ 的元素。所以与 $A$ 相似的对角矩阵恰好是特征值（按重数重复）沿对角线的各种排列。相等的特征值交换位置不产生新矩阵，所以个数是多项式系数，而不是单纯的阶乘。例如特征值 $1, 1, 2$ 给出 $\\frac{3!}{2! \\, 1!} = 3$ 个对角矩阵：$\\operatorname{diag}(1, 1, 2)$、$\\operatorname{diag}(1, 2, 1)$ 和 $\\operatorname{diag}(2, 1, 1)$。\n\n> **注意。** 要除以每个重数的阶乘，因为交换相等的特征值得到同一个矩阵。只按互异特征值计数得 $3!$，忽略了矩阵的大小。",
  ),
  generate(rng) {
    const [l1, l2, l3] = distinctNonzero(rng, 6, 3) as [number, number, number];
    const m1 = rng.int(1, 4);
    const m2 = rng.int(1, 4);
    const m3 = rng.int(1, 3);
    const n = m1 + m2 + m3;
    const answer = factorial(n) / (factorial(m1) * factorial(m2) * factorial(m3));
    const characteristic = `${rootFactor(l1, m1)}${rootFactor(l2, m2)}${rootFactor(l3, m3)}`;
    return numberProblem({
      prompt: t(
        `A diagonalizable matrix $A$ has characteristic polynomial $${characteristic}$. How many different diagonal matrices are similar to $A$?`,
        `可对角化矩阵 $A$ 的特征多项式是 $${characteristic}$。有多少个不同的对角矩阵与 $A$ 相似？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          factorial(n),
          "That counts swaps of equal eigenvalues as new matrices; divide by the factorial of each multiplicity.",
          "这把相等特征值的交换也算成了新矩阵；要除以每个重数的阶乘。",
        ),
        why(
          6,
          "That arranges only the three distinct eigenvalues; each appears as often as its multiplicity.",
          "这只排列了三个互异特征值；每个特征值要按其重数出现。",
        ),
        why(n, "That is the size of the matrix, not the number of arrangements.", "这是矩阵的阶数，不是排列的个数。"),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Read the multiplicities", "读出重数"],
            t(
              `The eigenvalues $${l1}$, $${l2}$, $${l3}$ appear $${m1}$, $${m2}$ and $${m3}$ times, on a diagonal of length $${n}$.`,
              `特征值 $${l1}$、$${l2}$、$${l3}$ 分别出现 $${m1}$、$${m2}$、$${m3}$ 次，对角线长为 $${n}$。`,
            ),
          ],
          [
            ["Count the arrangements", "数排列"],
            t("Swapping equal eigenvalues gives the same matrix:", "交换相等的特征值得到同一个矩阵："),
            [
              `\\frac{${n}!}{${m1}! \\, ${m2}! \\, ${m3}!} = \\frac{${factorial(n)}}{${factorial(m1) * factorial(m2) * factorial(m3)}} = ${answer}`,
            ],
          ],
        ],
        t(
          `Choose the $${m1}$ places of $${l1}$ in $\\binom{${n}}{${m1}}$ ways, then the $${m2}$ places of $${l2}$ among the rest in $\\binom{${n - m1}}{${m2}}$ ways; the product is $${answer}$.`,
          `先在 $\\binom{${n}}{${m1}}$ 种方式中选 $${l1}$ 的 $${m1}$ 个位置，再在剩下的位置中以 $\\binom{${n - m1}}{${m2}}$ 种方式选 $${l2}$ 的 $${m2}$ 个位置；乘积为 $${answer}$。`,
        ),
      ),
    });
  },
};

const angleInRotationScaling: KnowledgePointDef = {
  id: "the-angle-in-a-rotation-scaling-form",
  figure: linearAlgebraDrawings1["reducing-real-2x2-matrices-to-rotation-scaling-form#the-angle-in-a-rotation-scaling-form"],
  title: t("The angle in a rotation-scaling form", "旋转缩放形式中的角"),
  explanation: t(
    "The matrix with rows $(a, -b)$ and $(b, a)$ is a rotation followed by a scaling. Its scaling factor is $r = \\sqrt{a^2 + b^2}$, and dividing every entry by $r$ leaves the rotation matrix for an angle $\\theta$. Comparing entries gives $\\cos\\theta = \\frac{a}{r}$ and $\\sin\\theta = \\frac{b}{r}$. In terms of eigenvalues, $a \\pm bi = re^{\\pm i\\theta}$, so that this angle is the argument of a complex eigenvalue. For example, rows $(6, -8)$ and $(8, 6)$ give $r = \\sqrt{36 + 64} = 10$, $\\cos\\theta = \\frac{3}{5}$ and $\\sin\\theta = \\frac{4}{5}$.\n\n> **Watch out.** Read $b$ from the bottom left entry: the top right entry is $-b$. Divide by $r$, not by the other entry, which would give $\\tan\\theta$.",
    "行为 $(a, -b)$ 和 $(b, a)$ 的矩阵是一个旋转接一个缩放。它的缩放因子是 $r = \\sqrt{a^2 + b^2}$，把每个元素除以 $r$，就得到角 $\\theta$ 的旋转矩阵。比较元素得 $\\cos\\theta = \\frac{a}{r}$，$\\sin\\theta = \\frac{b}{r}$。用特征值来说，$a \\pm bi = re^{\\pm i\\theta}$，所以这个角就是复特征值的辐角。例如行为 $(6, -8)$ 和 $(8, 6)$ 时，$r = \\sqrt{36 + 64} = 10$，$\\cos\\theta = \\frac{3}{5}$，$\\sin\\theta = \\frac{4}{5}$。\n\n> **注意。** $b$ 要从左下角元素读出：右上角元素是 $-b$。要除以 $r$，而不是除以另一个元素，否则得到的是 $\\tan\\theta$。",
  ),
  generate(rng) {
    const [u, v, w] = rng.pick([
      [3, 4, 5],
      [4, 3, 5],
      [5, 12, 13],
      [12, 5, 13],
      [8, 15, 17],
      [15, 8, 17],
      [7, 24, 25],
      [24, 7, 25],
    ]) as [number, number, number];
    const k = rng.int(1, 4);
    const a = rng.pick([1, -1]) * k * u;
    const b = rng.pick([1, -1]) * k * v;
    const r = k * w;
    const asksCos = rng.pick([true, false]);
    const answer = Q.of(asksCos ? a : b, r);
    const fn = asksCos ? "\\cos\\theta" : "\\sin\\theta";
    return numberProblem({
      prompt: t(
        `The matrix $${mat([
          [a, -b],
          [b, a],
        ])}$ is written as a scaling by $r > 0$ times the rotation through the angle $\\theta$. Find $${fn}$.`,
        `矩阵 $${mat([
          [a, -b],
          [b, a],
        ])}$ 写成缩放 $r > 0$ 乘以转角为 $\\theta$ 的旋转。求 $${fn}$。`,
      ),
      answer,
      mistakes: [
        why(
          Q.of(asksCos ? b : a, r),
          asksCos
            ? "That is $\\sin\\theta$: the cosine comes from the diagonal entry $a$."
            : "That is $\\cos\\theta$: the sine comes from the bottom left entry $b$.",
          asksCos ? "这是 $\\sin\\theta$：余弦来自对角线元素 $a$。" : "这是 $\\cos\\theta$：正弦来自左下角元素 $b$。",
        ),
        why(
          answer.neg(),
          asksCos
            ? "Check the sign: $\\cos\\theta = \\frac{a}{r}$ keeps the sign of $a$."
            : "Check the sign: $b$ is the bottom left entry, not the top right entry $-b$.",
          asksCos ? "检查符号：$\\cos\\theta = \\frac{a}{r}$ 保留 $a$ 的符号。" : "检查符号：$b$ 是左下角元素，不是右上角的 $-b$。",
        ),
        why(
          Q.of(asksCos ? a : b, asksCos ? b : a),
          "Divide by $r = \\sqrt{a^2 + b^2}$, not by the other entry.",
          "要除以 $r = \\sqrt{a^2 + b^2}$，不是除以另一个元素。",
        ),
        why(Q.of(r, asksCos ? a : b), "The fraction is upside down: divide the entry by $r$.", "分数颠倒了：要用元素除以 $r$。"),
      ].filter((w, i, all) => all.findIndex((o) => String(o.value) === String(w.value)) === i),
      solution: walked(
        [
          [
            ["Read a and b", "读出 a 和 b"],
            t(
              `The diagonal gives $a = ${a}$ and the bottom left entry gives $b = ${b}$.`,
              `对角线给出 $a = ${a}$，左下角元素给出 $b = ${b}$。`,
            ),
          ],
          [["Find the scaling factor", "求缩放因子"], t("", ""), [`r = \\sqrt{${a * a} + ${b * b}} = \\sqrt{${r * r}} = ${r}`]],
          [["Divide by r", "除以 r"], t("", ""), [`${fn} = \\frac{${asksCos ? a : b}}{${r}} = ${answer.toLatex()}`]],
        ],
        t(
          `$\\cos^2\\theta + \\sin^2\\theta = \\frac{${a * a} + ${b * b}}{${r * r}} = 1$, as it must be.`,
          `$\\cos^2\\theta + \\sin^2\\theta = \\frac{${a * a} + ${b * b}}{${r * r}} = 1$，符合要求。`,
        ),
      ),
    });
  },
};

const generalizedEigenspaceDimension: KnowledgePointDef = {
  id: "the-dimension-of-a-generalized-eigenspace",
  title: t("The dimension of a generalized eigenspace", "广义特征空间的维数"),
  explanation: t(
    "The ordinary eigenspace of $\\lambda$ may be too small to match the multiplicity of $\\lambda$ in the characteristic polynomial, and this is what stops a matrix from being diagonalizable. The generalized eigenspace, the vectors killed by some power of $A - \\lambda I$, repairs the shortage. Its dimension always equals the algebraic multiplicity. So the characteristic polynomial alone decides this dimension, and the size of the ordinary eigenspace has no effect on it. For example, if $(\\lambda - 2)^4$ divides the characteristic polynomial exactly, the generalized eigenspace of $2$ has dimension $4$, whether the eigenspace has dimension $1$, $2$ or more.\n\n> **Watch out.** The dimension of the eigenspace is the number of Jordan blocks, not the dimension of the generalized eigenspace. Read the exponent of the factor, not the size of the matrix.",
    "$\\lambda$ 的普通特征空间可能太小，配不上 $\\lambda$ 在特征多项式中的重数，这正是矩阵不能对角化的原因。广义特征空间，即被 $A - \\lambda I$ 的某个幂消灭的向量，弥补了这一不足。它的维数总是等于代数重数。所以仅由特征多项式就能决定这个维数，普通特征空间的大小对它没有影响。例如特征多项式恰含因子 $(\\lambda - 2)^4$ 时，$2$ 的广义特征空间维数是 $4$，不管特征空间的维数是 $1$、$2$ 还是更大。\n\n> **注意。** 特征空间的维数是若尔当块的个数，不是广义特征空间的维数。要读因子的指数，而不是矩阵的大小。",
  ),
  generate(rng) {
    const [l1, l2, l3] = distinctNonzero(rng, 7, 3) as [number, number, number];
    const m1 = rng.int(2, 5);
    const m2 = rng.int(1, 4);
    const m3 = rng.int(1, 3);
    const n = m1 + m2 + m3;
    const geometric = rng.int(1, m1 - 1);
    return numberProblem({
      prompt: t(
        `A $${n} \\times ${n}$ matrix has characteristic polynomial $${rootFactor(l1, m1)}${rootFactor(l2, m2)}${rootFactor(l3, m3)}$, and the eigenvalue $${l1}$ has an eigenspace of dimension ${geometric}. Find the dimension of the generalized eigenspace of $${l1}$.`,
        `一个 $${n} \\times ${n}$ 矩阵的特征多项式是 $${rootFactor(l1, m1)}${rootFactor(l2, m2)}${rootFactor(l3, m3)}$，特征值 $${l1}$ 的特征空间维数是 ${geometric}。求 $${l1}$ 的广义特征空间的维数。`,
      ),
      answer: m1,
      form: "integer",
      mistakes: [
        why(
          geometric,
          "That is the dimension of the ordinary eigenspace, the number of Jordan blocks.",
          "这是普通特征空间的维数，即若尔当块的个数。",
        ),
        why(
          n,
          "That is the size of the whole matrix; only the factor of this eigenvalue counts.",
          "这是整个矩阵的大小；只算这个特征值的因子。",
        ),
        why(
          m1 - geometric,
          "The generalized eigenspace contains the eigenspace; nothing is subtracted.",
          "广义特征空间包含特征空间，不需要减去什么。",
        ),
        why(m1 + 1, "The dimension equals the exponent of the factor exactly.", "维数恰好等于因子的指数。"),
        why(n - m1, "That counts the other eigenvalues.", "这数的是其他特征值。"),
      ].filter((w, i, all) => w.value !== m1 && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Read the multiplicity", "读出重数"],
            t(
              `The factor $${rootFactor(l1, m1)}$ shows that $${l1}$ has algebraic multiplicity $${m1}$.`,
              `因子 $${rootFactor(l1, m1)}$ 表明 $${l1}$ 的代数重数是 $${m1}$。`,
            ),
          ],
          [
            ["Ignore the eigenspace", "不必看特征空间"],
            t(
              `The generalized eigenspace always has dimension equal to the algebraic multiplicity, so the eigenspace of dimension ${geometric} only tells how many Jordan blocks there are. The dimension is $${m1}$.`,
              `广义特征空间的维数总是等于代数重数，维数为 ${geometric} 的特征空间只说明有几个若尔当块。所求维数是 $${m1}$。`,
            ),
          ],
        ],
        t(
          `The generalized eigenspaces fill the whole space: $${m1} + ${m2} + ${m3} = ${n}$.`,
          `各广义特征空间合起来就是整个空间：$${m1} + ${m2} + ${m3} = ${n}$。`,
        ),
      ),
    });
  },
};

const countingJordanForms: KnowledgePointDef = {
  id: "counting-jordan-forms-with-a-given-characteristic-polynomial",
  title: t("Counting Jordan forms with a given characteristic polynomial", "计算给定特征多项式的若尔当形"),
  explanation: t(
    "The Jordan form of a matrix is decided, up to the order of its blocks, by the block sizes for each eigenvalue. The sizes for an eigenvalue of multiplicity $m$ form a partition of $m$, and there are $1, 2, 3, 5, 7$ partitions of the numbers $1$ to $5$. The choices for different eigenvalues are independent, so these counts multiply. The result counts the similarity classes of matrices with that characteristic polynomial. For example, $(\\lambda - 1)^3(\\lambda - 4)^2$ allows $3$ choices for the eigenvalue $1$ (sizes $3$; $2, 1$; $1, 1, 1$) and $2$ for the eigenvalue $4$, so $3 \\cdot 2 = 6$ Jordan forms.\n\n> **Watch out.** Multiply the counts, do not add them: each choice for one eigenvalue goes with every choice for the other.",
    "矩阵的若尔当形由每个特征值的块大小决定（不计块的顺序）。重数为 $m$ 的特征值的块大小构成 $m$ 的一个分拆，数 $1$ 到 $5$ 的分拆个数分别是 $1, 2, 3, 5, 7$。不同特征值的选择彼此独立，所以这些个数相乘。结果就是具有该特征多项式的矩阵的相似类个数。例如 $(\\lambda - 1)^3(\\lambda - 4)^2$ 中，特征值 $1$ 有 $3$ 种选择（大小 $3$；$2, 1$；$1, 1, 1$），特征值 $4$ 有 $2$ 种，所以共 $3 \\cdot 2 = 6$ 种若尔当形。\n\n> **注意。** 个数要相乘，不是相加：一个特征值的每种选择都可以与另一个特征值的每种选择搭配。",
  ),
  generate(rng) {
    const partitions = [0, 1, 2, 3, 5, 7];
    const [l1, l2] = distinctNonzero(rng, 9, 2) as [number, number];
    const m1 = rng.int(2, 5);
    const m2 = rng.int(1, 5);
    const c1 = partitions[m1] ?? 1;
    const c2 = partitions[m2] ?? 1;
    const answer = c1 * c2;
    return numberProblem({
      prompt: t(
        `How many different Jordan forms, ignoring the order of the blocks, can a matrix with characteristic polynomial $${rootFactor(l1, m1)}${rootFactor(l2, m2)}$ have?`,
        `特征多项式为 $${rootFactor(l1, m1)}${rootFactor(l2, m2)}$ 的矩阵可以有多少种不同的若尔当形（不计块的顺序）？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(c1 + c2, "The choices are independent, so the counts multiply rather than add.", "各选择彼此独立，所以个数相乘，而不是相加。"),
        why(
          m1 * m2,
          "Count the partitions of each multiplicity, not the multiplicities themselves.",
          "要数每个重数的分拆个数，而不是重数本身。",
        ),
        why(m1 + m2, "That is the size of the matrix, not the number of Jordan forms.", "这是矩阵的大小，不是若尔当形的个数。"),
        why(
          answer + 1,
          "Count the partitions again: there are $1, 2, 3, 5, 7$ partitions of $1$ to $5$.",
          "重新数分拆：$1$ 到 $5$ 的分拆个数是 $1, 2, 3, 5, 7$。",
        ),
        why(answer * 2, "The order of the blocks does not matter, so each partition counts once.", "块的顺序不计，所以每个分拆只算一次。"),
        why(
          answer + 2,
          "Count the partitions again: there are $1, 2, 3, 5, 7$ partitions of $1$ to $5$.",
          "重新数分拆：$1$ 到 $5$ 的分拆个数是 $1, 2, 3, 5, 7$。",
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Count for each eigenvalue", "对每个特征值计数"],
            t(
              `The block sizes for $${l1}$ form a partition of $${m1}$, which has ${c1} partitions; those for $${l2}$ form a partition of $${m2}$, which has ${c2}.`,
              `$${l1}$ 的块大小构成 $${m1}$ 的一个分拆，共 ${c1} 个；$${l2}$ 的块大小构成 $${m2}$ 的一个分拆，共 ${c2} 个。`,
            ),
          ],
          [["Multiply", "相乘"], t("The choices are independent:", "这些选择彼此独立："), [`${c1} \\cdot ${c2} = ${answer}`]],
        ],
        t(
          `Fixing the blocks of $${l2}$ leaves ${c1} forms, one for each partition of $${m1}$; doing this for each of the ${c2} partitions of $${m2}$ gives $${answer}$ in all.`,
          `固定 $${l2}$ 的块后，剩下 ${c1} 种形式，每个 $${m1}$ 的分拆对应一种；对 $${m2}$ 的 ${c2} 个分拆各做一次，共得 $${answer}$ 种。`,
        ),
      ),
    });
  },
};

const traceInnerProduct: KnowledgePointDef = {
  id: "the-trace-inner-product-of-two-matrices",
  title: t("The trace inner product of two matrices", "两个矩阵的迹内积"),
  explanation: t(
    "The formula $\\langle A, B \\rangle = \\operatorname{tr}(A^TB)$ makes the space of matrices into an inner product space. Each diagonal entry of $A^TB$ is the dot product of a column of $A$ with the matching column of $B$, so the trace adds up the products of all the matching entries. So this is just the usual dot product with the matrices written out as long vectors, and it does not need the matrix product to be computed in full. For example, $A = \\begin{pmatrix} 1 & 2 \\\\ 0 & -1 \\end{pmatrix}$ and $B = \\begin{pmatrix} 3 & 1 \\\\ 4 & 2 \\end{pmatrix}$ give $\\langle A, B \\rangle = 3 + 2 + 0 - 2 = 3$.\n\n> **Watch out.** The transpose matters: $\\operatorname{tr}(AB)$ multiplies rows of $A$ by columns of $B$ and is a different number in general. Neither is it the product of the two traces.",
    "公式 $\\langle A, B \\rangle = \\operatorname{tr}(A^TB)$ 使矩阵空间成为内积空间。$A^TB$ 的每个对角元是 $A$ 的一列与 $B$ 对应列的点积，所以迹把所有对应元素之积加起来。因此这就是把矩阵写成长向量后通常的点积，不需要完整计算矩阵乘积。例如 $A = \\begin{pmatrix} 1 & 2 \\\\ 0 & -1 \\end{pmatrix}$ 与 $B = \\begin{pmatrix} 3 & 1 \\\\ 4 & 2 \\end{pmatrix}$ 给出 $\\langle A, B \\rangle = 3 + 2 + 0 - 2 = 3$。\n\n> **注意。** 转置不能省：$\\operatorname{tr}(AB)$ 是 $A$ 的行乘 $B$ 的列，一般是另一个数。它也不是两个迹的乘积。",
  ),
  generate(rng) {
    const entry = () => rng.int(-5, 5);
    const a = [
      [entry(), entry()],
      [entry(), entry()],
    ];
    const b = [
      [entry(), entry()],
      [entry(), entry()],
    ];
    const aFlat = a.flat();
    const bFlat = b.flat();
    const answer = dot(aFlat, bFlat);
    const traceOfProduct = sumOfDiagonal(times(a, b));
    const terms = aFlat.map((x, i) => `${inParens(x)} \\cdot ${inParens(bFlat[i] ?? 0)}`).join(" + ");
    return numberProblem({
      prompt: t(
        `With the inner product $\\langle A, B \\rangle = \\operatorname{tr}(A^TB)$, find $\\langle A, B \\rangle$ for $A = ${mat(a)}$ and $B = ${mat(b)}$.`,
        `使用内积 $\\langle A, B \\rangle = \\operatorname{tr}(A^TB)$，对 $A = ${mat(a)}$ 和 $B = ${mat(b)}$ 求 $\\langle A, B \\rangle$。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          traceOfProduct,
          "That is $\\operatorname{tr}(AB)$; the transpose of $A$ is missing.",
          "这是 $\\operatorname{tr}(AB)$；漏掉了 $A$ 的转置。",
        ),
        why(
          sumOfDiagonal(a) * sumOfDiagonal(b),
          "That multiplies the two traces; the inner product pairs every entry of $A$ with the matching entry of $B$.",
          "这是两个迹相乘；内积要把 $A$ 的每个元素与 $B$ 的对应元素配对。",
        ),
        why(-answer, "The sign is flipped; recheck the products of negative entries.", "符号反了；检查负元素的乘积。"),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Pair the matching entries", "对应元素配对"],
            t(
              "Each diagonal entry of $A^TB$ is a column of $A$ dotted with the same column of $B$, so the trace pairs every entry with its partner:",
              "$A^TB$ 的每个对角元是 $A$ 的一列与 $B$ 同一列的点积，所以迹把每个元素与对应元素配对：",
            ),
            [`\\langle A, B \\rangle = ${terms}`],
          ],
          [["Add", "相加"], t("", ""), [`\\langle A, B \\rangle = ${answer}`]],
        ],
        t(
          `The diagonal of $A^TB$ is $${dot([a[0]![0]!, a[1]![0]!], [b[0]![0]!, b[1]![0]!])}$ and $${dot([a[0]![1]!, a[1]![1]!], [b[0]![1]!, b[1]![1]!])}$, whose sum is $${answer}$.`,
          `$A^TB$ 的对角元为 $${dot([a[0]![0]!, a[1]![0]!], [b[0]![0]!, b[1]![0]!])}$ 与 $${dot([a[0]![1]!, a[1]![1]!], [b[0]![1]!, b[1]![1]!])}$，其和为 $${answer}$。`,
        ),
      ),
    });
  },
};

const scalarInComplexInnerProduct: KnowledgePointDef = {
  id: "pulling-a-scalar-out-of-a-complex-inner-product",
  title: t("Pulling a scalar out of a complex inner product", "从复内积中提出标量"),
  explanation: t(
    "A complex inner product treats its two slots differently. Under the convention that it is linear in the first slot, a scalar comes out of that slot unchanged, but it comes out of the second slot conjugated. Swapping the two vectors also conjugates the value. These rules are needed to keep $\\langle \\mathbf{v}, \\mathbf{v} \\rangle$ real and positive. Some books use the opposite convention, which is why the slot that is linear must always be stated. For example, if $\\langle \\mathbf{u}, \\mathbf{v} \\rangle = 1 + 2i$, then $\\langle \\mathbf{u}, i\\mathbf{v} \\rangle = \\bar{i}(1 + 2i) = -i(1 + 2i) = 2 - i$.\n\n> **Watch out.** Conjugate the scalar only when it leaves the second slot, and conjugate the whole value when the two vectors swap places. Then multiply out with $i^2 = -1$.",
    "复内积对两个位置的处理不同。按第一个位置线性的约定，标量从这个位置提出时不变，但从第二个位置提出时要取共轭。交换两个向量也使值取共轭。这些规则是为了保持 $\\langle \\mathbf{v}, \\mathbf{v} \\rangle$ 为正实数。有些书使用相反的约定，所以必须说明哪个位置是线性的。例如若 $\\langle \\mathbf{u}, \\mathbf{v} \\rangle = 1 + 2i$，则 $\\langle \\mathbf{u}, i\\mathbf{v} \\rangle = \\bar{i}(1 + 2i) = -i(1 + 2i) = 2 - i$。\n\n> **注意。** 只有标量从第二个位置提出时才取共轭；两个向量交换位置时整个值取共轭。然后用 $i^2 = -1$ 展开。",
  ),
  generate(rng) {
    const a = nonzero(rng, 6);
    const b = nonzero(rng, 6);
    const p = nonzero(rng, 5);
    const q = nonzero(rng, 5);
    const kind = rng.int(0, 2);
    const scalar = poly([p, ""], [q, "i"]);
    const value = poly([a, ""], [b, "i"]);
    const straight = [p * a - q * b, p * b + q * a];
    const conjugated = [p * a + q * b, p * b - q * a];
    const [re, im] = (kind === 0 ? straight : kind === 1 ? conjugated : [straight[0], -(straight[1] ?? 0)]) as [number, number];
    const asksReal = kind === 0 ? rng.pick([true, false]) : false;
    const answer = asksReal ? re : im;
    const expression =
      [
        `\\langle (${scalar})\\mathbf{u}, \\mathbf{v} \\rangle`,
        `\\langle \\mathbf{u}, (${scalar})\\mathbf{v} \\rangle`,
        `\\langle \\mathbf{v}, (${scalar})\\mathbf{u} \\rangle`,
      ][kind] ?? "";
    const reason =
      [
        "The scalar comes out of the first slot unchanged",
        "The scalar comes out of the second slot conjugated",
        "Swapping the slots conjugates the whole value of the inner product with the scalar in the first slot",
      ][kind] ?? "";
    const reasonZh =
      ["标量从第一个位置提出时不变", "标量从第二个位置提出时取共轭", "交换位置使标量在第一个位置时的内积值整体取共轭"][kind] ?? "";
    return numberProblem({
      prompt: t(
        `A complex inner product is linear in its first slot, and $\\langle \\mathbf{u}, \\mathbf{v} \\rangle = ${value}$. Write $${expression} = x + yi$. Find ${asksReal ? "$x$" : "$y$"}.`,
        `一个复内积对第一个位置是线性的，且 $\\langle \\mathbf{u}, \\mathbf{v} \\rangle = ${value}$。写成 $${expression} = x + yi$。求 ${asksReal ? "$x$" : "$y$"}。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(-answer, "The sign is flipped; recheck $i^2 = -1$ and the conjugations.", "符号反了；检查 $i^2 = -1$ 与共轭。"),
        why(
          asksReal ? (conjugated[0] ?? 0) : kind === 0 ? (conjugated[1] ?? 0) : (straight[1] ?? 0),
          kind === 0
            ? "That conjugates the scalar, but it comes out of the first slot unchanged."
            : kind === 1
              ? "That leaves the scalar as it is, but it comes out of the second slot conjugated."
              : "That forgets that swapping the two vectors conjugates the value.",
          kind === 0
            ? "这是把标量取了共轭，但它从第一个位置提出时不变。"
            : kind === 1
              ? "这是没有取共轭，但标量从第二个位置提出时要取共轭。"
              : "这是忘了交换两个向量会使值取共轭。",
        ),
        why(
          asksReal ? im : re,
          `That is the ${asksReal ? "imaginary" : "real"} part; the question asks for the ${asksReal ? "real" : "imaginary"} part.`,
          `这是${asksReal ? "虚部" : "实部"}；题目问的是${asksReal ? "实部" : "虚部"}。`,
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Take the scalar out", "提出标量"],
            t(`${reason}:`, `${reasonZh}：`),
            [
              [
                `${expression} = (${scalar})(${value})`,
                `${expression} = (${poly([p, ""], [-q, "i"])})(${value})`,
                `${expression} = \\overline{(${scalar})(${value})}`,
              ][kind] ?? "",
            ],
          ],
          [["Multiply out", "展开"], t("Using $i^2 = -1$:", "利用 $i^2 = -1$："), [`${expression} = ${poly([re, ""], [im, "i"])}`]],
        ],
        t(
          `So ${asksReal ? "$x$" : "$y$"} is $${answer}$. The size checks out: $${inParens(re)}^2 + ${inParens(im)}^2 = ${re * re + im * im} = (${p * p + q * q})(${a * a + b * b})$, the product of $|${scalar}|^2$ and $|${value}|^2$.`,
          `所以 ${asksReal ? "$x$" : "$y$"} 是 $${answer}$。模长也对得上：$${inParens(re)}^2 + ${inParens(im)}^2 = ${re * re + im * im} = (${p * p + q * q})(${a * a + b * b})$，即 $|${scalar}|^2$ 与 $|${value}|^2$ 之积。`,
        ),
      ),
    });
  },
};

const traceOfReflection: KnowledgePointDef = {
  id: "the-trace-of-a-reflection-through-a-subspace",
  figure:
    linearAlgebraDrawings2[
      "projecting-vectors-onto-subspaces-in-euclidean-spaces-orthogonal-bases#the-trace-of-a-reflection-through-a-subspace"
    ],
  title: t("The trace of a reflection through a subspace", "关于子空间的反射的迹"),
  explanation: t(
    "The orthogonal projection $P$ onto a subspace has the eigenvalue 1 on the subspace and 0 on its orthogonal complement. The reflection through the subspace is $R = 2P - I$, which keeps the subspace and reverses its complement, so that its eigenvalues are $1$ and $-1$. Since the trace is the sum of the eigenvalues, it counts the dimension of the subspace minus that of its complement, with no need to know any entry of the matrix. For example, the reflection of $\\mathbb{R}^{5}$ through a plane has eigenvalues $1, 1, -1, -1, -1$ and trace $2 - 3 = -1$.\n\n> **Watch out.** The complement is reversed, not sent to zero: it contributes $-1$ for each of its dimensions, so the trace is $2k - n$, not $k$. Equivalently $\\operatorname{tr}(R) = 2\\operatorname{tr}(P) - \\operatorname{tr}(I)$.",
    "到子空间的正交投影 $P$ 在子空间上特征值为 1，在其正交补上特征值为 0。关于子空间的反射是 $R = 2P - I$，它保持子空间不动，把正交补反向，所以特征值是 $1$ 和 $-1$。由于迹是特征值之和，它等于子空间的维数减去其正交补的维数，不需要知道矩阵的任何元素。例如 $\\mathbb{R}^{5}$ 关于一个平面的反射的特征值是 $1, 1, -1, -1, -1$，迹为 $2 - 3 = -1$。\n\n> **注意。** 正交补被反向，而不是变为零：它的每一维贡献 $-1$，所以迹是 $2k - n$，而不是 $k$。也可以写成 $\\operatorname{tr}(R) = 2\\operatorname{tr}(P) - \\operatorname{tr}(I)$。",
  ),
  generate(rng) {
    const n = rng.int(3, 15);
    const k = rng.int(1, n - 1);
    const answer = 2 * k - n;
    return numberProblem({
      prompt: t(
        `Let $R$ be the reflection of $\\mathbb{R}^{${n}}$ through a subspace of dimension ${k}, so that $R = 2P - I$ with $P$ the orthogonal projection onto the subspace. Find the trace of $R$.`,
        `设 $R$ 是 $\\mathbb{R}^{${n}}$ 关于 ${k} 维子空间的反射，即 $R = 2P - I$，其中 $P$ 是到该子空间的正交投影。求 $R$ 的迹。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(-answer, "That is the trace of $I - 2P$, the reflection through the complement.", "这是 $I - 2P$ 的迹，即关于正交补的反射。"),
        why(
          2 * k,
          "That is $\\operatorname{tr}(2P)$; subtracting $I$ also subtracts its trace.",
          "这是 $\\operatorname{tr}(2P)$；减去 $I$ 也要减去它的迹。",
        ),
        why(
          k,
          "That is the trace of $P$, which sends the complement to zero; $R$ reverses it instead.",
          "这是 $P$ 的迹，$P$ 把正交补变为零；而 $R$ 把它反向。",
        ),
        why(n - k, "That is the dimension of the complement alone.", "这只是正交补的维数。"),
        why(
          2 * k + n,
          "That adds $\\operatorname{tr}(I)$; the reflection is $2P - I$, so it is subtracted.",
          "这是加上了 $\\operatorname{tr}(I)$；反射是 $2P - I$，应当减去。",
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Count the eigenvalues", "数出特征值"],
            t(
              `$R$ keeps the ${k}-dimensional subspace and reverses its ${n - k}-dimensional complement: the eigenvalue $1$ occurs ${k} ${k === 1 ? "time" : "times"} and the eigenvalue $-1$ occurs ${n - k} ${n - k === 1 ? "time" : "times"}.`,
              `$R$ 保持 ${k} 维子空间不动，把 ${n - k} 维的正交补反向：特征值 $1$ 出现 ${k} 次，特征值 $-1$ 出现 ${n - k} 次。`,
            ),
          ],
          [["Add them", "求和"], t("", ""), [`\\operatorname{tr}(R) = ${k} - ${n - k} = ${answer}`]],
        ],
        t(
          `From $R = 2P - I$: $\\operatorname{tr}(R) = 2 \\cdot ${k} - ${n} = ${answer}$.`,
          `由 $R = 2P - I$：$\\operatorname{tr}(R) = 2 \\cdot ${k} - ${n} = ${answer}$。`,
        ),
      ),
    });
  },
};

const determinantFromQr: KnowledgePointDef = {
  id: "the-determinant-from-a-qr-factorization",
  title: t("The determinant from a QR factorization", "由 QR 分解求行列式"),
  explanation: t(
    "In a factorization $A = QR$ of a square matrix, $Q$ is orthogonal, so that its determinant is $1$ or $-1$, and $R$ is upper triangular, so that its determinant is the product of its diagonal entries. Together these give the absolute value of $\\det A$, but they do not need any of the entries above the diagonal. Geometrically, the diagonal entries of $R$ are the lengths left over after each step of the Gram-Schmidt process. For example, if $R$ has diagonal entries $2, 3, 4$, then $|\\det A| = 2 \\cdot 3 \\cdot 4 = 24$, whatever stands above the diagonal.\n\n> **Watch out.** Multiply the diagonal entries; do not add them, and leave out the entries above the diagonal. Squaring gives $\\det(A^{T}A)$, not $|\\det A|$.",
    "在方阵的分解 $A = QR$ 中，$Q$ 是正交矩阵，行列式是 $1$ 或 $-1$，$R$ 是上三角矩阵，行列式是对角元之积。两者合起来给出 $\\det A$ 的绝对值，不需要对角线上方的任何元素。从几何上看，$R$ 的对角元是格拉姆-施密特过程每一步后剩下的长度。例如 $R$ 的对角元为 $2, 3, 4$ 时，无论对角线上方是什么，$|\\det A| = 2 \\cdot 3 \\cdot 4 = 24$。\n\n> **注意。** 要把对角元相乘，不是相加，也不要算进对角线上方的元素。平方得到的是 $\\det(A^{T}A)$，而不是 $|\\det A|$。",
  ),
  generate(rng) {
    const [r1, r2, r3] = [rng.int(1, 9), rng.int(1, 9), rng.int(2, 9)];
    const [p, q, s] = [nonzero(rng, 6), nonzero(rng, 6), nonzero(rng, 6)];
    const answer = r1 * r2 * r3;
    return numberProblem({
      prompt: t(
        `A $3 \\times 3$ matrix $A$ has the factorization $A = QR$ with $Q$ orthogonal and $R = ${mat([
          [r1, p, q],
          [0, r2, s],
          [0, 0, r3],
        ])}$. Find $|\\det A|$.`,
        `$3 \\times 3$ 矩阵 $A$ 有分解 $A = QR$，其中 $Q$ 是正交矩阵，$R = ${mat([
          [r1, p, q],
          [0, r2, s],
          [0, 0, r3],
        ])}$。求 $|\\det A|$。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          r1 + r2 + r3,
          "That adds the diagonal entries; the determinant of a triangular matrix is their product.",
          "这是把对角元相加；三角矩阵的行列式是对角元之积。",
        ),
        why(
          answer * Math.abs(p),
          p < 0
            ? `That also multiplies in $|${p}| = ${-p}$, the size of the entry above the diagonal, which does not affect $\\det R$.`
            : `That also multiplies in the entry $${p}$ above the diagonal, which does not affect $\\det R$.`,
          p < 0
            ? `这还乘上了对角线上方元素的绝对值 $|${p}| = ${-p}$，它不影响 $\\det R$。`
            : `这还乘上了对角线上方的元素 $${p}$，它不影响 $\\det R$。`,
        ),
        why(
          answer * Math.abs(p * q * s),
          "That multiplies all the nonzero entries; only the diagonal counts for a triangular matrix.",
          "这是把所有非零元素相乘；三角矩阵只看对角元。",
        ),
        why(
          answer * answer,
          "That is $(\\det R)^{2} = \\det(A^{T}A)$; since $|\\det Q| = 1$, $|\\det A|$ is $\\det R$ itself.",
          "这是 $(\\det R)^{2} = \\det(A^{T}A)$；由于 $|\\det Q| = 1$，$|\\det A|$ 就是 $\\det R$。",
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Use that Q is orthogonal", "利用 Q 是正交矩阵"],
            t(
              "$Q^{T}Q = I$ gives $(\\det Q)^{2} = 1$, so $|\\det Q| = 1$ and $|\\det A| = |\\det Q|\\,|\\det R| = |\\det R|$.",
              "由 $Q^{T}Q = I$ 得 $(\\det Q)^{2} = 1$，所以 $|\\det Q| = 1$，$|\\det A| = |\\det Q|\\,|\\det R| = |\\det R|$。",
            ),
          ],
          [
            ["Multiply the diagonal of R", "把 R 的对角元相乘"],
            t("$R$ is upper triangular, so only its diagonal counts:", "$R$ 是上三角矩阵，所以只看对角元："),
            [`\\det R = ${r1} \\cdot ${r2} \\cdot ${r3} = ${answer}`],
          ],
        ],
        t(
          `Expanding $\\det R$ down the first column gives $${r1}\\left(${r2} \\cdot ${r3} - (${s}) \\cdot 0\\right) = ${answer}$; the entries $${p}$, $${q}$, $${s}$ above the diagonal drop out.`,
          `沿第一列展开 $\\det R$，得 $${r1}\\left(${r2} \\cdot ${r3} - (${s}) \\cdot 0\\right) = ${answer}$；对角线上方的元素 $${p}$、$${q}$、$${s}$ 都消失了。`,
        ),
      ),
    });
  },
};

const squareRootOfSymmetric: KnowledgePointDef = {
  id: "an-entry-of-the-positive-square-root-of-a-symmetric-matrix",
  title: t("An entry of the positive square root of a symmetric matrix", "对称矩阵正平方根的元素"),
  explanation: t(
    "The spectral theorem writes a symmetric matrix as $\\lambda_1P_1 + \\lambda_2P_2$, where $P_1$ and $P_2$ are the orthogonal projections onto the eigenspaces. Since $P_1P_2 = 0$ and each $P_i^2 = P_i$, a function can be applied through the eigenvalues alone. So the positive square root of a matrix with positive eigenvalues is $\\sqrt{\\lambda_1}P_1 + \\sqrt{\\lambda_2}P_2$. Each projection is $\\frac{\\mathbf{v}\\mathbf{v}^T}{\\mathbf{v}^T\\mathbf{v}}$ for an eigenvector $\\mathbf{v}$. For example, if $A$ has eigenvalue $9$ on $(1, 1)$ and $1$ on $(-1, 1)$, then $P_1 = \\frac{1}{2}\\begin{pmatrix} 1 & 1 \\\\ 1 & 1 \\end{pmatrix}$, $P_2 = \\frac{1}{2}\\begin{pmatrix} 1 & -1 \\\\ -1 & 1 \\end{pmatrix}$, and the square root is $3P_1 + P_2 =\\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}$, whose square is $\\begin{pmatrix} 5 & 4 \\\\ 4 & 5 \\end{pmatrix} = A$.\n\n> **Watch out.** Take the square roots of the eigenvalues, not the eigenvalues themselves, and keep each root with the projection onto its own eigenvector.",
    "谱定理把对称矩阵写成 $\\lambda_1P_1 + \\lambda_2P_2$，其中 $P_1$、$P_2$ 是到特征空间的正交投影。由于 $P_1P_2 = 0$ 且 $P_i^2 = P_i$，函数可以只通过特征值作用。所以特征值为正的矩阵的正平方根是 $\\sqrt{\\lambda_1}P_1 + \\sqrt{\\lambda_2}P_2$。对特征向量 $\\mathbf{v}$，每个投影是 $\\frac{\\mathbf{v}\\mathbf{v}^T}{\\mathbf{v}^T\\mathbf{v}}$。例如若 $A$ 在 $(1, 1)$ 上的特征值为 $9$，在 $(-1, 1)$ 上的特征值为 $1$，则 $P_1 = \\frac{1}{2}\\begin{pmatrix} 1 & 1 \\\\ 1 & 1 \\end{pmatrix}$，$P_2 = \\frac{1}{2}\\begin{pmatrix} 1 & -1 \\\\ -1 & 1 \\end{pmatrix}$，平方根为 $3P_1 + P_2 =\\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}$，它的平方是 $\\begin{pmatrix} 5 & 4 \\\\ 4 & 5 \\end{pmatrix} = A$。\n\n> **注意。** 要取特征值的平方根，而不是特征值本身，并且每个平方根要配上它自己特征向量的投影。",
  ),
  generate(rng) {
    const [p, q] = rng.pick([
      [1, 1],
      [1, -1],
      [1, 2],
      [2, 1],
      [1, -2],
      [2, -1],
      [1, 3],
      [3, 1],
      [2, 3],
      [3, 2],
    ]) as [number, number];
    const s = rng.int(1, 9);
    const u = rng.pick(range1to9.filter((v) => v !== s));
    const norm = p * p + q * q;
    const diagonal = rng.pick([true, false]);
    const answer = diagonal ? Q.of(s * p * p + u * q * q, norm) : Q.of((s - u) * p * q, norm);
    const position = diagonal ? ["row 1, column 1", "第 1 行第 1 列"] : ["row 1, column 2", "第 1 行第 2 列"];
    return numberProblem({
      prompt: t(
        `A symmetric matrix $A$ has the eigenvalue ${s * s} with eigenvector $${col(p, q)}$ and the eigenvalue ${u * u} with eigenvector $${col(-q, p)}$. Find the entry in ${position[0]} of the positive square root of $A$.`,
        `对称矩阵 $A$ 有特征值 ${s * s}，特征向量为 $${col(p, q)}$，还有特征值 ${u * u}，特征向量为 $${col(-q, p)}$。求 $A$ 的正平方根${position[1]}的元素。`,
      ),
      answer,
      wrong: [
        diagonal ? Q.of(s * s * p * p + u * u * q * q, norm) : Q.of((s * s - u * u) * p * q, norm),
        diagonal ? Q.of(s * q * q + u * p * p, norm) : Q.of((u - s) * p * q, norm),
        Q.of(s + u, 2),
      ],
      mistakes: [
        why(
          diagonal ? Q.of(s * s * p * p + u * u * q * q, norm) : Q.of((s * s - u * u) * p * q, norm),
          `That uses the eigenvalues $${s * s}$ and $${u * u}$, which gives an entry of $A$ itself; the square root uses $${s}$ and $${u}$.`,
          `这用的是特征值 $${s * s}$ 和 $${u * u}$，得到的是 $A$ 本身的元素；平方根要用 $${s}$ 和 $${u}$。`,
        ),
        why(
          diagonal ? Q.of(s * q * q + u * p * p, norm) : Q.of((u - s) * p * q, norm),
          diagonal
            ? `The roots are paired with the wrong projections: $${s}$ goes with $P_1$, whose entry is $\\frac{${p * p}}{${norm}}$.`
            : `The roots are paired with the wrong projections: $${s}$ goes with $P_1$, whose entry is $\\frac{${p * q}}{${norm}}$.`,
          diagonal
            ? `平方根与投影配错了：$${s}$ 配 $P_1$，它的这个元素是 $\\frac{${p * p}}{${norm}}$。`
            : `平方根与投影配错了：$${s}$ 配 $P_1$，它的这个元素是 $\\frac{${p * q}}{${norm}}$。`,
        ),
        why(
          Q.of(s + u, 2),
          "That averages the two roots; the projections weight them by the eigenvector directions.",
          "这是两个平方根的平均；投影要按特征向量的方向给它们加权。",
        ),
        why(
          diagonal ? Q.of(s * p * p + u * q * q) : Q.of((s - u) * p * q),
          `Each projection is $\\frac{\\mathbf{v}\\mathbf{v}^T}{\\mathbf{v}^T\\mathbf{v}}$; the division by $\\mathbf{v}^T\\mathbf{v} = ${norm}$ was left out.`,
          `每个投影是 $\\frac{\\mathbf{v}\\mathbf{v}^T}{\\mathbf{v}^T\\mathbf{v}}$；漏掉了除以 $\\mathbf{v}^T\\mathbf{v} = ${norm}$。`,
        ),
      ].filter((m, i, all) => String(m.value) !== String(answer) && all.findIndex((o) => String(o.value) === String(m.value)) === i),
      solution: walked(
        [
          [
            ["Take the roots of the eigenvalues", "取特征值的平方根"],
            t("", ""),
            [`\\sqrt{${s * s}} = ${s}, \\quad \\sqrt{${u * u}} = ${u}`, `\\sqrt{A} = ${s === 1 ? "" : s}P_1 + ${u === 1 ? "" : u}P_2`],
          ],
          [
            ["Build the projections", "构造投影矩阵"],
            t(`Both eigenvectors have squared length $${norm}$:`, `两个特征向量的长度平方都是 $${norm}$：`),
            [
              `P_1 = \\frac{1}{${norm}}\\begin{pmatrix} ${p * p} & ${p * q} \\\\ ${p * q} & ${q * q} \\end{pmatrix}, \\quad P_2 = \\frac{1}{${norm}}\\begin{pmatrix} ${q * q} & ${-p * q} \\\\ ${-p * q} & ${p * p} \\end{pmatrix}`,
            ],
          ],
          [
            ["Combine the entry", "合成这个元素"],
            t("", ""),
            [
              `${diagonal ? `\\frac{${s} \\cdot ${p * p} + ${u} \\cdot ${q * q}}{${norm}}` : `\\frac{${s} \\cdot ${inParens(p * q)} - ${u} \\cdot ${inParens(p * q)}}{${norm}}`} = ${answer.toLatex()}`,
            ],
          ],
        ],
        t(
          `$\\sqrt{A}$ must send $${col(p, q)}$ to $${s === 1 ? "" : s}${col(p, q)}$. Its first row is $\\frac{1}{${norm}}(${s * p * p + u * q * q}, ${(s - u) * p * q})$, and $\\frac{${s * p * p + u * q * q} \\cdot ${inParens(p)} + ${inParens((s - u) * p * q)} \\cdot ${inParens(q)}}{${norm}} = ${s * p}$, which is $${s} \\cdot ${inParens(p)}$.`,
          `$\\sqrt{A}$ 必须把 $${col(p, q)}$ 变为 $${s === 1 ? "" : s}${col(p, q)}$。它的第一行是 $\\frac{1}{${norm}}(${s * p * p + u * q * q}, ${(s - u) * p * q})$，而 $\\frac{${s * p * p + u * q * q} \\cdot ${inParens(p)} + ${inParens((s - u) * p * q)} \\cdot ${inParens(q)}}{${norm}} = ${s * p}$，正是 $${s} \\cdot ${inParens(p)}$。`,
        ),
      ),
    });
  },
};

const symmetricMatrixOfForm: KnowledgePointDef = {
  id: "the-symmetric-matrix-with-the-same-quadratic-form",
  title: t("The symmetric matrix with the same quadratic form", "具有相同二次型的对称矩阵"),
  explanation: t(
    "Different matrices can give the same quadratic form $\\mathbf{x}^TA\\mathbf{x}$, because only the sum of the two off-diagonal entries reaches the coefficient of $xy$. Among these matrices exactly one is symmetric, the symmetric part $\\frac{1}{2}(A + A^T)$, which shares the off-diagonal sum equally. This is why a quadratic form is always written with a symmetric matrix: it is then unique, and the spectral theorem applies to it. For example, $\\begin{pmatrix} 1 & 5 \\\\ 1 & 2 \\end{pmatrix}$ gives $x^2 + 6xy + 2y^2$, and so does the symmetric $\\begin{pmatrix} 1 & 3 \\\\ 3 & 2 \\end{pmatrix}$.\n\n> **Watch out.** Add the two off-diagonal entries first, then halve the sum. Keeping one of them, or their full sum, gives a different form.",
    "不同的矩阵可以给出相同的二次型 $\\mathbf{x}^TA\\mathbf{x}$，因为只有两个非对角元之和才影响 $xy$ 的系数。这些矩阵中恰有一个是对称的，即对称部分 $\\frac{1}{2}(A + A^T)$，它把非对角元之和平均分配。这就是二次型总用对称矩阵写出的原因：这样矩阵就是唯一的，并且可以应用谱定理。例如 $\\begin{pmatrix} 1 & 5 \\\\ 1 & 2 \\end{pmatrix}$ 给出 $x^2 + 6xy + 2y^2$，对称矩阵 $\\begin{pmatrix} 1 & 3 \\\\ 3 & 2 \\end{pmatrix}$ 也给出它。\n\n> **注意。** 先把两个非对角元相加，再把和减半。只保留其中一个，或用整个和，得到的都是不同的二次型。",
  ),
  generate(rng) {
    const a = nonzero(rng, 9);
    const d = nonzero(rng, 9);
    const b = nonzero(rng, 9);
    const c = rng.pick([-9, -7, -5, -3, -2, -1, 1, 2, 3, 5, 7, 9].filter((v) => v !== b));
    const answer = Q.of(b + c, 2);
    return numberProblem({
      prompt: t(
        `The form $\\mathbf{x}^TA\\mathbf{x}$ comes from $A = ${mat([
          [a, b],
          [c, d],
        ])}$. Find the entry in row 1, column 2 of the symmetric matrix that gives the same form.`,
        `二次型 $\\mathbf{x}^TA\\mathbf{x}$ 来自 $A = ${mat([
          [a, b],
          [c, d],
        ])}$。求给出相同二次型的对称矩阵第 1 行第 2 列的元素。`,
      ),
      answer,
      wrong: [Q.of(b), Q.of(c), Q.of(b + c), Q.of(b - c, 2)],
      mistakes: [
        why(
          Q.of(b),
          `That keeps the entry $${b}$ of $A$; the symmetric matrix shares $${b} ${signedTerm(c)}$ equally.`,
          `这保留了 $A$ 的元素 $${b}$；对称矩阵要平分 $${b} ${signedTerm(c)}$。`,
        ),
        why(
          Q.of(c),
          `That takes the entry $${c}$ of $A$; the symmetric matrix shares $${b} ${signedTerm(c)}$ equally.`,
          `这取了 $A$ 的元素 $${c}$；对称矩阵要平分 $${b} ${signedTerm(c)}$。`,
        ),
        why(
          Q.of(b + c),
          `That is the whole coefficient of $xy$; each off-diagonal entry gets half of $${b + c}$.`,
          `这是 $xy$ 的整个系数；每个非对角元只得 $${b + c}$ 的一半。`,
        ),
        why(Q.of(b - c, 2), "The two entries are added, not subtracted, before halving.", "减半之前两个元素要相加，而不是相减。"),
      ].filter((m, i, all) => String(m.value) !== String(answer) && all.findIndex((o) => String(o.value) === String(m.value)) === i),
      solution: walked(
        [
          [
            ["Find the coefficient of xy", "求 xy 的系数"],
            t("Both off-diagonal entries multiply $xy$:", "两个非对角元都乘以 $xy$："),
            [`${b} ${signedTerm(c)} = ${b + c}`],
          ],
          [["Share it equally", "平均分配"], t("", ""), [`\\frac{1}{2} \\cdot ${inParens(b + c)} = ${answer.toLatex()}`]],
        ],
        t(
          `The symmetric matrix has $${answer.toLatex()}$ in both off-diagonal places, which gives $2 \\cdot ${answer.isInteger() ? inParens(answer.toNumber()) : `\\left(${answer.toLatex()}\\right)`} = ${b + c}$ as the coefficient of $xy$, the same as $A$; the diagonal entries $${a}$ and $${d}$ stay as they are.`,
          `对称矩阵两个非对角位置都是 $${answer.toLatex()}$，给出 $xy$ 的系数 $2 \\cdot ${answer.isInteger() ? inParens(answer.toNumber()) : `\\left(${answer.toLatex()}\\right)`} = ${b + c}$，与 $A$ 相同；对角元 $${a}$ 和 $${d}$ 保持不变。`,
        ),
      ),
    });
  },
};

const indexAfterCompletingSquare: KnowledgePointDef = {
  id: "the-signs-of-a-form-after-completing-the-square",
  title: t("The signs of a form after completing the square", "配方后二次型的符号"),
  explanation: t(
    "Lagrange's method turns a quadratic form into a sum of multiples of squares. The coefficients depend on the choices made along the way, but Sylvester's law of inertia says that the numbers of positive and of negative coefficients never change. So these two counts are properties of the form itself. The cross term is what makes this subtle, because completing the square moves part of a coefficient into the square, and this can change its sign. For example, $x^2 + 4xy + y^2 - 3z^2 = (x + 2y)^2 - 3y^2 - 3z^2$: the coefficient of $y^2$ was $1$ but becomes $1 - 2^2 = -3$, so the form has one positive and two negative coefficients.\n\n> **Watch out.** Do not count signs in the original form. Complete the square first: the coefficient of $y^2$ loses the square of half the $xy$ coefficient.",
    "拉格朗日方法把二次型化为平方项的倍数之和。系数取决于过程中的选择，但西尔维斯特惯性定律指出，正系数和负系数的个数不变。所以这两个个数是二次型本身的性质。微妙之处在于交叉项，因为配方把系数的一部分移进平方，这可能改变它的符号。例如 $x^2 + 4xy + y^2 - 3z^2 = (x + 2y)^2 - 3y^2 - 3z^2$：$y^2$ 的系数原来是 $1$，变成 $1 - 2^2 = -3$，所以这个二次型有一个正系数、两个负系数。\n\n> **注意。** 不要在原来的二次型里数符号。先配方：$y^2$ 的系数要减去 $xy$ 系数一半的平方。",
  ),
  generate(rng) {
    // b lies strictly between 0 and a^2, so completing the square flips the sign of the y^2 coefficient.
    const a = rng.pick([-4, -3, -2, 2, 3, 4]);
    const b = rng.pick([...Array(a * a - 1).keys()].map((i) => i + 1));
    const c = nonzero(rng, 9);
    const left = b - a * a;
    const coefficients = [1, left, c];
    const asksPositive = rng.pick([true, false]);
    const answer = coefficients.filter((v) => (asksPositive ? v > 0 : v < 0)).length;
    const form = poly([1, "x^2"], [2 * a, "xy"], [b, "y^2"], [c, "z^2"]);
    const squares = poly([1, `(${poly([1, "x"], [a, "y"])})^2`], [left, "y^2"], [c, "z^2"]);
    return numberProblem({
      prompt: t(
        `Reduce the form $${form}$ to a sum of multiples of squares. How many of the coefficients are ${asksPositive ? "positive" : "negative"}?`,
        `把二次型 $${form}$ 化为平方项的倍数之和。有多少个系数是${asksPositive ? "正" : "负"}的？`,
      ),
      answer,
      form: "integer",
      wrong: [0, 1, 2, 3],
      mistakes: [
        why(
          [1, b, c].filter((v) => (asksPositive ? v > 0 : v < 0)).length,
          `That counts the signs in the original form. Completing the square turns the coefficient $${b}$ of $y^2$ into $${b} - ${inParens(a)}^2 = ${left}$.`,
          `这数的是原二次型中的符号。配方把 $y^2$ 的系数 $${b}$ 变成 $${b} - ${inParens(a)}^2 = ${left}$。`,
        ),
        why(
          3 - answer,
          `That counts the ${asksPositive ? "negative" : "positive"} coefficients; the question asks for the ${asksPositive ? "positive" : "negative"} ones.`,
          `这数的是${asksPositive ? "负" : "正"}系数；题目问的是${asksPositive ? "正" : "负"}系数。`,
        ),
        asksPositive
          ? why(
              answer - 1,
              `The square $(${poly([1, "x"], [a, "y"])})^2$ has coefficient $1$, which is positive too.`,
              `平方 $(${poly([1, "x"], [a, "y"])})^2$ 的系数是 $1$，它也是正的。`,
            )
          : why(
              answer + 1,
              `The square $(${poly([1, "x"], [a, "y"])})^2$ has coefficient $+1$, whatever the signs inside the bracket, so it is not one of the negative coefficients.`,
              `平方 $(${poly([1, "x"], [a, "y"])})^2$ 的系数是 $+1$，不论括号里的符号如何，所以它不是负系数。`,
            ),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Complete the square in x", "对 x 配方"],
            t(
              `The terms with $x$ make a square, and $${inParens(a)}^2 y^2$ is taken away from the $y^2$ term:`,
              `含 $x$ 的项组成一个平方，从 $y^2$ 项中减去 $${inParens(a)}^2 y^2$：`,
            ),
            [`${form} = ${squares}`],
          ],
          [
            ["Count the signs", "数符号"],
            t(
              `The coefficients are $${coefficients.join(", ")}$, of which $${answer}$ ${answer === 1 ? "is" : "are"} ${asksPositive ? "positive" : "negative"}.`,
              `系数是 $${coefficients.join(", ")}$，其中有 $${answer}$ 个是${asksPositive ? "正" : "负"}的。`,
            ),
          ],
        ],
        t(
          `Expanding $(${poly([1, "x"], [a, "y"])})^2$ gives $${poly([1, "x^2"], [2 * a, "xy"], [a * a, "y^2"])}$, and $${a * a} ${signedTerm(left)} = ${b}$ restores the coefficient of $y^2$.`,
          `展开 $(${poly([1, "x"], [a, "y"])})^2$ 得 $${poly([1, "x^2"], [2 * a, "xy"], [a * a, "y^2"])}$，而 $${a * a} ${signedTerm(left)} = ${b}$ 还原了 $y^2$ 的系数。`,
        ),
      ),
    });
  },
};

/** ellipseForms lists the forms ax^2 + 2bxy + cy^2 with a positive perfect square for ac - b^2. */
const ellipseForms = [...Array(12).keys()].flatMap((i) =>
  [...Array(12).keys()].flatMap((j) =>
    [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].flatMap((b) => {
      const value = (i + 1) * (j + 1) - b * b;
      const root = Math.round(Math.sqrt(Math.max(value, 0)));
      return value > 0 && root * root === value ? [[i + 1, b, j + 1, root] as const] : [];
    }),
  ),
);

const ellipseAreaFromForm: KnowledgePointDef = {
  id: "the-area-of-an-ellipse-from-its-quadratic-form",
  figure: linearAlgebraDrawings2["reducing-a-quadratic-curve-to-its-principal-axes#the-area-of-an-ellipse-from-its-quadratic-form"],
  title: t("The area of an ellipse from its quadratic form", "由二次型求椭圆的面积"),
  explanation: t(
    "After rotating to principal axes, a positive definite form becomes $\\lambda_1u^2 + \\lambda_2v^2 = d$, an ellipse with semi-axes $\\sqrt{\\frac{d}{\\lambda_1}}$ and $\\sqrt{\\frac{d}{\\lambda_2}}$. Its area is $\\pi$ times their product, $\\frac{\\pi d}{\\sqrt{\\lambda_1\\lambda_2}}$. Since the product of the eigenvalues is the determinant of the matrix, the eigenvalues never need to be found. For $ax^2 + 2bxy + cy^2$, the determinant is $ac - b^2$, and the rotation does not change the area. For example, $5x^2 + 4xy + 2y^2 = 3$ has determinant $5 \\cdot 2 - 2^2 = 6$, so its area is $\\frac{3\\pi}{\\sqrt{6}}$.\n\n> **Watch out.** The area is $\\frac{\\pi d}{\\sqrt{\\det A}}$: keep the factor $d$, and take the square root of the determinant.",
    "旋转到主轴后，正定二次型变成 $\\lambda_1u^2 + \\lambda_2v^2 = d$，这是半轴为 $\\sqrt{\\frac{d}{\\lambda_1}}$、$\\sqrt{\\frac{d}{\\lambda_2}}$ 的椭圆。它的面积是 $\\pi$ 乘以它们的积，即 $\\frac{\\pi d}{\\sqrt{\\lambda_1\\lambda_2}}$。由于特征值之积是矩阵的行列式，不必求出特征值。对 $ax^2 + 2bxy + cy^2$，行列式是 $ac - b^2$，旋转不改变面积。例如 $5x^2 + 4xy + 2y^2 = 3$ 的行列式是 $5 \\cdot 2 - 2^2 = 6$，所以面积是 $\\frac{3\\pi}{\\sqrt{6}}$。\n\n> **注意。** 面积是 $\\frac{\\pi d}{\\sqrt{\\det A}}$：不要漏掉因子 $d$，并且要对行列式开平方。",
  ),
  generate(rng) {
    const [a, b, c, root] = rng.pick(ellipseForms);
    // With root = 1 and d = 1 most slips give the right number, so d starts at 2 there.
    const d = rng.int(root === 1 ? 2 : 1, 9);
    const answer = Q.of(d, root);
    const value = a * c - b * b;
    return numberProblem({
      prompt: t(
        `The area enclosed by the ellipse $${poly([a, "x^2"], [2 * b, "xy"], [c, "y^2"])} = ${d}$ is $k\\pi$. Find $k$.`,
        `椭圆 $${poly([a, "x^2"], [2 * b, "xy"], [c, "y^2"])} = ${d}$ 围成的面积是 $k\\pi$。求 $k$。`,
      ),
      answer,
      wrong: [Q.of(d, value), Q.of(1, root), Q.of(d * root), Q.of(2 * d, root), Q.of(root, d)],
      mistakes: [
        why(
          Q.of(d, value),
          `That divides by the determinant $${value}$; divide by its square root $${root}$.`,
          `这是除以行列式 $${value}$；应除以它的平方根 $${root}$。`,
        ),
        why(
          Q.of(1, root),
          `The level $${d}$ is missing; the area is $\\frac{\\pi d}{\\sqrt{\\det A}}$.`,
          `漏掉了水平 $${d}$；面积是 $\\frac{\\pi d}{\\sqrt{\\det A}}$。`,
        ),
        why(
          Q.of(d * root),
          `$\\sqrt{${value}}$ belongs in the denominator, not the numerator.`,
          `$\\sqrt{${value}}$ 应在分母里，而不是分子里。`,
        ),
        why(
          Q.of(2 * d, root),
          "The area of an ellipse is $\\pi$ times the product of the semi-axes, with no factor $2$.",
          "椭圆面积是 $\\pi$ 乘以两个半轴之积，没有因子 $2$。",
        ),
        why(Q.of(root, d), "The fraction is upside down: $d$ goes on top.", "分数倒过来了：$d$ 在分子上。"),
      ].filter((m, i, all) => String(m.value) !== String(answer) && all.findIndex((o) => String(o.value) === String(m.value)) === i),
      solution: walked(
        [
          [
            ["Find the determinant", "求行列式"],
            t(
              `Half of $${2 * b}$ goes off the diagonal, and the determinant is the product of the eigenvalues:`,
              `$${2 * b}$ 的一半放在非对角位置，行列式是特征值之积：`,
            ),
            [`\\lambda_1\\lambda_2 = ${a} \\cdot ${c} - ${inParens(b)}^2 = ${value}`],
          ],
          [
            ["Multiply the semi-axes", "把半轴相乘"],
            t("", ""),
            [
              `\\pi\\sqrt{\\frac{${d}}{\\lambda_1}}\\sqrt{\\frac{${d}}{\\lambda_2}} = \\frac{${d === 1 ? "" : d}\\pi}{\\sqrt{${value}}} = ${answer.isInteger() && answer.toNumber() === 1 ? "" : answer.toLatex()}\\pi`,
            ],
          ],
        ],
        t(
          `The determinant $${value} = ${root}^2$ is positive and so is $a = ${a}$, so the curve really is an ellipse; $k = ${answer.toLatex()}$.`,
          `行列式 $${value} = ${root}^2$ 为正，$a = ${a}$ 也为正，所以这条曲线确实是椭圆；$k = ${answer.toLatex()}$。`,
        ),
      ),
    });
  },
};

const traceOfHatMatrix: KnowledgePointDef = {
  id: "the-trace-of-a-hat-matrix",
  title: t("The trace of a hat matrix", "帽子矩阵的迹"),
  explanation: t(
    "The hat matrix $H = X(X^TX)^{-1}X^T$ is the orthogonal projection onto the column space of $X$. A projection has only the eigenvalues 1 and 0, so its trace equals its rank. With an intercept and $k$ predictors, independent columns give the rank $k + 1$, which is the number of fitted coefficients. The complementary projection $I - H$ makes the residuals, and its trace, $n - k - 1$, is the number of residual degrees of freedom. For example, an intercept and $3$ predictors fitted to $25$ observations give $\\operatorname{tr}(H) = 4$ and $\\operatorname{tr}(I - H) = 21$.\n\n> **Watch out.** The intercept adds a column of ones, so the rank is $k + 1$, not $k$; and the trace of $I - H$ subtracts that rank from $n$, the size of the matrices.",
    "帽子矩阵 $H = X(X^TX)^{-1}X^T$ 是到 $X$ 的列空间的正交投影。投影只有特征值 1 和 0，所以它的迹等于它的秩。有截距和 $k$ 个预测变量时，列线性无关，秩是 $k + 1$，也就是拟合系数的个数。互补投影 $I - H$ 给出残差，它的迹 $n - k - 1$ 是残差的自由度。例如截距加 $3$ 个预测变量拟合 $25$ 个观测，$\\operatorname{tr}(H) = 4$，$\\operatorname{tr}(I - H) = 21$。\n\n> **注意。** 截距增加了一列全 1，所以秩是 $k + 1$，不是 $k$；$I - H$ 的迹是用矩阵的阶数 $n$ 减去这个秩。",
  ),
  generate(rng) {
    const n = rng.int(10, 60);
    const k = rng.int(1, 7);
    const hat = rng.pick([true, false]);
    const answer = hat ? k + 1 : n - k - 1;
    const symbol = hat ? "H" : "I - H";
    return numberProblem({
      prompt: t(
        `A multiple regression with an intercept and ${k === 1 ? "one predictor" : `${k} predictors`}, with independent columns, is fitted to ${n} observations. Let $H$ be its hat matrix. Find the trace of $${symbol}$.`,
        `对 ${n} 个观测值拟合一个带截距、有 ${k} 个预测变量的多元回归，各列线性无关。设 $H$ 是它的帽子矩阵。求 $${symbol}$ 的迹。`,
      ),
      answer,
      form: "integer",
      mistakes: distinctFrom(answer, [
        hat
          ? why(
              k,
              "The intercept adds a column of ones, so $X$ has $k + 1$ columns, not $k$.",
              "截距增加了一列全 1，所以 $X$ 有 $k + 1$ 列，而不是 $k$ 列。",
            )
          : why(
              n - k,
              `That subtracts only the $${k}$ predictors; the intercept is a column of $X$ too, so subtract $${k + 1}$.`,
              `这只减去了 $${k}$ 个预测变量；截距也是 $X$ 的一列，所以要减去 $${k + 1}$。`,
            ),
        hat
          ? why(
              n - k - 1,
              `$${n - k - 1}$ is the trace of $I - H$, the residual degrees of freedom.`,
              `$${n - k - 1}$ 是 $I - H$ 的迹，即残差的自由度。`,
            )
          : why(
              k + 1,
              `$${k + 1}$ is the trace of $H$; the trace of $I - H$ is what is left of $${n}$.`,
              `$${k + 1}$ 是 $H$ 的迹；$I - H$ 的迹是 $${n}$ 剩下的部分。`,
            ),
        why(
          n,
          `$${n}$ is the size of the matrices, the trace of $I$, not of $${symbol}$.`,
          `$${n}$ 是矩阵的阶数，是 $I$ 的迹，不是 $${symbol}$ 的迹。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Count the columns", "数出列数"],
            t(
              `$X$ has a column of ones and $${k}$ predictor columns, all independent, so $\\operatorname{rank}(X) = ${k + 1}$.`,
              `$X$ 有一列全 1 和 $${k}$ 个预测变量列，彼此线性无关，所以 $\\operatorname{rank}(X) = ${k + 1}$。`,
            ),
          ],
          [
            ["Use trace equals rank", "利用迹等于秩"],
            hat
              ? t(
                  `$H$ projects onto $\\operatorname{Col}(X)$, so $\\operatorname{tr}(H) = ${answer}$.`,
                  `$H$ 投影到 $\\operatorname{Col}(X)$，所以 $\\operatorname{tr}(H) = ${answer}$。`,
                )
              : t(
                  `$I - H$ projects onto the orthogonal complement, of dimension $${n} - ${k + 1}$, so $\\operatorname{tr}(I - H) = ${answer}$.`,
                  `$I - H$ 投影到正交补，其维数为 $${n} - ${k + 1}$，所以 $\\operatorname{tr}(I - H) = ${answer}$。`,
                ),
          ],
        ],
        t(
          `$\\operatorname{tr}(H) + \\operatorname{tr}(I - H) = ${k + 1} + ${n - k - 1} = ${n} = \\operatorname{tr}(I_{${n}})$.`,
          `$\\operatorname{tr}(H) + \\operatorname{tr}(I - H) = ${k + 1} + ${n - k - 1} = ${n} = \\operatorname{tr}(I_{${n}})$。`,
        ),
      ),
    });
  },
};

const inverseOfScaledPermutation: KnowledgePointDef = {
  id: "an-entry-of-the-inverse-of-a-scaled-permutation-matrix",
  title: t("An entry of the inverse of a scaled permutation matrix", "带系数置换矩阵逆的元素"),
  explanation: t(
    "A matrix with exactly one nonzero entry in each row and column is a permutation matrix with scaled entries, and row reduction only needs to swap and divide. If the entry $d$ lies in row $i$ and column $j$, then the column $\\mathbf{e}_j$ goes to $d\\mathbf{e}_i$, and the inverse must send $\\mathbf{e}_i$ back to $\\frac{1}{d}\\mathbf{e}_j$. So the inverse has $\\frac{1}{d}$ in row $j$ and column $i$, the mirror position across the diagonal. For example, if $A$ has $4$ in row $1$, column $2$, then $A^{-1}$ has $\\frac{1}{4}$ in row $2$, column $1$.\n\n> **Watch out.** The reciprocal moves to the mirror position, not the same one, and it keeps the sign of $d$.",
    "每行每列恰有一个非零元的矩阵是带系数的置换矩阵，行化简只需交换和除法。如果元素 $d$ 位于第 $i$ 行第 $j$ 列，那么 $\\mathbf{e}_j$ 被映到 $d\\mathbf{e}_i$，逆矩阵必须把 $\\mathbf{e}_i$ 映回 $\\frac{1}{d}\\mathbf{e}_j$。所以逆矩阵在第 $j$ 行第 $i$ 列有 $\\frac{1}{d}$，这是关于对角线的镜像位置。例如 $A$ 在第 $1$ 行第 $2$ 列为 $4$，则 $A^{-1}$ 在第 $2$ 行第 $1$ 列为 $\\frac{1}{4}$。\n\n> **注意。** 倒数要移到镜像位置而不是原位置，并且保持 $d$ 的符号。",
  ),
  generate(rng) {
    const pool = [-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9];
    const entries = [rng.pick(pool), rng.pick(pool), rng.pick(pool), rng.pick(pool)] as const;
    const [d1, d2, d3, d4] = entries;
    const at = rng.int(0, 3);
    const d = entries[at] ?? 2;
    const row = ((at + 1) % 4) + 1;
    const column = at + 1;
    const answer = Q.of(1, d);
    return numberProblem({
      prompt: t(
        `Let $A = ${mat([
          [0, d1, 0, 0],
          [0, 0, d2, 0],
          [0, 0, 0, d3],
          [d4, 0, 0, 0],
        ])}$. Find the entry in row ${row}, column ${column} of $A^{-1}$.`,
        `设 $A = ${mat([
          [0, d1, 0, 0],
          [0, 0, d2, 0],
          [0, 0, 0, d3],
          [d4, 0, 0, 0],
        ])}$。求 $A^{-1}$ 第 ${row} 行第 ${column} 列的元素。`,
      ),
      answer,
      mistakes: [
        why(
          Q.of(d),
          `That is the entry $${d}$ of $A$ itself; the inverse holds its reciprocal.`,
          `这是 $A$ 自身的元素 $${d}$；逆矩阵中是它的倒数。`,
        ),
        why(answer.neg(), `The reciprocal keeps the sign of $${d}$.`, `倒数保持 $${d}$ 的符号。`),
        why(
          0,
          `Row ${row}, column ${column} mirrors the position of $${d}$ in $A$, so this entry is not zero.`,
          `第 ${row} 行第 ${column} 列正是 $A$ 中 $${d}$ 的镜像位置，所以该元素不为零。`,
        ),
        why(
          Q.of(1, entries[(at + 1) % 4] ?? 2),
          `That is the reciprocal of a neighbouring entry; the entry of $A$ in row ${column}, column ${row} is $${d}$.`,
          `这是相邻元素的倒数；$A$ 第 ${column} 行第 ${row} 列的元素是 $${d}$。`,
        ),
        why(Q.of(-d), `The inverse holds the reciprocal of $${d}$, with the same sign.`, `逆矩阵中是 $${d}$ 的倒数，符号相同。`),
      ].filter((w, i, all) => {
        const asQ = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v);
        return !asQ(w.value).eq(answer) && all.findIndex((o) => asQ(o.value).eq(asQ(w.value))) === i;
      }),
      solution: walked(
        [
          [
            ["Locate the entry", "定位元素"],
            t(
              `Row ${column} of $A$ has its only nonzero entry $${d}$ in column ${row}, so $A\\mathbf{e}_{${row}} = ${d}\\mathbf{e}_{${column}}$.`,
              `$A$ 的第 ${column} 行唯一的非零元素 $${d}$ 位于第 ${row} 列，所以 $A\\mathbf{e}_{${row}} = ${d}\\mathbf{e}_{${column}}$。`,
            ),
          ],
          [
            ["Mirror and invert", "取镜像并求倒数"],
            t(
              `The inverse sends $\\mathbf{e}_{${column}}$ back to $\\frac{1}{${d}}\\mathbf{e}_{${row}}$, so row ${row}, column ${column} of $A^{-1}$ is`,
              `逆矩阵把 $\\mathbf{e}_{${column}}$ 映回 $\\frac{1}{${d}}\\mathbf{e}_{${row}}$，所以 $A^{-1}$ 第 ${row} 行第 ${column} 列为`,
            ),
            [`\\frac{1}{${d}} = ${answer.toLatex()}`],
          ],
        ],
        t(
          `Row ${row} of $A^{-1}$ times column ${row} of $A$ is $${answer.toLatex()} \\cdot ${inParens(d)} = 1$, the diagonal entry of $I$.`,
          `$A^{-1}$ 的第 ${row} 行乘 $A$ 的第 ${row} 列为 $${answer.toLatex()} \\cdot ${inParens(d)} = 1$，正是 $I$ 的对角元素。`,
        ),
      ),
    });
  },
};

/** deeperLinearAlgebraPoints gives, by topic id, the knowledge points added after a Linear Algebra topic's own. */
export const deeperLinearAlgebraPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "the-intersection-of-two-planes": [perpendicularPlanes],
  "the-cartesian-equation-of-a-plane": [parallelPlaneThroughPoint],
  "the-shortest-distance-between-a-plane-and-a-point": [footOfPerpendicular],
  "the-intersection-between-a-line-and-a-plane": [lineParallelToPlane],
  "the-determinant-of-an-nxn-matrix": [countingLeibnizTerms],
  "finding-determinants-using-laplace-expansions": [expandingAlongASparseRow],
  "cramers-rule-for-2x2-systems-of-linear-equations": [whenCramerFails],
  "further-properties-of-determinants": [determinantOfACombination],
  "partitioned-and-block-matrices": [multiplyingBlocks],
  "solving-3x3-singular-systems-of-equations-using-gaussian-elimination": [consistent3x3],
  "reduced-row-echelon-form": [clearingAbovePivot],
  "finding-the-inverse-of-a-2x2-matrix-using-row-operations": [solvingWithAnInverse],
  "matrices-with-easy-to-find-inverses": [inverseOfAProduct],
  "lu-factorization-of-2x2-matrices": [whenLuFails],
  "linear-span-of-vectors-in-n-dimensional-euclidean-space": [parameterInSpan],
  "linear-dependence-and-independence": [parameterForDependence],
  "the-column-space-of-a-matrix": [planeOfAColumnSpace],
  "the-rank-of-a-matrix": [parameterForRankOne],
  "changing-a-basis-using-the-change-of-coordinates-matrix": [betweenTwoBases],
  "dimension-in-abstract-vector-spaces": [dimensionOfFamilies],
  "the-coordinates-of-a-vector-relative-to-a-basis-in-abstract-vector-spaces": [coordinatesAroundAPoint],
  "standard-matrix-of-a-linear-transformation-in-terms-of-the-standard-basis": [composingTransformations],
  "calculating-the-eigenvalues-of-a-2x2-matrix": [otherEigenvalue],
  "eigenvalues-and-eigenvectors-of-a-2x2-matrix": [eigenvalueOfAPolynomial],
  "cayley-hamilton-theorem": [inverseFromCayleyHamilton],
  "properties-of-diagonalization": [traceOfAPower],
  "rotation-scaling-matrices": [lengthUnderRotationScaling],
  "nilpotent-and-idempotent-matrices": [inverseOfIPlusNilpotent],
  "jordan-blocks-and-jordan-matrices": [blocksFromNullities],
  "matrix-functions": [exponentialOfJordanBlock],
  "orthogonal-matrices": [completingARotation],
  "projection-matrices-linear-transformations-and-their-properties": [reflectionFromProjection],
  "least-squares-solution-of-a-linear-system-without-collinearity": [leastSquaresError],
  "symmetric-matrices": [perpendicularEigenvectors],
  "quadratic-forms": [evaluatingAQuadraticForm],
  "positive-definite-and-negative-definite-quadratic-forms": [definiteRange],
  "computing-the-singular-values-of-a-matrix": [conditionNumber],
  "singular-value-decomposition-and-the-pseudoinverse-matrix": [pseudoinverseOfADiagonal],
  "steady-state-vectors": [rateOfConvergence],
  "linear-regression-with-matrices": [slopeFromNormalEquations],
  "the-parametric-equations-of-a-line": [lineMeetsHorizontalPlane],
  "the-cartesian-equation-of-a-line": [pointOnSymmetricLine],
  "the-vector-equation-of-a-plane": [planeIntercept],
  "the-parametric-equations-of-a-plane": [planeConstantFromSpan],
  "finding-determinants-using-row-and-column-operations": [vandermonde],
  "elementary-3x3-matrices": [powerOfElementary],
  "vectors-in-n-dimensional-euclidean-space": [scalarForEntry],
  "the-null-space-of-a-matrix": [entryInNullSpace],
  "the-dimension-of-the-null-space-of-a-matrix": [nullityOfTranspose],
  "the-rank-nullity-theorem": [smallestNullity],
  "rank-nullity-theorem-in-terms-of-linear-transformations": [symmetrizationRank],
  "invertible-matrix-theorem-in-terms-of-linear-transformations": [inverseMapValue],
  "connections-between-matrix-representations-of-a-linear-transformation": [determinantInNewBasis],
  "linear-maps-between-two-different-vector-spaces": [evaluationKernel],
  "characteristic-equation-of-a-matrix": [characteristicConstant],
  "invertible-matrix-theorem-in-terms-of-eigenvalues": [inverseShiftEigenvalue],
  "diagonalizing-a-2x2-matrix": [powerOfDiagonalized],
  "matrices-over-the-complex-numbers": [hermitianDeterminant],
  "block-diagonalization-of-nxn-matrices": [blockDeterminant],
  "ranks-of-generalized-eigenvectors": [rankOfNilpotentPower],
  "jordan-canonical-form-of-a-2x2-matrix": [powerOfTwoBlock],
  "jordan-canonical-decomposition-of-a-3x3-matrix": [powerOfThreeBlock],
  "dot-product-in-n-dimensional-euclidean-space": [cosineFromDot],
  "norm-of-a-vector-in-n-dimensional-euclidean-space": [unitVectorEntry],
  "norm-of-a-vector-in-inner-product-spaces": [monomialNorm],
  "pythagorean-theorem-and-triangle-inequality-in-inner-product-spaces": [triangleBounds],
  "orthogonal-vectors-in-inner-product-spaces": [trigonometricNorm],
  "cramers-rule-for-3x3-systems": [numeratorDeterminant],
  "row-and-column-operations-on-determinants": [determinantAfterOperations],
  "conditions-when-a-determinant-equals-zero": [equalOffDiagonalSingular],
  "solving-systems-of-equations-using-back-substitution": [firstUnknownOfBidiagonal],
  "finding-the-inverse-of-an-nxn-square-matrix-using-row-operations": [inverseOfScaledPermutation],
  "subspaces-of-n-dimensional-space-geometric-interpretation": [dimensionOfIntersection],
  "finding-a-basis-of-a-span": [coefficientOfDependentVector],
  "the-change-of-coordinates-matrix": [determinantOfChangeOfBasis],
  "the-dimension-of-a-span": [rankFromFormula],
  "kernel-of-a-linear-transformation": [largestNullityOfComposition],
  "image-and-rank-of-a-linear-transformation": [rankOfRepeatedDerivative],
  "diagonalizing-a-3x3-matrix-in-the-general-case": [countingDiagonalForms],
  "reducing-real-2x2-matrices-to-rotation-scaling-form": [angleInRotationScaling],
  "generalized-eigenvectors": [generalizedEigenspaceDimension],
  "jordan-canonical-form-of-a-3x3-matrix": [countingJordanForms],
  "inner-product-spaces": [traceInnerProduct],
  "inner-product-in-vector-spaces-over-the-complex-numbers": [scalarInComplexInnerProduct],
  "projecting-vectors-onto-subspaces-in-euclidean-spaces-orthogonal-bases": [traceOfReflection],
  "qr-factorization": [determinantFromQr],
  "spectral-theorem": [squareRootOfSymmetric],
  "bilinear-forms": [symmetricMatrixOfForm],
  "canonical-form-of-a-quadratic-form-using-lagranges-method": [indexAfterCompletingSquare],
  "reducing-a-quadratic-curve-to-its-principal-axes": [ellipseAreaFromForm],
  "multiple-linear-regression-with-matrices": [traceOfHatMatrix],
};
