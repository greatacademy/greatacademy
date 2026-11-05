// Third knowledge points for thin topics of Linear Algebra, from sets and elimination to
// eigenvectors: the reverse question, a harder case or a common trap.
// See `deeperLinearAlgebraThirdPoints`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { poly, Q } from "@ga/subject-math";

import { ask, choose, type Pair, point } from "../university-kit.ts";

/** nz picks a nonzero integer from -r to r. */
const nz = (rng: Rng, r: number) => rng.pick([...Array(2 * r + 1).keys()].map((i) => i - r).filter((i) => i !== 0));
/** mat writes a matrix given as rows. */
const mat = (rows: readonly (readonly (number | string)[])[]) =>
  `\\begin{pmatrix} ${rows.map((row) => row.join(" & ")).join(" \\\\ ")} \\end{pmatrix}`;
/** vec writes a column vector. */
const vec = (...entries: readonly (number | string)[]) => mat(entries.map((entry) => [entry]));
/** wrap puts parentheses around a negative number. */
const wrap = (n: number) => (n < 0 ? `(${n})` : `${n}`);

const squaresBounded = point(
  "counting-integers-with-a-bounded-square",
  ["Counting integers with a bounded square", "数平方有界的整数"],
  [
    "When a set is described inside the integers, negative numbers count as well. A condition such as $x^{2} \\le k$ allows both signs and zero, so the set has one element for zero and two for each positive integer up to the square root of $k$.",
    "当集合在整数中描述时，负数也要计入。像 $x^{2} \\le k$ 这样的条件允许正负两种符号以及零，所以集合中零占一个元素，不超过 $k$ 的平方根的每个正整数占两个元素。",
  ],
  (rng) => {
    const k = rng.int(2, 150);
    const s = Math.floor(Math.sqrt(k));
    const answer = 2 * s + 1;
    return ask(
      [
        `How many elements does $\\{x \\in \\mathbb{Z} \\mid x^{2} \\le ${k}\\}$ have?`,
        `$\\{x \\in \\mathbb{Z} \\mid x^{2} \\le ${k}\\}$ 有多少个元素？`,
      ],
      answer,
      [s, 2 * s, s + 1],
      [
        `The largest integer whose square is at most $${k}$ is $${s}$. So the set runs from $${-s}$ to $${s}$, which is $${answer}$ integers including zero.`,
        `平方不超过 $${k}$ 的最大整数是 $${s}$。所以集合从 $${-s}$ 到 $${s}$，包括零在内共 $${answer}$ 个整数。`,
      ],
    );
  },
);

const negation = point(
  "negating-a-quantified-statement",
  ["Negating a quantified statement", "否定带量词的命题"],
  [
    "To negate a quantified statement, change the quantifier and negate the predicate: not for all becomes there exists, and not there exists becomes for all. Negating an inequality includes the boundary, so the negation of $>$ is $\\le$, not $<$.",
    "否定带量词的命题时，要改变量词并否定谓词：并非对所有变成存在，并非存在变成对所有。否定不等式时要包括边界，所以 $>$ 的否定是 $\\le$，而不是 $<$。",
  ],
  (rng) => {
    const k = rng.int(1, 25);
    const R = "x \\in \\mathbb{R}";
    if (rng.bool()) {
      return choose(
        rng,
        [`Which statement is the negation of $\\forall ${R},\\ x^{2} > ${k}$?`, `哪个命题是 $\\forall ${R},\\ x^{2} > ${k}$ 的否定？`],
        [`$\\exists ${R},\\ x^{2} \\le ${k}$`, `$\\exists ${R},\\ x^{2} \\le ${k}$`],
        [
          [`$\\exists ${R},\\ x^{2} < ${k}$`, `$\\exists ${R},\\ x^{2} < ${k}$`],
          [`$\\forall ${R},\\ x^{2} \\le ${k}$`, `$\\forall ${R},\\ x^{2} \\le ${k}$`],
          [`$\\exists ${R},\\ x^{2} > ${k}$`, `$\\exists ${R},\\ x^{2} > ${k}$`],
        ],
        [
          `The quantifier changes from for all to there exists, and the negation of $x^{2} > ${k}$ is $x^{2} \\le ${k}$, which includes equality.`,
          `量词由对所有变为存在，而 $x^{2} > ${k}$ 的否定是 $x^{2} \\le ${k}$，其中包括等号。`,
        ],
      );
    }
    return choose(
      rng,
      [`Which statement is the negation of $\\exists ${R},\\ x^{2} < ${k}$?`, `哪个命题是 $\\exists ${R},\\ x^{2} < ${k}$ 的否定？`],
      [`$\\forall ${R},\\ x^{2} \\ge ${k}$`, `$\\forall ${R},\\ x^{2} \\ge ${k}$`],
      [
        [`$\\forall ${R},\\ x^{2} > ${k}$`, `$\\forall ${R},\\ x^{2} > ${k}$`],
        [`$\\exists ${R},\\ x^{2} \\ge ${k}$`, `$\\exists ${R},\\ x^{2} \\ge ${k}$`],
        [`$\\forall ${R},\\ x^{2} < ${k}$`, `$\\forall ${R},\\ x^{2} < ${k}$`],
      ],
      [
        `The quantifier changes from there exists to for all, and the negation of $x^{2} < ${k}$ is $x^{2} \\ge ${k}$, which includes equality.`,
        `量词由存在变为对所有，而 $x^{2} < ${k}$ 的否定是 $x^{2} \\ge ${k}$，其中包括等号。`,
      ],
    );
  },
);

const imageSet = point(
  "a-constructed-set-with-hidden-repeats",
  ["A constructed set with hidden repeats", "隐含重复元素的构造集合"],
  [
    "A set built by applying a formula lists each value once, even if several inputs produce it. Squaring sends $x$ and $-x$ to the same number, so the size of the set can be much smaller than the number of inputs, and it depends on the larger end of the range.",
    "用公式构造的集合中，每个值只列一次，即使有多个输入产生它。平方把 $x$ 和 $-x$ 送到同一个数，所以集合的大小可能远小于输入的个数，并且取决于范围中较大的一端。",
  ],
  (rng) => {
    const a = rng.int(1, 9);
    const b = a + rng.int(0, 5);
    const answer = b + 1;
    return ask(
      [
        `How many elements does $\\{x^{2} \\mid x \\in \\mathbb{Z},\\ ${-a} \\le x \\le ${b}\\}$ have?`,
        `$\\{x^{2} \\mid x \\in \\mathbb{Z},\\ ${-a} \\le x \\le ${b}\\}$ 有多少个元素？`,
      ],
      answer,
      [a + b + 1, b, 2 * b + 1],
      [
        `The negative inputs repeat squares of positive ones, since $${a} \\le ${b}$. The distinct values are the squares of $0, 1, \\dots, ${b}$, which is $${answer}$ numbers.`,
        `由于 $${a} \\le ${b}$，负的输入只是重复正数的平方。不同的值是 $0, 1, \\dots, ${b}$ 的平方，共 $${answer}$ 个数。`,
      ],
    );
  },
);

const residuesInInterval = point(
  "counting-a-residue-set-in-an-interval",
  ["Counting a residue set in an interval", "数区间内的同余集元素"],
  [
    "The elements of $\\{mk + r\\}$ in an interval are equally spaced by $m$. So find the first element at or above the lower end and the last at or below the upper end, and count the steps between them, adding one for the starting element.",
    "$\\{mk + r\\}$ 在区间内的元素以 $m$ 为间隔等距分布。所以先找不小于下端的第一个元素和不大于上端的最后一个元素，再数它们之间的步数，并加上起始元素这一个。",
  ],
  (rng) => {
    const m = rng.int(3, 9);
    const r = rng.int(0, m - 1);
    const L = rng.int(-30, 0);
    const U = L + m + rng.int(0, 30);
    const low = Math.ceil((L - r) / m);
    const high = Math.floor((U - r) / m);
    const answer = high - low + 1;
    return ask(
      [
        `How many elements of $\\{${poly([m, "k"], [r, ""])} \\mid k \\in \\mathbb{Z}\\}$ lie in the interval $[${L}, ${U}]$?`,
        `$\\{${poly([m, "k"], [r, ""])} \\mid k \\in \\mathbb{Z}\\}$ 有多少个元素在区间 $[${L}, ${U}]$ 内？`,
      ],
      answer,
      [answer + 1, answer - 1 === 0 ? answer + 2 : answer - 1, U - L + 1],
      [
        `The first element in the interval is $${m * low + r}$ and the last is $${m * high + r}$. They differ by $${m * (high - low)}$, so the count is $\\frac{${m * (high - low)}}{${m}} + 1 = ${answer}$.`,
        `区间内第一个元素是 $${m * low + r}$，最后一个是 $${m * high + r}$。它们相差 $${m * (high - low)}$，所以个数是 $\\frac{${m * (high - low)}}{${m}} + 1 = ${answer}$。`,
      ],
    );
  },
);

const listingIntegers = point(
  "the-position-of-an-integer-in-a-listing",
  ["The position of an integer in a listing", "整数在列表中的位置"],
  [
    "A set is countably infinite if a list reaches every element. The integers are listed by alternating signs as $0, -1, 1, -2, 2, \\dots$, even though they extend in both directions. Each integer has an exact position, and the formula differs for the two signs.",
    "如果一个列表能到达集合的每个元素，这个集合就是可数无穷的。整数可以用正负交替的方式列为 $0, -1, 1, -2, 2, \\dots$，尽管它们向两个方向延伸。每个整数都有确定的位置，两种符号的公式不同。",
  ],
  (rng) => {
    const m = nz(rng, 30);
    const answer = m > 0 ? 2 * m : -2 * m - 1;
    const f = "\\begin{cases} \\frac{n}{2}, & n \\text{ even} \\\\ -\\frac{n + 1}{2}, & n \\text{ odd} \\end{cases}";
    return ask(
      [
        `The function $f(n) = ${f}$, $n = 0, 1, 2, \\dots$, lists all the integers. Find the $n$ with $f(n) = ${m}$.`,
        `函数 $f(n) = ${f}$，$n = 0, 1, 2, \\dots$，列出全部整数。求满足 $f(n) = ${m}$ 的 $n$。`,
      ],
      answer,
      [Math.abs(m), m > 0 ? 2 * m - 1 : -2 * m, answer + 1],
      [
        m > 0
          ? `A positive value comes from an even $n$, so $\\frac{n}{2} = ${m}$ and $n = ${answer}$.`
          : `A negative value comes from an odd $n$, so $-\\frac{n + 1}{2} = ${m}$ and $n = ${answer}$.`,
        m > 0
          ? `正值来自偶数 $n$，所以 $\\frac{n}{2} = ${m}$，$n = ${answer}$。`
          : `负值来自奇数 $n$，所以 $-\\frac{n + 1}{2} = ${m}$，$n = ${answer}$。`,
      ],
    );
  },
);

const detEffect = point(
  "how-a-row-operation-changes-the-determinant",
  ["How a row operation changes the determinant", "行运算如何改变行列式"],
  [
    "The three row operations act differently on the determinant. A swap changes its sign, scaling a row multiplies it by the scale factor, and adding a multiple of one row to another leaves it unchanged, which is why elimination can be used to compute determinants.",
    "三种行运算对行列式的作用不同。交换两行使它变号，把一行乘以常数使它乘以这个常数，把一行的倍数加到另一行则不改变它，这就是可以用消元计算行列式的原因。",
  ],
  (rng) => {
    const d = nz(rng, 12);
    const c = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
    const kind = rng.int(0, 2);
    const op = ["R_{1} \\leftrightarrow R_{3}", `${c}R_{2} \\to R_{2}`, `${poly([1, "R_{3}"], [c, "R_{1}"])} \\to R_{3}`][kind] as string;
    const answer = [-d, c * d, d][kind] as number;
    const whys: Pair[] = [
      [`A swap of two rows changes the sign of the determinant, so it becomes $${-d}$.`, `交换两行使行列式变号，所以它变为 $${-d}$。`],
      [
        `Scaling one row by $${c}$ multiplies the determinant by $${c}$, so it becomes $${c * d}$.`,
        `把一行乘以 $${c}$，行列式也乘以 $${c}$，所以它变为 $${c * d}$。`,
      ],
      [
        `Adding a multiple of one row to another leaves the determinant unchanged, so it stays $${d}$.`,
        `把一行的倍数加到另一行，行列式不变，所以它仍是 $${d}$。`,
      ],
    ];
    const why = whys[kind] as Pair;
    return ask(
      [
        `A $3 \\times 3$ matrix has determinant $${d}$. Find the determinant after the operation $${op}$.`,
        `一个 $3 \\times 3$ 矩阵的行列式是 $${d}$。求进行运算 $${op}$ 后的行列式。`,
      ],
      answer,
      [d, -d, c * d, c + d],
      why,
    );
  },
);

const columnClear = point(
  "clearing-an-entry-with-a-column-operation",
  ["Clearing an entry with a column operation", "用列运算消去元素"],
  [
    "Zeros can be created with column operations as well as row operations. The operation $C_{2} - mC_{1} \\to C_{2}$ clears the $(1, 2)$ entry when $m$ is that entry divided by the $(1, 1)$ entry, and it also changes the entry below by $m$ times the entry to its left.",
    "零元素既可以用行运算产生，也可以用列运算产生。当 $m$ 等于 $(1, 2)$ 元素除以 $(1, 1)$ 元素时，运算 $C_{2} - mC_{1} \\to C_{2}$ 消去 $(1, 2)$ 元素，同时下面的元素要减去 $m$ 乘以它左边的元素。",
  ],
  (rng) => {
    const a = nz(rng, 5);
    const m = nz(rng, 5);
    const c = nz(rng, 7);
    const d = nz(rng, 9);
    const answer = d - m * c;
    return ask(
      [
        `A column operation $C_{2} - mC_{1} \\to C_{2}$ clears the $(1, 2)$ entry of $${mat([
          [a, m * a],
          [c, d],
        ])}$. Find the new $(2, 2)$ entry.`,
        `列运算 $C_{2} - mC_{1} \\to C_{2}$ 消去 $${mat([
          [a, m * a],
          [c, d],
        ])}$ 的 $(1, 2)$ 元素。求新的 $(2, 2)$ 元素。`,
      ],
      answer,
      [d + m * c, d, d - m * a],
      [
        `Clearing requires $m = ${m}$. Then the $(2, 2)$ entry becomes $${d} - ${wrap(m)} \\cdot ${wrap(c)} = ${answer}$.`,
        `要消去该元素需 $m = ${m}$。于是 $(2, 2)$ 元素变为 $${d} - ${wrap(m)} \\cdot ${wrap(c)} = ${answer}$。`,
      ],
    );
  },
);

const breakdownK = point(
  "the-coefficient-that-makes-the-second-pivot-vanish",
  ["The coefficient that makes the second pivot vanish", "使第二个主元消失的系数"],
  [
    "Elimination on a $2 \\times 2$ system gives a second pivot that depends on the entries. Elimination breaks down exactly when this pivot is zero, which means the second row of the coefficient matrix is a multiple of the first, whatever the right-hand side is.",
    "对 $2 \\times 2$ 方程组消元，得到的第二个主元依赖于各个元素。当且仅当这个主元为零时消元失败，这意味着系数矩阵的第二行是第一行的倍数，与右端无关。",
  ],
  (rng) => {
    const a = nz(rng, 6);
    const c = nz(rng, 6);
    const b = rng.int(-9, 9);
    const d = rng.int(-9, 9);
    const answer = a * c;
    return ask(
      [
        `For which $k$ does Gaussian elimination on $\\begin{cases} ${poly([1, "x"], [a, "y"])} = ${b} \\\\ ${poly([c, "x"], [1, "ky"])} = ${d} \\end{cases}$ give a second pivot of zero?`,
        `当 $k$ 为何值时，对 $\\begin{cases} ${poly([1, "x"], [a, "y"])} = ${b} \\\\ ${poly([c, "x"], [1, "ky"])} = ${d} \\end{cases}$ 做高斯消元时第二个主元为零？`,
      ],
      answer,
      [-answer, a + c, a],
      [
        `The operation $${poly([1, "R_{2}"], [-c, "R_{1}"])} \\to R_{2}$ leaves the second pivot $k - ${wrap(c)} \\cdot ${wrap(a)}$. This is zero when $k = ${answer}$.`,
        `运算 $${poly([1, "R_{2}"], [-c, "R_{1}"])} \\to R_{2}$ 留下第二个主元 $k - ${wrap(c)} \\cdot ${wrap(a)}$。当 $k = ${answer}$ 时它为零。`,
      ],
    );
  },
);

const lineOfSolutions = point(
  "reading-a-point-on-the-solution-line",
  ["Reading a point on the solution line", "读取解直线上的点"],
  [
    "When a singular system is consistent, elimination leaves one equation, and one variable is free. Each choice of the free variable gives a solution, and the other variable is then determined, so the solutions form a line rather than a single point.",
    "当奇异方程组相容时，消元后只剩一个方程，有一个变量是自由的。自由变量的每种取值都给出一个解，另一个变量随之确定，所以解构成一条直线，而不是一个点。",
  ],
  (rng) => {
    const p = nz(rng, 4);
    const q = nz(rng, 3) * p;
    const a = nz(rng, 6);
    const b = rng.int(-9, 9);
    const Y = nz(rng, 6);
    const answer = b - a * Y;
    return ask(
      [
        `The system $\\begin{cases} ${poly([p, "x"], [p * a, "y"])} = ${p * b} \\\\ ${poly([q, "x"], [q * a, "y"])} = ${q * b} \\end{cases}$ has infinitely many solutions. Find $x$ in the solution with $y = ${Y}$.`,
        `方程组 $\\begin{cases} ${poly([p, "x"], [p * a, "y"])} = ${p * b} \\\\ ${poly([q, "x"], [q * a, "y"])} = ${q * b} \\end{cases}$ 有无穷多解。求 $y = ${Y}$ 的那个解中的 $x$。`,
      ],
      answer,
      [b + a * Y, b - Y, Y],
      [
        `Elimination leaves one equation, equivalent to $${poly([1, "x"], [a, "y"])} = ${b}$. Substituting $y = ${Y}$ gives $x = ${answer}$.`,
        `消元后只剩一个方程，等价于 $${poly([1, "x"], [a, "y"])} = ${b}$。代入 $y = ${Y}$，得 $x = ${answer}$。`,
      ],
    );
  },
);

const pairSums = point(
  "three-unknowns-from-their-pairwise-sums",
  ["Three unknowns from their pairwise sums", "由两两之和求三个未知数"],
  [
    "If the sums of three unknowns in pairs are known, elimination gives each unknown. Each appears in two of the equations, so adding all three gives twice the total, and subtracting the equation that omits a variable isolates that variable.",
    "如果已知三个未知数的两两之和，消元就能得到每个未知数。每个未知数出现在两个方程中，所以三个方程相加得到总和的两倍，再减去不含某变量的方程，就能分离出这个变量。",
  ],
  (rng) => {
    const x = rng.int(-9, 9);
    const y = rng.int(-9, 9);
    const z = rng.int(-9, 9);
    const a = x + y;
    const b = y + z;
    const c = x + z;
    const which = rng.int(0, 2);
    const answer = [x, y, z][which] as number;
    const other = [b, c, a][which] as number;
    const name = ["x", "y", "z"][which] as string;
    return ask(
      [
        `Solve $x + y = ${a}$, $y + z = ${b}$, $x + z = ${c}$. Find $${name}$.`,
        `解方程组 $x + y = ${a}$，$y + z = ${b}$，$x + z = ${c}$。求 $${name}$。`,
      ],
      answer,
      [2 * answer, Q.of(a + b + c, 2), a + b + c - other],
      [
        `Adding all three equations and halving gives $x + y + z = ${Q.of(a + b + c, 2).toLatex()}$. The equation without $${name}$ has sum $${other}$, so $${name} = ${answer}$.`,
        `三个方程相加再除以 $2$，得 $x + y + z = ${Q.of(a + b + c, 2).toLatex()}$。不含 $${name}$ 的方程之和是 $${other}$，所以 $${name} = ${answer}$。`,
      ],
    );
  },
);

const pivotAfterReducing = point(
  "pivot-columns-of-a-matrix-not-in-echelon-form",
  ["Pivot columns of a matrix not in echelon form", "非阶梯形矩阵的主元列"],
  [
    "The pivot columns of a matrix are found by reducing it, and the leading entries of the original rows do not show them. A column that is a multiple of an earlier column can never hold a pivot, since it reduces to the same multiple of the reduced column.",
    "矩阵的主元列要通过化简才能找到，原来各行的首元并不能说明它们。是前面某列倍数的列不可能含主元，因为它化简后仍是化简后那一列的同一倍数。",
  ],
  (rng) => {
    const m = nz(rng, 4);
    const p = nz(rng, 3);
    const q = rng.int(-4, 4);
    const e = rng.int(-4, 4);
    const f = rng.int(-4, 4);
    const s = nz(rng, 3);
    const u = nz(rng, 3);
    const v = nz(rng, 2);
    const column = rng.int(2, 4);
    const w = [
      [0, 1, e, f],
      [0, 0, 1, f],
      [0, 0, 0, 1],
    ][column - 2] as number[];
    const r1 = [1, m, p, q];
    const row = (k: number, l: number) => r1.map((entry, i) => k * entry + l * (w[i] as number));
    const r2 = row(s, 1);
    const r3 = row(u, v);
    return ask(
      [
        `$A = ${mat([r1, r2, r3])}$ has rank $2$. Column $1$ is a pivot column. Which column is the second pivot column?`,
        `$A = ${mat([r1, r2, r3])}$ 的秩是 $2$。第 $1$ 列是主元列。第二个主元列是哪一列？`,
      ],
      column,
      [2, 3, 4, 1],
      [
        `Eliminating below the first pivot leaves two rows proportional to $(${w.join(", ")})$. Its first nonzero entry is in column $${column}$, so the next pivot is there.`,
        `消去第一个主元下方的元素后，剩下的两行都与 $(${w.join(", ")})$ 成比例。它的第一个非零元素在第 $${column}$ 列，所以下一个主元在那里。`,
      ],
    );
  },
);

const rankDecides = point(
  "comparing-the-two-ranks-of-a-system",
  ["Comparing the two ranks of a system", "比较方程组的两个秩"],
  [
    "The number of solutions of a linear system follows from three numbers: the rank of $A$, the rank of the augmented matrix and the number of unknowns. Different ranks mean no solution. Equal ranks give one solution when they equal the number of unknowns and infinitely many otherwise.",
    "线性方程组解的个数由三个数决定：$A$ 的秩、增广矩阵的秩和未知数的个数。两个秩不同表示无解。秩相同时，若等于未知数个数则有唯一解，否则有无穷多解。",
  ],
  (rng) => {
    const m = rng.int(2, 7);
    const kind = rng.int(0, 2);
    let n: number;
    let r: number;
    let r2: number;
    if (kind === 0) {
      n = rng.int(2, 7);
      r = rng.int(1, Math.min(m - 1, n));
      r2 = r + 1;
    } else if (kind === 1) {
      n = rng.int(2, m);
      r = n;
      r2 = r;
    } else {
      n = rng.int(2, 7);
      r = rng.int(1, Math.min(m, n - 1));
      r2 = r;
    }
    const options: Pair[] = [
      ["No solution", "无解"],
      ["Exactly one solution", "恰有一个解"],
      ["Infinitely many solutions", "无穷多解"],
    ];
    const correct = options[kind] as Pair;
    const wrongs = [...options.filter((o) => o !== correct), ["Exactly two solutions", "恰有两个解"] as Pair];
    const whys: Pair[] = [
      [
        `The ranks differ, $${r} \\ne ${r2}$, so the last pivot lies in the right-hand column and the system is inconsistent.`,
        `两个秩不同，$${r} \\ne ${r2}$，所以最后一个主元在右端列，方程组不相容。`,
      ],
      [
        `Both ranks equal $${r}$, the number of unknowns, so no variable is free and the solution is unique.`,
        `两个秩都等于未知数个数 $${r}$，没有自由变量，解唯一。`,
      ],
      [
        `Both ranks equal $${r}$, less than the $${n}$ unknowns, so $${n - r}$ variables are free.`,
        `两个秩都等于 $${r}$，小于未知数个数 $${n}$，所以有 $${n - r}$ 个自由变量。`,
      ],
    ];
    return choose(
      rng,
      [
        `A system of $${m}$ equations in $${n}$ unknowns has $\\operatorname{rank}(A) = ${r}$ and $\\operatorname{rank}([A \\mid \\mathbf{b}]) = ${r2}$. How many solutions does it have?`,
        `一个有 $${m}$ 个方程、$${n}$ 个未知数的方程组满足 $\\operatorname{rank}(A) = ${r}$，$\\operatorname{rank}([A \\mid \\mathbf{b}]) = ${r2}$。它有多少个解？`,
      ],
      correct,
      wrongs,
      whys[kind] as Pair,
    );
  },
);

const detOfElementary = point(
  "the-determinant-of-an-elementary-matrix",
  ["The determinant of an elementary matrix", "初等矩阵的行列式"],
  [
    "An elementary matrix comes from doing one row operation on the identity, so its determinant records the effect of the operation. A shear has determinant $1$, a scaling has the scale factor, and a swap has $-1$, and in every case this is nonzero, so the matrix is invertible.",
    "初等矩阵由对单位矩阵做一次行运算得到，所以它的行列式记录了这个运算的效果。剪切的行列式是 $1$，缩放的行列式是缩放因子，交换的行列式是 $-1$，而且都不为零，所以矩阵可逆。",
  ],
  (rng) => {
    const c = rng.pick([-9, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]);
    const kind = rng.int(0, 4);
    const E = [
      mat([
        [1, 0],
        [c, 1],
      ]),
      mat([
        [1, c],
        [0, 1],
      ]),
      mat([
        [c, 0],
        [0, 1],
      ]),
      mat([
        [1, 0],
        [0, c],
      ]),
      mat([
        [0, 1],
        [1, 0],
      ]),
    ][kind] as string;
    const answer = [1, 1, c, c, -1][kind] as number;
    const whys: Pair[] = [
      [
        "This matrix adds a multiple of one row to the other, a shear, so its determinant is $1$.",
        "这个矩阵把一行的倍数加到另一行，是剪切，所以行列式是 $1$。",
      ],
      [
        "This matrix adds a multiple of one row to the other, a shear, so its determinant is $1$.",
        "这个矩阵把一行的倍数加到另一行，是剪切，所以行列式是 $1$。",
      ],
      [`This matrix scales one row by $${c}$, so its determinant is $${c}$.`, `这个矩阵把一行乘以 $${c}$，所以行列式是 $${c}$。`],
      [`This matrix scales one row by $${c}$, so its determinant is $${c}$.`, `这个矩阵把一行乘以 $${c}$，所以行列式是 $${c}$。`],
      ["This matrix swaps the two rows, so its determinant is $-1$.", "这个矩阵交换两行，所以行列式是 $-1$。"],
    ];
    return ask(
      [`Find the determinant of the elementary matrix $${E}$.`, `求初等矩阵 $${E}$ 的行列式。`],
      answer,
      [c, 1, -1, 0],
      whys[kind] as Pair,
    );
  },
);

const rightMultiply = point(
  "multiplying-on-the-right-acts-on-columns",
  ["Multiplying on the right acts on columns", "右乘作用于列"],
  [
    "Multiplying by an elementary matrix on the left performs a row operation, and multiplying on the right performs a column operation. So $AE$ with $E = \\begin{pmatrix} 1 & 0 \\\\ c & 1 \\end{pmatrix}$ adds $c$ times column $2$ to column $1$ of $A$, which changes the first row too.",
    "左乘初等矩阵做行运算，右乘初等矩阵做列运算。所以当 $E = \\begin{pmatrix} 1 & 0 \\\\ c & 1 \\end{pmatrix}$ 时，$AE$ 把 $A$ 的第 $2$ 列的 $c$ 倍加到第 $1$ 列，这也会改变第一行。",
  ],
  (rng) => {
    const a = nz(rng, 7);
    const b = nz(rng, 7);
    const p = rng.int(-7, 7);
    const q = rng.int(-7, 7);
    const c = nz(rng, 5);
    const answer = a + c * b;
    return ask(
      [
        `$A = ${mat([
          [a, b],
          [p, q],
        ])}$ and $E = ${mat([
          [1, 0],
          [c, 1],
        ])}$. Find the $(1, 1)$ entry of $AE$.`,
        `$A = ${mat([
          [a, b],
          [p, q],
        ])}$，$E = ${mat([
          [1, 0],
          [c, 1],
        ])}$。求 $AE$ 的 $(1, 1)$ 元素。`,
      ],
      answer,
      [a, c * a + b, a + b],
      [
        `On the right, $E$ acts on columns, adding $${c}$ times column $2$ to column $1$. So the entry is $${a} + ${wrap(c)} \\cdot ${wrap(b)} = ${answer}$.`,
        `$E$ 右乘时作用于列，把第 $2$ 列的 $${c}$ 倍加到第 $1$ 列。所以该元素是 $${a} + ${wrap(c)} \\cdot ${wrap(b)} = ${answer}$。`,
      ],
    );
  },
);

const productNotInverse = point(
  "a-product-of-eliminations-picks-up-an-extra-term",
  ["A product of eliminations picks up an extra term", "消元矩阵之积多出一项"],
  [
    "The inverse of a product of elimination matrices just collects the multipliers, which is why $L$ is easy to write. The product itself does not: the row subtracted later has already been changed, so an extra term appears when one operation builds on another.",
    "消元矩阵之积的逆矩阵只是把乘数收集起来，所以 $L$ 很容易写出。乘积本身却不是这样：后面减去的行已经被改变，所以当一个运算以另一个为基础时，会多出一项。",
  ],
  (rng) => {
    const a = nz(rng, 5);
    const b = nz(rng, 5);
    const c = nz(rng, 5);
    const answer = a * c - b;
    return ask(
      [
        `$E_{1}$, $E_{2}$, $E_{3}$ perform $${poly([1, "R_{2}"], [-a, "R_{1}"])} \\to R_{2}$, then $${poly([1, "R_{3}"], [-b, "R_{1}"])} \\to R_{3}$, then $${poly([1, "R_{3}"], [-c, "R_{2}"])} \\to R_{3}$. Find the $(3, 1)$ entry of $E_{3}E_{2}E_{1}$.`,
        `$E_{1}$、$E_{2}$、$E_{3}$ 依次进行 $${poly([1, "R_{2}"], [-a, "R_{1}"])} \\to R_{2}$、$${poly([1, "R_{3}"], [-b, "R_{1}"])} \\to R_{3}$、$${poly([1, "R_{3}"], [-c, "R_{2}"])} \\to R_{3}$。求 $E_{3}E_{2}E_{1}$ 的 $(3, 1)$ 元素。`,
      ],
      answer,
      [-b, -b - a * c, b],
      [
        `When $E_{3}$ acts, row $2$ already contains $${-a}$ times row $1$. So row $3$ gets $${-b}$ from $E_{2}$ and $${wrap(-c)} \\cdot ${wrap(-a)}$ from $E_{3}$, which is $${answer}$.`,
        `$E_{3}$ 作用时，第 $2$ 行已含第 $1$ 行的 $${-a}$ 倍。所以第 $3$ 行从 $E_{2}$ 得到 $${-b}$，从 $E_{3}$ 得到 $${wrap(-c)} \\cdot ${wrap(-a)}$，共 $${answer}$。`,
      ],
    );
  },
);

const nullVectorOfSingular = point(
  "a-nonzero-solution-of-a-singular-system",
  ["A nonzero solution of a singular system", "奇异方程组的非零解"],
  [
    "A $2 \\times 2$ matrix fails to be invertible exactly when $A\\mathbf{x} = \\mathbf{0}$ has a nonzero solution. When one column is a multiple of the other, this multiple gives such a solution directly, so the determinant does not need to be computed first.",
    "$2 \\times 2$ 矩阵不可逆，当且仅当 $A\\mathbf{x} = \\mathbf{0}$ 有非零解。当一列是另一列的倍数时，这个倍数直接给出这样的解，所以不必先计算行列式。",
  ],
  (rng) => {
    const a = nz(rng, 6);
    const c = nz(rng, 6);
    const t = nz(rng, 6);
    return ask(
      [
        `$A = ${mat([
          [a, -a * t],
          [c, -c * t],
        ])}$ is singular. Find $t$ so that $${vec("t", 1)}$ solves $A\\mathbf{x} = \\mathbf{0}$.`,
        `$A = ${mat([
          [a, -a * t],
          [c, -c * t],
        ])}$ 是奇异矩阵。求 $t$，使 $${vec("t", 1)}$ 是 $A\\mathbf{x} = \\mathbf{0}$ 的解。`,
      ],
      t,
      [-t, a, c],
      [
        `The first equation is $${poly([a, "t"], [-a * t, ""])} = 0$, which gives $t = ${t}$. The second equation agrees, since the rows are proportional.`,
        `第一个方程是 $${poly([a, "t"], [-a * t, ""])} = 0$，得 $t = ${t}$。第二个方程也一致，因为两行成比例。`,
      ],
    );
  },
);

const blockInverse = point(
  "the-inverse-of-a-block-diagonal-matrix",
  ["The inverse of a block diagonal matrix", "分块对角矩阵的逆"],
  [
    "When a matrix has a block in the upper left and a separate entry at the lower right, row operations never mix them. So the inverse is found block by block, with the usual $2 \\times 2$ formula for the first block, and no full reduction of $[A \\mid I]$ is needed.",
    "当矩阵左上角有一个块、右下角有一个单独元素时，行运算不会把它们混在一起。所以逆矩阵可以逐块求出，第一块用通常的 $2 \\times 2$ 公式，不需要完整化简 $[A \\mid I]$。",
  ],
  (rng) => {
    const a = nz(rng, 5);
    const b = nz(rng, 5);
    const c = nz(rng, 5);
    const d0 = nz(rng, 5);
    const d = a * d0 === b * c ? d0 + 1 : d0;
    const e = nz(rng, 6);
    const det = a * d - b * c;
    const first = rng.bool();
    const answer = first ? Q.of(-b, det) : Q.of(-c, det);
    const where = first ? "(1, 2)" : "(2, 1)";
    return ask(
      [
        `Find the $${where}$ entry of $A^{-1}$ for $A = ${mat([
          [a, b, 0],
          [c, d, 0],
          [0, 0, e],
        ])}$.`,
        `对 $A = ${mat([
          [a, b, 0],
          [c, d, 0],
          [0, 0, e],
        ])}$，求 $A^{-1}$ 的 $${where}$ 元素。`,
      ],
      answer,
      [answer.neg(), first ? -b : -c, Q.of(1, e)],
      [
        `The upper left block has determinant $${det}$, and its inverse is $${det === 1 ? "" : `\\frac{1}{${det}}`}${mat([
          [d, -b],
          [-c, a],
        ])}$. So this entry is $${answer.toLatex()}$.`,
        `左上角的块的行列式是 $${det}$，其逆矩阵是 $${det === 1 ? "" : `\\frac{1}{${det}}`}${mat([
          [d, -b],
          [-c, a],
        ])}$。所以该元素是 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const triangularTrace = point(
  "the-trace-of-the-inverse-of-a-triangular-matrix",
  ["The trace of the inverse of a triangular matrix", "三角矩阵的逆的迹"],
  [
    "The inverse of an invertible triangular matrix is triangular as well, and each of its diagonal entries is the reciprocal of the corresponding entry. So the trace of the inverse needs only the diagonal, and entries off the diagonal play no part.",
    "可逆三角矩阵的逆矩阵也是三角矩阵，它的每个对角元素都是相应元素的倒数。所以逆矩阵的迹只需要对角元素，对角线外的元素不起作用。",
  ],
  (rng) => {
    const pool = [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6];
    const d1 = rng.pick(pool);
    const d2 = rng.pick(pool);
    const d3 = rng.pick(pool);
    const answer = Q.of(1, d1).add(Q.of(1, d2)).add(Q.of(1, d3));
    const U = mat([
      [d1, nz(rng, 5), nz(rng, 5)],
      [0, d2, nz(rng, 5)],
      [0, 0, d3],
    ]);
    return ask(
      [`Find the trace of $U^{-1}$ for $U = ${U}$.`, `对 $U = ${U}$，求 $U^{-1}$ 的迹。`],
      answer,
      [d1 + d2 + d3, Q.of(1, d1 * d2 * d3), answer.neg()],
      [
        `The diagonal entries of $U^{-1}$ are the reciprocals $${Q.of(1, d1).toLatex()}$, $${Q.of(1, d2).toLatex()}$ and $${Q.of(1, d3).toLatex()}$. Their sum is $${answer.toLatex()}$.`,
        `$U^{-1}$ 的对角元素是倒数 $${Q.of(1, d1).toLatex()}$、$${Q.of(1, d2).toLatex()}$ 和 $${Q.of(1, d3).toLatex()}$。它们的和是 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const recoverFromLu = point(
  "an-entry-of-a-from-its-factors",
  ["An entry of A from its factors", "由因子求 A 的元素"],
  [
    "Since $L$ is lower triangular and $U$ is upper triangular, the sum for an entry of $A = LU$ stops early. The $(3, 2)$ entry uses only the first two columns of row $3$ of $L$, so it is $l_{31}u_{12} + l_{32}u_{22}$.",
    "由于 $L$ 是下三角矩阵，$U$ 是上三角矩阵，$A = LU$ 的元素的和式会提前终止。$(3, 2)$ 元素只用到 $L$ 第 $3$ 行的前两列，所以等于 $l_{31}u_{12} + l_{32}u_{22}$。",
  ],
  (rng) => {
    const l21 = nz(rng, 4);
    const l31 = nz(rng, 4);
    const l32 = nz(rng, 4);
    const u11 = nz(rng, 5);
    const u12 = nz(rng, 5);
    const u13 = nz(rng, 5);
    const u22 = nz(rng, 5);
    const u23 = nz(rng, 5);
    const u33 = nz(rng, 5);
    const answer = l31 * u12 + l32 * u22;
    return ask(
      [
        `$L = ${mat([
          [1, 0, 0],
          [l21, 1, 0],
          [l31, l32, 1],
        ])}$ and $U = ${mat([
          [u11, u12, u13],
          [0, u22, u23],
          [0, 0, u33],
        ])}$. Find the $(3, 2)$ entry of $A = LU$.`,
        `$L = ${mat([
          [1, 0, 0],
          [l21, 1, 0],
          [l31, l32, 1],
        ])}$，$U = ${mat([
          [u11, u12, u13],
          [0, u22, u23],
          [0, 0, u33],
        ])}$。求 $A = LU$ 的 $(3, 2)$ 元素。`,
      ],
      answer,
      [l32 * u22, l31 * u12, l31 * u13 + l32 * u23],
      [
        `Multiply row $3$ of $L$ by column $2$ of $U$: $${wrap(l31)} \\cdot ${wrap(u12)} + ${wrap(l32)} \\cdot ${wrap(u22)} + 1 \\cdot 0 = ${answer}$.`,
        `用 $L$ 的第 $3$ 行乘以 $U$ 的第 $2$ 列：$${wrap(l31)} \\cdot ${wrap(u12)} + ${wrap(l32)} \\cdot ${wrap(u22)} + 1 \\cdot 0 = ${answer}$。`,
      ],
    );
  },
);

const pivotFromMinors = point(
  "a-pivot-from-leading-minors",
  ["A pivot from leading minors", "由顺序主子式求主元"],
  [
    "With $L$ unit lower triangular, the determinant of the leading $k \\times k$ block of $A$ is the product of the first $k$ pivots. So each pivot is a ratio of consecutive leading minors, and LU without row swaps exists only when these minors are nonzero.",
    "当 $L$ 是单位下三角矩阵时，$A$ 的前 $k \\times k$ 块的行列式等于前 $k$ 个主元之积。所以每个主元都是相邻顺序主子式之比，只有这些主子式都不为零时，才存在不做行交换的 LU 分解。",
  ],
  (rng) => {
    const d1 = nz(rng, 9);
    const d2 = nz(rng, 12);
    const d3 = nz(rng, 20);
    const answer = Q.of(d3, d2);
    return ask(
      [
        `$A = LU$ with $L$ unit lower triangular. The leading minors of sizes $1$, $2$, $3$ are $${d1}$, $${d2}$ and $${d3}$. Find $u_{33}$.`,
        `$A = LU$，其中 $L$ 是单位下三角矩阵。$1$、$2$、$3$ 阶顺序主子式分别是 $${d1}$、$${d2}$ 和 $${d3}$。求 $u_{33}$。`,
      ],
      answer,
      [d3, d3 - d2, Q.of(d2, d3)],
      [
        `The leading minors are the products $u_{11}$, $u_{11}u_{22}$ and $u_{11}u_{22}u_{33}$. Dividing the last by the one before gives $u_{33} = ${answer.toLatex()}$.`,
        `顺序主子式是乘积 $u_{11}$、$u_{11}u_{22}$ 和 $u_{11}u_{22}u_{33}$。用最后一个除以前一个，得 $u_{33} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const transposeSolve = point(
  "solving-with-the-transpose-using-the-same-factors",
  ["Solving with the transpose using the same factors", "用同样的因子解转置方程组"],
  [
    "If $A = LU$, then $A^{T} = U^{T}L^{T}$, so the same factors also solve $A^{T}\\mathbf{x} = \\mathbf{b}$. Now the order changes: first solve $U^{T}\\mathbf{z} = \\mathbf{b}$, which is lower triangular, and then $L^{T}\\mathbf{x} = \\mathbf{z}$, which is upper triangular.",
    "如果 $A = LU$，则 $A^{T} = U^{T}L^{T}$，所以同样的因子也能解 $A^{T}\\mathbf{x} = \\mathbf{b}$。此时顺序改变：先解下三角的 $U^{T}\\mathbf{z} = \\mathbf{b}$，再解上三角的 $L^{T}\\mathbf{x} = \\mathbf{z}$。",
  ],
  (rng) => {
    const l = nz(rng, 4);
    const a = nz(rng, 4);
    const b = nz(rng, 4);
    const d = nz(rng, 4);
    const x1 = rng.int(-6, 6);
    const x2 = rng.int(-6, 6);
    const z1 = x1 + l * x2;
    const z2 = x2;
    const b1 = a * z1;
    const b2 = b * z1 + d * z2;
    return ask(
      [
        `$A = LU$ with $L = ${mat([
          [1, 0],
          [l, 1],
        ])}$ and $U = ${mat([
          [a, b],
          [0, d],
        ])}$. Solve $A^{T}\\mathbf{x} = ${vec(b1, b2)}$ and find $x_{1}$.`,
        `$A = LU$，其中 $L = ${mat([
          [1, 0],
          [l, 1],
        ])}$，$U = ${mat([
          [a, b],
          [0, d],
        ])}$。解 $A^{T}\\mathbf{x} = ${vec(b1, b2)}$，求 $x_{1}$。`,
      ],
      x1,
      [x2, z1, -x1],
      [
        `$U^{T}\\mathbf{z} = \\mathbf{b}$ gives $z_{1} = ${z1}$ and $z_{2} = ${z2}$. Then $L^{T}\\mathbf{x} = \\mathbf{z}$ gives $x_{2} = ${x2}$ and $x_{1} = ${z1} - ${wrap(l)} \\cdot ${wrap(x2)} = ${x1}$.`,
        `由 $U^{T}\\mathbf{z} = \\mathbf{b}$ 得 $z_{1} = ${z1}$，$z_{2} = ${z2}$。再由 $L^{T}\\mathbf{x} = \\mathbf{z}$ 得 $x_{2} = ${x2}$，$x_{1} = ${z1} - ${wrap(l)} \\cdot ${wrap(x2)} = ${x1}$。`,
      ],
    );
  },
);

const subspaceK = point(
  "the-value-that-makes-a-plane-a-subspace",
  ["The value that makes a plane a subspace", "使平面成为子空间的值"],
  [
    "Every subspace contains the zero vector, so a plane $ax + by + cz = d$ can be a subspace only when $d = 0$. A parameter on the right-hand side therefore has exactly one good value, namely the one that makes the right-hand side vanish.",
    "每个子空间都含零向量，所以平面 $ax + by + cz = d$ 只有在 $d = 0$ 时才可能是子空间。因此右端的参数恰有一个合适的值，就是使右端为零的那个值。",
  ],
  (rng) => {
    const a = nz(rng, 5);
    const b = nz(rng, 5);
    const c = nz(rng, 5);
    const m = nz(rng, 12);
    return ask(
      [
        `For which $k$ is $\\{(x, y, z) \\mid ${poly([a, "x"], [b, "y"], [c, "z"])} = ${poly([1, "k"], [-m, ""])}\\}$ a subspace of $\\mathbb{R}^{3}$?`,
        `当 $k$ 为何值时，$\\{(x, y, z) \\mid ${poly([a, "x"], [b, "y"], [c, "z"])} = ${poly([1, "k"], [-m, ""])}\\}$ 是 $\\mathbb{R}^{3}$ 的子空间？`,
      ],
      m,
      [0, -m, a + b + c === m ? m + 1 : a + b + c],
      [
        `The zero vector must satisfy the equation, which forces $${poly([1, "k"], [-m, ""])} = 0$, so $k = ${m}$. Then the plane passes through the origin and is closed under both operations.`,
        `零向量必须满足方程，这迫使 $${poly([1, "k"], [-m, ""])} = 0$，所以 $k = ${m}$。此时平面过原点，且对两种运算封闭。`,
      ],
    );
  },
);

const inColumnSpace = point(
  "the-value-that-puts-a-vector-in-the-column-space",
  ["The value that puts a vector in the column space", "使向量落入列空间的值"],
  [
    "If the second column of a $2 \\times 2$ matrix is a multiple of the first, the column space is a line through the origin. A vector lies in it only when it is a multiple of the first column, and this condition on the entries determines the unknown.",
    "如果 $2 \\times 2$ 矩阵的第二列是第一列的倍数，列空间就是一条过原点的直线。向量位于其中，当且仅当它是第一列的倍数，这个关于元素的条件确定了未知数。",
  ],
  (rng) => {
    const a = nz(rng, 5);
    const c = nz(rng, 5);
    const m = nz(rng, 4);
    const t = nz(rng, 6);
    const answer = c * t;
    return ask(
      [
        `Find $k$ so that $${vec(a * t, "k")}$ lies in the column space of $${mat([
          [a, m * a],
          [c, m * c],
        ])}$.`,
        `求 $k$，使 $${vec(a * t, "k")}$ 位于 $${mat([
          [a, m * a],
          [c, m * c],
        ])}$ 的列空间中。`,
      ],
      answer,
      [t, c, -answer],
      [
        `Column $2$ is $${m}$ times column $1$, so the column space is the line through $${vec(a, c)}$. The first entry requires the factor $${t}$, so $k = ${wrap(t)} \\cdot ${wrap(c)} = ${answer}$.`,
        `第 $2$ 列是第 $1$ 列的 $${m}$ 倍，所以列空间是过 $${vec(a, c)}$ 的直线。由第一个元素知因子是 $${t}$，所以 $k = ${wrap(t)} \\cdot ${wrap(c)} = ${answer}$。`,
      ],
    );
  },
);

const nullReverse = point(
  "an-entry-from-a-null-space-vector",
  ["An entry from a null space vector", "由零空间向量求元素"],
  [
    "A vector in the null space is orthogonal to every row of the matrix. So a known null space vector gives one equation for each row, and this can be used in reverse to find an unknown entry in the matrix from its null space.",
    "零空间中的向量与矩阵的每一行都正交。所以已知的零空间向量给每一行提供一个方程，反过来可以由零空间求矩阵中的未知元素。",
  ],
  (rng) => {
    const a = nz(rng, 6);
    const b = nz(rng, 6);
    const u = nz(rng, 5);
    const v = nz(rng, 5);
    const answer = -(a * u + b * v);
    return ask(
      [
        `$${vec(u, v, 1)}$ lies in the null space of $A = ${mat([[a, b, "k"]])}$. Find $k$.`,
        `$${vec(u, v, 1)}$ 位于 $A = ${mat([[a, b, "k"]])}$ 的零空间中。求 $k$。`,
      ],
      answer,
      [-answer, a * u - b * v, a + b],
      [
        `The product must vanish: $${wrap(a)} \\cdot ${wrap(u)} + ${wrap(b)} \\cdot ${wrap(v)} + k = 0$. So $k = ${answer}$.`,
        `乘积必须为零：$${wrap(a)} \\cdot ${wrap(u)} + ${wrap(b)} \\cdot ${wrap(v)} + k = 0$。所以 $k = ${answer}$。`,
      ],
    );
  },
);

const scaledBasis = point(
  "coordinates-after-scaling-a-basis",
  ["Coordinates after scaling a basis", "缩放基之后的坐标"],
  [
    "Coordinates change in the opposite way to the basis. If a basis vector is multiplied by $c$, the same vector needs $\\frac{1}{c}$ as much of it, so the coordinate is divided by $c$. Multiplying the coordinate instead would change the vector.",
    "坐标的变化与基相反。如果基向量乘以 $c$，同一个向量只需要它的 $\\frac{1}{c}$，所以坐标要除以 $c$。若把坐标也乘以 $c$，向量就变了。",
  ],
  (rng) => {
    const pool = [-5, -4, -3, -2, 2, 3, 4, 5];
    const c = rng.pick(pool);
    const d = rng.pick(pool);
    const p = nz(rng, 12);
    const q = nz(rng, 12);
    const first = rng.bool();
    const answer = first ? Q.of(p, c) : Q.of(q, d);
    const name: Pair = first ? ["first", "第一"] : ["second", "第二"];
    return ask(
      [
        `The coordinates of $\\mathbf{x}$ in the basis $\\{\\mathbf{b}_{1}, \\mathbf{b}_{2}\\}$ are $(${p}, ${q})$. Find the ${name[0]} coordinate of $\\mathbf{x}$ in the basis $\\{${c}\\mathbf{b}_{1}, ${d}\\mathbf{b}_{2}\\}$.`,
        `$\\mathbf{x}$ 在基 $\\{\\mathbf{b}_{1}, \\mathbf{b}_{2}\\}$ 下的坐标是 $(${p}, ${q})$。求 $\\mathbf{x}$ 在基 $\\{${c}\\mathbf{b}_{1}, ${d}\\mathbf{b}_{2}\\}$ 下的${name[1]}个坐标。`,
      ],
      answer,
      [first ? p * c : q * d, first ? p : q, answer.neg()],
      [
        `$\\mathbf{x} = ${poly([p, "\\mathbf{b}_{1}"], [q, "\\mathbf{b}_{2}"])}$. Writing this in terms of the new vectors divides each coefficient by the factor of its vector, which gives $${answer.toLatex()}$.`,
        `$\\mathbf{x} = ${poly([p, "\\mathbf{b}_{1}"], [q, "\\mathbf{b}_{2}"])}$。用新向量表示时，每个系数都要除以相应向量的因子，得 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const betweenBases = point(
  "from-one-basis-to-another",
  ["From one basis to another", "从一个基到另一个基"],
  [
    "To change between two nonstandard bases, go through the standard coordinates. First use the old basis to rebuild the actual vector, and then solve for the coordinates in the new basis. The coordinates in the old basis cannot simply be reused.",
    "在两个非标准基之间转换时，要经过标准坐标。先用旧基还原出实际的向量，再求它在新基下的坐标。旧基下的坐标不能直接拿来用。",
  ],
  (rng) => {
    const a = nz(rng, 4);
    const b = nz(rng, 4);
    const c = nz(rng, 4);
    const d0 = nz(rng, 4);
    const d = a * d0 === b * c ? d0 + 1 : d0;
    const p = nz(rng, 5);
    const q = nz(rng, 5);
    const x1 = p * a + q * c;
    const x2 = p * b + q * d;
    const first = rng.bool();
    const answer = first ? x1 - x2 : x2;
    const name: Pair = first ? ["first", "第一"] : ["second", "第二"];
    return ask(
      [
        `$\\mathbf{x}$ has coordinates $(${p}, ${q})$ in the basis $\\mathcal{B} = \\left\\{${vec(a, b)}, ${vec(c, d)}\\right\\}$. Find its ${name[0]} coordinate in the basis $\\mathcal{C} = \\left\\{${vec(1, 0)}, ${vec(1, 1)}\\right\\}$.`,
        `$\\mathbf{x}$ 在基 $\\mathcal{B} = \\left\\{${vec(a, b)}, ${vec(c, d)}\\right\\}$ 下的坐标是 $(${p}, ${q})$。求它在基 $\\mathcal{C} = \\left\\{${vec(1, 0)}, ${vec(1, 1)}\\right\\}$ 下的${name[1]}个坐标。`,
      ],
      answer,
      [first ? p : q, first ? x1 : x1 - x2, -answer],
      [
        `The vector is $${vec(x1, x2)}$. In $\\mathcal{C}$, the coordinates $y_{1}, y_{2}$ satisfy $y_{1} + y_{2} = ${x1}$ and $y_{2} = ${x2}$, so $y_{1} = ${x1 - x2}$ and $y_{2} = ${x2}$.`,
        `这个向量是 $${vec(x1, x2)}$。在 $\\mathcal{C}$ 下，坐标 $y_{1}, y_{2}$ 满足 $y_{1} + y_{2} = ${x1}$，$y_{2} = ${x2}$，所以 $y_{1} = ${x1 - x2}$，$y_{2} = ${x2}$。`,
      ],
    );
  },
);

const solvableDimension = point(
  "the-dimension-of-the-reachable-right-hand-sides",
  ["The dimension of the reachable right-hand sides", "可达右端的维数"],
  [
    "The right-hand sides $\\mathbf{b}$ for which $A\\mathbf{x} = \\mathbf{b}$ is solvable form the column space, whose dimension is the rank. By rank-nullity, a nonzero null space shrinks it, so a singular square matrix cannot reach every right-hand side.",
    "使 $A\\mathbf{x} = \\mathbf{b}$ 有解的右端 $\\mathbf{b}$ 构成列空间，其维数是秩。由秩-零化度定理，非零的零空间会使它缩小，所以奇异方阵不能达到每个右端。",
  ],
  (rng) => {
    const n = rng.int(3, 12);
    const p = rng.int(1, n - 1);
    const answer = n - p;
    return ask(
      [
        `$A$ is a square matrix of size $${n} \\times ${n}$ with $\\dim \\operatorname{Null}(A) = ${p}$. Find the dimension of the set of all $\\mathbf{b}$ for which $A\\mathbf{x} = \\mathbf{b}$ has a solution.`,
        `$A$ 是 $${n} \\times ${n}$ 矩阵，$\\dim \\operatorname{Null}(A) = ${p}$。求使 $A\\mathbf{x} = \\mathbf{b}$ 有解的所有 $\\mathbf{b}$ 构成的集合的维数。`,
      ],
      answer,
      [p, n, n + p],
      [
        `That set is the column space, whose dimension is the rank. By rank-nullity the rank is $${n} - ${p} = ${answer}$.`,
        `这个集合就是列空间，其维数是秩。由秩-零化度定理，秩是 $${n} - ${p} = ${answer}$。`,
      ],
    );
  },
);

const shiftedSpace = point(
  "the-zero-and-inverses-of-a-shifted-vector-space",
  ["The zero and inverses of a shifted vector space", "平移向量空间的零元和逆元"],
  [
    "With unusual operations, the zero vector need not be the number $0$. It is whichever element leaves every other element unchanged under the given addition. The additive inverse of an element is then whatever adds to it to give this zero, not to give $0$.",
    "在非常规运算下，零向量不一定是数 $0$。它是在给定加法下使其他元素都不变的那个元素。元素的加法逆元则是与它相加得到这个零元的元素，而不是得到 $0$。",
  ],
  (rng) => {
    const k = nz(rng, 9);
    const a = rng.int(-12, 12);
    const op = `x \\oplus y = ${poly([1, "x"], [1, "y"], [-k, ""])}`;
    if (rng.bool()) {
      return ask(
        [
          `$\\mathbb{R}$ is made into a vector space with the addition $${op}$. Find its zero vector.`,
          `用加法 $${op}$ 把 $\\mathbb{R}$ 变成向量空间。求它的零向量。`,
        ],
        k,
        [0, -k, 2 * k],
        [
          `The zero vector $z$ needs $x \\oplus z = x$ for all $x$, that is $${poly([1, "x"], [1, "z"], [-k, ""])} = x$. So $z = ${k}$.`,
          `零向量 $z$ 要对所有 $x$ 满足 $x \\oplus z = x$，即 $${poly([1, "x"], [1, "z"], [-k, ""])} = x$。所以 $z = ${k}$。`,
        ],
      );
    }
    const answer = 2 * k - a;
    return ask(
      [
        `$\\mathbb{R}$ is made into a vector space with the addition $${op}$. Find the additive inverse of $${a}$.`,
        `用加法 $${op}$ 把 $\\mathbb{R}$ 变成向量空间。求 $${a}$ 的加法逆元。`,
      ],
      answer,
      [-a, k - a, a - 2 * k],
      [
        `The zero vector is $${k}$, since adding it changes nothing. We need $${a} \\oplus y = ${k}$, that is $${a} + y - ${wrap(k)} = ${k}$, so $y = ${answer}$.`,
        `零向量是 $${k}$，因为加上它不改变任何元素。需要 $${a} \\oplus y = ${k}$，即 $${a} + y - ${wrap(k)} = ${k}$，所以 $y = ${answer}$。`,
      ],
    );
  },
);

const useBasisMatrix = point(
  "using-a-matrix-relative-to-a-basis",
  ["Using a matrix relative to a basis", "使用相对于基的矩阵"],
  [
    "The columns of $[T]_{\\mathcal{B}}$ are the coordinates of $T(\\mathbf{b}_{j})$ in the basis, so the matrix acts on coordinates and returns coordinates. To get an actual vector, the output must be turned back into a combination of the basis vectors.",
    "$[T]_{\\mathcal{B}}$ 的各列是 $T(\\mathbf{b}_{j})$ 在基下的坐标，所以矩阵作用于坐标并返回坐标。要得到实际的向量，必须把输出还原成基向量的线性组合。",
  ],
  (rng) => {
    const b11 = nz(rng, 4);
    const b21 = nz(rng, 4);
    const b12 = nz(rng, 4);
    const b20 = nz(rng, 4);
    const b22 = b11 * b20 === b12 * b21 ? b20 + 1 : b20;
    const p = nz(rng, 5);
    const q = nz(rng, 5);
    const r = nz(rng, 5);
    const s = nz(rng, 5);
    const answer = (p + q) * b11 + (r + s) * b12;
    return ask(
      [
        `$[T]_{\\mathcal{B}} = ${mat([
          [p, q],
          [r, s],
        ])}$ in the basis $\\mathbf{b}_{1} = ${vec(b11, b21)}$, $\\mathbf{b}_{2} = ${vec(b12, b22)}$. Find the first entry of $T(\\mathbf{b}_{1} + \\mathbf{b}_{2})$.`,
        `在基 $\\mathbf{b}_{1} = ${vec(b11, b21)}$，$\\mathbf{b}_{2} = ${vec(b12, b22)}$ 下，$[T]_{\\mathcal{B}} = ${mat([
          [p, q],
          [r, s],
        ])}$。求 $T(\\mathbf{b}_{1} + \\mathbf{b}_{2})$ 的第一个元素。`,
      ],
      answer,
      [(p + r) * b11 + (q + s) * b12, p + q + r + s, -answer],
      [
        `The coordinates of $\\mathbf{b}_{1} + \\mathbf{b}_{2}$ are $(1, 1)$, so the output has coordinates $(${p + q}, ${r + s})$. Its first entry is $${wrap(p + q)} \\cdot ${wrap(b11)} + ${wrap(r + s)} \\cdot ${wrap(b12)} = ${answer}$.`,
        `$\\mathbf{b}_{1} + \\mathbf{b}_{2}$ 的坐标是 $(1, 1)$，所以输出的坐标是 $(${p + q}, ${r + s})$。它的第一个元素是 $${wrap(p + q)} \\cdot ${wrap(b11)} + ${wrap(r + s)} \\cdot ${wrap(b12)} = ${answer}$。`,
      ],
    );
  },
);

const derivativeShifted = point(
  "the-derivative-with-a-shifted-target-basis",
  ["The derivative with a shifted target basis", "目标基平移后的导数矩阵"],
  [
    "Each column of a matrix relative to two bases holds the coordinates of an image in the target basis. With the target basis $\\{1, x - c\\}$, the polynomial $2x$ must first be rewritten as $2(x - c) + 2c$, so a constant appears that the standard basis does not show.",
    "相对于两个基的矩阵，每一列都是像在目标基下的坐标。目标基是 $\\{1, x - c\\}$ 时，多项式 $2x$ 必须先改写成 $2(x - c) + 2c$，于是出现一个在标准基下看不到的常数。",
  ],
  (rng) => {
    const c = nz(rng, 9);
    const k = nz(rng, 5);
    const answer = 2 * k * c;
    return ask(
      [
        `$T: P_{2} \\to P_{1}$ is $T(p) = ${poly([k, "p'"])}$, with bases $\\{1, x, x^{2}\\}$ and $\\{1, ${poly([1, "x"], [-c, ""])}\\}$. Find the $(1, 3)$ entry of its matrix.`,
        `$T: P_{2} \\to P_{1}$ 是 $T(p) = ${poly([k, "p'"])}$，基分别是 $\\{1, x, x^{2}\\}$ 和 $\\{1, ${poly([1, "x"], [-c, ""])}\\}$。求它的矩阵的 $(1, 3)$ 元素。`,
      ],
      answer,
      [2 * k, -answer, 2 * c],
      [
        `$T(x^{2}) = ${poly([2 * k, "x"])} = ${poly([2 * k, ""])}(${poly([1, "x"], [-c, ""])}) + ${wrap(answer)}$. The coefficient of $1$ is the first entry of the column, so the entry is $${answer}$.`,
        `$T(x^{2}) = ${poly([2 * k, "x"])} = ${poly([2 * k, ""])}(${poly([1, "x"], [-c, ""])}) + ${wrap(answer)}$。$1$ 的系数是这一列的第一个元素，所以该元素是 $${answer}$。`,
      ],
    );
  },
);

const entryFromEigenvector = point(
  "a-matrix-entry-from-an-eigenvector",
  ["A matrix entry from an eigenvector", "由特征向量求矩阵元素"],
  [
    "A known eigenvector gives two equations, one for each row. If one row is fully known, it gives the eigenvalue directly, and then the other row determines an unknown entry. The eigenvalue does not need to be given in advance.",
    "已知的特征向量给出两个方程，每行一个。如果有一行完全已知，它直接给出特征值，另一行就能确定未知元素。特征值不需要事先给出。",
  ],
  (rng) => {
    const a = nz(rng, 6);
    const b = nz(rng, 5);
    const m = nz(rng, 4);
    const k = nz(rng, 9);
    const lambda = a + b * m;
    const c = lambda * m - k * m;
    return ask(
      [
        `$${vec(1, m)}$ is an eigenvector of $${mat([
          [a, b],
          [c, "t"],
        ])}$. Find $t$.`,
        `$${vec(1, m)}$ 是 $${mat([
          [a, b],
          [c, "t"],
        ])}$ 的特征向量。求 $t$。`,
      ],
      k,
      [lambda, -k, lambda === a ? a + 1 : a],
      [
        `The first row gives $\\lambda = ${a} + ${wrap(b)} \\cdot ${wrap(m)} = ${lambda}$. The second row gives $${poly([m, "t"], [c, ""])} = ${lambda * m}$, so $t = ${k}$.`,
        `第一行给出 $\\lambda = ${a} + ${wrap(b)} \\cdot ${wrap(m)} = ${lambda}$。第二行给出 $${poly([m, "t"], [c, ""])} = ${lambda * m}$，所以 $t = ${k}$。`,
      ],
    );
  },
);

const lastEigenvector = point(
  "the-last-eigenvector-of-a-triangular-matrix",
  ["The last eigenvector of a triangular matrix", "三角矩阵的最后一个特征向量"],
  [
    "For an upper triangular matrix, the eigenvector of the last diagonal entry has every component in play. Set the last component to $1$ and work upward: each row then gives one component, which depends on those below it found earlier.",
    "对上三角矩阵，最后一个对角元素的特征向量的所有分量都起作用。令最后一个分量为 $1$，然后向上计算：每一行给出一个分量，它依赖于前面已求出的下方的分量。",
  ],
  (rng) => {
    const a11 = rng.int(-6, 6);
    const a22 = rng.pick([-7, -5, -3, -1, 2, 4, 6].filter((v) => v !== a11));
    const a33 = rng.pick([-8, -4, -2, 1, 3, 5, 7, 8].filter((v) => v !== a11 && v !== a22));
    const x1 = nz(rng, 5);
    const x2 = nz(rng, 5);
    const a12 = nz(rng, 4);
    const a23 = (a33 - a22) * x2;
    const a13 = (a33 - a11) * x1 - a12 * x2;
    return ask(
      [
        `$${vec("x_{1}", "x_{2}", 1)}$ is an eigenvector of $${mat([
          [a11, a12, a13],
          [0, a22, a23],
          [0, 0, a33],
        ])}$ for $\\lambda = ${a33}$. Find $x_{1}$.`,
        `$${vec("x_{1}", "x_{2}", 1)}$ 是 $${mat([
          [a11, a12, a13],
          [0, a22, a23],
          [0, 0, a33],
        ])}$ 关于 $\\lambda = ${a33}$ 的特征向量。求 $x_{1}$。`,
      ],
      x1,
      [x2, -x1, a13],
      [
        `Row $2$ of $A - ${wrap(a33)}I$ gives $${poly([a22 - a33, "x_{2}"], [a23, ""])} = 0$, so $x_{2} = ${x2}$. Row $1$ then gives $${poly([a11 - a33, "x_{1}"], [a12 * x2 + a13, ""])} = 0$, so $x_{1} = ${x1}$.`,
        `$A - ${wrap(a33)}I$ 的第 $2$ 行给出 $${poly([a22 - a33, "x_{2}"], [a23, ""])} = 0$，所以 $x_{2} = ${x2}$。第 $1$ 行再给出 $${poly([a11 - a33, "x_{1}"], [a12 * x2 + a13, ""])} = 0$，所以 $x_{1} = ${x1}$。`,
      ],
    );
  },
);

const geometricMult = point(
  "a-single-entry-decides-the-geometric-multiplicity",
  ["A single entry decides the geometric multiplicity", "一个元素决定几何重数"],
  [
    "A repeated eigenvalue may have fewer independent eigenvectors than its multiplicity. The geometric multiplicity is $3$ minus the rank of $A - \\lambda I$. In a triangular matrix, one entry above the diagonal can raise that rank and remove an eigenvector.",
    "重特征值的线性无关特征向量可能少于其重数。几何重数等于 $3$ 减去 $A - \\lambda I$ 的秩。在三角矩阵中，对角线上方的一个元素就能提高这个秩，并减少一个特征向量。",
  ],
  (rng) => {
    const l = nz(rng, 6);
    const mu = rng.pick([-7, -5, -2, 1, 3, 4, 7, 8].filter((v) => v !== l));
    const zero = rng.bool();
    const a = zero ? 0 : nz(rng, 5);
    const b = nz(rng, 5);
    const k = nz(rng, 5);
    const answer = zero ? 2 : 1;
    return ask(
      [
        `Find the geometric multiplicity of the eigenvalue $${l}$ of $${mat([
          [l, a, b],
          [0, l, k],
          [0, 0, mu],
        ])}$.`,
        `求 $${mat([
          [l, a, b],
          [0, l, k],
          [0, 0, mu],
        ])}$ 的特征值 $${l}$ 的几何重数。`,
      ],
      answer,
      [3, zero ? 1 : 2, 0],
      zero
        ? [
            "In $A - \\lambda I$ the first two columns are zero, and all the rows are multiples of one row. So the rank is $1$ and the geometric multiplicity is $2$.",
            "在 $A - \\lambda I$ 中，前两列为零，各行都是同一行的倍数。所以秩是 $1$，几何重数是 $2$。",
          ]
        : [
            "In $A - \\lambda I$ the nonzero $(1, 2)$ entry and the nonzero $(3, 3)$ entry give two pivots. So the rank is $2$ and the geometric multiplicity is $1$.",
            "在 $A - \\lambda I$ 中，非零的 $(1, 2)$ 元素和非零的 $(3, 3)$ 元素给出两个主元。所以秩是 $2$，几何重数是 $1$。",
          ],
    );
  },
);

const powerOnCombination = point(
  "a-matrix-power-on-a-combination-of-eigenvectors",
  ["A matrix power on a combination of eigenvectors", "矩阵幂作用于特征向量的组合"],
  [
    "Diagonalization makes matrix powers simple: when a vector is written in the eigenvector basis, $A^{n}$ multiplies each coefficient by the $n$th power of its eigenvalue. Each eigenvector stays separate, and the coefficient itself is not raised to the power.",
    "对角化使矩阵的幂变得简单：把向量写成特征向量基的组合后，$A^{n}$ 把每个系数乘以相应特征值的 $n$ 次幂。各特征向量彼此独立，系数本身不取幂。",
  ],
  (rng) => {
    const l1 = rng.pick([-3, -2, 1, 2, 3]);
    const l2 = rng.pick([-4, -1, 4]);
    const l3 = rng.pick([5, -5]);
    const c1 = nz(rng, 5);
    const c2 = nz(rng, 5);
    const c3 = nz(rng, 5);
    const n = rng.int(2, 3);
    const answer = c2 * l2 ** n;
    return ask(
      [
        `$\\mathbf{v}_{1}, \\mathbf{v}_{2}, \\mathbf{v}_{3}$ are eigenvectors of $A$ for the eigenvalues $${l1}$, $${l2}$, $${l3}$, and $\\mathbf{x} = ${poly([c1, "\\mathbf{v}_{1}"], [c2, "\\mathbf{v}_{2}"], [c3, "\\mathbf{v}_{3}"])}$. Find the coefficient of $\\mathbf{v}_{2}$ in $A^{${n}}\\mathbf{x}$.`,
        `$\\mathbf{v}_{1}, \\mathbf{v}_{2}, \\mathbf{v}_{3}$ 是 $A$ 关于特征值 $${l1}$、$${l2}$、$${l3}$ 的特征向量，$\\mathbf{x} = ${poly([c1, "\\mathbf{v}_{1}"], [c2, "\\mathbf{v}_{2}"], [c3, "\\mathbf{v}_{3}"])}$。求 $A^{${n}}\\mathbf{x}$ 中 $\\mathbf{v}_{2}$ 的系数。`,
      ],
      answer,
      [c2 * l2, l2 ** n, n * c2 * l2],
      [
        `$A^{${n}}\\mathbf{v}_{2} = ${wrap(l2)}^{${n}}\\mathbf{v}_{2}$, and the coefficient $${c2}$ is kept. So the coefficient is $${wrap(c2)} \\cdot ${wrap(l2 ** n)} = ${answer}$.`,
        `$A^{${n}}\\mathbf{v}_{2} = ${wrap(l2)}^{${n}}\\mathbf{v}_{2}$，系数 $${c2}$ 保留。所以结果是 $${wrap(c2)} \\cdot ${wrap(l2 ** n)} = ${answer}$。`,
      ],
    );
  },
);

/** deeperLinearAlgebraThirdPoints maps topics of Linear Algebra, from sets and elimination to eigenvectors, to a third knowledge point. */
export const deeperLinearAlgebraThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "special-sets": [squaresBounded],
  "statements-and-predicates": [negation],
  "the-constructive-definition-of-a-set": [imageSet],
  "describing-sets-using-set-builder-notation": [residuesInInterval],
  "infinite-sets": [listingIntegers],
  "elementary-row-operations": [detEffect],
  "creating-rows-or-columns-containing-zeros-using-gaussian-elimination": [columnClear],
  "solving-2x2-systems-of-equations-using-gaussian-elimination": [breakdownK],
  "solving-2x2-singular-systems-of-equations-using-gaussian-elimination": [lineOfSolutions],
  "solving-3x3-systems-of-equations-using-gaussian-elimination": [pairSums],
  "identifying-the-pivot-columns-of-a-matrix": [pivotAfterReducing],
  "gaussian-elimination-for-nxm-systems-of-equations": [rankDecides],
  "elementary-2x2-matrices": [detOfElementary],
  "row-operations-on-2x2-matrices-as-products-of-elementary-matrices": [rightMultiply],
  "row-operations-on-3x3-matrices-as-products-of-elementary-matrices": [productNotInverse],
  "the-invertible-matrix-theorem-in-terms-of-2x2-systems-of-equations": [nullVectorOfSingular],
  "finding-the-inverse-of-a-3x3-matrix-using-row-operations": [blockInverse],
  "triangular-matrices": [triangularTrace],
  "lu-factorization-of-3x3-matrices": [recoverFromLu],
  "lu-factorization-of-nxn-matrices": [pivotFromMinors],
  "solving-systems-of-equations-using-lu-factorization": [transposeSolve],
  "subspaces-of-n-dimensional-space": [subspaceK],
  "finding-a-basis-of-the-column-space-of-a-matrix": [inColumnSpace],
  "finding-a-basis-of-the-null-space-of-a-matrix": [nullReverse],
  "expressing-the-coordinates-of-a-vector-in-a-given-basis": [scaledBasis],
  "writing-vectors-in-different-bases": [betweenBases],
  "the-invertible-matrix-theorem-in-terms-of-dimension-rank-and-nullity": [solvableDimension],
  "defining-abstract-vector-spaces": [shiftedSpace],
  "matrix-of-a-linear-transformation-relative-to-a-basis": [useBasisMatrix],
  "matrix-of-a-linear-map-relative-to-two-bases": [derivativeShifted],
  "calculating-the-eigenvectors-of-a-2x2-matrix": [entryFromEigenvector],
  "calculating-the-eigenvectors-of-a-3x3-matrix-with-distinct-eigenvalues": [lastEigenvector],
  "calculating-the-eigenvectors-of-a-3x3-matrix-in-the-general-case": [geometricMult],
  "diagonalizing-a-3x3-matrix-with-distinct-eigenvalues": [powerOnCombination],
};
