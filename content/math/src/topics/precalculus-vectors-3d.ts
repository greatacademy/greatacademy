import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { paren, poly, Q } from "@ga/subject-math";
import { precalculusDrawings2 } from "../explanation-drawings-precalculus-2.ts";
import { precalculusDrawings4 } from "../explanation-drawings-precalculus-4.ts";
import { remainingDrawings7 } from "../explanation-drawings-remaining-7.ts";
import { choiceProblem, numberProblem, pointProblem, steps } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";

// Precalculus unit 5: Vectors (Part 2: 3D Vectors, Dot Product, and Cross Product,
// modules 5.18 to 5.20).

/** Vec3 is a vector in space by its three components. */
type Vec3 = readonly [number, number, number];
/** Vec2 is a vector in the plane by its two components. */
type Vec2 = readonly [number, number];

/** add3 adds two vectors in space. */
const add3 = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
/** sub3 subtracts the second vector in space from the first. */
const sub3 = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
/** smul3 multiplies a vector in space by a number. */
const smul3 = (k: number, a: Vec3): Vec3 => [k * a[0], k * a[1], k * a[2]];
/** dot3 is the dot product of two vectors in space. */
const dot3 = (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
/** cross3 is the cross product of two vectors in space. */
const cross3 = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
/** dot2 is the dot product of two vectors in the plane. */
const dot2 = (a: Vec2, b: Vec2): number => a[0] * b[0] + a[1] * b[1];
/** det3 is the scalar triple product a · (b × c). */
const det3 = (a: Vec3, b: Vec3, c: Vec3): number => dot3(a, cross3(b, c));
/** magSq3 is the square of the magnitude of a vector in space. */
const magSq3 = (a: Vec3): number => a[0] * a[0] + a[1] * a[1] + a[2] * a[2];

/** vec3Latex writes a vector in space in angle brackets. */
function vec3Latex(v: Vec3): string {
  return `\\langle ${v[0]}, ${v[1]}, ${v[2]} \\rangle`;
}

/** vec2Latex writes a vector in the plane in angle brackets. */
function vec2Latex(v: Vec2): string {
  return `\\langle ${v[0]}, ${v[1]} \\rangle`;
}

/** qVec3Latex writes a vector in space with fraction components in angle brackets. */
function qVec3Latex(v: readonly [Q, Q, Q]): string {
  return `\\left\\langle ${v[0].toLatex()}, ${v[1].toLatex()}, ${v[2].toLatex()} \\right\\rangle`;
}

/** basisLatex writes a vector in space as a combination of i, j and k, leaving out the zero terms. */
function basisLatex(v: Vec3): string {
  const parts: string[] = [];
  const basis = ["\\mathbf{i}", "\\mathbf{j}", "\\mathbf{k}"];
  for (let i = 0; i < 3; i++) {
    const c = v[i]!;
    if (c === 0) continue;
    const b = basis[i]!;
    if (parts.length === 0) {
      if (c === 1) parts.push(b);
      else if (c === -1) parts.push(`-${b}`);
      else parts.push(`${c}${b}`);
    } else {
      if (c === 1) parts.push(`+ ${b}`);
      else if (c === -1) parts.push(`- ${b}`);
      else if (c > 0) parts.push(`+ ${c}${b}`);
      else parts.push(`- ${-c}${b}`);
    }
  }
  return parts.length === 0 ? "\\mathbf{0}" : parts.join(" ");
}

/** Step is one step of a solution: its title in English and Chinese, what it does, and the lines it displays. */
type Step = readonly [title: readonly [en: string, zh: string], say: Text, lines?: readonly string[]];

/** walked writes a solution as labelled steps followed by a check, in each locale. */
function walked(parts: readonly Step[], check: Text): Text {
  const write = (locale: keyof Text) =>
    parts
      .map(
        ([[en, zh], say, lines = []], i) =>
          `${stepLabel(i + 1, en, zh)[locale]} ${say[locale]}${lines.length > 0 ? steps(...lines) : "\n\n"}`,
      )
      .join("") + (locale === "en" ? `**Check.** ${check.en}` : `**检验。** ${check["zh-CN"]}`);
  return t(write("en"), write("zh-CN"));
}

/** why pairs a wrong option with what is wrong with it in English and Chinese. */
const why = (option: Text, en: string, zh: string): Reason => [option.en, en, zh];

/** oneOf builds a multiple-choice problem with options shuffled and deduplicated, giving the reasons for the wrong ones. */
function oneOf(rng: Rng, prompt: Text, right: Text, wrong: readonly Text[], solution: Text, reasons: readonly Reason[] = []): Problem {
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
  const problem = choiceProblem({ prompt, options: order.map((i) => options[i]!), correct: order.indexOf(0), solution });
  return reasons.length > 0 ? reasoned(problem, reasons) : problem;
}

/** pythagoreanQuadruples lists whole numbers a, b, c and L with a^2 + b^2 + c^2 = L^2. */
const pythagoreanQuadruples: readonly (readonly [number, number, number, number])[] = [
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
  [4, 12, 13, 19],
  [1, 6, 18, 19],
  [3, 6, 22, 23],
  [6, 13, 18, 23],
  [2, 10, 25, 27],
  [7, 14, 22, 27],
];

/** pickQuadruple picks a vector with whole components and a whole magnitude, with the order and signs of its components shuffled. */
function pickQuadruple(rng: Rng): [Vec3, number] {
  const quad = rng.pick(pythagoreanQuadruples);
  const [a, b, c, L] = quad;
  const perm = rng.shuffle([a, b, c]) as [number, number, number];
  const sx = rng.pick([1, -1]);
  const sy = rng.pick([1, -1]);
  const sz = rng.pick([1, -1]);
  return [[perm[0] * sx, perm[1] * sy, perm[2] * sz], L];
}

/** integerCrossProductPairs lists pairs of vectors whose cross product has a whole magnitude, with that magnitude. */
const integerCrossProductPairs: readonly (readonly [Vec3, Vec3, number])[] = [
  [[-3, -3, 0], [-3, -2, -2], 9],
  [[-3, -3, 0], [-3, -2, 0], 3],
  [[-3, -2, -2], [-3, -3, 0], 9],
  [[-3, -2, -2], [-3, -1, 0], 7],
  [[-3, -2, 0], [-3, -3, 0], 3],
  [[-3, -2, 0], [-3, -1, 0], 3],
  [[-3, -2, 2], [-3, -3, 0], 9],
  [[-3, -2, 2], [-3, -1, 0], 7],
  [[-3, -1, 0], [-3, -3, 0], 6],
  [[-3, -1, 0], [-3, -2, -2], 7],
  [[-3, 0, -3], [-3, -2, -2], 9],
  [[-3, 0, -3], [-3, 0, -2], 3],
  [[-3, 0, -2], [-3, -2, 2], 14],
  [[-3, 0, -2], [-3, -1, 0], 7],
  [[-3, 0, -1], [-3, -2, -2], 7],
  [[-3, 0, -1], [-3, -2, 0], 7],
  [[-3, 0, 1], [-3, -2, -2], 11],
  [[-3, 0, 1], [-3, -2, 0], 7],
  [[-3, 0, 2], [-3, -2, -2], 14],
  [[-3, 0, 2], [-3, -1, 0], 7],
  [[-3, 0, 3], [-3, -2, 2], 9],
  [[-3, 0, 3], [-3, 0, -3], 18],
  [[-3, 1, 0], [-3, -3, 0], 12],
  [[-3, 1, 0], [-3, -2, -2], 11],
  [[-3, 2, -2], [-3, -2, 0], 14],
  [[-3, 2, -2], [-3, -1, 0], 11],
  [[-3, 2, 0], [-3, -3, 0], 15],
  [[-3, 2, 0], [-3, -2, -2], 14],
  [[-3, 2, 2], [-3, -2, 0], 14],
  [[-3, 2, 2], [-3, -1, 0], 11],
  [[-3, 3, 0], [-3, -3, 0], 18],
  [[-3, 3, 0], [-3, -2, 0], 15],
  [[-2, -3, -2], [-3, -3, 0], 9],
  [[-2, -3, -2], [-3, -2, 2], 15],
  [[-2, -3, 0], [-3, -3, 0], 3],
  [[-2, -3, 0], [-3, -2, 0], 5],
];

/** pickIntegerCrossProduct picks a pair from integerCrossProductPairs with shuffled signs and order, and their cross product. */
function pickIntegerCrossProduct(rng: Rng): [Vec3, Vec3, Vec3, number] {
  const item = rng.pick(integerCrossProductPairs);
  const [u, v, L] = item;
  const sx = rng.pick([1, -1]);
  const sy = rng.pick([1, -1]);
  const sz = rng.pick([1, -1]);
  const uSigned: Vec3 = [u[0] * sx, u[1] * sy, u[2] * sz];
  const vSigned: Vec3 = [v[0] * sx, v[1] * sy, v[2] * sz];
  const swap = rng.bool();
  const uFinal = swap ? vSigned : uSigned;
  const vFinal = swap ? uSigned : vSigned;
  const cp = cross3(uFinal, vFinal);
  return [uFinal, vFinal, cp, L];
}

/** specialAnglePairs lists pairs of vectors at a special angle, with the angle, its cosine and plausible wrong angles. */
const specialAnglePairs: readonly {
  readonly u: Vec3;
  readonly v: Vec3;
  readonly degNum: number;
  readonly cosStr: string;
  readonly wrongs: readonly number[];
}[] = [
  {
    u: [1, 1, 0],
    v: [1, 0, 1],
    degNum: 60,
    cosStr: "\\frac{1}{2}",
    wrongs: [30, 45, 90, 120],
  },
  {
    u: [0, 1, 1],
    v: [1, 1, 0],
    degNum: 60,
    cosStr: "\\frac{1}{2}",
    wrongs: [30, 45, 90, 120],
  },
  {
    u: [1, -1, 0],
    v: [1, 0, -1],
    degNum: 60,
    cosStr: "\\frac{1}{2}",
    wrongs: [30, 45, 90, 120],
  },
  {
    u: [1, 1, 0],
    v: [-1, 0, 1],
    degNum: 120,
    cosStr: "-\\frac{1}{2}",
    wrongs: [60, 90, 135, 150],
  },
  {
    u: [1, 0, 1],
    v: [0, -1, -1],
    degNum: 120,
    cosStr: "-\\frac{1}{2}",
    wrongs: [60, 90, 135, 150],
  },
  {
    u: [1, 0, 0],
    v: [1, 1, 0],
    degNum: 45,
    cosStr: "\\frac{\\sqrt{2}}{2}",
    wrongs: [30, 60, 90, 135],
  },
  {
    u: [0, 1, 0],
    v: [0, 1, 1],
    degNum: 45,
    cosStr: "\\frac{\\sqrt{2}}{2}",
    wrongs: [30, 60, 90, 135],
  },
  {
    u: [0, 0, 1],
    v: [1, 0, 1],
    degNum: 45,
    cosStr: "\\frac{\\sqrt{2}}{2}",
    wrongs: [30, 60, 90, 135],
  },
  {
    u: [1, 0, 0],
    v: [-1, 1, 0],
    degNum: 135,
    cosStr: "-\\frac{\\sqrt{2}}{2}",
    wrongs: [45, 90, 120, 150],
  },
  {
    u: [0, 1, 0],
    v: [0, -1, 1],
    degNum: 135,
    cosStr: "-\\frac{\\sqrt{2}}{2}",
    wrongs: [45, 90, 120, 150],
  },
  {
    u: [0, 0, 1],
    v: [1, 0, -1],
    degNum: 135,
    cosStr: "-\\frac{\\sqrt{2}}{2}",
    wrongs: [45, 90, 120, 150],
  },
  {
    u: [1, 2, 2],
    v: [2, 1, -2],
    degNum: 90,
    cosStr: "0",
    wrongs: [0, 45, 60, 180],
  },
  {
    u: [2, 3, 6],
    v: [6, -2, -1],
    degNum: 90,
    cosStr: "0",
    wrongs: [45, 60, 120, 180],
  },
  {
    u: [1, 0, 0],
    v: [0, 1, 0],
    degNum: 90,
    cosStr: "0",
    wrongs: [0, 45, 60, 180],
  },
  {
    u: [0, 1, 0],
    v: [0, 0, 1],
    degNum: 90,
    cosStr: "0",
    wrongs: [0, 45, 60, 180],
  },
  {
    u: [1, -1, 0],
    v: [1, 1, 0],
    degNum: 90,
    cosStr: "0",
    wrongs: [0, 45, 60, 180],
  },
  {
    u: [2, -1, 3],
    v: [4, -2, 6],
    degNum: 0,
    cosStr: "1",
    wrongs: [45, 60, 90, 180],
  },
  {
    u: [1, 2, 3],
    v: [2, 4, 6],
    degNum: 0,
    cosStr: "1",
    wrongs: [45, 60, 90, 180],
  },
  {
    u: [2, -1, 3],
    v: [-4, 2, -6],
    degNum: 180,
    cosStr: "-1",
    wrongs: [0, 90, 120, 135],
  },
  {
    u: [1, 2, 3],
    v: [-2, -4, -6],
    degNum: 180,
    cosStr: "-1",
    wrongs: [0, 90, 120, 135],
  },
];

/** rootLatex writes the square root of a positive integer in simplest form, as r√f, or as r when the integer is a perfect square. */
function rootLatex(P: number): string {
  let r = 1;
  for (let d = 2; d * d <= P; d++) {
    if (P % (d * d) === 0) r = d;
  }
  const f = P / (r * r);
  if (f === 1) return String(r);
  return `${r === 1 ? "" : r}\\sqrt{${f}}`;
}

// ─── Module 5.18. Vectors in 3D Cartesian Coordinates ────────────────────────

// ─── 5.18.1 Three-Dimensional Vectors in Component Form ──────────────────────

/** threeDimensionalVectorsInComponentForm introduces 3D component form, standard basis, and displacement vectors. */
export const threeDimensionalVectorsInComponentForm: TopicDef = {
  id: "three-dimensional-vectors-in-component-form",
  title: t("Three-Dimensional Vectors in Component Form", "三维空间向量的坐标表示"),
  summary: t(
    "Express 3D vectors in component form and standard basis form, and find displacement vectors between two points in space.",
    "用坐标形式与标准基底表示三维空间向量，并求空间中两点间的位移向量。",
  ),
  prerequisites: ["two-dimensional-vectors-expressed-in-component-form"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.A.1", "CCSS.HSN.VM.A.2"],
  intro: t(
    `In the plane a vector has two components, $\\langle 3, -2 \\rangle = 3\\mathbf{i} - 2\\mathbf{j}$: how far it goes along $x$ and along $y$. Space adds a third axis, $z$, and a third unit vector $\\mathbf{k}$ along it. The arrow from $A(1, 2, 0)$ to $B(4, 0, 5)$ goes $3$ along $x$, $-2$ along $y$ and $5$ along $z$, so

$$\\vec{AB} = \\langle 3, -2, 5 \\rangle = 3\\mathbf{i} - 2\\mathbf{j} + 5\\mathbf{k}$$

Check: starting at $A$ and moving by these components reaches $(1 + 3, 2 - 2, 0 + 5) = (4, 0, 5)$, which is $B$.

In this lesson we write vectors in space in component form and with $\\mathbf{i}$, $\\mathbf{j}$ and $\\mathbf{k}$, find the vector between two points, and find the length of a vector from its three components.`,
    `平面中的向量有两个分量，$\\langle 3, -2 \\rangle = 3\\mathbf{i} - 2\\mathbf{j}$：沿 $x$ 走多少，沿 $y$ 走多少。空间多了第三条轴 $z$，以及沿它的第三个单位向量 $\\mathbf{k}$。从 $A(1, 2, 0)$ 到 $B(4, 0, 5)$ 的箭头沿 $x$ 走 $3$，沿 $y$ 走 $-2$，沿 $z$ 走 $5$，所以

$$\\vec{AB} = \\langle 3, -2, 5 \\rangle = 3\\mathbf{i} - 2\\mathbf{j} + 5\\mathbf{k}$$

检验：从 $A$ 出发按这些分量移动，到达 $(1 + 3, 2 - 2, 0 + 5) = (4, 0, 5)$，正是 $B$。

这节课我们用坐标形式和 $\\mathbf{i}$、$\\mathbf{j}$、$\\mathbf{k}$ 表示空间向量，求两点之间的向量，并由三个分量求向量的长度。`,
  ),
  knowledgePoints: [
    {
      id: "components-and-standard-basis-in-3d",
      title: t("Components and standard basis in 3D", "三维向量的坐标与标准基底表示"),
      explanation: t(
        "In 3D Cartesian coordinates, a vector can be written in component form as $\\mathbf{v} = \\langle v_1, v_2, v_3 \\rangle$, or as a linear combination of the standard unit basis vectors $\\mathbf{i} = \\langle 1, 0, 0 \\rangle$, $\\mathbf{j} = \\langle 0, 1, 0 \\rangle$, and $\\mathbf{k} = \\langle 0, 0, 1 \\rangle$:\n\n$$\\mathbf{v} = v_1\\mathbf{i} + v_2\\mathbf{j} + v_3\\mathbf{k}$$\n\nFor $\\mathbf{v} = 4\\mathbf{i} - \\mathbf{k}$, no $\\mathbf{j}$ appears, so the $y$-component is $0$ and $\\mathbf{v} = \\langle 4, 0, -1 \\rangle$. Check:\n\n$$4\\langle 1, 0, 0 \\rangle - \\langle 0, 0, 1 \\rangle = \\langle 4, 0, -1 \\rangle$$\n\n> **Watch out.** Each basis vector has its own place: the coefficient of $\\mathbf{j}$ is always the second component, whatever order the terms are written in. A missing term is a component of $0$, and $-\\mathbf{k}$ means a component of $-1$.",
        "在三维空间直角坐标系中，向量可以表示为坐标分量形式 $\\mathbf{v} = \\langle v_1, v_2, v_3 \\rangle$，也可以表示为标准单位基向量 $\\mathbf{i} = \\langle 1, 0, 0 \\rangle$、$\\mathbf{j} = \\langle 0, 1, 0 \\rangle$ 与 $\\mathbf{k} = \\langle 0, 0, 1 \\rangle$ 的线性组合：\n\n$$\\mathbf{v} = v_1\\mathbf{i} + v_2\\mathbf{j} + v_3\\mathbf{k}$$\n\n对 $\\mathbf{v} = 4\\mathbf{i} - \\mathbf{k}$，式中没有 $\\mathbf{j}$，所以 $y$ 分量是 $0$，$\\mathbf{v} = \\langle 4, 0, -1 \\rangle$。检验：\n\n$$4\\langle 1, 0, 0 \\rangle - \\langle 0, 0, 1 \\rangle = \\langle 4, 0, -1 \\rangle$$\n\n> **注意。** 每个基向量有自己的位置：$\\mathbf{j}$ 的系数总是第二个分量，不管各项按什么顺序书写。缺少的项对应分量 $0$，$-\\mathbf{k}$ 对应分量 $-1$。",
      ),
      generate(rng) {
        const hasZero = rng.bool();
        const x = rng.pick([-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7]);
        const y = hasZero ? 0 : rng.pick([-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7]);
        const z = rng.pick([-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7]);
        const v: Vec3 = [x, y, z];
        const bStr = basisLatex(v);
        const missing =
          y === 0
            ? t(
                " No $\\mathbf{j}$ term appears, so the coefficient of $\\mathbf{j}$ is $0$.",
                "式中没有 $\\mathbf{j}$ 项，所以 $\\mathbf{j}$ 的系数是 $0$。",
              )
            : t("", "");

        return pointProblem({
          prompt: t(
            `Write the vector $\\mathbf{v} = ${bStr}$ in component form $\\langle x, y, z \\rangle$.`,
            `将向量 $\\mathbf{v} = ${bStr}$ 写成坐标分量形式 $\\langle x, y, z \\rangle$。`,
          ),
          answer: v,
          vars: ["x", "y", "z"],
          vector: true,
          wrong: [
            [x, -y, z],
            [x, z, y],
            [-x, y, -z],
            [z, y, x],
          ],
          solution: walked(
            [
              [
                ["Read the coefficients", "读出系数"],
                t(
                  `The coefficients of $\\mathbf{i}$, $\\mathbf{j}$ and $\\mathbf{k}$ are $${x}$, $${y}$ and $${z}$, each with its sign.${missing.en}`,
                  `$\\mathbf{i}$、$\\mathbf{j}$、$\\mathbf{k}$ 的系数连同符号分别是 $${x}$、$${y}$、$${z}$。${missing["zh-CN"]}`,
                ),
              ],
              [
                ["Write them in order", "按顺序写出"],
                t(
                  "The coefficient of $\\mathbf{i}$ comes first, then $\\mathbf{j}$, then $\\mathbf{k}$:",
                  "先写 $\\mathbf{i}$ 的系数，再写 $\\mathbf{j}$ 的，最后写 $\\mathbf{k}$ 的：",
                ),
                [`\\mathbf{v} = ${vec3Latex(v)}`],
              ],
            ],
            t(
              `Rebuilding $\\mathbf{v}$ from the basis vectors gives it back:\n\n$$${x}\\langle 1, 0, 0 \\rangle + ${paren(y)}\\langle 0, 1, 0 \\rangle + ${paren(z)}\\langle 0, 0, 1 \\rangle = ${vec3Latex(v)}$$`,
              `用基向量重新组合 $\\mathbf{v}$，得到的正是它：\n\n$$${x}\\langle 1, 0, 0 \\rangle + ${paren(y)}\\langle 0, 1, 0 \\rangle + ${paren(z)}\\langle 0, 0, 1 \\rangle = ${vec3Latex(v)}$$`,
            ),
          ),
        });
      },
    },
    {
      id: "displacement-vector-between-two-points-in-3d",
      title: t("Displacement vector between two points in 3D", "空间中两点间的位移向量"),
      explanation: t(
        "Given initial point $A(x_1, y_1, z_1)$ and terminal point $B(x_2, y_2, z_2)$ in three dimensions, the displacement vector from $A$ to $B$ is:\n\n$$\\vec{AB} = \\langle x_2 - x_1, \\; y_2 - y_1, \\; z_2 - z_1 \\rangle$$\n\nFrom $A(1, -2, 3)$ to $B(4, 0, -1)$:\n\n$$\\vec{AB} = \\langle 4 - 1, \\; 0 - (-2), \\; -1 - 3 \\rangle = \\langle 3, 2, -4 \\rangle$$\n\nCheck: $A$ moved by $\\langle 3, 2, -4 \\rangle$ lands at $(4, 0, -1)$, which is $B$.\n\n> **Watch out.** Subtract terminal minus initial, $B - A$. Taking $A - B$ gives the opposite vector $\\vec{BA}$, and subtracting a negative coordinate adds it: $0 - (-2) = 2$.",
        "已知三维空间中起点 $A(x_1, y_1, z_1)$ 与终点 $B(x_2, y_2, z_2)$，从 $A$ 到 $B$ 的位移向量为：\n\n$$\\vec{AB} = \\langle x_2 - x_1, \\; y_2 - y_1, \\; z_2 - z_1 \\rangle$$\n\n从 $A(1, -2, 3)$ 到 $B(4, 0, -1)$：\n\n$$\\vec{AB} = \\langle 4 - 1, \\; 0 - (-2), \\; -1 - 3 \\rangle = \\langle 3, 2, -4 \\rangle$$\n\n检验：$A$ 按 $\\langle 3, 2, -4 \\rangle$ 移动后落在 $(4, 0, -1)$，正是 $B$。\n\n> **注意。** 用终点减起点，即 $B - A$。算成 $A - B$ 得到的是相反向量 $\\vec{BA}$；减去负的坐标等于加上它：$0 - (-2) = 2$。",
      ),
      generate(rng) {
        const x1 = rng.pick([-8, -6, -4, -2, 0, 2, 4, 6, 8]);
        const y1 = rng.pick([-7, -5, -3, -1, 1, 3, 5, 7]);
        const z1 = rng.pick([-6, -3, -1, 2, 4, 5]);
        const dx = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const dy = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const dz = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const x2 = x1 + dx;
        const y2 = y1 + dy;
        const z2 = z1 + dz;
        const ansVec: Vec3 = [dx, dy, dz];

        return pointProblem({
          prompt: t(
            `Find the component form of the displacement vector $\\vec{AB}$ from initial point $A(${x1}, ${y1}, ${z1})$ to terminal point $B(${x2}, ${y2}, ${z2})$.`,
            `求从起点 $A(${x1}, ${y1}, ${z1})$ 到终点 $B(${x2}, ${y2}, ${z2})$ 的位移向量 $\\vec{AB}$ 的坐标表示。`,
          ),
          answer: ansVec,
          vars: ["x", "y", "z"],
          vector: true,
          wrong: [
            [-dx, -dy, -dz],
            [dx, -dy, dz],
            [dx, dy, -dz],
            [x1 + x2, y1 + y2, z1 + z2],
          ],
          solution: walked(
            [
              [
                ["Name the two ends", "认清两端"],
                t(
                  `The arrow starts at $A(${x1}, ${y1}, ${z1})$ and ends at $B(${x2}, ${y2}, ${z2})$, so each component is a coordinate of $B$ minus the same coordinate of $A$.`,
                  `箭头从 $A(${x1}, ${y1}, ${z1})$ 出发，到 $B(${x2}, ${y2}, ${z2})$ 结束，所以每个分量都是 $B$ 的坐标减去 $A$ 的同一坐标。`,
                ),
              ],
              [
                ["Subtract", "相减"],
                t("Subtract component by component:", "逐个分量相减："),
                [
                  `\\vec{AB} = \\langle ${x2} - ${paren(x1)}, \\; ${y2} - ${paren(y1)}, \\; ${z2} - ${paren(z1)} \\rangle = ${vec3Latex(ansVec)}`,
                ],
              ],
            ],
            t(
              `Moving $A$ by $\\vec{AB}$ must land on $B$:\n\n$$(${x1} + ${paren(dx)}, \\; ${y1} + ${paren(dy)}, \\; ${z1} + ${paren(dz)}) = (${x2}, ${y2}, ${z2})$$`,
              `把 $A$ 按 $\\vec{AB}$ 移动，必须落在 $B$ 上：\n\n$$(${x1} + ${paren(dx)}, \\; ${y1} + ${paren(dy)}, \\; ${z1} + ${paren(dz)}) = (${x2}, ${y2}, ${z2})$$`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── 5.18.2 Addition and Scalar Multiplication in 3D ────────────────────────

/** additionAndScalarMultiplicationOfCartesianVectorsIn3D covers 3D vector arithmetic. */
export const additionAndScalarMultiplicationOfCartesianVectorsIn3D: TopicDef = {
  id: "addition-and-scalar-multiplication-of-cartesian-vectors-in-3d",
  title: t("Addition and Scalar Multiplication of Cartesian Vectors in 3D", "三维空间向量的加法与数乘运算"),
  summary: t(
    "Add, subtract, and scale Cartesian vectors in three dimensions, and evaluate 3D linear combinations.",
    "进行三维空间向量的加法、减法与数乘运算，并求解三维向量的线性组合。",
  ),
  prerequisites: ["three-dimensional-vectors-in-component-form"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.B.4", "CCSS.HSN.VM.B.5"],
  intro: t(
    `A vector in space is a list of three components, one for each axis. Moving by $\\langle 1, 2, 0 \\rangle$ and then by $\\langle 3, -1, 4 \\rangle$ moves $1 + 3$ along $x$, $2 - 1$ along $y$ and $0 + 4$ along $z$:

$$\\langle 1, 2, 0 \\rangle + \\langle 3, -1, 4 \\rangle = \\langle 4, 1, 4 \\rangle$$

Moving twice by $\\langle 1, 2, 0 \\rangle$ doubles every component, so $2\\langle 1, 2, 0 \\rangle = \\langle 2, 4, 0 \\rangle$.

Check: undoing the second move returns to the first, since $\\langle 4, 1, 4 \\rangle - \\langle 3, -1, 4 \\rangle = \\langle 1, 2, 0 \\rangle$.

In this lesson we add, subtract and scale vectors in space, form linear combinations, and solve a vector equation for a scalar and a missing component.`,
    `空间向量是三个分量组成的一列数，每条轴一个。先按 $\\langle 1, 2, 0 \\rangle$ 移动，再按 $\\langle 3, -1, 4 \\rangle$ 移动，沿 $x$ 共走 $1 + 3$，沿 $y$ 共走 $2 - 1$，沿 $z$ 共走 $0 + 4$：

$$\\langle 1, 2, 0 \\rangle + \\langle 3, -1, 4 \\rangle = \\langle 4, 1, 4 \\rangle$$

按 $\\langle 1, 2, 0 \\rangle$ 移动两次，每个分量都加倍，所以 $2\\langle 1, 2, 0 \\rangle = \\langle 2, 4, 0 \\rangle$。

检验：撤销第二次移动就回到第一次的结果，因为 $\\langle 4, 1, 4 \\rangle - \\langle 3, -1, 4 \\rangle = \\langle 1, 2, 0 \\rangle$。

这节课我们对空间向量做加法、减法和数乘，求线性组合，并由向量方程解出标量和缺少的分量。`,
  ),
  knowledgePoints: [
    {
      id: "addition-and-subtraction-of-3d-vectors",
      title: t("Addition and subtraction of 3D vectors", "三维空间向量的加法与减法"),
      explanation: t(
        "Three-dimensional vectors are added and subtracted exactly as in the plane, one component at a time, with a third component for the new direction. Vector addition and subtraction are performed component-wise in three dimensions:\n\n$$\\langle u_1, u_2, u_3 \\rangle \\pm \\langle v_1, v_2, v_3 \\rangle = \\langle u_1 \\pm v_1, \\; u_2 \\pm v_2, \\; u_3 \\pm v_3 \\rangle$$\n\nFor example:\n\n$$\\langle 2, -1, 5 \\rangle - \\langle 4, 3, -2 \\rangle = \\langle 2 - 4, \\; -1 - 3, \\; 5 - (-2) \\rangle = \\langle -2, -4, 7 \\rangle$$\n\nCheck: adding back $\\langle 4, 3, -2 \\rangle$ to $\\langle -2, -4, 7 \\rangle$ gives $\\langle 2, -1, 5 \\rangle$.\n\n> **Watch out.** Subtracting a negative component adds it, as in $5 - (-2) = 7$. Order matters for subtraction: $\\mathbf{v} - \\mathbf{u}$ is the opposite of $\\mathbf{u} - \\mathbf{v}$.",
        "三维向量的加减法与平面中完全一样，逐个分量进行，只是多了一个表示新方向的第三个分量。在三维空间中，向量的加法与减法按对应坐标分量分别进行：\n\n$$\\langle u_1, u_2, u_3 \\rangle \\pm \\langle v_1, v_2, v_3 \\rangle = \\langle u_1 \\pm v_1, \\; u_2 \\pm v_2, \\; u_3 \\pm v_3 \\rangle$$\n\n例如：\n\n$$\\langle 2, -1, 5 \\rangle - \\langle 4, 3, -2 \\rangle = \\langle 2 - 4, \\; -1 - 3, \\; 5 - (-2) \\rangle = \\langle -2, -4, 7 \\rangle$$\n\n检验：把 $\\langle 4, 3, -2 \\rangle$ 加回到 $\\langle -2, -4, 7 \\rangle$ 上，得 $\\langle 2, -1, 5 \\rangle$。\n\n> **注意。** 减去负的分量等于加上它，如 $5 - (-2) = 7$。减法有顺序：$\\mathbf{v} - \\mathbf{u}$ 是 $\\mathbf{u} - \\mathbf{v}$ 的相反向量。",
      ),
      generate(rng) {
        const u: Vec3 = [
          rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]),
          rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]),
          rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]),
        ];
        const v: Vec3 = [
          rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]),
          rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]),
          rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]),
        ];
        const isAdd = rng.bool();
        const res = isAdd ? add3(u, v) : sub3(u, v);
        const opp = isAdd ? sub3(u, v) : add3(u, v);
        const revSub = sub3(v, u);
        const signErr: Vec3 = [res[0], -res[1], res[2]];

        const opSymbol = isAdd ? "+" : "-";
        const undo = isAdd ? "-" : "+";

        return pointProblem({
          prompt: t(
            `Given $\\mathbf{u} = ${vec3Latex(u)}$ and $\\mathbf{v} = ${vec3Latex(v)}$, find $\\mathbf{u} ${opSymbol} \\mathbf{v}$.`,
            `已知 $\\mathbf{u} = ${vec3Latex(u)}$ 且 $\\mathbf{v} = ${vec3Latex(v)}$，求 $\\mathbf{u} ${opSymbol} \\mathbf{v}$。`,
          ),
          answer: res,
          vars: ["x", "y", "z"],
          vector: true,
          wrong: [opp, revSub, signErr],
          solution: walked(
            [
              [
                ["Pair the components", "对应分量配对"],
                t(
                  `Each component of the answer comes from the matching components of $\\mathbf{u}$ and $\\mathbf{v}$, in that order:`,
                  `结果的每个分量都由 $\\mathbf{u}$ 和 $\\mathbf{v}$ 的对应分量按这个顺序算出：`,
                ),
                [
                  `\\mathbf{u} ${opSymbol} \\mathbf{v} = \\langle ${u[0]} ${opSymbol} ${paren(v[0])}, \\; ${u[1]} ${opSymbol} ${paren(v[1])}, \\; ${u[2]} ${opSymbol} ${paren(v[2])} \\rangle`,
                ],
              ],
              [
                ["Work out each component", "算出每个分量"],
                t("Carry out the three operations, minding the signs:", "完成三次运算，注意符号："),
                [`\\mathbf{u} ${opSymbol} \\mathbf{v} = ${vec3Latex(res)}`],
              ],
            ],
            t(
              `Undoing the operation with $\\mathbf{v}$ must give $\\mathbf{u}$ back:\n\n$$${vec3Latex(res)} ${undo} ${vec3Latex(v)} = ${vec3Latex(u)}$$`,
              `对 $\\mathbf{v}$ 做相反的运算，必须得回 $\\mathbf{u}$：\n\n$$${vec3Latex(res)} ${undo} ${vec3Latex(v)} = ${vec3Latex(u)}$$`,
            ),
          ),
        });
      },
    },
    {
      id: "scalar-multiplication-and-linear-combinations-in-3d",
      title: t("Scalar multiplication and linear combinations in 3D", "三维空间向量的数乘与线性组合"),
      explanation: t(
        "A scalar stretches or shrinks a vector and reverses it when negative, and each of the three components is multiplied by the same number. Multiplying a 3D vector by a scalar $c$ scales each component:\n\n$$c\\langle x, y, z \\rangle = \\langle cx, cy, cz \\rangle$$\n\nA linear combination $a\\mathbf{u} + b\\mathbf{v}$ combines scalar multiplication and addition. For $\\mathbf{u} = \\langle 1, -3, 2 \\rangle$ and $\\mathbf{v} = \\langle 0, 1, -1 \\rangle$:\n\n$$2\\mathbf{u} - 3\\mathbf{v} = \\langle 2, -6, 4 \\rangle - \\langle 0, 3, -3 \\rangle = \\langle 2, -9, 7 \\rangle$$\n\nCheck: the second component straight from the formula is $2(-3) - 3(1) = -9$.\n\n> **Watch out.** The scalar multiplies every component, signs included, so a negative scalar flips every sign. Scale both vectors before adding; $2\\mathbf{u} - 3\\mathbf{v}$ is not $\\mathbf{u} - \\mathbf{v}$ scaled by anything.",
        "数乘会把向量拉长或缩短，乘以负数时还会反向，三个分量都乘以同一个数。用标量 $c$ 乘以三维向量会将每个坐标分量均乘以 $c$：\n\n$$c\\langle x, y, z \\rangle = \\langle cx, cy, cz \\rangle$$\n\n线性组合 $a\\mathbf{u} + b\\mathbf{v}$ 是数乘与加法的综合运算。对 $\\mathbf{u} = \\langle 1, -3, 2 \\rangle$ 和 $\\mathbf{v} = \\langle 0, 1, -1 \\rangle$：\n\n$$2\\mathbf{u} - 3\\mathbf{v} = \\langle 2, -6, 4 \\rangle - \\langle 0, 3, -3 \\rangle = \\langle 2, -9, 7 \\rangle$$\n\n检验：直接按公式算第二个分量，$2(-3) - 3(1) = -9$。\n\n> **注意。** 标量乘每一个分量，连同符号，所以负的标量会把每个符号都变号。先把两个向量分别数乘再相加；$2\\mathbf{u} - 3\\mathbf{v}$ 不是 $\\mathbf{u} - \\mathbf{v}$ 乘某个数。",
      ),
      generate(rng) {
        const u: Vec3 = [
          rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]),
          rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]),
          rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]),
        ];
        const v: Vec3 = [
          rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]),
          rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]),
          rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]),
        ];
        const a = rng.pick([2, 3, -2, -3]);
        const b = rng.pick([2, 3, -2, -1]);

        const au = smul3(a, u);
        const bv = smul3(b, v);
        const right = add3(au, bv);
        const w1 = sub3(au, bv);
        const w2 = add3(smul3(b, u), smul3(a, v));
        const w3: Vec3 = [right[0], -right[1], right[2]];
        const w4 = add3(u, v);

        const aTerm = a === 1 ? "\\mathbf{u}" : a === -1 ? "-\\mathbf{u}" : `${a}\\mathbf{u}`;
        const bTerm = b > 0 ? (b === 1 ? "+ \\mathbf{v}" : `+ ${b}\\mathbf{v}`) : b === -1 ? "- \\mathbf{v}" : `- ${-b}\\mathbf{v}`;
        const bAlone = b === -1 ? "-\\mathbf{v}" : `${b}\\mathbf{v}`;
        const direct = [0, 1, 2].map((i) => `${a}(${u[i]}) + ${paren(b)}(${v[i]})`).join(", \\; ");

        return pointProblem({
          prompt: t(
            `Given $\\mathbf{u} = ${vec3Latex(u)}$ and $\\mathbf{v} = ${vec3Latex(v)}$, find $${aTerm} ${bTerm}$.`,
            `已知 $\\mathbf{u} = ${vec3Latex(u)}$ 且 $\\mathbf{v} = ${vec3Latex(v)}$，求 $${aTerm} ${bTerm}$。`,
          ),
          answer: right,
          vars: ["x", "y", "z"],
          vector: true,
          wrong: [w1, w2, w3, w4],
          solution: walked(
            [
              [
                ["Scale each vector", "分别数乘"],
                t(
                  "Multiply every component of each vector by its scalar, sign included:",
                  "把每个向量的每个分量都乘以它的标量，连同符号：",
                ),
                [`${aTerm} = ${vec3Latex(au)}`, `${bAlone} = ${vec3Latex(bv)}`],
              ],
              [
                ["Add the scaled vectors", "把数乘后的向量相加"],
                t("Add matching components:", "对应分量相加："),
                [`${aTerm} ${bTerm} = ${vec3Latex(au)} + ${vec3Latex(bv)} = ${vec3Latex(right)}`],
              ],
            ],
            t(
              `Each component straight from $${a}u_i + ${paren(b)}v_i$ gives the same:\n\n$$\\langle ${direct} \\rangle = ${vec3Latex(right)}$$`,
              `直接按 $${a}u_i + ${paren(b)}v_i$ 计算每个分量，结果相同：\n\n$$\\langle ${direct} \\rangle = ${vec3Latex(right)}$$`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── 5.18.3 Magnitude of Cartesian Vectors in 3D ─────────────────────────────

/** calculatingTheMagnitudeOfCartesianVectorsIn3D covers 3D magnitude and unit vectors. */
export const calculatingTheMagnitudeOfCartesianVectorsIn3D: TopicDef = {
  id: "calculating-the-magnitude-of-cartesian-vectors-in-3d",
  title: t("Calculating the Magnitude of Cartesian Vectors in 3D", "计算三维空间向量的模长"),
  summary: t(
    "Calculate the magnitude of 3D vectors, find distances in 3D space, and normalize vectors to unit vectors.",
    "计算三维向量的模长、空间中两点间的距离，并将三维向量单位化。",
  ),
  prerequisites: ["addition-and-scalar-multiplication-of-cartesian-vectors-in-3d"],
  encompasses: [],
  xp: 15,
  standards: ["CCSS.HSN.VM.A.1", "CCSS.HSN.VM.B.5.b"],
  intro: t(
    `In the plane the length of $\\langle 3, 4 \\rangle$ is $\\sqrt{3^2 + 4^2} = 5$, by the Pythagorean theorem. In space, $\\langle 3, 4, 12 \\rangle$ is the diagonal of a box $3$ by $4$ by $12$. The diagonal of its base is $5$, and that diagonal with the height $12$ makes another right triangle, so the length is $\\sqrt{5^2 + 12^2} = 13$. Both steps together add all three squares:

$$\\|\\langle 3, 4, 12 \\rangle\\| = \\sqrt{9 + 16 + 144} = \\sqrt{169} = 13$$

Check: $13^2 = 169$, and $13$ is less than $3 + 4 + 12 = 19$, as a straight diagonal is shorter than the path along three edges.

In this lesson we find magnitudes and distances in space, scale a vector to length one, and find the point on an axis at equal distances from two points.`,
    `平面中 $\\langle 3, 4 \\rangle$ 的长度由勾股定理得 $\\sqrt{3^2 + 4^2} = 5$。空间中，$\\langle 3, 4, 12 \\rangle$ 是长 $3$、宽 $4$、高 $12$ 的长方体的对角线。底面的对角线长 $5$，它和高 $12$ 又构成一个直角三角形，所以长度是 $\\sqrt{5^2 + 12^2} = 13$。两步合起来就是三个平方相加：

$$\\|\\langle 3, 4, 12 \\rangle\\| = \\sqrt{9 + 16 + 144} = \\sqrt{169} = 13$$

检验：$13^2 = 169$，而且 $13$ 小于 $3 + 4 + 12 = 19$，因为对角线比沿三条棱走的路短。

这节课我们求空间向量的模和两点间的距离，把向量缩放成长度为一，并求坐标轴上到两点距离相等的点。`,
  ),
  knowledgePoints: [
    {
      id: "magnitude-of-a-3d-vector",
      title: t("Magnitude of a 3D vector", "三维向量的模长"),
      explanation: t(
        "By extending the Pythagorean theorem to three dimensions, the magnitude (or length) of $\\mathbf{v} = \\langle x, y, z \\rangle$ is:\n\n$$\\|\\mathbf{v}\\| = \\sqrt{x^2 + y^2 + z^2}$$\n\nThe distance between two points $P(x_1, y_1, z_1)$ and $Q(x_2, y_2, z_2)$ is the magnitude of the displacement vector $\\vec{PQ}$. For $P(1, 0, -2)$ and $Q(3, -1, 0)$, $\\vec{PQ} = \\langle 2, -1, 2 \\rangle$, so the distance is\n\n$$\\sqrt{4 + 1 + 4} = \\sqrt{9} = 3$$\n\nCheck: $3^2 = 9$, the sum of the three squares.\n\n> **Watch out.** Square each component with its sign, so $(-1)^2 = 1$ and the magnitude is never negative. For a distance, square the differences of the coordinates, not the coordinates of either point, and do not stop at $x^2 + y^2 + z^2$: take its square root.",
        "将勾股定理推广至三维空间，向量 $\\mathbf{v} = \\langle x, y, z \\rangle$ 的模长（长度）为：\n\n$$\\|\\mathbf{v}\\| = \\sqrt{x^2 + y^2 + z^2}$$\n\n两点 $P(x_1, y_1, z_1)$ 与 $Q(x_2, y_2, z_2)$ 之间的距离即位移向量 $\\vec{PQ}$ 的模长。对 $P(1, 0, -2)$ 和 $Q(3, -1, 0)$，$\\vec{PQ} = \\langle 2, -1, 2 \\rangle$，所以距离是\n\n$$\\sqrt{4 + 1 + 4} = \\sqrt{9} = 3$$\n\n检验：$3^2 = 9$，等于三个平方之和。\n\n> **注意。** 每个分量连同符号一起平方，所以 $(-1)^2 = 1$，模不会是负数。求距离时要把坐标之差平方，而不是某一个点的坐标；也不要停在 $x^2 + y^2 + z^2$，还要开平方。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const [vBase, LBase] = pickQuadruple(rng);
          const scale = rng.pick([1, 1, 2]);
          const v = smul3(scale, vBase);
          const L = LBase * scale;
          const sum = magSq3(v);
          const legs = Math.abs(v[0]) + Math.abs(v[1]) + Math.abs(v[2]);

          return numberProblem({
            prompt: t(
              `Calculate the magnitude of the vector $\\mathbf{v} = ${vec3Latex(v)}$.`,
              `计算向量 $\\mathbf{v} = ${vec3Latex(v)}$ 的模长。`,
            ),
            answer: L,
            form: "integer",
            wrong: [L + 1, Math.max(1, L - 1), L + 2],
            solution: walked(
              [
                [
                  ["Square the components", "把分量平方"],
                  t("Square each component with its sign and add:", "每个分量连同符号平方后相加："),
                  [`(${v[0]})^2 + (${v[1]})^2 + (${v[2]})^2 = ${v[0] * v[0]} + ${v[1] * v[1]} + ${v[2] * v[2]} = ${sum}`],
                ],
                [
                  ["Take the square root", "开平方"],
                  t("The magnitude is the square root of the sum:", "模是这个和的平方根："),
                  [`\\|\\mathbf{v}\\| = \\sqrt{${sum}} = ${L}`],
                ],
              ],
              t(
                `$${L}^2 = ${L * L}$, the sum of the squares, and $${L}$ is less than $${legs}$, the sum of the sizes of the components, as a diagonal is shorter than the path along the edges.`,
                `$${L}^2 = ${L * L}$，等于平方和；而且 $${L}$ 小于各分量大小之和 $${legs}$，因为对角线比沿棱走的路短。`,
              ),
            ),
          });
        }

        const [delta, L] = pickQuadruple(rng);
        const P: Vec3 = [rng.pick([-6, -4, -2, 0, 2, 4, 6]), rng.pick([-5, -3, -1, 1, 3, 5]), rng.pick([-4, -2, 0, 2, 4])];
        const Q: Vec3 = add3(P, delta);
        const sum = magSq3(delta);

        return numberProblem({
          prompt: t(
            `Find the distance between the points $P(${P[0]}, ${P[1]}, ${P[2]})$ and $Q(${Q[0]}, ${Q[1]}, ${Q[2]})$ in $\\mathbb{R}^3$.`,
            `求三维空间中点 $P(${P[0]}, ${P[1]}, ${P[2]})$ 与点 $Q(${Q[0]}, ${Q[1]}, ${Q[2]})$ 之间的距离。`,
          ),
          answer: L,
          form: "integer",
          wrong: [L + 1, Math.max(1, L - 1), L + 2],
          solution: walked(
            [
              [
                ["Find the vector between the points", "求两点之间的向量"],
                t("Subtract the coordinates of $P$ from those of $Q$:", "用 $Q$ 的坐标减去 $P$ 的坐标："),
                [
                  `\\vec{PQ} = \\langle ${Q[0]} - ${paren(P[0])}, \\; ${Q[1]} - ${paren(P[1])}, \\; ${Q[2]} - ${paren(P[2])} \\rangle = ${vec3Latex(delta)}`,
                ],
              ],
              [
                ["Take its magnitude", "求它的模"],
                t("The distance is the length of this vector:", "距离就是这个向量的长度："),
                [`d(P, Q) = \\sqrt{(${delta[0]})^2 + (${delta[1]})^2 + (${delta[2]})^2} = \\sqrt{${sum}} = ${L}`],
              ],
            ],
            t(
              `Measuring from $Q$ to $P$ gives the opposite vector $${vec3Latex(smul3(-1, delta))}$, whose components have the same squares, so the distance is again $\\sqrt{${sum}} = ${L}$.`,
              `从 $Q$ 量到 $P$ 得到相反向量 $${vec3Latex(smul3(-1, delta))}$，它的分量平方相同，所以距离仍是 $\\sqrt{${sum}} = ${L}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "normalization-and-3d-unit-vectors",
      title: t("Normalization and 3D unit vectors", "单位向量化与三维单位向量"),
      explanation: t(
        "Dividing a vector by its length keeps its direction but makes its length one, which is useful whenever only the direction matters. A unit vector has magnitude $1$. To normalize a nonzero vector $\\mathbf{v}$, divide it by its magnitude:\n\n$$\\mathbf{u} = \\frac{\\mathbf{v}}{\\|\\mathbf{v}\\|} = \\left\\langle \\frac{x}{\\|\\mathbf{v}\\|}, \\; \\frac{y}{\\|\\mathbf{v}\\|}, \\; \\frac{z}{\\|\\mathbf{v}\\|} \\right\\rangle$$\n\nFor $\\mathbf{v} = \\langle 2, -1, 2 \\rangle$, $\\|\\mathbf{v}\\| = \\sqrt{4 + 1 + 4} = 3$, so the unit vector is $\\left\\langle \\frac{2}{3}, -\\frac{1}{3}, \\frac{2}{3} \\right\\rangle$. Check: $\\frac{4}{9} + \\frac{1}{9} + \\frac{4}{9} = 1$.\n\n> **Watch out.** Divide by the magnitude, not by its square, and keep every sign: flipping a sign changes the direction. The answer must have length exactly $1$.",
        "把向量除以它的长度会保持方向不变，而长度变为 1，在只关心方向时很有用。单位向量的模长为 $1$。将非零向量 $\\mathbf{v}$ 单位化，只需将其除以其自身的模长：\n\n$$\\mathbf{u} = \\frac{\\mathbf{v}}{\\|\\mathbf{v}\\|} = \\left\\langle \\frac{x}{\\|\\mathbf{v}\\|}, \\; \\frac{y}{\\|\\mathbf{v}\\|}, \\; \\frac{z}{\\|\\mathbf{v}\\|} \\right\\rangle$$\n\n对 $\\mathbf{v} = \\langle 2, -1, 2 \\rangle$，$\\|\\mathbf{v}\\| = \\sqrt{4 + 1 + 4} = 3$，所以单位向量是 $\\left\\langle \\frac{2}{3}, -\\frac{1}{3}, \\frac{2}{3} \\right\\rangle$。检验：$\\frac{4}{9} + \\frac{1}{9} + \\frac{4}{9} = 1$。\n\n> **注意。** 除以模，而不是模的平方，并且保留每个符号：改变符号就改变了方向。结果的长度必须正好是 $1$。",
      ),
      generate(rng) {
        const [v, L] = pickQuadruple(rng);
        const qv: readonly [Q, Q, Q] = [Q.of(v[0], L), Q.of(v[1], L), Q.of(v[2], L)];
        const oppQv: readonly [Q, Q, Q] = [Q.of(-v[0], L), Q.of(-v[1], L), Q.of(-v[2], L)];
        const sqQv: readonly [Q, Q, Q] = [Q.of(v[0], L * L), Q.of(v[1], L * L), Q.of(v[2], L * L)];
        const flipQv: readonly [Q, Q, Q] = [Q.of(v[0], L), Q.of(-v[1], L), Q.of(v[2], L)];
        const sum = magSq3(v);

        return pointProblem({
          prompt: t(
            `Find the unit vector $\\mathbf{u}$ that has the same direction as $\\mathbf{v} = ${vec3Latex(v)}$.`,
            `求与向量 $\\mathbf{v} = ${vec3Latex(v)}$ 同向的单位向量 $\\mathbf{u}$。`,
          ),
          answer: qv,
          vars: ["x", "y", "z"],
          vector: true,
          wrong: [oppQv, sqQv, flipQv, v],
          solution: walked(
            [
              [
                ["Find the magnitude", "求模"],
                t("Square the components, add and take the square root:", "把分量平方、相加再开平方："),
                [`\\|\\mathbf{v}\\| = \\sqrt{(${v[0]})^2 + (${v[1]})^2 + (${v[2]})^2} = \\sqrt{${sum}} = ${L}`],
              ],
              [
                ["Divide by the magnitude", "除以模"],
                t(`Divide every component by $${L}$, keeping its sign:`, `每个分量都除以 $${L}$，保留符号：`),
                [`\\mathbf{u} = \\frac{1}{${L}}${vec3Latex(v)} = ${qVec3Latex(qv)}`],
              ],
            ],
            t(
              `The squares of the components of $\\mathbf{u}$ add to $1$:\n\n$$\\frac{${v[0] * v[0]} + ${v[1] * v[1]} + ${v[2] * v[2]}}{${L * L}} = \\frac{${sum}}{${L * L}} = 1$$`,
              `$\\mathbf{u}$ 各分量的平方和为 $1$：\n\n$$\\frac{${v[0] * v[0]} + ${v[1] * v[1]} + ${v[2] * v[2]}}{${L * L}} = \\frac{${sum}}{${L * L}} = 1$$`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── Module 5.19. The Dot Product ───────────────────────────────────────────

// ─── 5.19.1 Calculating the Dot Product Using Angle and Magnitude ───────────

/** calculatingTheDotProductUsingAngleAndMagnitude covers u · v = ||u|| ||v|| cos θ. */
export const calculatingTheDotProductUsingAngleAndMagnitude: TopicDef = {
  id: "calculating-the-dot-product-using-angle-and-magnitude",
  title: t("Calculating the Dot Product Using Angle and Magnitude", "利用模长与夹角计算数量积（点积）"),
  summary: t(
    "Compute the dot product of two vectors using their magnitudes and the angle between them, and interpret its sign.",
    "利用向量的模长及夹角计算数量积，并理解数量积正负的几何意义。",
  ),
  prerequisites: ["calculating-the-magnitude-of-cartesian-vectors-in-2d"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.11"],
  intro: t(
    `A vector has a magnitude, and two vectors drawn from one point also make an angle $\\theta$. The dot product joins the two: it multiplies the magnitudes and the cosine of the angle. For magnitudes $4$ and $5$ at $60^\\circ$:

$$\\mathbf{u} \\cdot \\mathbf{v} = 4 \\cdot 5 \\cdot \\cos 60^\\circ = 20 \\cdot \\frac{1}{2} = 10$$

Check: turning $\\mathbf{v}$ to $0^\\circ$ gives the largest value, $20 \\cdot 1 = 20$, and turning it to $90^\\circ$ gives $20 \\cdot 0 = 0$, so $10$ lies between them, as $60^\\circ$ does.

In this lesson we find a dot product from magnitudes and an angle, read the kind of angle from the sign of a dot product, and find the angle from a dot product.`,
    `向量有模，从同一点画出的两个向量还构成一个角 $\\theta$。点积把两者结合起来：它是两个模与夹角余弦的乘积。模为 $4$ 和 $5$、夹角 $60^\\circ$ 时：

$$\\mathbf{u} \\cdot \\mathbf{v} = 4 \\cdot 5 \\cdot \\cos 60^\\circ = 20 \\cdot \\frac{1}{2} = 10$$

检验：把 $\\mathbf{v}$ 转到 $0^\\circ$ 时得到最大值 $20 \\cdot 1 = 20$，转到 $90^\\circ$ 时得 $20 \\cdot 0 = 0$，所以 $10$ 介于两者之间，正如 $60^\\circ$ 介于 $0^\\circ$ 和 $90^\\circ$ 之间。

这节课我们由模和夹角求点积，由点积的符号判断角的类型，并由点积求夹角。`,
  ),
  knowledgePoints: [
    {
      id: "geometric-definition-of-the-dot-product",
      figure: precalculusDrawings2["calculating-the-dot-product-using-angle-and-magnitude#geometric-definition-of-the-dot-product"],
      title: t("Geometric definition of the dot product", "数量积的几何定义"),
      explanation: t(
        "The dot product (scalar product) of two vectors $\\mathbf{u}$ and $\\mathbf{v}$ is defined geometrically as:\n\n$$\\mathbf{u} \\cdot \\mathbf{v} = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\cos\\theta$$\n\nwhere $\\theta$ is the angle between the two vectors with $0 \\le \\theta \\le \\pi$ ($0^\\circ \\le \\theta \\le 180^\\circ$). For magnitudes $6$ and $3$ at $120^\\circ$:\n\n$$\\mathbf{u} \\cdot \\mathbf{v} = 6 \\cdot 3 \\cdot \\left(-\\frac{1}{2}\\right) = -9$$\n\nCheck: an angle over $90^\\circ$ has a negative cosine, so a negative dot product is expected.\n\n> **Watch out.** The angle is measured between the two vectors drawn from one point, and it is never more than $180^\\circ$. The answer is a number, not a vector, and it is negative for an obtuse angle: $\\cos 120^\\circ = -\\frac{1}{2}$, not $\\frac{1}{2}$.",
        "两个向量 $\\mathbf{u}$ 与 $\\mathbf{v}$ 的数量积（点积）在几何上定义为：\n\n$$\\mathbf{u} \\cdot \\mathbf{v} = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\cos\\theta$$\n\n其中 $\\theta$ 是两向量的夹角，满足 $0 \\le \\theta \\le \\pi$（即 $0^\\circ \\le \\theta \\le 180^\\circ$）。模为 $6$ 和 $3$、夹角 $120^\\circ$ 时：\n\n$$\\mathbf{u} \\cdot \\mathbf{v} = 6 \\cdot 3 \\cdot \\left(-\\frac{1}{2}\\right) = -9$$\n\n检验：大于 $90^\\circ$ 的角余弦为负，所以点积应当是负的。\n\n> **注意。** 夹角是把两个向量从同一点画出后量得的角，不会超过 $180^\\circ$。结果是一个数，不是向量；钝角时它是负的：$\\cos 120^\\circ = -\\frac{1}{2}$，不是 $\\frac{1}{2}$。",
      ),
      generate(rng) {
        const magU = rng.pick([2, 4, 6, 8, 10]);
        const magV = rng.pick([2, 3, 4, 5, 6, 7, 8, 9]);
        const angleItem = rng.pick([
          { deg: "0^\\circ", rad: "0", cosVal: 1, cosTex: "1", isRad: false },
          { deg: "60^\\circ", rad: "\\frac{\\pi}{3}", cosVal: 0.5, cosTex: "\\frac{1}{2}", isRad: true },
          { deg: "90^\\circ", rad: "\\frac{\\pi}{2}", cosVal: 0, cosTex: "0", isRad: false },
          { deg: "120^\\circ", rad: "\\frac{2\\pi}{3}", cosVal: -0.5, cosTex: "-\\frac{1}{2}", isRad: true },
          { deg: "180^\\circ", rad: "\\pi", cosVal: -1, cosTex: "-1", isRad: false },
        ]);

        const thetaStr = angleItem.isRad ? angleItem.rad : angleItem.deg;
        const product = magU * magV;
        const dot = Math.round(product * angleItem.cosVal);
        const meaning =
          angleItem.cosVal === 1
            ? t("The vectors point the same way, so the full product of the magnitudes is reached.", "两向量同向，所以达到两模之积的全部。")
            : angleItem.cosVal === 0.5
              ? t("An acute angle gives a positive value, here half of that product.", "锐角给出正值，这里是这个积的一半。")
              : angleItem.cosVal === 0
                ? t("A right angle gives $0$.", "直角给出 $0$。")
                : angleItem.cosVal === -0.5
                  ? t(
                      "An obtuse angle gives a negative value, here minus half of that product.",
                      "钝角给出负值，这里是这个积一半的相反数。",
                    )
                  : t("Opposite directions give the full product with a minus sign.", "两向量反向，给出带负号的全部乘积。");

        return numberProblem({
          prompt: t(
            `Given two vectors with $\\|\\mathbf{u}\\| = ${magU}$, $\\|\\mathbf{v}\\| = ${magV}$, and the angle between them $\\theta = ${thetaStr}$, compute $\\mathbf{u} \\cdot \\mathbf{v}$.`,
            `已知两向量满足 $\\|\\mathbf{u}\\| = ${magU}$，$\\|\\mathbf{v}\\| = ${magV}$，且夹角 $\\theta = ${thetaStr}$，计算 $\\mathbf{u} \\cdot \\mathbf{v}$。`,
          ),
          answer: dot,
          form: "integer",
          wrong: [magU * magV, -magU * magV, 0, magU + magV],
          solution: walked(
            [
              [
                ["Find the cosine", "求余弦"],
                t(`The angle is $${angleItem.deg}$, and its cosine is a special value:`, `这个角是 $${angleItem.deg}$，它的余弦是特殊值：`),
                [`\\cos ${thetaStr} = ${angleItem.cosTex}`],
              ],
              [
                ["Multiply", "相乘"],
                t("Multiply the two magnitudes and the cosine:", "把两个模与余弦相乘："),
                [
                  `\\mathbf{u} \\cdot \\mathbf{v} = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\cos\\theta = (${magU})(${magV})(${angleItem.cosTex}) = ${dot}`,
                ],
              ],
            ],
            t(
              `A dot product is never larger in size than the product of the magnitudes, $${magU} \\cdot ${magV} = ${product}$. ${meaning.en}`,
              `点积的大小不会超过两模之积 $${magU} \\cdot ${magV} = ${product}$。${meaning["zh-CN"]}`,
            ),
          ),
        });
      },
    },
    {
      id: "sign-of-the-dot-product-and-orthogonality",
      figure: precalculusDrawings2["calculating-the-dot-product-using-angle-and-magnitude#sign-of-the-dot-product-and-orthogonality"],
      title: t("Sign of the dot product and orthogonality", "数量积的正负与垂直关系"),
      explanation: t(
        "The sign of the dot product tells whether the angle between two vectors is acute, right or obtuse, without computing the angle itself. Because $\\mathbf{u} \\cdot \\mathbf{v} = \\|\\mathbf{u}\\|\\|\\mathbf{v}\\|\\cos\\theta$ and magnitudes are positive:\n\n- $\\mathbf{u} \\cdot \\mathbf{v} > 0 \\iff 0^\\circ \\le \\theta < 90^\\circ$ (acute angle)\n- $\\mathbf{u} \\cdot \\mathbf{v} = 0 \\iff \\theta = 90^\\circ$ (orthogonal / perpendicular)\n- $\\mathbf{u} \\cdot \\mathbf{v} < 0 \\iff 90^\\circ < \\theta \\le 180^\\circ$ (obtuse angle)\n\nFor magnitudes $3$ and $4$ with $\\mathbf{u} \\cdot \\mathbf{v} = -6$, the cosine is $\\frac{-6}{12} = -\\frac{1}{2}$, so the angle is obtuse. Check: $\\theta = 120^\\circ$, which is more than $90^\\circ$.\n\n> **Watch out.** Only the sign decides the kind of angle; the size of the dot product does not. A small positive dot product still means an acute angle, and $0^\\circ$ or $180^\\circ$ would need the dot product to equal $\\pm\\|\\mathbf{u}\\|\\|\\mathbf{v}\\|$.",
        "点积的符号可以告诉我们两个向量的夹角是锐角、直角还是钝角，而不必求出角本身。因为 $\\mathbf{u} \\cdot \\mathbf{v} = \\|\\mathbf{u}\\|\\|\\mathbf{v}\\|\\cos\\theta$ 且向量模长为正：\n\n- $\\mathbf{u} \\cdot \\mathbf{v} > 0 \\iff 0^\\circ \\le \\theta < 90^\\circ$（锐角）\n- $\\mathbf{u} \\cdot \\mathbf{v} = 0 \\iff \\theta = 90^\\circ$（正交 / 垂直）\n- $\\mathbf{u} \\cdot \\mathbf{v} < 0 \\iff 90^\\circ < \\theta \\le 180^\\circ$（钝角）\n\n模为 $3$ 和 $4$、$\\mathbf{u} \\cdot \\mathbf{v} = -6$ 时，余弦是 $\\frac{-6}{12} = -\\frac{1}{2}$，所以是钝角。检验：$\\theta = 120^\\circ$，大于 $90^\\circ$。\n\n> **注意。** 只有符号决定角的类型，点积的大小不决定。很小的正点积仍表示锐角；而 $0^\\circ$ 或 $180^\\circ$ 要求点积等于 $\\pm\\|\\mathbf{u}\\|\\|\\mathbf{v}\\|$。",
      ),
      generate(rng) {
        const uMag = rng.pick([3, 4, 5, 7, 9]);
        const vMag = rng.pick([2, 6, 8, 10]);
        const product = uMag * vMag;
        const sign = rng.pick([-1, 0, 1]);
        const val = sign * rng.int(1, product - 1);
        const cos = Q.of(val, product);
        const degrees = (Math.acos(val / product) * 180) / Math.PI;
        const shown = val === 0 ? "= 90^\\circ" : `\\approx ${degrees.toFixed(1)}^\\circ`;

        const prompt = t(
          `Two nonzero vectors $\\mathbf{u}$ and $\\mathbf{v}$ have $\\|\\mathbf{u}\\| = ${uMag}$, $\\|\\mathbf{v}\\| = ${vMag}$, and $\\mathbf{u} \\cdot \\mathbf{v} = ${val}$. What is the nature of the angle $\\theta$ between them?`,
          `已知两非零向量 $\\mathbf{u}$ 与 $\\mathbf{v}$ 满足 $\\|\\mathbf{u}\\| = ${uMag}$、$\\|\\mathbf{v}\\| = ${vMag}$，且 $\\mathbf{u} \\cdot \\mathbf{v} = ${val}$。它们之间的夹角 $\\theta$ 属于哪种类型？`,
        );
        const acute = t("Acute ($0^\\circ \\le \\theta < 90^\\circ$)", "锐角（$0^\\circ \\le \\theta < 90^\\circ$）");
        const right = t("Right angle ($\\theta = 90^\\circ$, orthogonal)", "直角（$\\theta = 90^\\circ$，互相垂直）");
        const obtuse = t("Obtuse ($90^\\circ < \\theta \\le 180^\\circ$)", "钝角（$90^\\circ < \\theta \\le 180^\\circ$）");
        const straight = t("Straight angle ($\\theta = 180^\\circ$)", "平角（$\\theta = 180^\\circ$）");
        const zero = t("Zero angle ($\\theta = 0^\\circ$)", "零角（$\\theta = 0^\\circ$）");
        const kind =
          val > 0
            ? t("positive, so the angle is acute", "为正，所以是锐角")
            : val < 0
              ? t("negative, so the angle is obtuse", "为负，所以是钝角")
              : t("zero, so the angle is a right angle", "为零，所以是直角");
        const solution = walked(
          [
            [
              ["Find the cosine", "求余弦"],
              t("Divide the dot product by the two magnitudes:", "把点积除以两个模："),
              [`\\cos\\theta = \\frac{${val}}{${uMag} \\cdot ${vMag}} = ${cos.toLatex()}`],
            ],
            [
              ["Read the sign", "看符号"],
              t(
                `The magnitudes are positive, so $\\cos\\theta$ has the sign of the dot product. It is ${kind.en}.`,
                `模都是正的，所以 $\\cos\\theta$ 与点积同号。它${kind["zh-CN"]}。`,
              ),
            ],
          ],
          t(
            `The angle itself is\n\n$$\\theta = \\arccos\\left(${cos.toLatex()}\\right) ${shown}$$`,
            `角本身是\n\n$$\\theta = \\arccos\\left(${cos.toLatex()}\\right) ${shown}$$`,
          ),
        );
        const notZero = val === 0 ? t("it is $0$", "它是 $0$") : t(`it is $${val}$`, `它是 $${val}$`);
        const reasons = [
          why(acute, `An acute angle needs a positive dot product, but ${notZero.en}.`, `锐角要求点积为正，但${notZero["zh-CN"]}。`),
          why(right, `A right angle needs a dot product of $0$, but it is $${val}$.`, `直角要求点积为 $0$，但它是 $${val}$。`),
          why(obtuse, `An obtuse angle needs a negative dot product, but ${notZero.en}.`, `钝角要求点积为负，但${notZero["zh-CN"]}。`),
          why(
            straight,
            `At $180^\\circ$ the dot product would be $-${product}$, the full product with a minus sign.`,
            `$180^\\circ$ 时点积应为 $-${product}$，即带负号的全部乘积。`,
          ),
          why(
            zero,
            `At $0^\\circ$ the dot product would be $${product}$, the full product of the magnitudes.`,
            `$0^\\circ$ 时点积应为两模之积 $${product}$。`,
          ),
        ];

        if (val > 0) return oneOf(rng, prompt, acute, [right, obtuse, straight], solution, reasons);
        if (val === 0) return oneOf(rng, prompt, right, [acute, obtuse, zero], solution, reasons);
        return oneOf(rng, prompt, obtuse, [acute, right, zero], solution, reasons);
      },
    },
  ],
};

// ─── 5.19.2 Calculating the Dot Product Using Components ─────────────────────

/** calculatingTheDotProductUsingComponents covers component dot product and orthogonality. */
export const calculatingTheDotProductUsingComponents: TopicDef = {
  id: "calculating-the-dot-product-using-components",
  title: t("Calculating the Dot Product Using Components", "利用坐标分量计算向量数量积"),
  summary: t(
    "Compute the dot product using Cartesian components in 2D and 3D, and use the zero dot product to test for perpendicular vectors.",
    "利用二维与三维坐标分量计算数量积，并利用数量积为零判定向量垂直。",
  ),
  prerequisites: ["calculating-the-dot-product-using-angle-and-magnitude"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.11"],
  intro: t(
    `The formula $\\mathbf{u} \\cdot \\mathbf{v} = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\cos\\theta$ needs the angle. For the unit vectors along the axes it gives $\\mathbf{i} \\cdot \\mathbf{i} = 1 \\cdot 1 \\cdot \\cos 0^\\circ = 1$ and $\\mathbf{i} \\cdot \\mathbf{j} = 1 \\cdot 1 \\cdot \\cos 90^\\circ = 0$. So when two vectors written with $\\mathbf{i}$, $\\mathbf{j}$ and $\\mathbf{k}$ are multiplied out, only the matching pairs survive:

$$\\langle 1, 2, 3 \\rangle \\cdot \\langle 4, -1, 2 \\rangle = 1 \\cdot 4 + 2 \\cdot (-1) + 3 \\cdot 2 = 8$$

Check: a vector dotted with itself gives its magnitude squared, and $\\langle 1, 2, 3 \\rangle \\cdot \\langle 1, 2, 3 \\rangle = 1 + 4 + 9 = 14 = \\|\\langle 1, 2, 3 \\rangle\\|^2$.

In this lesson we find dot products from components, test whether two vectors are perpendicular, and find the multiple that makes a combination perpendicular to a vector.`,
    `公式 $\\mathbf{u} \\cdot \\mathbf{v} = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\cos\\theta$ 需要知道夹角。对沿坐标轴的单位向量，它给出 $\\mathbf{i} \\cdot \\mathbf{i} = 1 \\cdot 1 \\cdot \\cos 0^\\circ = 1$，$\\mathbf{i} \\cdot \\mathbf{j} = 1 \\cdot 1 \\cdot \\cos 90^\\circ = 0$。所以把用 $\\mathbf{i}$、$\\mathbf{j}$、$\\mathbf{k}$ 表示的两个向量乘开时，只有对应的项留下来：

$$\\langle 1, 2, 3 \\rangle \\cdot \\langle 4, -1, 2 \\rangle = 1 \\cdot 4 + 2 \\cdot (-1) + 3 \\cdot 2 = 8$$

检验：向量与自身的点积等于它的模的平方，而 $\\langle 1, 2, 3 \\rangle \\cdot \\langle 1, 2, 3 \\rangle = 1 + 4 + 9 = 14 = \\|\\langle 1, 2, 3 \\rangle\\|^2$。

这节课我们由分量求点积，判断两个向量是否垂直，并求使组合向量与某向量垂直的倍数。`,
  ),
  knowledgePoints: [
    {
      id: "algebraic-dot-product-in-2d-and-3d",
      title: t("Algebraic dot product in 2D and 3D", "二维与三维向量的坐标数量积"),
      explanation: t(
        "To find a dot product from components, multiply the matching components of the two vectors and add the products; the result is a number, not a vector. Using component form:\n\n- In 2D: $\\langle u_1, u_2 \\rangle \\cdot \\langle v_1, v_2 \\rangle = u_1 v_1 + u_2 v_2$\n- In 3D: $\\langle u_1, u_2, u_3 \\rangle \\cdot \\langle v_1, v_2, v_3 \\rangle = u_1 v_1 + u_2 v_2 + u_3 v_3$\n\nFor example:\n\n$$\\langle 2, -1, 3 \\rangle \\cdot \\langle 4, 5, -2 \\rangle = 8 - 5 - 6 = -3$$\n\nCheck: the sum of the two vectors is $\\langle 6, 4, 1 \\rangle$, and\n\n$$\\frac{\\|\\mathbf{u} + \\mathbf{v}\\|^2 - \\|\\mathbf{u}\\|^2 - \\|\\mathbf{v}\\|^2}{2} = \\frac{53 - 14 - 45}{2} = -3$$\n\n> **Watch out.** Multiply matching components and then add all the products; the answer is one number, not a vector. Keep the signs: $(-1)(5) = -5$, and a sum of products can be negative.",
        "由分量求点积时，把两个向量对应的分量相乘再把积相加；结果是一个数，而不是向量。利用坐标分量表示：\n\n- 二维：$\\langle u_1, u_2 \\rangle \\cdot \\langle v_1, v_2 \\rangle = u_1 v_1 + u_2 v_2$\n- 三维：$\\langle u_1, u_2, u_3 \\rangle \\cdot \\langle v_1, v_2, v_3 \\rangle = u_1 v_1 + u_2 v_2 + u_3 v_3$\n\n例如：\n\n$$\\langle 2, -1, 3 \\rangle \\cdot \\langle 4, 5, -2 \\rangle = 8 - 5 - 6 = -3$$\n\n检验：两向量之和是 $\\langle 6, 4, 1 \\rangle$，而\n\n$$\\frac{\\|\\mathbf{u} + \\mathbf{v}\\|^2 - \\|\\mathbf{u}\\|^2 - \\|\\mathbf{v}\\|^2}{2} = \\frac{53 - 14 - 45}{2} = -3$$\n\n> **注意。** 对应分量相乘，再把所有的积相加；结果是一个数，不是向量。注意符号：$(-1)(5) = -5$，积的和也可以是负数。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const u: Vec3 = [
            rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]),
            rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]),
            rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]),
          ];
          const v: Vec3 = [
            rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]),
            rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]),
            rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]),
          ];
          const ans = dot3(u, v);
          const w1 = u[0] * v[0] - u[1] * v[1] + u[2] * v[2];
          const s = add3(u, v);

          return numberProblem({
            prompt: t(
              `Calculate the dot product $\\mathbf{u} \\cdot \\mathbf{v}$ for $\\mathbf{u} = ${vec3Latex(u)}$ and $\\mathbf{v} = ${vec3Latex(v)}$.`,
              `计算向量 $\\mathbf{u} = ${vec3Latex(u)}$ 与 $\\mathbf{v} = ${vec3Latex(v)}$ 的数量积 $\\mathbf{u} \\cdot \\mathbf{v}$。`,
            ),
            answer: ans,
            form: "integer",
            wrong: [w1, -ans, ans + 4, ans - 5],
            solution: walked(
              [
                [
                  ["Multiply matching components", "对应分量相乘"],
                  t("Multiply the first components, the second and the third:", "第一、第二、第三个分量分别相乘："),
                  [
                    `(${u[0]})(${v[0]}) = ${u[0] * v[0]}, \\quad (${u[1]})(${v[1]}) = ${u[1] * v[1]}, \\quad (${u[2]})(${v[2]}) = ${u[2] * v[2]}`,
                  ],
                ],
                [
                  ["Add the products", "把积相加"],
                  t("The dot product is the sum of the three products:", "点积是这三个积的和："),
                  [`\\mathbf{u} \\cdot \\mathbf{v} = ${u[0] * v[0]} + ${paren(u[1] * v[1])} + ${paren(u[2] * v[2])} = ${ans}`],
                ],
              ],
              t(
                `From lengths alone, $\\|\\mathbf{u} + \\mathbf{v}\\|^2 = \\|\\mathbf{u}\\|^2 + 2\\,\\mathbf{u} \\cdot \\mathbf{v} + \\|\\mathbf{v}\\|^2$. Here $\\mathbf{u} + \\mathbf{v} = ${vec3Latex(s)}$, so\n\n$$\\frac{${magSq3(s)} - ${magSq3(u)} - ${magSq3(v)}}{2} = ${ans}$$`,
                `只用长度也能求：$\\|\\mathbf{u} + \\mathbf{v}\\|^2 = \\|\\mathbf{u}\\|^2 + 2\\,\\mathbf{u} \\cdot \\mathbf{v} + \\|\\mathbf{v}\\|^2$。这里 $\\mathbf{u} + \\mathbf{v} = ${vec3Latex(s)}$，所以\n\n$$\\frac{${magSq3(s)} - ${magSq3(u)} - ${magSq3(v)}}{2} = ${ans}$$`,
              ),
            ),
          });
        }

        const u: Vec2 = [rng.pick([-9, -7, -5, -3, -1, 1, 3, 5, 7, 9]), rng.pick([-8, -6, -4, -2, 2, 4, 6, 8])];
        const v: Vec2 = [rng.pick([-9, -7, -5, -3, -1, 1, 3, 5, 7, 9]), rng.pick([-8, -6, -4, -2, 2, 4, 6, 8])];
        const ans = dot2(u, v);
        const w1 = u[0] * v[0] - u[1] * v[1];
        const s: Vec2 = [u[0] + v[0], u[1] + v[1]];
        const sq = (a: Vec2) => dot2(a, a);

        return numberProblem({
          prompt: t(
            `Calculate the dot product $\\mathbf{u} \\cdot \\mathbf{v}$ for $\\mathbf{u} = ${vec2Latex(u)}$ and $\\mathbf{v} = ${vec2Latex(v)}$.`,
            `计算二维向量 $\\mathbf{u} = ${vec2Latex(u)}$ 与 $\\mathbf{v} = ${vec2Latex(v)}$ 的数量积 $\\mathbf{u} \\cdot \\mathbf{v}$。`,
          ),
          answer: ans,
          form: "integer",
          wrong: [w1, -ans, ans + 3, ans - 2],
          solution: walked(
            [
              [
                ["Multiply matching components", "对应分量相乘"],
                t("Multiply the first components and the second:", "第一、第二个分量分别相乘："),
                [`(${u[0]})(${v[0]}) = ${u[0] * v[0]}, \\quad (${u[1]})(${v[1]}) = ${u[1] * v[1]}`],
              ],
              [
                ["Add the products", "把积相加"],
                t("The dot product is the sum of the two products:", "点积是这两个积的和："),
                [`\\mathbf{u} \\cdot \\mathbf{v} = ${u[0] * v[0]} + ${paren(u[1] * v[1])} = ${ans}`],
              ],
            ],
            t(
              `From lengths alone, $\\|\\mathbf{u} + \\mathbf{v}\\|^2 = \\|\\mathbf{u}\\|^2 + 2\\,\\mathbf{u} \\cdot \\mathbf{v} + \\|\\mathbf{v}\\|^2$. Here $\\mathbf{u} + \\mathbf{v} = ${vec2Latex(s)}$, so\n\n$$\\frac{${sq(s)} - ${sq(u)} - ${sq(v)}}{2} = ${ans}$$`,
              `只用长度也能求：$\\|\\mathbf{u} + \\mathbf{v}\\|^2 = \\|\\mathbf{u}\\|^2 + 2\\,\\mathbf{u} \\cdot \\mathbf{v} + \\|\\mathbf{v}\\|^2$。这里 $\\mathbf{u} + \\mathbf{v} = ${vec2Latex(s)}$，所以\n\n$$\\frac{${sq(s)} - ${sq(u)} - ${sq(v)}}{2} = ${ans}$$`,
            ),
          ),
        });
      },
    },
    {
      id: "testing-orthogonality-using-the-dot-product",
      title: t("Testing orthogonality using the dot product", "利用数量积判定向量垂直"),
      figure: remainingDrawings7["calculating-the-dot-product-using-components#testing-orthogonality-using-the-dot-product"],
      explanation: t(
        "Two nonzero vectors $\\mathbf{u}$ and $\\mathbf{v}$ are perpendicular (orthogonal) if and only if their dot product is zero:\n\n$$\\mathbf{u} \\perp \\mathbf{v} \\iff \\mathbf{u} \\cdot \\mathbf{v} = 0$$\n\nFor $\\mathbf{u} = \\langle 2, -1, 3 \\rangle$ and $\\mathbf{v} = \\langle 1, 5, k \\rangle$, setting $2 - 5 + 3k = 0$ gives $k = 1$. Check:\n\n$$\\langle 2, -1, 3 \\rangle \\cdot \\langle 1, 5, 1 \\rangle = 2 - 5 + 3 = 0$$\n\n> **Watch out.** Perpendicular means the dot product is $0$, not that matching components are equal or opposite. Solve the linear equation for $k$ carefully, moving the constant across with its sign changed.",
        "两个非零向量 $\\mathbf{u}$ 与 $\\mathbf{v}$ 垂直（正交）当且仅当它们的数量积为零：\n\n$$\\mathbf{u} \\perp \\mathbf{v} \\iff \\mathbf{u} \\cdot \\mathbf{v} = 0$$\n\n对 $\\mathbf{u} = \\langle 2, -1, 3 \\rangle$ 和 $\\mathbf{v} = \\langle 1, 5, k \\rangle$，令 $2 - 5 + 3k = 0$，得 $k = 1$。检验：\n\n$$\\langle 2, -1, 3 \\rangle \\cdot \\langle 1, 5, 1 \\rangle = 2 - 5 + 3 = 0$$\n\n> **注意。** 垂直的意思是点积为 $0$，不是对应分量相等或相反。仔细解关于 $k$ 的一次方程，常数移到另一边时要变号。",
      ),
      generate(rng) {
        const c = rng.pick([-3, -2, -1, 1, 2, 3]);
        const a = rng.pick([-4, -3, -2, 2, 3, 4]);
        const b = rng.pick([-4, -3, -2, 2, 3, 4]);
        const xs = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
        const ys = [-4, -3, -2, -1, 1, 2, 3, 4];
        const pairs = xs
          .flatMap((px) => ys.map((py) => [px, py] as const))
          .filter(([px, py]) => (a * px + b * py) % c === 0 && a * px + b * py !== 0);
        const [x, y] = rng.pick(pairs);
        const known = a * x + b * y;
        const ansK = -known / c;

        const uVec: Vec3 = [a, b, c];
        const vVecPrompt = `\\langle ${x}, ${y}, k \\rangle`;

        return numberProblem({
          prompt: t(
            `Find the value of $k$ such that the vectors $\\mathbf{u} = ${vec3Latex(uVec)}$ and $\\mathbf{v} = ${vVecPrompt}$ are orthogonal.`,
            `求使向量 $\\mathbf{u} = ${vec3Latex(uVec)}$ 与 $\\mathbf{v} = ${vVecPrompt}$ 正交（互相垂直）的实数 $k$ 的值。`,
          ),
          answer: ansK,
          solveFor: "k",
          form: "integer",
          wrong: [-ansK, ansK + 1, ansK - 2, ansK + 3],
          solution: walked(
            [
              [
                ["Set the dot product to zero", "令点积为零"],
                t("Orthogonal vectors have a dot product of $0$:", "正交的向量点积为 $0$："),
                [`\\mathbf{u} \\cdot \\mathbf{v} = (${a})(${x}) + (${b})(${y}) + (${c})k = 0`],
              ],
              [
                ["Solve for k", "解出 k"],
                t("Collect the known products and solve the linear equation:", "合并已知的积，解这个一次方程："),
                [`${poly([known, ""], [c, "k"])} = 0`, `k = ${ansK}`],
              ],
            ],
            t(
              `With $k = ${ansK}$ the dot product is\n\n$$(${a})(${x}) + (${b})(${y}) + (${c})(${ansK}) = ${a * x} + ${paren(b * y)} + ${paren(c * ansK)} = 0$$`,
              `$k = ${ansK}$ 时点积为\n\n$$(${a})(${x}) + (${b})(${y}) + (${c})(${ansK}) = ${a * x} + ${paren(b * y)} + ${paren(c * ansK)} = 0$$`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── 5.19.3 The Angle Between Two Vectors ───────────────────────────────────

/** theAngleBetweenTwoVectors calculates the angle between 2D or 3D vectors. */
export const theAngleBetweenTwoVectors: TopicDef = {
  id: "the-angle-between-two-vectors",
  title: t("The Angle Between Two Vectors", "计算两向量的夹角"),
  summary: t(
    "Find the cosine of the angle between two vectors and determine the exact angle in degrees or radians.",
    "计算两向量夹角的余弦值，并求出以度或弧度表示的精确夹角。",
  ),
  prerequisites: ["calculating-the-dot-product-using-components"],
  encompasses: [{ topic: "calculating-the-dot-product-using-components", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSN.VM.C.11"],
  intro: t(
    `Components give the dot product, components give the magnitudes, and $\\mathbf{u} \\cdot \\mathbf{v} = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\cos\\theta$ ties them to the angle. So the angle can be found from components alone. For $\\langle 1, 0, 0 \\rangle$ and $\\langle 1, 1, 0 \\rangle$ the dot product is $1$ and the magnitudes are $1$ and $\\sqrt{2}$, so

$$\\cos\\theta = \\frac{1}{1 \\cdot \\sqrt{2}} = \\frac{\\sqrt{2}}{2}$$

and $\\theta = 45^\\circ$.

Check: $\\langle 1, 1, 0 \\rangle$ is the diagonal of a unit square in the $xy$-plane, and a diagonal of a square makes $45^\\circ$ with its side along the $x$-axis.

In this lesson we find the cosine of the angle between two vectors, find exact angles, and read the sign of a dot product from a drawing.`,
    `分量给出点积，分量也给出模，而 $\\mathbf{u} \\cdot \\mathbf{v} = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\cos\\theta$ 把它们和夹角联系起来。所以只用分量就能求出夹角。对 $\\langle 1, 0, 0 \\rangle$ 和 $\\langle 1, 1, 0 \\rangle$，点积是 $1$，模是 $1$ 和 $\\sqrt{2}$，所以

$$\\cos\\theta = \\frac{1}{1 \\cdot \\sqrt{2}} = \\frac{\\sqrt{2}}{2}$$

于是 $\\theta = 45^\\circ$。

检验：$\\langle 1, 1, 0 \\rangle$ 是 $xy$ 平面内单位正方形的对角线，而正方形的对角线与沿 $x$ 轴的边成 $45^\\circ$。

这节课我们求两向量夹角的余弦，求精确的夹角，并由图判断点积的符号。`,
  ),
  knowledgePoints: [
    {
      id: "cosine-formula-for-angle-between-vectors",
      title: t("Cosine formula for angle between vectors", "两向量夹角的余弦公式"),
      figure: remainingDrawings7["the-angle-between-two-vectors#cosine-formula-for-angle-between-vectors"],
      explanation: t(
        "The dot product equals the product of the lengths times the cosine of the angle, so dividing by the lengths isolates the cosine. The cosine of the angle $\\theta$ between two nonzero vectors $\\mathbf{u}$ and $\\mathbf{v}$ is given by:\n\n$$\\cos\\theta = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\| \\|\\mathbf{v}\\|}$$\n\nFor $\\langle 1, 2, 2 \\rangle$ and $\\langle 2, 3, 6 \\rangle$ the dot product is $2 + 6 + 12 = 20$ and the magnitudes are $3$ and $7$, so $\\cos\\theta = \\frac{20}{21}$. Check by the law of cosines: the difference $\\langle -1, -1, -4 \\rangle$ has squared length $18$, and\n\n$$\\frac{9 + 49 - 18}{2 \\cdot 3 \\cdot 7} = \\frac{40}{42} = \\frac{20}{21}$$\n\n> **Watch out.** Divide by the product of both magnitudes, not by one of them or by their sum. The cosine always lies between $-1$ and $1$; a value outside that range means an arithmetic slip.",
        "点积等于两个长度的积乘以夹角的余弦，所以除以两个长度就能单独得到余弦。两非零向量 $\\mathbf{u}$ 与 $\\mathbf{v}$ 夹角 $\\theta$ 的余弦值为：\n\n$$\\cos\\theta = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\| \\|\\mathbf{v}\\|}$$\n\n对 $\\langle 1, 2, 2 \\rangle$ 和 $\\langle 2, 3, 6 \\rangle$，点积是 $2 + 6 + 12 = 20$，模是 $3$ 和 $7$，所以 $\\cos\\theta = \\frac{20}{21}$。用余弦定理检验：差向量 $\\langle -1, -1, -4 \\rangle$ 长度的平方是 $18$，而\n\n$$\\frac{9 + 49 - 18}{2 \\cdot 3 \\cdot 7} = \\frac{40}{42} = \\frac{20}{21}$$\n\n> **注意。** 要除以两个模的积，而不是其中一个模或两个模的和。余弦总在 $-1$ 和 $1$ 之间；超出这个范围就说明算错了。",
      ),
      generate(rng) {
        const [u, Lu] = pickQuadruple(rng);
        const [v, Lv] = pickQuadruple(rng);
        const dot = dot3(u, v);
        const denom = Lu * Lv;
        const cosQ = Q.of(dot, denom);
        const gap = magSq3(sub3(u, v));

        return numberProblem({
          prompt: t(
            `Find $\\cos\\theta$, where $\\theta$ is the angle between the vectors $\\mathbf{u} = ${vec3Latex(u)}$ and $\\mathbf{v} = ${vec3Latex(v)}$.`,
            `求向量 $\\mathbf{u} = ${vec3Latex(u)}$ 与 $\\mathbf{v} = ${vec3Latex(v)}$ 的夹角 $\\theta$ 的余弦值 $\\cos\\theta$。`,
          ),
          answer: cosQ,
          wrong: [cosQ.neg(), Q.of(dot, denom > 1 ? denom - 1 : 2), Q.of(Math.abs(dot) + 1, denom), 0],
          solution: walked(
            [
              [
                ["Find the dot product", "求点积"],
                t("Multiply matching components and add:", "对应分量相乘再相加："),
                [`\\mathbf{u} \\cdot \\mathbf{v} = (${u[0]})(${v[0]}) + (${u[1]})(${v[1]}) + (${u[2]})(${v[2]}) = ${dot}`],
              ],
              [
                ["Find the magnitudes", "求模"],
                t("Each magnitude is the square root of the sum of the squares:", "每个模都是平方和的平方根："),
                [`\\|\\mathbf{u}\\| = \\sqrt{${magSq3(u)}} = ${Lu}, \\quad \\|\\mathbf{v}\\| = \\sqrt{${magSq3(v)}} = ${Lv}`],
              ],
              [
                ["Divide", "相除"],
                t("Divide the dot product by the product of the magnitudes:", "把点积除以两模之积："),
                [`\\cos\\theta = \\frac{${dot}}{(${Lu})(${Lv})} = ${cosQ.toLatex()}`],
              ],
            ],
            t(
              `The law of cosines gives the same value from lengths alone. The difference $\\mathbf{u} - \\mathbf{v} = ${vec3Latex(sub3(u, v))}$ has squared length $${gap}$, and\n\n$$\\frac{\\|\\mathbf{u}\\|^2 + \\|\\mathbf{v}\\|^2 - \\|\\mathbf{u} - \\mathbf{v}\\|^2}{2\\|\\mathbf{u}\\|\\|\\mathbf{v}\\|} = \\frac{${Lu * Lu} + ${Lv * Lv} - ${gap}}{${2 * denom}} = ${cosQ.toLatex()}$$`,
              `余弦定理只用长度也给出同样的值。差向量 $\\mathbf{u} - \\mathbf{v} = ${vec3Latex(sub3(u, v))}$ 长度的平方是 $${gap}$，而\n\n$$\\frac{\\|\\mathbf{u}\\|^2 + \\|\\mathbf{v}\\|^2 - \\|\\mathbf{u} - \\mathbf{v}\\|^2}{2\\|\\mathbf{u}\\|\\|\\mathbf{v}\\|} = \\frac{${Lu * Lu} + ${Lv * Lv} - ${gap}}{${2 * denom}} = ${cosQ.toLatex()}$$`,
            ),
          ),
        });
      },
    },
    {
      id: "determining-the-exact-angle-between-vectors",
      title: t("Determining the exact angle between vectors", "求两向量夹角的精确值"),
      explanation: t(
        "The angle between two vectors always lies between $0^{\\circ}$ and $180^{\\circ}$, so a single arccosine gives it without any ambiguity. Once $\\cos\\theta$ is determined, the angle $\\theta \\in [0^\\circ, 180^\\circ]$ is found by evaluating $\\arccos(\\cos\\theta)$. The special values to know are:\n\n$$\\begin{array}{c|ccccccc} \\cos\\theta & 1 & \\frac{\\sqrt{2}}{2} & \\frac{1}{2} & 0 & -\\frac{1}{2} & -\\frac{\\sqrt{2}}{2} & -1 \\\\ \\hline \\theta & 0^\\circ & 45^\\circ & 60^\\circ & 90^\\circ & 120^\\circ & 135^\\circ & 180^\\circ \\end{array}$$\n\nFor $\\langle 1, 1, 0 \\rangle$ and $\\langle 0, 1, 1 \\rangle$ the dot product is $1$ and both magnitudes are $\\sqrt{2}$, so $\\cos\\theta = \\frac{1}{2}$ and $\\theta = 60^\\circ$. Check: with $\\langle 1, 0, 1 \\rangle$ these are three diagonals of faces of a cube, and their tips form an equilateral triangle, whose angles are $60^\\circ$.\n\n> **Watch out.** A negative cosine gives an angle over $90^\\circ$: $-\\frac{1}{2}$ means $120^\\circ$, not $60^\\circ$ or $-60^\\circ$. Multiplying a vector by a positive number does not change the angle, so common factors can be removed first.",
        "两个向量的夹角总在 0° 到 180° 之间，所以用一次反余弦就能毫无歧义地得到它。求出 $\\cos\\theta$ 后，通过 $\\arccos(\\cos\\theta)$ 确定夹角 $\\theta \\in [0^\\circ, 180^\\circ]$。需要记住的特殊值是：\n\n$$\\begin{array}{c|ccccccc} \\cos\\theta & 1 & \\frac{\\sqrt{2}}{2} & \\frac{1}{2} & 0 & -\\frac{1}{2} & -\\frac{\\sqrt{2}}{2} & -1 \\\\ \\hline \\theta & 0^\\circ & 45^\\circ & 60^\\circ & 90^\\circ & 120^\\circ & 135^\\circ & 180^\\circ \\end{array}$$\n\n对 $\\langle 1, 1, 0 \\rangle$ 和 $\\langle 0, 1, 1 \\rangle$，点积是 $1$，两个模都是 $\\sqrt{2}$，所以 $\\cos\\theta = \\frac{1}{2}$，$\\theta = 60^\\circ$。检验：加上 $\\langle 1, 0, 1 \\rangle$，这是正方体三个面的对角线，它们的端点构成等边三角形，其内角都是 $60^\\circ$。\n\n> **注意。** 余弦为负时角大于 $90^\\circ$：$-\\frac{1}{2}$ 对应 $120^\\circ$，不是 $60^\\circ$，也不是 $-60^\\circ$。向量乘以正数不改变夹角，所以可以先约去公因数。",
      ),
      generate(rng) {
        const item = rng.pick(specialAnglePairs);
        const scaleU = rng.pick([1, 2, 3, 4, 5, 6]);
        const scaleV = rng.pick([1, 2, 3, 4]);
        const swap = rng.bool();
        const baseU = swap ? item.v : item.u;
        const baseV = swap ? item.u : item.v;
        const uScaled = smul3(scaleU, baseU);
        const vScaled = smul3(scaleV, baseV);
        const dot = dot3(uScaled, vScaled);
        const mu = magSq3(uScaled);
        const mv = magSq3(vScaled);
        const baseDot = dot3(baseU, baseV);
        const bu = magSq3(baseU);
        const bv = magSq3(baseV);
        const gap = magSq3(sub3(uScaled, vScaled));
        /** times writes a positive multiple of a vector, leaving out a factor of 1. */
        const times = (k: number, w: Vec3) => `${k === 1 ? "" : k}${vec3Latex(w)}`;

        return numberProblem({
          prompt: t(
            `Find the angle $\\theta$ between the vectors $\\mathbf{u} = ${vec3Latex(uScaled)}$ and $\\mathbf{v} = ${vec3Latex(vScaled)}$ in degrees.`,
            `求向量 $\\mathbf{u} = ${vec3Latex(uScaled)}$ 与 $\\mathbf{v} = ${vec3Latex(vScaled)}$ 的夹角 $\\theta$（以度为单位）。`,
          ),
          answer: item.degNum,
          unit: "°",
          form: "integer",
          wrong: item.wrongs,
          solution: walked(
            [
              [
                ["Find the dot product and magnitudes", "求点积和模"],
                t("Work from the components:", "由分量计算："),
                [
                  `\\mathbf{u} \\cdot \\mathbf{v} = ${dot}, \\quad \\|\\mathbf{u}\\| = ${rootLatex(mu)}, \\quad \\|\\mathbf{v}\\| = ${rootLatex(mv)}`,
                ],
              ],
              [
                ["Find the cosine", "求余弦"],
                t("Divide the dot product by the product of the magnitudes:", "把点积除以两模之积："),
                [`\\cos\\theta = \\frac{${dot}}{${rootLatex(mu * mv)}} = ${item.cosStr}`],
              ],
              [
                ["Name the angle", "确定角"],
                t(
                  `The angle between $0^\\circ$ and $180^\\circ$ with this cosine is $${item.degNum}^\\circ$.`,
                  `在 $0^\\circ$ 到 $180^\\circ$ 之间、余弦为这个值的角是 $${item.degNum}^\\circ$。`,
                ),
              ],
            ],
            scaleU === 1 && scaleV === 1
              ? t(
                  `The law of cosines gives the cosine from lengths alone. The difference $\\mathbf{u} - \\mathbf{v} = ${vec3Latex(sub3(uScaled, vScaled))}$ has squared length $${gap}$, and\n\n$$\\frac{${mu} + ${mv} - ${gap}}{2 \\cdot ${rootLatex(mu * mv)}} = ${item.cosStr}$$`,
                  `余弦定理只用长度也能求出余弦。差向量 $\\mathbf{u} - \\mathbf{v} = ${vec3Latex(sub3(uScaled, vScaled))}$ 长度的平方是 $${gap}$，而\n\n$$\\frac{${mu} + ${mv} - ${gap}}{2 \\cdot ${rootLatex(mu * mv)}} = ${item.cosStr}$$`,
                )
              : t(
                  `Positive multiples do not change the angle, so $\\mathbf{u} = ${times(scaleU, baseU)}$ and $\\mathbf{v} = ${times(scaleV, baseV)}$ can be replaced by the vectors without their factors. Their dot product is $${baseDot}$ and their squared magnitudes are $${bu}$ and $${bv}$, so again\n\n$$\\cos\\theta = \\frac{${baseDot}}{${rootLatex(bu * bv)}} = ${item.cosStr}$$`,
                  `乘以正数不改变夹角，所以 $\\mathbf{u} = ${times(scaleU, baseU)}$、$\\mathbf{v} = ${times(scaleV, baseV)}$ 可以换成去掉因数的向量。它们的点积是 $${baseDot}$，模的平方是 $${bu}$ 和 $${bv}$，所以同样有\n\n$$\\cos\\theta = \\frac{${baseDot}}{${rootLatex(bu * bv)}} = ${item.cosStr}$$`,
                ),
          ),
        });
      },
    },
  ],
};

// ─── 5.19.4 Calculating a Scalar Projection ──────────────────────────────────

/** calculatingAScalarProjection covers comp_v u = (u · v) / ||v||. */
export const calculatingAScalarProjection: TopicDef = {
  id: "calculating-a-scalar-projection",
  title: t("Calculating a Scalar Projection", "计算标量投影（数量投影）"),
  summary: t(
    "Calculate the scalar projection of one vector onto another and interpret its geometric meaning and sign.",
    "计算一个向量在另一个向量方向上的标量投影，并理解其几何意义与符号。",
  ),
  prerequisites: ["the-angle-between-two-vectors"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.11"],
  intro: t(
    `Drop a perpendicular from the tip of $\\mathbf{u}$ onto the line of $\\mathbf{v}$. The foot marks how far $\\mathbf{u}$ reaches along $\\mathbf{v}$: in the right triangle that forms, the side along $\\mathbf{v}$ is $\\|\\mathbf{u}\\|\\cos\\theta$. Since $\\mathbf{u} \\cdot \\mathbf{v} = \\|\\mathbf{u}\\|\\|\\mathbf{v}\\|\\cos\\theta$, that length is $\\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{v}\\|}$. For $\\mathbf{u} = \\langle 3, 4, 0 \\rangle$ along $\\mathbf{v} = \\langle 2, 0, 0 \\rangle$:

$$\\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{v}\\|} = \\frac{6}{2} = 3$$

Check: $\\mathbf{v}$ lies along the $x$-axis, and the foot of the perpendicular from $(3, 4, 0)$ to that axis is at $x = 3$.

In this lesson we find scalar projections, read what their sign says about the angle, and turn a scalar projection into a vector projection.`,
    `从 $\\mathbf{u}$ 的终点向 $\\mathbf{v}$ 所在直线作垂线。垂足标出 $\\mathbf{u}$ 沿 $\\mathbf{v}$ 伸出了多远：在构成的直角三角形中，沿 $\\mathbf{v}$ 的边长是 $\\|\\mathbf{u}\\|\\cos\\theta$。因为 $\\mathbf{u} \\cdot \\mathbf{v} = \\|\\mathbf{u}\\|\\|\\mathbf{v}\\|\\cos\\theta$，这个长度就是 $\\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{v}\\|}$。对 $\\mathbf{u} = \\langle 3, 4, 0 \\rangle$ 沿 $\\mathbf{v} = \\langle 2, 0, 0 \\rangle$：

$$\\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{v}\\|} = \\frac{6}{2} = 3$$

检验：$\\mathbf{v}$ 沿 $x$ 轴，从 $(3, 4, 0)$ 向这条轴作垂线，垂足在 $x = 3$ 处。

这节课我们求标量投影，由它的符号判断夹角，并把标量投影变成向量投影。`,
  ),
  knowledgePoints: [
    {
      id: "concept-and-formula-of-scalar-projection",
      title: t("Concept and formula of scalar projection", "标量投影的概念与公式"),
      explanation: t(
        "The scalar projection (scalar component) of vector $\\mathbf{u}$ onto vector $\\mathbf{v}$ is the signed length of the projection of $\\mathbf{u}$ along $\\mathbf{v}$:\n\n$$\\text{comp}_{\\mathbf{v}}\\mathbf{u} = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{v}\\|} = \\|\\mathbf{u}\\|\\cos\\theta$$\n\nFor $\\mathbf{u} = \\langle 2, 3, 1 \\rangle$ onto $\\mathbf{v} = \\langle 1, 2, 2 \\rangle$: $\\mathbf{u} \\cdot \\mathbf{v} = 10$ and $\\|\\mathbf{v}\\| = 3$, so the scalar projection is $\\frac{10}{3}$. Check: the unit vector along $\\mathbf{v}$ is $\\frac{1}{3}\\langle 1, 2, 2 \\rangle$, and\n\n$$\\langle 2, 3, 1 \\rangle \\cdot \\frac{1}{3}\\langle 1, 2, 2 \\rangle = \\frac{2 + 6 + 2}{3} = \\frac{10}{3}$$\n\n> **Watch out.** Divide by the magnitude of $\\mathbf{v}$, the vector projected onto, not by $\\|\\mathbf{u}\\|$. Dividing by $\\|\\mathbf{v}\\|^2$ gives the factor of the vector projection instead.",
        "向量 $\\mathbf{u}$ 在向量 $\\mathbf{v}$ 上的标量投影（数量投影）是 $\\mathbf{u}$ 沿 $\\mathbf{v}$ 方向投影的有向长度：\n\n$$\\text{comp}_{\\mathbf{v}}\\mathbf{u} = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{v}\\|} = \\|\\mathbf{u}\\|\\cos\\theta$$\n\n对 $\\mathbf{u} = \\langle 2, 3, 1 \\rangle$ 投影到 $\\mathbf{v} = \\langle 1, 2, 2 \\rangle$：$\\mathbf{u} \\cdot \\mathbf{v} = 10$，$\\|\\mathbf{v}\\| = 3$，所以标量投影是 $\\frac{10}{3}$。检验：沿 $\\mathbf{v}$ 的单位向量是 $\\frac{1}{3}\\langle 1, 2, 2 \\rangle$，而\n\n$$\\langle 2, 3, 1 \\rangle \\cdot \\frac{1}{3}\\langle 1, 2, 2 \\rangle = \\frac{2 + 6 + 2}{3} = \\frac{10}{3}$$\n\n> **注意。** 要除以被投影到的向量 $\\mathbf{v}$ 的模，而不是 $\\|\\mathbf{u}\\|$。除以 $\\|\\mathbf{v}\\|^2$ 得到的是向量投影的系数。",
      ),
      generate(rng) {
        const [v, Lv] = pickQuadruple(rng);
        const u: Vec3 = [
          rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]),
          rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]),
          rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]),
        ];
        const dot = dot3(u, v);
        const ansQ = Q.of(dot, Lv);
        const unit = qVec3Latex([Q.of(v[0], Lv), Q.of(v[1], Lv), Q.of(v[2], Lv)]);

        return numberProblem({
          prompt: t(
            `Find the scalar projection $\\text{comp}_{\\mathbf{v}}\\mathbf{u}$ of $\\mathbf{u} = ${vec3Latex(u)}$ onto $\\mathbf{v} = ${vec3Latex(v)}$.`,
            `求向量 $\\mathbf{u} = ${vec3Latex(u)}$ 在向量 $\\mathbf{v} = ${vec3Latex(v)}$ 上的标量投影 $\\text{comp}_{\\mathbf{v}}\\mathbf{u}$。`,
          ),
          answer: ansQ,
          wrong: [ansQ.neg(), Q.of(dot, Lv * Lv), dot, Q.of(dot + 1, Lv)],
          solution: walked(
            [
              [
                ["Find the dot product", "求点积"],
                t("Multiply matching components and add:", "对应分量相乘再相加："),
                [`\\mathbf{u} \\cdot \\mathbf{v} = (${u[0]})(${v[0]}) + (${u[1]})(${v[1]}) + (${u[2]})(${v[2]}) = ${dot}`],
              ],
              [
                ["Find the magnitude of v", "求 v 的模"],
                t("Only the vector projected onto is measured:", "只需要被投影到的向量的模："),
                [`\\|\\mathbf{v}\\| = \\sqrt{${magSq3(v)}} = ${Lv}`],
              ],
              [
                ["Divide", "相除"],
                t("Divide the dot product by that magnitude:", "把点积除以这个模："),
                [`\\text{comp}_{\\mathbf{v}}\\mathbf{u} = \\frac{${dot}}{${Lv}} = ${ansQ.toLatex()}`],
              ],
            ],
            t(
              `The scalar projection is also the dot product of $\\mathbf{u}$ with the unit vector $${unit}$ along $\\mathbf{v}$:\n\n$$\\frac{(${u[0]})(${v[0]}) + (${u[1]})(${v[1]}) + (${u[2]})(${v[2]})}{${Lv}} = ${ansQ.toLatex()}$$`,
              `标量投影也等于 $\\mathbf{u}$ 与沿 $\\mathbf{v}$ 的单位向量 $${unit}$ 的点积：\n\n$$\\frac{(${u[0]})(${v[0]}) + (${u[1]})(${v[1]}) + (${u[2]})(${v[2]})}{${Lv}} = ${ansQ.toLatex()}$$`,
            ),
          ),
        });
      },
    },
    {
      id: "interpreting-the-sign-of-scalar-projection",
      figure: precalculusDrawings2["calculating-a-scalar-projection#interpreting-the-sign-of-scalar-projection"],
      title: t("Interpreting the sign of scalar projection", "标量投影的正负意义与计算"),
      explanation: t(
        "Because $\\text{comp}_{\\mathbf{v}}\\mathbf{u} = \\|\\mathbf{u}\\|\\cos\\theta$:\n\n- $\\text{comp}_{\\mathbf{v}}\\mathbf{u} > 0$ when the angle $\\theta$ is acute;\n- $\\text{comp}_{\\mathbf{v}}\\mathbf{u} = 0$ when $\\mathbf{u} \\perp \\mathbf{v}$;\n- $\\text{comp}_{\\mathbf{v}}\\mathbf{u} < 0$ when $\\theta$ is obtuse, meaning the projection points opposite to $\\mathbf{v}$.\n\nFor $\\mathbf{u} = \\langle -3, 1, 0 \\rangle$ onto $\\mathbf{v} = \\langle 1, 0, 0 \\rangle$ the scalar projection is $\\frac{-3}{1} = -3$, so the angle is obtuse. Check: the foot of the perpendicular from $(-3, 1, 0)$ to the $x$-axis is at $x = -3$, on the side opposite to $\\mathbf{v}$.\n\n> **Watch out.** A negative scalar projection is not an error and not a negative length: it says the shadow of $\\mathbf{u}$ falls behind the start of $\\mathbf{v}$. Its size is still at most $\\|\\mathbf{u}\\|$.",
        "由 $\\text{comp}_{\\mathbf{v}}\\mathbf{u} = \\|\\mathbf{u}\\|\\cos\\theta$ 可知：\n\n- 当夹角 $\\theta$ 为锐角时，$\\text{comp}_{\\mathbf{v}}\\mathbf{u} > 0$；\n- 当 $\\mathbf{u} \\perp \\mathbf{v}$ 时，$\\text{comp}_{\\mathbf{v}}\\mathbf{u} = 0$；\n- 当 $\\theta$ 为钝角时，$\\text{comp}_{\\mathbf{v}}\\mathbf{u} < 0$，表示投影方向与 $\\mathbf{v}$ 反向。\n\n对 $\\mathbf{u} = \\langle -3, 1, 0 \\rangle$ 投影到 $\\mathbf{v} = \\langle 1, 0, 0 \\rangle$，标量投影是 $\\frac{-3}{1} = -3$，所以夹角是钝角。检验：从 $(-3, 1, 0)$ 向 $x$ 轴作垂线，垂足在 $x = -3$，位于 $\\mathbf{v}$ 的反方向一侧。\n\n> **注意。** 负的标量投影不是算错，也不是负的长度：它说明 $\\mathbf{u}$ 的影子落在 $\\mathbf{v}$ 起点的后方。它的大小仍不超过 $\\|\\mathbf{u}\\|$。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const val = rng.pick([-15, -12, -9, -6, -4]);
          const Lv = rng.pick([3, 5, 7]);
          const comp = Q.of(val, Lv).toLatex();
          const prompt = t(
            `Two nonzero vectors $\\mathbf{u}$ and $\\mathbf{v}$ satisfy $\\|\\mathbf{v}\\| = ${Lv}$ and $\\text{comp}_{\\mathbf{v}}\\mathbf{u} = ${comp} < 0$. What does the negative sign indicate about the angle $\\theta$ between them?`,
            `已知两非零向量 $\\mathbf{u}$ 与 $\\mathbf{v}$ 满足 $\\|\\mathbf{v}\\| = ${Lv}$ 且 $\\text{comp}_{\\mathbf{v}}\\mathbf{u} = ${comp} < 0$。负号表明两向量夹角 $\\theta$ 属于哪种类型？`,
          );
          const obtuse = t("Obtuse angle ($90^\\circ < \\theta \\le 180^\\circ$)", "钝角（$90^\\circ < \\theta \\le 180^\\circ$）");
          const acute = t("Acute angle ($0^\\circ \\le \\theta < 90^\\circ$)", "锐角（$0^\\circ \\le \\theta < 90^\\circ$）");
          const right = t("Right angle ($\\theta = 90^\\circ$)", "直角（$\\theta = 90^\\circ$）");
          const zero = t("Zero angle ($\\theta = 0^\\circ$)", "零角（$\\theta = 0^\\circ$）");
          return oneOf(
            rng,
            prompt,
            obtuse,
            [acute, right, zero],
            walked(
              [
                [
                  ["Write the projection with the angle", "用夹角写出投影"],
                  t(
                    "The scalar projection is the length of $\\mathbf{u}$ times the cosine of the angle:",
                    "标量投影等于 $\\mathbf{u}$ 的长度乘夹角的余弦：",
                  ),
                  [`\\text{comp}_{\\mathbf{v}}\\mathbf{u} = \\|\\mathbf{u}\\|\\cos\\theta = ${comp}`],
                ],
                [
                  ["Read the sign", "看符号"],
                  t(
                    "Since $\\|\\mathbf{u}\\| > 0$, the cosine is negative, and an angle in $[0^\\circ, 180^\\circ]$ with a negative cosine is obtuse.",
                    "因为 $\\|\\mathbf{u}\\| > 0$，余弦为负；在 $[0^\\circ, 180^\\circ]$ 中余弦为负的角是钝角。",
                  ),
                ],
              ],
              t(
                `Multiplying back by $\\|\\mathbf{v}\\| = ${Lv}$ gives $\\mathbf{u} \\cdot \\mathbf{v} = ${val}$, also negative, which again means an obtuse angle.`,
                `再乘以 $\\|\\mathbf{v}\\| = ${Lv}$，得 $\\mathbf{u} \\cdot \\mathbf{v} = ${val}$，同样为负，同样说明是钝角。`,
              ),
            ),
            [
              why(
                acute,
                "An acute angle has a positive cosine, so its scalar projection would be positive.",
                "锐角的余弦为正，标量投影应为正。",
              ),
              why(right, "At a right angle the scalar projection is $0$, not a negative number.", "直角时标量投影为 $0$，不是负数。"),
              why(
                zero,
                "At $0^\\circ$ the scalar projection is $\\|\\mathbf{u}\\|$, which is positive.",
                "$0^\\circ$ 时标量投影等于 $\\|\\mathbf{u}\\|$，是正数。",
              ),
            ],
          );
        }

        const [v, Lv] = pickQuadruple(rng);
        const k = rng.pick([1, 2, 3]);
        const perp: Vec3 = [-v[1], v[0], 0];
        const u: Vec3 = sub3(perp, smul3(k, v));
        const dot = dot3(u, v);
        const ansQ = Q.of(dot, Lv);
        const kv = k === 1 ? vec3Latex(v) : `${k}${vec3Latex(v)}`;
        const minusKv = k === 1 ? "-\\mathbf{v}" : `-${k}\\mathbf{v}`;

        return numberProblem({
          prompt: t(
            `Given $\\mathbf{u} = ${vec3Latex(u)}$ and $\\mathbf{v} = ${vec3Latex(v)}$, calculate the scalar projection $\\text{comp}_{\\mathbf{v}}\\mathbf{u}$.`,
            `已知 $\\mathbf{u} = ${vec3Latex(u)}$ 且 $\\mathbf{v} = ${vec3Latex(v)}$，计算标量投影 $\\text{comp}_{\\mathbf{v}}\\mathbf{u}$。`,
          ),
          answer: ansQ,
          wrong: [ansQ.neg(), Q.of(dot, Lv * Lv), 0],
          solution: walked(
            [
              [
                ["Find the dot product and magnitude", "求点积和模"],
                t("Work from the components:", "由分量计算："),
                [
                  `\\mathbf{u} \\cdot \\mathbf{v} = (${u[0]})(${v[0]}) + (${u[1]})(${v[1]}) + (${u[2]})(${v[2]}) = ${dot}`,
                  `\\|\\mathbf{v}\\| = \\sqrt{${magSq3(v)}} = ${Lv}`,
                ],
              ],
              [
                ["Divide", "相除"],
                t("Divide the dot product by the magnitude of $\\mathbf{v}$:", "把点积除以 $\\mathbf{v}$ 的模："),
                [`\\text{comp}_{\\mathbf{v}}\\mathbf{u} = \\frac{${dot}}{${Lv}} = ${ansQ.toLatex()}`],
              ],
            ],
            t(
              `Split $\\mathbf{u}$ as $${vec3Latex(perp)} - ${kv}$. The first part has dot product $0$ with $\\mathbf{v}$, so only $${minusKv}$ counts, and it reaches $\\|${minusKv}\\| = ${k * Lv}$ backwards along $\\mathbf{v}$. That is $${ansQ.toLatex()}$, and the negative sign shows the angle is obtuse.`,
              `把 $\\mathbf{u}$ 拆成 $${vec3Latex(perp)} - ${kv}$。第一部分与 $\\mathbf{v}$ 的点积为 $0$，所以只有 $${minusKv}$ 起作用，它沿 $\\mathbf{v}$ 反方向伸出 $\\|${minusKv}\\| = ${k * Lv}$。这就是 $${ansQ.toLatex()}$，负号说明夹角是钝角。`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── 5.19.5 Calculating a Vector Projection ──────────────────────────────────

/** calculatingAVectorProjection covers proj_v u and orthogonal decomposition. */
export const calculatingAVectorProjection: TopicDef = {
  id: "calculating-a-vector-projection",
  title: t("Calculating a Vector Projection", "计算向量投影"),
  summary: t(
    "Compute the vector projection of a vector onto another and decompose a vector into parallel and orthogonal components.",
    "计算一个向量在另一个向量上的向量投影，并将向量正交分解为平行分量与垂直分量。",
  ),
  prerequisites: ["calculating-a-scalar-projection"],
  encompasses: [{ topic: "calculating-a-scalar-projection", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSN.VM.C.11"],
  intro: t(
    `The scalar projection $\\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{v}\\|}$ says how far $\\mathbf{u}$ reaches along $\\mathbf{v}$, but not as a vector. Multiplying it by the unit vector $\\frac{\\mathbf{v}}{\\|\\mathbf{v}\\|}$ turns that signed length into an arrow along $\\mathbf{v}$. For $\\mathbf{u} = \\langle 2, 3, 4 \\rangle$ along $\\mathbf{v} = \\langle 0, 0, 1 \\rangle$ the scalar projection is $4$, and the arrow is

$$4\\langle 0, 0, 1 \\rangle = \\langle 0, 0, 4 \\rangle$$

Check: dropping the point $(2, 3, 4)$ straight onto the $z$-axis lands at $(0, 0, 4)$, and what is left over, $\\langle 2, 3, 0 \\rangle$, lies flat in the $xy$-plane, at right angles to the axis.

In this lesson we compute vector projections and split a vector into a part along another vector and a part orthogonal to it.`,
    `标量投影 $\\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{v}\\|}$ 说明 $\\mathbf{u}$ 沿 $\\mathbf{v}$ 伸出多远，但它不是向量。把它乘以单位向量 $\\frac{\\mathbf{v}}{\\|\\mathbf{v}\\|}$，这个有向长度就变成沿 $\\mathbf{v}$ 的一个箭头。对 $\\mathbf{u} = \\langle 2, 3, 4 \\rangle$ 沿 $\\mathbf{v} = \\langle 0, 0, 1 \\rangle$，标量投影是 $4$，箭头是

$$4\\langle 0, 0, 1 \\rangle = \\langle 0, 0, 4 \\rangle$$

检验：把点 $(2, 3, 4)$ 竖直投到 $z$ 轴上落在 $(0, 0, 4)$，剩下的部分 $\\langle 2, 3, 0 \\rangle$ 平躺在 $xy$ 平面里，与这条轴垂直。

这节课我们计算向量投影，并把一个向量分成沿另一个向量的部分和与它正交的部分。`,
  ),
  knowledgePoints: [
    {
      id: "vector-projection-formula",
      figure: precalculusDrawings4["calculating-a-vector-projection#vector-projection-formula"],
      title: t("Vector projection formula", "向量投影的公式与计算"),
      explanation: t(
        "The vector projection of $\\mathbf{u}$ onto $\\mathbf{v}$ is the vector parallel to $\\mathbf{v}$ obtained by multiplying the unit vector in the direction of $\\mathbf{v}$ by the scalar projection:\n\n$$\\text{proj}_{\\mathbf{v}}\\mathbf{u} = \\left(\\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{v}\\|^2}\\right)\\mathbf{v} = \\left(\\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\mathbf{v} \\cdot \\mathbf{v}}\\right)\\mathbf{v}$$\n\nFor $\\mathbf{u} = \\langle 3, 1, 2 \\rangle$ onto $\\mathbf{v} = \\langle 1, 1, 0 \\rangle$: $\\mathbf{u} \\cdot \\mathbf{v} = 4$ and $\\mathbf{v} \\cdot \\mathbf{v} = 2$, so the projection is $2\\langle 1, 1, 0 \\rangle = \\langle 2, 2, 0 \\rangle$. Check: the leftover is $\\langle 1, -1, 2 \\rangle$, which must be orthogonal to $\\mathbf{v}$, and indeed $1 - 1 + 0 = 0$.\n\n> **Watch out.** The factor is divided by $\\|\\mathbf{v}\\|^2$, not $\\|\\mathbf{v}\\|$: one factor of $\\|\\mathbf{v}\\|$ comes from the scalar projection and one from the unit vector. The answer is a vector parallel to $\\mathbf{v}$, never a number.",
        "向量 $\\mathbf{u}$ 在向量 $\\mathbf{v}$ 上的向量投影是与 $\\mathbf{v}$ 平行的向量，等于标量投影乘以 $\\mathbf{v}$ 方向的单位向量：\n\n$$\\text{proj}_{\\mathbf{v}}\\mathbf{u} = \\left(\\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{v}\\|^2}\\right)\\mathbf{v} = \\left(\\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\mathbf{v} \\cdot \\mathbf{v}}\\right)\\mathbf{v}$$\n\n对 $\\mathbf{u} = \\langle 3, 1, 2 \\rangle$ 投影到 $\\mathbf{v} = \\langle 1, 1, 0 \\rangle$：$\\mathbf{u} \\cdot \\mathbf{v} = 4$，$\\mathbf{v} \\cdot \\mathbf{v} = 2$，所以投影是 $2\\langle 1, 1, 0 \\rangle = \\langle 2, 2, 0 \\rangle$。检验：剩下的部分是 $\\langle 1, -1, 2 \\rangle$，它应与 $\\mathbf{v}$ 正交，确实 $1 - 1 + 0 = 0$。\n\n> **注意。** 系数要除以 $\\|\\mathbf{v}\\|^2$，而不是 $\\|\\mathbf{v}\\|$：一个 $\\|\\mathbf{v}\\|$ 来自标量投影，另一个来自单位向量。结果是与 $\\mathbf{v}$ 平行的向量，而不是一个数。",
      ),
      generate(rng) {
        const v = rng.pick([
          [1, 1, 0] as Vec3,
          [1, 1, 1] as Vec3,
          [2, 1, 0] as Vec3,
          [1, 2, 2] as Vec3,
          [0, 3, 4] as Vec3,
          [2, 2, 1] as Vec3,
        ]);
        const M = magSq3(v);
        const k = rng.pick([-3, -2, -1, 1, 2, 3]);
        const perpCandidates = [[-v[1], v[0], 0] as Vec3, [0, -v[2], v[1]] as Vec3, [-v[2], 0, v[0]] as Vec3];
        const perp = rng.pick(perpCandidates.filter((p) => dot3(p, v) === 0 && magSq3(p) > 0)) ?? [-v[1], v[0], 0];
        const u = add3(smul3(k, v), perp);
        const proj = smul3(k, v);
        const d = dot3(u, v);

        return pointProblem({
          prompt: t(
            `Find the vector projection $\\text{proj}_{\\mathbf{v}}\\mathbf{u}$ of $\\mathbf{u} = ${vec3Latex(u)}$ onto $\\mathbf{v} = ${vec3Latex(v)}$.`,
            `求向量 $\\mathbf{u} = ${vec3Latex(u)}$ 在向量 $\\mathbf{v} = ${vec3Latex(v)}$ 上的向量投影 $\\text{proj}_{\\mathbf{v}}\\mathbf{u}$。`,
          ),
          answer: proj,
          vars: ["x", "y", "z"],
          vector: true,
          wrong: [smul3(-k, v), u, perp, add3(proj, [1, 0, 0])],
          solution: walked(
            [
              [
                ["Find the two dot products", "求两个点积"],
                t(
                  "The formula needs $\\mathbf{u} \\cdot \\mathbf{v}$ and $\\mathbf{v} \\cdot \\mathbf{v}$:",
                  "公式需要 $\\mathbf{u} \\cdot \\mathbf{v}$ 和 $\\mathbf{v} \\cdot \\mathbf{v}$：",
                ),
                [
                  `\\mathbf{u} \\cdot \\mathbf{v} = (${u[0]})(${v[0]}) + (${u[1]})(${v[1]}) + (${u[2]})(${v[2]}) = ${d}`,
                  `\\mathbf{v} \\cdot \\mathbf{v} = ${M}`,
                ],
              ],
              [
                ["Scale v", "把 v 乘以系数"],
                t("Divide to get the factor, then multiply it into $\\mathbf{v}$:", "相除得到系数，再乘到 $\\mathbf{v}$ 上："),
                [`\\frac{${d}}{${M}} = ${k}`, `\\text{proj}_{\\mathbf{v}}\\mathbf{u} = ${k}${vec3Latex(v)} = ${vec3Latex(proj)}`],
              ],
            ],
            t(
              `What is left over must be orthogonal to $\\mathbf{v}$:\n\n$$${vec3Latex(u)} - ${vec3Latex(proj)} = ${vec3Latex(perp)}$$\n\n$$${vec3Latex(perp)} \\cdot ${vec3Latex(v)} = ${dot3(perp, v)}$$`,
              `剩下的部分必须与 $\\mathbf{v}$ 正交：\n\n$$${vec3Latex(u)} - ${vec3Latex(proj)} = ${vec3Latex(perp)}$$\n\n$$${vec3Latex(perp)} \\cdot ${vec3Latex(v)} = ${dot3(perp, v)}$$`,
            ),
          ),
        });
      },
    },
    {
      id: "orthogonal-component-and-vector-decomposition",
      figure: precalculusDrawings2["calculating-a-vector-projection#orthogonal-component-and-vector-decomposition"],
      title: t("Orthogonal component and vector decomposition", "正交分量与向量正交分解"),
      explanation: t(
        "Any vector $\\mathbf{u}$ can be uniquely decomposed into two components relative to $\\mathbf{v}$:\n\n$$\\mathbf{u} = \\mathbf{u}_{\\parallel} + \\mathbf{u}_{\\perp}$$\n\nwhere $\\mathbf{u}_{\\parallel} = \\text{proj}_{\\mathbf{v}}\\mathbf{u}$ is parallel to $\\mathbf{v}$, and $\\mathbf{u}_{\\perp} = \\mathbf{u} - \\text{proj}_{\\mathbf{v}}\\mathbf{u}$ is orthogonal to $\\mathbf{v}$.\n\nFor $\\mathbf{u} = \\langle 3, 1, 2 \\rangle$ and $\\mathbf{v} = \\langle 1, 1, 0 \\rangle$ the projection is $\\langle 2, 2, 0 \\rangle$, so $\\mathbf{u}_{\\perp} = \\langle 1, -1, 2 \\rangle$. Check: its dot product with $\\mathbf{v}$ is $1 - 1 + 0 = 0$, and the two parts add back to $\\langle 3, 1, 2 \\rangle$.\n\n> **Watch out.** The orthogonal component is $\\mathbf{u}$ minus the projection, in that order. The reverse difference points the opposite way, and the projection itself is the parallel part, not the orthogonal one.",
        "任意向量 $\\mathbf{u}$ 均可相对于 $\\mathbf{v}$ 唯一正交分解为两个分量之和：\n\n$$\\mathbf{u} = \\mathbf{u}_{\\parallel} + \\mathbf{u}_{\\perp}$$\n\n其中 $\\mathbf{u}_{\\parallel} = \\text{proj}_{\\mathbf{v}}\\mathbf{u}$ 与 $\\mathbf{v}$ 平行，而 $\\mathbf{u}_{\\perp} = \\mathbf{u} - \\text{proj}_{\\mathbf{v}}\\mathbf{u}$ 与 $\\mathbf{v}$ 正交（垂直）。\n\n对 $\\mathbf{u} = \\langle 3, 1, 2 \\rangle$ 和 $\\mathbf{v} = \\langle 1, 1, 0 \\rangle$，投影是 $\\langle 2, 2, 0 \\rangle$，所以 $\\mathbf{u}_{\\perp} = \\langle 1, -1, 2 \\rangle$。检验：它与 $\\mathbf{v}$ 的点积是 $1 - 1 + 0 = 0$，并且两部分相加回到 $\\langle 3, 1, 2 \\rangle$。\n\n> **注意。** 正交分量是 $\\mathbf{u}$ 减去投影，顺序不能反。反过来相减得到的向量方向相反；投影本身是平行分量，不是正交分量。",
      ),
      generate(rng) {
        const v = rng.pick([[1, 1, 0] as Vec3, [1, 1, 1] as Vec3, [2, 0, 1] as Vec3, [1, 2, 2] as Vec3, [2, 2, 1] as Vec3]);
        const k = rng.pick([-2, -1, 1, 2]);
        const perp = rng.pick([[-v[1], v[0], 0] as Vec3, [0, -v[2], v[1]] as Vec3, [-v[2], 0, v[0]] as Vec3]);
        const multPerp = rng.pick([1, 2, 3]);
        const uPerp = smul3(multPerp, perp);
        const u = add3(smul3(k, v), uPerp);
        const proj = smul3(k, v);
        const d = dot3(u, v);
        const M = magSq3(v);

        return pointProblem({
          prompt: t(
            `Find the component of $\\mathbf{u} = ${vec3Latex(u)}$ orthogonal to $\\mathbf{v} = ${vec3Latex(v)}$.`,
            `求向量 $\\mathbf{u} = ${vec3Latex(u)}$ 在垂直于 $\\mathbf{v} = ${vec3Latex(v)}$ 方向上的正交分量。`,
          ),
          answer: uPerp,
          vars: ["x", "y", "z"],
          vector: true,
          wrong: [proj, smul3(-1, uPerp), u, add3(u, proj)],
          solution: walked(
            [
              [
                ["Project onto v", "投影到 v 上"],
                t("Find the parallel part first:", "先求平行分量："),
                [
                  `\\mathbf{u} \\cdot \\mathbf{v} = ${d}, \\quad \\mathbf{v} \\cdot \\mathbf{v} = ${M}`,
                  `\\text{proj}_{\\mathbf{v}}\\mathbf{u} = \\frac{${d}}{${M}}${vec3Latex(v)} = ${vec3Latex(proj)}`,
                ],
              ],
              [
                ["Subtract", "相减"],
                t("Take the parallel part away from $\\mathbf{u}$:", "从 $\\mathbf{u}$ 中去掉平行分量："),
                [`\\mathbf{u}_{\\perp} = ${vec3Latex(u)} - ${vec3Latex(proj)} = ${vec3Latex(uPerp)}`],
              ],
            ],
            t(
              `The result must be orthogonal to $\\mathbf{v}$, and the two parts must add back to $\\mathbf{u}$:\n\n$$${vec3Latex(uPerp)} \\cdot ${vec3Latex(v)} = ${dot3(uPerp, v)}$$\n\n$$${vec3Latex(proj)} + ${vec3Latex(uPerp)} = ${vec3Latex(u)}$$`,
              `结果必须与 $\\mathbf{v}$ 正交，并且两部分相加要回到 $\\mathbf{u}$：\n\n$$${vec3Latex(uPerp)} \\cdot ${vec3Latex(v)} = ${dot3(uPerp, v)}$$\n\n$$${vec3Latex(proj)} + ${vec3Latex(uPerp)} = ${vec3Latex(u)}$$`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── Module 5.20. The Cross Product ─────────────────────────────────────────

// ─── 5.20.1 The Cross Product of Two Vectors ─────────────────────────────────

/** theCrossProductOfTwoVectors covers the geometric definition and right-hand rule. */
export const theCrossProductOfTwoVectors: TopicDef = {
  id: "the-cross-product-of-two-vectors",
  title: t("The Cross Product of Two Vectors", "向量叉积（向量积）的概念"),
  summary: t(
    "Understand the cross product of two 3D vectors, its magnitude ||u x v|| = ||u||||v||sin(theta), its right-hand rule direction, and orthogonality.",
    "理解三维向量叉积（向量积）的概念、模长公式 ||u x v|| = ||u||||v||sin(theta)、右手定则方向及与原两向量的正交性。",
  ),
  prerequisites: ["calculating-the-magnitude-of-cartesian-vectors-in-3d", "calculating-the-dot-product-using-components"],
  encompasses: [],
  xp: 15,
  standards: ["CCSS.HSN.VM.C.11"],
  intro: t(
    `The dot product turns two vectors into a number. In three dimensions there is also a product that gives a vector: it points at right angles to both factors, and its length is the area of the parallelogram they span. For $\\mathbf{u} = \\langle 2, 0, 0 \\rangle$ and $\\mathbf{v} = \\langle 0, 3, 0 \\rangle$ the parallelogram is a $2$ by $3$ rectangle in the $xy$-plane, so this product is

$$\\mathbf{u} \\times \\mathbf{v} = \\langle 0, 0, 6 \\rangle$$

Check: $\\langle 0, 0, 6 \\rangle$ has no $x$- or $y$-component, so its dot products with $\\mathbf{u}$ and $\\mathbf{v}$ are both $0$. It is perpendicular to both, and its length $6$ is the area $2 \\cdot 3$.

In this lesson we find the length of a cross product from the angle between the vectors, and its direction from the right-hand rule.`,
    `点积把两个向量变成一个数。在三维空间中还有一种乘积得到的是向量：它与两个因子都垂直，长度等于它们张成的平行四边形的面积。对 $\\mathbf{u} = \\langle 2, 0, 0 \\rangle$ 和 $\\mathbf{v} = \\langle 0, 3, 0 \\rangle$，平行四边形是 $xy$ 平面里 $2$ 乘 $3$ 的长方形，所以这个乘积是

$$\\mathbf{u} \\times \\mathbf{v} = \\langle 0, 0, 6 \\rangle$$

检验：$\\langle 0, 0, 6 \\rangle$ 没有 $x$、$y$ 分量，所以它与 $\\mathbf{u}$、$\\mathbf{v}$ 的点积都是 $0$，与两者都垂直；它的长度 $6$ 正是面积 $2 \\cdot 3$。

这节课我们由两向量的夹角求叉积的长度，并用右手定则确定它的方向。`,
  ),
  knowledgePoints: [
    {
      id: "geometric-definition-and-magnitude-of-cross-product",
      title: t("Geometric definition and magnitude of cross product", "叉积的几何定义与模长"),
      figure: remainingDrawings7["the-cross-product-of-two-vectors#geometric-definition-and-magnitude-of-cross-product"],
      explanation: t(
        "Unlike the dot product, the cross product $\\mathbf{u} \\times \\mathbf{v}$ is a vector in $\\mathbb{R}^3$. Its magnitude is given by:\n\n$$\\|\\mathbf{u} \\times \\mathbf{v}\\| = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\sin\\theta$$\n\nwhere $\\theta \\in [0, \\pi]$ is the angle between the two vectors.\n\nFor $\\|\\mathbf{u}\\| = 4$, $\\|\\mathbf{v}\\| = 6$ and $\\theta = 30^\\circ$ the magnitude is $4 \\cdot 6 \\cdot \\frac{1}{2} = 12$. Check: with $\\mathbf{v}$ as the base, the height of the parallelogram is $4 \\sin 30^\\circ = 2$, and the area is $6 \\cdot 2 = 12$.\n\n> **Watch out.** The magnitude uses the sine of the angle, not the cosine. Parallel vectors, at $0^\\circ$ or $180^\\circ$, span a flat parallelogram, so their cross product has magnitude $0$.",
        "与数量积不同，叉积（向量积）$\\mathbf{u} \\times \\mathbf{v}$ 的结果是三维空间中的一个向量。其模长公式为：\n\n$$\\|\\mathbf{u} \\times \\mathbf{v}\\| = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\sin\\theta$$\n\n其中 $\\theta \\in [0, \\pi]$ 是两向量的夹角。\n\n对 $\\|\\mathbf{u}\\| = 4$、$\\|\\mathbf{v}\\| = 6$、$\\theta = 30^\\circ$，模长是 $4 \\cdot 6 \\cdot \\frac{1}{2} = 12$。检验：以 $\\mathbf{v}$ 为底，平行四边形的高是 $4 \\sin 30^\\circ = 2$，面积是 $6 \\cdot 2 = 12$。\n\n> **注意。** 模长用的是夹角的正弦，不是余弦。平行的向量（夹角 $0^\\circ$ 或 $180^\\circ$）张成的平行四边形是扁的，所以叉积的模长为 $0$。",
      ),
      generate(rng) {
        const uMag = rng.pick([2, 4, 6, 8, 10]);
        const vMag = rng.pick([2, 3, 4, 5, 6, 7, 8, 9]);
        const angle = rng.pick([
          { deg: "30^\\circ", sinVal: 0.5, sinTex: "\\frac{1}{2}" },
          { deg: "90^\\circ", sinVal: 1, sinTex: "1" },
          { deg: "150^\\circ", sinVal: 0.5, sinTex: "\\frac{1}{2}" },
          { deg: "0^\\circ", sinVal: 0, sinTex: "0" },
          { deg: "180^\\circ", sinVal: 0, sinTex: "0" },
        ]);

        const prod = uMag * vMag;
        const ans = Math.round(prod * angle.sinVal);
        const height = Math.round(uMag * angle.sinVal);
        const flat = angle.sinVal === 0;

        return numberProblem({
          prompt: t(
            `Given two vectors with $\\|\\mathbf{u}\\| = ${uMag}$, $\\|\\mathbf{v}\\| = ${vMag}$, and angle $\\theta = ${angle.deg}$, calculate $\\|\\mathbf{u} \\times \\mathbf{v}\\|$.`,
            `已知两向量满足 $\\|\\mathbf{u}\\| = ${uMag}$，$\\|\\mathbf{v}\\| = ${vMag}$，且夹角 $\\theta = ${angle.deg}$，计算叉积的模长 $\\|\\mathbf{u} \\times \\mathbf{v}\\|$。`,
          ),
          answer: ans,
          form: "integer",
          wrong: [prod, 0, uMag + vMag, Math.round(prod / 4)],
          solution: walked(
            [
              [
                ["Find the sine of the angle", "求夹角的正弦"],
                t("The magnitude depends on the sine:", "模长取决于正弦："),
                [`\\sin ${angle.deg} = ${angle.sinTex}`],
              ],
              [
                ["Multiply", "相乘"],
                t("Multiply the two lengths by the sine:", "两个长度乘以正弦："),
                [`\\|\\mathbf{u} \\times \\mathbf{v}\\| = ${uMag} \\cdot ${vMag} \\cdot ${angle.sinTex} = ${ans}`],
              ],
            ],
            flat
              ? t(
                  `At $${angle.deg}$ the vectors are parallel, so the height of the parallelogram above $\\mathbf{v}$ is $${uMag} \\sin ${angle.deg} = 0$. A flat parallelogram has area $0$.`,
                  `夹角为 $${angle.deg}$ 时两向量平行，所以平行四边形在 $\\mathbf{v}$ 上方的高是 $${uMag} \\sin ${angle.deg} = 0$。扁平的平行四边形面积为 $0$。`,
                )
              : t(
                  `The magnitude is the area of the parallelogram. With $\\mathbf{v}$ as the base, the height is $${uMag} \\sin ${angle.deg} = ${height}$, and base times height is $${vMag} \\cdot ${height} = ${ans}$.`,
                  `模长就是平行四边形的面积。以 $\\mathbf{v}$ 为底，高是 $${uMag} \\sin ${angle.deg} = ${height}$，底乘高是 $${vMag} \\cdot ${height} = ${ans}$。`,
                ),
          ),
        });
      },
    },
    {
      id: "direction-of-cross-product-and-orthogonality",
      title: t("Direction of cross product and orthogonality", "叉积的方向与右手定则"),
      figure: remainingDrawings7["the-cross-product-of-two-vectors#direction-of-cross-product-and-orthogonality"],
      explanation: t(
        "The direction of $\\mathbf{u} \\times \\mathbf{v}$ is perpendicular to both $\\mathbf{u}$ and $\\mathbf{v}$, following the right-hand rule. For the standard basis vectors:\n\n$$\\mathbf{i} \\times \\mathbf{j} = \\mathbf{k}, \\quad \\mathbf{j} \\times \\mathbf{k} = \\mathbf{i}, \\quad \\mathbf{k} \\times \\mathbf{i} = \\mathbf{j}$$\n\n$$\\mathbf{j} \\times \\mathbf{i} = -\\mathbf{k}, \\quad \\mathbf{k} \\times \\mathbf{j} = -\\mathbf{i}, \\quad \\mathbf{i} \\times \\mathbf{k} = -\\mathbf{j}$$\n\nFor $(2\\mathbf{i}) \\times (3\\mathbf{j})$ the scalars come out, giving $6(\\mathbf{i} \\times \\mathbf{j}) = 6\\mathbf{k}$. Check: $6\\mathbf{k}$ is perpendicular to both $\\mathbf{i}$ and $\\mathbf{j}$, and its length $6$ is $2 \\cdot 3 \\cdot \\sin 90^\\circ$.\n\n> **Watch out.** Going round the cycle $\\mathbf{i} \\to \\mathbf{j} \\to \\mathbf{k} \\to \\mathbf{i}$ gives a plus sign, and going against it gives a minus sign. The product never lies along either factor.",
        "叉积 $\\mathbf{u} \\times \\mathbf{v}$ 的方向同时垂直于 $\\mathbf{u}$ 和 $\\mathbf{v}$，满足右手定则。标准基向量的叉积关系为：\n\n$$\\mathbf{i} \\times \\mathbf{j} = \\mathbf{k}, \\quad \\mathbf{j} \\times \\mathbf{k} = \\mathbf{i}, \\quad \\mathbf{k} \\times \\mathbf{i} = \\mathbf{j}$$\n\n$$\\mathbf{j} \\times \\mathbf{i} = -\\mathbf{k}, \\quad \\mathbf{k} \\times \\mathbf{j} = -\\mathbf{i}, \\quad \\mathbf{i} \\times \\mathbf{k} = -\\mathbf{j}$$\n\n对 $(2\\mathbf{i}) \\times (3\\mathbf{j})$，把数提出来得 $6(\\mathbf{i} \\times \\mathbf{j}) = 6\\mathbf{k}$。检验：$6\\mathbf{k}$ 与 $\\mathbf{i}$、$\\mathbf{j}$ 都垂直，长度 $6$ 等于 $2 \\cdot 3 \\cdot \\sin 90^\\circ$。\n\n> **注意。** 沿 $\\mathbf{i} \\to \\mathbf{j} \\to \\mathbf{k} \\to \\mathbf{i}$ 的顺序取正号，逆着这个顺序取负号。叉积永远不会沿着任何一个因子的方向。",
      ),
      generate(rng) {
        const item = rng.pick([
          { first: "\\mathbf{i}", second: "\\mathbf{j}", ans: "\\mathbf{k}" },
          { first: "\\mathbf{j}", second: "\\mathbf{i}", ans: "-\\mathbf{k}" },
          { first: "\\mathbf{j}", second: "\\mathbf{k}", ans: "\\mathbf{i}" },
          { first: "\\mathbf{k}", second: "\\mathbf{j}", ans: "-\\mathbf{i}" },
          { first: "\\mathbf{k}", second: "\\mathbf{i}", ans: "\\mathbf{j}" },
          { first: "\\mathbf{i}", second: "\\mathbf{k}", ans: "-\\mathbf{j}" },
        ]);
        const a = rng.pick([2, 3, -2, -3]);
        const b = rng.pick([2, 4, -1]);
        const coeff = a * b;
        /** scaled writes n times a basis vector, leaving out a factor of 1. */
        const scaled = (n: number, symbol: string) => (n === 1 ? symbol : n === -1 ? `-${symbol}` : `${n}${symbol}`);
        const basis: Record<string, Vec3> = { "\\mathbf{i}": [1, 0, 0], "\\mathbf{j}": [0, 1, 0], "\\mathbf{k}": [0, 0, 1] };

        const term1 = `(${a}${item.first})`;
        const term2 = b === -1 ? `(-${item.second})` : `(${b}${item.second})`;
        const promptExpr = `${term1} \\times ${term2}`;

        const baseSign = item.ans.startsWith("-") ? -1 : 1;
        const baseSymbol = item.ans.replace("-", "");
        const finalCoeff = coeff * baseSign;
        const right = t(`$${scaled(finalCoeff, baseSymbol)}$`, `$${scaled(finalCoeff, baseSymbol)}$`);
        const flipped = t(`$${scaled(-finalCoeff, baseSymbol)}$`, `$${scaled(-finalCoeff, baseSymbol)}$`);
        const zero = t("$\\mathbf{0}$", "$\\mathbf{0}$");
        const along = t(`$${scaled(finalCoeff, item.first)}$`, `$${scaled(finalCoeff, item.first)}$`);
        const components = cross3(basis[item.first]!, basis[item.second]!);

        return oneOf(
          rng,
          t(`Evaluate the vector expression $${promptExpr}$.`, `计算向量表达式 $${promptExpr}$。`),
          right,
          [flipped, zero, along],
          walked(
            [
              [
                ["Pull out the scalars", "提出标量"],
                t("Scalar multiples come out of a cross product:", "数乘可以从叉积中提出来："),
                [`${promptExpr} = (${a})(${b})(${item.first} \\times ${item.second}) = ${coeff}(${item.first} \\times ${item.second})`],
              ],
              [
                ["Multiply the basis vectors", "求基向量的叉积"],
                t(
                  baseSign === 1
                    ? "The pair follows the cycle $\\mathbf{i} \\to \\mathbf{j} \\to \\mathbf{k} \\to \\mathbf{i}$, so the sign is plus:"
                    : "The pair goes against the cycle $\\mathbf{i} \\to \\mathbf{j} \\to \\mathbf{k} \\to \\mathbf{i}$, so the sign is minus:",
                  baseSign === 1
                    ? "这一对沿着 $\\mathbf{i} \\to \\mathbf{j} \\to \\mathbf{k} \\to \\mathbf{i}$ 的顺序，所以取正号："
                    : "这一对逆着 $\\mathbf{i} \\to \\mathbf{j} \\to \\mathbf{k} \\to \\mathbf{i}$ 的顺序，所以取负号：",
                ),
                [`${item.first} \\times ${item.second} = ${item.ans}`, `${coeff}(${item.ans}) = ${scaled(finalCoeff, baseSymbol)}`],
              ],
            ],
            t(
              `Work in components. $${item.first} = ${vec3Latex(basis[item.first]!)}$ and $${item.second} = ${vec3Latex(basis[item.second]!)}$ have cross product $${vec3Latex(components)}$, which is $${item.ans}$. Times $${coeff}$ it gives $${scaled(finalCoeff, baseSymbol)}$ again.`,
              `用分量计算。$${item.first} = ${vec3Latex(basis[item.first]!)}$ 与 $${item.second} = ${vec3Latex(basis[item.second]!)}$ 的叉积是 $${vec3Latex(components)}$，即 $${item.ans}$。乘以 $${coeff}$ 仍得 $${scaled(finalCoeff, baseSymbol)}$。`,
            ),
          ),
          [
            why(
              flipped,
              `The sign is reversed: $${item.first} \\times ${item.second} = ${item.ans}$, and the scalars multiply to $${coeff}$.`,
              `符号反了：$${item.first} \\times ${item.second} = ${item.ans}$，而数的乘积是 $${coeff}$。`,
            ),
            why(
              zero,
              "Only parallel vectors have a zero cross product, and two different basis vectors are perpendicular.",
              "只有平行的向量叉积才为零，而两个不同的基向量互相垂直。",
            ),
            why(
              along,
              `A cross product is perpendicular to both factors, so it cannot point along $${item.first}$.`,
              `叉积与两个因子都垂直，所以不可能沿 $${item.first}$ 的方向。`,
            ),
          ],
        );
      },
    },
  ],
};

// ─── 5.20.2 Properties of the Cross Product ──────────────────────────────────

/** propertiesOfTheCrossProduct covers anti-commutativity, parallel vectors, and distributivity. */
export const propertiesOfTheCrossProduct: TopicDef = {
  id: "properties-of-the-cross-product",
  title: t("Properties of the Cross Product", "向量叉积的代数性质"),
  summary: t(
    "Apply the algebraic properties of the cross product: anti-commutativity, zero cross product for parallel vectors, distributivity, and scalar associativity.",
    "运用向量叉积的代数性质：反交换律、平行向量的叉积为零、分配律及数乘结合律。",
  ),
  prerequisites: ["the-cross-product-of-two-vectors"],
  encompasses: [{ topic: "the-cross-product-of-two-vectors", weight: 0.4 }],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.11"],
  intro: t(
    `The basis products already show how the cross product differs from ordinary multiplication. Swapping the factors flips the direction, and a vector crossed with itself spans no area at all:

$$\\mathbf{i} \\times \\mathbf{j} = \\mathbf{k}, \\quad \\mathbf{j} \\times \\mathbf{i} = -\\mathbf{k}, \\quad \\mathbf{i} \\times \\mathbf{i} = \\mathbf{0}$$

Check: by the right-hand rule, curling from $\\mathbf{j}$ to $\\mathbf{i}$ points the thumb down, along $-\\mathbf{k}$, and $\\mathbf{i}$ with itself makes an angle of $0^\\circ$, so the magnitude is $1 \\cdot 1 \\cdot \\sin 0^\\circ = 0$.

In this lesson we use these rules, with distributivity and scalar multiples, to simplify cross products without working out components.`,
    `基向量的叉积已经显示出叉积与普通乘法的不同。交换因子会使方向反向，而向量与自身的叉积根本张不出面积：

$$\\mathbf{i} \\times \\mathbf{j} = \\mathbf{k}, \\quad \\mathbf{j} \\times \\mathbf{i} = -\\mathbf{k}, \\quad \\mathbf{i} \\times \\mathbf{i} = \\mathbf{0}$$

检验：按右手定则，从 $\\mathbf{j}$ 弯向 $\\mathbf{i}$ 时拇指朝下，沿 $-\\mathbf{k}$；$\\mathbf{i}$ 与自身的夹角是 $0^\\circ$，所以模长是 $1 \\cdot 1 \\cdot \\sin 0^\\circ = 0$。

这节课我们用这些规则，再加上分配律和数乘，不算分量就化简叉积。`,
  ),
  knowledgePoints: [
    {
      id: "anti-commutativity-and-parallel-vectors",
      title: t("Anti-commutativity and parallel vectors", "反交换律与平行向量"),
      figure: remainingDrawings7["properties-of-the-cross-product#anti-commutativity-and-parallel-vectors"],
      explanation: t(
        "Key properties of the cross product include:\n\n1. **Anti-commutativity**: $\\mathbf{v} \\times \\mathbf{u} = -(\\mathbf{u} \\times \\mathbf{v})$\n2. **Self-product**: $\\mathbf{u} \\times \\mathbf{u} = \\mathbf{0}$\n3. **Collinearity / Parallel vectors**: Two nonzero vectors $\\mathbf{u}$ and $\\mathbf{v}$ are parallel if and only if $\\mathbf{u} \\times \\mathbf{v} = \\mathbf{0}$.\n\nIf $\\mathbf{u} \\times \\mathbf{v} = \\langle 1, 2, 3 \\rangle$, then $(2\\mathbf{v}) \\times \\mathbf{u} = 2(\\mathbf{v} \\times \\mathbf{u}) = -2\\langle 1, 2, 3 \\rangle = \\langle -2, -4, -6 \\rangle$. Check: in the original order, $\\mathbf{u} \\times (2\\mathbf{v}) = \\langle 2, 4, 6 \\rangle$, and swapping the factors gives its opposite.\n\n> **Watch out.** Each swap of the two factors flips the sign once; pulling out scalars never changes the sign by itself. A negative scalar such as $-1$ does change it, but through the multiplication, not the swap.",
        "向量叉积的关键代数性质包括：\n\n1. **反交换律**：$\\mathbf{v} \\times \\mathbf{u} = -(\\mathbf{u} \\times \\mathbf{v})$\n2. **自身叉积**：$\\mathbf{u} \\times \\mathbf{u} = \\mathbf{0}$\n3. **共线 / 平行判定**：两非零向量 $\\mathbf{u}$ 与 $\\mathbf{v}$ 平行当且仅当 $\\mathbf{u} \\times \\mathbf{v} = \\mathbf{0}$。\n\n若 $\\mathbf{u} \\times \\mathbf{v} = \\langle 1, 2, 3 \\rangle$，则 $(2\\mathbf{v}) \\times \\mathbf{u} = 2(\\mathbf{v} \\times \\mathbf{u}) = -2\\langle 1, 2, 3 \\rangle = \\langle -2, -4, -6 \\rangle$。检验：按原来的顺序，$\\mathbf{u} \\times (2\\mathbf{v}) = \\langle 2, 4, 6 \\rangle$，交换因子得到它的相反向量。\n\n> **注意。** 两个因子每交换一次，符号变一次；提出标量本身不会改变符号。像 $-1$ 这样的负数会改变符号，但那是乘法造成的，不是交换造成的。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const w: Vec3 = [
            rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]),
            rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]),
            rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]),
          ];
          const a = rng.pick([2, 3, -2]);
          const b = rng.pick([2, 4, -1]);
          const factor = -a * b;
          const ans = smul3(factor, w);
          const aStr = `${a}\\mathbf{v}`;
          const bStr = b === -1 ? "-\\mathbf{u}" : `${b}\\mathbf{u}`;

          return pointProblem({
            prompt: t(
              `Given that $\\mathbf{u} \\times \\mathbf{v} = ${vec3Latex(w)}$, find the value of $(${aStr}) \\times (${bStr})$.`,
              `已知 $\\mathbf{u} \\times \\mathbf{v} = ${vec3Latex(w)}$，求 $(${aStr}) \\times (${bStr})$ 的值。`,
            ),
            answer: ans,
            vars: ["x", "y", "z"],
            vector: true,
            wrong: [smul3(-factor, w), smul3(a * b, w), [0, 0, 0]],
            solution: walked(
              [
                [
                  ["Pull out the scalars", "提出标量"],
                  t("Scalar multiples come out of a cross product:", "数乘可以从叉积中提出来："),
                  [`(${aStr}) \\times (${bStr}) = ${poly([a * b, "(\\mathbf{v} \\times \\mathbf{u})"])}`],
                ],
                [
                  ["Swap the factors", "交换因子"],
                  t("Swapping the factors flips the sign:", "交换因子要变号："),
                  [
                    `${poly([a * b, "(\\mathbf{v} \\times \\mathbf{u})"])} = ${poly([factor, "(\\mathbf{u} \\times \\mathbf{v})"])}`,
                    `${factor}${vec3Latex(w)} = ${vec3Latex(ans)}`,
                  ],
                ],
              ],
              t(
                `Swap first instead. $(${bStr}) \\times (${aStr})$ has the factors in the order $\\mathbf{u}$, $\\mathbf{v}$, so it is $${a * b}(\\mathbf{u} \\times \\mathbf{v}) = ${vec3Latex(smul3(a * b, w))}$. The product asked for has the factors the other way round, so it is the opposite vector, $${vec3Latex(ans)}$.`,
                `也可以先交换。$(${bStr}) \\times (${aStr})$ 的因子顺序是 $\\mathbf{u}$、$\\mathbf{v}$，所以它等于 $${a * b}(\\mathbf{u} \\times \\mathbf{v}) = ${vec3Latex(smul3(a * b, w))}$。所求乘积的因子顺序相反，所以是它的相反向量 $${vec3Latex(ans)}$。`,
              ),
            ),
          });
        }

        const base: Vec3 = [rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-3, -2, -1, 1, 2, 3])];
        const k = rng.pick([-3, -2, 2, 3, 4]);
        const parallelVec = smul3(k, base);
        const nonParallel1: Vec3 = [parallelVec[0], parallelVec[1], parallelVec[2] + 1];
        const nonParallel2: Vec3 = [parallelVec[0], -parallelVec[1], parallelVec[2]];
        const nonParallel3: Vec3 = [parallelVec[0] + 1, parallelVec[1] - 1, parallelVec[2]];
        const option = (w: Vec3) => t(`$${vec3Latex(w)}$`, `$${vec3Latex(w)}$`);
        const ratios = `\\frac{${parallelVec[0]}}{${base[0]}} = \\frac{${parallelVec[1]}}{${base[1]}} = \\frac{${parallelVec[2]}}{${base[2]}} = ${k}`;

        return oneOf(
          rng,
          t(
            `Which of the following vectors is parallel to $\\mathbf{u} = ${vec3Latex(base)}$ (i.e. satisfies $\\mathbf{u} \\times \\mathbf{v} = \\mathbf{0}$)?`,
            `下列哪个向量与 $\\mathbf{u} = ${vec3Latex(base)}$ 平行（即满足 $\\mathbf{u} \\times \\mathbf{v} = \\mathbf{0}$）？`,
          ),
          option(parallelVec),
          [option(nonParallel1), option(nonParallel2), option(nonParallel3)],
          walked(
            [
              [
                ["Compare the components", "比较分量"],
                t(
                  `A parallel vector is a multiple of $\\mathbf{u}$, so each component divided by the matching one of $\\mathbf{u}$ gives the same number. For $${vec3Latex(parallelVec)}$:`,
                  `平行的向量是 $\\mathbf{u}$ 的倍数，所以每个分量除以 $\\mathbf{u}$ 的对应分量都得到同一个数。对 $${vec3Latex(parallelVec)}$：`,
                ),
                [ratios],
              ],
              [
                ["Conclude", "得出结论"],
                t(
                  `So $${vec3Latex(parallelVec)} = ${k}\\mathbf{u}$ is parallel to $\\mathbf{u}$. In each of the other options the three ratios are not all equal.`,
                  `所以 $${vec3Latex(parallelVec)} = ${k}\\mathbf{u}$ 与 $\\mathbf{u}$ 平行。其他选项的三个比值不全相等。`,
                ),
              ],
            ],
            t(
              `Compute the cross product directly; every component cancels:\n\n$$${vec3Latex(base)} \\times ${vec3Latex(parallelVec)} = ${vec3Latex(cross3(base, parallelVec))}$$`,
              `直接计算叉积，每个分量都抵消：\n\n$$${vec3Latex(base)} \\times ${vec3Latex(parallelVec)} = ${vec3Latex(cross3(base, parallelVec))}$$`,
            ),
          ),
          [
            why(
              option(nonParallel1),
              `The first two components are $${k}$ times those of $\\mathbf{u}$, but the third is not.`,
              `前两个分量是 $\\mathbf{u}$ 的 $${k}$ 倍，第三个分量却不是。`,
            ),
            why(
              option(nonParallel2),
              `The second component has the wrong sign: it is $${-k}$ times that of $\\mathbf{u}$, while the others are $${k}$ times.`,
              `第二个分量符号不对：它是 $\\mathbf{u}$ 的 $${-k}$ 倍，而其他分量是 $${k}$ 倍。`,
            ),
            why(
              option(nonParallel3),
              `The third component is $${k}$ times that of $\\mathbf{u}$, but the first two are not.`,
              `第三个分量是 $\\mathbf{u}$ 的 $${k}$ 倍，前两个分量却不是。`,
            ),
          ],
        );
      },
    },
    {
      id: "distributivity-and-scalar-associativity-of-cross-product",
      title: t("Distributivity and scalar associativity of cross product", "叉积的分配律与数乘结合律"),
      explanation: t(
        "The cross product behaves like ordinary multiplication in many ways, but the order of the factors matters, because swapping them reverses the sign. The cross product distributes over addition:\n\n$$\\mathbf{u} \\times (\\mathbf{v} + \\mathbf{w}) = \\mathbf{u} \\times \\mathbf{v} + \\mathbf{u} \\times \\mathbf{w}$$\n\n$$(\\mathbf{u} + \\mathbf{v}) \\times \\mathbf{w} = \\mathbf{u} \\times \\mathbf{w} + \\mathbf{v} \\times \\mathbf{w}$$\n\nNotice that $(\\mathbf{u} + a\\mathbf{v}) \\times (\\mathbf{u} + b\\mathbf{v}) = (b - a)(\\mathbf{u} \\times \\mathbf{v})$.\n\nFor $(\\mathbf{u} + 2\\mathbf{v}) \\times (\\mathbf{u} + 5\\mathbf{v})$ the four products are $\\mathbf{u} \\times \\mathbf{u} = \\mathbf{0}$, $5(\\mathbf{u} \\times \\mathbf{v})$, $2(\\mathbf{v} \\times \\mathbf{u}) = -2(\\mathbf{u} \\times \\mathbf{v})$ and $10(\\mathbf{v} \\times \\mathbf{v}) = \\mathbf{0}$, which leaves $3(\\mathbf{u} \\times \\mathbf{v})$. Check: the rule above with $a = 2$ and $b = 5$ gives $5 - 2 = 3$.\n\n> **Watch out.** The term with $\\mathbf{v} \\times \\mathbf{u}$ is subtracted, because $\\mathbf{v} \\times \\mathbf{u} = -(\\mathbf{u} \\times \\mathbf{v})$. And $\\mathbf{u} \\times \\mathbf{u}$ is $\\mathbf{0}$, not a square.",
        "叉积在许多方面像普通乘法一样，但因子的顺序很重要，交换它们会改变符号。向量叉积对加法满足分配律：\n\n$$\\mathbf{u} \\times (\\mathbf{v} + \\mathbf{w}) = \\mathbf{u} \\times \\mathbf{v} + \\mathbf{u} \\times \\mathbf{w}$$\n\n$$(\\mathbf{u} + \\mathbf{v}) \\times \\mathbf{w} = \\mathbf{u} \\times \\mathbf{w} + \\mathbf{v} \\times \\mathbf{w}$$\n\n注意 $(\\mathbf{u} + a\\mathbf{v}) \\times (\\mathbf{u} + b\\mathbf{v}) = (b - a)(\\mathbf{u} \\times \\mathbf{v})$。\n\n对 $(\\mathbf{u} + 2\\mathbf{v}) \\times (\\mathbf{u} + 5\\mathbf{v})$，四个乘积是 $\\mathbf{u} \\times \\mathbf{u} = \\mathbf{0}$、$5(\\mathbf{u} \\times \\mathbf{v})$、$2(\\mathbf{v} \\times \\mathbf{u}) = -2(\\mathbf{u} \\times \\mathbf{v})$ 和 $10(\\mathbf{v} \\times \\mathbf{v}) = \\mathbf{0}$，剩下 $3(\\mathbf{u} \\times \\mathbf{v})$。检验：用上面的规则，$a = 2$、$b = 5$，得 $5 - 2 = 3$。\n\n> **注意。** 含 $\\mathbf{v} \\times \\mathbf{u}$ 的项要减去，因为 $\\mathbf{v} \\times \\mathbf{u} = -(\\mathbf{u} \\times \\mathbf{v})$。而 $\\mathbf{u} \\times \\mathbf{u}$ 是 $\\mathbf{0}$，不是平方。",
      ),
      generate(rng) {
        const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const b = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const c = rng.pick([-3, -2, -1, 1, 2, 3]);
        const d = rng.pick([-3, -2, -1, 1, 2, 3]);

        const det = a * d - b * c;
        const times = (n: number) => (n === 0 ? "\\mathbf{0}" : `${n === 1 ? "" : n === -1 ? "-" : n}(\\mathbf{u} \\times \\mathbf{v})`);
        const option = (latex: string) => t(`$${latex}$`, `$${latex}$`);
        const right = times(det);
        const w1 = times(a * d + b * c);
        const w2 = times(-det + (det === 0 ? 1 : 0));
        const w3 = times(a * c + b * d);
        const w4 = "\\mathbf{0}";

        const aStr = a === 1 ? "\\mathbf{u}" : a === -1 ? "-\\mathbf{u}" : `${a}\\mathbf{u}`;
        const bStr = b > 0 ? (b === 1 ? "+ \\mathbf{v}" : `+ ${b}\\mathbf{v}`) : b === -1 ? "- \\mathbf{v}" : `- ${-b}\\mathbf{v}`;
        const cStr = c === 1 ? "\\mathbf{u}" : c === -1 ? "-\\mathbf{u}" : `${c}\\mathbf{u}`;
        const dStr = d > 0 ? (d === 1 ? "+ \\mathbf{v}" : `+ ${d}\\mathbf{v}`) : d === -1 ? "- \\mathbf{v}" : `- ${-d}\\mathbf{v}`;
        const coefficient = `${a * d} - ${paren(b * c)} = ${det}`;

        return oneOf(
          rng,
          t(
            `Simplify the expression $(${aStr} ${bStr}) \\times (${cStr} ${dStr})$ in terms of $\\mathbf{u} \\times \\mathbf{v}$.`,
            `将表达式 $(${aStr} ${bStr}) \\times (${cStr} ${dStr})$ 化简为关于 $\\mathbf{u} \\times \\mathbf{v}$ 的形式。`,
          ),
          option(right),
          [option(w1), option(w2), option(w3), option(w4)],
          walked(
            [
              [
                ["Expand", "展开"],
                t("Distribute both factors, keeping the order of each product:", "把两个因子展开，每个乘积保持原来的顺序："),
                [
                  `(${aStr} ${bStr}) \\times (${cStr} ${dStr}) = (${a})(${c})(\\mathbf{u}\\times\\mathbf{u}) + (${a})(${d})(\\mathbf{u}\\times\\mathbf{v}) + (${b})(${c})(\\mathbf{v}\\times\\mathbf{u}) + (${b})(${d})(\\mathbf{v}\\times\\mathbf{v})`,
                ],
              ],
              [
                ["Simplify", "化简"],
                t(
                  "Use $\\mathbf{u}\\times\\mathbf{u} = \\mathbf{v}\\times\\mathbf{v} = \\mathbf{0}$ and $\\mathbf{v}\\times\\mathbf{u} = -(\\mathbf{u}\\times\\mathbf{v})$:",
                  "利用 $\\mathbf{u}\\times\\mathbf{u} = \\mathbf{v}\\times\\mathbf{v} = \\mathbf{0}$ 和 $\\mathbf{v}\\times\\mathbf{u} = -(\\mathbf{u}\\times\\mathbf{v})$：",
                ),
                [`(${a * d} - ${paren(b * c)})(\\mathbf{u} \\times \\mathbf{v}) = ${right}`],
              ],
            ],
            t(
              `Try $\\mathbf{u} = \\mathbf{i}$ and $\\mathbf{v} = \\mathbf{j}$, so that $\\mathbf{u} \\times \\mathbf{v} = \\mathbf{k}$. The two factors become $${vec3Latex([a, b, 0])}$ and $${vec3Latex([c, d, 0])}$, and in components\n\n$$${vec3Latex([a, b, 0])} \\times ${vec3Latex([c, d, 0])} = ${vec3Latex(cross3([a, b, 0], [c, d, 0]))}$$\n\nThat is $${det}\\mathbf{k}$, as found.`,
              `取 $\\mathbf{u} = \\mathbf{i}$、$\\mathbf{v} = \\mathbf{j}$，则 $\\mathbf{u} \\times \\mathbf{v} = \\mathbf{k}$。两个因子变成 $${vec3Latex([a, b, 0])}$ 和 $${vec3Latex([c, d, 0])}$，用分量计算\n\n$$${vec3Latex([a, b, 0])} \\times ${vec3Latex([c, d, 0])} = ${vec3Latex(cross3([a, b, 0], [c, d, 0]))}$$\n\n即 $${det}\\mathbf{k}$，与所得结果一致。`,
            ),
          ),
          [
            why(
              option(w1),
              `This adds the term with $\\mathbf{v} \\times \\mathbf{u}$, but that term is subtracted: the coefficient is $${coefficient}$.`,
              `这里把含 $\\mathbf{v} \\times \\mathbf{u}$ 的项加上了，但这一项要减去：系数是 $${coefficient}$。`,
            ),
            why(option(w2), `The sign is wrong: the coefficient is $${coefficient}$.`, `符号不对：系数是 $${coefficient}$。`),
            why(
              option(w3),
              "This keeps the products $\\mathbf{u} \\times \\mathbf{u}$ and $\\mathbf{v} \\times \\mathbf{v}$, which are $\\mathbf{0}$; only the mixed products remain.",
              "这里保留了 $\\mathbf{u} \\times \\mathbf{u}$ 和 $\\mathbf{v} \\times \\mathbf{v}$，而它们都是 $\\mathbf{0}$；只有交叉的乘积留下来。",
            ),
            why(
              option(w4),
              `The mixed products do not cancel: their coefficient is $${coefficient}$.`,
              `交叉的乘积并没有抵消：它们的系数是 $${coefficient}$。`,
            ),
          ],
        );
      },
    },
  ],
};

// ─── 5.20.3 Calculating the Cross Product Using Determinants ─────────────────

/** calculatingTheCrossProductUsingDeterminants covers 3x3 determinant formula. */
export const calculatingTheCrossProductUsingDeterminants: TopicDef = {
  id: "calculating-the-cross-product-using-determinants",
  title: t("Calculating the Cross Product Using Determinants", "利用三阶行列式计算向量叉积"),
  summary: t(
    "Compute the cross product of two 3D vectors using a 3x3 determinant expansion and find vectors orthogonal to two given vectors.",
    "利用三阶行列式展开计算两个三维向量的叉积，并求与已知两向量均垂直的向量。",
  ),
  prerequisites: ["properties-of-the-cross-product"],
  encompasses: [],
  xp: 15,
  standards: ["CCSS.HSN.VM.C.11"],
  intro: t(
    `Every vector is a combination of $\\mathbf{i}$, $\\mathbf{j}$ and $\\mathbf{k}$, so distributivity and the basis products are enough to cross any two vectors. For $\\langle 1, 2, 0 \\rangle = \\mathbf{i} + 2\\mathbf{j}$ and $\\langle 0, 1, 0 \\rangle = \\mathbf{j}$:

$$(\\mathbf{i} + 2\\mathbf{j}) \\times \\mathbf{j} = \\mathbf{i} \\times \\mathbf{j} + 2(\\mathbf{j} \\times \\mathbf{j}) = \\mathbf{k}$$

Check: $\\mathbf{k} = \\langle 0, 0, 1 \\rangle$ has no $x$- or $y$-component, so its dot products with both vectors are $0$.

In this lesson we organize this expansion as a determinant, giving each component of $\\mathbf{u} \\times \\mathbf{v}$ directly, and use it to find vectors perpendicular to two given ones.`,
    `每个向量都是 $\\mathbf{i}$、$\\mathbf{j}$、$\\mathbf{k}$ 的组合，所以靠分配律和基向量的叉积就能算出任意两个向量的叉积。对 $\\langle 1, 2, 0 \\rangle = \\mathbf{i} + 2\\mathbf{j}$ 和 $\\langle 0, 1, 0 \\rangle = \\mathbf{j}$：

$$(\\mathbf{i} + 2\\mathbf{j}) \\times \\mathbf{j} = \\mathbf{i} \\times \\mathbf{j} + 2(\\mathbf{j} \\times \\mathbf{j}) = \\mathbf{k}$$

检验：$\\mathbf{k} = \\langle 0, 0, 1 \\rangle$ 没有 $x$、$y$ 分量，所以它与两个向量的点积都是 $0$。

这节课我们把这种展开整理成行列式，直接得到 $\\mathbf{u} \\times \\mathbf{v}$ 的各个分量，并用它求与两个已知向量都垂直的向量。`,
  ),
  knowledgePoints: [
    {
      id: "determinant-formula-for-cross-product",
      title: t("Determinant formula for cross product", "利用三阶行列式展开计算叉积"),
      explanation: t(
        "Writing the unit vectors in the first row of a determinant is a memory aid: expanding along that row produces each component of the cross product. The cross product of $\\mathbf{u} = \\langle u_1, u_2, u_3 \\rangle$ and $\\mathbf{v} = \\langle v_1, v_2, v_3 \\rangle$ is calculated using the formal determinant:\n\n$$\\mathbf{u} \\times \\mathbf{v} = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ u_1 & u_2 & u_3 \\\\ v_1 & v_2 & v_3 \\end{vmatrix} = \\langle u_2 v_3 - u_3 v_2, \\; -(u_1 v_3 - u_3 v_1), \\; u_1 v_2 - u_2 v_1 \\rangle$$\n\nFor $\\langle 1, 2, 3 \\rangle \\times \\langle 4, 5, 6 \\rangle$ the components are $12 - 15 = -3$, $-(6 - 12) = 6$ and $5 - 8 = -3$, so the product is $\\langle -3, 6, -3 \\rangle$. Check: its dot products with the two vectors are $-3 + 12 - 9 = 0$ and $-12 + 30 - 18 = 0$.\n\n> **Watch out.** The middle component carries a minus sign in front of its $2 \\times 2$ determinant. Leaving it out gives a vector that is no longer perpendicular to $\\mathbf{u}$ and $\\mathbf{v}$.",
        "把单位向量写在行列式的第一行是一种记忆方法：沿这一行展开就得到叉积的各个分量。向量 $\\mathbf{u} = \\langle u_1, u_2, u_3 \\rangle$ 与 $\\mathbf{v} = \\langle v_1, v_2, v_3 \\rangle$ 的叉积可用形式三阶行列式计算：\n\n$$\\mathbf{u} \\times \\mathbf{v} = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ u_1 & u_2 & u_3 \\\\ v_1 & v_2 & v_3 \\end{vmatrix} = \\langle u_2 v_3 - u_3 v_2, \\; -(u_1 v_3 - u_3 v_1), \\; u_1 v_2 - u_2 v_1 \\rangle$$\n\n对 $\\langle 1, 2, 3 \\rangle \\times \\langle 4, 5, 6 \\rangle$，三个分量是 $12 - 15 = -3$、$-(6 - 12) = 6$、$5 - 8 = -3$，所以叉积是 $\\langle -3, 6, -3 \\rangle$。检验：它与两个向量的点积分别是 $-3 + 12 - 9 = 0$ 和 $-12 + 30 - 18 = 0$。\n\n> **注意。** 中间的分量在它的二阶行列式前面带一个负号。漏掉负号，得到的向量就不再与 $\\mathbf{u}$、$\\mathbf{v}$ 垂直。",
      ),
      generate(rng) {
        const u: Vec3 = [
          rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]),
          rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]),
          rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]),
        ];
        const v: Vec3 = [
          rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]),
          rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]),
          rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]),
        ];
        const cp = cross3(u, v);
        const opp = smul3(-1, cp);
        const signErrY: Vec3 = [cp[0], u[0] * v[2] - u[2] * v[0], cp[2]];
        const swapErr: Vec3 = [cp[1], cp[0], cp[2]];
        const offset1: Vec3 = [cp[0] + 1, cp[1] - 1, cp[2] + 2];
        const offset2: Vec3 = [cp[0] - 2, cp[1] + 2, cp[2] - 1];
        const dots = (w: Vec3) => `(${cp[0]})(${w[0]}) + (${cp[1]})(${w[1]}) + (${cp[2]})(${w[2]}) = ${dot3(cp, w)}`;

        return pointProblem({
          prompt: t(
            `Calculate the cross product $\\mathbf{u} \\times \\mathbf{v}$ for $\\mathbf{u} = ${vec3Latex(u)}$ and $\\mathbf{v} = ${vec3Latex(v)}$.`,
            `计算向量 $\\mathbf{u} = ${vec3Latex(u)}$ 与 $\\mathbf{v} = ${vec3Latex(v)}$ 的叉积 $\\mathbf{u} \\times \\mathbf{v}$。`,
          ),
          answer: cp,
          vars: ["x", "y", "z"],
          vector: true,
          wrong: [opp, signErrY, swapErr, offset1, offset2],
          solution: walked(
            [
              [
                ["Set up the determinant", "写出行列式"],
                t("Put the unit vectors in the first row and the two vectors below:", "第一行写单位向量，下面两行写两个向量："),
                [
                  `\\mathbf{u} \\times \\mathbf{v} = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ ${u[0]} & ${u[1]} & ${u[2]} \\\\ ${v[0]} & ${v[1]} & ${v[2]} \\end{vmatrix}`,
                ],
              ],
              [
                ["Expand along the first row", "沿第一行展开"],
                t(
                  "Each component is a $2 \\times 2$ determinant, and the middle one takes a minus sign:",
                  "每个分量是一个二阶行列式，中间的一个带负号：",
                ),
                [
                  `\\mathbf{i}: \\; (${u[1]})(${v[2]}) - (${u[2]})(${v[1]}) = ${cp[0]}`,
                  `\\mathbf{j}: \\; -\\big((${u[0]})(${v[2]}) - (${u[2]})(${v[0]})\\big) = ${cp[1]}`,
                  `\\mathbf{k}: \\; (${u[0]})(${v[1]}) - (${u[1]})(${v[0]}) = ${cp[2]}`,
                ],
              ],
              [
                ["Write the vector", "写出向量"],
                t("Collect the components:", "把分量合起来："),
                [`\\mathbf{u} \\times \\mathbf{v} = ${vec3Latex(cp)}`],
              ],
            ],
            t(
              `The cross product must be perpendicular to both vectors, so both dot products are $0$:\n\n$$${dots(u)}$$\n\n$$${dots(v)}$$`,
              `叉积必须与两个向量都垂直，所以两个点积都是 $0$：\n\n$$${dots(u)}$$\n\n$$${dots(v)}$$`,
            ),
          ),
        });
      },
    },
    {
      id: "finding-a-vector-orthogonal-to-two-vectors",
      title: t("Finding a vector orthogonal to two vectors", "求与已知两向量均正交的向量"),
      figure: remainingDrawings7["calculating-the-cross-product-using-determinants#finding-a-vector-orthogonal-to-two-vectors"],
      explanation: t(
        "A vector orthogonal (perpendicular) to both $\\mathbf{u}$ and $\\mathbf{v}$ can always be obtained by calculating their cross product $\\mathbf{u} \\times \\mathbf{v}$ (or any nonzero scalar multiple of it).\n\nFor $\\mathbf{u} = \\langle 1, 0, 1 \\rangle$ and $\\mathbf{v} = \\langle 0, 1, 1 \\rangle$ the cross product is $\\langle -1, -1, 1 \\rangle$. Check: $-1 + 0 + 1 = 0$ and $0 - 1 + 1 = 0$, so it is perpendicular to both.\n\n> **Watch out.** Sums and differences such as $\\mathbf{u} + \\mathbf{v}$ lie in the same plane as $\\mathbf{u}$ and $\\mathbf{v}$, so they are not perpendicular to them. A candidate must have dot product $0$ with each of the two vectors, not just one.",
        "求同时与 $\\mathbf{u}$ 和 $\\mathbf{v}$ 正交（垂直）的向量，可以通过计算它们的叉积 $\\mathbf{u} \\times \\mathbf{v}$（或其任意非零数乘倍数）得到。\n\n对 $\\mathbf{u} = \\langle 1, 0, 1 \\rangle$ 和 $\\mathbf{v} = \\langle 0, 1, 1 \\rangle$，叉积是 $\\langle -1, -1, 1 \\rangle$。检验：$-1 + 0 + 1 = 0$，$0 - 1 + 1 = 0$，所以它与两者都垂直。\n\n> **注意。** 像 $\\mathbf{u} + \\mathbf{v}$ 这样的和与差，与 $\\mathbf{u}$、$\\mathbf{v}$ 在同一平面内，所以不与它们垂直。候选向量必须与两个向量的点积都为 $0$，只满足一个不行。",
      ),
      generate(rng) {
        const u: Vec3 = [rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-3, -2, -1, 1, 2, 3])];
        const v0: Vec3 = [rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-3, -2, -1, 1, 2, 3])];
        const v: Vec3 = magSq3(cross3(u, v0)) > 0 ? v0 : [v0[0], v0[1], v0[2] > 0 ? v0[2] - 1 : v0[2] + 1];
        const target = cross3(u, v);
        const option = (w: Vec3) => t(`$${vec3Latex(w)}$`, `$${vec3Latex(w)}$`);
        /** miss names a dot product of a wrong option that is not zero. */
        const miss = (w: Vec3): Reason => {
          const du = dot3(w, u);
          return du !== 0
            ? [option(w).en, `Its dot product with $\\mathbf{u}$ is $${du}$, not $0$.`, `它与 $\\mathbf{u}$ 的点积是 $${du}$，不是 $0$。`]
            : [
                option(w).en,
                `Its dot product with $\\mathbf{v}$ is $${dot3(w, v)}$, not $0$.`,
                `它与 $\\mathbf{v}$ 的点积是 $${dot3(w, v)}$，不是 $0$。`,
              ];
        };
        const dots = (w: Vec3) => `(${target[0]})(${w[0]}) + (${target[1]})(${w[1]}) + (${target[2]})(${w[2]}) = ${dot3(target, w)}`;

        const w1 = add3(u, v);
        const w2 = sub3(u, v);
        const w3: Vec3 = [target[0] + 1, target[1], target[2]];
        const w4: Vec3 = [target[0], target[1] - 1, target[2]];

        return oneOf(
          rng,
          t(
            `Which of the following vectors is orthogonal to both $\\mathbf{u} = ${vec3Latex(u)}$ and $\\mathbf{v} = ${vec3Latex(v)}$?`,
            `下列哪个向量同时与 $\\mathbf{u} = ${vec3Latex(u)}$ 和 $\\mathbf{v} = ${vec3Latex(v)}$ 正交（垂直）？`,
          ),
          option(target),
          [option(w1), option(w2), option(w3), option(w4)],
          walked(
            [
              [
                ["Compute the cross product", "计算叉积"],
                t("Expand the determinant along its first row:", "沿第一行展开行列式："),
                [
                  `\\mathbf{i}: \\; (${u[1]})(${v[2]}) - (${u[2]})(${v[1]}) = ${target[0]}`,
                  `\\mathbf{j}: \\; -\\big((${u[0]})(${v[2]}) - (${u[2]})(${v[0]})\\big) = ${target[1]}`,
                  `\\mathbf{k}: \\; (${u[0]})(${v[1]}) - (${u[1]})(${v[0]}) = ${target[2]}`,
                ],
              ],
              [
                ["Use its direction", "利用它的方向"],
                t(
                  `A cross product is perpendicular to both of its factors, so $\\mathbf{u} \\times \\mathbf{v} = ${vec3Latex(target)}$ is the vector we want.`,
                  `叉积与两个因子都垂直，所以 $\\mathbf{u} \\times \\mathbf{v} = ${vec3Latex(target)}$ 就是所求的向量。`,
                ),
              ],
            ],
            t(
              `Dot it with each vector; both results are $0$:\n\n$$${dots(u)}$$\n\n$$${dots(v)}$$`,
              `分别与两个向量作点积，结果都是 $0$：\n\n$$${dots(u)}$$\n\n$$${dots(v)}$$`,
            ),
          ),
          [miss(w1), miss(w2), miss(w3), miss(w4)],
        );
      },
    },
  ],
};

// ─── 5.20.4 Finding Areas Using the Cross Product ────────────────────────────

/** findingAreasUsingTheCrossProduct covers parallelogram and triangle areas. */
export const findingAreasUsingTheCrossProduct: TopicDef = {
  id: "finding-areas-using-the-cross-product",
  title: t("Finding Areas Using the Cross Product", "利用向量叉积计算平面图形面积"),
  summary: t(
    "Find the area of parallelograms and triangles in 3D space using the magnitude of the cross product.",
    "利用叉积的模长计算三维空间中平行四边形和三角形的面积。",
  ),
  prerequisites: ["calculating-the-cross-product-using-determinants"],
  encompasses: [{ topic: "calculating-the-cross-product-using-determinants", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSN.VM.C.11"],
  intro: t(
    `The length of $\\mathbf{u} \\times \\mathbf{v}$ is $\\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\sin\\theta$, which is base times height for the parallelogram on $\\mathbf{u}$ and $\\mathbf{v}$. The determinant gives the cross product from components, so it gives that area too. For $\\mathbf{u} = \\langle 3, 0, 0 \\rangle$ and $\\mathbf{v} = \\langle 1, 4, 0 \\rangle$:

$$\\mathbf{u} \\times \\mathbf{v} = \\langle 0, 0, 12 \\rangle$$

so the area is $12$.

Check: the parallelogram lies in the $xy$-plane with base $3$ along the $x$-axis, and $\\mathbf{v}$ rises $4$ above that base, so its area is $3 \\cdot 4 = 12$.

In this lesson we find areas of parallelograms and triangles in space from cross products.`,
    `$\\mathbf{u} \\times \\mathbf{v}$ 的长度是 $\\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\sin\\theta$，也就是以 $\\mathbf{u}$、$\\mathbf{v}$ 为边的平行四边形的底乘高。行列式由分量给出叉积，所以也给出这个面积。对 $\\mathbf{u} = \\langle 3, 0, 0 \\rangle$ 和 $\\mathbf{v} = \\langle 1, 4, 0 \\rangle$：

$$\\mathbf{u} \\times \\mathbf{v} = \\langle 0, 0, 12 \\rangle$$

所以面积是 $12$。

检验：这个平行四边形在 $xy$ 平面内，底边沿 $x$ 轴长 $3$，$\\mathbf{v}$ 在底边上方升高 $4$，所以面积是 $3 \\cdot 4 = 12$。

这节课我们由叉积求空间中平行四边形和三角形的面积。`,
  ),
  knowledgePoints: [
    {
      id: "area-of-a-parallelogram-in-3d",
      title: t("Area of a parallelogram in 3D", "三维空间中平行四边形的面积"),
      figure: remainingDrawings7["finding-areas-using-the-cross-product#area-of-a-parallelogram-in-3d"],
      explanation: t(
        "The area of the parallelogram spanned by adjacent vectors $\\mathbf{u}$ and $\\mathbf{v}$ equals the magnitude of their cross product:\n\n$$A = \\|\\mathbf{u} \\times \\mathbf{v}\\|$$\n\nFor $\\mathbf{u} = \\langle 1, 2, 2 \\rangle$ and $\\mathbf{v} = \\langle 2, 1, -2 \\rangle$ the cross product is $\\langle -6, 6, -3 \\rangle$, of length $\\sqrt{36 + 36 + 9} = 9$, so the area is $9$. Check: $\\mathbf{u} \\cdot \\mathbf{v} = 0$, so the parallelogram is a rectangle with sides $\\|\\mathbf{u}\\| = 3$ and $\\|\\mathbf{v}\\| = 3$, and $3 \\cdot 3 = 9$.\n\n> **Watch out.** The area is the length of the cross product, a number, not the vector itself. Do not halve it: half the parallelogram is a triangle.",
        "以相邻向量 $\\mathbf{u}$ 与 $\\mathbf{v}$ 为邻边的平行四边形的面积等于两向量叉积的模长：\n\n$$A = \\|\\mathbf{u} \\times \\mathbf{v}\\|$$\n\n对 $\\mathbf{u} = \\langle 1, 2, 2 \\rangle$ 和 $\\mathbf{v} = \\langle 2, 1, -2 \\rangle$，叉积是 $\\langle -6, 6, -3 \\rangle$，长度为 $\\sqrt{36 + 36 + 9} = 9$，所以面积是 $9$。检验：$\\mathbf{u} \\cdot \\mathbf{v} = 0$，所以这个平行四边形是长方形，两边长 $\\|\\mathbf{u}\\| = 3$、$\\|\\mathbf{v}\\| = 3$，而 $3 \\cdot 3 = 9$。\n\n> **注意。** 面积是叉积的长度，是一个数，而不是叉积这个向量本身。不要除以 $2$：平行四边形的一半才是三角形。",
      ),
      generate(rng) {
        const [uVec, vVec, cp, L] = pickIntegerCrossProduct(rng);
        const dot = dot3(uVec, vVec);

        return numberProblem({
          prompt: t(
            `Find the area of the parallelogram spanned by adjacent vectors $\\mathbf{u} = ${vec3Latex(uVec)}$ and $\\mathbf{v} = ${vec3Latex(vVec)}$.`,
            `求由相邻向量 $\\mathbf{u} = ${vec3Latex(uVec)}$ 与 $\\mathbf{v} = ${vec3Latex(vVec)}$ 张成的平行四边形的面积。`,
          ),
          answer: L,
          form: "integer",
          wrong: [L + 1, Math.max(1, L - 1), L + 2, 2 * L],
          solution: walked(
            [
              [
                ["Compute the cross product", "计算叉积"],
                t("Expand the determinant along its first row:", "沿第一行展开行列式："),
                [
                  `\\mathbf{i}: \\; (${uVec[1]})(${vVec[2]}) - (${uVec[2]})(${vVec[1]}) = ${cp[0]}`,
                  `\\mathbf{j}: \\; -\\big((${uVec[0]})(${vVec[2]}) - (${uVec[2]})(${vVec[0]})\\big) = ${cp[1]}`,
                  `\\mathbf{k}: \\; (${uVec[0]})(${vVec[1]}) - (${uVec[1]})(${vVec[0]}) = ${cp[2]}`,
                ],
              ],
              [
                ["Take its length", "求它的长度"],
                t("The area is the magnitude of the cross product:", "面积是叉积的模长："),
                [`A = \\sqrt{(${cp[0]})^2 + (${cp[1]})^2 + (${cp[2]})^2} = \\sqrt{${L * L}} = ${L}`],
              ],
            ],
            t(
              `The squared area is also $\\|\\mathbf{u}\\|^2 \\|\\mathbf{v}\\|^2 - (\\mathbf{u} \\cdot \\mathbf{v})^2$, since $\\sin^2\\theta = 1 - \\cos^2\\theta$. Here $\\|\\mathbf{u}\\|^2 = ${magSq3(uVec)}$, $\\|\\mathbf{v}\\|^2 = ${magSq3(vVec)}$ and $\\mathbf{u} \\cdot \\mathbf{v} = ${dot}$:\n\n$$${magSq3(uVec)} \\cdot ${magSq3(vVec)} - ${paren(dot)}^2 = ${L * L} = ${L}^2$$`,
              `面积的平方也等于 $\\|\\mathbf{u}\\|^2 \\|\\mathbf{v}\\|^2 - (\\mathbf{u} \\cdot \\mathbf{v})^2$，因为 $\\sin^2\\theta = 1 - \\cos^2\\theta$。这里 $\\|\\mathbf{u}\\|^2 = ${magSq3(uVec)}$，$\\|\\mathbf{v}\\|^2 = ${magSq3(vVec)}$，$\\mathbf{u} \\cdot \\mathbf{v} = ${dot}$：\n\n$$${magSq3(uVec)} \\cdot ${magSq3(vVec)} - ${paren(dot)}^2 = ${L * L} = ${L}^2$$`,
            ),
          ),
        });
      },
    },
    {
      id: "area-of-a-triangle-in-3d",
      title: t("Area of a triangle in 3D", "三维空间中三角形的面积"),
      figure: remainingDrawings7["finding-areas-using-the-cross-product#area-of-a-triangle-in-3d"],
      explanation: t(
        "A triangle with vertices $A, B, C$ has area equal to half the area of the parallelogram formed by $\\vec{AB}$ and $\\vec{AC}$:\n\n$$A = \\frac{1}{2}\\|\\vec{AB} \\times \\vec{AC}\\|$$\n\nFor $A(0, 0, 0)$, $B(3, 0, 0)$ and $C(1, 4, 0)$: $\\vec{AB} \\times \\vec{AC} = \\langle 0, 0, 12 \\rangle$, so the area is $\\frac{1}{2} \\cdot 12 = 6$. Check: the triangle has base $3$ along the $x$-axis and height $4$, and $\\frac{1}{2} \\cdot 3 \\cdot 4 = 6$.\n\n> **Watch out.** Both edge vectors must start at the same vertex, and the coordinates of the vertices themselves are not edge vectors. The triangle is half the parallelogram, so remember the $\\frac{1}{2}$.",
        "以 $A, B, C$ 为顶点的三角形的面积等于由 $\\vec{AB}$ 和 $\\vec{AC}$ 构成的平行四边形面积的一半：\n\n$$A = \\frac{1}{2}\\|\\vec{AB} \\times \\vec{AC}\\|$$\n\n对 $A(0, 0, 0)$、$B(3, 0, 0)$、$C(1, 4, 0)$：$\\vec{AB} \\times \\vec{AC} = \\langle 0, 0, 12 \\rangle$，所以面积是 $\\frac{1}{2} \\cdot 12 = 6$。检验：这个三角形的底沿 $x$ 轴长 $3$，高是 $4$，而 $\\frac{1}{2} \\cdot 3 \\cdot 4 = 6$。\n\n> **注意。** 两条边向量必须从同一个顶点出发，顶点本身的坐标不是边向量。三角形是平行四边形的一半，别忘了 $\\frac{1}{2}$。",
      ),
      generate(rng) {
        const [u, v, cp, L] = pickIntegerCrossProduct(rng);
        const ax = rng.pick([-2, -1, 0, 1, 2]);
        const ay = rng.pick([-2, -1, 0, 1, 2]);
        const az = rng.pick([-2, -1, 0, 1, 2]);
        const A: Vec3 = [ax, ay, az];
        const B = add3(A, u);
        const C = add3(A, v);
        const areaQ = Q.of(L, 2);
        const dot = dot3(u, v);
        const point = (P: Vec3) => `(${P[0]}, ${P[1]}, ${P[2]})`;

        return numberProblem({
          prompt: t(
            `Find the area of the triangle with vertices $A${point(A)}$, $B${point(B)}$, and $C${point(C)}$.`,
            `求空间中顶点为 $A${point(A)}$、$B${point(B)}$ 与 $C${point(C)}$ 的三角形的面积。`,
          ),
          answer: areaQ,
          wrong: [L, Q.of(L, 4), Q.of(L + 2, 2)],
          solution: walked(
            [
              [
                ["Find two edge vectors", "求两条边向量"],
                t("Subtract the coordinates of $A$ from those of $B$ and $C$:", "用 $B$、$C$ 的坐标减去 $A$ 的坐标："),
                [`\\vec{AB} = ${vec3Latex(u)}, \\quad \\vec{AC} = ${vec3Latex(v)}`],
              ],
              [
                ["Compute the cross product", "计算叉积"],
                t("Expand the determinant along its first row:", "沿第一行展开行列式："),
                [`\\vec{AB} \\times \\vec{AC} = ${vec3Latex(cp)}`, `\\|\\vec{AB} \\times \\vec{AC}\\| = \\sqrt{${L * L}} = ${L}`],
              ],
              [
                ["Take half", "取一半"],
                t("The triangle is half of the parallelogram:", "三角形是平行四边形的一半："),
                [`\\frac{1}{2} \\cdot ${L} = ${areaQ.toLatex()}`],
              ],
            ],
            t(
              `Use lengths and the dot product instead: $\\|\\vec{AB}\\|^2 = ${magSq3(u)}$, $\\|\\vec{AC}\\|^2 = ${magSq3(v)}$ and $\\vec{AB} \\cdot \\vec{AC} = ${dot}$. The parallelogram's squared area is\n\n$$${magSq3(u)} \\cdot ${magSq3(v)} - ${paren(dot)}^2 = ${L * L} = ${L}^2$$\n\nSo the triangle's area is again half of $${L}$, which is $${areaQ.toLatex()}$.`,
              `改用长度和点积：$\\|\\vec{AB}\\|^2 = ${magSq3(u)}$，$\\|\\vec{AC}\\|^2 = ${magSq3(v)}$，$\\vec{AB} \\cdot \\vec{AC} = ${dot}$。平行四边形面积的平方是\n\n$$${magSq3(u)} \\cdot ${magSq3(v)} - ${paren(dot)}^2 = ${L * L} = ${L}^2$$\n\n所以三角形的面积仍是 $${L}$ 的一半，即 $${areaQ.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── 5.20.5 The Scalar Triple Product ────────────────────────────────────────

/** theScalarTripleProduct covers u · (v x w) and coplanarity. */
export const theScalarTripleProduct: TopicDef = {
  id: "the-scalar-triple-product",
  title: t("The Scalar Triple Product", "混合积（标量三重积）"),
  summary: t(
    "Evaluate the scalar triple product u · (v x w) as a 3x3 determinant and use it to test for coplanar vectors.",
    "利用三阶行列式计算标量三重积 u · (v x w)，并用于判定三个向量是否共面。",
  ),
  prerequisites: ["calculating-the-cross-product-using-determinants"],
  encompasses: [{ topic: "calculating-the-cross-product-using-determinants", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSN.VM.C.11"],
  intro: t(
    `The determinant turns two vectors into their cross product, and the dot product turns two vectors into a number. Doing both, crossing $\\mathbf{v}$ with $\\mathbf{w}$ and then dotting with $\\mathbf{u}$, turns three vectors into one number. For $\\mathbf{u} = \\langle 1, 1, 1 \\rangle$, $\\mathbf{v} = \\mathbf{i}$ and $\\mathbf{w} = \\mathbf{j}$:

$$\\mathbf{v} \\times \\mathbf{w} = \\mathbf{k}, \\qquad \\mathbf{u} \\cdot \\mathbf{k} = 1$$

Check: putting the three vectors as the rows of a determinant gives the same number, since expanding along the first row multiplies each entry of $\\mathbf{u}$ by a component of $\\mathbf{v} \\times \\mathbf{w}$.

In this lesson we evaluate this scalar triple product and use it to tell when three vectors lie in one plane.`,
    `行列式把两个向量变成它们的叉积，点积把两个向量变成一个数。两者都做，先求 $\\mathbf{v}$ 与 $\\mathbf{w}$ 的叉积，再与 $\\mathbf{u}$ 作点积，就把三个向量变成一个数。对 $\\mathbf{u} = \\langle 1, 1, 1 \\rangle$、$\\mathbf{v} = \\mathbf{i}$、$\\mathbf{w} = \\mathbf{j}$：

$$\\mathbf{v} \\times \\mathbf{w} = \\mathbf{k}, \\qquad \\mathbf{u} \\cdot \\mathbf{k} = 1$$

检验：把三个向量作为行列式的三行，得到同一个数，因为沿第一行展开时，$\\mathbf{u}$ 的每个分量正好乘以 $\\mathbf{v} \\times \\mathbf{w}$ 的一个分量。

这节课我们计算这个混合积，并用它判断三个向量何时在同一平面内。`,
  ),
  knowledgePoints: [
    {
      id: "evaluating-the-scalar-triple-product",
      title: t("Evaluating the scalar triple product", "计算标量三重积"),
      explanation: t(
        "The scalar triple product is a single number, and it equals the determinant of the matrix whose rows are the three vectors. The scalar triple product of three vectors $\\mathbf{u}, \\mathbf{v}, \\mathbf{w}$ is defined as $\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})$ and equals the $3\\times 3$ determinant:\n\n$$\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w}) = \\begin{vmatrix} u_1 & u_2 & u_3 \\\\ v_1 & v_2 & v_3 \\\\ w_1 & w_2 & w_3 \\end{vmatrix}$$\n\nFor $\\mathbf{u} = \\langle 2, 1, 0 \\rangle$, $\\mathbf{v} = \\langle 0, 3, 1 \\rangle$ and $\\mathbf{w} = \\langle 1, 0, 1 \\rangle$, expanding along the first row gives $2(3 - 0) - 1(0 - 1) + 0 = 7$. Check: $\\mathbf{v} \\times \\mathbf{w} = \\langle 3, 1, -3 \\rangle$, and its dot product with $\\mathbf{u}$ is $6 + 1 + 0 = 7$.\n\n> **Watch out.** The middle term of the expansion carries a minus sign. Swapping two of the vectors changes the sign of the result, so keep them in the order given.",
        "标量三重积是一个数，它等于以三个向量为行的矩阵的行列式。三向量 $\\mathbf{u}, \\mathbf{v}, \\mathbf{w}$ 的标量三重积（混合积）定义为 $\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})$，其值等于相应的三阶行列式：\n\n$$\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w}) = \\begin{vmatrix} u_1 & u_2 & u_3 \\\\ v_1 & v_2 & v_3 \\\\ w_1 & w_2 & w_3 \\end{vmatrix}$$\n\n对 $\\mathbf{u} = \\langle 2, 1, 0 \\rangle$、$\\mathbf{v} = \\langle 0, 3, 1 \\rangle$、$\\mathbf{w} = \\langle 1, 0, 1 \\rangle$，沿第一行展开得 $2(3 - 0) - 1(0 - 1) + 0 = 7$。检验：$\\mathbf{v} \\times \\mathbf{w} = \\langle 3, 1, -3 \\rangle$，它与 $\\mathbf{u}$ 的点积是 $6 + 1 + 0 = 7$。\n\n> **注意。** 展开式的中间一项带负号。交换其中两个向量会改变结果的符号，所以要按给定的顺序排列。",
      ),
      generate(rng) {
        const entries = [-3, -2, -1, 1, 2, 3];
        const u: Vec3 = [rng.pick(entries), rng.pick(entries), rng.pick(entries)];
        const v: Vec3 = [rng.pick(entries), rng.pick(entries), rng.pick(entries)];
        const w: Vec3 = [rng.pick(entries), rng.pick(entries), rng.pick(entries)];
        const ans = det3(u, v, w);
        const vw = cross3(v, w);
        const uv = cross3(u, v);

        return numberProblem({
          prompt: t(
            `Compute the scalar triple product $\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})$ for $\\mathbf{u} = ${vec3Latex(u)}$, $\\mathbf{v} = ${vec3Latex(v)}$, and $\\mathbf{w} = ${vec3Latex(w)}$.`,
            `计算向量 $\\mathbf{u} = ${vec3Latex(u)}$、$\\mathbf{v} = ${vec3Latex(v)}$ 与 $\\mathbf{w} = ${vec3Latex(w)}$ 的混合积 $\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})$。`,
          ),
          answer: ans,
          form: "integer",
          wrong: [-ans, ans + 6, ans - 5, ans + 2],
          solution: walked(
            [
              [
                ["Write the determinant", "写出行列式"],
                t(
                  "Put $\\mathbf{u}$, $\\mathbf{v}$ and $\\mathbf{w}$ as the rows, in that order:",
                  "按顺序把 $\\mathbf{u}$、$\\mathbf{v}$、$\\mathbf{w}$ 作为三行：",
                ),
                [
                  `\\begin{vmatrix} ${u[0]} & ${u[1]} & ${u[2]} \\\\ ${v[0]} & ${v[1]} & ${v[2]} \\\\ ${w[0]} & ${w[1]} & ${w[2]} \\end{vmatrix}`,
                ],
              ],
              [
                ["Expand along the first row", "沿第一行展开"],
                t(
                  "Each $2 \\times 2$ minor is a component of $\\mathbf{v} \\times \\mathbf{w}$, and the middle term is subtracted:",
                  "每个二阶子式是 $\\mathbf{v} \\times \\mathbf{w}$ 的一个分量，中间一项要减去：",
                ),
                [
                  `${u[0]}(${vw[0]}) - ${paren(u[1])}(${-vw[1]}) + ${paren(u[2])}(${vw[2]})`,
                  `= ${u[0] * vw[0]} ${u[1] * vw[1] < 0 ? "-" : "+"} ${Math.abs(u[1] * vw[1])} ${u[2] * vw[2] < 0 ? "-" : "+"} ${Math.abs(u[2] * vw[2])} = ${ans}`,
                ],
              ],
            ],
            t(
              `The scalar triple product is unchanged when the vectors are moved round in a cycle, so it also equals $(\\mathbf{u} \\times \\mathbf{v}) \\cdot \\mathbf{w}$. Here $\\mathbf{u} \\times \\mathbf{v} = ${vec3Latex(uv)}$, and\n\n$$${vec3Latex(uv)} \\cdot ${vec3Latex(w)} = ${ans}$$`,
              `把三个向量轮换，混合积不变，所以它也等于 $(\\mathbf{u} \\times \\mathbf{v}) \\cdot \\mathbf{w}$。这里 $\\mathbf{u} \\times \\mathbf{v} = ${vec3Latex(uv)}$，且\n\n$$${vec3Latex(uv)} \\cdot ${vec3Latex(w)} = ${ans}$$`,
            ),
          ),
        });
      },
    },
    {
      id: "coplanarity-condition-for-three-vectors",
      title: t("Coplanarity condition for three vectors", "利用混合积判定三向量共面"),
      explanation: t(
        "Three vectors in $\\mathbb{R}^3$ are coplanar (lie in the same plane) if and only if their scalar triple product is zero:\n\n$$\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w}) = 0$$\n\nThe vector $\\mathbf{v} \\times \\mathbf{w}$ is perpendicular to the plane of $\\mathbf{v}$ and $\\mathbf{w}$, so its dot product with $\\mathbf{u}$ is zero exactly when $\\mathbf{u}$ lies in that plane. For $\\mathbf{u} = \\langle 1, 1, 0 \\rangle$, $\\mathbf{v} = \\mathbf{i}$ and $\\mathbf{w} = \\mathbf{j}$: $\\mathbf{v} \\times \\mathbf{w} = \\mathbf{k}$ and $\\mathbf{u} \\cdot \\mathbf{k} = 0$, so the three are coplanar. Check: $\\mathbf{u} = \\mathbf{v} + \\mathbf{w}$, so $\\mathbf{u}$ lies in the plane of $\\mathbf{v}$ and $\\mathbf{w}$.\n\n> **Watch out.** Coplanar vectors need not add up to $\\mathbf{0}$ and need not be parallel. The test is that one of them is a combination of the other two, which is what a zero determinant says.",
        "三维空间中的三个向量共面（处于同一平面内）当且仅当它们的混合积等于零：\n\n$$\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w}) = 0$$\n\n向量 $\\mathbf{v} \\times \\mathbf{w}$ 垂直于 $\\mathbf{v}$、$\\mathbf{w}$ 所在的平面，所以它与 $\\mathbf{u}$ 的点积为零恰好表示 $\\mathbf{u}$ 在这个平面内。对 $\\mathbf{u} = \\langle 1, 1, 0 \\rangle$、$\\mathbf{v} = \\mathbf{i}$、$\\mathbf{w} = \\mathbf{j}$：$\\mathbf{v} \\times \\mathbf{w} = \\mathbf{k}$，$\\mathbf{u} \\cdot \\mathbf{k} = 0$，所以三者共面。检验：$\\mathbf{u} = \\mathbf{v} + \\mathbf{w}$，所以 $\\mathbf{u}$ 在 $\\mathbf{v}$、$\\mathbf{w}$ 所在的平面内。\n\n> **注意。** 共面的向量不一定相加为 $\\mathbf{0}$，也不一定平行。判定的是其中一个能由另外两个组合出来，这正是行列式为零的含义。",
      ),
      generate(rng) {
        const u: Vec3 = [rng.pick([1, 2, 3]), rng.pick([-2, -1, 1, 2]), rng.pick([-2, -1, 1, 2])];
        const v0: Vec3 = [rng.pick([-2, -1, 1, 2]), rng.pick([1, 2, 3]), rng.pick([-2, -1, 1, 2])];
        // The coefficient of k is the k-component of u x v; shifting v's first entry by 1 changes it by -u[1], which is never 0.
        const v: Vec3 = u[0] * v0[1] - u[1] * v0[0] === 0 ? [v0[0] + 1, v0[1], v0[2]] : v0;

        if (rng.bool()) {
          const prompt = t(
            `Which of the following conditions is necessary and sufficient for three nonzero vectors $\\mathbf{u}, \\mathbf{v}, \\mathbf{w}$ in $\\mathbb{R}^3$ to be coplanar?`,
            `下列哪个条件是三维空间中三个非零向量 $\\mathbf{u}, \\mathbf{v}, \\mathbf{w}$ 共面的充要条件？`,
          );
          const nested = t(
            "$\\mathbf{u} \\times (\\mathbf{v} \\times \\mathbf{w}) = \\mathbf{0}$",
            "$\\mathbf{u} \\times (\\mathbf{v} \\times \\mathbf{w}) = \\mathbf{0}$",
          );
          const equalDots = t(
            "$\\mathbf{u} \\cdot \\mathbf{v} = \\mathbf{v} \\cdot \\mathbf{w}$",
            "$\\mathbf{u} \\cdot \\mathbf{v} = \\mathbf{v} \\cdot \\mathbf{w}$",
          );
          const sumZero = t(
            "$\\mathbf{u} + \\mathbf{v} + \\mathbf{w} = \\mathbf{0}$",
            "$\\mathbf{u} + \\mathbf{v} + \\mathbf{w} = \\mathbf{0}$",
          );
          return oneOf(
            rng,
            prompt,
            t("$\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w}) = 0$", "$\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w}) = 0$"),
            [nested, equalDots, sumZero],
            walked(
              [
                [
                  ["Find a normal to the plane", "找出平面的法向量"],
                  t(
                    "The vector $\\mathbf{v} \\times \\mathbf{w}$ is perpendicular to both $\\mathbf{v}$ and $\\mathbf{w}$, so it is perpendicular to the plane they span.",
                    "向量 $\\mathbf{v} \\times \\mathbf{w}$ 同时垂直于 $\\mathbf{v}$ 和 $\\mathbf{w}$，所以垂直于它们张成的平面。",
                  ),
                ],
                [
                  ["Test the third vector", "检验第三个向量"],
                  t(
                    "The vector $\\mathbf{u}$ lies in that plane exactly when it is perpendicular to the normal, that is, when $\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w}) = 0$. This is also the volume of the parallelepiped on the three vectors, which is zero exactly when it is flat.",
                    "向量 $\\mathbf{u}$ 在这个平面内，恰好当它垂直于法向量，即 $\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w}) = 0$。这也是三向量张成的平行六面体的体积，它恰好在立体被压扁时为零。",
                  ),
                ],
              ],
              t(
                "Try $\\mathbf{u} = \\mathbf{i}$, $\\mathbf{v} = \\mathbf{j}$ and $\\mathbf{w} = \\mathbf{i} + \\mathbf{j}$, which all lie in the $xy$-plane. Then $\\mathbf{v} \\times \\mathbf{w} = -\\mathbf{k}$ and $\\mathbf{i} \\cdot (-\\mathbf{k}) = 0$, as the condition says.",
                "取 $\\mathbf{u} = \\mathbf{i}$、$\\mathbf{v} = \\mathbf{j}$、$\\mathbf{w} = \\mathbf{i} + \\mathbf{j}$，它们都在 $xy$ 平面内。此时 $\\mathbf{v} \\times \\mathbf{w} = -\\mathbf{k}$，$\\mathbf{i} \\cdot (-\\mathbf{k}) = 0$，与条件相符。",
              ),
            ),
            [
              why(
                nested,
                "This says u is parallel to v × w, so u is perpendicular to the plane of v and w. That is the opposite of lying in it.",
                "这表示 u 与 v × w 平行，即 u 垂直于 v、w 所在的平面，恰好与在平面内相反。",
              ),
              why(
                equalDots,
                "Equal dot products say nothing about a common plane: i, j and k give u · v = v · w = 0, yet they are not coplanar.",
                "点积相等与是否共面无关：i、j、k 满足 u · v = v · w = 0，但它们不共面。",
              ),
              why(
                sumZero,
                "Vectors that add to 0 are coplanar, but coplanar vectors need not add to 0: i, j and i + j are coplanar and their sum is not 0. The condition is not necessary.",
                "相加为 0 的向量一定共面，但共面的向量不一定相加为 0：i、j、i + j 共面，和却不是 0。这个条件不是必要的。",
              ),
            ],
          );
        }

        const a = rng.pick([-2, -1, 1, 2]);
        const b = rng.pick([-2, -1, 1, 2]);
        const wCop: Vec3 = add3(smul3(a, u), smul3(b, v));
        const ansK = wCop[2];
        const c = cross3(u, v);
        const known = wCop[0] * c[0] + wCop[1] * c[1];
        const wPrompt = `\\langle ${wCop[0]}, ${wCop[1]}, k \\rangle`;
        const au = smul3(a, u);
        const bv = smul3(b, v);

        return numberProblem({
          prompt: t(
            `Find the value of $k$ such that the vectors $\\mathbf{u} = ${vec3Latex(u)}$, $\\mathbf{v} = ${vec3Latex(v)}$, and $\\mathbf{w} = ${wPrompt}$ are coplanar.`,
            `求实数 $k$ 的值，使得向量 $\\mathbf{u} = ${vec3Latex(u)}$、$\\mathbf{v} = ${vec3Latex(v)}$ 与 $\\mathbf{w} = ${wPrompt}$ 共面。`,
          ),
          answer: ansK,
          solveFor: "k",
          form: "integer",
          wrong: [-ansK, ansK + 1, ansK - 2, ansK + 3],
          solution: walked(
            [
              [
                ["Set the determinant to zero", "令行列式为零"],
                t("Three vectors are coplanar exactly when their determinant is zero:", "三个向量共面当且仅当它们的行列式为零："),
                [
                  `\\begin{vmatrix} ${u[0]} & ${u[1]} & ${u[2]} \\\\ ${v[0]} & ${v[1]} & ${v[2]} \\\\ ${wCop[0]} & ${wCop[1]} & k \\end{vmatrix} = 0`,
                ],
              ],
              [
                ["Expand along the third row", "沿第三行展开"],
                t(
                  `The cofactors of the third row are the components of $\\mathbf{u} \\times \\mathbf{v} = ${vec3Latex(c)}$:`,
                  `第三行的代数余子式就是 $\\mathbf{u} \\times \\mathbf{v} = ${vec3Latex(c)}$ 的分量：`,
                ),
                [`${wCop[0]}(${c[0]}) + ${paren(wCop[1])}(${c[1]}) + (${c[2]})k = 0`, `${poly([known, ""], [c[2], "k"])} = 0`],
              ],
              [
                ["Solve for k", "解出 k"],
                t("Move the constant term across, then divide by the coefficient of $k$:", "把常数项移到右边，再除以 $k$ 的系数："),
                [`${poly([c[2], "k"])} = ${-known}`, `k = ${ansK}`],
              ],
            ],
            t(
              `With $k = ${ansK}$, $\\mathbf{w}$ is a combination of $\\mathbf{u}$ and $\\mathbf{v}$, so it lies in their plane:\n\n$$${a === 1 ? "" : a === -1 ? "-" : a}\\mathbf{u} ${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}\\mathbf{v} = ${vec3Latex(au)} + ${vec3Latex(bv)} = ${vec3Latex(wCop)}$$`,
              `当 $k = ${ansK}$ 时，$\\mathbf{w}$ 能由 $\\mathbf{u}$、$\\mathbf{v}$ 组合出来，所以在它们的平面内：\n\n$$${a === 1 ? "" : a === -1 ? "-" : a}\\mathbf{u} ${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}\\mathbf{v} = ${vec3Latex(au)} + ${vec3Latex(bv)} = ${vec3Latex(wCop)}$$`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── 5.20.6 Volumes of Parallelepipeds ───────────────────────────────────────

/** volumesOfParallelepipeds covers V = |u · (v x w)|. */
export const volumesOfParallelepipeds: TopicDef = {
  id: "volumes-of-parallelepipeds",
  title: t("Volumes of Parallelepipeds", "利用混合积计算平行六面体的体积"),
  summary: t(
    "Calculate the volume of a parallelepiped defined by three vectors or vertices using the absolute value of the scalar triple product.",
    "利用标量三重积的绝对值计算由三个向量或空间顶点构成的平行六面体的体积。",
  ),
  prerequisites: ["the-scalar-triple-product"],
  encompasses: [{ topic: "the-scalar-triple-product", weight: 0.5 }],
  xp: 15,
  standards: ["CCSS.HSN.VM.C.11"],
  intro: t(
    `A parallelepiped is a slanted box whose three edges from one corner are $\\mathbf{u}$, $\\mathbf{v}$ and $\\mathbf{w}$. Its volume is base area times height. The base on $\\mathbf{v}$ and $\\mathbf{w}$ has area $\\|\\mathbf{v} \\times \\mathbf{w}\\|$, and the height is the length of the projection of $\\mathbf{u}$ onto $\\mathbf{v} \\times \\mathbf{w}$. Multiplying the two gives the size of the scalar triple product. For the box with edges $2\\mathbf{i}$, $3\\mathbf{j}$ and $4\\mathbf{k}$:

$$\\begin{vmatrix} 2 & 0 & 0 \\\\ 0 & 3 & 0 \\\\ 0 & 0 & 4 \\end{vmatrix} = 24$$

Check: this box is rectangular, and $2 \\cdot 3 \\cdot 4 = 24$.

In this lesson we find volumes of parallelepipeds from their edge vectors and from their vertices.`,
    `平行六面体是一个斜的盒子，从一个顶点出发的三条棱是 $\\mathbf{u}$、$\\mathbf{v}$、$\\mathbf{w}$。它的体积是底面积乘高。以 $\\mathbf{v}$、$\\mathbf{w}$ 为边的底面面积是 $\\|\\mathbf{v} \\times \\mathbf{w}\\|$，高是 $\\mathbf{u}$ 在 $\\mathbf{v} \\times \\mathbf{w}$ 方向上投影的长度。两者相乘就是混合积的大小。对棱为 $2\\mathbf{i}$、$3\\mathbf{j}$、$4\\mathbf{k}$ 的盒子：

$$\\begin{vmatrix} 2 & 0 & 0 \\\\ 0 & 3 & 0 \\\\ 0 & 0 & 4 \\end{vmatrix} = 24$$

检验：这个盒子是长方体，而 $2 \\cdot 3 \\cdot 4 = 24$。

这节课我们由棱向量和由顶点求平行六面体的体积。`,
  ),
  knowledgePoints: [
    {
      id: "volume-of-a-parallelepiped-from-coterminous-vectors",
      title: t("Volume of a parallelepiped from coterminous vectors", "共起点向量构成的平行六面体体积"),
      figure: remainingDrawings7["volumes-of-parallelepipeds#volume-of-a-parallelepiped-from-coterminous-vectors"],
      explanation: t(
        "The volume of a parallelepiped determined by three coterminous vectors $\\mathbf{u}, \\mathbf{v}, \\mathbf{w}$ is the absolute value of their scalar triple product:\n\n$$V = |\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})| = \\left| \\det[\\mathbf{u}, \\mathbf{v}, \\mathbf{w}] \\right|$$\n\nFor $\\mathbf{u} = \\langle 1, 2, 0 \\rangle$, $\\mathbf{v} = \\langle 0, 1, 3 \\rangle$ and $\\mathbf{w} = \\langle 2, 0, 1 \\rangle$, expanding along the first row gives $1(1 - 0) - 2(0 - 6) + 0 = 13$. So the volume is $13$. Check: $\\mathbf{u} \\times \\mathbf{v} = \\langle 6, -3, 1 \\rangle$, and its dot product with $\\mathbf{w}$ is $12 + 0 + 1 = 13$.\n\n> **Watch out.** The determinant can be negative when the vectors are listed in the other orientation. A volume is never negative, so take the absolute value.",
        "由三个共起点向量 $\\mathbf{u}, \\mathbf{v}, \\mathbf{w}$ 确定的平行六面体的体积等于它们混合积的绝对值：\n\n$$V = |\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})| = \\left| \\det[\\mathbf{u}, \\mathbf{v}, \\mathbf{w}] \\right|$$\n\n对 $\\mathbf{u} = \\langle 1, 2, 0 \\rangle$、$\\mathbf{v} = \\langle 0, 1, 3 \\rangle$、$\\mathbf{w} = \\langle 2, 0, 1 \\rangle$，沿第一行展开得 $1(1 - 0) - 2(0 - 6) + 0 = 13$。所以体积是 $13$。检验：$\\mathbf{u} \\times \\mathbf{v} = \\langle 6, -3, 1 \\rangle$，它与 $\\mathbf{w}$ 的点积是 $12 + 0 + 1 = 13$。\n\n> **注意。** 向量按另一种定向排列时，行列式可能是负数。体积不会是负的，所以要取绝对值。",
      ),
      generate(rng) {
        const u: Vec3 = [rng.pick([1, 2, 3]), rng.pick([-2, -1, 0, 1, 2]), rng.pick([-2, -1, 0, 1, 2])];
        const v: Vec3 = [0, rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-2, -1, 0, 1, 2])];
        const w: Vec3 = [0, 0, rng.pick([2, 3, 4, 5])];
        const d = det3(u, v, w);
        const V = Math.abs(d);
        const vw = cross3(v, w);

        return numberProblem({
          prompt: t(
            `Find the volume of the parallelepiped determined by the vectors $\\mathbf{u} = ${vec3Latex(u)}$, $\\mathbf{v} = ${vec3Latex(v)}$, and $\\mathbf{w} = ${vec3Latex(w)}$.`,
            `求由向量 $\\mathbf{u} = ${vec3Latex(u)}$、$\\mathbf{v} = ${vec3Latex(v)}$ 与 $\\mathbf{w} = ${vec3Latex(w)}$ 确定的平行六面体的体积。`,
          ),
          answer: V,
          form: "integer",
          wrong: [V * 2, Math.max(1, V - 3), V + 4, Math.max(1, Math.round(V / 2))],
          solution: walked(
            [
              [
                ["Cross the last two vectors", "求后两个向量的叉积"],
                t("Expand the determinant for $\\mathbf{v} \\times \\mathbf{w}$:", "展开行列式求 $\\mathbf{v} \\times \\mathbf{w}$："),
                [`\\mathbf{v} \\times \\mathbf{w} = ${vec3Latex(vw)}`],
              ],
              [
                ["Dot with the first vector", "与第一个向量作点积"],
                t("This is the scalar triple product:", "这就是混合积："),
                [`\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w}) = ${vec3Latex(u)} \\cdot ${vec3Latex(vw)} = ${d}`],
              ],
              [["Take the absolute value", "取绝对值"], t("A volume is not negative:", "体积不是负数："), [`V = |${d}| = ${V}`]],
            ],
            t(
              `The rows $\\mathbf{u}$, $\\mathbf{v}$, $\\mathbf{w}$ have zeros below the diagonal, so the determinant is the product of the diagonal entries: $${u[0]} \\cdot ${paren(v[1])} \\cdot ${w[2]} = ${d}$. Its absolute value is $${V}$ again.`,
              `行 $\\mathbf{u}$、$\\mathbf{v}$、$\\mathbf{w}$ 在对角线下方都是零，所以行列式等于对角线元素之积：$${u[0]} \\cdot ${paren(v[1])} \\cdot ${w[2]} = ${d}$。它的绝对值仍是 $${V}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "volume-of-a-parallelepiped-from-vertices",
      title: t("Volume of a parallelepiped from vertices", "由顶点坐标计算平行六面体体积"),
      figure: remainingDrawings7["volumes-of-parallelepipeds#volume-of-a-parallelepiped-from-vertices"],
      explanation: t(
        "Subtract the coordinates of the shared vertex from the other three to get the edge vectors, then take the absolute value of their triple product. If a parallelepiped has a vertex $A$ with three adjacent vertices $B, C, D$, its volume is:\n\n$$V = |\\vec{AB} \\cdot (\\vec{AC} \\times \\vec{AD})|$$\n\nFor $A(1, 1, 1)$, $B(3, 1, 1)$, $C(1, 4, 1)$ and $D(1, 1, 2)$ the edge vectors are $\\langle 2, 0, 0 \\rangle$, $\\langle 0, 3, 0 \\rangle$ and $\\langle 0, 0, 1 \\rangle$, so the volume is $2 \\cdot 3 \\cdot 1 = 6$. Check: the edges lie along the axes, so this is a rectangular box $2$ by $3$ by $1$.\n\n> **Watch out.** Use the edge vectors from $A$, not the coordinates of $B$, $C$ and $D$. The vertices must all be adjacent to $A$; the corner opposite $A$ is not an edge endpoint.",
        "用另外三个顶点的坐标减去公共顶点的坐标得到棱向量，再取它们三重积的绝对值。若平行六面体的一个顶点为 $A$，且与之相邻的三个顶点为 $B, C, D$，则其体积为：\n\n$$V = |\\vec{AB} \\cdot (\\vec{AC} \\times \\vec{AD})|$$\n\n对 $A(1, 1, 1)$、$B(3, 1, 1)$、$C(1, 4, 1)$、$D(1, 1, 2)$，棱向量是 $\\langle 2, 0, 0 \\rangle$、$\\langle 0, 3, 0 \\rangle$、$\\langle 0, 0, 1 \\rangle$，所以体积是 $2 \\cdot 3 \\cdot 1 = 6$。检验：三条棱沿坐标轴，所以这是一个 $2 \\times 3 \\times 1$ 的长方体。\n\n> **注意。** 要用从 $A$ 出发的棱向量，而不是 $B$、$C$、$D$ 的坐标。这三个顶点都必须与 $A$ 相邻；与 $A$ 相对的那个顶点不是棱的端点。",
      ),
      generate(rng) {
        const A: Vec3 = [rng.pick([-2, -1, 0, 1, 2]), rng.pick([-2, -1, 0, 1, 2]), rng.pick([-2, -1, 0, 1, 2])];
        const u: Vec3 = [rng.pick([2, 3, 4]), 0, 0];
        const v: Vec3 = [rng.pick([-1, 1, 2]), rng.pick([2, 3]), 0];
        const w: Vec3 = [0, rng.pick([-1, 1, 2]), rng.pick([2, 3, 4])];
        const B = add3(A, u);
        const C = add3(A, v);
        const D = add3(A, w);
        const d = det3(u, v, w);
        const V = Math.abs(d);
        const vw = cross3(v, w);
        const point = (P: Vec3) => `(${P[0]}, ${P[1]}, ${P[2]})`;

        return numberProblem({
          prompt: t(
            `Find the volume of the parallelepiped with vertex $A${point(A)}$ and adjacent vertices $B${point(B)}$, $C${point(C)}$, and $D${point(D)}$.`,
            `求以 $A${point(A)}$ 为顶点，且与之相邻的三个顶点为 $B${point(B)}$、$C${point(C)}$ 与 $D${point(D)}$ 的平行六面体的体积。`,
          ),
          answer: V,
          form: "integer",
          wrong: [V * 2, Math.max(1, V - 2), V + 3, Math.max(1, Math.round(V / 3))],
          solution: walked(
            [
              [
                ["Find the edge vectors", "求棱向量"],
                t("Subtract the coordinates of $A$:", "减去 $A$ 的坐标："),
                [`\\vec{AB} = ${vec3Latex(u)}, \\quad \\vec{AC} = ${vec3Latex(v)}, \\quad \\vec{AD} = ${vec3Latex(w)}`],
              ],
              [
                ["Compute the triple product", "计算混合积"],
                t("Cross the last two edges, then dot with the first:", "先求后两条棱的叉积，再与第一条作点积："),
                [`\\vec{AC} \\times \\vec{AD} = ${vec3Latex(vw)}`, `\\vec{AB} \\cdot (\\vec{AC} \\times \\vec{AD}) = ${d}`],
              ],
              [
                ["Take the absolute value", "取绝对值"],
                t("The volume is the size of that number:", "体积是这个数的绝对值："),
                [`V = |${d}| = ${V}`],
              ],
            ],
            t(
              `In the determinant with rows $\\vec{AB}$, $\\vec{AC}$, $\\vec{AD}$, every entry above the diagonal is $0$, so it equals the product of the diagonal entries: $${u[0]} \\cdot ${v[1]} \\cdot ${w[2]} = ${V}$.`,
              `以 $\\vec{AB}$、$\\vec{AC}$、$\\vec{AD}$ 为行的行列式中，对角线上方的元素都是 $0$，所以它等于对角线元素之积：$${u[0]} \\cdot ${v[1]} \\cdot ${w[2]} = ${V}$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── 5.20.7 Volumes of Tetrahedrons and Pyramids ─────────────────────────────

/** findingVolumesOfTetrahedronsAndPyramidsUsingVectorProducts covers 1/6 and 1/3 volume formulas. */
export const findingVolumesOfTetrahedronsAndPyramidsUsingVectorProducts: TopicDef = {
  id: "finding-volumes-of-tetrahedrons-and-pyramids-using-vector-products",
  title: t("Finding Volumes of Tetrahedrons and Pyramids Using Vector Products", "利用向量积计算四面体和棱锥的体积"),
  summary: t(
    "Calculate the volume of a tetrahedron (V = 1/6 |u · (v x w)|) and a pyramid with a parallelogram base (V = 1/3 |u · (v x w)|) using vector products.",
    "利用向量积计算四面体的体积（V = 1/6 |u · (v x w)|）以及平行四边形底棱锥的体积（V = 1/3 |u · (v x w)|）。",
  ),
  prerequisites: ["volumes-of-parallelepipeds"],
  encompasses: [{ topic: "volumes-of-parallelepipeds", weight: 0.5 }],
  xp: 15,
  standards: ["CCSS.HSN.VM.C.11"],
  intro: t(
    `A parallelepiped on $\\mathbf{u}$, $\\mathbf{v}$, $\\mathbf{w}$ has volume $|\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})|$, which is base area times height. A pyramid with the same base and the same height has one third of that volume. If its base is only the triangle on two of the edges, half the parallelogram, it has one sixth. For the edges $2\\mathbf{i}$, $3\\mathbf{j}$ and $6\\mathbf{k}$ the box has volume $36$, so the tetrahedron on these edges has volume $6$.

Check: the tetrahedron's base is a right triangle of area $\\frac{1}{2} \\cdot 2 \\cdot 3 = 3$ and its height is $6$, and $\\frac{1}{3} \\cdot 3 \\cdot 6 = 6$.

In this lesson we find volumes of tetrahedrons and of pyramids with parallelogram bases from the scalar triple product.`,
    `以 $\\mathbf{u}$、$\\mathbf{v}$、$\\mathbf{w}$ 为棱的平行六面体体积是 $|\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})|$，即底面积乘高。同底等高的棱锥体积是它的三分之一。如果底面只是两条棱构成的三角形，即平行四边形的一半，体积就是六分之一。对棱 $2\\mathbf{i}$、$3\\mathbf{j}$、$6\\mathbf{k}$，盒子的体积是 $36$，所以以它们为棱的四面体体积是 $6$。

检验：这个四面体的底面是直角三角形，面积 $\\frac{1}{2} \\cdot 2 \\cdot 3 = 3$，高是 $6$，而 $\\frac{1}{3} \\cdot 3 \\cdot 6 = 6$。

这节课我们由混合积求四面体以及平行四边形底棱锥的体积。`,
  ),
  knowledgePoints: [
    {
      id: "volume-of-a-tetrahedron",
      title: t("Volume of a tetrahedron", "四面体的体积"),
      figure: remainingDrawings7["finding-volumes-of-tetrahedrons-and-pyramids-using-vector-products#volume-of-a-tetrahedron"],
      explanation: t(
        "A tetrahedron (triangular pyramid) spanned by three vectors $\\mathbf{u}, \\mathbf{v}, \\mathbf{w}$ has volume equal to $\\frac{1}{6}$ of the volume of the corresponding parallelepiped:\n\n$$V = \\frac{1}{6}|\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})| = \\frac{1}{6}\\left| \\det[\\mathbf{u}, \\mathbf{v}, \\mathbf{w}] \\right|$$\n\nThe factor is $\\frac{1}{3}$ for a pyramid times $\\frac{1}{2}$ for a triangular base. For $\\mathbf{u} = \\langle 1, 0, 0 \\rangle$, $\\mathbf{v} = \\langle 0, 2, 0 \\rangle$ and $\\mathbf{w} = \\langle 1, 1, 3 \\rangle$ the determinant is $1 \\cdot 2 \\cdot 3 = 6$, so the volume is $1$. Check: the base triangle in the $xy$-plane has area $\\frac{1}{2} \\cdot 1 \\cdot 2 = 1$, the apex is $3$ above it, and $\\frac{1}{3} \\cdot 1 \\cdot 3 = 1$.\n\n> **Watch out.** The tetrahedron is one sixth of the parallelepiped, not one third: one third is for a pyramid whose base is the whole parallelogram.",
        "由三个向量 $\\mathbf{u}, \\mathbf{v}, \\mathbf{w}$ 确定的四面体（三棱锥）的体积等于相应平行六面体体积的 $\\frac{1}{6}$：\n\n$$V = \\frac{1}{6}|\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})| = \\frac{1}{6}\\left| \\det[\\mathbf{u}, \\mathbf{v}, \\mathbf{w}] \\right|$$\n\n这个系数是棱锥的 $\\frac{1}{3}$ 乘以三角形底面的 $\\frac{1}{2}$。对 $\\mathbf{u} = \\langle 1, 0, 0 \\rangle$、$\\mathbf{v} = \\langle 0, 2, 0 \\rangle$、$\\mathbf{w} = \\langle 1, 1, 3 \\rangle$，行列式是 $1 \\cdot 2 \\cdot 3 = 6$，所以体积是 $1$。检验：$xy$ 平面内的底面三角形面积是 $\\frac{1}{2} \\cdot 1 \\cdot 2 = 1$，顶点在它上方 $3$，而 $\\frac{1}{3} \\cdot 1 \\cdot 3 = 1$。\n\n> **注意。** 四面体是平行六面体的六分之一，不是三分之一：三分之一是底面为整个平行四边形的棱锥。",
      ),
      generate(rng) {
        const k = rng.pick([1, 2, 3, 4, 5, 6]);
        const u: Vec3 = [rng.pick([1, 2, 3]), 0, 0];
        const v: Vec3 = [0, rng.pick([1, 2, 3]), 0];
        const base = u[0] * v[1];
        const wZ = (base % 6 === 0 ? 1 : base % 3 === 0 ? 2 : base % 2 === 0 ? 3 : 6) * k;
        const w: Vec3 = [rng.pick([0, 1]), rng.pick([0, 1]), wZ];
        const detVal = Math.abs(det3(u, v, w));
        const V = detVal / 6;
        const triangle = Q.of(base, 2);

        return numberProblem({
          prompt: t(
            `Find the volume of the tetrahedron determined by the edge vectors $\\mathbf{u} = ${vec3Latex(u)}$, $\\mathbf{v} = ${vec3Latex(v)}$, and $\\mathbf{w} = ${vec3Latex(w)}$.`,
            `求由棱向量 $\\mathbf{u} = ${vec3Latex(u)}$、$\\mathbf{v} = ${vec3Latex(v)}$ 与 $\\mathbf{w} = ${vec3Latex(w)}$ 确定的四面体的体积。`,
          ),
          answer: V,
          form: "integer",
          wrong: [detVal, detVal / 3, detVal / 2, V + 2],
          solution: walked(
            [
              [
                ["Compute the triple product", "计算混合积"],
                t(
                  "The rows $\\mathbf{u}$, $\\mathbf{v}$, $\\mathbf{w}$ have zeros above the diagonal, so the determinant is the product of the diagonal entries:",
                  "行 $\\mathbf{u}$、$\\mathbf{v}$、$\\mathbf{w}$ 在对角线上方都是零，所以行列式等于对角线元素之积：",
                ),
                [`|\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})| = ${u[0]} \\cdot ${v[1]} \\cdot ${wZ} = ${detVal}`],
              ],
              [
                ["Take one sixth", "取六分之一"],
                t("A tetrahedron is one sixth of the parallelepiped on the same edges:", "四面体是同棱平行六面体的六分之一："),
                [`V = \\frac{1}{6} \\cdot ${detVal} = ${V}`],
              ],
            ],
            t(
              `Use base and height. The edges $\\mathbf{u}$ and $\\mathbf{v}$ lie in the $xy$-plane and form a right triangle of area $\\frac{1}{2} \\cdot ${u[0]} \\cdot ${v[1]} = ${triangle.toLatex()}$. The apex is $${wZ}$ above that plane, so\n\n$$V = \\frac{1}{3} \\cdot ${triangle.toLatex()} \\cdot ${wZ} = ${V}$$`,
              `用底面积和高。棱 $\\mathbf{u}$、$\\mathbf{v}$ 在 $xy$ 平面内，构成面积为 $\\frac{1}{2} \\cdot ${u[0]} \\cdot ${v[1]} = ${triangle.toLatex()}$ 的直角三角形。顶点在该平面上方 $${wZ}$，所以\n\n$$V = \\frac{1}{3} \\cdot ${triangle.toLatex()} \\cdot ${wZ} = ${V}$$`,
            ),
          ),
        });
      },
    },
    {
      id: "volume-of-a-pyramid-with-parallelogram-base",
      title: t("Volume of a pyramid with parallelogram base", "平行四边形底棱锥的体积"),
      figure:
        remainingDrawings7[
          "finding-volumes-of-tetrahedrons-and-pyramids-using-vector-products#volume-of-a-pyramid-with-parallelogram-base"
        ],
      explanation: t(
        "A pyramid whose base is a parallelogram spanned by $\\mathbf{u}$ and $\\mathbf{v}$, and whose apex is located by vector $\\mathbf{w}$ from the same corner, has volume:\n\n$$V = \\frac{1}{3}\\times \\text{Base Area} \\times \\text{Height} = \\frac{1}{3}|\\mathbf{w} \\cdot (\\mathbf{u} \\times \\mathbf{v})|$$\n\nFor $\\mathbf{u} = \\langle 2, 0, 0 \\rangle$, $\\mathbf{v} = \\langle 0, 3, 0 \\rangle$ and $\\mathbf{w} = \\langle 1, 0, 2 \\rangle$: $\\mathbf{u} \\times \\mathbf{v} = \\langle 0, 0, 6 \\rangle$ and $\\mathbf{w} \\cdot \\langle 0, 0, 6 \\rangle = 12$, so the volume is $4$. Check: the base is a $2$ by $3$ rectangle of area $6$, the apex is $2$ above it, and $\\frac{1}{3} \\cdot 6 \\cdot 2 = 4$.\n\n> **Watch out.** The base here is the whole parallelogram, so the factor is $\\frac{1}{3}$, not $\\frac{1}{6}$. Sliding the apex sideways does not change the height or the volume.",
        "底面为由 $\\mathbf{u}$ 与 $\\mathbf{v}$ 张成的平行四边形，且从同一起点指向顶点的向量为 $\\mathbf{w}$ 的四棱锥，其体积为：\n\n$$V = \\frac{1}{3}\\times \\text{底面积} \\times \\text{高} = \\frac{1}{3}|\\mathbf{w} \\cdot (\\mathbf{u} \\times \\mathbf{v})|$$\n\n对 $\\mathbf{u} = \\langle 2, 0, 0 \\rangle$、$\\mathbf{v} = \\langle 0, 3, 0 \\rangle$、$\\mathbf{w} = \\langle 1, 0, 2 \\rangle$：$\\mathbf{u} \\times \\mathbf{v} = \\langle 0, 0, 6 \\rangle$，$\\mathbf{w} \\cdot \\langle 0, 0, 6 \\rangle = 12$，所以体积是 $4$。检验：底面是 $2 \\times 3$ 的长方形，面积 $6$，顶点在它上方 $2$，而 $\\frac{1}{3} \\cdot 6 \\cdot 2 = 4$。\n\n> **注意。** 这里的底面是整个平行四边形，所以系数是 $\\frac{1}{3}$，不是 $\\frac{1}{6}$。顶点沿水平方向移动不改变高，也不改变体积。",
      ),
      generate(rng) {
        const k = rng.pick([1, 2, 3, 4, 5, 6, 7]);
        const u: Vec3 = [rng.pick([1, 2, 3]), 0, 0];
        const v: Vec3 = [0, rng.pick([1, 2, 3]), 0];
        const base = u[0] * v[1];
        const wZ = (base % 3 === 0 ? 1 : 3) * k;
        const w: Vec3 = [rng.pick([0, 1]), rng.pick([0, 1]), wZ];
        const uv = cross3(u, v);
        const detVal = Math.abs(dot3(w, uv));
        const V = detVal / 3;

        return numberProblem({
          prompt: t(
            `Find the volume of a pyramid whose base is a parallelogram spanned by $\\mathbf{u} = ${vec3Latex(u)}$ and $\\mathbf{v} = ${vec3Latex(v)}$, and whose apex is defined by vector $\\mathbf{w} = ${vec3Latex(w)}$ from the same origin.`,
            `一个四棱锥的底面是由 $\\mathbf{u} = ${vec3Latex(u)}$ 与 $\\mathbf{v} = ${vec3Latex(v)}$ 张成的平行四边形，从同一起点指向顶点的向量为 $\\mathbf{w} = ${vec3Latex(w)}$。求该棱锥的体积。`,
          ),
          answer: V,
          form: "integer",
          wrong: [detVal, detVal % 6 === 0 ? detVal / 6 : 2 * V, V + 2, Math.max(1, V - 2)],
          solution: walked(
            [
              [
                ["Cross the base edges", "求底面两边的叉积"],
                t("The base edges both lie in the $xy$-plane:", "底面两边都在 $xy$ 平面内："),
                [`\\mathbf{u} \\times \\mathbf{v} = ${vec3Latex(uv)}`],
              ],
              [
                ["Dot with the apex vector", "与指向顶点的向量作点积"],
                t("This gives the volume of the parallelepiped on the three vectors:", "这给出三向量张成的平行六面体的体积："),
                [`|\\mathbf{w} \\cdot (\\mathbf{u} \\times \\mathbf{v})| = |${vec3Latex(w)} \\cdot ${vec3Latex(uv)}| = ${detVal}`],
              ],
              [
                ["Take one third", "取三分之一"],
                t(
                  "A pyramid on the whole parallelogram is one third of the parallelepiped:",
                  "以整个平行四边形为底的棱锥是平行六面体的三分之一：",
                ),
                [`V = \\frac{1}{3} \\cdot ${detVal} = ${V}`],
              ],
            ],
            t(
              `Use base and height. The base is a rectangle of area $${u[0]} \\cdot ${v[1]} = ${base}$ in the $xy$-plane, and the apex is $${wZ}$ above it, so\n\n$$V = \\frac{1}{3} \\cdot ${base} \\cdot ${wZ} = ${V}$$`,
              `用底面积和高。底面是 $xy$ 平面内面积为 $${u[0]} \\cdot ${v[1]} = ${base}$ 的长方形，顶点在它上方 $${wZ}$，所以\n\n$$V = \\frac{1}{3} \\cdot ${base} \\cdot ${wZ} = ${V}$$`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── Export array: all 15 topics, modules 5.18–5.20 ──────────────────────────

/** precalculusVector3DTopics collects the 15 topics of Modules 5.18, 5.19, and 5.20. */
export const precalculusVector3DTopics: readonly TopicDef[] = [
  threeDimensionalVectorsInComponentForm,
  additionAndScalarMultiplicationOfCartesianVectorsIn3D,
  calculatingTheMagnitudeOfCartesianVectorsIn3D,
  calculatingTheDotProductUsingAngleAndMagnitude,
  calculatingTheDotProductUsingComponents,
  theAngleBetweenTwoVectors,
  calculatingAScalarProjection,
  calculatingAVectorProjection,
  theCrossProductOfTwoVectors,
  propertiesOfTheCrossProduct,
  calculatingTheCrossProductUsingDeterminants,
  findingAreasUsingTheCrossProduct,
  theScalarTripleProduct,
  volumesOfParallelepipeds,
  findingVolumesOfTetrahedronsAndPyramidsUsingVectorProducts,
];
