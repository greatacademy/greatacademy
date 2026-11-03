import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { paren, poly, Q, type RealSet } from "@ga/subject-math";

import {
  choiceProblem,
  equationProblem,
  expressionProblem,
  intervalProblem,
  numberProblem,
  pointProblem,
  steps,
  vectorLatex,
} from "../problems.ts";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type Vec3 = readonly [number, number, number];

const dot3 = (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const v3L = (v: readonly (number | Q)[]): string => vectorLatex(v);

/** pickChoice builds a multiple choice problem with options shuffled. */
function pickChoice(rng: Rng, prompt: Text, right: Text, wrong: readonly Text[], solution: Text): Problem {
  const options = rng.shuffle([right, ...wrong]);
  const correct = options.indexOf(right);
  return choiceProblem({ prompt, options, correct, solution });
}

/** pythagoreanTriples are integer right triangles used to yield nice integer or rational magnitudes. */
const pythagoreanTriples: readonly (readonly [number, number, number])[] = [
  [3, 4, 5],
  [4, 3, 5],
  [6, 8, 10],
  [8, 6, 10],
  [5, 12, 13],
  [12, 5, 13],
  [9, 12, 15],
  [12, 9, 15],
  [8, 15, 17],
  [15, 8, 17],
  [7, 24, 25],
  [24, 7, 25],
];

// ---------------------------------------------------------------------------
// 1.1 Vector-Valued Functions
// ---------------------------------------------------------------------------

/** theDomainOfAVectorValuedFunction finds the domain of a vector-valued function. */
export const theDomainOfAVectorValuedFunction: TopicDef = {
  id: "the-domain-of-a-vector-valued-function",
  title: t("The Domain of a Vector-Valued Function", "向量值函数的定义域"),
  summary: t(
    "The domain of a vector-valued function is the intersection of the domains of its component functions.",
    "向量值函数的定义域是其所有分量函数定义域的交集。",
  ),
  prerequisites: ["defining-vector-valued-functions", "describing-sets-using-set-builder-notation"],
  encompasses: [{ topic: "defining-vector-valued-functions", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "finding-the-domain-of-a-vector-valued-function",
      title: t("Finding the domain of a vector-valued function", "求向量值函数的定义域"),
      explanation: t(
        "For a vector-valued function $\\mathbf{r}(t) = \\langle f(t), g(t), h(t) \\rangle$, a value of $t$ is in the domain if and only if each component function $f(t)$, $g(t)$, and $h(t)$ is defined at $t$. Thus, the domain is the intersection:\n\n$$\\operatorname{Dom}(\\mathbf{r}) = \\operatorname{Dom}(f) \\cap \\operatorname{Dom}(g) \\cap \\operatorname{Dom}(h).$$",
        "对于向量值函数 $\\mathbf{r}(t) = \\langle f(t), g(t), h(t) \\rangle$，$t$ 属于定义域当且仅当每个分量函数 $f(t)$、$g(t)$ 和 $h(t)$ 在 $t$ 处均有定义。因此其定义域为各分量定义域的交集：\n\n$$\\operatorname{Dom}(\\mathbf{r}) = \\operatorname{Dom}(f) \\cap \\operatorname{Dom}(g) \\cap \\operatorname{Dom}(h)。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-8, -1);
        const b = rng.int(1, 8);
        const c = rng.pick([rng.int(b + 1, b + 5), rng.int(a - 5, a - 1)]);
        const set: RealSet = [{ lo: Q.of(a), hi: Q.of(b), loClosed: true, hiClosed: true }];
        const prompt = t(
          `Find the domain of the vector-valued function $\\mathbf{r}(t) = \\left\\langle \\sqrt{${poly([1, "t"], [-a, ""])}}, \\sqrt{${poly([-1, "t"], [b, ""])}}, \\frac{1}{${poly([1, "t"], [-c, ""])}} \\right\\rangle$ in interval notation.`,
          `用区间记号求向量值函数 $\\mathbf{r}(t) = \\left\\langle \\sqrt{${poly([1, "t"], [-a, ""])}}, \\sqrt{${poly([-1, "t"], [b, ""])}}, \\frac{1}{${poly([1, "t"], [-c, ""])}} \\right\\rangle$ 的定义域。`,
        );
        const solution = t(
          steps(
            `The first component requires $${poly([1, "t"], [-a, ""])} \\ge 0 \\implies t \\ge ${a}$.`,
            `The second component requires $${poly([-1, "t"], [b, ""])} \\ge 0 \\implies t \\le ${b}$.`,
            `The third component requires $t \\ne ${c}$, which is automatically satisfied since $${c}$ is outside $[${a}, ${b}]$.`,
            `Intersecting the domains gives $[${a}, ${b}]$.`,
          ),
          steps(
            `第一分量要求 $${poly([1, "t"], [-a, ""])} \\ge 0 \\implies t \\ge ${a}$。`,
            `第二分量要求 $${poly([-1, "t"], [b, ""])} \\ge 0 \\implies t \\le ${b}$。`,
            `第三分量要求 $t \\ne ${c}$，由于 $${c}$ 在区间 $[${a}, ${b}]$ 之外，该条件自然满足。`,
            `求交集得到定义域为 $[${a}, ${b}]$。`,
          ),
        );
        return intervalProblem({
          prompt,
          solution,
          set,
          form: "interval",
          wrong: [
            [{ lo: Q.of(a), hi: Q.of(b), loClosed: false, hiClosed: false }],
            [{ lo: Q.of(a), hi: Q.of(b), loClosed: true, hiClosed: false }],
            [{ lo: Q.of(a), hi: Q.of(b), loClosed: false, hiClosed: true }],
            [{ lo: Q.of(a), loClosed: true, hiClosed: false }],
          ],
        });
      },
    },
  ],
};

/** continuityAndDifferentiabilityOfVectorValuedFunctions explores continuity and differentiability componentwise. */
export const continuityAndDifferentiabilityOfVectorValuedFunctions: TopicDef = {
  id: "continuity-and-differentiability-of-vector-valued-functions",
  title: t("Continuity and Differentiability of Vector-Valued Functions", "向量值函数的连续性与可微性"),
  summary: t(
    "A vector-valued function is continuous or differentiable at a point if and only if each of its component functions is continuous or differentiable at that point.",
    "向量值函数在某点连续或可微，当且仅当其每一个分量函数在该点连续或可微。",
  ),
  prerequisites: ["defining-vector-valued-functions", "defining-continuity-at-a-point"],
  encompasses: [{ topic: "defining-vector-valued-functions", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "identifying-points-of-discontinuity-or-non-differentiability",
      title: t("Identifying points of non-differentiability", "识别不可微点"),
      explanation: t(
        "A vector-valued function $\\mathbf{r}(t) = \\langle x(t), y(t), z(t) \\rangle$ fails to be differentiable at $t_0$ whenever at least one of its component functions is not differentiable at $t_0$. Common causes include sharp corners (such as $|t - c|$ at $t = c$) or vertical tangents.",
        "当向量值函数 $\\mathbf{r}(t) = \\langle x(t), y(t), z(t) \\rangle$ 的至少一个分量函数在 $t_0$ 处不可微时，该向量值函数在 $t_0$ 处不可微。常见情形包括绝对值折点（如 $|t - c|$ 在 $t = c$ 处）或垂直切线。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.nonZero(-10, 10);
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-4, 4);
        const prompt = t(
          `Find the value of $t$ at which the vector-valued function $\\mathbf{r}(t) = \\left\\langle ${poly([a, "t^2"])}, |${poly([1, "t"], [-c, ""])}|, ${poly([b, "t"], [1, ""])} \\right\\rangle$ fails to be differentiable.`,
          `求向量值函数 $\\mathbf{r}(t) = \\left\\langle ${poly([a, "t^2"])}, |${poly([1, "t"], [-c, ""])}|, ${poly([b, "t"], [1, ""])} \\right\\rangle$ 不可微的 $t$ 值。`,
        );
        const solution = t(
          steps(
            `The components $x(t) = ${poly([a, "t^2"])}$ and $z(t) = ${poly([b, "t"], [1, ""])}$ are polynomials and are differentiable everywhere.`,
            `The second component $y(t) = |${poly([1, "t"], [-c, ""])}|$ has a corner at $t = ${c}$, where its left derivative is $-1$ and right derivative is $1$.`,
            `Therefore, $\\mathbf{r}(t)$ fails to be differentiable at $t = ${c}$.`,
          ),
          steps(
            `分量 $x(t) = ${poly([a, "t^2"])}$ 与 $z(t) = ${poly([b, "t"], [1, ""])}$ 为多项式，处处可微。`,
            `第二分量 $y(t) = |${poly([1, "t"], [-c, ""])}|$ 在 $t = ${c}$ 处具有折点，其左导数为 $-1$，右导数为 $1$。`,
            `因此，$\\mathbf{r}(t)$ 在 $t = ${c}$ 处不可微。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: c,
          wrong: [-c, 0, c + 1, c - 1],
        });
      },
    },
  ],
};

/** differentiationRulesForVectorValuedFunctions covers dot and cross product rules. */
export const differentiationRulesForVectorValuedFunctions: TopicDef = {
  id: "differentiation-rules-for-vector-valued-functions",
  title: t("Differentiation Rules for Vector-Valued Functions", "向量值函数的求导法则"),
  summary: t(
    "Vector-valued functions satisfy sum, scalar multiple, dot product, and cross product differentiation rules.",
    "向量值函数满足和、数乘、点积以及叉积的求导法则。",
  ),
  prerequisites: ["differentiating-vector-valued-functions", "the-cross-product-of-two-vectors"],
  encompasses: [{ topic: "differentiating-vector-valued-functions", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "derivative-of-dot-and-cross-products",
      title: t("Derivative of dot and cross products", "点积与叉积的导数"),
      explanation: t(
        "For differentiable vector-valued functions $\\mathbf{u}(t)$ and $\\mathbf{v}(t)$:\n\n1. Product Rule for Dot Product:\n$$\\frac{d}{dt}[\\mathbf{u}(t) \\cdot \\mathbf{v}(t)] = \\mathbf{u}'(t) \\cdot \\mathbf{v}(t) + \\mathbf{u}(t) \\cdot \\mathbf{v}'(t).$$\n\n2. Product Rule for Cross Product:\n$$\\frac{d}{dt}[\\mathbf{u}(t) \\times \\mathbf{v}(t)] = \\mathbf{u}'(t) \\times \\mathbf{v}(t) + \\mathbf{u}(t) \\times \\mathbf{v}'(t).$$",
        "对于可微向量值函数 $\\mathbf{u}(t)$ 和 $\\mathbf{v}(t)$：\n\n1. 点积乘积法则：\n$$\\frac{d}{dt}[\\mathbf{u}(t) \\cdot \\mathbf{v}(t)] = \\mathbf{u}'(t) \\cdot \\mathbf{v}(t) + \\mathbf{u}(t) \\cdot \\mathbf{v}'(t)。$$\n\n2. 叉积乘积法则：\n$$\\frac{d}{dt}[\\mathbf{u}(t) \\times \\mathbf{v}(t)] = \\mathbf{u}'(t) \\times \\mathbf{v}(t) + \\mathbf{u}(t) \\times \\mathbf{v}'(t)。$$",
      ),
      generate(rng: Rng): Problem {
        const u: Vec3 = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
        const up: Vec3 = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
        const v: Vec3 = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
        const vp: Vec3 = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
        const t0 = rng.int(1, 4);

        const ans = dot3(up, v) + dot3(u, vp);
        const prompt = t(
          `Suppose $\\mathbf{u}(${t0}) = ${v3L(u)}$, $\\mathbf{u}'(${t0}) = ${v3L(up)}$, $\\mathbf{v}(${t0}) = ${v3L(v)}$, and $\\mathbf{v}'(${t0}) = ${v3L(vp)}$. Find $\\left.\\frac{d}{dt}\\left[\\mathbf{u}(t) \\cdot \\mathbf{v}(t)\\right]\\right|_{t=${t0}}$.`,
          `已知 $\\mathbf{u}(${t0}) = ${v3L(u)}$、$\\mathbf{u}'(${t0}) = ${v3L(up)}$、$\\mathbf{v}(${t0}) = ${v3L(v)}$、$\\mathbf{v}'(${t0}) = ${v3L(vp)}$。求 $\\left.\\frac{d}{dt}\\left[\\mathbf{u}(t) \\cdot \\mathbf{v}(t)\\right]\\right|_{t=${t0}}$ 的值。`,
        );
        const solution = t(
          steps(
            `Apply the product rule for dot products: $\\frac{d}{dt}[\\mathbf{u} \\cdot \\mathbf{v}] = \\mathbf{u}' \\cdot \\mathbf{v} + \\mathbf{u} \\cdot \\mathbf{v}'$.`,
            `Compute $\\mathbf{u}'(${t0}) \\cdot \\mathbf{v}(${t0}) = (${up[0]})(${v[0]}) + (${up[1]})(${v[1]}) + (${up[2]})(${v[2]}) = ${dot3(up, v)}$.`,
            `Compute $\\mathbf{u}(${t0}) \\cdot \\mathbf{v}'(${t0}) = (${u[0]})(${vp[0]}) + (${u[1]})(${vp[1]}) + (${u[2]})(${vp[2]}) = ${dot3(u, vp)}$.`,
            `Add the terms: $${dot3(up, v)} + (${dot3(u, vp)}) = ${ans}$.`,
          ),
          steps(
            `应用点积求导法则：$\\frac{d}{dt}[\\mathbf{u} \\cdot \\mathbf{v}] = \\mathbf{u}' \\cdot \\mathbf{v} + \\mathbf{u} \\cdot \\mathbf{v}'$。`,
            `计算 $\\mathbf{u}'(${t0}) \\cdot \\mathbf{v}(${t0}) = (${up[0]})(${v[0]}) + (${up[1]})(${v[1]}) + (${up[2]})(${v[2]}) = ${dot3(up, v)}$。`,
            `计算 $\\mathbf{u}(${t0}) \\cdot \\mathbf{v}'(${t0}) = (${u[0]})(${vp[0]}) + (${u[1]})(${vp[1]}) + (${u[2]})(${vp[2]}) = ${dot3(u, vp)}$。`,
            `相加得：$${dot3(up, v)} + (${dot3(u, vp)}) = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [dot3(up, vp), dot3(u, v), dot3(up, v) - dot3(u, vp)],
        });
      },
    },
  ],
};

/** integrationRulesForVectorValuedFunctions computes definite integrals of vector functions. */
export const integrationRulesForVectorValuedFunctions: TopicDef = {
  id: "integration-rules-for-vector-valued-functions",
  title: t("Integration Rules for Vector-Valued Functions", "向量值函数的积分法则"),
  summary: t(
    "Integrals of vector-valued functions are computed componentwise and satisfy linearity.",
    "向量值函数的积分按分量逐项计算，并满足线性性质。",
  ),
  prerequisites: ["integrating-vector-valued-functions"],
  encompasses: [{ topic: "integrating-vector-valued-functions", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-definite-integrals-of-vector-functions",
      title: t("Evaluating definite integrals of vector functions", "计算向量值函数的定积分"),
      explanation: t(
        "Each component is an ordinary function of the parameter, so integrate each one over the interval and collect the results as a vector. The definite integral of a vector-valued function is evaluated component by component:\n\n$$\\int_a^b \\mathbf{r}(t)\\,dt = \\left\\langle \\int_a^b x(t)\\,dt, \\int_a^b y(t)\\,dt, \\int_a^b z(t)\\,dt \\right\\rangle.$$",
        "每个分量都是参数的普通函数，所以把每个分量在区间上积分，再把结果组成一个向量。向量值函数的定积分逐个分量分别进行积分计算：\n\n$$\\int_a^b \\mathbf{r}(t)\\,dt = \\left\\langle \\int_a^b x(t)\\,dt, \\int_a^b y(t)\\,dt, \\int_a^b z(t)\\,dt \\right\\rangle。$$",
      ),
      generate(rng: Rng): Problem {
        const aCoeff = rng.pick([2, 4, 6, 8, 10]);
        const bCoeff = rng.pick([3, 6, 9, 12]);
        const cCoeff = rng.int(1, 8);
        const k = rng.int(1, 4);

        const intX = (aCoeff * k * k) / 2;
        const intY = (bCoeff * k * k * k) / 3;
        const intZ = cCoeff * k;
        const answer: Vec3 = [intX, intY, intZ];

        const prompt = t(
          `Evaluate the definite integral $\\int_{0}^{${k}} \\left\\langle ${poly([aCoeff, "t"])}, ${poly([bCoeff, "t^2"])}, ${cCoeff} \\right\\rangle dt$. Express your answer as a vector $\\langle x, y, z \\rangle$.`,
          `计算定积分 $\\int_{0}^{${k}} \\left\\langle ${poly([aCoeff, "t"])}, ${poly([bCoeff, "t^2"])}, ${cCoeff} \\right\\rangle dt$。结果以向量 $\\langle x, y, z \\rangle$ 表示。`,
        );
        const solution = t(
          steps(
            `Integrate each component from $0$ to $${k}$:\n\n` +
              `$$\\int_{0}^{${k}} ${poly([aCoeff, "t"])}\\,dt = \\left[ ${poly([aCoeff / 2, "t^2"])} \\right]_{0}^{${k}} = ${intX}$$`,
            `$$\\int_{0}^{${k}} ${poly([bCoeff, "t^2"])}\\,dt = \\left[ ${poly([bCoeff / 3, "t^3"])} \\right]_{0}^{${k}} = ${intY}$$`,
            `$$\\int_{0}^{${k}} ${cCoeff}\\,dt = \\left[ ${poly([cCoeff, "t"])} \\right]_{0}^{${k}} = ${intZ}$$`,
            `Combine the components to get the vector $${v3L(answer)}$.`,
          ),
          steps(
            `对每个分量在 $0$ 到 $${k}$ 上积分：\n\n` +
              `$$\\int_{0}^{${k}} ${poly([aCoeff, "t"])}\\,dt = \\left[ ${poly([aCoeff / 2, "t^2"])} \\right]_{0}^{${k}} = ${intX}$$`,
            `$$\\int_{0}^{${k}} ${poly([bCoeff, "t^2"])}\\,dt = \\left[ ${poly([bCoeff / 3, "t^3"])} \\right]_{0}^{${k}} = ${intY}$$`,
            `$$\\int_{0}^{${k}} ${cCoeff}\\,dt = \\left[ ${poly([cCoeff, "t"])} \\right]_{0}^{${k}} = ${intZ}$$`,
            `合并各分量得到向量 $${v3L(answer)}$。`,
          ),
        );
        return pointProblem({
          prompt,
          solution,
          answer,
          vector: true,
          vars: ["x", "y", "z"],
          wrong: [
            [aCoeff * k, bCoeff * k * k, cCoeff],
            [intY, intX, intZ],
            [intX, intY, 0],
          ],
        });
      },
    },
  ],
};

/** theArcLengthOfAVectorValuedFunction calculates the arc length of a space curve. */
export const theArcLengthOfAVectorValuedFunction: TopicDef = {
  id: "the-arc-length-of-a-vector-valued-function",
  title: t("The Arc Length of a Vector-Valued Function", "向量值函数的弧长"),
  summary: t(
    "The arc length of a space curve r(t) from t = a to t = b is the integral of speed: L = ∫ ||r'(t)|| dt.",
    "空间曲线 r(t) 从 t = a 到 t = b 的弧长是速率的积分：L = ∫ ||r'(t)|| dt。",
  ),
  prerequisites: ["differentiating-vector-valued-functions", "the-arc-length-of-a-planar-curve"],
  encompasses: [{ topic: "the-arc-length-of-a-planar-curve", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-arc-length-of-a-space-curve",
      title: t("Computing the arc length of a space curve", "计算空间曲线的弧长"),
      explanation: t(
        "The speed is the length of the velocity vector, and integrating the speed over the time interval adds up the distance travelled along the curve. For a smooth space curve $\\mathbf{r}(t) = \\langle x(t), y(t), z(t) \\rangle$, the arc length from $t = a$ to $t = b$ is given by:\n\n$$L = \\int_a^b \\|\\mathbf{r}'(t)\\|\\,dt = \\int_a^b \\sqrt{[x'(t)]^2 + [y'(t)]^2 + [z'(t)]^2}\\,dt.$$",
        "速率是速度向量的长度，把速率在时间区间上积分，就把沿曲线走过的路程加了起来。对于光滑空间曲线 $\\mathbf{r}(t) = \\langle x(t), y(t), z(t) \\rangle$，从 $t = a$ 到 $t = b$ 的弧长为：\n\n$$L = \\int_a^b \\|\\mathbf{r}'(t)\\|\\,dt = \\int_a^b \\sqrt{[x'(t)]^2 + [y'(t)]^2 + [z'(t)]^2}\\,dt。$$",
      ),
      generate(rng: Rng): Problem {
        const [a, b, c] = rng.pick(pythagoreanTriples);
        const k = rng.int(2, 6);
        const prompt = t(
          `Find the arc length of the circular helix $\\mathbf{r}(t) = \\langle ${a}\\cos t, ${a}\\sin t, ${b}t \\rangle$ for $0 \\le t \\le ${k}$.`,
          `求圆柱螺旋线 $\\mathbf{r}(t) = \\langle ${a}\\cos t, ${a}\\sin t, ${b}t \\rangle$ 在 $0 \\le t \\le ${k}$ 上的弧长。`,
        );
        const ans = c * k;
        const solution = t(
          steps(
            `Find the velocity vector: $\\mathbf{r}'(t) = \\langle -${a}\\sin t, ${a}\\cos t, ${b} \\rangle$.`,
            `Calculate the speed: $\\|\\mathbf{r}'(t)\\| = \\sqrt{(-${a}\\sin t)^2 + (${a}\\cos t)^2 + ${b}^2} = \\sqrt{${a * a}(\\sin^2 t + \\cos^2 t) + ${b * b}} = \\sqrt{${a * a + b * b}} = ${c}$.`,
            `Integrate speed over $[0, ${k}]$: $L = \\int_0^{${k}} ${c}\\,dt = ${c} \\cdot ${k} = ${ans}$.`,
          ),
          steps(
            `求速度向量：$\\mathbf{r}'(t) = \\langle -${a}\\sin t, ${a}\\cos t, ${b} \\rangle$。`,
            `计算速率：$\\|\\mathbf{r}'(t)\\| = \\sqrt{(-${a}\\sin t)^2 + (${a}\\cos t)^2 + ${b}^2} = \\sqrt{${a * a}(\\sin^2 t + \\cos^2 t) + ${b * b}} = \\sqrt{${a * a + b * b}} = ${c}$。`,
            `在 $[0, ${k}]$ 上对速率积分：$L = \\int_0^{${k}} ${c}\\,dt = ${c} \\cdot ${k} = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [a * k, b * k, (a + b) * k, c],
        });
      },
    },
  ],
};

/** tangentVectorsAndTangentLinesToCurves computes tangent vectors to curves. */
export const tangentVectorsAndTangentLinesToCurves: TopicDef = {
  id: "tangent-vectors-and-tangent-lines-to-curves",
  title: t("Tangent Vectors and Tangent Lines to Curves", "曲线的切向量与切线"),
  summary: t(
    "The derivative r'(t0) is a tangent vector to the curve at t0, determining the direction of the tangent line.",
    "导数 r'(t0) 是曲线在 t0 处的切向量，决定了切线的方向。",
  ),
  prerequisites: ["differentiating-vector-valued-functions", "the-vector-equation-of-a-line"],
  encompasses: [{ topic: "differentiating-vector-valued-functions", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "finding-tangent-vectors-to-space-curves",
      title: t("Finding tangent vectors to space curves", "求空间曲线的切向量"),
      explanation: t(
        "If $\\mathbf{r}(t)$ is a smooth space curve, the derivative $\\mathbf{r}'(t_0) = \\langle x'(t_0), y'(t_0), z'(t_0) \\rangle$ provides a tangent vector to the curve at the point corresponding to $t = t_0$.",
        "若 $\\mathbf{r}(t)$ 是一条光滑空间曲线，则导数 $\\mathbf{r}'(t_0) = \\langle x'(t_0), y'(t_0), z'(t_0) \\rangle$ 提供了曲线在参数 $t = t_0$ 对应点处的切向量。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-6, 6);
        const b = rng.nonZero(-6, 6);
        const c = rng.nonZero(-5, 5);
        const t0 = rng.int(-2, 2);

        const ansX = 2 * a * t0;
        const ansY = 3 * b * t0 * t0;
        const ansZ = c;
        const answer: Vec3 = [ansX, ansY, ansZ];

        const prompt = t(
          `Find the tangent vector $\\mathbf{r}'(${t0})$ to the curve $\\mathbf{r}(t) = \\left\\langle ${poly([a, "t^2"])}, ${poly([b, "t^3"])}, ${poly([c, "t"], [2, ""])} \\right\\rangle$. Express your answer as a vector $\\langle x, y, z \\rangle$.`,
          `求曲线 $\\mathbf{r}(t) = \\left\\langle ${poly([a, "t^2"])}, ${poly([b, "t^3"])}, ${poly([c, "t"], [2, ""])} \\right\\rangle$ 在 $t = ${t0}$ 处的切向量 $\\mathbf{r}'(${t0})$。结果以向量 $\\langle x, y, z \\rangle$ 表示。`,
        );
        const solution = t(
          steps(
            `Differentiate each component with respect to $t$: $\\mathbf{r}'(t) = \\langle ${poly([2 * a, "t"])}, ${poly([3 * b, "t^2"])}, ${c} \\rangle$.`,
            `Substitute $t = ${t0}$: $\\mathbf{r}'(${t0}) = \\langle ${ansX}, ${ansY}, ${ansZ} \\rangle = ${v3L(answer)}$.`,
          ),
          steps(
            `对每个分量关于 $t$ 求导：$\\mathbf{r}'(t) = \\langle ${poly([2 * a, "t"])}, ${poly([3 * b, "t^2"])}, ${c} \\rangle$。`,
            `代入 $t = ${t0}$：$\\mathbf{r}'(${t0}) = \\langle ${ansX}, ${ansY}, ${ansZ} \\rangle = ${v3L(answer)}$。`,
          ),
        );
        return pointProblem({
          prompt,
          solution,
          answer,
          vector: true,
          vars: ["x", "y", "z"],
          wrong: [
            [a * t0 * t0, b * t0 * t0 * t0, c * t0 + 2],
            [2 * a, 3 * b, c],
            [ansY, ansX, ansZ],
          ],
        });
      },
    },
  ],
};

/** unitTangentVectors calculates the unit tangent vector T(t). */
export const unitTangentVectors: TopicDef = {
  id: "unit-tangent-vectors",
  title: t("Unit Tangent Vectors", "单位切向量"),
  summary: t(
    "The unit tangent vector T(t) = r'(t) / ||r'(t)|| points in the direction of motion with unit length.",
    "单位切向量 T(t) = r'(t) / ||r'(t)|| 指向运动方向且长度为 1。",
  ),
  prerequisites: ["tangent-vectors-and-tangent-lines-to-curves"],
  encompasses: [{ topic: "tangent-vectors-and-tangent-lines-to-curves", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "calculating-unit-tangent-vectors",
      title: t("Calculating unit tangent vectors", "计算单位切向量"),
      explanation: t(
        "Dividing the velocity by its length keeps only its direction, giving a vector of length one that points along the curve in the direction of motion. The unit tangent vector $\\mathbf{T}(t)$ is obtained by normalizing the velocity vector:\n\n$$\\mathbf{T}(t) = \\frac{\\mathbf{r}'(t)}{\\|\\mathbf{r}'(t)\\|}.$$",
        "把速度除以它的长度只保留方向，得到一个长度为 1、沿曲线指向运动方向的向量。单位切向量 $\\mathbf{T}(t)$ 通过对速度向量进行单位化得到：\n\n$$\\mathbf{T}(t) = \\frac{\\mathbf{r}'(t)}{\\|\\mathbf{r}'(t)\\|}。$$",
      ),
      generate(rng: Rng): Problem {
        const [a, b, c] = rng.pick(pythagoreanTriples);
        const idx = rng.int(0, 3);
        const angles = [
          { tVal: "0", ans: [Q.zero, Q.of(a, c), Q.of(b, c)] as const },
          { tVal: "\\frac{\\pi}{2}", ans: [Q.of(-a, c), Q.zero, Q.of(b, c)] as const },
          { tVal: "\\pi", ans: [Q.zero, Q.of(-a, c), Q.of(b, c)] as const },
          { tVal: "\\frac{3\\pi}{2}", ans: [Q.of(a, c), Q.zero, Q.of(b, c)] as const },
        ];
        const { tVal, ans: answer } = angles[idx]!;

        const prompt = t(
          `Find the unit tangent vector $\\mathbf{T}(${tVal})$ for the helix $\\mathbf{r}(t) = \\langle ${a}\\cos t, ${a}\\sin t, ${b}t \\rangle$. Express your answer as a vector $\\langle x, y, z \\rangle$.`,
          `求螺旋线 $\\mathbf{r}(t) = \\langle ${a}\\cos t, ${a}\\sin t, ${b}t \\rangle$ 在 $t = ${tVal}$ 处的单位切向量 $\\mathbf{T}(${tVal})$。结果以向量 $\\langle x, y, z \\rangle$ 表示。`,
        );
        const solution = t(
          steps(
            `Compute $\\mathbf{r}'(t) = \\langle -${a}\\sin t, ${a}\\cos t, ${b} \\rangle$.`,
            `The speed is $\\|\\mathbf{r}'(t)\\| = \\sqrt{(-${a}\\sin t)^2 + (${a}\\cos t)^2 + ${b}^2} = \\sqrt{${c * c}} = ${c}$.`,
            `Therefore, $\\mathbf{T}(t) = \\left\\langle -\\frac{${a}}{${c}}\\sin t, \\frac{${a}}{${c}}\\cos t, \\frac{${b}}{${c}} \\right\\rangle$.`,
            `At $t = ${tVal}$, $\\mathbf{T}(${tVal}) = ${v3L(answer)}$.`,
          ),
          steps(
            `计算 $\\mathbf{r}'(t) = \\langle -${a}\\sin t, ${a}\\cos t, ${b} \\rangle$。`,
            `速率为 $\\|\\mathbf{r}'(t)\\| = \\sqrt{(-${a}\\sin t)^2 + (${a}\\cos t)^2 + ${b}^2} = \\sqrt{${c * c}} = ${c}$。`,
            `因此，$\\mathbf{T}(t) = \\left\\langle -\\frac{${a}}{${c}}\\sin t, \\frac{${a}}{${c}}\\cos t, \\frac{${b}}{${c}} \\right\\rangle$。`,
            `在 $t = ${tVal}$ 处，$\\mathbf{T}(${tVal}) = ${v3L(answer)}$。`,
          ),
        );
        return pointProblem({
          prompt,
          solution,
          answer,
          vector: true,
          vars: ["x", "y", "z"],
          wrong: [
            [Q.zero, Q.of(a), Q.of(b)],
            [answer[1], answer[0], answer[2]],
            [answer[0], answer[1], Q.zero],
          ],
        });
      },
    },
  ],
};

/** principalNormalVectors calculates the principal normal vector N(t). */
export const principalNormalVectors: TopicDef = {
  id: "principal-normal-vectors",
  title: t("Principal Normal Vectors", "主法向量"),
  summary: t(
    "The principal normal vector N(t) = T'(t) / ||T'(t)|| points in the direction the curve is turning, perpendicular to T(t).",
    "主法向量 N(t) = T'(t) / ||T'(t)|| 指向曲线转弯的方向，且与 T(t) 垂直。",
  ),
  prerequisites: ["unit-tangent-vectors"],
  encompasses: [{ topic: "unit-tangent-vectors", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "calculating-principal-normal-vectors",
      title: t("Calculating principal normal vectors", "计算主法向量"),
      explanation: t(
        "Since $\\mathbf{T}(t)$ has constant unit length, $\\mathbf{T}'(t)$ is orthogonal to $\\mathbf{T}(t)$. The principal unit normal vector $\\mathbf{N}(t)$ is defined by:\n\n$$\\mathbf{N}(t) = \\frac{\\mathbf{T}'(t)}{\\|\\mathbf{T}'(t)\\|}.$$",
        "由于 $\\mathbf{T}(t)$ 具有恒定单位长度，因此 $\\mathbf{T}'(t)$ 与 $\\mathbf{T}(t)$ 正交。主单位法向量 $\\mathbf{N}(t)$ 定义为：\n\n$$\\mathbf{N}(t) = \\frac{\\mathbf{T}'(t)}{\\|\\mathbf{T}'(t)\\|}。$$",
      ),
      generate(rng: Rng): Problem {
        const [a, b, c] = rng.pick(pythagoreanTriples);
        const choice = rng.int(0, 3);
        const cases = [
          { tText: "0", ans: [-1, 0, 0] as const },
          { tText: "\\frac{\\pi}{2}", ans: [0, -1, 0] as const },
          { tText: "\\pi", ans: [1, 0, 0] as const },
          { tText: "\\frac{3\\pi}{2}", ans: [0, 1, 0] as const },
        ];
        const { tText, ans } = cases[choice]!;

        const prompt = t(
          `Find the principal unit normal vector $\\mathbf{N}\\left(${tText}\\right)$ for the circular helix $\\mathbf{r}(t) = \\langle ${a}\\cos t, ${a}\\sin t, ${b}t \\rangle$. Express your answer as a vector $\\langle x, y, z \\rangle$.`,
          `求圆柱螺旋线 $\\mathbf{r}(t) = \\langle ${a}\\cos t, ${a}\\sin t, ${b}t \\rangle$ 在 $t = ${tText}$ 处的主单位法向量 $\\mathbf{N}\\left(${tText}\\right)$。结果以向量 $\\langle x, y, z \\rangle$ 表示。`,
        );
        const solution = t(
          steps(
            `From the unit tangent vector $\\mathbf{T}(t) = \\left\\langle -\\frac{${a}}{${c}}\\sin t, \\frac{${a}}{${c}}\\cos t, \\frac{${b}}{${c}} \\right\\rangle$, differentiate to get:\n\n$$\\mathbf{T}'(t) = \\left\\langle -\\frac{${a}}{${c}}\\cos t, -\\frac{${a}}{${c}}\\sin t, 0 \\right\\rangle.$$`,
            `The norm is $\\|\\mathbf{T}'(t)\\| = \\frac{${a}}{${c}}$.`,
            `Dividing by the norm gives $\\mathbf{N}(t) = \\langle -\\cos t, -\\sin t, 0 \\rangle$.`,
            `Evaluating at $t = ${tText}$ gives $\\mathbf{N}\\left(${tText}\\right) = ${v3L(ans)}$.`,
          ),
          steps(
            `由单位切向量 $\\mathbf{T}(t) = \\left\\langle -\\frac{${a}}{${c}}\\sin t, \\frac{${a}}{${c}}\\cos t, \\frac{${b}}{${c}} \\right\\rangle$ 求导得：\n\n$$\\mathbf{T}'(t) = \\left\\langle -\\frac{${a}}{${c}}\\cos t, -\\frac{${a}}{${c}}\\sin t, 0 \\right\\rangle。$$`,
            `其模长为 $\\|\\mathbf{T}'(t)\\| = \\frac{${a}}{${c}}$。`,
            `除以模长得到 $\\mathbf{N}(t) = \\langle -\\cos t, -\\sin t, 0 \\rangle$。`,
            `代入 $t = ${tText}$ 得 $\\mathbf{N}\\left(${tText}\\right) = ${v3L(ans)}$。`,
          ),
        );
        return pointProblem({
          prompt,
          solution,
          answer: ans,
          vector: true,
          vars: ["x", "y", "z"],
          wrong: [
            [-ans[0], -ans[1], 0],
            [0, 0, 1],
            [ans[1], ans[0], 0],
          ],
        });
      },
    },
  ],
};

/** binormalVectors computes the binormal vector B(t) = T(t) × N(t). */
export const binormalVectors: TopicDef = {
  id: "binormal-vectors",
  title: t("Binormal Vectors", "次法向量"),
  summary: t(
    "The binormal vector B(t) = T(t) × N(t) completes the right-handed Frenet-Serret orthonormal frame {T, N, B}.",
    "次法向量 B(t) = T(t) × N(t) 构成了右手系 Frenet-Serret 正交标架 {T, N, B}。",
  ),
  prerequisites: ["principal-normal-vectors", "the-cross-product-of-two-vectors"],
  encompasses: [{ topic: "principal-normal-vectors", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-binormal-vectors",
      title: t("Computing binormal vectors", "计算次法向量"),
      explanation: t(
        "The binormal vector $\\mathbf{B}(t)$ is defined by the cross product of the unit tangent and principal normal vectors:\n\n$$\\mathbf{B}(t) = \\mathbf{T}(t) \\times \\mathbf{N}(t).$$",
        "次法向量 $\\mathbf{B}(t)$ 定义为单位切向量与主法向量的叉积：\n\n$$\\mathbf{B}(t) = \\mathbf{T}(t) \\times \\mathbf{N}(t)。$$",
      ),
      generate(rng: Rng): Problem {
        const [a, b, c] = rng.pick(pythagoreanTriples);
        const idx = rng.int(0, 3);
        const cases = [
          {
            tVal: "0",
            tVec: `\\left\\langle 0, \\frac{${a}}{${c}}, \\frac{${b}}{${c}} \\right\\rangle`,
            nVec: "\\langle -1, 0, 0 \\rangle",
            ans: [Q.zero, Q.of(-b, c), Q.of(a, c)] as const,
          },
          {
            tVal: "\\frac{\\pi}{2}",
            tVec: `\\left\\langle -\\frac{${a}}{${c}}, 0, \\frac{${b}}{${c}} \\right\\rangle`,
            nVec: "\\langle 0, -1, 0 \\rangle",
            ans: [Q.of(b, c), Q.zero, Q.of(a, c)] as const,
          },
          {
            tVal: "\\pi",
            tVec: `\\left\\langle 0, -\\frac{${a}}{${c}}, \\frac{${b}}{${c}} \\right\\rangle`,
            nVec: "\\langle 1, 0, 0 \\rangle",
            ans: [Q.zero, Q.of(b, c), Q.of(a, c)] as const,
          },
          {
            tVal: "\\frac{3\\pi}{2}",
            tVec: `\\left\\langle \\frac{${a}}{${c}}, 0, \\frac{${b}}{${c}} \\right\\rangle`,
            nVec: "\\langle 0, 1, 0 \\rangle",
            ans: [Q.of(-b, c), Q.zero, Q.of(a, c)] as const,
          },
        ];
        const { tVal, tVec, nVec, ans } = cases[idx]!;

        const prompt = t(
          `For the helix $\\mathbf{r}(t) = \\langle ${a}\\cos t, ${a}\\sin t, ${b}t \\rangle$ with unit tangent vector $\\mathbf{T}(${tVal}) = ${tVec}$ and principal normal $\\mathbf{N}(${tVal}) = ${nVec}$, find the binormal vector $\\mathbf{B}(${tVal})$. Express your answer as a vector $\\langle x, y, z \\rangle$.`,
          `对于螺旋线 $\\mathbf{r}(t) = \\langle ${a}\\cos t, ${a}\\sin t, ${b}t \\rangle$，已知其在 $t = ${tVal}$ 处的单位切向量为 $\\mathbf{T}(${tVal}) = ${tVec}$，主法向量为 $\\mathbf{N}(${tVal}) = ${nVec}$。求次法向量 $\\mathbf{B}(${tVal})$。结果以向量 $\\langle x, y, z \\rangle$ 表示。`,
        );
        const solution = t(
          steps(
            `Compute the cross product $\\mathbf{B}(${tVal}) = \\mathbf{T}(${tVal}) \\times \\mathbf{N}(${tVal})$.`,
            `Evaluating the determinant with $\\mathbf{T}(${tVal}) = ${tVec}$ and $\\mathbf{N}(${tVal}) = ${nVec}$ gives $${v3L(ans)}$.`,
          ),
          steps(
            `计算叉积 $\\mathbf{B}(${tVal}) = \\mathbf{T}(${tVal}) \\times \\mathbf{N}(${tVal})$。`,
            `用 $\\mathbf{T}(${tVal}) = ${tVec}$ 与 $\\mathbf{N}(${tVal}) = ${nVec}$ 计算行列式得 $${v3L(ans)}$。`,
          ),
        );
        return pointProblem({
          prompt,
          solution,
          answer: ans,
          vector: true,
          vars: ["x", "y", "z"],
          wrong: [
            [Q.zero, Q.of(b, c), Q.of(-a, c)],
            [Q.of(1), Q.zero, Q.zero],
            [ans[1], ans[0], ans[2]],
          ],
        });
      },
    },
  ],
};

/** theOsculatingPlane finds the Cartesian equation of the osculating plane. */
export const theOsculatingPlane: TopicDef = {
  id: "the-osculating-plane",
  title: t("The Osculating Plane", "密切平面"),
  summary: t(
    "The osculating plane contains the tangent and principal normal vectors and has normal vector B(t).",
    "密切平面包含切向量和主法向量，其法向量为次法向量 B(t)。",
  ),
  prerequisites: ["binormal-vectors", "the-cartesian-equation-of-a-plane"],
  encompasses: [{ topic: "binormal-vectors", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "finding-the-equation-of-the-osculating-plane",
      title: t("Finding the equation of the osculating plane", "求密切平面的方程"),
      explanation: t(
        "The osculating plane to a curve at $\\mathbf{r}(t_0) = (x_0, y_0, z_0)$ is the plane spanned by $\\mathbf{T}(t_0)$ and $\\mathbf{N}(t_0)$. Its normal vector is the binormal vector $\\mathbf{B}(t_0)$, so its Cartesian equation is:\n\n$$B_x (x - x_0) + B_y (y - y_0) + B_z (z - z_0) = 0.$$",
        "曲线在 $\\mathbf{r}(t_0) = (x_0, y_0, z_0)$ 处的密切平面是由 $\\mathbf{T}(t_0)$ 和 $\\mathbf{N}(t_0)$ 张成的平面。其法向量为次法向量 $\\mathbf{B}(t_0)$，故其笛卡尔方程为：\n\n$$B_x (x - x_0) + B_y (y - y_0) + B_z (z - z_0) = 0。$$",
      ),
      generate(rng: Rng): Problem {
        const [a, b] = rng.pick(pythagoreanTriples);
        const d = rng.int(-4, 4);
        const rhs = a * d;
        // At t = 0, r(0) = (a, 0, d), B(0) parallel to <0, -b, a>.
        // Equation: 0*(x - a) + (-b)*(y - 0) + a*(z - d) = 0 => a*z - b*y = a*d.
        const zTerm = poly([a, "z"], [-b, "y"]);
        const answer = rhs === 0 ? `${zTerm} = 0` : `${zTerm} = ${rhs}`;
        const zComponent = d === 0 ? `${b}t` : poly([b, "t"], [d, ""]);

        const prompt = t(
          `Find the equation of the osculating plane to the helix $\\mathbf{r}(t) = \\left\\langle ${a}\\cos t, ${a}\\sin t, ${zComponent} \\right\\rangle$ at $t = 0$. Note that $\\mathbf{r}(0) = (${a}, 0, ${d})$ and a normal vector to the plane is $\\langle 0, -${b}, ${a} \\rangle$.`,
          `求螺旋线 $\\mathbf{r}(t) = \\left\\langle ${a}\\cos t, ${a}\\sin t, ${zComponent} \\right\\rangle$ 在 $t = 0$ 处的密切平面方程。已知 $\\mathbf{r}(0) = (${a}, 0, ${d})$，且该平面的一个法向量为 $\\langle 0, -${b}, ${a} \\rangle$。`,
        );
        const solution = t(
          steps(
            `The point on the curve is $(x_0, y_0, z_0) = (${a}, 0, ${d})$.`,
            `The normal vector to the osculating plane is $\\mathbf{n} = \\langle 0, -${b}, ${a} \\rangle$.`,
            `The plane equation is $0(x - ${paren(a)}) + ${paren(-b)}(y - 0) + ${a}(z - ${paren(d)}) = 0$.`,
            `Simplifying gives $${answer}$.`,
          ),
          steps(
            `曲线上对应点为 $(x_0, y_0, z_0) = (${a}, 0, ${d})$。`,
            `密切平面的法向量为 $\\mathbf{n} = \\langle 0, -${b}, ${a} \\rangle$。`,
            `平面方程为 $0(x - ${paren(a)}) + ${paren(-b)}(y - 0) + ${a}(z - ${paren(d)}) = 0$。`,
            `化简得 $${answer}$。`,
          ),
        );
        return equationProblem({
          prompt,
          solution,
          answer,
          wrong: [`${poly([b, "z"], [-a, "y"])} = 0`, `${poly([a, "z"], [b, "y"])} = ${rhs}`, `${poly([1, "x"], [-a, ""])} = 0`],
        });
      },
    },
  ],
};

/** parameterizationByArcLength reparameterizes curves with respect to arc length s. */
export const parameterizationByArcLength: TopicDef = {
  id: "parameterization-by-arc-length",
  title: t("Parameterization by Arc Length", "弧长参数化"),
  summary: t(
    "Reparameterizing a curve by arc length s yields a natural parameterization with unit speed: ||r'(s)|| = 1.",
    "用弧长 s 对曲线重新参数化可得到自然参数化，其速率为单位长度：||r'(s)|| = 1。",
  ),
  prerequisites: ["the-arc-length-of-a-vector-valued-function"],
  encompasses: [{ topic: "the-arc-length-of-a-vector-valued-function", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "reparameterizing-curves-by-arc-length",
      title: t("Reparameterizing curves by arc length", "按弧长重新参数化曲线"),
      explanation: t(
        "The arc length function starting from $t = 0$ is $s(t) = \\int_0^t \\|\\mathbf{r}'(u)\\|\\,du$. If the speed is a constant $c$, then $s = ct$, which inverts to $t = \\frac{s}{c}$. Substituting $t(s)$ gives the arc length parameterization $\\mathbf{r}(s)$.",
        "以 $t = 0$ 为基准的弧长函数为 $s(t) = \\int_0^t \\|\\mathbf{r}'(u)\\|\\,du$。若速率为常数 $c$，则 $s = ct$，反解得 $t = \\frac{s}{c}$。代入 $t(s)$ 即可得到弧长参数化 $\\mathbf{r}(s)$。",
      ),
      generate(rng: Rng): Problem {
        const [a, b, c] = rng.pick(pythagoreanTriples);
        const t0 = rng.int(2, 7);
        const sVal = c * t0;

        const prompt = t(
          `The circular helix $\\mathbf{r}(t) = \\langle ${a}\\cos t, ${a}\\sin t, ${b}t \\rangle$ has constant speed $c = ${c}$. If the curve is parameterized by arc length $s$ starting from $t = 0$, what is the parameter value $t$ when the arc length is $s = ${sVal}$?`,
          `圆柱螺旋线 $\\mathbf{r}(t) = \\langle ${a}\\cos t, ${a}\\sin t, ${b}t \\rangle$ 的速率为恒定常数 $c = ${c}$。若以 $t = 0$ 为起点按弧长 $s$ 进行参数化，当弧长 $s = ${sVal}$ 时对应的参数 $t$ 为多少？`,
        );
        const solution = t(
          steps(
            `The arc length formula for constant speed is $s(t) = \\int_0^t ${c}\\,du = ${c}t$.`,
            `Invert to express $t$ in terms of $s$: $t = \\frac{s}{${c}}$.`,
            `For $s = ${sVal}$, $t = \\frac{${sVal}}{${c}} = ${t0}$.`,
          ),
          steps(
            `恒定速率下的弧长公式为 $s(t) = \\int_0^t ${c}\\,du = ${c}t$。`,
            `反解得到 $t$ 关于 $s$ 的表达式：$t = \\frac{s}{${c}}$。`,
            `当 $s = ${sVal}$ 时，$t = \\frac{${sVal}}{${c}} = ${t0}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: t0,
          wrong: [sVal * c, sVal + c, sVal - c],
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 1.2 Curvature
// ---------------------------------------------------------------------------

/** introductionToCurvature defines curvature κ = ||dT/ds||. */
export const introductionToCurvature: TopicDef = {
  id: "introduction-to-curvature",
  title: t("Introduction to Curvature", "曲率简介"),
  summary: t(
    "Curvature κ = ||dT/ds|| measures the rate at which the unit tangent vector turns per unit of arc length.",
    "曲率 κ = ||dT/ds|| 度量单位切向量随弧长转动的速率。",
  ),
  prerequisites: ["unit-tangent-vectors", "the-arc-length-of-a-vector-valued-function"],
  encompasses: [{ topic: "unit-tangent-vectors", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "defining-and-calculating-curvature",
      title: t("Defining and calculating curvature", "曲率的定义与计算"),
      explanation: t(
        "Curvature $\\kappa$ measures how quickly a curve changes direction. In terms of parameter $t$:\n\n$$\\kappa = \\frac{\\|\\mathbf{T}'(t)\\|}{\\|\\mathbf{r}'(t)\\|}.$$ For a circular helix $\\mathbf{r}(t) = \\langle a\\cos t, a\\sin t, bt \\rangle$, the curvature is constant: $\\kappa = \\frac{a}{a^2 + b^2}$.",
        "曲率 $\\kappa$ 度量曲线改变方向的快慢。用参数 $t$ 表示为：\n\n$$\\kappa = \\frac{\\|\\mathbf{T}'(t)\\|}{\\|\\mathbf{r}'(t)\\|}。$$ 对于圆柱螺旋线 $\\mathbf{r}(t) = \\langle a\\cos t, a\\sin t, bt \\rangle$，其曲率为常数：$\\kappa = \\frac{a}{a^2 + b^2}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 10);
        const b = rng.int(1, 10);
        const sumSq = a * a + b * b;
        const ans = Q.of(a, sumSq);

        const prompt = t(
          `Find the curvature $\\kappa$ of the circular helix $\\mathbf{r}(t) = \\langle ${a}\\cos t, ${a}\\sin t, ${b}t \\rangle$.`,
          `求圆柱螺旋线 $\\mathbf{r}(t) = \\langle ${a}\\cos t, ${a}\\sin t, ${b}t \\rangle$ 的曲率 $\\kappa$。`,
        );
        const solution = t(
          steps(
            `The speed is $\\|\\mathbf{r}'(t)\\| = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${sumSq}}$.`,
            `The unit tangent vector is $\\mathbf{T}(t) = \\left\\langle -\\frac{${a}}{\\sqrt{${sumSq}}}\\sin t, \\frac{${a}}{\\sqrt{${sumSq}}}\\cos t, \\frac{${b}}{\\sqrt{${sumSq}}} \\right\\rangle$.`,
            `Its derivative is $\\mathbf{T}'(t) = \\left\\langle -\\frac{${a}}{\\sqrt{${sumSq}}}\\cos t, -\\frac{${a}}{\\sqrt{${sumSq}}}\\sin t, 0 \\right\\rangle$, with norm $\\|\\mathbf{T}'(t)\\| = \\frac{${a}}{\\sqrt{${sumSq}}}$.`,
            `Thus $\\kappa = \\frac{\\|\\mathbf{T}'(t)\\|}{\\|\\mathbf{r}'(t)\\|} = \\frac{${a}/\\sqrt{${sumSq}}}{\\sqrt{${sumSq}}} = \\frac{${a}}{${sumSq}}${ans.isInteger() || ans.d === BigInt(sumSq) ? "" : ` = ${ans.toLatex()}`}$.`,
          ),
          steps(
            `速率为 $\\|\\mathbf{r}'(t)\\| = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${sumSq}}$。`,
            `单位切向量为 $\\mathbf{T}(t) = \\left\\langle -\\frac{${a}}{\\sqrt{${sumSq}}}\\sin t, \\frac{${a}}{\\sqrt{${sumSq}}}\\cos t, \\frac{${b}}{\\sqrt{${sumSq}}} \\right\\rangle$。`,
            `其导数为 $\\mathbf{T}'(t) = \\left\\langle -\\frac{${a}}{\\sqrt{${sumSq}}}\\cos t, -\\frac{${a}}{\\sqrt{${sumSq}}}\\sin t, 0 \\right\\rangle$，模长为 $\\|\\mathbf{T}'(t)\\| = \\frac{${a}}{\\sqrt{${sumSq}}}$。`,
            `因此 $\\kappa = \\frac{\\|\\mathbf{T}'(t)\\|}{\\|\\mathbf{r}'(t)\\|} = \\frac{${a}/\\sqrt{${sumSq}}}{\\sqrt{${sumSq}}} = \\frac{${a}}{${sumSq}}${ans.isInteger() || ans.d === BigInt(sumSq) ? "" : ` = ${ans.toLatex()}`}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.of(1, a), Q.of(b, sumSq), Q.of(1, sumSq)],
        });
      },
    },
  ],
};

/** findingCurvatureUsingTheCrossProduct computes curvature using the cross product formula. */
export const findingCurvatureUsingTheCrossProduct: TopicDef = {
  id: "finding-curvature-using-the-cross-product",
  title: t("Finding Curvature Using the Cross Product", "利用叉积求曲率"),
  summary: t(
    "The curvature of a space curve is $\\kappa(t) = \\frac{\\|\\mathbf{r}'(t) \\times \\mathbf{r}''(t)\\|}{\\|\\mathbf{r}'(t)\\|^3}$.",
    "空间曲线的曲率为 $\\kappa(t) = \\frac{\\|\\mathbf{r}'(t) \\times \\mathbf{r}''(t)\\|}{\\|\\mathbf{r}'(t)\\|^3}$。",
  ),
  prerequisites: ["introduction-to-curvature", "the-cross-product-of-two-vectors"],
  encompasses: [{ topic: "introduction-to-curvature", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-curvature-via-cross-product",
      title: t("Computing curvature via cross product", "通过叉积计算曲率"),
      explanation: t(
        "Curvature measures how quickly the direction of the curve turns, and the cross product of velocity and acceleration captures that turning without normalizing first. For any smooth three-dimensional curve $\\mathbf{r}(t)$, the curvature can be computed directly without finding $\\mathbf{T}(t)$:\n\n$$\\kappa(t) = \\frac{\\|\\mathbf{r}'(t) \\times \\mathbf{r}''(t)\\|}{\\|\\mathbf{r}'(t)\\|^3}.$$",
        "曲率衡量曲线方向转动的快慢，速度与加速度的叉积不必先单位化就能反映这种转动。对于任意光滑三维空间曲线 $\\mathbf{r}(t)$，无需先求出 $\\mathbf{T}(t)$，可直接利用叉积公式计算曲率：\n\n$$\\kappa(t) = \\frac{\\|\\mathbf{r}'(t) \\times \\mathbf{r}''(t)\\|}{\\|\\mathbf{r}'(t)\\|^3}。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 8);
        const b = rng.int(1, 5);
        // r(t) = <t, a*t^2, b*t^3>
        // r'(t) = <1, 2a*t, 3b*t^2> -> r'(0) = <1, 0, 0>
        // r''(t) = <0, 2a, 6b*t> -> r''(0) = <0, 2a, 0>
        // r'(0) x r''(0) = <0, 0, 2a>
        // ||r'(0) x r''(0)|| = 2a, ||r'(0)||^3 = 1^3 = 1 -> kappa(0) = 2a.
        const ans = 2 * a;

        const prompt = t(
          `Use the cross product formula to find the curvature $\\kappa(0)$ of the curve $\\mathbf{r}(t) = \\left\\langle t, ${poly([a, "t^2"])}, ${poly([b, "t^3"])} \\right\\rangle$ at $t = 0$.`,
          `使用叉积公式求曲线 $\\mathbf{r}(t) = \\left\\langle t, ${poly([a, "t^2"])}, ${poly([b, "t^3"])} \\right\\rangle$ 在 $t = 0$ 处的曲率 $\\kappa(0)$。`,
        );
        const solution = t(
          steps(
            `Compute the velocity and acceleration at $t = 0$:\n\n` +
              `$\\mathbf{r}'(t) = \\langle 1, ${2 * a}t, ${3 * b}t^2 \\rangle \\implies \\mathbf{r}'(0) = \\langle 1, 0, 0 \\rangle$.\n\n` +
              `$\\mathbf{r}''(t) = \\langle 0, ${2 * a}, ${6 * b}t \\rangle \\implies \\mathbf{r}''(0) = \\langle 0, ${2 * a}, 0 \\rangle$.`,
            `Compute the cross product: $\\mathbf{r}'(0) \\times \\mathbf{r}''(0) = \\langle 0, 0, ${2 * a} \\rangle$, which has magnitude $\\|\\mathbf{r}'(0) \\times \\mathbf{r}''(0)\\| = ${2 * a}$.`,
            `The speed at $t = 0$ is $\\|\\mathbf{r}'(0)\\| = 1$.`,
            `Apply the formula: $\\kappa(0) = \\frac{${2 * a}}{1^3} = ${ans}$.`,
          ),
          steps(
            `计算 $t = 0$ 处的速度和加速度：\n\n` +
              `$\\mathbf{r}'(t) = \\langle 1, ${2 * a}t, ${3 * b}t^2 \\rangle \\implies \\mathbf{r}'(0) = \\langle 1, 0, 0 \\rangle$。\n\n` +
              `$\\mathbf{r}''(t) = \\langle 0, ${2 * a}, ${6 * b}t \\rangle \\implies \\mathbf{r}''(0) = \\langle 0, ${2 * a}, 0 \\rangle$。`,
            `计算叉积：$\\mathbf{r}'(0) \\times \\mathbf{r}''(0) = \\langle 0, 0, ${2 * a} \\rangle$，其模长为 $\\|\\mathbf{r}'(0) \\times \\mathbf{r}''(0)\\| = ${2 * a}$。`,
            `在 $t = 0$ 处的速率为 $\\|\\mathbf{r}'(0)\\| = 1$。`,
            `应用公式：$\\kappa(0) = \\frac{${2 * a}}{1^3} = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [a, ans / 2, ans * 2],
        });
      },
    },
  ],
};

/** radiusOfCurvature computes the radius of curvature ρ = 1 / κ. */
export const radiusOfCurvature: TopicDef = {
  id: "radius-of-curvature",
  title: t("Radius of Curvature", "曲率半径"),
  summary: t(
    "The radius of curvature ρ = 1 / κ is the radius of the osculating circle that best approximates the curve at a point.",
    "曲率半径 ρ = 1 / κ 是在某点处最佳逼近曲线的密切圆的半径。",
  ),
  prerequisites: ["introduction-to-curvature"],
  encompasses: [{ topic: "introduction-to-curvature", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "calculating-the-radius-of-curvature",
      title: t("Calculating the radius of curvature", "计算曲率半径"),
      explanation: t(
        "The radius of curvature $\\rho$ at a point on a curve is the reciprocal of its curvature:\n\n$$\\rho = \\frac{1}{\\kappa}.$$ It represents the radius of the osculating circle (circle of curvature) at that point.",
        "曲线在某点处的曲率半径 $\\rho$ 为该点曲率的倒数：\n\n$$\\rho = \\frac{1}{\\kappa}。$$ 它表示在该点处的密切圆（曲率圆）的半径。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 40);
        const ans = k;

        const prompt = t(
          `A curve has curvature $\\kappa = \\frac{1}{${k}}$ at a given point $P$. Find its radius of curvature $\\rho$ at $P$.`,
          `已知某曲线在点 $P$ 处的曲率为 $\\kappa = \\frac{1}{${k}}$。求该曲线在点 $P$ 处的曲率半径 $\\rho$。`,
        );
        const solution = t(
          steps(
            `The radius of curvature is the reciprocal of curvature: $\\rho = \\frac{1}{\\kappa}$.`,
            `Substitute $\\kappa = \\frac{1}{${k}}$: $\\rho = \\frac{1}{1/${k}} = ${ans}$.`,
          ),
          steps(
            `曲率半径为曲率的倒数：$\\rho = \\frac{1}{\\kappa}$。`,
            `代入 $\\kappa = \\frac{1}{${k}}$：$\\rho = \\frac{1}{1/${k}} = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.of(1, k), k * k, k + 1],
        });
      },
    },
  ],
};

/** theCurvatureOfAPlaneCurve computes curvature for y = f(x). */
export const theCurvatureOfAPlaneCurve: TopicDef = {
  id: "the-curvature-of-a-plane-curve",
  title: t("The Curvature of a Plane Curve", "平面曲线的曲率"),
  summary: t(
    "For a plane curve $y = f(x)$, the curvature is $\\kappa(x) = \\frac{|f''(x)|}{\\left(1 + f'(x)^2\\right)^{3/2}}$.",
    "对于平面曲线 $y = f(x)$，曲率为 $\\kappa(x) = \\frac{|f''(x)|}{\\left(1 + f'(x)^2\\right)^{3/2}}$。",
  ),
  prerequisites: ["introduction-to-curvature", "second-and-higher-order-derivatives"],
  encompasses: [{ topic: "introduction-to-curvature", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-curvature-of-function-graphs",
      title: t("Computing curvature of function graphs", "计算显式函数图像的曲率"),
      explanation: t(
        "For a graph the second derivative measures bending, and dividing by a power of one plus the square of the slope corrects for how steep the graph is. For a plane curve given as the graph of a function $y = f(x)$, the curvature formula reduces to:\n\n$$\\kappa(x) = \\frac{|f''(x)|}{\\left[1 + (f'(x))^2\\right]^{3/2}}.$$",
        "对于函数图像，二阶导数衡量弯曲程度，再除以 1 加斜率平方的某次幂，以修正图像陡峭程度的影响。对于由显式函数图像 $y = f(x)$ 给出的平面曲线，曲率公式简化为：\n\n$$\\kappa(x) = \\frac{|f''(x)|}{\\left[1 + (f'(x))^2\\right]^{3/2}}。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 40);
        const ans = 2 * a;

        const prompt = t(
          `Find the curvature $\\kappa(0)$ of the parabola $y = ${poly([a, "x^2"])}$ at its vertex $(0, 0)$.`,
          `求抛物线 $y = ${poly([a, "x^2"])}$ 在其顶点 $(0, 0)$ 处的曲率 $\\kappa(0)$。`,
        );
        const solution = t(
          steps(
            `Compute derivatives: $f'(x) = ${2 * a}x \\implies f'(0) = 0$.`,
            `The second derivative is $f''(x) = ${2 * a} \\implies f''(0) = ${2 * a}$.`,
            `Substitute into the plane curve curvature formula:\n\n$$\\kappa(0) = \\frac{|f''(0)|}{\\left[1 + (f'(0))^2\\right]^{3/2}} = \\frac{${2 * a}}{\\left[1 + 0^2\\right]^{3/2}} = ${ans}.$$`,
          ),
          steps(
            `求导数：$f'(x) = ${2 * a}x \\implies f'(0) = 0$。`,
            `二阶导数为 $f''(x) = ${2 * a} \\implies f''(0) = ${2 * a}$。`,
            `代入平面曲线曲率公式：\n\n$$\\kappa(0) = \\frac{|f''(0)|}{\\left[1 + (f'(0))^2\\right]^{3/2}} = \\frac{${2 * a}}{\\left[1 + 0^2\\right]^{3/2}} = ${ans}。$$`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [a, ans / 2, ans * 2],
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 1.3 Vector Fields
// ---------------------------------------------------------------------------

/** vectorFields evaluates vector fields at points in space. */
export const vectorFields: TopicDef = {
  id: "vector-fields",
  title: t("Vector Fields", "向量场"),
  summary: t(
    "A vector field assigns a vector F(x, y) or F(x, y, z) to each point in space.",
    "向量场为空间中的每个点赋予一个向量 F(x, y) 或 F(x, y, z)。",
  ),
  prerequisites: ["defining-vector-valued-functions", "three-dimensional-vectors-in-component-form"],
  encompasses: [{ topic: "defining-vector-valued-functions", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-vector-fields-at-points",
      title: t("Evaluating vector fields at points", "在各点处求向量场的值"),
      explanation: t(
        "To evaluate a vector field, substitute the coordinates of the point into each component formula to get the vector attached to that point. A vector field in $\\mathbb{R}^3$ is a function $\\mathbf{F}$ that assigns to each point $(x, y, z)$ a three-dimensional vector:\n\n$$\\mathbf{F}(x, y, z) = P(x, y, z)\\mathbf{i} + Q(x, y, z)\\mathbf{j} + R(x, y, z)\\mathbf{k} = \\langle P, Q, R \\rangle.$$",
        "求向量场的值时，把点的坐标代入每个分量公式，就得到附着在该点的向量。$\\mathbb{R}^3$ 中的向量场是一个函数 $\\mathbf{F}$，它为空间中的每个点 $(x, y, z)$ 赋予一个三维向量：\n\n$$\\mathbf{F}(x, y, z) = P(x, y, z)\\mathbf{i} + Q(x, y, z)\\mathbf{j} + R(x, y, z)\\mathbf{k} = \\langle P, Q, R \\rangle。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const c = rng.nonZero(-3, 3);
        const pt: Vec3 = [rng.int(-2, 2), rng.int(-2, 2), rng.int(-2, 2)];

        const ansX = a * pt[0] + b * pt[1];
        const ansY = c * pt[1] * pt[2];
        const ansZ = pt[0] - pt[2];
        const answer: Vec3 = [ansX, ansY, ansZ];

        const prompt = t(
          `Evaluate the vector field $\\mathbf{F}(x, y, z) = \\left\\langle ${poly([a, "x"], [b, "y"])}, ${poly([c, "yz"])}, x - z \\right\\rangle$ at the point $(${pt[0]}, ${pt[1]}, ${pt[2]})$. Express your answer as a vector $\\langle x, y, z \\rangle$.`,
          `计算向量场 $\\mathbf{F}(x, y, z) = \\left\\langle ${poly([a, "x"], [b, "y"])}, ${poly([c, "yz"])}, x - z \\right\\rangle$ 在点 $(${pt[0]}, ${pt[1]}, ${pt[2]})$ 处的值。结果以向量 $\\langle x, y, z \\rangle$ 表示。`,
        );
        const solution = t(
          steps(
            `Substitute $x = ${pt[0]}$, $y = ${pt[1]}$, and $z = ${pt[2]}$ into each component:`,
            `$P = ${a}(${pt[0]}) + ${paren(b)}(${pt[1]}) = ${ansX}$`,
            `$Q = ${c}(${pt[1]})(${pt[2]}) = ${ansY}$`,
            `$R = ${pt[0]} - (${pt[2]}) = ${ansZ}$`,
            `The resulting vector is $${v3L(answer)}$.`,
          ),
          steps(
            `将 $x = ${pt[0]}$、$y = ${pt[1]}$ 和 $z = ${pt[2]}$ 代入各分量：`,
            `$P = ${a}(${pt[0]}) + ${paren(b)}(${pt[1]}) = ${ansX}$`,
            `$Q = ${c}(${pt[1]})(${pt[2]}) = ${ansY}$`,
            `$R = ${pt[0]} - (${pt[2]}) = ${ansZ}$`,
            `最终得到的向量为 $${v3L(answer)}$。`,
          ),
        );
        return pointProblem({
          prompt,
          solution,
          answer,
          vector: true,
          vars: ["x", "y", "z"],
          wrong: [
            [ansY, ansX, ansZ],
            [-ansX, -ansY, -ansZ],
            [pt[0], pt[1], pt[2]],
          ],
        });
      },
    },
  ],
};

/** visualizingVectorFields qualitative interpretation of vector fields. */
export const visualizingVectorFields: TopicDef = {
  id: "visualizing-vector-fields",
  title: t("Visualizing Vector Fields", "向量场的可视化"),
  summary: t(
    "Vector fields are visualized by drawing vectors at representative grid points, displaying direction and magnitude.",
    "通过在代表性网格点绘制向量来可视化向量场，直观显示其方向和大小。",
  ),
  prerequisites: ["vector-fields"],
  encompasses: [{ topic: "vector-fields", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "interpreting-vector-field-plots",
      title: t("Interpreting vector field plots", "解读向量场图像"),
      explanation: t(
        "A vector field plot shows arrows attached to sample points $(x, y)$. Key patterns include:\n\n- Radial fields: $\\mathbf{F} = \\langle x, y \\rangle$ points directly away from the origin.\n- Rotational fields: $\\mathbf{F} = \\langle -y, x \\rangle$ circulates counterclockwise around the origin.\n- Constant fields: $\\mathbf{F} = \\langle c_1, c_2 \\rangle$ have identical vectors at every point.",
        "向量场图显示附着在各采样点 $(x, y)$ 处的箭头。主要形态包括：\n\n- 径向场：$\\mathbf{F} = \\langle x, y \\rangle$ 直接背离原点指向外侧。\n- 旋转场：$\\mathbf{F} = \\langle -y, x \\rangle$ 绕原点逆时针环流。\n- 常数场：$\\mathbf{F} = \\langle c_1, c_2 \\rangle$ 在每个点处的向量均相同。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(1, 9);
        const cStr = c === 1 ? "" : String(c);
        const kinds = [
          {
            field: `\\langle ${cStr}x, ${cStr}y \\rangle`,
            right: t("Points radially outward from the origin", "从原点向外径向发散"),
            wrong: [
              t("Circulates counterclockwise around the origin", "绕原点逆时针环流"),
              t("Points in a constant fixed direction", "指向恒定的固定方向"),
              t("Points radially inward toward the origin", "向原点径向汇聚"),
            ],
          },
          {
            field: `\\langle -${cStr}y, ${cStr}x \\rangle`,
            right: t("Circulates counterclockwise around the origin", "绕原点逆时针环流"),
            wrong: [
              t("Points radially outward from the origin", "从原点向外径向发散"),
              t("Circulates clockwise around the origin", "绕原点顺时针环流"),
              t("Points in a constant fixed direction", "指向恒定的固定方向"),
            ],
          },
          {
            field: `\\langle ${cStr}y, -${cStr}x \\rangle`,
            right: t("Circulates clockwise around the origin", "绕原点顺时针环流"),
            wrong: [
              t("Points radially outward from the origin", "从原点向外径向发散"),
              t("Circulates counterclockwise around the origin", "绕原点逆时针环流"),
              t("Points radially inward toward the origin", "向原点径向汇聚"),
            ],
          },
          {
            field: `\\langle -${cStr}x, -${cStr}y \\rangle`,
            right: t("Points radially inward toward the origin", "向原点径向汇聚"),
            wrong: [
              t("Points radially outward from the origin", "从原点向外径向发散"),
              t("Circulates counterclockwise around the origin", "绕原点逆时针环流"),
              t("Points in a constant fixed direction", "指向恒定的固定方向"),
            ],
          },
        ];
        const item = rng.pick(kinds);
        const prompt = t(
          `Which geometric description correctly characterizes the vector field $\\mathbf{F}(x, y) = ${item.field}$?`,
          `以下哪项几何描述正确表征了向量场 $\\mathbf{F}(x, y) = ${item.field}$？`,
        );
        const solution = t(
          `The field $\\mathbf{F}(x, y) = ${item.field}$ ${item.right.en.toLowerCase()}.`,
          `向量场 $\\mathbf{F}(x, y) = ${item.field}$${item.right["zh-CN"]}。`,
        );
        return pickChoice(rng, prompt, item.right, item.wrong, solution);
      },
    },
  ],
};

/** gradientVectorFields connects gradient fields to scalar potentials. */
export const gradientVectorFields: TopicDef = {
  id: "gradient-vector-fields",
  title: t("Gradient Vector Fields", "梯度向量场"),
  summary: t(
    "A gradient vector field is the gradient of a scalar potential function: F = ∇f = ⟨fx, fy, fz⟩.",
    "梯度向量场是标量势函数的梯度：F = ∇f = ⟨fx, fy, fz⟩。",
  ),
  prerequisites: ["vector-fields"],
  encompasses: [{ topic: "vector-fields", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-gradient-fields",
      title: t("Computing gradient fields", "计算梯度向量场"),
      explanation: t(
        "The gradient collects the partial derivatives into a vector, which at each point points in the direction in which the function increases fastest. If $f(x, y, z)$ is a scalar function, its gradient vector field $\\nabla f$ is defined by:\n\n$$\\nabla f = \\left\\langle \\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}, \\frac{\\partial f}{\\partial z} \\right\\rangle.$$",
        "梯度把各个偏导数组成一个向量，它在每一点都指向函数增长最快的方向。若 $f(x, y, z)$ 为标量函数，其梯度向量场 $\\nabla f$ 定义为：\n\n$$\\nabla f = \\left\\langle \\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}, \\frac{\\partial f}{\\partial z} \\right\\rangle。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const c = rng.nonZero(-3, 3);
        const pt: Vec3 = [rng.int(-2, 2), rng.int(-2, 2), rng.int(-2, 2)];

        const ansX = 2 * a * pt[0];
        const ansY = 2 * b * pt[1];
        const ansZ = 2 * c * pt[2];
        const answer: Vec3 = [ansX, ansY, ansZ];

        const prompt = t(
          `Compute the gradient vector field $\\nabla f$ of $f(x, y, z) = ${poly([a, "x^2"], [b, "y^2"], [c, "z^2"])}$ at the point $(${pt[0]}, ${pt[1]}, ${pt[2]})$. Express your answer as a vector $\\langle x, y, z \\rangle$.`,
          `计算函数 $f(x, y, z) = ${poly([a, "x^2"], [b, "y^2"], [c, "z^2"])}$ 在点 $(${pt[0]}, ${pt[1]}, ${pt[2]})$ 处的梯度向量 $\\nabla f$。结果以向量 $\\langle x, y, z \\rangle$ 表示。`,
        );
        const solution = t(
          steps(
            `Compute partial derivatives: $\\nabla f = \\langle ${poly([2 * a, "x"])}, ${poly([2 * b, "y"])}, ${poly([2 * c, "z"])} \\rangle$.`,
            `Evaluate at $(${pt[0]}, ${pt[1]}, ${pt[2]})$: $\\nabla f(${pt[0]}, ${pt[1]}, ${pt[2]}) = ${v3L(answer)}$.`,
          ),
          steps(
            `求各偏导数：$\\nabla f = \\langle ${poly([2 * a, "x"])}, ${poly([2 * b, "y"])}, ${poly([2 * c, "z"])} \\rangle$。`,
            `代入点 $(${pt[0]}, ${pt[1]}, ${pt[2]})$：$\\nabla f(${pt[0]}, ${pt[1]}, ${pt[2]}) = ${v3L(answer)}$。`,
          ),
        );
        return pointProblem({
          prompt,
          solution,
          answer,
          vector: true,
          vars: ["x", "y", "z"],
          wrong: [
            [a * pt[0], b * pt[1], c * pt[2]],
            [ansY, ansX, ansZ],
            [-ansX, -ansY, -ansZ],
          ],
        });
      },
    },
  ],
};

/** conservativeVectorFieldsInTheCartesianPlane tests for conservative fields in R^2. */
export const conservativeVectorFieldsInTheCartesianPlane: TopicDef = {
  id: "conservative-vector-fields-in-the-cartesian-plane",
  title: t("Conservative Vector Fields in the Cartesian Plane", "笛卡尔平面中的保守向量场"),
  summary: t(
    "On a simply connected domain, F = P i + Q j is conservative if and only if ∂P/∂y = ∂Q/∂x.",
    "在单连通区域上，F = P i + Q j 为保守场当且仅当 ∂P/∂y = ∂Q/∂x。",
  ),
  prerequisites: ["gradient-vector-fields"],
  encompasses: [{ topic: "gradient-vector-fields", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "testing-for-conservative-vector-fields",
      title: t("Testing for conservative vector fields", "判别保守向量场"),
      explanation: t(
        "Let $\\mathbf{F}(x, y) = P(x, y)\\mathbf{i} + Q(x, y)\\mathbf{j}$ have continuous first partial derivatives on an open simply connected region $D$. Then $\\mathbf{F}$ is conservative if and only if:\n\n$$\\frac{\\partial P}{\\partial y} = \\frac{\\partial Q}{\\partial x}.$$",
        "设 $\\mathbf{F}(x, y) = P(x, y)\\mathbf{i} + Q(x, y)\\mathbf{j}$ 在开单连通区域 $D$ 上具有连续一阶偏导数。则 $\\mathbf{F}$ 为保守场当且仅当：\n\n$$\\frac{\\partial P}{\\partial y} = \\frac{\\partial Q}{\\partial x}。$$",
      ),
      generate(rng: Rng): Problem {
        const cleanA = rng.nonZero(-25, 25);
        const cleanAns = 2 * cleanA;
        const cleanPrompt = t(
          `Find the value of the constant $k$ that makes the vector field $\\mathbf{F}(x, y) = \\left\\langle k x y, ${poly([cleanA, "x^2"], [2, "y^2"])} \\right\\rangle$ conservative on $\\mathbb{R}^2$.`,
          `求使向量场 $\\mathbf{F}(x, y) = \\left\\langle k x y, ${poly([cleanA, "x^2"], [2, "y^2"])} \\right\\rangle$ 在 $\\mathbb{R}^2$ 上为保守场的常数 $k$ 的值。`,
        );
        const cleanSolution = t(
          steps(
            `Compute $\\frac{\\partial P}{\\partial y} = \\frac{\\partial}{\\partial y}(kxy) = kx$.`,
            `Compute $\\frac{\\partial Q}{\\partial x} = \\frac{\\partial}{\\partial x}(${poly([cleanA, "x^2"], [2, "y^2"])}) = ${2 * cleanA}x$.`,
            `Set $\\frac{\\partial P}{\\partial y} = \\frac{\\partial Q}{\\partial x}$: $kx = ${2 * cleanA}x \\implies k = ${cleanAns}$.`,
          ),
          steps(
            `计算 $\\frac{\\partial P}{\\partial y} = \\frac{\\partial}{\\partial y}(kxy) = kx$。`,
            `计算 $\\frac{\\partial Q}{\\partial x} = \\frac{\\partial}{\\partial x}(${poly([cleanA, "x^2"], [2, "y^2"])}) = ${2 * cleanA}x$。`,
            `令 $\\frac{\\partial P}{\\partial y} = \\frac{\\partial Q}{\\partial x}$：$kx = ${2 * cleanA}x \\implies k = ${cleanAns}$。`,
          ),
        );
        return numberProblem({
          prompt: cleanPrompt,
          solution: cleanSolution,
          answer: cleanAns,
          wrong: [cleanA, -cleanAns, cleanAns + 1],
        });
      },
    },
  ],
};

/** calculatingPotentialFunctions finds a scalar potential by integration. */
export const calculatingPotentialFunctions: TopicDef = {
  id: "calculating-potential-functions",
  title: t("Calculating Potential Functions", "计算势函数"),
  summary: t(
    "A potential function f satisfies ∇f = F and is found by partial integration and comparing components.",
    "势函数 f 满足 ∇f = F，可通过偏积分和比较分量求得。",
  ),
  prerequisites: ["conservative-vector-fields-in-the-cartesian-plane"],
  encompasses: [{ topic: "conservative-vector-fields-in-the-cartesian-plane", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "finding-potential-functions-by-integration",
      title: t("Finding potential functions by integration", "通过积分求势函数"),
      explanation: t(
        "To find a potential function $f(x, y)$ such that $\\nabla f = \\langle P, Q \\rangle$:\n\n1. Integrate $P$ with respect to $x$: $f(x, y) = \\int P\\,dx + g(y)$.\n2. Differentiate with respect to $y$: $\\frac{\\partial f}{\\partial y} = Q(x, y)$ to determine $g'(y)$ and $g(y)$.",
        "求满足 $\\nabla f = \\langle P, Q \\rangle$ 的势函数 $f(x, y)$：\n\n1. 将 $P$ 对 $x$ 偏积分：$f(x, y) = \\int P\\,dx + g(y)$。\n2. 对 $y$ 求偏导：令 $\\frac{\\partial f}{\\partial y} = Q(x, y)$，从而确定 $g'(y)$ 和 $g(y)$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 4);
        const b = rng.nonZero(-3, 3);
        const c = rng.int(1, 4);

        // F = <2ax + by, bx + 2cy>
        // f(x, y) = a*x^2 + b*x*y + c*y^2
        const ans = poly([a, "x^2"], [b, "xy"], [c, "y^2"]);

        const prompt = t(
          `Find the potential function $f(x, y)$ satisfying $\\nabla f(x, y) = \\left\\langle ${poly([2 * a, "x"], [b, "y"])}, ${poly([b, "x"], [2 * c, "y"])} \\right\\rangle$ with $f(0, 0) = 0$.`,
          `求满足 $\\nabla f(x, y) = \\left\\langle ${poly([2 * a, "x"], [b, "y"])}, ${poly([b, "x"], [2 * c, "y"])} \\right\\rangle$ 且 $f(0, 0) = 0$ 的势函数 $f(x, y)$。`,
        );
        const solution = t(
          steps(
            `Integrate the first component $P = ${poly([2 * a, "x"], [b, "y"])}$ with respect to $x$:\n\n` +
              `$$f(x, y) = ${poly([a, "x^2"], [b, "xy"])} + g(y).$$`,
            `Differentiate with respect to $y$: $\\frac{\\partial f}{\\partial y} = ${poly([b, "x"])} + g'(y)$.`,
            `Match with $Q = ${poly([b, "x"], [2 * c, "y"])}$: $g'(y) = ${poly([2 * c, "y"])} \\implies g(y) = ${poly([c, "y^2"])} + C$.`,
            `Using $f(0, 0) = 0$ gives $C = 0$, so $f(x, y) = ${ans}$.`,
          ),
          steps(
            `将第一分量 $P = ${poly([2 * a, "x"], [b, "y"])}$ 对 $x$ 积分：\n\n` + `$$f(x, y) = ${poly([a, "x^2"], [b, "xy"])} + g(y)。$$`,
            `对 $y$ 求偏导：$\\frac{\\partial f}{\\partial y} = ${poly([b, "x"])} + g'(y)$。`,
            `与第二分量 $Q = ${poly([b, "x"], [2 * c, "y"])}$ 对比：$g'(y) = ${poly([2 * c, "y"])} \\implies g(y) = ${poly([c, "y^2"])} + C$。`,
            `由 $f(0, 0) = 0$ 得 $C = 0$，故 $f(x, y) = ${ans}$。`,
          ),
        );
        return expressionProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [poly([2 * a, "x^2"], [b, "xy"], [2 * c, "y^2"]), poly([a, "x^2"], [-b, "xy"], [c, "y^2"]), poly([a, "x^2"], [c, "y^2"])],
        });
      },
    },
  ],
};

/** connectedAndSimplyConnectedRegions topological properties of planar domains. */
export const connectedAndSimplyConnectedRegions: TopicDef = {
  id: "connected-and-simply-connected-regions",
  title: t("Connected and Simply-Connected Regions", "连通与单连通区域"),
  summary: t(
    "A region is connected if any two points can be joined by a path, and simply connected if every closed curve can be shrunk to a point without leaving the region.",
    "若区域内任意两点可用路径相连则为连通区域；若每条闭曲线均可在区域内连续收缩为一点（无孔洞）则为单连通区域。",
  ),
  prerequisites: ["conservative-vector-fields-in-the-cartesian-plane"],
  encompasses: [{ topic: "conservative-vector-fields-in-the-cartesian-plane", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "classifying-topological-properties-of-planar-regions",
      title: t("Classifying topological properties of planar regions", "分类平面区域的拓扑性质"),
      explanation: t(
        "A region $D$ in the plane is:\n\n- **Connected**: any two points in $D$ can be joined by a continuous curve lying entirely in $D$.\n- **Simply connected**: $D$ is connected and every simple closed curve in $D$ encloses only points in $D$ (intuitively, $D$ has no 'holes').",
        "平面区域 $D$：\n\n- **连通**：$D$ 内任意两点均可用完全位于 $D$ 内的连续曲线连接。\n- **单连通**：$D$ 连通，且 $D$ 内的任意简单闭曲线所围成的区域全属于 $D$（直观上，$D$ 没有“孔洞”）。",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(2, 9);
        const r1 = rng.int(1, 4);
        const r2 = rng.int(5, 10);
        const d = rng.int(2, 8);
        const scenarios = [
          {
            desc: t(`The open disk $x^2 + y^2 < ${R * R}$`, `开圆盘 $x^2 + y^2 < ${R * R}$`),
            right: t("Connected and simply connected", "连通且单连通"),
            wrong: [
              t("Connected but not simply connected", "连通但非单连通"),
              t("Simply connected but not connected", "单连通但非连通"),
              t("Neither connected nor simply connected", "既非连通亦非单连通"),
            ],
            reason: t("An open disk has no holes and is path-connected.", "开圆盘没有孔洞，且是道路连通的。"),
          },
          {
            desc: t(`The punctured disk $0 < x^2 + y^2 < ${R * R}$`, `去心圆盘 $0 < x^2 + y^2 < ${R * R}$`),
            right: t("Connected but not simply connected", "连通但非单连通"),
            wrong: [
              t("Connected and simply connected", "连通且单连通"),
              t("Neither connected nor simply connected", "既非连通亦非单连通"),
              t("Simply connected but not connected", "单连通但非连通"),
            ],
            reason: t(
              "The missing origin creates a hole, so a loop around it cannot be shrunk to a point in the region.",
              "原点的缺失形成了一个孔洞，围绕原点的闭曲线无法在区域内收缩为一点。",
            ),
          },
          {
            desc: t(`The open annulus $${r1 * r1} < x^2 + y^2 < ${r2 * r2}$`, `开圆环 $${r1 * r1} < x^2 + y^2 < ${r2 * r2}$`),
            right: t("Connected but not simply connected", "连通但非单连通"),
            wrong: [
              t("Connected and simply connected", "连通且单连通"),
              t("Neither connected nor simply connected", "既非连通亦非单连通"),
              t("Simply connected but not connected", "单连通但非连通"),
            ],
            reason: t(
              `The inner disk $x^2 + y^2 \\le ${r1 * r1}$ is a hole in the region.`,
              `内圆盘 $x^2 + y^2 \\le ${r1 * r1}$ 构成了该区域的一个孔洞。`,
            ),
          },
          {
            desc: t(
              `The union of two disjoint disks $(x-${d})^2 + y^2 < 1$ and $(x+${d})^2 + y^2 < 1$`,
              `两个互不相交的圆盘 $(x-${d})^2 + y^2 < 1$ 与 $(x+${d})^2 + y^2 < 1$ 的并集`,
            ),
            right: t("Neither connected nor simply connected", "既非连通亦非单连通"),
            wrong: [
              t("Connected and simply connected", "连通且单连通"),
              t("Connected but not simply connected", "连通但非单连通"),
              t("Simply connected but not connected", "单连通但非连通"),
            ],
            reason: t(
              "Points in different disks cannot be joined by a path inside the region.",
              "位于不同圆盘内的点无法通过区域内的路径相连。",
            ),
          },
        ];
        const item = rng.pick(scenarios);
        const prompt = t(
          `Classify the topological property of the following region in $\\mathbb{R}^2$: ${item.desc.en}.`,
          `对 $\\mathbb{R}^2$ 中的以下区域分类其拓扑性质：${item.desc["zh-CN"]}。`,
        );
        const solution = t(
          `The region is ${item.right.en.toLowerCase()} because ${item.reason.en.toLowerCase()}`,
          `该区域为${item.right["zh-CN"]}，因为${item.reason["zh-CN"]}。`,
        );
        return pickChoice(rng, prompt, item.right, item.wrong, solution);
      },
    },
  ],
};

/** streamFunctions covers the stream function for 2D divergence-free flows. */
export const streamFunctions: TopicDef = {
  id: "stream-functions",
  title: t("Stream Functions", "流函数"),
  summary: t(
    "For a 2D divergence-free field F = ⟨P, Q⟩, the stream function ψ satisfies P = ∂ψ/∂y and Q = -∂ψ/∂x, with level curves matching streamlines.",
    "对于二维无散场 F = ⟨P, Q⟩，流函数 ψ 满足 P = ∂ψ/∂y 且 Q = -∂ψ/∂x，其等值线即为流线。",
  ),
  prerequisites: ["calculating-potential-functions"],
  encompasses: [{ topic: "calculating-potential-functions", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "finding-stream-functions-for-incompressible-flows",
      title: t("Finding stream functions for incompressible flows", "求不可压缩流场的流函数"),
      explanation: t(
        "For a two-dimensional incompressible vector field $\\mathbf{F} = \\langle P, Q \\rangle$ with $\\frac{\\partial P}{\\partial x} + \\frac{\\partial Q}{\\partial y} = 0$, there exists a scalar stream function $\\psi(x, y)$ such that:\n\n$$P = \\frac{\\partial \\psi}{\\partial y}, \\quad Q = -\\frac{\\partial \\psi}{\\partial x}.$$ Level curves $\\psi(x, y) = C$ are the streamlines of the velocity field.",
        "对于满足 $\\frac{\\partial P}{\\partial x} + \\frac{\\partial Q}{\\partial y} = 0$ 的二维不可压缩向量场 $\\mathbf{F} = \\langle P, Q \\rangle$，存在标量流函数 $\\psi(x, y)$ 使得：\n\n$$P = \\frac{\\partial \\psi}{\\partial y}, \\quad Q = -\\frac{\\partial \\psi}{\\partial x}。$$ 等值线 $\\psi(x, y) = C$ 即为该速度场的流线。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);

        // F = <2 a y, 2 b x>
        // P = 2 a y = d psi / dy => psi = a y^2 + g(x)
        // Q = 2 b x = -d psi / dx => -g'(x) = 2 b x => g(x) = -b x^2
        // psi = a y^2 - b x^2
        const ans = poly([a, "y^2"], [-b, "x^2"]);

        const prompt = t(
          `Find the stream function $\\psi(x, y)$ with $\\psi(0, 0) = 0$ for the incompressible planar flow $\\mathbf{F}(x, y) = \\left\\langle ${2 * a}y, ${2 * b}x \\right\\rangle$, satisfying $P = \\frac{\\partial \\psi}{\\partial y}$ and $Q = -\\frac{\\partial \\psi}{\\partial x}$.`,
          `求满足 $P = \\frac{\\partial \\psi}{\\partial y}$ 与 $Q = -\\frac{\\partial \\psi}{\\partial x}$ 且 $\\psi(0, 0) = 0$ 的不可压缩平面流场 $\\mathbf{F}(x, y) = \\left\\langle ${2 * a}y, ${2 * b}x \\right\\rangle$ 的流函数 $\\psi(x, y)$。`,
        );
        const solution = t(
          steps(
            `From $P = \\frac{\\partial \\psi}{\\partial y} = ${2 * a}y$, integrate with respect to $y$: $\\psi(x, y) = ${poly([a, "y^2"])} + g(x)$.`,
            `Differentiate with respect to $x$: $\\frac{\\partial \\psi}{\\partial x} = g'(x)$.`,
            `Use $Q = -\\frac{\\partial \\psi}{\\partial x} = ${2 * b}x \\implies g'(x) = -${2 * b}x \\implies g(x) = ${poly([-b, "x^2"])} + C$.`,
            `Since $\\psi(0, 0) = 0$, $C = 0$. Thus $\\psi(x, y) = ${ans}$.`,
          ),
          steps(
            `由 $P = \\frac{\\partial \\psi}{\\partial y} = ${2 * a}y$，对 $y$ 积分得：$\\psi(x, y) = ${poly([a, "y^2"])} + g(x)$。`,
            `对 $x$ 求偏导：$\\frac{\\partial \\psi}{\\partial x} = g'(x)$。`,
            `由 $Q = -\\frac{\\partial \\psi}{\\partial x} = ${2 * b}x \\implies g'(x) = -${2 * b}x \\implies g(x) = ${poly([-b, "x^2"])} + C$。`,
            `由 $\\psi(0, 0) = 0$ 得 $C = 0$。因此 $\\psi(x, y) = ${ans}$。`,
          ),
        );
        return expressionProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [poly([a, "y^2"], [b, "x^2"]), poly([2 * a, "y^2"], [-2 * b, "x^2"]), poly([b, "y^2"], [-a, "x^2"])],
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 1.4 Divergence and Curl
// ---------------------------------------------------------------------------

/** theDivergenceOfAVectorField computes the divergence div F = ∇ · F. */
export const theDivergenceOfAVectorField: TopicDef = {
  id: "the-divergence-of-a-vector-field",
  title: t("The Divergence of a Vector Field", "向量场的散度"),
  summary: t(
    "The divergence div F = ∇ · F measures the net outward flux of a vector field per unit volume.",
    "散度 div F = ∇ · F 度量向量场单位体积向外的净通量。",
  ),
  prerequisites: ["vector-fields"],
  encompasses: [{ topic: "vector-fields", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-the-divergence-of-a-vector-field",
      title: t("Computing the divergence of a vector field", "计算向量场的散度"),
      explanation: t(
        "Divergence adds the rate of change of each component in its own direction, measuring how much the field spreads out from a point. For a three-dimensional vector field $\\mathbf{F} = \\langle P, Q, R \\rangle$, the divergence is the scalar field:\n\n$$\\operatorname{div}\\mathbf{F} = \\nabla \\cdot \\mathbf{F} = \\frac{\\partial P}{\\partial x} + \\frac{\\partial Q}{\\partial y} + \\frac{\\partial R}{\\partial z}.$$",
        "散度把每个分量沿自身方向的变化率加起来，衡量向量场从一点向外发散的程度。对于三维向量场 $\\mathbf{F} = \\langle P, Q, R \\rangle$，散度是由下式给出的标量场：\n\n$$\\operatorname{div}\\mathbf{F} = \\nabla \\cdot \\mathbf{F} = \\frac{\\partial P}{\\partial x} + \\frac{\\partial Q}{\\partial y} + \\frac{\\partial R}{\\partial z}。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const c = rng.nonZero(-3, 3);
        const pt: Vec3 = [rng.int(-2, 2), rng.int(-2, 2), rng.int(-2, 2)];

        const ans = 2 * a * pt[0] + 2 * b * pt[1] + 2 * c * pt[2];

        const prompt = t(
          `Compute the divergence $\\operatorname{div}\\mathbf{F}$ of the vector field $\\mathbf{F}(x, y, z) = \\left\\langle ${poly([a, "x^2"])}, ${poly([b, "y^2"])}, ${poly([c, "z^2"])} \\right\\rangle$ at the point $(${pt[0]}, ${pt[1]}, ${pt[2]})$.`,
          `计算向量场 $\\mathbf{F}(x, y, z) = \\left\\langle ${poly([a, "x^2"])}, ${poly([b, "y^2"])}, ${poly([c, "z^2"])} \\right\\rangle$ 在点 $(${pt[0]}, ${pt[1]}, ${pt[2]})$ 处的散度 $\\operatorname{div}\\mathbf{F}$。`,
        );
        const solution = t(
          steps(
            `Compute partial derivatives of the components:\n\n` +
              `$\\frac{\\partial P}{\\partial x} = ${2 * a}x$\n\n` +
              `$\\frac{\\partial Q}{\\partial y} = ${2 * b}y$\n\n` +
              `$\\frac{\\partial R}{\\partial z} = ${2 * c}z$`,
            `Sum the partial derivatives: $\\operatorname{div}\\mathbf{F} = ${poly([2 * a, "x"], [2 * b, "y"], [2 * c, "z"])}$.`,
            `Substitute $(${pt[0]}, ${pt[1]}, ${pt[2]})$: $\\operatorname{div}\\mathbf{F}(${pt[0]}, ${pt[1]}, ${pt[2]}) = ${2 * a}(${pt[0]}) + ${paren(2 * b)}(${pt[1]}) + ${paren(2 * c)}(${pt[2]}) = ${ans}$.`,
          ),
          steps(
            `求各分量的偏导数：\n\n` +
              `$\\frac{\\partial P}{\\partial x} = ${2 * a}x$\n\n` +
              `$\\frac{\\partial Q}{\\partial y} = ${2 * b}y$\n\n` +
              `$\\frac{\\partial R}{\\partial z} = ${2 * c}z$`,
            `将偏导数相加：$\\operatorname{div}\\mathbf{F} = ${poly([2 * a, "x"], [2 * b, "y"], [2 * c, "z"])}$。`,
            `代入点 $(${pt[0]}, ${pt[1]}, ${pt[2]})$：$\\operatorname{div}\\mathbf{F}(${pt[0]}, ${pt[1]}, ${pt[2]}) = ${2 * a}(${pt[0]}) + ${paren(2 * b)}(${pt[1]}) + ${paren(2 * c)}(${pt[2]}) = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [a * pt[0] + b * pt[1] + c * pt[2], -ans, ans + 2],
        });
      },
    },
  ],
};

/** propertiesOfTheDivergenceOperator explores properties and solenoidal fields. */
export const propertiesOfTheDivergenceOperator: TopicDef = {
  id: "properties-of-the-divergence-operator",
  title: t("Properties of the Divergence Operator", "散度算子的性质"),
  summary: t(
    "Divergence is linear, obeys product rules with scalar fields, and characterizes incompressible (solenoidal) flows when div F = 0.",
    "散度具有线性性，满足与标量场的乘积法则，当 div F = 0 时表征不可压缩（无散）流场。",
  ),
  prerequisites: ["the-divergence-of-a-vector-field"],
  encompasses: [{ topic: "the-divergence-of-a-vector-field", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "solenoidal-fields-and-divergence-properties",
      title: t("Solenoidal fields and divergence properties", "无散场与散度性质"),
      explanation: t(
        "A field with zero divergence neither creates nor destroys flow at any point, like an incompressible fluid that only moves around. A vector field $\\mathbf{F}$ is called **solenoidal** or **incompressible** if $\\operatorname{div}\\mathbf{F} = \\nabla \\cdot \\mathbf{F} = 0$ everywhere.",
        "散度为零的向量场在任何一点既不产生也不消灭流量，就像只会流动的不可压缩流体。若向量场 $\\mathbf{F}$ 处处满足 $\\operatorname{div}\\mathbf{F} = \\nabla \\cdot \\mathbf{F} = 0$，则称其为**无散场**或**不可压缩场**。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-5, 5);
        const b = rng.nonZero(-5, 5);
        const ans = -(a + b);

        const prompt = t(
          `Find the value of the constant $k$ that makes the vector field $\\mathbf{F}(x, y, z) = \\left\\langle ${poly([a, "x"], [2, "y"])}, ${poly([b, "y"], [-3, "z"])}, ${poly([1, "kx"], [1, "z"])} \\right\\rangle$ solenoidal (incompressible) everywhere, where the third component is $kx + z$ with $k$ as the coefficient of $z$. That is, $\\mathbf{F}(x, y, z) = \\langle ${poly([a, "x"], [2, "y"])}, ${poly([b, "y"], [-3, "z"])}, x + kz \\rangle$.`,
          `求使向量场 $\\mathbf{F}(x, y, z) = \\langle ${poly([a, "x"], [2, "y"])}, ${poly([b, "y"], [-3, "z"])}, x + kz \\rangle$ 处处无散（不可压缩）的常数 $k$ 的值。`,
        );
        const solution = t(
          steps(
            `A vector field is solenoidal when $\\operatorname{div}\\mathbf{F} = 0$.`,
            `Compute $\\operatorname{div}\\mathbf{F} = \\frac{\\partial}{\\partial x}(${poly([a, "x"], [2, "y"])}) + \\frac{\\partial}{\\partial y}(${poly([b, "y"], [-3, "z"])}) + \\frac{\\partial}{\\partial z}(x + kz)$.`,
            `$\\operatorname{div}\\mathbf{F} = ${a} + (${b}) + k = ${a + b} + k$.`,
            `Setting $\\operatorname{div}\\mathbf{F} = 0$ gives $k = ${ans}$.`,
          ),
          steps(
            `当 $\\operatorname{div}\\mathbf{F} = 0$ 时，向量场为无散场。`,
            `计算 $\\operatorname{div}\\mathbf{F} = \\frac{\\partial}{\\partial x}(${poly([a, "x"], [2, "y"])}) + \\frac{\\partial}{\\partial y}(${poly([b, "y"], [-3, "z"])}) + \\frac{\\partial}{\\partial z}(x + kz)$。`,
            `$\\operatorname{div}\\mathbf{F} = ${a} + (${b}) + k = ${a + b} + k$。`,
            `令 $\\operatorname{div}\\mathbf{F} = 0$ 得 $k = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [a + b, a - b, b - a],
        });
      },
    },
  ],
};

/** theCurlOfAVectorField computes the curl of a vector field in 3D. */
export const theCurlOfAVectorField: TopicDef = {
  id: "the-curl-of-a-vector-field",
  title: t("The Curl of a Vector Field", "向量场的旋度"),
  summary: t(
    "The curl of F, curl F = ∇ × F, is a vector field measuring the tendency of particles to rotate about each point.",
    "F 的旋度 curl F = ∇ × F 是一个度量流体微元在各点附近旋转趋势的向量场。",
  ),
  prerequisites: ["the-cross-product-of-two-vectors", "vector-fields"],
  encompasses: [{ topic: "vector-fields", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-the-curl-of-a-vector-field",
      title: t("Computing the curl of a vector field", "计算向量场的旋度"),
      explanation: t(
        "Curl measures how much a field rotates around each point, and the determinant pattern is a convenient way to remember its three components. For a vector field $\\mathbf{F} = \\langle P, Q, R \\rangle$ in $\\mathbb{R}^3$, the curl is defined by the formal determinant:\n\n$$\\operatorname{curl}\\mathbf{F} = \\nabla \\times \\mathbf{F} = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ \\frac{\\partial}{\\partial x} & \\frac{\\partial}{\\partial y} & \\frac{\\partial}{\\partial z} \\\\ P & Q & R \\end{vmatrix} = \\left\\langle \\frac{\\partial R}{\\partial y} - \\frac{\\partial Q}{\\partial z}, \\frac{\\partial P}{\\partial z} - \\frac{\\partial R}{\\partial x}, \\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} \\right\\rangle.$$",
        "旋度衡量向量场绕每一点旋转的程度，行列式的形式是记住它三个分量的方便方法。对于 $\\mathbb{R}^3$ 中的向量场 $\\mathbf{F} = \\langle P, Q, R \\rangle$，旋度通过形式行列式定义：\n\n$$\\operatorname{curl}\\mathbf{F} = \\nabla \\times \\mathbf{F} = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ \\frac{\\partial}{\\partial x} & \\frac{\\partial}{\\partial y} & \\frac{\\partial}{\\partial z} \\\\ P & Q & R \\end{vmatrix} = \\left\\langle \\frac{\\partial R}{\\partial y} - \\frac{\\partial Q}{\\partial z}, \\frac{\\partial P}{\\partial z} - \\frac{\\partial R}{\\partial x}, \\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} \\right\\rangle。$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const c = rng.nonZero(-3, 3);
        const pt: Vec3 = [rng.int(-2, 2), rng.int(-2, 2), rng.int(-2, 2)];

        // F = <a y z, b x z, c x y>
        // dR/dy = cx, dQ/dz = bx => (c - b) x
        // dP/dz = ay, dR/dx = cy => (a - c) y
        // dQ/dx = bz, dP/dy = az => (b - a) z
        const ansX = (c - b) * pt[0];
        const ansY = (a - c) * pt[1];
        const ansZ = (b - a) * pt[2];
        const answer: Vec3 = [ansX, ansY, ansZ];

        const prompt = t(
          `Calculate the curl $\\operatorname{curl}\\mathbf{F}$ of the vector field $\\mathbf{F}(x, y, z) = \\langle ${poly([a, "yz"])}, ${poly([b, "xz"])}, ${poly([c, "xy"])} \\rangle$ at the point $(${pt[0]}, ${pt[1]}, ${pt[2]})$. Express your answer as a vector $\\langle x, y, z \\rangle$.`,
          `计算向量场 $\\mathbf{F}(x, y, z) = \\langle ${poly([a, "yz"])}, ${poly([b, "xz"])}, ${poly([c, "xy"])} \\rangle$ 在点 $(${pt[0]}, ${pt[1]}, ${pt[2]})$ 处的旋度 $\\operatorname{curl}\\mathbf{F}$。结果以向量 $\\langle x, y, z \\rangle$ 表示。`,
        );
        const solution = t(
          steps(
            `Apply the curl formula $\\nabla \\times \\mathbf{F} = \\left\\langle \\frac{\\partial R}{\\partial y} - \\frac{\\partial Q}{\\partial z}, \\frac{\\partial P}{\\partial z} - \\frac{\\partial R}{\\partial x}, \\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} \\right\\rangle$:`,
            `$\\mathbf{i}$-component: $\\frac{\\partial}{\\partial y}(${poly([c, "xy"])}) - \\frac{\\partial}{\\partial z}(${poly([b, "xz"])}) = ${poly([c, "x"], [-b, "x"])} = ${poly([c - b, "x"])}$`,
            `$\\mathbf{j}$-component: $\\frac{\\partial}{\\partial z}(${poly([a, "yz"])}) - \\frac{\\partial}{\\partial x}(${poly([c, "xy"])}) = ${poly([a, "y"], [-c, "y"])} = ${poly([a - c, "y"])}$`,
            `$\\mathbf{k}$-component: $\\frac{\\partial}{\\partial x}(${poly([b, "xz"])}) - \\frac{\\partial}{\\partial y}(${poly([a, "yz"])}) = ${poly([b, "z"], [-a, "z"])} = ${poly([b - a, "z"])}$`,
            `Evaluate at $(${pt[0]}, ${pt[1]}, ${pt[2]})$ to obtain $${v3L(answer)}$.`,
          ),
          steps(
            `应用旋度公式 $\\nabla \\times \\mathbf{F} = \\left\\langle \\frac{\\partial R}{\\partial y} - \\frac{\\partial Q}{\\partial z}, \\frac{\\partial P}{\\partial z} - \\frac{\\partial R}{\\partial x}, \\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} \\right\\rangle$：`,
            `$\\mathbf{i}$ 分量：$\\frac{\\partial}{\\partial y}(${poly([c, "xy"])}) - \\frac{\\partial}{\\partial z}(${poly([b, "xz"])}) = ${poly([c, "x"], [-b, "x"])} = ${poly([c - b, "x"])}$`,
            `$\\mathbf{j}$ 分量：$\\frac{\\partial}{\\partial z}(${poly([a, "yz"])}) - \\frac{\\partial}{\\partial x}(${poly([c, "xy"])}) = ${poly([a, "y"], [-c, "y"])} = ${poly([a - c, "y"])}$`,
            `$\\mathbf{k}$ 分量：$\\frac{\\partial}{\\partial x}(${poly([b, "xz"])}) - \\frac{\\partial}{\\partial y}(${poly([a, "yz"])}) = ${poly([b, "z"], [-a, "z"])} = ${poly([b - a, "z"])}$`,
            `在点 $(${pt[0]}, ${pt[1]}, ${pt[2]})$ 处求值得到 $${v3L(answer)}$。`,
          ),
        );
        return pointProblem({
          prompt,
          solution,
          answer,
          vector: true,
          vars: ["x", "y", "z"],
          wrong: [
            [-ansX, -ansY, -ansZ],
            [ansY, ansX, ansZ],
            [0, 0, 0],
          ],
        });
      },
    },
  ],
};

/** propertiesOfTheCurlOperator fundamental identities curl(grad f) = 0 and div(curl F) = 0. */
export const propertiesOfTheCurlOperator: TopicDef = {
  id: "properties-of-the-curl-operator",
  title: t("Properties of the Curl Operator", "旋度算子的性质"),
  summary: t(
    "Curl is linear, satisfies curl(∇f) = 0 (gradient fields are irrotational), and div(curl F) = 0 (curl fields are solenoidal).",
    "旋度算子是线性的，满足 curl(∇f) = 0（梯度场无旋）以及 div(curl F) = 0（旋度场无散）。",
  ),
  prerequisites: ["the-curl-of-a-vector-field", "properties-of-the-divergence-operator"],
  encompasses: [{ topic: "the-curl-of-a-vector-field", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "identities-and-irrotational-fields",
      title: t("Identities and irrotational fields", "重要恒等式与无旋场"),
      explanation: t(
        "Two fundamental differential identities link grad, curl, and div:\n\n1. $\\operatorname{curl}(\\nabla f) = \\mathbf{0}$ for every twice continuously differentiable scalar function $f$. A vector field with $\\operatorname{curl}\\mathbf{F} = \\mathbf{0}$ is called **irrotational**.\n2. $\\operatorname{div}(\\operatorname{curl}\\mathbf{F}) = 0$ for every twice continuously differentiable vector field $\\mathbf{F}$.",
        "梯度、旋度与散度之间有两个基本微分恒等式：\n\n1. 对任意二阶连续可微标量函数 $f$，有 $\\operatorname{curl}(\\nabla f) = \\mathbf{0}$。满足 $\\operatorname{curl}\\mathbf{F} = \\mathbf{0}$ 的向量场称为**无旋场**。\n2. 对任意二阶连续可微向量场 $\\mathbf{F}$，有 $\\operatorname{div}(\\operatorname{curl}\\mathbf{F}) = 0$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-25, 25);
        const ans = a;

        const prompt = t(
          `Find the constant $k$ that makes the vector field $\\mathbf{F}(x, y, z) = \\langle ${poly([a, "y"])}, kx, 3z^2 \\rangle$ irrotational (that is, $\\operatorname{curl}\\mathbf{F} = \\mathbf{0}$).`,
          `求使向量场 $\\mathbf{F}(x, y, z) = \\langle ${poly([a, "y"])}, kx, 3z^2 \\rangle$ 为无旋场（即 $\\operatorname{curl}\\mathbf{F} = \\mathbf{0}$）的常数 $k$ 的值。`,
        );
        const solution = t(
          steps(
            `A vector field is irrotational if $\\operatorname{curl}\\mathbf{F} = \\nabla \\times \\mathbf{F} = \\mathbf{0}$.`,
            `Compute the components of $\\operatorname{curl}\\mathbf{F}$:\n\n` +
              `$\\mathbf{i}$-component: $\\frac{\\partial}{\\partial y}(3z^2) - \\frac{\\partial}{\\partial z}(kx) = 0 - 0 = 0$.\n\n` +
              `$\\mathbf{j}$-component: $\\frac{\\partial}{\\partial z}(${poly([a, "y"])}) - \\frac{\\partial}{\\partial x}(3z^2) = 0 - 0 = 0$.\n\n` +
              `$\\mathbf{k}$-component: $\\frac{\\partial}{\\partial x}(kx) - \\frac{\\partial}{\\partial y}(${poly([a, "y"])}) = k - (${a})$.`,
            `For $\\operatorname{curl}\\mathbf{F} = \\mathbf{0}$, the $\\mathbf{k}$-component must vanish: $${poly([1, "k"], [-a, ""])} = 0 \\implies k = ${ans}$.`,
          ),
          steps(
            `当 $\\operatorname{curl}\\mathbf{F} = \\nabla \\times \\mathbf{F} = \\mathbf{0}$ 时，向量场为无旋场。`,
            `计算 $\\operatorname{curl}\\mathbf{F}$ 的各分量：\n\n` +
              `$\\mathbf{i}$ 分量：$\\frac{\\partial}{\\partial y}(3z^2) - \\frac{\\partial}{\\partial z}(kx) = 0 - 0 = 0$。\n\n` +
              `$\\mathbf{j}$ 分量：$\\frac{\\partial}{\\partial z}(${poly([a, "y"])}) - \\frac{\\partial}{\\partial x}(3z^2) = 0 - 0 = 0$。\n\n` +
              `$\\mathbf{k}$ 分量：$\\frac{\\partial}{\\partial x}(kx) - \\frac{\\partial}{\\partial y}(${poly([a, "y"])}) = k - (${a})$。`,
            `要使 $\\operatorname{curl}\\mathbf{F} = \\mathbf{0}$，$\\mathbf{k}$ 分量必须为零：$${poly([1, "k"], [-a, ""])} = 0 \\implies k = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [-ans, ans + 1, 0],
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Exported list of all Unit 1 topics
// ---------------------------------------------------------------------------

/** multivariableCalculusVectorFunctionTopics contains all Unit 1 topics of Multivariable Calculus. */
export const multivariableCalculusVectorFunctionTopics: readonly TopicDef[] = [
  theDomainOfAVectorValuedFunction,
  continuityAndDifferentiabilityOfVectorValuedFunctions,
  differentiationRulesForVectorValuedFunctions,
  integrationRulesForVectorValuedFunctions,
  theArcLengthOfAVectorValuedFunction,
  tangentVectorsAndTangentLinesToCurves,
  unitTangentVectors,
  principalNormalVectors,
  binormalVectors,
  theOsculatingPlane,
  parameterizationByArcLength,
  introductionToCurvature,
  findingCurvatureUsingTheCrossProduct,
  radiusOfCurvature,
  theCurvatureOfAPlaneCurve,
  vectorFields,
  visualizingVectorFields,
  gradientVectorFields,
  conservativeVectorFieldsInTheCartesianPlane,
  calculatingPotentialFunctions,
  connectedAndSimplyConnectedRegions,
  streamFunctions,
  theDivergenceOfAVectorField,
  propertiesOfTheDivergenceOperator,
  theCurlOfAVectorField,
  propertiesOfTheCurlOperator,
];
