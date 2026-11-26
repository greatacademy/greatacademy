import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q, sketch } from "@ga/subject-math";
import { linearAlgebraDrawings2 } from "../explanation-drawings-linear-algebra-2.ts";
import {
  article,
  choiceProblem,
  expressionProblem,
  numberProblem,
  pointProblem,
  say,
  vectorLatex,
  why,
  withMistakes,
  yesNo,
} from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** dedupeSaid drops mistakes that repeat the right response or an earlier mistake. */
function dedupeSaid<T extends { readonly response: string }>(list: readonly T[], right: string): T[] {
  return list.filter((m, i, all) => m.response !== right && all.findIndex((o) => o.response === m.response) === i);
}

/** gcd computes the greatest common divisor of two integers. */
function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x || 1;
}

/** frac formats num/den as a LaTeX fraction, reducing automatically. */
function frac(num: number, den: number): string {
  if (den === 0) return "0";
  let n = num;
  let d = den;
  if (d < 0) {
    n = -n;
    d = -d;
  }
  const g = gcd(n, d);
  n /= g;
  d /= g;
  if (d === 1) return `${n}`;
  if (n < 0) return `-\\frac{${-n}}{${d}}`;
  return `\\frac{${n}}{${d}}`;
}

/** colVecLatex formats a column vector in LaTeX. */
function colVecLatex(v: readonly (number | string)[]): string {
  return `\\begin{pmatrix} ${v.join(" \\\\ ")} \\end{pmatrix}`;
}

/** matLatex formats a matrix in LaTeX. */
function matLatex(rows: readonly (readonly (number | string)[])[]): string {
  return `\\begin{pmatrix} ${rows.map((r) => r.join(" & ")).join(" \\\\ ")} \\end{pmatrix}`;
}

/** formatPoly formats a linear polynomial c1 * t + c0. */
function formatPoly(c1: number, c0: number): string {
  const parts: string[] = [];
  if (c1 === 1) parts.push("t");
  else if (c1 === -1) parts.push("-t");
  else if (c1 !== 0) parts.push(`${c1}t`);

  if (c0 !== 0 || parts.length === 0) {
    if (parts.length === 0) {
      parts.push(`${c0}`);
    } else if (c0 > 0) {
      parts.push(`+ ${c0}`);
    } else {
      parts.push(`- ${-c0}`);
    }
  }
  return parts.join(" ");
}

/** formatPoly2 formats a quadratic polynomial c2 * t^2 + c1 * t + c0. */
function formatPoly2(c2: number, c1: number, c0: number): string {
  const parts: string[] = [];
  if (c2 === 1) parts.push("t^2");
  else if (c2 === -1) parts.push("-t^2");
  else if (c2 !== 0) parts.push(`${c2}t^2`);

  if (c1 !== 0) {
    if (parts.length === 0) {
      if (c1 === 1) parts.push("t");
      else if (c1 === -1) parts.push("-t");
      else parts.push(`${c1}t`);
    } else {
      if (c1 === 1) parts.push("+ t");
      else if (c1 === -1) parts.push("- t");
      else if (c1 > 0) parts.push(`+ ${c1}t`);
      else parts.push(`- ${-c1}t`);
    }
  }

  if (c0 !== 0 || parts.length === 0) {
    if (parts.length === 0) {
      parts.push(`${c0}`);
    } else if (c0 > 0) {
      parts.push(`+ ${c0}`);
    } else {
      parts.push(`- ${-c0}`);
    }
  }
  return parts.join(" ");
}

/** formatLinEq formats a linear equation expression c1*x1 + c2*x2 + ... */
function formatLinEq(coeffs: readonly number[], vars: readonly string[]): string {
  const parts: string[] = [];
  for (let i = 0; i < coeffs.length; i++) {
    const c = coeffs[i]!;
    const v = vars[i]!;
    if (c === 0) continue;
    if (parts.length === 0) {
      if (c === 1) parts.push(v);
      else if (c === -1) parts.push(`-${v}`);
      else parts.push(`${c}${v}`);
    } else {
      if (c === 1) parts.push(`+ ${v}`);
      else if (c === -1) parts.push(`- ${v}`);
      else if (c > 0) parts.push(`+ ${c}${v}`);
      else parts.push(`- ${-c}${v}`);
    }
  }
  return parts.join(" ");
}

/** formatWeightedDot formats w1 x_1 y_1 + w2 x_2 y_2 + ... without raw signs or 1-coefficients. */
function formatWeightedDot(w: readonly number[]): string {
  return w
    .map((weight, i) => {
      const term = `x_${i + 1} y_${i + 1}`;
      return weight === 1 ? term : `${weight} ${term}`;
    })
    .join(" + ");
}

/** formatComplex formats a complex number a + b i. */
function formatComplex(re: number, im: number): string {
  if (im === 0) return `${re}`;
  if (re === 0) {
    if (im === 1) return "i";
    if (im === -1) return "-i";
    return `${im}i`;
  }
  const imPart = im === 1 ? "+ i" : im === -1 ? "- i" : im > 0 ? `+ ${im}i` : `- ${-im}i`;
  return `${re} ${imPart}`;
}

/** oneOf builds a multiple-choice problem with options shuffled and deduplicated. */
function oneOf(rng: Rng, prompt: Text, right: Text, wrong: readonly Text[], solution: Text): Problem {
  const seen = new Set([right.en]);
  const rest: Text[] = [];
  for (const w of wrong) {
    if (!seen.has(w.en)) {
      seen.add(w.en);
      rest.push(w);
      if (rest.length === 3) break;
    }
  }
  const options = [right, ...rest];
  const order = rng.shuffle(options.map((_, i) => i));
  return choiceProblem({ prompt, options: order.map((i) => options[i]!), correct: order.indexOf(0), solution });
}

/** signedSum joins LaTeX terms with + or −, absorbing each term's leading minus sign and skipping zeros. */
function signedSum(terms: readonly string[]): string {
  const kept = terms.filter((x) => x !== "0");
  if (kept.length === 0) return "0";
  return kept.map((x, i) => (i === 0 ? x : x.startsWith("-") ? `- ${x.slice(1)}` : `+ ${x}`)).join(" ");
}

// ════════════════════════════════════════════════════════════════════════════
// MODULE 6.21: INNER PRODUCTS
// ════════════════════════════════════════════════════════════════════════════

/** dotProductInNDimensionalEuclideanSpace covers the standard dot product in ℝⁿ. */
export const dotProductInNDimensionalEuclideanSpace: TopicDef = {
  id: "dot-product-in-n-dimensional-euclidean-space",
  title: t("The Dot Product in N-Dimensional Euclidean Space", "N 维欧几里得空间中的点积"),
  summary: t(
    "Compute the dot product of vectors in n-dimensional Euclidean space and apply its algebraic properties.",
    "计算 N 维欧几里得空间中向量的点积，并应用其代数性质。",
  ),
  intro: t(
    "Take $u = (1, 2, -1, 3)$ and $v = (2, 0, 4, 1)$ in $\\mathbb{R}^4$. Multiplying matching entries gives $2$, $0$, $-4$ and $3$, and adding them gives $u \\cdot v = 2 + 0 - 4 + 3 = 1$.\n\nCheck: adding the products in another order, $(2 + 3) + (0 - 4) = 5 - 4 = 1$, gives the same number, and $v \\cdot u$ multiplies the same pairs, so it is $1$ as well.\n\nIn this lesson we compute dot products in $\\mathbb{R}^n$ and expand dot products of linear combinations.",
    "在 $\\mathbb{R}^4$ 中取 $u = (1, 2, -1, 3)$，$v = (2, 0, 4, 1)$。对应分量相乘得 $2$、$0$、$-4$、$3$，相加得 $u \\cdot v = 2 + 0 - 4 + 3 = 1$。\n\n检验：换一个顺序相加，$(2 + 3) + (0 - 4) = 5 - 4 = 1$，结果相同；$v \\cdot u$ 乘的是同样的几对数，所以也是 $1$。\n\n本课我们计算 $\\mathbb{R}^n$ 中的点积，并展开线性组合的点积。",
  ),
  prerequisites: ["vectors-in-n-dimensional-euclidean-space"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "compute-dot-product-rn",
      title: t("Computing the Dot Product in $\\mathbb{R}^n$", "计算 $\\mathbb{R}^n$ 中的点积"),
      explanation: t(
        "The dot product multiplies matching entries and adds the products, giving a number that measures how much two vectors point in the same direction. The dot product of two vectors $u = (u_1, \\dots, u_n)$ and $v = (v_1, \\dots, v_n)$ in $\\mathbb{R}^n$ is $u \\cdot v = \\sum_{i=1}^n u_i v_i = u_1 v_1 + u_2 v_2 + \\dots + u_n v_n$. For example, $(1, -2, 3, 0) \\cdot (4, 1, 2, 5) = 4 - 2 + 6 + 0 = 8$.\n\n> **Watch out.** A product of a negative and a positive entry is negative and must be subtracted. Multiply only matching entries: the first with the first, the second with the second.",
        "点积把对应分量相乘再把积相加，得到的数衡量两个向量指向相同方向的程度。$\\mathbb{R}^n$ 中两个向量 $u = (u_1, \\dots, u_n)$ 与 $v = (v_1, \\dots, v_n)$ 的点积定义为 $u \\cdot v = \\sum_{i=1}^n u_i v_i = u_1 v_1 + u_2 v_2 + \\dots + u_n v_n$。例如 $(1, -2, 3, 0) \\cdot (4, 1, 2, 5) = 4 - 2 + 6 + 0 = 8$。\n\n> **注意。** 负分量与正分量的积是负数，要减去。只把对应分量相乘：第一个乘第一个，第二个乘第二个。",
      ),
      generate: (rng: Rng): Problem => {
        const dim = rng.pick([4, 5]);
        const u = [rng.nonZero(-5, 5), ...Array.from({ length: dim - 1 }, () => rng.int(-5, 5))];
        const v = [rng.int(-5, 5), rng.nonZero(-5, 5), ...Array.from({ length: dim - 2 }, () => rng.int(-5, 5))];

        const products = u.map((x, i) => x * v[i]!);
        const dot = products.reduce((s, x) => s + x, 0);
        const plus = products.filter((x) => x > 0).reduce((s, x) => s + x, 0);
        const minus = products.filter((x) => x < 0).reduce((s, x) => s + x, 0);

        const prompt = t(
          `Compute the dot product $u \\cdot v$ of the vectors in $\\mathbb{R}^{${dim}}$:\n$$u = ${colVecLatex(u)}, \\quad v = ${colVecLatex(v)}$$`,
          `计算 $\\mathbb{R}^{${dim}}$ 中两向量的点积 $u \\cdot v$：\n$$u = ${colVecLatex(u)}, \\quad v = ${colVecLatex(v)}$$`,
        );

        const terms = u.map((val, idx) => `(${val})(${v[idx]!})`).join(" + ");
        const solution = walked(
          [
            [
              ["Multiply matching entries", "对应分量相乘"],
              t(`The ${dim} products are:`, `${dim} 个乘积是：`),
              [`${terms}`, `= ${signedSum(products.map(String))}`],
            ],
            [["Add the products", "把乘积相加"], t("", ""), [`u \\cdot v = ${dot}`]],
          ],
          t(
            `Adding the positive products and the negative products separately: $${plus} ${minus < 0 ? "-" : "+"} ${Math.abs(minus)} = ${dot}$.`,
            `把正的乘积与负的乘积分开相加：$${plus} ${minus < 0 ? "-" : "+"} ${Math.abs(minus)} = ${dot}$。`,
          ),
        );

        return numberProblem({
          prompt,
          answer: dot,
          solution,
          mistakes: [
            why(
              products.reduce((s, x) => s + Math.abs(x), 0),
              "The signs of the negative products were dropped; those products must be subtracted.",
              "负乘积的符号被丢掉了；这些乘积要减去。",
            ),
            why(-dot, "The sign of the sum is flipped; add the products again.", "和的符号反了；请重新把乘积相加。"),
            why(
              dot - products[dim - 1]!,
              "The last product was left out; every pair of matching entries counts.",
              "漏掉了最后一个乘积；每一对对应分量都要算。",
            ),
            why(
              u.reduce((s, x) => s + x, 0) + v.reduce((s, x) => s + x, 0),
              "That adds all the entries; the dot product multiplies matching entries first.",
              "这是把所有分量相加；点积要先把对应分量相乘。",
            ),
          ].filter((w, i, all) => w.value !== dot && all.findIndex((o) => o.value === w.value) === i),
        });
      },
    },
    {
      id: "expanding-dot-products-of-combinations",
      title: t("Expanding dot products of linear combinations", "展开线性组合的点积"),
      explanation: t(
        "The dot product is symmetric and distributes over sums and scalar multiples, so a product of two combinations expands like ordinary algebra:\n\n$$(au + bv) \\cdot (cu + dv) = ac\\,(u \\cdot u) + (ad + bc)\\,(u \\cdot v) + bd\\,(v \\cdot v).$$\n\nOnly three numbers are needed, $u \\cdot u$, $u \\cdot v$ and $v \\cdot v$, whatever the dimension of the space. For example, if $u \\cdot u = 4$, $v \\cdot v = 9$ and $u \\cdot v = 1$, then $(u + 2v) \\cdot (u - v) = 4 + (-1 + 2)(1) - 2(9) = -13$.\n\n> **Watch out.** There are two cross terms, $ad\\,(u \\cdot v)$ and $bc\\,(v \\cdot u)$, and they combine because $u \\cdot v = v \\cdot u$. Do not drop them, and do not count them twice.",
        "点积是对称的，并对加法和数乘满足分配律，所以两个组合的点积可以像普通代数那样展开：\n\n$$(au + bv) \\cdot (cu + dv) = ac\\,(u \\cdot u) + (ad + bc)\\,(u \\cdot v) + bd\\,(v \\cdot v)$$\n\n无论空间维数多少，只需要三个数：$u \\cdot u$、$u \\cdot v$ 与 $v \\cdot v$。例如若 $u \\cdot u = 4$，$v \\cdot v = 9$，$u \\cdot v = 1$，则 $(u + 2v) \\cdot (u - v) = 4 + (-1 + 2)(1) - 2(9) = -13$。\n\n> **注意。** 交叉项有两个，$ad\\,(u \\cdot v)$ 与 $bc\\,(v \\cdot u)$，因为 $u \\cdot v = v \\cdot u$ 它们可以合并。不要漏掉，也不要算两次。",
      ),
      generate: (rng: Rng): Problem => {
        const A = rng.int(2, 9);
        const B = rng.int(2, 9);
        const C = rng.nonZero(-4, 4);
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const c = rng.nonZero(-3, 3);
        const d = rng.nonZero(-3, 3);
        const ans = a * c * A + (a * d + b * c) * C + b * d * B;
        const comb = (x: number, y: number) => formatLinEq([x, y], ["u", "v"]);
        return numberProblem({
          prompt: t(
            `In $\\mathbb{R}^n$, $u \\cdot u = ${A}$, $v \\cdot v = ${B}$ and $u \\cdot v = ${C}$. Find $(${comb(a, b)}) \\cdot (${comb(c, d)})$.`,
            `在 $\\mathbb{R}^n$ 中，$u \\cdot u = ${A}$，$v \\cdot v = ${B}$，$u \\cdot v = ${C}$。求 $(${comb(a, b)}) \\cdot (${comb(c, d)})$。`,
          ),
          answer: ans,
          mistakes: [
            why(a * c * A + b * d * B, "The cross terms with $u \\cdot v$ were dropped.", "漏掉了含 $u \\cdot v$ 的交叉项。"),
            why(
              a * c * A + a * d * C + b * d * B,
              "Only one cross term was kept; $v \\cdot u$ contributes as well.",
              "只保留了一个交叉项；$v \\cdot u$ 也有贡献。",
            ),
            why(
              a * c * A + 2 * (a * d + b * c) * C + b * d * B,
              "The cross terms were counted twice; $ad + bc$ already includes both.",
              "交叉项算了两次；$ad + bc$ 已经包含两项。",
            ),
            why(a * c + b * d, "That multiplies the coefficients but leaves out the dot products.", "这只把系数相乘，漏掉了点积的值。"),
          ].filter((w, i, all) => w.value !== ans && all.findIndex((o) => o.value === w.value) === i),
          solution: walked(
            [
              [
                ["Collect the coefficients", "整理系数"],
                t(
                  `The coefficient of $u \\cdot u$ is $(${a})(${c}) = ${a * c}$, of $u \\cdot v$ it is $(${a})(${d}) + (${b})(${c}) = ${a * d + b * c}$, and of $v \\cdot v$ it is $(${b})(${d}) = ${b * d}$.`,
                  `$u \\cdot u$ 的系数是 $(${a})(${c}) = ${a * c}$，$u \\cdot v$ 的系数是 $(${a})(${d}) + (${b})(${c}) = ${a * d + b * c}$，$v \\cdot v$ 的系数是 $(${b})(${d}) = ${b * d}$。`,
                ),
              ],
              [
                ["Substitute the dot products", "代入点积的值"],
                t("", ""),
                [`(${a * c})(${A}) + (${a * d + b * c})(${C}) + (${b * d})(${B}) = ${ans}`],
              ],
            ],
            t(
              `The three pieces are $${a * c * A}$, $${(a * d + b * c) * C}$ and $${b * d * B}$, and $${signedSum([String(a * c * A), String((a * d + b * c) * C), String(b * d * B)])} = ${ans}$.`,
              `三部分分别是 $${a * c * A}$、$${(a * d + b * c) * C}$ 与 $${b * d * B}$，且 $${signedSum([String(a * c * A), String((a * d + b * c) * C), String(b * d * B)])} = ${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** normOfAVectorInNDimensionalEuclideanSpace covers the Euclidean norm in ℝⁿ. */
export const normOfAVectorInNDimensionalEuclideanSpace: TopicDef = {
  id: "norm-of-a-vector-in-n-dimensional-euclidean-space",
  title: t("The Norm of a Vector in N-Dimensional Euclidean Space", "N 维欧几里得空间中向量的范数"),
  summary: t(
    "Compute the Euclidean norm of vectors in ℝⁿ and find corresponding unit vectors.",
    "计算 ℝⁿ 中向量的欧几里得范数并求对应的单位向量。",
  ),
  intro: t(
    "The vector $v = (1, -2, 2, 4)$ in $\\mathbb{R}^4$ has squared entries $1$, $4$, $4$ and $16$, which add to $25$, so its norm is $\\|v\\| = \\sqrt{25} = 5$.\n\nCheck: $v \\cdot v = 1 \\cdot 1 + (-2)(-2) + 2 \\cdot 2 + 4 \\cdot 4 = 25 = 5^2$, so the norm squared is the dot product of $v$ with itself.\n\nIn this lesson we compute norms in $\\mathbb{R}^n$ and the distance between two points as the norm of their difference.",
    "$\\mathbb{R}^4$ 中的向量 $v = (1, -2, 2, 4)$ 的分量平方为 $1$、$4$、$4$、$16$，和为 $25$，所以它的范数是 $\\|v\\| = \\sqrt{25} = 5$。\n\n检验：$v \\cdot v = 1 \\cdot 1 + (-2)(-2) + 2 \\cdot 2 + 4 \\cdot 4 = 25 = 5^2$，范数的平方就是 $v$ 与自身的点积。\n\n本课我们计算 $\\mathbb{R}^n$ 中的范数，以及作为差的范数的两点间距离。",
  ),
  prerequisites: ["dot-product-in-n-dimensional-euclidean-space"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "euclidean-norm-rn",
      title: t("Euclidean Norm in $\\mathbb{R}^n$", "$\\mathbb{R}^n$ 中的欧几里得范数"),
      explanation: t(
        "The norm extends the Pythagorean theorem to any number of dimensions: square every entry, add the squares, and take the square root. The Euclidean norm (or magnitude) of a vector $v = (v_1, \\dots, v_n) \\in \\mathbb{R}^n$ is $|v| = \\sqrt{v \\cdot v} = \\sqrt{v_1^2 + \\dots + v_n^2}$. For example, $\\|(2, -3, 6, 0)\\| = \\sqrt{4 + 9 + 36 + 0} = \\sqrt{49} = 7$.\n\n> **Watch out.** Take the square root at the end: $49$ is $\\|v\\|^2$, not $\\|v\\|$. Squaring removes the signs, so a negative entry adds a positive square.",
        "范数把勾股定理推广到任意维数：把每个分量平方，把平方相加，再开平方。向量 $v = (v_1, \\dots, v_n) \\in \\mathbb{R}^n$ 的欧几里得范数（长度）定义为 $|v| = \\sqrt{v \\cdot v} = \\sqrt{v_1^2 + \\dots + v_n^2}$。例如 $\\|(2, -3, 6, 0)\\| = \\sqrt{4 + 9 + 36 + 0} = \\sqrt{49} = 7$。\n\n> **注意。** 最后要开平方：$49$ 是 $\\|v\\|^2$，不是 $\\|v\\|$。平方消去了符号，所以负分量贡献的也是正的平方。",
      ),
      generate: (rng: Rng): Problem => {
        const templates: readonly (readonly [readonly [number, number, number, number], number])[] = [
          [[1, 1, 1, 1], 2],
          [[2, 0, 0, 0], 2],
          [[1, 2, 2, 0], 3],
          [[2, 2, 1, 0], 3],
          [[2, 2, 2, 2], 4],
          [[1, 2, 2, 4], 5],
          [[3, 4, 0, 0], 5],
          [[2, 4, 4, 0], 6],
          [[1, 1, 3, 5], 6],
          [[3, 3, 3, 3], 6],
          [[2, 3, 6, 0], 7],
          [[1, 4, 4, 4], 7],
          [[4, 4, 4, 4], 8],
          [[2, 4, 5, 6], 9],
          [[2, 5, 5, 6], 10],
          [[6, 8, 0, 0], 10],
        ];
        const [base, norm] = rng.pick(templates);
        const perm = rng.shuffle([0, 1, 2, 3]);
        const v = perm.map((i) => {
          const val = base[i]!;
          return val === 0 ? 0 : val * rng.pick([1, -1]);
        });

        const sumSq = norm * norm;
        const prompt = t(
          `Find the Euclidean norm $\\|v\\|$ of the vector $v \\in \\mathbb{R}^4$:\n$$v = ${colVecLatex(v)}$$`,
          `求向量 $v \\in \\mathbb{R}^4$ 的欧几里得范数 $\\|v\\|$：\n$$v = ${colVecLatex(v)}$$`,
        );

        const sqTerms = v.map((val) => `(${val})^2`).join(" + ");
        const solution = walked(
          [
            [["Square the entries", "把分量平方"], t("", ""), [`${sqTerms} = ${v.map((x) => x * x).join(" + ")}`]],
            [["Add the squares", "把平方相加"], t("", ""), [`\\|v\\|^2 = ${sumSq}`]],
            [["Take the square root", "开平方"], t("", ""), [`\\|v\\| = \\sqrt{${sumSq}} = ${norm}`]],
          ],
          t(`$${norm}^2 = ${sumSq}$, the sum of the squared entries.`, `$${norm}^2 = ${sumSq}$，等于分量的平方和。`),
        );

        return numberProblem({
          prompt,
          answer: norm,
          solution,
          mistakes: [
            why(sumSq, "That is $\\|v\\|^2$; take the square root at the end.", "这是 $\\|v\\|^2$；最后还要开平方。"),
            why(
              v.reduce((s, x) => s + Math.abs(x), 0),
              "That adds the sizes of the entries; the norm adds their squares and takes a square root.",
              "这是把分量的绝对值相加；范数要把平方相加再开方。",
            ),
            why(
              Math.max(...v.map((x) => Math.abs(x))),
              "That is the largest entry alone; every entry contributes its square.",
              "这只是最大的分量；每个分量都要贡献它的平方。",
            ),
          ].filter((w, i, all) => w.value !== norm && all.findIndex((o) => o.value === w.value) === i),
        });
      },
    },
    {
      id: "distance-between-points-in-rn",
      title: t("The distance between two points in $\\mathbb{R}^n$", "$\\mathbb{R}^n$ 中两点间的距离"),
      explanation: t(
        "The distance between two points of $\\mathbb{R}^n$ is the norm of their difference, $d(u, v) = \\|u - v\\| = \\sqrt{(u_1 - v_1)^2 + \\dots + (u_n - v_n)^2}$. Subtract entry by entry first, then square, add and take the square root. The order of subtraction does not matter because the squares remove the signs. For example, $u = (1, 0, 2, 3)$ and $v = (2, 2, 4, 3)$ differ by $(1, 2, 2, 0)$, so $d(u, v) = \\sqrt{1 + 4 + 4 + 0} = 3$.\n\n> **Watch out.** Square the differences before adding them: adding the differences themselves, here $1 + 2 + 2 = 5$, does not give the distance.",
        "$\\mathbb{R}^n$ 中两点间的距离是它们之差的范数，$d(u, v) = \\|u - v\\| = \\sqrt{(u_1 - v_1)^2 + \\dots + (u_n - v_n)^2}$。先逐个分量相减，再平方、相加、开方。相减的顺序无关紧要，因为平方消去了符号。例如 $u = (1, 0, 2, 3)$ 与 $v = (2, 2, 4, 3)$ 之差为 $(1, 2, 2, 0)$，所以 $d(u, v) = \\sqrt{1 + 4 + 4 + 0} = 3$。\n\n> **注意。** 要先把差平方再相加：直接把差相加，这里是 $1 + 2 + 2 = 5$，得不到距离。",
      ),
      generate: (rng: Rng): Problem => {
        const quads: [number[], number][] = [
          [[1, 2, 2, 0], 3],
          [[2, 3, 6, 0], 7],
          [[1, 1, 1, 1], 2],
          [[1, 1, 3, 5], 6],
          [[2, 4, 5, 6], 9],
          [[2, 2, 4, 5], 7],
          [[1, 5, 5, 7], 10],
          [[1, 2, 4, 10], 11],
          [[1, 4, 8, 0], 9],
        ];
        const [base, n] = rng.pick(quads);
        const d = rng.shuffle(base.map((x) => (rng.int(0, 1) === 0 ? x : -x)));
        const u = Array.from({ length: 4 }, () => rng.int(-5, 5));
        const v = u.map((x, i) => x + d[i]!);
        const sq = d.map((x) => x * x);
        return numberProblem({
          prompt: t(
            `Find the distance between $u = (${u.join(", ")})$ and $v = (${v.join(", ")})$ in $\\mathbb{R}^4$.`,
            `求 $\\mathbb{R}^4$ 中 $u = (${u.join(", ")})$ 与 $v = (${v.join(", ")})$ 之间的距离。`,
          ),
          answer: n,
          mistakes: [
            why(n * n, "That is the squared distance; take the square root.", "这是距离的平方；还要开平方。"),
            why(
              d.reduce((s, x) => s + Math.abs(x), 0),
              "That adds the sizes of the differences; square them before adding.",
              "这是把差的绝对值相加；要先平方再相加。",
            ),
            why(
              Math.max(...d.map((x) => Math.abs(x))),
              "That is one coordinate difference; all four differences contribute.",
              "这只是一个坐标的差；四个差都要算进去。",
            ),
          ].filter((w, i, all) => w.value !== n && all.findIndex((o) => o.value === w.value) === i),
          solution: walked(
            [
              [["Subtract", "相减"], t("", ""), [`v - u = (${d.join(", ")})`]],
              [
                ["Square, add and take the root", "平方、相加、开方"],
                t("", ""),
                [`\\|v - u\\| = \\sqrt{${sq.join(" + ")}} = \\sqrt{${n * n}} = ${n}`],
              ],
            ],
            t(
              `$u + (v - u) = (${u.map((x, i) => x + d[i]!).join(", ")}) = v$, so the difference is right, and $${n}^2 = ${n * n}$.`,
              `$u + (v - u) = (${u.map((x, i) => x + d[i]!).join(", ")}) = v$，所以差是对的，且 $${n}^2 = ${n * n}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** innerProductSpaces covers the axiomatic definition and evaluation of general inner products. */
export const innerProductSpaces: TopicDef = {
  id: "inner-product-spaces",
  title: t("Inner Product Spaces", "内积空间"),
  summary: t(
    "Understand the axioms of real inner product spaces and evaluate general inner products on polynomial spaces.",
    "理解实内积空间的公理体系，并在多项式空间上计算广义内积。",
  ),
  intro: t(
    "On polynomials define $\\langle p, q \\rangle = \\int_0^1 p(t)q(t)\\,dt$. For $p(t) = t$ and $q(t) = 3t + 1$ the product is $3t^2 + t$, so $\\langle p, q \\rangle = \\int_0^1 (3t^2 + t)\\,dt = 1 + \\frac{1}{2} = \\frac{3}{2}$.\n\nCheck: swapping the order, $\\langle q, p \\rangle$ integrates $(3t + 1)t$, the same product, so it is also $\\frac{3}{2}$; and $\\langle p, p \\rangle = \\int_0^1 t^2\\,dt = \\frac{1}{3} > 0$, as positivity requires.\n\nIn this lesson we evaluate inner products on spaces other than $\\mathbb{R}^n$ and test whether a formula satisfies the axioms of an inner product.",
    "在多项式上定义 $\\langle p, q \\rangle = \\int_0^1 p(t)q(t)\\,dt$。对 $p(t) = t$，$q(t) = 3t + 1$，乘积是 $3t^2 + t$，所以 $\\langle p, q \\rangle = \\int_0^1 (3t^2 + t)\\,dt = 1 + \\frac{1}{2} = \\frac{3}{2}$。\n\n检验：交换顺序，$\\langle q, p \\rangle$ 积分的是 $(3t + 1)t$，同一个乘积，所以也是 $\\frac{3}{2}$；而 $\\langle p, p \\rangle = \\int_0^1 t^2\\,dt = \\frac{1}{3} > 0$，符合正定性。\n\n本课我们在 $\\mathbb{R}^n$ 以外的空间上计算内积，并检验一个公式是否满足内积的公理。",
  ),
  prerequisites: ["dot-product-in-n-dimensional-euclidean-space"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "inner-product-polynomial-integral",
      title: t("Polynomial Inner Product Under Definite Integral", "定积分形式的多项式内积"),
      explanation: t(
        "On the polynomial space $P_1$, the mapping $\\langle p, q \\rangle = \\int_0^1 p(t)q(t)\\,dt$ defines an inner product satisfying symmetry, additivity, homogeneity, and positive definiteness. To evaluate it, multiply the polynomials and integrate term by term, using $\\int_0^1 t^2\\,dt = \\frac{1}{3}$, $\\int_0^1 t\\,dt = \\frac{1}{2}$ and $\\int_0^1 1\\,dt = 1$. For example, $\\langle t + 1, t - 1 \\rangle = \\int_0^1 (t^2 - 1)\\,dt = \\frac{1}{3} - 1 = -\\frac{2}{3}$.\n\n> **Watch out.** Integrate the product $p(t)q(t)$, not each polynomial separately: $\\int pq$ is not $\\int p \\cdot \\int q$.",
        "在多项式空间 $P_1$ 上，映射 $\\langle p, q \\rangle = \\int_0^1 p(t)q(t)\\,dt$ 定义了一个内积，满足对称性、可加性、齐次性与正定性。计算时先把多项式相乘，再逐项积分，用到 $\\int_0^1 t^2\\,dt = \\frac{1}{3}$、$\\int_0^1 t\\,dt = \\frac{1}{2}$、$\\int_0^1 1\\,dt = 1$。例如 $\\langle t + 1, t - 1 \\rangle = \\int_0^1 (t^2 - 1)\\,dt = \\frac{1}{3} - 1 = -\\frac{2}{3}$。\n\n> **注意。** 要积分乘积 $p(t)q(t)$，而不是分别积分两个多项式：$\\int pq$ 不等于 $\\int p \\cdot \\int q$。",
      ),
      generate: (rng: Rng): Problem => {
        const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const b = rng.int(-4, 4);
        const c = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const d = rng.int(-4, 4);

        // int_0^1 (at + b)(ct + d) dt = (ac)/3 + (ad + bc)/2 + bd
        const num = 2 * a * c + 3 * (a * d + b * c) + 6 * b * d;
        const answer = Q.of(num, 6);

        const prompt = t(
          `On the polynomial vector space $P_1$, define the inner product $\\langle p, q \\rangle = \\int_0^1 p(t)q(t)\\,dt$.\nCompute $\\langle p, q \\rangle$ for:\n$$p(t) = ${formatPoly(a, b)}, \\quad q(t) = ${formatPoly(c, d)}$$`,
          `在多项式空间 $P_1$ 上定义内积 $\\langle p, q \\rangle = \\int_0^1 p(t)q(t)\\,dt$。\n计算下列多项式的内积 $\\langle p, q \\rangle$：\n$$p(t) = ${formatPoly(a, b)}, \\quad q(t) = ${formatPoly(c, d)}$$`,
        );

        const quadCoeff = a * c;
        const linCoeff = a * d + b * c;
        const constCoeff = b * d;
        const integrandExpanded = formatPoly2(quadCoeff, linCoeff, constCoeff);

        const solution = walked(
          [
            [
              ["Multiply the polynomials", "把多项式相乘"],
              t("", ""),
              [`(${formatPoly(a, b)})(${formatPoly(c, d)}) = ${integrandExpanded}`],
            ],
            [
              ["Integrate term by term", "逐项积分"],
              t("", ""),
              [
                `\\int_0^1 (${integrandExpanded})\\,dt = ${signedSum([frac(quadCoeff, 3), frac(linCoeff, 2), String(constCoeff)])} = ${answer.toLatex()}`,
              ],
            ],
          ],
          t(
            `Over the common denominator $6$: $2(${quadCoeff}) + 3(${linCoeff}) + 6(${constCoeff}) = ${num}$, and $\\frac{${num}}{6} = ${answer.toLatex()}$.`,
            `通分到分母 $6$：$2(${quadCoeff}) + 3(${linCoeff}) + 6(${constCoeff}) = ${num}$，而 $\\frac{${num}}{6} = ${answer.toLatex()}$。`,
          ),
        );

        return numberProblem({
          prompt,
          answer,
          solution,
          mistakes: [
            why(
              Q.of(a, 2)
                .add(Q.of(b))
                .mul(Q.of(c, 2).add(Q.of(d))),
              "That multiplies the two integrals; integrate the product instead.",
              "这是把两个积分相乘；应当积分乘积。",
            ),
            why(
              quadCoeff + linCoeff + constCoeff,
              "That evaluates the product at $t = 1$ without integrating each power.",
              "这是把乘积在 $t = 1$ 处求值，没有逐项积分。",
            ),
            why(
              Q.of(quadCoeff, 3).add(Q.of(constCoeff)),
              "The middle term $(ad + bc)t$ of the product was dropped.",
              "漏掉了乘积的中间项 $(ad + bc)t$。",
            ),
            why(
              Q.of(quadCoeff, 2).add(Q.of(linCoeff)).add(Q.of(constCoeff)),
              "The powers were integrated with the wrong factors: $\\int_0^1 t^2\\,dt = \\frac{1}{3}$ and $\\int_0^1 t\\,dt = \\frac{1}{2}$.",
              "幂次积分的系数错了：$\\int_0^1 t^2\\,dt = \\frac{1}{3}$，$\\int_0^1 t\\,dt = \\frac{1}{2}$。",
            ),
          ].filter((w, i, all) => all.findIndex((o) => String(o.value) === String(w.value)) === i),
        });
      },
    },
    {
      id: "deciding-whether-a-bilinear-formula-is-an-inner-product",
      title: t("Deciding whether a formula is an inner product", "判断公式是否为内积"),
      explanation: t(
        "A formula $\\langle x, y \\rangle = a x_1 y_1 + c(x_1 y_2 + x_2 y_1) + b x_2 y_2$ on $\\mathbb{R}^2$ is automatically symmetric and linear in each argument. It is an inner product exactly when it is also positive definite, $\\langle x, x \\rangle = a x_1^2 + 2c x_1 x_2 + b x_2^2 > 0$ for every $x \\ne 0$. That happens precisely when $a > 0$ and $ab - c^2 > 0$; otherwise some nonzero vector has $\\langle x, x \\rangle \\le 0$. For example, $2x_1y_1 + (x_1y_2 + x_2y_1) + x_2y_2$ has $a = 2 > 0$ and $ab - c^2 = 2 - 1 = 1 > 0$, so it is an inner product.\n\n> **Watch out.** Checking $a > 0$ and $b > 0$ is not enough: with $a = b = 1$ and $c = 2$, the vector $(2, -1)$ gives $\\langle x, x \\rangle = 4 - 8 + 1 = -3$.",
        "$\\mathbb{R}^2$ 上的公式 $\\langle x, y \\rangle = a x_1 y_1 + c(x_1 y_2 + x_2 y_1) + b x_2 y_2$ 自动对称，并对每个变元线性。它是内积，当且仅当它还正定，即对每个 $x \\ne 0$ 都有 $\\langle x, x \\rangle = a x_1^2 + 2c x_1 x_2 + b x_2^2 > 0$。这恰好在 $a > 0$ 且 $ab - c^2 > 0$ 时成立；否则存在某个非零向量使 $\\langle x, x \\rangle \\le 0$。例如 $2x_1y_1 + (x_1y_2 + x_2y_1) + x_2y_2$ 有 $a = 2 > 0$，$ab - c^2 = 2 - 1 = 1 > 0$，所以是内积。\n\n> **注意。** 只检查 $a > 0$ 与 $b > 0$ 是不够的：$a = b = 1$、$c = 2$ 时，向量 $(2, -1)$ 给出 $\\langle x, x \\rangle = 4 - 8 + 1 = -3$。",
      ),
      generate: (rng: Rng): Problem => {
        const a = rng.nonZero(-2, 5);
        const b = rng.nonZero(-2, 5);
        const c = rng.int(-3, 3);
        const yes = a > 0 && a * b - c * c > 0;
        const cross = c === 0 ? "" : ` ${c > 0 ? "+" : "-"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}(x_1 y_2 + x_2 y_1)`;
        const first = a === 1 ? "x_1 y_1" : a === -1 ? "-x_1 y_1" : `${a} x_1 y_1`;
        const last = `${b > 0 ? "+" : "-"} ${Math.abs(b) === 1 ? "" : `${Math.abs(b)} `}x_2 y_2`;
        const formula = `${first}${cross} ${last}`;
        const det = a * b - c * c;
        const verdict = yes
          ? t(
              `Here $a = ${a} > 0$ and $ab - c^2 = ${det} > 0$, so $\\langle x, x \\rangle > 0$ for every $x \\ne 0$: it is an inner product.`,
              `这里 $a = ${a} > 0$，$ab - c^2 = ${det} > 0$，所以对每个 $x \\ne 0$ 有 $\\langle x, x \\rangle > 0$：它是内积。`,
            )
          : a <= 0
            ? t(
                `Here $\\langle e_1, e_1 \\rangle = ${a} \\le 0$, so positivity fails: it is not an inner product.`,
                `这里 $\\langle e_1, e_1 \\rangle = ${a} \\le 0$，正定性不成立：它不是内积。`,
              )
            : t(
                `Here $ab - c^2 = ${det} \\le 0$, so some nonzero $x$ has $\\langle x, x \\rangle \\le 0$: it is not an inner product.`,
                `这里 $ab - c^2 = ${det} \\le 0$，所以某个非零 $x$ 使 $\\langle x, x \\rangle \\le 0$：它不是内积。`,
              );
        const witness = a <= 0 ? [1, 0] : [-c, a];
        const witnessValue = a <= 0 ? a : a * det;
        const check = yes
          ? t(
              `$\\langle e_1, e_1 \\rangle = ${a}$ and $\\langle e_2, e_2 \\rangle = ${b}$ are both positive, as they must be for an inner product.`,
              `$\\langle e_1, e_1 \\rangle = ${a}$ 与 $\\langle e_2, e_2 \\rangle = ${b}$ 都为正，内积必须如此。`,
            )
          : t(
              `The nonzero vector $x = (${witness.join(", ")})$ gives $\\langle x, x \\rangle = ${witnessValue} \\le 0$.`,
              `非零向量 $x = (${witness.join(", ")})$ 给出 $\\langle x, x \\rangle = ${witnessValue} \\le 0$。`,
            );
        const solution = walked(
          [
            [
              ["Read the coefficients", "读出系数"],
              t(
                `The formula has $a = ${a}$, $b = ${b}$ and $c = ${c}$; it is symmetric and linear, so only positivity of $\\langle x, x \\rangle$ needs checking.`,
                `公式中 $a = ${a}$，$b = ${b}$，$c = ${c}$；它对称且线性，所以只需检验 $\\langle x, x \\rangle$ 的正定性。`,
              ),
            ],
            [["Test positivity", "检验正定性"], verdict],
          ],
          check,
        );
        const right = yes ? yesNo[0]! : yesNo[1]!;
        const other = yes ? yesNo[1]! : yesNo[0]!;
        return reasoned(
          oneOf(
            rng,
            t(
              `Is $\\langle x, y \\rangle = ${formula}$ an inner product on $\\mathbb{R}^2$?`,
              `$\\langle x, y \\rangle = ${formula}$ 是 $\\mathbb{R}^2$ 上的内积吗？`,
            ),
            right,
            [other],
            solution,
          ),
          [
            yes
              ? [
                  other.en,
                  "Symmetry and linearity hold, and $a > 0$ with $ab - c^2 > 0$ makes $\\langle x, x \\rangle$ positive for every nonzero $x$.",
                  "对称性与线性成立，且 $a > 0$、$ab - c^2 > 0$ 使每个非零 $x$ 的 $\\langle x, x \\rangle$ 为正。",
                ]
              : [
                  other.en,
                  "Symmetry and linearity are not enough: positivity fails, since some nonzero $x$ has $\\langle x, x \\rangle \\le 0$.",
                  "只有对称性与线性还不够：正定性不成立，因为某个非零 $x$ 使 $\\langle x, x \\rangle \\le 0$。",
                ],
          ],
        );
      },
    },
  ],
};

/** innerProductInVectorSpacesOverTheComplexNumbers covers inner products in ℂⁿ. */
export const innerProductInVectorSpacesOverTheComplexNumbers: TopicDef = {
  id: "inner-product-in-vector-spaces-over-the-complex-numbers",
  title: t("The Inner Product in Vector Spaces Over the Complex Numbers", "复数域上向量空间的内积"),
  summary: t(
    "Compute inner products of vectors in ℂⁿ with conjugate symmetry and conjugate linearity.",
    "计算 ℂⁿ 中复向量的内积，掌握共轭对称性与共轭线性。",
  ),
  intro: t(
    "Take $u = (1 + i, 2)$ and $v = (i, 1 - i)$ in $\\mathbb{C}^2$. Conjugating $v$ gives $(-i, 1 + i)$, so $\\langle u, v \\rangle = (1 + i)(-i) + 2(1 + i) = (1 - i) + (2 + 2i) = 3 + i$.\n\nCheck: $\\langle v, u \\rangle = i(1 - i) + (1 - i) \\cdot 2 = (1 + i) + (2 - 2i) = 3 - i$, the conjugate of $3 + i$, as conjugate symmetry requires.\n\nIn this lesson we compute inner products and norms in $\\mathbb{C}^n$, conjugating the entries of the second vector.",
    "在 $\\mathbb{C}^2$ 中取 $u = (1 + i, 2)$，$v = (i, 1 - i)$。$v$ 取共轭得 $(-i, 1 + i)$，所以 $\\langle u, v \\rangle = (1 + i)(-i) + 2(1 + i) = (1 - i) + (2 + 2i) = 3 + i$。\n\n检验：$\\langle v, u \\rangle = i(1 - i) + (1 - i) \\cdot 2 = (1 + i) + (2 - 2i) = 3 - i$，正是 $3 + i$ 的共轭，符合共轭对称性。\n\n本课我们计算 $\\mathbb{C}^n$ 中的内积与范数，对第二个向量的分量取共轭。",
  ),
  prerequisites: ["inner-product-spaces", "vectors-over-the-complex-numbers"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "complex-inner-product-evaluation",
      title: t("Evaluating Complex Inner Products in $\\mathbb{C}^n$", "计算 $\\mathbb{C}^n$ 中的复内积"),
      explanation: t(
        "Conjugating the entries of the second vector makes the inner product of a vector with itself a nonnegative real number, so lengths still make sense. In $\\mathbb{C}^n$, the standard inner product is $\\langle u, v \\rangle = \\sum_{k=1}^n u_k \\overline{v_k}$. It satisfies conjugate symmetry $\\langle u, v \\rangle = \\overline{\\langle v, u \\rangle}$ and conjugate homogeneity $\\langle u, c v \\rangle = \\bar{c} \\langle u, v \\rangle$. For example, $\\langle (i, 1), (1, i) \\rangle = i \\cdot 1 + 1 \\cdot (-i) = 0$.\n\n> **Watch out.** Conjugate the entries of the second vector, not the first: conjugating the first gives $\\langle v, u \\rangle$, the conjugate of the answer. Without any conjugate, $(1, i)$ would pair with itself to $1 + i^2 = 0$.",
        "对第二个向量的分量取共轭，使向量与自身的内积成为非负实数，这样长度仍然有意义。在 $\\mathbb{C}^n$ 中，标准内积定义为 $\\langle u, v \\rangle = \\sum_{k=1}^n u_k \\overline{v_k}$。它满足共轭对称性 $\\langle u, v \\rangle = \\overline{\\langle v, u \\rangle}$ 与共轭齐次性 $\\langle u, c v \\rangle = \\bar{c} \\langle u, v \\rangle$。例如 $\\langle (i, 1), (1, i) \\rangle = i \\cdot 1 + 1 \\cdot (-i) = 0$。\n\n> **注意。** 要对第二个向量的分量取共轭，而不是第一个：对第一个取共轭得到的是 $\\langle v, u \\rangle$，即答案的共轭。如果完全不取共轭，$(1, i)$ 与自身配对会得到 $1 + i^2 = 0$。",
      ),
      generate: (rng: Rng): Problem => {
        const a1 = rng.int(-3, 3);
        const b1 = rng.pick([-3, -2, -1, 1, 2, 3]);
        const a2 = rng.int(-3, 3);
        const b2 = rng.pick([-3, -2, -1, 1, 2, 3]);

        const c1 = rng.int(-3, 3);
        const d1 = rng.pick([-3, -2, -1, 1, 2, 3]);
        const c2 = rng.int(-3, 3);
        const d2 = rng.pick([-3, -2, -1, 1, 2, 3]);

        const re = a1 * c1 + b1 * d1 + a2 * c2 + b2 * d2;
        const im = b1 * c1 - a1 * d1 + b2 * c2 - a2 * d2;
        const rightVal = formatComplex(re, im);
        const plainRe = a1 * c1 - b1 * d1 + a2 * c2 - b2 * d2;
        const plainIm = a1 * d1 + b1 * c1 + a2 * d2 + b2 * c2;

        const prompt = t(
          `In $\\mathbb{C}^2$, with the standard inner product $\\langle u, v \\rangle = u_1 \\overline{v_1} + u_2 \\overline{v_2}$, compute $\\langle u, v \\rangle$ for:\n$$u = ${colVecLatex([formatComplex(a1, b1), formatComplex(a2, b2)])}, \\quad v = ${colVecLatex([formatComplex(c1, d1), formatComplex(c2, d2)])}$$`,
          `在 $\\mathbb{C}^2$ 中，依标准复内积定义 $\\langle u, v \\rangle = u_1 \\overline{v_1} + u_2 \\overline{v_2}$，计算 $\\langle u, v \\rangle$：\n$$u = ${colVecLatex([formatComplex(a1, b1), formatComplex(a2, b2)])}, \\quad v = ${colVecLatex([formatComplex(c1, d1), formatComplex(c2, d2)])}$$`,
        );

        const same = (s: string) => t(`$${s}$`, `$${s}$`);
        const right = same(rightVal);
        const wrong = [
          same(formatComplex(re, -im)),
          same(formatComplex(plainRe, plainIm)),
          same(formatComplex(plainRe, -plainIm)),
          same(formatComplex(-re, im)),
        ];

        const p1 = formatComplex(a1 * c1 + b1 * d1, b1 * c1 - a1 * d1);
        const p2 = formatComplex(a2 * c2 + b2 * d2, b2 * c2 - a2 * d2);
        const solution = walked(
          [
            [
              ["Conjugate the second vector", "对第二个向量取共轭"],
              t("", ""),
              [`\\overline{v} = ${colVecLatex([formatComplex(c1, -d1), formatComplex(c2, -d2)])}`],
            ],
            [
              ["Multiply matching entries", "对应分量相乘"],
              t("", ""),
              [
                `(${formatComplex(a1, b1)})(${formatComplex(c1, -d1)}) = ${p1}`,
                `(${formatComplex(a2, b2)})(${formatComplex(c2, -d2)}) = ${p2}`,
              ],
            ],
            [["Add", "相加"], t("", ""), [`\\langle u, v \\rangle = (${p1}) + (${p2}) = ${rightVal}`]],
          ],
          t(
            `Conjugating $u$ instead gives $\\langle v, u \\rangle = ${formatComplex(re, -im)}$, the conjugate of $${rightVal}$, as conjugate symmetry requires.`,
            `改为对 $u$ 取共轭，得到 $\\langle v, u \\rangle = ${formatComplex(re, -im)}$，正是 $${rightVal}$ 的共轭，符合共轭对称性。`,
          ),
        );

        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            "That is $\\langle v, u \\rangle$: the conjugate went on the first vector instead of the second.",
            "这是 $\\langle v, u \\rangle$：共轭加在了第一个向量上，而不是第二个。",
          ],
          [wrong[1]!.en, "No conjugate was taken; the entries of $v$ must be conjugated.", "没有取共轭；$v$ 的分量必须取共轭。"],
          [wrong[2]!.en, "Both vectors were conjugated; only the second one is.", "两个向量都取了共轭；只对第二个取共轭。"],
          [
            wrong[3]!.en,
            "The real part has the wrong sign; recheck the real parts of the products.",
            "实部的符号错了；请重新检查各乘积的实部。",
          ],
        ]);
      },
    },
    {
      id: "norm-of-a-complex-vector",
      title: t("The norm of a vector in $\\mathbb{C}^n$", "$\\mathbb{C}^n$ 中向量的范数"),
      explanation: t(
        "With the standard inner product on $\\mathbb{C}^n$, $\\langle v, v \\rangle = \\sum v_k \\overline{v_k} = \\sum |v_k|^2$, a sum of nonnegative real numbers. So $\\|v\\|^2$ adds the squared moduli $|a + bi|^2 = a^2 + b^2$ of the entries. Squaring the entries themselves would be a mistake: $(a + bi)^2$ is complex and can even make the sum zero for a nonzero vector. For example, $v = (1 + 2i, 3)$ has $\\|v\\|^2 = (1 + 4) + 9 = 14$.\n\n> **Watch out.** $|a + bi|^2 = a^2 + b^2$ with a plus sign; the real part of $(a + bi)^2$ is $a^2 - b^2$, which is not the modulus.",
        "在 $\\mathbb{C}^n$ 的标准内积下，$\\langle v, v \\rangle = \\sum v_k \\overline{v_k} = \\sum |v_k|^2$，是非负实数之和。所以 $\\|v\\|^2$ 把各分量的模的平方 $|a + bi|^2 = a^2 + b^2$ 相加。直接把分量平方是错误的：$(a + bi)^2$ 是复数，甚至可能使非零向量的和为零。例如 $v = (1 + 2i, 3)$ 的 $\\|v\\|^2 = (1 + 4) + 9 = 14$。\n\n> **注意。** $|a + bi|^2 = a^2 + b^2$，中间是加号；$(a + bi)^2$ 的实部是 $a^2 - b^2$，不是模。",
      ),
      generate: (rng: Rng): Problem => {
        const a1 = rng.int(-4, 4);
        const b1 = rng.nonZero(-4, 4);
        const a2 = rng.nonZero(-4, 4);
        const b2 = rng.int(-4, 4);
        const m1 = a1 * a1 + b1 * b1;
        const m2 = a2 * a2 + b2 * b2;
        const ans = m1 + m2;
        return numberProblem({
          prompt: t(
            `Find $\\|v\\|^2$ for $v = (${formatComplex(a1, b1)}, ${formatComplex(a2, b2)}) \\in \\mathbb{C}^2$.`,
            `对 $v = (${formatComplex(a1, b1)}, ${formatComplex(a2, b2)}) \\in \\mathbb{C}^2$ 求 $\\|v\\|^2$。`,
          ),
          answer: ans,
          mistakes: [
            why(
              a1 * a1 - b1 * b1 + a2 * a2 - b2 * b2,
              "That squares the entries without conjugating; $|a + bi|^2 = a^2 + b^2$.",
              "这是不取共轭直接平方；$|a + bi|^2 = a^2 + b^2$。",
            ),
            why(a1 + b1 + a2 + b2, "That adds the parts of the entries; square each part first.", "这是把各部分相加；要先把每一部分平方。"),
            why(
              (a1 + a2) ** 2 + (b1 + b2) ** 2,
              "That adds the two entries first; take the modulus of each entry separately.",
              "这是先把两个分量相加；要分别取每个分量的模。",
            ),
          ].filter((w, i, all) => w.value !== ans && all.findIndex((o) => o.value === w.value) === i),
          solution: walked(
            [
              [
                ["Square the moduli", "求模的平方"],
                t("", ""),
                [
                  `|${formatComplex(a1, b1)}|^2 = ${a1 < 0 ? `(${a1})` : a1}^2 + ${b1 < 0 ? `(${b1})` : b1}^2 = ${m1}`,
                  `|${formatComplex(a2, b2)}|^2 = ${a2 < 0 ? `(${a2})` : a2}^2 + ${b2 < 0 ? `(${b2})` : b2}^2 = ${m2}`,
                ],
              ],
              [["Add", "相加"], t("", ""), [`\\|v\\|^2 = ${m1} + ${m2} = ${ans}`]],
            ],
            t(
              `Each entry times its conjugate gives its modulus squared: $(${formatComplex(a1, b1)})(${formatComplex(a1, -b1)}) = ${m1}$, a nonnegative real number.`,
              `每个分量乘以它的共轭得到模的平方：$(${formatComplex(a1, b1)})(${formatComplex(a1, -b1)}) = ${m1}$，是非负实数。`,
            ),
          ),
        });
      },
    },
  ],
};

/** normOfAVectorInInnerProductSpaces covers the induced norm in an inner product space. */
export const normOfAVectorInInnerProductSpaces: TopicDef = {
  id: "norm-of-a-vector-in-inner-product-spaces",
  title: t("The Norm of a Vector in Inner Product Spaces", "内积空间中向量的范数"),
  summary: t(
    "Compute the induced norm in an inner product space and verify properties of the norm.",
    "计算内积空间中的导出范数，并验证范数的性质。",
  ),
  intro: t(
    "Under the weighted inner product $\\langle x, y \\rangle = 2x_1y_1 + x_2y_2 + 3x_3y_3$ on $\\mathbb{R}^3$, the vector $v = (1, -2, 1)$ has $\\langle v, v \\rangle = 2(1) + 4 + 3(1) = 9$, so $\\|v\\| = 3$.\n\nCheck: the ordinary dot product gives $\\|v\\|^2 = 1 + 4 + 1 = 6$, and the weights add $(2 - 1)(1) + (3 - 1)(1) = 3$ more, for $9$ in all.\n\nIn this lesson we compute the norm $\\|v\\| = \\sqrt{\\langle v, v \\rangle}$ that an inner product induces, for weighted products on $\\mathbb{R}^n$ and for integrals of polynomials.",
    "在 $\\mathbb{R}^3$ 的加权内积 $\\langle x, y \\rangle = 2x_1y_1 + x_2y_2 + 3x_3y_3$ 下，向量 $v = (1, -2, 1)$ 有 $\\langle v, v \\rangle = 2(1) + 4 + 3(1) = 9$，所以 $\\|v\\| = 3$。\n\n检验：普通点积给出 $\\|v\\|^2 = 1 + 4 + 1 = 6$，权重再多出 $(2 - 1)(1) + (3 - 1)(1) = 3$，合计 $9$。\n\n本课我们计算内积导出的范数 $\\|v\\| = \\sqrt{\\langle v, v \\rangle}$，包括 $\\mathbb{R}^n$ 上的加权内积和多项式的积分内积。",
  ),
  prerequisites: ["norm-of-a-vector-in-n-dimensional-euclidean-space", "inner-product-spaces"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "induced-norm-weighted-space",
      title: t("Induced Norm in a Weighted Inner Product Space", "加权内积空间中的导出范数"),
      explanation: t(
        "In an inner product space $(V, \\langle \\cdot, \\cdot \\rangle)$, the induced norm is $|v| = \\sqrt{\\langle v, v \\rangle}$. For a weighted inner product $\\langle u, v \\rangle = w_1 u_1 v_1 + w_2 u_2 v_2 + w_3 u_3 v_3$ on $\\mathbb{R}^3$, the norm squared is $|v|^2 = w_1 v_1^2 + w_2 v_2^2 + w_3 v_3^2$. For example, with weights $3, 1, 2$ the vector $(1, 2, -1)$ has $\\|v\\|^2 = 3 + 4 + 2 = 9$.\n\n> **Watch out.** Each weight multiplies the square of its entry, so a negative entry still contributes a positive amount. Do not leave the weights out.",
        "在内积空间 $(V, \\langle \\cdot, \\cdot \\rangle)$ 中，导出范数定义为 $|v| = \\sqrt{\\langle v, v \\rangle}$。对于 $\\mathbb{R}^3$ 上的加权内积 $\\langle u, v \\rangle = w_1 u_1 v_1 + w_2 u_2 v_2 + w_3 u_3 v_3$，向量范数的平方为 $|v|^2 = w_1 v_1^2 + w_2 v_2^2 + w_3 v_3^2$。例如权重为 $3, 1, 2$ 时，向量 $(1, 2, -1)$ 有 $\\|v\\|^2 = 3 + 4 + 2 = 9$。\n\n> **注意。** 每个权重乘的是对应分量的平方，所以负分量贡献的也是正数。不要漏掉权重。",
      ),
      generate: (rng: Rng): Problem => {
        const w1 = rng.pick([1, 2, 3, 5]);
        const w2 = rng.pick([1, 2, 3, 4]);
        const w3 = rng.pick([1, 2, 4]);
        const v1 = rng.pick([-3, -2, -1, 1, 2, 3]);
        const v2 = rng.pick([-3, -2, -1, 1, 2, 3]);
        const v3 = rng.pick([-3, -2, -1, 1, 2, 3]);

        const sumVal = w1 * v1 * v1 + w2 * v2 * v2 + w3 * v3 * v3;
        const plain = v1 * v1 + v2 * v2 + v3 * v3;

        const innerProductDef = formatWeightedDot([w1, w2, w3]);
        const prompt = t(
          `In $\\mathbb{R}^3$, consider the weighted inner product $\\langle x, y \\rangle = ${innerProductDef}$.\nFind the square of the induced norm, $\\|v\\|^2 = \\langle v, v \\rangle$, of the vector:\n$$v = ${colVecLatex([v1, v2, v3])}$$`,
          `在 $\\mathbb{R}^3$ 中，考虑加权内积 $\\langle x, y \\rangle = ${innerProductDef}$。\n求向量 $v$ 的导出范数的平方 $\\|v\\|^2 = \\langle v, v \\rangle$：\n$$v = ${colVecLatex([v1, v2, v3])}$$`,
        );

        const solution = walked(
          [
            [
              ["Weight the squared entries", "给分量的平方加权"],
              t("", ""),
              [`\\langle v, v \\rangle = ${w1}(${v1})^2 + ${w2}(${v2})^2 + ${w3}(${v3})^2`],
            ],
            [["Add", "相加"], t("", ""), [`= ${w1 * v1 * v1} + ${w2 * v2 * v2} + ${w3 * v3 * v3} = ${sumVal}`]],
          ],
          t(
            `Without the weights the sum would be $${plain}$; the weights add $(${w1} - 1)(${v1 * v1}) + (${w2} - 1)(${v2 * v2}) + (${w3} - 1)(${v3 * v3}) = ${sumVal - plain}$, and $${plain} + ${sumVal - plain} = ${sumVal}$.`,
            `不加权时和为 $${plain}$；权重多出 $(${w1} - 1)(${v1 * v1}) + (${w2} - 1)(${v2 * v2}) + (${w3} - 1)(${v3 * v3}) = ${sumVal - plain}$，而 $${plain} + ${sumVal - plain} = ${sumVal}$。`,
          ),
        );

        return numberProblem({
          prompt,
          answer: sumVal,
          solution,
          mistakes: [
            why(plain, "The weights were left out; each square is multiplied by its weight.", "漏掉了权重；每个平方都要乘以它的权重。"),
            why(
              w1 * Math.abs(v1) + w2 * Math.abs(v2) + w3 * Math.abs(v3),
              "The entries were not squared; $\\langle v, v \\rangle$ multiplies each entry by itself.",
              "分量没有平方；$\\langle v, v \\rangle$ 要把每个分量乘以它自己。",
            ),
            why(
              w1 * v1 + w2 * v2 + w3 * v3,
              "That weights the entries themselves; square each entry first.",
              "这是给分量本身加权；要先把每个分量平方。",
            ),
          ].filter((w, i, all) => w.value !== sumVal && all.findIndex((o) => o.value === w.value) === i),
        });
      },
    },
    {
      id: "norm-of-a-linear-polynomial-in-l2",
      title: t("The norm of a polynomial under an integral inner product", "积分内积下多项式的范数"),
      explanation: t(
        "With $\\langle p, q \\rangle = \\int_0^1 p(x) q(x)\\,dx$, the induced norm is $\\|p\\| = \\sqrt{\\int_0^1 p(x)^2\\,dx}$. For a linear polynomial,\n\n$$\\|a + bx\\|^2 = \\int_0^1 (a^2 + 2abx + b^2x^2)\\,dx = a^2 + ab + \\frac{b^2}{3}.$$\n\nSquare the polynomial first and integrate the result; integrating first and squaring afterwards gives a different, wrong number. For example, $\\|1 + x\\|^2 = 1 + 1 + \\frac{1}{3} = \\frac{7}{3}$, while $\\left(\\int_0^1 (1 + x)\\,dx\\right)^2 = \\frac{9}{4}$.\n\n> **Watch out.** The middle term of $(a + bx)^2$ is $2abx$, and it integrates to $ab$, not $2ab$.",
        "在 $\\langle p, q \\rangle = \\int_0^1 p(x) q(x)\\,dx$ 下，导出的范数为 $\\|p\\| = \\sqrt{\\int_0^1 p(x)^2\\,dx}$。对一次多项式，\n\n$$\\|a + bx\\|^2 = \\int_0^1 (a^2 + 2abx + b^2x^2)\\,dx = a^2 + ab + \\frac{b^2}{3}$$\n\n要先把多项式平方再积分；先积分再平方会得到另一个错误的数。例如 $\\|1 + x\\|^2 = 1 + 1 + \\frac{1}{3} = \\frac{7}{3}$，而 $\\left(\\int_0^1 (1 + x)\\,dx\\right)^2 = \\frac{9}{4}$。\n\n> **注意。** $(a + bx)^2$ 的中间项是 $2abx$，积分后是 $ab$，不是 $2ab$。",
      ),
      generate: (rng: Rng): Problem => {
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-4, 4);
        const ans = Q.of(3 * a * a + 3 * a * b + b * b, 3);
        const p = formatPoly(b, a).replace(/t/g, "x");
        const square = formatPoly2(b * b, 2 * a * b, a * a).replace(/t/g, "x");
        return numberProblem({
          prompt: t(
            `With $\\langle p, q \\rangle = \\int_0^1 p(x) q(x)\\,dx$, find $\\|p\\|^2$ for $p(x) = ${p}$.`,
            `在 $\\langle p, q \\rangle = \\int_0^1 p(x) q(x)\\,dx$ 下，对 $p(x) = ${p}$ 求 $\\|p\\|^2$。`,
          ),
          answer: ans,
          mistakes: [
            why(
              Q.of((2 * a + b) ** 2, 4),
              "That integrates first and squares afterwards; square the polynomial before integrating.",
              "这是先积分再平方；要先把多项式平方再积分。",
            ),
            why(
              Q.of(a * a + b * b),
              "The middle term $2abx$ was dropped and $x^2$ was not integrated to $\\frac{1}{3}$.",
              "漏掉了中间项 $2abx$，而且 $x^2$ 没有积分成 $\\frac{1}{3}$。",
            ),
            why(
              Q.of(3 * a * a + 6 * a * b + b * b, 3),
              "The middle term $2abx$ integrates to $ab$; the factor $\\frac{1}{2}$ from $\\int_0^1 x\\,dx$ is missing.",
              "中间项 $2abx$ 积分后是 $ab$；漏掉了 $\\int_0^1 x\\,dx$ 带来的因子 $\\frac{1}{2}$。",
            ),
          ],
          solution: walked(
            [
              [["Square the polynomial", "把多项式平方"], t("", ""), [`p(x)^2 = ${square}`]],
              [
                ["Integrate from 0 to 1", "从 0 到 1 积分"],
                t("", ""),
                [`\\int_0^1 (${square})\\,dx = ${signedSum([frac(b * b, 3), String(a * b), String(a * a)])} = ${ans.toLatex()}`],
              ],
            ],
            t(
              `The formula $a^2 + ab + \\frac{b^2}{3}$ with $a = ${a}$ and $b = ${b}$ gives $\\frac{${3 * a * a} ${3 * a * b < 0 ? "-" : "+"} ${Math.abs(3 * a * b)} + ${b * b}}{3} = ${ans.toLatex()}$, which is positive, as a squared norm must be.`,
              `公式 $a^2 + ab + \\frac{b^2}{3}$ 取 $a = ${a}$、$b = ${b}$，得 $\\frac{${3 * a * a} ${3 * a * b < 0 ? "-" : "+"} ${Math.abs(3 * a * b)} + ${b * b}}{3} = ${ans.toLatex()}$，为正，范数的平方必须如此。`,
            ),
          ),
        });
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE 6.22: ORTHOGONALITY
// ════════════════════════════════════════════════════════════════════════════

/** orthogonalVectorsInEuclideanSpaces covers orthogonality of vectors in ℝⁿ. */
export const orthogonalVectorsInEuclideanSpaces: TopicDef = {
  id: "orthogonal-vectors-in-euclidean-spaces",
  title: t("Orthogonal Vectors in Euclidean Spaces", "欧几里得空间中的正交向量"),
  summary: t(
    "Determine whether vectors in ℝⁿ are orthogonal and solve for unknown coordinates.",
    "判断 ℝⁿ 中的向量是否正交，并求解未知坐标。",
  ),
  intro: t(
    "The vectors $u = (2, 1, -1, 3)$ and $v = (1, 1, 6, 1)$ in $\\mathbb{R}^4$ have $u \\cdot v = 2 + 1 - 6 + 3 = 0$, so they are orthogonal. To make $(1, 2, 0, 1)$ orthogonal to $(3, -1, 4, k)$, set $3 - 2 + 0 + k = 0$, which gives $k = -1$.\n\nCheck: with $k = -1$, $(1, 2, 0, 1) \\cdot (3, -1, 4, -1) = 3 - 2 + 0 - 1 = 0$.\n\nIn this lesson we test orthogonality in $\\mathbb{R}^n$ with the dot product and solve for an entry that makes two vectors orthogonal.",
    "$\\mathbb{R}^4$ 中的向量 $u = (2, 1, -1, 3)$ 与 $v = (1, 1, 6, 1)$ 有 $u \\cdot v = 2 + 1 - 6 + 3 = 0$，所以它们正交。要使 $(1, 2, 0, 1)$ 与 $(3, -1, 4, k)$ 正交，令 $3 - 2 + 0 + k = 0$，得 $k = -1$。\n\n检验：$k = -1$ 时，$(1, 2, 0, 1) \\cdot (3, -1, 4, -1) = 3 - 2 + 0 - 1 = 0$。\n\n本课我们用点积检验 $\\mathbb{R}^n$ 中的正交性，并求使两个向量正交的未知分量。",
  ),
  prerequisites: ["dot-product-in-n-dimensional-euclidean-space"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "solve-orthogonal-parameter-rn",
      title: t("Solving for Orthogonality in $\\mathbb{R}^n$", "求解满足正交性的参数"),
      explanation: t(
        "Set the dot product equal to zero, which gives a linear equation in the unknown entry, and solve it. Two vectors $u, v \\in \\mathbb{R}^n$ are orthogonal if and only if their dot product is zero: $u \\cdot v = 0$. For example, $(1, 3, -2, 2) \\cdot (2, 0, 1, k) = 2 + 0 - 2 + 2k = 2k$, so $k = 0$; and $(1, 1, 1, 2) \\cdot (1, 2, 3, k) = 6 + 2k = 0$ gives $k = -3$.\n\n> **Watch out.** Moving the known part across the equals sign changes its sign, and then divide by the coefficient of $k$: $6 + 2k = 0$ gives $k = -\\frac{6}{2}$, not $\\frac{6}{2}$ or $-6$.",
        "令点积等于零，得到关于未知分量的一次方程，再解出它。两个向量 $u, v \\in \\mathbb{R}^n$ 正交当且仅当其点积为零：$u \\cdot v = 0$。例如 $(1, 3, -2, 2) \\cdot (2, 0, 1, k) = 2 + 0 - 2 + 2k = 2k$，所以 $k = 0$；而 $(1, 1, 1, 2) \\cdot (1, 2, 3, k) = 6 + 2k = 0$ 给出 $k = -3$。\n\n> **注意。** 把已知部分移到等号另一边要变号，然后除以 $k$ 的系数：$6 + 2k = 0$ 给出 $k = -\\frac{6}{2}$，不是 $\\frac{6}{2}$，也不是 $-6$。",
      ),
      generate: (rng: Rng): Problem => {
        const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const b = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const c = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const d = rng.pick([-3, -2, -1, 1, 2, 3]);

        const x1 = rng.int(-3, 3);
        const x2 = rng.int(-3, 3);
        const x3 = rng.int(-3, 3);

        const s = a * x1 + b * x2 + c * x3;
        // a*x1 + b*x2 + c*x3 + d*k = 0 => k = -s / d
        const answer = Q.of(-s, d);

        const prompt = t(
          `Find the value of $k$ that makes the vectors $u, v \\in \\mathbb{R}^4$ orthogonal:\n$$u = ${colVecLatex([a, b, c, d])}, \\quad v = ${colVecLatex([x1, x2, x3, "k"])}$$`,
          `求使得向量 $u, v \\in \\mathbb{R}^4$ 相互正交的常数 $k$ 的值：\n$$u = ${colVecLatex([a, b, c, d])}, \\quad v = ${colVecLatex([x1, x2, x3, "k"])}$$`,
        );

        const dTerm = d === 1 ? "+ k" : d === -1 ? "- k" : d > 0 ? `+ ${d}k` : `- ${-d}k`;
        const lead = s === 0 ? dTerm.replace("+ ", "").replace("- ", "-") : `${s} ${dTerm}`;
        const solution = walked(
          [
            [
              ["Write the dot product", "写出点积"],
              t("", ""),
              [`u \\cdot v = (${a})(${x1}) + (${b})(${x2}) + (${c})(${x3}) + (${d})k = ${lead}`],
            ],
            [["Set it to zero and solve", "令其为零并求解"], t("", ""), [`${lead} = 0`, `k = ${answer.toLatex()}`]],
          ],
          t(
            `With this $k$, the last product is $(${d})\\left(${answer.toLatex()}\\right) = ${-s}$, which cancels the other three products, $${s}$.`,
            `取这个 $k$，最后一个乘积是 $(${d})\\left(${answer.toLatex()}\\right) = ${-s}$，正好抵消其余三个乘积之和 $${s}$。`,
          ),
        );

        return numberProblem({
          prompt,
          answer,
          solveFor: "k",
          solution,
          mistakes: [
            why(
              Q.of(s, d),
              "The sign is wrong: moving the known part across the equals sign changes its sign.",
              "符号错了：把已知部分移到等号另一边要变号。",
            ),
            why(Q.of(-s), `The division by the coefficient $${d}$ of $k$ is missing.`, `漏掉了除以 $k$ 的系数 $${d}$。`),
            why(
              0,
              "With $k = 0$ the dot product is the sum of the other products, which is not zero.",
              "$k = 0$ 时点积等于其余乘积之和，不为零。",
            ),
            ...(s === 0
              ? []
              : [why(Q.of(-d, s), "The fraction is upside down: divide by the coefficient of $k$.", "分数颠倒了：要除以 $k$ 的系数。")]),
          ].filter((w, i, all) => all.findIndex((o) => String(o.value) === String(w.value)) === i),
        });
      },
    },
    {
      id: "testing-orthogonality-in-rn",
      title: t("Testing whether two vectors are orthogonal", "检验两个向量是否正交"),
      explanation: t(
        "Two vectors of $\\mathbb{R}^n$ are orthogonal exactly when their dot product is zero. Nothing about their lengths or the size of individual entries matters: compute $u \\cdot v$ and compare it with $0$. The zero vector is orthogonal to every vector, including itself. For example, $(1, 2, 0, -1) \\cdot (2, -1, 5, 0) = 2 - 2 + 0 + 0 = 0$, so these are orthogonal, although no entry pairs with a zero.\n\n> **Watch out.** A dot product of $1$ or $-1$ is small but not zero, so the vectors are not orthogonal. Add every product before deciding.",
        "$\\mathbb{R}^n$ 中两个向量正交，当且仅当它们的点积为零。与长度或单个分量的大小无关：计算 $u \\cdot v$ 并与 $0$ 比较。零向量与每个向量都正交，包括它自己。例如 $(1, 2, 0, -1) \\cdot (2, -1, 5, 0) = 2 - 2 + 0 + 0 = 0$，所以它们正交，尽管并非每对分量中都有零。\n\n> **注意。** 点积为 $1$ 或 $-1$ 虽然很小，但不是零，向量不正交。要把所有乘积加完再下结论。",
      ),
      generate: (rng: Rng): Problem => {
        const u = [rng.nonZero(-4, 4), rng.int(-4, 4), rng.nonZero(-4, 4), rng.int(-4, 4)];
        const m = rng.nonZero(-2, 2);
        const n = rng.nonZero(-2, 2);
        const v = [m * u[1]!, -m * u[0]!, n * u[3]!, -n * u[2]!];
        if (rng.int(0, 1) === 0) v[0] = v[0]! + rng.pick([-1, 1]);
        const products = u.map((x, i) => x * v[i]!);
        const dot = products.reduce((s, x) => s + x, 0);
        const terms = u.map((x, i) => `(${x})(${v[i]!})`).join(" + ");
        const right = dot === 0 ? yesNo[0]! : yesNo[1]!;
        const other = dot === 0 ? yesNo[1]! : yesNo[0]!;
        const solution = walked(
          [
            [
              ["Compute the dot product", "计算点积"],
              t("", ""),
              [`u \\cdot v = ${terms}`, `= ${signedSum(products.map(String))} = ${dot}`],
            ],
            [
              ["Compare with zero", "与零比较"],
              t(
                `The dot product is $${dot}$, so they are ${dot === 0 ? "" : "not "}orthogonal.`,
                `点积为 $${dot}$，所以它们${dot === 0 ? "" : "不"}正交。`,
              ),
            ],
          ],
          t(
            `The first two products add to $${products[0]! + products[1]!}$ and the last two to $${products[2]! + products[3]!}$, which total $${dot}$.`,
            `前两个乘积之和为 $${products[0]! + products[1]!}$，后两个之和为 $${products[2]! + products[3]!}$，合计 $${dot}$。`,
          ),
        );
        return reasoned(
          oneOf(
            rng,
            t(
              `Are $u = (${u.join(", ")})$ and $v = (${v.join(", ")})$ orthogonal?`,
              `$u = (${u.join(", ")})$ 与 $v = (${v.join(", ")})$ 正交吗？`,
            ),
            right,
            [other],
            solution,
          ),
          [
            dot === 0
              ? [other.en, "The products cancel: the dot product is exactly $0$.", "乘积互相抵消：点积恰好为 $0$。"]
              : [
                  other.en,
                  `The dot product is $${dot}$, not $0$; a nonzero dot product, however small, means not orthogonal.`,
                  `点积为 $${dot}$，不是 $0$；点积不为零，无论多小，都说明不正交。`,
                ],
          ],
        );
      },
    },
  ],
};

/** orthogonalVectorsInInnerProductSpaces covers orthogonality under general inner products. */
export const orthogonalVectorsInInnerProductSpaces: TopicDef = {
  id: "orthogonal-vectors-in-inner-product-spaces",
  title: t("Orthogonal Vectors in Inner Product Spaces", "内积空间中的正交向量"),
  summary: t(
    "Determine orthogonality of functions and polynomials in general inner product spaces.",
    "在广义内积空间中判断函数与多项式的正交性。",
  ),
  intro: t(
    "In $C[0, 1]$ with $\\langle f, g \\rangle = \\int_0^1 f(t)g(t)\\,dt$, the functions $p(t) = t$ and $q(t) = t + k$ have $\\langle p, q \\rangle = \\int_0^1 (t^2 + kt)\\,dt = \\frac{1}{3} + \\frac{k}{2}$. This is zero when $k = -\\frac{2}{3}$.\n\nCheck: $\\int_0^1 t\\left(t - \\frac{2}{3}\\right)dt = \\frac{1}{3} - \\frac{2}{3} \\cdot \\frac{1}{2} = \\frac{1}{3} - \\frac{1}{3} = 0$.\n\nIn this lesson we decide orthogonality with inner products other than the dot product: integrals of polynomials and weighted products on $\\mathbb{R}^2$.",
    "在内积为 $\\langle f, g \\rangle = \\int_0^1 f(t)g(t)\\,dt$ 的 $C[0, 1]$ 中，函数 $p(t) = t$ 与 $q(t) = t + k$ 有 $\\langle p, q \\rangle = \\int_0^1 (t^2 + kt)\\,dt = \\frac{1}{3} + \\frac{k}{2}$。当 $k = -\\frac{2}{3}$ 时它为零。\n\n检验：$\\int_0^1 t\\left(t - \\frac{2}{3}\\right)dt = \\frac{1}{3} - \\frac{2}{3} \\cdot \\frac{1}{2} = \\frac{1}{3} - \\frac{1}{3} = 0$。\n\n本课我们用点积以外的内积判断正交：多项式的积分内积，以及 $\\mathbb{R}^2$ 上的加权内积。",
  ),
  prerequisites: ["orthogonal-vectors-in-euclidean-spaces", "inner-product-spaces"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "orthogonality-in-polynomial-space",
      title: t("Orthogonality Under Polynomial Integral Inner Product", "多项式积分内积下的正交性"),
      explanation: t(
        "Two vectors $f, g$ in an inner product space are orthogonal if $\\langle f, g \\rangle = 0$. On $C[0, 1]$ with $\\langle f, g \\rangle = \\int_0^1 f(t)g(t)\\,dt$, two polynomials $p, q$ are orthogonal if $\\int_0^1 p(t)q(t)\\,dt = 0$. For example, $p(t) = t^2$ and $q(t) = t + k$ give $\\frac{1}{4} + \\frac{k}{3} = 0$, so $k = -\\frac{3}{4}$.\n\n> **Watch out.** Integrating raises each power by one: $\\int_0^1 t^j\\,dt = \\frac{1}{j + 1}$. Multiply the polynomials before integrating.",
        "内积空间中的两向量 $f, g$ 正交当且仅当 $\\langle f, g \\rangle = 0$。在赋有内积 $\\langle f, g \\rangle = \\int_0^1 f(t)g(t)\\,dt$ 的 $C[0, 1]$ 上，多项式 $p, q$ 正交当且仅当 $\\int_0^1 p(t)q(t)\\,dt = 0$。例如 $p(t) = t^2$ 与 $q(t) = t + k$ 给出 $\\frac{1}{4} + \\frac{k}{3} = 0$，所以 $k = -\\frac{3}{4}$。\n\n> **注意。** 积分使每个幂次加一：$\\int_0^1 t^j\\,dt = \\frac{1}{j + 1}$。要先把多项式相乘再积分。",
      ),
      generate: (rng: Rng): Problem => {
        const m = rng.pick([1, 2, 3]);
        const n = rng.pick([1, 2, 3]);
        const a = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);

        // int_0^1 t^m (a t^n + k) dt = a / (m + n + 1) + k / (m + 1) = 0
        // k = -a * (m + 1) / (m + n + 1)
        const answer = Q.of(-a * (m + 1), m + n + 1);

        const pmStr = m === 1 ? "t" : `t^${m}`;
        const qnStr = n === 1 ? "t" : `t^${n}`;
        const aCoeff = a === 1 ? "" : a === -1 ? "-" : `${a}`;

        const prompt = t(
          `In $C[0, 1]$ with inner product $\\langle f, g \\rangle = \\int_0^1 f(t)g(t)\\,dt$, for what value of $k$ are $p(t) = ${pmStr}$ and $q(t) = ${aCoeff}${qnStr} + k$ orthogonal?`,
          `在赋有内积 $\\langle f, g \\rangle = \\int_0^1 f(t)g(t)\\,dt$ 的 $C[0, 1]$ 空间中，常数 $k$ 为何值时，$p(t) = ${pmStr}$ 与 $q(t) = ${aCoeff}${qnStr} + k$ 相互正交？`,
        );

        const solution = walked(
          [
            [
              ["Multiply and integrate", "相乘并积分"],
              t("", ""),
              [`\\int_0^1 (${aCoeff}t^{${m + n}} + kt^{${m}})\\,dt = ${frac(a, m + n + 1)} + \\frac{k}{${m + 1}}`],
            ],
            [
              ["Set it to zero and solve", "令其为零并求解"],
              t("", ""),
              [`\\frac{k}{${m + 1}} = ${frac(-a, m + n + 1)}`, `k = ${answer.toLatex()}`],
            ],
          ],
          t(
            `With this $k$, $\\frac{k}{${m + 1}} = ${frac(-a, m + n + 1)}$ cancels $\\int_0^1 ${aCoeff}t^{${m + n}}\\,dt = ${frac(a, m + n + 1)}$, so the inner product is $0$.`,
            `取这个 $k$，$\\frac{k}{${m + 1}} = ${frac(-a, m + n + 1)}$ 正好抵消 $\\int_0^1 ${aCoeff}t^{${m + n}}\\,dt = ${frac(a, m + n + 1)}$，内积为 $0$。`,
          ),
        );

        return numberProblem({
          prompt,
          answer,
          solveFor: "k",
          solution,
          mistakes: [
            why(Q.of(a * (m + 1), m + n + 1), "The sign is wrong: $k$ must cancel the other term.", "符号错了：$k$ 必须抵消另一项。"),
            why(
              Q.of(-a, m + n + 1),
              `The factor $${m + 1}$ is missing: $k$ is divided by $${m + 1}$ in the integral, so multiply by it.`,
              `漏掉了因子 $${m + 1}$：积分中 $k$ 除以 $${m + 1}$，所以要乘回来。`,
            ),
            why(
              Q.of(-a * (m + n + 1), m + 1),
              "The fraction is upside down: $\\int_0^1 t^j\\,dt = \\frac{1}{j + 1}$.",
              "分数颠倒了：$\\int_0^1 t^j\\,dt = \\frac{1}{j + 1}$。",
            ),
            why(
              Q.of(-a * m, m + n),
              "The powers were not raised by one when integrating: $\\int_0^1 t^j\\,dt = \\frac{1}{j + 1}$.",
              "积分时幂次没有加一：$\\int_0^1 t^j\\,dt = \\frac{1}{j + 1}$。",
            ),
            why(0, "With $k = 0$ the inner product is not zero.", "$k = 0$ 时内积不为零。"),
          ].filter((w, i, all) => all.findIndex((o) => String(o.value) === String(w.value)) === i),
        });
      },
    },
    {
      id: "orthogonality-under-a-weighted-inner-product",
      title: t("Orthogonality under a weighted inner product", "加权内积下的正交"),
      explanation: t(
        "Orthogonality depends on the inner product. Under $\\langle x, y \\rangle = a x_1 y_1 + b x_2 y_2$ with $a, b > 0$, the vectors $(1, k)$ and $(p, q)$ are orthogonal when $ap + bkq = 0$, that is $k = -\\frac{ap}{bq}$. Vectors that are orthogonal for the dot product are usually not orthogonal for a weighted product, and vice versa. For example, with $a = 2$ and $b = 3$, $(1, k)$ is orthogonal to $(3, 1)$ when $6 + 3k = 0$, so $k = -2$; for the dot product the answer would be $k = -3$.\n\n> **Watch out.** Each weight goes with its own coordinate: $a$ multiplies the first entries and $b$ the second. Leaving the weights out gives the dot product answer.",
        "正交依赖于内积。在 $a, b > 0$ 的 $\\langle x, y \\rangle = a x_1 y_1 + b x_2 y_2$ 下，向量 $(1, k)$ 与 $(p, q)$ 正交当 $ap + bkq = 0$，即 $k = -\\frac{ap}{bq}$。对点积正交的向量通常对加权内积不正交，反之亦然。例如 $a = 2$、$b = 3$ 时，$(1, k)$ 与 $(3, 1)$ 正交当 $6 + 3k = 0$，所以 $k = -2$；对点积答案则是 $k = -3$。\n\n> **注意。** 每个权重对应自己的坐标：$a$ 乘第一个分量，$b$ 乘第二个分量。漏掉权重就得到点积下的答案。",
      ),
      generate: (rng: Rng): Problem => {
        const a = rng.int(2, 5);
        const b = rng.pick([1, 2, 3, 4, 5].filter((w) => w !== a));
        const p = rng.nonZero(-4, 4);
        const q = rng.nonZero(-4, 4);
        const k = Q.of(-a * p, b * q);
        const weights = `${a} x_1 y_1 + ${b === 1 ? "" : `${b} `}x_2 y_2`;
        const equation = `${a * p} ${b * q < 0 ? "-" : "+"} ${Math.abs(b * q) === 1 ? "" : Math.abs(b * q)}k`;
        return numberProblem({
          prompt: t(
            `On $\\mathbb{R}^2$ use $\\langle x, y \\rangle = ${weights}$. Find $k$ so that $(1, k)$ is orthogonal to $(${p}, ${q})$.`,
            `在 $\\mathbb{R}^2$ 上使用 $\\langle x, y \\rangle = ${weights}$。求 $k$ 使 $(1, k)$ 与 $(${p}, ${q})$ 正交。`,
          ),
          answer: k,
          mistakes: [
            why(Q.of(-p, q), "The weights were left out; that is the answer for the dot product.", "漏掉了权重；这是点积下的答案。"),
            why(Q.of(-b * p, a * q), "The weights are swapped: $a$ goes with the first entries.", "权重交换了：$a$ 对应第一个分量。"),
            why(k.neg(), "The sign is wrong: $bqk$ must cancel $ap$.", "符号错了：$bqk$ 必须抵消 $ap$。"),
          ],
          solution: walked(
            [
              [
                ["Write the inner product", "写出内积"],
                t("", ""),
                [`\\langle (1, k), (${p}, ${q}) \\rangle = ${a}(1)(${p}) + ${b}(k)(${q}) = ${equation}`],
              ],
              [["Set it to zero and solve", "令其为零并求解"], t("", ""), [`${equation} = 0`, `k = ${k.toLatex()}`]],
            ],
            t(
              `$${b * q} \\cdot \\left(${k.toLatex()}\\right) = ${-a * p}$, which cancels $${a * p}$, so the inner product is $0$.`,
              `$${b * q} \\cdot \\left(${k.toLatex()}\\right) = ${-a * p}$，正好抵消 $${a * p}$，内积为 $0$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** cauchySchwarzInequalityAndAngleBetweenTwoVectors covers the Cauchy-Schwarz inequality and angle between vectors. */
export const cauchySchwarzInequalityAndAngleBetweenTwoVectors: TopicDef = {
  id: "cauchy-schwarz-inequality-and-angle-between-two-vectors",
  title: t("The Cauchy-Schwarz Inequality and the Angle Between Two Vectors", "柯西-施瓦茨不等式与两向量的夹角"),
  summary: t(
    "Apply the Cauchy-Schwarz inequality |⟨u, v⟩| ≤ ‖u‖‖v‖ and compute the cosine of the angle between two vectors.",
    "应用柯西-施瓦茨不等式 |⟨u, v⟩| ≤ ‖u‖‖v‖ 并计算两向量夹角的余弦值。",
  ),
  intro: t(
    "For $u = (1, 1, 1, 1)$ and $v = (1, 2, 2, 0)$ in $\\mathbb{R}^4$, $u \\cdot v = 5$, $\\|u\\| = 2$ and $\\|v\\| = 3$. So $\\cos\\theta = \\frac{5}{2 \\cdot 3} = \\frac{5}{6}$.\n\nCheck: the Cauchy–Schwarz inequality says $|u \\cdot v| \\le \\|u\\|\\,\\|v\\|$, and indeed $5 \\le 6$, so the cosine lies between $-1$ and $1$ as it must.\n\nIn this lesson we use $\\cos\\theta = \\frac{u \\cdot v}{\\|u\\|\\,\\|v\\|}$ to find angles and use the Cauchy–Schwarz inequality to find the largest value of a linear expression on a sphere.",
    "对 $\\mathbb{R}^4$ 中的 $u = (1, 1, 1, 1)$ 与 $v = (1, 2, 2, 0)$，$u \\cdot v = 5$，$\\|u\\| = 2$，$\\|v\\| = 3$。所以 $\\cos\\theta = \\frac{5}{2 \\cdot 3} = \\frac{5}{6}$。\n\n检验：柯西–施瓦茨不等式说 $|u \\cdot v| \\le \\|u\\|\\,\\|v\\|$，确实 $5 \\le 6$，所以余弦值在 $-1$ 与 $1$ 之间，理应如此。\n\n本课我们用 $\\cos\\theta = \\frac{u \\cdot v}{\\|u\\|\\,\\|v\\|}$ 求夹角，并用柯西–施瓦茨不等式求球面上线性式的最大值。",
  ),
  prerequisites: ["norm-of-a-vector-in-inner-product-spaces"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "angle-cosine-cauchy-schwarz",
      figure: linearAlgebraDrawings2["cauchy-schwarz-inequality-and-angle-between-two-vectors#angle-cosine-cauchy-schwarz"],
      title: t("Cosine of the Angle Between Vectors", "两向量夹角的余弦值"),
      explanation: t(
        "By the Cauchy-Schwarz inequality, $|u \\cdot v| \\le |u| |v|$ for all vectors $u, v$. The angle $\\theta$ between two nonzero vectors in an inner product space is defined by $\\cos \\theta = \\frac{u \\cdot v}{|u| |v|}$. For example, $u = (3, 4, 0, 0)$ and $v = (0, 2, 1, 2)$ have $u \\cdot v = 8$, $\\|u\\| = 5$ and $\\|v\\| = 3$, so $\\cos\\theta = \\frac{8}{15}$.\n\n> **Watch out.** Divide by the product of the norms, not of the squared norms. A result outside $[-1, 1]$ means an arithmetic slip, since Cauchy–Schwarz forbids it.",
        "由柯西-施瓦茨不等式，对任意向量 $u, v$ 均有 $|u \\cdot v| \\le |u| |v|$。内积空间中两非零向量之间的夹角 $\\theta$ 满足 $\\cos \\theta = \\frac{u \\cdot v}{|u| |v|}$。例如 $u = (3, 4, 0, 0)$ 与 $v = (0, 2, 1, 2)$ 有 $u \\cdot v = 8$，$\\|u\\| = 5$，$\\|v\\| = 3$，所以 $\\cos\\theta = \\frac{8}{15}$。\n\n> **注意。** 要除以范数之积，而不是范数平方之积。结果落在 $[-1, 1]$ 之外说明算错了，因为柯西–施瓦茨不等式不允许这样。",
      ),
      generate: (rng: Rng): Problem => {
        const normTuples = [
          { u: [1, 1, 1, 1], nu: 2 },
          { u: [2, 0, 0, 0], nu: 2 },
          { u: [1, 2, 2, 0], nu: 3 },
          { u: [0, 2, 1, 2], nu: 3 },
          { u: [2, 2, 2, 2], nu: 4 },
          { u: [1, 2, 2, 4], nu: 5 },
          { u: [3, 4, 0, 0], nu: 5 },
        ];

        const t1 = rng.pick(normTuples);
        const t2 = rng.pick(normTuples);
        const s1 = rng.pick([1, -1]);
        const s2 = rng.pick([1, -1]);

        const u = t1.u.map((x) => x * s1);
        const v = t2.u.map((x) => x * s2);

        let dot = 0;
        for (let i = 0; i < 4; i++) {
          dot += u[i]! * v[i]!;
        }

        const denom = t1.nu * t2.nu;
        const answer = Q.of(dot, denom);

        const prompt = t(
          `Compute $\\cos \\theta$, where $\\theta$ is the angle between the vectors $u, v \\in \\mathbb{R}^4$:\n$$u = ${colVecLatex(u)}, \\quad v = ${colVecLatex(v)}$$`,
          `计算向量 $u, v \\in \\mathbb{R}^4$ 之间夹角 $\\theta$ 的余弦值 $\\cos \\theta$：\n$$u = ${colVecLatex(u)}, \\quad v = ${colVecLatex(v)}$$`,
        );

        const solution = walked(
          [
            [
              ["Compute the dot product", "计算点积"],
              t("", ""),
              [`u \\cdot v = ${u.map((x, i) => `(${x})(${v[i]!})`).join(" + ")} = ${dot}`],
            ],
            [
              ["Compute the norms", "计算范数"],
              t("", ""),
              [`\\|u\\| = \\sqrt{${t1.nu * t1.nu}} = ${t1.nu}, \\quad \\|v\\| = \\sqrt{${t2.nu * t2.nu}} = ${t2.nu}`],
            ],
            [
              ["Divide", "相除"],
              t("", ""),
              [`\\cos \\theta = \\frac{u \\cdot v}{\\|u\\| \\|v\\|} = \\frac{${dot}}{${denom}} = ${answer.toLatex()}`],
            ],
          ],
          t(
            `$|${dot}| \\le ${denom}$, as the Cauchy–Schwarz inequality requires, so the cosine lies in $[-1, 1]$.`,
            `$|${dot}| \\le ${denom}$，符合柯西–施瓦茨不等式，所以余弦值在 $[-1, 1]$ 内。`,
          ),
        );

        return numberProblem({
          prompt,
          answer,
          solution,
          mistakes: [
            why(
              Q.of(-dot, denom),
              "The sign is flipped; the sign of the cosine is the sign of $u \\cdot v$.",
              "符号反了；余弦的符号就是 $u \\cdot v$ 的符号。",
            ),
            why(
              Q.of(dot, denom * denom),
              "That divides by the product of the squared norms; use the norms themselves.",
              "这是除以范数平方之积；要用范数本身。",
            ),
            why(
              Q.of(dot, t1.nu + t2.nu),
              "That divides by the sum of the norms; divide by their product.",
              "这是除以范数之和；要除以范数之积。",
            ),
          ].filter((w, i, all) => all.findIndex((o) => String(o.value) === String(w.value)) === i),
        });
      },
    },
    {
      id: "maximizing-a-linear-expression-on-a-sphere",
      figure: linearAlgebraDrawings2["cauchy-schwarz-inequality-and-angle-between-two-vectors#maximizing-a-linear-expression-on-a-sphere"],
      title: t("Maximizing a linear expression on a sphere", "在球面上求线性式的最大值"),
      explanation: t(
        "The Cauchy–Schwarz inequality $|u \\cdot v| \\le \\|u\\|\\,\\|v\\|$ turns into an optimization tool. With $u = (a, b, c)$ and $v = (x, y, z)$ on the sphere $x^2 + y^2 + z^2 = R^2$,\n\n$$ax + by + cz \\le R\\sqrt{a^2 + b^2 + c^2},$$\n\nwith equality when $v$ points in the same direction as $u$. So the maximum is $R\\,\\|u\\|$ and the minimum is $-R\\,\\|u\\|$. For example, on $x^2 + y^2 + z^2 = 4$ the expression $x + 2y + 2z$ has maximum $2 \\cdot 3 = 6$, at $(x, y, z) = \\frac{2}{3}(1, 2, 2)$.\n\n> **Watch out.** The radius is the square root of the right side: $x^2 + y^2 + z^2 = 4$ has $R = 2$, not $4$. The coefficient vector contributes its norm, not the sum of its entries.",
        "柯西–施瓦茨不等式 $|u \\cdot v| \\le \\|u\\|\\,\\|v\\|$ 可以用来求最值。令 $u = (a, b, c)$，$v = (x, y, z)$ 在球面 $x^2 + y^2 + z^2 = R^2$ 上，则\n\n$$ax + by + cz \\le R\\sqrt{a^2 + b^2 + c^2},$$\n\n当 $v$ 与 $u$ 同向时取等号。所以最大值为 $R\\,\\|u\\|$，最小值为 $-R\\,\\|u\\|$。例如在 $x^2 + y^2 + z^2 = 4$ 上，$x + 2y + 2z$ 的最大值为 $2 \\cdot 3 = 6$，在 $(x, y, z) = \\frac{2}{3}(1, 2, 2)$ 处取到。\n\n> **注意。** 半径是右边的平方根：$x^2 + y^2 + z^2 = 4$ 的 $R = 2$，不是 $4$。系数向量贡献的是它的范数，不是分量之和。",
      ),
      generate: (rng: Rng): Problem => {
        const triples: [number[], number][] = [
          [[1, 2, 2], 3],
          [[2, 3, 6], 7],
          [[1, 4, 8], 9],
          [[2, 6, 9], 11],
          [[4, 4, 7], 9],
          [[2, 10, 11], 15],
        ];
        const [base, n] = rng.pick(triples);
        const u = rng.shuffle(base.map((x) => (rng.int(0, 1) === 0 ? x : -x)));
        const R = rng.int(1, 5);
        const max = rng.int(0, 2) > 0;
        const sign = max ? 1 : -1;
        const ans = sign * R * n;
        const lin = formatLinEq(u, ["x", "y", "z"]);
        const scale = frac(sign * R, n);
        return numberProblem({
          prompt: t(
            `Find the ${max ? "maximum" : "minimum"} of $${lin}$ subject to $x^2 + y^2 + z^2 = ${R * R}$.`,
            `在 $x^2 + y^2 + z^2 = ${R * R}$ 的条件下求 $${lin}$ 的${max ? "最大值" : "最小值"}。`,
          ),
          answer: ans,
          mistakes: [
            why(
              -ans,
              max
                ? "That is the minimum; the maximum is attained in the direction of the coefficients."
                : "That is the maximum; the minimum is attained opposite to the coefficients.",
              max ? "这是最小值；最大值在系数向量的方向上取到。" : "这是最大值；最小值在系数向量的反方向上取到。",
            ),
            why(
              ans * R,
              `The radius is $\\sqrt{${R * R}} = ${R}$; that used $${R * R}$.`,
              `半径是 $\\sqrt{${R * R}} = ${R}$；这里用了 $${R * R}$。`,
            ),
            why(
              sign * R * u.reduce((s, x) => s + Math.abs(x), 0),
              "That adds the sizes of the coefficients; use the norm of the coefficient vector.",
              "这是把系数的绝对值相加；要用系数向量的范数。",
            ),
            why(sign * n, `The radius $${R}$ is missing.`, `漏掉了半径 $${R}$。`),
          ].filter((w, i, all) => w.value !== ans && all.findIndex((o) => o.value === w.value) === i),
          solution: walked(
            [
              [
                ["Find the two norms", "求两个范数"],
                t(
                  `The coefficient vector has norm $\\sqrt{${base.map((x) => x * x).join(" + ")}} = ${n}$, and the sphere has radius $\\sqrt{${R * R}} = ${R}$.`,
                  `系数向量的范数为 $\\sqrt{${base.map((x) => x * x).join(" + ")}} = ${n}$，球面的半径为 $\\sqrt{${R * R}} = ${R}$。`,
                ),
              ],
              [
                ["Apply Cauchy–Schwarz", "应用柯西–施瓦茨不等式"],
                t(
                  `So $|${lin}| \\le ${R} \\cdot ${n} = ${R * n}$, with equality when $(x, y, z)$ is a ${max ? "positive" : "negative"} multiple of $(${u.join(", ")})$. The ${max ? "maximum" : "minimum"} is $${ans}$.`,
                  `所以 $|${lin}| \\le ${R} \\cdot ${n} = ${R * n}$，当 $(x, y, z)$ 是 $(${u.join(", ")})$ 的${max ? "正" : "负"}倍数时取等号。${max ? "最大值" : "最小值"}为 $${ans}$。`,
                ),
              ],
            ],
            t(
              `The point $(x, y, z) = ${scale}(${u.join(", ")})$ has $x^2 + y^2 + z^2 = ${frac(R * R, n * n)} \\cdot ${n * n} = ${R * R}$, and there the expression equals $${scale} \\cdot ${n * n} = ${ans}$.`,
              `点 $(x, y, z) = ${scale}(${u.join(", ")})$ 满足 $x^2 + y^2 + z^2 = ${frac(R * R, n * n)} \\cdot ${n * n} = ${R * R}$，在该点表达式等于 $${scale} \\cdot ${n * n} = ${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** orthogonalSumFigure shows orthogonal u and v placed head to tail, with u + v the hypotenuse of a right triangle. */
const orthogonalSumFigure: Figure = {
  svg: sketch([
    { kind: "segment", a: [0, 0], b: [4, 0] },
    { kind: "segment", a: [4, 0], b: [4, 3] },
    { kind: "segment", a: [0, 0], b: [4, 3] },
    { kind: "segment", a: [2.85, 0.15], b: [3.15, 0] },
    { kind: "segment", a: [2.85, -0.15], b: [3.15, 0] },
    { kind: "segment", a: [3.85, 2.1], b: [4, 2.4] },
    { kind: "segment", a: [4.15, 2.1], b: [4, 2.4] },
    { kind: "segment", a: [3.63, 2.91], b: [4, 3] },
    { kind: "segment", a: [3.81, 2.67], b: [4, 3] },
    { kind: "right", vertex: [4, 0], from: [0, 0], to: [4, 3] },
    { kind: "side", a: [0, 0], b: [4, 0], text: "u" },
    { kind: "side", a: [4, 0], b: [4, 3], text: "v" },
    { kind: "side", a: [4, 3], b: [0, 0], text: "u + v" },
  ]),
  alt: t(
    "Orthogonal vectors u and v placed head to tail form a right triangle whose hypotenuse is u + v, so |u + v|² = |u|² + |v|².",
    "正交向量 u 与 v 首尾相接，构成一个以 u + v 为斜边的直角三角形，所以 |u + v|² = |u|² + |v|²。",
  ),
};
/** pythagoreanTheoremAndTriangleInequalityInInnerProductSpaces covers the generalized Pythagorean theorem and triangle inequality. */
export const pythagoreanTheoremAndTriangleInequalityInInnerProductSpaces: TopicDef = {
  id: "pythagorean-theorem-and-triangle-inequality-in-inner-product-spaces",
  title: t("The Pythagorean Theorem and the Triangle Inequality", "内积空间中的勾股定理与三角不等式"),
  summary: t(
    "Apply the generalized Pythagorean theorem for orthogonal vectors and the triangle inequality.",
    "应用正交向量的广义勾股定理与三角不等式。",
  ),
  intro: t(
    "Let $u$ and $v$ be orthogonal with $\\|u\\| = 3$ and $\\|v\\| = 4$. Expanding, $\\|u + v\\|^2 = \\|u\\|^2 + 2\\langle u, v \\rangle + \\|v\\|^2 = 9 + 0 + 16 = 25$, so $\\|u + v\\| = 5$.\n\nCheck: the triangle inequality says $\\|u + v\\| \\le \\|u\\| + \\|v\\|$, and indeed $5 \\le 3 + 4 = 7$.\n\nIn this lesson we expand norms of sums with the inner product: the Pythagorean theorem for orthogonal vectors, the parallelogram law and the triangle inequality.",
    "设 $u$ 与 $v$ 正交，$\\|u\\| = 3$，$\\|v\\| = 4$。展开得 $\\|u + v\\|^2 = \\|u\\|^2 + 2\\langle u, v \\rangle + \\|v\\|^2 = 9 + 0 + 16 = 25$，所以 $\\|u + v\\| = 5$。\n\n检验：三角不等式说 $\\|u + v\\| \\le \\|u\\| + \\|v\\|$，确实 $5 \\le 3 + 4 = 7$。\n\n本课我们用内积展开和的范数：正交向量的勾股定理、平行四边形定律与三角不等式。",
  ),
  prerequisites: ["cauchy-schwarz-inequality-and-angle-between-two-vectors", "orthogonal-vectors-in-inner-product-spaces"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "pythagorean-orthogonal-norm",
      title: t("Pythagorean Theorem for Orthogonal Vectors", "正交向量的勾股定理"),
      explanation: t(
        "In an inner product space, if vectors $u$ and $v$ are orthogonal ($\\langle u, v \\rangle = 0$), then $|u + v|^2 = |u|^2 + |v|^2$. More generally, for scalars $a, b$, $|a u + b v|^2 = a^2 |u|^2 + b^2 |v|^2$. For example, with $\\|u\\| = 2$ and $\\|v\\| = 3$, $\\|3u + v\\|^2 = 9 \\cdot 4 + 9 = 45$.\n\n> **Watch out.** Square the coefficients as well as the norms: $\\|3u\\|^2 = 9\\|u\\|^2$. The cross term $2ab\\langle u, v \\rangle$ is zero only because $u$ and $v$ are orthogonal.",
        "在内积空间中，若两向量 $u$ 与 $v$ 正交（$\\langle u, v \\rangle = 0$），则 $|u + v|^2 = |u|^2 + |v|^2$。更一般地，对于标量 $a, b$，有 $|a u + b v|^2 = a^2 |u|^2 + b^2 |v|^2$。例如 $\\|u\\| = 2$、$\\|v\\| = 3$ 时，$\\|3u + v\\|^2 = 9 \\cdot 4 + 9 = 45$。\n\n> **注意。** 系数和范数都要平方：$\\|3u\\|^2 = 9\\|u\\|^2$。交叉项 $2ab\\langle u, v \\rangle$ 为零，只是因为 $u$ 与 $v$ 正交。",
      ),
      figure: orthogonalSumFigure,
      generate: (rng: Rng): Problem => {
        const nu = rng.pick([2, 3, 4, 5, 6]);
        const nv = rng.pick([2, 3, 4, 5, 6]);
        const a = rng.pick([1, 2, 3, 4]);
        const b = rng.pick([1, 2, 3, 4]);

        const normSq = a * a * nu * nu + b * b * nv * nv;
        const aStr = a === 1 ? "" : `${a}`;
        const bStr = b === 1 ? "" : `${b}`;

        const prompt = t(
          `Let $u, v$ be orthogonal vectors in an inner product space such that $\\|u\\| = ${nu}$ and $\\|v\\| = ${nv}$. Compute $\\|${aStr}u + ${bStr}v\\|^2$.`,
          `设内积空间中两向量 $u, v$ 正交，且满足 $\\|u\\| = ${nu}$ 与 $\\|v\\| = ${nv}$。计算 $\\|${aStr}u + ${bStr}v\\|^2$ 的值。`,
        );

        const solution = walked(
          [
            [
              ["Expand with the inner product", "用内积展开"],
              t("The cross term vanishes because $\\langle u, v \\rangle = 0$:", "因为 $\\langle u, v \\rangle = 0$，交叉项为零："),
              [
                `\\|${aStr}u + ${bStr}v\\|^2 = ${a}^2 \\|u\\|^2 + 2(${a})(${b})\\langle u, v \\rangle + ${b}^2 \\|v\\|^2 = ${a}^2 \\|u\\|^2 + ${b}^2 \\|v\\|^2`,
              ],
            ],
            [
              ["Substitute the norms", "代入范数"],
              t("", ""),
              [`${a * a}(${nu * nu}) + ${b * b}(${nv * nv}) = ${a * a * nu * nu} + ${b * b * nv * nv} = ${normSq}`],
            ],
          ],
          t(
            `The vectors $${aStr}u$ and $${bStr}v$ are the legs of a right triangle with lengths $${a * nu}$ and $${b * nv}$, and $${a * nu}^2 + ${b * nv}^2 = ${normSq}$.`,
            `向量 $${aStr}u$ 与 $${bStr}v$ 是直角三角形的两条直角边，长分别为 $${a * nu}$ 与 $${b * nv}$，而 $${a * nu}^2 + ${b * nv}^2 = ${normSq}$。`,
          ),
        );

        return numberProblem({
          prompt,
          answer: normSq,
          solution,
          mistakes: [
            why(a * nu + b * nv, "That adds the lengths; the squares of the lengths add.", "这是把长度相加；相加的应当是长度的平方。"),
            why(
              (a * nu + b * nv) ** 2,
              "That keeps a cross term; it is zero because $u$ and $v$ are orthogonal.",
              "这保留了交叉项；因为 $u$ 与 $v$ 正交，交叉项为零。",
            ),
            why(a * a * nu + b * b * nv, "The norms were not squared.", "范数没有平方。"),
            why(
              a * nu * nu + b * nv * nv,
              "The coefficients were not squared: $\\|au\\|^2 = a^2\\|u\\|^2$.",
              "系数没有平方：$\\|au\\|^2 = a^2\\|u\\|^2$。",
            ),
          ].filter((w, i, all) => w.value !== normSq && all.findIndex((o) => o.value === w.value) === i),
        });
      },
    },
    {
      id: "the-parallelogram-law",
      figure: linearAlgebraDrawings2["pythagorean-theorem-and-triangle-inequality-in-inner-product-spaces#the-parallelogram-law"],
      title: t("The parallelogram law", "平行四边形定律"),
      explanation: t(
        "Expanding $\\|u + v\\|^2$ and $\\|u - v\\|^2$ with the inner product and adding them cancels the cross terms $\\pm 2\\langle u, v \\rangle$:\n\n$$\\|u + v\\|^2 + \\|u - v\\|^2 = 2\\|u\\|^2 + 2\\|v\\|^2.$$\n\nGeometrically, the squares of the two diagonals of a parallelogram add up to the squares of its four sides. Knowing three of the lengths determines the fourth. For example, $\\|u\\| = 3$, $\\|v\\| = 4$ and $\\|u + v\\|^2 = 37$ give $\\|u - v\\|^2 = 18 + 32 - 37 = 13$.\n\n> **Watch out.** Both side lengths are doubled: the right side is $2\\|u\\|^2 + 2\\|v\\|^2$, not $\\|u\\|^2 + \\|v\\|^2$. The two diagonals are equal only when $u$ and $v$ are orthogonal.",
        "用内积展开 $\\|u + v\\|^2$ 与 $\\|u - v\\|^2$ 再相加，交叉项 $\\pm 2\\langle u, v \\rangle$ 抵消：\n\n$$\\|u + v\\|^2 + \\|u - v\\|^2 = 2\\|u\\|^2 + 2\\|v\\|^2$$\n\n几何上，平行四边形两条对角线的平方和等于四条边的平方和。知道其中三个长度就能确定第四个。例如 $\\|u\\| = 3$，$\\|v\\| = 4$，$\\|u + v\\|^2 = 37$ 给出 $\\|u - v\\|^2 = 18 + 32 - 37 = 13$。\n\n> **注意。** 两条边长都要乘以 2：右边是 $2\\|u\\|^2 + 2\\|v\\|^2$，不是 $\\|u\\|^2 + \\|v\\|^2$。只有当 $u$ 与 $v$ 正交时两条对角线才相等。",
      ),
      generate: (rng: Rng): Problem => {
        const A = rng.int(2, 7);
        const B = rng.int(2, 7);
        const C = rng.int(-Math.floor((A * B) / 2), Math.floor((A * B) / 2));
        const plus = A * A + B * B + 2 * C;
        const ans = A * A + B * B - 2 * C;
        return numberProblem({
          prompt: t(
            `In an inner product space, $\\|u\\| = ${A}$, $\\|v\\| = ${B}$ and $\\|u + v\\|^2 = ${plus}$. Find $\\|u - v\\|^2$.`,
            `在内积空间中，$\\|u\\| = ${A}$，$\\|v\\| = ${B}$，$\\|u + v\\|^2 = ${plus}$。求 $\\|u - v\\|^2$。`,
          ),
          answer: ans,
          mistakes: [
            why(
              A * A + B * B - plus,
              "The side lengths must be doubled: the law reads $2\\|u\\|^2 + 2\\|v\\|^2$.",
              "边长的平方要乘以 2：定律是 $2\\|u\\|^2 + 2\\|v\\|^2$。",
            ),
            why(
              2 * A * A + 2 * B * B + plus,
              "Subtract $\\|u + v\\|^2$ from $2\\|u\\|^2 + 2\\|v\\|^2$ instead of adding it.",
              "要从 $2\\|u\\|^2 + 2\\|v\\|^2$ 中减去 $\\|u + v\\|^2$，而不是加上。",
            ),
            why(
              (A - B) ** 2,
              "Norms do not subtract like numbers; use the parallelogram law.",
              "范数不能像数那样相减；要用平行四边形定律。",
            ),
            why(
              plus,
              "The two diagonals have equal length only when $u$ and $v$ are orthogonal.",
              "只有当 $u$ 与 $v$ 正交时，两条对角线才一样长。",
            ),
          ].filter((w, i, all) => w.value !== ans && all.findIndex((o) => o.value === w.value) === i),
          solution: walked(
            [
              [
                ["Write the parallelogram law", "写出平行四边形定律"],
                t("", ""),
                [`\\|u - v\\|^2 = 2\\|u\\|^2 + 2\\|v\\|^2 - \\|u + v\\|^2`],
              ],
              [["Substitute", "代入"], t("", ""), [`= 2(${A * A}) + 2(${B * B}) - ${plus} = ${ans}`]],
            ],
            t(
              `From $\\|u + v\\|^2 = ${A * A} + 2\\langle u, v \\rangle + ${B * B} = ${plus}$ we get $\\langle u, v \\rangle = ${C}$, and then $\\|u - v\\|^2 = ${A * A} - 2(${C}) + ${B * B} = ${ans}$.`,
              `由 $\\|u + v\\|^2 = ${A * A} + 2\\langle u, v \\rangle + ${B * B} = ${plus}$ 得 $\\langle u, v \\rangle = ${C}$，于是 $\\|u - v\\|^2 = ${A * A} - 2(${C}) + ${B * B} = ${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** orthogonalComplements covers orthogonal complements of subspaces in ℝⁿ. */
export const orthogonalComplements: TopicDef = {
  id: "orthogonal-complements",
  title: t("Orthogonal Complements", "正交补"),
  summary: t(
    "Find the orthogonal complement of a subspace, understand that $W \\cap W^{\\perp} = \\{\\mathbf{0}\\}$, and relate the dimensions.",
    "求子空间的正交补，理解 $W \\cap W^{\\perp} = \\{\\mathbf{0}\\}$，并掌握维数关系。",
  ),
  intro: t(
    "Let $W = \\operatorname{span}\\{(1, 1, 0)\\}$ in $\\mathbb{R}^3$. A vector $(x, y, z)$ is in $W^\\perp$ when $x + y = 0$, so $W^\\perp = \\operatorname{span}\\{(1, -1, 0), (0, 0, 1)\\}$, a plane of dimension $2$.\n\nCheck: $(1, -1, 0) \\cdot (1, 1, 0) = 0$ and $(0, 0, 1) \\cdot (1, 1, 0) = 0$, and the dimensions add up: $\\dim W + \\dim W^\\perp = 1 + 2 = 3$.\n\nIn this lesson we find the dimension of an orthogonal complement and decide whether a vector belongs to one.",
    "设 $\\mathbb{R}^3$ 中 $W = \\operatorname{span}\\{(1, 1, 0)\\}$。向量 $(x, y, z)$ 属于 $W^\\perp$ 当 $x + y = 0$，所以 $W^\\perp = \\operatorname{span}\\{(1, -1, 0), (0, 0, 1)\\}$，是一个维数为 $2$ 的平面。\n\n检验：$(1, -1, 0) \\cdot (1, 1, 0) = 0$，$(0, 0, 1) \\cdot (1, 1, 0) = 0$，且维数相加：$\\dim W + \\dim W^\\perp = 1 + 2 = 3$。\n\n本课我们求正交补的维数，并判断一个向量是否属于正交补。",
  ),
  prerequisites: ["orthogonal-vectors-in-euclidean-spaces", "subspaces-of-n-dimensional-space"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "orthogonal-complement-dimension-basis",
      title: t("Dimension and Basis of Orthogonal Complements", "正交补的维数与基"),
      explanation: t(
        "For any subspace $W$ of $\\mathbb{R}^n$, its orthogonal complement $W^\\perp$ has dimension $\\dim(W^\\perp) = n - \\dim(W)$, and $W \\cap W^\\perp = \\{0\\}$. A vector $x$ belongs to $W^\\perp$ if and only if $x$ is orthogonal to every vector in $W$. For example, the span of two independent vectors in $\\mathbb{R}^5$ has a complement of dimension $5 - 2 = 3$.\n\n> **Watch out.** The dimension of $W$ is the number of independent spanning vectors, not their length $n$. Subtract it from $n$; do not report $\\dim W$ itself.",
        "对于 $\\mathbb{R}^n$ 的任意子空间 $W$，其正交补 $W^\\perp$ 的维数满足 $\\dim(W^\\perp) = n - \\dim(W)$，且 $W \\cap W^\\perp = \\{0\\}$。向量 $x$ 属于 $W^\\perp$ 当且仅当 $x$ 与 $W$ 的每个向量正交。例如 $\\mathbb{R}^5$ 中两个线性无关向量张成的子空间，其正交补维数为 $5 - 2 = 3$。\n\n> **注意。** $W$ 的维数是线性无关张成向量的个数，不是它们的长度 $n$。要用 $n$ 减去它，而不是直接给出 $\\dim W$。",
      ),
      generate: (rng: Rng): Problem => {
        const n = rng.pick([4, 5, 6]);
        const k = rng.pick([1, 2]);
        const v1 = [rng.nonZero(-4, 4), ...Array.from({ length: n - 1 }, () => rng.int(-4, 4))];
        let spanLatex: string;
        if (k === 1) {
          spanLatex = colVecLatex(v1);
        } else {
          const v2 = [0, rng.nonZero(-4, 4), ...Array.from({ length: n - 2 }, () => rng.int(-4, 4))];
          spanLatex = `${colVecLatex(v1)}, ${colVecLatex(v2)}`;
        }
        const ans = n - k;

        const prompt = t(
          `Let $W = \\operatorname{span}\\{${spanLatex}\\} \\subset \\mathbb{R}^{${n}}$, where the given vectors are linearly independent. What is the dimension of its orthogonal complement $W^\\perp$?`,
          `设 $W = \\operatorname{span}\\{${spanLatex}\\} \\subset \\mathbb{R}^{${n}}$，其中所给向量线性无关。求其正交补 $W^\\perp$ 的维数 $\\dim(W^\\perp)$。`,
        );

        const solution = walked(
          [
            [
              ["Find the dimension of W", "求 W 的维数"],
              t(
                `$W$ is spanned by ${k} linearly independent vector${k === 1 ? "" : "s"} in $\\mathbb{R}^{${n}}$, so $\\dim(W) = ${k}$.`,
                `$W$ 由 $\\mathbb{R}^{${n}}$ 中 ${k} 个线性无关向量张成，所以 $\\dim(W) = ${k}$。`,
              ),
            ],
            [["Subtract from n", "用 n 减去"], t("", ""), [`\\dim(W^\\perp) = n - \\dim(W) = ${n} - ${k} = ${ans}`]],
          ],
          t(
            `$\\dim W + \\dim W^\\perp = ${k} + ${ans} = ${n}$, the dimension of the whole space, since $W$ and $W^\\perp$ meet only in $\\mathbf{0}$.`,
            `$\\dim W + \\dim W^\\perp = ${k} + ${ans} = ${n}$，正是整个空间的维数，因为 $W$ 与 $W^\\perp$ 只交于 $\\mathbf{0}$。`,
          ),
        );

        return numberProblem({
          prompt,
          answer: ans,
          solution,
          mistakes: [
            why(k, "That is $\\dim W$; the complement has dimension $n - \\dim W$.", "这是 $\\dim W$；正交补的维数是 $n - \\dim W$。"),
            why(n, "That is the dimension of the whole space; subtract $\\dim W$.", "这是整个空间的维数；还要减去 $\\dim W$。"),
            why(
              n + k,
              "The dimensions of $W$ and $W^\\perp$ add up to $n$; do not add $\\dim W$ to $n$.",
              "$W$ 与 $W^\\perp$ 的维数之和是 $n$；不要把 $\\dim W$ 加到 $n$ 上。",
            ),
          ].filter((w, i, all) => w.value !== ans && all.findIndex((o) => o.value === w.value) === i),
        });
      },
    },
    {
      id: "membership-in-an-orthogonal-complement",
      title: t("Membership in an orthogonal complement", "判断是否属于正交补"),
      explanation: t(
        "If $W = \\operatorname{span}\\{w_1, w_2\\}$, a vector $v$ lies in $W^\\perp$ exactly when $v \\cdot w_1 = 0$ and $v \\cdot w_2 = 0$. Orthogonality to the spanning vectors is enough, because every vector of $W$ is a combination of them and the dot product is linear. Being orthogonal to only one of the spanning vectors is not enough. For example, with $w_1 = (1, 0, 1)$ and $w_2 = (0, 1, 1)$, the vector $(1, 1, -1)$ has both dot products $0$, so it is in $W^\\perp$; the vector $(1, -1, 1)$ has $v \\cdot w_2 = 0$ but $v \\cdot w_1 = 2$, so it is not.\n\n> **Watch out.** Check both dot products. One zero dot product only shows orthogonality to one spanning vector.",
        "若 $W = \\operatorname{span}\\{w_1, w_2\\}$，则 $v \\in W^\\perp$ 当且仅当 $v \\cdot w_1 = 0$ 且 $v \\cdot w_2 = 0$。与张成向量正交就足够，因为 $W$ 中每个向量都是它们的组合，而点积是线性的。只与其中一个张成向量正交是不够的。例如 $w_1 = (1, 0, 1)$，$w_2 = (0, 1, 1)$ 时，向量 $(1, 1, -1)$ 的两个点积都是 $0$，所以属于 $W^\\perp$；向量 $(1, -1, 1)$ 有 $v \\cdot w_2 = 0$ 但 $v \\cdot w_1 = 2$，所以不属于。\n\n> **注意。** 两个点积都要检查。一个点积为零只说明与一个张成向量正交。",
      ),
      generate: (rng: Rng): Problem => {
        const w1 = [rng.nonZero(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
        let w2 = [rng.int(-3, 3), rng.nonZero(-3, 3), rng.int(-3, 3)];
        let n = [w1[1]! * w2[2]! - w1[2]! * w2[1]!, w1[2]! * w2[0]! - w1[0]! * w2[2]!, w1[0]! * w2[1]! - w1[1]! * w2[0]!];
        if (n.every((x) => x === 0)) {
          w2 = [0, 1, 1];
          n = [w1[1]! - w1[2]!, -w1[0]!, w1[0]!];
        }
        const g = n.reduce((s, x) => gcd(s, x), 0);
        const k = rng.nonZero(-2, 2);
        const v = n.map((x) => (x / g) * k);
        const yes = rng.int(0, 1) === 0;
        if (!yes) {
          // Add a multiple of w1 so that v stays orthogonal to w2 only when w1 is.
          for (let i = 0; i < 3; i++) v[i] = v[i]! + w1[i]!;
        }
        const d1 = v.reduce((s, x, i) => s + x * w1[i]!, 0);
        const d2 = v.reduce((s, x, i) => s + x * w2[i]!, 0);
        const inW = d1 === 0 && d2 === 0;
        const dots = (w: number[]) => v.map((x, i) => `(${x})(${w[i]!})`).join(" + ");
        const right = inW ? yesNo[0]! : yesNo[1]!;
        const other = inW ? yesNo[1]! : yesNo[0]!;
        const solution = walked(
          [
            [
              ["Dot with each spanning vector", "与每个张成向量作点积"],
              t("", ""),
              [`v \\cdot w_1 = ${dots(w1)} = ${d1}`, `v \\cdot w_2 = ${dots(w2)} = ${d2}`],
            ],
            [
              ["Decide", "下结论"],
              inW
                ? t("Both dot products are $0$, so $v$ is in $W^\\perp$.", "两个点积都为 $0$，所以 $v$ 属于 $W^\\perp$。")
                : t("Not both dot products are $0$, so $v$ is not in $W^\\perp$.", "两个点积不全为 $0$，所以 $v$ 不属于 $W^\\perp$。"),
            ],
          ],
          t(
            `The vector $w_1 + w_2 = (${w1.map((x, i) => x + w2[i]!).join(", ")})$ of $W$ gives $v \\cdot (w_1 + w_2) = ${d1 + d2}$, which agrees with $${d1} + ${d2 < 0 ? `(${d2})` : d2}$.`,
            `$W$ 中的向量 $w_1 + w_2 = (${w1.map((x, i) => x + w2[i]!).join(", ")})$ 给出 $v \\cdot (w_1 + w_2) = ${d1 + d2}$，与 $${d1} + ${d2 < 0 ? `(${d2})` : d2}$ 一致。`,
          ),
        );
        return reasoned(
          oneOf(
            rng,
            t(
              `$W = \\operatorname{span}\\{(${w1.join(", ")}), (${w2.join(", ")})\\}$ in $\\mathbb{R}^3$. Is $v = (${v.join(", ")})$ in $W^\\perp$?`,
              `$\\mathbb{R}^3$ 中 $W = \\operatorname{span}\\{(${w1.join(", ")}), (${w2.join(", ")})\\}$。$v = (${v.join(", ")})$ 属于 $W^\\perp$ 吗？`,
            ),
            right,
            [other],
            solution,
          ),
          [
            inW
              ? [
                  other.en,
                  "Both dot products are zero, and every vector of $W$ is a combination of $w_1$ and $w_2$.",
                  "两个点积都为零，而 $W$ 中每个向量都是 $w_1$ 与 $w_2$ 的组合。",
                ]
              : [
                  other.en,
                  "A vector of $W^\\perp$ must be orthogonal to both spanning vectors; here a dot product is not zero.",
                  "$W^\\perp$ 中的向量必须与两个张成向量都正交；这里有一个点积不为零。",
                ],
          ],
        );
      },
    },
  ],
};

/** orthogonalSetsInEuclideanSpaces covers orthogonal and orthonormal sets in ℝⁿ. */
export const orthogonalSetsInEuclideanSpaces: TopicDef = {
  id: "orthogonal-sets-in-euclidean-spaces",
  title: t("Orthogonal Sets in Euclidean Spaces", "欧几里得空间中的正交集"),
  summary: t(
    "Determine whether a set of vectors in ℝⁿ is orthogonal or orthonormal, and understand linear independence.",
    "判断 ℝⁿ 中的向量集合是否正交或标准正交，并理解其线性无关性。",
  ),
  intro: t(
    "Take $u_1 = (1, 1, 1)$, $u_2 = (1, -1, 0)$ and $u_3 = (1, 1, -2)$. The three pairwise dot products are $u_1 \\cdot u_2 = 0$, $u_1 \\cdot u_3 = 1 + 1 - 2 = 0$ and $u_2 \\cdot u_3 = 1 - 1 + 0 = 0$, so $\\{u_1, u_2, u_3\\}$ is an orthogonal set.\n\nCheck: an orthogonal set of nonzero vectors is linearly independent, and indeed $\\det\\begin{pmatrix} 1 & 1 & 1 \\\\ 1 & -1 & 1 \\\\ 1 & 0 & -2 \\end{pmatrix} = 6 \\ne 0$.\n\nIn this lesson we test every pair of a set for orthogonality and use orthogonality to find the norm of a combination without forming it.",
    "取 $u_1 = (1, 1, 1)$，$u_2 = (1, -1, 0)$，$u_3 = (1, 1, -2)$。三个两两点积为 $u_1 \\cdot u_2 = 0$，$u_1 \\cdot u_3 = 1 + 1 - 2 = 0$，$u_2 \\cdot u_3 = 1 - 1 + 0 = 0$，所以 $\\{u_1, u_2, u_3\\}$ 是正交集。\n\n检验：由非零向量组成的正交集线性无关，确实 $\\det\\begin{pmatrix} 1 & 1 & 1 \\\\ 1 & -1 & 1 \\\\ 1 & 0 & -2 \\end{pmatrix} = 6 \\ne 0$。\n\n本课我们检验集合中每一对向量是否正交，并利用正交性不写出组合就求出它的范数。",
  ),
  prerequisites: ["orthogonal-vectors-in-euclidean-spaces", "linear-dependence-and-independence"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "verifying-orthogonal-set-rn",
      title: t("Orthogonality of Sets of Vectors in $\\mathbb{R}^n$", "$\\mathbb{R}^n$ 中向量集合的正交性"),
      explanation: t(
        "A set of vectors $S = \\{u_1, u_2, \\dots, u_p\\} \\subset \\mathbb{R}^n$ is orthogonal if $u_i \\cdot u_j = 0$ for all $i \\ne j$. Any orthogonal set of nonzero vectors is linearly independent. For example, $\\{(2, 2, 1), (1, -1, 0), (1, 1, k)\\}$ is orthogonal exactly when $(2, 2, 1) \\cdot (1, 1, k) = 4 + k = 0$, that is $k = -4$; the other two pairs are orthogonal for every $k$.\n\n> **Watch out.** A set of three vectors has three pairs to check, not two. Moving the constant across the equals sign changes its sign.",
        "若集合 $S = \\{u_1, u_2, \\dots, u_p\\} \\subset \\mathbb{R}^n$ 中任意两不同向量满足 $u_i \\cdot u_j = 0$（$i \\ne j$），则称 $S$ 为正交集。任何由非零向量组成的正交集必然线性无关。例如 $\\{(2, 2, 1), (1, -1, 0), (1, 1, k)\\}$ 是正交集当且仅当 $(2, 2, 1) \\cdot (1, 1, k) = 4 + k = 0$，即 $k = -4$；另外两对对任何 $k$ 都正交。\n\n> **注意。** 三个向量有三对要检验，不是两对。把常数移到等号另一边时要变号。",
      ),
      generate: (rng: Rng): Problem => {
        const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const b = rng.pick([-2, -1, 1, 2]);

        const answer = Q.of(-2 * a, b);

        const prompt = t(
          `Determine the value of $k$ that makes the set $\\{u_1, u_2, u_3\\} \\subset \\mathbb{R}^3$ an orthogonal set:\n$$u_1 = ${colVecLatex([a, a, b])}, \\quad u_2 = ${colVecLatex([1, -1, 0])}, \\quad u_3 = ${colVecLatex([1, 1, "k"])}$$`,
          `求使得集合 $\\{u_1, u_2, u_3\\} \\subset \\mathbb{R}^3$ 为正交集的常数 $k$ 的值：\n$$u_1 = ${colVecLatex([a, a, b])}, \\quad u_2 = ${colVecLatex([1, -1, 0])}, \\quad u_3 = ${colVecLatex([1, 1, "k"])}$$`,
        );

        const bTerm = b === 1 ? "+ k" : b === -1 ? "- k" : b > 0 ? `+ ${b}k` : `- ${-b}k`;
        const solution = walked(
          [
            [
              ["Check the pairs without k", "检验不含 k 的两对"],
              t("", ""),
              [`u_1 \\cdot u_2 = (${a})(1) + (${a})(-1) + (${b})(0) = 0`, "u_2 \\cdot u_3 = (1)(1) + (-1)(1) + (0)k = 0"],
            ],
            [
              ["Solve the remaining pair", "解剩下的一对"],
              t("", ""),
              [`u_1 \\cdot u_3 = (${a})(1) + (${a})(1) + (${b})k = ${2 * a} ${bTerm} = 0`, `k = ${answer.toLatex()}`],
            ],
          ],
          t(
            `$u_1 \\cdot u_3 = ${2 * a} + (${b})\\left(${answer.toLatex()}\\right) = ${2 * a} + (${-2 * a}) = 0$.`,
            `$u_1 \\cdot u_3 = ${2 * a} + (${b})\\left(${answer.toLatex()}\\right) = ${2 * a} + (${-2 * a}) = 0$。`,
          ),
        );

        return numberProblem({
          prompt,
          answer,
          solveFor: "k",
          solution,
          mistakes: [
            why(Q.of(2 * a, b), "The sign is lost when moving the constant to the other side.", "把常数移到另一边时符号丢了。"),
            why(
              Q.of(-a, b),
              "Both $u_1$ entries multiply a $1$ in $u_3$; the constant term is $2a$, not $a$.",
              "$u_1$ 的两个分量都乘以 $u_3$ 中的 $1$；常数项是 $2a$，不是 $a$。",
            ),
            why(
              Q.of(-b, 2 * a),
              "The fraction is upside down: divide the constant by the coefficient of $k$.",
              "分数颠倒了：要用常数除以 $k$ 的系数。",
            ),
            why(
              0,
              "With $k = 0$, $u_1 \\cdot u_3$ is not zero; only $u_1 \\cdot u_2$ and $u_2 \\cdot u_3$ are zero for every $k$.",
              "$k = 0$ 时 $u_1 \\cdot u_3$ 不为零；只有 $u_1 \\cdot u_2$ 与 $u_2 \\cdot u_3$ 对任何 $k$ 都为零。",
            ),
          ].filter((w, i, all) => all.findIndex((o) => String(o.value) === String(w.value)) === i),
        });
      },
    },
    {
      id: "the-norm-of-a-combination-of-an-orthogonal-set",
      title: t("The norm of a combination of an orthogonal set", "正交组线性组合的范数"),
      explanation: t(
        "For an orthogonal set $\\{u_1, u_2, u_3\\}$ all the cross terms $u_i \\cdot u_j$ with $i \\ne j$ vanish, so the Pythagorean theorem extends to any number of vectors:\n\n$$\\|c_1u_1 + c_2u_2 + c_3u_3\\|^2 = c_1^2\\|u_1\\|^2 + c_2^2\\|u_2\\|^2 + c_3^2\\|u_3\\|^2.$$\n\nThis avoids forming the combination entry by entry. For example, with $u_1 = (1, 0, 1)$, $u_2 = (1, 0, -1)$ and $u_3 = (0, 1, 0)$, $\\|2u_1 - u_2 + 3u_3\\|^2 = 4 \\cdot 2 + 1 \\cdot 2 + 9 \\cdot 1 = 19$.\n\n> **Watch out.** Square each coefficient, negative ones included, and keep the squared norms $\\|u_i\\|^2$: the vectors are orthogonal, not necessarily of length $1$.",
        "对正交组 $\\{u_1, u_2, u_3\\}$，所有 $i \\ne j$ 的交叉项 $u_i \\cdot u_j$ 都为零，所以勾股定理推广到任意多个向量：\n\n$$\\|c_1u_1 + c_2u_2 + c_3u_3\\|^2 = c_1^2\\|u_1\\|^2 + c_2^2\\|u_2\\|^2 + c_3^2\\|u_3\\|^2$$\n\n这样不必逐个分量算出组合。例如 $u_1 = (1, 0, 1)$，$u_2 = (1, 0, -1)$，$u_3 = (0, 1, 0)$ 时，$\\|2u_1 - u_2 + 3u_3\\|^2 = 4 \\cdot 2 + 1 \\cdot 2 + 9 \\cdot 1 = 19$。\n\n> **注意。** 每个系数都要平方，负的也一样；还要保留平方范数 $\\|u_i\\|^2$：这些向量是正交的，但长度不一定是 $1$。",
      ),
      generate: (rng: Rng): Problem => {
        const sets = [
          [
            [1, 1, 1],
            [1, -1, 0],
            [1, 1, -2],
          ],
          [
            [1, 0, 1],
            [1, 0, -1],
            [0, 1, 0],
          ],
          [
            [1, 2, 2],
            [2, 1, -2],
            [2, -2, 1],
          ],
          [
            [2, 1, 0],
            [1, -2, 0],
            [0, 0, 3],
          ],
        ];
        const set = rng.pick(sets);
        const c = [rng.nonZero(-3, 3), rng.nonZero(-3, 3), rng.nonZero(-3, 3)];
        const n2 = set.map((u) => u.reduce((s, x) => s + x * x, 0));
        const ans = c.reduce((s, x, i) => s + x * x * n2[i]!, 0);
        const comb = formatLinEq(c, ["u_1", "u_2", "u_3"]);
        const w = [0, 1, 2].map((j) => c.reduce((s, x, i) => s + x * set[i]![j]!, 0));
        return numberProblem({
          prompt: t(
            `$u_1 = (${set[0]!.join(", ")})$, $u_2 = (${set[1]!.join(", ")})$ and $u_3 = (${set[2]!.join(", ")})$ form an orthogonal set. Find $\\|${comb}\\|^2$.`,
            `$u_1 = (${set[0]!.join(", ")})$、$u_2 = (${set[1]!.join(", ")})$ 与 $u_3 = (${set[2]!.join(", ")})$ 构成正交组。求 $\\|${comb}\\|^2$。`,
          ),
          answer: ans,
          mistakes: [
            why(
              c.reduce((s, x, i) => s + x * n2[i]!, 0),
              "The coefficients were not squared: $\\|c\\,u\\|^2 = c^2\\|u\\|^2$.",
              "系数没有平方：$\\|c\\,u\\|^2 = c^2\\|u\\|^2$。",
            ),
            why(
              c.reduce((s, x) => s + x * x, 0),
              "That treats the set as orthonormal; multiply each $c_i^2$ by $\\|u_i\\|^2$.",
              "这是把它当作标准正交组；每个 $c_i^2$ 都要乘以 $\\|u_i\\|^2$。",
            ),
            why(
              c.reduce((s, x, i) => s + Math.abs(x) * n2[i]!, 0) ** 2,
              "That squares a sum; the squares add term by term because the cross terms are zero.",
              "这是对和取平方；因为交叉项为零，平方是逐项相加的。",
            ),
          ].filter((m, i, all) => m.value !== ans && all.findIndex((o) => o.value === m.value) === i),
          solution: walked(
            [
              [
                ["Find the squared norms", "求平方范数"],
                t("", ""),
                [`\\|u_1\\|^2 = ${n2[0]}, \\quad \\|u_2\\|^2 = ${n2[1]}, \\quad \\|u_3\\|^2 = ${n2[2]}`],
              ],
              [
                ["Add the squared terms", "把平方项相加"],
                t("The cross terms vanish because the set is orthogonal:", "因为是正交组，交叉项为零："),
                [`\\|${comb}\\|^2 = ${c.map((x, i) => `${x * x} \\cdot ${n2[i]}`).join(" + ")} = ${ans}`],
              ],
            ],
            t(
              `Forming the combination directly gives $${comb} = (${w.join(", ")})$, and $${w.map((x) => `${x < 0 ? `(${x})` : x}^2`).join(" + ")} = ${ans}$.`,
              `直接算出组合得 $${comb} = (${w.join(", ")})$，而 $${w.map((x) => `${x < 0 ? `(${x})` : x}^2`).join(" + ")} = ${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** orthogonalSetsInInnerProductSpaces covers orthogonal and orthonormal systems in general inner product spaces. */
export const orthogonalSetsInInnerProductSpaces: TopicDef = {
  id: "orthogonal-sets-in-inner-product-spaces",
  title: t("Orthogonal Sets in Inner Product Spaces", "内积空间中的正交集"),
  summary: t("Work with orthogonal and orthonormal sets in general inner product spaces.", "在广义内积空间中运用正交集与标准正交集。"),
  intro: t(
    "With $\\langle p, q \\rangle = \\int_{-1}^{1} p(x) q(x)\\,dx$, the polynomials $1$ and $x$ are orthogonal, since $\\int_{-1}^{1} x\\,dx = 0$. Their squared norms are $\\int_{-1}^{1} 1\\,dx = 2$ and $\\int_{-1}^{1} x^2\\,dx = \\frac{2}{3}$, so $\\left\\{\\frac{1}{\\sqrt{2}}, \\sqrt{\\frac{3}{2}}\\,x\\right\\}$ is an orthonormal set.\n\nCheck: $\\left\\|\\sqrt{\\frac{3}{2}}\\,x\\right\\|^2 = \\frac{3}{2} \\cdot \\frac{2}{3} = 1$.\n\nIn this lesson we compute squared norms of functions to normalize them and use symmetry to decide which powers of $x$ are orthogonal.",
    "在 $\\langle p, q \\rangle = \\int_{-1}^{1} p(x) q(x)\\,dx$ 下，多项式 $1$ 与 $x$ 正交，因为 $\\int_{-1}^{1} x\\,dx = 0$。它们的平方范数为 $\\int_{-1}^{1} 1\\,dx = 2$ 与 $\\int_{-1}^{1} x^2\\,dx = \\frac{2}{3}$，所以 $\\left\\{\\frac{1}{\\sqrt{2}}, \\sqrt{\\frac{3}{2}}\\,x\\right\\}$ 是标准正交集。\n\n检验：$\\left\\|\\sqrt{\\frac{3}{2}}\\,x\\right\\|^2 = \\frac{3}{2} \\cdot \\frac{2}{3} = 1$。\n\n本课我们计算函数的平方范数以便单位化，并利用对称性判断 $x$ 的哪些幂相互正交。",
  ),
  prerequisites: ["orthogonal-sets-in-euclidean-spaces", "orthogonal-vectors-in-inner-product-spaces"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "normalizing-orthogonal-polynomial",
      title: t("Normalizing Vectors in an Inner Product Space", "内积空间中向量的单位化"),
      explanation: t(
        "In an inner product space, a vector $u$ is normalized to unit length by dividing by its norm: $\\hat{u} = \\frac{u}{|u|} = \\frac{u}{\\sqrt{\\langle u, u \\rangle}}$. Its norm squared is $\\langle u, u \\rangle$. For example, in $C[0, 1]$ with $\\langle f, g \\rangle = \\int_0^1 f(t)g(t)\\,dt$, $p(t) = 3t^2$ has $\\|p\\|^2 = 9\\int_0^1 t^4\\,dt = \\frac{9}{5}$, so $\\hat{p} = \\frac{3t^2}{\\sqrt{9/5}} = \\sqrt{5}\\,t^2$.\n\n> **Watch out.** Square the whole function before integrating: $(a t^k)^2 = a^2 t^{2k}$, and $\\int_0^1 t^{2k}\\,dt = \\frac{1}{2k + 1}$, with the exponent raised by one.",
        "在内积空间中，将非零向量 $u$ 单位化的方法是除以其导出范数：$\\hat{u} = \\frac{u}{|u|} = \\frac{u}{\\sqrt{\\langle u, u \\rangle}}$。其范数的平方为 $\\langle u, u \\rangle$。例如在赋有 $\\langle f, g \\rangle = \\int_0^1 f(t)g(t)\\,dt$ 的 $C[0, 1]$ 中，$p(t) = 3t^2$ 有 $\\|p\\|^2 = 9\\int_0^1 t^4\\,dt = \\frac{9}{5}$，所以 $\\hat{p} = \\frac{3t^2}{\\sqrt{9/5}} = \\sqrt{5}\\,t^2$。\n\n> **注意。** 积分前要把整个函数平方：$(a t^k)^2 = a^2 t^{2k}$，而 $\\int_0^1 t^{2k}\\,dt = \\frac{1}{2k + 1}$，指数要加一。",
      ),
      generate: (rng: Rng): Problem => {
        const k = rng.pick([1, 2, 3, 4, 5]);
        const a = rng.int(1, 10);
        const radicand = 2 * k + 1;
        const answer = Q.of(a * a, radicand);
        const polyStr = a === 1 ? (k === 1 ? "t" : `t^${k}`) : `${a}${k === 1 ? "t" : `t^${k}`}`;

        const prompt = t(
          `In the inner product space $C[0, 1]$ with $\\langle f, g \\rangle = \\int_0^1 f(t)g(t)\\,dt$, compute the squared norm $\\|p\\|^2 = \\langle p, p \\rangle$ of the polynomial $p(t) = ${polyStr}$.`,
          `在赋有内积 $\\langle f, g \\rangle = \\int_0^1 f(t)g(t)\\,dt$ 的内积空间 $C[0, 1]$ 中，计算多项式 $p(t) = ${polyStr}$ 的导出范数的平方 $\\|p\\|^2 = \\langle p, p \\rangle$。`,
        );

        const solution = walked(
          [
            [
              ["Square the polynomial", "把多项式平方"],
              t("", ""),
              [`\\|p\\|^2 = \\int_0^1 (${polyStr})^2\\,dt = ${a * a} \\int_0^1 t^{${2 * k}}\\,dt`],
            ],
            [
              ["Integrate", "积分"],
              t("", ""),
              [`${a * a} \\left[\\frac{t^{${radicand}}}{${radicand}}\\right]_0^1 = \\frac{${a * a}}{${radicand}} = ${answer.toLatex()}`],
            ],
          ],
          t(
            `The squared norm is positive, as it must be for a nonzero function, and dividing $p$ by $\\sqrt{${answer.toLatex()}}$ gives a function of norm $1$.`,
            `平方范数为正，非零函数理应如此；把 $p$ 除以 $\\sqrt{${answer.toLatex()}}$ 就得到范数为 $1$ 的函数。`,
          ),
        );

        return numberProblem({
          prompt,
          answer,
          solution,
          mistakes: [
            why(
              Q.of(a * a, 2 * k),
              `Integrating $t^{${2 * k}}$ raises the exponent to $${radicand}$, so divide by $${radicand}$.`,
              `对 $t^{${2 * k}}$ 积分，指数升为 $${radicand}$，所以要除以 $${radicand}$。`,
            ),
            why(Q.of(a, radicand), `The coefficient must be squared too: $${a}^2 = ${a * a}$.`, `系数也要平方：$${a}^2 = ${a * a}$。`),
            why(
              Q.of(a * a, k + 1),
              `That integrates $t^{${k}}$; the square of $p$ contains $t^{${2 * k}}$.`,
              `这是对 $t^{${k}}$ 积分；$p$ 的平方含有 $t^{${2 * k}}$。`,
            ),
            why(
              Q.of(a, k + 1),
              "That is $\\int_0^1 p(t)\\,dt$, not $\\langle p, p \\rangle$; square $p$ first.",
              "这是 $\\int_0^1 p(t)\\,dt$，不是 $\\langle p, p \\rangle$；要先把 $p$ 平方。",
            ),
          ].filter((w, i, all) => all.findIndex((o) => String(o.value) === String(w.value)) === i),
        });
      },
    },
    {
      id: "orthogonality-of-monomials-on-a-symmetric-interval",
      title: t("Orthogonality of powers on $[-1, 1]$", "$[-1, 1]$ 上幂函数的正交性"),
      explanation: t(
        "Under $\\langle p, q \\rangle = \\int_{-1}^{1} p(x) q(x)\\,dx$, the product $x^m \\cdot x^n = x^{m+n}$ is an odd function when $m + n$ is odd, and the integral of an odd function over a symmetric interval is zero. So $x^m$ and $x^n$ are orthogonal when $m + n$ is odd. When $m + n$ is even the integrand is even and positive away from $0$, so the inner product $\\frac{2}{m + n + 1}$ is never zero. For example, $x^2$ and $x^3$ are orthogonal, since $\\int_{-1}^{1} x^5\\,dx = 0$, while $x$ and $x^3$ are not: $\\int_{-1}^{1} x^4\\,dx = \\frac{2}{5}$.\n\n> **Watch out.** Look at the sum $m + n$, not at $m$ and $n$ separately: two odd powers such as $x$ and $x^3$ give an even product. Nonzero constant factors never change the answer.",
        "在 $\\langle p, q \\rangle = \\int_{-1}^{1} p(x) q(x)\\,dx$ 下，当 $m + n$ 为奇数时，乘积 $x^m \\cdot x^n = x^{m+n}$ 是奇函数，而奇函数在对称区间上的积分为零。所以 $m + n$ 为奇数时 $x^m$ 与 $x^n$ 正交。当 $m + n$ 为偶数时被积函数是偶函数，且在 $0$ 以外为正，所以内积 $\\frac{2}{m + n + 1}$ 不为零。例如 $x^2$ 与 $x^3$ 正交，因为 $\\int_{-1}^{1} x^5\\,dx = 0$；而 $x$ 与 $x^3$ 不正交：$\\int_{-1}^{1} x^4\\,dx = \\frac{2}{5}$。\n\n> **注意。** 要看和 $m + n$，而不是分别看 $m$ 与 $n$：两个奇次幂如 $x$ 与 $x^3$ 的乘积是偶函数。非零常数因子不会改变结论。",
      ),
      generate: (rng: Rng): Problem => {
        const m = rng.int(0, 5);
        let n = rng.int(0, 5);
        if (n === m) n = (m + rng.int(1, 3)) % 6;
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-4, 4);
        const mono = (c: number, e: number) => (e === 0 ? `${c}` : `${c === 1 ? "" : c === -1 ? "-" : c}x${e === 1 ? "" : `^${e}`}`);
        const odd = (m + n) % 2 === 1;
        const right = odd ? yesNo[0]! : yesNo[1]!;
        const other = odd ? yesNo[1]! : yesNo[0]!;
        const solution = walked(
          [
            [["Multiply", "相乘"], t("", ""), [`p(x)q(x) = ${a * b}x^{${m + n}}`]],
            odd
              ? [
                  ["Use the symmetry", "利用对称性"],
                  t(
                    `$x^{${m + n}}$ is an odd function, so its integral over $[-1, 1]$ is $0$ and $p$ and $q$ are orthogonal.`,
                    `$x^{${m + n}}$ 是奇函数，所以它在 $[-1, 1]$ 上的积分为 $0$，$p$ 与 $q$ 正交。`,
                  ),
                ]
              : [
                  ["Integrate", "积分"],
                  t(
                    `$x^{${m + n}}$ is even, so the integral is not zero and $p$ and $q$ are not orthogonal:`,
                    `$x^{${m + n}}$ 是偶函数，积分不为零，所以 $p$ 与 $q$ 不正交：`,
                  ),
                  [`\\langle p, q \\rangle = ${a * b} \\int_{-1}^{1} x^{${m + n}}\\,dx = ${frac(2 * a * b, m + n + 1)} \\ne 0`],
                ],
          ],
          odd
            ? t(
                `An antiderivative is $${frac(a * b, m + n + 1)}x^{${m + n + 1}}$, an even function, which takes the same value at $1$ and $-1$, so the integral is $0$.`,
                `原函数 $${frac(a * b, m + n + 1)}x^{${m + n + 1}}$ 是偶函数，在 $1$ 与 $-1$ 处取值相同，所以积分为 $0$。`,
              )
            : t(
                `The integrand $${a * b}x^{${m + n}}$ has the sign of $${a * b}$ at every $x \\ne 0$, so its integral cannot be $0$.`,
                `被积函数 $${a * b}x^{${m + n}}$ 在每个 $x \\ne 0$ 处都与 $${a * b}$ 同号，所以积分不可能为 $0$。`,
              ),
        );
        return reasoned(
          oneOf(
            rng,
            t(
              `With $\\langle p, q \\rangle = \\int_{-1}^{1} p(x) q(x)\\,dx$, are $p(x) = ${mono(a, m)}$ and $q(x) = ${mono(b, n)}$ orthogonal?`,
              `在 $\\langle p, q \\rangle = \\int_{-1}^{1} p(x) q(x)\\,dx$ 下，$p(x) = ${mono(a, m)}$ 与 $q(x) = ${mono(b, n)}$ 正交吗？`,
            ),
            right,
            [other],
            solution,
          ),
          [
            odd
              ? [
                  other.en,
                  `The product has odd degree $${m + n}$, and an odd function integrates to $0$ over $[-1, 1]$.`,
                  `乘积的次数 $${m + n}$ 是奇数，奇函数在 $[-1, 1]$ 上的积分为 $0$。`,
                ]
              : [
                  other.en,
                  `The product has even degree $${m + n}$; an even power is positive away from $0$, so the integral is not $0$.`,
                  `乘积的次数 $${m + n}$ 是偶数；偶次幂在 $0$ 以外为正，所以积分不为 $0$。`,
                ],
          ],
        );
      },
    },
  ],
};

/** orthogonalMatrices covers orthogonal matrices, their properties and inverses. */
export const orthogonalMatrices: TopicDef = {
  id: "orthogonal-matrices",
  title: t("Orthogonal Matrices", "正交矩阵"),
  summary: t(
    "Identify orthogonal matrices, understand that their columns and rows form orthonormal bases, and use $Q^T = Q^{-1}$.",
    "识别正交矩阵，理解其行与列构成标准正交基，并应用 $Q^T = Q^{-1}$。",
  ),
  intro: t(
    "The matrix $Q = \\frac{1}{5}\\begin{pmatrix} 3 & -4 \\\\ 4 & 3 \\end{pmatrix}$ has columns of length $\\frac{1}{5}\\sqrt{9 + 16} = 1$ whose dot product is $\\frac{1}{25}(-12 + 12) = 0$, so $Q$ is orthogonal and $Q^{-1} = Q^T = \\frac{1}{5}\\begin{pmatrix} 3 & 4 \\\\ -4 & 3 \\end{pmatrix}$.\n\nCheck: $Q^TQ = \\frac{1}{25}\\begin{pmatrix} 9 + 16 & -12 + 12 \\\\ -12 + 12 & 16 + 9 \\end{pmatrix} = I$.\n\nIn this lesson we invert orthogonal matrices by transposing them and solve systems $Qx = b$ with one product $x = Q^Tb$.",
    "矩阵 $Q = \\frac{1}{5}\\begin{pmatrix} 3 & -4 \\\\ 4 & 3 \\end{pmatrix}$ 的两列长度为 $\\frac{1}{5}\\sqrt{9 + 16} = 1$，点积为 $\\frac{1}{25}(-12 + 12) = 0$，所以 $Q$ 是正交矩阵，$Q^{-1} = Q^T = \\frac{1}{5}\\begin{pmatrix} 3 & 4 \\\\ -4 & 3 \\end{pmatrix}$。\n\n检验：$Q^TQ = \\frac{1}{25}\\begin{pmatrix} 9 + 16 & -12 + 12 \\\\ -12 + 12 & 16 + 9 \\end{pmatrix} = I$。\n\n本课我们通过转置求正交矩阵的逆，并用一次乘法 $x = Q^Tb$ 解方程组 $Qx = b$。",
  ),
  prerequisites: ["orthogonal-sets-in-euclidean-spaces"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "orthogonal-matrix-inverse-properties",
      title: t("Inverse and Properties of an Orthogonal Matrix", "正交矩阵的逆及其性质"),
      explanation: t(
        "A square matrix $Q$ is orthogonal if and only if $Q^T Q = I$, which means $Q^{-1} = Q^T$. The columns of $Q$ form an orthonormal basis of $\\mathbb{R}^n$, and $\\det(Q) = \\pm 1$. For example, $Q = \\frac{1}{13}\\begin{pmatrix} 5 & 12 \\\\ 12 & -5 \\end{pmatrix}$ is symmetric and orthogonal, so $Q^{-1} = Q^T = Q$.\n\n> **Watch out.** Transposing reflects the entries across the main diagonal and changes no signs. A candidate inverse can always be tested: its product with $Q$ must be $I$.",
        "方阵 $Q$ 是正交矩阵当且仅当 $Q^T Q = I$，这意味着 $Q^{-1} = Q^T$。$Q$ 的列向量构成 $\\mathbb{R}^n$ 的一组标准正交基，且 $\\det(Q) = \\pm 1$。例如 $Q = \\frac{1}{13}\\begin{pmatrix} 5 & 12 \\\\ 12 & -5 \\end{pmatrix}$ 既对称又正交，所以 $Q^{-1} = Q^T = Q$。\n\n> **注意。** 转置是把元素沿主对角线翻折，不改变任何符号。候选的逆矩阵总可以检验：它与 $Q$ 的乘积必须是 $I$。",
      ),
      generate: (rng: Rng): Problem => {
        const triples = [
          { a: 3, b: 4, d: 5 },
          { a: 4, b: 3, d: 5 },
          { a: 5, b: 12, d: 13 },
          { a: 12, b: 5, d: 13 },
          { a: 8, b: 15, d: 17 },
          { a: 15, b: 8, d: 17 },
          { a: 7, b: 24, d: 25 },
          { a: 24, b: 7, d: 25 },
          { a: 20, b: 21, d: 29 },
          { a: 9, b: 40, d: 41 },
        ];
        const item = rng.pick(triples);
        const s1 = rng.pick([1, -1]);
        const s2 = rng.pick([1, -1]);
        const isReflection = rng.bool();

        const a = s1 * item.a;
        const b = s2 * item.b;
        const d = item.d;

        const qNum = isReflection
          ? [
              [a, b],
              [b, -a],
            ]
          : [
              [a, -b],
              [b, a],
            ];
        const qInvNum = isReflection
          ? [
              [a, b],
              [b, -a],
            ]
          : [
              [a, b],
              [-b, a],
            ];
        const over = (m: number[][]) => matLatex(m.map((row) => row.map((x) => frac(x, d))));

        const qLatex = over(qNum);
        const qInvLatex = over(qInvNum);

        const prompt = t(
          `Given the orthogonal matrix $Q = ${qLatex}$, what is its inverse matrix $Q^{-1}$?`,
          `已知正交矩阵 $Q = ${qLatex}$，求其逆矩阵 $Q^{-1}$。`,
        );

        const right = t(`$${qInvLatex}$`, `$${qInvLatex}$`);
        const wrongNum = [
          [
            [-a, b],
            [-b, -a],
          ],
          [
            [-a, -b],
            [b, -a],
          ],
          [
            [b, a],
            [-a, b],
          ],
          [
            [a, -b],
            [-b, -a],
          ],
        ];
        const wrong = wrongNum.map((m) => t(`$${over(m)}$`, `$${over(m)}$`));
        const corner = (m: number[][]) => frac(m[0]![0]! * qNum[0]![0]! + m[0]![1]! * qNum[1]![0]!, d * d);
        const named = (i: number): [string, string] =>
          !isReflection && i === 0
            ? ["This is $-Q$, not $Q^T$. ", "这是 $-Q$，不是 $Q^T$。"]
            : !isReflection && i === 1
              ? ["This is $-Q^T$; transposing changes no signs. ", "这是 $-Q^T$；转置不改变符号。"]
              : ["", ""];

        const solution = walked(
          [
            [
              ["Use the transpose", "利用转置"],
              t(
                `For an orthogonal matrix $Q^{-1} = Q^T$. ${isReflection ? "This $Q$ is symmetric, so $Q^T = Q$." : "Transposing swaps the two off-diagonal entries."}`,
                `正交矩阵满足 $Q^{-1} = Q^T$。${isReflection ? "这个 $Q$ 是对称矩阵，所以 $Q^T = Q$。" : "转置交换两个非对角元素。"}`,
              ),
              [`Q^{-1} = Q^T = ${qInvLatex}`],
            ],
          ],
          t(
            `The top-left entry of $Q^TQ$ is $\\frac{${a * a} + ${b * b}}{${d * d}} = 1$, and the off-diagonal entries are $\\frac{(${qInvNum[0]![0]!})(${qNum[0]![1]!}) + (${qInvNum[0]![1]!})(${qNum[1]![1]!})}{${d * d}} = 0$, as $Q^TQ = I$ requires.`,
            `$Q^TQ$ 的左上元素为 $\\frac{${a * a} + ${b * b}}{${d * d}} = 1$，非对角元素为 $\\frac{(${qInvNum[0]![0]!})(${qNum[0]![1]!}) + (${qInvNum[0]![1]!})(${qNum[1]![1]!})}{${d * d}} = 0$，符合 $Q^TQ = I$。`,
          ),
        );

        return reasoned(
          oneOf(rng, prompt, right, wrong, solution),
          wrongNum.map((m, i): [string, string, string] => [
            wrong[i]!.en,
            `${named(i)[0]}Its product with $Q$ has top-left entry $${corner(m)}$, not $1$.`,
            `${named(i)[1]}它与 $Q$ 的乘积左上元素为 $${corner(m)}$，不是 $1$。`,
          ]),
        );
      },
    },
    {
      id: "solving-with-an-orthogonal-matrix",
      figure: linearAlgebraDrawings2["orthogonal-matrices#solving-with-an-orthogonal-matrix"],
      title: t("Solving $Qx = b$ with an orthogonal matrix", "用正交矩阵解 $Qx = b$"),
      explanation: t(
        "An orthogonal matrix satisfies $Q^TQ = I$, so its inverse is simply its transpose. The system $Qx = b$ is therefore solved by $x = Q^Tb$, a matrix-vector product with no elimination. For the rotation-like matrix $Q = \\frac{1}{c}\\begin{pmatrix} a & -b \\\\ b & a \\end{pmatrix}$ with $a^2 + b^2 = c^2$, the solution is $x = \\frac{1}{c}\\begin{pmatrix} a & b \\\\ -b & a \\end{pmatrix} b$. For example, $Q = \\frac{1}{5}\\begin{pmatrix} 3 & -4 \\\\ 4 & 3 \\end{pmatrix}$ and $b = (-1, 2)$ give $x = \\frac{1}{5}(-3 + 8, 4 + 6) = (1, 2)$.\n\n> **Watch out.** Multiply $b$ by $Q^T$, not by $Q$: $Qb$ rotates $b$ further instead of undoing the rotation. Check the answer by computing $Qx$.",
        "正交矩阵满足 $Q^TQ = I$，所以它的逆就是它的转置。因此方程组 $Qx = b$ 的解为 $x = Q^Tb$，只需做一次矩阵与向量的乘法，不必消元。对 $a^2 + b^2 = c^2$ 的类旋转矩阵 $Q = \\frac{1}{c}\\begin{pmatrix} a & -b \\\\ b & a \\end{pmatrix}$，解为 $x = \\frac{1}{c}\\begin{pmatrix} a & b \\\\ -b & a \\end{pmatrix} b$。例如 $Q = \\frac{1}{5}\\begin{pmatrix} 3 & -4 \\\\ 4 & 3 \\end{pmatrix}$，$b = (-1, 2)$ 给出 $x = \\frac{1}{5}(-3 + 8, 4 + 6) = (1, 2)$。\n\n> **注意。** 要用 $Q^T$ 乘 $b$，而不是用 $Q$：$Qb$ 会把 $b$ 再转一次，而不是把旋转撤销。可以计算 $Qx$ 来检验答案。",
      ),
      generate: (rng: Rng): Problem => {
        const [a0, b0, c] = rng.pick([
          [3, 4, 5],
          [4, 3, 5],
          [5, 12, 13],
          [12, 5, 13],
          [8, 15, 17],
        ] as const);
        const a = rng.int(0, 1) === 0 ? a0 : -a0;
        const b = rng.int(0, 1) === 0 ? b0 : -b0;
        const x = [rng.int(-4, 4), rng.nonZero(-4, 4)];
        // b = Qx is an integer vector when x is a multiple of c; use x scaled by c and divide in the display.
        const rhs = [a * x[0]! - b * x[1]!, b * x[0]! + a * x[1]!];
        const Qm = matLatex([
          [frac(a, c), frac(-b, c)],
          [frac(b, c), frac(a, c)],
        ]);
        const QTm = matLatex([
          [frac(a, c), frac(b, c)],
          [frac(-b, c), frac(a, c)],
        ]);
        const bv = [frac(rhs[0]!, c), frac(rhs[1]!, c)];
        const timesQ = [Q.of(a * rhs[0]! - b * rhs[1]!, c * c), Q.of(b * rhs[0]! + a * rhs[1]!, c * c)];
        const negated = [-x[0]! || 0, -x[1]!];
        const swapped = [x[1]!, x[0]!];
        return withMistakes(
          pointProblem({
            prompt: t(
              `$Q = ${Qm}$ is orthogonal. Solve $Qx = ${colVecLatex(bv)}$.`,
              `$Q = ${Qm}$ 是正交矩阵。解 $Qx = ${colVecLatex(bv)}$。`,
            ),
            answer: x,
            vector: true,
            wrong: [timesQ, negated, swapped],
            solution: walked(
              [
                [["Invert by transposing", "用转置求逆"], t("", ""), [`Q^{-1} = Q^T = ${QTm}`]],
                [
                  ["Multiply", "相乘"],
                  t("", ""),
                  [
                    `x = Q^T${colVecLatex(bv)} = \\frac{1}{${c * c}}${colVecLatex([`(${a})(${rhs[0]!}) + (${b})(${rhs[1]!})`, `(${-b})(${rhs[0]!}) + (${a})(${rhs[1]!})`])} = \\frac{1}{${c * c}}${colVecLatex([c * c * x[0]!, c * c * x[1]!])} = ${colVecLatex(x)}`,
                  ],
                ],
              ],
              t(
                `$Q${colVecLatex(x)} = \\frac{1}{${c}}${colVecLatex([`(${a})(${x[0]!}) + (${-b})(${x[1]!})`, `(${b})(${x[0]!}) + (${a})(${x[1]!})`])} = ${colVecLatex(bv)}$, the right side.`,
                `$Q${colVecLatex(x)} = \\frac{1}{${c}}${colVecLatex([`(${a})(${x[0]!}) + (${-b})(${x[1]!})`, `(${b})(${x[0]!}) + (${a})(${x[1]!})`])} = ${colVecLatex(bv)}$，正是右边。`,
              ),
            ),
          }),
          dedupeSaid(
            [
              say(
                vectorLatex(timesQ),
                "That multiplies the right side by $Q$; the inverse of $Q$ is $Q^T$.",
                "这是用 $Q$ 乘右边；$Q$ 的逆是 $Q^T$。",
              ),
              say(vectorLatex(negated), "Every sign is flipped; $Q^T$ is not $-Q$.", "每个符号都反了；$Q^T$ 不是 $-Q$。"),
              say(vectorLatex(swapped), "The two components are swapped.", "两个分量交换了。"),
            ],
            vectorLatex(x),
          ),
        );
      },
    },
  ],
};

/** orthogonalLinearTransformations covers length-preserving and angle-preserving transformations. */
export const orthogonalLinearTransformations: TopicDef = {
  id: "orthogonal-linear-transformations",
  title: t("Orthogonal Linear Transformations", "正交线性变换"),
  summary: t(
    "Understand orthogonal transformations as length-preserving and angle-preserving maps (isometries) in ℝⁿ.",
    "理解正交变换是 ℝⁿ 中保长度与保夹角的映射（等距变换）。",
  ),
  prerequisites: ["orthogonal-matrices", "standard-matrix-of-a-linear-transformation-in-terms-of-the-standard-basis"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "orthogonal-transformation-preserves-geometry",
      figure: linearAlgebraDrawings2["orthogonal-linear-transformations#orthogonal-transformation-preserves-geometry"],
      title: t("Preservation of Lengths and Dot Products Under Orthogonal Transformations", "正交变换下长度与点积的保持性"),
      explanation: t(
        "A linear transformation $T: \\mathbb{R}^n \\to \\mathbb{R}^n$ is orthogonal (an isometry) if and only if $T(u) \\cdot T(v) = u \\cdot v$ for all $u, v \\in \\mathbb{R}^n$. Consequently, it preserves lengths: $|T(u)| = |u|$, and preserves angles between vectors.",
        "线性变换 $T: \\mathbb{R}^n \\to \\mathbb{R}^n$ 是正交变换（等距变换）当且仅当对所有 $u, v \\in \\mathbb{R}^n$ 均有 $T(u) \\cdot T(v) = u \\cdot v$。因此它保持向量长度不变：$|T(u)| = |u|$，且保持向量间的夹角不变。",
      ),
      generate: (rng: Rng): Problem => {
        const nu = rng.pick([2, 3, 4, 5]);
        const nv = rng.pick([2, 3, 4, 5]);
        const dot = rng.int(-2, 2);
        const c1 = rng.pick([1, 2]);
        const c2 = rng.pick([1, 2]);

        const val = c1 * c1 * nu * nu - 2 * c1 * c2 * dot + c2 * c2 * nv * nv;
        const c1Str = c1 === 1 ? "" : `${c1}`;
        const c2Str = c2 === 1 ? "" : `${c2}`;

        const prompt = t(
          `Let $T: \\mathbb{R}^n \\to \\mathbb{R}^n$ be an orthogonal linear transformation. Suppose $u, v \\in \\mathbb{R}^n$ satisfy $\\|u\\| = ${nu}$, $\\|v\\| = ${nv}$, and $u \\cdot v = ${dot}$.\nEvaluate $\\|T(${c1Str}u - ${c2Str}v)\\|^2$.`,
          `设 $T: \\mathbb{R}^n \\to \\mathbb{R}^n$ 为正交线性变换。已知向量 $u, v \\in \\mathbb{R}^n$ 满足 $\\|u\\| = ${nu}$、$\\|v\\| = ${nv}$ 且 $u \\cdot v = ${dot}$。\n求 $\\|T(${c1Str}u - ${c2Str}v)\\|^2$ 的值。`,
        );

        const solution = t(
          `Because $T$ is an orthogonal transformation, it is an isometry that preserves lengths and dot products:\n$$\\|T(${c1Str}u - ${c2Str}v)\\|^2 = \\|${c1Str}u - ${c2Str}v\\|^2 = ${c1 === 1 ? "" : c1 * c1}\\|u\\|^2 - ${2 * c1 * c2}(u \\cdot v) + ${c2 === 1 ? "" : c2 * c2}\\|v\\|^2 = ${c1 * c1}(${nu * nu}) - ${2 * c1 * c2}(${dot}) + ${c2 * c2}(${nv * nv}) = ${val}$$`,
          `因为 $T$ 是正交变换，它是保持长度与点积不变的等距变换：\n$$\\|T(${c1Str}u - ${c2Str}v)\\|^2 = \\|${c1Str}u - ${c2Str}v\\|^2 = ${c1 === 1 ? "" : c1 * c1}\\|u\\|^2 - ${2 * c1 * c2}(u \\cdot v) + ${c2 === 1 ? "" : c2 * c2}\\|v\\|^2 = ${c1 * c1}(${nu * nu}) - ${2 * c1 * c2}(${dot}) + ${c2 * c2}(${nv * nv}) = ${val}$$`,
        );

        return numberProblem({
          prompt,
          answer: val,
          solution,
          wrong: [
            c1 * c1 * nu * nu + c2 * c2 * nv * nv,
            c1 * c1 * nu * nu + 2 * c1 * c2 * dot + c2 * c2 * nv * nv,
            val + 6,
            Math.abs(val - 4) || val + 2,
          ],
        });
      },
    },
    {
      id: "distances-under-an-orthogonal-transformation",
      figure: linearAlgebraDrawings2["orthogonal-linear-transformations#distances-under-an-orthogonal-transformation"],
      title: t("Distances under an orthogonal transformation", "正交变换下的距离"),
      explanation: t(
        "An orthogonal transformation preserves inner products, $\\langle T u, T v \\rangle = \\langle u, v \\rangle$, and therefore lengths, distances and angles. To find $\\|Tu - Tv\\|^2$, use linearity to write it as $\\|T(u - v)\\|^2 = \\|u - v\\|^2$ and expand:\n\n$$\\|u - v\\|^2 = \\|u\\|^2 - 2\\langle u, v \\rangle + \\|v\\|^2.$$",
        "正交变换保持内积，$\\langle T u, T v \\rangle = \\langle u, v \\rangle$，因此保持长度、距离与角度。求 $\\|Tu - Tv\\|^2$ 时，用线性把它写成 $\\|T(u - v)\\|^2 = \\|u - v\\|^2$ 再展开：\n\n$$\\|u - v\\|^2 = \\|u\\|^2 - 2\\langle u, v \\rangle + \\|v\\|^2$$",
      ),
      generate: (rng: Rng): Problem => {
        const A = rng.int(2, 6);
        const B = rng.int(2, 6);
        const C = rng.int(-A * B + 1, A * B - 1);
        const ans = A * A + B * B - 2 * C;
        return numberProblem({
          prompt: t(
            `$T$ is an orthogonal linear transformation, $\\|u\\| = ${A}$, $\\|v\\| = ${B}$ and $\\langle u, v \\rangle = ${C}$. Find $\\|T u - T v\\|^2$.`,
            `$T$ 是正交线性变换，$\\|u\\| = ${A}$，$\\|v\\| = ${B}$，$\\langle u, v \\rangle = ${C}$。求 $\\|T u - T v\\|^2$。`,
          ),
          answer: ans,
          wrong: [A * A + B * B + 2 * C, A * A + B * B - C, (A - B) ** 2],
          solution: t(
            `$\\|Tu - Tv\\|^2 = \\|u - v\\|^2 = ${A * A} - 2(${C}) + ${B * B} = ${ans}$.`,
            `$\\|Tu - Tv\\|^2 = \\|u - v\\|^2 = ${A * A} - 2(${C}) + ${B * B} = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

/** fourFundamentalSubspacesOfAMatrix covers orthogonal relationships among the four fundamental subspaces. */
export const fourFundamentalSubspacesOfAMatrix: TopicDef = {
  id: "four-fundamental-subspaces-of-a-matrix",
  title: t("The Four Fundamental Subspaces of a Matrix", "矩阵的四个基本子空间"),
  summary: t(
    "Relate the four fundamental subspaces of an $m \\times n$ matrix: $(\\operatorname{Col} A)^{\\perp} = \\operatorname{Nul} A^T$ and $(\\operatorname{Row} A)^{\\perp} = \\operatorname{Nul} A$.",
    "建立 $m \\times n$ 矩阵四个基本子空间的正交关系：$(\\operatorname{Col} A)^{\\perp} = \\operatorname{Nul} A^T$ 与 $(\\operatorname{Row} A)^{\\perp} = \\operatorname{Nul} A$。",
  ),
  prerequisites: ["orthogonal-complements", "the-column-space-of-a-matrix", "the-null-space-of-a-matrix"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "fundamental-subspaces-orthogonal-complements",
      title: t("Orthogonal Complement Relations of Fundamental Subspaces", "基本子空间的正交补关系"),
      explanation: t(
        "For any $m \\times n$ real matrix $A$, the fundamental theorem of linear algebra states that $(\\operatorname{Row}(A))^\\perp = \\operatorname{Nul}(A)$ in $\\mathbb{R}^n$, and $(\\operatorname{Col}(A))^\\perp = \\operatorname{Nul}(A^T)$ in $\\mathbb{R}^m$. Moreover, $\\dim(\\operatorname{Row}(A)) = \\dim(\\operatorname{Col}(A)) = r$, $\\dim(\\operatorname{Nul}(A)) = n - r$, and $\\dim(\\operatorname{Nul}(A^T)) = m - r$.",
        "对于任意 $m \\times n$ 实矩阵 $A$，线性代数基本定理指出：在 $\\mathbb{R}^n$ 中有 $(\\operatorname{Row}(A))^\\perp = \\operatorname{Nul}(A)$，在 $\\mathbb{R}^m$ 中有 $(\\operatorname{Col}(A))^\\perp = \\operatorname{Nul}(A^T)$。此外，$\\dim(\\operatorname{Row}(A)) = \\dim(\\operatorname{Col}(A)) = r$，$\\dim(\\operatorname{Nul}(A)) = n - r$，且 $\\dim(\\operatorname{Nul}(A^T)) = m - r$。",
      ),
      generate: (rng: Rng): Problem => {
        const m = rng.pick([3, 4, 5, 6, 7]);
        const n = rng.pick([3, 4, 5, 6, 7]);
        const maxRank = Math.min(m, n) - 1;
        const r = rng.int(1, maxRank);

        const askColComp = rng.bool();
        const targetSpace = askColComp ? "(\\operatorname{Col}(A))^\\perp" : "(\\operatorname{Row}(A))^\\perp";
        const targetZh = askColComp ? "列空间的正交补 (\\operatorname{Col}(A))^\\perp" : "行空间的正交补 (\\operatorname{Row}(A))^\\perp";
        const answerVal = askColComp ? m - r : n - r;

        const prompt = t(
          `Let $A$ be ${article(m)} $${m} \\times ${n}$ matrix with rank $r = ${r}$. What is the dimension of $${targetSpace}$?`,
          `设 $A$ 为一个秩 $r = ${r}$ 的 $${m} \\times ${n}$ 矩阵。求 $${targetZh}$ 的维数。`,
        );

        const explanationPart = askColComp
          ? `$(\\operatorname{Col}(A))^\\perp = \\operatorname{Nul}(A^T)$ in $\\mathbb{R}^{${m}}$, so $\\dim((\\operatorname{Col}(A))^\\perp) = m - r = ${m} - ${r} = ${answerVal}$.`
          : `$(\\operatorname{Row}(A))^\\perp = \\operatorname{Nul}(A)$ in $\\mathbb{R}^{${n}}$, so $\\dim((\\operatorname{Row}(A))^\\perp) = n - r = ${n} - ${r} = ${answerVal}$.`;

        const explanationZh = askColComp
          ? `在 $\\mathbb{R}^{${m}}$ 中，$(\\operatorname{Col}(A))^\\perp = \\operatorname{Nul}(A^T)$，因此 $\\dim((\\operatorname{Col}(A))^\\perp) = m - r = ${m} - ${r} = ${answerVal}$。`
          : `在 $\\mathbb{R}^{${n}}$ 中，$(\\operatorname{Row}(A))^\\perp = \\operatorname{Nul}(A)$，因此 $\\dim((\\operatorname{Row}(A))^\\perp) = n - r = ${n} - ${r} = ${answerVal}$。`;

        const solution = t(`By the Fundamental Theorem of Linear Algebra, ${explanationPart}`, `由线性代数基本定理，${explanationZh}`);

        return numberProblem({
          prompt,
          answer: answerVal,
          solution,
          wrong: [r, askColComp ? n - r : m - r, m, n, answerVal + 1, Math.max(1, answerVal - 1)],
        });
      },
    },
    {
      id: "dimensions-of-the-four-subspaces",
      title: t("Dimensions of the four fundamental subspaces", "四个基本子空间的维数"),
      explanation: t(
        "For an $m \\times n$ matrix $A$ of rank $r$, the four fundamental subspaces have dimensions fixed by $m$, $n$ and $r$ alone:\n\n$$\\dim \\operatorname{Col}(A) = \\dim \\operatorname{Row}(A) = r, \\quad \\dim \\operatorname{Nul}(A) = n - r, \\quad \\dim \\operatorname{Nul}(A^T) = m - r.$$\n\nThe row space and null space live in $\\mathbb{R}^n$ and are orthogonal complements, so their dimensions add to $n$; the column space and left null space live in $\\mathbb{R}^m$ and add to $m$.",
        "对秩为 $r$ 的 $m \\times n$ 矩阵 $A$，四个基本子空间的维数只由 $m$、$n$、$r$ 决定：\n\n$$\\dim \\operatorname{Col}(A) = \\dim \\operatorname{Row}(A) = r, \\quad \\dim \\operatorname{Nul}(A) = n - r, \\quad \\dim \\operatorname{Nul}(A^T) = m - r$$\n\n行空间与零空间位于 $\\mathbb{R}^n$ 中且互为正交补，维数之和为 $n$；列空间与左零空间位于 $\\mathbb{R}^m$ 中，维数之和为 $m$。",
      ),
      generate: (rng: Rng): Problem => {
        const m = rng.int(3, 8);
        const n = rng.int(3, 8);
        const r = rng.int(1, Math.min(m, n));
        const kind = rng.int(0, 2);
        const names = [
          t("the null space $\\operatorname{Nul}(A)$", "零空间 $\\operatorname{Nul}(A)$"),
          t("the left null space $\\operatorname{Nul}(A^T)$", "左零空间 $\\operatorname{Nul}(A^T)$"),
          t("the row space $\\operatorname{Row}(A)$", "行空间 $\\operatorname{Row}(A)$"),
        ];
        const ans = [n - r, m - r, r][kind]!;
        const name = names[kind]!;
        return numberProblem({
          prompt: t(
            `$A$ is a $${m} \\times ${n}$ matrix of rank $${r}$. What is the dimension of ${name.en}?`,
            `$A$ 是秩为 $${r}$ 的 $${m} \\times ${n}$ 矩阵。${name["zh-CN"]}的维数是多少？`,
          ),
          answer: ans,
          wrong: [n - r, m - r, r, m, n].filter((w) => w !== ans),
          solution: t(
            `$\\dim \\operatorname{Row}(A) = r = ${r}$, $\\dim \\operatorname{Nul}(A) = n - r = ${n - r}$ and $\\dim \\operatorname{Nul}(A^T) = m - r = ${m - r}$. So the answer is $${ans}$.`,
            `$\\dim \\operatorname{Row}(A) = r = ${r}$，$\\dim \\operatorname{Nul}(A) = n - r = ${n - r}$，$\\dim \\operatorname{Nul}(A^T) = m - r = ${m - r}$。所以答案是 $${ans}$。`,
          ),
        });
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE 6.23: ORTHOGONAL PROJECTIONS
// ════════════════════════════════════════════════════════════════════════════

/** projectingVectorsOntoOneDimensionalSubspaces covers projecting onto lines. */
export const projectingVectorsOntoOneDimensionalSubspaces: TopicDef = {
  id: "projecting-vectors-onto-one-dimensional-subspaces",
  title: t("Projecting Vectors Onto One-Dimensional Subspaces", "将向量投影到一维子空间"),
  summary: t(
    "Calculate the orthogonal projection of a vector onto a line and find the orthogonal component.",
    "计算向量在直线上的正交投影，并求解与该直线正交的分量。",
  ),
  prerequisites: ["orthogonal-vectors-in-euclidean-spaces"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "vector-projection-onto-line-formula",
      title: t("Formula for Projection Onto a Vector", "向量在直线上的投影公式"),
      explanation: t(
        "The orthogonal projection of a vector $y$ onto the one-dimensional subspace spanned by a nonzero vector $u$ is $\\operatorname{proj}_u(y) = \\frac{y \\cdot u}{u \\cdot u} u$. The component of $y$ orthogonal to $u$ is $z = y - \\operatorname{proj}_u(y)$.",
        "向量 $y$ 在由非零向量 $u$ 张成的一维子空间上的正交投影为 $\\operatorname{proj}_u(y) = \\frac{y \\cdot u}{u \\cdot u} u$。向量 $y$ 与 $u$ 正交的分量为 $z = y - \\operatorname{proj}_u(y)$。",
      ),
      generate: (rng: Rng): Problem => {
        const u = [rng.pick([-2, -1, 1, 2]), rng.pick([-2, -1, 1, 2]), rng.pick([-1, 0, 1])];

        const uDotU = u[0]! * u[0]! + u[1]! * u[1]! + u[2]! * u[2]!;
        const scale = rng.pick([-3, -2, -1, 1, 2, 3]);

        const z = [-u[1]!, u[0]!, 0];
        const y = [scale * u[0]! + z[0]!, scale * u[1]! + z[1]!, scale * u[2]! + z[2]!];
        const proj = [scale * u[0]!, scale * u[1]!, scale * u[2]!];

        const prompt = t(
          `Find the orthogonal projection $\\operatorname{proj}_u(y)$ of the vector $y$ onto the subspace spanned by $u$ in $\\mathbb{R}^3$:\n$$y = ${colVecLatex(y)}, \\quad u = ${colVecLatex(u)}$$\nEnter your answer as a vector $\\langle v_1, v_2, v_3 \\rangle$.`,
          `求向量 $y$ 在由 $u$ 张成的一维子空间上的正交投影 $\\operatorname{proj}_u(y)$：\n$$y = ${colVecLatex(y)}, \\quad u = ${colVecLatex(u)}$$\n请以向量 $\\langle v_1, v_2, v_3 \\rangle$ 的形式作答。`,
        );

        const solution = t(
          `Compute $y \\cdot u$ and $u \\cdot u$:\n$$y \\cdot u = ${scale * uDotU}, \\quad u \\cdot u = ${uDotU}$$\nThen:\n$$\\operatorname{proj}_u(y) = \\frac{y \\cdot u}{u \\cdot u} u = \\frac{${scale * uDotU}}{${uDotU}} ${colVecLatex(u)} = ${colVecLatex(proj)}$$`,
          `计算点积 $y \\cdot u$ 与 $u \\cdot u$：\n$$y \\cdot u = ${scale * uDotU}, \\quad u \\cdot u = ${uDotU}$$\n因此：\n$$\\operatorname{proj}_u(y) = \\frac{y \\cdot u}{u \\cdot u} u = \\frac{${scale * uDotU}}{${uDotU}} ${colVecLatex(u)} = ${colVecLatex(proj)}$$`,
        );

        return pointProblem({
          prompt,
          answer: proj,
          vector: true,
          solution,
          wrong: [z, [-proj[0]!, -proj[1]!, -proj[2]!], [(scale + 1) * u[0]!, (scale + 1) * u[1]!, (scale + 1) * u[2]!], y],
        });
      },
    },
    {
      id: "the-component-orthogonal-to-a-line",
      title: t("The component orthogonal to a line", "垂直于直线的分量"),
      explanation: t(
        "Every vector $y$ splits uniquely as $y = \\hat{y} + z$ with $\\hat{y}$ on the line spanned by $u$ and $z$ orthogonal to $u$. First compute the projection $\\hat{y} = \\frac{y \\cdot u}{u \\cdot u}\\,u$, then subtract: $z = y - \\hat{y}$. A quick check is $z \\cdot u = 0$.",
        "每个向量 $y$ 都能唯一分解为 $y = \\hat{y} + z$，其中 $\\hat{y}$ 在 $u$ 张成的直线上，$z$ 与 $u$ 正交。先求投影 $\\hat{y} = \\frac{y \\cdot u}{u \\cdot u}\\,u$，再相减：$z = y - \\hat{y}$。可用 $z \\cdot u = 0$ 快速检验。",
      ),
      generate: (rng: Rng): Problem => {
        const u = [rng.nonZero(-3, 3), rng.nonZero(-3, 3)];
        const k = rng.nonZero(-3, 3);
        const m = rng.nonZero(-2, 2);
        const z = [-m * u[1]!, m * u[0]!];
        const y = [k * u[0]! + z[0]!, k * u[1]! + z[1]!];
        const uu = u[0]! * u[0]! + u[1]! * u[1]!;
        const yu = y[0]! * u[0]! + y[1]! * u[1]!;
        return pointProblem({
          prompt: t(
            `Write $y = (${y.join(", ")})$ as $\\hat{y} + z$ with $\\hat{y}$ a multiple of $u = (${u.join(", ")})$ and $z \\perp u$. Find $z$.`,
            `把 $y = (${y.join(", ")})$ 写成 $\\hat{y} + z$，其中 $\\hat{y}$ 是 $u = (${u.join(", ")})$ 的倍数且 $z \\perp u$。求 $z$。`,
          ),
          answer: z,
          vector: true,
          wrong: [
            [k * u[0]!, k * u[1]!],
            [-z[0]!, -z[1]!],
            [y[0]! - u[0]!, y[1]! - u[1]!],
          ],
          solution: t(
            `$\\frac{y \\cdot u}{u \\cdot u} = \\frac{${yu}}{${uu}} = ${k}$, so $\\hat{y} = (${k * u[0]!}, ${k * u[1]!})$ and $z = y - \\hat{y} = (${z.join(", ")})$.`,
            `$\\frac{y \\cdot u}{u \\cdot u} = \\frac{${yu}}{${uu}} = ${k}$，所以 $\\hat{y} = (${k * u[0]!}, ${k * u[1]!})$，$z = y - \\hat{y} = (${z.join(", ")})$。`,
          ),
        });
      },
    },
  ],
};

/** componentsOfAVectorWithRespectToAnOrthogonalOrOrthonormalBasis covers expansion in orthogonal bases. */
export const componentsOfAVectorWithRespectToAnOrthogonalOrOrthonormalBasis: TopicDef = {
  id: "components-of-a-vector-with-respect-to-an-orthogonal-or-orthonormal-basis",
  title: t("The Components of a Vector with Respect to an Orthogonal or Orthonormal Basis", "向量关于正交基或标准正交基的分量"),
  summary: t(
    "Express a vector as a linear combination of orthogonal basis vectors using Fourier coefficients.",
    "利用傅里叶系数将向量表示为正交基向量的线性组合。",
  ),
  prerequisites: ["projecting-vectors-onto-one-dimensional-subspaces", "orthogonal-sets-in-euclidean-spaces"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "coordinates-relative-to-orthogonal-basis",
      title: t("Fourier Coefficients with Respect to an Orthogonal Basis", "正交基下的傅里叶坐标分量"),
      explanation: t(
        "If $\\mathcal{B} = \\{u_1, \\dots, u_p\\}$ is an orthogonal basis, any vector $y$ in the span can be written as $y = c_1 u_1 + \\dots + c_p u_p$, where the coordinates are $c_j = \\frac{y \\cdot u_j}{u_j \\cdot u_j}$. If $\\mathcal{B}$ is orthonormal, $c_j = y \\cdot u_j$.",
        "若 $\\mathcal{B} = \\{u_1, \\dots, u_p\\}$ 是一组正交基，则其张成空间中的任意向量 $y$ 均可表示为 $y = c_1 u_1 + \\dots + c_p u_p$，其中坐标分量为 $c_j = \\frac{y \\cdot u_j}{u_j \\cdot u_j}$。若 $\\mathcal{B}$ 为标准正交基，则 $c_j = y \\cdot u_j$。",
      ),
      generate: (rng: Rng): Problem => {
        const u1 = [1, 1, 0];
        const u2 = [1, -1, 0];
        const u3 = [0, 0, 1];

        const c1 = rng.int(-4, 4);
        const c2 = rng.int(-4, 4);
        const c3 = rng.int(-4, 4);

        const y = [c1 + c2, c1 - c2, c3];

        const prompt = t(
          `Let $\\mathcal{B} = \\{u_1, u_2, u_3\\}$ be an orthogonal basis of $\\mathbb{R}^3$, where:\n$$u_1 = ${colVecLatex(u1)}, \\quad u_2 = ${colVecLatex(u2)}, \\quad u_3 = ${colVecLatex(u3)}$$\nFind the coordinate vector $[y]_{\\mathcal{B}}$ for $y = ${colVecLatex(y)}$. Enter your answer as a vector $\\langle c_1, c_2, c_3 \\rangle$.`,
          `设 $\\mathcal{B} = \\{u_1, u_2, u_3\\}$ 为 $\\mathbb{R}^3$ 的一组正交基，其中：\n$$u_1 = ${colVecLatex(u1)}, \\quad u_2 = ${colVecLatex(u2)}, \\quad u_3 = ${colVecLatex(u3)}$$\n求向量 $y = ${colVecLatex(y)}$ 在基 $\\mathcal{B}$ 下的坐标向量 $[y]_{\\mathcal{B}}$。请以向量 $\\langle c_1, c_2, c_3 \\rangle$ 的形式作答。`,
        );

        const solution = t(
          `Compute each Fourier coordinate $c_j = \\frac{y \\cdot u_j}{u_j \\cdot u_j}$:\n$$c_1 = \\frac{${y[0]! + y[1]!}}{2} = ${c1}, \\quad c_2 = \\frac{${y[0]! - y[1]!}}{2} = ${c2}, \\quad c_3 = \\frac{${c3}}{1} = ${c3}$$\nThus $[y]_{\\mathcal{B}} = ${colVecLatex([c1, c2, c3])}$.`,
          `计算各傅里叶坐标分量 $c_j = \\frac{y \\cdot u_j}{u_j \\cdot u_j}$：\n$$c_1 = \\frac{${y[0]! + y[1]!}}{2} = ${c1}, \\quad c_2 = \\frac{${y[0]! - y[1]!}}{2} = ${c2}, \\quad c_3 = \\frac{${c3}}{1} = ${c3}$$\n因此 $[y]_{\\mathcal{B}} = ${colVecLatex([c1, c2, c3])}$。`,
        );

        return pointProblem({
          prompt,
          answer: [c1, c2, c3],
          vector: true,
          solution,
          wrong: [y, [c2, c1, c3], [-c1, -c2, -c3], [c1 + 1, c2 - 1, c3]],
        });
      },
    },
    {
      id: "length-from-orthonormal-coordinates",
      title: t("Length from orthonormal coordinates", "由标准正交坐标求长度"),
      explanation: t(
        "If $\\{u_1, \\dots, u_n\\}$ is an orthonormal basis and $x = c_1u_1 + \\dots + c_nu_n$, then all cross terms vanish and every $\\|u_i\\| = 1$, so\n\n$$\\|x\\|^2 = c_1^2 + \\dots + c_n^2.$$\n\nLengths can be read straight from the coordinates, exactly as with the standard basis. This fails for a basis that is only orthogonal: there each $c_i^2$ must be weighted by $\\|u_i\\|^2$.",
        "若 $\\{u_1, \\dots, u_n\\}$ 是标准正交基且 $x = c_1u_1 + \\dots + c_nu_n$，则所有交叉项为零且每个 $\\|u_i\\| = 1$，所以\n\n$$\\|x\\|^2 = c_1^2 + \\dots + c_n^2$$\n\n长度可以直接从坐标读出，与标准基完全一样。对只是正交的基这不成立：那时每个 $c_i^2$ 都要乘以 $\\|u_i\\|^2$。",
      ),
      generate: (rng: Rng): Problem => {
        const quads: [number[], number][] = [
          [[1, 2, 2, 0], 3],
          [[2, 3, 6, 0], 7],
          [[1, 1, 1, 1], 2],
          [[1, 1, 3, 5], 6],
          [[2, 4, 5, 6], 9],
          [[2, 2, 4, 5], 7],
          [[1, 5, 5, 7], 10],
          [[1, 4, 8, 0], 9],
        ];
        const [base, n] = rng.pick(quads);
        const c = rng.shuffle(base.map((x) => (rng.int(0, 1) === 0 ? x : -x)));
        return numberProblem({
          prompt: t(
            `$\\{u_1, u_2, u_3, u_4\\}$ is an orthonormal basis of $\\mathbb{R}^4$ and $x = ${formatLinEq(c, ["u_1", "u_2", "u_3", "u_4"])}$. Find $\\|x\\|$.`,
            `$\\{u_1, u_2, u_3, u_4\\}$ 是 $\\mathbb{R}^4$ 的标准正交基，$x = ${formatLinEq(c, ["u_1", "u_2", "u_3", "u_4"])}$。求 $\\|x\\|$。`,
          ),
          answer: n,
          wrong: [n * n, c.reduce((s, x) => s + x, 0), c.reduce((s, x) => s + Math.abs(x), 0)],
          solution: t(
            `$\\|x\\|^2 = ${c.map((x) => `${x * x}`).join(" + ")} = ${n * n}$, so $\\|x\\| = ${n}$.`,
            `$\\|x\\|^2 = ${c.map((x) => `${x * x}`).join(" + ")} = ${n * n}$，所以 $\\|x\\| = ${n}$。`,
          ),
        });
      },
    },
  ],
};

/** projectingVectorsOntoSubspacesInEuclideanSpacesOrthogonalBases covers projection onto subspaces with orthogonal bases. */
export const projectingVectorsOntoSubspacesInEuclideanSpacesOrthogonalBases: TopicDef = {
  id: "projecting-vectors-onto-subspaces-in-euclidean-spaces-orthogonal-bases",
  title: t("Projecting Vectors Onto Subspaces in Euclidean Spaces (Orthogonal Bases)", "欧几里得空间中将向量投影到子空间（正交基）"),
  summary: t(
    "Compute the projection of a vector onto a subspace spanned by an orthogonal basis.",
    "计算向量在由正交基张成的子空间上的正交投影。",
  ),
  prerequisites: ["components-of-a-vector-with-respect-to-an-orthogonal-or-orthonormal-basis"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "projecting-onto-subspace-orthogonal-basis",
      title: t("Orthogonal Projection onto a Subspace via Orthogonal Basis", "利用正交基求解子空间上的正交投影"),
      explanation: t(
        "With an orthogonal basis, the projection onto the subspace is simply the sum of the projections onto each basis vector separately. Let $W = \\operatorname{span}\\{u_1, \\dots, u_k\\}$ where $\\{u_1, \\dots, u_k\\}$ is an orthogonal basis. The orthogonal projection of $y$ onto $W$ is $\\hat{y} = \\operatorname{proj}_W(y) = \\sum_{i=1}^k \\frac{y \\cdot u_i}{u_i \\cdot u_i} u_i$.",
        "有了正交基，在子空间上的投影就等于在每个基向量上分别投影后的和。设 $W = \\operatorname{span}\\{u_1, \\dots, u_k\\}$，其中 $\\{u_1, \\dots, u_k\\}$ 是一组正交基。向量 $y$ 在 $W$ 上的正交投影为 $\\hat{y} = \\operatorname{proj}_W(y) = \\sum_{i=1}^k \\frac{y \\cdot u_i}{u_i \\cdot u_i} u_i$。",
      ),
      generate: (rng: Rng): Problem => {
        const u1 = [1, 1, 0, 0];
        const u2 = [0, 0, 1, 1];

        const k1 = rng.int(-3, 3);
        const k2 = rng.int(-3, 3);
        const z1 = rng.pick([-2, -1, 1, 2]);
        const z2 = rng.pick([-2, -1, 1, 2]);

        const y = [k1 + z1, k1 - z1, k2 + z2, k2 - z2];
        const proj = [k1, k1, k2, k2];
        const z = [z1, -z1, z2, -z2];

        const prompt = t(
          `Let $W = \\operatorname{span}\\{u_1, u_2\\} \\subset \\mathbb{R}^4$, where $u_1 = ${colVecLatex(u1)}$ and $u_2 = ${colVecLatex(u2)}$.\nFind the orthogonal projection $\\hat{y} = \\operatorname{proj}_W(y)$ of $y = ${colVecLatex(y)}$ onto $W$. Enter your answer as a vector $\\langle v_1, v_2, v_3, v_4 \\rangle$.`,
          `设 $W = \\operatorname{span}\\{u_1, u_2\\} \\subset \\mathbb{R}^4$，其中 $u_1 = ${colVecLatex(u1)}$ 且 $u_2 = ${colVecLatex(u2)}$。\n求向量 $y = ${colVecLatex(y)}$ 在子空间 $W$ 上的正交投影 $\\hat{y} = \\operatorname{proj}_W(y)$。请以向量 $\\langle v_1, v_2, v_3, v_4 \\rangle$ 的形式作答。`,
        );

        const solution = t(
          `Because $u_1 \\cdot u_2 = 0$, the orthogonal projection is the sum of projections onto $u_1$ and $u_2$:\n$$\\hat{y} = \\frac{y \\cdot u_1}{u_1 \\cdot u_1} u_1 + \\frac{y \\cdot u_2}{u_2 \\cdot u_2} u_2 = \\frac{${2 * k1}}{2} u_1 + \\frac{${2 * k2}}{2} u_2 = ${colVecLatex(proj)}$$`,
          `因 $u_1 \\cdot u_2 = 0$，正交投影等于在 $u_1$ 与 $u_2$ 上的分量投影之和：\n$$\\hat{y} = \\frac{y \\cdot u_1}{u_1 \\cdot u_1} u_1 + \\frac{y \\cdot u_2}{u_2 \\cdot u_2} u_2 = \\frac{${2 * k1}}{2} u_1 + \\frac{${2 * k2}}{2} u_2 = ${colVecLatex(proj)}$$`,
        );

        return pointProblem({
          prompt,
          answer: proj,
          vector: true,
          solution,
          wrong: [z, [k1, k1, 0, 0], [0, 0, k2, k2], [-k1, -k1, -k2, -k2]],
        });
      },
    },
    {
      id: "distance-to-a-plane-with-an-orthogonal-basis",
      title: t("Distance from a point to a plane through the origin", "点到过原点平面的距离"),
      explanation: t(
        "With an orthogonal basis $\\{u_1, u_2\\}$ of a plane $W$, the projection is $\\hat{y} = \\frac{y \\cdot u_1}{u_1 \\cdot u_1}u_1 + \\frac{y \\cdot u_2}{u_2 \\cdot u_2}u_2$. The distance from $y$ to $W$ is the length of what is left over, $\\|y - \\hat{y}\\|$, because $\\hat{y}$ is the closest point of $W$ to $y$ and $y - \\hat{y}$ is orthogonal to $W$.",
        "用平面 $W$ 的正交基 $\\{u_1, u_2\\}$，投影为 $\\hat{y} = \\frac{y \\cdot u_1}{u_1 \\cdot u_1}u_1 + \\frac{y \\cdot u_2}{u_2 \\cdot u_2}u_2$。$y$ 到 $W$ 的距离是剩余部分的长度 $\\|y - \\hat{y}\\|$，因为 $\\hat{y}$ 是 $W$ 中离 $y$ 最近的点，而 $y - \\hat{y}$ 与 $W$ 正交。",
      ),
      generate: (rng: Rng): Problem => {
        const frames = [
          { u1: [2, -1, 0], u2: [2, 4, -5], n: [1, 2, 2], len: 3 },
          { u1: [0, 1, -1], u2: [4, 1, 1], n: [1, -2, -2], len: 3 },
        ];
        const f = rng.pick(frames);
        const a = rng.int(-2, 2);
        const b = rng.nonZero(-1, 1);
        const k = rng.nonZero(-3, 3);
        const y = [0, 1, 2].map((i) => a * f.u1[i]! + b * f.u2[i]! + k * f.n[i]!);
        const ans = Math.abs(k) * f.len;
        const yhat = [0, 1, 2].map((i) => a * f.u1[i]! + b * f.u2[i]!);
        return numberProblem({
          prompt: t(
            `$u_1 = (${f.u1.join(", ")})$ and $u_2 = (${f.u2.join(", ")})$ are an orthogonal basis of a plane $W$. Find the distance from $y = (${y.join(", ")})$ to $W$.`,
            `$u_1 = (${f.u1.join(", ")})$ 与 $u_2 = (${f.u2.join(", ")})$ 是平面 $W$ 的正交基。求 $y = (${y.join(", ")})$ 到 $W$ 的距离。`,
          ),
          answer: ans,
          wrong: [ans * ans, Math.abs(k), f.len],
          solution: t(
            `The coefficients are $${a}$ and $${b}$, so $\\hat{y} = (${yhat.join(", ")})$ and $y - \\hat{y} = (${f.n.map((x) => x * k).join(", ")})$, whose length is $${ans}$.`,
            `系数为 $${a}$ 与 $${b}$，所以 $\\hat{y} = (${yhat.join(", ")})$，$y - \\hat{y} = (${f.n.map((x) => x * k).join(", ")})$，其长度为 $${ans}$。`,
          ),
        });
      },
    },
  ],
};

/** projectingVectorsOntoSubspacesInEuclideanSpacesArbitraryBases covers projection via normal equations. */
export const projectingVectorsOntoSubspacesInEuclideanSpacesArbitraryBases: TopicDef = {
  id: "projecting-vectors-onto-subspaces-in-euclidean-spaces-arbitrary-bases",
  title: t("Projecting Vectors Onto Subspaces in Euclidean Spaces (Arbitrary Bases)", "欧几里得空间中将向量投影到子空间（任意基）"),
  summary: t(
    "Project vectors onto subspaces using the normal equations $A^T A \\hat{\\mathbf{x}} = A^T \\mathbf{y}$ and the projection matrix $P = A(A^T A)^{-1} A^T$.",
    "利用正规方程 $A^T A \\hat{\\mathbf{x}} = A^T \\mathbf{y}$ 及投影矩阵 $P = A(A^T A)^{-1} A^T$ 将向量投影到子空间。",
  ),
  prerequisites: ["projecting-vectors-onto-subspaces-in-euclidean-spaces-orthogonal-bases"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "least-squares-normal-equations-solution",
      title: t("Normal Equations for Non-Orthogonal Bases", "非正交基下的正规方程求解"),
      explanation: t(
        "When the columns of $A$ form an arbitrary (not necessarily orthogonal) basis of $W = \\operatorname{Col}(A)$, the projection $\\hat{y} = A \\hat{x}$ is found by solving the normal equations $A^T A \\hat{x} = A^T y$.",
        "当矩阵 $A$ 的各列构成子空间 $W = \\operatorname{Col}(A)$ 的任意基（不必正交）时，投影 $\\hat{y} = A \\hat{x}$ 可通过求解正规方程 $A^T A \\hat{x} = A^T y$ 确定。",
      ),
      generate: (rng: Rng): Problem => {
        const A = [
          [1, 0],
          [0, 1],
          [1, 1],
        ];

        const x1 = rng.int(-3, 3);
        const x2 = rng.int(-3, 3);

        const zScale = rng.pick([-3, -2, -1, 1, 2, 3]);
        const y = [x1 + zScale, x2 + zScale, x1 + x2 - zScale];

        const prompt = t(
          `Let $W = \\operatorname{Col}(A) \\subset \\mathbb{R}^3$, where $A = ${matLatex(A)}$.\nSolve the normal equations $A^T A \\hat{x} = A^T y$ for the projection coefficient vector $\\hat{x}$ with $y = ${colVecLatex(y)}$. Enter your answer as a vector $\\langle \\hat{x}_1, \\hat{x}_2 \\rangle$.`,
          `设 $W = \\operatorname{Col}(A) \\subset \\mathbb{R}^3$，其中 $A = ${matLatex(A)}$。\n求解关于投影系数向量 $\\hat{x}$ 的正规方程 $A^T A \\hat{x} = A^T y$，其中 $y = ${colVecLatex(y)}$。请以向量 $\\langle \\hat{x}_1, \\hat{x}_2 \\rangle$ 的形式作答。`,
        );

        const aty1 = y[0]! + y[2]!;
        const aty2 = y[1]! + y[2]!;
        const solution = t(
          `Compute $A^T A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}$ and $A^T y = \\begin{pmatrix} ${aty1} \\\\ ${aty2} \\end{pmatrix}$.\nSolving the normal equations $\\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix} \\hat{x} = \\begin{pmatrix} ${aty1} \\\\ ${aty2} \\end{pmatrix}$ gives $\\hat{x} = ${colVecLatex([x1, x2])}$.`,
          `计算 $A^T A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}$ 以及 $A^T y = \\begin{pmatrix} ${aty1} \\\\ ${aty2} \\end{pmatrix}$。\n求解正规方程 $\\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix} \\hat{x} = \\begin{pmatrix} ${aty1} \\\\ ${aty2} \\end{pmatrix}$ 得 $\\hat{x} = ${colVecLatex([x1, x2])}$。`,
        );

        return pointProblem({
          prompt,
          answer: [x1, x2],
          vector: true,
          solution,
          wrong: [
            [x2, x1],
            [-x1, -x2],
            [x1 + 1, x2 - 1],
            [y[0]!, y[1]!],
          ],
        });
      },
    },
    {
      id: "projection-onto-a-column-space",
      title: t("The projection onto a column space", "向列空间的投影"),
      explanation: t(
        "When the columns of $A$ are independent but not orthogonal, the projection of $b$ onto $\\operatorname{Col}(A)$ is $\\hat{b} = A\\hat{x}$, where $\\hat{x}$ solves the normal equations $A^TA\\hat{x} = A^Tb$. Solve the small square system first, then multiply by $A$. The error $b - \\hat{b}$ is orthogonal to every column of $A$.",
        "当 $A$ 的列线性无关但不正交时，$b$ 在 $\\operatorname{Col}(A)$ 上的投影为 $\\hat{b} = A\\hat{x}$，其中 $\\hat{x}$ 满足法方程 $A^TA\\hat{x} = A^Tb$。先解这个小的方阵方程组，再乘以 $A$。误差 $b - \\hat{b}$ 与 $A$ 的每一列都正交。",
      ),
      generate: (rng: Rng): Problem => {
        const c1 = [1, rng.int(-2, 2), rng.int(-2, 2)];
        let c2 = [rng.int(-2, 2), 1, rng.int(-2, 2)];
        const cross = () => [c1[1]! * c2[2]! - c1[2]! * c2[1]!, c1[2]! * c2[0]! - c1[0]! * c2[2]!, c1[0]! * c2[1]! - c1[1]! * c2[0]!];
        let n = cross();
        if (n.every((x) => x === 0)) {
          c2 = [0, 1, 0];
          n = cross();
        }
        const g = n.reduce((s, x) => gcd(s, x), 0);
        n = n.map((x) => x / g);
        const xh = [rng.nonZero(-3, 3), rng.nonZero(-3, 3)];
        const k = rng.nonZero(-2, 2);
        const p = [0, 1, 2].map((i) => xh[0]! * c1[i]! + xh[1]! * c2[i]!);
        const b = p.map((x, i) => x + k * n[i]!);
        const AtA = [
          [c1.reduce((s, x) => s + x * x, 0), c1.reduce((s, x, i) => s + x * c2[i]!, 0)],
          [c1.reduce((s, x, i) => s + x * c2[i]!, 0), c2.reduce((s, x) => s + x * x, 0)],
        ];
        const Atb = [c1.reduce((s, x, i) => s + x * b[i]!, 0), c2.reduce((s, x, i) => s + x * b[i]!, 0)];
        const A = [0, 1, 2].map((i) => [c1[i]!, c2[i]!]);
        return pointProblem({
          prompt: t(
            `Find the projection of $b = ${colVecLatex(b)}$ onto the column space of $A = ${matLatex(A)}$.`,
            `求 $b = ${colVecLatex(b)}$ 在 $A = ${matLatex(A)}$ 的列空间上的投影。`,
          ),
          answer: p,
          vector: true,
          vars: ["x", "y", "z"],
          wrong: [b, [k * n[0]!, k * n[1]!, k * n[2]!], [xh[0]!, xh[1]!, 0]],
          solution: t(
            `$A^TA = ${matLatex(AtA)}$ and $A^Tb = ${colVecLatex(Atb)}$, so $\\hat{x} = ${colVecLatex(xh)}$ and $A\\hat{x} = ${colVecLatex(p)}$.`,
            `$A^TA = ${matLatex(AtA)}$，$A^Tb = ${colVecLatex(Atb)}$，所以 $\\hat{x} = ${colVecLatex(xh)}$，$A\\hat{x} = ${colVecLatex(p)}$。`,
          ),
        });
      },
    },
  ],
};

/** projectingVectorsOntoSubspacesInEuclideanSpacesArbitraryBasesApplications covers shortest distance and best approximation. */
export const projectingVectorsOntoSubspacesInEuclideanSpacesArbitraryBasesApplications: TopicDef = {
  id: "projecting-vectors-onto-subspaces-in-euclidean-spaces-arbitrary-bases-applications",
  title: t(
    "Projecting Vectors Onto Subspaces in Euclidean Spaces (Arbitrary Bases): Applications",
    "欧几里得空间中将向量投影到子空间（任意基）：应用",
  ),
  summary: t(
    "Apply orthogonal projections to find the shortest distance from a point to a subspace (best approximation theorem).",
    "应用正交投影求解点到子空间的最短距离（最佳逼近定理）。",
  ),
  prerequisites: ["projecting-vectors-onto-subspaces-in-euclidean-spaces-arbitrary-bases"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "shortest-distance-to-subspace",
      title: t("Shortest Distance from a Vector to a Subspace", "向量到子空间的最短距离"),
      explanation: t(
        "By the Best Approximation Theorem, the distance from a vector $y$ to a subspace $W$ is the distance to its orthogonal projection $\\hat{y} = \\operatorname{proj}_W(y)$, given by $|y - \\hat{y}|$.",
        "由最佳逼近定理，向量 $y$ 到子空间 $W$ 的最短距离等于它到其正交投影 $\\hat{y} = \\operatorname{proj}_W(y)$ 的距离，即 $|y - \\hat{y}|$。",
      ),
      generate: (rng: Rng): Problem => {
        const normals = [
          { n: [1, 2, 2], norm: 3 },
          { n: [2, 1, 2], norm: 3 },
          { n: [2, 2, 1], norm: 3 },
          { n: [0, 3, 4], norm: 5 },
          { n: [3, 0, 4], norm: 5 },
          { n: [4, 3, 0], norm: 5 },
          { n: [0, 4, 3], norm: 5 },
          { n: [2, 3, 6], norm: 7 },
          { n: [3, 6, 2], norm: 7 },
          { n: [6, 2, 3], norm: 7 },
        ];
        const item = rng.pick(normals);
        const { n, norm } = item;

        const multiple = rng.pick([1, 2, 3]);
        const sign = rng.pick([1, -1]);
        const dist = multiple * norm;
        const targetDot = sign * multiple * norm * norm;

        // A part inside the plane keeps y off the normal line.
        const inside = rng.pick([-1, 1, 2]);
        const y = [sign * multiple * n[0]! + inside * n[1]!, sign * multiple * n[1]! - inside * n[0]!, sign * multiple * n[2]!];

        const eqStr = `${formatLinEq(n, ["x_1", "x_2", "x_3"])} = 0`;
        const prompt = t(
          `Find the shortest distance from the point $y = ${colVecLatex(y)}$ to the subspace $W = \\{x \\in \\mathbb{R}^3 : ${eqStr}\\}$.`,
          `求点 $y = ${colVecLatex(y)}$ 到子空间 $W = \\{x \\in \\mathbb{R}^3 : ${eqStr}\\}$ 的最短距离。`,
        );

        const solution = t(
          `The distance from $y$ to the plane $W$ with normal vector $n = ${colVecLatex(n)}$ is given by the length of the projection onto the normal vector line:\n$$d = \\frac{|y \\cdot n|}{\\|n\\|} = \\frac{|${targetDot}|}{${norm}} = ${dist}$$`,
          `点 $y$ 到以 $n = ${colVecLatex(n)}$ 为法向量的平面 $W$ 的最短距离为在法向量上的投影长度：\n$$d = \\frac{|y \\cdot n|}{\\|n\\|} = \\frac{|${targetDot}|}{${norm}} = ${dist}$$`,
        );

        return numberProblem({
          prompt,
          answer: dist,
          solution,
          wrong: [Math.abs(targetDot), multiple, dist + 1, dist * dist],
        });
      },
    },
    {
      id: "least-squares-line-through-the-origin",
      title: t("The least-squares line through the origin", "过原点的最小二乘直线"),
      explanation: t(
        "Fitting $y = mx$ to data points $(x_i, y_i)$ asks for the least-squares solution of the overdetermined system $x_i m = y_i$. Its matrix has the single column $x = (x_1, \\dots, x_n)$, so the normal equation is $(x \\cdot x)\\,m = x \\cdot y$ and\n\n$$m = \\frac{\\sum x_i y_i}{\\sum x_i^2}.$$\n\nThis is the projection coefficient of the data vector $y$ onto the line spanned by $x$.",
        "用 $y = mx$ 拟合数据点 $(x_i, y_i)$，就是求超定方程组 $x_i m = y_i$ 的最小二乘解。它的矩阵只有一列 $x = (x_1, \\dots, x_n)$，所以法方程为 $(x \\cdot x)\\,m = x \\cdot y$，\n\n$$m = \\frac{\\sum x_i y_i}{\\sum x_i^2}$$\n\n这正是数据向量 $y$ 在 $x$ 张成的直线上的投影系数。",
      ),
      generate: (rng: Rng): Problem => {
        const xs = rng.shuffle([1, 2, 3, 4, -1, -2]).slice(0, 3);
        const ys: number[] = xs.map(() => rng.int(-6, 6));
        if (!ys.some((y) => y !== 0)) ys[0] = 1;
        const sxy = xs.reduce((s, x, i) => s + x * ys[i]!, 0);
        const sxx = xs.reduce((s, x) => s + x * x, 0);
        const m = Q.of(sxy, sxx);
        const pts = xs.map((x, i) => `$(${x}, ${ys[i]!})$`).join(", ");
        return numberProblem({
          prompt: t(
            `Find the slope $m$ of the least-squares line $y = mx$ through the origin for the points ${pts}.`,
            `对点 ${pts} 求过原点的最小二乘直线 $y = mx$ 的斜率 $m$。`,
          ),
          answer: m,
          wrong: [
            Q.of(sxx, sxy === 0 ? 1 : sxy),
            Q.of(
              ys.reduce((s, y) => s + y, 0),
              xs.reduce((s, x) => s + x, 0) || 1,
            ),
            Q.of(sxy, 3),
          ],
          solution: t(
            `$\\sum x_iy_i = ${sxy}$ and $\\sum x_i^2 = ${sxx}$, so $m = ${m.toLatex()}$.`,
            `$\\sum x_iy_i = ${sxy}$，$\\sum x_i^2 = ${sxx}$，所以 $m = ${m.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** projectionMatricesLinearTransformationsAndTheirProperties covers projection matrix properties. */
export const projectionMatricesLinearTransformationsAndTheirProperties: TopicDef = {
  id: "projection-matrices-linear-transformations-and-their-properties",
  title: t("Projection Matrices, Linear Transformations and Their Properties", "投影矩阵、线性变换及其性质"),
  summary: t(
    "Study the algebraic and geometric properties of projection matrices: $P^2 = P$, $P^T = P$, their eigenvalues, and their trace.",
    "研究投影矩阵的代数与几何性质：$P^2 = P$、$P^T = P$、特征值及迹。",
  ),
  prerequisites: ["projecting-vectors-onto-subspaces-in-euclidean-spaces-arbitrary-bases"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "properties-of-orthogonal-projector",
      title: t("Algebraic Invariants of Projection Matrices", "投影矩阵的代数不变量"),
      explanation: t(
        "An orthogonal projection matrix $P$ onto a subspace $W \\subseteq \\mathbb{R}^n$ satisfies $P^2 = P$ and $P^T = P$. Its trace equals the dimension of $W$: $\\operatorname{tr}(P) = \\dim(W)$, and its eigenvalues are restricted to $0$ and $1$.",
        "将向量正交投影到子空间 $W \\subseteq \\mathbb{R}^n$ 的投影矩阵 $P$ 满足 $P^2 = P$ 与 $P^T = P$。它的迹等于子空间 $W$ 的维数：$\\operatorname{tr}(P) = \\dim(W)$，且其特征值仅为 $0$ 与 $1$。",
      ),
      generate: (rng: Rng): Problem => {
        const n = rng.pick([4, 5, 6, 7, 8]);
        const k = rng.int(1, n - 1);
        const power = rng.pick([2023, 2024, 2025, 2026, 2027]);

        const prompt = t(
          `Let $P$ be the $n \\times n$ standard matrix of an orthogonal projection onto ${article(k)} $${k}$-dimensional subspace $W \\subseteq \\mathbb{R}^{${n}}$.\nWhat is the trace $\\operatorname{tr}(P^{${power}})$?`,
          `设 $P$ 为将 $\\mathbb{R}^{${n}}$ 中的向量正交投影到 $${k}$ 维子空间 $W$ 上的投影矩阵。\n求矩阵幂的迹 $\\operatorname{tr}(P^{${power}})$ 的值。`,
        );

        const solution = t(
          `Because $P$ is a projection matrix, it is idempotent: $P^2 = P$, which implies $P^{${power}} = P$. The trace of any orthogonal projection matrix equals the dimension of the subspace onto which it projects: $\\operatorname{tr}(P) = \\dim(W) = ${k}$.`,
          `因为 $P$ 是投影矩阵，它是幂等的：$P^2 = P$，因此 $P^{${power}} = P$。任何正交投影矩阵的迹均等于其所投影的子空间维数：$\\operatorname{tr}(P) = \\dim(W) = ${k}$。`,
        );

        return numberProblem({
          prompt,
          answer: k,
          solution,
          wrong: [n, n - k, 0, 1, k * 2],
        });
      },
    },
    {
      id: "an-entry-of-the-projection-matrix-onto-a-line",
      title: t("The projection matrix onto a line", "向直线投影的矩阵"),
      explanation: t(
        "The matrix that projects $\\mathbb{R}^n$ onto the line spanned by $a$ is\n\n$$P = \\frac{aa^T}{a^Ta},$$\n\nso its $(i, j)$ entry is $\\frac{a_ia_j}{\\|a\\|^2}$. It is symmetric, satisfies $P^2 = P$, and has trace $1$, the dimension of the line. Scaling $a$ does not change $P$.",
        "把 $\\mathbb{R}^n$ 投影到 $a$ 张成的直线上的矩阵为\n\n$$P = \\frac{aa^T}{a^Ta},$$\n\n所以它的 $(i, j)$ 元为 $\\frac{a_ia_j}{\\|a\\|^2}$。它是对称的，满足 $P^2 = P$，迹为 $1$，即直线的维数。把 $a$ 乘以常数不改变 $P$。",
      ),
      generate: (rng: Rng): Problem => {
        const a = [rng.nonZero(-3, 3), rng.int(-3, 3), rng.nonZero(-3, 3)];
        const i = rng.int(1, 3);
        const j = rng.int(1, 3);
        const aa = a.reduce((s, x) => s + x * x, 0);
        const ans = Q.of(a[i - 1]! * a[j - 1]!, aa);
        return numberProblem({
          prompt: t(
            `$P$ is the matrix of the orthogonal projection of $\\mathbb{R}^3$ onto the line spanned by $a = (${a.join(", ")})$. Find the entry $P_{${i}${j}}$.`,
            `$P$ 是把 $\\mathbb{R}^3$ 正交投影到 $a = (${a.join(", ")})$ 张成的直线上的矩阵。求元素 $P_{${i}${j}}$。`,
          ),
          answer: ans,
          wrong: [
            Q.of(a[i - 1]! * a[j - 1]!),
            Q.of(
              a[i - 1]! * a[j - 1]!,
              a.reduce((s, x) => s + Math.abs(x), 0),
            ),
            ans.neg(),
          ],
          solution: t(
            `$\\|a\\|^2 = ${aa}$, so $P_{${i}${j}} = \\frac{a_{${i}}a_{${j}}}{\\|a\\|^2} = \\frac{(${a[i - 1]!})(${a[j - 1]!})}{${aa}} = ${ans.toLatex()}$.`,
            `$\\|a\\|^2 = ${aa}$，所以 $P_{${i}${j}} = \\frac{a_{${i}}a_{${j}}}{\\|a\\|^2} = \\frac{(${a[i - 1]!})(${a[j - 1]!})}{${aa}} = ${ans.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** projectingVectorsOntoSubspacesInInnerProductSpaces covers projections in function and polynomial spaces. */
export const projectingVectorsOntoSubspacesInInnerProductSpaces: TopicDef = {
  id: "projecting-vectors-onto-subspaces-in-inner-product-spaces",
  title: t("Projecting Vectors Onto Subspaces in Inner Product Spaces", "内积空间中将向量投影到子空间"),
  summary: t(
    "Compute orthogonal projections in general inner product spaces and find best approximations of functions.",
    "在广义内积空间中计算正交投影，并求解函数的最佳逼近。",
  ),
  prerequisites: ["projecting-vectors-onto-subspaces-in-euclidean-spaces-orthogonal-bases", "orthogonal-sets-in-inner-product-spaces"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "polynomial-best-approximation-inner-product",
      title: t("Best Linear Approximation of a Polynomial", "多项式的最佳一次多项式逼近"),
      explanation: t(
        "In the inner product space $C[-1, 1]$ with $\\langle f, g \\rangle = \\int_{-1}^1 f(t)g(t)\\,dt$, the polynomials $\\{1, t\\}$ form an orthogonal basis for $P_1$. The orthogonal projection of $f(t) = a t^2 + b t + c$ onto $P_1$ is $\\hat{f}(t) = b t + \\left(\\frac{a}{3} + c\\right)$.",
        "在赋有内积 $\\langle f, g \\rangle = \\int_{-1}^1 f(t)g(t)\\,dt$ 的内积空间 $C[-1, 1]$ 中，多项式 $\\{1, t\\}$ 构成 $P_1$ 的一组正交基。二次多项式 $f(t) = a t^2 + b t + c$ 在 $P_1$ 上的正交投影为 $\\hat{f}(t) = b t + \\left(\\frac{a}{3} + c\\right)$。",
      ),
      generate: (rng: Rng): Problem => {
        const m = rng.pick([-3, -2, -1, 1, 2, 3]);
        const a = 3 * m; // so a/3 = m is an integer
        const b = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const c = rng.int(-4, 4);

        const constantTerm = m + c;
        const rightPoly = formatPoly(b, constantTerm);
        const polyOriginal = formatPoly2(a, b, c);

        const prompt = t(
          `In $C[-1, 1]$ with inner product $\\langle f, g \\rangle = \\int_{-1}^1 f(t)g(t)\\,dt$, find the orthogonal projection $\\hat{f} = \\operatorname{proj}_{P_1}(f)$ of $f(t) = ${polyOriginal}$ onto the subspace of linear polynomials $P_1 = \\operatorname{span}\\{1, t\\}$. Enter your answer as an expression in $t$.`,
          `在赋有内积 $\\langle f, g \\rangle = \\int_{-1}^1 f(t)g(t)\\,dt$ 的 $C[-1, 1]$ 空间中，求函数 $f(t) = ${polyOriginal}$ 在一次多项式子空间 $P_1 = \\operatorname{span}\\{1, t\\}$ 上的正交投影 $\\hat{f} = \\operatorname{proj}_{P_1}(f)$。请以关于 $t$ 的表达式形式作答。`,
        );

        const solution = t(
          `Because $\\{1, t\\}$ is an orthogonal basis on $[-1, 1]$:\n$$\\hat{f}(t) = \\frac{\\langle f, 1 \\rangle}{\\langle 1, 1 \\rangle} (1) + \\frac{\\langle f, t \\rangle}{\\langle t, t \\rangle} t$$\nComputing the integrals: $\\langle 1, 1 \\rangle = 2$, $\\langle t, t \\rangle = \\frac{2}{3}$, $\\langle f, 1 \\rangle = \\frac{2(${a})}{3} + 2(${c}) = 2(${m + c})$, and $\\langle f, t \\rangle = \\frac{2(${b})}{3}$.\nTherefore $\\hat{f}(t) = ${rightPoly}$.`,
          `因 $\\{1, t\\}$ 是 $[-1, 1]$ 上的正交基：\n$$\\hat{f}(t) = \\frac{\\langle f, 1 \\rangle}{\\langle 1, 1 \\rangle} (1) + \\frac{\\langle f, t \\rangle}{\\langle t, t \\rangle} t$$\n计算各积分：$\\langle 1, 1 \\rangle = 2$、$\\langle t, t \\rangle = \\frac{2}{3}$、$\\langle f, 1 \\rangle = \\frac{2(${a})}{3} + 2(${c}) = 2(${m + c})$ 以及 $\\langle f, t \\rangle = \\frac{2(${b})}{3}$。\n因此 $\\hat{f}(t) = ${rightPoly}$。`,
        );

        return expressionProblem({
          prompt,
          answer: rightPoly,
          prefix: "\\hat{f}(t) =",
          solution,
          wrong: [formatPoly(b, c), formatPoly(b, 3 * m + c), formatPoly(-b, constantTerm), formatPoly(m, c)],
        });
      },
    },
    {
      id: "the-best-constant-approximation",
      title: t("The best constant approximation", "最佳常数逼近"),
      explanation: t(
        "In $C[0, 1]$ with $\\langle f, g \\rangle = \\int_0^1 f(x)g(x)\\,dx$, the constants form a one-dimensional subspace spanned by $1$, with $\\langle 1, 1 \\rangle = 1$. The closest constant to $f$ is its projection\n\n$$\\hat{f} = \\frac{\\langle f, 1 \\rangle}{\\langle 1, 1 \\rangle} = \\int_0^1 f(x)\\,dx,$$\n\nthe average value of $f$ on the interval. For a polynomial $a + bx + cx^2$ this is $a + \\frac{b}{2} + \\frac{c}{3}$.",
        "在 $\\langle f, g \\rangle = \\int_0^1 f(x)g(x)\\,dx$ 的 $C[0, 1]$ 中，常数构成由 $1$ 张成的一维子空间，且 $\\langle 1, 1 \\rangle = 1$。离 $f$ 最近的常数是它的投影\n\n$$\\hat{f} = \\frac{\\langle f, 1 \\rangle}{\\langle 1, 1 \\rangle} = \\int_0^1 f(x)\\,dx,$$\n\n即 $f$ 在该区间上的平均值。对多项式 $a + bx + cx^2$，它为 $a + \\frac{b}{2} + \\frac{c}{3}$。",
      ),
      generate: (rng: Rng): Problem => {
        const a = rng.int(-4, 4);
        const b = rng.nonZero(-5, 5);
        const c = rng.nonZero(-5, 5);
        const ans = Q.of(6 * a + 3 * b + 2 * c, 6);
        const f = formatPoly2(c, b, a).replace(/t/g, "x");
        return numberProblem({
          prompt: t(
            `With $\\langle f, g \\rangle = \\int_0^1 f(x) g(x)\\,dx$, find the constant $k$ closest to $f(x) = ${f}$.`,
            `在 $\\langle f, g \\rangle = \\int_0^1 f(x) g(x)\\,dx$ 下，求离 $f(x) = ${f}$ 最近的常数 $k$。`,
          ),
          answer: ans,
          wrong: [Q.of(a), Q.of(a + b + c), Q.of(2 * a + b + c, 2)],
          solution: t(
            `$k = \\int_0^1 (${f})\\,dx = ${signedSum([`${a}`, frac(b, 2), frac(c, 3)])} = ${ans.toLatex()}$.`,
            `$k = \\int_0^1 (${f})\\,dx = ${signedSum([`${a}`, frac(b, 2), frac(c, 3)])} = ${ans.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE 6.24: ORTHOGONALIZATION PROCESSES
// ════════════════════════════════════════════════════════════════════════════

/** gramSchmidtProcessForTwoVectors covers the Gram-Schmidt process for two vectors. */
export const gramSchmidtProcessForTwoVectors: TopicDef = {
  id: "gram-schmidt-process-for-two-vectors",
  title: t("The Gram-Schmidt Process for Two Vectors", "两个向量的施密特正交化过程"),
  summary: t(
    "Apply the Gram-Schmidt process to orthogonalize two linearly independent vectors.",
    "应用施密特正交化过程将两个线性无关的向量正交化。",
  ),
  prerequisites: ["projecting-vectors-onto-one-dimensional-subspaces"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "gram-schmidt-step-two-vectors",
      title: t("Orthogonalizing Two Vectors", "正交化两个向量"),
      explanation: t(
        "Given linearly independent vectors $x_1, x_2$, the Gram-Schmidt process defines $v_1 = x_1$ and $v_2 = x_2 - \\frac{x_2 \\cdot v_1}{v_1 \\cdot v_1} v_1$. Then $\\{v_1, v_2\\}$ is an orthogonal basis for $\\operatorname{span}\\{x_1, x_2\\}$.",
        "给定线性无关的向量 $x_1, x_2$，施密特正交化过程取 $v_1 = x_1$ 及 $v_2 = x_2 - \\frac{x_2 \\cdot v_1}{v_1 \\cdot v_1} v_1$。则 $\\{v_1, v_2\\}$ 是 $\\operatorname{span}\\{x_1, x_2\\}$ 的一组正交基。",
      ),
      generate: (rng: Rng): Problem => {
        const x1 = [rng.pick([-2, -1, 1, 2]), rng.pick([-2, -1, 1, 2]), 0];
        const v1NormSq = x1[0]! * x1[0]! + x1[1]! * x1[1]!;

        const k = rng.pick([-3, -2, -1, 1, 2, 3]);
        const z = [-x1[1]!, x1[0]!, rng.pick([-3, -2, -1, 1, 2, 3])];

        const x2 = [k * x1[0]! + z[0]!, k * x1[1]! + z[1]!, k * x1[2]! + z[2]!];
        const v2 = z;

        const prompt = t(
          `Apply the Gram-Schmidt process to the basis $\\{x_1, x_2\\}$ of a subspace in $\\mathbb{R}^3$, setting $v_1 = x_1$:\n$$x_1 = ${colVecLatex(x1)}, \\quad x_2 = ${colVecLatex(x2)}$$\nFind the second orthogonal vector $v_2 = x_2 - \\frac{x_2 \\cdot v_1}{v_1 \\cdot v_1} v_1$. Enter your answer as a vector $\\langle v_{21}, v_{22}, v_{23} \\rangle$.`,
          `对 $\\mathbb{R}^3$ 中子空间的基 $\\{x_1, x_2\\}$ 应用施密特正交化过程，令 $v_1 = x_1$：\n$$x_1 = ${colVecLatex(x1)}, \\quad x_2 = ${colVecLatex(x2)}$$\n求第二个正交向量 $v_2 = x_2 - \\frac{x_2 \\cdot v_1}{v_1 \\cdot v_1} v_1$。请以向量 $\\langle v_{21}, v_{22}, v_{23} \\rangle$ 的形式作答。`,
        );

        const x2DotV1 = k * v1NormSq;
        const solution = t(
          `Calculate the projection coefficient:\n$$\\frac{x_2 \\cdot v_1}{v_1 \\cdot v_1} = \\frac{${x2DotV1}}{${v1NormSq}} = ${k}$$\nSubtract the projection from $x_2$:\n$$v_2 = ${colVecLatex(x2)} - (${k})${colVecLatex(x1)} = ${colVecLatex(v2)}$$`,
          `计算投影系数：\n$$\\frac{x_2 \\cdot v_1}{v_1 \\cdot v_1} = \\frac{${x2DotV1}}{${v1NormSq}} = ${k}$$\n从 $x_2$ 中减去投影分量：\n$$v_2 = ${colVecLatex(x2)} - (${k})${colVecLatex(x1)} = ${colVecLatex(v2)}$$`,
        );

        return pointProblem({
          prompt,
          answer: v2,
          vector: true,
          solution,
          wrong: [
            [x2[0]! + k * x1[0]!, x2[1]! + k * x1[1]!, x2[2]! + k * x1[2]!],
            x2,
            [-v2[0]!, -v2[1]!, -v2[2]!],
            [v2[0]! + 1, v2[1]! - 1, v2[2]!],
          ],
        });
      },
    },
    {
      id: "gram-schmidt-under-a-weighted-inner-product",
      title: t("Gram–Schmidt under a weighted inner product", "加权内积下的格拉姆–施密特"),
      explanation: t(
        "The Gram–Schmidt step $w_2 = v_2 - \\frac{\\langle v_2, v_1 \\rangle}{\\langle v_1, v_1 \\rangle}v_1$ works for any inner product, but every bracket must be computed with that inner product. Under $\\langle x, y \\rangle = a x_1 y_1 + x_2 y_2$ the result is orthogonal to $v_1$ in the weighted sense, and usually not for the ordinary dot product.",
        "格拉姆–施密特步骤 $w_2 = v_2 - \\frac{\\langle v_2, v_1 \\rangle}{\\langle v_1, v_1 \\rangle}v_1$ 对任何内积都适用，但每个括号都要用该内积计算。在 $\\langle x, y \\rangle = a x_1 y_1 + x_2 y_2$ 下，结果在加权意义下与 $v_1$ 正交，通常对普通点积并不正交。",
      ),
      generate: (rng: Rng): Problem => {
        const a = rng.int(2, 5);
        const s = rng.nonZero(-3, 3);
        let p = rng.int(-4, 4);
        if (p === s) p += 1;
        const q = s * (a + 1) - a * p;
        const w2 = [p - s, q - s];
        const ip = a * p + q;
        return pointProblem({
          prompt: t(
            `On $\\mathbb{R}^2$ use $\\langle x, y \\rangle = ${a} x_1 y_1 + x_2 y_2$. Apply Gram–Schmidt to $v_1 = (1, 1)$, $v_2 = (${p}, ${q})$ and find $w_2$.`,
            `在 $\\mathbb{R}^2$ 上使用 $\\langle x, y \\rangle = ${a} x_1 y_1 + x_2 y_2$。对 $v_1 = (1, 1)$，$v_2 = (${p}, ${q})$ 作格拉姆–施密特正交化，求 $w_2$。`,
          ),
          answer: w2,
          vector: true,
          wrong: [
            [Q.of(2 * p - (p + q), 2), Q.of(2 * q - (p + q), 2)],
            [p + s, q + s],
            [p, q],
          ],
          solution: t(
            `$\\langle v_2, v_1 \\rangle = ${ip}$ and $\\langle v_1, v_1 \\rangle = ${a + 1}$, so the coefficient is $${s}$ and $w_2 = (${p}, ${q}) - ${s < 0 ? `(${s})` : s}(1, 1) = (${w2.join(", ")})$.`,
            `$\\langle v_2, v_1 \\rangle = ${ip}$，$\\langle v_1, v_1 \\rangle = ${a + 1}$，所以系数为 $${s}$，$w_2 = (${p}, ${q}) - ${s < 0 ? `(${s})` : s}(1, 1) = (${w2.join(", ")})$。`,
          ),
        });
      },
    },
  ],
};

/** gramSchmidtProcessInTheGeneralCase covers Gram-Schmidt for 3 or more vectors. */
export const gramSchmidtProcessInTheGeneralCase: TopicDef = {
  id: "gram-schmidt-process-in-the-general-case",
  title: t("The Gram-Schmidt Process in the General Case", "一般情况下的施密特正交化过程"),
  summary: t(
    "Apply the general Gram-Schmidt algorithm to construct an orthogonal basis from three or more vectors.",
    "应用一般施密特正交化算法从三个或更多向量构造正交基。",
  ),
  prerequisites: ["gram-schmidt-process-for-two-vectors", "projecting-vectors-onto-subspaces-in-euclidean-spaces-orthogonal-bases"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "gram-schmidt-three-vectors-formula",
      title: t("Third Vector in Gram-Schmidt Process", "施密特过程中的第三个正交向量"),
      explanation: t(
        "For three linearly independent vectors $\\{x_1, x_2, x_3\\}$, after finding orthogonal vectors $v_1 = x_1$ and $v_2 = x_2 - \\operatorname{proj}_{v_1}(x_2)$, the third orthogonal vector is $v_3 = x_3 - \\frac{x_3 \\cdot v_1}{v_1 \\cdot v_1} v_1 - \\frac{x_3 \\cdot v_2}{v_2 \\cdot v_2} v_2$.",
        "对于三个线性无关的向量 $\\{x_1, x_2, x_3\\}$，在求得正交向量 $v_1 = x_1$ 与 $v_2 = x_2 - \\operatorname{proj}_{v_1}(x_2)$ 后，第三个正交向量由下式给出：$v_3 = x_3 - \\frac{x_3 \\cdot v_1}{v_1 \\cdot v_1} v_1 - \\frac{x_3 \\cdot v_2}{v_2 \\cdot v_2} v_2$。",
      ),
      generate: (rng: Rng): Problem => {
        const v1 = [1, 0, 0];
        const v2 = [0, 1, 0];

        const c1 = rng.int(-3, 3);
        const c2 = rng.int(-3, 3);
        const c3 = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);

        const x3 = [c1, c2, c3];
        const v3 = [0, 0, c3];

        const prompt = t(
          `In the Gram-Schmidt process for $\\mathbb{R}^3$, suppose the first two orthogonal vectors obtained are:\n$$v_1 = ${colVecLatex(v1)}, \\quad v_2 = ${colVecLatex(v2)}$$\nGiven $x_3 = ${colVecLatex(x3)}$, compute the third orthogonal vector:\n$$v_3 = x_3 - \\frac{x_3 \\cdot v_1}{v_1 \\cdot v_1} v_1 - \\frac{x_3 \\cdot v_2}{v_2 \\cdot v_2} v_2$$\nEnter your answer as a vector $\\langle v_{31}, v_{32}, v_{33} \\rangle$.`,
          `在 $\\mathbb{R}^3$ 的施密特正交化过程中，设已求得前两个正交向量为：\n$$v_1 = ${colVecLatex(v1)}, \\quad v_2 = ${colVecLatex(v2)}$$\n已知 $x_3 = ${colVecLatex(x3)}$，计算第三个正交向量：\n$$v_3 = x_3 - \\frac{x_3 \\cdot v_1}{v_1 \\cdot v_1} v_1 - \\frac{x_3 \\cdot v_2}{v_2 \\cdot v_2} v_2$$\n请以向量 $\\langle v_{31}, v_{32}, v_{33} \\rangle$ 的形式作答。`,
        );

        const solution = t(
          `Calculate the projection coefficients:\n$$\\frac{x_3 \\cdot v_1}{v_1 \\cdot v_1} = ${c1}, \\quad \\frac{x_3 \\cdot v_2}{v_2 \\cdot v_2} = ${c2}$$\nSubtract both projections from $x_3$:\n$$v_3 = ${colVecLatex(x3)} - (${c1})${colVecLatex(v1)} - (${c2})${colVecLatex(v2)} = ${colVecLatex(v3)}$$`,
          `计算各投影分量系数：\n$$\\frac{x_3 \\cdot v_1}{v_1 \\cdot v_1} = ${c1}, \\quad \\frac{x_3 \\cdot v_2}{v_2 \\cdot v_2} = ${c2}$$\n从 $x_3$ 中减去两个投影分量：\n$$v_3 = ${colVecLatex(x3)} - (${c1})${colVecLatex(v1)} - (${c2})${colVecLatex(v2)} = ${colVecLatex(v3)}$$`,
        );

        return pointProblem({
          prompt,
          answer: v3,
          vector: true,
          solution,
          wrong: [[c1, 0, c3], [0, c2, c3], x3, [0, 0, -c3]],
        });
      },
    },
    {
      id: "the-third-gram-schmidt-vector",
      title: t("The third Gram–Schmidt vector", "第三个格拉姆–施密特向量"),
      explanation: t(
        "In the general case each new vector has its projections onto all earlier ones removed:\n\n$$w_3 = v_3 - \\frac{v_3 \\cdot w_1}{w_1 \\cdot w_1}w_1 - \\frac{v_3 \\cdot w_2}{w_2 \\cdot w_2}w_2.$$\n\nWhen $v_1$ and $v_2$ are already orthogonal, $w_1 = v_1$ and $w_2 = v_2$, and only this last step is needed. Subtracting both projections is essential; removing only one leaves a vector that is not orthogonal to the other.",
        "一般情形下，每个新向量都要去掉它在之前所有向量上的投影：\n\n$$w_3 = v_3 - \\frac{v_3 \\cdot w_1}{w_1 \\cdot w_1}w_1 - \\frac{v_3 \\cdot w_2}{w_2 \\cdot w_2}w_2$$\n\n当 $v_1$ 与 $v_2$ 已经正交时，$w_1 = v_1$，$w_2 = v_2$，只需这最后一步。两个投影都要减去；只去掉一个会留下与另一个不正交的向量。",
      ),
      generate: (rng: Rng): Problem => {
        const frames = [
          [
            [1, 1, 1],
            [1, -1, 0],
            [1, 1, -2],
          ],
          [
            [1, 0, 1],
            [1, 0, -1],
            [0, 1, 0],
          ],
          [
            [1, 2, 2],
            [2, 1, -2],
            [2, -2, 1],
          ],
          [
            [1, -1, 1],
            [1, 1, 0],
            [-1, 1, 2],
          ],
        ];
        const [w1, w2, n] = rng.pick(frames) as [number[], number[], number[]];
        const a = rng.nonZero(-2, 2);
        const b = rng.nonZero(-2, 2);
        const k = rng.nonZero(-2, 2);
        const v3 = [0, 1, 2].map((i) => a * w1[i]! + b * w2[i]! + k * n[i]!);
        const w3 = n.map((x) => k * x);
        const n1 = w1.reduce((s, x) => s + x * x, 0);
        const n2 = w2.reduce((s, x) => s + x * x, 0);
        return pointProblem({
          prompt: t(
            `$v_1 = (${w1.join(", ")})$ and $v_2 = (${w2.join(", ")})$ are orthogonal. Gram–Schmidt continues with $v_3 = (${v3.join(", ")})$. Find $w_3$.`,
            `$v_1 = (${w1.join(", ")})$ 与 $v_2 = (${w2.join(", ")})$ 正交。格拉姆–施密特继续处理 $v_3 = (${v3.join(", ")})$。求 $w_3$。`,
          ),
          answer: w3,
          vector: true,
          vars: ["x", "y", "z"],
          wrong: [[0, 1, 2].map((i) => v3[i]! - a * w1[i]!), [0, 1, 2].map((i) => v3[i]! - b * w2[i]!), w3.map((x) => -x)],
          solution: t(
            `$\\frac{v_3 \\cdot w_1}{w_1 \\cdot w_1} = \\frac{${a * n1}}{${n1}} = ${a}$ and $\\frac{v_3 \\cdot w_2}{w_2 \\cdot w_2} = \\frac{${b * n2}}{${n2}} = ${b}$, so $w_3 = v_3 - ${a === 1 ? "" : a < 0 ? `(${a})` : a}w_1 - ${b === 1 ? "" : b < 0 ? `(${b})` : b}w_2 = (${w3.join(", ")})$.`,
            `$\\frac{v_3 \\cdot w_1}{w_1 \\cdot w_1} = \\frac{${a * n1}}{${n1}} = ${a}$，$\\frac{v_3 \\cdot w_2}{w_2 \\cdot w_2} = \\frac{${b * n2}}{${n2}} = ${b}$，所以 $w_3 = v_3 - ${a === 1 ? "" : a < 0 ? `(${a})` : a}w_1 - ${b === 1 ? "" : b < 0 ? `(${b})` : b}w_2 = (${w3.join(", ")})$。`,
          ),
        });
      },
    },
  ],
};

/** qrFactorization covers the QR decomposition of a matrix with independent columns. */
export const qrFactorization: TopicDef = {
  id: "qr-factorization",
  title: t("QR Factorization", "QR 分解"),
  summary: t(
    "Compute the QR factorization A = QR where Q has orthonormal columns and R is upper triangular.",
    "计算 QR 分解 A = QR，其中 Q 具有标准正交列，R 为上三角矩阵。",
  ),
  prerequisites: ["gram-schmidt-process-in-the-general-case", "orthogonal-matrices"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "qr-decomposition-r-matrix",
      title: t("Upper Triangular Factor R in QR Decomposition", "QR 分解中的上三角矩阵 R"),
      explanation: t(
        "The entries of the upper triangular factor are the dot products of the orthonormal vectors with the original columns, recording how each column was built. If $A = [a_1 \\ a_2]$ has linearly independent columns, its $QR$ factorization $A = QR$ produces an upper triangular matrix $R = \\begin{pmatrix} r_{11} & r_{12} \\\\ 0 & r_{22} \\end{pmatrix}$, where $r_{11} = |a_1|$, $r_{12} = q_1 \\cdot a_2$, and $r_{22} = |a_2 - r_{12} q_1| > 0$.",
        "上三角因子的元素是标准正交向量与原来各列的点积，记录了每一列是怎样构成的。若 $A = [a_1 \\ a_2]$ 的各列线性无关，其 $QR$ 分解 $A = QR$ 产生的上三角矩阵为 $R = \\begin{pmatrix} r_{11} & r_{12} \\\\ 0 & r_{22} \\end{pmatrix}$，其中 $r_{11} = |a_1|$，$r_{12} = q_1 \\cdot a_2$ 且 $r_{22} = |a_2 - r_{12} q_1| > 0$。",
      ),
      generate: (rng: Rng): Problem => {
        const a1Candidates = [
          [3, 4],
          [4, 3],
          [-3, 4],
          [-4, 3],
          [3, -4],
          [4, -3],
          [-3, -4],
          [-4, -3],
        ];
        const a1 = rng.pick(a1Candidates);
        const a = a1[0]!;
        const b = a1[1]!;

        const r11 = 5;
        const r12 = rng.nonZero(-5, 5);
        const j = rng.int(0, 2);

        const invMap: Record<number, number> = { 1: 1, 2: 3, 3: 2, 4: 4 };
        const bMod = ((b % 5) + 5) % 5;
        const inv = invMap[bMod] ?? 1;
        let k0 = (((a * inv * r12) % 5) + 5) % 5;
        if (k0 === 0) k0 = 5;
        const r22 = k0 + 5 * j;

        const a2x = (a * r12 - b * r22) / 5;
        const a2y = (b * r12 + a * r22) / 5;

        const A = [
          [a, a2x],
          [b, a2y],
        ];

        const R = [
          [r11, r12],
          [0, r22],
        ];

        const prompt = t(
          `Given the matrix $A = ${matLatex(A)}$, find the upper triangular matrix $R$ in its $QR$ factorization $A = QR$, where the diagonal entries of $R$ are positive.`,
          `已知矩阵 $A = ${matLatex(A)}$，求其 $QR$ 分解 $A = QR$ 中的上三角矩阵 $R$（其中 $R$ 的对角线元素为正实数）。`,
        );

        const right = t(`$R = ${matLatex(R)}$`, `$R = ${matLatex(R)}$`);
        const wrong = [
          t(
            `$R = ${matLatex([
              [r11, r22],
              [0, r12],
            ])}$`,
            `$R = ${matLatex([
              [r11, r22],
              [0, r12],
            ])}$`,
          ),
          t(
            `$R = ${matLatex([
              [r11, 0],
              [r12, r22],
            ])}$`,
            `$R = ${matLatex([
              [r11, 0],
              [r12, r22],
            ])}$`,
          ),
          t(
            `$R = ${matLatex([
              [r11, r12],
              [0, -r22],
            ])}$`,
            `$R = ${matLatex([
              [r11, r12],
              [0, -r22],
            ])}$`,
          ),
          t(
            `$R = ${matLatex([
              [r11, 0],
              [0, r22],
            ])}$`,
            `$R = ${matLatex([
              [r11, 0],
              [0, r22],
            ])}$`,
          ),
        ];

        const solution = t(
          `First, compute $r_{11} = \\|a_1\\| = \\sqrt{(${a})^2 + (${b})^2} = 5$, giving $q_1 = \\begin{pmatrix} ${frac(a, 5)} \\\\ ${frac(b, 5)} \\end{pmatrix}$.\nNext, $r_{12} = q_1 \\cdot a_2 = \\frac{(${a})(${a2x}) + (${b})(${a2y})}{5} = ${r12}$.\nFinally, $a_2 - r_{12} q_1 = \\begin{pmatrix} ${frac(-b * r22, 5)} \\\\ ${frac(a * r22, 5)} \\end{pmatrix}$, with norm $r_{22} = ${r22}$.\nThus $R = ${matLatex(R)}$.`,
          `首先计算 $r_{11} = \\|a_1\\| = \\sqrt{(${a})^2 + (${b})^2} = 5$，得到 $q_1 = \\begin{pmatrix} ${frac(a, 5)} \\\\ ${frac(b, 5)} \\end{pmatrix}$。\n接着计算 $r_{12} = q_1 \\cdot a_2 = \\frac{(${a})(${a2x}) + (${b})(${a2y})}{5} = ${r12}$。\n最后，计算正交分量 $a_2 - r_{12} q_1 = \\begin{pmatrix} ${frac(-b * r22, 5)} \\\\ ${frac(a * r22, 5)} \\end{pmatrix}$，其范数为 $r_{22} = ${r22}$。\n因此 $R = ${matLatex(R)}$。`,
        );

        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "r-from-q-transpose-a",
      title: t("Recovering $R$ as $Q^TA$", "由 $Q^TA$ 求 $R$"),
      explanation: t(
        "If $A = QR$ and $Q$ has orthonormal columns, then $Q^TQ = I$, so multiplying on the left by $Q^T$ gives $R = Q^TA$. Each entry is a dot product: $r_{ij} = q_i \\cdot a_j$, the $i$th column of $Q$ dotted with the $j$th column of $A$. The entries below the diagonal come out as zero automatically.",
        "若 $A = QR$ 且 $Q$ 的列标准正交，则 $Q^TQ = I$，在左边乘以 $Q^T$ 得 $R = Q^TA$。每个元素都是点积：$r_{ij} = q_i \\cdot a_j$，即 $Q$ 的第 $i$ 列与 $A$ 的第 $j$ 列的点积。对角线以下的元素自动为零。",
      ),
      generate: (rng: Rng): Problem => {
        const q1 = [1, 2, 2];
        const q2 = rng.pick([
          [2, 1, -2],
          [-2, 2, -1],
          [2, -2, 1],
        ]);
        const r11 = rng.int(1, 3);
        const r12 = rng.nonZero(-3, 3);
        const r22 = rng.int(1, 3);
        // With Q = (1/3)[q1 q2] and R = 3[[r11, r12], [0, r22]], A has integer entries.
        const a1 = q1.map((x) => x * r11);
        const a2 = [0, 1, 2].map((i) => q1[i]! * r12 + q2[i]! * r22);
        const A = [0, 1, 2].map((i) => [a1[i]!, a2[i]!]);
        const Qm = [0, 1, 2].map((i) => [frac(q1[i]!, 3), frac(q2[i]!, 3)]);
        const which = rng.int(0, 2);
        const label = ["r_{11}", "r_{12}", "r_{22}"][which]!;
        const ans = [3 * r11, 3 * r12, 3 * r22][which]!;
        const cols = [
          [q1, a1],
          [q1, a2],
          [q2, a2],
        ][which]!;
        return numberProblem({
          prompt: t(
            `$A = ${matLatex(A)} = QR$ with $Q = ${matLatex(Qm)}$. Find $${label}$.`,
            `$A = ${matLatex(A)} = QR$，其中 $Q = ${matLatex(Qm)}$。求 $${label}$。`,
          ),
          answer: ans,
          wrong: [ans / 3, -ans, 3 * r11 + 3 * r22 - ans || 1, ans * 3],
          solution: t(
            `$${label} = q_{${which === 2 ? 2 : 1}} \\cdot a_{${which === 0 ? 1 : 2}} = \\frac{1}{3}(${cols[0]!.map((x, i) => `(${x})(${cols[1]![i]!})`).join(" + ")}) = ${ans}$.`,
            `$${label} = q_{${which === 2 ? 2 : 1}} \\cdot a_{${which === 0 ? 1 : 2}} = \\frac{1}{3}(${cols[0]!.map((x, i) => `(${x})(${cols[1]![i]!})`).join(" + ")}) = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// ALL TOPICS EXPORT
// ════════════════════════════════════════════════════════════════════════════

/** linearAlgebraProjectionsTopics contains all 25 topics for Linear Algebra Unit 6: Projections. */
export const linearAlgebraProjectionsTopics: readonly TopicDef[] = [
  dotProductInNDimensionalEuclideanSpace,
  normOfAVectorInNDimensionalEuclideanSpace,
  innerProductSpaces,
  innerProductInVectorSpacesOverTheComplexNumbers,
  normOfAVectorInInnerProductSpaces,
  orthogonalVectorsInEuclideanSpaces,
  orthogonalVectorsInInnerProductSpaces,
  cauchySchwarzInequalityAndAngleBetweenTwoVectors,
  pythagoreanTheoremAndTriangleInequalityInInnerProductSpaces,
  orthogonalComplements,
  orthogonalSetsInEuclideanSpaces,
  orthogonalSetsInInnerProductSpaces,
  orthogonalMatrices,
  orthogonalLinearTransformations,
  fourFundamentalSubspacesOfAMatrix,
  projectingVectorsOntoOneDimensionalSubspaces,
  componentsOfAVectorWithRespectToAnOrthogonalOrOrthonormalBasis,
  projectingVectorsOntoSubspacesInEuclideanSpacesOrthogonalBases,
  projectingVectorsOntoSubspacesInEuclideanSpacesArbitraryBases,
  projectingVectorsOntoSubspacesInEuclideanSpacesArbitraryBasesApplications,
  projectionMatricesLinearTransformationsAndTheirProperties,
  projectingVectorsOntoSubspacesInInnerProductSpaces,
  gramSchmidtProcessForTwoVectors,
  gramSchmidtProcessInTheGeneralCase,
  qrFactorization,
];
