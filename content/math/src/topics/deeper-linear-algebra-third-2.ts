// Third knowledge points for thin topics of Linear Algebra, from complex vectors to
// regression: the reverse question, a harder case or a common trap.
// See `deeperLinearAlgebraThird2Points`.

import type { KnowledgePointDef, Rng, Text } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";
import { linearAlgebraDrawings2 } from "../explanation-drawings-linear-algebra-2.ts";
import { numberProblem, why } from "../problems.ts";
import { ask, choose, type Pair, point } from "../university-kit.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** text turns a pair of strings into a Text. */
const text = ([en, zh]: Pair): Text => t(en, zh);

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
    "The inner product on $\\mathbb{C}^{n}$ conjugates the entries of one vector, so that a vector paired with itself gives a real, nonnegative length. Leaving out the conjugate gives a different number, and the imaginary part is usually where this difference shows. For example, $\\mathbf{u} = (i, 1)$ and $\\mathbf{v} = (1, i)$ give $\\overline{\\mathbf{u}}^{T}\\mathbf{v} = (-i)(1) + (1)(i) = 0$, while leaving out the conjugate gives $i + i = 2i$.\n\n> **Watch out.** Conjugate the entries of $\\mathbf{u}$, not those of $\\mathbf{v}$: conjugating $\\mathbf{v}$ gives the conjugate number, whose imaginary part has the opposite sign.",
    "$\\mathbb{C}^{n}$ 上的内积要把一个向量的元素取共轭，这样向量与自身配对时才得到非负实数长度。漏掉共轭会得到不同的数，这个差别通常体现在虚部上。例如 $\\mathbf{u} = (i, 1)$，$\\mathbf{v} = (1, i)$ 给出 $\\overline{\\mathbf{u}}^{T}\\mathbf{v} = (-i)(1) + (1)(i) = 0$，而漏掉共轭会得到 $i + i = 2i$。\n\n> **注意。** 要共轭 $\\mathbf{u}$ 的元素，而不是 $\\mathbf{v}$ 的：共轭 $\\mathbf{v}$ 得到的是共轭的数，其虚部符号相反。",
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
    const im1 = a1 * d1 - b1 * c1;
    const im2 = a2 * d2 - b2 * c2;
    return numberProblem({
      prompt: text([
        `Find the imaginary part of $${product}$ for $\\mathbf{u} = ${u}$ and $\\mathbf{v} = ${v}$.`,
        `对 $\\mathbf{u} = ${u}$，$\\mathbf{v} = ${v}$，求 $${product}$ 的虚部。`,
      ]),
      answer,
      form: "integer",
      mistakes: [
        why(a1 * d1 + b1 * c1 + a2 * d2 + b2 * c2, "The conjugate of $\\mathbf{u}$ is left out.", "漏掉了 $\\mathbf{u}$ 的共轭。"),
        why(a1 * c1 + b1 * d1 + a2 * c2 + b2 * d2, "That is the real part of the product.", "这是乘积的实部。"),
        why(
          -answer,
          "That conjugates $\\mathbf{v}$ instead of $\\mathbf{u}$, which flips the sign of the imaginary part.",
          "这是共轭了 $\\mathbf{v}$ 而不是 $\\mathbf{u}$，使虚部变号。",
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Conjugate $\\mathbf{u}$", "共轭 $\\mathbf{u}$"],
            text([
              `$\\overline{\\mathbf{u}}$ has entries $${complex(a1, -b1)}$ and $${complex(a2, -b2)}$.`,
              `$\\overline{\\mathbf{u}}$ 的元素是 $${complex(a1, -b1)}$ 和 $${complex(a2, -b2)}$。`,
            ]),
          ],
          [
            ["Take the imaginary part of each product", "取每个乘积的虚部"],
            text(["The imaginary part of $(x - yi)(z + wi)$ is $xw - yz$:", "$(x - yi)(z + wi)$ 的虚部是 $xw - yz$："]),
            [
              `${wrap(a1)} \\cdot ${wrap(d1)} ${b1 * c1 < 0 ? "+" : "-"} ${Math.abs(b1 * c1)} = ${im1}`,
              `${wrap(a2)} \\cdot ${wrap(d2)} ${b2 * c2 < 0 ? "+" : "-"} ${Math.abs(b2 * c2)} = ${im2}`,
            ],
          ],
          [["Add", "相加"], text(["", ""]), [`${im1} + ${wrap(im2)} = ${answer}`]],
        ],
        text([
          `The first product in full is $(${complex(a1, -b1)})(${complex(c1, d1)}) = ${complex(a1 * c1 + b1 * d1, im1)}$, whose imaginary part is $${im1}$.`,
          `第一个乘积完整写出为 $(${complex(a1, -b1)})(${complex(c1, d1)}) = ${complex(a1 * c1 + b1 * d1, im1)}$，虚部为 $${im1}$。`,
        ]),
      ),
    });
  },
);

const complexThreshold = point(
  "the-largest-entry-that-keeps-eigenvalues-complex",
  ["The largest entry that keeps eigenvalues complex", "使特征值保持复数的最大元素"],
  [
    "A real $2 \\times 2$ matrix has non-real eigenvalues exactly when the discriminant $(a - d)^{2} + 4bc$ of its characteristic polynomial is negative. So when $b$ is positive, the entry $c$ must lie strictly below a bound, and a discriminant of zero gives a repeated real eigenvalue instead. For example, $\\begin{pmatrix} 1 & 1 \\\\ k & 3 \\end{pmatrix}$ has discriminant $4 + 4k$, which is negative for $k < -1$, so the largest integer is $k = -2$.\n\n> **Watch out.** The inequality is strict: at the bound itself the discriminant is $0$ and the eigenvalues are real. Keep the sign of the bound, which is negative when $b > 0$.",
    "实 $2 \\times 2$ 矩阵有非实特征值，当且仅当特征多项式的判别式 $(a - d)^{2} + 4bc$ 为负。所以当 $b$ 为正时，元素 $c$ 必须严格小于某个界，判别式为零时得到的则是重实特征值。例如 $\\begin{pmatrix} 1 & 1 \\\\ k & 3 \\end{pmatrix}$ 的判别式为 $4 + 4k$，当 $k < -1$ 时为负，所以最大整数为 $k = -2$。\n\n> **注意。** 不等式是严格的：在界上判别式为 $0$，特征值是实数。要保留界的符号，$b > 0$ 时它是负的。",
  ],
  (rng) => {
    const a = rng.int(-6, 6);
    const d = rng.int(-6, 6);
    const b = rng.int(1, 5);
    const D = (a - d) ** 2;
    const floor = Math.floor(D / (4 * b));
    const answer = -floor - 1;
    const bound = Q.of(-D, 4 * b);
    const M = mat([
      [a, b],
      ["k", d],
    ]);
    const disc = (k: number) => D + 4 * b * k;
    return numberProblem({
      prompt: text([`Find the largest integer $k$ for which $${M}$ has non-real eigenvalues.`, `求使 $${M}$ 有非实特征值的最大整数 $k$。`]),
      answer,
      form: "integer",
      mistakes: [
        why(
          -floor,
          `At $k = ${-floor}$ the discriminant is $${disc(-floor)}$, not negative, so the eigenvalues are real.`,
          `$k = ${-floor}$ 时判别式为 $${disc(-floor)}$，不是负数，所以特征值是实数。`,
        ),
        why(
          -floor - 2,
          `That works, but $${answer}$ is larger and still gives a negative discriminant.`,
          `它满足条件，但 $${answer}$ 更大，判别式仍为负。`,
        ),
        why(
          floor + 1,
          "The sign of the bound is lost; with $b > 0$ the entry must be negative.",
          "界的符号丢了；$b > 0$ 时这个元素必须为负。",
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Write the discriminant", "写出判别式"],
            text([
              `$(\\operatorname{tr})^2 - 4\\det = (a - d)^2 + 4bk$ for this matrix:`,
              `对这个矩阵，$(\\operatorname{tr})^2 - 4\\det = (a - d)^2 + 4bk$：`,
            ]),
            [`${wrap(a - d)}^2 + 4 \\cdot ${b} \\cdot k = ${D} + ${4 * b}k`],
          ],
          [["Make it negative", "令其为负"], text(["", ""]), [`${D} + ${4 * b}k < 0`, `k < ${bound.toLatex()}`]],
          [
            ["Take the largest integer", "取最大整数"],
            text([
              `The largest integer strictly below $${bound.toLatex()}$ is $${answer}$.`,
              `严格小于 $${bound.toLatex()}$ 的最大整数是 $${answer}$。`,
            ]),
          ],
        ],
        text([
          `$k = ${answer}$ gives the discriminant $${disc(answer)} < 0$, while $k = ${answer + 1}$ gives $${disc(answer + 1)} \\ge 0$.`,
          `$k = ${answer}$ 给出判别式 $${disc(answer)} < 0$，而 $k = ${answer + 1}$ 给出 $${disc(answer + 1)} \\ge 0$。`,
        ]),
      ),
    });
  },
);

const rowFromComplexPair = point(
  "a-row-of-a-real-matrix-from-a-complex-eigenpair",
  ["A row of a real matrix from a complex eigenpair", "由复特征对求实矩阵的一行"],
  [
    "One complex equation holds two real equations. For a real matrix, the first row of $A\\mathbf{v} = \\lambda\\mathbf{v}$ with $\\mathbf{v} = (1, p + qi)$ can be split into real and imaginary parts, and comparing them determines both entries of that row of the matrix. For example, $\\mathbf{v} = (1, 1 + 2i)$ and $\\lambda = 3 + 4i$: the first row $(s, t)$ gives $s + t(1 + 2i) = 3 + 4i$, so $2t = 4$, $t = 2$, and $s + 2 = 3$, $s = 1$.\n\n> **Watch out.** The imaginary parts give $tq = \\operatorname{Im}\\lambda$, so divide by $q$; and the real part of $\\lambda$ is $s + tp$, not $s$ alone.",
    "一个复方程包含两个实方程。对实矩阵，$\\mathbf{v} = (1, p + qi)$ 时 $A\\mathbf{v} = \\lambda\\mathbf{v}$ 的第一行可以分成实部和虚部，比较它们就能确定矩阵这一行的两个元素。例如 $\\mathbf{v} = (1, 1 + 2i)$，$\\lambda = 3 + 4i$：第一行 $(s, t)$ 给出 $s + t(1 + 2i) = 3 + 4i$，所以 $2t = 4$，$t = 2$，而 $s + 2 = 3$，$s = 1$。\n\n> **注意。** 虚部给出 $tq = \\operatorname{Im}\\lambda$，要除以 $q$；$\\lambda$ 的实部是 $s + tp$，而不只是 $s$。",
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
    const tp = t * p;
    const sSum = `${a} ${tp < 0 ? "+" : "-"} ${Math.abs(tp)}`;
    const mistakes = entry
      ? [
          why(
            b,
            `That is $\\operatorname{Im}\\lambda$; it equals $${wrap(q)}t$, so divide by $${q}$.`,
            `这是 $\\operatorname{Im}\\lambda$；它等于 $${wrap(q)}t$，要除以 $${q}$。`,
          ),
          why(-t, "The sign is flipped; compare the imaginary parts again.", "符号反了；请重新比较虚部。"),
          why(
            a,
            "That is $\\operatorname{Re}\\lambda$; the entry comes from the imaginary parts.",
            "这是 $\\operatorname{Re}\\lambda$；这个元素由虚部求出。",
          ),
        ]
      : [
          why(
            a,
            `That is $\\operatorname{Re}\\lambda$; it equals $s + ${wrap(t)} \\cdot ${wrap(p)}$, not $s$ alone.`,
            `这是 $\\operatorname{Re}\\lambda$；它等于 $s + ${wrap(t)} \\cdot ${wrap(p)}$，而不只是 $s$。`,
          ),
          why(a + tp, "The term $tp$ is added instead of subtracted.", "$tp$ 一项被加上了，应当减去。"),
          why(t, "That is the $(1, 2)$ entry, found from the imaginary parts.", "这是由虚部求出的 $(1, 2)$ 元素。"),
        ];
    return numberProblem({
      prompt: text([
        `A real $2 \\times 2$ matrix $A$ has the eigenvector $${v}$ for the eigenvalue $${lambda}$. Find the $${name}$ entry of $A$.`,
        `实 $2 \\times 2$ 矩阵 $A$ 有关于特征值 $${lambda}$ 的特征向量 $${v}$。求 $A$ 的 $${name}$ 元素。`,
      ]),
      answer,
      form: "integer",
      mistakes: mistakes.filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Write the first row", "写出第一行"],
            text([
              `Call the first row $(s, t)$. The first entry of $A\\mathbf{v} = \\lambda\\mathbf{v}$ reads:`,
              `设第一行为 $(s, t)$。$A\\mathbf{v} = \\lambda\\mathbf{v}$ 的第一个分量为：`,
            ]),
            [`s + t(${complex(p, q)}) = ${lambda}`],
          ],
          [["Compare imaginary parts", "比较虚部"], text(["", ""]), [`${q === 1 ? "" : q === -1 ? "-" : q}t = ${b}`, `t = ${t}`]],
          [["Compare real parts", "比较实部"], text(["", ""]), [`s ${tp < 0 ? "-" : "+"} ${Math.abs(tp)} = ${a}`, `s = ${sSum} = ${s}`]],
        ],
        text([
          `$${s} + ${wrap(t)}(${complex(p, q)}) = ${complex(s + tp, t * q)} = ${lambda}$.`,
          `$${s} + ${wrap(t)}(${complex(p, q)}) = ${complex(s + tp, t * q)} = ${lambda}$。`,
        ]),
      ),
    });
  },
);

const generalizedRank = point(
  "the-rank-of-a-given-generalized-eigenvector",
  ["The rank of a given generalized eigenvector", "给定广义特征向量的秩"],
  [
    "The rank of a generalized eigenvector is the smallest $k$ for which $(A - \\lambda I)^{k}$ sends it to zero. For an upper triangular block with nonzero superdiagonal, each application of $A - \\lambda I$ pushes the lowest nonzero entry up by one, so the position of that entry gives the rank. For example, with $N = A - \\lambda I$ having nonzero superdiagonal, the vector $(5, 2, 0)$ has its lowest nonzero entry in position $2$: one application of $N$ leaves only a first entry, and a second gives zero, so its rank is $2$.\n\n> **Watch out.** The rank is set by the lowest nonzero entry, not by the number of nonzero entries: $(0, 0, 1)$ has rank $3$, and $(4, 0, 0)$ has rank $1$, an ordinary eigenvector.",
    "广义特征向量的秩是使 $(A - \\lambda I)^{k}$ 把它变为零的最小 $k$。对上对角线元素非零的上三角块，每作用一次 $A - \\lambda I$，最低的非零元素就上移一位，所以这个元素的位置给出秩。例如当 $N = A - \\lambda I$ 的上对角线元素非零时，向量 $(5, 2, 0)$ 最低的非零元素在第 $2$ 位：作用一次 $N$ 后只剩第一个分量，再作用一次就得零，所以秩为 $2$。\n\n> **注意。** 秩由最低的非零元素决定，而不是由非零元素的个数决定：$(0, 0, 1)$ 的秩是 $3$，$(4, 0, 0)$ 的秩是 $1$，即普通特征向量。",
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
    const once = [p * x2 + q * x3 + 0, r * x3 + 0, 0] as const;
    const twice = [p * r * x3 + 0, 0, 0] as const;
    const images = [`N\\mathbf{v} = ${vec(...once)}`, `N^{2}\\mathbf{v} = ${vec(...twice)}`, `N^{3}\\mathbf{v} = ${vec(0, 0, 0)}`].slice(
      0,
      answer,
    );
    return numberProblem({
      prompt: text([
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
      ]),
      answer,
      form: "integer",
      mistakes: [
        ...(answer > 1
          ? [
              why(
                answer - 1,
                "Count the powers up to the first that gives zero, not the last that gives a nonzero vector.",
                "要数到第一个得零的幂，而不是最后一个得非零向量的幂。",
              ),
            ]
          : []),
        why(
          answer + 1,
          "Stop at the first power that gives zero; one more application is not needed.",
          "到第一个得零的幂就停止，不需要再作用一次。",
        ),
        why(
          3,
          "That is the size of the block, the largest possible rank, not the rank of this vector.",
          "这是块的大小，即可能的最大秩，不是这个向量的秩。",
        ),
        why(4, "No generalized eigenvector of a $3 \\times 3$ block has rank above $3$.", "$3 \\times 3$ 块的广义特征向量的秩不超过 $3$。"),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Subtract the eigenvalue", "减去特征值"],
            text([`Let $\\mathbf{v} = ${vec(x1, x2, x3)}$ and`, `设 $\\mathbf{v} = ${vec(x1, x2, x3)}$，且`]),
            [
              `N = A - ${wrap(l)}I = ${mat([
                [0, p, q],
                [0, 0, r],
                [0, 0, 0],
              ])}`,
            ],
          ],
          [["Apply N until zero", "反复作用 N 直到得零"], text(["", ""]), images],
          [
            ["Read the rank", "读出秩"],
            text([
              `The first power that gives zero is $${answer === 1 ? "N" : `N^{${answer}}`}$, so the rank is $${answer}$.`,
              `第一个得零的幂是 $${answer === 1 ? "N" : `N^{${answer}}`}$，所以秩为 $${answer}$。`,
            ]),
          ],
        ],
        text([
          `The lowest nonzero entry of $\\mathbf{v}$ is in position $${answer}$, which agrees with the rank.`,
          `$\\mathbf{v}$ 最低的非零元素在第 $${answer}$ 位，与秩一致。`,
        ]),
      ),
    });
  },
);

const jordanPower = point(
  "a-power-of-a-jordan-block",
  ["A power of a Jordan block", "若尔当块的幂"],
  [
    "Write a $2 \\times 2$ Jordan-type matrix as $\\lambda I + N$ with $N^{2} = 0$. Then the binomial theorem stops after two terms: $A^{n} = \\lambda^{n}I + n\\lambda^{n - 1}N$. The off-diagonal entry therefore gains a factor of $n$, which is not what raising each entry to a power would give. For example, rows $(2, 5)$ and $(0, 2)$ give $N$ with the single entry $5$, and the $(1, 2)$ entry of $A^{3}$ is $3 \\cdot 2^{2} \\cdot 5 = 60$.\n\n> **Watch out.** Do not raise the entries to the power one by one: $5^{3}$ is not the $(1, 2)$ entry of $A^{3}$. That entry is $n\\lambda^{n - 1}b$, with the factor $n$.",
    "把 $2 \\times 2$ 若尔当型矩阵写成 $\\lambda I + N$，其中 $N^{2} = 0$。于是二项式定理两项后就终止：$A^{n} = \\lambda^{n}I + n\\lambda^{n - 1}N$。所以对角线外的元素多了因子 $n$，这与逐个元素取幂的结果不同。例如行为 $(2, 5)$ 和 $(0, 2)$ 时，$N$ 只有一个元素 $5$，$A^{3}$ 的 $(1, 2)$ 元素是 $3 \\cdot 2^{2} \\cdot 5 = 60$。\n\n> **注意。** 不要逐个元素取幂：$5^{3}$ 不是 $A^{3}$ 的 $(1, 2)$ 元素。这个元素是 $n\\lambda^{n - 1}b$，带有因子 $n$。",
  ],
  (rng) => {
    const l = rng.pick([-3, -2, -1, 2, 3]);
    const b = nz(rng, 5);
    const n = rng.int(2, 5);
    const answer = n * l ** (n - 1) * b;
    return numberProblem({
      prompt: text([
        `Find the $(1, 2)$ entry of $A^{${n}}$ for $A = ${mat([
          [l, b],
          [0, l],
        ])}$.`,
        `对 $A = ${mat([
          [l, b],
          [0, l],
        ])}$，求 $A^{${n}}$ 的 $(1, 2)$ 元素。`,
      ]),
      answer,
      form: "integer",
      mistakes: [
        why(
          l ** (n - 1) * b,
          "The binomial term $n\\lambda^{n - 1}N$ carries the factor $n$.",
          "二项式项 $n\\lambda^{n - 1}N$ 带有因子 $n$。",
        ),
        why(b ** n, "Matrix powers are not taken entry by entry.", "矩阵的幂不能逐个元素去取。"),
        why(n * b, "The factor $\\lambda^{n - 1}$ is missing.", "漏掉了因子 $\\lambda^{n - 1}$。"),
        why(l ** n, "That is a diagonal entry of the power, $\\lambda^{n}$.", "这是幂的对角线元素 $\\lambda^{n}$。"),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Split the matrix", "拆分矩阵"],
            text([
              `$A = ${wrap(l)}I + N$, where $N$ has the single entry $${b}$ in position $(1, 2)$ and $N^{2} = 0$, so`,
              `$A = ${wrap(l)}I + N$，其中 $N$ 只在 $(1, 2)$ 位置有元素 $${b}$，且 $N^{2} = 0$，所以`,
            ]),
            [`A^{${n}} = ${wrap(l)}^{${n}}I + ${n} \\cdot ${wrap(l)}^{${n - 1}}N`],
          ],
          [
            ["Read the (1, 2) entry", "读出 (1, 2) 元素"],
            text(["", ""]),
            [`${n} \\cdot ${wrap(l ** (n - 1))} \\cdot ${wrap(b)} = ${answer}`],
          ],
        ],
        text([
          `For $n = 2$ the rule gives $2\\lambda b = ${2 * l * b}$, which matches $A^{2} = ${mat([
            [l * l, 2 * l * b],
            [0, l * l],
          ])}$.`,
          `$n = 2$ 时规则给出 $2\\lambda b = ${2 * l * b}$，与 $A^{2} = ${mat([
            [l * l, 2 * l * b],
            [0, l * l],
          ])}$ 一致。`,
        ]),
      ),
    });
  },
);

const pythagorasReverse = point(
  "a-missing-length-from-the-pythagorean-theorem",
  ["A missing length from the Pythagorean theorem", "由勾股定理求缺失的长度"],
  [
    "If $\\mathbf{u}$ and $\\mathbf{v}$ are orthogonal, the cross term of $\\|\\mathbf{u} + \\mathbf{v}\\|^{2}$ vanishes and the squared lengths add. This also runs in reverse: the squared length of one vector is the difference of the other two, and it is not the square of the difference of the lengths. For example, $\\|\\mathbf{u}\\| = 3$ and $\\|\\mathbf{u} + \\mathbf{v}\\| = 5$ give $\\|\\mathbf{v}\\|^{2} = 25 - 9 = 16$, not $(5 - 3)^{2} = 4$.\n\n> **Watch out.** Subtract the squares, not the lengths, and subtract rather than add: $\\mathbf{u} + \\mathbf{v}$ is the hypotenuse, the longest side.",
    "如果 $\\mathbf{u}$ 与 $\\mathbf{v}$ 正交，$\\|\\mathbf{u} + \\mathbf{v}\\|^{2}$ 的交叉项为零，长度的平方相加。这也可以反过来用：一个向量长度的平方是另外两个长度平方之差，而不是长度之差的平方。例如 $\\|\\mathbf{u}\\| = 3$，$\\|\\mathbf{u} + \\mathbf{v}\\| = 5$ 给出 $\\|\\mathbf{v}\\|^{2} = 25 - 9 = 16$，而不是 $(5 - 3)^{2} = 4$。\n\n> **注意。** 要减平方而不是减长度，而且是相减不是相加：$\\mathbf{u} + \\mathbf{v}$ 是斜边，是最长的边。",
  ],
  (rng) => {
    const a = rng.int(1, 12);
    const c = a + rng.int(1, 9);
    const answer = c * c - a * a;
    return numberProblem({
      prompt: text([
        `$\\mathbf{u}$ and $\\mathbf{v}$ are orthogonal, $\\|\\mathbf{u}\\| = ${a}$ and $\\|\\mathbf{u} + \\mathbf{v}\\| = ${c}$. Find $\\|\\mathbf{v}\\|^{2}$.`,
        `$\\mathbf{u}$ 与 $\\mathbf{v}$ 正交，$\\|\\mathbf{u}\\| = ${a}$，$\\|\\mathbf{u} + \\mathbf{v}\\| = ${c}$。求 $\\|\\mathbf{v}\\|^{2}$。`,
      ]),
      answer,
      form: "integer",
      mistakes: [
        why(
          (c - a) ** 2,
          "That squares the difference of the lengths; subtract the squares instead.",
          "这是长度之差的平方；应当是平方之差。",
        ),
        why(
          c * c + a * a,
          "That adds the squares, but $\\mathbf{u} + \\mathbf{v}$ is the hypotenuse; subtract.",
          "这是把平方相加，但 $\\mathbf{u} + \\mathbf{v}$ 是斜边；要相减。",
        ),
        why(c - a, "That subtracts the lengths; the squared lengths are what add.", "这是长度相减；相加的是长度的平方。"),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Use the Pythagorean theorem", "利用勾股定理"],
            text(["Orthogonality removes the cross term:", "正交性消去了交叉项："]),
            [`\\|\\mathbf{u} + \\mathbf{v}\\|^{2} = \\|\\mathbf{u}\\|^{2} + \\|\\mathbf{v}\\|^{2}`],
          ],
          [["Solve for the missing square", "解出缺失的平方"], text(["", ""]), [`\\|\\mathbf{v}\\|^{2} = ${c * c} - ${a * a} = ${answer}`]],
        ],
        text([
          `$${a * a} + ${answer} = ${c * c} = ${c}^{2}$, so the three lengths fit a right triangle.`,
          `$${a * a} + ${answer} = ${c * c} = ${c}^{2}$，三个长度构成直角三角形。`,
        ]),
      ),
    });
  },
);

const complementPart = point(
  "the-part-of-a-vector-in-the-orthogonal-complement",
  ["The part of a vector in the orthogonal complement", "向量在正交补中的部分"],
  [
    "Every vector splits uniquely as $\\mathbf{x} = \\mathbf{w} + \\mathbf{z}$ with $\\mathbf{w}$ in $W$ and $\\mathbf{z}$ in $W^{\\perp}$. When $W$ is spanned by one vector, $\\mathbf{w}$ is the projection onto it, and $\\mathbf{z}$ is what remains after subtracting that projection from $\\mathbf{x}$. For example, with $W = \\operatorname{span}\\{(1, 1, 1)\\}$ and $\\mathbf{x} = (3, 1, 2)$, the coefficient is $\\frac{6}{3} = 2$, so $\\mathbf{w} = (2, 2, 2)$ and $\\mathbf{z} = (1, -1, 0)$.\n\n> **Watch out.** Subtract the projection $\\mathbf{w}$, not the spanning vector itself, and check that $\\mathbf{z}$ is orthogonal to the spanning vector.",
    "每个向量都可以唯一分解为 $\\mathbf{x} = \\mathbf{w} + \\mathbf{z}$，其中 $\\mathbf{w}$ 在 $W$ 中，$\\mathbf{z}$ 在 $W^{\\perp}$ 中。当 $W$ 由一个向量张成时，$\\mathbf{w}$ 是到它上面的投影，$\\mathbf{z}$ 是从 $\\mathbf{x}$ 中减去投影后剩下的部分。例如 $W = \\operatorname{span}\\{(1, 1, 1)\\}$，$\\mathbf{x} = (3, 1, 2)$ 时，系数为 $\\frac{6}{3} = 2$，所以 $\\mathbf{w} = (2, 2, 2)$，$\\mathbf{z} = (1, -1, 0)$。\n\n> **注意。** 要减去投影 $\\mathbf{w}$，而不是张成向量本身；还要检验 $\\mathbf{z}$ 与张成向量正交。",
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
    return numberProblem({
      prompt: text([
        `$W = \\operatorname{span}\\left\\{${vec(u1, u2, u3)}\\right\\}$ and $\\mathbf{x} = ${vec(x[0], x[1], x[2])} = \\mathbf{w} + \\mathbf{z}$ with $\\mathbf{w} \\in W$, $\\mathbf{z} \\in W^{\\perp}$. Find the ${name[0]} entry of $\\mathbf{z}$.`,
        `$W = \\operatorname{span}\\left\\{${vec(u1, u2, u3)}\\right\\}$，$\\mathbf{x} = ${vec(x[0], x[1], x[2])} = \\mathbf{w} + \\mathbf{z}$，其中 $\\mathbf{w} \\in W$，$\\mathbf{z} \\in W^{\\perp}$。求 $\\mathbf{z}$ 的${name[1]}个元素。`,
      ]),
      answer,
      form: "integer",
      mistakes: [
        why(s * uj, "That is the entry of $\\mathbf{w}$, the part in $W$.", "这是 $\\mathbf{w}$ 的元素，即在 $W$ 中的部分。"),
        why(
          (x[j] as number) - uj,
          `That subtracts the spanning vector itself; subtract the projection, $${s}$ times it.`,
          `这是减去张成向量本身；要减去投影，即它的 $${s}$ 倍。`,
        ),
        why(
          x[j] as number,
          "That is the entry of $\\mathbf{x}$; the projection must be subtracted.",
          "这是 $\\mathbf{x}$ 的元素；还要减去投影。",
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Find the projection coefficient", "求投影系数"],
            text(["Let $\\mathbf{u}$ be the spanning vector:", "设 $\\mathbf{u}$ 为张成向量："]),
            [`\\frac{\\mathbf{x} \\cdot \\mathbf{u}}{\\mathbf{u} \\cdot \\mathbf{u}} = \\frac{${dot}}{${norm}} = ${s}`],
          ],
          [["Form the projection", "写出投影"], text(["", ""]), [`\\mathbf{w} = ${s}${vec(u1, u2, u3)} = ${vec(s * u1, s * u2, s * u3)}`]],
          [
            ["Subtract", "相减"],
            text([`The ${name[0]} entry of $\\mathbf{z}$ is $${answer}$:`, `$\\mathbf{z}$ 的${name[1]}个元素是 $${answer}$：`]),
            [`\\mathbf{z} = \\mathbf{x} - \\mathbf{w} = ${vec(z[0], z[1], z[2])}`],
          ],
        ],
        text([
          `$\\mathbf{z} \\cdot \\mathbf{u} = ${wrap(z[0])} \\cdot ${wrap(u1)} + ${wrap(z[1])} \\cdot ${wrap(u2)} + ${wrap(z[2])} \\cdot ${wrap(u3)} = 0$, so $\\mathbf{z}$ is in $W^{\\perp}$.`,
          `$\\mathbf{z} \\cdot \\mathbf{u} = ${wrap(z[0])} \\cdot ${wrap(u1)} + ${wrap(z[1])} \\cdot ${wrap(u2)} + ${wrap(z[2])} \\cdot ${wrap(u3)} = 0$，所以 $\\mathbf{z}$ 在 $W^{\\perp}$ 中。`,
        ]),
      ),
    });
  },
);

const combosDot = point(
  "the-inner-product-of-two-combinations-of-an-orthogonal-set",
  ["The inner product of two combinations of an orthogonal set", "正交组的两个组合的内积"],
  [
    "When two combinations of an orthogonal set are multiplied out, every product of two different vectors vanishes. Only the matching terms remain, and each is the product of the two coefficients and the squared length of its vector. The lengths must be squared. For example, with lengths $1$, $2$ and $3$, $(\\mathbf{u}_{1} + 2\\mathbf{u}_{2} - \\mathbf{u}_{3}) \\cdot (3\\mathbf{u}_{1} - \\mathbf{u}_{2} + 2\\mathbf{u}_{3}) = 3 \\cdot 1 + (-2) \\cdot 4 + (-2) \\cdot 9 = -23$.\n\n> **Watch out.** Multiply by the squared lengths, not the lengths, and keep the signs of the coefficients. The set is orthogonal, not orthonormal, so the lengths cannot be dropped.",
    "把正交组的两个组合乘开时，两个不同向量的乘积都为零。只剩下对应的项，每一项都是两个系数与相应向量长度平方的积。长度必须取平方。例如长度为 $1$、$2$、$3$ 时，$(\\mathbf{u}_{1} + 2\\mathbf{u}_{2} - \\mathbf{u}_{3}) \\cdot (3\\mathbf{u}_{1} - \\mathbf{u}_{2} + 2\\mathbf{u}_{3}) = 3 \\cdot 1 + (-2) \\cdot 4 + (-2) \\cdot 9 = -23$。\n\n> **注意。** 要乘长度的平方而不是长度，并保留系数的符号。这是正交组而不是标准正交组，长度不能省略。",
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
    return numberProblem({
      prompt: text([
        `$\\{\\mathbf{u}_{1}, \\mathbf{u}_{2}, \\mathbf{u}_{3}\\}$ is orthogonal with lengths $${a}$, $${b}$ and $${c}$. Find $(${left}) \\cdot (${right})$.`,
        `$\\{\\mathbf{u}_{1}, \\mathbf{u}_{2}, \\mathbf{u}_{3}\\}$ 是正交组，长度分别为 $${a}$、$${b}$ 和 $${c}$。求 $(${left}) \\cdot (${right})$。`,
      ]),
      answer,
      form: "integer",
      mistakes: [
        why(
          p * e * a + q * f * b + r * g * c,
          "The lengths were not squared: $\\mathbf{u}_{i} \\cdot \\mathbf{u}_{i} = \\|\\mathbf{u}_{i}\\|^{2}$.",
          "长度没有平方：$\\mathbf{u}_{i} \\cdot \\mathbf{u}_{i} = \\|\\mathbf{u}_{i}\\|^{2}$。",
        ),
        why(
          p * e + q * f + r * g,
          "That treats the set as orthonormal; the lengths are not $1$.",
          "这是把它当作标准正交组；长度不是 $1$。",
        ),
        why(-answer, "The sign is flipped; multiply the coefficients with their signs.", "符号反了；系数要带着符号相乘。"),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Drop the cross terms", "去掉交叉项"],
            text([
              "Each $\\mathbf{u}_{i} \\cdot \\mathbf{u}_{j}$ with $i \\ne j$ is $0$, so only matching terms remain:",
              "$i \\ne j$ 时 $\\mathbf{u}_{i} \\cdot \\mathbf{u}_{j} = 0$，所以只剩对应项：",
            ]),
            [
              `${wrap(p)} \\cdot ${wrap(e)}\\|\\mathbf{u}_{1}\\|^{2} + ${wrap(q)} \\cdot ${wrap(f)}\\|\\mathbf{u}_{2}\\|^{2} + ${wrap(r)} \\cdot ${wrap(g)}\\|\\mathbf{u}_{3}\\|^{2}`,
            ],
          ],
          [
            ["Substitute the squared lengths", "代入长度的平方"],
            text(["", ""]),
            [`${wrap(p * e)} \\cdot ${a * a} + ${wrap(q * f)} \\cdot ${b * b} + ${wrap(r * g)} \\cdot ${c * c} = ${answer}`],
          ],
        ],
        text([
          `Take $\\mathbf{u}_{1} = (${a}, 0, 0)$, $\\mathbf{u}_{2} = (0, ${b}, 0)$, $\\mathbf{u}_{3} = (0, 0, ${c})$, an orthogonal set with these lengths. The combinations are $(${p * a}, ${q * b}, ${r * c})$ and $(${e * a}, ${f * b}, ${g * c})$, whose dot product is $${answer}$.`,
          `取 $\\mathbf{u}_{1} = (${a}, 0, 0)$，$\\mathbf{u}_{2} = (0, ${b}, 0)$，$\\mathbf{u}_{3} = (0, 0, ${c})$，它是具有这些长度的正交组。两个组合是 $(${p * a}, ${q * b}, ${r * c})$ 与 $(${e * a}, ${f * b}, ${g * c})$，点积为 $${answer}$。`,
        ]),
      ),
    });
  },
);

const orthogonalShift = point(
  "shifting-a-function-to-make-it-orthogonal",
  ["Shifting a function to make it orthogonal", "平移函数使其正交"],
  [
    "Orthogonality in a function space is an integral condition, so a shift can be solved from a linear equation. The condition $\\langle f, x - c \\rangle = 0$ gives $c = \\frac{\\langle f, x \\rangle}{\\langle f, 1 \\rangle}$, which depends on $f$ and is not always the midpoint of the interval. For example, on $[0, 3]$ with $f(x) = x$, $\\langle f, x \\rangle = \\int_0^3 x^2\\,dx = 9$ and $\\langle f, 1 \\rangle = \\int_0^3 x\\,dx = \\frac{9}{2}$, so $c = 2$, not the midpoint $\\frac{3}{2}$.\n\n> **Watch out.** Both integrals run over the whole interval $[0, L]$, so keep the powers of $L$ until they cancel. A constant factor in $f$ cancels too.",
    "函数空间中的正交性是一个积分条件，所以平移量可以由线性方程解出。条件 $\\langle f, x - c \\rangle = 0$ 给出 $c = \\frac{\\langle f, x \\rangle}{\\langle f, 1 \\rangle}$，它依赖于 $f$，并不总是区间的中点。例如在 $[0, 3]$ 上取 $f(x) = x$，$\\langle f, x \\rangle = \\int_0^3 x^2\\,dx = 9$，$\\langle f, 1 \\rangle = \\int_0^3 x\\,dx = \\frac{9}{2}$，所以 $c = 2$，不是中点 $\\frac{3}{2}$。\n\n> **注意。** 两个积分都在整个区间 $[0, L]$ 上，所以要保留 $L$ 的幂直到它们约去。$f$ 中的常数因子也会约去。",
  ],
  (rng) => {
    const m = rng.int(0, 2);
    const L = rng.int(1, 9);
    const k = rng.int(1, 5);
    const answer = Q.of(L * (m + 1), m + 2);
    const f = poly([k, m === 0 ? "" : m === 1 ? "x" : "x^{2}"]);
    const upper = m === 0 ? "x" : `x^{${m + 1}}`;
    const lower = m === 0 ? "1" : m === 1 ? "x" : "x^{2}";
    return numberProblem({
      prompt: text([
        `With $\\langle f, g \\rangle = \\int_{0}^{${L}} f(x)g(x)\\,dx$, find $c$ so that $f(x) = ${f}$ and $g(x) = x - c$ are orthogonal.`,
        `在 $\\langle f, g \\rangle = \\int_{0}^{${L}} f(x)g(x)\\,dx$ 下，求 $c$，使 $f(x) = ${f}$ 与 $g(x) = x - c$ 正交。`,
      ]),
      answer,
      mistakes: [
        why(Q.of(L, 2), `That is the midpoint of $[0, ${L}]$; the shift depends on $f$.`, `这是 $[0, ${L}]$ 的中点；平移量依赖于 $f$。`),
        why(
          Q.of(m + 1, m + 2),
          `The powers of $${L}$ do not cancel completely; one factor $${L}$ remains.`,
          `$${L}$ 的幂不会完全约去；还剩一个因子 $${L}$。`,
        ),
        why(
          Q.of(L * (m + 2), m + 1),
          "The fraction is upside down; $c = \\frac{\\langle f, x \\rangle}{\\langle f, 1 \\rangle}$.",
          "分数颠倒了；$c = \\frac{\\langle f, x \\rangle}{\\langle f, 1 \\rangle}$。",
        ),
        why(Q.of(k * L, 2), `The constant $${k}$ appears on both sides and cancels.`, `常数 $${k}$ 在两边都出现，可以约去。`),
      ].filter((w, i, all) => all.findIndex((o) => String(o.value) === String(w.value)) === i),
      solution: walked(
        [
          [
            ["Write the condition", "写出条件"],
            text([
              `The constant $${k}$ cancels from $\\langle f, x - c \\rangle = 0$:`,
              `由 $\\langle f, x - c \\rangle = 0$，常数 $${k}$ 约去：`,
            ]),
            [`\\int_{0}^{${L}} ${upper}\\,dx = c\\int_{0}^{${L}} ${lower}\\,dx`],
          ],
          [["Integrate", "积分"], text(["", ""]), [`\\frac{${L}^{${m + 2}}}{${m + 2}} = c \\cdot \\frac{${L}^{${m + 1}}}{${m + 1}}`]],
          [["Solve for c", "解出 c"], text(["", ""]), [`c = ${L} \\cdot \\frac{${m + 1}}{${m + 2}} = ${answer.toLatex()}`]],
        ],
        text([
          `With this $c$, $c \\cdot \\frac{${L}^{${m + 1}}}{${m + 1}} = ${answer.toLatex()} \\cdot \\frac{${L}^{${m + 1}}}{${m + 1}} = \\frac{${L}^{${m + 2}}}{${m + 2}}$, so the two integrals agree and $\\langle f, g \\rangle = 0$.`,
          `取此 $c$，$c \\cdot \\frac{${L}^{${m + 1}}}{${m + 1}} = ${answer.toLatex()} \\cdot \\frac{${L}^{${m + 1}}}{${m + 1}} = \\frac{${L}^{${m + 2}}}{${m + 2}}$，两个积分相等，$\\langle f, g \\rangle = 0$。`,
        ]),
      ),
    });
  },
);

const orthogonalInverse = {
  ...point(
    "the-inverse-of-an-orthogonal-matrix-is-its-transpose",
    ["The inverse of an orthogonal matrix is its transpose", "正交矩阵的逆是它的转置"],
    [
      "An orthogonal transformation preserves dot products, so its matrix satisfies $Q^{T}Q = I$. Its inverse therefore needs no elimination: it is the transpose. An entry of the inverse is read from the reflected position, and it is not the reciprocal of the entry. For example, for $Q = \\frac{1}{5}\\begin{pmatrix} 3 & -4 \\\\ 4 & 3 \\end{pmatrix}$ the $(1, 2)$ entry of $Q^{-1}$ is the $(2, 1)$ entry of $Q$, which is $\\frac{4}{5}$.\n\n> **Watch out.** Transposing moves an entry across the main diagonal and keeps its sign. The inverse of a matrix is never found by taking reciprocals of its entries.",
      "正交变换保持点积，所以它的矩阵满足 $Q^{T}Q = I$。因此求逆不需要消元：逆矩阵就是转置。逆矩阵的元素从关于对角线对称的位置读出，而不是原元素的倒数。例如对 $Q = \\frac{1}{5}\\begin{pmatrix} 3 & -4 \\\\ 4 & 3 \\end{pmatrix}$，$Q^{-1}$ 的 $(1, 2)$ 元素是 $Q$ 的 $(2, 1)$ 元素，即 $\\frac{4}{5}$。\n\n> **注意。** 转置把元素沿主对角线翻到对称位置，并保持它的符号。矩阵的逆绝不是把各元素取倒数。",
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
      const col = [(rows[0] as number[])[i] as number, (rows[1] as number[])[i] as number];
      return numberProblem({
        prompt: text([
          `$Q = \\frac{1}{${c}}${mat(rows)}$ is orthogonal. Find the $(${i + 1}, ${j + 1})$ entry of $Q^{-1}$.`,
          `$Q = \\frac{1}{${c}}${mat(rows)}$ 是正交矩阵。求 $Q^{-1}$ 的 $(${i + 1}, ${j + 1})$ 元素。`,
        ]),
        answer,
        mistakes: [
          why(
            Q.of(other, c),
            `That is the $(${i + 1}, ${j + 1})$ entry of $Q$ itself; the inverse reads it from the reflected position $(${j + 1}, ${i + 1})$.`,
            `这是 $Q$ 本身的 $(${i + 1}, ${j + 1})$ 元素；逆矩阵要从对称位置 $(${j + 1}, ${i + 1})$ 读出。`,
          ),
          why(
            Q.of(c, value),
            "That is the reciprocal of the entry; the inverse of a matrix is not taken entry by entry.",
            "这是元素的倒数；矩阵的逆不能逐个元素求。",
          ),
          why(
            answer.neg(),
            "The sign was changed; transposing moves an entry without changing its sign.",
            "符号被改变了；转置只移动元素，不改变它的符号。",
          ),
        ].filter((w, k, all) => String(w.value) !== String(answer) && all.findIndex((o) => String(o.value) === String(w.value)) === k),
        solution: walked(
          [
            [
              ["Invert by transposing", "用转置求逆"],
              text(["Since $Q^{T}Q = I$, the inverse is the transpose:", "因为 $Q^{T}Q = I$，逆矩阵就是转置："]),
              [`Q^{-1} = Q^{T}`],
            ],
            [
              ["Read the reflected entry", "读出对称位置的元素"],
              text([
                `The $(${i + 1}, ${j + 1})$ entry of $Q^{T}$ is the $(${j + 1}, ${i + 1})$ entry of $Q$.`,
                `$Q^{T}$ 的 $(${i + 1}, ${j + 1})$ 元素是 $Q$ 的 $(${j + 1}, ${i + 1})$ 元素。`,
              ]),
              [`(Q^{-1})_{${i + 1}${j + 1}} = Q_{${j + 1}${i + 1}} = ${answer.toLatex()}`],
            ],
          ],
          text([
            `Row $${i + 1}$ of $Q^{-1}$ is $\\frac{1}{${c}}(${col.join(", ")})$, which holds the answer in position $${j + 1}$, and its dot product with column $${i + 1}$ of $Q$ is $\\frac{${col.map((x) => `${wrap(x)}^{2}`).join(" + ")}}{${c * c}} = 1$, as $Q^{-1}Q = I$ requires.`,
            `$Q^{-1}$ 的第 $${i + 1}$ 行是 $\\frac{1}{${c}}(${col.join(", ")})$，其第 $${j + 1}$ 个位置正是答案；它与 $Q$ 的第 $${i + 1}$ 列的点积为 $\\frac{${col.map((x) => `${wrap(x)}^{2}`).join(" + ")}}{${c * c}} = 1$，符合 $Q^{-1}Q = I$。`,
          ]),
        ),
      });
    },
  ),
  figure: linearAlgebraDrawings2["orthogonal-linear-transformations#the-inverse-of-an-orthogonal-matrix-is-its-transpose"],
};

const rowsFromNullities = point(
  "the-number-of-rows-from-the-two-null-spaces",
  ["The number of rows from the two null spaces", "由两个零空间求行数"],
  [
    "The two null spaces of a matrix determine its shape together with the rank. The rank is the number of columns minus the dimension of the null space, and it is also the number of rows minus the dimension of the left null space, so these two equations link the rows and columns. For example, $7$ columns with $\\dim \\operatorname{Null}(A) = 3$ give rank $4$, and $\\dim \\operatorname{Null}(A^{T}) = 2$ then gives $4 + 2 = 6$ rows.\n\n> **Watch out.** The null space of $A$ is tied to the columns and the left null space to the rows. Subtract $\\dim \\operatorname{Null}(A)$ from the columns to get the rank, then add $\\dim \\operatorname{Null}(A^{T})$ back to get the rows.",
    "矩阵的两个零空间与秩一起决定它的形状。秩等于列数减去零空间的维数，也等于行数减去左零空间的维数，所以这两个等式把行数和列数联系起来。例如 $7$ 列且 $\\dim \\operatorname{Null}(A) = 3$ 时秩为 $4$，再由 $\\dim \\operatorname{Null}(A^{T}) = 2$ 得行数为 $4 + 2 = 6$。\n\n> **注意。** $A$ 的零空间与列相联系，左零空间与行相联系。先用列数减去 $\\dim \\operatorname{Null}(A)$ 得到秩，再加上 $\\dim \\operatorname{Null}(A^{T})$ 得到行数。",
  ],
  (rng) => {
    const n = rng.int(3, 9);
    const p = rng.int(0, n - 1);
    const q = rng.int(0, 4);
    const answer = n - p + q;
    return numberProblem({
      prompt: text([
        `$A$ has $${n}$ columns, $\\dim \\operatorname{Null}(A) = ${p}$ and $\\dim \\operatorname{Null}(A^{T}) = ${q}$. How many rows does $A$ have?`,
        `$A$ 有 $${n}$ 列，$\\dim \\operatorname{Null}(A) = ${p}$，$\\dim \\operatorname{Null}(A^{T}) = ${q}$。$A$ 有多少行？`,
      ]),
      answer,
      mistakes: [
        why(
          n,
          "That assumes $A$ is square; the two null spaces can differ in dimension.",
          "这是假设 $A$ 是方阵；两个零空间的维数可以不同。",
        ),
        why(
          n - p,
          "That is the rank; the rows are the rank plus $\\dim \\operatorname{Null}(A^{T})$.",
          "这是秩；行数等于秩加上 $\\dim \\operatorname{Null}(A^{T})$。",
        ),
        why(
          n + p + q,
          "Both null space dimensions were added to the columns; $\\dim \\operatorname{Null}(A)$ must be subtracted to reach the rank.",
          "把两个零空间的维数都加到了列数上；要减去 $\\dim \\operatorname{Null}(A)$ 才得到秩。",
        ),
        why(
          n + p - q,
          "The two null spaces were swapped: $\\dim \\operatorname{Null}(A)$ belongs with the columns and $\\dim \\operatorname{Null}(A^{T})$ with the rows.",
          "两个零空间弄反了：$\\dim \\operatorname{Null}(A)$ 与列相联系，$\\dim \\operatorname{Null}(A^{T})$ 与行相联系。",
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [["Find the rank from the columns", "由列数求秩"], text(["", ""]), [`r = ${n} - ${p} = ${n - p}`]],
          [
            ["Add back the left null space", "加上左零空间的维数"],
            text([
              "Rows minus $\\dim \\operatorname{Null}(A^{T})$ is also the rank:",
              "行数减去 $\\dim \\operatorname{Null}(A^{T})$ 也等于秩：",
            ]),
            [`m = r + ${q} = ${n - p} + ${q} = ${answer}`],
          ],
        ],
        text([
          `Both counts give the same rank: $${answer} - ${q} = ${n - p}$ from the rows and $${n} - ${p} = ${n - p}$ from the columns.`,
          `两种算法给出相同的秩：由行数得 $${answer} - ${q} = ${n - p}$，由列数得 $${n} - ${p} = ${n - p}$。`,
        ]),
      ),
    });
  },
);

const coefficientSquaredNorm = point(
  "a-component-divides-by-the-squared-length",
  ["A component divides by the squared length", "分量要除以长度的平方"],
  [
    "For an orthogonal basis that is not orthonormal, a coordinate is $\\frac{\\mathbf{x} \\cdot \\mathbf{u}}{\\|\\mathbf{u}\\|^{2}}$. Taking the dot product of $\\mathbf{x}$ with a basis vector picks up two factors of the length, one from each $\\mathbf{u}$, so dividing once by the length is a common mistake. For example, $\\|\\mathbf{u}_{1}\\| = 3$ and $\\mathbf{x} \\cdot \\mathbf{u}_{1} = 18$ give the coefficient $\\frac{18}{9} = 2$.\n\n> **Watch out.** Divide by the squared length $\\|\\mathbf{u}\\|^{2}$, not by $\\|\\mathbf{u}\\|$ and not by twice the length.",
    "对不是标准正交的正交基，坐标是 $\\frac{\\mathbf{x} \\cdot \\mathbf{u}}{\\|\\mathbf{u}\\|^{2}}$。$\\mathbf{x}$ 与基向量作点积会带来两个长度因子，所以只除以一次长度是常见的错误。例如 $\\|\\mathbf{u}_{1}\\| = 3$，$\\mathbf{x} \\cdot \\mathbf{u}_{1} = 18$ 时系数为 $\\frac{18}{9} = 2$。\n\n> **注意。** 要除以长度的平方 $\\|\\mathbf{u}\\|^{2}$，不是除以 $\\|\\mathbf{u}\\|$，也不是除以长度的两倍。",
  ],
  (rng) => {
    const n = rng.int(2, 7);
    const c = nz(rng, 9);
    const dot = c * n * n;
    return numberProblem({
      prompt: text([
        `$\\{\\mathbf{u}_{1}, \\mathbf{u}_{2}\\}$ is an orthogonal basis of a plane containing $\\mathbf{x}$, with $\\|\\mathbf{u}_{1}\\| = ${n}$ and $\\mathbf{x} \\cdot \\mathbf{u}_{1} = ${dot}$. Find the coefficient of $\\mathbf{u}_{1}$ in $\\mathbf{x}$.`,
        `$\\{\\mathbf{u}_{1}, \\mathbf{u}_{2}\\}$ 是含 $\\mathbf{x}$ 的平面的正交基，$\\|\\mathbf{u}_{1}\\| = ${n}$，$\\mathbf{x} \\cdot \\mathbf{u}_{1} = ${dot}$。求 $\\mathbf{x}$ 中 $\\mathbf{u}_{1}$ 的系数。`,
      ]),
      answer: c,
      mistakes: [
        why(
          c * n,
          `That divides by the length $${n}$ only once; the dot product carries $\\|\\mathbf{u}_{1}\\|^{2} = ${n * n}$.`,
          `这只除以了一次长度 $${n}$；点积中含有 $\\|\\mathbf{u}_{1}\\|^{2} = ${n * n}$。`,
        ),
        why(
          dot,
          "That is the dot product itself; it must be divided by $\\|\\mathbf{u}_{1}\\|^{2}$, since the basis is not orthonormal.",
          "这是点积本身；基不是标准正交的，所以还要除以 $\\|\\mathbf{u}_{1}\\|^{2}$。",
        ),
        why(
          Q.of(c * n, 2),
          `That divides by $2 \\cdot ${n}$; the squared length is $${n} \\cdot ${n} = ${n * n}$.`,
          `这是除以了 $2 \\cdot ${n}$；长度的平方是 $${n} \\cdot ${n} = ${n * n}$。`,
        ),
      ].filter((w, i, all) => String(w.value) !== String(c) && all.findIndex((o) => String(o.value) === String(w.value)) === i),
      solution: walked(
        [
          [
            ["Dot with the basis vector", "与基向量作点积"],
            text([
              "Writing $\\mathbf{x} = c_{1}\\mathbf{u}_{1} + c_{2}\\mathbf{u}_{2}$, the $\\mathbf{u}_{2}$ term drops out because $\\mathbf{u}_{2} \\cdot \\mathbf{u}_{1} = 0$:",
              "写 $\\mathbf{x} = c_{1}\\mathbf{u}_{1} + c_{2}\\mathbf{u}_{2}$，因为 $\\mathbf{u}_{2} \\cdot \\mathbf{u}_{1} = 0$，$\\mathbf{u}_{2}$ 项消失：",
            ]),
            [`\\mathbf{x} \\cdot \\mathbf{u}_{1} = c_{1}\\|\\mathbf{u}_{1}\\|^{2}`],
          ],
          [
            ["Divide by the squared length", "除以长度的平方"],
            text(["", ""]),
            [`c_{1} = \\frac{${dot}}{${n}^{2}} = \\frac{${dot}}{${n * n}} = ${c}`],
          ],
        ],
        text([
          `$${wrap(c)} \\cdot ${n * n} = ${dot}$, which is the given dot product.`,
          `$${wrap(c)} \\cdot ${n * n} = ${dot}$，正是已知的点积。`,
        ]),
      ),
    });
  },
);

const projectionMatrix = point(
  "numbers-attached-to-a-projection-matrix",
  ["Numbers attached to a projection matrix", "投影矩阵的相关数值"],
  [
    "An orthogonal projection onto a subspace of dimension $k$ in $\\mathbb{R}^{m}$ has eigenvalue $1$ with multiplicity $k$ and eigenvalue $0$ with multiplicity $m - k$. So its trace and rank are $k$, and $I - P$ is the projection onto the complement, whose trace and rank are $m - k$. For example, the projection of $\\mathbb{R}^{3}$ onto a plane has eigenvalues $1, 1, 0$, so $\\operatorname{tr}(P) = 2$ and $\\operatorname{rank}(I - P) = 1$.\n\n> **Watch out.** Since $P^{2} = P$, the trace of $P^{2}$ is the trace of $P$, not its square. Numbers about $P$ count the subspace, and numbers about $I - P$ or the null space of $P$ count the complement.",
    "$\\mathbb{R}^{m}$ 中到 $k$ 维子空间的正交投影有重数为 $k$ 的特征值 $1$ 和重数为 $m - k$ 的特征值 $0$。所以它的迹和秩都是 $k$，而 $I - P$ 是到正交补的投影，其迹和秩都是 $m - k$。例如 $\\mathbb{R}^{3}$ 到一个平面的投影的特征值是 $1, 1, 0$，所以 $\\operatorname{tr}(P) = 2$，$\\operatorname{rank}(I - P) = 1$。\n\n> **注意。** 因为 $P^{2} = P$，$P^{2}$ 的迹就是 $P$ 的迹，而不是它的平方。关于 $P$ 的数计的是子空间，关于 $I - P$ 或 $P$ 的零空间的数计的是正交补。",
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
    const slips = [
      why(
        m,
        `That is $\\operatorname{tr}(I) = ${m}$, the size of the whole space.`,
        `这是 $\\operatorname{tr}(I) = ${m}$，整个空间的维数。`,
      ),
      kind < 2
        ? why(
            m - k,
            `That counts the $${m - k}$ eigenvalues equal to $0$, which belong to the complement.`,
            `这数的是 $${m - k}$ 个等于 $0$ 的特征值，它们属于正交补。`,
          )
        : why(
            k,
            `That is the dimension $${k}$ of the subspace itself, which belongs to $P$, not to the complement.`,
            `这是子空间本身的维数 $${k}$，它属于 $P$，而不属于正交补。`,
          ),
      ...(kind === 1
        ? [why(k * k, "That squares the trace; but $P^{2} = P$, so the trace stays the same.", "这是把迹平方了；但 $P^{2} = P$，迹不变。")]
        : []),
      ...(kind === 4
        ? [
            why(
              m + k,
              "That adds the trace of $P$ to the trace of $I$; the trace of $I - P$ subtracts it.",
              "这是把 $P$ 的迹加到 $I$ 的迹上；$I - P$ 的迹应当减去它。",
            ),
          ]
        : []),
    ];
    return numberProblem({
      prompt: text([
        `$P$ is the orthogonal projection matrix of $\\mathbb{R}^{${m}}$ onto a subspace of dimension $${k}$. Find $${item}$.`,
        `$P$ 是 $\\mathbb{R}^{${m}}$ 到一个 $${k}$ 维子空间的正交投影矩阵。求 $${item}$。`,
      ]),
      answer,
      mistakes: slips.filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["List the eigenvalues", "列出特征值"],
            text([
              `$P$ keeps the $${k}$-dimensional subspace and sends its $${m - k}$-dimensional complement to zero, so its eigenvalues are $1$ with multiplicity $${k}$ and $0$ with multiplicity $${m - k}$.`,
              `$P$ 保持 $${k}$ 维子空间不动，把 $${m - k}$ 维的正交补变为零，所以它的特征值是重数为 $${k}$ 的 $1$ 和重数为 $${m - k}$ 的 $0$。`,
            ]),
          ],
          [["Read off the number", "读出所求的数"], text(whys[kind] as Pair), [`${item} = ${answer}`]],
        ],
        text([
          `The subspace and its complement fill the space: $${k} + ${m - k} = ${m}$, matching $\\operatorname{tr}(P) + \\operatorname{tr}(I - P) = \\operatorname{tr}(I)$.`,
          `子空间与正交补合起来是整个空间：$${k} + ${m - k} = ${m}$，与 $\\operatorname{tr}(P) + \\operatorname{tr}(I - P) = \\operatorname{tr}(I)$ 一致。`,
        ]),
      ),
    });
  },
);

const symmetricLineFit = point(
  "a-least-squares-line-with-centered-inputs",
  ["A least-squares line with centered inputs", "输入居中的最小二乘直线"],
  [
    "When the inputs sum to zero, the two columns of the design matrix are orthogonal, so the normal equations separate. The intercept is then the mean of the outputs, and the slope is $\\frac{\\sum x_{i}y_{i}}{\\sum x_{i}^{2}}$. The endpoints alone do not determine the slope. For example, through $(-2, 1), (-1, 2), (0, 2), (1, 4), (2, 6)$ the intercept is $\\frac{15}{5} = 3$ and the slope is $\\frac{12}{10} = \\frac{6}{5}$.\n\n> **Watch out.** Divide $\\sum x_{i}y_{i}$ by $\\sum x_{i}^{2}$, not by the number of points, and take the intercept as the mean of all outputs, not the middle output.",
    "当输入之和为零时，设计矩阵的两列正交，所以正规方程彼此分离。此时截距是输出的平均值，斜率是 $\\frac{\\sum x_{i}y_{i}}{\\sum x_{i}^{2}}$。仅凭两个端点不能确定斜率。例如经过 $(-2, 1), (-1, 2), (0, 2), (1, 4), (2, 6)$ 时，截距是 $\\frac{15}{5} = 3$，斜率是 $\\frac{12}{10} = \\frac{6}{5}$。\n\n> **注意。** 要用 $\\sum x_{i}y_{i}$ 除以 $\\sum x_{i}^{2}$，而不是除以点的个数；截距是全部输出的平均值，而不是中间那个输出。",
  ],
  (rng) => {
    const ys = [rng.int(-9, 9), rng.int(-9, 9), rng.int(-9, 9), rng.int(-9, 9), rng.int(-9, 9)] as const;
    const pts = ys.map((y, i) => `(${i - 2}, ${y})`).join(", ");
    const sum = ys.reduce((a, b) => a + b, 0);
    const sxy = ys.reduce((a, y, i) => a + (i - 2) * y, 0);
    const paren = (x: Q) => (x.sign() < 0 ? `\\left(${x.toLatex()}\\right)` : x.toLatex());
    if (rng.bool()) {
      const answer = Q.of(sxy, 10);
      return numberProblem({
        prompt: text([
          `Find the slope of the least-squares line $y = c + mx$ through $${pts}$.`,
          `求经过 $${pts}$ 的最小二乘直线 $y = c + mx$ 的斜率。`,
        ]),
        answer,
        mistakes: [
          why(
            Q.of(ys[4] - ys[0], 4),
            "That is the slope through the two endpoints; least squares uses every point.",
            "这是经过两个端点的斜率；最小二乘要用到所有的点。",
          ),
          why(
            Q.of(sxy, 5),
            "That divides $\\sum x_{i}y_{i}$ by the number of points; the divisor is $\\sum x_{i}^{2} = 10$.",
            "这是用 $\\sum x_{i}y_{i}$ 除以点的个数；除数应是 $\\sum x_{i}^{2} = 10$。",
          ),
          why(
            Q.of(sum, 5),
            "That is the mean of the outputs, which is the intercept, not the slope.",
            "这是输出的平均值，它是截距而不是斜率。",
          ),
        ].filter((w, i, all) => String(w.value) !== String(answer) && all.findIndex((o) => String(o.value) === String(w.value)) === i),
        solution: walked(
          [
            [
              ["See that the columns are orthogonal", "看出两列正交"],
              text([
                "The inputs $-2, -1, 0, 1, 2$ sum to zero, so the column of ones is orthogonal to the column of inputs and the slope has its own equation:",
                "输入 $-2, -1, 0, 1, 2$ 之和为零，所以全为 $1$ 的列与输入列正交，斜率有单独的方程：",
              ]),
              ["m = \\frac{\\sum x_{i}y_{i}}{\\sum x_{i}^{2}}"],
            ],
            [
              ["Compute the two sums", "计算两个和"],
              text(["", ""]),
              [
                `\\sum x_{i}y_{i} = ${sxy}, \\quad \\sum x_{i}^{2} = 4 + 1 + 0 + 1 + 4 = 10`,
                `m = \\frac{${sxy}}{10} = ${answer.toLatex()}`,
              ],
            ],
          ],
          text([
            `The residuals weighted by the inputs sum to zero: $\\sum x_{i}y_{i} - m\\sum x_{i}^{2} = ${sxy} - ${paren(answer)} \\cdot 10 = 0$.`,
            `以输入为权的残差之和为零：$\\sum x_{i}y_{i} - m\\sum x_{i}^{2} = ${sxy} - ${paren(answer)} \\cdot 10 = 0$。`,
          ]),
        ),
      });
    }
    const answer = Q.of(sum, 5);
    return numberProblem({
      prompt: text([
        `Find the intercept of the least-squares line $y = c + mx$ through $${pts}$.`,
        `求经过 $${pts}$ 的最小二乘直线 $y = c + mx$ 的截距。`,
      ]),
      answer,
      mistakes: [
        why(
          ys[2],
          "That is the output at $x = 0$ alone; the intercept is the mean of all five outputs.",
          "这只是 $x = 0$ 处的输出；截距是全部五个输出的平均值。",
        ),
        why(sum, "That is the sum of the outputs; it still has to be divided by the $5$ points.", "这是输出之和；还要除以 $5$ 个点。"),
        why(
          Q.of(sxy, 10),
          "That is the slope $\\frac{\\sum x_{i}y_{i}}{\\sum x_{i}^{2}}$, not the intercept.",
          "这是斜率 $\\frac{\\sum x_{i}y_{i}}{\\sum x_{i}^{2}}$，不是截距。",
        ),
      ].filter((w, i, all) => String(w.value) !== String(answer) && all.findIndex((o) => String(o.value) === String(w.value)) === i),
      solution: walked(
        [
          [
            ["See that the columns are orthogonal", "看出两列正交"],
            text([
              "The inputs $-2, -1, 0, 1, 2$ sum to zero, so the normal equations separate and the intercept has its own equation $5c = \\sum y_{i}$.",
              "输入 $-2, -1, 0, 1, 2$ 之和为零，所以正规方程彼此分离，截距有单独的方程 $5c = \\sum y_{i}$。",
            ]),
          ],
          [
            ["Take the mean of the outputs", "求输出的平均值"],
            text(["", ""]),
            [`\\sum y_{i} = ${sum}`, `c = \\frac{${sum}}{5} = ${answer.toLatex()}`],
          ],
        ],
        text([
          `The residuals sum to zero: $\\sum y_{i} - 5c - m\\sum x_{i} = ${sum} - 5 \\cdot ${paren(answer)} - 0 = 0$.`,
          `残差之和为零：$\\sum y_{i} - 5c - m\\sum x_{i} = ${sum} - 5 \\cdot ${paren(answer)} - 0 = 0$。`,
        ]),
      ),
    });
  },
);

const bestMultipleOfX = point(
  "the-best-multiple-of-x-ignores-even-terms",
  ["The best multiple of x ignores even terms", "最佳的 x 倍数与偶次项无关"],
  [
    "The best approximation of $f$ by a multiple of $x$ on $[-1, 1]$ has the coefficient $\\frac{\\langle f, x \\rangle}{\\langle x, x \\rangle}$. Even terms of $f$ are orthogonal to $x$ on this symmetric interval and contribute nothing, while higher odd powers contribute only part of their coefficient. For example, for $f(x) = x^{3} + x^{2} + 2x$ the term $x^{2}$ drops out, $x^{3}$ contributes $\\frac{2/5}{2/3} = \\frac{3}{5}$, and $c = 2 + \\frac{3}{5} = \\frac{13}{5}$.\n\n> **Watch out.** A higher odd power $x^{n}$ is not orthogonal to $x$, but it is not a multiple of $x$ either: it adds $\\frac{3}{n + 2}$ times its coefficient, using $\\int_{-1}^{1} x^{n+1}\\,dx = \\frac{2}{n + 2}$.",
    "在 $[-1, 1]$ 上，用 $x$ 的倍数逼近 $f$ 的最佳系数是 $\\frac{\\langle f, x \\rangle}{\\langle x, x \\rangle}$。在这个对称区间上，$f$ 的偶次项与 $x$ 正交，没有贡献，而更高的奇次幂只贡献其系数的一部分。例如对 $f(x) = x^{3} + x^{2} + 2x$，$x^{2}$ 项消失，$x^{3}$ 贡献 $\\frac{2/5}{2/3} = \\frac{3}{5}$，所以 $c = 2 + \\frac{3}{5} = \\frac{13}{5}$。\n\n> **注意。** 更高的奇次幂 $x^{n}$ 与 $x$ 不正交，但也不是 $x$ 的倍数：由 $\\int_{-1}^{1} x^{n+1}\\,dx = \\frac{2}{n + 2}$，它贡献其系数的 $\\frac{3}{n + 2}$ 倍。",
  ],
  (rng) => {
    const n = rng.pick([3, 5, 7]);
    const k = nz(rng, 5);
    const m = nz(rng, 5);
    const b = nz(rng, 4);
    const f = poly([k, `x^{${n}}`], [m, "x^{2}"], [b, "x"]);
    const part = Q.of(3 * k, n + 2);
    const answer = part.add(Q.of(b, 1));
    const inner = Q.of(2 * k, n + 2).add(Q.of(2 * b, 3));
    return numberProblem({
      prompt: text([
        `With $\\langle f, g \\rangle = \\int_{-1}^{1} f(x)g(x)\\,dx$, find $c$ so that $cx$ is the multiple of $x$ closest to $f(x) = ${f}$.`,
        `在 $\\langle f, g \\rangle = \\int_{-1}^{1} f(x)g(x)\\,dx$ 下，求 $c$，使 $cx$ 是最接近 $f(x) = ${f}$ 的 $x$ 的倍数。`,
      ]),
      answer,
      mistakes: [
        why(
          Q.of(b, 1),
          `That keeps only the term in $x$; $x^{${n}}$ is not orthogonal to $x$ and also contributes.`,
          `这只保留了 $x$ 项；$x^{${n}}$ 与 $x$ 不正交，也有贡献。`,
        ),
        why(
          Q.of(b + k, 1),
          `That counts all of $x^{${n}}$ as if it were $x$; it contributes only $\\frac{3}{${n + 2}}$ of its coefficient.`,
          `这是把 $x^{${n}}$ 整个当作 $x$ 来算；它只贡献其系数的 $\\frac{3}{${n + 2}}$。`,
        ),
        why(
          answer.add(Q.of(m, 1)),
          "That also adds the coefficient of $x^{2}$; an even term is orthogonal to $x$ on $[-1, 1]$.",
          "这还加上了 $x^{2}$ 的系数；在 $[-1, 1]$ 上偶次项与 $x$ 正交。",
        ),
        why(
          Q.of(3 * k, n + 1).add(Q.of(b, 1)),
          `That integrates $x^{${n + 1}}$ as $\\frac{2}{${n + 1}}$; the exponent rises to $${n + 2}$, giving $\\frac{2}{${n + 2}}$.`,
          `这是把 $x^{${n + 1}}$ 的积分算成了 $\\frac{2}{${n + 1}}$；指数升到 $${n + 2}$，应得 $\\frac{2}{${n + 2}}$。`,
        ),
      ].filter((w, i, all) => String(w.value) !== String(answer) && all.findIndex((o) => String(o.value) === String(w.value)) === i),
      solution: walked(
        [
          [
            ["Compute the inner products with x", "计算与 x 的内积"],
            text(["The term in $x^{2}$ gives an odd integrand and drops out:", "$x^{2}$ 项的被积函数是奇函数，积分为零："]),
            [
              "\\langle x, x \\rangle = \\int_{-1}^{1} x^{2}\\,dx = \\frac{2}{3}",
              `\\langle x^{${n}}, x \\rangle = \\int_{-1}^{1} x^{${n + 1}}\\,dx = \\frac{2}{${n + 2}}, \\quad \\langle x^{2}, x \\rangle = 0`,
              `\\langle f, x \\rangle = ${wrap(k)} \\cdot \\frac{2}{${n + 2}} + ${wrap(b)} \\cdot \\frac{2}{3} = ${inner.toLatex()}`,
            ],
          ],
          [
            ["Divide by the inner product of x with itself", "除以 x 与自身的内积"],
            text(["", ""]),
            [
              `c = \\frac{\\langle f, x \\rangle}{\\langle x, x \\rangle} = ${b} + ${wrap(k)} \\cdot \\frac{3}{${n + 2}} = ${answer.toLatex()}`,
            ],
          ],
        ],
        text([
          `The error $f - cx$ is orthogonal to $x$: $c \\cdot \\frac{2}{3} = ${answer.mul(Q.of(2, 3)).toLatex()}$, which equals $\\langle f, x \\rangle$.`,
          `误差 $f - cx$ 与 $x$ 正交：$c \\cdot \\frac{2}{3} = ${answer.mul(Q.of(2, 3)).toLatex()}$，正等于 $\\langle f, x \\rangle$。`,
        ]),
      ),
    });
  },
);

const gramLength = point(
  "the-length-of-the-new-vector-without-computing-it",
  ["The length of the new vector without computing it", "不计算新向量求其长度"],
  [
    "Gram-Schmidt writes $\\mathbf{x}_{2}$ as a multiple of $\\mathbf{x}_{1}$ plus an orthogonal vector $\\mathbf{w}$, so the Pythagorean theorem gives the length of $\\mathbf{w}$ from dot products alone. The subtracted squared length is $\\frac{(\\mathbf{x}_{1} \\cdot \\mathbf{x}_{2})^{2}}{\\|\\mathbf{x}_{1}\\|^{2}}$. For example, $\\|\\mathbf{x}_{1}\\|^{2} = 4$, $\\|\\mathbf{x}_{2}\\|^{2} = 10$ and $\\mathbf{x}_{1} \\cdot \\mathbf{x}_{2} = 6$ give $\\|\\mathbf{w}\\|^{2} = 10 - \\frac{36}{4} = 1$.\n\n> **Watch out.** The dot product is squared before dividing by $\\|\\mathbf{x}_{1}\\|^{2}$, and that part is subtracted from $\\|\\mathbf{x}_{2}\\|^{2}$; it is not itself the answer.",
    "格拉姆-施密特过程把 $\\mathbf{x}_{2}$ 写成 $\\mathbf{x}_{1}$ 的倍数加上一个正交向量 $\\mathbf{w}$，所以勾股定理仅由点积就能给出 $\\mathbf{w}$ 的长度。减去的长度平方是 $\\frac{(\\mathbf{x}_{1} \\cdot \\mathbf{x}_{2})^{2}}{\\|\\mathbf{x}_{1}\\|^{2}}$。例如 $\\|\\mathbf{x}_{1}\\|^{2} = 4$，$\\|\\mathbf{x}_{2}\\|^{2} = 10$，$\\mathbf{x}_{1} \\cdot \\mathbf{x}_{2} = 6$ 时 $\\|\\mathbf{w}\\|^{2} = 10 - \\frac{36}{4} = 1$。\n\n> **注意。** 点积要先平方再除以 $\\|\\mathbf{x}_{1}\\|^{2}$，并且这部分要从 $\\|\\mathbf{x}_{2}\\|^{2}$ 中减去；它本身不是答案。",
  ],
  (rng) => {
    const M = rng.int(2, 20);
    const d = nz(rng, 9);
    const N = Math.ceil((d * d) / M) + rng.int(1, 12);
    const answer = Q.of(N * M - d * d, M);
    const removed = Q.of(d * d, M);
    return numberProblem({
      prompt: text([
        `$\\|\\mathbf{x}_{1}\\|^{2} = ${M}$, $\\|\\mathbf{x}_{2}\\|^{2} = ${N}$ and $\\mathbf{x}_{1} \\cdot \\mathbf{x}_{2} = ${d}$. Gram-Schmidt gives $\\mathbf{w} = \\mathbf{x}_{2} - \\frac{\\mathbf{x}_{1} \\cdot \\mathbf{x}_{2}}{\\|\\mathbf{x}_{1}\\|^{2}}\\mathbf{x}_{1}$. Find $\\|\\mathbf{w}\\|^{2}$.`,
        `$\\|\\mathbf{x}_{1}\\|^{2} = ${M}$，$\\|\\mathbf{x}_{2}\\|^{2} = ${N}$，$\\mathbf{x}_{1} \\cdot \\mathbf{x}_{2} = ${d}$。格拉姆-施密特过程给出 $\\mathbf{w} = \\mathbf{x}_{2} - \\frac{\\mathbf{x}_{1} \\cdot \\mathbf{x}_{2}}{\\|\\mathbf{x}_{1}\\|^{2}}\\mathbf{x}_{1}$。求 $\\|\\mathbf{w}\\|^{2}$。`,
      ]),
      answer,
      mistakes: [
        why(
          Q.of(N * M - d, M),
          `That subtracts $\\frac{${d}}{${M}}$; the dot product must be squared, giving $\\frac{${d * d}}{${M}}$.`,
          `这减去的是 $\\frac{${d}}{${M}}$；点积要平方，应为 $\\frac{${d * d}}{${M}}$。`,
        ),
        why(
          removed,
          "That is the squared length of the removed multiple of $\\mathbf{x}_{1}$, not of $\\mathbf{w}$.",
          "这是被减去的 $\\mathbf{x}_{1}$ 倍数的长度平方，不是 $\\mathbf{w}$ 的。",
        ),
        why(
          N,
          "That is $\\|\\mathbf{x}_{2}\\|^{2}$ itself; the part along $\\mathbf{x}_{1}$ was not removed.",
          "这是 $\\|\\mathbf{x}_{2}\\|^{2}$ 本身；没有减去沿 $\\mathbf{x}_{1}$ 的部分。",
        ),
      ].filter((w, i, all) => String(w.value) !== String(answer) && all.findIndex((o) => String(o.value) === String(w.value)) === i),
      solution: walked(
        [
          [
            ["Find the removed squared length", "求减去部分的长度平方"],
            text([
              "The removed part is $\\frac{\\mathbf{x}_{1} \\cdot \\mathbf{x}_{2}}{\\|\\mathbf{x}_{1}\\|^{2}}\\mathbf{x}_{1}$, so its squared length is",
              "减去的部分是 $\\frac{\\mathbf{x}_{1} \\cdot \\mathbf{x}_{2}}{\\|\\mathbf{x}_{1}\\|^{2}}\\mathbf{x}_{1}$，所以它的长度平方是",
            ]),
            [
              `\\frac{(\\mathbf{x}_{1} \\cdot \\mathbf{x}_{2})^{2}}{\\|\\mathbf{x}_{1}\\|^{2}} = \\frac{${wrap(d)}^{2}}{${M}} = ${removed.toLatex()}`,
            ],
          ],
          [
            ["Use the Pythagorean theorem", "用勾股定理"],
            text([
              "That part is orthogonal to $\\mathbf{w}$, and the two add up to $\\mathbf{x}_{2}$:",
              "这部分与 $\\mathbf{w}$ 正交，两者相加等于 $\\mathbf{x}_{2}$：",
            ]),
            [`\\|\\mathbf{w}\\|^{2} = ${N} - ${removed.toLatex()} = ${answer.toLatex()}`],
          ],
        ],
        text([
          `The two orthogonal parts rebuild $\\mathbf{x}_{2}$: $${answer.toLatex()} + ${removed.toLatex()} = ${N}$.`,
          `两个正交的部分合成 $\\mathbf{x}_{2}$：$${answer.toLatex()} + ${removed.toLatex()} = ${N}$。`,
        ]),
      ),
    });
  },
);

const gramDependent = point(
  "the-step-where-gram-schmidt-produces-zero",
  ["The step where Gram-Schmidt produces zero", "格拉姆-施密特过程产生零向量的步骤"],
  [
    "Gram-Schmidt produces the zero vector exactly at the first vector that depends on those before it, because everything in that vector is removed by the projections. So running it on a dependent list finds the dependency, and the zero vector must be dropped before continuing. For example, with $\\mathbf{x}_{1} = (1, 0)$ and $\\mathbf{x}_{2} = (2, 0)$, $\\mathbf{w}_{2} = \\mathbf{x}_{2} - 2\\mathbf{x}_{1} = \\mathbf{0}$.\n\n> **Watch out.** Look for the first vector that is a combination of the vectors before it, not of the vectors after it. A vector independent of the earlier ones always leaves a nonzero $\\mathbf{w}_{k}$.",
    "格拉姆-施密特过程恰好在第一个依赖于前面向量的向量处产生零向量，因为这个向量的所有部分都被投影减去了。所以对线性相关的向量组运行它就能发现相关性，继续之前必须去掉零向量。例如 $\\mathbf{x}_{1} = (1, 0)$，$\\mathbf{x}_{2} = (2, 0)$ 时 $\\mathbf{w}_{2} = \\mathbf{x}_{2} - 2\\mathbf{x}_{1} = \\mathbf{0}$。\n\n> **注意。** 要找的是第一个能由它前面的向量组合出的向量，而不是由后面的向量组合出的。与前面向量线性无关的向量总是留下非零的 $\\mathbf{w}_{k}$。",
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
    return numberProblem({
      prompt: text([
        `Gram-Schmidt is applied in order to $\\mathbf{x}_{1}, \\mathbf{x}_{2}, \\mathbf{x}_{3}, \\mathbf{x}_{4} = ${shown}$. At which step $k$ is $\\mathbf{w}_{k}$ first the zero vector?`,
        `对 $\\mathbf{x}_{1}, \\mathbf{x}_{2}, \\mathbf{x}_{3}, \\mathbf{x}_{4} = ${shown}$ 依次运用格拉姆-施密特过程。在第几步 $k$，$\\mathbf{w}_{k}$ 首次成为零向量？`,
      ]),
      answer,
      mistakes: [1, 2, 3, 4]
        .filter((k) => k !== answer)
        .map((k) =>
          k === 1
            ? why(
                1,
                "$\\mathbf{w}_{1} = \\mathbf{x}_{1}$, which is not zero; nothing is subtracted at the first step.",
                "$\\mathbf{w}_{1} = \\mathbf{x}_{1}$，它不是零向量；第一步什么也不减。",
              )
            : k < answer
              ? why(
                  k,
                  `$\\mathbf{x}_{${k}}$ is independent of the vectors before it, so $\\mathbf{w}_{${k}}$ is not zero.`,
                  `$\\mathbf{x}_{${k}}$ 与它前面的向量线性无关，所以 $\\mathbf{w}_{${k}}$ 不是零向量。`,
                )
              : why(
                  k,
                  `The zero comes earlier: $\\mathbf{x}_{${answer}}$ already depends on the vectors before it.`,
                  `零向量出现得更早：$\\mathbf{x}_{${answer}}$ 已经依赖于它前面的向量。`,
                ),
        ),
      solution: walked(
        [
          [
            ["Check the earlier vectors", "检查前面的向量"],
            text(
              answer === 2
                ? [
                    "$\\mathbf{x}_{1}$ is not zero, so $\\mathbf{w}_{1} = \\mathbf{x}_{1}$ is nonzero.",
                    "$\\mathbf{x}_{1}$ 不是零向量，所以 $\\mathbf{w}_{1} = \\mathbf{x}_{1}$ 非零。",
                  ]
                : [
                    `The vectors before $\\mathbf{x}_{${answer}}$ are independent, since their first nonzero entries sit in different places, so $\\mathbf{w}_{1}, \\dots, \\mathbf{w}_{${answer - 1}}$ are all nonzero.`,
                    `$\\mathbf{x}_{${answer}}$ 前面的向量的首个非零分量位置各不相同，所以它们线性无关，$\\mathbf{w}_{1}, \\dots, \\mathbf{w}_{${answer - 1}}$ 都不是零向量。`,
                  ],
            ),
          ],
          [
            ["Find the dependent vector", "找出相关的向量"],
            text([
              `$\\mathbf{x}_{${answer}}$ lies in the span of the earlier vectors, so the projections remove all of it:`,
              `$\\mathbf{x}_{${answer}}$ 在前面向量张成的空间中，所以投影减去了它的全部：`,
            ]),
            [`\\mathbf{x}_{${answer}} = ${relation}`, `\\mathbf{w}_{${answer}} = \\mathbf{0}`],
          ],
        ],
        text([
          `Computing $${relation}$ entry by entry reproduces the listed $\\mathbf{x}_{${answer}}$.`,
          `逐个分量计算 $${relation}$，正好得到所列的 $\\mathbf{x}_{${answer}}$。`,
        ]),
      ),
    });
  },
);

const symmetricAction = point(
  "acting-with-a-symmetric-matrix-through-its-eigenvectors",
  ["Acting with a symmetric matrix through its eigenvectors", "通过特征向量计算对称矩阵的作用"],
  [
    "The eigenvectors of a symmetric $2 \\times 2$ matrix with distinct eigenvalues are orthogonal, so one eigenvector gives the other direction. A vector can then be split along the two by dot products, and each part is scaled by its own eigenvalue, with no need to build the matrix. For example, with $\\lambda = 2$ on $(1, 1)$ and the other eigenvalue $5$, the other eigenvector is $(-1, 1)$; then $(1, 3) = 2(1, 1) + 1(-1, 1)$, so $A(1, 3) = 4(1, 1) + 5(-1, 1) = (-1, 9)$.\n\n> **Watch out.** Scale each part by its own eigenvalue, not the whole vector by one of them, and keep the minus sign in the other eigenvector $(-q, p)$.",
    "特征值互异的对称 $2 \\times 2$ 矩阵的特征向量正交，所以一个特征向量就给出另一个方向。向量可以用点积沿这两个方向分解，每一部分乘以各自的特征值，不需要构造矩阵。例如 $\\lambda = 2$ 对应 $(1, 1)$，另一个特征值为 $5$，则另一个特征向量是 $(-1, 1)$；于是 $(1, 3) = 2(1, 1) + 1(-1, 1)$，所以 $A(1, 3) = 4(1, 1) + 5(-1, 1) = (-1, 9)$。\n\n> **注意。** 每一部分乘以它自己的特征值，而不是把整个向量乘以其中一个特征值；另一个特征向量 $(-q, p)$ 中的负号也不能丢。",
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
    const second = s * l1 * q + t * l2 * p;
    return numberProblem({
      prompt: text([
        `$A$ is symmetric, with $${vec(p, q)}$ an eigenvector for $\\lambda = ${l1}$, and its other eigenvalue is $${l2}$. Find the first entry of $A${vec(x1, x2)}$.`,
        `$A$ 是对称矩阵，$${vec(p, q)}$ 是关于 $\\lambda = ${l1}$ 的特征向量，另一个特征值是 $${l2}$。求 $A${vec(x1, x2)}$ 的第一个元素。`,
      ]),
      answer,
      mistakes: [
        why(
          l1 * x1,
          `That scales the whole vector by $${l1}$; only its part along $${vec(p, q)}$ is scaled by $${l1}$.`,
          `这是把整个向量乘以 $${l1}$；只有沿 $${vec(p, q)}$ 的部分才乘以 $${l1}$。`,
        ),
        why(
          l2 * x1,
          `That scales the whole vector by $${l2}$; only its part along the other eigenvector is scaled by $${l2}$.`,
          `这是把整个向量乘以 $${l2}$；只有沿另一个特征向量的部分才乘以 $${l2}$。`,
        ),
        why(
          s * l1 * p + t * l2 * q,
          `The first entry of the other eigenvector is $${-q}$, not $${q}$.`,
          `另一个特征向量的第一个元素是 $${-q}$，不是 $${q}$。`,
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Find the other eigenvector", "求另一个特征向量"],
            text([`It is orthogonal to $${vec(p, q)}$, so take $${vec(-q, p)}$.`, `它与 $${vec(p, q)}$ 正交，所以取 $${vec(-q, p)}$。`]),
          ],
          [
            ["Split the vector", "分解向量"],
            text([
              `Dot products with each eigenvector, divided by the squared length $${norm}$, give the coefficients:`,
              `与每个特征向量作点积，再除以长度平方 $${norm}$，得到系数：`,
            ]),
            [`${vec(x1, x2)} = ${poly([s, vec(p, q)], [t, vec(-q, p)])}`],
          ],
          [
            ["Scale each part and read the first entry", "分别缩放并读出第一个元素"],
            text(["", ""]),
            [`${wrap(s)} \\cdot ${wrap(l1)} \\cdot ${wrap(p)} + ${wrap(t)} \\cdot ${wrap(l2)} \\cdot ${wrap(-q)} = ${answer}`],
          ],
        ],
        text([
          `The second entry is likewise $${second}$, and $${wrap(answer)} \\cdot ${wrap(p)} + ${wrap(second)} \\cdot ${wrap(q)} = ${l1 * s * norm} = ${wrap(l1)} \\cdot ${wrap(s * norm)}$, which is $\\lambda$ times the dot product of the vector with $${vec(p, q)}$, as it must be.`,
          `同理第二个元素是 $${second}$，而 $${wrap(answer)} \\cdot ${wrap(p)} + ${wrap(second)} \\cdot ${wrap(q)} = ${l1 * s * norm} = ${wrap(l1)} \\cdot ${wrap(s * norm)}$，正是 $\\lambda$ 乘以该向量与 $${vec(p, q)}$ 的点积，理应如此。`,
        ]),
      ),
    });
  },
);

const repeatedSymmetric = point(
  "the-last-eigenvalue-from-the-trace",
  ["The last eigenvalue from the trace", "由迹求最后一个特征值"],
  [
    "The trace of a matrix is the sum of its eigenvalues counted with multiplicity. So when a symmetric $3 \\times 3$ matrix has an eigenvalue of multiplicity $2$, the remaining eigenvalue follows from the diagonal, with no need to expand the characteristic polynomial. For example, if the diagonal is $3, 2, 4$ and $1$ is an eigenvalue of multiplicity $2$, the trace is $9$ and the other eigenvalue is $9 - 2 \\cdot 1 = 7$.\n\n> **Watch out.** An eigenvalue of multiplicity $2$ is counted twice in the trace, so subtract it twice.",
    "矩阵的迹等于按重数计算的特征值之和。所以当对称 $3 \\times 3$ 矩阵有一个重数为 $2$ 的特征值时，剩下的特征值由对角线就能求出，不需要展开特征多项式。例如对角线为 $3, 2, 4$，且 $1$ 是重数为 $2$ 的特征值，则迹是 $9$，另一个特征值是 $9 - 2 \\cdot 1 = 7$。\n\n> **注意。** 重数为 $2$ 的特征值在迹中算两次，所以要减两次。",
  ],
  (rng) => {
    const c = rng.int(-5, 5);
    const k = nz(rng, 2);
    const v = [nz(rng, 2), nz(rng, 2), nz(rng, 2)] as const;
    const rows = v.map((vi, i) => v.map((vj, j) => k * vi * vj + (i === j ? c : 0)));
    const norm = v[0] ** 2 + v[1] ** 2 + v[2] ** 2;
    const trace = 3 * c + k * norm;
    const answer = c + k * norm;
    const diag = rows.map((r, i) => r[i]!);
    return numberProblem({
      prompt: text([
        `The symmetric matrix $${mat(rows)}$ has the eigenvalue $${c}$ with multiplicity $2$. Find its other eigenvalue.`,
        `对称矩阵 $${mat(rows)}$ 有重数为 $2$ 的特征值 $${c}$。求它的另一个特征值。`,
      ]),
      answer,
      mistakes: [
        why(
          trace,
          `That is the whole trace; the eigenvalue $${c}$ must still be subtracted twice.`,
          `这是整个迹；还要减去两次特征值 $${c}$。`,
        ),
        why(
          trace - c,
          `The eigenvalue $${c}$ has multiplicity $2$, so it is subtracted twice, not once.`,
          `特征值 $${c}$ 的重数为 $2$，所以要减两次，而不是一次。`,
        ),
        why(
          k * norm,
          `That subtracts $${c}$ three times; it appears only twice among the eigenvalues.`,
          `这是减了三次 $${c}$；它在特征值中只出现两次。`,
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Add the diagonal", "把对角元相加"],
            text(["The trace is the sum of the eigenvalues:", "迹等于特征值之和："]),
            [`${diag[0]} + ${wrap(diag[1]!)} + ${wrap(diag[2]!)} = ${trace}`],
          ],
          [["Subtract the repeated eigenvalue twice", "减去两次重特征值"], text(["", ""]), [`${trace} - 2 \\cdot ${wrap(c)} = ${answer}`]],
        ],
        text([
          `Subtracting $${c}$ from the diagonal leaves a matrix whose rows are all multiples of $${vec(...v)}$, so it has rank $1$ and its one nonzero eigenvalue is its trace $${k * norm}$; adding back $${c}$ gives $${answer}$ again.`,
          `从对角线上减去 $${c}$ 后，剩下矩阵的每一行都是 $${vec(...v)}$ 的倍数，所以秩为 $1$，唯一的非零特征值就是它的迹 $${k * norm}$；再加回 $${c}$ 又得到 $${answer}$。`,
        ]),
      ),
    });
  },
);

const shearRemoving = point(
  "the-shear-that-removes-the-cross-term",
  ["The shear that removes the cross term", "消去交叉项的剪切变换"],
  [
    "A change of variables need not be orthogonal to remove a cross term. Substituting $x_{1} = y_{1} + ky_{2}$, $x_{2} = y_{2}$ makes the coefficient of $y_{1}y_{2}$ a linear expression in $k$, which can be set to zero. This is completing the square written as a change of variables. For example, in $2x_{1}^{2} + 8x_{1}x_{2} + x_{2}^{2}$ the square gives $2(y_{1} + ky_{2})^{2}$, whose cross term is $4ky_{1}y_{2}$; with $8y_{1}y_{2}$ from the cross term, $4k + 8 = 0$ gives $k = -2$.\n\n> **Watch out.** Squaring $y_{1} + ky_{2}$ gives the cross term $2ky_{1}y_{2}$, so the coefficient of $k$ is twice the coefficient of $x_{1}^{2}$.",
    "消去交叉项的变量替换不一定是正交的。代入 $x_{1} = y_{1} + ky_{2}$，$x_{2} = y_{2}$ 后，$y_{1}y_{2}$ 的系数是 $k$ 的线性式，可以令它为零。这就是用变量替换的形式写出的配方。例如在 $2x_{1}^{2} + 8x_{1}x_{2} + x_{2}^{2}$ 中，平方项给出 $2(y_{1} + ky_{2})^{2}$，其交叉项是 $4ky_{1}y_{2}$；加上交叉项给出的 $8y_{1}y_{2}$，由 $4k + 8 = 0$ 得 $k = -2$。\n\n> **注意。** $y_{1} + ky_{2}$ 平方后的交叉项是 $2ky_{1}y_{2}$，所以 $k$ 的系数是 $x_{1}^{2}$ 系数的两倍。",
  ],
  (rng) => {
    const a = nz(rng, 5);
    const b = nz(rng, 9);
    const c = nz(rng, 5);
    const answer = Q.of(-b, 2 * a);
    const form = poly([a, "x_{1}^{2}"], [b, "x_{1}x_{2}"], [c, "x_{2}^{2}"]);
    return numberProblem({
      prompt: text([
        `Find $k$ so that $x_{1} = y_{1} + ky_{2}$, $x_{2} = y_{2}$ removes the $y_{1}y_{2}$ term from $Q = ${form}$.`,
        `求 $k$，使 $x_{1} = y_{1} + ky_{2}$，$x_{2} = y_{2}$ 消去 $Q = ${form}$ 中的 $y_{1}y_{2}$ 项。`,
      ]),
      answer,
      mistakes: [
        why(
          answer.neg(),
          "The sign is flipped: $k$ must cancel the cross term, not double it.",
          "符号反了：$k$ 要抵消交叉项，而不是使它加倍。",
        ),
        why(
          Q.of(-b, a),
          `Squaring gives $2ky_{1}y_{2}$, so the square contributes $${poly([2 * a, "k"])}$, not $${poly([a, "k"])}$.`,
          `平方给出 $2ky_{1}y_{2}$，所以平方项贡献 $${poly([2 * a, "k"])}$，不是 $${poly([a, "k"])}$。`,
        ),
        why(Q.of(-2 * a, b), "The equation was solved upside down.", "方程解成了倒数。"),
      ].filter((w, i, all) => String(w.value) !== String(answer) && all.findIndex((o) => String(o.value) === String(w.value)) === i),
      solution: walked(
        [
          [
            ["Substitute", "代入"],
            text([
              `The square term gives $${a}(y_{1} + ky_{2})^{2}$ and the cross term gives $${b === 1 ? "" : b === -1 ? "-" : b}(y_{1} + ky_{2})y_{2}$. Collect the $y_{1}y_{2}$ terms:`,
              `平方项给出 $${a}(y_{1} + ky_{2})^{2}$，交叉项给出 $${b === 1 ? "" : b === -1 ? "-" : b}(y_{1} + ky_{2})y_{2}$。合并 $y_{1}y_{2}$ 项：`,
            ]),
            [`${poly([2 * a, "k"], [b, ""])} = 0`],
          ],
          [["Solve for k", "解出 k"], text(["", ""]), [`k = ${answer.toLatex()}`]],
        ],
        text([
          `Putting $k$ back, $${2 * a} \\cdot ${a * b > 0 ? `\\left(${answer.toLatex()}\\right)` : answer.toLatex()} ${b < 0 ? `- ${-b}` : `+ ${b}`} = 0$, so the $y_{1}y_{2}$ term is gone.`,
          `代回 $k$：$${2 * a} \\cdot ${a * b > 0 ? `\\left(${answer.toLatex()}\\right)` : answer.toLatex()} ${b < 0 ? `- ${-b}` : `+ ${b}`} = 0$，所以 $y_{1}y_{2}$ 项消失了。`,
        ]),
      ),
    });
  },
);

const singleSquare = point(
  "a-canonical-form-with-a-single-square",
  ["A canonical form with a single square", "只有一个平方项的标准形"],
  [
    "The canonical form has as many squares as the rank of the matrix of the form. A form with the cross term written as $2kx_{1}x_{2}$ has the off-diagonal entry $k$ in its matrix, so it reduces to a single square exactly when the determinant $ac - k^{2}$ is zero. For example, $4x_{1}^{2} + 2kx_{1}x_{2} + 9x_{2}^{2}$ needs $36 - k^{2} = 0$, so $k = 6$, and then the form is $(2x_{1} + 3x_{2})^{2}$.\n\n> **Watch out.** The matrix entry is $k$, half the coefficient $2k$ of $x_{1}x_{2}$; the condition is $k^{2} = ac$, not $k = ac$.",
    "标准形中平方项的个数等于二次型矩阵的秩。交叉项写成 $2kx_{1}x_{2}$ 的二次型，其矩阵的非对角元素是 $k$，所以它化为单个平方项，当且仅当行列式 $ac - k^{2}$ 为零。例如 $4x_{1}^{2} + 2kx_{1}x_{2} + 9x_{2}^{2}$ 需要 $36 - k^{2} = 0$，所以 $k = 6$，这时二次型是 $(2x_{1} + 3x_{2})^{2}$。\n\n> **注意。** 矩阵元素是 $k$，即 $x_{1}x_{2}$ 系数 $2k$ 的一半；条件是 $k^{2} = ac$，不是 $k = ac$。",
  ],
  (rng) => {
    const m = nz(rng, 4);
    const p = rng.int(1, 4);
    const q = rng.int(1, 4);
    const a = m * p * p;
    const c = m * q * q;
    const answer = Math.abs(m) * p * q;
    const form = poly([a, "x_{1}^{2}"], [1, "2kx_{1}x_{2}"], [c, "x_{2}^{2}"]);
    return numberProblem({
      prompt: text([
        `For which $k > 0$ does an orthogonal transformation reduce $Q = ${form}$ to a single square term?`,
        `当 $k > 0$ 为何值时，正交变换把 $Q = ${form}$ 化为单个平方项？`,
      ]),
      answer,
      mistakes: [
        why(
          2 * answer,
          `$${2 * answer}$ is the coefficient $2k$ of $x_{1}x_{2}$; the matrix entry is $k$ itself.`,
          `$${2 * answer}$ 是 $x_{1}x_{2}$ 的系数 $2k$；矩阵元素是 $k$ 本身。`,
        ),
        why(a * c, `$${a * c}$ is $ac$, which equals $k^{2}$, not $k$.`, `$${a * c}$ 是 $ac$，它等于 $k^{2}$，不是 $k$。`),
        why(
          Math.abs(a) + Math.abs(c),
          "That adds the sizes of the diagonal entries; one square term needs the determinant to be zero.",
          "这是把对角元的绝对值相加；单个平方项要求行列式为零。",
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Write the matrix", "写出矩阵"],
            text([
              "The off-diagonal entry is half the coefficient of $x_{1}x_{2}$, and one square term means one eigenvalue is zero:",
              "非对角元素是 $x_{1}x_{2}$ 系数的一半，只有一个平方项意味着有一个特征值为零：",
            ]),
            [
              `\\det ${mat([
                [a, "k"],
                ["k", c],
              ])} = ${wrap(a)} \\cdot ${wrap(c)} - k^{2} = 0`,
            ],
          ],
          [["Take the positive root", "取正根"], text(["", ""]), [`k^{2} = ${a * c}`, `k = ${answer}`]],
        ],
        text([
          `With $k = ${answer}$ the form is $${m === 1 ? "" : m === -1 ? "-" : m}(${poly([p, "x_{1}"], [Math.sign(m) * q, "x_{2}"])})^{2}$, a single square.`,
          `$k = ${answer}$ 时二次型是 $${m === 1 ? "" : m === -1 ? "-" : m}(${poly([p, "x_{1}"], [Math.sign(m) * q, "x_{2}"])})^{2}$，只有一个平方项。`,
        ]),
      ),
    });
  },
);

const semiAxis = {
  ...point(
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
  ),
  figure: linearAlgebraDrawings2["classifying-quadratic-curves#the-semi-major-axis-of-a-rotated-ellipse"],
};

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

const howManyAttain = {
  ...point(
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
  ),
  figure:
    linearAlgebraDrawings2[
      "constrained-optimization-of-quadratic-forms-determining-where-extrema-are-attained#how-many-unit-vectors-attain-an-extreme-value"
    ],
};

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
