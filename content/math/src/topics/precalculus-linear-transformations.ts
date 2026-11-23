import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";
import { precalculusDrawings2 } from "../explanation-drawings-precalculus-2.ts";
import { precalculusDrawings4 } from "../explanation-drawings-precalculus-4.ts";
import { remainingDrawings8 } from "../explanation-drawings-remaining-8.ts";
import { choiceProblem, numberProblem, pointProblem, vectorLatex } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";

// Precalculus Unit 6 Part 2: Matrix Inverses, Systems, and Linear Transformations in the Plane
// Modules 6.24 and 6.25 (17 topics total).

type Mat2 = readonly [readonly [number, number], readonly [number, number]];
type Vec2 = readonly [number, number];
type Mat3 = readonly [readonly [number, number, number], readonly [number, number, number], readonly [number, number, number]];
type Vec3 = readonly [number, number, number];

/** mat2Latex formats a 2x2 matrix of whole numbers as a LaTeX pmatrix. */
function mat2Latex(m: Mat2): string {
  return `\\begin{pmatrix} ${m[0][0]} & ${m[0][1]} \\\\ ${m[1][0]} & ${m[1][1]} \\end{pmatrix}`;
}

/** mat2QLatex formats a 2x2 matrix of rational numbers as a LaTeX pmatrix. */
function mat2QLatex(m: readonly [readonly [Q, Q], readonly [Q, Q]]): string {
  return `\\begin{pmatrix} ${m[0][0].toLatex()} & ${m[0][1].toLatex()} \\\\ ${m[1][0].toLatex()} & ${m[1][1].toLatex()} \\end{pmatrix}`;
}

/** vec2Latex formats a vector of two whole numbers as a LaTeX column. */
function vec2Latex(v: Vec2): string {
  return `\\begin{pmatrix} ${v[0]} \\\\ ${v[1]} \\end{pmatrix}`;
}

/** mat3Latex formats a 3x3 matrix of whole numbers as a LaTeX pmatrix. */
function mat3Latex(m: Mat3): string {
  return `\\begin{pmatrix} ${m[0][0]} & ${m[0][1]} & ${m[0][2]} \\\\ ${m[1][0]} & ${m[1][1]} & ${m[1][2]} \\\\ ${m[2][0]} & ${m[2][1]} & ${m[2][2]} \\end{pmatrix}`;
}

/** vec3Latex formats a vector of three whole numbers as a LaTeX column. */
function vec3Latex(v: Vec3): string {
  return `\\begin{pmatrix} ${v[0]} \\\\ ${v[1]} \\\\ ${v[2]} \\end{pmatrix}`;
}

/** NUMBER matches the whole numbers of an answer, leaving out subscripts and braces. */
const NUMBER = /(?<![_{\\\w^])-?\d+/g;

/** nearMiss changes one number of an answer, which gives a wrong answer of the same form. */
function nearMiss(right: Text, index: number, delta: number): Text {
  const change = (text: string) => {
    let seen = -1;
    return text.replace(NUMBER, (found) => {
      seen++;
      return seen === index ? String(Number(found) + delta) : found;
    });
  };
  return t(change(right.en), change(right["zh-CN"]));
}

/** missWhy is what is said about a wrong option that changes one number of the answer. */
const missWhy = t("One number here is off. Work that entry out again.", "这里有一个数不对。把那个数重新算一遍。");

/**
 * oneOf builds a multiple-choice problem with options shuffled and deduplicated; whys say, at the same positions as wrong,
 * what mistake leads to each wrong option, and an option filled in by changing one number of the answer is told so.
 */
function oneOf(rng: Rng, prompt: Text, right: Text, wrong: readonly Text[], solution: Text, whys: readonly Text[] = []): Problem {
  const seen = new Set([right.en]);
  const rest: Text[] = [];
  for (const w of wrong) {
    if (!seen.has(w.en)) {
      seen.add(w.en);
      rest.push(w);
      if (rest.length === 3) break;
    }
  }
  const count = right.en.match(NUMBER)?.length ?? 0;
  const start = rest.length < 3 && count > 0 ? rng.int(0, count - 1) : 0;
  for (let step = 0; step < 3 * count && rest.length < 3; step++) {
    const miss = nearMiss(right, (start + step) % count, [1, -1, 2][Math.floor(step / count)]!);
    if (!seen.has(miss.en)) {
      seen.add(miss.en);
      rest.push(miss);
    }
  }
  const options = [right, ...rest];
  const order = rng.shuffle(options.map((_, i) => i));
  const given: Reason[] = wrong.flatMap((w, i) => {
    const why = whys[i];
    return why ? [[w.en, why.en, why["zh-CN"]] as const] : [];
  });
  const filled: Reason[] = rest.filter((r) => !wrong.some((w) => w.en === r.en)).map((r) => [r.en, missWhy.en, missWhy["zh-CN"]] as const);
  return reasoned(choiceProblem({ prompt, options: order.map((i) => options[i]!), correct: order.indexOf(0), solution }), [
    ...given,
    ...filled,
  ]);
}

/** label writes the bold start of step i, followed by a space in English. */
function label(i: number, en: string, zh: string): Text {
  const s = stepLabel(i, en, zh);
  return t(`${s.en} `, s["zh-CN"]);
}

/** join puts texts one after another in each locale. */
const join = (...parts: readonly Text[]): Text => t(parts.map((p) => p.en).join(""), parts.map((p) => p["zh-CN"]).join(""));

/** para starts a new paragraph. */
const para = t("\n\n", "\n\n");

/** checked turns a text into a closing check paragraph. */
const checked = (c: Text) => t(`\n\n**Check.** ${c.en}`, `\n\n**检验。**${c["zh-CN"]}`);

/** shown is displayed math, one equation to a line, that closes a paragraph. */
const shown = (...lines: readonly string[]) => {
  const tex = `\n\n${lines.map((l) => `$$${l}$$`).join("\n\n")}`;
  return t(tex, tex);
};

/** paren writes a negative number in parentheses, for use inside a sum or a product. */
const paren = (n: number) => (n < 0 ? `(${n})` : `${n}`);

/** qp writes a negative rational number in parentheses, for use inside a sum or a product. */
const qp = (q: Q) => (q.sign() < 0 ? `(${q.toLatex()})` : q.toLatex());

/** sumOf writes numbers added one after another, with a negative one written as a subtraction. */
const sumOf = (ns: readonly number[]) => ns.map((n, i) => (i === 0 ? `${n}` : n < 0 ? ` - ${-n}` : ` + ${n}`)).join("");

/** dot writes a row times a column as a sum of products, its terms and its value: "2 \cdot 3 + (-1) \cdot 4 = 6 - 4 = 2". */
function dot(row: readonly number[], col: readonly number[]): string {
  const terms = row.map((r, k) => r * col[k]!);
  return `${row.map((r, k) => `${paren(r)} \\cdot ${paren(col[k]!)}`).join(" + ")} = ${sumOf(terms)} = ${terms.reduce((a, b) => a + b, 0)}`;
}

/** qdot writes a row of whole numbers times a column of rational numbers as a sum of products, its terms and its value. */
function qdot(row: readonly number[], col: readonly Q[]): string {
  const terms = row.map((r, k) => col[k]!.mul(Q.of(r)));
  const sum = terms.map((q, i) => (i === 0 ? q.toLatex() : q.sign() < 0 ? ` - ${q.neg().toLatex()}` : ` + ${q.toLatex()}`)).join("");
  return `${row.map((r, k) => `${paren(r)} \\cdot ${qp(col[k]!)}`).join(" + ")} = ${sum} = ${terms.reduce((a, b) => a.add(b), Q.zero).toLatex()}`;
}

/** over writes the factor one over a nonzero whole number, written as nothing for 1 and as a minus sign for -1. */
const over = (n: number) => (n === 1 ? "" : n === -1 ? "-" : n < 0 ? `-\\frac{1}{${-n}}` : `\\frac{1}{${n}}`);

/** products writes, one sentence each, the entries of a product of two matrices at the given places, as row times column. */
function products(
  left: readonly (readonly number[])[],
  right: readonly (readonly number[])[],
  places: readonly (readonly [number, number])[],
): Text {
  const column = (j: number) => right.map((r) => r[j]!);
  return t(
    places.map(([i, j]) => `Row $${i + 1}$ times column $${j + 1}$ is $${dot(left[i]!, column(j))}$.`).join(" "),
    places.map(([i, j]) => `第 $${i + 1}$ 行乘第 $${j + 1}$ 列是 $${dot(left[i]!, column(j))}$。`).join(""),
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MODULE 6.24: THE INVERSE OF A MATRIX
// ════════════════════════════════════════════════════════════════════════════

/** introductionToTheInverseOfAMatrix covers inverse matrix definition and invertibility conditions. */
export const introductionToTheInverseOfAMatrix: TopicDef = {
  id: "introduction-to-the-inverse-of-a-matrix",
  title: t("Introduction to the Inverse of a Matrix", "逆矩阵的概念"),
  summary: t(
    "Understand the definition of a matrix inverse, identity matrices, and the condition under which a square matrix is invertible.",
    "理解逆矩阵的定义、单位矩阵的性质，以及方阵可逆的充要条件与行列式判别法。",
  ),
  prerequisites: ["the-determinant-of-a-2x2-matrix"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.10"],
  intro: t(
    "You can find the determinant of a $2 \\times 2$ matrix. For numbers, multiplying by $\\frac{1}{5}$ undoes multiplying by $5$, because $5 \\cdot \\frac{1}{5} = 1$. The inverse of a square matrix $A$ does the same job for matrices. It is the matrix $A^{-1}$ with $AA^{-1} = A^{-1}A = I$, and it lets you undo $A$, for instance to solve a matrix equation. It exists exactly when $\\det(A) \\ne 0$.\n\nTake\n\n$$A = \\begin{pmatrix} 7 & 2 \\\\ 3 & 1 \\end{pmatrix}, \\quad B = \\begin{pmatrix} 1 & -2 \\\\ -3 & 7 \\end{pmatrix}$$\n\nThe top row of $AB$ is $7 \\cdot 1 + 2 \\cdot (-3) = 1$ and $7 \\cdot (-2) + 2 \\cdot 7 = 0$. The bottom row is $3 \\cdot 1 + 1 \\cdot (-3) = 0$ and $3 \\cdot (-2) + 1 \\cdot 7 = 1$. So $AB = I$ and $B = A^{-1}$. This agrees with the test, since $\\det(A) = 7 \\cdot 1 - 2 \\cdot 3 = 1$ is not zero. The matrix with rows $(2, 4)$ and $(1, 2)$ has determinant $2 \\cdot 2 - 4 \\cdot 1 = 0$, so it has no inverse.",
    "你会求 $2 \\times 2$ 矩阵的行列式。对数来说，乘 $\\frac{1}{5}$ 能抵消乘 $5$，因为 $5 \\cdot \\frac{1}{5} = 1$。方阵 $A$ 的逆矩阵对矩阵起同样的作用。它是满足 $AA^{-1} = A^{-1}A = I$ 的矩阵 $A^{-1}$，可以用来抵消 $A$，比如解矩阵方程。它存在当且仅当 $\\det(A) \\ne 0$。\n\n取\n\n$$A = \\begin{pmatrix} 7 & 2 \\\\ 3 & 1 \\end{pmatrix}, \\quad B = \\begin{pmatrix} 1 & -2 \\\\ -3 & 7 \\end{pmatrix}$$\n\n$AB$ 的第一行是 $7 \\cdot 1 + 2 \\cdot (-3) = 1$ 和 $7 \\cdot (-2) + 2 \\cdot 7 = 0$。第二行是 $3 \\cdot 1 + 1 \\cdot (-3) = 0$ 和 $3 \\cdot (-2) + 1 \\cdot 7 = 1$。所以 $AB = I$，$B = A^{-1}$。这与判别法一致，因为 $\\det(A) = 7 \\cdot 1 - 2 \\cdot 3 = 1$ 不为零。行为 $(2, 4)$ 和 $(1, 2)$ 的矩阵，行列式是 $2 \\cdot 2 - 4 \\cdot 1 = 0$，所以它没有逆矩阵。",
  ),
  knowledgePoints: [
    {
      id: "matrix-inverse-definition",
      title: t("Definition of a matrix inverse", "逆矩阵的定义与单位矩阵"),
      explanation: t(
        "For a square matrix $A$, if there exists a matrix $B$ such that $AB = BA = I$, then $B$ is the multiplicative inverse of $A$, denoted $A^{-1}$. Here $I$ is the identity matrix. For a $2 \\times 2$ matrix with $ad - bc \\ne 0$ the inverse is\n\n$$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}^{-1} = \\frac{1}{ad - bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$$\n\n> **Watch out.** $A^{-1}$ is not the matrix of the reciprocals of the entries. Check a candidate by multiplying: only the inverse gives $AA^{-1} = I$.",
        "对于方阵 $A$，若存在方阵 $B$ 使得 $AB = BA = I$，则称 $B$ 为 $A$ 的乘法逆矩阵，记作 $A^{-1}$。其中 $I$ 为单位矩阵。对 $ad - bc \\ne 0$ 的 $2 \\times 2$ 矩阵，逆矩阵是\n\n$$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}^{-1} = \\frac{1}{ad - bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$$\n\n> **注意。** $A^{-1}$ 不是把各元素取倒数得到的矩阵。用乘法检验候选答案：只有逆矩阵满足 $AA^{-1} = I$。",
      ),
      generate(rng) {
        const candidates: [number, number, number, number][] = [
          [2, 1, 1, 1],
          [3, 2, 1, 1],
          [4, 1, 3, 1],
          [5, 2, 2, 1],
          [1, 2, 3, 7],
          [2, 3, 1, 2],
          [3, 5, 1, 2],
          [4, 7, 1, 2],
          [2, 5, 1, 3],
          [3, 4, 2, 3],
          [5, 3, 3, 2],
          [1, 3, 2, 7],
          [3, 1, 2, 1],
          [4, 3, 1, 1],
          [5, 4, 1, 1],
          [2, 1, 3, 2],
          [3, 2, 4, 3],
          [1, 4, 2, 9],
          [2, 7, 1, 4],
          [3, 8, 1, 3],
          [5, 2, 7, 3],
          [4, 3, 5, 4],
          [3, 1, 5, 2],
          [2, 3, 3, 5],
          [1, 1, 2, 4],
          [2, 2, 1, 2],
          [3, 1, 1, 1],
          [4, 2, 1, 1],
          [1, 2, 1, 4],
          [2, 1, 2, 2],
          [3, 3, 1, 2],
          [5, 1, 2, 1],
        ];
        const cand = rng.pick(candidates);
        const s1 = rng.pick([1, -1]);
        const s2 = rng.pick([1, -1]);
        const a = cand[0] * s1;
        const b = cand[1] * s2;
        const c = cand[2] * s2;
        const d = cand[3] * s1;
        let D = a * d - b * c;
        if (D === 0) {
          D = 1;
        }
        const A: Mat2 = [
          [a, b],
          [c, d],
        ];
        const invA: readonly [readonly [Q, Q], readonly [Q, Q]] = [
          [Q.of(d, D), Q.of(-b, D)],
          [Q.of(-c, D), Q.of(a, D)],
        ];

        const w1: readonly [readonly [Q, Q], readonly [Q, Q]] = [
          [Q.of(a, D), Q.of(b, D)],
          [Q.of(c, D), Q.of(d, D)],
        ];
        const w2: readonly [readonly [Q, Q], readonly [Q, Q]] = [
          [Q.of(-d, D), Q.of(b, D)],
          [Q.of(c, D), Q.of(-a, D)],
        ];
        const w3: readonly [readonly [Q, Q], readonly [Q, Q]] = [
          [Q.of(d, D), Q.of(b, D)],
          [Q.of(c, D), Q.of(a, D)],
        ];
        const w4: readonly [readonly [Q, Q], readonly [Q, Q]] = [
          [Q.of(-d, D), Q.of(-b, D)],
          [Q.of(-c, D), Q.of(-a, D)],
        ];

        const rightLatex = mat2QLatex(invA);
        const aLatex = mat2Latex(A);
        const col1 = [invA[0][0], invA[1][0]];
        const col2 = [invA[0][1], invA[1][1]];

        return oneOf(
          rng,
          t(`Which matrix is the inverse $A^{-1}$ of the matrix $A = ${aLatex}$?`, `下列哪一个是矩阵 $A = ${aLatex}$ 的逆矩阵 $A^{-1}$？`),
          t(`$${rightLatex}$`, `$${rightLatex}$`),
          [
            t(`$${mat2QLatex(w1)}$`, `$${mat2QLatex(w1)}$`),
            t(`$${mat2QLatex(w2)}$`, `$${mat2QLatex(w2)}$`),
            t(`$${mat2QLatex(w3)}$`, `$${mat2QLatex(w3)}$`),
            t(`$${mat2QLatex(w4)}$`, `$${mat2QLatex(w4)}$`),
          ],
          join(
            label(1, "Find the determinant", "求行列式"),
            t(
              `The inverse exists only when the determinant is not zero. Here $\\det(A) = ${paren(a)} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)} = ${D}$.`,
              `只有行列式不为零时逆矩阵才存在。这里 $\\det(A) = ${paren(a)} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)} = ${D}$。`,
            ),
            para,
            label(2, "Apply the formula", "套用公式"),
            t(
              `Swap the diagonal entries, change the signs of the other two and divide by $${D}$:`,
              `交换对角元素，改变另外两个元素的符号，再除以 $${D}$：`,
            ),
            shown(
              `A^{-1} = ${over(D)}${mat2Latex([
                [d, -b],
                [-c, a],
              ])} = ${rightLatex}`,
            ),
            checked(
              t(
                `Multiply $A$ by the answer. Row $1$ of $A$ times column $1$ is $${qdot([a, b], col1)}$. Row $1$ times column $2$ is $${qdot([a, b], col2)}$. Row $2$ times column $1$ is $${qdot([c, d], col1)}$. Row $2$ times column $2$ is $${qdot([c, d], col2)}$. The product is $I$, so the answer is the inverse.`,
                `用 $A$ 乘答案。$A$ 的第 $1$ 行乘第 $1$ 列是 $${qdot([a, b], col1)}$。第 $1$ 行乘第 $2$ 列是 $${qdot([a, b], col2)}$。第 $2$ 行乘第 $1$ 列是 $${qdot([c, d], col1)}$。第 $2$ 行乘第 $2$ 列是 $${qdot([c, d], col2)}$。乘积是 $I$，所以答案就是逆矩阵。`,
              ),
            ),
          ),
          [
            t(
              "This divides $A$ itself by the determinant. The diagonal entries must be swapped and the other two negated first.",
              "这是把 $A$ 本身除以行列式。要先交换对角元素，并改变另外两个元素的符号。",
            ),
            t(
              "This changes the signs of the diagonal entries instead of the other two.",
              "这里改变符号的是对角元素，而应该改变的是另外两个元素。",
            ),
            t(
              "This swaps the diagonal entries but forgets to change the signs of the other two.",
              "这里交换了对角元素，但忘了改变另外两个元素的符号。",
            ),
            t(
              "This changes every sign. Only the two entries off the diagonal change sign.",
              "这里改变了所有符号。只有对角线以外的两个元素变号。",
            ),
          ],
        );
      },
    },
    {
      id: "invertibility-and-determinant-condition",
      title: t("Condition for invertibility of a matrix", "矩阵可逆与行列式条件"),
      explanation: t(
        "A square matrix $A$ is invertible if and only if $\\det(A) \\ne 0$. If $\\det(A) = 0$, the matrix is singular and has no multiplicative inverse. For a $2 \\times 2$ matrix this happens exactly when one row is a multiple of the other.\n\n> **Watch out.** Set the determinant equal to zero, not an entry. A matrix with no zero entries can still be singular.",
        "方阵 $A$ 可逆的充要条件是 $\\det(A) \\ne 0$。若 $\\det(A) = 0$，则称该矩阵是奇异的（退化的），它没有乘法逆矩阵。对 $2 \\times 2$ 矩阵，这恰好发生在一行是另一行的倍数时。\n\n> **注意。** 要令行列式等于零，而不是令某个元素等于零。没有零元素的矩阵也可能是奇异的。",
      ),
      generate(rng) {
        const a = rng.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
        const m = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const b = rng.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
        const c = a * m;
        const kSingular = b * m;

        const w1 = kSingular + rng.pick([1, 2, 3]);
        const w2 = kSingular - rng.pick([1, 2, 3]);
        const w3 = -kSingular;
        const w4 = kSingular + 4;

        return numberProblem({
          prompt: t(
            `For what value of $k$ is the matrix $M = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & k \\end{pmatrix}$ singular (not invertible)?`,
            `当 $k$ 取何值时，矩阵 $M = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & k \\end{pmatrix}$ 是奇异矩阵（不可逆）？`,
          ),
          answer: kSingular,
          solveFor: "k",
          solution: join(
            label(1, "Set the determinant to zero", "令行列式为零"),
            t(
              `A matrix is singular exactly when its determinant is $0$. Here $\\det(M) = ${paren(a)} \\cdot k - ${paren(b)} \\cdot ${paren(c)} = ${poly([a, "k"], [-b * c, ""])}$.`,
              `矩阵奇异当且仅当它的行列式为 $0$。这里 $\\det(M) = ${paren(a)} \\cdot k - ${paren(b)} \\cdot ${paren(c)} = ${poly([a, "k"], [-b * c, ""])}$。`,
            ),
            para,
            label(2, "Solve for k", "解出 k"),
            t(
              `Setting $${poly([a, "k"], [-b * c, ""])} = 0$ gives $${poly([a, "k"])} = ${b * c}$. Dividing by $${a}$ gives $k = ${kSingular}$.`,
              `令 $${poly([a, "k"], [-b * c, ""])} = 0$，得 $${poly([a, "k"])} = ${b * c}$。两边除以 $${a}$，得 $k = ${kSingular}$。`,
            ),
            checked(
              t(
                `With $k = ${kSingular}$, row $2$ of $M$ is $(${c}, ${kSingular})$, which is $${m}$ times row $1$, $(${a}, ${b})$. When one row is a multiple of the other, the determinant is $0$. Indeed $${paren(a)} \\cdot ${paren(kSingular)} - ${paren(b)} \\cdot ${paren(c)} = ${a * kSingular} - ${paren(b * c)} = 0$.`,
                `$k = ${kSingular}$ 时，$M$ 的第 $2$ 行是 $(${c}, ${kSingular})$，是第 $1$ 行 $(${a}, ${b})$ 的 $${m}$ 倍。一行是另一行的倍数时，行列式为 $0$。确实 $${paren(a)} \\cdot ${paren(kSingular)} - ${paren(b)} \\cdot ${paren(c)} = ${a * kSingular} - ${paren(b * c)} = 0$。`,
              ),
            ),
          ),
          wrong: [w1, w2, w3, w4],
        });
      },
    },
  ],
};

/** inversesOf2x2Matrices covers computing inverses of 2x2 matrices. */
export const inversesOf2x2Matrices: TopicDef = {
  id: "inverses-of-2x2-matrices",
  title: t("Inverses of 2x2 Matrices", "二阶逆矩阵的公式与计算"),
  summary: t(
    "Compute the inverse of a 2x2 matrix using the determinant and adjugate formula.",
    "利用行列式和伴随矩阵公式计算二阶矩阵的逆矩阵。",
  ),
  prerequisites: ["introduction-to-the-inverse-of-a-matrix"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.10"],
  intro: t(
    "You know what an inverse is and that it exists when the determinant is not zero. For a $2 \\times 2$ matrix it can be found in three moves: swap the diagonal entries, change the signs of the other two, and divide by the determinant. The middle result is called the adjugate. This gives inverses quickly, which you will need to solve systems and to undo transformations.\n\nTake\n\n$$A = \\begin{pmatrix} 6 & 4 \\\\ 1 & 1 \\end{pmatrix}$$\n\nIts determinant is $6 \\cdot 1 - 4 \\cdot 1 = 2$. Swapping $6$ and $1$ and changing the signs of $4$ and $1$ gives the adjugate. Dividing it by $2$ gives\n\n$$A^{-1} = \\frac{1}{2}\\begin{pmatrix} 1 & -4 \\\\ -1 & 6 \\end{pmatrix} = \\begin{pmatrix} \\frac{1}{2} & -2 \\\\ -\\frac{1}{2} & 3 \\end{pmatrix}$$\n\nAs a check, row $1$ of $A$ times column $1$ of $A^{-1}$ is $6 \\cdot \\frac{1}{2} + 4 \\cdot (-\\frac{1}{2}) = 3 - 2 = 1$, the top left entry of $I$.",
    "你知道什么是逆矩阵，也知道行列式不为零时它存在。$2 \\times 2$ 矩阵的逆可以分三步求出：交换对角元素，改变另外两个元素的符号，再除以行列式。中间得到的矩阵叫伴随矩阵。这样能很快求出逆矩阵，解方程组和还原变换时都要用到。\n\n取\n\n$$A = \\begin{pmatrix} 6 & 4 \\\\ 1 & 1 \\end{pmatrix}$$\n\n它的行列式是 $6 \\cdot 1 - 4 \\cdot 1 = 2$。交换 $6$ 和 $1$，并改变 $4$ 和 $1$ 的符号，得到伴随矩阵。再除以 $2$，得\n\n$$A^{-1} = \\frac{1}{2}\\begin{pmatrix} 1 & -4 \\\\ -1 & 6 \\end{pmatrix} = \\begin{pmatrix} \\frac{1}{2} & -2 \\\\ -\\frac{1}{2} & 3 \\end{pmatrix}$$\n\n检验一下，$A$ 的第 $1$ 行乘 $A^{-1}$ 的第 $1$ 列是 $6 \\cdot \\frac{1}{2} + 4 \\cdot (-\\frac{1}{2}) = 3 - 2 = 1$，正是 $I$ 的左上元素。",
  ),
  knowledgePoints: [
    {
      id: "formula-for-inverse-of-2x2-matrix",
      title: t("Formula for the inverse of a 2x2 matrix", "二阶逆矩阵的计算公式"),
      explanation: t(
        "Swap the diagonal entries, change the signs of the other two, and divide by the determinant; if the determinant is zero, there is no inverse. In symbols, the adjugate and the inverse are\n\n$$\\text{adj}\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}, \\quad A^{-1} = \\frac{1}{\\det(A)}\\text{adj}(A)$$\n\n> **Watch out.** The diagonal entries trade places but keep their signs. Only the two entries off the diagonal change sign.",
        "交换主对角线上的元素，改变另外两个元素的符号，再除以行列式；如果行列式为零，就没有逆矩阵。用符号写，伴随矩阵和逆矩阵是\n\n$$\\text{adj}\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}, \\quad A^{-1} = \\frac{1}{\\det(A)}\\text{adj}(A)$$\n\n> **注意。** 对角元素互换位置，但符号不变。只有对角线以外的两个元素变号。",
      ),
      generate(rng) {
        const a = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const b = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const c = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const d = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        if (a * d === b * c) {
          return this.generate(rng);
        }

        const A: Mat2 = [
          [a, b],
          [c, d],
        ];
        const adj: Mat2 = [
          [d, -b],
          [-c, a],
        ];
        const w1: Mat2 = [
          [a, -b],
          [-c, d],
        ];
        const w2: Mat2 = [
          [-d, b],
          [c, -a],
        ];
        const w3: Mat2 = [
          [d, b],
          [c, a],
        ];
        const w4: Mat2 = [
          [-a, c],
          [b, -d],
        ];

        const ALatex = mat2Latex(A);
        const adjLatex = mat2Latex(adj);
        const D = a * d - b * c;

        return oneOf(
          rng,
          t(
            `What is the adjugate matrix $\\text{adj}(A)$ of $A = ${ALatex}$?`,
            `矩阵 $A = ${ALatex}$ 的伴随矩阵 $\\text{adj}(A)$ 是什么？`,
          ),
          t(`$${adjLatex}$`, `$${adjLatex}$`),
          [
            t(`$${mat2Latex(w1)}$`, `$${mat2Latex(w1)}$`),
            t(`$${mat2Latex(w2)}$`, `$${mat2Latex(w2)}$`),
            t(`$${mat2Latex(w3)}$`, `$${mat2Latex(w3)}$`),
            t(`$${mat2Latex(w4)}$`, `$${mat2Latex(w4)}$`),
          ],
          join(
            label(1, "Swap the diagonal entries", "交换对角元素"),
            t(
              `The diagonal entries $${a}$ and $${d}$ trade places, so $${d}$ goes to the top left and $${a}$ to the bottom right.`,
              `对角元素 $${a}$ 和 $${d}$ 互换位置，$${d}$ 放到左上，$${a}$ 放到右下。`,
            ),
            para,
            label(2, "Change the signs of the other two", "另外两个元素变号"),
            t(
              `The entries $${b}$ and $${c}$ stay where they are and become $${-b}$ and $${-c}$. So the adjugate is`,
              `元素 $${b}$ 和 $${c}$ 位置不变，变成 $${-b}$ 和 $${-c}$。所以伴随矩阵是`,
            ),
            shown(`\\text{adj}(A) = ${adjLatex}`),
            checked(
              t(
                `$A$ times its adjugate should be $\\det(A)$ times $I$, and $\\det(A) = ${paren(a)} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)} = ${D}$. ${
                  products(A, adj, [
                    [0, 0],
                    [0, 1],
                    [1, 0],
                    [1, 1],
                  ]).en
                } So the product is $${D}I$.`,
                `$A$ 乘它的伴随矩阵应该等于 $\\det(A)$ 乘 $I$，而 $\\det(A) = ${paren(a)} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)} = ${D}$。${
                  products(A, adj, [
                    [0, 0],
                    [0, 1],
                    [1, 0],
                    [1, 1],
                  ])["zh-CN"]
                }所以乘积是 $${D}I$。`,
              ),
            ),
          ),
          [
            t(
              "This changes the signs of the other two entries but leaves the diagonal entries unswapped.",
              "这里另外两个元素变了号，但对角元素没有交换。",
            ),
            t("This swaps the diagonal entries but changes the signs of the wrong pair.", "这里交换了对角元素，但变号的那一对选错了。"),
            t(
              "This swaps the diagonal entries but forgets to change the signs of the other two.",
              "这里交换了对角元素，但忘了改变另外两个元素的符号。",
            ),
            t(
              "This moves the entries off the diagonal and negates the diagonal. The adjugate does neither.",
              "这里移动了对角线以外的元素，又把对角元素变了号。伴随矩阵两样都不做。",
            ),
          ],
        );
      },
    },
    {
      id: "calculating-inverse-of-2x2-matrix",
      title: t("Calculating the inverse of a 2x2 matrix", "计算二阶矩阵的逆矩阵"),
      explanation: t(
        "You can check the answer by multiplying the matrix by its inverse, which should give the identity matrix. To find the inverse of $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$, calculate $\\det(A) = ad - bc$, verify $\\det(A) \\ne 0$, and scale the adjugate matrix by $\\frac{1}{\\det(A)}$.\n\n> **Watch out.** Divide every entry of the adjugate by the determinant, keeping its sign. Forgetting the division gives a matrix $\\det(A)$ times too large.",
        "可以把矩阵与求出的逆矩阵相乘来检验答案，结果应该是单位矩阵。求二阶矩阵 $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ 的逆矩阵，先计算 $\\det(A) = ad - bc$，确认 $\\det(A) \\ne 0$，再将伴随矩阵乘以 $\\frac{1}{\\det(A)}$。\n\n> **注意。** 伴随矩阵的每个元素都要除以行列式，连同它的符号。忘了除，得到的矩阵就大了 $\\det(A)$ 倍。",
      ),
      generate(rng) {
        const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const d = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const b = rng.pick([-3, -2, -1, 1, 2, 3]);
        const c = rng.pick([-3, -2, -1, 1, 2, 3]);
        const det = a * d - b * c;
        if (det === 0) return this.generate(rng);

        const A: Mat2 = [
          [a, b],
          [c, d],
        ];
        const invA: readonly [readonly [Q, Q], readonly [Q, Q]] = [
          [Q.of(d, det), Q.of(-b, det)],
          [Q.of(-c, det), Q.of(a, det)],
        ];

        const w1: readonly [readonly [Q, Q], readonly [Q, Q]] = [
          [Q.of(a, det), Q.of(-b, det)],
          [Q.of(-c, det), Q.of(d, det)],
        ];
        const w2: readonly [readonly [Q, Q], readonly [Q, Q]] = [
          [Q.of(-d, det), Q.of(b, det)],
          [Q.of(c, det), Q.of(-a, det)],
        ];
        const w3: readonly [readonly [Q, Q], readonly [Q, Q]] = [
          [Q.of(d, det), Q.of(b, det)],
          [Q.of(c, det), Q.of(a, det)],
        ];
        const w4: readonly [readonly [Q, Q], readonly [Q, Q]] = [
          [Q.of(c, det), Q.of(d, det)],
          [Q.of(a, det), Q.of(b, det)],
        ];

        const ALatex = mat2Latex(A);
        const rightLatex = mat2QLatex(invA);
        const col1 = [invA[0][0], invA[1][0]];
        const col2 = [invA[0][1], invA[1][1]];

        return oneOf(
          rng,
          t(`Find the inverse matrix $A^{-1}$ for $A = ${ALatex}$.`, `求矩阵 $A = ${ALatex}$ 的逆矩阵 $A^{-1}$。`),
          t(`$${rightLatex}$`, `$${rightLatex}$`),
          [
            t(`$${mat2QLatex(w1)}$`, `$${mat2QLatex(w1)}$`),
            t(`$${mat2QLatex(w2)}$`, `$${mat2QLatex(w2)}$`),
            t(`$${mat2QLatex(w3)}$`, `$${mat2QLatex(w3)}$`),
            t(`$${mat2QLatex(w4)}$`, `$${mat2QLatex(w4)}$`),
          ],
          join(
            label(1, "Find the determinant", "求行列式"),
            t(
              `$\\det(A) = ${paren(a)} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)} = ${det}$. It is not zero, so the inverse exists.`,
              `$\\det(A) = ${paren(a)} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)} = ${det}$。它不为零，所以逆矩阵存在。`,
            ),
            para,
            label(2, "Form the adjugate", "写出伴随矩阵"),
            t(
              `Swap $${a}$ and $${d}$, and change the signs of $${b}$ and $${c}$:`,
              `交换 $${a}$ 和 $${d}$，并改变 $${b}$ 和 $${c}$ 的符号：`,
            ),
            shown(
              `\\text{adj}(A) = ${mat2Latex([
                [d, -b],
                [-c, a],
              ])}`,
            ),
            para,
            label(3, "Divide by the determinant", "除以行列式"),
            t(`Every entry is divided by $${det}$:`, `每个元素都除以 $${det}$：`),
            shown(
              `A^{-1} = ${over(det)}${mat2Latex([
                [d, -b],
                [-c, a],
              ])} = ${rightLatex}`,
            ),
            checked(
              t(
                `Multiply $A$ by the answer. Row $1$ of $A$ times column $1$ is $${qdot([a, b], col1)}$. Row $1$ times column $2$ is $${qdot([a, b], col2)}$. Row $2$ times column $1$ is $${qdot([c, d], col1)}$. Row $2$ times column $2$ is $${qdot([c, d], col2)}$. The product is $I$.`,
                `用 $A$ 乘答案。$A$ 的第 $1$ 行乘第 $1$ 列是 $${qdot([a, b], col1)}$。第 $1$ 行乘第 $2$ 列是 $${qdot([a, b], col2)}$。第 $2$ 行乘第 $1$ 列是 $${qdot([c, d], col1)}$。第 $2$ 行乘第 $2$ 列是 $${qdot([c, d], col2)}$。乘积是 $I$。`,
              ),
            ),
          ),
          [
            t("This forgets to swap the diagonal entries.", "这里忘了交换对角元素。"),
            t(
              "This changes the signs of the diagonal entries instead of the other two.",
              "这里改变符号的是对角元素，而应该改变的是另外两个元素。",
            ),
            t("This forgets to change the signs of the two entries off the diagonal.", "这里忘了改变对角线以外两个元素的符号。"),
            t(
              "This swaps the rows of $A$ and divides by the determinant. That is not the inverse.",
              "这是把 $A$ 的两行交换后除以行列式，不是逆矩阵。",
            ),
          ],
        );
      },
    },
  ],
};

/** calculatingTheInverseOfA3x3MatrixUsingTheCofactorMethod covers 3x3 matrix inverses via adjugate. */
export const calculatingTheInverseOfA3x3MatrixUsingTheCofactorMethod: TopicDef = {
  id: "calculating-the-inverse-of-a-3x3-matrix-using-the-cofactor-method",
  title: t("Calculating the Inverse of a 3x3 Matrix Using the Cofactor Method", "利用伴随矩阵法求三阶逆矩阵"),
  summary: t(
    "Find the inverse of a 3x3 matrix using the matrix of cofactors, the adjugate matrix, and the determinant.",
    "利用代数余子式矩阵、伴随矩阵与行列式求解三阶逆矩阵。",
  ),
  prerequisites: ["the-determinant-of-a-3x3-matrix", "inverses-of-2x2-matrices"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSN.VM.C.10"],
  intro: t(
    "You can find cofactors and $3 \\times 3$ determinants, and you can invert a $2 \\times 2$ matrix. For a $3 \\times 3$ matrix there is no swapping trick. Instead, replace every entry by its cofactor, transpose the result to get the adjugate, and divide by the determinant. The $2 \\times 2$ rule is the same method in a small case.\n\nTake\n\n$$A = \\begin{pmatrix} 2 & 0 & 0 \\\\ 0 & 1 & 1 \\\\ 0 & 1 & 2 \\end{pmatrix}$$\n\nExpanding along row $1$ gives $\\det(A) = 2(1 \\cdot 2 - 1 \\cdot 1) = 2$. The cofactors are $C_{11} = 1$, $C_{22} = 4$, $C_{23} = C_{32} = -2$ and $C_{33} = 2$, and the other four are $0$. The cofactor matrix is symmetric, so transposing leaves it as it is. Dividing by $2$ gives\n\n$$A^{-1} = \\frac{1}{2}\\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 4 & -2 \\\\ 0 & -2 & 2 \\end{pmatrix} = \\begin{pmatrix} \\frac{1}{2} & 0 & 0 \\\\ 0 & 2 & -1 \\\\ 0 & -1 & 1 \\end{pmatrix}$$\n\nAs a check, row $3$ of $A$ times column $2$ of $A^{-1}$ is $0 \\cdot 0 + 1 \\cdot 2 + 2 \\cdot (-1) = 0$, as it is in $I$.",
    "你会求代数余子式和 $3 \\times 3$ 行列式，也会求 $2 \\times 2$ 矩阵的逆。$3 \\times 3$ 矩阵没有交换元素的简便做法。要把每个元素换成它的代数余子式，把结果转置得到伴随矩阵，再除以行列式。$2 \\times 2$ 的公式就是这个方法的特例。\n\n取\n\n$$A = \\begin{pmatrix} 2 & 0 & 0 \\\\ 0 & 1 & 1 \\\\ 0 & 1 & 2 \\end{pmatrix}$$\n\n沿第 $1$ 行展开，得 $\\det(A) = 2(1 \\cdot 2 - 1 \\cdot 1) = 2$。代数余子式是 $C_{11} = 1$，$C_{22} = 4$，$C_{23} = C_{32} = -2$，$C_{33} = 2$，其余四个是 $0$。代数余子式矩阵是对称的，所以转置后不变。除以 $2$，得\n\n$$A^{-1} = \\frac{1}{2}\\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 4 & -2 \\\\ 0 & -2 & 2 \\end{pmatrix} = \\begin{pmatrix} \\frac{1}{2} & 0 & 0 \\\\ 0 & 2 & -1 \\\\ 0 & -1 & 1 \\end{pmatrix}$$\n\n检验一下，$A$ 的第 $3$ 行乘 $A^{-1}$ 的第 $2$ 列是 $0 \\cdot 0 + 1 \\cdot 2 + 2 \\cdot (-1) = 0$，与 $I$ 一致。",
  ),
  knowledgePoints: [
    {
      id: "cofactor-and-adjugate-matrix-3x3",
      title: t("Cofactors and the adjugate of a 3x3 matrix", "三阶矩阵的代数余子式与伴随矩阵"),
      explanation: t(
        "For a $3 \\times 3$ matrix $A$, the cofactor of element $a_{ij}$ is $C_{ij} = (-1)^{i+j} M_{ij}$, where $M_{ij}$ is the determinant of the $2 \\times 2$ submatrix after deleting row $i$ and column $j$. The adjugate matrix is the transpose of the cofactor matrix: $\\text{adj}(A) = C^T$.\n\n> **Watch out.** Where $i + j$ is odd, the cofactor is the minor with its sign changed. Do not stop at the minor.",
        "对于三阶矩阵 $A$，元素 $a_{ij}$ 的代数余子式为 $C_{ij} = (-1)^{i+j} M_{ij}$，其中 $M_{ij}$ 是划去第 $i$ 行和第 $j$ 列后的二阶子式。伴随矩阵为代数余子式矩阵的转置：$\\text{adj}(A) = C^T$。\n\n> **注意。** $i + j$ 为奇数时，代数余子式是余子式改变符号。不要停在余子式上。",
      ),
      generate(rng) {
        const pool: Mat3[] = [
          [
            [1, 2, 0],
            [0, 3, 1],
            [2, 1, 4],
          ],
          [
            [2, 0, 1],
            [1, 3, 2],
            [0, 4, 1],
          ],
          [
            [1, 1, 2],
            [2, 0, 1],
            [1, 3, 1],
          ],
          [
            [3, 1, 0],
            [2, 2, 1],
            [1, 0, 4],
          ],
          [
            [1, 0, 3],
            [2, 1, 1],
            [0, 2, 2],
          ],
          [
            [2, 1, 3],
            [1, 0, 2],
            [3, 2, 1],
          ],
          [
            [1, 2, 1],
            [0, 1, 3],
            [2, 0, 2],
          ],
          [
            [3, 0, 2],
            [1, 2, 1],
            [2, 1, 3],
          ],
          [
            [2, 2, 0],
            [1, 3, 1],
            [0, 1, 2],
          ],
          [
            [1, 3, 2],
            [2, 1, 0],
            [1, 0, 3],
          ],
        ];
        const A = rng.pick(pool);
        const row = rng.pick([0, 1, 2]);
        const col = rng.pick([0, 1, 2]);

        const subR = [0, 1, 2].filter((r) => r !== row);
        const subC = [0, 1, 2].filter((c) => c !== col);
        const m00 = A[subR[0]!]![subC[0]!]!;
        const m01 = A[subR[0]!]![subC[1]!]!;
        const m10 = A[subR[1]!]![subC[0]!]!;
        const m11 = A[subR[1]!]![subC[1]!]!;
        const minor = m00 * m11 - m01 * m10;
        const sign = (row + col) % 2 === 0 ? 1 : -1;
        const cofactor = sign * minor;

        const w1 = -cofactor;
        const w2 = minor;
        const w3 = cofactor + (minor === 0 ? 2 : 1);
        const w4 = -minor + 1;

        const ALatex = mat3Latex(A);
        const entryVal = A[row]![col]!;
        const ij = `${row + 1}${col + 1}`;
        const signRow = [0, 1, 2].map((c) => ((row + c) % 2 === 0 ? "+" : "-")).join(", ");

        return numberProblem({
          prompt: t(
            `For the matrix $A = ${ALatex}$, find the cofactor $C_{${ij}}$ corresponding to entry $a_{${ij}} = ${entryVal}$.`,
            `对于矩阵 $A = ${ALatex}$，求元素 $a_{${ij}} = ${entryVal}$ 对应的代数余子式 $C_{${ij}}$。`,
          ),
          answer: cofactor,
          solution: join(
            label(1, "Delete the row and the column", "划去行和列"),
            t(
              `Cross out row $${row + 1}$ and column $${col + 1}$ of $A$. What is left is`,
              `划去 $A$ 的第 $${row + 1}$ 行和第 $${col + 1}$ 列，剩下的是`,
            ),
            shown(
              mat2Latex([
                [m00, m01],
                [m10, m11],
              ]),
            ),
            para,
            label(2, "Find the minor", "求余子式"),
            t(
              `$M_{${ij}} = ${paren(m00)} \\cdot ${paren(m11)} - ${paren(m01)} \\cdot ${paren(m10)} = ${minor}$.`,
              `$M_{${ij}} = ${paren(m00)} \\cdot ${paren(m11)} - ${paren(m01)} \\cdot ${paren(m10)} = ${minor}$。`,
            ),
            para,
            label(3, "Attach the sign", "配上符号"),
            t(
              `The sign is $(-1)^{${row + 1} + ${col + 1}} = ${sign}$. So $C_{${ij}} = ${sign} \\cdot ${paren(minor)} = ${cofactor}$.`,
              `符号是 $(-1)^{${row + 1} + ${col + 1}} = ${sign}$。所以 $C_{${ij}} = ${sign} \\cdot ${paren(minor)} = ${cofactor}$。`,
            ),
            checked(
              t(
                `Read the checkerboard of signs, which starts with $+$ at the top left. Row $${row + 1}$ of it is $${signRow}$, so place $${col + 1}$ holds $${sign === 1 ? "+" : "-"}$. The cofactor is ${sign === 1 ? "the minor itself" : "the minor with its sign changed"}, $${cofactor}$.`,
                `看从左上角正号开始的棋盘符号。它的第 $${row + 1}$ 行是 $${signRow}$，所以第 $${col + 1}$ 个位置是 $${sign === 1 ? "+" : "-"}$。代数余子式${sign === 1 ? "就是余子式本身" : "是余子式改变符号"}，即 $${cofactor}$。`,
              ),
            ),
          ),
          wrong: [w1, w2, w3, w4],
        });
      },
    },
    {
      id: "inverse-of-3x3-matrix-by-cofactors",
      title: t("Computing the inverse of a 3x3 matrix using cofactors", "伴随矩阵法求解三阶逆矩阵"),
      explanation: t(
        "For an invertible $3 \\times 3$ matrix $A$, its inverse is given by $A^{-1} = \\frac{1}{\\det(A)}\\text{adj}(A)$, where the $(i, j)$ entry of $\\text{adj}(A)$ is the cofactor $C_{ji}$.\n\n> **Watch out.** The adjugate is the transpose of the cofactor matrix. The cofactor of row $i$, column $j$ goes to row $j$, column $i$.",
        "对于可逆的三阶方阵 $A$，其逆矩阵公式为 $A^{-1} = \\frac{1}{\\det(A)}\\text{adj}(A)$，其中伴随矩阵 $\\text{adj}(A)$ 的第 $(i, j)$ 个元素为代数余子式 $C_{ji}$。\n\n> **注意。** 伴随矩阵是代数余子式矩阵的转置。第 $i$ 行第 $j$ 列的代数余子式要放到第 $j$ 行第 $i$ 列。",
      ),
      generate(rng) {
        const isUpper = rng.pick([true, false]);
        const a = rng.pick([-3, -2, -1, 1, 2, 3]);
        const b = rng.pick([-3, -2, -1, 1, 2, 3]);
        const c = rng.pick([-3, -2, -1, 1, 2, 3]);

        let A: Mat3;
        let inv: Mat3;
        if (isUpper) {
          A = [
            [1, a, b],
            [0, 1, c],
            [0, 0, 1],
          ];
          inv = [
            [1, -a, a * c - b],
            [0, 1, -c],
            [0, 0, 1],
          ];
        } else {
          A = [
            [1, 0, 0],
            [a, 1, 0],
            [b, c, 1],
          ];
          inv = [
            [1, 0, 0],
            [-a, 1, 0],
            [a * c - b, -c, 1],
          ];
        }

        const ALatex = mat3Latex(A);
        const invLatex = mat3Latex(inv);

        const w1: Mat3 = [
          [inv[0][0], -inv[0][1], inv[0][2]],
          [inv[1][0], inv[1][1], -inv[1][2]],
          [inv[2][0], inv[2][1], inv[2][2]],
        ];
        const w2: Mat3 = [
          [inv[0][0], inv[1][0], inv[2][0]],
          [inv[0][1], inv[1][1], inv[2][1]],
          [inv[0][2], inv[1][2], inv[2][2]],
        ];
        const w3: Mat3 = [
          [-inv[0][0], -inv[0][1], -inv[0][2]],
          [-inv[1][0], -inv[1][1], -inv[1][2]],
          [-inv[2][0], -inv[2][1], -inv[2][2]],
        ];
        const w4: Mat3 = [
          [A[0][0], A[0][1], A[0][2]],
          [A[1][0], A[1][0], A[1][2]],
          [A[2][0], A[2][1], A[2][2]],
        ];

        const corner = isUpper
          ? t(
              `For example, $C_{31}$ comes from deleting row $3$ and column $1$: $C_{31} = ${paren(a)} \\cdot ${paren(c)} - ${paren(b)} \\cdot 1 = ${a * c - b}$.`,
              `例如 $C_{31}$ 由划去第 $3$ 行和第 $1$ 列得到：$C_{31} = ${paren(a)} \\cdot ${paren(c)} - ${paren(b)} \\cdot 1 = ${a * c - b}$。`,
            )
          : t(
              `For example, $C_{13}$ comes from deleting row $1$ and column $3$: $C_{13} = ${paren(a)} \\cdot ${paren(c)} - 1 \\cdot ${paren(b)} = ${a * c - b}$.`,
              `例如 $C_{13}$ 由划去第 $1$ 行和第 $3$ 列得到：$C_{13} = ${paren(a)} \\cdot ${paren(c)} - 1 \\cdot ${paren(b)} = ${a * c - b}$。`,
            );
        const places: readonly (readonly [number, number])[] = isUpper
          ? [
              [0, 1],
              [0, 2],
              [1, 2],
            ]
          : [
              [1, 0],
              [2, 0],
              [2, 1],
            ];

        return oneOf(
          rng,
          t(
            `Find the inverse matrix $A^{-1}$ for the $3 \\times 3$ matrix $A = ${ALatex}$.`,
            `求三阶矩阵 $A = ${ALatex}$ 的逆矩阵 $A^{-1}$。`,
          ),
          t(`$${invLatex}$`, `$${invLatex}$`),
          [
            t(`$${mat3Latex(w1)}$`, `$${mat3Latex(w1)}$`),
            t(`$${mat3Latex(w2)}$`, `$${mat3Latex(w2)}$`),
            t(`$${mat3Latex(w3)}$`, `$${mat3Latex(w3)}$`),
            t(`$${mat3Latex(w4)}$`, `$${mat3Latex(w4)}$`),
          ],
          join(
            label(1, "Find the determinant", "求行列式"),
            t(
              `$A$ is triangular, so its determinant is the product of the diagonal entries, $1 \\cdot 1 \\cdot 1 = 1$.`,
              `$A$ 是三角矩阵，所以行列式是对角元素之积，即 $1 \\cdot 1 \\cdot 1 = 1$。`,
            ),
            para,
            label(2, "Find the cofactors", "求代数余子式"),
            join(
              corner,
              t(" Working out all nine signed minors gives the cofactor matrix", "算出全部九个带符号的余子式，得到代数余子式矩阵"),
            ),
            shown(`C = ${mat3Latex(w2)}`),
            para,
            label(3, "Transpose and divide", "转置再相除"),
            t(
              "The adjugate is the transpose of $C$, and dividing by the determinant $1$ changes nothing:",
              "伴随矩阵是 $C$ 的转置，除以行列式 $1$ 不改变它：",
            ),
            shown(`A^{-1} = \\text{adj}(A) = ${invLatex}`),
            checked(
              join(
                t("Multiply $A$ by the answer. ", "用 $A$ 乘答案。"),
                products(A, inv, places),
                t(
                  " Both matrices have $1$s on the diagonal and zeros on the same side of it, so the product has $1$s on the diagonal and zeros on that side. It is $I$.",
                  "两个矩阵对角线上都是 $1$，并且在同一侧都是零，所以乘积的对角线上是 $1$，那一侧是零。乘积是 $I$。",
                ),
              ),
            ),
          ),
          [
            t(
              "Two entries have the wrong sign. Recheck the signs $(-1)^{i+j}$ of those cofactors.",
              "有两个元素符号错了。重新检查那两个代数余子式的符号 $(-1)^{i+j}$。",
            ),
            t("This is the cofactor matrix itself. The adjugate is its transpose.", "这是代数余子式矩阵本身。伴随矩阵是它的转置。"),
            t(
              "This changes every sign. With $\\det(A) = 1$, dividing changes no signs.",
              "这里改变了所有符号。$\\det(A) = 1$，相除不会改变符号。",
            ),
            t("This is close to $A$ itself, not its inverse.", "这接近 $A$ 本身，不是它的逆矩阵。"),
          ],
        );
      },
    },
  ],
};

/** solving2x2SystemsOfEquationsUsingInverseMatrices covers solving 2x2 systems via A^(-1)b. */
export const solving2x2SystemsOfEquationsUsingInverseMatrices: TopicDef = {
  id: "solving-2x2-systems-of-equations-using-inverse-matrices",
  title: t("Solving 2x2 Systems of Equations Using Inverse Matrices", "利用二阶逆矩阵求解二元一次方程组"),
  summary: t(
    "Formulate a system of two linear equations as a matrix equation and solve it using the inverse matrix.",
    "将二元一次方程组表示为矩阵方程，并利用逆矩阵求解未知向量。",
  ),
  prerequisites: ["inverses-of-2x2-matrices", "representing-2x2-systems-of-equations-using-a-matrix-product"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSA.REI.C.8", "CCSS.HSA.REI.C.9"],
  intro: t(
    "You can write a system of two equations as $A\\mathbf{x} = \\mathbf{b}$, and you can invert a $2 \\times 2$ matrix. Putting the two together solves the system in one move: multiply both sides on the left by $A^{-1}$ to get $\\mathbf{x} = A^{-1}\\mathbf{b}$. This works for every system whose coefficient matrix is invertible.\n\nThe system $3x + 2y = 7$, $4x + 3y = 10$ is\n\n$$\\begin{pmatrix} 3 & 2 \\\\ 4 & 3 \\end{pmatrix}\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 7 \\\\ 10 \\end{pmatrix}$$\n\nThe determinant is $3 \\cdot 3 - 2 \\cdot 4 = 1$, so the inverse is the adjugate itself. Then\n\n$$\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 3 & -2 \\\\ -4 & 3 \\end{pmatrix}\\begin{pmatrix} 7 \\\\ 10 \\end{pmatrix} = \\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix}$$\n\nSubstituting back, $3 \\cdot 1 + 2 \\cdot 2 = 7$ and $4 \\cdot 1 + 3 \\cdot 2 = 10$.",
    "你会把二元方程组写成 $A\\mathbf{x} = \\mathbf{b}$，也会求 $2 \\times 2$ 矩阵的逆。两者结合，一步就能解出方程组：两边左乘 $A^{-1}$，得 $\\mathbf{x} = A^{-1}\\mathbf{b}$。只要系数矩阵可逆，这个方法都适用。\n\n方程组 $3x + 2y = 7$，$4x + 3y = 10$ 写成\n\n$$\\begin{pmatrix} 3 & 2 \\\\ 4 & 3 \\end{pmatrix}\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 7 \\\\ 10 \\end{pmatrix}$$\n\n行列式是 $3 \\cdot 3 - 2 \\cdot 4 = 1$，所以逆矩阵就是伴随矩阵本身。于是\n\n$$\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 3 & -2 \\\\ -4 & 3 \\end{pmatrix}\\begin{pmatrix} 7 \\\\ 10 \\end{pmatrix} = \\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix}$$\n\n代回检验，$3 \\cdot 1 + 2 \\cdot 2 = 7$，$4 \\cdot 1 + 3 \\cdot 2 = 10$。",
  ),
  knowledgePoints: [
    {
      id: "matrix-inversion-form-for-2x2-system",
      title: t("Matrix equation form and inverse solution expression", "矩阵方程形式与逆矩阵表达式"),
      explanation: t(
        "Just as dividing both sides solves a number equation, multiplying both sides on the left by the inverse solves a matrix equation. The system $ax + by = e$, $cx + dy = f$ is represented as $A\\mathbf{x} = \\mathbf{b}$ with\n\n$$A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}, \\quad \\mathbf{x} = \\begin{pmatrix} x \\\\ y \\end{pmatrix}, \\quad \\mathbf{b} = \\begin{pmatrix} e \\\\ f \\end{pmatrix}$$\n\nLeft-multiplying by $A^{-1}$ yields $\\mathbf{x} = A^{-1}\\mathbf{b}$.\n\n> **Watch out.** The inverse goes on the left of $\\mathbf{b}$. The product $\\mathbf{b}A^{-1}$ is a $2 \\times 1$ column times a $2 \\times 2$ matrix, which is not even defined.",
        "就像两边同除可以解数的方程一样，两边同时左乘逆矩阵可以解矩阵方程。方程组 $ax + by = e$，$cx + dy = f$ 可以写成矩阵方程 $A\\mathbf{x} = \\mathbf{b}$，其中\n\n$$A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}, \\quad \\mathbf{x} = \\begin{pmatrix} x \\\\ y \\end{pmatrix}, \\quad \\mathbf{b} = \\begin{pmatrix} e \\\\ f \\end{pmatrix}$$\n\n两边左乘逆矩阵 $A^{-1}$，可得解向量 $\\mathbf{x} = A^{-1}\\mathbf{b}$。\n\n> **注意。** 逆矩阵要放在 $\\mathbf{b}$ 的左边。$\\mathbf{b}A^{-1}$ 是 $2 \\times 1$ 的列乘 $2 \\times 2$ 矩阵，根本没有定义。",
      ),
      generate(rng) {
        const a = rng.pick([2, 3, 4, 5]);
        const b = rng.pick([1, 2, 3]);
        const c = rng.pick([1, 2, 3]);
        const d = rng.pick([2, 3, 4]);
        if (a * d === b * c) return this.generate(rng);
        const e = rng.pick([-7, -5, -3, 2, 4, 6, 8]);
        const f = rng.pick([-6, -4, -1, 3, 5, 7]);

        const A: Mat2 = [
          [a, b],
          [c, d],
        ];
        const ALatex = mat2Latex(A);
        const bVec: Vec2 = [e, f];
        const bLatex = vec2Latex(bVec);

        return oneOf(
          rng,
          t(
            `Which matrix expression gives the solution $\\begin{pmatrix} x \\\\ y \\end{pmatrix}$ to the system $\\begin{cases} ${poly([a, "x"], [b, "y"])} = ${e} \\\\ ${poly([c, "x"], [d, "y"])} = ${f} \\end{cases}$?`,
            `哪一个矩阵表达式给出了方程组 $\\begin{cases} ${poly([a, "x"], [b, "y"])} = ${e} \\\\ ${poly([c, "x"], [d, "y"])} = ${f} \\end{cases}$ 的解 $\\begin{pmatrix} x \\\\ y \\end{pmatrix}$？`,
          ),
          t(`$${ALatex}^{-1} ${bLatex}$`, `$${ALatex}^{-1} ${bLatex}$`),
          [
            t(`$${bLatex} ${ALatex}^{-1}$`, `$${bLatex} ${ALatex}^{-1}$`),
            t(`$${ALatex} ${bLatex}$`, `$${ALatex} ${bLatex}$`),
            t(`$${bLatex}^{-1} ${ALatex}$`, `$${bLatex}^{-1} ${ALatex}$`),
            t(`$(${ALatex} ${bLatex})^{-1}$`, `$(${ALatex} ${bLatex})^{-1}$`),
          ],
          join(
            label(1, "Write the system as a product", "把方程组写成乘积"),
            t(
              "The coefficients form $A$, the unknowns form $\\mathbf{x}$, and the right sides form $\\mathbf{b}$:",
              "系数组成 $A$，未知数组成 $\\mathbf{x}$，右边组成 $\\mathbf{b}$：",
            ),
            shown(`${ALatex}\\begin{pmatrix} x \\\\ y \\end{pmatrix} = ${bLatex}`),
            para,
            label(2, "Multiply on the left by the inverse", "两边左乘逆矩阵"),
            t(
              "Since $A^{-1}A = I$, multiplying both sides on the left by $A^{-1}$ leaves $\\mathbf{x}$ alone:",
              "因为 $A^{-1}A = I$，两边左乘 $A^{-1}$ 后左边只剩 $\\mathbf{x}$：",
            ),
            shown(`\\begin{pmatrix} x \\\\ y \\end{pmatrix} = ${ALatex}^{-1}${bLatex}`),
            para,
            t(
              "Matrix multiplication is not commutative, so $A^{-1}$ has to stay on the left.",
              "矩阵乘法不满足交换律，所以 $A^{-1}$ 必须在左边。",
            ),
            checked(
              t(
                "Compare sizes. $A^{-1}$ is $2 \\times 2$ and $\\mathbf{b}$ is $2 \\times 1$, so $A^{-1}\\mathbf{b}$ is $2 \\times 1$, the size of the unknown vector. The reversed product $\\mathbf{b}A^{-1}$ would be $2 \\times 1$ times $2 \\times 2$, which is not defined.",
                "比较大小。$A^{-1}$ 是 $2 \\times 2$，$\\mathbf{b}$ 是 $2 \\times 1$，所以 $A^{-1}\\mathbf{b}$ 是 $2 \\times 1$，正是未知向量的大小。次序颠倒的 $\\mathbf{b}A^{-1}$ 是 $2 \\times 1$ 乘 $2 \\times 2$，没有定义。",
              ),
            ),
          ),
          [
            t(
              "A $2 \\times 1$ column times a $2 \\times 2$ matrix is not defined. The inverse goes on the left.",
              "$2 \\times 1$ 的列乘 $2 \\times 2$ 矩阵没有定义。逆矩阵应放在左边。",
            ),
            t("This multiplies by $A$ again instead of undoing it.", "这是再乘一次 $A$，而不是抵消它。"),
            t("A column vector has no inverse.", "列向量没有逆。"),
            t("$A\\mathbf{b}$ is a column vector, and a vector has no inverse.", "$A\\mathbf{b}$ 是列向量，向量没有逆。"),
          ],
        );
      },
    },
    {
      id: "solving-2x2-system-via-inverse-matrix",
      title: t("Solving a 2x2 linear system using the inverse matrix", "利用逆矩阵求解二元线性方程组"),
      explanation: t(
        "Once the inverse is known, the solution is a single matrix times vector product, and the entries of the result are the values of the variables. To solve $A\\mathbf{x} = \\mathbf{b}$, calculate $A^{-1} = \\frac{1}{\\det(A)}\\text{adj}(A)$ and multiply by $\\mathbf{b}$ to obtain $\\begin{pmatrix} x \\\\ y \\end{pmatrix}$.\n\n> **Watch out.** Remember to divide by the determinant. Multiplying $\\mathbf{b}$ by the adjugate alone gives a vector $\\det(A)$ times too large.",
        "求出逆矩阵后，解就是一次矩阵与向量的乘积，结果的各个元素就是变量的值。求解 $A\\mathbf{x} = \\mathbf{b}$ 时，先求出逆矩阵 $A^{-1} = \\frac{1}{\\det(A)}\\text{adj}(A)$，再计算矩阵乘积 $A^{-1}\\mathbf{b}$ 即可得到 $\\begin{pmatrix} x \\\\ y \\end{pmatrix}$。\n\n> **注意。** 别忘了除以行列式。只用伴随矩阵乘 $\\mathbf{b}$，得到的向量大了 $\\det(A)$ 倍。",
      ),
      generate(rng) {
        const x0 = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const y0 = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const candA: Mat2[] = [
          [
            [1, 2],
            [3, 5],
          ],
          [
            [2, 1],
            [5, 3],
          ],
          [
            [3, 1],
            [4, 2],
          ],
          [
            [2, 3],
            [1, 2],
          ],
          [
            [3, 2],
            [1, 1],
          ],
          [
            [4, 1],
            [3, 1],
          ],
          [
            [1, -1],
            [2, 1],
          ],
          [
            [2, -1],
            [1, 1],
          ],
          [
            [3, -2],
            [1, 1],
          ],
          [
            [1, 3],
            [2, 7],
          ],
          [
            [2, 5],
            [1, 3],
          ],
          [
            [5, 2],
            [2, 1],
          ],
          [
            [3, 4],
            [1, 2],
          ],
          [
            [4, 3],
            [1, 1],
          ],
          [
            [2, 1],
            [3, 2],
          ],
        ];
        const A = rng.pick(candA);
        const e = A[0][0] * x0 + A[0][1] * y0;
        const f = A[1][0] * x0 + A[1][1] * y0;

        const w1: Vec2 = [y0, x0];
        const w2: Vec2 = [-x0, y0];
        const w3: Vec2 = [x0, -y0];
        const w4: Vec2 = [x0 + 1, y0 - 1];

        const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
        const adj: Mat2 = [
          [A[1][1], -A[0][1]],
          [-A[1][0], A[0][0]],
        ];
        const p = adj[0][0] * e + adj[0][1] * f;
        const q = adj[1][0] * e + adj[1][1] * f;
        const middle = det === 1 ? "" : ` = ${over(det)}${vec2Latex([p, q])}`;

        return pointProblem({
          prompt: t(
            `Use inverse matrices to solve the system of equations:\n\n$$\\begin{cases} ${poly([A[0][0], "x"], [A[0][1], "y"])} = ${e} \\\\ ${poly([A[1][0], "x"], [A[1][1], "y"])} = ${f} \\end{cases}$$`,
            `利用逆矩阵求解下列方程组：\n\n$$\\begin{cases} ${poly([A[0][0], "x"], [A[0][1], "y"])} = ${e} \\\\ ${poly([A[1][0], "x"], [A[1][1], "y"])} = ${f} \\end{cases}$$`,
          ),
          answer: [x0, y0],
          vars: ["x", "y"],
          solution: join(
            label(1, "Find the determinant", "求行列式"),
            t(
              `The coefficient matrix is $A = ${mat2Latex(A)}$. Its determinant is $${paren(A[0][0])} \\cdot ${paren(A[1][1])} - ${paren(A[0][1])} \\cdot ${paren(A[1][0])} = ${det}$, which is not zero.`,
              `系数矩阵是 $A = ${mat2Latex(A)}$。它的行列式是 $${paren(A[0][0])} \\cdot ${paren(A[1][1])} - ${paren(A[0][1])} \\cdot ${paren(A[1][0])} = ${det}$，不为零。`,
            ),
            para,
            label(2, "Multiply by the inverse", "乘逆矩阵"),
            t(
              "The inverse is the adjugate divided by the determinant, and it multiplies the right side:",
              "逆矩阵是伴随矩阵除以行列式，用它乘右边：",
            ),
            shown(
              `\\begin{pmatrix} x \\\\ y \\end{pmatrix} = ${over(det)}${mat2Latex(adj)}${vec2Latex([e, f])}${middle} = ${vec2Latex([x0, y0])}`,
            ),
            para,
            t(`So $(x, y) = (${x0}, ${y0})$.`, `所以 $(x, y) = (${x0}, ${y0})$。`),
            checked(
              t(
                `Substitute back. The left side of the first equation is $${dot(A[0], [x0, y0])}$. The left side of the second is $${dot(A[1], [x0, y0])}$. These are the right sides $${e}$ and $${f}$.`,
                `代回原方程组。第一个方程的左边是 $${dot(A[0], [x0, y0])}$。第二个方程的左边是 $${dot(A[1], [x0, y0])}$。正是右边的 $${e}$ 和 $${f}$。`,
              ),
            ),
          ),
          wrong: [w1, w2, w3, w4],
        });
      },
    },
  ],
};

/** solvingSystemsOfEquationsUsingInverseMatrices covers uniqueness, solvability and 3x3 systems. */
export const solvingSystemsOfEquationsUsingInverseMatrices: TopicDef = {
  id: "solving-systems-of-equations-using-inverse-matrices",
  title: t("Solving Systems of Equations Using Inverse Matrices", "利用逆矩阵求解线性方程组"),
  summary: t(
    "Understand when systems have unique solutions via invertibility, and solve systems given an inverse matrix.",
    "理解利用矩阵可逆性判断线性方程组解的唯一性，并利用已知逆矩阵求解方程组。",
  ),
  prerequisites: ["solving-2x2-systems-of-equations-using-inverse-matrices"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSA.REI.C.8", "CCSS.HSA.REI.C.9"],
  intro: t(
    "You can solve a $2 \\times 2$ system with $\\mathbf{x} = A^{-1}\\mathbf{b}$. The same formula works for a square system of any size, as long as $A^{-1}$ exists. So the determinant tells you in advance whether there is exactly one solution, and once the inverse is known, solving takes one product.\n\nThe system $x + 2y = 3$, $2x + 4y = 5$ has determinant $1 \\cdot 4 - 2 \\cdot 2 = 0$. Its left sides are proportional, so it has no unique solution. Now suppose a $3 \\times 3$ system $A\\mathbf{x} = \\mathbf{b}$ has\n\n$$A^{-1} = \\begin{pmatrix} 2 & 0 & 1 \\\\ 0 & 1 & 0 \\\\ 1 & 0 & 1 \\end{pmatrix}, \\quad \\mathbf{b} = \\begin{pmatrix} 1 \\\\ 2 \\\\ 3 \\end{pmatrix}$$\n\nThen $x = 2 \\cdot 1 + 0 \\cdot 2 + 1 \\cdot 3 = 5$, $y = 2$ and $z = 1 \\cdot 1 + 1 \\cdot 3 = 4$.",
    "你会用 $\\mathbf{x} = A^{-1}\\mathbf{b}$ 解 $2 \\times 2$ 方程组。只要 $A^{-1}$ 存在，同一个公式对任何大小的方阵方程组都适用。所以行列式能预先告诉你是否恰有一个解，而知道逆矩阵以后，求解只需一次乘法。\n\n方程组 $x + 2y = 3$，$2x + 4y = 5$ 的行列式是 $1 \\cdot 4 - 2 \\cdot 2 = 0$。它的两个左边成比例，所以没有唯一解。再设 $3 \\times 3$ 方程组 $A\\mathbf{x} = \\mathbf{b}$ 中\n\n$$A^{-1} = \\begin{pmatrix} 2 & 0 & 1 \\\\ 0 & 1 & 0 \\\\ 1 & 0 & 1 \\end{pmatrix}, \\quad \\mathbf{b} = \\begin{pmatrix} 1 \\\\ 2 \\\\ 3 \\end{pmatrix}$$\n\n于是 $x = 2 \\cdot 1 + 0 \\cdot 2 + 1 \\cdot 3 = 5$，$y = 2$，$z = 1 \\cdot 1 + 1 \\cdot 3 = 4$。",
  ),
  knowledgePoints: [
    {
      id: "solvability-and-invertibility-of-linear-systems",
      title: t("Uniqueness of solutions and matrix invertibility", "矩阵可逆性与解的存在唯一性"),
      explanation: t(
        "A square linear system $A\\mathbf{x} = \\mathbf{b}$ has a unique solution $\\mathbf{x} = A^{-1}\\mathbf{b}$ if and only if $A$ is invertible (i.e. $\\det(A) \\ne 0$). If $\\det(A) = 0$, the system either has no solution or infinitely many solutions.\n\n> **Watch out.** A zero determinant does not say there is no solution. It says there is no unique one: there may be none or infinitely many.",
        "线性方程组 $A\\mathbf{x} = \\mathbf{b}$ 存在唯一解 $\\mathbf{x} = A^{-1}\\mathbf{b}$ 的充要条件是系数矩阵 $A$ 可逆（即 $\\det(A) \\ne 0$）。若 $\\det(A) = 0$，则方程组无解或有无穷多解。\n\n> **注意。** 行列式为零并不说明无解，而是说明没有唯一解：可能无解，也可能有无穷多解。",
      ),
      generate(rng) {
        const a = rng.pick([2, 3, 4, 5]);
        const b = rng.pick([1, 2, 3, 4]);
        const m = rng.pick([2, 3, -2, -3]);
        const c = a * m;
        const d = b * m;

        const isSingular = rng.pick([true, false]);
        const actualD = isSingular ? d : d + rng.pick([1, -1, 2, -2]);
        const det = a * actualD - b * c;
        const A: Mat2 = [
          [a, b],
          [c, actualD],
        ];
        const ALatex = mat2Latex(A);
        const findDet = join(
          label(1, "Find the determinant", "求行列式"),
          t(
            `$\\det(A) = ${paren(a)} \\cdot ${paren(actualD)} - ${paren(b)} \\cdot ${paren(c)} = ${det}$.`,
            `$\\det(A) = ${paren(a)} \\cdot ${paren(actualD)} - ${paren(b)} \\cdot ${paren(c)} = ${det}$。`,
          ),
          para,
          label(2, "Decide", "下结论"),
        );

        if (det === 0) {
          return oneOf(
            rng,
            t(
              `Does the matrix equation $${ALatex} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix}$ have a unique solution?`,
              `矩阵方程 $${ALatex} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix}$ 是否有唯一解？`,
            ),
            t(`No, because $\\det(A) = 0$, so the matrix is not invertible.`, `否，因为 $\\det(A) = 0$，系数矩阵不可逆。`),
            [
              t(`Yes, because $\\det(A) \\ne 0$, so $A^{-1}$ exists.`, `是，因为 $\\det(A) \\ne 0$，逆矩阵存在。`),
              t(`Yes, because every linear system has a unique solution.`, `是，因为任何线性方程组都有唯一解。`),
              t(`No, because the right-hand vector has non-zero entries.`, `否，因为等号右侧常数向量非零。`),
            ],
            join(
              findDet,
              t(
                "Since $\\det(A) = 0$, $A$ is singular and has no inverse. So the system does not have a unique solution.",
                "由于 $\\det(A) = 0$，$A$ 奇异，没有逆矩阵。所以方程组没有唯一解。",
              ),
              checked(
                t(
                  `Compare the rows of $A$. Row $2$ is $(${c}, ${actualD})$, which is $${m}$ times row $1$, $(${a}, ${b})$. So the left side of the second equation is $${m}$ times the left side of the first, and the two equations cannot pin down a single point.`,
                  `比较 $A$ 的两行。第 $2$ 行 $(${c}, ${actualD})$ 是第 $1$ 行 $(${a}, ${b})$ 的 $${m}$ 倍。所以第二个方程的左边是第一个方程左边的 $${m}$ 倍，两个方程不能确定唯一的一点。`,
                ),
              ),
            ),
            [
              t("The determinant here is $0$, so $A^{-1}$ does not exist.", "这里行列式是 $0$，所以 $A^{-1}$ 不存在。"),
              t("Systems whose matrix has determinant $0$ do not have a unique solution.", "系数矩阵行列式为 $0$ 的方程组没有唯一解。"),
              t("The right side does not decide uniqueness. The determinant does.", "是否唯一不由右边决定，而由行列式决定。"),
            ],
          );
        }

        return oneOf(
          rng,
          t(
            `Does the matrix equation $${ALatex} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ 5 \\end{pmatrix}$ have a unique solution?`,
            `矩阵方程 $${ALatex} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ 5 \\end{pmatrix}$ 是否有唯一解？`,
          ),
          t(`Yes, because $\\det(A) = ${det} \\ne 0$, so $A$ is invertible.`, `是，因为 $\\det(A) = ${det} \\ne 0$，系数矩阵可逆。`),
          [
            t(`No, because $\\det(A) = 0$, so the matrix is singular.`, `否，因为 $\\det(A) = 0$，矩阵奇异。`),
            t(`No, because $2 \\times 2$ systems never have unique solutions.`, `否，因为二阶系统从无唯一解。`),
            t(`Yes, but only if the right-hand side is the zero vector.`, `是，但仅当常数项为零向量时才成立。`),
          ],
          join(
            findDet,
            t(
              "Since $\\det(A) \\ne 0$, $A$ is invertible. So the system has the unique solution $\\mathbf{x} = A^{-1}\\mathbf{b}$.",
              "由于 $\\det(A) \\ne 0$，$A$ 可逆。所以方程组有唯一解 $\\mathbf{x} = A^{-1}\\mathbf{b}$。",
            ),
            checked(
              t(
                `Compare the rows of $A$. The only multiple of row $1$, $(${a}, ${b})$, that starts with $${c}$ is $${m}$ times it, $(${c}, ${m * b})$. Row $2$ is $(${c}, ${actualD})$, so it is not a multiple of row $1$, and the two equations describe lines that cross at one point.`,
                `比较 $A$ 的两行。第 $1$ 行 $(${a}, ${b})$ 的倍数中，以 $${c}$ 开头的只有它的 $${m}$ 倍 $(${c}, ${m * b})$。第 $2$ 行是 $(${c}, ${actualD})$，不是第 $1$ 行的倍数，所以两个方程表示的直线交于一点。`,
              ),
            ),
          ),
          [
            t(`The determinant here is $${det}$, not $0$.`, `这里行列式是 $${det}$，不是 $0$。`),
            t(
              "A $2 \\times 2$ system has a unique solution whenever its determinant is not zero.",
              "只要行列式不为零，$2 \\times 2$ 方程组就有唯一解。",
            ),
            t(
              "An invertible matrix gives a unique solution for every right side, not only the zero vector.",
              "矩阵可逆时，对任何右边都有唯一解，不只是零向量。",
            ),
          ],
        );
      },
    },
    {
      id: "solving-systems-given-matrix-inverse",
      title: t("Solving a 3x3 system using a given inverse matrix", "利用已知逆矩阵求解三阶线性方程组"),
      explanation: t(
        "When the inverse matrix $A^{-1}$ of a system $A\\mathbf{x} = \\mathbf{b}$ is already known, we directly calculate the solution vector by matrix-vector multiplication: $\\mathbf{x} = A^{-1}\\mathbf{b}$.\n\n> **Watch out.** Each unknown comes from one row of $A^{-1}$ times $\\mathbf{b}$. Use row $1$ for $x$, row $2$ for $y$ and row $3$ for $z$.",
        "当方程组 $A\\mathbf{x} = \\mathbf{b}$ 的逆矩阵 $A^{-1}$ 已知时，直接通过矩阵与向量的乘积求解未知向量：$\\mathbf{x} = A^{-1}\\mathbf{b}$。\n\n> **注意。** 每个未知数来自 $A^{-1}$ 的一行乘 $\\mathbf{b}$。第 $1$ 行给出 $x$，第 $2$ 行给出 $y$，第 $3$ 行给出 $z$。",
      ),
      generate(rng) {
        const a = rng.pick([-2, -1, 1, 2]);
        const bVal = rng.pick([-2, -1, 1, 2]);
        const c = rng.pick([-2, -1, 1, 2]);
        const isUpper = rng.pick([true, false]);

        let inv: Mat3;
        let A: Mat3;
        if (isUpper) {
          inv = [
            [1, a, bVal],
            [0, 1, c],
            [0, 0, 1],
          ];
          A = [
            [1, -a, a * c - bVal],
            [0, 1, -c],
            [0, 0, 1],
          ];
        } else {
          inv = [
            [1, 0, 0],
            [a, 1, 0],
            [bVal, c, 1],
          ];
          A = [
            [1, 0, 0],
            [-a, 1, 0],
            [a * c - bVal, -c, 1],
          ];
        }

        const b: Vec3 = [
          rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]),
          rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]),
          rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]),
        ];
        const x = inv[0][0] * b[0] + inv[0][1] * b[1] + inv[0][2] * b[2];
        const y = inv[1][0] * b[0] + inv[1][1] * b[1] + inv[1][2] * b[2];
        const z = inv[2][0] * b[0] + inv[2][1] * b[1] + inv[2][2] * b[2];

        const invLatex = mat3Latex(inv);
        const bLatex = vec3Latex(b);

        const w1: Vec3 = [x + 1, y - 1, z];
        const w2: Vec3 = [z, y, x];
        const w3: Vec3 = [-x, y, z];
        const w4: Vec3 = [x, -y, z];

        return oneOf(
          rng,
          t(
            `Given that the inverse of the coefficient matrix $A$ is $A^{-1} = ${invLatex}$, solve the system $A\\mathbf{x} = ${bLatex}$ for $\\mathbf{x} = \\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix}$.`,
            `已知系数矩阵 $A$ 的逆矩阵为 $A^{-1} = ${invLatex}$，求解方程组 $A\\mathbf{x} = ${bLatex}$ 中的未知向量 $\\mathbf{x} = \\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix}$。`,
          ),
          t(
            `$\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = ${vec3Latex([x, y, z])}$`,
            `$\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = ${vec3Latex([x, y, z])}$`,
          ),
          [
            t(
              `$\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = ${vec3Latex(w1)}$`,
              `$\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = ${vec3Latex(w1)}$`,
            ),
            t(
              `$\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = ${vec3Latex(w2)}$`,
              `$\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = ${vec3Latex(w2)}$`,
            ),
            t(
              `$\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = ${vec3Latex(w3)}$`,
              `$\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = ${vec3Latex(w3)}$`,
            ),
            t(
              `$\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = ${vec3Latex(w4)}$`,
              `$\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = ${vec3Latex(w4)}$`,
            ),
          ],
          join(
            label(1, "Multiply on the left by the inverse", "两边左乘逆矩阵"),
            t("Since $A^{-1}A = I$, the solution is", "因为 $A^{-1}A = I$，解是"),
            shown(`\\mathbf{x} = A^{-1}\\mathbf{b} = ${invLatex}${bLatex}`),
            para,
            label(2, "Multiply row by row", "逐行相乘"),
            t(
              `Row $1$ gives $x = ${dot(inv[0], b)}$. Row $2$ gives $y = ${dot(inv[1], b)}$. Row $3$ gives $z = ${dot(inv[2], b)}$. So $(x, y, z) = (${x}, ${y}, ${z})$.`,
              `第 $1$ 行给出 $x = ${dot(inv[0], b)}$。第 $2$ 行给出 $y = ${dot(inv[1], b)}$。第 $3$ 行给出 $z = ${dot(inv[2], b)}$。所以 $(x, y, z) = (${x}, ${y}, ${z})$。`,
            ),
            checked(
              join(
                t(
                  "The inverse of $A^{-1}$ is $A$. Inverting this triangular matrix, which has $1$s on the diagonal, gives",
                  "$A^{-1}$ 的逆就是 $A$。对这个对角线上为 $1$ 的三角矩阵求逆，得",
                ),
                shown(`A = ${mat3Latex(A)}`),
                para,
                t(
                  `Multiply it by the answer. Row $1$ gives $${dot(A[0], [x, y, z])}$. Row $2$ gives $${dot(A[1], [x, y, z])}$. Row $3$ gives $${dot(A[2], [x, y, z])}$. These are the entries of $\\mathbf{b}$.`,
                  `用它乘答案。第 $1$ 行得 $${dot(A[0], [x, y, z])}$。第 $2$ 行得 $${dot(A[1], [x, y, z])}$。第 $3$ 行得 $${dot(A[2], [x, y, z])}$。正是 $\\mathbf{b}$ 的各元素。`,
                ),
              ),
            ),
          ),
          [
            t(
              "Two entries are off by one. Recompute the row products for $x$ and $y$.",
              "有两个元素差了 $1$。重新计算 $x$ 和 $y$ 的行乘积。",
            ),
            t("This lists the entries in reverse order.", "这里把各元素的次序颠倒了。"),
            t("The sign of $x$ is wrong.", "$x$ 的符号错了。"),
            t("The sign of $y$ is wrong.", "$y$ 的符号错了。"),
          ],
        );
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE 6.25: LINEAR TRANSFORMATIONS (PART 1: TOPICS 6 TO 11)
// ════════════════════════════════════════════════════════════════════════════

/** introductionToLinearTransformations introduces linear maps in R^2 and their defining properties. */
export const introductionToLinearTransformations: TopicDef = {
  id: "introduction-to-linear-transformations",
  title: t("Introduction to Linear Transformations", "线性变换的概念"),
  summary: t(
    "Understand maps from $\\mathbb{R}^2$ to $\\mathbb{R}^2$ that are additive and homogeneous.",
    "理解从 $\\mathbb{R}^2$ 到 $\\mathbb{R}^2$ 的映射，掌握线性变换的可加性与齐次性。",
  ),
  prerequisites: ["multiplying-a-matrix-by-a-column-vector"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.11"],
  intro: t(
    "You can multiply a matrix by a column vector. Doing so turns each vector of the plane into another one, and such a rule is called a transformation. The transformations that come from matrices are the linear ones: they respect sums and multiples, so they send straight lines to straight lines and keep the origin in place. Rotations, reflections and stretches are all of this kind.\n\nTake $T(x, y) = (2x + y, x - 3y)$. Then $T(1, 2) = (4, -5)$ and $T(2, 4) = (8, -10)$, which is $2T(1, 2)$, as linearity requires. By contrast, $S(x, y) = (x + 1, y)$ sends the origin to $(1, 0)$, so it is not linear.",
    "你会用矩阵乘列向量。这样做把平面上的每个向量变成另一个向量，这样的规则叫做变换。由矩阵给出的变换就是线性变换：它们保持和与倍数，所以把直线变成直线，并保持原点不动。旋转、反射和伸缩都属于这一类。\n\n取 $T(x, y) = (2x + y, x - 3y)$。则 $T(1, 2) = (4, -5)$，$T(2, 4) = (8, -10)$，正是 $2T(1, 2)$，符合线性的要求。相比之下，$S(x, y) = (x + 1, y)$ 把原点变到 $(1, 0)$，所以不是线性的。",
  ),
  knowledgePoints: [
    {
      id: "definition-and-properties-of-linear-transformations",
      title: t("Properties and linearity tests", "线性变换的性质与判定"),
      explanation: t(
        "A transformation $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ is linear if and only if for all vectors $\\mathbf{u}, \\mathbf{v}$ and scalars $c$:\n1. $T(\\mathbf{u} + \\mathbf{v}) = T(\\mathbf{u}) + T(\\mathbf{v})$ (additivity)\n2. $T(c\\mathbf{u}) = c T(\\mathbf{u})$ (homogeneity)\nIn particular, every linear transformation maps the origin to itself: $T(\\mathbf{0}) = \\mathbf{0}$.\n\n> **Watch out.** Keeping the origin fixed is not enough. Terms such as $x^2$, $xy$ and $|x|$ keep the origin fixed and still break the rules for sums and multiples.",
        "映射 $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ 是线性变换，当且仅当对任意向量 $\\mathbf{u}, \\mathbf{v}$ 及标量 $c$ 满足：\n1. $T(\\mathbf{u} + \\mathbf{v}) = T(\\mathbf{u}) + T(\\mathbf{v})$（可加性）\n2. $T(c\\mathbf{u}) = c T(\\mathbf{u})$（齐次性）\n特别地，所有线性变换必将原点映射到原点：$T(\\mathbf{0}) = \\mathbf{0}$。\n\n> **注意。** 只保持原点不动还不够。$x^2$、$xy$ 和 $|x|$ 这样的项也保持原点不动，却不满足和与倍数的规则。",
      ),
      generate(rng) {
        const isLinear = rng.pick([true, false]);
        const a = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const b = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const c = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const d = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const k = rng.pick([2, 3, 4, 5]);

        let formula = "";
        let look: Text;
        let test: Text;
        let check: Text;
        let whyOpposite: Text;

        if (isLinear) {
          formula = `(${poly([a, "x"], [b, "y"])}, \\; ${poly([c, "x"], [d, "y"])})`;
          look = t(
            "Each component is a multiple of $x$ plus a multiple of $y$, with no constant, power, product or absolute value.",
            "每个分量都是 $x$ 的倍数加 $y$ 的倍数，没有常数项、乘方、乘积或绝对值。",
          );
          test = t(
            `So $T$ is multiplication by a matrix. Its matrix is $${mat2Latex([
              [a, b],
              [c, d],
            ])}$. Every matrix map respects sums and multiples, so $T$ is linear.`,
            `所以 $T$ 是乘一个矩阵。它的矩阵是 $${mat2Latex([
              [a, b],
              [c, d],
            ])}$。每个矩阵映射都保持和与倍数，所以 $T$ 是线性的。`,
          );
          check = t(
            `Test a multiple. $T(1, 1) = (${a + b}, ${c + d})$ and $T(2, 2) = (${2 * (a + b)}, ${2 * (c + d)})$, which is $2T(1, 1)$.`,
            `检验倍数。$T(1, 1) = (${a + b}, ${c + d})$，$T(2, 2) = (${2 * (a + b)}, ${2 * (c + d)})$，正是 $2T(1, 1)$。`,
          );
          whyOpposite = t(
            "Each component has the form $ax + by$, and every map of that form is linear.",
            "每个分量都是 $ax + by$ 的形式，这种形式的映射都是线性的。",
          );
        } else {
          const nonlinType = rng.pick(["offset", "square", "product", "abs"]);
          if (nonlinType === "offset") {
            formula = `(${poly([a, "x"], [b, "y"], [k, ""])}, \\; ${poly([c, "x"], [d, "y"])})`;
            look = t(`The first component has the constant term $${k}$.`, `第一个分量有常数项 $${k}$。`);
            test = t(
              `A linear map sends the origin to the origin, but $T(0, 0) = (${k}, 0)$. So $T$ is not linear.`,
              `线性映射把原点变到原点，但 $T(0, 0) = (${k}, 0)$。所以 $T$ 不是线性的。`,
            );
            check = t(
              `Test a multiple. $T(1, 0) = (${a + k}, ${c})$, so $2T(1, 0) = (${2 * (a + k)}, ${2 * c})$. But $T(2, 0) = (${2 * a + k}, ${2 * c})$. The first components differ by $${k}$, so $T$ fails again.`,
              `检验倍数。$T(1, 0) = (${a + k}, ${c})$，所以 $2T(1, 0) = (${2 * (a + k)}, ${2 * c})$。但 $T(2, 0) = (${2 * a + k}, ${2 * c})$。第一个分量相差 $${k}$，所以 $T$ 仍不满足。`,
            );
            whyOpposite = t(
              "The constant term moves the origin, so the map cannot be linear.",
              "常数项移动了原点，所以这个映射不可能是线性的。",
            );
          } else if (nonlinType === "square") {
            formula = `(${poly([1, "x^2"], [b, "y"])}, \\; ${poly([c, "x"])})`;
            look = t("The first component contains $x^2$.", "第一个分量含有 $x^2$。");
            test = t(
              `Doubling the input should double the output. But $T(2, 0) = (4, ${2 * c})$, while $2T(1, 0) = (2, ${2 * c})$. So $T$ is not linear.`,
              `输入加倍，输出应该加倍。但 $T(2, 0) = (4, ${2 * c})$，而 $2T(1, 0) = (2, ${2 * c})$。所以 $T$ 不是线性的。`,
            );
            check = t(
              `Test a negative multiple. $T(-1, 0) = (1, ${-c})$, while $-T(1, 0) = (-1, ${-c})$. The first components differ, so $T$ fails again.`,
              `检验负倍数。$T(-1, 0) = (1, ${-c})$，而 $-T(1, 0) = (-1, ${-c})$。第一个分量不同，所以 $T$ 仍不满足。`,
            );
            whyOpposite = t(
              "The term $x^2$ does not scale like $x$, so the map cannot be linear.",
              "$x^2$ 不像 $x$ 那样按倍数变化，所以这个映射不可能是线性的。",
            );
          } else if (nonlinType === "product") {
            formula = `(xy, \\; ${poly([c, "x"], [d, "y"])})`;
            look = t("The first component is the product $xy$.", "第一个分量是乘积 $xy$。");
            test = t(
              `Doubling the input should double the output. But $T(2, 2) = (4, ${2 * (c + d)})$, while $2T(1, 1) = (2, ${2 * (c + d)})$. So $T$ is not linear.`,
              `输入加倍，输出应该加倍。但 $T(2, 2) = (4, ${2 * (c + d)})$，而 $2T(1, 1) = (2, ${2 * (c + d)})$。所以 $T$ 不是线性的。`,
            );
            check = t(
              `Test a sum. $T(1, 1) = (1, ${c + d})$. Adding the images of the pieces gives $T(1, 0) + T(0, 1) = (0, ${c}) + (0, ${d}) = (0, ${c + d})$. The first components differ, so $T$ fails again.`,
              `检验和。$T(1, 1) = (1, ${c + d})$。把各部分的像相加得 $T(1, 0) + T(0, 1) = (0, ${c}) + (0, ${d}) = (0, ${c + d})$。第一个分量不同，所以 $T$ 仍不满足。`,
            );
            whyOpposite = t(
              "The product $xy$ does not respect sums or multiples, so the map cannot be linear.",
              "乘积 $xy$ 不保持和与倍数，所以这个映射不可能是线性的。",
            );
          } else {
            formula = `(|x|, \\; ${poly([c, "y"])})`;
            look = t("The first component is $|x|$.", "第一个分量是 $|x|$。");
            test = t(
              "A linear map sends $-\\mathbf{v}$ to $-T(\\mathbf{v})$. But $T(-1, 0) = (1, 0)$, while $-T(1, 0) = (-1, 0)$. So $T$ is not linear.",
              "线性映射把 $-\\mathbf{v}$ 变到 $-T(\\mathbf{v})$。但 $T(-1, 0) = (1, 0)$，而 $-T(1, 0) = (-1, 0)$。所以 $T$ 不是线性的。",
            );
            check = t(
              "Test a sum. $(1, 0) + (-1, 0) = (0, 0)$, and $T(0, 0) = (0, 0)$. Adding the images of the pieces gives $T(1, 0) + T(-1, 0) = (1, 0) + (1, 0) = (2, 0)$. The two results differ, so $T$ fails again.",
              "检验和。$(1, 0) + (-1, 0) = (0, 0)$，而 $T(0, 0) = (0, 0)$。把各部分的像相加得 $T(1, 0) + T(-1, 0) = (1, 0) + (1, 0) = (2, 0)$。两个结果不同，所以 $T$ 仍不满足。",
            );
            whyOpposite = t(
              "The absolute value $|x|$ does not respect negative multiples, so the map cannot be linear.",
              "绝对值 $|x|$ 不保持负倍数，所以这个映射不可能是线性的。",
            );
          }
        }

        const rightAnswer = isLinear
          ? t("Yes, it is a linear transformation", "是，它是线性变换")
          : t("No, it is not a linear transformation", "否，它不是线性变换");

        const wrong1 = isLinear
          ? t("No, it is not a linear transformation", "否，它不是线性变换")
          : t("Yes, it is a linear transformation", "是，它是线性变换");

        const wrong2 = t("It is linear only when $x > 0$ and $y > 0$", "仅当 $x > 0$ 且 $y > 0$ 时才是线性变换");
        const wrong3 = t("Linearity cannot be determined from coordinate formulas", "仅凭坐标表达式无法判断是否线性");

        return oneOf(
          rng,
          t(
            `Determine whether the mapping $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ defined by $T(x, y) = ${formula}$ is a linear transformation.`,
            `判断由公式 $T(x, y) = ${formula}$ 定义的映射 $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ 是否为线性变换。`,
          ),
          rightAnswer,
          [wrong1, wrong2, wrong3],
          join(
            label(1, "Look at the components", "看各个分量"),
            look,
            para,
            label(2, isLinear ? "Find the matrix" : "Test the rules", isLinear ? "找出矩阵" : "检验规则"),
            test,
            checked(check),
          ),
          [
            whyOpposite,
            t(
              "Linearity is a rule about all vectors at once. It does not hold in some quadrants and fail in others.",
              "线性是对所有向量的要求，不会在某些象限成立、在另一些象限不成立。",
            ),
            t(
              "The formula settles it. Testing sums and multiples, or finding a matrix, decides the question.",
              "由公式就能判断。检验和与倍数，或者找出矩阵，就能下结论。",
            ),
          ],
        );
      },
    },
    {
      id: "evaluating-linear-transformations-on-vectors",
      title: t("Evaluating linear transformations on linear combinations", "在线性组合上计算线性变换"),
      explanation: t(
        "A linear transformation respects addition and scaling, so knowing its values on a few vectors determines its value on any combination of them. By linearity, for any vectors $\\mathbf{u}, \\mathbf{v}$ and constants $c_1, c_2$, we have $T(c_1\\mathbf{u} + c_2\\mathbf{v}) = c_1 T(\\mathbf{u}) + c_2 T(\\mathbf{v})$.\n\n> **Watch out.** Keep each coefficient with its own image. A negative coefficient changes the sign of every component of that image.",
        "线性变换保持加法和数乘，所以知道它在几个向量上的值，就能求出它在这些向量任意组合上的值。根据线性性质，对任意向量 $\\mathbf{u}, \\mathbf{v}$ 和常数 $c_1, c_2$，均有 $T(c_1\\mathbf{u} + c_2\\mathbf{v}) = c_1 T(\\mathbf{u}) + c_2 T(\\mathbf{v})$。\n\n> **注意。** 每个系数要配它自己的像。负系数会改变那个像每个分量的符号。",
      ),
      generate(rng) {
        const uImg: Vec2 = [rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]), rng.pick([-4, -3, -2, -1, 1, 2, 3, 4])];
        const vImg: Vec2 = [rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]), rng.pick([-4, -3, -2, -1, 1, 2, 3, 4])];
        const c1 = rng.pick([-3, -2, 2, 3]);
        const c2 = rng.pick([-3, -2, 2, 3]);

        const rx = c1 * uImg[0] + c2 * vImg[0];
        const ry = c1 * uImg[1] + c2 * vImg[1];
        const rightVec: Vec2 = [rx, ry];

        const w1: Vec2 = [rx + 1, ry - 1];
        const w2: Vec2 = [c1 * uImg[0] - c2 * vImg[0], c1 * uImg[1] - c2 * vImg[1]];
        const w3: Vec2 = [c2 * uImg[0] + c1 * vImg[0], c2 * uImg[1] + c1 * vImg[1]];
        const w4: Vec2 = [-rx, -ry];

        const uLatex = vec2Latex(uImg);
        const vLatex = vec2Latex(vImg);
        const combo = poly([c1, "\\mathbf{u}"], [c2, "\\mathbf{v}"]);

        return pointProblem({
          prompt: t(
            `Let $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ be a linear transformation such that $T(\\mathbf{u}) = ${uLatex}$ and $T(\\mathbf{v}) = ${vLatex}$. Find $T(${combo})$.`,
            `设 $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ 是线性变换，且 $T(\\mathbf{u}) = ${uLatex}$，$T(\\mathbf{v}) = ${vLatex}$。求 $T(${combo})$ 的值。`,
          ),
          answer: rightVec,
          vector: true,
          solution: join(
            label(1, "Use linearity", "利用线性"),
            t(
              `A linear map respects sums and multiples, so $T(${combo}) = ${poly([c1, "T(\\mathbf{u})"], [c2, "T(\\mathbf{v})"])}$.`,
              `线性映射保持和与倍数，所以 $T(${combo}) = ${poly([c1, "T(\\mathbf{u})"], [c2, "T(\\mathbf{v})"])}$。`,
            ),
            para,
            label(2, "Combine the images", "组合各个像"),
            t(
              `The first component is $${dot([c1, c2], [uImg[0], vImg[0]])}$. The second is $${dot([c1, c2], [uImg[1], vImg[1]])}$. So $T(${combo}) = ${vectorLatex(rightVec)}$.`,
              `第一个分量是 $${dot([c1, c2], [uImg[0], vImg[0]])}$。第二个分量是 $${dot([c1, c2], [uImg[1], vImg[1]])}$。所以 $T(${combo}) = ${vectorLatex(rightVec)}$。`,
            ),
            checked(
              t(
                `Take away the part from $\\mathbf{u}$. The answer minus $${c1}T(\\mathbf{u})$ is $(${rx} - ${paren(c1 * uImg[0])}, ${ry} - ${paren(c1 * uImg[1])}) = (${c2 * vImg[0]}, ${c2 * vImg[1]})$. This is $${c2}$ times $T(\\mathbf{v})$, as it should be.`,
                `去掉来自 $\\mathbf{u}$ 的部分。答案减去 $${c1}T(\\mathbf{u})$ 得 $(${rx} - ${paren(c1 * uImg[0])}, ${ry} - ${paren(c1 * uImg[1])}) = (${c2 * vImg[0]}, ${c2 * vImg[1]})$。这正是 $T(\\mathbf{v})$ 的 $${c2}$ 倍。`,
              ),
            ),
          ),
          wrong: [w1, w2, w3, w4],
        });
      },
    },
  ],
};

/** theStandardMatrixOfALinearTransformation constructs standard matrices from basis vector images. */
export const theStandardMatrixOfALinearTransformation: TopicDef = {
  id: "the-standard-matrix-of-a-linear-transformation",
  title: t("The Standard Matrix of a Linear Transformation", "线性变换的标准矩阵"),
  summary: t(
    "Construct the standard matrix of a linear transformation using the images of the standard basis vectors.",
    "利用标准基向量的像构造线性变换的标准矩阵。",
  ),
  prerequisites: ["introduction-to-linear-transformations"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.11"],
  intro: t(
    "You know that a linear transformation respects sums and multiples. Every vector is $(x, y) = x\\mathbf{e}_1 + y\\mathbf{e}_2$, so $T(x, y) = xT(\\mathbf{e}_1) + yT(\\mathbf{e}_2)$. That means two images decide the whole transformation, and placing them side by side as columns gives a matrix that does the same job. This matrix is the standard matrix of $T$, and it lets you compute any image by one multiplication.\n\nSuppose $T(\\mathbf{e}_1) = (7, -2)$ and $T(\\mathbf{e}_2) = (0, 8)$. Then\n\n$$A = \\begin{pmatrix} 7 & 0 \\\\ -2 & 8 \\end{pmatrix}$$\n\nFor the vector $(3, 1)$, linearity gives $3(7, -2) + 1(0, 8) = (21, 2)$. The matrix gives the same: $7 \\cdot 3 + 0 \\cdot 1 = 21$ and $-2 \\cdot 3 + 8 \\cdot 1 = 2$.",
    "你知道线性变换保持和与倍数。每个向量都是 $(x, y) = x\\mathbf{e}_1 + y\\mathbf{e}_2$，所以 $T(x, y) = xT(\\mathbf{e}_1) + yT(\\mathbf{e}_2)$。这说明两个像就决定了整个变换，把它们作为列并排放好，就得到一个起同样作用的矩阵。这个矩阵叫 $T$ 的标准矩阵，用它乘一次就能求出任何像。\n\n设 $T(\\mathbf{e}_1) = (7, -2)$，$T(\\mathbf{e}_2) = (0, 8)$。则\n\n$$A = \\begin{pmatrix} 7 & 0 \\\\ -2 & 8 \\end{pmatrix}$$\n\n对向量 $(3, 1)$，由线性得 $3(7, -2) + 1(0, 8) = (21, 2)$。用矩阵得到同样的结果：$7 \\cdot 3 + 0 \\cdot 1 = 21$，$-2 \\cdot 3 + 8 \\cdot 1 = 2$。",
  ),
  knowledgePoints: [
    {
      id: "constructing-standard-matrix-from-basis-images",
      title: t("Standard matrix from images of basis vectors", "由基向量的像构造标准矩阵"),
      explanation: t(
        "Every linear transformation $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ can be represented as multiplication by a unique matrix $A = [T(\\mathbf{e}_1) \\mid T(\\mathbf{e}_2)]$, whose columns are the images of the standard basis vectors\n\n$$\\mathbf{e}_1 = \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix}, \\quad \\mathbf{e}_2 = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$$\n\n> **Watch out.** The images go in as columns, not rows, and $T(\\mathbf{e}_1)$ comes first.",
        "每个线性变换 $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ 都可以表示为乘以唯一的标准矩阵 $A = [T(\\mathbf{e}_1) \\mid T(\\mathbf{e}_2)]$，该矩阵的各列分别是标准基向量\n\n$$\\mathbf{e}_1 = \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix}, \\quad \\mathbf{e}_2 = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$$\n\n的像。\n\n> **注意。** 像要作为列放入，而不是作为行，并且 $T(\\mathbf{e}_1)$ 在前。",
      ),
      generate(rng) {
        const a = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
        const c = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
        const b = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
        const d = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);

        const Te1: Vec2 = [a, c];
        const Te2: Vec2 = [b, d];
        const A: Mat2 = [
          [a, b],
          [c, d],
        ];

        const w1: Mat2 = [
          [a, c],
          [b, d],
        ];
        const w2: Mat2 = [
          [b, a],
          [d, c],
        ];
        const w3: Mat2 = [
          [-a, -b],
          [-c, -d],
        ];
        const w4: Mat2 = [
          [d, b],
          [c, a],
        ];

        const rightLatex = mat2Latex(A);
        const e1Latex = vec2Latex(Te1);
        const e2Latex = vec2Latex(Te2);

        return oneOf(
          rng,
          t(
            `A linear transformation $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ satisfies $T\\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix} = ${e1Latex}$ and $T\\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix} = ${e2Latex}$. What is the standard matrix $A$ of $T$?`,
            `线性变换 $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ 满足 $T\\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix} = ${e1Latex}$ 和 $T\\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix} = ${e2Latex}$。$T$ 的标准矩阵 $A$ 是什么？`,
          ),
          t(`$${rightLatex}$`, `$${rightLatex}$`),
          [
            t(`$${mat2Latex(w1)}$`, `$${mat2Latex(w1)}$`),
            t(`$${mat2Latex(w2)}$`, `$${mat2Latex(w2)}$`),
            t(`$${mat2Latex(w3)}$`, `$${mat2Latex(w3)}$`),
            t(`$${mat2Latex(w4)}$`, `$${mat2Latex(w4)}$`),
          ],
          join(
            label(1, "Place the first image", "放入第一个像"),
            t(
              `Column $1$ of the standard matrix is $T(\\mathbf{e}_1) = (${a}, ${c})$.`,
              `标准矩阵的第 $1$ 列是 $T(\\mathbf{e}_1) = (${a}, ${c})$。`,
            ),
            para,
            label(2, "Place the second image", "放入第二个像"),
            t(`Column $2$ is $T(\\mathbf{e}_2) = (${b}, ${d})$. So`, `第 $2$ 列是 $T(\\mathbf{e}_2) = (${b}, ${d})$。所以`),
            shown(`A = [T(\\mathbf{e}_1) \\mid T(\\mathbf{e}_2)] = ${rightLatex}`),
            checked(
              t(
                `Multiply $A$ by the basis vectors. $A\\mathbf{e}_1$ has entries $${dot([a, b], [1, 0])}$ and $${dot([c, d], [1, 0])}$. This is $T(\\mathbf{e}_1)$. $A\\mathbf{e}_2$ has entries $${dot([a, b], [0, 1])}$ and $${dot([c, d], [0, 1])}$. This is $T(\\mathbf{e}_2)$.`,
                `用 $A$ 乘基向量。$A\\mathbf{e}_1$ 的元素是 $${dot([a, b], [1, 0])}$ 和 $${dot([c, d], [1, 0])}$。这正是 $T(\\mathbf{e}_1)$。$A\\mathbf{e}_2$ 的元素是 $${dot([a, b], [0, 1])}$ 和 $${dot([c, d], [0, 1])}$。这正是 $T(\\mathbf{e}_2)$。`,
              ),
            ),
          ),
          [
            t("This writes the images as rows. They go in as columns.", "这里把像写成了行。它们应该作为列。"),
            t(
              "This puts $T(\\mathbf{e}_2)$ first. Column $1$ is the image of $\\mathbf{e}_1$.",
              "这里把 $T(\\mathbf{e}_2)$ 放在前面。第 $1$ 列是 $\\mathbf{e}_1$ 的像。",
            ),
            t("Every sign is changed. The images are used as given.", "这里所有符号都变了。像应该按原样使用。"),
            t(
              "This swaps the diagonal entries, as for an inverse. The images go in unchanged.",
              "这里像求逆那样交换了对角元素。像应该原样放入。",
            ),
          ],
        );
      },
    },
    {
      id: "finding-standard-matrix-from-formula",
      title: t("Finding standard matrix from algebraic formulas", "由代数表达式求标准矩阵"),
      explanation: t(
        "The coefficients of each output formula fill one row of the matrix, so read them off in order of the variables. If a linear transformation is given by $T(x, y) = (ax + by, cx + dy)$, its standard matrix is\n\n$$A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$$\n\n> **Watch out.** Each formula fills a row, with the coefficient of $x$ first. Writing the coefficients down a column gives the transpose.",
        "每个输出公式的系数填成矩阵的一行，所以按变量的顺序把它们读出来。若线性变换的坐标公式为 $T(x, y) = (ax + by, cx + dy)$，则其标准矩阵为\n\n$$A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$$\n\n> **注意。** 每个公式填一行，$x$ 的系数在前。把系数竖着写成一列，得到的是转置。",
      ),
      generate(rng) {
        const a = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
        const b = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
        const c = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
        const d = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);

        const A: Mat2 = [
          [a, b],
          [c, d],
        ];
        const w1: Mat2 = [
          [a, c],
          [b, d],
        ];
        const w2: Mat2 = [
          [b, a],
          [d, c],
        ];
        const w3: Mat2 = [
          [a, -b],
          [-c, d],
        ];
        const w4: Mat2 = [
          [c, d],
          [a, b],
        ];

        const rightLatex = mat2Latex(A);

        return oneOf(
          rng,
          t(
            `Find the standard matrix of the linear transformation defined by $T\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ${poly([a, "x"], [b, "y"])} \\\\ ${poly([c, "x"], [d, "y"])} \\end{pmatrix}$.`,
            `求线性变换 $T\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ${poly([a, "x"], [b, "y"])} \\\\ ${poly([c, "x"], [d, "y"])} \\end{pmatrix}$ 的标准矩阵。`,
          ),
          t(`$${rightLatex}$`, `$${rightLatex}$`),
          [
            t(`$${mat2Latex(w1)}$`, `$${mat2Latex(w1)}$`),
            t(`$${mat2Latex(w2)}$`, `$${mat2Latex(w2)}$`),
            t(`$${mat2Latex(w3)}$`, `$${mat2Latex(w3)}$`),
            t(`$${mat2Latex(w4)}$`, `$${mat2Latex(w4)}$`),
          ],
          join(
            label(1, "Read the first formula", "读第一个公式"),
            t(
              `The first output is $${poly([a, "x"], [b, "y"])}$, so row $1$ is $(${a}, ${b})$.`,
              `第一个输出是 $${poly([a, "x"], [b, "y"])}$，所以第 $1$ 行是 $(${a}, ${b})$。`,
            ),
            para,
            label(2, "Read the second formula", "读第二个公式"),
            t(
              `The second output is $${poly([c, "x"], [d, "y"])}$, so row $2$ is $(${c}, ${d})$. So`,
              `第二个输出是 $${poly([c, "x"], [d, "y"])}$，所以第 $2$ 行是 $(${c}, ${d})$。所以`,
            ),
            shown(`A = ${rightLatex}`),
            checked(
              t(
                `Evaluate $T$ at the basis vectors. $T(1, 0) = (${a}, ${c})$, which is column $1$ of $A$. $T(0, 1) = (${b}, ${d})$, which is column $2$.`,
                `在基向量处求 $T$。$T(1, 0) = (${a}, ${c})$，正是 $A$ 的第 $1$ 列。$T(0, 1) = (${b}, ${d})$，正是第 $2$ 列。`,
              ),
            ),
          ),
          [
            t(
              "This writes the coefficients of each formula down a column. Each formula fills a row.",
              "这里把每个公式的系数竖着写成了一列。每个公式应该填一行。",
            ),
            t(
              "This puts the coefficient of $y$ first. The columns follow the order $x$, then $y$.",
              "这里把 $y$ 的系数放在前面。列的顺序是先 $x$ 后 $y$。",
            ),
            t("This changes two signs. The coefficients are copied unchanged.", "这里改变了两个符号。系数应该原样照抄。"),
            t("This puts the second formula in the first row.", "这里把第二个公式放到了第一行。"),
          ],
        );
      },
    },
  ],
};

/** linearTransformationsOfPointsAndLinesInThePlane covers transforming points and lines. */
export const linearTransformationsOfPointsAndLinesInThePlane: TopicDef = {
  id: "linear-transformations-of-points-and-lines-in-the-plane",
  title: t("Linear Transformations of Points and Lines in the Plane", "平面上线与点的线性变换"),
  summary: t(
    "Apply matrix transformations to points and find how lines in the plane are mapped.",
    "对点应用矩阵变换，并研究平面直线在线性变换下的像。",
  ),
  prerequisites: ["the-standard-matrix-of-a-linear-transformation"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.11", "CCSS.HSN.VM.C.12"],
  intro: t(
    "You can find the standard matrix of a linear transformation. Applying it to a point means multiplying the matrix by the point's column of coordinates. A line through the origin is made of all multiples of one direction vector, and linearity sends those to all multiples of the transformed direction. So the image of such a line is found from one vector.\n\nTake\n\n$$A = \\begin{pmatrix} 1 & -1 \\\\ 2 & 1 \\end{pmatrix}$$\n\nThe point $(3, 1)$ goes to $(1 \\cdot 3 - 1 \\cdot 1, 2 \\cdot 3 + 1 \\cdot 1) = (2, 7)$. The line $y = -3x$ has direction $(1, -3)$, which goes to $(1 + 3, 2 - 3) = (4, -1)$. So the image is the line $y = -\\frac{1}{4}x$.",
    "你会求线性变换的标准矩阵。把它作用在一个点上，就是用矩阵乘这个点的坐标列。过原点的直线由一个方向向量的所有倍数组成，线性把它们变成变换后方向的所有倍数。所以这种直线的像只需一个向量就能求出。\n\n取\n\n$$A = \\begin{pmatrix} 1 & -1 \\\\ 2 & 1 \\end{pmatrix}$$\n\n点 $(3, 1)$ 变到 $(1 \\cdot 3 - 1 \\cdot 1, 2 \\cdot 3 + 1 \\cdot 1) = (2, 7)$。直线 $y = -3x$ 的方向是 $(1, -3)$，它变到 $(1 + 3, 2 - 3) = (4, -1)$。所以像是直线 $y = -\\frac{1}{4}x$。",
  ),
  knowledgePoints: [
    {
      id: "transforming-points-in-the-plane",
      title: t("Transforming points under a linear transformation", "线性变换作用下的点变换"),
      explanation: t(
        "To find where a point goes, write it as a column vector and multiply it by the matrix; the product gives the coordinates of the image. A point $P(x, y)$ transforms to\n\n$$\\begin{pmatrix} x' \\\\ y' \\end{pmatrix} = A \\begin{pmatrix} x \\\\ y \\end{pmatrix}$$\n\n> **Watch out.** Row $1$ of the matrix gives the new $x$ and row $2$ the new $y$. Do not multiply the entries of the matrix by the coordinates one by one.",
        "要找一个点被变换到哪里，把它写成列向量再用矩阵去乘；乘积给出像点的坐标。点 $P(x, y)$ 变到\n\n$$\\begin{pmatrix} x' \\\\ y' \\end{pmatrix} = A \\begin{pmatrix} x \\\\ y \\end{pmatrix}$$\n\n> **注意。** 矩阵的第 $1$ 行给出新的 $x$，第 $2$ 行给出新的 $y$。不要把矩阵元素与坐标逐个对应相乘。",
      ),
      generate(rng) {
        const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const b = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const c = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const d = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const x = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const y = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);

        const xp = a * x + b * y;
        const yp = c * x + d * y;

        const w1: Vec2 = [yp, xp];
        const w2: Vec2 = [-xp, yp];
        const w3: Vec2 = [xp, -yp];
        const w4: Vec2 = [a * x - b * y, c * x - d * y];

        const ALatex = mat2Latex([
          [a, b],
          [c, d],
        ]);
        const multiply = t(
          `The new first coordinate comes from row $1$: $${dot([a, b], [x, y])}$. The new second coordinate comes from row $2$: $${dot([c, d], [x, y])}$.`,
          `新的第一个坐标来自第 $1$ 行：$${dot([a, b], [x, y])}$。新的第二个坐标来自第 $2$ 行：$${dot([c, d], [x, y])}$。`,
        );
        const check = checked(
          t(
            `Use the columns instead. The image is $${paren(x)}$ times column $1$ plus $${paren(y)}$ times column $2$: $${paren(x)} \\cdot (${a}, ${c}) + ${paren(y)} \\cdot (${b}, ${d}) = (${x * a}, ${x * c}) + (${y * b}, ${y * d}) = (${xp}, ${yp})$.`,
            `改用列来算。像是 $${paren(x)}$ 乘第 $1$ 列加 $${paren(y)}$ 乘第 $2$ 列：$${paren(x)} \\cdot (${a}, ${c}) + ${paren(y)} \\cdot (${b}, ${d}) = (${x * a}, ${x * c}) + (${y * b}, ${y * d}) = (${xp}, ${yp})$。`,
          ),
        );

        const isVector = rng.pick([true, false]);
        if (isVector) {
          return pointProblem({
            prompt: t(
              `Find the image vector $T(\\mathbf{v})$ of $\\mathbf{v} = \\begin{pmatrix} ${x} \\\\ ${y} \\end{pmatrix}$ under the linear transformation with standard matrix $A = ${ALatex}$.`,
              `求向量 $\\mathbf{v} = \\begin{pmatrix} ${x} \\\\ ${y} \\end{pmatrix}$ 在标准矩阵为 $A = ${ALatex}$ 的线性变换作用下的像向量 $T(\\mathbf{v})$。`,
            ),
            answer: [xp, yp],
            vector: true,
            solution: join(
              label(1, "Set up the product", "列出乘积"),
              t("The image is the matrix times the vector:", "像等于矩阵乘向量："),
              shown(`T(\\mathbf{v}) = A\\mathbf{v} = ${ALatex}\\begin{pmatrix} ${x} \\\\ ${y} \\end{pmatrix}`),
              para,
              label(2, "Multiply row by row", "逐行相乘"),
              multiply,
              t(` So $T(\\mathbf{v}) = ${vectorLatex([xp, yp])}$.`, `所以 $T(\\mathbf{v}) = ${vectorLatex([xp, yp])}$。`),
              check,
            ),
            wrong: [w1, w2, w3, w4],
          });
        }

        return pointProblem({
          prompt: t(
            `Find the coordinates of the image of point $P(${x}, ${y})$ under the linear transformation with standard matrix $A = ${ALatex}$.`,
            `求点 $P(${x}, ${y})$ 在标准矩阵为 $A = ${ALatex}$ 的线性变换作用下的像点坐标。`,
          ),
          answer: [xp, yp],
          vars: ["x", "y"],
          solution: join(
            label(1, "Set up the product", "列出乘积"),
            t("Write the point as a column and multiply it by the matrix:", "把点写成列向量，再用矩阵乘它："),
            shown(`A\\begin{pmatrix} ${x} \\\\ ${y} \\end{pmatrix} = ${ALatex}\\begin{pmatrix} ${x} \\\\ ${y} \\end{pmatrix}`),
            para,
            label(2, "Multiply row by row", "逐行相乘"),
            multiply,
            t(` So the image point is $(${xp}, ${yp})$.`, `所以像点是 $(${xp}, ${yp})$。`),
            check,
          ),
          wrong: [w1, w2, w3, w4],
        });
      },
    },
    {
      id: "transforming-lines-through-origin",
      title: t("Images of lines under linear transformations", "直线的线性变换与像方程"),
      explanation: t(
        "A line through the origin with direction vector $\\mathbf{v} = (1, m)$ transforms under matrix $A$ to a line through the origin directed along $A\\mathbf{v} = (u, v)$. If $u \\ne 0$, its equation is $y = \\frac{v}{u}x$.\n\n> **Watch out.** Transform a direction vector, not the slope. The new slope is $\\frac{v}{u}$, rise over run, and it is usually not $m$.",
        "过原点且方向向量为 $\\mathbf{v} = (1, m)$ 的直线 $y = mx$，在矩阵 $A$ 作用下的像仍为过原点的直线，其方向向量为 $A\\mathbf{v} = (u, v)$。若 $u \\ne 0$，其方程为 $y = \\frac{v}{u}x$。\n\n> **注意。** 要变换方向向量，而不是斜率。新的斜率是 $\\frac{v}{u}$，即纵向变化除以横向变化，通常不等于 $m$。",
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3, 4]);
        const d = rng.pick([1, 2, 3, 4]);
        const b = rng.pick([0, 1, 2]);
        const c = rng.pick([0, 1, 2]);
        const m = rng.pick([1, 2, 3, -1, -2]);

        const u = a + b * m;
        const v = c + d * m;
        if (u === 0 || v === 0) return this.generate(rng);

        const slopeQ = Q.of(v, u);
        const A: Mat2 = [
          [a, b],
          [c, d],
        ];
        const ALatex = mat2Latex(A);
        const rightEq = `y = ${poly([slopeQ, "x"])}`;
        const w1 = `y = ${poly([slopeQ.neg(), "x"])}`;
        const w2 = `y = ${poly([Q.of(u, v), "x"])}`;
        const w3 = `y = ${poly([m, "x"])}`;
        const w4 = `y = ${poly([slopeQ.add(Q.one), "x"])}`;

        return oneOf(
          rng,
          t(
            `Find the equation of the line that is the image of the line $y = ${poly([m, "x"])}$ under the linear transformation with standard matrix $A = ${ALatex}$.`,
            `求直线 $y = ${poly([m, "x"])}$ 在标准矩阵为 $A = ${ALatex}$ 的线性变换下的像方程。`,
          ),
          t(`$${rightEq}$`, `$${rightEq}$`),
          [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`), t(`$${w4}$`, `$${w4}$`)],
          join(
            label(1, "Take a direction vector", "取方向向量"),
            t(
              `The line $y = ${poly([m, "x"])}$ passes through the origin and through the point $(1, ${m})$. So the vector $(1, ${m})$ is a direction vector.`,
              `直线 $y = ${poly([m, "x"])}$ 过原点，也过点 $(1, ${m})$。所以向量 $(1, ${m})$ 是方向向量。`,
            ),
            para,
            label(2, "Transform it", "变换它"),
            t(
              `Row $1$ gives $${dot([a, b], [1, m])}$. Row $2$ gives $${dot([c, d], [1, m])}$. So the new direction is $(${u}, ${v})$.`,
              `第 $1$ 行得 $${dot([a, b], [1, m])}$。第 $2$ 行得 $${dot([c, d], [1, m])}$。所以新的方向是 $(${u}, ${v})$。`,
            ),
            para,
            label(3, "Write the line", "写出直线"),
            t(
              `The slope is the second component divided by the first, $${paren(v)} \\div ${paren(u)} = ${slopeQ.toLatex()}$. The origin stays fixed, so the image is the line $${rightEq}$.`,
              `斜率是第二个分量除以第一个分量，$${paren(v)} \\div ${paren(u)} = ${slopeQ.toLatex()}$。原点不动，所以像是直线 $${rightEq}$。`,
            ),
            checked(
              t(
                `Try another point of the original line, $(2, ${2 * m})$. Its image has coordinates $${dot([a, b], [2, 2 * m])}$ and $${dot([c, d], [2, 2 * m])}$. On the answer line, $x = ${2 * u}$ gives $y = ${slopeQ.toLatex()} \\cdot ${paren(2 * u)} = ${2 * v}$, so the image lies on it.`,
                `再取原直线上的点 $(2, ${2 * m})$。它的像的坐标是 $${dot([a, b], [2, 2 * m])}$ 和 $${dot([c, d], [2, 2 * m])}$。在答案直线上，$x = ${2 * u}$ 时 $y = ${slopeQ.toLatex()} \\cdot ${paren(2 * u)} = ${2 * v}$，所以像在这条直线上。`,
              ),
            ),
          ),
          [
            t("The sign of the slope is wrong.", "斜率的符号错了。"),
            t(
              "This divides the components the wrong way. The slope is the second component over the first.",
              "这里两个分量除反了。斜率是第二个分量除以第一个分量。",
            ),
            t("This keeps the original slope, but the matrix changes the direction.", "这里保留了原来的斜率，但矩阵改变了方向。"),
            t("This adds $1$ to the slope. Nothing in the transformation does that.", "这里把斜率加了 $1$。变换中没有这一步。"),
          ],
        );
      },
    },
  ],
};

/** linearTransformationsOfObjectsInThePlane covers transforming polygons and centroid preservation. */
export const linearTransformationsOfObjectsInThePlane: TopicDef = {
  id: "linear-transformations-of-objects-in-the-plane",
  title: t("Linear Transformations of Objects in the Plane", "平面几何图形的线性变换"),
  summary: t(
    "Transform geometric figures such as triangles and polygons by transforming their vertices.",
    "通过变换几何图形的顶点，研究三角形与多边形在平面线性变换下的像。",
  ),
  prerequisites: ["linear-transformations-of-points-and-lines-in-the-plane"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.12"],
  intro: t(
    "You can transform points and lines with a matrix. A linear transformation sends line segments to line segments, so a polygon goes to the polygon whose vertices are the images of its vertices. Only the corners need to be transformed. Averages are kept too, so the centroid of the image is the image of the centroid.\n\nUnder\n\n$$M = \\begin{pmatrix} 2 & 1 \\\\ 0 & 1 \\end{pmatrix}$$\n\nthe unit square with corners $(0, 0)$, $(1, 0)$, $(1, 1)$ and $(0, 1)$ goes to the parallelogram with corners $(0, 0)$, $(2, 0)$, $(3, 1)$ and $(1, 1)$. The triangle with vertices $(0, 0)$, $(3, 0)$ and $(0, 3)$ has centroid $(1, 1)$. Its image has vertices $(0, 0)$, $(6, 0)$ and $(3, 3)$, with centroid $(3, 1)$, and indeed $M$ sends $(1, 1)$ to $(3, 1)$.",
    "你会用矩阵变换点和直线。线性变换把线段变成线段，所以多边形变成以原顶点的像为顶点的多边形。只需变换各个角。平均也保持不变，所以像的重心就是重心的像。\n\n在\n\n$$M = \\begin{pmatrix} 2 & 1 \\\\ 0 & 1 \\end{pmatrix}$$\n\n作用下，顶点为 $(0, 0)$，$(1, 0)$，$(1, 1)$，$(0, 1)$ 的单位正方形变成顶点为 $(0, 0)$，$(2, 0)$，$(3, 1)$，$(1, 1)$ 的平行四边形。顶点为 $(0, 0)$，$(3, 0)$，$(0, 3)$ 的三角形重心是 $(1, 1)$。它的像的顶点是 $(0, 0)$，$(6, 0)$，$(3, 3)$，重心是 $(3, 1)$，而 $M$ 确实把 $(1, 1)$ 变到 $(3, 1)$。",
  ),
  knowledgePoints: [
    {
      id: "transforming-vertices-of-polygons",
      figure: precalculusDrawings2["linear-transformations-of-objects-in-the-plane#transforming-vertices-of-polygons"],
      title: t("Transforming polygon vertices", "变换多边形的各个顶点"),
      explanation: t(
        "Because linear transformations map line segments to line segments, the image of a polygon is the polygon whose vertices are the transformed original vertices.\n\n> **Watch out.** Transform each vertex by multiplying the matrix by it. Adding matrix entries to the coordinates is not a transformation by the matrix.",
        "由于线性变换将线段映射为线段，因此多边形在线性变换下的像，就是以变换后的原顶点为新顶点的多边形。\n\n> **注意。** 每个顶点都要用矩阵去乘。把矩阵元素加到坐标上，并不是用这个矩阵作变换。",
      ),
      generate(rng) {
        const A: Mat2 = [
          [rng.pick([-2, -1, 1, 2, 3]), rng.pick([-2, -1, 0, 1, 2])],
          [rng.pick([-2, -1, 0, 1, 2]), rng.pick([-2, -1, 1, 2, 3])],
        ];
        const vA: Vec2 = [rng.pick([1, 2, 3]), rng.pick([0, 1, 2])];
        const vB: Vec2 = [rng.pick([3, 4, 5]), rng.pick([1, 2, 3])];
        const vC: Vec2 = [rng.pick([1, 2]), rng.pick([4, 5, 6])];

        const targetVertex = rng.pick(["A", "B", "C"]);
        const orig = targetVertex === "A" ? vA : targetVertex === "B" ? vB : vC;
        const xp = A[0][0] * orig[0] + A[0][1] * orig[1];
        const yp = A[1][0] * orig[0] + A[1][1] * orig[1];

        const w1: Vec2 = [yp, xp];
        const w2: Vec2 = [-xp, yp];
        const w3: Vec2 = [xp + 1, yp - 1];
        const w4: Vec2 = [orig[0] + 1, orig[1] + 1];

        const MLatex = mat2Latex(A);
        const [x, y] = orig;

        return pointProblem({
          prompt: t(
            `A triangle has vertices $A(${vA[0]}, ${vA[1]})$, $B(${vB[0]}, ${vB[1]})$, and $C(${vC[0]}, ${vC[1]})$. Under the linear transformation with standard matrix $M = ${MLatex}$, what are the coordinates of the image vertex $${targetVertex}'$?`,
            `三角形的三个顶点为 $A(${vA[0]}, ${vA[1]})$、$B(${vB[0]}, ${vB[1]})$ 和 $C(${vC[0]}, ${vC[1]})$。在标准矩阵为 $M = ${MLatex}$ 的线性变换作用下，像顶点 $${targetVertex}'$ 的坐标是多少？`,
          ),
          answer: [xp, yp],
          vars: ["x", "y"],
          solution: join(
            label(1, "Pick out the vertex", "找出顶点"),
            t(
              `Only $${targetVertex}(${x}, ${y})$ is needed. Its image is $M$ times its column of coordinates.`,
              `只需要 $${targetVertex}(${x}, ${y})$。它的像是 $M$ 乘它的坐标列。`,
            ),
            para,
            label(2, "Multiply row by row", "逐行相乘"),
            t(
              `Row $1$ gives $${dot(A[0], orig)}$. Row $2$ gives $${dot(A[1], orig)}$. So $${targetVertex}' = (${xp}, ${yp})$.`,
              `第 $1$ 行得 $${dot(A[0], orig)}$。第 $2$ 行得 $${dot(A[1], orig)}$。所以 $${targetVertex}' = (${xp}, ${yp})$。`,
            ),
            checked(
              t(
                `Use the columns instead. $${paren(x)} \\cdot (${A[0][0]}, ${A[1][0]}) + ${paren(y)} \\cdot (${A[0][1]}, ${A[1][1]}) = (${x * A[0][0]}, ${x * A[1][0]}) + (${y * A[0][1]}, ${y * A[1][1]}) = (${xp}, ${yp})$.`,
                `改用列来算。$${paren(x)} \\cdot (${A[0][0]}, ${A[1][0]}) + ${paren(y)} \\cdot (${A[0][1]}, ${A[1][1]}) = (${x * A[0][0]}, ${x * A[1][0]}) + (${y * A[0][1]}, ${y * A[1][1]}) = (${xp}, ${yp})$。`,
              ),
            ),
          ),
          wrong: [w1, w2, w3, w4],
        });
      },
    },
    {
      id: "centroid-and-midpoints-of-transformed-shapes",
      title: t("Centroid preservation under linear transformations", "线性变换下重心的保真性"),
      explanation: t(
        "Linear transformations preserve barycentric combinations and centroids: the centroid of the transformed figure $T(S)$ is the image of the centroid of $S$, i.e., $G' = T(G)$.\n\n> **Watch out.** This works because the centroid is an average of the vertices and a linear map respects averages. You do not need the vertices, only $G$.",
        "线性变换保持重心坐标与形心：变换后图形 $T(S)$ 的重心，就是原图形 $S$ 重心的像，即 $G' = T(G)$。\n\n> **注意。** 这是因为重心是顶点的平均，而线性映射保持平均。不需要知道顶点，只要 $G$。",
      ),
      generate(rng) {
        const gx = rng.pick([-3, -2, -1, 1, 2, 3]);
        const gy = rng.pick([-3, -2, -1, 1, 2, 3]);
        const M: Mat2 = [
          [rng.pick([1, 2, -1, -2]), rng.pick([0, 1, -1])],
          [rng.pick([0, 1, -1]), rng.pick([1, 2, -1, -2])],
        ];

        const gpx = M[0][0] * gx + M[0][1] * gy;
        const gpy = M[1][0] * gx + M[1][1] * gy;

        const w1: Vec2 = [gpy, gpx];
        const w2: Vec2 = [-gpx, gpy];
        const w3: Vec2 = [gpx + 1, gpy - 1];
        const w4: Vec2 = [gx, gy];

        const MLatex = mat2Latex(M);
        const vertices: Vec2[] = [
          [gx + 1, gy + 1],
          [gx - 2, gy + 1],
          [gx + 1, gy - 2],
        ];
        const images = vertices.map((p): Vec2 => [M[0][0] * p[0] + M[0][1] * p[1], M[1][0] * p[0] + M[1][1] * p[1]]);
        const sx = images.reduce((s, p) => s + p[0], 0);
        const sy = images.reduce((s, p) => s + p[1], 0);
        const list = (ps: readonly Vec2[]) => ps.map((p) => `(${p[0]}, ${p[1]})`).join(", ");

        return pointProblem({
          prompt: t(
            `A triangle has centroid $G(${gx}, ${gy})$. What is the centroid $G'$ of the image triangle under the linear transformation with matrix $M = ${MLatex}$?`,
            `某三角形的重心为 $G(${gx}, ${gy})$。在矩阵为 $M = ${MLatex}$ 的线性变换作用下，像三角形的重心 $G'$ 的坐标是多少？`,
          ),
          answer: [gpx, gpy],
          vars: ["x", "y"],
          solution: join(
            label(1, "Send the centroid along", "把重心一起变换"),
            t(
              "The centroid is the average of the vertices, and a linear map respects averages. So $G' = MG$.",
              "重心是顶点的平均，线性映射保持平均。所以 $G' = MG$。",
            ),
            para,
            label(2, "Multiply", "相乘"),
            t(
              `Row $1$ gives $${dot(M[0], [gx, gy])}$. Row $2$ gives $${dot(M[1], [gx, gy])}$. So $G' = (${gpx}, ${gpy})$.`,
              `第 $1$ 行得 $${dot(M[0], [gx, gy])}$。第 $2$ 行得 $${dot(M[1], [gx, gy])}$。所以 $G' = (${gpx}, ${gpy})$。`,
            ),
            checked(
              t(
                `Try one triangle with this centroid, with vertices $${list(vertices)}$. Their images are $${list(images)}$. The average of the images is $(\\frac{${sx}}{3}, \\frac{${sy}}{3}) = (${gpx}, ${gpy})$.`,
                `取一个以 $G$ 为重心的三角形，顶点为 $${list(vertices)}$。它们的像是 $${list(images)}$。像的平均是 $(\\frac{${sx}}{3}, \\frac{${sy}}{3}) = (${gpx}, ${gpy})$。`,
              ),
            ),
          ),
          wrong: [w1, w2, w3, w4],
        });
      },
    },
  ],
};

/** dilationsAndReflectionsAsLinearTransformations covers dilations and reflections in the plane. */
export const dilationsAndReflectionsAsLinearTransformations: TopicDef = {
  id: "dilations-and-reflections-as-linear-transformations",
  title: t("Dilations and Reflections as Linear Transformations", "伸缩与反射线性变换"),
  summary: t(
    "Represent uniform dilations and reflections across the coordinate axes and y = x as matrix transformations.",
    "用矩阵表示平面的均匀伸缩变换以及关于坐标轴与 y = x 的反射变换。",
  ),
  prerequisites: ["the-standard-matrix-of-a-linear-transformation"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.12"],
  intro: t(
    "You can build the standard matrix of a linear transformation from the images of $\\mathbf{e}_1$ and $\\mathbf{e}_2$. Dilations and reflections are the first transformations to describe this way. A dilation by $k$ about the origin multiplies both coordinates by $k$. A reflection flips the plane across a line through the origin. Their matrices let you move whole figures with one multiplication.\n\nA dilation by $3$ sends $(2, -1)$ to $(3 \\cdot 2, 3 \\cdot (-1)) = (6, -3)$. The reflection across the $y$-axis sends $\\mathbf{e}_1 = (1, 0)$ to $(-1, 0)$ and leaves $\\mathbf{e}_2 = (0, 1)$ where it is. Those images are the columns of its matrix:\n\n$$\\begin{pmatrix} -1 & 0 \\\\ 0 & 1 \\end{pmatrix}$$\n\nIt sends $(4, 5)$ to $(-1 \\cdot 4 + 0 \\cdot 5, \\; 0 \\cdot 4 + 1 \\cdot 5) = (-4, 5)$.",
    "你会用 $\\mathbf{e}_1$ 和 $\\mathbf{e}_2$ 的像写出线性变换的标准矩阵。位似伸缩和反射是最先这样描述的变换。以原点为中心、比例为 $k$ 的位似把两个坐标都乘 $k$。反射把平面沿一条过原点的直线翻折过去。有了它们的矩阵，一次乘法就能移动整个图形。\n\n比例为 $3$ 的位似把 $(2, -1)$ 变到 $(3 \\cdot 2, 3 \\cdot (-1)) = (6, -3)$。关于 $y$ 轴的反射把 $\\mathbf{e}_1 = (1, 0)$ 变到 $(-1, 0)$，而 $\\mathbf{e}_2 = (0, 1)$ 不动。这两个像就是它的矩阵的列：\n\n$$\\begin{pmatrix} -1 & 0 \\\\ 0 & 1 \\end{pmatrix}$$\n\n它把 $(4, 5)$ 变到 $(-1 \\cdot 4 + 0 \\cdot 5, \\; 0 \\cdot 4 + 1 \\cdot 5) = (-4, 5)$。",
  ),
  knowledgePoints: [
    {
      id: "dilation-matrices-in-the-plane",
      figure: precalculusDrawings2["dilations-and-reflections-as-linear-transformations#dilation-matrices-in-the-plane"],
      title: t("Dilation matrices in the plane", "平面中的位似伸缩矩阵"),
      explanation: t(
        "A dilation multiplies every distance from the origin by the same factor, so its matrix is that factor times the identity matrix. A uniform dilation with scale factor $k$ centered at the origin maps $(x, y) \\mapsto (kx, ky)$. Its standard matrix is $D_k = \\begin{pmatrix} k & 0 \\\\ 0 & k \\end{pmatrix} = k I$.\n\n> **Watch out.** Both diagonal entries are $k$ and the other two are $0$. A negative $k$ also turns every point a half turn about the origin, so both coordinates change sign.",
        "位似变换把到原点的每个距离都乘以同一个因子，所以它的矩阵是这个因子乘以单位矩阵。以原点为中心的缩放比例为 $k$ 的均匀位似伸缩变换将 $(x, y) \\mapsto (kx, ky)$。其标准矩阵为 $D_k = \\begin{pmatrix} k & 0 \\\\ 0 & k \\end{pmatrix} = k I$。\n\n> **注意。** 两个对角元都是 $k$，另外两个是 $0$。$k$ 为负时，每个点还要绕原点转半圈，两个坐标都变号。",
      ),
      generate(rng) {
        const askPoint = rng.pick([true, false]);
        const k = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5, 6]);

        if (askPoint) {
          const x = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
          const y = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
          const xp = k * x;
          const yp = k * y;

          const w1: Vec2 = [yp, xp];
          const w2: Vec2 = [-xp, yp];
          const w3: Vec2 = [xp, -yp];
          const w4: Vec2 = [x + k, y + k];

          return pointProblem({
            prompt: t(
              `Find the coordinates of the image of point $P(${x}, ${y})$ under a uniform dilation centered at the origin with scale factor $k = ${k}$.`,
              `求点 $P(${x}, ${y})$ 在以原点为中心、缩放比例为 $k = ${k}$ 的位似伸缩变换下的像点坐标。`,
            ),
            answer: [xp, yp],
            vars: ["x", "y"],
            solution: join(
              label(1, "Write the matrix", "写出矩阵"),
              t(
                `A dilation by $k = ${k}$ has matrix $kI$. It multiplies each coordinate by $${k}$.`,
                `比例为 $k = ${k}$ 的位似的矩阵是 $kI$。它把每个坐标都乘 $${k}$。`,
              ),
              para,
              label(2, "Multiply", "相乘"),
              t(
                `The new $x$ is $${k} \\cdot ${paren(x)} = ${xp}$. The new $y$ is $${k} \\cdot ${paren(y)} = ${yp}$. So $P' = (${xp}, ${yp})$.`,
                `新的 $x$ 是 $${k} \\cdot ${paren(x)} = ${xp}$。新的 $y$ 是 $${k} \\cdot ${paren(y)} = ${yp}$。所以 $P' = (${xp}, ${yp})$。`,
              ),
              checked(
                t(
                  `Divide back. $${xp} \\div ${paren(x)} = ${k}$ and $${yp} \\div ${paren(y)} = ${k}$. Both coordinates were scaled by the same factor $${k}$.`,
                  `反过来除。$${xp} \\div ${paren(x)} = ${k}$，$${yp} \\div ${paren(y)} = ${k}$。两个坐标都乘了同一个因子 $${k}$。`,
                ),
              ),
            ),
            wrong: [w1, w2, w3, w4],
          });
        }

        const D: Mat2 = [
          [k, 0],
          [0, k],
        ];
        const w1: Mat2 = [
          [k, 0],
          [0, 1],
        ];
        const w2: Mat2 = [
          [1, 0],
          [0, k],
        ];
        const w3: Mat2 = [
          [0, k],
          [k, 0],
        ];
        const w4: Mat2 = [
          [k, k],
          [0, 0],
        ];

        return oneOf(
          rng,
          t(
            `What is the standard matrix of a uniform dilation centered at the origin with scale factor $k = ${k}$?`,
            `以原点为中心、缩放比例为 $k = ${k}$ 的均匀伸缩变换的标准矩阵是什么？`,
          ),
          t(`$${mat2Latex(D)}$`, `$${mat2Latex(D)}$`),
          [
            t(`$${mat2Latex(w1)}$`, `$${mat2Latex(w1)}$`),
            t(`$${mat2Latex(w2)}$`, `$${mat2Latex(w2)}$`),
            t(`$${mat2Latex(w3)}$`, `$${mat2Latex(w3)}$`),
            t(`$${mat2Latex(w4)}$`, `$${mat2Latex(w4)}$`),
          ],
          join(
            label(1, "Find the images of the basis vectors", "求基向量的像"),
            t(
              `The dilation multiplies every vector by $${k}$. It sends $\\mathbf{e}_1 = (1, 0)$ to $(${k}, 0)$ and $\\mathbf{e}_2 = (0, 1)$ to $(0, ${k})$.`,
              `位似把每个向量都乘 $${k}$。它把 $\\mathbf{e}_1 = (1, 0)$ 变到 $(${k}, 0)$，把 $\\mathbf{e}_2 = (0, 1)$ 变到 $(0, ${k})$。`,
            ),
            para,
            label(2, "Use them as columns", "把它们作为列"),
            t(
              `The image of $\\mathbf{e}_1$ is the first column and the image of $\\mathbf{e}_2$ is the second. So the matrix is $${mat2Latex(D)}$.`,
              `$\\mathbf{e}_1$ 的像是第一列，$\\mathbf{e}_2$ 的像是第二列。所以矩阵是 $${mat2Latex(D)}$。`,
            ),
            checked(
              t(
                `Apply it to $(1, 1)$. Row $1$ gives $${dot(D[0], [1, 1])}$. Row $2$ gives $${dot(D[1], [1, 1])}$. The point $(1, 1)$ goes to $(${k}, ${k})$, which is $${k}$ times $(1, 1)$, as a dilation by $${k}$ requires.`,
                `用它作用于 $(1, 1)$。第 $1$ 行得 $${dot(D[0], [1, 1])}$。第 $2$ 行得 $${dot(D[1], [1, 1])}$。点 $(1, 1)$ 变到 $(${k}, ${k})$，正是 $(1, 1)$ 的 $${k}$ 倍，符合比例为 $${k}$ 的位似。`,
              ),
            ),
          ),
          [
            t(
              "This stretches only the $x$-coordinate. It leaves $y$ unchanged, so it is not a uniform dilation.",
              "它只伸缩 $x$ 坐标，$y$ 不变，所以不是均匀位似。",
            ),
            t(
              "This stretches only the $y$-coordinate. It leaves $x$ unchanged, so it is not a uniform dilation.",
              "它只伸缩 $y$ 坐标，$x$ 不变，所以不是均匀位似。",
            ),
            t(
              "The $k$ entries are off the diagonal, so this also swaps the two coordinates.",
              "$k$ 放在了副对角线上，所以它还会交换两个坐标。",
            ),
            t("Its second row is zero, so it sends every point onto the $x$-axis.", "它的第二行全是零，会把每个点都压到 $x$ 轴上。"),
          ],
        );
      },
    },
    {
      id: "reflection-matrices-in-the-plane",
      figure: precalculusDrawings2["dilations-and-reflections-as-linear-transformations#reflection-matrices-in-the-plane"],
      title: t("Reflection matrices in the plane", "平面中的反射变换矩阵"),
      explanation: t(
        "Standard reflection matrices:\n- Across the $x$-axis: $\\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$\n- Across the $y$-axis: $\\begin{pmatrix} -1 & 0 \\\\ 0 & 1 \\end{pmatrix}$\n- Across the line $y = x$: $\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$\n- Across the line $y = -x$: $\\begin{pmatrix} 0 & -1 \\\\ -1 & 0 \\end{pmatrix}$\n\n> **Watch out.** Across $y = x$ the coordinates swap, and across $y = -x$ they swap and both change sign. Reflecting twice across the same line gives back the starting point.",
        "常见的平面反射变换矩阵：\n- 关于 $x$ 轴反射：$\\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$\n- 关于 $y$ 轴反射：$\\begin{pmatrix} -1 & 0 \\\\ 0 & 1 \\end{pmatrix}$\n- 关于直线 $y = x$ 反射：$\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$\n- 关于直线 $y = -x$ 反射：$\\begin{pmatrix} 0 & -1 \\\\ -1 & 0 \\end{pmatrix}$\n\n> **注意。** 关于 $y = x$ 反射时两个坐标交换；关于 $y = -x$ 反射时两个坐标交换并且都变号。关于同一条直线反射两次，点回到原处。",
      ),
      generate(rng) {
        const types: { lineEn: string; lineZh: string; mat: Mat2 }[] = [
          {
            lineEn: "the $x$-axis",
            lineZh: "$x$ 轴",
            mat: [
              [1, 0],
              [0, -1],
            ],
          },
          {
            lineEn: "the $y$-axis",
            lineZh: "$y$ 轴",
            mat: [
              [-1, 0],
              [0, 1],
            ],
          },
          {
            lineEn: "the line $y = x$",
            lineZh: "直线 $y = x$",
            mat: [
              [0, 1],
              [1, 0],
            ],
          },
          {
            lineEn: "the line $y = -x$",
            lineZh: "直线 $y = -x$",
            mat: [
              [0, -1],
              [-1, 0],
            ],
          },
        ];
        const item = rng.pick(types);
        const x = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
        const y = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].filter((v) => Math.abs(v) !== Math.abs(x)));

        const xp = item.mat[0][0] * x + item.mat[0][1] * y;
        const yp = item.mat[1][0] * x + item.mat[1][1] * y;

        const w1: Vec2 = [-xp, yp];
        const w2: Vec2 = [xp, -yp];
        const w3: Vec2 = [-xp, -yp];
        const w4: Vec2 = [yp, xp];
        const m = item.mat;

        return pointProblem({
          prompt: t(
            `Find the coordinates of the image of point $P(${x}, ${y})$ after reflection across ${item.lineEn}.`,
            `求点 $P(${x}, ${y})$ 关于${item.lineZh}反射后的像点坐标。`,
          ),
          answer: [xp, yp],
          vars: ["x", "y"],
          solution: join(
            label(1, "Write the matrix", "写出矩阵"),
            t(
              `The reflection across ${item.lineEn} sends $\\mathbf{e}_1$ to $(${m[0][0]}, ${m[1][0]})$ and $\\mathbf{e}_2$ to $(${m[0][1]}, ${m[1][1]})$. These images are the columns, so $R = ${mat2Latex(m)}$.`,
              `关于${item.lineZh}的反射把 $\\mathbf{e}_1$ 变到 $(${m[0][0]}, ${m[1][0]})$，把 $\\mathbf{e}_2$ 变到 $(${m[0][1]}, ${m[1][1]})$。这两个像就是列，所以 $R = ${mat2Latex(m)}$。`,
            ),
            para,
            label(2, "Multiply", "相乘"),
            t(
              `Row $1$ gives $${dot(m[0], [x, y])}$. Row $2$ gives $${dot(m[1], [x, y])}$. So $P' = (${xp}, ${yp})$.`,
              `第 $1$ 行得 $${dot(m[0], [x, y])}$。第 $2$ 行得 $${dot(m[1], [x, y])}$。所以 $P' = (${xp}, ${yp})$。`,
            ),
            checked(
              t(
                `Reflecting twice across the same line gives back the starting point. Reflect $P'$ again. Row $1$ gives $${dot(m[0], [xp, yp])}$. Row $2$ gives $${dot(m[1], [xp, yp])}$. That is $P(${x}, ${y})$ again.`,
                `关于同一条直线反射两次，点回到原处。把 $P'$ 再反射一次。第 $1$ 行得 $${dot(m[0], [xp, yp])}$。第 $2$ 行得 $${dot(m[1], [xp, yp])}$。又回到了 $P(${x}, ${y})$。`,
              ),
            ),
          ),
          wrong: [w1, w2, w3, w4],
        });
      },
    },
  ],
};

/** shearAndStretchAsLinearTransformations covers shear and directional axis stretches. */
export const shearAndStretchAsLinearTransformations: TopicDef = {
  id: "shear-and-stretch-as-linear-transformations",
  title: t("Shear and Stretch as Linear Transformations", "切变与拉伸变换"),
  summary: t(
    "Analyze horizontal and vertical shear transformations and directional axis stretches.",
    "分析水平切变、垂直切变以及沿坐标轴的拉伸与压缩变换。",
  ),
  prerequisites: ["dilations-and-reflections-as-linear-transformations"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.12"],
  intro: t(
    "You can write the matrices of dilations and reflections. A shear slides each point parallel to an axis by an amount proportional to its distance from that axis, the way a deck of cards slants when you push its top. A stretch scales the two axes by different factors. Both are linear, so each has a $2 \\times 2$ matrix read off from the images of $\\mathbf{e}_1$ and $\\mathbf{e}_2$.\n\nThe horizontal shear with factor $2$ has matrix\n\n$$\\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix}$$\n\nIt sends $(1, 3)$ to $(1 + 2 \\cdot 3, 3) = (7, 3)$. Points on the $x$-axis have $y = 0$, so they stay fixed. A stretch by $3$ along the $x$-axis and $2$ along the $y$-axis sends $(2, -1)$ to $(3 \\cdot 2, 2 \\cdot (-1)) = (6, -2)$.",
    "你会写位似和反射的矩阵。切变让每个点沿某条坐标轴的方向滑动，滑动量与它到这条轴的距离成正比，就像推一叠扑克牌的上面时整叠牌会斜过去。拉伸则把两条轴按不同的因子缩放。它们都是线性的，所以都有一个 $2 \\times 2$ 矩阵，可以从 $\\mathbf{e}_1$ 和 $\\mathbf{e}_2$ 的像读出来。\n\n因子为 $2$ 的水平切变的矩阵是\n\n$$\\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix}$$\n\n它把 $(1, 3)$ 变到 $(1 + 2 \\cdot 3, 3) = (7, 3)$。$x$ 轴上的点 $y = 0$，所以不动。沿 $x$ 轴拉伸 $3$ 倍、沿 $y$ 轴拉伸 $2$ 倍的变换把 $(2, -1)$ 变到 $(3 \\cdot 2, 2 \\cdot (-1)) = (6, -2)$。",
  ),
  knowledgePoints: [
    {
      id: "shear-transformations-in-the-plane",
      title: t("Horizontal and vertical shears", "水平与垂直切变变换"),
      explanation: t(
        "A horizontal shear with factor $k$ preserves $y$-coordinates and maps $(x, y) \\mapsto (x + ky, y)$, represented by $\\begin{pmatrix} 1 & k \\\\ 0 & 1 \\end{pmatrix}$. A vertical shear with factor $k$ preserves $x$-coordinates and maps $(x, y) \\mapsto (x, kx + y)$, represented by $\\begin{pmatrix} 1 & 0 \\\\ k & 1 \\end{pmatrix}$.\n\n> **Watch out.** In a horizontal shear the shift in $x$ is $k$ times $y$, not $k$ times $x$. The coordinate that stays fixed decides how far the point moves.",
        "水平切变（切变因子为 $k$）保持 $y$ 坐标不变并将 $(x, y) \\mapsto (x + ky, y)$，矩阵为 $\\begin{pmatrix} 1 & k \\\\ 0 & 1 \\end{pmatrix}$。垂直切变（切变因子为 $k$）保持 $x$ 坐标不变并将 $(x, y) \\mapsto (x, kx + y)$，矩阵为 $\\begin{pmatrix} 1 & 0 \\\\ k & 1 \\end{pmatrix}$。\n\n> **注意。** 水平切变中 $x$ 的移动量是 $k$ 乘 $y$，不是 $k$ 乘 $x$。不变的那个坐标决定点移动多远。",
      ),
      generate(rng) {
        const isHorizontal = rng.pick([true, false]);
        const k = rng.pick([-4, -3, -2, 2, 3, 4]);
        const x = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const y = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);

        const xp = isHorizontal ? x + k * y : x;
        const yp = isHorizontal ? y : k * x + y;
        const dirEn = isHorizontal ? "horizontal" : "vertical";
        const dirZh = isHorizontal ? "水平" : "垂直";
        const mat: Mat2 = isHorizontal
          ? [
              [1, k],
              [0, 1],
            ]
          : [
              [1, 0],
              [k, 1],
            ];

        const w1: Vec2 = [yp, xp];
        const w2: Vec2 = isHorizontal ? [x - k * y, y] : [x, -k * x + y];
        const w3: Vec2 = isHorizontal ? [x, k * x + y] : [x + k * y, y];
        const w4: Vec2 = [x + k, y + k];
        const check = isHorizontal
          ? t(
              `A horizontal shear keeps the height, so $y' = ${y}$. The point slides sideways by $k$ times its height, $${k} \\cdot ${paren(y)} = ${k * y}$. So $x' = ${x} + ${paren(k * y)} = ${xp}$.`,
              `水平切变保持高度不变，所以 $y' = ${y}$。点横向滑动的量是 $k$ 乘它的高度，即 $${k} \\cdot ${paren(y)} = ${k * y}$。所以 $x' = ${x} + ${paren(k * y)} = ${xp}$。`,
            )
          : t(
              `A vertical shear keeps the $x$-coordinate, so $x' = ${x}$. The point slides up or down by $k$ times its $x$-coordinate, $${k} \\cdot ${paren(x)} = ${k * x}$. So $y' = ${y} + ${paren(k * x)} = ${yp}$.`,
              `垂直切变保持 $x$ 坐标不变，所以 $x' = ${x}$。点上下滑动的量是 $k$ 乘它的 $x$ 坐标，即 $${k} \\cdot ${paren(x)} = ${k * x}$。所以 $y' = ${y} + ${paren(k * x)} = ${yp}$。`,
            );

        return pointProblem({
          prompt: t(
            `Find the coordinates of point $P(${x}, ${y})$ under a ${dirEn} shear with shear factor $k = ${k}$.`,
            `求点 $P(${x}, ${y})$ 在切变因子为 $k = ${k}$ 的${dirZh}切变变换下的像点坐标。`,
          ),
          answer: [xp, yp],
          vars: ["x", "y"],
          solution: join(
            label(1, "Write the matrix", "写出矩阵"),
            t(
              `The ${dirEn} shear with factor $k = ${k}$ has matrix $S = ${mat2Latex(mat)}$.`,
              `切变因子为 $k = ${k}$ 的${dirZh}切变的矩阵是 $S = ${mat2Latex(mat)}$。`,
            ),
            para,
            label(2, "Multiply", "相乘"),
            t(
              `Row $1$ gives $${dot(mat[0], [x, y])}$. Row $2$ gives $${dot(mat[1], [x, y])}$. So $P' = (${xp}, ${yp})$.`,
              `第 $1$ 行得 $${dot(mat[0], [x, y])}$。第 $2$ 行得 $${dot(mat[1], [x, y])}$。所以 $P' = (${xp}, ${yp})$。`,
            ),
            checked(check),
          ),
          wrong: [w1, w2, w3, w4],
        });
      },
    },
    {
      id: "axis-stretches-and-compressions",
      title: t("Axis stretches and compressions", "沿坐标轴的拉伸与压缩"),
      explanation: t(
        "A transformation that scales along the $x$-axis by factor $s_x$ and along the $y$-axis by factor $s_y$ is represented by the diagonal matrix $\\begin{pmatrix} s_x & 0 \\\\ 0 & s_y \\end{pmatrix}$.\n\n> **Watch out.** The factor for the $x$-axis goes in the top left and the factor for the $y$-axis in the bottom right. Putting them off the diagonal would also swap the coordinates.",
        "沿 $x$ 轴缩放 $s_x$ 倍且沿 $y$ 轴缩放 $s_y$ 倍的平面变换，其标准矩阵为对角矩阵 $\\begin{pmatrix} s_x & 0 \\\\ 0 & s_y \\end{pmatrix}$。\n\n> **注意。** $x$ 轴的因子放在左上角，$y$ 轴的因子放在右下角。放到副对角线上会把两个坐标也交换了。",
      ),
      generate(rng) {
        const sx = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
        const sy = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);

        const mat: Mat2 = [
          [sx, 0],
          [0, sy],
        ];
        const w1: Mat2 = [
          [sy, 0],
          [0, sx],
        ];
        const w2: Mat2 = [
          [sx, sy],
          [0, 0],
        ];
        const w3: Mat2 = [
          [0, sx],
          [sy, 0],
        ];
        const w4: Mat2 = [
          [1, sx],
          [0, sy],
        ];

        return oneOf(
          rng,
          t(
            `What is the standard matrix representing a stretch by factor $s_x = ${sx}$ along the $x$-axis and by factor $s_y = ${sy}$ along the $y$-axis?`,
            `沿 $x$ 轴拉伸 $s_x = ${sx}$ 倍，且沿 $y$ 轴拉伸 $s_y = ${sy}$ 倍的线性变换的标准矩阵是什么？`,
          ),
          t(`$${mat2Latex(mat)}$`, `$${mat2Latex(mat)}$`),
          [
            t(`$${mat2Latex(w1)}$`, `$${mat2Latex(w1)}$`),
            t(`$${mat2Latex(w2)}$`, `$${mat2Latex(w2)}$`),
            t(`$${mat2Latex(w3)}$`, `$${mat2Latex(w3)}$`),
            t(`$${mat2Latex(w4)}$`, `$${mat2Latex(w4)}$`),
          ],
          join(
            label(1, "Find the images of the basis vectors", "求基向量的像"),
            t(
              `The stretch multiplies $x$ by $${sx}$ and $y$ by $${sy}$. It sends $\\mathbf{e}_1 = (1, 0)$ to $(${sx}, 0)$ and $\\mathbf{e}_2 = (0, 1)$ to $(0, ${sy})$.`,
              `这个拉伸把 $x$ 乘 $${sx}$，把 $y$ 乘 $${sy}$。它把 $\\mathbf{e}_1 = (1, 0)$ 变到 $(${sx}, 0)$，把 $\\mathbf{e}_2 = (0, 1)$ 变到 $(0, ${sy})$。`,
            ),
            para,
            label(2, "Use them as columns", "把它们作为列"),
            t(
              `The image of $\\mathbf{e}_1$ is the first column and the image of $\\mathbf{e}_2$ is the second. So the matrix is $${mat2Latex(mat)}$.`,
              `$\\mathbf{e}_1$ 的像是第一列，$\\mathbf{e}_2$ 的像是第二列。所以矩阵是 $${mat2Latex(mat)}$。`,
            ),
            checked(
              t(
                `Apply it to $(1, 1)$. Row $1$ gives $${dot(mat[0], [1, 1])}$. Row $2$ gives $${dot(mat[1], [1, 1])}$. The point $(1, 1)$ goes to $(${sx}, ${sy})$, so $x$ was scaled by $${sx}$ and $y$ by $${sy}$.`,
                `用它作用于 $(1, 1)$。第 $1$ 行得 $${dot(mat[0], [1, 1])}$。第 $2$ 行得 $${dot(mat[1], [1, 1])}$。点 $(1, 1)$ 变到 $(${sx}, ${sy})$，所以 $x$ 乘了 $${sx}$，$y$ 乘了 $${sy}$。`,
              ),
            ),
          ),
          [
            t(
              "The two factors are swapped. This stretches the $x$-axis by the factor meant for the $y$-axis.",
              "两个因子放反了。它用 $y$ 轴的因子去拉伸 $x$ 轴。",
            ),
            t(
              "Both images are written in one row. The second row is zero, so every point lands on the $x$-axis.",
              "两个像写进了同一行。第二行是零，每个点都会落到 $x$ 轴上。",
            ),
            t(
              "The factors are on the anti-diagonal, so this also swaps the two coordinates.",
              "因子放在了副对角线上，所以它还会交换两个坐标。",
            ),
            t(
              "The top left entry is $1$, so $x$ is not stretched, and the extra entry shears the plane.",
              "左上角是 $1$，$x$ 没有被拉伸，多出来的元素还会产生切变。",
            ),
          ],
        );
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE 6.25: LINEAR TRANSFORMATIONS (PART 2: TOPICS 12 TO 17)
// ════════════════════════════════════════════════════════════════════════════

/** rightAngleRotationsAsLinearTransformations covers rotations by 90, 180, and 270 degrees. */
export const rightAngleRotationsAsLinearTransformations: TopicDef = {
  id: "right-angle-rotations-as-linear-transformations",
  title: t("Right-Angle Rotations as Linear Transformations", "直角旋转变换"),
  summary: t(
    "Represent rotations by multiples of 90 degrees about the origin using 2x2 matrices.",
    "用二阶矩阵表示绕原点旋转 90°、180° 与 270° 的直角旋转变换。",
  ),
  prerequisites: ["the-standard-matrix-of-a-linear-transformation"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.12"],
  intro: t(
    "You can build a standard matrix from the images of $\\mathbf{e}_1$ and $\\mathbf{e}_2$. A rotation about the origin is linear, and for quarter turns those images are easy to see, because each unit vector lands on another axis. This gives the matrices of the rotations by $90^\\circ$, $180^\\circ$ and $270^\\circ$, and simple rules for rotating a point.\n\nA counterclockwise quarter turn sends $\\mathbf{e}_1 = (1, 0)$ up to $(0, 1)$ and sends $\\mathbf{e}_2 = (0, 1)$ to $(-1, 0)$. Those images are the columns:\n\n$$R = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$$\n\nIt sends $(3, 1)$ to $(0 \\cdot 3 + (-1) \\cdot 1, \\; 1 \\cdot 3 + 0 \\cdot 1) = (-1, 3)$. In words, $(x, y)$ goes to $(-y, x)$.",
    "你会用 $\\mathbf{e}_1$ 和 $\\mathbf{e}_2$ 的像写出标准矩阵。绕原点的旋转是线性的，而转四分之一圈时这两个像很容易看出来，因为每个单位向量都落到另一条坐标轴上。由此得到旋转 $90^\\circ$，$180^\\circ$ 和 $270^\\circ$ 的矩阵，以及旋转一个点的简单规则。\n\n逆时针转四分之一圈把 $\\mathbf{e}_1 = (1, 0)$ 转到 $(0, 1)$，把 $\\mathbf{e}_2 = (0, 1)$ 转到 $(-1, 0)$。这两个像就是列：\n\n$$R = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$$\n\n它把 $(3, 1)$ 变到 $(0 \\cdot 3 + (-1) \\cdot 1, \\; 1 \\cdot 3 + 0 \\cdot 1) = (-1, 3)$。也就是说，$(x, y)$ 变到 $(-y, x)$。",
  ),
  knowledgePoints: [
    {
      id: "matrices-for-right-angle-rotations",
      figure: precalculusDrawings4["right-angle-rotations-as-linear-transformations#matrices-for-right-angle-rotations"],
      title: t("Matrices for right-angle rotations", "直角旋转的标准矩阵"),
      explanation: t(
        "The columns of a rotation matrix are the images of the two unit vectors, which are easy to find for right angles. Standard counterclockwise rotation matrices about the origin:\n- By $90^\\circ$: $R_{90^\\circ} = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$\n- By $180^\\circ$: $R_{180^\\circ} = \\begin{pmatrix} -1 & 0 \\\\ 0 & -1 \\end{pmatrix} = -I$\n- By $270^\\circ$: $R_{270^\\circ} = \\begin{pmatrix} 0 & 1 \\\\ -1 & 0 \\end{pmatrix}$\n\n> **Watch out.** Adding or subtracting $360^\\circ$ gives the same rotation, and a negative angle turns clockwise. Bring the angle into $0^\\circ$ to $360^\\circ$ first, turning radians into degrees if needed.",
        "旋转矩阵的列是两个单位向量的像，对于直角旋转，这些像很容易求出。绕原点逆时针直角旋转的标准矩阵：\n- 逆时针旋转 $90^\\circ$：$R_{90^\\circ} = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$\n- 逆时针旋转 $180^\\circ$：$R_{180^\\circ} = \\begin{pmatrix} -1 & 0 \\\\ 0 & -1 \\end{pmatrix} = -I$\n- 逆时针旋转 $270^\\circ$：$R_{270^\\circ} = \\begin{pmatrix} 0 & 1 \\\\ -1 & 0 \\end{pmatrix}$\n\n> **注意。** 角度加上或减去 $360^\\circ$ 得到的是同一个旋转，负角表示顺时针旋转。先把角化到 $0^\\circ$ 到 $360^\\circ$ 之间，弧度要先化成度。",
      ),
      generate(rng) {
        const pool: { angle: number; rad: string; mat: Mat2 }[] = [
          {
            angle: 90,
            rad: "\\frac{\\pi}{2}",
            mat: [
              [0, -1],
              [1, 0],
            ],
          },
          {
            angle: 180,
            rad: "\\pi",
            mat: [
              [-1, 0],
              [0, -1],
            ],
          },
          {
            angle: 270,
            rad: "\\frac{3\\pi}{2}",
            mat: [
              [0, 1],
              [-1, 0],
            ],
          },
          {
            angle: -90,
            rad: "-\\frac{\\pi}{2}",
            mat: [
              [0, 1],
              [-1, 0],
            ],
          },
          {
            angle: -180,
            rad: "-\\pi",
            mat: [
              [-1, 0],
              [0, -1],
            ],
          },
          {
            angle: -270,
            rad: "-\\frac{3\\pi}{2}",
            mat: [
              [0, -1],
              [1, 0],
            ],
          },
          {
            angle: 360,
            rad: "2\\pi",
            mat: [
              [1, 0],
              [0, 1],
            ],
          },
          {
            angle: 450,
            rad: "\\frac{5\\pi}{2}",
            mat: [
              [0, -1],
              [1, 0],
            ],
          },
          {
            angle: 540,
            rad: "3\\pi",
            mat: [
              [-1, 0],
              [0, -1],
            ],
          },
          {
            angle: 630,
            rad: "\\frac{7\\pi}{2}",
            mat: [
              [0, 1],
              [-1, 0],
            ],
          },
          {
            angle: 720,
            rad: "4\\pi",
            mat: [
              [1, 0],
              [0, 1],
            ],
          },
          {
            angle: -360,
            rad: "-2\\pi",
            mat: [
              [1, 0],
              [0, 1],
            ],
          },
          {
            angle: -450,
            rad: "-\\frac{5\\pi}{2}",
            mat: [
              [0, 1],
              [-1, 0],
            ],
          },
          {
            angle: -540,
            rad: "-3\\pi",
            mat: [
              [-1, 0],
              [0, -1],
            ],
          },
        ];
        const item = rng.pick(pool);
        const useRad = rng.pick([true, false]);
        const angleStr = useRad ? `$${item.rad}$ radians` : `$${item.angle}^\\circ$`;
        const angleStrZh = useRad ? `$${item.rad}$ 弧度` : `$${item.angle}^\\circ$`;
        const phrasing = rng.pick(["standard", "linear_map"]);

        const w1: Mat2 = [
          [0, 1],
          [1, 0],
        ];
        const w2: Mat2 = [
          [item.mat[1][1], item.mat[1][0]],
          [item.mat[0][1], item.mat[0][0]],
        ];
        const w3: Mat2 = [
          [1, 0],
          [0, -1],
        ];
        const w4: Mat2 = [
          [-item.mat[0][0], -item.mat[0][1]],
          [-item.mat[1][0], -item.mat[1][1]],
        ];

        const rightLatex = mat2Latex(item.mat);
        const m = item.mat;
        const r = ((item.angle % 360) + 360) % 360;

        const promptEn =
          phrasing === "standard"
            ? `Which matrix represents a rotation by ${angleStr} about the origin?`
            : `Find the standard matrix of the linear transformation representing a rotation by ${angleStr} centered at the origin.`;
        const promptZh =
          phrasing === "standard"
            ? `下列哪个矩阵表示绕原点旋转 ${angleStrZh} 的线性变换？`
            : `求以原点为中心旋转 ${angleStrZh} 的线性变换的标准矩阵。`;
        const inDegrees = useRad
          ? t(`In degrees, $${item.rad}$ radians is $${item.angle}^\\circ$. `, `$${item.rad}$ 弧度化成度是 $${item.angle}^\\circ$。`)
          : t("", "");
        const reduced =
          r === item.angle
            ? t(
                `The angle $${r}^\\circ$ is already between $0^\\circ$ and $360^\\circ$.`,
                `角 $${r}^\\circ$ 已经在 $0^\\circ$ 到 $360^\\circ$ 之间。`,
              )
            : t(
                `Whole turns of $360^\\circ$ do not change a rotation, so $${item.angle}^\\circ$ acts as $${r}^\\circ$.`,
                `整圈的 $360^\\circ$ 不改变旋转，所以 $${item.angle}^\\circ$ 的作用和 $${r}^\\circ$ 一样。`,
              );

        return oneOf(
          rng,
          t(promptEn, promptZh),
          t(`$${rightLatex}$`, `$${rightLatex}$`),
          [
            t(`$${mat2Latex(w1)}$`, `$${mat2Latex(w1)}$`),
            t(`$${mat2Latex(w2)}$`, `$${mat2Latex(w2)}$`),
            t(`$${mat2Latex(w3)}$`, `$${mat2Latex(w3)}$`),
            t(`$${mat2Latex(w4)}$`, `$${mat2Latex(w4)}$`),
          ],
          join(
            label(1, "Reduce the angle", "化简角度"),
            inDegrees,
            reduced,
            para,
            label(2, "Turn the basis vectors", "旋转基向量"),
            t(
              `Turning $\\mathbf{e}_1 = (1, 0)$ by $${r}^\\circ$ gives $(${m[0][0]}, ${m[1][0]})$. Turning $\\mathbf{e}_2 = (0, 1)$ by $${r}^\\circ$ gives $(${m[0][1]}, ${m[1][1]})$.`,
              `把 $\\mathbf{e}_1 = (1, 0)$ 转 $${r}^\\circ$ 得 $(${m[0][0]}, ${m[1][0]})$。把 $\\mathbf{e}_2 = (0, 1)$ 转 $${r}^\\circ$ 得 $(${m[0][1]}, ${m[1][1]})$。`,
            ),
            para,
            label(3, "Use them as columns", "把它们作为列"),
            t(`The images are the columns. So the matrix is $${rightLatex}$.`, `这两个像就是列。所以矩阵是 $${rightLatex}$。`),
            checked(
              t(
                `In a rotation, column $2$ is column $1$ turned a further $90^\\circ$, and a quarter turn sends $(p, q)$ to $(-q, p)$. Column $1$ is $(${m[0][0]}, ${m[1][0]})$, which goes to $(${-m[1][0]}, ${m[0][0]})$, the second column. Every rotation has determinant $1$. Here $${m[0][0]} \\cdot ${paren(m[1][1])} - ${paren(m[0][1])} \\cdot ${paren(m[1][0])} = 1$.`,
                `旋转矩阵中，第 $2$ 列是第 $1$ 列再转 $90^\\circ$，而转四分之一圈把 $(p, q)$ 变到 $(-q, p)$。第 $1$ 列是 $(${m[0][0]}, ${m[1][0]})$，它变到 $(${-m[1][0]}, ${m[0][0]})$，正是第二列。每个旋转的行列式都是 $1$。这里 $${m[0][0]} \\cdot ${paren(m[1][1])} - ${paren(m[0][1])} \\cdot ${paren(m[1][0])} = 1$。`,
              ),
            ),
          ),
          [
            t(
              "This is the reflection across $y = x$. Its determinant is $-1$, so it is not a rotation.",
              "这是关于 $y = x$ 的反射。它的行列式是 $-1$，所以不是旋转。",
            ),
            t(
              "This is the transpose of the answer, which turns by the same angle the other way.",
              "这是答案的转置，它朝相反方向转同样的角度。",
            ),
            t(
              "This is the reflection across the $x$-axis. Its determinant is $-1$, so it is not a rotation.",
              "这是关于 $x$ 轴的反射。它的行列式是 $-1$，所以不是旋转。",
            ),
            t(
              "Every sign of the answer is changed. That adds a half turn, so it rotates $180^\\circ$ too far.",
              "答案的每个符号都变了。这多转了半圈，也就是多转了 $180^\\circ$。",
            ),
          ],
        );
      },
    },
    {
      id: "applying-right-angle-rotations-to-vectors",
      figure: precalculusDrawings2["right-angle-rotations-as-linear-transformations#applying-right-angle-rotations-to-vectors"],
      title: t("Rotating points and vectors by right angles", "直角旋转作用于向量与点"),
      explanation: t(
        "For right angle rotations, the coordinates simply swap places and change signs, so you can rotate a point without writing out the matrix product. Applying right-angle counterclockwise rotations to point $(x, y)$:\n- $90^\\circ$: $(x, y) \\mapsto (-y, x)$\n- $180^\\circ$: $(x, y) \\mapsto (-x, -y)$\n- $270^\\circ$: $(x, y) \\mapsto (y, -x)$\n\n> **Watch out.** Do not mix up $90^\\circ$ and $270^\\circ$. A counterclockwise quarter turn gives $(-y, x)$, and three quarter turns give $(y, -x)$.",
        "对于直角旋转，坐标只是交换位置并改变符号，所以不必写出矩阵乘积就能旋转一个点。对点 $(x, y)$ 进行绕原点的逆时针直角旋转：\n- 旋转 $90^\\circ$：$(x, y) \\mapsto (-y, x)$\n- 旋转 $180^\\circ$：$(x, y) \\mapsto (-x, -y)$\n- 旋转 $270^\\circ$：$(x, y) \\mapsto (y, -x)$\n\n> **注意。** 不要把 $90^\\circ$ 和 $270^\\circ$ 弄混。逆时针转四分之一圈得 $(-y, x)$，转四分之三圈得 $(y, -x)$。",
      ),
      generate(rng) {
        const x = rng.pick([-8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8]);
        const y = rng.pick([-8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8]);
        const angles = [90, 180, 270];
        const angle = rng.pick(angles);

        let xp = 0;
        let yp = 0;
        if (angle === 90) {
          xp = -y;
          yp = x;
        } else if (angle === 180) {
          xp = -x;
          yp = -y;
        } else {
          xp = y;
          yp = -x;
        }

        const w1: Vec2 = [yp, xp];
        const w2: Vec2 = [-xp, yp];
        const w3: Vec2 = [xp, -yp];
        const w4: Vec2 = [-xp, -yp];

        const R: Mat2 =
          angle === 90
            ? [
                [0, -1],
                [1, 0],
              ]
            : angle === 180
              ? [
                  [-1, 0],
                  [0, -1],
                ]
              : [
                  [0, 1],
                  [-1, 0],
                ];
        const rule = angle === 90 ? "(-y, x)" : angle === 180 ? "(-x, -y)" : "(y, -x)";
        const filled = angle === 90 ? `(-${paren(y)}, ${x})` : angle === 180 ? `(-${paren(x)}, -${paren(y)})` : `(${y}, -${paren(x)})`;
        const work = (answer: string, answerZh: string) =>
          join(
            label(1, "Write the matrix", "写出矩阵"),
            t(
              `A counterclockwise rotation by $${angle}^\\circ$ sends $\\mathbf{e}_1$ to $(${R[0][0]}, ${R[1][0]})$ and $\\mathbf{e}_2$ to $(${R[0][1]}, ${R[1][1]})$. So its matrix is $R = ${mat2Latex(R)}$.`,
              `逆时针旋转 $${angle}^\\circ$ 把 $\\mathbf{e}_1$ 变到 $(${R[0][0]}, ${R[1][0]})$，把 $\\mathbf{e}_2$ 变到 $(${R[0][1]}, ${R[1][1]})$。所以它的矩阵是 $R = ${mat2Latex(R)}$。`,
            ),
            para,
            label(2, "Multiply", "相乘"),
            t(
              `Row $1$ gives $${dot(R[0], [x, y])}$. Row $2$ gives $${dot(R[1], [x, y])}$. ${answer}`,
              `第 $1$ 行得 $${dot(R[0], [x, y])}$。第 $2$ 行得 $${dot(R[1], [x, y])}$。${answerZh}`,
            ),
            checked(
              t(
                `Use the rule for $${angle}^\\circ$, $(x, y) \\mapsto ${rule}$. With $x = ${x}$ and $y = ${y}$ it gives $${filled} = (${xp}, ${yp})$.`,
                `用 $${angle}^\\circ$ 的规则 $(x, y) \\mapsto ${rule}$。代入 $x = ${x}$，$y = ${y}$ 得 $${filled} = (${xp}, ${yp})$。`,
              ),
            ),
          );

        const isVector = rng.pick([true, false]);
        if (isVector) {
          return pointProblem({
            prompt: t(
              `Find the image vector $T(\\mathbf{v})$ of $\\mathbf{v} = \\begin{pmatrix} ${x} \\\\ ${y} \\end{pmatrix}$ after a counterclockwise rotation of $${angle}^\\circ$ about the origin.`,
              `求向量 $\\mathbf{v} = \\begin{pmatrix} ${x} \\\\ ${y} \\end{pmatrix}$ 绕原点逆时针旋转 $${angle}^\\circ$ 后的像向量 $T(\\mathbf{v})$。`,
            ),
            answer: [xp, yp],
            vector: true,
            solution: work(`So $T(\\mathbf{v}) = ${vectorLatex([xp, yp])}$.`, `所以 $T(\\mathbf{v}) = ${vectorLatex([xp, yp])}$。`),
            wrong: [w1, w2, w3, w4],
          });
        }

        return pointProblem({
          prompt: t(
            `Find the coordinates of the image of point $P(${x}, ${y})$ after a counterclockwise rotation of $${angle}^\\circ$ about the origin.`,
            `求点 $P(${x}, ${y})$ 绕原点逆时针旋转 $${angle}^\\circ$ 后的像点坐标。`,
          ),
          answer: [xp, yp],
          vars: ["x", "y"],
          solution: work(`So $P' = (${xp}, ${yp})$.`, `所以 $P' = (${xp}, ${yp})$。`),
          wrong: [w1, w2, w3, w4],
        });
      },
    },
  ],
};

/** rotationsAsLinearTransformations covers general rotation matrices and arbitrary angles. */
export const rotationsAsLinearTransformations: TopicDef = {
  id: "rotations-as-linear-transformations",
  title: t("Rotations as Linear Transformations", "任意角度的平面旋转矩阵"),
  summary: t(
    "Write the general rotation matrix $R_\\theta$ and use it to rotate points and vectors.",
    "写出一般的旋转矩阵 $R_\\theta$，并用它旋转点和向量。",
  ),
  prerequisites: ["right-angle-rotations-as-linear-transformations"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.12"],
  intro: t(
    "You can write the matrices of quarter turns from the images of $\\mathbf{e}_1$ and $\\mathbf{e}_2$. The same idea works for any angle $\\theta$. Turning $\\mathbf{e}_1 = (1, 0)$ by $\\theta$ lands on the unit circle at $(\\cos\\theta, \\sin\\theta)$. Turning $\\mathbf{e}_2 = (0, 1)$ lands a further quarter turn on, at $(-\\sin\\theta, \\cos\\theta)$. Those are the columns of the rotation matrix:\n\n$$R_\\theta = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}$$\n\nFor $\\theta = 30^\\circ$ the entries are $\\cos 30^\\circ = \\frac{\\sqrt{3}}{2}$ and $\\sin 30^\\circ = \\frac{1}{2}$. The point $(2, 0)$ goes to $(2 \\cdot \\frac{\\sqrt{3}}{2}, \\; 2 \\cdot \\frac{1}{2}) = (\\sqrt{3}, 1)$. It is still $2$ from the origin, because $3 + 1 = 4 = 2^2$.",
    "你会用 $\\mathbf{e}_1$ 和 $\\mathbf{e}_2$ 的像写出转四分之一圈的矩阵。同样的方法对任意角 $\\theta$ 都适用。把 $\\mathbf{e}_1 = (1, 0)$ 转 $\\theta$，落在单位圆上的 $(\\cos\\theta, \\sin\\theta)$。把 $\\mathbf{e}_2 = (0, 1)$ 转 $\\theta$，落在再往前四分之一圈的 $(-\\sin\\theta, \\cos\\theta)$。它们就是旋转矩阵的列：\n\n$$R_\\theta = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}$$\n\n当 $\\theta = 30^\\circ$ 时，$\\cos 30^\\circ = \\frac{\\sqrt{3}}{2}$，$\\sin 30^\\circ = \\frac{1}{2}$。点 $(2, 0)$ 变到 $(2 \\cdot \\frac{\\sqrt{3}}{2}, \\; 2 \\cdot \\frac{1}{2}) = (\\sqrt{3}, 1)$。它到原点的距离仍是 $2$，因为 $3 + 1 = 4 = 2^2$。",
  ),
  knowledgePoints: [
    {
      id: "general-rotation-matrix-formula",
      figure: precalculusDrawings4["rotations-as-linear-transformations#general-rotation-matrix-formula"],
      title: t("General rotation matrix formula", "平面旋转矩阵的一般公式"),
      explanation: t(
        "The first column is where the horizontal unit vector lands after rotating, and the second column is where the vertical unit vector lands. A counterclockwise rotation by angle $\\theta$ about the origin is represented by the matrix $R_\\theta = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}$.\n\n> **Watch out.** The minus sign belongs to the top right entry, $-\\sin\\theta$. Putting it in the bottom left instead gives the rotation by $\\theta$ clockwise.",
        "第一列是水平单位向量旋转后的位置，第二列是竖直单位向量旋转后的位置。绕原点逆时针旋转角度 $\\theta$ 的平面旋转矩阵为 $R_\\theta = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}$。\n\n> **注意。** 负号属于右上角的 $-\\sin\\theta$。把它放到左下角，得到的是顺时针旋转 $\\theta$。",
      ),
      generate(rng) {
        const pool: { deg: number; rad: string; cosStr: string; sinStr: string }[] = [
          { deg: 30, rad: "\\frac{\\pi}{6}", cosStr: "\\frac{\\sqrt{3}}{2}", sinStr: "\\frac{1}{2}" },
          { deg: 45, rad: "\\frac{\\pi}{4}", cosStr: "\\frac{\\sqrt{2}}{2}", sinStr: "\\frac{\\sqrt{2}}{2}" },
          { deg: 60, rad: "\\frac{\\pi}{3}", cosStr: "\\frac{1}{2}", sinStr: "\\frac{\\sqrt{3}}{2}" },
          { deg: 120, rad: "\\frac{2\\pi}{3}", cosStr: "-\\frac{1}{2}", sinStr: "\\frac{\\sqrt{3}}{2}" },
          { deg: 135, rad: "\\frac{3\\pi}{4}", cosStr: "-\\frac{\\sqrt{2}}{2}", sinStr: "\\frac{\\sqrt{2}}{2}" },
          { deg: 150, rad: "\\frac{5\\pi}{6}", cosStr: "-\\frac{\\sqrt{3}}{2}", sinStr: "\\frac{1}{2}" },
          { deg: 210, rad: "\\frac{7\\pi}{6}", cosStr: "-\\frac{\\sqrt{3}}{2}", sinStr: "-\\frac{1}{2}" },
          { deg: 225, rad: "\\frac{5\\pi}{4}", cosStr: "-\\frac{\\sqrt{2}}{2}", sinStr: "-\\frac{\\sqrt{2}}{2}" },
          { deg: 240, rad: "\\frac{4\\pi}{3}", cosStr: "-\\frac{1}{2}", sinStr: "-\\frac{\\sqrt{3}}{2}" },
          { deg: 300, rad: "\\frac{5\\pi}{3}", cosStr: "\\frac{1}{2}", sinStr: "-\\frac{\\sqrt{3}}{2}" },
          { deg: 315, rad: "\\frac{7\\pi}{4}", cosStr: "\\frac{\\sqrt{2}}{2}", sinStr: "-\\frac{\\sqrt{2}}{2}" },
          { deg: 330, rad: "\\frac{11\\pi}{6}", cosStr: "\\frac{\\sqrt{3}}{2}", sinStr: "-\\frac{1}{2}" },
          { deg: -30, rad: "-\\frac{\\pi}{6}", cosStr: "\\frac{\\sqrt{3}}{2}", sinStr: "-\\frac{1}{2}" },
          { deg: -45, rad: "-\\frac{\\pi}{4}", cosStr: "\\frac{\\sqrt{2}}{2}", sinStr: "-\\frac{\\sqrt{2}}{2}" },
          { deg: -60, rad: "-\\frac{\\pi}{3}", cosStr: "\\frac{1}{2}", sinStr: "-\\frac{\\sqrt{3}}{2}" },
          { deg: -120, rad: "-\\frac{2\\pi}{3}", cosStr: "-\\frac{1}{2}", sinStr: "-\\frac{\\sqrt{3}}{2}" },
          { deg: -135, rad: "-\\frac{3\\pi}{4}", cosStr: "-\\frac{\\sqrt{2}}{2}", sinStr: "-\\frac{\\sqrt{2}}{2}" },
          { deg: -150, rad: "-\\frac{5\\pi}{6}", cosStr: "-\\frac{\\sqrt{3}}{2}", sinStr: "-\\frac{1}{2}" },
        ];
        const item = rng.pick(pool);
        const useRad = rng.pick([true, false]);
        const angleStr = useRad ? `$${item.rad}$ radians` : `$${item.deg}^\\circ$`;
        const angleStrZh = useRad ? `$${item.rad}$ 弧度` : `$${item.deg}^\\circ$`;

        const cosVal = item.cosStr;
        const sinVal = item.sinStr;
        const negSinVal = sinVal.startsWith("-") ? sinVal.slice(1) : `-${sinVal}`;
        const negCosVal = cosVal.startsWith("-") ? cosVal.slice(1) : `-${cosVal}`;

        const rightLatex = `\\begin{pmatrix} ${cosVal} & ${negSinVal} \\\\ ${sinVal} & ${cosVal} \\end{pmatrix}`;
        const w1 = `\\begin{pmatrix} ${cosVal} & ${sinVal} \\\\ ${negSinVal} & ${cosVal} \\end{pmatrix}`;
        const w2 = `\\begin{pmatrix} ${sinVal} & ${cosVal} \\\\ ${cosVal} & ${sinVal} \\end{pmatrix}`;
        const w3 = `\\begin{pmatrix} ${cosVal} & ${negSinVal} \\\\ ${negSinVal} & ${cosVal} \\end{pmatrix}`;
        const w4 = `\\begin{pmatrix} ${sinVal} & ${negCosVal} \\\\ ${cosVal} & ${sinVal} \\end{pmatrix}`;

        /** squareOf gives the square of an exact cosine or sine value, written as a fraction. */
        const squareOf = (v: string) => (v.includes("sqrt{3}") ? "\\frac{3}{4}" : v.includes("sqrt{2}") ? "\\frac{1}{2}" : "\\frac{1}{4}");
        const r = ((item.deg % 360) + 360) % 360;
        const quadrant = r < 90 ? 1 : r < 180 ? 2 : r < 270 ? 3 : 4;
        const signs = [
          ["positive", "positive", "正", "正"],
          ["negative", "positive", "负", "正"],
          ["negative", "negative", "负", "负"],
          ["positive", "negative", "正", "负"],
        ][quadrant - 1]!;
        const inDegrees = useRad
          ? t(`In degrees, $${item.rad}$ radians is $${item.deg}^\\circ$. `, `$${item.rad}$ 弧度化成度是 $${item.deg}^\\circ$。`)
          : t("", "");

        return oneOf(
          rng,
          t(
            `What is the exact standard matrix for a counterclockwise rotation by ${angleStr} about the origin?`,
            `求绕原点逆时针旋转 ${angleStrZh} 的精确标准矩阵。`,
          ),
          t(`$${rightLatex}$`, `$${rightLatex}$`),
          [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`), t(`$${w4}$`, `$${w4}$`)],
          join(
            label(1, "Find the cosine and sine", "求余弦和正弦"),
            inDegrees,
            t(
              `On the unit circle, $\\cos(${item.deg}^\\circ) = ${cosVal}$ and $\\sin(${item.deg}^\\circ) = ${sinVal}$.`,
              `由单位圆，$\\cos(${item.deg}^\\circ) = ${cosVal}$，$\\sin(${item.deg}^\\circ) = ${sinVal}$。`,
            ),
            para,
            label(2, "Substitute into the rotation matrix", "代入旋转矩阵"),
            t(
              `The first column of $R_\\theta$ is $(\\cos\\theta, \\sin\\theta)$ and the second is $(-\\sin\\theta, \\cos\\theta)$, so the top right entry is $${negSinVal}$. So the matrix is $${rightLatex}$.`,
              `$R_\\theta$ 的第一列是 $(\\cos\\theta, \\sin\\theta)$，第二列是 $(-\\sin\\theta, \\cos\\theta)$，所以右上角是 $${negSinVal}$。所以矩阵是 $${rightLatex}$。`,
            ),
            checked(
              t(
                `The first column is where $\\mathbf{e}_1$ lands, so it must be a point of the unit circle. Its squares add to $${squareOf(cosVal)} + ${squareOf(sinVal)} = 1$. The angle $${item.deg}^\\circ$ points into quadrant ${["I", "II", "III", "IV"][quadrant - 1]}, where $x$ is ${signs[0]} and $y$ is ${signs[1]}, and the first column has those signs.`,
                `第一列是 $\\mathbf{e}_1$ 落到的位置，所以必须是单位圆上的点。它的平方和是 $${squareOf(cosVal)} + ${squareOf(sinVal)} = 1$。角 $${item.deg}^\\circ$ 指向第${["一", "二", "三", "四"][quadrant - 1]}象限，那里 $x$ 为${signs[2]}，$y$ 为${signs[3]}，第一列的符号正是这样。`,
              ),
            ),
          ),
          [
            t(
              "This is the transpose of $R_\\theta$, with the minus sign in the bottom left. It rotates by the same angle clockwise.",
              "这是 $R_\\theta$ 的转置，负号跑到了左下角。它是顺时针旋转同样的角度。",
            ),
            t(
              "Cosine and sine are swapped, and the minus sign of $-\\sin\\theta$ is dropped.",
              "余弦和正弦放反了，而且 $-\\sin\\theta$ 的负号丢了。",
            ),
            t(
              "The bottom left entry should be $\\sin\\theta$, not $-\\sin\\theta$. This matrix is not a rotation.",
              "左下角应该是 $\\sin\\theta$，不是 $-\\sin\\theta$。这个矩阵不是旋转。",
            ),
            t(
              "Sine is used where cosine belongs. This is the rotation by $90^\\circ - \\theta$.",
              "在该用余弦的地方用了正弦。这是旋转 $90^\\circ - \\theta$ 的矩阵。",
            ),
          ],
        );
      },
    },
    {
      id: "rotating-points-and-vectors-by-arbitrary-angles",
      title: t("Rotating points and vectors by special angles", "特殊角度下的点与向量旋转"),
      figure: remainingDrawings8["rotations-as-linear-transformations#rotating-points-and-vectors-by-arbitrary-angles"],
      explanation: t(
        "Substitute the exact cosine and sine of the angle into the rotation matrix, then multiply it by the column vector of the point. To rotate a point $P(x, y)$ by $\\theta$, compute $R_\\theta \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} x\\cos\\theta - y\\sin\\theta \\\\ x\\sin\\theta + y\\cos\\theta \\end{pmatrix}$.\n\n> **Watch out.** A rotation keeps the distance from the origin. If your image is not as far from the origin as $P$, a cosine or a sine was misread.",
        "把角的余弦和正弦的精确值代入旋转矩阵，再乘以该点的列向量。旋转点 $P(x, y)$ 角度 $\\theta$ 时，计算矩阵乘法 $R_\\theta \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} x\\cos\\theta - y\\sin\\theta \\\\ x\\sin\\theta + y\\cos\\theta \\end{pmatrix}$。\n\n> **注意。** 旋转不改变到原点的距离。如果像到原点的距离和 $P$ 不同，说明余弦或正弦用错了。",
      ),
      generate(rng) {
        const pool: { deg: number; pt: [number, number]; imgLatex: string; w1: string; w2: string; w3: string; w4: string }[] = [
          {
            deg: 60,
            pt: [4, 0],
            imgLatex: "(2, \\; 2\\sqrt{3})",
            w1: "(2\\sqrt{3}, \\; 2)",
            w2: "(-2, \\; 2\\sqrt{3})",
            w3: "(2, \\; -2\\sqrt{3})",
            w4: "(4, \\; 4\\sqrt{3})",
          },
          {
            deg: 30,
            pt: [6, 0],
            imgLatex: "(3\\sqrt{3}, \\; 3)",
            w1: "(3, \\; 3\\sqrt{3})",
            w2: "(-3\\sqrt{3}, \\; 3)",
            w3: "(3\\sqrt{3}, \\; -3)",
            w4: "(6\\sqrt{3}, \\; 3)",
          },
          {
            deg: 45,
            pt: [2, 0],
            imgLatex: "(\\sqrt{2}, \\; \\sqrt{2})",
            w1: "(-\\sqrt{2}, \\; \\sqrt{2})",
            w2: "(\\sqrt{2}, \\; -\\sqrt{2})",
            w3: "(2\\sqrt{2}, \\; 2\\sqrt{2})",
            w4: "(1, \\; 1)",
          },
          {
            deg: 120,
            pt: [4, 0],
            imgLatex: "(-2, \\; 2\\sqrt{3})",
            w1: "(2, \\; 2\\sqrt{3})",
            w2: "(-2\\sqrt{3}, \\; 2)",
            w3: "(-2, \\; -2\\sqrt{3})",
            w4: "(-4, \\; 2\\sqrt{3})",
          },
          {
            deg: 135,
            pt: [2, 0],
            imgLatex: "(-\\sqrt{2}, \\; \\sqrt{2})",
            w1: "(\\sqrt{2}, \\; \\sqrt{2})",
            w2: "(\\sqrt{2}, \\; -\\sqrt{2})",
            w3: "(-2\\sqrt{2}, \\; \\sqrt{2})",
            w4: "(-1, \\; 1)",
          },
          {
            deg: 30,
            pt: [0, 4],
            imgLatex: "(-2, \\; 2\\sqrt{3})",
            w1: "(2\\sqrt{3}, \\; 2)",
            w2: "(2, \\; 2\\sqrt{3})",
            w3: "(-2\\sqrt{3}, \\; 2)",
            w4: "(-2, \\; -2\\sqrt{3})",
          },
          {
            deg: 60,
            pt: [0, 6],
            imgLatex: "(-3\\sqrt{3}, \\; 3)",
            w1: "(3, \\; 3\\sqrt{3})",
            w2: "(-3, \\; 3\\sqrt{3})",
            w3: "(3\\sqrt{3}, \\; 3)",
            w4: "(-3\\sqrt{3}, \\; -3)",
          },
          {
            deg: 45,
            pt: [8, 0],
            imgLatex: "(4\\sqrt{2}, \\; 4\\sqrt{2})",
            w1: "(-4\\sqrt{2}, \\; 4\\sqrt{2})",
            w2: "(4\\sqrt{2}, \\; -4\\sqrt{2})",
            w3: "(8\\sqrt{2}, \\; 8\\sqrt{2})",
            w4: "(4, \\; 4)",
          },
          {
            deg: 150,
            pt: [4, 0],
            imgLatex: "(-2\\sqrt{3}, \\; 2)",
            w1: "(2\\sqrt{3}, \\; 2)",
            w2: "(-2, \\; 2\\sqrt{3})",
            w3: "(-2\\sqrt{3}, \\; -2)",
            w4: "(-4\\sqrt{3}, \\; 2)",
          },
          {
            deg: 225,
            pt: [2, 0],
            imgLatex: "(-\\sqrt{2}, \\; -\\sqrt{2})",
            w1: "(\\sqrt{2}, \\; -\\sqrt{2})",
            w2: "(-\\sqrt{2}, \\; \\sqrt{2})",
            w3: "(\\sqrt{2}, \\; \\sqrt{2})",
            w4: "(-2, \\; -2)",
          },
          {
            deg: 240,
            pt: [6, 0],
            imgLatex: "(-3, \\; -3\\sqrt{3})",
            w1: "(3, \\; -3\\sqrt{3})",
            w2: "(-3\\sqrt{3}, \\; -3)",
            w3: "(-3, \\; 3\\sqrt{3})",
            w4: "(-6, \\; -3\\sqrt{3})",
          },
          {
            deg: 300,
            pt: [4, 0],
            imgLatex: "(2, \\; -2\\sqrt{3})",
            w1: "(-2, \\; 2\\sqrt{3})",
            w2: "(2\\sqrt{3}, \\; -2)",
            w3: "(-2, \\; -2\\sqrt{3})",
            w4: "(2, \\; 2\\sqrt{3})",
          },
          {
            deg: 60,
            pt: [2, 0],
            imgLatex: "(1, \\; \\sqrt{3})",
            w1: "(\\sqrt{3}, \\; 1)",
            w2: "(-1, \\; \\sqrt{3})",
            w3: "(1, \\; -\\sqrt{3})",
            w4: "(2, \\; 2\\sqrt{3})",
          },
          {
            deg: 30,
            pt: [4, 0],
            imgLatex: "(2\\sqrt{3}, \\; 2)",
            w1: "(2, \\; 2\\sqrt{3})",
            w2: "(-2\\sqrt{3}, \\; 2)",
            w3: "(2\\sqrt{3}, \\; -2)",
            w4: "(4\\sqrt{3}, \\; 2)",
          },
          {
            deg: 45,
            pt: [4, 0],
            imgLatex: "(2\\sqrt{2}, \\; 2\\sqrt{2})",
            w1: "(-2\\sqrt{2}, \\; 2\\sqrt{2})",
            w2: "(2\\sqrt{2}, \\; -2\\sqrt{2})",
            w3: "(4\\sqrt{2}, \\; 4\\sqrt{2})",
            w4: "(2, \\; 2)",
          },
          {
            deg: 120,
            pt: [2, 0],
            imgLatex: "(-1, \\; \\sqrt{3})",
            w1: "(1, \\; \\sqrt{3})",
            w2: "(\\sqrt{3}, \\; -1)",
            w3: "(-1, \\; -\\sqrt{3})",
            w4: "(-2, \\; \\sqrt{3})",
          },
          {
            deg: 135,
            pt: [4, 0],
            imgLatex: "(-2\\sqrt{2}, \\; 2\\sqrt{2})",
            w1: "(2\\sqrt{2}, \\; 2\\sqrt{2})",
            w2: "(2\\sqrt{2}, \\; -2\\sqrt{2})",
            w3: "(-4\\sqrt{2}, \\; 2\\sqrt{2})",
            w4: "(-2, \\; 2)",
          },
          {
            deg: 150,
            pt: [2, 0],
            imgLatex: "(-\\sqrt{3}, \\; 1)",
            w1: "(\\sqrt{3}, \\; 1)",
            w2: "(-1, \\; \\sqrt{3})",
            w3: "(-\\sqrt{3}, \\; -1)",
            w4: "(-2\\sqrt{3}, \\; 1)",
          },
          {
            deg: 30,
            pt: [0, 6],
            imgLatex: "(-3, \\; 3\\sqrt{3})",
            w1: "(3\\sqrt{3}, \\; 3)",
            w2: "(3, \\; 3\\sqrt{3})",
            w3: "(-3\\sqrt{3}, \\; 3)",
            w4: "(-3, \\; -3\\sqrt{3})",
          },
          {
            deg: 45,
            pt: [6, 0],
            imgLatex: "(3\\sqrt{2}, \\; 3\\sqrt{2})",
            w1: "(-3\\sqrt{2}, \\; 3\\sqrt{2})",
            w2: "(3\\sqrt{2}, \\; -3\\sqrt{2})",
            w3: "(6\\sqrt{2}, \\; 6\\sqrt{2})",
            w4: "(3, \\; 3)",
          },
          {
            deg: 60,
            pt: [6, 0],
            imgLatex: "(3, \\; 3\\sqrt{3})",
            w1: "(3\\sqrt{3}, \\; 3)",
            w2: "(-3, \\; 3\\sqrt{3})",
            w3: "(3, \\; -3\\sqrt{3})",
            w4: "(6, \\; 6\\sqrt{3})",
          },
          {
            deg: 30,
            pt: [8, 0],
            imgLatex: "(4\\sqrt{3}, \\; 4)",
            w1: "(4, \\; 4\\sqrt{3})",
            w2: "(-4\\sqrt{3}, \\; 4)",
            w3: "(4\\sqrt{3}, \\; -4)",
            w4: "(8\\sqrt{3}, \\; 4)",
          },
          {
            deg: 120,
            pt: [6, 0],
            imgLatex: "(-3, \\; 3\\sqrt{3})",
            w1: "(3, \\; 3\\sqrt{3})",
            w2: "(-3\\sqrt{3}, \\; 3)",
            w3: "(-3, \\; -3\\sqrt{3})",
            w4: "(-6, \\; 3\\sqrt{3})",
          },
          {
            deg: 150,
            pt: [6, 0],
            imgLatex: "(-3\\sqrt{3}, \\; 3)",
            w1: "(3\\sqrt{3}, \\; 3)",
            w2: "(-3, \\; 3\\sqrt{3})",
            w3: "(-3\\sqrt{3}, \\; -3)",
            w4: "(-6\\sqrt{3}, \\; 3)",
          },
          {
            deg: 45,
            pt: [10, 0],
            imgLatex: "(5\\sqrt{2}, \\; 5\\sqrt{2})",
            w1: "(-5\\sqrt{2}, \\; 5\\sqrt{2})",
            w2: "(5\\sqrt{2}, \\; -5\\sqrt{2})",
            w3: "(10\\sqrt{2}, \\; 10\\sqrt{2})",
            w4: "(5, \\; 5)",
          },
          {
            deg: 60,
            pt: [8, 0],
            imgLatex: "(4, \\; 4\\sqrt{3})",
            w1: "(4\\sqrt{3}, \\; 4)",
            w2: "(-4, \\; 4\\sqrt{3})",
            w3: "(4, \\; -4\\sqrt{3})",
            w4: "(8, \\; 8\\sqrt{3})",
          },
        ];
        const item = rng.pick(pool);
        const { deg, pt, imgLatex, w1, w2, w3, w4 } = item;

        /** halves gives the cosine and the sine of a special angle as [k, s], meaning k times the square root of s, over 2. */
        const halves: Record<number, readonly [readonly [number, number], readonly [number, number]]> = {
          30: [
            [1, 3],
            [1, 1],
          ],
          45: [
            [1, 2],
            [1, 2],
          ],
          60: [
            [1, 1],
            [1, 3],
          ],
          120: [
            [-1, 1],
            [1, 3],
          ],
          135: [
            [-1, 2],
            [1, 2],
          ],
          150: [
            [-1, 3],
            [1, 1],
          ],
          225: [
            [-1, 2],
            [-1, 2],
          ],
          240: [
            [-1, 1],
            [-1, 3],
          ],
          300: [
            [1, 1],
            [-1, 3],
          ],
        };
        /** halfTex writes k times the square root of s, over 2. */
        const halfTex = ([k, s]: readonly [number, number]) => `${k < 0 ? "-" : ""}\\frac{${s === 1 ? "1" : `\\sqrt{${s}}`}}{2}`;
        /** surdTex writes n times the square root of s. */
        const surdTex = (n: number, s: number) =>
          s === 1 ? `${n}` : n === 1 ? `\\sqrt{${s}}` : n === -1 ? `-\\sqrt{${s}}` : `${n}\\sqrt{${s}}`;
        /** inBrackets puts a value that starts with a minus sign in parentheses. */
        const inBrackets = (v: string) => (v.startsWith("-") ? `(${v})` : v);
        /** squared gives the square of a value written as a whole number times a square root, or nothing for another form. */
        const squared = (v: string) => {
          const m = /^(-?)(\d*)(?:\\sqrt\{(\d+)\})?$/.exec(v.trim());
          if (!m) return undefined;
          const n = m[2] === "" ? 1 : Number(m[2]);
          return n * n * (m[3] ? Number(m[3]) : 1);
        };
        /** negated changes the sign of a value written in LaTeX. */
        const negated = (v: string) => (v.startsWith("-") ? v.slice(1) : `-${v}`);
        /** partsOf splits a point written as (a, \; b) into its two coordinates. */
        const partsOf = (p: string) => p.slice(1, -1).split(", \\; ") as [string, string];

        const [cosH, sinH] = halves[deg]!;
        const onX = pt[1] === 0;
        const rad = onX ? pt[0] : pt[1];
        const A = onX ? surdTex((rad * cosH[0]) / 2, cosH[1]) : surdTex((-rad * sinH[0]) / 2, sinH[1]);
        const B = onX ? surdTex((rad * sinH[0]) / 2, sinH[1]) : surdTex((rad * cosH[0]) / 2, cosH[1]);
        const cosT = halfTex(cosH);
        const sinT = halfTex(sinH);
        const where = (onX ? 0 : 90) + deg;
        const quadrant = where < 90 ? 1 : where < 180 ? 2 : where < 270 ? 3 : 4;
        const signs = [
          ["positive", "positive", "正", "正"],
          ["negative", "positive", "负", "正"],
          ["negative", "negative", "负", "负"],
          ["positive", "negative", "正", "负"],
        ][quadrant - 1]!;

        /** whyOf says what mistake gives a wrong image, by comparing it with the right one. */
        const whyOf = (wrong: string): Text => {
          const [p, q] = partsOf(wrong);
          const p2 = squared(p);
          const q2 = squared(q);
          if (p2 === undefined || q2 === undefined || p2 + q2 !== rad * rad) {
            return t(
              `This point is not $${rad}$ from the origin, but a rotation keeps distances.`,
              `这个点到原点的距离不是 $${rad}$，而旋转不改变距离。`,
            );
          }
          if (p === negated(A) && q === B) {
            return t("The sign of the first coordinate is wrong.", "第一个坐标的符号错了。");
          }
          if (p === A && q === negated(B)) {
            return t("The sign of the second coordinate is wrong.", "第二个坐标的符号错了。");
          }
          if (p === negated(A) && q === negated(B)) {
            return t("Both signs are wrong. This is a half turn too far.", "两个符号都错了。这多转了半圈。");
          }
          if ([B, negated(B)].includes(p) && [A, negated(A)].includes(q)) {
            return t("The cosine and the sine were exchanged.", "余弦和正弦用反了。");
          }
          return t("This point is the right distance from the origin but at the wrong angle.", "这个点到原点的距离对，但角度不对。");
        };

        const phrasing = rng.pick([1, 2]);
        const qEn =
          phrasing === 1
            ? `Find the coordinates of the image of point $P(${pt[0]}, ${pt[1]})$ after a counterclockwise rotation of $${deg}^\\circ$ about the origin.`
            : `Under a counterclockwise rotation by $${deg}^\\circ$ about the origin, what are the coordinates of the image of point $P(${pt[0]}, ${pt[1]})$?`;
        const qZh =
          phrasing === 1
            ? `求点 $P(${pt[0]}, ${pt[1]})$ 绕原点逆时针旋转 $${deg}^\\circ$ 后的像点坐标。`
            : `在绕原点逆时针旋转 $${deg}^\\circ$ 的变换下，点 $P(${pt[0]}, ${pt[1]})$ 的像点坐标是多少？`;
        const multiply = onX
          ? t(
              `Since $y = 0$, the image is $${rad}$ times the first column $(\\cos\\theta, \\sin\\theta)$. The new $x$ is $${rad} \\cdot ${inBrackets(cosT)} = ${A}$. The new $y$ is $${rad} \\cdot ${inBrackets(sinT)} = ${B}$. So $P' = ${imgLatex}$.`,
              `因为 $y = 0$，像是第一列 $(\\cos\\theta, \\sin\\theta)$ 的 $${rad}$ 倍。新的 $x$ 是 $${rad} \\cdot ${inBrackets(cosT)} = ${A}$。新的 $y$ 是 $${rad} \\cdot ${inBrackets(sinT)} = ${B}$。所以 $P' = ${imgLatex}$。`,
            )
          : t(
              `Since $x = 0$, the image is $${rad}$ times the second column $(-\\sin\\theta, \\cos\\theta)$. The new $x$ is $-${rad} \\cdot ${inBrackets(sinT)} = ${A}$. The new $y$ is $${rad} \\cdot ${inBrackets(cosT)} = ${B}$. So $P' = ${imgLatex}$.`,
              `因为 $x = 0$，像是第二列 $(-\\sin\\theta, \\cos\\theta)$ 的 $${rad}$ 倍。新的 $x$ 是 $-${rad} \\cdot ${inBrackets(sinT)} = ${A}$。新的 $y$ 是 $${rad} \\cdot ${inBrackets(cosT)} = ${B}$。所以 $P' = ${imgLatex}$。`,
            );
        return oneOf(
          rng,
          t(qEn, qZh),
          t(`$${imgLatex}$`, `$${imgLatex}$`),
          [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`), t(`$${w4}$`, `$${w4}$`)],
          join(
            label(1, "Find the cosine and sine", "求余弦和正弦"),
            t(
              `On the unit circle, $\\cos(${deg}^\\circ) = ${cosT}$ and $\\sin(${deg}^\\circ) = ${sinT}$.`,
              `由单位圆，$\\cos(${deg}^\\circ) = ${cosT}$，$\\sin(${deg}^\\circ) = ${sinT}$。`,
            ),
            para,
            label(2, "Multiply by the rotation matrix", "乘旋转矩阵"),
            multiply,
            checked(
              t(
                `A rotation keeps the distance from the origin, which is $${rad}$ for $P$. The squares of the coordinates of $P'$ add to $${squared(A)} + ${squared(B)} = ${rad * rad}$, which is $${rad}^2$. $P$ sits at $${onX ? 0 : 90}^\\circ$, so $P'$ sits at $${where}^\\circ$, in quadrant ${["I", "II", "III", "IV"][quadrant - 1]}. There $x$ is ${signs[0]} and $y$ is ${signs[1]}, as in $P'$.`,
                `旋转不改变到原点的距离，$P$ 到原点的距离是 $${rad}$。$P'$ 两个坐标的平方和是 $${squared(A)} + ${squared(B)} = ${rad * rad}$，正是 $${rad}^2$。$P$ 在 $${onX ? 0 : 90}^\\circ$ 方向，所以 $P'$ 在 $${where}^\\circ$ 方向，位于第${["一", "二", "三", "四"][quadrant - 1]}象限。那里 $x$ 为${signs[2]}，$y$ 为${signs[3]}，与 $P'$ 一致。`,
              ),
            ),
          ),
          [whyOf(w1), whyOf(w2), whyOf(w3), whyOf(w4)],
        );
      },
    },
  ],
};

/** combiningLinearTransformationsUsing2x2Matrices covers composing transformations and matrix order. */
export const combiningLinearTransformationsUsing2x2Matrices: TopicDef = {
  id: "combining-linear-transformations-using-2x2-matrices",
  title: t("Combining Linear Transformations Using 2x2 Matrices", "利用矩阵乘法复合线性变换"),
  summary: t(
    "Compose linear transformations in the plane and represent them by matrix products in the correct order.",
    "复合平面线性变换，并按正确顺序用矩阵乘积表示合成变换。",
  ),
  prerequisites: ["rotations-as-linear-transformations", "multiplying-square-matrices"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.8", "CCSS.HSN.VM.C.12"],
  intro: t(
    "You can write the matrices of rotations and reflections, and you can multiply square matrices. Doing one transformation and then another is again a linear transformation. Its matrix is the product of the two matrices, with the one applied first on the right, next to the vector. With it, a chain of moves becomes a single multiplication.\n\nLet $F$ reflect across the $x$-axis and $R$ rotate by $90^\\circ$. Reflecting first and then rotating has matrix\n\n$$RF = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}\\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix} = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$$\n\nFollow $(2, 1)$ step by step. $F$ sends it to $(2, -1)$, and $R$ sends that to $(1, 2)$. The product $RF$ also sends $(2, 1)$ straight to $(1, 2)$. In the other order the product is $FR$, with rows $(0, -1)$ and $(-1, 0)$, a different transformation.",
    "你会写旋转和反射的矩阵，也会做方阵乘法。先做一个变换再做另一个，结果仍是线性变换。它的矩阵是两个矩阵的乘积，先做的那个放在右边，紧挨着向量。有了它，一连串的变换就变成一次乘法。\n\n设 $F$ 是关于 $x$ 轴的反射，$R$ 是旋转 $90^\\circ$。先反射再旋转的矩阵是\n\n$$RF = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}\\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix} = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$$\n\n一步一步跟踪 $(2, 1)$。$F$ 把它变到 $(2, -1)$，$R$ 再把它变到 $(1, 2)$。乘积 $RF$ 也把 $(2, 1)$ 直接变到 $(1, 2)$。换一个顺序，乘积是 $FR$，行为 $(0, -1)$ 和 $(-1, 0)$，是另一个变换。",
  ),
  knowledgePoints: [
    {
      id: "matrix-product-order-in-composition",
      title: t("Order of matrix multiplication in composition", "复合变换中的矩阵乘法顺序"),
      explanation: t(
        "When transformation $T_1$ (with matrix $A_1$) is applied first, followed by transformation $T_2$ (with matrix $A_2$), the composite transformation $T = T_2 \\circ T_1$ has matrix product $M = A_2 A_1$, because $T(\\mathbf{x}) = T_2(T_1(\\mathbf{x})) = A_2(A_1\\mathbf{x}) = (A_2 A_1)\\mathbf{x}$.\n\n> **Watch out.** The matrix applied first goes on the right, next to $\\mathbf{x}$. Matrix products usually change when the order changes, so $A_1 A_2$ is in general a different transformation.",
        "当先进行变换 $T_1$（矩阵为 $A_1$），再进行变换 $T_2$（矩阵为 $A_2$）时，复合变换 $T = T_2 \\circ T_1$ 的标准矩阵为 $M = A_2 A_1$。这是因为 $T(\\mathbf{x}) = T_2(T_1(\\mathbf{x})) = A_2(A_1\\mathbf{x}) = (A_2 A_1)\\mathbf{x}$。\n\n> **注意。** 先做的矩阵放在右边，紧挨着 $\\mathbf{x}$。交换顺序后矩阵乘积通常会变，所以 $A_1 A_2$ 一般是另一个变换。",
      ),
      generate(rng) {
        const A: Mat2 = [
          [rng.pick([1, 2, 3]), rng.pick([-2, -1, 0, 1])],
          [rng.pick([-1, 0, 1]), rng.pick([1, 2, 3])],
        ];
        const B: Mat2 = [
          [rng.pick([0, 1, 2]), rng.pick([-1, 1, 2])],
          [rng.pick([1, -1, 2]), rng.pick([1, 2, 0])],
        ];

        const ALatex = mat2Latex(A);
        const BLatex = mat2Latex(B);
        // first and then name the matrices of the transformations applied first and second.
        const [first, then, firstT, thenT] = rng.bool() ? ["A", "B", "T_1", "T_2"] : ["B", "A", "T_2", "T_1"];
        const X = first === "A" ? A : B;
        const Y = first === "A" ? B : A;
        const v: Vec2 = [X[0][0], X[1][0]];

        return oneOf(
          rng,
          t(
            `A transformation $T_1$ has standard matrix $A = ${ALatex}$, and transformation $T_2$ has standard matrix $B = ${BLatex}$. Which expression gives the standard matrix of the composite transformation formed by applying $${firstT}$ first, followed by $${thenT}$?`,
            `变换 $T_1$ 的标准矩阵为 $A = ${ALatex}$，变换 $T_2$ 的标准矩阵为 $B = ${BLatex}$。先进行变换 $${firstT}$，再进行变换 $${thenT}$ 的复合变换的标准矩阵由哪一个表达式给出？`,
          ),
          t(`$${then} ${first}$`, `$${then} ${first}$`),
          [
            t(`$${first} ${then}$`, `$${first} ${then}$`),
            t(`$A + B$`, `$A + B$`),
            t(`$A^{-1} B$`, `$A^{-1} B$`),
            t(`$B^{-1} A$`, `$B^{-1} A$`),
          ],
          join(
            label(1, "Apply the first transformation", "做第一个变换"),
            t(
              `Applying $${firstT}$ first sends $\\mathbf{x}$ to $${first}\\mathbf{x}$.`,
              `先做 $${firstT}$，把 $\\mathbf{x}$ 变到 $${first}\\mathbf{x}$。`,
            ),
            para,
            label(2, "Apply the second transformation", "做第二个变换"),
            t(
              `Then $${thenT}$ sends that to $${then}(${first}\\mathbf{x}) = (${then}${first})\\mathbf{x}$. So the composite matrix is $${then}${first}$, with the matrix applied first on the right.`,
              `再做 $${thenT}$，把它变到 $${then}(${first}\\mathbf{x}) = (${then}${first})\\mathbf{x}$。所以复合矩阵是 $${then}${first}$，先做的矩阵在右边。`,
            ),
            checked(
              t(
                `Follow $\\mathbf{e}_1$ through both steps. $${first}$ sends it to its first column $(${v[0]}, ${v[1]})$. Row $1$ of $${then}$ times that gives $${dot(Y[0], v)}$. Row $2$ of $${then}$ times that gives $${dot(Y[1], v)}$. These are exactly the entries of the first column of the product $${then}${first}$, so one multiplication by $${then}${first}$ does both steps.`,
                `跟踪 $\\mathbf{e}_1$ 走完两步。$${first}$ 把它变到自己的第一列 $(${v[0]}, ${v[1]})$。$${then}$ 的第 $1$ 行乘它得 $${dot(Y[0], v)}$。$${then}$ 的第 $2$ 行乘它得 $${dot(Y[1], v)}$。这正是乘积 $${then}${first}$ 第一列的两个元素，所以乘一次 $${then}${first}$ 就完成了两步。`,
              ),
            ),
          ),
          [
            t(
              `This applies $${then}$ first. Matrix products act from right to left, so the matrix applied first goes on the right.`,
              `这是先做 $${then}$。矩阵乘积从右往左作用，先做的矩阵要放在右边。`,
            ),
            t(
              "Adding matrices does not compose transformations. $(A + B)\\mathbf{x}$ is the sum of two separate images.",
              "矩阵相加不是复合变换。$(A + B)\\mathbf{x}$ 是两个各自的像相加。",
            ),
            t("An inverse undoes a transformation, and nothing is undone here.", "逆矩阵用来抵消一个变换，而这里没有要抵消的变换。"),
            t("An inverse undoes a transformation, and nothing is undone here.", "逆矩阵用来抵消一个变换，而这里没有要抵消的变换。"),
          ],
        );
      },
    },
    {
      id: "evaluating-composite-linear-transformations",
      title: t("Evaluating composite transformation matrices", "计算复合线性变换的合成矩阵"),
      explanation: t(
        "To find the standard matrix of a combined transformation, multiply the individual transformation matrices in reverse chronological order: $M = A_2 A_1$.\n\n> **Watch out.** Write $A_2 A_1$ with the second transformation on the left. Computing $A_1 A_2$ instead gives, in general, a different matrix.",
        "求解复合变换的标准矩阵时，按变换发生顺序的逆序计算矩阵乘积：$M = A_2 A_1$。\n\n> **注意。** 写成 $A_2 A_1$，第二个变换在左边。算成 $A_1 A_2$ 一般会得到另一个矩阵。",
      ),
      generate(rng) {
        // Element pool for T1
        const t1Choices: { nameEn: string; nameZh: string; mat: Mat2 }[] = [
          {
            nameEn: "reflection across the $x$-axis",
            nameZh: "关于 $x$ 轴反射",
            mat: [
              [1, 0],
              [0, -1],
            ],
          },
          {
            nameEn: "reflection across the $y$-axis",
            nameZh: "关于 $y$ 轴反射",
            mat: [
              [-1, 0],
              [0, 1],
            ],
          },
          {
            nameEn: "reflection across the line $y = x$",
            nameZh: "关于直线 $y = x$ 反射",
            mat: [
              [0, 1],
              [1, 0],
            ],
          },
          {
            nameEn: "counterclockwise rotation by $90^\\circ$",
            nameZh: "绕原点逆时针旋转 $90^\\circ$",
            mat: [
              [0, -1],
              [1, 0],
            ],
          },
          {
            nameEn: "counterclockwise rotation by $180^\\circ$",
            nameZh: "绕原点逆时针旋转 $180^\\circ$",
            mat: [
              [-1, 0],
              [0, -1],
            ],
          },
          {
            nameEn: "counterclockwise rotation by $270^\\circ$",
            nameZh: "绕原点逆时针旋转 $270^\\circ$",
            mat: [
              [0, 1],
              [-1, 0],
            ],
          },
          {
            nameEn: "horizontal shear with factor $2$",
            nameZh: "切变因子为 $2$ 的水平切变",
            mat: [
              [1, 2],
              [0, 1],
            ],
          },
          {
            nameEn: "horizontal shear with factor $-2$",
            nameZh: "切变因子为 $-2$ 的水平切变",
            mat: [
              [1, -2],
              [0, 1],
            ],
          },
          {
            nameEn: "horizontal shear with factor $3$",
            nameZh: "切变因子为 $3$ 的水平切变",
            mat: [
              [1, 3],
              [0, 1],
            ],
          },
          {
            nameEn: "vertical shear with factor $1$",
            nameZh: "切变因子为 $1$ 的垂直切变",
            mat: [
              [1, 0],
              [1, 1],
            ],
          },
          {
            nameEn: "vertical shear with factor $-1$",
            nameZh: "切变因子为 $-1$ 的垂直切变",
            mat: [
              [1, 0],
              [-1, 1],
            ],
          },
          {
            nameEn: "vertical shear with factor $2$",
            nameZh: "切变因子为 $2$ 的垂直切变",
            mat: [
              [1, 0],
              [2, 1],
            ],
          },
          {
            nameEn: "dilation by scale factor $2$",
            nameZh: "缩放比例为 $2$ 的位似伸缩",
            mat: [
              [2, 0],
              [0, 2],
            ],
          },
          {
            nameEn: "dilation by scale factor $3$",
            nameZh: "缩放比例为 $3$ 的位似伸缩",
            mat: [
              [3, 0],
              [0, 3],
            ],
          },
        ];
        const t2Choices: { nameEn: string; nameZh: string; mat: Mat2 }[] = [
          {
            nameEn: "reflection across the $x$-axis",
            nameZh: "关于 $x$ 轴反射",
            mat: [
              [1, 0],
              [0, -1],
            ],
          },
          {
            nameEn: "reflection across the $y$-axis",
            nameZh: "关于 $y$ 轴反射",
            mat: [
              [-1, 0],
              [0, 1],
            ],
          },
          {
            nameEn: "reflection across the line $y = x$",
            nameZh: "关于直线 $y = x$ 反射",
            mat: [
              [0, 1],
              [1, 0],
            ],
          },
          {
            nameEn: "counterclockwise rotation by $90^\\circ$",
            nameZh: "绕原点逆时针旋转 $90^\\circ$",
            mat: [
              [0, -1],
              [1, 0],
            ],
          },
          {
            nameEn: "counterclockwise rotation by $180^\\circ$",
            nameZh: "绕原点逆时针旋转 $180^\\circ$",
            mat: [
              [-1, 0],
              [0, -1],
            ],
          },
          {
            nameEn: "horizontal stretch by factor $2$",
            nameZh: "沿 $x$ 轴拉伸 $2$ 倍",
            mat: [
              [2, 0],
              [0, 1],
            ],
          },
          {
            nameEn: "vertical stretch by factor $3$",
            nameZh: "沿 $y$ 轴拉伸 $3$ 倍",
            mat: [
              [1, 0],
              [0, 3],
            ],
          },
          {
            nameEn: "vertical stretch by factor $4$",
            nameZh: "沿 $y$ 轴拉伸 $4$ 倍",
            mat: [
              [1, 0],
              [0, 4],
            ],
          },
          {
            nameEn: "horizontal shear with factor $1$",
            nameZh: "切变因子为 $1$ 的水平切变",
            mat: [
              [1, 1],
              [0, 1],
            ],
          },
          {
            nameEn: "horizontal shear with factor $-3$",
            nameZh: "切变因子为 $-3$ 的水平切变",
            mat: [
              [1, -3],
              [0, 1],
            ],
          },
          {
            nameEn: "vertical shear with factor $2$",
            nameZh: "切变因子为 $2$ 的垂直切变",
            mat: [
              [1, 0],
              [2, 1],
            ],
          },
          {
            nameEn: "dilation by scale factor $2$",
            nameZh: "缩放比例为 $2$ 的位似伸缩",
            mat: [
              [2, 0],
              [0, 2],
            ],
          },
        ];

        const item1 = rng.pick(t1Choices);
        const item2 = rng.pick(t2Choices);
        const A1 = item1.mat;
        const A2 = item2.mat;

        const M: Mat2 = [
          [A2[0][0] * A1[0][0] + A2[0][1] * A1[1][0], A2[0][0] * A1[0][1] + A2[0][1] * A1[1][1]],
          [A2[1][0] * A1[0][0] + A2[1][1] * A1[1][0], A2[1][0] * A1[0][1] + A2[1][1] * A1[1][1]],
        ];
        const wrongOrder: Mat2 = [
          [A1[0][0] * A2[0][0] + A1[0][1] * A2[1][0], A1[0][0] * A2[0][1] + A1[0][1] * A2[1][1]],
          [A1[1][0] * A2[0][0] + A1[1][1] * A2[1][0], A1[1][0] * A2[0][1] + A1[1][1] * A2[1][1]],
        ];

        const w1: Mat2 = wrongOrder;
        const w2: Mat2 = [
          [-M[0][0], M[0][1]],
          [M[1][0], -M[1][1]],
        ];
        const w3: Mat2 = [
          [M[1][1], M[1][0]],
          [M[0][1], M[0][0]],
        ];
        const w4: Mat2 = [
          [M[0][0] + 1, M[0][1]],
          [M[1][0], M[1][1] - 1],
        ];

        const rightLatex = mat2Latex(M);
        const start: Vec2 = [1, 2];
        const mid: Vec2 = [A1[0][0] + 2 * A1[0][1], A1[1][0] + 2 * A1[1][1]];

        return oneOf(
          rng,
          t(
            `Find the single standard matrix that represents ${item1.nameEn} followed by ${item2.nameEn}.`,
            `求表示“先进行${item1.nameZh}，再进行${item2.nameZh}”的复合变换的唯一标准矩阵。`,
          ),
          t(`$${rightLatex}$`, `$${rightLatex}$`),
          [
            t(`$${mat2Latex(w1)}$`, `$${mat2Latex(w1)}$`),
            t(`$${mat2Latex(w2)}$`, `$${mat2Latex(w2)}$`),
            t(`$${mat2Latex(w3)}$`, `$${mat2Latex(w3)}$`),
            t(`$${mat2Latex(w4)}$`, `$${mat2Latex(w4)}$`),
          ],
          join(
            label(1, "Write the two matrices", "写出两个矩阵"),
            t(
              `First comes a ${item1.nameEn}. Its matrix is $A_1 = ${mat2Latex(A1)}$. Then comes a ${item2.nameEn}. Its matrix is $A_2 = ${mat2Latex(A2)}$.`,
              `先做的是${item1.nameZh}。它的矩阵是 $A_1 = ${mat2Latex(A1)}$。后做的是${item2.nameZh}。它的矩阵是 $A_2 = ${mat2Latex(A2)}$。`,
            ),
            para,
            label(2, "Multiply in the right order", "按正确顺序相乘"),
            t(
              "The composite is $M = A_2 A_1$, with the matrix applied first on the right. ",
              "复合变换的矩阵是 $M = A_2 A_1$，先做的矩阵在右边。",
            ),
            products(A2, A1, [
              [0, 0],
              [0, 1],
              [1, 0],
              [1, 1],
            ]),
            t(` So $M = ${rightLatex}$.`, `所以 $M = ${rightLatex}$。`),
            checked(
              t(
                `Follow the point $(1, 2)$ one step at a time. Row $1$ of $A_1$ gives $${dot(A1[0], start)}$. Row $2$ of $A_1$ gives $${dot(A1[1], start)}$. Row $1$ of $A_2$ times $(${mid[0]}, ${mid[1]})$ gives $${dot(A2[0], mid)}$. Row $2$ of $A_2$ times it gives $${dot(A2[1], mid)}$. In one step, row $1$ of $M$ gives $${dot(M[0], start)}$. Row $2$ of $M$ gives $${dot(M[1], start)}$. Both routes end at the same point.`,
                `一步一步跟踪点 $(1, 2)$。$A_1$ 的第 $1$ 行得 $${dot(A1[0], start)}$。$A_1$ 的第 $2$ 行得 $${dot(A1[1], start)}$。$A_2$ 的第 $1$ 行乘 $(${mid[0]}, ${mid[1]})$ 得 $${dot(A2[0], mid)}$。$A_2$ 的第 $2$ 行乘它得 $${dot(A2[1], mid)}$。一步到位时，$M$ 的第 $1$ 行得 $${dot(M[0], start)}$。$M$ 的第 $2$ 行得 $${dot(M[1], start)}$。两条路得到同一个点。`,
              ),
            ),
          ),
          [
            t("This is $A_1 A_2$, which applies the second transformation first.", "这是 $A_1 A_2$，相当于先做了第二个变换。"),
            t("The signs of the two diagonal entries are changed.", "两个对角元的符号变了。"),
            t("The four entries are written in reverse order.", "四个元素的顺序写反了。"),
            t("The diagonal entries are off by $1$.", "对角元差了 $1$。"),
          ],
        );
      },
    },
  ],
};

/** invertingLinearTransformations covers finding inverse transformations and preimages. */
export const invertingLinearTransformations: TopicDef = {
  id: "inverting-linear-transformations",
  title: t("Inverting Linear Transformations", "线性变换的逆变换"),
  summary: t(
    "Find the inverse of a linear transformation and use the inverse matrix to recover preimages.",
    "求解线性变换的逆变换，并利用逆矩阵恢复原像点。",
  ),
  prerequisites: ["inverses-of-2x2-matrices", "combining-linear-transformations-using-2x2-matrices"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.10", "CCSS.HSN.VM.C.12"],
  intro: t(
    "You can find the inverse of a $2 \\times 2$ matrix and combine transformations by multiplying their matrices. The inverse transformation $T^{-1}$ undoes $T$: doing $T$ and then $T^{-1}$ leaves every point where it was. Its matrix is $A^{-1}$, because $A^{-1}A = I$. It lets you find the point that a transformation sent to a given image.\n\nTake the horizontal shear\n\n$$A = \\begin{pmatrix} 1 & 3 \\\\ 0 & 1 \\end{pmatrix}$$\n\nIt slides each point sideways by $3$ times its height. It is undone by sliding back, the shear by $-3$, and indeed $\\det(A) = 1$ and $A^{-1}$ has rows $(1, -3)$ and $(0, 1)$. $A$ sends $(7, 2)$ to $(7 + 3 \\cdot 2, 2) = (13, 2)$, and $A^{-1}$ sends $(13, 2)$ back to $(13 - 3 \\cdot 2, 2) = (7, 2)$.",
    "你会求 $2 \\times 2$ 矩阵的逆矩阵，也会用矩阵乘法复合变换。逆变换 $T^{-1}$ 抵消 $T$：先做 $T$ 再做 $T^{-1}$，每个点都回到原处。它的矩阵是 $A^{-1}$，因为 $A^{-1}A = I$。用它可以求出某个变换把哪个点变成了给定的像。\n\n取水平切变\n\n$$A = \\begin{pmatrix} 1 & 3 \\\\ 0 & 1 \\end{pmatrix}$$\n\n它把每个点横向滑动它高度的 $3$ 倍。滑回去就能抵消它，也就是因子为 $-3$ 的切变；确实 $\\det(A) = 1$，$A^{-1}$ 的行为 $(1, -3)$ 和 $(0, 1)$。$A$ 把 $(7, 2)$ 变到 $(7 + 3 \\cdot 2, 2) = (13, 2)$，$A^{-1}$ 又把 $(13, 2)$ 变回 $(13 - 3 \\cdot 2, 2) = (7, 2)$。",
  ),
  knowledgePoints: [
    {
      id: "matrix-of-inverse-linear-transformation",
      title: t("Standard matrix of an inverse linear transformation", "逆线性变换的标准矩阵"),
      figure: remainingDrawings8["inverting-linear-transformations#matrix-of-inverse-linear-transformation"],
      explanation: t(
        "If a linear transformation $T$ has standard matrix $A$, its inverse transformation $T^{-1}$ reverses the action of $T$ and has standard matrix $A^{-1}$. For instance, the inverse of rotation $R_\\theta$ is $R_{-\\theta}$, and the inverse of reflection across a line is the reflection itself.\n\n> **Watch out.** The inverse is not $-A$ and not the matrix of reciprocals of the entries. Check a candidate by multiplying: only the inverse gives $AA^{-1} = I$.",
        "若线性变换 $T$ 的标准矩阵为 $A$，则其逆变换 $T^{-1}$ 撤销 $T$ 的几何效果，且其标准矩阵为 $A^{-1}$。例如，旋转 $R_\\theta$ 的逆变换为反向旋转 $R_{-\\theta}$，反射变换的逆变换为其自身。\n\n> **注意。** 逆矩阵不是 $-A$，也不是把各元素取倒数。用乘法检验候选答案：只有逆矩阵满足 $AA^{-1} = I$。",
      ),
      generate(rng) {
        const type = rng.pick(["shearH", "shearV", "rotation", "reflection", "matrix"]);
        let opEn = "";
        let opZh = "";
        let A: Mat2 = [
          [1, 0],
          [0, 1],
        ];
        let invA: Mat2 = [
          [1, 0],
          [0, 1],
        ];
        let remark: Text | undefined;

        if (type === "shearH") {
          const k = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
          opEn = `horizontal shear with factor $${k}$`;
          opZh = `切变因子为 $${k}$ 的水平切变`;
          A = [
            [1, k],
            [0, 1],
          ];
          invA = [
            [1, -k],
            [0, 1],
          ];
          remark = t(
            `A horizontal shear by $${k}$ is undone by sliding back, the horizontal shear by $${-k}$, and that is the matrix found.`,
            `因子为 $${k}$ 的水平切变由滑回去抵消，也就是因子为 $${-k}$ 的水平切变，正是求得的矩阵。`,
          );
        } else if (type === "shearV") {
          const k = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
          opEn = `vertical shear with factor $${k}$`;
          opZh = `切变因子为 $${k}$ 的垂直切变`;
          A = [
            [1, 0],
            [k, 1],
          ];
          invA = [
            [1, 0],
            [-k, 1],
          ];
          remark = t(
            `A vertical shear by $${k}$ is undone by sliding back, the vertical shear by $${-k}$, and that is the matrix found.`,
            `因子为 $${k}$ 的垂直切变由滑回去抵消，也就是因子为 $${-k}$ 的垂直切变，正是求得的矩阵。`,
          );
        } else if (type === "rotation") {
          const rotChoices = [
            {
              deg: 90,
              A: [
                [0, -1],
                [1, 0],
              ] as Mat2,
              invA: [
                [0, 1],
                [-1, 0],
              ] as Mat2,
            },
            {
              deg: 180,
              A: [
                [-1, 0],
                [0, -1],
              ] as Mat2,
              invA: [
                [-1, 0],
                [0, -1],
              ] as Mat2,
            },
            {
              deg: 270,
              A: [
                [0, 1],
                [-1, 0],
              ] as Mat2,
              invA: [
                [0, -1],
                [1, 0],
              ] as Mat2,
            },
            {
              deg: -90,
              A: [
                [0, 1],
                [-1, 0],
              ] as Mat2,
              invA: [
                [0, -1],
                [1, 0],
              ] as Mat2,
            },
          ];
          const pickRot = rng.pick(rotChoices);
          opEn = `counterclockwise rotation by $${pickRot.deg}^\\circ$`;
          opZh = `绕原点逆时针旋转 $${pickRot.deg}^\\circ$`;
          A = pickRot.A;
          invA = pickRot.invA;
          remark = t(
            `Rotating by $${pickRot.deg}^\\circ$ is undone by rotating back by $${pickRot.deg}^\\circ$, and that is the matrix found.`,
            `旋转 $${pickRot.deg}^\\circ$ 由反向转回 $${pickRot.deg}^\\circ$ 抵消，正是求得的矩阵。`,
          );
        } else if (type === "reflection") {
          const refChoices = [
            {
              lineEn: "the $x$-axis",
              lineZh: "$x$ 轴",
              mat: [
                [1, 0],
                [0, -1],
              ] as Mat2,
            },
            {
              lineEn: "the $y$-axis",
              lineZh: "$y$ 轴",
              mat: [
                [-1, 0],
                [0, 1],
              ] as Mat2,
            },
            {
              lineEn: "the line $y = x$",
              lineZh: "直线 $y = x$",
              mat: [
                [0, 1],
                [1, 0],
              ] as Mat2,
            },
            {
              lineEn: "the line $y = -x$",
              lineZh: "直线 $y = -x$",
              mat: [
                [0, -1],
                [-1, 0],
              ] as Mat2,
            },
          ];
          const pickRef = rng.pick(refChoices);
          opEn = `reflection across ${pickRef.lineEn}`;
          opZh = `关于${pickRef.lineZh}反射`;
          A = pickRef.mat;
          invA = pickRef.mat;
          remark = t(
            "Reflecting a second time across the same line puts every point back, so the inverse is the reflection itself.",
            "关于同一条直线再反射一次，每个点都回到原处，所以逆变换就是这个反射本身。",
          );
        } else {
          // general invertible matrix
          const a = rng.pick([-3, -2, -1, 1, 2, 3, 4]);
          const d = rng.pick([-3, -2, -1, 1, 2, 3]);
          const b = rng.pick([-2, -1, 1, 2]);
          const prod = a * d - 1;
          const c = prod % b === 0 ? prod / b : a * d > 0 ? 1 : -1;
          const det = a * d - b * c;
          if (det === 1) {
            A = [
              [a, b],
              [c, d],
            ];
            invA = [
              [d, -b],
              [-c, a],
            ];
          } else if (det === -1) {
            A = [
              [a, b],
              [c, d],
            ];
            invA = [
              [-d, b],
              [c, -a],
            ];
          } else {
            A = [
              [2, 1],
              [1, 1],
            ];
            invA = [
              [1, -1],
              [-1, 2],
            ];
          }
          opEn = `linear transformation with standard matrix $A = ${mat2Latex(A)}$`;
          opZh = `标准矩阵为 $A = ${mat2Latex(A)}$ 的线性变换`;
        }

        const ALatex = mat2Latex(A);
        const rightLatex = mat2Latex(invA);
        const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
        const adj: Mat2 = [
          [A[1][1], -A[0][1]],
          [-A[1][0], A[0][0]],
        ];
        const all: readonly (readonly [number, number])[] = [
          [0, 0],
          [0, 1],
          [1, 0],
          [1, 1],
        ];
        const w1: Mat2 = [
          [-invA[0][0], invA[0][1]],
          [invA[1][0], -invA[1][1]],
        ];
        const w2: Mat2 = [
          [-A[0][0], -A[0][1]],
          [-A[1][0], -A[1][1]],
        ];
        const w3: Mat2 = [
          [invA[1][0], invA[1][1]],
          [invA[0][0], invA[0][1]],
        ];
        const w4: Mat2 = [
          [invA[0][0], -invA[0][1]],
          [-invA[1][0], invA[1][1]],
        ];

        return oneOf(
          rng,
          t(
            `Find the standard matrix of the inverse transformation $T^{-1}$ for the transformation: ${opEn} (standard matrix $A = ${ALatex}$).`,
            `求下列几何变换的逆变换 $T^{-1}$ 的标准矩阵：${opZh}（标准矩阵 $A = ${ALatex}$）。`,
          ),
          t(`$${rightLatex}$`, `$${rightLatex}$`),
          [
            t(`$${mat2Latex(w1)}$`, `$${mat2Latex(w1)}$`),
            t(`$${mat2Latex(w2)}$`, `$${mat2Latex(w2)}$`),
            t(`$${mat2Latex(w3)}$`, `$${mat2Latex(w3)}$`),
            t(`$${mat2Latex(w4)}$`, `$${mat2Latex(w4)}$`),
          ],
          join(
            label(1, "Find the determinant", "求行列式"),
            t(
              `The inverse transformation has matrix $A^{-1}$. The determinant of $A$ is $${paren(A[0][0])} \\cdot ${paren(A[1][1])} - ${paren(A[0][1])} \\cdot ${paren(A[1][0])} = ${det}$, which is not zero.`,
              `逆变换的矩阵是 $A^{-1}$。$A$ 的行列式是 $${paren(A[0][0])} \\cdot ${paren(A[1][1])} - ${paren(A[0][1])} \\cdot ${paren(A[1][0])} = ${det}$，不为零。`,
            ),
            para,
            label(2, "Write the inverse", "写出逆矩阵"),
            t(
              "Swap the diagonal entries, change the signs of the other two, and divide by the determinant:",
              "交换两个对角元，另外两个元素变号，再除以行列式：",
            ),
            shown(det === 1 ? `A^{-1} = ${mat2Latex(adj)}` : `A^{-1} = ${over(det)}${mat2Latex(adj)} = ${rightLatex}`),
            remark ? join(para, label(3, "Read it geometrically", "从几何上看"), remark) : t("", ""),
            checked(
              join(
                t("The product $AA^{-1}$ must be $I$. ", "乘积 $AA^{-1}$ 应当是 $I$。"),
                products(A, invA, all),
                t(" So $AA^{-1} = I$.", "所以 $AA^{-1} = I$。"),
              ),
            ),
          ),
          [
            t(
              "The diagonal entries have the wrong signs. Only the two other entries change sign.",
              "对角元的符号错了。只有另外两个元素要变号。",
            ),
            t("This is $-A$. Changing every sign of $A$ does not undo it.", "这是 $-A$。把 $A$ 的每个符号都变掉并不能抵消它。"),
            t("The two rows of the inverse are swapped.", "逆矩阵的两行写反了。"),
            t("The two entries off the diagonal have the wrong signs.", "副对角线上两个元素的符号错了。"),
          ],
        );
      },
    },
    {
      id: "recovering-original-points-using-inverse-transformation",
      title: t("Recovering preimages using inverse transformations", "利用逆变换求原像点"),
      explanation: t(
        "If a point $P(x, y)$ is mapped to $P'(x', y')$ by linear transformation $T$ with invertible matrix $A$, the original point is recovered using the inverse transformation: $\\begin{pmatrix} x \\\\ y \\end{pmatrix} = A^{-1} \\begin{pmatrix} x' \\\\ y' \\end{pmatrix}$.\n\n> **Watch out.** Multiply the image $P'$ by $A^{-1}$, not by $A$. Applying $A$ again moves the point further instead of bringing it back.",
        "若点 $P(x, y)$ 在可逆矩阵为 $A$ 的线性变换 $T$ 作用下映射为 $P'(x', y')$，则可通过逆变换恢复原点：$\\begin{pmatrix} x \\\\ y \\end{pmatrix} = A^{-1} \\begin{pmatrix} x' \\\\ y' \\end{pmatrix}$。\n\n> **注意。** 要用 $A^{-1}$ 乘像点 $P'$，不是用 $A$。再用 $A$ 作用一次，点会被移得更远，而不是回到原处。",
      ),
      generate(rng) {
        const x = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const y = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);

        const candA: Mat2[] = [
          [
            [1, 2],
            [3, 5],
          ],
          [
            [2, 1],
            [5, 3],
          ],
          [
            [3, 1],
            [4, 2],
          ],
          [
            [2, 3],
            [1, 2],
          ],
          [
            [3, 2],
            [1, 1],
          ],
          [
            [4, 1],
            [3, 1],
          ],
          [
            [1, -1],
            [2, 1],
          ],
          [
            [2, -1],
            [1, 1],
          ],
          [
            [3, -2],
            [1, 1],
          ],
          [
            [2, 5],
            [1, 3],
          ],
          [
            [5, 2],
            [2, 1],
          ],
          [
            [3, 4],
            [1, 2],
          ],
        ];
        const A = rng.pick(candA);
        const xp = A[0][0] * x + A[0][1] * y;
        const yp = A[1][0] * x + A[1][1] * y;

        const w1: Vec2 = [y, x];
        const w2: Vec2 = [-x, y];
        const w3: Vec2 = [x, -y];
        const w4: Vec2 = [x + 1, y - 1];

        const ALatex = mat2Latex(A);
        const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
        const adj: Mat2 = [
          [A[1][1], -A[0][1]],
          [-A[1][0], A[0][0]],
        ];
        const p = adj[0][0] * xp + adj[0][1] * yp;
        const q = adj[1][0] * xp + adj[1][1] * yp;
        const middle = det === 1 ? "" : ` = ${over(det)}${vec2Latex([p, q])}`;

        return pointProblem({
          prompt: t(
            `A linear transformation with standard matrix $A = ${ALatex}$ maps an unknown point $P(x, y)$ to $P'(${xp}, ${yp})$. Find the coordinates of the original point $P$.`,
            `标准矩阵为 $A = ${ALatex}$ 的线性变换将未知点 $P(x, y)$ 映射为 $P'(${xp}, ${yp})$。求原像点 $P$ 的坐标。`,
          ),
          answer: [x, y],
          vars: ["x", "y"],
          solution: join(
            label(1, "Find the determinant", "求行列式"),
            t(
              `The original point is $A^{-1}$ times the image. The determinant of $A$ is $${paren(A[0][0])} \\cdot ${paren(A[1][1])} - ${paren(A[0][1])} \\cdot ${paren(A[1][0])} = ${det}$, which is not zero.`,
              `原像点等于 $A^{-1}$ 乘像点。$A$ 的行列式是 $${paren(A[0][0])} \\cdot ${paren(A[1][1])} - ${paren(A[0][1])} \\cdot ${paren(A[1][0])} = ${det}$，不为零。`,
            ),
            para,
            label(2, "Multiply by the inverse", "乘逆矩阵"),
            t(
              "The inverse is the adjugate divided by the determinant, and it multiplies the image:",
              "逆矩阵是伴随矩阵除以行列式，用它乘像点：",
            ),
            shown(
              `\\begin{pmatrix} x \\\\ y \\end{pmatrix} = ${over(det)}${mat2Latex(adj)}${vec2Latex([xp, yp])}${middle} = ${vec2Latex([x, y])}`,
            ),
            para,
            t(`So $P = (${x}, ${y})$.`, `所以 $P = (${x}, ${y})$。`),
            checked(
              t(
                `Apply $A$ to $P$. Row $1$ gives $${dot(A[0], [x, y])}$. Row $2$ gives $${dot(A[1], [x, y])}$. That is $P'(${xp}, ${yp})$.`,
                `用 $A$ 作用于 $P$。第 $1$ 行得 $${dot(A[0], [x, y])}$。第 $2$ 行得 $${dot(A[1], [x, y])}$。正是 $P'(${xp}, ${yp})$。`,
              ),
            ),
          ),
          wrong: [w1, w2, w3, w4],
        });
      },
    },
  ],
};

/** areaScaleFactorsOfLinearTransformations covers area scaling by |det(A)| and orientation. */
export const areaScaleFactorsOfLinearTransformations: TopicDef = {
  id: "area-scale-factors-of-linear-transformations",
  title: t("Area Scale Factors of Linear Transformations", "线性变换的面积缩放因子"),
  summary: t(
    "Interpret the determinant as the area scale factor of a transformation and determine whether orientation is preserved.",
    "将行列式解释为变换的面积缩放因子，并根据行列式符号判断定向是否保持。",
  ),
  prerequisites: ["the-geometric-interpretation-of-the-2x2-determinant", "combining-linear-transformations-using-2x2-matrices"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.12"],
  intro: t(
    "You know that $|\\det(A)|$ is the area of the parallelogram spanned by the columns of $A$, and you can combine transformations. That parallelogram is the image of the unit square. Every region can be filled with tiny squares, so a linear transformation multiplies every area by the same number, $|\\det(A)|$. The sign of $\\det(A)$ says whether the figure is flipped over.\n\nTake\n\n$$A = \\begin{pmatrix} 3 & 1 \\\\ 1 & 2 \\end{pmatrix}$$\n\nIts determinant is $3 \\cdot 2 - 1 \\cdot 1 = 5$, so a triangle of area $4$ goes to a triangle of area $5 \\cdot 4 = 20$. The reflection across $y = x$, with rows $(0, 1)$ and $(1, 0)$, has determinant $0 \\cdot 0 - 1 \\cdot 1 = -1$. It keeps every area, because $|-1| = 1$, and it turns counterclockwise loops into clockwise ones.",
    "你知道 $|\\det(A)|$ 是由 $A$ 的两列张成的平行四边形的面积，也会复合变换。这个平行四边形正是单位正方形的像。每个区域都能用很小的正方形铺满，所以线性变换把每个面积都乘同一个数 $|\\det(A)|$。$\\det(A)$ 的符号说明图形有没有被翻过来。\n\n取\n\n$$A = \\begin{pmatrix} 3 & 1 \\\\ 1 & 2 \\end{pmatrix}$$\n\n它的行列式是 $3 \\cdot 2 - 1 \\cdot 1 = 5$，所以面积为 $4$ 的三角形变成面积为 $5 \\cdot 4 = 20$ 的三角形。关于 $y = x$ 的反射，行为 $(0, 1)$ 和 $(1, 0)$，行列式是 $0 \\cdot 0 - 1 \\cdot 1 = -1$。它保持每个面积不变，因为 $|-1| = 1$，但把逆时针的回路变成顺时针的。",
  ),
  knowledgePoints: [
    {
      id: "area-scaling-by-absolute-determinant",
      title: t("Area scaling by absolute determinant", "面积缩放因子与行列式绝对值"),
      explanation: t(
        "Under a $2 \\times 2$ linear transformation with standard matrix $A$, the area of any planar region $S$ scales by the absolute value of the determinant: $\\text{Area}(T(S)) = |\\det(A)| \\times \\text{Area}(S)$.\n\n> **Watch out.** Take the absolute value. A negative determinant still multiplies areas by $|\\det(A)|$; its sign only says that the figure is flipped.",
        "在标准矩阵为 $A$ 的二阶线性变换作用下，任意平面图形 $S$ 的面积缩放倍数为行列式的绝对值：$\\text{Area}(T(S)) = |\\det(A)| \\times \\text{Area}(S)$。\n\n> **注意。** 要取绝对值。行列式为负时，面积仍然乘 $|\\det(A)|$；符号只说明图形被翻转了。",
      ),
      generate(rng) {
        const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const d = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const b = rng.pick([-3, -2, -1, 0, 1, 2, 3]);
        const c = rng.pick([-3, -2, -1, 0, 1, 2, 3]);
        const det = a * d - b * c;
        if (det === 0) return this.generate(rng);

        const absDet = Math.abs(det);
        const origArea = rng.pick([3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20]);
        const newArea = absDet * origArea;

        const w1 = origArea * (absDet + 1);
        const w2 = Math.abs(det) === 1 ? origArea + 2 : (absDet - 1) * origArea;
        const w3 = (a + d) * origArea;
        const w4 = Math.round(origArea / absDet);

        const ALatex = mat2Latex([
          [a, b],
          [c, d],
        ]);
        const detStep = join(
          label(1, "Find the determinant", "求行列式"),
          t(
            `$\\det(A) = ${paren(a)} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)} = ${det}$.`,
            `$\\det(A) = ${paren(a)} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)} = ${det}$。`,
          ),
        );
        const shoelace = `\\frac{1}{2}\\left|${paren(a)} \\cdot ${paren(c + d)} - ${paren(a + b)} \\cdot ${paren(c)} + ${paren(a + b)} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c + d)}\\right| = \\frac{1}{2} \\cdot ${2 * absDet} = ${absDet}`;
        const square = t(
          `The unit square, of area $1$, goes to the parallelogram with corners $(0, 0)$, $(${a}, ${c})$, $(${a + b}, ${c + d})$ and $(${b}, ${d})$. The shoelace formula gives its area as $${shoelace}$.`,
          `面积为 $1$ 的单位正方形变成顶点为 $(0, 0)$，$(${a}, ${c})$，$(${a + b}, ${c + d})$，$(${b}, ${d})$ 的平行四边形。由鞋带公式，它的面积是 $${shoelace}$。`,
        );

        const askScaleFactor = rng.pick([true, false]);
        if (askScaleFactor) {
          const w1 = absDet + 1;
          const w2 = absDet === 1 ? 2 : absDet - 1;
          const w3 = Math.abs(a + d);
          const w4 = absDet + 2;
          return numberProblem({
            prompt: t(
              `What is the area scale factor of the linear transformation with standard matrix $A = ${ALatex}$?`,
              `求标准矩阵为 $A = ${ALatex}$ 的线性变换的面积缩放因子。`,
            ),
            answer: absDet,
            solution: join(
              detStep,
              para,
              label(2, "Take the absolute value", "取绝对值"),
              t(`The area scale factor is $|\\det(A)| = |${det}| = ${absDet}$.`, `面积缩放因子是 $|\\det(A)| = |${det}| = ${absDet}$。`),
              checked(join(square, t(` So areas are multiplied by $${absDet}$.`, `所以面积乘 $${absDet}$。`))),
            ),
            wrong: [w1, w2, w3, w4],
          });
        }

        return numberProblem({
          prompt: t(
            `A geometric shape in the plane has an area of $${origArea}$. What is the area of its image under the linear transformation with matrix $A = ${ALatex}$?`,
            `平面上某几何图形的面积为 $${origArea}$。在矩阵为 $A = ${ALatex}$ 的线性变换作用下，其像图形的面积是多少？`,
          ),
          answer: newArea,
          solution: join(
            detStep,
            para,
            label(2, "Scale the area", "缩放面积"),
            t(
              `The area scale factor is $|\\det(A)| = |${det}| = ${absDet}$. So the new area is $${absDet} \\times ${origArea} = ${newArea}$.`,
              `面积缩放因子是 $|\\det(A)| = |${det}| = ${absDet}$。所以新面积是 $${absDet} \\times ${origArea} = ${newArea}$。`,
            ),
            checked(
              join(
                square,
                t(
                  ` Every area is multiplied by that factor, and $${newArea} \\div ${origArea} = ${absDet}$.`,
                  `每个面积都乘这个因子，而 $${newArea} \\div ${origArea} = ${absDet}$。`,
                ),
              ),
            ),
          ),
          wrong: [w1, w2, w3, w4],
        });
      },
    },
    {
      id: "orientation-and-sign-of-determinant",
      title: t("Orientation and sign of the determinant", "图形定向与行列式符号"),
      figure: remainingDrawings8["area-scale-factors-of-linear-transformations#orientation-and-sign-of-determinant"],
      explanation: t(
        "The sign of $\\det(A)$ governs orientation:\n- If $\\det(A) > 0$, the transformation preserves orientation (counterclockwise loops remain counterclockwise).\n- If $\\det(A) < 0$, the transformation reverses orientation (counterclockwise loops become clockwise, as in a reflection).\n\n> **Watch out.** Look at the sign, not the size. A determinant of $-1$ reverses orientation even though it keeps every area.",
        "行列式 $\\det(A)$ 的符号决定图形的定向：\n- 若 $\\det(A) > 0$，变换保持定向不变（逆时针路径仍为逆时针）。\n- 若 $\\det(A) < 0$，变换反转定向（逆时针路径变为顺时针，如同镜像反射）。\n\n> **注意。** 看符号，不看大小。行列式为 $-1$ 时面积不变，但定向反转了。",
      ),
      generate(rng) {
        const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const d = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const b = rng.pick([-3, -2, -1, 0, 1, 2, 3]);
        const c = rng.pick([-3, -2, -1, 0, 1, 2, 3]);
        const det = a * d - b * c;
        if (det === 0) return this.generate(rng);

        const preserves = det > 0;
        const A: Mat2 = [
          [a, b],
          [c, d],
        ];
        const ALatex = mat2Latex(A);

        const keeps = t("It preserves orientation", "保持定向");
        const flips = t("It reverses orientation", "反转定向");
        const rightText = preserves ? keeps : flips;
        const wrong1 = preserves ? flips : keeps;
        const wrong2 = t("It collapses the plane onto a line, so orientation is lost", "把平面压缩成一条直线，定向不再有意义");
        const wrong3 = t("Orientation cannot be determined from the determinant alone", "仅凭行列式无法判断定向是否改变");
        const signEn = preserves ? "positive" : "negative";
        const signZh = preserves ? "正" : "负";

        return oneOf(
          rng,
          t(
            `A linear transformation has standard matrix $A = ${ALatex}$. Does this transformation preserve or reverse orientation in the plane?`,
            `某线性变换的标准矩阵为 $A = ${ALatex}$。该变换在平面上是保持定向还是反转定向？`,
          ),
          rightText,
          [wrong1, wrong2, wrong3],
          join(
            label(1, "Find the determinant", "求行列式"),
            t(
              `$\\det(A) = ${paren(a)} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)} = ${det}$.`,
              `$\\det(A) = ${paren(a)} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)} = ${det}$。`,
            ),
            para,
            label(2, "Read the sign", "看符号"),
            t(
              `The determinant is ${signEn}, so the transformation ${preserves ? "preserves" : "reverses"} orientation.`,
              `行列式为${signZh}，所以该变换${preserves ? "保持" : "反转"}定向。`,
            ),
            checked(
              t(
                `The triangle $(0, 0)$, $(1, 0)$, $(0, 1)$ is traced counterclockwise. Its image is the triangle $(0, 0)$, $(${a}, ${c})$, $(${b}, ${d})$. The signed shoelace area of the image is $\\frac{1}{2}(${paren(a)} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)}) = ${Q.of(det, 2).toLatex()}$. It is ${signEn}, so the image is traced ${preserves ? "counterclockwise" : "clockwise"}.`,
                `三角形 $(0, 0)$，$(1, 0)$，$(0, 1)$ 按逆时针方向走。它的像是三角形 $(0, 0)$，$(${a}, ${c})$，$(${b}, ${d})$。像的有向鞋带面积是 $\\frac{1}{2}(${paren(a)} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)}) = ${Q.of(det, 2).toLatex()}$。它为${signZh}，所以像按${preserves ? "逆时针" : "顺时针"}方向走。`,
              ),
            ),
          ),
          [
            t(
              `The determinant is $${det}$, which is ${signEn}, so orientation is ${preserves ? "kept" : "reversed"}.`,
              `行列式是 $${det}$，为${signZh}，所以定向${preserves ? "保持" : "反转"}。`,
            ),
            t(
              `The plane collapses onto a line only when the determinant is $0$, and here it is $${det}$.`,
              `只有行列式为 $0$ 时平面才会压缩成一条直线，而这里是 $${det}$。`,
            ),
            t("The sign of the determinant settles the question.", "行列式的符号就能回答这个问题。"),
          ],
        );
      },
    },
  ],
};

/** singularLinearTransformationsInThePlane covers transformations where det(A) = 0. */
export const singularLinearTransformationsInThePlane: TopicDef = {
  id: "singular-linear-transformations-in-the-plane",
  title: t("Singular Linear Transformations in the Plane", "奇异（退化）线性变换"),
  summary: t(
    "Examine singular linear transformations where det(A) = 0, causing the plane to collapse onto a line or point.",
    "研究行列式为零的奇异线性变换，分析其导致平面坍缩为直线或原点以及不可逆的性质。",
  ),
  prerequisites: ["area-scale-factors-of-linear-transformations"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.12"],
  intro: t(
    "You know that a linear transformation multiplies areas by $|\\det(A)|$. When $\\det(A) = 0$, every area becomes $0$: the plane is squashed onto a line through the origin, or onto the origin itself. Such a transformation is called singular. Different points land on the same image, so it cannot be undone.\n\nTake\n\n$$A = \\begin{pmatrix} 1 & 2 \\\\ 2 & 4 \\end{pmatrix}$$\n\nIts determinant is $1 \\cdot 4 - 2 \\cdot 2 = 0$. It sends $(x, y)$ to $(x + 2y, \\; 2x + 4y) = (x + 2y)(1, 2)$, so every image lies on the line $y = 2x$. The point $(2, -1)$ goes to $(2 - 2, \\; 4 - 4) = (0, 0)$, and so does $(0, 0)$. Two different points share an image, so $A$ has no inverse.",
    "你知道线性变换把面积乘 $|\\det(A)|$。当 $\\det(A) = 0$ 时，每个面积都变成 $0$：平面被压到一条过原点的直线上，或者压到原点。这样的变换叫奇异变换。不同的点落到同一个像上，所以它不能被抵消。\n\n取\n\n$$A = \\begin{pmatrix} 1 & 2 \\\\ 2 & 4 \\end{pmatrix}$$\n\n它的行列式是 $1 \\cdot 4 - 2 \\cdot 2 = 0$。它把 $(x, y)$ 变到 $(x + 2y, \\; 2x + 4y) = (x + 2y)(1, 2)$，所以每个像都在直线 $y = 2x$ 上。点 $(2, -1)$ 变到 $(2 - 2, \\; 4 - 4) = (0, 0)$，$(0, 0)$ 也变到这里。两个不同的点有同一个像，所以 $A$ 没有逆矩阵。",
  ),
  knowledgePoints: [
    {
      id: "geometric-collapse-under-singular-transformations",
      title: t("Dimension reduction and geometric collapse", "降维坍缩与面积为零"),
      explanation: t(
        "When $\\det(A) = 0$, the transformation is singular (degenerate). The area scaling factor is $|\\det(A)| = 0$, so every 2D region collapses to zero area: the entire plane is squashed onto a single line through the origin (or onto the origin if $A = 0$).\n\n> **Watch out.** The image is the line along the columns of $A$, through the origin. Its slope comes from a column, second entry over first, not the other way round.",
        "当 $\\det(A) = 0$ 时，变换是奇异的（退化的）。面积缩放因子 $|\\det(A)| = 0$，因此所有二维图形均坍缩为零面积：整个平面被压缩到一条过原点的直线上（若 $A = 0$ 则坍缩为原点）。\n\n> **注意。** 像是沿 $A$ 的列方向、过原点的直线。它的斜率由一列算出，是第二个元素除以第一个，不要颠倒。",
      ),
      generate(rng) {
        const u = rng.pick([-3, -2, -1, 1, 2, 3]);
        const v = rng.pick([-3, -2, -1, 1, 2, 3]);
        const k1 = rng.pick([1, 2, -1, -2]);
        const k2 = rng.pick([1, 2, -1, -2]);
        const A: Mat2 = [
          [k1 * u, k2 * u],
          [k1 * v, k2 * v],
        ];

        const slopeQ = Q.of(v, u);
        const lineEq = `y = ${poly([slopeQ, "x"])}`;
        const ALatex = mat2Latex(A);

        const w1 = `y = ${poly([slopeQ.neg(), "x"])}`;
        const w2 = `y = ${poly([Q.of(u, v), "x"])}`;
        const w3 = "The unit circle $x^2 + y^2 = 1$";
        const w4 = "The entire Cartesian plane $\\mathbb{R}^2$";

        const w3Zh = "单位圆 $x^2 + y^2 = 1$";
        const w4Zh = "整个二维笛卡尔平面 $\\mathbb{R}^2$";
        const slope = slopeQ.toLatex();

        return oneOf(
          rng,
          t(
            `The linear transformation with standard matrix $A = ${ALatex}$ is singular because $\\det(A) = 0$. Onto which geometric figure is the entire Cartesian plane $\\mathbb{R}^2$ mapped?`,
            `标准矩阵为 $A = ${ALatex}$ 的线性变换因 $\\det(A) = 0$ 而奇异。整个笛卡尔平面 $\\mathbb{R}^2$ 被映射到了哪种几何图形上？`,
          ),
          t(`A line with equation $${lineEq}$`, `直线 $${lineEq}$`),
          [t(`A line with equation $${w1}$`, `直线 $${w1}$`), t(`A line with equation $${w2}$`, `直线 $${w2}$`), t(w3, w3Zh), t(w4, w4Zh)],
          join(
            label(1, "Compare the columns", "比较两列"),
            k1 === k2
              ? t(
                  `Column $1$ is $(${k1 * u}, ${k1 * v})$, which is not zero. Column $2$ is the same vector.`,
                  `第 $1$ 列是 $(${k1 * u}, ${k1 * v})$，不是零向量。第 $2$ 列是同一个向量。`,
                )
              : t(
                  `Column $1$ is $(${k1 * u}, ${k1 * v})$, which is not zero. Column $2$ is $(${k2 * u}, ${k2 * v})$, which is $${Q.of(k2, k1).toLatex()}$ times column $1$.`,
                  `第 $1$ 列是 $(${k1 * u}, ${k1 * v})$，不是零向量。第 $2$ 列是 $(${k2 * u}, ${k2 * v})$，是第 $1$ 列的 $${Q.of(k2, k1).toLatex()}$ 倍。`,
                ),
            para,
            label(2, "Find the line", "求出直线"),
            t(
              `Every image $A\\mathbf{x}$ is $x_1$ times column $1$ plus $x_2$ times column $2$, so it is a multiple of column $1$. The plane goes onto the line through the origin in that direction. Its slope is $${k1 * v} \\div ${paren(k1 * u)} = ${slope}$. So the line is $${lineEq}$.`,
              `每个像 $A\\mathbf{x}$ 都是 $x_1$ 乘第 $1$ 列加 $x_2$ 乘第 $2$ 列，所以是第 $1$ 列的倍数。平面被压到过原点、沿这个方向的直线上。它的斜率是 $${k1 * v} \\div ${paren(k1 * u)} = ${slope}$。所以直线是 $${lineEq}$。`,
            ),
            checked(
              t(
                `Both columns must lie on the line. For column $1$, $x = ${k1 * u}$ gives $y = ${qp(slopeQ)} \\cdot ${paren(k1 * u)} = ${k1 * v}$. For column $2$, $x = ${k2 * u}$ gives $y = ${qp(slopeQ)} \\cdot ${paren(k2 * u)} = ${k2 * v}$. These are their second entries.`,
                `两列都必须在这条直线上。对第 $1$ 列，$x = ${k1 * u}$ 时 $y = ${qp(slopeQ)} \\cdot ${paren(k1 * u)} = ${k1 * v}$。对第 $2$ 列，$x = ${k2 * u}$ 时 $y = ${qp(slopeQ)} \\cdot ${paren(k2 * u)} = ${k2 * v}$。正是它们的第二个元素。`,
              ),
            ),
          ),
          [
            t("The sign of the slope is wrong.", "斜率的符号错了。"),
            t(
              "This slope is upside down. The slope is the second entry of a column over the first.",
              "斜率颠倒了。斜率是一列的第二个元素除以第一个。",
            ),
            t(
              "A linear map sends the plane onto a plane, a line through the origin or the origin. It can never give a circle.",
              "线性映射把平面变成平面、过原点的直线或原点，不可能得到圆。",
            ),
            t(
              "Covering the whole plane needs $\\det(A) \\ne 0$, and here $\\det(A) = 0$.",
              "要盖住整个平面需要 $\\det(A) \\ne 0$，而这里 $\\det(A) = 0$。",
            ),
          ],
        );
      },
    },
    {
      id: "non-invertibility-and-kernel-of-singular-transformations",
      title: t("Non-invertibility and non-trivial kernel", "奇异变换的不可逆性与非零核"),
      explanation: t(
        "A singular matrix $A$ has a non-trivial kernel (nullspace): there exist nonzero vectors $\\mathbf{v} \\ne \\mathbf{0}$ such that $A\\mathbf{v} = \\mathbf{0}$. Because distinct vectors are squashed to the same point, the transformation is not one-to-one and cannot be inverted.\n\n> **Watch out.** A vector in the kernel must make every row product zero, not just one. The zero vector always works, so look for a nonzero one.",
        "奇异矩阵 $A$ 拥有非平凡的核（零空间）：存在非零向量 $\\mathbf{v} \\ne \\mathbf{0}$ 满足 $A\\mathbf{v} = \\mathbf{0}$。由于不同向量被压缩至同一点，该变换不是单射，因而不可逆。\n\n> **注意。** 核里的向量要让每一行的乘积都为零，不只是一行。零向量总是满足，所以要找的是非零向量。",
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3, -1, -2, -3]);
        const b = rng.pick([1, 2, 3, 4, -1, -2, -3]);
        const m = rng.pick([2, -2, 3, -3, 1, -1]);
        const c = a * m;
        const d = b * m;
        const A: Mat2 = [
          [a, b],
          [c, d],
        ];

        const vKer: Vec2 = [-b, a];
        const rightLatex = vec2Latex(vKer);

        const w1: Vec2 = [a, b];
        const w2: Vec2 = [b, a];
        const w3: Vec2 = a + b === 0 ? [1, 0] : [1, 1];
        const w4: Vec2 = a * a === b * b ? [-a, -b] : [-a, b];

        const ALatex = mat2Latex(A);
        /** missesRow1 says that row 1 of A times a wrong vector is not zero. */
        const missesRow1 = (w: Vec2) =>
          t(`Row $1$ of $A$ times it is $${dot(A[0], w)}$, not $0$.`, `$A$ 的第 $1$ 行乘它得 $${dot(A[0], w)}$，不是 $0$。`);

        return oneOf(
          rng,
          t(
            `Which of the following nonzero vectors is mapped to the origin $\\mathbf{0} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix}$ by the singular matrix $A = ${ALatex}$?`,
            `下列哪一个非零向量在奇异矩阵 $A = ${ALatex}$ 的作用下被映射为零向量 $\\mathbf{0} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix}$？`,
          ),
          t(`$${rightLatex}$`, `$${rightLatex}$`),
          [
            t(`$${vec2Latex(w1)}$`, `$${vec2Latex(w1)}$`),
            t(`$${vec2Latex(w2)}$`, `$${vec2Latex(w2)}$`),
            t(`$${vec2Latex(w3)}$`, `$${vec2Latex(w3)}$`),
            t(`$${vec2Latex(w4)}$`, `$${vec2Latex(w4)}$`),
          ],
          join(
            label(1, "Compare the rows", "比较两行"),
            t(
              `Row $2$, $(${c}, ${d})$, is $${m}$ times row $1$, $(${a}, ${b})$. So $A\\mathbf{v} = \\mathbf{0}$ needs only $${poly([a, "x"], [b, "y"])} = 0$.`,
              `第 $2$ 行 $(${c}, ${d})$ 是第 $1$ 行 $(${a}, ${b})$ 的 $${m}$ 倍。所以 $A\\mathbf{v} = \\mathbf{0}$ 只需要 $${poly([a, "x"], [b, "y"])} = 0$。`,
            ),
            para,
            label(2, "Solve the one equation", "解这一个方程"),
            t(
              `Swapping the coefficients and changing one sign gives $(${-b}, ${a})$, since $${dot(A[0], vKer)}$. So $\\mathbf{v} = ${rightLatex}$.`,
              `把两个系数交换并改变一个符号得 $(${-b}, ${a})$，因为 $${dot(A[0], vKer)}$。所以 $\\mathbf{v} = ${rightLatex}$。`,
            ),
            checked(
              t(
                `Multiply by the whole matrix. Row $1$ gives $${dot(A[0], vKer)}$. Row $2$ gives $${dot(A[1], vKer)}$. Both are $0$, so $A\\mathbf{v} = \\mathbf{0}$.`,
                `用整个矩阵去乘。第 $1$ 行得 $${dot(A[0], vKer)}$。第 $2$ 行得 $${dot(A[1], vKer)}$。两个都是 $0$，所以 $A\\mathbf{v} = \\mathbf{0}$。`,
              ),
            ),
          ),
          [missesRow1(w1), missesRow1(w2), missesRow1(w3), missesRow1(w4)],
        );
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// ALL TOPICS EXPORT ARRAY
// ════════════════════════════════════════════════════════════════════════════

/** precalculusLinearTransformationTopics contains all 17 topics of Precalculus Unit 6 Part 2. */
export const precalculusLinearTransformationTopics: readonly TopicDef[] = [
  introductionToTheInverseOfAMatrix,
  inversesOf2x2Matrices,
  calculatingTheInverseOfA3x3MatrixUsingTheCofactorMethod,
  solving2x2SystemsOfEquationsUsingInverseMatrices,
  solvingSystemsOfEquationsUsingInverseMatrices,
  introductionToLinearTransformations,
  theStandardMatrixOfALinearTransformation,
  linearTransformationsOfPointsAndLinesInThePlane,
  linearTransformationsOfObjectsInThePlane,
  dilationsAndReflectionsAsLinearTransformations,
  shearAndStretchAsLinearTransformations,
  rightAngleRotationsAsLinearTransformations,
  rotationsAsLinearTransformations,
  combiningLinearTransformationsUsing2x2Matrices,
  invertingLinearTransformations,
  areaScaleFactorsOfLinearTransformations,
  singularLinearTransformationsInThePlane,
];
