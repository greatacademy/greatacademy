// A third knowledge point for the Precalculus topics on vectors, matrices and linear transformations.

import type { KnowledgePointDef } from "@ga/content";
import { Q } from "@ga/subject-math";
import { precalculusDrawings2 } from "../explanation-drawings-precalculus-2.ts";
import { precalculusDrawings4 } from "../explanation-drawings-precalculus-4.ts";
import { reasoned } from "../wrong-reasons.ts";
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
    {
      ...skill(
        "equal-vectors-in-a-parallelogram",
        ["Equal vectors in a parallelogram", "平行四边形中的相等向量"],
        [
          "Two vectors are equal when they have the same length and direction, wherever they start. Opposite sides of a parallelogram, read in the same direction, are therefore equal vectors.\n\nIn parallelogram $PQRS$: $\\vec{PQ} = \\vec{SR}$ and $\\vec{QR} = \\vec{PS}$. Check: both paths from $P$ to $R$ agree, $\\vec{PQ} + \\vec{QR} = \\vec{PS} + \\vec{SR}$.\n\n> **Watch out.** Read the opposite side in the same direction. In $ABCD$ the side opposite $\\vec{AB}$ is $\\vec{DC}$, while $\\vec{CD}$ points the other way and equals $-\\vec{AB}$.",
          "两个向量长度和方向都相同就相等，不管起点在哪里。所以平行四边形的对边，按相同方向读，是相等的向量。\n\n在平行四边形 $PQRS$ 中：$\\vec{PQ} = \\vec{SR}$，$\\vec{QR} = \\vec{PS}$。检验：从 $P$ 到 $R$ 的两条路径一致，$\\vec{PQ} + \\vec{QR} = \\vec{PS} + \\vec{SR}$。\n\n> **注意。** 对边要按相同方向读。在 $ABCD$ 中，与 $\\vec{AB}$ 相对的是 $\\vec{DC}$，而 $\\vec{CD}$ 方向相反，等于 $-\\vec{AB}$。",
        ],
        (rng) => {
          const [A, B, C, D] = rng.sample(["A", "B", "C", "D", "P", "Q", "R", "S", "K", "L", "M", "N"], 4) as [
            string,
            string,
            string,
            string,
          ];
          return reasoned(
            chooseFilled(
              rng,
              [
                `$${A}${B}${C}${D}$ is a parallelogram, with vertices in that order. Which vector equals $\\vec{${A}${B}}$?`,
                `$${A}${B}${C}${D}$ 是平行四边形，顶点按此顺序。哪个向量等于 $\\vec{${A}${B}}$？`,
              ],
              `\\vec{${D}${C}}`,
              [`\\vec{${C}${D}}`, `\\vec{${A}${D}}`, `\\vec{${B}${C}}`],
              [
                `**Step 1: Find the opposite side.** Going round $${A}${B}${C}${D}$, the side opposite $${A}${B}$ is $${C}${D}$. It is parallel to $${A}${B}$ and just as long.\n\n**Step 2: Match the direction.** $\\vec{${A}${B}}$ goes from the first vertex to the second. Along the opposite side the same direction runs from $${D}$, opposite $${A}$, to $${C}$, opposite $${B}$, so the equal vector is $\\vec{${D}${C}}$.\n\n**Check.** If $\\vec{${A}${B}} = \\vec{${D}${C}}$, the two paths from $${A}$ to $${C}$ agree: $\\vec{${A}${B}} + \\vec{${B}${C}} = \\vec{${A}${D}} + \\vec{${D}${C}}$, since $\\vec{${B}${C}} = \\vec{${A}${D}}$ as well.`,
                `**第一步：找对边。**绕 $${A}${B}${C}${D}$ 一圈，与 $${A}${B}$ 相对的边是 $${C}${D}$。它与 $${A}${B}$ 平行且等长。\n\n**第二步：对齐方向。**$\\vec{${A}${B}}$ 从第一个顶点指向第二个顶点。在对边上，同样的方向是从 $${D}$（与 $${A}$ 相对）指向 $${C}$（与 $${B}$ 相对），所以相等的向量是 $\\vec{${D}${C}}$。\n\n**检验。**若 $\\vec{${A}${B}} = \\vec{${D}${C}}$，从 $${A}$ 到 $${C}$ 的两条路径一致：$\\vec{${A}${B}} + \\vec{${B}${C}} = \\vec{${A}${D}} + \\vec{${D}${C}}$，因为 $\\vec{${B}${C}} = \\vec{${A}${D}}$ 也成立。`,
              ],
            ),
            [
              [
                `$\\vec{${C}${D}}$`,
                "This runs along the opposite side but in the other direction, and equal vectors share their direction.",
                "它沿对边，但方向相反，而相等的向量方向相同。",
              ],
              [
                `$\\vec{${A}${D}}$`,
                "This is a neighboring side, not the opposite one, so its direction differs.",
                "这是相邻的边，不是对边，所以方向不同。",
              ],
              [
                `$\\vec{${B}${C}}$`,
                "This is a neighboring side, not the opposite one, so its direction differs.",
                "这是相邻的边，不是对边，所以方向不同。",
              ],
            ],
          );
        },
      ),
      figure: precalculusDrawings2["introduction-to-vectors#equal-vectors-in-a-parallelogram"],
    },
  ],
  "the-triangle-law-for-the-addition-of-two-vectors": [
    skill(
      "the-longest-and-shortest-sum",
      ["The longest and shortest sum", "和的最大值和最小值"],
      [
        "The sum of two vectors is longest when they point the same way and shortest when they point in opposite ways. Every other direction gives a length between these two extremes.\n\nFor magnitudes $5$ and $8$: pointing the same way the sum has length $5 + 8 = 13$, and pointing in opposite ways it has length $8 - 5 = 3$. Check: any triangle with sides $5$ and $8$ has its third side between $3$ and $13$.\n\n> **Watch out.** The least magnitude is the difference $|a - b|$, not the smaller of the two magnitudes, and it is $0$ when the magnitudes are equal.",
        "两个向量方向相同时和最长，方向相反时和最短。其他方向的和，长度都在这两个极值之间。\n\n模为 $5$ 和 $8$ 时：方向相同，和的长度是 $5 + 8 = 13$；方向相反，长度是 $8 - 5 = 3$。检验：两边为 $5$ 和 $8$ 的三角形，第三边在 $3$ 和 $13$ 之间。\n\n> **注意。** 最小值是差 $|a - b|$，不是两个模中较小的那个；两个模相等时最小值是 $0$。",
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
            `**Step 1: Choose the directions.** By the triangle law the sum closes a triangle with sides ${a} and ${b}. It is ${most ? "longest when the two vectors point the same way, so that the triangle lies flat with the sides end to end" : "shortest when the two vectors point in opposite ways, so that the second side runs back over the first"}.\n\n**Step 2: Combine the lengths.** ${most ? `The lengths add: $${a} + ${b} = ${a + b}$.` : `The shorter is taken from the longer: $|${a} - ${b}| = ${Math.abs(a - b)}$.`}\n\n**Check.** The third side of a triangle with sides ${a} and ${b} lies between $${Math.abs(a - b)}$ and $${a + b}$, so the ${most ? "greatest" : "least"} possible value is $${most ? a + b : Math.abs(a - b)}$.`,
            `**第一步：选方向。**由三角形法则，和与两边 ${a}、${b} 构成三角形。${most ? "两个向量方向相同时和最长，此时三角形压平，两边首尾相接成一条线" : "两个向量方向相反时和最短，此时第二条边沿第一条边折回"}。\n\n**第二步：合并长度。**${most ? `长度相加：$${a} + ${b} = ${a + b}$。` : `长的减去短的：$|${a} - ${b}| = ${Math.abs(a - b)}$。`}\n\n**检验。**两边为 ${a} 和 ${b} 的三角形，第三边在 $${Math.abs(a - b)}$ 和 $${a + b}$ 之间，所以${most ? "最大" : "最小"}可能值是 $${most ? a + b : Math.abs(a - b)}$。`,
          ],
        );
      },
    ),
  ],
  "the-magnitude-of-a-vector": [
    {
      ...skill(
        "perpendicular-vectors-and-their-sum",
        ["Perpendicular vectors and their sum", "垂直向量及其和"],
        [
          "When two vectors are perpendicular, the triangle law gives a right triangle. So the magnitude of the sum comes from the Pythagorean theorem and not from adding the magnitudes.\n\nFor perpendicular vectors of magnitudes $6$ and $8$: the sum is the hypotenuse, $\\sqrt{6^{2} + 8^{2}} = \\sqrt{100} = 10$. Check: $10$ lies between $8 - 6 = 2$ and $8 + 6 = 14$, as the third side of any triangle must.\n\n> **Watch out.** Square the magnitudes before adding and take the square root at the end: $\\|\\mathbf{u} + \\mathbf{v}\\|$ is $10$ here, not $6 + 8 = 14$.",
          "两个向量垂直时，三角形法则得到直角三角形。所以和的模由勾股定理求，而不是把模相加。\n\n模为 $6$ 和 $8$ 的两个垂直向量：和是斜边，$\\sqrt{6^{2} + 8^{2}} = \\sqrt{100} = 10$。检验：$10$ 在 $8 - 6 = 2$ 和 $8 + 6 = 14$ 之间，任何三角形的第三边都应如此。\n\n> **注意。** 先把模平方再相加，最后开平方：这里 $\\|\\mathbf{u} + \\mathbf{v}\\|$ 是 $10$，不是 $6 + 8 = 14$。",
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
            [
              `**Step 1: Draw the triangle.** Place $\\mathbf{v}$ at the end of $\\mathbf{u}$. The two sides meet at a right angle, and $\\mathbf{u} + \\mathbf{v}$ is the hypotenuse.\n\n**Step 2: Use the Pythagorean theorem.**\n\n$$\\|\\mathbf{u} + \\mathbf{v}\\| = \\sqrt{${a}^{2} + ${b}^{2}} = \\sqrt{${a * a} + ${b * b}} = \\sqrt{${c * c}} = ${c}$$\n\n**Check.** $${c}^{2} = ${c * c} = ${a * a} + ${b * b}$, and $${c}$ lies between $${Math.abs(b - a)}$ and $${a + b}$, as the third side of a triangle must.`,
              `**第一步：画三角形。**把 $\\mathbf{v}$ 接在 $\\mathbf{u}$ 的终点。两边成直角，$\\mathbf{u} + \\mathbf{v}$ 是斜边。\n\n**第二步：用勾股定理。**\n\n$$\\|\\mathbf{u} + \\mathbf{v}\\| = \\sqrt{${a}^{2} + ${b}^{2}} = \\sqrt{${a * a} + ${b * b}} = \\sqrt{${c * c}} = ${c}$$\n\n**检验。**$${c}^{2} = ${c * c} = ${a * a} + ${b * b}$，且 $${c}$ 在 $${Math.abs(b - a)}$ 和 $${a + b}$ 之间，三角形的第三边应如此。`,
            ],
          );
        },
      ),
      figure: precalculusDrawings2["the-magnitude-of-a-vector#perpendicular-vectors-and-their-sum"],
    },
  ],
  "problem-solving-using-vector-diagrams": [
    skill(
      "a-point-dividing-a-side",
      ["A point dividing a side", "分一条边的点"],
      [
        "A point that cuts a side in a given ratio gives a fraction of that side's vector. To reach it, walk to the start of the side and then along that fraction of the side.\n\nIn $\\triangle OAB$ with $AP : PB = 1 : 3$: $P$ is $1/4$ of the way from $A$ to $B$, so $\\vec{OP} = \\mathbf{a} + \\tfrac{1}{4}(\\mathbf{b} - \\mathbf{a}) = \\tfrac{3}{4}\\mathbf{a} + \\tfrac{1}{4}\\mathbf{b}$. Check: the coefficients add to $1$, and $P$ is nearer $A$, so $\\mathbf{a}$ has the larger coefficient.\n\n> **Watch out.** The fraction of the side is the first part over the whole, $AP : AB = 1 : 4$, not $1/3$. Each end gets the coefficient of the part on the far side of $P$.",
        "按给定比分一条边的点，对应这条边向量的若干分之几。要到达它，先走到这条边的起点，再沿这条边走这个分数。\n\n在 $\\triangle OAB$ 中，$AP : PB = 1 : 3$：$P$ 在从 $A$ 到 $B$ 的 $1/4$ 处，所以 $\\vec{OP} = \\mathbf{a} + \\tfrac{1}{4}(\\mathbf{b} - \\mathbf{a}) = \\tfrac{3}{4}\\mathbf{a} + \\tfrac{1}{4}\\mathbf{b}$。检验：系数之和为 $1$，且 $P$ 离 $A$ 较近，所以 $\\mathbf{a}$ 的系数较大。\n\n> **注意。** 边上的分数是前一段比整条边，$AP : AB = 1 : 4$，不是 $1/3$。每个端点的系数是 $P$ 另一侧那一段所占的份额。",
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
        return reasoned(
          chooseFilled(
            rng,
            [
              `In $\\triangle OAB$, $\\vec{OA} = \\mathbf{a}$ and $\\vec{OB} = \\mathbf{b}$. Point $P$ on $AB$ has $AP : PB = ${p} : ${q}$. Find $\\vec{OP}$.`,
              `在 $\\triangle OAB$ 中，$\\vec{OA} = \\mathbf{a}$，$\\vec{OB} = \\mathbf{b}$。$AB$ 上的点 $P$ 满足 $AP : PB = ${p} : ${q}$。求 $\\vec{OP}$。`,
            ],
            `${first}\\mathbf{a} + ${second}\\mathbf{b}`,
            [
              `${second}\\mathbf{a} + ${first}\\mathbf{b}`,
              `${first}\\mathbf{a} - ${second}\\mathbf{b}`,
              `${p}\\mathbf{a} + ${q}\\mathbf{b}`,
            ],
            [
              `**Step 1: Write the side as a vector.** Go from $A$ back to $O$ and then to $B$:\n\n$$\\vec{AB} = \\vec{AO} + \\vec{OB} = \\mathbf{b} - \\mathbf{a}$$\n\n**Step 2: Walk to $P$.** $AP : PB = ${p} : ${q}$ cuts $AB$ into ${t} equal parts, and $P$ is ${p} of them from $A$, so $\\vec{AP} = ${second}\\vec{AB}$:\n\n$$\\vec{OP} = \\mathbf{a} + ${second}(\\mathbf{b} - \\mathbf{a}) = ${first}\\mathbf{a} + ${second}\\mathbf{b}$$\n\n**Check.** A point on $AB$ has coefficients that add to $1$, and these do:\n\n$$${first} + ${second} = 1$$\n\nThe rest of the side is $\\vec{PB} = \\mathbf{b} - \\vec{OP}$, so the two parts are in the given ratio:\n\n$$\\vec{PB} = ${first}(\\mathbf{b} - \\mathbf{a}), \\quad AP : PB = ${second} : ${first} = ${p} : ${q}$$`,
              `**第一步：把边写成向量。**从 $A$ 回到 $O$，再到 $B$：\n\n$$\\vec{AB} = \\vec{AO} + \\vec{OB} = \\mathbf{b} - \\mathbf{a}$$\n\n**第二步：走到 $P$。**$AP : PB = ${p} : ${q}$ 把 $AB$ 分成 ${t} 等份，$P$ 离 $A$ 有 ${p} 份，所以 $\\vec{AP} = ${second}\\vec{AB}$：\n\n$$\\vec{OP} = \\mathbf{a} + ${second}(\\mathbf{b} - \\mathbf{a}) = ${first}\\mathbf{a} + ${second}\\mathbf{b}$$\n\n**检验。**$AB$ 上的点的系数之和为 $1$，这里正是如此：\n\n$$${first} + ${second} = 1$$\n\n边的其余部分是 $\\vec{PB} = \\mathbf{b} - \\vec{OP}$，所以两段之比正是所给的比：\n\n$$\\vec{PB} = ${first}(\\mathbf{b} - \\mathbf{a}), \\quad AP : PB = ${second} : ${first} = ${p} : ${q}$$`,
            ],
          ),
          [
            [
              `$${second}\\mathbf{a} + ${first}\\mathbf{b}$`,
              "The fractions are swapped: each end gets the share of the part on the far side of $P$, so $\\mathbf{a}$ gets $PB : AB$.",
              "两个分数对调了：每个端点的系数是 $P$ 另一侧那一段的份额，所以 $\\mathbf{a}$ 的系数是 $PB : AB$。",
            ],
            [
              `$${first}\\mathbf{a} - ${second}\\mathbf{b}$`,
              "Expanding $\\mathbf{a} + k(\\mathbf{b} - \\mathbf{a})$ gives $+k\\mathbf{b}$; the minus sign belongs to the $\\mathbf{a}$ inside the bracket.",
              "展开 $\\mathbf{a} + k(\\mathbf{b} - \\mathbf{a})$ 得 $+k\\mathbf{b}$；负号属于括号里的 $\\mathbf{a}$。",
            ],
            [
              `$${p}\\mathbf{a} + ${q}\\mathbf{b}$`,
              "The ratio numbers are not the coefficients; they must be divided by the whole and their roles swapped, so that the coefficients add to $1$.",
              "比的数不是系数；要除以总份数并交换位置，使系数之和为 $1$。",
            ],
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
        "A unit vector carries only a direction, so scaling it by a number gives a vector of that length in that direction. This is how a direction and a length combine into components.\n\nFor length $10$ along $\\langle 3, 4 \\rangle$: the magnitude is $5$, so multiply by $10 \\div 5 = 2$ to get $\\langle 6, 8 \\rangle$. Check: $\\sqrt{36 + 64} = 10$, and $6 : 8 = 3 : 4$, so the direction is unchanged.\n\n> **Watch out.** Divide by the magnitude before multiplying by the new length. $10\\langle 3, 4 \\rangle = \\langle 30, 40 \\rangle$ points the right way but has length $50$.",
        "单位向量只含方向，所以乘一个数就得到这个方向上这个长度的向量。方向和长度就是这样合成分量的。\n\n沿 $\\langle 3, 4 \\rangle$ 方向、长度为 $10$：模是 $5$，所以乘 $10 \\div 5 = 2$，得 $\\langle 6, 8 \\rangle$。检验：$\\sqrt{36 + 64} = 10$，且 $6 : 8 = 3 : 4$，方向不变。\n\n> **注意。** 先除以模长，再乘以新长度。$10\\langle 3, 4 \\rangle = \\langle 30, 40 \\rangle$ 方向对，但长度是 $50$。",
      ],
      (rng) => {
        const [a, b, c] = rng.pick(triples);
        const len = c * rng.int(2, 6);
        const k = len / c;
        return reasoned(
          chooseFilled(
            rng,
            [
              `Find the vector of magnitude ${len} in the same direction as $${vec(a, b)}$.`,
              `求与 $${vec(a, b)}$ 同方向、模为 ${len} 的向量。`,
            ],
            vec(a * k, b * k),
            [vec(a * len, b * len), vec(b * k, a * k), vec(a + len, b + len)],
            [
              `**Step 1: Find the magnitude.** $\\|${vec(a, b)}\\| = \\sqrt{${a}^{2} + ${b}^{2}} = \\sqrt{${a * a + b * b}} = ${c}$.\n\n**Step 2: Scale to the new length.** Dividing by ${c} gives a unit vector, and multiplying that by ${len} gives length ${len}, so multiply by $${len} \\div ${c} = ${k}$:\n\n$$${k}${vec(a, b)} = ${vec(a * k, b * k)}$$\n\n**Check.** The length is $\\sqrt{${a * k}^{2} + ${b * k}^{2}} = \\sqrt{${(a * k) ** 2 + (b * k) ** 2}} = ${len}$, and the components keep the ratio $${a} : ${b}$, so the direction is unchanged.`,
              `**第一步：求模长。**$\\|${vec(a, b)}\\| = \\sqrt{${a}^{2} + ${b}^{2}} = \\sqrt{${a * a + b * b}} = ${c}$。\n\n**第二步：伸缩到新长度。**除以 ${c} 得到单位向量，再乘 ${len} 得到长度 ${len}，所以乘 $${len} \\div ${c} = ${k}$：\n\n$$${k}${vec(a, b)} = ${vec(a * k, b * k)}$$\n\n**检验。**长度是 $\\sqrt{${a * k}^{2} + ${b * k}^{2}} = \\sqrt{${(a * k) ** 2 + (b * k) ** 2}} = ${len}$，且分量之比仍是 $${a} : ${b}$，方向不变。`,
            ],
          ),
          [
            [
              `$${vec(a * len, b * len)}$`,
              `This multiplies by ${len} without first dividing by the magnitude ${c}, so its length is ${c * len}.`,
              `这直接乘了 ${len}，没有先除以模长 ${c}，所以长度是 ${c * len}。`,
            ],
            [
              `$${vec(b * k, a * k)}$`,
              "The components are swapped, so this vector points in a different direction.",
              "分量对调了，所以这个向量的方向不同。",
            ],
            [
              `$${vec(a + len, b + len)}$`,
              "Adding the length to each component does not scale the vector; it changes its direction and gives the wrong length.",
              "给每个分量加上长度并不是伸缩向量；这会改变方向，长度也不对。",
            ],
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
        "A vector gives the change from its start to its end. So the end point is the start point plus the components, which reverses the subtraction used to find the vector.\n\nFor $\\vec{AB} = \\langle -4, 6 \\rangle$ and $A = (3, -1)$: $B = (3 + (-4), -1 + 6) = (-1, 5)$. Check: $\\vec{AB} = \\langle -1 - 3, 5 - (-1) \\rangle = \\langle -4, 6 \\rangle$.\n\n> **Watch out.** Add the components to $A$. Subtracting them gives the start of a vector that ends at $A$, the point behind $A$ rather than ahead of it.",
        "向量给出从起点到终点的变化。所以终点是起点加分量，这正好反过来求向量时的减法。\n\n对 $\\vec{AB} = \\langle -4, 6 \\rangle$ 和 $A = (3, -1)$：$B = (3 + (-4), -1 + 6) = (-1, 5)$。检验：$\\vec{AB} = \\langle -1 - 3, 5 - (-1) \\rangle = \\langle -4, 6 \\rangle$。\n\n> **注意。** 把分量加到 $A$ 上。减去分量得到的是终点为 $A$ 的向量的起点，在 $A$ 的后面而不是前面。",
      ],
      (rng) => {
        const x = rng.int(-9, 9);
        const y = rng.int(-9, 9);
        const u = nz(rng, 12);
        const v = nz(rng, 12);
        return reasoned(
          chooseFilled(
            rng,
            [`$\\vec{AB} = ${vec(u, v)}$ and $A = (${x}, ${y})$. Find $B$.`, `$\\vec{AB} = ${vec(u, v)}$，$A = (${x}, ${y})$。求 $B$。`],
            `(${x + u}, ${y + v})`,
            [`(${x - u}, ${y - v})`, `(${u - x}, ${v - y})`, `(${x + v}, ${y + u})`],
            [
              `**Step 1: Move across.** The $x$-component says how far $B$ is from $A$ across:\n\n$$${x} + ${paren(u)} = ${x + u}$$\n\n**Step 2: Move up.** The $y$-component says how far up:\n\n$$${y} + ${paren(v)} = ${y + v}$$\n\nSo $B = (${x + u}, ${y + v})$.\n\n**Check.** End minus start gives back the vector:\n\n$$\\vec{AB} = \\langle ${x + u} - ${paren(x)},\\ ${y + v} - ${paren(y)} \\rangle = ${vec(u, v)}$$`,
              `**第一步：横向移动。**$x$ 分量说明 $B$ 在 $A$ 横向多远处：\n\n$$${x} + ${paren(u)} = ${x + u}$$\n\n**第二步：纵向移动。**$y$ 分量说明纵向移动多少：\n\n$$${y} + ${paren(v)} = ${y + v}$$\n\n所以 $B = (${x + u}, ${y + v})$。\n\n**检验。**终点减起点，得回这个向量：\n\n$$\\vec{AB} = \\langle ${x + u} - ${paren(x)},\\ ${y + v} - ${paren(y)} \\rangle = ${vec(u, v)}$$`,
            ],
          ),
          [
            [
              `$(${x - u}, ${y - v})$`,
              "This subtracts the components from $A$, which gives the start of a vector ending at $A$.",
              "这是从 $A$ 减去分量，得到的是终点为 $A$ 的向量的起点。",
            ],
            [
              `$(${u - x}, ${v - y})$`,
              "This takes $A$ away from the vector; the end point is $A$ plus the vector.",
              "这是用向量减去 $A$；终点应是 $A$ 加上向量。",
            ],
            [
              `$(${x + v}, ${y + u})$`,
              "The components are swapped: the first one moves $x$ and the second moves $y$.",
              "两个分量对调了：第一个分量改变 $x$，第二个改变 $y$。",
            ],
          ],
        );
      },
    ),
  ],
  "calculating-the-magnitude-of-cartesian-vectors-in-2d": [
    skill(
      "the-distance-between-two-points-as-a-magnitude",
      ["The distance between points as a magnitude", "两点间距离就是模"],
      [
        "The distance between two points is the magnitude of the vector joining them. So subtract the coordinates first, and then take the square root of the sum of the squares.\n\nFor $P(1, -2)$ and $Q(7, 6)$: $\\vec{PQ} = \\langle 6, 8 \\rangle$, so the distance is $\\sqrt{36 + 64} = 10$. Check: moving from $P$ by $\\langle 6, 8 \\rangle$ reaches $(7, 6)$, which is $Q$.\n\n> **Watch out.** Subtract the coordinates before squaring. The magnitudes of the two position vectors, $\\|\\vec{OP}\\|$ and $\\|\\vec{OQ}\\|$, do not give the distance between the points.",
        "两点间的距离就是连接它们的向量的模。所以先把坐标相减，再求平方和的平方根。\n\n对 $P(1, -2)$ 和 $Q(7, 6)$：$\\vec{PQ} = \\langle 6, 8 \\rangle$，所以距离是 $\\sqrt{36 + 64} = 10$。检验：从 $P$ 按 $\\langle 6, 8 \\rangle$ 移动，到达 $(7, 6)$，正是 $Q$。\n\n> **注意。** 先把坐标相减，再平方。两个位置向量的模 $\\|\\vec{OP}\\|$ 和 $\\|\\vec{OQ}\\|$ 并不给出两点间的距离。",
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
          [
            `**Step 1: Find the vector.** Subtract the coordinates of $P$ from those of $Q$:\n\n$$\\vec{PQ} = \\langle ${x + sx * a} - ${paren(x)},\\ ${y + sy * b} - ${paren(y)} \\rangle = ${vec(sx * a, sy * b)}$$\n\n**Step 2: Take the magnitude.** Square the components, add, and take the square root:\n\n$$\\|\\vec{PQ}\\| = \\sqrt{(${sx * a})^{2} + (${sy * b})^{2}} = \\sqrt{${a * a + b * b}} = ${c}$$\n\n**Check.** $${c}^{2} = ${c * c} = ${a * a} + ${b * b}$, so the distance fits the components of $\\vec{PQ}$.`,
            `**第一步：求向量。**用 $Q$ 的坐标减去 $P$ 的坐标：\n\n$$\\vec{PQ} = \\langle ${x + sx * a} - ${paren(x)},\\ ${y + sy * b} - ${paren(y)} \\rangle = ${vec(sx * a, sy * b)}$$\n\n**第二步：求模。**把分量平方、相加，再开平方：\n\n$$\\|\\vec{PQ}\\| = \\sqrt{(${sx * a})^{2} + (${sy * b})^{2}} = \\sqrt{${a * a + b * b}} = ${c}$$\n\n**检验。**$${c}^{2} = ${c * c} = ${a * a} + ${b * b}$，距离与 $\\vec{PQ}$ 的分量相符。`,
          ],
        );
      },
    ),
  ],
  "calculating-the-direction-of-cartesian-vectors-in-2d": [
    {
      ...skill(
        "bearings-from-the-direction-angle",
        ["Bearings from the direction angle", "由方向角求方位角"],
        [
          "A bearing is measured clockwise from north, while a direction angle is measured counterclockwise from east. So the bearing is $90^{\\circ}$ minus the direction angle, adjusted by a full turn if negative.\n\nFor direction angle $150^\\circ$: $90 - 150 = -60$, and $-60 + 360 = 300$, so the bearing is $300^\\circ$. Check: $150^\\circ$ points up and to the left, which is north-west, and a bearing of $300^\\circ$ lies between west at $270^\\circ$ and north at $360^\\circ$.\n\n> **Watch out.** The two angles start in different places and turn opposite ways, so the bearing is neither the direction angle itself nor $90^\\circ$ more than it.",
          "方位角从正北顺时针量，方向角从正东逆时针量。所以方位角是 90 度减方向角，若为负再加一整圈。\n\n对方向角 $150^\\circ$：$90 - 150 = -60$，$-60 + 360 = 300$，所以方位角是 $300^\\circ$。检验：$150^\\circ$ 指向左上方，即西北；方位角 $300^\\circ$ 在正西 $270^\\circ$ 与正北 $360^\\circ$ 之间。\n\n> **注意。** 两种角的起始边不同，转向也相反，所以方位角既不是方向角本身，也不是方向角加 $90^\\circ$。",
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
              `**Step 1: Change the starting line.** North is at $90^{\\circ}$ on the direction scale, and a bearing turns the other way, clockwise, so subtract the direction angle from $90$:\n\n$$90 - ${angle} = ${90 - angle}$$\n\n**Step 2: Bring it into range.** ${90 - angle < 0 ? `The result is negative, so add a full turn:\n\n$$${90 - angle} + 360 = ${bearing}$$` : `The result is already from $0$ up to $360$, so the bearing is $${bearing}^{\\circ}$.`}\n\n**Check.** Turning the bearing back the same way gives the direction angle: $90 - ${bearing} = ${90 - bearing}$${90 - bearing < 0 ? `, and $${90 - bearing} + 360 = ${angle}$` : ""}.`,
              `**第一步：换起始边。**在方向角的刻度上，正北是 $90^{\\circ}$，而方位角反向（顺时针）转，所以用 $90$ 减方向角：\n\n$$90 - ${angle} = ${90 - angle}$$\n\n**第二步：调到范围内。**${90 - angle < 0 ? `结果为负，加一整圈：\n\n$$${90 - angle} + 360 = ${bearing}$$` : `结果已在 $0$ 到 $360$ 之间，所以方位角是 $${bearing}^{\\circ}$。`}\n\n**检验。**把方位角按同样的方法换回，得到方向角：$90 - ${bearing} = ${90 - bearing}$${90 - bearing < 0 ? `，$${90 - bearing} + 360 = ${angle}$` : ""}。`,
            ],
          );
        },
      ),
      figure: precalculusDrawings2["calculating-the-direction-of-cartesian-vectors-in-2d#bearings-from-the-direction-angle"],
    },
  ],
  "calculating-the-components-of-cartesian-vectors-in-2d": [
    {
      ...skill(
        "components-across-the-quadrants",
        ["Components across the quadrants", "各象限的分量"],
        [
          "The formulas $x = r\\cos\\theta$ and $y = r\\sin\\theta$ give the signs by themselves, as cosine and sine carry them. A second quadrant angle therefore gives a negative $x$ and a positive $y$.\n\nFor magnitude $4$ at $300^\\circ$: $x = 4\\cos 300^\\circ = 2$ and $y = 4\\sin 300^\\circ = -2\\sqrt{3}$. Check: $4 + 12 = 16 = 4^2$, and $x > 0$, $y < 0$ is Quadrant IV, where $300^\\circ$ lies.\n\n> **Watch out.** Working with the reference angle $60^\\circ$ alone gives $\\langle 2, 2\\sqrt{3} \\rangle$, which points at $60^\\circ$. Use the angle itself, or put back the signs of its quadrant.",
          "公式 $x = r\\cos\\theta$ 和 $y = r\\sin\\theta$ 本身就给出符号，因为余弦和正弦带符号。所以第二象限的角使 $x$ 为负、$y$ 为正。\n\n对模为 $4$、方向角为 $300^\\circ$：$x = 4\\cos 300^\\circ = 2$，$y = 4\\sin 300^\\circ = -2\\sqrt{3}$。检验：$4 + 12 = 16 = 4^2$，且 $x > 0$、$y < 0$ 在第四象限，正是 $300^\\circ$ 所在。\n\n> **注意。** 只用参考角 $60^\\circ$ 计算会得到 $\\langle 2, 2\\sqrt{3} \\rangle$，它指向 $60^\\circ$。要用角本身，或补上所在象限的符号。",
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
          const quadrant = row[0] === 120 ? ["II", "二"] : row[0] === 240 ? ["III", "三"] : row[0] === 300 ? ["IV", "四"] : ["I", "一"];
          return reasoned(
            chooseFilled(
              rng,
              [
                `A vector has magnitude ${r} and direction angle $${row[0]}^{\\circ}$. Find its components.`,
                `一个向量的模是 ${r}，方向角是 $${row[0]}^{\\circ}$。求它的分量。`,
              ],
              `\\langle ${xText}, ${yText} \\rangle`,
              [`\\langle ${-xText}, ${yText} \\rangle`, `\\langle ${xText}, ${flip} \\rangle`, `\\langle ${yText}, ${xText} \\rangle`],
              [
                `**Step 1: Find x.** Cosine gives the horizontal component, sign included:\n\n$$x = ${r}\\cos ${row[0]}^{\\circ} = ${xText}$$\n\n**Step 2: Find y.** Sine gives the vertical component:\n\n$$y = ${r}\\sin ${row[0]}^{\\circ} = ${yText}$$\n\n**Check.** The length is $\\sqrt{${half * half} + ${3 * half * half}} = \\sqrt{${r * r}} = ${r}$, and the signs of the components put the vector in Quadrant ${quadrant[0]}, where $${row[0]}^{\\circ}$ lies.`,
                `**第一步：求 x。**余弦给出水平分量，连同符号：\n\n$$x = ${r}\\cos ${row[0]}^{\\circ} = ${xText}$$\n\n**第二步：求 y。**正弦给出竖直分量：\n\n$$y = ${r}\\sin ${row[0]}^{\\circ} = ${yText}$$\n\n**检验。**长度是 $\\sqrt{${half * half} + ${3 * half * half}} = \\sqrt{${r * r}} = ${r}$，且分量的符号使向量在第${quadrant[1]}象限，正是 $${row[0]}^{\\circ}$ 所在。`,
              ],
            ),
            [
              [
                `$\\langle ${-xText}, ${yText} \\rangle$`,
                `The sign of $x$ is wrong: $\\cos ${row[0]}^{\\circ}$ is ${xText < 0 ? "negative" : "positive"}.`,
                `$x$ 的符号错了：$\\cos ${row[0]}^{\\circ}$ 为${xText < 0 ? "负" : "正"}。`,
              ],
              [
                `$\\langle ${xText}, ${flip} \\rangle$`,
                `The sign of $y$ is wrong: $\\sin ${row[0]}^{\\circ}$ is ${row[2] < 0 ? "negative" : "positive"}.`,
                `$y$ 的符号错了：$\\sin ${row[0]}^{\\circ}$ 为${row[2] < 0 ? "负" : "正"}。`,
              ],
              [
                `$\\langle ${yText}, ${xText} \\rangle$`,
                "The components are swapped: cosine gives $x$ and sine gives $y$.",
                "两个分量对调了：余弦给出 $x$，正弦给出 $y$。",
              ],
            ],
          );
        },
      ),
      figure: precalculusDrawings2["calculating-the-components-of-cartesian-vectors-in-2d#components-across-the-quadrants"],
    },
  ],
  "velocity-and-acceleration-for-plane-motion": [
    skill(
      "velocity-after-steady-acceleration",
      ["Velocity after steady acceleration", "匀加速后的速度"],
      [
        "Constant acceleration adds the same vector to the velocity every second. So the new velocity is the old one plus time times the acceleration, worked out one component at a time.\n\nFor $\\langle 3, -2 \\rangle$ m/s with acceleration $\\langle 1, 4 \\rangle$ m/s$^2$ for $5$ s: the change is $5\\langle 1, 4 \\rangle = \\langle 5, 20 \\rangle$, so the velocity becomes $\\langle 8, 18 \\rangle$ m/s. Check: the change $\\langle 5, 20 \\rangle$ divided by $5$ s is $\\langle 1, 4 \\rangle$, the acceleration.\n\n> **Watch out.** Multiply the acceleration by the time before adding. The starting velocity is added once and is not multiplied.",
        "恒定的加速度每秒给速度加上同一个向量。所以新速度是原速度加时间乘加速度，逐个分量计算。\n\n对速度 $\\langle 3, -2 \\rangle$ 米/秒、加速度 $\\langle 1, 4 \\rangle$ 米/秒$^2$、历时 $5$ 秒：变化量是 $5\\langle 1, 4 \\rangle = \\langle 5, 20 \\rangle$，所以速度变为 $\\langle 8, 18 \\rangle$ 米/秒。检验：变化量 $\\langle 5, 20 \\rangle$ 除以 $5$ 秒得 $\\langle 1, 4 \\rangle$，正是加速度。\n\n> **注意。** 先用加速度乘时间，再相加。初速度只加一次，不乘时间。",
      ],
      (rng) => {
        const u = rng.int(-9, 9);
        const v = rng.int(-9, 9);
        const a = nz(rng, 5);
        const b = nz(rng, 5);
        const t = rng.int(2, 9);
        return reasoned(
          chooseFilled(
            rng,
            [
              `An object has velocity $${vec(u, v)}$ m/s and constant acceleration $${vec(a, b)}$ m/s$^2$. What is its velocity after ${t} s?`,
              `物体的速度是 $${vec(u, v)}$ 米/秒，恒定加速度是 $${vec(a, b)}$ 米/秒$^2$。${t} 秒后速度是多少？`,
            ],
            vec(u + t * a, v + t * b),
            [vec(u + a, v + b), vec(t * u + a, t * v + b), vec(u - t * a, v - t * b)],
            [
              `**Step 1: Find the change in velocity.** The acceleration acts for ${t} s:\n\n$$${t}${vec(a, b)} = ${vec(t * a, t * b)}$$\n\n**Step 2: Add it to the starting velocity.**\n\n$$${vec(u, v)} + ${vec(t * a, t * b)} = ${vec(u + t * a, v + t * b)}$$\n\n**Check.** The new velocity minus the old one is $${vec(t * a, t * b)}$, and dividing by ${t} s gives $${vec(a, b)}$, the acceleration.`,
              `**第一步：求速度的变化量。**加速度作用了 ${t} 秒：\n\n$$${t}${vec(a, b)} = ${vec(t * a, t * b)}$$\n\n**第二步：加到初速度上。**\n\n$$${vec(u, v)} + ${vec(t * a, t * b)} = ${vec(u + t * a, v + t * b)}$$\n\n**检验。**新速度减原速度是 $${vec(t * a, t * b)}$，除以 ${t} 秒得 $${vec(a, b)}$，正是加速度。`,
            ],
          ),
          [
            [
              `$${vec(u + a, v + b)}$`,
              `This adds the acceleration only once, but it acts for all $${t}$ seconds.`,
              `这里只加了一次加速度，但它作用了整整 $${t}$ 秒。`,
            ],
            [
              `$${vec(t * u + a, t * v + b)}$`,
              "Time multiplies the acceleration, not the starting velocity.",
              "时间乘的是加速度，不是初速度。",
            ],
            [
              `$${vec(u - t * a, v - t * b)}$`,
              "Acceleration adds to the velocity, so the sign is wrong.",
              "加速度是加到速度上的，所以符号错了。",
            ],
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
        "Displacement is velocity times time, so dividing the displacement by the time gives the constant velocity needed. The displacement itself is the end point minus the start point.\n\nFrom $(1, 2)$ to $(13, -6)$ in $4$ seconds: the displacement is $\\langle 12, -8 \\rangle$, so the velocity is $\\langle 3, -2 \\rangle$ per second. Check: $4\\langle 3, -2 \\rangle = \\langle 12, -8 \\rangle$, and $(1 + 12, 2 - 8) = (13, -6)$.\n\n> **Watch out.** Subtract the start from the end before dividing. Dividing the end point alone by the time ignores where the motion began.",
        "位移是速度乘时间，所以位移除以时间得到需要的恒定速度。位移本身是终点减起点。\n\n从 $(1, 2)$ 到 $(13, -6)$ 用了 $4$ 秒：位移是 $\\langle 12, -8 \\rangle$，所以速度是每秒 $\\langle 3, -2 \\rangle$。检验：$4\\langle 3, -2 \\rangle = \\langle 12, -8 \\rangle$，且 $(1 + 12, 2 - 8) = (13, -6)$。\n\n> **注意。** 先用终点减起点，再除以时间。只把终点除以时间，就忽略了运动的起点。",
      ],
      (rng) => {
        const t = rng.int(2, 10);
        const u = nz(rng, 9);
        const v = nz(rng, 9);
        const x = rng.int(-9, 9);
        const y = rng.int(-9, 9);
        return reasoned(
          chooseFilled(
            rng,
            [
              `A drone flies in a straight line at constant velocity from $(${x}, ${y})$ to $(${x + t * u}, ${y + t * v})$ in ${t} seconds. What is its velocity?`,
              `无人机以恒定速度沿直线飞行，从 $(${x}, ${y})$ 到 $(${x + t * u}, ${y + t * v})$ 用了 ${t} 秒。它的速度是多少？`,
            ],
            vec(u, v),
            [vec(t * u, t * v), vec(-u, -v), vec(v, u) === vec(u, v) ? vec(u + 1, v) : vec(v, u)],
            [
              `**Step 1: Find the displacement.** End point minus start point:\n\n$$\\langle ${x + t * u} - ${paren(x)},\\ ${y + t * v} - ${paren(y)} \\rangle = ${vec(t * u, t * v)}$$\n\n**Step 2: Divide by the time.** A constant velocity is the displacement per second:\n\n$$${vec(t * u, t * v)} \\div ${t} = ${vec(u, v)}$$\n\n**Check.** Flying at $${vec(u, v)}$ for ${t} s from $(${x}, ${y})$ reaches the end point:\n\n$$(${x} + ${paren(t * u)},\\ ${y} + ${paren(t * v)}) = (${x + t * u}, ${y + t * v})$$`,
              `**第一步：求位移。**终点减起点：\n\n$$\\langle ${x + t * u} - ${paren(x)},\\ ${y + t * v} - ${paren(y)} \\rangle = ${vec(t * u, t * v)}$$\n\n**第二步：除以时间。**恒定速度就是每秒的位移：\n\n$$${vec(t * u, t * v)} \\div ${t} = ${vec(u, v)}$$\n\n**检验。**以 $${vec(u, v)}$ 从 $(${x}, ${y})$ 飞 ${t} 秒，到达终点：\n\n$$(${x} + ${paren(t * u)},\\ ${y} + ${paren(t * v)}) = (${x + t * u}, ${y + t * v})$$`,
            ],
          ),
          [
            [
              `$${vec(t * u, t * v)}$`,
              "That is the whole displacement: a velocity is displacement per second, so divide by the time.",
              "这是总位移：速度是每秒的位移，所以要除以时间。",
            ],
            [
              `$${vec(-u, -v)}$`,
              "The direction is reversed: displacement is the end point minus the start.",
              "方向反了：位移是终点减起点。",
            ],
            vec(v, u) === vec(u, v)
              ? [
                  `$${vec(u + 1, v)}$`,
                  "The first component is off: divide the change in $x$ by the time.",
                  "第一个分量不对：用 $x$ 的变化量除以时间。",
                ]
              : [
                  `$${vec(v, u)}$`,
                  "The components are swapped: the first one comes from the change in $x$.",
                  "两个分量弄反了：第一个分量来自 $x$ 的变化量。",
                ],
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
        "A matrix with $m$ rows and $n$ columns has $mn$ entries. So a number of entries can be arranged in as many shapes as it has ordered factor pairs.\n\n> **Watch out.** Count $2 \\times 3$ and $3 \\times 2$ as two shapes, and do not forget the shapes with a single row or a single column, such as $1 \\times 6$ and $6 \\times 1$.",
        "$m$ 行 $n$ 列的矩阵有 $mn$ 个元素。所以一个元素个数有多少组有序因数对，就能排成多少种形状。\n\n> **注意。** $2 \\times 3$ 和 $3 \\times 2$ 算两种形状，也不要漏掉只有一行或一列的形状，比如 $1 \\times 6$ 和 $6 \\times 1$。",
      ],
      (rng) => {
        const n = rng.pick([
          4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 26, 27, 28, 30, 32, 33, 34, 35, 36, 38, 39, 40, 42, 44, 45, 48, 49, 50,
          60,
        ]);
        const factors = Array.from({ length: n }, (_, i) => i + 1).filter((f) => n % f === 0);
        const count = factors.length;
        const shapes = factors.map((f) => `${f} \\times ${n / f}`).join(", ");
        return whole(
          [
            `A matrix has exactly ${n} entries. How many different shapes $m \\times n$ could it have, counting $2 \\times 3$ and $3 \\times 2$ as different?`,
            `一个矩阵恰有 ${n} 个元素。它可能有多少种形状 $m \\times n$（$2 \\times 3$ 和 $3 \\times 2$ 算不同）？`,
          ],
          count,
          [Math.ceil(count / 2) === count ? count + 1 : Math.ceil(count / 2), count + 1, count - 1],
          [
            `**Step 1: Pick the number of rows.** The number of rows $m$ must divide $${n}$, and then the number of columns is $${n} \\div m$. So each factor of $${n}$ gives exactly one shape.\n\n**Step 2: Count the factors.** The factors of $${n}$ are $${factors.join(", ")}$. There are $${count}$ of them, so there are $${count}$ shapes.\n\n**Check.** List the shapes: $${shapes}$. Each multiplies out to $${n}$, and there are $${count}$ of them.`,
            `**第一步：选行数。**行数 $m$ 必须整除 $${n}$，列数就是 $${n} \\div m$。所以 $${n}$ 的每个因数恰好对应一种形状。\n\n**第二步：数因数。**$${n}$ 的因数是 $${factors.join(", ")}$，共 $${count}$ 个，所以有 $${count}$ 种形状。\n\n**检验。**列出这些形状：$${shapes}$。每一种的乘积都是 $${n}$，共 $${count}$ 种。`,
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
        "The diagonal holds the entries where the row and column numbers match. So a rule for $a_{ij}$ gives each diagonal entry by setting $i = j$, and their sum is called the trace.\n\n> **Watch out.** The constant term is in every diagonal entry, so it is added $n$ times, not once.",
        "对角线上是行号和列号相同的元素。所以由 $a_{ij}$ 的规则，令 $i = j$ 得到每个对角元素，它们的和叫做迹。\n\n> **注意。** 常数项在每个对角元素里都有，所以要加 $n$ 次，而不是一次。",
      ],
      (rng) => {
        const n = rng.int(2, 6);
        const p = rng.int(1, 6);
        const q = rng.int(1, 6);
        const c = rng.int(-6, 6);
        const diagonal = Array.from({ length: n }, (_, i) => (p + q) * (i + 1) + c);
        const trace = diagonal.reduce((a, b) => a + b, 0);
        const part = ((p + q) * n * (n + 1)) / 2;
        return integer(
          [
            `A $${n} \\times ${n}$ matrix has entries $a_{ij} = ${p}i + ${q}j${c < 0 ? ` - ${-c}` : ` + ${c}`}$. Find the sum of its diagonal entries.`,
            `$${n} \\times ${n}$ 矩阵的元素为 $a_{ij} = ${p}i + ${q}j${c < 0 ? ` - ${-c}` : ` + ${c}`}$。求对角元素之和。`,
          ],
          trace,
          [trace - n * c, (p + q + c) * n, trace + p + q],
          [
            `**Step 1: Find the diagonal entries.** On the diagonal $j = i$, so $a_{ii} = ${p}i + ${q}i${c < 0 ? ` - ${-c}` : ` + ${c}`} = ${p + q}i${c < 0 ? ` - ${-c}` : ` + ${c}`}$. For $i = 1$ to $${n}$ these are $${diagonal.join(", ")}$.\n\n**Step 2: Add them.** Their sum is $${trace}$.\n\n**Check.** Add the two parts separately. The terms $${p + q}i$ give $${p + q}(1 + \\dots + ${n}) = ${p + q} \\cdot ${(n * (n + 1)) / 2} = ${part}$, and the constant gives $${n} \\cdot ${paren(c)} = ${n * c}$. Together $${part}${n * c < 0 ? ` - ${-n * c}` : ` + ${n * c}`} = ${trace}$.`,
            `**第一步：求对角元素。**对角线上 $j = i$，所以 $a_{ii} = ${p}i + ${q}i${c < 0 ? ` - ${-c}` : ` + ${c}`} = ${p + q}i${c < 0 ? ` - ${-c}` : ` + ${c}`}$。$i$ 从 $1$ 到 $${n}$ 时依次是 $${diagonal.join(", ")}$。\n\n**第二步：相加。**它们的和是 $${trace}$。\n\n**检验。**把两部分分开相加。$${p + q}i$ 各项之和是 $${p + q}(1 + \\dots + ${n}) = ${p + q} \\cdot ${(n * (n + 1)) / 2} = ${part}$，常数项之和是 $${n} \\cdot ${paren(c)} = ${n * c}$。合起来 $${part}${n * c < 0 ? ` - ${-n * c}` : ` + ${n * c}`} = ${trace}$。`,
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
        "Matrices are equal only when each entry matches, so an unknown inside a sum is found from the one entry that contains it. The other entries are a check on the equation.\n\n> **Watch out.** After subtracting, divide by the coefficient of $x$: $3x = 12$ gives $x = 4$, not $12$.",
        "每个元素都相同时矩阵才相等，所以和中的未知数由含它的那个元素求出。其他元素用来检验方程。\n\n> **注意。** 相减之后还要除以 $x$ 的系数：$3x = 12$ 得 $x = 4$，而不是 $12$。",
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
            `**Step 1: Use the entry with $x$.** Only the top left entry contains $x$, and matching entries are added, so $${a} + ${m}x = ${a + m * x}$.\n\n**Step 2: Solve.** Subtracting gives $${m}x = ${a + m * x} - ${paren(a)} = ${m * x}$, and dividing by $${m}$ gives $x = ${x}$.\n\n**Check.** With $x = ${x}$ the top left entry is $${a} + ${m} \\cdot ${paren(x)} = ${a + m * x}$. The other entries agree as well: $${b} + ${paren(p)} = ${b + p}$, $${c} + ${paren(q)} = ${c + q}$ and $${d} + 1 = ${d + 1}$.`,
            `**第一步：用含 $x$ 的元素。**只有左上元素含 $x$，对应元素相加，所以 $${a} + ${m}x = ${a + m * x}$。\n\n**第二步：求解。**相减得 $${m}x = ${a + m * x} - ${paren(a)} = ${m * x}$，再除以 $${m}$ 得 $x = ${x}$。\n\n**检验。**$x = ${x}$ 时左上元素是 $${a} + ${m} \\cdot ${paren(x)} = ${a + m * x}$。其他元素也都相符：$${b} + ${paren(p)} = ${b + p}$，$${c} + ${paren(q)} = ${c + q}$，$${d} + 1 = ${d + 1}$。`,
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
        "Additive inverses let matrix equations be solved like ordinary ones. Subtracting $A$ from both sides of $A + X = B$ leaves $X = B - A$, and the order of this subtraction matters.\n\n> **Watch out.** Subtract the given matrix from the right side, $X = B - A$, not $A - B$; the second has every sign reversed.",
        "有了加法逆元，矩阵方程可以像普通方程一样解。$A + X = B$ 两边减 $A$，得 $X = B - A$，减法的次序很重要。\n\n> **注意。** 要用右边减去给定矩阵，$X = B - A$，而不是 $A - B$；后者每个符号都反了。",
      ],
      (rng) => {
        const [a, b, c, d] = [nz(rng, 9), nz(rng, 9), nz(rng, 9), nz(rng, 9)];
        const [e, f, g, h] = [nz(rng, 9), nz(rng, 9), nz(rng, 9), nz(rng, 9)];
        return reasoned(
          chooseFilled(
            rng,
            [
              `Find $X$ if $${mat([a, b], [c, d])} + X = ${mat([e, f], [g, h])}$.`,
              `求 $X$：$${mat([a, b], [c, d])} + X = ${mat([e, f], [g, h])}$。`,
            ],
            mat([e - a, f - b], [g - c, h - d]),
            [mat([a - e, b - f], [c - g, d - h]), mat([e + a, f + b], [g + c, h + d]), mat([e - a, g - c], [f - b, h - d])],
            [
              `**Step 1: Subtract.** Subtracting the given matrix from both sides leaves $X$ equal to the right side minus the given matrix.\n\n**Step 2: Work out each entry.** Entry by entry, $${e} - ${paren(a)} = ${e - a}$, $${f} - ${paren(b)} = ${f - b}$, $${g} - ${paren(c)} = ${g - c}$ and $${h} - ${paren(d)} = ${h - d}$.\n\n**Check.** Add $X$ back to the given matrix: $${a} + ${paren(e - a)} = ${e}$, $${b} + ${paren(f - b)} = ${f}$, $${c} + ${paren(g - c)} = ${g}$ and $${d} + ${paren(h - d)} = ${h}$. These are the entries of the right side.`,
              `**第一步：相减。**两边同时减去给定矩阵，得 $X$ 等于右边减去给定矩阵。\n\n**第二步：逐个计算。**逐个元素地，$${e} - ${paren(a)} = ${e - a}$，$${f} - ${paren(b)} = ${f - b}$，$${g} - ${paren(c)} = ${g - c}$，$${h} - ${paren(d)} = ${h - d}$。\n\n**检验。**把 $X$ 加回给定矩阵：$${a} + ${paren(e - a)} = ${e}$，$${b} + ${paren(f - b)} = ${f}$，$${c} + ${paren(g - c)} = ${g}$，$${d} + ${paren(h - d)} = ${h}$。这正是右边的元素。`,
            ],
          ),
          [
            [
              `$${mat([a - e, b - f], [c - g, d - h])}$`,
              "The subtraction is the wrong way around: it is the right side minus the given matrix.",
              "减法次序反了：应该是右边减去给定矩阵。",
            ],
            [
              `$${mat([e + a, f + b], [g + c, h + d])}$`,
              "This adds the given matrix, but to undo an addition you subtract it.",
              "这里加上了给定矩阵，但要抵消加法应该减去它。",
            ],
            [
              `$${mat([e - a, g - c], [f - b, h - d])}$`,
              "The rows and columns are swapped: each entry stays in its own position.",
              "行和列弄反了：每个元素都留在原来的位置。",
            ],
          ],
        );
      },
    ),
  ],
  "scalar-multiplication-of-matrices": [
    skill(
      "the-scalar-from-the-entries",
      ["The scalar from the entries", "由元素求标量"],
      [
        "If one matrix is a scalar multiple of another, every entry changes by the same factor. So any nonzero entry gives the scalar, and the others must agree with it.\n\n> **Watch out.** Divide the new entry by the old one, not the other way around, and keep the sign: $-12 \\div 3 = -4$.",
        "如果一个矩阵是另一个的标量倍，每个元素都变化相同的倍数。所以任一非零元素给出标量，其他元素必须与之一致。\n\n> **注意。** 用新元素除以原元素，不要反过来，并且保留符号：$-12 \\div 3 = -4$。",
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
          [
            `**Step 1: Pick an entry.** The top left entry $${a}$ becomes $${k * a}$, so $k \\cdot ${paren(a)} = ${k * a}$.\n\n**Step 2: Divide.** $k = ${k * a} \\div ${paren(a)} = ${k}$.\n\n**Check.** Multiply the other entries by $${k}$: $${k} \\cdot ${paren(b)} = ${k * b}$, $${k} \\cdot ${paren(c)} = ${k * c}$ and $${k} \\cdot ${paren(d)} = ${k * d}$. These match the right side.`,
            `**第一步：选一个元素。**左上元素 $${a}$ 变成了 $${k * a}$，所以 $k \\cdot ${paren(a)} = ${k * a}$。\n\n**第二步：相除。**$k = ${k * a} \\div ${paren(a)} = ${k}$。\n\n**检验。**把其他元素乘以 $${k}$：$${k} \\cdot ${paren(b)} = ${k * b}$，$${k} \\cdot ${paren(c)} = ${k * c}$，$${k} \\cdot ${paren(d)} = ${k * d}$。这些与右边相符。`,
          ],
        );
      },
    ),
  ],
  "zero-square-diagonal-and-identity-matrices": [
    skill(
      "powers-of-a-diagonal-matrix",
      ["Powers of a diagonal matrix", "对角矩阵的幂"],
      [
        "Multiplying diagonal matrices only multiplies their diagonal entries. So a power of a diagonal matrix raises each diagonal entry to that power, with no other work needed.\n\n> **Watch out.** A negative entry raised to an odd power stays negative: $(-2)^3 = -8$. The entries off the diagonal stay $0$.",
        "对角矩阵相乘时，只有对角元素相乘。所以对角矩阵的幂就是每个对角元素取这个幂，不需要其他计算。\n\n> **注意。** 负的元素取奇数次幂仍是负的：$(-2)^3 = -8$。对角线以外的元素仍是 $0$。",
      ],
      (rng) => {
        const a = rng.int(2, 5) * (rng.bool() ? 1 : -1);
        const b = rng.int(2, 5) * (rng.bool() ? 1 : -1);
        const n = rng.int(2, 4);
        return reasoned(
          chooseFilled(
            rng,
            [`Find $${mat([a, 0], [0, b])}^{${n}}$.`, `求 $${mat([a, 0], [0, b])}^{${n}}$。`],
            mat([a ** n, 0], [0, b ** n]),
            [mat([n * a, 0], [0, n * b]), mat([a ** n, b ** n], [b ** n, a ** n]), mat([a ** n + 1, 0], [0, b ** n])],
            [
              `**Step 1: Multiply diagonal matrices.** In a product of diagonal matrices, each entry off the diagonal is a sum of products that each contain a $0$, so it stays $0$, and each diagonal entry is the product of the diagonal entries.\n\n**Step 2: Raise the diagonal entries.** So each diagonal entry is raised to the power $${n}$: $(${a})^{${n}} = ${a ** n}$ and $(${b})^{${n}} = ${b ** n}$.\n\n**Check.** Work out the square row by column. The top left entry is $${a} \\cdot ${paren(a)} + 0 \\cdot 0 = ${a * a}$, the top right entry is $${a} \\cdot 0 + 0 \\cdot ${paren(b)} = 0$, and the bottom row is $0, ${b * b}$ in the same way. Each further factor multiplies the diagonal entries by $${a}$ and $${b}$ again, which reaches $${a ** n}$ and $${b ** n}$ after $${n}$ factors.`,
              `**第一步：对角矩阵相乘。**对角矩阵相乘时，对角线以外的每个元素都是一些含 $0$ 的乘积之和，所以仍是 $0$；每个对角元素是对角元素的乘积。\n\n**第二步：对角元素取幂。**所以每个对角元素取 ${n} 次幂：$(${a})^{${n}} = ${a ** n}$，$(${b})^{${n}} = ${b ** n}$。\n\n**检验。**按行乘列算出平方。左上元素是 $${a} \\cdot ${paren(a)} + 0 \\cdot 0 = ${a * a}$，右上元素是 $${a} \\cdot 0 + 0 \\cdot ${paren(b)} = 0$，同样地下面一行是 $0, ${b * b}$。每再乘一个因子，对角元素就再乘以 $${a}$ 和 $${b}$，乘满 $${n}$ 个因子得到 $${a ** n}$ 和 $${b ** n}$。`,
            ],
          ),
          [
            [
              `$${mat([n * a, 0], [0, n * b])}$`,
              `This multiplies the diagonal entries by $${n}$ instead of raising them to the power $${n}$.`,
              `这里把对角元素乘以 $${n}$，而不是取 $${n}$ 次幂。`,
            ],
            [
              `$${mat([a ** n, b ** n], [b ** n, a ** n])}$`,
              "The entries off the diagonal stay $0$ in every power of a diagonal matrix.",
              "对角矩阵的每个幂中，对角线以外的元素都仍是 $0$。",
            ],
            [
              `$${mat([a ** n + 1, 0], [0, b ** n])}$`,
              `The top left entry is $(${a})^{${n}} = ${a ** n}$.`,
              `左上元素是 $(${a})^{${n}} = ${a ** n}$。`,
            ],
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
        "Transposing a product reverses its order: $(AB)^{T} = B^{T}A^{T}$. The reversal is needed for the shapes to fit, and it is similar to taking off socks and shoes in reverse order.\n\n> **Watch out.** $(AB)^{T}$ is $B^{T}A^{T}$, not $A^{T}B^{T}$. The second is often not even defined.",
        "积的转置要反转次序：$(AB)^{T} = B^{T}A^{T}$。反转才能使形状相符，就像脱鞋袜的次序与穿时相反。\n\n> **注意。** $(AB)^{T}$ 是 $B^{T}A^{T}$，不是 $A^{T}B^{T}$。后者常常根本没有定义。",
      ],
      (rng) => {
        const m = rng.int(2, 9);
        const n = rng.int(2, 9);
        const p = n === m ? n + 1 : rng.int(2, 9);
        const [A, B] = rng.sample(["A", "B", "C", "D", "M", "N", "P", "Q"], 2) as [string, string];
        return reasoned(
          chooseFilled(
            rng,
            [
              `$${A}$ is $${m} \\times ${n}$ and $${B}$ is $${n} \\times ${p}$. Which expression equals $(${A}${B})^{T}$?`,
              `$${A}$ 是 $${m} \\times ${n}$ 矩阵，$${B}$ 是 $${n} \\times ${p}$ 矩阵。哪个式子等于 $(${A}${B})^{T}$？`,
            ],
            `${B}^{T}${A}^{T}`,
            [`${A}^{T}${B}^{T}`, `${B}${A}`, `${A}${B}`],
            [
              `**Step 1: Find the size.** $${A}${B}$ is $${m} \\times ${p}$, so $(${A}${B})^{T}$ is $${p} \\times ${m}$.\n\n**Step 2: Reverse and transpose.** A transpose of a product reverses the order and transposes each factor. $${B}^{T}$ is $${p} \\times ${n}$ and $${A}^{T}$ is $${n} \\times ${m}$, so $${B}^{T}${A}^{T}$ fits and is $${p} \\times ${m}$ as well.\n\n**Check.** Compare one entry. The entry of $(${A}${B})^{T}$ in row $i$ and column $j$ is the entry of $${A}${B}$ in row $j$ and column $i$, that is, row $j$ of $${A}$ times column $i$ of $${B}$. In $${B}^{T}${A}^{T}$ the same entry is row $i$ of $${B}^{T}$, which is column $i$ of $${B}$, times column $j$ of $${A}^{T}$, which is row $j$ of $${A}$. These are the same products.`,
              `**第一步：确定大小。**$${A}${B}$ 是 $${m} \\times ${p}$ 矩阵，所以 $(${A}${B})^{T}$ 是 $${p} \\times ${m}$ 矩阵。\n\n**第二步：反转并转置。**积的转置要反转次序，并把每个因子转置。$${B}^{T}$ 是 $${p} \\times ${n}$，$${A}^{T}$ 是 $${n} \\times ${m}$，所以 $${B}^{T}${A}^{T}$ 形状相符，也是 $${p} \\times ${m}$。\n\n**检验。**比较一个元素。$(${A}${B})^{T}$ 第 $i$ 行第 $j$ 列的元素是 $${A}${B}$ 第 $j$ 行第 $i$ 列的元素，即 $${A}$ 的第 $j$ 行乘 $${B}$ 的第 $i$ 列。在 $${B}^{T}${A}^{T}$ 中，同一元素是 $${B}^{T}$ 的第 $i$ 行（即 $${B}$ 的第 $i$ 列）乘 $${A}^{T}$ 的第 $j$ 列（即 $${A}$ 的第 $j$ 行）。两者是同样的乘积。`,
            ],
          ),
          [
            [
              `$${A}^{T}${B}^{T}$`,
              "The factors are in the same order, but transposing a product reverses the order.",
              "因子次序没变，但积的转置要反转次序。",
            ],
            [`$${B}${A}$`, "The order is reversed, but each factor must also be transposed.", "次序反转了，但每个因子还要转置。"],
            [
              `$${A}${B}$`,
              "This is the product itself: its transpose has rows and columns exchanged.",
              "这是积本身：它的转置要交换行和列。",
            ],
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
        "Multiplying a matrix by a standard basis vector picks out one column. Knowing what a matrix does to these vectors therefore reveals every entry of the matrix.\n\n> **Watch out.** The results are columns of the matrix, not rows: the matrix times the first standard vector is its first column.",
        "矩阵乘标准基向量，就取出一列。所以知道矩阵对这些向量的作用，就知道矩阵的每个元素。\n\n> **注意。** 得到的是矩阵的列，不是行：矩阵乘第一个标准向量得到的是它的第一列。",
      ],
      (rng) => {
        const [a, b, c, d] = [nz(rng, 9), nz(rng, 9), nz(rng, 9), nz(rng, 9)];
        return reasoned(
          chooseFilled(
            rng,
            [
              `$A${mat([1], [0])} = ${mat([a], [c])}$ and $A${mat([0], [1])} = ${mat([b], [d])}$. Find $A$.`,
              `$A${mat([1], [0])} = ${mat([a], [c])}$，$A${mat([0], [1])} = ${mat([b], [d])}$。求 $A$。`,
            ],
            mat([a, b], [c, d]),
            [mat([a, c], [b, d]), mat([b, a], [d, c]), mat([c, d], [a, b])],
            [
              `**Step 1: Use the first standard vector.** Row by column, $A$ times the first standard vector takes the first entry of each row, so it is the first column of $A$. The first column has entries $${a}$ and $${c}$.\n\n**Step 2: Use the second.** In the same way the second result is the second column, with entries $${b}$ and $${d}$. So $A = ${mat([a, b], [c, d])}$.\n\n**Check.** Multiply back. With the first standard vector, row $1$ gives $${a} \\cdot 1 + ${paren(b)} \\cdot 0 = ${a}$ and row $2$ gives $${c} \\cdot 1 + ${paren(d)} \\cdot 0 = ${c}$. With the second, they give $${a} \\cdot 0 + ${paren(b)} \\cdot 1 = ${b}$ and $${c} \\cdot 0 + ${paren(d)} \\cdot 1 = ${d}$.`,
              `**第一步：用第一个标准向量。**按行乘列，$A$ 乘第一个标准向量取出每一行的第一个元素，所以得到 $A$ 的第一列，元素是 $${a}$ 和 $${c}$。\n\n**第二步：用第二个。**同样，第二个结果是第二列，元素是 $${b}$ 和 $${d}$。所以 $A = ${mat([a, b], [c, d])}$。\n\n**检验。**乘回去。乘第一个标准向量时，第 $1$ 行给出 $${a} \\cdot 1 + ${paren(b)} \\cdot 0 = ${a}$，第 $2$ 行给出 $${c} \\cdot 1 + ${paren(d)} \\cdot 0 = ${c}$。乘第二个时，分别给出 $${a} \\cdot 0 + ${paren(b)} \\cdot 1 = ${b}$ 和 $${c} \\cdot 0 + ${paren(d)} \\cdot 1 = ${d}$。`,
            ],
          ),
          [
            [
              `$${mat([a, c], [b, d])}$`,
              "The results are written as rows, but they are the columns of the matrix.",
              "这里把结果写成了行，但它们是矩阵的列。",
            ],
            [
              `$${mat([b, a], [d, c])}$`,
              "The columns are in the wrong order: the first standard vector gives the first column.",
              "列的次序反了：第一个标准向量给出第一列。",
            ],
            [
              `$${mat([c, d], [a, b])}$`,
              "The entries are mixed up: each result is a whole column, top entry first.",
              "元素弄乱了：每个结果是完整的一列，上面的元素在前。",
            ],
          ],
        );
      },
    ),
  ],
  "multiplying-square-matrices": [
    skill(
      "the-square-of-a-matrix",
      ["The square of a matrix", "矩阵的平方"],
      [
        "Squaring a matrix means multiplying it by itself, not squaring each entry. So every entry of the result combines a row with a column, and the two methods usually differ.\n\n> **Watch out.** The top left entry of the square is $a^2 + bc$, not $a^2$: each entry adds two products.",
        "矩阵的平方是矩阵乘自身，而不是每个元素平方。所以结果的每个元素都由一行和一列组合而成，两种做法通常不同。\n\n> **注意。** 平方的左上元素是 $a^2 + bc$，不是 $a^2$：每个元素都是两个乘积之和。",
      ],
      (rng) => {
        const [a, b, c, d] = [nz(rng, 6), nz(rng, 6), nz(rng, 6), nz(rng, 6)];
        return reasoned(
          chooseFilled(
            rng,
            [`Find $${mat([a, b], [c, d])}^{2}$.`, `求 $${mat([a, b], [c, d])}^{2}$。`],
            mat([a * a + b * c, a * b + b * d], [c * a + d * c, c * b + d * d]),
            [
              mat([a * a, b * b], [c * c, d * d]),
              mat([a * a + b * c, a * b - b * d], [c * a - d * c, c * b + d * d]),
              mat([2 * a, 2 * b], [2 * c, 2 * d]),
            ],
            [
              `**Step 1: The top row.** Row $1$ times column $1$ is $${paren(a)} \\cdot ${paren(a)} + ${paren(b)} \\cdot ${paren(c)} = ${a * a + b * c}$. Row $1$ times column $2$ is $${paren(a)} \\cdot ${paren(b)} + ${paren(b)} \\cdot ${paren(d)} = ${a * b + b * d}$.\n\n**Step 2: The bottom row.** Row $2$ times column $1$ is $${paren(c)} \\cdot ${paren(a)} + ${paren(d)} \\cdot ${paren(c)} = ${c * a + d * c}$. Row $2$ times column $2$ is $${paren(c)} \\cdot ${paren(b)} + ${paren(d)} \\cdot ${paren(d)} = ${c * b + d * d}$.\n\n**Check.** Build each column of the square from the columns of the matrix. Column $1$ is $${a}$ times column $1$ plus $${c}$ times column $2$, with entries $${a} \\cdot ${paren(a)} + ${paren(c)} \\cdot ${paren(b)} = ${a * a + b * c}$ and $${a} \\cdot ${paren(c)} + ${paren(c)} \\cdot ${paren(d)} = ${c * a + d * c}$. Column $2$ is $${b}$ times column $1$ plus $${d}$ times column $2$, with entries $${b} \\cdot ${paren(a)} + ${paren(d)} \\cdot ${paren(b)} = ${a * b + b * d}$ and $${b} \\cdot ${paren(c)} + ${paren(d)} \\cdot ${paren(d)} = ${c * b + d * d}$.`,
              `**第一步：上面一行。**第 $1$ 行乘第 $1$ 列是 $${paren(a)} \\cdot ${paren(a)} + ${paren(b)} \\cdot ${paren(c)} = ${a * a + b * c}$。第 $1$ 行乘第 $2$ 列是 $${paren(a)} \\cdot ${paren(b)} + ${paren(b)} \\cdot ${paren(d)} = ${a * b + b * d}$。\n\n**第二步：下面一行。**第 $2$ 行乘第 $1$ 列是 $${paren(c)} \\cdot ${paren(a)} + ${paren(d)} \\cdot ${paren(c)} = ${c * a + d * c}$。第 $2$ 行乘第 $2$ 列是 $${paren(c)} \\cdot ${paren(b)} + ${paren(d)} \\cdot ${paren(d)} = ${c * b + d * d}$。\n\n**检验。**用矩阵的列组合出平方的每一列。第 $1$ 列是第 $1$ 列的 $${a}$ 倍加第 $2$ 列的 $${c}$ 倍，元素为 $${a} \\cdot ${paren(a)} + ${paren(c)} \\cdot ${paren(b)} = ${a * a + b * c}$ 和 $${a} \\cdot ${paren(c)} + ${paren(c)} \\cdot ${paren(d)} = ${c * a + d * c}$。第 $2$ 列是第 $1$ 列的 $${b}$ 倍加第 $2$ 列的 $${d}$ 倍，元素为 $${b} \\cdot ${paren(a)} + ${paren(d)} \\cdot ${paren(b)} = ${a * b + b * d}$ 和 $${b} \\cdot ${paren(c)} + ${paren(d)} \\cdot ${paren(d)} = ${c * b + d * d}$。`,
            ],
          ),
          [
            [
              `$${mat([a * a, b * b], [c * c, d * d])}$`,
              "This squares each entry, but squaring a matrix means multiplying it by itself, row by column.",
              "这里把每个元素都平方了，但矩阵的平方是矩阵乘自身，按行乘列计算。",
            ],
            [
              `$${mat([a * a + b * c, a * b - b * d], [c * a - d * c, c * b + d * d])}$`,
              "The two terms of an off-diagonal entry are added, not subtracted.",
              "非对角元素的两项是相加，不是相减。",
            ],
            [
              `$${mat([2 * a, 2 * b], [2 * c, 2 * d])}$`,
              "This doubles the matrix: that is $A + A$, not $A \\cdot A$.",
              "这是把矩阵加倍：那是 $A + A$，不是 $A \\cdot A$。",
            ],
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
        "In a chain of products, each pair of neighbors must fit, and the inner sizes vanish. So the result has the rows of the first matrix and the columns of the last.\n\n> **Watch out.** Keep the two outer numbers in order, rows of the first matrix and then columns of the last, and do not add the inner sizes: they cancel.",
        "连乘时每对相邻矩阵的形状都要相符，中间的尺寸消失。所以结果的行数是第一个矩阵的，列数是最后一个的。\n\n> **注意。** 两端的数要按次序写，先是第一个矩阵的行数，再是最后一个的列数；中间的尺寸不要相加，它们是消掉的。",
      ],
      (rng) => {
        const [m, n, p, q] = [rng.int(2, 9), rng.int(2, 9), rng.int(2, 9), rng.int(2, 9)];
        const r = m === q ? q + 1 : q;
        return reasoned(
          chooseFilled(
            rng,
            [
              `$A$ is $${m} \\times ${n}$, $B$ is $${n} \\times ${p}$ and $C$ is $${p} \\times ${r}$. What is the size of $ABC$?`,
              `$A$ 是 $${m} \\times ${n}$，$B$ 是 $${n} \\times ${p}$，$C$ 是 $${p} \\times ${r}$。$ABC$ 的尺寸是多少？`,
            ],
            `${m} \\times ${r}`,
            [`${r} \\times ${m}`, `${m} \\times ${n + p + r}`, `${m + n} \\times ${p + r}`],
            [
              `**Step 1: Multiply the first two.** $A$ is $${m} \\times ${n}$ and $B$ is $${n} \\times ${p}$. The inner sizes match, so $AB$ is $${m} \\times ${p}$.\n\n**Step 2: Multiply by the third.** $AB$ is $${m} \\times ${p}$ and $C$ is $${p} \\times ${r}$. Again the inner sizes match, so $ABC$ is $${m} \\times ${r}$.\n\n**Check.** Group the other way. $BC$ is $${n} \\times ${r}$, and $A$ times it is $${m} \\times ${n}$ times $${n} \\times ${r}$, which is $${m} \\times ${r}$ again.`,
              `**第一步：先乘前两个。**$A$ 是 $${m} \\times ${n}$，$B$ 是 $${n} \\times ${p}$。中间的尺寸相同，所以 $AB$ 是 $${m} \\times ${p}$。\n\n**第二步：再乘第三个。**$AB$ 是 $${m} \\times ${p}$，$C$ 是 $${p} \\times ${r}$。中间的尺寸又相同，所以 $ABC$ 是 $${m} \\times ${r}$。\n\n**检验。**换一种结合方式。$BC$ 是 $${n} \\times ${r}$，$A$ 乘它就是 $${m} \\times ${n}$ 乘 $${n} \\times ${r}$，结果还是 $${m} \\times ${r}$。`,
            ],
          ),
          [
            [
              `$${r} \\times ${m}$`,
              "The two outer numbers are reversed: the rows come from the first matrix.",
              "两端的数反了：行数来自第一个矩阵。",
            ],
            [
              `$${m} \\times ${n + p + r}$`,
              "The inner sizes cancel; they are not added to the columns.",
              "中间的尺寸是消掉的，不能加到列数上。",
            ],
            [
              `$${m + n} \\times ${p + r}$`,
              "Sizes are never added in a product: the inner ones cancel.",
              "乘积中尺寸从不相加：中间的尺寸消掉。",
            ],
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
        "Each entry of a product takes one multiplication for every column of the first matrix. So a product of sizes $m \\times n$ and $n \\times p$ takes $mnp$ multiplications of numbers.\n\n> **Watch out.** Each entry takes as many multiplications as the shared inner size, so the total is $m \\cdot n \\cdot p$, not just the number of entries $m \\cdot p$.",
        "积的每个元素，第一个矩阵有几列就要做几次乘法。所以 $m \\times n$ 和 $n \\times p$ 相乘要做 $mnp$ 次数的乘法。\n\n> **注意。** 每个元素要做的乘法次数等于共同的内侧尺寸，所以总数是 $m \\cdot n \\cdot p$，而不只是元素个数 $m \\cdot p$。",
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
            `**Step 1: Count the entries.** The product is $${m} \\times ${p}$, so it has $${m} \\cdot ${p} = ${m * p}$ entries.\n\n**Step 2: Count per entry.** Each entry is a row of $${n}$ numbers times a column of $${n}$ numbers, which takes $${n}$ multiplications. In all there are $${m * p} \\cdot ${n} = ${m * n * p}$.\n\n**Check.** Count by rows of the first matrix instead. One row times the second matrix gives a row of $${p}$ entries with $${n}$ multiplications each, so $${p * n}$ multiplications, and there are $${m}$ rows: $${m} \\cdot ${p * n} = ${m * n * p}$.`,
            `**第一步：数元素。**乘积是 $${m} \\times ${p}$ 矩阵，有 $${m} \\cdot ${p} = ${m * p}$ 个元素。\n\n**第二步：数每个元素的乘法。**每个元素是 $${n}$ 个数的一行乘 $${n}$ 个数的一列，要做 $${n}$ 次乘法。共 $${m * p} \\cdot ${n} = ${m * n * p}$ 次。\n\n**检验。**改为按第一个矩阵的行来数。一行乘第二个矩阵得到 $${p}$ 个元素的一行，每个 $${n}$ 次乘法，共 $${p * n}$ 次；有 $${m}$ 行：$${m} \\cdot ${p * n} = ${m * n * p}$。`,
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
        "A non-square matrix needs identities of different sizes on its two sides. On the left the size matches its rows, and on the right it matches its columns.\n\n> **Watch out.** Do not swap the sides: the identity on the left fits the rows of the matrix, and the one on the right fits its columns.",
        "非方阵两边的单位矩阵尺寸不同。左边的尺寸等于行数，右边的尺寸等于列数。\n\n> **注意。** 不要把两边弄反：左边的单位矩阵与行数相符，右边的与列数相符。",
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
            `**Step 1: Write the sizes.** $${left ? `(? \\times ?)(${m} \\times ${n})` : `(${m} \\times ${n})(? \\times ?)`}$. The inner sizes must match, so $I$ needs $${left ? m : n}$ ${left ? "columns" : "rows"}.\n\n**Step 2: Use that $I$ is square.** An identity matrix is square, so $I$ is $${left ? m : n} \\times ${left ? m : n}$ and has $${left ? m : n}$ rows.\n\n**Check.** With this $I$ the sizes are $${left ? `(${m} \\times ${m})(${m} \\times ${n})` : `(${m} \\times ${n})(${n} \\times ${n})`}$. The inner sizes match and the product is $${m} \\times ${n}$, the size of $A$. With $${left ? n : m}$ rows instead the inner sizes would be $${n}$ and $${m}$, which differ.`,
            `**第一步：写出大小。**$${left ? `(? \\times ?)(${m} \\times ${n})` : `(${m} \\times ${n})(? \\times ?)`}$。内侧尺寸必须相同，所以 $I$ 需要 $${left ? m : n}$ ${left ? "列" : "行"}。\n\n**第二步：单位矩阵是方阵。**单位矩阵是方阵，所以 $I$ 是 $${left ? m : n} \\times ${left ? m : n}$，有 $${left ? m : n}$ 行。\n\n**检验。**用这个 $I$，大小是 $${left ? `(${m} \\times ${m})(${m} \\times ${n})` : `(${m} \\times ${n})(${n} \\times ${n})`}$。内侧尺寸相同，乘积是 $${m} \\times ${n}$，与 $A$ 大小相同。若改为 $${left ? n : m}$ 行，内侧尺寸就是 $${n}$ 和 $${m}$，不相同。`,
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
        "Since matrices need not commute, $(A + B)^{2}$ has two different middle terms, $AB$ and $BA$. The usual formula with $2AB$ only holds when $A$ and $B$ commute.\n\n> **Watch out.** Do not write $2AB$: $AB$ and $BA$ are usually different matrices, so they cannot be combined.",
        "矩阵不一定可交换，所以 $(A + B)^{2}$ 有两个不同的中间项 $AB$ 和 $BA$。通常含 $2AB$ 的公式只在 $A$、$B$ 可交换时成立。\n\n> **注意。** 不要写成 $2AB$：$AB$ 和 $BA$ 通常是不同的矩阵，不能合并。",
      ],
      (rng) => {
        const [A, B] = rng.sample(["A", "B", "C", "D", "M", "N", "P", "Q", "R", "S"], 2) as [string, string];
        const minus = rng.bool();
        const op = minus ? "-" : "+";
        const flipped = `${A}^{2} ${minus ? "+" : "-"} ${A}${B} ${minus ? "+" : "-"} ${B}${A} + ${B}^{2}`;
        return reasoned(
          chooseFilled(
            rng,
            [
              `For square matrices of the same size, which expression equals $(${A} ${op} ${B})^{2}$?`,
              `对同样大小的方阵，哪个式子等于 $(${A} ${op} ${B})^{2}$？`,
            ],
            `${A}^{2} ${op} ${A}${B} ${op} ${B}${A} + ${B}^{2}`,
            [`${A}^{2} ${op} 2${A}${B} + ${B}^{2}`, `${A}^{2} + ${B}^{2}`, flipped],
            [
              `**Step 1: Write it as a product.** $(${A} ${op} ${B})^{2} = (${A} ${op} ${B})(${A} ${op} ${B})$.\n\n**Step 2: Expand, keeping the order.** Each term of the first factor multiplies each term of the second from the left, giving $${A}${A} ${op} ${A}${B} ${op} ${B}${A} + ${B}${B}$. Since $${A}${B}$ and $${B}${A}$ need not be equal, they stay separate.\n\n**Check.** Count the products. Two terms times two terms give four products, $${A}${A}$, $${A}${B}$, $${B}${A}$ and $${B}${B}$, and the last has sign $+$ because ${minus ? `$(-${B})(-${B}) = ${B}^{2}$` : `$${B} \\cdot ${B} = ${B}^{2}$`}. These are the four terms of the answer.`,
              `**第一步：写成乘积。**$(${A} ${op} ${B})^{2} = (${A} ${op} ${B})(${A} ${op} ${B})$。\n\n**第二步：保持次序展开。**第一个因子的每一项从左边乘第二个因子的每一项，得 $${A}${A} ${op} ${A}${B} ${op} ${B}${A} + ${B}${B}$。由于 $${A}${B}$ 和 $${B}${A}$ 不一定相等，它们要分开写。\n\n**检验。**数一数乘积。两项乘两项得四个乘积 $${A}${A}$、$${A}${B}$、$${B}${A}$、$${B}${B}$，最后一个的符号是 $+$，因为 ${minus ? `$(-${B})(-${B}) = ${B}^{2}$` : `$${B} \\cdot ${B} = ${B}^{2}$`}。这正是答案中的四项。`,
            ],
          ),
          [
            [
              `$${A}^{2} ${op} 2${A}${B} + ${B}^{2}$`,
              `This merges $${A}${B}$ and $${B}${A}$, but they are equal only when the matrices commute.`,
              `这里把 $${A}${B}$ 和 $${B}${A}$ 合并了，但只有矩阵可交换时它们才相等。`,
            ],
            [`$${A}^{2} + ${B}^{2}$`, `The middle terms $${A}${B}$ and $${B}${A}$ are missing.`, `漏掉了中间项 $${A}${B}$ 和 $${B}${A}$。`],
            [
              `$${flipped}$`,
              `The middle terms have the wrong sign: they carry the sign $${op}$.`,
              `中间项的符号错了：它们的符号应是 $${op}$。`,
            ],
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
        "A vector solves a matrix equation when the product equals the right side. So a missing entry of the right side comes from multiplying the matrix by the solution.\n\n> **Watch out.** Row $2$ of the matrix gives the second entry of the product. Row $1$ only gives the entry that is already shown.",
        "向量是矩阵方程的解，当且仅当乘积等于右边。所以右边缺失的元素，可由矩阵乘解得到。\n\n> **注意。** 矩阵的第 $2$ 行给出乘积的第二个元素。第 $1$ 行给出的只是已经写出的那个元素。",
      ],
      (rng) => {
        const [a, b, c, d] = [nz(rng, 9), nz(rng, 9), nz(rng, 9), nz(rng, 9)];
        const x = nz(rng, 6);
        const y = nz(rng, 6);
        const combined = `${paren(x)}${mat([a], [c])} + ${paren(y)}${mat([b], [d])} = ${mat([a * x + b * y], [c * x + d * y])}`;
        return integer(
          [
            `$${mat(["x"], ["y"])} = ${mat([x], [y])}$ solves $${mat([a, b], [c, d])}${mat(["x"], ["y"])} = ${mat([a * x + b * y], ["k"])}$. What is $k$?`,
            `$${mat(["x"], ["y"])} = ${mat([x], [y])}$ 是 $${mat([a, b], [c, d])}${mat(["x"], ["y"])} = ${mat([a * x + b * y], ["k"])}$ 的解。$k$ 是多少？`,
          ],
          c * x + d * y,
          [a * x + b * y, c * x - d * y, c * y + d * x],
          [
            `**Step 1: Pick the row.** $k$ is the second entry of the product, so it comes from row $2$ of the matrix, whose entries are $${c}$ and $${d}$.\n\n**Step 2: Multiply by the solution.** $k = ${paren(c)} \\cdot ${paren(x)} + ${paren(d)} \\cdot ${paren(y)} = ${c * x + d * y}$.\n\n**Check.** Combine the columns instead, with weights $${x}$ and $${y}$: $${combined}$. Its top entry $${a * x + b * y}$ matches the right side, and its bottom entry is $${c * x + d * y}$.`,
            `**第一步：选行。**$k$ 是乘积的第二个元素，所以来自矩阵的第 $2$ 行，这一行是 $${c}$ 和 $${d}$。\n\n**第二步：乘解向量。**$k = ${paren(c)} \\cdot ${paren(x)} + ${paren(d)} \\cdot ${paren(y)} = ${c * x + d * y}$。\n\n**检验。**改用列的组合，权重是 $${x}$ 和 $${y}$：$${combined}$。上面的元素 $${a * x + b * y}$ 与右边一致，下面的元素是 $${c * x + d * y}$。`,
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
        "An equation that omits a variable still has a coefficient for it: zero. The coefficient matrix must show that zero, or the columns would no longer line up with the variables.\n\n> **Watch out.** Keep the places in the order $x, y, z$. The coefficient of $z$ goes in the third place even when $y$ is missing.",
        "方程缺少某个变量时，它的系数是 0。系数矩阵必须写出这个 0，否则列就不再与变量对齐。\n\n> **注意。** 位置要保持 $x, y, z$ 的次序。即使缺少 $y$，$z$ 的系数也要写在第三个位置。",
      ],
      (rng) => {
        const [a, b] = [rng.int(2, 9), rng.int(2, 9)];
        const e = rng.int(1, 20);
        return reasoned(
          chooseFilled(
            rng,
            [
              `What is the row of the coefficient matrix for the equation $${a}x + ${b}z = ${e}$, with the variables in the order $x, y, z$?`,
              `方程 $${a}x + ${b}z = ${e}$ 在系数矩阵中的那一行是什么（变量次序为 $x, y, z$）？`,
            ],
            mat([a, 0, b]),
            [mat([a, b, 0]), mat([a, b, e]), mat([0, a, b])],
            [
              `**Step 1: List the coefficients in order.** The coefficient of $x$ is $${a}$. The variable $y$ does not appear, so its coefficient is $0$. The coefficient of $z$ is $${b}$.\n\n**Step 2: Write the row.** The row is $${mat([a, 0, b])}$. The constant $${e}$ stays on the right side.\n\n**Check.** Multiply the row by the column of $x$, $y$, $z$. It gives $${a}x + 0y + ${b}z = ${a}x + ${b}z$, the left side of the equation.`,
              `**第一步：按次序列出系数。**$x$ 的系数是 $${a}$。变量 $y$ 没有出现，所以它的系数是 $0$。$z$ 的系数是 $${b}$。\n\n**第二步：写出这一行。**这一行是 $${mat([a, 0, b])}$。常数 $${e}$ 留在右边。\n\n**检验。**用这一行乘 $x$、$y$、$z$ 组成的列，得 $${a}x + 0y + ${b}z = ${a}x + ${b}z$，正是方程的左边。`,
            ],
          ),
          [
            [
              `$${mat([a, b, 0])}$`,
              "This puts the coefficient of $z$ under $y$. The missing $y$ needs a $0$ in the middle.",
              "这把 $z$ 的系数放到了 $y$ 的位置。缺少的 $y$ 要在中间写 $0$。",
            ],
            [
              `$${mat([a, b, e])}$`,
              "This puts the constant into the coefficient matrix and drops the $0$ for $y$. The constant belongs on the right side.",
              "这把常数放进了系数矩阵，又漏掉了 $y$ 的 $0$。常数属于右边。",
            ],
            [
              `$${mat([0, a, b])}$`,
              "This shifts the coefficients one place to the right. The first place belongs to $x$.",
              "这把系数都向右移了一位。第一个位置属于 $x$。",
            ],
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
        "Multiplying a $2 \\times 2$ matrix by $k$ multiplies both rows by $k$, so the determinant is multiplied by $k^{2}$, not by $k$. Each row contributes one factor.\n\n> **Watch out.** For a $2 \\times 2$ matrix the factor is $k^{2}$, not $k$ or $2k$: both rows are scaled, and the factors multiply.",
        "$2 \\times 2$ 矩阵乘 $k$，两行都乘 $k$，所以行列式乘 $k^{2}$，而不是 $k$。每一行贡献一个因数。\n\n> **注意。** 对 $2 \\times 2$ 矩阵，因数是 $k^{2}$，不是 $k$ 也不是 $2k$：两行都被放大，因数要相乘。",
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
          [
            `**Step 1: Count the scaled rows.** $${k}A$ multiplies each of the two rows of $A$ by $${k}$, and each scaled row multiplies the determinant by $${k}$.\n\n**Step 2: Multiply.** $\\det(${k}A) = ${k}^{2} \\cdot ${paren(det)} = ${k * k * det}$.\n\n**Check.** Try a matrix with this determinant, such as $A = ${mat([det, 0], [0, 1])}$. Its multiple is $${k}A = ${mat([k * det, 0], [0, k])}$. The determinant of that is $${paren(k * det)} \\cdot ${k} - 0 \\cdot 0 = ${k * k * det}$.`,
            `**第一步：数被放大的行。**$${k}A$ 把 $A$ 的两行都乘 $${k}$，每放大一行，行列式就乘 $${k}$。\n\n**第二步：相乘。**$\\det(${k}A) = ${k}^{2} \\cdot ${paren(det)} = ${k * k * det}$。\n\n**检验。**取一个行列式为这个值的矩阵，比如 $A = ${mat([det, 0], [0, 1])}$。它的倍数是 $${k}A = ${mat([k * det, 0], [0, k])}$。其行列式是 $${paren(k * det)} \\cdot ${k} - 0 \\cdot 0 = ${k * k * det}$。`,
          ],
        );
      },
    ),
  ],
  "the-minors-of-a-3x3-matrix": [
    skill(
      "the-sign-pattern-of-cofactors",
      ["The sign pattern of cofactors", "代数余子式的符号规律"],
      [
        "A cofactor is a minor with a sign of $(-1)^{i + j}$, which forms a checkerboard starting with plus at the top left. So entries with an even sum of indices keep the sign of the minor.\n\n> **Watch out.** The sign depends on the position only. An odd $i + j$ changes the sign of the minor even when the minor is negative.",
        "代数余子式是余子式乘符号 $(-1)^{i + j}$，形成从左上角的正号开始的棋盘。所以下标之和为偶数的元素保留余子式的符号。\n\n> **注意。** 符号只由位置决定。$i + j$ 为奇数时，即使余子式是负数，也要改变它的符号。",
      ],
      (rng) => {
        const i = rng.int(1, 3);
        const j = rng.int(1, 3);
        const m = nz(rng, 40);
        const sign = (i + j) % 2 === 0 ? 1 : -1;
        const signRow = [1, 2, 3].map((c) => ((i + c) % 2 === 0 ? "+" : "-")).join(", ");
        return integer(
          [
            `In a $3 \\times 3$ matrix, the minor $M_{${i}${j}}$ is ${m}. What is the cofactor $C_{${i}${j}}$?`,
            `$3 \\times 3$ 矩阵中，余子式 $M_{${i}${j}}$ 是 ${m}。代数余子式 $C_{${i}${j}}$ 是多少？`,
          ],
          sign * m,
          [-sign * m, Math.abs(m) + 1, i * j * m],
          [
            `**Step 1: Add the indices.** $i + j = ${i} + ${j} = ${i + j}$, which is ${sign === 1 ? "even" : "odd"}.\n\n**Step 2: Attach the sign.** $(-1)^{${i + j}} = ${sign}$, so $C_{${i}${j}} = ${sign} \\cdot ${paren(m)} = ${sign * m}$.\n\n**Check.** Read the checkerboard. Row $${i}$ of it is $${signRow}$, so place $${j}$ holds $${sign === 1 ? "+" : "-"}$. The cofactor is ${sign === 1 ? "the minor itself" : "the minor with its sign changed"}, $${sign * m}$.`,
            `**第一步：下标相加。**$i + j = ${i} + ${j} = ${i + j}$，是${sign === 1 ? "偶数" : "奇数"}。\n\n**第二步：配上符号。**$(-1)^{${i + j}} = ${sign}$，所以 $C_{${i}${j}} = ${sign} \\cdot ${paren(m)} = ${sign * m}$。\n\n**检验。**看棋盘符号。它的第 $${i}$ 行是 $${signRow}$，所以第 $${j}$ 个位置是 $${sign === 1 ? "+" : "-"}$。代数余子式${sign === 1 ? "就是余子式本身" : "是余子式改变符号"}，即 $${sign * m}$。`,
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
        "Expanding along a column with mostly zeros leaves one term at each stage. So the determinant of a triangular matrix is just the product of its diagonal entries.\n\n> **Watch out.** Multiply the diagonal entries; do not add them. The entries off the diagonal do not enter at all.",
        "沿大部分是零的列展开，每一步只剩一项。所以三角矩阵的行列式就是对角元素的积。\n\n> **注意。** 对角元素要相乘，不是相加。对角线以外的元素完全不参与。",
      ],
      (rng) => {
        const [a, b, c] = [nz(rng, 7), nz(rng, 7), nz(rng, 7)];
        const [p, q, r] = [nz(rng, 9), nz(rng, 9), nz(rng, 9)];
        const upper = rng.bool();
        const m = upper ? mat([a, p, q], [0, b, r], [0, 0, c]) : mat([a, 0, 0], [p, b, 0], [q, r, c]);
        const rest = upper ? mat([b, r], [0, c]) : mat([b, 0], [r, c]);
        const cross = upper ? `${paren(r)} \\cdot 0` : `0 \\cdot ${paren(r)}`;
        return integer(
          [`Evaluate $\\det ${m}$.`, `计算 $\\det ${m}$。`],
          a * b * c,
          [a + b + c, a * b * c + p * q * r, -a * b * c],
          [
            `**Step 1: Expand along the ${upper ? "first column" : "first row"}.** Its only nonzero entry is $${a}$, so the determinant is $${a}$ times the determinant of $${rest}$.\n\n**Step 2: Finish the $2 \\times 2$ determinant.** It is $${paren(b)} \\cdot ${paren(c)} - ${cross} = ${b * c}$. So the determinant is $${paren(a)} \\cdot ${paren(b * c)} = ${a * b * c}$.\n\n**Check.** By the rule of Sarrus, every diagonal product except the main diagonal contains a $0$. Only $${paren(a)} \\cdot ${paren(b)} \\cdot ${paren(c)} = ${a * b * c}$ is left.`,
            `**第一步：沿${upper ? "第一列" : "第一行"}展开。**其中唯一的非零元素是 $${a}$，所以行列式等于 $${a}$ 乘 $${rest}$ 的行列式。\n\n**第二步：算完 $2 \\times 2$ 行列式。**它是 $${paren(b)} \\cdot ${paren(c)} - ${cross} = ${b * c}$。所以行列式是 $${paren(a)} \\cdot ${paren(b * c)} = ${a * b * c}$。\n\n**检验。**按沙鲁法则，除主对角线外，每个对角线乘积都含 $0$。只剩下 $${paren(a)} \\cdot ${paren(b)} \\cdot ${paren(c)} = ${a * b * c}$。`,
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
        "To undo a product, undo the last factor first, so $(AB)^{-1} = B^{-1}A^{-1}$. Keeping the original order would not cancel the matrices next to each other.\n\n> **Watch out.** Reverse the order and invert every factor. Inverting without reversing, or reversing without inverting, does not give the inverse.",
        "要还原一个积，先还原最后一个因子，所以 $(AB)^{-1} = B^{-1}A^{-1}$。保持原来的次序，相邻的矩阵就不能抵消。\n\n> **注意。** 既要颠倒次序，又要对每个因子求逆。只求逆不颠倒，或只颠倒不求逆，都得不到逆矩阵。",
      ],
      (rng) => {
        const [A, B, C] = rng.sample(["A", "B", "C", "D", "M", "N", "P", "Q"], 3) as [string, string, string];
        const three = rng.bool();
        const product = three ? `${A}${B}${C}` : `${A}${B}`;
        const right = three ? `${C}^{-1}${B}^{-1}${A}^{-1}` : `${B}^{-1}${A}^{-1}`;
        const wrong = three
          ? [`${A}^{-1}${B}^{-1}${C}^{-1}`, `${A}^{-1}${C}^{-1}${B}^{-1}`, `${C}^{-1}${A}^{-1}${B}^{-1}`]
          : [`${A}^{-1}${B}^{-1}`, `${B}${A}`, `-${A}${B}`];
        const cancel = three
          ? `${product}${right} = ${A}${B}(${C}${C}^{-1})${B}^{-1}${A}^{-1} = ${A}(${B}${B}^{-1})${A}^{-1} = ${A}${A}^{-1} = I`
          : `${product}${right} = ${A}(${B}${B}^{-1})${A}^{-1} = ${A}${A}^{-1} = I`;
        const whys: [string, string][] = three
          ? [
              [
                "This keeps the original order, so no factor stands next to its own inverse.",
                "这里保持了原来的次序，没有一个因子挨着它自己的逆。",
              ],
              [
                `This reverses only part of the order. The inverse of the last factor, $${C}$, has to come first.`,
                `这里只颠倒了一部分次序。最后一个因子 $${C}$ 的逆必须放在最前面。`,
              ],
              [
                `This moves only $${C}^{-1}$ to the front. The inverse of the first factor, $${A}$, has to come last.`,
                `这里只把 $${C}^{-1}$ 移到了前面。第一个因子 $${A}$ 的逆必须放在最后。`,
              ],
            ]
          : [
              [
                "This keeps the original order, so no factor stands next to its own inverse.",
                "这里保持了原来的次序，没有一个因子挨着它自己的逆。",
              ],
              ["This reverses the order but forgets to invert the factors.", "这里颠倒了次序，但忘了对因子求逆。"],
              [
                "Changing the sign is not inverting. A negative of a matrix is not its inverse.",
                "改变符号不是求逆。矩阵的相反矩阵不是它的逆。",
              ],
            ];
        return reasoned(
          chooseFilled(
            rng,
            [
              `The matrices are invertible. Which expression equals $(${product})^{-1}$?`,
              `这些矩阵都可逆。哪个式子等于 $(${product})^{-1}$？`,
            ],
            right,
            wrong,
            [
              `**Step 1: Undo the last factor first.** In $${product}X = I$, the factor that touches $X$ is the last one, $${three ? C : B}$. So $X$ has to start with its inverse.\n\n**Step 2: Work outward.** Each factor is undone in turn, from the last to the first. So $(${product})^{-1} = ${right}$.\n\n**Check.** Multiply and cancel the neighbors from the middle out. $${cancel}$.`,
              `**第一步：先还原最后一个因子。**在 $${product}X = I$ 中，挨着 $X$ 的是最后一个因子 $${three ? C : B}$。所以 $X$ 必须以它的逆开头。\n\n**第二步：由内向外。**从最后一个因子到第一个因子，依次还原。所以 $(${product})^{-1} = ${right}$。\n\n**检验。**相乘，并从中间向外抵消相邻的一对。$${cancel}$。`,
            ],
          ),
          wrong.map((w, i) => [`$${w}$`, whys[i]![0], whys[i]![1]] as const),
        );
      },
    ),
  ],
  "calculating-the-inverse-of-a-3x3-matrix-using-the-cofactor-method": [
    skill(
      "the-inverse-of-a-diagonal-matrix",
      ["The inverse of a diagonal matrix", "对角矩阵的逆"],
      [
        "A diagonal matrix is undone by inverting each diagonal entry, as the cofactor method confirms. A zero on the diagonal would make the determinant zero, and no inverse would exist.\n\n> **Watch out.** The inverse holds the reciprocals $\\frac{1}{a}$ of the diagonal entries, not $-a$ or $a$ itself. Only a diagonal matrix can be inverted entry by entry like this.",
        "对角矩阵的逆就是把每个对角元素取倒数，余子式法也证实了这一点。对角线上有零时行列式为零，逆不存在。\n\n> **注意。** 逆矩阵里是对角元素的倒数 $\\frac{1}{a}$，不是 $-a$，也不是 $a$ 本身。只有对角矩阵才能这样逐个元素求逆。",
      ],
      (rng) => {
        const [a, b, c] = [rng.int(2, 9), rng.int(2, 9), rng.int(2, 9)];
        const pos = rng.int(0, 2);
        const value = [a, b, c][pos]!;
        const [o1, o2] = [a, b, c].filter((_, i) => i !== pos) as [number, number];
        return fraction(
          [
            `Find the entry in row ${pos + 1}, column ${pos + 1} of the inverse of $${mat([a, 0, 0], [0, b, 0], [0, 0, c])}$.`,
            `求 $${mat([a, 0, 0], [0, b, 0], [0, 0, c])}$ 的逆矩阵第 ${pos + 1} 行第 ${pos + 1} 列的元素。`,
          ],
          Q.of(1, value),
          [Q.of(value), Q.of(-1, value), Q.of(1, a * b * c)],
          [
            `**Step 1: Find the determinant.** The matrix is diagonal, so its determinant is the product of the diagonal entries, $${a} \\cdot ${b} \\cdot ${c} = ${a * b * c}$.\n\n**Step 2: Find the cofactor.** Deleting row ${pos + 1} and column ${pos + 1} leaves a diagonal $2 \\times 2$ matrix, so the minor is $${o1} \\cdot ${o2} = ${o1 * o2}$. Its sign is $+$, since the row and column numbers are equal. So the entry is $${o1 * o2}$ divided by $${a * b * c}$, which is $${frac(1, value)}$.\n\n**Check.** The product of two diagonal matrices multiplies matching diagonal entries. Here $${value} \\cdot ${frac(1, value)} = 1$, the matching entry of $I$.`,
            `**第一步：求行列式。**这是对角矩阵，所以行列式是对角元素之积，$${a} \\cdot ${b} \\cdot ${c} = ${a * b * c}$。\n\n**第二步：求代数余子式。**划去第 ${pos + 1} 行和第 ${pos + 1} 列，剩下一个 $2 \\times 2$ 对角矩阵，所以余子式是 $${o1} \\cdot ${o2} = ${o1 * o2}$。行号与列号相同，符号是 $+$。所以这个元素是 $${o1 * o2}$ 除以 $${a * b * c}$，即 $${frac(1, value)}$。\n\n**检验。**两个对角矩阵相乘，就是对应的对角元素相乘。这里 $${value} \\cdot ${frac(1, value)} = 1$，正是 $I$ 中对应的元素。`,
          ],
        );
      },
    ),
  ],
  "solving-systems-of-equations-using-inverse-matrices": [
    skill(
      "solving-with-a-computed-inverse",
      ["Solving with a computed inverse", "用求出的逆矩阵解"],
      [
        "Multiplying both sides by the inverse on the left gives $\\mathbf{x} = A^{-1}\\mathbf{b}$. For a $2 \\times 2$ system, the inverse comes from swapping the diagonal, negating the rest and dividing by the determinant.\n\n> **Watch out.** Multiply $\\mathbf{b}$ by $A^{-1}$ one row at a time: row $1$ gives $x$ and row $2$ gives $y$. Multiplying by $A$ itself solves nothing.",
        "两边左乘逆矩阵，得 $\\mathbf{x} = A^{-1}\\mathbf{b}$。对 $2 \\times 2$ 方程组，逆矩阵由交换对角元素、其余取负、再除以行列式得到。\n\n> **注意。** 用 $A^{-1}$ 逐行乘 $\\mathbf{b}$：第 $1$ 行给出 $x$，第 $2$ 行给出 $y$。用 $A$ 本身去乘解不出任何东西。",
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
          [7, 3, 2, 1],
        ]);
        const [a, b, c, d] = row;
        const x = nz(rng, 9);
        const y = nz(rng, 9);
        const e = a * x + b * y;
        const f = c * x + d * y;
        const askX = rng.bool();
        return integer(
          [
            `Using the inverse of the coefficient matrix, which has determinant 1, solve $${mat([a, b], [c, d])}${mat(["x"], ["y"])} = ${mat([e], [f])}$. What is $${askX ? "x" : "y"}$?`,
            `用系数矩阵（行列式为 1）的逆解 $${mat([a, b], [c, d])}${mat(["x"], ["y"])} = ${mat([e], [f])}$。$${askX ? "x" : "y"}$ 是多少？`,
          ],
          askX ? x : y,
          [askX ? y : x, e, f],
          [
            `**Step 1: Invert the matrix.** The determinant is $${a} \\cdot ${d} - ${b} \\cdot ${c} = 1$, so the inverse is the adjugate, $${mat([d, -b], [-c, a])}$.\n\n**Step 2: Multiply.** Row 1 of the inverse gives $x = ${d} \\cdot ${paren(e)} - ${b} \\cdot ${paren(f)} = ${x}$. Row 2 gives $y = -${c} \\cdot ${paren(e)} + ${a} \\cdot ${paren(f)} = ${y}$.\n\n**Check.** Substitute back. The first equation gives $${a} \\cdot ${paren(x)} + ${b} \\cdot ${paren(y)} = ${e}$. The second gives $${c} \\cdot ${paren(x)} + ${d} \\cdot ${paren(y)} = ${f}$.`,
            `**第一步：求逆矩阵。**行列式是 $${a} \\cdot ${d} - ${b} \\cdot ${c} = 1$，所以逆矩阵就是伴随矩阵 $${mat([d, -b], [-c, a])}$。\n\n**第二步：相乘。**逆矩阵的第 1 行给出 $x = ${d} \\cdot ${paren(e)} - ${b} \\cdot ${paren(f)} = ${x}$。第 2 行给出 $y = -${c} \\cdot ${paren(e)} + ${a} \\cdot ${paren(f)} = ${y}$。\n\n**检验。**代回原方程。第一个方程得 $${a} \\cdot ${paren(x)} + ${b} \\cdot ${paren(y)} = ${e}$。第二个方程得 $${c} \\cdot ${paren(x)} + ${d} \\cdot ${paren(y)} = ${f}$。`,
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
        "Linearity means a transformation respects sums and multiples. So knowing the images of two vectors gives the image of any combination of them, with no need for a formula.\n\n> **Watch out.** Each coefficient stays with its own vector, and a minus sign applies to every component of the image it stands before.",
        "线性表示变换保持和与倍数。所以知道两个向量的像，就能得到它们任意线性组合的像，不需要公式。\n\n> **注意。** 每个系数跟着它自己的向量，减号作用在它后面那个像的每个分量上。",
      ],
      (rng) => {
        const [a, b, c, d] = [nz(rng, 7), nz(rng, 7), nz(rng, 7), nz(rng, 7)];
        const p = rng.int(2, 5);
        const q = rng.int(2, 5);
        const [rx, ry] = [p * a - q * c, p * b - q * d];
        const wrong = [vec(p * a + q * c, p * b + q * d), vec(a - c, b - d), vec(p * c - q * a, p * d - q * b)];
        return reasoned(
          chooseFilled(
            rng,
            [
              `$T$ is linear, with $T(\\mathbf{u}) = ${vec(a, b)}$ and $T(\\mathbf{v}) = ${vec(c, d)}$. Find $T(${p}\\mathbf{u} - ${q}\\mathbf{v})$.`,
              `$T$ 是线性变换，$T(\\mathbf{u}) = ${vec(a, b)}$，$T(\\mathbf{v}) = ${vec(c, d)}$。求 $T(${p}\\mathbf{u} - ${q}\\mathbf{v})$。`,
            ],
            vec(rx, ry),
            wrong,
            [
              `**Step 1: Use linearity.** A linear map respects combinations, so $T(${p}\\mathbf{u} - ${q}\\mathbf{v}) = ${p}T(\\mathbf{u}) - ${q}T(\\mathbf{v})$.\n\n**Step 2: Combine the components.** The first is $${p} \\cdot ${paren(a)} - ${q} \\cdot ${paren(c)} = ${rx}$. The second is $${p} \\cdot ${paren(b)} - ${q} \\cdot ${paren(d)} = ${ry}$. So the image is $${vec(rx, ry)}$.\n\n**Check.** Add back $${q}T(\\mathbf{v}) = ${vec(q * c, q * d)}$. The sum is $${vec(rx + q * c, ry + q * d)}$, which is $${p}T(\\mathbf{u})$, as it should be.`,
              `**第一步：利用线性。**线性变换保持线性组合，所以 $T(${p}\\mathbf{u} - ${q}\\mathbf{v}) = ${p}T(\\mathbf{u}) - ${q}T(\\mathbf{v})$。\n\n**第二步：组合各分量。**第一个分量是 $${p} \\cdot ${paren(a)} - ${q} \\cdot ${paren(c)} = ${rx}$。第二个分量是 $${p} \\cdot ${paren(b)} - ${q} \\cdot ${paren(d)} = ${ry}$。所以像是 $${vec(rx, ry)}$。\n\n**检验。**加回 $${q}T(\\mathbf{v}) = ${vec(q * c, q * d)}$。和是 $${vec(rx + q * c, ry + q * d)}$，正是 $${p}T(\\mathbf{u})$。`,
            ],
          ),
          [
            [`$${wrong[0]}$`, `This adds $${q}T(\\mathbf{v})$ instead of subtracting it.`, `这里加上了 $${q}T(\\mathbf{v})$，而应该减去。`],
            [`$${wrong[1]}$`, `This drops the multiples $${p}$ and $${q}$.`, `这里丢掉了倍数 $${p}$ 和 $${q}$。`],
            [
              `$${wrong[2]}$`,
              `This swaps the multiples $${p}$ and $${q}$ between the two vectors.`,
              `这里把两个向量的倍数 $${p}$ 和 $${q}$ 对调了。`,
            ],
          ],
        );
      },
    ),
  ],
  "linear-transformations-of-points-and-lines-in-the-plane": [
    skill(
      "the-origin-stays-fixed",
      ["The origin stays fixed", "原点不动"],
      [
        "Any matrix sends the zero vector to the zero vector, so a linear transformation keeps the origin where it is. A map that moves the origin, such as a translation, cannot be linear.\n\n> **Watch out.** Keeping the origin fixed is necessary but not enough. A map such as $(x^2, y)$ keeps the origin and is still not linear.",
        "任何矩阵都把零向量变成零向量，所以线性变换保持原点不动。移动原点的映射（比如平移）不可能是线性的。\n\n> **注意。** 保持原点不动是必要条件，但不是充分条件。像 $(x^2, y)$ 这样的映射保持原点不动，却仍然不是线性的。",
      ],
      (rng) => {
        const [a, b, c, d] = [rng.int(2, 9), rng.int(2, 9), rng.int(2, 9), rng.int(2, 9)];
        const e = Math.abs(nz(rng, 9));
        const linear: Pair = [`$T(x, y) = (${a}x + ${b}y, ${c}x + ${d}y)$`, `$T(x, y) = (${a}x + ${b}y, ${c}x + ${d}y)$`];
        const others: Pair[] = [
          [`$T(x, y) = (x + ${e}, y)$`, `$T(x, y) = (x + ${e}, y)$`],
          [`$T(x, y) = (${a}x, y + ${d})$`, `$T(x, y) = (${a}x, y + ${d})$`],
          [`$T(x, y) = (${b}x + ${c}, ${d}y)$`, `$T(x, y) = (${b}x + ${c}, ${d}y)$`],
        ];
        const moved = [`(${e}, 0)`, `(0, ${d})`, `(${c}, 0)`];
        return reasoned(
          choose(rng, ["Which of these maps can be linear?", "下面哪个映射可能是线性的？"], linear, others, [
            `**Step 1: Test the origin.** A linear map sends $(0, 0)$ to $(0, 0)$. Putting in $(0, 0)$ gives $${moved[0]}$ for $(x + ${e}, y)$, $${moved[1]}$ for $(${a}x, y + ${d})$ and $${moved[2]}$ for $(${b}x + ${c}, ${d}y)$. These three maps move the origin, so none of them is linear.\n\n**Step 2: Keep the one left.** The map $(${a}x + ${b}y, ${c}x + ${d}y)$ sends $(0, 0)$ to $(0, 0)$. It is the only one that can be linear.\n\n**Check.** It is multiplication by the matrix $${mat([a, b], [c, d])}$. Every matrix map respects sums and multiples, so it is linear.`,
            `**第一步：检验原点。**线性映射把 $(0, 0)$ 变到 $(0, 0)$。代入 $(0, 0)$，$(x + ${e}, y)$ 得 $${moved[0]}$，$(${a}x, y + ${d})$ 得 $${moved[1]}$，$(${b}x + ${c}, ${d}y)$ 得 $${moved[2]}$。这三个映射都移动了原点，所以都不是线性的。\n\n**第二步：留下剩下的那个。**映射 $(${a}x + ${b}y, ${c}x + ${d}y)$ 把 $(0, 0)$ 变到 $(0, 0)$。只有它可能是线性的。\n\n**检验。**它就是乘矩阵 $${mat([a, b], [c, d])}$。每个矩阵映射都保持和与倍数，所以它是线性的。`,
          ]),
          others.map(
            (o, i) =>
              [
                o[0],
                `This sends the origin to $${moved[i]}$, so it cannot be linear.`,
                `它把原点变到 $${moved[i]}$，所以不可能是线性的。`,
              ] as const,
          ),
        );
      },
    ),
  ],
  "linear-transformations-of-objects-in-the-plane": [
    skill(
      "the-area-after-a-transformation",
      ["The area after a transformation", "变换后的面积"],
      [
        "A linear transformation multiplies every area by the same factor, the absolute value of its determinant. So the new area needs only the old area and that one number.\n\n> **Watch out.** Use the absolute value of the determinant. A negative determinant flips the shape over, but its area is still positive.",
        "线性变换把所有面积都乘同一个因数，即行列式的绝对值。所以新的面积只需要原面积和这一个数。\n\n> **注意。** 要用行列式的绝对值。行列式为负说明图形被翻转，但面积仍是正的。",
      ],
      (rng) => {
        const [a, b, c, d] = [rng.int(1, 6), rng.int(0, 5), rng.int(0, 5), rng.int(1, 6)];
        const det = a * d - b * c === 0 ? 1 : a * d - b * c;
        const dd = a * d - b * c === 0 ? d + 1 : d;
        const real = a * dd - b * c;
        const area = rng.int(2, 20);
        const size = Math.abs(real);
        return whole(
          [
            `A shape of area ${area} is transformed by $${mat([a, b], [c, dd])}$. What is the area of the image?`,
            `面积为 ${area} 的图形经 $${mat([a, b], [c, dd])}$ 变换。像的面积是多少？`,
          ],
          size * area,
          [area, (a + dd) * area, Math.abs(det) * area === size * area ? size * area + area : Math.abs(det) * area],
          [
            `**Step 1: Find the determinant.** $\\det = ${a} \\cdot ${dd} - ${b} \\cdot ${c} = ${real}$.\n\n**Step 2: Scale the area.** Every area is multiplied by $|${real}| = ${size}$. So the image has area $${size} \\times ${area} = ${size * area}$.\n\n**Check.** Take a rectangle of area ${area} with sides $\\langle ${area}, 0 \\rangle$ and $\\langle 0, 1 \\rangle$. Their images are $\\langle ${area * a}, ${area * c} \\rangle$ and $\\langle ${b}, ${dd} \\rangle$. The parallelogram on these sides has area $|${area * a} \\cdot ${dd} - ${b} \\cdot ${area * c}| = ${size * area}$.`,
            `**第一步：求行列式。**$\\det = ${a} \\cdot ${dd} - ${b} \\cdot ${c} = ${real}$。\n\n**第二步：放缩面积。**每个面积都乘 $|${real}| = ${size}$。所以像的面积是 $${size} \\times ${area} = ${size * area}$。\n\n**检验。**取面积为 ${area}、两边为 $\\langle ${area}, 0 \\rangle$ 和 $\\langle 0, 1 \\rangle$ 的矩形。两边的像是 $\\langle ${area * a}, ${area * c} \\rangle$ 和 $\\langle ${b}, ${dd} \\rangle$。以它们为边的平行四边形面积是 $|${area * a} \\cdot ${dd} - ${b} \\cdot ${area * c}| = ${size * area}$。`,
          ],
        );
      },
    ),
  ],
  "dilations-and-reflections-as-linear-transformations": [
    {
      ...skill(
        "reflecting-twice",
        ["Reflecting twice", "两次反射"],
        [
          "Reflecting in the same line twice returns every point, so the matrix of a reflection squared is the identity. Reflecting in both axes in turn is the same as turning by a half turn.\n\n> **Watch out.** Two reflections in the same line undo each other, but reflections in two different axes do not. Together they change the sign of both coordinates.",
          "在同一条直线上反射两次，每个点都回到原处，所以反射矩阵的平方是单位矩阵。依次在两条轴上反射，等于旋转半圈。\n\n> **注意。** 在同一条直线上的两次反射互相抵消，但在两条不同的轴上反射不会抵消。合起来两个坐标都变号。",
        ],
        (rng) => {
          const x = nz(rng, 12);
          const y = nz(rng, 12);
          const both = rng.bool();
          const right = both ? `(${-x}, ${-y})` : `(${x}, ${y})`;
          const near = [1, 2, 3].map((s) => [
            `$${right.replace(/-?\d+/, (n) => String(Number(n) + s))}$`,
            "The first coordinate is off.",
            "第一个坐标不对。",
          ]);
          return reasoned(
            chooseFilled(
              rng,
              [
                both
                  ? `The point $(${x}, ${y})$ is reflected in the $x$-axis and then in the $y$-axis. Where does it end?`
                  : `The point $(${x}, ${y})$ is reflected in the line $y = x$ twice. Where does it end?`,
                both
                  ? `点 $(${x}, ${y})$ 先在 $x$ 轴上反射，再在 $y$ 轴上反射。它最后在哪里？`
                  : `点 $(${x}, ${y})$ 在直线 $y = x$ 上反射两次。它最后在哪里？`,
              ],
              right,
              both ? [`(${x}, ${y})`, `(${y}, ${x})`, `(${x}, ${-y})`] : [`(${y}, ${x})`, `(${-x}, ${-y})`, `(${-y}, ${-x})`],
              both
                ? [
                    `**Step 1: Reflect in the $x$-axis.** This changes the sign of $y$, so $(${x}, ${y})$ goes to $(${x}, ${-y})$.\n\n**Step 2: Reflect in the $y$-axis.** This changes the sign of $x$, so $(${x}, ${-y})$ goes to $(${-x}, ${-y})$.\n\n**Check.** The matrix of the $y$-axis reflection has rows $(-1, 0)$ and $(0, 1)$, and that of the $x$-axis reflection has rows $(1, 0)$ and $(0, -1)$. Their product has rows $(-1, 0)$ and $(0, -1)$, which is $-I$, the half turn. $-I$ sends $(${x}, ${y})$ to $(${-x}, ${-y})$.`,
                    `**第一步：在 $x$ 轴上反射。**这改变 $y$ 的符号，所以 $(${x}, ${y})$ 变到 $(${x}, ${-y})$。\n\n**第二步：在 $y$ 轴上反射。**这改变 $x$ 的符号，所以 $(${x}, ${-y})$ 变到 $(${-x}, ${-y})$。\n\n**检验。**$y$ 轴反射的矩阵行为 $(-1, 0)$ 和 $(0, 1)$，$x$ 轴反射的矩阵行为 $(1, 0)$ 和 $(0, -1)$。它们的乘积行为 $(-1, 0)$ 和 $(0, -1)$，就是 $-I$，即旋转半圈。$-I$ 把 $(${x}, ${y})$ 变到 $(${-x}, ${-y})$。`,
                  ]
                : [
                    `**Step 1: Reflect once.** Reflecting in $y = x$ swaps the coordinates, so $(${x}, ${y})$ goes to $(${y}, ${x})$.\n\n**Step 2: Reflect again.** Swapping once more sends $(${y}, ${x})$ back to $(${x}, ${y})$.\n\n**Check.** Square the matrix with rows $(0, 1)$ and $(1, 0)$. Its first row becomes $(0 \\cdot 0 + 1 \\cdot 1, \\; 0 \\cdot 1 + 1 \\cdot 0) = (1, 0)$. Its second row becomes $(1 \\cdot 0 + 0 \\cdot 1, \\; 1 \\cdot 1 + 0 \\cdot 0) = (0, 1)$. That is $I$, which leaves $(${x}, ${y})$ in place.`,
                    `**第一步：反射一次。**在 $y = x$ 上反射交换两个坐标，所以 $(${x}, ${y})$ 变到 $(${y}, ${x})$。\n\n**第二步：再反射一次。**再交换一次，$(${y}, ${x})$ 回到 $(${x}, ${y})$。\n\n**检验。**把行为 $(0, 1)$ 和 $(1, 0)$ 的矩阵平方。第一行变成 $(0 \\cdot 0 + 1 \\cdot 1, \\; 0 \\cdot 1 + 1 \\cdot 0) = (1, 0)$。第二行变成 $(1 \\cdot 0 + 0 \\cdot 1, \\; 1 \\cdot 1 + 0 \\cdot 0) = (0, 1)$。这就是 $I$，它让 $(${x}, ${y})$ 不动。`,
                  ],
            ),
            [
              ...(both
                ? [
                    [
                      `$(${x}, ${y})$`,
                      "This is the starting point. Reflections in two different axes do not undo each other.",
                      "这是起点。在两条不同的轴上反射不会互相抵消。",
                    ],
                    [
                      `$(${y}, ${x})$`,
                      "Swapping the coordinates is the reflection in $y = x$, which is not used here.",
                      "交换坐标是在 $y = x$ 上的反射，这里没有用到。",
                    ],
                    [`$(${x}, ${-y})$`, "This is only the first reflection, in the $x$-axis.", "这只是第一次反射，即在 $x$ 轴上的反射。"],
                  ]
                : [
                    [`$(${y}, ${x})$`, "This is after only one reflection in $y = x$.", "这只是在 $y = x$ 上反射一次的结果。"],
                    [
                      `$(${-x}, ${-y})$`,
                      "This is the half turn, not two reflections in one line.",
                      "这是旋转半圈，不是在同一条直线上反射两次。",
                    ],
                    [`$(${-y}, ${-x})$`, "This is the reflection in $y = -x$.", "这是在 $y = -x$ 上的反射。"],
                  ]),
              ...near,
            ] as [string, string, string][],
          );
        },
      ),
      figure: precalculusDrawings4["dilations-and-reflections-as-linear-transformations#reflecting-twice"],
    },
  ],
  "shear-and-stretch-as-linear-transformations": [
    skill(
      "shears-keep-area",
      ["Shears keep area", "切变保持面积"],
      [
        "A shear has a determinant of 1, so it slides points without changing area. A stretch by factor $k$ along one axis has a determinant of $k$, and it multiplies areas by $k$.\n\n> **Watch out.** The factor of a shear is not its area factor. A shear changes the shape but keeps the area, because its determinant is $1$ whatever the factor.",
        "切变的行列式是 1，所以只滑动点而不改变面积。沿一条轴拉伸 $k$ 倍的行列式是 $k$，面积也乘 $k$。\n\n> **注意。** 切变的系数不是面积因数。切变改变形状但保持面积，因为不论系数是多少，它的行列式都是 $1$。",
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
          shear
            ? [
                `**Step 1: Find the determinant.** The horizontal shear with factor $${k}$ has rows $(1, ${k})$ and $(0, 1)$. Its determinant is $1 \\cdot 1 - ${k} \\cdot 0 = 1$.\n\n**Step 2: Scale the area.** Areas are multiplied by $1$, so the image has area $${area}$.\n\n**Check.** Take a rectangle of area $${area}$ with sides $\\langle ${area}, 0 \\rangle$ and $\\langle 0, 1 \\rangle$. The shear sends them to $\\langle ${area}, 0 \\rangle$ and $\\langle ${k}, 1 \\rangle$. The parallelogram on these sides has area $|${area} \\cdot 1 - 0 \\cdot ${k}| = ${area}$.`,
                `**第一步：求行列式。**系数为 $${k}$ 的水平切变的矩阵行为 $(1, ${k})$ 和 $(0, 1)$。它的行列式是 $1 \\cdot 1 - ${k} \\cdot 0 = 1$。\n\n**第二步：放缩面积。**面积乘 $1$，所以像的面积是 $${area}$。\n\n**检验。**取面积为 $${area}$、两边为 $\\langle ${area}, 0 \\rangle$ 和 $\\langle 0, 1 \\rangle$ 的矩形。切变把它们变成 $\\langle ${area}, 0 \\rangle$ 和 $\\langle ${k}, 1 \\rangle$。以它们为边的平行四边形面积是 $|${area} \\cdot 1 - 0 \\cdot ${k}| = ${area}$。`,
              ]
            : [
                `**Step 1: Find the determinant.** The stretch by $${k}$ along the $x$-axis has rows $(${k}, 0)$ and $(0, 1)$. Its determinant is $${k} \\cdot 1 - 0 \\cdot 0 = ${k}$.\n\n**Step 2: Scale the area.** Areas are multiplied by $${k}$, so the image has area $${k} \\times ${area} = ${k * area}$.\n\n**Check.** Take a rectangle of area $${area}$ with sides $\\langle ${area}, 0 \\rangle$ and $\\langle 0, 1 \\rangle$. The stretch sends them to $\\langle ${k * area}, 0 \\rangle$ and $\\langle 0, 1 \\rangle$. The rectangle on these sides has area $${k * area} \\cdot 1 = ${k * area}$.`,
                `**第一步：求行列式。**沿 $x$ 轴拉伸 $${k}$ 倍的矩阵行为 $(${k}, 0)$ 和 $(0, 1)$。它的行列式是 $${k} \\cdot 1 - 0 \\cdot 0 = ${k}$。\n\n**第二步：放缩面积。**面积乘 $${k}$，所以像的面积是 $${k} \\times ${area} = ${k * area}$。\n\n**检验。**取面积为 $${area}$、两边为 $\\langle ${area}, 0 \\rangle$ 和 $\\langle 0, 1 \\rangle$ 的矩形。拉伸把它们变成 $\\langle ${k * area}, 0 \\rangle$ 和 $\\langle 0, 1 \\rangle$。以它们为边的矩形面积是 $${k * area} \\cdot 1 = ${k * area}$。`,
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
        "Four quarter turns bring every point back, so only the remainder after dividing by 4 matters. This reduces a large number of rotations to at most three.\n\n> **Watch out.** Use the remainder, not the quotient. A remainder of $0$ means the point is back where it started.",
        "四个四分之一圈使每个点回到原处，所以只有除以 4 的余数有关。这把很多次旋转化成最多三次。\n\n> **注意。** 用余数，不是商。余数为 $0$ 表示点回到了起点。",
      ],
      (rng) => {
        const x = nz(rng, 12);
        const y = nz(rng, 12);
        const n = rng.int(5, 60);
        const r = n % 4;
        const images: readonly string[] = [`(${x}, ${y})`, `(${-y}, ${x})`, `(${-x}, ${-y})`, `(${y}, ${-x})`];
        const chain = images.slice(0, r + 1).join(" \\to ");
        const total = 90 * n;
        const turns = Math.floor(total / 360);
        const steps: [string, string] =
          r === 0
            ? ["No quarter turn is left over, so the point stays where it started.", "没有剩下的四分之一圈，所以点停在起点。"]
            : [
                `Each quarter turn sends $(x, y)$ to $(-y, x)$. Turning $${r}$ ${r === 1 ? "time" : "times"} gives $${chain}$.`,
                `每转四分之一圈把 $(x, y)$ 变到 $(-y, x)$。转 $${r}$ 次得 $${chain}$。`,
              ];
        return reasoned(
          chooseFilled(
            rng,
            [
              `The point $(${x}, ${y})$ is rotated counterclockwise by $90^{\\circ}$, ${n} times in a row. Where does it end?`,
              `点 $(${x}, ${y})$ 逆时针旋转 $90^{\\circ}$，连续 ${n} 次。它最后在哪里？`,
            ],
            images[r]!,
            images.filter((_, i) => i !== r),
            [
              `**Step 1: Remove full turns.** $${n} = 4 \\times ${Math.floor(n / 4)} + ${r}$, and every four quarter turns bring the point back. So only $${r}$ quarter ${r === 1 ? "turn counts" : "turns count"}.\n\n**Step 2: Turn what is left.** ${steps[0]}\n\n**Check.** In degrees the total turn is $${n} \\times 90 = ${total}$. Removing $${turns}$ full turns of $360$ leaves $${total} - ${360 * turns} = ${total - 360 * turns}$ degrees, which is $${r}$ quarter ${r === 1 ? "turn" : "turns"}.`,
              `**第一步：去掉整圈。**$${n} = 4 \\times ${Math.floor(n / 4)} + ${r}$，每四个四分之一圈点就回到原处。所以只有 $${r}$ 个四分之一圈有效。\n\n**第二步：转剩下的。**${steps[1]}\n\n**检验。**用度数算，一共转了 $${n} \\times 90 = ${total}$ 度。去掉 $${turns}$ 个 $360$ 度的整圈，剩下 $${total} - ${360 * turns} = ${total - 360 * turns}$ 度，正是 $${r}$ 个四分之一圈。`,
            ],
          ),
          [
            ...images.map(
              (im, i) =>
                [
                  `$${im}$`,
                  `This is where $${i}$ quarter ${i === 1 ? "turn leads" : "turns lead"}: divide $${n}$ by $4$ and use the remainder.`,
                  `这是转 $${i}$ 个四分之一圈的结果：用 $${n}$ 除以 $4$，取余数。`,
                ] as const,
            ),
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
        "Applying a rotation matrix again turns by the same angle again, so the matrix to the power $n$ rotates by $n$ times the angle. Whole turns can then be removed, as they change nothing.\n\n> **Watch out.** Multiply the angle by $n$; do not add $n$ to it. Then subtract whole turns of $360^{\\circ}$.",
        "再次应用旋转矩阵，就再转同样的角，所以矩阵的 $n$ 次幂旋转 $n$ 倍的角。然后可以去掉整圈，因为它们不改变什么。\n\n> **注意。** 把角乘 $n$，不是加 $n$。然后减去 $360^{\\circ}$ 的整圈。",
      ],
      (rng) => {
        const angle = rng.int(1, 11) * 15;
        const n = rng.int(3, 9);
        const total = (angle * n) % 360;
        const turns = Math.floor((angle * n) / 360);
        return whole(
          [
            `$R$ rotates the plane counterclockwise by $${angle}^{\\circ}$. By what angle does $R^{${n}}$ rotate it, in degrees from 0 up to 360?`,
            `$R$ 把平面逆时针旋转 $${angle}^{\\circ}$。$R^{${n}}$ 旋转多少度（0 到 360 度）？`,
          ],
          total,
          [angle, (total + 90) % 360, (angle + n) % 360],
          [
            `**Step 1: Multiply the angle.** $R^{${n}}$ applies $R$ ${n} times, so it turns by $${n} \\times ${angle} = ${angle * n}$ degrees.\n\n**Step 2: Remove full turns.** $${angle * n} - 360 \\times ${turns} = ${total}$, which is from 0 up to 360.\n\n**Check.** Add the full turns back. $${total} + 360 \\times ${turns} = ${angle * n}$, and $${angle * n} \\div ${angle} = ${n}$ turns of $R$.`,
            `**第一步：角乘次数。**$R^{${n}}$ 把 $R$ 做 ${n} 次，所以转 $${n} \\times ${angle} = ${angle * n}$ 度。\n\n**第二步：去掉整圈。**$${angle * n} - 360 \\times ${turns} = ${total}$，在 0 到 360 之间。\n\n**检验。**把整圈加回去。$${total} + 360 \\times ${turns} = ${angle * n}$，而 $${angle * n} \\div ${angle} = ${n}$，正是 $R$ 转的次数。`,
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
        "Doing one transformation after another multiplies their area factors. So the determinant of the composite is the product of the determinants, whichever order they are done in.\n\n> **Watch out.** The determinant of $A^{r}$ is $(\\det A)^{r}$, not $r \\det A$. Each copy of $A$ multiplies by $\\det A$ once more.",
        "依次做两个变换，面积因数相乘。所以复合变换的行列式是行列式的积，不管次序如何。\n\n> **注意。** $A^{r}$ 的行列式是 $(\\det A)^{r}$，不是 $r \\det A$。每多一个 $A$ 就再乘一次 $\\det A$。",
      ],
      (rng) => {
        const p = nz(rng, 9);
        const q = nz(rng, 9);
        const r = rng.int(2, 3);
        const value = p ** r * q;
        const negatives = (p < 0 ? r : 0) + (q < 0 ? 1 : 0);
        const even = negatives % 2 === 0;
        return integer(
          [
            `$\\det A = ${p}$ and $\\det B = ${q}$, both $2 \\times 2$. Find $\\det(A^{${r}}B)$.`,
            `$\\det A = ${p}$，$\\det B = ${q}$，都是 $2 \\times 2$ 矩阵。求 $\\det(A^{${r}}B)$。`,
          ],
          value,
          [p * q, r * p * q, p ** r + q],
          [
            `**Step 1: The power.** Determinants multiply, so $\\det(A^{${r}}) = (\\det A)^{${r}} = (${p})^{${r}} = ${p ** r}$.\n\n**Step 2: The product.** $\\det(A^{${r}}B) = \\det(A^{${r}}) \\cdot \\det B = ${p ** r} \\cdot ${paren(q)} = ${value}$.\n\n**Check.** Work out the size and the sign apart. The sizes multiply to $${Math.abs(p)}^{${r}} \\cdot ${Math.abs(q)} = ${Math.abs(value)}$. There ${negatives === 1 ? "is" : "are"} $${negatives}$ negative ${negatives === 1 ? "factor" : "factors"}, an ${even ? "even" : "odd"} number, so the result is ${even ? "positive" : "negative"}.`,
            `**第一步：幂。**行列式可以相乘，所以 $\\det(A^{${r}}) = (\\det A)^{${r}} = (${p})^{${r}} = ${p ** r}$。\n\n**第二步：积。**$\\det(A^{${r}}B) = \\det(A^{${r}}) \\cdot \\det B = ${p ** r} \\cdot ${paren(q)} = ${value}$。\n\n**检验。**把大小和符号分开算。大小相乘是 $${Math.abs(p)}^{${r}} \\cdot ${Math.abs(q)} = ${Math.abs(value)}$。负的因数有 $${negatives}$ 个，是${even ? "偶" : "奇"}数，所以结果为${even ? "正" : "负"}。`,
          ],
        );
      },
    ),
  ],
  "inverting-linear-transformations": [
    skill(
      "when-no-inverse-exists",
      ["When no inverse exists", "何时没有逆"],
      [
        "A transformation with determinant zero squashes the plane onto a line or a point. Many points then share one image, so it cannot be undone and there is no inverse.\n\n> **Watch out.** No inverse means the determinant is $0$, not $1$. Set the determinant equal to zero and solve.",
        "行列式为零的变换把平面压到一条线或一个点上。于是很多点有同一个像，所以无法还原，没有逆变换。\n\n> **注意。** 没有逆变换意味着行列式为 $0$，不是 $1$。令行列式等于零再解。",
      ],
      (rng) => {
        const k = rng.int(2, 9);
        const a = nz(rng, 9);
        const b = nz(rng, 9);
        const c = rng.int(2, 6);
        const at = a === 1 ? "t" : a === -1 ? "-t" : `${a}t`;
        return integer(
          [
            `For what value of $t$ does the transformation with matrix $${mat([a, b], [c * a, "t"])}$ have no inverse?`,
            `$t$ 为何值时，矩阵为 $${mat([a, b], [c * a, "t"])}$ 的变换没有逆变换？`,
          ],
          c * b,
          [b, -c * b, c * b + k],
          [
            `**Step 1: Write the determinant.** $\\det = ${at} - ${paren(b)} \\cdot ${paren(c * a)} = ${at} - ${paren(a * b * c)}$.\n\n**Step 2: Set it to zero.** There is no inverse exactly when $\\det = 0$. That gives $${at} = ${a * b * c}$, so $t = ${a * b * c} \\div ${paren(a)} = ${c * b}$.\n\n**Check.** With $t = ${c * b}$ the second row is $(${c * a}, ${c * b})$, which is $${c}$ times the first row $(${a}, ${b})$. Then $\\det = ${paren(a)} \\cdot ${paren(c * b)} - ${paren(b)} \\cdot ${paren(c * a)} = 0$.`,
            `**第一步：写出行列式。**$\\det = ${at} - ${paren(b)} \\cdot ${paren(c * a)} = ${at} - ${paren(a * b * c)}$。\n\n**第二步：令它为零。**恰好在 $\\det = 0$ 时没有逆变换。于是 $${at} = ${a * b * c}$，所以 $t = ${a * b * c} \\div ${paren(a)} = ${c * b}$。\n\n**检验。**$t = ${c * b}$ 时第二行是 $(${c * a}, ${c * b})$，是第一行 $(${a}, ${b})$ 的 $${c}$ 倍。这时 $\\det = ${paren(a)} \\cdot ${paren(c * b)} - ${paren(b)} \\cdot ${paren(c * a)} = 0$。`,
          ],
        );
      },
    ),
  ],
};
