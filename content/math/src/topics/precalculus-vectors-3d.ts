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
  knowledgePoints: [
    {
      id: "geometric-definition-and-magnitude-of-cross-product",
      title: t("Geometric definition and magnitude of cross product", "叉积的几何定义与模长"),
      figure: remainingDrawings7["the-cross-product-of-two-vectors#geometric-definition-and-magnitude-of-cross-product"],
      explanation: t(
        "Unlike the dot product, the cross product $\\mathbf{u} \\times \\mathbf{v}$ is a vector in $\\mathbb{R}^3$. Its magnitude is given by:\n\n$$\\|\\mathbf{u} \\times \\mathbf{v}\\| = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\sin\\theta$$\n\nwhere $\\theta \\in [0, \\pi]$ is the angle between the two vectors.",
        "与数量积不同，叉积（向量积）$\\mathbf{u} \\times \\mathbf{v}$ 的结果是三维空间中的一个向量。其模长公式为：\n\n$$\\|\\mathbf{u} \\times \\mathbf{v}\\| = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\sin\\theta$$\n\n其中 $\\theta \\in [0, \\pi]$ 是两向量的夹角。",
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

        return numberProblem({
          prompt: t(
            `Given two vectors with $\\|\\mathbf{u}\\| = ${uMag}$, $\\|\\mathbf{v}\\| = ${vMag}$, and angle $\\theta = ${angle.deg}$, calculate $\\|\\mathbf{u} \\times \\mathbf{v}\\|$.`,
            `已知两向量满足 $\\|\\mathbf{u}\\| = ${uMag}$，$\\|\\mathbf{v}\\| = ${vMag}$，且夹角 $\\theta = ${angle.deg}$，计算叉积的模长 $\\|\\mathbf{u} \\times \\mathbf{v}\\|$。`,
          ),
          answer: ans,
          form: "integer",
          wrong: [prod, 0, uMag + vMag, Math.round(prod / 4)],
          solution: t(
            `$$\\|\\mathbf{u} \\times \\mathbf{v}\\| = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\sin\\theta = (${uMag})(${vMag})(${angle.sinTex}) = ${ans}$$`,
            `$$\\|\\mathbf{u} \\times \\mathbf{v}\\| = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\sin\\theta = (${uMag})(${vMag})(${angle.sinTex}) = ${ans}$$`,
          ),
        });
      },
    },
    {
      id: "direction-of-cross-product-and-orthogonality",
      title: t("Direction of cross product and orthogonality", "叉积的方向与右手定则"),
      figure: remainingDrawings7["the-cross-product-of-two-vectors#direction-of-cross-product-and-orthogonality"],
      explanation: t(
        "The direction of $\\mathbf{u} \\times \\mathbf{v}$ is perpendicular to both $\\mathbf{u}$ and $\\mathbf{v}$, following the right-hand rule. For the standard basis vectors:\n\n$$\\mathbf{i} \\times \\mathbf{j} = \\mathbf{k}, \\quad \\mathbf{j} \\times \\mathbf{k} = \\mathbf{i}, \\quad \\mathbf{k} \\times \\mathbf{i} = \\mathbf{j}$$\n\n$$\\mathbf{j} \\times \\mathbf{i} = -\\mathbf{k}, \\quad \\mathbf{k} \\times \\mathbf{j} = -\\mathbf{i}, \\quad \\mathbf{i} \\times \\mathbf{k} = -\\mathbf{j}$$",
        "叉积 $\\mathbf{u} \\times \\mathbf{v}$ 的方向同时垂直于 $\\mathbf{u}$ 和 $\\mathbf{v}$，满足右手定则。标准基向量的叉积关系为：\n\n$$\\mathbf{i} \\times \\mathbf{j} = \\mathbf{k}, \\quad \\mathbf{j} \\times \\mathbf{k} = \\mathbf{i}, \\quad \\mathbf{k} \\times \\mathbf{i} = \\mathbf{j}$$\n\n$$\\mathbf{j} \\times \\mathbf{i} = -\\mathbf{k}, \\quad \\mathbf{k} \\times \\mathbf{j} = -\\mathbf{i}, \\quad \\mathbf{i} \\times \\mathbf{k} = -\\mathbf{j}$$",
      ),
      generate(rng) {
        const item = rng.pick([
          { expr: "\\mathbf{i} \\times \\mathbf{j}", ans: "\\mathbf{k}", wrong: ["-\\mathbf{k}", "\\mathbf{0}", "\\mathbf{j}"] },
          { expr: "\\mathbf{j} \\times \\mathbf{i}", ans: "-\\mathbf{k}", wrong: ["\\mathbf{k}", "\\mathbf{0}", "\\mathbf{i}"] },
          { expr: "\\mathbf{j} \\times \\mathbf{k}", ans: "\\mathbf{i}", wrong: ["-\\mathbf{i}", "\\mathbf{k}", "\\mathbf{0}"] },
          { expr: "\\mathbf{k} \\times \\mathbf{j}", ans: "-\\mathbf{i}", wrong: ["\\mathbf{i}", "-\\mathbf{k}", "\\mathbf{0}"] },
          { expr: "\\mathbf{k} \\times \\mathbf{i}", ans: "\\mathbf{j}", wrong: ["-\\mathbf{j}", "\\mathbf{i}", "\\mathbf{0}"] },
          { expr: "\\mathbf{i} \\times \\mathbf{k}", ans: "-\\mathbf{j}", wrong: ["\\mathbf{j}", "-\\mathbf{i}", "\\mathbf{0}"] },
        ]);
        const a = rng.pick([2, 3, -2, -3]);
        const b = rng.pick([2, 4, -1]);
        const coeff = a * b;

        const exprParts = item.expr.split("\\times");
        const term1 = a === 1 ? exprParts[0]!.trim() : a === -1 ? `(-${exprParts[0]!.trim()})` : `(${a}${exprParts[0]!.trim()})`;
        const term2 = b === 1 ? exprParts[1]!.trim() : b === -1 ? `(-${exprParts[1]!.trim()})` : `(${b}${exprParts[1]!.trim()})`;
        const promptExpr = `${term1} \\times ${term2}`;

        const baseSign = item.ans.startsWith("-") ? -1 : 1;
        const baseSymbol = item.ans.replace("-", "");
        const finalCoeff = coeff * baseSign;
        const right = finalCoeff === 1 ? baseSymbol : finalCoeff === -1 ? `-${baseSymbol}` : `${finalCoeff}${baseSymbol}`;
        const w1 = finalCoeff === 1 ? `-${baseSymbol}` : `${-finalCoeff}${baseSymbol}`;
        const w2 = "\\mathbf{0}";
        const w3 = `${finalCoeff}\\mathbf{k}`;

        return oneOf(
          rng,
          t(`Evaluate the vector expression $${promptExpr}$.`, `计算向量表达式 $${promptExpr}$。`),
          t(`$${right}$`, `$${right}$`),
          [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`)],
          t(
            `Pull out the scalars: $(${a})(${b})(${item.expr}) = ${coeff}(${item.ans}) = ${right}$.`,
            `先提出标量系数：$(${a})(${b})(${item.expr}) = ${coeff}(${item.ans}) = ${right}$。`,
          ),
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
  knowledgePoints: [
    {
      id: "anti-commutativity-and-parallel-vectors",
      title: t("Anti-commutativity and parallel vectors", "反交换律与平行向量"),
      figure: remainingDrawings7["properties-of-the-cross-product#anti-commutativity-and-parallel-vectors"],
      explanation: t(
        "Key properties of the cross product include:\n\n1. **Anti-commutativity**: $\\mathbf{v} \\times \\mathbf{u} = -(\\mathbf{u} \\times \\mathbf{v})$\n2. **Self-product**: $\\mathbf{u} \\times \\mathbf{u} = \\mathbf{0}$\n3. **Collinearity / Parallel vectors**: Two nonzero vectors $\\mathbf{u}$ and $\\mathbf{v}$ are parallel if and only if $\\mathbf{u} \\times \\mathbf{v} = \\mathbf{0}$.",
        "向量叉积的关键代数性质包括：\n\n1. **反交换律**：$\\mathbf{v} \\times \\mathbf{u} = -(\\mathbf{u} \\times \\mathbf{v})$\n2. **自身叉积**：$\\mathbf{u} \\times \\mathbf{u} = \\mathbf{0}$\n3. **共线 / 平行判定**：两非零向量 $\\mathbf{u}$ 与 $\\mathbf{v}$ 平行当且仅当 $\\mathbf{u} \\times \\mathbf{v} = \\mathbf{0}$。",
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
          const aStr = a === 1 ? "\\mathbf{v}" : a === -1 ? "-\\mathbf{v}" : `${a}\\mathbf{v}`;
          const bStr = b === 1 ? "\\mathbf{u}" : b === -1 ? "-\\mathbf{u}" : `${b}\\mathbf{u}`;

          return pointProblem({
            prompt: t(
              `Given that $\\mathbf{u} \\times \\mathbf{v} = ${vec3Latex(w)}$, find the value of $(${aStr}) \\times (${bStr})$.`,
              `已知 $\\mathbf{u} \\times \\mathbf{v} = ${vec3Latex(w)}$，求 $(${aStr}) \\times (${bStr})$ 的值。`,
            ),
            answer: ans,
            vars: ["x", "y", "z"],
            vector: true,
            wrong: [smul3(-factor, w), smul3(a * b, w), [0, 0, 0]],
            solution: t(
              `By anti-commutativity and scalar associativity:\n\n$$(${aStr}) \\times (${bStr}) = ${poly([a * b, "(\\mathbf{v} \\times \\mathbf{u})"])} = ${poly([-a * b, "(\\mathbf{u} \\times \\mathbf{v})"])} = ${factor}${vec3Latex(w)} = ${vec3Latex(ans)}$$`,
              `根据反交换律与数乘结合律：\n\n$$(${aStr}) \\times (${bStr}) = ${poly([a * b, "(\\mathbf{v} \\times \\mathbf{u})"])} = ${poly([-a * b, "(\\mathbf{u} \\times \\mathbf{v})"])} = ${factor}${vec3Latex(w)} = ${vec3Latex(ans)}$$`,
            ),
          });
        }

        const base: Vec3 = [rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-3, -2, -1, 1, 2, 3])];
        const k = rng.pick([-3, -2, 2, 3, 4]);
        const parallelVec = smul3(k, base);
        const nonParallel1: Vec3 = [parallelVec[0], parallelVec[1], parallelVec[2] + 1];
        const nonParallel2: Vec3 = [parallelVec[1], parallelVec[0], parallelVec[2]];
        const nonParallel3: Vec3 = [parallelVec[0] + 1, parallelVec[1] - 1, parallelVec[2]];

        return oneOf(
          rng,
          t(
            `Which of the following vectors is parallel to $\\mathbf{u} = ${vec3Latex(base)}$ (i.e. satisfies $\\mathbf{u} \\times \\mathbf{v} = \\mathbf{0}$)?`,
            `下列哪个向量与 $\\mathbf{u} = ${vec3Latex(base)}$ 平行（即满足 $\\mathbf{u} \\times \\mathbf{v} = \\mathbf{0}$）？`,
          ),
          t(`$${vec3Latex(parallelVec)}$`, `$${vec3Latex(parallelVec)}$`),
          [
            t(`$${vec3Latex(nonParallel1)}$`, `$${vec3Latex(nonParallel1)}$`),
            t(`$${vec3Latex(nonParallel2)}$`, `$${vec3Latex(nonParallel2)}$`),
            t(`$${vec3Latex(nonParallel3)}$`, `$${vec3Latex(nonParallel3)}$`),
          ],
          t(
            `Two vectors have zero cross product if and only if one is a scalar multiple of the other. Here $${vec3Latex(parallelVec)} = ${k}${vec3Latex(base)}$.`,
            `两向量叉积为零当且仅当它们互为数乘倍数。这里 $${vec3Latex(parallelVec)} = ${k}${vec3Latex(base)}$。`,
          ),
        );
      },
    },
    {
      id: "distributivity-and-scalar-associativity-of-cross-product",
      title: t("Distributivity and scalar associativity of cross product", "叉积的分配律与数乘结合律"),
      explanation: t(
        "The cross product behaves like ordinary multiplication in many ways, but the order of the factors matters, because swapping them reverses the sign. The cross product distributes over addition:\n\n$$\\mathbf{u} \\times (\\mathbf{v} + \\mathbf{w}) = \\mathbf{u} \\times \\mathbf{v} + \\mathbf{u} \\times \\mathbf{w}$$\n\n$$(\\mathbf{u} + \\mathbf{v}) \\times \\mathbf{w} = \\mathbf{u} \\times \\mathbf{w} + \\mathbf{v} \\times \\mathbf{w}$$\n\nNotice that $(\\mathbf{u} + a\\mathbf{v}) \\times (\\mathbf{u} + b\\mathbf{v}) = (b - a)(\\mathbf{u} \\times \\mathbf{v})$.",
        "叉积在许多方面像普通乘法一样，但因子的顺序很重要，交换它们会改变符号。向量叉积对加法满足分配律：\n\n$$\\mathbf{u} \\times (\\mathbf{v} + \\mathbf{w}) = \\mathbf{u} \\times \\mathbf{v} + \\mathbf{u} \\times \\mathbf{w}$$\n\n$$(\\mathbf{u} + \\mathbf{v}) \\times \\mathbf{w} = \\mathbf{u} \\times \\mathbf{w} + \\mathbf{v} \\times \\mathbf{w}$$\n\n注意 $(\\mathbf{u} + a\\mathbf{v}) \\times (\\mathbf{u} + b\\mathbf{v}) = (b - a)(\\mathbf{u} \\times \\mathbf{v})$。",
      ),
      generate(rng) {
        const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const b = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const c = rng.pick([-3, -2, -1, 1, 2, 3]);
        const d = rng.pick([-3, -2, -1, 1, 2, 3]);

        const det = a * d - b * c;
        const times = (n: number) => (n === 0 ? "\\mathbf{0}" : `${n === 1 ? "" : n === -1 ? "-" : n}(\\mathbf{u} \\times \\mathbf{v})`);
        const right = times(det);
        const w1 = times(a * d + b * c);
        const w2 = times(-det + (det === 0 ? 1 : 0));
        const w3 = times(a * c + b * d);
        const w4 = "\\mathbf{0}";

        const aStr = a === 1 ? "\\mathbf{u}" : a === -1 ? "-\\mathbf{u}" : `${a}\\mathbf{u}`;
        const bStr = b > 0 ? (b === 1 ? "+ \\mathbf{v}" : `+ ${b}\\mathbf{v}`) : b === -1 ? "- \\mathbf{v}" : `- ${-b}\\mathbf{v}`;
        const cStr = c === 1 ? "\\mathbf{u}" : c === -1 ? "-\\mathbf{u}" : `${c}\\mathbf{u}`;
        const dStr = d > 0 ? (d === 1 ? "+ \\mathbf{v}" : `+ ${d}\\mathbf{v}`) : d === -1 ? "- \\mathbf{v}" : `- ${-d}\\mathbf{v}`;

        return oneOf(
          rng,
          t(
            `Simplify the expression $(${aStr} ${bStr}) \\times (${cStr} ${dStr})$ in terms of $\\mathbf{u} \\times \\mathbf{v}$.`,
            `将表达式 $(${aStr} ${bStr}) \\times (${cStr} ${dStr})$ 化简为关于 $\\mathbf{u} \\times \\mathbf{v}$ 的形式。`,
          ),
          t(`$${right}$`, `$${right}$`),
          [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`), t(`$${w4}$`, `$${w4}$`)],
          t(
            `Expand using distributivity:\n\n$$(${aStr} ${bStr}) \\times (${cStr} ${dStr}) = (${a})(${c})(\\mathbf{u}\\times\\mathbf{u}) + (${a})(${d})(\\mathbf{u}\\times\\mathbf{v}) + (${b})(${c})(\\mathbf{v}\\times\\mathbf{u}) + (${b})(${d})(\\mathbf{v}\\times\\mathbf{v})$$\n\nSince $\\mathbf{u}\\times\\mathbf{u} = \\mathbf{v}\\times\\mathbf{v} = \\mathbf{0}$ and $\\mathbf{v}\\times\\mathbf{u} = -(\\mathbf{u}\\times\\mathbf{v})$:\n\n$$= (${a * d} - ${paren(b * c)})(\\mathbf{u} \\times \\mathbf{v}) = ${right}$$`,
            `利用分配律展开：\n\n$$(${aStr} ${bStr}) \\times (${cStr} ${dStr}) = (${a})(${c})(\\mathbf{u}\\times\\mathbf{u}) + (${a})(${d})(\\mathbf{u}\\times\\mathbf{v}) + (${b})(${c})(\\mathbf{v}\\times\\mathbf{u}) + (${b})(${d})(\\mathbf{v}\\times\\mathbf{v})$$\n\n由于 $\\mathbf{u}\\times\\mathbf{u} = \\mathbf{v}\\times\\mathbf{v} = \\mathbf{0}$ 且 $\\mathbf{v}\\times\\mathbf{u} = -(\\mathbf{u}\\times\\mathbf{v})$：\n\n$$= (${a * d} - ${paren(b * c)})(\\mathbf{u} \\times \\mathbf{v}) = ${right}$$`,
          ),
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
  knowledgePoints: [
    {
      id: "determinant-formula-for-cross-product",
      title: t("Determinant formula for cross product", "利用三阶行列式展开计算叉积"),
      explanation: t(
        "Writing the unit vectors in the first row of a determinant is a memory aid: expanding along that row produces each component of the cross product. The cross product of $\\mathbf{u} = \\langle u_1, u_2, u_3 \\rangle$ and $\\mathbf{v} = \\langle v_1, v_2, v_3 \\rangle$ is calculated using the formal determinant:\n\n$$\\mathbf{u} \\times \\mathbf{v} = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ u_1 & u_2 & u_3 \\\\ v_1 & v_2 & v_3 \\end{vmatrix} = \\langle u_2 v_3 - u_3 v_2, \\; -(u_1 v_3 - u_3 v_1), \\; u_1 v_2 - u_2 v_1 \\rangle$$",
        "把单位向量写在行列式的第一行是一种记忆方法：沿这一行展开就得到叉积的各个分量。向量 $\\mathbf{u} = \\langle u_1, u_2, u_3 \\rangle$ 与 $\\mathbf{v} = \\langle v_1, v_2, v_3 \\rangle$ 的叉积可用形式三阶行列式计算：\n\n$$\\mathbf{u} \\times \\mathbf{v} = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ u_1 & u_2 & u_3 \\\\ v_1 & v_2 & v_3 \\end{vmatrix} = \\langle u_2 v_3 - u_3 v_2, \\; -(u_1 v_3 - u_3 v_1), \\; u_1 v_2 - u_2 v_1 \\rangle$$",
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

        return pointProblem({
          prompt: t(
            `Calculate the cross product $\\mathbf{u} \\times \\mathbf{v}$ for $\\mathbf{u} = ${vec3Latex(u)}$ and $\\mathbf{v} = ${vec3Latex(v)}$.`,
            `计算向量 $\\mathbf{u} = ${vec3Latex(u)}$ 与 $\\mathbf{v} = ${vec3Latex(v)}$ 的叉积 $\\mathbf{u} \\times \\mathbf{v}$。`,
          ),
          answer: cp,
          vars: ["x", "y", "z"],
          vector: true,
          wrong: [opp, signErrY, swapErr, offset1, offset2],
          solution: t(
            `Expand along the first row:\n\n$$\\mathbf{u} \\times \\mathbf{v} = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ ${u[0]} & ${u[1]} & ${u[2]} \\\\ ${v[0]} & ${v[1]} & ${v[2]} \\end{vmatrix} = \\langle (${u[1]})(${v[2]}) - (${u[2]})(${v[1]}), \\; -((${u[0]})(${v[2]}) - (${u[2]})(${v[0]})), \\; (${u[0]})(${v[1]}) - (${u[1]})(${v[0]}) \\rangle = ${vec3Latex(cp)}$$`,
            `按第一行展开三阶行列式：\n\n$$\\mathbf{u} \\times \\mathbf{v} = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ ${u[0]} & ${u[1]} & ${u[2]} \\\\ ${v[0]} & ${v[1]} & ${v[2]} \\end{vmatrix} = \\langle (${u[1]})(${v[2]}) - (${u[2]})(${v[1]}), \\; -((${u[0]})(${v[2]}) - (${u[2]})(${v[0]})), \\; (${u[0]})(${v[1]}) - (${u[1]})(${v[0]}) \\rangle = ${vec3Latex(cp)}$$`,
          ),
        });
      },
    },
    {
      id: "finding-a-vector-orthogonal-to-two-vectors",
      title: t("Finding a vector orthogonal to two vectors", "求与已知两向量均正交的向量"),
      figure: remainingDrawings7["calculating-the-cross-product-using-determinants#finding-a-vector-orthogonal-to-two-vectors"],
      explanation: t(
        "A vector orthogonal (perpendicular) to both $\\mathbf{u}$ and $\\mathbf{v}$ can always be obtained by calculating their cross product $\\mathbf{u} \\times \\mathbf{v}$ (or any nonzero scalar multiple of it).",
        "求同时与 $\\mathbf{u}$ 和 $\\mathbf{v}$ 正交（垂直）的向量，可以通过计算它们的叉积 $\\mathbf{u} \\times \\mathbf{v}$（或其任意非零数乘倍数）得到。",
      ),
      generate(rng) {
        const u: Vec3 = [rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-3, -2, -1, 1, 2, 3])];
        const v: Vec3 = [rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-3, -2, -1, 1, 2, 3])];
        const cp = cross3(u, v);
        const target = magSq3(cp) > 0 ? cp : ([1, 0, 0] as Vec3);

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
          t(`$${vec3Latex(target)}$`, `$${vec3Latex(target)}$`),
          [
            t(`$${vec3Latex(w1)}$`, `$${vec3Latex(w1)}$`),
            t(`$${vec3Latex(w2)}$`, `$${vec3Latex(w2)}$`),
            t(`$${vec3Latex(w3)}$`, `$${vec3Latex(w3)}$`),
            t(`$${vec3Latex(w4)}$`, `$${vec3Latex(w4)}$`),
          ],
          t(
            `The cross product $\\mathbf{u} \\times \\mathbf{v} = ${vec3Latex(target)}$ is guaranteed to be perpendicular to both $\\mathbf{u}$ and $\\mathbf{v}$.`,
            `叉积 $\\mathbf{u} \\times \\mathbf{v} = ${vec3Latex(target)}$ 一定同时垂直于 $\\mathbf{u}$ 和 $\\mathbf{v}$。`,
          ),
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
  knowledgePoints: [
    {
      id: "area-of-a-parallelogram-in-3d",
      title: t("Area of a parallelogram in 3D", "三维空间中平行四边形的面积"),
      figure: remainingDrawings7["finding-areas-using-the-cross-product#area-of-a-parallelogram-in-3d"],
      explanation: t(
        "The area of the parallelogram spanned by adjacent vectors $\\mathbf{u}$ and $\\mathbf{v}$ equals the magnitude of their cross product:\n\n$$A = \\|\\mathbf{u} \\times \\mathbf{v}\\|$$",
        "以相邻向量 $\\mathbf{u}$ 与 $\\mathbf{v}$ 为邻边的平行四边形的面积等于两向量叉积的模长：\n\n$$A = \\|\\mathbf{u} \\times \\mathbf{v}\\|$$",
      ),
      generate(rng) {
        const [uVec, vVec, cp, L] = pickIntegerCrossProduct(rng);

        return numberProblem({
          prompt: t(
            `Find the area of the parallelogram spanned by adjacent vectors $\\mathbf{u} = ${vec3Latex(uVec)}$ and $\\mathbf{v} = ${vec3Latex(vVec)}$.`,
            `求由相邻向量 $\\mathbf{u} = ${vec3Latex(uVec)}$ 与 $\\mathbf{v} = ${vec3Latex(vVec)}$ 张成的平行四边形的面积。`,
          ),
          answer: L,
          form: "integer",
          wrong: [L + 1, Math.max(1, L - 1), L + 2, 2 * L],
          solution: t(
            `First compute the cross product $\\mathbf{u} \\times \\mathbf{v} = ${vec3Latex(cp)}$.\n\nThe area is the magnitude:\n\n$$A = \\|\\mathbf{u} \\times \\mathbf{v}\\| = \\sqrt{(${cp[0]})^2 + (${cp[1]})^2 + (${cp[2]})^2} = \\sqrt{${L * L}} = ${L}$$`,
            `首先计算叉积 $\\mathbf{u} \\times \\mathbf{v} = ${vec3Latex(cp)}$。\n\n面积等于其模长：\n\n$$A = \\|\\mathbf{u} \\times \\mathbf{v}\\| = \\sqrt{(${cp[0]})^2 + (${cp[1]})^2 + (${cp[2]})^2} = \\sqrt{${L * L}} = ${L}$$`,
          ),
        });
      },
    },
    {
      id: "area-of-a-triangle-in-3d",
      title: t("Area of a triangle in 3D", "三维空间中三角形的面积"),
      figure: remainingDrawings7["finding-areas-using-the-cross-product#area-of-a-triangle-in-3d"],
      explanation: t(
        "A triangle with vertices $A, B, C$ has area equal to half the area of the parallelogram formed by $\\vec{AB}$ and $\\vec{AC}$:\n\n$$A = \\frac{1}{2}\\|\\vec{AB} \\times \\vec{AC}\\|$$",
        "以 $A, B, C$ 为顶点的三角形的面积等于由 $\\vec{AB}$ 和 $\\vec{AC}$ 构成的平行四边形面积的一半：\n\n$$A = \\frac{1}{2}\\|\\vec{AB} \\times \\vec{AC}\\|$$",
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

        return numberProblem({
          prompt: t(
            `Find the area of the triangle with vertices $A(${A[0]}, ${A[1]}, ${A[2]})$, $B(${B[0]}, ${B[1]}, ${B[2]})$, and $C(${C[0]}, ${C[1]}, ${C[2]})$.`,
            `求空间中顶点为 $A(${A[0]}, ${A[1]}, ${A[2]})$、$B(${B[0]}, ${B[1]}, ${B[2]})$ 与 $C(${C[0]}, ${C[1]}, ${C[2]})$ 的三角形的面积。`,
          ),
          answer: areaQ,
          wrong: [L, Q.of(L, 4), Q.of(L + 2, 2)],
          solution: t(
            `Form vectors $\\vec{AB} = ${vec3Latex(u)}$ and $\\vec{AC} = ${vec3Latex(v)}$.\n\nCompute the cross product:\n\n$$\\vec{AB} \\times \\vec{AC} = ${vec3Latex(cp)}$$\n\nThe area is:\n\n$$A = \\frac{1}{2}\\|\\vec{AB} \\times \\vec{AC}\\| = \\frac{1}{2}(${L}) = ${areaQ.toLatex()}$$`,
            `求向量 $\\vec{AB} = ${vec3Latex(u)}$ 及 $\\vec{AC} = ${vec3Latex(v)}$。\n\n计算叉积：\n\n$$\\vec{AB} \\times \\vec{AC} = ${vec3Latex(cp)}$$\n\n三角形面积为：\n\n$$A = \\frac{1}{2}\\|\\vec{AB} \\times \\vec{AC}\\| = \\frac{1}{2}(${L}) = ${areaQ.toLatex()}$$`,
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
  knowledgePoints: [
    {
      id: "evaluating-the-scalar-triple-product",
      title: t("Evaluating the scalar triple product", "计算标量三重积"),
      explanation: t(
        "The scalar triple product is a single number, and it equals the determinant of the matrix whose rows are the three vectors. The scalar triple product of three vectors $\\mathbf{u}, \\mathbf{v}, \\mathbf{w}$ is defined as $\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})$ and equals the $3\\times 3$ determinant:\n\n$$\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w}) = \\begin{vmatrix} u_1 & u_2 & u_3 \\\\ v_1 & v_2 & v_3 \\\\ w_1 & w_2 & w_3 \\end{vmatrix}$$",
        "标量三重积是一个数，它等于以三个向量为行的矩阵的行列式。三向量 $\\mathbf{u}, \\mathbf{v}, \\mathbf{w}$ 的标量三重积（混合积）定义为 $\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})$，其值等于相应的三阶行列式：\n\n$$\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w}) = \\begin{vmatrix} u_1 & u_2 & u_3 \\\\ v_1 & v_2 & v_3 \\\\ w_1 & w_2 & w_3 \\end{vmatrix}$$",
      ),
      generate(rng) {
        const u: Vec3 = [rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-3, -2, -1, 1, 2, 3])];
        const v: Vec3 = [rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-3, -2, -1, 1, 2, 3])];
        const w: Vec3 = [rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-3, -2, -1, 1, 2, 3])];

        const ans = det3(u, v, w);

        return numberProblem({
          prompt: t(
            `Compute the scalar triple product $\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})$ for $\\mathbf{u} = ${vec3Latex(u)}$, $\\mathbf{v} = ${vec3Latex(v)}$, and $\\mathbf{w} = ${vec3Latex(w)}$.`,
            `计算向量 $\\mathbf{u} = ${vec3Latex(u)}$、$\\mathbf{v} = ${vec3Latex(v)}$ 与 $\\mathbf{w} = ${vec3Latex(w)}$ 的混合积 $\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})$。`,
          ),
          answer: ans,
          form: "integer",
          wrong: [-ans, ans + 6, ans - 5, ans + 2],
          solution: t(
            `$$\\begin{vmatrix} ${u[0]} & ${u[1]} & ${u[2]} \\\\ ${v[0]} & ${v[1]} & ${v[2]} \\\\ ${w[0]} & ${w[1]} & ${w[2]} \\end{vmatrix} = ${u[0]}(${v[1] * w[2] - v[2] * w[1]}) - (${u[1]})(${v[0] * w[2] - v[2] * w[0]}) + (${u[2]})(${v[0] * w[1] - v[1] * w[0]}) = ${ans}$$`,
            `$$\\begin{vmatrix} ${u[0]} & ${u[1]} & ${u[2]} \\\\ ${v[0]} & ${v[1]} & ${v[2]} \\\\ ${w[0]} & ${w[1]} & ${w[2]} \\end{vmatrix} = ${u[0]}(${v[1] * w[2] - v[2] * w[1]}) - (${u[1]})(${v[0] * w[2] - v[2] * w[0]}) + (${u[2]})(${v[0] * w[1] - v[1] * w[0]}) = ${ans}$$`,
          ),
        });
      },
    },
    {
      id: "coplanarity-condition-for-three-vectors",
      title: t("Coplanarity condition for three vectors", "利用混合积判定三向量共面"),
      explanation: t(
        "Three vectors in $\\mathbb{R}^3$ are coplanar (lie in the same plane) if and only if their scalar triple product is zero:\n\n$$\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w}) = 0$$",
        "三维空间中的三个向量共面（处于同一平面内）当且仅当它们的混合积等于零：\n\n$$\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w}) = 0$$",
      ),
      generate(rng) {
        const u: Vec3 = [rng.pick([1, 2, 3]), rng.pick([-2, -1, 1, 2]), rng.pick([-2, -1, 1, 2])];
        const v: Vec3 = [rng.pick([-2, -1, 1, 2]), rng.pick([1, 2, 3]), rng.pick([-2, -1, 1, 2])];

        if (rng.bool()) {
          const prompt = t(
            `Which of the following conditions is necessary and sufficient for three nonzero vectors $\\mathbf{u}, \\mathbf{v}, \\mathbf{w}$ in $\\mathbb{R}^3$ to be coplanar?`,
            `下列哪个条件是三维空间中三个非零向量 $\\mathbf{u}, \\mathbf{v}, \\mathbf{w}$ 共面的充要条件？`,
          );
          return oneOf(
            rng,
            prompt,
            t("$\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w}) = 0$", "$\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w}) = 0$"),
            [
              t(
                "$\\mathbf{u} \\times (\\mathbf{v} \\times \\mathbf{w}) = \\mathbf{0}$",
                "$\\mathbf{u} \\times (\\mathbf{v} \\times \\mathbf{w}) = \\mathbf{0}$",
              ),
              t(
                "$\\mathbf{u} \\cdot \\mathbf{v} = \\mathbf{v} \\cdot \\mathbf{w}$",
                "$\\mathbf{u} \\cdot \\mathbf{v} = \\mathbf{v} \\cdot \\mathbf{w}$",
              ),
              t("$\\mathbf{u} + \\mathbf{v} + \\mathbf{w} = \\mathbf{0}$", "$\\mathbf{u} + \\mathbf{v} + \\mathbf{w} = \\mathbf{0}$"),
            ],
            t(
              "Three vectors are coplanar if and only if the volume of the parallelepiped they span is zero, which means $\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w}) = 0$.",
              "三个向量共面当且仅当它们张成的平行六面体体积为零，即标量三重积 $\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w}) = 0$。",
            ),
          );
        }

        const a = rng.pick([-2, -1, 1, 2]);
        const b = rng.pick([-2, -1, 1, 2]);
        const wCop: Vec3 = add3(smul3(a, u), smul3(b, v));
        const ansK = wCop[2];
        const wPrompt = `\\langle ${wCop[0]}, ${wCop[1]}, k \\rangle`;

        return numberProblem({
          prompt: t(
            `Find the value of $k$ such that the vectors $\\mathbf{u} = ${vec3Latex(u)}$, $\\mathbf{v} = ${vec3Latex(v)}$, and $\\mathbf{w} = ${wPrompt}$ are coplanar.`,
            `求实数 $k$ 的值，使得向量 $\\mathbf{u} = ${vec3Latex(u)}$、$\\mathbf{v} = ${vec3Latex(v)}$ 与 $\\mathbf{w} = ${wPrompt}$ 共面。`,
          ),
          answer: ansK,
          solveFor: "k",
          form: "integer",
          wrong: [-ansK, ansK + 1, ansK - 2, ansK + 3],
          solution: t(
            `Three vectors are coplanar if and only if their determinant is zero:\n\n$$\\begin{vmatrix} ${u[0]} & ${u[1]} & ${u[2]} \\\\ ${v[0]} & ${v[1]} & ${v[2]} \\\\ ${wCop[0]} & ${wCop[1]} & k \\end{vmatrix} = 0 \\implies k = ${ansK}$$`,
            `三个向量共面当且仅当它们构成的行列式为零：\n\n$$\\begin{vmatrix} ${u[0]} & ${u[1]} & ${u[2]} \\\\ ${v[0]} & ${v[1]} & ${v[2]} \\\\ ${wCop[0]} & ${wCop[1]} & k \\end{vmatrix} = 0 \\implies k = ${ansK}$$`,
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
  knowledgePoints: [
    {
      id: "volume-of-a-parallelepiped-from-coterminous-vectors",
      title: t("Volume of a parallelepiped from coterminous vectors", "共起点向量构成的平行六面体体积"),
      figure: remainingDrawings7["volumes-of-parallelepipeds#volume-of-a-parallelepiped-from-coterminous-vectors"],
      explanation: t(
        "The volume of a parallelepiped determined by three coterminous vectors $\\mathbf{u}, \\mathbf{v}, \\mathbf{w}$ is the absolute value of their scalar triple product:\n\n$$V = |\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})| = \\left| \\det[\\mathbf{u}, \\mathbf{v}, \\mathbf{w}] \\right|$$",
        "由三个共起点向量 $\\mathbf{u}, \\mathbf{v}, \\mathbf{w}$ 确定的平行六面体的体积等于它们混合积的绝对值：\n\n$$V = |\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})| = \\left| \\det[\\mathbf{u}, \\mathbf{v}, \\mathbf{w}] \\right|$$",
      ),
      generate(rng) {
        const u: Vec3 = [rng.pick([1, 2, 3]), rng.pick([-2, -1, 0, 1, 2]), rng.pick([-2, -1, 0, 1, 2])];
        const v: Vec3 = [0, rng.pick([1, 2, 3]), rng.pick([-2, -1, 0, 1, 2])];
        const w: Vec3 = [0, 0, rng.pick([2, 3, 4, 5])];
        const d = det3(u, v, w);
        const V = Math.abs(d);

        return numberProblem({
          prompt: t(
            `Find the volume of the parallelepiped determined by the vectors $\\mathbf{u} = ${vec3Latex(u)}$, $\\mathbf{v} = ${vec3Latex(v)}$, and $\\mathbf{w} = ${vec3Latex(w)}$.`,
            `求由向量 $\\mathbf{u} = ${vec3Latex(u)}$、$\\mathbf{v} = ${vec3Latex(v)}$ 与 $\\mathbf{w} = ${vec3Latex(w)}$ 确定的平行六面体的体积。`,
          ),
          answer: V,
          form: "integer",
          wrong: [V * 2, Math.max(1, V - 3), V + 4, Math.round(V / 2)],
          solution: t(
            `The volume is the absolute value of the scalar triple product:\n\n$$V = |\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})| = \\left| \\begin{vmatrix} ${u[0]} & ${u[1]} & ${u[2]} \\\\ ${v[0]} & ${v[1]} & ${v[2]} \\\\ ${w[0]} & ${w[1]} & ${w[2]} \\end{vmatrix} \\right| = |${d}| = ${V}$$`,
            `体积等于混合积的绝对值：\n\n$$V = |\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})| = \\left| \\begin{vmatrix} ${u[0]} & ${u[1]} & ${u[2]} \\\\ ${v[0]} & ${v[1]} & ${v[2]} \\\\ ${w[0]} & ${w[1]} & ${w[2]} \\end{vmatrix} \\right| = |${d}| = ${V}$$`,
          ),
        });
      },
    },
    {
      id: "volume-of-a-parallelepiped-from-vertices",
      title: t("Volume of a parallelepiped from vertices", "由顶点坐标计算平行六面体体积"),
      figure: remainingDrawings7["volumes-of-parallelepipeds#volume-of-a-parallelepiped-from-vertices"],
      explanation: t(
        "Subtract the coordinates of the shared vertex from the other three to get the edge vectors, then take the absolute value of their triple product. If a parallelepiped has a vertex $A$ with three adjacent vertices $B, C, D$, its volume is:\n\n$$V = |\\vec{AB} \\cdot (\\vec{AC} \\times \\vec{AD})|$$",
        "用另外三个顶点的坐标减去公共顶点的坐标得到棱向量，再取它们三重积的绝对值。若平行六面体的一个顶点为 $A$，且与之相邻的三个顶点为 $B, C, D$，则其体积为：\n\n$$V = |\\vec{AB} \\cdot (\\vec{AC} \\times \\vec{AD})|$$",
      ),
      generate(rng) {
        const A: Vec3 = [rng.pick([-2, -1, 0, 1, 2]), rng.pick([-2, -1, 0, 1, 2]), rng.pick([-2, -1, 0, 1, 2])];
        const u: Vec3 = [rng.pick([2, 3, 4]), 0, 0];
        const v: Vec3 = [1, rng.pick([2, 3]), 0];
        const w: Vec3 = [0, 1, rng.pick([2, 3, 4])];

        const B = add3(A, u);
        const C = add3(A, v);
        const D = add3(A, w);

        const V = Math.abs(det3(u, v, w));

        return numberProblem({
          prompt: t(
            `Find the volume of the parallelepiped with vertex $A(${A[0]}, ${A[1]}, ${A[2]})$ and adjacent vertices $B(${B[0]}, ${B[1]}, ${B[2]})$, $C(${C[0]}, ${C[1]}, ${C[2]})$, and $D(${D[0]}, ${D[1]}, ${D[2]})$.`,
            `求以 $A(${A[0]}, ${A[1]}, ${A[2]})$ 为顶点，且与之相邻的三个顶点为 $B(${B[0]}, ${B[1]}, ${B[2]})$、$C(${C[0]}, ${C[1]}, ${C[2]})$ 与 $D(${D[0]}, ${D[1]}, ${D[2]})$ 的平行六面体的体积。`,
          ),
          answer: V,
          form: "integer",
          wrong: [V * 2, Math.max(1, V - 2), V + 3, Math.round(V / 3)],
          solution: t(
            `Form edge vectors $\\vec{AB} = ${vec3Latex(u)}$, $\\vec{AC} = ${vec3Latex(v)}$, $\\vec{AD} = ${vec3Latex(w)}$.\n\nThen evaluate the determinant:\n\n$$V = |\\vec{AB} \\cdot (\\vec{AC} \\times \\vec{AD})| = ${V}$$`,
            `求棱向量 $\\vec{AB} = ${vec3Latex(u)}$、$\\vec{AC} = ${vec3Latex(v)}$ 与 $\\vec{AD} = ${vec3Latex(w)}$。\n\n计算行列式绝对值：\n\n$$V = |\\vec{AB} \\cdot (\\vec{AC} \\times \\vec{AD})| = ${V}$$`,
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
  knowledgePoints: [
    {
      id: "volume-of-a-tetrahedron",
      title: t("Volume of a tetrahedron", "四面体的体积"),
      figure: remainingDrawings7["finding-volumes-of-tetrahedrons-and-pyramids-using-vector-products#volume-of-a-tetrahedron"],
      explanation: t(
        "A tetrahedron (triangular pyramid) spanned by three vectors $\\mathbf{u}, \\mathbf{v}, \\mathbf{w}$ has volume equal to $\\frac{1}{6}$ of the volume of the corresponding parallelepiped:\n\n$$V = \\frac{1}{6}|\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})| = \\frac{1}{6}\\left| \\det[\\mathbf{u}, \\mathbf{v}, \\mathbf{w}] \\right|$$",
        "由三个向量 $\\mathbf{u}, \\mathbf{v}, \\mathbf{w}$ 确定的四面体（三棱锥）的体积等于相应平行六面体体积的 $\\frac{1}{6}$：\n\n$$V = \\frac{1}{6}|\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})| = \\frac{1}{6}\\left| \\det[\\mathbf{u}, \\mathbf{v}, \\mathbf{w}] \\right|$$",
      ),
      generate(rng) {
        const k = rng.pick([1, 2, 3, 4, 5, 6]);
        const u: Vec3 = [rng.pick([1, 2, 3]), 0, 0];
        const v: Vec3 = [0, rng.pick([1, 2, 3]), 0];
        const base = u[0] * v[1];
        const wZ = (base % 6 === 0 ? 1 : base % 3 === 0 ? 2 : base % 2 === 0 ? 3 : 6) * k;
        const w: Vec3 = [rng.pick([0, 1]), rng.pick([0, 1]), wZ];

        const detVal = Math.round(Math.abs(det3(u, v, w)));
        const V = Math.round(detVal / 6);

        return numberProblem({
          prompt: t(
            `Find the volume of the tetrahedron determined by the edge vectors $\\mathbf{u} = ${vec3Latex(u)}$, $\\mathbf{v} = ${vec3Latex(v)}$, and $\\mathbf{w} = ${vec3Latex(w)}$.`,
            `求由棱向量 $\\mathbf{u} = ${vec3Latex(u)}$、$\\mathbf{v} = ${vec3Latex(v)}$ 与 $\\mathbf{w} = ${vec3Latex(w)}$ 确定的四面体的体积。`,
          ),
          answer: V,
          form: "integer",
          wrong: [detVal, Math.round(detVal / 3), Math.round(detVal / 2), V + 2],
          solution: t(
            `The volume of a tetrahedron is $\\frac{1}{6}$ of the scalar triple product:\n\n$$V = \\frac{1}{6}|\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})| = \\frac{1}{6}(${detVal}) = ${V}$$`,
            `四面体的体积为标量三重积绝对值的 $\\frac{1}{6}$：\n\n$$V = \\frac{1}{6}|\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})| = \\frac{1}{6}(${detVal}) = ${V}$$`,
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
        "A pyramid whose base is a parallelogram spanned by $\\mathbf{u}$ and $\\mathbf{v}$, and whose apex is located by vector $\\mathbf{w}$ from the same corner, has volume:\n\n$$V = \\frac{1}{3}\\times \\text{Base Area} \\times \\text{Height} = \\frac{1}{3}|\\mathbf{w} \\cdot (\\mathbf{u} \\times \\mathbf{v})|$$",
        "底面为由 $\\mathbf{u}$ 与 $\\mathbf{v}$ 张成的平行四边形，且从同一起点指向顶点的向量为 $\\mathbf{w}$ 的四棱锥，其体积为：\n\n$$V = \\frac{1}{3}\\times \\text{底面积} \\times \\text{高} = \\frac{1}{3}|\\mathbf{w} \\cdot (\\mathbf{u} \\times \\mathbf{v})|$$",
      ),
      generate(rng) {
        const k = rng.pick([1, 2, 3, 4, 5, 6, 7]);
        const u: Vec3 = [rng.pick([1, 2, 3]), 0, 0];
        const v: Vec3 = [0, rng.pick([1, 2, 3]), 0];
        const wZ = ((u[0] * v[1]) % 3 === 0 ? 1 : 3) * k;
        const w: Vec3 = [rng.pick([0, 1]), rng.pick([0, 1]), wZ];

        const detVal = Math.round(Math.abs(det3(u, v, w)));
        const V = Math.round(detVal / 3);

        return numberProblem({
          prompt: t(
            `Find the volume of a pyramid whose base is a parallelogram spanned by $\\mathbf{u} = ${vec3Latex(u)}$ and $\\mathbf{v} = ${vec3Latex(v)}$, and whose apex is defined by vector $\\mathbf{w} = ${vec3Latex(w)}$ from the same origin.`,
            `一个四棱锥的底面是由 $\\mathbf{u} = ${vec3Latex(u)}$ 与 $\\mathbf{v} = ${vec3Latex(v)}$ 张成的平行四边形，从同一起点指向顶点的向量为 $\\mathbf{w} = ${vec3Latex(w)}$。求该棱锥的体积。`,
          ),
          answer: V,
          form: "integer",
          wrong: [detVal, Math.round(detVal / 6), V + 2, Math.max(1, V - 2)],
          solution: t(
            `The volume of a pyramid with a parallelogram base is $\\frac{1}{3}$ of the parallelepiped volume:\n\n$$V = \\frac{1}{3}|\\mathbf{w} \\cdot (\\mathbf{u} \\times \\mathbf{v})| = \\frac{1}{3}(${detVal}) = ${V}$$`,
            `底面为平行四边形的棱锥体积是相应平行六面体体积的 $\\frac{1}{3}$：\n\n$$V = \\frac{1}{3}|\\mathbf{w} \\cdot (\\mathbf{u} \\times \\mathbf{v})| = \\frac{1}{3}(${detVal}) = ${V}$$`,
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
