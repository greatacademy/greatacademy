import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { choiceProblem } from "../problems.ts";

// Precalculus unit 5: Vectors (modules 5.16 and 5.17: 2D Vectors).

function oneOf(rng: Rng, prompt: Text, right: Text, wrong: readonly Text[], solution: Text): Problem {
  const seen = new Set([right.en]);
  const rest: Text[] = [];
  for (const w of wrong) {
    if (!seen.has(w.en)) {
      seen.add(w.en);
      rest.push(w);
    }
  }
  const options = [right, ...rest.slice(0, 3)];
  const order = rng.shuffle(options.map((_, i) => i));
  return choiceProblem({ prompt, options: order.map((i) => options[i]!), correct: order.indexOf(0), solution });
}

// ─── 5.16.1 Introduction to Vectors ─────────────────────────────────────────

/** introductionToVectors covers vector concepts, notations, and initial/terminal points. */
export const introductionToVectors: TopicDef = {
  id: "introduction-to-vectors",
  title: t("Introduction to Vectors", "向量的概念与表示"),
  summary: t(
    "Understand vectors as directed line segments with magnitude and direction, distinguish between scalar and vector quantities, and identify initial and terminal points.",
    "理解向量作为有向线段（既有大小又有方向）的概念，区分标量与向量，并识别向量的起点与终点。",
  ),
  prerequisites: ["the-pythagorean-theorem"],
  encompasses: [{ topic: "the-pythagorean-theorem", weight: 0.2 }],
  xp: 16,
  standards: ["CCSS.HSN.VM.A.1"],
  knowledgePoints: [
    {
      id: "scalars-versus-vectors",
      title: t("Distinguish between scalars and vectors", "区分标量与向量"),
      explanation: t(
        "A **scalar** is a quantity described completely by its magnitude (a numerical value with units, such as mass, temperature, time, distance, or speed).\n\nA **vector** is a quantity that possesses both **magnitude** and **direction** (such as displacement, velocity, acceleration, force, or momentum).",
        "**标量**是仅由大小（数值和单位）完全确定的物理量，如质量、温度、时间、路程或速率。\n\n**向量**（矢量）是既有**大小**又有**方向**的量，如位移、速度、加速度、力或动量等。",
      ),
      generate(rng) {
        const item = rng.pick([
          {
            desc: (v: number) => ({
              en: `A car traveling at $${v}\\text{ km/h}$ due north`,
              zh: `一辆汽车以 $${v}\\text{ km/h}$ 向正北行驶`,
            }),
            isVector: true,
            concept: { en: "velocity", zh: "速度" },
          },
          {
            desc: (v: number) => ({ en: `A temperature reading of $${v}^\\circ\\text{C}$`, zh: `温度计读数为 $${v}^\\circ\\text{C}$` }),
            isVector: false,
            concept: { en: "temperature", zh: "温度" },
          },
          {
            desc: (v: number) => ({
              en: `A downward gravitational force of $${v}\\text{ N}$`,
              zh: `一个大小为 $${v}\\text{ N}$ 向下的重力`,
            }),
            isVector: true,
            concept: { en: "force", zh: "力" },
          },
          {
            desc: (v: number) => ({ en: `A gold bar with a mass of $${v}\\text{ kg}$`, zh: `一块质量为 $${v}\\text{ kg}$ 的金条` }),
            isVector: false,
            concept: { en: "mass", zh: "质量" },
          },
          {
            desc: (v: number) => ({
              en: `An airplane flying with a speed of $${v}\\text{ knots}$ at a bearing of $120^\\circ$`,
              zh: `一架飞机以 $${v}\\text{ 节}$ 的速率沿方位角 $120^\\circ$ 飞行`,
            }),
            isVector: true,
            concept: { en: "velocity", zh: "速度" },
          },
          {
            desc: (v: number) => ({
              en: `A road trip spanning a total distance of $${v}\\text{ miles}$`,
              zh: `一段总路程为 $${v}\\text{ 英里}$ 的公路旅行`,
            }),
            isVector: false,
            concept: { en: "distance", zh: "路程" },
          },
          {
            desc: (v: number) => ({
              en: `A runner accelerating at $${v}\\text{ m/s}^2$ eastward`,
              zh: `一名跑步者以 $${v}\\text{ m/s}^2$ 向东加速`,
            }),
            isVector: true,
            concept: { en: "acceleration", zh: "加速度" },
          },
          {
            desc: (v: number) => ({ en: `An elapsed time interval of $${v}\\text{ seconds}$`, zh: `经过了 $${v}\\text{ 秒}$ 的时间间隔` }),
            isVector: false,
            concept: { en: "time", zh: "时间" },
          },
          {
            desc: (v: number) => ({
              en: `A water tank with a capacity of $${v}\\text{ liters}$`,
              zh: `一个容量为 $${v}\\text{ 升}$ 的水箱`,
            }),
            isVector: false,
            concept: { en: "volume", zh: "体积" },
          },
          {
            desc: (v: number) => ({
              en: `A wind blowing at $${v}\\text{ mph}$ toward the southwest`,
              zh: `以 $${v}\\text{ mph}$ 吹向西南方向的风`,
            }),
            isVector: true,
            concept: { en: "velocity", zh: "速度" },
          },
          {
            desc: (v: number) => ({
              en: `A person pushing a crate with $${v}\\text{ N}$ of force horizontally to the right`,
              zh: `一人用 $${v}\\text{ N}$ 的力水平向右推箱子`,
            }),
            isVector: true,
            concept: { en: "force", zh: "力" },
          },
          {
            desc: (v: number) => ({
              en: `A light bulb consuming $${v}\\text{ joules}$ of electrical energy`,
              zh: `一个灯泡消耗了 $${v}\\text{ 焦耳}$ 的电能`,
            }),
            isVector: false,
            concept: { en: "energy", zh: "能量" },
          },
        ]);
        const val = rng.pick([15, 24, 35, 42, 50, 68, 75, 84, 96, 110, 125, 250]);
        const d = item.desc(val);
        const isVec = item.isVector;

        const right = isVec
          ? t("Vector, because it has both magnitude and direction.", "向量，因为它既有大小又有方向。")
          : t("Scalar, because it has magnitude but no direction.", "标量，因为它只有大小而没有方向。");

        const wrong = isVec
          ? [
              t("Scalar, because it only has magnitude.", "标量，因为只有大小。"),
              t("Scalar, because all physical measurements are scalars.", "标量，因为所有物理测量值都是标量。"),
              t("Vector, because it has no magnitude.", "向量，因为没有大小。"),
            ]
          : [
              t("Vector, because it specifies a physical measurement.", "向量，因为它表示一个物理测量值。"),
              t("Vector, because it has both magnitude and direction.", "向量，因为它既有大小又有方向。"),
              t("Scalar, because it has direction but no magnitude.", "标量，因为它有方向但没有大小。"),
            ];

        return oneOf(
          rng,
          t(`Determine whether the given quantity is a scalar or a vector: "${d.en}".`, `判断下列物理量是标量还是向量："${d.zh}"。`),
          right,
          wrong,
          t(
            isVec
              ? `The quantity specifies both a magnitude ($${val}$) and a specific direction, making it a vector quantity (${item.concept.en}).`
              : `The quantity specifies only a magnitude ($${val}$) without any spatial direction, making it a scalar quantity (${item.concept.en}).`,
            isVec
              ? `该量同时指明了大小（$${val}$）和特定方向，因此是一个向量（${item.concept.zh}）。`
              : `该量仅指明了数值大小（$${val}$），没有空间方向，因此是一个标量（${item.concept.zh}）。`,
          ),
        );
      },
    },
    {
      id: "initial-and-terminal-points",
      title: t("Identify initial and terminal points of a directed line segment", "确定有向线段的起点与终点"),
      explanation: t(
        "A directed line segment representing vector $\\vec{AB}$ originates at point $A$ (**initial point** or tail) and points to point $B$ (**terminal point** or head).\n\nThe opposite vector $-\\vec{AB}$ has reversed direction: $-\\vec{AB} = \\vec{BA}$, with initial point $B$ and terminal point $A$.",
        "表示向量 $\\vec{AB}$ 的有向线段始于点 $A$（**起点**），指向点 $B$（**终点**）。\n\n相反向量 $-\\vec{AB}$ 的方向相反：$-\\vec{AB} = \\vec{BA}$，其起点为 $B$，终点为 $A$。",
      ),
      generate(rng) {
        const letters = ["A", "B", "C", "D", "P", "Q", "R", "S", "M", "N"];
        const p1 = rng.pick(letters);
        let p2 = rng.pick(letters);
        while (p2 === p1) p2 = rng.pick(letters);

        const mode = rng.pick(["identify", "opposite"]);
        if (mode === "identify") {
          return oneOf(
            rng,
            t(
              `For the directed line segment representing the vector $\\vec{${p1}${p2}}$, identify its initial point and terminal point.`,
              `对于表示向量 $\\vec{${p1}${p2}}$ 的有向线段，确定其起点和终点。`,
            ),
            t(`Initial point: $${p1}$, Terminal point: $${p2}$`, `起点：$${p1}$，终点：$${p2}$`),
            [
              t(`Initial point: $${p2}$, Terminal point: $${p1}$`, `起点：$${p2}$，终点：$${p1}$`),
              t(`Initial point: $${p1}$, Terminal point: the origin`, `起点：$${p1}$，终点：原点`),
              t(`Initial point: the origin, Terminal point: $${p2}$`, `起点：原点，终点：$${p2}$`),
            ],
            t(
              `In the notation $\\vec{${p1}${p2}}$, the first letter $${p1}$ indicates the initial point and the second letter $${p2}$ indicates the terminal point.`,
              `在符号 $\\vec{${p1}${p2}}$ 中，首字母 $${p1}$ 表示起点，第二个字母 $${p2}$ 表示终点。`,
            ),
          );
        }

        return oneOf(
          rng,
          t(
            `Which directed line segment represents the opposite (negative) vector of $\\vec{${p1}${p2}}$?`,
            `哪个有向线段表示向量 $\\vec{${p1}${p2}}$ 的相反向量？`,
          ),
          t(`$\\vec{${p2}${p1}}$`, `$\\vec{${p2}${p1}}$`),
          [
            t(`$\\vec{${p1}${p2}}$`, `$\\vec{${p1}${p2}}$`),
            t(`$\\vec{${p1}${p1}}$`, `$\\vec{${p1}${p1}}$`),
            t(`$\\vec{${p2}${p2}}$`, `$\\vec{${p2}${p2}}$`),
          ],
          t(
            `The opposite vector has the same length but opposite direction, reversing initial and terminal points: $-\\vec{${p1}${p2}} = \\vec{${p2}${p1}}$.`,
            `相反向量具有相同长度但方向相反，起点和终点互换：$-\\vec{${p1}${p2}} = \\vec{${p2}${p1}}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 5.16.2 The Triangle Law for the Addition of Two Vectors ────────────────

/** theTriangleLawForTheAdditionOfTwoVectors covers head-to-tail addition and parallelogram law. */
export const theTriangleLawForTheAdditionOfTwoVectors: TopicDef = {
  id: "the-triangle-law-for-the-addition-of-two-vectors",
  title: t("The Triangle Law for the Addition of Two Vectors", "向量加法的三角形法则"),
  summary: t(
    "Apply the triangle law and the parallelogram law to find the resultant sum and difference of vectors.",
    "应用三角形法则与平行四边形法则求解向量的和（合向量）与差。",
  ),
  prerequisites: ["introduction-to-vectors"],
  encompasses: [{ topic: "introduction-to-vectors", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSN.VM.B.4"],
  knowledgePoints: [
    {
      id: "triangle-law-head-to-tail",
      title: t("Apply the triangle law (head-to-tail addition)", "应用向量加法的三角形法则（首尾相接）"),
      explanation: t(
        "By the **triangle law** of vector addition, placing the tail of vector $\\vec{BC}$ at the head of vector $\\vec{AB}$ results in the sum:\n\n$$\\vec{AB} + \\vec{BC} = \\vec{AC}$$\n\nFor vector subtraction: $\\vec{AB} - \\vec{AC} = \\vec{AB} + \\vec{CA} = \\vec{CB}$.",
        "根据向量加法的**三角形法则**，将向量 $\\vec{BC}$ 的起点接在向量 $\\vec{AB}$ 的终点上，其和向量为：\n\n$$\\vec{AB} + \\vec{BC} = \\vec{AC}$$\n\n对于向量减法：$$\\vec{AB} - \\vec{AC} = \\vec{AB} + \\vec{CA} = \\vec{CB}$$。",
      ),
      generate(rng) {
        const letters = ["A", "B", "C", "D", "E", "P", "Q", "R", "S"];
        const p1 = rng.pick(letters);
        let p2 = rng.pick(letters);
        while (p2 === p1) p2 = rng.pick(letters);
        let p3 = rng.pick(letters);
        while (p3 === p1 || p3 === p2) p3 = rng.pick(letters);
        let p4 = rng.pick(letters);
        while (p4 === p1 || p4 === p2 || p4 === p3) p4 = rng.pick(letters);

        const kind = rng.pick(["two-sum", "three-sum", "subtraction"]);
        if (kind === "two-sum") {
          return oneOf(
            rng,
            t(
              `Simplify the vector expression: $\\vec{${p1}${p2}} + \\vec{${p2}${p3}}$.`,
              `化简向量表达式：$\\vec{${p1}${p2}} + \\vec{${p2}${p3}}$。`,
            ),
            t(`$\\vec{${p1}${p3}}$`, `$\\vec{${p1}${p3}}$`),
            [
              t(`$\\vec{${p3}${p1}}$`, `$\\vec{${p3}${p1}}$`),
              t(`$\\vec{${p2}${p3}}$`, `$\\vec{${p2}${p3}}$`),
              t(`$\\vec{${p1}${p2}}$`, `$\\vec{${p1}${p2}}$`),
            ],
            t(
              `By the triangle law, connecting the head of $\\vec{${p1}${p2}}$ to the tail of $\\vec{${p2}${p3}}$ yields $\\vec{${p1}${p3}}$.`,
              `由三角形法则，首尾相接：$\\vec{${p1}${p2}} + \\vec{${p2}${p3}} = \\vec{${p1}${p3}}$。`,
            ),
          );
        }

        if (kind === "three-sum") {
          return oneOf(
            rng,
            t(
              `Simplify the chain of vectors: $\\vec{${p1}${p2}} + \\vec{${p2}${p3}} + \\vec{${p3}${p4}}$.`,
              `化简向量连加表达式：$\\vec{${p1}${p2}} + \\vec{${p2}${p3}} + \\vec{${p3}${p4}}$。`,
            ),
            t(`$\\vec{${p1}${p4}}$`, `$\\vec{${p1}${p4}}$`),
            [
              t(`$\\vec{${p4}${p1}}$`, `$\\vec{${p4}${p1}}$`),
              t(`$\\vec{${p1}${p3}}$`, `$\\vec{${p1}${p3}}$`),
              t(`$\\vec{${p2}${p4}}$`, `$\\vec{${p2}${p4}}$`),
            ],
            t(
              `Applying the triangle law repeatedly gives $(\\vec{${p1}${p2}} + \\vec{${p2}${p3}}) + \\vec{${p3}${p4}} = \\vec{${p1}${p3}} + \\vec{${p3}${p4}} = \\vec{${p1}${p4}}$.`,
              `连续应用三角形法则：$(\\vec{${p1}${p2}} + \\vec{${p2}${p3}}) + \\vec{${p3}${p4}} = \\vec{${p1}${p3}} + \\vec{${p3}${p4}} = \\vec{${p1}${p4}}$。`,
            ),
          );
        }

        return oneOf(
          rng,
          t(
            `Simplify the vector subtraction: $\\vec{${p1}${p2}} - \\vec{${p1}${p3}}$.`,
            `化简向量减法表达式：$\\vec{${p1}${p2}} - \\vec{${p1}${p3}}$。`,
          ),
          t(`$\\vec{${p3}${p2}}$`, `$\\vec{${p3}${p2}}$`),
          [
            t(`$\\vec{${p2}${p3}}$`, `$\\vec{${p2}${p3}}$`),
            t(`$\\vec{${p1}${p2}}$`, `$\\vec{${p1}${p2}}$`),
            t(`$\\vec{${p1}${p3}}$`, `$\\vec{${p1}${p3}}$`),
          ],
          t(
            `Recall that $-\\vec{${p1}${p3}} = \\vec{${p3}${p1}}$. Therefore, $\\vec{${p1}${p2}} - \\vec{${p1}${p3}} = \\vec{${p3}${p1}} + \\vec{${p1}${p2}} = \\vec{${p3}${p2}}$.`,
            `因为 $-\\vec{${p1}${p3}} = \\vec{${p3}${p1}}$，所以 $\\vec{${p1}${p2}} - \\vec{${p1}${p3}} = \\vec{${p3}${p1}} + \\vec{${p1}${p2}} = \\vec{${p3}${p2}}$。`,
          ),
        );
      },
    },
    {
      id: "parallelogram-law-resultant",
      title: t("Apply the parallelogram law of vector addition", "应用向量加法的平行四边形法则"),
      explanation: t(
        "In a parallelogram $ABCD$ with adjacent edges representing vectors $\\mathbf{u} = \\vec{AB}$ and $\\mathbf{v} = \\vec{AD}$:\n\n- The main diagonal starting from $A$ represents the sum: $\\vec{AC} = \\mathbf{u} + \\mathbf{v}$\n- The diagonal $\\vec{BD}$ represents the difference: $\\vec{BD} = \\vec{AD} - \\vec{AB} = \\mathbf{v} - \\mathbf{u}$",
        "在以相邻边表示向量 $\\mathbf{u} = \\vec{AB}$ 和 $\\mathbf{v} = \\vec{AD}$ 的平行四边形 $ABCD$ 中：\n\n- 从 $A$ 出发的主对角线表示和向量：$$\\vec{AC} = \\mathbf{u} + \\mathbf{v}$$\n- 对角线 $\\vec{BD}$ 表示差向量：$$\\vec{BD} = \\vec{AD} - \\vec{AB} = \\mathbf{v} - \\mathbf{u}$$",
      ),
      generate(rng) {
        const names = [
          ["A", "B", "C", "D"],
          ["P", "Q", "R", "S"],
          ["K", "L", "M", "N"],
          ["W", "X", "Y", "Z"],
          ["E", "F", "G", "H"],
        ];
        const [a, b, c, d] = rng.pick(names)!;
        const u = rng.pick(["\\mathbf{u}", "\\mathbf{a}", "\\vec{u}"]);
        const v = rng.pick(["\\mathbf{v}", "\\mathbf{b}", "\\vec{v}"]);

        const query = rng.pick(["sum-diag", "diff-diag-1", "diff-diag-2"]);
        if (query === "sum-diag") {
          return oneOf(
            rng,
            t(
              `In parallelogram $${a}${b}${c}${d}$, let $\\vec{${a}${b}} = ${u}$ and $\\vec{${a}${d}} = ${v}$. Express the diagonal $\\vec{${a}${c}}$ in terms of $${u}$ and $${v}$.`,
              `在平行四边形 $${a}${b}${c}${d}$ 中，设 $\\vec{${a}${b}} = ${u}$，$\\vec{${a}${d}} = ${v}$。用 $${u}$ 和 $${v}$ 表示对角线 $\\vec{${a}${c}}$。`,
            ),
            t(`$${u} + ${v}$`, `$${u} + ${v}$`),
            [t(`$${u} - ${v}$`, `$${u} - ${v}$`), t(`$${v} - ${u}$`, `$${v} - ${u}$`), t(`$2${u} + 2${v}$`, `$2${u} + 2${v}$`)],
            t(
              `Since $\\vec{${b}${c}} = \\vec{${a}${d}} = ${v}$, by the triangle law $\\vec{${a}${c}} = \\vec{${a}${b}} + \\vec{${b}${c}} = ${u} + ${v}$.`,
              `因为 $\\vec{${b}${c}} = \\vec{${a}${d}} = ${v}$，由三角形法则可知 $\\vec{${a}${c}} = \\vec{${a}${b}} + \\vec{${b}${c}} = ${u} + ${v}$。`,
            ),
          );
        }

        if (query === "diff-diag-1") {
          return oneOf(
            rng,
            t(
              `In parallelogram $${a}${b}${c}${d}$, let $\\vec{${a}${b}} = ${u}$ and $\\vec{${a}${d}} = ${v}$. Express the diagonal $\\vec{${b}${d}}$ in terms of $${u}$ and $${v}$.`,
              `在平行四边形 $${a}${b}${c}${d}$ 中，设 $\\vec{${a}${b}} = ${u}$，$\\vec{${a}${d}} = ${v}$。用 $${u}$ 和 $${v}$ 表示对角线 $\\vec{${b}${d}}$。`,
            ),
            t(`$${v} - ${u}$`, `$${v} - ${u}$`),
            [t(`$${u} - ${v}$`, `$${u} - ${v}$`), t(`$${u} + ${v}$`, `$${u} + ${v}$`), t(`$-${u} - ${v}$`, `$-${u} - ${v}$`)],
            t(
              `In $\\triangle ${a}${b}${d}$, $\\vec{${b}${d}} = \\vec{${a}${d}} - \\vec{${a}${b}} = ${v} - ${u}$.`,
              `在 $\\triangle ${a}${b}${d}$ 中，$\\vec{${b}${d}} = \\vec{${a}${d}} - \\vec{${a}${b}} = ${v} - ${u}$。`,
            ),
          );
        }

        return oneOf(
          rng,
          t(
            `In parallelogram $${a}${b}${c}${d}$, let $\\vec{${a}${b}} = ${u}$ and $\\vec{${a}${d}} = ${v}$. Express the diagonal $\\vec{${d}${b}}$ in terms of $${u}$ and $${v}$.`,
            `在平行四边形 $${a}${b}${c}${d}$ 中，设 $\\vec{${a}${b}} = ${u}$，$\\vec{${a}${d}} = ${v}$。用 $${u}$ 和 $${v}$ 表示对角线 $\\vec{${d}${b}}$。`,
          ),
          t(`$${u} - ${v}$`, `$${u} - ${v}$`),
          [t(`$${v} - ${u}$`, `$${v} - ${u}$`), t(`$${u} + ${v}$`, `$${u} + ${v}$`), t(`$-${u} - ${v}$`, `$-${u} - ${v}$`)],
          t(
            `In $\\triangle ${a}${d}${b}$, $\\vec{${d}${b}} = \\vec{${a}${b}} - \\vec{${a}${d}} = ${u} - ${v}$.`,
            `在 $\\triangle ${a}${d}${b}$ 中，$\\vec{${d}${b}} = \\vec{${a}${b}} - \\vec{${a}${d}} = ${u} - ${v}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 5.16.3 The Magnitude of a Vector ───────────────────────────────────────

/** theMagnitudeOfAVector covers vector magnitude notation, scaling, and zero vector. */
export const theMagnitudeOfAVector: TopicDef = {
  id: "the-magnitude-of-a-vector",
  title: t("The Magnitude of a Vector", "向量的模长"),
  summary: t(
    "Understand vector magnitude notation, the non-negativity of length, and properties of the zero vector.",
    "理解向量模长的符号表示、非负性以及零向量的性质。",
  ),
  prerequisites: ["introduction-to-vectors"],
  encompasses: [{ topic: "introduction-to-vectors", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSN.VM.A.1"],
  knowledgePoints: [
    {
      id: "magnitude-notation-and-scaling",
      title: t("Compute vector magnitude under scalar multiplication", "计算数乘向量的模长"),
      explanation: t(
        "The **magnitude** (or length) of a vector $\\mathbf{v}$ is denoted by $\\|\\mathbf{v}\\|$ or $|\\mathbf{v}|$. It is always a non-negative real number ($\\|\\mathbf{v}\\| \\ge 0$).\n\nFor any real scalar $k$, the magnitude of the scaled vector $k\\mathbf{v}$ satisfies:\n\n$$\\|k\\mathbf{v}\\| = |k|\\,\\|\\mathbf{v}\\|$$",
        "向量 $\\mathbf{v}$ 的**模长**（长度）记为 $\\|\\mathbf{v}\\|$ 或 $|\\mathbf{v}|$，始终为非负实数（$\\|\\mathbf{v}\\| \\ge 0$）。\n\n对于任意实数标量 $k$，数乘向量 $k\\mathbf{v}$ 的模长满足：\n\n$$\\|k\\mathbf{v}\\| = |k|\\,\\|\\mathbf{v}\\|$$",
      ),
      generate(rng) {
        const len = rng.pick([3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 15, 17, 20]);
        const k = rng.pick([-8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]);
        const vec = rng.pick(["\\mathbf{v}", "\\mathbf{u}", "\\vec{a}", "\\vec{w}"]);
        const rightVal = Math.abs(k) * len;

        const wrongVals = [k * len, len * (Math.abs(k) + 1), Math.abs(k) + len].filter((v) => v !== rightVal);

        return oneOf(
          rng,
          t(
            `Given that $\\|${vec}\\| = ${len}$, find the magnitude $\\|${k}${vec}\\|$.`,
            `已知 $\\|${vec}\\| = ${len}$，求模长 $\\|${k}${vec}\\|$。`,
          ),
          t(`$${rightVal}$`, `$${rightVal}$`),
          wrongVals.map((w) => t(`$${w}$`, `$${w}$`)),
          t(
            `Using the scaling property of vector magnitudes, $\\|${k}${vec}\\| = |${k}|\\,\\|${vec}\\| = ${Math.abs(k)} \\times ${len} = ${rightVal}$.`,
            `根据向量模长的数乘性质，$\\|${k}${vec}\\| = |${k}|\\,\\|${vec}\\| = ${Math.abs(k)} \\times ${len} = ${rightVal}$。`,
          ),
        );
      },
    },
    {
      id: "zero-vector-properties",
      title: t("Properties of the zero vector", "零向量的性质"),
      explanation: t(
        "The **zero vector**, denoted $\\mathbf{0}$ or $\\vec{0}$, is the unique vector with length zero:\n\n$$\\|\\mathbf{0}\\| = 0$$\n\nIts direction is arbitrary (not pointing in any single direction). For any vector $\\mathbf{v}$ and scalar $k$:\n- $\\mathbf{v} + \\mathbf{0} = \\mathbf{v}$\n- $\\mathbf{v} + (-\\mathbf{v}) = \\mathbf{0}$\n- $0\\mathbf{v} = \\mathbf{0}$\n- $k\\mathbf{0} = \\mathbf{0}$",
        "**零向量**记为 $\\mathbf{0}$ 或 $\\vec{0}$，是唯一长度为零的向量：\n\n$$\\|\\mathbf{0}\\| = 0$$\n\n它的方向是任意的（不指向任何单一特定方向）。对任意向量 $\\mathbf{v}$ 和标量 $k$：\n- $\\mathbf{v} + \\mathbf{0} = \\mathbf{v}$\n- $\\mathbf{v} + (-\\mathbf{v}) = \\mathbf{0}$\n- $0\\mathbf{v} = \\mathbf{0}$\n- $k\\mathbf{0} = \\mathbf{0}$",
      ),
      generate(rng) {
        const v = rng.pick([
          "\\mathbf{u}",
          "\\mathbf{v}",
          "\\mathbf{a}",
          "\\mathbf{w}",
          "\\vec{x}",
          "\\mathbf{b}",
          "\\mathbf{c}",
          "\\mathbf{p}",
          "\\mathbf{q}",
          "\\vec{m}",
        ]);
        const kind = rng.pick(["eval-zero", "identity", "inverse-sum", "scalar-zero"]);

        if (kind === "eval-zero") {
          return oneOf(
            rng,
            t(`What is the value of the scalar product $0 \\cdot ${v}$?`, `数乘运算 $0 \\cdot ${v}$ 的结果是什么？`),
            t("$\\mathbf{0}$ (the zero vector)", "$\\mathbf{0}$（零向量）"),
            [t("$0$ (the scalar zero)", "$0$（标量零）"), t(`$${v}$`, `$${v}$`), t("$1$", "$1$")],
            t(
              `Multiplying any vector by the scalar $0$ produces the zero vector $\\mathbf{0}$, which is a vector, not a scalar.`,
              `任何向量与标量 $0$ 的数乘积均为零向量 $\\mathbf{0}$，它是一个向量，而不是标量。`,
            ),
          );
        }

        if (kind === "scalar-zero") {
          const k = rng.pick([-15, -12, -9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9, 12, 15]);
          const zeroSym = rng.pick(["\\mathbf{0}", "\\vec{0}"]);
          return oneOf(
            rng,
            t(`Evaluate the scalar multiple $${k}${zeroSym}$.`, `计算数乘运算 $${k}${zeroSym}$ 的值。`),
            t(`$${zeroSym}$`, `$${zeroSym}$`),
            [t(`$${k}$`, `$${k}$`), t("$0$", "$0$"), t(`$${k}\\mathbf{v}$`, `$${k}\\mathbf{v}$`)],
            t(
              `Multiplying the zero vector by any real scalar $k$ results in the zero vector: $${k}${zeroSym} = ${zeroSym}$.`,
              `任何实数标量 $k$ 乘以零向量结果仍为零向量：$${k}${zeroSym} = ${zeroSym}$。`,
            ),
          );
        }

        if (kind === "inverse-sum") {
          const isSub = rng.pick([true, false]);
          const expr = isSub ? `${v} - ${v}` : `${v} + (-${v})`;
          return oneOf(
            rng,
            t(`Simplify the vector expression: $${expr}$.`, `化简向量表达式：$${expr}$。`),
            t("$\\mathbf{0}$", "$\\mathbf{0}$"),
            [t("$0$", "$0$"), t(`$2${v}$`, `$2${v}$`), t(`$-${v}$`, `$-${v}$`)],
            t(
              `Subtracting a vector from itself (or adding its opposite) produces the zero vector $\\mathbf{0}$.`,
              `向量减去自身（或与其相反向量相加）得到零向量 $\\mathbf{0}$。`,
            ),
          );
        }

        return oneOf(
          rng,
          t(
            `Which of the following statements about the zero vector $\\mathbf{0}$ is FALSE?`,
            `下列关于零向量 $\\mathbf{0}$ 的陈述中，哪一个是错误的？`,
          ),
          t("The zero vector has a unique, fixed direction pointing along the positive x-axis.", "零向量具有唯一确定的方向，指向正 x 轴。"),
          [
            t("$\\|\\mathbf{0}\\| = 0$", "$\\|\\mathbf{0}\\| = 0$"),
            t(
              `For every vector $\\mathbf{v}$, $\\mathbf{v} + \\mathbf{0} = \\mathbf{v}$.`,
              `对任意向量 $\\mathbf{v}$，都有 $\\mathbf{v} + \\mathbf{0} = \\mathbf{v}$。`,
            ),
            t("For any real scalar $k$, $k\\mathbf{0} = \\mathbf{0}$.", "对任意实数标量 $k$，都有 $k\\mathbf{0} = \\mathbf{0}$。"),
          ],
          t(
            "The zero vector does not have a unique fixed direction; its direction is arbitrary.",
            "零向量没有固定的唯一方向，它的方向是任意的。",
          ),
        );
      },
    },
  ],
};

// ─── 5.16.4 Problem Solving Using Vector Diagrams ───────────────────────────

/** problemSolvingUsingVectorDiagrams covers closed loops and geometric vector decomposition. */
export const problemSolvingUsingVectorDiagrams: TopicDef = {
  id: "problem-solving-using-vector-diagrams",
  title: t("Problem Solving Using Vector Diagrams", "利用向量图解决几何问题"),
  summary: t(
    "Express unknown vectors in polygons and geometric configurations using closed vector loops.",
    "利用多边形中的闭合向量回路，用已知向量表示未知向量。",
  ),
  prerequisites: ["the-triangle-law-for-the-addition-of-two-vectors"],
  encompasses: [{ topic: "the-triangle-law-for-the-addition-of-two-vectors", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSN.VM.B.4"],
  knowledgePoints: [
    {
      id: "vector-loops-in-polygons",
      title: t("Use closed vector loops in polygons", "利用多边形中的闭合回路求向量"),
      explanation: t(
        "For any closed polygon with vertices $A_1, A_2, \\dots, A_n$ in order, the sum of directed vectors around the closed perimeter is the zero vector:\n\n$$\\vec{A_1 A_2} + \\vec{A_2 A_3} + \\dots + \\vec{A_n A_1} = \\mathbf{0}$$\n\nIn $\\triangle ABC$, $\\vec{AB} + \\vec{BC} + \\vec{CA} = \\mathbf{0}$, which implies $\\vec{CA} = -(\\vec{AB} + \\vec{BC})$.",
        "对于任意顶点依次为 $A_1, A_2, \\dots, A_n$ 的闭合多边形，沿周长依次相连的向量之和为零向量：\n\n$$\\vec{A_1 A_2} + \\vec{A_2 A_3} + \\dots + \\vec{A_n A_1} = \\mathbf{0}$$\n\n在 $\\triangle ABC$ 中，$\\vec{AB} + \\vec{BC} + \\vec{CA} = \\mathbf{0}$，从而 $\\vec{CA} = -(\\vec{AB} + \\vec{BC})$。",
      ),
      generate(rng) {
        const poly = rng.pick([
          { pts: ["A", "B", "C"], n: 3 },
          { pts: ["P", "Q", "R"], n: 3 },
          { pts: ["K", "L", "M"], n: 3 },
          { pts: ["D", "E", "F"], n: 3 },
          { pts: ["A", "B", "C", "D"], n: 4 },
          { pts: ["P", "Q", "R", "S"], n: 4 },
          { pts: ["K", "L", "M", "N"], n: 4 },
          { pts: ["E", "F", "G", "H"], n: 4 },
        ]);

        const a = rng.pick(["\\mathbf{a}", "\\mathbf{u}"]);
        const b = rng.pick(["\\mathbf{b}", "\\mathbf{v}"]);
        const c = rng.pick(["\\mathbf{c}", "\\mathbf{w}"]);

        if (poly.n === 3) {
          const [p1, p2, p3] = poly.pts;
          return oneOf(
            rng,
            t(
              `In $\\triangle ${p1}${p2}${p3}$, let $\\vec{${p1}${p2}} = ${a}$ and $\\vec{${p2}${p3}} = ${b}$. Express $\\vec{${p3}${p1}}$ in terms of $${a}$ and $${b}$.`,
              `在 $\\triangle ${p1}${p2}${p3}$ 中，设 $\\vec{${p1}${p2}} = ${a}$，$\\vec{${p2}${p3}} = ${b}$。用 $${a}$ 和 $${b}$ 表示 $\\vec{${p3}${p1}}$。`,
            ),
            t(`$-${a} - ${b}$`, `$-${a} - ${b}$`),
            [t(`$${a} + ${b}$`, `$${a} + ${b}$`), t(`$${a} - ${b}$`, `$${a} - ${b}$`), t(`$${b} - ${a}$`, `$${b} - ${a}$`)],
            t(
              `Since $\\vec{${p1}${p2}} + \\vec{${p2}${p3}} + \\vec{${p3}${p1}} = \\mathbf{0}$, we have $\\vec{${p3}${p1}} = -(\\vec{${p1}${p2}} + \\vec{${p2}${p3}}) = -${a} - ${b}$.`,
              `因为闭合回路 $\\vec{${p1}${p2}} + \\vec{${p2}${p3}} + \\vec{${p3}${p1}} = \\mathbf{0}$，所以 $\\vec{${p3}${p1}} = -(\\vec{${p1}${p2}} + \\vec{${p2}${p3}}) = -${a} - ${b}$。`,
            ),
          );
        }

        const [p1, p2, p3, p4] = poly.pts;
        return oneOf(
          rng,
          t(
            `In quadrilateral $${p1}${p2}${p3}${p4}$, let $\\vec{${p1}${p2}} = ${a}$, $\\vec{${p2}${p3}} = ${b}$, and $\\vec{${p3}${p4}} = ${c}$. Express $\\vec{${p1}${p4}}$ in terms of $${a}$, $${b}$, and $${c}$.`,
            `在四边形 $${p1}${p2}${p3}${p4}$ 中，设 $\\vec{${p1}${p2}} = ${a}$，$\\vec{${p2}${p3}} = ${b}$，$\\vec{${p3}${p4}} = ${c}$。用 $${a}$、$${b}$ 和 $${c}$ 表示 $\\vec{${p1}${p4}}$。`,
          ),
          t(`$${a} + ${b} + ${c}$`, `$${a} + ${b} + ${c}$`),
          [
            t(`$${a} + ${b} - ${c}$`, `$${a} + ${b} - ${c}$`),
            t(`$-${a} - ${b} - ${c}$`, `$-${a} - ${b} - ${c}$`),
            t(`$${a} - ${b} + ${c}$`, `$${a} - ${b} + ${c}$`),
          ],
          t(
            `By vector addition, $\\vec{${p1}${p4}} = \\vec{${p1}${p2}} + \\vec{${p2}${p3}} + \\vec{${p3}${p4}} = ${a} + ${b} + ${c}$.`,
            `由向量加法，$\\vec{${p1}${p4}} = \\vec{${p1}${p2}} + \\vec{${p2}${p3}} + \\vec{${p3}${p4}} = ${a} + ${b} + ${c}$。`,
          ),
        );
      },
    },
    {
      id: "express-vector-in-polygon",
      title: t("Express diagonals and segments in geometric figures", "在几何图形中表示对角线与线段向量"),
      explanation: t(
        "In a trapezoid $ABCD$ where base $DC$ is parallel to base $AB$ with $\\vec{DC} = k\\vec{AB}$, side and diagonal vectors can be decomposed using the boundary vectors $\\mathbf{a} = \\vec{AB}$ and $\\mathbf{b} = \\vec{AD}$:\n\n$$\\vec{AC} = \\vec{AD} + \\vec{DC} = \\mathbf{b} + k\\mathbf{a}$$",
        "在梯形 $ABCD$ 中，底边 $DC$ 平行于底边 $AB$ 且 $\\vec{DC} = k\\vec{AB}$。对角线向量可分解为基底向量 $\\mathbf{a} = \\vec{AB}$ 和 $\\mathbf{b} = \\vec{AD}$：\n\n$$\\vec{AC} = \\vec{AD} + \\vec{DC} = \\mathbf{b} + k\\mathbf{a}$$",
      ),
      generate(rng) {
        const polyNames = [
          ["A", "B", "C", "D"],
          ["P", "Q", "R", "S"],
          ["K", "L", "M", "N"],
          ["W", "X", "Y", "Z"],
        ];
        const [p1, p2, p3, p4] = rng.pick(polyNames)!;
        const k = rng.pick([2, 3, 4, 5, 6]);
        const a = rng.pick(["\\mathbf{a}", "\\mathbf{u}", "\\mathbf{x}"]);
        const b = rng.pick(["\\mathbf{b}", "\\mathbf{v}", "\\mathbf{y}"]);
        const kStr = `${k}`;

        const query = rng.pick(["AC", "CA", "BD", "DB"]);
        if (query === "AC") {
          return oneOf(
            rng,
            t(
              `In trapezoid $${p1}${p2}${p3}${p4}$, side $${p4}${p3}$ is parallel to side $${p1}${p2}$ with $\\vec{${p4}${p3}} = ${kStr}\\vec{${p1}${p2}}$. Let $\\vec{${p1}${p2}} = ${a}$ and $\\vec{${p1}${p4}} = ${b}$. Express the diagonal $\\vec{${p1}${p3}}$ in terms of $${a}$ and $${b}$.`,
              `在梯形 $${p1}${p2}${p3}${p4}$ 中，底边 $${p4}${p3}$ 平行于底边 $${p1}${p2}$ 且 $\\vec{${p4}${p3}} = ${kStr}\\vec{${p1}${p2}}$。设 $\\vec{${p1}${p2}} = ${a}$，$\\vec{${p1}${p4}} = ${b}$。用 $${a}$ 和 $${b}$ 表示对角线 $\\vec{${p1}${p3}}$。`,
            ),
            t(`$${kStr}${a} + ${b}$`, `$${kStr}${a} + ${b}$`),
            [
              t(`$${a} + ${kStr}${b}$`, `$${a} + ${kStr}${b}$`),
              t(`$${kStr}${a} - ${b}$`, `$${kStr}${a} - ${b}$`),
              t(`$${b} - ${kStr}${a}$`, `$${b} - ${kStr}${a}$`),
            ],
            t(
              `Using the path through $${p4}$: $\\vec{${p1}${p3}} = \\vec{${p1}${p4}} + \\vec{${p4}${p3}} = ${b} + ${kStr}\\vec{${p1}${p2}} = ${kStr}${a} + ${b}$.`,
              `沿路径经过点 $${p4}$：$\\vec{${p1}${p3}} = \\vec{${p1}${p4}} + \\vec{${p4}${p3}} = ${b} + ${kStr}\\vec{${p1}${p2}} = ${kStr}${a} + ${b}$。`,
            ),
          );
        }

        if (query === "CA") {
          return oneOf(
            rng,
            t(
              `In trapezoid $${p1}${p2}${p3}${p4}$, side $${p4}${p3}$ is parallel to side $${p1}${p2}$ with $\\vec{${p4}${p3}} = ${kStr}\\vec{${p1}${p2}}$. Let $\\vec{${p1}${p2}} = ${a}$ and $\\vec{${p1}${p4}} = ${b}$. Express $\\vec{${p3}${p1}}$ in terms of $${a}$ and $${b}$.`,
              `在梯形 $${p1}${p2}${p3}${p4}$ 中，底边 $${p4}${p3}$ 平行于底边 $${p1}${p2}$ 且 $\\vec{${p4}${p3}} = ${kStr}\\vec{${p1}${p2}}$。设 $\\vec{${p1}${p2}} = ${a}$，$\\vec{${p1}${p4}} = ${b}$。用 $${a}$ 和 $${b}$ 表示 $\\vec{${p3}${p1}}$。`,
            ),
            t(`$-${kStr}${a} - ${b}$`, `$-${kStr}${a} - ${b}$`),
            [
              t(`$${kStr}${a} + ${b}$`, `$${kStr}${a} + ${b}$`),
              t(`$-${a} - ${kStr}${b}$`, `$-${a} - ${kStr}${b}$`),
              t(`$${kStr}${a} - ${b}$`, `$${kStr}${a} - ${b}$`),
            ],
            t(
              `Since $\\vec{${p1}${p3}} = ${kStr}${a} + ${b}$, reversing direction gives $\\vec{${p3}${p1}} = -\\vec{${p1}${p3}} = -${kStr}${a} - ${b}$.`,
              `因为 $\\vec{${p1}${p3}} = ${kStr}${a} + ${b}$，反向得到 $\\vec{${p3}${p1}} = -\\vec{${p1}${p3}} = -${kStr}${a} - ${b}$。`,
            ),
          );
        }

        return oneOf(
          rng,
          t(
            `In trapezoid $${p1}${p2}${p3}${p4}$, side $${p4}${p3}$ is parallel to side $${p1}${p2}$ with $\\vec{${p4}${p3}} = ${kStr}\\vec{${p1}${p2}}$. Let $\\vec{${p1}${p2}} = ${a}$ and $\\vec{${p1}${p4}} = ${b}$. Express $\\vec{${p2}${p4}}$ in terms of $${a}$ and $${b}$.`,
            `在梯形 $${p1}${p2}${p3}${p4}$ 中，底边 $${p4}${p3}$ 平行于底边 $${p1}${p2}$ 且 $\\vec{${p4}${p3}} = ${kStr}\\vec{${p1}${p2}}$。设 $\\vec{${p1}${p2}} = ${a}$，$\\vec{${p1}${p4}} = ${b}$。用 $${a}$ 和 $${b}$ 表示 $\\vec{${p2}${p4}}$。`,
          ),
          t(`$${b} - ${a}$`, `$${b} - ${a}$`),
          [t(`$${a} - ${b}$`, `$${a} - ${b}$`), t(`$${b} + ${a}$`, `$${b} + ${a}$`), t(`$${kStr}${b} - ${a}$`, `$${kStr}${b} - ${a}$`)],
          t(
            `In $\\triangle ${p1}${p2}${p4}$, $\\vec{${p2}${p4}} = \\vec{${p1}${p4}} - \\vec{${p1}${p2}} = ${b} - ${a}$.`,
            `在 $\\triangle ${p1}${p2}${p4}$ 中，$\\vec{${p2}${p4}} = \\vec{${p1}${p4}} - \\vec{${p1}${p2}} = ${b} - ${a}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 5.16.5 Parallel Vectors ────────────────────────────────────────────────

/** parallelVectors covers collinearity, scalar multiples, and direction. */
export const parallelVectors: TopicDef = {
  id: "parallel-vectors",
  title: t("Parallel Vectors", "平行向量与共线向量"),
  summary: t(
    "Determine whether two vectors are parallel (collinear) and understand same versus opposite directions using scalar multiples.",
    "根据数乘倍数判断两个向量是否平行（共线），并区分同向与反向。",
  ),
  prerequisites: ["introduction-to-vectors"],
  encompasses: [{ topic: "introduction-to-vectors", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSN.VM.B.5"],
  knowledgePoints: [
    {
      id: "collinearity-condition",
      title: t("Collinearity condition for vectors", "向量平行的共线条件"),
      explanation: t(
        "Two non-zero vectors $\\mathbf{u}$ and $\\mathbf{v}$ are **parallel** (or collinear), written $\\mathbf{u} \\parallel \\mathbf{v}$, if and only if there exists a non-zero scalar $k$ such that:\n\n$$\\mathbf{u} = k\\mathbf{v}$$",
        "两个非零向量 $\\mathbf{u}$ 和 $\\mathbf{v}$ **平行**（或共线），记作 $\\mathbf{u} \\parallel \\mathbf{v}$，当且仅当存在一个非零标量 $k$，使得：\n\n$$\\mathbf{u} = k\\mathbf{v}$$",
      ),
      generate(rng) {
        const k = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
        const aCoeff = rng.pick([1, 2, 3]);
        const bCoeff = rng.pick([2, 3, 4, 5]);
        const sign = rng.pick([1, -1]);
        const bSigned = sign * bCoeff;

        const uA = aCoeff;
        const uB = bSigned;
        const vA = k * aCoeff;
        const vB = k * bSigned;

        const aVec = rng.pick(["\\mathbf{a}", "\\mathbf{e}_1"]);
        const bVec = rng.pick(["\\mathbf{b}", "\\mathbf{e}_2"]);

        const uStr = `${uA === 1 ? "" : uA}${aVec} ${uB > 0 ? `+ ${uB}` : `- ${Math.abs(uB)}`}${bVec}`;
        const vPromptStr = `${vA}${aVec} + m${bVec}`;

        return oneOf(
          rng,
          t(
            `Let ${aVec} and ${bVec} be non-collinear basis vectors. If $\\mathbf{u} = ${uStr}$ and $\\mathbf{v} = ${vPromptStr}$ are parallel, find the value of $m$.`,
            `设 ${aVec} 和 ${bVec} 为不共线的基底向量。若 $\\mathbf{u} = ${uStr}$ 与 $\\mathbf{v} = ${vPromptStr}$ 平行，求 $m$ 的值。`,
          ),
          t(`$m = ${vB}$`, `$m = ${vB}$`),
          [
            t(`$m = ${-vB}$`, `$m = ${-vB}$`),
            t(`$m = ${vB + (k > 0 ? 1 : -1)}$`, `$m = ${vB + (k > 0 ? 1 : -1)}$`),
            t(`$m = ${Math.round(uB / aCoeff)}$`, `$m = ${Math.round(uB / aCoeff)}$`),
          ],
          t(
            `Since $\\mathbf{u} \\parallel \\mathbf{v}$, there is a scalar $k$ such that $\\mathbf{v} = k\\mathbf{u}$. Comparing coefficients of ${aVec}: $k \\times ${uA} = ${vA} \\implies k = ${k}$. Then $m = k \\times (${uB}) = ${vB}$.`,
            `因为 $\\mathbf{u} \\parallel \\mathbf{v}$，存在标量 $k$ 使得 $\\mathbf{v} = k\\mathbf{u}$。比较 ${aVec} 的系数：$k \\times ${uA} = ${vA} \\implies k = ${k}$。因此 $m = k \\times (${uB}) = ${vB}$。`,
          ),
        );
      },
    },
    {
      id: "parallel-direction-and-sign",
      title: t("Direction and magnitude ratio of parallel vectors", "平行向量的方向与模长比"),
      explanation: t(
        "For two parallel vectors $\\mathbf{u} = k\\mathbf{v}$ ($k \\neq 0$):\n\n- If $k > 0$, $\\mathbf{u}$ and $\\mathbf{v}$ have the **same direction**.\n- If $k < 0$, $\\mathbf{u}$ and $\\mathbf{v}$ have **opposite directions**.\n\nIn both cases, their lengths satisfy $\\|\\mathbf{u}\\| = |k|\\,\\|\\mathbf{v}\\|$.",
        "对于两个平行向量 $\\mathbf{u} = k\\mathbf{v}$（$k \\neq 0$）：\n\n- 若 $k > 0$，则 $\\mathbf{u}$ 与 $\\mathbf{v}$ **同向**。\n- 若 $k < 0$，则 $\\mathbf{u}$ 与 $\\mathbf{v}$ **反向**。\n\n两种情况下，模长均满足 $\\|\\mathbf{u}\\| = |k|\\,\\|\\mathbf{v}\\|$。",
      ),
      generate(rng) {
        const k = rng.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
        const len = rng.pick([3, 4, 5, 6, 7, 8, 9, 10]);
        const uLen = Math.abs(k) * len;
        const isSame = k > 0;

        const right = isSame
          ? t(`Same direction, with $\\|\\mathbf{u}\\| = ${uLen}$`, `同向，且 $\\|\\mathbf{u}\\| = ${uLen}$`)
          : t(`Opposite directions, with $\\|\\mathbf{u}\\| = ${uLen}$`, `反向，且 $\\|\\mathbf{u}\\| = ${uLen}$`);

        const wrong = isSame
          ? [
              t(`Opposite directions, with $\\|\\mathbf{u}\\| = ${uLen}$`, `反向，且 $\\|\\mathbf{u}\\| = ${uLen}$`),
              t(`Same direction, with $\\|\\mathbf{u}\\| = ${len}$`, `同向，且 $\\|\\mathbf{u}\\| = ${len}$`),
              t(`Opposite directions, with $\\|\\mathbf{u}\\| = ${k * len}$`, `反向，且 $\\|\\mathbf{u}\\| = ${k * len}$`),
            ]
          : [
              t(`Same direction, with $\\|\\mathbf{u}\\| = ${uLen}$`, `同向，且 $\\|\\mathbf{u}\\| = ${uLen}$`),
              t(`Opposite directions, with $\\|\\mathbf{u}\\| = ${-uLen}$`, `反向，且 $\\|\\mathbf{u}\\| = ${-uLen}$`),
              t(`Same direction, with $\\|\\mathbf{u}\\| = ${len}$`, `同向，且 $\\|\\mathbf{u}\\| = ${len}$`),
            ];

        return oneOf(
          rng,
          t(
            `Given that $\\mathbf{u} = ${k}\\mathbf{v}$ and $\\|\\mathbf{v}\\| = ${len}$, describe the direction of $\\mathbf{u}$ relative to $\\mathbf{v}$ and find the magnitude $\\|\\mathbf{u}\\|$.`,
            `已知 $\\mathbf{u} = ${k}\\mathbf{v}$ 且 $\\|\\mathbf{v}\\| = ${len}$，说明 $\\mathbf{u}$ 相对 $\\mathbf{v}$ 的方向，并求其模长 $\\|\\mathbf{u}\\|$。`,
          ),
          right,
          wrong,
          t(
            `Since the scalar multiplier is $k = ${k}$ (${isSame ? "> 0" : "< 0"}), $\\mathbf{u}$ and $\\mathbf{v}$ have ${isSame ? "the same direction" : "opposite directions"}. The magnitude is $\\|\\mathbf{u}\\| = |${k}| \\times ${len} = ${uLen}$.`,
            `因为标量乘数 $k = ${k}$（${isSame ? "> 0" : "< 0"}），所以 $\\mathbf{u}$ 与 $\\mathbf{v}$ ${isSame ? "同向" : "反向"}。模长为 $\\|\\mathbf{u}\\| = |${k}| \\times ${len} = ${uLen}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 5.16.6 Unit Vectors ────────────────────────────────────────────────────

/** unitVectors covers unit vector definition and normalizing vectors. */
export const unitVectors: TopicDef = {
  id: "unit-vectors",
  title: t("Unit Vectors", "单位向量"),
  summary: t(
    "Define unit vectors and compute the unit vector in the same or opposite direction as a given vector.",
    "理解单位向量的定义，并计算与给定向量同向或反向的单位向量。",
  ),
  prerequisites: ["the-magnitude-of-a-vector"],
  encompasses: [{ topic: "the-magnitude-of-a-vector", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSN.VM.A.1", "CCSS.HSN.VM.B.5"],
  knowledgePoints: [
    {
      id: "unit-vector-definition",
      title: t("Definition of a unit vector", "单位向量的定义"),
      explanation: t(
        "A **unit vector** is any vector whose magnitude is exactly $1$:\n\n$$\\|\\mathbf{u}\\| = 1$$\n\nThe standard unit coordinate vectors in 2D are $\\mathbf{i} = \\langle 1, 0 \\rangle$ and $\\mathbf{j} = \\langle 0, 1 \\rangle$.",
        "**单位向量**是模长恰好等于 $1$ 的向量：\n\n$$\\|\\mathbf{u}\\| = 1$$\n\n二维平面中的标准单位坐标向量为 $\\mathbf{i} = \\langle 1, 0 \\rangle$ 和 $\\mathbf{j} = \\langle 0, 1 \\rangle$。",
      ),
      generate(rng) {
        const units = [
          { vec: "\\left\\langle \\frac{3}{5}, \\frac{4}{5} \\right\\rangle", isUnit: true, mag: "\\sqrt{(3/5)^2 + (4/5)^2} = 1" },
          { vec: "\\left\\langle -\\frac{3}{5}, \\frac{4}{5} \\right\\rangle", isUnit: true, mag: "\\sqrt{(-3/5)^2 + (4/5)^2} = 1" },
          { vec: "\\left\\langle \\frac{3}{5}, -\\frac{4}{5} \\right\\rangle", isUnit: true, mag: "\\sqrt{(3/5)^2 + (-4/5)^2} = 1" },
          { vec: "\\left\\langle -\\frac{3}{5}, -\\frac{4}{5} \\right\\rangle", isUnit: true, mag: "\\sqrt{(-3/5)^2 + (-4/5)^2} = 1" },
          { vec: "\\left\\langle \\frac{4}{5}, \\frac{3}{5} \\right\\rangle", isUnit: true, mag: "\\sqrt{(4/5)^2 + (3/5)^2} = 1" },
          { vec: "\\left\\langle -\\frac{4}{5}, \\frac{3}{5} \\right\\rangle", isUnit: true, mag: "\\sqrt{(-4/5)^2 + (3/5)^2} = 1" },
          { vec: "\\left\\langle -\\frac{5}{13}, \\frac{12}{13} \\right\\rangle", isUnit: true, mag: "\\sqrt{(-5/13)^2 + (12/13)^2} = 1" },
          { vec: "\\left\\langle \\frac{5}{13}, -\\frac{12}{13} \\right\\rangle", isUnit: true, mag: "\\sqrt{(5/13)^2 + (-12/13)^2} = 1" },
          { vec: "\\left\\langle \\frac{12}{13}, \\frac{5}{13} \\right\\rangle", isUnit: true, mag: "\\sqrt{(12/13)^2 + (5/13)^2} = 1" },
          {
            vec: "\\left\\langle -\\frac{12}{13}, -\\frac{5}{13} \\right\\rangle",
            isUnit: true,
            mag: "\\sqrt{(-12/13)^2 + (-5/13)^2} = 1",
          },
          { vec: "\\left\\langle \\frac{\\sqrt{2}}{2}, \\frac{\\sqrt{2}}{2} \\right\\rangle", isUnit: true, mag: "\\sqrt{2/4 + 2/4} = 1" },
          { vec: "\\left\\langle -\\frac{\\sqrt{2}}{2}, \\frac{\\sqrt{2}}{2} \\right\\rangle", isUnit: true, mag: "\\sqrt{2/4 + 2/4} = 1" },
          { vec: "\\left\\langle \\frac{\\sqrt{2}}{2}, -\\frac{\\sqrt{2}}{2} \\right\\rangle", isUnit: true, mag: "\\sqrt{2/4 + 2/4} = 1" },
          {
            vec: "\\left\\langle -\\frac{\\sqrt{2}}{2}, -\\frac{\\sqrt{2}}{2} \\right\\rangle",
            isUnit: true,
            mag: "\\sqrt{2/4 + 2/4} = 1",
          },
          { vec: "\\left\\langle \\frac{1}{2}, \\frac{\\sqrt{3}}{2} \\right\\rangle", isUnit: true, mag: "\\sqrt{1/4 + 3/4} = 1" },
          { vec: "\\left\\langle -\\frac{1}{2}, \\frac{\\sqrt{3}}{2} \\right\\rangle", isUnit: true, mag: "\\sqrt{1/4 + 3/4} = 1" },
          { vec: "\\left\\langle \\frac{1}{2}, -\\frac{\\sqrt{3}}{2} \\right\\rangle", isUnit: true, mag: "\\sqrt{1/4 + 3/4} = 1" },
          { vec: "\\left\\langle -\\frac{1}{2}, -\\frac{\\sqrt{3}}{2} \\right\\rangle", isUnit: true, mag: "\\sqrt{1/4 + 3/4} = 1" },
          { vec: "\\left\\langle \\frac{\\sqrt{3}}{2}, \\frac{1}{2} \\right\\rangle", isUnit: true, mag: "\\sqrt{3/4 + 1/4} = 1" },
          { vec: "\\left\\langle -\\frac{\\sqrt{3}}{2}, \\frac{1}{2} \\right\\rangle", isUnit: true, mag: "\\sqrt{3/4 + 1/4} = 1" },
          { vec: "\\langle 1, 0 \\rangle", isUnit: true, mag: "\\sqrt{1^2 + 0^2} = 1" },
          { vec: "\\langle 0, -1 \\rangle", isUnit: true, mag: "\\sqrt{0^2 + (-1)^2} = 1" },
          { vec: "\\langle -1, 0 \\rangle", isUnit: true, mag: "\\sqrt{(-1)^2 + 0^2} = 1" },
          { vec: "\\langle 0, 1 \\rangle", isUnit: true, mag: "\\sqrt{0^2 + 1^2} = 1" },
          { vec: "\\left\\langle \\frac{7}{25}, \\frac{24}{25} \\right\\rangle", isUnit: true, mag: "\\sqrt{49/625 + 576/625} = 1" },
          { vec: "\\left\\langle -\\frac{8}{17}, \\frac{15}{17} \\right\\rangle", isUnit: true, mag: "\\sqrt{64/289 + 225/289} = 1" },
          // non-units
          { vec: "\\langle 1, 1 \\rangle", isUnit: false, mag: "\\sqrt{1^2 + 1^2} = \\sqrt{2} \\neq 1" },
          { vec: "\\langle 2, 0 \\rangle", isUnit: false, mag: "2 \\neq 1" },
          { vec: "\\langle 0, -3 \\rangle", isUnit: false, mag: "3 \\neq 1" },
          {
            vec: "\\left\\langle \\frac{1}{2}, \\frac{1}{2} \\right\\rangle",
            isUnit: false,
            mag: "\\sqrt{1/4 + 1/4} = \\frac{\\sqrt{2}}{2} \\neq 1",
          },
          {
            vec: "\\left\\langle \\frac{2}{3}, \\frac{2}{3} \\right\\rangle",
            isUnit: false,
            mag: "\\sqrt{4/9 + 4/9} = \\frac{\\sqrt{8}}{3} \\neq 1",
          },
          { vec: "\\langle -1, -1 \\rangle", isUnit: false, mag: "\\sqrt{2} \\neq 1" },
          { vec: "\\left\\langle \\frac{3}{4}, \\frac{3}{4} \\right\\rangle", isUnit: false, mag: "\\frac{3\\sqrt{2}}{4} \\neq 1" },
          { vec: "\\langle 1, 2 \\rangle", isUnit: false, mag: "\\sqrt{5} \\neq 1" },
          { vec: "\\langle -2, 1 \\rangle", isUnit: false, mag: "\\sqrt{5} \\neq 1" },
        ];
        const pick = rng.pick(units);
        const right = pick.isUnit
          ? t("Yes, because its magnitude is $1$.", "是，因为其模长为 $1$。")
          : t("No, because its magnitude is not $1$.", "否，因为其模长不为 $1$。");
        const wrong = pick.isUnit
          ? [
              t("No, because its components are fractions.", "否，因为它的分量是分数。"),
              t("No, because its magnitude is not $1$.", "否，因为其模长不为 $1$。"),
              t("Yes, because all two-dimensional vectors are unit vectors.", "是，因为所有二维向量都是单位向量。"),
            ]
          : [
              t("Yes, because its components are positive.", "是，因为它的分量都是正数。"),
              t("Yes, because its magnitude is $1$.", "是，因为其模长为 $1$。"),
              t("No, because a unit vector cannot have two components.", "否，因为单位向量不能有两个分量。"),
            ];

        return oneOf(
          rng,
          t(`Is the vector $\\mathbf{u} = ${pick.vec}$ a unit vector?`, `向量 $\\mathbf{u} = ${pick.vec}$ 是单位向量吗？`),
          right,
          wrong,
          t(
            `Calculate the magnitude: $\\|\\mathbf{u}\\| = ${pick.mag}. Since the length ${pick.isUnit ? "equals" : "does not equal"} $1$, it ${pick.isUnit ? "is" : "is not"} a unit vector.`,
            `计算模长：$\\|\\mathbf{u}\\| = ${pick.mag}。由于其长度${pick.isUnit ? "等于" : "不等于"} $1$，因此它${pick.isUnit ? "是" : "不是"}单位向量。`,
          ),
        );
      },
    },
    {
      id: "unit-vector-in-direction",
      title: t("Find a unit vector in the direction of a given vector", "求与给定向量同向或反向的单位向量"),
      explanation: t(
        "To find a unit vector $\\mathbf{u}$ pointing in the **same direction** as non-zero vector $\\mathbf{v}$, divide $\\mathbf{v}$ by its magnitude (normalization):\n\n$$\\mathbf{u} = \\frac{\\mathbf{v}}{\\|\\mathbf{v}\\|}$$\n\nA unit vector pointing in the **opposite direction** is $-\\frac{\\mathbf{v}}{\\|\\mathbf{v}\\|}$.",
        "求与非零向量 $\\mathbf{v}$ **同方向**的单位向量 $\\mathbf{u}$，只需将 $\\mathbf{v}$ 除以其模长（归一化）：\n\n$$\\mathbf{u} = \\frac{\\mathbf{v}}{\\|\\mathbf{v}\\|}$$\n\n与 $\\mathbf{v}$ **反方向**的单位向量为 $-\\frac{\\mathbf{v}}{\\|\\mathbf{v}\\|}$。",
      ),
      generate(rng) {
        const triples = [
          { x: 3, y: 4, mag: 5 },
          { x: -3, y: 4, mag: 5 },
          { x: 3, y: -4, mag: 5 },
          { x: -3, y: -4, mag: 5 },
          { x: 4, y: 3, mag: 5 },
          { x: -4, y: 3, mag: 5 },
          { x: 4, y: -3, mag: 5 },
          { x: -4, y: -3, mag: 5 },
          { x: 5, y: 12, mag: 13 },
          { x: -5, y: 12, mag: 13 },
          { x: 5, y: -12, mag: 13 },
          { x: -5, y: -12, mag: 13 },
          { x: 12, y: 5, mag: 13 },
          { x: -12, y: 5, mag: 13 },
          { x: 6, y: 8, mag: 10 },
          { x: -6, y: 8, mag: 10 },
          { x: 8, y: 6, mag: 10 },
          { x: -8, y: 6, mag: 10 },
          { x: 8, y: 15, mag: 17 },
          { x: -8, y: 15, mag: 17 },
          { x: 15, y: 8, mag: 17 },
          { x: -15, y: 8, mag: 17 },
          { x: 7, y: 24, mag: 25 },
          { x: -7, y: 24, mag: 25 },
          { x: 9, y: 12, mag: 15 },
          { x: -9, y: 12, mag: 15 },
          { x: 10, y: 24, mag: 26 },
          { x: -10, y: 24, mag: 26 },
        ];
        const triple = rng.pick(triples);
        const { x, y, mag } = triple;
        const dir = rng.pick(["same", "opposite"]);
        const isSame = dir === "same";

        const ux = isSame ? x : -x;
        const uy = isSame ? y : -y;

        const rightStr = `\\left\\langle \\frac{${ux}}{${mag}}, \\frac{${uy}}{${mag}} \\right\\rangle`;
        const wrong1 = `\\left\\langle \\frac{${-ux}}{${mag}}, \\frac{${-uy}}{${mag}} \\right\\rangle`;
        const wrong2 = `\\left\\langle \\frac{${ux}}{${mag * mag}}, \\frac{${uy}}{${mag * mag}} \\right\\rangle`;
        const wrong3 = `\\langle ${ux}, ${uy} \\rangle`;

        return oneOf(
          rng,
          t(
            `Find the unit vector pointing in the ${isSame ? "same" : "opposite"} direction as $\\mathbf{v} = \\langle ${x}, ${y} \\rangle$.`,
            `求与向量 $\\mathbf{v} = \\langle ${x}, ${y} \\rangle$ ${isSame ? "同向" : "反向"}的单位向量。`,
          ),
          t(`$${rightStr}$`, `$${rightStr}$`),
          [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
          t(
            `The magnitude is $\\|\\mathbf{v}\\| = \\sqrt{(${x})^2 + (${y})^2} = ${mag}$. Dividing by its magnitude and ${isSame ? "keeping" : "reversing"} direction yields $${rightStr}$.`,
            `模长为 $\\|\\mathbf{v}\\| = \\sqrt{(${x})^2 + (${y})^2} = ${mag}$。除以模长并${isSame ? "保持" : "反转"}方向得到 $${rightStr}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 5.16.7 Linear Combinations of Vectors ──────────────────────────────────

/** linearCombinationsOfVectorsAndTheirProperties covers vector algebra and solving scalar systems. */
export const linearCombinationsOfVectorsAndTheirProperties: TopicDef = {
  id: "linear-combinations-of-vectors-and-their-properties",
  title: t("Linear Combinations of Vectors and Their Properties", "向量的线性组合及其性质"),
  summary: t(
    "Form linear combinations of vectors, apply algebraic properties, and solve for unknown scalar coefficients.",
    "计算向量的线性组合，应用代数运算性质，并求解未知数乘系数。",
  ),
  prerequisites: ["the-triangle-law-for-the-addition-of-two-vectors", "parallel-vectors"],
  encompasses: [{ topic: "the-triangle-law-for-the-addition-of-two-vectors", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSN.VM.B.4", "CCSS.HSN.VM.B.5"],
  knowledgePoints: [
    {
      id: "simplify-linear-combinations",
      title: t("Simplify linear combinations of vectors", "化简向量的线性组合"),
      explanation: t(
        "Vector addition and scalar multiplication satisfy distributive properties:\n\n$$c_1(a_1\\mathbf{u} + b_1\\mathbf{v}) + c_2(a_2\\mathbf{u} + b_2\\mathbf{v}) = (c_1 a_1 + c_2 a_2)\\mathbf{u} + (c_1 b_1 + c_2 b_2)\\mathbf{v}$$",
        "向量加法与数乘满足乘法对加法的分配律：\n\n$$c_1(a_1\\mathbf{u} + b_1\\mathbf{v}) + c_2(a_2\\mathbf{u} + b_2\\mathbf{v}) = (c_1 a_1 + c_2 a_2)\\mathbf{u} + (c_1 b_1 + c_2 b_2)\\mathbf{v}$$",
      ),
      generate(rng) {
        const c1 = rng.pick([2, 3, 4, 5]);
        const c2 = rng.pick([-4, -3, -2, 2, 3, 4]);
        const a1 = rng.pick([1, 2, 3]);
        const b1 = rng.pick([-3, -2, -1, 1, 2, 3]);
        const a2 = rng.pick([1, 2, -2]);
        const b2 = rng.pick([-2, -1, 1, 2]);

        const u = rng.pick(["\\mathbf{u}", "\\mathbf{a}"]);
        const v = rng.pick(["\\mathbf{v}", "\\mathbf{b}"]);

        const resU = c1 * a1 + c2 * a2;
        const resV = c1 * b1 + c2 * b2;

        const fmt = (coeff: number, vec: string) => {
          if (coeff === 1) return vec;
          if (coeff === -1) return `-${vec}`;
          return `${coeff}${vec}`;
        };

        const ansStr = `${fmt(resU, u)} ${resV >= 0 ? `+ ${fmt(resV, v)}` : `- ${fmt(Math.abs(resV), v)}`}`;
        const wrong1Str = `${fmt(resU + 2, u)} ${resV >= 0 ? `+ ${fmt(resV, v)}` : `- ${fmt(Math.abs(resV), v)}`}`;
        const wrong2Str = `${fmt(resU, u)} ${resV >= 0 ? `- ${fmt(resV, v)}` : `+ ${fmt(Math.abs(resV), v)}`}`;
        const wrong3Str = `${fmt(c1 * a1, u)} + ${fmt(c2 * b2, v)}`;

        const pStr = `${c1}(${a1 === 1 ? "" : a1}${u} ${b1 > 0 ? `+ ${b1}` : `- ${Math.abs(b1)}`}${v}) ${c2 > 0 ? `+ ${c2}` : `- ${Math.abs(c2)}`}(${a2 === 1 ? "" : a2 === -1 ? "-" : a2}${u} ${b2 > 0 ? `+ ${b2}` : `- ${Math.abs(b2)}`}${v})`;

        return oneOf(
          rng,
          t(`Simplify the expression: $${pStr}$.`, `化简表达式：$${pStr}$。`),
          t(`$${ansStr}$`, `$${ansStr}$`),
          [t(`$${wrong1Str}$`, `$${wrong1Str}$`), t(`$${wrong2Str}$`, `$${wrong2Str}$`), t(`$${wrong3Str}$`, `$${wrong3Str}$`)],
          t(
            `Expand brackets and collect like terms: $(${c1} \\times ${a1} + ${c2} \\times ${a2})${u} + (${c1} \\times (${b1}) + ${c2} \\times (${b2}))${v} = ${ansStr}$.`,
            `展开括号并合并同类项：$(${c1} \\times ${a1} + ${c2} \\times ${a2})${u} + (${c1} \\times (${b1}) + ${c2} \\times (${b2}))${v} = ${ansStr}$。`,
          ),
        );
      },
    },
    {
      id: "solve-for-scalar-coefficients",
      title: t("Solve for unknown scalar coefficients in linear combinations", "求解向量线性组合中的未知标量系数"),
      explanation: t(
        "If vectors $\\mathbf{u}$ and $\\mathbf{v}$ are non-collinear (linearly independent), then:\n\n$$x\\mathbf{u} + y\\mathbf{v} = a\\mathbf{u} + b\\mathbf{v} \\iff x = a \\text{ and } y = b$$",
        "若向量 $\\mathbf{u}$ 和 $\\mathbf{v}$ 不共线（线性无关），则：\n\n$$x\\mathbf{u} + y\\mathbf{v} = a\\mathbf{u} + b\\mathbf{v} \\iff x = a \\text{ 且 } y = b$$",
      ),
      generate(rng) {
        const x = rng.pick([2, 3, 4, 5, 6]);
        const y = rng.pick([1, 2, 3, 4, 5]);
        const c1 = 2 * x + y;
        const c2 = x - y;

        return oneOf(
          rng,
          t(
            `Let $\\mathbf{u}$ and $\\mathbf{v}$ be non-collinear vectors. If $(2x + y)\\mathbf{u} + (x - y)\\mathbf{v} = ${c1}\\mathbf{u} + (${c2})\\mathbf{v}$, find $x$ and $y$.`,
            `设 $\\mathbf{u}$ 与 $\\mathbf{v}$ 为不共线的向量。若 $(2x + y)\\mathbf{u} + (x - y)\\mathbf{v} = ${c1}\\mathbf{u} + (${c2})\\mathbf{v}$，求 $x$ 与 $y$ 的值。`,
          ),
          t(`$x = ${x}, \\; y = ${y}$`, `$x = ${x}, \\; y = ${y}$`),
          [
            t(`$x = ${y}, \\; y = ${x}$`, `$x = ${y}, \\; y = ${x}$`),
            t(`$x = ${x + 1}, \\; y = ${y - 1}$`, `$x = ${x + 1}, \\; y = ${y - 1}$`),
            t(`$x = ${x}, \\; y = ${-y}$`, `$x = ${x}, \\; y = ${-y}$`),
          ],
          t(
            `Since $\\mathbf{u}$ and $\\mathbf{v}$ are non-collinear, coefficients on both sides must match:\n1) $2x + y = ${c1}$\n2) $x - y = ${c2}$\n\nAdding the equations gives $3x = ${c1 + c2} \\implies x = ${x}$. Substituting back gives $y = ${y}$.`,
            `因为 $\\mathbf{u}$ 和 $\\mathbf{v}$ 不共线，对应系数必相等：\n1) $2x + y = ${c1}$\n2) $x - y = ${c2}$\n\n两式相加得 $3x = ${c1 + c2} \\implies x = ${x}$。代回得 $y = ${y}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 5.16.8 Describing the Position Vector of a Point ────────────────────────

/** describingThePositionVectorOfAPointUsingKnownVectors covers section formula and midpoints. */
export const describingThePositionVectorOfAPointUsingKnownVectors: TopicDef = {
  id: "describing-the-position-vector-of-a-point-using-known-vectors",
  title: t("Describing the Position Vector of a Point Using Known Vectors", "用已知向量表示点的未知位置向量"),
  summary: t(
    "Express the position vector of a point relative to an origin using section formulas and midpoints.",
    "利用定比分点公式与中点公式，用已知基底向量表示某点相对于原点的位置向量。",
  ),
  prerequisites: ["linear-combinations-of-vectors-and-their-properties"],
  encompasses: [{ topic: "linear-combinations-of-vectors-and-their-properties", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSN.VM.B.4", "CCSS.HSN.VM.B.5"],
  knowledgePoints: [
    {
      id: "midpoint-position-vector",
      title: t("Position vector of a midpoint", "中点的位置向量"),
      explanation: t(
        "Let $O$ be the origin, and let $\\mathbf{a} = \\vec{OA}$ and $\\mathbf{b} = \\vec{OB}$ be the position vectors of points $A$ and $B$. If $M$ is the **midpoint** of line segment $AB$, then:\n\n$$\\vec{OM} = \\frac{\\vec{OA} + \\vec{OB}}{2} = \\frac{1}{2}\\mathbf{a} + \\frac{1}{2}\\mathbf{b}$$",
        "设 $O$ 为原点，$\\mathbf{a} = \\vec{OA}$ 和 $\\mathbf{b} = \\vec{OB}$ 分别为点 $A$ 和点 $B$ 的位置向量。若 $M$ 为线段 $AB$ 的**中点**，则：\n\n$$\\vec{OM} = \\frac{\\vec{OA} + \\vec{OB}}{2} = \\frac{1}{2}\\mathbf{a} + \\frac{1}{2}\\mathbf{b}$$",
      ),
      generate(rng) {
        const letters = ["A", "B", "C", "D", "P", "Q", "R", "S"];
        const p1 = rng.pick(letters);
        let p2 = rng.pick(letters);
        while (p2 === p1) p2 = rng.pick(letters);

        const a = `\\mathbf{${p1.toLowerCase()}}`;
        const b = `\\mathbf{${p2.toLowerCase()}}`;

        return oneOf(
          rng,
          t(
            `Let $O$ be the origin, with position vectors $\\vec{O${p1}} = ${a}$ and $\\vec{O${p2}} = ${b}$. Express the position vector $\\vec{OM}$ of the midpoint $M$ of segment $${p1}${p2}$ in terms of $${a}$ and $${b}$.`,
            `设 $O$ 为原点，已知位置向量 $\\vec{O${p1}} = ${a}$，$\\vec{O${p2}} = ${b}$。用 $${a}$ 和 $${b}$ 表示线段 $${p1}${p2}$ 的中点 $M$ 的位置向量 $\\vec{OM}$。`,
          ),
          t(`$\\frac{1}{2}${a} + \\frac{1}{2}${b}$`, `$\\frac{1}{2}${a} + \\frac{1}{2}${b}$`),
          [
            t(`$${a} + ${b}$`, `$${a} + ${b}$`),
            t(`$\\frac{1}{2}${a} - \\frac{1}{2}${b}$`, `$\\frac{1}{2}${a} - \\frac{1}{2}${b}$`),
            t(`$2${a} + 2${b}$`, `$2${a} + 2${b}$`),
          ],
          t(
            `By the midpoint vector formula, $\\vec{OM} = \\frac{\\vec{O${p1}} + \\vec{O${p2}}}{2} = \\frac{1}{2}${a} + \\frac{1}{2}${b}$.`,
            `根据中点向量公式，$\\vec{OM} = \\frac{\\vec{O${p1}} + \\vec{O${p2}}}{2} = \\frac{1}{2}${a} + \\frac{1}{2}${b}$。`,
          ),
        );
      },
    },
    {
      id: "section-formula-position-vector",
      title: t("Position vector dividing a segment in a given ratio", "定比分点的位置向量"),
      explanation: t(
        "If a point $P$ divides the directed line segment $AB$ internally in the ratio $m : n$ (that is, $AP : PB = m : n$), its position vector with respect to origin $O$ is given by the **section formula**:\n\n$$\\vec{OP} = \\frac{n\\vec{OA} + m\\vec{OB}}{m + n}$$",
        "若点 $P$ 内分有向线段 $AB$，使得 $AP : PB = m : n$，则其相对于原点 $O$ 的位置向量由**定比分点公式**给出：\n\n$$\\vec{OP} = \\frac{n\\vec{OA} + m\\vec{OB}}{m + n}$$",
      ),
      generate(rng) {
        const pointPairs = [
          { p1: "A", p2: "B", a: "\\mathbf{a}", b: "\\mathbf{b}" },
          { p1: "P", p2: "Q", a: "\\mathbf{p}", b: "\\mathbf{q}" },
          { p1: "C", p2: "D", a: "\\mathbf{c}", b: "\\mathbf{d}" },
          { p1: "M", p2: "N", a: "\\mathbf{m}", b: "\\mathbf{n}" },
          { p1: "X", p2: "Y", a: "\\mathbf{u}", b: "\\mathbf{v}" },
        ];
        const { p1, p2, a, b } = rng.pick(pointPairs)!;

        const ratios = [
          { m: 1, n: 2 },
          { m: 2, n: 1 },
          { m: 1, n: 3 },
          { m: 3, n: 1 },
          { m: 2, n: 3 },
          { m: 3, n: 2 },
          { m: 1, n: 4 },
          { m: 4, n: 1 },
          { m: 2, n: 5 },
          { m: 5, n: 2 },
          { m: 3, n: 4 },
          { m: 4, n: 3 },
          { m: 1, n: 5 },
          { m: 5, n: 1 },
          { m: 3, n: 5 },
          { m: 5, n: 3 },
        ];
        const { m, n } = rng.pick(ratios);
        const sum = m + n;

        const divPt = rng.pick(["K", "R", "T", "S", "W"]);

        const rightAns = `\\frac{${n}}{${sum}}${a} + \\frac{${m}}{${sum}}${b}`;
        const swappedAns = `\\frac{${m}}{${sum}}${a} + \\frac{${n}}{${sum}}${b}`;
        const wrong1 = `\\frac{${m}}{${sum}}${a} - \\frac{${n}}{${sum}}${b}`;
        const wrong2 = `${m}${a} + ${n}${b}`;

        return oneOf(
          rng,
          t(
            `Point $${divPt}$ lies on segment $${p1}${p2}$ such that $${p1}${divPt} : ${divPt}${p2} = ${m} : ${n}$. If $\\vec{O${p1}} = ${a}$ and $\\vec{O${p2}} = ${b}$, express $\\vec{O${divPt}}$ in terms of $${a}$ and $${b}$.`,
            `点 $${divPt}$ 在线段 $${p1}${p2}$ 上，满足 $${p1}${divPt} : ${divPt}${p2} = ${m} : ${n}$。若 $\\vec{O${p1}} = ${a}$，$\\vec{O${p2}} = ${b}$，用 $${a}$ 和 $${b}$ 表示 $\\vec{O${divPt}}$。`,
          ),
          t(`$${rightAns}$`, `$${rightAns}$`),
          [t(`$${swappedAns}$`, `$${swappedAns}$`), t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`)],
          t(
            `Since $\\vec{${p1}${divPt}} = \\frac{${m}}{${sum}}\\vec{${p1}${p2}} = \\frac{${m}}{${sum}}(${b} - ${a})$, we have $\\vec{O${divPt}} = \\vec{O${p1}} + \\vec{${p1}${divPt}} = ${a} + \\frac{${m}}{${sum}}(${b} - ${a}) = ${rightAns}$.`,
            `因为 $\\vec{${p1}${divPt}} = \\frac{${m}}{${sum}}\\vec{${p1}${p2}} = \\frac{${m}}{${sum}}(${b} - ${a})$，所以 $\\vec{O${divPt}} = \\vec{O${p1}} + \\vec{${p1}${divPt}} = ${a} + \\frac{${m}}{${sum}}(${b} - ${a}) = ${rightAns}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 5.17.1 Two-Dimensional Vectors Expressed in Component Form ─────────────

/** twoDimensionalVectorsExpressedInComponentForm covers coordinates and standard basis. */
export const twoDimensionalVectorsExpressedInComponentForm: TopicDef = {
  id: "two-dimensional-vectors-expressed-in-component-form",
  title: t("Two-Dimensional Vectors Expressed in Component Form", "二维向量的坐标表示"),
  summary: t(
    "Represent 2D vectors in component form ⟨x, y⟩ and standard basis form xi + yj from initial and terminal coordinates.",
    "根据起点和终点坐标，将二维向量表示为坐标分量形式 ⟨x, y⟩ 或标准基底形式 xi + yj。",
  ),
  prerequisites: ["describing-the-position-vector-of-a-point-using-known-vectors"],
  encompasses: [{ topic: "describing-the-position-vector-of-a-point-using-known-vectors", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSN.VM.A.1", "CCSS.HSN.VM.A.2"],
  knowledgePoints: [
    {
      id: "vector-from-two-points",
      title: t("Find component form from initial and terminal points", "由起点与终点坐标求向量的坐标分量"),
      explanation: t(
        "For a directed line segment with initial point $A(x_1, y_1)$ and terminal point $B(x_2, y_2)$, the component form of vector $\\vec{AB}$ is obtained by subtracting initial coordinates from terminal coordinates:\n\n$$\\vec{AB} = \\langle x_2 - x_1,\\, y_2 - y_1 \\rangle$$",
        "对于起点为 $A(x_1, y_1)$、终点为 $B(x_2, y_2)$ 的有向线段，向量 $\\vec{AB}$ 的坐标分量形式由终点坐标减去起点坐标得到：\n\n$$\\vec{AB} = \\langle x_2 - x_1,\\, y_2 - y_1 \\rangle$$",
      ),
      generate(rng) {
        const x1 = rng.pick([-8, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 8]);
        const y1 = rng.pick([-7, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 7]);
        const dx = rng.pick([-9, -7, -5, -4, -3, -2, 2, 3, 4, 5, 7, 9]);
        const dy = rng.pick([-8, -6, -4, -3, -2, 2, 3, 4, 6, 8]);
        const x2 = x1 + dx;
        const y2 = y1 + dy;

        const ans = `\\langle ${dx}, ${dy} \\rangle`;
        const wrong1 = `\\langle ${-dx}, ${-dy} \\rangle`;
        const wrong2 = `\\langle ${x1 + x2}, ${y1 + y2} \\rangle`;
        const wrong3 = `\\langle ${dy}, ${dx} \\rangle`;

        return oneOf(
          rng,
          t(
            `Find the component form of vector $\\vec{AB}$ given initial point $A(${x1}, ${y1})$ and terminal point $B(${x2}, ${y2})$.`,
            `已知起点 $A(${x1}, ${y1})$ 与终点 $B(${x2}, ${y2})$，求向量 $\\vec{AB}$ 的坐标分量形式。`,
          ),
          t(`$${ans}$`, `$${ans}$`),
          [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
          t(
            `Subtract initial point coordinates from terminal point coordinates: $\\vec{AB} = \\langle ${x2} - (${x1}),\\, ${y2} - (${y1}) \\rangle = ${ans}$.`,
            `终点坐标减去起点坐标：$\\vec{AB} = \\langle ${x2} - (${x1}),\\, ${y2} - (${y1}) \\rangle = ${ans}$。`,
          ),
        );
      },
    },
    {
      id: "component-and-standard-basis-forms",
      title: t("Convert between component form and standard basis form", "分量形式与标准基底形式之间的转换"),
      explanation: t(
        "A 2D vector in component form $\\mathbf{v} = \\langle x, y \\rangle$ can be written uniquely as a linear combination of the standard unit basis vectors $\\mathbf{i} = \\langle 1, 0 \\rangle$ and $\\mathbf{j} = \\langle 0, 1 \\rangle$:\n\n$$\\mathbf{v} = x\\mathbf{i} + y\\mathbf{j}$$",
        "二维向量的坐标形式 $\\mathbf{v} = \\langle x, y \\rangle$ 可以唯一表示为标准单位基底向量 $\\mathbf{i} = \\langle 1, 0 \\rangle$ 和 $\\mathbf{j} = \\langle 0, 1 \\rangle$ 的线性组合：\n\n$$\\mathbf{v} = x\\mathbf{i} + y\\mathbf{j}$$",
      ),
      generate(rng) {
        const x = rng.pick([-9, -7, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 7, 9]);
        const y = rng.pick([-8, -6, -5, -3, -2, -1, 1, 2, 3, 5, 6, 8]);

        const fmtBasis = (a: number, b: number) => {
          const partA = a === 1 ? "\\mathbf{i}" : a === -1 ? "-\\mathbf{i}" : `${a}\\mathbf{i}`;
          const partB = b === 1 ? "\\mathbf{j}" : b === -1 ? "-\\mathbf{j}" : `${Math.abs(b)}\\mathbf{j}`;
          return `${partA} ${b > 0 ? "+ " : "- "}${partB}`;
        };

        const ansBasis = fmtBasis(x, y);
        const wrong1 = fmtBasis(x, -y);
        const wrong2 = fmtBasis(y, x);
        const wrong3 = fmtBasis(-x, -y);

        return oneOf(
          rng,
          t(
            `Express the vector $\\mathbf{v} = \\langle ${x}, ${y} \\rangle$ in terms of the standard unit basis vectors $\\mathbf{i}$ and $\\mathbf{j}$.`,
            `用标准单位基底向量 $\\mathbf{i}$ 和 $\\mathbf{j}$ 表示向量 $\\mathbf{v} = \\langle ${x}, ${y} \\rangle$。`,
          ),
          t(`$${ansBasis}$`, `$${ansBasis}$`),
          [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
          t(
            `Since $\\mathbf{v} = \\langle x, y \\rangle = x\\mathbf{i} + y\\mathbf{j}$, substituting $x = ${x}$ and $y = ${y}$ yields $${ansBasis}$.`,
            `因为 $\\mathbf{v} = \\langle x, y \\rangle = x\\mathbf{i} + y\\mathbf{j}$，代入 $x = ${x}$ 和 $y = ${y}$ 得 $${ansBasis}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 5.17.2 Addition and Scalar Multiplication in 2D ────────────────────────

/** additionAndScalarMultiplicationOfCartesianVectorsIn2d covers Cartesian vector arithmetic. */
export const additionAndScalarMultiplicationOfCartesianVectorsIn2d: TopicDef = {
  id: "addition-and-scalar-multiplication-of-cartesian-vectors-in-2d",
  title: t("Addition and Scalar Multiplication of Cartesian Vectors in 2D", "二维平面向量的加法与数乘运算"),
  summary: t(
    "Perform vector addition, subtraction, and scalar multiplication algebraically using Cartesian coordinates.",
    "利用直角坐标代数计算二维向量的加法、减法和数乘运算。",
  ),
  prerequisites: ["two-dimensional-vectors-expressed-in-component-form"],
  encompasses: [{ topic: "two-dimensional-vectors-expressed-in-component-form", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSN.VM.B.4", "CCSS.HSN.VM.B.5"],
  knowledgePoints: [
    {
      id: "add-and-subtract-cartesian-vectors",
      title: t("Add and subtract 2D Cartesian vectors", "二维直角坐标向量的加减运算"),
      explanation: t(
        "For vectors $\\mathbf{u} = \\langle u_1, u_2 \\rangle$ and $\\mathbf{v} = \\langle v_1, v_2 \\rangle$:\n\n$$\\mathbf{u} + \\mathbf{v} = \\langle u_1 + v_1,\\, u_2 + v_2 \\rangle$$\n\n$$\\mathbf{u} - \\mathbf{v} = \\langle u_1 - v_1,\\, u_2 - v_2 \\rangle$$",
        "对于向量 $\\mathbf{u} = \\langle u_1, u_2 \\rangle$ 和 $\\mathbf{v} = \\langle v_1, v_2 \\rangle$：\n\n$$\\mathbf{u} + \\mathbf{v} = \\langle u_1 + v_1,\\, u_2 + v_2 \\rangle$$\n\n$$\\mathbf{u} - \\mathbf{v} = \\langle u_1 - v_1,\\, u_2 - v_2 \\rangle$$",
      ),
      generate(rng) {
        const u1 = rng.pick([-7, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 7]);
        const u2 = rng.pick([-6, -5, -3, -2, 2, 3, 5, 6]);
        const v1 = rng.pick([-8, -6, -4, -2, 1, 3, 5, 7]);
        const v2 = rng.pick([-7, -4, -1, 1, 4, 7]);

        const isAdd = rng.pick([true, false]);
        const rx = isAdd ? u1 + v1 : u1 - v1;
        const ry = isAdd ? u2 + v2 : u2 - v2;

        const opSymbol = isAdd ? "+" : "-";
        const ans = `\\langle ${rx}, ${ry} \\rangle`;
        const wrong1 = `\\langle ${isAdd ? u1 - v1 : u1 + v1}, ${isAdd ? u2 - v2 : u2 + v2} \\rangle`;
        const wrong2 = `\\langle ${rx}, ${-ry} \\rangle`;
        const wrong3 = `\\langle ${ry}, ${rx} \\rangle`;

        return oneOf(
          rng,
          t(
            `Given $\\mathbf{u} = \\langle ${u1}, ${u2} \\rangle$ and $\\mathbf{v} = \\langle ${v1}, ${v2} \\rangle$, calculate $\\mathbf{u} ${opSymbol} \\mathbf{v}$.`,
            `已知 $\\mathbf{u} = \\langle ${u1}, ${u2} \\rangle$ 且 $\\mathbf{v} = \\langle ${v1}, ${v2} \\rangle$，计算 $\\mathbf{u} ${opSymbol} \\mathbf{v}$。`,
          ),
          t(`$${ans}$`, `$${ans}$`),
          [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
          t(
            `Combine corresponding components: $\\mathbf{u} ${opSymbol} \\mathbf{v} = \\langle ${u1} ${opSymbol} (${v1}),\\, ${u2} ${opSymbol} (${v2}) \\rangle = ${ans}$.`,
            `对应分量分别进行运算：$\\mathbf{u} ${opSymbol} \\mathbf{v} = \\langle ${u1} ${opSymbol} (${v1}),\\, ${u2} ${opSymbol} (${v2}) \\rangle = ${ans}$。`,
          ),
        );
      },
    },
    {
      id: "scalar-multiplication-and-linear-combination-2d",
      title: t("Scalar multiplication and linear combinations in 2D", "二维向量的数乘与线性组合"),
      explanation: t(
        "Multiplying vector $\\mathbf{v} = \\langle x, y \\rangle$ by scalar $k$ yields $k\\mathbf{v} = \\langle kx, ky \\rangle$.\n\nA linear combination is computed component-wise:\n\n$$a\\mathbf{u} + b\\mathbf{v} = \\langle a u_1 + b v_1,\\, a u_2 + b v_2 \\rangle$$",
        "标量 $k$ 乘以向量 $\\mathbf{v} = \\langle x, y \\rangle$ 得 $k\\mathbf{v} = \\langle kx, ky \\rangle$。\n\n线性组合按分量分别计算：\n\n$$a\\mathbf{u} + b\\mathbf{v} = \\langle a u_1 + b v_1,\\, a u_2 + b v_2 \\rangle$$",
      ),
      generate(rng) {
        const a = rng.pick([2, 3, 4, -2, -3]);
        const b = rng.pick([2, 3, -2, -3]);
        const u1 = rng.pick([-4, -3, -2, 1, 2, 3, 4]);
        const u2 = rng.pick([-3, -1, 1, 2, 3]);
        const v1 = rng.pick([-3, -2, 1, 2, 3]);
        const v2 = rng.pick([-4, -2, 1, 2, 4]);

        const rx = a * u1 + b * v1;
        const ry = a * u2 + b * v2;

        const ans = `\\langle ${rx}, ${ry} \\rangle`;
        const wrong1 = `\\langle ${rx + 1}, ${ry - 1} \\rangle`;
        const wrong2 = `\\langle ${a * u1 - b * v1}, ${a * u2 - b * v2} \\rangle`;
        const wrong3 = `\\langle ${ry}, ${rx} \\rangle`;

        const bSignStr = b > 0 ? `+ ${b}` : `- ${Math.abs(b)}`;

        return oneOf(
          rng,
          t(
            `Given $\\mathbf{u} = \\langle ${u1}, ${u2} \\rangle$ and $\\mathbf{v} = \\langle ${v1}, ${v2} \\rangle$, evaluate the linear combination $${a}\\mathbf{u} ${bSignStr}\\mathbf{v}$.`,
            `已知 $\\mathbf{u} = \\langle ${u1}, ${u2} \\rangle$ 且 $\\mathbf{v} = \\langle ${v1}, ${v2} \\rangle$，计算线性组合 $${a}\\mathbf{u} ${bSignStr}\\mathbf{v}$。`,
          ),
          t(`$${ans}$`, `$${ans}$`),
          [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
          t(
            `Compute each component: $x = ${a}(${u1}) + (${b})(${v1}) = ${rx}$, and $y = ${a}(${u2}) + (${b})(${v2}) = ${ry}$, giving $${ans}$.`,
            `分别计算各分量：$x = ${a}(${u1}) + (${b})(${v1}) = ${rx}$，$y = ${a}(${u2}) + (${b})(${v2}) = ${ry}$，得到 $${ans}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 5.17.3 Calculating the Magnitude of Cartesian Vectors in 2D ────────────

/** calculatingTheMagnitudeOfCartesianVectorsIn2d covers vector length via the Pythagorean theorem. */
export const calculatingTheMagnitudeOfCartesianVectorsIn2d: TopicDef = {
  id: "calculating-the-magnitude-of-cartesian-vectors-in-2d",
  title: t("Calculating the Magnitude of Cartesian Vectors in 2D", "计算二维平面向量的模长"),
  summary: t(
    "Calculate the magnitude (length) of a Cartesian vector in 2D using the Pythagorean formula.",
    "利用勾股定理计算二维直角坐标向量的模长（长度）。",
  ),
  prerequisites: ["addition-and-scalar-multiplication-of-cartesian-vectors-in-2d"],
  encompasses: [{ topic: "addition-and-scalar-multiplication-of-cartesian-vectors-in-2d", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSN.VM.A.1", "CCSS.HSN.VM.A.2"],
  knowledgePoints: [
    {
      id: "magnitude-of-component-vector",
      title: t("Magnitude of a vector in component form", "坐标形式向量的模长"),
      explanation: t(
        "By the Pythagorean theorem, the **magnitude** of vector $\\mathbf{v} = \\langle x, y \\rangle$ is the distance from the origin to $(x, y)$:\n\n$$\\|\\mathbf{v}\\| = \\sqrt{x^2 + y^2}$$",
        "由勾股定理，向量 $\\mathbf{v} = \\langle x, y \\rangle$ 的**模长**是原点到点 $(x, y)$ 的距离：\n\n$$\\|\\mathbf{v}\\| = \\sqrt{x^2 + y^2}$$",
      ),
      generate(rng) {
        const triples = [
          { x: 3, y: 4, ans: 5, ansStr: "5" },
          { x: -3, y: 4, ans: 5, ansStr: "5" },
          { x: 3, y: -4, ans: 5, ansStr: "5" },
          { x: -3, y: -4, ans: 5, ansStr: "5" },
          { x: 4, y: 3, ans: 5, ansStr: "5" },
          { x: -4, y: 3, ans: 5, ansStr: "5" },
          { x: 4, y: -3, ans: 5, ansStr: "5" },
          { x: -4, y: -3, ans: 5, ansStr: "5" },
          { x: 6, y: 8, ans: 10, ansStr: "10" },
          { x: -6, y: 8, ans: 10, ansStr: "10" },
          { x: 6, y: -8, ans: 10, ansStr: "10" },
          { x: -6, y: -8, ans: 10, ansStr: "10" },
          { x: 8, y: 6, ans: 10, ansStr: "10" },
          { x: -8, y: 6, ans: 10, ansStr: "10" },
          { x: 5, y: 12, ans: 13, ansStr: "13" },
          { x: -5, y: 12, ans: 13, ansStr: "13" },
          { x: 5, y: -12, ans: 13, ansStr: "13" },
          { x: -5, y: -12, ans: 13, ansStr: "13" },
          { x: 12, y: 5, ans: 13, ansStr: "13" },
          { x: -12, y: 5, ans: 13, ansStr: "13" },
          { x: 9, y: 12, ans: 15, ansStr: "15" },
          { x: -9, y: 12, ans: 15, ansStr: "15" },
          { x: 12, y: 9, ans: 15, ansStr: "15" },
          { x: 8, y: 15, ans: 17, ansStr: "17" },
          { x: -8, y: 15, ans: 17, ansStr: "17" },
          { x: 15, y: 8, ans: 17, ansStr: "17" },
          { x: 7, y: 24, ans: 25, ansStr: "25" },
          { x: -7, y: 24, ans: 25, ansStr: "25" },
          { x: 24, y: 7, ans: 25, ansStr: "25" },
          { x: -7, y: -24, ans: 25, ansStr: "25" },
          { x: 10, y: 24, ans: 26, ansStr: "26" },
          { x: -10, y: 24, ans: 26, ansStr: "26" },
          { x: 1, y: 1, ans: 0, ansStr: "\\sqrt{2}" },
          { x: -1, y: 1, ans: 0, ansStr: "\\sqrt{2}" },
          { x: 1, y: -1, ans: 0, ansStr: "\\sqrt{2}" },
          { x: -2, y: 2, ans: 0, ansStr: "2\\sqrt{2}" },
          { x: 2, y: 2, ans: 0, ansStr: "2\\sqrt{2}" },
          { x: 1, y: 2, ans: 0, ansStr: "\\sqrt{5}" },
          { x: -1, y: 2, ans: 0, ansStr: "\\sqrt{5}" },
          { x: 2, y: 1, ans: 0, ansStr: "\\sqrt{5}" },
          { x: 2, y: 3, ans: 0, ansStr: "\\sqrt{13}" },
          { x: -2, y: 3, ans: 0, ansStr: "\\sqrt{13}" },
          { x: 3, y: 2, ans: 0, ansStr: "\\sqrt{13}" },
          { x: 3, y: 5, ans: 0, ansStr: "\\sqrt{34}" },
          { x: 1, y: 7, ans: 0, ansStr: "5\\sqrt{2}" },
        ];
        const item = rng.pick(triples);
        const { x, y, ansStr } = item;

        const wrong1 = item.ans > 0 ? `${item.ans + 2}` : `\\sqrt{${x * x + y * y + 3}}`;
        const wrong2 = `${Math.abs(x) + Math.abs(y)}`;
        const wrong3 = item.ans > 0 ? `${Math.abs(x * y)}` : `\\sqrt{${x * x + y * y - 2}}`;

        return oneOf(
          rng,
          t(
            `Find the magnitude of the vector $\\mathbf{v} = \\langle ${x}, ${y} \\rangle$.`,
            `求向量 $\\mathbf{v} = \\langle ${x}, ${y} \\rangle$ 的模长。`,
          ),
          t(`$\\|\\mathbf{v}\\| = ${ansStr}$`, `$\\|\\mathbf{v}\\| = ${ansStr}$`),
          [
            t(`$\\|\\mathbf{v}\\| = ${wrong1}$`, `$\\|\\mathbf{v}\\| = ${wrong1}$`),
            t(`$\\|\\mathbf{v}\\| = ${wrong2}$`, `$\\|\\mathbf{v}\\| = ${wrong2}$`),
            t(`$\\|\\mathbf{v}\\| = ${wrong3}$`, `$\\|\\mathbf{v}\\| = ${wrong3}$`),
          ],
          t(
            `Using the magnitude formula: $\\|\\mathbf{v}\\| = \\sqrt{(${x})^2 + (${y})^2} = \\sqrt{${x * x + y * y}} = ${ansStr}$.`,
            `由模长公式：$\\|\\mathbf{v}\\| = \\sqrt{(${x})^2 + (${y})^2} = \\sqrt{${x * x + y * y}} = ${ansStr}$。`,
          ),
        );
      },
    },
    {
      id: "magnitude-of-linear-combination",
      title: t("Magnitude of a sum or scaled vector", "和向量或数乘向量的模长"),
      explanation: t(
        "To find the magnitude of a linear combination such as $\\|\\mathbf{u} + \\mathbf{v}\\|$, first calculate the component coordinates of the resulting vector, then apply $\\|\\mathbf{w}\\| = \\sqrt{w_1^2 + w_2^2}$.",
        "求和向量或线性组合的模长（如 $\\|\\mathbf{u} + \\mathbf{v}\\|$），先计算出合向量的坐标分量，再应用公式 $\\|\\mathbf{w}\\| = \\sqrt{w_1^2 + w_2^2}$。",
      ),
      generate(rng) {
        const pairs = [
          { u1: 1, u2: 2, v1: 2, v2: 2, s1: 3, s2: 4, mag: 5, magStr: "" },
          { u1: 2, u2: 1, v1: 1, v2: 3, s1: 3, s2: 4, mag: 5, magStr: "" },
          { u1: -1, u2: 3, v1: 4, v2: 1, s1: 3, s2: 4, mag: 5, magStr: "" },
          { u1: 5, u2: 1, v1: -2, v2: 3, s1: 3, s2: 4, mag: 5, magStr: "" },
          { u1: 4, u2: 1, v1: 2, v2: 7, s1: 6, s2: 8, mag: 10, magStr: "" },
          { u1: 3, u2: 5, v1: 3, v2: 3, s1: 6, s2: 8, mag: 10, magStr: "" },
          { u1: 1, u2: 4, v1: 5, v2: 4, s1: 6, s2: 8, mag: 10, magStr: "" },
          { u1: -2, u2: 5, v1: 7, v2: 7, s1: 5, s2: 12, mag: 13, magStr: "" },
          { u1: 1, u2: 8, v1: 4, v2: 4, s1: 5, s2: 12, mag: 13, magStr: "" },
          { u1: 2, u2: 6, v1: 3, v2: 6, s1: 5, s2: 12, mag: 13, magStr: "" },
          { u1: 3, u2: -1, v1: 5, v2: 16, s1: 8, s2: 15, mag: 17, magStr: "" },
          { u1: 4, u2: 7, v1: 4, v2: 8, s1: 8, s2: 15, mag: 17, magStr: "" },
          { u1: -1, u2: 10, v1: 8, v2: 14, s1: 7, s2: 24, mag: 25, magStr: "" },
          { u1: 5, u2: 12, v1: 2, v2: 12, s1: 7, s2: 24, mag: 25, magStr: "" },
          { u1: 2, u2: 3, v1: 1, v2: 1, s1: 3, s2: 4, mag: 5, magStr: "" },
          { u1: 5, u2: 3, v1: -2, v2: 1, s1: 3, s2: 4, mag: 5, magStr: "" },
          { u1: 7, u2: 9, v1: -2, v2: -1, s1: 5, s2: 8, mag: 0, magStr: "\\sqrt{89}" },
          { u1: 1, u2: 4, v1: 3, v2: 2, s1: 4, s2: 6, mag: 0, magStr: "2\\sqrt{13}" },
          { u1: 2, u2: 5, v1: 1, v2: -2, s1: 3, s2: 3, mag: 0, magStr: "3\\sqrt{2}" },
          { u1: -3, u2: 2, v1: 5, v2: 0, s1: 2, s2: 2, mag: 0, magStr: "2\\sqrt{2}" },
          { u1: 4, u2: -2, v1: 1, v2: 3, s1: 5, s2: 1, mag: 0, magStr: "\\sqrt{26}" },
          { u1: 3, u2: 1, v1: -1, v2: 3, s1: 2, s2: 4, mag: 0, magStr: "2\\sqrt{5}" },
          { u1: 6, u2: 2, v1: -2, v2: 1, s1: 4, s2: 3, mag: 5, magStr: "" },
          { u1: 0, u2: 4, v1: 3, v2: 0, s1: 3, s2: 4, mag: 5, magStr: "" },
          { u1: -4, u2: 1, v1: 1, v2: 3, s1: -3, s2: 4, mag: 5, magStr: "" },
          { u1: 2, u2: -1, v1: 2, v2: -2, s1: 4, s2: -3, mag: 5, magStr: "" },
          { u1: 1, u2: 1, v1: 5, v2: 7, s1: 6, s2: 8, mag: 10, magStr: "" },
          { u1: -2, u2: 3, v1: -4, v2: 5, s1: -6, s2: 8, mag: 10, magStr: "" },
          { u1: 3, u2: 2, v1: 2, v2: 10, s1: 5, s2: 12, mag: 13, magStr: "" },
          { u1: 8, u2: 5, v1: -3, v2: 7, s1: 5, s2: 12, mag: 13, magStr: "" },
        ];
        const item = rng.pick(pairs);
        const { u1, u2, v1, v2, s1, s2 } = item;
        const ans = item.mag > 0 ? `${item.mag}` : item.magStr;

        const wrong1 = item.mag > 0 ? `${item.mag + 2}` : "\\sqrt{97}";
        const wrong2 = `${Math.abs(s1) + Math.abs(s2)}`;
        const wrong3 = item.mag > 0 ? `${item.mag - 1}` : "10";

        return oneOf(
          rng,
          t(
            `Given $\\mathbf{u} = \\langle ${u1}, ${u2} \\rangle$ and $\\mathbf{v} = \\langle ${v1}, ${v2} \\rangle$, find the magnitude of their sum, $\\|\\mathbf{u} + \\mathbf{v}\\|$.`,
            `已知 $\\mathbf{u} = \\langle ${u1}, ${u2} \\rangle$ 且 $\\mathbf{v} = \\langle ${v1}, ${v2} \\rangle$，求它们的和向量模长 $\\|\\mathbf{u} + \\mathbf{v}\\|$。`,
          ),
          t(`$${ans}$`, `$${ans}$`),
          [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
          t(
            `First add the vectors: $\\mathbf{u} + \\mathbf{v} = \\langle ${u1} + ${v1},\\, ${u2} + ${v2} \\rangle = \\langle ${s1}, ${s2} \\rangle$. Then compute magnitude: $\\sqrt{(${s1})^2 + (${s2})^2} = ${ans}$.`,
            `首先计算向量之和：$\\mathbf{u} + \\mathbf{v} = \\langle ${u1} + ${v1},\\, ${u2} + ${v2} \\rangle = \\langle ${s1}, ${s2} \\rangle$。然后计算模长：$\\sqrt{(${s1})^2 + (${s2})^2} = ${ans}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 5.17.4 Calculating the Direction of Cartesian Vectors in 2D ────────────

/** calculatingTheDirectionOfCartesianVectorsIn2d covers quadrant-aware direction angles. */
export const calculatingTheDirectionOfCartesianVectorsIn2d: TopicDef = {
  id: "calculating-the-direction-of-cartesian-vectors-in-2d",
  title: t("Calculating the Direction of Cartesian Vectors in 2D", "计算二维平面向量的方向角"),
  summary: t(
    "Determine the direction angle θ ∈ [0°, 360°) of a 2D vector from its Cartesian components using inverse tangent and quadrant analysis.",
    "利用反正切函数与象限分析，由二维向量的坐标分量计算其方向角 θ ∈ [0°, 360°)。",
  ),
  prerequisites: ["calculating-the-magnitude-of-cartesian-vectors-in-2d"],
  encompasses: [{ topic: "calculating-the-magnitude-of-cartesian-vectors-in-2d", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSN.VM.A.1"],
  knowledgePoints: [
    {
      id: "direction-angle-quadrant-i-and-axes",
      title: t("Direction angle on coordinate axes and Quadrant I", "坐标轴上及第一象限向量的方向角"),
      explanation: t(
        "The **direction angle** $\\theta \\in [0^\\circ, 360^\\circ)$ of vector $\\mathbf{v} = \\langle x, y \\rangle$ is measured counterclockwise from the positive $x$-axis.\n\n- Along axes: $\\langle c, 0 \\rangle$ has $\\theta = 0^\\circ$ ($c > 0$) or $180^\\circ$ ($c < 0$); $\\langle 0, c \\rangle$ has $\\theta = 90^\\circ$ ($c > 0$) or $270^\\circ$ ($c < 0$).\n- In Quadrant I ($x > 0, y > 0$): $\\theta = \\arctan\\left(\\frac{y}{x}\\right)$.",
        "向量 $\\mathbf{v} = \\langle x, y \\rangle$ 的**方向角** $\\theta \\in [0^\\circ, 360^\\circ)$ 是从正 $x$ 轴逆时针测量的角度。\n\n- 在坐标轴上：$\\langle c, 0 \\rangle$ 的方向角为 $0^\\circ$（$c > 0$）或 $180^\\circ$（$c < 0$）；$\\langle 0, c \\rangle$ 的方向角为 $90^\\circ$（$c > 0$）或 $270^\\circ$（$c < 0$）。\n- 在第一象限（$x > 0, y > 0$）：$\\theta = \\arctan\\left(\\frac{y}{x}\\right)$。",
      ),
      generate(rng) {
        const k = rng.pick([1, 2, 3, 4, 5, 6, 7, 8]);
        const items = [
          { vec: `\\langle ${k}, 0 \\rangle`, theta: 0 },
          { vec: `\\langle 0, ${k} \\rangle`, theta: 90 },
          { vec: `\\langle ${k}, ${k} \\rangle`, theta: 45 },
          { vec: `\\langle ${k}\\sqrt{3}, ${k} \\rangle`, theta: 30 },
          { vec: `\\langle ${k}, ${k}\\sqrt{3} \\rangle`, theta: 60 },
        ];
        const item = rng.pick(items);
        const { vec, theta } = item;

        const wrongAngles = [30, 45, 60, 90, 0].filter((a) => a !== theta).slice(0, 3);

        return oneOf(
          rng,
          t(
            `Find the direction angle $\\theta \\in [0^\\circ, 360^\\circ)$ of the vector $\\mathbf{v} = ${vec}$.`,
            `求向量 $\\mathbf{v} = ${vec}$ 的方向角 $\\theta \\in [0^\\circ, 360^\\circ)$。`,
          ),
          t(`$\\theta = ${theta}^\\circ$`, `$\\theta = ${theta}^\\circ$`),
          wrongAngles.map((w) => t(`$\\theta = ${w}^\\circ$`, `$\\theta = ${w}^\\circ$`)),
          t(
            `The vector lies ${theta % 90 === 0 ? "on a positive coordinate axis" : "in Quadrant I"}. Using $\\tan\\theta = y/x$, we obtain $\\theta = ${theta}^\\circ$.`,
            `该向量位于${theta % 90 === 0 ? "正坐标轴上" : "第一象限"}。由 $\\tan\\theta = y/x$ 求得 $\\theta = ${theta}^\\circ$。`,
          ),
        );
      },
    },
    {
      id: "direction-angle-all-quadrants",
      title: t("Direction angle in Quadrants II, III, and IV", "第二、三、四象限向量的方向角"),
      explanation: t(
        "For a vector $\\mathbf{v} = \\langle x, y \\rangle$ outside Quadrant I, first find the reference angle $\\alpha = \\arctan\\left(\\left|\\frac{y}{x}\\right|\\right)$:\n\n- Quadrant II ($x < 0, y > 0$): $\\theta = 180^\\circ - \\alpha$\n- Quadrant III ($x < 0, y < 0$): $\\theta = 180^\\circ + \\alpha$\n- Quadrant IV ($x > 0, y < 0$): $\\theta = 360^\\circ - \\alpha$",
        "对于不在第一象限的向量 $\\mathbf{v} = \\langle x, y \\rangle$，先计算参考角 $\\alpha = \\arctan\\left(\\left|\\frac{y}{x}\\right|\\right)$：\n\n- 第二象限（$x < 0, y > 0$）：$\\theta = 180^\\circ - \\alpha$\n- 第三象限（$x < 0, y < 0$）：$\\theta = 180^\\circ + \\alpha$\n- 第四象限（$x > 0, y < 0$）：$\\theta = 360^\\circ - \\alpha$",
      ),
      generate(rng) {
        const k = rng.pick([1, 2, 3, 4, 5, 6]);
        const cases = [
          // Q2
          { vec: `\\langle -${k}, ${k} \\rangle`, theta: 135, quad: "II", ref: 45 },
          { vec: `\\langle -${k}\\sqrt{3}, ${k} \\rangle`, theta: 150, quad: "II", ref: 30 },
          { vec: `\\langle -${k}, ${k}\\sqrt{3} \\rangle`, theta: 120, quad: "II", ref: 60 },
          { vec: `\\langle -${k}, 0 \\rangle`, theta: 180, quad: "negative x-axis", ref: 0 },
          // Q3
          { vec: `\\langle -${k}, -${k} \\rangle`, theta: 225, quad: "III", ref: 45 },
          { vec: `\\langle -${k}\\sqrt{3}, -${k} \\rangle`, theta: 210, quad: "III", ref: 30 },
          { vec: `\\langle -${k}, -${k}\\sqrt{3} \\rangle`, theta: 240, quad: "III", ref: 60 },
          { vec: `\\langle 0, -${k} \\rangle`, theta: 270, quad: "negative y-axis", ref: 0 },
          // Q4
          { vec: `\\langle ${k}, -${k} \\rangle`, theta: 315, quad: "IV", ref: 45 },
          { vec: `\\langle ${k}\\sqrt{3}, -${k} \\rangle`, theta: 330, quad: "IV", ref: 30 },
          { vec: `\\langle ${k}, -${k}\\sqrt{3} \\rangle`, theta: 300, quad: "IV", ref: 60 },
        ];
        const pick = rng.pick(cases);
        const { vec, theta, quad, ref } = pick;

        const wrongAngles = [(theta + 180) % 360, ref, (360 - theta + 360) % 360, (theta + 90) % 360]
          .filter((a) => a !== theta)
          .slice(0, 3);

        return oneOf(
          rng,
          t(
            `Find the direction angle $\\theta \\in [0^\\circ, 360^\\circ)$ of the vector $\\mathbf{v} = ${vec}$.`,
            `求向量 $\\mathbf{v} = ${vec}$ 的方向角 $\\theta \\in [0^\\circ, 360^\\circ)$。`,
          ),
          t(`$\\theta = ${theta}^\\circ$`, `$\\theta = ${theta}^\\circ$`),
          wrongAngles.map((w) => t(`$\\theta = ${w}^\\circ$`, `$\\theta = ${w}^\\circ$`)),
          t(
            `The vector terminates in ${quad}. With reference angle $\\alpha = ${ref}^\\circ$, the standard direction angle is $\\theta = ${theta}^\\circ$.`,
            `该向量位于 ${quad}。参考角为 $\\alpha = ${ref}^\\circ$，因此标准方向角为 $\\theta = ${theta}^\\circ$。`,
          ),
        );
      },
    },
  ],
};

// ─── 5.17.5 Calculating the Components of Cartesian Vectors in 2D ───────────

/** calculatingTheComponentsOfCartesianVectorsIn2d covers resolving magnitude and angle into components. */
export const calculatingTheComponentsOfCartesianVectorsIn2d: TopicDef = {
  id: "calculating-the-components-of-cartesian-vectors-in-2d",
  title: t("Calculating the Components of Cartesian Vectors in 2D", "由模长与方向角计算二维平面向量的分量"),
  summary: t(
    "Find the horizontal and vertical components of a 2D vector given its magnitude and direction angle using trigonometry.",
    "利用三角函数，根据二维向量的模长与方向角求解其水平与垂直坐标分量。",
  ),
  prerequisites: ["calculating-the-direction-of-cartesian-vectors-in-2d"],
  encompasses: [{ topic: "calculating-the-direction-of-cartesian-vectors-in-2d", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSN.VM.A.1", "CCSS.HSN.VM.A.2"],
  knowledgePoints: [
    {
      id: "components-from-magnitude-and-angle-special",
      title: t("Compute components for special angles", "特殊方向角的向量坐标分量计算"),
      explanation: t(
        "Given magnitude $\\|\\mathbf{v}\\| = r$ and direction angle $\\theta$, the components are given by:\n\n$$x = r\\cos\\theta,\\quad y = r\\sin\\theta$$\n\nso $\\mathbf{v} = \\langle r\\cos\\theta,\\, r\\sin\\theta \\rangle$.",
        "已知模长 $\\|\\mathbf{v}\\| = r$ 与方向角 $\\theta$，坐标分量由下列公式给出：\n\n$$x = r\\cos\\theta,\\quad y = r\\sin\\theta$$\n\n即 $\\mathbf{v} = \\langle r\\cos\\theta,\\, r\\sin\\theta \\rangle$。",
      ),
      generate(rng) {
        const r = rng.pick([2, 4, 6, 8, 10, 12]);
        const h = r / 2;
        const angleData = [
          { deg: 0, x: `${r}`, y: "0" },
          { deg: 30, x: `${h}\\sqrt{3}`, y: `${h}` },
          { deg: 60, x: `${h}`, y: `${h}\\sqrt{3}` },
          { deg: 90, x: "0", y: `${r}` },
          { deg: 120, x: `-${h}`, y: `${h}\\sqrt{3}` },
          { deg: 150, x: `-${h}\\sqrt{3}`, y: `${h}` },
          { deg: 180, x: `-${r}`, y: "0" },
          { deg: 210, x: `-${h}\\sqrt{3}`, y: `-${h}` },
          { deg: 240, x: `-${h}`, y: `-${h}\\sqrt{3}` },
          { deg: 270, x: "0", y: `-${r}` },
          { deg: 300, x: `${h}`, y: `-${h}\\sqrt{3}` },
          { deg: 330, x: `${h}\\sqrt{3}`, y: `-${h}` },
        ];
        const item = rng.pick(angleData);
        const ans = `\\langle ${item.x}, ${item.y} \\rangle`;
        const wrong1 = `\\langle ${item.y}, ${item.x} \\rangle`;
        const wrong2 = `\\langle -${item.x.replace(/^--/, "")}, ${item.y} \\rangle`;
        const wrong3 = `\\langle ${r}, ${item.deg} \\rangle`;

        return oneOf(
          rng,
          t(
            `A vector $\\mathbf{v}$ has magnitude $\\|\\mathbf{v}\\| = ${r}$ and direction angle $\\theta = ${item.deg}^\\circ$. Find its component form $\\langle x, y \\rangle$.`,
            `向量 $\\mathbf{v}$ 的模长为 $\\|\\mathbf{v}\\| = ${r}$，方向角为 $\\theta = ${item.deg}^\\circ$。求其坐标分量形式 $\\langle x, y \\rangle$。`,
          ),
          t(`$${ans}$`, `$${ans}$`),
          [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
          t(
            `Using $x = ${r}\\cos(${item.deg}^\\circ) = ${item.x}$ and $y = ${r}\\sin(${item.deg}^\\circ) = ${item.y}$, the component form is $${ans}$.`,
            `利用 $x = ${r}\\cos(${item.deg}^\\circ) = ${item.x}$ 和 $y = ${r}\\sin(${item.deg}^\\circ) = ${item.y}$，得坐标分量形式为 $${ans}$。`,
          ),
        );
      },
    },
    {
      id: "components-from-magnitude-and-angle-general",
      title: t("Express vector in terms of standard basis given magnitude and direction", "由模长和方向角用基底向量表示向量"),
      explanation: t(
        "A vector with magnitude $r$ and direction $\\theta$ can be expressed in terms of standard unit basis vectors $\\mathbf{i}$ and $\\mathbf{j}$:\n\n$$\\mathbf{v} = (r\\cos\\theta)\\mathbf{i} + (r\\sin\\theta)\\mathbf{j}$$",
        "模长为 $r$、方向角为 $\\theta$ 的向量可用标准单位基底向量 $\\mathbf{i}$ 和 $\\mathbf{j}$ 表示为：\n\n$$\\mathbf{v} = (r\\cos\\theta)\\mathbf{i} + (r\\sin\\theta)\\mathbf{j}$$",
      ),
      generate(rng) {
        const r = rng.pick([2, 4, 6, 8, 10, 12]);
        const h = r / 2;
        const vName = rng.pick(["\\mathbf{v}", "\\mathbf{u}", "\\mathbf{w}", "\\mathbf{a}"]);
        const angleList = [
          { deg: 30, x: `${h}\\sqrt{3}`, y: `${h}` },
          { deg: 45, x: `${h}\\sqrt{2}`, y: `${h}\\sqrt{2}` },
          { deg: 60, x: `${h}`, y: `${h}\\sqrt{3}` },
          { deg: 120, x: `-${h}`, y: `${h}\\sqrt{3}` },
          { deg: 135, x: `-${h}\\sqrt{2}`, y: `${h}\\sqrt{2}` },
          { deg: 150, x: `-${h}\\sqrt{3}`, y: `${h}` },
          { deg: 210, x: `-${h}\\sqrt{3}`, y: `-${h}` },
          { deg: 225, x: `-${h}\\sqrt{2}`, y: `-${h}\\sqrt{2}` },
          { deg: 240, x: `-${h}`, y: `-${h}\\sqrt{3}` },
          { deg: 300, x: `${h}`, y: `-${h}\\sqrt{3}` },
          { deg: 315, x: `${h}\\sqrt{2}`, y: `-${h}\\sqrt{2}` },
          { deg: 330, x: `${h}\\sqrt{3}`, y: `-${h}` },
        ];
        const item = rng.pick(angleList);

        const xPart = item.x === "1" ? "" : item.x === "-1" ? "-" : item.x;
        const yPart = item.y.startsWith("-") ? `- ${item.y.slice(1) === "1" ? "" : item.y.slice(1)}` : `+ ${item.y === "1" ? "" : item.y}`;
        const ans = `${xPart}\\mathbf{i} ${yPart}\\mathbf{j}`;
        const wrong1 = `${item.y}\\mathbf{i} + ${item.x}\\mathbf{j}`;
        const wrong2 = `${item.x}\\mathbf{i} ${item.y.startsWith("-") ? `+ ${item.y.slice(1)}` : `- ${item.y}`}\\mathbf{j}`;
        const wrong3 = `${r}\\mathbf{i} + ${item.deg}\\mathbf{j}`;

        return oneOf(
          rng,
          t(
            `Express the vector $${vName}$ with magnitude $\\|${vName}\\| = ${r}$ and direction angle $\\theta = ${item.deg}^\\circ$ in terms of standard unit basis vectors $\\mathbf{i}$ and $\\mathbf{j}$.`,
            `已知向量 $${vName}$ 的模长为 $\\|${vName}\\| = ${r}$，方向角为 $\\theta = ${item.deg}^\\circ$，用标准单位基底向量 $\\mathbf{i}$ 和 $\\mathbf{j}$ 表示 $${vName}$。`,
          ),
          t(`$${ans}$`, `$${ans}$`),
          [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
          t(
            `Using $x = ${r}\\cos(${item.deg}^\\circ) = ${item.x}$ and $y = ${r}\\sin(${item.deg}^\\circ) = ${item.y}$, the basis form is $${vName} = ${ans}$.`,
            `由 $x = ${r}\\cos(${item.deg}^\\circ) = ${item.x}$ 与 $y = ${r}\\sin(${item.deg}^\\circ) = ${item.y}$，得基底形式为 $${vName} = ${ans}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 5.17.6 Velocity and Acceleration for Plane Motion ──────────────────────

/** velocityAndAccelerationForPlaneMotion covers speed and resultant velocities in modeling motion. */
export const velocityAndAccelerationForPlaneMotion: TopicDef = {
  id: "velocity-and-acceleration-for-plane-motion",
  title: t("Velocity and Acceleration for Plane Motion", "平面运动的速度与加速度向量"),
  summary: t(
    "Model planar motion using velocity and acceleration vectors, calculate speed as vector magnitude, and find resultant velocities.",
    "使用速度与加速度向量为平面运动建模，将速率计算为速度向量的模长，并求解合速度。",
  ),
  prerequisites: ["calculating-the-components-of-cartesian-vectors-in-2d"],
  encompasses: [{ topic: "calculating-the-components-of-cartesian-vectors-in-2d", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSN.VM.A.3"],
  knowledgePoints: [
    {
      id: "speed-as-magnitude-of-velocity",
      title: t("Calculate speed from velocity vector components", "由速度向量分量计算速率"),
      explanation: t(
        "Velocity is a vector quantity with magnitude and direction. **Speed** is the scalar magnitude of the velocity vector:\n\n$$\\text{speed} = \\|\\mathbf{v}\\| = \\sqrt{v_x^2 + v_y^2}$$",
        "速度是既有大小又有方向的向量。**速率**是速度向量的标量模长：\n\n$$\\text{速率} = \\|\\mathbf{v}\\| = \\sqrt{v_x^2 + v_y^2}$$",
      ),
      generate(rng) {
        const triples = [
          { vx: 30, vy: 40, speed: 50 },
          { vx: -30, vy: 40, speed: 50 },
          { vx: 30, vy: -40, speed: 50 },
          { vx: -30, vy: -40, speed: 50 },
          { vx: 40, vy: 30, speed: 50 },
          { vx: -40, vy: 30, speed: 50 },
          { vx: 50, vy: 120, speed: 130 },
          { vx: -50, vy: 120, speed: 130 },
          { vx: 50, vy: -120, speed: 130 },
          { vx: -50, vy: -120, speed: 130 },
          { vx: 120, vy: 50, speed: 130 },
          { vx: -120, vy: 50, speed: 130 },
          { vx: 60, vy: 80, speed: 100 },
          { vx: -60, vy: 80, speed: 100 },
          { vx: 80, vy: 60, speed: 100 },
          { vx: -80, vy: 60, speed: 100 },
          { vx: 70, vy: 240, speed: 250 },
          { vx: -70, vy: 240, speed: 250 },
          { vx: 240, vy: 70, speed: 250 },
          { vx: -80, vy: 150, speed: 170 },
          { vx: 80, vy: 150, speed: 170 },
          { vx: 150, vy: 80, speed: 170 },
          { vx: 90, vy: 120, speed: 150 },
          { vx: -90, vy: 120, speed: 150 },
          { vx: 120, vy: 90, speed: 150 },
          { vx: 120, vy: 160, speed: 200 },
          { vx: -120, vy: 160, speed: 200 },
          { vx: 160, vy: 120, speed: 200 },
        ];
        const item = rng.pick(triples);
        const { vx, vy, speed } = item;

        const wrong1 = speed + 20;
        const wrong2 = Math.abs(vx) + Math.abs(vy);
        const wrong3 = Math.round(speed * 0.8);

        return oneOf(
          rng,
          t(
            `An object moves in the coordinate plane with velocity vector $\\mathbf{v} = \\langle ${vx}, ${vy} \\rangle\\text{ m/s}$. Find its speed.`,
            `一物体在坐标平面内运动，其速度向量为 $\\mathbf{v} = \\langle ${vx}, ${vy} \\rangle\\text{ m/s}$。求该物体的速率。`,
          ),
          t(`$${speed}\\text{ m/s}$`, `$${speed}\\text{ m/s}$`),
          [
            t(`$${wrong1}\\text{ m/s}$`, `$${wrong1}\\text{ m/s}$`),
            t(`$${wrong2}\\text{ m/s}$`, `$${wrong2}\\text{ m/s}$`),
            t(`$${wrong3}\\text{ m/s}$`, `$${wrong3}\\text{ m/s}$`),
          ],
          t(
            `Speed is the magnitude of the velocity vector: $\\|\\mathbf{v}\\| = \\sqrt{(${vx})^2 + (${vy})^2} = \\sqrt{${vx * vx + vy * vy}} = ${speed}\\text{ m/s}$.`,
            `速率是速度向量的模长：$\\|\\mathbf{v}\\| = \\sqrt{(${vx})^2 + (${vy})^2} = \\sqrt{${vx * vx + vy * vy}} = ${speed}\\text{ m/s}$。`,
          ),
        );
      },
    },
    {
      id: "resultant-velocity-plane",
      title: t("Calculate resultant velocity in two dimensions", "计算二维平面中的合速度"),
      explanation: t(
        "When an object moves through a moving medium (such as an aircraft in a wind current or a boat across a flowing river), the **resultant velocity** is the vector sum:\n\n$$\\mathbf{v}_{\\text{resultant}} = \\mathbf{v}_{\\text{object}} + \\mathbf{v}_{\\text{medium}}$$",
        "当物体在流动的介质中运动时（如飞机在风中飞行或小船在水流中航行），其**合速度**为各分速度的向量和：\n\n$$\\mathbf{v}_{\\text{合}} = \\mathbf{v}_{\\text{自身}} + \\mathbf{v}_{\\text{介质}}$$",
      ),
      generate(rng) {
        const boatSpeed = rng.pick([12, 15, 18, 20, 24]);
        const currentSpeed = rng.pick([5, 8, 9, 10, 12]);

        const ans = `\\langle ${currentSpeed}, ${boatSpeed} \\rangle\\text{ km/h}`;
        const wrong1 = `\\langle ${boatSpeed}, ${currentSpeed} \\rangle\\text{ km/h}`;
        const wrong2 = `\\langle -${currentSpeed}, ${boatSpeed} \\rangle\\text{ km/h}`;
        const wrong3 = `\\langle ${currentSpeed + boatSpeed}, 0 \\rangle\\text{ km/h}`;

        return oneOf(
          rng,
          t(
            `A boat is heading due north across a river with a velocity of $${boatSpeed}\\text{ km/h}$ relative to the water ($\\mathbf{v}_{\\text{boat}} = \\langle 0, ${boatSpeed} \\rangle$). The river flows due east with a current velocity of $${currentSpeed}\\text{ km/h}$ ($\\mathbf{v}_{\\text{river}} = \\langle ${currentSpeed}, 0 \\rangle$). What is the boat's resultant velocity vector relative to the riverbank?`,
            `一艘小船相对于水面以 $${boatSpeed}\\text{ km/h}$ 的速度正北航行（$\\mathbf{v}_{\\text{船}} = \\langle 0, ${boatSpeed} \\rangle$）。河水以 $${currentSpeed}\\text{ km/h}$ 的流速向正东流动（$\\mathbf{v}_{\\text{水}} = \\langle ${currentSpeed}, 0 \\rangle$）。小船相对于河岸的合速度向量是多少？`,
          ),
          t(`$${ans}$`, `$${ans}$`),
          [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
          t(
            `Add the velocity vectors: $\\mathbf{v}_{\\text{resultant}} = \\langle 0, ${boatSpeed} \\rangle + \\langle ${currentSpeed}, 0 \\rangle = ${ans}$.`,
            `相加各速度向量：$\\mathbf{v}_{\\text{合}} = \\langle 0, ${boatSpeed} \\rangle + \\langle ${currentSpeed}, 0 \\rangle = ${ans}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 5.17.7 Calculating Displacement for Plane Motion ───────────────────────

/** calculatingDisplacementForPlaneMotion covers s = vt and multi-stage journeys. */
export const calculatingDisplacementForPlaneMotion: TopicDef = {
  id: "calculating-displacement-for-plane-motion",
  title: t("Calculating Displacement for Plane Motion", "平面运动的位移向量计算"),
  summary: t(
    "Calculate displacement vectors for planar motion using s = vt, sum successive displacements, and find net distance from the origin.",
    "利用 s = vt 计算平面运动的位移向量，求多段连续位移的合位移，并计算距起点的直线距离。",
  ),
  prerequisites: ["velocity-and-acceleration-for-plane-motion"],
  encompasses: [{ topic: "velocity-and-acceleration-for-plane-motion", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSN.VM.A.3"],
  knowledgePoints: [
    {
      id: "displacement-from-constant-velocity",
      title: t("Calculate displacement vector from velocity and time", "由速度与时间计算位移向量"),
      explanation: t(
        "For an object moving with constant velocity vector $\\mathbf{v} = \\langle v_x, v_y \\rangle$, the displacement vector $\\vec{s}$ over a time interval $t$ is given by scalar multiplication:\n\n$$\\vec{s} = \\mathbf{v}t = \\langle v_x t,\\, v_y t \\rangle$$",
        "以恒定速度向量 $\\mathbf{v} = \\langle v_x, v_y \\rangle$ 运动的物体，在时间间隔 $t$ 内的位移向量 $\\vec{s}$ 由标量乘法给出：\n\n$$\\vec{s} = \\mathbf{v}t = \\langle v_x t,\\, v_y t \\rangle$$",
      ),
      generate(rng) {
        const vx = rng.pick([-15, -12, -8, -5, 6, 8, 10, 12, 15, 20]);
        const vy = rng.pick([-20, -10, -5, 5, 8, 12, 16, 20, 25]);
        const tVal = rng.pick([2, 3, 4, 5, 6]);

        const sx = vx * tVal;
        const sy = vy * tVal;

        const ans = `\\langle ${sx}, ${sy} \\rangle\\text{ m}`;
        const wrong1 = `\\langle ${sx + tVal}, ${sy} \\rangle\\text{ m}`;
        const wrong2 = `\\langle ${vx}, ${vy} \\rangle\\text{ m}`;
        const wrong3 = `\\langle ${sy}, ${sx} \\rangle\\text{ m}`;

        return oneOf(
          rng,
          t(
            `A particle moves with constant velocity $\\mathbf{v} = \\langle ${vx}, ${vy} \\rangle\\text{ m/s}$ for $t = ${tVal}\\text{ s}$. Find its total displacement vector $\\vec{s}$.`,
            `一质点以恒定速度 $\\mathbf{v} = \\langle ${vx}, ${vy} \\rangle\\text{ m/s}$ 运动了 $t = ${tVal}\\text{ s}$。求其总位移向量 $\\vec{s}$。`,
          ),
          t(`$${ans}$`, `$${ans}$`),
          [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
          t(
            `Multiply velocity by time: $\\vec{s} = \\mathbf{v}t = \\langle (${vx})(${tVal}),\\, (${vy})(${tVal}) \\rangle = ${ans}$.`,
            `速度乘以时间：$\\vec{s} = \\mathbf{v}t = \\langle (${vx})(${tVal}),\\, (${vy})(${tVal}) \\rangle = ${ans}$。`,
          ),
        );
      },
    },
    {
      id: "total-displacement-and-distance",
      title: t("Net displacement and straight-line distance for multi-leg journeys", "多段旅程的合位移与直线距离"),
      explanation: t(
        "For an object undergoing consecutive displacements $\\vec{s}_1$ and $\\vec{s}_2$:\n\n- The **net displacement vector** is $\\vec{s}_{\\text{net}} = \\vec{s}_1 + \\vec{s}_2 = \\langle x_1 + x_2,\\, y_1 + y_2 \\rangle$\n- The **straight-line distance** from the starting point is the magnitude $\\|\\vec{s}_{\\text{net}}\\| = \\sqrt{(x_1+x_2)^2 + (y_1+y_2)^2}$",
        "对于连续经历两段位移 $\\vec{s}_1$ 和 $\\vec{s}_2$ 的物体：\n\n- **合位移向量**为 $\\vec{s}_{\\text{合}} = \\vec{s}_1 + \\vec{s}_2 = \\langle x_1 + x_2,\\, y_1 + y_2 \\rangle$\n- 距起点的**直线距离**为其模长 $\\|\\vec{s}_{\\text{合}}\\| = \\sqrt{(x_1+x_2)^2 + (y_1+y_2)^2}$",
      ),
      generate(rng) {
        const scenarios = [
          { x1: 2, y1: 1, x2: 1, y2: 3, tx: 3, ty: 4, dist: 5 },
          { x1: -1, y1: 2, x2: 4, y2: 2, tx: 3, ty: 4, dist: 5 },
          { x1: 1, y1: -2, x2: 5, y2: 10, tx: 6, ty: 8, dist: 10 },
          { x1: 4, y1: 3, x2: 2, y2: 5, tx: 6, ty: 8, dist: 10 },
          { x1: 3, y1: 7, x2: 2, y2: 5, tx: 5, ty: 12, dist: 13 },
          { x1: -2, y1: 5, x2: 7, y2: 7, tx: 5, ty: 12, dist: 13 },
          { x1: 1, y1: 4, x2: 4, y2: 8, tx: 5, ty: 12, dist: 13 },
          { x1: -2, y1: 4, x2: 10, y2: 11, tx: 8, ty: 15, dist: 17 },
          { x1: 3, y1: 8, x2: 5, y2: 7, tx: 8, ty: 15, dist: 17 },
          { x1: 4, y1: 9, x2: 3, y2: 15, tx: 7, ty: 24, dist: 25 },
          { x1: 2, y1: 10, x2: 5, y2: 14, tx: 7, ty: 24, dist: 25 },
          { x1: 5, y1: 2, x2: 4, y2: 10, tx: 9, ty: 12, dist: 15 },
          { x1: 6, y1: 4, x2: 3, y2: 8, tx: 9, ty: 12, dist: 15 },
          { x1: 10, y1: 5, x2: 2, y2: 11, tx: 12, ty: 16, dist: 20 },
          { x1: 7, y1: 8, x2: 5, y2: 8, tx: 12, ty: 16, dist: 20 },
          { x1: -1, y1: 3, x2: 4, y2: 1, tx: 3, ty: 4, dist: 5 },
          { x1: 6, y1: 2, x2: -1, y2: 10, tx: 5, ty: 12, dist: 13 },
          { x1: 2, y1: 5, x2: 6, y2: 10, tx: 8, ty: 15, dist: 17 },
          { x1: 3, y1: 1, x2: 1, y2: 2, tx: 4, ty: 3, dist: 5 },
          { x1: 5, y1: -1, x2: -1, y2: 4, tx: 4, ty: 3, dist: 5 },
          { x1: 2, y1: 2, x2: 6, y2: 4, tx: 8, ty: 6, dist: 10 },
          { x1: 7, y1: 1, x2: 1, y2: 5, tx: 8, ty: 6, dist: 10 },
          { x1: 8, y1: 3, x2: 4, y2: 2, tx: 12, ty: 5, dist: 13 },
          { x1: 9, y1: -2, x2: 3, y2: 7, tx: 12, ty: 5, dist: 13 },
          { x1: 10, y1: 4, x2: 5, y2: 4, tx: 15, ty: 8, dist: 17 },
          { x1: 12, y1: 10, x2: 8, y2: 5, tx: 20, ty: 15, dist: 25 },
          { x1: 11, y1: 6, x2: 9, y2: 9, tx: 20, ty: 15, dist: 25 },
        ];
        const item = rng.pick(scenarios);
        const { x1, y1, x2, y2, tx, ty, dist } = item;

        const wrong1 = dist + 2;
        const wrong2 = Math.abs(tx) + Math.abs(ty);
        const wrong3 = dist * 2;

        return oneOf(
          rng,
          t(
            `A hiker travels displacement $\\vec{s}_1 = \\langle ${x1}, ${y1} \\rangle\\text{ km}$ on the first day, and displacement $\\vec{s}_2 = \\langle ${x2}, ${y2} \\rangle\\text{ km}$ on the second day. What is the hiker's net straight-line distance from the starting position?`,
            `一名徒步旅行者第一天的位移为 $\\vec{s}_1 = \\langle ${x1}, ${y1} \\rangle\\text{ km}$，第二天的位移为 $\\vec{s}_2 = \\langle ${x2}, ${y2} \\rangle\\text{ km}$。求该旅行者距离起点的直线距离。`,
          ),
          t(`$${dist}\\text{ km}$`, `$${dist}\\text{ km}$`),
          [
            t(`$${wrong1}\\text{ km}$`, `$${wrong1}\\text{ km}$`),
            t(`$${wrong2}\\text{ km}$`, `$${wrong2}\\text{ km}$`),
            t(`$${wrong3}\\text{ km}$`, `$${wrong3}\\text{ km}$`),
          ],
          t(
            `The total displacement vector is $\\vec{s}_{\\text{net}} = \\langle ${x1} + ${x2},\\, ${y1} + ${y2} \\rangle = \\langle ${tx}, ${ty} \\rangle\\text{ km}$. The straight-line distance is its magnitude: $\\|\\vec{s}_{\\text{net}}\\| = \\sqrt{(${tx})^2 + (${ty})^2} = ${dist}\\text{ km}$.`,
            `总位移向量为 $\\vec{s}_{\\text{合}} = \\langle ${x1} + ${x2},\\, ${y1} + ${y2} \\rangle = \\langle ${tx}, ${ty} \\rangle\\text{ km}$。直线距离为其模长：$\\|\\vec{s}_{\\text{合}}\\| = \\sqrt{(${tx})^2 + (${ty})^2} = ${dist}\\text{ km}$。`,
          ),
        );
      },
    },
  ],
};

// ─── Module Export ──────────────────────────────────────────────────────────

/** precalculusVector2DTopics contains all 15 topics in Modules 5.16 and 5.17. */
export const precalculusVector2DTopics: readonly TopicDef[] = [
  introductionToVectors,
  theTriangleLawForTheAdditionOfTwoVectors,
  theMagnitudeOfAVector,
  problemSolvingUsingVectorDiagrams,
  parallelVectors,
  unitVectors,
  linearCombinationsOfVectorsAndTheirProperties,
  describingThePositionVectorOfAPointUsingKnownVectors,
  twoDimensionalVectorsExpressedInComponentForm,
  additionAndScalarMultiplicationOfCartesianVectorsIn2d,
  calculatingTheMagnitudeOfCartesianVectorsIn2d,
  calculatingTheDirectionOfCartesianVectorsIn2d,
  calculatingTheComponentsOfCartesianVectorsIn2d,
  velocityAndAccelerationForPlaneMotion,
  calculatingDisplacementForPlaneMotion,
];
