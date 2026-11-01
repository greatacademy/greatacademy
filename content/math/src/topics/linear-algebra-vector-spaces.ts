import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";

import { choiceProblem } from "../problems.ts";

/** colVecLatex renders a column vector in LaTeX. */
function colVecLatex(v: readonly (number | string)[]): string {
  return `\\begin{pmatrix} ${v.join(" \\\\ ")} \\end{pmatrix}`;
}

/** matLatex renders a matrix in LaTeX. */
function matLatex(rows: readonly (readonly (number | string)[])[]): string {
  return `\\begin{pmatrix} ${rows.map((r) => r.join(" & ")).join(" \\\\ ")} \\end{pmatrix}`;
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
// MODULE 3.9: VECTORS IN N-DIMENSIONAL SPACE
// ════════════════════════════════════════════════════════════════════════════

/** vectorsInNDimensionalEuclideanSpace covers column vectors in ℝⁿ, vector addition and scalar multiplication. */
export const vectorsInNDimensionalEuclideanSpace: TopicDef = {
  id: "vectors-in-n-dimensional-euclidean-space",
  title: t("Vectors in N-Dimensional Euclidean Space", "N 维欧几里得空间中的向量"),
  summary: t(
    "Represent vectors in ℝⁿ as column vectors, perform componentwise vector addition, and calculate scalar multiples.",
    "掌握将 ℝⁿ 中的向量表示为列向量，并进行分量加法与标量乘法运算。",
  ),
  prerequisites: ["addition-and-scalar-multiplication-of-cartesian-vectors-in-3d"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "rn-vectors-addition",
      title: t("Vector addition in ℝⁿ", "ℝⁿ 中的向量加法"),
      explanation: t(
        "Vectors in ℝⁿ are added componentwise: if u = (u₁, ..., uₙ)ᵀ and v = (v₁, ..., vₙ)ᵀ, then u + v = (u₁ + v₁, ..., uₙ + vₙ)ᵀ.",
        "ℝⁿ 中的向量加法是按分量进行的：若 u = (u₁, ..., uₙ)ᵀ 且 v = (v₁, ..., vₙ)ᵀ，则 u + v = (u₁ + v₁, ..., uₙ + vₙ)ᵀ。",
      ),
      generate(rng) {
        const n = 4;
        const u = Array.from({ length: n }, () => rng.int(-6, 6));
        const v = Array.from({ length: n }, () => rng.int(-6, 6));
        const sum = u.map((x, i) => x + v[i]!);
        const prompt = t(
          `In $\\mathbb{R}^4$, compute $\\mathbf{u} + \\mathbf{v}$ for $\\mathbf{u} = ${colVecLatex(u)}$ and $\\mathbf{v} = ${colVecLatex(v)}$.`,
          `在 $\\mathbb{R}^4$ 中，计算向量 $\\mathbf{u} = ${colVecLatex(u)}$ 与 $\\mathbf{v} = ${colVecLatex(v)}$ 的和 $\\mathbf{u} + \\mathbf{v}$。`,
        );
        const right = t(`$${colVecLatex(sum)}$`, `$${colVecLatex(sum)}$`);
        const wrong = [
          t(`$${colVecLatex(u.map((x, i) => x - v[i]!))}$`, `$${colVecLatex(u.map((x, i) => x - v[i]!))}$`),
          t(`$${colVecLatex(sum.map((x, i) => (i === 1 ? x + 1 : x)))}$`, `$${colVecLatex(sum.map((x, i) => (i === 1 ? x + 1 : x)))}$`),
          t(`$${colVecLatex(sum.map((x) => -x))}$`, `$${colVecLatex(sum.map((x) => -x))}$`),
          t(`$${colVecLatex(sum.map((x, i) => (i === 2 ? x - 2 : x)))}$`, `$${colVecLatex(sum.map((x, i) => (i === 2 ? x - 2 : x)))}$`),
        ];
        const solution = t(
          `Add corresponding components:\n$$\\mathbf{u} + \\mathbf{v} = ${colVecLatex(sum)}$$`,
          `将对应分量分别相加：\n$$\\mathbf{u} + \\mathbf{v} = ${colVecLatex(sum)}$$`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "rn-vectors-scalar-multiplication",
      title: t("Scalar multiplication in ℝⁿ", "ℝⁿ 中的标量乘法与线性组合"),
      explanation: t(
        "For a scalar c and vector u in ℝⁿ, c u = (c u₁, ..., c uₙ)ᵀ. A linear combination c u + d v is computed componentwise.",
        "对于标量 c 与向量 u ∈ ℝⁿ，c u = (c u₁, ..., c uₙ)ᵀ。线性组合 c u + d v 逐分量计算。",
      ),
      generate(rng) {
        const c = rng.nonZero(-3, 3);
        const d = rng.nonZero(-3, 3);
        const u = Array.from({ length: 4 }, () => rng.int(-4, 4));
        const v = Array.from({ length: 4 }, () => rng.int(-4, 4));
        const res = u.map((x, i) => c * x + d * v[i]!);
        const cStr = c === 1 ? "" : c === -1 ? "-" : `${c}`;
        const dStr = d > 0 ? `+ ${d === 1 ? "" : d}` : `- ${d === -1 ? "" : Math.abs(d)}`;
        const expr = `${cStr}\\mathbf{u} ${dStr}\\mathbf{v}`;
        const prompt = t(
          `Given $\\mathbf{u} = ${colVecLatex(u)}$ and $\\mathbf{v} = ${colVecLatex(v)}$ in $\\mathbb{R}^4$, compute $${expr}$.`,
          `已知 $\\mathbb{R}^4$ 中的向量 $\\mathbf{u} = ${colVecLatex(u)}$ 与 $\\mathbf{v} = ${colVecLatex(v)}$，计算 $${expr}$。`,
        );
        const right = t(`$${colVecLatex(res)}$`, `$${colVecLatex(res)}$`);
        const wrong = [
          t(`$${colVecLatex(u.map((x, i) => c * x - d * v[i]!))}$`, `$${colVecLatex(u.map((x, i) => c * x - d * v[i]!))}$`),
          t(`$${colVecLatex(res.map((x, i) => (i === 0 ? x + c : x)))}$`, `$${colVecLatex(res.map((x, i) => (i === 0 ? x + c : x)))}$`),
          t(`$${colVecLatex(u.map((x, i) => d * x + c * v[i]!))}$`, `$${colVecLatex(u.map((x, i) => d * x + c * v[i]!))}$`),
          t(`$${colVecLatex(res.map((x) => -x))}$`, `$${colVecLatex(res.map((x) => -x))}$`),
        ];
        const solution = t(
          `Compute each component: $c u_i + d v_i$. The resulting vector is $${colVecLatex(res)}$.`,
          `逐分量计算 $c u_i + d v_i$，得到向量为 $${colVecLatex(res)}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

/** linearCombinationsOfVectorsInNDimensionalEuclideanSpace covers forming linear combinations and checking if a vector is a linear combination. */
export const linearCombinationsOfVectorsInNDimensionalEuclideanSpace: TopicDef = {
  id: "linear-combinations-of-vectors-in-n-dimensional-euclidean-space",
  title: t("Linear Combinations of Vectors in N-Dimensional Euclidean Space", "N 维向量的线性组合"),
  summary: t(
    "Calculate linear combinations of vectors and determine if a vector b can be written as a linear combination of a set of vectors.",
    "计算向量的线性组合，并通过增广矩阵判断向量 b 是否可由一组向量线性表出。",
  ),
  prerequisites: ["vectors-in-n-dimensional-euclidean-space"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "compute-linear-combination-3-vectors",
      title: t("Computing a linear combination of vectors", "计算多个向量的线性组合"),
      explanation: t(
        "A linear combination of vectors v₁, ..., vₖ with weights c₁, ..., cₖ is the vector c₁v₁ + ... + cₖvₖ.",
        "向量组 v₁, ..., vₖ 关于权重 c₁, ..., cₖ 的线性组合为向量 c₁v₁ + ... + cₖvₖ。",
      ),
      generate(rng) {
        const c1 = rng.int(-2, 3);
        const c2 = rng.int(-2, 3);
        const c3 = rng.int(-2, 3);
        const v1 = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
        const v2 = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
        const v3 = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
        const res = [
          c1 * v1[0]! + c2 * v2[0]! + c3 * v3[0]!,
          c1 * v1[1]! + c2 * v2[1]! + c3 * v3[1]!,
          c1 * v1[2]! + c2 * v2[2]! + c3 * v3[2]!,
        ];
        const prompt = t(
          `Compute the linear combination $(${c1})\\mathbf{v}_1 + (${c2})\\mathbf{v}_2 + (${c3})\\mathbf{v}_3$ for $\\mathbf{v}_1 = ${colVecLatex(v1)}$, $\\mathbf{v}_2 = ${colVecLatex(v2)}$, and $\\mathbf{v}_3 = ${colVecLatex(v3)}$.`,
          `计算线性组合 $(${c1})\\mathbf{v}_1 + (${c2})\\mathbf{v}_2 + (${c3})\\mathbf{v}_3$，其中 $\\mathbf{v}_1 = ${colVecLatex(v1)}$，$\\mathbf{v}_2 = ${colVecLatex(v2)}$，$\\mathbf{v}_3 = ${colVecLatex(v3)}$。`,
        );
        const right = t(`$${colVecLatex(res)}$`, `$${colVecLatex(res)}$`);
        const wrong = [
          t(`$${colVecLatex([res[0]! + 1, res[1]!, res[2]! - 1])}$`, `$${colVecLatex([res[0]! + 1, res[1]!, res[2]! - 1])}$`),
          t(`$${colVecLatex([res[0]! - 2, res[1]! + 1, res[2]!])}$`, `$${colVecLatex([res[0]! - 2, res[1]! + 1, res[2]!])}$`),
          t(`$${colVecLatex([-res[0]!, -res[1]!, -res[2]!])}$`, `$${colVecLatex([-res[0]!, -res[1]!, -res[2]!])}$`),
          t(`$${colVecLatex([res[1]!, res[0]!, res[2]!])}$`, `$${colVecLatex([res[1]!, res[0]!, res[2]!])}$`),
        ];
        const solution = t(
          `Multiply each vector by its scalar and add:\n$$\\mathbf{b} = ${colVecLatex(res)}$$`,
          `将每个向量乘以对应标量并相加，得到：\n$$\\mathbf{b} = ${colVecLatex(res)}$$`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "determine-if-linear-combination",
      title: t("Determining if a vector is a linear combination", "判定向量是否为线性组合"),
      explanation: t(
        "A vector b is a linear combination of v₁, ..., vₖ if and only if the vector equation c₁v₁ + ... + cₖvₖ = b has a solution, which corresponds to the augmented matrix [v₁ ... vₖ | b] being consistent.",
        "向量 b 可由 v₁, ..., vₖ 线性表出，当且仅当方程 c₁v₁ + ... + cₖvₖ = b 有解，即增广矩阵 [v₁ ... vₖ | b] 相容。",
      ),
      generate(rng) {
        const c1 = rng.nonZero(-3, 3);
        const c2 = rng.nonZero(-3, 3);
        const a = rng.nonZero(-2, 2);
        const b = rng.int(-3, 3);
        const d = rng.nonZero(-2, 2);
        const v1 = [a, b, a + b];
        const v2 = [0, d, d];
        const isComb = rng.bool();
        const delta = isComb ? 0 : rng.pick([-3, -2, -1, 1, 2, 3]);
        const target = [c1 * v1[0]! + c2 * v2[0]!, c1 * v1[1]! + c2 * v2[1]!, c1 * v1[2]! + c2 * v2[2]! + delta];
        const prompt = t(
          `Determine whether $\\mathbf{b} = ${colVecLatex(target)}$ can be written as a linear combination of $\\mathbf{v}_1 = ${colVecLatex(v1)}$ and $\\mathbf{v}_2 = ${colVecLatex(v2)}$.`,
          `判断向量 $\\mathbf{b} = ${colVecLatex(target)}$ 是否可由 $\\mathbf{v}_1 = ${colVecLatex(v1)}$ 与 $\\mathbf{v}_2 = ${colVecLatex(v2)}$ 线性表出。`,
        );
        const right = isComb
          ? t(
              `Yes, $\\mathbf{b} = (${c1})\\mathbf{v}_1 + (${c2})\\mathbf{v}_2$`,
              `是，$\\mathbf{b} = (${c1})\\mathbf{v}_1 + (${c2})\\mathbf{v}_2$`,
            )
          : t(
              `No, the system is inconsistent because the third component does not match $c_1(a+b) + c_2 d$`,
              `否，方程组不相容，第三个分量无法满足对应线性关系`,
            );
        const wrong = isComb
          ? [
              t(`No, the system has no solution`, `否，该方程组无解`),
              t(
                `Yes, $\\mathbf{b} = (${c1 + 1})\\mathbf{v}_1 + (${c2})\\mathbf{v}_2$`,
                `是，$\\mathbf{b} = (${c1 + 1})\\mathbf{v}_1 + (${c2})\\mathbf{v}_2$`,
              ),
              t(
                `Yes, $\\mathbf{b} = (${c1})\\mathbf{v}_1 + (${c2 - 1})\\mathbf{v}_2$`,
                `是，$\\mathbf{b} = (${c1})\\mathbf{v}_1 + (${c2 - 1})\\mathbf{v}_2$`,
              ),
            ]
          : [
              t(
                `Yes, $\\mathbf{b} = (${c1})\\mathbf{v}_1 + (${c2})\\mathbf{v}_2$`,
                `是，$\\mathbf{b} = (${c1})\\mathbf{v}_1 + (${c2})\\mathbf{v}_2$`,
              ),
              t(`Yes, $\\mathbf{b} = (1)\\mathbf{v}_1 + (1)\\mathbf{v}_2$`, `是，$\\mathbf{b} = (1)\\mathbf{v}_1 + (1)\\mathbf{v}_2$`),
              t(
                `Yes, $\\mathbf{b} = (${c2})\\mathbf{v}_1 + (${c1})\\mathbf{v}_2$`,
                `是，$\\mathbf{b} = (${c2})\\mathbf{v}_1 + (${c1})\\mathbf{v}_2$`,
              ),
            ];
        const solution = isComb
          ? t(
              `Row reducing the augmented matrix $[\\mathbf{v}_1 \\; \\mathbf{v}_2 \\mid \\mathbf{b}]$ yields the unique solution $c_1 = ${c1}$ and $c_2 = ${c2}$.`,
              `对增广矩阵 $[\\mathbf{v}_1 \\; \\mathbf{v}_2 \\mid \\mathbf{b}]$ 进行初等行变换，解得唯一解 $c_1 = ${c1}$，$c_2 = ${c2}$。`,
            )
          : t(
              `Row reducing $[\\mathbf{v}_1 \\; \\mathbf{v}_2 \\mid \\mathbf{b}]$ leads to a row of the form $[0 \\; 0 \\mid k]$ with $k \\neq 0$, showing the system is inconsistent.`,
              `对增广矩阵 $[\\mathbf{v}_1 \\; \\mathbf{v}_2 \\mid \\mathbf{b}]$ 进行初等行变换会出现 $[0 \\; 0 \\mid k]$（$k \\neq 0$）的情形，方程组矛盾无解。`,
            );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

/** linearSpanOfVectorsInNDimensionalEuclideanSpace covers span definition, span membership, and spanning ℝⁿ. */
export const linearSpanOfVectorsInNDimensionalEuclideanSpace: TopicDef = {
  id: "linear-span-of-vectors-in-n-dimensional-euclidean-space",
  title: t("Linear Span of Vectors in N-Dimensional Euclidean Space", "向量组的线性张成空间 (Span)"),
  summary: t(
    "Define the span of a set of vectors as the collection of all linear combinations, test for membership in a span, and determine whether a set spans ℝⁿ.",
    "掌握向量组的张成空间定义（所有线性组合的集合），判断向量是否属于张成空间，并判定是否张成 ℝⁿ。",
  ),
  prerequisites: ["linear-combinations-of-vectors-in-n-dimensional-euclidean-space"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "membership-in-span",
      title: t("Membership in Span{v₁, ..., vₖ}", "判定向量是否属于张成空间"),
      explanation: t(
        "A vector w belongs to Span{v₁, ..., vₖ} if and only if w can be expressed as a linear combination of v₁, ..., vₖ.",
        "向量 w 属于 Span{v₁, ..., vₖ}，当且仅当 w 可以表示为该向量组的一个线性组合。",
      ),
      generate(rng) {
        const u1 = rng.int(-3, 3);
        const u2 = rng.nonZero(-3, 3);
        const v1 = [1, u1, 0];
        const v2 = [0, u2, 1];
        const c1 = rng.int(-3, 3);
        const c2 = rng.int(-3, 3);
        const inSpan = rng.bool();
        const delta = inSpan ? 0 : rng.pick([-4, -2, 2, 4]);
        const w = [c1, c1 * u1 + c2 * u2 + delta, c2];
        const prompt = t(
          `Does $\\mathbf{w} = ${colVecLatex(w)}$ belong to $\\text{Span}\\left\\{ ${colVecLatex(v1)}, ${colVecLatex(v2)} \\right\\}$?`,
          `向量 $\\mathbf{w} = ${colVecLatex(w)}$ 是否属于 $\\text{Span}\\left\\{ ${colVecLatex(v1)}, ${colVecLatex(v2)} \\right\\}$？`,
        );
        const right = inSpan
          ? t(
              `Yes, because $\\mathbf{w} = (${c1})\\mathbf{v}_1 + (${c2})\\mathbf{v}_2$`,
              `是，因为 $\\mathbf{w} = (${c1})\\mathbf{v}_1 + (${c2})\\mathbf{v}_2$`,
            )
          : t(
              `No, because the required second component would be ${c1 * u1 + c2 * u2}, but here it is ${w[1]}`,
              `否，因为第二分量需满足 ${c1 * u1 + c2 * u2}，但此处为 ${w[1]}`,
            );
        const wrong = inSpan
          ? [
              t(
                `No, because $\\mathbf{w}$ is not a scalar multiple of $\\mathbf{v}_1$`,
                `否，因为 $\\mathbf{w}$ 不是 $\\mathbf{v}_1$ 的数乘倍数`,
              ),
              t(`No, the system has no solution`, `否，方程组无解`),
              t(`Yes, but only if $\\mathbf{w} = \\mathbf{0}$`, `是，但仅当 $\\mathbf{w} = \\mathbf{0}$ 时`),
            ]
          : [
              t(
                `Yes, because $\\mathbf{w} = (${c1})\\mathbf{v}_1 + (${c2})\\mathbf{v}_2$`,
                `是，因为 $\\mathbf{w} = (${c1})\\mathbf{v}_1 + (${c2})\\mathbf{v}_2$`,
              ),
              t(
                `Yes, because any vector in $\\mathbb{R}^3$ is in the span of two vectors`,
                `是，因为任意 $\\mathbb{R}^3$ 向量都在两个向量的张成空间中`,
              ),
              t(`Yes, with weights $c_1 = ${c2}, c_2 = ${c1}$`, `是，权重为 $c_1 = ${c2}, c_2 = ${c1}$`),
            ];
        const solution = inSpan
          ? t(
              `Setting $\\mathbf{w} = c_1 \\mathbf{v}_1 + c_2 \\mathbf{v}_2$ gives $c_1 = ${c1}$, $c_2 = ${c2}$, and $c_1(${u1}) + c_2(${u2}) = ${w[1]}$, which is satisfied. Thus $\\mathbf{w} \\in \\text{Span}\\{\\mathbf{v}_1, \\mathbf{v}_2\\}$.`,
              `设 $\\mathbf{w} = c_1 \\mathbf{v}_1 + c_2 \\mathbf{v}_2$，由第一和第三分量得 $c_1 = ${c1}$，$c_2 = ${c2}$，代入第二分量 $c_1(${u1}) + c_2(${u2}) = ${w[1]}$ 恰好成立。因此 $\\mathbf{w} \\in \\text{Span}\\{\\mathbf{v}_1, \\mathbf{v}_2\\}$。`,
            )
          : t(
              `From components 1 and 3, $c_1 = ${c1}$ and $c_2 = ${c2}$. Then $c_1(${u1}) + c_2(${u2}) = ${c1 * u1 + c2 * u2} \\neq ${w[1]}$, so no such linear combination exists.`,
              `由第一和第三分量可得 $c_1 = ${c1}$，$c_2 = ${c2}$，此时中间分量应为 $c_1(${u1}) + c_2(${u2}) = ${c1 * u1 + c2 * u2} \\neq ${w[1]}$，产生矛盾，故不属于张成空间。`,
            );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "spanning-entire-space",
      title: t("Spanning all of ℝⁿ", "判定向量组是否张成整个空间 ℝⁿ"),
      explanation: t(
        "A set of k vectors in ℝⁿ spans ℝⁿ if and only if the matrix with these vectors as columns has a pivot position in every row (which requires k ≥ n).",
        "ℝⁿ 中的 k 个向量张成 ℝⁿ，当且仅当以这组向量为列的矩阵每一行都有主元（这要求 k ≥ n）。",
      ),
      generate(rng) {
        const type = rng.pick(["less-vectors", "dependent-three", "spans-three"]);
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const c = rng.nonZero(-3, 3);
        if (type === "less-vectors") {
          const v1 = [a, 0, 1];
          const v2 = [0, b, -1];
          const prompt = t(
            `Does the set $\\left\\{ ${colVecLatex(v1)}, ${colVecLatex(v2)} \\right\\}$ span $\\mathbb{R}^3$?`,
            `向量组 $\\left\\{ ${colVecLatex(v1)}, ${colVecLatex(v2)} \\right\\}$ 能否张成 $\\mathbb{R}^3$？`,
          );
          const right = t(
            `No, because at least 3 vectors are needed to span $\\mathbb{R}^3$`,
            `否，因为张成 $\\mathbb{R}^3$ 至少需要 3 个向量`,
          );
          const wrong = [
            t(`Yes, because the two vectors are linearly independent`, `是，因为这两个向量线性无关`),
            t(`Yes, because their span is 3-dimensional`, `是，因为它们的张成空间是 3 维的`),
            t(`No, only because one vector contains a zero entry`, `否，仅因为某个向量含有零分量`),
          ];
          const solution = t(
            `Any collection of fewer than $n$ vectors in $\\mathbb{R}^n$ spans a subspace of dimension at most $k < n$. Here $k = 2 < 3$, so it cannot span $\\mathbb{R}^3$.`,
            `在 $\\mathbb{R}^n$ 中，少于 $n$ 个向量的张成空间维数最多为 $k < n$。这里 $2 < 3$，张成空间只是过原点的一个平面，无法张成全空间。`,
          );
          return oneOf(rng, prompt, right, wrong, solution);
        }
        if (type === "dependent-three") {
          const v1 = [1, 0, 0];
          const v2 = [0, 1, 0];
          const v3 = [a, b, 0];
          const prompt = t(
            `Does the set $\\left\\{ ${colVecLatex(v1)}, ${colVecLatex(v2)}, ${colVecLatex(v3)} \\right\\}$ span $\\mathbb{R}^3$?`,
            `向量组 $\\left\\{ ${colVecLatex(v1)}, ${colVecLatex(v2)}, ${colVecLatex(v3)} \\right\\}$ 能否张成 $\\mathbb{R}^3$？`,
          );
          const right = t(
            `No, because the third component of all three vectors is 0, so they only span the xy-plane`,
            `否，因为三个向量的第三分量全为 0，只能张成 xy 平面`,
          );
          const wrong = [
            t(`Yes, because there are 3 vectors in $\\mathbb{R}^3$`, `是，因为在 $\\mathbb{R}^3$ 中有 3 个向量`),
            t(`Yes, because the first two vectors are linearly independent`, `是，因为前两个向量线性无关`),
            t(`No, because no vector space can be spanned by vectors with integer entries`, `否，因为整数向量不能张成向量空间`),
          ];
          const solution = t(
            `Any linear combination has third component $c_1(0) + c_2(0) + c_3(0) = 0$. Vectors such as $(0, 0, 1)^T$ cannot be reached.`,
            `任意线性组合的第三分量均为 0，如 $(0, 0, 1)^T$ 等向量均无法被表出，故不能张成 $\\mathbb{R}^3$。`,
          );
          return oneOf(rng, prompt, right, wrong, solution);
        }
        const v1 = [1, 0, 0];
        const v2 = [a, 1, 0];
        const v3 = [b, c, 1];
        const prompt = t(
          `Does the set $\\left\\{ ${colVecLatex(v1)}, ${colVecLatex(v2)}, ${colVecLatex(v3)} \\right\\}$ span $\\mathbb{R}^3$?`,
          `向量组 $\\left\\{ ${colVecLatex(v1)}, ${colVecLatex(v2)}, ${colVecLatex(v3)} \\right\\}$ 能否张成 $\\mathbb{R}^3$？`,
        );
        const right = t(
          `Yes, because the matrix has 3 pivot positions (a pivot in every row)`,
          `是，因为矩阵具有 3 个主元位置（每一行都有主元）`,
        );
        const wrong = [
          t(`No, because the vectors are not orthogonal`, `否，因为向量不正交`),
          t(`No, because triangular matrices never span $\\mathbb{R}^3$`, `否，因为三角矩阵对应的向量无法张成 $\\mathbb{R}^3$`),
          t(`Yes, but only because all entries are positive`, `是，但仅仅是因为所有分量为正`),
        ];
        const solution = t(
          `The matrix $[\\mathbf{v}_1 \\; \\mathbf{v}_2 \\; \\mathbf{v}_3]$ is lower triangular with non-zero diagonal entries $1, 1, 1$. It has a pivot in every row, so its columns span $\\mathbb{R}^3$.`,
          `由这三个向量组成的矩阵为下三角阵，对角元全为 1，每一行都含有主元，因此列向量张成 $\\mathbb{R}^3$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

/** linearDependenceAndIndependence covers definition, testing independence via homogeneous system, and finding dependence relations. */
export const linearDependenceAndIndependence: TopicDef = {
  id: "linear-dependence-and-independence",
  title: t("Linear Dependence and Independence", "向量组的线性相关与线性无关"),
  summary: t(
    "Define linear independence via c₁v₁ + ... + cₖvₖ = 0 having only the trivial solution, and detect linear dependence through pivot columns or non-trivial relations.",
    "通过齐次方程 c₁v₁ + ... + cₖvₖ = 0 仅有零解定义线性无关，并通过主元列或非平凡线性关系判定线性相关性。",
  ),
  prerequisites: ["linear-span-of-vectors-in-n-dimensional-euclidean-space"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "test-linear-independence",
      title: t("Testing linear independence of a vector set", "检验向量组的线性相关性"),
      explanation: t(
        "A set of vectors {v₁, ..., vₖ} is linearly independent if c₁v₁ + ... + cₖvₖ = 0 has only the trivial solution c₁ = ... = cₖ = 0. If a non-trivial solution exists, the set is linearly dependent.",
        "若 c₁v₁ + ... + cₖvₖ = 0 仅有零解 c₁ = ... = cₖ = 0，则向量组 {v₁, ..., vₖ} 线性无关；若存在非全零解，则线性相关。",
      ),
      generate(rng) {
        const isDep = rng.bool();
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const c = rng.nonZero(-2, 2);
        let v1: number[];
        let v2: number[];
        let v3: number[];
        if (isDep) {
          v1 = [1, a, 0];
          v2 = [0, 1, b];
          v3 = [c, c * a + 2, 2 * b]; // v3 = c*v1 + 2*v2
        } else {
          v1 = [1, 0, 0];
          v2 = [a, 1, 0];
          v3 = [b, c, 1];
        }
        const prompt = t(
          `Determine whether the set $S = \\left\\{ ${colVecLatex(v1)}, ${colVecLatex(v2)}, ${colVecLatex(v3)} \\right\\}$ in $\\mathbb{R}^3$ is linearly independent or linearly dependent.`,
          `判断 $\\mathbb{R}^3$ 中的向量组 $S = \\left\\{ ${colVecLatex(v1)}, ${colVecLatex(v2)}, ${colVecLatex(v3)} \\right\\}$ 是线性无关还是线性相关。`,
        );
        const right = isDep
          ? t(
              `Linearly dependent, because there exists a non-trivial linear combination equaling $\\mathbf{0}$`,
              `线性相关，因为存在不全为零的数使得线性组合为 $\\mathbf{0}$`,
            )
          : t(
              `Linearly independent, because $c_1\\mathbf{v}_1 + c_2\\mathbf{v}_2 + c_3\\mathbf{v}_3 = \\mathbf{0}$ has only the trivial solution`,
              `线性无关，因为 $c_1\\mathbf{v}_1 + c_2\\mathbf{v}_2 + c_3\\mathbf{v}_3 = \\mathbf{0}$ 只有平凡解（零解）`,
            );
        const wrong = isDep
          ? [
              t(`Linearly independent, because none of the vectors is the zero vector`, `线性无关，因为其中没有零向量`),
              t(`Linearly independent, because there are 3 vectors in $\\mathbb{R}^3$`, `线性无关，因为是 $\\mathbb{R}^3$ 中的 3 个向量`),
              t(`Linearly dependent, but only if all components are non-negative`, `线性相关，但仅在所有分量非负时成立`),
            ]
          : [
              t(
                `Linearly dependent, because 3 vectors always form a dependent set in $\\mathbb{R}^3$`,
                `线性相关，因为 $\\mathbb{R}^3$ 中的 3 个向量必定线性相关`,
              ),
              t(
                `Linearly dependent, because $\\mathbf{v}_1 + \\mathbf{v}_2 = \\mathbf{v}_3$`,
                `线性相关，因为 $\\mathbf{v}_1 + \\mathbf{v}_2 = \\mathbf{v}_3$`,
              ),
              t(`Linearly dependent, because the matrix has determinant 0`, `线性相关，因为矩阵的行列式为 0`),
            ];
        const solution = isDep
          ? t(
              `Row reducing the matrix $[\\mathbf{v}_1 \\; \\mathbf{v}_2 \\; \\mathbf{v}_3]$ yields fewer than 3 pivots (a free variable exists). Hence non-trivial relations exist and the set is linearly dependent.`,
              `对矩阵 $[\\mathbf{v}_1 \\; \\mathbf{v}_2 \\; \\mathbf{v}_3]$ 进行初等行变换可知其主元数小于 3（存在自由未知量），故方程存在非零解，该向量组线性相关。`,
            )
          : t(
              `The matrix $[\\mathbf{v}_1 \\; \\mathbf{v}_2 \\; \\mathbf{v}_3]$ has 3 pivot columns (determinant is 1 $\\neq 0$), so the only solution to the homogeneous equation is the trivial solution. Thus the set is linearly independent.`,
              `矩阵 $[\\mathbf{v}_1 \\; \\mathbf{v}_2 \\; \\mathbf{v}_3]$ 有 3 个主元列（对角线元素全为 1，行列式非零），齐次方程仅有零解，因此向量组线性无关。`,
            );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "linear-dependence-relation-finding",
      title: t("Finding a linear dependence relation", "寻找线性相关关系的非平凡权值"),
      explanation: t(
        "If a vector in a set is a linear combination of the others, rearranging yields a linear dependence relation a₁v₁ + ... + aₖvₖ = 0 with not all weights zero.",
        "若向量组中某个向量是其余向量的线性组合，移项即可得到非平凡线性相关关系 a₁v₁ + ... + aₖvₖ = 0。",
      ),
      generate(rng) {
        const c1 = rng.nonZero(-3, 3);
        const c2 = rng.nonZero(-3, 3);
        const v1 = [1, 0, rng.int(-2, 2)];
        const v2 = [0, 1, rng.int(-2, 2)];
        const v3 = [c1 * v1[0]! + c2 * v2[0]!, c1 * v1[1]! + c2 * v2[1]!, c1 * v1[2]! + c2 * v2[2]!];
        const prompt = t(
          `Given $\\mathbf{v}_1 = ${colVecLatex(v1)}$, $\\mathbf{v}_2 = ${colVecLatex(v2)}$, and $\\mathbf{v}_3 = ${colVecLatex(v3)}$, which relation shows that $\\{\\mathbf{v}_1, \\mathbf{v}_2, \\mathbf{v}_3\\}$ is linearly dependent?`,
          `已知 $\\mathbf{v}_1 = ${colVecLatex(v1)}$，$\\mathbf{v}_2 = ${colVecLatex(v2)}$ 与 $\\mathbf{v}_3 = ${colVecLatex(v3)}$，下列哪个关系式证明了该向量组线性相关？`,
        );
        const right = t(
          `$(${c1})\\mathbf{v}_1 + (${c2})\\mathbf{v}_2 - \\mathbf{v}_3 = \\mathbf{0}$`,
          `$(${c1})\\mathbf{v}_1 + (${c2})\\mathbf{v}_2 - \\mathbf{v}_3 = \\mathbf{0}$`,
        );
        const wrong = [
          t(
            `$(${c1})\\mathbf{v}_1 - (${c2})\\mathbf{v}_2 + \\mathbf{v}_3 = \\mathbf{0}$`,
            `$(${c1})\\mathbf{v}_1 - (${c2})\\mathbf{v}_2 + \\mathbf{v}_3 = \\mathbf{0}$`,
          ),
          t(
            `$(${c2})\\mathbf{v}_1 + (${c1})\\mathbf{v}_2 - \\mathbf{v}_3 = \\mathbf{0}$`,
            `$(${c2})\\mathbf{v}_1 + (${c1})\\mathbf{v}_2 - \\mathbf{v}_3 = \\mathbf{0}$`,
          ),
          t(
            `$\\mathbf{v}_1 + \\mathbf{v}_2 + \\mathbf{v}_3 = \\mathbf{0}$`,
            `$\\mathbf{v}_1 + \\mathbf{v}_2 + \\mathbf{v}_3 = \\mathbf{0}$`,
          ),
        ];
        const solution = t(
          `Since $\\mathbf{v}_3 = (${c1})\\mathbf{v}_1 + (${c2})\\mathbf{v}_2$, subtracting $\\mathbf{v}_3$ gives $(${c1})\\mathbf{v}_1 + (${c2})\\mathbf{v}_2 - \\mathbf{v}_3 = \\mathbf{0}$, which is a non-trivial relation (coefficients are $(${c1}, ${c2}, -1) \\neq (0, 0, 0)$).`,
          `由构造知 $\\mathbf{v}_3 = (${c1})\\mathbf{v}_1 + (${c2})\\mathbf{v}_2$，移项即得 $(${c1})\\mathbf{v}_1 + (${c2})\\mathbf{v}_2 - \\mathbf{v}_3 = \\mathbf{0}$。系数为 $(${c1}, ${c2}, -1)$ 非全零，此式即为非平凡相关关系。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE 3.10: SUBSPACES OF N-DIMENSIONAL SPACE
// ════════════════════════════════════════════════════════════════════════════

/** subspacesOfNDimensionalSpace covers subspace definition, the three axioms, and checking subsets. */
export const subspacesOfNDimensionalSpace: TopicDef = {
  id: "subspaces-of-n-dimensional-space",
  title: t("Subspaces of N-Dimensional Space", "N 维空间子空间的定义与判定"),
  summary: t(
    "Verify whether a subset H of ℝⁿ is a subspace by checking the three axioms: containing the zero vector, closure under addition, and closure under scalar multiplication.",
    "通过验证包含零向量、加法封闭和标量乘法封闭这三个公理，判定 ℝⁿ 的子集是否构成子空间。",
  ),
  prerequisites: ["linear-span-of-vectors-in-n-dimensional-euclidean-space"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "subspace-three-axioms-check",
      title: t("Checking the three subspace axioms", "子空间三公理的检验"),
      explanation: t(
        "A subset H of ℝⁿ is a subspace if and only if: 1. The zero vector 0 is in H; 2. For all u, v in H, u + v is in H; 3. For all u in H and scalar c, cu is in H.",
        "ℝⁿ 的非空子集 H 构成子空间当且仅当满足：1. 零向量 0 ∈ H；2. 对任意 u, v ∈ H，u + v ∈ H（加法封闭）；3. 对任意 u ∈ H 及标量 c，cu ∈ H（数乘封闭）。",
      ),
      generate(rng) {
        const a = rng.nonZero(-5, 5);
        const b = rng.nonZero(-5, 5);
        const c = rng.nonZero(-5, 5);
        const d = rng.nonZero(1, 8);
        const prompt = t(
          `Consider the subsets of $\\mathbb{R}^3$: $W_1 = \\{ (x, y, z) \\mid ${a}x + ${b}y + ${c}z = 0 \\}$, $W_2 = \\{ (x, y, z) \\mid ${a}x + ${b}y + ${c}z = ${d} \\}$, and $W_3 = \\{ (x, y, z) \\mid x \\ge 0 \\}$. Which of these is a subspace of $\\mathbb{R}^3$?`,
          `考虑 $\\mathbb{R}^3$ 的子集：$W_1 = \\{ (x, y, z) \\mid ${a}x + ${b}y + ${c}z = 0 \\}$，$W_2 = \\{ (x, y, z) \\mid ${a}x + ${b}y + ${c}z = ${d} \\}$ 及 $W_3 = \\{ (x, y, z) \\mid x \\ge 0 \\}$。其中哪一个是 $\\mathbb{R}^3$ 的子空间？`,
        );
        const right = t(`Only $W_1$`, `仅有 $W_1$`);
        const wrong = [
          t(`Only $W_2$`, `仅有 $W_2$`),
          t(`Both $W_1$ and $W_2$`, `$W_1$ 与 $W_2$ 都是`),
          t(`All three are subspaces`, `三个都是子空间`),
        ];
        const solution = t(
          `$W_1$ contains $\\mathbf{0}$ and is defined by a homogeneous linear equation, so it is closed under vector addition and scalar multiplication. $W_2$ does not contain the origin (${d} \\neq 0$). $W_3$ fails closure under negative scalar multiplication. Hence only $W_1$ is a subspace.`,
          `$W_1$ 包含原点且由齐次线性方程定义，对向量加法和数乘均封闭，因此是子空间。$W_2$ 不含原点（${d} \\neq 0$）；$W_3$ 对负标量乘法不封闭。故仅 $W_1$ 是子空间。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "span-is-subspace-property",
      title: t("The span of vectors is always a subspace", "向量组的张成空间必为子空间"),
      explanation: t(
        "For any set of vectors {v₁, ..., vₖ} in ℝⁿ, Span{v₁, ..., vₖ} is always a subspace of ℝⁿ.",
        "对 ℝⁿ 中任意向量组 {v₁, ..., vₖ}，其张成空间 Span{v₁, ..., vₖ} 恒为 ℝⁿ 的子空间。",
      ),
      generate(rng) {
        const k = rng.int(2, 9);
        const n = rng.int(3, 9);
        const prompt = t(
          `Let $S = \\{\\mathbf{v}_1, \\dots, \\mathbf{v}_${k}\\}$ be any collection of $${k}$ vectors in $\\mathbb{R}^${n}$. Which statement about $W = \\text{Span}(S)$ is always true?`,
          `设 $S = \\{\\mathbf{v}_1, \\dots, \\mathbf{v}_${k}\\}$ 为 $\\mathbb{R}^${n}$ 中的任意 $${k}$ 个向量构成的向量组。关于 $W = \\text{Span}(S)$，下列哪个说法恒成立？`,
        );
        const right = t(
          `$W$ is always a subspace of $\\mathbb{R}^${n}$, containing $\\mathbf{0}$ and closed under linear combinations`,
          `$W$ 恒为 $\\mathbb{R}^${n}$ 的子空间，包含零向量且对线性组合封闭`,
        );
        const wrong = [
          t(`$W$ is a subspace only if the vectors in $S$ are linearly independent`, `只有当 $S$ 中的向量线性无关时，$W$ 才是子空间`),
          t(`$W$ is a subspace only if $k \\ge ${n}$`, `只有当 $k \\ge ${n}$ 时，$W$ 才是子空间`),
          t(`$W = \\mathbb{R}^${n}$ regardless of which vectors are in $S$`, `无论 $S$ 中是何向量，$W$ 恒等于 $\\mathbb{R}^${n}$`),
        ];
        const solution = t(
          `By definition, the linear span of any set of vectors in $\\mathbb{R}^${n}$ satisfies all three subspace axioms: it contains $\\mathbf{0}$ (set all weights to 0), and any linear combination of linear combinations is again a linear combination.`,
          `根据定义，任何向量组的线性张成空间都满足子空间三公理：取系数全为 0 即得 $\\mathbf{0}$，且线性组合的线性组合依然属于张成空间，故恒为子空间。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

/** subspacesOfNDimensionalSpaceGeometricInterpretation covers geometric interpretation of subspaces as lines/planes/hyperplanes through the origin. */
export const subspacesOfNDimensionalSpaceGeometricInterpretation: TopicDef = {
  id: "subspaces-of-n-dimensional-space-geometric-interpretation",
  title: t("Subspaces of N-Dimensional Space: Geometric Interpretation", "子空间的几何意义"),
  summary: t(
    "Interpret subspaces of ℝⁿ geometrically as points, lines, planes, and hyperplanes passing through the origin.",
    "从几何角度理解 ℝⁿ 的子空间：过原点的单点、直线、平面及超平面。",
  ),
  prerequisites: ["subspaces-of-n-dimensional-space"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "geometric-subspaces-in-r3",
      title: t("Geometric classification of subspaces in ℝ³", "ℝ³ 中子空间的几何分类"),
      explanation: t(
        "The only subspaces of ℝ³ are: the origin {0} (0-D), any line through the origin (1-D), any plane through the origin (2-D), and ℝ³ itself (3-D).",
        "ℝ³ 的子空间仅有四类几何对象：零向量单点 {0}（0 维）、过原点的任意直线（1 维）、过原点的任意平面（2 维）以及整个 ℝ³（3 维）。",
      ),
      generate(rng) {
        const dim = rng.pick([1, 2]);
        const passOrigin = rng.bool();
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const c = rng.nonZero(-3, 3);
        const d = passOrigin ? 0 : rng.pick([-4, -2, 2, 4]);
        if (dim === 2) {
          const prompt = t(
            `Consider the geometric object in $\\mathbb{R}^3$ defined by $P: ${a}x + ${b}y + ${c}z = ${d}$. Is $P$ a subspace of $\\mathbb{R}^3$?`,
            `考虑 $\\mathbb{R}^3$ 中由方程 $P: ${a}x + ${b}y + ${c}z = ${d}$ 定义的几何对象。$P$ 是否是 $\\mathbb{R}^3$ 的子空间？`,
          );
          const right = passOrigin
            ? t(`Yes, because it is a plane passing through the origin`, `是，因为它是过原点的平面`)
            : t(
                `No, because it is an affine plane that does not pass through the origin (${d} \\neq 0$)`,
                `否，因为它是不过原点的仿射平面（${d} \\neq 0$）`,
              );
          const wrong = passOrigin
            ? [
                t(`No, because only lines can be subspaces`, `否，因为只有直线才能构成子空间`),
                t(`No, because it does not contain the unit vectors`, `否，因为不包含标准基向量`),
                t(`Yes, but only if $x, y, z$ are all positive`, `是，但仅当 $x, y, z$ 全为正数时`),
              ]
            : [
                t(`Yes, because every plane in $\\mathbb{R}^3$ is a subspace`, `是，因为 $\\mathbb{R}^3$ 中的所有平面都是子空间`),
                t(`Yes, because the plane has dimension 2`, `是，因为该平面的维数是 2`),
                t(`No, because planes have too many dimensions to be subspaces`, `否，因为平面的维数太高无法构成子空间`),
              ];
          const solution = passOrigin
            ? t(
                `The equation is homogeneous ($d = 0$), so the plane contains the origin $(0, 0, 0)$. Any plane through the origin is a 2-dimensional subspace of $\\mathbb{R}^3$.`,
                `该方程为齐次方程（$d = 0$），平面经过原点 $(0,0,0)$。过原点的平面是 $\\mathbb{R}^3$ 的二维子空间。`,
              )
            : t(
                `Since $(0, 0, 0)$ gives $0 \\neq ${d}$, the plane does not contain the zero vector. Therefore it violates the first subspace axiom and is not a subspace.`,
                `将原点 $(0,0,0)$ 代入得到 $0 \\neq ${d}$，故该平面不含零向量，违反子空间第一公理，不是子空间。`,
              );
          return oneOf(rng, prompt, right, wrong, solution);
        }
        const v = [a, b, c];
        const offset = passOrigin ? [0, 0, 0] : [1, 0, 0];
        const prompt = t(
          `In $\\mathbb{R}^3$, the line $L$ parameterized by $\\mathbf{r}(t) = ${colVecLatex(offset)} + t ${colVecLatex(v)}$ is a subspace of $\\mathbb{R}^3$ if and only if:`,
          `在 $\\mathbb{R}^3$ 中，由参数方程 $\\mathbf{r}(t) = ${colVecLatex(offset)} + t ${colVecLatex(v)}$ 表示的直线 $L$ 构成子空间当且仅当：`,
        );
        const right = t(`The line passes through the origin $(0, 0, 0)$`, `该直线经过原点 $(0, 0, 0)$`);
        const wrong = [
          t(`The line is parallel to the z-axis`, `该直线平行于 z 轴`),
          t(`The direction vector has unit length`, `方向向量具有单位长度`),
          t(`The parameter $t$ is strictly positive`, `参数 $t$ 严格为正数`),
        ];
        const solution = t(
          `Every subspace must contain the zero vector. A line in $\\mathbb{R}^3$ is a subspace if and only if it passes through the origin.`,
          `每一个子空间都必须包含零向量。$\\mathbb{R}^3$ 中的直线构成子空间当且仅当它经过原点。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "hyperplane-subspaces-rn",
      title: t("Hyperplanes through the origin in ℝⁿ", "ℝⁿ 中过原点的超平面子空间"),
      explanation: t(
        "In ℝⁿ, a single linear equation a₁x₁ + ... + aₙxₙ = k defines an (n-1)-dimensional hyperplane. It is a subspace if and only if k = 0.",
        "在 ℝⁿ 中，单一线性方程 a₁x₁ + ... + aₙxₙ = k 定义一个 (n-1) 维超平面。它构成子空间当且仅当常数项 k = 0。",
      ),
      generate(rng) {
        const n = rng.int(4, 6);
        const coeffs = Array.from({ length: n }, () => rng.nonZero(-3, 3));
        const eqLhs = coeffs.map((c, i) => `${c > 0 && i > 0 ? "+" : ""}${c}x_{${i + 1}}`).join(" ");
        const prompt = t(
          `The hyperplane in $\\mathbb{R}^${n}$ defined by $H = \\left\\{ (x_1, \\dots, x_${n}) \\mid ${eqLhs} = k \\right\\}$ forms a subspace of $\\mathbb{R}^${n}$ precisely when:`,
          `在 $\\mathbb{R}^${n}$ 中，由 $H = \\left\\{ (x_1, \\dots, x_${n}) \\mid ${eqLhs} = k \\right\\}$ 定义的超平面构成子空间，充要条件是：`,
        );
        const right = t(`$k = 0$`, `$k = 0$`);
        const wrong = [t(`$k = 1$`, `$k = 1$`), t(`$k = ${coeffs[0]}$`, `$k = ${coeffs[0]}$`), t(`$k > 0$`, `$k > 0$`)];
        const solution = t(
          `A subset must contain the zero vector $\\mathbf{0} = (0, \\dots, 0)$. Evaluating the equation at $\\mathbf{0}$ gives $0 = k$, so $k$ must equal $0$.`,
          `子空间必须包含零向量 $\\mathbf{0} = (0, \\dots, 0)$。将零向量代入方程左边得 0，故必须有 $k = 0$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

/** theColumnSpaceOfAMatrix covers column space definition, ambient space, and testing membership via Ax = b. */
export const theColumnSpaceOfAMatrix: TopicDef = {
  id: "the-column-space-of-a-matrix",
  title: t("The Column Space of a Matrix", "矩阵的列空间 Col(A)"),
  summary: t(
    "Define the column space Col(A) as the span of the columns of matrix A, identify its ambient space, and relate membership in Col(A) to the consistency of Ax = b.",
    "掌握矩阵列空间 Col(A) 作为矩阵列向量张成空间的定义，明确其所在空间，并建立向量属于列空间与线性方程组 Ax = b 相容性的联系。",
  ),
  prerequisites: ["subspaces-of-n-dimensional-space"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "column-space-ambient-space-dimension",
      title: t("Ambient space of Col(A)", "列空间 Col(A) 的所在空间"),
      explanation: t(
        "For an m × n matrix A, each column has m entries, so Col(A) is a subspace of ℝᵐ.",
        "对于 m × n 矩阵 A，其每个列向量包含 m 个分量，因此列空间 Col(A) 是 ℝᵐ 的子空间。",
      ),
      generate(rng) {
        const m = rng.int(2, 6);
        const n = rng.int(2, 6);
        const prompt = t(
          `Let $A$ be a $${m} \\times ${n}$ matrix. The column space $\\text{Col}(A)$ is a subspace of which Euclidean space?`,
          `设 $A$ 为一个 $${m} \\times ${n}$ 矩阵。其列空间 $\\text{Col}(A)$ 是哪一个欧几里得空间的子空间？`,
        );
        const right = t(`$\\mathbb{R}^${m}$`, `$\\mathbb{R}^${m}$`);
        const wrong = [
          t(`$\\mathbb{R}^${n}$`, `$\\mathbb{R}^${n}$`),
          t(`$\\mathbb{R}^{${m + n}}$`, `$\\mathbb{R}^{${m + n}}$`),
          t(`$\\mathbb{R}^{${m * n}}$`, `$\\mathbb{R}^{${m * n}}$`),
        ];
        const solution = t(
          `Each column of an $m \\times n$ matrix is a vector with $m$ rows, belonging to $\\mathbb{R}^m$. The column space $\\text{Col}(A)$ is the span of these columns, so $\\text{Col}(A) \\subseteq \\mathbb{R}^m$.`,
          `$m \\times n$ 矩阵的每个列向量含有 $m$ 个元素，属于 $\\mathbb{R}^m$。列空间是这些列向量的张成空间，因此 $\\text{Col}(A)$ 是 $\\mathbb{R}^m$ 的子空间。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "membership-in-column-space",
      title: t("Determining if b is in Col(A)", "判定向量 b 是否属于列空间 Col(A)"),
      explanation: t(
        "A vector b is in Col(A) if and only if the linear system Ax = b has a solution (i.e. is consistent).",
        "向量 b 属于列空间 Col(A)，当且仅当线性方程组 Ax = b 有解（即方程组相容）。",
      ),
      generate(rng) {
        const inCol = rng.bool();
        const a11 = 1;
        const a21 = rng.int(-2, 2);
        const a31 = rng.int(-2, 2);
        const a12 = 0;
        const a22 = 1;
        const a32 = rng.int(-2, 2);
        const x1 = rng.int(-3, 3);
        const x2 = rng.int(-3, 3);
        const delta = inCol ? 0 : rng.pick([-3, -2, 2, 3]);
        const b = [a11 * x1 + a12 * x2, a21 * x1 + a22 * x2, a31 * x1 + a32 * x2 + delta];
        const mat = [
          [a11, a12],
          [a21, a22],
          [a31, a32],
        ];
        const prompt = t(
          `Let $A = ${matLatex(mat)}$ and $\\mathbf{b} = ${colVecLatex(b)}$. Does $\\mathbf{b}$ belong to $\\text{Col}(A)$?`,
          `设 $A = ${matLatex(mat)}$ 且 $\\mathbf{b} = ${colVecLatex(b)}$。向量 $\\mathbf{b}$ 是否属于 $\\text{Col}(A)$？`,
        );
        const right = inCol
          ? t(
              `Yes, because the system $A\\mathbf{x} = \\mathbf{b}$ is consistent with $\\mathbf{x} = ${colVecLatex([x1, x2])}$`,
              `是，因为方程组 $A\\mathbf{x} = \\mathbf{b}$ 相容，解为 $\\mathbf{x} = ${colVecLatex([x1, x2])}$`,
            )
          : t(
              `No, because the system $A\\mathbf{x} = \\mathbf{b}$ is inconsistent`,
              `否，因为方程组 $A\\mathbf{x} = \\mathbf{b}$ 矛盾无解`,
            );
        const wrong = inCol
          ? [
              t(`No, because $A$ is not a square matrix`, `否，因为 $A$ 不是方阵`),
              t(
                `No, because $\\mathbf{b}$ is in $\\mathbb{R}^3$ while the columns have 2 entries`,
                `否，因为 $\\mathbf{b} \\in \\mathbb{R}^3$ 而列向量只有 2 个元素`,
              ),
              t(`Yes, but only if $\\mathbf{x} = \\mathbf{0}$`, `是，但仅当 $\\mathbf{x} = \\mathbf{0}$ 时`),
            ]
          : [
              t(
                `Yes, because every vector in $\\mathbb{R}^3$ is in $\\text{Col}(A)$`,
                `是，因为 $\\mathbb{R}^3$ 中的每个向量都在 $\\text{Col}(A)$ 中`,
              ),
              t(`Yes, with solution $\\mathbf{x} = ${colVecLatex([x1, x2])}$`, `是，其解为 $\\mathbf{x} = ${colVecLatex([x1, x2])}$`),
              t(`No, because $\\text{Col}(A)$ is always the zero subspace`, `否，因为 $\\text{Col}(A)$ 始终是零子空间`),
            ];
        const solution = inCol
          ? t(
              `Row reducing the augmented matrix $[A \\mid \\mathbf{b}]$ shows that row 3 is consistent with $x_1 = ${x1}$ and $x_2 = ${x2}$. Therefore $\\mathbf{b} \\in \\text{Col}(A)$.`,
              `对增广矩阵 $[A \\mid \\mathbf{b}]$ 进行初等行变换，得到相容解 $x_1 = ${x1}$，$x_2 = ${x2}$。因此 $\\mathbf{b} \\in \\text{Col}(A)$。`,
            )
          : t(
              `Row reducing $[A \\mid \\mathbf{b}]$ yields the system $x_1 = ${b[0]}$, $x_2 = ${b[1]} - (${a21})x_1$, but the third equation requires $(${a31})x_1 + (${a32})x_2 = ${b[2]}$, which fails. The system is inconsistent, so $\\mathbf{b} \\notin \\text{Col}(A)$.`,
              `对增广矩阵 $[A \\mid \\mathbf{b}]$ 进行初等行变换后，第三行导出矛盾等式，方程组无解。因此 $\\mathbf{b} \\notin \\text{Col}(A)$。`,
            );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

/** theNullSpaceOfAMatrix covers null space definition, ambient space, and testing membership via Av = 0. */
export const theNullSpaceOfAMatrix: TopicDef = {
  id: "the-null-space-of-a-matrix",
  title: t("The Null Space of a Matrix", "矩阵的零空间/核 Null(A)"),
  summary: t(
    "Define the null space Null(A) as the solution set of Ax = 0, identify its ambient space, and test whether a vector belongs to Null(A).",
    "掌握矩阵零空间（核）Null(A) 作为齐次方程 Ax = 0 解集的定义，明确其所在空间，并检验向量是否属于 Null(A)。",
  ),
  prerequisites: ["subspaces-of-n-dimensional-space"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "null-space-ambient-space",
      title: t("Ambient space of Null(A)", "零空间 Null(A) 的所在空间"),
      explanation: t(
        "For an m × n matrix A, the equation Ax = 0 requires x to have n components, so Null(A) is a subspace of ℝⁿ.",
        "对于 m × n 矩阵 A，方程 Ax = 0 中未知向量 x 必有 n 个分量，因此 Null(A) 是 ℝⁿ 的子空间。",
      ),
      generate(rng) {
        const m = rng.int(2, 6);
        const n = rng.int(2, 6);
        const prompt = t(
          `Let $A$ be an $${m} \\times ${n}$ matrix. In which Euclidean space does the null space $\\text{Null}(A)$ reside?`,
          `设 $A$ 为一个 $${m} \\times ${n}$ 矩阵。其零空间 $\\text{Null}(A)$ 是哪一个空间的子空间？`,
        );
        const right = t(`$\\mathbb{R}^${n}$`, `$\\mathbb{R}^${n}$`);
        const wrong = [
          t(`$\\mathbb{R}^${m}$`, `$\\mathbb{R}^${m}$`),
          t(`$\\mathbb{R}^{${m - n > 0 ? m - n : 1}}$`, `$\\mathbb{R}^{${m - n > 0 ? m - n : 1}}$`),
          t(`$\\mathbb{R}^{${m * n}}$`, `$\\mathbb{R}^{${m * n}}$`),
        ];
        const solution = t(
          `Matrix-vector multiplication $A\\mathbf{x}$ is defined only when $\\mathbf{x} \\in \\mathbb{R}^n$. The solutions to $A\\mathbf{x} = \\mathbf{0}$ are vectors in $\\mathbb{R}^n$, so $\\text{Null}(A)$ is a subspace of $\\mathbb{R}^n$.`,
          `矩阵乘法 $A\\mathbf{x}$ 仅在 $\\mathbf{x} \\in \\mathbb{R}^n$ 时有定义。齐次方程 $A\\mathbf{x} = \\mathbf{0}$ 的解是 $\\mathbb{R}^n$ 中的向量，因此 $\\text{Null}(A)$ 是 $\\mathbb{R}^n$ 的子空间。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "test-membership-in-null-space",
      title: t("Testing membership in Null(A)", "检验向量是否属于零空间 Null(A)"),
      explanation: t("A vector v belongs to Null(A) if and only if Av = 0.", "向量 v 属于 Null(A) 当且仅当 Av = 0。"),
      generate(rng) {
        const inNull = rng.bool();
        const k1 = rng.int(-2, 2);
        const k2 = rng.nonZero(-2, 2);
        const mult = rng.nonZero(-2, 2);
        const cand = inNull ? [mult * k1, mult * k2, mult] : [mult * k1 + 1, mult * k2, mult];
        const A = [
          [1, 0, -k1],
          [0, 1, -k2],
        ];
        const prompt = t(
          `Let $A = ${matLatex(A)}$. Does $\\mathbf{v} = ${colVecLatex(cand)}$ belong to $\\text{Null}(A)$?`,
          `设 $A = ${matLatex(A)}$。向量 $\\mathbf{v} = ${colVecLatex(cand)}$ 是否属于 $\\text{Null}(A)$？`,
        );
        const prod = [cand[0]! - k1 * cand[2]!, cand[1]! - k2 * cand[2]!];
        const right = inNull
          ? t(`Yes, because $A\\mathbf{v} = ${colVecLatex([0, 0])}$`, `是，因为 $A\\mathbf{v} = ${colVecLatex([0, 0])}$`)
          : t(
              `No, because $A\\mathbf{v} = ${colVecLatex(prod)} \\neq \\mathbf{0}$`,
              `否，因为 $A\\mathbf{v} = ${colVecLatex(prod)} \\neq \\mathbf{0}$`,
            );
        const wrong = inNull
          ? [
              t(`No, because $\\mathbf{v} \\neq \\mathbf{0}$`, `否，因为 $\\mathbf{v} \\neq \\mathbf{0}$`),
              t(`No, because $A$ has full row rank`, `否，因为 $A$ 行满秩`),
              t(`Yes, but only if $A$ is invertible`, `是，但仅当 $A$ 可逆时`),
            ]
          : [
              t(`Yes, because $A\\mathbf{v} = ${colVecLatex([0, 0])}$`, `是，因为 $A\\mathbf{v} = ${colVecLatex([0, 0])}$`),
              t(`Yes, because $\\mathbf{v} \\in \\mathbb{R}^3$`, `是，因为 $\\mathbf{v} \\in \\mathbb{R}^3$`),
              t(`No, because $\\text{Null}(A)$ contains only the zero vector`, `否，因为 $\\text{Null}(A)$ 仅含零向量`),
            ];
        const solution = inNull
          ? t(
              `Computing the product:\n$$A\\mathbf{v} = ${matLatex(A)} ${colVecLatex(cand)} = ${colVecLatex([0, 0])}$$\nSince $A\\mathbf{v} = \\mathbf{0}$, $\\mathbf{v} \\in \\text{Null}(A)$.`,
              `计算矩阵与向量乘积：\n$$A\\mathbf{v} = ${matLatex(A)} ${colVecLatex(cand)} = ${colVecLatex([0, 0])}$$\n因 $A\\mathbf{v} = \\mathbf{0}$，故 $\\mathbf{v} \\in \\text{Null}(A)$。`,
            )
          : t(
              `Computing the product:\n$$A\\mathbf{v} = ${matLatex(A)} ${colVecLatex(cand)} = ${colVecLatex(prod)}$$\nSince the result is not the zero vector, $\\mathbf{v} \\notin \\text{Null}(A)$.`,
              `计算矩阵与向量乘积：\n$$A\\mathbf{v} = ${matLatex(A)} ${colVecLatex(cand)} = ${colVecLatex(prod)}$$\n结果不是零向量，故 $\\mathbf{v} \\notin \\text{Null}(A)$。`,
            );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE 3.11: BASES OF N-DIMENSIONAL SPACE
// ════════════════════════════════════════════════════════════════════════════

/** findingABasisOfASpan covers the definition of a basis and extracting a basis from a spanning set. */
export const findingABasisOfASpan: TopicDef = {
  id: "finding-a-basis-of-a-span",
  title: t("Finding a Basis of a Span", "求向量张成空间的基"),
  summary: t(
    "Define a basis as a linearly independent spanning set and extract a basis from a collection of spanning vectors by locating pivot columns.",
    "掌握基作为线性无关张成集的定义，并通过确定主元列从一组张成向量中提取出基。",
  ),
  prerequisites: ["linear-dependence-and-independence"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "basis-definition-criteria",
      title: t("Criteria for a basis of a subspace", "子空间基的判定准则"),
      explanation: t(
        "A set of vectors ℬ = {b₁, ..., bₖ} is a basis for a subspace H if: 1. ℬ is linearly independent; and 2. Span(ℬ) = H.",
        "向量集 ℬ = {b₁, ..., bₖ} 是子空间 H 的一组基，当且仅当满足：1. ℬ 线性无关；2. Span(ℬ) = H（张成 H）。",
      ),
      generate(rng) {
        const k = rng.int(2, 8);
        const n = rng.int(k, 12);
        const prompt = t(
          `Let $H$ be a $${k}$-dimensional subspace of $\\mathbb{R}^${n}$. What two conditions must a set of vectors $\\mathcal{B} = \\{\\mathbf{v}_1, \\dots, \\mathbf{v}_${k}\\}$ satisfy to be a basis for $H$?`,
          `设 $H$ 为 $\\mathbb{R}^${n}$ 的一个 $${k}$ 维子空间。向量组 $\\mathcal{B} = \\{\\mathbf{v}_1, \\dots, \\mathbf{v}_${k}\\}$ 成为 $H$ 的一组基必须满足哪两个条件？`,
        );
        const right = t(
          `$\\mathcal{B}$ must be linearly independent, and $\\text{Span}(\\mathcal{B}) = H$`,
          `$\\mathcal{B}$ 必须线性无关，且 $\\text{Span}(\\mathcal{B}) = H$`,
        );
        const wrong = [
          t(
            `$\\mathcal{B}$ must be orthogonal, and all vectors must have unit length`,
            `$\\mathcal{B}$ 必须正交，且所有向量必须为单位向量`,
          ),
          t(
            `$\\mathcal{B}$ must span all of $\\mathbb{R}^${n}$, and $k$ must equal $${n}$`,
            `$\\mathcal{B}$ 必须张成整个 $\\mathbb{R}^${n}$，且 $k$ 必须等于 $${n}$`,
          ),
          t(
            `The vectors in $\\mathcal{B}$ must have non-zero entries and be pairwise linearly independent`,
            `$\\mathcal{B}$ 中的向量分量全非零且两两线性无关`,
          ),
        ];
        const solution = t(
          `By definition, a basis of a subspace $H$ is a linearly independent subset of $H$ that spans $H$. Orthogonality or unit length is not required for a general basis.`,
          `根据定义，子空间 $H$ 的基是 $H$ 的一个线性无关且能张成 $H$ 的子集。一般基并不要求正交或单位长度。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "extract-basis-from-spanning-set",
      title: t("Extracting a basis from a spanning set", "从张成向量组中提取基"),
      explanation: t(
        "To find a basis for W = Span{v₁, ..., vₖ}, form the matrix with these vectors as columns and row reduce. The columns corresponding to the pivot columns form a basis for W.",
        "求 W = Span{v₁, ..., vₖ} 的基，将这些向量作为列构成矩阵并进行行化简，主元所在的原列向量即构成 W 的一组基。",
      ),
      generate(rng) {
        const a = rng.nonZero(-2, 2);
        const b = rng.nonZero(-2, 2);
        const c = rng.nonZero(-2, 2);
        const v1 = [1, 0, a];
        const v2 = [0, 1, b];
        const v3 = [c, 2 * c, c * a + 2 * c * b]; // v3 = c*v1 + 2c*v2 (redundant)
        const prompt = t(
          `Find a basis for the subspace $W = \\text{Span}\\left\\{ \\mathbf{v}_1 = ${colVecLatex(v1)}, \\mathbf{v}_2 = ${colVecLatex(v2)}, \\mathbf{v}_3 = ${colVecLatex(v3)} \\right\\}$.`,
          `求子空间 $W = \\text{Span}\\left\\{ \\mathbf{v}_1 = ${colVecLatex(v1)}, \\mathbf{v}_2 = ${colVecLatex(v2)}, \\mathbf{v}_3 = ${colVecLatex(v3)} \\right\\}$ 的一组基。`,
        );
        const right = t(`$\\{\\mathbf{v}_1, \\mathbf{v}_2\\}$`, `$\\{\\mathbf{v}_1, \\mathbf{v}_2\\}$`);
        const wrong = [
          t(`$\\{\\mathbf{v}_1, \\mathbf{v}_2, \\mathbf{v}_3\\}$`, `$\\{\\mathbf{v}_1, \\mathbf{v}_2, \\mathbf{v}_3\\}$`),
          t(`$\\{\\mathbf{v}_3\\}$`, `$\\{\\mathbf{v}_3\\}$`),
          t(`$\\{\\mathbf{v}_1 + \\mathbf{v}_2 + \\mathbf{v}_3\\}$`, `$\\{\\mathbf{v}_1 + \\mathbf{v}_2 + \\mathbf{v}_3\\}$`),
        ];
        const solution = t(
          `Form the matrix $[\\mathbf{v}_1 \\; \\mathbf{v}_2 \\; \\mathbf{v}_3]$. Row reduction reveals pivot columns in columns 1 and 2, while $\\mathbf{v}_3 = (${c})\\mathbf{v}_1 + (${2 * c})\\mathbf{v}_2$. Removing redundant $\\mathbf{v}_3$ leaves the linearly independent spanning set $\\{\\mathbf{v}_1, \\mathbf{v}_2\\}$, which is a basis.`,
          `将向量作为列构成矩阵 $[\\mathbf{v}_1 \\; \\mathbf{v}_2 \\; \\mathbf{v}_3]$。行化简显示主元位于第 1、2 列，而 $\\mathbf{v}_3 = (${c})\\mathbf{v}_1 + (${2 * c})\\mathbf{v}_2$ 为多余向量。剔除冗余向量后，剩下的线性无关张成组 $\\{\\mathbf{v}_1, \\mathbf{v}_2\\}$ 即为 $W$ 的一组基。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

/** findingABasisOfTheColumnSpaceOfAMatrix covers pivot column method for Col(A) and selecting columns of original matrix. */
export const findingABasisOfTheColumnSpaceOfAMatrix: TopicDef = {
  id: "finding-a-basis-of-the-column-space-of-a-matrix",
  title: t("Finding a Basis of the Column Space of a Matrix", "求矩阵列空间的基"),
  summary: t(
    "Locate the pivot columns of the row echelon form of A, and select the corresponding columns of the original matrix A to form a basis for Col(A).",
    "通过矩阵阶梯形确定主元列，并选取原矩阵 A 中对应的主元列构成 Col(A) 的基。",
  ),
  prerequisites: ["finding-a-basis-of-a-span", "the-column-space-of-a-matrix"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "basis-col-a-original-pivot-columns",
      title: t("Pivot columns of A form a basis for Col(A)", "原矩阵的主元列构成 Col(A) 的基"),
      explanation: t(
        "Row operations preserve linear dependence relations among columns. The pivot columns of the original matrix A (not the echelon form) form a basis for Col(A).",
        "初等行变换保持列向量之间的线性相关关系。原矩阵 A（而非阶梯形矩阵）中对应于主元列的列向量构成 Col(A) 的一组基。",
      ),
      generate(rng) {
        const k1 = rng.int(-2, 2);
        const k2 = rng.int(-2, 2);
        const mult = rng.nonZero(-2, 2);
        const col1 = [mult, 2 * mult, -mult];
        const col2 = [0, mult, 2 * mult];
        const col3 = [k1 * col1[0]! + k2 * col2[0]!, k1 * col1[1]! + k2 * col2[1]!, k1 * col1[2]! + k2 * col2[2]!];
        const A = [
          [col1[0]!, col2[0]!, col3[0]!],
          [col1[1]!, col2[1]!, col3[1]!],
          [col1[2]!, col2[2]!, col3[2]!],
        ];
        const prompt = t(
          `Given matrix $A = ${matLatex(A)}$, which has reduced row echelon form $\\text{RREF}(A) = \\begin{pmatrix} 1 & 0 & ${k1} \\\\ 0 & 1 & ${k2} \\\\ 0 & 0 & 0 \\end{pmatrix}$, find a basis for $\\text{Col}(A)$.`,
          `已知矩阵 $A = ${matLatex(A)}$，其简化行阶梯形为 $\\text{RREF}(A) = \\begin{pmatrix} 1 & 0 & ${k1} \\\\ 0 & 1 & ${k2} \\\\ 0 & 0 & 0 \\end{pmatrix}$，求 $\\text{Col}(A)$ 的一组基。`,
        );
        const right = t(
          `$\\left\\{ ${colVecLatex(col1)}, ${colVecLatex(col2)} \\right\\}$`,
          `$\\left\\{ ${colVecLatex(col1)}, ${colVecLatex(col2)} \\right\\}$`,
        );
        const wrong = [
          t(
            `$\\left\\{ ${colVecLatex([1, 0, 0])}, ${colVecLatex([0, 1, 0])} \\right\\}$`,
            `$\\left\\{ ${colVecLatex([1, 0, 0])}, ${colVecLatex([0, 1, 0])} \\right\\}$`,
          ),
          t(
            `$\\left\\{ ${colVecLatex(col1)}, ${colVecLatex(col2)}, ${colVecLatex(col3)} \\right\\}$`,
            `$\\left\\{ ${colVecLatex(col1)}, ${colVecLatex(col2)}, ${colVecLatex(col3)} \\right\\}$`,
          ),
          t(`$\\left\\{ ${colVecLatex(col3)} \\right\\}$`, `$\\left\\{ ${colVecLatex(col3)} \\right\\}$`),
        ];
        const solution = t(
          `The pivot positions are in columns 1 and 2 of $\\text{RREF}(A)$. A basis for $\\text{Col}(A)$ consists of the corresponding columns 1 and 2 of the *original* matrix $A$, not the columns of $\\text{RREF}(A)$. Thus the basis is $\\{${colVecLatex(col1)}, ${colVecLatex(col2)}\\}$.`,
          `$\\text{RREF}(A)$ 的主元位于第 1 列和第 2 列。$\\text{Col}(A)$ 的基必须由*原矩阵* $A$ 的第 1、2 列构成，而不是阶梯形矩阵的列。因此基为 $\\{${colVecLatex(col1)}, ${colVecLatex(col2)}\\}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "why-original-columns-not-echelon",
      title: t("Why original columns must be used for Col(A)", "为什么必须使用原矩阵的列向量"),
      explanation: t(
        "Row operations change the column space of a matrix: Col(A) ≠ Col(RREF(A)) in general, although their dimensions and column dependence relations are identical.",
        "初等行变换通常会改变矩阵的列空间：一般情况下 Col(A) ≠ Col(RREF(A))，尽管两者的维数与列相关关系完全相同。",
      ),
      generate(rng) {
        const m = rng.int(3, 8);
        const n = rng.int(3, 8);
        const prompt = t(
          `For a $${m} \\times ${n}$ matrix $A$ and its echelon form $R$, why must we select pivot columns of the original matrix $A$ (instead of the columns of $R$) to form a basis for $\\text{Col}(A)$?`,
          `对于 $${m} \\times ${n}$ 矩阵 $A$ 及其阶梯形 $R$，在求 $\\text{Col}(A)$ 的基时，为什么必须选取原矩阵 $A$ 的主元列（而不是 $R$ 的列）？`,
        );
        const right = t(
          `Row operations generally change the column space, so $\\text{Col}(A) \\neq \\text{Col}(R)$ in general`,
          `初等行变换通常会改变列空间，因此通常 $\\text{Col}(A) \\neq \\text{Col}(R)$`,
        );
        const wrong = [
          t(
            `Row operations change the null space, so $\\text{Null}(A) \\neq \\text{Null}(R)$`,
            `初等行变换会改变零空间，因此 $\\text{Null}(A) \\neq \\text{Null}(R)$`,
          ),
          t(`The columns of $R$ are never linearly independent`, `矩阵 $R$ 的列向量永远线性相关`),
          t(`The dimensions of $\\text{Col}(A)$ and $\\text{Col}(R)$ are different`, `$\\text{Col}(A)$ 与 $\\text{Col}(R)$ 的维数不同`),
        ];
        const solution = t(
          `Elementary row operations modify linear combinations of rows, which preserves the null space and linear dependencies among columns, but alters the actual column space. Hence $\\text{Col}(A) \\neq \\text{Col}(R)$, and we must take columns from $A$.`,
          `初等行变换是对行向量做线性运算，保持了零空间以及列之间的线性相关性，但改变了列向量所张成的具体空间。故 $\\text{Col}(A) \\neq \\text{Col}(R)$，必须选用原矩阵 $A$ 的列。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

/** findingABasisOfTheNullSpaceOfAMatrix covers solving Ax = 0, parametric vector form, and reading off basis vectors. */
export const findingABasisOfTheNullSpaceOfAMatrix: TopicDef = {
  id: "finding-a-basis-of-the-null-space-of-a-matrix",
  title: t("Finding a Basis of the Null Space of a Matrix", "求矩阵零空间的基"),
  summary: t(
    "Express the general solution of Ax = 0 in parametric vector form and extract the vectors attached to each free variable to form a basis of Null(A).",
    "将 Ax = 0 的通解写成参数向量形式，提取每个自由未知量对应的向量构成 Null(A) 的一组基。",
  ),
  prerequisites: ["the-null-space-of-a-matrix"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "basis-null-space-single-free-var",
      title: t("Basis of Null(A) with one free variable", "含一个自由变量的 Null(A) 的基"),
      explanation: t(
        "For Ax = 0 with one free variable x₃, expressing the basic variables in terms of x₃ yields x = x₃ v. The single vector v forms a basis for Null(A).",
        "对于含一个自由未知量 x₃ 的齐次方程组 Ax = 0，将主元未知量用 x₃ 表示得到 x = x₃ v。该向量 v 即构成 Null(A) 的一组基。",
      ),
      generate(rng) {
        const c1 = rng.nonZero(-3, 3);
        const c2 = rng.nonZero(-3, 3);
        const rref = [
          [1, 0, c1],
          [0, 1, c2],
        ];
        const basisVec = [-c1, -c2, 1];
        const prompt = t(
          `A matrix $A$ has reduced row echelon form $\\text{RREF}(A) = ${matLatex(rref)}$. Find a basis for $\\text{Null}(A)$.`,
          `矩阵 $A$ 的简化行阶梯形为 $\\text{RREF}(A) = ${matLatex(rref)}$。求 $\\text{Null}(A)$ 的一组基。`,
        );
        const right = t(`$\\left\\{ ${colVecLatex(basisVec)} \\right\\}$`, `$\\left\\{ ${colVecLatex(basisVec)} \\right\\}$`);
        const wrong = [
          t(`$\\left\\{ ${colVecLatex([c1, c2, 1])} \\right\\}$`, `$\\left\\{ ${colVecLatex([c1, c2, 1])} \\right\\}$`),
          t(`$\\left\\{ ${colVecLatex([-c1, -c2, 0])} \\right\\}$`, `$\\left\\{ ${colVecLatex([-c1, -c2, 0])} \\right\\}$`),
          t(
            `$\\left\\{ ${colVecLatex([1, 0, 0])}, ${colVecLatex([0, 1, 0])} \\right\\}$`,
            `$\\left\\{ ${colVecLatex([1, 0, 0])}, ${colVecLatex([0, 1, 0])} \\right\\}$`,
          ),
        ];
        const solution = t(
          `The homogeneous system is $x_1 + (${c1})x_3 = 0$ and $x_2 + (${c2})x_3 = 0$, with $x_3$ free. Thus $x_1 = ${-c1}x_3$ and $x_2 = ${-c2}x_3$. In parametric vector form:\n$$\\mathbf{x} = x_3 ${colVecLatex(basisVec)}$$\nSo a basis for $\\text{Null}(A)$ is $\\{${colVecLatex(basisVec)}\\}$.`,
          `对应齐次方程为 $x_1 + (${c1})x_3 = 0$ 及 $x_2 + (${c2})x_3 = 0$，其中 $x_3$ 为自由未知量。移项得 $x_1 = ${-c1}x_3$，$x_2 = ${-c2}x_3$。写成参数向量形式：\n$$\\mathbf{x} = x_3 ${colVecLatex(basisVec)}$$\n故 $\\text{Null}(A)$ 的一组基为 $\\{${colVecLatex(basisVec)}\\}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "basis-null-space-multiple-free-vars",
      title: t("Basis of Null(A) with two free variables", "含两个自由变量的 Null(A) 的基"),
      explanation: t(
        "When there are k free variables, the parametric vector form decomposes as x = s₁v₁ + ... + sₖvₖ. The vectors {v₁, ..., vₖ} form a basis for Null(A).",
        "当有 k 个自由未知量时，通解分解为 x = s₁v₁ + ... + sₖvₖ。向量组 {v₁, ..., vₖ} 即构成 Null(A) 的一组基。",
      ),
      generate(rng) {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const c = rng.nonZero(-2, 2);
        const rref = [
          [1, a, 0, b],
          [0, 0, 1, c],
        ];
        const v1 = [-a, 1, 0, 0];
        const v2 = [-b, 0, -c, 1];
        const prompt = t(
          `Find a basis for $\\text{Null}(A)$ if $\\text{RREF}(A) = ${matLatex(rref)}$.`,
          `若 $\\text{RREF}(A) = ${matLatex(rref)}$，求 $\\text{Null}(A)$ 的一组基。`,
        );
        const right = t(
          `$\\left\\{ ${colVecLatex(v1)}, ${colVecLatex(v2)} \\right\\}$`,
          `$\\left\\{ ${colVecLatex(v1)}, ${colVecLatex(v2)} \\right\\}$`,
        );
        const wrong = [
          t(
            `$\\left\\{ ${colVecLatex([a, 1, 0, 0])}, ${colVecLatex([b, 0, c, 1])} \\right\\}$`,
            `$\\left\\{ ${colVecLatex([a, 1, 0, 0])}, ${colVecLatex([b, 0, c, 1])} \\right\\}$`,
          ),
          t(
            `$\\left\\{ ${colVecLatex([1, a, 0, b])}, ${colVecLatex([0, 0, 1, c])} \\right\\}$`,
            `$\\left\\{ ${colVecLatex([1, a, 0, b])}, ${colVecLatex([0, 0, 1, c])} \\right\\}$`,
          ),
          t(`$\\left\\{ ${colVecLatex(v1)} \\right\\}$`, `$\\left\\{ ${colVecLatex(v1)} \\right\\}$`),
        ];
        const solution = t(
          `The basic variables are $x_1, x_3$ and the free variables are $x_2, x_4$. Expressing basic variables gives $x_1 = ${-a}x_2 - ${b}x_4$ and $x_3 = ${-c}x_4$. Parametric vector form is $\\mathbf{x} = x_2 ${colVecLatex(v1)} + x_4 ${colVecLatex(v2)}$. Thus $\\{${colVecLatex(v1)}, ${colVecLatex(v2)}\\}$ is a basis.`,
          `主元未知量为 $x_1, x_3$，自由未知量为 $x_2, x_4$。将主元用自由未知量表示得 $x_1 = ${-a}x_2 - ${b}x_4$ 及 $x_3 = ${-c}x_4$。参数向量形式为 $\\mathbf{x} = x_2 ${colVecLatex(v1)} + x_4 ${colVecLatex(v2)}$。故基为 $\\{${colVecLatex(v1)}, ${colVecLatex(v2)}\\}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

/** expressingTheCoordinatesOfAVectorInAGivenBasis covers finding [x]_B and reconstructing x from [x]_B. */
export const expressingTheCoordinatesOfAVectorInAGivenBasis: TopicDef = {
  id: "expressing-the-coordinates-of-a-vector-in-a-given-basis",
  title: t("Expressing the Coordinates of a Vector in a Given Basis", "向量在给定基下的坐标"),
  summary: t(
    "Calculate the coordinate vector [x]_ℬ of a vector x relative to an ordered basis ℬ, and reconstruct x from its coordinates.",
    "计算向量 x 在有序基 ℬ 下的坐标向量 [x]_ℬ，并根据坐标向量还原向量 x。",
  ),
  prerequisites: ["finding-a-basis-of-a-span"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "find-coordinates-2d-basis",
      title: t("Finding coordinate vector [x]_ℬ in ℝ²", "在 ℝ² 中求解坐标向量 [x]_ℬ"),
      explanation: t(
        "If ℬ = {b₁, b₂} is a basis of ℝ², the coordinates c₁, c₂ of x satisfy c₁b₁ + c₂b₂ = x, written [x]_ℬ = (c₁, c₂)ᵀ.",
        "若 ℬ = {b₁, b₂} 是 ℝ² 的一组基，则 x 在基 ℬ 下的坐标 c₁, c₂ 满足 c₁b₁ + c₂b₂ = x，记作 [x]_ℬ = (c₁, c₂)ᵀ。",
      ),
      generate(rng) {
        const c1 = rng.int(-4, 4);
        const c2 = rng.int(-4, 4);
        const b1 = [1, rng.int(-2, 2)];
        const b2 = [0, rng.pick([-1, 1])];
        const x = [c1 * b1[0]! + c2 * b2[0]!, c1 * b1[1]! + c2 * b2[1]!];
        const prompt = t(
          `Let $\\mathcal{B} = \\left\\{ ${colVecLatex(b1)}, ${colVecLatex(b2)} \\right\\}$ be a basis for $\\mathbb{R}^2$. Find the coordinate vector $[\\mathbf{x}]_{\\mathcal{B}}$ of $\\mathbf{x} = ${colVecLatex(x)}$.`,
          `设 $\\mathcal{B} = \\left\\{ ${colVecLatex(b1)}, ${colVecLatex(b2)} \\right\\}$ 为 $\\mathbb{R}^2$ 的一组基。求向量 $\\mathbf{x} = ${colVecLatex(x)}$ 在基 $\\mathcal{B}$ 下的坐标向量 $[\\mathbf{x}]_{\\mathcal{B}}$。`,
        );
        const right = t(`$${colVecLatex([c1, c2])}$`, `$${colVecLatex([c1, c2])}$`);
        const wrong = [
          t(`$${colVecLatex([c1 + 1, c2])}$`, `$${colVecLatex([c1 + 1, c2])}$`),
          t(`$${colVecLatex([c1, c2 - 2])}$`, `$${colVecLatex([c1, c2 - 2])}$`),
          t(`$${colVecLatex([c1 - 1, c2 + 1])}$`, `$${colVecLatex([c1 - 1, c2 + 1])}$`),
        ];
        const solution = t(
          `Solve $c_1 ${colVecLatex(b1)} + c_2 ${colVecLatex(b2)} = ${colVecLatex(x)}$. Component 1 gives $c_1 = ${c1}$, and substituting into component 2 gives $c_2 = ${c2}$. Thus $[\\mathbf{x}]_{\\mathcal{B}} = ${colVecLatex([c1, c2])}$.`,
          `解方程 $c_1 ${colVecLatex(b1)} + c_2 ${colVecLatex(b2)} = ${colVecLatex(x)}$。第一分量直接得到 $c_1 = ${c1}$，代入第二分量解得 $c_2 = ${c2}$。故 $[\\mathbf{x}]_{\\mathcal{B}} = ${colVecLatex([c1, c2])}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "reconstruct-vector-from-coordinates",
      title: t("Reconstructing a vector from its coordinate vector", "根据坐标向量还原向量"),
      explanation: t(
        "Given [x]_ℬ = (c₁, ..., cₙ)ᵀ and basis ℬ = {b₁, ..., bₙ}, the vector is x = c₁b₁ + ... + cₙbₙ.",
        "已知 [x]_ℬ = (c₁, ..., cₙ)ᵀ 与基 ℬ = {b₁, ..., bₙ}，该向量可通过线性组合还原：x = c₁b₁ + ... + cₙbₙ。",
      ),
      generate(rng) {
        const c1 = rng.int(-3, 3);
        const c2 = rng.int(-3, 3);
        const c3 = rng.int(-3, 3);
        const b1 = [1, 0, rng.int(-2, 2)];
        const b2 = [0, 1, rng.int(-2, 2)];
        const b3 = [0, 0, 1];
        const x = [
          c1 * b1[0]! + c2 * b2[0]! + c3 * b3[0]!,
          c1 * b1[1]! + c2 * b2[1]! + c3 * b3[1]!,
          c1 * b1[2]! + c2 * b2[2]! + c3 * b3[2]!,
        ];
        const coords = [c1, c2, c3];
        const prompt = t(
          `In $\\mathbb{R}^3$, relative to the basis $\\mathcal{B} = \\left\\{ ${colVecLatex(b1)}, ${colVecLatex(b2)}, ${colVecLatex(b3)} \\right\\}$, a vector has coordinates $[\\mathbf{x}]_{\\mathcal{B}} = ${colVecLatex(coords)}$. Find $\\mathbf{x}$ in standard coordinates.`,
          `在 $\\mathbb{R}^3$ 中，设基为 $\\mathcal{B} = \\left\\{ ${colVecLatex(b1)}, ${colVecLatex(b2)}, ${colVecLatex(b3)} \\right\\}$，某向量在基 $\\mathcal{B}$ 下的坐标为 $[\\mathbf{x}]_{\\mathcal{B}} = ${colVecLatex(coords)}$。求 $\\mathbf{x}$ 在标准坐标系下的向量。`,
        );
        const right = t(`$${colVecLatex(x)}$`, `$${colVecLatex(x)}$`);
        const wrong = [
          t(`$${colVecLatex([x[0]! + 1, x[1]!, x[2]!])}$`, `$${colVecLatex([x[0]! + 1, x[1]!, x[2]!])}$`),
          t(`$${colVecLatex([x[0]!, x[1]! + 1, x[2]! - 1])}$`, `$${colVecLatex([x[0]!, x[1]! + 1, x[2]! - 1])}$`),
          t(`$${colVecLatex([x[0]! - 1, x[1]!, x[2]! + 2])}$`, `$${colVecLatex([x[0]! - 1, x[1]!, x[2]! + 2])}$`),
        ];
        const solution = t(
          `Compute $\\mathbf{x} = (${c1})\\mathbf{b}_1 + (${c2})\\mathbf{b}_2 + (${c3})\\mathbf{b}_3 = ${colVecLatex(x)}$.`,
          `计算线性组合 $\\mathbf{x} = (${c1})\\mathbf{b}_1 + (${c2})\\mathbf{b}_2 + (${c3})\\mathbf{b}_3 = ${colVecLatex(x)}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

/** writingVectorsInDifferentBases covers the change of basis matrix P_B and relation between standard and non-standard coordinates. */
export const writingVectorsInDifferentBases: TopicDef = {
  id: "writing-vectors-in-different-bases",
  title: t("Writing Vectors in Different Bases", "不同基下的向量坐标表示"),
  summary: t(
    "Relate standard coordinates to coordinates in a basis ℬ using the change-of-basis matrix P_ℬ = [b₁ ... bₙ], satisfying x = P_ℬ [x]_ℬ and [x]_ℬ = P_ℬ⁻¹ x.",
    "利用基矩阵 P_ℬ = [b₁ ... bₙ] 建立标准坐标与基 ℬ 下坐标的关系：x = P_ℬ [x]_ℬ 以及 [x]_ℬ = P_ℬ⁻¹ x。",
  ),
  prerequisites: ["expressing-the-coordinates-of-a-vector-in-a-given-basis"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "matrix-pb-relation",
      title: t("The change-of-basis matrix P_ℬ", "基矩阵 P_ℬ 的构造与性质"),
      explanation: t(
        "For a basis ℬ = {b₁, ..., bₙ} of ℝⁿ, the matrix P_ℬ = [b₁ ... bₙ] transforms ℬ-coordinates into standard coordinates: x = P_ℬ [x]_ℬ.",
        "对于 ℝⁿ 的基 ℬ = {b₁, ..., bₙ}，矩阵 P_ℬ = [b₁ ... bₙ] 将 ℬ-坐标转换为标准坐标：x = P_ℬ [x]_ℬ。",
      ),
      generate(rng) {
        const b1 = [rng.nonZero(-3, 3), rng.int(-2, 2)];
        const b2 = [rng.int(-2, 2), rng.nonZero(-3, 3)];
        if (b1[0]! * b2[1]! - b1[1]! * b2[0]! === 0) {
          b2[0] = b1[0]! + 1;
        }
        const P = [
          [b1[0]!, b2[0]!],
          [b1[1]!, b2[1]!],
        ];
        const prompt = t(
          `Let $\\mathcal{B} = \\left\\{ ${colVecLatex(b1)}, ${colVecLatex(b2)} \\right\\}$ be a basis for $\\mathbb{R}^2$. What is the change-of-basis matrix $P_{\\mathcal{B}}$ such that $\\mathbf{x} = P_{\\mathcal{B}} [\\mathbf{x}]_{\\mathcal{B}}$?`,
          `设 $\\mathcal{B} = \\left\\{ ${colVecLatex(b1)}, ${colVecLatex(b2)} \\right\\}$ 为 $\\mathbb{R}^2$ 的一组基。使得 $\\mathbf{x} = P_{\\mathcal{B}} [\\mathbf{x}]_{\\mathcal{B}}$ 成立的基矩阵 $P_{\\mathcal{B}}$ 是什么？`,
        );
        const right = t(`$${matLatex(P)}$`, `$${matLatex(P)}$`);
        const wrong = [
          t(
            `$${matLatex([
              [b1[0]!, b1[1]!],
              [b2[0]!, b2[1]!],
            ])}$`,
            `$${matLatex([
              [b1[0]!, b1[1]!],
              [b2[0]!, b2[1]!],
            ])}$`,
          ),
          t(
            `$${matLatex([
              [b2[0]!, b1[0]!],
              [b2[1]!, b1[1]!],
            ])}$`,
            `$${matLatex([
              [b2[0]!, b1[0]!],
              [b2[1]!, b1[1]!],
            ])}$`,
          ),
          t(
            `$${matLatex([
              [-b1[0]!, -b2[0]!],
              [-b1[1]!, -b2[1]!],
            ])}$`,
            `$${matLatex([
              [-b1[0]!, -b2[0]!],
              [-b1[1]!, -b2[1]!],
            ])}$`,
          ),
        ];
        const solution = t(
          `The matrix $P_{\\mathcal{B}}$ has the basis vectors as its columns in order: $P_{\\mathcal{B}} = [\\mathbf{b}_1 \\; \\mathbf{b}_2] = ${matLatex(P)}$.`,
          `矩阵 $P_{\\mathcal{B}}$ 的列向量依次由基向量构成：$P_{\\mathcal{B}} = [\\mathbf{b}_1 \\; \\mathbf{b}_2] = ${matLatex(P)}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "solve-coords-using-inverse-pb",
      title: t("Converting standard coordinates to ℬ-coordinates", "利用逆矩阵将标准坐标转换为 ℬ-坐标"),
      explanation: t(
        "To find the coordinates of x relative to ℬ, invert P_ℬ: [x]_ℬ = P_ℬ⁻¹ x.",
        "求解向量 x 关于基 ℬ 的坐标向量，使用基矩阵的逆：[x]_ℬ = P_ℬ⁻¹ x。",
      ),
      generate(rng) {
        const a = rng.nonZero(-4, 4);
        const b1 = [1, 0];
        const b2 = [a, 1];
        const x1 = rng.int(-6, 6);
        const x2 = rng.nonZero(-6, 6);
        const x = [x1, x2];
        const c1 = x1 - a * x2;
        const c2 = x2;
        const coords = [c1, c2];
        const prompt = t(
          `Let $\\mathcal{B} = \\left\\{ ${colVecLatex(b1)}, ${colVecLatex(b2)} \\right\\}$ be a basis for $\\mathbb{R}^2$. Using $P_{\\mathcal{B}}^{-1}$, find $[\\mathbf{x}]_{\\mathcal{B}}$ for $\\mathbf{x} = ${colVecLatex(x)}$.`,
          `设 $\\mathcal{B} = \\left\\{ ${colVecLatex(b1)}, ${colVecLatex(b2)} \\right\\}$ 为 $\\mathbb{R}^2$ 的一组基。利用 $P_{\\mathcal{B}}^{-1}$ 计算向量 $\\mathbf{x} = ${colVecLatex(x)}$ 的坐标 $[\\mathbf{x}]_{\\mathcal{B}}$。`,
        );
        const right = t(`$${colVecLatex(coords)}$`, `$${colVecLatex(coords)}$`);
        const wrong = [
          t(`$${colVecLatex([c1 + 1, c2])}$`, `$${colVecLatex([c1 + 1, c2])}$`),
          t(`$${colVecLatex([c1, c2 - 2])}$`, `$${colVecLatex([c1, c2 - 2])}$`),
          t(`$${colVecLatex([c1 + 2, c2 + 1])}$`, `$${colVecLatex([c1 + 2, c2 + 1])}$`),
        ];
        const solution = t(
          `Since $P_{\\mathcal{B}} = \\begin{pmatrix} 1 & ${a} \\\\ 0 & 1 \\end{pmatrix}$, its inverse is $P_{\\mathcal{B}}^{-1} = \\begin{pmatrix} 1 & ${-a} \\\\ 0 & 1 \\end{pmatrix}$. Then $[\\mathbf{x}]_{\\mathcal{B}} = P_{\\mathcal{B}}^{-1} \\mathbf{x} = ${colVecLatex(coords)}$.`,
          `因 $P_{\\mathcal{B}} = \\begin{pmatrix} 1 & ${a} \\\\ 0 & 1 \\end{pmatrix}$，其逆矩阵为 $P_{\\mathcal{B}}^{-1} = \\begin{pmatrix} 1 & ${-a} \\\\ 0 & 1 \\end{pmatrix}$。故 $[\\mathbf{x}]_{\\mathcal{B}} = P_{\\mathcal{B}}^{-1} \\mathbf{x} = ${colVecLatex(coords)}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

/** theChangeOfCoordinatesMatrix covers constructing P_{C ← B} and applying the coordinate transformation formula. */
export const theChangeOfCoordinatesMatrix: TopicDef = {
  id: "the-change-of-coordinates-matrix",
  title: t("The Change-of-Coordinates Matrix", "坐标变换矩阵（过渡矩阵）"),
  summary: t(
    "Construct the change-of-coordinates matrix P_{C ← B} whose columns are the C-coordinate vectors of the basis vectors in B, and apply [x]_C = P_{C ← B} [x]_B.",
    "构造过渡矩阵 P_{C ← B}（其列向量为基 B 的向量在基 C 下的坐标），并应用公式 [x]_C = P_{C ← B} [x]_B 进行坐标变换。",
  ),
  prerequisites: ["writing-vectors-in-different-bases"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "construct-change-of-basis-matrix",
      title: t("Columns of the change-of-coordinates matrix", "过渡矩阵的列结构"),
      explanation: t(
        "The change-of-coordinates matrix from basis ℬ = {b₁, ..., bₙ} to basis 𝒞 is P_{𝒞 ← ℬ} = [ [b₁]_𝒞  ...  [bₙ]_𝒞 ].",
        "从基 ℬ = {b₁, ..., bₙ} 到基 𝒞 的过渡矩阵为 P_{𝒞 ← ℬ} = [ [b₁]_𝒞  ...  [bₙ]_𝒞 ]，每一列是 ℬ 中的基向量在基 𝒞 下的坐标。",
      ),
      generate(rng) {
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-4, 4);
        const c = rng.nonZero(-4, 4);
        const d = rng.nonZero(-4, 4);
        const b1 = [a, b];
        const b2 = [c, d];
        const prompt = t(
          `Let $\\mathcal{B} = \\left\\{ ${colVecLatex(b1)}, ${colVecLatex(b2)} \\right\\}$ and $\\mathcal{C} = \\{\\mathbf{c}_1, \\mathbf{c}_2\\}$ be two bases for $\\mathbb{R}^2$. Which matrix converts $\\mathcal{B}$-coordinates to $\\mathcal{C}$-coordinates via $[\\mathbf{x}]_{\\mathcal{C}} = P_{\\mathcal{C} \\leftarrow \\mathcal{B}} [\\mathbf{x}]_{\\mathcal{B}}$?`,
          `设 $\\mathcal{B} = \\left\\{ ${colVecLatex(b1)}, ${colVecLatex(b2)} \\right\\}$ 和 $\\mathcal{C} = \\{\\mathbf{c}_1, \\mathbf{c}_2\\}$ 为 $\\mathbb{R}^2$ 的两组基。哪一个矩阵满足 $[\\mathbf{x}]_{\\mathcal{C}} = P_{\\mathcal{C} \\leftarrow \\mathcal{B}} [\\mathbf{x}]_{\\mathcal{B}}$？`,
        );
        const right = t(
          `$P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = \\begin{pmatrix} [\\mathbf{b}_1]_{\\mathcal{C}} & [\\mathbf{b}_2]_{\\mathcal{C}} \\end{pmatrix}$`,
          `$P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = \\begin{pmatrix} [\\mathbf{b}_1]_{\\mathcal{C}} & [\\mathbf{b}_2]_{\\mathcal{C}} \\end{pmatrix}$`,
        );
        const wrong = [
          t(
            `$P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = \\begin{pmatrix} [\\mathbf{c}_1]_{\\mathcal{B}} & [\\mathbf{c}_2]_{\\mathcal{B}} \\end{pmatrix}$`,
            `$P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = \\begin{pmatrix} [\\mathbf{c}_1]_{\\mathcal{B}} & [\\mathbf{c}_2]_{\\mathcal{B}} \\end{pmatrix}$`,
          ),
          t(
            `$P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = \\begin{pmatrix} [\\mathbf{b}_1]_{\\mathcal{B}} & [\\mathbf{b}_2]_{\\mathcal{B}} \\end{pmatrix}$`,
            `$P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = \\begin{pmatrix} [\\mathbf{b}_1]_{\\mathcal{B}} & [\\mathbf{b}_2]_{\\mathcal{B}} \\end{pmatrix}$`,
          ),
          t(
            `$P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = [\\mathbf{b}_1 \\; \\mathbf{c}_1]$`,
            `$P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = [\\mathbf{b}_1 \\; \\mathbf{c}_1]$`,
          ),
        ];
        const solution = t(
          `By definition, the columns of the change-of-coordinates matrix $P_{\\mathcal{C} \\leftarrow \\mathcal{B}}$ are the coordinate vectors of the original basis vectors $\\mathbf{b}_j$ relative to the target basis $\\mathcal{C}$.`,
          `按定义，从基 ℬ 到基 𝒞 的过渡矩阵 $P_{\\mathcal{C} \\leftarrow \\mathcal{B}}$，其第 $j$ 列是原基向量 $\\mathbf{b}_j$ 在新基 𝒞 下的坐标向量 $[\\mathbf{b}_j]_{\\mathcal{C}}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "apply-change-of-coordinates-matrix",
      title: t("Applying the change-of-coordinates matrix", "计算变换后的坐标向量"),
      explanation: t(
        "To find [x]_𝒞 given [x]_ℬ and P_{𝒞 ← ℬ}, compute the matrix-vector product [x]_𝒞 = P_{𝒞 ← ℬ} [x]_ℬ.",
        "已知 [x]_ℬ 与过渡矩阵 P_{𝒞 ← ℬ} 时，通过矩阵乘法求 [x]_𝒞：[x]_𝒞 = P_{𝒞 ← ℬ} [x]_ℬ。",
      ),
      generate(rng) {
        const p11 = rng.int(-2, 2);
        const p12 = rng.int(-2, 2);
        const p21 = rng.int(-2, 2);
        const p22 = rng.int(-2, 2);
        const P = [
          [p11, p12],
          [p21, p22],
        ];
        const u1 = rng.int(-3, 3);
        const u2 = rng.int(-3, 3);
        const u = [u1, u2];
        const v1 = p11 * u1 + p12 * u2;
        const v2 = p21 * u1 + p22 * u2;
        const v = [v1, v2];
        const prompt = t(
          `Given the change-of-coordinates matrix $P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = ${matLatex(P)}$ and $[\\mathbf{x}]_{\\mathcal{B}} = ${colVecLatex(u)}$, compute $[\\mathbf{x}]_{\\mathcal{C}}$.`,
          `已知过渡矩阵 $P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = ${matLatex(P)}$ 以及 $[\\mathbf{x}]_{\\mathcal{B}} = ${colVecLatex(u)}$，计算 $[\\mathbf{x}]_{\\mathcal{C}}$。`,
        );
        const right = t(`$${colVecLatex(v)}$`, `$${colVecLatex(v)}$`);
        const wrong = [
          t(`$${colVecLatex([v1 + 1, v2])}$`, `$${colVecLatex([v1 + 1, v2])}$`),
          t(`$${colVecLatex([v1 - 1, v2 + 2])}$`, `$${colVecLatex([v1 - 1, v2 + 2])}$`),
          t(`$${colVecLatex([v1 + 2, v2 - 1])}$`, `$${colVecLatex([v1 + 2, v2 - 1])}$`),
        ];
        const solution = t(
          `Multiply $[\\mathbf{x}]_{\\mathcal{C}} = P_{\\mathcal{C} \\leftarrow \\mathcal{B}} [\\mathbf{x}]_{\\mathcal{B}} = ${matLatex(P)} ${colVecLatex(u)} = ${colVecLatex(v)}$.`,
          `进行矩阵向量相乘：$[\\mathbf{x}]_{\\mathcal{C}} = P_{\\mathcal{C} \\leftarrow \\mathcal{B}} [\\mathbf{x}]_{\\mathcal{B}} = ${matLatex(P)} ${colVecLatex(u)} = ${colVecLatex(v)}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

/** changingABasisUsingTheChangeOfCoordinatesMatrix covers inverse relation P_{B ← C} = (P_{C ← B})⁻¹ and augmented matrix row reduction [C | B] ~ [I | P]. */
export const changingABasisUsingTheChangeOfCoordinatesMatrix: TopicDef = {
  id: "changing-a-basis-using-the-change-of-coordinates-matrix",
  title: t("Changing a Basis Using the Change-of-Coordinates Matrix", "利用过渡矩阵转换基与坐标"),
  summary: t(
    "Use matrix inversion (P_{C ← B})⁻¹ = P_{B ← C} and row reduction on augmented matrices [C | B] ~ [I | P_{C ← B}] to transform bases and coordinates.",
    "利用矩阵求逆 (P_{C ← B})⁻¹ = P_{B ← C} 与初等行变换 [C | B] ~ [I | P_{C ← B}] 求过渡矩阵并转换基与坐标。",
  ),
  prerequisites: ["the-change-of-coordinates-matrix"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "inverse-transition-matrix-property",
      title: t("The inverse of a transition matrix", "过渡矩阵的逆矩阵性质"),
      explanation: t(
        "The transition matrix from 𝒞 back to ℬ is the inverse of the transition matrix from ℬ to 𝒞: P_{ℬ ← 𝒞} = (P_{𝒞 ← ℬ})⁻¹.",
        "从基 𝒞 到基 ℬ 的过渡矩阵等于从 ℬ 到 𝒞 的过渡矩阵的逆矩阵：P_{ℬ ← 𝒞} = (P_{𝒞 ← ℬ})⁻¹。",
      ),
      generate(rng) {
        const k = rng.nonZero(-15, 15);
        const P = [
          [1, k],
          [0, 1],
        ];
        const Pinv = [
          [1, -k],
          [0, 1],
        ];
        const prompt = t(
          `If the change-of-coordinates matrix from basis $\\mathcal{B}$ to basis $\\mathcal{C}$ is $P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = ${matLatex(P)}$, what is the change-of-coordinates matrix $P_{\\mathcal{B} \\leftarrow \\mathcal{C}}$?`,
          `若从基 $\\mathcal{B}$ 到基 $\\mathcal{C}$ 的过渡矩阵为 $P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = ${matLatex(P)}$，则逆向过渡矩阵 $P_{\\mathcal{B} \\leftarrow \\mathcal{C}}$ 是多少？`,
        );
        const right = t(`$${matLatex(Pinv)}$`, `$${matLatex(Pinv)}$`);
        const wrong = [
          t(`$${matLatex(P)}$`, `$${matLatex(P)}$`),
          t(
            `$${matLatex([
              [1, 0],
              [k, 1],
            ])}$`,
            `$${matLatex([
              [1, 0],
              [k, 1],
            ])}$`,
          ),
          t(
            `$${matLatex([
              [-1, -k],
              [0, -1],
            ])}$`,
            `$${matLatex([
              [-1, -k],
              [0, -1],
            ])}$`,
          ),
        ];
        const solution = t(
          `Since $P_{\\mathcal{B} \\leftarrow \\mathcal{C}} = (P_{\\mathcal{C} \\leftarrow \\mathcal{B}})^{-1}$, inverting $\\begin{pmatrix} 1 & ${k} \\\\ 0 & 1 \\end{pmatrix}$ yields $\\begin{pmatrix} 1 & ${-k} \\\\ 0 & 1 \\end{pmatrix}$.`,
          `因 $P_{\\mathcal{B} \\leftarrow \\mathcal{C}} = (P_{\\mathcal{C} \\leftarrow \\mathcal{B}})^{-1}$，对 $\\begin{pmatrix} 1 & ${k} \\\\ 0 & 1 \\end{pmatrix}$ 求逆矩阵得到 $\\begin{pmatrix} 1 & ${-k} \\\\ 0 & 1 \\end{pmatrix}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "row-reduction-change-of-basis",
      title: t("Computing transition matrix via row reduction", "通过增广矩阵行化简求过渡矩阵"),
      explanation: t(
        "To find P_{𝒞 ← ℬ} for bases ℬ and 𝒞 in ℝⁿ, row reduce the augmented matrix [C | B] until the left side is the identity matrix: [C | B] ~ [I | P_{𝒞 ← ℬ}].",
        "在 ℝⁿ 中求基 ℬ 到基 𝒞 的过渡矩阵 P_{𝒞 ← ℬ}，可对增广矩阵 [C | B] 进行初等行变换，化简至左侧为单位阵：[C | B] ~ [I | P_{𝒞 ← ℬ}]。",
      ),
      generate(rng) {
        const n = rng.int(2, 35);
        const prompt = t(
          `In $\\mathbb{R}^${n}$, to compute the change-of-coordinates matrix $P_{\\mathcal{C} \\leftarrow \\mathcal{B}}$ between two bases $\\mathcal{B} = \\{\\mathbf{b}_1, \\dots, \\mathbf{b}_${n}\\}$ and $\\mathcal{C} = \\{\\mathbf{c}_1, \\dots, \\mathbf{c}_${n}\\}$, which augmented matrix is row reduced to $[I \\mid P_{\\mathcal{C} \\leftarrow \\mathcal{B}}]$?`,
          `在 $\\mathbb{R}^${n}$ 中，为求基 $\\mathcal{B} = \\{\\mathbf{b}_1, \\dots, \\mathbf{b}_${n}\\}$ 到基 $\\mathcal{C} = \\{\\mathbf{c}_1, \\dots, \\mathbf{c}_${n}\\}$ 的过渡矩阵 $P_{\\mathcal{C} \\leftarrow \\mathcal{B}}$，应将哪一个增广矩阵行化简为 $[I \\mid P_{\\mathcal{C} \\leftarrow \\mathcal{B}}]$？`,
        );
        const right = t(
          `$[\\mathbf{c}_1 \\; \\dots \\; \\mathbf{c}_${n} \\mid \\mathbf{b}_1 \\; \\dots \\; \\mathbf{b}_${n}]$`,
          `$[\\mathbf{c}_1 \\; \\dots \\; \\mathbf{c}_${n} \\mid \\mathbf{b}_1 \\; \\dots \\; \\mathbf{b}_${n}]$`,
        );
        const wrong = [
          t(
            `$[\\mathbf{b}_1 \\; \\dots \\; \\mathbf{b}_${n} \\mid \\mathbf{c}_1 \\; \\dots \\; \\mathbf{c}_${n}]$`,
            `$[\\mathbf{b}_1 \\; \\dots \\; \\mathbf{b}_${n} \\mid \\mathbf{c}_1 \\; \\dots \\; \\mathbf{c}_${n}]$`,
          ),
          t(
            `$[I \\mid \\mathbf{b}_1 \\; \\dots \\; \\mathbf{b}_${n} \\; \\mathbf{c}_1 \\; \\dots \\; \\mathbf{c}_${n}]$`,
            `$[I \\mid \\mathbf{b}_1 \\; \\dots \\; \\mathbf{b}_${n} \\; \\mathbf{c}_1 \\; \\dots \\; \\mathbf{c}_${n}]$`,
          ),
          t(
            `$[\\mathbf{b}_1 \\; \\mathbf{c}_1 \\mid \\dots \\mid \\mathbf{b}_${n} \\; \\mathbf{c}_${n}]$`,
            `$[\\mathbf{b}_1 \\; \\mathbf{c}_1 \\mid \\dots \\mid \\mathbf{b}_${n} \\; \\mathbf{c}_${n}]$`,
          ),
        ];
        const solution = t(
          `Since $C P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = B$, solving for $P_{\\mathcal{C} \\leftarrow \\mathcal{B}}$ corresponds to row reducing $[C \\mid B] \\sim [I \\mid C^{-1}B] = [I \\mid P_{\\mathcal{C} \\leftarrow \\mathcal{B}}]$. The target basis matrix $C$ is on the left.`,
          `由矩阵关系 $C P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = B$，解出过渡矩阵相当于对增广矩阵 $[C \\mid B]$ 做初等行变换得到 $[I \\mid C^{-1}B] = [I \\mid P_{\\mathcal{C} \\leftarrow \\mathcal{B}}]$。目标基矩阵 $C$ 置于左侧。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE 3.12: DIMENSION AND RANK IN N-DIMENSIONAL SPACE
// ════════════════════════════════════════════════════════════════════════════

/** theDimensionOfASpan covers the definition of dimension as basis cardinality and computing dim(Span). */
export const theDimensionOfASpan: TopicDef = {
  id: "the-dimension-of-a-span",
  title: t("The Dimension of a Span", "张成空间的维数"),
  summary: t(
    "Define the dimension of a subspace as the number of vectors in any basis, and determine the dimension of a span by counting pivot columns.",
    "理解子空间维数作为任意基中向量个数的定义，并通过统计主元列数求解张成空间的维数。",
  ),
  prerequisites: ["finding-a-basis-of-a-span"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "dimension-definition-invariance",
      title: t("Dimension as basis cardinality", "维数作为基向量个数的唯一性"),
      explanation: t(
        "The dimension of a non-zero subspace H, denoted dim(H), is the number of vectors in any basis for H. The zero subspace {0} has dimension 0.",
        "非零子空间 H 的维数（记作 dim(H)）是 H 的任意一组基中所含向量的个数。零子空间 {0} 的维数规定为 0。",
      ),
      generate(rng) {
        const k = rng.int(2, 30);
        const prompt = t(
          `If a subspace $H$ has a basis containing exactly $${k}$ vectors, what can be said about any other basis for $H$?`,
          `若子空间 $H$ 的某一组基恰好包含 $${k}$ 个向量，则关于 $H$ 的任意另一组基，下列说法正确的是？`,
        );
        const right = t(`It must also contain exactly $${k}$ vectors`, `它也必须恰好包含 $${k}$ 个向量`);
        const wrong = [
          t(`It can contain any number of vectors as long as they span $H$`, `它可以包含任意数量的向量，只要它们能张成 $H$`),
          t(`It must contain at least $${k + 1}$ vectors`, `它必须至少包含 $${k + 1}$ 个向量`),
          t(`It must contain fewer than $${k}$ vectors if they are orthogonal`, `若向量正交，则包含的向量个数可以少于 $${k}$ 个`),
        ];
        const solution = t(
          `By the Dimension Theorem, any two bases for the same vector space or subspace have the exact same number of vectors. Hence every basis for $H$ has exactly $${k}$ vectors, so $\\dim(H) = ${k}$.`,
          `根据维数定理，同一个向量空间或子空间的所有基必定含有相同数目的向量。因此 $H$ 的每组基都恰有 $${k}$ 个向量，$\\dim(H) = ${k}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "compute-dim-of-span",
      title: t("Computing dim(Span{v₁, ..., vₖ})", "计算 Span{v₁, ..., vₖ} 的维数"),
      explanation: t(
        "The dimension of Span{v₁, ..., vₖ} equals the number of pivot columns in the matrix [v₁ ... vₖ].",
        "Span{v₁, ..., vₖ} 的维数等于以这些向量为列构成的矩阵 [v₁ ... vₖ] 的主元列个数。",
      ),
      generate(rng) {
        const pivots = rng.pick([1, 2, 3]);
        const a = rng.nonZero(-2, 2);
        const b = rng.nonZero(-2, 2);
        let v1: number[];
        let v2: number[];
        let v3: number[];
        if (pivots === 1) {
          v1 = [1, a, -1];
          v2 = [2, 2 * a, -2];
          v3 = [-a, -a * a, a];
        } else if (pivots === 2) {
          v1 = [1, 0, a];
          v2 = [0, 1, b];
          v3 = [1, 1, a + b];
        } else {
          v1 = [1, 0, 0];
          v2 = [a, 1, 0];
          v3 = [0, b, 1];
        }
        const prompt = t(
          `Find the dimension of the subspace $W = \\text{Span}\\left\\{ ${colVecLatex(v1)}, ${colVecLatex(v2)}, ${colVecLatex(v3)} \\right\\}$ in $\\mathbb{R}^3$.`,
          `求 $\\mathbb{R}^3$ 中子空间 $W = \\text{Span}\\left\\{ ${colVecLatex(v1)}, ${colVecLatex(v2)}, ${colVecLatex(v3)} \\right\\}$ 的维数。`,
        );
        const right = t(`$${pivots}$`, `$${pivots}$`);
        const wrong = [
          t(`$${pivots === 3 ? 2 : pivots + 1}$`, `$${pivots === 3 ? 2 : pivots + 1}$`),
          t(`$${pivots === 1 ? 3 : pivots - 1}$`, `$${pivots === 1 ? 3 : pivots - 1}$`),
          t(`$0$`, `$0$`),
        ];
        const solution = t(
          `Row reducing the matrix formed by the 3 vectors reveals exactly $${pivots}$ pivot column(s). Therefore, the dimension of the subspace is $${pivots}$.`,
          `将这 3 个向量作为列构成矩阵并进行初等行化简，得到恰好 $${pivots}$ 个主元列。因此，该子空间的维数为 $${pivots}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

/** theRankOfAMatrix covers rank definition as dim(Col(A)), pivot count, and rank bounds. */
export const theRankOfAMatrix: TopicDef = {
  id: "the-rank-of-a-matrix",
  title: t("The Rank of a Matrix", "矩阵的秩"),
  summary: t(
    "Define the rank of a matrix as dim(Col(A)), equal to the number of pivot positions, and understand properties such as rank(A) ≤ min(m, n) and rank(Aᵀ) = rank(A).",
    "掌握矩阵的秩定义为 dim(Col(A))（即阶梯形的主元个数），理解 rank(A) ≤ min(m, n) 与 rank(Aᵀ) = rank(A) 等性质。",
  ),
  prerequisites: ["finding-a-basis-of-the-column-space-of-a-matrix"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "rank-from-pivot-positions",
      title: t("Rank as number of pivot positions", "秩作为主元位置个数"),
      explanation: t(
        "The rank of a matrix A, denoted rank(A), is the dimension of the column space Col(A), which equals the number of pivot columns in any row echelon form of A.",
        "矩阵 A 的秩记作 rank(A)，是列空间 Col(A) 的维数，等于 A 的任意行阶梯形中主元列的个数。",
      ),
      generate(rng) {
        const rows = rng.int(3, 8);
        const cols = rng.int(3, 8);
        const r = rng.int(1, Math.min(rows, cols));
        const prompt = t(
          `A $${rows} \\times ${cols}$ matrix $A$ has reduced row echelon form containing exactly $${r}$ pivot positions (non-zero rows). What is $\\text{rank}(A)$?`,
          `一个 $${rows} \\times ${cols}$ 矩阵 $A$ 的简化行阶梯形中恰好有 $${r}$ 个主元位置（非零行）。矩阵 $A$ 的秩 $\\text{rank}(A)$ 是多少？`,
        );
        const right = t(`$${r}$`, `$${r}$`);
        const wrong = [
          t(`$${cols}$`, `$${cols}$`),
          t(`$${rows}$`, `$${rows}$`),
          t(`$${Math.abs(cols - r) + 1}$`, `$${Math.abs(cols - r) + 1}$`),
        ];
        const solution = t(
          `By definition, $\\text{rank}(A) = \\dim(\\text{Col}(A))$, which equals the number of pivot columns in echelon form. Here there are $${r}$ pivots, so $\\text{rank}(A) = ${r}$.`,
          `按定义，$\\text{rank}(A) = \\dim(\\text{Col}(A))$ 等于行阶梯形中主元的个数。此处有 $${r}$ 个主元，故 $\\text{rank}(A) = ${r}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "properties-of-matrix-rank",
      title: t("Fundamental properties of rank", "矩阵秩的基本性质"),
      explanation: t(
        "For any m × n matrix A: 1. rank(A) ≤ min(m, n); 2. rank(Aᵀ) = rank(A) (row rank equals column rank).",
        "对任意 m × n 矩阵 A：1. rank(A) ≤ min(m, n)；2. rank(Aᵀ) = rank(A)（行秩等于列秩）。",
      ),
      generate(rng) {
        const m = rng.int(2, 12);
        const n = rng.int(2, 12);
        const minMN = Math.min(m, n);
        const prompt = t(
          `What is the maximum possible rank of a $${m} \\times ${n}$ matrix $A$?`,
          `一个 $${m} \\times ${n}$ 矩阵 $A$ 的秩最大可能为多少？`,
        );
        const right = t(`$${minMN}$`, `$${minMN}$`);
        const wrong = [t(`$${Math.max(m, n)}$`, `$${Math.max(m, n)}$`), t(`$${m + n}$`, `$${m + n}$`), t(`$${m * n}$`, `$${m * n}$`)];
        const solution = t(
          `The number of pivots cannot exceed the number of rows ($m$) or the number of columns ($n$). Thus $\\text{rank}(A) \\le \\min(${m}, ${n}) = ${minMN}$.`,
          `主元的个数既不能超过行数（$${m}$），也不能超过列数（$${n}$）。因此 $\\text{rank}(A) \\le \\min(${m}, ${n}) = ${minMN}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

/** theDimensionOfTheNullSpaceOfAMatrix covers nullity definition as dim(Null(A)) and counting free variables. */
export const theDimensionOfTheNullSpaceOfAMatrix: TopicDef = {
  id: "the-dimension-of-the-null-space-of-a-matrix",
  title: t("The Dimension of the Null Space of a Matrix", "零空间的维数（零度/虚度 Nullity）"),
  summary: t(
    "Define nullity(A) as dim(Null(A)), compute it as the number of free variables in Ax = 0, and relate nullity(A) = 0 to trivial null space.",
    "掌握矩阵零度 nullity(A) 作为 dim(Null(A)) 的定义，通过自由未知量个数进行计算，并理解 nullity(A) = 0 与零空间仅含零向量的等价性。",
  ),
  prerequisites: ["finding-a-basis-of-the-null-space-of-a-matrix"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "nullity-from-free-variables",
      title: t("Nullity equals the number of free variables", "零度等于自由未知量的个数"),
      explanation: t(
        "The dimension of Null(A), called the nullity of A, is equal to the number of free variables in the homogeneous equation Ax = 0.",
        "Null(A) 的维数称为矩阵 A 的零度（nullity），等于齐次线性方程组 Ax = 0 中自由未知量的个数。",
      ),
      generate(rng) {
        const n = rng.int(4, 12);
        const pivots = rng.int(1, n - 1);
        const freeVars = n - pivots;
        const prompt = t(
          `A matrix $A$ has $${n}$ columns and its reduced row echelon form has $${pivots}$ pivot columns. What is $\\text{nullity}(A) = \\dim(\\text{Null}(A))$?`,
          `矩阵 $A$ 拥有 $${n}$ 列，其简化行阶梯形有 $${pivots}$ 个主元列。矩阵 $A$ 的零度 $\\text{nullity}(A) = \\dim(\\text{Null}(A))$ 是多少？`,
        );
        const right = t(`$${freeVars}$`, `$${freeVars}$`);
        const wrong = [t(`$${pivots}$`, `$${pivots}$`), t(`$${n}$`, `$${n}$`), t(`$0$`, `$0$`)];
        const solution = t(
          `The number of free variables in $A\\mathbf{x} = \\mathbf{0}$ equals the total number of columns minus the number of pivot columns: $${n} - ${pivots} = ${freeVars}$. Hence $\\text{nullity}(A) = ${freeVars}$.`,
          `齐次方程 $A\\mathbf{x} = \\mathbf{0}$ 的自由未知量个数等于总列数减去主元列数：$${n} - ${pivots} = ${freeVars}$。因此 $\\text{nullity}(A) = ${freeVars}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "nullity-zero-and-uniqueness",
      title: t("Nullity 0 and linear independence", "零度为 0 与线性无关的等价性"),
      explanation: t(
        "nullity(A) = 0 if and only if Null(A) = {0}, which means Ax = 0 has only the trivial solution and the columns of A are linearly independent.",
        "nullity(A) = 0 当且仅当 Null(A) = {0}，这等价于 Ax = 0 仅有零解，且矩阵 A 的列向量线性无关。",
      ),
      generate(rng) {
        const m = rng.int(3, 10);
        const n = rng.int(2, m);
        const prompt = t(
          `What does $\\text{nullity}(A) = 0$ imply about a $${m} \\times ${n}$ matrix $A$?`,
          `对于一个 $${m} \\times ${n}$ 矩阵 $A$，$\\text{nullity}(A) = 0$ 意味着什么？`,
        );
        const right = t(
          `$A\\mathbf{x} = \\mathbf{0}$ has only the trivial solution, and the columns of $A$ are linearly independent`,
          `$A\\mathbf{x} = \\mathbf{0}$ 仅有零解，且 $A$ 的列向量线性无关`,
        );
        const wrong = [
          t(`$A\\mathbf{x} = \\mathbf{0}$ has infinitely many solutions`, `$A\\mathbf{x} = \\mathbf{0}$ 有无穷多解`),
          t(`The rows of $A$ are linearly dependent`, `$A$ 的行向量必定线性相关`),
          t(`$A$ is the zero matrix`, `$A$ 必定是零矩阵`),
        ];
        const solution = t(
          `$\\text{nullity}(A) = 0$ means the solution space $\\text{Null}(A)$ is the zero subspace $\\{\\mathbf{0}\\}$. Thus $A\\mathbf{x} = \\mathbf{0}$ has only the trivial solution $\\mathbf{x} = \\mathbf{0}$, which implies the columns of $A$ are linearly independent.`,
          `$\\text{nullity}(A) = 0$ 意味着零空间为零子空间 $\\{\\mathbf{0}\\}$。因此齐次方程 $A\\mathbf{x} = \\mathbf{0}$ 仅有平凡零解，这等价于 $A$ 的列向量线性无关。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

/** theInvertibleMatrixTheoremInTermsOfDimensionRankAndNullity connects invertibility of n x n matrices to rank n, nullity 0, and spanning. */
export const theInvertibleMatrixTheoremInTermsOfDimensionRankAndNullity: TopicDef = {
  id: "the-invertible-matrix-theorem-in-terms-of-dimension-rank-and-nullity",
  title: t("The Invertible Matrix Theorem in Terms of Dimension, Rank and Nullity", "可逆矩阵等价命题（秩与维数角度）"),
  summary: t(
    "Characterize the invertibility of an n × n matrix in terms of rank(A) = n, nullity(A) = 0, Col(A) = ℝⁿ, and Null(A) = {0}.",
    "从 rank(A) = n、nullity(A) = 0、Col(A) = ℝⁿ 及 Null(A) = {0} 等秩与维数的角度表述 n 阶方阵的可逆等价条件。",
  ),
  prerequisites: ["the-rank-of-a-matrix", "the-dimension-of-the-null-space-of-a-matrix"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "imt-rank-conditions-n-by-n",
      title: t("Invertibility statements for rank and nullity", "秩与零度视角的方阵可逆等价命题"),
      explanation: t(
        "For an n × n matrix A, the following are equivalent: 1. A is invertible; 2. rank(A) = n; 3. nullity(A) = 0; 4. Col(A) = ℝⁿ; 5. Null(A) = {0}.",
        "对 n 阶方阵 A，以下条件相互等价：1. A 可逆；2. rank(A) = n；3. nullity(A) = 0；4. Col(A) = ℝⁿ；5. Null(A) = {0}。",
      ),
      generate(rng) {
        const n = rng.int(3, 30);
        const prompt = t(
          `Let $A$ be an $${n} \\times ${n}$ square matrix. Which of the following conditions is equivalent to $A$ being invertible?`,
          `设 $A$ 为一个 $${n} \\times ${n}$ 方阵。下列哪一个条件与 $A$ 可逆等价？`,
        );
        const right = t(`$\\text{rank}(A) = ${n}$ and $\\text{nullity}(A) = 0$`, `$\\text{rank}(A) = ${n}$ 且 $\\text{nullity}(A) = 0$`);
        const wrong = [
          t(`$\\text{rank}(A) = 0$ and $\\text{nullity}(A) = ${n}$`, `$\\text{rank}(A) = 0$ 且 $\\text{nullity}(A) = ${n}$`),
          t(`$\\text{Col}(A)$ is a line in $\\mathbb{R}^${n}$`, `$\\text{Col}(A)$ 是 $\\mathbb{R}^${n}$ 中的一条直线`),
          t(`$\\text{Null}(A)$ contains non-zero vectors`, `$\\text{Null}(A)$ 包含非零向量`),
        ];
        const solution = t(
          `By the Invertible Matrix Theorem, an $n \\times n$ matrix is invertible if and only if it has full rank ($n$), which by the Rank-Nullity Theorem is equivalent to $\\text{nullity}(A) = 0$.`,
          `由可逆矩阵等价定理，一个 $n$ 阶方阵可逆当且仅当它满秩（$\\text{rank}(A) = n$），由秩-零度定理这等价于 $\\text{nullity}(A) = 0$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "imt-singular-matrix-deductions",
      title: t("Deductions for non-invertible square matrices", "奇异矩阵的维数推论"),
      explanation: t(
        "If an n × n matrix has rank(A) < n, then nullity(A) ≥ 1, det(A) = 0, its columns are linearly dependent and do not span ℝⁿ.",
        "若 n 阶方阵的秩 rank(A) < n，则必有 nullity(A) ≥ 1，det(A) = 0，其列向量线性相关且不能张成 ℝⁿ。",
      ),
      generate(rng) {
        const n = rng.int(3, 15);
        const r = rng.int(1, n - 1);
        const nullity = n - r;
        const prompt = t(
          `An $${n} \\times ${n}$ matrix $A$ has $\\text{rank}(A) = ${r}$. Which statement must be true?`,
          `一个 $${n} \\times ${n}$ 方阵 $A$ 满足 $\\text{rank}(A) = ${r}$。下列哪个断言必定成立？`,
        );
        const right = t(`$\\text{nullity}(A) = ${nullity}$, and $A$ is not invertible`, `$\\text{nullity}(A) = ${nullity}$，且 $A$ 不可逆`);
        const wrong = [
          t(`$A$ is invertible`, `$A$ 可逆`),
          t(`$\\text{Col}(A) = \\mathbb{R}^${n}$`, `$\\text{Col}(A) = \\mathbb{R}^${n}$`),
          t(`$\\text{Null}(A) = \\{\\mathbf{0}\\}$`, `$\\text{Null}(A) = \\{\\mathbf{0}\\}$`),
        ];
        const solution = t(
          `Since $\\text{rank}(A) = ${r} < ${n}$, the matrix is not of full rank and therefore not invertible. By Rank-Nullity, $\\text{nullity}(A) = ${n} - ${r} = ${nullity}$.`,
          `由于 $\\text{rank}(A) = ${r} < ${n}$，矩阵不满秩，因此不可逆。由秩-零度定理，$\\text{nullity}(A) = ${n} - ${r} = ${nullity}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

/** theRankNullityTheorem covers rank(A) + nullity(A) = n and applying it to linear systems. */
export const theRankNullityTheorem: TopicDef = {
  id: "the-rank-nullity-theorem",
  title: t("The Rank-Nullity Theorem", "秩-零度定理"),
  summary: t(
    "Apply the Rank-Nullity Theorem: for any m × n matrix A, rank(A) + nullity(A) = n (the number of columns).",
    "掌握并应用秩-零度定理：对任意 m × n 矩阵 A，恒有 rank(A) + nullity(A) = n（总列数）。",
  ),
  prerequisites: ["the-rank-of-a-matrix", "the-dimension-of-the-null-space-of-a-matrix"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "rank-nullity-computation",
      title: t("Rank-Nullity formula computation", "应用秩-零度公式进行计算"),
      explanation: t(
        "For an m × n matrix A, rank(A) + nullity(A) = n. Every column is either a pivot column or corresponds to a free variable.",
        "对于 m × n 矩阵 A，rank(A) + nullity(A) = n。矩阵的每一列要么是主元列，要么对应一个自由未知量。",
      ),
      generate(rng) {
        const m = rng.int(3, 7);
        const n = rng.int(4, 8);
        const r = rng.int(1, Math.min(m, n) - 1);
        const nullity = n - r;
        const prompt = t(
          `A matrix $A$ has $${m}$ rows and $${n}$ columns. If $\\text{rank}(A) = ${r}$, what is $\\text{nullity}(A) = \\dim(\\text{Null}(A))$?`,
          `矩阵 $A$ 拥有 $${m}$ 行和 $${n}$ 列。若 $\\text{rank}(A) = ${r}$，则 $\\text{nullity}(A) = \\dim(\\text{Null}(A))$ 等于多少？`,
        );
        const right = t(`$${nullity}$`, `$${nullity}$`);
        const wrong = [t(`$${m - r}$`, `$${m - r}$`), t(`$${r}$`, `$${r}$`), t(`$${n}$`, `$${n}$`)];
        const solution = t(
          `By the Rank-Nullity Theorem, $\\text{rank}(A) + \\text{nullity}(A) = n$, where $n = ${n}$ is the number of columns. Thus $\\text{nullity}(A) = ${n} - ${r} = ${nullity}$.`,
          `根据秩-零度定理，$\\text{rank}(A) + \\text{nullity}(A) = n$，其中 $n = ${n}$ 为列数。故 $\\text{nullity}(A) = ${n} - ${r} = ${nullity}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "rank-nullity-homogeneous-system-analysis",
      title: t("Solution space dimension of homogeneous systems", "齐次线性方程组解空间的维数"),
      explanation: t(
        "A homogeneous system of m linear equations in n variables Ax = 0 has a solution space of dimension n - rank(A).",
        "含 n 个未知量的 m 个方程构成的齐次线性方程组 Ax = 0，其解空间的维数等于 n - rank(A)。",
      ),
      generate(rng) {
        const m = rng.int(3, 10);
        const n = rng.int(4, 12);
        const r = rng.int(1, Math.min(m, n) - 1);
        const dimSol = n - r;
        const prompt = t(
          `A homogeneous system of $${m}$ linear equations in $${n}$ variables has coefficient matrix with rank $${r}$. What is the dimension of the solution space?`,
          `一个由 $${m}$ 个方程与 $${n}$ 个未知量组成的齐次线性方程组，其系数矩阵的秩为 $${r}$。该方程组解空间的维数是多少？`,
        );
        const right = t(`$${dimSol}$`, `$${dimSol}$`);
        const wrong = [t(`$${r}$`, `$${r}$`), t(`$${m - r}$`, `$${m - r}$`), t(`$${n}$`, `$${n}$`)];
        const solution = t(
          `The solution space of $A\\mathbf{x} = \\mathbf{0}$ is $\\text{Null}(A)$. By the Rank-Nullity Theorem, $\\dim(\\text{Null}(A)) = n - \\text{rank}(A) = ${n} - ${r} = ${dimSol}$.`,
          `齐次方程组 $A\\mathbf{x} = \\mathbf{0}$ 的解空间即为零空间 $\\text{Null}(A)$。由秩-零度定理，$\\dim(\\text{Null}(A)) = n - \\text{rank}(A) = ${n} - ${r} = ${dimSol}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE 3.13: ABSTRACT VECTOR SPACES
// ════════════════════════════════════════════════════════════════════════════

/** introductionToAbstractVectorSpaces covers generalizing vectors to polynomials, matrices, and continuous functions. */
export const introductionToAbstractVectorSpaces: TopicDef = {
  id: "introduction-to-abstract-vector-spaces",
  title: t("Introduction to Abstract Vector Spaces", "抽象向量空间的概念"),
  summary: t(
    "Generalize the notion of vectors beyond ℝⁿ to polynomial spaces ℙₙ, matrix spaces M_{m×n}, and continuous functions C[a, b], identifying their operations and zero vectors.",
    "将向量概念由 ℝⁿ 推广至多项式空间 ℙₙ、矩阵空间 M_{m×n} 及连续函数空间 C[a, b]，理解其代数运算与零向量。",
  ),
  prerequisites: ["the-rank-nullity-theorem"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "abstract-vectors-elements",
      title: t("Objects in abstract vector spaces", "抽象向量空间中的元素与运算"),
      explanation: t(
        "In abstract linear algebra, 'vectors' are elements of any set with addition and scalar multiplication satisfying vector space axioms, such as polynomials in ℙₙ or matrices in M_{m×n}.",
        "在抽象线性代数中，'向量'指任何满足向量空间公理的集合中的元素，包括多项式空间 ℙₙ 中的多项式或矩阵空间 M_{m×n} 中的矩阵。",
      ),
      generate(rng) {
        const n = rng.int(2, 30);
        const prompt = t(
          `In the polynomial vector space $\\mathbb{P}_${n}$, what mathematical objects play the role of 'vectors'?`,
          `在多项式向量空间 $\\mathbb{P}_${n}$ 中，什么数学对象充当'向量'的角色？`,
        );
        const right = t(
          `All polynomials with real coefficients of degree at most $${n}$, together with the zero polynomial`,
          `次数不超过 $${n}$ 的实系数多项式及零多项式`,
        );
        const wrong = [
          t(`Only polynomials of degree exactly equal to $${n}$`, `次数严格等于 $${n}$ 的多项式`),
          t(`Column vectors in $\\mathbb{R}^${n}$ whose entries are integers`, `分量为整数的 $\\mathbb{R}^${n}$ 列向量`),
          t(`All rational functions $p(x)/q(x)$ of degree at most $${n}$`, `次数不超过 $${n}$ 的所有有理分式 $p(x)/q(x)$`),
        ];
        const solution = t(
          `$\\mathbb{P}_n$ is defined as the set of all polynomials $p(t) = a_0 + a_1 t + \\dots + a_n t^n$ of degree $\\le n$. Any two such polynomials can be added and scaled by real numbers, staying in $\\mathbb{P}_n$.`,
          `$\\mathbb{P}_n$ 定义为所有次数不超过 $n$ 的实系数多项式集合。两个多项式相加以及数乘后的结果仍为次数不超过 $n$ 的多项式。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "zero-vector-in-abstract-spaces",
      title: t("The zero vector in abstract spaces", "抽象空间中的零向量"),
      explanation: t(
        "Every vector space V has a unique zero vector 0 satisfying v + 0 = v for all v in V. In ℙₙ it is the zero polynomial 0, in M_{m×n} it is the m×n zero matrix O, and in C[a, b] it is the constant zero function f(x) = 0.",
        "每个向量空间 V 都有唯一的零向量 0，满足 v + 0 = v。在 ℙₙ 中为零多项式 0，在 M_{m×n} 中为零矩阵 O，在 C[a, b] 中为恒零函数 f(x) = 0。",
      ),
      generate(rng) {
        const space = rng.pick(["matrices", "functions", "polynomials"]);
        if (space === "matrices") {
          const m = rng.int(2, 6);
          const n = rng.int(2, 6);
          const prompt = t(
            `What is the zero vector in the vector space $M_{${m} \\times ${n}}$ of all $${m} \\times ${n}$ real matrices?`,
            `在所有 $${m} \\times ${n}$ 实矩阵构成的向量空间 $M_{${m} \\times ${n}}$ 中，零向量是什么？`,
          );
          const right = t(
            `The $${m} \\times ${n}$ zero matrix $O$ with all entries equal to 0`,
            `所有元素均为 0 的 $${m} \\times ${n}$ 零矩阵 $O$`,
          );
          const wrong = [
            t(`The identity matrix $I$`, `单位矩阵 $I$`),
            t(`The scalar number $0$`, `实数标量 $0$`),
            t(`The column vector of length $${m}$ with all 0s`, `长度为 $${m}$ 的全零列向量`),
          ];
          const solution = t(
            `The zero vector in $M_{${m} \\times ${n}}$ must satisfy $A + O = A$ for any $${m} \\times ${n}$ matrix $A$. This is uniquely the $${m} \\times ${n}$ matrix with all entries equal to 0.`,
            `$M_{${m} \\times ${n}}$ 中的零向量必须满足对任意矩阵 $A$ 均有 $A + O = A$。这唯一对应元素全为 0 的 $${m} \\times ${n}$ 零矩阵。`,
          );
          return oneOf(rng, prompt, right, wrong, solution);
        }
        if (space === "functions") {
          const a = rng.int(-5, 0);
          const b = rng.int(1, 6);
          const prompt = t(
            `What is the zero vector in the vector space $C[${a}, ${b}]$ of continuous real-valued functions?`,
            `在连续实函数构成的向量空间 $C[${a}, ${b}]$ 中，零向量是什么？`,
          );
          const right = t(
            `The constant zero function $z(x) = 0$ for all $x \\in [${a}, ${b}]$`,
            `在区间 $[${a}, ${b}]$ 上恒等于 0 的常数函数 $z(x) = 0$`,
          );
          const wrong = [
            t(`The constant function $f(x) = 1$`, `常数函数 $f(x) = 1$`),
            t(`The identity function $f(x) = x$`, `恒等函数 $f(x) = x$`),
            t(`The origin $(0, 0)$ in $\\mathbb{R}^2$`, `$\\mathbb{R}^2$ 中的原点 $(0, 0)$`),
          ];
          const solution = t(
            `The additive identity must satisfy $(f + z)(x) = f(x) + z(x) = f(x)$ for all $x \\in [${a}, ${b}]$, which requires $z(x) = 0$ identically.`,
            `加法单位元需满足对任意函数 $f$ 及任意 $x \\in [${a}, ${b}]$ 均有 $(f+z)(x) = f(x)$，故必有 $z(x) \\equiv 0$。`,
          );
          return oneOf(rng, prompt, right, wrong, solution);
        }
        const k = rng.int(2, 10);
        const prompt = t(
          `What is the zero vector in the polynomial vector space $\\mathbb{P}_${k}$?`,
          `在多项式向量空间 $\\mathbb{P}_${k}$ 中，零向量是什么？`,
        );
        const right = t(`The zero polynomial $p(t) = 0$ with all coefficients equal to zero`, `所有系数均为 0 的零多项式 $p(t) = 0$`);
        const wrong = [
          t(`The polynomial $p(t) = 1$`, `多项式 $p(t) = 1$`),
          t(`The monomial $p(t) = t^${k}$`, `单项式 $p(t) = t^${k}$`),
          t(`The zero vector in $\\mathbb{R}^${k}$`, `$\\mathbb{R}^${k}$ 中的零向量`),
        ];
        const solution = t(
          `The zero vector in $\\mathbb{P}_${k}$ is the zero polynomial whose coefficients are all zero, satisfying $q(t) + 0 = q(t)$ for every $q(t) \\in \\mathbb{P}_${k}$.`,
          `$\\mathbb{P}_${k}$ 中的零向量是所有系数均为零的零多项式，满足对任意 $q(t) \\in \\mathbb{P}_${k}$ 均有 $q(t) + 0 = q(t)$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

/** definingAbstractVectorSpaces covers the 8 vector space axioms and verifying exotic operations. */
export const definingAbstractVectorSpaces: TopicDef = {
  id: "defining-abstract-vector-spaces",
  title: t("Defining Abstract Vector Spaces", "抽象向量空间的公理体系"),
  summary: t(
    "Examine the eight vector space axioms governing addition and scalar multiplication, and determine whether a given set and operations form a vector space.",
    "掌握支配向量加法与标量乘法的八条公理，并检验给定的集合与代数运算是否构成向量空间。",
  ),
  prerequisites: ["introduction-to-abstract-vector-spaces"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "identify-vector-space-axioms",
      title: t("Identifying vector space axioms", "识别向量空间公理"),
      explanation: t(
        "The axioms include associativity and commutativity of addition, existence of zero and additive inverses, distributivity of scalar multiplication over vector addition c(u+v) = cu+cv, distributivity over scalar addition (c+d)u = cu+du, associativity of scaling c(du) = (cd)u, and 1u = u.",
        "公理包括加法结合律、加法交换律、零元存在性、负元存在性、数乘对向量加法的分配律 c(u+v) = cu+cv、数乘对标量加法的分配律 (c+d)u = cu+du、数乘结合律 c(du) = (cd)u 以及标量乘单位元 1u = u。",
      ),
      generate(rng) {
        const type = rng.pick(["distrib-vector", "distrib-scalar", "assoc-scalar", "inverse"]);
        const sc1 = rng.nonZero(-5, 5);
        const sc2 = rng.nonZero(-5, 5);
        if (type === "distrib-vector") {
          const prompt = t(
            `Which vector space axiom is demonstrated by the identity $${sc1}(\\mathbf{u} + \\mathbf{v}) = ${sc1}\\mathbf{u} + ${sc1}\\mathbf{v}$ for scalar $c = ${sc1}$ and vectors $\\mathbf{u}, \\mathbf{v}$?`,
            `等式 $${sc1}(\\mathbf{u} + \\mathbf{v}) = ${sc1}\\mathbf{u} + ${sc1}\\mathbf{v}$ 对标量 $c = ${sc1}$ 与向量 $\\mathbf{u}, \\mathbf{v}$ 成立，体现了哪条向量空间公理？`,
          );
          const right = t(`Distributivity of scalar multiplication with respect to vector addition`, `标量乘法对向量加法的分配律`);
          const wrong = [
            t(`Distributivity of scalar multiplication with respect to scalar addition`, `标量乘法对标量加法的分配律`),
            t(`Associativity of vector addition`, `向量加法的结合律`),
            t(`Commutativity of scalar multiplication`, `标量乘法的交换律`),
          ];
          const solution = t(
            `The scalar distributes over the sum of two vectors $(\\mathbf{u} + \\mathbf{v})$, which is the distributive property of scalar multiplication over vector addition.`,
            `标量分配到两个向量的和 $(\\mathbf{u} + \\mathbf{v})$ 上，属于标量乘法对向量加法的分配律。`,
          );
          return oneOf(rng, prompt, right, wrong, solution);
        }
        if (type === "distrib-scalar") {
          const prompt = t(
            `Which vector space axiom is demonstrated by $(${sc1} + ${sc2})\\mathbf{u} = ${sc1}\\mathbf{u} + ${sc2}\\mathbf{u}$ for scalars $c = ${sc1}, d = ${sc2}$ and vector $\\mathbf{u}$?`,
            `等式 $(${sc1} + ${sc2})\\mathbf{u} = ${sc1}\\mathbf{u} + ${sc2}\\mathbf{u}$ 对标量 $c = ${sc1}, d = ${sc2}$ 与向量 $\\mathbf{u}$ 成立，体现了哪条向量空间公理？`,
          );
          const right = t(`Distributivity of scalar multiplication with respect to scalar addition`, `标量乘法对标量加法的分配律`);
          const wrong = [
            t(`Distributivity of scalar multiplication with respect to vector addition`, `标量乘法对向量加法的分配律`),
            t(`Associativity of scalar multiplication`, `标量乘法的结合律`),
            t(`Existence of additive identity`, `加法单位元的存在性`),
          ];
          const solution = t(
            `The sum of two scalars scales a single vector $\\mathbf{u}$, distributing across the scalar addition.`,
            `两个标量的和与向量 $\\mathbf{u}$ 做数乘，属于标量乘法对标量加法的分配律。`,
          );
          return oneOf(rng, prompt, right, wrong, solution);
        }
        if (type === "assoc-scalar") {
          const prompt = t(
            `Which vector space axiom is demonstrated by $${sc1}(${sc2}\\mathbf{u}) = (${sc1 * sc2})\\mathbf{u}$ for vector $\\mathbf{u}$?`,
            `等式 $${sc1}(${sc2}\\mathbf{u}) = (${sc1 * sc2})\\mathbf{u}$ 对向量 $\\mathbf{u}$ 成立，体现了哪条向量空间公理？`,
          );
          const right = t(`Associativity of scalar multiplication`, `标量乘法的结合律`);
          const wrong = [
            t(`Commutativity of vector addition`, `向量加法的交换律`),
            t(`Distributivity of scalar multiplication`, `标量乘法的分配律`),
            t(`Unitary property of scalar multiplication`, `标量乘法的单位元性质`),
          ];
          const solution = t(
            `Scaling by $d$ then by $c$ is the same as scaling by the product $cd$, which is scalar multiplication associativity.`,
            `先数乘 $d$ 再数乘 $c$ 等于直接数乘积 $cd$，这是标量乘法的结合律。`,
          );
          return oneOf(rng, prompt, right, wrong, solution);
        }
        const prompt = t(
          `For a vector $\\mathbf{u}$ with identifier index ${Math.abs(sc1)}, which vector space axiom guarantees that there exists a vector $-\\mathbf{u}$ such that $\\mathbf{u} + (-\\mathbf{u}) = \\mathbf{0}$?`,
          `对于向量 $\\mathbf{u}$（编号 ${Math.abs(sc1)}），哪条向量空间公理保证必定存在向量 $-\\mathbf{u}$ 使得 $\\mathbf{u} + (-\\mathbf{u}) = \\mathbf{0}$？`,
        );
        const right = t(`Existence of additive inverse`, `加法逆元（负元）的存在性`);
        const wrong = [
          t(`Existence of additive identity`, `加法单位元的存在性`),
          t(`Closure under scalar multiplication`, `标量乘法的封闭性`),
          t(`Commutativity of addition`, `加法交换律`),
        ];
        const solution = t(
          `This is the axiom asserting the existence of an additive inverse for every element in the space.`,
          `这是保证集合中每一个元素都存在加法逆元（负向量）的公理。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "verify-nonstandard-operations",
      title: t("Testing non-standard operations", "检验非标准运算是否满足公理"),
      explanation: t(
        "When addition or scalar multiplication is redefined non-standardly, one or more axioms may fail. For example, if c(x, y) = (cx, 0), the identity axiom 1u = u fails when y ≠ 0.",
        "当重新定义非标准的加法或数乘时，某些公理可能不成立。例如若定义 c(x, y) = (cx, 0)，当 y ≠ 0 时单位元公理 1u = u 将失效。",
      ),
      generate(rng) {
        const k = rng.nonZero(-25, 25);
        const prompt = t(
          `On $\\mathbb{R}^2$, define vector addition non-standardly by $(x, y) \\oplus (u, v) = (x + u + ${k}, y + v)$, and define scalar multiplication as usual. Which vector space axiom fails?`,
          `在 $\\mathbb{R}^2$ 上，向量加法非标准地定义为 $(x, y) \\oplus (u, v) = (x + u + ${k}, y + v)$，标量乘法采用通常定义。哪条向量空间公理不成立？`,
        );
        const right = t(
          `Distributivity of scalar multiplication over vector addition ($c(\\mathbf{u} \\oplus \\mathbf{v}) = c\\mathbf{u} \\oplus c\\mathbf{v}$) fails`,
          `标量乘法对向量加法的分配律（$c(\\mathbf{u} \\oplus \\mathbf{v}) = c\\mathbf{u} \\oplus c\\mathbf{v}$）失效`,
        );
        const wrong = [
          t(`Commutativity of vector addition fails`, `向量加法交换律不成立`),
          t(`Closure under vector addition fails`, `向量加法封闭性不成立`),
          t(`Associativity of scalar multiplication fails`, `标量乘法结合律不成立`),
        ];
        const solution = t(
          `For scalar $c = 2$ and $\\mathbf{u} = \\mathbf{0}, \\mathbf{v} = \\mathbf{0}$, $c(\\mathbf{u} \\oplus \\mathbf{v}) = 2(${k}, 0) = (${2 * k}, 0)$, while $c\\mathbf{u} \\oplus c\\mathbf{v} = \\mathbf{0} \\oplus \\mathbf{0} = (${k}, 0) \\neq (${2 * k}, 0)$ because $k \\neq 0$. Thus distributivity over vector addition fails.`,
          `取标量 $c = 2$ 及 $\\mathbf{u} = \\mathbf{0}, \\mathbf{v} = \\mathbf{0}$，左边 $c(\\mathbf{u} \\oplus \\mathbf{v}) = 2(${k}, 0) = (${2 * k}, 0)$，而右边 $c\\mathbf{u} \\oplus c\\mathbf{v} = \\mathbf{0} \\oplus \\mathbf{0} = (${k}, 0) \\neq (${2 * k}, 0)$（因为 $k \\neq 0$）。因此分配律失效。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

/** linearIndependenceInAbstractVectorSpaces covers linear independence of polynomials in P_n and matrices in M_{m×n}. */
export const linearIndependenceInAbstractVectorSpaces: TopicDef = {
  id: "linear-independence-in-abstract-vector-spaces",
  title: t("Linear Independence in Abstract Vector Spaces", "抽象向量空间中的线性相关与无关"),
  summary: t(
    "Determine whether sets of polynomials in ℙₙ or matrices in M_{m×n} are linearly independent by setting linear combinations equal to the zero vector.",
    "通过建立线性组合等于零向量的方程，判定多项式空间 ℙₙ 或矩阵空间 M_{m×n} 中向量组的线性相关性。",
  ),
  prerequisites: ["defining-abstract-vector-spaces"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "independence-of-polynomials",
      title: t("Linear independence of polynomials in ℙ₂", "ℙ₂ 中多项式组的线性相关性"),
      explanation: t(
        "Polynomials p₁, ..., pₖ are linearly independent if c₁p₁(t) + ... + cₖpₖ(t) = 0 for all t implies c₁ = ... = cₖ = 0. Equating coefficients of like powers yields a linear system.",
        "若由 c₁p₁(t) + ... + cₖpₖ(t) ≡ 0 能推出 c₁ = ... = cₖ = 0，则多项式组线性无关。通过比较同次项系数可转化为常系数线性方程组。",
      ),
      generate(rng) {
        const isDep = rng.bool();
        const a = rng.nonZero(-2, 2);
        const b = rng.nonZero(-2, 2);
        const p1Str = a > 0 ? `1 + ${a}t` : `1 - ${Math.abs(a)}t`;
        const p2Str = b > 0 ? `t + ${b}t^2` : `t - ${Math.abs(b)}t^2`;
        let p3Str: string;
        if (isDep) {
          const mid = 2 * a + 1;
          const midStr = mid >= 0 ? `+ ${mid}t` : `- ${Math.abs(mid)}t`;
          const endStr = b > 0 ? `+ ${b}t^2` : `- ${Math.abs(b)}t^2`;
          p3Str = `2 ${midStr} ${endStr}`;
        } else {
          p3Str = `t^2`;
        }
        const prompt = t(
          `Determine whether the set of polynomials $S = \\left\\{ p_1(t) = ${p1Str}, \\; p_2(t) = ${p2Str}, \\; p_3(t) = ${p3Str} \\right\\}$ in $\\mathbb{P}_2$ is linearly independent.`,
          `判断多项式空间 $\\mathbb{P}_2$ 中的多项式组 $S = \\left\\{ p_1(t) = ${p1Str}, \\; p_2(t) = ${p2Str}, \\; p_3(t) = ${p3Str} \\right\\}$ 是否线性无关。`,
        );
        const right = isDep
          ? t(`Linearly dependent, because $2p_1(t) + p_2(t) - p_3(t) = 0$`, `线性相关，因为 $2p_1(t) + p_2(t) - p_3(t) = 0$`)
          : t(
              `Linearly independent, because $c_1 p_1(t) + c_2 p_2(t) + c_3 p_3(t) = 0$ implies $c_1 = c_2 = c_3 = 0$`,
              `线性无关，因为 $c_1 p_1(t) + c_2 p_2(t) + c_3 p_3(t) = 0$ 能推出 $c_1 = c_2 = c_3 = 0$`,
            );
        const wrong = isDep
          ? [
              t(`Linearly independent, because they all have different degrees`, `线性无关，因为它们的次数各不相同`),
              t(`Linearly independent, because none of the polynomials is the zero polynomial`, `线性无关，因为没有多项式是零多项式`),
              t(`Linearly dependent, but only for $t = 0$`, `线性相关，但仅对 $t = 0$ 成立`),
            ]
          : [
              t(`Linearly dependent, because there are 3 polynomials in $\\mathbb{P}_2$`, `线性相关，因为 $\\mathbb{P}_2$ 中有 3 个多项式`),
              t(`Linearly dependent, because $p_1(0) \\neq 0$`, `线性相关，因为 $p_1(0) \\neq 0$`),
              t(`Linearly dependent, because $p_1(t) + p_2(t) = p_3(t)$`, `线性相关，因为 $p_1(t) + p_2(t) = p_3(t)$`),
            ];
        const solution = isDep
          ? t(
              `Notice that $p_3(t) = 2p_1(t) + p_2(t)$. Since one polynomial is a linear combination of the others, the set is linearly dependent.`,
              `注意到 $p_3(t) = 2p_1(t) + p_2(t)$。因其中一个多项式是其余多项式的线性组合，故该多项式组线性相关。`,
            )
          : t(
              `Setting $c_1 p_1(t) + c_2 p_2(t) + c_3 p_3(t) = 0$ and equating coefficients of $1, t, t^2$ gives an upper triangular system with nonzero diagonal entries, which has only the trivial solution $c_1 = c_2 = c_3 = 0$. Thus the set is linearly independent.`,
              `令 $c_1 p_1(t) + c_2 p_2(t) + c_3 p_3(t) = 0$，比较常数项、一次项与二次项系数，得到对角元非零的三角方程组，仅有零解 $c_1 = c_2 = c_3 = 0$。因此线性无关。`,
            );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "independence-of-matrices-m22",
      title: t("Linear independence of matrices in M_{2×2}", "M_{2×2} 中矩阵组的线性相关性"),
      explanation: t(
        "A set of matrices {A₁, ..., Aₖ} is linearly independent if c₁A₁ + ... + cₖAₖ = O implies all scalars cᵢ = 0.",
        "若 c₁A₁ + ... + cₖAₖ = O 蕴含所有标量 cᵢ = 0，则矩阵组 {A₁, ..., Aₖ} 线性无关。",
      ),
      generate(rng) {
        const isDep = rng.bool();
        const a = rng.nonZero(-2, 2);
        const b = rng.nonZero(-2, 2);
        const A1 = [
          [1, 0],
          [0, a],
        ];
        const A2 = [
          [0, 1],
          [b, 0],
        ];
        let A3: number[][];
        if (isDep) {
          A3 = [
            [2, 1],
            [b, 2 * a],
          ];
        } else {
          A3 = [
            [0, 0],
            [1, 0],
          ];
        }
        const prompt = t(
          `Determine whether the set $\\left\\{ ${matLatex(A1)}, ${matLatex(A2)}, ${matLatex(A3)} \\right\\}$ in $M_{2 \\times 2}$ is linearly independent.`,
          `判断 $M_{2 \\times 2}$ 中的矩阵组 $\\left\\{ ${matLatex(A1)}, ${matLatex(A2)}, ${matLatex(A3)} \\right\\}$ 是否线性无关。`,
        );
        const right = isDep
          ? t(`Linearly dependent, because the third matrix is $2A_1 + A_2$`, `线性相关，因为第三个矩阵等于 $2A_1 + A_2$`)
          : t(
              `Linearly independent, because $c_1 A_1 + c_2 A_2 + c_3 A_3 = O$ has only the trivial solution`,
              `线性无关，因为 $c_1 A_1 + c_2 A_2 + c_3 A_3 = O$ 只有零解`,
            );
        const wrong = isDep
          ? [
              t(`Linearly independent, because all three matrices are invertible`, `线性无关，因为三个矩阵都可逆`),
              t(`Linearly independent, because their traces are distinct`, `线性无关，因为它们的迹互不相同`),
              t(`Linearly dependent, but only if $a = b$`, `线性相关，但仅在 $a = b$ 时成立`),
            ]
          : [
              t(
                `Linearly dependent, because 3 matrices in $M_{2 \\times 2}$ are always dependent`,
                `线性相关，因为 $M_{2 \\times 2}$ 中的 3 个矩阵必定相关`,
              ),
              t(`Linearly dependent, because one matrix has zero determinant`, `线性相关，因为其中一个矩阵的行列式为 0`),
              t(`Linearly dependent, because $A_1 + A_2 = A_3$`, `线性相关，因为 $A_1 + A_2 = A_3$`),
            ];
        const solution = isDep
          ? t(
              `Entry-by-entry inspection reveals $A_3 = 2A_1 + A_2$. Thus $2A_1 + A_2 - A_3 = O$ is a non-trivial linear relation, proving linear dependence.`,
              `对应位置逐项比对可知 $A_3 = 2A_1 + A_2$。故 $2A_1 + A_2 - A_3 = O$ 为非平凡相关关系，证明矩阵组线性相关。`,
            )
          : t(
              `Setting $c_1 A_1 + c_2 A_2 + c_3 A_3 = O$ yields equations for each of the 4 entries: $c_1 = 0$, $c_2 = 0$, and $(b c_2 + c_3) = 0 \\implies c_3 = 0$. Hence only the trivial solution exists, so the matrices are linearly independent.`,
              `令 $c_1 A_1 + c_2 A_2 + c_3 A_3 = O$，比较 4 个位置的元素得 $c_1 = 0$，$c_2 = 0$ 及 $b c_2 + c_3 = 0 \\implies c_3 = 0$。只有平凡零解，故线性无关。`,
            );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

/** subspacesOfAbstractVectorSpaces covers verifying subspace criteria for polynomial subsets and matrix subsets. */
export const subspacesOfAbstractVectorSpaces: TopicDef = {
  id: "subspaces-of-abstract-vector-spaces",
  title: t("Subspaces of Abstract Vector Spaces", "抽象向量空间的子空间"),
  summary: t(
    "Verify the three subspace criteria (zero element, closure under addition and scalar multiplication) for subsets of ℙₙ and M_{n×n}.",
    "在多项式空间 ℙₙ 与方阵空间 M_{n×n} 中，通过检验零元、加法封闭与数乘封闭判定子空间。",
  ),
  prerequisites: ["defining-abstract-vector-spaces"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "subspaces-of-polynomial-spaces",
      title: t("Subspaces of ℙₙ", "ℙₙ 的子空间判定"),
      explanation: t(
        "A subset of ℙₙ defined by homogeneous linear conditions on evaluations or derivatives (e.g. p(0) = 0 or p'(1) = 0) is a subspace. Subsets with non-zero values (e.g. p(0) = 1) or fixed degree conditions are not.",
        "由函数值或导数的齐次线性条件（如 p(0) = 0 或 p'(1) = 0）定义的 ℙₙ 子集是子空间。非齐次条件（如 p(0) = 1）或固定次数条件则不是子空间。",
      ),
      generate(rng) {
        const x0 = rng.int(-5, 5);
        const k = rng.nonZero(1, 9);
        const n = rng.int(2, 6);
        const prompt = t(
          `Consider the subsets of $\\mathbb{P}_${n}$: $W_1 = \\{ p(t) \\in \\mathbb{P}_${n} \\mid p(${x0}) = 0 \\}$, $W_2 = \\{ p(t) \\in \\mathbb{P}_${n} \\mid p(${x0}) = ${k} \\}$, and $W_3 = \\{ p(t) \\in \\mathbb{P}_${n} \\mid \\deg(p) = ${n} \\}$. Which of these is a subspace of $\\mathbb{P}_${n}$?`,
          `考虑 $\\mathbb{P}_${n}$ 的子集：$W_1 = \\{ p(t) \\in \\mathbb{P}_${n} \\mid p(${x0}) = 0 \\}$，$W_2 = \\{ p(t) \\in \\mathbb{P}_${n} \\mid p(${x0}) = ${k} \\}$ 及 $W_3 = \\{ p(t) \\in \\mathbb{P}_${n} \\mid \\deg(p) = ${n} \\}$。其中哪一个是 $\\mathbb{P}_${n}$ 的子空间？`,
        );
        const right = t(`Only $W_1$`, `仅有 $W_1$`);
        const wrong = [
          t(`Only $W_2$`, `仅有 $W_2$`),
          t(`Both $W_1$ and $W_2$`, `$W_1$ 与 $W_2$ 都是`),
          t(`All three are subspaces`, `三个都是子空间`),
        ];
        const solution = t(
          `$W_1$ contains the zero polynomial ($0(${x0}) = 0$) and if $p(${x0}) = 0, q(${x0}) = 0$, then $(p+q)(${x0}) = 0$ and $(cp)(${x0}) = 0$. $W_2$ does not contain the zero polynomial ($0 \\neq ${k}$). $W_3$ does not contain the zero polynomial (which has degree $-\\infty$). Hence only $W_1$ is a subspace.`,
          `$W_1$ 包含零多项式且满足加法与数乘封闭性，故为子空间。$W_2$ 不含零多项式（$0 \\neq ${k}$）；$W_3$ 不含零多项式（零多项式没有确定的正次数）。因此仅有 $W_1$ 是子空间。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "subspaces-of-matrix-spaces",
      title: t("Subspaces of matrix spaces M_{n×n}", "矩阵空间 M_{n×n} 的子空间"),
      explanation: t(
        "Subsets of M_{n×n} defined by linear constraints, such as symmetric matrices (Aᵀ = A), diagonal matrices, or matrices with zero trace (tr(A) = 0), form subspaces. Invertible matrices do NOT form a subspace (not closed under addition, no zero matrix).",
        "由线性条件定义的 M_{n×n} 子集（如对称矩阵 Aᵀ = A、对角矩阵或零迹矩阵 tr(A) = 0）构成子空间。可逆矩阵不构成子空间（对加法不封闭，且不含零矩阵）。",
      ),
      generate(rng) {
        const n = rng.int(2, 35);
        const prompt = t(
          `Which of the following subsets of $M_{${n} \\times ${n}}$ is a valid subspace?`,
          `在 $M_{${n} \\times ${n}}$ 中，下列哪一个子集是其子空间？`,
        );
        const right = t(
          `The set of all symmetric matrices: $\\{ A \\in M_{${n} \\times ${n}} \\mid A^T = A \\}$`,
          `所有对称矩阵的集合：$\\{ A \\in M_{${n} \\times ${n}} \\mid A^T = A \\}$`,
        );
        const wrong = [
          t(
            `The set of all invertible matrices: $\\{ A \\in M_{${n} \\times ${n}} \\mid \\det(A) \\neq 0 \\}$`,
            `所有可逆矩阵的集合：$\\{ A \\in M_{${n} \\times ${n}} \\mid \\det(A) \\neq 0 \\}$`,
          ),
          t(
            `The set of matrices with determinant 1: $\\{ A \\in M_{${n} \\times ${n}} \\mid \\det(A) = 1 \\}$`,
            `行列式为 1 的矩阵集合：$\\{ A \\in M_{${n} \\times ${n}} \\mid \\det(A) = 1 \\}$`,
          ),
          t(
            `The set of orthogonal matrices: $\\{ A \\in M_{${n} \\times ${n}} \\mid A^T A = I \\}$`,
            `正交矩阵的集合：$\\{ A \\in M_{${n} \\times ${n}} \\mid A^T A = I \\}$`,
          ),
        ];
        const solution = t(
          `The zero matrix is symmetric ($O^T = O$). If $A^T = A$ and $B^T = B$, then $(A + B)^T = A^T + B^T = A + B$ and $(cA)^T = cA^T = cA$. Thus symmetric matrices form a subspace. The invertible matrices do not contain $O$, nor are they closed under addition (e.g. $I + (-I) = O$).`,
          `零矩阵是对称的（$O^T = O$），且对称性对矩阵加法和数乘保持封闭，因此对称矩阵构成子空间。可逆矩阵不含零矩阵，且对加法不封闭（如 $I + (-I) = O$）。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

/** basesInAbstractVectorSpaces covers standard bases for P_n and M_{2×2} and verifying abstract bases. */
export const basesInAbstractVectorSpaces: TopicDef = {
  id: "bases-in-abstract-vector-spaces",
  title: t("Bases in Abstract Vector Spaces", "抽象向量空间的基"),
  summary: t(
    "Identify standard bases for polynomial spaces ℙₙ and matrix spaces M_{m×n}, and verify whether a given set forms a basis.",
    "掌握多项式空间 ℙₙ 与矩阵空间 M_{m×n} 的标准基，并验证给定的抽象向量组是否构成基。",
  ),
  prerequisites: ["linear-independence-in-abstract-vector-spaces"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "standard-bases-abstract",
      title: t("Standard bases for ℙₙ and M_{2×2}", "ℙₙ 与 M_{2×2} 的标准基"),
      explanation: t(
        "The standard basis for ℙₙ is {1, t, t², ..., tⁿ}, containing n + 1 polynomials. The standard basis for M_{2×2} consists of the four elementary matrices E₁₁, E₁₂, E₂₁, E₂₂.",
        "多项式空间 ℙₙ 的标准基为 {1, t, t², ..., tⁿ}，共含 n + 1 个多项式。矩阵空间 M_{2×2} 的标准基由 4 个单位元素矩阵 E₁₁, E₁₂, E₂₁, E₂₂ 组成。",
      ),
      generate(rng) {
        const n = rng.int(2, 40);
        const prompt = t(
          `What is the standard basis for the polynomial vector space $\\mathbb{P}_${n}$?`,
          `多项式向量空间 $\\mathbb{P}_${n}$ 的标准基是什么？`,
        );
        const powers = Array.from({ length: n + 1 }, (_, i) => (i === 0 ? "1" : i === 1 ? "t" : `t^${i}`));
        const right = t(`$\\left\\{ ${powers.join(", ")} \\right\\}$`, `$\\left\\{ ${powers.join(", ")} \\right\\}$`);
        const powersNo1 = Array.from({ length: n }, (_, i) => (i === 0 ? "t" : `t^${i + 1}`));
        const wrong = [
          t(`$\\left\\{ ${powersNo1.join(", ")} \\right\\}$`, `$\\left\\{ ${powersNo1.join(", ")} \\right\\}$`),
          t(`$\\left\\{ 1 + t + \\dots + t^${n} \\right\\}$`, `$\\left\\{ 1 + t + \\dots + t^${n} \\right\\}$`),
          t(`$\\left\\{ t^${n} \\right\\}$`, `$\\left\\{ t^${n} \\right\\}$`),
        ];
        const solution = t(
          `Every polynomial in $\\mathbb{P}_${n}$ is uniquely written as $a_0(1) + a_1(t) + \\dots + a_${n}(t^${n})$. The set of monomials $\\{${powers.join(", ")}\\}$ is linearly independent and spans $\\mathbb{P}_${n}$, making it the standard basis.`,
          `$\\mathbb{P}_${n}$ 中的任意多项式均可唯一表示为 $a_0(1) + a_1(t) + \\dots + a_${n}(t^${n})$。单项式集合 $\\{${powers.join(", ")}\\}$ 线性无关且张成全空间，故为标准基。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "verify-basis-in-polynomial-space",
      title: t("Verifying a basis for ℙ₂", "验证 ℙ₂ 的一组非标准基"),
      explanation: t(
        "A set of 3 polynomials in ℙ₂ forms a basis if and only if they are linearly independent (which in turn guarantees they span the 3-dimensional space ℙ₂).",
        "ℙ₂ 中的 3 个多项式构成基，当且仅当它们线性无关（这也保证了它们必能张成 3 维空间 ℙ₂）。",
      ),
      generate(rng) {
        const isBasis = rng.bool();
        const a = rng.nonZero(-5, 5);
        const b = rng.nonZero(-5, 5);
        const c = rng.int(-4, 4);
        const p1 = `1`;
        const p2 = a > 0 ? `1 + ${a}t` : `1 - ${Math.abs(a)}t`;
        const p3 = isBasis ? (b > 0 ? `1 + ${c}t + ${b}t^2` : `1 + ${c}t - ${Math.abs(b)}t^2`) : `2 + ${2 * a}t`; // 2*p2, dependent
        const prompt = t(
          `Does the set $\\mathcal{B} = \\left\\{ ${p1}, \\; ${p2}, \\; ${p3} \\right\\}$ form a basis for $\\mathbb{P}_2$?`,
          `集合 $\\mathcal{B} = \\left\\{ ${p1}, \\; ${p2}, \\; ${p3} \\right\\}$ 是否构成 $\\mathbb{P}_2$ 的一组基？`,
        );
        const right = isBasis
          ? t(
              `Yes, because the 3 polynomials have degrees 0, 1, and 2, which guarantees linear independence and spanning for 3-dimensional $\\mathbb{P}_2$`,
              `是，因为 3 个多项式的次数分别为 0、1、2，保证了线性无关且能张成 3 维空间 $\\mathbb{P}_2$`,
            )
          : t(
              `No, because the third polynomial is a scalar multiple of the second, so the set is linearly dependent`,
              `否，因为第三个多项式是第二个的标量倍数，向量组线性相关`,
            );
        const wrong = isBasis
          ? [
              t(`No, because only the standard basis $\\{1, t, t^2\\}$ can be a basis`, `否，因为只有标准基 $\\{1, t, t^2\\}$ 才能成为基`),
              t(`No, because a basis for $\\mathbb{P}_2$ must contain 2 polynomials`, `否，因为 $\\mathbb{P}_2$ 的基必须包含 2 个多项式`),
              t(`Yes, but only for $t > 0$`, `是，但仅当 $t > 0$ 时成立`),
            ]
          : [
              t(`Yes, because any 3 polynomials form a basis for $\\mathbb{P}_2$`, `是，因为任意 3 个多项式都构成 $\\mathbb{P}_2$ 的基`),
              t(`Yes, because none of the polynomials is zero`, `是，因为其中没有零多项式`),
              t(`No, because $\\mathbb{P}_2$ is infinite-dimensional`, `否，因为 $\\mathbb{P}_2$ 是无限维的`),
            ];
        const solution = isBasis
          ? t(
              `The polynomials have strictly increasing degrees (0, 1, 2). The coordinate matrix relative to $\\{1, t, t^2\\}$ is triangular with non-zero diagonal entries, so its determinant is non-zero. Since $\\dim(\\mathbb{P}_2) = 3$, these 3 linearly independent polynomials form a basis.`,
              `三个多项式的次数严格递增（0、1、2）。相对于标准基的坐标矩阵为上三角阵且对角元全非零，行列式非零，故线性无关。由于 $\\dim(\\mathbb{P}_2) = 3$，3 个线性无关的多项式必构成基。`,
            )
          : t(
              `The second and third polynomials are proportional, so the set is linearly dependent and cannot be a basis.`,
              `第二个与第三个多项式成比例，该集合线性相关，因此不能构成基。`,
            );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

/** theCoordinatesOfAVectorRelativeToABasisInAbstractVectorSpaces covers coordinate isomorphism [v]_B in ℝⁿ for abstract spaces. */
export const theCoordinatesOfAVectorRelativeToABasisInAbstractVectorSpaces: TopicDef = {
  id: "the-coordinates-of-a-vector-relative-to-a-basis-in-abstract-vector-spaces",
  title: t("The Coordinates of a Vector Relative to a Basis in Abstract Vector Spaces", "抽象向量在基下的坐标映射"),
  summary: t(
    "Determine coordinate vectors [v]_ℬ ∈ ℝⁿ for polynomials and matrices relative to ordered bases, illustrating the coordinate isomorphism.",
    "求解多项式与矩阵在有序基下的坐标向量 [v]_ℬ ∈ ℝⁿ，理解坐标同构映射。",
  ),
  prerequisites: ["bases-in-abstract-vector-spaces"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "polynomial-coordinate-vector",
      title: t("Coordinate vector of a polynomial in ℙ₂", "ℙ₂ 中多项式的坐标向量"),
      explanation: t(
        "For the ordered standard basis ℬ = {1, t, t²} of ℙ₂, the polynomial p(t) = a₀ + a₁t + a₂t² has coordinate vector [p]_ℬ = (a₀, a₁, a₂)ᵀ.",
        "对于 ℙ₂ 的有序标准基 ℬ = {1, t, t²}，多项式 p(t) = a₀ + a₁t + a₂t² 的坐标向量为 [p]_ℬ = (a₀, a₁, a₂)ᵀ。",
      ),
      generate(rng) {
        const a0 = rng.int(-5, 5);
        const a1 = rng.nonZero(-5, 5);
        const a2 = rng.nonZero(-5, 5);
        const a1Str = a1 > 0 ? `+ ${a1 === 1 ? "" : a1}t` : `- ${a1 === -1 ? "" : Math.abs(a1)}t`;
        const a2Str = a2 > 0 ? `+ ${a2 === 1 ? "" : a2}t^2` : `- ${a2 === -1 ? "" : Math.abs(a2)}t^2`;
        const polyStr = `${a0} ${a1Str} ${a2Str}`;
        const prompt = t(
          `Find the coordinate vector $[p(t)]_{\\mathcal{B}}$ of the polynomial $p(t) = ${polyStr}$ relative to the ordered standard basis $\\mathcal{B} = \\{1, t, t^2\\}$ of $\\mathbb{P}_2$.`,
          `求多项式 $p(t) = ${polyStr}$ 在 $\\mathbb{P}_2$ 的有序标准基 $\\mathcal{B} = \\{1, t, t^2\\}$ 下的坐标向量 $[p(t)]_{\\mathcal{B}}$。`,
        );
        const right = t(`$${colVecLatex([a0, a1, a2])}$`, `$${colVecLatex([a0, a1, a2])}$`);
        const wrong = [
          t(`$${colVecLatex([a2, a1, a0])}$`, `$${colVecLatex([a2, a1, a0])}$`),
          t(`$${colVecLatex([a0, -a1, a2])}$`, `$${colVecLatex([a0, -a1, a2])}$`),
          t(`$${colVecLatex([a1, a2, a0])}$`, `$${colVecLatex([a1, a2, a0])}$`),
        ];
        const solution = t(
          `Writing $p(t) = (${a0})\\cdot 1 + (${a1})\\cdot t + (${a2})\\cdot t^2$, the coefficients with respect to the ordered basis $\\{1, t, t^2\\}$ are $a_0 = ${a0}$, $a_1 = ${a1}$, and $a_2 = ${a2}$. Thus $[p(t)]_{\\mathcal{B}} = ${colVecLatex([a0, a1, a2])}$.`,
          `将多项式写为 $p(t) = (${a0})\\cdot 1 + (${a1})\\cdot t + (${a2})\\cdot t^2$，对应基 $\\{1, t, t^2\\}$ 的各分量系数分别为 $a_0 = ${a0}$，$a_1 = ${a1}$，$a_2 = ${a2}$。故坐标向量为 $[p(t)]_{\\mathcal{B}} = ${colVecLatex([a0, a1, a2])}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "matrix-coordinate-vector-m22",
      title: t("Coordinate vector of a 2×2 matrix", "2×2 矩阵在标准基下的坐标向量"),
      explanation: t(
        "For M_{2×2} with standard ordered basis ℬ = {E₁₁, E₁₂, E₂₁, E₂₂}, the matrix [[a, b], [c, d]] has coordinate vector [M]_ℬ = (a, b, c, d)ᵀ in ℝ⁴.",
        "在 M_{2×2} 中，关于标准有序基 ℬ = {E₁₁, E₁₂, E₂₁, E₂₂}，矩阵 [[a, b], [c, d]] 的坐标向量为 ℝ⁴ 中的 (a, b, c, d)ᵀ。",
      ),
      generate(rng) {
        const a = rng.int(-4, 4);
        const b = rng.int(-4, 4);
        const c = rng.int(-4, 4);
        const d = rng.int(-4, 4);
        const M = [
          [a, b],
          [c, d],
        ];
        const prompt = t(
          `Find the coordinate vector $[M]_{\\mathcal{B}}$ of the matrix $M = ${matLatex(M)}$ relative to the standard ordered basis $\\mathcal{B} = \\left\\{ \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}, \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}, \\begin{pmatrix} 0 & 0 \\\\ 1 & 0 \\end{pmatrix}, \\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix} \\right\\}$ of $M_{2 \\times 2}$.`,
          `求矩阵 $M = ${matLatex(M)}$ 在 $M_{2 \\times 2}$ 的标准有序基 $\\mathcal{B} = \\left\\{ \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}, \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}, \\begin{pmatrix} 0 & 0 \\\\ 1 & 0 \\end{pmatrix}, \\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix} \\right\\}$ 下的坐标向量 $[M]_{\\mathcal{B}}$。`,
        );
        const right = t(`$${colVecLatex([a, b, c, d])}$`, `$${colVecLatex([a, b, c, d])}$`);
        const wrong = [
          t(`$${colVecLatex([a, c, b, d])}$`, `$${colVecLatex([a, c, b, d])}$`),
          t(`$${colVecLatex([d, c, b, a])}$`, `$${colVecLatex([d, c, b, a])}$`),
          t(`$${colVecLatex([a, b, -c, -d])}$`, `$${colVecLatex([a, b, -c, -d])}$`),
        ];
        const solution = t(
          `Since $M = (${a})E_{11} + (${b})E_{12} + (${c})E_{21} + (${d})E_{22}$, reading the coordinates in the ordered basis gives $[M]_{\\mathcal{B}} = ${colVecLatex([a, b, c, d])} \\in \\mathbb{R}^4$.`,
          `因 $M = (${a})E_{11} + (${b})E_{12} + (${c})E_{21} + (${d})E_{22}$，按基的顺序排列各系数得到 $[M]_{\\mathcal{B}} = ${colVecLatex([a, b, c, d])} \\in \\mathbb{R}^4$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

/** dimensionInAbstractVectorSpaces covers dimension formulas for P_n, M_{m×n}, symmetric matrices, and finite vs infinite dimensional spaces. */
export const dimensionInAbstractVectorSpaces: TopicDef = {
  id: "dimension-in-abstract-vector-spaces",
  title: t("Dimension in Abstract Vector Spaces", "抽象向量空间的维数"),
  summary: t(
    "Calculate the dimension of abstract spaces such as dim(ℙₙ) = n + 1 and dim(M_{m×n}) = mn, and distinguish between finite-dimensional and infinite-dimensional vector spaces.",
    "计算抽象向量空间的维数（如 dim(ℙₙ) = n + 1 与 dim(M_{m×n}) = mn），并区分有限维与无限维向量空间。",
  ),
  prerequisites: ["the-coordinates-of-a-vector-relative-to-a-basis-in-abstract-vector-spaces"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "dimension-formula-abstract-spaces",
      title: t("Dimension formulas for ℙₙ and M_{m×n}", "ℙₙ 与 M_{m×n} 的维数公式"),
      explanation: t(
        "dim(ℙₙ) = n + 1 because its standard basis {1, t, ..., tⁿ} has n + 1 elements. For matrix spaces, dim(M_{m×n}) = mn. For symmetric n×n matrices, the dimension is n(n + 1)/2.",
        "dim(ℙₙ) = n + 1，因为其标准基 {1, t, ..., tⁿ} 包含 n + 1 个元素。矩阵空间的维数为 dim(M_{m×n}) = mn。对于 n 阶对称矩阵子空间，维数为 n(n + 1)/2。",
      ),
      generate(rng) {
        const choice = rng.pick(["polynomials", "matrices", "symmetric"]);
        if (choice === "polynomials") {
          const n = rng.int(2, 7);
          const prompt = t(
            `What is the dimension of the polynomial vector space $\\mathbb{P}_${n}$?`,
            `多项式向量空间 $\\mathbb{P}_${n}$ 的维数是多少？`,
          );
          const right = t(`$${n + 1}$`, `$${n + 1}$`);
          const wrong = [t(`$${n}$`, `$${n}$`), t(`$${n - 1}$`, `$${n - 1}$`), t(`$2^${n}$`, `$2^${n}$`)];
          const solution = t(
            `The standard basis for $\\mathbb{P}_${n}$ is $\\{1, t, t^2, \\dots, t^${n}\\}$, which contains $${n} + 1 = ${n + 1}$ elements. Therefore $\\dim(\\mathbb{P}_${n}) = ${n + 1}$.`,
            `$\\mathbb{P}_${n}$ 的标准基为 $\\{1, t, t^2, \\dots, t^${n}\\}$，共含有 $${n} + 1 = ${n + 1}$ 个基向量。因此 $\\dim(\\mathbb{P}_${n}) = ${n + 1}$。`,
          );
          return oneOf(rng, prompt, right, wrong, solution);
        }
        if (choice === "matrices") {
          const m = rng.int(2, 5);
          const n = rng.int(2, 5);
          const dim = m * n;
          const prompt = t(
            `What is the dimension of the vector space $M_{${m} \\times ${n}}$ of all $${m} \\times ${n}$ matrices?`,
            `所有 $${m} \\times ${n}$ 矩阵构成的向量空间 $M_{${m} \\times ${n}}$ 的维数是多少？`,
          );
          const right = t(`$${dim}$`, `$${dim}$`);
          const wrong = [
            t(`$${m + n}$`, `$${m + n}$`),
            t(`$${Math.max(m, n)}$`, `$${Math.max(m, n)}$`),
            t(`$${Math.min(m, n)}$`, `$${Math.min(m, n)}$`),
          ];
          const solution = t(
            `Each entry in an $m \\times n$ matrix is an independent free parameter. The standard basis consists of $mn = ${m} \\times ${n} = ${dim}$ elementary matrices $E_{ij}$, so the dimension is $${dim}$.`,
            `$m \\times n$ 矩阵中的每个位置都是独立的自由参数。标准基由 $mn = ${m} \\times ${n} = ${dim}$ 个单位矩阵 $E_{ij}$ 组成，因此维数为 $${dim}$。`,
          );
          return oneOf(rng, prompt, right, wrong, solution);
        }
        const n = rng.int(2, 4);
        const dimSym = (n * (n + 1)) / 2;
        const prompt = t(
          `What is the dimension of the subspace of all symmetric $${n} \\times ${n}$ matrices in $M_{${n} \\times ${n}}$?`,
          `在 $M_{${n} \\times ${n}}$ 中，所有 $${n} \\times ${n}$ 对称矩阵构成的子空间的维数是多少？`,
        );
        const right = t(`$${dimSym}$`, `$${dimSym}$`);
        const wrong = [t(`$${n * n}$`, `$${n * n}$`), t(`$${n}$`, `$${n}$`), t(`$${dimSym - 1}$`, `$${dimSym - 1}$`)];
        const solution = t(
          `A symmetric $n \\times n$ matrix is completely determined by the entries on and above the main diagonal. The number of such independent entries is $\\frac{n(n + 1)}{2} = \\frac{${n}(${n + 1})}{2} = ${dimSym}$.`,
          `$n \\times n$ 对称矩阵完全由主对角线及其上方的元素决定。独立元素的个数为 $\\frac{n(n + 1)}{2} = \\frac{${n}(${n + 1})}{2} = ${dimSym}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "finite-vs-infinite-dimensional",
      title: t("Finite vs infinite-dimensional vector spaces", "有限维与无限维向量空间"),
      explanation: t(
        "A vector space is finite-dimensional if it is spanned by a finite set of vectors. Otherwise, it is infinite-dimensional, such as the space ℙ of all polynomials, C[a, b], or C^∞(ℝ).",
        "若向量空间可由有限个向量张成，则为有限维空间；否则为无限维空间，例如所有多项式的空间 ℙ、连续函数空间 C[a, b] 以及光滑函数空间 C^∞(ℝ)。",
      ),
      generate(rng) {
        const a = rng.int(-5, 0);
        const b = rng.int(1, 6);
        const d = rng.int(4, 10);
        const prompt = t(
          `Consider the vector spaces $C[${a}, ${b}]$, $\\mathbb{P}_${d}$, $M_{2 \\times ${d}}$, and $\\mathbb{R}^${d}$. Which of these is an infinite-dimensional vector space?`,
          `考虑向量空间 $C[${a}, ${b}]$、$\\mathbb{P}_${d}$、$M_{2 \\times ${d}}$ 与 $\\mathbb{R}^${d}$。其中哪一个是无限维向量空间？`,
        );
        const right = t(
          `$C[${a}, ${b}]$, the space of all continuous real functions on $[${a}, ${b}]$`,
          `$C[${a}, ${b}]$，区间 $[${a}, ${b}]$ 上的所有连续实函数构成的空间`,
        );
        const wrong = [
          t(`$\\mathbb{P}_${d}$, the space of polynomials of degree at most ${d}`, `$\\mathbb{P}_${d}$，次数不超过 ${d} 的多项式空间`),
          t(`$M_{2 \\times ${d}}$, the space of $2 \\times ${d}$ matrices`, `$M_{2 \\times ${d}}$，所有 $2 \\times ${d}$ 矩阵构成的空间`),
          t(`$\\mathbb{R}^${d}$, the ${d}-dimensional Euclidean space`, `$\\mathbb{R}^${d}$，${d} 维欧几里得空间`),
        ];
        const solution = t(
          `$C[${a}, ${b}]$ contains linearly independent sets of arbitrary finite size (for example, $\\{1, x, x^2, x^3, \\dots\\}$), so no finite set of functions can span it. Hence $C[${a}, ${b}]$ is infinite-dimensional. $\\mathbb{P}_${d}$ has dimension ${d + 1}$, $M_{2 \\times ${d}}$ has dimension ${2 * d}$, and $\\mathbb{R}^${d}$ has dimension ${d}$.`,
          `$C[${a}, ${b}]$ 包含任意有限大小的线性无关集（例如 $\\{1, x, x^2, x^3, \\dots\\}$），无法由有限个函数张成，故为无限维空间。$\\mathbb{P}_${d}$ 维数为 ${d + 1}$，$M_{2 \\times ${d}}$ 维数为 ${2 * d}$，$\\mathbb{R}^${d}$ 维数为 ${d}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// ALL TOPICS EXPORT
// ════════════════════════════════════════════════════════════════════════════

/** linearAlgebraVectorSpaceTopics contains the 27 topics of Unit 3 of Linear Algebra. */
export const linearAlgebraVectorSpaceTopics: readonly TopicDef[] = [
  // Module 3.9 (4 topics)
  vectorsInNDimensionalEuclideanSpace,
  linearCombinationsOfVectorsInNDimensionalEuclideanSpace,
  linearSpanOfVectorsInNDimensionalEuclideanSpace,
  linearDependenceAndIndependence,

  // Module 3.10 (4 topics)
  subspacesOfNDimensionalSpace,
  subspacesOfNDimensionalSpaceGeometricInterpretation,
  theColumnSpaceOfAMatrix,
  theNullSpaceOfAMatrix,

  // Module 3.11 (7 topics)
  findingABasisOfASpan,
  findingABasisOfTheColumnSpaceOfAMatrix,
  findingABasisOfTheNullSpaceOfAMatrix,
  expressingTheCoordinatesOfAVectorInAGivenBasis,
  writingVectorsInDifferentBases,
  theChangeOfCoordinatesMatrix,
  changingABasisUsingTheChangeOfCoordinatesMatrix,

  // Module 3.12 (5 topics)
  theDimensionOfASpan,
  theRankOfAMatrix,
  theDimensionOfTheNullSpaceOfAMatrix,
  theInvertibleMatrixTheoremInTermsOfDimensionRankAndNullity,
  theRankNullityTheorem,

  // Module 3.13 (7 topics)
  introductionToAbstractVectorSpaces,
  definingAbstractVectorSpaces,
  linearIndependenceInAbstractVectorSpaces,
  subspacesOfAbstractVectorSpaces,
  basesInAbstractVectorSpaces,
  theCoordinatesOfAVectorRelativeToABasisInAbstractVectorSpaces,
  dimensionInAbstractVectorSpaces,
];
