import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q, radical, simplifyRadical } from "@ga/subject-math";

import { choiceProblem } from "../problems.ts";

// Precalculus unit 5: Vectors (Part 2: 3D Vectors, Dot Product, and Cross Product,
// modules 5.18 to 5.20).

type Vec3 = readonly [number, number, number];
type Vec2 = readonly [number, number];

const add3 = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub3 = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const smul3 = (k: number, a: Vec3): Vec3 => [k * a[0], k * a[1], k * a[2]];
const dot3 = (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross3 = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot2 = (a: Vec2, b: Vec2): number => a[0] * b[0] + a[1] * b[1];
const det3 = (a: Vec3, b: Vec3, c: Vec3): number => dot3(a, cross3(b, c));
const magSq3 = (a: Vec3): number => a[0] * a[0] + a[1] * a[1] + a[2] * a[2];

function vec3Latex(v: Vec3): string {
  return `\\langle ${v[0]}, ${v[1]}, ${v[2]} \\rangle`;
}

function vec2Latex(v: Vec2): string {
  return `\\langle ${v[0]}, ${v[1]} \\rangle`;
}

function qVec3Latex(v: readonly [Q, Q, Q]): string {
  return `\\left\\langle ${v[0].toLatex()}, ${v[1].toLatex()}, ${v[2].toLatex()} \\right\\rangle`;
}

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

function sqrtLatex(n: number): string {
  if (n <= 0) return "0";
  const [k, m] = simplifyRadical(n);
  return radical(k, m);
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

function pickQuadruple(rng: Rng): [Vec3, number] {
  const quad = rng.pick(pythagoreanQuadruples);
  const [a, b, c, L] = quad;
  const perm = rng.shuffle([a, b, c]) as [number, number, number];
  const sx = rng.pick([1, -1]);
  const sy = rng.pick([1, -1]);
  const sz = rng.pick([1, -1]);
  return [[perm[0] * sx, perm[1] * sy, perm[2] * sz], L];
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
  encompasses: [{ topic: "two-dimensional-vectors-expressed-in-component-form", weight: 0.4 }],
  xp: 14,
  standards: ["CCSS.HSN.VM.A.1", "CCSS.HSN.VM.A.2"],
  knowledgePoints: [
    {
      id: "components-and-standard-basis-in-3d",
      title: t("Components and standard basis in 3D", "三维向量的坐标与标准基底表示"),
      explanation: t(
        "In 3D Cartesian coordinates, a vector can be written in component form as $\\mathbf{v} = \\langle v_1, v_2, v_3 \\rangle$, or as a linear combination of the standard unit basis vectors $\\mathbf{i} = \\langle 1, 0, 0 \\rangle$, $\\mathbf{j} = \\langle 0, 1, 0 \\rangle$, and $\\mathbf{k} = \\langle 0, 0, 1 \\rangle$:\n\n$$\\mathbf{v} = v_1\\mathbf{i} + v_2\\mathbf{j} + v_3\\mathbf{k}$$",
        "在三维空间直角坐标系中，向量可以表示为坐标分量形式 $\\mathbf{v} = \\langle v_1, v_2, v_3 \\rangle$，也可以表示为标准单位基向量 $\\mathbf{i} = \\langle 1, 0, 0 \\rangle$、$\\mathbf{j} = \\langle 0, 1, 0 \\rangle$ 与 $\\mathbf{k} = \\langle 0, 0, 1 \\rangle$ 的线性组合：\n\n$$\\mathbf{v} = v_1\\mathbf{i} + v_2\\mathbf{j} + v_3\\mathbf{k}$$",
      ),
      generate(rng) {
        const x = rng.pick([-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7]);
        const y = rng.pick([-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]);
        const z = rng.pick([-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7]);
        const v: Vec3 = [x, y, z];
        const vStr = vec3Latex(v);
        const bStr = basisLatex(v);

        if (rng.bool()) {
          const w1 = basisLatex([x, -y, z]);
          const w2 = basisLatex([x, z, y]);
          const w3 = basisLatex([-x, y, -z]);
          const w4 = basisLatex([z, y, x]);
          return oneOf(
            rng,
            t(
              `Express the vector $\\mathbf{v} = ${vStr}$ in terms of the standard unit basis vectors $\\mathbf{i}$, $\\mathbf{j}$, and $\\mathbf{k}$.`,
              `用标准单位基向量 $\\mathbf{i}$、$\\mathbf{j}$、$\\mathbf{k}$ 表示向量 $\\mathbf{v} = ${vStr}$。`,
            ),
            t(`$${bStr}$`, `$${bStr}$`),
            [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`), t(`$${w4}$`, `$${w4}$`)],
            t(
              `Using the definition $\\langle v_1, v_2, v_3 \\rangle = v_1\\mathbf{i} + v_2\\mathbf{j} + v_3\\mathbf{k}$, we obtain $${bStr}$.`,
              `由定义 $\\langle v_1, v_2, v_3 \\rangle = v_1\\mathbf{i} + v_2\\mathbf{j} + v_3\\mathbf{k}$，可得 $${bStr}$。`,
            ),
          );
        }

        const w1 = vec3Latex([x, -y, z]);
        const w2 = vec3Latex([x, z, y]);
        const w3 = vec3Latex([-x, y, -z]);
        const w4 = vec3Latex([z, y, x]);
        return oneOf(
          rng,
          t(
            `Write the vector $\\mathbf{v} = ${bStr}$ in component form $\\langle x, y, z \\rangle$.`,
            `将向量 $\\mathbf{v} = ${bStr}$ 写成坐标分量形式 $\\langle x, y, z \\rangle$。`,
          ),
          t(`$${vStr}$`, `$${vStr}$`),
          [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`), t(`$${w4}$`, `$${w4}$`)],
          t(
            `The coefficients of $\\mathbf{i}$, $\\mathbf{j}$, and $\\mathbf{k}$ correspond directly to the components, giving $${vStr}$.`,
            `$\\mathbf{i}$、$\\mathbf{j}$、$\\mathbf{k}$ 的系数直接对应各个坐标分量，得到 $${vStr}$。`,
          ),
        );
      },
    },
    {
      id: "displacement-vector-between-two-points-in-3d",
      title: t("Displacement vector between two points in 3D", "空间中两点间的位移向量"),
      explanation: t(
        "Given initial point $A(x_1, y_1, z_1)$ and terminal point $B(x_2, y_2, z_2)$ in three dimensions, the displacement vector from $A$ to $B$ is:\n\n$$\\vec{AB} = \\langle x_2 - x_1, \\; y_2 - y_1, \\; z_2 - z_1 \\rangle$$",
        "已知三维空间中起点 $A(x_1, y_1, z_1)$ 与终点 $B(x_2, y_2, z_2)$，从 $A$ 到 $B$ 的位移向量为：\n\n$$\\vec{AB} = \\langle x_2 - x_1, \\; y_2 - y_1, \\; z_2 - z_1 \\rangle$$",
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

        const right = vec3Latex([dx, dy, dz]);
        const w1 = vec3Latex([-dx, -dy, -dz]);
        const w2 = vec3Latex([x1 + x2, y1 + y2, z1 + z2]);
        const w3 = vec3Latex([dx, -dy, dz]);
        const w4 = vec3Latex([dx, dy, -dz]);

        return oneOf(
          rng,
          t(
            `Find the component form of the displacement vector $\\vec{AB}$ from initial point $A(${x1}, ${y1}, ${z1})$ to terminal point $B(${x2}, ${y2}, ${z2})$.`,
            `求从起点 $A(${x1}, ${y1}, ${z1})$ 到终点 $B(${x2}, ${y2}, ${z2})$ 的位移向量 $\\vec{AB}$ 的坐标表示。`,
          ),
          t(`$${right}$`, `$${right}$`),
          [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`), t(`$${w4}$`, `$${w4}$`)],
          t(
            `Subtract the coordinates of initial point $A$ from terminal point $B$:\n\n$$\\vec{AB} = \\langle ${x2} - (${x1}), \\; ${y2} - (${y1}), \\; ${z2} - (${z1}) \\rangle = ${right}$$`,
            `用终点 $B$ 的坐标减去起点 $A$ 的坐标：\n\n$$\\vec{AB} = \\langle ${x2} - (${x1}), \\; ${y2} - (${y1}), \\; ${z2} - (${z1}) \\rangle = ${right}$$`,
          ),
        );
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
  encompasses: [{ topic: "three-dimensional-vectors-in-component-form", weight: 0.5 }],
  xp: 14,
  standards: ["CCSS.HSN.VM.B.4", "CCSS.HSN.VM.B.5"],
  knowledgePoints: [
    {
      id: "addition-and-subtraction-of-3d-vectors",
      title: t("Addition and subtraction of 3D vectors", "三维空间向量的加法与减法"),
      explanation: t(
        "Vector addition and subtraction are performed component-wise in three dimensions:\n\n$$\\langle u_1, u_2, u_3 \\rangle \\pm \\langle v_1, v_2, v_3 \\rangle = \\langle u_1 \\pm v_1, \\; u_2 \\pm v_2, \\; u_3 \\pm v_3 \\rangle$$",
        "在三维空间中，向量的加法与减法按对应坐标分量分别进行：\n\n$$\\langle u_1, u_2, u_3 \\rangle \\pm \\langle v_1, v_2, v_3 \\rangle = \\langle u_1 \\pm v_1, \\; u_2 \\pm v_2, \\; u_3 \\pm v_3 \\rangle$$",
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
        const revSub = isAdd ? sub3(v, u) : sub3(v, u);
        const signErr: Vec3 = [res[0], -res[1], res[2]];

        const opSymbol = isAdd ? "+" : "-";
        const prompt = t(
          `Given $\\mathbf{u} = ${vec3Latex(u)}$ and $\\mathbf{v} = ${vec3Latex(v)}$, find $\\mathbf{u} ${opSymbol} \\mathbf{v}$.`,
          `已知 $\\mathbf{u} = ${vec3Latex(u)}$ 且 $\\mathbf{v} = ${vec3Latex(v)}$，求 $\\mathbf{u} ${opSymbol} \\mathbf{v}$。`,
        );

        return oneOf(
          rng,
          prompt,
          t(`$${vec3Latex(res)}$`, `$${vec3Latex(res)}$`),
          [
            t(`$${vec3Latex(opp)}$`, `$${vec3Latex(opp)}$`),
            t(`$${vec3Latex(revSub)}$`, `$${vec3Latex(revSub)}$`),
            t(`$${vec3Latex(signErr)}$`, `$${vec3Latex(signErr)}$`),
          ],
          t(
            `Combine corresponding components:\n\n$$\\mathbf{u} ${opSymbol} \\mathbf{v} = \\langle ${u[0]} ${opSymbol} (${v[0]}), \\; ${u[1]} ${opSymbol} (${v[1]}), \\; ${u[2]} ${opSymbol} (${v[2]}) \\rangle = ${vec3Latex(res)}$$`,
            `对应分量分别运算：\n\n$$\\mathbf{u} ${opSymbol} \\mathbf{v} = \\langle ${u[0]} ${opSymbol} (${v[0]}), \\; ${u[1]} ${opSymbol} (${v[1]}), \\; ${u[2]} ${opSymbol} (${v[2]}) \\rangle = ${vec3Latex(res)}$$`,
          ),
        );
      },
    },
    {
      id: "scalar-multiplication-and-linear-combinations-in-3d",
      title: t("Scalar multiplication and linear combinations in 3D", "三维空间向量的数乘与线性组合"),
      explanation: t(
        "Multiplying a 3D vector by a scalar $c$ scales each component:\n\n$$c\\langle x, y, z \\rangle = \\langle cx, cy, cz \\rangle$$\n\nA linear combination $a\\mathbf{u} + b\\mathbf{v}$ combines scalar multiplication and addition.",
        "用标量 $c$ 乘以三维向量会将每个坐标分量均乘以 $c$：\n\n$$c\\langle x, y, z \\rangle = \\langle cx, cy, cz \\rangle$$\n\n线性组合 $a\\mathbf{u} + b\\mathbf{v}$ 是数乘与加法的综合运算。",
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

        const bTerm = b > 0 ? `+ ${b}\\mathbf{v}` : `- ${-b}\\mathbf{v}`;
        const prompt = t(
          `Given $\\mathbf{u} = ${vec3Latex(u)}$ and $\\mathbf{v} = ${vec3Latex(v)}$, find $${a}\\mathbf{u} ${bTerm}$.`,
          `已知 $\\mathbf{u} = ${vec3Latex(u)}$ 且 $\\mathbf{v} = ${vec3Latex(v)}$，求 $${a}\\mathbf{u} ${bTerm}$。`,
        );

        return oneOf(
          rng,
          prompt,
          t(`$${vec3Latex(right)}$`, `$${vec3Latex(right)}$`),
          [
            t(`$${vec3Latex(w1)}$`, `$${vec3Latex(w1)}$`),
            t(`$${vec3Latex(w2)}$`, `$${vec3Latex(w2)}$`),
            t(`$${vec3Latex(w3)}$`, `$${vec3Latex(w3)}$`),
            t(`$${vec3Latex(w4)}$`, `$${vec3Latex(w4)}$`),
          ],
          t(
            `First scale each vector:\n\n$$${a}\\mathbf{u} = ${vec3Latex(au)}, \\quad ${b}\\mathbf{v} = ${vec3Latex(bv)}$$\n\nThen add the components together to get $${vec3Latex(right)}$.`,
            `先分别进行数乘：\n\n$$${a}\\mathbf{u} = ${vec3Latex(au)}, \\quad ${b}\\mathbf{v} = ${vec3Latex(bv)}$$\n\n再将对应分量相加，得 $${vec3Latex(right)}$。`,
          ),
        );
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
  encompasses: [{ topic: "addition-and-scalar-multiplication-of-cartesian-vectors-in-3d", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSN.VM.A.1", "CCSS.HSN.VM.B.5.b"],
  knowledgePoints: [
    {
      id: "magnitude-of-a-3d-vector",
      title: t("Magnitude of a 3D vector", "三维向量的模长"),
      explanation: t(
        "By extending the Pythagorean theorem to three dimensions, the magnitude (or length) of $\\mathbf{v} = \\langle x, y, z \\rangle$ is:\n\n$$\\|\\mathbf{v}\\| = \\sqrt{x^2 + y^2 + z^2}$$",
        "将勾股定理推广至三维空间，向量 $\\mathbf{v} = \\langle x, y, z \\rangle$ 的模长（长度）为：\n\n$$\\|\\mathbf{v}\\| = \\sqrt{x^2 + y^2 + z^2}$$",
      ),
      generate(rng) {
        if (rng.bool()) {
          const [v, L] = pickQuadruple(rng);
          const right = `${L}`;
          const w1 = `${L + 1}`;
          const w2 = `${Math.max(1, L - 1)}`;
          const w3 = `${L + 2}`;
          const w4 = `\\sqrt{${L * L + 2}}`;
          return oneOf(
            rng,
            t(
              `Calculate the magnitude of the vector $\\mathbf{v} = ${vec3Latex(v)}$.`,
              `计算向量 $\\mathbf{v} = ${vec3Latex(v)}$ 的模长。`,
            ),
            t(`$${right}$`, `$${right}$`),
            [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`), t(`$${w4}$`, `$${w4}$`)],
            t(
              `$$\\|\\mathbf{v}\\| = \\sqrt{(${v[0]})^2 + (${v[1]})^2 + (${v[2]})^2} = \\sqrt{${v[0] * v[0] + v[1] * v[1] + v[2] * v[2]}} = ${L}$$`,
              `$$\\|\\mathbf{v}\\| = \\sqrt{(${v[0]})^2 + (${v[1]})^2 + (${v[2]})^2} = \\sqrt{${v[0] * v[0] + v[1] * v[1] + v[2] * v[2]}} = ${L}$$`,
            ),
          );
        }

        const x = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const y = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const z = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const v: Vec3 = [x, y, z];
        const sumSq = x * x + y * y + z * z;
        const ans = sqrtLatex(sumSq);
        const w1 = sqrtLatex(sumSq + 2);
        const w2 = sqrtLatex(Math.max(1, sumSq - 3));
        const w3 = `${sumSq}`;
        const w4 = sqrtLatex(x * x + y * y);

        return oneOf(
          rng,
          t(
            `Find the magnitude $\\|\\mathbf{v}\\|$ of the vector $\\mathbf{v} = ${vec3Latex(v)}$.`,
            `求向量 $\\mathbf{v} = ${vec3Latex(v)}$ 的模长 $\\|\\mathbf{v}\\|$。`,
          ),
          t(`$${ans}$`, `$${ans}$`),
          [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`), t(`$${w4}$`, `$${w4}$`)],
          t(
            `$$\\|\\mathbf{v}\\| = \\sqrt{(${x})^2 + (${y})^2 + (${z})^2} = \\sqrt{${sumSq}} = ${ans}$$`,
            `$$\\|\\mathbf{v}\\| = \\sqrt{(${x})^2 + (${y})^2 + (${z})^2} = \\sqrt{${sumSq}} = ${ans}$$`,
          ),
        );
      },
    },
    {
      id: "normalization-and-3d-unit-vectors",
      title: t("Normalization and 3D unit vectors", "单位向量化与三维单位向量"),
      explanation: t(
        "A unit vector has magnitude $1$. To normalize a nonzero vector $\\mathbf{v}$, divide it by its magnitude:\n\n$$\\mathbf{u} = \\frac{\\mathbf{v}}{\\|\\mathbf{v}\\|} = \\left\\langle \\frac{x}{\\|\\mathbf{v}\\|}, \\; \\frac{y}{\\|\\mathbf{v}\\|}, \\; \\frac{z}{\\|\\mathbf{v}\\|} \\right\\rangle$$",
        "单位向量的模长为 $1$。将非零向量 $\\mathbf{v}$ 单位化，只需将其除以其自身的模长：\n\n$$\\mathbf{u} = \\frac{\\mathbf{v}}{\\|\\mathbf{v}\\|} = \\left\\langle \\frac{x}{\\|\\mathbf{v}\\|}, \\; \\frac{y}{\\|\\mathbf{v}\\|}, \\; \\frac{z}{\\|\\mathbf{v}\\|} \\right\\rangle$$",
      ),
      generate(rng) {
        const [v, L] = pickQuadruple(rng);
        const qv: readonly [Q, Q, Q] = [Q.of(v[0], L), Q.of(v[1], L), Q.of(v[2], L)];
        const oppQv: readonly [Q, Q, Q] = [Q.of(-v[0], L), Q.of(-v[1], L), Q.of(-v[2], L)];
        const sqQv: readonly [Q, Q, Q] = [Q.of(v[0], L * L), Q.of(v[1], L * L), Q.of(v[2], L * L)];
        const flipQv: readonly [Q, Q, Q] = [Q.of(v[0], L), Q.of(-v[1], L), Q.of(v[2], L)];

        const right = qVec3Latex(qv);
        const w1 = qVec3Latex(oppQv);
        const w2 = qVec3Latex(sqQv);
        const w3 = qVec3Latex(flipQv);
        const w4 = vec3Latex(v);

        return oneOf(
          rng,
          t(
            `Find the unit vector $\\mathbf{u}$ that has the same direction as $\\mathbf{v} = ${vec3Latex(v)}$.`,
            `求与向量 $\\mathbf{v} = ${vec3Latex(v)}$ 同向的单位向量 $\\mathbf{u}$。`,
          ),
          t(`$${right}$`, `$${right}$`),
          [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`), t(`$${w4}$`, `$${w4}$`)],
          t(
            `First, the magnitude is $\\|\\mathbf{v}\\| = \\sqrt{(${v[0]})^2 + (${v[1]})^2 + (${v[2]})^2} = ${L}$.\n\nDividing $\\mathbf{v}$ by $${L}$ gives the unit vector $${right}$.`,
            `首先计算模长 $\\|\\mathbf{v}\\| = \\sqrt{(${v[0]})^2 + (${v[1]})^2 + (${v[2]})^2} = ${L}$。\n\n将 $\\mathbf{v}$ 各分量除以 $${L}$，得到单位向量 $${right}$。`,
          ),
        );
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
  encompasses: [{ topic: "calculating-the-magnitude-of-cartesian-vectors-in-2d", weight: 0.3 }],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.11"],
  knowledgePoints: [
    {
      id: "geometric-definition-of-the-dot-product",
      title: t("Geometric definition of the dot product", "数量积的几何定义"),
      explanation: t(
        "The dot product (scalar product) of two vectors $\\mathbf{u}$ and $\\mathbf{v}$ is defined geometrically as:\n\n$$\\mathbf{u} \\cdot \\mathbf{v} = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\cos\\theta$$\n\nwhere $\\theta$ is the angle between the two vectors with $0 \\le \\theta \\le \\pi$ ($0^\\circ \\le \\theta \\le 180^\\circ$).",
        "两个向量 $\\mathbf{u}$ 与 $\\mathbf{v}$ 的数量积（点积）在几何上定义为：\n\n$$\\mathbf{u} \\cdot \\mathbf{v} = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\cos\\theta$$\n\n其中 $\\theta$ 是两向量的夹角，满足 $0 \\le \\theta \\le \\pi$（即 $0^\\circ \\le \\theta \\le 180^\\circ$）。",
      ),
      generate(rng) {
        const magU = rng.pick([2, 3, 4, 5, 6, 8, 10]);
        const magV = rng.pick([2, 3, 4, 5, 6, 8, 10]);
        const angleItem = rng.pick([
          { deg: "0^\\circ", rad: "0", cosVal: 1, cosTex: "1", isRad: false },
          { deg: "60^\\circ", rad: "\\frac{\\pi}{3}", cosVal: 0.5, cosTex: "\\frac{1}{2}", isRad: true },
          { deg: "90^\\circ", rad: "\\frac{\\pi}{2}", cosVal: 0, cosTex: "0", isRad: false },
          { deg: "120^\\circ", rad: "\\frac{2\\pi}{3}", cosVal: -0.5, cosTex: "-\\frac{1}{2}", isRad: true },
          { deg: "180^\\circ", rad: "\\pi", cosVal: -1, cosTex: "-1", isRad: false },
        ]);

        const thetaStr = angleItem.isRad ? angleItem.rad : angleItem.deg;
        const qProd = Q.of(magU * magV);
        const dotVal =
          angleItem.cosVal === 1
            ? qProd.toLatex()
            : angleItem.cosVal === -1
              ? qProd.neg().toLatex()
              : angleItem.cosVal === 0
                ? "0"
                : angleItem.cosVal > 0
                  ? Q.of(magU * magV, 2).toLatex()
                  : Q.of(-magU * magV, 2).toLatex();

        const wrong1 = Q.of(magU * magV).toLatex();
        const wrong2 = Q.of(-magU * magV).toLatex();
        const wrong3 = "0";
        const wrong4 = Q.of(magU + magV).toLatex();

        return oneOf(
          rng,
          t(
            `Given two vectors with $\\|\\mathbf{u}\\| = ${magU}$, $\\|\\mathbf{v}\\| = ${magV}$, and the angle between them $\\theta = ${thetaStr}$, compute $\\mathbf{u} \\cdot \\mathbf{v}$.`,
            `已知两向量满足 $\\|\\mathbf{u}\\| = ${magU}$，$\\|\\mathbf{v}\\| = ${magV}$，且夹角 $\\theta = ${thetaStr}$，计算 $\\mathbf{u} \\cdot \\mathbf{v}$。`,
          ),
          t(`$${dotVal}$`, `$${dotVal}$`),
          [
            t(`$${wrong1}$`, `$${wrong1}$`),
            t(`$${wrong2}$`, `$${wrong2}$`),
            t(`$${wrong3}$`, `$${wrong3}$`),
            t(`$${wrong4}$`, `$${wrong4}$`),
          ],
          t(
            `$$\\mathbf{u} \\cdot \\mathbf{v} = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\cos\\theta = (${magU})(${magV})(${angleItem.cosTex}) = ${dotVal}$$`,
            `$$\\mathbf{u} \\cdot \\mathbf{v} = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\cos\\theta = (${magU})(${magV})(${angleItem.cosTex}) = ${dotVal}$$`,
          ),
        );
      },
    },
    {
      id: "sign-of-the-dot-product-and-orthogonality",
      title: t("Sign of the dot product and orthogonality", "数量积的正负与垂直关系"),
      explanation: t(
        "Because $\\mathbf{u} \\cdot \\mathbf{v} = \\|\\mathbf{u}\\|\\|\\mathbf{v}\\|\\cos\\theta$ and magnitudes are positive:\n\n- $\\mathbf{u} \\cdot \\mathbf{v} > 0 \\iff 0^\\circ \\le \\theta < 90^\\circ$ (acute angle)\n- $\\mathbf{u} \\cdot \\mathbf{v} = 0 \\iff \\theta = 90^\\circ$ (orthogonal / perpendicular)\n- $\\mathbf{u} \\cdot \\mathbf{v} < 0 \\iff 90^\\circ < \\theta \\le 180^\\circ$ (obtuse angle)",
        "因为 $\\mathbf{u} \\cdot \\mathbf{v} = \\|\\mathbf{u}\\|\\|\\mathbf{v}\\|\\cos\\theta$ 且向量模长为正：\n\n- $\\mathbf{u} \\cdot \\mathbf{v} > 0 \\iff 0^\\circ \\le \\theta < 90^\\circ$（锐角）\n- $\\mathbf{u} \\cdot \\mathbf{v} = 0 \\iff \\theta = 90^\\circ$（正交 / 垂直）\n- $\\mathbf{u} \\cdot \\mathbf{v} < 0 \\iff 90^\\circ < \\theta \\le 180^\\circ$（钝角）",
      ),
      generate(rng) {
        const uMag = rng.pick([3, 4, 5, 7, 9]);
        const vMag = rng.pick([2, 6, 8, 10]);
        const val = rng.pick([-18, -12, -7, 0, 8, 15, 24]);

        const prompt = t(
          `Two nonzero vectors $\\mathbf{u}$ and $\\mathbf{v}$ have $\\|\\mathbf{u}\\| = ${uMag}$, $\\|\\mathbf{v}\\| = ${vMag}$, and $\\mathbf{u} \\cdot \\mathbf{v} = ${val}$. What is the nature of the angle $\\theta$ between them?`,
          `已知两非零向量 $\\mathbf{u}$ 与 $\\mathbf{v}$ 满足 $\\|\\mathbf{u}\\| = ${uMag}$、$\\|\\mathbf{v}\\| = ${vMag}$，且 $\\mathbf{u} \\cdot \\mathbf{v} = ${val}$。它们之间的夹角 $\\theta$ 属于哪种类型？`,
        );

        if (val > 0) {
          return oneOf(
            rng,
            prompt,
            t("Acute ($0^\\circ \\le \\theta < 90^\\circ$)", "锐角（$0^\\circ \\le \\theta < 90^\\circ$）"),
            [
              t("Right angle ($\\theta = 90^\\circ$)", "直角（$\\theta = 90^\\circ$）"),
              t("Obtuse ($90^\\circ < \\theta \\le 180^\\circ$)", "钝角（$90^\\circ < \\theta \\le 180^\\circ$）"),
              t("Straight angle ($\\theta = 180^\\circ$)", "平角（$\\theta = 180^\\circ$）"),
            ],
            t(
              `Since $\\mathbf{u} \\cdot \\mathbf{v} = ${val} > 0$, $\\cos\\theta > 0$, which means $\\theta$ is an acute angle.`,
              `因为 $\\mathbf{u} \\cdot \\mathbf{v} = ${val} > 0$，所以 $\\cos\\theta > 0$，这意味着 $\\theta$ 为锐角。`,
            ),
          );
        }
        if (val === 0) {
          return oneOf(
            rng,
            prompt,
            t("Right angle ($\\theta = 90^\\circ$, orthogonal)", "直角（$\\theta = 90^\\circ$，互相垂直）"),
            [
              t("Acute ($0^\\circ \\le \\theta < 90^\\circ$)", "锐角（$0^\\circ \\le \\theta < 90^\\circ$）"),
              t("Obtuse ($90^\\circ < \\theta \\le 180^\\circ$)", "钝角（$90^\\circ < \\theta \\le 180^\\circ$）"),
              t("Zero angle ($\\theta = 0^\\circ$)", "零角（$\\theta = 0^\\circ$）"),
            ],
            t(
              "Since the dot product is $0$, $\\cos\\theta = 0$, so the vectors are orthogonal (perpendicular).",
              "数量积为 $0$ 说明 $\\cos\\theta = 0$，因此两向量互相正交（垂直）。",
            ),
          );
        }
        return oneOf(
          rng,
          prompt,
          t("Obtuse ($90^\\circ < \\theta \\le 180^\\circ$)", "钝角（$90^\\circ < \\theta \\le 180^\\circ$）"),
          [
            t("Acute ($0^\\circ \\le \\theta < 90^\\circ$)", "锐角（$0^\\circ \\le \\theta < 90^\\circ$）"),
            t("Right angle ($\\theta = 90^\\circ$)", "直角（$\\theta = 90^\\circ$）"),
            t("Zero angle ($\\theta = 0^\\circ$)", "零角（$\\theta = 0^\\circ$）"),
          ],
          t(
            `Since $\\mathbf{u} \\cdot \\mathbf{v} = ${val} < 0$, $\\cos\\theta < 0$, which means $\\theta$ is an obtuse angle.`,
            `因为 $\\mathbf{u} \\cdot \\mathbf{v} = ${val} < 0$，所以 $\\cos\\theta < 0$，这意味着 $\\theta$ 为钝角。`,
          ),
        );
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
  encompasses: [{ topic: "calculating-the-dot-product-using-angle-and-magnitude", weight: 0.4 }],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.11"],
  knowledgePoints: [
    {
      id: "algebraic-dot-product-in-2d-and-3d",
      title: t("Algebraic dot product in 2D and 3D", "二维与三维向量的坐标数量积"),
      explanation: t(
        "Using component form:\n\n- In 2D: $\\langle u_1, u_2 \\rangle \\cdot \\langle v_1, v_2 \\rangle = u_1 v_1 + u_2 v_2$\n- In 3D: $\\langle u_1, u_2, u_3 \\rangle \\cdot \\langle v_1, v_2, v_3 \\rangle = u_1 v_1 + u_2 v_2 + u_3 v_3$",
        "利用坐标分量表示：\n\n- 二维：$\\langle u_1, u_2 \\rangle \\cdot \\langle v_1, v_2 \\rangle = u_1 v_1 + u_2 v_2$\n- 三维：$\\langle u_1, u_2, u_3 \\rangle \\cdot \\langle v_1, v_2, v_3 \\rangle = u_1 v_1 + u_2 v_2 + u_3 v_3$",
      ),
      generate(rng) {
        if (rng.bool()) {
          // 3D dot product
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
          const w2 = -ans;
          const w3 = ans + 4;
          const w4 = ans - 5;

          return oneOf(
            rng,
            t(
              `Calculate the dot product $\\mathbf{u} \\cdot \\mathbf{v}$ for $\\mathbf{u} = ${vec3Latex(u)}$ and $\\mathbf{v} = ${vec3Latex(v)}$.`,
              `计算向量 $\\mathbf{u} = ${vec3Latex(u)}$ 与 $\\mathbf{v} = ${vec3Latex(v)}$ 的数量积 $\\mathbf{u} \\cdot \\mathbf{v}$。`,
            ),
            t(`$${ans}$`, `$${ans}$`),
            [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`), t(`$${w4}$`, `$${w4}$`)],
            t(
              `$$\\mathbf{u} \\cdot \\mathbf{v} = (${u[0]})(${v[0]}) + (${u[1]})(${v[1]}) + (${u[2]})(${v[2]}) = ${u[0] * v[0]} + (${u[1] * v[1]}) + (${u[2] * v[2]}) = ${ans}$$`,
              `$$\\mathbf{u} \\cdot \\mathbf{v} = (${u[0]})(${v[0]}) + (${u[1]})(${v[1]}) + (${u[2]})(${v[2]}) = ${u[0] * v[0]} + (${u[1] * v[1]}) + (${u[2] * v[2]}) = ${ans}$$`,
            ),
          );
        }

        // 2D dot product
        const u: Vec2 = [rng.pick([-9, -7, -5, -3, -1, 1, 3, 5, 7, 9]), rng.pick([-8, -6, -4, -2, 2, 4, 6, 8])];
        const v: Vec2 = [rng.pick([-9, -7, -5, -3, -1, 1, 3, 5, 7, 9]), rng.pick([-8, -6, -4, -2, 2, 4, 6, 8])];
        const ans = dot2(u, v);
        const w1 = u[0] * v[0] - u[1] * v[1];
        const w2 = -ans;
        const w3 = ans + 3;
        const w4 = ans - 2;

        return oneOf(
          rng,
          t(
            `Calculate the dot product $\\mathbf{u} \\cdot \\mathbf{v}$ for $\\mathbf{u} = ${vec2Latex(u)}$ and $\\mathbf{v} = ${vec2Latex(v)}$.`,
            `计算二维向量 $\\mathbf{u} = ${vec2Latex(u)}$ 与 $\\mathbf{v} = ${vec2Latex(v)}$ 的数量积 $\\mathbf{u} \\cdot \\mathbf{v}$。`,
          ),
          t(`$${ans}$`, `$${ans}$`),
          [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`), t(`$${w4}$`, `$${w4}$`)],
          t(
            `$$\\mathbf{u} \\cdot \\mathbf{v} = (${u[0]})(${v[0]}) + (${u[1]})(${v[1]}) = ${u[0] * v[0]} + (${u[1] * v[1]}) = ${ans}$$`,
            `$$\\mathbf{u} \\cdot \\mathbf{v} = (${u[0]})(${v[0]}) + (${u[1]})(${v[1]}) = ${u[0] * v[0]} + (${u[1] * v[1]}) = ${ans}$$`,
          ),
        );
      },
    },
    {
      id: "testing-orthogonality-using-the-dot-product",
      title: t("Testing orthogonality using the dot product", "利用数量积判定向量垂直"),
      explanation: t(
        "Two nonzero vectors $\\mathbf{u}$ and $\\mathbf{v}$ are perpendicular (orthogonal) if and only if their dot product is zero:\n\n$$\\mathbf{u} \\perp \\mathbf{v} \\iff \\mathbf{u} \\cdot \\mathbf{v} = 0$$",
        "两个非零向量 $\\mathbf{u}$ 与 $\\mathbf{v}$ 垂直（正交）当且仅当它们的数量积为零：\n\n$$\\mathbf{u} \\perp \\mathbf{v} \\iff \\mathbf{u} \\cdot \\mathbf{v} = 0$$",
      ),
      generate(rng) {
        const c = rng.pick([-3, -2, -1, 1, 2, 3]);
        const a = rng.pick([-4, -3, -2, 2, 3, 4]);
        const b = rng.pick([-4, -3, -2, 2, 3, 4]);
        const x = rng.pick([-5, -3, -1, 1, 3, 5]);
        const y = rng.pick([-4, -2, 2, 4]);

        // Target: a*x + b*y + c*k = 0 => k = -(a*x + b*y)/c
        // Choose x, y such that a*x + b*y is divisible by c:
        const rem = (((a * x + b * y) % c) + c) % c;
        const adjustedX = rem === 0 ? x : x + (c - rem) * (a % 2 === 0 ? 1 : 1);
        const numerator = -(a * adjustedX + b * y);
        const ansK = Math.round(numerator / c);

        const uVec: Vec3 = [a, b, c];
        const vVecPrompt = `\\langle ${adjustedX}, ${y}, k \\rangle`;
        const right = `${ansK}`;
        const w1 = `${-ansK}`;
        const w2 = `${ansK + 1}`;
        const w3 = `${ansK - 2}`;
        const w4 = `${ansK + 3}`;

        return oneOf(
          rng,
          t(
            `Find the value of $k$ such that the vectors $\\mathbf{u} = ${vec3Latex(uVec)}$ and $\\mathbf{v} = ${vVecPrompt}$ are orthogonal.`,
            `求使向量 $\\mathbf{u} = ${vec3Latex(uVec)}$ 与 $\\mathbf{v} = ${vVecPrompt}$ 正交（互相垂直）的实数 $k$ 的值。`,
          ),
          t(`$${right}$`, `$${right}$`),
          [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`), t(`$${w4}$`, `$${w4}$`)],
          t(
            `Set the dot product to $0$:\n\n$$\\mathbf{u} \\cdot \\mathbf{v} = (${a})(${adjustedX}) + (${b})(${y}) + (${c})k = 0$$\n\n$$${a * adjustedX + b * y} + ${c}k = 0 \\implies k = ${ansK}$$`,
            `令数量积为 $0$：\n\n$$\\mathbf{u} \\cdot \\mathbf{v} = (${a})(${adjustedX}) + (${b})(${y}) + (${c})k = 0$$\n\n$$${a * adjustedX + b * y} + ${c}k = 0 \\implies k = ${ansK}$$`,
          ),
        );
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
  knowledgePoints: [
    {
      id: "cosine-formula-for-angle-between-vectors",
      title: t("Cosine formula for angle between vectors", "两向量夹角的余弦公式"),
      explanation: t(
        "The cosine of the angle $\\theta$ between two nonzero vectors $\\mathbf{u}$ and $\\mathbf{v}$ is given by:\n\n$$\\cos\\theta = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\| \\|\\mathbf{v}\\|}$$",
        "两非零向量 $\\mathbf{u}$ 与 $\\mathbf{v}$ 夹角 $\\theta$ 的余弦值为：\n\n$$\\cos\\theta = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\| \\|\\mathbf{v}\\|}$$",
      ),
      generate(rng) {
        const [u, Lu] = pickQuadruple(rng);
        const [v, Lv] = pickQuadruple(rng);
        const dot = dot3(u, v);
        const denom = Lu * Lv;
        const cosQ = Q.of(dot, denom);
        const right = cosQ.toLatex();
        const w1 = cosQ.neg().toLatex();
        const w2 = Q.of(dot, denom > 1 ? denom - 1 : 2).toLatex();
        const w3 = Q.of(Math.abs(dot) + 1, denom).toLatex();
        const w4 = "0";

        return oneOf(
          rng,
          t(
            `Find $\\cos\\theta$, where $\\theta$ is the angle between the vectors $\\mathbf{u} = ${vec3Latex(u)}$ and $\\mathbf{v} = ${vec3Latex(v)}$.`,
            `求向量 $\\mathbf{u} = ${vec3Latex(u)}$ 与 $\\mathbf{v} = ${vec3Latex(v)}$ 的夹角 $\\theta$ 的余弦值 $\\cos\\theta$。`,
          ),
          t(`$${right}$`, `$${right}$`),
          [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`), t(`$${w4}$`, `$${w4}$`)],
          t(
            `Compute the components:\n\n- $\\mathbf{u} \\cdot \\mathbf{v} = (${u[0]})(${v[0]}) + (${u[1]})(${v[1]}) + (${u[2]})(${v[2]}) = ${dot}$\n- $\\|\\mathbf{u}\\| = ${Lu}, \\quad \\|\\mathbf{v}\\| = ${Lv}$\n\n$$\\cos\\theta = \\frac{${dot}}{(${Lu})(${Lv})} = ${right}$$`,
            `分别计算各项：\n\n- $\\mathbf{u} \\cdot \\mathbf{v} = (${u[0]})(${v[0]}) + (${u[1]})(${v[1]}) + (${u[2]})(${v[2]}) = ${dot}$\n- $\\|\\mathbf{u}\\| = ${Lu}, \\quad \\|\\mathbf{v}\\| = ${Lv}$\n\n$$\\cos\\theta = \\frac{${dot}}{(${Lu})(${Lv})} = ${right}$$`,
          ),
        );
      },
    },
    {
      id: "determining-the-exact-angle-between-vectors",
      title: t("Determining the exact angle between vectors", "求两向量夹角的精确值"),
      explanation: t(
        "Once $\\cos\\theta$ is determined, the angle $\\theta \\in [0^\\circ, 180^\\circ]$ is found by evaluating $\\arccos(\\cos\\theta)$. Familiar values include:\n\n- $\\cos\\theta = 0 \\implies 90^\\circ$\n- $\\cos\\theta = \\frac{1}{2} \\implies 60^\\circ, \\quad -\\frac{1}{2} \\implies 120^\\circ$\n- $\\cos\\theta = \\frac{\\sqrt{2}}{2} \\implies 45^\\circ, \\quad -\\frac{\\sqrt{2}}{2} \\implies 135^\\circ$",
        "求出 $\\cos\\theta$ 后，通过 $\\arccos(\\cos\\theta)$ 确定夹角 $\\theta \\in [0^\\circ, 180^\\circ]$。常见特殊角包括：\n\n- $\\cos\\theta = 0 \\implies 90^\\circ$\n- $\\cos\\theta = \\frac{1}{2} \\implies 60^\\circ, \\quad -\\frac{1}{2} \\implies 120^\\circ$\n- $\\cos\\theta = \\frac{\\sqrt{2}}{2} \\implies 45^\\circ, \\quad -\\frac{\\sqrt{2}}{2} \\implies 135^\\circ$",
      ),
      generate(rng) {
        const item = rng.pick([
          {
            u: [1, 1, 0] as Vec3,
            v: [1, 0, 1] as Vec3,
            deg: "60^\\circ",
            rad: "\\frac{\\pi}{3}",
            cosStr: "\\frac{1}{2}",
            wrongsDeg: ["30^\\circ", "45^\\circ", "90^\\circ", "120^\\circ"],
            wrongsRad: ["\\frac{\\pi}{6}", "\\frac{\\pi}{4}", "\\frac{\\pi}{2}", "\\frac{2\\pi}{3}"],
          },
          {
            u: [1, 1, 0] as Vec3,
            v: [-1, 0, 1] as Vec3,
            deg: "120^\\circ",
            rad: "\\frac{2\\pi}{3}",
            cosStr: "-\\frac{1}{2}",
            wrongsDeg: ["60^\\circ", "135^\\circ", "150^\\circ", "90^\\circ"],
            wrongsRad: ["\\frac{\\pi}{3}", "\\frac{3\\pi}{4}", "\\frac{5\\pi}{6}", "\\frac{\\pi}{2}"],
          },
          {
            u: [1, 0, 0] as Vec3,
            v: [1, 1, 0] as Vec3,
            deg: "45^\\circ",
            rad: "\\frac{\\pi}{4}",
            cosStr: "\\frac{\\sqrt{2}}{2}",
            wrongsDeg: ["30^\\circ", "60^\\circ", "90^\\circ", "135^\\circ"],
            wrongsRad: ["\\frac{\\pi}{6}", "\\frac{\\pi}{3}", "\\frac{\\pi}{2}", "\\frac{3\\pi}{4}"],
          },
          {
            u: [1, 0, 0] as Vec3,
            v: [-1, 1, 0] as Vec3,
            deg: "135^\\circ",
            rad: "\\frac{3\\pi}{4}",
            cosStr: "-\\frac{\\sqrt{2}}{2}",
            wrongsDeg: ["45^\\circ", "120^\\circ", "150^\\circ", "90^\\circ"],
            wrongsRad: ["\\frac{\\pi}{4}", "\\frac{2\\pi}{3}", "\\frac{5\\pi}{6}", "\\frac{\\pi}{2}"],
          },
          {
            u: [1, 2, 2] as Vec3,
            v: [2, 1, -2] as Vec3,
            deg: "90^\\circ",
            rad: "\\frac{\\pi}{2}",
            cosStr: "0",
            wrongsDeg: ["0^\\circ", "45^\\circ", "60^\\circ", "180^\\circ"],
            wrongsRad: ["0", "\\frac{\\pi}{4}", "\\frac{\\pi}{3}", "\\pi"],
          },
          {
            u: [2, 3, 6] as Vec3,
            v: [6, -2, -1] as Vec3,
            deg: "90^\\circ",
            rad: "\\frac{\\pi}{2}",
            cosStr: "0",
            wrongsDeg: ["45^\\circ", "60^\\circ", "120^\\circ", "180^\\circ"],
            wrongsRad: ["\\frac{\\pi}{4}", "\\frac{\\pi}{3}", "\\frac{2\\pi}{3}", "\\pi"],
          },
          {
            u: [2, -1, 3] as Vec3,
            v: [4, -2, 6] as Vec3,
            deg: "0^\\circ",
            rad: "0",
            cosStr: "1",
            wrongsDeg: ["45^\\circ", "90^\\circ", "180^\\circ", "60^\\circ"],
            wrongsRad: ["\\frac{\\pi}{4}", "\\frac{\\pi}{2}", "\\pi", "\\frac{\\pi}{3}"],
          },
          {
            u: [2, -1, 3] as Vec3,
            v: [-4, 2, -6] as Vec3,
            deg: "180^\\circ",
            rad: "\\pi",
            cosStr: "-1",
            wrongsDeg: ["0^\\circ", "90^\\circ", "135^\\circ", "120^\\circ"],
            wrongsRad: ["0", "\\frac{\\pi}{2}", "\\frac{3\\pi}{4}", "\\frac{2\\pi}{3}"],
          },
        ]);

        const scaleU = rng.pick([1, 2, 3, 4, 5, 6]);
        const scaleV = rng.pick([1, 2, 3]);
        const swap = rng.bool();
        const uScaled = smul3(scaleU, swap ? item.v : item.u);
        const vScaled = smul3(scaleV, swap ? item.u : item.v);
        const inRad = rng.bool();
        const ans = inRad ? item.rad : item.deg;
        const wrongs = inRad ? item.wrongsRad : item.wrongsDeg;

        return oneOf(
          rng,
          t(
            `Find the angle $\\theta$ between the vectors $\\mathbf{u} = ${vec3Latex(uScaled)}$ and $\\mathbf{v} = ${vec3Latex(vScaled)}$.`,
            `求向量 $\\mathbf{u} = ${vec3Latex(uScaled)}$ 与 $\\mathbf{v} = ${vec3Latex(vScaled)}$ 的夹角 $\\theta$。`,
          ),
          t(`$${ans}$`, `$${ans}$`),
          wrongs.map((w) => t(`$${w}$`, `$${w}$`)),
          t(
            `Using $\\cos\\theta = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\|\\|\\mathbf{v}\\|} = ${item.cosStr}$, we find $\\theta = ${ans}$.`,
            `由 $\\cos\\theta = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\|\\|\\mathbf{v}\\|} = ${item.cosStr}$，解得 $\\theta = ${ans}$。`,
          ),
        );
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
  encompasses: [{ topic: "the-angle-between-two-vectors", weight: 0.4 }],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.11"],
  knowledgePoints: [
    {
      id: "concept-and-formula-of-scalar-projection",
      title: t("Concept and formula of scalar projection", "标量投影的概念与公式"),
      explanation: t(
        "The scalar projection (scalar component) of vector $\\mathbf{u}$ onto vector $\\mathbf{v}$ is the signed length of the projection of $\\mathbf{u}$ along $\\mathbf{v}$:\n\n$$\\text{comp}_{\\mathbf{v}}\\mathbf{u} = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{v}\\|} = \\|\\mathbf{u}\\|\\cos\\theta$$",
        "向量 $\\mathbf{u}$ 在向量 $\\mathbf{v}$ 上的标量投影（数量投影）是 $\\mathbf{u}$ 沿 $\\mathbf{v}$ 方向投影的有向长度：\n\n$$\\text{comp}_{\\mathbf{v}}\\mathbf{u} = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{v}\\|} = \\|\\mathbf{u}\\|\\cos\\theta$$",
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
        const right = ansQ.toLatex();
        const w1 = ansQ.neg().toLatex();
        const w2 = Q.of(dot, Lv * Lv).toLatex();
        const w3 = `${dot}`;
        const w4 = Q.of(dot + 1, Lv).toLatex();

        return oneOf(
          rng,
          t(
            `Find the scalar projection $\\text{comp}_{\\mathbf{v}}\\mathbf{u}$ of $\\mathbf{u} = ${vec3Latex(u)}$ onto $\\mathbf{v} = ${vec3Latex(v)}$.`,
            `求向量 $\\mathbf{u} = ${vec3Latex(u)}$ 在向量 $\\mathbf{v} = ${vec3Latex(v)}$ 上的标量投影 $\\text{comp}_{\\mathbf{v}}\\mathbf{u}$。`,
          ),
          t(`$${right}$`, `$${right}$`),
          [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`), t(`$${w4}$`, `$${w4}$`)],
          t(
            `First calculate $\\mathbf{u} \\cdot \\mathbf{v} = ${dot}$ and $\\|\\mathbf{v}\\| = ${Lv}$.\n\n$$\\text{comp}_{\\mathbf{v}}\\mathbf{u} = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{v}\\|} = \\frac{${dot}}{${Lv}} = ${right}$$`,
            `首先计算 $\\mathbf{u} \\cdot \\mathbf{v} = ${dot}$ 及 $\\|\\mathbf{v}\\| = ${Lv}$。\n\n$$\\text{comp}_{\\mathbf{v}}\\mathbf{u} = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{v}\\|} = \\frac{${dot}}{${Lv}} = ${right}$$`,
          ),
        );
      },
    },
    {
      id: "interpreting-the-sign-of-scalar-projection",
      title: t("Interpreting the sign of scalar projection", "标量投影的正负意义与计算"),
      explanation: t(
        "Because $\\text{comp}_{\\mathbf{v}}\\mathbf{u} = \\|\\mathbf{u}\\|\\cos\\theta$:\n\n- $\\text{comp}_{\\mathbf{v}}\\mathbf{u} > 0$ when the angle $\\theta$ is acute;\n- $\\text{comp}_{\\mathbf{v}}\\mathbf{u} = 0$ when $\\mathbf{u} \\perp \\mathbf{v}$;\n- $\\text{comp}_{\\mathbf{v}}\\mathbf{u} < 0$ when $\\theta$ is obtuse, meaning the projection points opposite to $\\mathbf{v}$.",
        "由 $\\text{comp}_{\\mathbf{v}}\\mathbf{u} = \\|\\mathbf{u}\\|\\cos\\theta$ 可知：\n\n- 当夹角 $\\theta$ 为锐角时，$\\text{comp}_{\\mathbf{v}}\\mathbf{u} > 0$；\n- 当 $\\mathbf{u} \\perp \\mathbf{v}$ 时，$\\text{comp}_{\\mathbf{v}}\\mathbf{u} = 0$；\n- 当 $\\theta$ 为钝角时，$\\text{comp}_{\\mathbf{v}}\\mathbf{u} < 0$，表示投影方向与 $\\mathbf{v}$ 反向。",
      ),
      generate(rng) {
        const [v, Lv] = pickQuadruple(rng);
        // choose u so dot product is strictly negative
        const k = rng.pick([1, 2, 3]);
        const perp: Vec3 = [-v[1], v[0], 0];
        const u: Vec3 = sub3(perp, smul3(k, v));
        const dot = dot3(u, v);
        const ansQ = Q.of(dot, Lv);
        const right = ansQ.toLatex();
        const w1 = ansQ.neg().toLatex();
        const w2 = Q.of(dot, Lv * Lv).toLatex();
        const w3 = "0";

        return oneOf(
          rng,
          t(
            `Given $\\mathbf{u} = ${vec3Latex(u)}$ and $\\mathbf{v} = ${vec3Latex(v)}$, calculate the scalar projection $\\text{comp}_{\\mathbf{v}}\\mathbf{u}$.`,
            `已知 $\\mathbf{u} = ${vec3Latex(u)}$ 且 $\\mathbf{v} = ${vec3Latex(v)}$，计算标量投影 $\\text{comp}_{\\mathbf{v}}\\mathbf{u}$。`,
          ),
          t(`$${right}$`, `$${right}$`),
          [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`)],
          t(
            `$$\\text{comp}_{\\mathbf{v}}\\mathbf{u} = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{v}\\|} = \\frac{${dot}}{${Lv}} = ${right}$$\n\nThe negative sign indicates that the angle between $\\mathbf{u}$ and $\\mathbf{v}$ is obtuse.`,
            `$$\\text{comp}_{\\mathbf{v}}\\mathbf{u} = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{v}\\|} = \\frac{${dot}}{${Lv}} = ${right}$$\n\n负号表明 $\\mathbf{u}$ 与 $\\mathbf{v}$ 的夹角为钝角。`,
          ),
        );
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
  knowledgePoints: [
    {
      id: "vector-projection-formula",
      title: t("Vector projection formula", "向量投影的公式与计算"),
      explanation: t(
        "The vector projection of $\\mathbf{u}$ onto $\\mathbf{v}$ is the vector parallel to $\\mathbf{v}$ obtained by multiplying the unit vector in the direction of $\\mathbf{v}$ by the scalar projection:\n\n$$\\text{proj}_{\\mathbf{v}}\\mathbf{u} = \\left(\\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{v}\\|^2}\\right)\\mathbf{v} = \\left(\\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\mathbf{v} \\cdot \\mathbf{v}}\\right)\\mathbf{v}$$",
        "向量 $\\mathbf{u}$ 在向量 $\\mathbf{v}$ 上的向量投影是与 $\\mathbf{v}$ 平行的向量，等于标量投影乘以 $\\mathbf{v}$ 方向的单位向量：\n\n$$\\text{proj}_{\\mathbf{v}}\\mathbf{u} = \\left(\\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{v}\\|^2}\\right)\\mathbf{v} = \\left(\\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\mathbf{v} \\cdot \\mathbf{v}}\\right)\\mathbf{v}$$",
      ),
      generate(rng) {
        // Choose v with clean magnitude squared M
        const v = rng.pick([
          [1, 1, 0] as Vec3, // M = 2
          [1, 1, 1] as Vec3, // M = 3
          [2, 1, 0] as Vec3, // M = 5
          [1, 2, 2] as Vec3, // M = 9
          [0, 3, 4] as Vec3, // M = 25
          [2, 2, 1] as Vec3, // M = 9
        ]);
        const M = magSq3(v);
        const k = rng.pick([-3, -2, -1, 1, 2, 3]);
        // construct u = k*v + orthogonal vector
        const perpCandidates = [[-v[1], v[0], 0] as Vec3, [0, -v[2], v[1]] as Vec3, [-v[2], 0, v[0]] as Vec3];
        const perp = rng.pick(perpCandidates.filter((p) => dot3(p, v) === 0 && magSq3(p) > 0)) ?? [-v[1], v[0], 0];
        const u = add3(smul3(k, v), perp);

        const proj = smul3(k, v);
        const right = vec3Latex(proj);
        const w1 = vec3Latex(smul3(-k, v));
        const w2 = vec3Latex(u);
        const w3 = vec3Latex(perp);
        const w4 = vec3Latex(add3(proj, [1, 0, 0]));

        return oneOf(
          rng,
          t(
            `Find the vector projection $\\text{proj}_{\\mathbf{v}}\\mathbf{u}$ of $\\mathbf{u} = ${vec3Latex(u)}$ onto $\\mathbf{v} = ${vec3Latex(v)}$.`,
            `求向量 $\\mathbf{u} = ${vec3Latex(u)}$ 在向量 $\\mathbf{v} = ${vec3Latex(v)}$ 上的向量投影 $\\text{proj}_{\\mathbf{v}}\\mathbf{u}$。`,
          ),
          t(`$${right}$`, `$${right}$`),
          [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`), t(`$${w4}$`, `$${w4}$`)],
          t(
            `Compute the dot products:\n\n- $\\mathbf{u} \\cdot \\mathbf{v} = ${dot3(u, v)}$\n- $\\|\\mathbf{v}\\|^2 = ${M}$\n\n$$\\text{proj}_{\\mathbf{v}}\\mathbf{u} = \\left(\\frac{${dot3(u, v)}}{${M}}\\right)${vec3Latex(v)} = ${k}${vec3Latex(v)} = ${right}$$`,
            `计算相关数量积：\n\n- $\\mathbf{u} \\cdot \\mathbf{v} = ${dot3(u, v)}$\n- $\\|\\mathbf{v}\\|^2 = ${M}$\n\n$$\\text{proj}_{\\mathbf{v}}\\mathbf{u} = \\left(\\frac{${dot3(u, v)}}{${M}}\\right)${vec3Latex(v)} = ${k}${vec3Latex(v)} = ${right}$$`,
          ),
        );
      },
    },
    {
      id: "orthogonal-component-and-vector-decomposition",
      title: t("Orthogonal component and vector decomposition", "正交分量与向量正交分解"),
      explanation: t(
        "Any vector $\\mathbf{u}$ can be uniquely decomposed into two components relative to $\\mathbf{v}$:\n\n$$\\mathbf{u} = \\mathbf{u}_{\\parallel} + \\mathbf{u}_{\\perp}$$\n\nwhere $\\mathbf{u}_{\\parallel} = \\text{proj}_{\\mathbf{v}}\\mathbf{u}$ is parallel to $\\mathbf{v}$, and $\\mathbf{u}_{\\perp} = \\mathbf{u} - \\text{proj}_{\\mathbf{v}}\\mathbf{u}$ is orthogonal to $\\mathbf{v}$.",
        "任意向量 $\\mathbf{u}$ 均可相对于 $\\mathbf{v}$ 唯一正交分解为两个分量之和：\n\n$$\\mathbf{u} = \\mathbf{u}_{\\parallel} + \\mathbf{u}_{\\perp}$$\n\n其中 $\\mathbf{u}_{\\parallel} = \\text{proj}_{\\mathbf{v}}\\mathbf{u}$ 与 $\\mathbf{v}$ 平行，而 $\\mathbf{u}_{\\perp} = \\mathbf{u} - \\text{proj}_{\\mathbf{v}}\\mathbf{u}$ 与 $\\mathbf{v}$ 正交（垂直）。",
      ),
      generate(rng) {
        const v = rng.pick([[1, 1, 0] as Vec3, [1, 1, 1] as Vec3, [2, 0, 1] as Vec3, [1, 2, 2] as Vec3, [2, 2, 1] as Vec3]);
        const k = rng.pick([-2, -1, 1, 2]);
        const perp = rng.pick([[-v[1], v[0], 0] as Vec3, [0, -v[2], v[1]] as Vec3, [-v[2], 0, v[0]] as Vec3]);
        const multPerp = rng.pick([1, 2, 3]);
        const uPerp = smul3(multPerp, perp);
        const u = add3(smul3(k, v), uPerp);
        const proj = smul3(k, v);

        const right = vec3Latex(uPerp);
        const w1 = vec3Latex(proj);
        const w2 = vec3Latex(smul3(-1, uPerp));
        const w3 = vec3Latex(u);
        const w4 = vec3Latex(add3(u, proj));

        return oneOf(
          rng,
          t(
            `Find the component of $\\mathbf{u} = ${vec3Latex(u)}$ orthogonal to $\\mathbf{v} = ${vec3Latex(v)}$.`,
            `求向量 $\\mathbf{u} = ${vec3Latex(u)}$ 在垂直于 $\\mathbf{v} = ${vec3Latex(v)}$ 方向上的正交分量。`,
          ),
          t(`$${right}$`, `$${right}$`),
          [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`), t(`$${w4}$`, `$${w4}$`)],
          t(
            `First find $\\text{proj}_{\\mathbf{v}}\\mathbf{u} = ${vec3Latex(proj)}$.\n\nThen subtract:\n\n$$\\mathbf{u}_{\\perp} = \\mathbf{u} - \\text{proj}_{\\mathbf{v}}\\mathbf{u} = ${vec3Latex(u)} - ${vec3Latex(proj)} = ${right}$$\n\nNotice that $\\mathbf{u}_{\\perp} \\cdot \\mathbf{v} = 0$.`,
            `首先计算平行分量 $\\text{proj}_{\\mathbf{v}}\\mathbf{u} = ${vec3Latex(proj)}$。\n\n再做向量减法：\n\n$$\\mathbf{u}_{\\perp} = \\mathbf{u} - \\text{proj}_{\\mathbf{v}}\\mathbf{u} = ${vec3Latex(u)} - ${vec3Latex(proj)} = ${right}$$\n\n验证可得 $\\mathbf{u}_{\\perp} \\cdot \\mathbf{v} = 0$。`,
          ),
        );
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
  encompasses: [{ topic: "calculating-the-magnitude-of-cartesian-vectors-in-3d", weight: 0.3 }],
  xp: 15,
  standards: ["CCSS.HSN.VM.C.11"],
  knowledgePoints: [
    {
      id: "geometric-definition-and-magnitude-of-cross-product",
      title: t("Geometric definition and magnitude of cross product", "叉积的几何定义与模长"),
      explanation: t(
        "Unlike the dot product, the cross product $\\mathbf{u} \\times \\mathbf{v}$ is a vector in $\\mathbb{R}^3$. Its magnitude is given by:\n\n$$\\|\\mathbf{u} \\times \\mathbf{v}\\| = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\sin\\theta$$\n\nwhere $\\theta \\in [0, \\pi]$ is the angle between the two vectors.",
        "与数量积不同，叉积（向量积）$\\mathbf{u} \\times \\mathbf{v}$ 的结果是三维空间中的一个向量。其模长公式为：\n\n$$\\|\\mathbf{u} \\times \\mathbf{v}\\| = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\sin\\theta$$\n\n其中 $\\theta \\in [0, \\pi]$ 是两向量的夹角。",
      ),
      generate(rng) {
        const uMag = rng.pick([2, 3, 4, 5, 6, 8, 10]);
        const vMag = rng.pick([2, 3, 4, 5, 6, 8, 10]);
        const angle = rng.pick([
          { deg: "30^\\circ", sinVal: 0.5, sinTex: "\\frac{1}{2}" },
          { deg: "90^\\circ", sinVal: 1, sinTex: "1" },
          { deg: "150^\\circ", sinVal: 0.5, sinTex: "\\frac{1}{2}" },
          { deg: "0^\\circ", sinVal: 0, sinTex: "0" },
          { deg: "180^\\circ", sinVal: 0, sinTex: "0" },
        ]);

        const prod = uMag * vMag;
        const ans = angle.sinVal === 1 ? `${prod}` : angle.sinVal === 0 ? "0" : Q.of(prod, 2).toLatex();

        const w1 = `${prod}`;
        const w2 = "0";
        const w3 = `${uMag + vMag}`;
        const w4 = Q.of(prod, 3).toLatex();

        return oneOf(
          rng,
          t(
            `Given two vectors with $\\|\\mathbf{u}\\| = ${uMag}$, $\\|\\mathbf{v}\\| = ${vMag}$, and angle $\\theta = ${angle.deg}$, calculate $\\|\\mathbf{u} \\times \\mathbf{v}\\|$.`,
            `已知两向量满足 $\\|\\mathbf{u}\\| = ${uMag}$，$\\|\\mathbf{v}\\| = ${vMag}$，且夹角 $\\theta = ${angle.deg}$，计算叉积的模长 $\\|\\mathbf{u} \\times \\mathbf{v}\\|$。`,
          ),
          t(`$${ans}$`, `$${ans}$`),
          [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`), t(`$${w4}$`, `$${w4}$`)],
          t(
            `$$\\|\\mathbf{u} \\times \\mathbf{v}\\| = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\sin\\theta = (${uMag})(${vMag})(${angle.sinTex}) = ${ans}$$`,
            `$$\\|\\mathbf{u} \\times \\mathbf{v}\\| = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\sin\\theta = (${uMag})(${vMag})(${angle.sinTex}) = ${ans}$$`,
          ),
        );
      },
    },
    {
      id: "direction-of-cross-product-and-orthogonality",
      title: t("Direction of cross product and orthogonality", "叉积的方向与右手定则"),
      explanation: t(
        "The direction of $\\mathbf{u} \\times \\mathbf{v}$ is perpendicular to both $\\mathbf{u}$ and $\\mathbf{v}$, following the right-hand rule. For the standard basis vectors:\n\n$$\\mathbf{i} \\times \\mathbf{j} = \\mathbf{k}, \\quad \\mathbf{j} \\times \\mathbf{k} = \\mathbf{i}, \\quad \\mathbf{k} \\times \\mathbf{i} = \\mathbf{j}$$\n\n$$\\mathbf{j} \\times \\mathbf{i} = -\\mathbf{k}, \\quad \\mathbf{k} \\times \\mathbf{j} = -\\mathbf{i}, \\quad \\mathbf{i} \\times \\mathbf{k} = -\\mathbf{j}$$",
        "叉积 $\\mathbf{u} \\times \\mathbf{v}$ 的方向同时垂直于 $\\mathbf{u}$ 和 $\\mathbf{v}$，满足右手定则。标准基向量的叉积关系为：\n\n$$\\mathbf{i} \\times \\mathbf{j} = \\mathbf{k}, \\quad \\mathbf{j} \\times \\mathbf{k} = \\mathbf{i}, \\quad \\mathbf{k} \\times \\mathbf{i} = \\mathbf{j}$$\n\n$$\\mathbf{j} \\times \\mathbf{i} = -\\mathbf{k}, \\quad \\mathbf{k} \\times \\mathbf{j} = -\\mathbf{i}, \\quad \\mathbf{i} \\times \\mathbf{k} = -\\mathbf{j}$$",
      ),
      generate(rng) {
        const item = rng.pick([
          { expr: "\\mathbf{i} \\times \\mathbf{j}", ans: "\\mathbf{k}", wrong: ["-\\mathbf{k}", "\\mathbf{0}", "1", "\\mathbf{j}"] },
          { expr: "\\mathbf{j} \\times \\mathbf{i}", ans: "-\\mathbf{k}", wrong: ["\\mathbf{k}", "\\mathbf{0}", "-1", "\\mathbf{i}"] },
          { expr: "\\mathbf{j} \\times \\mathbf{k}", ans: "\\mathbf{i}", wrong: ["-\\mathbf{i}", "\\mathbf{k}", "\\mathbf{0}", "1"] },
          { expr: "\\mathbf{k} \\times \\mathbf{j}", ans: "-\\mathbf{i}", wrong: ["\\mathbf{i}", "-\\mathbf{k}", "\\mathbf{0}", "-1"] },
          { expr: "\\mathbf{k} \\times \\mathbf{i}", ans: "\\mathbf{j}", wrong: ["-\\mathbf{j}", "\\mathbf{i}", "\\mathbf{0}", "1"] },
          { expr: "\\mathbf{i} \\times \\mathbf{k}", ans: "-\\mathbf{j}", wrong: ["\\mathbf{j}", "-\\mathbf{i}", "\\mathbf{0}", "-1"] },
        ]);
        const a = rng.pick([2, 3, -2, -3]);
        const b = rng.pick([2, 4, -1]);
        const coeff = a * b;

        const exprParts = item.expr.split("\\times");
        const term1 = a === 1 ? exprParts[0]!.trim() : `(${a}${exprParts[0]!.trim()})`;
        const term2 = b === 1 ? exprParts[1]!.trim() : `(${b}${exprParts[1]!.trim()})`;
        const promptExpr = `${term1} \\times ${term2}`;

        const baseSign = item.ans.startsWith("-") ? -1 : 1;
        const baseSymbol = item.ans.replace("-", "");
        const finalCoeff = coeff * baseSign;
        const right = finalCoeff === 1 ? baseSymbol : finalCoeff === -1 ? `-${baseSymbol}` : `${finalCoeff}${baseSymbol}`;
        const w1 = finalCoeff === 1 ? `-${baseSymbol}` : `${-finalCoeff}${baseSymbol}`;
        const w2 = "\\mathbf{0}";
        const w3 = `${finalCoeff}`;
        const w4 = `${finalCoeff}\\mathbf{k}`;

        return oneOf(
          rng,
          t(`Evaluate the vector expression $${promptExpr}$.`, `计算向量表达式 $${promptExpr}$。`),
          t(`$${right}$`, `$${right}$`),
          [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`), t(`$${w4}$`, `$${w4}$`)],
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
          // (a v) x (b u) = a*b*(v x u) = -a*b*(u x v) = -a*b*w
          const factor = -a * b;
          const ans = smul3(factor, w);
          const w1 = smul3(-factor, w);
          const w2 = smul3(a * b, w);
          const w3: Vec3 = [0, 0, 0];

          return oneOf(
            rng,
            t(
              `Given that $\\mathbf{u} \\times \\mathbf{v} = ${vec3Latex(w)}$, find the value of $(${a}\\mathbf{v}) \\times (${b}\\mathbf{u})$.`,
              `已知 $\\mathbf{u} \\times \\mathbf{v} = ${vec3Latex(w)}$，求 $(${a}\\mathbf{v}) \\times (${b}\\mathbf{u})$ 的值。`,
            ),
            t(`$${vec3Latex(ans)}$`, `$${vec3Latex(ans)}$`),
            [
              t(`$${vec3Latex(w1)}$`, `$${vec3Latex(w1)}$`),
              t(`$${vec3Latex(w2)}$`, `$${vec3Latex(w2)}$`),
              t(`$${vec3Latex(w3)}$`, `$${vec3Latex(w3)}$`),
            ],
            t(
              `By anti-commutativity and scalar associativity:\n\n$$(${a}\\mathbf{v}) \\times (${b}\\mathbf{u}) = ${a * b}(\\mathbf{v} \\times \\mathbf{u}) = -${a * b}(\\mathbf{u} \\times \\mathbf{v}) = ${factor}${vec3Latex(w)} = ${vec3Latex(ans)}$$`,
              `根据反交换律与数乘结合律：\n\n$$(${a}\\mathbf{v}) \\times (${b}\\mathbf{u}) = ${a * b}(\\mathbf{v} \\times \\mathbf{u}) = -${a * b}(\\mathbf{u} \\times \\mathbf{v}) = ${factor}${vec3Latex(w)} = ${vec3Latex(ans)}$$`,
            ),
          );
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
        "The cross product distributes over addition:\n\n$$\\mathbf{u} \\times (\\mathbf{v} + \\mathbf{w}) = \\mathbf{u} \\times \\mathbf{v} + \\mathbf{u} \\times \\mathbf{w}$$\n\n$$(\\mathbf{u} + \\mathbf{v}) \\times \\mathbf{w} = \\mathbf{u} \\times \\mathbf{w} + \\mathbf{v} \\times \\mathbf{w}$$\n\nNotice that $(\\mathbf{u} + a\\mathbf{v}) \\times (\\mathbf{u} + b\\mathbf{v}) = (b - a)(\\mathbf{u} \\times \\mathbf{v})$.",
        "向量叉积对加法满足分配律：\n\n$$\\mathbf{u} \\times (\\mathbf{v} + \\mathbf{w}) = \\mathbf{u} \\times \\mathbf{v} + \\mathbf{u} \\times \\mathbf{w}$$\n\n$$(\\mathbf{u} + \\mathbf{v}) \\times \\mathbf{w} = \\mathbf{u} \\times \\mathbf{w} + \\mathbf{v} \\times \\mathbf{w}$$\n\n注意 $(\\mathbf{u} + a\\mathbf{v}) \\times (\\mathbf{u} + b\\mathbf{v}) = (b - a)(\\mathbf{u} \\times \\mathbf{v})$。",
      ),
      generate(rng) {
        const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const b = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const c = rng.pick([-3, -2, -1, 1, 2, 3]);
        const d = rng.pick([-3, -2, -1, 1, 2, 3]);

        // (a u + b v) x (c u + d v) = (a*d - b*c) (u x v)
        const det = a * d - b * c;
        const right = `${det}(\\mathbf{u} \\times \\mathbf{v})`;
        const w1 = `${a * d + b * c}(\\mathbf{u} \\times \\mathbf{v})`;
        const w2 = `${-det}(\\mathbf{u} \\times \\mathbf{v})`;
        const w3 = `${a * c + b * d}(\\mathbf{u} \\times \\mathbf{v})`;
        const w4 = "\\mathbf{0}";

        const aStr = a === 1 ? "\\mathbf{u}" : a === -1 ? "-\\mathbf{u}" : `${a}\\mathbf{u}`;
        const bStr = b > 0 ? `+ ${b === 1 ? "" : b}\\mathbf{v}` : `- ${b === -1 ? "" : -b}\\mathbf{v}`;
        const cStr = c === 1 ? "\\mathbf{u}" : c === -1 ? "-\\mathbf{u}" : `${c}\\mathbf{u}`;
        const dStr = d > 0 ? `+ ${d === 1 ? "" : d}\\mathbf{v}` : `- ${d === -1 ? "" : -d}\\mathbf{v}`;

        return oneOf(
          rng,
          t(
            `Simplify the expression $(${aStr} ${bStr}) \\times (${cStr} ${dStr})$ in terms of $\\mathbf{u} \\times \\mathbf{v}$.`,
            `将表达式 $(${aStr} ${bStr}) \\times (${cStr} ${dStr})$ 化简为关于 $\\mathbf{u} \\times \\mathbf{v}$ 的形式。`,
          ),
          t(`$${right}$`, `$${right}$`),
          [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`), t(`$${w4}$`, `$${w4}$`)],
          t(
            `Expand using distributivity:\n\n$$(${aStr} ${bStr}) \\times (${cStr} ${dStr}) = (${a})(${c})(\\mathbf{u}\\times\\mathbf{u}) + (${a})(${d})(\\mathbf{u}\\times\\mathbf{v}) + (${b})(${c})(\\mathbf{v}\\times\\mathbf{u}) + (${b})(${d})(\\mathbf{v}\\times\\mathbf{v})$$\n\nSince $\\mathbf{u}\\times\\mathbf{u} = \\mathbf{v}\\times\\mathbf{v} = \\mathbf{0}$ and $\\mathbf{v}\\times\\mathbf{u} = -(\\mathbf{u}\\times\\mathbf{v})$:\n\n$$= (${a * d} - ${b * c})(\\mathbf{u} \\times \\mathbf{v}) = ${right}$$`,
            `利用分配律展开：\n\n$$(${aStr} ${bStr}) \\times (${cStr} ${dStr}) = (${a})(${c})(\\mathbf{u}\\times\\mathbf{u}) + (${a})(${d})(\\mathbf{u}\\times\\mathbf{v}) + (${b})(${c})(\\mathbf{v}\\times\\mathbf{u}) + (${b})(${d})(\\mathbf{v}\\times\\mathbf{v})$$\n\n由于 $\\mathbf{u}\\times\\mathbf{u} = \\mathbf{v}\\times\\mathbf{v} = \\mathbf{0}$ 且 $\\mathbf{v}\\times\\mathbf{u} = -(\\mathbf{u}\\times\\mathbf{v})$：\n\n$$= (${a * d} - ${b * c})(\\mathbf{u} \\times \\mathbf{v}) = ${right}$$`,
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
  encompasses: [{ topic: "properties-of-the-cross-product", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSN.VM.C.11"],
  knowledgePoints: [
    {
      id: "determinant-formula-for-cross-product",
      title: t("Determinant formula for cross product", "利用三阶行列式展开计算叉积"),
      explanation: t(
        "The cross product of $\\mathbf{u} = \\langle u_1, u_2, u_3 \\rangle$ and $\\mathbf{v} = \\langle v_1, v_2, v_3 \\rangle$ is calculated using the formal determinant:\n\n$$\\mathbf{u} \\times \\mathbf{v} = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ u_1 & u_2 & u_3 \\\\ v_1 & v_2 & v_3 \\end{vmatrix} = \\langle u_2 v_3 - u_3 v_2, \\; -(u_1 v_3 - u_3 v_1), \\; u_1 v_2 - u_2 v_1 \\rangle$$",
        "向量 $\\mathbf{u} = \\langle u_1, u_2, u_3 \\rangle$ 与 $\\mathbf{v} = \\langle v_1, v_2, v_3 \\rangle$ 的叉积可用形式三阶行列式计算：\n\n$$\\mathbf{u} \\times \\mathbf{v} = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ u_1 & u_2 & u_3 \\\\ v_1 & v_2 & v_3 \\end{vmatrix} = \\langle u_2 v_3 - u_3 v_2, \\; -(u_1 v_3 - u_3 v_1), \\; u_1 v_2 - u_2 v_1 \\rangle$$",
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

        return oneOf(
          rng,
          t(
            `Calculate the cross product $\\mathbf{u} \\times \\mathbf{v}$ for $\\mathbf{u} = ${vec3Latex(u)}$ and $\\mathbf{v} = ${vec3Latex(v)}$.`,
            `计算向量 $\\mathbf{u} = ${vec3Latex(u)}$ 与 $\\mathbf{v} = ${vec3Latex(v)}$ 的叉积 $\\mathbf{u} \\times \\mathbf{v}$。`,
          ),
          t(`$${vec3Latex(cp)}$`, `$${vec3Latex(cp)}$`),
          [
            t(`$${vec3Latex(opp)}$`, `$${vec3Latex(opp)}$`),
            t(`$${vec3Latex(signErrY)}$`, `$${vec3Latex(signErrY)}$`),
            t(`$${vec3Latex(swapErr)}$`, `$${vec3Latex(swapErr)}$`),
            t(`$${vec3Latex(offset1)}$`, `$${vec3Latex(offset1)}$`),
            t(`$${vec3Latex(offset2)}$`, `$${vec3Latex(offset2)}$`),
          ],
          t(
            `Expand along the first row:\n\n$$\\mathbf{u} \\times \\mathbf{v} = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ ${u[0]} & ${u[1]} & ${u[2]} \\\\ ${v[0]} & ${v[1]} & ${v[2]} \\end{vmatrix} = \\langle (${u[1]})(${v[2]}) - (${u[2]})(${v[1]}), \\; -((${u[0]})(${v[2]}) - (${u[2]})(${v[0]})), \\; (${u[0]})(${v[1]}) - (${u[1]})(${v[0]}) \\rangle = ${vec3Latex(cp)}$$`,
            `按第一行展开三阶行列式：\n\n$$\\mathbf{u} \\times \\mathbf{v} = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ ${u[0]} & ${u[1]} & ${u[2]} \\\\ ${v[0]} & ${v[1]} & ${v[2]} \\end{vmatrix} = \\langle (${u[1]})(${v[2]}) - (${u[2]})(${v[1]}), \\; -((${u[0]})(${v[2]}) - (${u[2]})(${v[0]})), \\; (${u[0]})(${v[1]}) - (${u[1]})(${v[0]}) \\rangle = ${vec3Latex(cp)}$$`,
          ),
        );
      },
    },
    {
      id: "finding-a-vector-orthogonal-to-two-vectors",
      title: t("Finding a vector orthogonal to two vectors", "求与已知两向量均正交的向量"),
      explanation: t(
        "A vector orthogonal (perpendicular) to both $\\mathbf{u}$ and $\\mathbf{v}$ can always be obtained by calculating their cross product $\\mathbf{u} \\times \\mathbf{v}$ (or any nonzero scalar multiple of it).",
        "求同时与 $\\mathbf{u}$ 和 $\\mathbf{v}$ 正交（垂直）的向量，可以通过计算它们的叉积 $\\mathbf{u} \\times \\mathbf{v}$（或其任意非零数乘倍数）得到。",
      ),
      generate(rng) {
        const u: Vec3 = [rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-3, -2, -1, 1, 2, 3])];
        const v: Vec3 = [rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-3, -2, -1, 1, 2, 3])];
        const cp = cross3(u, v);
        // Ensure cp is not zero
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
      explanation: t(
        "The area of the parallelogram spanned by adjacent vectors $\\mathbf{u}$ and $\\mathbf{v}$ equals the magnitude of their cross product:\n\n$$A = \\|\\mathbf{u} \\times \\mathbf{v}\\|$$",
        "以相邻向量 $\\mathbf{u}$ 与 $\\mathbf{v}$ 为邻边的平行四边形的面积等于两向量叉积的模长：\n\n$$A = \\|\\mathbf{u} \\times \\mathbf{v}\\|$$",
      ),
      generate(rng) {
        const uVec: Vec3 = [rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-2, -1, 0, 1, 2]), rng.pick([-2, -1, 0, 1, 2])];
        const vVec: Vec3 = [rng.pick([-2, -1, 0, 1, 2]), rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-2, -1, 0, 1, 2])];
        const cp = cross3(uVec, vVec);
        const sq = magSq3(cp);
        if (sq === 0) {
          // fallback
          return oneOf(
            rng,
            t(
              "Find the area of the parallelogram spanned by $\\mathbf{u} = \\langle 3, 0, 0 \\rangle$ and $\\mathbf{v} = \\langle 0, 4, 0 \\rangle$.",
              "求由向量 $\\mathbf{u} = \\langle 3, 0, 0 \\rangle$ 与 $\\mathbf{v} = \\langle 0, 4, 0 \\rangle$ 张成的平行四边形的面积。",
            ),
            t("$12$", "$12$"),
            [t("$6$", "$6$"), t("$7$", "$7$"), t("$24$", "$24$")],
            t(
              "$$\\|\\mathbf{u} \\times \\mathbf{v}\\| = \\|\\langle 0, 0, 12 \\rangle\\| = 12$$",
              "$$\\|\\mathbf{u} \\times \\mathbf{v}\\| = \\|\\langle 0, 0, 12 \\rangle\\| = 12$$",
            ),
          );
        }
        const right = sqrtLatex(sq);
        const w1 = sqrtLatex(sq + 3);
        const w2 = sqrtLatex(Math.max(1, sq - 4));
        const w3 = `${sq}`;
        const w4 = `\\frac{${right}}{2}`;

        return oneOf(
          rng,
          t(
            `Find the area of the parallelogram spanned by adjacent vectors $\\mathbf{u} = ${vec3Latex(uVec)}$ and $\\mathbf{v} = ${vec3Latex(vVec)}$.`,
            `求由相邻向量 $\\mathbf{u} = ${vec3Latex(uVec)}$ 与 $\\mathbf{v} = ${vec3Latex(vVec)}$ 张成的平行四边形的面积。`,
          ),
          t(`$${right}$`, `$${right}$`),
          [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`), t(`$${w4}$`, `$${w4}$`)],
          t(
            `First compute the cross product $\\mathbf{u} \\times \\mathbf{v} = ${vec3Latex(cp)}$.\n\nThe area is the magnitude:\n\n$$A = \\|\\mathbf{u} \\times \\mathbf{v}\\| = \\sqrt{(${cp[0]})^2 + (${cp[1]})^2 + (${cp[2]})^2} = \\sqrt{${sq}} = ${right}$$`,
            `首先计算叉积 $\\mathbf{u} \\times \\mathbf{v} = ${vec3Latex(cp)}$。\n\n面积等于其模长：\n\n$$A = \\|\\mathbf{u} \\times \\mathbf{v}\\| = \\sqrt{(${cp[0]})^2 + (${cp[1]})^2 + (${cp[2]})^2} = \\sqrt{${sq}} = ${right}$$`,
          ),
        );
      },
    },
    {
      id: "area-of-a-triangle-in-3d",
      title: t("Area of a triangle in 3D", "三维空间中三角形的面积"),
      explanation: t(
        "A triangle with vertices $A, B, C$ has area equal to half the area of the parallelogram formed by $\\vec{AB}$ and $\\vec{AC}$:\n\n$$A = \\frac{1}{2}\\|\\vec{AB} \\times \\vec{AC}\\|$$",
        "以 $A, B, C$ 为顶点的三角形的面积等于由 $\\vec{AB}$ 和 $\\vec{AC}$ 构成的平行四边形面积的一半：\n\n$$A = \\frac{1}{2}\\|\\vec{AB} \\times \\vec{AC}\\|$$",
      ),
      generate(rng) {
        const ax = rng.pick([-2, -1, 0, 1, 2]);
        const ay = rng.pick([-2, -1, 0, 1, 2]);
        const az = rng.pick([-2, -1, 0, 1, 2]);
        const A: Vec3 = [ax, ay, az];

        // Choose edge vectors AB and AC
        const u: Vec3 = [rng.pick([2, 4, 6]), 0, 0];
        const v: Vec3 = [0, rng.pick([2, 4, 6]), 0];
        const B = add3(A, u);
        const C = add3(A, v);
        const cp = cross3(u, v); // [0, 0, u[0]*v[1]]
        const mag = Math.abs(cp[2]);
        const area = mag / 2;

        const right = `${area}`;
        const w1 = `${mag}`; // forgot 1/2
        const w2 = `${area / 2}`;
        const w3 = `${area + 2}`;
        const w4 = `${Math.max(1, area - 3)}`;

        return oneOf(
          rng,
          t(
            `Find the area of the triangle with vertices $A(${A[0]}, ${A[1]}, ${A[2]})$, $B(${B[0]}, ${B[1]}, ${B[2]})$, and $C(${C[0]}, ${C[1]}, ${C[2]})$.`,
            `求空间中顶点为 $A(${A[0]}, ${A[1]}, ${A[2]})$、$B(${B[0]}, ${B[1]}, ${B[2]})$ 与 $C(${C[0]}, ${C[1]}, ${C[2]})$ 的三角形的面积。`,
          ),
          t(`$${right}$`, `$${right}$`),
          [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`), t(`$${w4}$`, `$${w4}$`)],
          t(
            `Form vectors $\\vec{AB} = ${vec3Latex(u)}$ and $\\vec{AC} = ${vec3Latex(v)}$.\n\nCompute the cross product:\n\n$$\\vec{AB} \\times \\vec{AC} = ${vec3Latex(cp)}$$\n\nThe area is:\n\n$$A = \\frac{1}{2}\\|\\vec{AB} \\times \\vec{AC}\\| = \\frac{1}{2}(${mag}) = ${right}$$`,
            `求向量 $\\vec{AB} = ${vec3Latex(u)}$ 及 $\\vec{AC} = ${vec3Latex(v)}$。\n\n计算叉积：\n\n$$\\vec{AB} \\times \\vec{AC} = ${vec3Latex(cp)}$$\n\n三角形面积为：\n\n$$A = \\frac{1}{2}\\|\\vec{AB} \\times \\vec{AC}\\| = \\frac{1}{2}(${mag}) = ${right}$$`,
          ),
        );
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
        "The scalar triple product of three vectors $\\mathbf{u}, \\mathbf{v}, \\mathbf{w}$ is defined as $\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})$ and equals the $3\\times 3$ determinant:\n\n$$\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w}) = \\begin{vmatrix} u_1 & u_2 & u_3 \\\\ v_1 & v_2 & v_3 \\\\ w_1 & w_2 & w_3 \\end{vmatrix}$$",
        "三向量 $\\mathbf{u}, \\mathbf{v}, \\mathbf{w}$ 的标量三重积（混合积）定义为 $\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})$，其值等于相应的三阶行列式：\n\n$$\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w}) = \\begin{vmatrix} u_1 & u_2 & u_3 \\\\ v_1 & v_2 & v_3 \\\\ w_1 & w_2 & w_3 \\end{vmatrix}$$",
      ),
      generate(rng) {
        const u: Vec3 = [rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-3, -2, -1, 1, 2, 3])];
        const v: Vec3 = [rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-3, -2, -1, 1, 2, 3])];
        const w: Vec3 = [rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-3, -2, -1, 1, 2, 3])];

        const ans = det3(u, v, w);
        const w1 = -ans;
        const w2 = ans + 6;
        const w3 = ans - 5;
        const w4 = ans + 2;
        const w5 = ans - 3;

        return oneOf(
          rng,
          t(
            `Compute the scalar triple product $\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})$ for $\\mathbf{u} = ${vec3Latex(u)}$, $\\mathbf{v} = ${vec3Latex(v)}$, and $\\mathbf{w} = ${vec3Latex(w)}$.`,
            `计算向量 $\\mathbf{u} = ${vec3Latex(u)}$、$\\mathbf{v} = ${vec3Latex(v)}$ 与 $\\mathbf{w} = ${vec3Latex(w)}$ 的混合积 $\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})$。`,
          ),
          t(`$${ans}$`, `$${ans}$`),
          [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`), t(`$${w4}$`, `$${w4}$`), t(`$${w5}$`, `$${w5}$`)],
          t(
            `$$\\begin{vmatrix} ${u[0]} & ${u[1]} & ${u[2]} \\\\ ${v[0]} & ${v[1]} & ${v[2]} \\\\ ${w[0]} & ${w[1]} & ${w[2]} \\end{vmatrix} = ${u[0]}(${v[1] * w[2] - v[2] * w[1]}) - (${u[1]})(${v[0] * w[2] - v[2] * w[0]}) + (${u[2]})(${v[0] * w[1] - v[1] * w[0]}) = ${ans}$$`,
            `$$\\begin{vmatrix} ${u[0]} & ${u[1]} & ${u[2]} \\\\ ${v[0]} & ${v[1]} & ${v[2]} \\\\ ${w[0]} & ${w[1]} & ${w[2]} \\end{vmatrix} = ${u[0]}(${v[1] * w[2] - v[2] * w[1]}) - (${u[1]})(${v[0] * w[2] - v[2] * w[0]}) + (${u[2]})(${v[0] * w[1] - v[1] * w[0]}) = ${ans}$$`,
          ),
        );
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
        // Choose u and v
        const u: Vec3 = [rng.pick([1, 2, 3]), rng.pick([-2, -1, 1, 2]), rng.pick([-2, -1, 1, 2])];
        const v: Vec3 = [rng.pick([-2, -1, 1, 2]), rng.pick([1, 2, 3]), rng.pick([-2, -1, 1, 2])];
        const a = rng.pick([-2, -1, 1, 2]);
        const b = rng.pick([-2, -1, 1, 2]);
        const wCop: Vec3 = add3(smul3(a, u), smul3(b, v));
        const ansK = wCop[2];

        const wPrompt = `\\langle ${wCop[0]}, ${wCop[1]}, k \\rangle`;
        const right = `${ansK}`;
        const w1 = `${-ansK}`;
        const w2 = `${ansK + 1}`;
        const w3 = `${ansK - 2}`;
        const w4 = `${ansK + 3}`;
        const w5 = `${ansK - 3}`;

        return oneOf(
          rng,
          t(
            `Find the value of $k$ such that the vectors $\\mathbf{u} = ${vec3Latex(u)}$, $\\mathbf{v} = ${vec3Latex(v)}$, and $\\mathbf{w} = ${wPrompt}$ are coplanar.`,
            `求实数 $k$ 的值，使得向量 $\\mathbf{u} = ${vec3Latex(u)}$、$\\mathbf{v} = ${vec3Latex(v)}$ 与 $\\mathbf{w} = ${wPrompt}$ 共面。`,
          ),
          t(`$${right}$`, `$${right}$`),
          [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`), t(`$${w4}$`, `$${w4}$`), t(`$${w5}$`, `$${w5}$`)],
          t(
            `Three vectors are coplanar if and only if their determinant is zero:\n\n$$\\begin{vmatrix} ${u[0]} & ${u[1]} & ${u[2]} \\\\ ${v[0]} & ${v[1]} & ${v[2]} \\\\ ${wCop[0]} & ${wCop[1]} & k \\end{vmatrix} = 0 \\implies k = ${ansK}$$`,
            `三个向量共面当且仅当它们构成的行列式为零：\n\n$$\\begin{vmatrix} ${u[0]} & ${u[1]} & ${u[2]} \\\\ ${v[0]} & ${v[1]} & ${v[2]} \\\\ ${wCop[0]} & ${wCop[1]} & k \\end{vmatrix} = 0 \\implies k = ${ansK}$$`,
          ),
        );
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

        const right = `${V}`;
        const w1 = `${V * 2}`;
        const w2 = `${Math.max(1, V - 3)}`;
        const w3 = `${V + 4}`;
        const w4 = `${Math.round(V / 2)}`;

        return oneOf(
          rng,
          t(
            `Find the volume of the parallelepiped determined by the vectors $\\mathbf{u} = ${vec3Latex(u)}$, $\\mathbf{v} = ${vec3Latex(v)}$, and $\\mathbf{w} = ${vec3Latex(w)}$.`,
            `求由向量 $\\mathbf{u} = ${vec3Latex(u)}$、$\\mathbf{v} = ${vec3Latex(v)}$ 与 $\\mathbf{w} = ${vec3Latex(w)}$ 确定的平行六面体的体积。`,
          ),
          t(`$${right}$`, `$${right}$`),
          [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`), t(`$${w4}$`, `$${w4}$`)],
          t(
            `The volume is the absolute value of the scalar triple product:\n\n$$V = |\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})| = \\left| \\begin{vmatrix} ${u[0]} & ${u[1]} & ${u[2]} \\\\ ${v[0]} & ${v[1]} & ${v[2]} \\\\ ${w[0]} & ${w[1]} & ${w[2]} \\end{vmatrix} \\right| = |${d}| = ${right}$$`,
            `体积等于混合积的绝对值：\n\n$$V = |\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})| = \\left| \\begin{vmatrix} ${u[0]} & ${u[1]} & ${u[2]} \\\\ ${v[0]} & ${v[1]} & ${v[2]} \\\\ ${w[0]} & ${w[1]} & ${w[2]} \\end{vmatrix} \\right| = |${d}| = ${right}$$`,
          ),
        );
      },
    },
    {
      id: "volume-of-a-parallelepiped-from-vertices",
      title: t("Volume of a parallelepiped from vertices", "由顶点坐标计算平行六面体体积"),
      explanation: t(
        "If a parallelepiped has a vertex $A$ with three adjacent vertices $B, C, D$, its volume is:\n\n$$V = |\\vec{AB} \\cdot (\\vec{AC} \\times \\vec{AD})|$$",
        "若平行六面体的一个顶点为 $A$，且与之相邻的三个顶点为 $B, C, D$，则其体积为：\n\n$$V = |\\vec{AB} \\cdot (\\vec{AC} \\times \\vec{AD})|$$",
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
        const right = `${V}`;
        const w1 = `${V * 2}`;
        const w2 = `${Math.max(1, V - 2)}`;
        const w3 = `${V + 3}`;
        const w4 = `${Math.round(V / 3)}`;

        return oneOf(
          rng,
          t(
            `Find the volume of the parallelepiped with vertex $A(${A[0]}, ${A[1]}, ${A[2]})$ and adjacent vertices $B(${B[0]}, ${B[1]}, ${B[2]})$, $C(${C[0]}, ${C[1]}, ${C[2]})$, and $D(${D[0]}, ${D[1]}, ${D[2]})$.`,
            `求以 $A(${A[0]}, ${A[1]}, ${A[2]})$ 为顶点，且与之相邻的三个顶点为 $B(${B[0]}, ${B[1]}, ${B[2]})$、$C(${C[0]}, ${C[1]}, ${C[2]})$ 与 $D(${D[0]}, ${D[1]}, ${D[2]})$ 的平行六面体的体积。`,
          ),
          t(`$${right}$`, `$${right}$`),
          [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`), t(`$${w4}$`, `$${w4}$`)],
          t(
            `Form edge vectors $\\vec{AB} = ${vec3Latex(u)}$, $\\vec{AC} = ${vec3Latex(v)}$, $\\vec{AD} = ${vec3Latex(w)}$.\n\nThen evaluate the determinant:\n\n$$V = |\\vec{AB} \\cdot (\\vec{AC} \\times \\vec{AD})| = ${right}$$`,
            `求棱向量 $\\vec{AB} = ${vec3Latex(u)}$、$\\vec{AC} = ${vec3Latex(v)}$ 与 $\\vec{AD} = ${vec3Latex(w)}$。\n\n计算行列式绝对值：\n\n$$V = |\\vec{AB} \\cdot (\\vec{AC} \\times \\vec{AD})| = ${right}$$`,
          ),
        );
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
      explanation: t(
        "A tetrahedron (triangular pyramid) spanned by three vectors $\\mathbf{u}, \\mathbf{v}, \\mathbf{w}$ has volume equal to $\\frac{1}{6}$ of the volume of the corresponding parallelepiped:\n\n$$V = \\frac{1}{6}|\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})| = \\frac{1}{6}\\left| \\det[\\mathbf{u}, \\mathbf{v}, \\mathbf{w}] \\right|$$",
        "由三个向量 $\\mathbf{u}, \\mathbf{v}, \\mathbf{w}$ 确定的四面体（三棱锥）的体积等于相应平行六面体体积的 $\\frac{1}{6}$：\n\n$$V = \\frac{1}{6}|\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})| = \\frac{1}{6}\\left| \\det[\\mathbf{u}, \\mathbf{v}, \\mathbf{w}] \\right|$$",
      ),
      generate(rng) {
        // Engineer so det is divisible by 6
        const k = rng.pick([1, 2, 3, 4, 5, 6]);
        const u: Vec3 = [rng.pick([1, 2, 3]), 0, 0];
        const v: Vec3 = [0, rng.pick([1, 2, 3]), 0];
        const wZ = (6 * k) / (u[0] * v[1]);
        const w: Vec3 = [rng.pick([0, 1]), rng.pick([0, 1]), wZ];

        const detVal = Math.round(Math.abs(det3(u, v, w)));
        const V = Math.round(detVal / 6);

        const right = `${V}`;
        const w1 = `${detVal}`; // forgot 1/6
        const w2 = `${Math.round(detVal / 3)}`; // used pyramid 1/3
        const w3 = `${Math.round(detVal / 2)}`;
        const w4 = `${V + 2}`;

        return oneOf(
          rng,
          t(
            `Find the volume of the tetrahedron determined by the edge vectors $\\mathbf{u} = ${vec3Latex(u)}$, $\\mathbf{v} = ${vec3Latex(v)}$, and $\\mathbf{w} = ${vec3Latex(w)}$.`,
            `求由棱向量 $\\mathbf{u} = ${vec3Latex(u)}$、$\\mathbf{v} = ${vec3Latex(v)}$ 与 $\\mathbf{w} = ${vec3Latex(w)}$ 确定的四面体的体积。`,
          ),
          t(`$${right}$`, `$${right}$`),
          [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`), t(`$${w4}$`, `$${w4}$`)],
          t(
            `The volume of a tetrahedron is $\\frac{1}{6}$ of the scalar triple product:\n\n$$V = \\frac{1}{6}|\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})| = \\frac{1}{6}(${detVal}) = ${right}$$`,
            `四面体的体积为标量三重积绝对值的 $\\frac{1}{6}$：\n\n$$V = \\frac{1}{6}|\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})| = \\frac{1}{6}(${detVal}) = ${right}$$`,
          ),
        );
      },
    },
    {
      id: "volume-of-a-pyramid-with-parallelogram-base",
      title: t("Volume of a pyramid with parallelogram base", "平行四边形底棱锥的体积"),
      explanation: t(
        "A pyramid whose base is a parallelogram spanned by $\\mathbf{u}$ and $\\mathbf{v}$, and whose apex is located by vector $\\mathbf{w}$ from the same corner, has volume:\n\n$$V = \\frac{1}{3}\\times \\text{Base Area} \\times \\text{Height} = \\frac{1}{3}|\\mathbf{w} \\cdot (\\mathbf{u} \\times \\mathbf{v})|$$",
        "底面为由 $\\mathbf{u}$ 与 $\\mathbf{v}$ 张成的平行四边形，且从同一起点指向顶点的向量为 $\\mathbf{w}$ 的四棱锥，其体积为：\n\n$$V = \\frac{1}{3}\\times \\text{底面积} \\times \\text{高} = \\frac{1}{3}|\\mathbf{w} \\cdot (\\mathbf{u} \\times \\mathbf{v})|$$",
      ),
      generate(rng) {
        // Engineer so det is divisible by 3
        const k = rng.pick([1, 2, 3, 4, 5, 6, 7]);
        const u: Vec3 = [rng.pick([1, 2, 3]), 0, 0];
        const v: Vec3 = [0, rng.pick([1, 2, 3]), 0];
        const wZ = (3 * k) / (u[0] * v[1]);
        const w: Vec3 = [rng.pick([0, 1]), rng.pick([0, 1]), wZ];

        const detVal = Math.round(Math.abs(det3(u, v, w)));
        const V = Math.round(detVal / 3);

        const right = `${V}`;
        const w1 = `${detVal}`; // forgot 1/3
        const w2 = `${Math.round(detVal / 6)}`; // used tetrahedron 1/6
        const w3 = `${V + 2}`;
        const w4 = `${Math.max(1, V - 2)}`;

        return oneOf(
          rng,
          t(
            `Find the volume of a pyramid whose base is a parallelogram spanned by $\\mathbf{u} = ${vec3Latex(u)}$ and $\\mathbf{v} = ${vec3Latex(v)}$, and whose apex is defined by vector $\\mathbf{w} = ${vec3Latex(w)}$ from the same origin.`,
            `一个四棱锥的底面是由 $\\mathbf{u} = ${vec3Latex(u)}$ 与 $\\mathbf{v} = ${vec3Latex(v)}$ 张成的平行四边形，从同一起点指向顶点的向量为 $\\mathbf{w} = ${vec3Latex(w)}$。求该棱锥的体积。`,
          ),
          t(`$${right}$`, `$${right}$`),
          [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`), t(`$${w4}$`, `$${w4}$`)],
          t(
            `The volume of a pyramid with a parallelogram base is $\\frac{1}{3}$ of the parallelepiped volume:\n\n$$V = \\frac{1}{3}|\\mathbf{w} \\cdot (\\mathbf{u} \\times \\mathbf{v})| = \\frac{1}{3}(${detVal}) = ${right}$$`,
            `底面为平行四边形的棱锥体积是相应平行六面体体积的 $\\frac{1}{3}$：\n\n$$V = \\frac{1}{3}|\\mathbf{w} \\cdot (\\mathbf{u} \\times \\mathbf{v})| = \\frac{1}{3}(${detVal}) = ${right}$$`,
          ),
        );
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
