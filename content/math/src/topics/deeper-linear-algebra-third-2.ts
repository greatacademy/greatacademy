// Third knowledge points for thin topics of Linear Algebra, from complex vectors to
// regression: the reverse question, a harder case or a common trap.
// See `deeperLinearAlgebraThird2Points`.

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
/** complex writes a Gaussian integer. */
const complex = (a: number, b: number) => poly([a, ""], [b, "i"]);
/** triples lists small Pythagorean triples. */
const triples: readonly (readonly [number, number, number])[] = [
  [3, 4, 5],
  [4, 3, 5],
  [5, 12, 13],
  [12, 5, 13],
  [8, 15, 17],
  [15, 8, 17],
];
/** ordinal names the first, second and third entries of a vector. */
const ordinal: readonly Pair[] = [
  ["first", "第一"],
  ["second", "第二"],
  ["third", "第三"],
];

const hermitianProduct = point(
  "the-complex-inner-product-conjugates-one-vector",
  ["The complex inner product conjugates one vector", "复内积要共轭一个向量"],
  [
    "The inner product on $\\mathbb{C}^{n}$ conjugates the entries of one vector, so that a vector paired with itself gives a real, nonnegative length. Leaving out the conjugate gives a different number, and the imaginary part is usually where this difference shows.",
    "$\\mathbb{C}^{n}$ 上的内积要把一个向量的元素取共轭，这样向量与自身配对时才得到非负实数长度。漏掉共轭会得到不同的数，这个差别通常体现在虚部上。",
  ],
  (rng) => {
    const a1 = rng.int(-4, 4);
    const b1 = nz(rng, 4);
    const a2 = rng.int(-4, 4);
    const b2 = nz(rng, 4);
    const c1 = rng.int(-4, 4);
    const d1 = nz(rng, 4);
    const c2 = rng.int(-4, 4);
    const d2 = nz(rng, 4);
    const answer = a1 * d1 - b1 * c1 + a2 * d2 - b2 * c2;
    const product = "\\overline{\\mathbf{u}}^{T}\\mathbf{v}";
    const u = vec(complex(a1, b1), complex(a2, b2));
    const v = vec(complex(c1, d1), complex(c2, d2));
    return ask(
      [
        `Find the imaginary part of $${product}$ for $\\mathbf{u} = ${u}$ and $\\mathbf{v} = ${v}$.`,
        `对 $\\mathbf{u} = ${u}$，$\\mathbf{v} = ${v}$，求 $${product}$ 的虚部。`,
      ],
      answer,
      [a1 * d1 + b1 * c1 + a2 * d2 + b2 * c2, a1 * c1 + b1 * d1 + a2 * c2 + b2 * d2, -answer],
      [
        `The conjugate of $\\mathbf{u}$ has entries $${complex(a1, -b1)}$ and $${complex(a2, -b2)}$. Multiplying by the entries of $\\mathbf{v}$ gives imaginary parts $${a1 * d1 - b1 * c1}$ and $${a2 * d2 - b2 * c2}$, whose sum is $${answer}$.`,
        `$\\mathbf{u}$ 的共轭的元素是 $${complex(a1, -b1)}$ 和 $${complex(a2, -b2)}$。与 $\\mathbf{v}$ 的元素相乘，虚部分别是 $${a1 * d1 - b1 * c1}$ 和 $${a2 * d2 - b2 * c2}$，和为 $${answer}$。`,
      ],
    );
  },
);

const complexThreshold = point(
  "the-largest-entry-that-keeps-eigenvalues-complex",
  ["The largest entry that keeps eigenvalues complex", "使特征值保持复数的最大元素"],
  [
    "A real $2 \\times 2$ matrix has non-real eigenvalues exactly when the discriminant $(a - d)^{2} + 4bc$ of its characteristic polynomial is negative. So when $b$ is positive, the entry $c$ must lie strictly below a bound, and a discriminant of zero gives a repeated real eigenvalue instead.",
    "实 $2 \\times 2$ 矩阵有非实特征值，当且仅当特征多项式的判别式 $(a - d)^{2} + 4bc$ 为负。所以当 $b$ 为正时，元素 $c$ 必须严格小于某个界，判别式为零时得到的则是重实特征值。",
  ],
  (rng) => {
    const a = rng.int(-6, 6);
    const d = rng.int(-6, 6);
    const b = rng.int(1, 5);
    const D = (a - d) ** 2;
    const floor = Math.floor(D / (4 * b));
    const answer = -floor - 1;
    const bound = Q.of(-D, 4 * b);
    return ask(
      [
        `Find the largest integer $k$ for which $${mat([
          [a, b],
          ["k", d],
        ])}$ has non-real eigenvalues.`,
        `求使 $${mat([
          [a, b],
          ["k", d],
        ])}$ 有非实特征值的最大整数 $k$。`,
      ],
      answer,
      [-floor, -floor - 2, floor + 1],
      [
        `The discriminant is $${D} + ${4 * b}k$, which must be negative. So $k < ${bound.toLatex()}$, and the largest such integer is $${answer}$.`,
        `判别式是 $${D} + ${4 * b}k$，它必须为负。所以 $k < ${bound.toLatex()}$，满足条件的最大整数是 $${answer}$。`,
      ],
    );
  },
);

const rowFromComplexPair = point(
  "a-row-of-a-real-matrix-from-a-complex-eigenpair",
  ["A row of a real matrix from a complex eigenpair", "由复特征对求实矩阵的一行"],
  [
    "One complex equation holds two real equations. For a real matrix, the first row of $A\\mathbf{v} = \\lambda\\mathbf{v}$ with $\\mathbf{v} = (1, p + qi)$ can be split into real and imaginary parts, and comparing them determines both entries of that row of the matrix.",
    "一个复方程包含两个实方程。对实矩阵，$\\mathbf{v} = (1, p + qi)$ 时 $A\\mathbf{v} = \\lambda\\mathbf{v}$ 的第一行可以分成实部和虚部，比较它们就能确定矩阵这一行的两个元素。",
  ],
  (rng) => {
    const q = nz(rng, 3);
    const t = nz(rng, 4);
    const p = rng.int(-3, 3);
    const a = rng.int(-6, 6);
    const b = t * q;
    const s = a - t * p;
    const entry = rng.bool();
    const answer = entry ? t : s;
    const lambda = complex(a, b);
    const v = vec(1, complex(p, q));
    const name = entry ? "(1, 2)" : "(1, 1)";
    return ask(
      [
        `A real $2 \\times 2$ matrix $A$ has the eigenvector $${v}$ for the eigenvalue $${lambda}$. Find the $${name}$ entry of $A$.`,
        `实 $2 \\times 2$ 矩阵 $A$ 有关于特征值 $${lambda}$ 的特征向量 $${v}$。求 $A$ 的 $${name}$ 元素。`,
      ],
      answer,
      entry ? [b, -t, a] : [a, a + t * p, t],
      [
        `Write the first row as $(s, t)$. Then $s + t(${complex(p, q)}) = ${lambda}$. The imaginary parts give $t = ${t}$, and the real parts give $s = ${a} - ${wrap(t)} \\cdot ${wrap(p)} = ${s}$.`,
        `设第一行为 $(s, t)$。则 $s + t(${complex(p, q)}) = ${lambda}$。比较虚部得 $t = ${t}$，比较实部得 $s = ${a} - ${wrap(t)} \\cdot ${wrap(p)} = ${s}$。`,
      ],
    );
  },
);

const generalizedRank = point(
  "the-rank-of-a-given-generalized-eigenvector",
  ["The rank of a given generalized eigenvector", "给定广义特征向量的秩"],
  [
    "The rank of a generalized eigenvector is the smallest $k$ for which $(A - \\lambda I)^{k}$ sends it to zero. For an upper triangular block with nonzero superdiagonal, each application of $A - \\lambda I$ pushes the lowest nonzero entry up by one, so the position of that entry gives the rank.",
    "广义特征向量的秩是使 $(A - \\lambda I)^{k}$ 把它变为零的最小 $k$。对上对角线元素非零的上三角块，每作用一次 $A - \\lambda I$，最低的非零元素就上移一位，所以这个元素的位置给出秩。",
  ],
  (rng) => {
    const l = nz(rng, 5);
    const p = nz(rng, 4);
    const q = rng.int(-4, 4);
    const r = nz(rng, 4);
    const answer = rng.int(1, 3);
    const x1 = nz(rng, 5);
    const x2 = answer >= 2 ? nz(rng, 5) : 0;
    const x3 = answer === 3 ? nz(rng, 5) : 0;
    return ask(
      [
        `$A = ${mat([
          [l, p, q],
          [0, l, r],
          [0, 0, l],
        ])}$. Find the rank of $${vec(x1, x2, x3)}$ as a generalized eigenvector of $A$ for $\\lambda = ${l}$.`,
        `$A = ${mat([
          [l, p, q],
          [0, l, r],
          [0, 0, l],
        ])}$。求 $${vec(x1, x2, x3)}$ 作为 $A$ 关于 $\\lambda = ${l}$ 的广义特征向量的秩。`,
      ],
      answer,
      [1, 2, 3, 4],
      [
        `Let $N = A - ${wrap(l)}I$. The lowest nonzero entry of this vector is in position $${answer}$, and each application of $N$ moves that entry up one place because the superdiagonal is nonzero. So exactly $${answer}$ applications are needed to reach zero.`,
        `设 $N = A - ${wrap(l)}I$。这个向量最低的非零元素在第 $${answer}$ 位，由于上对角线元素非零，每作用一次 $N$，它就上移一位。所以恰好作用 $${answer}$ 次才得到零。`,
      ],
    );
  },
);

const jordanPower = point(
  "a-power-of-a-jordan-block",
  ["A power of a Jordan block", "若尔当块的幂"],
  [
    "Write a $2 \\times 2$ Jordan-type matrix as $\\lambda I + N$ with $N^{2} = 0$. Then the binomial theorem stops after two terms: $A^{n} = \\lambda^{n}I + n\\lambda^{n - 1}N$. The off-diagonal entry therefore gains a factor of $n$, which is not what raising each entry to a power would give.",
    "把 $2 \\times 2$ 若尔当型矩阵写成 $\\lambda I + N$，其中 $N^{2} = 0$。于是二项式定理两项后就终止：$A^{n} = \\lambda^{n}I + n\\lambda^{n - 1}N$。所以对角线外的元素多了因子 $n$，这与逐个元素取幂的结果不同。",
  ],
  (rng) => {
    const l = rng.pick([-3, -2, -1, 2, 3]);
    const b = nz(rng, 5);
    const n = rng.int(2, 5);
    const answer = n * l ** (n - 1) * b;
    return ask(
      [
        `Find the $(1, 2)$ entry of $A^{${n}}$ for $A = ${mat([
          [l, b],
          [0, l],
        ])}$.`,
        `对 $A = ${mat([
          [l, b],
          [0, l],
        ])}$，求 $A^{${n}}$ 的 $(1, 2)$ 元素。`,
      ],
      answer,
      [l ** (n - 1) * b, b ** n, n * b],
      [
        `$A = ${wrap(l)}I + N$ with $N^{2} = 0$, so $A^{${n}}$ has the $(1, 2)$ entry $${n} \\cdot ${wrap(l ** (n - 1))} \\cdot ${wrap(b)} = ${answer}$.`,
        `$A = ${wrap(l)}I + N$，且 $N^{2} = 0$，所以 $A^{${n}}$ 的 $(1, 2)$ 元素是 $${n} \\cdot ${wrap(l ** (n - 1))} \\cdot ${wrap(b)} = ${answer}$。`,
      ],
    );
  },
);

const pythagorasReverse = point(
  "a-missing-length-from-the-pythagorean-theorem",
  ["A missing length from the Pythagorean theorem", "由勾股定理求缺失的长度"],
  [
    "If $\\mathbf{u}$ and $\\mathbf{v}$ are orthogonal, the cross term of $\\|\\mathbf{u} + \\mathbf{v}\\|^{2}$ vanishes and the squared lengths add. This also runs in reverse: the squared length of one vector is the difference of the other two, and it is not the square of the difference of the lengths.",
    "如果 $\\mathbf{u}$ 与 $\\mathbf{v}$ 正交，$\\|\\mathbf{u} + \\mathbf{v}\\|^{2}$ 的交叉项为零，长度的平方相加。这也可以反过来用：一个向量长度的平方是另外两个长度平方之差，而不是长度之差的平方。",
  ],
  (rng) => {
    const a = rng.int(1, 12);
    const c = a + rng.int(1, 9);
    const answer = c * c - a * a;
    return ask(
      [
        `$\\mathbf{u}$ and $\\mathbf{v}$ are orthogonal, $\\|\\mathbf{u}\\| = ${a}$ and $\\|\\mathbf{u} + \\mathbf{v}\\| = ${c}$. Find $\\|\\mathbf{v}\\|^{2}$.`,
        `$\\mathbf{u}$ 与 $\\mathbf{v}$ 正交，$\\|\\mathbf{u}\\| = ${a}$，$\\|\\mathbf{u} + \\mathbf{v}\\| = ${c}$。求 $\\|\\mathbf{v}\\|^{2}$。`,
      ],
      answer,
      [(c - a) ** 2, c * c + a * a, c - a],
      [
        `Orthogonality gives $\\|\\mathbf{u} + \\mathbf{v}\\|^{2} = \\|\\mathbf{u}\\|^{2} + \\|\\mathbf{v}\\|^{2}$. So $\\|\\mathbf{v}\\|^{2} = ${c * c} - ${a * a} = ${answer}$.`,
        `由正交性得 $\\|\\mathbf{u} + \\mathbf{v}\\|^{2} = \\|\\mathbf{u}\\|^{2} + \\|\\mathbf{v}\\|^{2}$。所以 $\\|\\mathbf{v}\\|^{2} = ${c * c} - ${a * a} = ${answer}$。`,
      ],
    );
  },
);

const complementPart = point(
  "the-part-of-a-vector-in-the-orthogonal-complement",
  ["The part of a vector in the orthogonal complement", "向量在正交补中的部分"],
  [
    "Every vector splits uniquely as $\\mathbf{x} = \\mathbf{w} + \\mathbf{z}$ with $\\mathbf{w}$ in $W$ and $\\mathbf{z}$ in $W^{\\perp}$. When $W$ is spanned by one vector, $\\mathbf{w}$ is the projection onto it, and $\\mathbf{z}$ is what remains after subtracting that projection from $\\mathbf{x}$.",
    "每个向量都可以唯一分解为 $\\mathbf{x} = \\mathbf{w} + \\mathbf{z}$，其中 $\\mathbf{w}$ 在 $W$ 中，$\\mathbf{z}$ 在 $W^{\\perp}$ 中。当 $W$ 由一个向量张成时，$\\mathbf{w}$ 是到它上面的投影，$\\mathbf{z}$ 是从 $\\mathbf{x}$ 中减去投影后剩下的部分。",
  ],
  (rng) => {
    const [u1, u2, u3] = rng.pick([
      [1, 2, 2],
      [2, -1, 2],
      [1, 1, 1],
      [1, -1, 2],
      [2, 1, -2],
      [1, 2, -1],
    ] as const);
    const [w1, w2, w3] = rng.pick([
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
      [1, -1, 0],
    ] as const);
    const scale = nz(rng, 2);
    const z = [scale * (u2 * w3 - u3 * w2), scale * (u3 * w1 - u1 * w3), scale * (u1 * w2 - u2 * w1)] as const;
    const s = nz(rng, 3);
    const x = [s * u1 + z[0], s * u2 + z[1], s * u3 + z[2]] as const;
    const j = rng.int(0, 2);
    const answer = z[j] as number;
    const name = ordinal[j] as Pair;
    const dot = x[0] * u1 + x[1] * u2 + x[2] * u3;
    const norm = u1 * u1 + u2 * u2 + u3 * u3;
    const uj = [u1, u2, u3][j] as number;
    return ask(
      [
        `$W = \\operatorname{span}\\left\\{${vec(u1, u2, u3)}\\right\\}$ and $\\mathbf{x} = ${vec(x[0], x[1], x[2])} = \\mathbf{w} + \\mathbf{z}$ with $\\mathbf{w} \\in W$, $\\mathbf{z} \\in W^{\\perp}$. Find the ${name[0]} entry of $\\mathbf{z}$.`,
        `$W = \\operatorname{span}\\left\\{${vec(u1, u2, u3)}\\right\\}$，$\\mathbf{x} = ${vec(x[0], x[1], x[2])} = \\mathbf{w} + \\mathbf{z}$，其中 $\\mathbf{w} \\in W$，$\\mathbf{z} \\in W^{\\perp}$。求 $\\mathbf{z}$ 的${name[1]}个元素。`,
      ],
      answer,
      [s * uj, (x[j] as number) - uj, x[j] as number],
      [
        `The projection coefficient is $\\frac{${dot}}{${norm}} = ${s}$, so $\\mathbf{w}$ is $${s}$ times the spanning vector. Subtracting gives $\\mathbf{z} = ${vec(z[0], z[1], z[2])}$, and the requested entry is $${answer}$.`,
        `投影系数是 $\\frac{${dot}}{${norm}} = ${s}$，所以 $\\mathbf{w}$ 是张成向量的 $${s}$ 倍。相减得 $\\mathbf{z} = ${vec(z[0], z[1], z[2])}$，所求元素是 $${answer}$。`,
      ],
    );
  },
);

const combosDot = point(
  "the-inner-product-of-two-combinations-of-an-orthogonal-set",
  ["The inner product of two combinations of an orthogonal set", "正交组的两个组合的内积"],
  [
    "When two combinations of an orthogonal set are multiplied out, every product of two different vectors vanishes. Only the matching terms remain, and each is the product of the two coefficients and the squared length of its vector. The lengths must be squared.",
    "把正交组的两个组合乘开时，两个不同向量的乘积都为零。只剩下对应的项，每一项都是两个系数与相应向量长度平方的积。长度必须取平方。",
  ],
  (rng) => {
    const a = rng.int(1, 5);
    const b = rng.int(1, 5);
    const c = rng.int(1, 5);
    const p = nz(rng, 3);
    const q = nz(rng, 3);
    const r = nz(rng, 3);
    const e = nz(rng, 3);
    const f = nz(rng, 3);
    const g = nz(rng, 3);
    const answer = p * e * a * a + q * f * b * b + r * g * c * c;
    const left = poly([p, "\\mathbf{u}_{1}"], [q, "\\mathbf{u}_{2}"], [r, "\\mathbf{u}_{3}"]);
    const right = poly([e, "\\mathbf{u}_{1}"], [f, "\\mathbf{u}_{2}"], [g, "\\mathbf{u}_{3}"]);
    return ask(
      [
        `$\\{\\mathbf{u}_{1}, \\mathbf{u}_{2}, \\mathbf{u}_{3}\\}$ is orthogonal with lengths $${a}$, $${b}$ and $${c}$. Find $(${left}) \\cdot (${right})$.`,
        `$\\{\\mathbf{u}_{1}, \\mathbf{u}_{2}, \\mathbf{u}_{3}\\}$ 是正交组，长度分别为 $${a}$、$${b}$ 和 $${c}$。求 $(${left}) \\cdot (${right})$。`,
      ],
      answer,
      [p * e * a + q * f * b + r * g * c, p * e + q * f + r * g, -answer],
      [
        `All cross terms vanish, which leaves $${wrap(p * e)} \\cdot ${a * a} + ${wrap(q * f)} \\cdot ${b * b} + ${wrap(r * g)} \\cdot ${c * c} = ${answer}$.`,
        `所有交叉项都为零，剩下 $${wrap(p * e)} \\cdot ${a * a} + ${wrap(q * f)} \\cdot ${b * b} + ${wrap(r * g)} \\cdot ${c * c} = ${answer}$。`,
      ],
    );
  },
);

const orthogonalShift = point(
  "shifting-a-function-to-make-it-orthogonal",
  ["Shifting a function to make it orthogonal", "平移函数使其正交"],
  [
    "Orthogonality in a function space is an integral condition, so a shift can be solved from a linear equation. The condition $\\langle f, x - c \\rangle = 0$ gives $c = \\frac{\\langle f, x \\rangle}{\\langle f, 1 \\rangle}$, which depends on $f$ and is not always the midpoint of the interval.",
    "函数空间中的正交性是一个积分条件，所以平移量可以由线性方程解出。条件 $\\langle f, x - c \\rangle = 0$ 给出 $c = \\frac{\\langle f, x \\rangle}{\\langle f, 1 \\rangle}$，它依赖于 $f$，并不总是区间的中点。",
  ],
  (rng) => {
    const m = rng.int(0, 2);
    const L = rng.int(1, 9);
    const k = rng.int(1, 5);
    const answer = Q.of(L * (m + 1), m + 2);
    const f = poly([k, m === 0 ? "" : m === 1 ? "x" : "x^{2}"]);
    return ask(
      [
        `With $\\langle f, g \\rangle = \\int_{0}^{${L}} f(x)g(x)\\,dx$, find $c$ so that $f(x) = ${f}$ and $g(x) = x - c$ are orthogonal.`,
        `在 $\\langle f, g \\rangle = \\int_{0}^{${L}} f(x)g(x)\\,dx$ 下，求 $c$，使 $f(x) = ${f}$ 与 $g(x) = x - c$ 正交。`,
      ],
      answer,
      [Q.of(L, 2).eq(answer) ? Q.of(L * (m + 2), m + 1) : Q.of(L, 2), Q.of(m + 1, m + 2), Q.of(L * (m + 2), m + 1), Q.of(k * L, 2)],
      [
        `The constant $${k}$ cancels. We need $\\int_{0}^{${L}} ${m === 0 ? "x" : `x^{${m + 1}}`}\\,dx = c\\int_{0}^{${L}} ${m === 0 ? "1" : m === 1 ? "x" : "x^{2}"}\\,dx$, so $c = ${L} \\cdot \\frac{${m + 1}}{${m + 2}} = ${answer.toLatex()}$.`,
        `常数 $${k}$ 可以约去。需要 $\\int_{0}^{${L}} ${m === 0 ? "x" : `x^{${m + 1}}`}\\,dx = c\\int_{0}^{${L}} ${m === 0 ? "1" : m === 1 ? "x" : "x^{2}"}\\,dx$，所以 $c = ${L} \\cdot \\frac{${m + 1}}{${m + 2}} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const orthogonalInverse = point(
  "the-inverse-of-an-orthogonal-matrix-is-its-transpose",
  ["The inverse of an orthogonal matrix is its transpose", "正交矩阵的逆是它的转置"],
  [
    "An orthogonal transformation preserves dot products, so its matrix satisfies $Q^{T}Q = I$. Its inverse therefore needs no elimination: it is the transpose. An entry of the inverse is read from the reflected position, and it is not the reciprocal of the entry.",
    "正交变换保持点积，所以它的矩阵满足 $Q^{T}Q = I$。因此求逆不需要消元：逆矩阵就是转置。逆矩阵的元素从关于对角线对称的位置读出，而不是原元素的倒数。",
  ],
  (rng) => {
    const [p, q, c] = rng.pick(triples);
    const sign = rng.bool() ? 1 : -1;
    const reflect = rng.bool();
    const rows = reflect
      ? [
          [p, sign * q],
          [sign * q, -p],
        ]
      : [
          [p, -sign * q],
          [sign * q, p],
        ];
    const i = rng.int(0, 1);
    const j = rng.int(0, 1);
    const value = (rows[j] as number[])[i] as number;
    const other = (rows[i] as number[])[j] as number;
    const answer = Q.of(value, c);
    return ask(
      [
        `$Q = \\frac{1}{${c}}${mat(rows)}$ is orthogonal. Find the $(${i + 1}, ${j + 1})$ entry of $Q^{-1}$.`,
        `$Q = \\frac{1}{${c}}${mat(rows)}$ 是正交矩阵。求 $Q^{-1}$ 的 $(${i + 1}, ${j + 1})$ 元素。`,
      ],
      answer,
      [Q.of(other, c), Q.of(c, value), answer.neg()],
      [
        `Since $Q^{-1} = Q^{T}$, this entry equals the $(${j + 1}, ${i + 1})$ entry of $Q$, which is $${answer.toLatex()}$.`,
        `由于 $Q^{-1} = Q^{T}$，这个元素等于 $Q$ 的 $(${j + 1}, ${i + 1})$ 元素，即 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const rowsFromNullities = point(
  "the-number-of-rows-from-the-two-null-spaces",
  ["The number of rows from the two null spaces", "由两个零空间求行数"],
  [
    "The two null spaces of a matrix determine its shape together with the rank. The rank is the number of columns minus the dimension of the null space, and it is also the number of rows minus the dimension of the left null space, so these two equations link the rows and columns.",
    "矩阵的两个零空间与秩一起决定它的形状。秩等于列数减去零空间的维数，也等于行数减去左零空间的维数，所以这两个等式把行数和列数联系起来。",
  ],
  (rng) => {
    const n = rng.int(3, 9);
    const p = rng.int(0, n - 1);
    const q = rng.int(0, 4);
    const answer = n - p + q;
    return ask(
      [
        `$A$ has $${n}$ columns, $\\dim \\operatorname{Null}(A) = ${p}$ and $\\dim \\operatorname{Null}(A^{T}) = ${q}$. How many rows does $A$ have?`,
        `$A$ 有 $${n}$ 列，$\\dim \\operatorname{Null}(A) = ${p}$，$\\dim \\operatorname{Null}(A^{T}) = ${q}$。$A$ 有多少行？`,
      ],
      answer,
      [n, n + p + q, n + p - q === answer ? n - p : n + p - q],
      [
        `The rank is $${n} - ${p} = ${n - p}$. Rows minus $\\dim \\operatorname{Null}(A^{T})$ is also the rank, so the number of rows is $${n - p} + ${q} = ${answer}$.`,
        `秩是 $${n} - ${p} = ${n - p}$。行数减去 $\\dim \\operatorname{Null}(A^{T})$ 也等于秩，所以行数是 $${n - p} + ${q} = ${answer}$。`,
      ],
    );
  },
);

const coefficientSquaredNorm = point(
  "a-component-divides-by-the-squared-length",
  ["A component divides by the squared length", "分量要除以长度的平方"],
  [
    "For an orthogonal basis that is not orthonormal, a coordinate is $\\frac{\\mathbf{x} \\cdot \\mathbf{u}}{\\|\\mathbf{u}\\|^{2}}$. Taking the dot product of $\\mathbf{x}$ with a basis vector picks up two factors of the length, one from each $\\mathbf{u}$, so dividing once by the length is a common mistake.",
    "对不是标准正交的正交基，坐标是 $\\frac{\\mathbf{x} \\cdot \\mathbf{u}}{\\|\\mathbf{u}\\|^{2}}$。$\\mathbf{x}$ 与基向量作点积会带来两个长度因子，所以只除以一次长度是常见的错误。",
  ],
  (rng) => {
    const n = rng.int(2, 7);
    const c = nz(rng, 9);
    const dot = c * n * n;
    return ask(
      [
        `$\\{\\mathbf{u}_{1}, \\mathbf{u}_{2}\\}$ is an orthogonal basis of a plane containing $\\mathbf{x}$, with $\\|\\mathbf{u}_{1}\\| = ${n}$ and $\\mathbf{x} \\cdot \\mathbf{u}_{1} = ${dot}$. Find the coefficient of $\\mathbf{u}_{1}$ in $\\mathbf{x}$.`,
        `$\\{\\mathbf{u}_{1}, \\mathbf{u}_{2}\\}$ 是含 $\\mathbf{x}$ 的平面的正交基，$\\|\\mathbf{u}_{1}\\| = ${n}$，$\\mathbf{x} \\cdot \\mathbf{u}_{1} = ${dot}$。求 $\\mathbf{x}$ 中 $\\mathbf{u}_{1}$ 的系数。`,
      ],
      c,
      [c * n, dot, Q.of(c, n)],
      [
        `Dotting with $\\mathbf{u}_{1}$ removes the $\\mathbf{u}_{2}$ term and leaves the coefficient times $\\|\\mathbf{u}_{1}\\|^{2} = ${n * n}$. So the coefficient is $\\frac{${dot}}{${n * n}} = ${c}$.`,
        `与 $\\mathbf{u}_{1}$ 作点积消去 $\\mathbf{u}_{2}$ 项，剩下系数乘以 $\\|\\mathbf{u}_{1}\\|^{2} = ${n * n}$。所以系数是 $\\frac{${dot}}{${n * n}} = ${c}$。`,
      ],
    );
  },
);

const projectionMatrix = point(
  "numbers-attached-to-a-projection-matrix",
  ["Numbers attached to a projection matrix", "投影矩阵的相关数值"],
  [
    "An orthogonal projection onto a subspace of dimension $k$ in $\\mathbb{R}^{m}$ has eigenvalue $1$ with multiplicity $k$ and eigenvalue $0$ with multiplicity $m - k$. So its trace and rank are $k$, and $I - P$ is the projection onto the complement, whose trace and rank are $m - k$.",
    "$\\mathbb{R}^{m}$ 中到 $k$ 维子空间的正交投影有重数为 $k$ 的特征值 $1$ 和重数为 $m - k$ 的特征值 $0$。所以它的迹和秩都是 $k$，而 $I - P$ 是到正交补的投影，其迹和秩都是 $m - k$。",
  ],
  (rng) => {
    const m = rng.int(3, 9);
    const k = rng.int(1, m - 1);
    const kind = rng.int(0, 4);
    const item = [
      "\\operatorname{tr}(P)",
      "\\operatorname{tr}(P^{2})",
      "\\operatorname{rank}(I - P)",
      "\\dim \\operatorname{Null}(P)",
      "\\operatorname{tr}(I - P)",
    ][kind] as string;
    const answer = kind < 2 ? k : m - k;
    const whys: Pair[] = [
      [
        `The trace is the sum of the eigenvalues, $${k}$ ones and $${m - k}$ zeros, so it is $${k}$.`,
        `迹是特征值之和，即 $${k}$ 个 $1$ 和 $${m - k}$ 个 $0$ 的和，所以是 $${k}$。`,
      ],
      [
        `A projection satisfies $P^{2} = P$, so this is the trace of $P$, which is the dimension $${k}$.`,
        `投影满足 $P^{2} = P$，所以这就是 $P$ 的迹，等于维数 $${k}$。`,
      ],
      [
        `$I - P$ projects onto the orthogonal complement, whose dimension is $${m} - ${k} = ${m - k}$.`,
        `$I - P$ 投影到正交补上，其维数是 $${m} - ${k} = ${m - k}$。`,
      ],
      [
        `$P$ sends exactly the orthogonal complement to zero, and that has dimension $${m} - ${k} = ${m - k}$.`,
        `$P$ 恰好把正交补变为零，其维数是 $${m} - ${k} = ${m - k}$。`,
      ],
      [
        `The trace of $I$ is $${m}$ and the trace of $P$ is $${k}$, so the difference is $${m - k}$.`,
        `$I$ 的迹是 $${m}$，$P$ 的迹是 $${k}$，所以差是 $${m - k}$。`,
      ],
    ];
    return ask(
      [
        `$P$ is the orthogonal projection matrix of $\\mathbb{R}^{${m}}$ onto a subspace of dimension $${k}$. Find $${item}$.`,
        `$P$ 是 $\\mathbb{R}^{${m}}$ 到一个 $${k}$ 维子空间的正交投影矩阵。求 $${item}$。`,
      ],
      answer,
      [m, kind < 2 ? m - k : k, k * k, m + k],
      whys[kind] as Pair,
    );
  },
);

const symmetricLineFit = point(
  "a-least-squares-line-with-centered-inputs",
  ["A least-squares line with centered inputs", "输入居中的最小二乘直线"],
  [
    "When the inputs sum to zero, the two columns of the design matrix are orthogonal, so the normal equations separate. The intercept is then the mean of the outputs, and the slope is $\\frac{\\sum x_{i}y_{i}}{\\sum x_{i}^{2}}$. The endpoints alone do not determine the slope.",
    "当输入之和为零时，设计矩阵的两列正交，所以正规方程彼此分离。此时截距是输出的平均值，斜率是 $\\frac{\\sum x_{i}y_{i}}{\\sum x_{i}^{2}}$。仅凭两个端点不能确定斜率。",
  ],
  (rng) => {
    const ys = [rng.int(-9, 9), rng.int(-9, 9), rng.int(-9, 9), rng.int(-9, 9), rng.int(-9, 9)] as const;
    const pts = ys.map((y, i) => `(${i - 2}, ${y})`).join(", ");
    const sum = ys.reduce((a, b) => a + b, 0);
    const sxy = ys.reduce((a, y, i) => a + (i - 2) * y, 0);
    if (rng.bool()) {
      const answer = Q.of(sxy, 10);
      return ask(
        [`Find the slope of the least-squares line $y = c + mx$ through $${pts}$.`, `求经过 $${pts}$ 的最小二乘直线 $y = c + mx$ 的斜率。`],
        answer,
        [Q.of(ys[4] - ys[0], 4), Q.of(sxy, 5), Q.of(sum, 5)],
        [
          `The inputs sum to zero, so $m = \\frac{\\sum x_{i}y_{i}}{\\sum x_{i}^{2}}$. Here $\\sum x_{i}y_{i} = ${sxy}$ and $\\sum x_{i}^{2} = 10$, so $m = ${answer.toLatex()}$.`,
          `输入之和为零，所以 $m = \\frac{\\sum x_{i}y_{i}}{\\sum x_{i}^{2}}$。这里 $\\sum x_{i}y_{i} = ${sxy}$，$\\sum x_{i}^{2} = 10$，所以 $m = ${answer.toLatex()}$。`,
        ],
      );
    }
    const answer = Q.of(sum, 5);
    return ask(
      [
        `Find the intercept of the least-squares line $y = c + mx$ through $${pts}$.`,
        `求经过 $${pts}$ 的最小二乘直线 $y = c + mx$ 的截距。`,
      ],
      answer,
      [ys[2], sum, Q.of(sxy, 10)],
      [
        `The inputs sum to zero, so the normal equations separate and $c$ is the mean of the outputs. That is $\\frac{${sum}}{5} = ${answer.toLatex()}$.`,
        `输入之和为零，所以正规方程彼此分离，$c$ 是输出的平均值，即 $\\frac{${sum}}{5} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const bestMultipleOfX = point(
  "the-best-multiple-of-x-ignores-even-terms",
  ["The best multiple of x ignores even terms", "最佳的 x 倍数与偶次项无关"],
  [
    "The best approximation of $f$ by a multiple of $x$ on $[-1, 1]$ has the coefficient $\\frac{\\langle f, x \\rangle}{\\langle x, x \\rangle}$. Even terms of $f$ are orthogonal to $x$ on this symmetric interval and contribute nothing, while higher odd powers contribute only part of their coefficient.",
    "在 $[-1, 1]$ 上，用 $x$ 的倍数逼近 $f$ 的最佳系数是 $\\frac{\\langle f, x \\rangle}{\\langle x, x \\rangle}$。在这个对称区间上，$f$ 的偶次项与 $x$ 正交，没有贡献，而更高的奇次幂只贡献其系数的一部分。",
  ],
  (rng) => {
    const n = rng.pick([3, 5, 7]);
    const k = nz(rng, 5);
    const m = nz(rng, 5);
    const b = nz(rng, 4);
    const f = poly([k, `x^{${n}}`], [m, "x^{2}"], [b, "x"]);
    const part = Q.of(3 * k, n + 2);
    const answer = part.add(Q.of(b, 1));
    return ask(
      [
        `With $\\langle f, g \\rangle = \\int_{-1}^{1} f(x)g(x)\\,dx$, find $c$ so that $cx$ is the multiple of $x$ closest to $f(x) = ${f}$.`,
        `在 $\\langle f, g \\rangle = \\int_{-1}^{1} f(x)g(x)\\,dx$ 下，求 $c$，使 $cx$ 是最接近 $f(x) = ${f}$ 的 $x$ 的倍数。`,
      ],
      answer,
      [Q.of(b, 1), Q.of(b + k, 1), answer.add(Q.of(m, 1)), Q.of(3 * k, n + 1).add(Q.of(b, 1))],
      [
        `$\\langle x, x \\rangle = \\frac{2}{3}$ and $\\langle x^{${n}}, x \\rangle = \\frac{2}{${n + 2}}$, while the term in $x^{2}$ is orthogonal to $x$. So $c = ${b} + ${wrap(k)} \\cdot \\frac{3}{${n + 2}} = ${answer.toLatex()}$.`,
        `$\\langle x, x \\rangle = \\frac{2}{3}$，$\\langle x^{${n}}, x \\rangle = \\frac{2}{${n + 2}}$，而 $x^{2}$ 项与 $x$ 正交。所以 $c = ${b} + ${wrap(k)} \\cdot \\frac{3}{${n + 2}} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const gramLength = point(
  "the-length-of-the-new-vector-without-computing-it",
  ["The length of the new vector without computing it", "不计算新向量求其长度"],
  [
    "Gram-Schmidt writes $\\mathbf{x}_{2}$ as a multiple of $\\mathbf{x}_{1}$ plus an orthogonal vector $\\mathbf{w}$, so the Pythagorean theorem gives the length of $\\mathbf{w}$ from dot products alone. The subtracted squared length is $\\frac{(\\mathbf{x}_{1} \\cdot \\mathbf{x}_{2})^{2}}{\\|\\mathbf{x}_{1}\\|^{2}}$.",
    "格拉姆-施密特过程把 $\\mathbf{x}_{2}$ 写成 $\\mathbf{x}_{1}$ 的倍数加上一个正交向量 $\\mathbf{w}$，所以勾股定理仅由点积就能给出 $\\mathbf{w}$ 的长度。减去的长度平方是 $\\frac{(\\mathbf{x}_{1} \\cdot \\mathbf{x}_{2})^{2}}{\\|\\mathbf{x}_{1}\\|^{2}}$。",
  ],
  (rng) => {
    const M = rng.int(2, 20);
    const d = nz(rng, 9);
    const N = Math.ceil((d * d) / M) + rng.int(1, 12);
    const answer = Q.of(N * M - d * d, M);
    return ask(
      [
        `$\\|\\mathbf{x}_{1}\\|^{2} = ${M}$, $\\|\\mathbf{x}_{2}\\|^{2} = ${N}$ and $\\mathbf{x}_{1} \\cdot \\mathbf{x}_{2} = ${d}$. Gram-Schmidt gives $\\mathbf{w} = \\mathbf{x}_{2} - \\frac{\\mathbf{x}_{1} \\cdot \\mathbf{x}_{2}}{\\|\\mathbf{x}_{1}\\|^{2}}\\mathbf{x}_{1}$. Find $\\|\\mathbf{w}\\|^{2}$.`,
        `$\\|\\mathbf{x}_{1}\\|^{2} = ${M}$，$\\|\\mathbf{x}_{2}\\|^{2} = ${N}$，$\\mathbf{x}_{1} \\cdot \\mathbf{x}_{2} = ${d}$。格拉姆-施密特过程给出 $\\mathbf{w} = \\mathbf{x}_{2} - \\frac{\\mathbf{x}_{1} \\cdot \\mathbf{x}_{2}}{\\|\\mathbf{x}_{1}\\|^{2}}\\mathbf{x}_{1}$。求 $\\|\\mathbf{w}\\|^{2}$。`,
      ],
      answer,
      [Q.of(N * M - d, M), Q.of(d * d, M), N],
      [
        `The multiple of $\\mathbf{x}_{1}$ is orthogonal to $\\mathbf{w}$ and has squared length $\\frac{${d * d}}{${M}}$. By the Pythagorean theorem, $\\|\\mathbf{w}\\|^{2} = ${N} - \\frac{${d * d}}{${M}} = ${answer.toLatex()}$.`,
        `$\\mathbf{x}_{1}$ 的这个倍数与 $\\mathbf{w}$ 正交，长度平方是 $\\frac{${d * d}}{${M}}$。由勾股定理，$\\|\\mathbf{w}\\|^{2} = ${N} - \\frac{${d * d}}{${M}} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const gramDependent = point(
  "the-step-where-gram-schmidt-produces-zero",
  ["The step where Gram-Schmidt produces zero", "格拉姆-施密特过程产生零向量的步骤"],
  [
    "Gram-Schmidt produces the zero vector exactly at the first vector that depends on those before it, because everything in that vector is removed by the projections. So running it on a dependent list finds the dependency, and the zero vector must be dropped before continuing.",
    "格拉姆-施密特过程恰好在第一个依赖于前面向量的向量处产生零向量，因为这个向量的所有部分都被投影减去了。所以对线性相关的向量组运行它就能发现相关性，继续之前必须去掉零向量。",
  ],
  (rng) => {
    const a = nz(rng, 2);
    const b = nz(rng, 2);
    const c = nz(rng, 2);
    const d = nz(rng, 2);
    const e = nz(rng, 2);
    const f = nz(rng, 2);
    const x1 = [1, a, b, c];
    const x2 = [0, 1, d, e];
    const x3 = [0, 0, 1, f];
    const combine = (p: number, q: number, r: number) => x1.map((v, i) => p * v + q * (x2[i] as number) + r * (x3[i] as number));
    const answer = rng.int(2, 4);
    const m = nz(rng, 3);
    const p = nz(rng, 2);
    const q = nz(rng, 2);
    const r = nz(rng, 2);
    const list =
      answer === 2 ? [x1, combine(m, 0, 0), x2, x3] : answer === 3 ? [x1, x2, combine(p, q, 0), x3] : [x1, x2, x3, combine(p, q, r)];
    const shown = list.map((v) => vec(...v)).join(", ");
    const relation =
      answer === 2
        ? poly([m, "\\mathbf{x}_{1}"])
        : answer === 3
          ? poly([p, "\\mathbf{x}_{1}"], [q, "\\mathbf{x}_{2}"])
          : poly([p, "\\mathbf{x}_{1}"], [q, "\\mathbf{x}_{2}"], [r, "\\mathbf{x}_{3}"]);
    return ask(
      [
        `Gram-Schmidt is applied in order to $\\mathbf{x}_{1}, \\mathbf{x}_{2}, \\mathbf{x}_{3}, \\mathbf{x}_{4} = ${shown}$. At which step $k$ is $\\mathbf{w}_{k}$ first the zero vector?`,
        `对 $\\mathbf{x}_{1}, \\mathbf{x}_{2}, \\mathbf{x}_{3}, \\mathbf{x}_{4} = ${shown}$ 依次运用格拉姆-施密特过程。在第几步 $k$，$\\mathbf{w}_{k}$ 首次成为零向量？`,
      ],
      answer,
      [2, 3, 4, 1],
      [
        `$\\mathbf{x}_{${answer}} = ${relation}$, and the vectors before it are independent. So the projections remove all of $\\mathbf{x}_{${answer}}$, and $\\mathbf{w}_{${answer}} = \\mathbf{0}$ is the first zero.`,
        `$\\mathbf{x}_{${answer}} = ${relation}$，而它前面的向量线性无关。所以投影减去了 $\\mathbf{x}_{${answer}}$ 的全部，$\\mathbf{w}_{${answer}} = \\mathbf{0}$ 是第一个零向量。`,
      ],
    );
  },
);

const symmetricAction = point(
  "acting-with-a-symmetric-matrix-through-its-eigenvectors",
  ["Acting with a symmetric matrix through its eigenvectors", "通过特征向量计算对称矩阵的作用"],
  [
    "The eigenvectors of a symmetric $2 \\times 2$ matrix with distinct eigenvalues are orthogonal, so one eigenvector gives the other direction. A vector can then be split along the two by dot products, and each part is scaled by its own eigenvalue, with no need to build the matrix.",
    "特征值互异的对称 $2 \\times 2$ 矩阵的特征向量正交，所以一个特征向量就给出另一个方向。向量可以用点积沿这两个方向分解，每一部分乘以各自的特征值，不需要构造矩阵。",
  ],
  (rng) => {
    const p = nz(rng, 3);
    const q = nz(rng, 3);
    const l1 = nz(rng, 5);
    const l2 = l1 + rng.pick([-3, -2, -1, 1, 2, 3]);
    const s = nz(rng, 3);
    const t = nz(rng, 3);
    const x1 = s * p - t * q;
    const x2 = s * q + t * p;
    const answer = s * l1 * p - t * l2 * q;
    const norm = p * p + q * q;
    return ask(
      [
        `$A$ is symmetric, with $${vec(p, q)}$ an eigenvector for $\\lambda = ${l1}$, and its other eigenvalue is $${l2}$. Find the first entry of $A${vec(x1, x2)}$.`,
        `$A$ 是对称矩阵，$${vec(p, q)}$ 是关于 $\\lambda = ${l1}$ 的特征向量，另一个特征值是 $${l2}$。求 $A${vec(x1, x2)}$ 的第一个元素。`,
      ],
      answer,
      [l1 * x1, l2 * x1, s * l1 * p + t * l2 * q],
      [
        `The other eigenvector is $${vec(-q, p)}$. Dot products with squared length $${norm}$ give $${vec(x1, x2)} = ${poly([s, vec(p, q)], [t, vec(-q, p)])}$. So the first entry is $${wrap(s)} \\cdot ${wrap(l1)} \\cdot ${wrap(p)} + ${wrap(t)} \\cdot ${wrap(l2)} \\cdot ${wrap(-q)} = ${answer}$.`,
        `另一个特征向量是 $${vec(-q, p)}$。用长度平方 $${norm}$ 作点积，得 $${vec(x1, x2)} = ${poly([s, vec(p, q)], [t, vec(-q, p)])}$。所以第一个元素是 $${wrap(s)} \\cdot ${wrap(l1)} \\cdot ${wrap(p)} + ${wrap(t)} \\cdot ${wrap(l2)} \\cdot ${wrap(-q)} = ${answer}$。`,
      ],
    );
  },
);

const repeatedSymmetric = point(
  "the-last-eigenvalue-from-the-trace",
  ["The last eigenvalue from the trace", "由迹求最后一个特征值"],
  [
    "The trace of a matrix is the sum of its eigenvalues counted with multiplicity. So when a symmetric $3 \\times 3$ matrix has an eigenvalue of multiplicity $2$, the remaining eigenvalue follows from the diagonal, with no need to expand the characteristic polynomial.",
    "矩阵的迹等于按重数计算的特征值之和。所以当对称 $3 \\times 3$ 矩阵有一个重数为 $2$ 的特征值时，剩下的特征值由对角线就能求出，不需要展开特征多项式。",
  ],
  (rng) => {
    const c = rng.int(-5, 5);
    const k = nz(rng, 2);
    const v = [nz(rng, 2), nz(rng, 2), nz(rng, 2)] as const;
    const rows = v.map((vi, i) => v.map((vj, j) => k * vi * vj + (i === j ? c : 0)));
    const norm = v[0] ** 2 + v[1] ** 2 + v[2] ** 2;
    const trace = 3 * c + k * norm;
    const answer = c + k * norm;
    return ask(
      [
        `The symmetric matrix $${mat(rows)}$ has the eigenvalue $${c}$ with multiplicity $2$. Find its other eigenvalue.`,
        `对称矩阵 $${mat(rows)}$ 有重数为 $2$ 的特征值 $${c}$。求它的另一个特征值。`,
      ],
      answer,
      [trace, trace - c, k * norm],
      [
        `The trace is $${trace}$, and it equals the sum of the eigenvalues. So the other eigenvalue is $${trace} - 2 \\cdot ${wrap(c)} = ${answer}$.`,
        `迹是 $${trace}$，它等于特征值之和。所以另一个特征值是 $${trace} - 2 \\cdot ${wrap(c)} = ${answer}$。`,
      ],
    );
  },
);

const shearRemoving = point(
  "the-shear-that-removes-the-cross-term",
  ["The shear that removes the cross term", "消去交叉项的剪切变换"],
  [
    "A change of variables need not be orthogonal to remove a cross term. Substituting $x_{1} = y_{1} + ky_{2}$, $x_{2} = y_{2}$ makes the coefficient of $y_{1}y_{2}$ a linear expression in $k$, which can be set to zero. This is completing the square written as a change of variables.",
    "消去交叉项的变量替换不一定是正交的。代入 $x_{1} = y_{1} + ky_{2}$，$x_{2} = y_{2}$ 后，$y_{1}y_{2}$ 的系数是 $k$ 的线性式，可以令它为零。这就是用变量替换的形式写出的配方。",
  ],
  (rng) => {
    const a = nz(rng, 5);
    const b = nz(rng, 9);
    const c = nz(rng, 5);
    const answer = Q.of(-b, 2 * a);
    const form = poly([a, "x_{1}^{2}"], [b, "x_{1}x_{2}"], [c, "x_{2}^{2}"]);
    return ask(
      [
        `Find $k$ so that $x_{1} = y_{1} + ky_{2}$, $x_{2} = y_{2}$ removes the $y_{1}y_{2}$ term from $Q = ${form}$.`,
        `求 $k$，使 $x_{1} = y_{1} + ky_{2}$，$x_{2} = y_{2}$ 消去 $Q = ${form}$ 中的 $y_{1}y_{2}$ 项。`,
      ],
      answer,
      [answer.neg(), Q.of(-b, a), Q.of(-2 * a, b)],
      [
        `The $y_{1}y_{2}$ coefficient is $${poly([2 * a, "k"], [b, ""])}$, with $${poly([2 * a, "k"])}$ from the square and $${b}$ from the cross term. Setting it to zero gives $k = ${answer.toLatex()}$.`,
        `$y_{1}y_{2}$ 的系数是 $${poly([2 * a, "k"], [b, ""])}$，其中 $${poly([2 * a, "k"])}$ 来自平方项，$${b}$ 来自交叉项。令它为零，得 $k = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const singleSquare = point(
  "a-canonical-form-with-a-single-square",
  ["A canonical form with a single square", "只有一个平方项的标准形"],
  [
    "The canonical form has as many squares as the rank of the matrix of the form. A form with the cross term written as $2kx_{1}x_{2}$ has the off-diagonal entry $k$ in its matrix, so it reduces to a single square exactly when the determinant $ac - k^{2}$ is zero.",
    "标准形中平方项的个数等于二次型矩阵的秩。交叉项写成 $2kx_{1}x_{2}$ 的二次型，其矩阵的非对角元素是 $k$，所以它化为单个平方项，当且仅当行列式 $ac - k^{2}$ 为零。",
  ],
  (rng) => {
    const m = nz(rng, 4);
    const p = rng.int(1, 4);
    const q = rng.int(1, 4);
    const a = m * p * p;
    const c = m * q * q;
    const answer = Math.abs(m) * p * q;
    const form = poly([a, "x_{1}^{2}"], [1, "2kx_{1}x_{2}"], [c, "x_{2}^{2}"]);
    return ask(
      [
        `For which $k > 0$ does an orthogonal transformation reduce $Q = ${form}$ to a single square term?`,
        `当 $k > 0$ 为何值时，正交变换把 $Q = ${form}$ 化为单个平方项？`,
      ],
      answer,
      [2 * answer, a * c, Math.abs(a) + Math.abs(c)],
      [
        `The matrix of $Q$ has off-diagonal entry $k$, and one square term means one eigenvalue is zero. So $${wrap(a)} \\cdot ${wrap(c)} - k^{2} = 0$, which gives $k = ${answer}$.`,
        `$Q$ 的矩阵的非对角元素是 $k$，只有一个平方项意味着有一个特征值为零。所以 $${wrap(a)} \\cdot ${wrap(c)} - k^{2} = 0$，得 $k = ${answer}$。`,
      ],
    );
  },
);

const semiAxis = point(
  "the-semi-major-axis-of-a-rotated-ellipse",
  ["The semi-major axis of a rotated ellipse", "旋转椭圆的半长轴"],
  [
    "After an orthogonal change of variables, an ellipse is $\\lambda_{1}y_{1}^{2} + \\lambda_{2}y_{2}^{2} = d$, and its squared semi-axes are $\\frac{d}{\\lambda_{1}}$ and $\\frac{d}{\\lambda_{2}}$. The longer axis belongs to the smaller eigenvalue, which is the opposite of what one might first guess.",
    "经过正交变量替换后，椭圆为 $\\lambda_{1}y_{1}^{2} + \\lambda_{2}y_{2}^{2} = d$，其半轴的平方是 $\\frac{d}{\\lambda_{1}}$ 和 $\\frac{d}{\\lambda_{2}}$。较长的轴对应较小的特征值，这与直觉相反。",
  ],
  (rng) => {
    const a = rng.int(2, 9);
    const b = rng.pick([...Array(2 * a - 1).keys()].map((i) => i - a + 1).filter((i) => i !== 0));
    const d = rng.int(1, 20);
    const small = a - Math.abs(b);
    const big = a + Math.abs(b);
    const answer = Q.of(d, small);
    const curve = poly([a, "x^{2}"], [2 * b, "xy"], [a, "y^{2}"]);
    return ask(
      [`Find the square of the semi-major axis of the ellipse $${curve} = ${d}$.`, `求椭圆 $${curve} = ${d}$ 的半长轴的平方。`],
      answer,
      [Q.of(d, big), Q.of(d, a), d],
      [
        `The matrix has eigenvalues $${a} \\pm ${Math.abs(b)}$, that is $${small}$ and $${big}$. The longer axis belongs to the smaller eigenvalue, so its square is $${answer.toLatex()}$.`,
        `矩阵的特征值是 $${a} \\pm ${Math.abs(b)}$，即 $${small}$ 和 $${big}$。较长的轴对应较小的特征值，所以它的平方是 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const planeConstraint = point(
  "a-constraint-that-excludes-the-extreme-eigenvalue",
  ["A constraint that excludes the extreme eigenvalue", "排除极端特征值的约束"],
  [
    "An added linear constraint can exclude the eigenvector of the largest or smallest eigenvalue. If the extra constraint removes that direction, the extreme value of the form comes from the remaining block alone, so the eigenvalue of the full matrix is no longer the answer.",
    "增加一个线性约束可能排除最大或最小特征值的特征向量。如果这个约束去掉了那个方向，二次型的极值就只来自剩下的块，所以整个矩阵的那个特征值不再是答案。",
  ],
  (rng) => {
    const a = rng.int(2, 6);
    const b = nz(rng, 4);
    const max = rng.bool();
    const c = max ? a + Math.abs(b) + rng.int(1, 8) : a - Math.abs(b) - rng.int(1, 8);
    const answer = max ? a + Math.abs(b) : a - Math.abs(b);
    const form = poly([a, "x_{1}^{2}"], [2 * b, "x_{1}x_{2}"], [a, "x_{2}^{2}"], [c, "x_{3}^{2}"]);
    const word: Pair = max ? ["maximum", "最大值"] : ["minimum", "最小值"];
    return ask(
      [
        `Find the ${word[0]} of $Q = ${form}$ subject to $x_{1}^{2} + x_{2}^{2} + x_{3}^{2} = 1$ and $x_{3} = 0$.`,
        `求 $Q = ${form}$ 在 $x_{1}^{2} + x_{2}^{2} + x_{3}^{2} = 1$ 且 $x_{3} = 0$ 下的${word[1]}。`,
      ],
      answer,
      [c, a, max ? a - Math.abs(b) : a + Math.abs(b)],
      [
        `With $x_{3} = 0$, the $x_{3}^{2}$ term plays no part and $x_{1}^{2} + x_{2}^{2} = 1$. The remaining block has eigenvalues $${a} \\pm ${Math.abs(b)}$, so the ${word[0]} is $${answer}$.`,
        `$x_{3} = 0$ 时，$x_{3}^{2}$ 项不起作用，且 $x_{1}^{2} + x_{2}^{2} = 1$。剩下的块的特征值是 $${a} \\pm ${Math.abs(b)}$，所以${word[1]}是 $${answer}$。`,
      ],
    );
  },
);

const howManyAttain = point(
  "how-many-unit-vectors-attain-an-extreme-value",
  ["How many unit vectors attain an extreme value", "有多少单位向量取到极值"],
  [
    "The extreme value of a quadratic form on the unit sphere is attained on the unit vectors of its eigenspace. A one-dimensional eigenspace gives two unit vectors, opposite each other, and an eigenspace of dimension at least two gives a whole circle or more of them.",
    "二次型在单位球面上的极值在相应特征空间的单位向量处取到。一维特征空间给出两个互为相反的单位向量，维数至少为二的特征空间则给出一整个圆或更多的单位向量。",
  ],
  (rng) => {
    const a = nz(rng, 9);
    const c = rng.pick([-8, -6, -4, -2, 1, 3, 5, 7].filter((v) => v !== a));
    const j = rng.int(0, 2);
    const form = poly(...[0, 1, 2].map((i): [number, string] => [i === j ? c : a, `x_{${i + 1}}^{2}`]));
    const max = rng.bool();
    const single = max ? c > a : c < a;
    const word: Pair = max ? ["maximum", "最大值"] : ["minimum", "最小值"];
    const two: Pair = ["Exactly two", "恰好两个"];
    const many: Pair = ["Infinitely many", "无穷多个"];
    return choose(
      rng,
      [
        `How many unit vectors in $\\mathbb{R}^{3}$ attain the ${word[0]} of $Q = ${form}$?`,
        `$\\mathbb{R}^{3}$ 中有多少个单位向量取到 $Q = ${form}$ 的${word[1]}？`,
      ],
      single ? two : many,
      [single ? many : two, ["Exactly one", "恰好一个"], ["Exactly three", "恰好三个"]],
      single
        ? [
            `The extreme eigenvalue $${c}$ has a one-dimensional eigenspace, the $x_{${j + 1}}$ axis. It holds two unit vectors, which are opposite each other.`,
            `极端特征值 $${c}$ 的特征空间是一维的，即 $x_{${j + 1}}$ 轴。其中有两个互为相反的单位向量。`,
          ]
        : [
            `The extreme eigenvalue $${a}$ has a two-dimensional eigenspace, the plane $x_{${j + 1}} = 0$. Every point of the unit circle in this plane attains the value.`,
            `极端特征值 $${a}$ 的特征空间是二维的，即平面 $x_{${j + 1}} = 0$。这个平面上单位圆的每一点都取到该值。`,
          ],
    );
  },
);

const orthogonalColumns = point(
  "singular-values-from-orthogonal-columns",
  ["Singular values from orthogonal columns", "由正交列求奇异值"],
  [
    "When the columns of a matrix are orthogonal, $A^{T}A$ is diagonal with the squared column lengths on its diagonal. So the singular values are simply the lengths of the columns, and neither the entries nor the eigenvalues of $A$ need to be involved.",
    "当矩阵的各列正交时，$A^{T}A$ 是对角矩阵，对角线上是列长度的平方。所以奇异值就是各列的长度，既不需要 $A$ 的元素，也不需要它的特征值。",
  ],
  (rng) => {
    const [p, q, c] = rng.pick(triples);
    const m = nz(rng, 4);
    const k = nz(rng, 4);
    const big = Math.max(Math.abs(m), Math.abs(k));
    const answer = big * c;
    return ask(
      [
        `Find the largest singular value of $${mat([
          [m * p, -k * q],
          [m * q, k * p],
        ])}$.`,
        `求 $${mat([
          [m * p, -k * q],
          [m * q, k * p],
        ])}$ 的最大奇异值。`,
      ],
      answer,
      [big, (Math.abs(m) + Math.abs(k)) * c, big * Math.max(p, q)],
      [
        `The columns are orthogonal, with lengths $${Math.abs(m) * c}$ and $${Math.abs(k) * c}$. These are the singular values, and the larger is $${answer}$.`,
        `各列正交，长度分别为 $${Math.abs(m) * c}$ 和 $${Math.abs(k) * c}$。这些就是奇异值，较大的是 $${answer}$。`,
      ],
    );
  },
);

const svdAction = point(
  "the-image-of-a-right-singular-vector",
  ["The image of a right singular vector", "右奇异向量的像"],
  [
    "The equation $A = U\\Sigma V^{T}$ means $A\\mathbf{v}_{i} = \\sigma_{i}\\mathbf{u}_{i}$, so a right singular vector is sent to a multiple of the matching left singular vector. This gives the image directly, with no need to multiply the three matrices together first.",
    "等式 $A = U\\Sigma V^{T}$ 意味着 $A\\mathbf{v}_{i} = \\sigma_{i}\\mathbf{u}_{i}$，所以右奇异向量被送到相应左奇异向量的倍数。这直接给出像，不必先把三个矩阵乘起来。",
  ],
  (rng) => {
    const [p, q, c] = rng.pick(triples);
    const [a, b, e] = rng.pick(triples);
    const s2 = rng.int(1, 3);
    const s1 = s2 + rng.int(1, 3);
    const which = rng.int(1, 2);
    const entry = rng.int(0, 1);
    const sigma = which === 1 ? s1 * c : s2 * c;
    const u = which === 1 ? [p, q] : [-q, p];
    const answer = (sigma / c) * (u[entry] as number);
    const v = which === 1 ? [a, b] : [-b, a];
    const name = ordinal[entry] as Pair;
    const U = `\\frac{1}{${c}}${mat([
      [p, -q],
      [q, p],
    ])}`;
    const V = `\\frac{1}{${e}}${mat([
      [a, -b],
      [b, a],
    ])}`;
    const point2 = `\\frac{1}{${e}}${vec(v[0] as number, v[1] as number)}`;
    return ask(
      [
        `$A = U\\Sigma V^{T}$ with $U = ${U}$, $\\Sigma = \\operatorname{diag}(${s1 * c}, ${s2 * c})$ and $V = ${V}$. Find the ${name[0]} entry of $A${point2}$.`,
        `$A = U\\Sigma V^{T}$，其中 $U = ${U}$，$\\Sigma = \\operatorname{diag}(${s1 * c}, ${s2 * c})$，$V = ${V}$。求 $A${point2}$ 的${name[1]}个元素。`,
      ],
      answer,
      [sigma, (which === 1 ? s2 : s1) * (u[entry] as number), (sigma / c) * (u[1 - entry] as number)],
      [
        `This vector is column $${which}$ of $V$, so $A$ sends it to $${sigma}$ times column $${which}$ of $U$. The entry is $${sigma} \\cdot \\frac{${u[entry] as number}}{${c}} = ${answer}$.`,
        `这个向量是 $V$ 的第 $${which}$ 列，所以 $A$ 把它送到 $U$ 的第 $${which}$ 列的 $${sigma}$ 倍。该元素是 $${sigma} \\cdot \\frac{${u[entry] as number}}{${c}} = ${answer}$。`,
      ],
    );
  },
);

const repeatedInverse = point(
  "the-inverse-when-the-singular-values-are-equal",
  ["The inverse when the singular values are equal", "奇异值相等时的逆"],
  [
    "If both singular values of a $2 \\times 2$ matrix equal $\\sigma$, then $A^{T}A = \\sigma^{2}I$, so $A$ is $\\sigma$ times an orthogonal matrix. Its inverse is then $\\frac{1}{\\sigma^{2}}A^{T}$, which comes from the transpose and needs no cofactors.",
    "如果 $2 \\times 2$ 矩阵的两个奇异值都等于 $\\sigma$，则 $A^{T}A = \\sigma^{2}I$，所以 $A$ 是 $\\sigma$ 乘以一个正交矩阵。它的逆矩阵就是 $\\frac{1}{\\sigma^{2}}A^{T}$，由转置得到，不需要余子式。",
  ],
  (rng) => {
    const [p, q, c] = rng.pick(triples);
    const m = nz(rng, 3);
    const g = rng.bool() ? 1 : -1;
    const sigma2 = m * m * c * c;
    const entry = m * g * q;
    const answer = Q.of(entry, sigma2);
    return ask(
      [
        `Both singular values of $A = ${mat([
          [m * p, -entry],
          [entry, m * p],
        ])}$ are equal. Find the $(1, 2)$ entry of $A^{-1}$.`,
        `$A = ${mat([
          [m * p, -entry],
          [entry, m * p],
        ])}$ 的两个奇异值相等。求 $A^{-1}$ 的 $(1, 2)$ 元素。`,
      ],
      answer,
      [answer.neg(), entry, Q.of(entry, Math.abs(m) * c)],
      [
        `$A^{T}A = ${sigma2}I$, so $\\sigma^{2} = ${sigma2}$ and $A^{-1} = \\frac{1}{${sigma2}}A^{T}$. The $(1, 2)$ entry of $A^{T}$ is $${entry}$, which gives $${answer.toLatex()}$.`,
        `$A^{T}A = ${sigma2}I$，所以 $\\sigma^{2} = ${sigma2}$，$A^{-1} = \\frac{1}{${sigma2}}A^{T}$。$A^{T}$ 的 $(1, 2)$ 元素是 $${entry}$，于是得 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const rankForError = point(
  "the-smallest-rank-that-meets-an-error-budget",
  ["The smallest rank that meets an error budget", "满足误差要求的最小秩"],
  [
    "The best rank-$k$ approximation from the SVD has squared Frobenius error equal to the sum of the squares of the discarded singular values. So the smallest rank meeting an error budget is found by adding squares from the small end, not by comparing the singular values themselves with the budget.",
    "由 SVD 得到的最佳秩 $k$ 近似，其弗罗贝尼乌斯误差的平方等于被舍弃的奇异值的平方和。所以满足误差要求的最小秩要从小的一端累加平方得到，而不是把奇异值本身与要求比较。",
  ],
  (rng) => {
    const values = rng
      .sample(
        [...Array(12).keys()].map((i) => i + 1),
        5,
      )
      .slice()
      .sort((x, y) => y - x);
    const tail = (k: number) => values.slice(k).reduce((sum, s) => sum + s * s, 0);
    const answer = rng.int(1, 4);
    const budget = tail(answer) + rng.int(0, tail(answer - 1) - tail(answer) - 1);
    return ask(
      [
        `A matrix has singular values $${values.join(", ")}$. Find the smallest $k$ for which the best rank-$k$ approximation has $\\|A - A_{k}\\|_{F}^{2} \\le ${budget}$.`,
        `一个矩阵的奇异值是 $${values.join(", ")}$。求使最佳秩 $k$ 近似满足 $\\|A - A_{k}\\|_{F}^{2} \\le ${budget}$ 的最小 $k$。`,
      ],
      answer,
      [answer + 1, answer === 1 ? 5 : answer - 1, answer === 4 ? 3 : 4],
      [
        `Rank $${answer}$ discards the squares that add up to $${tail(answer)}$, which meets the budget, while rank $${answer - 1}$ leaves $${tail(answer - 1)}$, which does not. So $k = ${answer}$.`,
        `秩 $${answer}$ 舍弃的平方和是 $${tail(answer)}$，满足要求，而秩 $${answer - 1}$ 留下 $${tail(answer - 1)}$，不满足。所以 $k = ${answer}$。`,
      ],
    );
  },
);

const uniqueFit = point(
  "the-fitted-vector-is-unique-even-when-the-solution-is-not",
  ["The fitted vector is unique even when the solution is not", "即使解不唯一，拟合向量也唯一"],
  [
    "With dependent columns, the least-squares solution $\\hat{\\mathbf{x}}$ is not unique, but the fitted vector $A\\hat{\\mathbf{x}}$ is, since it is the projection of $\\mathbf{b}$ onto the column space. So it can be found without choosing any particular solution.",
    "当各列线性相关时，最小二乘解 $\\hat{\\mathbf{x}}$ 不唯一，但拟合向量 $A\\hat{\\mathbf{x}}$ 是唯一的，因为它是 $\\mathbf{b}$ 到列空间的投影。所以不必选取特定的解就能求出它。",
  ],
  (rng) => {
    const a = nz(rng, 5);
    const c = nz(rng, 5);
    const s = nz(rng, 4);
    const t = nz(rng, 3);
    const m = nz(rng, 4);
    const b1 = s * a - t * c;
    const b2 = s * c + t * a;
    const dot = b1 * a + b2 * c;
    const norm = a * a + c * c;
    const entry = rng.int(0, 1);
    const answer = s * (entry === 0 ? a : c);
    const name = ordinal[entry] as Pair;
    return ask(
      [
        `$A = ${mat([
          [a, m * a],
          [c, m * c],
        ])}$ and $\\mathbf{b} = ${vec(b1, b2)}$. The least-squares solutions $\\hat{\\mathbf{x}}$ are not unique. Find the ${name[0]} entry of $A\\hat{\\mathbf{x}}$.`,
        `$A = ${mat([
          [a, m * a],
          [c, m * c],
        ])}$，$\\mathbf{b} = ${vec(b1, b2)}$。最小二乘解 $\\hat{\\mathbf{x}}$ 不唯一。求 $A\\hat{\\mathbf{x}}$ 的${name[1]}个元素。`,
      ],
      answer,
      [entry === 0 ? b1 : b2, s, m * answer],
      [
        `The column space is the line through $${vec(a, c)}$, and $A\\hat{\\mathbf{x}}$ is the projection of $\\mathbf{b}$ onto it. The coefficient is $\\frac{${dot}}{${norm}} = ${s}$, so the entry is $${answer}$.`,
        `列空间是过 $${vec(a, c)}$ 的直线，$A\\hat{\\mathbf{x}}$ 是 $\\mathbf{b}$ 到它的投影。系数是 $\\frac{${dot}}{${norm}} = ${s}$，所以该元素是 $${answer}$。`,
      ],
    );
  },
);

const qrResidual = point(
  "the-residual-from-the-qr-factorization",
  ["The residual from the QR factorization", "由 QR 分解求残差"],
  [
    "The columns of $Q$ are orthonormal, so $Q^{T}\\mathbf{b}$ holds the coordinates of the projection of $\\mathbf{b}$ onto the column space, and its length is the length of that projection. The Pythagorean theorem then gives the squared residual without solving for $\\hat{\\mathbf{x}}$.",
    "$Q$ 的各列标准正交，所以 $Q^{T}\\mathbf{b}$ 是 $\\mathbf{b}$ 到列空间的投影的坐标，它的长度就是这个投影的长度。于是勾股定理不用解出 $\\hat{\\mathbf{x}}$ 就能给出残差的平方。",
  ],
  (rng) => {
    const p = nz(rng, 6);
    const q = nz(rng, 6);
    const answer = rng.int(1, 30);
    const N = p * p + q * q + answer;
    return ask(
      [
        `$A = QR$, where $Q$ has orthonormal columns, $\\|\\mathbf{b}\\|^{2} = ${N}$ and $Q^{T}\\mathbf{b} = ${vec(p, q)}$. Find the minimum of $\\|A\\mathbf{x} - \\mathbf{b}\\|^{2}$.`,
        `$A = QR$，其中 $Q$ 的各列标准正交，$\\|\\mathbf{b}\\|^{2} = ${N}$，$Q^{T}\\mathbf{b} = ${vec(p, q)}$。求 $\\|A\\mathbf{x} - \\mathbf{b}\\|^{2}$ 的最小值。`,
      ],
      answer,
      [N, p * p + q * q, N - Math.abs(p) - Math.abs(q)],
      [
        `The projection of $\\mathbf{b}$ has squared length $${p * p} + ${q * q} = ${p * p + q * q}$. The residual is orthogonal to it, so its squared length is $${N} - ${p * p + q * q} = ${answer}$.`,
        `$\\mathbf{b}$ 的投影的长度平方是 $${p * p} + ${q * q} = ${p * p + q * q}$。残差与它正交，所以残差的长度平方是 $${N} - ${p * p + q * q} = ${answer}$。`,
      ],
    );
  },
);

const weightedSlope = point(
  "a-weighted-slope-through-the-origin",
  ["A weighted slope through the origin", "过原点的加权斜率"],
  [
    "For the model $y = mx$ with weights $w_{i}$, the weighted normal equation $A^{T}WA\\,m = A^{T}W\\mathbf{y}$ becomes one fraction, $m = \\frac{\\sum w_{i}x_{i}y_{i}}{\\sum w_{i}x_{i}^{2}}$. The weight must appear in both the numerator and the denominator of this fraction.",
    "对带权重 $w_{i}$ 的模型 $y = mx$，加权正规方程 $A^{T}WA\\,m = A^{T}W\\mathbf{y}$ 化为一个分式 $m = \\frac{\\sum w_{i}x_{i}y_{i}}{\\sum w_{i}x_{i}^{2}}$。权重必须同时出现在这个分式的分子和分母中。",
  ],
  (rng) => {
    const xs = rng.sample([-3, -2, -1, 1, 2, 3], 3);
    const ys = [rng.int(-6, 6), rng.int(-6, 6), rng.int(-6, 6)];
    const ws = [rng.int(1, 5), rng.int(1, 5), rng.int(1, 5)];
    const sum = (f: (i: number) => number) => f(0) + f(1) + f(2);
    const x = (i: number) => xs[i] as number;
    const y = (i: number) => ys[i] as number;
    const w = (i: number) => ws[i] as number;
    const top = sum((i) => w(i) * x(i) * y(i));
    const bottom = sum((i) => w(i) * x(i) * x(i));
    const answer = Q.of(top, bottom);
    const data = [0, 1, 2].map((i) => `(${x(i)}, ${y(i)})`).join(", ");
    return ask(
      [
        `Fit $y = mx$ by weighted least squares to $${data}$ with weights $${ws.join(", ")}$. Find $m$.`,
        `用加权最小二乘法把 $y = mx$ 拟合到 $${data}$，权重为 $${ws.join(", ")}$。求 $m$。`,
      ],
      answer,
      [
        Q.of(
          sum((i) => x(i) * y(i)),
          sum((i) => x(i) * x(i)),
        ),
        Q.of(
          top,
          sum((i) => x(i) * x(i)),
        ),
        answer.neg(),
      ],
      [
        `$\\sum w_{i}x_{i}y_{i} = ${top}$ and $\\sum w_{i}x_{i}^{2} = ${bottom}$, so dividing gives $m = ${answer.toLatex()}$.`,
        `$\\sum w_{i}x_{i}y_{i} = ${top}$，$\\sum w_{i}x_{i}^{2} = ${bottom}$，所以相除得 $m = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const steadyState = point(
  "the-steady-state-of-a-two-state-chain",
  ["The steady state of a two-state chain", "两状态马尔可夫链的稳态"],
  [
    "A steady state satisfies $P\\mathbf{s} = \\mathbf{s}$ with entries that sum to $1$. In a two-state chain, this says that the flow out of each state balances the flow into it, so each state's share is proportional to the probability of moving into it from the other state.",
    "稳态满足 $P\\mathbf{s} = \\mathbf{s}$，且各分量之和为 $1$。在两状态链中，这表示流出每个状态的量与流入它的量平衡，所以每个状态的份额与从另一状态转入它的概率成正比。",
  ],
  (rng) => {
    const d = rng.pick([4, 5, 8, 10]);
    const p = rng.int(1, d - 1);
    const q = rng.int(1, d - 1);
    const a = Q.of(p, d);
    const b = Q.of(q, d);
    const first = rng.bool();
    const answer = Q.of(first ? q : p, p + q);
    const P = mat([
      [Q.of(d - p, d).toLatex(), b.toLatex()],
      [a.toLatex(), Q.of(d - q, d).toLatex()],
    ]);
    const name = first ? "1" : "2";
    return ask(
      [
        `A Markov chain has the column-stochastic transition matrix $P = ${P}$. Find the long-run probability of state $${name}$.`,
        `一个马尔可夫链的列随机转移矩阵是 $P = ${P}$。求状态 $${name}$ 的长期概率。`,
      ],
      answer,
      [Q.of(first ? p : q, p + q), first ? b : a, Q.of(1, 2)],
      [
        `Balance requires $${a.toLatex()}s_{1} = ${b.toLatex()}s_{2}$ with $s_{1} + s_{2} = 1$. So $s_{1} = \\frac{${q}}{${p + q}}$ and $s_{2} = \\frac{${p}}{${p + q}}$, and the requested value is $${answer.toLatex()}$.`,
        `平衡要求 $${a.toLatex()}s_{1} = ${b.toLatex()}s_{2}$，且 $s_{1} + s_{2} = 1$。所以 $s_{1} = \\frac{${q}}{${p + q}}$，$s_{2} = \\frac{${p}}{${p + q}}$，所求值是 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const normalMatrixEntry = point(
  "an-entry-of-the-normal-matrix-is-a-power-sum",
  ["An entry of the normal matrix is a power sum", "正规矩阵的元素是幂和"],
  [
    "For a quadratic fit, the columns of $X$ are $1$, $x$ and $x^{2}$, so the $(i, j)$ entry of $X^{T}X$ is a sum of powers of the inputs with exponent $i + j - 2$. The matrix can be filled in from these power sums, and no outputs are involved.",
    "对二次拟合，$X$ 的各列是 $1$、$x$ 和 $x^{2}$，所以 $X^{T}X$ 的 $(i, j)$ 元素是输入的幂和，指数为 $i + j - 2$。这个矩阵可以由这些幂和填出，与输出无关。",
  ],
  (rng) => {
    const xs = rng.sample([-3, -2, -1, 0, 1, 2, 3, 4], 4);
    const i = rng.int(1, 3);
    const j = rng.int(1, 3);
    const e = i + j - 2;
    const power = (k: number) => xs.reduce((sum, x) => sum + x ** k, 0);
    const answer = power(e);
    const term = e === 0 ? "1" : e === 1 ? "x_{k}" : `x_{k}^{${e}}`;
    return ask(
      [
        `A quadratic $y = \\beta_{0} + \\beta_{1}x + \\beta_{2}x^{2}$ is fitted to data with inputs $${xs.join(", ")}$, with design matrix $X$. Find the $(${i}, ${j})$ entry of $X^{T}X$.`,
        `用二次式 $y = \\beta_{0} + \\beta_{1}x + \\beta_{2}x^{2}$ 拟合输入为 $${xs.join(", ")}$ 的数据，设计矩阵为 $X$。求 $X^{T}X$ 的 $(${i}, ${j})$ 元素。`,
      ],
      answer,
      [power(e + 1), power(i + j), power(Math.max(i, j) - 1), e === 0 ? 3 : 4],
      [
        `Column $${i}$ times column $${j}$ gives the sum of $${term}$ over the four inputs, since the exponents add to $${e}$. That sum is $${answer}$.`,
        `第 $${i}$ 列乘以第 $${j}$ 列，得到 $${term}$ 对四个输入的和，因为指数相加为 $${e}$。这个和是 $${answer}$。`,
      ],
    );
  },
);

/** deeperLinearAlgebraThird2Points maps topics of Linear Algebra, from complex vectors to regression, to a third knowledge point. */
export const deeperLinearAlgebraThird2Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "vectors-over-the-complex-numbers": [hermitianProduct],
  "finding-complex-eigenvalues-of-real-2x2-matrices": [complexThreshold],
  "finding-complex-eigenvectors-of-real-2x2-matrices": [rowFromComplexPair],
  "finding-generalized-eigenvectors-of-specific-ranks": [generalizedRank],
  "jordan-canonical-decomposition-of-a-2x2-matrix": [jordanPower],
  "orthogonal-vectors-in-euclidean-spaces": [pythagorasReverse],
  "orthogonal-complements": [complementPart],
  "orthogonal-sets-in-euclidean-spaces": [combosDot],
  "orthogonal-sets-in-inner-product-spaces": [orthogonalShift],
  "orthogonal-linear-transformations": [orthogonalInverse],
  "four-fundamental-subspaces-of-a-matrix": [rowsFromNullities],
  "components-of-a-vector-with-respect-to-an-orthogonal-or-orthonormal-basis": [coefficientSquaredNorm],
  "projecting-vectors-onto-subspaces-in-euclidean-spaces-arbitrary-bases": [projectionMatrix],
  "projecting-vectors-onto-subspaces-in-euclidean-spaces-arbitrary-bases-applications": [symmetricLineFit],
  "projecting-vectors-onto-subspaces-in-inner-product-spaces": [bestMultipleOfX],
  "gram-schmidt-process-for-two-vectors": [gramLength],
  "gram-schmidt-process-in-the-general-case": [gramDependent],
  "diagonalization-of-2x2-symmetric-matrices": [symmetricAction],
  "diagonalization-of-3x3-symmetric-matrices": [repeatedSymmetric],
  "change-of-variables-in-quadratic-forms": [shearRemoving],
  "canonical-form-of-a-quadratic-form-using-orthogonal-transformations": [singleSquare],
  "classifying-quadratic-curves": [semiAxis],
  "constrained-optimization-of-quadratic-forms": [planeConstraint],
  "constrained-optimization-of-quadratic-forms-determining-where-extrema-are-attained": [howManyAttain],
  "singular-values-of-a-matrix": [orthogonalColumns],
  "singular-value-decomposition-of-2x2-matrices": [svdAction],
  "singular-value-decomposition-of-2x2-matrices-with-zero-or-repeated-eigenvalues": [repeatedInverse],
  "singular-value-decomposition-of-larger-matrices": [rankForError],
  "least-squares-solution-of-a-linear-system-with-collinearity": [uniqueFit],
  "finding-a-least-squares-solution-using-qr-factorization": [qrResidual],
  "weighted-least-squares": [weightedSlope],
  "markov-chains": [steadyState],
  "polynomial-regression-with-matrices": [normalMatrixEntry],
};
