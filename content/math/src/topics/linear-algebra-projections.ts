import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q, sketch } from "@ga/subject-math";

import { article, choiceProblem, expressionProblem, numberProblem, pointProblem } from "../problems.ts";

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
  prerequisites: ["vectors-in-n-dimensional-euclidean-space"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "compute-dot-product-rn",
      title: t("Computing the Dot Product in $\\mathbb{R}^n$", "计算 $\\mathbb{R}^n$ 中的点积"),
      explanation: t(
        "The dot product multiplies matching entries and adds the products, giving a number that measures how much two vectors point in the same direction. The dot product of two vectors $u = (u_1, \\dots, u_n)$ and $v = (v_1, \\dots, v_n)$ in $\\mathbb{R}^n$ is $u \\cdot v = \\sum_{i=1}^n u_i v_i = u_1 v_1 + u_2 v_2 + \\dots + u_n v_n$.",
        "点积把对应分量相乘再把积相加，得到的数衡量两个向量指向相同方向的程度。$\\mathbb{R}^n$ 中两个向量 $u = (u_1, \\dots, u_n)$ 与 $v = (v_1, \\dots, v_n)$ 的点积定义为 $u \\cdot v = \\sum_{i=1}^n u_i v_i = u_1 v_1 + u_2 v_2 + \\dots + u_n v_n$。",
      ),
      generate: (rng: Rng): Problem => {
        const dim = rng.pick([4, 5]);
        const u = [rng.nonZero(-5, 5), ...Array.from({ length: dim - 1 }, () => rng.int(-5, 5))];
        const v = [rng.int(-5, 5), rng.nonZero(-5, 5), ...Array.from({ length: dim - 2 }, () => rng.int(-5, 5))];

        let dot = 0;
        for (let i = 0; i < dim; i++) {
          dot += u[i]! * v[i]!;
        }

        const prompt = t(
          `Compute the dot product $u \\cdot v$ of the vectors in $\\mathbb{R}^${dim}$:\n$$u = ${colVecLatex(u)}, \\quad v = ${colVecLatex(v)}$$`,
          `计算 $\\mathbb{R}^${dim}$ 中两向量的点积 $u \\cdot v$：\n$$u = ${colVecLatex(u)}, \\quad v = ${colVecLatex(v)}$$`,
        );

        const terms = u.map((val, idx) => `(${val})(${v[idx]!})`).join(" + ");
        const solution = t(
          `The dot product is the sum of componentwise products:\n$$u \\cdot v = ${terms} = ${dot}$$`,
          `点积等于各对应分量乘积之和：\n$$u \\cdot v = ${terms} = ${dot}$$`,
        );

        return numberProblem({
          prompt,
          answer: dot,
          solution,
          wrong: [dot + 2, dot - 3, -dot, dot + u[0]! * v[0]! + 1, dot - u[dim - 1]! * v[dim - 1]! - 2, dot + 5],
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
  prerequisites: ["dot-product-in-n-dimensional-euclidean-space"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "euclidean-norm-rn",
      title: t("Euclidean Norm in $\\mathbb{R}^n$", "$\\mathbb{R}^n$ 中的欧几里得范数"),
      explanation: t(
        "The norm extends the Pythagorean theorem to any number of dimensions: square every entry, add the squares, and take the square root. The Euclidean norm (or magnitude) of a vector $v = (v_1, \\dots, v_n) \\in \\mathbb{R}^n$ is $|v| = \\sqrt{v \\cdot v} = \\sqrt{v_1^2 + \\dots + v_n^2}$.",
        "范数把勾股定理推广到任意维数：把每个分量平方，把平方相加，再开平方。向量 $v = (v_1, \\dots, v_n) \\in \\mathbb{R}^n$ 的欧几里得范数（长度）定义为 $|v| = \\sqrt{v \\cdot v} = \\sqrt{v_1^2 + \\dots + v_n^2}$。",
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
        const solution = t(
          `Compute the square root of the sum of squared components:\n$$\\|v\\| = \\sqrt{${sqTerms}} = \\sqrt{${sumSq}} = ${norm}$$`,
          `计算分量平方和的算术平方根：\n$$\\|v\\| = \\sqrt{${sqTerms}} = \\sqrt{${sumSq}} = ${norm}$$`,
        );

        return numberProblem({
          prompt,
          answer: norm,
          solution,
          wrong: [sumSq, norm + 1, Math.max(1, norm - 1), norm + 2, norm * 2],
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
  prerequisites: ["dot-product-in-n-dimensional-euclidean-space"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "inner-product-polynomial-integral",
      title: t("Polynomial Inner Product Under Definite Integral", "定积分形式的多项式内积"),
      explanation: t(
        "On the polynomial space $P_1$, the mapping $\\langle p, q \\rangle = \\int_0^1 p(t)q(t)\\,dt$ defines an inner product satisfying symmetry, additivity, homogeneity, and positive definiteness.",
        "在多项式空间 $P_1$ 上，映射 $\\langle p, q \\rangle = \\int_0^1 p(t)q(t)\\,dt$ 定义了一个内积，满足对称性、可加性、齐次性与正定性。",
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

        const solution = t(
          `Expand the integrand and compute the definite integral:\n$$\\int_0^1 (${formatPoly(a, b)})(${formatPoly(c, d)})\\,dt = \\int_0^1 (${integrandExpanded})\\,dt = ${answer.toLatex()}$$`,
          `展开被积函数并计算定积分：\n$$\\int_0^1 (${formatPoly(a, b)})(${formatPoly(c, d)})\\,dt = \\int_0^1 (${integrandExpanded})\\,dt = ${answer.toLatex()}$$`,
        );

        return numberProblem({
          prompt,
          answer,
          solution,
          wrong: [Q.of(num + 6, 6), Q.of(num - 6, 6), Q.of(-num, 6), Q.of(num + 1, 6), Q.of(num - 1, 6)],
        });
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
  prerequisites: ["inner-product-spaces", "vectors-over-the-complex-numbers"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "complex-inner-product-evaluation",
      title: t("Evaluating Complex Inner Products in $\\mathbb{C}^n$", "计算 $\\mathbb{C}^n$ 中的复内积"),
      explanation: t(
        "Conjugating the entries of the second vector makes the inner product of a vector with itself a nonnegative real number, so lengths still make sense. In $\\mathbb{C}^n$, the standard inner product is $\\langle u, v \\rangle = \\sum_{k=1}^n u_k \\overline{v_k}$. It satisfies conjugate symmetry $\\langle u, v \\rangle = \\overline{\\langle v, u \\rangle}$ and conjugate homogeneity $\\langle u, c v \\rangle = \\bar{c} \\langle u, v \\rangle$.",
        "对第二个向量的分量取共轭，使向量与自身的内积成为非负实数，这样长度仍然有意义。在 $\\mathbb{C}^n$ 中，标准内积定义为 $\\langle u, v \\rangle = \\sum_{k=1}^n u_k \\overline{v_k}$。它满足共轭对称性 $\\langle u, v \\rangle = \\overline{\\langle v, u \\rangle}$ 与共轭齐次性 $\\langle u, c v \\rangle = \\bar{c} \\langle u, v \\rangle$。",
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

        const prompt = t(
          `In $\\mathbb{C}^2$, with the standard inner product $\\langle u, v \\rangle = u_1 \\overline{v_1} + u_2 \\overline{v_2}$, compute $\\langle u, v \\rangle$ for:\n$$u = ${colVecLatex([formatComplex(a1, b1), formatComplex(a2, b2)])}, \\quad v = ${colVecLatex([formatComplex(c1, d1), formatComplex(c2, d2)])}$$`,
          `在 $\\mathbb{C}^2$ 中，依标准复内积定义 $\\langle u, v \\rangle = u_1 \\overline{v_1} + u_2 \\overline{v_2}$，计算 $\\langle u, v \\rangle$：\n$$u = ${colVecLatex([formatComplex(a1, b1), formatComplex(a2, b2)])}, \\quad v = ${colVecLatex([formatComplex(c1, d1), formatComplex(c2, d2)])}$$`,
        );

        const right = t(`$${rightVal}$`, `$${rightVal}$`);
        const wrong = [
          t(`$${formatComplex(re, -im)}$`, `$${formatComplex(re, -im)}$`),
          t(
            `$${formatComplex(a1 * c1 - b1 * d1 + a2 * c2 - b2 * d2, a1 * d1 + b1 * c1 + a2 * d2 + b2 * c2)}$`,
            `$${formatComplex(a1 * c1 - b1 * d1 + a2 * c2 - b2 * d2, a1 * d1 + b1 * c1 + a2 * d2 + b2 * c2)}$`,
          ),
          t(`$${formatComplex(re + 2, im - 1)}$`, `$${formatComplex(re + 2, im - 1)}$`),
          t(`$${formatComplex(-re, im)}$`, `$${formatComplex(-re, im)}$`),
          t(`$${formatComplex(re - 2, im + 1)}$`, `$${formatComplex(re - 2, im + 1)}$`),
        ];

        const solution = t(
          `Multiply each component of $u$ by the complex conjugate of the corresponding component of $v$:\n$$\\langle u, v \\rangle = (${formatComplex(a1, b1)})(${formatComplex(c1, -d1)}) + (${formatComplex(a2, b2)})(${formatComplex(c2, -d2)}) = ${rightVal}$$`,
          `将 $u$ 的各分量与 $v$ 对应分量的复共轭相乘求和：\n$$\\langle u, v \\rangle = (${formatComplex(a1, b1)})(${formatComplex(c1, -d1)}) + (${formatComplex(a2, b2)})(${formatComplex(c2, -d2)}) = ${rightVal}$$`,
        );

        return oneOf(rng, prompt, right, wrong, solution);
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
  prerequisites: ["norm-of-a-vector-in-n-dimensional-euclidean-space", "inner-product-spaces"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "induced-norm-weighted-space",
      title: t("Induced Norm in a Weighted Inner Product Space", "加权内积空间中的导出范数"),
      explanation: t(
        "In an inner product space $(V, \\langle \\cdot, \\cdot \\rangle)$, the induced norm is $|v| = \\sqrt{\\langle v, v \\rangle}$. For a weighted inner product $\\langle u, v \\rangle = w_1 u_1 v_1 + w_2 u_2 v_2 + w_3 u_3 v_3$ on $\\mathbb{R}^3$, the norm squared is $|v|^2 = w_1 v_1^2 + w_2 v_2^2 + w_3 v_3^2$.",
        "在内积空间 $(V, \\langle \\cdot, \\cdot \\rangle)$ 中，导出范数定义为 $|v| = \\sqrt{\\langle v, v \\rangle}$。对于 $\\mathbb{R}^3$ 上的加权内积 $\\langle u, v \\rangle = w_1 u_1 v_1 + w_2 u_2 v_2 + w_3 u_3 v_3$，向量范数的平方为 $|v|^2 = w_1 v_1^2 + w_2 v_2^2 + w_3 v_3^2$。",
      ),
      generate: (rng: Rng): Problem => {
        const w1 = rng.pick([1, 2, 3, 5]);
        const w2 = rng.pick([1, 2, 3, 4]);
        const w3 = rng.pick([1, 2, 4]);
        const v1 = rng.pick([-3, -2, -1, 1, 2, 3]);
        const v2 = rng.pick([-3, -2, -1, 1, 2, 3]);
        const v3 = rng.pick([-3, -2, -1, 1, 2, 3]);

        const sumVal = w1 * v1 * v1 + w2 * v2 * v2 + w3 * v3 * v3;

        const innerProductDef = formatWeightedDot([w1, w2, w3]);
        const prompt = t(
          `In $\\mathbb{R}^3$, consider the weighted inner product $\\langle x, y \\rangle = ${innerProductDef}$.\nFind the square of the induced norm, $\\|v\\|^2 = \\langle v, v \\rangle$, of the vector:\n$$v = ${colVecLatex([v1, v2, v3])}$$`,
          `在 $\\mathbb{R}^3$ 中，考虑加权内积 $\\langle x, y \\rangle = ${innerProductDef}$。\n求向量 $v$ 的导出范数的平方 $\\|v\\|^2 = \\langle v, v \\rangle$：\n$$v = ${colVecLatex([v1, v2, v3])}$$`,
        );

        const solution = t(
          `Apply the formula for the induced norm squared:\n$$\\|v\\|^2 = \\langle v, v \\rangle = ${w1}(${v1})^2 + ${w2}(${v2})^2 + ${w3}(${v3})^2 = ${sumVal}$$`,
          `应用导出范数平方的计算公式：\n$$\\|v\\|^2 = \\langle v, v \\rangle = ${w1}(${v1})^2 + ${w2}(${v2})^2 + ${w3}(${v3})^2 = ${sumVal}$$`,
        );

        return numberProblem({
          prompt,
          answer: sumVal,
          solution,
          wrong: [
            v1 * v1 + v2 * v2 + v3 * v3,
            w1 * Math.abs(v1) + w2 * Math.abs(v2) + w3 * Math.abs(v3),
            sumVal + 4,
            Math.abs(sumVal - 5) || sumVal + 2,
            sumVal + 8,
          ],
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
  prerequisites: ["dot-product-in-n-dimensional-euclidean-space"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "solve-orthogonal-parameter-rn",
      title: t("Solving for Orthogonality in $\\mathbb{R}^n$", "求解满足正交性的参数"),
      explanation: t(
        "Set the dot product equal to zero, which gives a linear equation in the unknown entry, and solve it. Two vectors $u, v \\in \\mathbb{R}^n$ are orthogonal if and only if their dot product is zero: $u \\cdot v = 0$.",
        "令点积等于零，得到关于未知分量的一次方程，再解出它。两个向量 $u, v \\in \\mathbb{R}^n$ 正交当且仅当其点积为零：$u \\cdot v = 0$。",
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
        const solution = t(
          `Set the dot product to zero and solve for $k$:\n$$u \\cdot v = (${a})(${x1}) + (${b})(${x2}) + (${c})(${x3}) + (${d})k = 0$$\n$$${s} ${dTerm} = 0 \\implies k = ${answer.toLatex()}$$`,
          `令点积等于零并求解 $k$：\n$$u \\cdot v = (${a})(${x1}) + (${b})(${x2}) + (${c})(${x3}) + (${d})k = 0$$\n$$${s} ${dTerm} = 0 \\implies k = ${answer.toLatex()}$$`,
        );

        return numberProblem({
          prompt,
          answer,
          solveFor: "k",
          solution,
          wrong: [Q.of(s, d), Q.of(-s + d, d), Q.of(-s - 2 * d, d), 0, Q.of(s + d, d)],
        });
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
  prerequisites: ["orthogonal-vectors-in-euclidean-spaces", "inner-product-spaces"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "orthogonality-in-polynomial-space",
      title: t("Orthogonality Under Polynomial Integral Inner Product", "多项式积分内积下的正交性"),
      explanation: t(
        "Two vectors $f, g$ in an inner product space are orthogonal if $\\langle f, g \\rangle = 0$. On $C[0, 1]$ with $\\langle f, g \\rangle = \\int_0^1 f(t)g(t)\\,dt$, two polynomials $p, q$ are orthogonal if $\\int_0^1 p(t)q(t)\\,dt = 0$.",
        "内积空间中的两向量 $f, g$ 正交当且仅当 $\\langle f, g \\rangle = 0$。在赋有内积 $\\langle f, g \\rangle = \\int_0^1 f(t)g(t)\\,dt$ 的 $C[0, 1]$ 上，多项式 $p, q$ 正交当且仅当 $\\int_0^1 p(t)q(t)\\,dt = 0$。",
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

        const solution = t(
          `Compute the inner product integral and set it to zero:\n$$\\int_0^1 ${pmStr} (${aCoeff}${qnStr} + k)\\,dt = \\frac{${a}}{${m + n + 1}} + \\frac{k}{${m + 1}} = 0 \\implies k = ${answer.toLatex()}$$`,
          `计算内积定积分并令其为零：\n$$\\int_0^1 ${pmStr} (${aCoeff}${qnStr} + k)\\,dt = \\frac{${a}}{${m + n + 1}} + \\frac{k}{${m + 1}} = 0 \\implies k = ${answer.toLatex()}$$`,
        );

        return numberProblem({
          prompt,
          answer,
          solveFor: "k",
          solution,
          wrong: [Q.of(a * (m + 1), m + n + 1), Q.of(-a, m + n + 1), Q.of(-a * (m + n + 1), m + 1), 0, Q.of(-a * (m + 2), m + n + 1)],
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
  prerequisites: ["norm-of-a-vector-in-inner-product-spaces"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "angle-cosine-cauchy-schwarz",
      title: t("Cosine of the Angle Between Vectors", "两向量夹角的余弦值"),
      explanation: t(
        "By the Cauchy-Schwarz inequality, $|u \\cdot v| \\le |u| |v|$ for all vectors $u, v$. The angle $\\theta$ between two nonzero vectors in an inner product space is defined by $\\cos \\theta = \\frac{u \\cdot v}{|u| |v|}$.",
        "由柯西-施瓦茨不等式，对任意向量 $u, v$ 均有 $|u \\cdot v| \\le |u| |v|$。内积空间中两非零向量之间的夹角 $\\theta$ 满足 $\\cos \\theta = \\frac{u \\cdot v}{|u| |v|}$。",
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

        const solution = t(
          `Calculate the dot product and norms:\n$$u \\cdot v = ${dot}, \\quad \\|u\\| = ${t1.nu}, \\quad \\|v\\| = ${t2.nu}$$\nTherefore:\n$$\\cos \\theta = \\frac{u \\cdot v}{\\|u\\| \\|v\\|} = \\frac{${dot}}{${denom}} = ${answer.toLatex()}$$`,
          `计算点积与各向量范数：\n$$u \\cdot v = ${dot}, \\quad \\|u\\| = ${t1.nu}, \\quad \\|v\\| = ${t2.nu}$$\n因此：\n$$\\cos \\theta = \\frac{u \\cdot v}{\\|u\\| \\|v\\|} = \\frac{${dot}}{${denom}} = ${answer.toLatex()}$$`,
        );

        return numberProblem({
          prompt,
          answer,
          solution,
          wrong: [Q.of(-dot, denom), Q.of(dot, denom + 2), Q.of(dot + 1, denom), Q.of(dot - 1, denom)],
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
  prerequisites: ["cauchy-schwarz-inequality-and-angle-between-two-vectors", "orthogonal-vectors-in-inner-product-spaces"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "pythagorean-orthogonal-norm",
      title: t("Pythagorean Theorem for Orthogonal Vectors", "正交向量的勾股定理"),
      explanation: t(
        "In an inner product space, if vectors $u$ and $v$ are orthogonal ($\\langle u, v \\rangle = 0$), then $|u + v|^2 = |u|^2 + |v|^2$. More generally, for scalars $a, b$, $|a u + b v|^2 = a^2 |u|^2 + b^2 |v|^2$.",
        "在内积空间中，若两向量 $u$ 与 $v$ 正交（$\\langle u, v \\rangle = 0$），则 $|u + v|^2 = |u|^2 + |v|^2$。更一般地，对于标量 $a, b$，有 $|a u + b v|^2 = a^2 |u|^2 + b^2 |v|^2$。",
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

        const solution = t(
          `Since $u$ and $v$ are orthogonal, $\\langle u, v \\rangle = 0$. By the generalized Pythagorean theorem:\n$$\\|${aStr}u + ${bStr}v\\|^2 = ${a}^2 \\|u\\|^2 + ${b}^2 \\|v\\|^2 = ${a * a}(${nu * nu}) + ${b * b}(${nv * nv}) = ${normSq}$$`,
          `因 $u$ 与 $v$ 相互正交，$\\langle u, v \\rangle = 0$。由广义勾股定理：\n$$\\|${aStr}u + ${bStr}v\\|^2 = ${a}^2 \\|u\\|^2 + ${b}^2 \\|v\\|^2 = ${a * a}(${nu * nu}) + ${b * b}(${nv * nv}) = ${normSq}$$`,
        );

        return numberProblem({
          prompt,
          answer: normSq,
          solution,
          wrong: [a * nu + b * nv, normSq + 5, Math.abs(a * a * nu * nu - b * b * nv * nv) || 4, a * a * nu + b * b * nv],
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
  prerequisites: ["orthogonal-vectors-in-euclidean-spaces", "subspaces-of-n-dimensional-space"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "orthogonal-complement-dimension-basis",
      title: t("Dimension and Basis of Orthogonal Complements", "正交补的维数与基"),
      explanation: t(
        "For any subspace $W$ of $\\mathbb{R}^n$, its orthogonal complement $W^\\perp$ has dimension $\\dim(W^\\perp) = n - \\dim(W)$, and $W \\cap W^\\perp = \\{0\\}$. A vector $x$ belongs to $W^\\perp$ if and only if $x$ is orthogonal to every vector in $W$.",
        "对于 $\\mathbb{R}^n$ 的任意子空间 $W$，其正交补 $W^\\perp$ 的维数满足 $\\dim(W^\\perp) = n - \\dim(W)$，且 $W \\cap W^\\perp = \\{0\\}$。向量 $x$ 属于 $W^\\perp$ 当且仅当 $x$ 与 $W$ 的每个向量正交。",
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
          `Let $W = \\operatorname{span}\\{${spanLatex}\\} \\subset \\mathbb{R}^${n}$, where the given vectors are linearly independent. What is the dimension of its orthogonal complement $W^\\perp$?`,
          `设 $W = \\operatorname{span}\\{${spanLatex}\\} \\subset \\mathbb{R}^${n}$，其中所给向量线性无关。求其正交补 $W^\\perp$ 的维数 $\\dim(W^\\perp)$。`,
        );

        const solution = t(
          `Since $W$ is spanned by $k = ${k}$ linearly independent vectors in $\\mathbb{R}^${n}$, $\\dim(W) = ${k}$. By the dimension formula for orthogonal complements:\n$$\\dim(W^\\perp) = n - \\dim(W) = ${n} - ${k} = ${ans}$$`,
          `因 $W$ 由 $\\mathbb{R}^${n}$ 中的 $k = ${k}$ 个线性无关向量张成，故 $\\dim(W) = ${k}$。由正交补维数公式：\n$$\\dim(W^\\perp) = n - \\dim(W) = ${n} - ${k} = ${ans}$$`,
        );

        return numberProblem({
          prompt,
          answer: ans,
          solution,
          wrong: [k, n, Math.abs(n - 2 * k), ans + 1, Math.max(1, ans - 1)],
        });
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
  prerequisites: ["orthogonal-vectors-in-euclidean-spaces", "linear-dependence-and-independence"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "verifying-orthogonal-set-rn",
      title: t("Orthogonality of Sets of Vectors in $\\mathbb{R}^n$", "$\\mathbb{R}^n$ 中向量集合的正交性"),
      explanation: t(
        "A set of vectors $S = \\{u_1, u_2, \\dots, u_p\\} \\subset \\mathbb{R}^n$ is orthogonal if $u_i \\cdot u_j = 0$ for all $i \\ne j$. Any orthogonal set of nonzero vectors is linearly independent.",
        "若集合 $S = \\{u_1, u_2, \\dots, u_p\\} \\subset \\mathbb{R}^n$ 中任意两不同向量满足 $u_i \\cdot u_j = 0$（$i \\ne j$），则称 $S$ 为正交集。任何由非零向量组成的正交集必然线性无关。",
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
        const solution = t(
          `Check pairwise dot products: $u_1 \\cdot u_2 = 0$ and $u_2 \\cdot u_3 = 0$. For $u_1 \\cdot u_3 = 0$:\n$$u_1 \\cdot u_3 = (${a})(1) + (${a})(1) + (${b})k = ${2 * a} ${bTerm} = 0 \\implies k = ${answer.toLatex()}$$`,
          `检验两两点积：已有 $u_1 \\cdot u_2 = 0$ 以及 $u_2 \\cdot u_3 = 0$。由 $u_1 \\cdot u_3 = 0$：\n$$u_1 \\cdot u_3 = (${a})(1) + (${a})(1) + (${b})k = ${2 * a} ${bTerm} = 0 \\implies k = ${answer.toLatex()}$$`,
        );

        return numberProblem({
          prompt,
          answer,
          solveFor: "k",
          solution,
          wrong: [Q.of(2 * a, b), Q.of(-a, b), 0, Q.of(-2 * a + b, b), Q.of(a, b)],
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
  prerequisites: ["orthogonal-sets-in-euclidean-spaces", "orthogonal-vectors-in-inner-product-spaces"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "normalizing-orthogonal-polynomial",
      title: t("Normalizing Vectors in an Inner Product Space", "内积空间中向量的单位化"),
      explanation: t(
        "In an inner product space, a vector $u$ is normalized to unit length by dividing by its norm: $\\hat{u} = \\frac{u}{|u|} = \\frac{u}{\\sqrt{\\langle u, u \\rangle}}$. Its norm squared is $\\langle u, u \\rangle$.",
        "在内积空间中，将非零向量 $u$ 单位化的方法是除以其导出范数：$\\hat{u} = \\frac{u}{|u|} = \\frac{u}{\\sqrt{\\langle u, u \\rangle}}$。其范数的平方为 $\\langle u, u \\rangle$。",
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

        const solution = t(
          `Compute the inner product of $p$ with itself:\n$$\\|p\\|^2 = \\int_0^1 (${polyStr})^2\\,dt = ${a * a} \\int_0^1 t^{${2 * k}}\\,dt = \\frac{${a * a}}{${radicand}} = ${answer.toLatex()}$$`,
          `计算多项式与自身的内积：\n$$\\|p\\|^2 = \\int_0^1 (${polyStr})^2\\,dt = ${a * a} \\int_0^1 t^{${2 * k}}\\,dt = \\frac{${a * a}}{${radicand}} = ${answer.toLatex()}$$`,
        );

        return numberProblem({
          prompt,
          answer,
          solution,
          wrong: [Q.of(a * a, 2 * k), Q.of(a, radicand), Q.of(a * a, k + 1), Q.of(a * a, 2 * k + 2)],
        });
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
  prerequisites: ["orthogonal-sets-in-euclidean-spaces"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "orthogonal-matrix-inverse-properties",
      title: t("Inverse and Properties of an Orthogonal Matrix", "正交矩阵的逆及其性质"),
      explanation: t(
        "A square matrix $Q$ is orthogonal if and only if $Q^T Q = I$, which means $Q^{-1} = Q^T$. The columns of $Q$ form an orthonormal basis of $\\mathbb{R}^n$, and $\\det(Q) = \\pm 1$.",
        "方阵 $Q$ 是正交矩阵当且仅当 $Q^T Q = I$，这意味着 $Q^{-1} = Q^T$。$Q$ 的列向量构成 $\\mathbb{R}^n$ 的一组标准正交基，且 $\\det(Q) = \\pm 1$。",
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

        const qRows = isReflection
          ? [
              [frac(a, d), frac(b, d)],
              [frac(b, d), frac(-a, d)],
            ]
          : [
              [frac(a, d), frac(-b, d)],
              [frac(b, d), frac(a, d)],
            ];

        const qInvRows = isReflection
          ? [
              [frac(a, d), frac(b, d)],
              [frac(b, d), frac(-a, d)],
            ]
          : [
              [frac(a, d), frac(b, d)],
              [frac(-b, d), frac(a, d)],
            ];

        const qLatex = matLatex(qRows);
        const qInvLatex = matLatex(qInvRows);

        const prompt = t(
          `Given the orthogonal matrix $Q = ${qLatex}$, what is its inverse matrix $Q^{-1}$?`,
          `已知正交矩阵 $Q = ${qLatex}$，求其逆矩阵 $Q^{-1}$。`,
        );

        const right = t(`$${qInvLatex}$`, `$${qInvLatex}$`);
        const wrong = [
          t(
            `$${matLatex([
              [frac(-a, d), frac(b, d)],
              [frac(-b, d), frac(-a, d)],
            ])}$`,
            `$${matLatex([
              [frac(-a, d), frac(b, d)],
              [frac(-b, d), frac(-a, d)],
            ])}$`,
          ),
          t(
            `$${matLatex([
              [frac(-a, d), frac(-b, d)],
              [frac(b, d), frac(-a, d)],
            ])}$`,
            `$${matLatex([
              [frac(-a, d), frac(-b, d)],
              [frac(b, d), frac(-a, d)],
            ])}$`,
          ),
          t(
            `$${matLatex([
              [frac(b, d), frac(a, d)],
              [frac(-a, d), frac(b, d)],
            ])}$`,
            `$${matLatex([
              [frac(b, d), frac(a, d)],
              [frac(-a, d), frac(b, d)],
            ])}$`,
          ),
          t(
            `$${matLatex([
              [frac(a, d), frac(-b, d)],
              [frac(-b, d), frac(-a, d)],
            ])}$`,
            `$${matLatex([
              [frac(a, d), frac(-b, d)],
              [frac(-b, d), frac(-a, d)],
            ])}$`,
          ),
        ];

        const solution = t(
          `For any orthogonal matrix $Q$, the inverse is simply its transpose: $Q^{-1} = Q^T = ${qInvLatex}$.`,
          `对于任意正交矩阵 $Q$，其逆矩阵即为其转置矩阵：$Q^{-1} = Q^T = ${qInvLatex}$。`,
        );

        return oneOf(rng, prompt, right, wrong, solution);
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
          `Because $T$ is an orthogonal transformation, it is an isometry that preserves lengths and dot products:\n$$\\|T(${c1Str}u - ${c2Str}v)\\|^2 = \\|${c1Str}u - ${c2Str}v\\|^2 = ${c1 * c1}\\|u\\|^2 - ${2 * c1 * c2}(u \\cdot v) + ${c2 * c2}\\|v\\|^2 = ${c1 * c1}(${nu * nu}) - ${2 * c1 * c2}(${dot}) + ${c2 * c2}(${nv * nv}) = ${val}$$`,
          `因为 $T$ 是正交变换，它是保持长度与点积不变的等距变换：\n$$\\|T(${c1Str}u - ${c2Str}v)\\|^2 = \\|${c1Str}u - ${c2Str}v\\|^2 = ${c1 * c1}\\|u\\|^2 - ${2 * c1 * c2}(u \\cdot v) + ${c2 * c2}\\|v\\|^2 = ${c1 * c1}(${nu * nu}) - ${2 * c1 * c2}(${dot}) + ${c2 * c2}(${nv * nv}) = ${val}$$`,
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
          ? `$(\\operatorname{Col}(A))^\\perp = \\operatorname{Nul}(A^T)$ in $\\mathbb{R}^${m}$, so $\\dim((\\operatorname{Col}(A))^\\perp) = m - r = ${m} - ${r} = ${answerVal}$.`
          : `$(\\operatorname{Row}(A))^\\perp = \\operatorname{Nul}(A)$ in $\\mathbb{R}^${n}$, so $\\dim((\\operatorname{Row}(A))^\\perp) = n - r = ${n} - ${r} = ${answerVal}$.`;

        const explanationZh = askColComp
          ? `在 $\\mathbb{R}^${m}$ 中，$(\\operatorname{Col}(A))^\\perp = \\operatorname{Nul}(A^T)$，因此 $\\dim((\\operatorname{Col}(A))^\\perp) = m - r = ${m} - ${r} = ${answerVal}$。`
          : `在 $\\mathbb{R}^${n}$ 中，$(\\operatorname{Row}(A))^\\perp = \\operatorname{Nul}(A)$，因此 $\\dim((\\operatorname{Row}(A))^\\perp) = n - r = ${n} - ${r} = ${answerVal}$。`;

        const solution = t(`By the Fundamental Theorem of Linear Algebra, ${explanationPart}`, `由线性代数基本定理，${explanationZh}`);

        return numberProblem({
          prompt,
          answer: answerVal,
          solution,
          wrong: [r, askColComp ? n - r : m - r, m, n, answerVal + 1, Math.max(1, answerVal - 1)],
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

        const dist = rng.pick([1, 2, 3, 4, 5]);
        const sign = rng.pick([1, -1]);
        const targetDot = sign * dist * norm;

        const y = [sign * dist * n[0]!, sign * dist * n[1]!, sign * dist * n[2]!];

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
          wrong: [dist * norm, dist * dist, dist + 1, Math.abs(dist - 1) || dist + 2],
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
          `Let $P$ be the $n \\times n$ standard matrix of an orthogonal projection onto ${article(k)} $${k}$-dimensional subspace $W \\subseteq \\mathbb{R}^${n}$.\nWhat is the trace $\\operatorname{tr}(P^{${power}})$?`,
          `设 $P$ 为将 $\\mathbb{R}^${n}$ 中的向量正交投影到 $${k}$ 维子空间 $W$ 上的投影矩阵。\n求矩阵幂的迹 $\\operatorname{tr}(P^{${power}})$ 的值。`,
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
